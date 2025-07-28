/**
 * Legacy Player Config Context - Compatibility Layer
 * This is a compatibility layer that redirects to the modern player-context.tsx
 */

// Re-export from modern player context for backward compatibility
export { PlayerProvider as PlayerConfigProvider, usePlayer as usePlayerConfig } from './player-context';
