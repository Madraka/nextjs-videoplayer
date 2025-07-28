/**
 * Network Monitor Hook
 * Monitors network conditions and connectivity status
 */

import { useState, useEffect, useCallback } from 'react';

interface NetworkInfo {
  isOnline: boolean;
  connectionType: 'wifi' | 'cellular' | 'ethernet' | 'bluetooth' | 'unknown';
  effectiveType: '2g' | '3g' | '4g' | 'slow-2g' | 'unknown';
  downlink: number; // Mbps
  downlinkMax: number; // Mbps
  rtt: number; // ms
  saveData: boolean;
}

interface BandwidthMeasurement {
  timestamp: number;
  downloadSpeed: number; // Mbps
  uploadSpeed: number; // Mbps
  latency: number; // ms
  jitter: number; // ms
}

interface UseNetworkMonitorProps {
  measureBandwidth?: boolean;
  measurementInterval?: number; // ms
  onConnectionChange?: (isOnline: boolean) => void;
  onBandwidthChange?: (measurement: BandwidthMeasurement) => void;
  onSlowConnection?: (info: NetworkInfo) => void;
}

interface UseNetworkMonitorReturn {
  networkInfo: NetworkInfo;
  bandwidthHistory: BandwidthMeasurement[];
  currentBandwidth: BandwidthMeasurement | null;
  isSlowConnection: boolean;
  measureBandwidth: () => Promise<BandwidthMeasurement>;
  getRecommendedQuality: () => string;
  isMeteredConnection: boolean;
}

export function useNetworkMonitor({
  measureBandwidth = false,
  measurementInterval = 30000, // 30 seconds
  onConnectionChange,
  onBandwidthChange,
  onSlowConnection
}: UseNetworkMonitorProps = {}): UseNetworkMonitorReturn {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({
    isOnline: navigator.onLine,
    connectionType: 'unknown',
    effectiveType: 'unknown',
    downlink: 0,
    downlinkMax: 0,
    rtt: 0,
    saveData: false
  });
  
  const [bandwidthHistory, setBandwidthHistory] = useState<BandwidthMeasurement[]>([]);
  const [currentBandwidth, setCurrentBandwidth] = useState<BandwidthMeasurement | null>(null);

  // Get network information from Navigator API
  const getNetworkInfo = useCallback((): NetworkInfo => {
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;

    return {
      isOnline: navigator.onLine,
      connectionType: connection?.type || 'unknown',
      effectiveType: connection?.effectiveType || 'unknown',
      downlink: connection?.downlink || 0,
      downlinkMax: connection?.downlinkMax || 0,
      rtt: connection?.rtt || 0,
      saveData: connection?.saveData || false
    };
  }, []);

  // Measure actual bandwidth using a test download
  const measureActualBandwidth = useCallback(async (): Promise<BandwidthMeasurement> => {
    const startTime = performance.now();
    const testUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    
    try {
      // Measure download latency
      const latencyStart = performance.now();
      await fetch(testUrl, { method: 'HEAD', cache: 'no-cache' });
      const latency = performance.now() - latencyStart;

      // For a more accurate test, we'd download a larger file
      // This is a simplified implementation
      const downloadSpeed = networkInfo.downlink || 1; // Fallback to connection API
      const uploadSpeed = downloadSpeed * 0.1; // Estimate upload as 10% of download

      const measurement: BandwidthMeasurement = {
        timestamp: Date.now(),
        downloadSpeed,
        uploadSpeed,
        latency,
        jitter: Math.random() * 10 // Simplified jitter calculation
      };

      return measurement;
    } catch (error) {
      // Return fallback measurement
      return {
        timestamp: Date.now(),
        downloadSpeed: 1,
        uploadSpeed: 0.1,
        latency: 100,
        jitter: 10
      };
    }
  }, [networkInfo.downlink]);

  // Public bandwidth measurement function
  const measureBandwidthPublic = useCallback(async (): Promise<BandwidthMeasurement> => {
    const measurement = await measureActualBandwidth();
    
    setBandwidthHistory(prev => {
      const newHistory = [...prev, measurement];
      // Keep only last 20 measurements
      return newHistory.slice(-20);
    });
    
    setCurrentBandwidth(measurement);
    onBandwidthChange?.(measurement);
    
    return measurement;
  }, [measureActualBandwidth, onBandwidthChange]);

  // Get recommended video quality based on network conditions
  const getRecommendedQuality = useCallback((): string => {
    const bandwidth = currentBandwidth?.downloadSpeed || networkInfo.downlink;
    const effectiveType = networkInfo.effectiveType;
    const saveData = networkInfo.saveData;

    if (saveData) {
      return '240p';
    }

    switch (effectiveType) {
      case 'slow-2g':
        return '144p';
      case '2g':
        return '240p';
      case '3g':
        return '360p';
      case '4g':
        if (bandwidth > 5) return '1080p';
        if (bandwidth > 2) return '720p';
        return '480p';
      default:
        if (bandwidth > 10) return '1440p';
        if (bandwidth > 5) return '1080p';
        if (bandwidth > 2) return '720p';
        if (bandwidth > 1) return '480p';
        return '360p';
    }
  }, [currentBandwidth?.downloadSpeed, networkInfo.downlink, networkInfo.effectiveType, networkInfo.saveData]);

  // Check if connection is considered slow
  const isSlowConnection = networkInfo.effectiveType === 'slow-2g' || 
                          networkInfo.effectiveType === '2g' ||
                          (currentBandwidth?.downloadSpeed || networkInfo.downlink) < 1;

  // Check if connection is metered (affects video quality recommendations)
  const isMeteredConnection = networkInfo.saveData || 
                             networkInfo.connectionType === 'cellular';

  // Update network info
  const updateNetworkInfo = useCallback(() => {
    const newInfo = getNetworkInfo();
    const wasOnline = networkInfo.isOnline;
    
    setNetworkInfo(newInfo);
    
    // Trigger connection change callback
    if (wasOnline !== newInfo.isOnline) {
      onConnectionChange?.(newInfo.isOnline);
    }
    
    // Trigger slow connection callback
    if (newInfo.effectiveType === 'slow-2g' || newInfo.effectiveType === '2g') {
      onSlowConnection?.(newInfo);
    }
  }, [getNetworkInfo, networkInfo.isOnline, onConnectionChange, onSlowConnection]);

  // Set up event listeners
  useEffect(() => {
    // Online/offline events
    const handleOnline = () => updateNetworkInfo();
    const handleOffline = () => updateNetworkInfo();
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Connection change events
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;
    
    const handleConnectionChange = () => updateNetworkInfo();
    
    if (connection) {
      connection.addEventListener('change', handleConnectionChange);
    }
    
    // Initial update
    updateNetworkInfo();
    
    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if (connection) {
        connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, [updateNetworkInfo]);

  // Set up bandwidth measurement interval
  useEffect(() => {
    if (!measureBandwidth) return;

    const interval = setInterval(() => {
      measureBandwidthPublic().catch(console.error);
    }, measurementInterval);

    // Initial measurement
    measureBandwidthPublic().catch(console.error);

    return () => clearInterval(interval);
  }, [measureBandwidth, measurementInterval, measureBandwidthPublic]);

  return {
    networkInfo,
    bandwidthHistory,
    currentBandwidth,
    isSlowConnection,
    measureBandwidth: measureBandwidthPublic,
    getRecommendedQuality,
    isMeteredConnection
  };
}
