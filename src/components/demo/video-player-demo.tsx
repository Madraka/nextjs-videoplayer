'use client';

import React, { useState } from 'react';
import { ConfigurableVideoPlayer } from '@/components/player/configurable-video-player';
import { VideoSourceSelector, type VideoSource } from '@/components/demo/video-source-selector';
import { PlayerStats } from '@/components/demo/player-stats';
import { FeatureList } from '@/components/demo/feature-list';
import { PlayerConfigProvider } from '@/contexts/player-config-context';
import { VideoPlayerState } from '@/hooks/use-video-player';

export const VideoPlayerDemo: React.FC = () => {
  const videoSources: VideoSource[] = [
    {
      id: 'bigbuck',
      name: 'Big Buck Bunny (MP4)',
      url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      format: 'MP4',
      quality: 'HD',
      size: '158MB',
      description: 'High quality demo video',
      features: ['MP4', 'HD Quality'],
      poster: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    },
    {
      id: 'elephant',
      name: 'Elephant Dream (MP4)',
      url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      format: 'MP4',
      quality: 'HD',
      size: '120MB',
      description: 'Animation showcase',
      features: ['MP4', 'Animation'],
      poster: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
    },
    {
      id: 'sintel',
      name: 'Sintel (MP4)',
      url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      format: 'MP4',
      quality: 'HD',
      size: '90MB',
      description: 'Blender Foundation movie',
      features: ['MP4', 'Short Film'],
      poster: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg',
    },
  ];

  const [selectedVideo, setSelectedVideo] = useState(videoSources[0]);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [playerState, setPlayerState] = useState<VideoPlayerState>({
    isPlaying: false,
    isPaused: true,
    isLoading: false,
    isMuted: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    buffered: 0,
    quality: 'auto',
    playbackRate: 1,
    isFullscreen: false,
    isPictureInPicture: false,
    isTheaterMode: false,
    error: null,
    // Analytics data
    playCount: 0,
    totalWatchTime: 0,
    bufferingTime: 0,
    averageBitrate: 0,
    qualityChanges: 0,
  });

  return (
    <PlayerConfigProvider>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Video Player */}
        <div className="lg:col-span-2">
          <VideoSourceSelector
            sources={videoSources}
            selectedSource={selectedVideo}
            onSourceChange={setSelectedVideo}
            className="mb-6"
          />
          
          <ConfigurableVideoPlayer
            src={selectedVideo.url}
            poster={selectedVideo.poster}
            autoPlay={false}
            muted={false}
            thumbnails={{
              enabled: true,
              spriteSheet: {
                url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
                columns: 4,
                rows: 4,
                thumbnailWidth: 160,
                thumbnailHeight: 90,
                interval: 10
              }
            }}
            onReady={() => setIsPlayerReady(true)}
            onStateChange={setPlayerState}
            className="w-full shadow-2xl"
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <PlayerStats state={playerState} />
          <FeatureList />
        </div>
      </div>
    </PlayerConfigProvider>
  );
};
