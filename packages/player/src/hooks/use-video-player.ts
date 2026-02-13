/**
 * Video player state management hook
 * Handles playback state, progress, volume, and player controls
 */

import { useState, useEffect, useCallback, useMemo, useReducer, useRef } from 'react';
import { VideoEngine, type VideoEngineConfig, type VideoEngineEvents } from '@/core/video-engine';
import type { VideoEnginePlugin } from '@/core/plugins/types';

export interface VideoPlayerState {
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  buffered: number;
  quality: string;
  playbackRate: number;
  isFullscreen: boolean;
  isPictureInPicture: boolean;
  isTheaterMode: boolean;
  error: string | null;
  // Analytics data
  playCount: number;
  totalWatchTime: number;
  bufferingTime: number;
  averageBitrate: number;
  qualityChanges: number;
}

export interface VideoPlayerControls {
  play: () => Promise<void>;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleFullscreen: () => void;
  togglePictureInPicture: () => Promise<void>;
  toggleTheaterMode: () => void;
  setPlaybackRate: (rate: number) => void;
  setQuality: (qualityId: string) => void;
  load: (config: VideoEngineConfig) => Promise<void>;
}

interface UseVideoPlayerOptions {
  autoPlay?: boolean;
  muted?: boolean;
  volume?: number;
  enginePlugins?: VideoEnginePlugin[];
}

export type VideoPlayerAction =
  | { type: 'ready' }
  | { type: 'play' }
  | { type: 'pause'; watchTime: number }
  | { type: 'time_update'; currentTime: number; duration: number }
  | { type: 'progress'; buffered: number }
  | { type: 'volume_change'; volume: number; isMuted: boolean }
  | { type: 'quality_change'; quality: string }
  | { type: 'error'; message: string }
  | { type: 'load_start' }
  | { type: 'load_end'; bufferingTime: number }
  | { type: 'fullscreen_change'; isFullscreen: boolean }
  | { type: 'pip_change'; isPictureInPicture: boolean }
  | { type: 'playback_rate_change'; playbackRate: number }
  | { type: 'toggle_theater_mode' };

const TIME_EPSILON = 0.05;
const DURATION_EPSILON = 0.01;
const BUFFER_EPSILON = 0.25;
const VOLUME_EPSILON = 0.01;

export const createInitialState = (options: UseVideoPlayerOptions): VideoPlayerState => ({
  isPlaying: false,
  isPaused: true,
  isLoading: false,
  isMuted: options.muted ?? false,
  currentTime: 0,
  duration: 0,
  volume: options.volume ?? 1,
  buffered: 0,
  quality: 'auto',
  playbackRate: 1,
  isFullscreen: false,
  isPictureInPicture: false,
  isTheaterMode: false,
  error: null,
  playCount: 0,
  totalWatchTime: 0,
  bufferingTime: 0,
  averageBitrate: 0,
  qualityChanges: 0,
});

export const videoPlayerReducer = (state: VideoPlayerState, action: VideoPlayerAction): VideoPlayerState => {
  switch (action.type) {
    case 'ready': {
      return state.isLoading ? { ...state, isLoading: false } : state;
    }
    case 'play': {
      if (state.isPlaying && !state.isPaused) {
        return state;
      }
      return {
        ...state,
        isPlaying: true,
        isPaused: false,
        error: null,
        playCount: state.playCount + 1,
      };
    }
    case 'pause': {
      if (!state.isPlaying && state.isPaused) {
        return state;
      }
      return {
        ...state,
        isPlaying: false,
        isPaused: true,
        totalWatchTime: state.totalWatchTime + action.watchTime,
      };
    }
    case 'time_update': {
      const currentTimeDelta = Math.abs(state.currentTime - action.currentTime);
      const durationDelta = Math.abs(state.duration - action.duration);
      if (currentTimeDelta < TIME_EPSILON && durationDelta < DURATION_EPSILON) {
        return state;
      }
      return {
        ...state,
        currentTime: action.currentTime,
        duration: action.duration,
        error: action.currentTime > 0 ? null : state.error,
      };
    }
    case 'progress': {
      if (Math.abs(state.buffered - action.buffered) < BUFFER_EPSILON) {
        return state;
      }
      return { ...state, buffered: action.buffered };
    }
    case 'volume_change': {
      if (Math.abs(state.volume - action.volume) < VOLUME_EPSILON && state.isMuted === action.isMuted) {
        return state;
      }
      return { ...state, volume: action.volume, isMuted: action.isMuted };
    }
    case 'quality_change': {
      if (state.quality === action.quality) {
        return state;
      }
      return {
        ...state,
        quality: action.quality,
        qualityChanges: state.qualityChanges + 1,
      };
    }
    case 'error': {
      if (state.error === action.message && !state.isLoading) {
        return state;
      }
      return { ...state, error: action.message, isLoading: false };
    }
    case 'load_start': {
      if (state.isLoading && state.error === null) {
        return state;
      }
      return { ...state, isLoading: true, error: null };
    }
    case 'load_end': {
      if (!state.isLoading && action.bufferingTime <= 0) {
        return state;
      }
      return {
        ...state,
        isLoading: false,
        bufferingTime: state.bufferingTime + action.bufferingTime,
      };
    }
    case 'fullscreen_change': {
      return state.isFullscreen === action.isFullscreen
        ? state
        : { ...state, isFullscreen: action.isFullscreen };
    }
    case 'pip_change': {
      return state.isPictureInPicture === action.isPictureInPicture
        ? state
        : { ...state, isPictureInPicture: action.isPictureInPicture };
    }
    case 'playback_rate_change': {
      return state.playbackRate === action.playbackRate
        ? state
        : { ...state, playbackRate: action.playbackRate };
    }
    case 'toggle_theater_mode': {
      return { ...state, isTheaterMode: !state.isTheaterMode };
    }
    default: {
      return state;
    }
  }
};

export const calculateElapsedSeconds = (startedAt: number, now: number): number => {
  if (startedAt <= 0) {
    return 0;
  }

  return Math.max(0, (now - startedAt) / 1000);
};

export const isExpectedLoadInterruption = (error: Error): boolean => {
  const message = error.message.toLowerCase();
  return (
    error.name === 'AbortError' ||
    message.includes('loadsource() aborted') ||
    message.includes('superseded by a newer load request')
  );
};

export const useVideoPlayer = (
  videoRef: React.RefObject<HTMLVideoElement | null>,
  options: UseVideoPlayerOptions = {}
) => {
  const [state, dispatch] = useReducer(videoPlayerReducer, options, createInitialState);
  const [engine, setEngine] = useState<VideoEngine | null>(null);
  const [isEngineReady, setIsEngineReady] = useState(false);
  const [pendingConfig, setPendingConfig] = useState<VideoEngineConfig | null>(null);
  const [isPlayPending, setIsPlayPending] = useState(false);
  const [qualityLevels, setQualityLevels] = useState<Array<{ id: string; label: string; height?: number }>>([]);
  const [initialEnginePlugins] = useState<VideoEnginePlugin[] | undefined>(() => options.enginePlugins);

  const lastPlayTimeRef = useRef<number>(0);
  const bufferingStartTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!videoRef.current) return;

    const videoElement = videoRef.current;

    const events: VideoEngineEvents = {
      onReady: () => {
        dispatch({ type: 'ready' });
        setIsEngineReady(true);
      },
      onPlay: () => {
        dispatch({ type: 'play' });
        lastPlayTimeRef.current = Date.now();
      },
      onPause: () => {
        const watchTime = calculateElapsedSeconds(lastPlayTimeRef.current, Date.now());
        dispatch({ type: 'pause', watchTime });
        lastPlayTimeRef.current = 0;
      },
      onTimeUpdate: (currentTime, duration) => {
        const safeCurrentTime = Number.isFinite(currentTime) ? currentTime : 0;
        const safeDuration = Number.isFinite(duration) ? duration : 0;
        dispatch({ type: 'time_update', currentTime: safeCurrentTime, duration: safeDuration });
      },
      onProgress: (buffered) => {
        const safeBuffered = Number.isFinite(buffered) ? buffered : 0;
        dispatch({ type: 'progress', buffered: safeBuffered });
      },
      onVolumeChange: (volume, muted) => {
        const safeVolume = Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : 1;
        dispatch({ type: 'volume_change', volume: safeVolume, isMuted: muted });
      },
      onQualityChange: (quality) => {
        dispatch({ type: 'quality_change', quality });
      },
      onError: (error) => {
        dispatch({ type: 'error', message: error.message });
      },
      onLoadStart: () => {
        dispatch({ type: 'load_start' });
        bufferingStartTimeRef.current = Date.now();
      },
      onLoadEnd: () => {
        const bufferingTime = calculateElapsedSeconds(bufferingStartTimeRef.current, Date.now());
        dispatch({ type: 'load_end', bufferingTime });
        bufferingStartTimeRef.current = 0;
      },
    };

    const videoEngine = new VideoEngine(videoElement, events, {
      plugins: initialEnginePlugins,
    });

    setEngine(videoEngine);

    videoEngine.initialize().catch((error) => {
      dispatch({ type: 'error', message: error.message });
    });

    return () => {
      videoEngine.dispose();
    };
  }, [videoRef, initialEnginePlugins]);

  useEffect(() => {
    if (isEngineReady && engine && pendingConfig) {
      engine.loadSource(pendingConfig)
        .then(() => {
          setQualityLevels(engine.getQualityLevels());
          setPendingConfig(null);
        })
        .catch((error) => {
          if (isExpectedLoadInterruption(error as Error)) {
            setPendingConfig(null);
            return;
          }

          dispatch({ type: 'error', message: `Failed to load video: ${error.message}` });
          setPendingConfig(null);
        });
    }
  }, [isEngineReady, engine, pendingConfig]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleFullscreenChange = () => {
      dispatch({ type: 'fullscreen_change', isFullscreen: Boolean(document.fullscreenElement) });
    };

    const handleEnterPiP = () => {
      dispatch({ type: 'pip_change', isPictureInPicture: true });
    };

    const handleLeavePiP = () => {
      dispatch({ type: 'pip_change', isPictureInPicture: false });
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    if (videoRef.current) {
      videoRef.current.addEventListener('enterpictureinpicture', handleEnterPiP);
      videoRef.current.addEventListener('leavepictureinpicture', handleLeavePiP);
    }

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (videoRef.current) {
        videoRef.current.removeEventListener('enterpictureinpicture', handleEnterPiP);
        videoRef.current.removeEventListener('leavepictureinpicture', handleLeavePiP);
      }
    };
  }, [videoRef]);

  const play = useCallback(async () => {
    if (!videoRef.current || isPlayPending) return;

    try {
      setIsPlayPending(true);

      if (!videoRef.current.paused) {
        return;
      }

      await videoRef.current.play();
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (
        !errorMessage.includes('user didn\'t interact') &&
        !errorMessage.includes('autoplay') &&
        !errorMessage.includes('gesture')
      ) {
        dispatch({ type: 'error', message: `Playback failed: ${errorMessage}` });
      }
    } finally {
      setIsPlayPending(false);
    }
  }, [videoRef, isPlayPending]);

  const pause = useCallback(() => {
    if (!videoRef.current || isPlayPending) return;
    if (!videoRef.current.paused) {
      videoRef.current.pause();
    }
  }, [videoRef, isPlayPending]);

  const seek = useCallback((time: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = time;
  }, [videoRef]);

  const setVolume = useCallback((volume: number) => {
    if (!videoRef.current || !Number.isFinite(volume)) return;
    videoRef.current.volume = Math.max(0, Math.min(1, volume));
  }, [videoRef]);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
  }, [videoRef]);

  const toggleFullscreen = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await videoRef.current.requestFullscreen();
      }
    } catch (error) {
      dispatch({ type: 'error', message: `Fullscreen failed: ${(error as Error).message}` });
    }
  }, [videoRef]);

  const setQuality = useCallback((qualityId: string) => {
    if (!engine) return;
    engine.setQuality(qualityId);
  }, [engine]);

  const setPlaybackRate = useCallback((rate: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = rate;
    dispatch({ type: 'playback_rate_change', playbackRate: rate });
  }, [videoRef]);

  const togglePictureInPicture = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch {
      // no-op
    }
  }, [videoRef]);

  const toggleTheaterMode = useCallback(() => {
    dispatch({ type: 'toggle_theater_mode' });
  }, []);

  const load = useCallback(async (config: VideoEngineConfig) => {
    if (!engine || !isEngineReady) {
      setPendingConfig(config);
      return;
    }

    try {
      await engine.loadSource(config);
      setQualityLevels(engine.getQualityLevels());
    } catch (error) {
      if (isExpectedLoadInterruption(error as Error)) {
        return;
      }
      dispatch({ type: 'error', message: `Failed to load video: ${(error as Error).message}` });
    }
  }, [engine, isEngineReady]);

  const controls: VideoPlayerControls = useMemo(() => ({
    play,
    pause,
    seek,
    setVolume,
    toggleMute,
    toggleFullscreen,
    togglePictureInPicture,
    toggleTheaterMode,
    setPlaybackRate,
    setQuality,
    load,
  }), [
    play,
    pause,
    seek,
    setVolume,
    toggleMute,
    toggleFullscreen,
    togglePictureInPicture,
    toggleTheaterMode,
    setPlaybackRate,
    setQuality,
    load,
  ]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          if (state.isPlaying && !state.isPaused) {
            controls.pause();
          } else {
            void controls.play();
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          controls.seek(Math.max(0, state.currentTime - 10));
          break;
        case 'ArrowRight':
          e.preventDefault();
          controls.seek(Math.min(state.duration, state.currentTime + 10));
          break;
        case 'ArrowUp':
          e.preventDefault();
          controls.setVolume(Math.min(1, state.volume + 0.1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          controls.setVolume(Math.max(0, state.volume - 0.1));
          break;
        case 'm':
          e.preventDefault();
          controls.toggleMute();
          break;
        case 'f':
          e.preventDefault();
          void controls.toggleFullscreen();
          break;
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9': {
          e.preventDefault();
          const percentage = Number.parseInt(e.key, 10) / 10;
          controls.seek(state.duration * percentage);
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [state.isPlaying, state.isPaused, state.currentTime, state.duration, state.volume, controls]);

  return {
    state,
    controls,
    qualityLevels,
    engine,
  };
};
