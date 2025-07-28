/**
 * Error Overlay Component
 * Error state overlay with retry and detailed error information
 */

import React from 'react';
import { AlertTriangle, RefreshCw, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ErrorOverlayProps {
  isVisible: boolean;
  error?: {
    message: string;
    code?: string | number;
    details?: string;
  };
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export const ErrorOverlay: React.FC<ErrorOverlayProps> = ({
  isVisible,
  error,
  onRetry,
  onDismiss,
  className
}) => {
  if (!isVisible) return null;

  const defaultError = {
    message: 'An error occurred while loading the video',
    code: 'UNKNOWN_ERROR',
    details: 'Please check your internet connection and try again.'
  };

  const displayError = error || defaultError;

  return (
    <div 
      className={cn(
        "absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4",
        className
      )}
    >
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-destructive">Video Error</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="font-medium">{displayError.message}</p>
            
            {displayError.code && (
              <p className="text-sm text-muted-foreground">
                Error Code: {displayError.code}
              </p>
            )}
            
            {displayError.details && (
              <div className="flex items-start space-x-2 p-3 bg-muted rounded-lg">
                <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground text-left">
                  {displayError.details}
                </p>
              </div>
            )}
          </div>
          
          <div className="flex space-x-2">
            {onRetry && (
              <Button 
                onClick={onRetry}
                className="flex-1"
                variant="default"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            )}
            
            {onDismiss && (
              <Button 
                onClick={onDismiss}
                variant="outline"
                className="flex-1"
              >
                Dismiss
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
