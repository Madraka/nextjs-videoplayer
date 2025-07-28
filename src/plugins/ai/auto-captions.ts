/**
 * Auto Captions Plugin
 * 
 * AI-powered automatic caption generation using speech recognition and NLP.
 * Generates real-time captions and provides translation capabilities.
 */

import { BasePlugin } from '../base-plugin';

/**
 * Caption generation result
 */
export interface CaptionSegment {
  /** Segment start time in seconds */
  startTime: number;
  /** Segment end time in seconds */
  endTime: number;
  /** Generated text */
  text: string;
  /** Confidence score (0-1) */
  confidence: number;
  /** Language detected/generated */
  language: string;
  /** Whether segment is final or interim */
  isFinal: boolean;
  /** Speaker identification (if available) */
  speakerId?: string;
}

/**
 * Translation result
 */
export interface TranslationResult {
  /** Original caption segment */
  original: CaptionSegment;
  /** Translated text */
  translatedText: string;
  /** Target language */
  targetLanguage: string;
  /** Translation confidence (0-1) */
  confidence: number;
}

/**
 * Auto captions configuration
 */
export interface AutoCaptionsConfig {
  /** Enable/disable auto captions */
  enabled: boolean;
  /** Speech recognition API endpoint */
  speechApiEndpoint?: string;
  /** Translation API endpoint */
  translationApiEndpoint?: string;
  /** API key for speech recognition */
  speechApiKey?: string;
  /** API key for translation */
  translationApiKey?: string;
  /** Source language (auto-detect if not specified) */
  sourceLanguage?: string;
  /** Target languages for translation */
  targetLanguages: string[];
  /** Real-time processing */
  realTime: boolean;
  /** Caption styling */
  styling: {
    fontSize: string;
    fontFamily: string;
    color: string;
    backgroundColor: string;
    position: 'bottom' | 'top' | 'center';
  };
  /** Processing options */
  processing: {
    chunkDuration: number; // Audio chunk duration in seconds
    overlapDuration: number; // Overlap between chunks
    confidenceThreshold: number; // Minimum confidence to display
    maxSegmentLength: number; // Maximum characters per segment
    enablePunctuation: boolean;
    enableCapitalization: boolean;
  };
}

/**
 * Auto captions plugin implementation
 */
export class AutoCaptionsPlugin extends BasePlugin {
  public readonly id = 'auto-captions';
  public readonly name = 'Auto Captions';
  public readonly version = '1.0.0';
  public readonly type = 'ai';

  private captionsConfig: AutoCaptionsConfig;
  private mediaRecorder?: MediaRecorder;
  private audioContext?: AudioContext;
  private captionSegments: CaptionSegment[] = [];
  private isProcessing: boolean = false;
  private captionElement?: HTMLElement;
  private currentStream?: MediaStream;

  constructor(config: AutoCaptionsConfig) {
    super(config);
    const defaultStyling = {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      position: 'bottom' as const
    };
    
    const defaultProcessing = {
      chunkDuration: 3,
      overlapDuration: 0.5,
      confidenceThreshold: 0.7,
      maxSegmentLength: 80,
      enablePunctuation: true,
      enableCapitalization: true
    };

    this.captionsConfig = {
      ...config,
      enabled: config.enabled ?? true,
      targetLanguages: config.targetLanguages ?? ['en'],
      realTime: config.realTime ?? true,
      styling: { ...defaultStyling, ...config.styling },
      processing: { ...defaultProcessing, ...config.processing }
    };
  }

  /**
   * Initialize auto captions
   */
  public async initialize(): Promise<void> {
    if (!this.captionsConfig.enabled) {
      return;
    }

    await this.checkBrowserSupport();
    this.createCaptionElement();
    this.setupEventListeners();
    
    this.isInitialized = true;
  }

  /**
   * Start caption generation
   */
  public async startCaptioning(videoElement: HTMLVideoElement): Promise<void> {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;
    this.emit('captioning:started');

    try {
      // Get audio stream from video
      const audioStream = await this.getAudioStream(videoElement);
      
      if (this.captionsConfig.realTime) {
        await this.startRealTimeProcessing(audioStream);
      } else {
        await this.processFullAudio(audioStream);
      }

    } catch (error) {
      this.emit('captioning:error', error);
      throw error;
    }
  }

  /**
   * Stop caption generation
   */
  public stopCaptioning(): void {
    if (!this.isProcessing) {
      return;
    }

    this.isProcessing = false;
    
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    
    if (this.currentStream) {
      this.currentStream.getTracks().forEach(track => track.stop());
    }
    
    this.emit('captioning:stopped');
  }

  /**
   * Get generated captions
   */
  public getCaptions(): CaptionSegment[] {
    return [...this.captionSegments];
  }

  /**
   * Clear generated captions
   */
  public clearCaptions(): void {
    this.captionSegments = [];
    if (this.captionElement) {
      this.captionElement.textContent = '';
    }
    this.emit('captions:cleared');
  }

  /**
   * Translate captions to target language
   */
  public async translateCaptions(targetLanguage: string): Promise<TranslationResult[]> {
    const translations: TranslationResult[] = [];

    for (const segment of this.captionSegments) {
      if (segment.isFinal) {
        const translation = await this.translateSegment(segment, targetLanguage);
        translations.push(translation);
      }
    }

    this.emit('translation:completed', { targetLanguage, translations });
    return translations;
  }

  /**
   * Export captions in various formats
   */
  public exportCaptions(format: 'vtt' | 'srt' | 'txt'): string {
    switch (format) {
      case 'vtt':
        return this.exportAsVTT();
      case 'srt':
        return this.exportAsSRT();
      case 'txt':
        return this.exportAsText();
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  /**
   * Check browser support for required APIs
   */
  private async checkBrowserSupport(): Promise<void> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Media devices not supported');
    }

    if (!window.MediaRecorder) {
      throw new Error('MediaRecorder not supported');
    }

    if (!window.AudioContext && !(window as any).webkitAudioContext) {
      throw new Error('Web Audio API not supported');
    }
  }

  /**
   * Get audio stream from video element
   */
  private async getAudioStream(videoElement: HTMLVideoElement): Promise<MediaStream> {
    // Try to get audio from video element directly
    if ((videoElement as any).captureStream) {
      return (videoElement as any).captureStream();
    }

    // Fallback to microphone audio
    return navigator.mediaDevices.getUserMedia({ audio: true });
  }

  /**
   * Start real-time caption processing
   */
  private async startRealTimeProcessing(audioStream: MediaStream): Promise<void> {
    this.currentStream = audioStream;
    
    // Initialize audio context
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Setup media recorder
    this.mediaRecorder = new MediaRecorder(audioStream, {
      mimeType: 'audio/webm;codecs=opus'
    });

    const audioChunks: Blob[] = [];
    const chunkDuration = this.captionsConfig.processing.chunkDuration * 1000;

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = async () => {
      if (audioChunks.length > 0) {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        await this.processAudioChunk(audioBlob, Date.now());
        audioChunks.length = 0;
      }
    };

    // Start recording with time slicing
    this.mediaRecorder.start(chunkDuration);
    
    // Restart recording for continuous processing
    setInterval(() => {
      if (this.isProcessing && this.mediaRecorder && this.mediaRecorder.state === 'recording') {
        this.mediaRecorder.stop();
        setTimeout(() => {
          if (this.mediaRecorder && this.isProcessing) {
            this.mediaRecorder.start(chunkDuration);
          }
        }, 100);
      }
    }, chunkDuration);
  }

  /**
   * Process full audio (non-real-time)
   */
  private async processFullAudio(audioStream: MediaStream): Promise<void> {
    // Implementation for processing complete audio file
    // This would be used for pre-recorded videos
    console.log('Processing full audio - implementation needed');
  }

  /**
   * Process audio chunk for speech recognition
   */
  private async processAudioChunk(audioBlob: Blob, timestamp: number): Promise<void> {
    try {
      const speechResult = await this.performSpeechRecognition(audioBlob);
      
      if (speechResult && speechResult.confidence >= this.captionsConfig.processing.confidenceThreshold) {
        const segment: CaptionSegment = {
          startTime: (timestamp - this.captionsConfig.processing.chunkDuration * 1000) / 1000,
          endTime: timestamp / 1000,
          text: this.processText(speechResult.text),
          confidence: speechResult.confidence,
          language: speechResult.language || 'en',
          isFinal: true
        };

        this.addCaptionSegment(segment);
      }

    } catch (error) {
      console.error('Speech recognition failed:', error);
    }
  }

  /**
   * Perform speech recognition on audio blob
   */
  private async performSpeechRecognition(audioBlob: Blob): Promise<{ text: string; confidence: number; language?: string } | null> {
    if (!this.captionsConfig.speechApiEndpoint) {
      // Fallback to Web Speech API if available
      return this.useWebSpeechAPI(audioBlob);
    }

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('language', this.captionsConfig.sourceLanguage || 'auto');

      const response = await fetch(this.captionsConfig.speechApiEndpoint, {
        method: 'POST',
        headers: {
          ...(this.captionsConfig.speechApiKey && {
            'Authorization': `Bearer ${this.captionsConfig.speechApiKey}`
          })
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Speech API error: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        text: result.text || result.transcript,
        confidence: result.confidence || 0.8,
        language: result.language
      };

    } catch (error) {
      console.error('Speech recognition API failed:', error);
      return null;
    }
  }

  /**
   * Fallback to Web Speech API
   */
  private async useWebSpeechAPI(audioBlob: Blob): Promise<{ text: string; confidence: number; language?: string } | null> {
    // Web Speech API implementation would go here
    // This is a placeholder as Web Speech API works with live audio streams
    console.log('Web Speech API fallback - implementation needed');
    return null;
  }

  /**
   * Process and clean up recognized text
   */
  private processText(text: string): string {
    let processed = text;

    if (this.captionsConfig.processing.enableCapitalization) {
      processed = this.capitalizeText(processed);
    }

    if (this.captionsConfig.processing.enablePunctuation) {
      processed = this.addPunctuation(processed);
    }

    // Limit segment length
    if (processed.length > this.captionsConfig.processing.maxSegmentLength) {
      processed = processed.substring(0, this.captionsConfig.processing.maxSegmentLength) + '...';
    }

    return processed;
  }

  /**
   * Capitalize text properly
   */
  private capitalizeText(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  /**
   * Add punctuation to text
   */
  private addPunctuation(text: string): string {
    // Simple punctuation rules
    let processed = text.trim();
    
    if (processed && !/[.!?]$/.test(processed)) {
      processed += '.';
    }
    
    return processed;
  }

  /**
   * Add caption segment and update display
   */
  private addCaptionSegment(segment: CaptionSegment): void {
    this.captionSegments.push(segment);
    this.updateCaptionDisplay(segment);
    this.emit('caption:added', segment);
  }

  /**
   * Update caption display element
   */
  private updateCaptionDisplay(segment: CaptionSegment): void {
    if (!this.captionElement) {
      return;
    }

    // Show latest caption
    this.captionElement.textContent = segment.text;
    
    // Auto-hide after duration
    setTimeout(() => {
      if (this.captionElement && this.captionElement.textContent === segment.text) {
        this.captionElement.textContent = '';
      }
    }, (segment.endTime - segment.startTime) * 1000 + 2000);
  }

  /**
   * Translate individual segment
   */
  private async translateSegment(segment: CaptionSegment, targetLanguage: string): Promise<TranslationResult> {
    if (!this.captionsConfig.translationApiEndpoint) {
      throw new Error('Translation API not configured');
    }

    try {
      const response = await fetch(this.captionsConfig.translationApiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.captionsConfig.translationApiKey && {
            'Authorization': `Bearer ${this.captionsConfig.translationApiKey}`
          })
        },
        body: JSON.stringify({
          text: segment.text,
          sourceLanguage: segment.language,
          targetLanguage
        })
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.statusText}`);
      }

      const result = await response.json();

      return {
        original: segment,
        translatedText: result.translatedText || result.translation,
        targetLanguage,
        confidence: result.confidence || 0.8
      };

    } catch (error) {
      console.error('Translation failed:', error);
      throw error;
    }
  }

  /**
   * Create caption display element
   */
  private createCaptionElement(): void {
    this.captionElement = document.createElement('div');
    this.captionElement.className = 'auto-captions';
    
    const styling = this.captionsConfig.styling;
    this.captionElement.style.cssText = `
      position: absolute;
      ${styling.position}: 20px;
      left: 50%;
      transform: translateX(-50%);
      max-width: 80%;
      padding: 8px 12px;
      font-family: ${styling.fontFamily};
      font-size: ${styling.fontSize};
      color: ${styling.color};
      background-color: ${styling.backgroundColor};
      border-radius: 4px;
      text-align: center;
      pointer-events: none;
      z-index: 1001;
      display: none;
    `;

    document.body.appendChild(this.captionElement);
  }

  /**
   * Export captions as WebVTT
   */
  private exportAsVTT(): string {
    let vtt = 'WEBVTT\n\n';
    
    this.captionSegments.forEach((segment, index) => {
      const start = this.formatTime(segment.startTime);
      const end = this.formatTime(segment.endTime);
      
      vtt += `${index + 1}\n`;
      vtt += `${start} --> ${end}\n`;
      vtt += `${segment.text}\n\n`;
    });
    
    return vtt;
  }

  /**
   * Export captions as SRT
   */
  private exportAsSRT(): string {
    let srt = '';
    
    this.captionSegments.forEach((segment, index) => {
      const start = this.formatTime(segment.startTime, true);
      const end = this.formatTime(segment.endTime, true);
      
      srt += `${index + 1}\n`;
      srt += `${start} --> ${end}\n`;
      srt += `${segment.text}\n\n`;
    });
    
    return srt;
  }

  /**
   * Export captions as plain text
   */
  private exportAsText(): string {
    return this.captionSegments
      .map(segment => segment.text)
      .join(' ');
  }

  /**
   * Format time for caption export
   */
  private formatTime(seconds: number, useSRTFormat = false): string {
    const date = new Date(seconds * 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const milliseconds = Math.floor((seconds % 1) * 1000);

    const separator = useSRTFormat ? ',' : '.';
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}${separator}${milliseconds.toString().padStart(3, '0')}`;
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    this.on('player:play', () => {
      if (this.captionElement) {
        this.captionElement.style.display = 'block';
      }
    });

    this.on('player:pause', () => {
      if (this.captionElement) {
        this.captionElement.style.display = 'none';
      }
    });
  }

  /**
   * Cleanup on destroy
   */
  public async destroy(): Promise<void> {
    this.stopCaptioning();
    
    if (this.captionElement) {
      document.body.removeChild(this.captionElement);
      this.captionElement = undefined;
    }
    
    if (this.audioContext && this.audioContext.state !== 'closed') {
      await this.audioContext.close();
    }
    
    this.captionSegments = [];
    this.eventListeners.clear();
  }
}
