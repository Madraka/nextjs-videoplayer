/**
 * API Types
 * Types for API requests, responses, and service integrations
 */

// Base API Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata: ApiMetadata;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: number;
  requestId: string;
}

export interface ApiMetadata {
  requestId: string;
  timestamp: number;
  duration: number;
  version: string;
  rateLimit?: {
    limit: number;
    remaining: number;
    resetTime: number;
  };
}

// Authentication API
export interface AuthRequest {
  email?: string;
  username?: string;
  password?: string;
  token?: string;
  refreshToken?: string;
}

export interface AuthResponse {
  user: UserInfo;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
  permissions: string[];
}

export interface UserInfo {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  plan: 'free' | 'premium' | 'enterprise';
  createdAt: number;
  lastLogin: number;
}

// Video Upload API
export interface UploadRequest {
  file: File;
  metadata: VideoMetadata;
  options: UploadOptions;
}

export interface VideoMetadata {
  title: string;
  description?: string;
  tags: string[];
  category: string;
  language: string;
  thumbnail?: string;
  privacy: 'public' | 'private' | 'unlisted';
}

export interface UploadOptions {
  quality: 'source' | 'high' | 'medium' | 'low';
  generateThumbnails: boolean;
  generateCaptions: boolean;
  enableAnalytics: boolean;
  processWithAI: boolean;
}

export interface UploadResponse {
  videoId: string;
  uploadUrl: string;
  status: 'pending' | 'processing' | 'ready' | 'error';
  progress: number;
  estimatedCompletion?: number;
}

// Streaming API
export interface StreamingRequest {
  videoId: string;
  quality?: string;
  format?: 'hls' | 'dash' | 'mp4';
  startTime?: number;
  endTime?: number;
  subtitles?: string[];
}

export interface StreamingResponse {
  streamUrl: string;
  format: string;
  duration: number;
  qualities: QualityOption[];
  subtitles: SubtitleTrack[];
  thumbnails: ThumbnailSet;
}

export interface QualityOption {
  id: string;
  label: string;
  bitrate: number;
  resolution: string;
  fps: number;
  url: string;
}

export interface SubtitleTrack {
  id: string;
  language: string;
  label: string;
  url: string;
  format: 'vtt' | 'srt' | 'ass';
  default: boolean;
}

export interface ThumbnailSet {
  sprite: string;
  individual: ThumbnailInfo[];
  chapters: ChapterThumbnail[];
}

export interface ThumbnailInfo {
  timestamp: number;
  url: string;
  width: number;
  height: number;
}

export interface ChapterThumbnail {
  title: string;
  startTime: number;
  endTime: number;
  thumbnail: string;
}

// Analytics API
export interface AnalyticsRequest {
  videoId?: string;
  userId?: string;
  sessionId?: string;
  timeRange: {
    start: number;
    end: number;
  };
  metrics: string[];
  granularity: 'minute' | 'hour' | 'day' | 'week' | 'month';
}

export interface AnalyticsResponse {
  summary: AnalyticsSummary;
  timeSeries: TimeSeriesData[];
  demographics: DemographicsData;
  engagement: EngagementMetrics;
  performance: PerformanceMetrics;
}

export interface AnalyticsSummary {
  totalViews: number;
  uniqueViewers: number;
  totalWatchTime: number;
  averageWatchTime: number;
  completionRate: number;
  engagement: number;
}

export interface TimeSeriesData {
  timestamp: number;
  views: number;
  concurrentViewers: number;
  bandwidth: number;
  quality: string;
  bufferingEvents: number;
  errors: number;
}

export interface DemographicsData {
  countries: Record<string, number>;
  devices: Record<string, number>;
  browsers: Record<string, number>;
  operatingSystems: Record<string, number>;
  referrers: Record<string, number>;
}

export interface EngagementMetrics {
  playRate: number;
  pauseEvents: number;
  seekEvents: number;
  qualityChanges: number;
  volumeChanges: number;
  fullscreenUsage: number;
  socialShares: number;
  comments: number;
  likes: number;
}

export interface PerformanceMetrics {
  averageLoadTime: number;
  timeToFirstFrame: number;
  bufferingRatio: number;
  errorRate: number;
  qualityScore: number;
  stabilityScore: number;
}

// AI Processing API
export interface AIProcessingRequest {
  videoId: string;
  tasks: AITask[];
  priority: 'low' | 'normal' | 'high';
  callbackUrl?: string;
}

export interface AITask {
  type: AITaskType;
  parameters: Record<string, unknown>;
  timeRange?: {
    start: number;
    end: number;
  };
}

export type AITaskType = 
  | 'content_analysis'
  | 'thumbnail_generation'
  | 'caption_generation'
  | 'scene_detection'
  | 'object_detection'
  | 'face_detection'
  | 'sentiment_analysis'
  | 'quality_optimization';

export interface AIProcessingResponse {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  results?: AIProcessingResult[];
  error?: string;
  estimatedCompletion?: number;
}

export interface AIProcessingResult {
  taskType: AITaskType;
  data: unknown;
  confidence: number;
  processingTime: number;
  metadata: Record<string, unknown>;
}

// CDN API
export interface CDNRequest {
  action: 'purge' | 'warm' | 'status';
  urls: string[];
  recursive?: boolean;
  priority?: 'low' | 'normal' | 'high';
}

export interface CDNResponse {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  affectedUrls: string[];
  statistics: CDNStatistics;
}

export interface CDNStatistics {
  hitRatio: number;
  bandwidth: number;
  requests: number;
  errors: number;
  avgResponseTime: number;
}

// Webhook API
export interface WebhookEvent {
  id: string;
  type: string;
  data: unknown;
  timestamp: number;
  signature: string;
}

export interface WebhookSubscription {
  id: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
  createdAt: number;
}

// TODO: Add more API types as services are developed
// - LiveStreamingAPI
// - PaymentAPI
// - ModeratedAPI
// - SocialAPI
