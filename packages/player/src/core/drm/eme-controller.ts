import type { DrmConfiguration, DrmSystemConfiguration } from '@/core/drm/types';
import { getPlayerLogger } from '@/lib/logger';

export interface EmeEnvironment {
  requestMediaKeySystemAccess: (
    keySystem: string,
    configurations: MediaKeySystemConfiguration[]
  ) => Promise<MediaKeySystemAccess>;
  fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
}

export interface EmeController {
  keySystem: string;
  destroy: () => void;
}

const resolveEnvironment = (environment?: Partial<EmeEnvironment>): EmeEnvironment => {
  const requestMediaKeySystemAccess =
    environment?.requestMediaKeySystemAccess ??
    (typeof navigator !== 'undefined' ? navigator.requestMediaKeySystemAccess?.bind(navigator) : undefined);

  if (!requestMediaKeySystemAccess) {
    throw new Error('Encrypted Media Extensions are not supported in this environment.');
  }

  const fetchFn = environment?.fetch ?? fetch;

  return {
    requestMediaKeySystemAccess,
    fetch: fetchFn,
  };
};

export const isEmeSupported = (environment?: Partial<EmeEnvironment>): boolean => {
  if (environment?.requestMediaKeySystemAccess) {
    return true;
  }

  return typeof navigator !== 'undefined' && typeof navigator.requestMediaKeySystemAccess === 'function';
};

const buildKeySystemConfiguration = (system: DrmSystemConfiguration): MediaKeySystemConfiguration => {
  return {
    initDataTypes: system.initDataTypes ?? ['cenc'],
    audioCapabilities: system.audioCapabilities ?? [{ contentType: 'audio/mp4; codecs="mp4a.40.2"' }],
    videoCapabilities: system.videoCapabilities ?? [{ contentType: 'video/mp4; codecs="avc1.42E01E"' }],
    persistentState: system.persistentState ?? 'optional',
    distinctiveIdentifier: system.distinctiveIdentifier ?? 'optional',
    sessionTypes: system.sessionTypes ?? ['temporary'],
  };
};

const withTimeout = async <T>(
  timeoutMs: number,
  run: (signal: AbortSignal) => Promise<T>
): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = globalThis.setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    return await run(controller.signal);
  } finally {
    globalThis.clearTimeout(timeoutId);
  }
};

const requestKeySystemAccess = async (
  systems: DrmSystemConfiguration[],
  environment: EmeEnvironment
): Promise<{ access: MediaKeySystemAccess; system: DrmSystemConfiguration }> => {
  const errors: Error[] = [];

  for (const system of systems) {
    try {
      const access = await environment.requestMediaKeySystemAccess(system.keySystem, [
        buildKeySystemConfiguration(system),
      ]);
      return { access, system };
    } catch (error) {
      errors.push(error as Error);
    }
  }

  const lastError = errors[errors.length - 1];
  throw new Error(`No configured DRM key system is supported. ${lastError ? `Last error: ${lastError.message}` : ''}`.trim());
};

export const createEmeController = async (
  videoElement: HTMLVideoElement,
  configuration: DrmConfiguration,
  environment?: Partial<EmeEnvironment>
): Promise<EmeController> => {
  if (!configuration.enabled) {
    throw new Error('DRM configuration is disabled.');
  }

  if (!configuration.systems || configuration.systems.length === 0) {
    throw new Error('DRM requires at least one key system configuration.');
  }

  const emeEnvironment = resolveEnvironment(environment);
  const requestTimeoutMs = configuration.requestTimeoutMs ?? 15000;
  const { access, system } = await requestKeySystemAccess(configuration.systems, emeEnvironment);
  const mediaKeys = await access.createMediaKeys();

  const onEncrypted = async (event: Event): Promise<void> => {
    const encryptedEvent = event as MediaEncryptedEvent;

    if (!encryptedEvent.initData) {
      return;
    }

    const session = mediaKeys.createSession('temporary');

    session.addEventListener('message', (sessionEvent: Event) => {
      void (async () => {
        const messageEvent = sessionEvent as MediaKeyMessageEvent;

        if (!system.licenseServerUrl) {
          throw new Error(`Missing licenseServerUrl for key system ${system.keySystem}`);
        }

        const license = await withTimeout(requestTimeoutMs, async (signal) => {
          if (configuration.licenseRequestHandler) {
            return configuration.licenseRequestHandler({
              keySystem: system.keySystem,
              licenseServerUrl: system.licenseServerUrl as string,
              headers: system.headers ?? {},
              message: messageEvent.message,
              session,
              signal,
            });
          }

          const response = await emeEnvironment.fetch(system.licenseServerUrl as string, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/octet-stream',
              ...(system.headers ?? {}),
            },
            body: messageEvent.message,
            signal,
          });

          if (!response.ok) {
            throw new Error(`License request failed with status ${response.status}`);
          }

          return response.arrayBuffer();
        });

        await session.update(license);
      })().catch((error) => {
        getPlayerLogger().warn('EME license exchange failed:', error);
      });
    });

    await session.generateRequest(encryptedEvent.initDataType, encryptedEvent.initData);
  };

  await videoElement.setMediaKeys(mediaKeys);
  videoElement.addEventListener('encrypted', onEncrypted as EventListener);

  return {
    keySystem: access.keySystem,
    destroy: () => {
      videoElement.removeEventListener('encrypted', onEncrypted as EventListener);
      void videoElement.setMediaKeys(null).catch(() => undefined);
    },
  };
};
