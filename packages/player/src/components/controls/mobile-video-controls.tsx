/**
 * Mobile-optimized video controls inspired by VK Player
 * Features: Touch-friendly UI, gesture support, adaptive layout
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Settings,
  MoreHorizontal,
  SkipBack,
  SkipForward,
  Loader2,
  PictureInPicture,
  Minimize
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { VideoThumbnail } from '@/components/player/video-thumbnail';
import type { VideoPlayerState, VideoPlayerControls } from '@/hooks/use-video-player';

interface MobileVideoControlsProps {
  state: VideoPlayerState;
  controls: VideoPlayerControls;
  qualityLevels: Array<{ id: string; label: string; height?: number }>;
  className?: string;
  onShow?: () => void;
  onHide?: () => void;
  /** Enable thumbnail previews */
  thumbnailPreview?: boolean;
  /** Base URL for thumbnail images */
  thumbnailUrl?: string;
}

// Format time in MM:SS format
const formatTime = (seconds: number): string => {
  if (!isFinite(seconds)) return '0:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const MobileVideoControls: React.FC<MobileVideoControlsProps> = ({
  state,
  controls,
  qualityLevels,
  className,
  onShow,
  onHide,
  thumbnailPreview = false,
  thumbnailUrl,
}) => {
  const [showVolumePanel, setShowVolumePanel] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [touchPosition, setTouchPosition] = useState<{ x: number; y: number } | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-hide controls functionality
  const showControlsTemporarily = useCallback(() => {
    setIsVisible(true);
    onShow?.();
    
    // Clear existing timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    
    // Set new timeout only if video is playing and no panels are open
    if (state.isPlaying && !showVolumePanel && !showSettings) {
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
        onHide?.();
      }, 3000);
    }
  }, [state.isPlaying, showVolumePanel, showSettings, onShow, onHide]);

  // Show controls when video is paused or panels are open
  useEffect(() => {
    if (!state.isPlaying || showVolumePanel || showSettings) {
      setIsVisible(true);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    }
  }, [state.isPlaying, showVolumePanel, showSettings]);

  // Touch/tap to toggle controls
  const handleContainerTap = useCallback((e: React.MouseEvent) => {
    // Only toggle controls if tapping on empty area (not on buttons)
    if (e.target === e.currentTarget) {
      setIsVisible(!isVisible);
      
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      
      // If showing controls and video is playing, start auto-hide timer
      if (!isVisible && state.isPlaying && !showVolumePanel && !showSettings) {
        hideTimeoutRef.current = setTimeout(() => {
          setIsVisible(false);
          onHide?.();
        }, 3000);
      }
    }
  }, [isVisible, state.isPlaying, showVolumePanel, showSettings, onHide]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  const progressPercentage = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;
  const bufferedPercentage = state.duration > 0 ? (state.buffered / state.duration) * 100 : 0;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * state.duration;
    controls.seek(newTime);
  };

  const handleProgressHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!thumbnailPreview) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const time = percent * state.duration;
    setHoverTime(time);
  };

  const handleProgressLeave = () => {
    setHoverTime(null);
  };

  const handleProgressTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!thumbnailPreview) return;
    
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (touch.clientX - rect.left) / rect.width;
    const time = percent * state.duration;
    
    setHoverTime(time);
    setTouchPosition({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = () => {
    setHoverTime(null);
    setTouchPosition(null);
  };

  const handleSeek = (direction: 'backward' | 'forward') => {
    const seekAmount = 10; // seconds
    const newTime = direction === 'backward' 
      ? Math.max(0, state.currentTime - seekAmount)
      : Math.min(state.duration, state.currentTime + seekAmount);
    controls.seek(newTime);
  };

  if (!isMounted) {
    return null; // Prevent SSR hydration issues
  }

  return (
    <div 
      className={cn(
        'absolute inset-0 flex flex-col justify-between',
        'bg-gradient-to-t from-black/80 via-transparent to-black/60',
        'text-white transition-opacity duration-300',
        'z-10', // Ensure controls are above video
        isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        className
      )}
      onClick={handleContainerTap} // Tap to show controls
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      
      {/* Top Bar - Mobile optimized */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent touch-auto">
        <div className="flex items-center gap-3">
          {/* Loading indicator */}
          {state.isLoading && (
            <Loader2 className="h-5 w-5 animate-spin" />
          )}
          
          {/* Quality indicator */}
          <div className="px-2 py-1 bg-black/40 rounded text-xs font-medium">
            {state.quality === 'auto' ? 'AUTO' : state.quality.toUpperCase()}
          </div>

          {/* Volume level indicator */}
          <div className="px-2 py-1 bg-black/40 rounded text-xs font-medium">
            {state.isMuted ? 'MUTED' : `${Math.round(state.volume * 100)}%`}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Volume Control */}
          <Button
            variant="ghost"
            size="sm"
            className="h-12 w-12 p-0 text-white hover:bg-white/20 touch-manipulation"
            onClick={() => controls.toggleMute()}
          >
            {state.isMuted || state.volume === 0 ? (
              <VolumeX className="h-6 w-6" />
            ) : (
              <Volume2 className="h-6 w-6" />
            )}
          </Button>

          {/* More Volume Options */}
          <Button
            variant="ghost"
            size="sm"
            className="h-12 w-12 p-0 text-white hover:bg-white/20 touch-manipulation"
            onClick={() => setShowVolumePanel(!showVolumePanel)}
          >
            <MoreHorizontal className="h-6 w-6" />
          </Button>

          {/* Picture in Picture */}
          <Button
            variant="ghost"
            size="sm"
            className="h-12 w-12 p-0 text-white hover:bg-white/20 touch-manipulation"
            onClick={() => controls.togglePictureInPicture()}
            disabled={!state.duration}
          >
            <PictureInPicture className="h-6 w-6" />
          </Button>

          {/* Settings */}
          <Button
            variant="ghost"
            size="sm"
            className="h-12 w-12 p-0 text-white hover:bg-white/20 touch-manipulation"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-6 w-6" />
          </Button>

          {/* Fullscreen */}
          <Button
            variant="ghost"
            size="sm"
            className="h-12 w-12 p-0 text-white hover:bg-white/20 touch-manipulation"
            onClick={() => controls.toggleFullscreen()}
          >
            {state.isFullscreen ? (
              <Minimize className="h-6 w-6" />
            ) : (
              <Maximize className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Center Play/Pause - Large touch target */}
      <div className="flex-1 flex items-center justify-center touch-auto">
        <div className="flex items-center gap-8">
          {/* Seek Backward */}
          <Button
            variant="ghost"
            size="lg"
            className="h-16 w-16 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 text-white hover:bg-black/60 hover:scale-110 transition-all duration-200 touch-manipulation"
            onClick={() => handleSeek('backward')}
            disabled={!state.duration}
          >
            <SkipBack className="h-8 w-8" />
          </Button>

          {/* Main Play/Pause Button - VK style with enhanced touch */}
          <Button
            variant="ghost"
            size="lg"
            className="h-24 w-24 rounded-full bg-black/50 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-black/70 active:scale-95 transition-all duration-300 shadow-2xl touch-manipulation"
            onClick={() => {
              state.isPlaying ? controls.pause() : controls.play();
            }}
            disabled={!state.duration && !state.isLoading}
            style={{ minHeight: '96px', minWidth: '96px' }} // Ensure minimum touch target
          >
            {state.isLoading ? (
              <Loader2 className="h-12 w-12 animate-spin" />
            ) : state.isPlaying ? (
              <Pause className="h-12 w-12" />
            ) : (
              <Play className="h-12 w-12 ml-1" />
            )}
          </Button>

          {/* Seek Forward */}
          <Button
            variant="ghost"
            size="lg"
            className="h-16 w-16 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 text-white hover:bg-black/60 hover:scale-110 transition-all duration-200 touch-manipulation"
            onClick={() => handleSeek('forward')}
            disabled={!state.duration}
          >
            <SkipForward className="h-8 w-8" />
          </Button>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="p-4 bg-gradient-to-t from-black/80 to-transparent space-y-2" style={{ paddingBottom: 'max(3rem, calc(3rem + env(safe-area-inset-bottom)))' }}>
        
        {/* Playback rate indicator - moved to top */}
        {state.playbackRate !== 1 && (
          <div className="flex justify-center mb-2">
            <div className="px-4 py-2 bg-white/20 rounded-full text-sm font-medium">
              {state.playbackRate}x Speed
            </div>
          </div>
        )}

        {/* Progress Bar - Enhanced for mobile touch */}
        <div className="space-y-2 touch-auto relative">
          <div 
            className="relative h-3 bg-white/20 rounded-full cursor-pointer group touch-manipulation"
            onClick={handleProgressClick}
            onMouseMove={handleProgressHover}
            onMouseLeave={handleProgressLeave}
            onTouchMove={handleProgressTouch}
            onTouchEnd={handleTouchEnd}
            style={{ minHeight: '12px' }} // Ensure minimum touch target height
          >
            {/* Buffer indicator */}
            <div 
              className="absolute left-0 top-0 h-full bg-white/30 rounded-full transition-all duration-300"
              style={{ width: `${bufferedPercentage}%` }}
            />
            
            {/* Progress indicator */}
            <div 
              className="absolute left-0 top-0 h-full bg-white rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
            
            {/* Progress thumb - larger for mobile */}
            <div 
              className="absolute top-1/2 transform -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg border-2 border-black/20 transition-all duration-200 group-active:scale-125"
              style={{ left: `calc(${progressPercentage}% - 10px)` }}
            />

            {/* Thumbnail Preview */}
            {thumbnailPreview && hoverTime !== null && (
              <div 
                className="absolute"
                style={{ 
                  left: `${(hoverTime / state.duration) * 100}%`,
                  bottom: '100%',
                  transform: 'translateX(-50%)'
                }}
              >
                <VideoThumbnail
                  duration={state.duration}
                  currentTime={hoverTime}
                  thumbnailUrl={thumbnailUrl}
                  isMobile={true}
                  thumbnailSize={{ width: 120, height: 68 }}
                />
              </div>
            )}
          </div>
          
          {/* Time display - larger text for mobile */}
          <div className="flex justify-between text-base font-medium">
            <span>{formatTime(state.currentTime)}</span>
            <span>{formatTime(state.duration)}</span>
          </div>
        </div>
      </div>

      {/* Volume Panel Overlay */}
      {showVolumePanel && (
        <div className="absolute top-16 left-4 bg-black/90 backdrop-blur-sm rounded-lg p-4 min-w-[200px]">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Audio Controls</h3>
            
            {/* Volume Slider */}
            <div className="space-y-2">
              <label className="text-xs text-gray-300">Volume</label>
              <Slider
                value={[state.isMuted ? 0 : state.volume * 100]}
                onValueChange={([value]) => {
                  controls.setVolume(value / 100);
                  if (value > 0 && state.isMuted) {
                    controls.toggleMute();
                  }
                }}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            {/* Close button */}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setShowVolumePanel(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Settings Panel Overlay */}
      {showSettings && (
        <div className="absolute top-16 right-4 bg-black/90 backdrop-blur-sm rounded-lg p-4 min-w-[200px]">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Video Settings</h3>
            
            {/* Quality Selection */}
            <div className="space-y-2">
              <label className="text-xs text-gray-300">Quality</label>
              <div className="grid gap-1">
                {qualityLevels.map((quality) => (
                  <Button
                    key={quality.id}
                    variant={state.quality === quality.id ? "default" : "ghost"}
                    size="sm"
                    className="justify-start text-xs"
                    onClick={() => controls.setQuality(quality.id)}
                  >
                    {quality.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Playback Speed */}
            <div className="space-y-2">
              <label className="text-xs text-gray-300">Speed</label>
              <div className="grid grid-cols-2 gap-1">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                  <Button
                    key={rate}
                    variant={state.playbackRate === rate ? "default" : "ghost"}
                    size="sm"
                    className="text-xs"
                    onClick={() => controls.setPlaybackRate(rate)}
                  >
                    {rate}x
                  </Button>
                ))}
              </div>
            </div>

            {/* Close button */}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setShowSettings(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
