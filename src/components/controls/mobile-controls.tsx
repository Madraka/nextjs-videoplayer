"use client";
/**
 * Mobile Controls Component
 * Touch-optimized controls for mobile devices
 */

import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ProgressBar } from './progress-bar';
import { TimeDisplay } from './time-display';

interface MobileControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  bufferedRanges: TimeRanges;
  showControls?: boolean;
  className?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onSeek?: (time: number) => void;
  onSeekBackward?: (seconds?: number) => void;
  onSeekForward?: (seconds?: number) => void;
  onVolumeChange?: (volume: number) => void;
  onMuteToggle?: () => void;
  onFullscreenToggle?: () => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isFullscreen,
  bufferedRanges,
  showControls = true,
  className,
  onPlay,
  onPause,
  onSeek,
  onSeekBackward,
  onSeekForward,
  onVolumeChange,
  onMuteToggle,
  onFullscreenToggle
}) => {
  const [isVisible, setIsVisible] = useState(showControls);
  const [lastTouchTime, setLastTouchTime] = useState(0);

  // Auto-hide controls on mobile
  useEffect(() => {
    if (isPlaying && showControls) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(showControls);
    }
  }, [isPlaying, showControls]);

  const handlePlayToggle = () => {
    if (isPlaying) {
      onPause?.();
    } else {
      onPlay?.();
    }
    showControlsTemporarily();
  };

  const handleSeekBackward = () => {
    onSeekBackward?.(10);
    showControlsTemporarily();
  };

  const handleSeekForward = () => {
    onSeekForward?.(10);
    showControlsTemporarily();
  };

  const handleVolumeToggle = () => {
    onMuteToggle?.();
    showControlsTemporarily();
  };

  const handleFullscreenToggle = () => {
    onFullscreenToggle?.();
    showControlsTemporarily();
  };

  const showControlsTemporarily = () => {
    setIsVisible(true);
    setLastTouchTime(Date.now());
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    showControlsTemporarily();
  };

  // Touch gesture handling for seeking
  const handleDoubleTap = (e: React.TouchEvent, direction: 'left' | 'right') => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastTouchTime < 300) {
      if (direction === 'left') {
        handleSeekBackward();
      } else {
        handleSeekForward();
      }
    }
    setLastTouchTime(now);
  };

  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col",
        "transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none",
        className
      )}
      onTouchStart={handleTouchStart}
    >
      {/* Top Bar */}
      <div className="flex-1 flex items-start justify-end p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFullscreenToggle}
          className="text-white bg-black/50 hover:bg-black/70 w-12 h-12"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          <Maximize className="w-6 h-6" />
        </Button>
      </div>

      {/* Center Controls */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center space-x-8">
          {/* Seek Backward */}
          <div
            className="flex-1 flex items-center justify-center"
            onTouchEnd={(e) => handleDoubleTap(e, 'left')}
          >
            <Button
              variant="ghost"
              size="lg"
              onClick={handleSeekBackward}
              className="text-white bg-black/50 hover:bg-black/70 w-16 h-16 rounded-full"
              aria-label="Seek backward 10 seconds"
            >
              <SkipBack className="w-8 h-8" />
            </Button>
          </div>

          {/* Play/Pause */}
          <Button
            variant="ghost"
            size="lg"
            onClick={handlePlayToggle}
            className="text-white bg-black/50 hover:bg-black/70 w-20 h-20 rounded-full"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-10 h-10" fill="currentColor" />
            ) : (
              <Play className="w-10 h-10 ml-1" fill="currentColor" />
            )}
          </Button>

          {/* Seek Forward */}
          <div
            className="flex-1 flex items-center justify-center"
            onTouchEnd={(e) => handleDoubleTap(e, 'right')}
          >
            <Button
              variant="ghost"
              size="lg"
              onClick={handleSeekForward}
              className="text-white bg-black/50 hover:bg-black/70 w-16 h-16 rounded-full"
              aria-label="Seek forward 10 seconds"
            >
              <SkipForward className="w-8 h-8" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="bg-gradient-to-t from-black/80 via-black/60 to-transparent p-4 space-y-4">
        {/* Progress Bar */}
        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          bufferedRanges={bufferedRanges}
          onSeek={onSeek}
          className="touch-manipulation"
        />

        {/* Control Bar */}
        <div className="flex items-center justify-between">
          {/* Left Controls */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleVolumeToggle}
              className="text-white hover:bg-white/20 w-12 h-12"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-6 h-6" />
              ) : (
                <Volume2 className="w-6 h-6" />
              )}
            </Button>

            <TimeDisplay
              currentTime={currentTime}
              duration={duration}
              compact
              className="text-sm"
            />
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-3">
            <div className="text-white text-sm">
              {Math.round(volume * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Touch Areas for Double Tap */}
      <div className="absolute inset-0 flex pointer-events-none">
        {/* Left tap area */}
        <div
          className="flex-1 pointer-events-auto"
          onTouchEnd={(e) => handleDoubleTap(e, 'left')}
        />
        
        {/* Center area (no double tap) */}
        <div className="flex-1" />
        
        {/* Right tap area */}
        <div
          className="flex-1 pointer-events-auto"
          onTouchEnd={(e) => handleDoubleTap(e, 'right')}
        />
      </div>

      {/* Accessibility hints */}
      <div className="sr-only">
        Double tap left side to seek backward, right side to seek forward.
        Tap once to show controls.
      </div>
    </div>
  );
};
