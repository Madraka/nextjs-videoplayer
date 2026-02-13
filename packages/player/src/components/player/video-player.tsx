/**
 * Main video player component
 * Combines video engine, controls, and gesture handling
 */

'use client';

import React, { useRef, useEffect, forwardRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useVideoPlayer } from '@/hooks/use-video-player';
import { useVideoGestures } from '@/hooks/use-video-gestures';
import { VideoControls } from '@/components/controls/video-controls';
import { LoadingSpinner } from '@/components/player/loading-spinner';
import { ErrorDisplay } from '@/components/player/error-display';
import type { VideoEngineConfig } from '@/core/video-engine';
import type { VideoEnginePlugin } from '@/core/plugins/types';

type LegacyPluginContext = {
  engine: unknown;
  state: unknown;
  controls: unknown;
};

type LegacyPlayerPlugin = (player: LegacyPluginContext) => void;

export interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  className?: string;
  controls?: {
    show?: boolean;
    fullscreen?: boolean;
    quality?: boolean;
    volume?: boolean;
    progress?: boolean;
    playPause?: boolean;
    playbackRate?: boolean;
    pictureInPicture?: boolean;
    theaterMode?: boolean;
  };
  gestures?: {
    enabled?: boolean;
    tapToPlay?: boolean;
    doubleTapSeek?: boolean;
    swipeVolume?: boolean;
  };
  plugins?: LegacyPlayerPlugin[];
  enginePlugins?: VideoEnginePlugin[];
  onReady?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onError?: (error: string) => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onStateChange?: (state: any) => void;
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(({
  src,
  poster,
  autoPlay = false,
  muted = false,
  loop = false,
  playsInline = true,
  className,
  controls = {
    show: true,
    fullscreen: true,
    quality: true,
    volume: true,
    progress: true,
    playPause: true,
    playbackRate: true,
    pictureInPicture: true,
    theaterMode: true,
  },
  gestures = {
    enabled: true,
    tapToPlay: true,
    doubleTapSeek: true,
    swipeVolume: true,
  },
  plugins = [],
  enginePlugins = [],
  onReady,
  onPlay,
  onPause,
  onError,
  onTimeUpdate,
  onStateChange,
}, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = React.useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const legacyPluginsInitializedRef = useRef(false);

  // Video player hook
  const { state, controls: playerControls, qualityLevels, engine } = useVideoPlayer(videoRef, {
    autoPlay,
    muted,
    volume: 1,
    enginePlugins,
  });

  // Memoized callbacks to prevent infinite re-renders
  const handlePlay = useCallback(() => {
    onPlay?.();
  }, [onPlay]);

  const handlePause = useCallback(() => {
    onPause?.();
  }, [onPause]);

  const handleError = useCallback((error: string) => {
    onError?.(error);
  }, [onError]);

  const handleTimeUpdate = useCallback((currentTime: number, duration: number) => {
    onTimeUpdate?.(currentTime, duration);
  }, [onTimeUpdate]);

  const handleStateChange = useCallback((newState: any) => {
    onStateChange?.(newState);
  }, [onStateChange]);

  const handleReady = useCallback(() => {
    onReady?.();
  }, [onReady]);

  // Gesture handling
  const { isGestureActive } = useVideoGestures(
    containerRef,
    {
      onTap: () => {
        if (gestures.tapToPlay && controls.playPause && !state.isLoading) {
          // Prevent rapid tap/pause cycles
          if (state.isPlaying && !state.isPaused) {
            playerControls.pause();
          } else if (state.isPaused && !state.isPlaying) {
            playerControls.play();
          }
        }
        showControlsTemporarily();
      },
      onDoubleTap: (direction) => {
        if (gestures.doubleTapSeek) {
          const seekAmount = direction === 'left' ? -10 : 10;
          const newTime = Math.max(0, Math.min(state.duration, state.currentTime + seekAmount));
          playerControls.seek(newTime);
        }
      },
      onSwipeVolume: (delta) => {
        if (gestures.swipeVolume && controls.volume) {
          const newVolume = Math.max(0, Math.min(1, state.volume + delta));
          playerControls.setVolume(newVolume);
        }
      },
    },
    {
      enableTapToPlay: gestures.tapToPlay,
      enableDoubleTapSeek: gestures.doubleTapSeek,
      enableSwipeVolume: gestures.swipeVolume,
    }
  );

  // Load video source when engine is ready
  useEffect(() => {
    if (!src || !engine) return;

    const config: VideoEngineConfig = {
      src,
      poster,
      autoplay: autoPlay,
      muted,
      loop,
      playsInline,
    };

    // Add a small delay to ensure engine is fully initialized
    const timer = setTimeout(() => {
      playerControls.load(config);
    }, 50);

    return () => clearTimeout(timer);
  }, [src, poster, autoPlay, muted, loop, playsInline, engine]);

  // Event callbacks
  useEffect(() => {
    if (state.isPlaying) {
      handlePlay();
    } else if (state.isPaused) {
      handlePause();
    }
  }, [state.isPlaying, state.isPaused, handlePlay, handlePause]);

  useEffect(() => {
    if (state.error) {
      handleError(state.error);
    }
  }, [state.error, handleError]);

  useEffect(() => {
    handleTimeUpdate(state.currentTime, state.duration);
  }, [state.currentTime, state.duration, handleTimeUpdate]);

  useEffect(() => {
    handleStateChange(state);
  }, [state, handleStateChange]);

  useEffect(() => {
    if (!state.isLoading && state.duration > 0) {
      handleReady();
    }
  }, [state.isLoading, state.duration, handleReady]);

  // Initialize plugins
  useEffect(() => {
    legacyPluginsInitializedRef.current = false;
  }, [engine]);

  useEffect(() => {
    if (!engine || plugins.length === 0 || legacyPluginsInitializedRef.current) {
      return;
    }

    plugins.forEach((plugin) => {
      try {
        plugin({ engine, state, controls: playerControls });
      } catch (error) {
        console.warn('Plugin initialization failed:', error);
      }
    });

    legacyPluginsInitializedRef.current = true;
  }, [engine, plugins, playerControls, state]);

  // Auto-hide controls
  const showControlsTemporarily = React.useCallback(() => {
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    if (state.isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [state.isPlaying]);

  // Mouse movement detection
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = () => {
      showControlsTemporarily();
    };

    const handleMouseLeave = () => {
      if (state.isPlaying) {
        setShowControls(false);
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [showControlsTemporarily, state.isPlaying]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // Forward ref
  React.useImperativeHandle(ref, () => videoRef.current!);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full bg-black overflow-hidden group transition-all duration-300',
        'focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500',
        state.isFullscreen && 'fixed inset-0 z-50',
        state.isTheaterMode && 'mx-auto max-w-none',
        className
      )}
      style={{
        aspectRatio: state.isFullscreen || state.isTheaterMode ? 'auto' : '16/9',
        height: state.isTheaterMode ? '70vh' : 'auto',
      }}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        playsInline={playsInline}
        {...(playsInline && { 'webkit-playsinline': '' })}
        poster={poster}
        preload="metadata"
      />

      {/* Loading Spinner */}
      {state.isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <LoadingSpinner />
        </div>
      )}

      {/* Error Display */}
      {state.error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <ErrorDisplay error={state.error} onRetry={() => playerControls.load({ src })} />
        </div>
      )}

      {/* Gesture Feedback */}
      {isGestureActive && gestures.enabled && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-white/10 animate-pulse" />
        </div>
      )}

      {/* Video Controls */}
      {controls.show && (showControls || state.isPaused || !state.duration) && (
        <VideoControls
          state={state}
          controls={playerControls}
          qualityLevels={qualityLevels}
          controlsConfig={controls}
          onShow={() => setShowControls(true)}
          onHide={() => setShowControls(false)}
        />
      )}
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';
