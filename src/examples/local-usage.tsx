/**
 * Local Usage Example - How to use the video player in the same project
 */

"use client";

import React from 'react';

// ✅ Method 1: Import from local src (Current Project)
import { PlayerContainer } from '@/components/player/player-container';
import { useVideoPlayer } from '@/hooks/use-video-player';
import { PlayerPresets } from '@/types/player-config';

// ✅ Method 2: Import from main index (Recommended)
import { 
  // PlayerContainer,  // Already imported above
  VideoPlayer,
  ConfigurableVideoPlayer,
  PlayerConfigProvider
} from '@/index';

export default function LocalUsageExample() {
  return (
    <div className="space-y-8 p-8">
      
      {/* 👑 MAIN USAGE - PlayerContainer (Single Import) */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">1. PlayerContainer - Main Usage</h2>
        <p className="text-gray-600">Single import, ready-to-use player with all features</p>
        
        <div className="max-w-4xl">
          <PlayerContainer 
            src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            poster="https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg"
            aspectRatio="16:9"
            autoPlay={false}
            muted={false}
            className="rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* 🎬 HLS/DASH Streaming */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">2. Streaming Support</h2>
        <p className="text-gray-600">HLS and DASH streaming with adaptive quality</p>
        
        <div className="max-w-4xl">
          <PlayerContainer 
            src="https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8"
            aspectRatio="16:9"
            autoPlay={false}
            className="rounded-lg shadow-lg"
            onStateChange={(state) => {
              console.log('Streaming state:', {
                quality: state.quality,
                isPlaying: state.isPlaying,
                currentTime: state.currentTime
              });
            }}
          />
        </div>
      </section>

      {/* 📱 Mobile Optimized */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">3. Mobile Optimized</h2>
        <p className="text-gray-600">Touch gestures and mobile-first design</p>
        
        <div className="max-w-sm mx-auto">
          <PlayerContainer 
            src="https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
            aspectRatio="16:9"
            autoPlay={false}
            muted={true}
            className="rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* ⚙️ Advanced Configuration */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">4. Advanced Configuration</h2>
        <p className="text-gray-600">Using ConfigurableVideoPlayer with presets</p>
        
        <div className="max-w-4xl">
          <PlayerConfigProvider defaultConfig={PlayerPresets.youtube}>
            <ConfigurableVideoPlayer 
              src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
              aspectRatio="16/9"
              autoPlay={false}
              className="rounded-lg shadow-lg"
            />
          </PlayerConfigProvider>
        </div>
      </section>

      {/* 🎯 Custom Implementation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">5. Custom Hook Usage</h2>
        <p className="text-gray-600">Building custom player with useVideoPlayer hook</p>
        
        <CustomPlayerExample />
      </section>

    </div>
  );
}

// Custom player component using the hook
function CustomPlayerExample() {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const { state, controls } = useVideoPlayer(videoRef, {
    autoPlay: false,
    muted: false,
    volume: 1,
  });

  React.useEffect(() => {
    if (controls) {
      controls.load({
        src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
        autoplay: false,
        muted: false,
      });
    }
  }, [controls]);

  return (
    <div className="max-w-2xl">
      <div className="relative bg-black rounded-lg overflow-hidden">
        <video 
          ref={videoRef} 
          className="w-full aspect-video object-contain"
          poster="https://storage.googleapis.com/gtv-videos-bucket/sample/images/SubaruOutbackOnStreetAndDirt.jpg"
        />
        
        {/* Custom overlay controls */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between text-white text-sm">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => state.isPlaying ? controls.pause() : controls.play()}
                className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded transition-colors"
              >
                {state.isPlaying ? '⏸️ Pause' : '▶️ Play'}
              </button>
              
              <span className="font-mono">
                {Math.floor(state.currentTime)}s / {Math.floor(state.duration)}s
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={controls.toggleMute}
                className="bg-gray-600 hover:bg-gray-700 px-2 py-1 rounded transition-colors"
              >
                {state.isMuted ? '🔇' : '🔊'}
              </button>
              
              <button 
                onClick={controls.toggleFullscreen}
                className="bg-gray-600 hover:bg-gray-700 px-2 py-1 rounded transition-colors"
              >
                ⛶
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* State display */}
      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        <h4 className="font-semibold mb-2">Player State:</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Playing: {state.isPlaying ? '✅' : '❌'}</div>
          <div>Volume: {Math.round(state.volume * 100)}%</div>
          <div>Quality: {state.quality}</div>
          <div>Buffered: {state.buffered.toFixed(1)}%</div>
        </div>
      </div>
    </div>
  );
}
