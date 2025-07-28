/**
 * Audio Descriptions Plugin
 * 
 * Provides audio description support for visually impaired users.
 * Audio descriptions are narrations that describe visual elements of the video.
 */

import { BasePlugin } from '../base-plugin';

/**
 * Audio description track interface
 */
export interface AudioDescriptionTrack {
  /** Unique identifier for the track */
  id: string;
  /** Track label/name */
  label: string;
  /** Language code (ISO 639-1) */
  language: string;
  /** Audio source URL */
  src: string;
  /** Audio format */
  format: 'mp3' | 'wav' | 'ogg' | 'aac';
  /** Default track */
  default?: boolean;
  /** Track enabled state */
  enabled?: boolean;
}

/**
 * Audio description cue
 */
export interface AudioDescriptionCue {
  /** Start time in seconds */
  startTime: number;
  /** End time in seconds */
  endTime: number;
  /** Description text (for fallback) */
  text: string;
  /** Audio file URL for this cue */
  audioSrc?: string;
}

/**
 * Audio descriptions configuration
 */
export interface AudioDescriptionsConfig {
  /** Enable/disable audio descriptions */
  enabled: boolean;
  /** Auto-load descriptions */
  autoLoad: boolean;
  /** Default language */
  defaultLanguage?: string;
  /** Mix with main audio */
  mixWithMainAudio: boolean;
  /** Description volume (0-1) */
  volume: number;
  /** Pause main video during descriptions */
  pauseMainVideo: boolean;
  /** Auto-detect browser language */
  autoDetectLanguage: boolean;
}

/**
 * Audio descriptions plugin implementation
 */
export class AudioDescriptionsPlugin extends BasePlugin {
  public readonly id = 'audio-descriptions';
  public readonly name = 'Audio Descriptions';
  public readonly version = '1.0.0';
  public readonly type = 'accessibility';

  private descriptionsConfig: AudioDescriptionsConfig;
  private tracks: Map<string, AudioDescriptionTrack> = new Map();
  private activeTrack?: AudioDescriptionTrack;
  private cues: AudioDescriptionCue[] = [];
  private audioContext?: AudioContext;
  private currentAudio?: HTMLAudioElement;
  private gainNode?: GainNode;

  constructor(config: AudioDescriptionsConfig) {
    super(config);
    this.descriptionsConfig = {
      ...config,
      enabled: config.enabled ?? true,
      autoLoad: config.autoLoad ?? true,
      mixWithMainAudio: config.mixWithMainAudio ?? true,
      volume: config.volume ?? 0.8,
      pauseMainVideo: config.pauseMainVideo ?? false,
      autoDetectLanguage: config.autoDetectLanguage ?? true
    };
  }

  /**
   * Initialize audio descriptions
   */
  public async initialize(): Promise<void> {
    if (!this.descriptionsConfig.enabled) {
      return;
    }

    await this.initializeAudioContext();
    this.setupEventListeners();
    
    if (this.descriptionsConfig.autoDetectLanguage) {
      this.detectBrowserLanguage();
    }
    
    this.isInitialized = true;
  }

  /**
   * Add audio description track
   */
  public addTrack(track: AudioDescriptionTrack): void {
    this.tracks.set(track.id, track);
    
    if (track.default || this.tracks.size === 1) {
      this.setActiveTrack(track.id);
    }
    
    this.emit('track:added', track);
  }

  /**
   * Remove audio description track
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
   * Set active audio description track
   */
  public setActiveTrack(trackId?: string): void {
    this.stopCurrentAudio();
    
    if (!trackId) {
      this.activeTrack = undefined;
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
  public getTracks(): AudioDescriptionTrack[] {
    return Array.from(this.tracks.values());
  }

  /**
   * Get active track
   */
  public getActiveTrack(): AudioDescriptionTrack | undefined {
    return this.activeTrack;
  }

  /**
   * Set volume for audio descriptions
   */
  public setVolume(volume: number): void {
    this.descriptionsConfig.volume = Math.max(0, Math.min(1, volume));
    
    if (this.gainNode) {
      this.gainNode.gain.value = this.descriptionsConfig.volume;
    }
    
    if (this.currentAudio) {
      this.currentAudio.volume = this.descriptionsConfig.volume;
    }
    
    this.emit('volume:changed', this.descriptionsConfig.volume);
  }

  /**
   * Load audio description cues from external file
   */
  public async loadCues(cueDrcrftionsURL: string): Promise<void> {
    try {
      const response = await fetch(cueDrcrftionsURL);
      const cueData = await response.json();
      this.cues = cueData;
      this.emit('cues:loaded', this.cues);
    } catch (error) {
      console.error('Failed to load audio description cues:', error);
      this.emit('cues:error', error);
    }
  }

  /**
   * Add individual cue
   */
  public addCue(cue: AudioDescriptionCue): void {
    this.cues.push(cue);
    this.cues.sort((a, b) => a.startTime - b.startTime);
    this.emit('cue:added', cue);
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    this.on('player:timeupdate', (data: { currentTime: number }) => {
      this.checkForDescriptions(data.currentTime);
    });
    
    this.on('player:play', () => {
      this.resumeDescriptions();
    });
    
    this.on('player:pause', () => {
      this.pauseDescriptions();
    });
    
    this.on('player:seeked', () => {
      this.stopCurrentAudio();
    });
    
    this.on('player:languagechange', (data: { language: string }) => {
      this.switchToLanguage(data.language);
    });
  }

  /**
   * Initialize Web Audio API context
   */
  private async initializeAudioContext(): Promise<void> {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create gain node for volume control
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = this.descriptionsConfig.volume;
      this.gainNode.connect(this.audioContext.destination);
      
    } catch (error) {
      console.warn('Failed to initialize Web Audio API:', error);
      // Fallback to HTML5 audio without advanced mixing
    }
  }

  /**
   * Load audio description track
   */
  private async loadTrack(track: AudioDescriptionTrack): Promise<void> {
    try {
      // If track has a single audio file, load it
      if (track.src) {
        await this.loadMainAudioTrack(track.src);
      }
      
      this.emit('track:loaded', track);
    } catch (error) {
      console.error(`Failed to load audio description track ${track.id}:`, error);
      this.emit('track:error', { track, error });
    }
  }

  /**
   * Load main audio track for descriptions
   */
  private async loadMainAudioTrack(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(src);
      audio.volume = this.descriptionsConfig.volume;
      
      audio.addEventListener('canplaythrough', () => {
        this.currentAudio = audio;
        resolve();
      });
      
      audio.addEventListener('error', reject);
      
      audio.load();
    });
  }

  /**
   * Check for audio descriptions at current time
   */
  private checkForDescriptions(currentTime: number): void {
    if (!this.activeTrack || this.cues.length === 0) {
      return;
    }
    
    const activeCues = this.cues.filter(
      cue => currentTime >= cue.startTime && currentTime <= cue.endTime
    );
    
    if (activeCues.length > 0 && !this.isPlayingDescription()) {
      this.playDescription(activeCues[0]);
    }
  }

  /**
   * Play audio description
   */
  private async playDescription(cue: AudioDescriptionCue): Promise<void> {
    try {
      if (this.descriptionsConfig.pauseMainVideo) {
        this.emit('player:pause');
      }
      
      if (cue.audioSrc) {
        await this.playAudioCue(cue.audioSrc);
      } else if (this.currentAudio) {
        // Play from main audio track
        const duration = cue.endTime - cue.startTime;
        this.currentAudio.currentTime = cue.startTime;
        this.currentAudio.play();
        
        setTimeout(() => {
          this.stopCurrentAudio();
          if (this.descriptionsConfig.pauseMainVideo) {
            this.emit('player:play');
          }
        }, duration * 1000);
      }
      
      this.emit('description:playing', cue);
      
    } catch (error) {
      console.error('Failed to play audio description:', error);
      this.emit('description:error', error);
    }
  }

  /**
   * Play individual audio cue
   */
  private async playAudioCue(audioSrc: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(audioSrc);
      audio.volume = this.descriptionsConfig.volume;
      
      if (this.audioContext && this.gainNode) {
        // Use Web Audio API for better mixing
        const source = this.audioContext.createMediaElementSource(audio);
        source.connect(this.gainNode);
      }
      
      audio.addEventListener('ended', () => {
        if (this.descriptionsConfig.pauseMainVideo) {
          this.emit('player:play');
        }
        resolve();
      });
      
      audio.addEventListener('error', reject);
      
      audio.play();
    });
  }

  /**
   * Stop current audio description
   */
  private stopCurrentAudio(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }
  }

  /**
   * Pause audio descriptions
   */
  private pauseDescriptions(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
    }
  }

  /**
   * Resume audio descriptions
   */
  private resumeDescriptions(): void {
    if (this.currentAudio && this.currentAudio.paused) {
      this.currentAudio.play();
    }
  }

  /**
   * Check if description is currently playing
   */
  private isPlayingDescription(): boolean {
    return this.currentAudio ? !this.currentAudio.paused : false;
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
    this.stopCurrentAudio();
    
    if (this.audioContext && this.audioContext.state !== 'closed') {
      await this.audioContext.close();
    }
    
    this.tracks.clear();
    this.cues = [];
    this.currentAudio = undefined;
    this.audioContext = undefined;
    this.gainNode = undefined;
    
    this.eventListeners.clear();
  }
}
