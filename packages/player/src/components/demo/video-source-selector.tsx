"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getPlayerLogger } from '@/lib/logger';
import { FileVideo, Play, Download, Info, AlertTriangle } from 'lucide-react';

export interface VideoSource {
  id: string;
  name: string;
  url: string;
  fallbackUrls?: string[];
  format: string;
  quality: string;
  size: string;
  description: string;
  features: string[];
  poster?: string; // Optional poster image URL
  thumbnailUrl?: string; // Optional thumbnail preview URL
  aspectRatio?: string; // Video aspect ratio (16/9, 9/16, 1/1, etc.)
}

interface VideoSourceSelectorProps {
  sources?: VideoSource[];
  selectedSource?: VideoSource;
  onSourceChange?: (source: VideoSource) => void;
  videoSources?: VideoSource[];
  selectedVideo?: VideoSource;
  onVideoSelect?: (source: VideoSource) => void;
  onSourceSelect?: (source: VideoSource) => Promise<void> | void;
  currentSource?: string;
  className?: string;
}

// Simple format support check that's SSR-safe
const isVideoFormatSupportedSimple = (url: string): boolean => {
  if (typeof window === 'undefined') {
    return true; // During SSR, assume all formats are supported
  }
  
  // Basic format detection based on URL extension
  const extension = url.split('.').pop()?.toLowerCase().split('?')[0];
  
  // Most common video formats
  const supportedFormats = ['mp4', 'webm', 'ogg', 'm3u8', 'mpd'];
  return supportedFormats.includes(extension || '');
};

const videoSources: VideoSource[] = [
  {
    id: 'html5-test',
    name: 'HTML5 Test Video',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    format: 'MP4',
    quality: '320p',
    size: '1.1MB',
    description: 'W3Schools HTML5 test video - guaranteed to work',
    features: ['Reliable', 'Small Size', 'Educational']
  },
  {
    id: 'sintel-480p',
    name: 'MP4 - Sintel (480p)',
    url: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
    format: 'MP4',
    quality: '480p',
    size: '2.8MB',
    description: 'SampleLib short MP4 sample',
    features: ['Reliable', 'HTTPS', 'Quick Load']
  },
  {
    id: 'tears-steel-480p',
    name: 'MP4 - Tears of Steel (480p)',
    url: 'https://samplelib.com/lib/preview/mp4/sample-10s.mp4',
    format: 'MP4',
    quality: '480p',
    size: '5.3MB',
    description: 'SampleLib medium-length MP4 sample',
    features: ['Reliable', 'HTTPS', 'MP4']
  },
  {
    id: 'elephant-dream',
    name: 'MP4 - Elephant\'s Dream',
    url: 'https://samplelib.com/lib/preview/mp4/sample-15s.mp4',
    format: 'MP4',
    quality: '720p',
    size: '11.3MB',
    description: 'SampleLib long MP4 sample',
    features: ['Reliable', 'HTTPS', 'Longer Clip']
  },
  {
    id: 'mp4-big-buck-bunny',
    name: 'MP4 - Big Buck Bunny',
    url: 'https://samplelib.com/lib/preview/mp4/sample-20s.mp4',
    format: 'MP4',
    quality: '720p',
    size: '11.2MB',
    description: 'Longer MP4 test clip for compatibility validation',
    features: ['Reliable', 'HTTPS', 'Single Quality']
  },
  {
    id: 'hls-apple-basic',
    name: 'HLS - Apple Basic Stream',
    url: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8',
    format: 'HLS (.m3u8)',
    quality: 'Adaptive',
    size: '~30s',
    description: 'Apple\'s official HLS test stream',
    features: ['Apple Official', 'Multiple Qualities', 'Reliable']
  }
];

export const VideoSourceSelector: React.FC<VideoSourceSelectorProps> = ({
  videoSources: propVideoSources,
  selectedVideo,
  onVideoSelect,
  onSourceSelect,
  currentSource,
  className = ""
}) => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [erroredSources, setErroredSources] = useState<Set<string>>(new Set());

  // Use prop video sources or fallback to default
  const sources = propVideoSources || videoSources;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSourceSelect = async (source: VideoSource) => {
    if (isLoading) {
      return; // Prevent double clicks
    }
    
    getPlayerLogger().info('Selecting video source:', source.name, source.url);
    setIsLoading(source.id);
    
    // Remove from errored sources if user is retrying
    if (erroredSources.has(source.id)) {
      const newErroredSources = new Set(erroredSources);
      newErroredSources.delete(source.id);
      setErroredSources(newErroredSources);
    }
    
    try {
      // Call the appropriate callback
      if (onVideoSelect) {
        onVideoSelect(source);
      } else if (onSourceSelect) {
        await onSourceSelect(source);
      }
    } catch (error) {
      getPlayerLogger().error('Error selecting source:', error);
      // Mark this source as errored
      setErroredSources(prev => new Set([...prev, source.id]));
    } finally {
      // Clear loading state after a short delay
      setTimeout(() => setIsLoading(null), 1000);
    }
  };

  const getFormatColor = (format: string) => {
    switch (format.toLowerCase()) {
      case 'hls (.m3u8)':
        return 'bg-blue-500 text-white';
      case 'dash (.mpd)':
        return 'bg-green-500 text-white';
      case 'mp4':
        return 'bg-purple-500 text-white';
      case 'webm':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality.toLowerCase()) {
      case 'adaptive':
        return 'bg-emerald-500 text-white';
      case '1080p':
        return 'bg-blue-500 text-white';
      case '720p':
        return 'bg-cyan-500 text-white';
      case '480p':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  if (!mounted) {
    return (
      <div className={className}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileVideo className="h-5 w-5" />
              Video Format Showcase
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Loading video formats...
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="border rounded-lg p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileVideo className="h-5 w-5" />
            Video Format Showcase
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Test different video formats and streaming protocols to explore all features
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sources.map((source) => {
              const isSupported = isVideoFormatSupportedSimple(source.url);
              const hasError = erroredSources.has(source.id);
              const isSelected = selectedVideo?.id === source.id || currentSource === source.url;
              
              return (
                <div
                  key={source.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                      : hasError
                        ? 'border-red-300 bg-red-50 dark:bg-red-950/30'
                        : isSupported 
                          ? 'border-gray-200 hover:border-gray-300'
                          : 'border-red-200 bg-red-50 dark:bg-red-950 opacity-75'
                  } ${isLoading === source.id ? 'opacity-50 pointer-events-none' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if ((isSupported || hasError) && !isLoading) {
                      handleSourceSelect(source);
                    }
                  }}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium text-sm leading-tight">{source.name}</h3>
                      <div className="flex items-center gap-1">
                        {currentSource === source.url && (
                          <Play className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        )}
                        {hasError && (
                          <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                        )}
                        {!isSupported && !hasError && (
                          <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <Badge className={`text-xs ${getFormatColor(source.format)}`}>
                        {source.format}
                      </Badge>
                      <Badge className={`text-xs ${getQualityColor(source.quality)}`}>
                        {source.quality}
                      </Badge>
                      {source.fallbackUrls && source.fallbackUrls.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          Failover
                        </Badge>
                      )}
                      {source.aspectRatio && (
                        <Badge variant="outline" className="text-xs">
                          {source.aspectRatio === '16/9' ? '📺 Landscape' :
                           source.aspectRatio === '9/16' ? '📱 Vertical' :
                           source.aspectRatio === '1/1' ? '⬜ Square' :
                           source.aspectRatio}
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {hasError ? "⚠️ This video failed to load. Click 'Retry' to try again." : source.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {source.size && (
                        <div className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {source.size}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Info className="h-3 w-3" />
                        {source.features.length} features
                      </div>
                    </div>

                    <div className="space-y-1">
                      {source.features.slice(0, 2).map((feature, index) => (
                        <div key={index} className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                          <span className="text-xs text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                      {source.features.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{source.features.length - 2} more features
                        </div>
                      )}
                    </div>

                    <Button 
                      size="sm" 
                      className="w-full mt-2"
                      variant={currentSource === source.url ? "default" : hasError ? "destructive" : "outline"}
                      disabled={(!isSupported && !hasError) || isLoading === source.id}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if ((isSupported || hasError) && !isLoading) {
                          handleSourceSelect(source);
                        }
                      }}
                    >
                      {isLoading === source.id ? "Loading..." :
                       hasError ? "Retry" :
                       !isSupported ? "Not Supported" : 
                       currentSource === source.url ? "Playing" : "Load Video"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
