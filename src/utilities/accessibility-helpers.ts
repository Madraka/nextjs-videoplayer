/**
 * Accessibility Helper Utilities
 * Provides accessibility features and ARIA support for video player
 */

export interface AccessibilityOptions {
  announcePlayState: boolean;
  announceTimeUpdates: boolean;
  announceVolumeChanges: boolean;
  announceQualityChanges: boolean;
  keyboardNavigation: boolean;
  screenReaderSupport: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
}

/**
 * Accessibility manager for video player
 */
export class AccessibilityManager {
  private options: AccessibilityOptions;
  private announcer: HTMLElement | null = null;

  constructor(options: Partial<AccessibilityOptions> = {}) {
    this.options = {
      announcePlayState: true,
      announceTimeUpdates: false,
      announceVolumeChanges: true,
      announceQualityChanges: true,
      keyboardNavigation: true,
      screenReaderSupport: true,
      highContrast: false,
      reducedMotion: false,
      ...options
    };
    
    this.setupAnnouncer();
    this.detectUserPreferences();
  }

  /**
   * Setup screen reader announcer
   */
  private setupAnnouncer(): void {
    // TODO: Implement screen reader announcer
    // - Create ARIA live region
    // - Handle polite vs assertive announcements
    
    if (typeof document === 'undefined') return;
    
    this.announcer = document.createElement('div');
    this.announcer.setAttribute('aria-live', 'polite');
    this.announcer.setAttribute('aria-atomic', 'true');
    this.announcer.setAttribute('class', 'sr-only');
    this.announcer.style.cssText = `
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
    `;
    
    document.body.appendChild(this.announcer);
  }

  /**
   * Detect user accessibility preferences
   */
  private detectUserPreferences(): void {
    // TODO: Implement preference detection
    // - Check prefers-reduced-motion
    // - Check prefers-contrast
    // - Check screen reader presence
    
    if (typeof window === 'undefined') return;
    
    // Detect reduced motion preference
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.options.reducedMotion = reducedMotion.matches;
    
    // Detect high contrast preference
    const highContrast = window.matchMedia('(prefers-contrast: high)');
    this.options.highContrast = highContrast.matches;
    
    // Listen for preference changes
    reducedMotion.addEventListener('change', (e) => {
      this.options.reducedMotion = e.matches;
    });
    
    highContrast.addEventListener('change', (e) => {
      this.options.highContrast = e.matches;
    });
  }

  /**
   * Announce message to screen readers
   */
  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    // TODO: Implement screen reader announcements
    // - Handle different priority levels
    // - Debounce rapid announcements
    
    if (!this.options.screenReaderSupport || !this.announcer) return;
    
    this.announcer.setAttribute('aria-live', priority);
    this.announcer.textContent = message;
    
    // Clear after announcement to allow re-announcement of same message
    setTimeout(() => {
      if (this.announcer) {
        this.announcer.textContent = '';
      }
    }, 1000);
  }

  /**
   * Announce play state changes
   */
  announcePlayState(isPlaying: boolean): void {
    if (!this.options.announcePlayState) return;
    
    const message = isPlaying ? 'Video playing' : 'Video paused';
    this.announce(message);
  }

  /**
   * Announce time updates
   */
  announceTimeUpdate(currentTime: number, duration: number): void {
    if (!this.options.announceTimeUpdates) return;
    
    const current = this.formatTime(currentTime);
    const total = this.formatTime(duration);
    const message = `${current} of ${total}`;
    
    this.announce(message);
  }

  /**
   * Announce volume changes
   */
  announceVolumeChange(volume: number, muted: boolean): void {
    if (!this.options.announceVolumeChanges) return;
    
    const message = muted 
      ? 'Volume muted' 
      : `Volume ${Math.round(volume * 100)} percent`;
    
    this.announce(message);
  }

  /**
   * Announce quality changes
   */
  announceQualityChange(quality: string): void {
    if (!this.options.announceQualityChanges) return;
    
    const message = `Video quality changed to ${quality}`;
    this.announce(message);
  }

  /**
   * Format time for accessibility
   */
  private formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours} hours, ${minutes} minutes, ${secs} seconds`;
    } else {
      return `${minutes} minutes, ${secs} seconds`;
    }
  }

  /**
   * Setup keyboard navigation
   */
  setupKeyboardNavigation(element: HTMLElement): void {
    // TODO: Implement keyboard navigation
    // - Handle arrow keys for seeking
    // - Space for play/pause
    // - M for mute
    // - F for fullscreen
    
    if (!this.options.keyboardNavigation) return;
    
    element.addEventListener('keydown', (event) => {
      switch (event.key) {
        case ' ':
          event.preventDefault();
          this.announce('Space key pressed - play/pause');
          break;
        case 'ArrowLeft':
          event.preventDefault();
          this.announce('Seeking backward');
          break;
        case 'ArrowRight':
          event.preventDefault();
          this.announce('Seeking forward');
          break;
        case 'ArrowUp':
          event.preventDefault();
          this.announce('Volume up');
          break;
        case 'ArrowDown':
          event.preventDefault();
          this.announce('Volume down');
          break;
        case 'm':
        case 'M':
          event.preventDefault();
          this.announce('Mute toggle');
          break;
        case 'f':
        case 'F':
          event.preventDefault();
          this.announce('Fullscreen toggle');
          break;
      }
    });
  }

  /**
   * Add ARIA attributes to video element
   */
  setupVideoAccessibility(videoElement: HTMLVideoElement): void {
    // TODO: Implement video ARIA setup
    // - Add appropriate roles and labels
    // - Handle focus management
    
    videoElement.setAttribute('role', 'application');
    videoElement.setAttribute('aria-label', 'Video player');
    videoElement.setAttribute('tabindex', '0');
    
    // Add live region for time updates
    videoElement.setAttribute('aria-live', 'off'); // We handle announcements manually
    videoElement.setAttribute('aria-describedby', 'video-description');
  }

  /**
   * Create accessible button
   */
  createAccessibleButton(
    text: string,
    ariaLabel: string,
    onClick: () => void
  ): HTMLButtonElement {
    // TODO: Implement accessible button creation
    // - Add proper ARIA attributes
    // - Handle keyboard interaction
    
    const button = document.createElement('button');
    button.textContent = text;
    button.setAttribute('aria-label', ariaLabel);
    button.setAttribute('type', 'button');
    button.addEventListener('click', onClick);
    
    return button;
  }

  /**
   * Check if screen reader is present
   */
  isScreenReaderPresent(): boolean {
    // TODO: Implement screen reader detection
    // - Check for NVDA, JAWS, VoiceOver indicators
    // - Use heuristics for detection
    
    if (typeof navigator === 'undefined') return false;
    
    // Basic heuristic: check for screen reader user agents
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes('nvda') || 
           userAgent.includes('jaws') || 
           userAgent.includes('serotek') ||
           userAgent.includes('freedomscientific');
  }

  /**
   * Update accessibility options
   */
  updateOptions(newOptions: Partial<AccessibilityOptions>): void {
    this.options = { ...this.options, ...newOptions };
  }

  /**
   * Get current accessibility options
   */
  getOptions(): AccessibilityOptions {
    return { ...this.options };
  }

  /**
   * Cleanup accessibility manager
   */
  dispose(): void {
    if (this.announcer && this.announcer.parentNode) {
      this.announcer.parentNode.removeChild(this.announcer);
    }
    this.announcer = null;
  }
}

/**
 * Create focus trap for modal dialogs
 */
export function createFocusTrap(element: HTMLElement): () => void {
  // TODO: Implement focus trap
  // - Find focusable elements
  // - Handle Tab and Shift+Tab
  // - Return cleanup function
  
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
  
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;
    
    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };
  
  element.addEventListener('keydown', handleKeyDown);
  
  // Focus first element
  if (firstElement) {
    firstElement.focus();
  }
  
  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Default accessibility manager instance
 */
export const accessibility = new AccessibilityManager();
