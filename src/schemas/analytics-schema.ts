/**
 * Analytics Data Schema
 * Validation schema for analytics events and data structures
 */

export const ANALYTICS_EVENT_SCHEMA = {
  type: 'object',
  properties: {
    // Event identification
    eventType: {
      type: 'string',
      enum: [
        'play', 'pause', 'ended', 'seeking', 'seeked', 'timeupdate',
        'volumechange', 'ratechange', 'qualitychange', 'fullscreenchange',
        'error', 'loaded', 'loadstart', 'progress', 'canplay',
        'buffer_start', 'buffer_end', 'ad_start', 'ad_end',
        'interaction', 'milestone', 'engagement', 'abandonment'
      ],
      description: 'Type of analytics event'
    },
    
    // Timing
    timestamp: {
      type: 'number',
      minimum: 0,
      description: 'Event timestamp (Unix timestamp)'
    },
    sessionId: {
      type: 'string',
      minLength: 1,
      description: 'Unique session identifier'
    },
    
    // Video context
    videoId: {
      type: 'string',
      description: 'Video identifier'
    },
    videoUrl: {
      type: 'string',
      format: 'uri',
      description: 'Video source URL'
    },
    videoDuration: {
      type: 'number',
      minimum: 0,
      description: 'Total video duration in seconds'
    },
    currentTime: {
      type: 'number',
      minimum: 0,
      description: 'Current playback time in seconds'
    },
    
    // Playback state
    isPlaying: {
      type: 'boolean',
      description: 'Whether video is currently playing'
    },
    volume: {
      type: 'number',
      minimum: 0,
      maximum: 1,
      description: 'Current volume level (0-1)'
    },
    playbackRate: {
      type: 'number',
      minimum: 0.25,
      maximum: 4,
      description: 'Current playback rate'
    },
    quality: {
      type: 'string',
      description: 'Current video quality'
    },
    
    // User context
    userId: {
      type: 'string',
      description: 'User identifier (optional)'
    },
    userAgent: {
      type: 'string',
      description: 'Browser user agent'
    },
    
    // Device information
    device: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['desktop', 'mobile', 'tablet', 'tv', 'unknown']
        },
        os: { type: 'string' },
        browser: { type: 'string' },
        screenWidth: { type: 'number', minimum: 1 },
        screenHeight: { type: 'number', minimum: 1 },
        viewport: {
          type: 'object',
          properties: {
            width: { type: 'number', minimum: 1 },
            height: { type: 'number', minimum: 1 }
          }
        }
      },
      description: 'Device and browser information'
    },
    
    // Network information
    network: {
      type: 'object',
      properties: {
        effectiveType: {
          type: 'string',
          enum: ['slow-2g', '2g', '3g', '4g', 'unknown']
        },
        downlink: { type: 'number', minimum: 0 },
        rtt: { type: 'number', minimum: 0 }
      },
      description: 'Network connection information'
    },
    
    // Performance metrics
    performance: {
      type: 'object',
      properties: {
        bufferHealth: { type: 'number', minimum: 0 },
        droppedFrames: { type: 'number', minimum: 0 },
        loadTime: { type: 'number', minimum: 0 },
        startupTime: { type: 'number', minimum: 0 },
        seekTime: { type: 'number', minimum: 0 }
      },
      description: 'Performance metrics'
    },
    
    // Event-specific data
    data: {
      type: 'object',
      description: 'Additional event-specific data'
    },
    
    // Error information (for error events)
    error: {
      type: 'object',
      properties: {
        code: { type: 'string' },
        message: { type: 'string' },
        stack: { type: 'string' },
        fatal: { type: 'boolean' }
      },
      description: 'Error details (for error events)'
    }
  },
  required: ['eventType', 'timestamp', 'sessionId'],
  additionalProperties: false
} as const;

/**
 * Analytics session schema
 */
export const ANALYTICS_SESSION_SCHEMA = {
  type: 'object',
  properties: {
    sessionId: {
      type: 'string',
      description: 'Unique session identifier'
    },
    startTime: {
      type: 'number',
      description: 'Session start timestamp'
    },
    endTime: {
      type: 'number',
      description: 'Session end timestamp'
    },
    duration: {
      type: 'number',
      minimum: 0,
      description: 'Session duration in seconds'
    },
    videoCount: {
      type: 'number',
      minimum: 0,
      description: 'Number of videos played in session'
    },
    totalWatchTime: {
      type: 'number',
      minimum: 0,
      description: 'Total watch time in seconds'
    },
    events: {
      type: 'array',
      items: ANALYTICS_EVENT_SCHEMA,
      description: 'Events in this session'
    }
  },
  required: ['sessionId', 'startTime']
} as const;

/**
 * Analytics configuration schema
 */
export const ANALYTICS_CONFIG_SCHEMA = {
  type: 'object',
  properties: {
    enabled: {
      type: 'boolean',
      description: 'Enable analytics tracking'
    },
    endpoint: {
      type: 'string',
      format: 'uri',
      description: 'Analytics endpoint URL'
    },
    apiKey: {
      type: 'string',
      description: 'Analytics API key'
    },
    batchSize: {
      type: 'number',
      minimum: 1,
      maximum: 100,
      description: 'Number of events to batch before sending'
    },
    flushInterval: {
      type: 'number',
      minimum: 1000,
      description: 'Flush interval in milliseconds'
    },
    trackingEvents: {
      type: 'array',
      items: { type: 'string' },
      description: 'Events to track'
    },
    excludeEvents: {
      type: 'array',
      items: { type: 'string' },
      description: 'Events to exclude from tracking'
    },
    enablePerformanceMetrics: {
      type: 'boolean',
      description: 'Track performance metrics'
    },
    enableErrorTracking: {
      type: 'boolean',
      description: 'Track errors'
    },
    anonymizeUser: {
      type: 'boolean',
      description: 'Anonymize user data'
    }
  },
  required: ['enabled']
} as const;

/**
 * Validate analytics event
 */
export function validateAnalyticsEvent(event: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (typeof event !== 'object' || event === null) {
    return { valid: false, errors: ['Analytics event must be an object'] };
  }
  
  // Required fields
  if (!event.eventType || typeof event.eventType !== 'string') {
    errors.push('eventType is required and must be a string');
  }
  
  if (typeof event.timestamp !== 'number' || event.timestamp < 0) {
    errors.push('timestamp is required and must be a non-negative number');
  }
  
  if (!event.sessionId || typeof event.sessionId !== 'string') {
    errors.push('sessionId is required and must be a string');
  }
  
  // Optional field validation
  if (event.currentTime !== undefined && (typeof event.currentTime !== 'number' || event.currentTime < 0)) {
    errors.push('currentTime must be a non-negative number');
  }
  
  if (event.volume !== undefined && (typeof event.volume !== 'number' || event.volume < 0 || event.volume > 1)) {
    errors.push('volume must be a number between 0 and 1');
  }
  
  if (event.playbackRate !== undefined && (typeof event.playbackRate !== 'number' || event.playbackRate < 0.25 || event.playbackRate > 4)) {
    errors.push('playbackRate must be a number between 0.25 and 4');
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Validate analytics configuration
 */
export function validateAnalyticsConfig(config: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (typeof config !== 'object' || config === null) {
    return { valid: false, errors: ['Analytics config must be an object'] };
  }
  
  if (typeof config.enabled !== 'boolean') {
    errors.push('enabled is required and must be a boolean');
  }
  
  if (config.batchSize !== undefined && (typeof config.batchSize !== 'number' || config.batchSize < 1 || config.batchSize > 100)) {
    errors.push('batchSize must be a number between 1 and 100');
  }
  
  if (config.flushInterval !== undefined && (typeof config.flushInterval !== 'number' || config.flushInterval < 1000)) {
    errors.push('flushInterval must be a number >= 1000');
  }
  
  return { valid: errors.length === 0, errors };
}
