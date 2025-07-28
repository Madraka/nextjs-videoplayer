# 📁 NextJS Video Player - Strict File Schema & Naming Convention

## 🎯 Core Principles

### **Naming Rules**
1. **NO VERSION SUFFIXES**: v1, v2, old, new, legacy, temp, backup - FORBIDDEN
2. **KEBAB-CASE ONLY**: All files and folders use kebab-case
3. **DESCRIPTIVE NAMES**: Self-explanatory, no abbreviations
4. **SINGLE RESPONSIBILITY**: One purpose per file
5. **CONSISTENT PATTERNS**: Similar functionality = similar naming

### **ShadCN + Tailwind Integration**
- All UI components follow ShadCN conventions
- Tailwind utility classes only, no custom CSS files
- Component composition over inheritance

---

## 📂 Master File Schema

```
src/
├── index.ts                           # Package main export (no changes)
│
├── types/                             # TypeScript definitions
│   ├── index.ts                       # Re-export all types
│   ├── player.ts                      # Core player interfaces
│   ├── engine.ts                      # Video engine types
│   ├── plugin.ts                      # Plugin system types
│   ├── analytics.ts                   # Analytics types
│   ├── streaming.ts                   # Streaming protocol types
│   ├── configuration.ts               # Player configuration types
│   ├── ai.ts                          # AI feature types
│   ├── mcp.ts                         # MCP protocol types
│   └── api.ts                         # API request/response types
│
├── core/                              # Core video engine
│   ├── index.ts                       # Re-export core modules
│   ├── engine.ts                      # Main VideoEngine class (ROOT)
│   ├── compatibility.ts               # Browser compatibility detection
│   ├── format-detector.ts             # Video format detection
│   ├── quality-manager.ts             # Quality level management
│   ├── error-handler.ts               # Centralized error handling
│   │
│   ├── engines/                       # Specific engine implementations
│   │   ├── index.ts                   # Engine exports
│   │   ├── hls-engine.ts              # HLS.js implementation
│   │   ├── dash-engine.ts             # DASH.js implementation
│   │   ├── native-engine.ts           # Native HTML5 video
│   │   ├── progressive-engine.ts      # Progressive download (MP4, WebM)
│   │   └── webrtc-engine.ts           # WebRTC live streaming
│   │
│   └── strategies/                    # Streaming strategies
│       ├── index.ts                   # Strategy exports
│       ├── adaptive-strategy.ts       # Adaptive bitrate logic
│       ├── bandwidth-strategy.ts      # Bandwidth optimization
│       ├── quality-strategy.ts        # Quality selection logic
│       └── fallback-strategy.ts       # Fallback mechanisms
│
├── plugins/                           # Plugin system
│   ├── index.ts                       # Plugin registry & exports
│   ├── registry.ts                    # Plugin management system
│   ├── base-plugin.ts                 # Base plugin interface
│   ├── lifecycle-manager.ts           # Plugin lifecycle
│   │
│   ├── analytics/                     # Analytics plugins
│   │   ├── index.ts                   # Analytics exports
│   │   ├── base-analytics.ts          # Base analytics plugin
│   │   ├── player-analytics.ts        # Player behavior tracking
│   │   ├── performance-analytics.ts   # Performance metrics
│   │   └── custom-analytics.ts        # Custom event tracking
│   │
│   ├── streaming/                     # Streaming enhancement plugins
│   │   ├── index.ts                   # Streaming exports
│   │   ├── hls-enhancer.ts           # HLS.js enhancements
│   │   ├── dash-enhancer.ts          # DASH.js enhancements
│   │   ├── bandwidth-optimizer.ts     # Bandwidth optimization
│   │   └── quality-enhancer.ts       # Quality management
│   │
│   ├── accessibility/                 # Accessibility plugins
│   │   ├── index.ts                   # A11y exports
│   │   ├── keyboard-navigation.ts     # Keyboard controls
│   │   ├── screen-reader.ts          # Screen reader support
│   │   ├── captions-manager.ts       # Caption handling
│   │   └── audio-descriptions.ts     # Audio descriptions
│   │
│   ├── ai/                           # AI feature plugins
│   │   ├── index.ts                   # AI plugin exports
│   │   ├── content-analysis.ts        # Video content analysis
│   │   ├── smart-thumbnails.ts        # AI thumbnail generation
│   │   ├── auto-captions.ts           # Automatic caption generation
│   │   ├── quality-prediction.ts      # AI quality optimization
│   │   ├── scene-detection.ts         # Scene change detection
│   │   └── recommendation.ts          # Content recommendation
│   │
│   ├── mcp/                          # MCP integration plugins
│   │   ├── index.ts                   # MCP plugin exports
│   │   ├── model-integration.ts       # AI model integration
│   │   ├── protocol-handler.ts        # MCP protocol handling
│   │   ├── resource-manager.ts        # Resource management
│   │   └── tool-provider.ts           # MCP tool definitions
│   │
│   ├── social/                       # Social features
│   │   ├── index.ts                   # Social exports
│   │   ├── sharing-manager.ts        # Social sharing
│   │   ├── comment-system.ts         # Video comments
│   │   ├── reactions.ts              # Real-time reactions
│   │   └── watch-party.ts            # Watch party features
│   │
│   └── monetization/                 # Revenue plugins
│       ├── index.ts                   # Monetization exports
│       ├── ad-manager.ts             # Advertisement handling
│       ├── subscription-gate.ts      # Subscription controls
│       ├── pay-per-view.ts           # PPV functionality
│       └── donation-system.ts        # Donation integration
│
├── ai/                               # AI-powered features
│   ├── index.ts                      # AI module exports
│   ├── ai-engine.ts                  # Main AI engine
│   ├── content-analyzer.ts           # Video content analysis
│   ├── thumbnail-generator.ts        # AI thumbnail generation
│   ├── caption-generator.ts          # Auto caption generation
│   ├── quality-optimizer.ts          # AI quality optimization
│   ├── bandwidth-predictor.ts        # ML bandwidth prediction
│   ├── scene-detector.ts             # Scene change detection
│   ├── accessibility-enhancer.ts     # AI accessibility features
│   └── recommendation-engine.ts      # Content recommendations
│
├── mcp/                              # Model Context Protocol integration
│   ├── index.ts                      # MCP exports
│   ├── mcp-server.ts                 # MCP server implementation
│   ├── protocol-handler.ts           # Protocol message handling
│   ├── resource-manager.ts           # Resource management
│   ├── tool-registry.ts              # MCP tool definitions
│   ├── session-manager.ts            # Session lifecycle
│   ├── security-manager.ts           # Security and permissions
│   └── ai-integration.ts             # AI model integration
│
├── components/                        # React components (ShadCN based)
│   ├── index.ts                       # Component exports
│   │
│   ├── ui/                           # ShadCN UI components (DO NOT MODIFY)
│   │   ├── button.tsx                # ShadCN button
│   │   ├── card.tsx                  # ShadCN card
│   │   ├── dialog.tsx                # ShadCN dialog
│   │   ├── dropdown-menu.tsx         # ShadCN dropdown
│   │   ├── input.tsx                 # ShadCN input
│   │   ├── label.tsx                 # ShadCN label
│   │   ├── progress.tsx              # ShadCN progress
│   │   ├── select.tsx                # ShadCN select
│   │   ├── separator.tsx             # ShadCN separator
│   │   ├── slider.tsx                # ShadCN slider
│   │   ├── switch.tsx                # ShadCN switch
│   │   ├── tabs.tsx                  # ShadCN tabs
│   │   ├── tooltip.tsx               # ShadCN tooltip
│   │   └── badge.tsx                 # ShadCN badge
│   │
│   ├── player/                       # Core player components
│   │   ├── index.ts                  # Player exports
│   │   ├── video-player.tsx          # Main video player
│   │   ├── player-container.tsx      # Player wrapper container
│   │   ├── video-element.tsx         # HTML5 video element wrapper
│   │   ├── loading-indicator.tsx     # Loading state display
│   │   ├── error-boundary.tsx        # Error handling display
│   │   ├── poster-image.tsx          # Video poster/thumbnail
│   │   └── fullscreen-container.tsx  # Fullscreen mode handler
│   │
│   ├── controls/                     # Player control components
│   │   ├── index.ts                  # Controls exports
│   │   ├── control-bar.tsx           # Main control bar
│   │   ├── play-button.tsx           # Play/pause button
│   │   ├── progress-bar.tsx          # Video progress control
│   │   ├── volume-control.tsx        # Volume slider/mute
│   │   ├── time-display.tsx          # Current/duration time
│   │   ├── quality-selector.tsx      # Quality level selection
│   │   ├── fullscreen-button.tsx     # Fullscreen toggle
│   │   ├── picture-in-picture.tsx    # PiP button
│   │   ├── playback-rate.tsx         # Speed control
│   │   ├── settings-menu.tsx         # Settings dropdown
│   │   ├── mobile-controls.tsx       # Mobile-optimized controls
│   │   └── keyboard-handler.tsx      # Keyboard shortcuts
│   │
│   ├── overlays/                     # Player overlay components
│   │   ├── index.ts                  # Overlay exports
│   │   ├── center-overlay.tsx        # Center play button
│   │   ├── loading-overlay.tsx       # Loading state overlay
│   │   ├── error-overlay.tsx         # Error state overlay
│   │   ├── gesture-feedback.tsx      # Touch gesture feedback
│   │   ├── buffer-indicator.tsx      # Buffering indicator
│   │   ├── subtitle-display.tsx      # Subtitle rendering
│   │   └── watermark-overlay.tsx     # Branding watermark
│   │
│   ├── thumbnails/                   # Thumbnail components
│   │   ├── index.ts                  # Thumbnail exports
│   │   ├── thumbnail-preview.tsx     # Hover preview thumbnails
│   │   ├── sprite-renderer.tsx       # Sprite sheet handler
│   │   ├── timeline-thumbnails.tsx   # Progress bar thumbnails
│   │   └── chapter-thumbnails.tsx    # Chapter marker thumbnails
│   │
│   ├── analytics/                    # Analytics UI components
│   │   ├── index.ts                  # Analytics UI exports
│   │   ├── metrics-display.tsx       # Real-time metrics
│   │   ├── analytics-panel.tsx       # Analytics dashboard
│   │   ├── performance-monitor.tsx   # Performance indicators
│   │   └── heatmap-display.tsx       # Engagement heatmap
│   │
│   └── configuration/                # Configuration components
│       ├── index.ts                  # Config exports
│       ├── player-configurator.tsx   # Player setup wizard
│       ├── theme-selector.tsx        # Theme selection
│       ├── preset-manager.tsx        # Preset configurations
│       ├── plugin-manager.tsx        # Plugin configuration
│       └── advanced-settings.tsx     # Advanced options
│
├── hooks/                            # React hooks
│   ├── index.ts                      # Hook exports
│   ├── use-video-player.ts           # Main player state hook
│   ├── use-video-engine.ts           # Engine integration hook
│   ├── use-plugin-manager.ts         # Plugin management hook
│   ├── use-gesture-handler.ts        # Touch gesture handling
│   ├── use-keyboard-shortcuts.ts     # Keyboard navigation
│   ├── use-fullscreen.ts             # Fullscreen mode management
│   ├── use-picture-in-picture.ts     # PiP functionality
│   ├── use-analytics-tracker.ts      # Analytics tracking
│   ├── use-quality-manager.ts        # Quality level management
│   ├── use-subtitle-manager.ts       # Subtitle handling
│   ├── use-thumbnail-loader.ts       # Thumbnail loading
│   ├── use-media-session.ts          # Media session API
│   ├── use-network-monitor.ts        # Network status monitoring
│   ├── use-ai-features.ts            # AI feature integration
│   ├── use-mcp-integration.ts        # MCP protocol integration
│   ├── use-content-analyzer.ts       # AI content analysis
│   ├── use-smart-quality.ts          # AI quality optimization
│   ├── use-api-client.ts             # API client integration
│   ├── use-analytics-api.ts          # Analytics API hooks
│   ├── use-streaming-api.ts          # Streaming API hooks
│   ├── use-upload-api.ts             # Upload API hooks
│   └── use-performance-monitor.ts    # Performance tracking
│
├── contexts/                         # React contexts
│   ├── index.ts                      # Context exports
│   ├── player-context.tsx            # Main player context
│   ├── theme-context.tsx             # Theme management
│   ├── plugin-context.tsx            # Plugin state management
│   ├── analytics-context.tsx         # Analytics data context
│   ├── configuration-context.tsx     # Configuration management
│   ├── ai-context.tsx                # AI features context
│   └── mcp-context.tsx               # MCP integration context
│
├── utilities/                        # Utility functions
│   ├── index.ts                      # Utility exports
│   ├── format-time.ts                # Time formatting helpers
│   ├── format-bytes.ts               # File size formatting
│   ├── device-detection.ts           # Device/browser detection
│   ├── event-emitter.ts              # Custom event system
│   ├── debounce.ts                   # Debouncing utilities
│   ├── throttle.ts                   # Throttling utilities
│   ├── deep-merge.ts                 # Object merging
│   ├── local-storage.ts              # LocalStorage helpers
│   ├── url-validator.ts              # URL validation
│   ├── mime-type-detector.ts         # MIME type detection
│   ├── performance-monitor.ts        # Performance utilities
│   └── accessibility-helpers.ts      # A11y utility functions
│
├── constants/                        # Application constants
│   ├── index.ts                      # Constants exports
│   ├── player-defaults.ts            # Default player settings
│   ├── supported-formats.ts          # Supported video formats
│   ├── quality-levels.ts             # Quality level definitions
│   ├── keyboard-shortcuts.ts         # Default keyboard mappings
│   ├── error-messages.ts             # Standardized error messages
│   ├── analytics-events.ts           # Analytics event definitions
│   ├── mime-types.ts                 # MIME type constants
│   ├── browser-support.ts            # Browser compatibility matrix
│   ├── ai-models.ts                  # AI model configurations
│   ├── mcp-endpoints.ts              # MCP protocol endpoints
│   └── api-endpoints.ts              # API endpoint constants
│
├── presets/                          # Pre-configured player setups
│   ├── index.ts                      # Preset exports
│   ├── youtube-style.ts              # YouTube-like configuration
│   ├── netflix-style.ts              # Netflix-like configuration
│   ├── minimal-player.ts             # Minimal control setup
│   ├── mobile-optimized.ts           # Mobile-first configuration
│   ├── accessibility-focused.ts      # A11y-optimized setup
│   ├── live-streaming.ts             # Live stream configuration
│   ├── educational-content.ts        # Educational video setup
│   ├── enterprise-player.ts          # Enterprise-grade configuration
│   ├── ai-enhanced.ts                # AI-powered features preset
│   └── mcp-integrated.ts             # MCP integration preset
│
├── schemas/                          # Validation schemas
│   ├── index.ts                      # Schema exports
│   ├── player-config-schema.ts       # Player configuration validation
│   ├── plugin-schema.ts              # Plugin interface validation
│   ├── analytics-schema.ts           # Analytics data validation
│   ├── streaming-schema.ts           # Streaming config validation
│   ├── theme-schema.ts               # Theme configuration validation
│   ├── ai-schema.ts                  # AI feature validation
│   └── mcp-schema.ts                 # MCP protocol validation
│
└── api/                              # API layer (backend services)
    ├── index.ts                      # API exports
    ├── client.ts                     # API client configuration
    ├── auth.ts                       # Authentication API
    ├── analytics.ts                  # Analytics API endpoints
    ├── streaming.ts                  # Streaming API services
    ├── ai.ts                         # AI processing API
    ├── mcp.ts                        # MCP protocol API
    ├── uploads.ts                    # File upload handling
    ├── thumbnails.ts                 # Thumbnail generation API
    ├── subtitles.ts                  # Subtitle processing API
    └── webhooks.ts                   # Webhook handlers
```

---

## 🚫 Forbidden Patterns

### **NEVER USE THESE PATTERNS**:
```
❌ video-player-v2.tsx
❌ player-new.tsx
❌ old-controls.tsx
❌ legacy-engine.ts
❌ temp-analytics.ts
❌ backup-config.ts
❌ experimental-features.ts
❌ draft-plugin.ts
❌ beta-component.tsx
❌ alpha-version.ts
```

### **ALWAYS USE THESE PATTERNS**:
```
✅ video-player.tsx
✅ player-controls.tsx
✅ analytics-tracker.ts
✅ streaming-engine.ts
✅ gesture-handler.ts
✅ quality-manager.ts
✅ error-boundary.tsx
✅ performance-monitor.ts
```

---

## 📋 File Naming Rules

### **Components (.tsx)**
- Format: `{purpose}-{type}.tsx`
- Examples: `video-player.tsx`, `control-bar.tsx`, `loading-indicator.tsx`

### **Hooks (.ts)**
- Format: `use-{functionality}.ts`
- Examples: `use-video-player.ts`, `use-gesture-handler.ts`

### **Utilities (.ts)**
- Format: `{function-name}.ts`
- Examples: `format-time.ts`, `device-detection.ts`

### **Types (.ts)**
- Format: `{domain}.ts`
- Examples: `player.ts`, `analytics.ts`, `streaming.ts`

### **Constants (.ts)**
- Format: `{category}-{type}.ts`
- Examples: `player-defaults.ts`, `error-messages.ts`

### **Contexts (.tsx)**
- Format: `{domain}-context.tsx`
- Examples: `player-context.tsx`, `theme-context.tsx`

### **API Services (.ts)**
- Format: `{service-name}.ts`
- Examples: `analytics.ts`, `streaming.ts`, `auth.ts`

### **API Hooks (.ts)**
- Format: `use-{service}-api.ts`
- Examples: `use-analytics-api.ts`, `use-streaming-api.ts`

---

## 🔍 Validation Rules

### **Import Structure**
```typescript
// ✅ Correct import patterns
import { VideoPlayer } from '@/components/player'
import { useVideoPlayer } from '@/hooks'
import { PlayerConfig } from '@/types'
import { formatTime } from '@/utilities'

// ✅ Core engine imports (organized)
import { VideoEngine } from '@/core'
import { HlsEngine, DashEngine } from '@/core/engines'
import { AdaptiveStrategy } from '@/core/strategies'

// ✅ AI and MCP imports
import { AIEngine, ContentAnalyzer } from '@/ai'
import { MCPServer, ProtocolHandler } from '@/mcp'

// ✅ API imports
import { ApiClient, AnalyticsAPI, StreamingAPI } from '@/api'
import { useApiClient, useAnalyticsAPI } from '@/hooks'
import { ApiResponse, StreamingConfig } from '@/types'

// ❌ Wrong import patterns
import { VideoPlayerV2 } from '@/components/player'
import { useVideoPlayerNew } from '@/hooks'
import { PlayerConfigOld } from '@/types'
```

### **Export Structure**
```typescript
// ✅ Named exports only (no default exports for consistency)
export { VideoPlayer } from './video-player'
export { ControlBar } from './control-bar'
export type { PlayerConfig, StreamingOptions } from './types'

// ❌ Avoid default exports
export default VideoPlayer
```

---

## 📦 Package Structure Compliance

### **ShadCN Integration**
- Keep `components/ui/` exactly as ShadCN generates
- Never modify ShadCN components directly
- Create wrapper components in appropriate directories

### **Tailwind CSS**
- Use Tailwind utility classes only
- No custom CSS files except `globals.css`
- Consistent spacing and color schemes

### **TypeScript Strict Mode**
- All files must have proper typing
- No `any` types except in edge cases
- Strict null checks enabled

---

## 🎯 Quality Gates

### **Before Any File Creation**:
1. ✅ Name follows kebab-case convention
2. ✅ No version suffixes (v1, v2, new, old)
3. ✅ Purpose is clear from filename
4. ✅ Location follows schema structure
5. ✅ TypeScript interfaces defined

### **Before Any File Modification**:
1. ✅ Maintain backward compatibility
2. ✅ Update related type definitions
3. ✅ Update exports in index.ts files
4. ✅ No breaking changes to public API
5. ✅ Add proper JSDoc comments

---

**📅 Schema Version**: 1.0  
**📝 Last Updated**: January 27, 2025  
**🎯 Enforcement**: MANDATORY - No exceptions allowed  
**🔒 Status**: LOCKED - Changes require architecture review
