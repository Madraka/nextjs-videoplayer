/**
 * Player Container Component
 * Simple video player with built-in controls - ready to use with a single import
 */

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { VideoElement } from './video-element';
import { LoadingSpinner } from './loading-spinner';

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
  children?: React.ReactNode;
}

interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isReady: boolean;
  hasError: boolean;
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
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    isReady: false,
    hasError: false,
  });

  // Wait for video element to be ready
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
      setPlayerState(prev => ({ ...prev, isReady: true }));
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Video event listeners
  useEffect(() => {
    if (!containerRef.current || !isReady) return;

    const container = containerRef.current;
    const video = container.querySelector('video');
    
    if (!video) return;

    const handlePlay = () => setPlayerState(prev => ({ ...prev, isPlaying: true }));
    const handlePause = () => setPlayerState(prev => ({ ...prev, isPlaying: false }));
    const handleTimeUpdate = () => {
      setPlayerState(prev => ({ 
        ...prev, 
        currentTime: video.currentTime,
        duration: video.duration || 0
      }));
    };
    const handleLoadedMetadata = () => {
      setPlayerState(prev => ({ 
        ...prev, 
        duration: video.duration || 0
      }));
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [isReady]);

  // Container styles
  const containerStyle = {
    width: width || '100%',
    height: height || (aspectRatio !== 'auto' ? undefined : '100%'),
    aspectRatio: aspectRatio !== 'auto' ? aspectRatio : undefined,
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden bg-black rounded-lg',
        'focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2',
        className
      )}
      style={containerStyle}
    >
      {/* Video Element */}
      <VideoElement
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        preload={preload}
        playsInline={playsInline}
        className="w-full h-full object-contain"
      />

      {/* Loading Spinner */}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
          <LoadingSpinner />
        </div>
      )}

      {/* Built-in Simple Controls */}
      {isReady && !playerState.hasError && (
        <div className="absolute inset-0 z-30 group">
          {/* Center Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => {
                const video = containerRef.current?.querySelector('video');
                if (video) {
                  if (playerState.isPlaying) {
                    video.pause();
                  } else {
                    video.play();
                  }
                }
              }}
              className={cn(
                "w-16 h-16 rounded-full bg-black/60 hover:bg-black/80",
                "flex items-center justify-center text-white",
                "transition-all duration-200 backdrop-blur-sm",
                "opacity-0 group-hover:opacity-100",
                !playerState.isPlaying && "opacity-100"
              )}
            >
              {playerState.isPlaying ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              ) : (
                <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>
          </div>

          {/* Bottom Control Bar */}
          <div className={cn(
            "absolute bottom-0 left-0 right-0",
            "bg-gradient-to-t from-black/80 via-black/40 to-transparent",
            "p-4 transition-all duration-300",
            "opacity-0 group-hover:opacity-100",
            !playerState.isPlaying && "opacity-100"
          )}>
            {/* Progress Bar */}
            <div className="mb-3">
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-200"
                  style={{ 
                    width: `${playerState.duration > 0 ? (playerState.currentTime / playerState.duration) * 100 : 0}%` 
                  }}
                />
              </div>
            </div>

            {/* Control Row */}
            <div className="flex items-center justify-between text-white text-sm">
              <div className="flex items-center gap-3">
                {/* Play/Pause Button */}
                <button
                  onClick={() => {
                    const video = containerRef.current?.querySelector('video');
                    if (video) {
                      if (playerState.isPlaying) {
                        video.pause();
                      } else {
                        video.play();
                      }
                    }
                  }}
                  className="hover:text-blue-400 transition-colors"
                >
                  {playerState.isPlaying ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                </button>

                {/* Volume Button */}
                <button
                  onClick={() => {
                    const video = containerRef.current?.querySelector('video') as HTMLVideoElement;
                    if (video) {
                      video.muted = !video.muted;
                    }
                  }}
                  className="hover:text-blue-400 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </svg>
                </button>

                {/* Time Display */}
                <span className="text-xs font-mono">
                  {Math.floor(playerState.currentTime / 60)}:{String(Math.floor(playerState.currentTime % 60)).padStart(2, '0')} / {Math.floor(playerState.duration / 60)}:{String(Math.floor(playerState.duration % 60)).padStart(2, '0')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Fullscreen Button */}
                <button
                  onClick={() => {
                    const video = containerRef.current?.querySelector('video');
                    if (video) {
                      if (document.fullscreenElement) {
                        document.exitFullscreen();
                      } else {
                        video.requestFullscreen();
                      }
                    }
                  }}
                  className="hover:text-blue-400 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom children (if provided) */}
      {children}

      {/* Debug info - remove in production */}
      <div className="absolute top-2 left-2 text-xs text-white/70 bg-black/40 px-2 py-1 rounded z-50">
        {playerState.isPlaying ? 'Playing' : 'Paused'} | {playerState.currentTime.toFixed(1)}s / {playerState.duration.toFixed(1)}s
      </div>
    </div>
  );
};
