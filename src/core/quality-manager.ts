/**
 * Quality Level Management
 * Handles video quality selection and adaptive bitrate logic
 */

import type { QualityLevel, StreamingQuality, EngineMetrics } from '../types';

export interface QualityManagerConfig {
  enableAutoQuality: boolean;
  maxQuality?: QualityLevel;
  minQuality?: QualityLevel;
  bandwidthSafetyFactor: number;
  maxQualityJump: number;
  stabilityThreshold: number;
}

export class QualityManager {
  private config: QualityManagerConfig;
  private availableQualities: QualityLevel[] = [];
  private currentQuality?: QualityLevel;
  private qualityHistory: Array<{ level: QualityLevel; timestamp: number }> = [];
  private bandwidthHistory: number[] = [];
  private lastQualityChange = 0;
  private isAutoMode = true;

  constructor(config: Partial<QualityManagerConfig> = {}) {
    this.config = {
      enableAutoQuality: true,
      bandwidthSafetyFactor: 0.8,
      maxQualityJump: 2,
      stabilityThreshold: 5000, // 5 seconds
      ...config
    };
  }

  /**
   * Initialize with available quality levels
   */
  initialize(qualities: QualityLevel[]): void {
    this.availableQualities = qualities.sort((a, b) => a.bitrate - b.bitrate);
    
    // Set initial quality (lowest by default)
    if (this.availableQualities.length > 0) {
      this.currentQuality = this.availableQualities[0];
    }
  }

  /**
   * Get current streaming quality configuration
   */
  getStreamingQuality(): StreamingQuality {
    return {
      auto: this.isAutoMode,
      levels: this.availableQualities,
      currentLevel: this.currentQuality,
      adaptiveBitrate: this.config.enableAutoQuality
    };
  }

  /**
   * Set quality manually (disables auto mode)
   */
  setQuality(qualityId: string): boolean {
    const targetQuality = this.availableQualities.find(q => q.id === qualityId);
    
    if (!targetQuality) {
      return false;
    }

    this.isAutoMode = false;
    this.changeQuality(targetQuality, 'manual');
    return true;
  }

  /**
   * Enable/disable auto quality mode
   */
  setAutoMode(enabled: boolean): void {
    this.isAutoMode = enabled;
    
    if (enabled && this.config.enableAutoQuality) {
      // Reset to optimal quality based on current conditions
      this.evaluateQualityChange();
    }
  }

  /**
   * Update metrics and potentially change quality
   */
  updateMetrics(metrics: EngineMetrics): void {
    if (!this.isAutoMode || !this.config.enableAutoQuality) {
      return;
    }

    // Store bandwidth measurement
    if (metrics.networkSpeed > 0) {
      this.bandwidthHistory.push(metrics.networkSpeed);
      
      // Keep only recent measurements (last 10)
      if (this.bandwidthHistory.length > 10) {
        this.bandwidthHistory.shift();
      }
    }

    // Check if we should change quality
    this.evaluateQualityChange(metrics);
  }

  /**
   * Evaluate if quality should be changed
   */
  private evaluateQualityChange(metrics?: EngineMetrics): void {
    if (!this.currentQuality || this.availableQualities.length <= 1) {
      return;
    }

    const now = Date.now();
    const timeSinceLastChange = now - this.lastQualityChange;

    // Don't change too frequently
    if (timeSinceLastChange < this.config.stabilityThreshold) {
      return;
    }

    const avgBandwidth = this.getAverageBandwidth();
    const safeBandwidth = avgBandwidth * this.config.bandwidthSafetyFactor;

    // Determine target quality based on bandwidth
    const targetQuality = this.selectOptimalQuality(safeBandwidth, metrics);

    if (targetQuality && targetQuality.id !== this.currentQuality.id) {
      this.changeQuality(targetQuality, 'adaptive');
    }
  }

  /**
   * Select optimal quality based on available bandwidth
   */
  private selectOptimalQuality(bandwidth: number, metrics?: EngineMetrics): QualityLevel | null {
    if (bandwidth <= 0) {
      return null;
    }

    // Consider buffer health if metrics available
    let bandwidthMultiplier = 1;
    if (metrics) {
      if (metrics.bufferHealth < 0.3) {
        // Low buffer - be more conservative
        bandwidthMultiplier = 0.7;
      } else if (metrics.bufferHealth > 0.8 && !metrics.rebuffering) {
        // High buffer - can be more aggressive
        bandwidthMultiplier = 1.2;
      }
    }

    const effectiveBandwidth = bandwidth * bandwidthMultiplier;

    // Find highest quality that fits bandwidth
    let targetQuality: QualityLevel | null = null;
    
    for (const quality of this.availableQualities) {
      if (quality.bitrate <= effectiveBandwidth) {
        // Check quality jump constraint
        if (this.currentQuality) {
          const currentIndex = this.availableQualities.indexOf(this.currentQuality);
          const targetIndex = this.availableQualities.indexOf(quality);
          const jump = Math.abs(targetIndex - currentIndex);
          
          if (jump <= this.config.maxQualityJump) {
            targetQuality = quality;
          }
        } else {
          targetQuality = quality;
        }
      }
    }

    // Apply min/max constraints
    if (targetQuality) {
      if (this.config.maxQuality && targetQuality.bitrate > this.config.maxQuality.bitrate) {
        targetQuality = this.config.maxQuality;
      }
      if (this.config.minQuality && targetQuality.bitrate < this.config.minQuality.bitrate) {
        targetQuality = this.config.minQuality;
      }
    }

    return targetQuality;
  }

  /**
   * Change to new quality level
   */
  private changeQuality(newQuality: QualityLevel, reason: string): void {
    const oldQuality = this.currentQuality;
    this.currentQuality = newQuality;
    this.lastQualityChange = Date.now();

    // Record in history
    this.qualityHistory.push({
      level: newQuality,
      timestamp: this.lastQualityChange
    });

    // Keep history manageable
    if (this.qualityHistory.length > 50) {
      this.qualityHistory.shift();
    }

    console.log(`Quality changed: ${oldQuality?.label} → ${newQuality.label} (${reason})`);
  }

  /**
   * Calculate average bandwidth from recent measurements
   */
  private getAverageBandwidth(): number {
    if (this.bandwidthHistory.length === 0) {
      return 0;
    }

    // Use weighted average favoring recent measurements
    let weightedSum = 0;
    let totalWeight = 0;

    for (let i = 0; i < this.bandwidthHistory.length; i++) {
      const weight = i + 1; // More recent = higher weight
      weightedSum += this.bandwidthHistory[i] * weight;
      totalWeight += weight;
    }

    return weightedSum / totalWeight;
  }

  /**
   * Get available quality levels
   */
  getAvailableQualities(): QualityLevel[] {
    return [...this.availableQualities];
  }

  /**
   * Get current quality
   */
  getCurrentQuality(): QualityLevel | undefined {
    return this.currentQuality;
  }

  /**
   * Get quality change history
   */
  getQualityHistory(): Array<{ level: QualityLevel; timestamp: number }> {
    return [...this.qualityHistory];
  }

  /**
   * Reset manager state
   */
  reset(): void {
    this.qualityHistory = [];
    this.bandwidthHistory = [];
    this.lastQualityChange = 0;
    this.isAutoMode = true;
  }

  /**
   * Destroy and cleanup
   */
  destroy(): void {
    this.reset();
    this.availableQualities = [];
    this.currentQuality = undefined;
  }
}
