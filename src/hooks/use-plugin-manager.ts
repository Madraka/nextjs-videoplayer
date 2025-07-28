/**
 * Plugin Manager Hook
 * Manages plugin lifecycle, registration, and communication
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface Plugin {
  id: string;
  name: string;
  version: string;
  type: string;
  enabled: boolean;
  config?: Record<string, any>;
  initialize?: () => Promise<void>;
  destroy?: () => Promise<void>;
  onPlayerEvent?: (event: string, data?: any) => void;
}

interface PluginManager {
  plugins: Map<string, Plugin>;
  register: (plugin: Plugin) => Promise<void>;
  unregister: (pluginId: string) => Promise<void>;
  enable: (pluginId: string) => Promise<void>;
  disable: (pluginId: string) => Promise<void>;
  configure: (pluginId: string, config: Record<string, any>) => Promise<void>;
  emit: (event: string, data?: any) => void;
}

interface UsePluginManagerProps {
  autoRegister?: Plugin[];
  onPluginError?: (pluginId: string, error: Error) => void;
}

interface UsePluginManagerReturn {
  plugins: Plugin[];
  registeredPlugins: string[];
  enabledPlugins: string[];
  isLoading: boolean;
  error: Error | null;
  registerPlugin: (plugin: Plugin) => Promise<void>;
  unregisterPlugin: (pluginId: string) => Promise<void>;
  enablePlugin: (pluginId: string) => Promise<void>;
  disablePlugin: (pluginId: string) => Promise<void>;
  configurePlugin: (pluginId: string, config: Record<string, any>) => Promise<void>;
  getPlugin: (pluginId: string) => Plugin | undefined;
  emitEvent: (event: string, data?: any) => void;
  manager: PluginManager;
}

export function usePluginManager({
  autoRegister = [],
  onPluginError
}: UsePluginManagerProps = {}): UsePluginManagerReturn {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const pluginMapRef = useRef<Map<string, Plugin>>(new Map());
  const eventListenersRef = useRef<Map<string, ((data?: any) => void)[]>>(new Map());

  // Plugin registry operations
  const registerPlugin = useCallback(async (plugin: Plugin) => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate plugin
      if (!plugin.id || !plugin.name || !plugin.version) {
        throw new Error(`Invalid plugin: missing required fields`);
      }

      if (pluginMapRef.current.has(plugin.id)) {
        throw new Error(`Plugin ${plugin.id} is already registered`);
      }

      // Initialize plugin if it has an initialize method
      if (plugin.initialize) {
        await plugin.initialize();
      }

      // Register plugin
      pluginMapRef.current.set(plugin.id, { ...plugin, enabled: true });
      setPlugins(Array.from(pluginMapRef.current.values()));

      console.log(`Plugin ${plugin.id} registered successfully`);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to register plugin');
      setError(error);
      onPluginError?.(plugin.id, error);
    } finally {
      setIsLoading(false);
    }
  }, [onPluginError]);

  const unregisterPlugin = useCallback(async (pluginId: string) => {
    try {
      const plugin = pluginMapRef.current.get(pluginId);
      if (!plugin) {
        throw new Error(`Plugin ${pluginId} not found`);
      }

      // Destroy plugin if it has a destroy method
      if (plugin.destroy) {
        await plugin.destroy();
      }

      // Remove from registry
      pluginMapRef.current.delete(pluginId);
      setPlugins(Array.from(pluginMapRef.current.values()));

      console.log(`Plugin ${pluginId} unregistered successfully`);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to unregister plugin');
      setError(error);
      onPluginError?.(pluginId, error);
    }
  }, [onPluginError]);

  const enablePlugin = useCallback(async (pluginId: string) => {
    try {
      const plugin = pluginMapRef.current.get(pluginId);
      if (!plugin) {
        throw new Error(`Plugin ${pluginId} not found`);
      }

      if (plugin.enabled) return;

      // Enable plugin
      plugin.enabled = true;
      pluginMapRef.current.set(pluginId, plugin);
      setPlugins(Array.from(pluginMapRef.current.values()));

      console.log(`Plugin ${pluginId} enabled`);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to enable plugin');
      setError(error);
      onPluginError?.(pluginId, error);
    }
  }, [onPluginError]);

  const disablePlugin = useCallback(async (pluginId: string) => {
    try {
      const plugin = pluginMapRef.current.get(pluginId);
      if (!plugin) {
        throw new Error(`Plugin ${pluginId} not found`);
      }

      if (!plugin.enabled) return;

      // Disable plugin
      plugin.enabled = false;
      pluginMapRef.current.set(pluginId, plugin);
      setPlugins(Array.from(pluginMapRef.current.values()));

      console.log(`Plugin ${pluginId} disabled`);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to disable plugin');
      setError(error);
      onPluginError?.(pluginId, error);
    }
  }, [onPluginError]);

  const configurePlugin = useCallback(async (pluginId: string, config: Record<string, any>) => {
    try {
      const plugin = pluginMapRef.current.get(pluginId);
      if (!plugin) {
        throw new Error(`Plugin ${pluginId} not found`);
      }

      // Update plugin configuration
      plugin.config = { ...plugin.config, ...config };
      pluginMapRef.current.set(pluginId, plugin);
      setPlugins(Array.from(pluginMapRef.current.values()));

      console.log(`Plugin ${pluginId} configured`);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to configure plugin');
      setError(error);
      onPluginError?.(pluginId, error);
    }
  }, [onPluginError]);

  const getPlugin = useCallback((pluginId: string): Plugin | undefined => {
    return pluginMapRef.current.get(pluginId);
  }, []);

  // Event system
  const emitEvent = useCallback((event: string, data?: any) => {
    // Emit to enabled plugins
    for (const plugin of pluginMapRef.current.values()) {
      if (plugin.enabled && plugin.onPlayerEvent) {
        try {
          plugin.onPlayerEvent(event, data);
        } catch (err) {
          console.error(`Plugin ${plugin.id} event handler error:`, err);
          onPluginError?.(plugin.id, err instanceof Error ? err : new Error('Event handler error'));
        }
      }
    }

    // Emit to event listeners
    const listeners = eventListenersRef.current.get(event) || [];
    listeners.forEach(listener => {
      try {
        listener(data);
      } catch (err) {
        console.error(`Event listener error for ${event}:`, err);
      }
    });
  }, [onPluginError]);

  // Plugin manager interface
  const manager: PluginManager = {
    plugins: pluginMapRef.current,
    register: registerPlugin,
    unregister: unregisterPlugin,
    enable: enablePlugin,
    disable: disablePlugin,
    configure: configurePlugin,
    emit: emitEvent
  };

  // Auto-register plugins on mount
  useEffect(() => {
    if (autoRegister.length > 0) {
      const registerAll = async () => {
        for (const plugin of autoRegister) {
          try {
            await registerPlugin(plugin);
          } catch (err) {
            console.error(`Failed to auto-register plugin ${plugin.id}:`, err);
          }
        }
      };

      registerAll();
    }
  }, [autoRegister, registerPlugin]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Destroy all plugins
      for (const plugin of pluginMapRef.current.values()) {
        if (plugin.destroy) {
          plugin.destroy().catch(err => {
            console.error(`Failed to destroy plugin ${plugin.id}:`, err);
          });
        }
      }
      pluginMapRef.current.clear();
    };
  }, []);

  const registeredPlugins = plugins.map(p => p.id);
  const enabledPlugins = plugins.filter(p => p.enabled).map(p => p.id);

  return {
    plugins,
    registeredPlugins,
    enabledPlugins,
    isLoading,
    error,
    registerPlugin,
    unregisterPlugin,
    enablePlugin,
    disablePlugin,
    configurePlugin,
    getPlugin,
    emitEvent,
    manager
  };
}
