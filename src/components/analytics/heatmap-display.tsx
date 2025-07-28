"use client";
/**
 * Heatmap Display Component
 * Visual heatmap for video engagement and interaction patterns
 */

import React, { useState, useMemo } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Settings, MousePointer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface HeatmapPoint {
  x: number; // percentage of video duration (0-100)
  y: number; // percentage of video height (0-100)
  intensity: number; // 0-1
  action?: 'play' | 'pause' | 'seek' | 'click' | 'hover';
  timestamp: number;
  userId?: string;
}

interface SegmentData {
  start: number; // seconds
  end: number; // seconds
  views: number;
  engagement: number; // 0-1
  interactions: number;
  avgWatchTime: number;
  dropoffRate: number;
}

interface HeatmapDisplayProps {
  points: HeatmapPoint[];
  segments: SegmentData[];
  videoDuration: number;
  videoWidth?: number;
  videoHeight?: number;
  heatmapType?: 'engagement' | 'interactions' | 'retention';
  showControls?: boolean;
  onTimeSelect?: (time: number) => void;
  className?: string;
}

export const HeatmapDisplay: React.FC<HeatmapDisplayProps> = ({
  points,
  segments,
  videoDuration,
  videoWidth = 640,
  videoHeight = 360,
  heatmapType = 'engagement',
  showControls = true,
  onTimeSelect,
  className
}) => {
  const [selectedSegment, setSelectedSegment] = useState<number | null>(null);
  const [heatmapResolution, setHeatmapResolution] = useState(20); // Grid size
  const [intensityThreshold, setIntensityThreshold] = useState(0.1);

  // Generate heatmap grid
  const heatmapGrid = useMemo(() => {
    const grid: number[][] = Array(heatmapResolution)
      .fill(null)
      .map(() => Array(heatmapResolution).fill(0));

    points.forEach(point => {
      if (point.intensity < intensityThreshold) return;

      const gridX = Math.floor((point.x / 100) * heatmapResolution);
      const gridY = Math.floor((point.y / 100) * heatmapResolution);

      if (gridX >= 0 && gridX < heatmapResolution && gridY >= 0 && gridY < heatmapResolution) {
        grid[gridY][gridX] += point.intensity;
      }
    });

    // Normalize grid values
    const maxValue = Math.max(...grid.flat());
    if (maxValue > 0) {
      for (let y = 0; y < heatmapResolution; y++) {
        for (let x = 0; x < heatmapResolution; x++) {
          grid[y][x] = grid[y][x] / maxValue;
        }
      }
    }

    return grid;
  }, [points, heatmapResolution, intensityThreshold]);

  // Get color based on intensity
  const getHeatmapColor = (intensity: number) => {
    if (intensity === 0) return 'transparent';
    
    const colors = [
      { threshold: 0.2, color: 'rgba(59, 130, 246, 0.3)' }, // blue
      { threshold: 0.4, color: 'rgba(34, 197, 94, 0.4)' }, // green
      { threshold: 0.6, color: 'rgba(234, 179, 8, 0.5)' }, // yellow
      { threshold: 0.8, color: 'rgba(249, 115, 22, 0.6)' }, // orange
      { threshold: 1.0, color: 'rgba(239, 68, 68, 0.7)' }, // red
    ];

    for (const color of colors) {
      if (intensity <= color.threshold) {
        return color.color;
      }
    }
    
    return colors[colors.length - 1].color;
  };

  // Calculate segment engagement metrics
  const getSegmentMetrics = (segment: SegmentData) => {
    const segmentPoints = points.filter(
      point => {
        const timeInSeconds = (point.x / 100) * videoDuration;
        return timeInSeconds >= segment.start && timeInSeconds <= segment.end;
      }
    );

    const totalInteractions = segmentPoints.length;
    const avgIntensity = segmentPoints.reduce((sum, p) => sum + p.intensity, 0) / totalInteractions || 0;

    return {
      interactions: totalInteractions,
      avgIntensity,
      hotspots: segmentPoints.filter(p => p.intensity > 0.7).length
    };
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <TooltipProvider>
      <div className={cn("space-y-4", className)}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Engagement Heatmap</h3>
            <p className="text-sm text-muted-foreground">
              Visual representation of viewer interactions and engagement
            </p>
          </div>
          
          {showControls && (
            <div className="flex items-center space-x-2">
              <Select value={heatmapType} onValueChange={() => {}}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engagement">Engagement</SelectItem>
                  <SelectItem value="interactions">Interactions</SelectItem>
                  <SelectItem value="retention">Retention</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={heatmapResolution.toString()} onValueChange={(v) => setHeatmapResolution(Number(v))}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10x10</SelectItem>
                  <SelectItem value="20">20x20</SelectItem>
                  <SelectItem value="30">30x30</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Heatmap */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Video Interaction Heatmap</span>
                  <Badge variant="outline">
                    {points.length} interactions
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="relative border rounded-lg overflow-hidden bg-gray-100"
                  style={{ aspectRatio: `${videoWidth}/${videoHeight}` }}
                >
                  {/* Heatmap overlay */}
                  <div className="absolute inset-0 grid">
                    {heatmapGrid.map((row, y) =>
                      row.map((intensity, x) => (
                        <Tooltip key={`${x}-${y}`}>
                          <TooltipTrigger asChild>
                            <div
                              className="border-0 transition-opacity hover:opacity-80 cursor-pointer"
                              style={{
                                backgroundColor: getHeatmapColor(intensity),
                                gridRow: y + 1,
                                gridColumn: x + 1,
                                gridTemplateColumns: `repeat(${heatmapResolution}, 1fr)`,
                                gridTemplateRows: `repeat(${heatmapResolution}, 1fr)`
                              }}
                              onClick={() => {
                                if (onTimeSelect) {
                                  const timePercent = (x / heatmapResolution) * 100;
                                  const timeInSeconds = (timePercent / 100) * videoDuration;
                                  onTimeSelect(timeInSeconds);
                                }
                              }}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-xs">
                              <div>Position: {Math.round((x / heatmapResolution) * 100)}%, {Math.round((y / heatmapResolution) * 100)}%</div>
                              <div>Intensity: {formatPercentage(intensity)}</div>
                              <div>Time: {formatTime((x / heatmapResolution) * videoDuration)}</div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ))
                    )}
                  </div>

                  {/* Action indicators */}
                  {points.slice(0, 50).map((point, index) => {
                    const Icon = point.action === 'play' ? Play :
                                point.action === 'pause' ? Pause :
                                point.action === 'seek' ? SkipForward :
                                MousePointer;

                    return (
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          <div
                            className="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                            style={{
                              left: `${point.x}%`,
                              top: `${point.y}%`,
                              opacity: point.intensity
                            }}
                          >
                            <Icon className="w-3 h-3 text-white drop-shadow-md" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-xs">
                            <div>Action: {point.action}</div>
                            <div>Time: {formatTime((point.x / 100) * videoDuration)}</div>
                            <div>Intensity: {formatPercentage(point.intensity)}</div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: 'rgba(59, 130, 246, 0.3)' }} />
                      <span>Low</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: 'rgba(234, 179, 8, 0.5)' }} />
                      <span>Medium</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: 'rgba(239, 68, 68, 0.7)' }} />
                      <span>High</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Click heatmap to seek to time
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Segment Analysis */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Segment Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {segments.map((segment, index) => {
                  const metrics = getSegmentMetrics(segment);
                  
                  return (
                    <div
                      key={index}
                      className={cn(
                        "p-3 rounded-lg border cursor-pointer transition-colors",
                        selectedSegment === index ? "bg-primary/10 border-primary" : "hover:bg-gray-50"
                      )}
                      onClick={() => setSelectedSegment(index)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">
                          {formatTime(segment.start)} - {formatTime(segment.end)}
                        </div>
                        <Badge variant={metrics.hotspots > 0 ? "default" : "secondary"}>
                          {metrics.hotspots} hotspots
                        </Badge>
                      </div>
                      
                      <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Views:</span>
                          <span>{segment.views.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Engagement:</span>
                          <span>{formatPercentage(segment.engagement)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Interactions:</span>
                          <span>{metrics.interactions}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Top Interactions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top Interactions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {points
                  .sort((a, b) => b.intensity - a.intensity)
                  .slice(0, 5)
                  .map((point, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer"
                      onClick={() => onTimeSelect && onTimeSelect((point.x / 100) * videoDuration)}
                    >
                      <div className="flex items-center space-x-2">
                        {point.action === 'play' && <Play className="w-3 h-3 text-green-500" />}
                        {point.action === 'pause' && <Pause className="w-3 h-3 text-orange-500" />}
                        {point.action === 'seek' && <SkipForward className="w-3 h-3 text-blue-500" />}
                        {(!point.action || point.action === 'click') && <MousePointer className="w-3 h-3 text-gray-500" />}
                        <div className="text-xs">
                          <div className="font-medium">{formatTime((point.x / 100) * videoDuration)}</div>
                          <div className="text-muted-foreground capitalize">{point.action || 'click'}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {formatPercentage(point.intensity)}
                      </Badge>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
