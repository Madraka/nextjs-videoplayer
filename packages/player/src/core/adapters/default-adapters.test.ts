import { describe, expect, it } from 'vitest';

import { defaultStreamingAdapters } from '@/core/adapters/default-adapters';
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

describe('defaultStreamingAdapters', () => {
  it('handles uppercase extensions with querystrings for HLS, DASH and direct sources', () => {
    const native = defaultStreamingAdapters.find((adapter) => adapter.id === 'native');
    const hlsjs = defaultStreamingAdapters.find((adapter) => adapter.id === 'hlsjs');
    const dashjs = defaultStreamingAdapters.find((adapter) => adapter.id === 'dashjs');
    const direct = defaultStreamingAdapters.find((adapter) => adapter.id === 'direct');

    expect(native).toBeDefined();
    expect(hlsjs).toBeDefined();
    expect(dashjs).toBeDefined();
    expect(direct).toBeDefined();

    expect(
      native?.canHandle({
        src: 'https://cdn.example.com/VIDEO.M3U8?token=123',
        capabilities: { ...baseCapabilities, hasNativeHls: true, isIOS: true },
      })
    ).toBe(true);

    expect(
      hlsjs?.canHandle({
        src: 'https://cdn.example.com/VIDEO.M3U8?token=123',
        capabilities: baseCapabilities,
      })
    ).toBe(true);

    expect(
      dashjs?.canHandle({
        src: 'https://cdn.example.com/STREAM.MPD?session=abc',
        capabilities: baseCapabilities,
      })
    ).toBe(true);

    expect(
      direct?.canHandle({
        src: 'https://cdn.example.com/MOVIE.MP4?signature=xyz',
        capabilities: baseCapabilities,
      })
    ).toBe(true);
  });
});
