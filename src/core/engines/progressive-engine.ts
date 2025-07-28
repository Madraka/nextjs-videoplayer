/**
 * Progressive Engine Implementation  
 * Handles progressive download for MP4, WebM files
 */

import type { 
  EngineInterface, 
  EngineEventHandlers, 
  EngineState, 
  ProgressiveEngineConfig 
} from './types';
import type { 
  EngineMetrics, 
  PlaybackState, 
  VideoError, 
  QualityLevel 
} from '../../types';

export class ProgressiveEngine implements EngineInterface {
  private videoElement: HTMLVideoElement;
  private config: ProgressiveEngineConfig;
  private eventHandlers: EngineEventHandlers;
  private state: EngineState;
  private metrics: EngineMetrics;

  constructor(
    videoElement: HTMLVideoElement,
    config: Partial<ProgressiveEngineConfig> = {},
    eventHandlers: EngineEventHandlers = {}
  ) {
    this.videoElement = videoElement;
    this.eventHandlers = eventHandlers;
    
    this.config = {
      enableRangeRequests: true,
      chunkSize: 1024 * 1024, // 1MB chunks
      maxConcurrentRequests: 3,
      ...config
    };

    this.state = {
      isInitialized: false,
      isLoading: false,
      hasError: false,
      engineType: 'progressive'
    };

    this.metrics = {
      bufferHealth: 0,
      droppedFrames: 0,
      currentBitrate: 0,
      networkSpeed: 0,
      latency: 0,
      rebuffering: false
    };
  }

  async initialize(): Promise<void> {
    this.state.isInitialized = true;
    if (this.eventHandlers.onReady) {
      this.eventHandlers.onReady();
    }
  }

  async load(src: string): Promise<void> {
    this.state.isLoading = true;
    this.state.currentSrc = src;
    
    if (this.eventHandlers.onLoadStart) {
      this.eventHandlers.onLoadStart();
    }

    this.videoElement.src = src;
    this.videoElement.load();

    this.state.isLoading = false;
    if (this.eventHandlers.onLoadEnd) {
      this.eventHandlers.onLoadEnd();
    }
  }

  async play(): Promise<void> {
    await this.videoElement.play();
  }

  pause(): void {
    this.videoElement.pause();
  }

  seek(time: number): void {
    this.videoElement.currentTime = time;
  }

  setVolume(volume: number): void {
    this.videoElement.volume = Math.max(0, Math.min(1, volume));
  }

  setMuted(muted: boolean): void {
    this.videoElement.muted = muted;
  }

  setPlaybackRate(rate: number): void {
    this.videoElement.playbackRate = rate;
  }

  getMetrics(): EngineMetrics {
    return { ...this.metrics };
  }

  getState(): PlaybackState {
    return {
      isPlaying: !this.videoElement.paused && !this.videoElement.ended,
      isPaused: this.videoElement.paused,
      isBuffering: this.videoElement.readyState < 3,
      currentTime: this.videoElement.currentTime,
      duration: this.videoElement.duration || 0,
      volume: this.videoElement.volume,
      muted: this.videoElement.muted,
      playbackRate: this.videoElement.playbackRate
    };
  }

  destroy(): void {
    this.state.isInitialized = false;
  }
}
