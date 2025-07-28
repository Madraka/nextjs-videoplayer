/**
 * HLS Engine Implementation
 * Handles HLS.js integration for adaptive streaming
 */

import type { 
  EngineInterface, 
  EngineEventHandlers, 
  EngineState, 
  HlsEngineConfig 
} from './types';
import type { 
  EngineMetrics, 
  PlaybackState, 
  VideoError, 
  QualityLevel 
} from '../../types';

export class HlsEngine implements EngineInterface {
  private videoElement: HTMLVideoElement;
  private hlsInstance?: any; // HLS.js instance
  private config: HlsEngineConfig;
  private eventHandlers: EngineEventHandlers;
  private state: EngineState;
  private metrics: EngineMetrics;

  constructor(
    videoElement: HTMLVideoElement,
    config: Partial<HlsEngineConfig> = {},
    eventHandlers: EngineEventHandlers = {}
  ) {
    this.videoElement = videoElement;
    this.eventHandlers = eventHandlers;
    
    this.config = {
      enableWorkerMode: true,
      maxBufferLength: 30,
      maxMaxBufferLength: 600,
      startLevel: -1, // Auto start level
      capLevelToPlayerSize: true,
      debug: false,
      ...config
    };

    this.state = {
      isInitialized: false,
      isLoading: false,
      hasError: false,
      engineType: 'hls'
    };

    this.metrics = {
      bufferHealth: 0,
      droppedFrames: 0,
      currentBitrate: 0,
      networkSpeed: 0,
      latency: 0,
      rebuffering: false
    };
  }

  /**
   * Initialize HLS.js library
   */
  async initialize(): Promise<void> {
    try {
      // Dynamic import of HLS.js
      const Hls = await import('hls.js').then(m => m.default);

      if (!Hls.isSupported()) {
        throw new Error('HLS.js is not supported in this browser');
      }

      // Create HLS instance with configuration
      this.hlsInstance = new Hls({
        enableWorker: this.config.enableWorkerMode,
        maxBufferLength: this.config.maxBufferLength,
        maxMaxBufferLength: this.config.maxMaxBufferLength,
        startLevel: this.config.startLevel,
        capLevelToPlayerSize: this.config.capLevelToPlayerSize,
        debug: this.config.debug,
        
        // Additional optimizations
        lowLatencyMode: false,
        backBufferLength: 90,
        maxBufferSize: 60 * 1000 * 1000, // 60MB
        maxBufferHole: 0.5,
        
        // Network optimizations
        manifestLoadingTimeOut: 10000,
        manifestLoadingMaxRetry: 1,
        manifestLoadingRetryDelay: 1000,
        levelLoadingTimeOut: 10000,
        levelLoadingMaxRetry: 4,
        levelLoadingRetryDelay: 1000,
        fragLoadingTimeOut: 20000,
        fragLoadingMaxRetry: 6,
        fragLoadingRetryDelay: 1000
      });

      this.setupHlsEventHandlers();
      this.state.isInitialized = true;

      if (this.eventHandlers.onReady) {
        this.eventHandlers.onReady();
      }

    } catch (error) {
      this.handleError('CAPABILITY_ERROR', 'HLS_INIT_FAILED', 
        'Failed to initialize HLS.js', error);
      throw error;
    }
  }

  /**
   * Load HLS stream
   */
  async load(src: string): Promise<void> {
    if (!this.hlsInstance) {
      throw new Error('HLS engine not initialized');
    }

    try {
      this.state.isLoading = true;
      this.state.currentSrc = src;

      if (this.eventHandlers.onLoadStart) {
        this.eventHandlers.onLoadStart();
      }

      // Attach to video element
      this.hlsInstance.attachMedia(this.videoElement);

      // Load source
      this.hlsInstance.loadSource(src);

      // Wait for manifest to be parsed
      await new Promise<void>((resolve, reject) => {
        const onManifestParsed = () => {
          this.hlsInstance.off('hlsManifestParsed', onManifestParsed);
          this.hlsInstance.off('hlsError', onError);
          resolve();
        };

        const onError = (event: any, data: any) => {
          this.hlsInstance.off('hlsManifestParsed', onManifestParsed);
          this.hlsInstance.off('hlsError', onError);
          reject(new Error(`HLS load error: ${data.details}`));
        };

        this.hlsInstance.on('hlsManifestParsed', onManifestParsed);
        this.hlsInstance.on('hlsError', onError);
      });

      this.state.isLoading = false;

      if (this.eventHandlers.onLoadEnd) {
        this.eventHandlers.onLoadEnd();
      }

    } catch (error) {
      this.state.isLoading = false;
      this.handleError('MEDIA_ERROR', 'HLS_LOAD_FAILED', 
        'Failed to load HLS stream', error);
      throw error;
    }
  }

  /**
   * Start playback
   */
  async play(): Promise<void> {
    try {
      await this.videoElement.play();
    } catch (error) {
      this.handleError('MEDIA_ERROR', 'PLAY_FAILED', 
        'Failed to start playback', error);
      throw error;
    }
  }

  /**
   * Pause playback
   */
  pause(): void {
    this.videoElement.pause();
  }

  /**
   * Seek to specific time
   */
  seek(time: number): void {
    this.videoElement.currentTime = time;
  }

  /**
   * Set volume level
   */
  setVolume(volume: number): void {
    this.videoElement.volume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Set muted state
   */
  setMuted(muted: boolean): void {
    this.videoElement.muted = muted;
  }

  /**
   * Set playback rate
   */
  setPlaybackRate(rate: number): void {
    this.videoElement.playbackRate = rate;
  }

  /**
   * Get current quality levels
   */
  getQualityLevels(): QualityLevel[] {
    if (!this.hlsInstance || !this.hlsInstance.levels) {
      return [];
    }

    return this.hlsInstance.levels.map((level: any, index: number) => ({
      id: index.toString(),
      label: `${level.height}p`,
      width: level.width || 0,
      height: level.height || 0,
      bitrate: level.bitrate || 0,
      frameRate: level.frameRate
    }));
  }

  /**
   * Set quality level
   */
  setQualityLevel(levelId: string): void {
    if (!this.hlsInstance) {
      return;
    }

    const level = parseInt(levelId, 10);
    this.hlsInstance.currentLevel = level;
  }

  /**
   * Enable auto quality selection
   */
  setAutoQuality(enabled: boolean): void {
    if (!this.hlsInstance) {
      return;
    }

    this.hlsInstance.currentLevel = enabled ? -1 : this.hlsInstance.currentLevel;
  }

  /**
   * Get current engine metrics
   */
  getMetrics(): EngineMetrics {
    this.updateMetrics();
    return { ...this.metrics };
  }

  /**
   * Get current playback state
   */
  getState(): PlaybackState {
    return {
      isPlaying: !this.videoElement.paused && !this.videoElement.ended,
      isPaused: this.videoElement.paused,
      isBuffering: this.videoElement.readyState < 3,
      currentTime: this.videoElement.currentTime,
      duration: this.videoElement.duration || 0,
      volume: this.videoElement.volume,
      muted: this.videoElement.muted,
      playbackRate: this.videoElement.playbackRate
    };
  }

  /**
   * Setup HLS.js event handlers
   */
  private setupHlsEventHandlers(): void {
    if (!this.hlsInstance) {
      return;
    }

    // Quality level changes
    this.hlsInstance.on('hlsLevelSwitched', (event: any, data: any) => {
      const level = this.hlsInstance.levels[data.level];
      if (level && this.eventHandlers.onQualityChange) {
        this.eventHandlers.onQualityChange(`${level.height}p`);
      }
    });

    // Error handling
    this.hlsInstance.on('hlsError', (event: any, data: any) => {
      console.warn('HLS Error:', data);
      
      if (data.fatal) {
        this.handleError('MEDIA_ERROR', data.details, 
          `Fatal HLS error: ${data.details}`, data);
      }
    });

    // Stats updates
    this.hlsInstance.on('hlsFragLoaded', (event: any, data: any) => {
      this.updateNetworkMetrics(data.stats);
    });

    this.hlsInstance.on('hlsLevelLoaded', (event: any, data: any) => {
      this.updateBufferMetrics();
    });
  }

  /**
   * Update network metrics from HLS stats
   */
  private updateNetworkMetrics(stats: any): void {
    if (stats && stats.total && stats.loading) {
      const bandwidth = (stats.total * 8) / (stats.loading.end - stats.loading.start) * 1000;
      this.metrics.networkSpeed = bandwidth;
      this.metrics.latency = stats.loading.first - stats.loading.start;
    }

    if (this.hlsInstance && this.hlsInstance.levels) {
      const currentLevel = this.hlsInstance.levels[this.hlsInstance.currentLevel];
      if (currentLevel) {
        this.metrics.currentBitrate = currentLevel.bitrate;
      }
    }
  }

  /**
   * Update buffer metrics
   */
  private updateBufferMetrics(): void {
    const buffered = this.videoElement.buffered;
    const currentTime = this.videoElement.currentTime;
    
    if (buffered.length > 0) {
      // Find current buffer range
      let bufferEnd = 0;
      for (let i = 0; i < buffered.length; i++) {
        if (buffered.start(i) <= currentTime && buffered.end(i) > currentTime) {
          bufferEnd = buffered.end(i);
          break;
        }
      }
      
      const bufferAhead = Math.max(0, bufferEnd - currentTime);
      this.metrics.bufferHealth = Math.min(1, bufferAhead / 30); // 30s is healthy
    }

    // Check if rebuffering
    this.metrics.rebuffering = this.videoElement.readyState < 3 && !this.videoElement.paused;
  }

  /**
   * Update all metrics
   */
  private updateMetrics(): void {
    this.updateBufferMetrics();
    
    // Update dropped frames (if available)
    if ('getVideoPlaybackQuality' in this.videoElement) {
      const quality = (this.videoElement as any).getVideoPlaybackQuality();
      this.metrics.droppedFrames = quality.droppedVideoFrames;
    }
  }

  /**
   * Handle errors with proper formatting
   */
  private handleError(type: any, code: string, message: string, details?: any): void {
    this.state.hasError = true;
    
    const error: VideoError = {
      type,
      code,
      message,
      details,
      recoverable: true,
      timestamp: Date.now()
    };

    this.state.lastError = error;

    if (this.eventHandlers.onError) {
      this.eventHandlers.onError(error);
    }
  }

  /**
   * Destroy and cleanup
   */
  destroy(): void {
    if (this.hlsInstance) {
      this.hlsInstance.destroy();
      this.hlsInstance = undefined;
    }

    this.state.isInitialized = false;
    this.state.hasError = false;
    this.state.lastError = undefined;
  }
}
