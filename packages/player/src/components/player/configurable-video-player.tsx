'use client';

import React, { forwardRef, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { VideoControls } from '@/components/controls/video-controls';
import { MobileVideoControls } from '@/components/controls/mobile-video-controls';
import { LoadingSpinner } from '@/components/player/loading-spinner';
import { ErrorDisplay } from '@/components/player/error-display';
import { useVideoPlayer } from '@/hooks/use-video-player';
import { useVideoGestures } from '@/hooks/use-video-gestures';
import { usePlayerConfig } from '@/contexts/player-config-context';
import type { VideoEngineConfig } from '@/core/video-engine';
import type { VideoEnginePlugin } from '@/core/plugins/types';
import type { PlayerConfiguration } from '@/types/player-config';

interface ConfigurableVideoPlayerProps {
  src?: string;
  fallbackSources?: string[];
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
  onStateChange?: (state: any) => void;
}

export const ConfigurableVideoPlayer = forwardRef<HTMLVideoElement, ConfigurableVideoPlayerProps>(({
  src,
  fallbackSources,
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
  const [showControls, setShowControls] = React.useState(true);
  const [isMobile, setIsMobile] = React.useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isSmallScreen = window.innerWidth < 768;
      const isTouchDevice = 'ontouchstart' in window;
      
      setIsMobile(isMobileDevice || (isSmallScreen && isTouchDevice));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
  const gesturesConfig = config.gestures || {};
  
  // Enhanced gesture callbacks for mobile
  const gestureCallbacks = {
    onTap: () => {
      if (isMobile) {
        // On mobile, tap toggles controls visibility
        setShowControls(!showControls);
      } else {
        // On desktop, tap toggles play/pause
        state.isPlaying ? playerControls.pause() : playerControls.play();
      }
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
    enableTapToPlay: isMobile ? false : true, // On mobile, tap shows controls
    enableDoubleTapSeek: true,
    enableSwipeVolume: isMobile,
    seekAmount: 10,
    volumeSensitivity: 0.02,
  });

  // Auto behaviors from config
  const autoHideControls = config.auto?.autoHideControls ?? true;
  const autoHideDelay = config.auto?.autoHideDelay ?? 3000;

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
    if (!src || !engine) return;

    const videoConfig: VideoEngineConfig = {
      src,
      fallbackSources,
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
  }, [src, fallbackSources, poster, autoPlay, muted, loop, playsInline, engine, config.auto?.autoPlay]);

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
    onStateChange?.(state);
  }, [state, onStateChange]);

  useEffect(() => {
    if (!state.isLoading && state.duration > 0) {
      onReady?.();
    }
  }, [state.isLoading, state.duration, onReady]);

  // Auto-hide controls based on config
  const showControlsTemporarily = useCallback(() => {
    if (!autoHideControls) return;
    
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    if (state.isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, autoHideDelay);
    }
  }, [state.isPlaying, autoHideControls, autoHideDelay]);

  // Mouse movement detection
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !autoHideControls) return;

    const handleMouseMove = () => {
      showControlsTemporarily();
    };

    const handleMouseLeave = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
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
  }, [showControlsTemporarily, state.isPlaying, autoHideControls]);

  // Show controls when paused or not auto-hiding
  useEffect(() => {
    if (!autoHideControls || !state.isPlaying) {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    }
  }, [state.isPlaying, autoHideControls]);

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

  // Apply theme styles
  const themeStyles = config.theme ? {
    '--player-primary': config.theme.primary || '#3b82f6',
    '--player-secondary': config.theme.secondary || '#64748b',
    '--player-accent': config.theme.accent || '#ef4444',
    '--player-progress': config.theme.progressColor || '#3b82f6',
    '--player-buffer': config.theme.bufferColor || '#64748b',
  } as React.CSSProperties : {};

  // Control visibility from config
  const controlsVisibility = config.controls?.visibility || {};
  const shouldShowControls = config.controls?.show !== false;

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative bg-black overflow-hidden group transition-all duration-300',
        'focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500',
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
        <ErrorDisplay 
          error={state.error} 
          onRetry={() => {
            if (src) {
              playerControls.load({
                src,
                fallbackSources,
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

      {/* Video Controls - Adaptive based on device */}
      {shouldShowControls && (
        <>
          {isMobile ? (
            <MobileVideoControls
              state={state}
              controls={playerControls}
              qualityLevels={qualityLevels}
              thumbnailPreview={config.features?.thumbnailPreview}
              thumbnailUrl={thumbnailUrl}
              className={cn(
                'transition-opacity duration-300',
                showControls ? 'opacity-100' : 'opacity-0',
                'hover:opacity-100'
              )}
              onShow={() => setShowControls(true)}
              onHide={() => setShowControls(false)}
            />
          ) : (
            <VideoControls
              state={state}
              controls={playerControls}
              qualityLevels={qualityLevels}
              controlsConfig={{
                fullscreen: controlsVisibility.fullscreen !== false,
                volume: controlsVisibility.volume !== false,
                quality: controlsVisibility.quality !== false,
                progress: controlsVisibility.progress !== false,
                playPause: controlsVisibility.playPause !== false,
                playbackRate: controlsVisibility.playbackRate !== false,
                pictureInPicture: controlsVisibility.pictureInPicture !== false,
                theaterMode: controlsVisibility.theaterMode !== false,
                settings: controlsVisibility.settings !== false,
                time: controlsVisibility.time !== false,
              }}
              className={cn(
                'transition-opacity duration-300',
                showControls ? 'opacity-100' : 'opacity-0',
                'hover:opacity-100'
              )}
              onShow={() => setShowControls(true)}
              onHide={() => setShowControls(false)}
            />
          )}
        </>
      )}

      {/* Analytics tracking */}
      {config.analytics?.enabled && (
        <div className="hidden" data-analytics="true" />
      )}
    </div>
  );
});

ConfigurableVideoPlayer.displayName = 'ConfigurableVideoPlayer';
