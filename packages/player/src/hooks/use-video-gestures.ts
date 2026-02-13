/**
 * Touch and gesture handling hook for mobile video player
 * Supports tap to play/pause, double tap to seek, swipe gestures
 */

import { useCallback, useRef, useState, useEffect } from 'react';

export interface GestureConfig {
  enableTapToPlay?: boolean;
  enableDoubleTapSeek?: boolean;
  enableSwipeVolume?: boolean;
  enableSwipeBrightness?: boolean;
  seekAmount?: number; // seconds to seek on double tap
  volumeSensitivity?: number;
  brightnessSensitivity?: number;
}

export interface GestureCallbacks {
  onTap?: () => void;
  onDoubleTap?: (direction: 'left' | 'right') => void;
  onSwipeVolume?: (delta: number) => void;
  onSwipeBrightness?: (delta: number) => void;
  onPinchZoom?: (scale: number) => void;
}

interface TouchState {
  startX: number;
  startY: number;
  startTime: number;
  lastTapTime: number;
  tapCount: number;
  isActive: boolean;
}

const DEFAULT_CONFIG: Required<GestureConfig> = {
  enableTapToPlay: true,
  enableDoubleTapSeek: true,
  enableSwipeVolume: true,
  enableSwipeBrightness: false,
  seekAmount: 10,
  volumeSensitivity: 0.02,
  brightnessSensitivity: 0.02,
};

export const useVideoGestures = (
  elementRef: React.RefObject<HTMLElement | null>,
  callbacks: GestureCallbacks,
  config: GestureConfig = {}
) => {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const touchState = useRef<TouchState>({
    startX: 0,
    startY: 0,
    startTime: 0,
    lastTapTime: 0,
    tapCount: 0,
    isActive: false,
  });

  const [isGestureActive, setIsGestureActive] = useState(false);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      const now = Date.now();
      
      touchState.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        startTime: now,
        lastTapTime: touchState.current.lastTapTime,
        tapCount: now - touchState.current.lastTapTime < 300 ? touchState.current.tapCount + 1 : 1,
        isActive: true,
      };
      
      setIsGestureActive(true);
    }
  }, []);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (!touchState.current.isActive || event.touches.length !== 1) return;

    const touch = event.touches[0];
    const deltaX = touch.clientX - touchState.current.startX;
    const deltaY = touch.clientY - touchState.current.startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Prevent scrolling if we're handling gestures
    if (distance > 10) {
      event.preventDefault();
    }

    // Vertical swipe for volume (right side) or brightness (left side)
    if (Math.abs(deltaY) > 20 && Math.abs(deltaX) < 50) {
      const element = elementRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const isRightSide = touch.clientX > rect.left + rect.width / 2;

      if (isRightSide && mergedConfig.enableSwipeVolume) {
        const volumeDelta = -deltaY * mergedConfig.volumeSensitivity;
        callbacks.onSwipeVolume?.(volumeDelta);
      } else if (!isRightSide && mergedConfig.enableSwipeBrightness) {
        const brightnessDelta = -deltaY * mergedConfig.brightnessSensitivity;
        callbacks.onSwipeBrightness?.(brightnessDelta);
      }
    }
  }, [elementRef, callbacks, mergedConfig]);

  const handleTouchEnd = useCallback((event: TouchEvent) => {
    if (!touchState.current.isActive) return;

    const now = Date.now();
    const duration = now - touchState.current.startTime;
    const tapCount = touchState.current.tapCount;

    touchState.current.isActive = false;
    setIsGestureActive(false);

    // Only handle taps for short duration touches
    if (duration < 300) {
      if (tapCount === 1) {
        // Single tap - delay to check for double tap
        setTimeout(() => {
          if (touchState.current.tapCount === 1 && mergedConfig.enableTapToPlay) {
            callbacks.onTap?.();
          }
        }, 300);
      } else if (tapCount === 2 && mergedConfig.enableDoubleTapSeek) {
        // Double tap - determine direction based on touch position
        const element = elementRef.current;
        if (element) {
          const rect = element.getBoundingClientRect();
          const isLeftSide = touchState.current.startX < rect.left + rect.width / 2;
          callbacks.onDoubleTap?.(isLeftSide ? 'left' : 'right');
        }
        
        // Reset tap count after double tap
        touchState.current.tapCount = 0;
      }
    }

    touchState.current.lastTapTime = now;
  }, [elementRef, callbacks, mergedConfig]);

  // Pinch to zoom (for future enhancement)
  const handleTouchPinch = useCallback((event: TouchEvent) => {
    if (event.touches.length === 2) {
      // Calculate pinch scale
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      // This would need initial distance tracking for proper scale calculation
      // callbacks.onPinchZoom?.(scale);
    }
  }, [callbacks]);

  // Mouse events for desktop compatibility
  const handleMouseClick = useCallback((event: MouseEvent) => {
    if (!mergedConfig.enableTapToPlay) return;
    
    const now = Date.now();
    const timeDiff = now - touchState.current.lastTapTime;
    
    if (timeDiff < 300) {
      // Double click
      if (mergedConfig.enableDoubleTapSeek) {
        const element = elementRef.current;
        if (element) {
          const rect = element.getBoundingClientRect();
          const isLeftSide = event.clientX < rect.left + rect.width / 2;
          callbacks.onDoubleTap?.(isLeftSide ? 'left' : 'right');
        }
      }
    } else {
      // Single click
      callbacks.onTap?.();
    }
    
    touchState.current.lastTapTime = now;
  }, [elementRef, callbacks, mergedConfig]);

  // Set up event listeners
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Touch events
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Mouse events for desktop
    element.addEventListener('click', handleMouseClick);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('click', handleMouseClick);
    };
  }, [elementRef, handleTouchStart, handleTouchMove, handleTouchEnd, handleMouseClick]);

  return {
    isGestureActive,
    config: mergedConfig,
  };
};
