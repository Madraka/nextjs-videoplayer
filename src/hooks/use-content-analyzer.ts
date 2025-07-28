/**
 * Content Analyzer Hook
 * Analyzes video content for insights, quality metrics, and recommendations
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

// Content analysis interfaces
interface VideoAnalysis {
  duration: number;
  resolution: {
    width: number;
    height: number;
  };
  bitrate: {
    video: number;
    audio: number;
    total: number;
  };
  frameRate: number;
  aspectRatio: string;
  codec: {
    video: string;
    audio: string;
  };
  fileSize?: number;
  audioChannels: number;
  hasSubtitles: boolean;
  hasChapters: boolean;
}

interface ContentMetrics {
  averageVolume: number;
  volumeVariance: number;
  silenceDetection: SilenceSegment[];
  sceneChanges: SceneChange[];
  motionActivity: number;
  colorAnalysis: ColorAnalysis;
  qualityScore: number;
  recommendedSettings: RecommendedSettings;
}

interface SilenceSegment {
  startTime: number;
  endTime: number;
  duration: number;
  volume: number;
}

interface SceneChange {
  time: number;
  confidence: number;
  type: 'cut' | 'fade' | 'dissolve';
}

interface ColorAnalysis {
  averageBrightness: number;
  contrast: number;
  saturation: number;
  dominantColors: string[];
  colorTemperature: 'warm' | 'cool' | 'neutral';
}

interface RecommendedSettings {
  quality: 'auto' | 'high' | 'medium' | 'low';
  bufferSize: number;
  preloadAmount: number;
  adaptiveBitrate: boolean;
  skipSilence: boolean;
  enhanceAudio: boolean;
}

interface ContentAnalyzerConfig {
  enableRealTimeAnalysis: boolean;
  analysisInterval: number; // ms
  sampleRate: number; // Hz for audio analysis
  frameAnalysisInterval: number; // frames
  enableAdvancedMetrics: boolean;
  enableML: boolean; // machine learning features
  maxAnalysisDuration: number; // max time to analyze in seconds
}

const defaultConfig: ContentAnalyzerConfig = {
  enableRealTimeAnalysis: true,
  analysisInterval: 1000,
  sampleRate: 44100,
  frameAnalysisInterval: 30,
  enableAdvancedMetrics: true,
  enableML: false,
  maxAnalysisDuration: 300 // 5 minutes
};

export function useContentAnalyzer(
  videoElement: HTMLVideoElement | null,
  config: Partial<ContentAnalyzerConfig> = {}
) {
  const fullConfig = { ...defaultConfig, ...config };
  
  const [analysis, setAnalysis] = useState<VideoAnalysis | null>(null);
  const [metrics, setMetrics] = useState<ContentMetrics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  // Refs for analysis
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const analysisData = useRef<{
    audioSamples: number[];
    frameBrightness: number[];
    sceneChanges: SceneChange[];
    volumeHistory: number[];
  }>({
    audioSamples: [],
    frameBrightness: [],
    sceneChanges: [],
    volumeHistory: []
  });

  // Initialize canvas for frame analysis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      canvas.current = document.createElement('canvas');
      context.current = canvas.current.getContext('2d');
    }
  }, []);

  // Initialize audio context
  const initializeAudioAnalysis = useCallback(async () => {
    if (!videoElement || audioContext.current) return;

    try {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const source = audioContext.current.createMediaElementSource(videoElement);
      analyser.current = audioContext.current.createAnalyser();
      
      analyser.current.fftSize = 256;
      source.connect(analyser.current);
      analyser.current.connect(audioContext.current.destination);
      
    } catch (err) {
      console.warn('Failed to initialize audio analysis:', err);
    }
  }, [videoElement]);

  // Analyze basic video properties
  const analyzeVideoProperties = useCallback(async (): Promise<VideoAnalysis | null> => {
    if (!videoElement) return null;

    try {
      const analysis: VideoAnalysis = {
        duration: videoElement.duration || 0,
        resolution: {
          width: videoElement.videoWidth || 0,
          height: videoElement.videoHeight || 0
        },
        bitrate: {
          video: 0, // Will be estimated
          audio: 0, // Will be estimated
          total: 0
        },
        frameRate: 30, // Default, hard to detect
        aspectRatio: videoElement.videoWidth && videoElement.videoHeight 
          ? `${videoElement.videoWidth}:${videoElement.videoHeight}`
          : '16:9',
        codec: {
          video: 'unknown',
          audio: 'unknown'
        },
        audioChannels: 2, // Default assumption
        hasSubtitles: videoElement.textTracks.length > 0,
        hasChapters: false // Would need to check for chapter tracks
      };

      // Estimate bitrate based on file size if available
      if ((videoElement as any).fileSize) {
        const fileSize = (videoElement as any).fileSize;
        analysis.fileSize = fileSize;
        analysis.bitrate.total = Math.round((fileSize * 8) / analysis.duration);
        analysis.bitrate.video = Math.round(analysis.bitrate.total * 0.8); // 80% for video
        analysis.bitrate.audio = Math.round(analysis.bitrate.total * 0.2); // 20% for audio
      }

      return analysis;
    } catch (err) {
      console.warn('Failed to analyze video properties:', err);
      return null;
    }
  }, [videoElement]);

  // Analyze audio content
  const analyzeAudio = useCallback((): Partial<ContentMetrics> => {
    if (!analyser.current) return {};

    const bufferLength = analyser.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.current.getByteFrequencyData(dataArray);

    // Calculate average volume
    const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
    const normalizedVolume = average / 255;

    analysisData.current.volumeHistory.push(normalizedVolume);

    // Keep only last 1000 samples for performance
    if (analysisData.current.volumeHistory.length > 1000) {
      analysisData.current.volumeHistory.shift();
    }

    // Calculate volume variance
    const mean = analysisData.current.volumeHistory.reduce((sum, v) => sum + v, 0) / analysisData.current.volumeHistory.length;
    const variance = analysisData.current.volumeHistory.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / analysisData.current.volumeHistory.length;

    // Detect silence segments
    const silenceThreshold = 0.05;
    const silenceSegments: SilenceSegment[] = [];
    
    if (normalizedVolume < silenceThreshold && videoElement) {
      const currentTime = videoElement.currentTime;
      const lastSegment = silenceSegments[silenceSegments.length - 1];
      
      if (!lastSegment || currentTime - lastSegment.endTime > 1) {
        silenceSegments.push({
          startTime: currentTime,
          endTime: currentTime,
          duration: 0,
          volume: normalizedVolume
        });
      } else {
        lastSegment.endTime = currentTime;
        lastSegment.duration = lastSegment.endTime - lastSegment.startTime;
      }
    }

    return {
      averageVolume: mean,
      volumeVariance: variance,
      silenceDetection: silenceSegments
    };
  }, [videoElement]);

  // Analyze video frame
  const analyzeFrame = useCallback((): Partial<ContentMetrics> => {
    if (!videoElement || !canvas.current || !context.current) return {};

    try {
      // Capture current frame
      canvas.current.width = 160; // Small size for performance
      canvas.current.height = 90;
      
      context.current.drawImage(videoElement, 0, 0, 160, 90);
      const imageData = context.current.getImageData(0, 0, 160, 90);
      const data = imageData.data;

      // Calculate brightness
      let totalBrightness = 0;
      let totalSaturation = 0;
      const colorCounts: { [key: string]: number } = {};

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Calculate brightness (perceived luminance)
        const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        totalBrightness += brightness;

        // Calculate saturation
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const saturation = max === 0 ? 0 : (max - min) / max;
        totalSaturation += saturation;

        // Count dominant colors (simplified)
        const colorKey = `${Math.floor(r / 32)}-${Math.floor(g / 32)}-${Math.floor(b / 32)}`;
        colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
      }

      const pixelCount = data.length / 4;
      const averageBrightness = totalBrightness / pixelCount;
      const averageSaturation = totalSaturation / pixelCount;

      // Store brightness for scene change detection
      analysisData.current.frameBrightness.push(averageBrightness);
      
      // Keep only last 100 frames
      if (analysisData.current.frameBrightness.length > 100) {
        analysisData.current.frameBrightness.shift();
      }

      // Detect scene changes
      const sceneChanges: SceneChange[] = [];
      if (analysisData.current.frameBrightness.length > 10) {
        const recent = analysisData.current.frameBrightness.slice(-10);
        const variance = recent.reduce((sum, b, i, arr) => {
          if (i === 0) return sum;
          return sum + Math.abs(b - arr[i - 1]);
        }, 0) / (recent.length - 1);

        if (variance > 0.2) { // Threshold for scene change
          sceneChanges.push({
            time: videoElement.currentTime,
            confidence: Math.min(variance * 5, 1),
            type: variance > 0.4 ? 'cut' : 'fade'
          });
        }
      }

      // Find dominant colors
      const sortedColors = Object.entries(colorCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([color]) => {
          const [r, g, b] = color.split('-').map(x => parseInt(x) * 32);
          return `rgb(${r}, ${g}, ${b})`;
        });

      // Determine color temperature
      const avgRed = totalBrightness; // Simplified
      const avgBlue = totalSaturation; // Simplified
      const colorTemperature: ColorAnalysis['colorTemperature'] = 
        avgRed > avgBlue ? 'warm' : avgBlue > avgRed ? 'cool' : 'neutral';

      const colorAnalysis: ColorAnalysis = {
        averageBrightness,
        contrast: 0.5, // Would need more complex calculation
        saturation: averageSaturation,
        dominantColors: sortedColors,
        colorTemperature
      };

      return {
        sceneChanges,
        motionActivity: sceneChanges.length > 0 ? sceneChanges[0].confidence : 0,
        colorAnalysis
      };

    } catch (err) {
      console.warn('Failed to analyze frame:', err);
      return {};
    }
  }, [videoElement]);

  // Generate recommended settings
  const generateRecommendations = useCallback((
    analysis: VideoAnalysis,
    metrics: Partial<ContentMetrics>
  ): RecommendedSettings => {
    const recommendations: RecommendedSettings = {
      quality: 'auto',
      bufferSize: 10,
      preloadAmount: 30,
      adaptiveBitrate: true,
      skipSilence: false,
      enhanceAudio: false
    };

    // Adjust based on resolution
    if (analysis.resolution.width >= 1920) {
      recommendations.quality = 'high';
      recommendations.bufferSize = 20;
    } else if (analysis.resolution.width >= 1280) {
      recommendations.quality = 'medium';
      recommendations.bufferSize = 15;
    } else {
      recommendations.quality = 'low';
      recommendations.bufferSize = 10;
    }

    // Adjust based on content
    if (metrics.volumeVariance && metrics.volumeVariance < 0.01) {
      recommendations.enhanceAudio = true;
    }

    if (metrics.silenceDetection && metrics.silenceDetection.length > 10) {
      recommendations.skipSilence = true;
    }

    if (metrics.motionActivity && metrics.motionActivity > 0.3) {
      recommendations.bufferSize += 10; // More buffer for high motion
    }

    return recommendations;
  }, []);

  // Calculate quality score
  const calculateQualityScore = useCallback((
    analysis: VideoAnalysis,
    metrics: Partial<ContentMetrics>
  ): number => {
    let score = 50; // Base score

    // Resolution score (0-30 points)
    const resolutionScore = Math.min(30, (analysis.resolution.width / 1920) * 30);
    score += resolutionScore;

    // Bitrate score (0-20 points)
    const bitrateScore = Math.min(20, (analysis.bitrate.total / 5000000) * 20);
    score += bitrateScore;

    // Audio quality (0-20 points)
    if (metrics.averageVolume && metrics.volumeVariance) {
      const audioScore = (metrics.averageVolume * 10) - (metrics.volumeVariance * 10);
      score += Math.max(0, Math.min(20, audioScore));
    }

    // Visual quality (0-20 points)
    if (metrics.colorAnalysis) {
      const visualScore = (metrics.colorAnalysis.contrast * 10) + 
                         (metrics.colorAnalysis.saturation * 10);
      score += Math.max(0, Math.min(20, visualScore));
    }

    // Motion smoothness (0-10 points)
    if (metrics.motionActivity !== undefined) {
      const motionScore = Math.max(0, 10 - (metrics.motionActivity * 20));
      score += motionScore;
    }

    return Math.max(0, Math.min(100, score));
  }, []);

  // Start real-time analysis
  const startRealTimeAnalysis = useCallback(() => {
    if (!fullConfig.enableRealTimeAnalysis || !videoElement) return;

    const analyzeCurrentState = () => {
      const audioMetrics = analyzeAudio();
      const frameMetrics = analyzeFrame();
      
      const updatedMetrics: Partial<ContentMetrics> = {
        ...metrics,
        ...audioMetrics,
        ...frameMetrics
      };

      if (analysis) {
        const qualityScore = calculateQualityScore(analysis, updatedMetrics);
        const recommendedSettings = generateRecommendations(analysis, updatedMetrics);
        
        setMetrics({
          averageVolume: 0,
          volumeVariance: 0,
          silenceDetection: [],
          sceneChanges: [],
          motionActivity: 0,
          colorAnalysis: {
            averageBrightness: 0,
            contrast: 0,
            saturation: 0,
            dominantColors: [],
            colorTemperature: 'neutral'
          },
          qualityScore,
          recommendedSettings,
          ...updatedMetrics
        } as ContentMetrics);
      }
    };

    const interval = setInterval(analyzeCurrentState, fullConfig.analysisInterval);
    
    return () => clearInterval(interval);
  }, [
    fullConfig.enableRealTimeAnalysis,
    fullConfig.analysisInterval,
    videoElement,
    analyzeAudio,
    analyzeFrame,
    analysis,
    metrics,
    calculateQualityScore,
    generateRecommendations
  ]);

  // Perform full content analysis
  const analyzeContent = useCallback(async (): Promise<void> => {
    if (!videoElement || isAnalyzing) return;

    setIsAnalyzing(true);
    setProgress(0);
    setError(null);

    try {
      // Initialize audio analysis
      await initializeAudioAnalysis();

      // Analyze basic properties
      const videoAnalysis = await analyzeVideoProperties();
      if (!videoAnalysis) {
        throw new Error('Failed to analyze video properties');
      }

      setAnalysis(videoAnalysis);
      setProgress(25);

      // Perform frame analysis on key frames
      const originalTime = videoElement.currentTime;
      const duration = Math.min(videoAnalysis.duration, fullConfig.maxAnalysisDuration);
      const sampleCount = Math.min(50, Math.floor(duration / 10)); // Sample every 10 seconds, max 50 samples
      
      const frameAnalysisResults: Partial<ContentMetrics>[] = [];
      
      for (let i = 0; i < sampleCount; i++) {
        const time = (i / sampleCount) * duration;
        videoElement.currentTime = time;
        
        await new Promise(resolve => {
          const handleSeeked = () => {
            const frameResult = analyzeFrame();
            frameAnalysisResults.push(frameResult);
            setProgress(25 + (i / sampleCount) * 50);
            videoElement.removeEventListener('seeked', handleSeeked);
            resolve(undefined);
          };
          videoElement.addEventListener('seeked', handleSeeked);
        });
      }

      // Restore original time
      videoElement.currentTime = originalTime;

      // Aggregate frame analysis results
      const aggregatedMetrics: Partial<ContentMetrics> = {
        sceneChanges: frameAnalysisResults.flatMap(r => r.sceneChanges || []),
        motionActivity: frameAnalysisResults.reduce((sum, r) => sum + (r.motionActivity || 0), 0) / frameAnalysisResults.length,
        colorAnalysis: frameAnalysisResults[0]?.colorAnalysis // Use first sample for color analysis
      };

      setProgress(75);

      // Generate final metrics
      const qualityScore = calculateQualityScore(videoAnalysis, aggregatedMetrics);
      const recommendedSettings = generateRecommendations(videoAnalysis, aggregatedMetrics);

      const finalMetrics: ContentMetrics = {
        averageVolume: 0.5, // Default values
        volumeVariance: 0.1,
        silenceDetection: [],
        sceneChanges: aggregatedMetrics.sceneChanges || [],
        motionActivity: aggregatedMetrics.motionActivity || 0,
        colorAnalysis: aggregatedMetrics.colorAnalysis || {
          averageBrightness: 0.5,
          contrast: 0.5,
          saturation: 0.5,
          dominantColors: [],
          colorTemperature: 'neutral'
        },
        qualityScore,
        recommendedSettings
      };

      setMetrics(finalMetrics);
      setProgress(100);

    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [
    videoElement,
    isAnalyzing,
    initializeAudioAnalysis,
    analyzeVideoProperties,
    analyzeFrame,
    calculateQualityScore,
    generateRecommendations,
    fullConfig.maxAnalysisDuration
  ]);

  // Clear analysis data
  const clearAnalysis = useCallback(() => {
    setAnalysis(null);
    setMetrics(null);
    setProgress(0);
    setError(null);
    analysisData.current = {
      audioSamples: [],
      frameBrightness: [],
      sceneChanges: [],
      volumeHistory: []
    };
  }, []);

  // Initialize analysis when video loads
  useEffect(() => {
    if (!videoElement) return;

    const handleLoadedMetadata = () => {
      analyzeContent();
    };

    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);

    // Start analysis if metadata is already available
    if (videoElement.readyState >= 1) {
      analyzeContent();
    }

    return () => {
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [videoElement, analyzeContent]);

  // Start real-time analysis when playing
  useEffect(() => {
    if (!videoElement || !fullConfig.enableRealTimeAnalysis) return;

    const handlePlay = () => {
      return startRealTimeAnalysis();
    };

    let cleanup: (() => void) | undefined;

    const handlePlayEvent = () => {
      cleanup = handlePlay();
    };

    const handlePause = () => {
      if (cleanup) {
        cleanup();
        cleanup = undefined;
      }
    };

    videoElement.addEventListener('play', handlePlayEvent);
    videoElement.addEventListener('pause', handlePause);
    videoElement.addEventListener('ended', handlePause);

    return () => {
      videoElement.removeEventListener('play', handlePlayEvent);
      videoElement.removeEventListener('pause', handlePause);
      videoElement.removeEventListener('ended', handlePause);
      
      if (cleanup) {
        cleanup();
      }
    };
  }, [videoElement, fullConfig.enableRealTimeAnalysis, startRealTimeAnalysis]);

  // Cleanup audio context on unmount
  useEffect(() => {
    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  return {
    // State
    analysis,
    metrics,
    isAnalyzing,
    progress,
    error,

    // Actions
    analyzeContent,
    clearAnalysis,
    startRealTimeAnalysis,

    // Configuration
    config: fullConfig
  };
}
