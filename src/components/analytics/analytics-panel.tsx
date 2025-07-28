"use client";
/**
 * Analytics Panel Component
 * Comprehensive analytics dashboard for video player insights
 */

import React, { useState, useMemo } from 'react';
import { BarChart3, PieChart, TrendingUp, Users, Eye, Clock, Download, Settings, Filter, Calendar, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface AnalyticsData {
  viewership: {
    current: number;
    peak: number;
    total: number;
    trend: number; // percentage change
  };
  engagement: {
    watchTime: number;
    completionRate: number;
    interactionRate: number;
    retentionCurve: number[];
  };
  performance: {
    loadTime: number;
    bufferRatio: number;
    errorRate: number;
    qualityDistribution: { [key: string]: number };
  };
  audience: {
    demographics: { [key: string]: number };
    devices: { [key: string]: number };
    locations: { [key: string]: number };
    browsers: { [key: string]: number };
  };
  timeline: {
    labels: string[];
    viewers: number[];
    engagement: number[];
    errors: number[];
  };
}

interface AnalyticsPanelProps {
  data: AnalyticsData;
  onRefresh?: () => void;
  onExport?: (format: 'csv' | 'json' | 'pdf') => void;
  refreshInterval?: number;
  className?: string;
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({
  data,
  onRefresh,
  onExport,
  refreshInterval = 30000,
  className
}) => {
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedMetric, setSelectedMetric] = useState('viewers');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Calculate derived metrics
  const avgWatchTime = useMemo(() => {
    return data.engagement.watchTime / data.viewership.total;
  }, [data.engagement.watchTime, data.viewership.total]);

  const topDevice = useMemo(() => {
    const devices = Object.entries(data.audience.devices);
    return devices.reduce((max, current) => current[1] > max[1] ? current : max)[0];
  }, [data.audience.devices]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${secs}s`;
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend < 0) return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
    return <div className="w-4 h-4" />;
  };

  const renderChart = () => {
    // Simplified chart representation
    const maxValue = Math.max(...data.timeline.viewers);
    
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Viewers over time</span>
          <span>Peak: {formatNumber(maxValue)}</span>
        </div>
        <div className="flex items-end space-x-1 h-32">
          {data.timeline.viewers.map((value, index) => (
            <div
              key={index}
              className="bg-primary/20 hover:bg-primary/30 transition-colors flex-1 min-w-0"
              style={{ height: `${(value / maxValue) * 100}%` }}
              title={`${data.timeline.labels[index]}: ${formatNumber(value)} viewers`}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{data.timeline.labels[0]}</span>
          <span>{data.timeline.labels[data.timeline.labels.length - 1]}</span>
        </div>
      </div>
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Video performance insights</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">1h</SelectItem>
              <SelectItem value="24h">24h</SelectItem>
              <SelectItem value="7d">7d</SelectItem>
              <SelectItem value="30d">30d</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={!onRefresh}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          
          {onExport && (
            <Select onValueChange={(format) => onExport(format as any)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Export" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-blue-500" />
                Current Viewers
              </div>
              {getTrendIcon(data.viewership.trend)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.viewership.current)}</div>
            <p className="text-xs text-muted-foreground">
              Peak: {formatNumber(data.viewership.peak)}
            </p>
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
            <div className="text-2xl font-bold">{formatNumber(data.viewership.total)}</div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
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
            <div className="text-2xl font-bold">{formatTime(avgWatchTime)}</div>
            <p className="text-xs text-muted-foreground">
              Per session
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-orange-500" />
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(data.engagement.completionRate * 100).toFixed(1)}%</div>
            <Progress value={data.engagement.completionRate * 100} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Viewership Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderChart()}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="w-5 h-5 mr-2" />
                  Quality Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(data.performance.qualityDistribution).map(([quality, percentage]) => (
                  <div key={quality} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{quality}</span>
                      <span>{percentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={percentage} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audience" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(data.audience.devices)
                  .sort(([,a], [,b]) => b - a)
                  .map(([device, count]) => (
                  <div key={device} className="flex items-center justify-between">
                    <span className="text-sm">{device}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(count / data.viewership.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">
                        {((count / data.viewership.total) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Locations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(data.audience.locations)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([location, count]) => (
                  <div key={location} className="flex items-center justify-between">
                    <span className="text-sm">{location}</span>
                    <Badge variant="secondary">
                      {formatNumber(count)}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Load Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.performance.loadTime.toFixed(2)}s</div>
                <p className="text-xs text-muted-foreground">Average load time</p>
                <Progress 
                  value={Math.max(0, 100 - (data.performance.loadTime / 10) * 100)} 
                  className="mt-2" 
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Buffer Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{((1 - data.performance.bufferRatio) * 100).toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Smooth playback</p>
                <Progress 
                  value={(1 - data.performance.bufferRatio) * 100} 
                  className="mt-2" 
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Error Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(data.performance.errorRate * 100).toFixed(2)}%</div>
                <p className="text-xs text-muted-foreground">Playback errors</p>
                <Progress 
                  value={Math.max(0, 100 - (data.performance.errorRate * 100))} 
                  className="mt-2" 
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Retention Curve</CardTitle>
              <p className="text-sm text-muted-foreground">
                Percentage of viewers at each point in the video
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex items-end space-x-1 h-32">
                {data.engagement.retentionCurve.map((retention, index) => (
                  <div
                    key={index}
                    className="bg-blue-500/20 hover:bg-blue-500/30 transition-colors flex-1 min-w-0"
                    style={{ height: `${retention}%` }}
                    title={`${index * 10}%: ${retention.toFixed(1)}% retention`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
