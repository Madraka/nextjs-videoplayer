/**
 * Analytics Types
 * Types for tracking and analytics functionality
 */

export interface AnalyticsEvent {
  type: string;
  timestamp: number;
  data: Record<string, unknown>;
  sessionId: string;
  userId?: string;
}

export interface PlayerAnalytics {
  playCount: number;
  totalWatchTime: number;
  averageWatchTime: number;
  completionRate: number;
  bufferingTime: number;
  qualityChanges: number;
  seekCount: number;
  errorCount: number;
  engagementScore: number;
}

export interface PerformanceMetrics {
  loadTime: number;
  timeToFirstFrame: number;
  bufferingEvents: number;
  droppedFrames: number;
  averageBitrate: number;
  networkLatency: number;
  memoryUsage: number;
  cpuUsage: number;
}

export interface UserBehavior {
  interactionCount: number;
  pauseEvents: number;
  seekEvents: number;
  volumeChanges: number;
  qualityChanges: number;
  fullscreenUsage: number;
  pictureInPictureUsage: number;
  averageSessionLength: number;
}

export interface AnalyticsConfig {
  enabled: boolean;
  endpoint?: string;
  apiKey?: string;
  batchSize: number;
  flushInterval: number;
  trackUserBehavior: boolean;
  trackPerformance: boolean;
  trackErrors: boolean;
  anonymizeData: boolean;
}
