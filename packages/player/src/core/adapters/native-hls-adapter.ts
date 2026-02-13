import type { AdapterLoadContext, StreamingAdapter } from '@/core/adapters/types';

class NativeHlsAdapter implements StreamingAdapter {
  readonly id = 'native';

  async load(context: AdapterLoadContext): Promise<void> {
    const { videoElement, src, signal } = context;
    this.assertNotAborted(signal);
    videoElement.src = src;

    await new Promise<void>((resolve, reject) => {
      const abortError = this.createAbortError();

      const onLoadedData = () => {
        cleanup();
        resolve();
      };

      const onError = () => {
        cleanup();
        reject(new Error('Failed to load native HLS stream'));
      };

      const onAbort = () => {
        cleanup();
        reject(abortError);
      };

      const cleanup = () => {
        videoElement.removeEventListener('loadeddata', onLoadedData);
        videoElement.removeEventListener('error', onError);
        signal?.removeEventListener('abort', onAbort);
      };

      if (signal?.aborted) {
        cleanup();
        reject(abortError);
        return;
      }

      videoElement.addEventListener('loadeddata', onLoadedData);
      videoElement.addEventListener('error', onError);
      signal?.addEventListener('abort', onAbort, { once: true });
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

  private assertNotAborted(signal?: AbortSignal): void {
    if (signal?.aborted) {
      throw this.createAbortError();
    }
  }

  private createAbortError(): Error {
    const error = new Error('NativeHlsAdapter.load() aborted');
    error.name = 'AbortError';
    return error;
  }
}

export const createNativeHlsAdapter = (): StreamingAdapter => {
  return new NativeHlsAdapter();
};
