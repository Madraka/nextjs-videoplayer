import { describe, expect, it, vi } from 'vitest';

import { createDashJsAdapter } from '@/core/adapters/dashjs-adapter';
import { createDirectVideoAdapter } from '@/core/adapters/direct-video-adapter';
import { createHlsJsAdapter } from '@/core/adapters/hlsjs-adapter';
import { createNativeHlsAdapter } from '@/core/adapters/native-hls-adapter';
import type { BrowserCapabilities } from '@/core/compatibility';

const hlsDestroySpy = vi.fn();
const hlsOnHandlers = new Map<string, (event: unknown, data: unknown) => void>();
let markHlsLoadStarted: (() => void) | undefined;

vi.mock('hls.js', () => {
  class MockHls {
    static Events = {
      MANIFEST_PARSED: 'MANIFEST_PARSED',
      ERROR: 'ERROR',
      LEVEL_SWITCHED: 'LEVEL_SWITCHED',
    };

    static isSupported(): boolean {
      return true;
    }

    levels = [];
    currentLevel = 0;

    loadSource = vi.fn(() => {
      markHlsLoadStarted?.();
    });
    attachMedia = vi.fn();
    destroy = hlsDestroySpy;
    on = vi.fn((eventName: string, callback: (event: unknown, data: unknown) => void) => {
      hlsOnHandlers.set(eventName, callback);
    });
  }

  return {
    default: MockHls,
  };
});

const dashResetSpy = vi.fn();
const dashOnHandlers = new Map<string, (payload: unknown) => void>();
let markDashLoadStarted: (() => void) | undefined;

vi.mock('dashjs', () => {
  return {
    MediaPlayer: () => ({
      create: () => ({
        initialize: vi.fn(() => {
          markDashLoadStarted?.();
        }),
        on: vi.fn((eventName: string, callback: (payload: unknown) => void) => {
          dashOnHandlers.set(eventName, callback);
        }),
        reset: dashResetSpy,
        getBitrateInfoListFor: vi.fn(() => []),
        setQualityFor: vi.fn(),
      }),
    }),
  };
});

vi.mock('@/core/compatibility', async () => {
  const actual = await vi.importActual<typeof import('@/core/compatibility')>('@/core/compatibility');
  return {
    ...actual,
    isVideoFormatSupported: () => true,
  };
});

const capabilities: BrowserCapabilities = {
  hasNativeHls: true,
  hasHlsJs: true,
  hasDashJs: true,
  isMobile: false,
  isIOS: false,
  isAndroid: false,
  supportsInlinePlayback: true,
  supportsAutoplay: true,
  supportsPictureInPicture: true,
};

describe('adapter abort handling', () => {
  it('aborts hls.js adapter load when signal is canceled and destroys instance', async () => {
    hlsDestroySpy.mockClear();
    hlsOnHandlers.clear();
    const hlsLoadStarted = new Promise<void>((resolve) => {
      markHlsLoadStarted = resolve;
    });

    const adapter = createHlsJsAdapter();
    const controller = new AbortController();
    const loadPromise = adapter.load({
      src: 'https://cdn.example.com/video.m3u8',
      capabilities,
      videoElement: document.createElement('video'),
      signal: controller.signal,
    });

    await hlsLoadStarted;
    controller.abort();

    await expect(loadPromise).rejects.toMatchObject({
      name: 'AbortError',
      message: 'HlsJsAdapter.load() aborted',
    });
    expect(hlsDestroySpy).toHaveBeenCalledTimes(1);
  });

  it('aborts dash.js adapter load when signal is canceled and resets instance', async () => {
    dashResetSpy.mockClear();
    dashOnHandlers.clear();
    const dashLoadStarted = new Promise<void>((resolve) => {
      markDashLoadStarted = resolve;
    });

    const adapter = createDashJsAdapter();
    const controller = new AbortController();
    const loadPromise = adapter.load({
      src: 'https://cdn.example.com/video.mpd',
      capabilities,
      videoElement: document.createElement('video'),
      signal: controller.signal,
    });

    await dashLoadStarted;
    controller.abort();

    await expect(loadPromise).rejects.toMatchObject({
      name: 'AbortError',
      message: 'DashJsAdapter.load() aborted',
    });
    expect(dashResetSpy).toHaveBeenCalledTimes(1);
  });

  it('aborts direct adapter load when signal is canceled', async () => {
    const adapter = createDirectVideoAdapter();
    const videoElement = document.createElement('video');
    videoElement.load = vi.fn();
    const controller = new AbortController();

    const loadPromise = adapter.load({
      src: 'https://cdn.example.com/video.mp4',
      capabilities,
      videoElement,
      signal: controller.signal,
    });

    controller.abort();

    await expect(loadPromise).rejects.toMatchObject({
      name: 'AbortError',
      message: 'DirectVideoAdapter.load() aborted',
    });
    expect(videoElement.load).toHaveBeenCalledTimes(1);
  });

  it('aborts native hls adapter load when signal is canceled', async () => {
    const adapter = createNativeHlsAdapter();
    const controller = new AbortController();
    const loadPromise = adapter.load({
      src: 'https://cdn.example.com/video.m3u8',
      capabilities,
      videoElement: document.createElement('video'),
      signal: controller.signal,
    });

    controller.abort();

    await expect(loadPromise).rejects.toMatchObject({
      name: 'AbortError',
      message: 'NativeHlsAdapter.load() aborted',
    });
  });
});
