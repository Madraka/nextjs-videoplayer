/**
 * AI Context
 * Manages AI-powered features for the video player
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

// AI feature interfaces
interface AIConfig {
  enabled: boolean;
  apiKey?: string;
  endpoint?: string;
  model: string;
  features: {
    smartThumbnails: boolean;
    contentAnalysis: boolean;
    autoChapters: boolean;
    sceneDetection: boolean;
    objectDetection: boolean;
    transcription: boolean;
    translation: boolean;
    smartCaptions: boolean;
    contentModeration: boolean;
    recommendations: boolean;
    qualityEnhancement: boolean;
    accessibilityFeatures: boolean;
  };
  privacy: {
    dataRetention: number; // days
    anonymizeData: boolean;
    localProcessing: boolean;
    enableTelemetry: boolean;
  };
}

interface SmartThumbnail {
  timestamp: number;
  confidence: number;
  url: string;
  description?: string;
  tags: string[];
  isKeyFrame: boolean;
}

interface ContentAnalysis {
  duration: number;
  scenes: Array<{
    start: number;
    end: number;
    type: 'action' | 'dialogue' | 'music' | 'credits' | 'intro' | 'outro';
    confidence: number;
    description: string;
  }>;
  objects: Array<{
    timestamp: number;
    objects: Array<{
      name: string;
      confidence: number;
      boundingBox: { x: number; y: number; width: number; height: number };
    }>;
  }>;
  emotions: Array<{
    timestamp: number;
    emotions: Record<string, number>;
  }>;
  topics: string[];
  complexity: 'low' | 'medium' | 'high';
  ageRating: string;
  contentWarnings: string[];
}

interface AutoChapter {
  start: number;
  end: number;
  title: string;
  description?: string;
  confidence: number;
  type: 'auto' | 'manual';
  thumbnail?: string;
}

interface TranscriptionSegment {
  start: number;
  end: number;
  text: string;
  confidence: number;
  speaker?: string;
  language: string;
}

interface Transcription {
  segments: TranscriptionSegment[];
  language: string;
  confidence: number;
  speakers: string[];
  metadata: {
    duration: number;
    wordCount: number;
    speakerChanges: number;
  };
}

interface Translation {
  originalLanguage: string;
  targetLanguage: string;
  segments: Array<{
    start: number;
    end: number;
    originalText: string;
    translatedText: string;
    confidence: number;
  }>;
  metadata: {
    model: string;
    translatedAt: number;
  };
}

interface SmartCaption {
  start: number;
  end: number;
  text: string;
  position: { x: number; y: number };
  style: {
    fontSize: number;
    color: string;
    backgroundColor: string;
    fontWeight: string;
  };
  type: 'dialogue' | 'sound-effect' | 'music' | 'speaker-label';
  confidence: number;
}

interface ContentModerationResult {
  isAppropriate: boolean;
  confidence: number;
  categories: Array<{
    category: string;
    severity: 'low' | 'medium' | 'high';
    confidence: number;
    timestamps: number[];
  }>;
  ageRating: string;
  warnings: string[];
}

interface VideoRecommendation {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: number;
  similarity: number;
  reasons: string[];
  category: string;
  metadata?: Record<string, any>;
}

interface QualityEnhancement {
  originalResolution: { width: number; height: number };
  enhancedResolution: { width: number; height: number };
  improvements: Array<{
    type: 'upscaling' | 'denoising' | 'stabilization' | 'colorCorrection';
    confidence: number;
    parameters: Record<string, any>;
  }>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
}

interface AccessibilityFeature {
  type: 'audioDescription' | 'signLanguage' | 'highContrast' | 'slowMotion';
  enabled: boolean;
  confidence: number;
  metadata: Record<string, any>;
}

// AI context interface
interface AIContextValue {
  config: AIConfig;
  isEnabled: boolean;
  isProcessing: boolean;
  error?: Error;
  
  // Configuration
  updateConfig: (config: Partial<AIConfig>) => void;
  
  // Smart thumbnails
  smartThumbnails: SmartThumbnail[];
  generateSmartThumbnails: (videoUrl: string, count?: number) => Promise<SmartThumbnail[]>;
  selectBestThumbnail: (thumbnails: SmartThumbnail[]) => SmartThumbnail;
  
  // Content analysis
  contentAnalysis?: ContentAnalysis;
  analyzeContent: (videoUrl: string) => Promise<ContentAnalysis>;
  
  // Auto chapters
  autoChapters: AutoChapter[];
  generateAutoChapters: (videoUrl: string) => Promise<AutoChapter[]>;
  updateChapter: (index: number, updates: Partial<AutoChapter>) => void;
  
  // Transcription
  transcription?: Transcription;
  generateTranscription: (videoUrl: string, language?: string) => Promise<Transcription>;
  
  // Translation
  translations: Map<string, Translation>;
  translateContent: (targetLanguage: string, source?: 'transcription' | 'captions') => Promise<Translation>;
  
  // Smart captions
  smartCaptions: SmartCaption[];
  generateSmartCaptions: (videoUrl: string) => Promise<SmartCaption[]>;
  customizeCaptionStyle: (style: Partial<SmartCaption['style']>) => void;
  
  // Content moderation
  moderationResult?: ContentModerationResult;
  moderateContent: (videoUrl: string) => Promise<ContentModerationResult>;
  
  // Recommendations
  recommendations: VideoRecommendation[];
  getRecommendations: (currentVideoId: string, count?: number) => Promise<VideoRecommendation[]>;
  
  // Quality enhancement
  qualityEnhancement?: QualityEnhancement;
  enhanceQuality: (videoUrl: string, targetResolution?: { width: number; height: number }) => Promise<QualityEnhancement>;
  
  // Accessibility features
  accessibilityFeatures: AccessibilityFeature[];
  generateAccessibilityFeatures: (videoUrl: string) => Promise<AccessibilityFeature[]>;
  toggleAccessibilityFeature: (type: AccessibilityFeature['type'], enabled: boolean) => void;
  
  // Processing status
  getProcessingStatus: (taskId: string) => Promise<{ status: string; progress: number; result?: any }>;
  cancelProcessing: (taskId: string) => Promise<void>;
  
  // Model management
  availableModels: string[];
  currentModel: string;
  switchModel: (model: string) => Promise<void>;
  
  // Batch processing
  processBatch: (videoUrls: string[], features: (keyof AIConfig['features'])[]) => Promise<Map<string, any>>;
  
  // Export/Import
  exportAIData: () => string;
  importAIData: (data: string) => Promise<void>;
}

// Create context
const AIContext = createContext<AIContextValue | undefined>(undefined);

// Provider props
interface AIProviderProps {
  children: React.ReactNode;
  config?: Partial<AIConfig>;
  onProcessingStart?: (feature: keyof AIConfig['features']) => void;
  onProcessingComplete?: (feature: keyof AIConfig['features'], result: any) => void;
  onError?: (error: Error) => void;
}

// Default configuration
const defaultConfig: AIConfig = {
  enabled: false,
  model: 'gpt-4-vision',
  features: {
    smartThumbnails: true,
    contentAnalysis: true,
    autoChapters: true,
    sceneDetection: true,
    objectDetection: false,
    transcription: true,
    translation: false,
    smartCaptions: true,
    contentModeration: false,
    recommendations: true,
    qualityEnhancement: false,
    accessibilityFeatures: true
  },
  privacy: {
    dataRetention: 30,
    anonymizeData: true,
    localProcessing: false,
    enableTelemetry: false
  }
};

// Provider component
export function AIProvider({ 
  children, 
  config: initialConfig,
  onProcessingStart,
  onProcessingComplete,
  onError
}: AIProviderProps) {
  const [config, setConfig] = useState<AIConfig>({ ...defaultConfig, ...initialConfig });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | undefined>();
  
  // Feature state
  const [smartThumbnails, setSmartThumbnails] = useState<SmartThumbnail[]>([]);
  const [contentAnalysis, setContentAnalysis] = useState<ContentAnalysis | undefined>();
  const [autoChapters, setAutoChapters] = useState<AutoChapter[]>([]);
  const [transcription, setTranscription] = useState<Transcription | undefined>();
  const [translations, setTranslations] = useState<Map<string, Translation>>(new Map());
  const [smartCaptions, setSmartCaptions] = useState<SmartCaption[]>([]);
  const [moderationResult, setModerationResult] = useState<ContentModerationResult | undefined>();
  const [recommendations, setRecommendations] = useState<VideoRecommendation[]>([]);
  const [qualityEnhancement, setQualityEnhancement] = useState<QualityEnhancement | undefined>();
  const [accessibilityFeatures, setAccessibilityFeatures] = useState<AccessibilityFeature[]>([]);
  
  // Model management
  const [availableModels] = useState<string[]>(['gpt-4-vision', 'claude-3-vision', 'gemini-pro-vision']);
  const [currentModel, setCurrentModel] = useState(config.model);
  
  // Processing tasks
  const processingTasks = useRef<Map<string, AbortController>>(new Map());

  const isEnabled = config.enabled && !!(config.apiKey || config.privacy.localProcessing);

  // Update configuration
  const updateConfig = useCallback((newConfig: Partial<AIConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...newConfig,
      features: { ...prev.features, ...newConfig.features },
      privacy: { ...prev.privacy, ...newConfig.privacy }
    }));
  }, []);

  // Mock AI API call (replace with actual AI service)
  const callAIService = useCallback(async (endpoint: string, data: any, signal?: AbortSignal): Promise<any> => {
    if (!isEnabled) {
      throw new Error('AI features are not enabled');
    }

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
    
    if (signal?.aborted) {
      throw new Error('Processing was cancelled');
    }

    // Mock responses based on endpoint
    switch (endpoint) {
      case 'smart-thumbnails':
        return Array.from({ length: data.count || 5 }, (_, i) => ({
          timestamp: (i + 1) * (data.duration || 100) / (data.count || 5),
          confidence: 0.8 + Math.random() * 0.2,
          url: `/api/placeholder/160/90`,
          description: `Key moment ${i + 1}`,
          tags: ['important', 'visual'],
          isKeyFrame: Math.random() > 0.5
        }));
        
      case 'content-analysis':
        return {
          duration: data.duration || 300,
          scenes: [
            { start: 0, end: 60, type: 'intro', confidence: 0.9, description: 'Introduction scene' },
            { start: 60, end: 240, type: 'action', confidence: 0.85, description: 'Main content' },
            { start: 240, end: 300, type: 'outro', confidence: 0.8, description: 'Conclusion' }
          ],
          objects: [],
          emotions: [],
          topics: ['technology', 'education'],
          complexity: 'medium',
          ageRating: 'G',
          contentWarnings: []
        };
        
      case 'auto-chapters':
        return [
          { start: 0, end: 60, title: 'Introduction', confidence: 0.9, type: 'auto' },
          { start: 60, end: 180, title: 'Main Topic', confidence: 0.85, type: 'auto' },
          { start: 180, end: 300, title: 'Conclusion', confidence: 0.8, type: 'auto' }
        ];
        
      case 'transcription':
        return {
          segments: [
            { start: 0, end: 5, text: 'Welcome to this video.', confidence: 0.95, language: 'en' },
            { start: 5, end: 10, text: 'Today we will discuss...', confidence: 0.92, language: 'en' }
          ],
          language: 'en',
          confidence: 0.93,
          speakers: ['Speaker 1'],
          metadata: { duration: 300, wordCount: 150, speakerChanges: 0 }
        };
        
      default:
        return {};
    }
  }, [isEnabled]);

  // Generate smart thumbnails
  const generateSmartThumbnails = useCallback(async (videoUrl: string, count = 5): Promise<SmartThumbnail[]> => {
    if (!config.features.smartThumbnails) {
      throw new Error('Smart thumbnails feature is disabled');
    }

    try {
      setIsProcessing(true);
      onProcessingStart?.('smartThumbnails');
      
      const controller = new AbortController();
      const taskId = `thumbnails_${Date.now()}`;
      processingTasks.current.set(taskId, controller);

      const result = await callAIService('smart-thumbnails', { videoUrl, count }, controller.signal);
      
      setSmartThumbnails(result);
      onProcessingComplete?.('smartThumbnails', result);
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [config.features.smartThumbnails, callAIService, onProcessingStart, onProcessingComplete, onError]);

  // Select best thumbnail
  const selectBestThumbnail = useCallback((thumbnails: SmartThumbnail[]): SmartThumbnail => {
    return thumbnails.reduce((best, current) => 
      current.confidence > best.confidence ? current : best
    );
  }, []);

  // Analyze content
  const analyzeContent = useCallback(async (videoUrl: string): Promise<ContentAnalysis> => {
    if (!config.features.contentAnalysis) {
      throw new Error('Content analysis feature is disabled');
    }

    try {
      setIsProcessing(true);
      onProcessingStart?.('contentAnalysis');
      
      const controller = new AbortController();
      const taskId = `analysis_${Date.now()}`;
      processingTasks.current.set(taskId, controller);

      const result = await callAIService('content-analysis', { videoUrl }, controller.signal);
      
      setContentAnalysis(result);
      onProcessingComplete?.('contentAnalysis', result);
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [config.features.contentAnalysis, callAIService, onProcessingStart, onProcessingComplete, onError]);

  // Generate auto chapters
  const generateAutoChapters = useCallback(async (videoUrl: string): Promise<AutoChapter[]> => {
    if (!config.features.autoChapters) {
      throw new Error('Auto chapters feature is disabled');
    }

    try {
      setIsProcessing(true);
      onProcessingStart?.('autoChapters');
      
      const controller = new AbortController();
      const taskId = `chapters_${Date.now()}`;
      processingTasks.current.set(taskId, controller);

      const result = await callAIService('auto-chapters', { videoUrl }, controller.signal);
      
      setAutoChapters(result);
      onProcessingComplete?.('autoChapters', result);
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [config.features.autoChapters, callAIService, onProcessingStart, onProcessingComplete, onError]);

  // Update chapter
  const updateChapter = useCallback((index: number, updates: Partial<AutoChapter>) => {
    setAutoChapters(prev => prev.map((chapter, i) => 
      i === index ? { ...chapter, ...updates } : chapter
    ));
  }, []);

  // Generate transcription
  const generateTranscription = useCallback(async (videoUrl: string, language = 'auto'): Promise<Transcription> => {
    if (!config.features.transcription) {
      throw new Error('Transcription feature is disabled');
    }

    try {
      setIsProcessing(true);
      onProcessingStart?.('transcription');
      
      const controller = new AbortController();
      const taskId = `transcription_${Date.now()}`;
      processingTasks.current.set(taskId, controller);

      const result = await callAIService('transcription', { videoUrl, language }, controller.signal);
      
      setTranscription(result);
      onProcessingComplete?.('transcription', result);
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [config.features.transcription, callAIService, onProcessingStart, onProcessingComplete, onError]);

  // Translate content
  const translateContent = useCallback(async (targetLanguage: string, source: 'transcription' | 'captions' = 'transcription'): Promise<Translation> => {
    if (!config.features.translation) {
      throw new Error('Translation feature is disabled');
    }

    try {
      setIsProcessing(true);
      
      // Mock translation result
      const result: Translation = {
        originalLanguage: 'en',
        targetLanguage,
        segments: [],
        metadata: {
          model: currentModel,
          translatedAt: Date.now()
        }
      };

      setTranslations(prev => new Map(prev).set(targetLanguage, result));
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [config.features.translation, currentModel, onError]);

  // Generate smart captions
  const generateSmartCaptions = useCallback(async (videoUrl: string): Promise<SmartCaption[]> => {
    if (!config.features.smartCaptions) {
      throw new Error('Smart captions feature is disabled');
    }

    try {
      setIsProcessing(true);
      
      // Mock smart captions
      const result: SmartCaption[] = [
        {
          start: 0,
          end: 5,
          text: 'Welcome to this video',
          position: { x: 50, y: 80 },
          style: {
            fontSize: 16,
            color: '#ffffff',
            backgroundColor: 'rgba(0,0,0,0.7)',
            fontWeight: 'normal'
          },
          type: 'dialogue',
          confidence: 0.95
        }
      ];

      setSmartCaptions(result);
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [config.features.smartCaptions, onError]);

  // Customize caption style
  const customizeCaptionStyle = useCallback((style: Partial<SmartCaption['style']>) => {
    setSmartCaptions(prev => prev.map(caption => ({
      ...caption,
      style: { ...caption.style, ...style }
    })));
  }, []);

  // Moderate content
  const moderateContent = useCallback(async (videoUrl: string): Promise<ContentModerationResult> => {
    if (!config.features.contentModeration) {
      throw new Error('Content moderation feature is disabled');
    }

    try {
      setIsProcessing(true);
      
      // Mock moderation result
      const result: ContentModerationResult = {
        isAppropriate: true,
        confidence: 0.95,
        categories: [],
        ageRating: 'G',
        warnings: []
      };

      setModerationResult(result);
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [config.features.contentModeration, onError]);

  // Get recommendations
  const getRecommendations = useCallback(async (currentVideoId: string, count = 5): Promise<VideoRecommendation[]> => {
    if (!config.features.recommendations) {
      throw new Error('Recommendations feature is disabled');
    }

    try {
      setIsProcessing(true);
      
      // Mock recommendations
      const result: VideoRecommendation[] = Array.from({ length: count }, (_, i) => ({
        id: `video_${i + 1}`,
        title: `Recommended Video ${i + 1}`,
        description: `This is a recommended video based on your viewing history`,
        thumbnailUrl: `/api/placeholder/320/180`,
        duration: 300 + Math.random() * 600,
        similarity: 0.7 + Math.random() * 0.3,
        reasons: ['Similar content', 'Popular choice'],
        category: 'Educational',
        metadata: {}
      }));

      setRecommendations(result);
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [config.features.recommendations, onError]);

  // Enhance quality
  const enhanceQuality = useCallback(async (videoUrl: string, targetResolution?: { width: number; height: number }): Promise<QualityEnhancement> => {
    if (!config.features.qualityEnhancement) {
      throw new Error('Quality enhancement feature is disabled');
    }

    try {
      setIsProcessing(true);
      
      // Mock quality enhancement
      const result: QualityEnhancement = {
        originalResolution: { width: 1280, height: 720 },
        enhancedResolution: targetResolution || { width: 1920, height: 1080 },
        improvements: [
          { type: 'upscaling', confidence: 0.9, parameters: { algorithm: 'ESRGAN' } }
        ],
        status: 'completed',
        progress: 100
      };

      setQualityEnhancement(result);
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [config.features.qualityEnhancement, onError]);

  // Generate accessibility features
  const generateAccessibilityFeatures = useCallback(async (videoUrl: string): Promise<AccessibilityFeature[]> => {
    if (!config.features.accessibilityFeatures) {
      throw new Error('Accessibility features are disabled');
    }

    try {
      setIsProcessing(true);
      
      // Mock accessibility features
      const result: AccessibilityFeature[] = [
        {
          type: 'audioDescription',
          enabled: false,
          confidence: 0.8,
          metadata: { available: true }
        },
        {
          type: 'signLanguage',
          enabled: false,
          confidence: 0.6,
          metadata: { detected: false }
        }
      ];

      setAccessibilityFeatures(result);
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [config.features.accessibilityFeatures, onError]);

  // Toggle accessibility feature
  const toggleAccessibilityFeature = useCallback((type: AccessibilityFeature['type'], enabled: boolean) => {
    setAccessibilityFeatures(prev => prev.map(feature => 
      feature.type === type ? { ...feature, enabled } : feature
    ));
  }, []);

  // Get processing status
  const getProcessingStatus = useCallback(async (taskId: string): Promise<{ status: string; progress: number; result?: any }> => {
    // Mock status
    return {
      status: 'completed',
      progress: 100,
      result: {}
    };
  }, []);

  // Cancel processing
  const cancelProcessing = useCallback(async (taskId: string) => {
    const controller = processingTasks.current.get(taskId);
    if (controller) {
      controller.abort();
      processingTasks.current.delete(taskId);
    }
  }, []);

  // Switch model
  const switchModel = useCallback(async (model: string) => {
    if (!availableModels.includes(model)) {
      throw new Error(`Model ${model} is not available`);
    }
    
    setCurrentModel(model);
    updateConfig({ model });
  }, [availableModels, updateConfig]);

  // Process batch
  const processBatch = useCallback(async (videoUrls: string[], features: (keyof AIConfig['features'])[]): Promise<Map<string, any>> => {
    const results = new Map();
    
    for (const url of videoUrls) {
      const urlResults: any = {};
      
      for (const feature of features) {
        try {
          switch (feature) {
            case 'smartThumbnails':
              urlResults.smartThumbnails = await generateSmartThumbnails(url);
              break;
            case 'contentAnalysis':
              urlResults.contentAnalysis = await analyzeContent(url);
              break;
            case 'autoChapters':
              urlResults.autoChapters = await generateAutoChapters(url);
              break;
            // Add other features as needed
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          urlResults[feature] = { error: errorMessage };
        }
      }
      
      results.set(url, urlResults);
    }
    
    return results;
  }, [generateSmartThumbnails, analyzeContent, generateAutoChapters]);

  // Export AI data
  const exportAIData = useCallback((): string => {
    const data = {
      config,
      smartThumbnails,
      contentAnalysis,
      autoChapters,
      transcription,
      translations: Array.from(translations.entries()),
      smartCaptions,
      moderationResult,
      recommendations,
      qualityEnhancement,
      accessibilityFeatures,
      exportedAt: Date.now()
    };
    
    return JSON.stringify(data, null, 2);
  }, [config, smartThumbnails, contentAnalysis, autoChapters, transcription, translations, smartCaptions, moderationResult, recommendations, qualityEnhancement, accessibilityFeatures]);

  // Import AI data
  const importAIData = useCallback(async (data: string) => {
    try {
      const parsed = JSON.parse(data);
      
      if (parsed.config) updateConfig(parsed.config);
      if (parsed.smartThumbnails) setSmartThumbnails(parsed.smartThumbnails);
      if (parsed.contentAnalysis) setContentAnalysis(parsed.contentAnalysis);
      if (parsed.autoChapters) setAutoChapters(parsed.autoChapters);
      if (parsed.transcription) setTranscription(parsed.transcription);
      if (parsed.translations) setTranslations(new Map(parsed.translations));
      if (parsed.smartCaptions) setSmartCaptions(parsed.smartCaptions);
      if (parsed.moderationResult) setModerationResult(parsed.moderationResult);
      if (parsed.recommendations) setRecommendations(parsed.recommendations);
      if (parsed.qualityEnhancement) setQualityEnhancement(parsed.qualityEnhancement);
      if (parsed.accessibilityFeatures) setAccessibilityFeatures(parsed.accessibilityFeatures);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    }
  }, [updateConfig]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      processingTasks.current.forEach(controller => controller.abort());
      processingTasks.current.clear();
    };
  }, []);

  const contextValue: AIContextValue = {
    config,
    isEnabled,
    isProcessing,
    error,
    updateConfig,
    smartThumbnails,
    generateSmartThumbnails,
    selectBestThumbnail,
    contentAnalysis,
    analyzeContent,
    autoChapters,
    generateAutoChapters,
    updateChapter,
    transcription,
    generateTranscription,
    translations,
    translateContent,
    smartCaptions,
    generateSmartCaptions,
    customizeCaptionStyle,
    moderationResult,
    moderateContent,
    recommendations,
    getRecommendations,
    qualityEnhancement,
    enhanceQuality,
    accessibilityFeatures,
    generateAccessibilityFeatures,
    toggleAccessibilityFeature,
    getProcessingStatus,
    cancelProcessing,
    availableModels,
    currentModel,
    switchModel,
    processBatch,
    exportAIData,
    importAIData
  };

  return (
    <AIContext.Provider value={contextValue}>
      {children}
    </AIContext.Provider>
  );
}

// Hook to use AI context
export function useAI(): AIContextValue {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}

// Convenience hooks
export function useSmartThumbnails() {
  const { smartThumbnails, generateSmartThumbnails, selectBestThumbnail } = useAI();
  return { smartThumbnails, generateSmartThumbnails, selectBestThumbnail };
}

export function useContentAnalysis() {
  const { contentAnalysis, analyzeContent } = useAI();
  return { contentAnalysis, analyzeContent };
}

export function useAutoChapters() {
  const { autoChapters, generateAutoChapters, updateChapter } = useAI();
  return { autoChapters, generateAutoChapters, updateChapter };
}

export function useTranscription() {
  const { transcription, generateTranscription, translations, translateContent } = useAI();
  return { transcription, generateTranscription, translations, translateContent };
}
