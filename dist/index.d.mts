import React$1 from 'react';
import { ClassValue } from 'clsx';

/**
 * Comprehensive video player configuration types
 * Enables granular control over every aspect of the player
 */
interface PlayerTheme {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
    controlsBackground?: string;
    progressColor?: string;
    bufferColor?: string;
}
interface ControlsVisibility {
    playPause?: boolean;
    progress?: boolean;
    volume?: boolean;
    quality?: boolean;
    fullscreen?: boolean;
    pictureInPicture?: boolean;
    theaterMode?: boolean;
    playbackRate?: boolean;
    keyboardShortcuts?: boolean;
    settings?: boolean;
    time?: boolean;
}
interface KeyboardShortcutsConfig {
    enabled?: boolean;
    customKeys?: {
        playPause?: string[];
        fullscreen?: string[];
        mute?: string[];
        pictureInPicture?: string[];
        theaterMode?: string[];
        seekForward?: string[];
        seekBackward?: string[];
        volumeUp?: string[];
        volumeDown?: string[];
        restart?: string[];
        jumpToPercent?: string[];
    };
}
interface GesturesConfig {
    enabled?: boolean;
    tapToPlay?: boolean;
    doubleTapSeek?: boolean;
    swipeVolume?: boolean;
    pinchToZoom?: boolean;
    seekOnSwipe?: boolean;
}
interface AutoBehavior {
    autoPlay?: boolean;
    autoHideControls?: boolean;
    autoHideDelay?: number;
    autoQuality?: boolean;
    autoPictureInPictureOnScroll?: boolean;
    autoTheaterOnLandscape?: boolean;
    rememberVolume?: boolean;
    rememberPlaybackRate?: boolean;
}
interface AnalyticsConfig {
    enabled?: boolean;
    trackPlay?: boolean;
    trackPause?: boolean;
    trackSeek?: boolean;
    trackQualityChange?: boolean;
    trackFullscreen?: boolean;
    trackPictureInPicture?: boolean;
    customEvents?: string[];
}
interface AdvancedFeatures {
    chapters?: boolean;
    subtitles?: boolean;
    thumbnailPreview?: boolean;
    miniPlayer?: boolean;
    playlist?: boolean;
    airPlay?: boolean;
    chromecast?: boolean;
    downloadButton?: boolean;
    shareButton?: boolean;
    loopButton?: boolean;
}
interface PlayerConfiguration {
    theme?: PlayerTheme;
    controls?: {
        show?: boolean;
        visibility?: ControlsVisibility;
        position?: 'bottom' | 'top' | 'overlay' | 'external';
        style?: 'youtube' | 'vimeo' | 'netflix' | 'minimal' | 'custom';
        size?: 'small' | 'medium' | 'large';
    };
    keyboard?: KeyboardShortcutsConfig;
    gestures?: GesturesConfig;
    auto?: AutoBehavior;
    analytics?: AnalyticsConfig;
    features?: AdvancedFeatures;
    responsive?: {
        enabled?: boolean;
        breakpoints?: {
            mobile?: number;
            tablet?: number;
            desktop?: number;
        };
        adaptiveControls?: boolean;
        hideControlsOnMobile?: string[];
    };
    performance?: {
        preload?: 'none' | 'metadata' | 'auto';
        lazy?: boolean;
        bufferAhead?: number;
        maxBufferLength?: number;
    };
    customization?: {
        css?: string;
        className?: string;
        hideDefaultStyles?: boolean;
        customIcons?: {
            [key: string]: React.ComponentType;
        };
    };
}
declare const PlayerPresets: {
    [key: string]: PlayerConfiguration;
};
declare const mergePlayerConfig: (base?: PlayerConfiguration, override?: PlayerConfiguration) => PlayerConfiguration;

interface ConfigurableVideoPlayerProps {
    src?: string;
    poster?: string;
    thumbnailUrl?: string;
    autoPlay?: boolean;
    muted?: boolean;
    loop?: boolean;
    playsInline?: boolean;
    className?: string;
    configOverride?: Partial<PlayerConfiguration>;
    aspectRatio?: 'auto' | '16/9' | '4/3' | '1/1' | '9/16' | '3/4' | 'custom';
    customAspectRatio?: string;
    onReady?: () => void;
    onPlay?: () => void;
    onPause?: () => void;
    onError?: (error: string) => void;
    onTimeUpdate?: (currentTime: number, duration: number) => void;
    onStateChange?: (state: any) => void;
}
declare const ConfigurableVideoPlayer: React$1.ForwardRefExoticComponent<ConfigurableVideoPlayerProps & React$1.RefAttributes<HTMLVideoElement>>;

/**
 * Main video player component
 * Combines video engine, controls, and gesture handling
 */

interface VideoPlayerProps {
    src: string;
    poster?: string;
    autoPlay?: boolean;
    muted?: boolean;
    loop?: boolean;
    playsInline?: boolean;
    className?: string;
    controls?: {
        show?: boolean;
        fullscreen?: boolean;
        quality?: boolean;
        volume?: boolean;
        progress?: boolean;
        playPause?: boolean;
        playbackRate?: boolean;
        pictureInPicture?: boolean;
        theaterMode?: boolean;
    };
    gestures?: {
        enabled?: boolean;
        tapToPlay?: boolean;
        doubleTapSeek?: boolean;
        swipeVolume?: boolean;
    };
    plugins?: Array<(player: any) => void>;
    onReady?: () => void;
    onPlay?: () => void;
    onPause?: () => void;
    onError?: (error: string) => void;
    onTimeUpdate?: (currentTime: number, duration: number) => void;
    onStateChange?: (state: any) => void;
}
declare const VideoPlayer: React$1.ForwardRefExoticComponent<VideoPlayerProps & React$1.RefAttributes<HTMLVideoElement>>;

/**
 * Browser and device compatibility utilities
 * Detects HLS support, device capabilities, and autoplay policies
 */
interface BrowserCapabilities {
    hasNativeHls: boolean;
    hasHlsJs: boolean;
    hasDashJs: boolean;
    isMobile: boolean;
    isIOS: boolean;
    isAndroid: boolean;
    supportsInlinePlayback: boolean;
    supportsAutoplay: boolean;
    supportsPictureInPicture: boolean;
}
declare const getBrowserCapabilities: () => Promise<BrowserCapabilities>;
/**
 * Get optimal streaming strategy based on browser capabilities
 */
declare const getStreamingStrategy: (capabilities: BrowserCapabilities, streamUrl: string) => "native" | "hlsjs" | "dashjs" | "direct" | "unsupported";

/**
 * Core video engine that handles different streaming protocols
 * Supports native HLS, HLS.js, and Dash.js with automatic fallback
 */

interface VideoEngineConfig {
    src: string;
    autoplay?: boolean;
    muted?: boolean;
    loop?: boolean;
    poster?: string;
    playsInline?: boolean;
}
interface VideoEngineEvents {
    onReady: () => void;
    onPlay: () => void;
    onPause: () => void;
    onTimeUpdate: (currentTime: number, duration: number) => void;
    onProgress: (buffered: number) => void;
    onVolumeChange: (volume: number, muted: boolean) => void;
    onQualityChange: (quality: string) => void;
    onError: (error: Error) => void;
    onLoadStart: () => void;
    onLoadEnd: () => void;
}
declare class VideoEngine {
    private videoElement;
    private hlsInstance?;
    private dashInstance?;
    private capabilities?;
    private currentStrategy?;
    private events;
    constructor(videoElement: HTMLVideoElement, events?: Partial<VideoEngineEvents>);
    /**
     * Initialize the video engine with capabilities detection
     */
    initialize(): Promise<void>;
    /**
     * Load a video source
     */
    loadSource(config: VideoEngineConfig): Promise<void>;
    /**
     * Load video using native HLS support (mainly iOS Safari)
     */
    private loadNativeHls;
    /**
     * Load direct video file (MP4, WebM, etc.)
     */
    private loadDirectVideo;
    /**
     * Load video using HLS.js
     */
    private loadHlsJs;
    /**
     * Load video using Dash.js
     */
    private loadDashJs;
    /**
     * Setup video element event listeners
     */
    private setupVideoElementEvents;
    /**
     * Get buffered percentage
     */
    private getBufferedPercentage;
    /**
     * Get available quality levels
     */
    getQualityLevels(): Array<{
        id: string;
        label: string;
        height?: number;
    }>;
    /**
     * Set quality level
     */
    setQuality(qualityId: string): void;
    /**
     * Clean up instances and remove event listeners
     */
    cleanup(): void;
    /**
     * Get current streaming strategy
     */
    getCurrentStrategy(): string | undefined;
    /**
     * Get browser capabilities
     */
    getCapabilities(): BrowserCapabilities | undefined;
}

/**
 * Video player state management hook
 * Handles playback state, progress, volume, and player controls
 */

interface VideoPlayerState {
    isPlaying: boolean;
    isPaused: boolean;
    isLoading: boolean;
    isMuted: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    buffered: number;
    quality: string;
    playbackRate: number;
    isFullscreen: boolean;
    isPictureInPicture: boolean;
    isTheaterMode: boolean;
    error: string | null;
    playCount: number;
    totalWatchTime: number;
    bufferingTime: number;
    averageBitrate: number;
    qualityChanges: number;
}
interface VideoPlayerControls {
    play: () => Promise<void>;
    pause: () => void;
    seek: (time: number) => void;
    setVolume: (volume: number) => void;
    toggleMute: () => void;
    toggleFullscreen: () => void;
    togglePictureInPicture: () => Promise<void>;
    toggleTheaterMode: () => void;
    setPlaybackRate: (rate: number) => void;
    setQuality: (qualityId: string) => void;
    load: (config: VideoEngineConfig) => Promise<void>;
}
interface UseVideoPlayerOptions {
    autoPlay?: boolean;
    muted?: boolean;
    volume?: number;
}
declare const useVideoPlayer: (videoRef: React.RefObject<HTMLVideoElement | null>, options?: UseVideoPlayerOptions) => {
    state: VideoPlayerState;
    controls: VideoPlayerControls;
    qualityLevels: {
        id: string;
        label: string;
        height?: number;
    }[];
    engine: VideoEngine | null;
};

/**
 * Mobile-optimized video controls inspired by VK Player
 * Features: Touch-friendly UI, gesture support, adaptive layout
 */

interface MobileVideoControlsProps {
    state: VideoPlayerState;
    controls: VideoPlayerControls;
    qualityLevels: Array<{
        id: string;
        label: string;
        height?: number;
    }>;
    className?: string;
    onShow?: () => void;
    onHide?: () => void;
    /** Enable thumbnail previews */
    thumbnailPreview?: boolean;
    /** Base URL for thumbnail images */
    thumbnailUrl?: string;
}
declare const MobileVideoControls: React$1.FC<MobileVideoControlsProps>;

/**
 * Video player controls component
 * Includes play/pause, progress bar, volume, quality, and fullscreen controls
 */

interface VideoControlsProps {
    state: VideoPlayerState;
    controls: VideoPlayerControls;
    qualityLevels: Array<{
        id: string;
        label: string;
        height?: number;
    }>;
    controlsConfig: {
        fullscreen?: boolean;
        quality?: boolean;
        volume?: boolean;
        progress?: boolean;
        playPause?: boolean;
        playbackRate?: boolean;
        pictureInPicture?: boolean;
        theaterMode?: boolean;
        settings?: boolean;
        time?: boolean;
    };
    onShow?: () => void;
    onHide?: () => void;
    className?: string;
}
declare const VideoControls: React$1.FC<VideoControlsProps>;

/**
 * Video thumbnail preview component for mobile and desktop
 * Shows thumbnail images on progress bar hover/touch
 */

interface VideoThumbnailProps {
    /** Current video duration in seconds */
    duration: number;
    /** Current time position for thumbnail */
    currentTime: number;
    /** Base URL for thumbnail images */
    thumbnailUrl?: string;
    /** Number of thumbnails per sprite sheet (optional) */
    thumbnailCount?: number;
    /** Thumbnail dimensions */
    thumbnailSize?: {
        width: number;
        height: number;
    };
    /** CSS classes */
    className?: string;
    /** Show time overlay */
    showTime?: boolean;
    /** Mobile optimized */
    isMobile?: boolean;
}
declare const VideoThumbnail: React$1.FC<VideoThumbnailProps>;

interface LoadingSpinnerProps {
    className?: string;
    size?: 'small' | 'medium' | 'large';
}
declare const LoadingSpinner: React$1.FC<LoadingSpinnerProps>;

/**
 * Error display component for video player
 */

interface ErrorDisplayProps {
    error: string;
    onRetry?: () => void;
    className?: string;
}
declare const ErrorDisplay: React$1.FC<ErrorDisplayProps>;

declare const VideoPlayerDemo: React$1.FC;

interface VideoSource {
    id: string;
    name: string;
    url: string;
    format: string;
    quality: string;
    size: string;
    description: string;
    features: string[];
    poster?: string;
    thumbnailUrl?: string;
    aspectRatio?: string;
}
interface VideoSourceSelectorProps {
    sources?: VideoSource[];
    selectedSource?: VideoSource;
    onSourceChange?: (source: VideoSource) => void;
    videoSources?: VideoSource[];
    selectedVideo?: VideoSource;
    onVideoSelect?: (source: VideoSource) => void;
    onSourceSelect?: (source: VideoSource) => Promise<void> | void;
    currentSource?: string;
    className?: string;
}
declare const VideoSourceSelector: React$1.FC<VideoSourceSelectorProps>;

interface PlayerConfigContextType {
    config: PlayerConfiguration;
    updateConfig: (newConfig: Partial<PlayerConfiguration>) => void;
    resetConfig: () => void;
    loadPreset: (presetName: string) => void;
    saveConfig: (name: string) => void;
    loadSavedConfig: (name: string) => void;
    getSavedConfigs: () => string[];
}
interface PlayerConfigProviderProps {
    children: React$1.ReactNode;
    defaultConfig?: PlayerConfiguration;
    storageKey?: string;
}
declare const PlayerConfigProvider: React$1.FC<PlayerConfigProviderProps>;
declare const usePlayerConfig: () => PlayerConfigContextType;
declare const usePlayerPresets: () => {
    presets: string[];
    loadPreset: (presetName: string) => void;
    getPresetConfig: (name: string) => PlayerConfiguration;
};

declare const PlayerConfigPanel: React$1.FC;

/**
 * Touch and gesture handling hook for mobile video player
 * Supports tap to play/pause, double tap to seek, swipe gestures
 */
interface GestureConfig {
    enableTapToPlay?: boolean;
    enableDoubleTapSeek?: boolean;
    enableSwipeVolume?: boolean;
    enableSwipeBrightness?: boolean;
    seekAmount?: number;
    volumeSensitivity?: number;
    brightnessSensitivity?: number;
}
interface GestureCallbacks {
    onTap?: () => void;
    onDoubleTap?: (direction: 'left' | 'right') => void;
    onSwipeVolume?: (delta: number) => void;
    onSwipeBrightness?: (delta: number) => void;
    onPinchZoom?: (scale: number) => void;
}
declare const useVideoGestures: (elementRef: React.RefObject<HTMLElement | null>, callbacks: GestureCallbacks, config?: GestureConfig) => {
    isGestureActive: boolean;
    config: {
        enableTapToPlay: boolean;
        enableDoubleTapSeek: boolean;
        enableSwipeVolume: boolean;
        enableSwipeBrightness: boolean;
        seekAmount: number;
        volumeSensitivity: number;
        brightnessSensitivity: number;
    };
};

declare function cn(...inputs: ClassValue[]): string;

declare const VERSION = "1.0.0";

export { type AdvancedFeatures, type AnalyticsConfig, type AutoBehavior, ConfigurableVideoPlayer, type ControlsVisibility, ErrorDisplay, type GestureCallbacks, type GestureConfig, type GesturesConfig, type KeyboardShortcutsConfig, LoadingSpinner, MobileVideoControls, PlayerConfigPanel, PlayerConfigProvider, type PlayerConfiguration, PlayerPresets, type PlayerTheme, VERSION, VideoControls, VideoEngine, type VideoEngineConfig, type VideoEngineEvents, VideoPlayer, type VideoPlayerControls, VideoPlayerDemo, type VideoPlayerState, VideoSourceSelector, VideoThumbnail, cn, getBrowserCapabilities, getStreamingStrategy, mergePlayerConfig, usePlayerConfig, usePlayerPresets, useVideoGestures, useVideoPlayer };
