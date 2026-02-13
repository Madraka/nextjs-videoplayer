import React from 'react';
import { VideoPlayerState } from '@/hooks/use-video-player';

interface PlayerStatsProps {
  state: VideoPlayerState;
}

export const PlayerStats: React.FC<PlayerStatsProps> = ({ state }) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 space-y-2">
      <h3 className="font-semibold text-gray-900 dark:text-white">Player Statistics</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-600 dark:text-gray-400">Current Time:</span>
          <span className="ml-2 font-mono">{state.currentTime.toFixed(2)}s</span>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-400">Duration:</span>
          <span className="ml-2 font-mono">{state.duration.toFixed(2)}s</span>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-400">Volume:</span>
          <span className="ml-2 font-mono">{Math.round(state.volume * 100)}%</span>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-400">Quality:</span>
          <span className="ml-2 font-mono">{state.quality}</span>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-400">Buffered:</span>
          <span className="ml-2 font-mono">{Math.round(state.buffered * 100)}%</span>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-400">Playback Rate:</span>
          <span className="ml-2 font-mono">{state.playbackRate}x</span>
        </div>
      </div>
    </div>
  );
};
