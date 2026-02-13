import { describe, expect, it } from 'vitest';
import type { BrowserCapabilities } from './compatibility';
import { getStreamingStrategy } from './compatibility';

const baseCapabilities: BrowserCapabilities = {
  hasNativeHls: false,
  hasHlsJs: true,
  hasDashJs: true,
  isMobile: false,
  isIOS: false,
  isAndroid: false,
  supportsInlinePlayback: true,
  supportsAutoplay: true,
  supportsPictureInPicture: true
};

describe('getStreamingStrategy', () => {
  it('selects hlsjs for m3u8 streams when hls.js is available', () => {
    const strategy = getStreamingStrategy(baseCapabilities, 'https://cdn.example.com/video.m3u8');
    expect(strategy).toBe('hlsjs');
  });

  it('selects native for iOS HLS when native support exists', () => {
    const strategy = getStreamingStrategy(
      { ...baseCapabilities, hasNativeHls: true, isIOS: true },
      'https://cdn.example.com/video.m3u8'
    );
    expect(strategy).toBe('native');
  });

  it('selects dashjs for mpd streams', () => {
    const strategy = getStreamingStrategy(baseCapabilities, 'https://cdn.example.com/video.mpd');
    expect(strategy).toBe('dashjs');
  });

  it('supports uppercase extensions and querystrings', () => {
    const strategy = getStreamingStrategy(baseCapabilities, 'https://cdn.example.com/VIDEO.M3U8?token=1');
    expect(strategy).toBe('hlsjs');
  });
});
