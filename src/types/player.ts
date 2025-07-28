/**
 * Modern Player Configuration System
 * Clean, simple, and extensible player types
 */

export interface PlayerConfig {
  // Source configuration
  src?: string;
  poster?: string;
  
  // Playback settings
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  volume?: number;
  playbackRate?: number;
  preload?: 'none' | 'metadata' | 'auto';
  
  // Display settings
  width?: number;
  height?: number;
  aspectRatio?: string;
  playsInline?: boolean;
  crossOrigin?: 'anonymous' | 'use-credentials';
  
  // Control settings
  controls?: boolean;
  showProgressBar?: boolean;
  showVolumeControl?: boolean;
  showFullscreenButton?: boolean;
  showPlaybackRate?: boolean;
  showQualitySelector?: boolean;
  
  // Quality settings
  defaultQuality?: string;
  adaptiveStreaming?: boolean;
  
  // Mobile settings
  enableGestures?: boolean;
  showMobileControls?: boolean;
  
  // Accessibility settings
  enableKeyboardShortcuts?: boolean;
  enableScreenReader?: boolean;
  announcePlayState?: boolean;
  
  // Analytics settings
  enableAnalytics?: boolean;
  
  // AI settings
  enableAI?: boolean;
  aiFeatures?: {
    autoThumbnails?: boolean;
    autoCaptions?: boolean;
    contentAnalysis?: boolean;
    qualityOptimization?: boolean;
  };
  
  // MCP settings
  enableMCP?: boolean;
}

// 🎯 Modern Presets - Simple and effective
export const PlayerPresets = {
  youtube: {
    controls: true,
    showProgressBar: true,
    showVolumeControl: true,
    showFullscreenButton: true,
    showPlaybackRate: true,
    showQualitySelector: true,
    enableGestures: true,
    enableKeyboardShortcuts: true,
    enableAnalytics: true,
  } as PlayerConfig,

  minimal: {
    controls: true,
    showProgressBar: true,
    showVolumeControl: false,
    showFullscreenButton: true,
    showPlaybackRate: false,
    showQualitySelector: false,
    enableGestures: true,
    enableKeyboardShortcuts: false,
  } as PlayerConfig,

  mobile: {
    controls: true,
    showProgressBar: true,
    showVolumeControl: false,
    showFullscreenButton: true,
    showPlaybackRate: false,
    showQualitySelector: true,
    enableGestures: true,
    showMobileControls: true,
    enableKeyboardShortcuts: false,
  } as PlayerConfig,

  background: {
    controls: false,
    autoPlay: true,
    muted: true,
    loop: true,
    enableGestures: false,
    enableKeyboardShortcuts: false,
  } as PlayerConfig
};

export interface PlayerState {
  isReady: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  isMuted: boolean;
  isFullscreen: boolean;
  isPictureInPicture: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  buffered: number;
  playbackRate: number;
  error: string | null;
}

export interface PlayerControls {
  play: () => Promise<void>;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleFullscreen: () => void;
  togglePictureInPicture: () => Promise<void>;
  setPlaybackRate: (rate: number) => void;
  destroy: () => void;
}

export interface PlayerTheme {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
  borderRadius: string;
  shadows: boolean;
  animations: boolean;
}

export interface PlayerPreferences {
  volume: number;
  muted: boolean;
  playbackRate: number;
  quality: string;
  subtitles: boolean;
  autoPlay: boolean;
  theme: string;
}
