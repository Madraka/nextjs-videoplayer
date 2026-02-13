import { describe, expect, it } from 'vitest';
import { mergePlayerConfig, PlayerPresets } from './player-config';

describe('mergePlayerConfig', () => {
  it('merges nested controls visibility without dropping base values', () => {
    const base = PlayerPresets.youtube;
    const override = {
      controls: {
        visibility: {
          quality: false
        }
      }
    };

    const merged = mergePlayerConfig(base, override);

    expect(merged.controls?.visibility?.playPause).toBe(true);
    expect(merged.controls?.visibility?.quality).toBe(false);
    expect(merged.controls?.visibility?.fullscreen).toBe(true);
  });

  it('applies override values for theme while retaining existing fields', () => {
    const merged = mergePlayerConfig(
      { theme: { primary: '#111111', accent: '#aaaaaa' } },
      { theme: { primary: '#222222' } }
    );

    expect(merged.theme?.primary).toBe('#222222');
    expect(merged.theme?.accent).toBe('#aaaaaa');
  });
});
