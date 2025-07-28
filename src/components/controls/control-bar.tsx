"use client";
/**
 * Control Bar Component
 * Main container for video player controls
 */

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { PlayButton } from './play-button';
import { ProgressBar } from './progress-bar';
import { VolumeControl } from './volume-control';
import { TimeDisplay } from './time-display';
import { QualitySelector } from './quality-selector';
import { FullscreenButton } from './fullscreen-button';
import { PictureInPicture } from './picture-in-picture';
import { PlaybackRate } from './playback-rate';
import { SettingsMenu } from './settings-menu';

interface ControlBarProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  playbackRate: number;
  bufferedRanges: TimeRanges;
  qualities?: Array<{ label: string; value: string; selected?: boolean }>;
  showControls?: boolean;
  autoHide?: boolean;
  autoHideDelay?: number;
  className?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onSeek?: (time: number) => void;
  onVolumeChange?: (volume: number) => void;
  onMuteToggle?: () => void;
  onFullscreenToggle?: () => void;
  onPictureInPictureToggle?: () => void;
  onPlaybackRateChange?: (rate: number) => void;
  onQualityChange?: (quality: string) => void;
  onSettingsOpen?: () => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isFullscreen,
  playbackRate,
  bufferedRanges,
  qualities,
  showControls = true,
  autoHide = true,
  autoHideDelay = 3000,
  className,
  onPlay,
  onPause,
  onSeek,
  onVolumeChange,
  onMuteToggle,
  onFullscreenToggle,
  onPictureInPictureToggle,
  onPlaybackRateChange,
  onQualityChange,
  onSettingsOpen
}) => {
  const [isVisible, setIsVisible] = useState(showControls);
  const [isHovered, setIsHovered] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const controlBarRef = useRef<HTMLDivElement>(null);

  // Auto-hide functionality
  useEffect(() => {
    if (!autoHide) {
      setIsVisible(showControls);
      return;
    }

    if (isPlaying && !isHovered && showControls) {
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, autoHideDelay);
    } else {
      setIsVisible(showControls);
    }

    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [isPlaying, isHovered, showControls, autoHide, autoHideDelay]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setIsVisible(true);
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handlePlayToggle = () => {
    if (isPlaying) {
      onPause?.();
    } else {
      onPlay?.();
    }
  };

  return (
    <div
      ref={controlBarRef}
      className={cn(
        "absolute bottom-0 left-0 right-0 z-50",
        "bg-gradient-to-t from-black/80 via-black/60 to-transparent",
        "transition-all duration-300 ease-in-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="toolbar"
      aria-label="Video player controls"
    >
      {/* Progress Bar */}
      <div className="px-4 pb-2">
        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          bufferedRanges={bufferedRanges}
          onSeek={onSeek}
          className="mb-3"
        />
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between px-4 pb-4">
        {/* Left Controls */}
        <div className="flex items-center space-x-2">
          <PlayButton
            isPlaying={isPlaying}
            onClick={handlePlayToggle}
            size="md"
          />

          <VolumeControl
            volume={volume}
            isMuted={isMuted}
            onVolumeChange={onVolumeChange}
            onMuteToggle={onMuteToggle}
          />

          <TimeDisplay
            currentTime={currentTime}
            duration={duration}
            className="hidden sm:block"
          />
        </div>

        {/* Center Controls (Mobile) */}
        <div className="flex items-center space-x-2 sm:hidden">
          <TimeDisplay
            currentTime={currentTime}
            duration={duration}
            compact
          />
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-2">
          {/* Quality Selector */}
          {qualities && qualities.length > 1 && (
            <QualitySelector
              qualities={qualities}
              onQualityChange={onQualityChange}
              className="hidden lg:block"
            />
          )}

          {/* Playback Rate */}
          <PlaybackRate
            rate={playbackRate}
            onRateChange={onPlaybackRateChange}
            className="hidden md:block"
          />

          {/* Picture-in-Picture */}
          <PictureInPicture
            onToggle={onPictureInPictureToggle}
            className="hidden sm:block"
          />

          {/* Settings Menu - Always visible */}
          <SettingsMenu
            onOpen={onSettingsOpen}
            qualities={qualities}
            playbackRate={playbackRate}
            onQualityChange={onQualityChange}
            onPlaybackRateChange={onPlaybackRateChange}
          />

          {/* Fullscreen Button */}
          <FullscreenButton
            isFullscreen={isFullscreen}
            onToggle={onFullscreenToggle}
          />
        </div>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="sr-only">
        Press spacebar to play/pause, left/right arrows to seek, up/down arrows to adjust volume
      </div>
    </div>
  );
};
