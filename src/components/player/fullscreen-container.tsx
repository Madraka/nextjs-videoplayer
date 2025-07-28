"use client";
/**
 * Fullscreen Container Component
 * Handles fullscreen functionality for video player
 */

import React, { forwardRef, useRef, useImperativeHandle, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface FullscreenContainerProps {
  children: React.ReactNode;
  isFullscreen: boolean;
  className?: string;
  onFullscreenChange?: (isFullscreen: boolean) => void;
  onFullscreenError?: (error: Error) => void;
}

export interface FullscreenContainerRef {
  requestFullscreen: () => Promise<void>;
  exitFullscreen: () => Promise<void>;
  toggleFullscreen: () => Promise<void>;
  isFullscreenSupported: () => boolean;
  isFullscreenActive: () => boolean;
  getFullscreenElement: () => Element | null;
}

export const FullscreenContainer = forwardRef<FullscreenContainerRef, FullscreenContainerProps>(({
  children,
  isFullscreen,
  className,
  onFullscreenChange,
  onFullscreenError
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const fullscreenChangeListener = useRef<(() => void) | null>(null);

  // Expose fullscreen methods via ref
  useImperativeHandle(ref, () => ({
    requestFullscreen: async () => {
      if (!containerRef.current) {
        throw new Error('Container not available');
      }

      try {
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else if ((containerRef.current as any).webkitRequestFullscreen) {
          await (containerRef.current as any).webkitRequestFullscreen();
        } else if ((containerRef.current as any).mozRequestFullScreen) {
          await (containerRef.current as any).mozRequestFullScreen();
        } else if ((containerRef.current as any).msRequestFullscreen) {
          await (containerRef.current as any).msRequestFullscreen();
        } else {
          throw new Error('Fullscreen not supported');
        }
      } catch (error) {
        onFullscreenError?.(error as Error);
        throw error;
      }
    },

    exitFullscreen: async () => {
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        } else {
          throw new Error('Exit fullscreen not supported');
        }
      } catch (error) {
        onFullscreenError?.(error as Error);
        throw error;
      }
    },

    toggleFullscreen: async () => {
      if (isFullscreenActive()) {
        await exitFullscreen();
      } else {
        await requestFullscreen();
      }
    },

    isFullscreenSupported: () => {
      return !!(
        document.fullscreenEnabled ||
        (document as any).webkitFullscreenEnabled ||
        (document as any).mozFullScreenEnabled ||
        (document as any).msFullscreenEnabled
      );
    },

    isFullscreenActive: () => {
      return !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
    },

    getFullscreenElement: () => {
      return (
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement ||
        null
      );
    }
  }), [isFullscreen, onFullscreenError]);

  // Get the correct fullscreen API methods
  const requestFullscreen = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      if (containerRef.current.requestFullscreen) {
        await containerRef.current.requestFullscreen();
      } else if ((containerRef.current as any).webkitRequestFullscreen) {
        await (containerRef.current as any).webkitRequestFullscreen();
      } else if ((containerRef.current as any).mozRequestFullScreen) {
        await (containerRef.current as any).mozRequestFullScreen();
      } else if ((containerRef.current as any).msRequestFullscreen) {
        await (containerRef.current as any).msRequestFullscreen();
      }
    } catch (error) {
      onFullscreenError?.(error as Error);
    }
  }, [onFullscreenError]);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        await (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen();
      }
    } catch (error) {
      onFullscreenError?.(error as Error);
    }
  }, [onFullscreenError]);

  const isFullscreenActive = useCallback(() => {
    return !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement
    );
  }, []);

  // Handle fullscreen change events
  const handleFullscreenChange = useCallback(() => {
    const isActive = isFullscreenActive();
    const isOurElement = containerRef.current && (
      document.fullscreenElement === containerRef.current ||
      (document as any).webkitFullscreenElement === containerRef.current ||
      (document as any).mozFullScreenElement === containerRef.current ||
      (document as any).msFullscreenElement === containerRef.current
    );

    // Only trigger callback if this is our container
    if (isOurElement || !isActive) {
      onFullscreenChange?.(isActive);
    }
  }, [onFullscreenChange]);

  // Set up fullscreen event listeners
  useEffect(() => {
    const events = [
      'fullscreenchange',
      'webkitfullscreenchange',
      'mozfullscreenchange',
      'msfullscreenchange'
    ];

    events.forEach(event => {
      document.addEventListener(event, handleFullscreenChange);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleFullscreenChange);
      });
    };
  }, [handleFullscreenChange]);

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreenActive()) {
        exitFullscreen();
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen, exitFullscreen]);

  // Sync external fullscreen state
  useEffect(() => {
    const isActive = isFullscreenActive();
    if (isFullscreen && !isActive) {
      requestFullscreen();
    } else if (!isFullscreen && isActive) {
      exitFullscreen();
    }
  }, [isFullscreen, requestFullscreen, exitFullscreen]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative",
        isFullscreen && [
          "fixed inset-0 z-[9999]",
          "bg-black",
          "flex items-center justify-center"
        ],
        className
      )}
      style={isFullscreen ? {
        width: '100vw',
        height: '100vh'
      } : undefined}
    >
      {children}
    </div>
  );
});
