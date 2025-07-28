/**
 * Quality Manager Hook
 * Manages video quality levels and adaptive bitrate streaming
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

// Quality level interfaces
interface QualityLevel {
  id: string;
  label: string;
  height: number;
  bitrate: number;
  bandwidth: number;
  framerate?: number;
  codec?: string;
  isAuto?: boolean;
}

interface QualityMetrics {
  currentQuality: QualityLevel | null;
  availableQualities: QualityLevel[];
  isAutoMode: boolean;
  bufferHealth: number;
  droppedFrames: number;
  bandwidthEstimate: number;
  adaptationHistory: Array<{
    timestamp: number;
    from: string;
    to: string;
    reason: string;
  }>;
}

interface QualityManagerConfig {
  enableAdaptiveBitrate: boolean;
  maxBitrate?: number;
  minBitrate?: number;
  bufferThresholds: {
    low: number;
    high: number;
    critical: number;
  };
  adaptationRules: {
    upscaleThreshold: number;
    downscaleThreshold: number;
    stabilityWindow: number;
  };
  qualityPreference: 'bandwidth' | 'quality' | 'balanced';
}

const defaultConfig: QualityManagerConfig = {
  enableAdaptiveBitrate: true,
  bufferThresholds: {
    low: 10, // seconds
    high: 30,
    critical: 5
  },
  adaptationRules: {
    upscaleThreshold: 0.8, // bandwidth utilization
    downscaleThreshold: 0.95,
    stabilityWindow: 5000 // ms
  },
  qualityPreference: 'balanced'
};

export function useQualityManager(
  videoElement: HTMLVideoElement | null,
  config: Partial<QualityManagerConfig> = {}
) {
  const fullConfig = { ...defaultConfig, ...config };
  
  const [metrics, setMetrics] = useState<QualityMetrics>({
    currentQuality: null,
    availableQualities: [],
    isAutoMode: true,
    bufferHealth: 100,
    droppedFrames: 0,
    bandwidthEstimate: 0,
    adaptationHistory: []
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Refs for tracking
  const adaptationTimer = useRef<NodeJS.Timeout | null>(null);
  const bandwidthMonitor = useRef<NodeJS.Timeout | null>(null);
  const qualityChangeTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastAdaptation = useRef<number>(0);
  const downloadMonitor = useRef<{
    startTime: number;
    bytesLoaded: number;
  } | null>(null);

  // Get available quality levels from video source
  const detectAvailableQualities = useCallback((): QualityLevel[] => {
    if (!videoElement) return [];

    const qualities: QualityLevel[] = [
      {
        id: 'auto',
        label: 'Auto',
        height: 0,
        bitrate: 0,
        bandwidth: 0,
        isAuto: true
      }
    ];

    // Check for HLS.js instance
    const hlsInstance = (videoElement as any).hls;
    if (hlsInstance && hlsInstance.levels) {
      hlsInstance.levels.forEach((level: any, index: number) => {
        qualities.push({
          id: `${index}`,
          label: `${level.height}p`,
          height: level.height,
          bitrate: level.bitrate,
          bandwidth: level.bandwidth || level.bitrate,
          framerate: level.frameRate,
          codec: level.codecs
        });
      });
    }

    // Check for native video qualities (if available)
    const videoWithTracks = videoElement as any;
    if (videoWithTracks.videoTracks) {
      Array.from(videoWithTracks.videoTracks).forEach((track: any, index: number) => {
        const settings = track.getSettings?.();
        if (settings) {
          qualities.push({
            id: `native-${index}`,
            label: `${settings.height}p`,
            height: settings.height || 720,
            bitrate: 0, // Not available for native tracks
            bandwidth: 0,
            framerate: settings.frameRate
          });
        }
      });
    }

    // Fallback quality levels if none detected
    if (qualities.length === 1) {
      const fallbackQualities = [
        { id: '240p', label: '240p', height: 240, bitrate: 400000, bandwidth: 500000 },
        { id: '360p', label: '360p', height: 360, bitrate: 800000, bandwidth: 1000000 },
        { id: '480p', label: '480p', height: 480, bitrate: 1200000, bandwidth: 1500000 },
        { id: '720p', label: '720p', height: 720, bitrate: 2500000, bandwidth: 3000000 },
        { id: '1080p', label: '1080p', height: 1080, bitrate: 5000000, bandwidth: 6000000 }
      ];
      qualities.push(...fallbackQualities);
    }

    return qualities.sort((a, b) => b.height - a.height);
  }, [videoElement]);

  // Estimate current bandwidth
  const estimateBandwidth = useCallback((): number => {
    if (!videoElement) return 0;

    // Use Network Information API if available
    const navigator = window.navigator as any;
    if (navigator.connection?.downlink) {
      return navigator.connection.downlink * 1000000; // Convert Mbps to bps
    }

    // Fallback: estimate from buffer load times
    if (downloadMonitor.current) {
      const elapsed = Date.now() - downloadMonitor.current.startTime;
      const bytesPerSecond = (downloadMonitor.current.bytesLoaded * 8) / (elapsed / 1000);
      return bytesPerSecond || 0;
    }

    return 0;
  }, [videoElement]);

  // Calculate buffer health
  const calculateBufferHealth = useCallback((): number => {
    if (!videoElement) return 0;

    try {
      const buffered = videoElement.buffered;
      const currentTime = videoElement.currentTime;
      
      if (buffered.length === 0) return 0;

      // Find the buffered range that contains current time
      for (let i = 0; i < buffered.length; i++) {
        const start = buffered.start(i);
        const end = buffered.end(i);
        
        if (currentTime >= start && currentTime <= end) {
          const bufferAhead = end - currentTime;
          const healthPercentage = Math.min((bufferAhead / fullConfig.bufferThresholds.high) * 100, 100);
          return Math.max(healthPercentage, 0);
        }
      }

      return 0;
    } catch (error) {
      return 0;
    }
  }, [videoElement, fullConfig.bufferThresholds.high]);

  // Get dropped frames count
  const getDroppedFrames = useCallback((): number => {
    if (!videoElement) return 0;

    // Use media element properties if available
    const quality = (videoElement as any).getVideoPlaybackQuality?.();
    return quality?.droppedVideoFrames || 0;
  }, [videoElement]);

  // Set quality level
  const setQuality = useCallback(async (qualityId: string): Promise<void> => {
    if (!videoElement) return;

    try {
      setIsLoading(true);
      setError(null);

      const targetQuality = metrics.availableQualities.find(q => q.id === qualityId);
      if (!targetQuality) {
        throw new Error(`Quality level ${qualityId} not found`);
      }

      // Handle auto quality
      if (targetQuality.isAuto) {
        setMetrics(prev => ({ ...prev, isAutoMode: true }));
        
        // Enable auto mode for HLS.js
        const hlsInstance = (videoElement as any).hls;
        if (hlsInstance) {
          hlsInstance.currentLevel = -1; // Auto mode
        }
        
        return;
      }

      // Set manual quality
      setMetrics(prev => ({ ...prev, isAutoMode: false }));

      // Set quality for HLS.js
      const hlsInstance = (videoElement as any).hls;
      if (hlsInstance) {
        const levelIndex = parseInt(qualityId, 10);
        if (!isNaN(levelIndex) && hlsInstance.levels[levelIndex]) {
          hlsInstance.currentLevel = levelIndex;
        }
      }

      // Set quality for native video (if supported)
      else {
        const videoWithTracks = videoElement as any;
        if (videoWithTracks.videoTracks) {
          Array.from(videoWithTracks.videoTracks).forEach((track: any, index: number) => {
            track.selected = `native-${index}` === qualityId;
          });
        }
      }

      // Update current quality
      setMetrics(prev => ({
        ...prev,
        currentQuality: targetQuality,
        adaptationHistory: [
          ...prev.adaptationHistory,
          {
            timestamp: Date.now(),
            from: prev.currentQuality?.id || 'unknown',
            to: qualityId,
            reason: 'manual'
          }
        ]
      }));

    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [videoElement, metrics.availableQualities]);

  // Automatic quality adaptation logic
  const adaptQuality = useCallback(() => {
    if (!videoElement || !metrics.isAutoMode || !fullConfig.enableAdaptiveBitrate) return;

    const now = Date.now();
    const timeSinceLastAdaptation = now - lastAdaptation.current;
    
    // Respect stability window
    if (timeSinceLastAdaptation < fullConfig.adaptationRules.stabilityWindow) return;

    const bufferHealth = calculateBufferHealth();
    const bandwidth = estimateBandwidth();
    const droppedFrames = getDroppedFrames();

    const { bufferThresholds, adaptationRules } = fullConfig;
    const availableQualities = metrics.availableQualities.filter(q => !q.isAuto);
    const currentQuality = metrics.currentQuality;

    if (!currentQuality || availableQualities.length === 0) return;

    let targetQuality: QualityLevel | null = null;
    let reason = '';

    // Critical buffer situation - immediately downscale
    if (bufferHealth < bufferThresholds.critical) {
      const lowerQualities = availableQualities.filter(q => q.bitrate < currentQuality.bitrate);
      targetQuality = lowerQualities[lowerQualities.length - 1]; // Lowest quality
      reason = 'critical-buffer';
    }
    
    // Low buffer or high dropped frames - downscale
    else if (
      bufferHealth < bufferThresholds.low || 
      droppedFrames > 5 ||
      (bandwidth > 0 && currentQuality.bandwidth > bandwidth * adaptationRules.downscaleThreshold)
    ) {
      const lowerQualities = availableQualities.filter(q => q.bitrate < currentQuality.bitrate);
      if (lowerQualities.length > 0) {
        targetQuality = lowerQualities[0]; // Next lower quality
        reason = bufferHealth < bufferThresholds.low ? 'low-buffer' : 
                droppedFrames > 5 ? 'dropped-frames' : 'bandwidth-constraint';
      }
    }
    
    // Good conditions - consider upscaling
    else if (
      bufferHealth > bufferThresholds.high && 
      droppedFrames === 0 &&
      bandwidth > 0 && 
      currentQuality.bandwidth < bandwidth * adaptationRules.upscaleThreshold
    ) {
      const higherQualities = availableQualities.filter(q => 
        q.bitrate > currentQuality.bitrate && 
        q.bandwidth <= bandwidth * adaptationRules.upscaleThreshold
      );
      if (higherQualities.length > 0) {
        targetQuality = higherQualities[higherQualities.length - 1]; // Highest feasible quality
        reason = 'bandwidth-available';
      }
    }

    // Apply quality change if needed
    if (targetQuality && targetQuality.id !== currentQuality.id) {
      lastAdaptation.current = now;
      setQuality(targetQuality.id).catch(console.error);
      
      console.log(`Quality adapted: ${currentQuality.label} → ${targetQuality.label} (${reason})`);
    }
  }, [
    videoElement, 
    metrics.isAutoMode, 
    metrics.availableQualities, 
    metrics.currentQuality,
    fullConfig,
    calculateBufferHealth,
    estimateBandwidth,
    getDroppedFrames,
    setQuality
  ]);

  // Toggle auto mode
  const toggleAutoMode = useCallback(async () => {
    const newAutoMode = !metrics.isAutoMode;
    
    if (newAutoMode) {
      await setQuality('auto');
    } else {
      // Set to current best quality based on bandwidth
      const bandwidth = estimateBandwidth();
      const suitableQualities = metrics.availableQualities.filter(q => 
        !q.isAuto && (bandwidth === 0 || q.bandwidth <= bandwidth)
      );
      
      if (suitableQualities.length > 0) {
        const bestQuality = suitableQualities[0]; // Highest quality within bandwidth
        await setQuality(bestQuality.id);
      }
    }
  }, [metrics.isAutoMode, metrics.availableQualities, estimateBandwidth, setQuality]);

  // Get quality recommendation based on current conditions
  const getQualityRecommendation = useCallback((): QualityLevel | null => {
    if (!videoElement) return null;

    const bandwidth = estimateBandwidth();
    const bufferHealth = calculateBufferHealth();
    const availableQualities = metrics.availableQualities.filter(q => !q.isAuto);

    if (availableQualities.length === 0) return null;

    // If bandwidth is unknown, recommend medium quality
    if (bandwidth === 0) {
      const mediumIndex = Math.floor(availableQualities.length / 2);
      return availableQualities[mediumIndex];
    }

    // Consider buffer health in recommendation
    const safetyFactor = bufferHealth > 50 ? 0.8 : 0.6;
    const targetBandwidth = bandwidth * safetyFactor;

    // Find the highest quality that fits within bandwidth
    const suitableQualities = availableQualities.filter(q => q.bandwidth <= targetBandwidth);
    return suitableQualities.length > 0 ? suitableQualities[0] : availableQualities[availableQualities.length - 1];
  }, [videoElement, estimateBandwidth, calculateBufferHealth, metrics.availableQualities]);

  // Update metrics periodically
  const updateMetrics = useCallback(() => {
    if (!videoElement) return;

    const newMetrics: Partial<QualityMetrics> = {
      bufferHealth: calculateBufferHealth(),
      droppedFrames: getDroppedFrames(),
      bandwidthEstimate: estimateBandwidth()
    };

    // Check if quality changed (for HLS.js)
    const hlsInstance = (videoElement as any).hls;
    if (hlsInstance && hlsInstance.levels) {
      const currentLevel = hlsInstance.currentLevel;
      if (currentLevel >= 0 && hlsInstance.levels[currentLevel]) {
        const level = hlsInstance.levels[currentLevel];
        const currentQuality: QualityLevel = {
          id: `${currentLevel}`,
          label: `${level.height}p`,
          height: level.height,
          bitrate: level.bitrate,
          bandwidth: level.bandwidth || level.bitrate,
          framerate: level.frameRate,
          codec: level.codecs
        };
        newMetrics.currentQuality = currentQuality;
      }
    }

    setMetrics(prev => ({ ...prev, ...newMetrics }));
  }, [videoElement, calculateBufferHealth, getDroppedFrames, estimateBandwidth]);

  // Initialize quality levels when video loads
  useEffect(() => {
    if (!videoElement) return;

    const handleLoadedMetadata = () => {
      const availableQualities = detectAvailableQualities();
      setMetrics(prev => ({
        ...prev,
        availableQualities,
        currentQuality: availableQualities.find(q => q.isAuto) || availableQualities[0] || null
      }));
    };

    const handleProgress = () => {
      // Track download progress for bandwidth estimation
      if (!downloadMonitor.current) {
        downloadMonitor.current = {
          startTime: Date.now(),
          bytesLoaded: 0
        };
      }

      try {
        const buffered = videoElement.buffered;
        if (buffered.length > 0) {
          // Estimate bytes loaded (rough calculation)
          const bufferedEnd = buffered.end(buffered.length - 1);
          const duration = videoElement.duration || 1;
          const estimatedBitrate = metrics.currentQuality?.bitrate || 2000000;
          downloadMonitor.current.bytesLoaded = (bufferedEnd / duration) * estimatedBitrate / 8;
        }
      } catch (error) {
        // Handle buffered range errors
      }
    };

    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.addEventListener('progress', handleProgress);

    // Trigger initial detection if metadata is already loaded
    if (videoElement.readyState >= 1) {
      handleLoadedMetadata();
    }

    return () => {
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.removeEventListener('progress', handleProgress);
    };
  }, [videoElement, detectAvailableQualities, metrics.currentQuality?.bitrate]);

  // Start monitoring and adaptation
  useEffect(() => {
    if (!videoElement || !fullConfig.enableAdaptiveBitrate) return;

    // Update metrics every 2 seconds
    const metricsInterval = setInterval(updateMetrics, 2000);

    // Run adaptation logic every 5 seconds
    adaptationTimer.current = setInterval(adaptQuality, 5000);

    return () => {
      clearInterval(metricsInterval);
      if (adaptationTimer.current) {
        clearInterval(adaptationTimer.current);
      }
    };
  }, [videoElement, fullConfig.enableAdaptiveBitrate, updateMetrics, adaptQuality]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (adaptationTimer.current) clearInterval(adaptationTimer.current);
      if (bandwidthMonitor.current) clearInterval(bandwidthMonitor.current);
      if (qualityChangeTimeout.current) clearTimeout(qualityChangeTimeout.current);
    };
  }, []);

  return {
    // Current state
    metrics,
    isLoading,
    error,
    
    // Actions
    setQuality,
    toggleAutoMode,
    
    // Utilities
    getQualityRecommendation,
    estimateBandwidth,
    
    // Configuration
    config: fullConfig
  };
}
