"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Clock, 
  Play, 
  Wifi, 
  BarChart3,
  Monitor
} from 'lucide-react';
import type { VideoPlayerState } from '@madraka/nextjs-videoplayer';

interface VideoAnalyticsProps {
  state: VideoPlayerState;
  className?: string;
}

export const VideoAnalytics: React.FC<VideoAnalyticsProps> = ({
  state,
  className = "",
}) => {
  // Format time in HH:MM:SS or MM:SS
  const formatTime = (seconds: number): string => {
    if (!isFinite(seconds)) return '0:00';
    
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Format bytes to human readable format
  const formatBitrate = (bitrate: number): string => {
    if (bitrate === 0) return '0 kbps';
    const units = ['bps', 'kbps', 'Mbps', 'Gbps'];
    const unitIndex = Math.floor(Math.log(bitrate) / Math.log(1000));
    const value = bitrate / Math.pow(1000, unitIndex);
    return `${value.toFixed(1)} ${units[unitIndex]}`;
  };

  // Calculate engagement percentage
  const engagementPercent = state.duration > 0 
    ? Math.min(100, (state.totalWatchTime / state.duration) * 100)
    : 0;

  // Get quality badge color
  const getQualityColor = (quality: string) => {
    switch (quality.toLowerCase()) {
      case '1080p':
      case 'hd':
        return 'bg-green-500';
      case '720p':
        return 'bg-blue-500';
      case '480p':
        return 'bg-yellow-500';
      case 'auto':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Current Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">State:</span>
                <Badge variant={state.isPlaying ? "default" : "secondary"}>
                  {state.isLoading ? "Loading" : state.isPlaying ? "Playing" : "Paused"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Quality:</span>
                <Badge className={getQualityColor(state.quality)}>
                  {state.quality}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Volume:</span>
                <span className="text-sm font-medium">
                  {state.isMuted ? "Muted" : `${Math.round(state.volume * 100)}%`}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Playback Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Playback</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Play Count:</span>
                <span className="text-sm font-medium">{state.playCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Time:</span>
                <span className="text-sm font-medium">{formatTime(state.currentTime)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Duration:</span>
                <span className="text-sm font-medium">{formatTime(state.duration)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Network & Performance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Buffering:</span>
                <span className="text-sm font-medium">{formatTime(state.bufferingTime)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Quality Changes:</span>
                <span className="text-sm font-medium">{state.qualityChanges}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Buffered:</span>
                <span className="text-sm font-medium">{Math.round(state.buffered * 100)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Watch Time Analytics */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Watch Time Analytics</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Watch Time</span>
                <span className="text-sm font-medium">{formatTime(state.totalWatchTime)}</span>
              </div>
              <Progress value={engagementPercent} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {engagementPercent.toFixed(1)}% of video watched
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Avg. Session</p>
                <p className="font-medium">
                  {formatTime(state.playCount > 0 ? state.totalWatchTime / state.playCount : 0)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Completion Rate</p>
                <p className="font-medium">{engagementPercent.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Real-time Metrics */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Real-time Metrics</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Progress</span>
                  <span className="text-sm font-medium">
                    {state.duration > 0 ? ((state.currentTime / state.duration) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <Progress 
                  value={state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0} 
                  className="h-2" 
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Buffer Health</span>
                  <span className="text-sm font-medium">{Math.round(state.buffered * 100)}%</span>
                </div>
                <Progress value={state.buffered * 100} className="h-2" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Fullscreen</p>
                <p className="font-medium">{state.isFullscreen ? "Yes" : "No"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Errors</p>
                <p className="font-medium">{state.error ? "Yes" : "None"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};
