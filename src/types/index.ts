/**
 * 🏗️ TypeScript Types Index - Video Player Type System
 * 
 * 🎯 PURPOSE: Centralized type definitions ensuring type safety across entire ecosystem
 * 📍 USAGE CONTEXT: Import specific types or categories based on component requirements
 * 🔗 RELATIONSHIPS: Types are used by hooks, components, engine, and utilities
 * 
 * 🏛️ ARCHITECTURE PRINCIPLES:
 * - Core types define fundamental video player structures
 * - System types handle framework integrations
 * - Configuration types manage player customization
 * - API types define external service contracts
 * 
 * 💡 IMPORT EXAMPLES:
 * import type { PlayerConfiguration } from '@/types'; // Single type
 * import type { PlayerConfiguration, VideoSource } from '@/types'; // Multiple types
 * import type * as PlayerTypes from '@/types'; // All types (advanced usage)
 * 
 * 🔄 DEPENDENCY CHAIN:
 * Components → Hooks → Types → Engine → External APIs
 */

"use client";

// 🎬 CORE PLAYER TYPES - Foundation structures for video functionality
export type * from './player';                    // 🏛️ Base player interfaces - used in: PlayerContainer, VideoPlayer
export type * from './engine';                    // ⚙️ Engine specifications - used in: VideoEngine, StreamingAdapters

// 🔧 SYSTEM INTEGRATION TYPES - Framework and platform integrations  
export type * from './plugin';                    // 🧩 Plugin architecture - used in: PluginManager, CustomPlugins
export type * from './analytics';                 // 📊 Analytics structures - used in: AnalyticsPanel, MetricsDisplay
export type * from './streaming';                 // 📡 Streaming protocols - used in: StreamingEngine, QualityManager

// Configuration types
export type * from './configuration';

// Configuration types (specific exports to avoid conflicts)
export type { 
  PlayerTheme as LegacyPlayerTheme,
  AnalyticsConfig as LegacyAnalyticsConfig,
  GesturesConfig,
  ControlsVisibility,
  KeyboardShortcutsConfig,
  AutoBehavior,
  AdvancedFeatures,
  PlayerConfiguration
} from './player-config';

// Advanced feature types
export type * from './ai';
export type * from './mcp';

// API types (specific exports to avoid conflicts)
export type {
  ApiResponse,
  ApiError,
  ApiMetadata,
  AuthRequest,
  AuthResponse,
  UserInfo,
  UploadRequest,
  UploadResponse,
  StreamingRequest,
  StreamingResponse,
  AnalyticsRequest,
  AnalyticsResponse,
  AIProcessingRequest,
  AIProcessingResponse,
  WebhookEvent,
  WebhookSubscription
} from './api';
