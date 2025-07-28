/**
 * Loading Overlay Component
 * Loading state overlay with spinner and progress indicators
 */

import React from 'react';
import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface LoadingOverlayProps {
  isVisible: boolean;
  progress?: number;
  message?: string;
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  progress,
  message = 'Loading...',
  className
}) => {
  if (!isVisible) return null;

  return (
    <div 
      className={cn(
        "absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm",
        className
      )}
    >
      <div className="flex flex-col items-center space-y-4 text-white">
        <Loader2 className="h-8 w-8 animate-spin" />
        
        <div className="text-center space-y-2">
          <p className="text-sm font-medium">{message}</p>
          
          {progress !== undefined && (
            <div className="w-48 space-y-1">
              <Progress 
                value={progress} 
                className="h-2 bg-white/20" 
              />
              <p className="text-xs text-white/80">
                {Math.round(progress)}%
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
