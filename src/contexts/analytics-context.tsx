/**
 * Analytics Context
 * Manages analytics tracking and reporting for the video player
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

// Analytics interfaces
interface AnalyticsConfig {
  enabled: boolean;
  trackingId?: string;
  endpoint?: string;
  batchSize: number;
  flushInterval: number;
  enableRealtime: boolean;
  enableHeatmaps: boolean;
  enableUserJourney: boolean;
  enablePerformance: boolean;
  enableErrors: boolean;
  enableCustomEvents: boolean;
  privacy: {
    anonymizeIp: boolean;
    respectDoNotTrack: boolean;
    enableCookieConsent: boolean;
  };
}

interface PlaybackEvent {
  type: 'play' | 'pause' | 'seek' | 'ended' | 'timeupdate' | 'volumechange' | 'qualitychange' | 'error';
  timestamp: number;
  currentTime: number;
  duration: number;
  volume: number;
  quality?: string;
  playbackRate: number;
  isFullscreen: boolean;
  data?: any;
}

interface SessionData {
  sessionId: string;
  userId?: string;
  startTime: number;
  endTime?: number;
  duration: number;
  events: PlaybackEvent[];
  videoUrl: string;
  videoTitle?: string;
  videoDuration: number;
  totalWatchTime: number;
  completionRate: number;
  qualityChanges: number;
  bufferingEvents: number;
  seekEvents: number;
  errors: number;
  device: {
    userAgent: string;
    screen: { width: number; height: number };
    viewport: { width: number; height: number };
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
  };
  network: {
    connection?: string;
    downlink?: number;
    rtt?: number;
  };
  performance: {
    loadTime: number;
    firstPlay: number;
    bufferHealth: number;
    dropframes: number;
  };
}

interface AnalyticsMetrics {
  totalViews: number;
  totalWatchTime: number;
  averageWatchTime: number;
  completionRate: number;
  bounceRate: number;
  engagementRate: number;
  qualityDistribution: Record<string, number>;
  deviceDistribution: Record<string, number>;
  errorRate: number;
  bufferingRate: number;
  popularSegments: Array<{ start: number; end: number; views: number }>;
  heatmapData: Array<{ time: number; intensity: number }>;
  geographicData: Record<string, number>;
  referrerData: Record<string, number>;
}

interface UserJourney {
  userId: string;
  sessions: SessionData[];
  totalSessions: number;
  totalWatchTime: number;
  favoriteVideos: string[];
  preferredQuality: string;
  typicalWatchDuration: number;
  engagementScore: number;
  lastActivity: number;
}

interface PerformanceMetrics {
  loadTime: number;
  firstFrame: number;
  seekTime: number;
  bufferHealth: number;
  droppedFrames: number;
  bandwidth: number;
  latency: number;
  startupTime: number;
  rebufferingTime: number;
  videoResolution: { width: number; height: number };
  framerate: number;
}

interface ErrorEvent {
  id: string;
  type: 'network' | 'decode' | 'format' | 'drm' | 'unknown';
  code: number;
  message: string;
  timestamp: number;
  context: {
    videoUrl: string;
    currentTime: number;
    quality: string;
    userAgent: string;
  };
  stackTrace?: string;
  resolved: boolean;
}

// Analytics context interface
interface AnalyticsContextValue {
  config: AnalyticsConfig;
  isEnabled: boolean;
  isTracking: boolean;
  currentSession?: SessionData;
  metrics: AnalyticsMetrics;
  userJourney?: UserJourney;
  performance: PerformanceMetrics;
  errors: ErrorEvent[];
  
  // Configuration
  updateConfig: (config: Partial<AnalyticsConfig>) => void;
  enable: () => void;
  disable: () => void;
  
  // Session management
  startSession: (videoUrl: string, metadata?: any) => void;
  endSession: () => void;
  pauseTracking: () => void;
  resumeTracking: () => void;
  
  // Event tracking
  trackEvent: (event: Omit<PlaybackEvent, 'timestamp'>) => void;
  trackCustomEvent: (name: string, data?: any) => void;
  trackError: (error: Omit<ErrorEvent, 'id' | 'timestamp'>) => void;
  trackPerformance: (metrics: Partial<PerformanceMetrics>) => void;
  
  // Metrics and reporting
  getMetrics: (timeRange?: { start: number; end: number }) => AnalyticsMetrics;
  getUserJourney: (userId: string) => UserJourney | undefined;
  getHeatmapData: (videoUrl: string) => Array<{ time: number; intensity: number }>;
  getErrorReport: (timeRange?: { start: number; end: number }) => ErrorEvent[];
  
  // Data management
  exportData: (format: 'json' | 'csv') => string;
  clearData: () => void;
  flushEvents: () => Promise<void>;
  
  // Privacy compliance
  anonymizeUser: () => void;
  optOut: () => void;
  optIn: () => void;
  isOptedIn: boolean;
}

// Create context
const AnalyticsContext = createContext<AnalyticsContextValue | undefined>(undefined);

// Provider props
interface AnalyticsProviderProps {
  children: React.ReactNode;
  config?: Partial<AnalyticsConfig>;
  onEvent?: (event: PlaybackEvent) => void;
  onSessionEnd?: (session: SessionData) => void;
  onError?: (error: ErrorEvent) => void;
}

// Default configuration
const defaultConfig: AnalyticsConfig = {
  enabled: true,
  batchSize: 10,
  flushInterval: 30000, // 30 seconds
  enableRealtime: false,
  enableHeatmaps: true,
  enableUserJourney: true,
  enablePerformance: true,
  enableErrors: true,
  enableCustomEvents: true,
  privacy: {
    anonymizeIp: true,
    respectDoNotTrack: true,
    enableCookieConsent: true
  }
};

// Provider component
export function AnalyticsProvider({ 
  children, 
  config: initialConfig,
  onEvent,
  onSessionEnd,
  onError
}: AnalyticsProviderProps) {
  const [config, setConfig] = useState<AnalyticsConfig>({ ...defaultConfig, ...initialConfig });
  const [isTracking, setIsTracking] = useState(false);
  const [currentSession, setCurrentSession] = useState<SessionData | undefined>();
  const [metrics, setMetrics] = useState<AnalyticsMetrics>({
    totalViews: 0,
    totalWatchTime: 0,
    averageWatchTime: 0,
    completionRate: 0,
    bounceRate: 0,
    engagementRate: 0,
    qualityDistribution: {},
    deviceDistribution: {},
    errorRate: 0,
    bufferingRate: 0,
    popularSegments: [],
    heatmapData: [],
    geographicData: {},
    referrerData: {}
  });
  const [userJourney, setUserJourney] = useState<UserJourney | undefined>();
  const [performance, setPerformance] = useState<PerformanceMetrics>({
    loadTime: 0,
    firstFrame: 0,
    seekTime: 0,
    bufferHealth: 100,
    droppedFrames: 0,
    bandwidth: 0,
    latency: 0,
    startupTime: 0,
    rebufferingTime: 0,
    videoResolution: { width: 0, height: 0 },
    framerate: 0
  });
  const [errors, setErrors] = useState<ErrorEvent[]>([]);
  const [isOptedIn, setIsOptedIn] = useState(true);
  
  const eventQueue = useRef<PlaybackEvent[]>([]);
  const flushTimer = useRef<NodeJS.Timeout | null>(null);

  // Check if analytics is enabled
  const isEnabled = config.enabled && isOptedIn;

  // Generate session ID
  const generateSessionId = useCallback((): string => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Generate user ID
  const generateUserId = useCallback((): string => {
    let userId = localStorage.getItem('video-player-user-id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('video-player-user-id', userId);
    }
    return userId;
  }, []);

  // Get device information
  const getDeviceInfo = useCallback(() => {
    if (typeof window === 'undefined') {
      return {
        userAgent: '',
        screen: { width: 0, height: 0 },
        viewport: { width: 0, height: 0 },
        isMobile: false,
        isTablet: false,
        isDesktop: false
      };
    }

    const userAgent = navigator.userAgent;
    const isMobile = /Mobile|Android|iP(hone|od)|BlackBerry|IEMobile/.test(userAgent);
    const isTablet = /iPad|Android(?!.*Mobile)/.test(userAgent);
    const isDesktop = !isMobile && !isTablet;

    return {
      userAgent,
      screen: {
        width: screen.width,
        height: screen.height
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      isMobile,
      isTablet,
      isDesktop
    };
  }, []);

  // Get network information
  const getNetworkInfo = useCallback(() => {
    if (typeof window === 'undefined' || !('connection' in navigator)) {
      return {};
    }

    const connection = (navigator as any).connection;
    return {
      connection: connection?.effectiveType,
      downlink: connection?.downlink,
      rtt: connection?.rtt
    };
  }, []);

  // Update configuration
  const updateConfig = useCallback((newConfig: Partial<AnalyticsConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  // Enable analytics
  const enable = useCallback(() => {
    updateConfig({ enabled: true });
  }, [updateConfig]);

  // Disable analytics
  const disable = useCallback(() => {
    updateConfig({ enabled: false });
    endSession();
  }, [updateConfig]);

  // Start tracking session
  const startSession = useCallback((videoUrl: string, metadata?: any) => {
    if (!isEnabled) return;

    const sessionId = generateSessionId();
    const userId = generateUserId();
    const startTime = Date.now();

    const session: SessionData = {
      sessionId,
      userId,
      startTime,
      duration: 0,
      events: [],
      videoUrl,
      videoTitle: metadata?.title,
      videoDuration: metadata?.duration || 0,
      totalWatchTime: 0,
      completionRate: 0,
      qualityChanges: 0,
      bufferingEvents: 0,
      seekEvents: 0,
      errors: 0,
      device: getDeviceInfo(),
      network: getNetworkInfo(),
      performance: {
        loadTime: 0,
        firstPlay: 0,
        bufferHealth: 100,
        dropframes: 0
      }
    };

    setCurrentSession(session);
    setIsTracking(true);

    // Start flush timer
    if (flushTimer.current) {
      clearInterval(flushTimer.current);
    }
    flushTimer.current = setInterval(flushEvents, config.flushInterval);
  }, [isEnabled, generateSessionId, generateUserId, getDeviceInfo, getNetworkInfo, config.flushInterval]);

  // End tracking session
  const endSession = useCallback(() => {
    if (!currentSession || !isTracking) return;

    const endTime = Date.now();
    const finalSession: SessionData = {
      ...currentSession,
      endTime,
      duration: endTime - currentSession.startTime,
      completionRate: currentSession.videoDuration > 0 
        ? currentSession.totalWatchTime / currentSession.videoDuration 
        : 0
    };

    setCurrentSession(undefined);
    setIsTracking(false);

    // Clear flush timer
    if (flushTimer.current) {
      clearInterval(flushTimer.current);
      flushTimer.current = null;
    }

    // Flush remaining events
    flushEvents();

    onSessionEnd?.(finalSession);

    // Update metrics
    setMetrics(prev => ({
      ...prev,
      totalViews: prev.totalViews + 1,
      totalWatchTime: prev.totalWatchTime + finalSession.totalWatchTime,
      averageWatchTime: (prev.totalWatchTime + finalSession.totalWatchTime) / (prev.totalViews + 1)
    }));
  }, [currentSession, isTracking, onSessionEnd]);

  // Pause tracking
  const pauseTracking = useCallback(() => {
    setIsTracking(false);
  }, []);

  // Resume tracking
  const resumeTracking = useCallback(() => {
    if (currentSession) {
      setIsTracking(true);
    }
  }, [currentSession]);

  // Track event
  const trackEvent = useCallback((event: Omit<PlaybackEvent, 'timestamp'>) => {
    if (!isEnabled || !isTracking || !currentSession) return;

    const fullEvent: PlaybackEvent = {
      ...event,
      timestamp: Date.now()
    };

    // Add to event queue
    eventQueue.current.push(fullEvent);

    // Update session
    setCurrentSession(prev => {
      if (!prev) return prev;

      const updatedSession = {
        ...prev,
        events: [...prev.events, fullEvent]
      };

      // Update session stats based on event type
      switch (event.type) {
        case 'play':
          if (updatedSession.performance.firstPlay === 0) {
            updatedSession.performance.firstPlay = Date.now() - prev.startTime;
          }
          break;
        case 'seek':
          updatedSession.seekEvents++;
          break;
        case 'qualitychange':
          updatedSession.qualityChanges++;
          break;
        case 'error':
          updatedSession.errors++;
          break;
        case 'timeupdate':
          // Update watch time
          const watchTimeDelta = Math.min(1, event.currentTime - (prev.events[prev.events.length - 1]?.currentTime || 0));
          if (watchTimeDelta > 0) {
            updatedSession.totalWatchTime += watchTimeDelta;
          }
          break;
      }

      return updatedSession;
    });

    // Flush if batch size reached
    if (eventQueue.current.length >= config.batchSize) {
      flushEvents();
    }

    onEvent?.(fullEvent);
  }, [isEnabled, isTracking, currentSession, config.batchSize, onEvent]);

  // Track custom event
  const trackCustomEvent = useCallback((name: string, data?: any) => {
    if (!config.enableCustomEvents) return;

    trackEvent({
      type: 'timeupdate', // Use timeupdate as base type for custom events
      currentTime: currentSession?.events[currentSession.events.length - 1]?.currentTime || 0,
      duration: currentSession?.videoDuration || 0,
      volume: currentSession?.events[currentSession.events.length - 1]?.volume || 1,
      playbackRate: currentSession?.events[currentSession.events.length - 1]?.playbackRate || 1,
      isFullscreen: currentSession?.events[currentSession.events.length - 1]?.isFullscreen || false,
      data: { customEvent: name, ...data }
    });
  }, [config.enableCustomEvents, trackEvent, currentSession]);

  // Track error
  const trackError = useCallback((error: Omit<ErrorEvent, 'id' | 'timestamp'>) => {
    if (!config.enableErrors) return;

    const errorEvent: ErrorEvent = {
      ...error,
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      resolved: false
    };

    setErrors(prev => [...prev, errorEvent]);
    onError?.(errorEvent);

    // Track as regular event too
    trackEvent({
      type: 'error',
      currentTime: currentSession?.events[currentSession.events.length - 1]?.currentTime || 0,
      duration: currentSession?.videoDuration || 0,
      volume: currentSession?.events[currentSession.events.length - 1]?.volume || 1,
      playbackRate: currentSession?.events[currentSession.events.length - 1]?.playbackRate || 1,
      isFullscreen: currentSession?.events[currentSession.events.length - 1]?.isFullscreen || false,
      data: { error: errorEvent }
    });
  }, [config.enableErrors, onError, trackEvent, currentSession]);

  // Track performance metrics
  const trackPerformance = useCallback((newMetrics: Partial<PerformanceMetrics>) => {
    if (!config.enablePerformance) return;

    setPerformance(prev => ({ ...prev, ...newMetrics }));
  }, [config.enablePerformance]);

  // Get metrics with optional time range
  const getMetrics = useCallback((timeRange?: { start: number; end: number }): AnalyticsMetrics => {
    // TODO: Implement time range filtering
    return metrics;
  }, [metrics]);

  // Get user journey
  const getUserJourney = useCallback((userId: string): UserJourney | undefined => {
    // TODO: Implement user journey lookup
    return userJourney;
  }, [userJourney]);

  // Get heatmap data
  const getHeatmapData = useCallback((videoUrl: string): Array<{ time: number; intensity: number }> => {
    if (!config.enableHeatmaps) return [];
    
    // TODO: Implement heatmap data generation
    return metrics.heatmapData;
  }, [config.enableHeatmaps, metrics.heatmapData]);

  // Get error report
  const getErrorReport = useCallback((timeRange?: { start: number; end: number }): ErrorEvent[] => {
    let filteredErrors = errors;
    
    if (timeRange) {
      filteredErrors = errors.filter(error => 
        error.timestamp >= timeRange.start && error.timestamp <= timeRange.end
      );
    }
    
    return filteredErrors;
  }, [errors]);

  // Export data
  const exportData = useCallback((format: 'json' | 'csv'): string => {
    const data = {
      config,
      metrics,
      performance,
      errors,
      currentSession
    };

    if (format === 'json') {
      return JSON.stringify(data, null, 2);
    } else {
      // Convert to CSV format
      // TODO: Implement CSV export
      return '';
    }
  }, [config, metrics, performance, errors, currentSession]);

  // Clear all data
  const clearData = useCallback(() => {
    setMetrics({
      totalViews: 0,
      totalWatchTime: 0,
      averageWatchTime: 0,
      completionRate: 0,
      bounceRate: 0,
      engagementRate: 0,
      qualityDistribution: {},
      deviceDistribution: {},
      errorRate: 0,
      bufferingRate: 0,
      popularSegments: [],
      heatmapData: [],
      geographicData: {},
      referrerData: {}
    });
    setErrors([]);
    setUserJourney(undefined);
    eventQueue.current = [];
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('video-player-analytics-data');
    }
  }, []);

  // Flush events to storage/server
  const flushEvents = useCallback(async () => {
    if (eventQueue.current.length === 0) return;

    const eventsToFlush = [...eventQueue.current];
    eventQueue.current = [];

    try {
      // Save to localStorage
      if (typeof window !== 'undefined') {
        const savedData = localStorage.getItem('video-player-analytics-data');
        const existingData = savedData ? JSON.parse(savedData) : { events: [] };
        existingData.events.push(...eventsToFlush);
        localStorage.setItem('video-player-analytics-data', JSON.stringify(existingData));
      }

      // Send to server if endpoint is configured
      if (config.endpoint) {
        await fetch(config.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            trackingId: config.trackingId,
            events: eventsToFlush,
            session: currentSession
          })
        });
      }
    } catch (error) {
      console.error('Failed to flush analytics events:', error);
      // Re-add events to queue if flush failed
      eventQueue.current.unshift(...eventsToFlush);
    }
  }, [config.endpoint, config.trackingId, currentSession]);

  // Privacy compliance methods
  const anonymizeUser = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('video-player-user-id');
    }
    setUserJourney(undefined);
  }, []);

  const optOut = useCallback(() => {
    setIsOptedIn(false);
    endSession();
    clearData();
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('video-player-analytics-opt-out', 'true');
    }
  }, [endSession, clearData]);

  const optIn = useCallback(() => {
    setIsOptedIn(true);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('video-player-analytics-opt-out');
    }
  }, []);

  // Check opt-out status on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const optedOut = localStorage.getItem('video-player-analytics-opt-out');
      if (optedOut === 'true') {
        setIsOptedIn(false);
      }

      // Respect Do Not Track
      if (config.privacy.respectDoNotTrack && navigator.doNotTrack === '1') {
        setIsOptedIn(false);
      }
    }
  }, [config.privacy.respectDoNotTrack]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (flushTimer.current) {
        clearInterval(flushTimer.current);
      }
      flushEvents();
    };
  }, [flushEvents]);

  const contextValue: AnalyticsContextValue = {
    config,
    isEnabled,
    isTracking,
    currentSession,
    metrics,
    userJourney,
    performance,
    errors,
    updateConfig,
    enable,
    disable,
    startSession,
    endSession,
    pauseTracking,
    resumeTracking,
    trackEvent,
    trackCustomEvent,
    trackError,
    trackPerformance,
    getMetrics,
    getUserJourney,
    getHeatmapData,
    getErrorReport,
    exportData,
    clearData,
    flushEvents,
    anonymizeUser,
    optOut,
    optIn,
    isOptedIn
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
}

// Hook to use analytics context
export function useAnalytics(): AnalyticsContextValue {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}

// Convenience hooks
export function useAnalyticsEvent() {
  const { trackEvent, trackCustomEvent } = useAnalytics();
  return { trackEvent, trackCustomEvent };
}

export function useAnalyticsMetrics() {
  const { metrics, getMetrics } = useAnalytics();
  return { metrics, getMetrics };
}

export function useAnalyticsSession() {
  const { currentSession, startSession, endSession, isTracking } = useAnalytics();
  return { currentSession, startSession, endSession, isTracking };
}
