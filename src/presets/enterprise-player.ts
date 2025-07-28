/**
 * Enterprise Player Preset
 * Secure, professional video player for business use
 */

import type { PlayerConfig } from '../types/player';
import { DEFAULT_PLAYER_CONFIG } from '../constants/player-defaults';

export const ENTERPRISE_PLAYER_PRESET: PlayerConfig = {
  ...DEFAULT_PLAYER_CONFIG,
  
  // Professional controls
  controls: true,
  showProgressBar: true,
  showVolumeControl: true,
  showFullscreenButton: true,
  showPlaybackRate: true,
  showQualitySelector: true,
  
  // Enterprise quality settings
  defaultQuality: 'auto',
  adaptiveStreaming: true,
  
  // Mobile enterprise support
  enableGestures: true,
  showMobileControls: true,
  
  // Accessibility compliance
  enableKeyboardShortcuts: true,
  enableScreenReader: true,
  announcePlayState: true,
  
  // Enterprise analytics
  enableAnalytics: true
};

/**
 * Enterprise theme configuration
 */
export const ENTERPRISE_THEME = {
  primaryColor: '#0078d4', // Microsoft blue
  backgroundColor: '#000000',
  controlsColor: '#ffffff',
  accentColor: '#0078d4',
  progressColor: '#0078d4',
  bufferColor: '#666666',
  professionalDesign: true,
  corporateBranding: true
} as const;

/**
 * Enterprise security features
 */
export const ENTERPRISE_SECURITY = {
  // DRM and content protection
  drmEnabled: true,
  supportedDrmSystems: ['widevine', 'playready', 'fairplay'],
  tokenAuthentication: true,
  domainRestriction: true,
  
  // Access controls
  userAuthentication: 'required',
  roleBasedAccess: true,
  timeBasedAccess: true,
  deviceLimit: true,
  
  // Content security
  watermarking: true,
  screenRecordingPrevention: true,
  downloadPrevention: true,
  rightClickDisabled: true,
  
  // Network security
  httpsRequired: true,
  corsConfigured: true,
  tokenValidation: true,
  
  // Audit and compliance
  accessLogging: true,
  viewingAudit: true,
  complianceReporting: true,
  gdprCompliant: true
} as const;

/**
 * Enterprise features configuration
 */
export const ENTERPRISE_FEATURES = {
  // Business features
  brandingCustomization: true,
  logoOverlay: true,
  customColors: true,
  whiteLabeling: true,
  
  // Integration capabilities
  ssoIntegration: true,
  ldapIntegration: true,
  apiAccess: true,
  webhookSupport: true,
  
  // Content management
  bulkUpload: true,
  contentScheduling: true,
  autoTranscoding: true,
  cdnIntegration: true,
  
  // Analytics and reporting
  detailedAnalytics: true,
  customReports: true,
  realTimeMonitoring: true,
  exportCapabilities: true,
  
  // Collaboration
  commentingSystem: false, // Usually disabled for security
  sharingControls: 'restricted',
  teamManagement: true
} as const;

/**
 * Enterprise keyboard shortcuts
 */
export const ENTERPRISE_SHORTCUTS = {
  // Standard controls
  spacebar: 'playPause',
  arrowLeft: 'seekBackward5',
  arrowRight: 'seekForward5',
  arrowUp: 'volumeUp',
  arrowDown: 'volumeDown',
  m: 'toggleMute',
  f: 'toggleFullscreen',
  
  // Enterprise-specific
  c: 'toggleCaptions',
  i: 'showInfo',
  h: 'showHelp',
  
  // Speed controls for training content
  minus: 'decreaseSpeed',
  plus: 'increaseSpeed',
  r: 'resetSpeed'
} as const;

/**
 * Enterprise compliance configuration
 */
export const ENTERPRISE_COMPLIANCE = {
  // Accessibility compliance
  wcagLevel: 'AA',
  section508Compliant: true,
  adaCompliant: true,
  
  // Privacy compliance
  gdprCompliant: true,
  ccpaCompliant: true,
  hipaaCompliant: false, // Configurable
  
  // Security standards
  iso27001: true,
  soc2Type2: true,
  
  // Content standards
  contentFiltering: true,
  appropriatenessCheck: true,
  
  // Data retention
  automaticDeletion: true,
  retentionPolicies: true,
  dataLocalization: true
} as const;
