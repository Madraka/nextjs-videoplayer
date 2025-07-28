/**
 * Plugin Registry
 * Manages plugin registration, discovery, and lifecycle
 */

import type { BasePlugin } from './base-plugin';
import { PLUGIN_STATUS, PLUGIN_TYPES } from './index';

export interface PluginInfo {
  id: string;
  name: string;
  version: string;
  type: string;
  status: string;
  instance?: BasePlugin;
  dependencies?: string[];
  config?: Record<string, any>;
}

export class PluginRegistry {
  private plugins = new Map<string, PluginInfo>();
  private activePlugins = new Set<string>();
  private eventListeners = new Map<string, Set<(...args: any[]) => void>>();

  /**
   * Register a plugin
   */
  register(plugin: BasePlugin): void {
    const info: PluginInfo = {
      id: plugin.id,
      name: plugin.name,
      version: plugin.version,
      type: plugin.type,
      status: PLUGIN_STATUS.INACTIVE,
      instance: plugin,
      dependencies: plugin.dependencies || [],
      config: plugin.getConfig()
    };

    this.plugins.set(plugin.id, info);
    this.emit('plugin:registered', info);
  }

  /**
   * Unregister a plugin
   */
  unregister(pluginId: string): void {
    const plugin = this.plugins.get(pluginId);
    if (plugin) {
      if (this.activePlugins.has(pluginId)) {
        this.deactivate(pluginId);
      }
      this.plugins.delete(pluginId);
      this.emit('plugin:unregistered', plugin);
    }
  }

  /**
   * Activate a plugin
   */
  async activate(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin || !plugin.instance) {
      throw new Error(`Plugin ${pluginId} not found`);
    }

    if (this.activePlugins.has(pluginId)) {
      return; // Already active
    }

    // Check dependencies
    if (plugin.dependencies) {
      for (const depId of plugin.dependencies) {
        if (!this.activePlugins.has(depId)) {
          throw new Error(`Dependency ${depId} not active for plugin ${pluginId}`);
        }
      }
    }

    try {
      plugin.status = PLUGIN_STATUS.INITIALIZING;
      await plugin.instance.initialize();
      plugin.status = PLUGIN_STATUS.ACTIVE;
      this.activePlugins.add(pluginId);
      this.emit('plugin:activated', plugin);
    } catch (error) {
      plugin.status = PLUGIN_STATUS.ERROR;
      this.emit('plugin:error', { plugin, error });
      throw error;
    }
  }

  /**
   * Deactivate a plugin
   */
  async deactivate(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin || !plugin.instance) {
      return;
    }

    if (!this.activePlugins.has(pluginId)) {
      return; // Already inactive
    }

    try {
      plugin.status = PLUGIN_STATUS.DESTROYING;
      await plugin.instance.destroy();
      plugin.status = PLUGIN_STATUS.INACTIVE;
      this.activePlugins.delete(pluginId);
      this.emit('plugin:deactivated', plugin);
    } catch (error) {
      plugin.status = PLUGIN_STATUS.ERROR;
      this.emit('plugin:error', { plugin, error });
      throw error;
    }
  }

  /**
   * Get plugin information
   */
  getPlugin(pluginId: string): PluginInfo | undefined {
    return this.plugins.get(pluginId);
  }

  /**
   * Get all plugins
   */
  getAllPlugins(): PluginInfo[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Get plugins by type
   */
  getPluginsByType(type: string): PluginInfo[] {
    return Array.from(this.plugins.values()).filter(p => p.type === type);
  }

  /**
   * Get active plugins
   */
  getActivePlugins(): PluginInfo[] {
    return Array.from(this.plugins.values()).filter(p => 
      this.activePlugins.has(p.id)
    );
  }

  /**
   * Check if plugin is active
   */
  isActive(pluginId: string): boolean {
    return this.activePlugins.has(pluginId);
  }

  /**
   * Activate all plugins of a specific type
   */
  async activateByType(type: string): Promise<void> {
    const plugins = this.getPluginsByType(type);
    for (const plugin of plugins) {
      try {
        await this.activate(plugin.id);
      } catch (error) {
        console.error(`Failed to activate plugin ${plugin.id}:`, error);
      }
    }
  }

  /**
   * Deactivate all plugins of a specific type
   */
  async deactivateByType(type: string): Promise<void> {
    const plugins = this.getPluginsByType(type);
    for (const plugin of plugins) {
      try {
        await this.deactivate(plugin.id);
      } catch (error) {
        console.error(`Failed to deactivate plugin ${plugin.id}:`, error);
      }
    }
  }

  /**
   * Event system
   */
  on(event: string, listener: (...args: any[]) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(listener);
  }

  off(event: string, listener: (...args: any[]) => void): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(listener);
    }
  }

  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Shutdown all plugins
   */
  async shutdown(): Promise<void> {
    const activePluginIds = Array.from(this.activePlugins);
    for (const pluginId of activePluginIds) {
      try {
        await this.deactivate(pluginId);
      } catch (error) {
        console.error(`Error shutting down plugin ${pluginId}:`, error);
      }
    }
  }
}
