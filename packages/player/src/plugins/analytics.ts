/**
 * Analytics plugin for video engine lifecycle events.
 */

import type {
  VideoEnginePlugin,
  VideoEnginePluginErrorPayload,
  VideoEnginePluginLoadPayload,
  VideoEnginePluginTimeUpdatePayload,
} from '@/core/plugins/types';
import { getPlayerLogger } from '@/lib/logger';

export interface AnalyticsConfig {
  enabled: boolean;
  apiEndpoint?: string;
  sampleRate?: number;
  events?: {
    play?: boolean;
    pause?: boolean;
    seek?: boolean;
    complete?: boolean;
    error?: boolean;
    source?: boolean;
  };
}

export interface AnalyticsEvent {
  type: string;
  timestamp: number;
  source?: string;
  strategy?: string;
  currentTime?: number;
  duration?: number;
  error?: string;
  metadata?: Record<string, unknown>;
}

export class AnalyticsPlugin implements VideoEnginePlugin {
  readonly name = 'analytics';

  private readonly config: AnalyticsConfig;
  private readonly events: AnalyticsEvent[] = [];
  private readonly sessionId: string;
  private lastTimeUpdate?: VideoEnginePluginTimeUpdatePayload;
  private lastSource?: VideoEnginePluginLoadPayload;

  constructor(config: AnalyticsConfig) {
    this.config = {
      sampleRate: 1,
      events: {
        play: true,
        pause: true,
        seek: true,
        complete: true,
        error: true,
        source: true,
      },
      ...config,
    };

    this.sessionId = this.generateSessionId();
  }

  onSourceLoadStart(payload: VideoEnginePluginLoadPayload): void {
    this.lastSource = payload;
    if (this.config.events?.source) {
      this.track('source_load_start', {
        src: payload.src,
        strategy: payload.strategy,
      });
    }
  }

  onSourceLoaded(payload: VideoEnginePluginLoadPayload): void {
    this.lastSource = payload;
    if (this.config.events?.source) {
      this.track('source_loaded', {
        src: payload.src,
        strategy: payload.strategy,
      });
    }
  }

  onPlay(): void {
    if (this.config.events?.play) {
      this.track('play');
    }
  }

  onPause(): void {
    if (this.config.events?.pause) {
      this.track('pause');
    }
  }

  onTimeUpdate(payload: VideoEnginePluginTimeUpdatePayload): void {
    if (this.lastTimeUpdate && this.config.events?.seek) {
      const delta = Math.abs(payload.currentTime - this.lastTimeUpdate.currentTime);
      if (delta > 5) {
        this.track('seek', {
          currentTime: payload.currentTime,
          duration: payload.duration,
        });
      }
    }

    if (this.config.events?.complete && payload.duration > 0 && payload.currentTime / payload.duration >= 0.98) {
      this.track('complete', {
        currentTime: payload.currentTime,
        duration: payload.duration,
      });
    }

    this.lastTimeUpdate = payload;
  }

  onError(payload: VideoEnginePluginErrorPayload): void {
    if (this.config.events?.error) {
      this.track('error', {
        src: payload.src,
        strategy: payload.strategy,
        error: payload.error.message,
      });
    }
  }

  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  clearEvents(): void {
    this.events.length = 0;
  }

  private track(type: string, metadata?: Record<string, unknown>): void {
    if (!this.config.enabled) {
      return;
    }

    if (Math.random() > (this.config.sampleRate ?? 1)) {
      return;
    }

    const event: AnalyticsEvent = {
      type,
      timestamp: Date.now(),
      source: this.lastSource?.src,
      strategy: this.lastSource?.strategy,
      currentTime: this.lastTimeUpdate?.currentTime,
      duration: this.lastTimeUpdate?.duration,
      metadata: {
        sessionId: this.sessionId,
        ...metadata,
      },
    };

    this.events.push(event);

    if (this.config.apiEndpoint) {
      this.sendEvent(event);
    }
  }

  private async sendEvent(event: AnalyticsEvent): Promise<void> {
    try {
      await fetch(this.config.apiEndpoint as string, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
    } catch (error) {
      getPlayerLogger().warn('Failed to send analytics event:', error);
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  }
}

export const createAnalyticsPlugin = (config: AnalyticsConfig): VideoEnginePlugin => {
  return new AnalyticsPlugin(config);
};
