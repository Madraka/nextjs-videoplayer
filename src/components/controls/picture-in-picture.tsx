"use client";
/**
 * Picture-in-Picture Button Component
 * Toggle picture-in-picture mode for video player
 */

import React, { useState, useEffect } from 'react';
import { PictureInPicture2, MonitorX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PictureInPictureProps {
  disabled?: boolean;
  showLabel?: boolean;
  className?: string;
  onToggle?: () => void;
  onEnter?: () => void;
  onExit?: () => void;
}

export const PictureInPicture: React.FC<PictureInPictureProps> = ({
  disabled = false,
  showLabel = false,
  className,
  onToggle,
  onEnter,
  onExit
}) => {
  const [isPipActive, setIsPipActive] = useState(false);
  const [isPipSupported, setIsPipSupported] = useState(false);

  // Check if Picture-in-Picture is supported
  useEffect(() => {
    const checkPipSupport = () => {
      setIsPipSupported(
        'pictureInPictureEnabled' in document &&
        document.pictureInPictureEnabled !== false
      );
    };

    checkPipSupport();
  }, []);

  // Listen for Picture-in-Picture events
  useEffect(() => {
    const handleEnterPip = () => {
      setIsPipActive(true);
      onEnter?.();
    };

    const handleExitPip = () => {
      setIsPipActive(false);
      onExit?.();
    };

    document.addEventListener('enterpictureinpicture', handleEnterPip);
    document.addEventListener('leavepictureinpicture', handleExitPip);

    // Check initial state
    setIsPipActive(!!document.pictureInPictureElement);

    return () => {
      document.removeEventListener('enterpictureinpicture', handleEnterPip);
      document.removeEventListener('leavepictureinpicture', handleExitPip);
    };
  }, [onEnter, onExit]);

  const handleClick = async () => {
    if (!isPipSupported || disabled) return;

    try {
      if (isPipActive) {
        // Exit Picture-in-Picture
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        }
      } else {
        // Enter Picture-in-Picture
        onToggle?.();
      }
    } catch (error) {
      console.error('Picture-in-Picture error:', error);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  // Don't render if not supported
  if (!isPipSupported) {
    return null;
  }

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
      aria-label={isPipActive ? "Exit picture-in-picture" : "Enter picture-in-picture"}
      aria-pressed={isPipActive}
      title={isPipActive ? "Exit picture-in-picture" : "Picture-in-picture (P)"}
    >
      {isPipActive ? (
        <>
          <MonitorX className="w-5 h-5" />
          {showLabel && <span className="hidden sm:inline">Exit PiP</span>}
        </>
      ) : (
        <>
          <PictureInPicture2 className="w-5 h-5" />
          {showLabel && <span className="hidden sm:inline">Picture-in-Picture</span>}
        </>
      )}
    </Button>
  );
};
