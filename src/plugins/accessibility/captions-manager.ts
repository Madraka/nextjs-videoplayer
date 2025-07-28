/**
 * Captions Manager Plugin
 * 
 * Provides comprehensive caption/subtitle management with support for multiple formats,
 * languages, and accessibility features.
 */

import { BasePlugin } from '../base-plugin';

/**
 * Caption track interface
 */
export interface CaptionTrack {
  /** Unique identifier for the track */
  id: string;
  /** Track label/name */
  label: string;
  /** Language code (ISO 639-1) */
  language: string;
  /** Track source URL */
  src: string;
  /** Track format (vtt, srt, ass, etc.) */
  format: 'vtt' | 'srt' | 'ass' | 'ttml' | 'sami';
  /** Track type */
  kind: 'subtitles' | 'captions' | 'descriptions' | 'chapters' | 'metadata';
  /** Default track */
  default?: boolean;
  /** Track enabled state */
  enabled?: boolean;
}

/**
 * Caption styling options
 */
export interface CaptionStyling {
  /** Font family */
  fontFamily?: string;
  /** Font size */
  fontSize?: string;
  /** Font color */
  color?: string;
  /** Background color */
  backgroundColor?: string;
  /** Text shadow */
  textShadow?: string;
  /** Edge style */
  edgeStyle?: 'none' | 'raised' | 'depressed' | 'uniform' | 'dropshadow';
  /** Window color */
  windowColor?: string;
  /** Window opacity */
  windowOpacity?: number;
  /** Text opacity */
  textOpacity?: number;
}

/**
 * Captions manager configuration
 */
export interface CaptionsManagerConfig {
  /** Enable/disable captions */
  enabled: boolean;
  /** Auto-load captions */
  autoLoad: boolean;
  /** Default language */
  defaultLanguage?: string;
  /** Caption styling */
  styling?: CaptionStyling;
  /** Show captions by default */
  showByDefault: boolean;
  /** Allow user styling customization */
  allowStyling: boolean;
  /** Auto-detect browser language */
  autoDetectLanguage: boolean;
}

/**
 * Captions manager plugin implementation
 */
export class CaptionsManagerPlugin extends BasePlugin {
  public readonly id = 'captions-manager';
  public readonly name = 'Captions Manager';
  public readonly version = '1.0.0';
  public readonly type = 'accessibility';

  private captionsConfig: CaptionsManagerConfig;
  private tracks: Map<string, CaptionTrack> = new Map();
  private activeTrack?: CaptionTrack;
  private captionElement?: HTMLElement;
  private currentCues: TextTrackCue[] = [];

  constructor(config: CaptionsManagerConfig) {
    super(config);
    this.captionsConfig = {
      ...config,
      enabled: config.enabled ?? true,
      autoLoad: config.autoLoad ?? true,
      showByDefault: config.showByDefault ?? false,
      allowStyling: config.allowStyling ?? true,
      autoDetectLanguage: config.autoDetectLanguage ?? true
    };
  }

  /**
   * Initialize captions manager
   */
  public async initialize(): Promise<void> {
    if (!this.captionsConfig.enabled) {
      return;
    }

    this.createCaptionElement();
    this.setupEventListeners();
    
    if (this.captionsConfig.autoDetectLanguage) {
      this.detectBrowserLanguage();
    }
    
    this.isInitialized = true;
  }

  /**
   * Add caption track
   */
  public addTrack(track: CaptionTrack): void {
    this.tracks.set(track.id, track);
    
    if (track.default || (this.tracks.size === 1 && this.captionsConfig.showByDefault)) {
      this.setActiveTrack(track.id);
    }
    
    this.emit('track:added', track);
  }

  /**
   * Remove caption track
   */
  public removeTrack(trackId: string): void {
    const track = this.tracks.get(trackId);
    if (!track) return;
    
    if (this.activeTrack?.id === trackId) {
      this.setActiveTrack(undefined);
    }
    
    this.tracks.delete(trackId);
    this.emit('track:removed', track);
  }

  /**
   * Set active caption track
   */
  public setActiveTrack(trackId?: string): void {
    if (!trackId) {
      this.activeTrack = undefined;
      this.hideCaptions();
      this.emit('track:changed', null);
      return;
    }
    
    const track = this.tracks.get(trackId);
    if (!track) return;
    
    this.activeTrack = track;
    this.loadTrack(track);
    this.emit('track:changed', track);
  }

  /**
   * Get all available tracks
   */
  public getTracks(): CaptionTrack[] {
    return Array.from(this.tracks.values());
  }

  /**
   * Get active track
   */
  public getActiveTrack(): CaptionTrack | undefined {
    return this.activeTrack;
  }

  /**
   * Show captions
   */
  public showCaptions(): void {
    if (this.captionElement) {
      this.captionElement.style.display = 'block';
      this.emit('captions:shown');
    }
  }

  /**
   * Hide captions
   */
  public hideCaptions(): void {
    if (this.captionElement) {
      this.captionElement.style.display = 'none';
      this.captionElement.textContent = '';
      this.emit('captions:hidden');
    }
  }

  /**
   * Update caption styling
   */
  public updateStyling(styling: Partial<CaptionStyling>): void {
    if (!this.captionsConfig.allowStyling || !this.captionElement) {
      return;
    }
    
    this.captionsConfig.styling = { ...this.captionsConfig.styling, ...styling };
    this.applyStyling();
    this.emit('styling:updated', this.captionsConfig.styling);
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    this.on('player:timeupdate', (data: { currentTime: number }) => {
      this.updateCaptions(data.currentTime);
    });
    
    this.on('player:seeked', () => {
      this.clearCurrentCues();
    });
    
    this.on('player:languagechange', (data: { language: string }) => {
      this.switchToLanguage(data.language);
    });
  }

  /**
   * Create caption display element
   */
  private createCaptionElement(): void {
    this.captionElement = document.createElement('div');
    this.captionElement.className = 'video-captions';
    this.captionElement.style.cssText = `
      position: absolute;
      bottom: 60px;
      left: 50%;
      transform: translateX(-50%);
      max-width: 80%;
      text-align: center;
      pointer-events: none;
      z-index: 1000;
      display: none;
    `;
    
    this.applyStyling();
    
    // This would be added to the video container
    // For now, we'll add it to the document body
    document.body.appendChild(this.captionElement);
  }

  /**
   * Apply caption styling
   */
  private applyStyling(): void {
    if (!this.captionElement || !this.captionsConfig.styling) {
      return;
    }
    
    const styling = this.captionsConfig.styling;
    const element = this.captionElement;
    
    if (styling.fontFamily) element.style.fontFamily = styling.fontFamily;
    if (styling.fontSize) element.style.fontSize = styling.fontSize;
    if (styling.color) element.style.color = styling.color;
    if (styling.backgroundColor) element.style.backgroundColor = styling.backgroundColor;
    if (styling.textShadow) element.style.textShadow = styling.textShadow;
    if (styling.windowColor) element.style.borderColor = styling.windowColor;
    if (styling.windowOpacity !== undefined) element.style.opacity = styling.windowOpacity.toString();
  }

  /**
   * Load caption track
   */
  private async loadTrack(track: CaptionTrack): Promise<void> {
    try {
      const response = await fetch(track.src);
      const content = await response.text();
      
      const cues = this.parseCaptions(content, track.format);
      this.currentCues = cues;
      
      this.showCaptions();
      this.emit('track:loaded', track);
    } catch (error) {
      console.error(`Failed to load caption track ${track.id}:`, error);
      this.emit('track:error', { track, error });
    }
  }

  /**
   * Parse caption content based on format
   */
  private parseCaptions(content: string, format: CaptionTrack['format']): TextTrackCue[] {
    switch (format) {
      case 'vtt':
        return this.parseVTT(content);
      case 'srt':
        return this.parseSRT(content);
      default:
        console.warn(`Caption format ${format} not supported`);
        return [];
    }
  }

  /**
   * Parse WebVTT format
   */
  private parseVTT(content: string): TextTrackCue[] {
    const cues: TextTrackCue[] = [];
    const lines = content.split('\n');
    
    let i = 0;
    while (i < lines.length) {
      const line = lines[i].trim();
      
      // Skip header and empty lines
      if (line === 'WEBVTT' || line === '' || line.startsWith('NOTE')) {
        i++;
        continue;
      }
      
      // Check if it's a timestamp line
      if (line.includes('-->')) {
        const [startStr, endStr] = line.split('-->').map(s => s.trim());
        const startTime = this.parseTimeString(startStr);
        const endTime = this.parseTimeString(endStr);
        
        // Collect text lines
        const textLines = [];
        i++;
        while (i < lines.length && lines[i].trim() !== '') {
          textLines.push(lines[i].trim());
          i++;
        }
        
        if (textLines.length > 0) {
          try {
            const cue = new VTTCue(startTime, endTime, textLines.join('\n'));
            cues.push(cue);
          } catch (error) {
            console.warn('Failed to create VTT cue:', error);
          }
        }
      } else {
        i++;
      }
    }
    
    return cues;
  }

  /**
   * Parse SRT format
   */
  private parseSRT(content: string): TextTrackCue[] {
    const cues: TextTrackCue[] = [];
    const blocks = content.trim().split(/\n\s*\n/);
    
    blocks.forEach(block => {
      const lines = block.split('\n');
      if (lines.length < 3) return;
      
      const timeString = lines[1];
      if (!timeString.includes('-->')) return;
      
      const [startStr, endStr] = timeString.split('-->').map(s => s.trim());
      const startTime = this.parseTimeString(startStr.replace(',', '.'));
      const endTime = this.parseTimeString(endStr.replace(',', '.'));
      
      const text = lines.slice(2).join('\n');
      
      try {
        const cue = new VTTCue(startTime, endTime, text);
        cues.push(cue);
      } catch (error) {
        console.warn('Failed to create SRT cue:', error);
      }
    });
    
    return cues;
  }

  /**
   * Parse time string to seconds
   */
  private parseTimeString(timeStr: string): number {
    const parts = timeStr.split(':');
    if (parts.length === 3) {
      const [hours, minutes, seconds] = parts;
      return (
        parseInt(hours) * 3600 +
        parseInt(minutes) * 60 +
        parseFloat(seconds)
      );
    }
    return 0;
  }

  /**
   * Update captions based on current time
   */
  private updateCaptions(currentTime: number): void {
    if (!this.captionElement || !this.activeTrack) {
      return;
    }
    
    const activeCues = this.currentCues.filter(
      cue => currentTime >= cue.startTime && currentTime <= cue.endTime
    );
    
    if (activeCues.length > 0) {
      const text = activeCues.map(cue => (cue as VTTCue).text).join('\n');
      this.captionElement.innerHTML = this.formatCaptionText(text);
    } else {
      this.captionElement.textContent = '';
    }
  }

  /**
   * Format caption text for display
   */
  private formatCaptionText(text: string): string {
    // Basic HTML formatting support
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
  }

  /**
   * Clear current cues
   */
  private clearCurrentCues(): void {
    if (this.captionElement) {
      this.captionElement.textContent = '';
    }
  }

  /**
   * Detect browser language
   */
  private detectBrowserLanguage(): void {
    const browserLang = navigator.language.split('-')[0];
    const matchingTrack = Array.from(this.tracks.values())
      .find(track => track.language === browserLang);
    
    if (matchingTrack && !this.activeTrack) {
      this.setActiveTrack(matchingTrack.id);
    }
  }

  /**
   * Switch to language
   */
  private switchToLanguage(language: string): void {
    const track = Array.from(this.tracks.values())
      .find(t => t.language === language);
    
    if (track) {
      this.setActiveTrack(track.id);
    }
  }

  /**
   * Cleanup on destroy
   */
  public async destroy(): Promise<void> {
    if (this.captionElement) {
      document.body.removeChild(this.captionElement);
      this.captionElement = undefined;
    }
    
    this.tracks.clear();
    this.currentCues = [];
    this.eventListeners.clear();
  }
}
