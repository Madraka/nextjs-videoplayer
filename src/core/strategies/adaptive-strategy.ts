/**
 * Adaptive Strategy Implementation
 * Intelligent adaptive bitrate logic for optimal streaming
 */

import type { 
  StrategyInterface, 
  StrategyResult, 
  AdaptiveConfig 
} from './types';
import type { 
  EngineMetrics, 
  QualityLevel 
} from '../../types';

export class AdaptiveStrategy implements StrategyInterface {
  private config: AdaptiveConfig;
  private qualityLevels: QualityLevel[] = [];
  private lastEvaluation = 0;
  private stabilityCounter = 0;

  constructor(config: Partial<AdaptiveConfig> = {}) {
    this.config = {
      minBufferTime: 10, // seconds
      maxBufferTime: 30, // seconds  
      bandwidthSafetyFactor: 0.8,
      maxQualityJump: 1, // levels
      stabilityThreshold: 3, // evaluations
      ...config
    };
  }

  initialize(): void {
    this.lastEvaluation = 0;
    this.stabilityCounter = 0;
  }

  evaluate(metrics: EngineMetrics): StrategyResult {
    const now = Date.now();
    
    // Default result - no change
    const defaultResult: StrategyResult = {
      shouldChangeQuality: false,
      reason: 'No change needed',
      confidence: 0.5,
      nextEvaluationDelay: 2000
    };

    // Check if we have enough data
    if (!metrics.networkSpeed || this.qualityLevels.length === 0) {
      return defaultResult;
    }

    // Don't evaluate too frequently
    if (now - this.lastEvaluation < 1000) {
      return defaultResult;
    }

    this.lastEvaluation = now;

    // Calculate effective bandwidth
    const effectiveBandwidth = metrics.networkSpeed * this.config.bandwidthSafetyFactor;
    
    // Find optimal quality level
    const currentBitrate = metrics.currentBitrate;
    const targetLevel = this.findOptimalQuality(effectiveBandwidth, metrics);

    if (!targetLevel) {
      return defaultResult;
    }

    // Check if change is beneficial
    const shouldChange = this.shouldChangeQuality(currentBitrate, targetLevel.bitrate, metrics);
    
    if (shouldChange) {
      this.stabilityCounter = 0;
      return {
        shouldChangeQuality: true,
        targetQuality: targetLevel,
        reason: this.getChangeReason(currentBitrate, targetLevel.bitrate, metrics),
        confidence: this.calculateConfidence(metrics),
        nextEvaluationDelay: 3000
      };
    }

    this.stabilityCounter++;
    return defaultResult;
  }

  setQualityLevels(levels: QualityLevel[]): void {
    this.qualityLevels = levels.sort((a, b) => a.bitrate - b.bitrate);
  }

  private findOptimalQuality(bandwidth: number, metrics: EngineMetrics): QualityLevel | null {
    let bestQuality: QualityLevel | null = null;

    for (const quality of this.qualityLevels) {
      // Check if bandwidth can support this quality
      if (quality.bitrate <= bandwidth) {
        // Consider buffer health
        const bufferMultiplier = this.getBufferMultiplier(metrics.bufferHealth);
        
        if (quality.bitrate * bufferMultiplier <= bandwidth) {
          bestQuality = quality;
        }
      }
    }

    return bestQuality;
  }

  private shouldChangeQuality(currentBitrate: number, targetBitrate: number, metrics: EngineMetrics): boolean {
    // Don't change if bitrates are the same
    if (currentBitrate === targetBitrate) {
      return false;
    }

    // Always downgrade if rebuffering
    if (metrics.rebuffering && targetBitrate < currentBitrate) {
      return true;
    }

    // Check buffer health for upgrades
    if (targetBitrate > currentBitrate) {
      const bufferTime = metrics.bufferHealth * 30; // Assume 30s is max buffer
      if (bufferTime < this.config.minBufferTime) {
        return false; // Not enough buffer for upgrade
      }
    }

    // Check quality jump constraint
    const currentIndex = this.qualityLevels.findIndex(q => q.bitrate === currentBitrate);
    const targetIndex = this.qualityLevels.findIndex(q => q.bitrate === targetBitrate);
    
    if (currentIndex !== -1 && targetIndex !== -1) {
      const jump = Math.abs(targetIndex - currentIndex);
      if (jump > this.config.maxQualityJump) {
        return false;
      }
    }

    // Require stability for upgrades
    if (targetBitrate > currentBitrate && this.stabilityCounter < this.config.stabilityThreshold) {
      return false;
    }

    return true;
  }

  private getBufferMultiplier(bufferHealth: number): number {
    // Adjust bandwidth requirement based on buffer health
    if (bufferHealth < 0.3) {
      return 1.5; // Require 50% more bandwidth when buffer is low
    } else if (bufferHealth > 0.8) {
      return 0.8; // Can use 80% of bandwidth when buffer is high
    }
    return 1.0;
  }

  private getChangeReason(currentBitrate: number, targetBitrate: number, metrics: EngineMetrics): string {
    if (metrics.rebuffering) {
      return 'Rebuffering detected - downgrading quality';
    }
    
    if (targetBitrate > currentBitrate) {
      return 'Sufficient bandwidth available - upgrading quality';
    }
    
    if (targetBitrate < currentBitrate) {
      return 'Insufficient bandwidth - downgrading quality';
    }
    
    return 'Quality adjustment';
  }

  private calculateConfidence(metrics: EngineMetrics): number {
    let confidence = 0.5;

    // Higher confidence with stable network
    if (metrics.networkSpeed > 0) {
      confidence += 0.2;
    }

    // Higher confidence with good buffer health
    if (metrics.bufferHealth > 0.5) {
      confidence += 0.2;
    }

    // Lower confidence if rebuffering
    if (metrics.rebuffering) {
      confidence -= 0.3;
    }

    // Higher confidence with stability
    confidence += Math.min(0.2, this.stabilityCounter * 0.05);

    return Math.max(0.1, Math.min(0.9, confidence));
  }

  reset(): void {
    this.lastEvaluation = 0;
    this.stabilityCounter = 0;
  }

  destroy(): void {
    this.qualityLevels = [];
    this.reset();
  }
}
