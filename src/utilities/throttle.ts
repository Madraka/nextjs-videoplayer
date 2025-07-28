/**
 * Throttling Utilities
 * Limits function execution to specified intervals
 */

/**
 * Throttle function execution to specified interval
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  // TODO: Implement throttling
  // - Execute function at most once per limit period
  // - Handle leading and trailing execution
  
  let inThrottle = false;
  let lastFunc: NodeJS.Timeout | null = null;
  let lastRan: number | null = null;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      lastRan = Date.now();
      inThrottle = true;
    } else {
      if (lastFunc) {
        clearTimeout(lastFunc);
      }
      
      lastFunc = setTimeout(() => {
        if (lastRan && Date.now() - lastRan >= limit) {
          func(...args);
          lastRan = Date.now();
        }
      }, limit - (lastRan ? Date.now() - lastRan : 0));
    }
  };
}

/**
 * Throttle with leading/trailing options
 */
export function throttleAdvanced<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
  options: {
    leading?: boolean;
    trailing?: boolean;
  } = {}
): (...args: Parameters<T>) => void {
  // TODO: Implement advanced throttling
  // - Control leading execution
  // - Control trailing execution
  
  const { leading = true, trailing = true } = options;
  let timeout: NodeJS.Timeout | null = null;
  let previous = 0;
  let result: ReturnType<T>;
  
  const later = (args: Parameters<T>) => {
    previous = leading === false ? 0 : Date.now();
    timeout = null;
    result = func(...args);
  };
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    
    if (!previous && leading === false) {
      previous = now;
    }
    
    const remaining = limit - (now - previous);
    
    if (remaining <= 0 || remaining > limit) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func(...args);
    } else if (!timeout && trailing !== false) {
      timeout = setTimeout(() => later(args), remaining);
    }
    
    return result;
  };
}

/**
 * Throttle for animation frames
 */
export function throttleAnimationFrame<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => void {
  // TODO: Implement RAF throttling
  // - Use requestAnimationFrame for smooth animations
  // - Cancel previous frame requests
  
  let rafId: number | null = null;
  
  return (...args: Parameters<T>) => {
    if (rafId !== null) {
      return;
    }
    
    rafId = requestAnimationFrame(() => {
      func(...args);
      rafId = null;
    });
  };
}

/**
 * Throttle with promise support
 */
export function throttleAsync<T extends (...args: any[]) => Promise<any>>(
  func: T,
  limit: number
): (...args: Parameters<T>) => Promise<ReturnType<T> | null> {
  // TODO: Implement async throttling
  // - Return promise that resolves with function result
  // - Skip execution if already running
  
  let isRunning = false;
  let lastRun = 0;
  
  return async (...args: Parameters<T>): Promise<ReturnType<T> | null> => {
    const now = Date.now();
    
    if (isRunning || now - lastRun < limit) {
      return null;
    }
    
    isRunning = true;
    lastRun = now;
    
    try {
      const result = await func(...args);
      return result;
    } finally {
      isRunning = false;
    }
  };
}
