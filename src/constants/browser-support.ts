/**
 * Browser Support Matrix
 * Defines browser compatibility for video formats and features
 */

/**
 * Video format support by browser
 */
export const BROWSER_VIDEO_SUPPORT = {
  chrome: {
    mp4: true,
    webm: true,
    ogg: false,
    hls: false,    // Requires hls.js
    dash: false,   // Requires dash.js
    av1: true,     // Recent versions
    hdr: true
  },
  
  firefox: {
    mp4: true,
    webm: true,
    ogg: true,
    hls: false,    // Requires hls.js
    dash: false,   // Requires dash.js
    av1: true,     // Recent versions
    hdr: false
  },
  
  safari: {
    mp4: true,
    webm: false,   // Limited support
    ogg: false,
    hls: true,     // Native support
    dash: false,   // Requires dash.js
    av1: false,    // Limited support
    hdr: true
  },
  
  edge: {
    mp4: true,
    webm: true,
    ogg: false,
    hls: false,    // Requires hls.js
    dash: false,   // Requires dash.js
    av1: true,     // Recent versions
    hdr: true
  },
  
  ios_safari: {
    mp4: true,
    webm: false,
    ogg: false,
    hls: true,     // Native support
    dash: false,
    av1: false,
    hdr: true
  },
  
  android_chrome: {
    mp4: true,
    webm: true,
    ogg: false,
    hls: false,    // Requires hls.js
    dash: false,   // Requires dash.js
    av1: true,     // Recent versions
    hdr: false
  }
} as const;

/**
 * Feature support by browser
 */
export const BROWSER_FEATURE_SUPPORT = {
  chrome: {
    fullscreen: true,
    pip: true,
    mediaSession: true,
    backgroundPlayback: false,
    autoplay: 'user-gesture',
    webgl: true,
    webassembly: true
  },
  
  firefox: {
    fullscreen: true,
    pip: true,
    mediaSession: true,
    backgroundPlayback: false,
    autoplay: 'user-gesture',
    webgl: true,
    webassembly: true
  },
  
  safari: {
    fullscreen: true,
    pip: true,
    mediaSession: true,
    backgroundPlayback: false,
    autoplay: 'restricted',
    webgl: true,
    webassembly: true
  },
  
  edge: {
    fullscreen: true,
    pip: true,
    mediaSession: true,
    backgroundPlayback: false,
    autoplay: 'user-gesture',
    webgl: true,
    webassembly: true
  },
  
  ios_safari: {
    fullscreen: false,  // Limited fullscreen
    pip: true,
    mediaSession: true,
    backgroundPlayback: false,
    autoplay: 'never',
    webgl: true,
    webassembly: true
  },
  
  android_chrome: {
    fullscreen: true,
    pip: false,    // Limited support
    mediaSession: true,
    backgroundPlayback: false,
    autoplay: 'user-gesture',
    webgl: true,
    webassembly: true
  }
} as const;

/**
 * Minimum browser versions for full support
 */
export const MINIMUM_BROWSER_VERSIONS = {
  chrome: 80,
  firefox: 75,
  safari: 13,
  edge: 80,
  ios_safari: 13,
  android_chrome: 80
} as const;

/**
 * Browser detection patterns
 */
export const BROWSER_DETECTION = {
  chrome: /Chrome\/(\d+)/,
  firefox: /Firefox\/(\d+)/,
  safari: /Version\/(\d+).*Safari/,
  edge: /Edg\/(\d+)/,
  ios_safari: /OS (\d+)_(\d+).*Safari/,
  android_chrome: /Android.*Chrome\/(\d+)/,
  opera: /Opera\/(\d+)/,
  samsung: /SamsungBrowser\/(\d+)/
} as const;

/**
 * Codec support matrix
 */
export const CODEC_SUPPORT = {
  h264: {
    chrome: true,
    firefox: true,
    safari: true,
    edge: true,
    ios_safari: true,
    android_chrome: true
  },
  
  h265: {
    chrome: false,   // Hardware dependent
    firefox: false,
    safari: true,
    edge: false,     // Hardware dependent
    ios_safari: true,
    android_chrome: false
  },
  
  vp8: {
    chrome: true,
    firefox: true,
    safari: false,
    edge: true,
    ios_safari: false,
    android_chrome: true
  },
  
  vp9: {
    chrome: true,
    firefox: true,
    safari: false,
    edge: true,
    ios_safari: false,
    android_chrome: true
  },
  
  av1: {
    chrome: true,    // Recent versions
    firefox: true,   // Recent versions
    safari: false,
    edge: true,      // Recent versions
    ios_safari: false,
    android_chrome: true // Recent versions
  }
} as const;
