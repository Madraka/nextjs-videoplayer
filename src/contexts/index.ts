/**
 * Contexts Index
 * Centralized exports for all React contexts
 */

// Player Context
export {
  PlayerProvider,
  usePlayer,
  usePlayerState,
  usePlayerControls
} from './player-context';

// Theme Context
export {
  ThemeProvider,
  useTheme,
  useThemeColors,
  useThemeSpacing,
  useThemeTypography
} from './theme-context';

// Plugin Context
export {
  PluginProvider,
  usePlugin,
  usePluginConfig,
  usePluginHooks
} from './plugin-context';

// Analytics Context
export {
  AnalyticsProvider,
  useAnalytics,
  useAnalyticsEvent,
  useAnalyticsMetrics,
  useAnalyticsSession
} from './analytics-context';

// Configuration Context
export {
  ConfigurationProvider,
  useConfiguration,
  usePlayerConfig as usePlayerConfiguration,
  useAdvancedConfig,
  useConfigurationProfiles,
  useConfigurationPresets
} from './configuration-context';

// AI Context
export {
  AIProvider,
  useAI,
  useSmartThumbnails,
  useContentAnalysis,
  useAutoChapters,
  useTranscription
} from './ai-context';

// MCP Context
export {
  MCPProvider,
  useMCP,
  useMCPPredictions,
  useMCPRecommendations,
  useMCPWorkflows,
  useMCPInsights
} from './mcp-context';

// Legacy contexts (keep for compatibility)
export { PlayerConfigProvider, usePlayerConfig } from './player-config-context';
