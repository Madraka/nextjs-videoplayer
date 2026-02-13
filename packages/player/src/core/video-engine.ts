/**
 * Core video engine that handles different streaming protocols
 * Supports native HLS, HLS.js, and Dash.js with automatic fallback
 */

import { getBrowserCapabilities, getStreamingStrategy, type BrowserCapabilities } from './compatibility';

export interface VideoEngineConfig {
  src: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  playsInline?: boolean;
}

export interface VideoEngineEvents {
  onReady: () => void;
  onPlay: () => void;
  onPause: () => void;
  onTimeUpdate: (currentTime: number, duration: number) => void;
  onProgress: (buffered: number) => void;
  onVolumeChange: (volume: number, muted: boolean) => void;
  onQualityChange: (quality: string) => void;
  onError: (error: Error) => void;
  onLoadStart: () => void;
  onLoadEnd: () => void;
}

export class VideoEngine {
  private videoElement: HTMLVideoElement;
  private hlsInstance?: any; // HLS.js instance
  private dashInstance?: any; // Dash.js MediaPlayer instance
  private capabilities?: BrowserCapabilities;
  private currentStrategy?: string;
  private events: Partial<VideoEngineEvents> = {};

  constructor(videoElement: HTMLVideoElement, events: Partial<VideoEngineEvents> = {}) {
    this.videoElement = videoElement;
    this.events = events;
    this.setupVideoElementEvents();
  }

  /**
   * Initialize the video engine with capabilities detection
   */
  async initialize(): Promise<void> {
    try {
      console.log('Getting browser capabilities...');
      this.capabilities = await getBrowserCapabilities();
      console.log('Browser capabilities:', this.capabilities);
      this.events.onReady?.();
    } catch (error) {
      console.error('Failed to initialize video engine:', error);
      throw error;
    }
  }

  /**
   * Load a video source
   */
  async loadSource(config: VideoEngineConfig): Promise<void> {
    // Auto-initialize if not done yet
    if (!this.capabilities) {
      await this.initialize();
    }

    // Ensure capabilities are available
    if (!this.capabilities) {
      throw new Error('Failed to initialize video engine capabilities');
    }

    // Clean up existing instances
    this.cleanup();

    // Set video element properties
    this.videoElement.autoplay = config.autoplay ?? false;
    this.videoElement.muted = config.muted ?? false;
    this.videoElement.loop = config.loop ?? false;
    this.videoElement.playsInline = config.playsInline ?? true;
    
    if (config.poster) {
      this.videoElement.poster = config.poster;
    }

    // Determine streaming strategy
    const strategy = getStreamingStrategy(this.capabilities, config.src);
    this.currentStrategy = strategy;

    this.events.onLoadStart?.();

    try {
      switch (strategy) {
        case 'native':
          await this.loadNativeHls(config.src);
          break;
        case 'hlsjs':
          await this.loadHlsJs(config.src);
          break;
        case 'dashjs':
          await this.loadDashJs(config.src);
          break;
        case 'direct':
          await this.loadDirectVideo(config.src);
          break;
        case 'unsupported':
          throw new Error(`Unsupported video format. This browser cannot play: ${config.src}`);
        default:
          throw new Error(`Unknown streaming strategy: ${strategy} for ${config.src}`);
      }
      
      this.events.onLoadEnd?.();
    } catch (error) {
      this.events.onError?.(error as Error);
    }
  }

  /**
   * Load video using native HLS support (mainly iOS Safari)
   */
  private async loadNativeHls(src: string): Promise<void> {
    this.videoElement.src = src;
    return new Promise((resolve, reject) => {
      const onLoadedData = () => {
        this.videoElement.removeEventListener('loadeddata', onLoadedData);
        this.videoElement.removeEventListener('error', onError);
        resolve();
      };
      
      const onError = () => {
        this.videoElement.removeEventListener('loadeddata', onLoadedData);
        this.videoElement.removeEventListener('error', onError);
        reject(new Error('Failed to load native HLS stream'));
      };

      this.videoElement.addEventListener('loadeddata', onLoadedData);
      this.videoElement.addEventListener('error', onError);
    });
  }

  /**
   * Load direct video file (MP4, WebM, etc.)
   */
  private loadDirectVideo = async (src: string): Promise<void> => {
    console.log('VideoEngine: Loading direct video file:', src);
    this.videoElement.src = src;
    
    return new Promise((resolve, reject) => {
      const onLoadedData = () => {
        this.videoElement.removeEventListener('loadeddata', onLoadedData);
        this.videoElement.removeEventListener('error', onError);
        this.videoElement.removeEventListener('loadstart', onLoadStart);
        console.log('VideoEngine: Direct video loaded successfully');
        resolve();
      };
      
      const onError = (event: Event) => {
        this.videoElement.removeEventListener('loadeddata', onLoadedData);
        this.videoElement.removeEventListener('error', onError);
        this.videoElement.removeEventListener('loadstart', onLoadStart);
        
        const error = this.videoElement.error;
        let errorMessage = 'Failed to load direct video file';
        
        if (error) {
          switch (error.code) {
            case error.MEDIA_ERR_ABORTED:
              errorMessage = 'Video loading was aborted';
              break;
            case error.MEDIA_ERR_NETWORK:
              errorMessage = 'Network error occurred while loading video';
              break;
            case error.MEDIA_ERR_DECODE:
              errorMessage = 'Video decoding error occurred';
              break;
            case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
              errorMessage = 'Video format not supported or file not found';
              break;
            default:
              errorMessage = `Video error: ${error.message || 'Unknown error'}`;
          }
        }
        
        console.error('VideoEngine: Direct video load failed:', errorMessage, event);
        console.error('VideoEngine: Failed URL:', src);
        reject(new Error(`${errorMessage}. Please try a different video.`));
      };

      const onLoadStart = () => {
        console.log('VideoEngine: Started loading direct video');
      };

      this.videoElement.addEventListener('loadeddata', onLoadedData);
      this.videoElement.addEventListener('error', onError);
      this.videoElement.addEventListener('loadstart', onLoadStart);
      
      // Set a timeout for loading
      const timeout = setTimeout(() => {
        this.videoElement.removeEventListener('loadeddata', onLoadedData);
        this.videoElement.removeEventListener('error', onError);
        this.videoElement.removeEventListener('loadstart', onLoadStart);
        reject(new Error('Video loading timeout (30s)'));
      }, 30000);

      // Clear timeout when promise resolves
      const originalResolve = resolve;
      resolve = () => {
        clearTimeout(timeout);
        originalResolve();
      };

      const originalReject = reject;
      reject = (error: Error) => {
        clearTimeout(timeout);
        originalReject(error);
      };
      
      // Force load
      this.videoElement.load();
    });
  }

  /**
   * Load video using HLS.js
   */
  private async loadHlsJs(src: string): Promise<void> {
    try {
      const Hls = (await import('hls.js')).default;
      
      if (!Hls.isSupported()) {
        throw new Error('HLS.js is not supported in this browser');
      }

      this.hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 90,
      });

      return new Promise((resolve, reject) => {
        const hls = this.hlsInstance!;

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          resolve();
        });

        hls.on(Hls.Events.ERROR, (event: any, data: any) => {
          if (data.fatal) {
            reject(new Error(`HLS.js fatal error: ${data.type} - ${data.details}`));
          }
        });

        hls.on(Hls.Events.LEVEL_SWITCHED, (event: any, data: any) => {
          const level = hls.levels[data.level];
          this.events.onQualityChange?.(level.height ? `${level.height}p` : 'auto');
        });

        hls.loadSource(src);
        hls.attachMedia(this.videoElement);
      });
    } catch (error) {
      throw new Error('Failed to load HLS.js');
    }
  }

  /**
   * Load video using Dash.js
   */
  private async loadDashJs(src: string): Promise<void> {
    try {
      const dashjs = await import('dashjs');
      this.dashInstance = dashjs.MediaPlayer().create();
      
      return new Promise((resolve, reject) => {
        const dash = this.dashInstance!;

        dash.on('streamInitialized', () => {
          resolve();
        });

        dash.on('error', (error: any) => {
          reject(new Error(`Dash.js error: ${error.error}`));
        });

        dash.initialize(this.videoElement, src, false);
      });
    } catch (error) {
      throw new Error('Dash.js failed to load');
    }
  }

  /**
   * Setup video element event listeners
   */
  private setupVideoElementEvents(): void {
    this.videoElement.addEventListener('play', () => {
      this.events.onPlay?.();
    });

    this.videoElement.addEventListener('pause', () => {
      this.events.onPause?.();
    });

    this.videoElement.addEventListener('timeupdate', () => {
      this.events.onTimeUpdate?.(
        this.videoElement.currentTime,
        this.videoElement.duration || 0
      );
    });

    this.videoElement.addEventListener('progress', () => {
      const buffered = this.getBufferedPercentage();
      this.events.onProgress?.(buffered);
    });

    this.videoElement.addEventListener('volumechange', () => {
      this.events.onVolumeChange?.(
        this.videoElement.volume,
        this.videoElement.muted
      );
    });

    this.videoElement.addEventListener('error', () => {
      this.events.onError?.(new Error('Video element error'));
    });
  }

  /**
   * Get buffered percentage
   */
  private getBufferedPercentage(): number {
    const buffered = this.videoElement.buffered;
    const duration = this.videoElement.duration;
    
    if (buffered.length === 0 || !duration) return 0;
    
    const bufferedEnd = buffered.end(buffered.length - 1);
    return (bufferedEnd / duration) * 100;
  }

  /**
   * Get available quality levels
   */
  getQualityLevels(): Array<{ id: string; label: string; height?: number }> {
    if (this.hlsInstance) {
      return this.hlsInstance.levels.map((level: any, index: number) => ({
        id: index.toString(),
        label: level.height ? `${level.height}p` : `Level ${index}`,
        height: level.height,
      }));
    }

    if (this.dashInstance) {
      try {
        const bitrateInfo = this.dashInstance.getBitrateInfoListFor('video');
        return bitrateInfo.map((info: any, index: number) => ({
          id: index.toString(),
          label: info.height ? `${info.height}p` : `${Math.round(info.bitrate / 1000)}k`,
          height: info.height,
        }));
      } catch {
        return [];
      }
    }

    return [];
  }

  /**
   * Set quality level
   */
  setQuality(qualityId: string): void {
    if (this.hlsInstance) {
      const levelIndex = parseInt(qualityId);
      this.hlsInstance.currentLevel = levelIndex;
    }

    if (this.dashInstance) {
      try {
        const qualityIndex = parseInt(qualityId);
        this.dashInstance.setQualityFor('video', qualityIndex);
      } catch (error) {
        console.warn('Failed to set quality:', error);
      }
    }
  }

  /**
   * Clean up instances and remove event listeners
   */
  cleanup(): void {
    if (this.hlsInstance) {
      this.hlsInstance.destroy();
      this.hlsInstance = undefined;
    }

    if (this.dashInstance) {
      this.dashInstance.reset();
      this.dashInstance = undefined;
    }
  }

  /**
   * Get current streaming strategy
   */
  getCurrentStrategy(): string | undefined {
    return this.currentStrategy;
  }

  /**
   * Get browser capabilities
   */
  getCapabilities(): BrowserCapabilities | undefined {
    return this.capabilities;
  }
}
