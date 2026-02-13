/**
 * YouTube 2025/2026 style video player controls — fully responsive
 * Progress bar on top, bubble buttons below, unified settings panel
 * Works on desktop & mobile with adaptive sizing
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  Volume1,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  Loader2,
  PictureInPicture,
  PictureInPicture2,
  Gauge,
  Monitor,
  Smartphone,
  Check,
  ChevronRight,
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { KeyboardShortcuts } from './keyboard-shortcuts';
import type { VideoPlayerState, VideoPlayerControls } from '@/hooks/use-video-player';

interface VideoControlsProps {
  state: VideoPlayerState;
  controls: VideoPlayerControls;
  qualityLevels: Array<{ id: string; label: string; height?: number }>;
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

// Format time in MM:SS or HH:MM:SS
const formatTime = (seconds: number): string => {
  if (!isFinite(seconds)) return '0:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Playback speed options
const playbackRateOptions = [
  { value: 0.25, label: '0.25x' },
  { value: 0.5, label: '0.5x' },
  { value: 0.75, label: '0.75x' },
  { value: 1, label: 'Normal' },
  { value: 1.25, label: '1.25x' },
  { value: 1.5, label: '1.5x' },
  { value: 1.75, label: '1.75x' },
  { value: 2, label: '2x' },
];

// YouTube-size icon button: 40px mobile → 44px desktop
const iconBtnClass =
  'flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full text-white hover:bg-white/10 active:bg-white/20 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none touch-manipulation';

// Icon size: 20px mobile → 22px desktop
const iconClass = 'w-5 h-5 sm:w-[22px] sm:h-[22px]';

type SettingsPage = 'main' | 'quality' | 'speed';

export const VideoControls: React.FC<VideoControlsProps> = ({
  state,
  controls,
  qualityLevels,
  controlsConfig,
  onShow,
  onHide,
  className,
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [seekingTime, setSeekingTime] = useState<number | null>(null); // optimistic seek position
  const [showSettings, setShowSettings] = useState(false);
  const [settingsPage, setSettingsPage] = useState<SettingsPage>('main');
  const [settingsDirection, setSettingsDirection] = useState<'forward' | 'back'>('forward');
  const progressRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => { setIsMounted(true); }, []);

  // Close settings on outside click / touch
  useEffect(() => {
    if (!showSettings) return;
    const handleClick = (e: MouseEvent | TouchEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setShowSettings(false);
      }
    };
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClick);
      document.addEventListener('touchstart', handleClick);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [showSettings]);

  const handlePlayPause = () => {
    if (state.isLoading) return;
    if (state.isPlaying && !state.isPaused) {
      controls.pause();
    } else if (state.isPaused && !state.isPlaying) {
      controls.play();
    }
  };

  // ── Progress bar: optimistic seek ──
  // During drag we only update local seekingTime for instant visual feedback.
  // The actual video.currentTime seek happens only on release (mouseup/touchend)
  // or on a single click. This prevents the "jumping" caused by stale timeupdate
  // events arriving between seek calls.

  const positionFromClient = useCallback((clientX: number): number => {
    if (!progressRef.current) return 0;
    const rect = progressRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    return (x / rect.width) * state.duration;
  }, [state.duration]);

  const updateHover = useCallback((clientX: number) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(x / rect.width, 1));
    setHoverTime(pct * state.duration);
    setHoverX(pct * 100);
  }, [state.duration]);

  // Single click = instant seek
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) return; // handled by drag end
    const time = positionFromClient(e.clientX);
    setSeekingTime(time);
    controls.seek(time);
    // Clear optimistic value once state catches up
    requestAnimationFrame(() => { setTimeout(() => setSeekingTime(null), 150); });
  };

  const handleProgressHover = (e: React.MouseEvent<HTMLDivElement>) => updateHover(e.clientX);

  // Drag start — set optimistic position, do NOT seek yet
  const handleProgressMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const time = positionFromClient(e.clientX);
    setIsDragging(true);
    setSeekingTime(time);
  }, [positionFromClient]);

  const handleProgressTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const time = positionFromClient(e.touches[0].clientX);
    setIsDragging(true);
    setSeekingTime(time);
  }, [positionFromClient]);

  // Global drag handlers: update optimistic position only, seek on release
  useEffect(() => {
    if (!isDragging) return;

    const onMove = (clientX: number) => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const time = positionFromClient(clientX);
        setSeekingTime(time);
        updateHover(clientX);
      });
    };
    const onMouseMove = (e: MouseEvent) => onMove(e.clientX);
    const onTouchMove = (e: TouchEvent) => onMove(e.touches[0].clientX);

    const onEnd = () => {
      cancelAnimationFrame(rafRef.current);
      setIsDragging(false);
      // Commit the seek on release
      if (seekingTime !== null) {
        controls.seek(seekingTime);
      }
      // Keep seekingTime visible briefly while video catches up
      setTimeout(() => setSeekingTime(null), 150);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onEnd);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [isDragging, positionFromClient, updateHover, seekingTime, controls]);

  // ── Volume ──
  const handleVolumeChange = (value: number[]) => {
    const rawValue = value[0];
    if (!Number.isFinite(rawValue)) return;
    controls.setVolume(rawValue / 100);
  };

  // ── Settings navigation ──
  const navigateSettings = (page: SettingsPage) => {
    setSettingsDirection('forward');
    setSettingsPage(page);
  };
  const goBackSettings = () => {
    setSettingsDirection('back');
    setSettingsPage('main');
  };
  const toggleSettings = () => {
    if (showSettings) { setShowSettings(false); }
    else { setSettingsPage('main'); setSettingsDirection('forward'); setShowSettings(true); }
  };

  // Use optimistic seekingTime when dragging or just released, otherwise real state
  const displayTime = seekingTime !== null ? seekingTime : state.currentTime;
  const progressPercentage = state.duration > 0 ? (displayTime / state.duration) * 100 : 0;
  const bufferedPercentage = state.buffered;

  const VolumeIcon = state.isMuted || state.volume === 0
    ? VolumeX : state.volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className={cn(
      'absolute bottom-0 left-0 right-0 z-30 pointer-events-auto',
      className
    )}>
      {/* ─── Progress Bar (on top) ─── */}
      {controlsConfig.progress && (
        <div
          ref={progressRef}
          className="group/progress relative w-full cursor-pointer touch-manipulation"
          onClick={handleProgressClick}
          onMouseMove={handleProgressHover}
          onMouseDown={handleProgressMouseDown}
          onMouseLeave={() => { if (!isDragging) setHoverTime(null); }}
          onTouchStart={handleProgressTouchStart}
          role="slider"
          aria-valuemin={0}
          aria-valuemax={state.duration || 0}
          aria-valuenow={displayTime}
          aria-valuetext={`${formatTime(displayTime)} of ${formatTime(state.duration)}`}
          tabIndex={0}
        >
          {/* Hover time tooltip */}
          {hoverTime !== null && (
            <div
              className="absolute bottom-full mb-3 -translate-x-1/2 bg-black/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-xs font-medium pointer-events-none z-10 whitespace-nowrap shadow-lg"
              style={{ left: `${hoverX}%` }}
            >
              {formatTime(hoverTime)}
            </div>
          )}

          {/* Hit area — tall enough for touch */}
          <div className="h-5 sm:h-5 flex items-end">
            <div className={cn(
              'relative w-full transition-all duration-150',
              isDragging ? 'h-[5px]' : 'h-[3px] group-hover/progress:h-[5px]'
            )}>
              <div className="absolute inset-0 bg-white/20" />
              <div className="absolute left-0 top-0 h-full bg-white/40" style={{ width: `${bufferedPercentage}%` }} />
              <div className="absolute left-0 top-0 h-full bg-red-600" style={{ width: `${progressPercentage}%` }} />
              {hoverTime !== null && (
                <div className="absolute top-0 h-full w-[2px] bg-white/60 pointer-events-none" style={{ left: `${hoverX}%` }} />
              )}
              <div
                className={cn(
                  'absolute top-1/2 w-[14px] h-[14px] bg-red-600 rounded-full -translate-y-1/2 transition-all duration-150 shadow-md',
                  'opacity-0 scale-75 group-hover/progress:opacity-100 group-hover/progress:scale-100',
                  isDragging && 'opacity-100 scale-110'
                )}
                style={{ left: `calc(${progressPercentage}% - 7px)` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ─── Controls Row (bubble containers) ─── */}
      <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 pb-2 sm:pb-2.5 pt-0.5">
        {/* ── Left Bubble: Play + Volume + Time ── */}
        <div className="flex items-center rounded-full bg-black/60 backdrop-blur-md">
          {controlsConfig.playPause && (
            <button type="button" onClick={handlePlayPause} disabled={state.isLoading}
              title={state.isPlaying ? 'Pause' : 'Play'} className={iconBtnClass}>
              {state.isLoading ? <Loader2 className={cn(iconClass, 'animate-spin')} />
                : state.isPlaying ? <Pause className={iconClass} />
                : <Play className={iconClass} />}
            </button>
          )}

          {controlsConfig.volume && (
            <div className="relative flex items-center"
              onMouseEnter={() => setShowVolumeSlider(true)} onMouseLeave={() => setShowVolumeSlider(false)}>
              <button type="button" onClick={controls.toggleMute}
                title={state.isMuted ? 'Unmute' : 'Mute'} className={iconBtnClass}>
                <VolumeIcon className={iconClass} />
              </button>
              {/* Horizontal slider — hidden on narrow, visible on hover (desktop) */}
              <div className={cn(
                'hidden sm:flex overflow-hidden transition-all duration-200 items-center',
                showVolumeSlider ? 'w-[80px] opacity-100' : 'w-0 opacity-0'
              )}>
                <Slider min={0} max={100} step={1}
                  value={[Math.round((state.isMuted ? 0 : state.volume) * 100)]}
                  onValueChange={handleVolumeChange}
                  className="w-[80px] [&_[data-slot=slider-track]]:bg-white/30 [&_[data-slot=slider-track]]:h-[3px] [&_[data-slot=slider-range]]:bg-white [&_[data-slot=slider-thumb]]:bg-white [&_[data-slot=slider-thumb]]:border-white [&_[data-slot=slider-thumb]]:size-3 [&_[data-slot=slider-thumb]]:shadow-md"
                />
              </div>
            </div>
          )}

          {controlsConfig.time !== false && (
            <span className="text-white/90 text-[11px] sm:text-xs tabular-nums whitespace-nowrap pr-2.5 sm:pr-3 pl-0.5 sm:pl-1 select-none">
              {formatTime(displayTime)} <span className="text-white/50">/</span> {formatTime(state.duration)}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0" />

        {/* ── Right Bubble ── */}
        <div className="flex items-center rounded-full bg-black/60 backdrop-blur-md">
          {/* Theater — desktop only */}
          {controlsConfig.theaterMode && (
            <button type="button" onClick={controls.toggleTheaterMode}
              title={state.isTheaterMode ? 'Exit Theater Mode' : 'Theater Mode'}
              className={cn(iconBtnClass, 'hidden sm:flex')}>
              {state.isTheaterMode ? <Smartphone className={iconClass} /> : <Monitor className={iconClass} />}
            </button>
          )}

          {/* PiP — desktop only */}
          {controlsConfig.pictureInPicture && isMounted && typeof document !== 'undefined' && 'pictureInPictureEnabled' in document && (
            <button type="button" onClick={controls.togglePictureInPicture}
              title={state.isPictureInPicture ? 'Exit PiP' : 'Picture-in-Picture'}
              className={cn(iconBtnClass, 'hidden sm:flex')}>
              {state.isPictureInPicture ? <PictureInPicture2 className={iconClass} /> : <PictureInPicture className={iconClass} />}
            </button>
          )}

          {/* Keyboard Shortcuts — desktop only */}
          <div className="hidden sm:block">
            <KeyboardShortcuts />
          </div>

          {/* Settings (always visible) */}
          {controlsConfig.settings !== false && (
            <div className="relative" ref={settingsRef}>
              <button type="button" onClick={toggleSettings} title="Settings"
                className={cn(iconBtnClass, showSettings && 'bg-white/10')}>
                <Settings className={cn(iconClass, 'transition-transform duration-300', showSettings && 'rotate-45')} />
              </button>

              {/* Settings Panel */}
              {showSettings && (
                <div className="absolute bottom-full right-0 mb-2 z-50">
                  <div className="bg-neutral-900/95 backdrop-blur-lg rounded-xl border border-white/10 shadow-2xl overflow-hidden w-[260px] sm:w-[280px]">
                    <div className="relative overflow-hidden">
                      {/* Main */}
                      {settingsPage === 'main' && (
                        <div className={cn(
                          'py-1',
                          settingsDirection === 'back' ? 'animate-in slide-in-from-left-4 duration-200' : 'animate-in fade-in duration-150'
                        )}>
                          {controlsConfig.playbackRate && (
                            <button type="button"
                              className="flex items-center w-full px-4 py-2.5 hover:bg-white/5 active:bg-white/10 transition-colors touch-manipulation"
                              onClick={() => navigateSettings('speed')}>
                              <Gauge className="w-5 h-5 text-white/70 mr-3 flex-shrink-0" />
                              <span className="text-sm text-white flex-1 text-left">Playback speed</span>
                              <span className="text-sm text-white/50 mr-1">
                                {state.playbackRate === 1 ? 'Normal' : `${state.playbackRate}x`}
                              </span>
                              <ChevronRight className="w-4 h-4 text-white/40" />
                            </button>
                          )}
                          {controlsConfig.quality && qualityLevels.length > 0 && (
                            <button type="button"
                              className="flex items-center w-full px-4 py-2.5 hover:bg-white/5 active:bg-white/10 transition-colors touch-manipulation"
                              onClick={() => navigateSettings('quality')}>
                              <Settings className="w-5 h-5 text-white/70 mr-3 flex-shrink-0" />
                              <span className="text-sm text-white flex-1 text-left">Quality</span>
                              <span className="text-sm text-white/50 mr-1">
                                {state.quality === 'auto' ? 'Auto' : state.quality}
                              </span>
                              <ChevronRight className="w-4 h-4 text-white/40" />
                            </button>
                          )}
                          {/* Volume slider — mobile only (inside settings) */}
                          <div className="sm:hidden px-4 py-2.5">
                            <div className="flex items-center gap-3">
                              <button type="button" onClick={controls.toggleMute} className="flex-shrink-0">
                                <VolumeIcon className="w-5 h-5 text-white/70" />
                              </button>
                              <Slider min={0} max={100} step={1}
                                value={[Math.round((state.isMuted ? 0 : state.volume) * 100)]}
                                onValueChange={handleVolumeChange}
                                className="flex-1 [&_[data-slot=slider-track]]:bg-white/20 [&_[data-slot=slider-track]]:h-1 [&_[data-slot=slider-range]]:bg-white [&_[data-slot=slider-thumb]]:bg-white [&_[data-slot=slider-thumb]]:border-white [&_[data-slot=slider-thumb]]:size-4"
                              />
                              <span className="text-xs text-white/50 tabular-nums w-8 text-right">
                                {Math.round((state.isMuted ? 0 : state.volume) * 100)}%
                              </span>
                            </div>
                          </div>
                          {/* PiP — mobile only (inside settings) */}
                          {controlsConfig.pictureInPicture && isMounted && typeof document !== 'undefined' && 'pictureInPictureEnabled' in document && (
                            <button type="button"
                              className="flex items-center w-full px-4 py-2.5 hover:bg-white/5 active:bg-white/10 transition-colors touch-manipulation sm:hidden"
                              onClick={() => { controls.togglePictureInPicture(); setShowSettings(false); }}>
                              <PictureInPicture className="w-5 h-5 text-white/70 mr-3 flex-shrink-0" />
                              <span className="text-sm text-white flex-1 text-left">Picture-in-Picture</span>
                            </button>
                          )}
                        </div>
                      )}

                      {/* Speed */}
                      {settingsPage === 'speed' && (
                        <div className="animate-in slide-in-from-right-4 duration-200">
                          <button type="button"
                            className="flex items-center w-full px-4 py-2.5 border-b border-white/10 hover:bg-white/5 active:bg-white/10 transition-colors touch-manipulation"
                            onClick={goBackSettings}>
                            <ChevronRight className="w-4 h-4 text-white/60 mr-2 rotate-180" />
                            <span className="text-sm font-medium text-white">Playback speed</span>
                          </button>
                          <div className="py-1 max-h-[300px] overflow-y-auto">
                            {playbackRateOptions.map((opt) => (
                              <button key={opt.value} type="button"
                                className="flex items-center w-full px-4 py-2.5 hover:bg-white/5 active:bg-white/10 transition-colors touch-manipulation"
                                onClick={() => { controls.setPlaybackRate(opt.value); goBackSettings(); }}>
                                <span className="w-6 flex-shrink-0">
                                  {state.playbackRate === opt.value && <Check className="w-4 h-4 text-white" />}
                                </span>
                                <span className={cn('text-sm', state.playbackRate === opt.value ? 'text-white font-medium' : 'text-white/80')}>
                                  {opt.label}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Quality */}
                      {settingsPage === 'quality' && (
                        <div className="animate-in slide-in-from-right-4 duration-200">
                          <button type="button"
                            className="flex items-center w-full px-4 py-2.5 border-b border-white/10 hover:bg-white/5 active:bg-white/10 transition-colors touch-manipulation"
                            onClick={goBackSettings}>
                            <ChevronRight className="w-4 h-4 text-white/60 mr-2 rotate-180" />
                            <span className="text-sm font-medium text-white">Quality</span>
                          </button>
                          <div className="py-1 max-h-[300px] overflow-y-auto">
                            {qualityLevels.map((level) => (
                              <button key={level.id} type="button"
                                className="flex items-center w-full px-4 py-2.5 hover:bg-white/5 active:bg-white/10 transition-colors touch-manipulation"
                                onClick={() => { controls.setQuality(level.id); goBackSettings(); }}>
                                <span className="w-6 flex-shrink-0">
                                  {state.quality === level.label && <Check className="w-4 h-4 text-white" />}
                                </span>
                                <span className={cn('text-sm', state.quality === level.label ? 'text-white font-medium' : 'text-white/80')}>
                                  {level.label}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Fullscreen (always visible) */}
          {controlsConfig.fullscreen && (
            <button type="button" onClick={controls.toggleFullscreen}
              title={state.isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'} className={iconBtnClass}>
              {state.isFullscreen ? <Minimize className={iconClass} /> : <Maximize className={iconClass} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
