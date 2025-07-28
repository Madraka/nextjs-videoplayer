/**
 * Deep Object Merging Utilities
 * Handles deep merging of configuration objects
 */

/**
 * Deep merge two or more objects
 */
export function deepMerge<T extends Record<string, any>>(
  target: T,
  ...sources: any[]
): T {
  // TODO: Implement deep object merging
  // - Handle nested objects recursively
  // - Handle arrays appropriately
  // - Avoid prototype pollution
  
  if (!sources.length) return target;
  
  const source = sources.shift();
  
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  
  return deepMerge(target, ...sources);
}

/**
 * Check if value is an object
 */
function isObject(item: any): item is Record<string, any> {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  // TODO: Implement deep cloning
  // - Handle all data types
  // - Avoid circular references
  // - Preserve object prototypes
  
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T;
  }
  
  if (typeof obj === 'object') {
    const cloned = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  
  return obj;
}

/**
 * Deep merge with array concatenation
 */
export function deepMergeWithArrays(
  target: any,
  ...sources: any[]
): any {
  // TODO: Implement deep merge with array handling
  // - Concatenate arrays instead of replacing
  // - Handle nested structures
  
  if (!sources.length) return target;
  
  const source = sources.shift();
  
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (Array.isArray(source[key])) {
        if (Array.isArray(target[key])) {
          target[key] = [...target[key], ...source[key]];
        } else {
          target[key] = [...source[key]];
        }
      } else if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMergeWithArrays(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  
  return deepMergeWithArrays(target, ...sources);
}

/**
 * Check if two objects are deeply equal
 */
export function deepEqual(a: any, b: any): boolean {
  // TODO: Implement deep equality check
  // - Compare all property values recursively
  // - Handle different data types
  
  if (a === b) return true;
  
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }
  
  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) {
    return a === b;
  }
  
  if (a === null || a === undefined || b === null || b === undefined) {
    return false;
  }
  
  if (a.prototype !== b.prototype) return false;
  
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) {
    return false;
  }
  
  return keys.every(k => deepEqual(a[k], b[k]));
}
