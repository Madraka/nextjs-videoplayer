/**
 * Fallback Strategy Implementation
 * Engine fallback and error recovery logic
 */

import type { 
  StrategyInterface, 
  StrategyResult, 
  FallbackConfig 
} from './types';
import type { EngineMetrics } from '../../types';

export class FallbackStrategy implements StrategyInterface {
  private config: FallbackConfig;
  private retryCount = 0;
  private lastError?: string;

  constructor(config: Partial<FallbackConfig> = {}) {
    this.config = {
      maxRetries: 3,
      retryDelay: 1000,
      fallbackOrder: ['hls', 'dash', 'native', 'progressive'],
      enableFallbackOnError: true,
      fallbackThreshold: 0.2,
      ...config
    };
  }

  initialize(): void {
    this.retryCount = 0;
    this.lastError = undefined;
  }

  evaluate(metrics: EngineMetrics): StrategyResult {
    // Check if fallback is needed
    const needsFallback = this.evaluateFallbackNeed(metrics);

    if (needsFallback && this.retryCount < this.config.maxRetries) {
      this.retryCount++;
      
      return {
        shouldChangeQuality: false,
        reason: `Fallback attempt ${this.retryCount}/${this.config.maxRetries}`,
        confidence: 0.5,
        nextEvaluationDelay: this.config.retryDelay * this.retryCount
      };
    }

    return {
      shouldChangeQuality: false,
      reason: 'No fallback needed',
      confidence: 0.8,
      nextEvaluationDelay: 5000
    };
  }

  private evaluateFallbackNeed(metrics: EngineMetrics): boolean {
    // Check for continuous rebuffering
    if (metrics.rebuffering && metrics.bufferHealth < this.config.fallbackThreshold) {
      return true;
    }

    // Check for high dropped frame rate
    if (metrics.droppedFrames > 100) {
      return true;
    }

    return false;
  }

  triggerFallback(errorType: string): boolean {
    if (!this.config.enableFallbackOnError) {
      return false;
    }

    this.lastError = errorType;
    this.retryCount++;

    return this.retryCount <= this.config.maxRetries;
  }

  getNextFallbackEngine(): string | null {
    if (this.retryCount >= this.config.fallbackOrder.length) {
      return null;
    }

    return this.config.fallbackOrder[this.retryCount - 1];
  }

  reset(): void {
    this.retryCount = 0;
    this.lastError = undefined;
  }

  destroy(): void {
    this.reset();
  }
}
