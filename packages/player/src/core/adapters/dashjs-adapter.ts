import type { AdapterLoadContext, QualityLevel, StreamingAdapter } from '@/core/adapters/types';

interface DashBitrateInfo {
  bitrate?: number;
  height?: number;
}

interface DashPlayer {
  initialize(videoElement: HTMLVideoElement, src: string, autoplay: boolean): void;
  on(eventName: string, callback: (payload: unknown) => void): void;
  reset(): void;
  getBitrateInfoListFor(type: 'video'): DashBitrateInfo[];
  setQualityFor(type: 'video', qualityIndex: number): void;
}

interface DashModule {
  MediaPlayer: {
    (): {
      create(): DashPlayer;
    };
  };
}

class DashJsAdapter implements StreamingAdapter {
  readonly id = 'dashjs';
  private instance?: DashPlayer;

  async load(context: AdapterLoadContext): Promise<void> {
    const dashjs = (await import('dashjs')) as unknown as DashModule;

    this.instance = dashjs.MediaPlayer().create();

    await new Promise<void>((resolve, reject) => {
      const dash = this.instance as DashPlayer;

      dash.on('streamInitialized', () => {
        resolve();
      });

      dash.on('error', (errorPayload) => {
        const errorValue = (errorPayload as { error?: string })?.error;
        reject(new Error(`Dash.js error: ${errorValue ?? 'unknown'}`));
      });

      dash.initialize(context.videoElement, context.src, false);
    });
  }

  destroy(): void {
    this.instance?.reset();
    this.instance = undefined;
  }

  getQualityLevels(): QualityLevel[] {
    if (!this.instance) {
      return [];
    }

    try {
      const bitrateInfo = this.instance.getBitrateInfoListFor('video');
      return bitrateInfo.map((info, index) => ({
        id: String(index),
        label: info.height ? `${info.height}p` : `${Math.round((info.bitrate ?? 0) / 1000)}k`,
        height: info.height,
      }));
    } catch {
      return [];
    }
  }

  setQuality(qualityId: string): void {
    if (!this.instance) {
      return;
    }

    this.instance.setQualityFor('video', Number.parseInt(qualityId, 10));
  }
}

export const createDashJsAdapter = (): StreamingAdapter => {
  return new DashJsAdapter();
};
