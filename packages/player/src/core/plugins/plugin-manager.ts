import type {
  VideoEnginePluginFailoverPayload,
  VideoEnginePlugin,
  VideoEnginePluginContext,
  VideoEnginePluginErrorPayload,
  VideoEnginePluginLoadPayload,
  VideoEnginePluginRetryPayload,
  VideoEnginePluginSourceLoadFailedPayload,
  VideoEnginePluginTimeUpdatePayload,
  VideoEnginePluginVolumePayload,
} from '@/core/plugins/types';
import { getPlayerLogger } from '@/lib/logger';

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

  onSourceLoadFailed(payload: VideoEnginePluginSourceLoadFailedPayload): void {
    for (const plugin of this.plugins) {
      this.safeRun(plugin.name, 'onSourceLoadFailed', () => plugin.onSourceLoadFailed?.(payload));
    }
  }

  onRetry(payload: VideoEnginePluginRetryPayload): void {
    for (const plugin of this.plugins) {
      this.safeRun(plugin.name, 'onRetry', () => plugin.onRetry?.(payload));
    }
  }

  onFailover(payload: VideoEnginePluginFailoverPayload): void {
    for (const plugin of this.plugins) {
      this.safeRun(plugin.name, 'onFailover', () => plugin.onFailover?.(payload));
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
      getPlayerLogger().warn(`Plugin ${pluginName} failed during ${lifecycle}:`, error);
    }
  }
}
