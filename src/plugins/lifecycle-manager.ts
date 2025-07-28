/**
 * Plugin Lifecycle Manager
 * Manages plugin initialization, activation, and destruction lifecycle
 */

import type { BasePlugin } from './base-plugin';
import { PluginRegistry } from './registry';

export interface LifecycleHooks {
  beforeInitialize?: (plugin: BasePlugin) => Promise<void> | void;
  afterInitialize?: (plugin: BasePlugin) => Promise<void> | void;
  beforeDestroy?: (plugin: BasePlugin) => Promise<void> | void;
  afterDestroy?: (plugin: BasePlugin) => Promise<void> | void;
  onError?: (plugin: BasePlugin, error: Error) => Promise<void> | void;
}

export class LifecycleManager {
  private registry: PluginRegistry;
  private hooks: LifecycleHooks = {};
  private initializationOrder: string[] = [];
  private destroyOrder: string[] = [];

  constructor(registry: PluginRegistry) {
    this.registry = registry;
  }

  /**
   * Set lifecycle hooks
   */
  setHooks(hooks: LifecycleHooks): void {
    this.hooks = { ...this.hooks, ...hooks };
  }

  /**
   * Set initialization order for plugins
   */
  setInitializationOrder(order: string[]): void {
    this.initializationOrder = [...order];
  }

  /**
   * Set destruction order for plugins
   */
  setDestroyOrder(order: string[]): void {
    this.destroyOrder = [...order];
  }

  /**
   * Initialize all registered plugins in order
   */
  async initializeAll(): Promise<void> {
    const plugins = this.registry.getAllPlugins();
    const orderedPlugins = this.orderPlugins(plugins, this.initializationOrder);

    for (const plugin of orderedPlugins) {
      if (plugin.instance) {
        try {
          await this.initializePlugin(plugin.instance);
        } catch (error) {
          console.error(`Failed to initialize plugin ${plugin.id}:`, error);
          if (this.hooks.onError) {
            await this.hooks.onError(plugin.instance, error as Error);
          }
        }
      }
    }
  }

  /**
   * Initialize a specific plugin
   */
  async initializePlugin(plugin: BasePlugin): Promise<void> {
    if (plugin.initialized) {
      return; // Already initialized
    }

    try {
      // Before initialize hook
      if (this.hooks.beforeInitialize) {
        await this.hooks.beforeInitialize(plugin);
      }

      // Initialize the plugin
      await plugin.initialize();

      // After initialize hook
      if (this.hooks.afterInitialize) {
        await this.hooks.afterInitialize(plugin);
      }

      console.log(`Plugin ${plugin.id} initialized successfully`);
    } catch (error) {
      console.error(`Failed to initialize plugin ${plugin.id}:`, error);
      if (this.hooks.onError) {
        await this.hooks.onError(plugin, error as Error);
      }
      throw error;
    }
  }

  /**
   * Destroy all active plugins in order
   */
  async destroyAll(): Promise<void> {
    const activePlugins = this.registry.getActivePlugins();
    const orderedPlugins = this.orderPlugins(activePlugins, this.destroyOrder);

    // Reverse order for destruction
    const reversedPlugins = [...orderedPlugins].reverse();

    for (const plugin of reversedPlugins) {
      if (plugin.instance) {
        try {
          await this.destroyPlugin(plugin.instance);
        } catch (error) {
          console.error(`Failed to destroy plugin ${plugin.id}:`, error);
          if (this.hooks.onError) {
            await this.hooks.onError(plugin.instance, error as Error);
          }
        }
      }
    }
  }

  /**
   * Destroy a specific plugin
   */
  async destroyPlugin(plugin: BasePlugin): Promise<void> {
    if (!plugin.initialized) {
      return; // Already destroyed or not initialized
    }

    try {
      // Before destroy hook
      if (this.hooks.beforeDestroy) {
        await this.hooks.beforeDestroy(plugin);
      }

      // Destroy the plugin
      await plugin.destroy();

      // After destroy hook
      if (this.hooks.afterDestroy) {
        await this.hooks.afterDestroy(plugin);
      }

      console.log(`Plugin ${plugin.id} destroyed successfully`);
    } catch (error) {
      console.error(`Failed to destroy plugin ${plugin.id}:`, error);
      if (this.hooks.onError) {
        await this.hooks.onError(plugin, error as Error);
      }
      throw error;
    }
  }

  /**
   * Initialize plugins by type
   */
  async initializeByType(type: string): Promise<void> {
    const plugins = this.registry.getPluginsByType(type);
    const orderedPlugins = this.orderPlugins(plugins, this.initializationOrder);

    for (const plugin of orderedPlugins) {
      if (plugin.instance && !plugin.instance.initialized) {
        try {
          await this.initializePlugin(plugin.instance);
        } catch (error) {
          console.error(`Failed to initialize plugin ${plugin.id}:`, error);
        }
      }
    }
  }

  /**
   * Destroy plugins by type
   */
  async destroyByType(type: string): Promise<void> {
    const plugins = this.registry.getPluginsByType(type);
    const orderedPlugins = this.orderPlugins(plugins, this.destroyOrder);
    const reversedPlugins = [...orderedPlugins].reverse();

    for (const plugin of reversedPlugins) {
      if (plugin.instance && plugin.instance.initialized) {
        try {
          await this.destroyPlugin(plugin.instance);
        } catch (error) {
          console.error(`Failed to destroy plugin ${plugin.id}:`, error);
        }
      }
    }
  }

  /**
   * Check plugin dependencies
   */
  validateDependencies(plugin: BasePlugin): boolean {
    const dependencies = plugin.dependencies;
    if (!dependencies || dependencies.length === 0) {
      return true;
    }

    for (const depId of dependencies) {
      const depPlugin = this.registry.getPlugin(depId);
      if (!depPlugin || !depPlugin.instance || !depPlugin.instance.initialized) {
        console.warn(`Plugin ${plugin.id} dependency ${depId} not available`);
        return false;
      }
    }

    return true;
  }

  /**
   * Order plugins based on specified order array
   */
  private orderPlugins(plugins: any[], order: string[]): any[] {
    if (order.length === 0) {
      return plugins;
    }

    const ordered: any[] = [];
    const unordered: any[] = [];

    // Add plugins in specified order
    for (const pluginId of order) {
      const plugin = plugins.find(p => p.id === pluginId);
      if (plugin) {
        ordered.push(plugin);
      }
    }

    // Add remaining plugins
    for (const plugin of plugins) {
      if (!order.includes(plugin.id)) {
        unordered.push(plugin);
      }
    }

    return [...ordered, ...unordered];
  }

  /**
   * Get lifecycle status
   */
  getLifecycleStatus() {
    const allPlugins = this.registry.getAllPlugins();
    const activePlugins = this.registry.getActivePlugins();

    return {
      totalPlugins: allPlugins.length,
      activePlugins: activePlugins.length,
      inactivePlugins: allPlugins.length - activePlugins.length,
      initializationOrder: this.initializationOrder,
      destroyOrder: this.destroyOrder,
      plugins: allPlugins.map(p => ({
        id: p.id,
        name: p.name,
        type: p.type,
        status: p.status,
        initialized: p.instance?.initialized || false
      }))
    };
  }
}
