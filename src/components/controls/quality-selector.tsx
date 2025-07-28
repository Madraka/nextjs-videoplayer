"use client";
/**
 * Quality Selector Component
 * Allows users to select video quality/resolution
 */

import React, { useState } from 'react';
import { Settings, Check, Zap, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface Quality {
  label: string;
  value: string;
  height?: number;
  bitrate?: number;
  selected?: boolean;
  auto?: boolean;
}

interface QualitySelectorProps {
  qualities: Quality[];
  disabled?: boolean;
  showLabel?: boolean;
  className?: string;
  onQualityChange?: (quality: string) => void;
}

export const QualitySelector: React.FC<QualitySelectorProps> = ({
  qualities,
  disabled = false,
  showLabel = false,
  className,
  onQualityChange
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedQuality = qualities.find(q => q.selected) || qualities[0];
  const hasAutoQuality = qualities.some(q => q.auto);

  const handleQualitySelect = (quality: Quality) => {
    onQualityChange?.(quality.value);
    setIsOpen(false);
  };

  const getQualityIcon = (quality: Quality) => {
    if (quality.auto) {
      return <Zap className="w-4 h-4" />;
    }
    
    if (quality.height) {
      if (quality.height >= 1080) {
        return <span className="text-xs font-bold">HD</span>;
      } else if (quality.height >= 720) {
        return <span className="text-xs font-bold">HD</span>;
      } else {
        return <span className="text-xs">SD</span>;
      }
    }
    
    return <Wifi className="w-4 h-4" />;
  };

  const formatBitrate = (bitrate: number) => {
    if (bitrate >= 1000000) {
      return `${(bitrate / 1000000).toFixed(1)}M`;
    } else if (bitrate >= 1000) {
      return `${(bitrate / 1000).toFixed(0)}K`;
    }
    return `${bitrate}`;
  };

  const getQualityDescription = (quality: Quality) => {
    const parts = [];
    
    if (quality.height) {
      parts.push(`${quality.height}p`);
    }
    
    if (quality.bitrate) {
      parts.push(`${formatBitrate(quality.bitrate)}bps`);
    }
    
    if (quality.auto) {
      parts.push('Adaptive');
    }
    
    return parts.join(' • ');
  };

  // Sort qualities by height (descending) with auto first
  const sortedQualities = [...qualities].sort((a, b) => {
    if (a.auto && !b.auto) return -1;
    if (!a.auto && b.auto) return 1;
    if (a.height && b.height) return b.height - a.height;
    return 0;
  });

  if (qualities.length <= 1) {
    return null;
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={disabled}
          className={cn(
            "text-white hover:bg-white/20 focus:bg-white/20",
            "flex items-center space-x-1",
            className
          )}
          aria-label="Select video quality"
        >
          <Settings className="w-4 h-4" />
          {showLabel && (
            <span className="hidden lg:inline text-xs">
              {selectedQuality?.label || 'Quality'}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        className="w-48 bg-black/90 border-white/20 text-white"
      >
        <DropdownMenuLabel className="text-xs text-white/70">
          Video Quality
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/20" />
        
        {sortedQualities.map((quality) => (
          <DropdownMenuItem
            key={quality.value}
            onClick={() => handleQualitySelect(quality)}
            className={cn(
              "flex items-center justify-between cursor-pointer",
              "hover:bg-white/10 focus:bg-white/10",
              "text-white"
            )}
          >
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 flex items-center justify-center">
                {getQualityIcon(quality)}
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {quality.label}
                </span>
                {getQualityDescription(quality) && (
                  <span className="text-xs text-white/60">
                    {getQualityDescription(quality)}
                  </span>
                )}
              </div>
            </div>

            {quality.selected && (
              <Check className="w-4 h-4 text-blue-400" />
            )}
          </DropdownMenuItem>
        ))}

        {hasAutoQuality && (
          <>
            <DropdownMenuSeparator className="bg-white/20" />
            <div className="px-2 py-1">
              <p className="text-xs text-white/60">
                Auto quality adjusts based on your connection speed
              </p>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
