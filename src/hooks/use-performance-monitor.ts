/**
 * Performance Monitor Hook
 * Monitors video player performance metrics and provides optimization insights
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

// Performance interfaces
interface PerformanceMetrics {
  playback: PlaybackMetrics;
  network: NetworkMetrics;
  rendering: RenderingMetrics;
  memory: MemoryMetrics;
  cpu: CPUMetrics;
  overall: OverallMetrics;
}

interface PlaybackMetrics {
  bufferHealth: number; // 0-100, percentage of buffer filled
  stallCount: number; // number of playback stalls
  stallDuration: number; // total time spent stalling (ms)
  seekCount: number; // number of seek operations
  averageSeekTime: number; // average seek completion time (ms)
  qualityChanges: number; // number of quality adaptations
  droppedFrames: number; // frames dropped during playback
  totalFrames: number; // total frames processed
  frameRate: number; // current fps
  lastStallTime?: number; // timestamp of last stall
}

interface NetworkMetrics {
  downloadSpeed: number; // Mbps
  uploadSpeed: number; // Mbps
  latency: number; // ms
  jitter: number; // ms variance
  packetLoss: number; // percentage
  throughput: number; // effective data transfer rate
  connectionStability: number; // 0-1 score
  bytesDownloaded: number; // total bytes
  requestFailures: number; // failed network requests
}

interface RenderingMetrics {
  frameRate: number; // actual rendering fps
  frameDrops: number; // frames dropped by renderer
  frameSkips: number; // frames skipped due to timing
  renderTime: number; // average frame render time (ms)
  vsyncMisses: number; // missed vsync intervals
  gpuUtilization: number; // 0-100 percentage (if available)
  canvasPerformance: CanvasPerformance;
}

interface CanvasPerformance {
  drawCalls: number; // number of draw operations
  textureMemory: number; // MB used for textures
  shaderCompileTime: number; // ms for shader compilation
  contextSwitches: number; // rendering context switches
}

interface MemoryMetrics {
  heapUsed: number; // MB
  heapTotal: number; // MB
  heapLimit: number; // MB
  bufferMemory: number; // MB used for video buffers
  cacheSize: number; // MB used for caching
  memoryPressure: number; // 0-1 score indicating memory pressure
  gcCount: number; // garbage collection events
  gcTime: number; // time spent in garbage collection (ms)
}

interface CPUMetrics {
  utilization: number; // 0-100 percentage
  videoDecoding: number; // 0-100 percentage for video decoding
  audioDecoding: number; // 0-100 percentage for audio decoding
  mainThreadBlocking: number; // ms of main thread blocking
  workerThreads: number; // active worker threads
  averageTaskTime: number; // average task execution time (ms)
}

interface OverallMetrics {
  performanceScore: number; // 0-100 overall performance rating
  userExperienceScore: number; // 0-100 user experience rating
  optimizationLevel: 'poor' | 'fair' | 'good' | 'excellent';
  recommendations: PerformanceRecommendation[];
  bottlenecks: PerformanceBottleneck[];
}

interface PerformanceRecommendation {
  type: 'quality' | 'buffer' | 'network' | 'hardware' | 'settings';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  action: string;
  expectedImprovement: number; // 0-100 percentage
}

interface PerformanceBottleneck {
  component: 'network' | 'cpu' | 'memory' | 'gpu' | 'disk' | 'player';
  severity: number; // 0-100
  description: string;
  impact: string;
  suggestedFix: string;
}

interface PerformanceMonitorConfig {
  monitoringInterval: number; // ms
  enableDetailedMetrics: boolean;
  enableNetworkMetrics: boolean;
  enableRenderingMetrics: boolean;
  enableMemoryMetrics: boolean;
  enableCPUMetrics: boolean;
  historySize: number; // number of historical data points to keep
  alertThresholds: {
    stallDuration: number; // ms
    bufferHealth: number; // minimum percentage
    frameDrops: number; // maximum per second
    memoryUsage: number; // maximum MB
    cpuUsage: number; // maximum percentage
  };
}

const defaultConfig: PerformanceMonitorConfig = {
  monitoringInterval: 1000,
  enableDetailedMetrics: true,
  enableNetworkMetrics: true,
  enableRenderingMetrics: true,
  enableMemoryMetrics: true,
  enableCPUMetrics: true,
  historySize: 300,
  alertThresholds: {
    stallDuration: 1000,
    bufferHealth: 20,
    frameDrops: 5,
    memoryUsage: 500,
    cpuUsage: 80
  }
};

export function usePerformanceMonitor(
  videoElement: HTMLVideoElement | null,
  config: Partial<PerformanceMonitorConfig> = {}
) {
  const fullConfig = { ...defaultConfig, ...config };
  
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [history, setHistory] = useState<PerformanceMetrics[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [error, setError] = useState<Error | null>(null);

  // Refs for tracking
  const monitoringInterval = useRef<NodeJS.Timeout | null>(null);
  const performanceObserver = useRef<PerformanceObserver | null>(null);
  const startTime = useRef<number>(Date.now());
  const lastMetrics = useRef<Partial<PerformanceMetrics>>({});
  const frameCount = useRef<number>(0);
  const lastFrameTime = useRef<number>(0);

  // Collect playback metrics
  const collectPlaybackMetrics = useCallback((): PlaybackMetrics => {
    if (!videoElement) {
      return {
        bufferHealth: 0,
        stallCount: 0,
        stallDuration: 0,
        seekCount: 0,
        averageSeekTime: 0,
        qualityChanges: 0,
        droppedFrames: 0,
        totalFrames: 0,
        frameRate: 0
      };
    }

    const buffered = videoElement.buffered;
    const currentTime = videoElement.currentTime;
    const duration = videoElement.duration || 0;

    // Calculate buffer health
    let bufferAhead = 0;
    for (let i = 0; i < buffered.length; i++) {
      if (buffered.start(i) <= currentTime && buffered.end(i) > currentTime) {
        bufferAhead = buffered.end(i) - currentTime;
        break;
      }
    }
    const bufferHealth = duration > 0 ? Math.min(100, (bufferAhead / Math.min(30, duration)) * 100) : 0;

    // Get video quality metrics
    const videoTracks = (videoElement as any).videoTracks;
    let droppedFrames = 0;
    let totalFrames = 0;

    if ('getVideoPlaybackQuality' in videoElement) {
      const quality = (videoElement as any).getVideoPlaybackQuality();
      droppedFrames = quality.droppedVideoFrames || 0;
      totalFrames = quality.totalVideoFrames || 0;
    }

    // Calculate frame rate
    const now = performance.now();
    if (lastFrameTime.current > 0) {
      const timeDiff = now - lastFrameTime.current;
      frameCount.current++;
      if (timeDiff >= 1000) { // Update FPS every second
        const fps = (frameCount.current / timeDiff) * 1000;
        frameCount.current = 0;
        lastFrameTime.current = now;
      }
    } else {
      lastFrameTime.current = now;
    }

    return {
      bufferHealth,
      stallCount: lastMetrics.current.playback?.stallCount || 0,
      stallDuration: lastMetrics.current.playback?.stallDuration || 0,
      seekCount: lastMetrics.current.playback?.seekCount || 0,
      averageSeekTime: lastMetrics.current.playback?.averageSeekTime || 0,
      qualityChanges: lastMetrics.current.playback?.qualityChanges || 0,
      droppedFrames,
      totalFrames,
      frameRate: videoElement.playbackRate * 30 // Approximate
    };
  }, [videoElement]);

  // Collect network metrics
  const collectNetworkMetrics = useCallback((): NetworkMetrics => {
    if (!fullConfig.enableNetworkMetrics) {
      return {
        downloadSpeed: 0,
        uploadSpeed: 0,
        latency: 0,
        jitter: 0,
        packetLoss: 0,
        throughput: 0,
        connectionStability: 1,
        bytesDownloaded: 0,
        requestFailures: 0
      };
    }

    // Use Network Information API if available
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    return {
      downloadSpeed: connection?.downlink || 10, // Mbps
      uploadSpeed: connection?.uplink || 1, // Mbps
      latency: connection?.rtt || 50, // ms
      jitter: 5, // Estimated
      packetLoss: 0, // Would need actual measurement
      throughput: connection?.downlink * 0.8 || 8, // Effective throughput
      connectionStability: connection?.effectiveType === '4g' ? 0.9 : 0.7,
      bytesDownloaded: lastMetrics.current.network?.bytesDownloaded || 0,
      requestFailures: lastMetrics.current.network?.requestFailures || 0
    };
  }, [fullConfig.enableNetworkMetrics]);

  // Collect rendering metrics
  const collectRenderingMetrics = useCallback((): RenderingMetrics => {
    if (!fullConfig.enableRenderingMetrics) {
      return {
        frameRate: 30,
        frameDrops: 0,
        frameSkips: 0,
        renderTime: 16.67,
        vsyncMisses: 0,
        gpuUtilization: 0,
        canvasPerformance: {
          drawCalls: 0,
          textureMemory: 0,
          shaderCompileTime: 0,
          contextSwitches: 0
        }
      };
    }

    // Calculate frame rate from performance timeline
    let frameRate = 60;
    if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
      const entries = performance.getEntriesByType('measure');
      if (entries.length > 0) {
        const recentEntries = entries.slice(-10);
        const avgDuration = recentEntries.reduce((sum, entry) => sum + entry.duration, 0) / recentEntries.length;
        frameRate = avgDuration > 0 ? 1000 / avgDuration : 60;
      }
    }

    return {
      frameRate: Math.min(60, frameRate),
      frameDrops: lastMetrics.current.rendering?.frameDrops || 0,
      frameSkips: lastMetrics.current.rendering?.frameSkips || 0,
      renderTime: 1000 / frameRate,
      vsyncMisses: lastMetrics.current.rendering?.vsyncMisses || 0,
      gpuUtilization: 0, // Not easily accessible
      canvasPerformance: {
        drawCalls: 0,
        textureMemory: 0,
        shaderCompileTime: 0,
        contextSwitches: 0
      }
    };
  }, [fullConfig.enableRenderingMetrics]);

  // Collect memory metrics
  const collectMemoryMetrics = useCallback((): MemoryMetrics => {
    if (!fullConfig.enableMemoryMetrics) {
      return {
        heapUsed: 0,
        heapTotal: 0,
        heapLimit: 0,
        bufferMemory: 0,
        cacheSize: 0,
        memoryPressure: 0,
        gcCount: 0,
        gcTime: 0
      };
    }

    let heapUsed = 0;
    let heapTotal = 0;
    let heapLimit = 0;

    // Use Memory API if available
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      heapUsed = memory.usedJSHeapSize / (1024 * 1024); // Convert to MB
      heapTotal = memory.totalJSHeapSize / (1024 * 1024);
      heapLimit = memory.jsHeapSizeLimit / (1024 * 1024);
    }

    const memoryPressure = heapLimit > 0 ? heapUsed / heapLimit : 0;

    return {
      heapUsed,
      heapTotal,
      heapLimit,
      bufferMemory: 0, // Would need specific measurement
      cacheSize: 0, // Would need specific measurement
      memoryPressure,
      gcCount: lastMetrics.current.memory?.gcCount || 0,
      gcTime: lastMetrics.current.memory?.gcTime || 0
    };
  }, [fullConfig.enableMemoryMetrics]);

  // Collect CPU metrics
  const collectCPUMetrics = useCallback((): CPUMetrics => {
    if (!fullConfig.enableCPUMetrics) {
      return {
        utilization: 0,
        videoDecoding: 0,
        audioDecoding: 0,
        mainThreadBlocking: 0,
        workerThreads: 0,
        averageTaskTime: 0
      };
    }

    // Use Performance Timeline API for CPU metrics
    const entries = performance.getEntriesByType('measure');
    const recentEntries = entries.slice(-20);
    
    const avgTaskTime = recentEntries.length > 0 
      ? recentEntries.reduce((sum, entry) => sum + entry.duration, 0) / recentEntries.length
      : 0;

    // Estimate CPU utilization based on task times
    const utilization = Math.min(100, avgTaskTime * 2); // Rough estimation

    return {
      utilization,
      videoDecoding: utilization * 0.6, // Estimate
      audioDecoding: utilization * 0.2, // Estimate
      mainThreadBlocking: avgTaskTime > 16.67 ? avgTaskTime : 0,
      workerThreads: navigator.hardwareConcurrency || 4,
      averageTaskTime: avgTaskTime
    };
  }, [fullConfig.enableCPUMetrics]);

  // Generate recommendations
  const generateRecommendations = useCallback((metrics: PerformanceMetrics): PerformanceRecommendation[] => {
    const recommendations: PerformanceRecommendation[] = [];

    // Buffer health recommendations
    if (metrics.playback.bufferHealth < fullConfig.alertThresholds.bufferHealth) {
      recommendations.push({
        type: 'buffer',
        priority: 'high',
        description: 'Buffer health is low',
        action: 'Increase buffer size or reduce quality',
        expectedImprovement: 30
      });
    }

    // Memory pressure recommendations
    if (metrics.memory.memoryPressure > 0.8) {
      recommendations.push({
        type: 'settings',
        priority: 'medium',
        description: 'High memory usage detected',
        action: 'Clear cache or reduce quality settings',
        expectedImprovement: 25
      });
    }

    // CPU utilization recommendations
    if (metrics.cpu.utilization > fullConfig.alertThresholds.cpuUsage) {
      recommendations.push({
        type: 'hardware',
        priority: 'high',
        description: 'High CPU usage affecting performance',
        action: 'Lower quality or enable hardware acceleration',
        expectedImprovement: 40
      });
    }

    // Frame drop recommendations
    if (metrics.rendering.frameDrops > fullConfig.alertThresholds.frameDrops) {
      recommendations.push({
        type: 'quality',
        priority: 'medium',
        description: 'Frame drops detected',
        action: 'Reduce video quality or resolution',
        expectedImprovement: 35
      });
    }

    // Network recommendations
    if (metrics.network.connectionStability < 0.7) {
      recommendations.push({
        type: 'network',
        priority: 'medium',
        description: 'Unstable network connection',
        action: 'Enable adaptive bitrate streaming',
        expectedImprovement: 20
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }, [fullConfig.alertThresholds]);

  // Identify bottlenecks
  const identifyBottlenecks = useCallback((metrics: PerformanceMetrics): PerformanceBottleneck[] => {
    const bottlenecks: PerformanceBottleneck[] = [];

    // Network bottleneck
    if (metrics.network.downloadSpeed < 2 || metrics.network.latency > 200) {
      bottlenecks.push({
        component: 'network',
        severity: 70,
        description: 'Network connection is limiting performance',
        impact: 'Buffering, quality reduction, playback interruptions',
        suggestedFix: 'Check network connection, reduce quality, enable buffering'
      });
    }

    // CPU bottleneck
    if (metrics.cpu.utilization > 80) {
      bottlenecks.push({
        component: 'cpu',
        severity: 80,
        description: 'CPU is overloaded',
        impact: 'Frame drops, audio stuttering, UI lag',
        suggestedFix: 'Enable hardware acceleration, reduce quality, close other applications'
      });
    }

    // Memory bottleneck
    if (metrics.memory.memoryPressure > 0.85) {
      bottlenecks.push({
        component: 'memory',
        severity: 75,
        description: 'Memory usage is too high',
        impact: 'Performance degradation, possible crashes',
        suggestedFix: 'Clear cache, reduce buffer size, restart application'
      });
    }

    // Player bottleneck
    if (metrics.playback.stallCount > 5 || metrics.playback.droppedFrames > 100) {
      bottlenecks.push({
        component: 'player',
        severity: 60,
        description: 'Video player performance issues',
        impact: 'Playback interruptions, poor video quality',
        suggestedFix: 'Update player, adjust settings, check video encoding'
      });
    }

    return bottlenecks.sort((a, b) => b.severity - a.severity);
  }, []);

  // Calculate overall metrics
  const calculateOverallMetrics = useCallback((
    playback: PlaybackMetrics,
    network: NetworkMetrics,
    rendering: RenderingMetrics,
    memory: MemoryMetrics,
    cpu: CPUMetrics
  ): OverallMetrics => {
    // Calculate performance score (0-100)
    let performanceScore = 100;
    
    // Deduct for issues
    performanceScore -= Math.min(30, playback.stallCount * 5);
    performanceScore -= Math.min(20, (100 - playback.bufferHealth) * 0.2);
    performanceScore -= Math.min(15, rendering.frameDrops);
    performanceScore -= Math.min(20, cpu.utilization * 0.2);
    performanceScore -= Math.min(15, memory.memoryPressure * 15);
    
    performanceScore = Math.max(0, performanceScore);

    // Calculate user experience score
    const userExperienceScore = Math.min(100, 
      performanceScore * 0.6 + 
      (playback.bufferHealth * 0.3) + 
      (network.connectionStability * 10)
    );

    // Determine optimization level
    let optimizationLevel: OverallMetrics['optimizationLevel'];
    if (performanceScore >= 90) optimizationLevel = 'excellent';
    else if (performanceScore >= 75) optimizationLevel = 'good';
    else if (performanceScore >= 60) optimizationLevel = 'fair';
    else optimizationLevel = 'poor';

    const allMetrics = { playback, network, rendering, memory, cpu } as PerformanceMetrics;
    const recommendations = generateRecommendations(allMetrics);
    const bottlenecks = identifyBottlenecks(allMetrics);

    return {
      performanceScore,
      userExperienceScore,
      optimizationLevel,
      recommendations,
      bottlenecks
    };
  }, [generateRecommendations, identifyBottlenecks]);

  // Collect all metrics
  const collectMetrics = useCallback((): PerformanceMetrics => {
    const playback = collectPlaybackMetrics();
    const network = collectNetworkMetrics();
    const rendering = collectRenderingMetrics();
    const memory = collectMemoryMetrics();
    const cpu = collectCPUMetrics();
    const overall = calculateOverallMetrics(playback, network, rendering, memory, cpu);

    const newMetrics: PerformanceMetrics = {
      playback,
      network,
      rendering,
      memory,
      cpu,
      overall
    };

    // Check for alerts
    const newAlerts: string[] = [];
    if (playback.bufferHealth < fullConfig.alertThresholds.bufferHealth) {
      newAlerts.push(`Low buffer health: ${playback.bufferHealth.toFixed(1)}%`);
    }
    if (memory.memoryPressure > 0.8) {
      newAlerts.push(`High memory usage: ${(memory.memoryPressure * 100).toFixed(1)}%`);
    }
    if (cpu.utilization > fullConfig.alertThresholds.cpuUsage) {
      newAlerts.push(`High CPU usage: ${cpu.utilization.toFixed(1)}%`);
    }

    setAlerts(newAlerts);
    lastMetrics.current = newMetrics;

    return newMetrics;
  }, [
    collectPlaybackMetrics,
    collectNetworkMetrics,
    collectRenderingMetrics,
    collectMemoryMetrics,
    collectCPUMetrics,
    calculateOverallMetrics,
    fullConfig.alertThresholds
  ]);

  // Start monitoring
  const startMonitoring = useCallback(() => {
    if (isMonitoring || monitoringInterval.current) return;

    setIsMonitoring(true);
    setError(null);

    monitoringInterval.current = setInterval(() => {
      try {
        const newMetrics = collectMetrics();
        setMetrics(newMetrics);
        
        setHistory(prev => {
          const updated = [...prev, newMetrics];
          return updated.length > fullConfig.historySize 
            ? updated.slice(-fullConfig.historySize)
            : updated;
        });
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        console.warn('Performance monitoring error:', error);
      }
    }, fullConfig.monitoringInterval);

    // Setup Performance Observer if available
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      try {
        performanceObserver.current = new PerformanceObserver((list) => {
          // Handle performance entries
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (entry.entryType === 'measure' && entry.name.includes('video')) {
              // Update rendering metrics based on video-related measurements
            }
          });
        });

        performanceObserver.current.observe({ 
          entryTypes: ['measure', 'navigation', 'resource'] 
        });
      } catch (err) {
        console.warn('Failed to setup PerformanceObserver:', err);
      }
    }
  }, [isMonitoring, collectMetrics, fullConfig.monitoringInterval, fullConfig.historySize]);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    
    if (monitoringInterval.current) {
      clearInterval(monitoringInterval.current);
      monitoringInterval.current = null;
    }

    if (performanceObserver.current) {
      performanceObserver.current.disconnect();
      performanceObserver.current = null;
    }
  }, []);

  // Reset metrics
  const resetMetrics = useCallback(() => {
    setMetrics(null);
    setHistory([]);
    setAlerts([]);
    setError(null);
    lastMetrics.current = {};
    frameCount.current = 0;
    lastFrameTime.current = 0;
    startTime.current = Date.now();
  }, []);

  // Get performance summary
  const getSummary = useCallback(() => {
    if (!metrics) return null;

    return {
      score: metrics.overall.performanceScore,
      level: metrics.overall.optimizationLevel,
      criticalIssues: metrics.overall.bottlenecks.filter(b => b.severity > 70).length,
      recommendations: metrics.overall.recommendations.length,
      alerts: alerts.length
    };
  }, [metrics, alerts]);

  // Auto-start monitoring when video loads
  useEffect(() => {
    if (!videoElement) return;

    const handleLoadedMetadata = () => {
      startMonitoring();
    };

    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);

    // Start monitoring if metadata is already loaded
    if (videoElement.readyState >= 1) {
      startMonitoring();
    }

    return () => {
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [videoElement, startMonitoring]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, [stopMonitoring]);

  return {
    // State
    metrics,
    isMonitoring,
    history,
    alerts,
    error,

    // Actions
    startMonitoring,
    stopMonitoring,
    resetMetrics,
    getSummary,

    // Configuration
    config: fullConfig
  };
}
