/**
 * Accessibility plugins module exports
 * 
 * This module provides comprehensive accessibility features for video players
 * including keyboard navigation, screen reader support, captions, and audio descriptions.
 */

export { KeyboardNavigationPlugin } from './keyboard-navigation';
export { ScreenReaderPlugin } from './screen-reader';
export { CaptionsManagerPlugin } from './captions-manager';
export { AudioDescriptionsPlugin } from './audio-descriptions';

// Type exports
export type {
  KeyboardShortcut,
  KeyboardNavigationConfig
} from './keyboard-navigation';

export type {
  ScreenReaderConfig
} from './screen-reader';

export type {
  CaptionTrack,
  CaptionStyling,
  CaptionsManagerConfig
} from './captions-manager';

export type {
  AudioDescriptionTrack,
  AudioDescriptionCue,
  AudioDescriptionsConfig
} from './audio-descriptions';
