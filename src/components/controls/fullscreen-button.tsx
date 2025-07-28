/**
 * Fullscreen Button Component
 * Toggle fullscreen mode for video player
 */

import React from 'react';
import { Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FullscreenButtonProps {
  isFullscreen: boolean;
  disabled?: boolean;
  showLabel?: boolean;
  className?: string;
  onToggle?: () => void;
}

export const FullscreenButton: React.FC<FullscreenButtonProps> = ({
  isFullscreen,
  disabled = false,
  showLabel = false,
  className,
  onToggle
}) => {
  const handleClick = () => {
    if (!disabled) {
      onToggle?.();
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
      variant="ghost"
      size="sm"
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "text-white hover:bg-white/20 focus:bg-white/20",
        "w-10 h-10 flex items-center justify-center",
        showLabel && "space-x-2",
        className
      )}
      aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      aria-pressed={isFullscreen}
      title={isFullscreen ? "Exit fullscreen (Escape)" : "Enter fullscreen (F)"}
    >
      {isFullscreen ? (
        <>
          <Minimize className="w-5 h-5" />
          {showLabel && <span className="hidden sm:inline">Exit Fullscreen</span>}
        </>
      ) : (
        <>
          <Maximize className="w-5 h-5" />
          {showLabel && <span className="hidden sm:inline">Fullscreen</span>}
        </>
      )}
    </Button>
  );
};
