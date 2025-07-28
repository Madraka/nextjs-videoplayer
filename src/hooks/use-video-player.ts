/**
 * Modern Consolidated Video Player Hook
 * Integrates all video player functionality without code duplication
 */

"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { VideoEngine, type VideoEngineConfig, type VideoError } from '@/core/engine';
import { useFullscreen } from './use-fullscreen';
import { usePictureInPicture } from './use-picture-in-picture';
import { useKeyboardShortcuts } from './use-keyboard-shortcuts';
import { useVideoGestures } from './use-video-gestures';

export interface VideoPlayerState {
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  buffered: number;
  bufferedRanges: TimeRanges;
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
  src?: string;
}

export const useVideoPlayer = (
  videoRef: React.RefObject<HTMLVideoElement | null>,
  options: UseVideoPlayerOptions = {}
) => {
  const { autoPlay, muted, volume, src } = options;
  
  // Create empty buffered ranges for initial state
  const createEmptyTimeRanges = (): TimeRanges => ({
    length: 0,
    start: () => 0,
    end: () => 0
  });
  
  const [state, setState] = useState<VideoPlayerState>({
    isPlaying: false,
    isPaused: true,
    isLoading: false,
    isMuted: muted ?? false,
    currentTime: 0,
    duration: 0,
    volume: volume ?? 1,
    buffered: 0,
    bufferedRanges: createEmptyTimeRanges(),
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
  const videoEngineRef = useRef<VideoEngine | null>(null);
  const [qualityLevels, setQualityLevels] = useState<Array<{ id: string; label: string; height?: number }>>([
    { id: 'auto', label: 'Auto' },
    { id: '1080p', label: '1080p HD', height: 1080 },
    { id: '720p', label: '720p HD', height: 720 },
    { id: '480p', label: '480p', height: 480 },
    { id: '360p', label: '360p', height: 360 },
    { id: '240p', label: '240p', height: 240 }
  ]);
  
  // Analytics tracking
  const [lastPlayTime, setLastPlayTime] = useState<number>(0);
  const [bufferingStartTime, setBufferingStartTime] = useState<number>(0);

  // 🚀 Modern Specialized Hooks Integration
  const fullscreenHook = useFullscreen({
    element: videoRef.current,
    onEnter: () => setState(prev => ({ ...prev, isFullscreen: true })),
    onExit: () => setState(prev => ({ ...prev, isFullscreen: false })),
    onError: (error) => console.error('Fullscreen error:', error)
  });

  const pipHook = usePictureInPicture({
    videoElement: videoRef.current,
    onEnter: () => setState(prev => ({ ...prev, isPictureInPicture: true })),
    onExit: () => setState(prev => ({ ...prev, isPictureInPicture: false })),
    onError: (error) => console.error('PiP error:', error)
  });

  // Initialize VideoEngine with proper event handlers
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) {
      console.log('🔴 No video element');
      return;
    }

    if (!src) {
      console.log('🔴 No source provided');
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    console.log('📍 Source:', src);
    setState(prev => ({ ...prev, isLoading: true }));

    // Modern VideoEngine with event handlers
    const engineInstance = new VideoEngine(videoElement, {
      onReady: () => {
        console.log('✅ Engine ready');
        setState(prev => ({ ...prev, isLoading: false }));
        setIsEngineReady(true);
      },
      onPlay: () => {
        console.log('▶️ Video playing');
        setState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
      },
      onPause: () => {
        console.log('⏸️ Video paused');
        setState(prev => ({ ...prev, isPlaying: false, isPaused: true }));
      },
      onTimeUpdate: (currentTime: number, duration: number) => {
        setState(prev => ({ ...prev, currentTime, duration }));
      },
      onProgress: (buffered: number) => {
        setState(prev => ({ ...prev, buffered }));
      },
      onVolumeChange: (volume: number, muted: boolean) => {
        setState(prev => ({ ...prev, volume, isMuted: muted }));
      },
      onError: (error: VideoError) => {
        console.error('❌ Video engine error:', error);
        setState(prev => ({ ...prev, error: error.message || 'Unknown error', isLoading: false }));
      },
      onBuffering: (isBuffering: boolean) => {
        console.log('🔄 Buffering:', isBuffering);
        setState(prev => ({ ...prev, isLoading: isBuffering }));
      }
    });

    videoEngineRef.current = engineInstance;
    setEngine(engineInstance);

    // Initialize and load source
    engineInstance.initialize().then(() => {
      return engineInstance.loadSource({ 
        src, 
        autoplay: autoPlay || false, 
        muted: muted || false 
      });
    }).catch((error) => {
      console.error('Failed to initialize engine:', error);
      setState(prev => ({ ...prev, error: error.message || 'Initialization failed', isLoading: false }));
    });

    return () => {
      engineInstance.destroy?.();
      videoEngineRef.current = null;
    };
  }, [src, autoPlay, muted]);

  // 🎮 Modern Controls using specialized hooks
  const controls: VideoPlayerControls = {
    play: useCallback(async () => {
      console.log('🎮 Play button clicked');
      const currentEngine = videoEngineRef.current;
      if (!currentEngine) {
        console.log('🔴 No engine available for play');
        return;
      }
      
      try {
        await currentEngine.play();
        console.log('✅ Play command executed');
      } catch (error) {
        console.error('❌ Play failed:', error);
      }
    }, []),

    pause: useCallback(() => {
      console.log('🎮 Pause button clicked');
      const currentEngine = videoEngineRef.current;
      if (!currentEngine) {
        console.log('🔴 No engine available for pause');
        return;
      }
      
      currentEngine.pause();
      console.log('✅ Pause command executed');
    }, []),

    seek: useCallback((time: number) => {
      console.log('🎮 Seek to:', time);
      const currentEngine = videoEngineRef.current;
      if (!currentEngine) {
        console.log('🔴 No engine available for seek');
        return;
      }
      
      currentEngine.seek?.(time);
      console.log('✅ Seek command executed');
    }, []),

    setVolume: useCallback((volume: number) => {
      console.log('🎮 Set volume to:', volume);
      const currentEngine = videoEngineRef.current;
      if (!currentEngine) {
        console.log('🔴 No engine available for volume');
        return;
      }
      
      currentEngine.setVolume?.(volume);
      setState(prev => ({ ...prev, volume }));
      console.log('✅ Volume command executed');
    }, []),

    toggleMute: useCallback(() => {
      console.log('🎮 Toggle mute');
      const currentEngine = videoEngineRef.current;
      if (!currentEngine) {
        console.log('🔴 No engine available for mute');
        return;
      }
      
      const newMuted = !state.isMuted;
      currentEngine.setMuted?.(newMuted);
      setState(prev => ({ ...prev, isMuted: newMuted }));
      console.log('✅ Mute toggle executed:', newMuted);
    }, [state.isMuted]),

    // Use specialized hooks for advanced features
    toggleFullscreen: useCallback(() => {
      console.log('🎮 Toggle fullscreen');
      fullscreenHook.toggle();
    }, [fullscreenHook]),

    togglePictureInPicture: useCallback(async () => {
      console.log('🎮 Toggle Picture-in-Picture');
      await pipHook.toggle();
    }, [pipHook]),

    toggleTheaterMode: useCallback(() => {
      console.log('🎮 Toggle theater mode');
      setState(prev => ({ ...prev, isTheaterMode: !prev.isTheaterMode }));
    }, []),

    setPlaybackRate: useCallback((rate: number) => {
      console.log('🎮 Set playback rate to:', rate);
      const currentEngine = videoEngineRef.current;
      if (!currentEngine) {
        console.log('🔴 No engine available for playback rate');
        return;
      }
      
      currentEngine.setPlaybackRate?.(rate);
      setState(prev => ({ ...prev, playbackRate: rate }));
      console.log('✅ Playback rate command executed');
    }, []),

    setQuality: useCallback((qualityId: string) => {
      console.log('🎮 Set quality to:', qualityId);
      const currentEngine = videoEngineRef.current;
      if (!currentEngine) {
        console.log('🔴 No engine available for quality');
        return;
      }
      
      currentEngine.setQuality?.(qualityId);
      setState(prev => ({ ...prev, quality: qualityId, qualityChanges: prev.qualityChanges + 1 }));
      console.log('✅ Quality command executed');
    }, []),

    load: useCallback(async (config: VideoEngineConfig) => {
      console.log('🎮 Load new source:', config);
      const currentEngine = videoEngineRef.current;
      if (!currentEngine) {
        console.log('🔴 No engine available for load');
        return;
      }
      
      try {
        setState(prev => ({ ...prev, isLoading: true }));
        await currentEngine.loadSource(config);
        console.log('✅ Load command executed');
      } catch (error) {
        console.error('❌ Load failed:', error);
        setState(prev => ({ ...prev, error: 'Load failed', isLoading: false }));
      }
    }, [])
  };

  return {
    state,
    controls,
    engine,
    isEngineReady,
    qualityLevels,
    // Additional specialized hook features
    fullscreen: fullscreenHook,
    pictureInPicture: pipHook
  };
};
