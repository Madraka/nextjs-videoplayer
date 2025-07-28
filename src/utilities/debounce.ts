/**
 * Debouncing Utilities
 * Delays function execution until after specified delay
 */

/**
 * Debounce function with configurable delay
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  // TODO: Implement debouncing
  // - Cancel previous timeouts
  // - Execute function after delay
  // - Handle cleanup
  
  let timeoutId: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Debounce with immediate execution option
 */
export function debounceImmediate<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
  immediate: boolean = false
): (...args: Parameters<T>) => void {
  // TODO: Implement immediate debouncing
  // - Execute immediately on first call if immediate=true
  // - Then debounce subsequent calls
  
  let timeoutId: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    const callNow = immediate && !timeoutId;
    
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (!immediate) {
        func(...args);
      }
    }, delay);
    
    if (callNow) {
      func(...args);
    }
  };
}

/**
 * Debounce with promise support
 */
export function debounceAsync<T extends (...args: any[]) => Promise<any>>(
  func: T,
  delay: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  // TODO: Implement async debouncing
  // - Return promise that resolves with function result
  // - Cancel previous pending calls
  
  let timeoutId: NodeJS.Timeout | null = null;
  let latestResolve: ((value: ReturnType<T>) => void) | null = null;
  let latestReject: ((reason: any) => void) | null = null;
  
  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return new Promise((resolve, reject) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        if (latestReject) {
          latestReject(new Error('Debounced call cancelled'));
        }
      }
      
      latestResolve = resolve;
      latestReject = reject;
      
      timeoutId = setTimeout(async () => {
        try {
          const result = await func(...args);
          if (latestResolve) {
            latestResolve(result);
          }
        } catch (error) {
          if (latestReject) {
            latestReject(error);
          }
        } finally {
          timeoutId = null;
          latestResolve = null;
          latestReject = null;
        }
      }, delay);
    });
  };
}
