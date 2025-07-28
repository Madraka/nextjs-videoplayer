"use client";
/**
 * Sprite Renderer Component
 * Handles rendering of thumbnail sprite sheets efficiently
 */

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface SpriteSheet {
  url: string;
  columns: number;
  rows: number;
  thumbnailWidth: number;
  thumbnailHeight: number;
  totalFrames: number;
  duration: number; // Total video duration
}

interface SpriteRendererProps {
  spriteSheet: SpriteSheet;
  timePosition: number; // Time position to show (0-1)
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const SpriteRenderer: React.FC<SpriteRendererProps> = ({
  spriteSheet,
  timePosition,
  className,
  onLoad,
  onError
}) => {
  const spritePosition = useMemo(() => {
    // Calculate which frame to show based on time position
    const frameIndex = Math.floor(timePosition * (spriteSheet.totalFrames - 1));
    const clampedIndex = Math.max(0, Math.min(frameIndex, spriteSheet.totalFrames - 1));
    
    // Calculate row and column
    const row = Math.floor(clampedIndex / spriteSheet.columns);
    const col = clampedIndex % spriteSheet.columns;
    
    // Calculate background position
    const bgX = -(col * spriteSheet.thumbnailWidth);
    const bgY = -(row * spriteSheet.thumbnailHeight);
    
    return {
      backgroundImage: `url(${spriteSheet.url})`,
      backgroundPosition: `${bgX}px ${bgY}px`,
      backgroundSize: `${spriteSheet.columns * spriteSheet.thumbnailWidth}px ${spriteSheet.rows * spriteSheet.thumbnailHeight}px`,
      backgroundRepeat: 'no-repeat',
    };
  }, [spriteSheet, timePosition]);

  return (
    <div
      className={cn(
        "bg-no-repeat bg-center",
        className
      )}
      style={{
        width: spriteSheet.thumbnailWidth,
        height: spriteSheet.thumbnailHeight,
        ...spritePosition,
      }}
      onLoad={onLoad}
      onError={onError}
    />
  );
};

/**
 * Sprite Sheet Loader Hook
 * Manages loading and caching of sprite sheet images
 */
export const useSpriteSheetLoader = (spriteSheet: SpriteSheet) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isCancelled = false;
    
    const loadSprite = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const img = new Image();
        
        img.onload = () => {
          if (!isCancelled) {
            setIsLoaded(true);
            setIsLoading(false);
          }
        };
        
        img.onerror = () => {
          if (!isCancelled) {
            setError('Failed to load sprite sheet');
            setIsLoading(false);
          }
        };
        
        img.src = spriteSheet.url;
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          setIsLoading(false);
        }
      }
    };

    loadSprite();

    return () => {
      isCancelled = true;
    };
  }, [spriteSheet.url]);

  return { isLoaded, isLoading, error };
};

/**
 * Sprite Sheet Generator Utility
 * Utilities for generating sprite sheets from video
 */
export const generateSpriteSheet = async (
  videoElement: HTMLVideoElement,
  options: {
    columns: number;
    rows: number;
    thumbnailWidth: number;
    thumbnailHeight: number;
    quality?: number;
  }
): Promise<string> => {
  const { columns, rows, thumbnailWidth, thumbnailHeight, quality = 0.8 } = options;
  const totalFrames = columns * rows;
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }
  
  // Set canvas size to accommodate all thumbnails
  canvas.width = columns * thumbnailWidth;
  canvas.height = rows * thumbnailHeight;
  
  const duration = videoElement.duration;
  const timeStep = duration / totalFrames;
  
  return new Promise((resolve, reject) => {
    let frameCount = 0;
    
    const captureFrame = () => {
      if (frameCount >= totalFrames) {
        // All frames captured, return the sprite sheet as data URL
        resolve(canvas.toDataURL('image/jpeg', quality));
        return;
      }
      
      const currentTime = frameCount * timeStep;
      const row = Math.floor(frameCount / columns);
      const col = frameCount % columns;
      
      videoElement.currentTime = currentTime;
      
      videoElement.onseeked = () => {
        // Draw the current frame to the canvas
        ctx.drawImage(
          videoElement,
          col * thumbnailWidth,
          row * thumbnailHeight,
          thumbnailWidth,
          thumbnailHeight
        );
        
        frameCount++;
        setTimeout(captureFrame, 100); // Small delay between captures
      };
      
      videoElement.onerror = () => {
        reject(new Error('Video error during sprite generation'));
      };
    };
    
    captureFrame();
  });
};
