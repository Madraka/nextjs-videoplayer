/**
 * Video Element Component
 * Core HTML5 video element with streaming support
 */

"use client";

import React, { useRef, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface VideoElementProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  playsInline?: boolean;
  crossOrigin?: 'anonymous' | 'use-credentials';
  className?: string;
  onReady?: () => void;
  onError?: (error: Error) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onVolumeChange?: (volume: number) => void;
  onRateChange?: (playbackRate: number) => void;
  onBuffer?: (isBuffering: boolean) => void;
  onProgress?: (buffered: TimeRanges) => void;
  onLoadStart?: () => void;
  onLoadedMetadata?: () => void;
  onLoadedData?: () => void;
  onCanPlay?: () => void;
  onCanPlayThrough?: () => void;
  onWaiting?: () => void;
  onPlaying?: () => void;
  onEnded?: () => void;
  onSeeking?: () => void;
  onSeeked?: () => void;
  onDurationChange?: (duration: number) => void;
}

export interface VideoElementRef {
  play: () => Promise<void>;
  pause: () => void;
  load: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  setMuted: (muted: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getVolume: () => number;
  getPlaybackRate: () => number;
  isMuted: () => boolean;
  isPaused: () => boolean;
  isEnded: () => boolean;
  getReadyState: () => number;
  getNetworkState: () => number;
  getBuffered: () => TimeRanges;
  getSeekable: () => TimeRanges;
  getVideoElement: () => HTMLVideoElement | null;
}

export const VideoElement = forwardRef<VideoElementRef, VideoElementProps>(({
  src,
  poster,
  autoPlay = false,
  muted = false,
  loop = false,
  preload = 'metadata',
  playsInline = true,
  crossOrigin,
  className,
  onReady,
  onError,
  onPlay,
  onPause,
  onTimeUpdate,
  onVolumeChange,
  onRateChange,
  onBuffer,
  onProgress,
  onLoadStart,
  onLoadedMetadata,
  onLoadedData,
  onCanPlay,
  onCanPlayThrough,
  onWaiting,
  onPlaying,
  onEnded,
  onSeeking,
  onSeeked,
  onDurationChange
}, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastBufferingState = useRef(false);

  // Expose video methods via ref
  useImperativeHandle(ref, () => ({
    play: async () => {
      if (videoRef.current) {
        try {
          await videoRef.current.play();
        } catch (error) {
          console.error('Play failed:', error);
          throw error;
        }
      } else {
        throw new Error('Video element not available');
      }
    },
    pause: () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    },
    load: () => {
      if (videoRef.current) {
        videoRef.current.load();
      }
    },
    seek: (time: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime = Math.max(0, Math.min(time, videoRef.current.duration || 0));
      }
    },
    setVolume: (volume: number) => {
      if (videoRef.current) {
        videoRef.current.volume = Math.max(0, Math.min(1, volume));
      }
    },
    setPlaybackRate: (rate: number) => {
      if (videoRef.current) {
        videoRef.current.playbackRate = Math.max(0.25, Math.min(4, rate));
      }
    },
    setMuted: (muted: boolean) => {
      if (videoRef.current) {
        videoRef.current.muted = muted;
      }
    },
    getCurrentTime: () => videoRef.current?.currentTime || 0,
    getDuration: () => videoRef.current?.duration || 0,
    getVolume: () => videoRef.current?.volume || 0,
    getPlaybackRate: () => videoRef.current?.playbackRate || 1,
    isMuted: () => videoRef.current?.muted || false,
    isPaused: () => videoRef.current?.paused ?? true,
    isEnded: () => videoRef.current?.ended || false,
    getReadyState: () => videoRef.current?.readyState || 0,
    getNetworkState: () => videoRef.current?.networkState || 0,
    getBuffered: () => videoRef.current?.buffered || ({} as TimeRanges),
    getSeekable: () => videoRef.current?.seekable || ({} as TimeRanges),
    getVideoElement: () => videoRef.current
  }), []);

  // Event handlers
  const handleLoadStart = useCallback(() => {
    onLoadStart?.();
  }, [onLoadStart]);

  const handleLoadedMetadata = useCallback(() => {
    onLoadedMetadata?.();
    if (videoRef.current) {
      onDurationChange?.(videoRef.current.duration);
    }
  }, [onLoadedMetadata, onDurationChange]);

  const handleLoadedData = useCallback(() => {
    onLoadedData?.();
  }, [onLoadedData]);

  const handleCanPlay = useCallback(() => {
    onCanPlay?.();
    onReady?.();
  }, [onCanPlay, onReady]);

  const handleCanPlayThrough = useCallback(() => {
    onCanPlayThrough?.();
  }, [onCanPlayThrough]);

  const handlePlay = useCallback(() => {
    onPlay?.();
  }, [onPlay]);

  const handlePause = useCallback(() => {
    onPause?.();
  }, [onPause]);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      onTimeUpdate?.(videoRef.current.currentTime, videoRef.current.duration);
    }
  }, [onTimeUpdate]);

  const handleVolumeChange = useCallback(() => {
    if (videoRef.current) {
      onVolumeChange?.(videoRef.current.volume);
    }
  }, [onVolumeChange]);

  const handleRateChange = useCallback(() => {
    if (videoRef.current) {
      onRateChange?.(videoRef.current.playbackRate);
    }
  }, [onRateChange]);

  const handleWaiting = useCallback(() => {
    if (!lastBufferingState.current) {
      lastBufferingState.current = true;
      onBuffer?.(true);
    }
    onWaiting?.();
  }, [onBuffer, onWaiting]);

  const handlePlaying = useCallback(() => {
    if (lastBufferingState.current) {
      lastBufferingState.current = false;
      onBuffer?.(false);
    }
    onPlaying?.();
  }, [onBuffer, onPlaying]);

  const handleProgress = useCallback(() => {
    if (videoRef.current) {
      onProgress?.(videoRef.current.buffered);
    }
  }, [onProgress]);

  const handleSeeking = useCallback(() => {
    onSeeking?.();
  }, [onSeeking]);

  const handleSeeked = useCallback(() => {
    onSeeked?.();
  }, [onSeeked]);

  const handleEnded = useCallback(() => {
    onEnded?.();
  }, [onEnded]);

  const handleError = useCallback(() => {
    const video = videoRef.current;
    if (video?.error) {
      const error = new Error(`Video error: ${video.error.message || 'Unknown error'}`);
      onError?.(error);
    }
  }, [onError]);

  const handleDurationChange = useCallback(() => {
    if (videoRef.current) {
      onDurationChange?.(videoRef.current.duration);
    }
  }, [onDurationChange]);

  // Update src when it changes
  useEffect(() => {
    if (videoRef.current && src) {
      videoRef.current.src = src;
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      className={cn("w-full h-full", className)}
      src={src}
      poster={poster}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      preload={preload}
      playsInline={playsInline}
      crossOrigin={crossOrigin}
      onLoadStart={handleLoadStart}
      onLoadedMetadata={handleLoadedMetadata}
      onLoadedData={handleLoadedData}
      onCanPlay={handleCanPlay}
      onCanPlayThrough={handleCanPlayThrough}
      onPlay={handlePlay}
      onPause={handlePause}
      onTimeUpdate={handleTimeUpdate}
      onVolumeChange={handleVolumeChange}
      onRateChange={handleRateChange}
      onWaiting={handleWaiting}
      onPlaying={handlePlaying}
      onProgress={handleProgress}
      onSeeking={handleSeeking}
      onSeeked={handleSeeked}
      onEnded={handleEnded}
      onError={handleError}
      onDurationChange={handleDurationChange}
    >
      Your browser does not support the video tag.
    </video>
  );
});
