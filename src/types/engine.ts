/**
 * Video Engine Types
 * Core types and interfaces for the video engine system
 */

export interface VideoFormat {
  type: 'hls' | 'dash' | 'mp4' | 'webm' | 'ogv' | 'webrtc';
  codec?: string;
  container?: string;
  mimeType: string;
}

export interface QualityLevel {
  id: string;
  label: string;
  width: number;
  height: number;
  bitrate: number;
  frameRate?: number;
}

export interface StreamingQuality {
  auto: boolean;
  levels: QualityLevel[];
  currentLevel?: QualityLevel;
  adaptiveBitrate: boolean;
}

export type ErrorType = 
  | 'NETWORK_ERROR'
  | 'MEDIA_ERROR' 
  | 'DECODE_ERROR'
  | 'FORMAT_ERROR'
  | 'CAPABILITY_ERROR'
  | 'UNKNOWN_ERROR';

export interface VideoError {
  type: ErrorType;
  code: string;
  message: string;
  details?: unknown;
  recoverable: boolean;
  timestamp: number;
}

export interface EngineMetrics {
  bufferHealth: number;
  droppedFrames: number;
  currentBitrate: number;
  networkSpeed: number;
  latency: number;
  rebuffering: boolean;
}

export interface PlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  isBuffering: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  playbackRate: number;
}

export interface VideoEngineOptions {
  enableAdaptiveBitrate: boolean;
  enableDebugLogs: boolean;
  maxBufferSize: number;
  maxRetries: number;
  retryDelay: number;
  preferNativeHls: boolean;
  enableWorkerMode: boolean;
}
