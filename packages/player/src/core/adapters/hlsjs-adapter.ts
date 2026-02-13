import type { AdapterLoadContext, QualityLevel, StreamingAdapter } from '@/core/adapters/types';

interface HlsLevel {
  height?: number;
}

interface HlsInstance {
  levels: HlsLevel[];
  currentLevel: number;
  loadSource(src: string): void;
  attachMedia(video: HTMLVideoElement): void;
  destroy(): void;
  on(eventName: string, callback: (event: unknown, data: unknown) => void): void;
}

interface HlsStatic {
  isSupported(): boolean;
  Events: {
    MANIFEST_PARSED: string;
    ERROR: string;
    LEVEL_SWITCHED: string;
  };
  new (options: { enableWorker: boolean; lowLatencyMode: boolean; backBufferLength: number }): HlsInstance;
}

class HlsJsAdapter implements StreamingAdapter {
  readonly id = 'hlsjs';
  private instance?: HlsInstance;

  async load(context: AdapterLoadContext): Promise<void> {
    this.assertNotAborted(context.signal);
    const { default: Hls } = (await import('hls.js')) as { default: HlsStatic };
    this.assertNotAborted(context.signal);

    if (!Hls.isSupported()) {
      throw new Error('HLS.js is not supported in this browser');
    }

    this.instance = new Hls({
      enableWorker: true,
      lowLatencyMode: false,
      backBufferLength: 90,
    });

    await this.runWithAbortSignal(
      new Promise<void>((resolve, reject) => {
        const hls = this.instance as HlsInstance;

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          resolve();
        });

        hls.on(Hls.Events.ERROR, (_event, data) => {
          const maybeFatal = (data as { fatal?: boolean; type?: string; details?: string }) || {};
          if (maybeFatal.fatal) {
            reject(new Error(`HLS.js fatal error: ${maybeFatal.type ?? 'unknown'} - ${maybeFatal.details ?? 'unknown'}`));
          }
        });

        hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
          const levelIndex = (data as { level?: number })?.level;
          if (levelIndex === undefined) {
            return;
          }

          const level = hls.levels[levelIndex];
          context.onQualityChange?.(level?.height ? `${level.height}p` : 'auto');
        });

        hls.loadSource(context.src);
        hls.attachMedia(context.videoElement);
      }),
      context.signal,
      () => {
        this.instance?.destroy();
      }
    );
  }

  destroy(): void {
    this.instance?.destroy();
    this.instance = undefined;
  }

  getQualityLevels(): QualityLevel[] {
    if (!this.instance) {
      return [];
    }

    return this.instance.levels.map((level, index) => ({
      id: String(index),
      label: level.height ? `${level.height}p` : `Level ${index}`,
      height: level.height,
    }));
  }

  setQuality(qualityId: string): void {
    if (!this.instance) {
      return;
    }

    this.instance.currentLevel = Number.parseInt(qualityId, 10);
  }

  private assertNotAborted(signal?: AbortSignal): void {
    if (signal?.aborted) {
      throw this.createAbortError();
    }
  }

  private createAbortError(): Error {
    const error = new Error('HlsJsAdapter.load() aborted');
    error.name = 'AbortError';
    return error;
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
      return Promise.reject(this.createAbortError());
    }

    return new Promise<T>((resolve, reject) => {
      const cleanup = () => {
        signal.removeEventListener('abort', handleAbort);
      };

      const handleAbort = () => {
        cleanup();
        onAbort?.();
        reject(this.createAbortError());
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
}

export const createHlsJsAdapter = (): StreamingAdapter => {
  return new HlsJsAdapter();
};
