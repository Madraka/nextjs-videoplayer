/**
 * Subtitle Manager Hook
 * Manages video subtitles, captions, and text tracks
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

// Subtitle interfaces
interface SubtitleTrack {
  id: string;
  label: string;
  language: string;
  kind: 'subtitles' | 'captions' | 'descriptions' | 'chapters' | 'metadata';
  src?: string;
  isDefault: boolean;
  isActive: boolean;
  mode: 'disabled' | 'hidden' | 'showing';
  cues: SubtitleCue[];
}

interface SubtitleCue {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  settings?: {
    position?: string;
    size?: string;
    align?: string;
    line?: string;
    vertical?: string;
  };
}

interface SubtitleStyle {
  fontSize: number;
  fontFamily: string;
  fontWeight: 'normal' | 'bold';
  color: string;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  textShadow: string;
  position: 'bottom' | 'top' | 'middle';
  alignment: 'left' | 'center' | 'right';
  opacity: number;
}

interface SubtitleManagerConfig {
  autoSelectLanguage: boolean;
  preferredLanguages: string[];
  enableAutoGeneration: boolean;
  enableTranslation: boolean;
  maxCueLength: number;
  cueDisplayDuration: number;
  enablePositioning: boolean;
  enableStyling: boolean;
}

const defaultStyle: SubtitleStyle = {
  fontSize: 16,
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'normal',
  color: '#ffffff',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  borderColor: '#000000',
  borderWidth: 1,
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
  position: 'bottom',
  alignment: 'center',
  opacity: 1
};

const defaultConfig: SubtitleManagerConfig = {
  autoSelectLanguage: true,
  preferredLanguages: ['en', 'en-US'],
  enableAutoGeneration: false,
  enableTranslation: false,
  maxCueLength: 100,
  cueDisplayDuration: 3000,
  enablePositioning: true,
  enableStyling: true
};

export function useSubtitleManager(
  videoElement: HTMLVideoElement | null,
  config: Partial<SubtitleManagerConfig> = {}
) {
  const fullConfig = { ...defaultConfig, ...config };
  
  const [tracks, setTracks] = useState<SubtitleTrack[]>([]);
  const [activeTrack, setActiveTrack] = useState<SubtitleTrack | null>(null);
  const [currentCue, setCurrentCue] = useState<SubtitleCue | null>(null);
  const [style, setStyle] = useState<SubtitleStyle>(defaultStyle);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Refs for tracking
  const cueUpdateInterval = useRef<NodeJS.Timeout | null>(null);
  const trackLoadPromises = useRef<Map<string, Promise<void>>>(new Map());

  // Parse VTT content
  const parseVTT = useCallback((content: string): SubtitleCue[] => {
    const cues: SubtitleCue[] = [];
    const lines = content.split('\n');
    let currentCue: Partial<SubtitleCue> | null = null;
    let cueIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Skip WEBVTT header and empty lines
      if (line === 'WEBVTT' || line === '') {
        continue;
      }

      // Check for timestamp line
      const timestampMatch = line.match(/^(\d{2}:\d{2}:\d{2}\.\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}\.\d{3})(.*)$/);
      if (timestampMatch) {
        const [, startTime, endTime, settings = ''] = timestampMatch;
        
        currentCue = {
          id: `cue-${cueIndex++}`,
          startTime: parseVTTTime(startTime),
          endTime: parseVTTTime(endTime),
          text: '',
          settings: parseVTTSettings(settings.trim())
        };
        continue;
      }

      // If we have a current cue and this is text content
      if (currentCue && line !== '') {
        currentCue.text = currentCue.text ? `${currentCue.text}\n${line}` : line;
      }

      // If we hit an empty line or end of file, finalize the cue
      if ((line === '' || i === lines.length - 1) && currentCue && currentCue.text) {
        cues.push(currentCue as SubtitleCue);
        currentCue = null;
      }
    }

    return cues;
  }, []);

  // Parse VTT timestamp (HH:MM:SS.mmm to seconds)
  const parseVTTTime = useCallback((timeString: string): number => {
    const parts = timeString.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const secondsParts = parts[2].split('.');
    const seconds = parseInt(secondsParts[0], 10);
    const milliseconds = parseInt(secondsParts[1], 10);

    return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
  }, []);

  // Parse VTT cue settings
  const parseVTTSettings = useCallback((settingsString: string): SubtitleCue['settings'] => {
    if (!settingsString) return {};

    const settings: SubtitleCue['settings'] = {};
    const parts = settingsString.split(/\s+/);

    parts.forEach(part => {
      const [key, value] = part.split(':');
      if (key && value) {
        switch (key) {
          case 'position':
            settings.position = value;
            break;
          case 'size':
            settings.size = value;
            break;
          case 'align':
            settings.align = value;
            break;
          case 'line':
            settings.line = value;
            break;
          case 'vertical':
            settings.vertical = value;
            break;
        }
      }
    });

    return settings;
  }, []);

  // Load subtitle track from URL
  const loadTrackFromURL = useCallback(async (track: SubtitleTrack): Promise<void> => {
    if (!track.src || trackLoadPromises.current.has(track.id)) {
      return trackLoadPromises.current.get(track.id) || Promise.resolve();
    }

    const loadPromise = (async () => {
      try {
        setIsLoading(true);
        
        const response = await fetch(track.src!);
        if (!response.ok) {
          throw new Error(`Failed to load subtitle track: ${response.statusText}`);
        }

        const content = await response.text();
        const cues = parseVTT(content);

        setTracks(prev => prev.map(t => 
          t.id === track.id ? { ...t, cues } : t
        ));

      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    })();

    trackLoadPromises.current.set(track.id, loadPromise);
    return loadPromise;
  }, [parseVTT]);

  // Detect and load tracks from video element
  const loadTracksFromVideo = useCallback(() => {
    if (!videoElement) return;

    const textTracks = Array.from(videoElement.textTracks || []);
    const detectedTracks: SubtitleTrack[] = [];

    textTracks.forEach((track, index) => {
      const subtitleTrack: SubtitleTrack = {
        id: `track-${index}`,
        label: track.label || `Track ${index + 1}`,
        language: track.language || 'unknown',
        kind: track.kind as SubtitleTrack['kind'],
        isDefault: track.mode === 'showing',
        isActive: track.mode === 'showing',
        mode: track.mode as SubtitleTrack['mode'],
        cues: []
      };

      // Convert native cues to our format
      if (track.cues) {
        subtitleTrack.cues = Array.from(track.cues).map((cue, cueIndex) => ({
          id: `native-cue-${index}-${cueIndex}`,
          startTime: cue.startTime,
          endTime: cue.endTime,
          text: (cue as any).text || '',
          settings: {}
        }));
      }

      detectedTracks.push(subtitleTrack);
    });

    setTracks(detectedTracks);

    // Auto-select preferred language
    if (fullConfig.autoSelectLanguage && detectedTracks.length > 0) {
      const preferredTrack = detectedTracks.find(track => 
        fullConfig.preferredLanguages.includes(track.language)
      ) || detectedTracks.find(track => track.isDefault) || detectedTracks[0];

      if (preferredTrack) {
        setActiveTrack(preferredTrack);
      }
    }
  }, [videoElement, fullConfig.autoSelectLanguage, fullConfig.preferredLanguages]);

  // Add external subtitle track
  const addTrack = useCallback(async (
    url: string, 
    label: string, 
    language: string, 
    kind: SubtitleTrack['kind'] = 'subtitles'
  ): Promise<SubtitleTrack> => {
    const track: SubtitleTrack = {
      id: `external-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      label,
      language,
      kind,
      src: url,
      isDefault: false,
      isActive: false,
      mode: 'disabled',
      cues: []
    };

    setTracks(prev => [...prev, track]);

    // Load the track content
    try {
      await loadTrackFromURL(track);
    } catch (error) {
      // Remove track if loading failed
      setTracks(prev => prev.filter(t => t.id !== track.id));
      throw error;
    }

    return track;
  }, [loadTrackFromURL]);

  // Remove subtitle track
  const removeTrack = useCallback((trackId: string) => {
    setTracks(prev => prev.filter(track => track.id !== trackId));
    
    if (activeTrack?.id === trackId) {
      setActiveTrack(null);
      setCurrentCue(null);
    }

    trackLoadPromises.current.delete(trackId);
  }, [activeTrack]);

  // Set active track
  const setActiveTrackById = useCallback(async (trackId: string | null) => {
    if (!trackId) {
      setActiveTrack(null);
      setCurrentCue(null);
      return;
    }

    const track = tracks.find(t => t.id === trackId);
    if (!track) return;

    // Load track if not loaded yet
    if (track.src && track.cues.length === 0) {
      await loadTrackFromURL(track);
    }

    setTracks(prev => prev.map(t => ({
      ...t,
      isActive: t.id === trackId,
      mode: t.id === trackId ? 'showing' : 'disabled'
    })));

    setActiveTrack(track);
  }, [tracks, loadTrackFromURL]);

  // Update current cue based on video time
  const updateCurrentCue = useCallback(() => {
    if (!videoElement || !activeTrack) {
      setCurrentCue(null);
      return;
    }

    const currentTime = videoElement.currentTime;
    const cue = activeTrack.cues.find(
      c => currentTime >= c.startTime && currentTime <= c.endTime
    );

    setCurrentCue(cue || null);
  }, [videoElement, activeTrack]);

  // Update subtitle style
  const updateStyle = useCallback((newStyle: Partial<SubtitleStyle>) => {
    setStyle(prev => ({ ...prev, ...newStyle }));
  }, []);

  // Search cues by text
  const searchCues = useCallback((query: string): Array<SubtitleCue & { trackId: string }> => {
    const results: Array<SubtitleCue & { trackId: string }> = [];
    const normalizedQuery = query.toLowerCase();

    tracks.forEach(track => {
      track.cues.forEach(cue => {
        if (cue.text.toLowerCase().includes(normalizedQuery)) {
          results.push({ ...cue, trackId: track.id });
        }
      });
    });

    return results.sort((a, b) => a.startTime - b.startTime);
  }, [tracks]);

  // Jump to specific cue
  const jumpToCue = useCallback((cue: SubtitleCue) => {
    if (videoElement) {
      videoElement.currentTime = cue.startTime;
    }
  }, [videoElement]);

  // Export subtitles as VTT
  const exportAsVTT = useCallback((trackId: string): string => {
    const track = tracks.find(t => t.id === trackId);
    if (!track) return '';

    let vtt = 'WEBVTT\n\n';

    track.cues.forEach(cue => {
      const startTime = formatVTTTime(cue.startTime);
      const endTime = formatVTTTime(cue.endTime);
      
      vtt += `${startTime} --> ${endTime}`;
      
      if (cue.settings) {
        const settings = Object.entries(cue.settings)
          .map(([key, value]) => `${key}:${value}`)
          .join(' ');
        if (settings) vtt += ` ${settings}`;
      }
      
      vtt += `\n${cue.text}\n\n`;
    });

    return vtt;
  }, [tracks]);

  // Format time as VTT timestamp
  const formatVTTTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const milliseconds = Math.floor((seconds % 1) * 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  }, []);

  // Generate auto captions (mock implementation)
  const generateAutoCaptions = useCallback(async (language: string = 'en'): Promise<SubtitleTrack> => {
    if (!fullConfig.enableAutoGeneration) {
      throw new Error('Auto caption generation is disabled');
    }

    setIsLoading(true);
    
    try {
      // Mock auto-generated captions
      const autoCaptions: SubtitleCue[] = [
        {
          id: 'auto-1',
          startTime: 0,
          endTime: 3,
          text: '[Auto-generated] Video content begins',
          settings: {}
        },
        {
          id: 'auto-2',
          startTime: 3,
          endTime: 6,
          text: '[Auto-generated] Audio detected',
          settings: {}
        }
      ];

      const track: SubtitleTrack = {
        id: `auto-${Date.now()}`,
        label: `Auto-generated (${language})`,
        language,
        kind: 'captions',
        isDefault: false,
        isActive: false,
        mode: 'disabled',
        cues: autoCaptions
      };

      setTracks(prev => [...prev, track]);
      return track;

    } finally {
      setIsLoading(false);
    }
  }, [fullConfig.enableAutoGeneration]);

  // Initialize tracks when video loads
  useEffect(() => {
    if (!videoElement) return;

    const handleLoadedMetadata = () => {
      loadTracksFromVideo();
    };

    const handleCueChange = () => {
      updateCurrentCue();
    };

    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.addEventListener('timeupdate', handleCueChange);

    // Load tracks if metadata is already available
    if (videoElement.readyState >= 1) {
      loadTracksFromVideo();
    }

    return () => {
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.removeEventListener('timeupdate', handleCueChange);
    };
  }, [videoElement, loadTracksFromVideo, updateCurrentCue]);

  // Update current cue when active track changes
  useEffect(() => {
    updateCurrentCue();
  }, [activeTrack, updateCurrentCue]);

  // Start cue update interval
  useEffect(() => {
    if (activeTrack && videoElement) {
      cueUpdateInterval.current = setInterval(updateCurrentCue, 100);
    } else if (cueUpdateInterval.current) {
      clearInterval(cueUpdateInterval.current);
      cueUpdateInterval.current = null;
    }

    return () => {
      if (cueUpdateInterval.current) {
        clearInterval(cueUpdateInterval.current);
      }
    };
  }, [activeTrack, videoElement, updateCurrentCue]);

  return {
    // State
    tracks,
    activeTrack,
    currentCue,
    style,
    isLoading,
    error,

    // Track management
    addTrack,
    removeTrack,
    setActiveTrack: setActiveTrackById,

    // Style management
    updateStyle,

    // Utilities
    searchCues,
    jumpToCue,
    exportAsVTT,
    generateAutoCaptions,

    // Configuration
    config: fullConfig
  };
}
