'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { usePlayerConfig, usePlayerPresets } from '@/contexts/player-config-context';
import { Settings, Palette, Keyboard, Smartphone, Zap, Save, RotateCcw } from 'lucide-react';

export const PlayerConfigPanel: React.FC = () => {
  const { config, updateConfig, resetConfig, saveConfig, loadSavedConfig, getSavedConfigs } = usePlayerConfig();
  const { presets, loadPreset } = usePlayerPresets();
  const [saveConfigName, setSaveConfigName] = useState('');

  const savedConfigs = getSavedConfigs();

  const handleControlVisibilityChange = (control: string, enabled: boolean) => {
    updateConfig({
      controls: {
        ...config.controls,
        visibility: {
          ...config.controls?.visibility,
          [control]: enabled,
        },
      },
    });
  };

  const handleThemeChange = (property: string, value: string) => {
    updateConfig({
      theme: {
        ...config.theme,
        [property]: value,
      },
    });
  };

  const handleAutoChange = (property: string, value: any) => {
    updateConfig({
      auto: {
        ...config.auto,
        [property]: value,
      },
    });
  };

  const handleGestureChange = (property: string, value: boolean) => {
    updateConfig({
      gestures: {
        ...config.gestures,
        [property]: value,
      },
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Video Player Configuration
        </CardTitle>
        <div className="flex gap-2 flex-wrap">
          <Select onValueChange={loadPreset}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Load Preset" />
            </SelectTrigger>
            <SelectContent>
              {presets.map((preset) => (
                <SelectItem key={preset} value={preset}>
                  {preset.charAt(0).toUpperCase() + preset.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {savedConfigs.length > 0 && (
            <Select onValueChange={loadSavedConfig}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Load Saved Config" />
              </SelectTrigger>
              <SelectContent>
                {savedConfigs.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          <Button variant="outline" onClick={resetConfig}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="controls" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="controls">Controls</TabsTrigger>
            <TabsTrigger value="theme">Theme</TabsTrigger>
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
            <TabsTrigger value="gestures">Gestures</TabsTrigger>
            <TabsTrigger value="save">Save</TabsTrigger>
          </TabsList>

          <TabsContent value="controls" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Control Visibility</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries({
                  playPause: 'Play/Pause Button',
                  progress: 'Progress Bar',
                  volume: 'Volume Control',
                  quality: 'Quality Selector',
                  fullscreen: 'Fullscreen Toggle',
                  pictureInPicture: 'Picture-in-Picture',
                  theaterMode: 'Theater Mode',
                  playbackRate: 'Playback Speed',
                  keyboardShortcuts: 'Keyboard Shortcuts',
                  settings: 'Settings Menu',
                  time: 'Time Display',
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Switch
                      id={key}
                      checked={config.controls?.visibility?.[key as keyof typeof config.controls.visibility] ?? true}
                      onCheckedChange={(checked) => handleControlVisibilityChange(key, checked)}
                    />
                    <Label htmlFor={key} className="text-sm">{label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-4">Control Style</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="style">Style</Label>
                  <Select
                    value={config.controls?.style || 'youtube'}
                    onValueChange={(value) => updateConfig({
                      controls: { ...config.controls, style: value as any }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="vimeo">Vimeo</SelectItem>
                      <SelectItem value="netflix">Netflix</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="size">Size</Label>
                  <Select
                    value={config.controls?.size || 'medium'}
                    onValueChange={(value) => updateConfig({
                      controls: { ...config.controls, size: value as any }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="theme" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Color Theme
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries({
                  primary: 'Primary Color',
                  secondary: 'Secondary Color',
                  accent: 'Accent Color',
                  progressColor: 'Progress Color',
                  bufferColor: 'Buffer Color',
                }).map(([key, label]) => (
                  <div key={key}>
                    <Label htmlFor={key}>{label}</Label>
                    <Input
                      id={key}
                      type="color"
                      value={config.theme?.[key as keyof typeof config.theme] || '#3b82f6'}
                      onChange={(e) => handleThemeChange(key, e.target.value)}
                      className="h-10"
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="behavior" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Auto Behaviors
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="autoPlay"
                    checked={config.auto?.autoPlay ?? false}
                    onCheckedChange={(checked) => handleAutoChange('autoPlay', checked)}
                  />
                  <Label htmlFor="autoPlay">Auto Play</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="autoHideControls"
                    checked={config.auto?.autoHideControls ?? true}
                    onCheckedChange={(checked) => handleAutoChange('autoHideControls', checked)}
                  />
                  <Label htmlFor="autoHideControls">Auto Hide Controls</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="rememberVolume"
                    checked={config.auto?.rememberVolume ?? true}
                    onCheckedChange={(checked) => handleAutoChange('rememberVolume', checked)}
                  />
                  <Label htmlFor="rememberVolume">Remember Volume</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="rememberPlaybackRate"
                    checked={config.auto?.rememberPlaybackRate ?? true}
                    onCheckedChange={(checked) => handleAutoChange('rememberPlaybackRate', checked)}
                  />
                  <Label htmlFor="rememberPlaybackRate">Remember Playback Rate</Label>
                </div>

                <div>
                  <Label htmlFor="autoHideDelay">Auto Hide Delay (ms)</Label>
                  <Input
                    id="autoHideDelay"
                    type="number"
                    value={config.auto?.autoHideDelay || 3000}
                    onChange={(e) => handleAutoChange('autoHideDelay', parseInt(e.target.value))}
                    min="1000"
                    max="10000"
                    step="500"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="gestures" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Touch Gestures
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="gesturesEnabled"
                    checked={config.gestures?.enabled ?? true}
                    onCheckedChange={(checked) => handleGestureChange('enabled', checked)}
                  />
                  <Label htmlFor="gesturesEnabled">Enable Gestures</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="tapToPlay"
                    checked={config.gestures?.tapToPlay ?? true}
                    onCheckedChange={(checked) => handleGestureChange('tapToPlay', checked)}
                  />
                  <Label htmlFor="tapToPlay">Tap to Play/Pause</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="doubleTapSeek"
                    checked={config.gestures?.doubleTapSeek ?? true}
                    onCheckedChange={(checked) => handleGestureChange('doubleTapSeek', checked)}
                  />
                  <Label htmlFor="doubleTapSeek">Double Tap to Seek</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="swipeVolume"
                    checked={config.gestures?.swipeVolume ?? false}
                    onCheckedChange={(checked) => handleGestureChange('swipeVolume', checked)}
                  />
                  <Label htmlFor="swipeVolume">Swipe for Volume</Label>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Keyboard className="h-5 w-5" />
                Keyboard Shortcuts
              </h3>
              <div className="flex items-center space-x-2">
                <Switch
                  id="keyboardEnabled"
                  checked={config.keyboard?.enabled ?? true}
                  onCheckedChange={(checked) => updateConfig({
                    keyboard: { ...config.keyboard, enabled: checked }
                  })}
                />
                <Label htmlFor="keyboardEnabled">Enable Keyboard Shortcuts</Label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="save" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Save className="h-5 w-5" />
                Save Configuration
              </h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Configuration name..."
                  value={saveConfigName}
                  onChange={(e) => setSaveConfigName(e.target.value)}
                />
                <Button 
                  onClick={() => {
                    if (saveConfigName.trim()) {
                      saveConfig(saveConfigName.trim());
                      setSaveConfigName('');
                    }
                  }}
                  disabled={!saveConfigName.trim()}
                >
                  Save
                </Button>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-4">Quick Presets</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {presets.map((preset) => (
                  <Button
                    key={preset}
                    variant="outline"
                    onClick={() => loadPreset(preset)}
                    className="justify-start"
                  >
                    <Badge variant="secondary" className="mr-2">
                      {preset}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
