"use client";
/**
 * Progress Bar Component
 * Video progress and seek control with thumbnail preview
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ThumbnailPreview, TimelineThumbnails } from '@/components/thumbnails';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  bufferedRanges: TimeRanges;
  disabled?: boolean;
  className?: string;
  videoUrl?: string;
  thumbnailPreviewEnabled?: boolean;
  timelineThumbnailsEnabled?: boolean;
  thumbnailSpriteSheet?: {
    url: string;
    columns: number;
    rows: number;
    thumbnailWidth: number;
    thumbnailHeight: number;
    interval: number;
  };
  thumbnailUrls?: string[];
  onSeek?: (time: number) => void;
  onSeekStart?: () => void;
  onSeekEnd?: () => void;
  onHover?: (time: number | null) => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  bufferedRanges,
  disabled = false,
  className,
  videoUrl = '',
  thumbnailPreviewEnabled = false,
  timelineThumbnailsEnabled = false,
  thumbnailSpriteSheet,
  thumbnailUrls,
  onSeek,
  onSeekStart,
  onSeekEnd,
  onHover
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const progressRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<number | null>(null);

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const hoverPercentage = hoverTime !== null && duration > 0 ? (hoverTime / duration) * 100 : null;

  // Calculate buffered ranges
  const getBufferedRanges = useCallback(() => {
    if (!bufferedRanges || duration <= 0) return [];
    
    const ranges = [];
    for (let i = 0; i < bufferedRanges.length; i++) {
      const start = (bufferedRanges.start(i) / duration) * 100;
      const end = (bufferedRanges.end(i) / duration) * 100;
      ranges.push({ start, end });
    }
    return ranges;
  }, [bufferedRanges, duration]);

  const getTimeFromPosition = useCallback((clientX: number) => {
    if (!progressRef.current) return 0;
    
    const rect = progressRef.current.getBoundingClientRect();
    const position = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return position * duration;
  }, [duration]);

  const handleMouseDown = (event: React.MouseEvent) => {
    if (disabled || duration <= 0) return;
    
    event.preventDefault();
    setIsDragging(true);
    dragStartRef.current = currentTime;
    
    const time = getTimeFromPosition(event.clientX);
    onSeekStart?.();
    onSeek?.(time);
  };

  const handleMouseMoveLocal = (event: React.MouseEvent) => {
    if (!progressRef.current) return;
    
    const time = getTimeFromPosition(event.clientX);
    const rect = progressRef.current.getBoundingClientRect();
    
    if (!isDragging) {
      setHoverTime(time);
      // Progress bar'ın pozisyonuna göre hesapla
      setHoverPosition({
        x: event.clientX,
        y: rect.top, // Progress bar'ın pozisyonu (thumbnail kendi hesaplamasını yapacak)
      });
      onHover?.(time);
    }
  };

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!progressRef.current) return;
    
    const time = getTimeFromPosition(event.clientX);
    
    if (isDragging) {
      onSeek?.(time);
    }
  }, [isDragging, getTimeFromPosition, onSeek]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      onSeekEnd?.();
      dragStartRef.current = null;
    }
  }, [isDragging, onSeekEnd]);

  const handleMouseLeave = () => {
    if (!isDragging) {
      setHoverTime(null);
      setHoverPosition({ x: 0, y: 0 });
      onHover?.(null);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled || duration <= 0) return;
    
    let seekTime = currentTime;
    const seekAmount = event.shiftKey ? 10 : 5; // Shift for bigger jumps
    
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        seekTime = Math.max(0, currentTime - seekAmount);
        break;
      case 'ArrowRight':
        event.preventDefault();
        seekTime = Math.min(duration, currentTime + seekAmount);
        break;
      case 'Home':
        event.preventDefault();
        seekTime = 0;
        break;
      case 'End':
        event.preventDefault();
        seekTime = duration;
        break;
      default:
        return;
    }
    
    onSeek?.(seekTime);
  };

  // Global mouse event handlers
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Format time for tooltip
  const formatTime = (time: number) => {
    if (!isFinite(time)) return '0:00';
    
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const bufferedRangesArray = getBufferedRanges();

  return (
    <div
      ref={progressRef}
      className={cn(
        "relative group cursor-pointer select-none",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMoveLocal}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      role="slider"
      aria-label="Video progress"
      aria-valuemin={0}
      aria-valuemax={duration}
      aria-valuenow={currentTime}
      aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
    >
      {/* Progress track */}
      <div className="relative h-1 bg-white/20 rounded-full group-hover:h-1.5 transition-all duration-200">
        {/* Buffered ranges */}
        {bufferedRangesArray.map((range: { start: number; end: number }, index: number) => (
          <div
            key={index}
            className="absolute top-0 h-full bg-white/40 rounded-full"
            style={{
              left: `${range.start}%`,
              width: `${range.end - range.start}%`
            }}
          />
        ))}
        
        {/* Progress fill */}
        <div
          className="absolute top-0 h-full bg-blue-500 rounded-full transition-all duration-200"
          style={{ width: `${progressPercentage}%` }}
        />
        
        {/* Hover preview */}
        {hoverPercentage !== null && !isDragging && (
          <div
            className="absolute top-0 h-full bg-white/60 rounded-full w-0.5"
            style={{ left: `${hoverPercentage}%` }}
          />
        )}
        
        {/* Progress handle */}
        <div
          className={cn(
            "absolute top-1/2 w-3 h-3 bg-blue-500 rounded-full -translate-y-1/2",
            "opacity-0 group-hover:opacity-100 transition-all duration-200",
            "shadow-lg border-2 border-white",
            isDragging && "scale-125 opacity-100"
          )}
          style={{ left: `${progressPercentage}%`, marginLeft: '-6px' }}
        />
      </div>
      
      {/* Time tooltip */}
      {hoverTime !== null && hoverPercentage !== null && !thumbnailPreviewEnabled && (
        <div
          className="absolute bottom-6 px-2 py-1 bg-black/80 text-white text-xs rounded pointer-events-none whitespace-nowrap"
          style={{ 
            left: `${hoverPercentage}%`, 
            transform: 'translateX(-50%)' 
          }}
        >
          {formatTime(hoverTime)}
        </div>
      )}

      {/* Thumbnail Preview */}
      {thumbnailPreviewEnabled && hoverTime !== null && (
        <ThumbnailPreview
          videoUrl={videoUrl}
          currentTime={hoverTime}
          duration={duration}
          isVisible={true}
          position={hoverPosition}
          spriteSheet={thumbnailSpriteSheet}
          className="z-50"
        />
      )}

      {/* Timeline Thumbnails */}
      {timelineThumbnailsEnabled && (
        <TimelineThumbnails
          videoUrl={videoUrl}
          duration={duration}
          currentTime={currentTime}
          progressBarRef={progressRef as React.RefObject<HTMLElement>}
          thumbnailData={{
            type: thumbnailSpriteSheet ? 'sprite' : 'urls',
            urls: thumbnailUrls,
            spriteSheet: thumbnailSpriteSheet ? {
              ...thumbnailSpriteSheet,
              interval: thumbnailSpriteSheet.interval
            } : undefined
          }}
          isEnabled={timelineThumbnailsEnabled}
          className="absolute inset-0"
        />
      )}
    </div>
  );
};
