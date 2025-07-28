/**
 * MCP (Model Context Protocol) Endpoints
 * Defines MCP server endpoints and configurations
 */

/**
 * MCP server endpoints
 */
export const MCP_ENDPOINTS = {
  // Core MCP operations
  CONNECT: '/mcp/connect',
  DISCONNECT: '/mcp/disconnect',
  PING: '/mcp/ping',
  CAPABILITIES: '/mcp/capabilities',
  
  // Resource management
  RESOURCES_LIST: '/mcp/resources/list',
  RESOURCES_READ: '/mcp/resources/read',
  RESOURCES_SUBSCRIBE: '/mcp/resources/subscribe',
  RESOURCES_UNSUBSCRIBE: '/mcp/resources/unsubscribe',
  
  // Tool execution
  TOOLS_LIST: '/mcp/tools/list',
  TOOLS_CALL: '/mcp/tools/call',
  
  // Prompt management
  PROMPTS_LIST: '/mcp/prompts/list',
  PROMPTS_GET: '/mcp/prompts/get',
  
  // Logging and monitoring
  LOGS_SET_LEVEL: '/mcp/logs/setLevel',
  LOGS_GET: '/mcp/logs/get',
  
  // AI integration
  AI_PROCESS: '/mcp/ai/process',
  AI_ANALYZE: '/mcp/ai/analyze',
  AI_ENHANCE: '/mcp/ai/enhance',
  
  // Video-specific operations
  VIDEO_METADATA: '/mcp/video/metadata',
  VIDEO_TRANSCRIBE: '/mcp/video/transcribe',
  VIDEO_ANALYZE: '/mcp/video/analyze',
  VIDEO_ENHANCE: '/mcp/video/enhance'
} as const;

/**
 * MCP protocol configuration
 */
export const MCP_CONFIG = {
  // Protocol version
  protocolVersion: '2024-11-05',
  
  // Connection settings
  connection: {
    timeout: 30000,        // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000,      // 1 second
    keepAlive: true,
    keepAliveInterval: 60000 // 1 minute
  },
  
  // Message size limits
  limits: {
    maxMessageSize: 10485760,  // 10MB
    maxBatchSize: 100,
    maxResourceSize: 52428800, // 50MB
    maxToolCallDuration: 300000 // 5 minutes
  },
  
  // Supported capabilities
  capabilities: {
    // Client capabilities
    client: {
      experimental: {},
      sampling: {}
    },
    
    // Server capabilities  
    server: {
      experimental: {},
      logging: {},
      prompts: {
        listChanged: true
      },
      resources: {
        subscribe: true,
        listChanged: true
      },
      tools: {
        listChanged: true
      }
    }
  }
} as const;

/**
 * MCP resource types
 */
export const MCP_RESOURCE_TYPES = {
  VIDEO: 'video',
  AUDIO: 'audio',
  SUBTITLE: 'subtitle',
  THUMBNAIL: 'thumbnail',
  METADATA: 'metadata',
  TRANSCRIPT: 'transcript',
  ANALYSIS: 'analysis',
  CONFIGURATION: 'configuration'
} as const;

/**
 * MCP tool definitions
 */
export const MCP_TOOLS = {
  VIDEO_ANALYZER: {
    name: 'video_analyzer',
    description: 'Analyze video content and extract metadata',
    inputSchema: {
      type: 'object',
      properties: {
        videoUrl: { type: 'string' },
        analysisType: { 
          type: 'string',
          enum: ['basic', 'detailed', 'full']
        }
      },
      required: ['videoUrl']
    }
  },
  
  THUMBNAIL_GENERATOR: {
    name: 'thumbnail_generator',
    description: 'Generate smart thumbnails from video',
    inputSchema: {
      type: 'object',
      properties: {
        videoUrl: { type: 'string' },
        count: { type: 'number', minimum: 1, maximum: 20 },
        quality: {
          type: 'string',
          enum: ['low', 'medium', 'high']
        }
      },
      required: ['videoUrl']
    }
  },
  
  CAPTION_GENERATOR: {
    name: 'caption_generator',
    description: 'Generate captions from video audio',
    inputSchema: {
      type: 'object',
      properties: {
        videoUrl: { type: 'string' },
        language: { type: 'string' },
        format: {
          type: 'string',
          enum: ['vtt', 'srt', 'ttml']
        }
      },
      required: ['videoUrl']
    }
  },
  
  QUALITY_OPTIMIZER: {
    name: 'quality_optimizer',
    description: 'Optimize video quality based on context',
    inputSchema: {
      type: 'object',
      properties: {
        videoUrl: { type: 'string' },
        deviceInfo: { type: 'object' },
        networkInfo: { type: 'object' }
      },
      required: ['videoUrl']
    }
  }
} as const;

/**
 * MCP prompt templates
 */
export const MCP_PROMPTS = {
  ANALYZE_VIDEO: {
    name: 'analyze_video',
    description: 'Analyze video content comprehensively',
    arguments: [
      {
        name: 'video_url',
        description: 'URL of the video to analyze',
        required: true
      },
      {
        name: 'analysis_depth',
        description: 'Depth of analysis (surface, detailed, comprehensive)',
        required: false
      }
    ]
  },
  
  ENHANCE_ACCESSIBILITY: {
    name: 'enhance_accessibility',
    description: 'Enhance video accessibility features',
    arguments: [
      {
        name: 'video_url',
        description: 'URL of the video to enhance',
        required: true
      },
      {
        name: 'accessibility_features',
        description: 'List of features to enhance',
        required: false
      }
    ]
  }
} as const;

/**
 * Default MCP settings
 */
export const DEFAULT_MCP_SETTINGS = {
  enabled: false,
  serverUrl: 'ws://localhost:8080/mcp',
  autoConnect: false,
  enableLogging: true,
  logLevel: 'info',
  enableResources: true,
  enableTools: true,
  enablePrompts: true
} as const;
