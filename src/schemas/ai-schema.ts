/**
 * AI Feature Schema
 * Validation schema for AI-powered features and configurations
 */

export const AI_CONFIG_SCHEMA = {
  type: 'object',
  properties: {
    // AI engine configuration
    engine: {
      type: 'object',
      properties: {
        provider: {
          type: 'string',
          enum: ['openai', 'anthropic', 'google', 'azure', 'huggingface', 'local'],
          description: 'AI provider'
        },
        apiKey: {
          type: 'string',
          description: 'API key for AI service'
        },
        endpoint: {
          type: 'string',
          format: 'uri',
          description: 'Custom API endpoint'
        },
        model: {
          type: 'string',
          description: 'AI model identifier'
        },
        maxTokens: {
          type: 'number',
          minimum: 1,
          maximum: 100000,
          description: 'Maximum tokens per request'
        },
        temperature: {
          type: 'number',
          minimum: 0,
          maximum: 2,
          description: 'AI temperature setting'
        }
      },
      required: ['provider'],
      description: 'AI engine configuration'
    },
    
    // Content analysis features
    contentAnalysis: {
      type: 'object',
      properties: {
        enabled: {
          type: 'boolean',
          description: 'Enable content analysis'
        },
        features: {
          type: 'array',
          items: {
            type: 'string',
            enum: [
              'scene_detection', 'object_recognition', 'text_extraction', 
              'sentiment_analysis', 'topic_classification', 'face_detection',
              'audio_transcription', 'language_detection'
            ]
          },
          description: 'Enabled analysis features'
        },
        confidence: {
          type: 'number',
          minimum: 0,
          maximum: 1,
          description: 'Minimum confidence threshold'
        },
        batchSize: {
          type: 'number',
          minimum: 1,
          maximum: 100,
          description: 'Analysis batch size'
        }
      },
      description: 'Content analysis configuration'
    },
    
    // Automatic transcription
    transcription: {
      type: 'object',
      properties: {
        enabled: {
          type: 'boolean',
          description: 'Enable automatic transcription'
        },
        language: {
          type: 'string',
          description: 'Source language (auto-detect if not specified)'
        },
        accuracy: {
          type: 'string',
          enum: ['low', 'medium', 'high'],
          description: 'Transcription accuracy level'
        },
        realTime: {
          type: 'boolean',
          description: 'Real-time transcription'
        },
        timestamps: {
          type: 'boolean',
          description: 'Include timestamps in transcription'
        },
        speakerLabels: {
          type: 'boolean',
          description: 'Identify different speakers'
        }
      },
      description: 'Transcription configuration'
    },
    
    // Translation features
    translation: {
      type: 'object',
      properties: {
        enabled: {
          type: 'boolean',
          description: 'Enable automatic translation'
        },
        targetLanguages: {
          type: 'array',
          items: {
            type: 'string',
            pattern: '^[a-z]{2}(-[A-Z]{2})?$'
          },
          description: 'Target languages for translation'
        },
        preserveFormatting: {
          type: 'boolean',
          description: 'Preserve subtitle formatting'
        },
        customGlossary: {
          type: 'object',
          description: 'Custom translation glossary'
        }
      },
      description: 'Translation configuration'
    },
    
    // Smart thumbnails
    thumbnails: {
      type: 'object',
      properties: {
        enabled: {
          type: 'boolean',
          description: 'Enable AI thumbnail generation'
        },
        algorithm: {
          type: 'string',
          enum: ['keyframe', 'scene_change', 'content_based', 'face_detection'],
          description: 'Thumbnail selection algorithm'
        },
        count: {
          type: 'number',
          minimum: 1,
          maximum: 100,
          description: 'Number of thumbnails to generate'
        },
        quality: {
          type: 'string',
          enum: ['low', 'medium', 'high'],
          description: 'Thumbnail quality'
        },
        format: {
          type: 'string',
          enum: ['jpeg', 'png', 'webp'],
          description: 'Thumbnail format'
        }
      },
      description: 'AI thumbnail configuration'
    },
    
    // Quality optimization
    qualityOptimization: {
      type: 'object',
      properties: {
        enabled: {
          type: 'boolean',
          description: 'Enable AI quality optimization'
        },
        adaptiveBitrate: {
          type: 'boolean',
          description: 'AI-driven adaptive bitrate'
        },
        networkPrediction: {
          type: 'boolean',
          description: 'Predict network conditions'
        },
        userBehaviorLearning: {
          type: 'boolean',
          description: 'Learn from user behavior'
        },
        contextAware: {
          type: 'boolean',
          description: 'Context-aware optimization'
        }
      },
      description: 'Quality optimization configuration'
    },
    
    // Content recommendations
    recommendations: {
      type: 'object',
      properties: {
        enabled: {
          type: 'boolean',
          description: 'Enable content recommendations'
        },
        algorithm: {
          type: 'string',
          enum: ['collaborative', 'content_based', 'hybrid'],
          description: 'Recommendation algorithm'
        },
        maxRecommendations: {
          type: 'number',
          minimum: 1,
          maximum: 50,
          description: 'Maximum recommendations to show'
        },
        updateInterval: {
          type: 'number',
          minimum: 3600,
          description: 'Update interval in seconds'
        },
        personalizedRanking: {
          type: 'boolean',
          description: 'Personalized ranking'
        }
      },
      description: 'Recommendation configuration'
    },
    
    // Accessibility enhancements
    accessibility: {
      type: 'object',
      properties: {
        enabled: {
          type: 'boolean',
          description: 'Enable AI accessibility features'
        },
        audioDescriptions: {
          type: 'boolean',
          description: 'Generate audio descriptions'
        },
        visualDescriptions: {
          type: 'boolean',
          description: 'Generate visual descriptions'
        },
        simplifiedLanguage: {
          type: 'boolean',
          description: 'Simplify language for accessibility'
        },
        signLanguage: {
          type: 'boolean',
          description: 'Sign language generation'
        }
      },
      description: 'AI accessibility configuration'
    },
    
    // Performance settings
    performance: {
      type: 'object',
      properties: {
        enableCaching: {
          type: 'boolean',
          description: 'Enable AI result caching'
        },
        cacheExpiry: {
          type: 'number',
          minimum: 3600,
          description: 'Cache expiry time in seconds'
        },
        batchProcessing: {
          type: 'boolean',
          description: 'Enable batch processing'
        },
        offloading: {
          type: 'string',
          enum: ['client', 'server', 'edge', 'hybrid'],
          description: 'AI processing location'
        },
        maxConcurrency: {
          type: 'number',
          minimum: 1,
          maximum: 10,
          description: 'Maximum concurrent AI requests'
        }
      },
      description: 'AI performance configuration'
    },
    
    // Privacy and security
    privacy: {
      type: 'object',
      properties: {
        dataRetention: {
          type: 'number',
          minimum: 0,
          description: 'Data retention period in days (0 = no retention)'
        },
        anonymization: {
          type: 'boolean',
          description: 'Anonymize data before processing'
        },
        localProcessing: {
          type: 'boolean',
          description: 'Process data locally when possible'
        },
        gdprCompliant: {
          type: 'boolean',
          description: 'GDPR compliance mode'
        },
        encryption: {
          type: 'boolean',
          description: 'Encrypt data in transit and at rest'
        }
      },
      description: 'Privacy and security settings'
    }
  },
  required: ['engine'],
  additionalProperties: false
} as const;

/**
 * AI model schema
 */
export const AI_MODEL_SCHEMA = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      description: 'Model identifier'
    },
    name: {
      type: 'string',
      description: 'Model display name'
    },
    provider: {
      type: 'string',
      description: 'Model provider'
    },
    version: {
      type: 'string',
      description: 'Model version'
    },
    capabilities: {
      type: 'array',
      items: {
        type: 'string',
        enum: [
          'text_generation', 'image_analysis', 'audio_transcription',
          'translation', 'summarization', 'classification',
          'object_detection', 'face_recognition', 'sentiment_analysis'
        ]
      },
      description: 'Model capabilities'
    },
    maxTokens: {
      type: 'number',
      minimum: 1,
      description: 'Maximum token limit'
    },
    costPerToken: {
      type: 'number',
      minimum: 0,
      description: 'Cost per token'
    },
    latency: {
      type: 'number',
      minimum: 0,
      description: 'Average response latency in ms'
    }
  },
  required: ['id', 'name', 'provider', 'capabilities']
} as const;

/**
 * Validate AI configuration
 */
export function validateAIConfig(config: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (typeof config !== 'object' || config === null) {
    return { valid: false, errors: ['AI config must be an object'] };
  }
  
  // Engine validation
  if (!config.engine || typeof config.engine !== 'object') {
    errors.push('engine is required and must be an object');
  } else {
    if (!config.engine.provider || typeof config.engine.provider !== 'string') {
      errors.push('engine.provider is required and must be a string');
    } else {
      const validProviders = ['openai', 'anthropic', 'google', 'azure', 'huggingface', 'local'];
      if (!validProviders.includes(config.engine.provider)) {
        errors.push(`engine.provider must be one of: ${validProviders.join(', ')}`);
      }
    }
    
    if (config.engine.temperature !== undefined) {
      if (typeof config.engine.temperature !== 'number' || config.engine.temperature < 0 || config.engine.temperature > 2) {
        errors.push('engine.temperature must be a number between 0 and 2');
      }
    }
  }
  
  // Content analysis validation
  if (config.contentAnalysis && typeof config.contentAnalysis === 'object') {
    if (config.contentAnalysis.confidence !== undefined) {
      if (typeof config.contentAnalysis.confidence !== 'number' || 
          config.contentAnalysis.confidence < 0 || 
          config.contentAnalysis.confidence > 1) {
        errors.push('contentAnalysis.confidence must be a number between 0 and 1');
      }
    }
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Validate AI model definition
 */
export function validateAIModel(model: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (typeof model !== 'object' || model === null) {
    return { valid: false, errors: ['AI model must be an object'] };
  }
  
  const requiredFields = ['id', 'name', 'provider', 'capabilities'];
  for (const field of requiredFields) {
    if (!model[field]) {
      errors.push(`${field} is required`);
    }
  }
  
  if (model.capabilities && Array.isArray(model.capabilities)) {
    const validCapabilities = [
      'text_generation', 'image_analysis', 'audio_transcription',
      'translation', 'summarization', 'classification',
      'object_detection', 'face_recognition', 'sentiment_analysis'
    ];
    
    model.capabilities.forEach((cap: any) => {
      if (!validCapabilities.includes(cap)) {
        errors.push(`Invalid capability: ${cap}`);
      }
    });
  }
  
  return { valid: errors.length === 0, errors };
}
