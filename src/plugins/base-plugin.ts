/**
 * Base Plugin Interface
 * Abstract base class for all video player plugins
 */

export interface PluginConfig {
  [key: string]: any;
}

export interface PluginMetadata {
  id: string;
  name: string;
  version: string;
  type: string;
  description?: string;
  author?: string;
  dependencies?: string[];
}

export abstract class BasePlugin {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly version: string;
  abstract readonly type: string;
  
  protected config: PluginConfig = {};
  protected isInitialized = false;
  protected eventListeners = new Map<string, Set<(...args: any[]) => void>>();

  constructor(config?: PluginConfig) {
    if (config) {
      this.config = { ...config };
    }
  }

  /**
   * Plugin dependencies (optional)
   */
  get dependencies(): string[] {
    return [];
  }

  /**
   * Get plugin metadata
   */
  getMetadata(): PluginMetadata {
    return {
      id: this.id,
      name: this.name,
      version: this.version,
      type: this.type,
      dependencies: this.dependencies
    };
  }

  /**
   * Get plugin configuration
   */
  getConfig(): PluginConfig {
    return { ...this.config };
  }

  /**
   * Update plugin configuration
   */
  updateConfig(newConfig: Partial<PluginConfig>): void {
    this.config = { ...this.config, ...newConfig };
    if (this.isInitialized) {
      this.onConfigUpdate(newConfig);
    }
  }

  /**
   * Initialize plugin - must be implemented by subclasses
   */
  abstract initialize(): Promise<void>;

  /**
   * Destroy plugin - must be implemented by subclasses
   */
  abstract destroy(): Promise<void>;

  /**
   * Handle configuration updates (optional override)
   */
  protected onConfigUpdate(newConfig: Partial<PluginConfig>): void {
    // Override in subclasses if needed
  }

  /**
   * Event system for plugin communication
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

  protected emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error(`Error in plugin ${this.id} event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Check if plugin is initialized
   */
  get initialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Validate plugin configuration (optional override)
   */
  protected validateConfig(): boolean {
    return true;
  }

  /**
   * Get plugin status information
   */
  getStatus() {
    return {
      id: this.id,
      name: this.name,
      version: this.version,
      type: this.type,
      initialized: this.isInitialized,
      config: this.getConfig()
    };
  }
}
