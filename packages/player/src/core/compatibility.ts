/**
 * Browser and device compatibility utilities
 * Detects HLS support, device capabilities, and autoplay policies
 */

export interface BrowserCapabilities {
  hasNativeHls: boolean;
  hasHlsJs: boolean;
  hasDashJs: boolean;
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  supportsInlinePlayback: boolean;
  supportsAutoplay: boolean;
  supportsPictureInPicture: boolean;
}

/**
 * Check if browser supports native HLS playback
 */
export const hasNativeHlsSupport = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const video = document.createElement('video');
  return video.canPlayType('application/vnd.apple.mpegurl') !== '';
};

/**
 * Check if HLS.js is supported in current browser
 */
export const hasHlsJsSupport = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    // Check if MediaSource API is supported (required for HLS.js)
    return !!(window.MediaSource || (window as unknown as { WebKitMediaSource?: unknown }).WebKitMediaSource);
  } catch {
    return false;
  }
};

/**
 * Check if Dash.js is supported in current browser
 */
export const hasDashJsSupport = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    // Check if MediaSource API is supported (required for Dash.js)
    return !!(window.MediaSource || (window as unknown as { WebKitMediaSource?: unknown }).WebKitMediaSource);
  } catch {
    return false;
  }
};

/**
 * Detect if device is mobile
 */
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Detect iOS devices
 */
export const isIOSDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

/**
 * Detect Android devices
 */
export const isAndroidDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return /Android/.test(navigator.userAgent);
};

/**
 * Check if browser supports Picture-in-Picture
 */
export const supportsPictureInPicture = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return 'pictureInPictureEnabled' in document;
};

/**
 * Check if browser likely supports autoplay
 * This is a best-guess, actual autoplay depends on user interaction and browser policies
 */
export const supportsAutoplay = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  
  try {
    const video = document.createElement('video');
    video.muted = true;
    video.src = 'data:video/mp4;base64,AAAAHGZ0eXBpc29tAAACAGlzb21pc28yYXZjMQAAAAhmcmVlAAAAG21kYXQAAAGzABAHAAABthADAowdbb9/AAAC6W1vb3YAAABsbXZoZAAAAAB8JbCAfCWwgAAAA+gAAAAAAAEAAAEAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAIVdHJhawAAAFx0a2hkAAAAD3wlsIB8JbCAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAIAAAACAAAAAAACRlZHRzAAAAHGVsc3QAAAAAAAAAAQAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAA==';
    
    const promise = video.play();
    if (promise) {
      await promise;
      video.pause();
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

/**
 * Get comprehensive browser capabilities
 */
/**
 * Check if a video format is supported by the browser
 * This function is safe for SSR environments
 */
export const isVideoFormatSupported = (url: string): boolean => {
  // Return true during SSR to avoid hydration mismatches
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return true;
  }

  const video = document.createElement('video');
  
  // Extract file extension
  const extension = url.split('.').pop()?.toLowerCase().split('?')[0];
  
  switch (extension) {
    case 'mp4':
      return video.canPlayType('video/mp4') !== '';
    case 'webm':
      return video.canPlayType('video/webm') !== '' || 
             video.canPlayType('video/webm; codecs="vp8"') !== '' ||
             video.canPlayType('video/webm; codecs="vp9"') !== '';
    case 'ogg':
      return video.canPlayType('video/ogg') !== '';
    case 'avi':
      return false; // AVI is generally not supported in browsers
    case 'mov':
      return video.canPlayType('video/quicktime') !== '';
    default:
      return true; // Assume supported for unknown formats
  }
};

export const getBrowserCapabilities = async (): Promise<BrowserCapabilities> => {
  const capabilities: BrowserCapabilities = {
    hasNativeHls: hasNativeHlsSupport(),
    hasHlsJs: hasHlsJsSupport(),
    hasDashJs: hasDashJsSupport(),
    isMobile: isMobileDevice(),
    isIOS: isIOSDevice(),
    isAndroid: isAndroidDevice(),
    supportsInlinePlayback: true, // Most modern browsers support this
    supportsAutoplay: await supportsAutoplay(),
    supportsPictureInPicture: supportsPictureInPicture(),
  };

  return capabilities;
};

/**
 * Get optimal streaming strategy based on browser capabilities
 */
export const getStreamingStrategy = (
  capabilities: BrowserCapabilities,
  streamUrl: string
): 'native' | 'hlsjs' | 'dashjs' | 'direct' | 'unsupported' => {
  const normalizedPath = (() => {
    try {
      return new URL(streamUrl, 'https://localhost').pathname.toLowerCase();
    } catch {
      return streamUrl.toLowerCase();
    }
  })();

  const isHlsUrl = /\.m3u8$/i.test(normalizedPath);
  const isDashUrl = /\.mpd$/i.test(normalizedPath);
  const isDirectVideo = /\.(mp4|webm|ogg|avi|mov)$/i.test(normalizedPath);

  if (isHlsUrl) {
    if (capabilities.hasNativeHls && capabilities.isIOS) {
      return 'native';
    }
    if (capabilities.hasHlsJs) {
      return 'hlsjs';
    }
  }

  if (isDashUrl && capabilities.hasDashJs) {
    return 'dashjs';
  }

  // For direct video files (MP4, WebM, etc.)
  if (isDirectVideo) {
    // Check if the browser supports this video format
    const isSupported = isVideoFormatSupported(streamUrl);
    
    if (isSupported) {
      return 'direct';
    }

    return 'unsupported';
  }

  return 'unsupported';
};
