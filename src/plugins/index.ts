/**
 * 🧩 PLUGIN SYSTEM INDEX - Extensible Plugin Architecture
 * 
 * ===============================================================================
 * 📋 PURPOSE: Centralized plugin registry and lifecycle management
 * 🏗️ ARCHITECTURE: Plugin Pattern + Observer Pattern for extensibility
 * 🔗 RELATIONSHIPS: core/video-engine → plugins → hooks/components
 * ===============================================================================
 * 
 * 🎯 PLUGIN CATEGORIES:
 * ├── 📊 Analytics Plugins - User behavior and performance tracking
 * │   ├── 📈 Player analytics, performance metrics
 * │   └── 🔗 Used in: AnalyticsPanel, MetricsDisplay
 * │
 * ├── 📡 Streaming Plugins - Enhanced streaming capabilities
 * │   ├── 🎬 HLS/DASH optimizations, bandwidth management
 * │   └── 🔗 Used in: StreamingEngine, QualityManager
 * │
 * ├── ♿ Accessibility Plugins - Inclusive video experience
 * │   ├── ⌨️ Keyboard navigation, screen reader support
 * │   └── 🔗 Used in: AccessibilityProvider, A11yControls
 * │
 * ├── 🤖 AI Plugins - Smart video features
 * │   ├── 🧠 Content analysis, auto-captions, smart quality
 * │   └── 🔗 Used in: AIFeatures, SmartEnhancements
 * │
 * ├── 🔗 MCP Plugins - Model Context Protocol integration
 * │   ├── 🤖 AI model integration, protocol handling
 * │   └── 🔗 Used in: MCPProvider, ExternalAI
 * │
 * ├── 👥 Social Plugins - Social interaction features
 * │   ├── 💬 Sharing, comments, watch parties
 * │   └── 🔗 Used in: SocialFeatures, CommunityTools
 * │
 * └── 💰 Monetization Plugins - Revenue generation
 *     ├── 📺 Ads, subscriptions, pay-per-view
 *     └── 🔗 Used in: MonetizationManager, RevenueTools
 * 
 * 🎯 USAGE EXAMPLES:
 * ```typescript
 * // Basic plugin usage
 * import { PluginRegistry, BasePlugin } from '@/plugins'
 * 
 * // Specific plugin categories
 * import { AnalyticsPlugin } from '@/plugins/analytics'
 * import { AccessibilityPlugin } from '@/plugins/accessibility'
 * 
 * // Plugin management
 * const registry = new PluginRegistry()
 * await registry.registerPlugin('analytics', analyticsPlugin)
 * ```
 */

// 🏗️ Core Plugin Infrastructure
export { PluginRegistry } from './registry'                     // 🧩 Plugin manager - used in: PluginManager, ConfigurablePlayer
export { BasePlugin } from './base-plugin'                      // 🔧 Plugin base class - extended by: all custom plugins
export { LifecycleManager } from './lifecycle-manager'          // 🔄 Plugin lifecycle - used in: PluginRegistry, BasePlugin

// 📊 Analytics Plugins - Performance and behavior tracking
export * from './analytics'                                     // 📈 Analytics suite - used in: AnalyticsPanel, MetricsDisplay

// 📡 Streaming Enhancement Plugins
export * from './streaming'                                     // 🎬 Streaming optimizations - used in: StreamingEngine, QualityManager

// ♿ Accessibility Feature Plugins  
export * from './accessibility'                                 // ⌨️ A11y features - used in: AccessibilityProvider, KeyboardHandler

// 🤖 AI-Powered Feature Plugins
export * from './ai'                                           // 🧠 AI enhancements - used in: AIFeatures, SmartAnalysis

// 🔗 Model Context Protocol Plugins
export * from './mcp'                                          // 🤖 MCP integration - used in: MCPProvider, ExternalModels

// 👥 Social Interaction Plugins
export * from './social'                                       // 💬 Social features - used in: SocialManager, CommunityTools

// 💰 Monetization Feature Plugins
export * from './monetization'                                 // 💰 Revenue tools - used in: MonetizationManager, AdManager

// 🏷️ Plugin System Constants
export const PLUGIN_TYPES = {
  ANALYTICS: 'analytics',
  STREAMING: 'streaming',
  ACCESSIBILITY: 'accessibility',
  AI: 'ai',
  MCP: 'mcp',
  SOCIAL: 'social',
  MONETIZATION: 'monetization'
} as const;

export const PLUGIN_STATUS = {
  INACTIVE: 'inactive',
  INITIALIZING: 'initializing',
  ACTIVE: 'active',
  ERROR: 'error',
  DESTROYING: 'destroying'
} as const;

/**
 * 🔗 PLUGIN DEPENDENCY MAP:
 * 
 * PLUGINS → CORE:
 * ├── All Plugins → VideoEngine (event subscription)
 * ├── Streaming Plugins → Engine strategies
 * └── Analytics Plugins → Performance monitoring
 * 
 * PLUGINS → HOOKS:
 * ├── Analytics → useAnalyticsTracker, usePerformanceMonitor
 * ├── Accessibility → useKeyboardShortcuts, useGestureHandler
 * ├── AI → useAIFeatures, useContentAnalyzer
 * └── MCP → useMCPIntegration
 * 
 * PLUGINS → COMPONENTS:
 * ├── Analytics → AnalyticsPanel, MetricsDisplay
 * ├── Accessibility → KeyboardHandler, ScreenReaderSupport
 * ├── Social → SharingManager, CommentSystem
 * └── Monetization → AdManager, SubscriptionGate
 */
