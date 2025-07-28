"use client";
/**
 * Timeline Thumbnails Component
 * Displays thumbnails along the progress bar for visual navigation
 */

import React, { useState, useCallback, useMemo } from 'react';
import { ThumbnailPreview } from './thumbnail-preview';
import { SpriteRenderer } from './sprite-renderer';
import { cn } from '@/lib/utils';

interface TimelineThumbnailsProps {
  videoUrl: string;
  duration: number;
  currentTime: number;
  progressBarRef: React.RefObject<HTMLElement>;
  thumbnailData?: {
    type: 'urls' | 'sprite';
    urls?: string[];
    spriteSheet?: {
      url: string;
      columns: number;
      rows: number;
      thumbnailWidth: number;
      thumbnailHeight: number;
      interval: number;
    };
  };
  isEnabled: boolean;
  className?: string;
}

export const TimelineThumbnails: React.FC<TimelineThumbnailsProps> = ({
  videoUrl,
  duration,
  currentTime,
  progressBarRef,
  thumbnailData,
  isEnabled,
  className
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [hoverTime, setHoverTime] = useState(0);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!progressBarRef.current || !isEnabled) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const time = percentage * duration;

    setHoverPosition({
      x: event.clientX,
      y: rect.top
    });
    setHoverTime(time);
  }, [duration, progressBarRef, isEnabled]);

  const handleMouseEnter = useCallback(() => {
    if (isEnabled) {
      setIsHovering(true);
    }
  }, [isEnabled]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  const thumbnailUrl = useMemo(() => {
    if (!thumbnailData || thumbnailData.type !== 'urls' || !thumbnailData.urls) {
      return undefined;
    }

    const thumbnailIndex = Math.floor((hoverTime / duration) * thumbnailData.urls.length);
    const clampedIndex = Math.max(0, Math.min(thumbnailIndex, thumbnailData.urls.length - 1));
    
    return thumbnailData.urls[clampedIndex];
  }, [hoverTime, duration, thumbnailData]);

  return (
    <div
      className={cn("relative", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Thumbnail Preview */}
      <ThumbnailPreview
        videoUrl={videoUrl}
        currentTime={hoverTime}
        duration={duration}
        isVisible={isHovering && isEnabled}
        position={hoverPosition}
        thumbnailUrl={thumbnailUrl}
        spriteSheet={thumbnailData?.type === 'sprite' ? thumbnailData.spriteSheet : undefined}
      />
    </div>
  );
};

/**
 * Thumbnail Grid Component
 * Displays a grid of thumbnails for chapter or section navigation
 */
interface Chapter {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  thumbnailUrl?: string;
}

interface ThumbnailGridProps {
  chapters: Chapter[];
  currentTime: number;
  onChapterSelect: (chapterId: string, time: number) => void;
  columns?: number;
  className?: string;
}

export const ThumbnailGrid: React.FC<ThumbnailGridProps> = ({
  chapters,
  currentTime,
  onChapterSelect,
  columns = 3,
  className
}) => {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentChapter = () => {
    return chapters.find(chapter => 
      currentTime >= chapter.startTime && currentTime <= chapter.endTime
    );
  };

  const currentChapter = getCurrentChapter();

  return (
    <div 
      className={cn(
        "grid gap-4 p-4",
        `grid-cols-${columns}`,
        className
      )}
    >
      {chapters.map((chapter) => (
        <div
          key={chapter.id}
          className={cn(
            "group cursor-pointer rounded-lg overflow-hidden bg-gray-900 transition-all duration-200 hover:scale-105 hover:shadow-lg",
            currentChapter?.id === chapter.id && "ring-2 ring-blue-500"
          )}
          onClick={() => onChapterSelect(chapter.id, chapter.startTime)}
        >
          {/* Thumbnail */}
          <div className="relative aspect-video bg-gray-800">
            {chapter.thumbnailUrl ? (
              <img
                src={chapter.thumbnailUrl}
                alt={chapter.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-xs">No thumbnail</span>
              </div>
            )}
            
            {/* Play overlay on hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
            
            {/* Duration */}
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
              {formatTime(chapter.endTime - chapter.startTime)}
            </div>
          </div>
          
          {/* Chapter Info */}
          <div className="p-3">
            <h3 className="font-medium text-white text-sm line-clamp-2 mb-1">
              {chapter.title}
            </h3>
            <p className="text-gray-400 text-xs">
              {formatTime(chapter.startTime)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
