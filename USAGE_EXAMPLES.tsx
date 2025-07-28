/**
 * NextJS Video Player Usage Examples
 * Demonstrates all possible import and usage patterns
 */

// ✅ Method 1: Direct Single Import (RECOMMENDED)
import { PlayerContainer } from '@madraka/nextjs-videoplayer';

// ✅ Method 2: Multiple Specific Imports
import { 
  PlayerContainer,
  VideoPlayer, 
  ConfigurableVideoPlayer,
  useVideoPlayer,
  PlayerPresets
} from '@madraka/nextjs-videoplayer';

// ✅ Method 3: Category-based Imports from subdirectories
import { PlayerContainer } from '@madraka/nextjs-videoplayer/components/player';
import { useVideoPlayer } from '@madraka/nextjs-videoplayer/hooks';
import { VideoEngine } from '@madraka/nextjs-videoplayer/core';

// ✅ Method 4: Namespace Import (for heavy usage)
import * as VideoPlayer from '@madraka/nextjs-videoplayer';

export default function VideoPlayerExamples() {
  return (
    <div className="space-y-8">
      
      {/* 👑 MAIN USAGE - Single Import Ready-to-Use Player */}
      <section>
        <h2>Primary Usage - PlayerContainer</h2>
        <PlayerContainer 
          src="https://example.com/video.mp4"
          poster="https://example.com/poster.jpg"
          aspectRatio="16:9"
          autoPlay={false}
          muted={false}
        />
      </section>

      {/* 🎬 Advanced Streaming Support */}
      <section>
        <h2>HLS/DASH Streaming</h2>
        <PlayerContainer 
          src="https://example.com/stream.m3u8"  // HLS stream
          aspectRatio="16:9"
          onStateChange={(state) => {
            console.log('Player state:', state);
          }}
        />
      </section>

      {/* 📱 Mobile Optimized */}
      <section>
        <h2>Mobile Optimized Player</h2>
        <PlayerContainer 
          src="https://example.com/mobile-video.mp4"
          aspectRatio="9:16"  // Vertical video
          className="max-w-sm mx-auto"
        />
      </section>

      {/* ⚙️ Custom Configuration */}
      <section>
        <h2>With Custom Configuration</h2>
        <VideoPlayer.PlayerConfigProvider defaultConfig={VideoPlayer.PlayerPresets.youtube}>
          <VideoPlayer.ConfigurableVideoPlayer 
            src="https://example.com/video.mp4"
            aspectRatio="16:9"
          />
        </VideoPlayer.PlayerConfigProvider>
      </section>

      {/* 🎮 Demo Mode */}
      <section>
        <h2>Interactive Demo</h2>
        <VideoPlayer.VideoPlayerDemo />
      </section>

    </div>
  );
}

// 🪝 Custom Hook Usage Example
function CustomPlayerComponent() {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const { state, controls } = useVideoPlayer(videoRef, {
    autoPlay: false,
    muted: false,
    src: 'https://example.com/video.mp4'
  });

  return (
    <div className="relative">
      <video ref={videoRef} className="w-full" />
      <div className="absolute bottom-4 left-4 text-white">
        {state.isPlaying ? 'Playing' : 'Paused'} - {state.currentTime.toFixed(1)}s
      </div>
      <button 
        onClick={() => state.isPlaying ? controls.pause() : controls.play()}
        className="absolute bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        {state.isPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  );
}

// 🎯 Different Import Patterns Demonstration
export {
  // Pattern 1: Re-export for easy access
  PlayerContainer,
  
  // Pattern 2: Namespace for organized imports
  VideoPlayer,
  
  // Pattern 3: Specific feature imports
  useVideoPlayer,
};
