"use client";
/**
 * Advanced Settings Component
 * Advanced configuration options for video player
 */

import React, { useState } from 'react';
import { Settings2, Code, Database, Shield, Zap, Globe, Cpu, HardDrive, Network, Monitor, Save, RotateCcw, AlertTriangle } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface AdvancedConfig {
  // Performance settings
  performance: {
    hardwareAcceleration: boolean;
    webWorkers: boolean;
    memoryLimit: number; // MB
    cpuThrottling: boolean;
    preloadStrategy: 'none' | 'metadata' | 'auto' | 'aggressive';
    cacheSize: number; // MB
    garbageCollection: boolean;
  };

  // Network settings
  network: {
    maxConnections: number;
    timeout: number; // seconds
    retryAttempts: number;
    retryDelay: number; // seconds
    bandwidthEstimation: boolean;
    adaptiveBitrate: boolean;
    lowLatencyMode: boolean;
    p2pStreaming: boolean;
  };

  // Debugging settings
  debugging: {
    enableLogging: boolean;
    logLevel: 'error' | 'warn' | 'info' | 'debug' | 'verbose';
    consoleOutput: boolean;
    remoteLogging: boolean;
    performanceMonitoring: boolean;
    errorReporting: boolean;
    debugOverlay: boolean;
  };

  // Security settings
  security: {
    cors: boolean;
    contentSecurityPolicy: boolean;
    drmSupport: boolean;
    tokenAuthentication: boolean;
    encryptedStreams: boolean;
    referrerPolicy: string;
    allowedDomains: string[];
  };

  // Experimental features
  experimental: {
    webAssembly: boolean;
    serviceWorker: boolean;
    offlineMode: boolean;
    aiFeatures: boolean;
    webRTC: boolean;
    webCodecs: boolean;
    sharedArrayBuffer: boolean;
  };

  // Custom settings
  custom: {
    customCSS: string;
    customJS: string;
    apiEndpoints: { [key: string]: string };
    featureFlags: { [key: string]: boolean };
    userAgent: string;
  };
}

interface AdvancedSettingsProps {
  config: AdvancedConfig;
  onChange: (config: AdvancedConfig) => void;
  onSave: () => void;
  onReset: () => void;
  onExport: () => void;
  onImport: (config: string) => void;
  className?: string;
}

const defaultConfig: AdvancedConfig = {
  performance: {
    hardwareAcceleration: true,
    webWorkers: true,
    memoryLimit: 512,
    cpuThrottling: false,
    preloadStrategy: 'metadata',
    cacheSize: 100,
    garbageCollection: true
  },
  network: {
    maxConnections: 6,
    timeout: 30,
    retryAttempts: 3,
    retryDelay: 1,
    bandwidthEstimation: true,
    adaptiveBitrate: true,
    lowLatencyMode: false,
    p2pStreaming: false
  },
  debugging: {
    enableLogging: false,
    logLevel: 'error',
    consoleOutput: true,
    remoteLogging: false,
    performanceMonitoring: false,
    errorReporting: true,
    debugOverlay: false
  },
  security: {
    cors: true,
    contentSecurityPolicy: true,
    drmSupport: false,
    tokenAuthentication: false,
    encryptedStreams: false,
    referrerPolicy: 'strict-origin-when-cross-origin',
    allowedDomains: []
  },
  experimental: {
    webAssembly: false,
    serviceWorker: false,
    offlineMode: false,
    aiFeatures: false,
    webRTC: false,
    webCodecs: false,
    sharedArrayBuffer: false
  },
  custom: {
    customCSS: '',
    customJS: '',
    apiEndpoints: {},
    featureFlags: {},
    userAgent: ''
  }
};

export const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  config = defaultConfig,
  onChange,
  onSave,
  onReset,
  onExport,
  onImport,
  className
}) => {
  const [selectedTab, setSelectedTab] = useState('performance');
  const [hasChanges, setHasChanges] = useState(false);
  const [importConfig, setImportConfig] = useState('');

  const updateConfig = (section: keyof AdvancedConfig, updates: any) => {
    const newConfig = {
      ...config,
      [section]: { ...config[section], ...updates }
    };
    onChange(newConfig);
    setHasChanges(true);
  };

  const updateCustomEndpoint = (key: string, value: string) => {
    const newEndpoints = { ...config.custom.apiEndpoints };
    if (value.trim()) {
      newEndpoints[key] = value;
    } else {
      delete newEndpoints[key];
    }
    updateConfig('custom', { apiEndpoints: newEndpoints });
  };

  const updateFeatureFlag = (key: string, value: boolean) => {
    const newFlags = { ...config.custom.featureFlags };
    newFlags[key] = value;
    updateConfig('custom', { featureFlags: newFlags });
  };

  const handleImportConfig = () => {
    try {
      const parsedConfig = JSON.parse(importConfig);
      onImport(importConfig);
      setImportConfig('');
    } catch (error) {
      alert('Invalid JSON configuration');
    }
  };

  const handleSave = () => {
    onSave();
    setHasChanges(false);
  };

  const handleReset = () => {
    onReset();
    setHasChanges(false);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Settings2 className="w-6 h-6 mr-2" />
            Advanced Settings
          </h2>
          <p className="text-muted-foreground">
            Fine-tune player performance and behavior
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {hasChanges && (
            <Badge variant="secondary">
              Unsaved changes
            </Badge>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={!hasChanges}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!hasChanges}
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="debugging">Debugging</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="experimental">Experimental</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cpu className="w-5 h-5 mr-2" />
                  CPU & Processing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Hardware Acceleration</Label>
                  <Switch
                    checked={config.performance.hardwareAcceleration}
                    onCheckedChange={(checked) => 
                      updateConfig('performance', { hardwareAcceleration: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Web Workers</Label>
                  <Switch
                    checked={config.performance.webWorkers}
                    onCheckedChange={(checked) => 
                      updateConfig('performance', { webWorkers: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>CPU Throttling</Label>
                  <Switch
                    checked={config.performance.cpuThrottling}
                    onCheckedChange={(checked) => 
                      updateConfig('performance', { cpuThrottling: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Garbage Collection</Label>
                  <Switch
                    checked={config.performance.garbageCollection}
                    onCheckedChange={(checked) => 
                      updateConfig('performance', { garbageCollection: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HardDrive className="w-5 h-5 mr-2" />
                  Memory & Cache
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Memory Limit ({config.performance.memoryLimit} MB)</Label>
                  <Slider
                    value={[config.performance.memoryLimit]}
                    onValueChange={([value]) => 
                      updateConfig('performance', { memoryLimit: value })
                    }
                    min={128}
                    max={2048}
                    step={64}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Cache Size ({config.performance.cacheSize} MB)</Label>
                  <Slider
                    value={[config.performance.cacheSize]}
                    onValueChange={([value]) => 
                      updateConfig('performance', { cacheSize: value })
                    }
                    min={10}
                    max={500}
                    step={10}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Preload Strategy</Label>
                  <Select
                    value={config.performance.preloadStrategy}
                    onValueChange={(value: any) => 
                      updateConfig('performance', { preloadStrategy: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="metadata">Metadata</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="network" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Network className="w-5 h-5 mr-2" />
                  Connection Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Max Connections ({config.network.maxConnections})</Label>
                  <Slider
                    value={[config.network.maxConnections]}
                    onValueChange={([value]) => 
                      updateConfig('network', { maxConnections: value })
                    }
                    min={1}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Timeout ({config.network.timeout}s)</Label>
                  <Slider
                    value={[config.network.timeout]}
                    onValueChange={([value]) => 
                      updateConfig('network', { timeout: value })
                    }
                    min={5}
                    max={120}
                    step={5}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Retry Attempts ({config.network.retryAttempts})</Label>
                  <Slider
                    value={[config.network.retryAttempts]}
                    onValueChange={([value]) => 
                      updateConfig('network', { retryAttempts: value })
                    }
                    min={0}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Retry Delay ({config.network.retryDelay}s)</Label>
                  <Slider
                    value={[config.network.retryDelay]}
                    onValueChange={([value]) => 
                      updateConfig('network', { retryDelay: value })
                    }
                    min={0.5}
                    max={10}
                    step={0.5}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Streaming Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Bandwidth Estimation</Label>
                  <Switch
                    checked={config.network.bandwidthEstimation}
                    onCheckedChange={(checked) => 
                      updateConfig('network', { bandwidthEstimation: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Adaptive Bitrate</Label>
                  <Switch
                    checked={config.network.adaptiveBitrate}
                    onCheckedChange={(checked) => 
                      updateConfig('network', { adaptiveBitrate: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Low Latency Mode</Label>
                  <Switch
                    checked={config.network.lowLatencyMode}
                    onCheckedChange={(checked) => 
                      updateConfig('network', { lowLatencyMode: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>P2P Streaming</Label>
                  <Switch
                    checked={config.network.p2pStreaming}
                    onCheckedChange={(checked) => 
                      updateConfig('network', { p2pStreaming: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="debugging" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="w-5 h-5 mr-2" />
                  Logging Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enable Logging</Label>
                  <Switch
                    checked={config.debugging.enableLogging}
                    onCheckedChange={(checked) => 
                      updateConfig('debugging', { enableLogging: checked })
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Log Level</Label>
                  <Select
                    value={config.debugging.logLevel}
                    onValueChange={(value: any) => 
                      updateConfig('debugging', { logLevel: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="warn">Warning</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="debug">Debug</SelectItem>
                      <SelectItem value="verbose">Verbose</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Console Output</Label>
                  <Switch
                    checked={config.debugging.consoleOutput}
                    onCheckedChange={(checked) => 
                      updateConfig('debugging', { consoleOutput: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Remote Logging</Label>
                  <Switch
                    checked={config.debugging.remoteLogging}
                    onCheckedChange={(checked) => 
                      updateConfig('debugging', { remoteLogging: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Monitor className="w-5 h-5 mr-2" />
                  Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Performance Monitoring</Label>
                  <Switch
                    checked={config.debugging.performanceMonitoring}
                    onCheckedChange={(checked) => 
                      updateConfig('debugging', { performanceMonitoring: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Error Reporting</Label>
                  <Switch
                    checked={config.debugging.errorReporting}
                    onCheckedChange={(checked) => 
                      updateConfig('debugging', { errorReporting: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Debug Overlay</Label>
                  <Switch
                    checked={config.debugging.debugOverlay}
                    onCheckedChange={(checked) => 
                      updateConfig('debugging', { debugOverlay: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Security Policies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>CORS</Label>
                  <Switch
                    checked={config.security.cors}
                    onCheckedChange={(checked) => 
                      updateConfig('security', { cors: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Content Security Policy</Label>
                  <Switch
                    checked={config.security.contentSecurityPolicy}
                    onCheckedChange={(checked) => 
                      updateConfig('security', { contentSecurityPolicy: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>DRM Support</Label>
                  <Switch
                    checked={config.security.drmSupport}
                    onCheckedChange={(checked) => 
                      updateConfig('security', { drmSupport: checked })
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Referrer Policy</Label>
                  <Input
                    value={config.security.referrerPolicy}
                    onChange={(e) => 
                      updateConfig('security', { referrerPolicy: e.target.value })
                    }
                    placeholder="strict-origin-when-cross-origin"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Authentication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Token Authentication</Label>
                  <Switch
                    checked={config.security.tokenAuthentication}
                    onCheckedChange={(checked) => 
                      updateConfig('security', { tokenAuthentication: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Encrypted Streams</Label>
                  <Switch
                    checked={config.security.encryptedStreams}
                    onCheckedChange={(checked) => 
                      updateConfig('security', { encryptedStreams: checked })
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Allowed Domains (one per line)</Label>
                  <Textarea
                    value={config.security.allowedDomains.join('\n')}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                      updateConfig('security', { 
                        allowedDomains: e.target.value.split('\n').filter((d: string) => d.trim()) 
                      })
                    }
                    placeholder="example.com&#10;trusted-domain.com"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="experimental" className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="text-sm font-medium text-yellow-800">
                Experimental features may be unstable and are not recommended for production use.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Web Technologies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>WebAssembly</Label>
                  <Switch
                    checked={config.experimental.webAssembly}
                    onCheckedChange={(checked) => 
                      updateConfig('experimental', { webAssembly: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Service Worker</Label>
                  <Switch
                    checked={config.experimental.serviceWorker}
                    onCheckedChange={(checked) => 
                      updateConfig('experimental', { serviceWorker: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>WebRTC</Label>
                  <Switch
                    checked={config.experimental.webRTC}
                    onCheckedChange={(checked) => 
                      updateConfig('experimental', { webRTC: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>WebCodecs</Label>
                  <Switch
                    checked={config.experimental.webCodecs}
                    onCheckedChange={(checked) => 
                      updateConfig('experimental', { webCodecs: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Offline Mode</Label>
                  <Switch
                    checked={config.experimental.offlineMode}
                    onCheckedChange={(checked) => 
                      updateConfig('experimental', { offlineMode: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>AI Features</Label>
                  <Switch
                    checked={config.experimental.aiFeatures}
                    onCheckedChange={(checked) => 
                      updateConfig('experimental', { aiFeatures: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>SharedArrayBuffer</Label>
                  <Switch
                    checked={config.experimental.sharedArrayBuffer}
                    onCheckedChange={(checked) => 
                      updateConfig('experimental', { sharedArrayBuffer: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Custom Code</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Custom CSS</Label>
                  <Textarea
                    value={config.custom.customCSS}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                      updateConfig('custom', { customCSS: e.target.value })
                    }
                    placeholder="/* Custom CSS styles */"
                    rows={6}
                    className="font-mono text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Custom JavaScript</Label>
                  <Textarea
                    value={config.custom.customJS}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                      updateConfig('custom', { customJS: e.target.value })
                    }
                    placeholder="// Custom JavaScript code"
                    rows={6}
                    className="font-mono text-sm"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configuration Import/Export</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={onExport}
                  className="w-full"
                >
                  Export Configuration
                </Button>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label>Import Configuration</Label>
                  <Textarea
                    value={importConfig}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setImportConfig(e.target.value)}
                    placeholder="Paste JSON configuration here..."
                    rows={6}
                    className="font-mono text-sm"
                  />
                </div>
                
                <Button
                  onClick={handleImportConfig}
                  disabled={!importConfig.trim()}
                  className="w-full"
                >
                  Import Configuration
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
