/**
 * Mobile-Optimized Player Preset
 * Optimized for mobile devices and touch interfaces
 */

import type { PlayerConfig } from '../types/player';
import { DEFAULT_PLAYER_CONFIG } from '../constants/player-defaults';

export const MOBILE_OPTIMIZED_PRESET: PlayerConfig = {
  ...DEFAULT_PLAYER_CONFIG,
  
  // Mobile-optimized controls
  controls: true,
  showProgressBar: true,
  showVolumeControl: false, // Usually controlled by device
  showFullscreenButton: true,
  showPlaybackRate: false, // Less relevant on mobile
  showQualitySelector: true, // Important for data usage
  
  // Mobile quality defaults
  defaultQuality: '720p', // Balance quality vs data
  adaptiveStreaming: true,
  
  // Enhanced mobile features
  enableGestures: true,
  showMobileControls: true,
  
  // Touch accessibility
  enableKeyboardShortcuts: false, // Not relevant
  enableScreenReader: true,
  announcePlayState: true,
  
  // Data-conscious analytics
  enableAnalytics: true
};

/**
 * Mobile-optimized theme
 */
export const MOBILE_THEME = {
  primaryColor: '#007AFF', // iOS blue
  backgroundColor: '#000000',
  controlsColor: '#ffffff',
  accentColor: '#007AFF',
  progressColor: '#007AFF',
  bufferColor: '#666666',
  largerTouchTargets: true,
  mobileOptimized: true
} as const;

/**
 * Mobile gesture configuration
 */
export const MOBILE_GESTURES = {
  // Touch gestures
  tapToToggleControls: true,
  doubleTapToSeek: true,
  swipeToSeek: true,
  pinchToZoom: false, // Can interfere with page zoom
  
  // Swipe gestures
  swipeUpForVolume: true,
  swipeDownForBrightness: false, // OS handles this
  leftRightSwipeSeek: true,
  
  // Long press actions
  longPressForOptions: true,
  
  // Gesture sensitivity
  seekSensitivity: 'medium',
  volumeSensitivity: 'high'
} as const;

/**
 * Mobile-specific behavior
 */
export const MOBILE_BEHAVIOR = {
  // Autoplay policies
  respectAutoplayPolicy: true,
  requireUserGesture: true,
  
  // Performance optimizations
  preloadStrategy: 'metadata', // Save bandwidth
  aggressiveBufferManagement: true,
  
  // Battery optimization
  pauseOnVisibilityChange: true,
  reduceAnimations: true,
  
  // Network awareness
  adaptToConnectionType: true,
  dataUsageWarnings: true,
  
  // Screen orientation
  allowRotationLock: true,
  autoRotateToLandscape: false // User preference
} as const;
