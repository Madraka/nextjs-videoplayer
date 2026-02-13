'use client';

import React, { forwardRef, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { VideoControls } from '@/components/controls/video-controls';
import { LoadingSpinner } from '@/components/player/loading-spinner';
import { ErrorDisplay } from '@/components/player/error-display';
import { useVideoPlayer } from '@/hooks/use-video-player';
import { useVideoGestures } from '@/hooks/use-video-gestures';
import { usePlayerConfig } from '@/contexts/player-config-context';
import type { VideoEngineConfig } from '@/core/video-engine';
import type { DrmConfiguration } from '@/core/drm/types';
import type { VideoEnginePlugin } from '@/core/plugins/types';
import type { PlayerConfiguration } from '@/types/player-config';
import type { VideoPlayerState } from '@/hooks/use-video-player';

interface ConfigurableVideoPlayerProps {
  src?: string;
  fallbackSources?: string[];
  drmConfig?: DrmConfiguration;
  poster?: string;
  thumbnailUrl?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  className?: string;
  configOverride?: Partial<PlayerConfiguration>;
  enginePlugins?: VideoEnginePlugin[];
  aspectRatio?: 'auto' | '16/9' | '4/3' | '1/1' | '9/16' | '3/4' | 'custom';
  customAspectRatio?: string;
  onReady?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onError?: (error: string) => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onStateChange?: (state: VideoPlayerState) => void;
}

export const ConfigurableVideoPlayer = forwardRef<HTMLVideoElement, ConfigurableVideoPlayerProps>(({
  src,
  fallbackSources,
  drmConfig,
  poster,
  thumbnailUrl,
  autoPlay,
  muted = false,
  loop = false,
  playsInline = true,
  className,
  configOverride,
  enginePlugins,
  aspectRatio = 'auto',
  customAspectRatio,
  onReady,
  onPlay,
  onPause,
  onError,
  onTimeUpdate,
  onStateChange,
}, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastStateSignatureRef = useRef<string | null>(null);
  const onReadyRef = useRef<typeof onReady>(onReady);
  const readySignalRef = useRef<string | null>(null);

  // Get configuration from context and merge with override
  const { config: contextConfig } = usePlayerConfig();
  const config = configOverride 
    ? { ...contextConfig, ...configOverride } 
    : contextConfig;

  // Video player hook
  const { state, controls: playerControls, qualityLevels, engine } = useVideoPlayer(videoRef, {
    autoPlay: autoPlay ?? config.auto?.autoPlay ?? false,
    muted,
    volume: 1,
    enginePlugins,
  });

  // Apply gesture configuration - Mobile optimized
  const gestureCallbacks = {
    onTap: () => {
      state.isPlaying ? playerControls.pause() : playerControls.play();
    },
    onDoubleTap: (direction: 'left' | 'right') => {
      const seekAmount = 10;
      if (direction === 'left') {
        playerControls.seek(Math.max(0, state.currentTime - seekAmount));
      } else {
        playerControls.seek(Math.min(state.duration, state.currentTime + seekAmount));
      }
    },
    onSwipeVolume: (delta: number) => {
      const newVolume = Math.max(0, Math.min(1, state.volume + delta));
      playerControls.setVolume(newVolume);
    }
  };
  
  // Use gesture hook with enhanced mobile support
  useVideoGestures(videoRef, gestureCallbacks, {
    enableTapToPlay: true,
    enableDoubleTapSeek: true,
    enableSwipeVolume: false,
    seekAmount: 10,
    volumeSensitivity: 0.02,
  });

  // Calculate aspect ratio
  const getAspectRatio = () => {
    if (aspectRatio === 'custom' && customAspectRatio) {
      return customAspectRatio;
    }
    if (aspectRatio === 'auto' || state.isFullscreen || state.isTheaterMode) {
      return 'auto';
    }
    return aspectRatio;
  };

  // Determine if this is a vertical video format
  const isVerticalFormat = aspectRatio === '9/16' || aspectRatio === '3/4';
  const isSquareFormat = aspectRatio === '1/1';

  // Load video source when engine is ready
  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    if (!src || !engine) return;

    const videoConfig: VideoEngineConfig = {
      src,
      fallbackSources,
      drm: drmConfig,
      poster,
      autoplay: autoPlay ?? config.auto?.autoPlay ?? false,
      muted,
      loop,
      playsInline,
    };

    const timer = setTimeout(() => {
      playerControls.load(videoConfig);
    }, 50);

    return () => clearTimeout(timer);
  }, [src, fallbackSources, drmConfig, poster, autoPlay, muted, loop, playsInline, engine, config.auto?.autoPlay]);

  // Event callbacks
  useEffect(() => {
    if (state.isPlaying) {
      onPlay?.();
    } else if (state.isPaused) {
      onPause?.();
    }
  }, [state.isPlaying, state.isPaused, onPlay, onPause]);

  useEffect(() => {
    if (state.error) {
      onError?.(state.error);
    }
  }, [state.error, onError]);

  useEffect(() => {
    onTimeUpdate?.(state.currentTime, state.duration);
  }, [state.currentTime, state.duration, onTimeUpdate]);

  useEffect(() => {
    if (!onStateChange) {
      return;
    }

    const signature = JSON.stringify({
      isPlaying: state.isPlaying,
      isPaused: state.isPaused,
      isLoading: state.isLoading,
      isMuted: state.isMuted,
      currentTime: Number(state.currentTime.toFixed(2)),
      duration: Number(state.duration.toFixed(2)),
      volume: Number(state.volume.toFixed(2)),
      buffered: Number(state.buffered.toFixed(2)),
      quality: state.quality,
      playbackRate: state.playbackRate,
      isFullscreen: state.isFullscreen,
      isPictureInPicture: state.isPictureInPicture,
      isTheaterMode: state.isTheaterMode,
      error: state.error,
      playCount: state.playCount,
      totalWatchTime: Number(state.totalWatchTime.toFixed(2)),
      bufferingTime: Number(state.bufferingTime.toFixed(2)),
      qualityChanges: state.qualityChanges,
    });

    if (lastStateSignatureRef.current === signature) {
      return;
    }

    lastStateSignatureRef.current = signature;
    onStateChange(state);
  }, [state, onStateChange]);

  useEffect(() => {
    if (state.isLoading || state.duration <= 0) {
      return;
    }

    // Fire onReady once per loaded source/duration pair to avoid render loops
    // when parent provides a new callback identity on each render.
    const readySignal = `${src ?? 'no-src'}|${state.duration}`;
    if (readySignalRef.current === readySignal) {
      return;
    }

    readySignalRef.current = readySignal;
    onReadyRef.current?.();
  }, [state.isLoading, state.duration, src]);

  // Forward ref
  React.useImperativeHandle(ref, () => videoRef.current!);

  // Apply theme styles
  const themeStyles = config.theme ? {
    '--player-primary': config.theme.primary || '#dc2626',
    '--player-secondary': config.theme.secondary || '#64748b',
    '--player-accent': config.theme.accent || '#dc2626',
    '--player-progress': config.theme.progressColor || '#dc2626',
    '--player-buffer': config.theme.bufferColor || 'rgba(255,255,255,0.4)',
  } as React.CSSProperties : {};

  // Single official UI: keep the full control set visible.
  const shouldShowControls = true;

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative bg-black overflow-hidden group transition-all duration-300',
        'focus-within:outline-none focus-within:ring-2 focus-within:ring-white/30',
        state.isFullscreen && 'fixed inset-0 z-50',
        state.isTheaterMode && 'mx-auto max-w-none',
        // Format specific styles
        isVerticalFormat ? 'max-w-sm mx-auto w-full' : 
        isSquareFormat ? 'max-w-lg mx-auto w-full' : 'w-full',
        className
      )}
      style={{
        aspectRatio: getAspectRatio(),
        height: state.isTheaterMode ? '70vh' : 
                (isVerticalFormat ? 'min(70vh, 80vw * 16/9)' : 
                 isSquareFormat ? 'min(60vh, 90vw)' : 'auto'),
        maxHeight: isVerticalFormat ? '70vh' : isSquareFormat ? '60vh' : undefined,
        width: isVerticalFormat ? 'min(400px, 90vw)' : 
               isSquareFormat ? 'min(500px, 90vw)' : '100%',
        ...themeStyles,
      }}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        controls={false}
        playsInline={playsInline}
        {...(playsInline && { 'webkit-playsinline': '' })}
        poster={poster}
        preload="metadata"
      />

      {/* Loading Spinner */}
      {state.isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
          <LoadingSpinner />
        </div>
      )}

      {/* Error Display */}
      {state.error && (
        <ErrorDisplay 
          error={state.error} 
          onRetry={() => {
            if (src) {
              playerControls.load({
                src,
                fallbackSources,
                drm: drmConfig,
                poster,
                autoplay: autoPlay ?? config.auto?.autoPlay ?? false,
                muted,
                loop,
                playsInline,
              });
            }
          }}
        />
      )}

      {/* Video Controls */}
      {shouldShowControls && (
        <VideoControls
          state={state}
          controls={playerControls}
          qualityLevels={qualityLevels}
          controlsConfig={{
            fullscreen: true,
            volume: true,
            quality: true,
            progress: true,
            playPause: true,
            playbackRate: true,
            pictureInPicture: true,
            theaterMode: true,
            settings: true,
            time: true,
          }}
          className={cn(
            'transition-opacity duration-300',
            'opacity-100 z-30 pointer-events-auto'
          )}
        />
      )}

      {/* Analytics tracking */}
      {config.analytics?.enabled && (
        <div className="hidden" data-analytics="true" />
      )}
    </div>
  );
});

ConfigurableVideoPlayer.displayName = 'ConfigurableVideoPlayer';
