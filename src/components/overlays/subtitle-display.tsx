/**
 * Subtitle Display Component
 * Renders and displays video subtitles/captions with styling options
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface SubtitleCue {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  position?: {
    line?: number | 'auto';
    position?: number;
    align?: 'start' | 'center' | 'end';
  };
  styling?: {
    color?: string;
    backgroundColor?: string;
    fontSize?: 'small' | 'medium' | 'large';
    fontFamily?: string;
    bold?: boolean;
    italic?: boolean;
  };
}

interface SubtitleDisplayProps {
  currentTime: number;
  cues: SubtitleCue[];
  isVisible: boolean;
  settings?: {
    fontSize: 'small' | 'medium' | 'large';
    fontFamily: 'sans' | 'serif' | 'mono';
    textColor: string;
    backgroundColor: string;
    backgroundOpacity: number;
    textStroke: boolean;
    position: 'bottom' | 'top' | 'center';
  };
  className?: string;
}

export const SubtitleDisplay: React.FC<SubtitleDisplayProps> = ({
  currentTime,
  cues,
  isVisible,
  settings = {
    fontSize: 'medium',
    fontFamily: 'sans',
    textColor: '#ffffff',
    backgroundColor: '#000000',
    backgroundOpacity: 0.8,
    textStroke: true,
    position: 'bottom'
  },
  className
}) => {
  if (!isVisible) return null;

  // Find active cues based on current time
  const activeCues = cues.filter(cue => 
    currentTime >= cue.startTime && currentTime <= cue.endTime
  );

  if (activeCues.length === 0) return null;

  const getFontSizeClass = (size: 'small' | 'medium' | 'large') => {
    switch (size) {
      case 'small':
        return 'text-sm';
      case 'large':
        return 'text-xl';
      case 'medium':
      default:
        return 'text-base';
    }
  };

  const getFontFamilyClass = (family: 'sans' | 'serif' | 'mono') => {
    switch (family) {
      case 'serif':
        return 'font-serif';
      case 'mono':
        return 'font-mono';
      case 'sans':
      default:
        return 'font-sans';
    }
  };

  const getPositionClass = (position: 'bottom' | 'top' | 'center') => {
    switch (position) {
      case 'top':
        return 'top-4';
      case 'center':
        return 'top-1/2 transform -translate-y-1/2';
      case 'bottom':
      default:
        return 'bottom-16'; // Leave space for controls
    }
  };

  return (
    <div 
      className={cn(
        "absolute left-1/2 transform -translate-x-1/2 z-30 pointer-events-none max-w-4xl w-full px-4",
        getPositionClass(settings.position),
        className
      )}
    >
      <div className="space-y-2">
        {activeCues.map((cue) => (
          <div
            key={cue.id}
            className={cn(
              "text-center leading-relaxed px-2 py-1 rounded",
              getFontSizeClass(cue.styling?.fontSize || settings.fontSize),
              getFontFamilyClass(settings.fontFamily),
              {
                'font-bold': cue.styling?.bold,
                'italic': cue.styling?.italic,
              }
            )}
            style={{
              color: cue.styling?.color || settings.textColor,
              backgroundColor: `${cue.styling?.backgroundColor || settings.backgroundColor}${Math.round(settings.backgroundOpacity * 255).toString(16).padStart(2, '0')}`,
              textShadow: settings.textStroke ? '1px 1px 2px rgba(0, 0, 0, 0.8)' : 'none',
            }}
          >
            {/* Parse and render subtitle text with basic formatting */}
            <span 
              dangerouslySetInnerHTML={{
                __html: cue.text
                  .replace(/\n/g, '<br />')
                  .replace(/<b>/g, '<strong>')
                  .replace(/<\/b>/g, '</strong>')
                  .replace(/<i>/g, '<em>')
                  .replace(/<\/i>/g, '</em>')
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
