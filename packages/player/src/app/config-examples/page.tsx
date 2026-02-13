'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConfigurableVideoPlayer } from '@/components/player/configurable-video-player';
import { PlayerConfigPanel } from '@/components/config/player-config-panel';
import { PlayerConfigProvider } from '@/contexts/player-config-context';
import { PlayerPresets, type PlayerConfiguration } from '@/types/player-config';
import { Code, Play, Settings } from 'lucide-react';

const videoSources = [
  {
    id: 'demo',
    name: 'Demo Video (MP4)',
    src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    poster: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    description: 'High quality MP4 demo video',
  },
  {
    id: 'hls',
    name: 'HLS Stream',
    src: 'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8',
    description: 'Adaptive HLS streaming example',
  },
];

interface ConfigExampleProps {
  title: string;
  description: string;
  config: PlayerConfiguration;
  code: string;
  icon: React.ReactNode;
}

const ConfigExample: React.FC<ConfigExampleProps> = ({ title, description, config, code, icon }) => {
  const [showCode, setShowCode] = useState(false);
  const currentVideo = videoSources[0];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Video Player */}
        <div className="aspect-video w-full">
          <ConfigurableVideoPlayer
            src={currentVideo.src}
            poster={currentVideo.poster}
            configOverride={config}
            className="rounded-lg overflow-hidden"
          />
        </div>

        {/* Code Toggle */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCode(!showCode)}
          >
            <Code className="h-4 w-4 mr-2" />
            {showCode ? 'Hide Code' : 'Show Code'}
          </Button>
        </div>

        {/* Code Display */}
        {showCode && (
          <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-sm overflow-x-auto">
            <code>{code}</code>
          </pre>
        )}
      </CardContent>
    </Card>
  );
};

export default function ConfigurationExamplesPage() {
  const examples = [
    {
      title: 'Default Style',
      description: 'Full-featured player with the standard control set',
      icon: <Play className="h-5 w-5" />,
      config: PlayerPresets.default,
      code: `import { ConfigurableVideoPlayer } from '@/components/player/configurable-video-player';
import { PlayerPresets } from '@/types/player-config';

// Default player with full controls
<ConfigurableVideoPlayer
  src="your-video.mp4"
  configOverride={PlayerPresets.default}
/>`,
    },
    {
      title: 'Custom Configuration',
      description: 'Custom behavior and specific controls',
      icon: <Settings className="h-5 w-5" />,
      config: {
        controls: {
          visibility: {
            playPause: true,
            progress: true,
            volume: true,
            fullscreen: true,
            theaterMode: false,
            pictureInPicture: false,
            quality: false,
            playbackRate: false,
          },
        },
        auto: {
          autoHideControls: false,
        },
      },
      code: `// Custom behavior-focused player
<ConfigurableVideoPlayer
  src="your-video.mp4"
  configOverride={{
    controls: {
      visibility: {
        playPause: true,
        progress: true,
        volume: true,
        fullscreen: true,
        // Hide advanced controls
        theaterMode: false,
        pictureInPicture: false,
        quality: false,
        playbackRate: false,
      },
    },
    auto: {
      autoHideControls: false, // Always show controls
    },
  }}
/>`,
    },
  ];

  return (
    <PlayerConfigProvider>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Video Player Configuration Examples</h1>
          <p className="text-lg text-muted-foreground">
            Learn how to customize the video player for different use cases. Each example shows 
            a different configuration preset and the corresponding code.
          </p>
        </div>

        <Tabs defaultValue="examples" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="examples">Configuration Examples</TabsTrigger>
            <TabsTrigger value="config-panel">Live Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="examples" className="space-y-8">
            <div className="grid gap-8">
              {examples.map((example, index) => (
                <ConfigExample key={index} {...example} />
              ))}
            </div>

            {/* Usage Documentation */}
            <Card className="mt-12">
              <CardHeader>
                <CardTitle>How to Use Configuration</CardTitle>
                <CardDescription>
                  Step-by-step guide to implement configurable video players in your Next.js app
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">1. Wrap your app with PlayerConfigProvider</h3>
                  <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{`// app/layout.tsx or your root component
import { PlayerConfigProvider } from '@/contexts/player-config-context';
import { PlayerPresets } from '@/types/player-config';

export default function RootLayout({ children }) {
  return (
    <PlayerConfigProvider defaultConfig={PlayerPresets.default}>
      {children}
    </PlayerConfigProvider>
  );
}`}</code>
                  </pre>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">2. Use ConfigurableVideoPlayer component</h3>
                  <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{`// In your component
import { ConfigurableVideoPlayer } from '@/components/player/configurable-video-player';

function MyVideoComponent() {
  return (
    <ConfigurableVideoPlayer
      src="https://example.com/video.mp4"
      poster="https://example.com/poster.jpg"
      // Optional: Override global config for this instance
      configOverride={{
        controls: {
          visibility: {
            playbackRate: false, // Hide playback rate for this video
          },
        },
      }}
    />
  );
}`}</code>
                  </pre>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">3. Available Configuration Options</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      'Control visibility (show/hide any button)',
                      'Custom themes and colors',
                      'Keyboard shortcuts configuration',
                      'Touch gesture settings',
                      'Auto-behaviors (autoplay, auto-hide)',
                      'Responsive breakpoints',
                      'Performance settings',
                      'Analytics tracking',
                      'Advanced features toggle',
                    ].map((feature, index) => (
                      <Badge key={index} variant="secondary" className="p-2">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="config-panel">
            <PlayerConfigPanel />
            
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>
                  The video below reflects your current configuration settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ConfigurableVideoPlayer
                  src={videoSources[0].src}
                  poster={videoSources[0].poster}
                  className="aspect-video w-full rounded-lg overflow-hidden"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PlayerConfigProvider>
  );
}
