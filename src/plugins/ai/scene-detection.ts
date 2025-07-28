/**
 * Scene Detection Plugin
 * 
 * Automatically detects scene changes and key moments in video content using
 * computer vision techniques and audio analysis. Provides enhanced navigation,
 * automatic chapter generation, and content indexing capabilities.
 */

import { BasePlugin, type PluginConfig } from '../base-plugin';

interface SceneDetectionConfig extends PluginConfig {
  // Detection sensitivity (0-1, higher = more sensitive)
  sensitivity: number;
  
  // Minimum scene duration in seconds
  minSceneDuration: number;
  
  // Enable audio analysis for scene detection
  useAudioAnalysis: boolean;
  
  // Enable motion analysis
  useMotionDetection: boolean;
  
  // Auto-generate chapters
  autoGenerateChapters: boolean;
  
  // Detection algorithms to use
  algorithms: {
    histogram: boolean;     // Color histogram comparison
    edge: boolean;         // Edge detection changes
    optical: boolean;      // Optical flow analysis
    audio: boolean;        // Audio spectral analysis
  };
  
  // Thumbnail generation for detected scenes
  generateThumbnails: boolean;
  
  // API endpoints for enhanced AI analysis
  aiServices?: {
    enabled: boolean;
    objectDetection?: string;
    sceneClassification?: string;
    apiKey?: string;
  };
}

interface Scene {
  id: string;
  startTime: number;
  endTime: number;
  duration: number;
  confidence: number;
  type: 'cut' | 'fade' | 'motion' | 'audio';
  metadata: {
    dominantColors?: string[];
    averageBrightness?: number;
    motionLevel?: number;
    audioLevel?: number;
    objectsDetected?: string[];
    description?: string;
    thumbnail?: string;
  };
}

interface Chapter {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  scenes: Scene[];
  thumbnail?: string;
  description?: string;
}

/**
 * AI-powered scene detection and analysis plugin
 */
export class SceneDetectionPlugin extends BasePlugin {
  readonly id = 'scene-detection';
  readonly name = 'Scene Detection';
  readonly version = '1.0.0';
  readonly type = 'ai';
  
  private videoElement?: HTMLVideoElement;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private audioContext?: AudioContext;
  private analyser?: AnalyserNode;
  private previousFrame?: ImageData;
  private scenes: Scene[] = [];
  private chapters: Chapter[] = [];
  
  // Detection state
  private lastSceneTime: number = 0;
  private analysisBuffer: Float32Array[] = [];
  private detectionRunning: boolean = false;
  
  constructor(config: SceneDetectionConfig) {
    super(config);
    
    // Initialize canvas for frame analysis
    this.canvas = document.createElement('canvas');
    this.canvas.width = 320; // Reduced size for performance
    this.canvas.height = 180;
    this.context = this.canvas.getContext('2d')!;
  }

  async initialize(videoElement?: HTMLVideoElement): Promise<void> {
    if (videoElement) {
      this.videoElement = videoElement;
    }
    
    const config = this.config as SceneDetectionConfig;
    if (config.useAudioAnalysis) {
      await this.initializeAudioAnalysis();
    }
    
    this.setupEventListeners();
    this.isInitialized = true;
    this.emit('sceneDetectionInitialized', { plugin: this.name });
  }

  async destroy(): Promise<void> {
    this.detectionRunning = false;
    
    if (this.audioContext && this.audioContext.state !== 'closed') {
      await this.audioContext.close();
    }
    
    this.isInitialized = false;
  }

  /**
   * Initialize audio analysis for scene detection
   */
  private async initializeAudioAnalysis(): Promise<void> {
    try {
      this.audioContext = new AudioContext();
      
      if (this.videoElement) {
        // Create audio source from video element
        const source = this.audioContext.createMediaElementSource(this.videoElement);
        
        // Create analyser
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 2048;
        this.analyser.smoothingTimeConstant = 0.8;
        
        // Connect nodes
        source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
      }
    } catch (error) {
      console.warn('Failed to initialize audio analysis:', error);
      const config = this.config as SceneDetectionConfig;
      config.useAudioAnalysis = false;
    }
  }

  /**
   * Setup event listeners for detection triggers
   */
  private setupEventListeners(): void {
    if (!this.videoElement) return;
    
    this.videoElement.addEventListener('play', () => {
      this.startDetection();
    });
    
    this.videoElement.addEventListener('pause', () => {
      this.pauseDetection();
    });
    
    this.videoElement.addEventListener('seeked', () => {
      this.resetDetectionState();
    });
    
    this.videoElement.addEventListener('loadedmetadata', () => {
      this.resetAnalysis();
    });
  }

  /**
   * Start scene detection analysis
   */
  private startDetection(): void {
    if (this.detectionRunning || !this.videoElement) return;
    
    this.detectionRunning = true;
    this.analyzeFrames();
  }

  /**
   * Pause scene detection
   */
  private pauseDetection(): void {
    this.detectionRunning = false;
  }

  /**
   * Reset detection state
   */
  private resetDetectionState(): void {
    this.previousFrame = undefined;
    this.analysisBuffer = [];
    this.lastSceneTime = this.videoElement?.currentTime || 0;
  }

  /**
   * Reset all analysis data
   */
  private resetAnalysis(): void {
    this.scenes = [];
    this.chapters = [];
    this.resetDetectionState();
    this.emit('scenesReset', {});
  }

  /**
   * Main frame analysis loop
   */
  private analyzeFrames(): void {
    if (!this.detectionRunning || !this.videoElement) return;
    
    const currentTime = this.videoElement.currentTime;
    
    // Skip if not enough time has passed
    if (currentTime - this.lastSceneTime < 0.1) {
      requestAnimationFrame(() => this.analyzeFrames());
      return;
    }
    
    this.detectSceneChange(currentTime);
    
    // Continue analysis
    requestAnimationFrame(() => this.analyzeFrames());
  }

  /**
   * Detect scene changes using multiple algorithms
   */
  private detectSceneChange(currentTime: number): void {
    if (!this.videoElement) return;
    
    const config = this.config as SceneDetectionConfig;
    
    // Draw current frame to canvas
    this.context.drawImage(this.videoElement, 0, 0, this.canvas.width, this.canvas.height);
    const currentFrame = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    
    let sceneChangeDetected = false;
    let confidence = 0;
    let changeType: Scene['type'] = 'cut';
    
    if (this.previousFrame) {
      // Visual analysis
      if (config.algorithms.histogram) {
        const histogramChange = this.compareHistograms(this.previousFrame, currentFrame);
        if (histogramChange > config.sensitivity) {
          sceneChangeDetected = true;
          confidence = Math.max(confidence, histogramChange);
          changeType = 'cut';
        }
      }
      
      if (config.algorithms.edge) {
        const edgeChange = this.compareEdges(this.previousFrame, currentFrame);
        if (edgeChange > config.sensitivity) {
          sceneChangeDetected = true;
          confidence = Math.max(confidence, edgeChange);
          changeType = 'cut';
        }
      }
      
      if (config.algorithms.optical && config.useMotionDetection) {
        const motionLevel = this.analyzeMotion(this.previousFrame, currentFrame);
        if (motionLevel > config.sensitivity * 1.5) {
          sceneChangeDetected = true;
          confidence = Math.max(confidence, motionLevel);
          changeType = 'motion';
        }
      }
    }
    
    // Audio analysis
    if (config.algorithms.audio && config.useAudioAnalysis && this.analyser) {
      const audioChange = this.analyzeAudioChange();
      if (audioChange > config.sensitivity) {
        sceneChangeDetected = true;
        confidence = Math.max(confidence, audioChange);
        changeType = 'audio';
      }
    }
    
    // Check minimum scene duration
    if (sceneChangeDetected && (currentTime - this.lastSceneTime) >= config.minSceneDuration) {
      this.addScene(this.lastSceneTime, currentTime, confidence, changeType, currentFrame);
      this.lastSceneTime = currentTime;
    }
    
    this.previousFrame = currentFrame;
  }

  /**
   * Compare color histograms between frames
   */
  private compareHistograms(frame1: ImageData, frame2: ImageData): number {
    const hist1 = this.calculateHistogram(frame1);
    const hist2 = this.calculateHistogram(frame2);
    
    let difference = 0;
    for (let i = 0; i < hist1.length; i++) {
      difference += Math.abs(hist1[i] - hist2[i]);
    }
    
    return difference / (hist1.length * 255); // Normalize
  }

  /**
   * Calculate color histogram for a frame
   */
  private calculateHistogram(frame: ImageData): number[] {
    const histogram = new Array(256).fill(0);
    const data = frame.data;
    
    for (let i = 0; i < data.length; i += 4) {
      // Convert to grayscale
      const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
      histogram[gray]++;
    }
    
    return histogram;
  }

  /**
   * Compare edge information between frames
   */
  private compareEdges(frame1: ImageData, frame2: ImageData): number {
    const edges1 = this.detectEdges(frame1);
    const edges2 = this.detectEdges(frame2);
    
    let difference = 0;
    for (let i = 0; i < edges1.length; i++) {
      difference += Math.abs(edges1[i] - edges2[i]);
    }
    
    return difference / (edges1.length * 255);
  }

  /**
   * Simple edge detection using Sobel operator
   */
  private detectEdges(frame: ImageData): number[] {
    const data = frame.data;
    const width = frame.width;
    const height = frame.height;
    const edges = new Array(width * height).fill(0);
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        
        // Convert surrounding pixels to grayscale
        const pixels = [];
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const pixelIdx = ((y + dy) * width + (x + dx)) * 4;
            const gray = 0.299 * data[pixelIdx] + 0.587 * data[pixelIdx + 1] + 0.114 * data[pixelIdx + 2];
            pixels.push(gray);
          }
        }
        
        // Sobel operator
        const sobelX = (-pixels[0] + pixels[2] - 2 * pixels[3] + 2 * pixels[5] - pixels[6] + pixels[8]);
        const sobelY = (-pixels[0] - 2 * pixels[1] - pixels[2] + pixels[6] + 2 * pixels[7] + pixels[8]);
        const magnitude = Math.sqrt(sobelX * sobelX + sobelY * sobelY);
        
        edges[y * width + x] = magnitude;
      }
    }
    
    return edges;
  }

  /**
   * Analyze motion between frames
   */
  private analyzeMotion(frame1: ImageData, frame2: ImageData): number {
    const data1 = frame1.data;
    const data2 = frame2.data;
    
    let totalDifference = 0;
    let pixelCount = 0;
    
    for (let i = 0; i < data1.length; i += 4) {
      const diff = Math.abs(data1[i] - data2[i]) + 
                   Math.abs(data1[i + 1] - data2[i + 1]) + 
                   Math.abs(data1[i + 2] - data2[i + 2]);
      totalDifference += diff;
      pixelCount++;
    }
    
    return totalDifference / (pixelCount * 3 * 255);
  }

  /**
   * Analyze audio changes for scene detection
   */
  private analyzeAudioChange(): number {
    if (!this.analyser) return 0;
    
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);
    this.analyser.getFloatFrequencyData(dataArray);
    
    // Store in buffer for comparison
    this.analysisBuffer.push(dataArray);
    if (this.analysisBuffer.length > 10) {
      this.analysisBuffer.shift();
    }
    
    if (this.analysisBuffer.length < 2) return 0;
    
    // Compare with previous audio frame
    const previous = this.analysisBuffer[this.analysisBuffer.length - 2];
    let difference = 0;
    
    for (let i = 0; i < dataArray.length; i++) {
      difference += Math.abs(dataArray[i] - previous[i]);
    }
    
    return difference / dataArray.length / 100; // Normalize
  }

  /**
   * Add a detected scene
   */
  private addScene(startTime: number, endTime: number, confidence: number, type: Scene['type'], frame: ImageData): void {
    const config = this.config as SceneDetectionConfig;
    
    const scene: Scene = {
      id: `scene_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      startTime,
      endTime,
      duration: endTime - startTime,
      confidence,
      type,
      metadata: {
        dominantColors: this.extractDominantColors(frame),
        averageBrightness: this.calculateAverageBrightness(frame),
        motionLevel: type === 'motion' ? confidence : undefined,
        audioLevel: type === 'audio' ? confidence : undefined,
        thumbnail: config.generateThumbnails ? this.generateThumbnail(frame) : undefined
      }
    };
    
    // Enhance with AI analysis if enabled
    if (config.aiServices?.enabled) {
      this.enhanceSceneWithAI(scene, frame);
    }
    
    this.scenes.push(scene);
    
    // Auto-generate chapters if enabled
    if (config.autoGenerateChapters) {
      this.updateChapters();
    }
    
    this.emit('sceneDetected', { scene });
  }

  /**
   * Extract dominant colors from frame
   */
  private extractDominantColors(frame: ImageData): string[] {
    const colorCounts: { [key: string]: number } = {};
    const data = frame.data;
    
    // Sample pixels (skip some for performance)
    for (let i = 0; i < data.length; i += 16) { // Sample every 4th pixel
      const r = Math.round(data[i] / 32) * 32;
      const g = Math.round(data[i + 1] / 32) * 32;
      const b = Math.round(data[i + 2] / 32) * 32;
      const color = `rgb(${r},${g},${b})`;
      colorCounts[color] = (colorCounts[color] || 0) + 1;
    }
    
    // Get top 3 colors
    return Object.entries(colorCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([color]) => color);
  }

  /**
   * Calculate average brightness of frame
   */
  private calculateAverageBrightness(frame: ImageData): number {
    const data = frame.data;
    let totalBrightness = 0;
    let pixelCount = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      const brightness = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      totalBrightness += brightness;
      pixelCount++;
    }
    
    return totalBrightness / pixelCount / 255; // Normalize to 0-1
  }

  /**
   * Generate thumbnail from frame
   */
  private generateThumbnail(frame: ImageData): string {
    const thumbnailCanvas = document.createElement('canvas');
    thumbnailCanvas.width = 160;
    thumbnailCanvas.height = 90;
    const ctx = thumbnailCanvas.getContext('2d')!;
    
    // Create temporary canvas with frame data
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = frame.width;
    tempCanvas.height = frame.height;
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.putImageData(frame, 0, 0);
    
    // Draw scaled version
    ctx.drawImage(tempCanvas, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);
    
    return thumbnailCanvas.toDataURL('image/jpeg', 0.8);
  }

  /**
   * Enhance scene with AI analysis
   */
  private async enhanceSceneWithAI(scene: Scene, frame: ImageData): Promise<void> {
    const config = this.config as SceneDetectionConfig;
    if (!config.aiServices?.enabled) return;
    
    try {
      const thumbnail = this.generateThumbnail(frame);
      
      // Object detection
      if (config.aiServices.objectDetection) {
        const objects = await this.detectObjects(thumbnail);
        scene.metadata.objectsDetected = objects;
      }
      
      // Scene classification
      if (config.aiServices.sceneClassification) {
        const description = await this.classifyScene(thumbnail);
        scene.metadata.description = description;
      }
    } catch (error) {
      console.warn('AI enhancement failed:', error);
    }
  }

  /**
   * Detect objects in scene using AI service
   */
  private async detectObjects(imageData: string): Promise<string[]> {
    const config = this.config as SceneDetectionConfig;
    if (!config.aiServices?.objectDetection || !config.aiServices?.apiKey) {
      return [];
    }
    
    try {
      const response = await fetch(config.aiServices.objectDetection, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.aiServices.apiKey}`
        },
        body: JSON.stringify({
          image: imageData,
          confidence_threshold: 0.5
        })
      });
      
      const result = await response.json();
      return result.objects || [];
    } catch (error) {
      console.warn('Object detection failed:', error);
      return [];
    }
  }

  /**
   * Classify scene using AI service
   */
  private async classifyScene(imageData: string): Promise<string> {
    const config = this.config as SceneDetectionConfig;
    if (!config.aiServices?.sceneClassification || !config.aiServices?.apiKey) {
      return '';
    }
    
    try {
      const response = await fetch(config.aiServices.sceneClassification, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.aiServices.apiKey}`
        },
        body: JSON.stringify({
          image: imageData
        })
      });
      
      const result = await response.json();
      return result.description || '';
    } catch (error) {
      console.warn('Scene classification failed:', error);
      return '';
    }
  }

  /**
   * Update chapters based on detected scenes
   */
  private updateChapters(): void {
    if (this.scenes.length < 2) return;
    
    // Simple chapter generation: group scenes by similar characteristics
    const chapters: Chapter[] = [];
    let currentChapter: Chapter | null = null;
    
    for (const scene of this.scenes) {
      if (!currentChapter || this.shouldStartNewChapter(scene, currentChapter)) {
        if (currentChapter) {
          currentChapter.endTime = scene.startTime;
        }
        
        currentChapter = {
          id: `chapter_${chapters.length + 1}`,
          title: this.generateChapterTitle(scene),
          startTime: scene.startTime,
          endTime: scene.endTime,
          scenes: [scene],
          thumbnail: scene.metadata.thumbnail,
          description: scene.metadata.description
        };
        
        chapters.push(currentChapter);
      } else {
        currentChapter.scenes.push(scene);
        currentChapter.endTime = scene.endTime;
      }
    }
    
    this.chapters = chapters;
    this.emit('chaptersGenerated', { chapters: this.chapters });
  }

  /**
   * Determine if a new chapter should start
   */
  private shouldStartNewChapter(scene: Scene, currentChapter: Chapter): boolean {
    // Start new chapter if significant change in visual characteristics
    const lastScene = currentChapter.scenes[currentChapter.scenes.length - 1];
    
    if (!lastScene.metadata.dominantColors || !scene.metadata.dominantColors) {
      return false;
    }
    
    // Compare dominant colors
    const colorSimilarity = this.calculateColorSimilarity(
      lastScene.metadata.dominantColors,
      scene.metadata.dominantColors
    );
    
    // Compare brightness
    const brightnessDiff = Math.abs(
      (lastScene.metadata.averageBrightness || 0) - (scene.metadata.averageBrightness || 0)
    );
    
    return colorSimilarity < 0.5 || brightnessDiff > 0.3;
  }

  /**
   * Calculate similarity between color palettes
   */
  private calculateColorSimilarity(colors1: string[], colors2: string[]): number {
    if (colors1.length === 0 || colors2.length === 0) return 0;
    
    let maxSimilarity = 0;
    
    for (const color1 of colors1) {
      for (const color2 of colors2) {
        const similarity = this.compareColors(color1, color2);
        maxSimilarity = Math.max(maxSimilarity, similarity);
      }
    }
    
    return maxSimilarity;
  }

  /**
   * Compare two RGB color strings
   */
  private compareColors(color1: string, color2: string): number {
    const rgb1 = color1.match(/\d+/g)?.map(Number) || [0, 0, 0];
    const rgb2 = color2.match(/\d+/g)?.map(Number) || [0, 0, 0];
    
    const distance = Math.sqrt(
      Math.pow(rgb1[0] - rgb2[0], 2) +
      Math.pow(rgb1[1] - rgb2[1], 2) +
      Math.pow(rgb1[2] - rgb2[2], 2)
    );
    
    return 1 - (distance / (Math.sqrt(3) * 255)); // Normalize to 0-1
  }

  /**
   * Generate chapter title based on scene characteristics
   */
  private generateChapterTitle(scene: Scene): string {
    if (scene.metadata.description) {
      return scene.metadata.description;
    }
    
    if (scene.metadata.objectsDetected && scene.metadata.objectsDetected.length > 0) {
      return `Scene with ${scene.metadata.objectsDetected[0]}`;
    }
    
    const minutes = Math.floor(scene.startTime / 60);
    const seconds = Math.floor(scene.startTime % 60);
    return `Chapter ${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Public API methods

  /**
   * Get all detected scenes
   */
  getScenes(): Scene[] {
    return [...this.scenes];
  }

  /**
   * Get generated chapters
   */
  getChapters(): Chapter[] {
    return [...this.chapters];
  }

  /**
   * Get scene at specific time
   */
  getSceneAtTime(time: number): Scene | null {
    return this.scenes.find(scene => 
      time >= scene.startTime && time <= scene.endTime
    ) || null;
  }

  /**
   * Jump to specific scene
   */
  jumpToScene(sceneId: string): void {
    const scene = this.scenes.find(s => s.id === sceneId);
    if (scene && this.videoElement) {
      this.videoElement.currentTime = scene.startTime;
      this.emit('sceneJump', { scene });
    }
  }

  /**
   * Jump to specific chapter
   */
  jumpToChapter(chapterId: string): void {
    const chapter = this.chapters.find(c => c.id === chapterId);
    if (chapter && this.videoElement) {
      this.videoElement.currentTime = chapter.startTime;
      this.emit('chapterJump', { chapter });
    }
  }

  /**
   * Export scenes data
   */
  exportScenes(): string {
    return JSON.stringify({
      scenes: this.scenes,
      chapters: this.chapters,
      metadata: {
        totalScenes: this.scenes.length,
        totalChapters: this.chapters.length,
        duration: this.videoElement?.duration || 0,
        exportTime: Date.now()
      }
    }, null, 2);
  }

  /**
   * Import scenes data
   */
  importScenes(data: string): void {
    try {
      const parsed = JSON.parse(data);
      this.scenes = parsed.scenes || [];
      this.chapters = parsed.chapters || [];
      
      this.emit('scenesImported', {
        scenes: this.scenes,
        chapters: this.chapters
      });
    } catch (error) {
      console.error('Failed to import scenes:', error);
    }
  }
}

// Default configuration
export const defaultSceneDetectionConfig: SceneDetectionConfig = {
  enabled: true,
  sensitivity: 0.7,
  minSceneDuration: 2.0,
  useAudioAnalysis: true,
  useMotionDetection: true,
  autoGenerateChapters: true,
  algorithms: {
    histogram: true,
    edge: true,
    optical: true,
    audio: true
  },
  generateThumbnails: true,
  aiServices: {
    enabled: false
  }
};
