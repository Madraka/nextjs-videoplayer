"use client";
/**
 * Volume Control Component
 * Volume adjustment and mute toggle for video player
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  onVolumeChange?: (volume: number) => void;
  onMuteToggle?: () => void;
}

export const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  isMuted,
  disabled = false,
  orientation = 'horizontal',
  className,
  onVolumeChange,
  onMuteToggle
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showSlider, setShowSlider] = useState(false);
  const [hoverVolume, setHoverVolume] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const effectiveVolume = isMuted ? 0 : volume;
  const displayVolume = hoverVolume !== null ? hoverVolume : effectiveVolume;

  const getVolumeIcon = () => {
    if (isMuted || effectiveVolume === 0) {
      return VolumeX;
    } else if (effectiveVolume < 0.5) {
      return Volume1;
    } else {
      return Volume2;
    }
  };

  const VolumeIcon = getVolumeIcon();

  const getVolumeFromPosition = useCallback((clientX: number, clientY: number) => {
    if (!sliderRef.current) return 0;
    
    const rect = sliderRef.current.getBoundingClientRect();
    let position;
    
    if (orientation === 'horizontal') {
      position = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    } else {
      position = Math.max(0, Math.min(1, 1 - (clientY - rect.top) / rect.height));
    }
    
    return position;
  }, [orientation]);

  const handleMuteToggle = () => {
    if (!disabled) {
      onMuteToggle?.();
    }
  };

  const handleSliderMouseDown = (event: React.MouseEvent) => {
    if (disabled) return;
    
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
    
    const newVolume = getVolumeFromPosition(event.clientX, event.clientY);
    onVolumeChange?.(newVolume);
  };

  const handleSliderMouseMove = useCallback((event: MouseEvent) => {
    if (!sliderRef.current) return;
    
    const newVolume = getVolumeFromPosition(event.clientX, event.clientY);
    
    if (isDragging) {
      onVolumeChange?.(newVolume);
    }
  }, [isDragging, getVolumeFromPosition, onVolumeChange]);

  const handleSliderMouseMoveLocal = (event: React.MouseEvent) => {
    if (!sliderRef.current) return;
    
    const newVolume = getVolumeFromPosition(event.clientX, event.clientY);
    
    if (!isDragging) {
      setHoverVolume(newVolume);
    }
  };

  const handleSliderMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleSliderMouseLeave = () => {
    if (!isDragging) {
      setHoverVolume(null);
    }
  };

  const handleContainerMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    setShowSlider(true);
  };

  const handleContainerMouseLeave = () => {
    if (!isDragging) {
      hideTimeoutRef.current = setTimeout(() => {
        setShowSlider(false);
      }, 300);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;
    
    let newVolume = volume;
    const volumeStep = 0.1;
    
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowRight':
        event.preventDefault();
        newVolume = Math.min(1, volume + volumeStep);
        break;
      case 'ArrowDown':
      case 'ArrowLeft':
        event.preventDefault();
        newVolume = Math.max(0, volume - volumeStep);
        break;
      case 'Home':
        event.preventDefault();
        newVolume = 1;
        break;
      case 'End':
        event.preventDefault();
        newVolume = 0;
        break;
      case ' ':
      case 'Enter':
        event.preventDefault();
        handleMuteToggle();
        return;
      default:
        return;
    }
    
    onVolumeChange?.(newVolume);
  };

  // Global mouse event handlers for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleSliderMouseMove);
      document.addEventListener('mouseup', handleSliderMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleSliderMouseMove);
        document.removeEventListener('mouseup', handleSliderMouseUp);
      };
    }
  }, [isDragging, handleSliderMouseMove, handleSliderMouseUp]);

  // Hide slider when dragging ends
  useEffect(() => {
    if (!isDragging && !showSlider) {
      setHoverVolume(null);
    }
  }, [isDragging, showSlider]);

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  const volumePercentage = displayVolume * 100;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex items-center",
        className
      )}
      onMouseEnter={handleContainerMouseEnter}
      onMouseLeave={handleContainerMouseLeave}
    >
      {/* Mute/Volume Button */}
      <Button
        variant="ghost"
        size="sm"
        disabled={disabled}
        onClick={handleMuteToggle}
        onKeyDown={handleKeyDown}
        className="text-white hover:bg-white/20 focus:bg-white/20 w-10 h-10"
        aria-label={isMuted ? "Unmute" : "Mute"}
        aria-pressed={isMuted}
      >
        <VolumeIcon className="w-5 h-5" />
      </Button>

      {/* Volume Slider */}
      <div
        className={cn(
          "transition-all duration-200 ease-in-out overflow-hidden",
          orientation === 'horizontal' ? "ml-2" : "mt-2",
          showSlider || isDragging ? "opacity-100 max-w-20" : "opacity-0 max-w-0"
        )}
      >
        <div
          ref={sliderRef}
          className={cn(
            "relative cursor-pointer group",
            orientation === 'horizontal' ? "w-16 h-1" : "w-1 h-16",
            disabled && "cursor-not-allowed opacity-50"
          )}
          onMouseDown={handleSliderMouseDown}
          onMouseMove={handleSliderMouseMoveLocal}
          onMouseLeave={handleSliderMouseLeave}
          tabIndex={disabled ? -1 : 0}
          role="slider"
          aria-label="Volume"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(volume * 100)}
          aria-valuetext={`Volume ${Math.round(volume * 100)}%`}
        >
          {/* Track */}
          <div
            className={cn(
              "bg-white/20 rounded-full",
              orientation === 'horizontal' ? "w-full h-1" : "w-1 h-full"
            )}
          />
          
          {/* Fill */}
          <div
            className={cn(
              "absolute top-0 bg-blue-500 rounded-full transition-all duration-100",
              orientation === 'horizontal' ? "h-1" : "w-1 bottom-0"
            )}
            style={
              orientation === 'horizontal'
                ? { width: `${volumePercentage}%` }
                : { height: `${volumePercentage}%` }
            }
          />
          
          {/* Handle */}
          <div
            className={cn(
              "absolute w-3 h-3 bg-blue-500 rounded-full border-2 border-white",
              "opacity-0 group-hover:opacity-100 transition-all duration-200",
              "shadow-lg",
              isDragging && "scale-125 opacity-100",
              orientation === 'horizontal' 
                ? "top-1/2 -translate-y-1/2" 
                : "left-1/2 -translate-x-1/2"
            )}
            style={
              orientation === 'horizontal'
                ? { left: `${volumePercentage}%`, marginLeft: '-6px' }
                : { bottom: `${volumePercentage}%`, marginBottom: '-6px' }
            }
          />
        </div>
      </div>

      {/* Volume percentage tooltip */}
      {(showSlider || isDragging) && (
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap pointer-events-none">
          {Math.round(displayVolume * 100)}%
        </div>
      )}
    </div>
  );
};
