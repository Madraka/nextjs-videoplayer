'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// New component architecture imports
import { PlayerContainer } from '@/components/player/player-container';
import { VideoElement } from '@/components/player/video-element';
import { ControlBar } from '@/components/controls/control-bar';
import { PlayButton } from '@/components/controls/play-button';
import { ProgressBar } from '@/components/controls/progress-bar';
import { VolumeControl } from '@/components/controls/volume-control';
import { TimeDisplay } from '@/components/controls/time-display';
import { FullscreenButton } from '@/components/controls/fullscreen-button';
import { PictureInPicture } from '@/components/controls/picture-in-picture';
import { PlaybackRate } from '@/components/controls/playback-rate';
import { QualitySelector } from '@/components/controls/quality-selector';
import { MobileControls } from '@/components/controls/mobile-controls';
import { KeyboardHandler } from '@/components/controls/keyboard-handler';

import { PlayerConfigProvider } from '@/contexts/player-config-context';
import { PlayerPresets } from '@/types/player-config';
import { useVideoPlayer } from '@/hooks/use-video-player';
import { cn } from '@/lib/utils';

const videoSources = [
  {
    id: 'bigbuck',
    name: 'Big Buck Bunny',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    poster: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    aspectRatio: '16/9'
  },
  {
    id: 'vertical',
    name: 'Vertical Video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    aspectRatio: '9/16'
  },
  {
    id: 'square',
    name: 'Square Video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    aspectRatio: '1/1'
  }
];

export default function AdvancedDemoPage() {
  const [selectedDemo, setSelectedDemo] = useState('player-container');
  const [selectedVideo, setSelectedVideo] = useState(videoSources[0]);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Video player state
  const { state, controls, qualityLevels } = useVideoPlayer(videoRef, {
    autoPlay: false,
    muted: false,
    volume: 0.8,
  });

  return (
    <PlayerConfigProvider defaultConfig={PlayerPresets.youtube}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Advanced Component Demo
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Showcase of the new video player component architecture
            </p>
          </div>

          <Tabs value={selectedDemo} onValueChange={setSelectedDemo} className="space-y-8">
            <TabsList className="grid grid-cols-4 gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg">
              <TabsTrigger value="player-container">Player Container</TabsTrigger>
              <TabsTrigger value="individual-controls">Individual Controls</TabsTrigger>
              <TabsTrigger value="custom-layout">Custom Layout</TabsTrigger>
              <TabsTrigger value="mobile-demo">Mobile Demo</TabsTrigger>
            </TabsList>

            {/* Player Container Demo */}
            <TabsContent value="player-container" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>PlayerContainer Component</CardTitle>
                  <p className="text-gray-600 dark:text-gray-300">
                    All-in-one player container with built-in controls and state management
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Video Selection */}
                  <div className="flex gap-3">
                    {videoSources.map((video) => (
                      <Button
                        key={video.id}
                        variant={selectedVideo.id === video.id ? "default" : "outline"}
                        onClick={() => setSelectedVideo(video)}
                        className="flex-1"
                      >
                        {video.name}
                        <Badge variant="secondary" className="ml-2">
                          {video.aspectRatio}
                        </Badge>
                      </Button>
                    ))}
                  </div>

                  {/* Player Container Demo */}
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">PlayerContainer</h3>
                      <div className="bg-black rounded-lg overflow-hidden">
                        <PlayerContainer
                          src={selectedVideo.url}
                          poster={selectedVideo.poster}
                          aspectRatio={
                            selectedVideo.aspectRatio === '16/9' ? '16:9' :
                            selectedVideo.aspectRatio === '9/16' ? 'auto' :
                            selectedVideo.aspectRatio === '1/1' ? '1:1' :
                            'auto'
                          }
                          autoPlay={false}
                          muted={false}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Player Stats</h3>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-2">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Status:</span>
                            <span className="ml-2 font-medium">
                              {state.isLoading ? 'Loading' : 
                               state.isPlaying ? 'Playing' : 'Paused'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                            <span className="ml-2 font-mono">{state.duration.toFixed(1)}s</span>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Current:</span>
                            <span className="ml-2 font-mono">{state.currentTime.toFixed(1)}s</span>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Volume:</span>
                            <span className="ml-2">{Math.round(state.volume * 100)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Individual Controls Demo */}
            <TabsContent value="individual-controls" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Individual Control Components</CardTitle>
                  <p className="text-gray-600 dark:text-gray-300">
                    Granular control components for custom player layouts
                  </p>
                </CardHeader>
                <CardContent className="space-y-8">
                  
                  {/* Video Element */}
                  <div className="bg-black rounded-lg overflow-hidden max-w-2xl mx-auto">
                    <VideoElement
                      ref={videoRef}
                      src={selectedVideo.url}
                      poster={selectedVideo.poster}
                      autoPlay={false}
                      muted={false}
                      loop={false}
                      playsInline={true}
                    />
                  </div>

                  {/* Individual Controls Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* Play Button */}
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Play Button</h4>
                      <div className="flex justify-center">
                        <PlayButton
                          isPlaying={state.isPlaying}
                          isLoading={state.isLoading}
                          onToggle={() => {
                            if (state.isPlaying) {
                              controls.pause();
                            } else {
                              controls.play();
                            }
                          }}
                          size="lg"
                        />
                      </div>
                    </Card>

                    {/* Volume Control */}
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Volume Control</h4>
                      <VolumeControl
                        volume={state.volume}
                        isMuted={state.isMuted}
                        onVolumeChange={(volume) => controls.setVolume(volume)}
                        onMuteToggle={() => controls.toggleMute()}
                        orientation="vertical"
                        className="h-24"
                      />
                    </Card>

                    {/* Time Display */}
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Time Display</h4>
                      <div className="space-y-2">
                        <TimeDisplay
                          currentTime={state.currentTime}
                          duration={state.duration}
                          compact={false}
                        />
                        <TimeDisplay
                          currentTime={state.currentTime}
                          duration={state.duration}
                          compact={true}
                        />
                      </div>
                    </Card>

                    {/* Playback Rate */}
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Playback Rate</h4>
                      <PlaybackRate
                        rate={state.playbackRate}
                        onRateChange={(rate) => controls.setPlaybackRate(rate)}
                        showLabel={true}
                      />
                    </Card>

                    {/* Quality Selector */}
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Quality Selector</h4>
                      <QualitySelector
                        levels={qualityLevels}
                        currentLevel={state.quality}
                        onQualityChange={(quality) => controls.setQuality(quality)}
                      />
                    </Card>

                    {/* Fullscreen & PiP */}
                    <Card className="p-4">
                      <h4 className="font-medium mb-3">Fullscreen & PiP</h4>
                      <div className="flex gap-3 justify-center">
                        <FullscreenButton
                          isFullscreen={state.isFullscreen}
                          onToggle={() => controls.toggleFullscreen()}
                        />
                        <PictureInPicture
                          isPiP={state.isPictureInPicture}
                          onToggle={() => controls.togglePictureInPicture()}
                        />
                      </div>
                    </Card>
                  </div>

                  {/* Progress Bar */}
                  <Card className="p-4">
                    <h4 className="font-medium mb-3">Progress Bar</h4>
                    <ProgressBar
                      currentTime={state.currentTime}
                      duration={state.duration}
                      buffered={state.buffered}
                      onSeek={(time) => controls.seek(time)}
                      className="h-2"
                    />
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Custom Layout Demo */}
            <TabsContent value="custom-layout" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Custom Control Layout</CardTitle>
                  <p className="text-gray-600 dark:text-gray-300">
                    Build custom player layouts using individual components
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="max-w-4xl mx-auto bg-black rounded-lg overflow-hidden relative">
                    
                    {/* Video */}
                    <VideoElement
                      ref={videoRef}
                      src={selectedVideo.url}
                      poster={selectedVideo.poster}
                      autoPlay={false}
                      muted={false}
                    />

                    {/* Custom Control Bar */}
                    <ControlBar className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                      
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <ProgressBar
                          currentTime={state.currentTime}
                          duration={state.duration}
                          buffered={state.buffered}
                          onSeek={(time) => controls.seek(time)}
                          className="h-1"
                        />
                      </div>

                      {/* Controls Row */}
                      <div className="flex items-center justify-between">
                        
                        {/* Left Group */}
                        <div className="flex items-center gap-4">
                          <PlayButton
                            isPlaying={state.isPlaying}
                            isLoading={state.isLoading}
                            onToggle={() => {
                              if (state.isPlaying) {
                                controls.pause();
                              } else {
                                controls.play();
                              }
                            }}
                            size="md"
                          />
                          <VolumeControl
                            volume={state.volume}
                            isMuted={state.isMuted}
                            onVolumeChange={(volume) => controls.setVolume(volume)}
                            onMuteToggle={() => controls.toggleMute()}
                            orientation="horizontal"
                            showVolumeSlider={true}
                          />
                          <TimeDisplay
                            currentTime={state.currentTime}
                            duration={state.duration}
                            compact={false}
                            className="text-white"
                          />
                        </div>

                        {/* Right Group */}
                        <div className="flex items-center gap-3">
                          <PlaybackRate
                            rate={state.playbackRate}
                            onRateChange={(rate) => controls.setPlaybackRate(rate)}
                            showLabel={false}
                          />
                          <QualitySelector
                            levels={qualityLevels}
                            currentLevel={state.quality}
                            onQualityChange={(quality) => controls.setQuality(quality)}
                          />
                          <PictureInPicture
                            isPiP={state.isPictureInPicture}
                            onToggle={() => controls.togglePictureInPicture()}
                          />
                          <FullscreenButton
                            isFullscreen={state.isFullscreen}
                            onToggle={() => controls.toggleFullscreen()}
                          />
                        </div>
                      </div>
                    </ControlBar>

                    {/* Keyboard Handler */}
                    <KeyboardHandler
                      playerState={state}
                      playerControls={controls}
                      enabled={true}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Mobile Demo */}
            <TabsContent value="mobile-demo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mobile Controls</CardTitle>
                  <p className="text-gray-600 dark:text-gray-300">
                    Touch-optimized controls for mobile devices
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="max-w-sm mx-auto bg-black rounded-lg overflow-hidden relative">
                    
                    {/* Video */}
                    <VideoElement
                      ref={videoRef}
                      src={selectedVideo.url}
                      poster={selectedVideo.poster}
                      autoPlay={false}
                      muted={false}
                    />

                    {/* Mobile Controls */}
                    <MobileControls
                      state={state}
                      controls={controls}
                      qualityLevels={qualityLevels}
                      className="absolute inset-0"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PlayerConfigProvider>
  );
}
