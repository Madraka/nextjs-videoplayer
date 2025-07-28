/**
 * Default Player Settings
 * Provides default configuration values for the video player
 */

import type { PlayerConfig } from '../types/player';

/**
 * Default player configuration
 */
export const DEFAULT_PLAYER_CONFIG: PlayerConfig = {
  // Playback settings
  autoPlay: false,
  muted: false,
  loop: false,
  volume: 1.0,
  playbackRate: 1.0,
  preload: 'metadata',
  
  // Quality settings
  defaultQuality: 'auto',
  adaptiveStreaming: true,
  
  // UI settings
  controls: true,
  showProgressBar: true,
  showVolumeControl: true,
  showFullscreenButton: true,
  showPlaybackRate: true,
  showQualitySelector: true,
  
  // Mobile settings
  enableGestures: true,
  showMobileControls: true,
  
  // Accessibility settings
  enableKeyboardShortcuts: true,
  enableScreenReader: true,
  announcePlayState: true,
  
  // Analytics settings
  enableAnalytics: false,
  
  // AI settings
  enableAI: false,
  aiFeatures: {
    autoThumbnails: false,
    autoCaptions: false,
    contentAnalysis: false,
    qualityOptimization: false
  },
  
  // MCP settings
  enableMCP: false
};

/**
 * Default video dimensions
 */
export const DEFAULT_DIMENSIONS = {
  width: 640,
  height: 360,
  aspectRatio: '16:9'
} as const;

/**
 * Default buffer settings
 */
export const DEFAULT_BUFFER_CONFIG = {
  targetDuration: 30, // seconds
  maxBufferLength: 60, // seconds
  bufferToleranceLevel: 0.5, // seconds
  enableStreaming: true
} as const;

/**
 * Default timeout values
 */
export const DEFAULT_TIMEOUTS = {
  loadTimeout: 10000, // 10 seconds
  seekTimeout: 5000,  // 5 seconds
  bufferTimeout: 30000, // 30 seconds
  errorRetryDelay: 2000 // 2 seconds
} as const;

/**
 * Default theme configuration
 */
export const DEFAULT_THEME = {
  primaryColor: '#3b82f6',
  backgroundColor: '#000000',
  controlsColor: '#ffffff',
  accentColor: '#ef4444',
  progressColor: '#3b82f6',
  bufferColor: '#6b7280'
} as const;
