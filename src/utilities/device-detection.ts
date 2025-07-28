/**
 * Device and Browser Detection Utilities
 * Detects device capabilities, browser support, and platform features
 */

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouch: boolean;
  platform: string;
  browser: string;
  browserVersion: string;
  screenSize: {
    width: number;
    height: number;
  };
}

/**
 * Detect if device is mobile
 */
export function isMobile(): boolean {
  // TODO: Implement mobile detection
  // - Check user agent
  // - Check screen size
  // - Check touch capabilities
  
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth <= 768;
}

/**
 * Detect if device is tablet
 */
export function isTablet(): boolean {
  // TODO: Implement tablet detection
  // - Check user agent for tablet indicators
  // - Check screen size ranges
  
  if (typeof window === 'undefined') return false;
  
  return /iPad|Android/i.test(navigator.userAgent) && 
         window.innerWidth >= 768 && 
         window.innerWidth <= 1024;
}

/**
 * Detect if device supports touch
 */
export function isTouchDevice(): boolean {
  // TODO: Implement touch detection
  // - Check for touch events
  // - Check maxTouchPoints
  
  if (typeof window === 'undefined') return false;
  
  return 'ontouchstart' in window || 
         navigator.maxTouchPoints > 0 || 
         (navigator as any).msMaxTouchPoints > 0;
}

/**
 * Get browser information
 */
export function getBrowserInfo(): { name: string; version: string } {
  // TODO: Implement browser detection
  // - Parse user agent
  // - Detect browser name and version
  // - Handle edge cases
  
  if (typeof window === 'undefined') {
    return { name: 'Unknown', version: '0' };
  }
  
  const ua = navigator.userAgent;
  
  // Simple browser detection - TODO: Improve accuracy
  if (ua.includes('Chrome')) return { name: 'Chrome', version: '0' };
  if (ua.includes('Firefox')) return { name: 'Firefox', version: '0' };
  if (ua.includes('Safari')) return { name: 'Safari', version: '0' };
  if (ua.includes('Edge')) return { name: 'Edge', version: '0' };
  
  return { name: 'Unknown', version: '0' };
}

/**
 * Get comprehensive device information
 */
export function getDeviceInfo(): DeviceInfo {
  // TODO: Implement comprehensive device detection
  // - Combine all detection methods
  // - Return structured device info
  
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isTouch: false,
      platform: 'server',
      browser: 'Unknown',
      browserVersion: '0',
      screenSize: { width: 0, height: 0 }
    };
  }
  
  const mobile = isMobile();
  const tablet = isTablet();
  const browser = getBrowserInfo();
  
  return {
    isMobile: mobile,
    isTablet: tablet,
    isDesktop: !mobile && !tablet,
    isTouch: isTouchDevice(),
    platform: navigator.platform || 'Unknown',
    browser: browser.name,
    browserVersion: browser.version,
    screenSize: {
      width: window.innerWidth,
      height: window.innerHeight
    }
  };
}
