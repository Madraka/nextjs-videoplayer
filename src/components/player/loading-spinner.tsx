'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  className,
  size = 'medium' 
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div 
        className={cn(
          'animate-spin rounded-full border-2 border-gray-300 border-t-white',
          sizeClasses[size]
        )}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
