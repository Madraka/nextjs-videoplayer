/**
 * Smart Quality Hook
 * Intelligent quality adaptation based on network, device, and content analysis
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

// Smart quality interfaces
interface QualityProfile {
  id: string;
  label: string;
  width: number;
  height: number;
  bitrate: number;
  framerate: number;
  codec: string;
  bandwidth: number; // minimum required bandwidth
  score: number; // quality score (0-100)
}

interface DeviceCapabilities {
  maxResolution: { width: number; height: number };
  maxBitrate: number;
  supportedCodecs: string[];
  cpuBenchmark: number;
  memoryGB: number;
  batteryLevel?: number;
  isLowPowerMode: boolean;
  connectionType: 'wifi' | 'cellular' | 'ethernet' | 'unknown';
}

interface NetworkConditions {
  bandwidth: number; // Mbps
  latency: number; // ms
  packetLoss: number; // percentage
  stability: number; // 0-1 score
  isMetered: boolean;
  effectiveBandwidth: number; // adjusted for stability
}

interface ContentCharacteristics {
  complexity: number; // 0-1 score based on motion, detail
  sceneChanges: number; // per minute
  motionLevel: 'low' | 'medium' | 'high';
  compressionEfficiency: number; // how well it compresses
  priorityLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface QualityDecision {
  selectedProfile: QualityProfile;
  reason: string;
  confidence: number; // 0-1
  alternatives: QualityProfile[];
  adaptationHistory: QualityChange[];
}

interface QualityChange {
  timestamp: number;
  fromProfile: QualityProfile | null;
  toProfile: QualityProfile;
  reason: string;
  trigger: 'bandwidth' | 'device' | 'content' | 'user' | 'buffer';
  success: boolean;
}

interface SmartQualityConfig {
  enableAdaptation: boolean;
  adaptationInterval: number; // ms
  minAdaptationInterval: number; // ms - prevent rapid changes
  bandwidthBufferFactor: number; // multiply bandwidth by this for safety
  qualityStepLimit: number; // max quality levels to jump
  enablePredictiveAdaptation: boolean;
  enableContentAwareAdaptation: boolean;
  enableDeviceAwareAdaptation: boolean;
  batteryOptimization: boolean;
  dataUsageOptimization: boolean;
  userPreferenceWeight: number; // 0-1, how much to consider user prefs
}

const defaultConfig: SmartQualityConfig = {
  enableAdaptation: true,
  adaptationInterval: 2000,
  minAdaptationInterval: 5000,
  bandwidthBufferFactor: 0.8,
  qualityStepLimit: 2,
  enablePredictiveAdaptation: true,
  enableContentAwareAdaptation: true,
  enableDeviceAwareAdaptation: true,
  batteryOptimization: true,
  dataUsageOptimization: true,
  userPreferenceWeight: 0.3
};

const defaultProfiles: QualityProfile[] = [
  {
    id: 'ultra-low',
    label: 'Ultra Low (144p)',
    width: 256,
    height: 144,
    bitrate: 200,
    framerate: 15,
    codec: 'h264',
    bandwidth: 0.3,
    score: 10
  },
  {
    id: 'low',
    label: 'Low (240p)',
    width: 426,
    height: 240,
    bitrate: 400,
    framerate: 24,
    codec: 'h264',
    bandwidth: 0.6,
    score: 25
  },
  {
    id: 'medium',
    label: 'Medium (360p)',
    width: 640,
    height: 360,
    bitrate: 800,
    framerate: 30,
    codec: 'h264',
    bandwidth: 1.2,
    score: 45
  },
  {
    id: 'standard',
    label: 'Standard (480p)',
    width: 854,
    height: 480,
    bitrate: 1500,
    framerate: 30,
    codec: 'h264',
    bandwidth: 2.0,
    score: 60
  },
  {
    id: 'high',
    label: 'High (720p)',
    width: 1280,
    height: 720,
    bitrate: 3000,
    framerate: 30,
    codec: 'h264',
    bandwidth: 4.0,
    score: 80
  },
  {
    id: 'full-hd',
    label: 'Full HD (1080p)',
    width: 1920,
    height: 1080,
    bitrate: 6000,
    framerate: 30,
    codec: 'h264',
    bandwidth: 8.0,
    score: 95
  },
  {
    id: 'ultra-hd',
    label: 'Ultra HD (4K)',
    width: 3840,
    height: 2160,
    bitrate: 15000,
    framerate: 30,
    codec: 'h265',
    bandwidth: 20.0,
    score: 100
  }
];

export function useSmartQuality(
  videoElement: HTMLVideoElement | null,
  availableProfiles: QualityProfile[] = defaultProfiles,
  config: Partial<SmartQualityConfig> = {}
) {
  const fullConfig = { ...defaultConfig, ...config };
  
  const [currentProfile, setCurrentProfile] = useState<QualityProfile | null>(null);
  const [availableQualities, setAvailableQualities] = useState<QualityProfile[]>(availableProfiles);
  const [decision, setDecision] = useState<QualityDecision | null>(null);
  const [isAdapting, setIsAdapting] = useState(false);
  const [adaptationHistory, setAdaptationHistory] = useState<QualityChange[]>([]);
  const [deviceCapabilities, setDeviceCapabilities] = useState<DeviceCapabilities | null>(null);
  const [networkConditions, setNetworkConditions] = useState<NetworkConditions | null>(null);
  const [contentCharacteristics, setContentCharacteristics] = useState<ContentCharacteristics | null>(null);

  // Refs for tracking
  const lastAdaptationTime = useRef<number>(0);
  const adaptationInterval = useRef<NodeJS.Timeout | null>(null);
  const bandwidthHistory = useRef<number[]>([]);
  const bufferHealthHistory = useRef<number[]>([]);

  // Detect device capabilities
  const detectDeviceCapabilities = useCallback(async (): Promise<DeviceCapabilities> => {
    const capabilities: DeviceCapabilities = {
      maxResolution: { width: 1920, height: 1080 }, // Default
      maxBitrate: 10000, // Default 10 Mbps
      supportedCodecs: ['h264'],
      cpuBenchmark: 50, // 0-100 score
      memoryGB: 4, // Default
      isLowPowerMode: false,
      connectionType: 'unknown' as const
    };

    try {
      // Detect screen resolution
      if (typeof window !== 'undefined') {
        capabilities.maxResolution = {
          width: window.screen.width * (window.devicePixelRatio || 1),
          height: window.screen.height * (window.devicePixelRatio || 1)
        };

        // Detect connection type
        const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
        if (connection) {
          capabilities.connectionType = connection.type === 'wifi' ? 'wifi' : 
                                     connection.type === 'cellular' ? 'cellular' : 'unknown';
          capabilities.isLowPowerMode = connection.saveData || false;
        }

        // Estimate memory
        if ('deviceMemory' in navigator) {
          capabilities.memoryGB = (navigator as any).deviceMemory;
        }

        // Estimate CPU performance (simple benchmark)
        const startTime = performance.now();
        for (let i = 0; i < 100000; i++) {
          Math.sqrt(Math.random());
        }
        const endTime = performance.now();
        const benchmarkTime = endTime - startTime;
        capabilities.cpuBenchmark = Math.max(0, Math.min(100, 100 - benchmarkTime / 2));

        // Battery API
        if ('getBattery' in navigator) {
          const battery = await (navigator as any).getBattery();
          capabilities.batteryLevel = battery.level * 100;
          capabilities.isLowPowerMode = capabilities.isLowPowerMode || battery.level < 0.2;
        }

        // Codec support detection
        const video = document.createElement('video');
        const codecs = ['h264', 'h265', 'vp9', 'av1'];
        capabilities.supportedCodecs = codecs.filter(codec => {
          const mimeType = `video/mp4; codecs="${codec === 'h264' ? 'avc1.42E01E' : 
                                                  codec === 'h265' ? 'hev1.1.6.L93.B0' :
                                                  codec === 'vp9' ? 'vp09.00.10.08' :
                                                  codec === 'av1' ? 'av01.0.08M.08' : ''}"`;
          return video.canPlayType(mimeType) !== '';
        });
      }
    } catch (error) {
      console.warn('Failed to detect some device capabilities:', error);
    }

    return capabilities;
  }, []);

  // Analyze network conditions
  const analyzeNetworkConditions = useCallback((
    bandwidth: number,
    latency: number = 50,
    packetLoss: number = 0
  ): NetworkConditions => {
    // Add to bandwidth history
    bandwidthHistory.current.push(bandwidth);
    if (bandwidthHistory.current.length > 20) {
      bandwidthHistory.current.shift();
    }

    // Calculate stability based on variance
    const mean = bandwidthHistory.current.reduce((sum, b) => sum + b, 0) / bandwidthHistory.current.length;
    const variance = bandwidthHistory.current.reduce((sum, b) => sum + Math.pow(b - mean, 2), 0) / bandwidthHistory.current.length;
    const stability = Math.max(0, 1 - (Math.sqrt(variance) / mean));

    // Calculate effective bandwidth considering stability and packet loss
    const effectiveBandwidth = bandwidth * stability * (1 - packetLoss / 100);

    return {
      bandwidth,
      latency,
      packetLoss,
      stability,
      isMetered: false, // Would need actual detection
      effectiveBandwidth
    };
  }, []);

  // Analyze content characteristics
  const analyzeContentCharacteristics = useCallback((
    motionLevel: ContentCharacteristics['motionLevel'] = 'medium',
    sceneChanges: number = 5,
    priorityLevel: ContentCharacteristics['priorityLevel'] = 'medium'
  ): ContentCharacteristics => {
    // Calculate complexity based on motion and scene changes
    const motionScore = motionLevel === 'high' ? 0.8 : motionLevel === 'medium' ? 0.5 : 0.2;
    const sceneScore = Math.min(1, sceneChanges / 10); // Normalize to 0-1
    const complexity = (motionScore + sceneScore) / 2;

    // Estimate compression efficiency (inverse of complexity)
    const compressionEfficiency = 1 - complexity;

    return {
      complexity,
      sceneChanges,
      motionLevel,
      compressionEfficiency,
      priorityLevel
    };
  }, []);

  // Calculate quality score for a profile given current conditions
  const calculateQualityScore = useCallback((
    profile: QualityProfile,
    network: NetworkConditions,
    device: DeviceCapabilities,
    content: ContentCharacteristics
  ): number => {
    let score = profile.score; // Base quality score

    // Network constraints
    const bandwidthRatio = network.effectiveBandwidth / profile.bandwidth;
    if (bandwidthRatio < 1) {
      score *= bandwidthRatio; // Penalize if insufficient bandwidth
    }

    // Device constraints
    const resolutionRatio = Math.min(
      device.maxResolution.width / profile.width,
      device.maxResolution.height / profile.height
    );
    if (resolutionRatio < 1) {
      score *= resolutionRatio; // Penalize if device can't display full resolution
    }

    // CPU capability
    const cpuFactor = device.cpuBenchmark / 100;
    if (profile.bitrate > 5000 && cpuFactor < 0.5) {
      score *= cpuFactor; // Penalize high bitrate on weak devices
    }

    // Codec support
    if (!device.supportedCodecs.includes(profile.codec)) {
      score *= 0.5; // Heavy penalty for unsupported codecs
    }

    // Content complexity
    if (content.complexity > 0.7 && profile.bitrate < 2000) {
      score *= 0.8; // Penalize low bitrate for complex content
    }

    // Battery optimization
    if (device.batteryLevel && device.batteryLevel < 20 && fullConfig.batteryOptimization) {
      if (profile.bitrate > 3000) {
        score *= 0.6; // Prefer lower quality when battery is low
      }
    }

    // Data usage optimization
    if (network.isMetered && fullConfig.dataUsageOptimization) {
      if (profile.bitrate > 2000) {
        score *= 0.7; // Prefer lower quality on metered connections
      }
    }

    return Math.max(0, score);
  }, [fullConfig.batteryOptimization, fullConfig.dataUsageOptimization]);

  // Select optimal quality profile
  const selectOptimalQuality = useCallback((
    profiles: QualityProfile[],
    network: NetworkConditions,
    device: DeviceCapabilities,
    content: ContentCharacteristics
  ): QualityDecision => {
    // Calculate scores for all profiles
    const scoredProfiles = profiles.map(profile => ({
      ...profile,
      calculatedScore: calculateQualityScore(profile, network, device, content)
    })).sort((a, b) => b.calculatedScore - a.calculatedScore);

    const selectedProfile = scoredProfiles[0];
    const alternatives = scoredProfiles.slice(1, 4); // Top 3 alternatives

    // Generate reason
    let reason = 'Selected based on ';
    const factors: string[] = [];
    
    if (network.effectiveBandwidth < selectedProfile.bandwidth * 1.5) {
      factors.push('bandwidth constraints');
    }
    if (device.maxResolution.width < 1920) {
      factors.push('device capabilities');
    }
    if (content.complexity > 0.6) {
      factors.push('content complexity');
    }
    if (device.batteryLevel && device.batteryLevel < 30) {
      factors.push('battery optimization');
    }
    
    reason += factors.length > 0 ? factors.join(', ') : 'optimal quality analysis';

    // Calculate confidence based on score difference
    const confidence = scoredProfiles.length > 1 
      ? Math.min(1, (selectedProfile.calculatedScore - scoredProfiles[1].calculatedScore) / 20)
      : 1;

    return {
      selectedProfile,
      reason,
      confidence,
      alternatives,
      adaptationHistory
    };
  }, [calculateQualityScore, adaptationHistory]);

  // Adapt quality based on current conditions
  const adaptQuality = useCallback(async (
    network?: NetworkConditions,
    device?: DeviceCapabilities,
    content?: ContentCharacteristics,
    force: boolean = false
  ): Promise<void> => {
    if (!fullConfig.enableAdaptation || isAdapting) return;

    const now = Date.now();
    if (!force && now - lastAdaptationTime.current < fullConfig.minAdaptationInterval) {
      return;
    }

    setIsAdapting(true);

    try {
      // Use provided conditions or current state
      const networkCond = network || networkConditions;
      const deviceCaps = device || deviceCapabilities;
      const contentChar = content || contentCharacteristics;

      if (!networkCond || !deviceCaps || !contentChar) {
        throw new Error('Missing conditions for quality adaptation');
      }

      // Select optimal quality
      const qualityDecision = selectOptimalQuality(
        availableQualities,
        networkCond,
        deviceCaps,
        contentChar
      );

      // Check if we should actually change
      const shouldChange = !currentProfile || 
                          currentProfile.id !== qualityDecision.selectedProfile.id;

      if (shouldChange) {
        // Limit quality step changes
        if (currentProfile && fullConfig.qualityStepLimit > 0) {
          const currentIndex = availableQualities.findIndex(p => p.id === currentProfile.id);
          const newIndex = availableQualities.findIndex(p => p.id === qualityDecision.selectedProfile.id);
          
          if (Math.abs(newIndex - currentIndex) > fullConfig.qualityStepLimit) {
            // Limit the step
            const limitedIndex = currentIndex + 
              Math.sign(newIndex - currentIndex) * fullConfig.qualityStepLimit;
            qualityDecision.selectedProfile = availableQualities[limitedIndex];
            qualityDecision.reason += ' (step limited)';
          }
        }

        // Record the change
        const qualityChange: QualityChange = {
          timestamp: now,
          fromProfile: currentProfile,
          toProfile: qualityDecision.selectedProfile,
          reason: qualityDecision.reason,
          trigger: 'bandwidth', // Would be more specific in real implementation
          success: true // Would be determined by actual switch success
        };

        setAdaptationHistory(prev => [...prev.slice(-19), qualityChange]); // Keep last 20
        setCurrentProfile(qualityDecision.selectedProfile);
        lastAdaptationTime.current = now;
      }

      setDecision(qualityDecision);

    } catch (error) {
      console.warn('Quality adaptation failed:', error);
    } finally {
      setIsAdapting(false);
    }
  }, [
    fullConfig.enableAdaptation,
    fullConfig.minAdaptationInterval,
    fullConfig.qualityStepLimit,
    isAdapting,
    networkConditions,
    deviceCapabilities,
    contentCharacteristics,
    availableQualities,
    currentProfile,
    selectOptimalQuality
  ]);

  // Start automatic adaptation
  const startAdaptation = useCallback(() => {
    if (!fullConfig.enableAdaptation || adaptationInterval.current) return;

    adaptationInterval.current = setInterval(() => {
      adaptQuality();
    }, fullConfig.adaptationInterval);
  }, [fullConfig.enableAdaptation, fullConfig.adaptationInterval, adaptQuality]);

  // Stop automatic adaptation
  const stopAdaptation = useCallback(() => {
    if (adaptationInterval.current) {
      clearInterval(adaptationInterval.current);
      adaptationInterval.current = null;
    }
  }, []);

  // Manual quality selection
  const setQuality = useCallback((profileId: string, reason: string = 'Manual selection') => {
    const profile = availableQualities.find(p => p.id === profileId);
    if (!profile) return;

    const qualityChange: QualityChange = {
      timestamp: Date.now(),
      fromProfile: currentProfile,
      toProfile: profile,
      reason,
      trigger: 'user',
      success: true
    };

    setAdaptationHistory(prev => [...prev.slice(-19), qualityChange]);
    setCurrentProfile(profile);
    lastAdaptationTime.current = Date.now();
  }, [availableQualities, currentProfile]);

  // Update network conditions from external source
  const updateNetworkConditions = useCallback((bandwidth: number, latency?: number, packetLoss?: number) => {
    const conditions = analyzeNetworkConditions(bandwidth, latency, packetLoss);
    setNetworkConditions(conditions);
    
    // Trigger adaptation if conditions changed significantly
    if (networkConditions && Math.abs(conditions.effectiveBandwidth - networkConditions.effectiveBandwidth) > 1) {
      adaptQuality(conditions);
    }
  }, [analyzeNetworkConditions, networkConditions, adaptQuality]);

  // Update content characteristics
  const updateContentCharacteristics = useCallback((characteristics: Partial<ContentCharacteristics>) => {
    const newCharacteristics = { ...contentCharacteristics, ...characteristics } as ContentCharacteristics;
    setContentCharacteristics(newCharacteristics);
    
    // Trigger adaptation for significant content changes
    if (characteristics.motionLevel && characteristics.motionLevel !== contentCharacteristics?.motionLevel) {
      adaptQuality(undefined, undefined, newCharacteristics);
    }
  }, [contentCharacteristics, adaptQuality]);

  // Initialize on mount
  useEffect(() => {
    const initialize = async () => {
      // Detect device capabilities
      const deviceCaps = await detectDeviceCapabilities();
      setDeviceCapabilities(deviceCaps);

      // Set default network conditions
      const defaultNetwork = analyzeNetworkConditions(5); // Assume 5 Mbps initially
      setNetworkConditions(defaultNetwork);

      // Set default content characteristics
      const defaultContent = analyzeContentCharacteristics();
      setContentCharacteristics(defaultContent);

      // Perform initial quality selection
      if (availableQualities.length > 0) {
        await adaptQuality(defaultNetwork, deviceCaps, defaultContent, true);
      }
    };

    initialize();
  }, [detectDeviceCapabilities, analyzeNetworkConditions, analyzeContentCharacteristics, adaptQuality, availableQualities]);

  // Start adaptation when video plays
  useEffect(() => {
    if (!videoElement) return;

    const handlePlay = () => {
      startAdaptation();
    };

    const handlePause = () => {
      stopAdaptation();
    };

    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);
    videoElement.addEventListener('ended', handlePause);

    return () => {
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
      videoElement.removeEventListener('ended', handlePause);
      stopAdaptation();
    };
  }, [videoElement, startAdaptation, stopAdaptation]);

  return {
    // State
    currentProfile,
    availableQualities,
    decision,
    isAdapting,
    adaptationHistory,
    deviceCapabilities,
    networkConditions,
    contentCharacteristics,

    // Actions
    adaptQuality,
    setQuality,
    updateNetworkConditions,
    updateContentCharacteristics,
    startAdaptation,
    stopAdaptation,

    // Configuration
    config: fullConfig
  };
}
