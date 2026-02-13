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
    const { default: Hls } = (await import('hls.js')) as { default: HlsStatic };

    if (!Hls.isSupported()) {
      throw new Error('HLS.js is not supported in this browser');
    }

    this.instance = new Hls({
      enableWorker: true,
      lowLatencyMode: false,
      backBufferLength: 90,
    });

    await new Promise<void>((resolve, reject) => {
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
    });
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
}

export const createHlsJsAdapter = (): StreamingAdapter => {
  return new HlsJsAdapter();
};
