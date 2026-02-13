import React$1 from 'react';
import { ClassValue } from 'clsx';

interface DrmSystemConfiguration {
    keySystem: string;
    licenseServerUrl?: string;
    headers?: Record<string, string>;
    audioCapabilities?: MediaKeySystemMediaCapability[];
    videoCapabilities?: MediaKeySystemMediaCapability[];
    initDataTypes?: string[];
    persistentState?: MediaKeysRequirement;
    distinctiveIdentifier?: MediaKeysRequirement;
    sessionTypes?: MediaKeySessionType[];
}
interface DrmLicenseRequestContext {
    keySystem: string;
    licenseServerUrl: string;
    headers: Record<string, string>;
    message: ArrayBuffer;
    session: MediaKeySession;
    signal: AbortSignal;
}
type DrmLicenseRequestHandler = (context: DrmLicenseRequestContext) => Promise<ArrayBuffer>;
interface DrmConfiguration {
    enabled: boolean;
    systems: DrmSystemConfiguration[];
    requestTimeoutMs?: number;
    licenseRequestHandler?: DrmLicenseRequestHandler;
}

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

interface VideoEnginePluginContext {
    videoElement: HTMLVideoElement;
}
interface VideoEnginePluginLoadPayload {
    src: string;
    strategy: string;
    capabilities: BrowserCapabilities;
}
interface VideoEnginePluginErrorPayload {
    src?: string;
    strategy?: string;
    error: Error;
}
interface VideoEnginePluginSourceLoadFailedPayload {
    src: string;
    strategy: string;
    error: Error;
    attempt: number;
    totalAttempts: number;
}
interface VideoEnginePluginRetryPayload {
    src: string;
    strategy: string;
    error: Error;
    attempt: number;
    retryAttempt: number;
    maxRetries: number;
    retryDelayMs: number;
}
interface VideoEnginePluginFailoverPayload {
    fromSrc: string;
    fromStrategy: string;
    toSrc: string;
    toStrategy: string;
    error: Error;
    attempt: number;
    totalAttempts: number;
}
interface VideoEnginePluginTimeUpdatePayload {
    currentTime: number;
    duration: number;
}
interface VideoEnginePluginVolumePayload {
    volume: number;
    muted: boolean;
}
interface VideoEnginePlugin {
    readonly name: string;
    setup?(context: VideoEnginePluginContext): void;
    onInit?(): void;
    onSourceLoadStart?(payload: VideoEnginePluginLoadPayload): void;
    onSourceLoaded?(payload: VideoEnginePluginLoadPayload): void;
    onSourceLoadFailed?(payload: VideoEnginePluginSourceLoadFailedPayload): void;
    onRetry?(payload: VideoEnginePluginRetryPayload): void;
    onFailover?(payload: VideoEnginePluginFailoverPayload): void;
    onPlay?(): void;
    onPause?(): void;
    onTimeUpdate?(payload: VideoEnginePluginTimeUpdatePayload): void;
    onVolumeChange?(payload: VideoEnginePluginVolumePayload): void;
    onQualityChange?(quality: string): void;
    onError?(payload: VideoEnginePluginErrorPayload): void;
    onDispose?(): void;
}

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
interface AnalyticsConfig$1 {
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
        size?: 'small' | 'medium' | 'large';
    };
    keyboard?: KeyboardShortcutsConfig;
    gestures?: GesturesConfig;
    auto?: AutoBehavior;
    analytics?: AnalyticsConfig$1;
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

interface AdapterSelectionContext {
    src: string;
    capabilities: BrowserCapabilities;
}
interface AdapterLoadContext extends AdapterSelectionContext {
    videoElement: HTMLVideoElement;
    onQualityChange?: (quality: string) => void;
    signal?: AbortSignal;
}
interface QualityLevel {
    id: string;
    label: string;
    height?: number;
}
interface StreamingAdapter {
    readonly id: string;
    load(context: AdapterLoadContext): Promise<void>;
    destroy(): void;
    getQualityLevels(): QualityLevel[];
    setQuality(qualityId: string): void;
}
interface StreamingAdapterFactory {
    readonly id: string;
    readonly priority: number;
    canHandle(context: AdapterSelectionContext): boolean;
    create(): StreamingAdapter;
}

interface EmeEnvironment {
    requestMediaKeySystemAccess: (keySystem: string, configurations: MediaKeySystemConfiguration[]) => Promise<MediaKeySystemAccess>;
    fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
}
interface EmeController {
    keySystem: string;
    destroy: () => void;
}
declare const isEmeSupported: (environment?: Partial<EmeEnvironment>) => boolean;
declare const createEmeController: (videoElement: HTMLVideoElement, configuration: DrmConfiguration, environment?: Partial<EmeEnvironment>) => Promise<EmeController>;

/**
 * Core video engine that handles different streaming protocols
 * Supports pluggable adapters and plugin lifecycle hooks.
 */

interface VideoEngineConfig {
    src: string;
    fallbackSources?: string[];
    signal?: AbortSignal;
    retryPolicy?: {
        maxRetries?: number;
        retryDelayMs?: number;
        maxRetryDelayMs?: number;
        backoffMultiplier?: number;
        jitterRatio?: number;
        retryOn?: Array<'network' | 'timeout' | 'server' | 'unsupported' | 'unknown' | 'all'>;
    };
    drm?: DrmConfiguration;
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
interface VideoEngineOptions {
    plugins?: VideoEnginePlugin[];
    adapters?: StreamingAdapterFactory[];
    capabilitiesResolver?: () => Promise<BrowserCapabilities>;
    emeEnvironment?: Partial<EmeEnvironment>;
}
declare class VideoEngine {
    private readonly videoElement;
    private readonly events;
    private readonly adapterRegistry;
    private readonly pluginManager;
    private readonly resolveCapabilities;
    private readonly emeEnvironment?;
    private activeAdapter?;
    private activeEmeController?;
    private capabilities?;
    private currentStrategy?;
    private currentSource?;
    private isDisposed;
    private initializationPromise?;
    private loadRequestId;
    private timeUpdateFrameId;
    private progressFrameId;
    private lastEmittedCurrentTime;
    private lastEmittedDuration;
    private lastEmittedBuffered;
    private readonly onPlayListener;
    private readonly onPauseListener;
    private readonly onTimeUpdateListener;
    private readonly onProgressListener;
    private readonly onVolumeChangeListener;
    private readonly onErrorListener;
    constructor(videoElement: HTMLVideoElement, events?: Partial<VideoEngineEvents>, options?: VideoEngineOptions);
    initialize(): Promise<void>;
    loadSource(config: VideoEngineConfig): Promise<void>;
    getQualityLevels(): QualityLevel[];
    setQuality(qualityId: string): void;
    cleanup(): void;
    dispose(): void;
    getCurrentStrategy(): string | undefined;
    getCapabilities(): BrowserCapabilities | undefined;
    getCurrentSource(): string | undefined;
    private applyVideoConfig;
    private setupVideoElementEvents;
    private removeVideoElementEvents;
    private getBufferedPercentage;
    private requestFrame;
    private cancelFrame;
    private cancelPendingFrames;
    private cleanupActiveAdapter;
    private setupDrm;
    private cleanupDrmController;
    private getCandidateSources;
    private getRetryLimit;
    private getRetryDelayMs;
    private getMaxRetryDelayMs;
    private getBackoffMultiplier;
    private getJitterRatio;
    private isSupersededLoadRequest;
    private assertActiveLoadRequest;
    private createSupersededLoadError;
    private assertNotAborted;
    private createAbortedLoadError;
    private isAbortedLoadError;
    private isRetriableLoadError;
    private classifyLoadError;
    private waitForRetryDelay;
    private calculateRetryDelay;
    private runWithAbortSignal;
    private assertNotDisposed;
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
    enginePlugins?: VideoEnginePlugin[];
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

interface ConfigurableVideoPlayerProps {
    src?: string;
    fallbackSources?: string[];
    drmConfig?: DrmConfiguration;
    poster?: string;
    thumbnailUrl?: string;
    autoPlay?: boolean;
    muted?: boolean;
    loop?: boolean;
    playsInline?: boolean;
    className?: string;
    configOverride?: Partial<PlayerConfiguration>;
    enginePlugins?: VideoEnginePlugin[];
    aspectRatio?: 'auto' | '16/9' | '4/3' | '1/1' | '9/16' | '3/4' | 'custom';
    customAspectRatio?: string;
    onReady?: () => void;
    onPlay?: () => void;
    onPause?: () => void;
    onError?: (error: string) => void;
    onTimeUpdate?: (currentTime: number, duration: number) => void;
    onStateChange?: (state: VideoPlayerState) => void;
}
declare const ConfigurableVideoPlayer: React$1.ForwardRefExoticComponent<ConfigurableVideoPlayerProps & React$1.RefAttributes<HTMLVideoElement>>;

/**
 * Main video player component
 * Combines video engine, controls, and gesture handling
 */

type LegacyPluginContext = {
    engine: unknown;
    state: unknown;
    controls: unknown;
};
type LegacyPlayerPlugin = (player: LegacyPluginContext) => void;
interface VideoPlayerProps {
    src: string;
    fallbackSources?: string[];
    drmConfig?: DrmConfiguration;
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
    plugins?: LegacyPlayerPlugin[];
    enginePlugins?: VideoEnginePlugin[];
    onReady?: () => void;
    onPlay?: () => void;
    onPause?: () => void;
    onError?: (error: string) => void;
    onTimeUpdate?: (currentTime: number, duration: number) => void;
    onStateChange?: (state: VideoPlayerState) => void;
}
declare const VideoPlayer: React$1.ForwardRefExoticComponent<VideoPlayerProps & React$1.RefAttributes<HTMLVideoElement>>;

/**
 * YouTube 2025/2026 mobile video controls — fully responsive
 * Center play/seek overlay + bottom progress-on-top + bubble row + bottom sheet settings
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
    thumbnailPreview?: boolean;
    thumbnailUrl?: string;
}
declare const MobileVideoControls: React$1.FC<MobileVideoControlsProps>;

/**
 * YouTube 2025/2026 style video player controls — fully responsive
 * Progress bar on top, bubble buttons below, unified settings panel
 * Works on desktop & mobile with adaptive sizing
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
 * YouTube-style error display for video player
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
    fallbackUrls?: string[];
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

declare class AdapterRegistry {
    private readonly factories;
    register(factory: StreamingAdapterFactory): void;
    resolve(context: AdapterSelectionContext): StreamingAdapterFactory | undefined;
    list(): readonly StreamingAdapterFactory[];
}

declare const defaultStreamingAdapters: StreamingAdapterFactory[];

declare class VideoEnginePluginManager {
    private readonly plugins;
    constructor(plugins?: VideoEnginePlugin[]);
    setup(context: VideoEnginePluginContext): void;
    onInit(): void;
    onSourceLoadStart(payload: VideoEnginePluginLoadPayload): void;
    onSourceLoaded(payload: VideoEnginePluginLoadPayload): void;
    onSourceLoadFailed(payload: VideoEnginePluginSourceLoadFailedPayload): void;
    onRetry(payload: VideoEnginePluginRetryPayload): void;
    onFailover(payload: VideoEnginePluginFailoverPayload): void;
    onPlay(): void;
    onPause(): void;
    onTimeUpdate(payload: VideoEnginePluginTimeUpdatePayload): void;
    onVolumeChange(payload: VideoEnginePluginVolumePayload): void;
    onQualityChange(quality: string): void;
    onError(payload: VideoEnginePluginErrorPayload): void;
    dispose(): void;
    private safeRun;
}

interface TokenLicenseRequestHandlerOptions {
    getToken: () => Promise<string>;
    refreshToken?: () => Promise<string>;
    headerName?: string;
    fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
}
declare const createTokenLicenseRequestHandler: (options: TokenLicenseRequestHandlerOptions) => DrmLicenseRequestHandler;

declare function cn(...inputs: ClassValue[]): string;

interface PlayerLogger {
    debug: (...args: unknown[]) => void;
    info: (...args: unknown[]) => void;
    warn: (...args: unknown[]) => void;
    error: (...args: unknown[]) => void;
}
interface ConsoleLoggerOptions {
    debug?: boolean;
    info?: boolean;
    warn?: boolean;
    error?: boolean;
}
declare const createConsoleLogger: (options?: ConsoleLoggerOptions) => PlayerLogger;
declare const setPlayerLogger: (logger: Partial<PlayerLogger> | null) => void;
declare const getPlayerLogger: () => PlayerLogger;

/**
 * Analytics plugin for video engine lifecycle events.
 */

interface AnalyticsConfig {
    enabled: boolean;
    apiEndpoint?: string;
    sampleRate?: number;
    events?: {
        play?: boolean;
        pause?: boolean;
        seek?: boolean;
        complete?: boolean;
        error?: boolean;
        source?: boolean;
    };
}
interface AnalyticsEvent {
    type: string;
    timestamp: number;
    source?: string;
    strategy?: string;
    currentTime?: number;
    duration?: number;
    error?: string;
    metadata?: Record<string, unknown>;
}
declare class AnalyticsPlugin implements VideoEnginePlugin {
    readonly name = "analytics";
    private readonly config;
    private readonly events;
    private readonly sessionId;
    private lastTimeUpdate?;
    private lastSource?;
    constructor(config: AnalyticsConfig);
    onSourceLoadStart(payload: VideoEnginePluginLoadPayload): void;
    onSourceLoaded(payload: VideoEnginePluginLoadPayload): void;
    onPlay(): void;
    onPause(): void;
    onTimeUpdate(payload: VideoEnginePluginTimeUpdatePayload): void;
    onError(payload: VideoEnginePluginErrorPayload): void;
    getEvents(): AnalyticsEvent[];
    clearEvents(): void;
    private track;
    private sendEvent;
    private generateSessionId;
}
declare const createAnalyticsPlugin: (config: AnalyticsConfig) => VideoEnginePlugin;

declare const VERSION: string;

export { type AdapterLoadContext, AdapterRegistry, type AdapterSelectionContext, type AdvancedFeatures, type AnalyticsConfig$1 as AnalyticsConfig, type AnalyticsEvent, AnalyticsPlugin, type AutoBehavior, ConfigurableVideoPlayer, type ConsoleLoggerOptions, type ControlsVisibility, type DrmConfiguration, type DrmLicenseRequestContext, type DrmLicenseRequestHandler, type DrmSystemConfiguration, type EmeController, type EmeEnvironment, type AnalyticsConfig as EngineAnalyticsConfig, ErrorDisplay, type GestureCallbacks, type GestureConfig, type GesturesConfig, type KeyboardShortcutsConfig, LoadingSpinner, MobileVideoControls, PlayerConfigPanel, PlayerConfigProvider, type PlayerConfiguration, type PlayerLogger, PlayerPresets, type PlayerTheme, type QualityLevel, type StreamingAdapter, type StreamingAdapterFactory, type TokenLicenseRequestHandlerOptions, VERSION, VideoControls, VideoEngine, type VideoEngineConfig, type VideoEngineEvents, type VideoEngineOptions, type VideoEnginePlugin, type VideoEnginePluginContext, type VideoEnginePluginErrorPayload, type VideoEnginePluginFailoverPayload, type VideoEnginePluginLoadPayload, VideoEnginePluginManager, type VideoEnginePluginRetryPayload, type VideoEnginePluginSourceLoadFailedPayload, type VideoEnginePluginTimeUpdatePayload, type VideoEnginePluginVolumePayload, VideoPlayer, type VideoPlayerControls, VideoPlayerDemo, type VideoPlayerState, type VideoSource, VideoSourceSelector, VideoThumbnail, cn, createAnalyticsPlugin, createConsoleLogger, createEmeController, createTokenLicenseRequestHandler, defaultStreamingAdapters, getBrowserCapabilities, getPlayerLogger, getStreamingStrategy, isEmeSupported, mergePlayerConfig, setPlayerLogger, usePlayerConfig, useVideoGestures, useVideoPlayer };
