/**
 * Watermark Overlay Component
 * Branding watermark overlay with customizable positioning and styling
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface WatermarkOverlayProps {
  content: {
    type: 'text' | 'image' | 'logo';
    value: string; // Text content or image URL
    alt?: string; // Alt text for images
  };
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  size?: 'small' | 'medium' | 'large';
  opacity?: number;
  isVisible: boolean;
  link?: {
    url: string;
    target?: '_blank' | '_self';
  };
  styling?: {
    color?: string;
    backgroundColor?: string;
    fontSize?: string;
    fontWeight?: 'normal' | 'bold' | 'semibold';
    padding?: string;
    borderRadius?: string;
  };
  className?: string;
}

export const WatermarkOverlay: React.FC<WatermarkOverlayProps> = ({
  content,
  position,
  size = 'medium',
  opacity = 0.7,
  isVisible,
  link,
  styling = {},
  className
}) => {
  if (!isVisible) return null;

  const getPositionClass = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-20 left-4'; // Leave space for controls
      case 'bottom-right':
        return 'bottom-20 right-4'; // Leave space for controls
      case 'center':
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
      default:
        return 'top-4 right-4';
    }
  };

  const getSizeClass = () => {
    if (content.type === 'text') {
      switch (size) {
        case 'small':
          return 'text-xs';
        case 'large':
          return 'text-lg';
        case 'medium':
        default:
          return 'text-sm';
      }
    } else {
      switch (size) {
        case 'small':
          return 'h-8 w-auto';
        case 'large':
          return 'h-16 w-auto';
        case 'medium':
        default:
          return 'h-12 w-auto';
      }
    }
  };

  const defaultTextStyling = {
    color: '#ffffff',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: '4px 8px',
    borderRadius: '4px',
    fontWeight: 'normal' as const,
    ...styling
  };

  const renderContent = () => {
    if (content.type === 'image' || content.type === 'logo') {
      return (
        <img
          src={content.value}
          alt={content.alt || 'Watermark'}
          className={cn(
            'object-contain pointer-events-none select-none',
            getSizeClass()
          )}
          style={{ opacity }}
          draggable={false}
        />
      );
    } else {
      return (
        <span
          className={cn(
            'pointer-events-none select-none font-medium',
            getSizeClass()
          )}
          style={{
            opacity,
            color: defaultTextStyling.color,
            backgroundColor: defaultTextStyling.backgroundColor,
            padding: defaultTextStyling.padding,
            borderRadius: defaultTextStyling.borderRadius,
            fontWeight: defaultTextStyling.fontWeight,
            fontSize: styling.fontSize,
          }}
        >
          {content.value}
        </span>
      );
    }
  };

  const WatermarkContent = () => (
    <div 
      className={cn(
        "absolute z-20 transition-opacity duration-300",
        getPositionClass(),
        className
      )}
    >
      {renderContent()}
    </div>
  );

  // If there's a link, wrap in an anchor tag
  if (link) {
    return (
      <a
        href={link.url}
        target={link.target || '_blank'}
        rel="noopener noreferrer"
        className="absolute z-20 transition-opacity duration-300 hover:opacity-90"
        style={{
          ...getPositionClass().split(' ').reduce((acc, cls) => {
            if (cls.startsWith('top-')) acc.top = cls.replace('top-', '') + 'rem';
            if (cls.startsWith('bottom-')) acc.bottom = cls.replace('bottom-', '') + 'rem';
            if (cls.startsWith('left-')) acc.left = cls.replace('left-', '') + 'rem';
            if (cls.startsWith('right-')) acc.right = cls.replace('right-', '') + 'rem';
            return acc;
          }, {} as Record<string, string>)
        }}
      >
        {renderContent()}
      </a>
    );
  }

  return <WatermarkContent />;
};
