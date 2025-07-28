/**
 * Streaming Configuration Schema
 * Validation schema for streaming protocols and configurations
 */

export const STREAMING_CONFIG_SCHEMA = {
  type: 'object',
  properties: {
    // Protocol configuration
    protocol: {
      type: 'string',
      enum: ['hls', 'dash', 'progressive', 'webrtc', 'rtmp'],
      description: 'Streaming protocol type'
    },
    
    // Source URLs
    url: {
      type: 'string',
      format: 'uri',
      description: 'Primary streaming URL'
    },
    fallbackUrls: {
      type: 'array',
      items: {
        type: 'string',
        format: 'uri'
      },
      description: 'Fallback streaming URLs'
    },
    
    // Quality levels
    qualities: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          label: {
            type: 'string',
            description: 'Quality label (e.g., "1080p", "720p")'
          },
          height: {
            type: 'number',
            minimum: 144,
            maximum: 4320,
            description: 'Video height in pixels'
          },
          width: {
            type: 'number',
            minimum: 256,
            maximum: 7680,
            description: 'Video width in pixels'
          },
          bitrate: {
            type: 'number',
            minimum: 64000,
            description: 'Bitrate in bits per second'
          },
          url: {
            type: 'string',
            format: 'uri',
            description: 'Quality-specific URL'
          },
          codec: {
            type: 'string',
            description: 'Video codec'
          }
        },
        required: ['label', 'height', 'bitrate']
      },
      description: 'Available quality levels'
    },
    
    // Adaptive streaming settings
    adaptiveStreaming: {
      type: 'object',
      properties: {
        enabled: {
          type: 'boolean',
          description: 'Enable adaptive bitrate streaming'
        },
        algorithm: {
          type: 'string',
          enum: ['bandwidth', 'buffer', 'hybrid'],
          description: 'Adaptive algorithm type'
        },
        minBitrate: {
          type: 'number',
          minimum: 64000,
          description: 'Minimum bitrate in bps'
        },
        maxBitrate: {
          type: 'number',
          minimum: 64000,
          description: 'Maximum bitrate in bps'
        },
        switchUpThreshold: {
          type: 'number',
          minimum: 0,
          maximum: 1,
          description: 'Buffer threshold for quality increase (0-1)'
        },
        switchDownThreshold: {
          type: 'number',
          minimum: 0,
          maximum: 1,
          description: 'Buffer threshold for quality decrease (0-1)'
        }
      },
      description: 'Adaptive streaming configuration'
    },
    
    // Buffering settings
    buffering: {
      type: 'object',
      properties: {
        targetDuration: {
          type: 'number',
          minimum: 1,
          maximum: 60,
          description: 'Target buffer duration in seconds'
        },
        maxDuration: {
          type: 'number',
          minimum: 1,
          maximum: 300,
          description: 'Maximum buffer duration in seconds'
        },
        rebufferThreshold: {
          type: 'number',
          minimum: 0.1,
          maximum: 10,
          description: 'Rebuffer threshold in seconds'
        },
        seekThreshold: {
          type: 'number',
          minimum: 0.1,
          maximum: 10,
          description: 'Seek threshold in seconds'
        }
      },
      description: 'Buffering configuration'
    },
    
    // HLS-specific settings
    hls: {
      type: 'object',
      properties: {
        liveSyncDuration: {
          type: 'number',
          minimum: 1,
          description: 'Live sync duration for HLS'
        },
        liveMaxLatencyDuration: {
          type: 'number',
          minimum: 1,
          description: 'Maximum latency for live streams'
        },
        maxLoadingDelay: {
          type: 'number',
          minimum: 1,
          description: 'Maximum loading delay'
        },
        startLevel: {
          type: 'number',
          minimum: -1,
          description: 'Starting quality level (-1 for auto)'
        }
      },
      description: 'HLS-specific configuration'
    },
    
    // DASH-specific settings
    dash: {
      type: 'object',
      properties: {
        liveDelay: {
          type: 'number',
          minimum: 0,
          description: 'Live stream delay in seconds'
        },
        manifestLoadTimeout: {
          type: 'number',
          minimum: 1000,
          description: 'Manifest load timeout in milliseconds'
        },
        segmentLoadTimeout: {
          type: 'number',
          minimum: 1000,
          description: 'Segment load timeout in milliseconds'
        }
      },
      description: 'DASH-specific configuration'
    },
    
    // WebRTC settings
    webrtc: {
      type: 'object',
      properties: {
        iceServers: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              urls: {
                oneOf: [
                  { type: 'string' },
                  { type: 'array', items: { type: 'string' } }
                ]
              },
              username: { type: 'string' },
              credential: { type: 'string' }
            },
            required: ['urls']
          },
          description: 'ICE servers configuration'
        },
        maxBitrate: {
          type: 'number',
          minimum: 64000,
          description: 'Maximum bitrate for WebRTC'
        }
      },
      description: 'WebRTC-specific configuration'
    },
    
    // DRM settings
    drm: {
      type: 'object',
      properties: {
        enabled: {
          type: 'boolean',
          description: 'Enable DRM protection'
        },
        systems: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['widevine', 'playready', 'fairplay', 'clearkey']
          },
          description: 'Supported DRM systems'
        },
        licenseUrl: {
          type: 'string',
          format: 'uri',
          description: 'DRM license server URL'
        },
        certificateUrl: {
          type: 'string',
          format: 'uri',
          description: 'DRM certificate URL'
        }
      },
      description: 'DRM configuration'
    },
    
    // Performance settings
    performance: {
      type: 'object',
      properties: {
        lowLatencyMode: {
          type: 'boolean',
          description: 'Enable low latency mode'
        },
        preloadSegments: {
          type: 'number',
          minimum: 0,
          maximum: 10,
          description: 'Number of segments to preload'
        },
        maxRetries: {
          type: 'number',
          minimum: 0,
          maximum: 10,
          description: 'Maximum retry attempts'
        },
        retryDelay: {
          type: 'number',
          minimum: 100,
          description: 'Retry delay in milliseconds'
        }
      },
      description: 'Performance optimization settings'
    }
  },
  required: ['protocol', 'url'],
  additionalProperties: false
} as const;

/**
 * Streaming source schema
 */
export const STREAMING_SOURCE_SCHEMA = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      description: 'Source identifier'
    },
    type: {
      type: 'string',
      enum: ['video/mp4', 'video/webm', 'video/ogg', 'application/x-mpegURL', 'application/dash+xml'],
      description: 'MIME type'
    },
    src: {
      type: 'string',
      format: 'uri',
      description: 'Source URL'
    },
    label: {
      type: 'string',
      description: 'Human-readable label'
    },
    default: {
      type: 'boolean',
      description: 'Default source selection'
    }
  },
  required: ['src', 'type']
} as const;

/**
 * Validate streaming configuration
 */
export function validateStreamingConfig(config: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (typeof config !== 'object' || config === null) {
    return { valid: false, errors: ['Streaming config must be an object'] };
  }
  
  // Required fields
  if (!config.protocol || typeof config.protocol !== 'string') {
    errors.push('protocol is required and must be a string');
  } else {
    const validProtocols = ['hls', 'dash', 'progressive', 'webrtc', 'rtmp'];
    if (!validProtocols.includes(config.protocol)) {
      errors.push(`protocol must be one of: ${validProtocols.join(', ')}`);
    }
  }
  
  if (!config.url || typeof config.url !== 'string') {
    errors.push('url is required and must be a string');
  }
  
  // Quality levels validation
  if (config.qualities && Array.isArray(config.qualities)) {
    config.qualities.forEach((quality: any, index: number) => {
      if (typeof quality !== 'object' || quality === null) {
        errors.push(`Quality at index ${index} must be an object`);
        return;
      }
      
      if (!quality.label || typeof quality.label !== 'string') {
        errors.push(`Quality at index ${index} must have a label string`);
      }
      
      if (typeof quality.height !== 'number' || quality.height < 144 || quality.height > 4320) {
        errors.push(`Quality at index ${index} height must be a number between 144 and 4320`);
      }
      
      if (typeof quality.bitrate !== 'number' || quality.bitrate < 64000) {
        errors.push(`Quality at index ${index} bitrate must be a number >= 64000`);
      }
    });
  }
  
  // Adaptive streaming validation
  if (config.adaptiveStreaming && typeof config.adaptiveStreaming === 'object') {
    const adaptive = config.adaptiveStreaming;
    
    if (adaptive.minBitrate && adaptive.maxBitrate && adaptive.minBitrate > adaptive.maxBitrate) {
      errors.push('adaptiveStreaming.minBitrate cannot be greater than maxBitrate');
    }
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Validate streaming source
 */
export function validateStreamingSource(source: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (typeof source !== 'object' || source === null) {
    return { valid: false, errors: ['Streaming source must be an object'] };
  }
  
  if (!source.src || typeof source.src !== 'string') {
    errors.push('src is required and must be a string');
  }
  
  if (!source.type || typeof source.type !== 'string') {
    errors.push('type is required and must be a string');
  }
  
  return { valid: errors.length === 0, errors };
}
