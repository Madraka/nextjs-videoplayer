/**
 * Engine Implementation Types
 * Types specific to different engine implementations
 */

import type { VideoError, EngineMetrics, PlaybackState, QualityLevel } from '../../types';

export interface EngineInterface {
  initialize(): Promise<void>;
  load(src: string): Promise<void>;
  play(): Promise<void>;
  pause(): void;
  seek(time: number): void;
  setVolume(volume: number): void;
  setMuted(muted: boolean): void;
  setPlaybackRate(rate: number): void;
  destroy(): void;
  getMetrics(): EngineMetrics;
  getState(): PlaybackState;
  getQualityLevels?(): QualityLevel[];
  setQualityLevel?(levelId: string): void;
  setAutoQuality?(enabled: boolean): void;
}

export interface EngineEventHandlers {
  onReady?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onProgress?: (buffered: number) => void;
  onVolumeChange?: (volume: number, muted: boolean) => void;
  onQualityChange?: (quality: string) => void;
  onError?: (error: VideoError) => void;
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
  onBuffering?: (isBuffering: boolean) => void;
  onMetricsUpdate?: (metrics: EngineMetrics) => void;
}

export interface EngineState {
  isInitialized: boolean;
  isLoading: boolean;
  hasError: boolean;
  lastError?: VideoError;
  currentSrc?: string;
  engineType: string;
}

// HLS Engine specific types
export interface HlsEngineConfig {
  enableWorkerMode: boolean;
  maxBufferLength: number;
  maxMaxBufferLength: number;
  startLevel: number;
  capLevelToPlayerSize: boolean;
  debug: boolean;
}

// DASH Engine specific types
export interface DashEngineConfig {
  streaming: {
    bufferTimeAtTopQuality: number;
    bufferTimeAtTopQualityLongForm: number;
    fastSwitchEnabled: boolean;
  };
  debug: {
    logLevel: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  };
}

// Native Engine specific types
export interface NativeEngineConfig {
  preload: 'none' | 'metadata' | 'auto';
  crossOrigin?: 'anonymous' | 'use-credentials';
  disableRemotePlayback: boolean;
}

// Progressive Engine specific types
export interface ProgressiveEngineConfig {
  enableRangeRequests: boolean;
  chunkSize: number;
  maxConcurrentRequests: number;
}

// WebRTC Engine specific types
export interface WebRtcEngineConfig {
  iceServers: RTCIceServer[];
  enableAudio: boolean;
  enableVideo: boolean;
  maxBitrate?: number;
}
