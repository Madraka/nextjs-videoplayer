/**
 * Centralized Error Handling
 * Manages video player errors with recovery strategies
 */

import type { VideoError, ErrorType } from '../types';

export interface ErrorHandlerConfig {
  maxRetries: number;
  retryDelay: number;
  enableAutoRecovery: boolean;
  logErrors: boolean;
}

export interface ErrorRecoveryStrategy {
  canRecover(error: VideoError): boolean;
  recover(error: VideoError): Promise<boolean>;
  priority: number;
}

export class ErrorHandler {
  private config: ErrorHandlerConfig;
  private errorHistory: VideoError[] = [];
  private retryCount = new Map<string, number>();
  private recoveryStrategies: ErrorRecoveryStrategy[] = [];
  private onError?: (error: VideoError) => void;

  constructor(config: Partial<ErrorHandlerConfig> = {}) {
    this.config = {
      maxRetries: 3,
      retryDelay: 1000,
      enableAutoRecovery: true,
      logErrors: true,
      ...config
    };

    this.setupDefaultRecoveryStrategies();
  }

  /**
   * Set error callback handler
   */
  setErrorHandler(handler: (error: VideoError) => void): void {
    this.onError = handler;
  }

  /**
   * Handle an error with automatic recovery attempts
   */
  async handleError(
    type: ErrorType,
    code: string,
    message: string,
    details?: unknown
  ): Promise<boolean> {
    const error: VideoError = {
      type,
      code,
      message,
      details,
      recoverable: this.isRecoverable(type, code),
      timestamp: Date.now()
    };

    // Log error if enabled
    if (this.config.logErrors) {
      console.error('Video Error:', error);
    }

    // Add to history
    this.errorHistory.push(error);
    this.trimErrorHistory();

    // Notify error handler
    if (this.onError) {
      this.onError(error);
    }

    // Attempt recovery if enabled and error is recoverable
    if (this.config.enableAutoRecovery && error.recoverable) {
      return this.attemptRecovery(error);
    }

    return false;
  }

  /**
   * Attempt to recover from error using available strategies
   */
  private async attemptRecovery(error: VideoError): Promise<boolean> {
    const errorKey = `${error.type}-${error.code}`;
    const currentRetries = this.retryCount.get(errorKey) || 0;

    // Check retry limit
    if (currentRetries >= this.config.maxRetries) {
      console.warn(`Max retries exceeded for error: ${errorKey}`);
      return false;
    }

    // Increment retry count
    this.retryCount.set(errorKey, currentRetries + 1);

    // Sort strategies by priority
    const applicableStrategies = this.recoveryStrategies
      .filter(strategy => strategy.canRecover(error))
      .sort((a, b) => b.priority - a.priority);

    // Try each applicable strategy
    for (const strategy of applicableStrategies) {
      try {
        console.log(`Attempting recovery strategy for ${errorKey}...`);
        
        // Add delay before retry
        if (currentRetries > 0) {
          await this.delay(this.config.retryDelay * Math.pow(2, currentRetries - 1));
        }

        const recovered = await strategy.recover(error);
        
        if (recovered) {
          console.log(`Recovery successful for ${errorKey}`);
          this.retryCount.delete(errorKey);
          return true;
        }
      } catch (recoveryError) {
        console.warn('Recovery strategy failed:', recoveryError);
      }
    }

    console.warn(`All recovery strategies failed for ${errorKey}`);
    return false;
  }

  /**
   * Setup default recovery strategies
   */
  private setupDefaultRecoveryStrategies(): void {
    // Network error recovery
    this.addRecoveryStrategy({
      canRecover: (error) => error.type === 'NETWORK_ERROR',
      recover: async (error) => {
        // Simple retry for network errors
        console.log('Retrying after network error...');
        return true; // Let the engine handle the retry
      },
      priority: 10
    });

    // Media error recovery
    this.addRecoveryStrategy({
      canRecover: (error) => error.type === 'MEDIA_ERROR',
      recover: async (error) => {
        console.log('Attempting media error recovery...');
        // Could trigger video element reload
        return true;
      },
      priority: 8
    });

    // Decode error recovery
    this.addRecoveryStrategy({
      canRecover: (error) => error.type === 'DECODE_ERROR',
      recover: async (error) => {
        console.log('Attempting decode error recovery...');
        // Could try different quality level
        return true;
      },
      priority: 6
    });
  }

  /**
   * Add custom recovery strategy
   */
  addRecoveryStrategy(strategy: ErrorRecoveryStrategy): void {
    this.recoveryStrategies.push(strategy);
  }

  /**
   * Remove recovery strategy
   */
  removeRecoveryStrategy(strategy: ErrorRecoveryStrategy): void {
    const index = this.recoveryStrategies.indexOf(strategy);
    if (index > -1) {
      this.recoveryStrategies.splice(index, 1);
    }
  }

  /**
   * Check if error type is generally recoverable
   */
  private isRecoverable(type: ErrorType, code: string): boolean {
    const recoverableTypes: ErrorType[] = [
      'NETWORK_ERROR',
      'MEDIA_ERROR',
      'DECODE_ERROR'
    ];

    const nonRecoverableCodes = [
      'MEDIA_ERR_SRC_NOT_SUPPORTED',
      'CAPABILITY_NOT_SUPPORTED'
    ];

    return recoverableTypes.includes(type) && !nonRecoverableCodes.includes(code);
  }

  /**
   * Get error history
   */
  getErrorHistory(): VideoError[] {
    return [...this.errorHistory];
  }

  /**
   * Get recent errors (last 5 minutes)
   */
  getRecentErrors(minutes = 5): VideoError[] {
    const cutoff = Date.now() - (minutes * 60 * 1000);
    return this.errorHistory.filter(error => error.timestamp > cutoff);
  }

  /**
   * Clear error history
   */
  clearErrorHistory(): void {
    this.errorHistory = [];
    this.retryCount.clear();
  }

  /**
   * Get retry count for specific error
   */
  getRetryCount(type: ErrorType, code: string): number {
    return this.retryCount.get(`${type}-${code}`) || 0;
  }

  /**
   * Reset retry count for specific error
   */
  resetRetryCount(type: ErrorType, code: string): void {
    this.retryCount.delete(`${type}-${code}`);
  }

  /**
   * Trim error history to reasonable size
   */
  private trimErrorHistory(): void {
    const maxHistorySize = 100;
    if (this.errorHistory.length > maxHistorySize) {
      this.errorHistory = this.errorHistory.slice(-maxHistorySize);
    }
  }

  /**
   * Utility delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Create standard error objects
   */
  static createNetworkError(message: string, details?: unknown): VideoError {
    return {
      type: 'NETWORK_ERROR',
      code: 'NETWORK_FAILURE',
      message,
      details,
      recoverable: true,
      timestamp: Date.now()
    };
  }

  static createMediaError(code: string, message: string, details?: unknown): VideoError {
    return {
      type: 'MEDIA_ERROR',
      code,
      message,
      details,
      recoverable: true,
      timestamp: Date.now()
    };
  }

  static createDecodeError(message: string, details?: unknown): VideoError {
    return {
      type: 'DECODE_ERROR',
      code: 'DECODE_FAILURE',
      message,
      details,
      recoverable: true,
      timestamp: Date.now()
    };
  }

  static createFormatError(message: string, details?: unknown): VideoError {
    return {
      type: 'FORMAT_ERROR',
      code: 'UNSUPPORTED_FORMAT',
      message,
      details,
      recoverable: false,
      timestamp: Date.now()
    };
  }
}
