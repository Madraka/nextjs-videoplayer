/**
 * Buffer Indicator Component
 * Visual indicator for buffering status and progress
 */

import React from 'react';
import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface BufferIndicatorProps {
  isBuffering: boolean;
  bufferProgress?: number;
  bufferHealth?: 'good' | 'low' | 'critical';
  position?: 'center' | 'top-right' | 'bottom-right';
  className?: string;
}

export const BufferIndicator: React.FC<BufferIndicatorProps> = ({
  isBuffering,
  bufferProgress,
  bufferHealth = 'good',
  position = 'center',
  className
}) => {
  if (!isBuffering && bufferHealth === 'good') return null;

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'center':
      default:
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
    }
  };

  const getHealthColor = () => {
    switch (bufferHealth) {
      case 'critical':
        return 'text-red-400 border-red-400';
      case 'low':
        return 'text-yellow-400 border-yellow-400';
      case 'good':
      default:
        return 'text-white border-white';
    }
  };

  return (
    <div 
      className={cn(
        "absolute z-40 pointer-events-none",
        getPositionClasses(),
        className
      )}
    >
      <div className={cn(
        "flex items-center space-x-2 px-3 py-2 bg-black/70 backdrop-blur-sm rounded-lg border",
        getHealthColor()
      )}>
        {isBuffering && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        
        <div className="flex flex-col space-y-1">
          <span className="text-xs font-medium">
            {isBuffering ? 'Buffering...' : `Buffer ${bufferHealth}`}
          </span>
          
          {bufferProgress !== undefined && (
            <div className="w-24">
              <Progress 
                value={bufferProgress} 
                className="h-1"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
