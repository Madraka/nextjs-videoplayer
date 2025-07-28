/**
 * Screen Reader Support Plugin
 * 
 * Provides enhanced accessibility support for screen readers and assistive technologies.
 * This plugin ensures video content is accessible to users with visual impairments.
 */

import { BasePlugin } from '../base-plugin';

/**
 * Screen reader configuration
 */
export interface ScreenReaderConfig {
  /** Enable/disable screen reader support */
  enabled: boolean;
  /** Announce video events */
  announceEvents: boolean;
  /** Announce playback state changes */
  announcePlayback: boolean;
  /** Announce buffering status */
  announceBuffering: boolean;
  /** Announce time updates interval in seconds */
  timeUpdateInterval: number;
  /** Custom announcements */
  customAnnouncements?: Record<string, string>;
}

/**
 * Screen reader plugin implementation
 */
export class ScreenReaderPlugin extends BasePlugin {
  public readonly id = 'screen-reader';
  public readonly name = 'Screen Reader Support';
  public readonly version = '1.0.0';
  public readonly type = 'accessibility';

  private screenReaderConfig: ScreenReaderConfig;
  private ariaLiveRegion?: HTMLElement;
  private lastTimeAnnouncement: number = 0;

  constructor(config: ScreenReaderConfig) {
    super(config);
    this.screenReaderConfig = {
      ...config,
      enabled: config.enabled ?? true,
      announceEvents: config.announceEvents ?? true,
      announcePlayback: config.announcePlayback ?? true,
      announceBuffering: config.announceBuffering ?? true,
      timeUpdateInterval: config.timeUpdateInterval ?? 30 // 30 seconds
    };
  }

  /**
   * Initialize screen reader support
   */
  public async initialize(): Promise<void> {
    if (!this.screenReaderConfig.enabled) {
      return;
    }

    this.createAriaLiveRegion();
    this.setupEventListeners();
    this.isInitialized = true;
  }

  /**
   * Setup event listeners for screen reader announcements
   */
  private setupEventListeners(): void {
    if (this.screenReaderConfig.announcePlayback) {
      this.setupPlaybackAnnouncements();
    }

    if (this.screenReaderConfig.announceBuffering) {
      this.setupBufferingAnnouncements();
    }

    if (this.screenReaderConfig.announceEvents) {
      this.setupEventAnnouncements();
    }
  }

  /**
   * Create ARIA live region for announcements
   */
  private createAriaLiveRegion(): void {
    this.ariaLiveRegion = document.createElement('div');
    this.ariaLiveRegion.setAttribute('aria-live', 'polite');
    this.ariaLiveRegion.setAttribute('aria-atomic', 'true');
    this.ariaLiveRegion.style.position = 'absolute';
    this.ariaLiveRegion.style.left = '-10000px';
    this.ariaLiveRegion.style.width = '1px';
    this.ariaLiveRegion.style.height = '1px';
    this.ariaLiveRegion.style.overflow = 'hidden';
    
    document.body.appendChild(this.ariaLiveRegion);
  }

  /**
   * Setup playback announcements
   */
  private setupPlaybackAnnouncements(): void {
    this.on('player:play', () => {
      this.announce('Video playing');
    });

    this.on('player:pause', () => {
      this.announce('Video paused');
    });

    this.on('player:ended', () => {
      this.announce('Video ended');
    });

    this.on('player:timeupdate', (data: { currentTime: number; duration: number }) => {
      this.handleTimeUpdate(data.currentTime, data.duration);
    });

    this.on('player:seeked', (data: { currentTime: number }) => {
      const timeString = this.formatTime(data.currentTime);
      this.announce(`Seeked to ${timeString}`);
    });
  }

  /**
   * Setup buffering announcements
   */
  private setupBufferingAnnouncements(): void {
    this.on('player:waiting', () => {
      this.announce('Video buffering');
    });

    this.on('player:canplaythrough', () => {
      this.announce('Video ready to play');
    });

    this.on('player:stalled', () => {
      this.announce('Video playback stalled');
    });
  }

  /**
   * Setup general event announcements
   */
  private setupEventAnnouncements(): void {
    this.on('player:volumechange', (data: { volume: number; muted: boolean }) => {
      if (data.muted) {
        this.announce('Video muted');
      } else {
        this.announce(`Volume ${Math.round(data.volume * 100)} percent`);
      }
    });

    this.on('player:fullscreenchange', (data: { isFullscreen: boolean }) => {
      this.announce(data.isFullscreen ? 'Entered fullscreen' : 'Exited fullscreen');
    });

    this.on('player:qualitychange', (data: { quality: string }) => {
      this.announce(`Video quality changed to ${data.quality}`);
    });

    this.on('player:error', (data: { message: string }) => {
      this.announce(`Video error: ${data.message}`);
    });
  }

  /**
   * Handle time updates for periodic announcements
   */
  private handleTimeUpdate(currentTime: number, duration: number): void {
    const intervalSeconds = this.screenReaderConfig.timeUpdateInterval;
    
    if (currentTime - this.lastTimeAnnouncement >= intervalSeconds) {
      const currentTimeString = this.formatTime(currentTime);
      const durationString = this.formatTime(duration);
      const progressPercent = Math.round((currentTime / duration) * 100);
      
      this.announce(`${currentTimeString} of ${durationString}, ${progressPercent} percent complete`);
      this.lastTimeAnnouncement = currentTime;
    }
  }

  /**
   * Announce message to screen readers
   */
  public announce(message: string): void {
    if (!this.ariaLiveRegion || !this.screenReaderConfig.enabled) {
      return;
    }

    // Check for custom announcements
    const customMessage = this.screenReaderConfig.customAnnouncements?.[message];
    const finalMessage = customMessage || message;

    // Clear and set new message
    this.ariaLiveRegion.textContent = '';
    setTimeout(() => {
      if (this.ariaLiveRegion) {
        this.ariaLiveRegion.textContent = finalMessage;
      }
    }, 100);
  }

  /**
   * Set custom announcement for a specific event
   */
  public setCustomAnnouncement(event: string, message: string): void {
    if (!this.screenReaderConfig.customAnnouncements) {
      this.screenReaderConfig.customAnnouncements = {};
    }
    this.screenReaderConfig.customAnnouncements[event] = message;
  }

  /**
   * Format time for announcements
   */
  private formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''}, ${minutes} minute${minutes !== 1 ? 's' : ''}, ${secs} second${secs !== 1 ? 's' : ''}`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}, ${secs} second${secs !== 1 ? 's' : ''}`;
    } else {
      return `${secs} second${secs !== 1 ? 's' : ''}`;
    }
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<ScreenReaderConfig>): void {
    this.screenReaderConfig = { ...this.screenReaderConfig, ...newConfig };
    
    if (this.isInitialized) {
      this.onConfigUpdate(newConfig);
    }
  }

  /**
   * Cleanup on destroy
   */
  public async destroy(): Promise<void> {
    if (this.ariaLiveRegion) {
      document.body.removeChild(this.ariaLiveRegion);
      this.ariaLiveRegion = undefined;
    }
    
    this.eventListeners.clear();
  }
}
