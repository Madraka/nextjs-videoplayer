/**
 * YouTube-Style Player Preset
 * Replicates YouTube player experience
 */

import type { PlayerConfig } from '../types/player';
import { DEFAULT_PLAYER_CONFIG } from '../constants/player-defaults';

export const YOUTUBE_STYLE_PRESET: PlayerConfig = {
  ...DEFAULT_PLAYER_CONFIG,
  
  // YouTube-like settings
  controls: true,
  showProgressBar: true,
  showVolumeControl: true,
  showFullscreenButton: true,
  showPlaybackRate: true,
  showQualitySelector: true,
  
  // Default quality and streaming
  defaultQuality: 'auto',
  adaptiveStreaming: true,
  
  // Mobile experience
  enableGestures: true,
  showMobileControls: true,
  
  // Accessibility
  enableKeyboardShortcuts: true,
  enableScreenReader: true,
  announcePlayState: true,
  
  // Advanced features
  enableAnalytics: true
};

/**
 * YouTube-style theme configuration
 */
export const YOUTUBE_THEME = {
  primaryColor: '#ff0000',
  backgroundColor: '#000000',
  controlsColor: '#ffffff',
  accentColor: '#ff0000',
  progressColor: '#ff0000',
  bufferColor: '#666666'
} as const;

/**
 * YouTube-style keyboard shortcuts
 */
export const YOUTUBE_SHORTCUTS = {
  // Similar to YouTube's shortcuts
  spacebar: 'playPause',
  k: 'playPause',
  j: 'seekBackward10',
  l: 'seekForward10',
  arrowLeft: 'seekBackward5',
  arrowRight: 'seekForward5',
  arrowUp: 'volumeUp',
  arrowDown: 'volumeDown',
  m: 'toggleMute',
  f: 'toggleFullscreen',
  t: 'toggleTheaterMode',
  i: 'toggleMiniPlayer',
  c: 'toggleCaptions'
} as const;
