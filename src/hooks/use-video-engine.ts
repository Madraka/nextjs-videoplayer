/**
 * Video Engine Integration Hook
 * Manages video engine lifecycle and switching between different engines
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { VideoEngine } from '@/core/engine';
import type { EngineConfig, EngineType, EngineState } from '@/types/engine';

interface UseVideoEngineProps {
  src: string;
  engineType?: EngineType;
  config?: EngineConfig;
  autoDetect?: boolean;
}

interface UseVideoEngineReturn {
  engine: VideoEngine | null;
  engineType: EngineType | null;
  isLoading: boolean;
  isReady: boolean;
  error: Error | null;
  state: EngineState;
  switchEngine: (type: EngineType) => Promise<void>;
  reload: () => Promise<void>;
  destroy: () => void;
}

export function useVideoEngine({
  src,
  engineType = 'auto',
  config = {},
  autoDetect = true
}: UseVideoEngineProps): UseVideoEngineReturn {
  const [engine, setEngine] = useState<VideoEngine | null>(null);
  const [currentEngineType, setCurrentEngineType] = useState<EngineType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [state, setState] = useState<EngineState>('idle');
  
  const engineRef = useRef<VideoEngine | null>(null);
  const destroyTimeoutRef = useRef<NodeJS.Timeout>();

  // Detect best engine for the source
  const detectEngine = useCallback(async (source: string): Promise<EngineType> => {
    if (!autoDetect) return engineType === 'auto' ? 'native' : engineType;

    // Basic format detection
    const url = new URL(source, window.location.href);
    const pathname = url.pathname.toLowerCase();
    const searchParams = url.searchParams;

    // HLS detection
    if (pathname.includes('.m3u8') || searchParams.has('format') && searchParams.get('format') === 'hls') {
      // Check native HLS support (Safari)
      const video = document.createElement('video');
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        return 'native';
      }
      return 'hls';
    }

    // DASH detection
    if (pathname.includes('.mpd') || searchParams.has('format') && searchParams.get('format') === 'dash') {
      return 'dash';
    }

    // WebRTC detection
    if (source.startsWith('webrtc:') || source.includes('webrtc')) {
      return 'webrtc';
    }

    // Progressive formats
    if (pathname.match(/\.(mp4|webm|ogg)$/)) {
      return 'progressive';
    }

    // Default to native
    return 'native';
  }, [engineType, autoDetect]);

  // Create engine instance
  const createEngine = useCallback(async (type: EngineType, source: string): Promise<VideoEngine> => {
    const { VideoEngine } = await import('@/core/engine');
    
    const engineInstance = new VideoEngine({
      type,
      src: source,
      config: {
        ...config,
        onStateChange: (newState: EngineState) => {
          setState(newState);
        },
        onReady: () => {
          setIsReady(true);
          setIsLoading(false);
        },
        onError: (err: Error) => {
          setError(err);
          setIsLoading(false);
          setState('error');
        }
      }
    });

    return engineInstance;
  }, [config]);

  // Initialize engine
  const initializeEngine = useCallback(async (source: string, type?: EngineType) => {
    if (!source) return;

    setIsLoading(true);
    setError(null);
    setIsReady(false);
    setState('loading');

    try {
      // Destroy existing engine
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }

      // Detect or use specified engine type
      const detectedType = type || await detectEngine(source);
      setCurrentEngineType(detectedType);

      // Create new engine
      const newEngine = await createEngine(detectedType, source);
      engineRef.current = newEngine;
      setEngine(newEngine);

      // Initialize the engine
      await newEngine.initialize();
      setState('ready');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to initialize engine');
      setError(error);
      setIsLoading(false);
      setState('error');
    }
  }, [detectEngine, createEngine]);

  // Switch to different engine
  const switchEngine = useCallback(async (type: EngineType) => {
    if (!src || type === currentEngineType) return;
    await initializeEngine(src, type);
  }, [src, currentEngineType, initializeEngine]);

  // Reload current engine
  const reload = useCallback(async () => {
    if (!src) return;
    await initializeEngine(src, currentEngineType || undefined);
  }, [src, currentEngineType, initializeEngine]);

  // Destroy engine
  const destroy = useCallback(() => {
    if (destroyTimeoutRef.current) {
      clearTimeout(destroyTimeoutRef.current);
    }

    destroyTimeoutRef.current = setTimeout(() => {
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
      setEngine(null);
      setCurrentEngineType(null);
      setIsReady(false);
      setError(null);
      setState('idle');
    }, 100);
  }, []);

  // Initialize when src changes
  useEffect(() => {
    if (src) {
      initializeEngine(src);
    } else {
      destroy();
    }

    return () => {
      if (destroyTimeoutRef.current) {
        clearTimeout(destroyTimeoutRef.current);
      }
    };
  }, [src, initializeEngine, destroy]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
      }
      if (destroyTimeoutRef.current) {
        clearTimeout(destroyTimeoutRef.current);
      }
    };
  }, []);

  return {
    engine,
    engineType: currentEngineType,
    isLoading,
    isReady,
    error,
    state,
    switchEngine,
    reload,
    destroy
  };
}
