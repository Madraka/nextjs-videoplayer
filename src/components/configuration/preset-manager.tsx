"use client";
/**
 * Preset Manager Component
 * Management interface for player configuration presets
 */

import React, { useState } from 'react';
import { Settings, Save, Download, Upload, Copy, Trash2, Star, Edit3, Plus, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PlayerPreset {
  id: string;
  name: string;
  description: string;
  category: 'streaming' | 'educational' | 'entertainment' | 'enterprise' | 'custom';
  isDefault: boolean;
  isFavorite: boolean;
  createdAt: Date;
  lastModified: Date;
  config: {
    // Playback settings
    autoplay: boolean;
    loop: boolean;
    muted: boolean;
    volume: number;
    playbackRate: number;
    
    // Controls
    controls: boolean;
    showProgress: boolean;
    showVolume: boolean;
    showFullscreen: boolean;
    showQuality: boolean;
    
    // Advanced
    adaptiveQuality: boolean;
    maxBufferLength: number;
    keyboardShortcuts: boolean;
    analytics: boolean;
    
    // UI
    theme: string;
    accentColor: string;
    showThumbnails: boolean;
    showChapters: boolean;
  };
  usage: {
    timesUsed: number;
    lastUsed?: Date;
  };
}

interface PresetManagerProps {
  presets: PlayerPreset[];
  currentPreset?: PlayerPreset;
  onPresetSelect: (preset: PlayerPreset) => void;
  onPresetCreate: (preset: Omit<PlayerPreset, 'id' | 'createdAt' | 'lastModified' | 'usage'>) => void;
  onPresetUpdate: (presetId: string, updates: Partial<PlayerPreset>) => void;
  onPresetDelete: (presetId: string) => void;
  onPresetDuplicate: (preset: PlayerPreset) => void;
  onPresetExport: (preset: PlayerPreset) => void;
  onPresetImport: (file: File) => void;
  className?: string;
}

const defaultPresets: PlayerPreset[] = [
  {
    id: 'youtube-style',
    name: 'YouTube Style',
    description: 'YouTube-like player configuration',
    category: 'entertainment',
    isDefault: true,
    isFavorite: false,
    createdAt: new Date('2024-01-01'),
    lastModified: new Date('2024-01-01'),
    config: {
      autoplay: false,
      loop: false,
      muted: false,
      volume: 1,
      playbackRate: 1,
      controls: true,
      showProgress: true,
      showVolume: true,
      showFullscreen: true,
      showQuality: true,
      adaptiveQuality: true,
      maxBufferLength: 30,
      keyboardShortcuts: true,
      analytics: true,
      theme: 'dark',
      accentColor: '#ff0000',
      showThumbnails: true,
      showChapters: true
    },
    usage: { timesUsed: 150 }
  },
  {
    id: 'minimal-player',
    name: 'Minimal Player',
    description: 'Clean, minimal controls',
    category: 'custom',
    isDefault: true,
    isFavorite: false,
    createdAt: new Date('2024-01-01'),
    lastModified: new Date('2024-01-01'),
    config: {
      autoplay: true,
      loop: true,
      muted: true,
      volume: 0.8,
      playbackRate: 1,
      controls: false,
      showProgress: false,
      showVolume: false,
      showFullscreen: false,
      showQuality: false,
      adaptiveQuality: true,
      maxBufferLength: 15,
      keyboardShortcuts: false,
      analytics: false,
      theme: 'light',
      accentColor: '#3b82f6',
      showThumbnails: false,
      showChapters: false
    },
    usage: { timesUsed: 89 }
  },
  {
    id: 'educational',
    name: 'Educational Content',
    description: 'Optimized for learning content',
    category: 'educational',
    isDefault: true,
    isFavorite: true,
    createdAt: new Date('2024-01-01'),
    lastModified: new Date('2024-01-01'),
    config: {
      autoplay: false,
      loop: false,
      muted: false,
      volume: 1,
      playbackRate: 1,
      controls: true,
      showProgress: true,
      showVolume: true,
      showFullscreen: true,
      showQuality: true,
      adaptiveQuality: true,
      maxBufferLength: 60,
      keyboardShortcuts: true,
      analytics: true,
      theme: 'light',
      accentColor: '#10b981',
      showThumbnails: true,
      showChapters: true
    },
    usage: { timesUsed: 67 }
  }
];

export const PresetManager: React.FC<PresetManagerProps> = ({
  presets = defaultPresets,
  currentPreset,
  onPresetSelect,
  onPresetCreate,
  onPresetUpdate,
  onPresetDelete,
  onPresetDuplicate,
  onPresetExport,
  onPresetImport,
  className
}) => {
  const [selectedTab, setSelectedTab] = useState('browse');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPreset, setEditingPreset] = useState<PlayerPreset | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetDescription, setNewPresetDescription] = useState('');
  const [newPresetCategory, setNewPresetCategory] = useState<PlayerPreset['category']>('custom');

  // Filter presets based on search and category
  const filteredPresets = presets.filter(preset => {
    const matchesSearch = preset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         preset.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || preset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePresetToggleFavorite = (preset: PlayerPreset) => {
    onPresetUpdate(preset.id, { isFavorite: !preset.isFavorite });
  };

  const handlePresetEdit = (preset: PlayerPreset) => {
    setEditingPreset({ ...preset });
  };

  const handlePresetSave = () => {
    if (editingPreset) {
      onPresetUpdate(editingPreset.id, {
        name: editingPreset.name,
        description: editingPreset.description,
        category: editingPreset.category,
        lastModified: new Date()
      });
      setEditingPreset(null);
    }
  };

  const handlePresetCreate = () => {
    if (newPresetName.trim() && currentPreset) {
      onPresetCreate({
        name: newPresetName,
        description: newPresetDescription,
        category: newPresetCategory,
        isDefault: false,
        isFavorite: false,
        config: currentPreset.config
      });
      setShowCreateDialog(false);
      setNewPresetName('');
      setNewPresetDescription('');
      setNewPresetCategory('custom');
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onPresetImport(file);
    }
  };

  const getCategoryIcon = (category: PlayerPreset['category']) => {
    switch (category) {
      case 'streaming': return '📺';
      case 'educational': return '📚';
      case 'entertainment': return '🎬';
      case 'enterprise': return '🏢';
      case 'custom': return '⚙️';
      default: return '📦';
    }
  };

  const getCategoryColor = (category: PlayerPreset['category']) => {
    switch (category) {
      case 'streaming': return 'bg-blue-100 text-blue-800';
      case 'educational': return 'bg-green-100 text-green-800';
      case 'entertainment': return 'bg-purple-100 text-purple-800';
      case 'enterprise': return 'bg-gray-100 text-gray-800';
      case 'custom': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Settings className="w-6 h-6 mr-2" />
            Preset Manager
          </h2>
          <p className="text-muted-foreground">
            Manage player configuration presets
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {currentPreset && (
            <Badge variant="outline">
              Current: {currentPreset.name}
            </Badge>
          )}
          
          <Button
            size="sm"
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Preset
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="import">Import/Export</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search presets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="streaming">📺 Streaming</SelectItem>
                <SelectItem value="educational">📚 Educational</SelectItem>
                <SelectItem value="entertainment">🎬 Entertainment</SelectItem>
                <SelectItem value="enterprise">🏢 Enterprise</SelectItem>
                <SelectItem value="custom">⚙️ Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Presets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPresets.map((preset) => (
              <Card 
                key={preset.id}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-md",
                  currentPreset?.id === preset.id && "ring-2 ring-primary"
                )}
                onClick={() => onPresetSelect(preset)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base flex items-center">
                        <span className="mr-2">{getCategoryIcon(preset.category)}</span>
                        {editingPreset?.id === preset.id ? (
                          <Input
                            value={editingPreset.name}
                            onChange={(e) => setEditingPreset({ ...editingPreset, name: e.target.value })}
                            onClick={(e) => e.stopPropagation()}
                            className="h-6 text-base font-semibold"
                          />
                        ) : (
                          <span className="truncate">{preset.name}</span>
                        )}
                      </CardTitle>
                      
                      {editingPreset?.id === preset.id ? (
                        <Input
                          value={editingPreset.description}
                          onChange={(e) => setEditingPreset({ ...editingPreset, description: e.target.value })}
                          onClick={(e) => e.stopPropagation()}
                          className="h-6 text-xs mt-1"
                        />
                      ) : (
                        <p className="text-xs text-muted-foreground mt-1">{preset.description}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-1 ml-2">
                      {preset.isDefault && (
                        <Badge variant="secondary" className="text-xs">
                          Default
                        </Badge>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePresetToggleFavorite(preset);
                        }}
                      >
                        <Star 
                          className={cn(
                            "w-3 h-3",
                            preset.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
                          )} 
                        />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className={cn("text-xs", getCategoryColor(preset.category))}>
                      {preset.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Used {preset.usage.timesUsed} times
                    </span>
                  </div>
                  
                  {/* Quick Config Preview */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span>Autoplay:</span>
                      <span>{preset.config.autoplay ? '✓' : '✗'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Controls:</span>
                      <span>{preset.config.controls ? '✓' : '✗'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Analytics:</span>
                      <span>{preset.config.analytics ? '✓' : '✗'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Adaptive:</span>
                      <span>{preset.config.adaptiveQuality ? '✓' : '✗'}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    {editingPreset?.id === preset.id ? (
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePresetSave();
                          }}
                          className="h-6 px-2"
                        >
                          <Check className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingPreset(null);
                          }}
                          className="h-6 px-2"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePresetEdit(preset);
                          }}
                          className="h-6 px-2"
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onPresetDuplicate(preset);
                          }}
                          className="h-6 px-2"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onPresetExport(preset);
                          }}
                          className="h-6 px-2"
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                        
                        {!preset.isDefault && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onPresetDelete(preset.id);
                            }}
                            className="h-6 px-2 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    )}
                    
                    {currentPreset?.id === preset.id && (
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

        <TabsContent value="favorites" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {presets.filter(preset => preset.isFavorite).map((preset) => (
              <Card 
                key={preset.id}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-md",
                  currentPreset?.id === preset.id && "ring-2 ring-primary"
                )}
                onClick={() => onPresetSelect(preset)}
              >
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <Star className="w-4 h-4 mr-2 fill-yellow-400 text-yellow-400" />
                    {preset.name}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">{preset.description}</p>
                </CardHeader>
                
                <CardContent>
                  <Badge className={cn("text-xs", getCategoryColor(preset.category))}>
                    {preset.category}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="import" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Import Preset</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Import preset configurations from JSON files.
                </p>
                
                <div>
                  <Input
                    type="file"
                    accept=".json"
                    onChange={handleFileImport}
                    className="hidden"
                    id="preset-import"
                  />
                  <Label htmlFor="preset-import">
                    <Button className="w-full" asChild>
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        Import Preset File
                      </span>
                    </Button>
                  </Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export All Presets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Export all your presets as a backup file.
                </p>
                
                <Button
                  onClick={() => {
                    // Export all presets logic
                    const dataStr = JSON.stringify(presets, null, 2);
                    const dataBlob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(dataBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `video-player-presets-${new Date().toISOString().split('T')[0]}.json`;
                    link.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export All Presets
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Preset Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Preset</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Preset Name</Label>
              <Input
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                placeholder="My Custom Preset"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={newPresetDescription}
                onChange={(e) => setNewPresetDescription(e.target.value)}
                placeholder="Describe your preset configuration"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={newPresetCategory} onValueChange={(value: any) => setNewPresetCategory(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">⚙️ Custom</SelectItem>
                  <SelectItem value="streaming">📺 Streaming</SelectItem>
                  <SelectItem value="educational">📚 Educational</SelectItem>
                  <SelectItem value="entertainment">🎬 Entertainment</SelectItem>
                  <SelectItem value="enterprise">🏢 Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePresetCreate}
                disabled={!newPresetName.trim()}
              >
                Create Preset
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
