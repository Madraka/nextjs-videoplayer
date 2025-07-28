/**
 * Accessibility-Focused Player Preset
 * Optimized for users with disabilities
 */

import type { PlayerConfig } from '../types/player';
import { DEFAULT_PLAYER_CONFIG } from '../constants/player-defaults';

export const ACCESSIBILITY_FOCUSED_PRESET: PlayerConfig = {
  ...DEFAULT_PLAYER_CONFIG,
  
  // Full accessibility controls
  controls: true,
  showProgressBar: true,
  showVolumeControl: true,
  showFullscreenButton: true,
  showPlaybackRate: true, // Important for cognitive accessibility
  showQualitySelector: true,
  
  // Quality for accessibility
  defaultQuality: 'auto',
  adaptiveStreaming: true,
  
  // Gesture support with alternatives
  enableGestures: true,
  showMobileControls: true,
  
  // Full keyboard and screen reader support
  enableKeyboardShortcuts: true,
  enableScreenReader: true,
  announcePlayState: true,
  
  // Analytics for accessibility insights
  enableAnalytics: true
};

/**
 * Accessibility-focused theme
 */
export const ACCESSIBILITY_THEME = {
  primaryColor: '#0066cc',
  backgroundColor: '#000000',
  controlsColor: '#ffffff',
  accentColor: '#ffff00', // High contrast yellow
  progressColor: '#0066cc',
  bufferColor: '#666666',
  highContrast: true,
  focusIndicators: true,
  largeText: true
} as const;

/**
 * Accessibility features configuration
 */
export const ACCESSIBILITY_FEATURES = {
  // Visual accessibility
  highContrastMode: true,
  reducedMotion: true,
  largerClickTargets: true,
  customColorSchemes: true,
  
  // Audio accessibility
  audioDescriptions: true,
  signLanguageSupport: true,
  captionsAlwaysVisible: true,
  customCaptionStyling: true,
  
  // Cognitive accessibility
  pauseOnFocusLoss: true,
  noAutoplay: true,
  simplifiedControls: false, // Keep full controls
  clearLabeling: true,
  
  // Motor accessibility
  stickyHover: true,
  longPressAlternatives: true,
  dragAlternatives: true,
  voiceControl: true,
  
  // Screen reader enhancements
  detailedAnnouncements: true,
  structuredNavigation: true,
  skipToContent: true,
  timeAnnouncements: true
} as const;

/**
 * Enhanced keyboard shortcuts for accessibility
 */
export const ACCESSIBILITY_SHORTCUTS = {
  // Standard controls
  spacebar: 'playPause',
  k: 'playPause',
  arrowLeft: 'seekBackward5',
  arrowRight: 'seekForward5',
  arrowUp: 'volumeUp',
  arrowDown: 'volumeDown',
  m: 'toggleMute',
  f: 'toggleFullscreen',
  
  // Accessibility-specific shortcuts
  c: 'toggleCaptions',
  d: 'toggleAudioDescription',
  h: 'showKeyboardHelp',
  r: 'resetToDefaults',
  tab: 'focusNextControl',
  shiftTab: 'focusPreviousControl',
  enter: 'activateControl',
  escape: 'exitOrClose',
  
  // Playback rate controls (important for cognitive accessibility)
  minus: 'decreasePlaybackRate',
  plus: 'increasePlaybackRate',
  equal: 'resetPlaybackRate',
  
  // Navigation shortcuts
  home: 'seekToBeginning',
  end: 'seekToEnd',
  pageUp: 'seekForward60',
  pageDown: 'seekBackward60'
} as const;

/**
 * Screen reader announcements configuration
 */
export const SCREEN_READER_CONFIG = {
  // Announcement frequency
  timeUpdateFrequency: 'every10seconds',
  bufferingAnnouncements: true,
  errorAnnouncements: true,
  qualityChangeAnnouncements: true,
  
  // Announcement content
  includeTimeRemaining: true,
  includeBufferStatus: true,
  includePlaybackRate: true,
  includeVolumeLevel: true,
  
  // Politeness levels
  playStateChanges: 'assertive',
  timeUpdates: 'polite',
  errors: 'assertive',
  generalInfo: 'polite'
} as const;
