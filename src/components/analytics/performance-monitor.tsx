"use client";
/**
 * Performance Monitor Component
 * Real-time performance monitoring and diagnostics for video player
 */

import React, { useState, useEffect, useRef } from 'react';
import { Cpu, HardDrive, Wifi, Zap, AlertTriangle, CheckCircle, XCircle, TrendingDown, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface PerformanceMetrics {
  cpu: {
    usage: number;
    temperature?: number;
    cores: number;
  };
  memory: {
    used: number;
    available: number;
    total: number;
  };
  network: {
    latency: number;
    bandwidth: number;
    packetLoss: number;
    jitter: number;
  };
  video: {
    decodingFps: number;
    renderingFps: number;
    droppedFrames: number;
    corruptedFrames: number;
  };
  playback: {
    bufferLevel: number;
    stallEvents: number;
    seekLatency: number;
    startupTime: number;
  };
  browser: {
    heap: number;
    heapLimit: number;
    domNodes: number;
    eventListeners: number;
  };
}

interface PerformanceAlert {
  id: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  timestamp: number;
  metric?: string;
}

interface PerformanceMonitorProps {
  metrics: PerformanceMetrics;
  alerts?: PerformanceAlert[];
  onDismissAlert?: (alertId: string) => void;
  updateInterval?: number;
  showDetailedView?: boolean;
  className?: string;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  metrics,
  alerts = [],
  onDismissAlert,
  updateInterval = 1000,
  showDetailedView = true,
  className
}) => {
  const [history, setHistory] = useState<PerformanceMetrics[]>([]);
  const [selectedTab, setSelectedTab] = useState('overview');
  const maxHistoryLength = 60; // Keep 60 data points

  useEffect(() => {
    setHistory(prev => {
      const newHistory = [...prev, metrics];
      return newHistory.slice(-maxHistoryLength);
    });
  }, [metrics]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getHealthStatus = () => {
    const issues = [];
    
    if (metrics.cpu.usage > 80) issues.push('High CPU usage');
    if (metrics.memory.used / metrics.memory.total > 0.9) issues.push('Low memory');
    if (metrics.network.latency > 200) issues.push('High latency');
    if (metrics.video.droppedFrames > 10) issues.push('Dropped frames');
    if (metrics.playback.stallEvents > 0) issues.push('Playback stalls');
    
    if (issues.length === 0) return { status: 'excellent', color: 'text-green-600' };
    if (issues.length <= 2) return { status: 'good', color: 'text-yellow-600' };
    return { status: 'poor', color: 'text-red-600' };
  };

  const health = getHealthStatus();

  const renderMiniChart = (data: number[], label: string, unit: string = '%') => {
    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const range = max - min || 1;

    return (
      <div className="space-y-1">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="flex items-end h-8 space-x-0.5">
          {data.slice(-20).map((value, index) => (
            <div
              key={index}
              className="bg-primary/30 flex-1 min-w-0"
              style={{ height: `${((value - min) / range) * 100}%` }}
            />
          ))}
        </div>
        <div className="text-xs font-medium">
          {data[data.length - 1]?.toFixed(1)}{unit}
        </div>
      </div>
    );
  };

  const criticalAlerts = alerts.filter(alert => alert.level === 'error');
  const warningAlerts = alerts.filter(alert => alert.level === 'warning');

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Performance Monitor
          </h3>
          <p className="text-sm text-muted-foreground">
            Real-time system and playback performance
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge className={cn("capitalize", health.color)}>
            {health.status}
          </Badge>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live
          </div>
        </div>
      </div>

      {/* Alerts */}
      {(criticalAlerts.length > 0 || warningAlerts.length > 0) && (
        <div className="space-y-2">
          {criticalAlerts.slice(0, 2).map(alert => (
            <div key={alert.id} className="border border-red-200 rounded-lg p-3 bg-red-50">
              <div className="flex items-center space-x-2">
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-800">{alert.message}</span>
                {onDismissAlert && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDismissAlert(alert.id)}
                    className="h-6 w-6 p-0 ml-auto"
                  >
                    ×
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          {warningAlerts.slice(0, 1).map(alert => (
            <div key={alert.id} className="border border-yellow-200 rounded-lg p-3 bg-yellow-50">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-yellow-800">{alert.message}</span>
                {onDismissAlert && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDismissAlert(alert.id)}
                    className="h-6 w-6 p-0 ml-auto"
                  >
                    ×
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showDetailedView ? (
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
            <TabsTrigger value="video">Video</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <Cpu className="w-4 h-4 mr-2 text-blue-500" />
                    CPU
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{metrics.cpu.usage.toFixed(1)}%</div>
                  <Progress value={metrics.cpu.usage} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <HardDrive className="w-4 h-4 mr-2 text-green-500" />
                    Memory
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">
                    {((metrics.memory.used / metrics.memory.total) * 100).toFixed(1)}%
                  </div>
                  <Progress value={(metrics.memory.used / metrics.memory.total) * 100} className="mt-2" />
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatBytes(metrics.memory.used)} / {formatBytes(metrics.memory.total)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <Wifi className="w-4 h-4 mr-2 text-purple-500" />
                    Network
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{metrics.network.latency.toFixed(0)}ms</div>
                  <div className="text-xs text-muted-foreground">
                    {formatBytes(metrics.network.bandwidth)}/s
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-orange-500" />
                    Playback
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{metrics.video.renderingFps.toFixed(0)} fps</div>
                  <div className="text-xs text-muted-foreground">
                    Buffer: {metrics.playback.bufferLevel.toFixed(1)}s
                  </div>
                </CardContent>
              </Card>
            </div>

            {history.length > 10 && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4">
                  {renderMiniChart(
                    history.map(h => h.cpu.usage),
                    'CPU Usage'
                  )}
                </Card>
                <Card className="p-4">
                  {renderMiniChart(
                    history.map(h => (h.memory.used / h.memory.total) * 100),
                    'Memory Usage'
                  )}
                </Card>
                <Card className="p-4">
                  {renderMiniChart(
                    history.map(h => h.network.latency),
                    'Network Latency',
                    'ms'
                  )}
                </Card>
                <Card className="p-4">
                  {renderMiniChart(
                    history.map(h => h.video.renderingFps),
                    'Rendering FPS',
                    ' fps'
                  )}
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Cpu className="w-5 h-5 mr-2" />
                    CPU Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Usage</span>
                      <span>{metrics.cpu.usage.toFixed(1)}%</span>
                    </div>
                    <Progress value={metrics.cpu.usage} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Cores</div>
                      <div className="font-medium">{metrics.cpu.cores}</div>
                    </div>
                    {metrics.cpu.temperature && (
                      <div>
                        <div className="text-muted-foreground">Temperature</div>
                        <div className="font-medium">{metrics.cpu.temperature}°C</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HardDrive className="w-5 h-5 mr-2" />
                    Memory Usage
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Used</span>
                      <span>{formatBytes(metrics.memory.used)}</span>
                    </div>
                    <Progress value={(metrics.memory.used / metrics.memory.total) * 100} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Available: {formatBytes(metrics.memory.available)}</span>
                      <span>Total: {formatBytes(metrics.memory.total)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Browser Heap</div>
                    <div className="flex justify-between text-sm">
                      <span>Used</span>
                      <span>{formatBytes(metrics.browser.heap)}</span>
                    </div>
                    <Progress value={(metrics.browser.heap / metrics.browser.heapLimit) * 100} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="network" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Wifi className="w-5 h-5 mr-2" />
                    Connection Quality
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Latency</div>
                      <div className="text-xl font-bold">{metrics.network.latency.toFixed(0)}ms</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Jitter</div>
                      <div className="text-xl font-bold">{metrics.network.jitter.toFixed(1)}ms</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Packet Loss</span>
                      <span>{(metrics.network.packetLoss * 100).toFixed(2)}%</span>
                    </div>
                    <Progress value={Math.max(0, 100 - (metrics.network.packetLoss * 100))} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bandwidth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatBytes(metrics.network.bandwidth)}/s</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Current throughput
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="video" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Frame Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Decoding FPS</div>
                      <div className="text-xl font-bold">{metrics.video.decodingFps.toFixed(0)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Rendering FPS</div>
                      <div className="text-xl font-bold">{metrics.video.renderingFps.toFixed(0)}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Dropped Frames</div>
                      <div className="font-medium">{metrics.video.droppedFrames}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Corrupted Frames</div>
                      <div className="font-medium">{metrics.video.corruptedFrames}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Playback Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Buffer Level</div>
                      <div className="text-xl font-bold">{metrics.playback.bufferLevel.toFixed(1)}s</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Stall Events</div>
                      <div className="text-xl font-bold">{metrics.playback.stallEvents}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Seek Latency</div>
                      <div className="font-medium">{metrics.playback.seekLatency.toFixed(0)}ms</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Startup Time</div>
                      <div className="font-medium">{metrics.playback.startupTime.toFixed(1)}s</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        // Compact view
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">CPU</div>
            <div className="text-xl font-bold">{metrics.cpu.usage.toFixed(0)}%</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Memory</div>
            <div className="text-xl font-bold">
              {((metrics.memory.used / metrics.memory.total) * 100).toFixed(0)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Network</div>
            <div className="text-xl font-bold">{metrics.network.latency.toFixed(0)}ms</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">FPS</div>
            <div className="text-xl font-bold">{metrics.video.renderingFps.toFixed(0)}</div>
          </div>
        </div>
      )}
    </div>
  );
};
