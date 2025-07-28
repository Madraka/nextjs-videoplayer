/**
 * Picture-in-Picture Hook
 * Manages Picture-in-Picture API for video elements
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface UsePictureInPictureProps {
  videoElement?: HTMLVideoElement | null;
  onEnter?: () => void;
  onExit?: () => void;
  onResize?: (width: number, height: number) => void;
  onError?: (error: Error) => void;
}

interface UsePictureInPictureReturn {
  isPiP: boolean;
  isSupported: boolean;
  enter: () => Promise<void>;
  exit: () => Promise<void>;
  toggle: () => Promise<void>;
  error: Error | null;
}

export function usePictureInPicture({
  videoElement,
  onEnter,
  onExit,
  onResize,
  onError
}: UsePictureInPictureProps = {}): UsePictureInPictureReturn {
  const [isPiP, setIsPiP] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Check if PiP is supported
  const isSupported = !!(
    document.pictureInPictureEnabled &&
    HTMLVideoElement.prototype.requestPictureInPicture
  );

  // Enter Picture-in-Picture mode
  const enter = useCallback(async (): Promise<void> => {
    if (!isSupported) {
      const error = new Error('Picture-in-Picture not supported');
      setError(error);
      onError?.(error);
      return;
    }

    const video = videoRef.current;
    if (!video) {
      const error = new Error('No video element available');
      setError(error);
      onError?.(error);
      return;
    }

    if (video.readyState === 0) {
      const error = new Error('Video not loaded');
      setError(error);
      onError?.(error);
      return;
    }

    if (document.pictureInPictureElement) {
      const error = new Error('Another element is already in Picture-in-Picture mode');
      setError(error);
      onError?.(error);
      return;
    }

    try {
      setError(null);
      await video.requestPictureInPicture();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to enter Picture-in-Picture');
      setError(error);
      onError?.(error);
      throw error;
    }
  }, [isSupported, onError]);

  // Exit Picture-in-Picture mode
  const exit = useCallback(async (): Promise<void> => {
    if (!isSupported) {
      const error = new Error('Picture-in-Picture not supported');
      setError(error);
      onError?.(error);
      return;
    }

    if (!document.pictureInPictureElement) {
      return; // Already not in PiP
    }

    try {
      setError(null);
      await document.exitPictureInPicture();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to exit Picture-in-Picture');
      setError(error);
      onError?.(error);
      throw error;
    }
  }, [isSupported, onError]);

  // Toggle Picture-in-Picture mode
  const toggle = useCallback(async (): Promise<void> => {
    if (isPiP) {
      await exit();
    } else {
      await enter();
    }
  }, [isPiP, enter, exit]);

  // Handle PiP enter event
  const handleEnterPiP = useCallback((event: Event) => {
    setIsPiP(true);
    onEnter?.();

    // Set up resize listener for PiP window
    const pipWindow = (event.target as HTMLVideoElement).getScreenDetails?.();
    if (pipWindow && onResize) {
      const handleResize = () => {
        onResize(pipWindow.width, pipWindow.height);
      };
      pipWindow.addEventListener('resize', handleResize);
    }
  }, [onEnter, onResize]);

  // Handle PiP exit event
  const handleExitPiP = useCallback(() => {
    setIsPiP(false);
    onExit?.();
  }, [onExit]);

  // Update video element reference
  useEffect(() => {
    videoRef.current = videoElement || null;
  }, [videoElement]);

  // Set up event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isSupported) return;

    // Add PiP event listeners
    video.addEventListener('enterpictureinpicture', handleEnterPiP);
    video.addEventListener('leavepictureinpicture', handleExitPiP);

    // Check initial state
    setIsPiP(document.pictureInPictureElement === video);

    // Cleanup
    return () => {
      video.removeEventListener('enterpictureinpicture', handleEnterPiP);
      video.removeEventListener('leavepictureinpicture', handleExitPiP);
    };
  }, [videoElement, isSupported, handleEnterPiP, handleExitPiP]);

  return {
    isPiP,
    isSupported,
    enter,
    exit,
    toggle,
    error
  };
}
