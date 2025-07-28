/**
 * MIME Type Constants
 * Centralized MIME type definitions for video player
 */

/**
 * Video MIME types
 */
export const VIDEO_MIME_TYPES = {
  MP4: 'video/mp4',
  WEBM: 'video/webm',
  OGG: 'video/ogg',
  AVI: 'video/x-msvideo',
  MOV: 'video/quicktime',
  WMV: 'video/x-ms-wmv',
  FLV: 'video/x-flv',
  MKV: 'video/x-matroska',
  M3U8: 'application/vnd.apple.mpegurl',
  MPD: 'application/dash+xml',
  TS: 'video/mp2t'
} as const;

/**
 * Audio MIME types
 */
export const AUDIO_MIME_TYPES = {
  MP3: 'audio/mpeg',
  AAC: 'audio/aac',
  OGG: 'audio/ogg',
  WAV: 'audio/wav',
  FLAC: 'audio/flac',
  M4A: 'audio/mp4',
  WMA: 'audio/x-ms-wma'
} as const;

/**
 * Subtitle MIME types
 */
export const SUBTITLE_MIME_TYPES = {
  VTT: 'text/vtt',
  SRT: 'text/srt',
  TTML: 'application/ttml+xml',
  ASS: 'text/x-ass',
  SSA: 'text/x-ssa'
} as const;

/**
 * Image MIME types (for thumbnails)
 */
export const IMAGE_MIME_TYPES = {
  JPEG: 'image/jpeg',
  PNG: 'image/png',
  WEBP: 'image/webp',
  AVIF: 'image/avif',
  GIF: 'image/gif'
} as const;

/**
 * All MIME types combined
 */
export const ALL_MIME_TYPES = {
  ...VIDEO_MIME_TYPES,
  ...AUDIO_MIME_TYPES,
  ...SUBTITLE_MIME_TYPES,
  ...IMAGE_MIME_TYPES
} as const;
