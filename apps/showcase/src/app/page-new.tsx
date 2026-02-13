"use client";

import React, { useRef, useState } from 'react';
import { VideoPlayer, VideoSourceSelector, getPlayerLogger, type VideoSource } from '@madraka/nextjs-videoplayer';
import { VideoAnalytics } from '@/components/analytics/video-analytics';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  const playerRef = useRef<HTMLVideoElement>(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(
    process.env.NEXT_PUBLIC_STREAM_URL || "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8"
  );

  const handleSourceChange = (source: VideoSource) => {
    setCurrentVideoUrl(source.url);
  };

  const FeatureCard = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
    <div className="border rounded-lg p-6 text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Next.js 15 Video Player
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Advanced video streaming with HLS.js, Dash.js, and real-time analytics
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Video Player Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Video Player</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Experience adaptive streaming with touch gestures and modern controls
            </p>
          </div>
          
          <VideoPlayer
            ref={playerRef}
            src={currentVideoUrl}
            poster={process.env.NEXT_PUBLIC_POSTER_IMAGE}
            autoPlay={false}
            muted={false}
            className="w-full max-w-4xl mx-auto"
            controls={{
              show: true,
              fullscreen: true,
              quality: true,
              volume: true,
              progress: true,
              playPause: true,
            }}
            gestures={{
              enabled: true,
              tapToPlay: true,
              doubleTapSeek: true,
              swipeVolume: true,
            }}
            onReady={() => getPlayerLogger().info('Video player ready')}
            onPlay={() => getPlayerLogger().info('Video started playing')}
            onPause={() => getPlayerLogger().info('Video paused')}
            onError={(error) => getPlayerLogger().error('Video error:', error)}
          />
        </section>

        <Separator />

        {/* Video Format Selection */}
        <section>
          <VideoSourceSelector
            onSourceSelect={handleSourceChange}
            currentSource={currentVideoUrl}
          />
        </section>

        <Separator />

        {/* Real-time Analytics */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Real-time Analytics</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Monitor video performance, user engagement, and streaming metrics
            </p>
          </div>
          
          <VideoAnalytics 
            state={{
              isPlaying: false,
              isPaused: true,
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
            }}
          />
        </section>

        <Separator />

        {/* Features Grid */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Features</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Explore the comprehensive feature set of this video player
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon="🎥"
              title="Adaptive Streaming"
              description="Automatic quality switching with HLS.js and Dash.js support"
            />
            <FeatureCard
              icon="📱"
              title="Mobile Optimized"
              description="Touch gestures, responsive design, and mobile-first approach"
            />
            <FeatureCard
              icon="🎨"
              title="ShadCN UI"
              description="Beautiful, accessible components with Tailwind CSS"
            />
            <FeatureCard
              icon="🔌"
              title="Plugin System"
              description="Extensible architecture for custom functionality"
            />
            <FeatureCard
              icon="⚡"
              title="Next.js 15"
              description="Built with the latest Next.js App Router and TypeScript"
            />
            <FeatureCard
              icon="📊"
              title="Analytics"
              description="Real-time metrics and performance monitoring"
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>Built with Next.js 15, TypeScript, and ShadCN UI</p>
        </footer>
      </main>
    </div>
  );
}
