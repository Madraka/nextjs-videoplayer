/**
 * Plugin Interface Schema
 * Validation schema for plugin definitions and configurations
 */

export const PLUGIN_SCHEMA = {
  type: 'object',
  properties: {
    // Plugin identification
    id: {
      type: 'string',
      pattern: '^[a-z][a-z0-9-]*[a-z0-9]$',
      minLength: 2,
      maxLength: 50,
      description: 'Unique plugin identifier (kebab-case)'
    },
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      description: 'Human-readable plugin name'
    },
    version: {
      type: 'string',
      pattern: '^\\d+\\.\\d+\\.\\d+$',
      description: 'Plugin version (semantic versioning)'
    },
    type: {
      type: 'string',
      enum: ['analytics', 'streaming', 'accessibility', 'ai', 'mcp', 'social', 'monetization'],
      description: 'Plugin category type'
    },
    
    // Optional metadata
    description: {
      type: 'string',
      maxLength: 500,
      description: 'Plugin description'
    },
    author: {
      type: 'string',
      maxLength: 100,
      description: 'Plugin author'
    },
    license: {
      type: 'string',
      maxLength: 50,
      description: 'Plugin license'
    },
    homepage: {
      type: 'string',
      format: 'uri',
      description: 'Plugin homepage URL'
    },
    
    // Dependencies
    dependencies: {
      type: 'array',
      items: {
        type: 'string',
        pattern: '^[a-z][a-z0-9-]*[a-z0-9]$'
      },
      uniqueItems: true,
      description: 'Plugin dependencies (other plugin IDs)'
    },
    
    // Plugin configuration
    config: {
      type: 'object',
      description: 'Plugin-specific configuration'
    },
    
    // Capabilities
    capabilities: {
      type: 'object',
      properties: {
        events: {
          type: 'array',
          items: { type: 'string' },
          description: 'Events this plugin can handle'
        },
        apis: {
          type: 'array',
          items: { type: 'string' },
          description: 'APIs this plugin provides'
        },
        permissions: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['analytics', 'storage', 'network', 'microphone', 'camera', 'fullscreen']
          },
          description: 'Required permissions'
        }
      },
      description: 'Plugin capabilities and requirements'
    },
    
    // Runtime properties
    enabled: {
      type: 'boolean',
      description: 'Whether plugin is enabled'
    },
    autoStart: {
      type: 'boolean',
      description: 'Auto-start plugin on initialization'
    },
    
    // Performance constraints
    maxMemoryUsage: {
      type: 'number',
      minimum: 0,
      description: 'Maximum memory usage in MB'
    },
    priority: {
      type: 'number',
      minimum: 0,
      maximum: 100,
      description: 'Plugin initialization priority (0-100)'
    }
  },
  required: ['id', 'name', 'version', 'type'],
  additionalProperties: false
} as const;

/**
 * Plugin registry schema
 */
export const PLUGIN_REGISTRY_SCHEMA = {
  type: 'object',
  properties: {
    plugins: {
      type: 'array',
      items: PLUGIN_SCHEMA,
      description: 'Registered plugins'
    },
    metadata: {
      type: 'object',
      properties: {
        version: { type: 'string' },
        lastUpdated: { type: 'string', format: 'date-time' },
        totalPlugins: { type: 'number', minimum: 0 }
      }
    }
  },
  required: ['plugins']
} as const;

/**
 * Plugin lifecycle event schema
 */
export const PLUGIN_LIFECYCLE_EVENT_SCHEMA = {
  type: 'object',
  properties: {
    pluginId: {
      type: 'string',
      description: 'Plugin identifier'
    },
    event: {
      type: 'string',
      enum: ['initialize', 'activate', 'deactivate', 'destroy', 'error'],
      description: 'Lifecycle event type'
    },
    timestamp: {
      type: 'number',
      description: 'Event timestamp'
    },
    data: {
      type: 'object',
      description: 'Event-specific data'
    },
    error: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        stack: { type: 'string' },
        code: { type: 'string' }
      },
      description: 'Error information (if applicable)'
    }
  },
  required: ['pluginId', 'event', 'timestamp']
} as const;

/**
 * Validate plugin definition
 */
export function validatePlugin(plugin: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (typeof plugin !== 'object' || plugin === null) {
    return { valid: false, errors: ['Plugin must be an object'] };
  }
  
  // Required fields validation
  if (!plugin.id || typeof plugin.id !== 'string') {
    errors.push('Plugin id is required and must be a string');
  } else if (!/^[a-z][a-z0-9-]*[a-z0-9]$/.test(plugin.id)) {
    errors.push('Plugin id must be kebab-case and contain only lowercase letters, numbers, and hyphens');
  }
  
  if (!plugin.name || typeof plugin.name !== 'string') {
    errors.push('Plugin name is required and must be a string');
  }
  
  if (!plugin.version || typeof plugin.version !== 'string') {
    errors.push('Plugin version is required and must be a string');
  } else if (!/^\d+\.\d+\.\d+$/.test(plugin.version)) {
    errors.push('Plugin version must follow semantic versioning (x.y.z)');
  }
  
  if (!plugin.type || typeof plugin.type !== 'string') {
    errors.push('Plugin type is required and must be a string');
  } else {
    const validTypes = ['analytics', 'streaming', 'accessibility', 'ai', 'mcp', 'social', 'monetization'];
    if (!validTypes.includes(plugin.type)) {
      errors.push(`Plugin type must be one of: ${validTypes.join(', ')}`);
    }
  }
  
  // Dependencies validation
  if (plugin.dependencies && Array.isArray(plugin.dependencies)) {
    plugin.dependencies.forEach((dep: any, index: number) => {
      if (typeof dep !== 'string') {
        errors.push(`Dependency at index ${index} must be a string`);
      } else if (!/^[a-z][a-z0-9-]*[a-z0-9]$/.test(dep)) {
        errors.push(`Dependency "${dep}" must be a valid plugin ID (kebab-case)`);
      }
    });
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Validate plugin configuration
 */
export function validatePluginConfig(config: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (config !== null && typeof config !== 'object') {
    errors.push('Plugin config must be an object or null');
  }
  
  return { valid: errors.length === 0, errors };
}
