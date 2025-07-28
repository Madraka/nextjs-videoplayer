/**
 * Player Configuration Schema
 * Validation schema for player configuration objects
 */

export const PLAYER_CONFIG_SCHEMA = {
  type: 'object',
  properties: {
    // Basic playback controls
    controls: {
      type: 'boolean',
      description: 'Show player controls'
    },
    autoplay: {
      type: 'boolean',
      description: 'Auto-play video on load'
    },
    muted: {
      type: 'boolean',
      description: 'Start video muted'
    },
    loop: {
      type: 'boolean',
      description: 'Loop video playback'
    },
    
    // Volume and audio
    volume: {
      type: 'number',
      minimum: 0,
      maximum: 1,
      description: 'Initial volume level (0-1)'
    },
    
    // Quality settings
    defaultQuality: {
      type: 'string',
      enum: ['144p', '240p', '360p', '480p', '720p', '1080p', '1440p', '2160p', 'auto'],
      description: 'Default quality level'
    },
    adaptiveStreaming: {
      type: 'boolean',
      description: 'Enable adaptive bitrate streaming'
    },
    
    // UI elements
    showProgressBar: {
      type: 'boolean',
      description: 'Show progress bar'
    },
    showVolumeControl: {
      type: 'boolean',
      description: 'Show volume control'
    },
    showFullscreenButton: {
      type: 'boolean',
      description: 'Show fullscreen button'
    },
    showPlaybackRate: {
      type: 'boolean',
      description: 'Show playback rate control'
    },
    showQualitySelector: {
      type: 'boolean',
      description: 'Show quality selector'
    },
    
    // Mobile and gestures
    enableGestures: {
      type: 'boolean',
      description: 'Enable touch gestures'
    },
    showMobileControls: {
      type: 'boolean',
      description: 'Show mobile-optimized controls'
    },
    
    // Accessibility
    enableKeyboardShortcuts: {
      type: 'boolean',
      description: 'Enable keyboard shortcuts'
    },
    enableScreenReader: {
      type: 'boolean',
      description: 'Enable screen reader support'
    },
    announcePlayState: {
      type: 'boolean',
      description: 'Announce play state changes'
    },
    
    // Analytics
    enableAnalytics: {
      type: 'boolean',
      description: 'Enable analytics tracking'
    },
    
    // Streaming URLs
    src: {
      type: 'string',
      format: 'uri',
      description: 'Video source URL'
    },
    poster: {
      type: 'string',
      format: 'uri',
      description: 'Poster image URL'
    },
    
    // Subtitles
    subtitles: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          src: { type: 'string', format: 'uri' },
          language: { type: 'string' },
          label: { type: 'string' },
          default: { type: 'boolean' }
        },
        required: ['src', 'language', 'label']
      },
      description: 'Subtitle tracks'
    },
    
    // Thumbnails
    thumbnails: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean' },
        spriteUrl: { type: 'string', format: 'uri' },
        spriteWidth: { type: 'number', minimum: 1 },
        spriteHeight: { type: 'number', minimum: 1 },
        interval: { type: 'number', minimum: 1 }
      },
      description: 'Thumbnail configuration'
    },
    
    // Performance
    preload: {
      type: 'string',
      enum: ['none', 'metadata', 'auto'],
      description: 'Preload strategy'
    },
    bufferTime: {
      type: 'number',
      minimum: 0,
      description: 'Buffer time in seconds'
    }
  },
  required: ['controls', 'autoplay'],
  additionalProperties: false
} as const;

/**
 * Validate player configuration
 */
export function validatePlayerConfig(config: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Basic validation
  if (typeof config !== 'object' || config === null) {
    return { valid: false, errors: ['Configuration must be an object'] };
  }
  
  // Required fields
  if (typeof config.controls !== 'boolean') {
    errors.push('controls must be a boolean');
  }
  
  if (typeof config.autoplay !== 'boolean') {
    errors.push('autoplay must be a boolean');
  }
  
  // Volume validation
  if (config.volume !== undefined) {
    if (typeof config.volume !== 'number' || config.volume < 0 || config.volume > 1) {
      errors.push('volume must be a number between 0 and 1');
    }
  }
  
  // Quality validation
  if (config.defaultQuality !== undefined) {
    const validQualities = ['144p', '240p', '360p', '480p', '720p', '1080p', '1440p', '2160p', 'auto'];
    if (!validQualities.includes(config.defaultQuality)) {
      errors.push(`defaultQuality must be one of: ${validQualities.join(', ')}`);
    }
  }
  
  // URL validation
  if (config.src !== undefined && typeof config.src !== 'string') {
    errors.push('src must be a string URL');
  }
  
  if (config.poster !== undefined && typeof config.poster !== 'string') {
    errors.push('poster must be a string URL');
  }
  
  return { valid: errors.length === 0, errors };
}
