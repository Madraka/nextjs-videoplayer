/**
 * AI plugins module exports
 * 
 * This module provides AI-powered features for video players including
 * content analysis, smart thumbnails, auto captions, quality prediction,
 * scene detection, and content recommendations.
 */

export { ContentAnalysisPlugin } from './content-analysis';
export { SmartThumbnailsPlugin } from './smart-thumbnails';
export { AutoCaptionsPlugin } from './auto-captions';

// Type exports
export type {
  ContentAnalysisResult,
  Scene,
  DetectedObject,
  AudioAnalysis,
  TextDetection,
  ContentCategory,
  SentimentAnalysis,
  ContentAnalysisConfig
} from './content-analysis';

export type {
  ThumbnailResult,
  ThumbnailOptions,
  SmartThumbnailsConfig
} from './smart-thumbnails';

export type {
  CaptionSegment,
  TranslationResult,
  AutoCaptionsConfig
} from './auto-captions';
