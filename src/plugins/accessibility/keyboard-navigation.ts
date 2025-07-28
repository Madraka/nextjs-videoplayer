/**
 * Keyboard Navigation Plugin
 * 
 * Provides comprehensive keyboard accessibility for video player controls.
 * This plugin ensures the video player is fully accessible via keyboard navigation.
 */

import { BasePlugin } from '../base-plugin';

/**
 * Keyboard shortcut definition
 */
export interface KeyboardShortcut {
  /** Key combination (e.g., 'Space', 'ArrowLeft', 'Ctrl+F') */
  keys: string;
  /** Action to perform */
  action: string;
  /** Description for accessibility */
  description: string;
  /** Whether to prevent default browser behavior */
  preventDefault?: boolean;
  /** Modifier keys required */
  modifiers?: {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
  };
}

/**
 * Keyboard navigation configuration
 */
export interface KeyboardNavigationConfig {
  /** Enable/disable keyboard navigation */
  enabled: boolean;
  /** Custom keyboard shortcuts */
  customShortcuts?: KeyboardShortcut[];
  /** Focus management */
  focusManagement: boolean;
  /** Visual focus indicators */
  showFocusIndicators: boolean;
  /** Tab navigation within player */
  enableTabNavigation: boolean;
  /** Announce keyboard shortcuts */
  announceShortcuts: boolean;
}

/**
 * Keyboard navigation plugin implementation
 */
export class KeyboardNavigationPlugin extends BasePlugin {
  public readonly id = 'keyboard-navigation';
  public readonly name = 'Keyboard Navigation';
  public readonly version = '1.0.0';
  public readonly type = 'accessibility';

  private keyboardConfig: KeyboardNavigationConfig;
  private shortcuts: Map<string, KeyboardShortcut> = new Map();
  private focusableElements: HTMLElement[] = [];
  private currentFocusIndex: number = -1;

  constructor(config: KeyboardNavigationConfig) {
    super(config);
    this.keyboardConfig = {
      ...config,
      enabled: config.enabled ?? true,
      focusManagement: config.focusManagement ?? true,
      showFocusIndicators: config.showFocusIndicators ?? true,
      enableTabNavigation: config.enableTabNavigation ?? true,
      announceShortcuts: config.announceShortcuts ?? true
    };
    
    this.setupDefaultShortcuts();
    this.setupCustomShortcuts();
  }

  /**
   * Initialize keyboard navigation
   */
  public async initialize(): Promise<void> {
    if (!this.keyboardConfig.enabled) {
      return;
    }

    this.setupEventListeners();
    this.setupFocusManagement();
    this.addAccessibilityAttributes();
    
    this.isInitialized = true;
  }

  /**
   * Setup default keyboard shortcuts
   */
  private setupDefaultShortcuts(): void {
    const defaultShortcuts: KeyboardShortcut[] = [
      {
        keys: 'Space',
        action: 'toggle-play',
        description: 'Play or pause video',
        preventDefault: true
      },
      {
        keys: 'ArrowLeft',
        action: 'seek-backward',
        description: 'Seek backward 10 seconds',
        preventDefault: true
      },
      {
        keys: 'ArrowRight',
        action: 'seek-forward',
        description: 'Seek forward 10 seconds',
        preventDefault: true
      },
      {
        keys: 'ArrowUp',
        action: 'volume-up',
        description: 'Increase volume',
        preventDefault: true
      },
      {
        keys: 'ArrowDown',
        action: 'volume-down',
        description: 'Decrease volume',
        preventDefault: true
      },
      {
        keys: 'KeyM',
        action: 'toggle-mute',
        description: 'Mute or unmute audio',
        preventDefault: true
      },
      {
        keys: 'KeyF',
        action: 'toggle-fullscreen',
        description: 'Enter or exit fullscreen',
        preventDefault: true
      },
      {
        keys: 'KeyC',
        action: 'toggle-captions',
        description: 'Toggle captions on/off',
        preventDefault: true
      },
      {
        keys: 'Escape',
        action: 'exit-fullscreen',
        description: 'Exit fullscreen mode',
        preventDefault: true
      },
      {
        keys: 'Home',
        action: 'seek-start',
        description: 'Seek to beginning',
        preventDefault: true
      },
      {
        keys: 'End',
        action: 'seek-end',
        description: 'Seek to end',
        preventDefault: true
      }
    ];

    defaultShortcuts.forEach(shortcut => {
      this.shortcuts.set(shortcut.keys, shortcut);
    });
  }

  /**
   * Setup custom keyboard shortcuts
   */
  private setupCustomShortcuts(): void {
    if (this.keyboardConfig.customShortcuts) {
      this.keyboardConfig.customShortcuts.forEach(shortcut => {
        this.shortcuts.set(shortcut.keys, shortcut);
      });
    }
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));
    
    if (this.keyboardConfig.enableTabNavigation) {
      document.addEventListener('focusin', this.handleFocusIn.bind(this));
      document.addEventListener('focusout', this.handleFocusOut.bind(this));
    }
  }

  /**
   * Handle keydown events
   */
  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.isPlayerFocused() && !this.isPlayerElement(event.target as Element)) {
      return;
    }

    const keyString = this.getKeyString(event);
    const shortcut = this.shortcuts.get(keyString);

    if (shortcut) {
      if (shortcut.preventDefault) {
        event.preventDefault();
        event.stopPropagation();
      }

      this.executeAction(shortcut.action);
      
      if (this.keyboardConfig.announceShortcuts) {
        this.announceAction(shortcut.description);
      }
    }
  }

  /**
   * Handle keyup events
   */
  private handleKeyUp(event: KeyboardEvent): void {
    // Handle any keyup-specific actions
  }

  /**
   * Handle focus in events
   */
  private handleFocusIn(event: FocusEvent): void {
    const element = event.target as HTMLElement;
    
    if (this.isPlayerElement(element)) {
      this.updateFocusIndex(element);
      this.showFocusIndicator(element);
    }
  }

  /**
   * Handle focus out events
   */
  private handleFocusOut(event: FocusEvent): void {
    const element = event.target as HTMLElement;
    
    if (this.isPlayerElement(element)) {
      this.hideFocusIndicator(element);
    }
  }

  /**
   * Get key string from keyboard event
   */
  private getKeyString(event: KeyboardEvent): string {
    const modifiers = [];
    
    if (event.ctrlKey) modifiers.push('Ctrl');
    if (event.shiftKey) modifiers.push('Shift');
    if (event.altKey) modifiers.push('Alt');
    if (event.metaKey) modifiers.push('Meta');
    
    const key = event.code || event.key;
    
    return modifiers.length > 0 ? `${modifiers.join('+')}+${key}` : key;
  }

  /**
   * Execute keyboard action
   */
  private executeAction(action: string): void {
    switch (action) {
      case 'toggle-play':
        this.emit('player:toggle-play');
        break;
      case 'seek-backward':
        this.emit('player:seek', { offset: -10 });
        break;
      case 'seek-forward':
        this.emit('player:seek', { offset: 10 });
        break;
      case 'volume-up':
        this.emit('player:volume-change', { offset: 0.1 });
        break;
      case 'volume-down':
        this.emit('player:volume-change', { offset: -0.1 });
        break;
      case 'toggle-mute':
        this.emit('player:toggle-mute');
        break;
      case 'toggle-fullscreen':
        this.emit('player:toggle-fullscreen');
        break;
      case 'exit-fullscreen':
        this.emit('player:exit-fullscreen');
        break;
      case 'toggle-captions':
        this.emit('player:toggle-captions');
        break;
      case 'seek-start':
        this.emit('player:seek', { time: 0 });
        break;
      case 'seek-end':
        this.emit('player:seek-to-end');
        break;
      default:
        this.emit('keyboard:custom-action', { action });
        break;
    }
  }

  /**
   * Setup focus management
   */
  private setupFocusManagement(): void {
    if (!this.keyboardConfig.focusManagement) {
      return;
    }

    // Find all focusable elements within the player
    this.updateFocusableElements();
    
    // Setup tab navigation
    if (this.keyboardConfig.enableTabNavigation) {
      this.setupTabNavigation();
    }
  }

  /**
   * Update focusable elements list
   */
  private updateFocusableElements(): void {
    // This would find all focusable elements within the player container
    const playerContainer = document.querySelector('[data-video-player]');
    if (!playerContainer) return;

    const focusableSelectors = [
      'button',
      '[tabindex]:not([tabindex="-1"])',
      'input',
      'select',
      'textarea',
      '[role="button"]',
      '[role="slider"]'
    ];

    this.focusableElements = Array.from(
      playerContainer.querySelectorAll(focusableSelectors.join(','))
    ) as HTMLElement[];
  }

  /**
   * Setup tab navigation
   */
  private setupTabNavigation(): void {
    this.focusableElements.forEach((element, index) => {
      element.addEventListener('keydown', (event) => {
        if (event.key === 'Tab') {
          this.handleTabNavigation(event, index);
        }
      });
    });
  }

  /**
   * Handle tab navigation
   */
  private handleTabNavigation(event: KeyboardEvent, currentIndex: number): void {
    const isShiftTab = event.shiftKey;
    const nextIndex = isShiftTab ? currentIndex - 1 : currentIndex + 1;
    
    if (nextIndex >= 0 && nextIndex < this.focusableElements.length) {
      event.preventDefault();
      this.focusableElements[nextIndex].focus();
    }
  }

  /**
   * Update focus index
   */
  private updateFocusIndex(element: HTMLElement): void {
    this.currentFocusIndex = this.focusableElements.indexOf(element);
  }

  /**
   * Show focus indicator
   */
  private showFocusIndicator(element: HTMLElement): void {
    if (!this.keyboardConfig.showFocusIndicators) {
      return;
    }

    element.style.outline = '2px solid #0066cc';
    element.style.outlineOffset = '2px';
  }

  /**
   * Hide focus indicator
   */
  private hideFocusIndicator(element: HTMLElement): void {
    element.style.outline = '';
    element.style.outlineOffset = '';
  }

  /**
   * Check if player is focused
   */
  private isPlayerFocused(): boolean {
    const activeElement = document.activeElement;
    return this.isPlayerElement(activeElement as Element);
  }

  /**
   * Check if element is part of the player
   */
  private isPlayerElement(element: Element | null): boolean {
    if (!element) return false;
    
    const playerContainer = document.querySelector('[data-video-player]');
    return playerContainer?.contains(element) || false;
  }

  /**
   * Announce action to screen readers
   */
  private announceAction(description: string): void {
    this.emit('accessibility:announce', { message: description });
  }

  /**
   * Add accessibility attributes
   */
  private addAccessibilityAttributes(): void {
    const playerContainer = document.querySelector('[data-video-player]');
    if (!playerContainer) return;

    playerContainer.setAttribute('role', 'application');
    playerContainer.setAttribute('aria-label', 'Video player');
    playerContainer.setAttribute('tabindex', '0');

    // Add keyboard shortcuts info
    const shortcutsText = Array.from(this.shortcuts.values())
      .map(shortcut => `${shortcut.keys}: ${shortcut.description}`)
      .join(', ');
    
    playerContainer.setAttribute('aria-description', `Keyboard shortcuts: ${shortcutsText}`);
  }

  /**
   * Add custom shortcut
   */
  public addShortcut(shortcut: KeyboardShortcut): void {
    this.shortcuts.set(shortcut.keys, shortcut);
    this.emit('shortcut:added', shortcut);
  }

  /**
   * Remove shortcut
   */
  public removeShortcut(keys: string): void {
    const shortcut = this.shortcuts.get(keys);
    if (shortcut) {
      this.shortcuts.delete(keys);
      this.emit('shortcut:removed', shortcut);
    }
  }

  /**
   * Get all shortcuts
   */
  public getShortcuts(): KeyboardShortcut[] {
    return Array.from(this.shortcuts.values());
  }

  /**
   * Cleanup on destroy
   */
  public async destroy(): Promise<void> {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    document.removeEventListener('keyup', this.handleKeyUp.bind(this));
    document.removeEventListener('focusin', this.handleFocusIn.bind(this));
    document.removeEventListener('focusout', this.handleFocusOut.bind(this));
    
    this.shortcuts.clear();
    this.focusableElements = [];
    this.eventListeners.clear();
  }
}

export class AudioDescriptions extends BasePlugin {
  readonly id = 'audio-descriptions';
  readonly name = 'Audio Descriptions';
  readonly version = '1.0.0';
  readonly type = 'accessibility';

  async initialize(): Promise<void> {
    this.isInitialized = true;
  }

  async destroy(): Promise<void> {
    this.isInitialized = false;
  }
}
