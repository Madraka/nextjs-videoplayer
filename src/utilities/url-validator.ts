/**
 * URL Validation Utilities
 * Handles URL validation for video sources and streaming
 */

/**
 * Validate if string is a valid URL
 */
export function isValidUrl(url: string): boolean {
  // TODO: Implement URL validation
  // - Check URL format
  // - Handle different protocols
  // - Validate against common patterns
  
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:', 'blob:', 'data:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
}

/**
 * Validate video URL formats
 */
export function isValidVideoUrl(url: string): boolean {
  // TODO: Implement video URL validation
  // - Check for video file extensions
  // - Validate streaming URLs (HLS, DASH)
  // - Handle blob URLs and data URLs
  
  if (!isValidUrl(url)) return false;
  
  try {
    const urlObj = new URL(url);
    
    // Handle blob and data URLs
    if (urlObj.protocol === 'blob:' || urlObj.protocol === 'data:') {
      return true;
    }
    
    // Check for video file extensions
    const videoExtensions = [
      '.mp4', '.webm', '.ogg', '.avi', '.mov', '.wmv', '.flv', '.mkv',
      '.m4v', '.3gp', '.m3u8', '.mpd'
    ];
    
    const pathname = urlObj.pathname.toLowerCase();
    return videoExtensions.some(ext => pathname.endsWith(ext)) ||
           pathname.includes('.m3u8') || // HLS
           pathname.includes('.mpd');    // DASH
  } catch {
    return false;
  }
}

/**
 * Validate HLS manifest URL
 */
export function isHlsUrl(url: string): boolean {
  // TODO: Implement HLS URL validation
  // - Check for .m3u8 extension
  // - Validate manifest format
  
  if (!isValidUrl(url)) return false;
  
  try {
    const urlObj = new URL(url);
    return urlObj.pathname.toLowerCase().includes('.m3u8');
  } catch {
    return false;
  }
}

/**
 * Validate DASH manifest URL
 */
export function isDashUrl(url: string): boolean {
  // TODO: Implement DASH URL validation
  // - Check for .mpd extension
  // - Validate manifest format
  
  if (!isValidUrl(url)) return false;
  
  try {
    const urlObj = new URL(url);
    return urlObj.pathname.toLowerCase().includes('.mpd');
  } catch {
    return false;
  }
}

/**
 * Validate progressive video URL
 */
export function isProgressiveUrl(url: string): boolean {
  // TODO: Implement progressive video URL validation
  // - Check for standard video formats
  // - Exclude streaming formats
  
  if (!isValidVideoUrl(url)) return false;
  
  const progressiveExtensions = [
    '.mp4', '.webm', '.ogg', '.avi', '.mov', '.wmv', '.flv', '.mkv', '.m4v', '.3gp'
  ];
  
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname.toLowerCase();
    return progressiveExtensions.some(ext => pathname.endsWith(ext));
  } catch {
    return false;
  }
}

/**
 * Extract file extension from URL
 */
export function getUrlExtension(url: string): string {
  // TODO: Implement URL extension extraction
  // - Handle query parameters
  // - Return clean extension
  
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const lastDot = pathname.lastIndexOf('.');
    
    if (lastDot === -1) return '';
    
    return pathname.substring(lastDot).toLowerCase();
  } catch {
    return '';
  }
}

/**
 * Sanitize URL for safe usage
 */
export function sanitizeUrl(url: string): string {
  // TODO: Implement URL sanitization
  // - Remove dangerous protocols
  // - Encode special characters
  // - Validate against XSS
  
  if (!url || typeof url !== 'string') return '';
  
  // Remove dangerous protocols
  const dangerousProtocols = ['javascript:', 'vbscript:', 'file:', 'ftp:'];
  const lowerUrl = url.toLowerCase();
  
  if (dangerousProtocols.some(protocol => lowerUrl.startsWith(protocol))) {
    return '';
  }
  
  try {
    const urlObj = new URL(url);
    return urlObj.toString();
  } catch {
    return '';
  }
}

/**
 * Build URL with query parameters
 */
export function buildUrl(baseUrl: string, params: Record<string, string | number | boolean>): string {
  // TODO: Implement URL building with parameters
  // - Handle existing query parameters
  // - Encode parameter values
  
  try {
    const urlObj = new URL(baseUrl);
    
    Object.entries(params).forEach(([key, value]) => {
      urlObj.searchParams.set(key, String(value));
    });
    
    return urlObj.toString();
  } catch {
    return baseUrl;
  }
}

/**
 * Parse URL query parameters
 */
export function parseUrlParams(url: string): Record<string, string> {
  // TODO: Implement URL parameter parsing
  // - Extract query parameters
  // - Decode parameter values
  
  try {
    const urlObj = new URL(url);
    const params: Record<string, string> = {};
    
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    
    return params;
  } catch {
    return {};
  }
}
