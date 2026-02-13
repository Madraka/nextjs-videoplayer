/**
 * YouTube 2025/2026 mobile video controls — fully responsive
 * Center play/seek overlay + bottom progress-on-top + bubble row + bottom sheet settings
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
  SkipBack,
  SkipForward,
  Check,
  ChevronRight,
  X,
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { VideoThumbnail } from '@/components/player/video-thumbnail';
import type { VideoPlayerState, VideoPlayerControls } from '@/hooks/use-video-player';

interface MobileVideoControlsProps {
  state: VideoPlayerState;
  controls: VideoPlayerControls;
  qualityLevels: Array<{ id: string; label: string; height?: number }>;
  className?: string;
  onShow?: () => void;
  onHide?: () => void;
  thumbnailPreview?: boolean;
  thumbnailUrl?: string;
}

const formatTime = (seconds: number): string => {
  if (!isFinite(seconds)) return '0:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const playbackRateOptions = [
  { value: 0.5, label: '0.5x' },
  { value: 0.75, label: '0.75x' },
  { value: 1, label: 'Normal' },
  { value: 1.25, label: '1.25x' },
  { value: 1.5, label: '1.5x' },
  { value: 2, label: '2x' },
];

// 44px touch targets
const iconBtnClass =
  'flex items-center justify-center w-11 h-11 rounded-full text-white hover:bg-white/10 active:bg-white/20 transition-colors duration-200 touch-manipulation';

const iconClass = 'w-[22px] h-[22px]';

export const MobileVideoControls: React.FC<MobileVideoControlsProps> = ({
  state,
  controls,
  qualityLevels,
  className,
  onShow,
  onHide,
  thumbnailPreview = false,
  thumbnailUrl,
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [settingsPage, setSettingsPage] = useState<'main' | 'quality' | 'speed'>('main');
  const [isDragging, setIsDragging] = useState(false);
  const [seekingTime, setSeekingTime] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState<number>(0);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => { setIsMounted(true); }, []);

  const showControlsTemporarily = useCallback(() => {
    setIsVisible(true);
    onShow?.();
    if (hideTimeoutRef.current) { clearTimeout(hideTimeoutRef.current); hideTimeoutRef.current = null; }
    if (state.isPlaying && !showSettings) {
      hideTimeoutRef.current = setTimeout(() => { setIsVisible(false); onHide?.(); }, 3000);
    }
  }, [state.isPlaying, showSettings, onShow, onHide]);

  useEffect(() => {
    if (!state.isPlaying || showSettings) {
      setIsVisible(true);
      if (hideTimeoutRef.current) { clearTimeout(hideTimeoutRef.current); hideTimeoutRef.current = null; }
    }
  }, [state.isPlaying, showSettings]);

  const handleContainerTap = useCallback((e: React.MouseEvent) => {
    if (!isVisible) { e.preventDefault(); e.stopPropagation(); showControlsTemporarily(); return; }
    if (e.target === e.currentTarget) {
      if (showSettings) { setShowSettings(false); return; }
      setIsVisible(false);
      if (hideTimeoutRef.current) { clearTimeout(hideTimeoutRef.current); hideTimeoutRef.current = null; }
    }
  }, [isVisible, showControlsTemporarily, showSettings]);

  useEffect(() => { return () => { if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current); }; }, []);

  // Optimistic seek: during drag only update local seekingTime, commit on release
  const displayTime = seekingTime !== null ? seekingTime : state.currentTime;
  const progressPercentage = state.duration > 0 ? (displayTime / state.duration) * 100 : 0;
  const bufferedPercentage = state.buffered;

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

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) return;
    const time = positionFromClient(e.clientX);
    setSeekingTime(time);
    controls.seek(time);
    requestAnimationFrame(() => { setTimeout(() => setSeekingTime(null), 150); });
  };
  const handleProgressHover = (e: React.MouseEvent<HTMLDivElement>) => updateHover(e.clientX);

  const handleProgressMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    setSeekingTime(positionFromClient(e.clientX));
  }, [positionFromClient]);

  const handleProgressTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setSeekingTime(positionFromClient(e.touches[0].clientX));
  }, [positionFromClient]);

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (clientX: number) => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setSeekingTime(positionFromClient(clientX));
        updateHover(clientX);
      });
    };
    const onMouseMove = (e: MouseEvent) => onMove(e.clientX);
    const onTouchMove = (e: TouchEvent) => onMove(e.touches[0].clientX);
    const onEnd = () => {
      cancelAnimationFrame(rafRef.current);
      setIsDragging(false);
      setHoverTime(null);
      if (seekingTime !== null) controls.seek(seekingTime);
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

  const handleSeek = (direction: 'backward' | 'forward') => {
    const amt = 10;
    controls.seek(direction === 'backward'
      ? Math.max(0, state.currentTime - amt)
      : Math.min(state.duration, state.currentTime + amt));
    showControlsTemporarily();
  };

  const VolumeIcon = state.isMuted || state.volume === 0 ? VolumeX : state.volume < 0.5 ? Volume1 : Volume2;

  if (!isMounted) return null;

  return (
    <div
      className={cn(
        'absolute inset-0 flex flex-col text-white z-10 transition-opacity duration-300',
        isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-auto',
        className
      )}
      onClickCapture={handleContainerTap}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Top - status badges */}
      <div className={cn('flex items-center gap-1.5 p-2 transition-opacity duration-300', isVisible ? 'opacity-100' : 'opacity-0')}>
        {state.isLoading && (
          <div className="rounded-full bg-black/60 backdrop-blur-md p-2">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}
        {state.playbackRate !== 1 && (
          <div className="rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1">
            <span className="text-xs font-medium">{state.playbackRate}x</span>
          </div>
        )}
      </div>

      {/* Center - Play/Pause + Seek */}
      <div className="flex-1 flex items-center justify-center">
        <div className={cn('flex items-center gap-8 sm:gap-10 transition-opacity duration-300', isVisible ? 'opacity-100' : 'opacity-0')}>
          <button type="button"
            className="flex items-center justify-center w-14 h-14 rounded-full bg-black/50 backdrop-blur-md text-white active:scale-95 transition-all duration-200 touch-manipulation"
            onClick={() => handleSeek('backward')} disabled={!state.duration}>
            <SkipBack className="h-6 w-6" />
          </button>

          <button type="button"
            className="flex items-center justify-center w-[72px] h-[72px] rounded-full bg-black/60 backdrop-blur-md text-white active:scale-90 transition-all duration-200 touch-manipulation"
            onClick={() => { state.isPlaying ? controls.pause() : controls.play(); showControlsTemporarily(); }}
            disabled={!state.duration && !state.isLoading}>
            {state.isLoading ? <Loader2 className="h-9 w-9 animate-spin" />
              : state.isPlaying ? <Pause className="h-9 w-9" />
              : <Play className="h-9 w-9 ml-0.5" />}
          </button>

          <button type="button"
            className="flex items-center justify-center w-14 h-14 rounded-full bg-black/50 backdrop-blur-md text-white active:scale-95 transition-all duration-200 touch-manipulation"
            onClick={() => handleSeek('forward')} disabled={!state.duration}>
            <SkipForward className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Bottom area */}
      <div className={cn('transition-opacity duration-300', isVisible ? 'opacity-100' : 'opacity-0')}>
        {/* ─── Progress Bar (on top of bubbles) ─── */}
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
          {/* Hover/touch tooltip */}
          {hoverTime !== null && !thumbnailPreview && (
            <div className="absolute bottom-full mb-3 -translate-x-1/2 bg-black/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-xs font-medium pointer-events-none z-10 whitespace-nowrap shadow-lg"
              style={{ left: `${hoverX}%` }}>
              {formatTime(hoverTime)}
            </div>
          )}
          {thumbnailPreview && hoverTime !== null && (
            <div className="absolute bottom-full mb-2" style={{ left: `${hoverX}%`, transform: 'translateX(-50%)' }}>
              <VideoThumbnail duration={state.duration} currentTime={hoverTime}
                thumbnailUrl={thumbnailUrl} isMobile={true} thumbnailSize={{ width: 120, height: 68 }} />
            </div>
          )}

          <div className="h-5 flex items-end">
            <div className={cn('relative w-full transition-all duration-150',
              isDragging ? 'h-[5px]' : 'h-[3px] group-hover/progress:h-[5px]')}>
              <div className="absolute inset-0 bg-white/20" />
              <div className="absolute left-0 top-0 h-full bg-white/40" style={{ width: `${bufferedPercentage}%` }} />
              <div className="absolute left-0 top-0 h-full bg-red-600" style={{ width: `${progressPercentage}%` }} />
              {hoverTime !== null && (
                <div className="absolute top-0 h-full w-[2px] bg-white/60 pointer-events-none" style={{ left: `${hoverX}%` }} />
              )}
              <div className={cn(
                'absolute top-1/2 w-[14px] h-[14px] bg-red-600 rounded-full -translate-y-1/2 transition-all duration-150 shadow-md',
                isDragging ? 'opacity-100 scale-110' : 'opacity-0 group-hover/progress:opacity-100 group-hover/progress:scale-100'
              )} style={{ left: `calc(${progressPercentage}% - 7px)` }} />
            </div>
          </div>
        </div>

        {/* ─── Bottom Bubble Row ─── */}
        <div className="flex items-center gap-1.5 px-2 pb-2 pt-0.5">
          {/* Left Bubble: Time */}
          <div className="flex items-center rounded-full bg-black/60 backdrop-blur-md px-3 h-10 sm:h-11">
            <span className="text-white text-[11px] sm:text-xs tabular-nums whitespace-nowrap">
              {formatTime(displayTime)} <span className="text-white/50">/</span> {formatTime(state.duration)}
            </span>
          </div>

          <div className="flex-1 min-w-0" />

          {/* Right Bubble: Volume + Settings + Fullscreen */}
          <div className="flex items-center rounded-full bg-black/60 backdrop-blur-md">
            <button type="button" onClick={controls.toggleMute}
              title={state.isMuted ? 'Unmute' : 'Mute'} className={iconBtnClass}>
              <VolumeIcon className={iconClass} />
            </button>

            <button type="button"
              onClick={() => { setShowSettings(!showSettings); setSettingsPage('main'); }}
              title="Settings" className={cn(iconBtnClass, showSettings && 'bg-white/10')}>
              <Settings className={cn(iconClass, 'transition-transform duration-300', showSettings && 'rotate-45')} />
            </button>

            <button type="button" onClick={() => controls.toggleFullscreen()}
              title={state.isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'} className={iconBtnClass}>
              {state.isFullscreen ? <Minimize className={iconClass} /> : <Maximize className={iconClass} />}
            </button>
          </div>
        </div>
      </div>

      {/* ─── Bottom Sheet Settings ─── */}
      {showSettings && (
        <div className="absolute bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-200"
          onClick={(e) => e.stopPropagation()}>
          <div className="bg-neutral-900/95 backdrop-blur-lg rounded-t-2xl overflow-hidden"
            style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <h3 className="text-sm font-medium text-white">
                {settingsPage === 'main' && 'Settings'}
                {settingsPage === 'quality' && 'Quality'}
                {settingsPage === 'speed' && 'Playback Speed'}
              </h3>
              <button type="button"
                onClick={() => { settingsPage === 'main' ? setShowSettings(false) : setSettingsPage('main'); }}
                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 text-white/70">
                {settingsPage === 'main'
                  ? <X className="w-5 h-5" />
                  : <ChevronRight className="w-5 h-5 rotate-180" />}
              </button>
            </div>

            {/* Main */}
            {settingsPage === 'main' && (
              <div className="py-1">
                {qualityLevels.length > 0 && (
                  <button type="button"
                    className="flex items-center justify-between w-full px-4 py-3 hover:bg-white/5 active:bg-white/10 transition-colors touch-manipulation"
                    onClick={() => setSettingsPage('quality')}>
                    <div className="flex items-center gap-3">
                      <Settings className="w-5 h-5 text-white/70" />
                      <span className="text-sm text-white">Quality</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-white/50">{state.quality === 'auto' ? 'Auto' : state.quality}</span>
                      <ChevronRight className="w-4 h-4 text-white/40" />
                    </div>
                  </button>
                )}
                <button type="button"
                  className="flex items-center justify-between w-full px-4 py-3 hover:bg-white/5 active:bg-white/10 transition-colors touch-manipulation"
                  onClick={() => setSettingsPage('speed')}>
                  <div className="flex items-center gap-3">
                    <Gauge className="w-5 h-5 text-white/70" />
                    <span className="text-sm text-white">Playback speed</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-white/50">{state.playbackRate === 1 ? 'Normal' : `${state.playbackRate}x`}</span>
                    <ChevronRight className="w-4 h-4 text-white/40" />
                  </div>
                </button>

                {/* Volume slider */}
                <div className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={controls.toggleMute} className="flex-shrink-0">
                      <VolumeIcon className="w-5 h-5 text-white/70" />
                    </button>
                    <Slider min={0} max={100} step={1}
                      value={[Math.round((state.isMuted ? 0 : state.volume) * 100)]}
                      onValueChange={(v) => { if (Number.isFinite(v[0])) controls.setVolume(v[0] / 100); }}
                      className="flex-1 [&_[data-slot=slider-track]]:bg-white/20 [&_[data-slot=slider-track]]:h-1 [&_[data-slot=slider-range]]:bg-white [&_[data-slot=slider-thumb]]:bg-white [&_[data-slot=slider-thumb]]:border-white [&_[data-slot=slider-thumb]]:size-4"
                    />
                    <span className="text-xs text-white/50 tabular-nums w-8 text-right">
                      {Math.round((state.isMuted ? 0 : state.volume) * 100)}%
                    </span>
                  </div>
                </div>

                {/* PiP */}
                {typeof document !== 'undefined' && 'pictureInPictureEnabled' in document && (
                  <button type="button"
                    className="flex items-center w-full px-4 py-3 hover:bg-white/5 active:bg-white/10 transition-colors touch-manipulation"
                    onClick={() => { controls.togglePictureInPicture(); setShowSettings(false); }}>
                    <PictureInPicture className="w-5 h-5 text-white/70 mr-3" />
                    <span className="text-sm text-white">Picture-in-Picture</span>
                  </button>
                )}
              </div>
            )}

            {/* Quality */}
            {settingsPage === 'quality' && (
              <div className="py-1 max-h-64 overflow-y-auto animate-in slide-in-from-right-4 duration-200">
                {qualityLevels.map((level) => (
                  <button key={level.id} type="button"
                    className="flex items-center w-full px-4 py-3 hover:bg-white/5 active:bg-white/10 transition-colors touch-manipulation"
                    onClick={() => { controls.setQuality(level.id); setSettingsPage('main'); }}>
                    <span className="w-6 flex-shrink-0">
                      {state.quality === level.label && <Check className="w-4 h-4 text-white" />}
                    </span>
                    <span className={cn('text-sm', state.quality === level.label ? 'text-white font-medium' : 'text-white/80')}>
                      {level.label}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Speed */}
            {settingsPage === 'speed' && (
              <div className="py-1 animate-in slide-in-from-right-4 duration-200">
                {playbackRateOptions.map((opt) => (
                  <button key={opt.value} type="button"
                    className="flex items-center w-full px-4 py-3 hover:bg-white/5 active:bg-white/10 transition-colors touch-manipulation"
                    onClick={() => { controls.setPlaybackRate(opt.value); setSettingsPage('main'); }}>
                    <span className="w-6 flex-shrink-0">
                      {state.playbackRate === opt.value && <Check className="w-4 h-4 text-white" />}
                    </span>
                    <span className={cn('text-sm', state.playbackRate === opt.value ? 'text-white font-medium' : 'text-white/80')}>
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
