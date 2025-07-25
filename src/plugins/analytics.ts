/**
 * Analytics plugin for video player
 * Tracks video events and sends analytics data
 */

export interface AnalyticsConfig {
  enabled: boolean;
  trackingId?: string;
  apiEndpoint?: string;
  events?: {
    play?: boolean;
    pause?: boolean;
    seek?: boolean;
    complete?: boolean;
    error?: boolean;
  };
}

export interface AnalyticsEvent {
  type: string;
  timestamp: number;
  videoSrc: string;
  currentTime?: number;
  duration?: number;
  error?: string;
  metadata?: Record<string, any>;
}

export class AnalyticsPlugin {
  private config: AnalyticsConfig;
  private events: AnalyticsEvent[] = [];
  private sessionId: string;
  private startTime: number;

  constructor(config: AnalyticsConfig) {
    this.config = {
      events: {
        play: true,
        pause: true,
        seek: true,
        complete: true,
        error: true,
      },
      ...config,
    };
    
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
  }

  init(player: any) {
    if (!this.config.enabled) return;

    const { engine, state, controls } = player;

    // Track play events
    if (this.config.events?.play) {
      this.trackEvent('play');
    }

    // Track pause events
    if (this.config.events?.pause) {
      this.trackEvent('pause');
    }

    // Track seek events
    if (this.config.events?.seek) {
      this.trackEvent('seek', {
        seekTo: state.currentTime,
      });
    }

    // Track completion
    if (this.config.events?.complete) {
      // Check if video is near the end (within 2 seconds)
      if (state.currentTime > 0 && state.duration - state.currentTime < 2) {
        this.trackEvent('complete', {
          watchTime: state.currentTime,
          completion: (state.currentTime / state.duration) * 100,
        });
      }
    }

    // Track errors
    if (this.config.events?.error && state.error) {
      this.trackEvent('error', {
        error: state.error,
      });
    }

    console.log('Analytics plugin initialized:', this.sessionId);
  }

  private trackEvent(type: string, metadata?: Record<string, any>) {
    const event: AnalyticsEvent = {
      type,
      timestamp: Date.now(),
      videoSrc: window.location.href, // You might want to pass the actual video src
      metadata: {
        sessionId: this.sessionId,
        sessionDuration: Date.now() - this.startTime,
        userAgent: navigator.userAgent,
        ...metadata,
      },
    };

    this.events.push(event);
    
    // Send immediately or batch
    if (this.config.apiEndpoint) {
      this.sendEvent(event);
    }

    console.log('Analytics event:', event);
  }

  private async sendEvent(event: AnalyticsEvent) {
    try {
      await fetch(this.config.apiEndpoint!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.warn('Failed to send analytics event:', error);
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  clearEvents(): void {
    this.events = [];
  }
}

/**
 * Factory function to create analytics plugin
 */
export const createAnalyticsPlugin = (config: AnalyticsConfig) => {
  const analytics = new AnalyticsPlugin(config);
  
  return (player: any) => {
    analytics.init(player);
  };
};
