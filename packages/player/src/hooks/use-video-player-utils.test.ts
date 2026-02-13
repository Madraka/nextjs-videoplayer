import { describe, expect, it } from 'vitest';

import { calculateElapsedSeconds, isExpectedLoadInterruption } from '@/hooks/use-video-player';

describe('calculateElapsedSeconds', () => {
  it('returns 0 when timestamp is not started', () => {
    expect(calculateElapsedSeconds(0, 5000)).toBe(0);
    expect(calculateElapsedSeconds(-10, 5000)).toBe(0);
  });

  it('returns elapsed seconds for positive timestamps', () => {
    expect(calculateElapsedSeconds(1000, 6000)).toBe(5);
    expect(calculateElapsedSeconds(2000, 2500)).toBe(0.5);
  });

  it('never returns negative values', () => {
    expect(calculateElapsedSeconds(7000, 6000)).toBe(0);
  });
});

describe('isExpectedLoadInterruption', () => {
  it('returns true for superseded load requests', () => {
    expect(
      isExpectedLoadInterruption(new Error('VideoEngine.loadSource() superseded by a newer load request'))
    ).toBe(true);
  });

  it('returns true for aborted load requests', () => {
    const error = new Error('VideoEngine.loadSource() aborted');
    error.name = 'AbortError';
    expect(isExpectedLoadInterruption(error)).toBe(true);
  });

  it('returns false for genuine playback failures', () => {
    expect(isExpectedLoadInterruption(new Error('All playback sources failed'))).toBe(false);
  });
});
