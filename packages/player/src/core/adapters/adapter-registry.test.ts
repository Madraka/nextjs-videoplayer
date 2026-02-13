import { describe, expect, it } from 'vitest';

import { AdapterRegistry } from '@/core/adapters/adapter-registry';
import type { AdapterSelectionContext, StreamingAdapter, StreamingAdapterFactory } from '@/core/adapters/types';
import type { BrowserCapabilities } from '@/core/compatibility';

const baseCapabilities: BrowserCapabilities = {
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

const createAdapterFactory = (
  id: string,
  priority: number,
  supports: (ctx: AdapterSelectionContext) => boolean
): StreamingAdapterFactory => ({
  id,
  priority,
  canHandle: supports,
  create: () =>
    ({
      id,
      load: async () => undefined,
      destroy: () => undefined,
      getQualityLevels: () => [],
      setQuality: () => undefined,
    }) as StreamingAdapter,
});

describe('AdapterRegistry', () => {
  it('resolves the highest-priority adapter that can handle source', () => {
    const registry = new AdapterRegistry();

    registry.register(
      createAdapterFactory('fallback', 10, () => true)
    );

    registry.register(
      createAdapterFactory('hls-primary', 50, ({ src }) => src.endsWith('.m3u8'))
    );

    registry.register(
      createAdapterFactory('hls-secondary', 40, ({ src }) => src.endsWith('.m3u8'))
    );

    const adapter = registry.resolve({ src: 'https://cdn.example.com/video.m3u8', capabilities: baseCapabilities });

    expect(adapter?.id).toBe('hls-primary');
  });

  it('returns undefined when no adapter supports the source', () => {
    const registry = new AdapterRegistry();

    registry.register(createAdapterFactory('dash-only', 10, ({ src }) => src.endsWith('.mpd')));

    const adapter = registry.resolve({
      src: 'https://cdn.example.com/video.unknown',
      capabilities: baseCapabilities,
    });

    expect(adapter).toBeUndefined();
  });
});
