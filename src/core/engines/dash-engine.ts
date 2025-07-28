/**
 * DASH Engine Implementation
 * Handles Dash.js integration for MPEG-DASH streaming
 */

import type { 
  EngineInterface, 
  EngineEventHandlers, 
  EngineState, 
  DashEngineConfig 
} from './types';
import type { 
  EngineMetrics, 
  PlaybackState, 
  VideoError, 
  QualityLevel 
} from '../../types';

export class DashEngine implements EngineInterface {
  private videoElement: HTMLVideoElement;
  private dashInstance?: any; // Dash.js MediaPlayer instance
  private config: DashEngineConfig;
  private eventHandlers: EngineEventHandlers;
  private state: EngineState;
  private metrics: EngineMetrics;

  constructor(
    videoElement: HTMLVideoElement,
    config: Partial<DashEngineConfig> = {},
    eventHandlers: EngineEventHandlers = {}
  ) {
    this.videoElement = videoElement;
    this.eventHandlers = eventHandlers;
    
    this.config = {
      streaming: {
        bufferTimeAtTopQuality: 12,
        bufferTimeAtTopQualityLongForm: 60,
        fastSwitchEnabled: true,
        ...config.streaming
      },
      debug: {
        logLevel: 'WARN',
        ...config.debug
      }
    };

    this.state = {
      isInitialized: false,
      isLoading: false,
      hasError: false,
      engineType: 'dash'
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
   * Initialize Dash.js library
   */
  async initialize(): Promise<void> {
    try {
      // Dynamic import of Dash.js
      const dashjs = await import('dashjs');

      if (!dashjs.supportsMediaSource()) {
        throw new Error('Dash.js is not supported in this browser');
      }

      // Create DASH MediaPlayer instance
      this.dashInstance = dashjs.MediaPlayer().create();

      // Configure the player
      this.configureDashPlayer();
      this.setupDashEventHandlers();

      this.state.isInitialized = true;

      if (this.eventHandlers.onReady) {
        this.eventHandlers.onReady();
      }

    } catch (error) {
      this.handleError('CAPABILITY_ERROR', 'DASH_INIT_FAILED', 
        'Failed to initialize Dash.js', error);
      throw error;
    }
  }

  /**
   * Load DASH stream
   */
  async load(src: string): Promise<void> {
    if (!this.dashInstance) {
      throw new Error('DASH engine not initialized');
    }

    try {
      this.state.isLoading = true;
      this.state.currentSrc = src;

      if (this.eventHandlers.onLoadStart) {
        this.eventHandlers.onLoadStart();
      }

      // Initialize the player with video element
      this.dashInstance.initialize(this.videoElement, src, false);

      // Wait for stream to be initialized
      await new Promise<void>((resolve, reject) => {
        const onStreamInitialized = () => {
          this.dashInstance.off('streamInitialized', onStreamInitialized);
          this.dashInstance.off('error', onError);
          resolve();
        };

        const onError = (error: any) => {
          this.dashInstance.off('streamInitialized', onStreamInitialized);
          this.dashInstance.off('error', onError);
          reject(new Error(`DASH load error: ${error.error}`));
        };

        this.dashInstance.on('streamInitialized', onStreamInitialized);
        this.dashInstance.on('error', onError);
      });

      this.state.isLoading = false;

      if (this.eventHandlers.onLoadEnd) {
        this.eventHandlers.onLoadEnd();
      }

    } catch (error) {
      this.state.isLoading = false;
      this.handleError('MEDIA_ERROR', 'DASH_LOAD_FAILED', 
        'Failed to load DASH stream', error);
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
    if (this.dashInstance) {
      this.dashInstance.seek(time);
    } else {
      this.videoElement.currentTime = time;
    }
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
    if (this.dashInstance) {
      this.dashInstance.setPlaybackRate(rate);
    } else {
      this.videoElement.playbackRate = rate;
    }
  }

  /**
   * Get current quality levels
   */
  getQualityLevels(): QualityLevel[] {
    if (!this.dashInstance) {
      return [];
    }

    try {
      const bitrates = this.dashInstance.getBitrateInfoListFor('video');
      
      return bitrates.map((bitrate: any, index: number) => ({
        id: index.toString(),
        label: `${bitrate.height}p`,
        width: bitrate.width || 0,
        height: bitrate.height || 0,
        bitrate: bitrate.bitrate || 0,
        frameRate: bitrate.frameRate
      }));
    } catch (error) {
      console.warn('Failed to get DASH quality levels:', error);
      return [];
    }
  }

  /**
   * Set quality level
   */
  setQualityLevel(levelId: string): void {
    if (!this.dashInstance) {
      return;
    }

    try {
      const level = parseInt(levelId, 10);
      this.dashInstance.setQualityFor('video', level);
    } catch (error) {
      console.warn('Failed to set DASH quality level:', error);
    }
  }

  /**
   * Enable auto quality selection
   */
  setAutoQuality(enabled: boolean): void {
    if (!this.dashInstance) {
      return;
    }

    try {
      this.dashInstance.updateSettings({
        streaming: {
          abr: {
            autoSwitchBitrate: {
              video: enabled
            }
          }
        }
      });
    } catch (error) {
      console.warn('Failed to set DASH auto quality:', error);
    }
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
   * Configure DASH player settings
   */
  private configureDashPlayer(): void {
    if (!this.dashInstance) {
      return;
    }

    const settings = {
      debug: {
        logLevel: this.config.debug.logLevel
      },
      streaming: {
        bufferTimeAtTopQuality: this.config.streaming.bufferTimeAtTopQuality,
        bufferTimeAtTopQualityLongForm: this.config.streaming.bufferTimeAtTopQualityLongForm,
        fastSwitchEnabled: this.config.streaming.fastSwitchEnabled,
        
        // Additional optimizations
        bufferPruningInterval: 30,
        stableBufferTime: 12,
        abandonLoadTimeout: 10000,
        
        // ABR settings
        abr: {
          maxBitrate: {
            video: -1,
            audio: -1
          },
          minBitrate: {
            video: -1,
            audio: -1
          },
          autoSwitchBitrate: {
            video: true,
            audio: true
          }
        }
      }
    };

    this.dashInstance.updateSettings(settings);
  }

  /**
   * Setup Dash.js event handlers
   */
  private setupDashEventHandlers(): void {
    if (!this.dashInstance) {
      return;
    }

    // Quality level changes
    this.dashInstance.on('qualityChangeRendered', (event: any) => {
      if (event.mediaType === 'video' && this.eventHandlers.onQualityChange) {
        const bitrates = this.dashInstance.getBitrateInfoListFor('video');
        const currentBitrate = bitrates[event.newQuality];
        if (currentBitrate) {
          this.eventHandlers.onQualityChange(`${currentBitrate.height}p`);
        }
      }
    });

    // Error handling
    this.dashInstance.on('error', (event: any) => {
      console.warn('DASH Error:', event);
      this.handleError('MEDIA_ERROR', event.error.code, 
        `DASH error: ${event.error.message}`, event);
    });

    // Metrics updates
    this.dashInstance.on('metricAdded', (event: any) => {
      this.updateDashMetrics(event);
    });

    this.dashInstance.on('bufferStateChanged', (event: any) => {
      this.updateBufferMetrics();
    });
  }

  /**
   * Update metrics from DASH events
   */
  private updateDashMetrics(event: any): void {
    try {
      if (!this.dashInstance) {
        return;
      }

      // Get throughput metrics
      const throughputHistory = this.dashInstance.getDashMetrics().getCurrentHttpRequest('video');
      if (throughputHistory && throughputHistory.length > 0) {
        const latest = throughputHistory[throughputHistory.length - 1];
        if (latest.trace && latest.trace.length > 0) {
          const downloadTime = latest.trace[latest.trace.length - 1].d - latest.trace[0].s;
          const downloadBytes = latest.trace[latest.trace.length - 1].b;
          
          if (downloadTime > 0) {
            this.metrics.networkSpeed = (downloadBytes * 8) / downloadTime; // bits per ms
            this.metrics.latency = latest.trace[0].d - latest.trace[0].s;
          }
        }
      }

      // Get current bitrate
      const currentBitrate = this.dashInstance.getQualityFor('video');
      const bitrates = this.dashInstance.getBitrateInfoListFor('video');
      if (bitrates && bitrates[currentBitrate]) {
        this.metrics.currentBitrate = bitrates[currentBitrate].bitrate;
      }

    } catch (error) {
      console.warn('Failed to update DASH metrics:', error);
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
    if (this.dashInstance) {
      this.dashInstance.reset();
      this.dashInstance = undefined;
    }

    this.state.isInitialized = false;
    this.state.hasError = false;
    this.state.lastError = undefined;
  }
}
