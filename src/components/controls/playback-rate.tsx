"use client";
/**
 * Playback Rate Component
 * Control video playback speed
 */

import React, { useState } from 'react';
import { Gauge, Check } from 'lucide-react';
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

interface PlaybackRateProps {
  rate: number;
  rates?: number[];
  disabled?: boolean;
  showLabel?: boolean;
  className?: string;
  onRateChange?: (rate: number) => void;
}

const DEFAULT_RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export const PlaybackRate: React.FC<PlaybackRateProps> = ({
  rate,
  rates = DEFAULT_RATES,
  disabled = false,
  showLabel = false,
  className,
  onRateChange
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleRateSelect = (newRate: number) => {
    onRateChange?.(newRate);
    setIsOpen(false);
  };

  const formatRate = (rate: number) => {
    if (rate === 1) return 'Normal';
    return `${rate}x`;
  };

  const getRateLabel = (rate: number) => {
    if (rate < 1) return 'Slower';
    if (rate > 1) return 'Faster';
    return 'Normal';
  };

  const getCurrentRateDisplay = () => {
    if (rate === 1) {
      return showLabel ? 'Normal' : '1x';
    }
    return `${rate}x`;
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={disabled}
          className={cn(
            "text-white hover:bg-white/20 focus:bg-white/20",
            "flex items-center space-x-1 min-w-12",
            className
          )}
          aria-label={`Playback speed: ${formatRate(rate)}`}
          title="Change playback speed"
        >
          <Gauge className="w-4 h-4" />
          <span className="text-xs font-mono">
            {getCurrentRateDisplay()}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        className="w-40 bg-black/90 border-white/20 text-white"
      >
        <DropdownMenuLabel className="text-xs text-white/70">
          Playback Speed
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/20" />
        
        {rates.map((rateOption) => (
          <DropdownMenuItem
            key={rateOption}
            onClick={() => handleRateSelect(rateOption)}
            className={cn(
              "flex items-center justify-between cursor-pointer",
              "hover:bg-white/10 focus:bg-white/10",
              "text-white"
            )}
          >
            <div className="flex items-center space-x-3">
              <span className="text-sm font-mono w-8">
                {rateOption}x
              </span>
              <span className="text-xs text-white/60">
                {getRateLabel(rateOption)}
              </span>
            </div>

            {rate === rateOption && (
              <Check className="w-4 h-4 text-blue-400" />
            )}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator className="bg-white/20" />
        
        <div className="px-2 py-1">
          <p className="text-xs text-white/60">
            Use keyboard shortcuts: - (slower) / + (faster)
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
