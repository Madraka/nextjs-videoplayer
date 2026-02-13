/**
 * Core video engine that handles different streaming protocols
 * Supports pluggable adapters and plugin lifecycle hooks.
 */

import { AdapterRegistry } from '@/core/adapters/adapter-registry';
import { defaultStreamingAdapters } from '@/core/adapters/default-adapters';
import type { QualityLevel, StreamingAdapter, StreamingAdapterFactory } from '@/core/adapters/types';
import { getBrowserCapabilities, type BrowserCapabilities } from '@/core/compatibility';
import { createEmeController, type EmeController, type EmeEnvironment } from '@/core/drm/eme-controller';
import type { DrmConfiguration } from '@/core/drm/types';
import { VideoEnginePluginManager } from '@/core/plugins/plugin-manager';
import type { VideoEnginePlugin } from '@/core/plugins/types';

export interface VideoEngineConfig {
  src: string;
  fallbackSources?: string[];
  signal?: AbortSignal;
  retryPolicy?: {
    maxRetries?: number;
    retryDelayMs?: number;
    maxRetryDelayMs?: number;
    backoffMultiplier?: number;
    jitterRatio?: number;
    retryOn?: Array<'network' | 'timeout' | 'server' | 'unsupported' | 'unknown' | 'all'>;
  };
  drm?: DrmConfiguration;
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
  capabilitiesResolver?: () => Promise<BrowserCapabilities>;
  emeEnvironment?: Partial<EmeEnvironment>;
}

export class VideoEngine {
  private readonly videoElement: HTMLVideoElement;
  private readonly events: Partial<VideoEngineEvents>;
  private readonly adapterRegistry: AdapterRegistry;
  private readonly pluginManager: VideoEnginePluginManager;
  private readonly resolveCapabilities: () => Promise<BrowserCapabilities>;
  private readonly emeEnvironment?: Partial<EmeEnvironment>;

  private activeAdapter?: StreamingAdapter;
  private activeEmeController?: EmeController;
  private capabilities?: BrowserCapabilities;
  private currentStrategy?: string;
  private currentSource?: string;
  private isDisposed = false;
  private initializationPromise?: Promise<void>;
  private loadRequestId = 0;
  private timeUpdateFrameId: number | null = null;
  private progressFrameId: number | null = null;
  private lastEmittedCurrentTime = -1;
  private lastEmittedDuration = -1;
  private lastEmittedBuffered = -1;

  private readonly onPlayListener = () => {
    this.events.onPlay?.();
    this.pluginManager.onPlay();
  };

  private readonly onPauseListener = () => {
    this.events.onPause?.();
    this.pluginManager.onPause();
  };

  private readonly onTimeUpdateListener = () => {
    if (this.timeUpdateFrameId !== null || this.isDisposed) {
      return;
    }

    this.timeUpdateFrameId = this.requestFrame(() => {
      this.timeUpdateFrameId = null;
      if (this.isDisposed) {
        return;
      }

      const currentTime = this.videoElement.currentTime;
      const duration = this.videoElement.duration || 0;
      const currentTimeDelta = Math.abs(currentTime - this.lastEmittedCurrentTime);
      const durationDelta = Math.abs(duration - this.lastEmittedDuration);

      if (currentTimeDelta < 0.05 && durationDelta < 0.01) {
        return;
      }

      this.lastEmittedCurrentTime = currentTime;
      this.lastEmittedDuration = duration;
      this.events.onTimeUpdate?.(currentTime, duration);
      this.pluginManager.onTimeUpdate({ currentTime, duration });
    });
  };

  private readonly onProgressListener = () => {
    if (this.progressFrameId !== null || this.isDisposed) {
      return;
    }

    this.progressFrameId = this.requestFrame(() => {
      this.progressFrameId = null;
      if (this.isDisposed) {
        return;
      }

      const buffered = this.getBufferedPercentage();
      if (Math.abs(buffered - this.lastEmittedBuffered) < 0.25) {
        return;
      }

      this.lastEmittedBuffered = buffered;
      this.events.onProgress?.(buffered);
    });
  };

  private readonly onVolumeChangeListener = () => {
    const volume = this.videoElement.volume;
    const muted = this.videoElement.muted;
    this.events.onVolumeChange?.(volume, muted);
    this.pluginManager.onVolumeChange({ volume, muted });
  };

  private readonly onErrorListener = () => {
    const error = new Error('Video element error');
    this.events.onError?.(error);
    this.pluginManager.onError({ error, src: this.currentSource, strategy: this.currentStrategy });
  };

  constructor(
    videoElement: HTMLVideoElement,
    events: Partial<VideoEngineEvents> = {},
    options: VideoEngineOptions = {}
  ) {
    this.videoElement = videoElement;
    this.events = events;
    this.adapterRegistry = new AdapterRegistry();
    this.pluginManager = new VideoEnginePluginManager(options.plugins ?? []);
    this.resolveCapabilities = options.capabilitiesResolver ?? getBrowserCapabilities;
    this.emeEnvironment = options.emeEnvironment;

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
    this.assertNotDisposed('initialize');

    if (this.capabilities) {
      return;
    }

    if (this.initializationPromise) {
      await this.initializationPromise;
      return;
    }

    this.initializationPromise = (async () => {
      try {
        const capabilities = await this.resolveCapabilities();

        if (this.isDisposed) {
          return;
        }

        this.capabilities = capabilities;
        this.pluginManager.onInit();
        this.events.onReady?.();
      } catch (error) {
        if (!this.isDisposed) {
          this.events.onError?.(error as Error);
        }
        throw error;
      } finally {
        this.initializationPromise = undefined;
      }
    })();

    await this.initializationPromise;
  }

  async loadSource(config: VideoEngineConfig): Promise<void> {
    this.assertNotDisposed('loadSource');
    const requestId = ++this.loadRequestId;
    const { signal } = config;
    this.assertNotAborted(signal);

    if (!this.capabilities) {
      await this.initialize();
    }
    this.assertActiveLoadRequest(requestId);
    this.assertNotAborted(signal);

    if (!this.capabilities) {
      throw new Error('Failed to initialize video engine capabilities');
    }

    this.cleanupActiveAdapter();
    this.cleanupDrmController();
    this.applyVideoConfig(config);

    if (config.drm?.enabled) {
      const drmController = await this.runWithAbortSignal(this.setupDrm(config.drm), signal, () => {
        this.cleanupDrmController();
      });
      if (this.isSupersededLoadRequest(requestId)) {
        drmController.destroy();
        throw this.createSupersededLoadError();
      }
      this.activeEmeController = drmController;
    }

    this.events.onLoadStart?.();
    const candidateSources = this.getCandidateSources(config);
    const retryLimit = this.getRetryLimit(config);
    const retryDelayMs = this.getRetryDelayMs(config);
    const maxRetryDelayMs = this.getMaxRetryDelayMs(config, retryDelayMs);
    const backoffMultiplier = this.getBackoffMultiplier(config);
    const jitterRatio = this.getJitterRatio(config);
    const resolvedCandidates = candidateSources.map((src) => ({
      src,
      adapterFactory: this.adapterRegistry.resolve({
        src,
        capabilities: this.capabilities as BrowserCapabilities,
      }),
    }));
    const totalAttempts = resolvedCandidates.reduce((count, candidate) => {
      if (!candidate.adapterFactory) {
        return count + 1;
      }

      return count + retryLimit + 1;
    }, 0);
    const attemptErrors: Error[] = [];
    let attemptNumber = 0;
    let lastAttemptStrategy: string | undefined;

    for (let sourceIndex = 0; sourceIndex < resolvedCandidates.length; sourceIndex += 1) {
      const candidate = resolvedCandidates[sourceIndex];
      this.assertActiveLoadRequest(requestId);
      this.assertNotAborted(signal);
      const src = candidate.src;
      const adapterFactory = candidate.adapterFactory;
      const strategy = adapterFactory?.id ?? 'unresolved';
      lastAttemptStrategy = strategy;

      const payload = {
        src,
        strategy,
        capabilities: this.capabilities,
      };

      this.pluginManager.onSourceLoadStart(payload);

      if (!adapterFactory) {
        attemptNumber += 1;
        const unsupportedError = new Error(`Unsupported video format. This browser cannot play: ${src}`);
        attemptErrors.push(unsupportedError);
        this.pluginManager.onSourceLoadFailed({
          src,
          strategy,
          error: unsupportedError,
          attempt: attemptNumber,
          totalAttempts,
        });

        const nextCandidate = resolvedCandidates[sourceIndex + 1];
        if (nextCandidate) {
          this.pluginManager.onFailover({
            fromSrc: src,
            fromStrategy: strategy,
            toSrc: nextCandidate.src,
            toStrategy: nextCandidate.adapterFactory?.id ?? 'unresolved',
            error: unsupportedError,
            attempt: attemptNumber,
            totalAttempts,
          });
        }
        continue;
      }

      for (let retryIndex = 0; retryIndex <= retryLimit; retryIndex += 1) {
        this.assertActiveLoadRequest(requestId);
        this.assertNotAborted(signal);
        attemptNumber += 1;
        const adapter = adapterFactory.create();
        let adapterDestroyedByAbort = false;

        try {
          await this.runWithAbortSignal(
            adapter.load({
              src,
              capabilities: this.capabilities,
              videoElement: this.videoElement,
              signal,
              onQualityChange: (quality: string) => {
                this.events.onQualityChange?.(quality);
                this.pluginManager.onQualityChange(quality);
              },
            }),
            signal,
            () => {
              adapter.destroy();
              adapterDestroyedByAbort = true;
            }
          );
          this.assertActiveLoadRequest(requestId);
          this.assertNotAborted(signal);

          this.activeAdapter = adapter;
          this.currentStrategy = adapterFactory.id;
          this.currentSource = src;

          this.pluginManager.onSourceLoaded(payload);
          this.events.onLoadEnd?.();
          return;
        } catch (error) {
          const runtimeError = error as Error;
          if (!adapterDestroyedByAbort) {
            adapter.destroy();
          }
          if (this.isAbortedLoadError(runtimeError)) {
            throw runtimeError;
          }
          if (this.isSupersededLoadRequest(requestId)) {
            throw this.createSupersededLoadError();
          }

          const canRetry =
            retryIndex < retryLimit &&
            this.isRetriableLoadError(runtimeError, config.retryPolicy?.retryOn);

          this.pluginManager.onSourceLoadFailed({
            src,
            strategy: adapterFactory.id,
            error: runtimeError,
            attempt: attemptNumber,
            totalAttempts,
          });

          if (canRetry) {
            const delayMs = this.calculateRetryDelay({
              retryAttempt: retryIndex,
              baseDelayMs: retryDelayMs,
              maxDelayMs: maxRetryDelayMs,
              backoffMultiplier,
              jitterRatio,
            });
            this.pluginManager.onRetry({
              src,
              strategy: adapterFactory.id,
              error: runtimeError,
              attempt: attemptNumber,
              retryAttempt: retryIndex + 1,
              maxRetries: retryLimit,
              retryDelayMs: delayMs,
            });
            await this.waitForRetryDelay(delayMs, signal);
            continue;
          }

          attemptErrors.push(runtimeError);
          const nextCandidate = resolvedCandidates[sourceIndex + 1];
          if (nextCandidate) {
            this.pluginManager.onFailover({
              fromSrc: src,
              fromStrategy: adapterFactory.id,
              toSrc: nextCandidate.src,
              toStrategy: nextCandidate.adapterFactory?.id ?? 'unresolved',
              error: runtimeError,
              attempt: attemptNumber,
              totalAttempts,
            });
          }
          break;
        }
      }
    }

    const lastError = attemptErrors[attemptErrors.length - 1] ?? new Error('Unknown playback failure');
    const failureSummary = new Error(
      `All playback sources failed (${totalAttempts} attempts). Last error: ${lastError.message}`
    );

    this.events.onError?.(failureSummary);
    this.pluginManager.onError({
      error: failureSummary,
      src: candidateSources[candidateSources.length - 1],
      strategy: lastAttemptStrategy,
    });
    throw failureSummary;
  }

  getQualityLevels(): QualityLevel[] {
    return this.activeAdapter?.getQualityLevels() ?? [];
  }

  setQuality(qualityId: string): void {
    this.assertNotDisposed('setQuality');
    this.activeAdapter?.setQuality(qualityId);
  }

  cleanup(): void {
    if (this.isDisposed) {
      return;
    }

    this.loadRequestId += 1;
    this.cleanupActiveAdapter();
    this.cleanupDrmController();
  }

  dispose(): void {
    if (this.isDisposed) {
      return;
    }

    this.isDisposed = true;
    this.loadRequestId += 1;
    this.cancelPendingFrames();
    this.removeVideoElementEvents();
    this.cleanupActiveAdapter();
    this.cleanupDrmController();
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
    this.videoElement.addEventListener('play', this.onPlayListener);
    this.videoElement.addEventListener('pause', this.onPauseListener);
    this.videoElement.addEventListener('timeupdate', this.onTimeUpdateListener);
    this.videoElement.addEventListener('progress', this.onProgressListener);
    this.videoElement.addEventListener('volumechange', this.onVolumeChangeListener);
    this.videoElement.addEventListener('error', this.onErrorListener);
  }

  private removeVideoElementEvents(): void {
    this.videoElement.removeEventListener('play', this.onPlayListener);
    this.videoElement.removeEventListener('pause', this.onPauseListener);
    this.videoElement.removeEventListener('timeupdate', this.onTimeUpdateListener);
    this.videoElement.removeEventListener('progress', this.onProgressListener);
    this.videoElement.removeEventListener('volumechange', this.onVolumeChangeListener);
    this.videoElement.removeEventListener('error', this.onErrorListener);
  }

  private getBufferedPercentage(): number {
    const buffered = this.videoElement.buffered;
    const duration = this.videoElement.duration;

    if (buffered.length === 0 || !duration) {
      return 0;
    }

    const bufferedEnd = buffered.end(buffered.length - 1);
    return Math.min(100, (bufferedEnd / duration) * 100);
  }

  private requestFrame(callback: () => void): number {
    if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
      return window.requestAnimationFrame(callback);
    }

    return setTimeout(callback, 16) as unknown as number;
  }

  private cancelFrame(id: number): void {
    if (typeof window !== 'undefined' && typeof window.cancelAnimationFrame === 'function') {
      window.cancelAnimationFrame(id);
      return;
    }

    clearTimeout(id);
  }

  private cancelPendingFrames(): void {
    if (this.timeUpdateFrameId !== null) {
      this.cancelFrame(this.timeUpdateFrameId);
      this.timeUpdateFrameId = null;
    }

    if (this.progressFrameId !== null) {
      this.cancelFrame(this.progressFrameId);
      this.progressFrameId = null;
    }
  }

  private cleanupActiveAdapter(): void {
    this.activeAdapter?.destroy();
    this.activeAdapter = undefined;
    this.currentStrategy = undefined;
    this.currentSource = undefined;
  }

  private async setupDrm(configuration: DrmConfiguration): Promise<EmeController> {
    try {
      return await createEmeController(this.videoElement, configuration, this.emeEnvironment);
    } catch (error) {
      const drmError = new Error(`Failed to initialize DRM: ${(error as Error).message}`);
      this.events.onError?.(drmError);
      this.pluginManager.onError({
        error: drmError,
      });
      throw drmError;
    }
  }

  private cleanupDrmController(): void {
    this.activeEmeController?.destroy();
    this.activeEmeController = undefined;
  }

  private getCandidateSources(config: VideoEngineConfig): string[] {
    const sources = [config.src, ...(config.fallbackSources ?? [])]
      .map((source) => source.trim())
      .filter((source) => source.length > 0);

    return Array.from(new Set(sources));
  }

  private getRetryLimit(config: VideoEngineConfig): number {
    const configuredLimit = config.retryPolicy?.maxRetries ?? 0;
    return Math.max(0, Math.min(5, Math.floor(configuredLimit)));
  }

  private getRetryDelayMs(config: VideoEngineConfig): number {
    const configuredDelayMs = config.retryPolicy?.retryDelayMs ?? 0;
    return Math.max(0, Math.min(5000, Math.floor(configuredDelayMs)));
  }

  private getMaxRetryDelayMs(config: VideoEngineConfig, fallbackDelayMs: number): number {
    const configuredMaxDelayMs = config.retryPolicy?.maxRetryDelayMs ?? fallbackDelayMs;
    return Math.max(0, Math.min(30000, Math.floor(configuredMaxDelayMs)));
  }

  private getBackoffMultiplier(config: VideoEngineConfig): number {
    const configuredMultiplier = config.retryPolicy?.backoffMultiplier ?? 1;
    return Math.max(1, Math.min(4, configuredMultiplier));
  }

  private getJitterRatio(config: VideoEngineConfig): number {
    const configuredJitterRatio = config.retryPolicy?.jitterRatio ?? 0;
    return Math.max(0, Math.min(1, configuredJitterRatio));
  }

  private isSupersededLoadRequest(requestId: number): boolean {
    return requestId !== this.loadRequestId;
  }

  private assertActiveLoadRequest(requestId: number): void {
    if (this.isSupersededLoadRequest(requestId)) {
      throw this.createSupersededLoadError();
    }
  }

  private createSupersededLoadError(): Error {
    return new Error('VideoEngine.loadSource() superseded by a newer load request');
  }

  private assertNotAborted(signal?: AbortSignal): void {
    if (!signal?.aborted) {
      return;
    }

    throw this.createAbortedLoadError();
  }

  private createAbortedLoadError(): Error {
    const error = new Error('VideoEngine.loadSource() aborted');
    error.name = 'AbortError';
    return error;
  }

  private isAbortedLoadError(error: Error): boolean {
    return error.name === 'AbortError' || error.message === 'VideoEngine.loadSource() aborted';
  }

  private isRetriableLoadError(
    error: Error,
    retryOn: Array<'network' | 'timeout' | 'server' | 'unsupported' | 'unknown' | 'all'> | undefined
  ): boolean {
    if (this.isAbortedLoadError(error)) {
      return false;
    }

    const retryRules = retryOn ?? ['network', 'timeout', 'server'];
    if (retryRules.includes('all')) {
      return true;
    }

    const category = this.classifyLoadError(error);
    return retryRules.includes(category);
  }

  private classifyLoadError(error: Error): 'network' | 'timeout' | 'server' | 'unsupported' | 'unknown' {
    const message = error.message.toLowerCase();

    if (message.includes('timeout')) {
      return 'timeout';
    }

    if (
      message.includes('network') ||
      message.includes('failed to fetch') ||
      message.includes('ecconn') ||
      message.includes('econn') ||
      message.includes('err_network')
    ) {
      return 'network';
    }

    if (/(status|http)\s*5\d\d/.test(message) || /\b50\d\b/.test(message)) {
      return 'server';
    }

    if (
      message.includes('unsupported') ||
      message.includes('not supported') ||
      message.includes('cannot play') ||
      message.includes('codec')
    ) {
      return 'unsupported';
    }

    return 'unknown';
  }

  private async waitForRetryDelay(delayMs: number, signal?: AbortSignal): Promise<void> {
    if (delayMs <= 0) {
      this.assertNotAborted(signal);
      return;
    }

    await this.runWithAbortSignal(
      new Promise<void>((resolve) => {
        globalThis.setTimeout(resolve, delayMs);
      }),
      signal
    );
  }

  private calculateRetryDelay(options: {
    retryAttempt: number;
    baseDelayMs: number;
    maxDelayMs: number;
    backoffMultiplier: number;
    jitterRatio: number;
  }): number {
    const {
      retryAttempt,
      baseDelayMs,
      maxDelayMs,
      backoffMultiplier,
      jitterRatio,
    } = options;

    if (baseDelayMs <= 0) {
      return 0;
    }

    const exponentialDelay = baseDelayMs * Math.pow(backoffMultiplier, retryAttempt);
    const cappedDelay = Math.min(maxDelayMs, exponentialDelay);
    if (jitterRatio <= 0) {
      return Math.floor(cappedDelay);
    }

    const jitterDelta = cappedDelay * jitterRatio;
    const randomOffset = (Math.random() * 2 - 1) * jitterDelta;
    return Math.max(0, Math.floor(cappedDelay + randomOffset));
  }

  private runWithAbortSignal<T>(
    task: Promise<T>,
    signal: AbortSignal | undefined,
    onAbort?: () => void
  ): Promise<T> {
    if (!signal) {
      return task;
    }

    if (signal.aborted) {
      onAbort?.();
      return Promise.reject(this.createAbortedLoadError());
    }

    return new Promise<T>((resolve, reject) => {
      const cleanup = () => {
        signal.removeEventListener('abort', handleAbort);
      };

      const handleAbort = () => {
        cleanup();
        onAbort?.();
        reject(this.createAbortedLoadError());
      };

      signal.addEventListener('abort', handleAbort, { once: true });

      task.then(
        (value) => {
          cleanup();
          resolve(value);
        },
        (error) => {
          cleanup();
          reject(error);
        }
      );
    });
  }

  private assertNotDisposed(methodName: string): void {
    if (this.isDisposed) {
      throw new Error(`VideoEngine.${methodName}() called after dispose`);
    }
  }
}
