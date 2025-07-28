/**
 * MCP-Integrated Player Preset
 * Model Context Protocol integrated video player for AI interactions
 */

import type { PlayerConfig } from '../types/player';
import { DEFAULT_PLAYER_CONFIG } from '../constants/player-defaults';

export const MCP_INTEGRATED_PLAYER_PRESET: PlayerConfig = {
  ...DEFAULT_PLAYER_CONFIG,
  
  // MCP-optimized controls
  controls: true,
  showProgressBar: true,
  showVolumeControl: true,
  showFullscreenButton: true,
  showPlaybackRate: true,
  showQualitySelector: true,
  
  // Adaptive streaming for MCP
  defaultQuality: 'auto',
  adaptiveStreaming: true,
  
  // Enhanced gesture support
  enableGestures: true,
  showMobileControls: true,
  
  // MCP accessibility
  enableKeyboardShortcuts: true,
  enableScreenReader: true,
  announcePlayState: true,
  
  // Advanced analytics for MCP
  enableAnalytics: true
};

/**
 * MCP integration theme
 */
export const MCP_INTEGRATION_THEME = {
  primaryColor: '#10b981', // Emerald for MCP
  backgroundColor: '#000000',
  controlsColor: '#ffffff',
  accentColor: '#3b82f6', // Blue accent
  progressColor: '#06b6d4', // Cyan progress
  bufferColor: '#6b7280',
  mcpIndicators: true,
  contextualColors: true
} as const;

/**
 * MCP protocol configuration
 */
export const MCP_PROTOCOL = {
  // Protocol version
  version: '1.0.0',
  transport: 'stdio',
  
  // Server configuration
  serverName: 'nextjs-videoplayer-mcp',
  serverVersion: '1.0.0',
  
  // Capabilities
  capabilities: {
    resources: true,
    tools: true,
    prompts: true,
    logging: true
  },
  
  // Connection settings
  timeout: 30000,
  retryAttempts: 3,
  keepAlive: true,
  
  // Security
  authentication: true,
  encryption: true,
  validation: true
} as const;

/**
 * MCP tools and resources
 */
export const MCP_TOOLS = {
  // Video control tools
  playVideo: {
    name: 'play_video',
    description: 'Start video playback',
    inputSchema: {
      type: 'object',
      properties: {
        autoplay: { type: 'boolean' },
        startTime: { type: 'number' }
      }
    }
  },
  
  pauseVideo: {
    name: 'pause_video',
    description: 'Pause video playback',
    inputSchema: { type: 'object', properties: {} }
  },
  
  seekVideo: {
    name: 'seek_video',
    description: 'Seek to specific time in video',
    inputSchema: {
      type: 'object',
      properties: {
        time: { type: 'number', description: 'Time in seconds' },
        relative: { type: 'boolean', description: 'Relative to current time' }
      },
      required: ['time']
    }
  },
  
  setVolume: {
    name: 'set_volume',
    description: 'Set video volume',
    inputSchema: {
      type: 'object',
      properties: {
        volume: { type: 'number', minimum: 0, maximum: 1 }
      },
      required: ['volume']
    }
  },
  
  setQuality: {
    name: 'set_quality',
    description: 'Set video quality',
    inputSchema: {
      type: 'object',
      properties: {
        quality: { type: 'string', enum: ['144p', '240p', '360p', '480p', '720p', '1080p', 'auto'] }
      },
      required: ['quality']
    }
  },
  
  // Analytics tools
  getAnalytics: {
    name: 'get_analytics',
    description: 'Get video analytics data',
    inputSchema: {
      type: 'object',
      properties: {
        timeRange: { type: 'string', enum: ['current', 'session', 'all'] },
        metrics: { type: 'array', items: { type: 'string' } }
      }
    }
  },
  
  // Transcription tools
  getTranscript: {
    name: 'get_transcript',
    description: 'Get video transcript',
    inputSchema: {
      type: 'object',
      properties: {
        format: { type: 'string', enum: ['text', 'srt', 'vtt'] },
        timeSegments: { type: 'boolean' }
      }
    }
  },
  
  searchTranscript: {
    name: 'search_transcript',
    description: 'Search within video transcript',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        caseSensitive: { type: 'boolean' },
        wholeWord: { type: 'boolean' }
      },
      required: ['query']
    }
  }
} as const;

/**
 * MCP resources configuration
 */
export const MCP_RESOURCES = {
  // Video metadata
  videoMetadata: {
    uri: 'video://metadata',
    name: 'Video Metadata',
    description: 'Current video metadata and properties',
    mimeType: 'application/json'
  },
  
  // Player state
  playerState: {
    uri: 'player://state',
    name: 'Player State',
    description: 'Current player state and configuration',
    mimeType: 'application/json'
  },
  
  // Analytics data
  analyticsData: {
    uri: 'analytics://data',
    name: 'Analytics Data',
    description: 'Video playback and engagement analytics',
    mimeType: 'application/json'
  },
  
  // Transcript
  transcript: {
    uri: 'transcript://current',
    name: 'Video Transcript',
    description: 'Current video transcript content',
    mimeType: 'text/plain'
  },
  
  // Configuration
  configuration: {
    uri: 'config://player',
    name: 'Player Configuration',
    description: 'Current player configuration settings',
    mimeType: 'application/json'
  }
} as const;

/**
 * MCP event system
 */
export const MCP_EVENTS = {
  // Player events
  playerEvents: [
    'play',
    'pause',
    'ended',
    'timeupdate',
    'seeking',
    'seeked',
    'volumechange',
    'qualitychange'
  ],
  
  // Analytics events
  analyticsEvents: [
    'engagement_change',
    'milestone_reached',
    'error_occurred',
    'buffer_event'
  ],
  
  // User interaction events
  interactionEvents: [
    'click',
    'gesture',
    'keyboard_shortcut',
    'menu_interaction'
  ],
  
  // System events
  systemEvents: [
    'quality_adaptation',
    'network_change',
    'performance_change'
  ]
} as const;

/**
 * MCP-enhanced keyboard shortcuts
 */
export const MCP_SHORTCUTS = {
  // Standard controls
  spacebar: 'playPause',
  arrowLeft: 'seekBackward5',
  arrowRight: 'seekForward5',
  arrowUp: 'volumeUp',
  arrowDown: 'volumeDown',
  m: 'toggleMute',
  f: 'toggleFullscreen',
  
  // MCP-specific shortcuts
  ctrl_m: 'mcpInterface',
  ctrl_shift_m: 'mcpConsole',
  alt_m: 'mcpTools',
  
  // AI interaction shortcuts
  ctrl_a: 'askAI',
  ctrl_t: 'transcriptSearch',
  ctrl_s: 'summarizeVideo',
  
  // Context shortcuts
  ctrl_c: 'getContext',
  ctrl_r: 'refreshContext',
  ctrl_e: 'exportContext'
} as const;

/**
 * MCP integration settings
 */
export const MCP_INTEGRATION = {
  // Connection settings
  autoConnect: true,
  reconnectOnFailure: true,
  heartbeatInterval: 30000,
  
  // Feature flags
  enableTools: true,
  enableResources: true,
  enablePrompts: true,
  enableLogging: true,
  
  // Performance settings
  batchUpdates: true,
  throttleEvents: true,
  cacheResources: true,
  
  // Security settings
  validateInputs: true,
  sanitizeOutputs: true,
  enableCors: true,
  
  // Development settings
  debugMode: false,
  verboseLogging: false,
  enableDevTools: true
} as const;

/**
 * MCP context management
 */
export const MCP_CONTEXT = {
  // Context types
  contextTypes: [
    'video_metadata',
    'player_state',
    'user_preferences',
    'playback_history',
    'analytics_data',
    'transcript_data'
  ],
  
  // Context sharing
  shareWithAI: true,
  contextPersistence: true,
  contextEncryption: true,
  
  // Context updates
  realTimeUpdates: true,
  updateThrottling: 100, // ms
  batchUpdates: true,
  
  // Context validation
  validateContext: true,
  contextSchema: true,
  typeChecking: true
} as const;
