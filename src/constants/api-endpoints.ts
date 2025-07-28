/**
 * API Endpoint Constants
 * Defines all backend API endpoints used by the video player
 */

/**
 * Base API configuration
 */
export const API_BASE = {
  VERSION: 'v1',
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000 // 1 second
} as const;

/**
 * Authentication endpoints
 */
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  VERIFY: '/auth/verify',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  CHANGE_PASSWORD: '/auth/change-password'
} as const;

/**
 * Video content endpoints
 */
export const VIDEO_ENDPOINTS = {
  UPLOAD: '/videos/upload',
  LIST: '/videos',
  GET: '/videos/:id',
  UPDATE: '/videos/:id',
  DELETE: '/videos/:id',
  METADATA: '/videos/:id/metadata',
  STREAM: '/videos/:id/stream',
  DOWNLOAD: '/videos/:id/download',
  THUMBNAIL: '/videos/:id/thumbnail',
  PREVIEW: '/videos/:id/preview'
} as const;

/**
 * Streaming endpoints
 */
export const STREAMING_ENDPOINTS = {
  HLS_MANIFEST: '/stream/hls/:id/playlist.m3u8',
  HLS_SEGMENT: '/stream/hls/:id/segment/:segment',
  DASH_MANIFEST: '/stream/dash/:id/manifest.mpd',
  DASH_SEGMENT: '/stream/dash/:id/:adaptation/:segment',
  THUMBNAIL_TRACK: '/stream/thumbnails/:id/track.vtt',
  SUBTITLE_TRACK: '/stream/subtitles/:id/:lang.vtt'
} as const;

/**
 * Analytics endpoints
 */
export const ANALYTICS_ENDPOINTS = {
  TRACK_EVENT: '/analytics/events',
  TRACK_PLAYBACK: '/analytics/playback',
  TRACK_PERFORMANCE: '/analytics/performance',
  TRACK_ERROR: '/analytics/errors',
  GET_STATS: '/analytics/stats/:id',
  GET_HEATMAP: '/analytics/heatmap/:id',
  EXPORT_DATA: '/analytics/export'
} as const;

/**
 * AI processing endpoints
 */
export const AI_ENDPOINTS = {
  ANALYZE_CONTENT: '/ai/analyze',
  GENERATE_THUMBNAILS: '/ai/thumbnails',
  GENERATE_CAPTIONS: '/ai/captions',
  OPTIMIZE_QUALITY: '/ai/optimize',
  DETECT_SCENES: '/ai/scenes',
  PREDICT_BANDWIDTH: '/ai/bandwidth',
  ENHANCE_ACCESSIBILITY: '/ai/accessibility',
  GET_RECOMMENDATIONS: '/ai/recommendations'
} as const;

/**
 * User management endpoints
 */
export const USER_ENDPOINTS = {
  PROFILE: '/users/profile',
  PREFERENCES: '/users/preferences',
  SETTINGS: '/users/settings',
  HISTORY: '/users/history',
  FAVORITES: '/users/favorites',
  PLAYLISTS: '/users/playlists',
  SUBSCRIPTIONS: '/users/subscriptions'
} as const;

/**
 * File management endpoints
 */
export const FILE_ENDPOINTS = {
  UPLOAD: '/files/upload',
  DOWNLOAD: '/files/:id/download',
  DELETE: '/files/:id',
  METADATA: '/files/:id/metadata',
  THUMBNAIL: '/files/:id/thumbnail',
  PROCESS: '/files/:id/process'
} as const;

/**
 * Subtitle endpoints
 */
export const SUBTITLE_ENDPOINTS = {
  UPLOAD: '/subtitles/upload',
  GENERATE: '/subtitles/generate',
  LIST: '/subtitles/:videoId',
  GET: '/subtitles/:id',
  UPDATE: '/subtitles/:id',
  DELETE: '/subtitles/:id',
  DOWNLOAD: '/subtitles/:id/download'
} as const;

/**
 * Thumbnail endpoints
 */
export const THUMBNAIL_ENDPOINTS = {
  GENERATE: '/thumbnails/generate',
  UPLOAD: '/thumbnails/upload',
  LIST: '/thumbnails/:videoId',
  GET: '/thumbnails/:id',
  DELETE: '/thumbnails/:id',
  SPRITE: '/thumbnails/:videoId/sprite'
} as const;

/**
 * Webhook endpoints
 */
export const WEBHOOK_ENDPOINTS = {
  VIDEO_UPLOADED: '/webhooks/video/uploaded',
  VIDEO_PROCESSED: '/webhooks/video/processed',
  VIDEO_FAILED: '/webhooks/video/failed',
  AI_COMPLETED: '/webhooks/ai/completed',
  AI_FAILED: '/webhooks/ai/failed',
  USER_REGISTERED: '/webhooks/user/registered',
  PAYMENT_COMPLETED: '/webhooks/payment/completed'
} as const;

/**
 * System endpoints
 */
export const SYSTEM_ENDPOINTS = {
  HEALTH: '/system/health',
  STATUS: '/system/status',
  METRICS: '/system/metrics',
  VERSION: '/system/version',
  CONFIG: '/system/config'
} as const;

/**
 * All API endpoints combined
 */
export const ALL_ENDPOINTS = {
  ...AUTH_ENDPOINTS,
  ...VIDEO_ENDPOINTS,
  ...STREAMING_ENDPOINTS,
  ...ANALYTICS_ENDPOINTS,
  ...AI_ENDPOINTS,
  ...USER_ENDPOINTS,
  ...FILE_ENDPOINTS,
  ...SUBTITLE_ENDPOINTS,
  ...THUMBNAIL_ENDPOINTS,
  ...WEBHOOK_ENDPOINTS,
  ...SYSTEM_ENDPOINTS
} as const;

/**
 * HTTP methods
 */
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  HEAD: 'HEAD',
  OPTIONS: 'OPTIONS'
} as const;

/**
 * HTTP status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503
} as const;
