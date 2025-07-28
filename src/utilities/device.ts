/**
 * Device Utilities
 * Device detection and capability checking functions
 */

export const isMobile = (): boolean => {
  // TODO: Enhance mobile detection
  // - Check user agent patterns
  // - Consider screen size and orientation
  // - Handle tablet detection
  // - Support touch capability detection
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'windows phone'];
  
  const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));
  const isTouchDevice = 'ontouchstart' in window;
  const isSmallScreen = window.innerWidth <= 768;
  
  console.log('isMobile detection:', { isMobileUA, isTouchDevice, isSmallScreen });
  return isMobileUA || (isTouchDevice && isSmallScreen);
};

export const isTablet = (): boolean => {
  // TODO: Implement tablet-specific detection
  // - Distinguish tablets from phones
  // - Check screen dimensions and DPI
  // - Handle device orientation
  // - Consider iPad and Android tablets
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  const isTabletUA = userAgent.includes('ipad') || 
                     (userAgent.includes('android') && !userAgent.includes('mobile'));
  
  const isTouchDevice = 'ontouchstart' in window;
  const isTabletScreen = window.innerWidth >= 768 && window.innerWidth <= 1024;
  
  console.log('isTablet detection:', { isTabletUA, isTouchDevice, isTabletScreen });
  return isTabletUA || (isTouchDevice && isTabletScreen);
};

export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  // TODO: Implement comprehensive device type detection
  // - Use multiple detection methods
  // - Handle edge cases and hybrid devices
  // - Consider foldable devices
  // - Add confidence scoring
  if (isMobile()) return 'mobile';
  if (isTablet()) return 'tablet';
  return 'desktop';
};

export const supportsFullscreen = (): boolean => {
  // TODO: Implement fullscreen support detection
  // - Check vendor-specific APIs
  // - Handle browser compatibility
  // - Test actual fullscreen capability
  // - Consider iOS Safari limitations
  if (typeof document === 'undefined') return false;
  
  return !!(document.documentElement.requestFullscreen ||
           (document.documentElement as any).webkitRequestFullscreen ||
           (document.documentElement as any).mozRequestFullScreen ||
           (document.documentElement as any).msRequestFullscreen);
};

export const supportsVideoFormat = (format: string): boolean => {
  // TODO: Implement comprehensive video format support detection
  // - Test codec support
  // - Check container format compatibility
  // - Handle browser-specific limitations
  // - Support streaming format detection
  if (typeof document === 'undefined') return false;
  
  const video = document.createElement('video');
  const support = video.canPlayType(format);
  
  console.log('supportsVideoFormat:', format, support);
  return support === 'probably' || support === 'maybe';
};

export const getNetworkType = (): string => {
  // TODO: Implement network type detection
  // - Use Network Information API
  // - Detect connection speed
  // - Handle offline scenarios
  // - Provide fallback estimates
  if (typeof navigator === 'undefined') return 'unknown';
  
  const connection = (navigator as any).connection || 
                    (navigator as any).mozConnection || 
                    (navigator as any).webkitConnection;
  
  if (connection) {
    console.log('getNetworkType:', connection.effectiveType || connection.type);
    return connection.effectiveType || connection.type || 'unknown';
  }
  
  return 'unknown';
};

export const getScreenInfo = (): { width: number; height: number; pixelRatio: number; orientation: string } => {
  // TODO: Enhance screen information gathering
  // - Get accurate screen dimensions
  // - Handle high-DPI displays
  // - Detect orientation changes
  // - Consider multi-monitor setups
  if (typeof window === 'undefined') {
    return { width: 0, height: 0, pixelRatio: 1, orientation: 'unknown' };
  }
  
  const width = window.screen.width;
  const height = window.screen.height;
  const pixelRatio = window.devicePixelRatio || 1;
  const orientation = width > height ? 'landscape' : 'portrait';
  
  console.log('getScreenInfo:', { width, height, pixelRatio, orientation });
  return { width, height, pixelRatio, orientation };
};
