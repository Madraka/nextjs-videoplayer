/**
 * Keyboard Shortcuts Hook
 * Manages keyboard navigation and shortcuts for video player
 */

import { useEffect, useCallback, useRef } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  description: string;
  action: (event: KeyboardEvent) => void;
  preventDefault?: boolean;
  enabled?: boolean;
}

interface UseKeyboardShortcutsProps {
  element?: HTMLElement | null;
  shortcuts?: KeyboardShortcut[];
  enabled?: boolean;
  preventDefault?: boolean;
  onShortcutTrigger?: (shortcut: KeyboardShortcut, event: KeyboardEvent) => void;
}

interface UseKeyboardShortcutsReturn {
  registerShortcut: (shortcut: KeyboardShortcut) => void;
  unregisterShortcut: (key: string) => void;
  getShortcuts: () => KeyboardShortcut[];
  enable: () => void;
  disable: () => void;
  isEnabled: boolean;
}

export function useKeyboardShortcuts({
  element,
  shortcuts = [],
  enabled = true,
  preventDefault = true,
  onShortcutTrigger
}: UseKeyboardShortcutsProps = {}): UseKeyboardShortcutsReturn {
  const shortcutsRef = useRef<Map<string, KeyboardShortcut>>(new Map());
  const enabledRef = useRef(enabled);
  const elementRef = useRef<HTMLElement | null>(null);

  // Create shortcut key from event
  const createShortcutKey = useCallback((
    key: string,
    ctrlKey = false,
    shiftKey = false,
    altKey = false,
    metaKey = false
  ): string => {
    const modifiers = [];
    if (ctrlKey) modifiers.push('ctrl');
    if (shiftKey) modifiers.push('shift');
    if (altKey) modifiers.push('alt');
    if (metaKey) modifiers.push('meta');
    
    return [...modifiers, key.toLowerCase()].join('+');
  }, []);

  // Check if shortcut matches event
  const matchesShortcut = useCallback((shortcut: KeyboardShortcut, event: KeyboardEvent): boolean => {
    const eventKey = createShortcutKey(
      event.key,
      event.ctrlKey,
      event.shiftKey,
      event.altKey,
      event.metaKey
    );
    
    const shortcutKey = createShortcutKey(
      shortcut.key,
      shortcut.ctrlKey,
      shortcut.shiftKey,
      shortcut.altKey,
      shortcut.metaKey
    );

    return eventKey === shortcutKey;
  }, [createShortcutKey]);

  // Handle keydown event
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabledRef.current) return;

    // Skip if focused on input elements
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    // Find matching shortcut
    for (const shortcut of shortcutsRef.current.values()) {
      if (shortcut.enabled !== false && matchesShortcut(shortcut, event)) {
        // Prevent default if requested
        if (shortcut.preventDefault !== false && preventDefault) {
          event.preventDefault();
          event.stopPropagation();
        }

        // Execute shortcut action
        try {
          shortcut.action(event);
          onShortcutTrigger?.(shortcut, event);
        } catch (error) {
          console.error('Keyboard shortcut error:', error);
        }
        break;
      }
    }
  }, [matchesShortcut, preventDefault, onShortcutTrigger]);

  // Register shortcut
  const registerShortcut = useCallback((shortcut: KeyboardShortcut) => {
    const key = createShortcutKey(
      shortcut.key,
      shortcut.ctrlKey,
      shortcut.shiftKey,
      shortcut.altKey,
      shortcut.metaKey
    );
    
    shortcutsRef.current.set(key, shortcut);
  }, [createShortcutKey]);

  // Unregister shortcut
  const unregisterShortcut = useCallback((key: string) => {
    shortcutsRef.current.delete(key);
  }, []);

  // Get all shortcuts
  const getShortcuts = useCallback((): KeyboardShortcut[] => {
    return Array.from(shortcutsRef.current.values());
  }, []);

  // Enable shortcuts
  const enable = useCallback(() => {
    enabledRef.current = true;
  }, []);

  // Disable shortcuts
  const disable = useCallback(() => {
    enabledRef.current = false;
  }, []);

  // Attach event listener to element
  const attachListener = useCallback((targetElement: HTMLElement) => {
    targetElement.addEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Detach event listener from element
  const detachListener = useCallback((targetElement: HTMLElement) => {
    targetElement.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Update element reference
  useEffect(() => {
    // Detach from previous element
    if (elementRef.current) {
      detachListener(elementRef.current);
    }

    // Attach to new element or document
    const targetElement = element || document.body;
    elementRef.current = targetElement;
    attachListener(targetElement);

    return () => {
      if (elementRef.current) {
        detachListener(elementRef.current);
      }
    };
  }, [element, attachListener, detachListener]);

  // Register initial shortcuts
  useEffect(() => {
    shortcuts.forEach(shortcut => {
      registerShortcut(shortcut);
    });
  }, [shortcuts, registerShortcut]);

  // Update enabled state
  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  return {
    registerShortcut,
    unregisterShortcut,
    getShortcuts,
    enable,
    disable,
    isEnabled: enabledRef.current
  };
}

// Default video player shortcuts
export const defaultVideoShortcuts: KeyboardShortcut[] = [
  {
    key: ' ',
    description: 'Play/Pause',
    action: () => {
      // This will be implemented by the consumer
      console.log('Play/Pause triggered');
    }
  },
  {
    key: 'ArrowLeft',
    description: 'Seek backward 10 seconds',
    action: () => {
      console.log('Seek backward triggered');
    }
  },
  {
    key: 'ArrowRight',
    description: 'Seek forward 10 seconds',
    action: () => {
      console.log('Seek forward triggered');
    }
  },
  {
    key: 'ArrowUp',
    description: 'Volume up',
    action: () => {
      console.log('Volume up triggered');
    }
  },
  {
    key: 'ArrowDown',
    description: 'Volume down',
    action: () => {
      console.log('Volume down triggered');
    }
  },
  {
    key: 'm',
    description: 'Mute/Unmute',
    action: () => {
      console.log('Mute toggle triggered');
    }
  },
  {
    key: 'f',
    description: 'Fullscreen toggle',
    action: () => {
      console.log('Fullscreen toggle triggered');
    }
  },
  {
    key: 'p',
    description: 'Picture-in-Picture toggle',
    action: () => {
      console.log('PiP toggle triggered');
    }
  },
  {
    key: '0',
    description: 'Seek to beginning',
    action: () => {
      console.log('Seek to start triggered');
    }
  },
  {
    key: '1',
    description: 'Seek to 10%',
    action: () => {
      console.log('Seek to 10% triggered');
    }
  },
  {
    key: '2',
    description: 'Seek to 20%',
    action: () => {
      console.log('Seek to 20% triggered');
    }
  },
  {
    key: '3',
    description: 'Seek to 30%',
    action: () => {
      console.log('Seek to 30% triggered');
    }
  },
  {
    key: '4',
    description: 'Seek to 40%',
    action: () => {
      console.log('Seek to 40% triggered');
    }
  },
  {
    key: '5',
    description: 'Seek to 50%',
    action: () => {
      console.log('Seek to 50% triggered');
    }
  },
  {
    key: '6',
    description: 'Seek to 60%',
    action: () => {
      console.log('Seek to 60% triggered');
    }
  },
  {
    key: '7',
    description: 'Seek to 70%',
    action: () => {
      console.log('Seek to 70% triggered');
    }
  },
  {
    key: '8',
    description: 'Seek to 80%',
    action: () => {
      console.log('Seek to 80% triggered');
    }
  },
  {
    key: '9',
    description: 'Seek to 90%',
    action: () => {
      console.log('Seek to 90% triggered');
    }
  },
  {
    key: 'c',
    description: 'Toggle captions',
    action: () => {
      console.log('Captions toggle triggered');
    }
  },
  {
    key: 's',
    description: 'Toggle settings',
    action: () => {
      console.log('Settings toggle triggered');
    }
  },
  {
    key: 'Escape',
    description: 'Exit fullscreen',
    action: () => {
      console.log('Exit fullscreen triggered');
    }
  }
];
