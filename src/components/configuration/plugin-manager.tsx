"use client";
/**
 * Plugin Manager Component
 * Plugin installation, configuration, and management interface
 */

import React, { useState } from 'react';
import { Puzzle, Download, Settings, Power, AlertTriangle, Check, X, Search, Filter, Star, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface PluginConfig {
  [key: string]: any;
}

interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  category: 'analytics' | 'streaming' | 'accessibility' | 'ai' | 'social' | 'monetization' | 'enhancement';
  author: string;
  homepage?: string;
  isInstalled: boolean;
  isEnabled: boolean;
  isOfficial: boolean;
  rating: number;
  downloads: number;
  size: number; // in KB
  lastUpdated: Date;
  dependencies: string[];
  permissions: string[];
  config?: PluginConfig;
  screenshots?: string[];
  changelog?: string;
}

interface PluginManagerProps {
  installedPlugins: Plugin[];
  availablePlugins: Plugin[];
  onPluginInstall: (pluginId: string) => Promise<void>;
  onPluginUninstall: (pluginId: string) => Promise<void>;
  onPluginEnable: (pluginId: string) => void;
  onPluginDisable: (pluginId: string) => void;
  onPluginConfigure: (pluginId: string, config: PluginConfig) => void;
  className?: string;
}

const samplePlugins: Plugin[] = [
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    version: '2.1.0',
    description: 'Advanced analytics tracking for video engagement',
    category: 'analytics',
    author: 'Google',
    homepage: 'https://analytics.google.com',
    isInstalled: true,
    isEnabled: true,
    isOfficial: true,
    rating: 4.8,
    downloads: 150000,
    size: 45,
    lastUpdated: new Date('2024-01-15'),
    dependencies: [],
    permissions: ['network', 'storage'],
    config: {
      trackingId: 'GA-XXXXXXXXX',
      enableEcommerce: false,
      customDimensions: []
    }
  },
  {
    id: 'hls-enhancer',
    name: 'HLS Stream Enhancer',
    version: '1.5.2',
    description: 'Advanced HLS streaming optimizations and features',
    category: 'streaming',
    author: 'StreamLabs',
    isInstalled: true,
    isEnabled: false,
    isOfficial: false,
    rating: 4.6,
    downloads: 89000,
    size: 125,
    lastUpdated: new Date('2024-01-10'),
    dependencies: ['hls.js'],
    permissions: ['network', 'media'],
    config: {
      autoQualitySwitching: true,
      maxBitrate: 8000,
      bufferSize: 30
    }
  },
  {
    id: 'ai-captions',
    name: 'AI Auto Captions',
    version: '3.0.1',
    description: 'Automatic caption generation using AI',
    category: 'ai',
    author: 'AI Labs',
    homepage: 'https://ailabs.example.com',
    isInstalled: false,
    isEnabled: false,
    isOfficial: true,
    rating: 4.9,
    downloads: 67000,
    size: 280,
    lastUpdated: new Date('2024-01-20'),
    dependencies: ['tensorflow.js'],
    permissions: ['microphone', 'network', 'storage'],
    config: {
      language: 'en',
      accuracy: 'high',
      realtime: true
    }
  },
  {
    id: 'social-sharing',
    name: 'Social Media Sharing',
    version: '1.8.0',
    description: 'Share videos across social media platforms',
    category: 'social',
    author: 'SocialTech',
    isInstalled: false,
    isEnabled: false,
    isOfficial: false,
    rating: 4.3,
    downloads: 45000,
    size: 78,
    lastUpdated: new Date('2024-01-08'),
    dependencies: [],
    permissions: ['network'],
    config: {
      platforms: ['twitter', 'facebook', 'linkedin'],
      includeTimestamp: true,
      customMessage: ''
    }
  },
  {
    id: 'accessibility-plus',
    name: 'Accessibility Plus',
    version: '2.2.1',
    description: 'Enhanced accessibility features for video players',
    category: 'accessibility',
    author: 'A11y Foundation',
    homepage: 'https://a11y.org',
    isInstalled: true,
    isEnabled: true,
    isOfficial: true,
    rating: 4.7,
    downloads: 34000,
    size: 92,
    lastUpdated: new Date('2024-01-12'),
    dependencies: [],
    permissions: ['keyboard', 'screen-reader'],
    config: {
      highContrast: false,
      keyboardNavigation: true,
      screenReaderAnnouncements: true
    }
  }
];

export const PluginManager: React.FC<PluginManagerProps> = ({
  installedPlugins = samplePlugins.filter(p => p.isInstalled),
  availablePlugins = samplePlugins,
  onPluginInstall,
  onPluginUninstall,
  onPluginEnable,
  onPluginDisable,
  onPluginConfigure,
  className
}) => {
  const [selectedTab, setSelectedTab] = useState('installed');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null);
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [configForm, setConfigForm] = useState<PluginConfig>({});
  const [isInstalling, setIsInstalling] = useState<string | null>(null);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'analytics', label: '📊 Analytics' },
    { value: 'streaming', label: '📺 Streaming' },
    { value: 'accessibility', label: '♿ Accessibility' },
    { value: 'ai', label: '🤖 AI Features' },
    { value: 'social', label: '📱 Social' },
    { value: 'monetization', label: '💰 Monetization' },
    { value: 'enhancement', label: '⚡ Enhancement' }
  ];

  const filterPlugins = (plugins: Plugin[]) => {
    return plugins.filter(plugin => {
      const matchesSearch = plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           plugin.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || plugin.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };

  const handlePluginInstall = async (plugin: Plugin) => {
    setIsInstalling(plugin.id);
    try {
      await onPluginInstall(plugin.id);
    } finally {
      setIsInstalling(null);
    }
  };

  const handlePluginConfigure = (plugin: Plugin) => {
    setSelectedPlugin(plugin);
    setConfigForm(plugin.config || {});
    setShowConfigDialog(true);
  };

  const handleConfigSave = () => {
    if (selectedPlugin) {
      onPluginConfigure(selectedPlugin.id, configForm);
      setShowConfigDialog(false);
    }
  };

  const formatFileSize = (sizeInKB: number) => {
    if (sizeInKB < 1024) return `${sizeInKB} KB`;
    return `${(sizeInKB / 1024).toFixed(1)} MB`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getCategoryIcon = (category: Plugin['category']) => {
    switch (category) {
      case 'analytics': return '📊';
      case 'streaming': return '📺';
      case 'accessibility': return '♿';
      case 'ai': return '🤖';
      case 'social': return '📱';
      case 'monetization': return '💰';
      case 'enhancement': return '⚡';
      default: return '🔌';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "w-3 h-3",
          i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        )}
      />
    ));
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Puzzle className="w-6 h-6 mr-2" />
            Plugin Manager
          </h2>
          <p className="text-muted-foreground">
            Install and manage video player plugins
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            {installedPlugins.length} installed
          </Badge>
          <Badge variant="outline">
            {installedPlugins.filter(p => p.isEnabled).length} active
          </Badge>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="installed">Installed</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Search and Filter */}
        <div className="flex items-center space-x-4 mt-4">
          <div className="flex-1">
            <Input
              placeholder="Search plugins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="installed" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterPlugins(installedPlugins).map((plugin) => (
              <Card key={plugin.id} className="transition-all duration-200 hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base flex items-center">
                        <span className="mr-2">{getCategoryIcon(plugin.category)}</span>
                        <span className="truncate">{plugin.name}</span>
                        {plugin.isOfficial && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            Official
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">{plugin.description}</p>
                    </div>
                    
                    <Switch
                      checked={plugin.isEnabled}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          onPluginEnable(plugin.id);
                        } else {
                          onPluginDisable(plugin.id);
                        }
                      }}
                      className="ml-2"
                    />
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">v{plugin.version}</span>
                    <div className="flex items-center space-x-1">
                      {renderStars(plugin.rating)}
                      <span className="text-muted-foreground ml-1">({plugin.rating})</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>by {plugin.author}</span>
                    <span>{formatFileSize(plugin.size)}</span>
                  </div>
                  
                  {plugin.isEnabled && plugin.config && (
                    <div className="pt-2 border-t">
                      <div className="text-xs text-muted-foreground mb-2">Configuration</div>
                      <div className="space-y-1 text-xs">
                        {Object.entries(plugin.config).slice(0, 2).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                            <span className="font-medium">
                              {typeof value === 'boolean' ? (value ? '✓' : '✗') : String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePluginConfigure(plugin)}
                        disabled={!plugin.isEnabled}
                        className="h-6 px-2"
                      >
                        <Settings className="w-3 h-3" />
                      </Button>
                      
                      {plugin.homepage && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(plugin.homepage, '_blank')}
                          className="h-6 px-2"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPluginUninstall(plugin.id)}
                      className="h-6 px-2 text-red-600 hover:text-red-700"
                    >
                      Uninstall
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterPlugins(availablePlugins.filter(p => !p.isInstalled)).map((plugin) => (
              <Card key={plugin.id} className="transition-all duration-200 hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base flex items-center">
                        <span className="mr-2">{getCategoryIcon(plugin.category)}</span>
                        <span className="truncate">{plugin.name}</span>
                        {plugin.isOfficial && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            Official
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">{plugin.description}</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">v{plugin.version}</span>
                    <div className="flex items-center space-x-1">
                      {renderStars(plugin.rating)}
                      <span className="text-muted-foreground ml-1">({plugin.rating})</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>by {plugin.author}</span>
                    <span>{formatNumber(plugin.downloads)} downloads</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Size: {formatFileSize(plugin.size)}</span>
                    <span>Updated: {plugin.lastUpdated.toLocaleDateString()}</span>
                  </div>
                  
                  {plugin.dependencies.length > 0 && (
                    <div className="pt-2 border-t">
                      <div className="text-xs text-muted-foreground mb-1">Dependencies:</div>
                      <div className="flex flex-wrap gap-1">
                        {plugin.dependencies.map(dep => (
                          <Badge key={dep} variant="outline" className="text-xs">
                            {dep}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {plugin.permissions.length > 0 && (
                    <div className="pt-2 border-t">
                      <div className="text-xs text-muted-foreground mb-1">Permissions:</div>
                      <div className="flex flex-wrap gap-1">
                        {plugin.permissions.map(permission => (
                          <Badge key={permission} variant="outline" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <Badge className="text-xs capitalize">
                      {plugin.category}
                    </Badge>
                    
                    <Button
                      size="sm"
                      onClick={() => handlePluginInstall(plugin)}
                      disabled={isInstalling === plugin.id}
                      className="h-6 px-3"
                    >
                      {isInstalling === plugin.id ? (
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Download className="w-3 h-3 mr-1" />
                          Install
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Plugin Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Auto-update plugins</Label>
                  <Switch defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label>Allow beta versions</Label>
                  <Switch />
                </div>
                
                <div className="space-y-2">
                  <Label>Enable plugin telemetry</Label>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <Button variant="outline" className="w-full">
                  Clear Plugin Cache
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Plugin Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Total Installed</div>
                    <div className="text-xl font-bold">{installedPlugins.length}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Active</div>
                    <div className="text-xl font-bold">{installedPlugins.filter(p => p.isEnabled).length}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Total Size</div>
                    <div className="text-xl font-bold">
                      {formatFileSize(installedPlugins.reduce((sum, p) => sum + p.size, 0))}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Official</div>
                    <div className="text-xl font-bold">{installedPlugins.filter(p => p.isOfficial).length}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Plugin Configuration Dialog */}
      <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Configure {selectedPlugin?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedPlugin && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(configForm).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label className="capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                    {typeof value === 'boolean' ? (
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => 
                          setConfigForm(prev => ({ ...prev, [key]: checked }))
                        }
                      />
                    ) : typeof value === 'number' ? (
                      <Input
                        type="number"
                        value={value}
                        onChange={(e) => 
                          setConfigForm(prev => ({ ...prev, [key]: Number(e.target.value) }))
                        }
                      />
                    ) : (
                      <Input
                        value={String(value)}
                        onChange={(e) => 
                          setConfigForm(prev => ({ ...prev, [key]: e.target.value }))
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowConfigDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleConfigSave}>
                  Save Configuration
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
