/**
 * YouTube-style error display for video player
 */

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  className
}) => {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center gap-4 p-6 text-white text-center max-w-md',
      className
    )}>
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-md">
        <AlertCircle className="w-8 h-8 text-red-400" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base font-medium">Video unavailable</h3>
        <p className="text-sm text-white/60">{error}</p>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-medium hover:bg-white/20 active:bg-white/25 transition-colors duration-200"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      )}
    </div>
  );
};
