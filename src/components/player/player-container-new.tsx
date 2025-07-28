/**
 * Player Container Component
 * Complete video player with built-in controls - ready to use with a single import
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { VideoElement } from './video-element';
import { ErrorBoundary } from './error-boundary';
import { FullscreenContainer } from './fullscreen-container';
import { PosterImage } from './poster-image';
import { LoadingSpinner } from './loading-spinner';

// Import built-in controls
import { ControlBar } from '@/components/controls/control-bar';
import { PlayButton } from '@/components/controls/play-button';
import { ProgressBar } from '@/components/controls/progress-bar';
import { VolumeControl } from '@/components/controls/volume-control';
import { TimeDisplay } from '@/components/controls/time-display';
import { FullscreenButton } from '@/components/controls/fullscreen-button';
import { PictureInPicture } from '@/components/controls/picture-in-picture';
import { PlaybackRate } from '@/components/controls/playback-rate';
import { QualitySelector } from '@/components/controls/quality-selector';
import { MobileControls } from '@/components/controls/mobile-controls';
import { KeyboardHandler } from '@/components/controls/keyboard-handler';

// Video player hook for state management
import { useVideoPlayer } from '@/hooks/use-video-player';

interface PlayerContainerProps {
  src: string;
  poster?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  aspectRatio?: '16:9' | '4:3' | '1:1' | 'auto';
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  playsInline?: boolean;
  crossOrigin?: 'anonymous' | 'use-credentials';
  
  // Control configuration
  showControls?: boolean;
  controlsConfig?: {
    play?: boolean;
    progress?: boolean;
    volume?: boolean;
    time?: boolean;
    quality?: boolean;
    playbackRate?: boolean;
    fullscreen?: boolean;
    pictureInPicture?: boolean;
  };
  
  // Mobile optimization
  autoDetectMobile?: boolean;
  
  // Event callbacks
  onReady?: () => void;
  onError?: (error: Error) => void;
  onStateChange?: (state: PlayerState) => void;
}

interface PlayerState {
  isLoading: boolean;
  hasError: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  isBuffering: boolean;
  isFullscreen: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  quality: string;
  buffered: number;
  isPictureInPicture: boolean;
}

export const PlayerContainer: React.FC<PlayerContainerProps> = ({
  src,
  poster,
  className,
  width,
  height,
  aspectRatio = 'auto',
  autoPlay = false,
  muted = false,
  loop = false,
  preload = 'metadata',
  playsInline = true,
  crossOrigin,
  showControls = true,
  controlsConfig = {
    play: true,
    progress: true,
    volume: true,
    time: true,
    quality: true,
    playbackRate: true,
    fullscreen: true,
    pictureInPicture: true,
  },
  autoDetectMobile = true,
  onReady,
  onError,
  onStateChange,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Use video player hook for complete state management
  const { state: videoState, controls, qualityLevels } = useVideoPlayer(videoRef, {
    autoPlay,
    muted,
    volume: 1,
    src,
  });
  
  // Local state for UI
  const [showPoster, setShowPoster] = useState(Boolean(poster && !autoPlay));
  const [isReady, setIsReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  
  // Auto-hide controls timeout
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mobile detection
  useEffect(() => {
    if (!autoDetectMobile) return;
    
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
  }, [autoDetectMobile]);

  // Map video state to player state
  const playerState: PlayerState = {
    isLoading: videoState.isLoading,
    hasError: Boolean(videoState.error),
    isPlaying: videoState.isPlaying,
    isPaused: videoState.isPaused,
    isBuffering: videoState.isLoading,
    isFullscreen: videoState.isFullscreen,
    currentTime: videoState.currentTime,
    duration: videoState.duration,
    volume: videoState.volume,
    playbackRate: videoState.playbackRate,
    quality: videoState.quality,
    buffered: videoState.buffered,
    isPictureInPicture: videoState.isPictureInPicture,
  };

  // Event handlers
  const handleVideoReady = useCallback(() => {
    setIsReady(true);
    setShowPoster(false);
    onReady?.();
  }, [onReady]);

  const handleVideoError = useCallback((error: Error) => {
    onError?.(error);
  }, [onError]);

  // State change callback
  useEffect(() => {
    onStateChange?.(playerState);
  }, [playerState, onStateChange]);

  // Auto-hide controls
  const showControlsTemporarily = useCallback(() => {
    if (!showControls) return;
    
    setControlsVisible(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    if (videoState.isPlaying && !isHovering) {
      controlsTimeoutRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, 3000);
    }
  }, [showControls, videoState.isPlaying, isHovering]);

  // Mouse events for controls
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
    setControlsVisible(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    if (videoState.isPlaying) {
      showControlsTemporarily();
    }
  }, [videoState.isPlaying, showControlsTemporarily]);

  const handleMouseMove = useCallback(() => {
    showControlsTemporarily();
  }, [showControlsTemporarily]);

  // Show controls when paused
  useEffect(() => {
    if (!videoState.isPlaying) {
      setControlsVisible(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    }
  }, [videoState.isPlaying]);

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // Get aspect ratio CSS
  const getAspectRatio = () => {
    switch (aspectRatio) {
      case '16:9': return '16/9';
      case '4:3': return '4/3';
      case '1:1': return '1/1';
      default: return 'auto';
    }
  };

  return (
    <ErrorBoundary onError={handleVideoError}>
      <FullscreenContainer>
        <div
          ref={containerRef}
          className={cn(
            "relative w-full bg-black overflow-hidden group transition-all duration-300",
            "focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500",
            videoState.isFullscreen && "fixed inset-0 z-50",
            className
          )}
          style={{
            aspectRatio: getAspectRatio(),
            width,
            height: videoState.isFullscreen ? '100vh' : height,
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        >
          {/* Poster Image */}
          {showPoster && poster && (
            <PosterImage
              src={poster}
              alt="Video thumbnail"
              onPlay={() => {
                setShowPoster(false);
                controls.play();
              }}
              className="absolute inset-0 z-10"
            />
          )}

          {/* Video Element */}
          {src && (
            <VideoElement
              ref={videoRef}
              src={src}
              autoPlay={autoPlay && !showPoster}
              muted={muted}
              loop={loop}
              preload={preload}
              playsInline={playsInline}
              crossOrigin={crossOrigin}
              className="absolute inset-0 w-full h-full object-contain"
              onReady={handleVideoReady}
              onError={handleVideoError}
            />
          )}

          {/* Loading Spinner */}
          {videoState.isLoading && !playerState.hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
              <LoadingSpinner size="large" />
            </div>
          )}

          {/* Error Message */}
          {playerState.hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
              <div className="text-white text-center">
                <div className="text-xl mb-2">⚠️ Video Error</div>
                <div className="text-sm opacity-80">Failed to load video</div>
              </div>
            </div>
          )}

          {/* Built-in Controls */}
          {showControls && isReady && !playerState.hasError && (
            <>
              {/* Desktop Controls */}
              <div className={cn(
                "absolute bottom-0 left-0 right-0 z-30",
                "bg-gradient-to-t from-black/80 via-black/40 to-transparent",
                "transition-opacity duration-300",
                controlsVisible ? "opacity-100" : "opacity-0"
              )}>
                <div className="p-4 space-y-4">
                  {/* Progress Bar */}
                  {controlsConfig.progress && (
                    <div className="w-full">
                      <ProgressBar
                        currentTime={videoState.currentTime}
                        duration={videoState.duration}
                        bufferedRanges={[{ start: 0, end: videoState.buffered }]}
                        onSeek={(time) => controls.seek(time)}
                        className="h-1 bg-white/20 hover:h-2 transition-all duration-200"
                      />
                    </div>
                  )}

                  {/* Control Row */}
                  <div className="flex items-center justify-between">
                    
                    {/* Left Controls */}
                    <div className="flex items-center gap-3">
                      {controlsConfig.play && (
                        <PlayButton
                          isPlaying={videoState.isPlaying}
                          onClick={() => {
                            if (videoState.isPlaying) {
                              controls.pause();
                            } else {
                              controls.play();
                            }
                          }}
                          size="md"
                          className="text-white hover:text-blue-400"
                        />
                      )}
                      
                      {controlsConfig.volume && (
                        <VolumeControl
                          volume={videoState.volume}
                          isMuted={videoState.isMuted}
                          onVolumeChange={(volume) => controls.setVolume(volume)}
                          onMuteToggle={() => controls.toggleMute()}
                          orientation="horizontal"
                          className="text-white"
                        />
                      )}
                      
                      {controlsConfig.time && (
                        <TimeDisplay
                          currentTime={videoState.currentTime}
                          duration={videoState.duration}
                          compact={false}
                          className="text-white text-sm"
                        />
                      )}
                    </div>

                    {/* Right Controls */}
                    <div className="flex items-center gap-2">
                      {controlsConfig.playbackRate && (
                        <PlaybackRate
                          rate={videoState.playbackRate}
                          onRateChange={(rate) => controls.setPlaybackRate(rate)}
                          showLabel={false}
                          className="text-white"
                        />
                      )}
                      
                      {controlsConfig.quality && qualityLevels.length > 0 && (
                        <QualitySelector
                          qualities={qualityLevels}
                          currentQuality={videoState.quality}
                          onQualityChange={(quality) => controls.setQuality(quality)}
                          className="text-white"
                        />
                      )}
                      
                      {controlsConfig.pictureInPicture && (
                        <PictureInPicture
                          isActive={videoState.isPictureInPicture}
                          onClick={() => controls.togglePictureInPicture()}
                          className="text-white hover:text-blue-400"
                        />
                      )}
                      
                      {controlsConfig.fullscreen && (
                        <FullscreenButton
                          isFullscreen={videoState.isFullscreen}
                          onClick={() => controls.toggleFullscreen()}
                          className="text-white hover:text-blue-400"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Keyboard Handler */}
              <KeyboardHandler
                playerState={videoState}
                playerControls={controls}
                enabled={true}
              />
            </>
          )}

          {/* Debug info (development only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="absolute top-2 left-2 bg-black/80 text-white text-xs p-2 rounded z-50">
              <div>State: {videoState.isPlaying ? 'Playing' : 'Paused'}</div>
              <div>Time: {Math.floor(videoState.currentTime)}s / {Math.floor(videoState.duration)}s</div>
              <div>Volume: {Math.round(videoState.volume * 100)}%</div>
              <div>Rate: {videoState.playbackRate}x</div>
              {videoState.isLoading && <div>Buffering...</div>}
              {videoState.isFullscreen && <div>Fullscreen</div>}
            </div>
          )}
        </div>
      </FullscreenContainer>
    </ErrorBoundary>
  );
};

export type { PlayerContainerProps, PlayerState };
