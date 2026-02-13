import { describe, expect, it, vi } from 'vitest';

import { VideoEnginePluginManager } from '@/core/plugins/plugin-manager';
import type { VideoEnginePlugin } from '@/core/plugins/types';

const createVideoElement = (): HTMLVideoElement => {
  return document.createElement('video');
};

describe('VideoEnginePluginManager', () => {
  it('runs lifecycle hooks for registered plugins', () => {
    const hookOrder: string[] = [];

    const plugin: VideoEnginePlugin = {
      name: 'test-plugin',
      setup: () => hookOrder.push('setup'),
      onInit: () => hookOrder.push('init'),
      onSourceLoadStart: () => hookOrder.push('loadStart'),
      onSourceLoaded: () => hookOrder.push('loaded'),
      onSourceLoadFailed: () => hookOrder.push('loadFailed'),
      onRetry: () => hookOrder.push('retry'),
      onFailover: () => hookOrder.push('failover'),
      onPlay: () => hookOrder.push('play'),
      onPause: () => hookOrder.push('pause'),
      onTimeUpdate: () => hookOrder.push('timeupdate'),
      onVolumeChange: () => hookOrder.push('volume'),
      onQualityChange: () => hookOrder.push('quality'),
      onError: () => hookOrder.push('error'),
      onDispose: () => hookOrder.push('dispose'),
    };

    const manager = new VideoEnginePluginManager([plugin]);

    manager.setup({ videoElement: createVideoElement() });
    manager.onInit();
    manager.onSourceLoadStart({
      src: 'https://cdn.example.com/video.m3u8',
      strategy: 'hlsjs',
      capabilities: {
        hasNativeHls: false,
        hasHlsJs: true,
        hasDashJs: true,
        isMobile: false,
        isIOS: false,
        isAndroid: false,
        supportsInlinePlayback: true,
        supportsAutoplay: true,
        supportsPictureInPicture: true,
      },
    });
    manager.onSourceLoaded({
      src: 'https://cdn.example.com/video.m3u8',
      strategy: 'hlsjs',
      capabilities: {
        hasNativeHls: false,
        hasHlsJs: true,
        hasDashJs: true,
        isMobile: false,
        isIOS: false,
        isAndroid: false,
        supportsInlinePlayback: true,
        supportsAutoplay: true,
        supportsPictureInPicture: true,
      },
    });
    manager.onSourceLoadFailed({
      src: 'https://cdn.example.com/video.m3u8',
      strategy: 'hlsjs',
      error: new Error('test'),
      attempt: 1,
      totalAttempts: 2,
    });
    manager.onRetry({
      src: 'https://cdn.example.com/video.m3u8',
      strategy: 'hlsjs',
      error: new Error('retry'),
      attempt: 1,
      retryAttempt: 1,
      maxRetries: 2,
      retryDelayMs: 100,
    });
    manager.onFailover({
      fromSrc: 'https://cdn.example.com/video-primary.m3u8',
      fromStrategy: 'hlsjs',
      toSrc: 'https://cdn.example.com/video-fallback.m3u8',
      toStrategy: 'hlsjs',
      error: new Error('failover'),
      attempt: 2,
      totalAttempts: 3,
    });
    manager.onPlay();
    manager.onPause();
    manager.onTimeUpdate({ currentTime: 10, duration: 120 });
    manager.onVolumeChange({ volume: 0.6, muted: false });
    manager.onQualityChange('720p');
    manager.onError({ error: new Error('sample') });
    manager.dispose();

    expect(hookOrder).toEqual([
      'setup',
      'init',
      'loadStart',
      'loaded',
      'loadFailed',
      'retry',
      'failover',
      'play',
      'pause',
      'timeupdate',
      'volume',
      'quality',
      'error',
      'dispose',
    ]);
  });

  it('isolates plugin errors and keeps executing others', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const brokenPlugin: VideoEnginePlugin = {
      name: 'broken',
      onPlay: () => {
        throw new Error('boom');
      },
    };

    const healthyOnPlay = vi.fn();
    const healthyPlugin: VideoEnginePlugin = {
      name: 'healthy',
      onPlay: healthyOnPlay,
    };

    const manager = new VideoEnginePluginManager([brokenPlugin, healthyPlugin]);
    manager.onPlay();

    expect(healthyOnPlay).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledTimes(1);

    warnSpy.mockRestore();
  });
});
