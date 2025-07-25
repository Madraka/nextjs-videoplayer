/**
 * Next.js 15 Video Player Demo Page
 * Showcases the video player with HLS streaming
 */

"use client";

import React, { useRef, useState } from 'react';
import { VideoPlayer } from '@/components/player/video-player';
import { VideoAnalytics } from '@/components/analytics/video-analytics';
import { VideoSourceSelector } from '@/components/demo/video-source-selector';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  const playerRef = useRef<HTMLVideoElement>(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(
    process.env.NEXT_PUBLIC_STREAM_URL || "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8"
  );
  const [playerState, setPlayerState] = useState(null);

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">
            🎥 Next.js 15 Video Player
          </h1>
          <p className="text-gray-300">
            Powered by HLS.js, ShadCN UI, and modern web technologies
          </p>
        </div>
      </header>

      {/* Main Video Player */}
      <main className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <VideoPlayer
            src={process.env.NEXT_PUBLIC_STREAM_URL || "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8"}
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
            onReady={() => console.log('Video player ready')}
            onPlay={() => console.log('Video started playing')}
            onPause={() => console.log('Video paused')}
            onError={(error) => console.error('Video error:', error)}
          />
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <FeatureCard
            icon="🎯"
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
            description="Built with App Router and modern React features"
          />
          <FeatureCard
            icon="🌐"
            title="Cross Platform"
            description="Works across all modern browsers and devices"
          />
        </div>

        {/* Code Example */}
        <div className="mt-12 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Start</h2>
          <pre className="text-green-400 text-sm overflow-x-auto">
{`import { VideoPlayer } from '@/components/player/video-player';

<VideoPlayer
  src="/your-video.m3u8"
  controls={{ fullscreen: true, quality: true }}
  gestures={{ tapToPlay: true, doubleTapSeek: true }}
/>`}
          </pre>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-sm p-6 mt-12">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p>Built with ❤️ using Next.js 15, ShadCN UI, and HLS.js</p>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 text-center">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}
