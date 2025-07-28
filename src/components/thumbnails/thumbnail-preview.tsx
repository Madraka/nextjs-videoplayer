"use client";
/**
 * Thumbnail Preview Component
 * Hover preview thumbnails that appear on progress bar hover
 */

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ThumbnailPreviewProps {
  videoUrl: string;
  currentTime: number;
  duration: number;
  isVisible: boolean;
  position: { x: number; y: number };
  thumbnailUrl?: string;
  spriteSheet?: {
    url: string;
    columns: number;
    rows: number;
    thumbnailWidth: number;
    thumbnailHeight: number;
    interval: number;
  };
  className?: string;
}

export const ThumbnailPreview: React.FC<ThumbnailPreviewProps> = ({
  videoUrl,
  currentTime,
  duration,
  isVisible,
  position,
  thumbnailUrl,
  spriteSheet,
  className
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [currentTime, thumbnailUrl]);

  if (!isVisible) return null;

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getSpritePosition = () => {
    if (!spriteSheet) return {};
    
    const frameIndex = Math.floor(currentTime / spriteSheet.interval);
    const row = Math.floor(frameIndex / spriteSheet.columns);
    const col = frameIndex % spriteSheet.columns;
    
    return {
      backgroundImage: `url(${spriteSheet.url})`,
      backgroundPosition: `-${col * spriteSheet.thumbnailWidth}px -${row * spriteSheet.thumbnailHeight}px`,
      backgroundSize: `${spriteSheet.columns * spriteSheet.thumbnailWidth}px ${spriteSheet.rows * spriteSheet.thumbnailHeight}px`,
      width: spriteSheet.thumbnailWidth,
      height: spriteSheet.thumbnailHeight,
    };
  };

  return (
    <div
      className={cn(
        "fixed z-[9999] pointer-events-none -translate-x-1/2 transition-all duration-150",
        className
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y - 128}px`, // Daha fazla yukarıda (h-32 = 128px)
      }}
    >
      <div className="bg-black/95 rounded-lg shadow-2xl overflow-hidden border border-white/40 backdrop-blur-sm">
        {/* Thumbnail Image */}
        <div className="relative bg-gray-900">
          {spriteSheet ? (
            <div
              className="bg-no-repeat"
              style={getSpritePosition()}
            />
          ) : thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={`Thumbnail at ${formatTime(currentTime)}`}
              className={cn(
                "w-40 h-24 object-cover transition-opacity duration-200",
                imageLoaded ? 'opacity-100' : 'opacity-0'
              )}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            // Fallback placeholder thumbnail
            <div className="w-40 h-24 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {formatTime(currentTime)}
              </span>
            </div>
          )}
          {/* Loading state */}
          {!imageLoaded && !imageError && thumbnailUrl && (
            <div className="absolute inset-0 bg-gray-800 animate-pulse" />
          )}
          {/* Error state */}
          {imageError && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <span className="text-gray-400 text-xs">Failed to load</span>
            </div>
          )}
        </div>
        {/* Time Display */}
        <div className="px-2 py-1 bg-black text-white text-xs text-center">
          {formatTime(currentTime)}
        </div>
      </div>
      {/* Tooltip arrow */}
      <div className="absolute left-1/2 -translate-x-1/2 top-full">
        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black" />
      </div>
    </div>
  );
};
