/**
 * Configuration Context
 * Manages global configuration and settings for the video player
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

// Configuration interfaces
interface PlayerConfiguration {
  // Video settings
  autoplay: boolean;
  muted: boolean;
  loop: boolean;
  controls: boolean;
  preload: 'none' | 'metadata' | 'auto';
  defaultVolume: number;
  defaultQuality: string;
  defaultPlaybackRate: number;
  
  // UI settings
  showControls: boolean;
  showProgress: boolean;
  showVolume: boolean;
  showQuality: boolean;
  showPlaybackRate: boolean;
  showFullscreen: boolean;
  showPictureInPicture: boolean;
  showSubtitles: boolean;
  showChapters: boolean;
  
  // Behavior settings
  clickToPlay: boolean;
  doubleClickToFullscreen: boolean;
  keyboardShortcuts: boolean;
  gestureControls: boolean;
  autoHideControls: boolean;
  autoHideDelay: number;
  
  // Streaming settings
  enableAdaptiveBitrate: boolean;
  maxBitrate: number;
  bufferLength: number;
  maxBufferLength: number;
  enableLowLatency: boolean;
  
  // Accessibility settings
  enableKeyboardNavigation: boolean;
  enableScreenReader: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large';
  
  // Performance settings
  enableHardwareAcceleration: boolean;
  maxTextureSize: number;
  enableWebGL: boolean;
  fpsLimit: number;
  
  // Privacy settings
  enableAnalytics: boolean;
  enableCookies: boolean;
  enableLocalStorage: boolean;
  respectDoNotTrack: boolean;
}

interface AdvancedConfiguration {
  // Developer settings
  debugMode: boolean;
  enableLogging: boolean;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
  enablePerformanceMonitoring: boolean;
  
  // Experimental features
  enableExperimentalFeatures: boolean;
  experimentalCodecs: string[];
  enableWebAssembly: boolean;
  enableWorkers: boolean;
  
  // Custom settings
  customCSS: string;
  customJS: string;
  customHeaders: Record<string, string>;
  
  // Plugin settings
  enablePlugins: boolean;
  allowedPlugins: string[];
  pluginSandbox: boolean;
  
  // Security settings
  enableCSP: boolean;
  trustedDomains: string[];
  maxVideoSize: number;
  allowRemoteContent: boolean;
}

interface ConfigurationProfile {
  id: string;
  name: string;
  description: string;
  playerConfig: PlayerConfiguration;
  advancedConfig: AdvancedConfiguration;
  isDefault: boolean;
  isActive: boolean;
  lastUsed: number;
  createdAt: number;
  tags: string[];
}

interface ConfigurationPreset {
  id: string;
  name: string;
  description: string;
  category: 'basic' | 'advanced' | 'performance' | 'accessibility' | 'streaming';
  config: Partial<PlayerConfiguration & AdvancedConfiguration>;
  icon?: string;
  popular: boolean;
}

// Configuration context interface
interface ConfigurationContextValue {
  // Current configuration
  playerConfig: PlayerConfiguration;
  advancedConfig: AdvancedConfiguration;
  isLoading: boolean;
  isDirty: boolean;
  error?: Error;
  
  // Profiles
  profiles: ConfigurationProfile[];
  activeProfile?: ConfigurationProfile;
  
  // Presets
  availablePresets: ConfigurationPreset[];
  
  // Configuration management
  updatePlayerConfig: (config: Partial<PlayerConfiguration>) => void;
  updateAdvancedConfig: (config: Partial<AdvancedConfiguration>) => void;
  resetConfiguration: () => void;
  saveConfiguration: () => Promise<void>;
  loadConfiguration: (profileId?: string) => Promise<void>;
  
  // Profile management
  createProfile: (name: string, description?: string) => ConfigurationProfile;
  updateProfile: (profileId: string, updates: Partial<ConfigurationProfile>) => void;
  deleteProfile: (profileId: string) => void;
  switchProfile: (profileId: string) => Promise<void>;
  duplicateProfile: (profileId: string, newName: string) => ConfigurationProfile;
  
  // Preset management
  applyPreset: (presetId: string) => void;
  createPresetFromCurrent: (name: string, description: string, category: ConfigurationPreset['category']) => ConfigurationPreset;
  
  // Import/Export
  exportConfiguration: (format: 'json' | 'url') => string;
  importConfiguration: (data: string) => Promise<void>;
  
  // Validation
  validateConfiguration: (config: Partial<PlayerConfiguration & AdvancedConfiguration>) => { isValid: boolean; errors: string[] };
  
  // Watchers
  watchConfiguration: (key: keyof (PlayerConfiguration & AdvancedConfiguration), callback: (value: any) => void) => () => void;
  
  // Utilities
  getConfigurationValue: <T>(key: keyof (PlayerConfiguration & AdvancedConfiguration)) => T;
  setConfigurationValue: (key: keyof (PlayerConfiguration & AdvancedConfiguration), value: any) => void;
  
  // Default configurations
  getDefaultPlayerConfig: () => PlayerConfiguration;
  getDefaultAdvancedConfig: () => AdvancedConfiguration;
}

// Default configurations
const defaultPlayerConfig: PlayerConfiguration = {
  // Video settings
  autoplay: false,
  muted: false,
  loop: false,
  controls: true,
  preload: 'metadata',
  defaultVolume: 1,
  defaultQuality: 'auto',
  defaultPlaybackRate: 1,
  
  // UI settings
  showControls: true,
  showProgress: true,
  showVolume: true,
  showQuality: true,
  showPlaybackRate: true,
  showFullscreen: true,
  showPictureInPicture: true,
  showSubtitles: true,
  showChapters: true,
  
  // Behavior settings
  clickToPlay: true,
  doubleClickToFullscreen: true,
  keyboardShortcuts: true,
  gestureControls: true,
  autoHideControls: true,
  autoHideDelay: 3000,
  
  // Streaming settings
  enableAdaptiveBitrate: true,
  maxBitrate: 0, // 0 = unlimited
  bufferLength: 10,
  maxBufferLength: 30,
  enableLowLatency: false,
  
  // Accessibility settings
  enableKeyboardNavigation: true,
  enableScreenReader: true,
  highContrast: false,
  reducedMotion: false,
  fontSize: 'medium',
  
  // Performance settings
  enableHardwareAcceleration: true,
  maxTextureSize: 4096,
  enableWebGL: true,
  fpsLimit: 60,
  
  // Privacy settings
  enableAnalytics: true,
  enableCookies: true,
  enableLocalStorage: true,
  respectDoNotTrack: true
};

const defaultAdvancedConfig: AdvancedConfiguration = {
  // Developer settings
  debugMode: false,
  enableLogging: false,
  logLevel: 'error',
  enablePerformanceMonitoring: false,
  
  // Experimental features
  enableExperimentalFeatures: false,
  experimentalCodecs: [],
  enableWebAssembly: true,
  enableWorkers: true,
  
  // Custom settings
  customCSS: '',
  customJS: '',
  customHeaders: {},
  
  // Plugin settings
  enablePlugins: true,
  allowedPlugins: [],
  pluginSandbox: true,
  
  // Security settings
  enableCSP: true,
  trustedDomains: [],
  maxVideoSize: 1024 * 1024 * 1024, // 1GB
  allowRemoteContent: true
};

// Built-in presets
const builtInPresets: ConfigurationPreset[] = [
  {
    id: 'basic',
    name: 'Basic Player',
    description: 'Simple video player with essential controls',
    category: 'basic',
    config: {
      showQuality: false,
      showPlaybackRate: false,
      showChapters: false,
      keyboardShortcuts: false,
      gestureControls: false
    },
    popular: true
  },
  {
    id: 'advanced',
    name: 'Advanced Player',
    description: 'Full-featured player with all controls and options',
    category: 'advanced',
    config: {
      showControls: true,
      showProgress: true,
      showVolume: true,
      showQuality: true,
      showPlaybackRate: true,
      showFullscreen: true,
      showPictureInPicture: true,
      showSubtitles: true,
      showChapters: true,
      keyboardShortcuts: true,
      gestureControls: true,
      enableAdaptiveBitrate: true,
      debugMode: false
    },
    popular: true
  },
  {
    id: 'performance',
    name: 'Performance Optimized',
    description: 'Optimized for best performance and low resource usage',
    category: 'performance',
    config: {
      enableHardwareAcceleration: true,
      maxTextureSize: 2048,
      fpsLimit: 30,
      bufferLength: 5,
      maxBufferLength: 15,
      enableAnalytics: false,
      enableLogging: false
    },
    popular: true
  },
  {
    id: 'accessibility',
    name: 'Accessibility Enhanced',
    description: 'Optimized for users with accessibility needs',
    category: 'accessibility',
    config: {
      enableKeyboardNavigation: true,
      enableScreenReader: true,
      highContrast: true,
      reducedMotion: true,
      fontSize: 'large',
      autoHideControls: false,
      clickToPlay: false
    },
    popular: true
  },
  {
    id: 'streaming',
    name: 'Live Streaming',
    description: 'Optimized for live streaming content',
    category: 'streaming',
    config: {
      enableLowLatency: true,
      bufferLength: 3,
      maxBufferLength: 10,
      enableAdaptiveBitrate: true,
      preload: 'none',
      showChapters: false
    },
    popular: true
  }
];

// Create context
const ConfigurationContext = createContext<ConfigurationContextValue | undefined>(undefined);

// Provider props
interface ConfigurationProviderProps {
  children: React.ReactNode;
  initialConfig?: Partial<PlayerConfiguration & AdvancedConfiguration>;
  onConfigChange?: (config: PlayerConfiguration & AdvancedConfiguration) => void;
  enablePersistence?: boolean;
}

// Provider component
export function ConfigurationProvider({ 
  children, 
  initialConfig,
  onConfigChange,
  enablePersistence = true
}: ConfigurationProviderProps) {
  const [playerConfig, setPlayerConfig] = useState<PlayerConfiguration>(() => ({
    ...defaultPlayerConfig,
    ...initialConfig
  }));
  const [advancedConfig, setAdvancedConfig] = useState<AdvancedConfiguration>(() => ({
    ...defaultAdvancedConfig,
    ...initialConfig
  }));
  const [profiles, setProfiles] = useState<ConfigurationProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<ConfigurationProfile | undefined>();
  const [availablePresets] = useState<ConfigurationPreset[]>(builtInPresets);
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState<Error | undefined>();
  
  const watchers = useRef<Map<string, Set<(value: any) => void>>>(new Map());

  // Watch for configuration changes
  useEffect(() => {
    onConfigChange?.({ ...playerConfig, ...advancedConfig });
  }, [playerConfig, advancedConfig, onConfigChange]);

  // Update player configuration
  const updatePlayerConfig = useCallback((config: Partial<PlayerConfiguration>) => {
    setPlayerConfig(prev => {
      const updated = { ...prev, ...config };
      
      // Notify watchers
      Object.entries(config).forEach(([key, value]) => {
        const keyWatchers = watchers.current.get(key);
        if (keyWatchers) {
          keyWatchers.forEach(callback => callback(value));
        }
      });
      
      setIsDirty(true);
      return updated;
    });
  }, []);

  // Update advanced configuration
  const updateAdvancedConfig = useCallback((config: Partial<AdvancedConfiguration>) => {
    setAdvancedConfig(prev => {
      const updated = { ...prev, ...config };
      
      // Notify watchers
      Object.entries(config).forEach(([key, value]) => {
        const keyWatchers = watchers.current.get(key);
        if (keyWatchers) {
          keyWatchers.forEach(callback => callback(value));
        }
      });
      
      setIsDirty(true);
      return updated;
    });
  }, []);

  // Reset configuration to defaults
  const resetConfiguration = useCallback(() => {
    setPlayerConfig(defaultPlayerConfig);
    setAdvancedConfig(defaultAdvancedConfig);
    setIsDirty(true);
  }, []);

  // Save configuration
  const saveConfiguration = useCallback(async () => {
    if (!enablePersistence) return;

    try {
      setIsLoading(true);
      
      const configToSave = {
        playerConfig,
        advancedConfig,
        timestamp: Date.now()
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('video-player-configuration', JSON.stringify(configToSave));
      }

      setIsDirty(false);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [playerConfig, advancedConfig, enablePersistence]);

  // Load configuration
  const loadConfiguration = useCallback(async (profileId?: string) => {
    if (!enablePersistence) return;

    try {
      setIsLoading(true);
      
      if (profileId) {
        const profile = profiles.find(p => p.id === profileId);
        if (profile) {
          setPlayerConfig(profile.playerConfig);
          setAdvancedConfig(profile.advancedConfig);
          setActiveProfile(profile);
        }
      } else if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('video-player-configuration');
        if (saved) {
          const parsed = JSON.parse(saved);
          setPlayerConfig({ ...defaultPlayerConfig, ...parsed.playerConfig });
          setAdvancedConfig({ ...defaultAdvancedConfig, ...parsed.advancedConfig });
        }
      }

      setIsDirty(false);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [profiles, enablePersistence]);

  // Create profile
  const createProfile = useCallback((name: string, description = ''): ConfigurationProfile => {
    const profile: ConfigurationProfile = {
      id: `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      playerConfig: { ...playerConfig },
      advancedConfig: { ...advancedConfig },
      isDefault: profiles.length === 0,
      isActive: false,
      lastUsed: Date.now(),
      createdAt: Date.now(),
      tags: []
    };

    setProfiles(prev => [...prev, profile]);
    
    // Save to localStorage
    if (enablePersistence && typeof window !== 'undefined') {
      const savedProfiles = [...profiles, profile];
      localStorage.setItem('video-player-profiles', JSON.stringify(savedProfiles));
    }

    return profile;
  }, [playerConfig, advancedConfig, profiles, enablePersistence]);

  // Update profile
  const updateProfile = useCallback((profileId: string, updates: Partial<ConfigurationProfile>) => {
    setProfiles(prev => prev.map(profile => 
      profile.id === profileId 
        ? { ...profile, ...updates }
        : profile
    ));
    
    // Update active profile if it's the one being updated
    if (activeProfile?.id === profileId) {
      setActiveProfile(prev => prev ? { ...prev, ...updates } : undefined);
    }
  }, [activeProfile]);

  // Delete profile
  const deleteProfile = useCallback((profileId: string) => {
    setProfiles(prev => prev.filter(profile => profile.id !== profileId));
    
    if (activeProfile?.id === profileId) {
      setActiveProfile(undefined);
    }
    
    // Update localStorage
    if (enablePersistence && typeof window !== 'undefined') {
      const updatedProfiles = profiles.filter(profile => profile.id !== profileId);
      localStorage.setItem('video-player-profiles', JSON.stringify(updatedProfiles));
    }
  }, [activeProfile, profiles, enablePersistence]);

  // Switch profile
  const switchProfile = useCallback(async (profileId: string) => {
    await loadConfiguration(profileId);
    
    // Update last used timestamp
    updateProfile(profileId, { lastUsed: Date.now(), isActive: true });
    
    // Deactivate other profiles
    setProfiles(prev => prev.map(profile => ({
      ...profile,
      isActive: profile.id === profileId
    })));
  }, [loadConfiguration, updateProfile]);

  // Duplicate profile
  const duplicateProfile = useCallback((profileId: string, newName: string): ConfigurationProfile => {
    const originalProfile = profiles.find(p => p.id === profileId);
    if (!originalProfile) {
      throw new Error('Profile not found');
    }

    return createProfile(newName, `Copy of ${originalProfile.description}`);
  }, [profiles, createProfile]);

  // Apply preset
  const applyPreset = useCallback((presetId: string) => {
    const preset = availablePresets.find(p => p.id === presetId);
    if (!preset) return;

    const { config } = preset;
    
    // Separate player and advanced config
    const playerConfigUpdates: Partial<PlayerConfiguration> = {};
    const advancedConfigUpdates: Partial<AdvancedConfiguration> = {};
    
    Object.entries(config).forEach(([key, value]) => {
      if (key in defaultPlayerConfig) {
        (playerConfigUpdates as any)[key] = value;
      } else if (key in defaultAdvancedConfig) {
        (advancedConfigUpdates as any)[key] = value;
      }
    });

    updatePlayerConfig(playerConfigUpdates);
    updateAdvancedConfig(advancedConfigUpdates);
  }, [availablePresets, updatePlayerConfig, updateAdvancedConfig]);

  // Create preset from current configuration
  const createPresetFromCurrent = useCallback((name: string, description: string, category: ConfigurationPreset['category']): ConfigurationPreset => {
    const preset: ConfigurationPreset = {
      id: `preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      category,
      config: { ...playerConfig, ...advancedConfig },
      popular: false
    };

    // Add to available presets (in a real app, this might save to server)
    setError(new Error('Creating custom presets not implemented'));
    
    return preset;
  }, [playerConfig, advancedConfig]);

  // Export configuration
  const exportConfiguration = useCallback((format: 'json' | 'url'): string => {
    const configData = {
      playerConfig,
      advancedConfig,
      exportedAt: Date.now(),
      version: '1.0.0'
    };

    if (format === 'json') {
      return JSON.stringify(configData, null, 2);
    } else {
      // URL format with base64 encoding
      const encoded = btoa(JSON.stringify(configData));
      return `${window.location.origin}${window.location.pathname}?config=${encoded}`;
    }
  }, [playerConfig, advancedConfig]);

  // Import configuration
  const importConfiguration = useCallback(async (data: string) => {
    try {
      let configData;
      
      if (data.startsWith('http') || data.includes('config=')) {
        // URL format
        const url = new URL(data);
        const configParam = url.searchParams.get('config');
        if (!configParam) throw new Error('No configuration found in URL');
        configData = JSON.parse(atob(configParam));
      } else {
        // JSON format
        configData = JSON.parse(data);
      }

      // Validate and apply configuration
      const validation = validateConfiguration(configData);
      if (!validation.isValid) {
        throw new Error(`Invalid configuration: ${validation.errors.join(', ')}`);
      }

      setPlayerConfig({ ...defaultPlayerConfig, ...configData.playerConfig });
      setAdvancedConfig({ ...defaultAdvancedConfig, ...configData.advancedConfig });
      setIsDirty(true);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    }
  }, []);

  // Validate configuration
  const validateConfiguration = useCallback((config: Partial<PlayerConfiguration & AdvancedConfiguration>): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Validate volume
    if (config.defaultVolume !== undefined && (config.defaultVolume < 0 || config.defaultVolume > 1)) {
      errors.push('Default volume must be between 0 and 1');
    }

    // Validate playback rate
    if (config.defaultPlaybackRate !== undefined && (config.defaultPlaybackRate < 0.25 || config.defaultPlaybackRate > 4)) {
      errors.push('Default playback rate must be between 0.25 and 4');
    }

    // Validate buffer length
    if (config.bufferLength !== undefined && config.bufferLength < 1) {
      errors.push('Buffer length must be at least 1 second');
    }

    // Validate auto-hide delay
    if (config.autoHideDelay !== undefined && config.autoHideDelay < 1000) {
      errors.push('Auto-hide delay must be at least 1000ms');
    }

    return { isValid: errors.length === 0, errors };
  }, []);

  // Watch configuration changes
  const watchConfiguration = useCallback((key: keyof (PlayerConfiguration & AdvancedConfiguration), callback: (value: any) => void): (() => void) => {
    if (!watchers.current.has(key)) {
      watchers.current.set(key, new Set());
    }
    
    watchers.current.get(key)!.add(callback);
    
    // Return unsubscribe function
    return () => {
      const keyWatchers = watchers.current.get(key);
      if (keyWatchers) {
        keyWatchers.delete(callback);
      }
    };
  }, []);

  // Get configuration value
  const getConfigurationValue = useCallback(<T,>(key: keyof (PlayerConfiguration & AdvancedConfiguration)): T => {
    const allConfig = { ...playerConfig, ...advancedConfig };
    return allConfig[key] as T;
  }, [playerConfig, advancedConfig]);

  // Set configuration value
  const setConfigurationValue = useCallback((key: keyof (PlayerConfiguration & AdvancedConfiguration), value: any) => {
    if (key in playerConfig) {
      updatePlayerConfig({ [key]: value } as Partial<PlayerConfiguration>);
    } else if (key in advancedConfig) {
      updateAdvancedConfig({ [key]: value } as Partial<AdvancedConfiguration>);
    }
  }, [playerConfig, advancedConfig, updatePlayerConfig, updateAdvancedConfig]);

  // Get default configurations
  const getDefaultPlayerConfig = useCallback(() => ({ ...defaultPlayerConfig }), []);
  const getDefaultAdvancedConfig = useCallback(() => ({ ...defaultAdvancedConfig }), []);

  // Load saved data on mount
  useEffect(() => {
    if (enablePersistence && typeof window !== 'undefined') {
      // Load profiles
      const savedProfiles = localStorage.getItem('video-player-profiles');
      if (savedProfiles) {
        try {
          const profiles = JSON.parse(savedProfiles);
          setProfiles(profiles);
          
          // Set active profile
          const activeProfile = profiles.find((p: ConfigurationProfile) => p.isActive);
          if (activeProfile) {
            setActiveProfile(activeProfile);
          }
        } catch (error) {
          console.error('Failed to load saved profiles:', error);
        }
      }

      // Load configuration
      loadConfiguration();
    }
  }, [enablePersistence, loadConfiguration]);

  const contextValue: ConfigurationContextValue = {
    playerConfig,
    advancedConfig,
    isLoading,
    isDirty,
    error,
    profiles,
    activeProfile,
    availablePresets,
    updatePlayerConfig,
    updateAdvancedConfig,
    resetConfiguration,
    saveConfiguration,
    loadConfiguration,
    createProfile,
    updateProfile,
    deleteProfile,
    switchProfile,
    duplicateProfile,
    applyPreset,
    createPresetFromCurrent,
    exportConfiguration,
    importConfiguration,
    validateConfiguration,
    watchConfiguration,
    getConfigurationValue,
    setConfigurationValue,
    getDefaultPlayerConfig,
    getDefaultAdvancedConfig
  };

  return (
    <ConfigurationContext.Provider value={contextValue}>
      {children}
    </ConfigurationContext.Provider>
  );
}

// Hook to use configuration context
export function useConfiguration(): ConfigurationContextValue {
  const context = useContext(ConfigurationContext);
  if (context === undefined) {
    throw new Error('useConfiguration must be used within a ConfigurationProvider');
  }
  return context;
}

// Convenience hooks
export function usePlayerConfig() {
  const { playerConfig, updatePlayerConfig } = useConfiguration();
  return { config: playerConfig, updateConfig: updatePlayerConfig };
}

export function useAdvancedConfig() {
  const { advancedConfig, updateAdvancedConfig } = useConfiguration();
  return { config: advancedConfig, updateConfig: updateAdvancedConfig };
}

export function useConfigurationProfiles() {
  const { profiles, activeProfile, createProfile, switchProfile, deleteProfile } = useConfiguration();
  return { profiles, activeProfile, createProfile, switchProfile, deleteProfile };
}

export function useConfigurationPresets() {
  const { availablePresets, applyPreset } = useConfiguration();
  return { presets: availablePresets, applyPreset };
}
