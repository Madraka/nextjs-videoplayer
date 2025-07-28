/**
 * URL Utilities
 * URL parsing, validation, and manipulation functions
 */

export const parseVideoUrl = (url: string): { platform: string; videoId: string; params: Record<string, string> } | null => {
  // TODO: Implement comprehensive video URL parsing
  // - Support YouTube, Vimeo, Twitch, etc.
  // - Extract video IDs and parameters
  // - Handle playlist URLs
  // - Parse timestamp parameters
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    // YouTube detection
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      // TODO: Extract YouTube video ID and parameters
      console.log('parseVideoUrl: YouTube detected');
      return { platform: 'youtube', videoId: '', params: {} };
    }
    
    // Vimeo detection
    if (hostname.includes('vimeo.com')) {
      // TODO: Extract Vimeo video ID
      console.log('parseVideoUrl: Vimeo detected');
      return { platform: 'vimeo', videoId: '', params: {} };
    }
    
    // Direct video file
    if (url.match(/\.(mp4|webm|ogg|mov|avi)$/i)) {
      console.log('parseVideoUrl: Direct video file detected');
      return { platform: 'direct', videoId: url, params: {} };
    }
    
    return null;
  } catch (error) {
    console.error('parseVideoUrl error:', error);
    return null;
  }
};

export const buildStreamingUrl = (baseUrl: string, params: Record<string, any>): string => {
  // TODO: Implement streaming URL construction
  // - Add streaming parameters
  // - Handle authentication tokens
  // - Support different protocols (HLS, DASH)
  // - Add quality and format parameters
  const url = new URL(baseUrl);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });
  
  console.log('buildStreamingUrl:', url.toString());
  return url.toString();
};

export const extractTimestampFromUrl = (url: string): number | null => {
  // TODO: Implement timestamp extraction from URLs
  // - Parse time parameters (t, start, time)
  // - Handle different time formats
  // - Support playlist start times
  // - Convert to seconds
  try {
    const urlObj = new URL(url);
    const timeParam = urlObj.searchParams.get('t') || 
                     urlObj.searchParams.get('start') || 
                     urlObj.searchParams.get('time');
    
    if (timeParam) {
      // Handle different time formats (10s, 1m30s, 90)
      const seconds = parseTimeString(timeParam);
      console.log('extractTimestampFromUrl:', seconds);
      return seconds;
    }
    
    return null;
  } catch (error) {
    console.error('extractTimestampFromUrl error:', error);
    return null;
  }
};

export const parseTimeString = (timeStr: string): number => {
  // TODO: Implement comprehensive time string parsing
  // - Handle MM:SS and HH:MM:SS formats
  // - Support relative formats (30s, 2m30s)
  // - Handle fractional seconds
  // - Validate time bounds
  
  // Simple implementation for now
  const timePattern = /^(\d+):(\d+)(?::(\d+))?$/;
  const match = timeStr.match(timePattern);
  
  if (match) {
    const [, h, m, s] = match;
    if (s !== undefined) {
      // HH:MM:SS format
      return parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s);
    } else {
      // MM:SS format
      return parseInt(h) * 60 + parseInt(m);
    }
  }
  
  // Try simple numeric value (seconds)
  const seconds = parseInt(timeStr);
  return isNaN(seconds) ? 0 : seconds;
};

export const isValidStreamingUrl = (url: string): boolean => {
  // TODO: Implement streaming URL validation
  // - Check URL accessibility
  // - Validate streaming protocols
  // - Test CORS compatibility
  // - Verify content type
  try {
    const urlObj = new URL(url);
    const validProtocols = ['http:', 'https:', 'ws:', 'wss:'];
    const isValidProtocol = validProtocols.includes(urlObj.protocol);
    
    console.log('isValidStreamingUrl:', url, isValidProtocol);
    return isValidProtocol;
  } catch (error) {
    console.error('isValidStreamingUrl error:', error);
    return false;
  }
};
