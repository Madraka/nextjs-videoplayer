export interface DrmSystemConfiguration {
  keySystem: string;
  licenseServerUrl?: string;
  headers?: Record<string, string>;
  audioCapabilities?: MediaKeySystemMediaCapability[];
  videoCapabilities?: MediaKeySystemMediaCapability[];
  initDataTypes?: string[];
  persistentState?: MediaKeysRequirement;
  distinctiveIdentifier?: MediaKeysRequirement;
  sessionTypes?: MediaKeySessionType[];
}

export interface DrmConfiguration {
  enabled: boolean;
  systems: DrmSystemConfiguration[];
}
