"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConfigurableVideoPlayer } from '@/components/player/configurable-video-player';
import { VideoSourceSelector, VideoSource } from '@/components/demo/video-source-selector';
import { PlayerConfigProvider } from '@/contexts/player-config-context';
import { PlayerPresets } from '@/types/player-config';
import { cn } from '@/lib/utils';
import { getPlayerLogger } from '@/lib/logger';
import type { VideoPlayerState } from '@/hooks/use-video-player';
import Link from 'next/link';
import { 
  Play, 
  Settings, 
  Smartphone, 
  Zap, 
  Palette, 
  Keyboard,
  ArrowRight,
  CheckCircle,
  Github,
  ExternalLink,
  Video,
  Monitor,
  Download
} from 'lucide-react';

const videoSources: VideoSource[] = [
  {
    id: 'bigbuck',
    name: 'Big Buck Bunny (MP4)',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    poster: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny_thumbs',
    format: 'MP4',
    quality: '4K',
    size: '15.3 MB',
    aspectRatio: '16/9',
    description: 'High quality demo video - Perfect for testing player features',
    features: ['4K Resolution', 'MP4 Container', 'Progressive Download', 'Thumbnail Preview']
  },
  {
    id: 'elephant',
    name: 'Elephant Dream (MP4)',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    poster: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
    thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream_thumbs',
    format: 'MP4',
    quality: 'HD',
    size: '8.7 MB',
    aspectRatio: '16/9',
    description: 'Blender Foundation animation showcase',
    features: ['HD Quality', 'Blender Animation', 'Open Source', 'Thumbnail Preview']
  },
  {
    id: 'sintel',
    name: 'Sintel (MP4)',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    poster: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg',
    thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/Sintel_thumbs',
    format: 'MP4',
    quality: 'HD',
    size: '12.1 MB',
    aspectRatio: '16/9',
    description: 'Award-winning short film by Blender Foundation',
    features: ['Award Winner', 'Short Film', 'Professional Quality', 'Thumbnail Preview']
  },
  {
    id: 'tears',
    name: 'Tears of Steel (HLS)',
    url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    format: 'HLS',
    quality: 'Adaptive',
    size: 'Variable',
    aspectRatio: '16/9',
    description: 'HLS adaptive streaming demo - Multiple quality levels',
    features: ['Adaptive Bitrate', 'HLS Streaming', 'Multi-Quality']
  },
  {
    id: 'vertical-sample',
    name: 'Vertical Demo (9:16)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    format: 'MP4',
    quality: 'HD',
    size: '15 MB',
    aspectRatio: '9/16',
    description: 'Mobile-first vertical video format - Perfect for social media',
    features: ['Vertical Format', 'Mobile Optimized', 'Social Media Ready']
  },
  {
    id: 'square-sample',
    name: 'Square Demo (1:1)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    format: 'MP4',
    quality: 'HD',
    size: '8 MB',
    aspectRatio: '1/1',
    description: 'Square video format - Instagram and social media optimized',
    features: ['Square Format', 'Instagram Ready', 'Social Optimized']
  }
];

type PlayerAspectRatio = NonNullable<React.ComponentProps<typeof ConfigurableVideoPlayer>['aspectRatio']>;

const resolveAspectRatio = (value?: string): PlayerAspectRatio => {
  switch (value) {
    case 'auto':
    case '16/9':
    case '4/3':
    case '1/1':
    case '9/16':
    case '3/4':
    case 'custom':
      return value;
    default:
      return '16/9';
  }
};

function HomePageClient() {
  const [selectedVideo, setSelectedVideo] = useState(videoSources[0]);
  const [playerState, setPlayerState] = useState<VideoPlayerState>({
    isPlaying: false,
    isPaused: false,
    isLoading: false,
    isMuted: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    buffered: 0,
    quality: 'auto',
    isFullscreen: false,
    error: null,
    playCount: 0,
    totalWatchTime: 0,
    bufferingTime: 0,
    averageBitrate: 0,
    qualityChanges: 0,
    playbackRate: 1,
    isPictureInPicture: false,
    isTheaterMode: false,
  });

  // Ambient Lighting System - Enhanced with debugging
  const [ambientColors, setAmbientColors] = useState({
    primary: 'rgba(100, 116, 139, 0.6)', // Neutral slate
    secondary: 'rgba(71, 85, 105, 0.4)', // Darker slate
    accent: 'rgba(148, 163, 184, 0.3)' // Light slate
  });

  const [isAnalysisWorking, setIsAnalysisWorking] = useState(false);

  // Enhanced video color analysis with performance optimization
  const analyzeVideoColors = React.useCallback((videoElement: HTMLVideoElement) => {
    if (!videoElement || videoElement.readyState < 2) {
      getPlayerLogger().debug('Video not ready for analysis:', videoElement?.readyState);
      return;
    }

    // Performance optimization: Skip analysis if video is buffering or seeking
    if (videoElement.seeking || videoElement.networkState === HTMLMediaElement.NETWORK_LOADING) {
      getPlayerLogger().debug('Skipping analysis: video is buffering or seeking');
      return;
    }

    // Aggressive CORS handling for Google Cloud Storage
    if (!videoElement.crossOrigin && videoElement.src.includes('googleapis.com')) {
      getPlayerLogger().debug('Setting crossOrigin for Google Cloud video');
      videoElement.crossOrigin = 'anonymous';
      // Force reload to apply crossOrigin
      const currentTime = videoElement.currentTime;
      videoElement.load();
      videoElement.currentTime = currentTime;
      return; // Wait for reload
    }

    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          getPlayerLogger().debug('Canvas context not available');
          return;
        }

        // Even smaller canvas for better performance
        canvas.width = 32;
        canvas.height = 18;

        // Draw current video frame - this might fail due to CORS
        try {
          ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          getPlayerLogger().debug('Successfully drew video frame to canvas');
        } catch (corsError) {
          getPlayerLogger().debug('CORS error when drawing video frame:', corsError);
          setIsAnalysisWorking(false);
          
          // Enhanced fallback dynamic colors based on video time and source
          const time = videoElement.currentTime || 0;
          const videoId = selectedVideo.id;
          
          // Different color palettes for different videos
          let baseHue = 200; // Default blue
          if (videoId === 'bigbuck') baseHue = 45; // Orange/yellow theme
          else if (videoId === 'elephant') baseHue = 280; // Purple theme  
          else if (videoId === 'sintel') baseHue = 15; // Red/orange theme
          else if (videoId === 'tears') baseHue = 200; // Blue theme
          
          const dynamicPrimary = `hsla(${baseHue + Math.sin(time * 0.05) * 20}, ${55 + Math.cos(time * 0.08) * 15}%, ${45 + Math.sin(time * 0.04) * 15}%, 0.6)`;
          const dynamicSecondary = `hsla(${baseHue + 60 + Math.cos(time * 0.06) * 30}, ${50 + Math.sin(time * 0.09) * 20}%, ${40 + Math.cos(time * 0.05) * 20}%, 0.4)`;
          const dynamicAccent = `hsla(${baseHue + 120 + Math.sin(time * 0.07) * 40}, ${45 + Math.cos(time * 0.06) * 25}%, ${35 + Math.sin(time * 0.03) * 25}%, 0.3)`;
          
          setAmbientColors({
            primary: dynamicPrimary,
            secondary: dynamicSecondary,
            accent: dynamicAccent
          });
          return;
        }

        // Analyze edge pixels for ambient colors - optimized
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        let edgeR = 0, edgeG = 0, edgeB = 0;
        let centerR = 0, centerG = 0, centerB = 0;
        let edgeCount = 0, centerCount = 0;

        // Simplified analysis for better performance
        for (let y = 0; y < canvas.height; y += 2) { // Skip every other row for performance
          for (let x = 0; x < canvas.width; x += 2) { // Skip every other column for performance
            const index = (y * canvas.width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];

            // Skip very dark or very bright pixels
            const brightness = (r + g + b) / 3;
            if (brightness < 20 || brightness > 235) continue;

            // Edge detection for ambient lighting
            const isEdge = x < 4 || x > canvas.width - 4 || y < 2 || y > canvas.height - 2;
            
            if (isEdge) {
              edgeR += r;
              edgeG += g;
              edgeB += b;
              edgeCount++;
            } else {
              centerR += r;
              centerG += g;
              centerB += b;
              centerCount++;
            }
          }
        }

        if (edgeCount > 0 && centerCount > 0) {
          // Calculate average colors for different regions
          const avgEdgeR = Math.round(edgeR / edgeCount);
          const avgEdgeG = Math.round(edgeG / edgeCount);
          const avgEdgeB = Math.round(edgeB / edgeCount);

          const avgCenterR = Math.round(centerR / centerCount);
          const avgCenterG = Math.round(centerG / centerCount);
          const avgCenterB = Math.round(centerB / centerCount);

          // Create enhanced ambient color palette with optimized intensity
          const primaryColor = `rgba(${avgEdgeR}, ${avgEdgeG}, ${avgEdgeB}, 0.6)`;
          const secondaryColor = `rgba(${Math.round((avgEdgeR + avgCenterR) / 2)}, ${Math.round((avgEdgeG + avgCenterG) / 2)}, ${Math.round((avgEdgeB + avgCenterB) / 2)}, 0.4)`;
          const accentColor = `rgba(${avgCenterR}, ${avgCenterG}, ${avgCenterB}, 0.3)`;

          setAmbientColors({
            primary: primaryColor,
            secondary: secondaryColor,
            accent: accentColor
          });
          
          setIsAnalysisWorking(true);
          getPlayerLogger().debug('Video color analysis successful:', { avgEdgeR, avgEdgeG, avgEdgeB });
        } else {
          getPlayerLogger().debug('No valid pixels found for analysis');
          setIsAnalysisWorking(false);
        }
      } catch (error) {
        getPlayerLogger().debug('Video color analysis failed:', error);
        setIsAnalysisWorking(false);
        // Keep default colors on error
      }
    });
  }, [selectedVideo.id]);

  // Enhanced video player state management with complete reset
  const handleVideoSelect = React.useCallback((video: VideoSource) => {
    getPlayerLogger().debug('Video selection starting:', video.name);
    
    // Prevent selection if already selected
    if (selectedVideo.id === video.id) {
      getPlayerLogger().debug('Video already selected, skipping');
      return;
    }
    
    // Clear all existing states immediately
    setIsAnalysisWorking(false);
    setAmbientColors({
      primary: 'rgba(100, 116, 139, 0.4)',
      secondary: 'rgba(71, 85, 105, 0.3)', 
      accent: 'rgba(148, 163, 184, 0.2)'
    });
    
    // Reset player state to ensure fresh start
    setPlayerState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      isLoading: true,
      currentTime: 0,
      error: null
    }));
    
    // Update video selection first
    setSelectedVideo(video);
    
    // Get video element and reset it completely
    const videoElement = document.querySelector('video') as HTMLVideoElement;
    if (videoElement) {
      getPlayerLogger().debug('Resetting video player completely');
      
      // Stop current video completely
      videoElement.pause();
      videoElement.currentTime = 0;
      
      // Clear source and load to reset media
      videoElement.removeAttribute('src');
      videoElement.load();
      
      // Reset all video attributes
      videoElement.crossOrigin = null;
      
      // Small delay to ensure complete DOM reset
      setTimeout(() => {
        getPlayerLogger().debug('Setting new video source:', video.url);
        
        // Set crossOrigin for external sources before setting src
        if (video.url.includes('googleapis.com') || video.url.includes('http')) {
          videoElement.crossOrigin = 'anonymous';
          getPlayerLogger().debug('Set crossOrigin for external video');
        }
        
        // Set new source
        videoElement.src = video.url;
        videoElement.load();
        
        // Wait for video to be ready, then start playback
        const handleCanPlay = () => {
          getPlayerLogger().debug('Video can play, starting playback');
          // Small delay to ensure everything is ready
          setTimeout(() => {
            videoElement.play().catch(err => {
              getPlayerLogger().debug('Autoplay failed (expected):', err.message);
            });
          }, 100);
          videoElement.removeEventListener('canplay', handleCanPlay);
        };
        
        videoElement.addEventListener('canplay', handleCanPlay, { once: true });
        
        // Fallback - try to play after a longer delay
        setTimeout(() => {
          if (videoElement.paused && videoElement.readyState >= 3) {
            getPlayerLogger().debug('Fallback play attempt');
            videoElement.play().catch(err => {
              getPlayerLogger().debug('Fallback play failed:', err.message);
            });
          }
        }, 1000);
        
      }, 150);
    }
  }, [selectedVideo.id]);

  // Simplified video analysis initialization
  const initializeVideoAnalysis = React.useCallback(() => {
    const videoElement = document.querySelector('video') as HTMLVideoElement;
    if (!videoElement) {
      getPlayerLogger().debug('Video element not found');
      return;
    }

    // Set up analysis when video is ready
    const handleVideoReady = () => {
      if (videoElement.readyState >= 2) {
        getPlayerLogger().debug('Video ready for analysis');
        setTimeout(() => analyzeVideoColors(videoElement), 500);
      }
    };

    // Set up event listeners
    videoElement.addEventListener('loadeddata', handleVideoReady, { once: true });
    videoElement.addEventListener('canplay', handleVideoReady, { once: true });
    
    // Immediate check if video is already ready
    if (videoElement.readyState >= 2) {
      handleVideoReady();
    }
  }, [analyzeVideoColors]);

  // Auto-update ambient lighting during video playback - optimized for performance
  React.useEffect(() => {
    if (!playerState.isPlaying) return;

    const interval = setInterval(() => {
      const videoElement = document.querySelector('video') as HTMLVideoElement;
      if (videoElement && isAnalysisWorking) {
        // Only update occasionally when video is actually playing to prevent freezing
        analyzeVideoColors(videoElement);
      }
    }, 8000); // Reduced frequency: Update every 8 seconds to improve performance

    return () => clearInterval(interval);
  }, [playerState.isPlaying, analyzeVideoColors, isAnalysisWorking]);

  // Initial color analysis when video loads - performance optimized
  React.useEffect(() => {
    // Reset analysis state when video changes
    setIsAnalysisWorking(false);

    // Debounce the initialization to avoid rapid successive calls
    const timeout = setTimeout(() => {
      initializeVideoAnalysis();
    }, 800); // Increased delay for better performance

    return () => {
      clearTimeout(timeout);
    };
  }, [selectedVideo.url, initializeVideoAnalysis]);

  return (
    <PlayerConfigProvider defaultConfig={PlayerPresets.default}>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        
        {/* Hero Section with Video Player - Completely Neutral Background */}
        <section className="relative py-20 lg:py-28 px-4 bg-white dark:bg-black overflow-hidden">
          {/* Very subtle texture only - no colors */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/20 via-white/10 to-gray-100/5 dark:from-gray-800/10 dark:via-black/5 dark:to-gray-900/5"></div>
          
          <div className="container mx-auto max-w-7xl relative z-10">
            
            {/* Header */}
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-6 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                🚀 Modern Video Streaming
              </Badge>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 text-gray-900 dark:text-white leading-tight">
                Professional
                <br />
                Video Player
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-4xl mx-auto leading-relaxed">
                Advanced video streaming with cinematic features, adaptive quality, and complete customization for modern web applications
              </p>
              
              {/* Action Buttons - With Real Links */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                <Button size="lg" className="gap-2 bg-gray-900 hover:bg-gray-800 text-white shadow-xl dark:bg-white dark:text-black dark:hover:bg-gray-100" 
                        onClick={() => document.querySelector('video')?.scrollIntoView({ behavior: 'smooth' })}>
                  <Play className="h-5 w-5" />
                  Try Live Demo
                </Button>
                <Link href="https://github.com/Madraka/nextjs-videoplayer" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="lg" className="gap-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-lg w-full">
                    <Github className="h-5 w-5" />
                    View on GitHub
                  </Button>
                </Link>
                <Link href="/config-examples">
                  <Button variant="outline" size="lg" className="gap-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-lg w-full">
                    <ExternalLink className="h-5 w-5" />
                    Documentation
                  </Button>
                </Link>
              </div>
            </div>

            {/* Video Player Section */}
            <div className={cn(
              "max-w-7xl mx-auto",
              // Container adjustment for different aspect ratios
              selectedVideo.aspectRatio === '9/16' || selectedVideo.aspectRatio === '3/4' 
                ? 'flex justify-center' 
                : selectedVideo.aspectRatio === '1/1'
                ? 'flex justify-center'
                : 'w-full'
            )}>
              {/* Video Player - Full width without sidebar */}
              <div className="space-y-8">
                
                {/* Video Player - Smooth Dynamic Ambient Lighting */}
                <div className={cn(
                  "relative group",
                  // Vertical video formatting
                  selectedVideo.aspectRatio === '9/16' || selectedVideo.aspectRatio === '3/4' 
                    ? 'max-w-sm mx-auto' 
                    : selectedVideo.aspectRatio === '1/1'
                    ? 'max-w-lg mx-auto'
                    : 'w-full'
                )}>
                  {/* Optimized Dynamic Ambient Lighting Layers - Reduced for performance */}
                  <div 
                    className="absolute -inset-12 rounded-[4rem] blur-2xl opacity-60 group-hover:opacity-80 transition-all duration-[2000ms] ease-out"
                    style={{ 
                      background: `radial-gradient(ellipse at center, ${ambientColors.primary} 0%, ${ambientColors.secondary} 60%, transparent 100%)` 
                    }}
                  ></div>
                  
                  <div 
                    className="absolute -inset-8 rounded-[3rem] blur-xl opacity-50 group-hover:opacity-70 transition-all duration-[1500ms] ease-out"
                    style={{ 
                      background: `linear-gradient(45deg, ${ambientColors.secondary}, ${ambientColors.primary})` 
                    }}
                  ></div>
                  
                  {/* Main border glow - optimized */}
                  <div 
                    className="absolute -inset-3 rounded-3xl blur-md opacity-50 group-hover:opacity-70 transition-all duration-[1000ms] ease-out"
                    style={{ 
                      background: `linear-gradient(90deg, ${ambientColors.primary}, ${ambientColors.secondary})` 
                    }}
                  ></div>
                  
                  {/* Video container with optimized dynamic shadows */}
                  <div 
                    className="relative bg-black rounded-2xl overflow-hidden shadow-2xl transition-all duration-[1000ms] ease-out"
                    style={{ 
                      boxShadow: `0 20px 40px -10px ${ambientColors.primary}, 0 0 0 1px rgba(255,255,255,0.1)` 
                    }}
                  >
                    {/* Simplified overlays for better performance */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 pointer-events-none z-10"></div>
                    
                    <ConfigurableVideoPlayer
                      src={selectedVideo.url}
                      poster={selectedVideo.poster}
                      thumbnailUrl={selectedVideo.thumbnailUrl}
                      autoPlay={true}
                      muted={false}
                      aspectRatio={resolveAspectRatio(selectedVideo.aspectRatio)}
                      onStateChange={setPlayerState}
                      className="w-full relative z-20"
                    />
                  </div>
                  
                  {/* Video Info - Clean styling with debug info */}
                  <div className="mt-8 relative">
                    <div className="relative p-8 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-2xl">
                      <div className="relative flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">{selectedVideo.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{selectedVideo.description}</p>
                          {/* Performance debug info */}
                          <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                            Ambient Lighting: {isAnalysisWorking ? '🟢 Optimized video-based colors' : '🟡 Performance mode (fallback colors)'}
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Badge variant="outline" className="bg-gray-50/90 text-gray-700 border-gray-200/70 dark:bg-gray-700/50 dark:text-gray-300 dark:border-gray-600/70 shadow-md backdrop-blur-sm">
                            {selectedVideo.format}
                          </Badge>
                          <Badge variant="outline" className="bg-gray-50/90 text-gray-700 border-gray-200/70 dark:bg-gray-700/50 dark:text-gray-300 dark:border-gray-600/70 shadow-md backdrop-blur-sm">
                            {selectedVideo.quality}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Video Source Selector - Clean styling without background gradients */}
                <div className="relative">
                  <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/70 dark:border-gray-700/70 shadow-2xl">
                    <div className="relative flex items-center gap-4 mb-6">
                      <div className="p-3 bg-gray-900 dark:bg-white dark:text-gray-900 rounded-xl shadow-xl">
                        <Video className="h-6 w-6 text-white dark:text-gray-900" />
                      </div>
                      <h3 className="font-semibold text-xl text-gray-900 dark:text-white">Choose Video Source</h3>
                      
                      {/* Simple accent line */}
                      <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-600"></div>
                    </div>
                    
                    <VideoSourceSelector
                      videoSources={videoSources}
                      selectedVideo={selectedVideo}
                      onVideoSelect={handleVideoSelect}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Player Stats & Features Section */}
        <section className="py-20 px-4 bg-white dark:bg-gray-900">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                Live Player Statistics
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Real-time monitoring of player performance and active features
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              
              {/* Player Status Card - Neutral colors */}
              <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/20 dark:to-gray-700/20 shadow-lg hover:-translate-y-2">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Monitor className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">Player Status</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">State:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {playerState.isLoading ? '⏳ Loading' : 
                         playerState.isPlaying ? '▶️ Playing' : 
                         playerState.isPaused ? '⏸️ Paused' : '⏹️ Stopped'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Quality:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{playerState.quality}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Volume & Audio - Neutral colors */}
              <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/20 dark:to-gray-700/20 shadow-lg hover:-translate-y-2">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-2xl text-white">🔊</span>
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">Audio Control</h3>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                      {playerState.isMuted ? '🔇' : `${Math.round(playerState.volume * 100)}%`}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {playerState.isMuted ? 'Muted' : 'Volume Level'}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Streaming Tech */}
              <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 shadow-lg hover:-translate-y-2">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">Streaming Tech</h3>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-green-600 dark:text-green-400">
                      HLS & DASH
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Adaptive Quality
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance */}
              <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 shadow-lg hover:-translate-y-2">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-2xl text-white">⚡</span>
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">Performance</h3>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-orange-600 dark:text-orange-400">
                      Optimized
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Smart Buffering
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Active Features List */}
            <div className="mt-12 max-w-4xl mx-auto">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Active Features</h3>
                  <p className="text-gray-600 dark:text-gray-400">Currently enabled player capabilities</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[
                    { name: 'HLS & DASH Streaming', icon: '📡' },
                    { name: 'Adaptive Quality', icon: '🎯' },
                    { name: 'Keyboard Shortcuts', icon: '⌨️' },
                    { name: 'Touch Gestures', icon: '👆' },
                    { name: 'Picture-in-Picture', icon: '📺' },
                    { name: 'Theater Mode', icon: '🎬' }
                  ].map((feature, index) => (
                    <div key={index} className="text-center p-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 hover:shadow-lg transition-all duration-200">
                      <div className="text-2xl mb-2">{feature.icon}</div>
                      <div className="text-xs font-medium text-gray-700 dark:text-gray-300">{feature.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Multi-Format Video Support Section */}
        <section className="py-24 px-4 relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gray-50 dark:bg-gray-900"></div>
          
          <div className="container mx-auto max-w-7xl relative">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300 text-sm font-medium mb-6">
                <Video className="h-4 w-4" />
                Multi-Format Support
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                Every Video Format,
                <br />
                <span className="text-gray-700 dark:text-gray-300">
                  Perfectly Displayed
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                From cinematic landscapes to viral vertical content - our intelligent player adapts seamlessly to any aspect ratio
              </p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Landscape Format */}
              <div className="group h-full">
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 h-full flex flex-col">
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-gray-800 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                        <Monitor className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Landscape</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">16:9 Widescreen</p>
                      </div>
                    </div>
                    
                    <div className="relative mb-6 overflow-hidden rounded-xl">
                      <div className="aspect-video bg-gray-800 dark:bg-gray-700 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="w-12 h-12 bg-gray-700 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Play className="h-6 w-6 ml-0.5" />
                          </div>
                          <div className="text-sm font-medium">Landscape • Cinema • Desktop</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Aspect Ratio</span>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                          16:9
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Best For</span>
                        <span className="font-medium text-gray-900 dark:text-white">Desktop & TV</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Platforms</span>
                        <span className="text-gray-700 dark:text-gray-300">Streaming Platforms</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vertical Format */}
              <div className="group h-full">
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 h-full flex flex-col">
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-gray-800 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                        <Smartphone className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Vertical</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">9:16 Portrait</p>
                      </div>
                    </div>
                    
                    <div className="relative mb-6 overflow-hidden rounded-xl flex justify-center">
                      <div className="w-40 aspect-[9/16] bg-gray-800 dark:bg-gray-700 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="w-10 h-10 bg-gray-700 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Play className="h-5 w-5 ml-0.5" />
                          </div>
                          <div className="text-xs font-medium">TikTok • Reels</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Aspect Ratio</span>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                          9:16
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Best For</span>
                        <span className="font-medium text-gray-900 dark:text-white">Mobile & Social</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Platforms</span>
                        <span className="text-gray-700 dark:text-gray-300">TikTok, Instagram</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Square Format */}
              <div className="group h-full">
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 h-full flex flex-col">
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-gray-800 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                        <div className="w-7 h-7 border-2 border-white rounded-md"></div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Square</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">1:1 Perfect</p>
                      </div>
                    </div>
                    
                    <div className="relative mb-6 overflow-hidden rounded-xl flex justify-center">
                      <div className="w-44 aspect-square bg-gray-800 dark:bg-gray-700 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="w-10 h-10 bg-gray-700 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Play className="h-5 w-5 ml-0.5" />
                          </div>
                          <div className="text-xs font-medium">Instagram • Feeds</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Aspect Ratio</span>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                          1:1
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Best For</span>
                        <span className="font-medium text-gray-900 dark:text-white">Social Feeds</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Platforms</span>
                        <span className="text-gray-700 dark:text-gray-300">Instagram, LinkedIn</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="mt-20">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      16:9
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Landscape</div>
                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Widescreen Standard</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      9:16
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Vertical</div>
                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">TikTok Standard</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      1:1
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Square</div>
                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Instagram Feed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      4:3
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Classic</div>
                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Traditional TV</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="mt-16 text-center">
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <span className="text-sm font-medium">Auto-Detection</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <span className="text-sm font-medium">Responsive Layout</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <span className="text-sm font-medium">Mobile Optimized</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions Section */}
        <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800/50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                Quick Actions
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Get started with examples, documentation, and downloads
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              
              {/* View Examples - Neutral colors */}
              <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white dark:bg-gray-800 shadow-lg hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Settings className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">View Examples</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">Explore configuration examples and see the player in action</p>
                  <Link href="/config-examples" className="block">
                    <Button className="w-full gap-2 bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100">
                      <Play className="h-4 w-4" />
                      Try Examples
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Documentation - Real Link */}
              <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white dark:bg-gray-800 shadow-lg hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <ExternalLink className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Documentation</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">Complete API reference and integration guides</p>
                  <Link href="/config-examples">
                    <Button variant="outline" className="w-full gap-2 border-gray-300 dark:border-gray-600">
                      <ExternalLink className="h-4 w-4" />
                      Read Docs
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Download - Real Link */}
              <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white dark:bg-gray-800 shadow-lg hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Download className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Download</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">Get the latest version and start building amazing video experiences</p>
                  <Link href="https://github.com/Madraka/nextjs-videoplayer/releases" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full gap-2 border-gray-300 dark:border-gray-600">
                      <Download className="h-4 w-4" />
                      Download Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Showcase Section */}
        <section className="py-24 px-4 bg-gray-50 dark:bg-gray-800/50">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                Why Choose Our Video Player?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
                Built with the latest technologies to deliver the best video streaming experience across all devices
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white dark:bg-gray-800 shadow-lg hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Lightning Fast</h3>
                  <p className="text-gray-600 dark:text-gray-300">Optimized for performance with adaptive streaming and smart buffering</p>
                </CardContent>
              </Card>
              
              <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white dark:bg-gray-800 shadow-lg hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Smartphone className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Mobile First</h3>
                  <p className="text-gray-600 dark:text-gray-300">Touch gestures, responsive design, and mobile-optimized controls</p>
                </CardContent>
              </Card>
              
              <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white dark:bg-gray-800 shadow-lg hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Palette className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Fully Customizable</h3>
                  <p className="text-gray-600 dark:text-gray-300">Complete theme system and plugin architecture for unlimited customization</p>
                </CardContent>
              </Card>
              
              <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white dark:bg-gray-800 shadow-lg hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Keyboard className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Accessible</h3>
                  <p className="text-gray-600 dark:text-gray-300">Full keyboard navigation and screen reader support for everyone</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Technical Features Section */}
        <section className="py-24 px-4 bg-white dark:bg-gray-900">
          <div className="container mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              
              {/* Features List */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                    Advanced Features
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                    Everything you need for professional video streaming, built with modern web technologies
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center mt-1">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">HLS & DASH Streaming</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Native support for adaptive bitrate streaming with automatic quality switching based on network conditions
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center mt-1">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Plugin Architecture</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Extensible plugin system for custom features, analytics, and third-party integrations
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center mt-1">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Advanced Controls</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Picture-in-picture, theater mode, keyboard shortcuts, and gesture controls
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center mt-1">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">TypeScript Support</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Fully typed API with excellent IntelliSense support and type safety
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Call to Action */}
              <div className="text-center lg:text-left">
                <div className="relative">
                  <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-3xl blur opacity-20"></div>
                  <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-12 rounded-3xl border border-gray-200 dark:border-gray-600">
                    <Video className="h-20 w-20 text-gray-600 dark:text-gray-400 mx-auto lg:mx-0 mb-6" />
                    <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Ready to Get Started?</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
                      Experience the power of modern video streaming with our professional video player solution
                    </p>
                    <div className="space-y-4">
                      <Button size="lg" className="w-full lg:w-auto gap-2 bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100">
                        <ArrowRight className="h-5 w-5" />
                        Get Started Now
                      </Button>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        ⚡ Quick setup • 🎯 Zero configuration • 🚀 Production ready
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Code Example Section */}
        <section className="py-24 px-4 bg-gray-50 dark:bg-gray-800/50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                Simple Implementation
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
                Get up and running with just a few lines of code. No complex configuration required.
              </p>
            </div>
            
            <div className="max-w-5xl mx-auto">
              <div className="relative">
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-2xl blur opacity-20"></div>
                <div className="relative bg-gray-900 dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="ml-4 text-gray-400 text-sm">video-player.tsx</span>
                  </div>
                  <pre className="text-sm text-gray-100 overflow-x-auto">
                    <code>{`import { ConfigurableVideoPlayer } from '@/components/player';

export default function MyPage() {
  return (
    <ConfigurableVideoPlayer
      src="https://example.com/video.m3u8"
      poster="/poster.jpg"
      autoPlay={false}
      muted={false}
      className="w-full aspect-video"
      controls={{
        fullscreen: true,
        quality: true,
        volume: true,
      }}
      gestures={{
        enabled: true,
        tapToPlay: true,
        doubleTapSeek: true,
      }}
    />
  );
}`}</code>
                  </pre>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Want to see more examples and advanced configurations?
                </p>
                <Link href="/config-examples">
                  <Button size="lg" variant="outline" className="gap-2 border-gray-300 dark:border-gray-600">
                    <ExternalLink className="h-5 w-5" />
                    View Documentation
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 px-4 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="container mx-auto max-w-6xl relative">
            <div className="text-center max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Ready to Transform Your
                <br />
                Video Experience?
              </h2>
              <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                Join thousands of developers who trust our professional video player for their streaming needs. 
                Get started today and see the difference.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
                <Button size="lg" variant="secondary" className="gap-2 bg-white text-gray-800 hover:bg-gray-100 shadow-lg">
                  <Github className="h-5 w-5" />
                  View on GitHub
                </Button>
                <Button size="lg" variant="outline" className="gap-2 border-white text-white hover:bg-white hover:text-gray-800 shadow-lg">
                  <Download className="h-5 w-5" />
                  Download Now
                </Button>
                <Link href="/config-examples">
                  <Button size="lg" variant="outline" className="gap-2 border-white text-white hover:bg-white hover:text-gray-800 shadow-lg">
                    <Play className="h-5 w-5" />
                    Live Demo
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-white mb-2">50K+</div>
                  <div className="text-gray-300">Downloads</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-2">99.9%</div>
                  <div className="text-gray-300">Uptime</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-2">⭐⭐⭐⭐⭐</div>
                  <div className="text-gray-300">Developer Experience</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PlayerConfigProvider>
  );
}

// Default export for dynamic import
export default HomePageClient;
