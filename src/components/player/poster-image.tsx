"use client";
/**
 * Poster Image Component
 * Displays video poster/thumbnail with play overlay
 */

import React, { useState, useCallback } from 'react';
import { Play, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PosterImageProps {
  src: string;
  alt?: string;
  className?: string;
  showPlayButton?: boolean;
  blurDataURL?: string;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: () => void;
}

export const PosterImage: React.FC<PosterImageProps> = ({
  src,
  alt = "Video poster",
  className,
  showPlayButton = true,
  blurDataURL,
  onClick,
  onLoad,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  }, [onError]);

  const handleClick = useCallback(() => {
    if (!hasError) {
      onClick?.();
    }
  }, [hasError, onClick]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <div
      className={cn(
        "relative w-full h-full bg-gray-900 overflow-hidden",
        "flex items-center justify-center",
        onClick && !hasError && "cursor-pointer",
        className
      )}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background blur for loading state */}
      {blurDataURL && isLoading && (
        <img
          src={blurDataURL}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110"
          aria-hidden="true"
        />
      )}

      {/* Main poster image */}
      {!hasError && (
        <img
          src={src}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-all duration-300",
            isLoading && "opacity-0",
            !isLoading && "opacity-100",
            isHovered && showPlayButton && "scale-105"
          )}
          onLoad={handleLoad}
          onError={handleError}
          draggable={false}
        />
      )}

      {/* Error state */}
      {hasError && (
        <div className="flex flex-col items-center justify-center text-gray-400 p-8">
          <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
          <p className="text-sm text-center">
            Unable to load poster image
          </p>
        </div>
      )}

      {/* Loading state */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Play button overlay */}
      {showPlayButton && !isLoading && !hasError && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            "bg-black/30 transition-all duration-300",
            isHovered ? "bg-black/50" : "bg-black/20"
          )}
        >
          <div
            className={cn(
              "flex items-center justify-center",
              "bg-black/60 backdrop-blur-sm rounded-full",
              "transition-all duration-300",
              "border-2 border-white/20",
              isHovered ? "scale-110 bg-black/80" : "scale-100"
            )}
            style={{
              width: '80px',
              height: '80px'
            }}
          >
            <Play
              className={cn(
                "text-white transition-all duration-300",
                "drop-shadow-lg",
                isHovered ? "w-8 h-8" : "w-7 h-7"
              )}
              fill="currentColor"
              style={{
                marginLeft: '4px' // Optical alignment for play icon
              }}
            />
          </div>
        </div>
      )}

      {/* Gradient overlay for better text readability */}
      {!hasError && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      )}

      {/* Accessibility */}
      {onClick && !hasError && (
        <div className="sr-only">
          Click to play video
        </div>
      )}
    </div>
  );
};
