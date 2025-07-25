import React from 'react';
import { Check } from 'lucide-react';

interface Feature {
  name: string;
  description: string;
  enabled: boolean;
}

const features: Feature[] = [
  { name: 'HLS Streaming', description: 'HTTP Live Streaming support', enabled: true },
  { name: 'DASH Streaming', description: 'Dynamic Adaptive Streaming', enabled: true },
  { name: 'Mobile Gestures', description: 'Touch-optimized controls', enabled: true },
  { name: 'Thumbnail Preview', description: 'Timeline hover previews', enabled: true },
  { name: 'Quality Selection', description: 'Manual quality control', enabled: true },
  { name: 'Fullscreen', description: 'Full viewport playback', enabled: true },
  { name: 'Picture-in-Picture', description: 'PiP mode support', enabled: true },
  { name: 'Keyboard Shortcuts', description: 'Hotkey navigation', enabled: true },
  { name: 'Analytics', description: 'Playback tracking', enabled: true },
  { name: 'Auto-hide Controls', description: 'Clean viewing experience', enabled: true },
];

export const FeatureList: React.FC = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Features</h3>
      <div className="grid gap-2">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
              feature.enabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
            }`}>
              {feature.enabled && <Check className="w-3 h-3" />}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {feature.name}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {feature.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
