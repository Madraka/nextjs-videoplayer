/**
 * 🎯 CORE VIDEO ENGINE - Main Video Engine System
 * 
 * ===============================================================================
 * 📋 PURPOSE: Centralized management of video playback engine
 * 🏗️ ARCHITECTURE: Modular engine system + strategy pattern
 * 🔗 RELATIONSHIPS: components/player → hooks/use-video-engine → contexts/player-context
 * ===============================================================================
 * 
 * 📊 USAGE MAP:
 * ├── 🏛️ VideoEngine (ROOT) - Main engine class
 * │   ├── 📺 components/player/video-player.tsx
 * │   ├── 🎮 hooks/use-video-player.ts
 * │   └── 🎯 contexts/player-context.tsx
 * │
 * ├── 🔍 CompatibilityChecker - Browser compatibility
 * │   ├── 📱 hooks/use-video-engine.ts
 * │   ├── 🎛️ components/player/player-container.tsx
 * │   └── ⚙️ presets/mobile-optimized.ts
 * │
 * ├── 🎭 FormatDetector - Video format detection
 * │   ├── 🔗 core/engines/hls-engine.ts
 * │   ├── 🔗 core/engines/dash-engine.ts
 * │   └── 📊 plugins/analytics/player-analytics.ts
 * │
 * ├── 🎚️ QualityManager - Quality level management
 * │   ├── 🎮 hooks/use-quality-manager.ts
 * │   ├── 🎛️ components/controls/quality-selector.tsx
 * │   └── 🧠 ai/quality-optimizer.ts
 * │
 * └── 🚨 ErrorHandler - Error management system
 *     ├── 🛡️ components/player/error-boundary.tsx
 *     ├── 📊 plugins/analytics/performance-analytics.ts
 *     └── 🎯 contexts/player-context.tsx
 * 
 * 🔄 ENGINE FLOW:
 * 1️⃣ VideoEngine.create() → Compatibility check
 * 2️⃣ FormatDetector → Format detection (HLS/DASH/MP4)
 * 3️⃣ Engine Selection → Appropriate engine selection
 * 4️⃣ QualityManager → Initial quality setup
 * 5️⃣ Strategy Application → Streaming strategy
 * 
 * 🎯 INTEGRATION EXAMPLES:
 * ```typescript
 * // In PlayerContainer
 * import { VideoEngine, CompatibilityChecker } from '@/core'
 * 
 * // In Hook
 * import { VideoEngine, QualityManager } from '@/core'
 * 
 * // In Plugin
 * import { FormatDetector, ErrorHandler } from '@/core'
 * ```
 */

// 🏛️ Main Engine Systems
export { VideoEngine } from './engine'                          // 🎯 Main video engine - PlayerContainer, useVideoPlayer  
export type { VideoEngineConfig, VideoEngineEvents } from './engine';

// 🔍 Browser Compatibility System  
export { getBrowserCapabilities, getStreamingStrategy } from './compatibility'  // 🔍 Browser checks - useVideoEngine, mobile presets
export type { BrowserCapabilities } from './compatibility';

// 🎮 Engine Implementations (from engines and strategies subdirectories)
export * from './engines'                                       // 🎮 All engines - HLS, DASH, Native, WebRTC
export * from './strategies'                                    // 🧠 Streaming strategies - adaptive, bandwidth, fallback

// 📋 Type Definitions
export type { 
  VideoFormat, 
  QualityLevel, 
  StreamingQuality,
  ErrorType,
  VideoError 
} from '../types';

/**
 * 🔗 DEPENDENCY MAP:
 * 
 * CORE → HOOKS:
 * ├── VideoEngine → useVideoPlayer, useVideoEngine
 * ├── QualityManager → useQualityManager  
 * └── ErrorHandler → useErrorBoundary
 * 
 * CORE → COMPONENTS:
 * ├── VideoEngine → PlayerContainer, VideoPlayer
 * ├── CompatibilityChecker → PlayerContainer
 * └── ErrorHandler → ErrorBoundary
 * 
 * CORE → PLUGINS:
 * ├── FormatDetector → StreamingPlugins
 * ├── QualityManager → AnalyticsPlugins
 * └── ErrorHandler → PerformanceAnalytics
 * 
 * CORE → AI:
 * ├── QualityManager → quality-optimizer.ts
 * ├── FormatDetector → content-analyzer.ts
 * └── ErrorHandler → performance-monitor.ts
 */══════════════════════════════════════════════════════════════════
 * 📋 PURPOSE: Centralized management of video playback engine
 * 🏗️ ARCHITECTURE: Modular engine system + strategy pattern
 * 🔗 RELATIONSHIPS: components/player → hooks/use-video-engine → contexts/player-context
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * 📊 USAGE MAP:
 * ├── 🏛️ VideoEngine (ROOT) - Main engine class
 * │   ├── 📺 components/player/video-player.tsx
 * │   ├── 🎮 hooks/use-video-player.ts
 * │   └── 🎯 contexts/player-context.tsx
 * │
 * ├── 🔍 CompatibilityChecker - Browser compatibility
 * │   ├── 📱 hooks/use-video-engine.ts
 * │   ├── 🎛️ components/player/player-container.tsx
 * │   └── ⚙️ presets/mobile-optimized.ts
 * │
 * ├── 🎭 FormatDetector - Video format detection
 * │   ├── 🔗 core/engines/hls-engine.ts
 * │   ├── 🔗 core/engines/dash-engine.ts
 * │   └── 📊 plugins/analytics/player-analytics.ts
 * │
 * ├── 🎚️ QualityManager - Quality level management
 * │   ├── 🎮 hooks/use-quality-manager.ts
 * │   ├── 🎛️ components/controls/quality-selector.tsx
 * │   └── 🧠 ai/quality-optimizer.ts
 * │
 * └── 🚨 ErrorHandler - Error management system
 *     ├── 🛡️ components/player/error-boundary.tsx
 *     ├── 📊 plugins/analytics/performance-analytics.ts
 *     └── 🎯 contexts/player-context.tsx
 * 
 * 🔄 ENGINE FLOW:
 * 1️⃣ VideoEngine.create() → Compatibility check
 * 2️⃣ FormatDetector → Format detection (HLS/DASH/MP4)
 * 3️⃣ Engine Selection → Appropriate engine selection
 * 4️⃣ QualityManager → Initial quality setup
 * 5️⃣ Strategy Application → Streaming strategy
 * 
 * 🎯 INTEGRATION EXAMPLES:
 * ```typescript
 * // In PlayerContainer
 * import { VideoEngine, CompatibilityChecker } from '@/core'
 * 
 * // In Hook
 * import { VideoEngine, QualityManager } from '@/core'
 * 
 * // In Plugin
 * import { FormatDetector, ErrorHandler } from '@/core'
 * ```
 */

// 🏛️ Ana Motor Sistemleri
export { VideoEngine } from './engine'                          // 🎯 Ana video motoru - PlayerContainer, useVideoPlayer  
export type { VideoEngineConfig, VideoEngineEvents } from './engine';

// 🔍 Tarayıcı Uyumluluk Sistemi  
export { getBrowserCapabilities, getStreamingStrategy } from './compatibility'  // 🔍 Tarayıcı kontrolü - useVideoEngine, mobile presets
export type { BrowserCapabilities } from './compatibility';

// � Motor Implementasyonları (engines ve strategies subdizinlerden)
export * from './engines'                                       // 🎮 Tüm motorlar - HLS, DASH, Native, WebRTC
export * from './strategies'                                    // 🧠 Akış stratejileri - adaptive, bandwidth, fallback

// 📋 Tip Tanımları
export type { 
  VideoFormat, 
  QualityLevel, 
  StreamingQuality,
  ErrorType,
  VideoError 
} from '../types';
