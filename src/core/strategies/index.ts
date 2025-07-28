/**
 * 🧠 STREAMING STRATEGIES - Strategy Pattern Implementations
 * 
 * ===============================================================================
 * 📋 PURPOSE: Advanced streaming logic and optimization strategies
 * 🏗️ ARCHITECTURE: Strategy Pattern for modular streaming behavior
 * 🔗 RELATIONSHIPS: core/engines → strategies → quality management
 * ===============================================================================
 * 
 * 📊 STRATEGY HIERARCHY:
 * ├── 🎯 AdaptiveStrategy - Dynamic quality adaptation
 * │   ├── 📶 Network speed monitoring
 * │   ├── 🎚️ Automatic quality switching
 * │   └── 🔗 Used by: HlsEngine, DashEngine
 * │
 * ├── 📡 BandwidthStrategy - Bandwidth optimization
 * │   ├── 📊 Bandwidth measurement
 * │   ├── 📈 Predictive analysis
 * │   └── 🔗 Used by: All streaming engines
 * │
 * ├── 🎛️ QualityStrategy - Quality level management
 * │   ├── 🎯 Quality selection logic
 * │   ├── 📱 Device capability consideration
 * │   └── 🔗 Used by: Quality controls, AI optimizer
 * │
 * └── 🔄 FallbackStrategy - Error recovery mechanisms
 *     ├── 🚨 Engine fallback chain
 *     ├── 🔗 Alternative source switching
 *     └── 🔗 Used by: All engines for reliability
 * 
 * 🎯 USAGE EXAMPLES:
 * ```typescript
 * // In HLS Engine
 * import { AdaptiveStrategy, BandwidthStrategy } from '@/core/strategies'
 * 
 * // In Quality Manager
 * import { QualityStrategy } from '@/core/strategies'
 * 
 * // In Error Handler
 * import { FallbackStrategy } from '@/core/strategies'
 * ```
 */

// 🎯 Main Streaming Strategies
export { AdaptiveStrategy } from './adaptive-strategy'           // 🎯 Dynamic quality adaptation - HLS/DASH engines
export { BandwidthStrategy } from './bandwidth-strategy'         // 📡 Bandwidth optimization - all engines
export { QualityStrategy } from './quality-strategy'            // 🎛️ Quality selection logic - quality controls
export { FallbackStrategy } from './fallback-strategy'          // 🔄 Error recovery - reliability layer

// Strategy types
export type {
  StrategyInterface,
  AdaptiveConfig,
  BandwidthConfig,
  QualityConfig,
  FallbackConfig,
  StrategyResult,
  StrategyMetrics
} from './types';
