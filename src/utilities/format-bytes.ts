/**
 * File Size Formatting Utilities
 * Handles byte size formatting for video files, bandwidth, etc.
 */

/**
 * Format bytes to human-readable format (KB, MB, GB, etc.)
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  // TODO: Implement byte formatting
  // - Handle different units (B, KB, MB, GB, TB)
  // - Support custom decimal places
  // - Handle edge cases (negative, NaN, 0)
  
  if (bytes === 0) return '0 Bytes';
  if (isNaN(bytes) || bytes < 0) return 'Invalid size';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Format bandwidth (bytes per second) to human-readable format
 */
export function formatBandwidth(bytesPerSecond: number): string {
  // TODO: Implement bandwidth formatting
  // - Convert to bits per second
  // - Use appropriate units (bps, Kbps, Mbps, Gbps)
  
  const bitsPerSecond = bytesPerSecond * 8;
  const k = 1000; // Use 1000 for network speeds, not 1024
  const sizes = ['bps', 'Kbps', 'Mbps', 'Gbps'];
  
  if (bitsPerSecond === 0) return '0 bps';
  
  const i = Math.floor(Math.log(bitsPerSecond) / Math.log(k));
  const value = bitsPerSecond / Math.pow(k, i);
  
  return `${value.toFixed(1)} ${sizes[i]}`;
}

/**
 * Parse human-readable size string back to bytes
 */
export function parseByteString(sizeString: string): number {
  // TODO: Implement size string parsing
  // - Handle different units
  // - Return bytes as number
  
  const units: { [key: string]: number } = {
    'B': 1,
    'KB': 1024,
    'MB': 1024 * 1024,
    'GB': 1024 * 1024 * 1024,
    'TB': 1024 * 1024 * 1024 * 1024
  };
  
  const match = sizeString.match(/^(\d+(?:\.\d+)?)\s*(B|KB|MB|GB|TB)$/i);
  if (!match) return 0;
  
  const value = parseFloat(match[1]);
  const unit = match[2].toUpperCase();
  
  return value * (units[unit] || 1);
}
