/**
 * 🛠️ UTILITY FUNCTIONS - Helper Functions & Tools
 * 
 * ===============================================================================
 * 📋 PURPOSE: Reusable utility functions for common operations across the ecosystem
 * 🏗️ ARCHITECTURE: Pure functions + Helper utilities + Cross-platform compatibility
 * 🔗 RELATIONSHIPS: All modules → utilities → external libraries/APIs
 * ===============================================================================
 * 
 * 🧰 UTILITY CATEGORIES:
 * ├── 🕰️ Time Formatting - Human-readable time display
 * │   ├── ⏱️ Duration formatting (HH:MM:SS)
 * │   ├── 📅 Timestamp processing
 * │   └── 🔗 Used in: TimeDisplay, ProgressBar, Analytics
 * │
 * ├── 💾 File & Data Utilities - File size and data processing
 * │   ├── 📊 Byte formatting (KB, MB, GB)
 * │   ├── 📁 File type detection
 * │   └── 🔗 Used in: FileUpload, Analytics, MetricsDisplay
 * │
 * ├── 📱 Device Detection - Platform and capability detection
 * │   ├── 🖥️ Browser/device identification
 * │   ├── 📱 Mobile/desktop detection
 * │   └── 🔗 Used in: CompatibilityChecker, ResponsiveControls
 * │
 * ├── 🔔 Event System - Custom event management
 * │   ├── 📡 EventEmitter implementation
 * │   ├── 🎯 Custom event handling
 * │   └── 🔗 Used in: VideoEngine, PluginSystem, Analytics
 * │
 * ├── ⚡ Performance Utilities - Optimization helpers
 * │   ├── ⏰ Debounce/throttle functions
 * │   ├── 🎯 Performance monitoring
 * │   └── 🔗 Used in: UserInput, NetworkMonitoring, UI
 * │
 * ├── 🔧 Data Processing - Object and data manipulation
 * │   ├── 🔄 Deep merge operations
 * │   ├── 🎯 Data validation
 * │   └── 🔗 Used in: Configuration, StateManagement
 * │
 * ├── 💾 Storage Utilities - Data persistence helpers
 * │   ├── 🗄️ LocalStorage/SessionStorage wrappers
 * │   ├── 🔒 Secure storage operations
 * │   └── 🔗 Used in: UserPreferences, PlayerState
 * │
 * ├── 🌐 URL & Network - URL and network utilities
 * │   ├── ✅ URL validation
 * │   ├── 🔍 MIME type detection
 * │   └── 🔗 Used in: VideoSource, FormatDetection
 * │
 * ├── 📊 Performance Monitoring - Performance tracking
 * │   ├── ⏱️ Performance measurement
 * │   ├── 📈 Metrics collection
 * │   └── 🔗 Used in: PerformanceAnalytics, Optimization
 * │
 * └── ♿ Accessibility Helpers - A11y utility functions
 *     ├── 🎯 Focus management
 *     ├── 📢 Screen reader utilities
 *     └── 🔗 Used in: AccessibilityFeatures, A11yComponents
 * 
 * 🎯 INTEGRATION EXAMPLES:
 * ```typescript
 * // Time formatting
 * import { formatTime } from '@/utilities'
 * 
 * // Device detection
 * import { detectDevice, isMobile } from '@/utilities'
 * 
 * // Performance optimization
 * import { debounce, throttle } from '@/utilities'
 * 
 * // Complete utilities
 * import * as Utils from '@/utilities'
 * ```
 */

// 🕰️ Time & Duration Formatting
export * from './format-time'                                   // ⏱️ Duration formatting - used in: TimeDisplay, ProgressBar
export * from './format-bytes'                                  // 💾 File size formatting - used in: FileUpload, Analytics

// 📱 Device & Browser Detection
export * from './device-detection'                              // 📱 Platform detection - used in: CompatibilityChecker, ResponsiveUI
export * from './mime-type-detector'                            // 🔍 Format detection - used in: FormatDetector, VideoSource

// 🔔 Event & Communication
export * from './event-emitter'                                 // 📡 Custom events - used in: VideoEngine, PluginSystem

// ⚡ Performance Optimization
export * from './debounce'                                      // ⏰ Input debouncing - used in: UserInput, SearchBox
export * from './throttle'                                      // ⚡ Function throttling - used in: ScrollHandlers, NetworkCalls

// 🔧 Data Manipulation
export * from './deep-merge'                                    // 🔄 Object merging - used in: Configuration, StateManagement

// Storage utilities
export * from './local-storage';

// Validation utilities
export * from './url-validator';

// Performance utilities
export * from './performance-monitor';

// Accessibility utilities
export * from './accessibility-helpers';
