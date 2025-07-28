/**
 * Time Formatting Utilities
 * Handles time formatting for video duration, current time, etc.
 */

/**
 * Format seconds to MM:SS or HH:MM:SS format
 */
export function formatTime(seconds: number): string {
  // TODO: Implement time formatting
  // - Handle hours for long videos
  // - Format minutes and seconds with leading zeros
  // - Handle edge cases (negative, NaN, Infinity)
  
  if (isNaN(seconds) || seconds < 0) {
    return '00:00';
  }
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format time with milliseconds for precise timing
 */
export function formatTimeWithMs(seconds: number): string {
  // TODO: Implement precise time formatting with milliseconds
  const baseTime = formatTime(seconds);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${baseTime}.${ms.toString().padStart(3, '0')}`;
}

/**
 * Parse time string back to seconds
 */
export function parseTimeString(timeString: string): number {
  // TODO: Implement time string parsing
  // - Handle MM:SS and HH:MM:SS formats
  // - Return seconds as number
  const parts = timeString.split(':').map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
}
