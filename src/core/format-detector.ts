/**
 * Video Format Detection
 * Automatically detects video format and streaming protocol
 */

import type { VideoFormat } from '../types';

export class FormatDetector {
  private static readonly FORMAT_PATTERNS = {
    hls: [
      /\.m3u8(\?|$)/i,
      /\/playlist\.m3u8/i,
      /application\/vnd\.apple\.mpegurl/i,
      /application\/x-mpegURL/i
    ],
    dash: [
      /\.mpd(\?|$)/i,
      /\/manifest\.mpd/i,
      /application\/dash\+xml/i
    ],
    mp4: [
      /\.mp4(\?|$)/i,
      /video\/mp4/i
    ],
    webm: [
      /\.webm(\?|$)/i,
      /video\/webm/i
    ],
    ogv: [
      /\.ogv(\?|$)/i,
      /\.ogg(\?|$)/i,
      /video\/ogg/i
    ],
    webrtc: [
      /^webrtc:/i,
      /^rtc:/i,
      /webrtc/i
    ]
  };

  private static readonly MIME_TYPE_MAP: Record<string, string> = {
    hls: 'application/vnd.apple.mpegurl',
    dash: 'application/dash+xml',
    mp4: 'video/mp4',
    webm: 'video/webm',
    ogv: 'video/ogg',
    webrtc: 'application/webrtc'
  };

  /**
   * Detect video format from source URL or MIME type
   */
  static detectFormat(src: string, mimeType?: string): VideoFormat {
    // First try MIME type detection
    if (mimeType) {
      const formatFromMime = this.detectFromMimeType(mimeType);
      if (formatFromMime) {
        return formatFromMime;
      }
    }

    // Fall back to URL pattern detection
    return this.detectFromUrl(src);
  }

  /**
   * Detect format from MIME type
   */
  private static detectFromMimeType(mimeType: string): VideoFormat | null {
    const normalizedMime = mimeType.toLowerCase();

    for (const [format, patterns] of Object.entries(this.FORMAT_PATTERNS)) {
      for (const pattern of patterns) {
        if (pattern.test(normalizedMime)) {
          return {
            type: format as VideoFormat['type'],
            mimeType: this.MIME_TYPE_MAP[format] || mimeType,
            container: this.getContainerFromFormat(format)
          };
        }
      }
    }

    return null;
  }

  /**
   * Detect format from URL patterns
   */
  private static detectFromUrl(src: string): VideoFormat {
    const normalizedSrc = src.toLowerCase();

    for (const [format, patterns] of Object.entries(this.FORMAT_PATTERNS)) {
      for (const pattern of patterns) {
        if (pattern.test(normalizedSrc)) {
          return {
            type: format as VideoFormat['type'],
            mimeType: this.MIME_TYPE_MAP[format],
            container: this.getContainerFromFormat(format)
          };
        }
      }
    }

    // Default to MP4 if no pattern matches
    return {
      type: 'mp4',
      mimeType: 'video/mp4',
      container: 'mp4'
    };
  }

  /**
   * Get container format from detected type
   */
  private static getContainerFromFormat(format: string): string {
    const containerMap: Record<string, string> = {
      hls: 'ts',
      dash: 'mp4',
      mp4: 'mp4',
      webm: 'webm',
      ogv: 'ogg',
      webrtc: 'rtp'
    };

    return containerMap[format] || format;
  }

  /**
   * Check if format requires specific engine
   */
  static requiresSpecificEngine(format: VideoFormat): string | null {
    switch (format.type) {
      case 'hls':
        return 'hls';
      case 'dash':
        return 'dash';
      case 'webrtc':
        return 'webrtc';
      default:
        return null;
    }
  }

  /**
   * Get supported codecs for format
   */
  static getSupportedCodecs(format: VideoFormat): string[] {
    const codecMap: Record<string, string[]> = {
      hls: ['avc1.42E01E', 'avc1.640028', 'hev1.1.6.L93.90', 'mp4a.40.2'],
      dash: ['avc1.42E01E', 'avc1.640028', 'hev1.1.6.L93.90', 'mp4a.40.2'],
      mp4: ['avc1.42E01E', 'avc1.640028', 'mp4a.40.2'],
      webm: ['vp8', 'vp9', 'av01.0.08M.08', 'opus', 'vorbis'],
      ogv: ['theora', 'vorbis'],
      webrtc: ['h264', 'vp8', 'vp9', 'opus', 'pcmu']
    };

    return codecMap[format.type] || [];
  }
}
