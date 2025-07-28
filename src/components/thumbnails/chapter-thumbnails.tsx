"use client";
/**
 * Chapter Thumbnails Component
 * Chapter marker thumbnails for video navigation and organization
 */

import React, { useState } from 'react';
import { Play, Clock, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Chapter {
  id: string;
  title: string;
  description?: string;
  startTime: number;
  endTime: number;
  thumbnailUrl?: string;
  tags?: string[];
  isWatched?: boolean;
  progress?: number; // 0-1
}

interface ChapterThumbnailsProps {
  chapters: Chapter[];
  currentTime: number;
  onChapterSelect: (chapterId: string, time: number) => void;
  onChapterEdit?: (chapterId: string) => void;
  layout?: 'grid' | 'list';
  showProgress?: boolean;
  showTags?: boolean;
  className?: string;
}

export const ChapterThumbnails: React.FC<ChapterThumbnailsProps> = ({
  chapters,
  currentTime,
  onChapterSelect,
  onChapterEdit,
  layout = 'grid',
  showProgress = true,
  showTags = true,
  className
}) => {
  const [hoveredChapter, setHoveredChapter] = useState<string | null>(null);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (start: number, end: number) => {
    const duration = end - start;
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getCurrentChapter = () => {
    return chapters.find(chapter => 
      currentTime >= chapter.startTime && currentTime <= chapter.endTime
    );
  };

  const currentChapter = getCurrentChapter();

  if (layout === 'list') {
    return (
      <div className={cn("space-y-2", className)}>
        {chapters.map((chapter) => (
          <Card 
            key={chapter.id}
            className={cn(
              "group cursor-pointer transition-all duration-200 hover:shadow-md",
              currentChapter?.id === chapter.id && "ring-2 ring-primary"
            )}
            onClick={() => onChapterSelect(chapter.id, chapter.startTime)}
            onMouseEnter={() => setHoveredChapter(chapter.id)}
            onMouseLeave={() => setHoveredChapter(null)}
          >
            <CardContent className="p-3">
              <div className="flex space-x-3">
                {/* Thumbnail */}
                <div className="relative w-24 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                  {chapter.thumbnailUrl ? (
                    <img
                      src={chapter.thumbnailUrl}
                      alt={chapter.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <BookOpen className="w-6 h-6" />
                    </div>
                  )}
                  
                  {/* Play overlay */}
                  {hoveredChapter === chapter.id && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                  )}
                  
                  {/* Progress indicator */}
                  {showProgress && chapter.progress !== undefined && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                      <div 
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${chapter.progress * 100}%` }}
                      />
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-sm line-clamp-1">
                      {chapter.title}
                    </h3>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{formatDuration(chapter.startTime, chapter.endTime)}</span>
                    </div>
                  </div>
                  
                  {chapter.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {chapter.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {formatTime(chapter.startTime)}
                    </span>
                    
                    {showTags && chapter.tags && chapter.tags.length > 0 && (
                      <div className="flex space-x-1">
                        {chapter.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                            {tag}
                          </Badge>
                        ))}
                        {chapter.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            +{chapter.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Grid layout
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", className)}>
      {chapters.map((chapter, index) => (
        <Card 
          key={chapter.id}
          className={cn(
            "group cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg",
            currentChapter?.id === chapter.id && "ring-2 ring-primary"
          )}
          onClick={() => onChapterSelect(chapter.id, chapter.startTime)}
          onMouseEnter={() => setHoveredChapter(chapter.id)}
          onMouseLeave={() => setHoveredChapter(null)}
        >
          <CardContent className="p-0">
            {/* Thumbnail */}
            <div className="relative aspect-video bg-gray-800 rounded-t-lg overflow-hidden">
              {chapter.thumbnailUrl ? (
                <img
                  src={chapter.thumbnailUrl}
                  alt={chapter.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <BookOpen className="w-8 h-8" />
                </div>
              )}
              
              {/* Chapter number */}
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                #{index + 1}
              </div>
              
              {/* Duration */}
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{formatDuration(chapter.startTime, chapter.endTime)}</span>
              </div>
              
              {/* Play overlay */}
              {hoveredChapter === chapter.id && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-200">
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-black ml-1" />
                  </div>
                </div>
              )}
              
              {/* Progress indicator */}
              {showProgress && chapter.progress !== undefined && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${chapter.progress * 100}%` }}
                  />
                </div>
              )}
              
              {/* Watched indicator */}
              {chapter.isWatched && (
                <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full" />
              )}
            </div>
            
            {/* Content */}
            <div className="p-3 space-y-2">
              <div className="space-y-1">
                <h3 className="font-medium text-sm line-clamp-2">
                  {chapter.title}
                </h3>
                
                {chapter.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {chapter.description}
                  </p>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {formatTime(chapter.startTime)}
                </span>
                
                {onChapterEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChapterEdit(chapter.id);
                    }}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </Button>
                )}
              </div>
              
              {/* Tags */}
              {showTags && chapter.tags && chapter.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {chapter.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                      {tag}
                    </Badge>
                  ))}
                  {chapter.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      +{chapter.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
