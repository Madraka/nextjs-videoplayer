/**
 * Streaming Protocol Types
 * Types for different streaming technologies
 */

export interface HLSConfig {
  startLevel: number;
  maxBufferLength: number;
  maxMaxBufferLength: number;
  maxBufferSize: number;
  maxBufferHole: number;
  lowLatencyMode: boolean;
  backBufferLength: number;
  enableWorker: boolean;
  enableSoftwareAES: boolean;
}

export interface DASHConfig {
  streaming: {
    buffer: {
      bufferTimeAtTopQuality: number;
      bufferTimeAtTopQualityLongForm: number;
      initialBufferLevel: number;
      minBufferTime: number;
      stableBufferTime: number;
    };
    abr: {
      autoSwitchBitrate: {
        audio: boolean;
        video: boolean;
      };
      initialBitrate: {
        audio: number;
        video: number;
      };
    };
  };
}

export interface WebRTCConfig {
  iceServers: RTCIceServer[];
  iceTransportPolicy?: RTCIceTransportPolicy;
  bundlePolicy?: RTCBundlePolicy;
  rtcpMuxPolicy?: RTCRtcpMuxPolicy;
  iceCandidatePoolSize?: number;
}

export interface StreamingCapabilities {
  hls: boolean;
  dash: boolean;
  webrtc: boolean;
  mse: boolean;
  nativeHls: boolean;
  nativeDash: boolean;
}

export interface AdaptiveBitrateConfig {
  enabled: boolean;
  minBitrate: number;
  maxBitrate: number;
  startBitrate: number;
  switchUpBitrateThreshold: number;
  switchDownBitrateThreshold: number;
  bandwidthSafetyFactor: number;
}

export interface LiveStreamConfig {
  latencyMode: 'low' | 'normal' | 'ultra-low';
  maxLatency: number;
  targetLatency: number;
  playbackRate: number;
  catchupRate: number;
  fallbackRate: number;
}
