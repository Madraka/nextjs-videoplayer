import type { BrowserCapabilities } from '@/core/compatibility';

export interface VideoEnginePluginContext {
  videoElement: HTMLVideoElement;
}

export interface VideoEnginePluginLoadPayload {
  src: string;
  strategy: string;
  capabilities: BrowserCapabilities;
}

export interface VideoEnginePluginErrorPayload {
  src?: string;
  strategy?: string;
  error: Error;
}

export interface VideoEnginePluginSourceLoadFailedPayload {
  src: string;
  strategy: string;
  error: Error;
  attempt: number;
  totalAttempts: number;
}

export interface VideoEnginePluginTimeUpdatePayload {
  currentTime: number;
  duration: number;
}

export interface VideoEnginePluginVolumePayload {
  volume: number;
  muted: boolean;
}

export interface VideoEnginePlugin {
  readonly name: string;
  setup?(context: VideoEnginePluginContext): void;
  onInit?(): void;
  onSourceLoadStart?(payload: VideoEnginePluginLoadPayload): void;
  onSourceLoaded?(payload: VideoEnginePluginLoadPayload): void;
  onSourceLoadFailed?(payload: VideoEnginePluginSourceLoadFailedPayload): void;
  onPlay?(): void;
  onPause?(): void;
  onTimeUpdate?(payload: VideoEnginePluginTimeUpdatePayload): void;
  onVolumeChange?(payload: VideoEnginePluginVolumePayload): void;
  onQualityChange?(quality: string): void;
  onError?(payload: VideoEnginePluginErrorPayload): void;
  onDispose?(): void;
}
