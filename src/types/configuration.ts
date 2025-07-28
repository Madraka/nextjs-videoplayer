/**
 * Player Configuration Types
 * Advanced configuration options for player customization
 */

export interface PlayerConfiguration {
  // Basic configuration
  src: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  
  // Visual configuration
  poster?: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
  
  // Behavior configuration
  preload?: 'none' | 'metadata' | 'auto';
  crossOrigin?: 'anonymous' | 'use-credentials';
  playsInline?: boolean;
  
  // Advanced features
  enableKeyboardShortcuts?: boolean;
  enableGestures?: boolean;
  enableAnalytics?: boolean;
  enableAI?: boolean;
  enableMCP?: boolean;
}

export interface ThemeConfiguration {
  // Color scheme
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  
  // Control styling
  controlsBackground: string;
  progressColor: string;
  bufferColor: string;
  
  // Layout
  borderRadius: string;
  shadows: boolean;
  animations: boolean;
}

export interface LayoutConfiguration {
  // Responsive design
  breakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  
  // Control positioning
  controlsPosition: 'bottom' | 'overlay' | 'floating';
  progressPosition: 'bottom' | 'top' | 'overlay';
  
  // Layout options
  theaterMode: boolean;
  fullscreenMode: boolean;
  pictureInPictureMode: boolean;
}

export interface AccessibilityConfiguration {
  // Screen reader support
  enableScreenReader: boolean;
  announceProgress: boolean;
  announceBuffering: boolean;
  
  // Keyboard navigation
  enableKeyboardNavigation: boolean;
  customKeyMappings?: Record<string, string>;
  
  // Visual accessibility
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

// TODO: Add more configuration interfaces as features are developed
// - QualityConfiguration
// - SubtitleConfiguration  
// - AnalyticsConfiguration
// - PluginConfiguration
