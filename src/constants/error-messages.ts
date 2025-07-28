/**
 * Standardized Error Messages
 * Provides consistent error messaging throughout the application
 */

/**
 * Video loading and playback errors
 */
export const VIDEO_ERRORS = {
  // Network errors
  NETWORK_ERROR: {
    code: 'NETWORK_ERROR',
    message: 'Network error occurred while loading video',
    userMessage: 'Unable to load video due to network issues. Please check your connection and try again.',
    recoverable: true
  },
  
  TIMEOUT_ERROR: {
    code: 'TIMEOUT_ERROR',
    message: 'Video loading timed out',
    userMessage: 'Video is taking too long to load. Please try again.',
    recoverable: true
  },
  
  // Format errors
  FORMAT_NOT_SUPPORTED: {
    code: 'FORMAT_NOT_SUPPORTED',
    message: 'Video format not supported',
    userMessage: 'This video format is not supported by your browser.',
    recoverable: false
  },
  
  CODEC_NOT_SUPPORTED: {
    code: 'CODEC_NOT_SUPPORTED',
    message: 'Video codec not supported',
    userMessage: 'This video cannot be played due to unsupported codec.',
    recoverable: false
  },
  
  // Source errors
  SOURCE_NOT_FOUND: {
    code: 'SOURCE_NOT_FOUND',
    message: 'Video source not found',
    userMessage: 'The requested video could not be found.',
    recoverable: false
  },
  
  INVALID_SOURCE: {
    code: 'INVALID_SOURCE',
    message: 'Invalid video source URL',
    userMessage: 'The video source URL is invalid or corrupted.',
    recoverable: false
  },
  
  // Playback errors
  DECODE_ERROR: {
    code: 'DECODE_ERROR',
    message: 'Video decoding error',
    userMessage: 'An error occurred while processing the video. Please try refreshing.',
    recoverable: true
  },
  
  PLAYBACK_ERROR: {
    code: 'PLAYBACK_ERROR',
    message: 'Video playback error',
    userMessage: 'An error occurred during video playback.',
    recoverable: true
  },
  
  // Security errors
  CORS_ERROR: {
    code: 'CORS_ERROR',
    message: 'Cross-origin request blocked',
    userMessage: 'Video cannot be loaded due to security restrictions.',
    recoverable: false
  },
  
  PERMISSION_DENIED: {
    code: 'PERMISSION_DENIED',
    message: 'Permission denied for video access',
    userMessage: 'Access to this video is restricted.',
    recoverable: false
  }
} as const;

/**
 * Streaming specific errors
 */
export const STREAMING_ERRORS = {
  HLS_LOAD_ERROR: {
    code: 'HLS_LOAD_ERROR',
    message: 'HLS playlist loading failed',
    userMessage: 'Unable to load video stream. Please try again.',
    recoverable: true
  },
  
  DASH_LOAD_ERROR: {
    code: 'DASH_LOAD_ERROR',
    message: 'DASH manifest loading failed',
    userMessage: 'Unable to load video stream. Please try again.',
    recoverable: true
  },
  
  SEGMENT_LOAD_ERROR: {
    code: 'SEGMENT_LOAD_ERROR',
    message: 'Video segment loading failed',
    userMessage: 'Video buffering interrupted. Attempting to recover...',
    recoverable: true
  },
  
  MANIFEST_PARSE_ERROR: {
    code: 'MANIFEST_PARSE_ERROR',
    message: 'Streaming manifest parse error',
    userMessage: 'Video stream format is corrupted or invalid.',
    recoverable: false
  }
} as const;

/**
 * AI feature errors
 */
export const AI_ERRORS = {
  AI_SERVICE_UNAVAILABLE: {
    code: 'AI_SERVICE_UNAVAILABLE',
    message: 'AI service is currently unavailable',
    userMessage: 'AI features are temporarily unavailable. Video will play without AI enhancements.',
    recoverable: true
  },
  
  THUMBNAIL_GENERATION_FAILED: {
    code: 'THUMBNAIL_GENERATION_FAILED',
    message: 'AI thumbnail generation failed',
    userMessage: 'Unable to generate smart thumbnails. Using default thumbnails.',
    recoverable: true
  },
  
  CAPTION_GENERATION_FAILED: {
    code: 'CAPTION_GENERATION_FAILED',
    message: 'AI caption generation failed',
    userMessage: 'Automatic captions are not available for this video.',
    recoverable: true
  },
  
  CONTENT_ANALYSIS_FAILED: {
    code: 'CONTENT_ANALYSIS_FAILED',
    message: 'AI content analysis failed',
    userMessage: 'Content analysis features are not available.',
    recoverable: true
  }
} as const;

/**
 * MCP protocol errors
 */
export const MCP_ERRORS = {
  MCP_CONNECTION_FAILED: {
    code: 'MCP_CONNECTION_FAILED',
    message: 'MCP server connection failed',
    userMessage: 'Unable to connect to content services. Some features may be limited.',
    recoverable: true
  },
  
  MCP_AUTHENTICATION_FAILED: {
    code: 'MCP_AUTHENTICATION_FAILED',
    message: 'MCP authentication failed',
    userMessage: 'Authentication failed. Please check your credentials.',
    recoverable: false
  },
  
  MCP_PROTOCOL_ERROR: {
    code: 'MCP_PROTOCOL_ERROR',
    message: 'MCP protocol error',
    userMessage: 'A communication error occurred. Please try again.',
    recoverable: true
  }
} as const;

/**
 * General system errors
 */
export const SYSTEM_ERRORS = {
  BROWSER_NOT_SUPPORTED: {
    code: 'BROWSER_NOT_SUPPORTED',
    message: 'Browser not supported',
    userMessage: 'Your browser does not support this video player. Please update or use a different browser.',
    recoverable: false
  },
  
  STORAGE_ERROR: {
    code: 'STORAGE_ERROR',
    message: 'Local storage error',
    userMessage: 'Unable to save settings. Some preferences may not persist.',
    recoverable: true
  },
  
  CONFIGURATION_ERROR: {
    code: 'CONFIGURATION_ERROR',
    message: 'Player configuration error',
    userMessage: 'Player configuration is invalid. Using default settings.',
    recoverable: true
  },
  
  UNKNOWN_ERROR: {
    code: 'UNKNOWN_ERROR',
    message: 'An unknown error occurred',
    userMessage: 'An unexpected error occurred. Please refresh the page and try again.',
    recoverable: true
  }
} as const;

/**
 * All error messages combined
 */
export const ALL_ERRORS = {
  ...VIDEO_ERRORS,
  ...STREAMING_ERRORS,
  ...AI_ERRORS,
  ...MCP_ERRORS,
  ...SYSTEM_ERRORS
} as const;

/**
 * Error severity levels
 */
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
} as const;

/**
 * Error recovery strategies
 */
export const ERROR_RECOVERY = {
  RETRY: 'retry',
  FALLBACK: 'fallback',
  IGNORE: 'ignore',
  ABORT: 'abort'
} as const;
