/**
 * Comprehensive video player configuration types
 * Enables granular control over every aspect of the player
 */

export interface PlayerTheme {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  text?: string;
  controlsBackground?: string;
  progressColor?: string;
  bufferColor?: string;
}

export interface ControlsVisibility {
  playPause?: boolean;
  progress?: boolean;
  volume?: boolean;
  quality?: boolean;
  fullscreen?: boolean;
  pictureInPicture?: boolean;
  theaterMode?: boolean;
  playbackRate?: boolean;
  keyboardShortcuts?: boolean;
  settings?: boolean;
  time?: boolean;
}

export interface KeyboardShortcutsConfig {
  enabled?: boolean;
  customKeys?: {
    playPause?: string[];
    fullscreen?: string[];
    mute?: string[];
    pictureInPicture?: string[];
    theaterMode?: string[];
    seekForward?: string[];
    seekBackward?: string[];
    volumeUp?: string[];
    volumeDown?: string[];
    restart?: string[];
    jumpToPercent?: string[];
  };
}

export interface GesturesConfig {
  enabled?: boolean;
  tapToPlay?: boolean;
  doubleTapSeek?: boolean;
  swipeVolume?: boolean;
  pinchToZoom?: boolean;
  seekOnSwipe?: boolean;
}

export interface AutoBehavior {
  autoPlay?: boolean;
  autoHideControls?: boolean;
  autoHideDelay?: number;
  autoQuality?: boolean;
  autoPictureInPictureOnScroll?: boolean;
  autoTheaterOnLandscape?: boolean;
  rememberVolume?: boolean;
  rememberPlaybackRate?: boolean;
}

export interface AnalyticsConfig {
  enabled?: boolean;
  trackPlay?: boolean;
  trackPause?: boolean;
  trackSeek?: boolean;
  trackQualityChange?: boolean;
  trackFullscreen?: boolean;
  trackPictureInPicture?: boolean;
  customEvents?: string[];
}

export interface AdvancedFeatures {
  chapters?: boolean;
  subtitles?: boolean;
  thumbnailPreview?: boolean;
  miniPlayer?: boolean;
  playlist?: boolean;
  airPlay?: boolean;
  chromecast?: boolean;
  downloadButton?: boolean;
  shareButton?: boolean;
  loopButton?: boolean;
}

export interface PlayerConfiguration {
  // Basic settings
  theme?: PlayerTheme;
  
  // Controls configuration
  controls?: {
    show?: boolean;
    visibility?: ControlsVisibility;
    position?: 'bottom' | 'top' | 'overlay' | 'external';
    style?: 'youtube' | 'vimeo' | 'netflix' | 'minimal' | 'custom';
    size?: 'small' | 'medium' | 'large';
  };
  
  // Keyboard shortcuts
  keyboard?: KeyboardShortcutsConfig;
  
  // Touch gestures
  gestures?: GesturesConfig;
  
  // Auto behaviors
  auto?: AutoBehavior;
  
  // Analytics
  analytics?: AnalyticsConfig;
  
  // Advanced features
  features?: AdvancedFeatures;
  
  // Responsive behavior
  responsive?: {
    enabled?: boolean;
    breakpoints?: {
      mobile?: number;
      tablet?: number;
      desktop?: number;
    };
    adaptiveControls?: boolean;
    hideControlsOnMobile?: string[];
  };
  
  // Performance
  performance?: {
    preload?: 'none' | 'metadata' | 'auto';
    lazy?: boolean;
    bufferAhead?: number;
    maxBufferLength?: number;
  };
  
  // Customization
  customization?: {
    css?: string;
    className?: string;
    hideDefaultStyles?: boolean;
    customIcons?: { [key: string]: React.ComponentType };
  };
}

// Preset configurations for different use cases
export const PlayerPresets: { [key: string]: PlayerConfiguration } = {
  // YouTube-like experience
  youtube: {
    controls: {
      show: true,
      visibility: {
        playPause: true,
        progress: true,
        volume: true,
        quality: true,
        fullscreen: true,
        pictureInPicture: true,
        theaterMode: true,
        playbackRate: true,
        keyboardShortcuts: true,
        settings: true,
        time: true,
      },
      style: 'youtube',
      position: 'bottom',
    },
    keyboard: { enabled: true },
    gestures: { enabled: true, tapToPlay: true, doubleTapSeek: true },
    auto: { autoHideControls: true, autoHideDelay: 3000 },
    features: { thumbnailPreview: true, chapters: true },
  },

  // Minimal player
  minimal: {
    controls: {
      show: true,
      visibility: {
        playPause: true,
        progress: true,
        fullscreen: true,
      },
      style: 'minimal',
    },
    keyboard: { enabled: false },
    gestures: { enabled: true, tapToPlay: true },
    auto: { autoHideControls: true, autoHideDelay: 2000 },
  },

  // No controls (video background)
  background: {
    controls: { show: false },
    keyboard: { enabled: false },
    gestures: { enabled: false },
    auto: { autoPlay: true },
  },

  // Netflix-style
  netflix: {
    controls: {
      show: true,
      visibility: {
        playPause: true,
        progress: true,
        volume: true,
        fullscreen: true,
        playbackRate: true,
        time: true,
      },
      style: 'netflix',
    },
    theme: {
      primary: '#e50914',
      controlsBackground: 'rgba(0,0,0,0.7)',
    },
    auto: { autoHideControls: true, autoHideDelay: 4000 },
  },

  // Mobile-optimized
  mobile: {
    controls: {
      show: true,
      visibility: {
        playPause: true,
        progress: true,
        fullscreen: true,
        volume: false, // Hidden on mobile
        quality: true,
      },
      size: 'large',
    },
    gestures: { 
      enabled: true, 
      tapToPlay: true, 
      doubleTapSeek: true,
      swipeVolume: true 
    },
    responsive: {
      enabled: true,
      adaptiveControls: true,
      hideControlsOnMobile: ['volume', 'keyboardShortcuts'],
    },
  },

  // Custom minimal with only play/pause
  playOnly: {
    controls: {
      show: true,
      visibility: {
        playPause: true,
        progress: false,
        volume: false,
        quality: false,
        fullscreen: false,
        pictureInPicture: false,
        theaterMode: false,
        playbackRate: false,
        keyboardShortcuts: false,
        settings: false,
        time: false,
      },
      style: 'minimal',
    },
    keyboard: { enabled: false },
    gestures: { enabled: true, tapToPlay: true },
  },
};

// Helper function to merge configurations
export const mergePlayerConfig = (
  base: PlayerConfiguration = {},
  override: PlayerConfiguration = {}
): PlayerConfiguration => {
  return {
    theme: { ...base.theme, ...override.theme },
    controls: {
      ...base.controls,
      ...override.controls,
      visibility: {
        ...base.controls?.visibility,
        ...override.controls?.visibility,
      },
    },
    keyboard: { ...base.keyboard, ...override.keyboard },
    gestures: { ...base.gestures, ...override.gestures },
    auto: { ...base.auto, ...override.auto },
    analytics: { ...base.analytics, ...override.analytics },
    features: { ...base.features, ...override.features },
    responsive: { ...base.responsive, ...override.responsive },
    performance: { ...base.performance, ...override.performance },
    customization: { ...base.customization, ...override.customization },
  };
};
