/**
 * Video player controls component
 * Includes play/pause, progress bar, volume, quality, and fullscreen controls
 */

"use client";

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Settings,
  Loader2,
  PictureInPicture,
  PictureInPicture2,
  Gauge,
  Monitor,
  Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ProgressBar } from './progress-bar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { KeyboardShortcuts } from './keyboard-shortcuts';
import { SettingsMenu } from './settings-menu';
import { usePlayer } from '@/contexts/player-context';
import type { VideoPlayerState, VideoPlayerControls } from '@/hooks/use-video-player';

interface VideoControlsProps {
  state: VideoPlayerState;
  controls: VideoPlayerControls;
  qualityLevels: Array<{ id: string; label: string; height?: number }>;
  controlsConfig: {
    fullscreen?: boolean;
    quality?: boolean;
    volume?: boolean;
    progress?: boolean;
    playPause?: boolean;
    playbackRate?: boolean;
    pictureInPicture?: boolean;
    theaterMode?: boolean;
    settings?: boolean;
    time?: boolean;
    thumbnailPreview?: boolean;
    timelineThumbnails?: boolean;
  };
  videoUrl?: string;
  thumbnailSpriteSheet?: {
    url: string;
    columns: number;
    rows: number;
    thumbnailWidth: number;
    thumbnailHeight: number;
    interval: number;
  };
  thumbnailUrls?: string[];
  onShow?: () => void;
  onHide?: () => void;
  className?: string;
}

// Format time in MM:SS or HH:MM:SS
const formatTime = (seconds: number): string => {
  if (!isFinite(seconds)) return '0:00';
  
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Playback speed options
const playbackRateOptions = [
  { value: 0.25, label: '0.25x' },
  { value: 0.5, label: '0.5x' },
  { value: 0.75, label: '0.75x' },
  { value: 1, label: 'Normal' },
  { value: 1.25, label: '1.25x' },
  { value: 1.5, label: '1.5x' },
  { value: 1.75, label: '1.75x' },
  { value: 2, label: '2x' },
];

export const VideoControls: React.FC<VideoControlsProps> = ({
  state,
  controls,
  qualityLevels,
  controlsConfig,
  videoUrl = '',
  thumbnailSpriteSheet,
  thumbnailUrls,
  onShow,
  onHide,
  className,
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // Get player context for thumbnail preview setting
  const { state: playerContextState } = usePlayer();
  
  // Client-side mount check for SSR compatibility
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Modern Play/Pause handler with comprehensive state management
  const handlePlayPause = () => {
    console.log('� Modern Play/Pause clicked!');
    console.log('📊 Current Player State:', {
      isLoading: state.isLoading,
      isPlaying: state.isPlaying,
      isPaused: state.isPaused,
      currentTime: state.currentTime,
      duration: state.duration,
      error: state.error
    });
    console.log('🎮 Available Controls:', controls);
    
    if (state.isLoading) {
      console.log('❌ Cannot play/pause - video is loading');
      return;
    }
    
    if (state.error) {
      console.log('❌ Cannot play/pause - video has error:', state.error);
      return;
    }

    // Modern state-based play/pause logic
    if (state.isPlaying && !state.isPaused) {
      console.log('⏸️ Calling modern controls.pause()...');
      try {
        controls.pause();
        console.log('✅ Pause command sent successfully');
      } catch (error) {
        console.error('❌ Pause command failed:', error);
      }
    } else {
      console.log('▶️ Calling modern controls.play()...');
      try {
        controls.play().then(() => {
          console.log('✅ Play command completed successfully');
        }).catch((error) => {
          console.error('❌ Play command failed:', error);
        });
      } catch (error) {
        console.error('❌ Play command failed:', error);
      }
    }
  };

  // Modern progress bar click handler
  const handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
    console.log('🎯 Progress bar clicked');
    
    if (!state.duration || state.duration === 0) {
      console.log('❌ Cannot seek - no duration available');
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * state.duration;
    
    console.log('📊 Seek calculation:', {
      clickX,
      totalWidth: rect.width,
      percentage: percentage.toFixed(3),
      newTime: newTime.toFixed(2),
      duration: state.duration
    });
    
    try {
      controls.seek(newTime);
      console.log('✅ Seek command sent successfully');
    } catch (error) {
      console.error('❌ Seek command failed:', error);
    }
  };

  const handleProgressHover = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const hoverX = event.clientX - rect.left;
    const percentage = hoverX / rect.width;
    const time = percentage * state.duration;
    setHoverTime(time);
  };

  // Modern volume change handler
  const handleVolumeChange = (value: number[]) => {
    const volumeValue = value[0] / 100;
    console.log('🔊 Volume change requested:', {
      sliderValue: value[0],
      volumeValue: volumeValue,
      currentVolume: state.volume
    });
    
    try {
      controls.setVolume(volumeValue);
      console.log('✅ Volume change command sent successfully');
    } catch (error) {
      console.error('❌ Volume change command failed:', error);
    }
  };

  // Modern progress calculations with debugging
  const progressPercentage = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;
  const bufferedPercentage = state.buffered;

  // Debug progress values
  React.useEffect(() => {
    if (state.duration > 0) {
      console.log('📊 Progress Update:', {
        currentTime: state.currentTime.toFixed(2),
        duration: state.duration.toFixed(2),
        progressPercentage: progressPercentage.toFixed(1) + '%',
        bufferedPercentage: bufferedPercentage.toFixed(1) + '%'
      });
    }
  }, [state.currentTime, state.duration, progressPercentage, bufferedPercentage]);

  return (
    <TooltipProvider>
      <div className={cn(
        'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent',
        'p-4 transition-opacity duration-300',
        className
      )}>
        {/* Progress Bar */}
        {controlsConfig.progress && (
          <div className="mb-4">
            <ProgressBar
              currentTime={state.currentTime}
              duration={state.duration}
              bufferedRanges={state.bufferedRanges}
              videoUrl={videoUrl}
              thumbnailPreviewEnabled={playerContextState.thumbnailPreview}
              timelineThumbnailsEnabled={controlsConfig.timelineThumbnails || false}
              thumbnailSpriteSheet={thumbnailSpriteSheet}
              thumbnailUrls={thumbnailUrls}
              onSeek={controls.seek}
              onSeekStart={() => console.log('🎯 Seek started')}
              onSeekEnd={() => console.log('🎯 Seek ended')}
              onHover={(time) => setHoverTime(time)}
              className="w-full"
            />
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Play/Pause Button */}
            {controlsConfig.playPause && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePlayPause}
                    disabled={state.isLoading}
                    className="text-white hover:bg-white/10 p-2"
                  >
                    {state.isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : state.isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {state.isPlaying ? 'Pause' : 'Play'}
                </TooltipContent>
              </Tooltip>
            )}

            {/* Modern Time Display with Debug */}
            <div className="text-white text-sm font-mono">
              <span title={`Current: ${state.currentTime.toFixed(2)}s | Duration: ${state.duration.toFixed(2)}s`}>
                {formatTime(state.currentTime)} / {formatTime(state.duration)}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Volume Control */}
            {controlsConfig.volume && (
              <div 
                className="flex items-center space-x-2"
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={controls.toggleMute}
                      className="text-white hover:bg-white/10 p-2"
                    >
                      {state.isMuted || state.volume === 0 ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {state.isMuted ? 'Unmute' : 'Mute'}
                  </TooltipContent>
                </Tooltip>

                {/* Volume Slider */}
                <div className={cn(
                  'transition-all duration-200 overflow-hidden',
                  showVolumeSlider ? 'w-20 opacity-100' : 'w-0 opacity-0'
                )}>
                  <Slider
                    value={[state.isMuted ? 0 : state.volume * 100]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {/* Playback Rate Control */}
            {controlsConfig.playbackRate && (
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/10 p-2 min-w-[60px]"
                      >
                        <Gauge className="w-4 h-4 mr-1" />
                        <span className="text-xs">{state.playbackRate}x</span>
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Playback Speed</TooltipContent>
                </Tooltip>
                
                <DropdownMenuContent align="end" className="bg-black/90 border-white/10">
                  {playbackRateOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => controls.setPlaybackRate(option.value)}
                      className="text-white hover:bg-white/10 cursor-pointer"
                    >
                      {option.label}
                      {state.playbackRate === option.value && (
                        <span className="ml-2 text-blue-400">✓</span>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Theater Mode Toggle */}
            {controlsConfig.theaterMode && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={controls.toggleTheaterMode}
                    className="text-white hover:bg-white/10 p-2"
                  >
                    {state.isTheaterMode ? (
                      <Smartphone className="w-5 h-5" />
                    ) : (
                      <Monitor className="w-5 h-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {state.isTheaterMode ? 'Exit Theater Mode' : 'Theater Mode'}
                </TooltipContent>
              </Tooltip>
            )}

            {/* Picture-in-Picture Toggle */}
            {controlsConfig.pictureInPicture && isMounted && typeof document !== 'undefined' && 'pictureInPictureEnabled' in document && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={controls.togglePictureInPicture}
                    className="text-white hover:bg-white/10 p-2"
                  >
                    {state.isPictureInPicture ? (
                      <PictureInPicture2 className="w-5 h-5" />
                    ) : (
                      <PictureInPicture className="w-5 h-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {state.isPictureInPicture ? 'Exit Picture-in-Picture' : 'Picture-in-Picture'}
                </TooltipContent>
              </Tooltip>
            )}

            {/* Keyboard Shortcuts */}
            <KeyboardShortcuts />

            {/* Settings Menu */}
            {controlsConfig.settings && (
              <SettingsMenu 
                qualities={qualityLevels.map(level => ({
                  label: level.label,
                  value: level.id,
                  selected: state.quality === level.id
                }))}
                playbackRate={state.playbackRate}
                onQualityChange={controls.setQuality}
                onPlaybackRateChange={controls.setPlaybackRate}
              />
            )}

            {/* Fullscreen Toggle */}
            {controlsConfig.fullscreen && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={controls.toggleFullscreen}
                    className="text-white hover:bg-white/10 p-2"
                  >
                    {state.isFullscreen ? (
                      <Minimize className="w-5 h-5" />
                    ) : (
                      <Maximize className="w-5 h-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {state.isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
