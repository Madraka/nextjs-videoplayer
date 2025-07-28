/**
 * NextJS Video Player - Main Export
 * Single source of truth for all components, hooks, types, and utilities
 */

"use client";

// 🎬 Primary Video Player Components
export { PlayerContainer } from './components/player/player-container';        // 👑 MAIN - Single import ready-to-use player
export { ConfigurableVideoPlayer } from './components/player/configurable-video-player';
export { VideoPlayer } from './components/player/video-player';

// 📱 Player Controls
export { VideoControls } from './components/controls/video-controls';
export { MobileVideoControls } from './components/controls/mobile-video-controls';

// 🎨 UI Components
export { VideoThumbnail } from './components/player/video-thumbnail';
export { LoadingSpinner } from './components/player/loading-spinner';
export { ErrorDisplay } from './components/player/error-display';

// 🎮 Demo Components (Optional)
export { VideoPlayerDemo } from './components/demo/video-player-demo';
export { VideoSourceSelector } from './components/demo/video-source-selector';

// ⚙️ Configuration & Context
export { PlayerConfigProvider, usePlayerConfig, usePlayerPresets } from './contexts/player-config-context';
export { PlayerConfigPanel } from './components/config/player-config-panel';

// 🪝 React Hooks
export { useVideoPlayer } from './hooks/use-video-player';
export { useVideoGestures } from './hooks/use-video-gestures';

// 🔧 Core Engine & Utilities
export { VideoEngine } from './core/engine';
export { getBrowserCapabilities, getStreamingStrategy } from './core/compatibility';

// 📝 TypeScript Types
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
} from './core/engine';

export type {
  GestureConfig,
  GestureCallbacks,
} from './hooks/use-video-gestures';

// 🎯 Configuration Presets
export { PlayerPresets, mergePlayerConfig } from './types/player-config';

// 🛠️ Utilities
export { cn } from './lib/utils';

// 📦 Package Info
export const VERSION = '1.0.0';
