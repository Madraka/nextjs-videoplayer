import type {
  VideoEnginePlugin,
  VideoEnginePluginContext,
  VideoEnginePluginErrorPayload,
  VideoEnginePluginLoadPayload,
  VideoEnginePluginTimeUpdatePayload,
  VideoEnginePluginVolumePayload,
} from '@/core/plugins/types';

export class VideoEnginePluginManager {
  private readonly plugins: VideoEnginePlugin[];

  constructor(plugins: VideoEnginePlugin[] = []) {
    this.plugins = plugins;
  }

  setup(context: VideoEnginePluginContext): void {
    for (const plugin of this.plugins) {
      this.safeRun(plugin.name, 'setup', () => plugin.setup?.(context));
    }
  }

  onInit(): void {
    for (const plugin of this.plugins) {
      this.safeRun(plugin.name, 'onInit', () => plugin.onInit?.());
    }
  }

  onSourceLoadStart(payload: VideoEnginePluginLoadPayload): void {
    for (const plugin of this.plugins) {
      this.safeRun(plugin.name, 'onSourceLoadStart', () => plugin.onSourceLoadStart?.(payload));
    }
  }

  onSourceLoaded(payload: VideoEnginePluginLoadPayload): void {
    for (const plugin of this.plugins) {
      this.safeRun(plugin.name, 'onSourceLoaded', () => plugin.onSourceLoaded?.(payload));
    }
  }

  onPlay(): void {
    for (const plugin of this.plugins) {
      this.safeRun(plugin.name, 'onPlay', () => plugin.onPlay?.());
    }
  }

  onPause(): void {
    for (const plugin of this.plugins) {
      this.safeRun(plugin.name, 'onPause', () => plugin.onPause?.());
    }
  }

  onTimeUpdate(payload: VideoEnginePluginTimeUpdatePayload): void {
    for (const plugin of this.plugins) {
      this.safeRun(plugin.name, 'onTimeUpdate', () => plugin.onTimeUpdate?.(payload));
    }
  }

  onVolumeChange(payload: VideoEnginePluginVolumePayload): void {
    for (const plugin of this.plugins) {
      this.safeRun(plugin.name, 'onVolumeChange', () => plugin.onVolumeChange?.(payload));
    }
  }

  onQualityChange(quality: string): void {
    for (const plugin of this.plugins) {
      this.safeRun(plugin.name, 'onQualityChange', () => plugin.onQualityChange?.(quality));
    }
  }

  onError(payload: VideoEnginePluginErrorPayload): void {
    for (const plugin of this.plugins) {
      this.safeRun(plugin.name, 'onError', () => plugin.onError?.(payload));
    }
  }

  dispose(): void {
    for (const plugin of this.plugins) {
      this.safeRun(plugin.name, 'onDispose', () => plugin.onDispose?.());
    }
  }

  private safeRun(pluginName: string, lifecycle: string, run: () => void): void {
    try {
      run();
    } catch (error) {
      console.warn(`Plugin ${pluginName} failed during ${lifecycle}:`, error);
    }
  }
}
