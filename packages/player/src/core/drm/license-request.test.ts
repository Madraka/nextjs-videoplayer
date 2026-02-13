import { describe, expect, it, vi } from 'vitest';

import { createTokenLicenseRequestHandler } from '@/core/drm/license-request';
import type { DrmLicenseRequestContext } from '@/core/drm/types';

const createContext = (): DrmLicenseRequestContext => {
  return {
    keySystem: 'com.widevine.alpha',
    licenseServerUrl: 'https://license.example.com',
    headers: {
      'X-App': 'video-player',
    },
    message: Uint8Array.from([1, 2, 3]).buffer,
    session: {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      closed: Promise.resolve(),
      expiration: NaN,
      keyStatuses: {} as MediaKeyStatusMap,
      sessionId: 'session-1',
      generateRequest: vi.fn(async () => undefined),
      load: vi.fn(async () => false),
      remove: vi.fn(async () => undefined),
      update: vi.fn(async () => undefined),
    } as unknown as MediaKeySession,
    signal: new AbortController().signal,
  };
};

describe('createTokenLicenseRequestHandler', () => {
  it('sends bearer token and returns license response', async () => {
    const fetchSpy = vi.fn(async () => new Response(Uint8Array.from([9, 9]), { status: 200 }));

    const handler = createTokenLicenseRequestHandler({
      getToken: async () => 'token-1',
      fetch: fetchSpy,
    });

    const license = await handler(createContext());

    expect(license.byteLength).toBe(2);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://license.example.com',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer token-1',
          'X-App': 'video-player',
        }),
      })
    );
  });

  it('refreshes token after 401 and retries once', async () => {
    const fetchSpy = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(new Response(Uint8Array.from([7, 7, 7]), { status: 200 }));

    const handler = createTokenLicenseRequestHandler({
      getToken: async () => 'expired-token',
      refreshToken: async () => 'fresh-token',
      fetch: fetchSpy,
    });

    const license = await handler(createContext());

    expect(license.byteLength).toBe(3);
    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(fetchSpy.mock.calls[0]?.[1]).toEqual(
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer expired-token',
        }),
      })
    );
    expect(fetchSpy.mock.calls[1]?.[1]).toEqual(
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer fresh-token',
        }),
      })
    );
  });

  it('throws when license endpoint stays non-ok', async () => {
    const fetchSpy = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(new Response(null, { status: 403 }));

    const handler = createTokenLicenseRequestHandler({
      getToken: async () => 'expired-token',
      refreshToken: async () => 'fresh-token',
      fetch: fetchSpy,
    });

    await expect(handler(createContext())).rejects.toThrow('License request failed with status 403');
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });
});
