/**
 * Theme Configuration Schema
 * Validation schema for player theme and styling configurations
 */

export const THEME_SCHEMA = {
  type: 'object',
  properties: {
    // Basic theme identification
    id: {
      type: 'string',
      pattern: '^[a-z][a-z0-9-]*[a-z0-9]$',
      description: 'Theme identifier (kebab-case)'
    },
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 50,
      description: 'Theme display name'
    },
    description: {
      type: 'string',
      maxLength: 200,
      description: 'Theme description'
    },
    
    // Color palette
    colors: {
      type: 'object',
      properties: {
        primary: {
          type: 'string',
          pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
          description: 'Primary brand color (hex)'
        },
        secondary: {
          type: 'string',
          pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
          description: 'Secondary color (hex)'
        },
        accent: {
          type: 'string',
          pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
          description: 'Accent color (hex)'
        },
        background: {
          type: 'string',
          pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
          description: 'Background color (hex)'
        },
        surface: {
          type: 'string',
          pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
          description: 'Surface color (hex)'
        },
        text: {
          type: 'string',
          pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
          description: 'Text color (hex)'
        },
        textSecondary: {
          type: 'string',
          pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
          description: 'Secondary text color (hex)'
        },
        border: {
          type: 'string',
          pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
          description: 'Border color (hex)'
        },
        error: {
          type: 'string',
          pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
          description: 'Error color (hex)'
        },
        warning: {
          type: 'string',
          pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
          description: 'Warning color (hex)'
        },
        success: {
          type: 'string',
          pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
          description: 'Success color (hex)'
        },
        info: {
          type: 'string',
          pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
          description: 'Info color (hex)'
        }
      },
      required: ['primary', 'background', 'text'],
      description: 'Theme color palette'
    },
    
    // Control-specific colors
    controls: {
      type: 'object',
      properties: {
        background: {
          type: 'string',
          pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
          description: 'Controls background color'
        },
        text: {
          type: 'string',
          pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
          description: 'Controls text color'
        },
        hover: {
          type: 'string',
          pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
          description: 'Controls hover color'
        },
        active: {
          type: 'string',
          pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
          description: 'Controls active color'
        },
        disabled: {
          type: 'string',
          pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
          description: 'Controls disabled color'
        }
      },
      description: 'Control-specific styling'
    },
    
    // Progress bar colors
    progress: {
      type: 'object',
      properties: {
        track: {
          type: 'string',
          pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
          description: 'Progress track color'
        },
        played: {
          type: 'string',
          pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
          description: 'Played progress color'
        },
        buffered: {
          type: 'string',
          pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
          description: 'Buffered progress color'
        },
        thumb: {
          type: 'string',
          pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
          description: 'Progress thumb color'
        }
      },
      description: 'Progress bar styling'
    },
    
    // Typography
    typography: {
      type: 'object',
      properties: {
        fontFamily: {
          type: 'string',
          description: 'Primary font family'
        },
        fontFamilyMono: {
          type: 'string',
          description: 'Monospace font family'
        },
        fontSize: {
          type: 'object',
          properties: {
            xs: { type: 'string' },
            sm: { type: 'string' },
            base: { type: 'string' },
            lg: { type: 'string' },
            xl: { type: 'string' },
            '2xl': { type: 'string' }
          },
          description: 'Font size scale'
        },
        fontWeight: {
          type: 'object',
          properties: {
            normal: { type: 'number', minimum: 100, maximum: 900 },
            medium: { type: 'number', minimum: 100, maximum: 900 },
            semibold: { type: 'number', minimum: 100, maximum: 900 },
            bold: { type: 'number', minimum: 100, maximum: 900 }
          },
          description: 'Font weight scale'
        },
        lineHeight: {
          type: 'object',
          properties: {
            tight: { type: 'number', minimum: 0.5, maximum: 3 },
            normal: { type: 'number', minimum: 0.5, maximum: 3 },
            relaxed: { type: 'number', minimum: 0.5, maximum: 3 }
          },
          description: 'Line height scale'
        }
      },
      description: 'Typography configuration'
    },
    
    // Spacing system
    spacing: {
      type: 'object',
      properties: {
        xs: { type: 'string' },
        sm: { type: 'string' },
        md: { type: 'string' },
        lg: { type: 'string' },
        xl: { type: 'string' },
        '2xl': { type: 'string' }
      },
      description: 'Spacing scale'
    },
    
    // Border radius
    borderRadius: {
      type: 'object',
      properties: {
        none: { type: 'string' },
        sm: { type: 'string' },
        md: { type: 'string' },
        lg: { type: 'string' },
        full: { type: 'string' }
      },
      description: 'Border radius scale'
    },
    
    // Shadows
    shadows: {
      type: 'object',
      properties: {
        sm: { type: 'string' },
        md: { type: 'string' },
        lg: { type: 'string' },
        xl: { type: 'string' }
      },
      description: 'Box shadow definitions'
    },
    
    // Animation settings
    animations: {
      type: 'object',
      properties: {
        duration: {
          type: 'object',
          properties: {
            fast: { type: 'string' },
            normal: { type: 'string' },
            slow: { type: 'string' }
          },
          description: 'Animation duration scale'
        },
        easing: {
          type: 'object',
          properties: {
            ease: { type: 'string' },
            easeIn: { type: 'string' },
            easeOut: { type: 'string' },
            easeInOut: { type: 'string' }
          },
          description: 'Animation easing functions'
        }
      },
      description: 'Animation configuration'
    },
    
    // Component-specific overrides
    components: {
      type: 'object',
      properties: {
        button: {
          type: 'object',
          description: 'Button component overrides'
        },
        slider: {
          type: 'object',
          description: 'Slider component overrides'
        },
        tooltip: {
          type: 'object',
          description: 'Tooltip component overrides'
        },
        menu: {
          type: 'object',
          description: 'Menu component overrides'
        }
      },
      description: 'Component-specific style overrides'
    },
    
    // Dark mode support
    darkMode: {
      type: 'object',
      properties: {
        enabled: {
          type: 'boolean',
          description: 'Enable dark mode variant'
        },
        colors: {
          type: 'object',
          description: 'Dark mode color overrides'
        }
      },
      description: 'Dark mode configuration'
    },
    
    // Accessibility features
    accessibility: {
      type: 'object',
      properties: {
        highContrast: {
          type: 'boolean',
          description: 'High contrast mode support'
        },
        reducedMotion: {
          type: 'boolean',
          description: 'Reduced motion support'
        },
        focusVisible: {
          type: 'string',
          pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
          description: 'Focus indicator color'
        }
      },
      description: 'Accessibility features'
    }
  },
  required: ['id', 'name', 'colors'],
  additionalProperties: false
} as const;

/**
 * Theme preset schema
 */
export const THEME_PRESET_SCHEMA = {
  type: 'object',
  properties: {
    light: THEME_SCHEMA,
    dark: THEME_SCHEMA
  },
  description: 'Light and dark theme variants'
} as const;

/**
 * Validate theme configuration
 */
export function validateTheme(theme: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (typeof theme !== 'object' || theme === null) {
    return { valid: false, errors: ['Theme must be an object'] };
  }
  
  // Required fields
  if (!theme.id || typeof theme.id !== 'string') {
    errors.push('id is required and must be a string');
  } else if (!/^[a-z][a-z0-9-]*[a-z0-9]$/.test(theme.id)) {
    errors.push('id must be kebab-case');
  }
  
  if (!theme.name || typeof theme.name !== 'string') {
    errors.push('name is required and must be a string');
  }
  
  // Colors validation
  if (!theme.colors || typeof theme.colors !== 'object') {
    errors.push('colors is required and must be an object');
  } else {
    const requiredColors = ['primary', 'background', 'text'];
    for (const color of requiredColors) {
      if (!theme.colors[color]) {
        errors.push(`colors.${color} is required`);
      } else if (typeof theme.colors[color] !== 'string') {
        errors.push(`colors.${color} must be a string`);
      } else if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(theme.colors[color])) {
        errors.push(`colors.${color} must be a valid hex color`);
      }
    }
  }
  
  // Validate hex colors in other sections
  const colorSections = ['controls', 'progress'];
  for (const section of colorSections) {
    if (theme[section] && typeof theme[section] === 'object') {
      for (const [key, value] of Object.entries(theme[section])) {
        if (typeof value === 'string' && !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
          errors.push(`${section}.${key} must be a valid hex color`);
        }
      }
    }
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Validate color string
 */
export function validateColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Convert theme to CSS custom properties
 */
export function themeToCssVariables(theme: any): Record<string, string> {
  const variables: Record<string, string> = {};
  
  if (theme.colors) {
    for (const [key, value] of Object.entries(theme.colors)) {
      variables[`--color-${key}`] = value as string;
    }
  }
  
  if (theme.spacing) {
    for (const [key, value] of Object.entries(theme.spacing)) {
      variables[`--spacing-${key}`] = value as string;
    }
  }
  
  if (theme.borderRadius) {
    for (const [key, value] of Object.entries(theme.borderRadius)) {
      variables[`--radius-${key}`] = value as string;
    }
  }
  
  return variables;
}
