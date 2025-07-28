/**
 * 📊 ANALYTICS PLUGINS - Performance & Behavior Tracking Suite
 * 
 * ===============================================================================
 * 📋 PURPOSE: Comprehensive analytics and monitoring for video player performance
 * 🏗️ ARCHITECTURE: Observer Pattern + Event-driven analytics collection
 * 🔗 RELATIONSHIPS: core/video-engine → analytics plugins → external services
 * ===============================================================================
 * 
 * 📈 ANALYTICS CAPABILITIES:
 * ├── 🏛️ BaseAnalytics - Foundation analytics framework
 * │   ├── 📊 Event collection infrastructure
 * │   ├── 🔄 Data processing pipeline
 * │   └── 🔗 Used by: all analytics implementations
 * │
 * ├── 🎬 PlayerAnalytics - Player behavior tracking
 * │   ├── ▶️ Play/pause events, seek behavior
 * │   ├── 📊 Watch time, completion rates
 * │   └── 🔗 Used in: AnalyticsPanel, PlayerInsights
 * │
 * ├── ⚡ PerformanceAnalytics - Technical performance monitoring
 * │   ├── 🚀 Load times, buffer health, quality switches
 * │   ├── 📡 Network performance, error rates
 * │   └── 🔗 Used in: PerformanceMonitor, TechnicalDashboard
 * │
 * └── 🎨 CustomAnalytics - Configurable event tracking
 *     ├── 🔧 Custom event definitions
 *     ├── 📊 Business-specific metrics
 *     └── 🔗 Used in: CustomDashboard, BusinessIntelligence
 * 
 * 🎯 INTEGRATION EXAMPLES:
 * ```typescript
 * // Basic analytics setup
 * import { PlayerAnalyticsPlugin, PerformanceAnalyticsPlugin } from '@/plugins/analytics'
 * 
 * // Custom analytics configuration
 * import { CustomAnalyticsPlugin, BaseAnalyticsPlugin } from '@/plugins/analytics'
 * 
 * // Analytics dashboard
 * import { PlayerAnalyticsPlugin } from '@/plugins/analytics'
 * const analytics = useAnalyticsTracker(PlayerAnalyticsPlugin)
 * ```
 */

// 🏛️ Analytics Foundation
export { BaseAnalyticsPlugin } from './base-analytics'          // 🏗️ Analytics framework - extended by: all analytics plugins
export { PlayerAnalyticsPlugin } from './player-analytics'     // 🎬 Player behavior - used in: AnalyticsPanel, PlayerInsights
export { PerformanceAnalyticsPlugin } from './performance-analytics' // ⚡ Performance metrics - used in: PerformanceMonitor, TechDashboard
export { CustomAnalyticsPlugin } from './custom-analytics'     // 🎨 Custom tracking - used in: CustomDashboard, BusinessIntelligence

// Type exports
export type {
  AnalyticsEvent,
  AnalyticsConfig,
  PerformanceMetrics,
  PlayerBehaviorData,
  CustomEventData
} from './base-analytics';
