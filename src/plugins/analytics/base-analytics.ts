/**
 * Base Analytics Plugin
 * 
 * Provides the foundation interface and common functionality for all analytics plugins.
 * This class defines the contract that all analytics plugins must implement.
 */

import { BasePlugin } from '../base-plugin';

/**
 * Analytics event data structure
 */
export interface AnalyticsEvent {
  /** Event type identifier */
  type: string;
  /** Timestamp when event occurred */
  timestamp: number;
  /** Event payload data */
  data: Record<string, any>;
  /** User session identifier */
  sessionId: string;
  /** Video identifier */
  videoId?: string;
}

/**
 * Performance metrics structure
 */
export interface PerformanceMetrics {
  /** Video load time in milliseconds */
  loadTime: number;
  /** Time to first frame in milliseconds */
  timeToFirstFrame: number;
  /** Buffer health percentage */
  bufferHealth: number;
  /** Current bitrate in bps */
  currentBitrate: number;
  /** Dropped frames count */
  droppedFrames: number;
  /** Average playback quality */
  averageQuality: string;
}

/**
 * Player behavior tracking data
 */
export interface PlayerBehaviorData {
  /** Total watch time in seconds */
  watchTime: number;
  /** Number of pause events */
  pauseCount: number;
  /** Number of seek events */
  seekCount: number;
  /** Volume changes count */
  volumeChanges: number;
  /** Quality changes count */
  qualityChanges: number;
  /** Fullscreen toggles count */
  fullscreenToggles: number;
}

/**
 * Custom event data structure
 */
export interface CustomEventData {
  /** Custom event name */
  eventName: string;
  /** Event properties */
  properties: Record<string, any>;
  /** Event context */
  context?: Record<string, any>;
}

/**
 * Analytics configuration
 */
export interface AnalyticsConfig {
  /** Enable/disable analytics tracking */
  enabled: boolean;
  /** Analytics provider endpoint */
  endpoint?: string;
  /** API key for analytics service */
  apiKey?: string;
  /** Sample rate (0-1) */
  sampleRate: number;
  /** Buffer events before sending */
  bufferEvents: boolean;
  /** Buffer size limit */
  bufferSize: number;
  /** Custom tracking parameters */
  customParams?: Record<string, any>;
}

/**
 * Base analytics plugin abstract class
 */
export abstract class BaseAnalyticsPlugin extends BasePlugin {
  protected config: AnalyticsConfig;
  protected eventBuffer: AnalyticsEvent[] = [];
  protected sessionId: string;

  constructor(config: AnalyticsConfig) {
    super(config);
    this.config = {
      ...config,
      enabled: config.enabled ?? true,
      sampleRate: config.sampleRate ?? 1.0,
      bufferEvents: config.bufferEvents ?? true,
      bufferSize: config.bufferSize ?? 50
    };
    this.sessionId = this.generateSessionId();
  }

  /**
   * Initialize the analytics plugin
   */
  public async initialize(): Promise<void> {
    if (!this.config.enabled) {
      return;
    }

    this.setupEventListeners();
    await this.initializeProvider();
  }

  /**
   * Track an analytics event
   */
  public trackEvent(type: string, data: Record<string, any>): void {
    if (!this.config.enabled || !this.shouldSample()) {
      return;
    }

    const event: AnalyticsEvent = {
      type,
      timestamp: Date.now(),
      data,
      sessionId: this.sessionId,
      videoId: this.getCurrentVideoId()
    };

    if (this.config.bufferEvents) {
      this.bufferEvent(event);
    } else {
      this.sendEvent(event);
    }
  }

  /**
   * Track performance metrics
   */
  public abstract trackPerformance(metrics: PerformanceMetrics): void;

  /**
   * Track player behavior
   */
  public abstract trackBehavior(behavior: PlayerBehaviorData): void;

  /**
   * Track custom events
   */
  public abstract trackCustomEvent(event: CustomEventData): void;

  /**
   * Flush buffered events
   */
  public async flushEvents(): Promise<void> {
    if (this.eventBuffer.length === 0) {
      return;
    }

    const events = [...this.eventBuffer];
    this.eventBuffer = [];

    await this.sendBatch(events);
  }

  /**
   * Setup event listeners for automatic tracking
   */
  protected abstract setupEventListeners(): void;

  /**
   * Initialize analytics provider
   */
  protected abstract initializeProvider(): Promise<void>;

  /**
   * Send individual event
   */
  protected abstract sendEvent(event: AnalyticsEvent): Promise<void>;

  /**
   * Send batch of events
   */
  protected abstract sendBatch(events: AnalyticsEvent[]): Promise<void>;

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Check if event should be sampled
   */
  private shouldSample(): boolean {
    return Math.random() < this.config.sampleRate;
  }

  /**
   * Buffer event for batch sending
   */
  private bufferEvent(event: AnalyticsEvent): void {
    this.eventBuffer.push(event);

    if (this.eventBuffer.length >= this.config.bufferSize) {
      this.flushEvents();
    }
  }

  /**
   * Get current video ID from player context
   */
  private getCurrentVideoId(): string | undefined {
    // This would be implemented to get video ID from player context
    // For now, return undefined as this would come from a player context provider
    return undefined;
  }

  /**
   * Cleanup on plugin destruction
   */
  public async destroy(): Promise<void> {
    await this.flushEvents();
    // Cleanup any remaining event listeners and resources
    this.eventListeners.clear();
  }
}
