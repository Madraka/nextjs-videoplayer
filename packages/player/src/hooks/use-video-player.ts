/**
 * Video player state management hook
 * Handles playback state, progress, volume, and player controls
 */

import { useState, useEffect, useCallback } from 'react';
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

export const useVideoPlayer = (
  videoRef: React.RefObject<HTMLVideoElement | null>,
  options: UseVideoPlayerOptions = {}
) => {
  const [state, setState] = useState<VideoPlayerState>({
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
    // Analytics data
    playCount: 0,
    totalWatchTime: 0,
    bufferingTime: 0,
    averageBitrate: 0,
    qualityChanges: 0,
  });

  const [engine, setEngine] = useState<VideoEngine | null>(null);
  const [isEngineReady, setIsEngineReady] = useState(false);
  const [pendingConfig, setPendingConfig] = useState<VideoEngineConfig | null>(null);
  const [isPlayPending, setIsPlayPending] = useState(false);
  const [qualityLevels, setQualityLevels] = useState<Array<{ id: string; label: string; height?: number }>>([]);
  const [initialEnginePlugins] = useState<VideoEnginePlugin[] | undefined>(() => options.enginePlugins);
  
  // Analytics tracking
  const [lastPlayTime, setLastPlayTime] = useState<number>(0);
  const [bufferingStartTime, setBufferingStartTime] = useState<number>(0);

  // Initialize video engine
  useEffect(() => {
    if (!videoRef.current) return;

    const videoElement = videoRef.current;
    
    const events: VideoEngineEvents = {
      onReady: () => {
        console.log('VideoEngine: onReady event fired');
        setState(prev => ({ ...prev, isLoading: false }));
        setIsEngineReady(true);
      },
      onPlay: () => {
        setState(prev => ({ 
          ...prev, 
          isPlaying: true, 
          isPaused: false,
          playCount: prev.playCount + 1
        }));
        setLastPlayTime(Date.now());
      },
      onPause: () => {
        setState(prev => {
          const watchTime = lastPlayTime > 0 ? (Date.now() - lastPlayTime) / 1000 : 0;
          return {
            ...prev, 
            isPlaying: false, 
            isPaused: true,
            totalWatchTime: prev.totalWatchTime + watchTime
          };
        });
      },
      onTimeUpdate: (currentTime, duration) => {
        setState(prev => ({ ...prev, currentTime, duration }));
      },
      onProgress: (buffered) => {
        setState(prev => ({ ...prev, buffered }));
      },
      onVolumeChange: (volume, muted) => {
        setState(prev => ({ ...prev, volume, isMuted: muted }));
      },
      onQualityChange: (quality) => {
        setState(prev => ({ 
          ...prev, 
          quality,
          qualityChanges: prev.qualityChanges + 1
        }));
      },
      onError: (error) => {
        setState(prev => ({ ...prev, error: error.message, isLoading: false }));
      },
      onLoadStart: () => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        setBufferingStartTime(Date.now());
      },
      onLoadEnd: () => {
        setState(prev => {
          const bufferingTime = bufferingStartTime > 0 ? (Date.now() - bufferingStartTime) / 1000 : 0;
          return {
            ...prev, 
            isLoading: false,
            bufferingTime: prev.bufferingTime + bufferingTime
          };
        });
      },
    };

    const videoEngine = new VideoEngine(videoElement, events, {
      plugins: initialEnginePlugins,
    });
    setEngine(videoEngine);

    // Initialize engine
    console.log('Initializing video engine...');
    videoEngine.initialize()
      .then(() => {
        console.log('Video engine initialized successfully');
      })
      .catch(error => {
        console.error('Video engine initialization failed:', error);
        setState(prev => ({ ...prev, error: error.message }));
      });

    return () => {
      videoEngine.dispose();
    };
  }, [videoRef, initialEnginePlugins]);

  // Load pending config when engine becomes ready
  useEffect(() => {
    if (isEngineReady && engine && pendingConfig) {
      console.log('Engine is ready, loading pending config:', pendingConfig.src);
      engine.loadSource(pendingConfig)
        .then(() => {
          console.log('Pending video loaded successfully');
          const levels = engine.getQualityLevels();
          setQualityLevels(levels);
          setPendingConfig(null);
        })
        .catch(error => {
          console.error('Pending video load error:', error);
          setState(prev => ({ 
            ...prev, 
            error: `Failed to load video: ${error.message}` 
          }));
          setPendingConfig(null);
        });
    }
  }, [isEngineReady, engine, pendingConfig]);

  // Event listeners for fullscreen and PiP changes
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleFullscreenChange = () => {
      setState(prev => ({ 
        ...prev, 
        isFullscreen: Boolean(document.fullscreenElement) 
      }));
    };

    const handleEnterPiP = () => {
      setState(prev => ({ ...prev, isPictureInPicture: true }));
    };

    const handleLeavePiP = () => {
      setState(prev => ({ ...prev, isPictureInPicture: false }));
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

  // Controls
  const controls: VideoPlayerControls = {
    play: useCallback(async () => {
      if (!videoRef.current || isPlayPending) return;
      
      try {
        setIsPlayPending(true);
        
        // Check if video is already playing
        if (!videoRef.current.paused) {
          setIsPlayPending(false);
          return;
        }
        
        await videoRef.current.play();
        setIsPlayPending(false);
      } catch (error) {
        setIsPlayPending(false);
        console.error('Play failed:', error);
        
        // Don't show error for common autoplay restrictions
        const errorMessage = (error as Error).message;
        if (!errorMessage.includes('user didn\'t interact') && 
            !errorMessage.includes('autoplay') &&
            !errorMessage.includes('gesture')) {
          setState(prev => ({ 
            ...prev, 
            error: `Playback failed: ${errorMessage}` 
          }));
        }
      }
    }, [videoRef, isPlayPending]),

    pause: useCallback(() => {
      if (!videoRef.current || isPlayPending) return;
      
      // Only pause if video is actually playing
      if (!videoRef.current.paused) {
        videoRef.current.pause();
      }
    }, [videoRef, isPlayPending]),

    seek: useCallback((time: number) => {
      if (!videoRef.current) return;
      videoRef.current.currentTime = time;
    }, [videoRef]),

    setVolume: useCallback((volume: number) => {
      if (!videoRef.current) return;
      videoRef.current.volume = Math.max(0, Math.min(1, volume));
    }, [videoRef]),

    toggleMute: useCallback(() => {
      if (!videoRef.current) return;
      videoRef.current.muted = !videoRef.current.muted;
    }, [videoRef]),

    toggleFullscreen: useCallback(async () => {
      if (!videoRef.current) return;
      
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        } else {
          await videoRef.current.requestFullscreen();
        }
      } catch (error) {
        setState(prev => ({ 
          ...prev, 
          error: `Fullscreen failed: ${(error as Error).message}` 
        }));
      }
    }, [videoRef]),

    setQuality: useCallback((qualityId: string) => {
      if (!engine) return;
      engine.setQuality(qualityId);
    }, [engine]),

    setPlaybackRate: useCallback((rate: number) => {
      if (!videoRef.current) return;
      videoRef.current.playbackRate = rate;
      setState(prev => ({ ...prev, playbackRate: rate }));
    }, [videoRef]),

    togglePictureInPicture: useCallback(async () => {
      if (!videoRef.current) return;
      
      try {
        if (state.isPictureInPicture) {
          await document.exitPictureInPicture();
        } else {
          await videoRef.current.requestPictureInPicture();
        }
      } catch (error) {
        console.error('Picture-in-Picture error:', error);
      }
    }, [videoRef, state.isPictureInPicture]),

    toggleTheaterMode: useCallback(() => {
      setState(prev => ({ 
        ...prev, 
        isTheaterMode: !prev.isTheaterMode 
      }));
    }, []),

    load: useCallback(async (config: VideoEngineConfig) => {
      if (!engine) {
        console.log('Engine not available yet, storing config as pending');
        setPendingConfig(config);
        return;
      }
      
      if (!isEngineReady) {
        console.log('Engine not ready yet, storing config as pending');
        setPendingConfig(config);
        return;
      }
      
      try {
        console.log('Loading video source:', config.src);
        await engine.loadSource(config);
        // Update quality levels after loading
        const levels = engine.getQualityLevels();
        setQualityLevels(levels);
        console.log('Video loaded successfully');
      } catch (error) {
        console.error('Video load error:', error);
        setState(prev => ({ 
          ...prev, 
          error: `Failed to load video: ${(error as Error).message}` 
        }));
      }
    }, [engine, isEngineReady])
  };

  // Keyboard controls - must be after controls definition
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleKeyPress = (e: KeyboardEvent) => {
      // Only handle keys when video is in focus or no input is focused
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
            controls.play();
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
          controls.toggleFullscreen();
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
        case '9':
          e.preventDefault();
          const percentage = parseInt(e.key) / 10;
          controls.seek(state.duration * percentage);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [state.isPlaying, state.currentTime, state.duration, state.volume, controls]);

  return {
    state,
    controls,
    qualityLevels,
    engine,
  };
};
