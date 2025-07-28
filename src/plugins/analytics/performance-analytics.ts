/**
 * Performance Analytics Plugin
 * 
 * Tracks video player performance metrics, network conditions, and technical KPIs.
 * This plugin monitors the technical performance of video playback.
 */

import { 
  BaseAnalyticsPlugin, 
  AnalyticsConfig, 
  AnalyticsEvent, 
  PlayerBehaviorData, 
  PerformanceMetrics, 
  CustomEventData 
} from './base-analytics';

/**
 * Extended performance metrics
 */
export interface ExtendedPerformanceMetrics extends PerformanceMetrics {
  /** Startup time in milliseconds */
  startupTime: number;
  /** Rebuffering events count */
  rebufferingCount: number;
  /** Total rebuffering duration in milliseconds */
  rebufferingDuration: number;
  /** Network download speed in Mbps */
  downloadSpeed: number;
  /** Video resolution */
  resolution: string;
  /** Frames per second */
  fps: number;
  /** Bandwidth utilization percentage */
  bandwidthUtilization: number;
}

/**
 * Performance analytics configuration
 */
export interface PerformanceAnalyticsConfig extends AnalyticsConfig {
  /** Track video load performance */
  trackLoadPerformance: boolean;
  /** Track streaming quality metrics */
  trackQualityMetrics: boolean;
  /** Track network performance */
  trackNetworkMetrics: boolean;
  /** Track buffer health */
  trackBufferHealth: boolean;
  /** Performance monitoring interval in milliseconds */
  monitoringInterval: number;
}

/**
 * Performance analytics plugin implementation
 */
export class PerformanceAnalyticsPlugin extends BaseAnalyticsPlugin {
  public readonly id = 'performance-analytics';
  public readonly name = 'Performance Analytics';
  public readonly version = '1.0.0';
  public readonly type = 'analytics';

  private performanceConfig: PerformanceAnalyticsConfig;
  private performanceTimer?: NodeJS.Timeout;
  private loadStartTime: number = 0;
  private firstFrameTime: number = 0;
  private rebufferingStart: number = 0;
  private totalRebufferingDuration: number = 0;
  private rebufferingCount: number = 0;

  constructor(config: PerformanceAnalyticsConfig) {
    super(config);
    this.performanceConfig = {
      ...config,
      trackLoadPerformance: config.trackLoadPerformance ?? true,
      trackQualityMetrics: config.trackQualityMetrics ?? true,
      trackNetworkMetrics: config.trackNetworkMetrics ?? true,
      trackBufferHealth: config.trackBufferHealth ?? true,
      monitoringInterval: config.monitoringInterval ?? 5000 // 5 seconds
    };
  }

  /**
   * Initialize performance analytics
   */
  public async initialize(): Promise<void> {
    await super.initialize();
    this.startPerformanceMonitoring();
    this.isInitialized = true;
  }

  /**
   * Setup event listeners for performance tracking
   */
  protected setupEventListeners(): void {
    if (this.performanceConfig.trackLoadPerformance) {
      this.setupLoadPerformanceTracking();
    }

    if (this.performanceConfig.trackQualityMetrics) {
      this.setupQualityMetricsTracking();
    }

    if (this.performanceConfig.trackNetworkMetrics) {
      this.setupNetworkMetricsTracking();
    }

    if (this.performanceConfig.trackBufferHealth) {
      this.setupBufferHealthTracking();
    }
  }

  /**
   * Initialize analytics provider
   */
  protected async initializeProvider(): Promise<void> {
    if (this.performanceConfig.endpoint) {
      console.log(`Performance Analytics initialized with endpoint: ${this.performanceConfig.endpoint}`);
    }
  }

  /**
   * Send individual event to analytics provider
   */
  protected async sendEvent(event: AnalyticsEvent): Promise<void> {
    try {
      if (this.performanceConfig.endpoint) {
        await fetch(this.performanceConfig.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(this.performanceConfig.apiKey && {
              'Authorization': `Bearer ${this.performanceConfig.apiKey}`
            })
          },
          body: JSON.stringify(event)
        });
      } else {
        console.log('Performance Analytics Event:', event);
      }
    } catch (error) {
      console.error('Failed to send performance analytics event:', error);
    }
  }

  /**
   * Send batch of events to analytics provider
   */
  protected async sendBatch(events: AnalyticsEvent[]): Promise<void> {
    try {
      if (this.performanceConfig.endpoint) {
        await fetch(`${this.performanceConfig.endpoint}/batch`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(this.performanceConfig.apiKey && {
              'Authorization': `Bearer ${this.performanceConfig.apiKey}`
            })
          },
          body: JSON.stringify({ events })
        });
      } else {
        console.log('Performance Analytics Batch:', events);
      }
    } catch (error) {
      console.error('Failed to send performance analytics batch:', error);
    }
  }

  /**
   * Track performance metrics
   */
  public trackPerformance(metrics: PerformanceMetrics): void {
    this.trackEvent('performance_metrics', {
      loadTime: metrics.loadTime,
      timeToFirstFrame: metrics.timeToFirstFrame,
      bufferHealth: metrics.bufferHealth,
      currentBitrate: metrics.currentBitrate,
      droppedFrames: metrics.droppedFrames,
      averageQuality: metrics.averageQuality,
      timestamp: Date.now()
    });
  }

  /**
   * Track extended performance metrics
   */
  public trackExtendedPerformance(metrics: ExtendedPerformanceMetrics): void {
    this.trackEvent('extended_performance', {
      ...metrics,
      rebufferingRate: this.calculateRebufferingRate(),
      timestamp: Date.now()
    });
  }

  /**
   * Track player behavior (required by base class)
   */
  public trackBehavior(behavior: PlayerBehaviorData): void {
    // Performance plugin focuses on technical metrics
    // This could track performance-related behaviors
    this.trackEvent('performance_behavior', {
      qualityChanges: behavior.qualityChanges,
      pauseFrequency: this.calculatePauseFrequency(behavior),
      timestamp: Date.now()
    });
  }

  /**
   * Track custom events (required by base class)
   */
  public trackCustomEvent(event: CustomEventData): void {
    this.trackEvent('performance_custom', {
      eventName: event.eventName,
      properties: event.properties,
      context: event.context,
      timestamp: Date.now()
    });
  }

  /**
   * Setup load performance tracking
   */
  private setupLoadPerformanceTracking(): void {
    this.on('player:loadstart', () => {
      this.loadStartTime = Date.now();
      this.trackEvent('load_start', {
        timestamp: this.loadStartTime
      });
    });

    this.on('player:canplay', () => {
      const loadTime = Date.now() - this.loadStartTime;
      this.trackEvent('can_play', {
        loadTime,
        timestamp: Date.now()
      });
    });

    this.on('player:firstframe', () => {
      this.firstFrameTime = Date.now();
      const timeToFirstFrame = this.firstFrameTime - this.loadStartTime;
      this.trackEvent('first_frame', {
        timeToFirstFrame,
        timestamp: this.firstFrameTime
      });
    });
  }

  /**
   * Setup quality metrics tracking
   */
  private setupQualityMetricsTracking(): void {
    this.on('player:qualitychange', (data: { quality: string; bitrate: number; resolution: string }) => {
      this.trackEvent('quality_metrics', {
        quality: data.quality,
        bitrate: data.bitrate,
        resolution: data.resolution,
        timestamp: Date.now()
      });
    });

    this.on('player:droppedframes', (data: { dropped: number; total: number }) => {
      this.trackEvent('dropped_frames', {
        droppedFrames: data.dropped,
        totalFrames: data.total,
        dropRate: (data.dropped / data.total) * 100,
        timestamp: Date.now()
      });
    });
  }

  /**
   * Setup network metrics tracking
   */
  private setupNetworkMetricsTracking(): void {
    this.on('player:bandwidth', (data: { bandwidth: number; downloadSpeed: number }) => {
      this.trackEvent('network_metrics', {
        bandwidth: data.bandwidth,
        downloadSpeed: data.downloadSpeed,
        timestamp: Date.now()
      });
    });

    this.on('player:networkchange', (data: { connectionType: string; effectiveType: string }) => {
      this.trackEvent('network_change', {
        connectionType: data.connectionType,
        effectiveType: data.effectiveType,
        timestamp: Date.now()
      });
    });
  }

  /**
   * Setup buffer health tracking
   */
  private setupBufferHealthTracking(): void {
    this.on('player:waiting', () => {
      this.rebufferingStart = Date.now();
      this.rebufferingCount++;
      this.trackEvent('rebuffering_start', {
        rebufferingCount: this.rebufferingCount,
        timestamp: this.rebufferingStart
      });
    });

    this.on('player:canplaythrough', () => {
      if (this.rebufferingStart > 0) {
        const rebufferingDuration = Date.now() - this.rebufferingStart;
        this.totalRebufferingDuration += rebufferingDuration;
        
        this.trackEvent('rebuffering_end', {
          duration: rebufferingDuration,
          totalRebufferingDuration: this.totalRebufferingDuration,
          rebufferingCount: this.rebufferingCount,
          timestamp: Date.now()
        });
        
        this.rebufferingStart = 0;
      }
    });

    this.on('player:progress', (data: { buffered: number; duration: number }) => {
      const bufferHealth = (data.buffered / data.duration) * 100;
      this.trackEvent('buffer_health', {
        bufferHealth,
        bufferedSeconds: data.buffered,
        totalDuration: data.duration,
        timestamp: Date.now()
      });
    });
  }

  /**
   * Start continuous performance monitoring
   */
  private startPerformanceMonitoring(): void {
    this.performanceTimer = setInterval(() => {
      this.collectPerformanceSnapshot();
    }, this.performanceConfig.monitoringInterval);
  }

  /**
   * Collect current performance snapshot
   */
  private collectPerformanceSnapshot(): void {
    // This would collect real-time performance data
    const snapshot = {
      timestamp: Date.now(),
      memoryUsage: this.getMemoryUsage(),
      cpuUsage: this.getCpuUsage(),
      networkStatus: this.getNetworkStatus(),
      playbackHealth: this.getPlaybackHealth()
    };

    this.trackEvent('performance_snapshot', snapshot);
  }

  /**
   * Calculate rebuffering rate
   */
  private calculateRebufferingRate(): number {
    const totalPlaytime = Date.now() - this.loadStartTime;
    return totalPlaytime > 0 ? (this.totalRebufferingDuration / totalPlaytime) * 100 : 0;
  }

  /**
   * Calculate pause frequency
   */
  private calculatePauseFrequency(behavior: PlayerBehaviorData): number {
    return behavior.watchTime > 0 ? behavior.pauseCount / (behavior.watchTime / 60) : 0;
  }

  /**
   * Get memory usage (placeholder)
   */
  private getMemoryUsage(): number {
    // Would implement actual memory usage detection
    return 0;
  }

  /**
   * Get CPU usage (placeholder)
   */
  private getCpuUsage(): number {
    // Would implement actual CPU usage detection
    return 0;
  }

  /**
   * Get network status (placeholder)
   */
  private getNetworkStatus(): string {
    // Would implement actual network status detection
    return 'unknown';
  }

  /**
   * Get playback health (placeholder)
   */
  private getPlaybackHealth(): string {
    // Would implement actual playback health assessment
    return 'good';
  }

  /**
   * Cleanup on destroy
   */
  public async destroy(): Promise<void> {
    if (this.performanceTimer) {
      clearInterval(this.performanceTimer);
    }
    
    // Send final performance summary
    this.trackEvent('performance_summary', {
      totalRebufferingDuration: this.totalRebufferingDuration,
      rebufferingCount: this.rebufferingCount,
      rebufferingRate: this.calculateRebufferingRate(),
      sessionDuration: Date.now() - this.loadStartTime,
      timestamp: Date.now()
    });
    
    await super.destroy();
  }
}
