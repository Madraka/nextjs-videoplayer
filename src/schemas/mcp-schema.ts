/**
 * Model Context Protocol (MCP) Schema
 * Validation schema for MCP integrations and server configurations
 */

export const MCP_SERVER_CONFIG_SCHEMA = {
  type: 'object',
  properties: {
    // Server identification
    name: {
      type: 'string',
      minLength: 1,
      description: 'Server name'
    },
    version: {
      type: 'string',
      pattern: '^\\d+\\.\\d+\\.\\d+$',
      description: 'Server version (semver)'
    },
    description: {
      type: 'string',
      description: 'Server description'
    },
    
    // Connection configuration
    connection: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['stdio', 'sse', 'websocket'],
          description: 'Connection type'
        },
        endpoint: {
          type: 'string',
          format: 'uri',
          description: 'Server endpoint URL'
        },
        command: {
          type: 'string',
          description: 'Command to start the server'
        },
        args: {
          type: 'array',
          items: { type: 'string' },
          description: 'Command arguments'
        },
        env: {
          type: 'object',
          additionalProperties: { type: 'string' },
          description: 'Environment variables'
        }
      },
      required: ['type'],
      description: 'Connection configuration'
    },
    
    // Capabilities
    capabilities: {
      type: 'object',
      properties: {
        logging: {
          type: 'object',
          properties: {
            enabled: { type: 'boolean' },
            level: {
              type: 'string',
              enum: ['debug', 'info', 'notice', 'warning', 'error', 'critical', 'alert', 'emergency']
            }
          },
          description: 'Logging capabilities'
        },
        prompts: {
          type: 'object',
          properties: {
            listChanged: { type: 'boolean' }
          },
          description: 'Prompt capabilities'
        },
        resources: {
          type: 'object',
          properties: {
            subscribe: { type: 'boolean' },
            listChanged: { type: 'boolean' }
          },
          description: 'Resource capabilities'
        },
        tools: {
          type: 'object',
          properties: {
            listChanged: { type: 'boolean' }
          },
          description: 'Tool capabilities'
        },
        roots: {
          type: 'object',
          properties: {
            listChanged: { type: 'boolean' }
          },
          description: 'Root capabilities'
        },
        sampling: {
          type: 'object',
          description: 'Sampling capabilities'
        }
      },
      description: 'Server capabilities'
    },
    
    // Security and authentication
    security: {
      type: 'object',
      properties: {
        apiKey: {
          type: 'string',
          description: 'API key for authentication'
        },
        token: {
          type: 'string',
          description: 'Bearer token'
        },
        certificate: {
          type: 'string',
          description: 'Client certificate path'
        },
        verifySSL: {
          type: 'boolean',
          description: 'Verify SSL certificates'
        },
        timeout: {
          type: 'number',
          minimum: 1000,
          description: 'Connection timeout in milliseconds'
        }
      },
      description: 'Security configuration'
    }
  },
  required: ['name', 'connection'],
  additionalProperties: false
} as const;

/**
 * MCP tool schema
 */
export const MCP_TOOL_SCHEMA = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      description: 'Tool name'
    },
    description: {
      type: 'string',
      description: 'Tool description'
    },
    inputSchema: {
      type: 'object',
      description: 'JSON schema for tool input'
    }
  },
  required: ['name', 'inputSchema'],
  additionalProperties: false
} as const;

/**
 * MCP resource schema
 */
export const MCP_RESOURCE_SCHEMA = {
  type: 'object',
  properties: {
    uri: {
      type: 'string',
      format: 'uri',
      description: 'Resource URI'
    },
    name: {
      type: 'string',
      description: 'Resource name'
    },
    description: {
      type: 'string',
      description: 'Resource description'
    },
    mimeType: {
      type: 'string',
      description: 'MIME type'
    },
    annotations: {
      type: 'object',
      properties: {
        audience: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['user', 'assistant']
          },
          description: 'Intended audience'
        },
        priority: {
          type: 'number',
          minimum: 0,
          maximum: 1,
          description: 'Priority (0-1)'
        }
      },
      description: 'Resource annotations'
    }
  },
  required: ['uri'],
  additionalProperties: false
} as const;

/**
 * MCP prompt schema
 */
export const MCP_PROMPT_SCHEMA = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      description: 'Prompt name'
    },
    description: {
      type: 'string',
      description: 'Prompt description'
    },
    arguments: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          required: { type: 'boolean' }
        },
        required: ['name']
      },
      description: 'Prompt arguments'
    }
  },
  required: ['name'],
  additionalProperties: false
} as const;

/**
 * MCP message schema
 */
export const MCP_MESSAGE_SCHEMA = {
  type: 'object',
  properties: {
    jsonrpc: {
      type: 'string',
      const: '2.0',
      description: 'JSON-RPC version'
    },
    id: {
      oneOf: [
        { type: 'string' },
        { type: 'number' },
        { type: 'null' }
      ],
      description: 'Message ID'
    },
    method: {
      type: 'string',
      description: 'Method name'
    },
    params: {
      type: 'object',
      description: 'Method parameters'
    },
    result: {
      description: 'Method result'
    },
    error: {
      type: 'object',
      properties: {
        code: { type: 'number' },
        message: { type: 'string' },
        data: {}
      },
      required: ['code', 'message'],
      description: 'Error object'
    }
  },
  required: ['jsonrpc'],
  additionalProperties: false
} as const;

/**
 * MCP client configuration schema
 */
export const MCP_CLIENT_CONFIG_SCHEMA = {
  type: 'object',
  properties: {
    // Connection settings
    timeout: {
      type: 'number',
      minimum: 1000,
      default: 30000,
      description: 'Request timeout in milliseconds'
    },
    retryAttempts: {
      type: 'number',
      minimum: 0,
      maximum: 10,
      default: 3,
      description: 'Number of retry attempts'
    },
    retryDelay: {
      type: 'number',
      minimum: 100,
      default: 1000,
      description: 'Delay between retries in milliseconds'
    },
    
    // Protocol settings
    protocolVersion: {
      type: 'string',
      default: '2024-11-05',
      description: 'MCP protocol version'
    },
    clientInfo: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        version: { type: 'string' }
      },
      required: ['name', 'version'],
      description: 'Client information'
    },
    
    // Feature flags
    features: {
      type: 'object',
      properties: {
        enableLogging: {
          type: 'boolean',
          default: true,
          description: 'Enable logging support'
        },
        enableSampling: {
          type: 'boolean',
          default: false,
          description: 'Enable sampling support'
        },
        enableRoots: {
          type: 'boolean',
          default: true,
          description: 'Enable roots support'
        },
        enableProgress: {
          type: 'boolean',
          default: true,
          description: 'Enable progress notifications'
        }
      },
      description: 'Feature configuration'
    },
    
    // Servers configuration
    servers: {
      type: 'array',
      items: { $ref: '#/definitions/mcpServer' },
      description: 'List of MCP servers'
    }
  },
  required: ['clientInfo'],
  additionalProperties: false
} as const;

/**
 * Video player MCP integration schema
 */
export const VIDEO_PLAYER_MCP_SCHEMA = {
  type: 'object',
  properties: {
    enabled: {
      type: 'boolean',
      description: 'Enable MCP integration'
    },
    
    // Video analysis tools
    videoAnalysis: {
      type: 'object',
      properties: {
        server: { type: 'string' },
        tools: {
          type: 'array',
          items: {
            type: 'string',
            enum: [
              'extract_frames', 'analyze_content', 'detect_scenes',
              'transcribe_audio', 'identify_objects', 'extract_metadata'
            ]
          }
        }
      },
      description: 'Video analysis server configuration'
    },
    
    // Content enhancement
    contentEnhancement: {
      type: 'object',
      properties: {
        server: { type: 'string' },
        tools: {
          type: 'array',
          items: {
            type: 'string',
            enum: [
              'generate_thumbnails', 'create_chapters', 'enhance_quality',
              'add_captions', 'translate_subtitles', 'optimize_encoding'
            ]
          }
        }
      },
      description: 'Content enhancement server configuration'
    },
    
    // Analytics and insights
    analytics: {
      type: 'object',
      properties: {
        server: { type: 'string' },
        tools: {
          type: 'array',
          items: {
            type: 'string',
            enum: [
              'track_engagement', 'analyze_behavior', 'generate_insights',
              'predict_preferences', 'recommend_content', 'monitor_performance'
            ]
          }
        }
      },
      description: 'Analytics server configuration'
    },
    
    // Accessibility tools
    accessibility: {
      type: 'object',
      properties: {
        server: { type: 'string' },
        tools: {
          type: 'array',
          items: {
            type: 'string',
            enum: [
              'generate_descriptions', 'create_sign_language', 'simplify_language',
              'adjust_colors', 'enhance_contrast', 'provide_navigation_aids'
            ]
          }
        }
      },
      description: 'Accessibility server configuration'
    }
  },
  description: 'Video player MCP integration configuration'
} as const;

/**
 * Validate MCP server configuration
 */
export function validateMCPServerConfig(config: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (typeof config !== 'object' || config === null) {
    return { valid: false, errors: ['MCP server config must be an object'] };
  }
  
  // Required fields
  if (!config.name || typeof config.name !== 'string' || config.name.trim().length === 0) {
    errors.push('name is required and must be a non-empty string');
  }
  
  if (!config.connection || typeof config.connection !== 'object') {
    errors.push('connection is required and must be an object');
  } else {
    const validConnectionTypes = ['stdio', 'sse', 'websocket'];
    if (!config.connection.type || !validConnectionTypes.includes(config.connection.type)) {
      errors.push(`connection.type must be one of: ${validConnectionTypes.join(', ')}`);
    }
  }
  
  // Version validation
  if (config.version && typeof config.version === 'string') {
    const semverRegex = /^\d+\.\d+\.\d+$/;
    if (!semverRegex.test(config.version)) {
      errors.push('version must follow semantic versioning (x.y.z)');
    }
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Validate MCP client configuration
 */
export function validateMCPClientConfig(config: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (typeof config !== 'object' || config === null) {
    return { valid: false, errors: ['MCP client config must be an object'] };
  }
  
  // Client info validation
  if (!config.clientInfo || typeof config.clientInfo !== 'object') {
    errors.push('clientInfo is required and must be an object');
  } else {
    if (!config.clientInfo.name || typeof config.clientInfo.name !== 'string') {
      errors.push('clientInfo.name is required and must be a string');
    }
    if (!config.clientInfo.version || typeof config.clientInfo.version !== 'string') {
      errors.push('clientInfo.version is required and must be a string');
    }
  }
  
  // Timeout validation
  if (config.timeout !== undefined) {
    if (typeof config.timeout !== 'number' || config.timeout < 1000) {
      errors.push('timeout must be a number >= 1000');
    }
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Validate video player MCP integration
 */
export function validateVideoPlayerMCP(config: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (typeof config !== 'object' || config === null) {
    return { valid: false, errors: ['Video player MCP config must be an object'] };
  }
  
  // Validate tool configurations
  const toolSections = ['videoAnalysis', 'contentEnhancement', 'analytics', 'accessibility'];
  
  toolSections.forEach(section => {
    if (config[section] && typeof config[section] === 'object') {
      if (config[section].server && typeof config[section].server !== 'string') {
        errors.push(`${section}.server must be a string`);
      }
      
      if (config[section].tools && !Array.isArray(config[section].tools)) {
        errors.push(`${section}.tools must be an array`);
      }
    }
  });
  
  return { valid: errors.length === 0, errors };
}
