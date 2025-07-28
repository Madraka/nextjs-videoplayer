"use client";
/**
 * Keyboard Handler Component
 * Handles keyboard shortcuts for video player
 */

import React, { useEffect, useCallback, useRef } from 'react';

interface KeyboardHandlerProps {
  isActive?: boolean;
  isPlaying?: boolean;
  currentTime?: number;
  duration?: number;
  volume?: number;
  isMuted?: boolean;
  isFullscreen?: boolean;
  playbackRate?: number;
  onPlay?: () => void;
  onPause?: () => void;
  onSeek?: (time: number) => void;
  onVolumeChange?: (volume: number) => void;
  onMuteToggle?: () => void;
  onFullscreenToggle?: () => void;
  onPlaybackRateChange?: (rate: number) => void;
  onRestart?: () => void;
  onSkipToEnd?: () => void;
  customShortcuts?: Record<string, () => void>;
}

const SEEK_STEP = 5; // seconds
const VOLUME_STEP = 0.1; // 10%
const PLAYBACK_RATE_STEP = 0.25;
const LONG_SEEK_STEP = 10; // seconds (with Shift)

export const KeyboardHandler: React.FC<KeyboardHandlerProps> = ({
  isActive = true,
  isPlaying = false,
  currentTime = 0,
  duration = 0,
  volume = 1,
  isMuted = false,
  isFullscreen = false,
  playbackRate = 1,
  onPlay,
  onPause,
  onSeek,
  onVolumeChange,
  onMuteToggle,
  onFullscreenToggle,
  onPlaybackRateChange,
  onRestart,
  onSkipToEnd,
  customShortcuts = {}
}) => {
  const lastKeyTime = useRef<number>(0);
  const keyRepeatTimer = useRef<NodeJS.Timeout | null>(null);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isActive) return;

    // Don't handle keys if user is typing in an input
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.contentEditable === 'true'
    ) {
      return;
    }

    const key = event.key.toLowerCase();
    const now = Date.now();
    const isRepeating = now - lastKeyTime.current < 50; // Debounce rapid key presses
    
    // Handle custom shortcuts first
    if (customShortcuts[key]) {
      event.preventDefault();
      customShortcuts[key]();
      return;
    }

    switch (key) {
      // Play/Pause
      case ' ':
      case 'k':
        event.preventDefault();
        if (isPlaying) {
          onPause?.();
        } else {
          onPlay?.();
        }
        break;

      // Seek backward
      case 'arrowleft':
      case 'j':
        event.preventDefault();
        if (!isRepeating) {
          const seekAmount = event.shiftKey ? LONG_SEEK_STEP : SEEK_STEP;
          const newTime = Math.max(0, currentTime - seekAmount);
          onSeek?.(newTime);
        }
        break;

      // Seek forward
      case 'arrowright':
      case 'l':
        event.preventDefault();
        if (!isRepeating) {
          const seekAmount = event.shiftKey ? LONG_SEEK_STEP : SEEK_STEP;
          const newTime = Math.min(duration, currentTime + seekAmount);
          onSeek?.(newTime);
        }
        break;

      // Volume up
      case 'arrowup':
        event.preventDefault();
        if (!isRepeating) {
          const newVolume = Math.min(1, volume + VOLUME_STEP);
          onVolumeChange?.(newVolume);
        }
        break;

      // Volume down
      case 'arrowdown':
        event.preventDefault();
        if (!isRepeating) {
          const newVolume = Math.max(0, volume - VOLUME_STEP);
          onVolumeChange?.(newVolume);
        }
        break;

      // Mute/Unmute
      case 'm':
        event.preventDefault();
        onMuteToggle?.();
        break;

      // Fullscreen
      case 'f':
        event.preventDefault();
        onFullscreenToggle?.();
        break;

      // Restart video
      case 'home':
      case '0':
        event.preventDefault();
        onSeek?.(0);
        onRestart?.();
        break;

      // Skip to end
      case 'end':
        event.preventDefault();
        onSeek?.(duration);
        onSkipToEnd?.();
        break;

      // Number keys for seeking to percentage
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        event.preventDefault();
        if (duration > 0) {
          const percentage = parseInt(key) / 10;
          const newTime = duration * percentage;
          onSeek?.(newTime);
        }
        break;

      // Playback rate controls
      case '<':
      case ',':
        event.preventDefault();
        if (event.shiftKey) {
          // Shift + < for slower playback
          const newRate = Math.max(0.25, playbackRate - PLAYBACK_RATE_STEP);
          onPlaybackRateChange?.(newRate);
        }
        break;

      case '>':
      case '.':
        event.preventDefault();
        if (event.shiftKey) {
          // Shift + > for faster playback
          const newRate = Math.min(4, playbackRate + PLAYBACK_RATE_STEP);
          onPlaybackRateChange?.(newRate);
        }
        break;

      // Reset playback rate to normal
      case 'r':
        event.preventDefault();
        onPlaybackRateChange?.(1);
        break;

      // Escape to exit fullscreen
      case 'escape':
        if (isFullscreen) {
          event.preventDefault();
          onFullscreenToggle?.();
        }
        break;

      default:
        // Don't prevent default for unhandled keys
        break;
    }

    lastKeyTime.current = now;
  }, [
    isActive,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isFullscreen,
    playbackRate,
    onPlay,
    onPause,
    onSeek,
    onVolumeChange,
    onMuteToggle,
    onFullscreenToggle,
    onPlaybackRateChange,
    onRestart,
    onSkipToEnd,
    customShortcuts
  ]);

  const handleKeyUp = useCallback(() => {
    if (keyRepeatTimer.current) {
      clearTimeout(keyRepeatTimer.current);
      keyRepeatTimer.current = null;
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
        if (keyRepeatTimer.current) {
          clearTimeout(keyRepeatTimer.current);
        }
      };
    }
  }, [isActive, handleKeyDown, handleKeyUp]);

  // This component doesn't render anything
  return null;
};

// Hook version for easier use
export const useKeyboardShortcuts = (props: KeyboardHandlerProps) => {
  return <KeyboardHandler {...props} />;
};

// Keyboard shortcuts reference
export const KEYBOARD_SHORTCUTS = {
  'Space/K': 'Play/Pause',
  '←/J': 'Seek backward 5s (Shift: 10s)',
  '→/L': 'Seek forward 5s (Shift: 10s)',
  '↑': 'Volume up',
  '↓': 'Volume down',
  'M': 'Mute/Unmute',
  'F': 'Toggle fullscreen',
  'Home/0': 'Restart video',
  'End': 'Skip to end',
  '1-9': 'Seek to 10%-90%',
  'Shift + <': 'Slower playback',
  'Shift + >': 'Faster playback',
  'R': 'Reset playback speed',
  'Escape': 'Exit fullscreen'
} as const;
