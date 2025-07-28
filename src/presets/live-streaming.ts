/**
 * Live Streaming Player Preset
 * Optimized for live video content
 */

import type { PlayerConfig } from '../types/player';
import { DEFAULT_PLAYER_CONFIG } from '../constants/player-defaults';

export const LIVE_STREAMING_PRESET: PlayerConfig = {
  ...DEFAULT_PLAYER_CONFIG,
  
  // Live streaming controls
  controls: true,
  showProgressBar: false, // No seeking in live
  showVolumeControl: true,
  showFullscreenButton: true,
  showPlaybackRate: false, // Not applicable for live
  showQualitySelector: true, // Important for live
  
  // Live streaming quality
  defaultQuality: 'auto',
  adaptiveStreaming: true,
  
  // Mobile live experience
  enableGestures: true,
  showMobileControls: true,
  
  // Basic accessibility for live
  enableKeyboardShortcuts: true,
  enableScreenReader: true,
  announcePlayState: true,
  
  // Live analytics
  enableAnalytics: true
};

/**
 * Live streaming theme
 */
export const LIVE_STREAMING_THEME = {
  primaryColor: '#ff0000',
  backgroundColor: '#000000',
  controlsColor: '#ffffff',
  accentColor: '#ff0000',
  progressColor: '#ff0000', // Red for live indicator
  bufferColor: '#666666',
  liveIndicator: true,
  streamingBadge: true
} as const;

/**
 * Live streaming behavior
 */
export const LIVE_STREAMING_BEHAVIOR = {
  // Live-specific features
  liveMode: true,
  seekingDisabled: true,
  autoReconnect: true,
  lowLatencyMode: true,
  
  // Buffer management for live
  liveBuffer: {
    target: 3, // 3 seconds
    max: 10,   // 10 seconds max
    aggressive: true
  },
  
  // Quality adaptation for live
  fastSwitching: true,
  liveEdgeSeek: true,
  
  // Error handling
  connectionRetries: 5,
  reconnectDelay: 2000,
  fallbackStreams: true,
  
  // Live indicators
  showLiveBadge: true,
  showViewerCount: true,
  showLatency: false, // Usually hidden from users
  
  // Chat integration
  chatEnabled: false, // Configurable
  chatPosition: 'right'
} as const;

/**
 * Live streaming keyboard shortcuts
 */
export const LIVE_STREAMING_SHORTCUTS = {
  spacebar: 'playPause',
  m: 'toggleMute',
  f: 'toggleFullscreen',
  arrowUp: 'volumeUp',
  arrowDown: 'volumeDown',
  l: 'goToLiveEdge', // Live-specific
  r: 'reconnect',    // Live-specific
  c: 'toggleChat'    // Live-specific
} as const;

/**
 * Live streaming quality levels
 */
export const LIVE_QUALITY_LEVELS = {
  auto: {
    label: 'Auto',
    adaptive: true
  },
  source: {
    label: 'Source',
    bitrate: 'max'
  },
  '1080p60': {
    label: '1080p60',
    height: 1080,
    fps: 60
  },
  '1080p': {
    label: '1080p',
    height: 1080,
    fps: 30
  },
  '720p60': {
    label: '720p60',
    height: 720,
    fps: 60
  },
  '720p': {
    label: '720p',
    height: 720,
    fps: 30
  },
  '480p': {
    label: '480p',
    height: 480,
    fps: 30
  },
  '360p': {
    label: '360p',
    height: 360,
    fps: 30
  },
  audio: {
    label: 'Audio Only',
    height: 0,
    videoDisabled: true
  }
} as const;
