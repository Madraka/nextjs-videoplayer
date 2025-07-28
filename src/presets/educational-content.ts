/**
 * Educational Content Player Preset
 * Optimized for learning and educational videos
 */

import type { PlayerConfig } from '../types/player';
import { DEFAULT_PLAYER_CONFIG } from '../constants/player-defaults';

export const EDUCATIONAL_CONTENT_PRESET: PlayerConfig = {
  ...DEFAULT_PLAYER_CONFIG,
  
  // Educational-focused controls
  controls: true,
  showProgressBar: true,
  showVolumeControl: true,
  showFullscreenButton: true,
  showPlaybackRate: true, // Very important for education
  showQualitySelector: true,
  
  // Educational quality settings
  defaultQuality: 'auto',
  adaptiveStreaming: true,
  
  // Mobile learning support
  enableGestures: true,
  showMobileControls: true,
  
  // Enhanced accessibility for learning
  enableKeyboardShortcuts: true,
  enableScreenReader: true,
  announcePlayState: true,
  
  // Analytics for learning insights
  enableAnalytics: true
};

/**
 * Educational theme configuration
 */
export const EDUCATIONAL_THEME = {
  primaryColor: '#4285f4', // Education blue
  backgroundColor: '#000000',
  controlsColor: '#ffffff',
  accentColor: '#34a853', // Success green
  progressColor: '#4285f4',
  bufferColor: '#666666',
  learningFocused: true,
  academicDesign: true
} as const;

/**
 * Educational features configuration
 */
export const EDUCATIONAL_FEATURES = {
  // Learning-specific features
  chaptersEnabled: true,
  noteTaking: true,
  bookmarks: true,
  playbackHistory: true,
  
  // Speed controls for learning
  playbackRates: [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0],
  defaultPlaybackRate: 1.0,
  rememberPlaybackRate: true,
  
  // Seeking features
  preciseSeekingEnabled: true,
  thumbnailPreview: true,
  frameByFrameStepping: true,
  
  // Subtitle features for learning
  subtitlesEnabled: true,
  multiLanguageSupport: true,
  highlightCurrentSubtitle: true,
  subtitleSearch: true,
  
  // Progress tracking
  watchProgress: true,
  resumePlayback: true,
  completionTracking: true,
  
  // Quiz integration
  quizPoints: true,
  interactiveElements: true,
  knowledgeChecks: true
} as const;

/**
 * Educational keyboard shortcuts
 */
export const EDUCATIONAL_SHORTCUTS = {
  // Standard playback
  spacebar: 'playPause',
  k: 'playPause',
  
  // Learning-specific seeking
  arrowLeft: 'seekBackward5',
  arrowRight: 'seekForward5',
  j: 'seekBackward10',
  l: 'seekForward10',
  comma: 'frameBackward',
  period: 'frameForward',
  
  // Speed controls (important for education)
  shiftComma: 'decreaseSpeed',
  shiftPeriod: 'increaseSpeed',
  r: 'resetSpeed',
  
  // Volume
  arrowUp: 'volumeUp',
  arrowDown: 'volumeDown',
  m: 'toggleMute',
  
  // Display
  f: 'toggleFullscreen',
  c: 'toggleCaptions',
  
  // Learning features
  b: 'addBookmark',
  n: 'takeNote',
  h: 'showChapters',
  s: 'searchSubtitles',
  
  // Navigation
  home: 'seekToBeginning',
  end: 'seekToEnd',
  digit1to9: 'seekToPercent'
} as const;

/**
 * Educational analytics configuration
 */
export const EDUCATIONAL_ANALYTICS = {
  // Learning metrics
  trackWatchTime: true,
  trackCompletionRate: true,
  trackSeekingBehavior: true,
  trackSpeedChanges: true,
  trackRewatching: true,
  
  // Engagement metrics
  trackPauseDuration: true,
  trackActiveTime: true,
  trackNotesTaken: true,
  trackBookmarks: true,
  
  // Learning insights
  trackDifficultSections: true,
  trackSkippedSections: true,
  trackReplayedSections: true,
  
  // Quiz and interaction tracking
  trackQuizResults: true,
  trackInteractions: true,
  trackKnowledgeChecks: true
} as const;

/**
 * Note-taking configuration
 */
export const NOTE_TAKING_CONFIG = {
  enabled: true,
  timestampedNotes: true,
  noteCategories: ['question', 'important', 'summary', 'todo'],
  exportFormats: ['text', 'markdown', 'pdf'],
  syncWithBookmarks: true,
  searchableNotes: true,
  shareNotes: false // Privacy for educational content
} as const;
