/**
 * AI Feature Types
 * Types for AI-powered video enhancement features
 */

// AI Engine Configuration
export interface AIEngineConfig {
  enabled: boolean;
  modelEndpoint?: string;
  apiKey?: string;
  features: AIFeatureFlags;
  performance: AIPerformanceSettings;
}

export interface AIFeatureFlags {
  contentAnalysis: boolean;
  smartThumbnails: boolean;
  autoCaptions: boolean;
  qualityOptimization: boolean;
  bandwidthPrediction: boolean;
  sceneDetection: boolean;
  accessibilityEnhancement: boolean;
  contentRecommendation: boolean;
}

export interface AIPerformanceSettings {
  maxConcurrentProcessing: number;
  processingTimeout: number;
  cacheResults: boolean;
  offlineMode: boolean;
}

// Content Analysis
export interface ContentAnalysisResult {
  id: string;
  timestamp: number;
  confidence: number;
  analysis: {
    scenes: SceneAnalysis[];
    objects: ObjectDetection[];
    faces: FaceDetection[];
    text: TextDetection[];
    audio: AudioAnalysis;
    sentiment: SentimentAnalysis;
  };
}

export interface SceneAnalysis {
  timeStart: number;
  timeEnd: number;
  type: 'action' | 'dialogue' | 'music' | 'transition' | 'credits';
  confidence: number;
  description: string;
  keyFrames: string[];
}

export interface ObjectDetection {
  label: string;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  timestamp: number;
}

export interface FaceDetection {
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  emotions?: {
    happy: number;
    sad: number;
    angry: number;
    surprised: number;
    neutral: number;
  };
  timestamp: number;
}

export interface TextDetection {
  text: string;
  confidence: number;
  language: string;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  timestamp: number;
}

export interface AudioAnalysis {
  volume: number;
  frequency: number;
  speechDetected: boolean;
  musicDetected: boolean;
  language?: string;
  transcript?: string;
}

export interface SentimentAnalysis {
  score: number; // -1 to 1
  confidence: number;
  emotions: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

// Smart Thumbnails
export interface SmartThumbnailConfig {
  count: number;
  quality: 'low' | 'medium' | 'high';
  format: 'jpg' | 'webp' | 'avif';
  useAI: boolean;
  fallbackStrategy: 'interval' | 'keyframes' | 'manual';
}

export interface GeneratedThumbnail {
  id: string;
  timestamp: number;
  url: string;
  score: number; // AI quality score
  metadata: {
    width: number;
    height: number;
    fileSize: number;
    generatedAt: number;
  };
}

// Auto Captions
export interface AutoCaptionConfig {
  enabled: boolean;
  language: string;
  model: 'whisper' | 'google' | 'azure' | 'aws';
  accuracy: 'fast' | 'balanced' | 'accurate';
  maxDuration: number; // seconds
}

export interface GeneratedCaption {
  id: string;
  start: number;
  end: number;
  text: string;
  confidence: number;
  speaker?: string;
  language: string;
}

// Quality Optimization
export interface AIQualityOptimization {
  enabled: boolean;
  adaptToContent: boolean;
  adaptToNetwork: boolean;
  adaptToDevice: boolean;
  learningMode: boolean;
}

export interface QualityPrediction {
  recommendedBitrate: number;
  recommendedResolution: string;
  confidence: number;
  reasoning: string[];
  adaptiveRules: AdaptiveRule[];
}

export interface AdaptiveRule {
  condition: string;
  action: 'increase' | 'decrease' | 'maintain';
  magnitude: number;
  priority: number;
}

// Bandwidth Prediction
export interface BandwidthPrediction {
  predicted: number; // Kbps
  confidence: number;
  timeHorizon: number; // seconds
  factors: {
    historical: number;
    timeOfDay: number;
    networkType: string;
    location?: string;
  };
}

// Content Recommendations
export interface ContentRecommendation {
  contentId: string;
  title: string;
  thumbnail: string;
  score: number;
  reasoning: string[];
  metadata: {
    duration: number;
    genre: string[];
    tags: string[];
    similarityScore: number;
  };
}

// TODO: Add more AI types as features are developed
// - AdvancedAnalytics
// - PersonalizationEngine
// - ContentModeration
// - RealTimeOptimization
