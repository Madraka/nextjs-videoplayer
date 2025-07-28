/**
 * Accessibility Utilities
 * Functions to improve video player accessibility and compliance
 */

export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
  // TODO: Implement screen reader announcements
  // - Create ARIA live regions dynamically
  // - Handle announcement queuing
  // - Support different priority levels
  // - Clean up announcement elements
  if (typeof document === 'undefined') return;
  
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';
  
  document.body.appendChild(announcement);
  announcement.textContent = message;
  
  console.log('announceToScreenReader:', message, priority);
  
  // Clean up after announcement
  setTimeout(() => {
    if (announcement.parentNode) {
      announcement.parentNode.removeChild(announcement);
    }
  }, 1000);
};

export const getAccessibleLabel = (element: HTMLElement): string => {
  // TODO: Implement comprehensive accessible label extraction
  // - Check aria-label and aria-labelledby
  // - Fall back to title and alt attributes
  // - Handle nested label elements
  // - Support aria-describedby for descriptions
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  
  const ariaLabelledBy = element.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const labelElement = document.getElementById(ariaLabelledBy);
    if (labelElement) return labelElement.textContent || '';
  }
  
  const title = element.getAttribute('title');
  if (title) return title;
  
  const alt = element.getAttribute('alt');
  if (alt) return alt;
  
  return element.textContent || '';
};

export const setAccessibleFocus = (element: HTMLElement, options?: { preventScroll?: boolean }): void => {
  // TODO: Implement accessible focus management
  // - Handle focus rings and visibility
  // - Support focus trapping in modals
  // - Manage focus restoration
  // - Handle keyboard navigation
  if (!element) return;
  
  // Ensure element is focusable
  if (element.tabIndex < 0) {
    element.tabIndex = 0;
  }
  
  element.focus(options);
  console.log('setAccessibleFocus:', element.tagName, element.className);
};

export const trapFocus = (container: HTMLElement): () => void => {
  // TODO: Implement focus trapping for modals/dialogs
  // - Find all focusable elements
  // - Handle Tab and Shift+Tab navigation
  // - Support arrow key navigation for menus
  // - Restore focus when trap is removed
  const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const focusableElements = container.querySelectorAll(focusableSelector) as NodeListOf<HTMLElement>;
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  };
  
  container.addEventListener('keydown', handleKeyDown);
  console.log('trapFocus: trapped focus in', container.tagName, 'with', focusableElements.length, 'focusable elements');
  
  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
    console.log('trapFocus: removed focus trap');
  };
};

export const getColorContrast = (foreground: string, background: string): number => {
  // TODO: Implement WCAG color contrast calculation
  // - Parse different color formats (hex, rgb, hsl)
  // - Calculate relative luminance
  // - Return WCAG contrast ratio
  // - Support alpha channel handling
  
  // Simple implementation for hex colors
  const getRGB = (color: string) => {
    const hex = color.replace('#', '');
    return {
      r: parseInt(hex.substr(0, 2), 16),
      g: parseInt(hex.substr(2, 2), 16),
      b: parseInt(hex.substr(4, 2), 16)
    };
  };
  
  const getLuminance = (rgb: { r: number; g: number; b: number }) => {
    const sRGB = [rgb.r, rgb.g, rgb.b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  };
  
  try {
    const fgRGB = getRGB(foreground);
    const bgRGB = getRGB(background);
    const fgLum = getLuminance(fgRGB);
    const bgLum = getLuminance(bgRGB);
    
    const lighter = Math.max(fgLum, bgLum);
    const darker = Math.min(fgLum, bgLum);
    const contrast = (lighter + 0.05) / (darker + 0.05);
    
    console.log('getColorContrast:', contrast.toFixed(2));
    return contrast;
  } catch (error) {
    console.error('getColorContrast error:', error);
    return 1;
  }
};

export const addSkipLink = (targetId: string, label: string = 'Skip to main content'): HTMLElement => {
  // TODO: Implement skip link creation
  // - Add proper styling for visibility on focus
  // - Support multiple skip links
  // - Handle skip link positioning
  // - Add keyboard activation
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.textContent = label;
  skipLink.className = 'skip-link';
  
  // Add styles for skip link
  skipLink.style.position = 'absolute';
  skipLink.style.top = '-40px';
  skipLink.style.left = '6px';
  skipLink.style.background = '#000';
  skipLink.style.color = '#fff';
  skipLink.style.padding = '8px';
  skipLink.style.textDecoration = 'none';
  skipLink.style.zIndex = '1000';
  
  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '6px';
  });
  
  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
  });
  
  document.body.insertBefore(skipLink, document.body.firstChild);
  console.log('addSkipLink: added skip link to', targetId);
  
  return skipLink;
};

export const validateAltText = (altText: string): { valid: boolean; suggestions: string[] } => {
  // TODO: Implement alt text validation
  // - Check for meaningful descriptions
  // - Avoid redundant phrases
  // - Suggest improvements
  // - Handle context-specific validation
  const suggestions: string[] = [];
  let valid = true;
  
  if (!altText || altText.trim().length === 0) {
    valid = false;
    suggestions.push('Alt text should not be empty');
  }
  
  if (altText.toLowerCase().includes('image of') || altText.toLowerCase().includes('picture of')) {
    suggestions.push('Avoid starting with "image of" or "picture of"');
  }
  
  if (altText.length > 125) {
    suggestions.push('Alt text should be under 125 characters');
  }
  
  if (altText.length < 10) {
    suggestions.push('Alt text might be too brief to be meaningful');
  }
  
  console.log('validateAltText:', { altText, valid, suggestions });
  return { valid, suggestions };
};
