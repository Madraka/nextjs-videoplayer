import type { DrmLicenseRequestContext, DrmLicenseRequestHandler } from '@/core/drm/types';

export interface TokenLicenseRequestHandlerOptions {
  getToken: () => Promise<string>;
  refreshToken?: () => Promise<string>;
  headerName?: string;
  fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
}

export const createTokenLicenseRequestHandler = (
  options: TokenLicenseRequestHandlerOptions
): DrmLicenseRequestHandler => {
  const {
    getToken,
    refreshToken,
    headerName = 'Authorization',
    fetch: fetchFn = fetch,
  } = options;

  const buildHeaders = (contextHeaders: Record<string, string>, token: string): Record<string, string> => {
    const tokenValue = headerName.toLowerCase() === 'authorization' ? `Bearer ${token}` : token;
    return {
      'Content-Type': 'application/octet-stream',
      ...contextHeaders,
      [headerName]: tokenValue,
    };
  };

  const requestLicense = async (
    context: DrmLicenseRequestContext,
    token: string
  ): Promise<Response> => {
    return fetchFn(context.licenseServerUrl, {
      method: 'POST',
      headers: buildHeaders(context.headers, token),
      body: context.message,
      signal: context.signal,
    });
  };

  return async (context: DrmLicenseRequestContext): Promise<ArrayBuffer> => {
    let token = await getToken();
    let response = await requestLicense(context, token);

    if (response.status === 401 && refreshToken) {
      token = await refreshToken();
      response = await requestLicense(context, token);
    }

    if (!response.ok) {
      throw new Error(`License request failed with status ${response.status}`);
    }

    return response.arrayBuffer();
  };
};
