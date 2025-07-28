/**
 * Analytics Event Definitions
 * Defines all trackable events in the video player
 */

/**
 * Playback events
 */
export const PLAYBACK_EVENTS = {
  VIDEO_STARTED: 'video_started',
  VIDEO_PAUSED: 'video_paused',
  VIDEO_RESUMED: 'video_resumed',
  VIDEO_ENDED: 'video_ended',
  VIDEO_SEEKED: 'video_seeked',
  VIDEO_BUFFERING: 'video_buffering',
  VIDEO_STALLED: 'video_stalled',
  PLAYBACK_RATE_CHANGED: 'playback_rate_changed'
} as const;

/**
 * Quality events
 */
export const QUALITY_EVENTS = {
  QUALITY_CHANGED: 'quality_changed',
  AUTO_QUALITY_ENABLED: 'auto_quality_enabled',
  AUTO_QUALITY_DISABLED: 'auto_quality_disabled',
  BITRATE_CHANGED: 'bitrate_changed'
} as const;

/**
 * User interaction events
 */
export const INTERACTION_EVENTS = {
  CONTROLS_SHOWN: 'controls_shown',
  CONTROLS_HIDDEN: 'controls_hidden',
  FULLSCREEN_ENTERED: 'fullscreen_entered',
  FULLSCREEN_EXITED: 'fullscreen_exited',
  PIP_ENTERED: 'pip_entered',
  PIP_EXITED: 'pip_exited',
  VOLUME_CHANGED: 'volume_changed',
  MUTED: 'muted',
  UNMUTED: 'unmuted'
} as const;

/**
 * Error events
 */
export const ERROR_EVENTS = {
  VIDEO_ERROR: 'video_error',
  NETWORK_ERROR: 'network_error',
  LOADING_ERROR: 'loading_error',
  PLAYBACK_ERROR: 'playback_error'
} as const;

/**
 * Performance events
 */
export const PERFORMANCE_EVENTS = {
  LOAD_TIME: 'load_time',
  FIRST_FRAME: 'first_frame',
  BUFFER_HEALTH: 'buffer_health',
  DROPPED_FRAMES: 'dropped_frames',
  BANDWIDTH_MEASURED: 'bandwidth_measured'
} as const;

/**
 * AI feature events
 */
export const AI_EVENTS = {
  AI_FEATURE_ENABLED: 'ai_feature_enabled',
  AI_FEATURE_DISABLED: 'ai_feature_disabled',
  THUMBNAIL_GENERATED: 'thumbnail_generated',
  CAPTION_GENERATED: 'caption_generated',
  CONTENT_ANALYZED: 'content_analyzed'
} as const;

/**
 * All analytics events
 */
export const ALL_ANALYTICS_EVENTS = {
  ...PLAYBACK_EVENTS,
  ...QUALITY_EVENTS,
  ...INTERACTION_EVENTS,
  ...ERROR_EVENTS,
  ...PERFORMANCE_EVENTS,
  ...AI_EVENTS
} as const;
