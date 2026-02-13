import { isVideoFormatSupported } from '@/core/compatibility';
import type { AdapterLoadContext, StreamingAdapter } from '@/core/adapters/types';

class DirectVideoAdapter implements StreamingAdapter {
  readonly id = 'direct';

  async load(context: AdapterLoadContext): Promise<void> {
    const { videoElement, src, signal } = context;

    if (!isVideoFormatSupported(src)) {
      throw new Error('Video format not supported by this browser');
    }

    this.assertNotAborted(signal);
    videoElement.src = src;

    await new Promise<void>((resolve, reject) => {
      const abortError = this.createAbortError();
      const timeout = window.setTimeout(() => {
        cleanup();
        reject(new Error('Video loading timeout (30s)'));
      }, 30000);

      const onLoadedData = () => {
        cleanup();
        resolve();
      };

      const onError = () => {
        const error = videoElement.error;
        const message = error?.message || 'Failed to load direct video file';
        cleanup();
        reject(new Error(message));
      };

      const onAbort = () => {
        cleanup();
        reject(abortError);
      };

      const cleanup = () => {
        window.clearTimeout(timeout);
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
      videoElement.load();
    });
  }

  destroy(): void {
    // Direct video playback does not have extra runtime resources.
  }

  getQualityLevels() {
    return [];
  }

  setQuality(): void {
    // Direct source quality selection is not supported.
  }

  private assertNotAborted(signal?: AbortSignal): void {
    if (signal?.aborted) {
      throw this.createAbortError();
    }
  }

  private createAbortError(): Error {
    const error = new Error('DirectVideoAdapter.load() aborted');
    error.name = 'AbortError';
    return error;
  }
}

export const createDirectVideoAdapter = (): StreamingAdapter => {
  return new DirectVideoAdapter();
};
