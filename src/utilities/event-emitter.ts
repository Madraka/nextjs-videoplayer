/**
 * Custom Event Emitter System
 * Provides type-safe event handling for player components
 */

export type EventCallback<T = any> = (data: T) => void;

export interface EventMap {
  [key: string]: any;
}

/**
 * Type-safe event emitter
 */
export class EventEmitter<T extends EventMap = EventMap> {
  private events: Map<keyof T, Set<EventCallback<T[keyof T]>>> = new Map();

  /**
   * Subscribe to an event
   */
  on<K extends keyof T>(event: K, callback: EventCallback<T[K]>): () => void {
    // TODO: Implement event subscription
    // - Store callback in events map
    // - Return unsubscribe function
    
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    
    const callbacks = this.events.get(event)!;
    callbacks.add(callback as EventCallback<T[keyof T]>);
    
    // Return unsubscribe function
    return () => {
      callbacks.delete(callback as EventCallback<T[keyof T]>);
      if (callbacks.size === 0) {
        this.events.delete(event);
      }
    };
  }

  /**
   * Subscribe to an event once
   */
  once<K extends keyof T>(event: K, callback: EventCallback<T[K]>): () => void {
    // TODO: Implement one-time event subscription
    // - Auto-unsubscribe after first call
    
    const unsubscribe = this.on(event, (data) => {
      unsubscribe();
      callback(data);
    });
    
    return unsubscribe;
  }

  /**
   * Emit an event
   */
  emit<K extends keyof T>(event: K, data: T[K]): void {
    // TODO: Implement event emission
    // - Call all registered callbacks
    // - Handle errors gracefully
    
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event callback for '${String(event)}':`, error);
        }
      });
    }
  }

  /**
   * Remove all listeners for an event
   */
  off<K extends keyof T>(event: K): void {
    // TODO: Implement event cleanup
    this.events.delete(event);
  }

  /**
   * Remove all listeners
   */
  removeAllListeners(): void {
    // TODO: Implement complete cleanup
    this.events.clear();
  }

  /**
   * Get listener count for an event
   */
  listenerCount<K extends keyof T>(event: K): number {
    const callbacks = this.events.get(event);
    return callbacks ? callbacks.size : 0;
  }
}

/**
 * Create a new event emitter instance
 */
export function createEventEmitter<T extends EventMap = EventMap>(): EventEmitter<T> {
  return new EventEmitter<T>();
}
