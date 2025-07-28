/**
 * Gesture Handler Hook
 * Manages touch gestures for mobile video player interactions
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface GestureState {
  isActive: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  deltaX: number;
  deltaY: number;
  distance: number;
  velocity: number;
  direction: 'horizontal' | 'vertical' | 'none';
}

interface SwipeGesture {
  direction: 'left' | 'right' | 'up' | 'down';
  distance: number;
  velocity: number;
  duration: number;
}

interface PinchGesture {
  scale: number;
  velocity: number;
  center: { x: number; y: number };
}

interface TapGesture {
  x: number;
  y: number;
  count: number;
  timestamp: number;
}

interface UseGestureHandlerProps {
  element?: HTMLElement | null;
  onSwipe?: (gesture: SwipeGesture) => void;
  onPinch?: (gesture: PinchGesture) => void;
  onTap?: (gesture: TapGesture) => void;
  onDoubleTap?: (gesture: TapGesture) => void;
  onLongPress?: (gesture: TapGesture) => void;
  onVolumeGesture?: (delta: number) => void;
  onSeekGesture?: (delta: number) => void;
  onBrightnessGesture?: (delta: number) => void;
  swipeThreshold?: number;
  pinchThreshold?: number;
  longPressDelay?: number;
  doubleTapDelay?: number;
  enabled?: boolean;
}

interface UseGestureHandlerReturn {
  gestureState: GestureState;
  isGestureActive: boolean;
  registerElement: (element: HTMLElement) => void;
  unregisterElement: () => void;
  enable: () => void;
  disable: () => void;
}

export function useGestureHandler({
  element,
  onSwipe,
  onPinch,
  onTap,
  onDoubleTap,
  onLongPress,
  onVolumeGesture,
  onSeekGesture,
  onBrightnessGesture,
  swipeThreshold = 50,
  pinchThreshold = 1.2,
  longPressDelay = 500,
  doubleTapDelay = 300,
  enabled = true
}: UseGestureHandlerProps): UseGestureHandlerReturn {
  const [gestureState, setGestureState] = useState<GestureState>({
    isActive: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    deltaX: 0,
    deltaY: 0,
    distance: 0,
    velocity: 0,
    direction: 'none'
  });

  const [isGestureActive, setIsGestureActive] = useState(false);
  const [isEnabled, setIsEnabled] = useState(enabled);

  const elementRef = useRef<HTMLElement | null>(null);
  const touchesRef = useRef<Touch[]>([]);
  const startTimeRef = useRef<number>(0);
  const lastTapRef = useRef<{ x: number; y: number; timestamp: number } | null>(null);
  const longPressTimeoutRef = useRef<NodeJS.Timeout>();
  const initialPinchDistanceRef = useRef<number>(0);

  // Calculate distance between two touches
  const getTouchDistance = useCallback((touch1: Touch, touch2: Touch): number => {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  // Calculate gesture velocity
  const calculateVelocity = useCallback((distance: number, duration: number): number => {
    return duration > 0 ? distance / duration : 0;
  }, []);

  // Determine gesture direction
  const getGestureDirection = useCallback((deltaX: number, deltaY: number): 'horizontal' | 'vertical' | 'none' => {
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      return 'horizontal';
    } else if (Math.abs(deltaY) > Math.abs(deltaX)) {
      return 'vertical';
    }
    return 'none';
  }, []);

  // Handle touch start
  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (!isEnabled) return;

    const touches = Array.from(event.touches);
    touchesRef.current = touches;
    startTimeRef.current = Date.now();

    if (touches.length === 1) {
      const touch = touches[0];
      const newState: GestureState = {
        isActive: true,
        startX: touch.clientX,
        startY: touch.clientY,
        currentX: touch.clientX,
        currentY: touch.clientY,
        deltaX: 0,
        deltaY: 0,
        distance: 0,
        velocity: 0,
        direction: 'none'
      };

      setGestureState(newState);
      setIsGestureActive(true);

      // Start long press timer
      if (onLongPress) {
        longPressTimeoutRef.current = setTimeout(() => {
          onLongPress({
            x: touch.clientX,
            y: touch.clientY,
            count: 1,
            timestamp: Date.now()
          });
        }, longPressDelay);
      }
    } else if (touches.length === 2) {
      // Pinch gesture start
      initialPinchDistanceRef.current = getTouchDistance(touches[0], touches[1]);
      
      // Clear long press timer
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
      }
    }
  }, [isEnabled, onLongPress, longPressDelay, getTouchDistance]);

  // Handle touch move
  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (!isEnabled || !gestureState.isActive) return;

    event.preventDefault();
    const touches = Array.from(event.touches);

    if (touches.length === 1) {
      const touch = touches[0];
      const deltaX = touch.clientX - gestureState.startX;
      const deltaY = touch.clientY - gestureState.startY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const duration = Date.now() - startTimeRef.current;
      const velocity = calculateVelocity(distance, duration);
      const direction = getGestureDirection(deltaX, deltaY);

      const newState: GestureState = {
        ...gestureState,
        currentX: touch.clientX,
        currentY: touch.clientY,
        deltaX,
        deltaY,
        distance,
        velocity,
        direction
      };

      setGestureState(newState);

      // Clear long press timer if moved too much
      if (distance > 10 && longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
      }

      // Handle volume/seek/brightness gestures
      if (distance > 20) {
        if (direction === 'vertical' && elementRef.current) {
          const rect = elementRef.current.getBoundingClientRect();
          const leftSide = touch.clientX < rect.left + rect.width / 2;
          
          if (leftSide && onBrightnessGesture) {
            // Left side - brightness
            const normalizedDelta = -deltaY / rect.height;
            onBrightnessGesture(normalizedDelta);
          } else if (!leftSide && onVolumeGesture) {
            // Right side - volume
            const normalizedDelta = -deltaY / rect.height;
            onVolumeGesture(normalizedDelta);
          }
        } else if (direction === 'horizontal' && onSeekGesture) {
          // Horizontal - seek
          const normalizedDelta = deltaX / (elementRef.current?.getBoundingClientRect().width || 1);
          onSeekGesture(normalizedDelta);
        }
      }
    } else if (touches.length === 2 && onPinch) {
      // Pinch gesture
      const currentDistance = getTouchDistance(touches[0], touches[1]);
      const scale = currentDistance / (initialPinchDistanceRef.current || 1);
      
      if (Math.abs(scale - 1) > 0.1) {
        const center = {
          x: (touches[0].clientX + touches[1].clientX) / 2,
          y: (touches[0].clientY + touches[1].clientY) / 2
        };

        const duration = Date.now() - startTimeRef.current;
        const velocity = calculateVelocity(Math.abs(scale - 1), duration);

        onPinch({ scale, velocity, center });
      }
    }
  }, [isEnabled, gestureState, calculateVelocity, getGestureDirection, getTouchDistance, onVolumeGesture, onSeekGesture, onBrightnessGesture, onPinch]);

  // Handle touch end
  const handleTouchEnd = useCallback((event: TouchEvent) => {
    if (!isEnabled) return;

    const duration = Date.now() - startTimeRef.current;
    const touch = touchesRef.current[0];

    // Clear long press timer
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
    }

    if (touch && gestureState.isActive) {
      // Check for swipe gesture
      if (gestureState.distance > swipeThreshold && onSwipe) {
        let swipeDirection: 'left' | 'right' | 'up' | 'down';
        
        if (gestureState.direction === 'horizontal') {
          swipeDirection = gestureState.deltaX > 0 ? 'right' : 'left';
        } else {
          swipeDirection = gestureState.deltaY > 0 ? 'down' : 'up';
        }

        onSwipe({
          direction: swipeDirection,
          distance: gestureState.distance,
          velocity: gestureState.velocity,
          duration
        });
      }
      // Check for tap gesture
      else if (gestureState.distance < 10 && duration < 200) {
        const tapGesture: TapGesture = {
          x: touch.clientX,
          y: touch.clientY,
          count: 1,
          timestamp: Date.now()
        };

        // Check for double tap
        if (lastTapRef.current && onDoubleTap) {
          const timeDiff = tapGesture.timestamp - lastTapRef.current.timestamp;
          const distance = Math.sqrt(
            Math.pow(tapGesture.x - lastTapRef.current.x, 2) +
            Math.pow(tapGesture.y - lastTapRef.current.y, 2)
          );

          if (timeDiff < doubleTapDelay && distance < 50) {
            onDoubleTap({ ...tapGesture, count: 2 });
            lastTapRef.current = null;
            return;
          }
        }

        // Single tap
        if (onTap) {
          setTimeout(() => {
            if (lastTapRef.current?.timestamp === tapGesture.timestamp) {
              onTap(tapGesture);
            }
          }, doubleTapDelay);
        }

        lastTapRef.current = tapGesture;
      }
    }

    // Reset gesture state
    setGestureState({
      isActive: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      deltaX: 0,
      deltaY: 0,
      distance: 0,
      velocity: 0,
      direction: 'none'
    });
    setIsGestureActive(false);
    touchesRef.current = [];
  }, [isEnabled, gestureState, swipeThreshold, doubleTapDelay, onSwipe, onTap, onDoubleTap]);

  // Register element
  const registerElement = useCallback((element: HTMLElement) => {
    unregisterElement();
    elementRef.current = element;
    
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Unregister element
  const unregisterElement = useCallback(() => {
    if (elementRef.current) {
      elementRef.current.removeEventListener('touchstart', handleTouchStart);
      elementRef.current.removeEventListener('touchmove', handleTouchMove);
      elementRef.current.removeEventListener('touchend', handleTouchEnd);
      elementRef.current = null;
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Enable/disable gestures
  const enable = useCallback(() => setIsEnabled(true), []);
  const disable = useCallback(() => setIsEnabled(false), []);

  // Auto-register element if provided
  useEffect(() => {
    if (element) {
      registerElement(element);
    }
    return unregisterElement;
  }, [element, registerElement, unregisterElement]);

  // Update enabled state
  useEffect(() => {
    setIsEnabled(enabled);
  }, [enabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      unregisterElement();
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
      }
    };
  }, [unregisterElement]);

  return {
    gestureState,
    isGestureActive,
    registerElement,
    unregisterElement,
    enable,
    disable
  };
}
