/**
 * Media Session Hook
 * Manages Media Session API for system-level media controls
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

// Media Session interfaces
interface MediaMetadata {
  title: string;
  artist?: string;
  album?: string;
  artwork?: MediaImage[];
}

interface MediaImage {
  src: string;
  sizes?: string;
  type?: string;
}

interface MediaSessionState {
  playbackState: 'none' | 'paused' | 'playing';
  position: number;
  duration: number;
  playbackRate: number;
}

interface MediaSessionConfig {
  enableSystemControls: boolean;
  enableNotifications: boolean;
  enableLockScreenControls: boolean;
  enablePositionState: boolean;
  updateInterval: number; // ms
  defaultArtwork: MediaImage[];
}

const defaultConfig: MediaSessionConfig = {
  enableSystemControls: true,
  enableNotifications: true,
  enableLockScreenControls: true,
  enablePositionState: true,
  updateInterval: 1000,
  defaultArtwork: [
    {
      src: '/icons/media-icon-96.png',
      sizes: '96x96',
      type: 'image/png'
    },
    {
      src: '/icons/media-icon-128.png',
      sizes: '128x128',
      type: 'image/png'
    },
    {
      src: '/icons/media-icon-192.png',
      sizes: '192x192',
      type: 'image/png'
    },
    {
      src: '/icons/media-icon-256.png',
      sizes: '256x256',
      type: 'image/png'
    },
    {
      src: '/icons/media-icon-384.png',
      sizes: '384x384',
      type: 'image/png'
    },
    {
      src: '/icons/media-icon-512.png',
      sizes: '512x512',
      type: 'image/png'
    }
  ]
};

export function useMediaSession(
  videoElement: HTMLVideoElement | null,
  config: Partial<MediaSessionConfig> = {}
) {
  const fullConfig = { ...defaultConfig, ...config };
  
  const [isSupported, setIsSupported] = useState(false);
  const [metadata, setMetadataState] = useState<MediaMetadata | null>(null);
  const [state, setState] = useState<MediaSessionState>({
    playbackState: 'none',
    position: 0,
    duration: 0,
    playbackRate: 1
  });
  const [error, setError] = useState<Error | null>(null);

  // Refs
  const updateInterval = useRef<NodeJS.Timeout | null>(null);
  const actionHandlers = useRef<Map<MediaSessionAction, () => void>>(new Map());

  // Check Media Session API support
  useEffect(() => {
    const supported = typeof window !== 'undefined' && 
                     'navigator' in window && 
                     'mediaSession' in navigator;
    setIsSupported(supported);
  }, []);

  // Update metadata
  const updateMetadata = useCallback((newMetadata: Partial<MediaMetadata>) => {
    if (!isSupported || !navigator.mediaSession) return;

    try {
      const fullMetadata: MediaMetadata = {
        title: newMetadata.title || 'Video Player',
        artist: newMetadata.artist,
        album: newMetadata.album,
        artwork: newMetadata.artwork || fullConfig.defaultArtwork
      };

      navigator.mediaSession.metadata = new window.MediaMetadata(fullMetadata);
      setMetadataState(fullMetadata);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.warn('Failed to update media metadata:', error);
    }
  }, [isSupported, fullConfig.defaultArtwork]);

  // Update playback state
  const updatePlaybackState = useCallback((playbackState: MediaSessionState['playbackState']) => {
    if (!isSupported || !navigator.mediaSession) return;

    try {
      navigator.mediaSession.playbackState = playbackState;
      setState(prev => ({ ...prev, playbackState }));
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.warn('Failed to update playback state:', error);
    }
  }, [isSupported]);

  // Update position state
  const updatePositionState = useCallback((position: number, duration: number, playbackRate: number = 1) => {
    if (!isSupported || !navigator.mediaSession || !fullConfig.enablePositionState) return;

    try {
      if ('setPositionState' in navigator.mediaSession) {
        navigator.mediaSession.setPositionState({
          duration: isFinite(duration) ? duration : 0,
          playbackRate,
          position: Math.min(position, duration || 0)
        });
      }

      setState(prev => ({
        ...prev,
        position,
        duration,
        playbackRate
      }));
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.warn('Failed to update position state:', error);
    }
  }, [isSupported, fullConfig.enablePositionState]);

  // Set action handler
  const setActionHandler = useCallback((
    action: MediaSessionAction,
    handler: () => void
  ) => {
    if (!isSupported || !navigator.mediaSession) return;

    try {
      navigator.mediaSession.setActionHandler(action, handler);
      actionHandlers.current.set(action, handler);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.warn(`Failed to set action handler for ${action}:`, error);
    }
  }, [isSupported]);

  // Remove action handler
  const removeActionHandler = useCallback((action: MediaSessionAction) => {
    if (!isSupported || !navigator.mediaSession) return;

    try {
      navigator.mediaSession.setActionHandler(action, null);
      actionHandlers.current.delete(action);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.warn(`Failed to remove action handler for ${action}:`, error);
    }
  }, [isSupported]);

  // Setup default video controls
  const setupVideoControls = useCallback(() => {
    if (!videoElement || !isSupported) return;

    // Play action
    setActionHandler('play', () => {
      videoElement.play().catch(console.warn);
    });

    // Pause action
    setActionHandler('pause', () => {
      videoElement.pause();
    });

    // Stop action
    setActionHandler('stop', () => {
      videoElement.pause();
      videoElement.currentTime = 0;
    });

    // Seek backward
    setActionHandler('seekbackward', () => {
      videoElement.currentTime = Math.max(0, videoElement.currentTime - 10);
    });

    // Seek forward
    setActionHandler('seekforward', () => {
      videoElement.currentTime = Math.min(
        videoElement.duration || 0, 
        videoElement.currentTime + 10
      );
    });

    // Previous track (seek to beginning)
    setActionHandler('previoustrack', () => {
      videoElement.currentTime = 0;
    });

    // Next track (seek to end)
    setActionHandler('nexttrack', () => {
      if (videoElement.duration) {
        videoElement.currentTime = videoElement.duration;
      }
    });

    // Seek to position
    setActionHandler('seekto', () => {
      // This will be overridden with specific position in the event handler
    });

  }, [videoElement, isSupported, setActionHandler]);

  // Setup advanced controls
  const setupAdvancedControls = useCallback(() => {
    if (!videoElement || !isSupported) return;

    // Skip to specific time
    const handleSeekTo = () => {
      // Position will be provided through the MediaSession API event
      // This is a placeholder for the seekto action
    };

    // Fast seek controls
    setActionHandler('seekto', handleSeekTo);

    // Chapter navigation (if supported)
    try {
      setActionHandler('nexttrack', () => {
        // Custom logic for next chapter/segment
        const duration = videoElement.duration || 0;
        const currentTime = videoElement.currentTime;
        const segmentDuration = duration / 10; // Divide into 10 segments
        const nextSegment = Math.floor(currentTime / segmentDuration) + 1;
        
        if (nextSegment * segmentDuration < duration) {
          videoElement.currentTime = nextSegment * segmentDuration;
        }
      });

      setActionHandler('previoustrack', () => {
        // Custom logic for previous chapter/segment
        const duration = videoElement.duration || 0;
        const currentTime = videoElement.currentTime;
        const segmentDuration = duration / 10; // Divide into 10 segments
        const prevSegment = Math.floor(currentTime / segmentDuration) - 1;
        
        if (prevSegment >= 0) {
          videoElement.currentTime = prevSegment * segmentDuration;
        } else {
          videoElement.currentTime = 0;
        }
      });
    } catch (err) {
      console.warn('Advanced controls not supported:', err);
    }

  }, [videoElement, isSupported, setActionHandler]);

  // Auto-update position state
  const startPositionUpdates = useCallback(() => {
    if (!videoElement || !fullConfig.enablePositionState) return;

    if (updateInterval.current) {
      clearInterval(updateInterval.current);
    }

    updateInterval.current = setInterval(() => {
      if (videoElement.duration && !videoElement.paused) {
        updatePositionState(
          videoElement.currentTime,
          videoElement.duration,
          videoElement.playbackRate
        );
      }
    }, fullConfig.updateInterval);

  }, [videoElement, fullConfig.enablePositionState, fullConfig.updateInterval, updatePositionState]);

  // Stop position updates
  const stopPositionUpdates = useCallback(() => {
    if (updateInterval.current) {
      clearInterval(updateInterval.current);
      updateInterval.current = null;
    }
  }, []);

  // Initialize media session when video loads
  useEffect(() => {
    if (!videoElement || !isSupported) return;

    const handleLoadedMetadata = () => {
      // Set default metadata
      updateMetadata({
        title: 'Video Player',
        artist: 'Video Content'
      });

      // Update initial position state
      updatePositionState(0, videoElement.duration || 0);
      
      // Setup controls
      setupVideoControls();
      setupAdvancedControls();
    };

    const handlePlay = () => {
      updatePlaybackState('playing');
      startPositionUpdates();
    };

    const handlePause = () => {
      updatePlaybackState('paused');
      stopPositionUpdates();
    };

    const handleEnded = () => {
      updatePlaybackState('paused');
      stopPositionUpdates();
    };

    const handleTimeUpdate = () => {
      if (fullConfig.enablePositionState && videoElement.duration) {
        updatePositionState(
          videoElement.currentTime,
          videoElement.duration,
          videoElement.playbackRate
        );
      }
    };

    const handleRateChange = () => {
      if (fullConfig.enablePositionState && videoElement.duration) {
        updatePositionState(
          videoElement.currentTime,
          videoElement.duration,
          videoElement.playbackRate
        );
      }
    };

    // Add event listeners
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);
    videoElement.addEventListener('ended', handleEnded);
    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('ratechange', handleRateChange);

    // Initialize if metadata is already loaded
    if (videoElement.readyState >= 1) {
      handleLoadedMetadata();
    }

    return () => {
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
      videoElement.removeEventListener('ended', handleEnded);
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('ratechange', handleRateChange);
      
      stopPositionUpdates();
    };
  }, [
    videoElement,
    isSupported,
    updateMetadata,
    updatePlaybackState,
    updatePositionState,
    setupVideoControls,
    setupAdvancedControls,
    startPositionUpdates,
    stopPositionUpdates,
    fullConfig.enablePositionState
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPositionUpdates();
      
      if (isSupported && navigator.mediaSession) {
        // Clear metadata
        navigator.mediaSession.metadata = null;
        
        // Remove all action handlers
        const actions: MediaSessionAction[] = [
          'play',
          'pause',
          'stop',
          'seekbackward',
          'seekforward',
          'seekto',
          'previoustrack',
          'nexttrack'
        ];
        
        actions.forEach(action => {
          try {
            navigator.mediaSession!.setActionHandler(action, null);
          } catch (err) {
            // Ignore cleanup errors
          }
        });
      }
    };
  }, [isSupported, stopPositionUpdates]);

  // Update from external metadata
  const setMediaMetadata = useCallback((newMetadata: Partial<MediaMetadata>) => {
    updateMetadata(newMetadata);
  }, [updateMetadata]);

  // Manual position update
  const setPosition = useCallback((position: number) => {
    if (videoElement) {
      updatePositionState(position, videoElement.duration || 0, videoElement.playbackRate);
    }
  }, [videoElement, updatePositionState]);

  // Get current action handlers
  const getActionHandlers = useCallback(() => {
    return Array.from(actionHandlers.current.entries());
  }, []);

  return {
    // State
    isSupported,
    metadata,
    state,
    error,

    // Core functionality
    updateMetadata: setMediaMetadata,
    updatePlaybackState,
    updatePositionState,
    setPosition,

    // Action handlers
    setActionHandler,
    removeActionHandler,
    getActionHandlers,

    // Control setup
    setupVideoControls,
    setupAdvancedControls,

    // Configuration
    config: fullConfig
  };
}
