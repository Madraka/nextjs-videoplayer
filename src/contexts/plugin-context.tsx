/**
 * Plugin Context
 * Manages plugin system for the video player
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

// Plugin interfaces
interface PluginMetadata {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  category: 'controls' | 'effects' | 'analytics' | 'streaming' | 'ui' | 'utility';
  tags: string[];
  icon?: string;
  homepage?: string;
  repository?: string;
  license?: string;
  dependencies?: string[];
  permissions?: string[];
}

interface PluginConfig {
  enabled: boolean;
  settings: Record<string, any>;
  priority: number;
  autoStart: boolean;
}

interface PluginHooks {
  onPlayerInit?: (player: any) => void;
  onPlayerReady?: (player: any) => void;
  onPlay?: (player: any) => void;
  onPause?: (player: any) => void;
  onSeek?: (player: any, time: number) => void;
  onTimeUpdate?: (player: any, time: number) => void;
  onVolumeChange?: (player: any, volume: number) => void;
  onQualityChange?: (player: any, quality: string) => void;
  onFullscreenChange?: (player: any, isFullscreen: boolean) => void;
  onError?: (player: any, error: Error) => void;
  onDestroy?: (player: any) => void;
}

interface PluginAPI {
  registerHook: (event: keyof PluginHooks, callback: (...args: any[]) => any) => void;
  unregisterHook: (event: keyof PluginHooks, callback: (...args: any[]) => any) => void;
  getPlayerInstance: () => any;
  getPluginConfig: (pluginId: string) => PluginConfig | undefined;
  updatePluginConfig: (pluginId: string, config: Partial<PluginConfig>) => void;
  emitEvent: (event: string, data?: any) => void;
  addEventListener: (event: string, callback: (...args: any[]) => any) => void;
  removeEventListener: (event: string, callback: (...args: any[]) => any) => void;
  createElement: (type: string, props?: any) => React.ReactElement;
  getTheme: () => any;
  showNotification: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

interface Plugin {
  metadata: PluginMetadata;
  config: PluginConfig;
  hooks: PluginHooks;
  api?: PluginAPI;
  component?: React.ComponentType<any>;
  init?: (api: PluginAPI) => void;
  destroy?: () => void;
  onConfigChange?: (config: PluginConfig) => void;
  isLoaded: boolean;
  isActive: boolean;
  error?: Error;
}

interface PluginStore {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  version: string;
  author: string;
  downloads: number;
  rating: number;
  reviews: number;
  icon?: string;
  screenshots?: string[];
  downloadUrl: string;
  verified: boolean;
  featured: boolean;
  lastUpdated: string;
}

// Plugin context interface
interface PluginContextValue {
  plugins: Map<string, Plugin>;
  loadedPlugins: string[];
  activePlugins: string[];
  availablePlugins: PluginStore[];
  isLoading: boolean;
  error?: Error;
  
  // Plugin management
  loadPlugin: (plugin: Plugin) => Promise<void>;
  unloadPlugin: (pluginId: string) => Promise<void>;
  enablePlugin: (pluginId: string) => Promise<void>;
  disablePlugin: (pluginId: string) => Promise<void>;
  reloadPlugin: (pluginId: string) => Promise<void>;
  
  // Plugin configuration
  getPluginConfig: (pluginId: string) => PluginConfig | undefined;
  updatePluginConfig: (pluginId: string, config: Partial<PluginConfig>) => void;
  resetPluginConfig: (pluginId: string) => void;
  
  // Plugin store
  fetchAvailablePlugins: () => Promise<void>;
  installPlugin: (pluginId: string) => Promise<void>;
  uninstallPlugin: (pluginId: string) => Promise<void>;
  updatePlugin: (pluginId: string) => Promise<void>;
  
  // Plugin hooks
  registerHook: (pluginId: string, event: keyof PluginHooks, callback: (...args: any[]) => any) => void;
  unregisterHook: (pluginId: string, event: keyof PluginHooks, callback: (...args: any[]) => any) => void;
  triggerHook: (event: keyof PluginHooks, ...args: any[]) => void;
  
  // Plugin events
  addEventListener: (event: string, callback: (...args: any[]) => any) => void;
  removeEventListener: (event: string, callback: (...args: any[]) => any) => void;
  emitEvent: (event: string, data?: any) => void;
  
  // Plugin discovery
  searchPlugins: (query: string, filters?: { category?: string; tags?: string[] }) => PluginStore[];
  getPluginsByCategory: (category: string) => PluginStore[];
  getFeaturedPlugins: () => PluginStore[];
  
  // Plugin validation
  validatePlugin: (plugin: Plugin) => { isValid: boolean; errors: string[] };
  checkPluginDependencies: (plugin: Plugin) => { satisfied: boolean; missing: string[] };
  
  // Bulk operations
  enableAllPlugins: () => Promise<void>;
  disableAllPlugins: () => Promise<void>;
  reloadAllPlugins: () => Promise<void>;
  exportPluginConfigs: () => string;
  importPluginConfigs: (configData: string) => Promise<void>;
}

// Create context
const PluginContext = createContext<PluginContextValue | undefined>(undefined);

// Provider props
interface PluginProviderProps {
  children: React.ReactNode;
  playerInstance?: any;
  onPluginLoad?: (plugin: Plugin) => void;
  onPluginUnload?: (plugin: Plugin) => void;
  onPluginError?: (plugin: Plugin, error: Error) => void;
}

// Provider component
export function PluginProvider({ 
  children, 
  playerInstance,
  onPluginLoad,
  onPluginUnload,
  onPluginError
}: PluginProviderProps) {
  const [plugins, setPlugins] = useState<Map<string, Plugin>>(new Map());
  const [availablePlugins, setAvailablePlugins] = useState<PluginStore[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();
  
  const eventListeners = useRef<Map<string, Set<(...args: any[]) => any>>>(new Map());
  const hookListeners = useRef<Map<keyof PluginHooks, Map<string, Set<(...args: any[]) => any>>>>(new Map());

  // Get derived state
  const loadedPlugins = Array.from(plugins.values())
    .filter(plugin => plugin.isLoaded)
    .map(plugin => plugin.metadata.id);

  const activePlugins = Array.from(plugins.values())
    .filter(plugin => plugin.isActive)
    .map(plugin => plugin.metadata.id);

  // Create plugin API
  const createPluginAPI = useCallback((pluginId: string): PluginAPI => ({
    registerHook: (event: keyof PluginHooks, callback: (...args: any[]) => any) => {
      registerHook(pluginId, event, callback);
    },
    unregisterHook: (event: keyof PluginHooks, callback: (...args: any[]) => any) => {
      unregisterHook(pluginId, event, callback);
    },
    getPlayerInstance: () => playerInstance,
    getPluginConfig: (id: string) => getPluginConfig(id),
    updatePluginConfig: (id: string, config: Partial<PluginConfig>) => {
      updatePluginConfig(id, config);
    },
    emitEvent: (event: string, data?: any) => emitEvent(event, data),
    addEventListener: (event: string, callback: (...args: any[]) => any) => {
      addEventListener(event, callback);
    },
    removeEventListener: (event: string, callback: (...args: any[]) => any) => {
      removeEventListener(event, callback);
    },
    createElement: (type: string, props?: any) => React.createElement(type, props),
    getTheme: () => ({}), // TODO: Integrate with theme context
    showNotification: (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
      emitEvent('notification', { message, type });
    }
  }), [playerInstance]);

  // Load plugin
  const loadPlugin = useCallback(async (plugin: Plugin) => {
    try {
      setIsLoading(true);
      
      // Validate plugin
      const validation = validatePlugin(plugin);
      if (!validation.isValid) {
        throw new Error(`Plugin validation failed: ${validation.errors.join(', ')}`);
      }

      // Check dependencies
      const dependencies = checkPluginDependencies(plugin);
      if (!dependencies.satisfied) {
        throw new Error(`Missing dependencies: ${dependencies.missing.join(', ')}`);
      }

      // Create API instance for plugin
      const api = createPluginAPI(plugin.metadata.id);
      plugin.api = api;

      // Initialize plugin
      if (plugin.init) {
        await plugin.init(api);
      }

      // Mark as loaded
      plugin.isLoaded = true;
      plugin.error = undefined;

      // Update plugins map
      setPlugins(prev => new Map(prev).set(plugin.metadata.id, plugin));

      // Enable plugin if auto-start is enabled
      if (plugin.config.autoStart) {
        await enablePlugin(plugin.metadata.id);
      }

      onPluginLoad?.(plugin);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      plugin.error = error;
      setPlugins(prev => new Map(prev).set(plugin.metadata.id, plugin));
      onPluginError?.(plugin, error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [createPluginAPI, onPluginLoad, onPluginError]);

  // Unload plugin
  const unloadPlugin = useCallback(async (pluginId: string) => {
    const plugin = plugins.get(pluginId);
    if (!plugin) return;

    try {
      // Disable plugin first
      if (plugin.isActive) {
        await disablePlugin(pluginId);
      }

      // Clean up hooks
      hookListeners.current.forEach((pluginMap) => {
        pluginMap.delete(pluginId);
      });

      // Destroy plugin
      if (plugin.destroy) {
        await plugin.destroy();
      }

      // Mark as unloaded
      plugin.isLoaded = false;
      plugin.isActive = false;

      // Update plugins map
      setPlugins(prev => {
        const newMap = new Map(prev);
        newMap.delete(pluginId);
        return newMap;
      });

      onPluginUnload?.(plugin);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      plugin.error = error;
      onPluginError?.(plugin, error);
      throw error;
    }
  }, [plugins, onPluginUnload, onPluginError]);

  // Enable plugin
  const enablePlugin = useCallback(async (pluginId: string) => {
    const plugin = plugins.get(pluginId);
    if (!plugin || !plugin.isLoaded) return;

    try {
      plugin.isActive = true;
      plugin.config.enabled = true;
      
      setPlugins(prev => new Map(prev).set(pluginId, plugin));
      
      // Trigger plugin hooks
      triggerHook('onPlayerReady', playerInstance);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      plugin.error = error;
      onPluginError?.(plugin, error);
      throw error;
    }
  }, [plugins, playerInstance, onPluginError]);

  // Disable plugin
  const disablePlugin = useCallback(async (pluginId: string) => {
    const plugin = plugins.get(pluginId);
    if (!plugin) return;

    try {
      plugin.isActive = false;
      plugin.config.enabled = false;
      
      setPlugins(prev => new Map(prev).set(pluginId, plugin));
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      plugin.error = error;
      onPluginError?.(plugin, error);
      throw error;
    }
  }, [plugins, onPluginError]);

  // Reload plugin
  const reloadPlugin = useCallback(async (pluginId: string) => {
    const plugin = plugins.get(pluginId);
    if (!plugin) return;

    await unloadPlugin(pluginId);
    await loadPlugin(plugin);
  }, [plugins, unloadPlugin, loadPlugin]);

  // Get plugin configuration
  const getPluginConfig = useCallback((pluginId: string): PluginConfig | undefined => {
    return plugins.get(pluginId)?.config;
  }, [plugins]);

  // Update plugin configuration
  const updatePluginConfig = useCallback((pluginId: string, config: Partial<PluginConfig>) => {
    const plugin = plugins.get(pluginId);
    if (!plugin) return;

    const updatedConfig = { ...plugin.config, ...config };
    plugin.config = updatedConfig;
    
    setPlugins(prev => new Map(prev).set(pluginId, plugin));
    
    // Notify plugin of config change
    if (plugin.onConfigChange) {
      plugin.onConfigChange(updatedConfig);
    }

    // Save to localStorage
    if (typeof window !== 'undefined') {
      const savedConfigs = JSON.parse(
        localStorage.getItem('video-player-plugin-configs') || '{}'
      );
      savedConfigs[pluginId] = updatedConfig;
      localStorage.setItem('video-player-plugin-configs', JSON.stringify(savedConfigs));
    }
  }, [plugins]);

  // Reset plugin configuration
  const resetPluginConfig = useCallback((pluginId: string) => {
    const plugin = plugins.get(pluginId);
    if (!plugin) return;

    const defaultConfig: PluginConfig = {
      enabled: false,
      settings: {},
      priority: 0,
      autoStart: false
    };

    updatePluginConfig(pluginId, defaultConfig);
  }, [plugins, updatePluginConfig]);

  // Register hook
  const registerHook = useCallback((pluginId: string, event: keyof PluginHooks, callback: Function) => {
    if (!hookListeners.current.has(event)) {
      hookListeners.current.set(event, new Map());
    }
    
    const eventMap = hookListeners.current.get(event)!;
    if (!eventMap.has(pluginId)) {
      eventMap.set(pluginId, new Set());
    }
    
    eventMap.get(pluginId)!.add(callback);
  }, []);

  // Unregister hook
  const unregisterHook = useCallback((pluginId: string, event: keyof PluginHooks, callback: Function) => {
    const eventMap = hookListeners.current.get(event);
    if (eventMap && eventMap.has(pluginId)) {
      eventMap.get(pluginId)!.delete(callback);
    }
  }, []);

  // Trigger hook
  const triggerHook = useCallback((event: keyof PluginHooks, ...args: any[]) => {
    const eventMap = hookListeners.current.get(event);
    if (!eventMap) return;

    // Sort plugins by priority
    const sortedPlugins = Array.from(plugins.values())
      .filter(plugin => plugin.isActive && eventMap.has(plugin.metadata.id))
      .sort((a, b) => b.config.priority - a.config.priority);

    // Execute hooks in priority order
    sortedPlugins.forEach(plugin => {
      const callbacks = eventMap.get(plugin.metadata.id);
      if (callbacks) {
        callbacks.forEach(callback => {
          try {
            callback(...args);
          } catch (error) {
            console.error(`Plugin hook error in ${plugin.metadata.id}:`, error);
          }
        });
      }
    });
  }, [plugins]);

  // Add event listener
  const addEventListener = useCallback((event: string, callback: Function) => {
    if (!eventListeners.current.has(event)) {
      eventListeners.current.set(event, new Set());
    }
    eventListeners.current.get(event)!.add(callback);
  }, []);

  // Remove event listener
  const removeEventListener = useCallback((event: string, callback: Function) => {
    const listeners = eventListeners.current.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }, []);

  // Emit event
  const emitEvent = useCallback((event: string, data?: any) => {
    const listeners = eventListeners.current.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Event listener error for ${event}:`, error);
        }
      });
    }
  }, []);

  // Fetch available plugins
  const fetchAvailablePlugins = useCallback(async () => {
    try {
      setIsLoading(true);
      // TODO: Implement actual plugin store API
      const mockPlugins: PluginStore[] = [
        {
          id: 'video-analytics',
          name: 'Video Analytics',
          description: 'Advanced video playback analytics',
          category: 'analytics',
          tags: ['analytics', 'tracking', 'stats'],
          version: '1.0.0',
          author: 'VideoPlayer Team',
          downloads: 1250,
          rating: 4.8,
          reviews: 45,
          downloadUrl: '/plugins/video-analytics.js',
          verified: true,
          featured: true,
          lastUpdated: '2024-01-15'
        }
      ];
      setAvailablePlugins(mockPlugins);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Install plugin
  const installPlugin = useCallback(async (pluginId: string) => {
    // TODO: Implement plugin installation from store
    console.log('Installing plugin:', pluginId);
  }, []);

  // Uninstall plugin
  const uninstallPlugin = useCallback(async (pluginId: string) => {
    await unloadPlugin(pluginId);
    // TODO: Remove plugin files
  }, [unloadPlugin]);

  // Update plugin
  const updatePlugin = useCallback(async (pluginId: string) => {
    // TODO: Implement plugin updates
    console.log('Updating plugin:', pluginId);
  }, []);

  // Search plugins
  const searchPlugins = useCallback((query: string, filters?: { category?: string; tags?: string[] }): PluginStore[] => {
    return availablePlugins.filter(plugin => {
      const matchesQuery = plugin.name.toLowerCase().includes(query.toLowerCase()) ||
                          plugin.description.toLowerCase().includes(query.toLowerCase());
      
      const matchesCategory = !filters?.category || plugin.category === filters.category;
      const matchesTags = !filters?.tags || filters.tags.some(tag => plugin.tags.includes(tag));
      
      return matchesQuery && matchesCategory && matchesTags;
    });
  }, [availablePlugins]);

  // Get plugins by category
  const getPluginsByCategory = useCallback((category: string): PluginStore[] => {
    return availablePlugins.filter(plugin => plugin.category === category);
  }, [availablePlugins]);

  // Get featured plugins
  const getFeaturedPlugins = useCallback((): PluginStore[] => {
    return availablePlugins.filter(plugin => plugin.featured);
  }, [availablePlugins]);

  // Validate plugin
  const validatePlugin = useCallback((plugin: Plugin): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!plugin.metadata.id) errors.push('Plugin ID is required');
    if (!plugin.metadata.name) errors.push('Plugin name is required');
    if (!plugin.metadata.version) errors.push('Plugin version is required');
    
    return { isValid: errors.length === 0, errors };
  }, []);

  // Check plugin dependencies
  const checkPluginDependencies = useCallback((plugin: Plugin): { satisfied: boolean; missing: string[] } => {
    const missing: string[] = [];
    
    if (plugin.metadata.dependencies) {
      plugin.metadata.dependencies.forEach(dep => {
        if (!plugins.has(dep)) {
          missing.push(dep);
        }
      });
    }
    
    return { satisfied: missing.length === 0, missing };
  }, [plugins]);

  // Bulk operations
  const enableAllPlugins = useCallback(async () => {
    const promises = loadedPlugins.map(pluginId => enablePlugin(pluginId));
    await Promise.allSettled(promises);
  }, [loadedPlugins, enablePlugin]);

  const disableAllPlugins = useCallback(async () => {
    const promises = activePlugins.map(pluginId => disablePlugin(pluginId));
    await Promise.allSettled(promises);
  }, [activePlugins, disablePlugin]);

  const reloadAllPlugins = useCallback(async () => {
    const promises = loadedPlugins.map(pluginId => reloadPlugin(pluginId));
    await Promise.allSettled(promises);
  }, [loadedPlugins, reloadPlugin]);

  // Export plugin configurations
  const exportPluginConfigs = useCallback((): string => {
    const configs: Record<string, PluginConfig> = {};
    plugins.forEach((plugin, id) => {
      configs[id] = plugin.config;
    });
    return JSON.stringify(configs, null, 2);
  }, [plugins]);

  // Import plugin configurations
  const importPluginConfigs = useCallback(async (configData: string) => {
    try {
      const configs: Record<string, PluginConfig> = JSON.parse(configData);
      
      Object.entries(configs).forEach(([pluginId, config]) => {
        if (plugins.has(pluginId)) {
          updatePluginConfig(pluginId, config);
        }
      });
    } catch (error) {
      console.error('Failed to import plugin configurations:', error);
      throw error;
    }
  }, [plugins, updatePluginConfig]);

  // Load saved configurations on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedConfigs = localStorage.getItem('video-player-plugin-configs');
      if (savedConfigs) {
        try {
          importPluginConfigs(savedConfigs);
        } catch (error) {
          console.error('Failed to load saved plugin configurations:', error);
        }
      }
    }
  }, [importPluginConfigs]);

  const contextValue: PluginContextValue = {
    plugins,
    loadedPlugins,
    activePlugins,
    availablePlugins,
    isLoading,
    error,
    loadPlugin,
    unloadPlugin,
    enablePlugin,
    disablePlugin,
    reloadPlugin,
    getPluginConfig,
    updatePluginConfig,
    resetPluginConfig,
    fetchAvailablePlugins,
    installPlugin,
    uninstallPlugin,
    updatePlugin,
    registerHook,
    unregisterHook,
    triggerHook,
    addEventListener,
    removeEventListener,
    emitEvent,
    searchPlugins,
    getPluginsByCategory,
    getFeaturedPlugins,
    validatePlugin,
    checkPluginDependencies,
    enableAllPlugins,
    disableAllPlugins,
    reloadAllPlugins,
    exportPluginConfigs,
    importPluginConfigs
  };

  return (
    <PluginContext.Provider value={contextValue}>
      {children}
    </PluginContext.Provider>
  );
}

// Hook to use plugin context
export function usePlugin(): PluginContextValue {
  const context = useContext(PluginContext);
  if (context === undefined) {
    throw new Error('usePlugin must be used within a PluginProvider');
  }
  return context;
}

// Convenience hooks
export function usePluginConfig(pluginId: string) {
  const { getPluginConfig, updatePluginConfig } = usePlugin();
  return {
    config: getPluginConfig(pluginId),
    updateConfig: (config: Partial<PluginConfig>) => updatePluginConfig(pluginId, config)
  };
}

export function usePluginHooks(pluginId: string) {
  const { registerHook, unregisterHook } = usePlugin();
  
  const registerPluginHook = useCallback((event: keyof PluginHooks, callback: Function) => {
    registerHook(pluginId, event, callback);
  }, [registerHook, pluginId]);
  
  const unregisterPluginHook = useCallback((event: keyof PluginHooks, callback: Function) => {
    unregisterHook(pluginId, event, callback);
  }, [unregisterHook, pluginId]);
  
  return { registerHook: registerPluginHook, unregisterHook: unregisterPluginHook };
}
