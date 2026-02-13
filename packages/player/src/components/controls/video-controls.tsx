/**
 * Video player controls component
 * Includes play/pause, progress bar, volume, quality, and fullscreen controls
 */

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
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { KeyboardShortcuts } from './keyboard-shortcuts';
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
  };
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
  onShow,
  onHide,
  className,
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // Client-side mount check for SSR compatibility
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const handlePlayPause = () => {
    if (state.isLoading) return;
    
    if (state.isPlaying && !state.isPaused) {
      controls.pause();
    } else if (state.isPaused && !state.isPlaying) {
      controls.play();
    }
  };

  const handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * state.duration;
    controls.seek(newTime);
  };

  const handleProgressHover = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const hoverX = event.clientX - rect.left;
    const percentage = hoverX / rect.width;
    const time = percentage * state.duration;
    setHoverTime(time);
  };

  const handleVolumeChange = (value: number[]) => {
    controls.setVolume(value[0] / 100);
  };

  const progressPercentage = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;
  const bufferedPercentage = state.buffered;

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
            <div 
              className="relative w-full h-1 bg-white/20 rounded-full cursor-pointer group"
              onClick={handleProgressClick}
              onMouseMove={handleProgressHover}
              onMouseLeave={() => setHoverTime(null)}
            >
              {/* Buffered Progress */}
              <div 
                className="absolute left-0 top-0 h-full bg-white/30 rounded-full"
                style={{ width: `${bufferedPercentage}%` }}
              />
              
              {/* Play Progress */}
              <div 
                className="absolute left-0 top-0 h-full bg-blue-500 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
              
              {/* Progress Handle */}
              <div 
                className="absolute top-1/2 w-3 h-3 bg-blue-500 rounded-full transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `calc(${progressPercentage}% - 6px)` }}
              />
              
              {/* Hover Preview */}
              {hoverTime !== null && (
                <div 
                  className="absolute bottom-6 transform -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-sm pointer-events-none z-10"
                  style={{ left: `${(hoverTime / state.duration) * 100}%` }}
                >
                  {formatTime(hoverTime)}
                </div>
              )}
            </div>
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

            {/* Time Display */}
            <div className="text-white text-sm font-mono">
              {formatTime(state.currentTime)} / {formatTime(state.duration)}
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

            {/* Quality Selector */}
            {controlsConfig.quality && qualityLevels.length > 0 && (
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/10 p-2"
                      >
                        <Settings className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Quality</TooltipContent>
                </Tooltip>
                
                <DropdownMenuContent align="end" className="bg-black/90 border-white/10">
                  {qualityLevels.map((level) => (
                    <DropdownMenuItem
                      key={level.id}
                      onClick={() => controls.setQuality(level.id)}
                      className="text-white hover:bg-white/10 cursor-pointer"
                    >
                      {level.label}
                      {state.quality === level.label && (
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
