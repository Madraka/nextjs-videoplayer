/**
 * Analytics Tracker Hook
 * Tracks video player events and user interactions for analytics
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface AnalyticsEvent {
  type: string;
  timestamp: number;
  data?: Record<string, any>;
  sessionId: string;
  userId?: string;
}

interface ViewingSession {
  sessionId: string;
  startTime: number;
  endTime?: number;
  totalViewTime: number;
  watchedSegments: Array<{ start: number; end: number }>;
  seekEvents: number;
  pauseEvents: number;
  qualityChanges: number;
  bufferingTime: number;
  errors: string[];
}

interface UseAnalyticsTrackerProps {
  sessionId?: string;
  userId?: string;
  videoId?: string;
  videoUrl?: string;
  enabled?: boolean;
  batchSize?: number;
  flushInterval?: number;
  onEvent?: (event: AnalyticsEvent) => void;
  onBatchReady?: (events: AnalyticsEvent[]) => void;
  onSessionEnd?: (session: ViewingSession) => void;
}

interface UseAnalyticsTrackerReturn {
  currentSession: ViewingSession | null;
  trackEvent: (type: string, data?: Record<string, any>) => void;
  trackPlay: () => void;
  trackPause: () => void;
  trackSeek: (from: number, to: number) => void;
  trackQualityChange: (oldQuality: string, newQuality: string) => void;
  trackError: (error: string) => void;
  trackBuffering: (duration: number) => void;
  trackEnd: () => void;
  startSession: () => void;
  endSession: () => void;
  flushEvents: () => void;
  getSessionStats: () => ViewingSession | null;
}

export function useAnalyticsTracker({
  sessionId = crypto.randomUUID(),
  userId,
  videoId,
  videoUrl,
  enabled = true,
  batchSize = 10,
  flushInterval = 30000, // 30 seconds
  onEvent,
  onBatchReady,
  onSessionEnd
}: UseAnalyticsTrackerProps = {}): UseAnalyticsTrackerReturn {
  const [currentSession, setCurrentSession] = useState<ViewingSession | null>(null);
  
  const eventsQueueRef = useRef<AnalyticsEvent[]>([]);
  const flushTimerRef = useRef<NodeJS.Timeout>();
  const sessionStartTimeRef = useRef<number>(0);
  const lastPlayTimeRef = useRef<number>(0);
  const watchedSegmentsRef = useRef<Array<{ start: number; end: number }>>([]);

  // Generate unique session ID
  const generateSessionId = useCallback(() => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Create analytics event
  const createEvent = useCallback((type: string, data?: Record<string, any>): AnalyticsEvent => {
    return {
      type,
      timestamp: Date.now(),
      data: {
        ...data,
        videoId,
        videoUrl,
        sessionId: currentSession?.sessionId || sessionId
      },
      sessionId: currentSession?.sessionId || sessionId,
      userId
    };
  }, [currentSession?.sessionId, sessionId, userId, videoId, videoUrl]);

  // Add event to queue
  const queueEvent = useCallback((event: AnalyticsEvent) => {
    if (!enabled) return;

    eventsQueueRef.current.push(event);
    onEvent?.(event);

    // Flush if batch size reached
    if (eventsQueueRef.current.length >= batchSize) {
      flushEvents();
    }
  }, [enabled, batchSize, onEvent]);

  // Track generic event
  const trackEvent = useCallback((type: string, data?: Record<string, any>) => {
    const event = createEvent(type, data);
    queueEvent(event);
  }, [createEvent, queueEvent]);

  // Track play event
  const trackPlay = useCallback(() => {
    lastPlayTimeRef.current = Date.now();
    trackEvent('play', {
      timestamp: lastPlayTimeRef.current
    });
  }, [trackEvent]);

  // Track pause event
  const trackPause = useCallback(() => {
    const pauseTime = Date.now();
    const playDuration = lastPlayTimeRef.current ? pauseTime - lastPlayTimeRef.current : 0;
    
    if (playDuration > 0 && currentSession) {
      // Add to watched segments
      const newSegment = {
        start: lastPlayTimeRef.current,
        end: pauseTime
      };
      watchedSegmentsRef.current.push(newSegment);
      
      // Update session
      setCurrentSession(prev => prev ? {
        ...prev,
        totalViewTime: prev.totalViewTime + playDuration,
        pauseEvents: prev.pauseEvents + 1,
        watchedSegments: [...prev.watchedSegments, newSegment]
      } : null);
    }

    trackEvent('pause', {
      timestamp: pauseTime,
      playDuration
    });
  }, [trackEvent, currentSession]);

  // Track seek event
  const trackSeek = useCallback((from: number, to: number) => {
    if (currentSession) {
      setCurrentSession(prev => prev ? {
        ...prev,
        seekEvents: prev.seekEvents + 1
      } : null);
    }

    trackEvent('seek', {
      from,
      to,
      seekDistance: Math.abs(to - from)
    });
  }, [trackEvent, currentSession]);

  // Track quality change
  const trackQualityChange = useCallback((oldQuality: string, newQuality: string) => {
    if (currentSession) {
      setCurrentSession(prev => prev ? {
        ...prev,
        qualityChanges: prev.qualityChanges + 1
      } : null);
    }

    trackEvent('quality_change', {
      oldQuality,
      newQuality
    });
  }, [trackEvent, currentSession]);

  // Track error
  const trackError = useCallback((error: string) => {
    if (currentSession) {
      setCurrentSession(prev => prev ? {
        ...prev,
        errors: [...prev.errors, error]
      } : null);
    }

    trackEvent('error', {
      error,
      timestamp: Date.now()
    });
  }, [trackEvent, currentSession]);

  // Track buffering
  const trackBuffering = useCallback((duration: number) => {
    if (currentSession) {
      setCurrentSession(prev => prev ? {
        ...prev,
        bufferingTime: prev.bufferingTime + duration
      } : null);
    }

    trackEvent('buffering', {
      duration
    });
  }, [trackEvent, currentSession]);

  // Track video end
  const trackEnd = useCallback(() => {
    trackEvent('ended');
    endSession();
  }, [trackEvent]);

  // Start new session
  const startSession = useCallback(() => {
    const newSessionId = generateSessionId();
    const startTime = Date.now();
    sessionStartTimeRef.current = startTime;

    const session: ViewingSession = {
      sessionId: newSessionId,
      startTime,
      totalViewTime: 0,
      watchedSegments: [],
      seekEvents: 0,
      pauseEvents: 0,
      qualityChanges: 0,
      bufferingTime: 0,
      errors: []
    };

    setCurrentSession(session);
    watchedSegmentsRef.current = [];

    trackEvent('session_start', {
      sessionId: newSessionId,
      startTime
    });
  }, [generateSessionId, trackEvent]);

  // End current session
  const endSession = useCallback(() => {
    if (!currentSession) return;

    const endTime = Date.now();
    const finalSession: ViewingSession = {
      ...currentSession,
      endTime,
      watchedSegments: watchedSegmentsRef.current
    };

    setCurrentSession(finalSession);

    trackEvent('session_end', {
      sessionId: currentSession.sessionId,
      endTime,
      duration: endTime - currentSession.startTime,
      totalViewTime: finalSession.totalViewTime,
      engagementRate: finalSession.totalViewTime / (endTime - currentSession.startTime)
    });

    onSessionEnd?.(finalSession);
    setCurrentSession(null);
  }, [currentSession, trackEvent, onSessionEnd]);

  // Flush events
  const flushEvents = useCallback(() => {
    if (eventsQueueRef.current.length === 0) return;

    const events = [...eventsQueueRef.current];
    eventsQueueRef.current = [];

    onBatchReady?.(events);
  }, [onBatchReady]);

  // Get session statistics
  const getSessionStats = useCallback((): ViewingSession | null => {
    return currentSession;
  }, [currentSession]);

  // Set up flush timer
  useEffect(() => {
    if (!enabled) return;

    flushTimerRef.current = setInterval(() => {
      flushEvents();
    }, flushInterval);

    return () => {
      if (flushTimerRef.current) {
        clearInterval(flushTimerRef.current);
      }
    };
  }, [enabled, flushInterval, flushEvents]);

  // Auto-start session
  useEffect(() => {
    if (enabled && !currentSession) {
      startSession();
    }
  }, [enabled, currentSession, startSession]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentSession) {
        endSession();
      }
      flushEvents();
      
      if (flushTimerRef.current) {
        clearInterval(flushTimerRef.current);
      }
    };
  }, []);

  return {
    currentSession,
    trackEvent,
    trackPlay,
    trackPause,
    trackSeek,
    trackQualityChange,
    trackError,
    trackBuffering,
    trackEnd,
    startSession,
    endSession,
    flushEvents,
    getSessionStats
  };
}
