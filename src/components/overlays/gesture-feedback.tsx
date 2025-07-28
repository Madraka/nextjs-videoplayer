"use client";
/**
 * Gesture Feedback Component
 * Visual feedback for touch gestures (swipe, tap, pinch)
 */

import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GestureFeedbackProps {
  gesture?: {
    type: 'tap' | 'swipe-left' | 'swipe-right' | 'swipe-up' | 'swipe-down' | 'pinch';
    action: 'play' | 'pause' | 'seek-forward' | 'seek-backward' | 'volume-up' | 'volume-down' | 'brightness-up' | 'brightness-down';
    value?: number;
    position?: { x: number; y: number };
  };
  isVisible: boolean;
  duration?: number;
  className?: string;
}

export const GestureFeedback: React.FC<GestureFeedbackProps> = ({
  gesture,
  isVisible,
  duration = 1000,
  className
}) => {
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (isVisible && gesture) {
      setShowFeedback(true);
      const timer = setTimeout(() => {
        setShowFeedback(false);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, gesture, duration]);

  if (!showFeedback || !gesture) return null;

  const getGestureIcon = () => {
    switch (gesture.action) {
      case 'play':
        return <Play className="h-8 w-8" />;
      case 'pause':
        return <Pause className="h-8 w-8" />;
      case 'seek-forward':
        return <SkipForward className="h-8 w-8" />;
      case 'seek-backward':
        return <SkipBack className="h-8 w-8" />;
      case 'volume-up':
      case 'volume-down':
        return <Volume2 className="h-8 w-8" />;
      default:
        return null;
    }
  };

  const getGestureText = () => {
    switch (gesture.action) {
      case 'play':
        return 'Play';
      case 'pause':
        return 'Pause';
      case 'seek-forward':
        return `+${gesture.value || 10}s`;
      case 'seek-backward':
        return `-${gesture.value || 10}s`;
      case 'volume-up':
        return `Volume ${gesture.value || 0}%`;
      case 'volume-down':
        return `Volume ${gesture.value || 0}%`;
      case 'brightness-up':
        return `Brightness ${gesture.value || 0}%`;
      case 'brightness-down':
        return `Brightness ${gesture.value || 0}%`;
      default:
        return '';
    }
  };

  const feedbackPosition = gesture.position || { x: 50, y: 50 };

  return (
    <div 
      className={cn(
        "absolute pointer-events-none z-50",
        className
      )}
      style={{
        left: `${feedbackPosition.x}%`,
        top: `${feedbackPosition.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div className="flex flex-col items-center space-y-2 animate-in fade-in-0 zoom-in-95 duration-200">
        <div className="p-4 bg-black/70 backdrop-blur-sm rounded-full text-white">
          {getGestureIcon()}
        </div>
        
        {getGestureText() && (
          <div className="px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full text-white text-sm font-medium">
            {getGestureText()}
          </div>
        )}
        
        {/* Progress indicator for volume/brightness */}
        {(gesture.action.includes('volume') || gesture.action.includes('brightness')) && gesture.value !== undefined && (
          <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-200"
              style={{ width: `${gesture.value}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
