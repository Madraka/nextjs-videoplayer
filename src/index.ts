// Main Components
export { ConfigurableVideoPlayer } from './components/player/configurable-video-player';
export { VideoPlayer } from './components/player/video-player';
export { MobileVideoControls } from './components/controls/mobile-video-controls';
export { VideoControls } from './components/controls/video-controls';
export { VideoThumbnail } from './components/player/video-thumbnail';
export { LoadingSpinner } from './components/player/loading-spinner';
export { ErrorDisplay } from './components/player/error-display';

// Demo Components (Optional)
export { VideoPlayerDemo } from './components/demo/video-player-demo';
export { VideoSourceSelector } from './components/demo/video-source-selector';

// Context & Configuration
export { PlayerConfigProvider, usePlayerConfig, usePlayerPresets } from './contexts/player-config-context';
export { PlayerConfigPanel } from './components/config/player-config-panel';

// Hooks
export { useVideoPlayer } from './hooks/use-video-player';
export { useVideoGestures } from './hooks/use-video-gestures';

// Core Engine
export { VideoEngine } from './core/video-engine';
export { getBrowserCapabilities, getStreamingStrategy } from './core/compatibility';

// Types
export type { 
  PlayerConfiguration,
  PlayerTheme,
  ControlsVisibility,
  KeyboardShortcutsConfig,
  GesturesConfig,
  AutoBehavior,
  AnalyticsConfig,
  AdvancedFeatures,
} from './types/player-config';

export type {
  VideoPlayerState,
  VideoPlayerControls,
} from './hooks/use-video-player';

export type {
  VideoEngineConfig,
  VideoEngineEvents,
} from './core/video-engine';

export type {
  GestureConfig,
  GestureCallbacks,
} from './hooks/use-video-gestures';

// Presets
export { PlayerPresets, mergePlayerConfig } from './types/player-config';

// Utilities
export { cn } from './lib/utils';

// Version
export const VERSION = '1.0.0';
