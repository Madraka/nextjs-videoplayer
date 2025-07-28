/**
 * Keyboard Shortcuts Configuration
 * Defines default keyboard mappings for video player controls
 */

/**
 * Default keyboard shortcuts
 */
export const KEYBOARD_SHORTCUTS = {
  // Playback controls
  PLAY_PAUSE: {
    keys: ['Space', 'k', 'K'],
    description: 'Play/Pause video',
    action: 'playPause',
    preventDefault: true
  },
  
  // Seeking controls
  SEEK_BACKWARD_5: {
    keys: ['ArrowLeft'],
    description: 'Seek backward 5 seconds',
    action: 'seekBackward5',
    preventDefault: true
  },
  
  SEEK_FORWARD_5: {
    keys: ['ArrowRight'],
    description: 'Seek forward 5 seconds',
    action: 'seekForward5',
    preventDefault: true
  },
  
  SEEK_BACKWARD_10: {
    keys: ['j', 'J'],
    description: 'Seek backward 10 seconds',
    action: 'seekBackward10',
    preventDefault: true
  },
  
  SEEK_FORWARD_10: {
    keys: ['l', 'L'],
    description: 'Seek forward 10 seconds',
    action: 'seekForward10',
    preventDefault: true
  },
  
  SEEK_TO_BEGINNING: {
    keys: ['Home', '0'],
    description: 'Seek to beginning',
    action: 'seekToBeginning',
    preventDefault: true
  },
  
  SEEK_TO_END: {
    keys: ['End'],
    description: 'Seek to end',
    action: 'seekToEnd',
    preventDefault: true
  },
  
  // Volume controls
  VOLUME_UP: {
    keys: ['ArrowUp'],
    description: 'Increase volume',
    action: 'volumeUp',
    preventDefault: true
  },
  
  VOLUME_DOWN: {
    keys: ['ArrowDown'],
    description: 'Decrease volume',
    action: 'volumeDown',
    preventDefault: true
  },
  
  MUTE_TOGGLE: {
    keys: ['m', 'M'],
    description: 'Toggle mute',
    action: 'toggleMute',
    preventDefault: true
  },
  
  // Display controls
  FULLSCREEN_TOGGLE: {
    keys: ['f', 'F'],
    description: 'Toggle fullscreen',
    action: 'toggleFullscreen',
    preventDefault: true
  },
  
  PIP_TOGGLE: {
    keys: ['p', 'P'],
    description: 'Toggle Picture-in-Picture',
    action: 'togglePiP',
    preventDefault: true
  },
  
  // Playback rate controls
  PLAYBACK_RATE_INCREASE: {
    keys: ['+', '='],
    description: 'Increase playback rate',
    action: 'increasePlaybackRate',
    preventDefault: true
  },
  
  PLAYBACK_RATE_DECREASE: {
    keys: ['-', '_'],
    description: 'Decrease playback rate',
    action: 'decreasePlaybackRate',
    preventDefault: true
  },
  
  PLAYBACK_RATE_RESET: {
    keys: ['r', 'R'],
    description: 'Reset playback rate to normal',
    action: 'resetPlaybackRate',
    preventDefault: true
  },
  
  // Quality controls
  QUALITY_UP: {
    keys: ['Shift+ArrowUp'],
    description: 'Increase video quality',
    action: 'qualityUp',
    preventDefault: true
  },
  
  QUALITY_DOWN: {
    keys: ['Shift+ArrowDown'],
    description: 'Decrease video quality',
    action: 'qualityDown',
    preventDefault: true
  },
  
  // Subtitle controls
  SUBTITLE_TOGGLE: {
    keys: ['c', 'C'],
    description: 'Toggle subtitles',
    action: 'toggleSubtitles',
    preventDefault: true
  },
  
  // Numeric seek (percentage)
  SEEK_TO_10_PERCENT: {
    keys: ['1'],
    description: 'Seek to 10% of video',
    action: 'seekToPercent',
    value: 10,
    preventDefault: true
  },
  
  SEEK_TO_20_PERCENT: {
    keys: ['2'],
    description: 'Seek to 20% of video',
    action: 'seekToPercent',
    value: 20,
    preventDefault: true
  },
  
  SEEK_TO_30_PERCENT: {
    keys: ['3'],
    description: 'Seek to 30% of video',
    action: 'seekToPercent',
    value: 30,
    preventDefault: true
  },
  
  SEEK_TO_40_PERCENT: {
    keys: ['4'],
    description: 'Seek to 40% of video',
    action: 'seekToPercent',
    value: 40,
    preventDefault: true
  },
  
  SEEK_TO_50_PERCENT: {
    keys: ['5'],
    description: 'Seek to 50% of video',
    action: 'seekToPercent',
    value: 50,
    preventDefault: true
  },
  
  SEEK_TO_60_PERCENT: {
    keys: ['6'],
    description: 'Seek to 60% of video',
    action: 'seekToPercent',
    value: 60,
    preventDefault: true
  },
  
  SEEK_TO_70_PERCENT: {
    keys: ['7'],
    description: 'Seek to 70% of video',
    action: 'seekToPercent',
    value: 70,
    preventDefault: true
  },
  
  SEEK_TO_80_PERCENT: {
    keys: ['8'],
    description: 'Seek to 80% of video',
    action: 'seekToPercent',
    value: 80,
    preventDefault: true
  },
  
  SEEK_TO_90_PERCENT: {
    keys: ['9'],
    description: 'Seek to 90% of video',
    action: 'seekToPercent',
    value: 90,
    preventDefault: true
  }
} as const;

/**
 * Keyboard shortcut groups for help display
 */
export const SHORTCUT_GROUPS = {
  playback: {
    title: 'Playback Controls',
    shortcuts: [
      'PLAY_PAUSE',
      'SEEK_BACKWARD_5',
      'SEEK_FORWARD_5',
      'SEEK_BACKWARD_10',
      'SEEK_FORWARD_10',
      'SEEK_TO_BEGINNING',
      'SEEK_TO_END'
    ]
  },
  
  audio: {
    title: 'Audio Controls',
    shortcuts: [
      'VOLUME_UP',
      'VOLUME_DOWN',
      'MUTE_TOGGLE'
    ]
  },
  
  display: {
    title: 'Display Controls',
    shortcuts: [
      'FULLSCREEN_TOGGLE',
      'PIP_TOGGLE'
    ]
  },
  
  quality: {
    title: 'Quality & Rate',
    shortcuts: [
      'PLAYBACK_RATE_INCREASE',
      'PLAYBACK_RATE_DECREASE',
      'PLAYBACK_RATE_RESET',
      'QUALITY_UP',
      'QUALITY_DOWN'
    ]
  },
  
  navigation: {
    title: 'Quick Navigation',
    shortcuts: [
      'SEEK_TO_10_PERCENT',
      'SEEK_TO_20_PERCENT',
      'SEEK_TO_30_PERCENT',
      'SEEK_TO_40_PERCENT',
      'SEEK_TO_50_PERCENT',
      'SEEK_TO_60_PERCENT',
      'SEEK_TO_70_PERCENT',
      'SEEK_TO_80_PERCENT',
      'SEEK_TO_90_PERCENT'
    ]
  },
  
  accessibility: {
    title: 'Accessibility',
    shortcuts: [
      'SUBTITLE_TOGGLE'
    ]
  }
} as const;

/**
 * Default keyboard configuration
 */
export const KEYBOARD_CONFIG = {
  enabled: true,
  preventDefaultOnActive: true,
  enableInFullscreen: true,
  enableWhenFocused: true,
  enableGlobal: false,
  volumeStep: 0.1,        // 10% volume steps
  seekStep: 5,            // 5 second seek steps
  playbackRateStep: 0.25  // 0.25x playback rate steps
} as const;
