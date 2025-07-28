/**
 * Player Container Component
 * Complete video player with built-in controls using the full project architecture
 */

"use client";

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from './loading-spinner';
import { useVideoPlayer } from '@/hooks/use-video-player';
import { useVideoGestures } from '@/hooks/use-video-gestures';
import type { VideoEngineConfig } from '@/core/engine';

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
  onStateChange?: (state: any) => void;
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
  onStateChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Use the full video player hook with engine support
  const { state, controls, qualityLevels, engine } = useVideoPlayer(videoRef, {
    autoPlay,
    muted,
    volume: 1,
    src,
  });

  // Gesture support for mobile
  const gestureCallbacks = {
    onTap: () => {
      if (state.isPlaying) {
        controls.pause();
      } else {
        controls.play();
      }
    },
    onDoubleTap: (direction: 'left' | 'right') => {
      const seekAmount = direction === 'left' ? -10 : 10;
      const newTime = Math.max(0, Math.min(state.duration, state.currentTime + seekAmount));
      controls.seek(newTime);
    },
    onSwipeVolume: (delta: number) => {
      const newVolume = Math.max(0, Math.min(1, state.volume + delta));
      controls.setVolume(newVolume);
    },
  };

  // Enable gestures
  useVideoGestures(containerRef, gestureCallbacks, {
    enableTapToPlay: true,
    enableDoubleTapSeek: true,
    enableSwipeVolume: true,
  });

  // Load video when source changes
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

    controls.load(config);
  }, [src, poster, autoPlay, muted, loop, playsInline, engine, controls]);

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(state);
    }
  }, [state, onStateChange]);

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
      {/* Video Element with ref */}
      <video
        ref={videoRef}
        poster={poster}
        preload={preload}
        playsInline={playsInline}
        className="w-full h-full object-contain"
      />

      {/* Loading Spinner */}
      {state.isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
          <LoadingSpinner />
        </div>
      )}

      {/* Error Display */}
      {state.error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-30">
          <div className="text-white text-center p-6">
            <div className="text-red-400 mb-2">⚠ Video Error</div>
            <div className="text-sm">{state.error}</div>
          </div>
        </div>
      )}

      {/* Built-in Controls with Full Engine Support */}
      {!state.isLoading && !state.error && (
        <div className="absolute inset-0 z-30 group">
          {/* Center Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => {
                if (state.isPlaying) {
                  controls.pause();
                } else {
                  controls.play();
                }
              }}
              className={cn(
                "w-16 h-16 rounded-full bg-black/60 hover:bg-black/80",
                "flex items-center justify-center text-white",
                "transition-all duration-200 backdrop-blur-sm",
                "opacity-0 group-hover:opacity-100",
                !state.isPlaying && "opacity-100"
              )}
            >
              {state.isPlaying ? (
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
            !state.isPlaying && "opacity-100"
          )}>
            {/* Progress Bar - Interactive */}
            <div className="mb-3">
              <div 
                className="w-full h-2 bg-white/20 rounded-full overflow-hidden cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const percentage = (e.clientX - rect.left) / rect.width;
                  const newTime = percentage * state.duration;
                  controls.seek(newTime);
                }}
              >
                <div 
                  className="h-full bg-blue-500 transition-all duration-200"
                  style={{ 
                    width: `${state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0}%` 
                  }}
                />
                {/* Buffered indicator */}
                <div 
                  className="absolute h-full bg-white/30 rounded-full"
                  style={{ 
                    width: `${state.buffered}%`,
                    top: 0,
                    left: 0
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
                    if (state.isPlaying) {
                      controls.pause();
                    } else {
                      controls.play();
                    }
                  }}
                  className="hover:text-blue-400 transition-colors"
                >
                  {state.isPlaying ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                </button>

                {/* Volume Control */}
                <button
                  onClick={controls.toggleMute}
                  className="hover:text-blue-400 transition-colors"
                >
                  {state.isMuted ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                    </svg>
                  )}
                </button>

                {/* Time Display */}
                <span className="text-xs font-mono">
                  {Math.floor(state.currentTime / 60)}:{String(Math.floor(state.currentTime % 60)).padStart(2, '0')} / {Math.floor(state.duration / 60)}:{String(Math.floor(state.duration % 60)).padStart(2, '0')}
                </span>

                {/* Quality Selector (if available) */}
                {qualityLevels.length > 1 && (
                  <select
                    value={state.quality}
                    onChange={(e) => controls.setQuality(e.target.value)}
                    className="bg-black/50 text-white text-xs px-2 py-1 rounded border border-white/20"
                  >
                    <option value="auto">Auto</option>
                    {qualityLevels.map((level) => (
                      <option key={level.id} value={level.id}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Playback Rate */}
                <select
                  value={state.playbackRate}
                  onChange={(e) => controls.setPlaybackRate(parseFloat(e.target.value))}
                  className="bg-black/50 text-white text-xs px-2 py-1 rounded border border-white/20"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={0.75}>0.75x</option>
                  <option value={1}>1x</option>
                  <option value={1.25}>1.25x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2x</option>
                </select>

                {/* Picture in Picture */}
                <button
                  onClick={controls.togglePictureInPicture}
                  className="hover:text-blue-400 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z"/>
                  </svg>
                </button>

                {/* Fullscreen Button */}
                <button
                  onClick={controls.toggleFullscreen}
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

      {/* Debug info with full state */}
      <div className="absolute top-2 left-2 text-xs text-white/70 bg-black/40 px-2 py-1 rounded z-50">
        {state.isPlaying ? 'Playing' : 'Paused'} | {state.currentTime.toFixed(1)}s / {state.duration.toFixed(1)}s | {state.quality}
      </div>
    </div>
  );
};
