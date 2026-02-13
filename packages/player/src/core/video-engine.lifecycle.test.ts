import { describe, expect, it, vi } from 'vitest';

import type { StreamingAdapter, StreamingAdapterFactory } from '@/core/adapters/types';
import type { BrowserCapabilities } from '@/core/compatibility';
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
  options: {
    getQualityLevels?: () => Array<{ id: string; label: string; height?: number }>;
    onSetQuality?: (qualityId: string) => void;
  } = {}
): StreamingAdapterFactory => ({
  id: 'test-adapter',
  priority: 1000,
  canHandle: () => true,
  create: () =>
    ({
      id: 'test-adapter',
      load: async ({ src, videoElement }) => {
        videoElement.src = src;
      },
      destroy: () => undefined,
      getQualityLevels: () => options.getQualityLevels?.() ?? [],
      setQuality: (qualityId: string) => options.onSetQuality?.(qualityId),
    }) as StreamingAdapter,
});

describe('VideoEngine lifecycle', () => {
  it('initializes capabilities once for concurrent initialize calls', async () => {
    const onReady = vi.fn();
    const resolveCapabilities = vi.fn(async () => testCapabilities);
    const engine = new VideoEngine(
      document.createElement('video'),
      {
        onReady,
      },
      {
        capabilitiesResolver: resolveCapabilities,
        adapters: [createPassThroughFactory()],
      }
    );

    await Promise.all([engine.initialize(), engine.initialize()]);

    expect(resolveCapabilities).toHaveBeenCalledTimes(1);
    expect(onReady).toHaveBeenCalledTimes(1);
  });

  it('exposes quality levels and delegates quality selection to active adapter', async () => {
    const setQualitySpy = vi.fn();
    const levels = [
      { id: '0', label: '360p', height: 360 },
      { id: '1', label: '720p', height: 720 },
    ];
    const engine = new VideoEngine(document.createElement('video'), {}, {
      capabilitiesResolver: async () => testCapabilities,
      adapters: [
        createPassThroughFactory({
          getQualityLevels: () => levels,
          onSetQuality: setQualitySpy,
        }),
      ],
    });

    await engine.loadSource({
      src: 'https://cdn.example.com/video.m3u8',
    });

    expect(engine.getQualityLevels()).toEqual(levels);

    engine.setQuality('1');
    expect(setQualitySpy).toHaveBeenCalledWith('1');
  });

  it('throws when loadSource is called after dispose', async () => {
    const engine = new VideoEngine(document.createElement('video'), {}, {
      capabilitiesResolver: async () => testCapabilities,
      adapters: [createPassThroughFactory()],
    });

    engine.dispose();

    await expect(
      engine.loadSource({
        src: 'https://cdn.example.com/video.m3u8',
      })
    ).rejects.toThrow('VideoEngine.loadSource() called after dispose');
  });

  it('cancels stale loadSource result when a newer load starts', async () => {
    let firstLoadResolve: (() => void) | undefined;
    const firstLoadDone = new Promise<void>((resolve) => {
      firstLoadResolve = resolve;
    });

    const createAdapter = (): StreamingAdapter => ({
      id: 'test-adapter',
      load: async ({ src, videoElement }) => {
        if (src.includes('first')) {
          await firstLoadDone;
        }
        videoElement.src = src;
      },
      destroy: vi.fn(),
      getQualityLevels: () => [],
      setQuality: () => undefined,
    });

    const engine = new VideoEngine(document.createElement('video'), {}, {
      capabilitiesResolver: async () => testCapabilities,
      adapters: [
        {
          id: 'test-adapter',
          priority: 1000,
          canHandle: () => true,
          create: createAdapter,
        },
      ],
    });

    const firstLoadPromise = engine.loadSource({
      src: 'https://cdn.example.com/first.m3u8',
    });

    await Promise.resolve();

    const secondLoadPromise = engine.loadSource({
      src: 'https://cdn.example.com/second.m3u8',
    });

    firstLoadResolve?.();

    await expect(firstLoadPromise).rejects.toThrow('VideoEngine.loadSource() superseded by a newer load request');
    await expect(secondLoadPromise).resolves.toBeUndefined();

    expect(engine.getCurrentSource()).toBe('https://cdn.example.com/second.m3u8');
  });

  it('aborts in-flight source load when signal is canceled', async () => {
    let markLoadStarted: (() => void) | undefined;
    const loadStarted = new Promise<void>((resolve) => {
      markLoadStarted = resolve;
    });

    let releaseLoad: (() => void) | undefined;
    const loadGate = new Promise<void>((resolve) => {
      releaseLoad = resolve;
    });

    const destroySpy = vi.fn();
    const engine = new VideoEngine(document.createElement('video'), {}, {
      capabilitiesResolver: async () => testCapabilities,
      adapters: [
        {
          id: 'test-adapter',
          priority: 1000,
          canHandle: () => true,
          create: () =>
            ({
              id: 'test-adapter',
              load: async ({ src, videoElement }) => {
                markLoadStarted?.();
                await loadGate;
                videoElement.src = src;
              },
              destroy: destroySpy,
              getQualityLevels: () => [],
              setQuality: () => undefined,
            }) as StreamingAdapter,
        },
      ],
    });

    const controller = new AbortController();
    const loadPromise = engine.loadSource({
      src: 'https://cdn.example.com/abortable.m3u8',
      signal: controller.signal,
    });

    await loadStarted;
    controller.abort();
    releaseLoad?.();

    await expect(loadPromise).rejects.toMatchObject({
      name: 'AbortError',
      message: 'VideoEngine.loadSource() aborted',
    });
    expect(destroySpy).toHaveBeenCalledTimes(1);
    expect(engine.getCurrentSource()).toBeUndefined();
  });
});
