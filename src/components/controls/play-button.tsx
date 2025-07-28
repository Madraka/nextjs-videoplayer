/**
 * Play Button Component
 * Play/pause toggle button for video player
 */

import React from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PlayButtonProps {
  isPlaying: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
  showLabel?: boolean;
  className?: string;
  onClick?: () => void;
}

export const PlayButton: React.FC<PlayButtonProps> = ({
  isPlaying,
  disabled = false,
  size = 'md',
  variant = 'ghost',
  showLabel = false,
  className,
  onClick
}) => {
  const sizeConfig = {
    sm: { button: 'w-8 h-8', icon: 'w-4 h-4' },
    md: { button: 'w-10 h-10', icon: 'w-5 h-5' },
    lg: { button: 'w-12 h-12', icon: 'w-6 h-6' }
  };

  const handleClick = () => {
    if (!disabled) {
      onClick?.();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <Button
      variant={variant}
      size="sm"
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "text-white hover:bg-white/20 focus:bg-white/20",
        "transition-all duration-200",
        sizeConfig[size].button,
        showLabel && "space-x-2",
        className
      )}
      aria-label={isPlaying ? "Pause video" : "Play video"}
      aria-pressed={isPlaying}
    >
      {isPlaying ? (
        <>
          <Pause 
            className={cn(sizeConfig[size].icon)} 
            fill="currentColor"
          />
          {showLabel && <span className="hidden sm:inline">Pause</span>}
        </>
      ) : (
        <>
          <Play 
            className={cn(
              sizeConfig[size].icon,
              "ml-0.5" // Optical alignment for play icon
            )} 
            fill="currentColor"
          />
          {showLabel && <span className="hidden sm:inline">Play</span>}
        </>
      )}
    </Button>
  );
};
