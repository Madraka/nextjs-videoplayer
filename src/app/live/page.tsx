/**
 * Live streaming page
 * Simple live streaming with essential features
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Live Streaming Demo | NextJS Video Player",
  description: "Live streaming features with NextJS Video Player - HLS streaming, auto-reconnection, DVR support and adaptive quality settings",
  keywords: [
    "live streaming",
    "hls streaming",
    "nextjs video player",
    "real-time video",
    "video streaming demo",
    "live broadcast",
    "adaptive streaming"
  ],
  openGraph: {
    title: "Live Streaming Demo | NextJS Video Player",
    description: "Live streaming features with NextJS Video Player - HLS streaming, auto-reconnection, DVR support",
    type: "website",
    images: [
      {
        url: "/live-demo-og.png",
        width: 1200,
        height: 630,
        alt: "Next.js Video Player Live Streaming Demo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Live Streaming Demo | NextJS Video Player",
    description: "Live streaming features demo page with NextJS Video Player",
    images: ["/live-demo-og.png"],
  },
};

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VideoPlayer } from '@/components/player/video-player';
import { Radio, Users, Wifi } from 'lucide-react';

const liveStreams = [
  {
    id: 'hls-demo',
    name: 'Live Test Stream',
    url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    viewers: 1247,
    isLive: true
  },
  {
    id: 'big-buck',
    name: 'Big Buck Bunny Live',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    viewers: 892,
    isLive: true
  },
  {
    id: 'offline-demo',
    name: 'Offline Stream',
    url: 'https://example.com/offline.m3u8',
    viewers: 0,
    isLive: false
  }
];

export default function LiveStreamPage() {
  const [selectedStream, setSelectedStream] = useState(liveStreams[0]);
  const [viewerCount, setViewerCount] = useState(selectedStream.viewers);

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <h1 className="text-3xl font-bold">Live Streaming</h1>
        </div>
        <p className="text-muted-foreground">
          Real-time video streaming and live broadcast features
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Video Player */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="w-5 h-5 text-red-500" />
                  {selectedStream.name}
                </div>
                <div className="flex items-center gap-2">
                  {selectedStream.isLive ? (
                    <Badge variant="destructive" className="animate-pulse">
                      <Radio className="w-3 h-3 mr-1" />
                      LIVE
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      OFFLINE
                    </Badge>
                  )}
                  {selectedStream.isLive && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {viewerCount.toLocaleString()}
                    </div>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedStream.isLive ? (
                <VideoPlayer
                  src={selectedStream.url}
                  autoPlay={false}
                  muted={true}
                  className="aspect-video w-full rounded-lg overflow-hidden"
                />
              ) : (
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Wifi className="w-12 h-12 text-gray-400 mx-auto" />
                    <p className="text-gray-500">Stream is currently offline</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stream List */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Live Streams</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {liveStreams.map((stream) => (
                <div
                  key={stream.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedStream.id === stream.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedStream(stream)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm">{stream.name}</h3>
                    {stream.isLive ? (
                      <Badge variant="destructive" className="text-xs animate-pulse">
                        LIVE
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        OFFLINE
                      </Badge>
                    )}
                  </div>
                  {stream.isLive && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="w-3 h-3" />
                      {stream.viewers.toLocaleString()} viewers
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Live Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Live Streaming Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Real-time streaming</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Viewer count</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Auto reconnection</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>DVR support</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Adaptive quality</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
