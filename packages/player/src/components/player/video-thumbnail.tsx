/**
 * Video thumbnail preview component for mobile and desktop
 * Shows thumbnail images on progress bar hover/touch
 */

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface VideoThumbnailProps {
  /** Current video duration in seconds */
  duration: number;
  /** Current time position for thumbnail */
  currentTime: number;
  /** Base URL for thumbnail images */
  thumbnailUrl?: string;
  /** Number of thumbnails per sprite sheet (optional) */
  thumbnailCount?: number;
  /** Thumbnail dimensions */
  thumbnailSize?: {
    width: number;
    height: number;
  };
  /** CSS classes */
  className?: string;
  /** Show time overlay */
  showTime?: boolean;
  /** Mobile optimized */
  isMobile?: boolean;
}

// Format time in MM:SS format
const formatTime = (seconds: number): string => {
  if (!isFinite(seconds)) return '0:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  duration,
  currentTime,
  thumbnailUrl,
  thumbnailCount = 100,
  thumbnailSize = { width: 160, height: 90 },
  className,
  showTime = true,
  isMobile = false,
}) => {
  const [thumbnailSrc, setThumbnailSrc] = useState<string>('');
  const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate thumbnail URL based on time
  useEffect(() => {
    if (!thumbnailUrl || !duration) return;

    // Calculate thumbnail index based on current time
    const progress = Math.max(0, Math.min(1, currentTime / duration));
    const thumbnailIndex = Math.floor(progress * (thumbnailCount - 1));
    
    // If using sprite sheets, calculate position
    if (thumbnailUrl.includes('sprite')) {
      const spriteCols = 10; // Assuming 10x10 grid
      const spriteRows = Math.ceil(thumbnailCount / spriteCols);
      
      const col = thumbnailIndex % spriteCols;
      const row = Math.floor(thumbnailIndex / spriteCols);
      
      setSpritePosition({
        x: col * thumbnailSize.width,
        y: row * thumbnailSize.height
      });
      
      setThumbnailSrc(thumbnailUrl);
    } else {
      // Individual thumbnail files
      const paddedIndex = thumbnailIndex.toString().padStart(3, '0');
      setThumbnailSrc(`${thumbnailUrl}/thumb_${paddedIndex}.jpg`);
    }
  }, [currentTime, duration, thumbnailUrl, thumbnailCount, thumbnailSize]);

  // Generate fallback thumbnail from video frame
  const generateFallbackThumbnail = async (videoSrc: string, time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.muted = true;
    
    return new Promise<string>((resolve) => {
      video.onloadeddata = () => {
        video.currentTime = time;
      };
      
      video.onseeked = () => {
        canvas.width = thumbnailSize.width;
        canvas.height = thumbnailSize.height;
        
        ctx.drawImage(video, 0, 0, thumbnailSize.width, thumbnailSize.height);
        const dataURL = canvas.toDataURL('image/jpeg', 0.8);
        resolve(dataURL);
      };
      
      video.src = videoSrc;
    });
  };

  if (!thumbnailSrc && !thumbnailUrl) {
    return null;
  }

  return (
    <div
      className={cn(
        'absolute bottom-6 transform -translate-x-1/2 pointer-events-none z-20',
        'bg-black/90 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-white/20',
        isMobile ? 'bottom-12' : 'bottom-6',
        className
      )}
      style={{ 
        width: thumbnailSize.width + 16, 
        height: thumbnailSize.height + (showTime ? 40 : 16)
      }}
    >
      {/* Thumbnail Image */}
      <div 
        className="relative bg-gray-800"
        style={{ 
          width: thumbnailSize.width, 
          height: thumbnailSize.height,
          margin: '8px 8px 0 8px'
        }}
      >
        {thumbnailSrc ? (
          <img
            src={thumbnailSrc}
            alt={`Preview at ${formatTime(currentTime)}`}
            className="w-full h-full object-cover rounded"
            style={
              thumbnailUrl?.includes('sprite') ? {
                objectPosition: `-${spritePosition.x}px -${spritePosition.y}px`,
                width: thumbnailSize.width * 10, // Sprite sheet width
                height: thumbnailSize.height * 10, // Sprite sheet height
              } : undefined
            }
            onError={() => {
              // Fallback to placeholder or generated thumbnail
              setThumbnailSrc(`/api/placeholder/${thumbnailSize.width}/${thumbnailSize.height}`);
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center rounded">
            <div className="text-white/60 text-xs">Loading...</div>
          </div>
        )}
        
        {/* Loading overlay */}
        <div className="absolute inset-0 bg-black/20 rounded" />
      </div>

      {/* Time Display */}
      {showTime && (
        <div className="px-3 py-2 text-center">
          <span className="text-white text-sm font-medium">
            {formatTime(currentTime)}
          </span>
        </div>
      )}

      {/* Pointer arrow */}
      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
        <div className="w-3 h-3 bg-black/90 rotate-45 border-r border-b border-white/20" />
      </div>

      {/* Hidden canvas for fallback thumbnail generation */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default VideoThumbnail;
