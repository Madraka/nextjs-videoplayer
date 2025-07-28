/**
 * Netflix-Style Player Preset
 * Replicates Netflix player experience
 */

import type { PlayerConfig } from '../types/player';
import { DEFAULT_PLAYER_CONFIG } from '../constants/player-defaults';

export const NETFLIX_STYLE_PRESET: PlayerConfig = {
  ...DEFAULT_PLAYER_CONFIG,
  
  // Netflix-like settings
  controls: true,
  showProgressBar: true,
  showVolumeControl: true,
  showFullscreenButton: true,
  showPlaybackRate: false, // Netflix doesn't show playback rate by default
  showQualitySelector: false, // Hidden in main UI
  
  // Auto quality with Netflix-style ABR
  defaultQuality: 'auto',
  adaptiveStreaming: true,
  
  // Mobile experience
  enableGestures: true,
  showMobileControls: true,
  
  // Accessibility
  enableKeyboardShortcuts: true,
  enableScreenReader: true,
  announcePlayState: false, // Less intrusive
  
  // Analytics for viewing data
  enableAnalytics: true
};

/**
 * Netflix-style theme configuration
 */
export const NETFLIX_THEME = {
  primaryColor: '#e50914',
  backgroundColor: '#000000',
  controlsColor: '#ffffff',
  accentColor: '#e50914',
  progressColor: '#e50914',
  bufferColor: '#333333',
  gradientOverlay: true,
  minimalistControls: true
} as const;

/**
 * Netflix-style behavior settings
 */
export const NETFLIX_BEHAVIOR = {
  // Auto-hide controls faster
  controlsTimeout: 3000,
  
  // Skip intro/credits features
  skipIntroEnabled: true,
  skipCreditsEnabled: true,
  
  // Continuous play
  autoplayNextEpisode: true,
  
  // Quality adaptation
  aggressiveBuffering: true,
  quickStartEnabled: true,
  
  // Subtitle preferences
  subtitleAutoDisplay: false,
  audioDescriptionSupport: true
} as const;

/**
 * Netflix-style keyboard shortcuts
 */
export const NETFLIX_SHORTCUTS = {
  spacebar: 'playPause',
  arrowLeft: 'seekBackward10',
  arrowRight: 'seekForward10',
  arrowUp: 'volumeUp',
  arrowDown: 'volumeDown',
  m: 'toggleMute',
  f: 'toggleFullscreen',
  esc: 'exitFullscreen'
} as const;
