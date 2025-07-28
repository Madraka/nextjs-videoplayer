/**
 * Quality Prediction Plugin
 * 
 * AI-powered video quality optimization that predicts optimal quality levels
 * based on network conditions, device capabilities, and user behavior.
 */

import { BasePlugin } from '../base-plugin';

/**
 * Quality prediction result
 */
export interface QualityPrediction {
  /** Recommended quality level */
  recommendedQuality: string;
  /** Confidence in prediction (0-1) */
  confidence: number;
  /** Predicted bandwidth requirement (bps) */
  bandwidthRequirement: number;
  /** Buffer recommendation (seconds) */
  bufferRecommendation: number;
  /** Quality change timing */
  changeTimestamp: number;
  /** Reasoning for the prediction */
  reasoning: string[];
}

/**
 * Network condition metrics
 */
export interface NetworkMetrics {
  /** Available bandwidth (bps) */
  bandwidth: number;
  /** Network latency (ms) */
  latency: number;
  /** Connection type */
  connectionType: string;
  /** Signal strength (0-1) */
  signalStrength: number;
  /** Packet loss percentage */
  packetLoss: number;
  /** Jitter (ms) */
  jitter: number;
}

/**
 * Device capability metrics
 */
export interface DeviceCapabilities {
  /** CPU performance score (0-1) */
  cpuPerformance: number;
  /** GPU performance score (0-1) */
  gpuPerformance: number;
  /** Available memory (MB) */
  availableMemory: number;
  /** Screen resolution */
  screenResolution: {
    width: number;
    height: number;
  };
  /** Maximum supported resolution */
  maxResolution: string;
  /** Hardware decoding support */
  hardwareDecoding: boolean;
}

/**
 * User behavior patterns
 */
export interface UserBehavior {
  /** Average session duration (seconds) */
  avgSessionDuration: number;
  /** Quality change frequency */
  qualityChangeFrequency: number;
  /** Preferred quality levels */
  preferredQualities: string[];
  /** Bandwidth usage patterns */
  bandwidthPatterns: BandwidthPattern[];
  /** Time of day usage */
  timePatterns: TimePattern[];
}

/**
 * Bandwidth usage pattern
 */
export interface BandwidthPattern {
  /** Time period */
  period: string;
  /** Average bandwidth during period */
  avgBandwidth: number;
  /** Quality preferences during period */
  qualityPreference: string;
}

/**
 * Time-based usage pattern
 */
export interface TimePattern {
  /** Hour of day (0-23) */
  hour: number;
  /** Average quality used */
  avgQuality: string;
  /** Bandwidth availability */
  avgBandwidth: number;
}

/**
 * Quality prediction configuration
 */
export interface QualityPredictionConfig {
  /** Enable/disable quality prediction */
  enabled: boolean;
  /** ML model endpoint */
  modelEndpoint?: string;
  /** API key for ML service */
  apiKey?: string;
  /** Prediction interval (seconds) */
  predictionInterval: number;
  /** Features to consider */
  features: {
    networkMetrics: boolean;
    deviceCapabilities: boolean;
    userBehavior: boolean;
    contentAnalysis: boolean;
    timeOfDay: boolean;
  };
  /** Prediction sensitivity */
  sensitivity: 'conservative' | 'balanced' | 'aggressive';
  /** Quality levels available */
  availableQualities: QualityLevel[];
  /** Adaptation settings */
  adaptation: {
    minBufferBeforeUpgrade: number;
    maxBufferForDowngrade: number;
    stallPenalty: number;
    rebufferThreshold: number;
  };
}

/**
 * Quality level definition
 */
export interface QualityLevel {
  /** Quality identifier */
  id: string;
  /** Display name */
  name: string;
  /** Resolution */
  resolution: string;
  /** Bitrate (bps) */
  bitrate: number;
  /** Frame rate */
  fps: number;
  /** Codec */
  codec: string;
}

/**
 * Quality prediction plugin implementation
 */
export class QualityPredictionPlugin extends BasePlugin {
  public readonly id = 'quality-prediction';
  public readonly name = 'Quality Prediction';
  public readonly version = '1.0.0';
  public readonly type = 'ai';

  private predictionConfig: QualityPredictionConfig;
  private currentMetrics: {
    network?: NetworkMetrics;
    device?: DeviceCapabilities;
    behavior?: UserBehavior;
  } = {};
  private predictionHistory: QualityPrediction[] = [];
  private predictionTimer?: NodeJS.Timeout;
  private isCollectingData: boolean = false;

  constructor(config: QualityPredictionConfig) {
    super(config);
    this.predictionConfig = {
      ...config,
      enabled: config.enabled ?? true,
      predictionInterval: config.predictionInterval ?? 5,
      sensitivity: config.sensitivity ?? 'balanced'
    };
  }

  /**
   * Initialize quality prediction
   */
  public async initialize(): Promise<void> {
    if (!this.predictionConfig.enabled) {
      return;
    }

    await this.initializeDataCollection();
    this.setupEventListeners();
    this.startPredictionLoop();
    
    this.isInitialized = true;
  }

  /**
   * Get quality prediction
   */
  public async predictOptimalQuality(): Promise<QualityPrediction> {
    // Collect current metrics
    await this.updateMetrics();

    // Generate prediction
    const prediction = await this.generatePrediction();
    
    // Store prediction
    this.predictionHistory.push(prediction);
    
    // Emit prediction event
    this.emit('prediction:generated', prediction);
    
    return prediction;
  }

  /**
   * Get prediction history
   */
  public getPredictionHistory(): QualityPrediction[] {
    return [...this.predictionHistory];
  }

  /**
   * Update user behavior data
   */
  public updateUserBehavior(behavior: Partial<UserBehavior>): void {
    this.currentMetrics.behavior = {
      ...this.currentMetrics.behavior,
      ...behavior
    } as UserBehavior;
    
    this.emit('behavior:updated', this.currentMetrics.behavior);
  }

  /**
   * Force quality prediction update
   */
  public async forcePredictionUpdate(): Promise<QualityPrediction> {
    return this.predictOptimalQuality();
  }

  /**
   * Initialize data collection
   */
  private async initializeDataCollection(): Promise<void> {
    this.isCollectingData = true;
    
    // Initialize device capability detection
    if (this.predictionConfig.features.deviceCapabilities) {
      this.currentMetrics.device = await this.detectDeviceCapabilities();
    }
    
    // Initialize network monitoring
    if (this.predictionConfig.features.networkMetrics) {
      await this.startNetworkMonitoring();
    }
    
    // Initialize user behavior tracking
    if (this.predictionConfig.features.userBehavior) {
      this.initializeUserBehaviorTracking();
    }
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    this.on('player:qualitychange', (data: { from: string; to: string }) => {
      this.trackQualityChange(data.from, data.to);
    });
    
    this.on('player:stalled', () => {
      this.trackBufferingEvent();
    });
    
    this.on('player:progress', (data: { buffered: number }) => {
      this.trackBufferLevel(data.buffered);
    });
    
    this.on('player:loadedmetadata', () => {
      this.startPredictionLoop();
    });
  }

  /**
   * Start prediction loop
   */
  private startPredictionLoop(): void {
    if (this.predictionTimer) {
      clearInterval(this.predictionTimer);
    }
    
    this.predictionTimer = setInterval(async () => {
      try {
        await this.predictOptimalQuality();
      } catch (error) {
        console.error('Prediction failed:', error);
      }
    }, this.predictionConfig.predictionInterval * 1000);
  }

  /**
   * Update all metrics
   */
  private async updateMetrics(): Promise<void> {
    if (this.predictionConfig.features.networkMetrics) {
      this.currentMetrics.network = await this.measureNetworkMetrics();
    }
    
    if (this.predictionConfig.features.deviceCapabilities) {
      this.currentMetrics.device = await this.updateDeviceMetrics();
    }
  }

  /**
   * Generate quality prediction
   */
  private async generatePrediction(): Promise<QualityPrediction> {
    if (this.predictionConfig.modelEndpoint) {
      return this.generateMLPrediction();
    } else {
      return this.generateRuleBasedPrediction();
    }
  }

  /**
   * Generate ML-based prediction
   */
  private async generateMLPrediction(): Promise<QualityPrediction> {
    const features = {
      network: this.currentMetrics.network,
      device: this.currentMetrics.device,
      behavior: this.currentMetrics.behavior,
      timestamp: Date.now(),
      timeOfDay: new Date().getHours()
    };

    try {
      const response = await fetch(this.predictionConfig.modelEndpoint!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.predictionConfig.apiKey && {
            'Authorization': `Bearer ${this.predictionConfig.apiKey}`
          })
        },
        body: JSON.stringify({ features })
      });

      if (!response.ok) {
        throw new Error(`ML API error: ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        recommendedQuality: result.quality,
        confidence: result.confidence,
        bandwidthRequirement: result.bandwidth,
        bufferRecommendation: result.buffer,
        changeTimestamp: Date.now(),
        reasoning: result.reasoning || ['ML model prediction']
      };

    } catch (error) {
      console.error('ML prediction failed, falling back to rule-based:', error);
      return this.generateRuleBasedPrediction();
    }
  }

  /**
   * Generate rule-based prediction
   */
  private generateRuleBasedPrediction(): Promise<QualityPrediction> {
    const reasoning: string[] = [];
    let recommendedQuality = 'auto';
    let confidence = 0.7;
    let bandwidthRequirement = 0;
    let bufferRecommendation = 5;

    // Network-based decisions
    if (this.currentMetrics.network) {
      const { bandwidth, latency, connectionType } = this.currentMetrics.network;
      
      if (bandwidth < 1000000) { // < 1 Mbps
        recommendedQuality = '240p';
        reasoning.push('Low bandwidth detected');
        bandwidthRequirement = 500000;
      } else if (bandwidth < 3000000) { // < 3 Mbps
        recommendedQuality = '480p';
        reasoning.push('Medium bandwidth available');
        bandwidthRequirement = 1500000;
      } else if (bandwidth < 8000000) { // < 8 Mbps
        recommendedQuality = '720p';
        reasoning.push('Good bandwidth available');
        bandwidthRequirement = 4000000;
      } else {
        recommendedQuality = '1080p';
        reasoning.push('High bandwidth available');
        bandwidthRequirement = 6000000;
      }

      if (latency > 200) {
        bufferRecommendation = 10;
        reasoning.push('High latency detected, increasing buffer');
      }

      if (connectionType === 'cellular') {
        // Be more conservative on mobile
        const qualities = ['240p', '480p', '720p', '1080p'];
        const currentIndex = qualities.indexOf(recommendedQuality);
        if (currentIndex > 0) {
          recommendedQuality = qualities[Math.max(0, currentIndex - 1)];
          reasoning.push('Mobile connection, reducing quality');
        }
      }
    }

    // Device-based adjustments
    if (this.currentMetrics.device) {
      const { cpuPerformance, screenResolution, maxResolution } = this.currentMetrics.device;
      
      if (cpuPerformance < 0.5) {
        const qualities = ['240p', '480p', '720p', '1080p'];
        const currentIndex = qualities.indexOf(recommendedQuality);
        if (currentIndex > 0) {
          recommendedQuality = qualities[Math.max(0, currentIndex - 1)];
          reasoning.push('Low CPU performance detected');
        }
      }

      if (screenResolution.height < 720 && recommendedQuality === '1080p') {
        recommendedQuality = '720p';
        reasoning.push('Screen resolution does not require 1080p');
      }
    }

    // User behavior adjustments
    if (this.currentMetrics.behavior?.preferredQualities.length) {
      const userPreferred = this.currentMetrics.behavior.preferredQualities[0];
      const qualities = ['240p', '480p', '720p', '1080p'];
      const recommendedIndex = qualities.indexOf(recommendedQuality);
      const preferredIndex = qualities.indexOf(userPreferred);
      
      if (Math.abs(recommendedIndex - preferredIndex) <= 1) {
        recommendedQuality = userPreferred;
        reasoning.push('Adjusted based on user preference');
        confidence = 0.9;
      }
    }

    return Promise.resolve({
      recommendedQuality,
      confidence,
      bandwidthRequirement,
      bufferRecommendation,
      changeTimestamp: Date.now(),
      reasoning
    });
  }

  /**
   * Detect device capabilities
   */
  private async detectDeviceCapabilities(): Promise<DeviceCapabilities> {
    const capabilities: DeviceCapabilities = {
      cpuPerformance: this.estimateCPUPerformance(),
      gpuPerformance: this.estimateGPUPerformance(),
      availableMemory: this.estimateAvailableMemory(),
      screenResolution: {
        width: window.screen.width,
        height: window.screen.height
      },
      maxResolution: this.determineMaxResolution(),
      hardwareDecoding: await this.checkHardwareDecoding()
    };

    return capabilities;
  }

  /**
   * Estimate CPU performance
   */
  private estimateCPUPerformance(): number {
    // Simple CPU benchmark
    const start = performance.now();
    let result = 0;
    for (let i = 0; i < 100000; i++) {
      result += Math.sqrt(i);
    }
    const end = performance.now();
    const duration = end - start;
    
    // Normalize to 0-1 scale (lower duration = better performance)
    return Math.max(0, Math.min(1, 1 - (duration / 100)));
  }

  /**
   * Estimate GPU performance
   */
  private estimateGPUPerformance(): number {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
    
    if (!gl) return 0.3; // Low performance if no WebGL
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      // Simple heuristic based on GPU name
      if (renderer && typeof renderer === 'string') {
        if (renderer.includes('Intel')) return 0.5;
        if (renderer.includes('NVIDIA') || renderer.includes('AMD')) return 0.8;
      }
    }
    
    return 0.6; // Default moderate performance
  }

  /**
   * Estimate available memory
   */
  private estimateAvailableMemory(): number {
    // Use memory API if available
    if ('memory' in performance) {
      const memInfo = (performance as any).memory;
      return memInfo.usedJSHeapSize / 1024 / 1024; // Convert to MB
    }
    
    // Fallback estimation
    return 1024; // Default 1GB
  }

  /**
   * Determine maximum supported resolution
   */
  private determineMaxResolution(): string {
    const { width, height } = window.screen;
    
    if (width >= 1920 && height >= 1080) return '1080p';
    if (width >= 1280 && height >= 720) return '720p';
    if (width >= 854 && height >= 480) return '480p';
    return '240p';
  }

  /**
   * Check hardware decoding support
   */
  private async checkHardwareDecoding(): Promise<boolean> {
    // Check for hardware decoding hints
    const video = document.createElement('video');
    video.muted = true;
    
    // Check codec support
    const h264Support = video.canPlayType('video/mp4; codecs="avc1.42E01E"');
    const h265Support = video.canPlayType('video/mp4; codecs="hev1.1.6.L93.B0"');
    
    return h264Support === 'probably' || h265Support === 'probably';
  }

  /**
   * Start network monitoring
   */
  private async startNetworkMonitoring(): Promise<void> {
    // Use Network Information API if available
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      const updateNetworkInfo = () => {
        this.currentMetrics.network = {
          bandwidth: connection.downlink * 1000000, // Convert Mbps to bps
          latency: connection.rtt,
          connectionType: connection.effectiveType,
          signalStrength: 1, // Not available in API
          packetLoss: 0, // Not available in API
          jitter: 0 // Not available in API
        };
      };

      connection.addEventListener('change', updateNetworkInfo);
      updateNetworkInfo();
    }
  }

  /**
   * Measure network metrics
   */
  private async measureNetworkMetrics(): Promise<NetworkMetrics> {
    if (this.currentMetrics.network) {
      return this.currentMetrics.network;
    }

    // Fallback measurement
    return {
      bandwidth: 5000000, // Default 5 Mbps
      latency: 50,
      connectionType: 'unknown',
      signalStrength: 0.8,
      packetLoss: 0,
      jitter: 10
    };
  }

  /**
   * Update device metrics
   */
  private async updateDeviceMetrics(): Promise<DeviceCapabilities> {
    if (this.currentMetrics.device) {
      // Update dynamic metrics
      this.currentMetrics.device.availableMemory = this.estimateAvailableMemory();
      this.currentMetrics.device.cpuPerformance = this.estimateCPUPerformance();
      return this.currentMetrics.device;
    }

    return this.detectDeviceCapabilities();
  }

  /**
   * Initialize user behavior tracking
   */
  private initializeUserBehaviorTracking(): void {
    // Initialize with default behavior data
    this.currentMetrics.behavior = {
      avgSessionDuration: 300, // 5 minutes default
      qualityChangeFrequency: 0.1,
      preferredQualities: ['720p'],
      bandwidthPatterns: [],
      timePatterns: []
    };
  }

  /**
   * Track quality changes
   */
  private trackQualityChange(from: string, to: string): void {
    if (this.currentMetrics.behavior) {
      this.currentMetrics.behavior.qualityChangeFrequency += 0.1;
      
      // Update preferred qualities
      const preferred = this.currentMetrics.behavior.preferredQualities;
      if (!preferred.includes(to)) {
        preferred.unshift(to);
        preferred.splice(3); // Keep only top 3
      }
    }
  }

  /**
   * Track buffering events
   */
  private trackBufferingEvent(): void {
    // Penalize current quality recommendation
    if (this.predictionHistory.length > 0) {
      const lastPrediction = this.predictionHistory[this.predictionHistory.length - 1];
      lastPrediction.confidence *= 0.8; // Reduce confidence
    }
  }

  /**
   * Track buffer levels
   */
  private trackBufferLevel(buffered: number): void {
    // Use buffer level to adjust recommendations
    this.emit('buffer:updated', { level: buffered });
  }

  /**
   * Cleanup on destroy
   */
  public async destroy(): Promise<void> {
    this.isCollectingData = false;
    
    if (this.predictionTimer) {
      clearInterval(this.predictionTimer);
    }
    
    this.predictionHistory = [];
    this.currentMetrics = {};
    this.eventListeners.clear();
  }
}
