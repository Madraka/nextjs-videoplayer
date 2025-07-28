"use client";
/**
 * Theme Selector Component
 * Theme selection and customization interface
 */

import React, { useState, useEffect } from 'react';
import { Palette, Sun, Moon, Monitor, Download, Upload, Eye, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  foreground: string;
  accent: string;
  muted: string;
  border: string;
  destructive: string;
}

interface Theme {
  id: string;
  name: string;
  description: string;
  mode: 'light' | 'dark' | 'auto';
  colors: ThemeColors;
  borderRadius: number;
  fontSize: number;
  spacing: number;
  shadows: boolean;
  animations: boolean;
  customCSS?: string;
}

interface ThemeSelectorProps {
  currentTheme: Theme;
  availableThemes: Theme[];
  onThemeChange: (theme: Theme) => void;
  onThemeCustomize: (theme: Theme) => void;
  onThemeCreate: (theme: Theme) => void;
  onThemeDelete?: (themeId: string) => void;
  onThemeExport?: (theme: Theme) => void;
  onThemeImport?: (file: File) => void;
  className?: string;
}

const defaultThemes: Theme[] = [
  {
    id: 'light',
    name: 'Light',
    description: 'Clean light theme',
    mode: 'light',
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      background: '#ffffff',
      foreground: '#0f172a',
      accent: '#f1f5f9',
      muted: '#64748b',
      border: '#e2e8f0',
      destructive: '#ef4444'
    },
    borderRadius: 8,
    fontSize: 14,
    spacing: 16,
    shadows: true,
    animations: true
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Modern dark theme',
    mode: 'dark',
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      background: '#0f172a',
      foreground: '#f8fafc',
      accent: '#1e293b',
      muted: '#64748b',
      border: '#334155',
      destructive: '#ef4444'
    },
    borderRadius: 8,
    fontSize: 14,
    spacing: 16,
    shadows: true,
    animations: true
  },
  {
    id: 'youtube',
    name: 'YouTube Style',
    description: 'YouTube-inspired theme',
    mode: 'dark',
    colors: {
      primary: '#ff0000',
      secondary: '#606060',
      background: '#181818',
      foreground: '#ffffff',
      accent: '#272727',
      muted: '#aaaaaa',
      border: '#303030',
      destructive: '#ff4444'
    },
    borderRadius: 4,
    fontSize: 13,
    spacing: 12,
    shadows: false,
    animations: true
  },
  {
    id: 'netflix',
    name: 'Netflix Style',
    description: 'Netflix-inspired theme',
    mode: 'dark',
    colors: {
      primary: '#e50914',
      secondary: '#564d4d',
      background: '#141414',
      foreground: '#ffffff',
      accent: '#2f2f2f',
      muted: '#808080',
      border: '#404040',
      destructive: '#ff6b6b'
    },
    borderRadius: 6,
    fontSize: 14,
    spacing: 14,
    shadows: true,
    animations: true
  }
];

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  availableThemes = defaultThemes,
  onThemeChange,
  onThemeCustomize,
  onThemeCreate,
  onThemeDelete,
  onThemeExport,
  onThemeImport,
  className
}) => {
  const [selectedTab, setSelectedTab] = useState('presets');
  const [customTheme, setCustomTheme] = useState<Theme>(currentTheme);
  const [isCustomizing, setIsCustomizing] = useState(false);

  useEffect(() => {
    setCustomTheme(currentTheme);
  }, [currentTheme]);

  const updateCustomTheme = (updates: Partial<Theme>) => {
    const updated = { ...customTheme, ...updates };
    setCustomTheme(updated);
    if (isCustomizing) {
      onThemeCustomize(updated);
    }
  };

  const updateThemeColors = (colorUpdates: Partial<ThemeColors>) => {
    updateCustomTheme({
      colors: { ...customTheme.colors, ...colorUpdates }
    });
  };

  const handleThemeSelect = (theme: Theme) => {
    onThemeChange(theme);
    setCustomTheme(theme);
  };

  const handleCustomizationStart = () => {
    setIsCustomizing(true);
    setSelectedTab('customize');
  };

  const handleCustomizationSave = () => {
    const newTheme = {
      ...customTheme,
      id: `custom-${Date.now()}`,
      name: customTheme.name || 'Custom Theme'
    };
    onThemeCreate(newTheme);
    setIsCustomizing(false);
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onThemeImport) {
      onThemeImport(file);
    }
  };

  const colorPresets = [
    { name: 'Blue', primary: '#3b82f6', accent: '#dbeafe' },
    { name: 'Purple', primary: '#8b5cf6', accent: '#ede9fe' },
    { name: 'Green', primary: '#10b981', accent: '#dcfce7' },
    { name: 'Red', primary: '#ef4444', accent: '#fee2e2' },
    { name: 'Orange', primary: '#f97316', accent: '#fed7aa' },
    { name: 'Pink', primary: '#ec4899', accent: '#fce7f3' }
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Palette className="w-6 h-6 mr-2" />
            Theme Selector
          </h2>
          <p className="text-muted-foreground">
            Choose and customize player themes
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            Current: {currentTheme.name}
          </Badge>
          
          {isCustomizing && (
            <Button
              size="sm"
              onClick={handleCustomizationSave}
            >
              <Check className="w-4 h-4 mr-2" />
              Save Theme
            </Button>
          )}
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="presets">Presets</TabsTrigger>
          <TabsTrigger value="customize">Customize</TabsTrigger>
          <TabsTrigger value="import">Import/Export</TabsTrigger>
        </TabsList>

        <TabsContent value="presets" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableThemes.map((theme) => (
              <Card 
                key={theme.id}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-md",
                  currentTheme.id === theme.id && "ring-2 ring-primary"
                )}
                onClick={() => handleThemeSelect(theme)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{theme.name}</CardTitle>
                    <div className="flex items-center space-x-1">
                      {theme.mode === 'light' && <Sun className="w-4 h-4" />}
                      {theme.mode === 'dark' && <Moon className="w-4 h-4" />}
                      {theme.mode === 'auto' && <Monitor className="w-4 h-4" />}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{theme.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {/* Color Preview */}
                  <div className="grid grid-cols-4 gap-1 h-8">
                    <div 
                      className="rounded" 
                      style={{ backgroundColor: theme.colors.primary }}
                      title="Primary"
                    />
                    <div 
                      className="rounded" 
                      style={{ backgroundColor: theme.colors.secondary }}
                      title="Secondary"
                    />
                    <div 
                      className="rounded" 
                      style={{ backgroundColor: theme.colors.accent }}
                      title="Accent"
                    />
                    <div 
                      className="rounded border" 
                      style={{ backgroundColor: theme.colors.background }}
                      title="Background"
                    />
                  </div>
                  
                  {/* Theme Properties */}
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Radius: {theme.borderRadius}px</span>
                    <span>Size: {theme.fontSize}px</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCustomTheme(theme);
                        handleCustomizationStart();
                      }}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Customize
                    </Button>
                    
                    {currentTheme.id === theme.id && (
                      <Badge variant="default" className="text-xs">
                        Active
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="customize" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customization Panel */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Theme Name</Label>
                      <Input
                        value={customTheme.name}
                        onChange={(e) => updateCustomTheme({ name: e.target.value })}
                        placeholder="Custom Theme"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Mode</Label>
                      <Select
                        value={customTheme.mode}
                        onValueChange={(value: any) => updateCustomTheme({ mode: value })}
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
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      value={customTheme.description}
                      onChange={(e) => updateCustomTheme({ description: e.target.value })}
                      placeholder="Theme description"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Colors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Primary Color</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="color"
                          value={customTheme.colors.primary}
                          onChange={(e) => updateThemeColors({ primary: e.target.value })}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={customTheme.colors.primary}
                          onChange={(e) => updateThemeColors({ primary: e.target.value })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Secondary Color</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="color"
                          value={customTheme.colors.secondary}
                          onChange={(e) => updateThemeColors({ secondary: e.target.value })}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={customTheme.colors.secondary}
                          onChange={(e) => updateThemeColors({ secondary: e.target.value })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Background Color</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="color"
                          value={customTheme.colors.background}
                          onChange={(e) => updateThemeColors({ background: e.target.value })}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={customTheme.colors.background}
                          onChange={(e) => updateThemeColors({ background: e.target.value })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Accent Color</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="color"
                          value={customTheme.colors.accent}
                          onChange={(e) => updateThemeColors({ accent: e.target.value })}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={customTheme.colors.accent}
                          onChange={(e) => updateThemeColors({ accent: e.target.value })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Color Presets</Label>
                    <div className="flex space-x-2">
                      {colorPresets.map((preset) => (
                        <button
                          key={preset.name}
                          className="w-8 h-8 rounded border-2 border-gray-300 hover:scale-110 transition-transform"
                          style={{ backgroundColor: preset.primary }}
                          onClick={() => updateThemeColors({ 
                            primary: preset.primary, 
                            accent: preset.accent 
                          })}
                          title={preset.name}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Layout & Typography</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Border Radius ({customTheme.borderRadius}px)</Label>
                      <Slider
                        value={[customTheme.borderRadius]}
                        onValueChange={([value]) => updateCustomTheme({ borderRadius: value })}
                        min={0}
                        max={20}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Font Size ({customTheme.fontSize}px)</Label>
                      <Slider
                        value={[customTheme.fontSize]}
                        onValueChange={([value]) => updateCustomTheme({ fontSize: value })}
                        min={10}
                        max={20}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Spacing ({customTheme.spacing}px)</Label>
                      <Slider
                        value={[customTheme.spacing]}
                        onValueChange={([value]) => updateCustomTheme({ spacing: value })}
                        min={8}
                        max={24}
                        step={2}
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Shadows</Label>
                      <Switch
                        checked={customTheme.shadows}
                        onCheckedChange={(checked) => updateCustomTheme({ shadows: checked })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Animations</Label>
                      <Switch
                        checked={customTheme.animations}
                        onCheckedChange={(checked) => updateCustomTheme({ animations: checked })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview Panel */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="space-y-3 p-4 rounded border"
                    style={{
                      backgroundColor: customTheme.colors.background,
                      color: customTheme.colors.foreground,
                      borderRadius: `${customTheme.borderRadius}px`,
                      fontSize: `${customTheme.fontSize}px`,
                      borderColor: customTheme.colors.border
                    }}
                  >
                    <div 
                      className="px-3 py-2 rounded text-white font-medium"
                      style={{ 
                        backgroundColor: customTheme.colors.primary,
                        borderRadius: `${customTheme.borderRadius}px`
                      }}
                    >
                      Primary Button
                    </div>
                    
                    <div 
                      className="px-3 py-2 rounded border"
                      style={{ 
                        backgroundColor: customTheme.colors.accent,
                        borderColor: customTheme.colors.border,
                        borderRadius: `${customTheme.borderRadius}px`
                      }}
                    >
                      Card Content
                    </div>
                    
                    <div className="flex space-x-2">
                      <div 
                        className="w-12 h-3 rounded"
                        style={{ backgroundColor: customTheme.colors.primary }}
                      />
                      <div 
                        className="w-8 h-3 rounded"
                        style={{ backgroundColor: customTheme.colors.secondary }}
                      />
                      <div 
                        className="w-16 h-3 rounded"
                        style={{ backgroundColor: customTheme.colors.accent }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="import" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Export Theme</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Export your current theme configuration as a JSON file.
                </p>
                
                <Button
                  onClick={() => onThemeExport && onThemeExport(customTheme)}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Current Theme
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Import Theme</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Import a theme configuration from a JSON file.
                </p>
                
                <div>
                  <Input
                    type="file"
                    accept=".json"
                    onChange={handleFileImport}
                    className="hidden"
                    id="theme-import"
                  />
                  <Label htmlFor="theme-import">
                    <Button className="w-full" asChild>
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        Import Theme File
                      </span>
                    </Button>
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
