/**
 * AI Model Configurations
 * Defines AI models and their settings for video processing
 */

/**
 * AI model endpoints and configurations
 */
export const AI_MODELS = {
  // Content analysis models
  CONTENT_ANALYZER: {
    modelId: 'video-content-analyzer-v2',
    endpoint: '/api/ai/analyze-content',
    maxVideoLength: 7200, // 2 hours in seconds
    supportedFormats: ['mp4', 'webm', 'mov'],
    features: {
      sceneDetection: true,
      objectRecognition: true,
      textExtraction: true,
      emotionAnalysis: true,
      contentModeration: true
    }
  },
  
  // Thumbnail generation models
  THUMBNAIL_GENERATOR: {
    modelId: 'smart-thumbnail-generator-v3',
    endpoint: '/api/ai/generate-thumbnails',
    outputFormat: 'webp',
    outputSizes: [160, 320, 640, 1280],
    features: {
      smartFrameSelection: true,
      faceDetection: true,
      aestheticScoring: true,
      duplicateRemoval: true
    }
  },
  
  // Caption generation models
  CAPTION_GENERATOR: {
    modelId: 'speech-to-text-v4',
    endpoint: '/api/ai/generate-captions',
    supportedLanguages: [
      'en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'
    ],
    features: {
      punctuation: true,
      speakerIdentification: false,
      profanityFilter: true,
      timestampAccuracy: 'high'
    }
  },
  
  // Quality optimization models
  QUALITY_OPTIMIZER: {
    modelId: 'adaptive-quality-optimizer-v2',
    endpoint: '/api/ai/optimize-quality',
    features: {
      bandwidthPrediction: true,
      deviceCapabilityDetection: true,
      contentAwareOptimization: true,
      userPreferenceLearning: true
    }
  },
  
  // Scene detection models
  SCENE_DETECTOR: {
    modelId: 'video-scene-detector-v1',
    endpoint: '/api/ai/detect-scenes',
    features: {
      shotBoundaryDetection: true,
      visualSimilarity: true,
      audioAnalysis: true,
      semanticSegmentation: true
    }
  },
  
  // Bandwidth prediction models
  BANDWIDTH_PREDICTOR: {
    modelId: 'network-bandwidth-predictor-v1',
    endpoint: '/api/ai/predict-bandwidth',
    features: {
      realTimeMonitoring: true,
      historicalAnalysis: true,
      networkTypeDetection: true,
      adaptiveStreaming: true
    }
  },
  
  // Accessibility enhancement models
  ACCESSIBILITY_ENHANCER: {
    modelId: 'accessibility-enhancer-v1',
    endpoint: '/api/ai/enhance-accessibility',
    features: {
      audioDescription: true,
      visualDescriptions: true,
      colorContrastOptimization: true,
      motionReduction: true
    }
  },
  
  // Recommendation engine
  RECOMMENDATION_ENGINE: {
    modelId: 'video-recommendation-engine-v2',
    endpoint: '/api/ai/recommendations',
    features: {
      collaborativeFiltering: true,
      contentBasedFiltering: true,
      contextualRecommendations: true,
      realTimePersonalization: true
    }
  }
} as const;

/**
 * AI processing configurations
 */
export const AI_PROCESSING_CONFIG = {
  // Batch processing settings
  batchSize: 10,
  maxConcurrentJobs: 3,
  timeout: 300000, // 5 minutes
  retryAttempts: 2,
  
  // Quality settings
  analysisQuality: {
    fast: {
      resolution: '480p',
      sampleRate: 0.5,
      accuracy: 'medium'
    },
    balanced: {
      resolution: '720p',
      sampleRate: 1.0,
      accuracy: 'high'
    },
    thorough: {
      resolution: '1080p',
      sampleRate: 2.0,
      accuracy: 'highest'
    }
  },
  
  // Cache settings
  cacheResults: true,
  cacheTTL: 86400, // 24 hours
  cacheMaxSize: 1000 // entries
} as const;

/**
 * AI feature flags
 */
export const AI_FEATURE_FLAGS = {
  CONTENT_ANALYSIS: 'ai_content_analysis',
  SMART_THUMBNAILS: 'ai_smart_thumbnails',
  AUTO_CAPTIONS: 'ai_auto_captions',
  QUALITY_OPTIMIZATION: 'ai_quality_optimization',
  SCENE_DETECTION: 'ai_scene_detection',
  BANDWIDTH_PREDICTION: 'ai_bandwidth_prediction',
  ACCESSIBILITY_ENHANCEMENT: 'ai_accessibility_enhancement',
  RECOMMENDATIONS: 'ai_recommendations'
} as const;

/**
 * Default AI settings
 */
export const DEFAULT_AI_SETTINGS = {
  enabled: false,
  processingQuality: 'balanced',
  autoProcess: false,
  backgroundProcessing: true,
  enabledFeatures: [],
  privacyMode: false,
  dataRetention: '30d'
} as const;
