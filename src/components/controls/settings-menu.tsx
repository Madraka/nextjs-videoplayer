"use client";
/**
 * Advanced Settings Menu Component
 * Comprehensive settings panel using all contexts
 */

import React, { useState } from 'react';
import { 
  Settings, ChevronRight, Check, Gauge, Monitor, Volume2, 
  Palette, BarChart3, Sparkles, Gamepad2, Accessibility,
  Globe, Shield, Download, Camera, Type, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// 🎯 Import modern contexts
import { usePlayer } from '@/contexts/player-context';
import { useTheme, useThemeColors } from '@/contexts/theme-context';
import { useAnalytics, useAnalyticsEvent } from '@/contexts/analytics-context';
import { PlayerPresets } from '@/types/player';

interface Quality {
  label: string;
  value: string;
  selected?: boolean;
}

interface SettingsMenuProps {
  qualities?: Quality[];
  playbackRate?: number;
  playbackRates?: number[];
  disabled?: boolean;
  className?: string;
  onOpen?: () => void;
  onQualityChange?: (quality: string) => void;
  onPlaybackRateChange?: (rate: number) => void;
  onSettingsChange?: (setting: string, value: any) => void;
}

const DEFAULT_RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export const SettingsMenu: React.FC<SettingsMenuProps> = ({
  qualities = [],
  playbackRate = 1,
  playbackRates = DEFAULT_RATES,
  disabled = false,
  className,
  onOpen,
  onQualityChange,
  onPlaybackRateChange,
  onSettingsChange
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // 🎯 Use modern contexts
  const { state: playerState, controls: playerControls } = usePlayer();
  const { theme, themeName, availableThemes, setTheme, toggleTheme } = useTheme();
  const themeColors = useThemeColors();
  const { trackEvent, trackCustomEvent } = useAnalyticsEvent();
  const { config: analyticsConfig, updateConfig: updateAnalyticsConfig } = useAnalytics();
  
  // Simple config state for demo
  const [localConfig, setLocalConfig] = useState({
    analytics: { enabled: true },
    accessibility: { enabled: true },
    gestures: { enabled: true },
    features: { 
      thumbnails: true, 
      chapters: false,
      thumbnailPreview: true 
    },
    keyboard: { enabled: true },
    auto: { autoPlay: false }
  });

  const handleOpenChange = (open: boolean) => {
    console.log('🔧 Settings menu state changing:', { from: isOpen, to: open });
    setIsOpen(open);
    if (open) {
      onOpen?.();
      // Track settings menu open event
      trackEvent?.({
        type: 'seek', // Using available event type
        currentTime: 0,
        duration: 0,
        volume: 1,
        playbackRate: 1,
        isFullscreen: false,
        data: { action: 'settings_menu_opened', source: 'control_bar' }
      });
    }
  };

  const handleQualitySelect = (quality: Quality) => {
    onQualityChange?.(quality.value);
    trackEvent?.({
      type: 'qualitychange',
      currentTime: 0,
      duration: 0,
      volume: 1,
      quality: quality.value,
      playbackRate: 1,
      isFullscreen: false
    });
  };

  const handleRateSelect = (rate: number) => {
    onPlaybackRateChange?.(rate);
    trackEvent?.({
      type: 'seek', // Using available event type
      currentTime: 0,
      duration: 0,
      volume: 1,
      playbackRate: rate,
      isFullscreen: false,
      data: { action: 'playback_rate_changed' }
    });
  };

  const handleThemeChange = (themeName: string) => {
    setTheme(themeName as any);
    // Use trackCustomEvent for non-playback events
    trackCustomEvent?.('theme_changed', { theme: themeName });
  };

  const handlePresetChange = (presetName: string) => {
    // Simple preset switching - in real app this would be more sophisticated
    console.log('Switching to preset:', presetName);
    trackCustomEvent?.('preset_changed', { preset: presetName });
  };

  const handleConfigToggle = (key: string, value: boolean) => {
    // Update local config for demo
    const keys = key.split('.');
    setLocalConfig(prev => {
      const newConfig = { ...prev };
      let current: any = newConfig;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newConfig;
    });
    trackCustomEvent?.('config_changed', { setting: key, value });
  };

  const selectedQuality = qualities.find(q => q.selected) || qualities[0];

  const formatRate = (rate: number) => {
    if (rate === 1) return 'Normal';
    return `${rate}x`;
  };

  const getRateLabel = (rate: number) => {
    if (rate < 1) return 'Slower';
    if (rate > 1) return 'Faster';
    return 'Normal';
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={disabled}
          className={cn(
            "text-white hover:bg-white/20 focus:bg-white/20",
            "w-10 h-10 relative",
            className
          )}
          aria-label="Video settings"
          title="Video settings"
        >
          <Settings className="w-5 h-5" />
          {/* Subtle HD Quality Badge - Only for HD qualities */}
          {selectedQuality && (selectedQuality.label.includes('1080p') || selectedQuality.label.includes('720p')) && (
            <Badge 
              variant="secondary" 
              className="absolute -top-0.5 -right-0.5 bg-blue-500/60 text-white text-[10px] px-1 py-0 border-none min-w-[16px] h-[16px] flex items-center justify-center font-medium"
            >
              HD
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        className="w-80 bg-black/95 border-white/20 text-white max-h-[80vh] overflow-y-auto"
        sideOffset={8}
      >
        <DropdownMenuLabel className="text-sm font-semibold text-white/90 flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Player Settings
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/20" />

        {/* 🎥 Video Quality Settings */}
        {qualities.length > 0 && (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="text-white hover:bg-white/10 focus:bg-white/10">
              <Monitor className="w-4 h-4 mr-3" />
              <span>Video Quality</span>
              <div className="ml-auto">
                <Badge 
                  variant="secondary" 
                  className="bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 border-blue-400/30"
                >
                  {selectedQuality?.label || 'Auto'}
                </Badge>
              </div>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-48 bg-black/95 border-white/20 text-white">
              {qualities.map((quality) => (
                <DropdownMenuItem
                  key={quality.value}
                  onClick={() => handleQualitySelect(quality)}
                  className="text-white hover:bg-white/10 focus:bg-white/10"
                >
                  <span className="flex-1">{quality.label}</span>
                  {quality.selected && (
                    <Check className="w-4 h-4 text-blue-400" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        )}

        {/* ⚡ Playback Speed */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="text-white hover:bg-white/10 focus:bg-white/10">
            <Gauge className="w-4 h-4 mr-3" />
            <span>Playback Speed</span>
            <div className="ml-auto">
              <Badge 
                variant="secondary" 
                className="bg-green-500/20 text-green-300 text-xs px-2 py-0.5 border-green-400/30"
              >
                {formatRate(playbackRate)}
              </Badge>
            </div>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-40 bg-black/95 border-white/20 text-white">
            {playbackRates.map((rate) => (
              <DropdownMenuItem
                key={rate}
                onClick={() => handleRateSelect(rate)}
                className="text-white hover:bg-white/10 focus:bg-white/10"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono">{rate}x</span>
                  <span className="text-xs text-white/60">
                    {getRateLabel(rate)}
                  </span>
                  {playbackRate === rate && (
                    <Check className="w-4 h-4 text-blue-400 ml-2" />
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator className="bg-white/20" />

        {/* 🎨 Theme Settings */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="text-white hover:bg-white/10 focus:bg-white/10">
            <Palette className="w-4 h-4 mr-3" />
            <span>Theme</span>
            <div className="ml-auto">
              <Badge 
                variant="secondary" 
                className="bg-purple-500/20 text-purple-300 text-xs px-2 py-0.5 border-purple-400/30 capitalize"
              >
                {themeName}
              </Badge>
            </div>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-48 bg-black/95 border-white/20 text-white">
            {availableThemes.map((themeOption) => (
              <DropdownMenuItem
                key={themeOption}
                onClick={() => handleThemeChange(themeOption)}
                className="text-white hover:bg-white/10 focus:bg-white/10"
              >
                <span className="flex-1 capitalize">{themeOption}</span>
                {themeName === themeOption && (
                  <Check className="w-4 h-4 text-blue-400" />
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="bg-white/20" />
            <DropdownMenuItem
              onClick={toggleTheme}
              className="text-white hover:bg-white/10 focus:bg-white/10"
            >
              <Zap className="w-4 h-4 mr-3" />
              <span>Toggle Dark/Light</span>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* 🎯 Player Presets */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="text-white hover:bg-white/10 focus:bg-white/10">
            <Type className="w-4 h-4 mr-3" />
            <span>Player Style</span>
            <ChevronRight className="w-4 h-4 ml-auto" />
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-48 bg-black/95 border-white/20 text-white">
            {['youtube', 'netflix', 'minimal', 'mobile'].map((preset) => (
              <DropdownMenuItem
                key={preset}
                onClick={() => handlePresetChange(preset)}
                className="text-white hover:bg-white/10 focus:bg-white/10"
              >
                <span className="flex-1 capitalize">{preset} Style</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator className="bg-white/20" />

        {/* 🎮 Playback Settings */}
        <DropdownMenuItem
          className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Zap className="w-4 h-4 mr-3" />
          <span className="flex-1">Loop Video</span>
          <Switch 
            checked={playerState.loop}
            onCheckedChange={(checked) => {
              playerControls.toggleLoop();
            }}
            className="ml-2 data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-600"
            onClick={(e) => e.stopPropagation()}
          />
        </DropdownMenuItem>

        <DropdownMenuItem
          className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Monitor className="w-4 h-4 mr-3" />
          <span className="flex-1">Auto-hide Controls</span>
          <Switch 
            checked={playerState.autoHideControls}
            onCheckedChange={(checked) => {
              playerControls.toggleAutoHideControls();
            }}
            className="ml-2 data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-600"
            onClick={(e) => e.stopPropagation()}
          />
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-white/20" />

        {/* 📊 Analytics & Tracking */}
        <DropdownMenuItem
          className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <BarChart3 className="w-4 h-4 mr-3" />
          <span className="flex-1">Analytics</span>
          <Switch 
            checked={analyticsConfig.enabled}
            onCheckedChange={(checked) => {
              updateAnalyticsConfig({ enabled: checked });
            }}
            className="ml-2 data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-600"
            onClick={(e) => e.stopPropagation()}
          />
        </DropdownMenuItem>

        {/* ♿ Accessibility - Using keyboard shortcuts as proxy */}
        <DropdownMenuItem
          className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Accessibility className="w-4 h-4 mr-3" />
          <span className="flex-1">Accessibility Features</span>
          <Switch 
            checked={localConfig.keyboard?.enabled || false}
            onCheckedChange={(checked) => {
              handleConfigToggle('keyboard.enabled', checked);
            }}
            className="ml-2 data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-600"
            onClick={(e) => e.stopPropagation()}
          />
        </DropdownMenuItem>

        {/* 🎮 Controls */}
        <DropdownMenuItem
          className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Gamepad2 className="w-4 h-4 mr-3" />
          <span className="flex-1">Touch Gestures</span>
          <Switch 
            checked={localConfig.gestures?.enabled || false}
            onCheckedChange={(checked) => {
              handleConfigToggle('gestures.enabled', checked);
            }}
            className="ml-2 data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-600"
            onClick={(e) => e.stopPropagation()}
          />
        </DropdownMenuItem>

        {/* 🔊 Audio - Using auto as proxy */}
        <DropdownMenuItem
          className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Volume2 className="w-4 h-4 mr-3" />
          <span className="flex-1">Auto Play</span>
          <Switch 
            checked={localConfig.auto?.autoPlay || false}
            onCheckedChange={(checked) => {
              handleConfigToggle('auto.autoPlay', checked);
            }}
            className="ml-2 data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-600"
            onClick={(e) => e.stopPropagation()}
          />
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-white/20" />

        {/* 🚀 Advanced Features */}
        <DropdownMenuLabel className="text-xs text-white/70 mt-2">
          Advanced Features
        </DropdownMenuLabel>

        <DropdownMenuItem
          className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Sparkles className="w-4 h-4 mr-3" />
          <span className="flex-1">Thumbnail Preview</span>
          <Switch 
            checked={playerState.thumbnailPreview}
            onCheckedChange={(checked) => {
              playerControls.toggleThumbnailPreview();
            }}
            className="ml-2 data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-600"
            onClick={(e) => e.stopPropagation()}
          />
        </DropdownMenuItem>

        <DropdownMenuItem
          className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Camera className="w-4 h-4 mr-3" />
          <span className="flex-1">Chapter Markers</span>
          <Switch 
            checked={localConfig.features?.chapters || false}
            onCheckedChange={(checked) => {
              handleConfigToggle('features.chapters', checked);
            }}
            className="ml-2 data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-600"
            onClick={(e) => e.stopPropagation()}
          />
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-white/20" />

        {/* ℹ️ Info */}
        <div className="px-3 py-2">
          <p className="text-xs text-white/60 mb-1">
            💡 Keyboard shortcuts: Space (play/pause), ↑↓ (volume), ←→ (seek)
          </p>
          <p className="text-xs text-white/50">
            Theme: {themeName} | Quality: {selectedQuality?.label || 'Auto'}
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
