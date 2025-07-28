/**
 * Bandwidth Strategy Implementation
 * Bandwidth measurement and optimization logic
 */

import type { 
  StrategyInterface, 
  StrategyResult, 
  BandwidthConfig 
} from './types';
import type { EngineMetrics } from '../../types';

export class BandwidthStrategy implements StrategyInterface {
  private config: BandwidthConfig;
  private measurements: number[] = [];

  constructor(config: Partial<BandwidthConfig> = {}) {
    this.config = {
      measurementWindow: 10000, // 10 seconds
      minSamples: 3,
      maxSamples: 10,
      weightedAverage: true,
      bandwidthMultiplier: 0.8,
      ...config
    };
  }

  initialize(): void {
    this.measurements = [];
  }

  evaluate(metrics: EngineMetrics): StrategyResult {
    // Store bandwidth measurement
    if (metrics.networkSpeed > 0) {
      this.addMeasurement(metrics.networkSpeed);
    }

    const avgBandwidth = this.getAverageBandwidth();
    const effectiveBandwidth = avgBandwidth * this.config.bandwidthMultiplier;

    return {
      shouldChangeQuality: false,
      reason: `Estimated bandwidth: ${Math.round(effectiveBandwidth / 1000)}kbps`,
      confidence: this.measurements.length >= this.config.minSamples ? 0.8 : 0.3,
      nextEvaluationDelay: 2000
    };
  }

  private addMeasurement(bandwidth: number): void {
    this.measurements.push(bandwidth);
    
    if (this.measurements.length > this.config.maxSamples) {
      this.measurements.shift();
    }
  }

  private getAverageBandwidth(): number {
    if (this.measurements.length === 0) {
      return 0;
    }

    if (this.config.weightedAverage) {
      let weightedSum = 0;
      let totalWeight = 0;

      for (let i = 0; i < this.measurements.length; i++) {
        const weight = i + 1; // Recent measurements have higher weight
        weightedSum += this.measurements[i] * weight;
        totalWeight += weight;
      }

      return weightedSum / totalWeight;
    } else {
      return this.measurements.reduce((sum, val) => sum + val, 0) / this.measurements.length;
    }
  }

  reset(): void {
    this.measurements = [];
  }

  destroy(): void {
    this.reset();
  }
}
