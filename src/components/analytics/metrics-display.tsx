"use client";
/**
 * Metrics Display Component
 * Real-time video player metrics and statistics display
 */

import React, { useState, useEffect } from 'react';
import { Activity, Zap, Users, Eye, Clock, Download, Upload, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface VideoMetrics {
  viewerCount: number;
  avgWatchTime: number;
  totalViews: number;
  engagementRate: number;
  bufferRatio: number;
  bitrateKbps: number;
  fps: number;
  resolution: {
    width: number;
    height: number;
  };
  bandwidth: {
    download: number;
    upload: number;
  };
  quality: {
    currentLevel: number;
    availableLevels: string[];
    adaptiveEnabled: boolean;
  };
  performance: {
    loadTime: number;
    seekLatency: number;
    rebufferEvents: number;
    errorRate: number;
  };
}

interface MetricsDisplayProps {
  metrics: VideoMetrics;
  updateInterval?: number;
  showRealTime?: boolean;
  compact?: boolean;
  className?: string;
}

export const MetricsDisplay: React.FC<MetricsDisplayProps> = ({
  metrics,
  updateInterval = 1000,
  showRealTime = true,
  compact = false,
  className
}) => {
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    if (!showRealTime) return;

    const interval = setInterval(() => {
      setLastUpdate(Date.now());
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval, showRealTime]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const getQualityBadgeVariant = (level: number) => {
    if (level >= 1080) return 'default';
    if (level >= 720) return 'secondary';
    return 'outline';
  };

  const getPerformanceStatus = () => {
    const { bufferRatio, performance } = metrics;
    if (bufferRatio < 0.05 && performance.errorRate < 0.01) return 'excellent';
    if (bufferRatio < 0.15 && performance.errorRate < 0.05) return 'good';
    if (bufferRatio < 0.3 && performance.errorRate < 0.1) return 'fair';
    return 'poor';
  };

  const performanceStatus = getPerformanceStatus();
  const statusColors = {
    excellent: 'text-green-600',
    good: 'text-blue-600',
    fair: 'text-yellow-600',
    poor: 'text-red-600'
  };

  if (compact) {
    return (
      <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-2", className)}>
        <Card className="p-2">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-blue-500" />
            <div className="text-xs">
              <div className="font-medium">{metrics.viewerCount.toLocaleString()}</div>
              <div className="text-muted-foreground">Viewers</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-2">
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4 text-green-500" />
            <div className="text-xs">
              <div className="font-medium">{metrics.totalViews.toLocaleString()}</div>
              <div className="text-muted-foreground">Views</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-2">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-purple-500" />
            <div className="text-xs">
              <div className="font-medium">{(metrics.engagementRate * 100).toFixed(1)}%</div>
              <div className="text-muted-foreground">Engagement</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-2">
          <div className="flex items-center space-x-2">
            <Zap className={cn("w-4 h-4", statusColors[performanceStatus])} />
            <div className="text-xs">
              <div className="font-medium capitalize">{performanceStatus}</div>
              <div className="text-muted-foreground">Quality</div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Video Metrics</h3>
        {showRealTime && (
          <Badge variant="outline" className="text-xs">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
            Live
          </Badge>
        )}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Users className="w-4 h-4 mr-2 text-blue-500" />
                  Viewers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.viewerCount.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Currently watching</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Eye className="w-4 h-4 mr-2 text-green-500" />
                  Total Views
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalViews.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-purple-500" />
                  Avg Watch Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatDuration(metrics.avgWatchTime)}</div>
                <p className="text-xs text-muted-foreground">Per session</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-orange-500" />
                  Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(metrics.engagementRate * 100).toFixed(1)}%</div>
                <Progress value={metrics.engagementRate * 100} className="mt-2" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Playback Quality</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Overall Status</span>
                  <Badge className={cn("capitalize", statusColors[performanceStatus])}>
                    {performanceStatus}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Buffer Health</span>
                    <span>{((1 - metrics.bufferRatio) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={(1 - metrics.bufferRatio) * 100} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Load Time</div>
                    <div className="font-medium">{metrics.performance.loadTime.toFixed(2)}s</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Seek Latency</div>
                    <div className="font-medium">{metrics.performance.seekLatency.toFixed(0)}ms</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Rebuffer Events</div>
                    <div className="font-medium">{metrics.performance.rebufferEvents}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Error Rate</div>
                    <div className="font-medium">{(metrics.performance.errorRate * 100).toFixed(2)}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="technical" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Video Quality</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Current Resolution</span>
                  <Badge variant={getQualityBadgeVariant(metrics.resolution.height)}>
                    {metrics.resolution.width}x{metrics.resolution.height}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Frame Rate</span>
                  <span className="font-medium">{metrics.fps} fps</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Bitrate</span>
                  <span className="font-medium">{(metrics.bitrateKbps / 1000).toFixed(1)} Mbps</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Adaptive Quality</span>
                  <Badge variant={metrics.quality.adaptiveEnabled ? 'default' : 'secondary'}>
                    {metrics.quality.adaptiveEnabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Network</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Download className="w-4 h-4 mr-2 text-blue-500" />
                    <span className="text-sm">Download</span>
                  </div>
                  <span className="font-medium">{formatBytes(metrics.bandwidth.download)}/s</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Upload className="w-4 h-4 mr-2 text-green-500" />
                    <span className="text-sm">Upload</span>
                  </div>
                  <span className="font-medium">{formatBytes(metrics.bandwidth.upload)}/s</span>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Available Qualities</div>
                  <div className="flex flex-wrap gap-1">
                    {metrics.quality.availableLevels.map((level, index) => (
                      <Badge 
                        key={level} 
                        variant={index === metrics.quality.currentLevel ? 'default' : 'outline'}
                        className="text-xs"
                      >
                        {level}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
