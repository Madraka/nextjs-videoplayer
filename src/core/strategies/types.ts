/**
 * Strategy Implementation Types
 * Types for adaptive streaming and optimization strategies
 */

import type { QualityLevel, EngineMetrics } from '../../types';

export interface StrategyInterface {
  initialize(): void;
  evaluate(metrics: EngineMetrics): StrategyResult;
  reset(): void;
  destroy(): void;
}

export interface StrategyResult {
  shouldChangeQuality: boolean;
  targetQuality?: QualityLevel;
  reason: string;
  confidence: number;
  nextEvaluationDelay: number;
}

export interface StrategyMetrics {
  averageBandwidth: number;
  bufferHealth: number;
  droppedFrameRatio: number;
  rebufferingEvents: number;
  qualityChangeHistory: QualityChangeEvent[];
}

export interface QualityChangeEvent {
  timestamp: number;
  fromLevel: QualityLevel;
  toLevel: QualityLevel;
  reason: string;
  success: boolean;
}

// Adaptive Strategy specific types
export interface AdaptiveConfig {
  minBufferTime: number;
  maxBufferTime: number;
  bandwidthSafetyFactor: number;
  maxQualityJump: number;
  stabilityThreshold: number;
}

// Bandwidth Strategy specific types
export interface BandwidthConfig {
  measurementWindow: number;
  minSamples: number;
  maxSamples: number;
  weightedAverage: boolean;
  bandwidthMultiplier: number;
}

// Quality Strategy specific types
export interface QualityConfig {
  enableABR: boolean;
  maxAutoBitrate: number;
  minAutoBitrate: number;
  bitrateTestDuration: number;
  fastSwitchEnabled: boolean;
}

// Fallback Strategy specific types
export interface FallbackConfig {
  maxRetries: number;
  retryDelay: number;
  fallbackOrder: string[];
  enableFallbackOnError: boolean;
  fallbackThreshold: number;
}
