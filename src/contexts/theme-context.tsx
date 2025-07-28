/**
 * Theme Context
 * Manages theme configuration and styling for the video player
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// Theme configuration interface
interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  accent: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  warning: string;
  success: string;
  info: string;
}

interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
}

interface ThemeTypography {
  fontFamily: string;
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

interface ThemeBreakpoints {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
}

interface ThemeConfig {
  name: string;
  mode: 'light' | 'dark' | 'auto';
  colors: ThemeColors;
  spacing: ThemeSpacing;
  typography: ThemeTypography;
  breakpoints: ThemeBreakpoints;
  borderRadius: string;
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  animation: {
    duration: {
      fast: string;
      normal: string;
      slow: string;
    };
    easing: {
      linear: string;
      easeIn: string;
      easeOut: string;
      easeInOut: string;
    };
  };
}

// Predefined themes
const lightTheme: ThemeConfig = {
  name: 'light',
  mode: 'light',
  colors: {
    primary: '#3b82f6',
    secondary: '#6b7280',
    background: '#ffffff',
    surface: '#f8fafc',
    accent: '#8b5cf6',
    text: '#1f2937',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    error: '#ef4444',
    warning: '#f59e0b',
    success: '#10b981',
    info: '#3b82f6'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem'
  },
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      xxl: '1.5rem'
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75
    }
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    xxl: '1536px'
  },
  borderRadius: '0.5rem',
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  },
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms'
    },
    easing: {
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }
};

const darkTheme: ThemeConfig = {
  ...lightTheme,
  name: 'dark',
  mode: 'dark',
  colors: {
    primary: '#3b82f6',
    secondary: '#9ca3af',
    background: '#111827',
    surface: '#1f2937',
    accent: '#8b5cf6',
    text: '#f9fafb',
    textSecondary: '#d1d5db',
    border: '#374151',
    error: '#ef4444',
    warning: '#f59e0b',
    success: '#10b981',
    info: '#3b82f6'
  }
};

// Available themes
const themes = {
  light: lightTheme,
  dark: darkTheme
};

// Theme context interface
interface ThemeContextValue {
  theme: ThemeConfig;
  themeName: keyof typeof themes;
  availableThemes: string[];
  setTheme: (themeName: keyof typeof themes) => void;
  toggleTheme: () => void;
  updateThemeConfig: (updates: Partial<ThemeConfig>) => void;
  resetTheme: () => void;
  createCustomTheme: (name: string, config: Partial<ThemeConfig>) => void;
  exportTheme: () => string;
  importTheme: (themeData: string) => void;
  applySystemTheme: () => void;
  isDarkMode: boolean;
  isLightMode: boolean;
}

// Create context
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Provider props
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: keyof typeof themes;
  enableSystemTheme?: boolean;
  onThemeChange?: (theme: ThemeConfig) => void;
}

// Provider component
export function ThemeProvider({ 
  children, 
  defaultTheme = 'light',
  enableSystemTheme = true,
  onThemeChange 
}: ThemeProviderProps) {
  const [themeName, setThemeName] = useState<keyof typeof themes>(defaultTheme);
  const [customThemes, setCustomThemes] = useState<Record<string, ThemeConfig>>({});
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(themes[defaultTheme]);

  // Get all available themes
  const availableThemes = [...Object.keys(themes), ...Object.keys(customThemes)];

  // Detect system theme preference
  const getSystemTheme = useCallback((): keyof typeof themes => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }, []);

  // Apply system theme
  const applySystemTheme = useCallback(() => {
    if (enableSystemTheme) {
      const systemTheme = getSystemTheme();
      setTheme(systemTheme);
    }
  }, [enableSystemTheme, getSystemTheme]);

  // Set theme
  const setTheme = useCallback((newThemeName: keyof typeof themes) => {
    const theme = themes[newThemeName] || customThemes[newThemeName as string];
    if (theme) {
      setThemeName(newThemeName);
      setCurrentTheme(theme);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('video-player-theme', newThemeName as string);
      }
      
      onThemeChange?.(theme);
    }
  }, [customThemes, onThemeChange]);

  // Toggle between light and dark themes
  const toggleTheme = useCallback(() => {
    const newTheme = themeName === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [themeName, setTheme]);

  // Update current theme configuration
  const updateThemeConfig = useCallback((updates: Partial<ThemeConfig>) => {
    const updatedTheme = {
      ...currentTheme,
      ...updates,
      colors: { ...currentTheme.colors, ...updates.colors },
      spacing: { ...currentTheme.spacing, ...updates.spacing },
      typography: { ...currentTheme.typography, ...updates.typography },
      breakpoints: { ...currentTheme.breakpoints, ...updates.breakpoints }
    };
    
    setCurrentTheme(updatedTheme);
    onThemeChange?.(updatedTheme);
  }, [currentTheme, onThemeChange]);

  // Reset theme to default
  const resetTheme = useCallback(() => {
    const defaultThemeConfig = themes[themeName] || themes.light;
    setCurrentTheme(defaultThemeConfig);
    onThemeChange?.(defaultThemeConfig);
  }, [themeName, onThemeChange]);

  // Create custom theme
  const createCustomTheme = useCallback((name: string, config: Partial<ThemeConfig>) => {
    const baseTheme = themes[themeName] || themes.light;
    const customTheme: ThemeConfig = {
      ...baseTheme,
      ...config,
      name,
      colors: { ...baseTheme.colors, ...config.colors },
      spacing: { ...baseTheme.spacing, ...config.spacing },
      typography: { ...baseTheme.typography, ...config.typography },
      breakpoints: { ...baseTheme.breakpoints, ...config.breakpoints }
    };
    
    setCustomThemes(prev => ({ ...prev, [name]: customTheme }));
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      const savedCustomThemes = JSON.parse(
        localStorage.getItem('video-player-custom-themes') || '{}'
      );
      savedCustomThemes[name] = customTheme;
      localStorage.setItem('video-player-custom-themes', JSON.stringify(savedCustomThemes));
    }
  }, [themeName]);

  // Export theme configuration
  const exportTheme = useCallback((): string => {
    return JSON.stringify(currentTheme, null, 2);
  }, [currentTheme]);

  // Import theme configuration
  const importTheme = useCallback((themeData: string) => {
    try {
      const importedTheme: ThemeConfig = JSON.parse(themeData);
      if (importedTheme.name) {
        createCustomTheme(importedTheme.name, importedTheme);
        setTheme(importedTheme.name as keyof typeof themes);
      }
    } catch (error) {
      console.error('Failed to import theme:', error);
    }
  }, [createCustomTheme, setTheme]);

  // Load saved theme and custom themes on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load saved theme
      const savedTheme = localStorage.getItem('video-player-theme');
      if (savedTheme && (themes as any)[savedTheme]) {
        setTheme(savedTheme as keyof typeof themes);
      } else if (enableSystemTheme) {
        applySystemTheme();
      }

      // Load custom themes
      const savedCustomThemes = localStorage.getItem('video-player-custom-themes');
      if (savedCustomThemes) {
        try {
          const parsedCustomThemes = JSON.parse(savedCustomThemes);
          setCustomThemes(parsedCustomThemes);
        } catch (error) {
          console.error('Failed to load custom themes:', error);
        }
      }
    }
  }, [enableSystemTheme, applySystemTheme, setTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (enableSystemTheme && typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = () => {
        // Only apply system theme if no manual theme is set
        const savedTheme = localStorage.getItem('video-player-theme');
        if (!savedTheme) {
          applySystemTheme();
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [enableSystemTheme, applySystemTheme]);

  // Apply CSS custom properties for theme
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      
      // Apply color variables
      Object.entries(currentTheme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
      });
      
      // Apply spacing variables
      Object.entries(currentTheme.spacing).forEach(([key, value]) => {
        root.style.setProperty(`--spacing-${key}`, value);
      });
      
      // Apply typography variables
      root.style.setProperty('--font-family', currentTheme.typography.fontFamily);
      Object.entries(currentTheme.typography.fontSize).forEach(([key, value]) => {
        root.style.setProperty(`--font-size-${key}`, value);
      });
      
      // Apply other variables
      root.style.setProperty('--border-radius', currentTheme.borderRadius);
      Object.entries(currentTheme.shadows).forEach(([key, value]) => {
        root.style.setProperty(`--shadow-${key}`, value);
      });
    }
  }, [currentTheme]);

  const contextValue: ThemeContextValue = {
    theme: currentTheme,
    themeName,
    availableThemes,
    setTheme,
    toggleTheme,
    updateThemeConfig,
    resetTheme,
    createCustomTheme,
    exportTheme,
    importTheme,
    applySystemTheme,
    isDarkMode: currentTheme.mode === 'dark',
    isLightMode: currentTheme.mode === 'light'
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook to use theme context
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Convenience hooks
export function useThemeColors() {
  return useTheme().theme.colors;
}

export function useThemeSpacing() {
  return useTheme().theme.spacing;
}

export function useThemeTypography() {
  return useTheme().theme.typography;
}
