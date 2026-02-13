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

const createPassThroughFactory = (): StreamingAdapterFactory => ({
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
      getQualityLevels: () => [],
      setQuality: () => undefined,
    }) as StreamingAdapter,
});

const installRafMock = () => {
  const callbacks = new Map<number, FrameRequestCallback>();
  let id = 0;

  const requestAnimationFrame = vi.fn((callback: FrameRequestCallback): number => {
    id += 1;
    callbacks.set(id, callback);
    return id;
  });

  const cancelAnimationFrame = vi.fn((frameId: number) => {
    callbacks.delete(frameId);
  });

  Object.defineProperty(window, 'requestAnimationFrame', {
    configurable: true,
    writable: true,
    value: requestAnimationFrame,
  });

  Object.defineProperty(window, 'cancelAnimationFrame', {
    configurable: true,
    writable: true,
    value: cancelAnimationFrame,
  });

  return {
    requestAnimationFrame,
    cancelAnimationFrame,
    flushAll: () => {
      const pending = [...callbacks.values()];
      callbacks.clear();
      pending.forEach((callback) => callback(performance.now()));
    },
  };
};

describe('VideoEngine event lifecycle', () => {
  it('removes bound media element listeners on dispose', async () => {
    const videoElement = document.createElement('video');
    const onPlay = vi.fn();

    const engine = new VideoEngine(
      videoElement,
      {
        onPlay,
      },
      {
        capabilitiesResolver: async () => testCapabilities,
        adapters: [createPassThroughFactory()],
      }
    );

    await engine.loadSource({
      src: 'https://cdn.example.com/video.mp4',
    });

    videoElement.dispatchEvent(new Event('play'));
    expect(onPlay).toHaveBeenCalledTimes(1);

    engine.dispose();
    videoElement.dispatchEvent(new Event('play'));

    expect(onPlay).toHaveBeenCalledTimes(1);
  });

  it('clears current source after cleanup', async () => {
    const videoElement = document.createElement('video');

    const engine = new VideoEngine(videoElement, {}, {
      capabilitiesResolver: async () => testCapabilities,
      adapters: [createPassThroughFactory()],
    });

    await engine.loadSource({
      src: 'https://cdn.example.com/video.mp4',
    });

    expect(engine.getCurrentSource()).toBe('https://cdn.example.com/video.mp4');

    engine.cleanup();

    expect(engine.getCurrentSource()).toBeUndefined();
    expect(engine.getCurrentStrategy()).toBeUndefined();
  });

  it('throttles and thresholds timeupdate events before emitting', async () => {
    const videoElement = document.createElement('video');
    const onTimeUpdate = vi.fn();
    const raf = installRafMock();

    Object.defineProperty(videoElement, 'duration', {
      configurable: true,
      value: 120,
    });

    const engine = new VideoEngine(
      videoElement,
      { onTimeUpdate },
      {
        capabilitiesResolver: async () => testCapabilities,
        adapters: [createPassThroughFactory()],
      }
    );

    await engine.loadSource({ src: 'https://cdn.example.com/video.mp4' });

    videoElement.currentTime = 10;
    videoElement.dispatchEvent(new Event('timeupdate'));
    videoElement.dispatchEvent(new Event('timeupdate'));
    videoElement.dispatchEvent(new Event('timeupdate'));

    expect(onTimeUpdate).toHaveBeenCalledTimes(0);
    expect(raf.requestAnimationFrame).toHaveBeenCalledTimes(1);

    raf.flushAll();
    expect(onTimeUpdate).toHaveBeenCalledTimes(1);
    expect(onTimeUpdate).toHaveBeenLastCalledWith(10, 120);

    videoElement.currentTime = 10.02; // below epsilon (0.05)
    videoElement.dispatchEvent(new Event('timeupdate'));
    raf.flushAll();
    expect(onTimeUpdate).toHaveBeenCalledTimes(1);

    videoElement.currentTime = 10.2; // above epsilon
    videoElement.dispatchEvent(new Event('timeupdate'));
    raf.flushAll();
    expect(onTimeUpdate).toHaveBeenCalledTimes(2);

    engine.dispose();
  });

  it('throttles and thresholds progress events before emitting', async () => {
    const videoElement = document.createElement('video');
    const onProgress = vi.fn();
    const raf = installRafMock();

    let bufferedEnd = 20;

    Object.defineProperty(videoElement, 'duration', {
      configurable: true,
      value: 100,
    });

    Object.defineProperty(videoElement, 'buffered', {
      configurable: true,
      get: () =>
        ({
          length: 1,
          end: () => bufferedEnd,
          start: () => 0,
        }) as TimeRanges,
    });

    const engine = new VideoEngine(
      videoElement,
      { onProgress },
      {
        capabilitiesResolver: async () => testCapabilities,
        adapters: [createPassThroughFactory()],
      }
    );

    await engine.loadSource({ src: 'https://cdn.example.com/video.mp4' });

    videoElement.dispatchEvent(new Event('progress'));
    videoElement.dispatchEvent(new Event('progress'));
    expect(onProgress).toHaveBeenCalledTimes(0);
    expect(raf.requestAnimationFrame).toHaveBeenCalledTimes(1);

    raf.flushAll();
    expect(onProgress).toHaveBeenCalledTimes(1);
    expect(onProgress).toHaveBeenLastCalledWith(20);

    bufferedEnd = 20.1; // below epsilon (0.25)
    videoElement.dispatchEvent(new Event('progress'));
    raf.flushAll();
    expect(onProgress).toHaveBeenCalledTimes(1);

    bufferedEnd = 23; // above epsilon
    videoElement.dispatchEvent(new Event('progress'));
    raf.flushAll();
    expect(onProgress).toHaveBeenCalledTimes(2);
    expect(onProgress).toHaveBeenLastCalledWith(23);

    engine.dispose();
  });
});
