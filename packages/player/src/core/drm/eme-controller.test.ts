import { describe, expect, it, vi } from 'vitest';

import { createEmeController, isEmeSupported } from '@/core/drm/eme-controller';
import type { DrmConfiguration } from '@/core/drm/types';

const baseDrmConfig: DrmConfiguration = {
  enabled: true,
  systems: [
    {
      keySystem: 'com.widevine.alpha',
      licenseServerUrl: 'https://license.example.com',
    },
  ],
};

describe('EME controller', () => {
  it('creates media keys for the first supported key system', async () => {
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

    const requestMediaKeySystemAccess = vi.fn(async (keySystem: string) => {
      if (keySystem === 'com.widevine.alpha') {
        return fakeAccess;
      }

      throw new Error('unsupported');
    });

    const controller = await createEmeController(videoElement, baseDrmConfig, {
      requestMediaKeySystemAccess,
      fetch: vi.fn(),
    });

    expect(controller.keySystem).toBe('com.widevine.alpha');
    expect(requestMediaKeySystemAccess).toHaveBeenCalledTimes(1);
    expect(videoElement.setMediaKeys).toHaveBeenCalledWith(fakeMediaKeys);

    controller.destroy();
    expect(videoElement.setMediaKeys).toHaveBeenCalledWith(null);
  });

  it('throws when no key system is supported', async () => {
    const videoElement = document.createElement('video') as HTMLVideoElement & {
      setMediaKeys: (keys: MediaKeys | null) => Promise<void>;
    };

    videoElement.setMediaKeys = vi.fn(async () => undefined);

    await expect(
      createEmeController(videoElement, baseDrmConfig, {
        requestMediaKeySystemAccess: vi.fn(async () => {
          throw new Error('not supported');
        }),
        fetch: vi.fn(),
      })
    ).rejects.toThrow('No configured DRM key system is supported');
  });

  it('detects EME support from provided environment', () => {
    expect(
      isEmeSupported({
        requestMediaKeySystemAccess: vi.fn(),
      })
    ).toBe(true);
  });
});
