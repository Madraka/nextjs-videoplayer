/**
 * Minimal Player Preset
 * Clean, distraction-free video experience
 */

import type { PlayerConfig } from '../types/player';
import { DEFAULT_PLAYER_CONFIG } from '../constants/player-defaults';

export const MINIMAL_PLAYER_PRESET: PlayerConfig = {
  ...DEFAULT_PLAYER_CONFIG,
  
  // Minimal UI
  controls: true,
  showProgressBar: true,
  showVolumeControl: false, // Hidden by default
  showFullscreenButton: true,
  showPlaybackRate: false,
  showQualitySelector: false,
  
  // Simple quality handling
  defaultQuality: 'auto',
  adaptiveStreaming: true,
  
  // Basic mobile support
  enableGestures: true,
  showMobileControls: true,
  
  // Essential accessibility only
  enableKeyboardShortcuts: true,
  enableScreenReader: false,
  announcePlayState: false,
  
  // No analytics
  enableAnalytics: false
};

/**
 * Minimal theme configuration
 */
export const MINIMAL_THEME = {
  primaryColor: '#ffffff',
  backgroundColor: '#000000',
  controlsColor: '#ffffff',
  accentColor: '#ffffff',
  progressColor: '#ffffff',
  bufferColor: '#666666',
  transparency: 0.8,
  hideWhenIdle: true,
  cleanDesign: true
} as const;

/**
 * Minimal behavior settings
 */
export const MINIMAL_BEHAVIOR = {
  // Quick hide controls
  controlsTimeout: 2000,
  
  // Simple interactions
  clickToPlay: true,
  doubleClickFullscreen: true,
  
  // No extra features
  skipButtons: false,
  chaptersEnabled: false,
  thumbnailPreview: false,
  
  // Clean seeking
  simpleSeeking: true,
  noSeekPreview: true
} as const;

/**
 * Minimal keyboard shortcuts
 */
export const MINIMAL_SHORTCUTS = {
  spacebar: 'playPause',
  f: 'toggleFullscreen',
  m: 'toggleMute',
  arrowLeft: 'seekBackward5',
  arrowRight: 'seekForward5'
} as const;
