/**
 * Main Player Context
 * Manages core video player state and functionality
 */

'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import type { VideoEngine } from '@/core/engine';

// Player state interface
interface PlayerState {
  // Playback state
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  isBuffering: boolean;
  hasEnded: boolean;
  
  // Time and progress
  currentTime: number;
  duration: number;
  bufferedTime: number;
  seekingTime: number | null;
  
  // Audio
  volume: number;
  isMuted: boolean;
  
  // Quality and streaming
  currentQuality: string;
  availableQualities: string[];
  playbackRate: number;
  
  // Settings
  loop: boolean;
  autoHideControls: boolean;
  thumbnailPreview: boolean;
  
  // Display modes
  isFullscreen: boolean;
  isPictureInPicture: boolean;
  
  // Error handling
  error: Error | null;
  lastError: Error | null;
  
  // Media info
  videoElement: HTMLVideoElement | null;
  engine: VideoEngine | null;
  src: string | null;
  poster: string | null;
}

// Player actions
type PlayerAction = 
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_BUFFERING'; payload: boolean }
  | { type: 'SET_ENDED'; payload: boolean }
  | { type: 'SET_CURRENT_TIME'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'SET_BUFFERED_TIME'; payload: number }
  | { type: 'SET_SEEKING_TIME'; payload: number | null }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'SET_MUTED'; payload: boolean }
  | { type: 'SET_QUALITY'; payload: string }
  | { type: 'SET_AVAILABLE_QUALITIES'; payload: string[] }
  | { type: 'SET_PLAYBACK_RATE'; payload: number }
  | { type: 'SET_LOOP'; payload: boolean }
  | { type: 'SET_AUTO_HIDE_CONTROLS'; payload: boolean }
  | { type: 'SET_THUMBNAIL_PREVIEW'; payload: boolean }
  | { type: 'SET_FULLSCREEN'; payload: boolean }
  | { type: 'SET_PICTURE_IN_PICTURE'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error | null }
  | { type: 'SET_VIDEO_ELEMENT'; payload: HTMLVideoElement | null }
  | { type: 'SET_ENGINE'; payload: VideoEngine | null }
  | { type: 'SET_SRC'; payload: string | null }
  | { type: 'SET_POSTER'; payload: string | null }
  | { type: 'RESET_PLAYER' };

// Player controls interface
interface PlayerControls {
  // Playback controls
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  seekBy: (seconds: number) => void;
  
  // Audio controls
  setVolume: (volume: number) => void;
  mute: () => void;
  unmute: () => void;
  toggleMute: () => void;
  
  // Quality controls
  setQuality: (quality: string) => void;
  setPlaybackRate: (rate: number) => void;
  
  // Settings controls
  toggleLoop: () => void;
  toggleAutoHideControls: () => void;
  toggleThumbnailPreview: () => void;
  
  // Display controls
  enterFullscreen: () => Promise<void>;
  exitFullscreen: () => Promise<void>;
  toggleFullscreen: () => Promise<void>;
  enterPictureInPicture: () => Promise<void>;
  exitPictureInPicture: () => Promise<void>;
  togglePictureInPicture: () => Promise<void>;
  
  // Media loading
  load: (src: string, poster?: string) => Promise<void>;
  reload: () => Promise<void>;
  
  // Error handling
  clearError: () => void;
  
  // State management
  reset: () => void;
}

// Context interface
interface PlayerContextValue {
  state: PlayerState;
  controls: PlayerControls;
  dispatch: React.Dispatch<PlayerAction>;
}

// Default state
const defaultState: PlayerState = {
  isPlaying: false,
  isPaused: false,
  isLoading: false,
  isBuffering: false,
  hasEnded: false,
  currentTime: 0,
  duration: 0,
  bufferedTime: 0,
  seekingTime: null,
  volume: 1,
  isMuted: false,
  currentQuality: 'auto',
  availableQualities: [],
  playbackRate: 1,
  loop: false,
  autoHideControls: true,
  thumbnailPreview: true,
  isFullscreen: false,
  isPictureInPicture: false,
  error: null,
  lastError: null,
  videoElement: null,
  engine: null,
  src: null,
  poster: null
};

// Reducer function
function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload, isPaused: !action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_BUFFERING':
      return { ...state, isBuffering: action.payload };
    
    case 'SET_ENDED':
      return { ...state, hasEnded: action.payload, isPlaying: !action.payload };
    
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload };
    
    case 'SET_DURATION':
      return { ...state, duration: action.payload };
    
    case 'SET_BUFFERED_TIME':
      return { ...state, bufferedTime: action.payload };
    
    case 'SET_SEEKING_TIME':
      return { ...state, seekingTime: action.payload };
    
    case 'SET_VOLUME':
      return { ...state, volume: Math.max(0, Math.min(1, action.payload)) };
    
    case 'SET_MUTED':
      return { ...state, isMuted: action.payload };
    
    case 'SET_QUALITY':
      return { ...state, currentQuality: action.payload };
    
    case 'SET_AVAILABLE_QUALITIES':
      return { ...state, availableQualities: action.payload };
    
    case 'SET_PLAYBACK_RATE':
      return { ...state, playbackRate: action.payload };
    
    case 'SET_LOOP':
      return { ...state, loop: action.payload };
    
    case 'SET_AUTO_HIDE_CONTROLS':
      return { ...state, autoHideControls: action.payload };
    
    case 'SET_THUMBNAIL_PREVIEW':
      return { ...state, thumbnailPreview: action.payload };
    
    case 'SET_FULLSCREEN':
      return { ...state, isFullscreen: action.payload };
    
    case 'SET_PICTURE_IN_PICTURE':
      return { ...state, isPictureInPicture: action.payload };
    
    case 'SET_ERROR':
      return { 
        ...state, 
        error: action.payload,
        lastError: action.payload || state.lastError 
      };
    
    case 'SET_VIDEO_ELEMENT':
      return { ...state, videoElement: action.payload };
    
    case 'SET_ENGINE':
      return { ...state, engine: action.payload };
    
    case 'SET_SRC':
      return { ...state, src: action.payload };
    
    case 'SET_POSTER':
      return { ...state, poster: action.payload };
    
    case 'RESET_PLAYER':
      return { ...defaultState };
    
    default:
      return state;
  }
}

// Create context
const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);

// Provider props
interface PlayerProviderProps {
  children: React.ReactNode;
  onStateChange?: (state: PlayerState) => void;
  onError?: (error: Error) => void;
}

// Provider component
export function PlayerProvider({ children, onStateChange, onError }: PlayerProviderProps) {
  const [state, dispatch] = useReducer(playerReducer, defaultState);
  const stateRef = useRef(state);

  // Update state ref
  useEffect(() => {
    stateRef.current = state;
    onStateChange?.(state);
  }, [state, onStateChange]);

  // Error handling
  useEffect(() => {
    if (state.error && onError) {
      onError(state.error);
    }
  }, [state.error, onError]);

  // Player controls implementation
  const controls: PlayerControls = {
    // Playback controls
    play: useCallback(async () => {
      try {
        dispatch({ type: 'SET_ERROR', payload: null });
        
        if (state.videoElement) {
          await state.videoElement.play();
          dispatch({ type: 'SET_PLAYING', payload: true });
        } else if (state.engine) {
          await state.engine.play();
          dispatch({ type: 'SET_PLAYING', payload: true });
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Failed to play video');
        dispatch({ type: 'SET_ERROR', payload: err });
        throw err;
      }
    }, [state.videoElement, state.engine]),

    pause: useCallback(() => {
      try {
        if (state.videoElement) {
          state.videoElement.pause();
        } else if (state.engine) {
          state.engine.pause();
        }
        dispatch({ type: 'SET_PLAYING', payload: false });
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Failed to pause video');
        dispatch({ type: 'SET_ERROR', payload: err });
      }
    }, [state.videoElement, state.engine]),

    stop: useCallback(() => {
      try {
        if (state.videoElement) {
          state.videoElement.pause();
          state.videoElement.currentTime = 0;
        } else if (state.engine) {
          state.engine.stop();
        }
        dispatch({ type: 'SET_PLAYING', payload: false });
        dispatch({ type: 'SET_CURRENT_TIME', payload: 0 });
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Failed to stop video');
        dispatch({ type: 'SET_ERROR', payload: err });
      }
    }, [state.videoElement, state.engine]),

    seek: useCallback((time: number) => {
      try {
        const clampedTime = Math.max(0, Math.min(time, state.duration));
        
        if (state.videoElement) {
          state.videoElement.currentTime = clampedTime;
        } else if (state.engine) {
          state.engine.seek(clampedTime);
        }
        
        dispatch({ type: 'SET_CURRENT_TIME', payload: clampedTime });
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Failed to seek video');
        dispatch({ type: 'SET_ERROR', payload: err });
      }
    }, [state.videoElement, state.engine, state.duration]),

    seekBy: useCallback((seconds: number) => {
      const newTime = state.currentTime + seconds;
      controls.seek(newTime);
    }, [state.currentTime]),

    // Audio controls
    setVolume: useCallback((volume: number) => {
      try {
        const clampedVolume = Math.max(0, Math.min(1, volume));
        
        if (state.videoElement) {
          state.videoElement.volume = clampedVolume;
        } else if (state.engine) {
          state.engine.setVolume(clampedVolume);
        }
        
        dispatch({ type: 'SET_VOLUME', payload: clampedVolume });
        
        // Auto-unmute if volume is set above 0
        if (clampedVolume > 0 && state.isMuted) {
          dispatch({ type: 'SET_MUTED', payload: false });
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Failed to set volume');
        dispatch({ type: 'SET_ERROR', payload: err });
      }
    }, [state.videoElement, state.engine, state.isMuted]),

    mute: useCallback(() => {
      try {
        if (state.videoElement) {
          state.videoElement.muted = true;
        } else if (state.engine) {
          state.engine.mute();
        }
        dispatch({ type: 'SET_MUTED', payload: true });
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Failed to mute video');
        dispatch({ type: 'SET_ERROR', payload: err });
      }
    }, [state.videoElement, state.engine]),

    unmute: useCallback(() => {
      try {
        if (state.videoElement) {
          state.videoElement.muted = false;
        } else if (state.engine) {
          state.engine.unmute();
        }
        dispatch({ type: 'SET_MUTED', payload: false });
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Failed to unmute video');
        dispatch({ type: 'SET_ERROR', payload: err });
      }
    }, [state.videoElement, state.engine]),

    toggleMute: useCallback(() => {
      if (state.isMuted) {
        controls.unmute();
      } else {
        controls.mute();
      }
    }, [state.isMuted]),

    // Quality controls
    setQuality: useCallback((quality: string) => {
      try {
        if (state.engine && state.engine.setQuality) {
          state.engine.setQuality(quality);
        }
        dispatch({ type: 'SET_QUALITY', payload: quality });
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Failed to set quality');
        dispatch({ type: 'SET_ERROR', payload: err });
      }
    }, [state.engine]),

    setPlaybackRate: useCallback((rate: number) => {
      try {
        const clampedRate = Math.max(0.25, Math.min(4, rate));
        
        if (state.videoElement) {
          state.videoElement.playbackRate = clampedRate;
        } else if (state.engine) {
          state.engine.setPlaybackRate(clampedRate);
        }
        
        dispatch({ type: 'SET_PLAYBACK_RATE', payload: clampedRate });
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Failed to set playback rate');
        dispatch({ type: 'SET_ERROR', payload: err });
      }
    }, [state.videoElement, state.engine]),

    // Display controls (simplified implementations)
    enterFullscreen: useCallback(async () => {
      dispatch({ type: 'SET_FULLSCREEN', payload: true });
    }, []),

    exitFullscreen: useCallback(async () => {
      dispatch({ type: 'SET_FULLSCREEN', payload: false });
    }, []),

    toggleFullscreen: useCallback(async () => {
      if (state.isFullscreen) {
        await controls.exitFullscreen();
      } else {
        await controls.enterFullscreen();
      }
    }, [state.isFullscreen]),

    enterPictureInPicture: useCallback(async () => {
      dispatch({ type: 'SET_PICTURE_IN_PICTURE', payload: true });
    }, []),

    exitPictureInPicture: useCallback(async () => {
      dispatch({ type: 'SET_PICTURE_IN_PICTURE', payload: false });
    }, []),

    togglePictureInPicture: useCallback(async () => {
      if (state.isPictureInPicture) {
        await controls.exitPictureInPicture();
      } else {
        await controls.enterPictureInPicture();
      }
    }, [state.isPictureInPicture]),

    // Media loading
    load: useCallback(async (src: string, poster?: string) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });
        dispatch({ type: 'SET_SRC', payload: src });
        
        if (poster) {
          dispatch({ type: 'SET_POSTER', payload: poster });
        }
        
        // Engine loading would be implemented here
        // For now, just update the state
        dispatch({ type: 'SET_LOADING', payload: false });
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Failed to load video');
        dispatch({ type: 'SET_ERROR', payload: err });
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }, []),

    reload: useCallback(async () => {
      if (state.src) {
        await controls.load(state.src, state.poster || undefined);
      }
    }, [state.src, state.poster]),

    // Error handling
    clearError: useCallback(() => {
      dispatch({ type: 'SET_ERROR', payload: null });
    }, []),

    // Settings controls
    toggleLoop: useCallback(() => {
      dispatch({ type: 'SET_LOOP', payload: !state.loop });
    }, [state.loop]),

    toggleAutoHideControls: useCallback(() => {
      dispatch({ type: 'SET_AUTO_HIDE_CONTROLS', payload: !state.autoHideControls });
    }, [state.autoHideControls]),

    toggleThumbnailPreview: useCallback(() => {
      dispatch({ type: 'SET_THUMBNAIL_PREVIEW', payload: !state.thumbnailPreview });
    }, [state.thumbnailPreview]),

    // State management
    reset: useCallback(() => {
      dispatch({ type: 'RESET_PLAYER' });
    }, [])
  };

  const contextValue: PlayerContextValue = {
    state,
    controls,
    dispatch
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
}

// Hook to use player context
export function usePlayer(): PlayerContextValue {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}

// Convenience hooks for specific state slices
export function usePlayerState(): PlayerState {
  return usePlayer().state;
}

export function usePlayerControls(): PlayerControls {
  return usePlayer().controls;
}
