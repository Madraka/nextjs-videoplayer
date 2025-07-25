/**
 * Error display component for video player
 */

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
      'flex flex-col items-center justify-center space-y-4 p-6 text-white text-center max-w-md',
      className
    )}>
      <AlertCircle className="w-12 h-12 text-red-400" />
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Video Error</h3>
        <p className="text-sm text-white/80">{error}</p>
      </div>

      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          className="text-white border-white/20 hover:bg-white/10"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
};
