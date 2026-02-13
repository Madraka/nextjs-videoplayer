import { describe, expect, it, vi } from 'vitest';

import type { StreamingAdapter, StreamingAdapterFactory } from '@/core/adapters/types';
import type { BrowserCapabilities } from '@/core/compatibility';
import { VideoEngine } from '@/core/video-engine';

const testCapabilities: BrowserCapabilities = {
  hasNativeHls: false,
  hasHlsJs: true,
  hasDashJs: true,
  isMobile: false,
  isIOS: false,
  isAndroid: false,
  supportsInlinePlayback: true,
  supportsAutoplay: true,
  supportsPictureInPicture: true,
};

const createPassThroughFactory = (): StreamingAdapterFactory => ({
  id: 'test-adapter',
  priority: 1000,
  canHandle: () => true,
  create: () =>
    ({
      id: 'test-adapter',
      load: async ({ src, videoElement }) => {
        videoElement.src = src;
      },
      destroy: () => undefined,
      getQualityLevels: () => [],
      setQuality: () => undefined,
    }) as StreamingAdapter,
});

describe('VideoEngine DRM', () => {
  it('initializes DRM session before source load', async () => {
    const videoElement = document.createElement('video') as HTMLVideoElement & {
      setMediaKeys: (keys: MediaKeys | null) => Promise<void>;
    };

    const fakeSession = {
      addEventListener: vi.fn(),
      generateRequest: vi.fn(async () => undefined),
      update: vi.fn(async () => undefined),
    } as unknown as MediaKeySession;

    const fakeMediaKeys = {
      createSession: vi.fn(() => fakeSession),
    } as unknown as MediaKeys;

    const fakeAccess = {
      keySystem: 'com.widevine.alpha',
      createMediaKeys: vi.fn(async () => fakeMediaKeys),
    } as unknown as MediaKeySystemAccess;

    videoElement.setMediaKeys = vi.fn(async () => undefined);

    const requestMediaKeySystemAccess = vi.fn(async () => fakeAccess);

    const engine = new VideoEngine(
      videoElement,
      {},
      {
        capabilitiesResolver: async () => testCapabilities,
        emeEnvironment: {
          requestMediaKeySystemAccess,
          fetch: vi.fn(),
        },
        adapters: [createPassThroughFactory()],
      }
    );

    await engine.loadSource({
      src: 'https://cdn.example.com/video.mp4',
      drm: {
        enabled: true,
        systems: [
          {
            keySystem: 'com.widevine.alpha',
            licenseServerUrl: 'https://license.example.com',
          },
        ],
      },
    });

    expect(requestMediaKeySystemAccess).toHaveBeenCalledTimes(1);
    expect(videoElement.setMediaKeys).toHaveBeenCalledWith(fakeMediaKeys);
  });

  it('surfaces DRM initialization errors', async () => {
    const onError = vi.fn();

    const videoElement = document.createElement('video') as HTMLVideoElement & {
      setMediaKeys: (keys: MediaKeys | null) => Promise<void>;
    };

    videoElement.setMediaKeys = vi.fn(async () => undefined);

    const engine = new VideoEngine(
      videoElement,
      {
        onError,
      },
      {
        capabilitiesResolver: async () => testCapabilities,
        emeEnvironment: {
          requestMediaKeySystemAccess: vi.fn(async () => {
            throw new Error('unsupported');
          }),
          fetch: vi.fn(),
        },
        adapters: [createPassThroughFactory()],
      }
    );

    await expect(
      engine.loadSource({
        src: 'https://cdn.example.com/video.mp4',
        drm: {
          enabled: true,
          systems: [
            {
              keySystem: 'com.widevine.alpha',
              licenseServerUrl: 'https://license.example.com',
            },
          ],
        },
      })
    ).rejects.toThrow('Failed to initialize DRM');

    expect(onError).toHaveBeenCalledTimes(1);
  });
});
