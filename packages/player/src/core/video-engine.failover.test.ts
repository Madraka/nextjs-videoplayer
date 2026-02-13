import { describe, expect, it, vi } from 'vitest';

import type { StreamingAdapter, StreamingAdapterFactory } from '@/core/adapters/types';
import type { BrowserCapabilities } from '@/core/compatibility';
import type { VideoEnginePlugin } from '@/core/plugins/types';
import { VideoEngine } from '@/core/video-engine';

const testCapabilities: BrowserCapabilities = {
  hasNativeHls: false,
  hasHlsJs: true,
  hasDashJs: true,
  isMobile: false,
  isIOS: false,
  isAndroid: false,
  supportsInlinePlayback: true,
  supportsAutoplay: true,
  supportsPictureInPicture: true,
};

const createPassThroughFactory = (
  loadFn: (src: string, videoElement: HTMLVideoElement) => Promise<void>
): StreamingAdapterFactory => ({
  id: 'test-adapter',
  priority: 1000,
  canHandle: () => true,
  create: () =>
    ({
      id: 'test-adapter',
      load: async ({ src, videoElement }) => loadFn(src, videoElement),
      destroy: () => undefined,
      getQualityLevels: () => [],
      setQuality: () => undefined,
    }) as StreamingAdapter,
});

describe('VideoEngine failover', () => {
  it('falls back to secondary source when primary source fails', async () => {
    const attempts: string[] = [];
    const pluginEvents: string[] = [];

    const plugin: VideoEnginePlugin = {
      name: 'probe',
      onSourceLoadStart: ({ src }) => pluginEvents.push(`start:${src}`),
      onSourceLoadFailed: ({ src }) => pluginEvents.push(`failed:${src}`),
      onSourceLoaded: ({ src }) => pluginEvents.push(`loaded:${src}`),
    };

    const onLoadStart = vi.fn();
    const onLoadEnd = vi.fn();
    const onError = vi.fn();

    const primary = 'https://cdn.example.com/primary-broken.mp4';
    const backup = 'https://cdn.example.com/backup-ok.mp4';

    const engine = new VideoEngine(
      document.createElement('video'),
      {
        onLoadStart,
        onLoadEnd,
        onError,
      },
      {
        capabilitiesResolver: async () => testCapabilities,
        adapters: [
          createPassThroughFactory(async (src, videoElement) => {
            attempts.push(src);
            if (src === primary) {
              throw new Error('primary failed');
            }
            videoElement.src = src;
          }),
        ],
        plugins: [plugin],
      }
    );

    await engine.loadSource({
      src: primary,
      fallbackSources: [backup],
    });

    expect(attempts).toEqual([primary, backup]);
    expect(engine.getCurrentSource()).toBe(backup);
    expect(engine.getCurrentStrategy()).toBe('test-adapter');
    expect(onLoadStart).toHaveBeenCalledTimes(1);
    expect(onLoadEnd).toHaveBeenCalledTimes(1);
    expect(onError).not.toHaveBeenCalled();
    expect(pluginEvents).toEqual([
      `start:${primary}`,
      `failed:${primary}`,
      `start:${backup}`,
      `loaded:${backup}`,
    ]);
  });

  it('throws aggregate error when all failover sources fail', async () => {
    const onError = vi.fn();
    const pluginFailed = vi.fn();

    const engine = new VideoEngine(
      document.createElement('video'),
      {
        onError,
      },
      {
        capabilitiesResolver: async () => testCapabilities,
        adapters: [
          createPassThroughFactory(async () => {
            throw new Error('load failed');
          }),
        ],
        plugins: [
          {
            name: 'probe',
            onSourceLoadFailed: pluginFailed,
          },
        ],
      }
    );

    await expect(
      engine.loadSource({
        src: 'https://cdn.example.com/source-1.mp4',
        fallbackSources: ['https://cdn.example.com/source-2.mp4'],
      })
    ).rejects.toThrow('All playback sources failed');

    expect(pluginFailed).toHaveBeenCalledTimes(2);
    expect(onError).toHaveBeenCalledTimes(1);
  });
});
