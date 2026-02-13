/**
 * Core video engine that handles different streaming protocols
 * Supports pluggable adapters and plugin lifecycle hooks.
 */

import { AdapterRegistry } from '@/core/adapters/adapter-registry';
import { defaultStreamingAdapters } from '@/core/adapters/default-adapters';
import type { QualityLevel, StreamingAdapter, StreamingAdapterFactory } from '@/core/adapters/types';
import { getBrowserCapabilities, type BrowserCapabilities } from '@/core/compatibility';
import { VideoEnginePluginManager } from '@/core/plugins/plugin-manager';
import type { VideoEnginePlugin } from '@/core/plugins/types';

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

export interface VideoEngineOptions {
  plugins?: VideoEnginePlugin[];
  adapters?: StreamingAdapterFactory[];
}

export class VideoEngine {
  private readonly videoElement: HTMLVideoElement;
  private readonly events: Partial<VideoEngineEvents>;
  private readonly adapterRegistry: AdapterRegistry;
  private readonly pluginManager: VideoEnginePluginManager;

  private activeAdapter?: StreamingAdapter;
  private capabilities?: BrowserCapabilities;
  private currentStrategy?: string;
  private currentSource?: string;

  constructor(
    videoElement: HTMLVideoElement,
    events: Partial<VideoEngineEvents> = {},
    options: VideoEngineOptions = {}
  ) {
    this.videoElement = videoElement;
    this.events = events;
    this.adapterRegistry = new AdapterRegistry();
    this.pluginManager = new VideoEnginePluginManager(options.plugins ?? []);

    for (const adapter of defaultStreamingAdapters) {
      this.adapterRegistry.register(adapter);
    }

    for (const adapter of options.adapters ?? []) {
      this.adapterRegistry.register(adapter);
    }

    this.setupVideoElementEvents();
    this.pluginManager.setup({ videoElement: this.videoElement });
  }

  async initialize(): Promise<void> {
    try {
      this.capabilities = await getBrowserCapabilities();
      this.pluginManager.onInit();
      this.events.onReady?.();
    } catch (error) {
      this.events.onError?.(error as Error);
      throw error;
    }
  }

  async loadSource(config: VideoEngineConfig): Promise<void> {
    if (!this.capabilities) {
      await this.initialize();
    }

    if (!this.capabilities) {
      throw new Error('Failed to initialize video engine capabilities');
    }

    this.cleanupActiveAdapter();
    this.applyVideoConfig(config);

    const selectionContext = {
      src: config.src,
      capabilities: this.capabilities,
    };

    const adapterFactory = this.adapterRegistry.resolve(selectionContext);

    if (!adapterFactory) {
      const error = new Error(`Unsupported video format. This browser cannot play: ${config.src}`);
      this.events.onError?.(error);
      this.pluginManager.onError({ error, src: config.src });
      throw error;
    }

    this.events.onLoadStart?.();

    const payload = {
      src: config.src,
      strategy: adapterFactory.id,
      capabilities: this.capabilities,
    };

    this.pluginManager.onSourceLoadStart(payload);

    try {
      const adapter = adapterFactory.create();
      await adapter.load({
        src: config.src,
        capabilities: this.capabilities,
        videoElement: this.videoElement,
        onQualityChange: (quality: string) => {
          this.events.onQualityChange?.(quality);
          this.pluginManager.onQualityChange(quality);
        },
      });

      this.activeAdapter = adapter;
      this.currentStrategy = adapterFactory.id;
      this.currentSource = config.src;

      this.pluginManager.onSourceLoaded(payload);
      this.events.onLoadEnd?.();
    } catch (error) {
      const runtimeError = error as Error;
      this.events.onError?.(runtimeError);
      this.pluginManager.onError({
        error: runtimeError,
        src: config.src,
        strategy: adapterFactory.id,
      });
      throw runtimeError;
    }
  }

  getQualityLevels(): QualityLevel[] {
    return this.activeAdapter?.getQualityLevels() ?? [];
  }

  setQuality(qualityId: string): void {
    this.activeAdapter?.setQuality(qualityId);
  }

  cleanup(): void {
    this.cleanupActiveAdapter();
  }

  dispose(): void {
    this.cleanupActiveAdapter();
    this.pluginManager.dispose();
  }

  getCurrentStrategy(): string | undefined {
    return this.currentStrategy;
  }

  getCapabilities(): BrowserCapabilities | undefined {
    return this.capabilities;
  }

  getCurrentSource(): string | undefined {
    return this.currentSource;
  }

  private applyVideoConfig(config: VideoEngineConfig): void {
    this.videoElement.autoplay = config.autoplay ?? false;
    this.videoElement.muted = config.muted ?? false;
    this.videoElement.loop = config.loop ?? false;
    this.videoElement.playsInline = config.playsInline ?? true;

    if (config.poster) {
      this.videoElement.poster = config.poster;
    }
  }

  private setupVideoElementEvents(): void {
    this.videoElement.addEventListener('play', () => {
      this.events.onPlay?.();
      this.pluginManager.onPlay();
    });

    this.videoElement.addEventListener('pause', () => {
      this.events.onPause?.();
      this.pluginManager.onPause();
    });

    this.videoElement.addEventListener('timeupdate', () => {
      const currentTime = this.videoElement.currentTime;
      const duration = this.videoElement.duration || 0;
      this.events.onTimeUpdate?.(currentTime, duration);
      this.pluginManager.onTimeUpdate({ currentTime, duration });
    });

    this.videoElement.addEventListener('progress', () => {
      const buffered = this.getBufferedPercentage();
      this.events.onProgress?.(buffered);
    });

    this.videoElement.addEventListener('volumechange', () => {
      const volume = this.videoElement.volume;
      const muted = this.videoElement.muted;
      this.events.onVolumeChange?.(volume, muted);
      this.pluginManager.onVolumeChange({ volume, muted });
    });

    this.videoElement.addEventListener('error', () => {
      const error = new Error('Video element error');
      this.events.onError?.(error);
      this.pluginManager.onError({ error, src: this.currentSource, strategy: this.currentStrategy });
    });
  }

  private getBufferedPercentage(): number {
    const buffered = this.videoElement.buffered;
    const duration = this.videoElement.duration;

    if (buffered.length === 0 || !duration) {
      return 0;
    }

    const bufferedEnd = buffered.end(buffered.length - 1);
    return (bufferedEnd / duration) * 100;
  }

  private cleanupActiveAdapter(): void {
    this.activeAdapter?.destroy();
    this.activeAdapter = undefined;
    this.currentStrategy = undefined;
  }
}
