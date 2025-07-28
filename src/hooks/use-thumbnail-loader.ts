/**
 * Thumbnail Loader Hook
 * Manages video thumbnail loading, sprite sheets, and preview images
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

// Thumbnail interfaces
interface ThumbnailSprite {
  url: string;
  spriteWidth: number;
  spriteHeight: number;
  thumbnailWidth: number;
  thumbnailHeight: number;
  rows: number;
  columns: number;
  interval: number; // seconds between thumbnails
  totalThumbnails: number;
}

interface ThumbnailData {
  time: number;
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
  spriteSheet?: ThumbnailSprite;
}

interface ThumbnailCache {
  [key: string]: {
    image: HTMLImageElement;
    lastAccessed: number;
    isLoading: boolean;
  };
}

interface ThumbnailLoaderConfig {
  enablePreload: boolean;
  cacheSize: number; // max cached images
  preloadRadius: number; // number of thumbnails to preload around current time
  enableSpriteSheets: boolean;
  defaultThumbnailWidth: number;
  defaultThumbnailHeight: number;
  loadTimeout: number; // ms
  enableFallback: boolean;
  fallbackInterval: number; // seconds for auto-generated thumbnails
}

const defaultConfig: ThumbnailLoaderConfig = {
  enablePreload: true,
  cacheSize: 50,
  preloadRadius: 5,
  enableSpriteSheets: true,
  defaultThumbnailWidth: 160,
  defaultThumbnailHeight: 90,
  loadTimeout: 5000,
  enableFallback: true,
  fallbackInterval: 10
};

export function useThumbnailLoader(
  videoElement: HTMLVideoElement | null,
  config: Partial<ThumbnailLoaderConfig> = {}
) {
  const fullConfig = { ...defaultConfig, ...config };
  
  const [thumbnails, setThumbnails] = useState<ThumbnailData[]>([]);
  const [spriteSheets, setSpriteSheets] = useState<ThumbnailSprite[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  // Cache and loading refs
  const cache = useRef<ThumbnailCache>({});
  const loadingPromises = useRef<Map<string, Promise<HTMLImageElement>>>(new Map());
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  // Initialize canvas for thumbnail generation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      canvasRef.current = document.createElement('canvas');
      contextRef.current = canvasRef.current.getContext('2d');
    }
  }, []);

  // Load image with timeout and caching
  const loadImage = useCallback((url: string): Promise<HTMLImageElement> => {
    // Check cache first
    const cached = cache.current[url];
    if (cached && !cached.isLoading) {
      cached.lastAccessed = Date.now();
      return Promise.resolve(cached.image);
    }

    // Check if already loading
    if (loadingPromises.current.has(url)) {
      return loadingPromises.current.get(url)!;
    }

    // Create loading promise
    const loadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      const timeout = setTimeout(() => {
        reject(new Error(`Thumbnail load timeout: ${url}`));
      }, fullConfig.loadTimeout);

      img.onload = () => {
        clearTimeout(timeout);
        
        // Cache the loaded image
        cache.current[url] = {
          image: img,
          lastAccessed: Date.now(),
          isLoading: false
        };

        // Clean up old cache entries
        cleanCache();
        
        resolve(img);
      };

      img.onerror = () => {
        clearTimeout(timeout);
        delete cache.current[url];
        reject(new Error(`Failed to load thumbnail: ${url}`));
      };

      // Mark as loading in cache
      cache.current[url] = {
        image: img,
        lastAccessed: Date.now(),
        isLoading: true
      };

      img.src = url;
    });

    loadingPromises.current.set(url, loadPromise);
    
    // Clean up loading promise when done
    loadPromise.finally(() => {
      loadingPromises.current.delete(url);
    });

    return loadPromise;
  }, [fullConfig.loadTimeout]);

  // Clean up old cache entries
  const cleanCache = useCallback(() => {
    const entries = Object.entries(cache.current);
    if (entries.length <= fullConfig.cacheSize) return;

    // Sort by last accessed time and remove oldest entries
    entries
      .sort((a, b) => a[1].lastAccessed - b[1].lastAccessed)
      .slice(0, entries.length - fullConfig.cacheSize)
      .forEach(([url]) => {
        delete cache.current[url];
      });
  }, [fullConfig.cacheSize]);

  // Parse sprite sheet configuration
  const parseSpriteSheet = useCallback((spriteConfig: Partial<ThumbnailSprite>): ThumbnailSprite => {
    return {
      url: spriteConfig.url || '',
      spriteWidth: spriteConfig.spriteWidth || 1920,
      spriteHeight: spriteConfig.spriteHeight || 1080,
      thumbnailWidth: spriteConfig.thumbnailWidth || fullConfig.defaultThumbnailWidth,
      thumbnailHeight: spriteConfig.thumbnailHeight || fullConfig.defaultThumbnailHeight,
      rows: spriteConfig.rows || 10,
      columns: spriteConfig.columns || 10,
      interval: spriteConfig.interval || 10,
      totalThumbnails: spriteConfig.totalThumbnails || (spriteConfig.rows || 10) * (spriteConfig.columns || 10)
    };
  }, [fullConfig.defaultThumbnailWidth, fullConfig.defaultThumbnailHeight]);

  // Generate thumbnails from sprite sheet
  const generateThumbnailsFromSprite = useCallback((sprite: ThumbnailSprite): ThumbnailData[] => {
    const thumbnails: ThumbnailData[] = [];
    
    for (let i = 0; i < sprite.totalThumbnails; i++) {
      const row = Math.floor(i / sprite.columns);
      const col = i % sprite.columns;
      
      thumbnails.push({
        time: i * sprite.interval,
        url: sprite.url,
        x: col * sprite.thumbnailWidth,
        y: row * sprite.thumbnailHeight,
        width: sprite.thumbnailWidth,
        height: sprite.thumbnailHeight,
        spriteSheet: sprite
      });
    }

    return thumbnails;
  }, []);

  // Add sprite sheet
  const addSpriteSheet = useCallback(async (spriteConfig: Partial<ThumbnailSprite>): Promise<void> => {
    try {
      setIsLoading(true);
      const sprite = parseSpriteSheet(spriteConfig);
      
      // Preload the sprite sheet image
      await loadImage(sprite.url);
      
      setSpriteSheets(prev => [...prev, sprite]);
      
      // Generate thumbnails from sprite
      const spriteThumbnails = generateThumbnailsFromSprite(sprite);
      setThumbnails(prev => [...prev, ...spriteThumbnails].sort((a, b) => a.time - b.time));
      
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [parseSpriteSheet, loadImage, generateThumbnailsFromSprite]);

  // Add individual thumbnail
  const addThumbnail = useCallback((time: number, url: string): void => {
    const thumbnail: ThumbnailData = {
      time,
      url,
      x: 0,
      y: 0,
      width: fullConfig.defaultThumbnailWidth,
      height: fullConfig.defaultThumbnailHeight
    };

    setThumbnails(prev => [...prev, thumbnail].sort((a, b) => a.time - b.time));
  }, [fullConfig.defaultThumbnailWidth, fullConfig.defaultThumbnailHeight]);

  // Get thumbnail for specific time
  const getThumbnailForTime = useCallback((time: number): ThumbnailData | null => {
    if (thumbnails.length === 0) return null;

    // Find closest thumbnail
    let closest = thumbnails[0];
    let minDiff = Math.abs(time - closest.time);

    for (const thumbnail of thumbnails) {
      const diff = Math.abs(time - thumbnail.time);
      if (diff < minDiff) {
        minDiff = diff;
        closest = thumbnail;
      }
    }

    return closest;
  }, [thumbnails]);

  // Extract thumbnail from sprite sheet
  const extractThumbnailFromSprite = useCallback(async (
    thumbnail: ThumbnailData
  ): Promise<string | null> => {
    if (!thumbnail.spriteSheet || !canvasRef.current || !contextRef.current) {
      return null;
    }

    try {
      const spriteImage = await loadImage(thumbnail.url);
      
      canvasRef.current.width = thumbnail.width;
      canvasRef.current.height = thumbnail.height;
      
      contextRef.current.drawImage(
        spriteImage,
        thumbnail.x,
        thumbnail.y,
        thumbnail.width,
        thumbnail.height,
        0,
        0,
        thumbnail.width,
        thumbnail.height
      );

      return canvasRef.current.toDataURL('image/jpeg', 0.8);
    } catch (error) {
      console.warn('Failed to extract thumbnail from sprite:', error);
      return null;
    }
  }, [loadImage]);

  // Generate thumbnail from video at specific time
  const generateThumbnailFromVideo = useCallback(async (
    time: number,
    width: number = fullConfig.defaultThumbnailWidth,
    height: number = fullConfig.defaultThumbnailHeight
  ): Promise<string | null> => {
    if (!videoElement || !canvasRef.current || !contextRef.current) {
      return null;
    }

    return new Promise((resolve) => {
      const originalTime = videoElement.currentTime;
      
      const handleSeeked = () => {
        try {
          canvasRef.current!.width = width;
          canvasRef.current!.height = height;
          
          contextRef.current!.drawImage(
            videoElement,
            0,
            0,
            width,
            height
          );

          const dataUrl = canvasRef.current!.toDataURL('image/jpeg', 0.8);
          
          // Restore original time
          videoElement.currentTime = originalTime;
          
          resolve(dataUrl);
        } catch (error) {
          console.warn('Failed to generate thumbnail from video:', error);
          resolve(null);
        }
        
        videoElement.removeEventListener('seeked', handleSeeked);
      };

      videoElement.addEventListener('seeked', handleSeeked);
      videoElement.currentTime = time;
    });
  }, [videoElement, fullConfig.defaultThumbnailWidth, fullConfig.defaultThumbnailHeight]);

  // Preload thumbnails around current time
  const preloadThumbnails = useCallback(async (currentTime: number): Promise<void> => {
    if (!fullConfig.enablePreload || thumbnails.length === 0) return;

    const currentIndex = thumbnails.findIndex(t => t.time >= currentTime);
    if (currentIndex === -1) return;

    const startIndex = Math.max(0, currentIndex - fullConfig.preloadRadius);
    const endIndex = Math.min(thumbnails.length - 1, currentIndex + fullConfig.preloadRadius);

    const preloadPromises: Promise<HTMLImageElement>[] = [];

    for (let i = startIndex; i <= endIndex; i++) {
      const thumbnail = thumbnails[i];
      
      // For sprite sheets, we don't need to preload individual URLs
      if (thumbnail.spriteSheet) {
        if (!cache.current[thumbnail.url]) {
          preloadPromises.push(loadImage(thumbnail.url));
        }
      } else {
        preloadPromises.push(loadImage(thumbnail.url));
      }
    }

    try {
      await Promise.allSettled(preloadPromises);
    } catch (error) {
      console.warn('Some thumbnails failed to preload:', error);
    }
  }, [fullConfig.enablePreload, fullConfig.preloadRadius, thumbnails, loadImage]);

  // Generate fallback thumbnails
  const generateFallbackThumbnails = useCallback(async (): Promise<void> => {
    if (!fullConfig.enableFallback || !videoElement) return;

    setIsLoading(true);
    const duration = videoElement.duration;
    const interval = fullConfig.fallbackInterval;
    const count = Math.ceil(duration / interval);
    
    const fallbackThumbnails: ThumbnailData[] = [];
    
    for (let i = 0; i < count; i++) {
      const time = i * interval;
      const dataUrl = await generateThumbnailFromVideo(time);
      
      if (dataUrl) {
        fallbackThumbnails.push({
          time,
          url: dataUrl,
          x: 0,
          y: 0,
          width: fullConfig.defaultThumbnailWidth,
          height: fullConfig.defaultThumbnailHeight
        });
      }

      setLoadProgress((i + 1) / count);
    }

    setThumbnails(prev => [...prev, ...fallbackThumbnails].sort((a, b) => a.time - b.time));
    setIsLoading(false);
  }, [
    fullConfig.enableFallback,
    fullConfig.fallbackInterval,
    fullConfig.defaultThumbnailWidth,
    fullConfig.defaultThumbnailHeight,
    videoElement,
    generateThumbnailFromVideo
  ]);

  // Clear all thumbnails
  const clearThumbnails = useCallback(() => {
    setThumbnails([]);
    setSpriteSheets([]);
    cache.current = {};
    loadingPromises.current.clear();
  }, []);

  // Get thumbnail URL (handling sprite sheets)
  const getThumbnailUrl = useCallback(async (thumbnail: ThumbnailData): Promise<string> => {
    if (thumbnail.spriteSheet) {
      const extracted = await extractThumbnailFromSprite(thumbnail);
      return extracted || thumbnail.url;
    }
    
    return thumbnail.url;
  }, [extractThumbnailFromSprite]);

  // Preload when video time changes
  useEffect(() => {
    if (!videoElement) return;

    const handleTimeUpdate = () => {
      preloadThumbnails(videoElement.currentTime);
    };

    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    
    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [videoElement, preloadThumbnails]);

  return {
    // State
    thumbnails,
    spriteSheets,
    isLoading,
    loadProgress,
    error,

    // Core functionality
    addSpriteSheet,
    addThumbnail,
    getThumbnailForTime,
    getThumbnailUrl,
    generateThumbnailFromVideo,
    
    // Utilities
    preloadThumbnails,
    generateFallbackThumbnails,
    clearThumbnails,
    extractThumbnailFromSprite,

    // Configuration
    config: fullConfig
  };
}
