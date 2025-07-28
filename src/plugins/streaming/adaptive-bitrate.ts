/**
 * Adaptive Bitrate Manager Plugin
 * 
 * Manages adaptive bitrate streaming with intelligent quality switching
 * based on network conditions, device capabilities, and user preferences.
 * Supports multiple streaming protocols and optimizes viewing experience.
 */

import { BasePlugin, type PluginConfig } from '../base-plugin';

interface AdaptiveBitrateConfig extends PluginConfig {
  // Quality switching strategy
  strategy: 'bandwidth' | 'buffer' | 'hybrid' | 'ml';
  
  // Network monitoring
  networkMonitoring: {
    enabled: boolean;
    sampleInterval: number;      // Network sampling interval (ms)
    stableThreshold: number;     // Network stability threshold
    adaptationDelay: number;     // Delay before quality change (ms)
  };
  
  // Quality levels configuration
  qualityLevels: {
    auto: boolean;               // Enable automatic quality selection
    manual: boolean;             // Allow manual quality selection
    maxQuality: string;          // Maximum allowed quality
    minQuality: string;          // Minimum allowed quality
    preferredQualities: string[]; // Preferred quality order
  };
  
  // Buffer management
  bufferManagement: {
    targetBuffer: number;        // Target buffer duration (seconds)
    maxBuffer: number;           // Maximum buffer duration (seconds)
    minBuffer: number;           // Minimum buffer before rebuffering
    emergencyBuffer: number;     // Emergency buffer threshold
  };
  
  // Performance optimization
  optimization: {
    preload: boolean;            // Preload next quality segments
    jumpToHighQuality: boolean;  // Quick jump to high quality when possible
    smoothTransitions: boolean;  // Smooth quality transitions
    bitrateSmoothing: number;    // Bitrate averaging window (seconds)
  };
  
  // Device adaptation
  deviceAdaptation: {
    enabled: boolean;
    screenSizeWeight: number;    // Screen size influence on quality
    batteryWeight: number;       // Battery level influence on quality
    cpuWeight: number;          // CPU usage influence on quality
  };
  
  // Advanced features
  advanced: {
    segmentPrefetch: boolean;    // Prefetch future segments
    qualityPrediction: boolean;  // Use ML for quality prediction
    userBehaviorAdaptation: boolean; // Adapt based on user behavior
    multiCDN: boolean;          // Multi-CDN support
  };
}

interface QualityLevel {
  id: string;
  label: string;
  width: number;
  height: number;
  bitrate: number;
  codecs: string;
  frameRate?: number;
  bandwidth: number;
  url?: string;
}

interface NetworkMetrics {
  bandwidth: number;           // Current bandwidth (bits/s)
  latency: number;            // Network latency (ms)
  packetLoss: number;         // Packet loss percentage
  jitter: number;             // Network jitter (ms)
  stability: number;          // Network stability score (0-1)
  timestamp: number;
}

interface BufferMetrics {
  currentBuffer: number;      // Current buffer level (seconds)
  targetReached: boolean;     // Target buffer reached
  isStarving: boolean;        // Buffer starvation detected
  rebufferCount: number;      // Number of rebuffer events
  lastRebuffer: number;       // Last rebuffer timestamp
}

interface QualityChangeEvent {
  oldQuality: QualityLevel;
  newQuality: QualityLevel;
  reason: string;
  automatic: boolean;
  timestamp: number;
  metrics: {
    bandwidth: number;
    buffer: number;
    cpu: number;
  };
}

/**
 * Adaptive bitrate streaming manager
 */
export class AdaptiveBitratePlugin extends BasePlugin {
  readonly id = 'adaptive-bitrate';
  readonly name = 'Adaptive Bitrate Manager';
  readonly version = '1.0.0';
  readonly type = 'streaming';
  
  private videoElement?: HTMLVideoElement;
  private qualityLevels: QualityLevel[] = [];
  private currentQuality?: QualityLevel;
  private networkMetrics: NetworkMetrics[] = [];
  private bufferMetrics: BufferMetrics = {
    currentBuffer: 0,
    targetReached: false,
    isStarving: false,
    rebufferCount: 0,
    lastRebuffer: 0
  };
  
  // Monitoring intervals
  private networkMonitor?: NodeJS.Timeout;
  private bufferMonitor?: NodeJS.Timeout;
  private qualityMonitor?: NodeJS.Timeout;
  
  // Performance tracking
  private downloadStartTime: number = 0;
  private downloadedBytes: number = 0;
  private lastQualityChange: number = 0;
  
  // ML prediction model (simplified)
  private qualityPredictionModel?: {
    weights: number[];
    bias: number;
    features: string[];
  };
  
  constructor(config: AdaptiveBitrateConfig) {
    super(config);
    this.initializePredictionModel();
  }

  async initialize(videoElement?: HTMLVideoElement): Promise<void> {
    if (videoElement) {
      this.videoElement = videoElement;
    }
    
    await this.setupEventListeners();
    await this.startMonitoring();
    
    this.isInitialized = true;
    this.emit('adaptiveBitrateInitialized', {
      plugin: this.name,
      strategy: (this.config as AdaptiveBitrateConfig).strategy
    });
  }

  async destroy(): Promise<void> {
    this.stopMonitoring();
    this.isInitialized = false;
  }

  /**
   * Setup event listeners for video and network events
   */
  private async setupEventListeners(): Promise<void> {
    if (!this.videoElement) return;
    
    // Video events
    this.videoElement.addEventListener('loadstart', () => {
      this.resetMetrics();
    });
    
    this.videoElement.addEventListener('progress', () => {
      this.updateDownloadMetrics();
    });
    
    this.videoElement.addEventListener('waiting', () => {
      this.handleBuffering();
    });
    
    this.videoElement.addEventListener('canplay', () => {
      this.handleCanPlay();
    });
    
    this.videoElement.addEventListener('error', (event) => {
      this.handleStreamError(event);
    });
    
    // Network events
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      connection.addEventListener('change', () => {
        this.handleNetworkChange();
      });
    }
    
    // Page visibility for optimization
    document.addEventListener('visibilitychange', () => {
      this.handleVisibilityChange();
    });
  }

  /**
   * Start monitoring network and buffer conditions
   */
  private async startMonitoring(): Promise<void> {
    const config = this.config as AdaptiveBitrateConfig;
    
    // Network monitoring
    if (config.networkMonitoring.enabled) {
      this.networkMonitor = setInterval(() => {
        this.measureNetwork();
      }, config.networkMonitoring.sampleInterval);
    }
    
    // Buffer monitoring
    this.bufferMonitor = setInterval(() => {
      this.updateBufferMetrics();
    }, 1000); // Every second
    
    // Quality decision monitoring
    this.qualityMonitor = setInterval(() => {
      this.evaluateQualityChange();
    }, 2000); // Every 2 seconds
  }

  /**
   * Stop all monitoring
   */
  private stopMonitoring(): void {
    if (this.networkMonitor) {
      clearInterval(this.networkMonitor);
    }
    if (this.bufferMonitor) {
      clearInterval(this.bufferMonitor);
    }
    if (this.qualityMonitor) {
      clearInterval(this.qualityMonitor);
    }
  }

  /**
   * Initialize ML prediction model for quality decisions
   */
  private initializePredictionModel(): void {
    // Simplified linear regression model for quality prediction
    this.qualityPredictionModel = {
      weights: [0.4, 0.3, 0.2, 0.1], // [bandwidth, buffer, cpu, history]
      bias: 0.5,
      features: ['bandwidth', 'buffer', 'cpu', 'history']
    };
  }

  /**
   * Measure current network performance
   */
  private async measureNetwork(): Promise<void> {
    try {
      const startTime = performance.now();
      
      // Simple bandwidth test using small image
      const testImage = new Image();
      const imageUrl = `data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7?${Date.now()}`;
      
      testImage.onload = () => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        // Estimate bandwidth (simplified)
        const bandwidth = this.estimateBandwidth(duration);
        
        const metrics: NetworkMetrics = {
          bandwidth,
          latency: duration,
          packetLoss: 0, // Simplified - would need more complex measurement
          jitter: this.calculateJitter(),
          stability: this.calculateNetworkStability(),
          timestamp: Date.now()
        };
        
        this.networkMetrics.push(metrics);
        
        // Keep only recent measurements
        if (this.networkMetrics.length > 20) {
          this.networkMetrics.shift();
        }
        
        this.emit('networkMetricsUpdated', metrics);
      };
      
      testImage.src = imageUrl;
    } catch (error) {
      console.warn('Network measurement failed:', error);
    }
  }

  /**
   * Estimate bandwidth from measurement
   */
  private estimateBandwidth(duration: number): number {
    // Simplified bandwidth estimation
    // In real implementation, would use larger test files and more sophisticated methods
    const baselineDuration = 50; // ms for baseline connection
    const maxBandwidth = 10000000; // 10 Mbps baseline
    
    if (duration <= 0) return maxBandwidth;
    
    const ratio = baselineDuration / duration;
    return Math.min(maxBandwidth * ratio, maxBandwidth * 2);
  }

  /**
   * Calculate network jitter
   */
  private calculateJitter(): number {
    if (this.networkMetrics.length < 2) return 0;
    
    const recent = this.networkMetrics.slice(-5);
    const latencies = recent.map(m => m.latency);
    
    let jitter = 0;
    for (let i = 1; i < latencies.length; i++) {
      jitter += Math.abs(latencies[i] - latencies[i - 1]);
    }
    
    return jitter / (latencies.length - 1);
  }

  /**
   * Calculate network stability score
   */
  private calculateNetworkStability(): number {
    if (this.networkMetrics.length < 3) return 0.5;
    
    const recent = this.networkMetrics.slice(-10);
    const bandwidths = recent.map(m => m.bandwidth);
    
    // Calculate coefficient of variation
    const mean = bandwidths.reduce((a, b) => a + b, 0) / bandwidths.length;
    const variance = bandwidths.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / bandwidths.length;
    const stdDev = Math.sqrt(variance);
    
    const cv = stdDev / mean;
    
    // Convert to stability score (0-1, higher is more stable)
    return Math.max(0, Math.min(1, 1 - cv));
  }

  /**
   * Update buffer metrics
   */
  private updateBufferMetrics(): void {
    if (!this.videoElement) return;
    
    const buffered = this.videoElement.buffered;
    const currentTime = this.videoElement.currentTime;
    
    let bufferAhead = 0;
    for (let i = 0; i < buffered.length; i++) {
      if (buffered.start(i) <= currentTime && currentTime <= buffered.end(i)) {
        bufferAhead = buffered.end(i) - currentTime;
        break;
      }
    }
    
    const config = this.config as AdaptiveBitrateConfig;
    const previousBuffer = this.bufferMetrics.currentBuffer;
    
    this.bufferMetrics.currentBuffer = bufferAhead;
    this.bufferMetrics.targetReached = bufferAhead >= config.bufferManagement.targetBuffer;
    
    // Detect buffer starvation
    const wasStarving = this.bufferMetrics.isStarving;
    this.bufferMetrics.isStarving = bufferAhead < config.bufferManagement.minBuffer;
    
    if (!wasStarving && this.bufferMetrics.isStarving) {
      this.bufferMetrics.rebufferCount++;
      this.bufferMetrics.lastRebuffer = Date.now();
      this.emit('bufferStarvation', {
        bufferLevel: bufferAhead,
        rebufferCount: this.bufferMetrics.rebufferCount
      });
    }
    
    this.emit('bufferMetricsUpdated', this.bufferMetrics);
  }

  /**
   * Evaluate if quality change is needed
   */
  private evaluateQualityChange(): void {
    const config = this.config as AdaptiveBitrateConfig;
    
    // Don't change too frequently
    if (Date.now() - this.lastQualityChange < config.networkMonitoring.adaptationDelay) {
      return;
    }
    
    const optimalQuality = this.determineOptimalQuality();
    
    if (optimalQuality && optimalQuality.id !== this.currentQuality?.id) {
      this.changeQuality(optimalQuality, 'automatic');
    }
  }

  /**
   * Determine optimal quality based on current conditions
   */
  private determineOptimalQuality(): QualityLevel | null {
    if (this.qualityLevels.length === 0) return null;
    
    const config = this.config as AdaptiveBitrateConfig;
    
    switch (config.strategy) {
      case 'bandwidth':
        return this.selectQualityByBandwidth();
      case 'buffer':
        return this.selectQualityByBuffer();
      case 'hybrid':
        return this.selectQualityHybrid();
      case 'ml':
        return this.selectQualityML();
      default:
        return this.selectQualityHybrid();
    }
  }

  /**
   * Select quality based on bandwidth
   */
  private selectQualityByBandwidth(): QualityLevel | null {
    if (this.networkMetrics.length === 0) return null;
    
    const currentBandwidth = this.getAverageBandwidth();
    const availableQualities = this.getAvailableQualities();
    
    // Find highest quality that fits bandwidth with safety margin
    const safetyMargin = 0.8; // Use 80% of available bandwidth
    const targetBandwidth = currentBandwidth * safetyMargin;
    
    let bestQuality = availableQualities[0]; // Start with lowest
    
    for (const quality of availableQualities) {
      if (quality.bandwidth <= targetBandwidth) {
        bestQuality = quality;
      } else {
        break;
      }
    }
    
    return bestQuality;
  }

  /**
   * Select quality based on buffer level
   */
  private selectQualityByBuffer(): QualityLevel | null {
    const config = this.config as AdaptiveBitrateConfig;
    const availableQualities = this.getAvailableQualities();
    
    if (this.bufferMetrics.isStarving) {
      // Buffer starving - select lowest quality
      return availableQualities[0];
    } else if (this.bufferMetrics.currentBuffer >= config.bufferManagement.targetBuffer * 1.5) {
      // Good buffer - can try higher quality
      return availableQualities[availableQualities.length - 1];
    } else {
      // Medium buffer - stay with current or slightly adjust
      const currentIndex = this.currentQuality 
        ? availableQualities.findIndex(q => q.id === this.currentQuality!.id)
        : Math.floor(availableQualities.length / 2);
      
      return availableQualities[Math.max(0, currentIndex)];
    }
  }

  /**
   * Select quality using hybrid approach
   */
  private selectQualityHybrid(): QualityLevel | null {
    const bandwidthQuality = this.selectQualityByBandwidth();
    const bufferQuality = this.selectQualityByBuffer();
    
    if (!bandwidthQuality || !bufferQuality) {
      return bandwidthQuality || bufferQuality;
    }
    
    const availableQualities = this.getAvailableQualities();
    
    // Take more conservative choice between bandwidth and buffer
    const bandwidthIndex = availableQualities.findIndex(q => q.id === bandwidthQuality.id);
    const bufferIndex = availableQualities.findIndex(q => q.id === bufferQuality.id);
    
    const selectedIndex = Math.min(bandwidthIndex, bufferIndex);
    return availableQualities[selectedIndex];
  }

  /**
   * Select quality using ML prediction
   */
  private selectQualityML(): QualityLevel | null {
    if (!this.qualityPredictionModel) {
      return this.selectQualityHybrid();
    }
    
    const features = this.extractFeaturesForML();
    const prediction = this.predictOptimalQuality(features);
    
    const availableQualities = this.getAvailableQualities();
    const qualityIndex = Math.floor(prediction * availableQualities.length);
    
    return availableQualities[Math.min(qualityIndex, availableQualities.length - 1)];
  }

  /**
   * Extract features for ML prediction
   */
  private extractFeaturesForML(): number[] {
    const bandwidth = this.getAverageBandwidth() / 10000000; // Normalize to ~0-1
    const buffer = Math.min(this.bufferMetrics.currentBuffer / 30, 1); // Normalize to 0-1
    const cpu = this.getCPUUsageEstimate(); // 0-1
    const history = this.getQualityHistory(); // 0-1
    
    return [bandwidth, buffer, cpu, history];
  }

  /**
   * Predict optimal quality using ML model
   */
  private predictOptimalQuality(features: number[]): number {
    if (!this.qualityPredictionModel) return 0.5;
    
    const { weights, bias } = this.qualityPredictionModel;
    
    let prediction = bias;
    for (let i = 0; i < Math.min(features.length, weights.length); i++) {
      prediction += features[i] * weights[i];
    }
    
    // Apply sigmoid activation
    return 1 / (1 + Math.exp(-prediction));
  }

  /**
   * Get average bandwidth from recent measurements
   */
  private getAverageBandwidth(): number {
    if (this.networkMetrics.length === 0) return 5000000; // 5 Mbps default
    
    const config = this.config as AdaptiveBitrateConfig;
    const windowSize = Math.min(this.networkMetrics.length, 5);
    const recent = this.networkMetrics.slice(-windowSize);
    
    const sum = recent.reduce((acc, metric) => acc + metric.bandwidth, 0);
    return sum / recent.length;
  }

  /**
   * Get available quality levels sorted by bitrate
   */
  private getAvailableQualities(): QualityLevel[] {
    return [...this.qualityLevels].sort((a, b) => a.bitrate - b.bitrate);
  }

  /**
   * Estimate CPU usage (simplified)
   */
  private getCPUUsageEstimate(): number {
    // Simplified CPU estimation based on dropped frames
    if (!this.videoElement) return 0.5;
    
    const videoPlaybackQuality = (this.videoElement as any).getVideoPlaybackQuality?.();
    if (videoPlaybackQuality) {
      const { droppedVideoFrames, totalVideoFrames } = videoPlaybackQuality;
      if (totalVideoFrames > 0) {
        return Math.min(droppedVideoFrames / totalVideoFrames, 1);
      }
    }
    
    return 0.3; // Default moderate CPU usage
  }

  /**
   * Get quality change history score
   */
  private getQualityHistory(): number {
    // Simplified: return stability score based on recent quality changes
    // Higher score = more stable quality
    return 0.7; // Default stability score
  }

  /**
   * Change video quality
   */
  private changeQuality(newQuality: QualityLevel, reason: string): void {
    if (!this.videoElement || !newQuality) return;
    
    const oldQuality = this.currentQuality;
    
    // Create quality change event
    const changeEvent: QualityChangeEvent = {
      oldQuality: oldQuality!,
      newQuality,
      reason,
      automatic: reason !== 'manual',
      timestamp: Date.now(),
      metrics: {
        bandwidth: this.getAverageBandwidth(),
        buffer: this.bufferMetrics.currentBuffer,
        cpu: this.getCPUUsageEstimate()
      }
    };
    
    // Apply quality change
    if (newQuality.url && this.videoElement.src !== newQuality.url) {
      const currentTime = this.videoElement.currentTime;
      const wasPlaying = !this.videoElement.paused;
      
      this.videoElement.src = newQuality.url;
      this.videoElement.currentTime = currentTime;
      
      if (wasPlaying) {
        this.videoElement.play();
      }
    }
    
    this.currentQuality = newQuality;
    this.lastQualityChange = Date.now();
    
    this.emit('qualityChanged', changeEvent);
  }

  /**
   * Handle various events
   */
  private resetMetrics(): void {
    this.networkMetrics = [];
    this.bufferMetrics = {
      currentBuffer: 0,
      targetReached: false,
      isStarving: false,
      rebufferCount: 0,
      lastRebuffer: 0
    };
  }

  private updateDownloadMetrics(): void {
    // Track download progress for bandwidth calculation
    this.downloadedBytes += 1024; // Simplified increment
  }

  private handleBuffering(): void {
    this.emit('bufferingStarted', {
      currentBuffer: this.bufferMetrics.currentBuffer,
      timestamp: Date.now()
    });
  }

  private handleCanPlay(): void {
    this.emit('bufferingEnded', {
      currentBuffer: this.bufferMetrics.currentBuffer,
      timestamp: Date.now()
    });
  }

  private handleStreamError(event: Event): void {
    this.emit('streamError', {
      error: event,
      currentQuality: this.currentQuality,
      timestamp: Date.now()
    });
  }

  private handleNetworkChange(): void {
    // Reset network metrics when network changes
    this.networkMetrics = [];
    this.emit('networkChanged', {
      timestamp: Date.now()
    });
  }

  private handleVisibilityChange(): void {
    const config = this.config as AdaptiveBitrateConfig;
    
    if (document.hidden && config.optimization.smoothTransitions) {
      // Reduce quality when page is hidden to save bandwidth
      const lowestQuality = this.getAvailableQualities()[0];
      if (lowestQuality) {
        this.changeQuality(lowestQuality, 'background');
      }
    }
  }

  // Public API methods

  /**
   * Set available quality levels
   */
  setQualityLevels(qualities: QualityLevel[]): void {
    this.qualityLevels = qualities;
    
    // Auto-select initial quality
    if (!this.currentQuality && qualities.length > 0) {
      const initialQuality = this.determineOptimalQuality() || qualities[0];
      this.changeQuality(initialQuality, 'initial');
    }
    
    this.emit('qualityLevelsUpdated', {
      qualities: this.qualityLevels
    });
  }

  /**
   * Get current quality
   */
  getCurrentQuality(): QualityLevel | undefined {
    return this.currentQuality;
  }

  /**
   * Get available qualities
   */
  getQualityLevels(): QualityLevel[] {
    return [...this.qualityLevels];
  }

  /**
   * Manually change quality
   */
  setQuality(qualityId: string): boolean {
    const quality = this.qualityLevels.find(q => q.id === qualityId);
    if (quality) {
      this.changeQuality(quality, 'manual');
      return true;
    }
    return false;
  }

  /**
   * Get current network metrics
   */
  getNetworkMetrics(): NetworkMetrics[] {
    return [...this.networkMetrics];
  }

  /**
   * Get current buffer metrics
   */
  getBufferMetrics(): BufferMetrics {
    return { ...this.bufferMetrics };
  }

  /**
   * Force quality evaluation
   */
  evaluateQuality(): void {
    this.evaluateQualityChange();
  }
}

// Default configuration
export const defaultAdaptiveBitrateConfig: AdaptiveBitrateConfig = {
  enabled: true,
  strategy: 'hybrid',
  networkMonitoring: {
    enabled: true,
    sampleInterval: 5000,
    stableThreshold: 0.8,
    adaptationDelay: 3000
  },
  qualityLevels: {
    auto: true,
    manual: true,
    maxQuality: 'auto',
    minQuality: 'auto',
    preferredQualities: ['1080p', '720p', '480p', '360p']
  },
  bufferManagement: {
    targetBuffer: 10,
    maxBuffer: 30,
    minBuffer: 2,
    emergencyBuffer: 1
  },
  optimization: {
    preload: true,
    jumpToHighQuality: false,
    smoothTransitions: true,
    bitrateSmoothing: 5
  },
  deviceAdaptation: {
    enabled: true,
    screenSizeWeight: 0.3,
    batteryWeight: 0.2,
    cpuWeight: 0.5
  },
  advanced: {
    segmentPrefetch: true,
    qualityPrediction: true,
    userBehaviorAdaptation: true,
    multiCDN: false
  }
};
