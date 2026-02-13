import type { AdapterLoadContext, StreamingAdapter } from '@/core/adapters/types';

class NativeHlsAdapter implements StreamingAdapter {
  readonly id = 'native';

  async load(context: AdapterLoadContext): Promise<void> {
    const { videoElement, src } = context;
    videoElement.src = src;

    await new Promise<void>((resolve, reject) => {
      const onLoadedData = () => {
        cleanup();
        resolve();
      };

      const onError = () => {
        cleanup();
        reject(new Error('Failed to load native HLS stream'));
      };

      const cleanup = () => {
        videoElement.removeEventListener('loadeddata', onLoadedData);
        videoElement.removeEventListener('error', onError);
      };

      videoElement.addEventListener('loadeddata', onLoadedData);
      videoElement.addEventListener('error', onError);
    });
  }

  destroy(): void {
    // Native playback does not have extra runtime resources.
  }

  getQualityLevels() {
    return [];
  }

  setQuality(): void {
    // Native HLS quality is browser-managed.
  }
}

export const createNativeHlsAdapter = (): StreamingAdapter => {
  return new NativeHlsAdapter();
};
