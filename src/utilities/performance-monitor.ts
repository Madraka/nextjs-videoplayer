/**
 * Performance Monitoring Utilities
 * Tracks and analyzes video player performance metrics
 */

export interface PerformanceMetrics {
  loadTime: number;
  bufferHealth: number;
  droppedFrames: number;
  decodedFrames: number;
  fps: number;
  bitrate: number;
  networkSpeed: number;
  memoryUsage: number;
  cpuUsage: number;
}

export interface LoadPerformance {
  firstByte: number;
  domReady: number;
  videoReady: number;
  firstFrame: number;
}

/**
 * Performance monitor class
 */
export class PerformanceMonitor {
  private metrics: PerformanceMetrics;
  private startTime: number;
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.metrics = this.getInitialMetrics();
    this.startTime = performance.now();
    this.setupObservers();
  }

  /**
   * Get initial metrics structure
   */
  private getInitialMetrics(): PerformanceMetrics {
    return {
      loadTime: 0,
      bufferHealth: 0,
      droppedFrames: 0,
      decodedFrames: 0,
      fps: 0,
      bitrate: 0,
      networkSpeed: 0,
      memoryUsage: 0,
      cpuUsage: 0
    };
  }

  /**
   * Setup performance observers
   */
  private setupObservers(): void {
    // TODO: Implement performance observers
    // - Monitor resource timing
    // - Track long tasks
    // - Monitor memory usage
    
    if (typeof window === 'undefined') return;

    try {
      // Resource timing observer
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.entryType === 'resource') {
            this.processResourceTiming(entry as PerformanceResourceTiming);
          }
        });
      });

      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);

      // Long task observer
      const longTaskObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.entryType === 'longtask') {
            this.processLongTask(entry);
          }
        });
      });

      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.push(longTaskObserver);
    } catch (error) {
      console.warn('Performance observers not supported:', error);
    }
  }

  /**
   * Process resource timing entry
   */
  private processResourceTiming(entry: PerformanceResourceTiming): void {
    // TODO: Implement resource timing processing
    // - Calculate network speed
    // - Track resource load times
    
    if (entry.transferSize && entry.duration) {
      const speed = (entry.transferSize * 8) / (entry.duration / 1000); // bits per second
      this.metrics.networkSpeed = speed;
    }
  }

  /**
   * Process long task entry
   */
  private processLongTask(entry: PerformanceEntry): void {
    // TODO: Implement long task processing
    // - Track CPU usage patterns
    // - Identify performance bottlenecks
    
    console.log('Long task detected:', entry.duration);
  }

  /**
   * Update video-specific metrics
   */
  updateVideoMetrics(videoElement: HTMLVideoElement): void {
    // TODO: Implement video metrics collection
    // - Extract video quality stats
    // - Monitor buffer health
    // - Track frame drops
    
    try {
      const videoStats = (videoElement as any).getVideoPlaybackQuality?.();
      
      if (videoStats) {
        this.metrics.droppedFrames = videoStats.droppedVideoFrames || 0;
        this.metrics.decodedFrames = videoStats.totalVideoFrames || 0;
      }

      // Calculate buffer health
      const buffered = videoElement.buffered;
      const currentTime = videoElement.currentTime;
      let bufferHealth = 0;

      if (buffered.length > 0) {
        for (let i = 0; i < buffered.length; i++) {
          if (buffered.start(i) <= currentTime && currentTime <= buffered.end(i)) {
            bufferHealth = buffered.end(i) - currentTime;
            break;
          }
        }
      }

      this.metrics.bufferHealth = bufferHealth;
    } catch (error) {
      console.warn('Failed to update video metrics:', error);
    }
  }

  /**
   * Calculate FPS
   */
  calculateFPS(): number {
    // TODO: Implement FPS calculation
    // - Use requestAnimationFrame
    // - Track frame timestamps
    // - Calculate average FPS
    
    let lastTime = 0;
    let frameCount = 0;
    let fps = 0;

    const calculateFrame = (currentTime: number) => {
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(calculateFrame);
    };

    requestAnimationFrame(calculateFrame);
    return fps;
  }

  /**
   * Get memory usage
   */
  getMemoryUsage(): number {
    // TODO: Implement memory usage tracking
    // - Use performance.memory if available
    // - Track heap usage
    
    try {
      const memory = (performance as any).memory;
      if (memory) {
        return memory.usedJSHeapSize / memory.jsHeapSizeLimit;
      }
    } catch {
      // Memory API not available
    }
    
    return 0;
  }

  /**
   * Get current metrics snapshot
   */
  getMetrics(): PerformanceMetrics {
    // TODO: Update all metrics before returning
    this.metrics.loadTime = performance.now() - this.startTime;
    this.metrics.memoryUsage = this.getMemoryUsage();
    this.metrics.fps = this.calculateFPS();
    
    return { ...this.metrics };
  }

  /**
   * Reset metrics
   */
  reset(): void {
    this.metrics = this.getInitialMetrics();
    this.startTime = performance.now();
  }

  /**
   * Cleanup observers
   */
  dispose(): void {
    this.observers.forEach(observer => {
      observer.disconnect();
    });
    this.observers = [];
  }
}

/**
 * Measure function execution time
 */
export function measureExecutionTime<T>(
  name: string,
  func: () => T
): { result: T; duration: number } {
  // TODO: Implement execution timing
  const start = performance.now();
  const result = func();
  const duration = performance.now() - start;
  
  console.log(`${name} took ${duration.toFixed(2)}ms`);
  
  return { result, duration };
}

/**
 * Measure async function execution time
 */
export async function measureAsyncExecutionTime<T>(
  name: string,
  func: () => Promise<T>
): Promise<{ result: T; duration: number }> {
  // TODO: Implement async execution timing
  const start = performance.now();
  const result = await func();
  const duration = performance.now() - start;
  
  console.log(`${name} took ${duration.toFixed(2)}ms`);
  
  return { result, duration };
}

/**
 * Create performance mark
 */
export function mark(name: string): void {
  try {
    performance.mark(name);
  } catch (error) {
    console.warn('Performance mark failed:', error);
  }
}

/**
 * Measure between two marks
 */
export function measure(name: string, startMark: string, endMark: string): number {
  try {
    performance.measure(name, startMark, endMark);
    const entries = performance.getEntriesByName(name, 'measure');
    return entries.length > 0 ? entries[entries.length - 1].duration : 0;
  } catch (error) {
    console.warn('Performance measure failed:', error);
    return 0;
  }
}
