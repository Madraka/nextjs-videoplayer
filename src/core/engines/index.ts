/**
 * 🎮 VIDEO ENGINE IMPLEMENTATIONS - Engine Implementations
 * 
 * ===============================================================================
 * 📋 PURPOSE: Specialized engine implementations for different video formats
 * 🏗️ ARCHITECTURE: Strategy Pattern + Factory Pattern
 * 🔗 RELATIONSHIPS: core/video-engine → format detection → engine selection
 * ===============================================================================
 * 
 * 📊 ENGINE SELECTION LOGIC:
 * ├── 🎬 HLS Engine (Apple HLS) 
 * │   ├── 📱 iOS Safari (native)
 * │   ├── 🖥️ Desktop (HLS.js)
 * │   └── 🔗 Live streaming priority
 * │
 * ├── 🎭 DASH Engine (MPEG-DASH)
 * │   ├── 🌐 Chrome, Firefox, Edge
 * │   ├── 🎯 Adaptive quality priority
 * │   └── 🔗 Shaka Player integration
 * │
 * ├── 🎥 Native Engine (HTML5)
 * │   ├── 📺 MP4, WebM, Ogg support
 * │   ├── ⚡ Fastest startup
 * │   └── 🔗 Simple playback needs
 * │
 * ├── 📥 Progressive Engine 
 * │   ├── 📶 Low bandwidth
 * │   ├── 💾 Progressive download
 * │   └── 🔗 Fallback mechanism
 * │
 * └── 🔴 WebRTC Engine
 *     ├── 📡 Real-time streaming
 *     ├── 🎮 Interactive content
 *     └── 🔗 Low latency priority
 * 
 * 🎯 USAGE EXAMPLES:
 * ```typescript
 * // In core engine
 * import { HlsEngine, DashEngine, NativeEngine } from '@/core/engines'
 * 
 * // In plugin
 * import { HlsEngine } from '@/core/engines'
 * 
 * // With format detector
 * const engine = await EngineFactory.create(format, capabilities)
 * ```
 */

// 🎬 HLS (HTTP Live Streaming) Engine
export { HlsEngine } from './hls-engine'                        // 🎬 Apple HLS - iOS native, HLS.js fallback
export { DashEngine } from './dash-engine'                      // 🎭 MPEG-DASH - Shaka Player, adaptive quality
export { NativeEngine } from './native-engine'                  // 🎥 HTML5 Video - MP4, WebM native playback
export { ProgressiveEngine } from './progressive-engine'        // 📥 Progressive Download - low bandwidth
export { WebRtcEngine } from './webrtc-engine'                  // 🔴 WebRTC Live - real-time streaming

// Engine types
export type {
  EngineInterface,
  HlsEngineConfig,
  DashEngineConfig,
  NativeEngineConfig,
  ProgressiveEngineConfig,
  WebRtcEngineConfig,
  EngineState,
  EngineEventHandlers
} from './types';

/**
 * 🔗 ENGINE DEPENDENCY MAP:
 * 
 * ENGINES → CORE:
 * ├── HlsEngine → VideoEngine (format: 'hls')
 * ├── DashEngine → VideoEngine (format: 'dash')  
 * ├── NativeEngine → VideoEngine (format: 'mp4', 'webm')
 * ├── ProgressiveEngine → VideoEngine (fallback)
 * └── WebRtcEngine → VideoEngine (format: 'webrtc')
 * 
 * ENGINES → STRATEGIES:
 * ├── HlsEngine → AdaptiveStrategy, BandwidthStrategy
 * ├── DashEngine → QualityStrategy, AdaptiveStrategy
 * └── WebRtcEngine → FallbackStrategy
 * 
 * ENGINES → PLUGINS:
 * ├── HlsEngine → StreamingPlugins, HlsEnhancer
 * ├── DashEngine → StreamingPlugins, DashEnhancer
 * └── All Engines → AnalyticsPlugins, PerformanceMonitor
 * 
 * ENGINES → HOOKS:
 * ├── All Engines → useVideoEngine, useVideoPlayer
 * ├── HlsEngine → useStreamingQuality
 * └── WebRtcEngine → useNetworkMonitor
 */
