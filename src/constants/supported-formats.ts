/**
 * Supported Video Formats
 * Defines all supported video formats and their configurations
 */

/**
 * Supported video formats and their MIME types
 */
export const SUPPORTED_VIDEO_FORMATS = {
  // Progressive formats
  MP4: {
    mimeType: 'video/mp4',
    extensions: ['.mp4', '.m4v'],
    codecs: ['avc1.42E01E', 'avc1.4D401F', 'avc1.640028', 'mp4a.40.2'],
    quality: ['360p', '480p', '720p', '1080p', '1440p', '2160p'],
    supports: {
      hdr: true,
      dolbyVision: true,
      adaptiveStreaming: false
    }
  },
  
  WEBM: {
    mimeType: 'video/webm',
    extensions: ['.webm'],
    codecs: ['vp8', 'vp9', 'av01', 'vorbis', 'opus'],
    quality: ['360p', '480p', '720p', '1080p', '1440p', '2160p'],
    supports: {
      hdr: true,
      dolbyVision: false,
      adaptiveStreaming: false
    }
  },
  
  OGG: {
    mimeType: 'video/ogg',
    extensions: ['.ogg', '.ogv'],
    codecs: ['theora', 'vorbis'],
    quality: ['360p', '480p', '720p'],
    supports: {
      hdr: false,
      dolbyVision: false,
      adaptiveStreaming: false
    }
  },
  
  // Streaming formats
  HLS: {
    mimeType: 'application/vnd.apple.mpegurl',
    extensions: ['.m3u8'],
    codecs: ['avc1.42E01E', 'mp4a.40.2', 'hvc1.1.6.L93.B0'],
    quality: ['auto', '240p', '360p', '480p', '720p', '1080p', '1440p', '2160p'],
    supports: {
      hdr: true,
      dolbyVision: true,
      adaptiveStreaming: true
    }
  },
  
  DASH: {
    mimeType: 'application/dash+xml',
    extensions: ['.mpd'],
    codecs: ['avc1.42E01E', 'mp4a.40.2', 'vp9', 'opus', 'hvc1.1.6.L93.B0'],
    quality: ['auto', '240p', '360p', '480p', '720p', '1080p', '1440p', '2160p'],
    supports: {
      hdr: true,
      dolbyVision: true,
      adaptiveStreaming: true
    }
  }
} as const;

/**
 * Audio format support
 */
export const SUPPORTED_AUDIO_FORMATS = {
  MP3: {
    mimeType: 'audio/mpeg',
    extensions: ['.mp3'],
    codecs: ['mp3']
  },
  
  AAC: {
    mimeType: 'audio/aac',
    extensions: ['.aac', '.m4a'],
    codecs: ['mp4a.40.2']
  },
  
  OGG: {
    mimeType: 'audio/ogg',
    extensions: ['.ogg'],
    codecs: ['vorbis', 'opus']
  },
  
  WAV: {
    mimeType: 'audio/wav',
    extensions: ['.wav'],
    codecs: ['pcm']
  }
} as const;

/**
 * Container format compatibility matrix
 */
export const FORMAT_COMPATIBILITY = {
  progressive: ['MP4', 'WEBM', 'OGG'],
  streaming: ['HLS', 'DASH'],
  live: ['HLS', 'DASH'],
  mobile: ['MP4', 'HLS'],
  desktop: ['MP4', 'WEBM', 'HLS', 'DASH'],
  legacy: ['MP4', 'OGG']
} as const;

/**
 * Default format priorities by use case
 */
export const FORMAT_PRIORITIES = {
  mobile: ['HLS', 'MP4', 'WEBM'],
  desktop: ['DASH', 'HLS', 'MP4', 'WEBM'],
  live: ['HLS', 'DASH'],
  vod: ['MP4', 'WEBM', 'HLS', 'DASH'],
  legacy: ['MP4', 'OGG']
} as const;

/**
 * Quality level to bitrate mapping (approximate)
 */
export const QUALITY_BITRATES = {
  '240p': { video: 400, audio: 64 },   // 400 kbps video, 64 kbps audio
  '360p': { video: 800, audio: 96 },   // 800 kbps video, 96 kbps audio
  '480p': { video: 1200, audio: 128 }, // 1.2 Mbps video, 128 kbps audio
  '720p': { video: 2500, audio: 128 }, // 2.5 Mbps video, 128 kbps audio
  '1080p': { video: 5000, audio: 192 }, // 5 Mbps video, 192 kbps audio
  '1440p': { video: 10000, audio: 192 }, // 10 Mbps video, 192 kbps audio
  '2160p': { video: 20000, audio: 256 }  // 20 Mbps video, 256 kbps audio
} as const;
