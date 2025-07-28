/**
 * Main VideoEngine Class (ROOT)
 * Orchestrates different streaming engines and strategies
 * This is the primary entry point for video playback functionality
 */

import { getBrowserCapabilities, type BrowserCapabilities } from './compatibility';
import { FormatDetector } from './format-detector';
import { QualityManager } from './quality-manager';
import { ErrorHandler } from './error-handler';

// Import engine implementations
import { HlsEngine } from './engines/hls-engine';
import { DashEngine } from './engines/dash-engine';
import { NativeEngine } from './engines/native-engine';
import { ProgressiveEngine } from './engines/progressive-engine';
import { WebRtcEngine } from './engines/webrtc-engine';

// Import strategies
import { AdaptiveStrategy } from './strategies/adaptive-strategy';
import { BandwidthStrategy } from './strategies/bandwidth-strategy';
import { QualityStrategy } from './strategies/quality-strategy';
import { FallbackStrategy } from './strategies/fallback-strategy';

import type { 
  EngineInterface, 
  EngineEventHandlers 
} from './engines/types';
import type { 
  VideoFormat, 
  VideoError, 
  EngineMetrics, 
  PlaybackState,
  VideoEngineOptions
} from '../types/engine';

// Re-export types
export type { VideoError, EngineMetrics, PlaybackState, VideoFormat, VideoEngineOptions };

export interface VideoEngineConfig {
  src: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  playsInline?: boolean;
  preferNativeHls?: boolean;
  enableAdaptiveBitrate?: boolean;
  enableDebugLogs?: boolean;
}

export interface VideoEngineEvents {
  onReady: () => void;
  onPlay: () => void;
  onPause: () => void;
  onTimeUpdate: (currentTime: number, duration: number) => void;
  onProgress: (buffered: number) => void;
  onVolumeChange: (volume: number, muted: boolean) => void;
  onQualityChange: (quality: string) => void;
  onError: (error: VideoError) => void;
  onLoadStart: () => void;
  onLoadEnd: () => void;
  onBuffering: (isBuffering: boolean) => void;
  onMetricsUpdate: (metrics: EngineMetrics) => void;
}

export class VideoEngine {
  private videoElement: HTMLVideoElement;
  private capabilities?: BrowserCapabilities;
  private currentEngine?: EngineInterface;
  private currentFormat?: VideoFormat;
  private events: Partial<VideoEngineEvents> = {};
  
  // Core managers
  private qualityManager: QualityManager;
  private errorHandler: ErrorHandler;
  
  // Strategies
  private adaptiveStrategy: AdaptiveStrategy;
  private bandwidthStrategy: BandwidthStrategy;
  private qualityStrategy: QualityStrategy;
  private fallbackStrategy: FallbackStrategy;
  
  // State
  private isInitialized = false;
  private engineOptions: VideoEngineOptions;
  private metricsInterval?: NodeJS.Timeout;

  constructor(
    videoElement: HTMLVideoElement, 
    events: Partial<VideoEngineEvents> = {},
    options: Partial<VideoEngineOptions> = {}
  ) {
    this.videoElement = videoElement;
    this.events = events;
    
    this.engineOptions = {
      enableAdaptiveBitrate: true,
      enableDebugLogs: false,
      maxBufferSize: 30,
      maxRetries: 3,
      retryDelay: 1000,
      preferNativeHls: false,
      enableWorkerMode: true,
      ...options
    };

    // Initialize managers
    this.qualityManager = new QualityManager({
      enableAutoQuality: this.engineOptions.enableAdaptiveBitrate
    });

    this.errorHandler = new ErrorHandler({
      enableAutoRecovery: true,
      maxRetries: this.engineOptions.maxRetries,
      retryDelay: this.engineOptions.retryDelay,
      logErrors: this.engineOptions.enableDebugLogs
    });

    // Initialize strategies
    this.adaptiveStrategy = new AdaptiveStrategy();
    this.bandwidthStrategy = new BandwidthStrategy();
    this.qualityStrategy = new QualityStrategy({
      enableABR: this.engineOptions.enableAdaptiveBitrate
    });
    this.fallbackStrategy = new FallbackStrategy();

    this.setupErrorHandler();
  }

  /**
   * Initialize the video engine with capabilities detection
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      this.log('Initializing VideoEngine...');
      
      // Detect browser capabilities
      this.capabilities = await getBrowserCapabilities();
      this.log('Browser capabilities detected:', this.capabilities);

      // Initialize strategies
      this.adaptiveStrategy.initialize();
      this.bandwidthStrategy.initialize();
      this.qualityStrategy.initialize();
      this.fallbackStrategy.initialize();

      this.isInitialized = true;
      
      if (this.events.onReady) {
        this.events.onReady();
      }

    } catch (error) {
      this.log('Failed to initialize VideoEngine:', error);
      await this.errorHandler.handleError(
        'CAPABILITY_ERROR',
        'ENGINE_INIT_FAILED',
        'Failed to initialize video engine',
        error
      );
      throw error;
    }
  }

  /**
   * Load and play video source with enhanced debugging
   */
  async loadSource(config: VideoEngineConfig): Promise<void> {
    console.log('🔧 VideoEngine.loadSource() called with config:', config);
    
    // Auto-initialize if needed
    if (!this.isInitialized) {
      console.log('🚀 Auto-initializing VideoEngine...');
      await this.initialize();
    }

    try {
      console.log('📁 Loading source:', config.src);

      // Detect video format
      this.currentFormat = FormatDetector.detectFormat(config.src);
      console.log('🎯 Detected format:', this.currentFormat);

      // Configure video element
      console.log('⚙️ Configuring video element...');
      this.configureVideoElement(config);

      // Select and initialize appropriate engine
      const engineType = this.selectEngine(this.currentFormat);
      console.log('🎮 Selected engine type:', engineType);
      
      console.log('🔨 Creating engine instance...');
      this.currentEngine = await this.createEngine(engineType);
      console.log('✅ Engine instance created successfully');

      // Setup event handlers
      console.log('📡 Setting up engine event handlers...');
      this.setupEngineEventHandlers();

      // Load source
      console.log('📦 Loading source into engine...');
      await this.currentEngine.load(config.src);
      console.log('✅ Source loaded into engine successfully');

      // Initialize quality management
      const qualityLevels = this.currentEngine.getQualityLevels?.() || [];
      console.log('📊 Quality levels available:', qualityLevels);
      this.qualityManager.initialize(qualityLevels);
      this.adaptiveStrategy.setQualityLevels?.(qualityLevels);

      // Start metrics collection
      console.log('📈 Starting metrics collection...');
      this.startMetricsCollection();

      console.log('🎉 VideoEngine source loaded successfully!');

    } catch (error) {
      console.error('❌ VideoEngine.loadSource() failed:', error);
      await this.errorHandler.handleError(
        'MEDIA_ERROR',
        'LOAD_FAILED',
        'Failed to load video source',
        error
      );
      throw error;
    }
  }

  /**
   * Start playback
   */
  async play(): Promise<void> {
    if (!this.currentEngine) {
      throw new Error('No engine initialized');
    }

    await this.currentEngine.play();
  }

  /**
   * Pause playback
   */
  pause(): void {
    if (!this.currentEngine) {
      return;
    }

    this.currentEngine.pause();
  }

  /**
   * Seek to specific time
   */
  seek(time: number): void {
    if (!this.currentEngine) {
      return;
    }

    this.currentEngine.seek(time);
  }

  /**
   * Set volume (0-1)
   */
  setVolume(volume: number): void {
    if (!this.currentEngine) {
      return;
    }

    this.currentEngine.setVolume(volume);
  }

  /**
   * Set muted state
   */
  setMuted(muted: boolean): void {
    if (!this.currentEngine) {
      return;
    }

    this.currentEngine.setMuted(muted);
  }

  /**
   * Set playback rate
   */
  setPlaybackRate(rate: number): void {
    if (!this.currentEngine) {
      return;
    }

    this.currentEngine.setPlaybackRate(rate);
  }

  /**
   * Get current metrics
   */
  getMetrics(): EngineMetrics | null {
    if (!this.currentEngine) {
      return null;
    }

    return this.currentEngine.getMetrics();
  }

  /**
   * Get current playback state
   */
  getState(): PlaybackState | null {
    if (!this.currentEngine) {
      return null;
    }

    return this.currentEngine.getState();
  }

  /**
   * Get browser capabilities
   */
  getCapabilities(): BrowserCapabilities | undefined {
    return this.capabilities;
  }

  /**
   * Get current streaming quality info
   */
  getStreamingQuality() {
    return this.qualityManager.getStreamingQuality();
  }

  /**
   * Set quality level manually
   */
  setQualityLevel(qualityId: string): boolean {
    return this.qualityManager.setQuality(qualityId);
  }

  /**
   * Enable/disable auto quality
   */
  setAutoQuality(enabled: boolean): void {
    this.qualityManager.setAutoMode(enabled);
  }

  /**
   * Select appropriate engine based on format and capabilities
   */
  private selectEngine(format: VideoFormat): string {
    if (!this.capabilities) {
      return 'native';
    }

    switch (format.type) {
      case 'hls':
        if (this.engineOptions.preferNativeHls && this.capabilities.hasNativeHls) {
          return 'native';
        }
        return this.capabilities.hasHlsJs ? 'hls' : 'native';
        
      case 'dash':
        return this.capabilities.hasDashJs ? 'dash' : 'native';
        
      case 'webrtc':
        return 'webrtc';
        
      case 'mp4':
      case 'webm':
      case 'ogv':
        return 'progressive';
        
      default:
        return 'native';
    }
  }

  /**
   * Create engine instance
   */
  private async createEngine(engineType: string): Promise<EngineInterface> {
    const eventHandlers: EngineEventHandlers = {
      onReady: () => this.events.onReady?.(),
      onPlay: () => this.events.onPlay?.(),
      onPause: () => this.events.onPause?.(),
      onTimeUpdate: (time, duration) => this.events.onTimeUpdate?.(time, duration),
      onProgress: (buffered) => this.events.onProgress?.(buffered),
      onVolumeChange: (volume, muted) => this.events.onVolumeChange?.(volume, muted),
      onQualityChange: (quality) => this.events.onQualityChange?.(quality),
      onError: (error) => this.events.onError?.(error),
      onLoadStart: () => this.events.onLoadStart?.(),
      onLoadEnd: () => this.events.onLoadEnd?.(),
      onBuffering: (isBuffering) => this.events.onBuffering?.(isBuffering),
      onMetricsUpdate: (metrics) => this.events.onMetricsUpdate?.(metrics)
    };

    switch (engineType) {
      case 'hls':
        const hlsEngine = new HlsEngine(this.videoElement, {
          enableWorkerMode: this.engineOptions.enableWorkerMode,
          debug: this.engineOptions.enableDebugLogs
        }, eventHandlers);
        await hlsEngine.initialize();
        return hlsEngine;

      case 'dash':
        const dashEngine = new DashEngine(this.videoElement, {
          debug: {
            logLevel: this.engineOptions.enableDebugLogs ? 'DEBUG' : 'WARN'
          }
        }, eventHandlers);
        await dashEngine.initialize();
        return dashEngine;

      case 'webrtc':
        const webrtcEngine = new WebRtcEngine(this.videoElement, {}, eventHandlers);
        await webrtcEngine.initialize();
        return webrtcEngine;

      case 'progressive':
        const progressiveEngine = new ProgressiveEngine(this.videoElement, {}, eventHandlers);
        await progressiveEngine.initialize();
        return progressiveEngine;

      case 'native':
      default:
        const nativeEngine = new NativeEngine(this.videoElement, {}, eventHandlers);
        await nativeEngine.initialize();
        return nativeEngine;
    }
  }

  /**
   * Configure video element with settings
   */
  private configureVideoElement(config: VideoEngineConfig): void {
    this.videoElement.autoplay = config.autoplay ?? false;
    this.videoElement.muted = config.muted ?? false;
    this.videoElement.loop = config.loop ?? false;
    this.videoElement.playsInline = config.playsInline ?? true;
    
    if (config.poster) {
      this.videoElement.poster = config.poster;
    }
  }

  /**
   * Setup modern engine event handlers for time tracking and progress
   */
  private setupEngineEventHandlers(): void {
    console.log('📡 Setting up modern engine event handlers...');
    
    // Modern time update tracking
    this.videoElement.addEventListener('timeupdate', () => {
      const currentTime = this.videoElement.currentTime;
      const duration = this.videoElement.duration || 0;
      
      if (duration > 0) {
        console.log('⏰ Time update:', {
          currentTime: currentTime.toFixed(2),
          duration: duration.toFixed(2),
          percentage: ((currentTime / duration) * 100).toFixed(1) + '%'
        });
        
        if (this.events.onTimeUpdate) {
          this.events.onTimeUpdate(currentTime, duration);
        }
      }
    });

    // Modern progress tracking
    this.videoElement.addEventListener('progress', () => {
      if (this.videoElement.buffered.length > 0 && this.videoElement.duration > 0) {
        const bufferedEnd = this.videoElement.buffered.end(this.videoElement.buffered.length - 1);
        const bufferedPercentage = (bufferedEnd / this.videoElement.duration) * 100;
        
        console.log('📡 Buffer progress:', bufferedPercentage.toFixed(1) + '%');
        
        if (this.events.onProgress) {
          this.events.onProgress(bufferedPercentage);
        }
      }
    });

    // Modern playback state tracking
    this.videoElement.addEventListener('play', () => {
      console.log('▶️ Video element play event');
      if (this.events.onPlay) {
        this.events.onPlay();
      }
    });

    this.videoElement.addEventListener('pause', () => {
      console.log('⏸️ Video element pause event');
      if (this.events.onPause) {
        this.events.onPause();
      }
    });

    // Modern volume tracking
    this.videoElement.addEventListener('volumechange', () => {
      console.log('🔊 Volume change:', {
        volume: this.videoElement.volume,
        muted: this.videoElement.muted
      });
      
      if (this.events.onVolumeChange) {
        this.events.onVolumeChange(this.videoElement.volume, this.videoElement.muted);
      }
    });

    // Modern loading state tracking
    this.videoElement.addEventListener('loadstart', () => {
      console.log('⏳ Load start event');
      if (this.events.onLoadStart) {
        this.events.onLoadStart();
      }
    });

    this.videoElement.addEventListener('loadeddata', () => {
      console.log('✅ Load data event');
      if (this.events.onLoadEnd) {
        this.events.onLoadEnd();
      }
    });

    this.videoElement.addEventListener('canplay', () => {
      console.log('✅ Can play event');
      if (this.events.onReady) {
        this.events.onReady();
      }
    });

    // Modern error tracking
    this.videoElement.addEventListener('error', (e) => {
      console.error('❌ Video element error:', e);
      if (this.events.onError) {
        this.events.onError({
          type: 'MEDIA_ERROR',
          code: 'PLAYBACK_ERROR',
          message: 'Video playback error',
          details: e,
          recoverable: true,
          timestamp: Date.now()
        });
      }
    });

    console.log('✅ Modern engine event handlers setup complete');
  }

  /**
   * Setup error handler callbacks
   */
  private setupErrorHandler(): void {
    this.errorHandler.setErrorHandler((error: VideoError) => {
      this.log('Error handled:', error);
      
      if (this.events.onError) {
        this.events.onError(error);
      }
    });
  }

  /**
   * Start metrics collection and strategy evaluation
   */
  private startMetricsCollection(): void {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
    }

    this.metricsInterval = setInterval(() => {
      if (!this.currentEngine) {
        return;
      }

      const metrics = this.currentEngine.getMetrics();
      
      // Update quality manager
      this.qualityManager.updateMetrics(metrics);
      
      // Evaluate strategies
      const adaptiveResult = this.adaptiveStrategy.evaluate(metrics);
      const bandwidthResult = this.bandwidthStrategy.evaluate(metrics);
      const qualityResult = this.qualityStrategy.evaluate(metrics);
      
      // Apply strategy recommendations
      if (adaptiveResult.shouldChangeQuality && adaptiveResult.targetQuality) {
        this.qualityManager.setQuality(adaptiveResult.targetQuality.id);
      }

      // Notify metrics update
      if (this.events.onMetricsUpdate) {
        this.events.onMetricsUpdate(metrics);
      }

    }, 2000); // Evaluate every 2 seconds
  }

  /**
   * Log debug messages
   */
  private log(...args: any[]): void {
    if (this.engineOptions.enableDebugLogs) {
      console.log('[VideoEngine]', ...args);
    }
  }

  /**
   * Cleanup and destroy
   */
  destroy(): void {
    this.log('Destroying VideoEngine...');

    // Stop metrics collection
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
      this.metricsInterval = undefined;
    }

    // Destroy current engine
    if (this.currentEngine) {
      this.currentEngine.destroy();
      this.currentEngine = undefined;
    }

    // Reset managers
    this.qualityManager.destroy();
    this.errorHandler.clearErrorHistory();

    // Reset strategies
    this.adaptiveStrategy.destroy();
    this.bandwidthStrategy.destroy();
    this.qualityStrategy.destroy();
    this.fallbackStrategy.destroy();

    this.isInitialized = false;
    this.log('VideoEngine destroyed');
  }
}
