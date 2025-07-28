"use client";
/**
 * Player Configurator Component
 * Comprehensive player configuration interface with live preview
 */

import React, { useState, useEffect } from 'react';
import { Settings, Play, Save, RotateCcw, Download, Upload, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PlayerConfig {
  // Playback settings
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
  preload: 'none' | 'metadata' | 'auto';
  playbackRate: number;
  volume: number;

  // Controls settings
  controls: boolean;
  controlsTimeout: number;
  showProgress: boolean;
  showVolume: boolean;
  showFullscreen: boolean;
  showPictureInPicture: boolean;
  showPlaybackRate: boolean;
  showQuality: boolean;

  // UI settings
  theme: 'light' | 'dark' | 'auto';
  accentColor: string;
  borderRadius: number;
  showThumbnails: boolean;
  showChapters: boolean;
  keyboardShortcuts: boolean;

  // Advanced settings
  adaptiveQuality: boolean;
  maxBufferLength: number;
  seekStep: number;
  volumeStep: number;
  errorRecovery: boolean;
  analytics: boolean;
  customCSS?: string;
}

interface PlayerConfiguratorProps {
  config: PlayerConfig;
  onChange: (config: PlayerConfig) => void;
  onPreview?: (config: PlayerConfig) => void;
  onSave?: (config: PlayerConfig) => void;
  onReset?: () => void;
  onExport?: (config: PlayerConfig) => void;
  onImport?: (file: File) => void;
  showPreview?: boolean;
  className?: string;
}

const defaultConfig: PlayerConfig = {
  autoplay: false,
  loop: false,
  muted: false,
  preload: 'metadata',
  playbackRate: 1,
  volume: 1,
  controls: true,
  controlsTimeout: 3000,
  showProgress: true,
  showVolume: true,
  showFullscreen: true,
  showPictureInPicture: true,
  showPlaybackRate: false,
  showQuality: true,
  theme: 'auto',
  accentColor: '#3b82f6',
  borderRadius: 8,
  showThumbnails: true,
  showChapters: true,
  keyboardShortcuts: true,
  adaptiveQuality: true,
  maxBufferLength: 30,
  seekStep: 10,
  volumeStep: 0.1,
  errorRecovery: true,
  analytics: false
};

export const PlayerConfigurator: React.FC<PlayerConfiguratorProps> = ({
  config,
  onChange,
  onPreview,
  onSave,
  onReset,
  onExport,
  onImport,
  showPreview = true,
  className
}) => {
  const [activeTab, setActiveTab] = useState('playback');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const isDefault = JSON.stringify(config) === JSON.stringify(defaultConfig);
    setHasChanges(!isDefault);
  }, [config]);

  const updateConfig = (updates: Partial<PlayerConfig>) => {
    const newConfig = { ...config, ...updates };
    onChange(newConfig);
    if (onPreview) {
      onPreview(newConfig);
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImport) {
      onImport(file);
    }
  };

  const colorPresets = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Pink', value: '#ec4899' }
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Settings className="w-6 h-6 mr-2" />
            Player Configurator
          </h2>
          <p className="text-muted-foreground">
            Customize player settings and behavior
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {hasChanges && (
            <Badge variant="secondary">
              Unsaved changes
            </Badge>
          )}
          
          {showPreview && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPreview && onPreview(config)}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            disabled={!hasChanges}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          
          <Button
            size="sm"
            onClick={() => onSave && onSave(config)}
            disabled={!hasChanges}
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="playback">Playback</TabsTrigger>
              <TabsTrigger value="controls">Controls</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="playback" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Playback Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Autoplay</Label>
                      <Switch
                        checked={config.autoplay}
                        onCheckedChange={(checked) => updateConfig({ autoplay: checked })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Loop</Label>
                      <Switch
                        checked={config.loop}
                        onCheckedChange={(checked) => updateConfig({ loop: checked })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Start Muted</Label>
                      <Switch
                        checked={config.muted}
                        onCheckedChange={(checked) => updateConfig({ muted: checked })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Preload</Label>
                      <Select
                        value={config.preload}
                        onValueChange={(value: any) => updateConfig({ preload: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="metadata">Metadata</SelectItem>
                          <SelectItem value="auto">Auto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Default Volume ({Math.round(config.volume * 100)}%)</Label>
                      <Slider
                        value={[config.volume]}
                        onValueChange={([value]) => updateConfig({ volume: value })}
                        max={1}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Default Playback Rate ({config.playbackRate}x)</Label>
                      <Slider
                        value={[config.playbackRate]}
                        onValueChange={([value]) => updateConfig({ playbackRate: value })}
                        min={0.25}
                        max={2}
                        step={0.25}
                        className="w-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="controls" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Control Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Show Controls</Label>
                    <Switch
                      checked={config.controls}
                      onCheckedChange={(checked) => updateConfig({ controls: checked })}
                    />
                  </div>
                  
                  {config.controls && (
                    <>
                      <div className="space-y-2">
                        <Label>Controls Timeout ({config.controlsTimeout / 1000}s)</Label>
                        <Slider
                          value={[config.controlsTimeout]}
                          onValueChange={([value]) => updateConfig({ controlsTimeout: value })}
                          min={1000}
                          max={10000}
                          step={500}
                          className="w-full"
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Progress Bar</Label>
                          <Switch
                            checked={config.showProgress}
                            onCheckedChange={(checked) => updateConfig({ showProgress: checked })}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Volume Control</Label>
                          <Switch
                            checked={config.showVolume}
                            onCheckedChange={(checked) => updateConfig({ showVolume: checked })}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Fullscreen Button</Label>
                          <Switch
                            checked={config.showFullscreen}
                            onCheckedChange={(checked) => updateConfig({ showFullscreen: checked })}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Picture-in-Picture</Label>
                          <Switch
                            checked={config.showPictureInPicture}
                            onCheckedChange={(checked) => updateConfig({ showPictureInPicture: checked })}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Playback Rate</Label>
                          <Switch
                            checked={config.showPlaybackRate}
                            onCheckedChange={(checked) => updateConfig({ showPlaybackRate: checked })}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Quality Selector</Label>
                          <Switch
                            checked={config.showQuality}
                            onCheckedChange={(checked) => updateConfig({ showQuality: checked })}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Theme & Appearance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select
                      value={config.theme}
                      onValueChange={(value: any) => updateConfig({ theme: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="auto">Auto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Accent Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="color"
                        value={config.accentColor}
                        onChange={(e) => updateConfig({ accentColor: e.target.value })}
                        className="w-16 h-10 p-1"
                      />
                      <div className="flex space-x-1">
                        {colorPresets.map((preset) => (
                          <button
                            key={preset.value}
                            className="w-6 h-6 rounded border-2 border-gray-300"
                            style={{ backgroundColor: preset.value }}
                            onClick={() => updateConfig({ accentColor: preset.value })}
                            title={preset.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Border Radius ({config.borderRadius}px)</Label>
                    <Slider
                      value={[config.borderRadius]}
                      onValueChange={([value]) => updateConfig({ borderRadius: value })}
                      min={0}
                      max={20}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Show Thumbnails</Label>
                      <Switch
                        checked={config.showThumbnails}
                        onCheckedChange={(checked) => updateConfig({ showThumbnails: checked })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Show Chapters</Label>
                      <Switch
                        checked={config.showChapters}
                        onCheckedChange={(checked) => updateConfig({ showChapters: checked })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Adaptive Quality</Label>
                      <Switch
                        checked={config.adaptiveQuality}
                        onCheckedChange={(checked) => updateConfig({ adaptiveQuality: checked })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Keyboard Shortcuts</Label>
                      <Switch
                        checked={config.keyboardShortcuts}
                        onCheckedChange={(checked) => updateConfig({ keyboardShortcuts: checked })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Error Recovery</Label>
                      <Switch
                        checked={config.errorRecovery}
                        onCheckedChange={(checked) => updateConfig({ errorRecovery: checked })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Analytics</Label>
                      <Switch
                        checked={config.analytics}
                        onCheckedChange={(checked) => updateConfig({ analytics: checked })}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Max Buffer Length ({config.maxBufferLength}s)</Label>
                      <Slider
                        value={[config.maxBufferLength]}
                        onValueChange={([value]) => updateConfig({ maxBufferLength: value })}
                        min={5}
                        max={120}
                        step={5}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Seek Step ({config.seekStep}s)</Label>
                      <Slider
                        value={[config.seekStep]}
                        onValueChange={([value]) => updateConfig({ seekStep: value })}
                        min={5}
                        max={30}
                        step={5}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Volume Step ({Math.round(config.volumeStep * 100)}%)</Label>
                      <Slider
                        value={[config.volumeStep]}
                        onValueChange={([value]) => updateConfig({ volumeStep: value })}
                        min={0.05}
                        max={0.2}
                        step={0.05}
                        className="w-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Actions Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => onExport && onExport(config)}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Config
              </Button>
              
              <div>
                <Input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                  id="config-import"
                />
                <Label htmlFor="config-import">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      Import Config
                    </span>
                  </Button>
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Quick Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => updateConfig({
                  controls: true,
                  showProgress: true,
                  showVolume: true,
                  showFullscreen: true,
                  keyboardShortcuts: true
                })}
              >
                Full Controls
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => updateConfig({
                  controls: false,
                  autoplay: true,
                  loop: true,
                  muted: true
                })}
              >
                Minimal Player
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => updateConfig({
                  adaptiveQuality: true,
                  maxBufferLength: 60,
                  errorRecovery: true,
                  analytics: true
                })}
              >
                Performance Mode
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
