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

  it('retries the same source before failing over when retry policy is enabled', async () => {
    const attempts: string[] = [];
    const primary = 'https://cdn.example.com/primary.m3u8';
    const fallback = 'https://cdn.example.com/fallback.m3u8';

    const engine = new VideoEngine(
      document.createElement('video'),
      {},
      {
        capabilitiesResolver: async () => testCapabilities,
        adapters: [
          createPassThroughFactory(async (src, videoElement) => {
            attempts.push(src);
            if (src === primary && attempts.filter((value) => value === primary).length === 1) {
              throw new Error('temporary network failure');
            }

            videoElement.src = src;
          }),
        ],
      }
    );

    await engine.loadSource({
      src: primary,
      fallbackSources: [fallback],
      retryPolicy: {
        maxRetries: 1,
      },
    });

    expect(attempts).toEqual([primary, primary]);
    expect(engine.getCurrentSource()).toBe(primary);
  });

  it('applies exponential backoff delays when retry policy is configured', async () => {
    vi.useFakeTimers();
    try {
      const attempts: string[] = [];
      const source = 'https://cdn.example.com/primary.m3u8';
      const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');

      const engine = new VideoEngine(
        document.createElement('video'),
        {},
        {
          capabilitiesResolver: async () => testCapabilities,
          adapters: [
            createPassThroughFactory(async (src, videoElement) => {
              attempts.push(src);
              if (attempts.length < 3) {
                throw new Error('network temporary failure');
              }
              videoElement.src = src;
            }),
          ],
        }
      );

      const loadPromise = engine.loadSource({
        src: source,
        retryPolicy: {
          maxRetries: 2,
          retryDelayMs: 100,
          backoffMultiplier: 2,
          maxRetryDelayMs: 1000,
          jitterRatio: 0,
          retryOn: ['network'],
        },
      });

      await vi.runAllTimersAsync();

      await expect(loadPromise).resolves.toBeUndefined();
      expect(engine.getCurrentSource()).toBe(source);
      expect(attempts).toEqual([source, source, source]);

      const delayCalls = setTimeoutSpy.mock.calls
        .map((call) => call[1])
        .filter((value): value is number => typeof value === 'number');

      expect(delayCalls).toEqual(expect.arrayContaining([100, 200]));
      setTimeoutSpy.mockRestore();
    } finally {
      vi.useRealTimers();
    }
  });

  it('does not retry unsupported errors when retryOn excludes unsupported', async () => {
    const attempts: string[] = [];
    const primary = 'https://cdn.example.com/primary.m3u8';
    const fallback = 'https://cdn.example.com/fallback.m3u8';

    const engine = new VideoEngine(
      document.createElement('video'),
      {},
      {
        capabilitiesResolver: async () => testCapabilities,
        adapters: [
          createPassThroughFactory(async (src, videoElement) => {
            attempts.push(src);
            if (src === primary) {
              throw new Error('Video format not supported by this browser');
            }
            videoElement.src = src;
          }),
        ],
      }
    );

    await engine.loadSource({
      src: primary,
      fallbackSources: [fallback],
      retryPolicy: {
        maxRetries: 2,
        retryOn: ['network', 'timeout'],
      },
    });

    expect(attempts).toEqual([primary, fallback]);
    expect(engine.getCurrentSource()).toBe(fallback);
  });

  it('emits plugin retry and failover lifecycle events with metadata', async () => {
    const retryEvents: Array<{ src: string; retryAttempt: number; maxRetries: number }> = [];
    const failoverEvents: Array<{ fromSrc: string; toSrc: string }> = [];
    const primary = 'https://cdn.example.com/primary.m3u8';
    const fallback = 'https://cdn.example.com/fallback.m3u8';

    const engine = new VideoEngine(
      document.createElement('video'),
      {},
      {
        capabilitiesResolver: async () => testCapabilities,
        adapters: [
          createPassThroughFactory(async (src, videoElement) => {
            if (src === primary) {
              throw new Error('network failure');
            }
            videoElement.src = src;
          }),
        ],
        plugins: [
          {
            name: 'retry-failover-observer',
            onRetry: ({ src, retryAttempt, maxRetries }) => {
              retryEvents.push({ src, retryAttempt, maxRetries });
            },
            onFailover: ({ fromSrc, toSrc }) => {
              failoverEvents.push({ fromSrc, toSrc });
            },
          },
        ],
      }
    );

    await engine.loadSource({
      src: primary,
      fallbackSources: [fallback],
      retryPolicy: {
        maxRetries: 1,
        retryOn: ['network'],
      },
    });

    expect(retryEvents).toEqual([
      {
        src: primary,
        retryAttempt: 1,
        maxRetries: 1,
      },
    ]);
    expect(failoverEvents).toEqual([
      {
        fromSrc: primary,
        toSrc: fallback,
      },
    ]);
    expect(engine.getCurrentSource()).toBe(fallback);
  });

  it('retries unknown errors only when retryOn includes all', async () => {
    const attempts: string[] = [];
    const source = 'https://cdn.example.com/primary.m3u8';

    const engine = new VideoEngine(
      document.createElement('video'),
      {},
      {
        capabilitiesResolver: async () => testCapabilities,
        adapters: [
          createPassThroughFactory(async (src, videoElement) => {
            attempts.push(src);
            if (attempts.length === 1) {
              throw new Error('mysterious playback glitch');
            }
            videoElement.src = src;
          }),
        ],
      }
    );

    await engine.loadSource({
      src: source,
      retryPolicy: {
        maxRetries: 1,
        retryOn: ['all'],
      },
    });

    expect(attempts).toEqual([source, source]);
    expect(engine.getCurrentSource()).toBe(source);
  });

  it('normalizes and de-duplicates source candidates before failover attempts', async () => {
    const attempts: string[] = [];
    const primary = 'https://cdn.example.com/video-1.mp4';
    const secondary = 'https://cdn.example.com/video-2.mp4';

    const engine = new VideoEngine(
      document.createElement('video'),
      {},
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
      }
    );

    await engine.loadSource({
      src: ` ${primary} `,
      fallbackSources: [primary, ` ${secondary} `, ''],
    });

    expect(attempts).toEqual([primary, secondary]);
  });
});
