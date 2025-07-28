/**
 * Center Overlay Component
 * Large play button displayed in the center of the player
 */

import React from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CenterOverlayProps {
  isPlaying: boolean;
  isVisible: boolean;
  onPlayPause: () => void;
  className?: string;
}

export const CenterOverlay: React.FC<CenterOverlayProps> = ({
  isPlaying,
  isVisible,
  onPlayPause,
  className
}) => {
  if (!isVisible) return null;

  return (
    <div 
      className={cn(
        "absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm transition-opacity duration-300",
        className
      )}
      onClick={onPlayPause}
    >
      <Button
        variant="secondary"
        size="icon"
        className="h-16 w-16 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all duration-200 hover:scale-105"
        onClick={(e) => {
          e.stopPropagation();
          onPlayPause();
        }}
      >
        {isPlaying ? (
          <Pause className="h-8 w-8 text-black" />
        ) : (
          <Play className="h-8 w-8 text-black ml-1" />
        )}
      </Button>
    </div>
  );
};
