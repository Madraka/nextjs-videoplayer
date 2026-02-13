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
export type { VideoSource } from './components/demo/video-source-selector';

// Context & Configuration
export { PlayerConfigProvider, usePlayerConfig, usePlayerPresets } from './contexts/player-config-context';
export { PlayerConfigPanel } from './components/config/player-config-panel';

// Hooks
export { useVideoPlayer } from './hooks/use-video-player';
export { useVideoGestures } from './hooks/use-video-gestures';

// Core Engine
export { VideoEngine } from './core/video-engine';
export { getBrowserCapabilities, getStreamingStrategy } from './core/compatibility';
export { AdapterRegistry } from './core/adapters/adapter-registry';
export { defaultStreamingAdapters } from './core/adapters/default-adapters';
export { VideoEnginePluginManager } from './core/plugins/plugin-manager';
export { createEmeController, isEmeSupported } from './core/drm/eme-controller';
export { createTokenLicenseRequestHandler } from './core/drm/license-request';

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
  VideoEngineOptions,
} from './core/video-engine';

export type {
  QualityLevel,
  StreamingAdapter,
  StreamingAdapterFactory,
  AdapterSelectionContext,
  AdapterLoadContext,
} from './core/adapters/types';

export type {
  DrmConfiguration,
  DrmLicenseRequestContext,
  DrmLicenseRequestHandler,
  DrmSystemConfiguration,
} from './core/drm/types';

export type {
  EmeController,
  EmeEnvironment,
} from './core/drm/eme-controller';

export type {
  TokenLicenseRequestHandlerOptions,
} from './core/drm/license-request';

export type {
  VideoEnginePlugin,
  VideoEnginePluginContext,
  VideoEnginePluginErrorPayload,
  VideoEnginePluginLoadPayload,
  VideoEnginePluginSourceLoadFailedPayload,
  VideoEnginePluginTimeUpdatePayload,
  VideoEnginePluginVolumePayload,
} from './core/plugins/types';

export type {
  GestureConfig,
  GestureCallbacks,
} from './hooks/use-video-gestures';

// Presets
export { PlayerPresets, mergePlayerConfig } from './types/player-config';

// Utilities
export { cn } from './lib/utils';
export { AnalyticsPlugin, createAnalyticsPlugin } from './plugins/analytics';
export type {
  AnalyticsConfig as EngineAnalyticsConfig,
  AnalyticsEvent,
} from './plugins/analytics';

// Version
export const VERSION = '1.0.0';
