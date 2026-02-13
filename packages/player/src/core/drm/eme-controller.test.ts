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

  it('uses custom licenseRequestHandler when encrypted message arrives', async () => {
    const videoElement = document.createElement('video') as HTMLVideoElement & {
      setMediaKeys: (keys: MediaKeys | null) => Promise<void>;
    };

    let encryptedListener: EventListener | undefined;
    vi.spyOn(videoElement, 'addEventListener').mockImplementation((type, listener, options) => {
      if (type === 'encrypted') {
        encryptedListener = listener as EventListener;
      }
      EventTarget.prototype.addEventListener.call(videoElement, type, listener as EventListener, options as AddEventListenerOptions);
    });

    const fakeLicense = Uint8Array.from([9, 9, 9]).buffer;
    const customLicenseHandler = vi.fn(async () => fakeLicense);
    const fetchSpy = vi.fn();

    let messageListener: ((event: Event) => void) | undefined;
    const updateSpy = vi.fn(async () => undefined);
    const fakeSession = {
      addEventListener: vi.fn((type: string, cb: (event: Event) => void) => {
        if (type === 'message') {
          messageListener = cb;
        }
      }),
      generateRequest: vi.fn(async () => undefined),
      update: updateSpy,
    } as unknown as MediaKeySession;

    const fakeMediaKeys = {
      createSession: vi.fn(() => fakeSession),
    } as unknown as MediaKeys;

    const fakeAccess = {
      keySystem: 'com.widevine.alpha',
      createMediaKeys: vi.fn(async () => fakeMediaKeys),
    } as unknown as MediaKeySystemAccess;

    videoElement.setMediaKeys = vi.fn(async () => undefined);

    await createEmeController(
      videoElement,
      {
        ...baseDrmConfig,
        licenseRequestHandler: customLicenseHandler,
      },
      {
        requestMediaKeySystemAccess: vi.fn(async () => fakeAccess),
        fetch: fetchSpy,
      }
    );

    await (encryptedListener as EventListener)({
      initDataType: 'cenc',
      initData: Uint8Array.from([1, 2, 3]).buffer,
    } as unknown as Event);

    messageListener?.({
      message: Uint8Array.from([4, 5, 6]).buffer,
    } as unknown as Event);

    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
    await Promise.resolve();

    expect(customLicenseHandler).toHaveBeenCalledTimes(1);
    expect(updateSpy).toHaveBeenCalledWith(fakeLicense);

    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
