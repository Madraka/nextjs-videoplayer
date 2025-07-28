/**
 * MIME Type Detection Utilities
 * Detects and validates MIME types for video content
 */

/**
 * Video MIME type mappings
 */
export const VIDEO_MIME_TYPES = {
  // MP4 variants
  '.mp4': 'video/mp4',
  '.m4v': 'video/mp4',
  
  // WebM
  '.webm': 'video/webm',
  
  // Ogg
  '.ogg': 'video/ogg',
  '.ogv': 'video/ogg',
  
  // Legacy formats
  '.avi': 'video/x-msvideo',
  '.mov': 'video/quicktime',
  '.wmv': 'video/x-ms-wmv',
  '.flv': 'video/x-flv',
  '.mkv': 'video/x-matroska',
  '.3gp': 'video/3gpp',
  
  // Streaming formats
  '.m3u8': 'application/vnd.apple.mpegurl',
  '.mpd': 'application/dash+xml'
} as const;

/**
 * Audio MIME type mappings
 */
export const AUDIO_MIME_TYPES = {
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.aac': 'audio/aac',
  '.m4a': 'audio/mp4',
  '.flac': 'audio/flac',
  '.wma': 'audio/x-ms-wma'
} as const;

/**
 * Detect MIME type from file extension
 */
export function getMimeTypeFromExtension(filename: string): string | null {
  // TODO: Implement MIME type detection from extension
  // - Extract file extension
  // - Map to appropriate MIME type
  // - Handle unknown extensions
  
  if (!filename || typeof filename !== 'string') return null;
  
  const ext = filename.toLowerCase().split('.').pop();
  if (!ext) return null;
  
  const extWithDot = `.${ext}`;
  
  // Check video types first
  if (extWithDot in VIDEO_MIME_TYPES) {
    return VIDEO_MIME_TYPES[extWithDot as keyof typeof VIDEO_MIME_TYPES];
  }
  
  // Check audio types
  if (extWithDot in AUDIO_MIME_TYPES) {
    return AUDIO_MIME_TYPES[extWithDot as keyof typeof AUDIO_MIME_TYPES];
  }
  
  return null;
}

/**
 * Detect MIME type from URL
 */
export function getMimeTypeFromUrl(url: string): string | null {
  // TODO: Implement MIME type detection from URL
  // - Parse URL to extract filename
  // - Handle query parameters
  // - Detect streaming formats
  
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    // Extract filename from path
    const filename = pathname.split('/').pop() || '';
    
    return getMimeTypeFromExtension(filename);
  } catch {
    return null;
  }
}

/**
 * Check if MIME type is video
 */
export function isVideoMimeType(mimeType: string): boolean {
  // TODO: Implement video MIME type validation
  // - Check if MIME type starts with 'video/'
  // - Handle streaming MIME types
  
  if (!mimeType || typeof mimeType !== 'string') return false;
  
  return mimeType.startsWith('video/') ||
         mimeType === 'application/vnd.apple.mpegurl' || // HLS
         mimeType === 'application/dash+xml';            // DASH
}

/**
 * Check if MIME type is audio
 */
export function isAudioMimeType(mimeType: string): boolean {
  // TODO: Implement audio MIME type validation
  return !!(mimeType && typeof mimeType === 'string' && mimeType.startsWith('audio/'));
}

/**
 * Check if MIME type is streaming format
 */
export function isStreamingMimeType(mimeType: string): boolean {
  // TODO: Implement streaming MIME type detection
  // - Detect HLS and DASH formats
  // - Handle adaptive streaming
  
  if (!mimeType || typeof mimeType !== 'string') return false;
  
  return mimeType === 'application/vnd.apple.mpegurl' || // HLS
         mimeType === 'application/dash+xml';            // DASH
}

/**
 * Get supported codecs for MIME type
 */
export function getSupportedCodecs(mimeType: string): string[] {
  // TODO: Implement codec detection for MIME types
  // - Return appropriate codecs for each format
  // - Handle browser compatibility
  
  const codecMap: Record<string, string[]> = {
    'video/mp4': ['avc1.42E01E', 'mp4a.40.2', 'avc1.4D401F', 'avc1.640028'],
    'video/webm': ['vp8', 'vp9', 'vorbis', 'opus'],
    'video/ogg': ['theora', 'vorbis'],
    'application/vnd.apple.mpegurl': ['avc1.42E01E', 'mp4a.40.2'],
    'application/dash+xml': ['avc1.42E01E', 'mp4a.40.2', 'vp9', 'opus']
  };
  
  return codecMap[mimeType] || [];
}

/**
 * Check browser support for MIME type and codecs
 */
export function isMimeTypeSupported(mimeType: string, codecs?: string[]): boolean {
  // TODO: Implement browser support detection
  // - Use MediaSource.isTypeSupported() or canPlayType()
  // - Handle codec parameters
  // - Fall back gracefully
  
  if (typeof window === 'undefined') return false;
  
  try {
    // Check if we have a video element
    const video = document.createElement('video');
    
    if (codecs && codecs.length > 0) {
      const fullMimeType = `${mimeType}; codecs="${codecs.join(', ')}"`;
      const support = video.canPlayType(fullMimeType);
      return support === 'probably' || support === 'maybe';
    } else {
      const support = video.canPlayType(mimeType);
      return support === 'probably' || support === 'maybe';
    }
  } catch {
    return false;
  }
}

/**
 * Get file extension from MIME type
 */
export function getExtensionFromMimeType(mimeType: string): string | null {
  // TODO: Implement extension detection from MIME type
  // - Reverse lookup in MIME type maps
  // - Handle multiple extensions for same type
  
  if (!mimeType || typeof mimeType !== 'string') return null;
  
  // Search in video types
  for (const [ext, mime] of Object.entries(VIDEO_MIME_TYPES)) {
    if (mime === mimeType) return ext;
  }
  
  // Search in audio types
  for (const [ext, mime] of Object.entries(AUDIO_MIME_TYPES)) {
    if (mime === mimeType) return ext;
  }
  
  return null;
}
