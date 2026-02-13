import { describe, expect, it } from 'vitest';

import {
  createInitialState,
  videoPlayerReducer,
  type VideoPlayerAction,
} from '@/hooks/use-video-player';

const reduce = (action: VideoPlayerAction, baseState = createInitialState({})) =>
  videoPlayerReducer(baseState, action);

describe('videoPlayerReducer', () => {
  it('creates deterministic initial state defaults', () => {
    const state = createInitialState({});
    expect(state.isPaused).toBe(true);
    expect(state.isMuted).toBe(false);
    expect(state.volume).toBe(1);
    expect(state.quality).toBe('auto');
  });

  it('handles play/pause transitions and analytics counters', () => {
    const started = reduce({ type: 'play' });
    expect(started.isPlaying).toBe(true);
    expect(started.isPaused).toBe(false);
    expect(started.playCount).toBe(1);

    const paused = reduce({ type: 'pause', watchTime: 4.5 }, started);
    expect(paused.isPlaying).toBe(false);
    expect(paused.isPaused).toBe(true);
    expect(paused.totalWatchTime).toBe(4.5);
  });

  it('skips time updates under epsilon thresholds', () => {
    const base = createInitialState({});
    const updated = reduce({ type: 'time_update', currentTime: 10, duration: 120 }, base);
    expect(updated.currentTime).toBe(10);
    expect(updated.duration).toBe(120);

    const unchanged = reduce({ type: 'time_update', currentTime: 10.02, duration: 120.005 }, updated);
    expect(unchanged).toBe(updated);
  });

  it('updates quality once per effective quality change', () => {
    const first = reduce({ type: 'quality_change', quality: '720p' });
    expect(first.quality).toBe('720p');
    expect(first.qualityChanges).toBe(1);

    const duplicate = reduce({ type: 'quality_change', quality: '720p' }, first);
    expect(duplicate).toBe(first);

    const second = reduce({ type: 'quality_change', quality: '1080p' }, duplicate);
    expect(second.quality).toBe('1080p');
    expect(second.qualityChanges).toBe(2);
  });

  it('handles loading lifecycle with buffering accumulation', () => {
    const loading = reduce({ type: 'load_start' });
    expect(loading.isLoading).toBe(true);
    expect(loading.error).toBe(null);

    const completed = reduce({ type: 'load_end', bufferingTime: 1.2 }, loading);
    expect(completed.isLoading).toBe(false);
    expect(completed.bufferingTime).toBe(1.2);

    const noop = reduce({ type: 'load_end', bufferingTime: 0 }, completed);
    expect(noop).toBe(completed);
  });

  it('updates muted and volume with epsilon guard', () => {
    const start = createInitialState({});
    const changed = reduce({ type: 'volume_change', volume: 0.5, isMuted: false }, start);
    expect(changed.volume).toBe(0.5);

    const noop = reduce({ type: 'volume_change', volume: 0.505, isMuted: false }, changed);
    expect(noop).toBe(changed);

    const muted = reduce({ type: 'volume_change', volume: 0.5, isMuted: true }, changed);
    expect(muted.isMuted).toBe(true);
  });
});
