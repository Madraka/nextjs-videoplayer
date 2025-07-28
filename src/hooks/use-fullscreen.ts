/**
 * Fullscreen Management Hook
 * Handles fullscreen API with cross-browser compatibility
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseFullscreenProps {
  element?: HTMLElement | null;
  onEnter?: () => void;
  onExit?: () => void;
  onError?: (error: Error) => void;
}

interface UseFullscreenReturn {
  isFullscreen: boolean;
  isSupported: boolean;
  enter: () => Promise<void>;
  exit: () => Promise<void>;
  toggle: () => Promise<void>;
  error: Error | null;
}

export function useFullscreen({
  element,
  onEnter,
  onExit,
  onError
}: UseFullscreenProps = {}): UseFullscreenReturn {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  // Check if fullscreen API is supported
  const isSupported = !!(
    document.fullscreenEnabled ||
    (document as any).webkitFullscreenEnabled ||
    (document as any).mozFullScreenEnabled ||
    (document as any).msFullscreenEnabled
  );

  // Get current fullscreen element
  const getFullscreenElement = useCallback((): Element | null => {
    return (
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement ||
      null
    );
  }, []);

  // Request fullscreen with cross-browser support
  const requestFullscreen = useCallback(async (targetElement: HTMLElement): Promise<void> => {
    try {
      if (targetElement.requestFullscreen) {
        await targetElement.requestFullscreen();
      } else if ((targetElement as any).webkitRequestFullscreen) {
        await (targetElement as any).webkitRequestFullscreen();
      } else if ((targetElement as any).webkitRequestFullScreen) {
        await (targetElement as any).webkitRequestFullScreen();
      } else if ((targetElement as any).mozRequestFullScreen) {
        await (targetElement as any).mozRequestFullScreen();
      } else if ((targetElement as any).msRequestFullscreen) {
        await (targetElement as any).msRequestFullscreen();
      } else {
        throw new Error('Fullscreen API not supported');
      }
    } catch (err) {
      throw new Error(`Failed to enter fullscreen: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, []);

  // Exit fullscreen with cross-browser support
  const exitFullscreen = useCallback(async (): Promise<void> => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      } else if ((document as any).webkitCancelFullScreen) {
        await (document as any).webkitCancelFullScreen();
      } else if ((document as any).mozCancelFullScreen) {
        await (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen();
      } else {
        throw new Error('Exit fullscreen API not supported');
      }
    } catch (err) {
      throw new Error(`Failed to exit fullscreen: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, []);

  // Enter fullscreen
  const enter = useCallback(async (): Promise<void> => {
    if (!isSupported) {
      const error = new Error('Fullscreen not supported');
      setError(error);
      onError?.(error);
      return;
    }

    const targetElement = elementRef.current || document.documentElement;
    
    try {
      setError(null);
      await requestFullscreen(targetElement);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to enter fullscreen');
      setError(error);
      onError?.(error);
      throw error;
    }
  }, [isSupported, requestFullscreen, onError]);

  // Exit fullscreen
  const exit = useCallback(async (): Promise<void> => {
    if (!isSupported) {
      const error = new Error('Fullscreen not supported');
      setError(error);
      onError?.(error);
      return;
    }

    if (!isFullscreen) {
      return; // Already not in fullscreen
    }

    try {
      setError(null);
      await exitFullscreen();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to exit fullscreen');
      setError(error);
      onError?.(error);
      throw error;
    }
  }, [isSupported, isFullscreen, exitFullscreen, onError]);

  // Toggle fullscreen
  const toggle = useCallback(async (): Promise<void> => {
    if (isFullscreen) {
      await exit();
    } else {
      await enter();
    }
  }, [isFullscreen, enter, exit]);

  // Handle fullscreen change events
  const handleFullscreenChange = useCallback(() => {
    const fullscreenElement = getFullscreenElement();
    const wasFullscreen = isFullscreen;
    const nowFullscreen = !!fullscreenElement;

    setIsFullscreen(nowFullscreen);

    // Call appropriate callback
    if (!wasFullscreen && nowFullscreen) {
      onEnter?.();
    } else if (wasFullscreen && !nowFullscreen) {
      onExit?.();
    }
  }, [isFullscreen, getFullscreenElement, onEnter, onExit]);

  // Handle fullscreen error events
  const handleFullscreenError = useCallback((event: Event) => {
    const error = new Error('Fullscreen change failed');
    setError(error);
    onError?.(error);
  }, [onError]);

  // Update element reference
  useEffect(() => {
    elementRef.current = element;
  }, [element]);

  // Set up event listeners
  useEffect(() => {
    if (!isSupported) return;

    // Fullscreen change events (cross-browser)
    const changeEvents = [
      'fullscreenchange',
      'webkitfullscreenchange',
      'mozfullscreenchange',
      'MSFullscreenChange'
    ];

    // Fullscreen error events (cross-browser)
    const errorEvents = [
      'fullscreenerror',
      'webkitfullscreenerror',
      'mozfullscreenerror',
      'MSFullscreenError'
    ];

    // Add event listeners
    changeEvents.forEach(event => {
      document.addEventListener(event, handleFullscreenChange);
    });

    errorEvents.forEach(event => {
      document.addEventListener(event, handleFullscreenError);
    });

    // Initial state check
    handleFullscreenChange();

    // Cleanup
    return () => {
      changeEvents.forEach(event => {
        document.removeEventListener(event, handleFullscreenChange);
      });

      errorEvents.forEach(event => {
        document.removeEventListener(event, handleFullscreenError);
      });
    };
  }, [isSupported, handleFullscreenChange, handleFullscreenError]);

  return {
    isFullscreen,
    isSupported,
    enter,
    exit,
    toggle,
    error
  };
}
