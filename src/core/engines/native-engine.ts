/**
 * Native Engine Implementation
 * Handles native HTML5 video playback (including native HLS)
 */

import type { 
  EngineInterface, 
  EngineEventHandlers, 
  EngineState, 
  NativeEngineConfig 
} from './types';
import type { 
  EngineMetrics, 
  PlaybackState, 
  VideoError, 
  QualityLevel 
} from '../../types';

export class NativeEngine implements EngineInterface {
  private videoElement: HTMLVideoElement;
  private config: NativeEngineConfig;
  private eventHandlers: EngineEventHandlers;
  private state: EngineState;
  private metrics: EngineMetrics;
  private metricsInterval?: NodeJS.Timeout;

  constructor(
    videoElement: HTMLVideoElement,
    config: Partial<NativeEngineConfig> = {},
    eventHandlers: EngineEventHandlers = {}
  ) {
    this.videoElement = videoElement;
    this.eventHandlers = eventHandlers;
    
    this.config = {
      preload: 'metadata',
      disableRemotePlayback: false,
      ...config
    };

    this.state = {
      isInitialized: false,
      isLoading: false,
      hasError: false,
      engineType: 'native'
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
   * Initialize native video element
   */
  async initialize(): Promise<void> {
    try {
      // Configure video element
      this.configureVideoElement();
      this.setupEventHandlers();
      
      // Start metrics collection
      this.startMetricsCollection();

      this.state.isInitialized = true;

      if (this.eventHandlers.onReady) {
        this.eventHandlers.onReady();
      }

    } catch (error) {
      this.handleError('CAPABILITY_ERROR', 'NATIVE_INIT_FAILED', 
        'Failed to initialize native engine', error);
      throw error;
    }
  }

  /**
   * Load video source
   */
  async load(src: string): Promise<void> {
    try {
      this.state.isLoading = true;
      this.state.currentSrc = src;

      if (this.eventHandlers.onLoadStart) {
        this.eventHandlers.onLoadStart();
      }

      // Set source
      this.videoElement.src = src;

      // Wait for metadata to load
      await new Promise<void>((resolve, reject) => {
        const onLoadedMetadata = () => {
          this.videoElement.removeEventListener('loadedmetadata', onLoadedMetadata);
          this.videoElement.removeEventListener('error', onError);
          resolve();
        };

        const onError = () => {
          this.videoElement.removeEventListener('loadedmetadata', onLoadedMetadata);
          this.videoElement.removeEventListener('error', onError);
          reject(new Error('Failed to load video metadata'));
        };

        this.videoElement.addEventListener('loadedmetadata', onLoadedMetadata);
        this.videoElement.addEventListener('error', onError);

        // Start loading
        this.videoElement.load();
      });

      this.state.isLoading = false;

      if (this.eventHandlers.onLoadEnd) {
        this.eventHandlers.onLoadEnd();
      }

    } catch (error) {
      this.state.isLoading = false;
      this.handleError('MEDIA_ERROR', 'NATIVE_LOAD_FAILED', 
        'Failed to load video source', error);
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
   * Get current quality levels (limited for native)
   */
  getQualityLevels(): QualityLevel[] {
    // Native video doesn't expose quality levels directly
    // For HLS native support, we can estimate based on video dimensions
    const width = this.videoElement.videoWidth;
    const height = this.videoElement.videoHeight;

    if (width > 0 && height > 0) {
      return [{
        id: 'auto',
        label: `${height}p`,
        width,
        height,
        bitrate: 0, // Unknown for native
        frameRate: undefined
      }];
    }

    return [];
  }

  /**
   * Set quality level (no-op for native)
   */
  setQualityLevel(levelId: string): void {
    // Native video doesn't support manual quality selection
    console.warn('Quality level selection not supported in native mode');
  }

  /**
   * Enable auto quality selection (no-op for native)
   */
  setAutoQuality(enabled: boolean): void {
    // Native video handles this automatically
    console.info('Auto quality is always enabled in native mode');
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
   * Configure video element with settings
   */
  private configureVideoElement(): void {
    // Set preload behavior
    this.videoElement.preload = this.config.preload;

    // Set cross-origin if specified
    if (this.config.crossOrigin) {
      this.videoElement.crossOrigin = this.config.crossOrigin;
    }

    // Disable remote playback if specified
    if (this.config.disableRemotePlayback) {
      this.videoElement.disableRemotePlayback = true;
    }

    // Enable inline playback on iOS
    this.videoElement.playsInline = true;

    // Set additional attributes for better compatibility
    this.videoElement.setAttribute('playsinline', '');
    this.videoElement.setAttribute('webkit-playsinline', '');
  }

  /**
   * Setup video element event handlers
   */
  private setupEventHandlers(): void {
    // Playback events
    this.videoElement.addEventListener('play', () => {
      if (this.eventHandlers.onPlay) {
        this.eventHandlers.onPlay();
      }
    });

    this.videoElement.addEventListener('pause', () => {
      if (this.eventHandlers.onPause) {
        this.eventHandlers.onPause();
      }
    });

    this.videoElement.addEventListener('timeupdate', () => {
      if (this.eventHandlers.onTimeUpdate) {
        this.eventHandlers.onTimeUpdate(
          this.videoElement.currentTime,
          this.videoElement.duration || 0
        );
      }
    });

    this.videoElement.addEventListener('progress', () => {
      if (this.eventHandlers.onProgress) {
        const buffered = this.getBufferedPercentage();
        this.eventHandlers.onProgress(buffered);
      }
    });

    // Volume events
    this.videoElement.addEventListener('volumechange', () => {
      if (this.eventHandlers.onVolumeChange) {
        this.eventHandlers.onVolumeChange(
          this.videoElement.volume,
          this.videoElement.muted
        );
      }
    });

    // Loading events
    this.videoElement.addEventListener('loadstart', () => {
      if (this.eventHandlers.onLoadStart) {
        this.eventHandlers.onLoadStart();
      }
    });

    this.videoElement.addEventListener('canplay', () => {
      if (this.eventHandlers.onLoadEnd) {
        this.eventHandlers.onLoadEnd();
      }
    });

    // Buffer events
    this.videoElement.addEventListener('waiting', () => {
      this.metrics.rebuffering = true;
      if (this.eventHandlers.onBuffering) {
        this.eventHandlers.onBuffering(true);
      }
    });

    this.videoElement.addEventListener('canplay', () => {
      this.metrics.rebuffering = false;
      if (this.eventHandlers.onBuffering) {
        this.eventHandlers.onBuffering(false);
      }
    });

    // Error handling
    this.videoElement.addEventListener('error', () => {
      const error = this.videoElement.error;
      if (error) {
        this.handleMediaError(error);
      }
    });

    // Resize events (for quality change detection)
    this.videoElement.addEventListener('resize', () => {
      if (this.eventHandlers.onQualityChange) {
        const height = this.videoElement.videoHeight;
        this.eventHandlers.onQualityChange(`${height}p`);
      }
    });
  }

  /**
   * Handle native video errors
   */
  private handleMediaError(error: MediaError): void {
    let errorType: any = 'MEDIA_ERROR';
    let code = 'UNKNOWN_ERROR';
    let message = 'Unknown media error';

    switch (error.code) {
      case MediaError.MEDIA_ERR_ABORTED:
        code = 'MEDIA_ERR_ABORTED';
        message = 'Video playback aborted';
        break;
      case MediaError.MEDIA_ERR_NETWORK:
        errorType = 'NETWORK_ERROR';
        code = 'MEDIA_ERR_NETWORK';
        message = 'Network error occurred';
        break;
      case MediaError.MEDIA_ERR_DECODE:
        errorType = 'DECODE_ERROR';
        code = 'MEDIA_ERR_DECODE';
        message = 'Video decode error';
        break;
      case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
        errorType = 'FORMAT_ERROR';
        code = 'MEDIA_ERR_SRC_NOT_SUPPORTED';
        message = 'Video format not supported';
        break;
    }

    this.handleError(errorType, code, message, error);
  }

  /**
   * Calculate buffered percentage
   */
  private getBufferedPercentage(): number {
    const buffered = this.videoElement.buffered;
    const duration = this.videoElement.duration;

    if (!duration || buffered.length === 0) {
      return 0;
    }

    let totalBuffered = 0;
    for (let i = 0; i < buffered.length; i++) {
      totalBuffered += buffered.end(i) - buffered.start(i);
    }

    return Math.min(1, totalBuffered / duration);
  }

  /**
   * Start metrics collection
   */
  private startMetricsCollection(): void {
    this.metricsInterval = setInterval(() => {
      this.updateMetrics();
      
      if (this.eventHandlers.onMetricsUpdate) {
        this.eventHandlers.onMetricsUpdate(this.metrics);
      }
    }, 1000); // Update every second
  }

  /**
   * Update all metrics
   */
  private updateMetrics(): void {
    // Update buffer health
    const buffered = this.videoElement.buffered;
    const currentTime = this.videoElement.currentTime;
    
    if (buffered.length > 0) {
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

    // Update dropped frames (if available)
    if ('getVideoPlaybackQuality' in this.videoElement) {
      const quality = (this.videoElement as any).getVideoPlaybackQuality();
      this.metrics.droppedFrames = quality.droppedVideoFrames || 0;
    }

    // Estimate bitrate from video dimensions (rough estimation)
    const width = this.videoElement.videoWidth;
    const height = this.videoElement.videoHeight;
    if (width > 0 && height > 0) {
      // Very rough bitrate estimation based on resolution
      this.metrics.currentBitrate = Math.floor((width * height * 0.1) / 1000) * 1000;
    }

    // Update rebuffering state
    this.metrics.rebuffering = this.videoElement.readyState < 3 && !this.videoElement.paused;
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
      recoverable: code !== 'MEDIA_ERR_SRC_NOT_SUPPORTED',
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
    // Clear metrics interval
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
      this.metricsInterval = undefined;
    }

    // Remove all event listeners
    this.videoElement.removeEventListener('play', () => {});
    this.videoElement.removeEventListener('pause', () => {});
    this.videoElement.removeEventListener('timeupdate', () => {});
    this.videoElement.removeEventListener('progress', () => {});
    this.videoElement.removeEventListener('volumechange', () => {});
    this.videoElement.removeEventListener('loadstart', () => {});
    this.videoElement.removeEventListener('canplay', () => {});
    this.videoElement.removeEventListener('waiting', () => {});
    this.videoElement.removeEventListener('error', () => {});
    this.videoElement.removeEventListener('resize', () => {});

    this.state.isInitialized = false;
    this.state.hasError = false;
    this.state.lastError = undefined;
  }
}
