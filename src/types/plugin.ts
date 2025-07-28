/**
 * Plugin System Types
 * Types for the plugin architecture
 */

export interface PluginConfig {
  name: string;
  version: string;
  enabled: boolean;
  priority: number;
  dependencies?: string[];
  options?: Record<string, unknown>;
}

export interface PluginContext {
  player: any; // Will be properly typed later
  engine: any; // Will be properly typed later
  emit: (event: string, data?: unknown) => void;
  on: (event: string, handler: (data?: unknown) => void) => void;
  off: (event: string, handler: (data?: unknown) => void) => void;
}

export interface PluginInterface {
  name: string;
  version: string;
  initialize: (context: PluginContext) => Promise<void>;
  destroy: () => Promise<void>;
  configure?: (options: Record<string, unknown>) => void;
  getInfo?: () => PluginInfo;
}

export interface PluginInfo {
  name: string;
  version: string;
  description: string;
  author: string;
  license: string;
  homepage?: string;
  repository?: string;
  keywords?: string[];
}

export interface PluginRegistry {
  register: (plugin: PluginInterface) => void;
  unregister: (name: string) => void;
  get: (name: string) => PluginInterface | undefined;
  list: () => PluginInterface[];
  enable: (name: string) => Promise<void>;
  disable: (name: string) => Promise<void>;
}

export interface PluginEvent {
  type: string;
  plugin: string;
  timestamp: number;
  data?: unknown;
}

export type PluginHook = 'beforePlay' | 'afterPlay' | 'beforePause' | 'afterPause' | 
                        'beforeSeek' | 'afterSeek' | 'onError' | 'onQualityChange' |
                        'onVolumeChange' | 'onFullscreenChange' | 'onLoad' | 'onUnload';
