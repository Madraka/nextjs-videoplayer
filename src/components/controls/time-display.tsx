/**
 * Time Display Component
 * Shows current time and duration of video
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface TimeDisplayProps {
  currentTime: number;
  duration: number;
  showDuration?: boolean;
  compact?: boolean;
  separator?: string;
  className?: string;
}

export const TimeDisplay: React.FC<TimeDisplayProps> = ({
  currentTime,
  duration,
  showDuration = true,
  compact = false,
  separator = ' / ',
  className
}) => {
  const formatTime = (time: number) => {
    if (!isFinite(time) || time < 0) return '0:00';
    
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (compact && hours === 0 && Math.floor(duration / 3600) === 0) {
      // Show only minutes:seconds if video is less than an hour
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    if (hours > 0 || Math.floor(duration / 3600) > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatTimeRemaining = (current: number, total: number) => {
    const remaining = total - current;
    return `-${formatTime(remaining)}`;
  };

  const currentTimeFormatted = formatTime(currentTime);
  const durationFormatted = formatTime(duration);
  const remainingTimeFormatted = formatTimeRemaining(currentTime, duration);

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={cn(
        "flex items-center text-white font-mono text-sm",
        "select-none whitespace-nowrap",
        className
      )}
      role="timer"
      aria-live="polite"
      aria-label={`Current time: ${currentTimeFormatted}${showDuration ? `, Duration: ${durationFormatted}` : ''}`}
    >
      {/* Current Time */}
      <span 
        className="tabular-nums"
        aria-label={`Current time: ${currentTimeFormatted}`}
      >
        {currentTimeFormatted}
      </span>

      {/* Duration */}
      {showDuration && duration > 0 && (
        <>
          <span className="opacity-60 mx-1" aria-hidden="true">
            {separator}
          </span>
          <span 
            className="tabular-nums opacity-80"
            aria-label={`Duration: ${durationFormatted}`}
          >
            {durationFormatted}
          </span>
        </>
      )}

      {/* Progress indicator (compact mode) */}
      {compact && duration > 0 && (
        <div className="ml-2 flex items-center">
          <div className="w-12 h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-200"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Screen reader only - remaining time */}
      <span className="sr-only">
        {duration > 0 && `Time remaining: ${remainingTimeFormatted}`}
      </span>
    </div>
  );
};
