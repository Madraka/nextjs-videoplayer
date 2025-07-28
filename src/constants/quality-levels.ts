/**
 * Quality Level Definitions
 * Defines video quality levels and their characteristics
 */

/**
 * Standard quality level definitions
 */
export const QUALITY_LEVELS = {
  AUTO: {
    id: 'auto',
    label: 'Auto',
    height: 0,
    width: 0,
    bitrate: 0,
    isAuto: true,
    description: 'Automatically adjust quality based on network conditions'
  },
  
  UHD_4K: {
    id: '2160p',
    label: '4K UHD',
    height: 2160,
    width: 3840,
    bitrate: 20000,
    isAuto: false,
    description: '4K Ultra High Definition (2160p)'
  },
  
  QHD_2K: {
    id: '1440p',
    label: '2K QHD',
    height: 1440,
    width: 2560,
    bitrate: 10000,
    isAuto: false,
    description: 'Quad High Definition (1440p)'
  },
  
  FULL_HD: {
    id: '1080p',
    label: 'Full HD',
    height: 1080,
    width: 1920,
    bitrate: 5000,
    isAuto: false,
    description: 'Full High Definition (1080p)'
  },
  
  HD_READY: {
    id: '720p',
    label: 'HD',
    height: 720,
    width: 1280,
    bitrate: 2500,
    isAuto: false,
    description: 'High Definition (720p)'
  },
  
  STANDARD_DEF: {
    id: '480p',
    label: 'SD',
    height: 480,
    width: 854,
    bitrate: 1200,
    isAuto: false,
    description: 'Standard Definition (480p)'
  },
  
  LOW_DEF: {
    id: '360p',
    label: 'Low',
    height: 360,
    width: 640,
    bitrate: 800,
    isAuto: false,
    description: 'Low Definition (360p)'
  },
  
  VERY_LOW: {
    id: '240p',
    label: 'Very Low',
    height: 240,
    width: 426,
    bitrate: 400,
    isAuto: false,
    description: 'Very Low Definition (240p)'
  }
} as const;

/**
 * Quality level array for iteration
 */
export const QUALITY_LEVEL_LIST = [
  QUALITY_LEVELS.AUTO,
  QUALITY_LEVELS.UHD_4K,
  QUALITY_LEVELS.QHD_2K,
  QUALITY_LEVELS.FULL_HD,
  QUALITY_LEVELS.HD_READY,
  QUALITY_LEVELS.STANDARD_DEF,
  QUALITY_LEVELS.LOW_DEF,
  QUALITY_LEVELS.VERY_LOW
] as const;

/**
 * Quality selection rules based on screen size
 */
export const QUALITY_AUTO_SELECTION = {
  // Screen width thresholds for automatic quality selection
  thresholds: {
    mobile: 768,
    tablet: 1024,
    desktop: 1920,
    uhd: 3840
  },
  
  // Default quality by device type
  defaults: {
    mobile: '480p',
    tablet: '720p',
    desktop: '1080p',
    uhd: '2160p'
  },
  
  // Network-based quality limits
  networkLimits: {
    slow: '360p',      // < 1 Mbps
    medium: '720p',    // 1-5 Mbps
    fast: '1080p',     // 5-20 Mbps
    ultra: '2160p'     // > 20 Mbps
  }
} as const;

/**
 * Quality switching configurations
 */
export const QUALITY_SWITCHING = {
  // ABR (Adaptive Bitrate) settings
  abr: {
    enabledByDefault: true,
    switchThreshold: 0.8,      // Switch when buffer < 80%
    upSwitchDelay: 3000,       // 3 seconds before switching up
    downSwitchDelay: 1000,     // 1 second before switching down
    maxSwitchesPerMinute: 5
  },
  
  // Manual quality switching
  manual: {
    smoothTransition: true,
    preservePosition: true,
    bufferTime: 2.0            // 2 seconds of buffer before switch
  }
} as const;

/**
 * Playback rate options
 */
export const PLAYBACK_RATES = [
  { value: 0.25, label: '0.25x' },
  { value: 0.5, label: '0.5x' },
  { value: 0.75, label: '0.75x' },
  { value: 1.0, label: 'Normal' },
  { value: 1.25, label: '1.25x' },
  { value: 1.5, label: '1.5x' },
  { value: 1.75, label: '1.75x' },
  { value: 2.0, label: '2x' }
] as const;
