/**
 * ⚡ React Hooks Index - Video Player Ecosystem
 * 
 * 🎯 PURPOSE: Centralized hook management system providing modular, reusable logic
 * 📍 USAGE CONTEXT: Import specific hooks or groups based on component needs
 * 🔗 RELATIONSHIPS: All hooks integrate with VideoEngine and PlayerContainer
 * 
 * 🏗️ ARCHITECTURE GUIDELINES:
 * - Core hooks (use-video-player, use-video-engine) are foundation dependencies
 * - Feature hooks extend core functionality 
 * - UI hooks manage component states and interactions
 * - Integration hooks connect external services
 * 
 * 💡 EXAMPLES:
 * import { useVideoPlayer } from '@/hooks'; // Core functionality
 * import { useVideoPlayer, useVideoGestures } from '@/hooks'; // Player + gestures
 * import * as VideoHooks from '@/hooks'; // All hooks (advanced usage)
 */

"use client";

// 🎬 CORE PLAYER HOOKS - Foundation layer, required by most components
export { useVideoPlayer } from './use-video-player';          // 🏛️ Main state manager - used in: PlayerContainer, VideoPlayer
export { useVideoEngine } from './use-video-engine';          // ⚙️ Engine controller - used in: PlayerContainer, streaming components

// 🔌 PLUGIN SYSTEM HOOKS - Extensibility layer for advanced features  
export { usePluginManager } from './use-plugin-manager';      // 🧩 Plugin orchestrator - used in: PluginManager, ConfigurablePlayer

// 👆 INTERACTION HOOKS - User input and gesture management
export { useGestureHandler } from './use-gesture-handler';    // 📱 Touch/mouse gestures - used in: MobileControls, PlayerContainer
export { useKeyboardShortcuts, defaultVideoShortcuts } from './use-keyboard-shortcuts'; // ⌨️ Keyboard controls - used in: VideoControls, PlayerContainer

// 🖥️ DISPLAY MODE HOOKS - Full-screen and PiP functionality
export { useFullscreen } from './use-fullscreen';             // ⛶ Fullscreen controller - used in: FullscreenContainer, VideoControls
export { usePictureInPicture } from './use-picture-in-picture'; // 📺 PiP controller - used in: PiPButton, VideoControls

// 📊 ANALYTICS & TRACKING HOOKS - Performance and user behavior monitoring
export { useAnalyticsTracker } from './use-analytics-tracker'; // 📈 Event tracking - used in: AnalyticsPanel, PlayerContainer
export { usePerformanceMonitor } from './use-performance-monitor'; // 🔍 Performance metrics - used in: PerformanceMonitor, AnalyticsPanel

// 🤖 AI-POWERED FEATURES - Smart video enhancement
export { useAIFeatures } from './use-ai-features';            // 🧠 AI enhancement - used in: AIFeatures, ConfigurablePlayer

// 🌐 NETWORK & INTEGRATION HOOKS - External service connections
export { useNetworkMonitor } from './use-network-monitor';    // 📡 Network status - used in: QualityManager, StreamingComponents
export { useMCPIntegration } from './use-mcp-integration';    // 🔗 MCP protocol - used in: MCPProvider, ExternalIntegrations

// 🎨 QUALITY & MEDIA MANAGEMENT HOOKS - Video quality and content handling
export { useQualityManager } from './use-quality-manager';    // 🎯 Quality adaptation - used in: QualitySelector, PlayerContainer
export { useSmartQuality } from './use-smart-quality';        // 🧠 Intelligent quality - used in: SmartQualityController
export { useSubtitleManager } from './use-subtitle-manager';  // 📝 Subtitle handling - used in: SubtitleControls, PlayerContainer

// 🖼️ THUMBNAIL & MEDIA SESSION HOOKS - Visual preview and system integration
export { useThumbnailLoader } from './use-thumbnail-loader';   // 🎞️ Thumbnail management - used in: ThumbnailPreview, TimelineThumbnails
export { useMediaSession } from './use-media-session';        // 🎵 Media session API - used in: PlayerContainer, MediaSessionControls

// 🔍 CONTENT ANALYSIS HOOKS - Video content understanding
export { useContentAnalyzer } from './use-content-analyzer';  // 🧪 Content analysis - used in: ContentAnalyzer, AIFeatures

// 🔄 LEGACY COMPATIBILITY - Backward compatibility hooks
export { useVideoGestures } from './use-video-gestures';      // 👆 Legacy gestures - used in: older components, migration support

// 🌐 API CLIENT HOOKS - External service integrations (Placeholder implementations)
// 📝 NOTE: These are placeholder exports for future API integrations
// 🎯 USAGE: Will be implemented when backend services are available
export const useApiClient = () => ({ 
  client: null,
  // 🔗 FUTURE: REST/GraphQL client for video management
  // 📍 USED IN: UploadManager, VideoLibrary, UserManagement
});

export const useAnalyticsAPI = () => ({ 
  api: null,
  // 🔗 FUTURE: Analytics service integration 
  // 📍 USED IN: AnalyticsPanel, MetricsDisplay, ReportGenerator
});

export const useStreamingAPI = () => ({ 
  api: null,
  // 🔗 FUTURE: Streaming service management
  // 📍 USED IN: StreamingProviders, CDNManager, QualityOptimizer
});

export const useUploadAPI = () => ({ 
  api: null,
  // 🔗 FUTURE: Video upload and processing
  // 📍 USED IN: VideoUploader, ProcessingQueue, TranscodingManager
});
