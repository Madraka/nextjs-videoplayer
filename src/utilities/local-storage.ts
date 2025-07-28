/**
 * Local Storage Utilities
 * Handles browser storage with error handling and type safety
 */

/**
 * Safe localStorage wrapper with JSON serialization
 */
export class LocalStorageManager {
  private prefix: string;

  constructor(prefix: string = 'video-player') {
    this.prefix = prefix;
  }

  /**
   * Store data in localStorage
   */
  set<T>(key: string, value: T): boolean {
    // TODO: Implement safe localStorage setting
    // - Handle JSON serialization
    // - Handle storage quota errors
    // - Use prefix for key namespacing
    
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(`${this.prefix}.${key}`, serializedValue);
      return true;
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
      return false;
    }
  }

  /**
   * Get data from localStorage
   */
  get<T>(key: string, defaultValue?: T): T | null {
    // TODO: Implement safe localStorage getting
    // - Handle JSON deserialization
    // - Handle missing keys
    // - Return default value if specified
    
    try {
      const item = localStorage.getItem(`${this.prefix}.${key}`);
      if (item === null) {
        return defaultValue ?? null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return defaultValue ?? null;
    }
  }

  /**
   * Remove item from localStorage
   */
  remove(key: string): boolean {
    // TODO: Implement safe localStorage removal
    try {
      localStorage.removeItem(`${this.prefix}.${key}`);
      return true;
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
      return false;
    }
  }

  /**
   * Clear all items with current prefix
   */
  clear(): boolean {
    // TODO: Implement prefixed localStorage clearing
    try {
      const keys = Object.keys(localStorage);
      const prefixedKeys = keys.filter(key => key.startsWith(`${this.prefix}.`));
      
      prefixedKeys.forEach(key => {
        localStorage.removeItem(key);
      });
      
      return true;
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
      return false;
    }
  }

  /**
   * Check if localStorage is available
   */
  isAvailable(): boolean {
    // TODO: Implement localStorage availability check
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get storage usage information
   */
  getStorageInfo(): { used: number; available: number } {
    // TODO: Implement storage usage calculation
    // - Calculate current usage
    // - Estimate available space
    
    try {
      let used = 0;
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length + key.length;
        }
      }
      
      // Rough estimate of available space (5MB typical limit)
      const totalEstimate = 5 * 1024 * 1024; // 5MB in bytes
      const available = Math.max(0, totalEstimate - used);
      
      return { used, available };
    } catch {
      return { used: 0, available: 0 };
    }
  }
}

/**
 * Default storage manager instance
 */
export const storage = new LocalStorageManager('video-player');

/**
 * Player-specific storage utilities
 */
export const playerStorage = {
  // Save player settings
  saveSettings: (settings: any) => storage.set('settings', settings),
  
  // Load player settings
  loadSettings: () => storage.get('settings', {}),
  
  // Save playback position
  savePosition: (videoId: string, position: number) => 
    storage.set(`position.${videoId}`, position),
  
  // Load playback position
  loadPosition: (videoId: string) => 
    storage.get<number>(`position.${videoId}`, 0),
  
  // Save volume level
  saveVolume: (volume: number) => storage.set('volume', volume),
  
  // Load volume level
  loadVolume: () => storage.get<number>('volume', 1),
  
  // Save quality preference
  saveQuality: (quality: string) => storage.set('quality', quality),
  
  // Load quality preference
  loadQuality: () => storage.get<string>('quality', 'auto')
};
