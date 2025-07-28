/**
 * Validation Schemas Index
 * Centralized schema exports for validation
 */

// Player Configuration Schema
export {
  PLAYER_CONFIG_SCHEMA,
  validatePlayerConfig
} from './player-config-schema';

// Plugin Schema
export {
  PLUGIN_SCHEMA,
  PLUGIN_REGISTRY_SCHEMA,
  PLUGIN_LIFECYCLE_EVENT_SCHEMA,
  validatePlugin,
  validatePluginConfig
} from './plugin-schema';

// Analytics Schema
export {
  ANALYTICS_EVENT_SCHEMA,
  ANALYTICS_SESSION_SCHEMA,
  ANALYTICS_CONFIG_SCHEMA,
  validateAnalyticsEvent,
  validateAnalyticsConfig
} from './analytics-schema';

// Streaming Schema
export {
  STREAMING_CONFIG_SCHEMA,
  validateStreamingConfig,
  validateStreamingSource
} from './streaming-schema';

// Theme Schema
export {
  THEME_SCHEMA,
  validateTheme
} from './theme-schema';

// AI Schema
export {
  AI_CONFIG_SCHEMA,
  AI_MODEL_SCHEMA,
  validateAIConfig,
  validateAIModel
} from './ai-schema';

// MCP Schema
export {
  MCP_SERVER_CONFIG_SCHEMA,
  MCP_TOOL_SCHEMA,
  MCP_RESOURCE_SCHEMA,
  MCP_PROMPT_SCHEMA,
  MCP_MESSAGE_SCHEMA,
  MCP_CLIENT_CONFIG_SCHEMA,
  VIDEO_PLAYER_MCP_SCHEMA,
  validateMCPServerConfig,
  validateMCPClientConfig,
  validateVideoPlayerMCP
} from './mcp-schema';
