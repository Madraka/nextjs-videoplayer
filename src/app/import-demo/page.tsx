/**
 * Demo page showing all import methods
 */

"use client";

import React from 'react';
import LocalUsageExample from '@/examples/local-usage';

export default function ImportMethodsDemo() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">NextJS Video Player</h1>
          <p className="text-xl text-gray-600">Import Methods & Usage Examples</p>
        </div>

        <LocalUsageExample />
        
        {/* Import Methods Guide */}
        <section className="mt-16 p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6">📦 Import Methods Guide</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Method 1: Main Index */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-green-600">✅ Method 1: Main Index (Recommended)</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`// Single import
import { PlayerContainer } from '@/index';

// Multiple imports
import { 
  PlayerContainer,
  VideoPlayer,
  useVideoPlayer,
  PlayerPresets
} from '@/index';`}
              </pre>
            </div>

            {/* Method 2: Direct Paths */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-blue-600">✅ Method 2: Direct Paths</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`// Component specific
import { PlayerContainer } from '@/components/player';

// Hook specific  
import { useVideoPlayer } from '@/hooks';

// Type specific
import { PlayerPresets } from '@/types/player-config';`}
              </pre>
            </div>

            {/* Method 3: Category Re-exports */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-purple-600">✅ Method 3: Category Re-exports</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`// From components index
import { PlayerContainer } from '@/components';

// From player components
import { VideoElement } from '@/components/player';

// From controls
import { VideoControls } from '@/components/controls';`}
              </pre>
            </div>

            {/* Method 4: Full File Paths */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-orange-600">✅ Method 4: Full File Paths</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`// Explicit file imports
import { PlayerContainer } from 
  '@/components/player/player-container';

import { useVideoPlayer } from 
  '@/hooks/use-video-player';

import { VideoEngine } from 
  '@/core/video-engine';`}
              </pre>
            </div>

          </div>

          {/* Best Practices */}
          <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200">
            <h4 className="text-lg font-semibold text-green-800 mb-3">🎯 Best Practices</h4>
            <ul className="space-y-2 text-green-700">
              <li>• <strong>Use Method 1</strong> for clean, organized imports</li>
              <li>• <strong>PlayerContainer</strong> is the main component for most use cases</li>
              <li>• Import only what you need to optimize bundle size</li>
              <li>• Use TypeScript for better development experience</li>
              <li>• Follow the FILE_SCHEMA_SPECIFICATION for consistent naming</li>
            </ul>
          </div>

          {/* Quick Start */}
          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-lg font-semibold text-blue-800 mb-3">⚡ Quick Start</h4>
            <pre className="bg-blue-100 p-4 rounded-lg text-sm text-blue-800">
{`import { PlayerContainer } from '@/index';

function MyComponent() {
  return (
    <PlayerContainer 
      src="video.mp4"
      aspectRatio="16:9"
      autoPlay={false}
    />
  );
}`}
            </pre>
          </div>

        </section>
      </div>
    </div>
  );
}
