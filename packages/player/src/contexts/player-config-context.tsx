'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { PlayerConfiguration, PlayerPresets, mergePlayerConfig } from '@/types/player-config';
import { getPlayerLogger } from '@/lib/logger';

interface PlayerConfigContextType {
  config: PlayerConfiguration;
  updateConfig: (newConfig: Partial<PlayerConfiguration>) => void;
  resetConfig: () => void;
  saveConfig: (name: string) => void;
  loadSavedConfig: (name: string) => void;
  getSavedConfigs: () => string[];
}

const PlayerConfigContext = createContext<PlayerConfigContextType | undefined>(undefined);

interface PlayerConfigProviderProps {
  children: React.ReactNode;
  defaultConfig?: PlayerConfiguration;
  storageKey?: string;
}

export const PlayerConfigProvider: React.FC<PlayerConfigProviderProps> = ({
  children,
  defaultConfig = PlayerPresets.default,
  storageKey = 'nextjs-videoplayer-config',
}) => {
  const [config, setConfig] = useState<PlayerConfiguration>(defaultConfig);

  // Load saved config on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const savedConfig = JSON.parse(saved);
          setConfig(mergePlayerConfig(defaultConfig, savedConfig));
        } catch (error) {
          getPlayerLogger().warn('Failed to load saved player config:', error);
        }
      }
    }
  }, [defaultConfig, storageKey]);

  // Save config to localStorage
  const saveConfigToStorage = (newConfig: PlayerConfiguration) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(newConfig));
    }
  };

  const updateConfig = (newConfig: Partial<PlayerConfiguration>) => {
    const updatedConfig = mergePlayerConfig(config, newConfig);
    setConfig(updatedConfig);
    saveConfigToStorage(updatedConfig);
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
    saveConfigToStorage(defaultConfig);
  };

  const saveConfig = (name: string) => {
    if (typeof window !== 'undefined') {
      const savedConfigs = JSON.parse(localStorage.getItem(`${storageKey}-saved`) || '{}');
      savedConfigs[name] = config;
      localStorage.setItem(`${storageKey}-saved`, JSON.stringify(savedConfigs));
    }
  };

  const loadSavedConfig = (name: string) => {
    if (typeof window !== 'undefined') {
      const savedConfigs = JSON.parse(localStorage.getItem(`${storageKey}-saved`) || '{}');
      if (savedConfigs[name]) {
        setConfig(savedConfigs[name]);
        saveConfigToStorage(savedConfigs[name]);
      }
    }
  };

  const getSavedConfigs = (): string[] => {
    if (typeof window !== 'undefined') {
      const savedConfigs = JSON.parse(localStorage.getItem(`${storageKey}-saved`) || '{}');
      return Object.keys(savedConfigs);
    }
    return [];
  };

  return (
    <PlayerConfigContext.Provider
      value={{
        config,
        updateConfig,
        resetConfig,
        saveConfig,
        loadSavedConfig,
        getSavedConfigs,
      }}
    >
      {children}
    </PlayerConfigContext.Provider>
  );
};

export const usePlayerConfig = () => {
  const context = useContext(PlayerConfigContext);
  if (context === undefined) {
    throw new Error('usePlayerConfig must be used within a PlayerConfigProvider');
  }
  return context;
};
