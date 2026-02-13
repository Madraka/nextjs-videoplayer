"use client";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};

// src/components/player/configurable-video-player.tsx
import React3, { forwardRef, useRef as useRef4, useEffect as useEffect5 } from "react";

// src/lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// src/components/controls/video-controls.tsx
import { useState, useEffect, useRef, useCallback } from "react";
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
  ChevronRight
} from "lucide-react";

// src/components/ui/slider.tsx
import * as SliderPrimitive from "@radix-ui/react-slider";
import { jsx, jsxs } from "react/jsx-runtime";
function Slider(_a) {
  var _b = _a, {
    className,
    defaultValue,
    value,
    min = 0,
    max = 100
  } = _b, props = __objRest(_b, [
    "className",
    "defaultValue",
    "value",
    "min",
    "max"
  ]);
  return /* @__PURE__ */ jsxs(
    SliderPrimitive.Root,
    __spreadProps(__spreadValues({
      "data-slot": "slider",
      defaultValue,
      value,
      min,
      max,
      className: cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      )
    }, props), {
      children: [
        /* @__PURE__ */ jsx(
          SliderPrimitive.Track,
          {
            "data-slot": "slider-track",
            className: cn(
              "bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
            ),
            children: /* @__PURE__ */ jsx(
              SliderPrimitive.Range,
              {
                "data-slot": "slider-range",
                className: cn(
                  "bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
                )
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          SliderPrimitive.Thumb,
          {
            "data-slot": "slider-thumb",
            className: "border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
          }
        )
      ]
    })
  );
}

// src/components/ui/dialog.tsx
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
function Dialog(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx2(DialogPrimitive.Root, __spreadValues({ "data-slot": "dialog" }, props));
}
function DialogTrigger(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx2(DialogPrimitive.Trigger, __spreadValues({ "data-slot": "dialog-trigger" }, props));
}
function DialogPortal(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx2(DialogPrimitive.Portal, __spreadValues({ "data-slot": "dialog-portal" }, props));
}
function DialogOverlay(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx2(
    DialogPrimitive.Overlay,
    __spreadValues({
      "data-slot": "dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )
    }, props)
  );
}
function DialogContent(_a) {
  var _b = _a, {
    className,
    children,
    showCloseButton = true
  } = _b, props = __objRest(_b, [
    "className",
    "children",
    "showCloseButton"
  ]);
  return /* @__PURE__ */ jsxs2(DialogPortal, { "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ jsx2(DialogOverlay, {}),
    /* @__PURE__ */ jsxs2(
      DialogPrimitive.Content,
      __spreadProps(__spreadValues({
        "data-slot": "dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )
      }, props), {
        children: [
          children,
          showCloseButton && /* @__PURE__ */ jsxs2(
            DialogPrimitive.Close,
            {
              "data-slot": "dialog-close",
              className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              children: [
                /* @__PURE__ */ jsx2(XIcon, {}),
                /* @__PURE__ */ jsx2("span", { className: "sr-only", children: "Close" })
              ]
            }
          )
        ]
      })
    )
  ] });
}
function DialogHeader(_a) {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx2(
    "div",
    __spreadValues({
      "data-slot": "dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className)
    }, props)
  );
}
function DialogTitle(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx2(
    DialogPrimitive.Title,
    __spreadValues({
      "data-slot": "dialog-title",
      className: cn("text-lg leading-none font-semibold", className)
    }, props)
  );
}

// src/components/controls/keyboard-shortcuts.tsx
import { Keyboard } from "lucide-react";
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var shortcuts = [
  { key: "Space / K", description: "Play/Pause" },
  { key: "F", description: "Toggle Fullscreen" },
  { key: "M", description: "Toggle Mute" },
  { key: "I", description: "Toggle Picture-in-Picture" },
  { key: "T", description: "Toggle Theater Mode" },
  { key: "\u2190", description: "Rewind 10 seconds" },
  { key: "\u2192", description: "Forward 10 seconds" },
  { key: "\u2191", description: "Volume up" },
  { key: "\u2193", description: "Volume down" },
  { key: "0", description: "Go to beginning" },
  { key: "1-9", description: "Go to 10%-90% of video" }
];
var KeyboardShortcuts = () => {
  return /* @__PURE__ */ jsxs3(Dialog, { children: [
    /* @__PURE__ */ jsx3(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsx3(
      "button",
      {
        type: "button",
        className: "flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full text-white hover:bg-white/10 active:bg-white/20 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none touch-manipulation",
        children: /* @__PURE__ */ jsx3(Keyboard, { className: "w-5 h-5 sm:w-[22px] sm:h-[22px]" })
      }
    ) }),
    /* @__PURE__ */ jsxs3(DialogContent, { className: "max-w-md", children: [
      /* @__PURE__ */ jsx3(DialogHeader, { children: /* @__PURE__ */ jsx3(DialogTitle, { children: "Keyboard Shortcuts" }) }),
      /* @__PURE__ */ jsx3("div", { className: "space-y-2", children: shortcuts.map((shortcut, index) => /* @__PURE__ */ jsxs3("div", { className: "flex justify-between items-center py-1", children: [
        /* @__PURE__ */ jsx3("span", { className: "text-sm text-muted-foreground", children: shortcut.description }),
        /* @__PURE__ */ jsx3("kbd", { className: "px-2 py-1 text-xs bg-muted rounded font-mono", children: shortcut.key })
      ] }, index)) })
    ] })
  ] });
};

// src/components/controls/video-controls.tsx
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
var formatTime = (seconds) => {
  if (!isFinite(seconds)) return "0:00";
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor(seconds % 3600 / 60);
  const secs = Math.floor(seconds % 60);
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};
var playbackRateOptions = [
  { value: 0.25, label: "0.25x" },
  { value: 0.5, label: "0.5x" },
  { value: 0.75, label: "0.75x" },
  { value: 1, label: "Normal" },
  { value: 1.25, label: "1.25x" },
  { value: 1.5, label: "1.5x" },
  { value: 1.75, label: "1.75x" },
  { value: 2, label: "2x" }
];
var iconBtnClass = "flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full text-white hover:bg-white/10 active:bg-white/20 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none touch-manipulation";
var iconClass = "w-5 h-5 sm:w-[22px] sm:h-[22px]";
var VideoControls = ({
  state,
  controls,
  qualityLevels,
  controlsConfig,
  onShow,
  onHide,
  className
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [hoverTime, setHoverTime] = useState(null);
  const [hoverX, setHoverX] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [seekingTime, setSeekingTime] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsPage, setSettingsPage] = useState("main");
  const [settingsDirection, setSettingsDirection] = useState("forward");
  const progressRef = useRef(null);
  const settingsRef = useRef(null);
  const rafRef = useRef(0);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    if (!showSettings) return;
    const handleClick = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setShowSettings(false);
      }
    };
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClick);
      document.addEventListener("touchstart", handleClick);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
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
  const positionFromClient = useCallback((clientX) => {
    if (!progressRef.current) return 0;
    const rect = progressRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    return x / rect.width * state.duration;
  }, [state.duration]);
  const updateHover = useCallback((clientX) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(x / rect.width, 1));
    setHoverTime(pct * state.duration);
    setHoverX(pct * 100);
  }, [state.duration]);
  const handleProgressClick = (e) => {
    if (isDragging) return;
    const time = positionFromClient(e.clientX);
    setSeekingTime(time);
    controls.seek(time);
    requestAnimationFrame(() => {
      setTimeout(() => setSeekingTime(null), 150);
    });
  };
  const handleProgressHover = (e) => updateHover(e.clientX);
  const handleProgressMouseDown = useCallback((e) => {
    e.preventDefault();
    const time = positionFromClient(e.clientX);
    setIsDragging(true);
    setSeekingTime(time);
  }, [positionFromClient]);
  const handleProgressTouchStart = useCallback((e) => {
    const time = positionFromClient(e.touches[0].clientX);
    setIsDragging(true);
    setSeekingTime(time);
  }, [positionFromClient]);
  useEffect(() => {
    if (!isDragging) return;
    const onMove = (clientX) => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const time = positionFromClient(clientX);
        setSeekingTime(time);
        updateHover(clientX);
      });
    };
    const onMouseMove = (e) => onMove(e.clientX);
    const onTouchMove = (e) => onMove(e.touches[0].clientX);
    const onEnd = () => {
      cancelAnimationFrame(rafRef.current);
      setIsDragging(false);
      if (seekingTime !== null) {
        controls.seek(seekingTime);
      }
      setTimeout(() => setSeekingTime(null), 150);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onEnd);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [isDragging, positionFromClient, updateHover, seekingTime, controls]);
  const handleVolumeChange = (value) => {
    const rawValue = value[0];
    if (!Number.isFinite(rawValue)) return;
    controls.setVolume(rawValue / 100);
  };
  const navigateSettings = (page) => {
    setSettingsDirection("forward");
    setSettingsPage(page);
  };
  const goBackSettings = () => {
    setSettingsDirection("back");
    setSettingsPage("main");
  };
  const toggleSettings = () => {
    if (showSettings) {
      setShowSettings(false);
    } else {
      setSettingsPage("main");
      setSettingsDirection("forward");
      setShowSettings(true);
    }
  };
  const displayTime = seekingTime !== null ? seekingTime : state.currentTime;
  const progressPercentage = state.duration > 0 ? displayTime / state.duration * 100 : 0;
  const bufferedPercentage = state.buffered;
  const VolumeIcon = state.isMuted || state.volume === 0 ? VolumeX : state.volume < 0.5 ? Volume1 : Volume2;
  return /* @__PURE__ */ jsxs4("div", { className: cn(
    "absolute bottom-0 left-0 right-0 z-30 pointer-events-auto",
    className
  ), children: [
    controlsConfig.progress && /* @__PURE__ */ jsxs4(
      "div",
      {
        ref: progressRef,
        className: "group/progress relative w-full cursor-pointer touch-manipulation",
        onClick: handleProgressClick,
        onMouseMove: handleProgressHover,
        onMouseDown: handleProgressMouseDown,
        onMouseLeave: () => {
          if (!isDragging) setHoverTime(null);
        },
        onTouchStart: handleProgressTouchStart,
        role: "slider",
        "aria-valuemin": 0,
        "aria-valuemax": state.duration || 0,
        "aria-valuenow": displayTime,
        "aria-valuetext": `${formatTime(displayTime)} of ${formatTime(state.duration)}`,
        tabIndex: 0,
        children: [
          hoverTime !== null && /* @__PURE__ */ jsx4(
            "div",
            {
              className: "absolute bottom-full mb-3 -translate-x-1/2 bg-black/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-xs font-medium pointer-events-none z-10 whitespace-nowrap shadow-lg",
              style: { left: `${hoverX}%` },
              children: formatTime(hoverTime)
            }
          ),
          /* @__PURE__ */ jsx4("div", { className: "h-5 sm:h-5 flex items-end", children: /* @__PURE__ */ jsxs4("div", { className: cn(
            "relative w-full transition-all duration-150",
            isDragging ? "h-[5px]" : "h-[3px] group-hover/progress:h-[5px]"
          ), children: [
            /* @__PURE__ */ jsx4("div", { className: "absolute inset-0 bg-white/20" }),
            /* @__PURE__ */ jsx4("div", { className: "absolute left-0 top-0 h-full bg-white/40", style: { width: `${bufferedPercentage}%` } }),
            /* @__PURE__ */ jsx4("div", { className: "absolute left-0 top-0 h-full bg-red-600", style: { width: `${progressPercentage}%` } }),
            hoverTime !== null && /* @__PURE__ */ jsx4("div", { className: "absolute top-0 h-full w-[2px] bg-white/60 pointer-events-none", style: { left: `${hoverX}%` } }),
            /* @__PURE__ */ jsx4(
              "div",
              {
                className: cn(
                  "absolute top-1/2 w-[14px] h-[14px] bg-red-600 rounded-full -translate-y-1/2 transition-all duration-150 shadow-md",
                  "opacity-0 scale-75 group-hover/progress:opacity-100 group-hover/progress:scale-100",
                  isDragging && "opacity-100 scale-110"
                ),
                style: { left: `calc(${progressPercentage}% - 7px)` }
              }
            )
          ] }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxs4("div", { className: "flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 pb-2 sm:pb-2.5 pt-0.5", children: [
      /* @__PURE__ */ jsxs4("div", { className: "flex items-center rounded-full bg-black/60 backdrop-blur-md", children: [
        controlsConfig.playPause && /* @__PURE__ */ jsx4(
          "button",
          {
            type: "button",
            onClick: handlePlayPause,
            disabled: state.isLoading,
            title: state.isPlaying ? "Pause" : "Play",
            className: iconBtnClass,
            children: state.isLoading ? /* @__PURE__ */ jsx4(Loader2, { className: cn(iconClass, "animate-spin") }) : state.isPlaying ? /* @__PURE__ */ jsx4(Pause, { className: iconClass }) : /* @__PURE__ */ jsx4(Play, { className: iconClass })
          }
        ),
        controlsConfig.volume && /* @__PURE__ */ jsxs4(
          "div",
          {
            className: "relative flex items-center",
            onMouseEnter: () => setShowVolumeSlider(true),
            onMouseLeave: () => setShowVolumeSlider(false),
            children: [
              /* @__PURE__ */ jsx4(
                "button",
                {
                  type: "button",
                  onClick: controls.toggleMute,
                  title: state.isMuted ? "Unmute" : "Mute",
                  className: iconBtnClass,
                  children: /* @__PURE__ */ jsx4(VolumeIcon, { className: iconClass })
                }
              ),
              /* @__PURE__ */ jsx4("div", { className: cn(
                "hidden sm:flex overflow-hidden transition-all duration-200 items-center",
                showVolumeSlider ? "w-[80px] opacity-100" : "w-0 opacity-0"
              ), children: /* @__PURE__ */ jsx4(
                Slider,
                {
                  min: 0,
                  max: 100,
                  step: 1,
                  value: [Math.round((state.isMuted ? 0 : state.volume) * 100)],
                  onValueChange: handleVolumeChange,
                  className: "w-[80px] [&_[data-slot=slider-track]]:bg-white/30 [&_[data-slot=slider-track]]:h-[3px] [&_[data-slot=slider-range]]:bg-white [&_[data-slot=slider-thumb]]:bg-white [&_[data-slot=slider-thumb]]:border-white [&_[data-slot=slider-thumb]]:size-3 [&_[data-slot=slider-thumb]]:shadow-md"
                }
              ) })
            ]
          }
        ),
        controlsConfig.time !== false && /* @__PURE__ */ jsxs4("span", { className: "text-white/90 text-[11px] sm:text-xs tabular-nums whitespace-nowrap pr-2.5 sm:pr-3 pl-0.5 sm:pl-1 select-none", children: [
          formatTime(displayTime),
          " ",
          /* @__PURE__ */ jsx4("span", { className: "text-white/50", children: "/" }),
          " ",
          formatTime(state.duration)
        ] })
      ] }),
      /* @__PURE__ */ jsx4("div", { className: "flex-1 min-w-0" }),
      /* @__PURE__ */ jsxs4("div", { className: "flex items-center rounded-full bg-black/60 backdrop-blur-md", children: [
        controlsConfig.theaterMode && /* @__PURE__ */ jsx4(
          "button",
          {
            type: "button",
            onClick: controls.toggleTheaterMode,
            title: state.isTheaterMode ? "Exit Theater Mode" : "Theater Mode",
            className: cn(iconBtnClass, "hidden sm:flex"),
            children: state.isTheaterMode ? /* @__PURE__ */ jsx4(Smartphone, { className: iconClass }) : /* @__PURE__ */ jsx4(Monitor, { className: iconClass })
          }
        ),
        controlsConfig.pictureInPicture && isMounted && typeof document !== "undefined" && "pictureInPictureEnabled" in document && /* @__PURE__ */ jsx4(
          "button",
          {
            type: "button",
            onClick: controls.togglePictureInPicture,
            title: state.isPictureInPicture ? "Exit PiP" : "Picture-in-Picture",
            className: cn(iconBtnClass, "hidden sm:flex"),
            children: state.isPictureInPicture ? /* @__PURE__ */ jsx4(PictureInPicture2, { className: iconClass }) : /* @__PURE__ */ jsx4(PictureInPicture, { className: iconClass })
          }
        ),
        /* @__PURE__ */ jsx4("div", { className: "hidden sm:block", children: /* @__PURE__ */ jsx4(KeyboardShortcuts, {}) }),
        controlsConfig.settings !== false && /* @__PURE__ */ jsxs4("div", { className: "relative", ref: settingsRef, children: [
          /* @__PURE__ */ jsx4(
            "button",
            {
              type: "button",
              onClick: toggleSettings,
              title: "Settings",
              className: cn(iconBtnClass, showSettings && "bg-white/10"),
              children: /* @__PURE__ */ jsx4(Settings, { className: cn(iconClass, "transition-transform duration-300", showSettings && "rotate-45") })
            }
          ),
          showSettings && /* @__PURE__ */ jsx4("div", { className: "absolute bottom-full right-0 mb-2 z-50", children: /* @__PURE__ */ jsx4("div", { className: "bg-neutral-900/95 backdrop-blur-lg rounded-xl border border-white/10 shadow-2xl overflow-hidden w-[260px] sm:w-[280px]", children: /* @__PURE__ */ jsxs4("div", { className: "relative overflow-hidden", children: [
            settingsPage === "main" && /* @__PURE__ */ jsxs4("div", { className: cn(
              "py-1",
              settingsDirection === "back" ? "animate-in slide-in-from-left-4 duration-200" : "animate-in fade-in duration-150"
            ), children: [
              controlsConfig.playbackRate && /* @__PURE__ */ jsxs4(
                "button",
                {
                  type: "button",
                  className: "flex items-center w-full px-4 py-2.5 hover:bg-white/5 active:bg-white/10 transition-colors touch-manipulation",
                  onClick: () => navigateSettings("speed"),
                  children: [
                    /* @__PURE__ */ jsx4(Gauge, { className: "w-5 h-5 text-white/70 mr-3 flex-shrink-0" }),
                    /* @__PURE__ */ jsx4("span", { className: "text-sm text-white flex-1 text-left", children: "Playback speed" }),
                    /* @__PURE__ */ jsx4("span", { className: "text-sm text-white/50 mr-1", children: state.playbackRate === 1 ? "Normal" : `${state.playbackRate}x` }),
                    /* @__PURE__ */ jsx4(ChevronRight, { className: "w-4 h-4 text-white/40" })
                  ]
                }
              ),
              controlsConfig.quality && qualityLevels.length > 0 && /* @__PURE__ */ jsxs4(
                "button",
                {
                  type: "button",
                  className: "flex items-center w-full px-4 py-2.5 hover:bg-white/5 active:bg-white/10 transition-colors touch-manipulation",
                  onClick: () => navigateSettings("quality"),
                  children: [
                    /* @__PURE__ */ jsx4(Settings, { className: "w-5 h-5 text-white/70 mr-3 flex-shrink-0" }),
                    /* @__PURE__ */ jsx4("span", { className: "text-sm text-white flex-1 text-left", children: "Quality" }),
                    /* @__PURE__ */ jsx4("span", { className: "text-sm text-white/50 mr-1", children: state.quality === "auto" ? "Auto" : state.quality }),
                    /* @__PURE__ */ jsx4(ChevronRight, { className: "w-4 h-4 text-white/40" })
                  ]
                }
              ),
              /* @__PURE__ */ jsx4("div", { className: "sm:hidden px-4 py-2.5", children: /* @__PURE__ */ jsxs4("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx4("button", { type: "button", onClick: controls.toggleMute, className: "flex-shrink-0", children: /* @__PURE__ */ jsx4(VolumeIcon, { className: "w-5 h-5 text-white/70" }) }),
                /* @__PURE__ */ jsx4(
                  Slider,
                  {
                    min: 0,
                    max: 100,
                    step: 1,
                    value: [Math.round((state.isMuted ? 0 : state.volume) * 100)],
                    onValueChange: handleVolumeChange,
                    className: "flex-1 [&_[data-slot=slider-track]]:bg-white/20 [&_[data-slot=slider-track]]:h-1 [&_[data-slot=slider-range]]:bg-white [&_[data-slot=slider-thumb]]:bg-white [&_[data-slot=slider-thumb]]:border-white [&_[data-slot=slider-thumb]]:size-4"
                  }
                ),
                /* @__PURE__ */ jsxs4("span", { className: "text-xs text-white/50 tabular-nums w-8 text-right", children: [
                  Math.round((state.isMuted ? 0 : state.volume) * 100),
                  "%"
                ] })
              ] }) }),
              controlsConfig.pictureInPicture && isMounted && typeof document !== "undefined" && "pictureInPictureEnabled" in document && /* @__PURE__ */ jsxs4(
                "button",
                {
                  type: "button",
                  className: "flex items-center w-full px-4 py-2.5 hover:bg-white/5 active:bg-white/10 transition-colors touch-manipulation sm:hidden",
                  onClick: () => {
                    controls.togglePictureInPicture();
                    setShowSettings(false);
                  },
                  children: [
                    /* @__PURE__ */ jsx4(PictureInPicture, { className: "w-5 h-5 text-white/70 mr-3 flex-shrink-0" }),
                    /* @__PURE__ */ jsx4("span", { className: "text-sm text-white flex-1 text-left", children: "Picture-in-Picture" })
                  ]
                }
              )
            ] }),
            settingsPage === "speed" && /* @__PURE__ */ jsxs4("div", { className: "animate-in slide-in-from-right-4 duration-200", children: [
              /* @__PURE__ */ jsxs4(
                "button",
                {
                  type: "button",
                  className: "flex items-center w-full px-4 py-2.5 border-b border-white/10 hover:bg-white/5 active:bg-white/10 transition-colors touch-manipulation",
                  onClick: goBackSettings,
                  children: [
                    /* @__PURE__ */ jsx4(ChevronRight, { className: "w-4 h-4 text-white/60 mr-2 rotate-180" }),
                    /* @__PURE__ */ jsx4("span", { className: "text-sm font-medium text-white", children: "Playback speed" })
                  ]
                }
              ),
              /* @__PURE__ */ jsx4("div", { className: "py-1 max-h-[300px] overflow-y-auto", children: playbackRateOptions.map((opt) => /* @__PURE__ */ jsxs4(
                "button",
                {
                  type: "button",
                  className: "flex items-center w-full px-4 py-2.5 hover:bg-white/5 active:bg-white/10 transition-colors touch-manipulation",
                  onClick: () => {
                    controls.setPlaybackRate(opt.value);
                    goBackSettings();
                  },
                  children: [
                    /* @__PURE__ */ jsx4("span", { className: "w-6 flex-shrink-0", children: state.playbackRate === opt.value && /* @__PURE__ */ jsx4(Check, { className: "w-4 h-4 text-white" }) }),
                    /* @__PURE__ */ jsx4("span", { className: cn("text-sm", state.playbackRate === opt.value ? "text-white font-medium" : "text-white/80"), children: opt.label })
                  ]
                },
                opt.value
              )) })
            ] }),
            settingsPage === "quality" && /* @__PURE__ */ jsxs4("div", { className: "animate-in slide-in-from-right-4 duration-200", children: [
              /* @__PURE__ */ jsxs4(
                "button",
                {
                  type: "button",
                  className: "flex items-center w-full px-4 py-2.5 border-b border-white/10 hover:bg-white/5 active:bg-white/10 transition-colors touch-manipulation",
                  onClick: goBackSettings,
                  children: [
                    /* @__PURE__ */ jsx4(ChevronRight, { className: "w-4 h-4 text-white/60 mr-2 rotate-180" }),
                    /* @__PURE__ */ jsx4("span", { className: "text-sm font-medium text-white", children: "Quality" })
                  ]
                }
              ),
              /* @__PURE__ */ jsx4("div", { className: "py-1 max-h-[300px] overflow-y-auto", children: qualityLevels.map((level) => /* @__PURE__ */ jsxs4(
                "button",
                {
                  type: "button",
                  className: "flex items-center w-full px-4 py-2.5 hover:bg-white/5 active:bg-white/10 transition-colors touch-manipulation",
                  onClick: () => {
                    controls.setQuality(level.id);
                    goBackSettings();
                  },
                  children: [
                    /* @__PURE__ */ jsx4("span", { className: "w-6 flex-shrink-0", children: state.quality === level.label && /* @__PURE__ */ jsx4(Check, { className: "w-4 h-4 text-white" }) }),
                    /* @__PURE__ */ jsx4("span", { className: cn("text-sm", state.quality === level.label ? "text-white font-medium" : "text-white/80"), children: level.label })
                  ]
                },
                level.id
              )) })
            ] })
          ] }) }) })
        ] }),
        controlsConfig.fullscreen && /* @__PURE__ */ jsx4(
          "button",
          {
            type: "button",
            onClick: controls.toggleFullscreen,
            title: state.isFullscreen ? "Exit Fullscreen" : "Fullscreen",
            className: iconBtnClass,
            children: state.isFullscreen ? /* @__PURE__ */ jsx4(Minimize, { className: iconClass }) : /* @__PURE__ */ jsx4(Maximize, { className: iconClass })
          }
        )
      ] })
    ] })
  ] });
};

// src/components/player/loading-spinner.tsx
import { jsx as jsx5 } from "react/jsx-runtime";
var LoadingSpinner = ({
  className,
  size = "medium"
}) => {
  const sizeClasses = {
    small: "w-6 h-6 border-2",
    medium: "w-10 h-10 border-[3px]",
    large: "w-14 h-14 border-[3px]"
  };
  return /* @__PURE__ */ jsx5("div", { className: cn("flex items-center justify-center", className), children: /* @__PURE__ */ jsx5(
    "div",
    {
      className: cn(
        "animate-spin rounded-full border-white/20 border-t-white",
        sizeClasses[size]
      )
    }
  ) });
};

// src/components/player/error-display.tsx
import { AlertCircle, RefreshCw } from "lucide-react";
import { jsx as jsx6, jsxs as jsxs5 } from "react/jsx-runtime";
var ErrorDisplay = ({
  error,
  onRetry,
  className
}) => {
  return /* @__PURE__ */ jsxs5("div", { className: cn(
    "flex flex-col items-center justify-center gap-4 p-6 text-white text-center max-w-md",
    className
  ), children: [
    /* @__PURE__ */ jsx6("div", { className: "flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-md", children: /* @__PURE__ */ jsx6(AlertCircle, { className: "w-8 h-8 text-red-400" }) }),
    /* @__PURE__ */ jsxs5("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsx6("h3", { className: "text-base font-medium", children: "Video unavailable" }),
      /* @__PURE__ */ jsx6("p", { className: "text-sm text-white/60", children: error })
    ] }),
    onRetry && /* @__PURE__ */ jsxs5(
      "button",
      {
        type: "button",
        onClick: onRetry,
        className: "flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-medium hover:bg-white/20 active:bg-white/25 transition-colors duration-200",
        children: [
          /* @__PURE__ */ jsx6(RefreshCw, { className: "w-4 h-4" }),
          "Try again"
        ]
      }
    )
  ] });
};

// src/hooks/use-video-player.ts
import { useState as useState2, useEffect as useEffect2, useCallback as useCallback2, useMemo, useReducer, useRef as useRef2 } from "react";

// src/core/adapters/adapter-registry.ts
var AdapterRegistry = class {
  constructor() {
    this.factories = [];
  }
  register(factory) {
    const existingIndex = this.factories.findIndex((candidate) => candidate.id === factory.id);
    if (existingIndex >= 0) {
      this.factories.splice(existingIndex, 1);
    }
    this.factories.push(factory);
    this.factories.sort((a, b) => b.priority - a.priority);
  }
  resolve(context) {
    return this.factories.find((factory) => factory.canHandle(context));
  }
  list() {
    return this.factories;
  }
};

// src/core/adapters/dashjs-adapter.ts
var DashJsAdapter = class {
  constructor() {
    this.id = "dashjs";
  }
  async load(context) {
    this.assertNotAborted(context.signal);
    const dashjs = await import("dashjs");
    this.assertNotAborted(context.signal);
    this.instance = dashjs.MediaPlayer().create();
    await this.runWithAbortSignal(
      new Promise((resolve, reject) => {
        const dash = this.instance;
        dash.on("streamInitialized", () => {
          resolve();
        });
        dash.on("error", (errorPayload) => {
          const errorValue = errorPayload == null ? void 0 : errorPayload.error;
          reject(new Error(`Dash.js error: ${errorValue != null ? errorValue : "unknown"}`));
        });
        dash.initialize(context.videoElement, context.src, false);
      }),
      context.signal,
      () => {
        var _a;
        (_a = this.instance) == null ? void 0 : _a.reset();
      }
    );
  }
  destroy() {
    var _a;
    (_a = this.instance) == null ? void 0 : _a.reset();
    this.instance = void 0;
  }
  getQualityLevels() {
    if (!this.instance) {
      return [];
    }
    try {
      const bitrateInfo = this.instance.getBitrateInfoListFor("video");
      return bitrateInfo.map((info, index) => {
        var _a;
        return {
          id: String(index),
          label: info.height ? `${info.height}p` : `${Math.round(((_a = info.bitrate) != null ? _a : 0) / 1e3)}k`,
          height: info.height
        };
      });
    } catch (e) {
      return [];
    }
  }
  setQuality(qualityId) {
    if (!this.instance) {
      return;
    }
    this.instance.setQualityFor("video", Number.parseInt(qualityId, 10));
  }
  assertNotAborted(signal) {
    if (signal == null ? void 0 : signal.aborted) {
      throw this.createAbortError();
    }
  }
  createAbortError() {
    const error = new Error("DashJsAdapter.load() aborted");
    error.name = "AbortError";
    return error;
  }
  runWithAbortSignal(task, signal, onAbort) {
    if (!signal) {
      return task;
    }
    if (signal.aborted) {
      onAbort == null ? void 0 : onAbort();
      return Promise.reject(this.createAbortError());
    }
    return new Promise((resolve, reject) => {
      const cleanup = () => {
        signal.removeEventListener("abort", handleAbort);
      };
      const handleAbort = () => {
        cleanup();
        onAbort == null ? void 0 : onAbort();
        reject(this.createAbortError());
      };
      signal.addEventListener("abort", handleAbort, { once: true });
      task.then(
        (value) => {
          cleanup();
          resolve(value);
        },
        (error) => {
          cleanup();
          reject(error);
        }
      );
    });
  }
};
var createDashJsAdapter = () => {
  return new DashJsAdapter();
};

// src/core/compatibility.ts
var hasNativeHlsSupport = () => {
  if (typeof window === "undefined") return false;
  const video = document.createElement("video");
  return video.canPlayType("application/vnd.apple.mpegurl") !== "";
};
var hasHlsJsSupport = () => {
  if (typeof window === "undefined") return false;
  try {
    return !!(window.MediaSource || window.WebKitMediaSource);
  } catch (e) {
    return false;
  }
};
var hasDashJsSupport = () => {
  if (typeof window === "undefined") return false;
  try {
    return !!(window.MediaSource || window.WebKitMediaSource);
  } catch (e) {
    return false;
  }
};
var isMobileDevice = () => {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};
var isIOSDevice = () => {
  if (typeof window === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};
var isAndroidDevice = () => {
  if (typeof window === "undefined") return false;
  return /Android/.test(navigator.userAgent);
};
var supportsPictureInPicture = () => {
  if (typeof window === "undefined") return false;
  return "pictureInPictureEnabled" in document;
};
var supportsAutoplay = async () => {
  if (typeof window === "undefined") return false;
  try {
    const video = document.createElement("video");
    video.muted = true;
    video.src = "data:video/mp4;base64,AAAAHGZ0eXBpc29tAAACAGlzb21pc28yYXZjMQAAAAhmcmVlAAAAG21kYXQAAAGzABAHAAABthADAowdbb9/AAAC6W1vb3YAAABsbXZoZAAAAAB8JbCAfCWwgAAAA+gAAAAAAAEAAAEAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAIVdHJhawAAAFx0a2hkAAAAD3wlsIB8JbCAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAIAAAACAAAAAAACRlZHRzAAAAHGVsc3QAAAAAAAAAAQAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAA==";
    const promise = video.play();
    if (promise) {
      await promise;
      video.pause();
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};
var isVideoFormatSupported = (url) => {
  var _a;
  if (typeof window === "undefined" || typeof document === "undefined") {
    return true;
  }
  const video = document.createElement("video");
  const extension = (_a = url.split(".").pop()) == null ? void 0 : _a.toLowerCase().split("?")[0];
  switch (extension) {
    case "mp4":
      return video.canPlayType("video/mp4") !== "";
    case "webm":
      return video.canPlayType("video/webm") !== "" || video.canPlayType('video/webm; codecs="vp8"') !== "" || video.canPlayType('video/webm; codecs="vp9"') !== "";
    case "ogg":
      return video.canPlayType("video/ogg") !== "";
    case "avi":
      return false;
    // AVI is generally not supported in browsers
    case "mov":
      return video.canPlayType("video/quicktime") !== "";
    default:
      return true;
  }
};
var getBrowserCapabilities = async () => {
  const capabilities = {
    hasNativeHls: hasNativeHlsSupport(),
    hasHlsJs: hasHlsJsSupport(),
    hasDashJs: hasDashJsSupport(),
    isMobile: isMobileDevice(),
    isIOS: isIOSDevice(),
    isAndroid: isAndroidDevice(),
    supportsInlinePlayback: true,
    // Most modern browsers support this
    supportsAutoplay: await supportsAutoplay(),
    supportsPictureInPicture: supportsPictureInPicture()
  };
  return capabilities;
};
var getStreamingStrategy = (capabilities, streamUrl) => {
  const normalizedPath = (() => {
    try {
      return new URL(streamUrl, "https://localhost").pathname.toLowerCase();
    } catch (e) {
      return streamUrl.toLowerCase();
    }
  })();
  const isHlsUrl = /\.m3u8$/i.test(normalizedPath);
  const isDashUrl = /\.mpd$/i.test(normalizedPath);
  const isDirectVideo = /\.(mp4|webm|ogg|avi|mov)$/i.test(normalizedPath);
  if (isHlsUrl) {
    if (capabilities.hasNativeHls && capabilities.isIOS) {
      return "native";
    }
    if (capabilities.hasHlsJs) {
      return "hlsjs";
    }
  }
  if (isDashUrl && capabilities.hasDashJs) {
    return "dashjs";
  }
  if (isDirectVideo) {
    const isSupported = isVideoFormatSupported(streamUrl);
    if (isSupported) {
      return "direct";
    }
    return "unsupported";
  }
  return "unsupported";
};

// src/core/adapters/direct-video-adapter.ts
var DirectVideoAdapter = class {
  constructor() {
    this.id = "direct";
  }
  async load(context) {
    const { videoElement, src, signal } = context;
    if (!isVideoFormatSupported(src)) {
      throw new Error("Video format not supported by this browser");
    }
    this.assertNotAborted(signal);
    videoElement.src = src;
    await new Promise((resolve, reject) => {
      const abortError = this.createAbortError();
      const timeout = window.setTimeout(() => {
        cleanup();
        reject(new Error("Video loading timeout (30s)"));
      }, 3e4);
      const onLoadedData = () => {
        cleanup();
        resolve();
      };
      const onError = () => {
        const error = videoElement.error;
        const message = (error == null ? void 0 : error.message) || "Failed to load direct video file";
        cleanup();
        reject(new Error(message));
      };
      const onAbort = () => {
        cleanup();
        reject(abortError);
      };
      const cleanup = () => {
        window.clearTimeout(timeout);
        videoElement.removeEventListener("loadeddata", onLoadedData);
        videoElement.removeEventListener("error", onError);
        signal == null ? void 0 : signal.removeEventListener("abort", onAbort);
      };
      if (signal == null ? void 0 : signal.aborted) {
        cleanup();
        reject(abortError);
        return;
      }
      videoElement.addEventListener("loadeddata", onLoadedData);
      videoElement.addEventListener("error", onError);
      signal == null ? void 0 : signal.addEventListener("abort", onAbort, { once: true });
      videoElement.load();
    });
  }
  destroy() {
  }
  getQualityLevels() {
    return [];
  }
  setQuality() {
  }
  assertNotAborted(signal) {
    if (signal == null ? void 0 : signal.aborted) {
      throw this.createAbortError();
    }
  }
  createAbortError() {
    const error = new Error("DirectVideoAdapter.load() aborted");
    error.name = "AbortError";
    return error;
  }
};
var createDirectVideoAdapter = () => {
  return new DirectVideoAdapter();
};

// src/core/adapters/hlsjs-adapter.ts
var HlsJsAdapter = class {
  constructor() {
    this.id = "hlsjs";
  }
  async load(context) {
    this.assertNotAborted(context.signal);
    const { default: Hls } = await import("hls.js");
    this.assertNotAborted(context.signal);
    if (!Hls.isSupported()) {
      throw new Error("HLS.js is not supported in this browser");
    }
    this.instance = new Hls({
      enableWorker: true,
      lowLatencyMode: false,
      backBufferLength: 90
    });
    await this.runWithAbortSignal(
      new Promise((resolve, reject) => {
        const hls = this.instance;
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          resolve();
        });
        hls.on(Hls.Events.ERROR, (_event, data) => {
          var _a, _b;
          const maybeFatal = data || {};
          if (maybeFatal.fatal) {
            reject(new Error(`HLS.js fatal error: ${(_a = maybeFatal.type) != null ? _a : "unknown"} - ${(_b = maybeFatal.details) != null ? _b : "unknown"}`));
          }
        });
        hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
          var _a;
          const levelIndex = data == null ? void 0 : data.level;
          if (levelIndex === void 0) {
            return;
          }
          const level = hls.levels[levelIndex];
          (_a = context.onQualityChange) == null ? void 0 : _a.call(context, (level == null ? void 0 : level.height) ? `${level.height}p` : "auto");
        });
        hls.loadSource(context.src);
        hls.attachMedia(context.videoElement);
      }),
      context.signal,
      () => {
        var _a;
        (_a = this.instance) == null ? void 0 : _a.destroy();
      }
    );
  }
  destroy() {
    var _a;
    (_a = this.instance) == null ? void 0 : _a.destroy();
    this.instance = void 0;
  }
  getQualityLevels() {
    if (!this.instance) {
      return [];
    }
    return this.instance.levels.map((level, index) => ({
      id: String(index),
      label: level.height ? `${level.height}p` : `Level ${index}`,
      height: level.height
    }));
  }
  setQuality(qualityId) {
    if (!this.instance) {
      return;
    }
    this.instance.currentLevel = Number.parseInt(qualityId, 10);
  }
  assertNotAborted(signal) {
    if (signal == null ? void 0 : signal.aborted) {
      throw this.createAbortError();
    }
  }
  createAbortError() {
    const error = new Error("HlsJsAdapter.load() aborted");
    error.name = "AbortError";
    return error;
  }
  runWithAbortSignal(task, signal, onAbort) {
    if (!signal) {
      return task;
    }
    if (signal.aborted) {
      onAbort == null ? void 0 : onAbort();
      return Promise.reject(this.createAbortError());
    }
    return new Promise((resolve, reject) => {
      const cleanup = () => {
        signal.removeEventListener("abort", handleAbort);
      };
      const handleAbort = () => {
        cleanup();
        onAbort == null ? void 0 : onAbort();
        reject(this.createAbortError());
      };
      signal.addEventListener("abort", handleAbort, { once: true });
      task.then(
        (value) => {
          cleanup();
          resolve(value);
        },
        (error) => {
          cleanup();
          reject(error);
        }
      );
    });
  }
};
var createHlsJsAdapter = () => {
  return new HlsJsAdapter();
};

// src/core/adapters/native-hls-adapter.ts
var NativeHlsAdapter = class {
  constructor() {
    this.id = "native";
  }
  async load(context) {
    const { videoElement, src, signal } = context;
    this.assertNotAborted(signal);
    videoElement.src = src;
    await new Promise((resolve, reject) => {
      const abortError = this.createAbortError();
      const onLoadedData = () => {
        cleanup();
        resolve();
      };
      const onError = () => {
        cleanup();
        reject(new Error("Failed to load native HLS stream"));
      };
      const onAbort = () => {
        cleanup();
        reject(abortError);
      };
      const cleanup = () => {
        videoElement.removeEventListener("loadeddata", onLoadedData);
        videoElement.removeEventListener("error", onError);
        signal == null ? void 0 : signal.removeEventListener("abort", onAbort);
      };
      if (signal == null ? void 0 : signal.aborted) {
        cleanup();
        reject(abortError);
        return;
      }
      videoElement.addEventListener("loadeddata", onLoadedData);
      videoElement.addEventListener("error", onError);
      signal == null ? void 0 : signal.addEventListener("abort", onAbort, { once: true });
    });
  }
  destroy() {
  }
  getQualityLevels() {
    return [];
  }
  setQuality() {
  }
  assertNotAborted(signal) {
    if (signal == null ? void 0 : signal.aborted) {
      throw this.createAbortError();
    }
  }
  createAbortError() {
    const error = new Error("NativeHlsAdapter.load() aborted");
    error.name = "AbortError";
    return error;
  }
};
var createNativeHlsAdapter = () => {
  return new NativeHlsAdapter();
};

// src/core/adapters/default-adapters.ts
var getNormalizedPath = (src) => {
  try {
    return new URL(src, "https://localhost").pathname.toLowerCase();
  } catch (e) {
    return src.toLowerCase();
  }
};
var isHls = (src) => /\.m3u8$/i.test(getNormalizedPath(src));
var isDash = (src) => /\.mpd$/i.test(getNormalizedPath(src));
var isDirect = (src) => /\.(mp4|webm|ogg|avi|mov)$/i.test(getNormalizedPath(src));
var defaultStreamingAdapters = [
  {
    id: "native",
    priority: 100,
    canHandle: ({ src, capabilities }) => {
      return isHls(src) && capabilities.hasNativeHls && capabilities.isIOS;
    },
    create: createNativeHlsAdapter
  },
  {
    id: "hlsjs",
    priority: 90,
    canHandle: ({ src, capabilities }) => {
      return isHls(src) && capabilities.hasHlsJs;
    },
    create: createHlsJsAdapter
  },
  {
    id: "dashjs",
    priority: 80,
    canHandle: ({ src, capabilities }) => {
      return isDash(src) && capabilities.hasDashJs;
    },
    create: createDashJsAdapter
  },
  {
    id: "direct",
    priority: 70,
    canHandle: ({ src }) => {
      return isDirect(src);
    },
    create: createDirectVideoAdapter
  }
];

// src/lib/logger.ts
var noop = () => void 0;
var defaultLogger = {
  debug: noop,
  info: noop,
  warn: (...args) => {
    if (typeof console !== "undefined") {
      console.warn(...args);
    }
  },
  error: (...args) => {
    if (typeof console !== "undefined") {
      console.error(...args);
    }
  }
};
var activeLogger = defaultLogger;
var createConsoleLogger = (options = {}) => {
  const {
    debug = false,
    info = false,
    warn = true,
    error = true
  } = options;
  return {
    debug: (...args) => {
      if (debug && typeof console !== "undefined") {
        console.debug(...args);
      }
    },
    info: (...args) => {
      if (info && typeof console !== "undefined") {
        console.info(...args);
      }
    },
    warn: (...args) => {
      if (warn && typeof console !== "undefined") {
        console.warn(...args);
      }
    },
    error: (...args) => {
      if (error && typeof console !== "undefined") {
        console.error(...args);
      }
    }
  };
};
var setPlayerLogger = (logger) => {
  var _a, _b, _c, _d;
  if (!logger) {
    activeLogger = defaultLogger;
    return;
  }
  activeLogger = {
    debug: (_a = logger.debug) != null ? _a : defaultLogger.debug,
    info: (_b = logger.info) != null ? _b : defaultLogger.info,
    warn: (_c = logger.warn) != null ? _c : defaultLogger.warn,
    error: (_d = logger.error) != null ? _d : defaultLogger.error
  };
};
var getPlayerLogger = () => activeLogger;

// src/core/drm/eme-controller.ts
var resolveEnvironment = (environment) => {
  var _a, _b, _c;
  const requestMediaKeySystemAccess = (_b = environment == null ? void 0 : environment.requestMediaKeySystemAccess) != null ? _b : typeof navigator !== "undefined" ? (_a = navigator.requestMediaKeySystemAccess) == null ? void 0 : _a.bind(navigator) : void 0;
  if (!requestMediaKeySystemAccess) {
    throw new Error("Encrypted Media Extensions are not supported in this environment.");
  }
  const fetchFn = (_c = environment == null ? void 0 : environment.fetch) != null ? _c : fetch;
  return {
    requestMediaKeySystemAccess,
    fetch: fetchFn
  };
};
var isEmeSupported = (environment) => {
  if (environment == null ? void 0 : environment.requestMediaKeySystemAccess) {
    return true;
  }
  return typeof navigator !== "undefined" && typeof navigator.requestMediaKeySystemAccess === "function";
};
var buildKeySystemConfiguration = (system) => {
  var _a, _b, _c, _d, _e, _f;
  return {
    initDataTypes: (_a = system.initDataTypes) != null ? _a : ["cenc"],
    audioCapabilities: (_b = system.audioCapabilities) != null ? _b : [{ contentType: 'audio/mp4; codecs="mp4a.40.2"' }],
    videoCapabilities: (_c = system.videoCapabilities) != null ? _c : [{ contentType: 'video/mp4; codecs="avc1.42E01E"' }],
    persistentState: (_d = system.persistentState) != null ? _d : "optional",
    distinctiveIdentifier: (_e = system.distinctiveIdentifier) != null ? _e : "optional",
    sessionTypes: (_f = system.sessionTypes) != null ? _f : ["temporary"]
  };
};
var withTimeout = async (timeoutMs, run) => {
  const controller = new AbortController();
  const timeoutId = globalThis.setTimeout(() => {
    controller.abort();
  }, timeoutMs);
  try {
    return await run(controller.signal);
  } finally {
    globalThis.clearTimeout(timeoutId);
  }
};
var requestKeySystemAccess = async (systems, environment) => {
  const errors = [];
  for (const system of systems) {
    try {
      const access = await environment.requestMediaKeySystemAccess(system.keySystem, [
        buildKeySystemConfiguration(system)
      ]);
      return { access, system };
    } catch (error) {
      errors.push(error);
    }
  }
  const lastError = errors[errors.length - 1];
  throw new Error(`No configured DRM key system is supported. ${lastError ? `Last error: ${lastError.message}` : ""}`.trim());
};
var createEmeController = async (videoElement, configuration, environment) => {
  var _a;
  if (!configuration.enabled) {
    throw new Error("DRM configuration is disabled.");
  }
  if (!configuration.systems || configuration.systems.length === 0) {
    throw new Error("DRM requires at least one key system configuration.");
  }
  const emeEnvironment = resolveEnvironment(environment);
  const requestTimeoutMs = (_a = configuration.requestTimeoutMs) != null ? _a : 15e3;
  const { access, system } = await requestKeySystemAccess(configuration.systems, emeEnvironment);
  const mediaKeys = await access.createMediaKeys();
  const onEncrypted = async (event) => {
    const encryptedEvent = event;
    if (!encryptedEvent.initData) {
      return;
    }
    const session = mediaKeys.createSession("temporary");
    session.addEventListener("message", (sessionEvent) => {
      void (async () => {
        const messageEvent = sessionEvent;
        if (!system.licenseServerUrl) {
          throw new Error(`Missing licenseServerUrl for key system ${system.keySystem}`);
        }
        const license = await withTimeout(requestTimeoutMs, async (signal) => {
          var _a2, _b;
          if (configuration.licenseRequestHandler) {
            return configuration.licenseRequestHandler({
              keySystem: system.keySystem,
              licenseServerUrl: system.licenseServerUrl,
              headers: (_a2 = system.headers) != null ? _a2 : {},
              message: messageEvent.message,
              session,
              signal
            });
          }
          const response = await emeEnvironment.fetch(system.licenseServerUrl, {
            method: "POST",
            headers: __spreadValues({
              "Content-Type": "application/octet-stream"
            }, (_b = system.headers) != null ? _b : {}),
            body: messageEvent.message,
            signal
          });
          if (!response.ok) {
            throw new Error(`License request failed with status ${response.status}`);
          }
          return response.arrayBuffer();
        });
        await session.update(license);
      })().catch((error) => {
        getPlayerLogger().warn("EME license exchange failed:", error);
      });
    });
    await session.generateRequest(encryptedEvent.initDataType, encryptedEvent.initData);
  };
  await videoElement.setMediaKeys(mediaKeys);
  videoElement.addEventListener("encrypted", onEncrypted);
  return {
    keySystem: access.keySystem,
    destroy: () => {
      videoElement.removeEventListener("encrypted", onEncrypted);
      void videoElement.setMediaKeys(null).catch(() => void 0);
    }
  };
};

// src/core/plugins/plugin-manager.ts
var VideoEnginePluginManager = class {
  constructor(plugins = []) {
    this.plugins = plugins;
  }
  setup(context) {
    for (const plugin of this.plugins) {
      this.safeRun(plugin.name, "setup", () => {
        var _a;
        return (_a = plugin.setup) == null ? void 0 : _a.call(plugin, context);
      });
    }
  }
  onInit() {
    for (const plugin of this.plugins) {
      this.safeRun(plugin.name, "onInit", () => {
        var _a;
        return (_a = plugin.onInit) == null ? void 0 : _a.call(plugin);
      });
    }
  }
  onSourceLoadStart(payload) {
    for (const plugin of this.plugins) {
      this.safeRun(plugin.name, "onSourceLoadStart", () => {
        var _a;
        return (_a = plugin.onSourceLoadStart) == null ? void 0 : _a.call(plugin, payload);
      });
    }
  }
  onSourceLoaded(payload) {
    for (const plugin of this.plugins) {
      this.safeRun(plugin.name, "onSourceLoaded", () => {
        var _a;
        return (_a = plugin.onSourceLoaded) == null ? void 0 : _a.call(plugin, payload);
      });
    }
  }
  onSourceLoadFailed(payload) {
    for (const plugin of this.plugins) {
      this.safeRun(plugin.name, "onSourceLoadFailed", () => {
        var _a;
        return (_a = plugin.onSourceLoadFailed) == null ? void 0 : _a.call(plugin, payload);
      });
    }
  }
  onRetry(payload) {
    for (const plugin of this.plugins) {
      this.safeRun(plugin.name, "onRetry", () => {
        var _a;
        return (_a = plugin.onRetry) == null ? void 0 : _a.call(plugin, payload);
      });
    }
  }
  onFailover(payload) {
    for (const plugin of this.plugins) {
      this.safeRun(plugin.name, "onFailover", () => {
        var _a;
        return (_a = plugin.onFailover) == null ? void 0 : _a.call(plugin, payload);
      });
    }
  }
  onPlay() {
    for (const plugin of this.plugins) {
      this.safeRun(plugin.name, "onPlay", () => {
        var _a;
        return (_a = plugin.onPlay) == null ? void 0 : _a.call(plugin);
      });
    }
  }
  onPause() {
    for (const plugin of this.plugins) {
      this.safeRun(plugin.name, "onPause", () => {
        var _a;
        return (_a = plugin.onPause) == null ? void 0 : _a.call(plugin);
      });
    }
  }
  onTimeUpdate(payload) {
    for (const plugin of this.plugins) {
      this.safeRun(plugin.name, "onTimeUpdate", () => {
        var _a;
        return (_a = plugin.onTimeUpdate) == null ? void 0 : _a.call(plugin, payload);
      });
    }
  }
  onVolumeChange(payload) {
    for (const plugin of this.plugins) {
      this.safeRun(plugin.name, "onVolumeChange", () => {
        var _a;
        return (_a = plugin.onVolumeChange) == null ? void 0 : _a.call(plugin, payload);
      });
    }
  }
  onQualityChange(quality) {
    for (const plugin of this.plugins) {
      this.safeRun(plugin.name, "onQualityChange", () => {
        var _a;
        return (_a = plugin.onQualityChange) == null ? void 0 : _a.call(plugin, quality);
      });
    }
  }
  onError(payload) {
    for (const plugin of this.plugins) {
      this.safeRun(plugin.name, "onError", () => {
        var _a;
        return (_a = plugin.onError) == null ? void 0 : _a.call(plugin, payload);
      });
    }
  }
  dispose() {
    for (const plugin of this.plugins) {
      this.safeRun(plugin.name, "onDispose", () => {
        var _a;
        return (_a = plugin.onDispose) == null ? void 0 : _a.call(plugin);
      });
    }
  }
  safeRun(pluginName, lifecycle, run) {
    try {
      run();
    } catch (error) {
      getPlayerLogger().warn(`Plugin ${pluginName} failed during ${lifecycle}:`, error);
    }
  }
};

// src/core/video-engine.ts
var VideoEngine = class {
  constructor(videoElement, events = {}, options = {}) {
    this.isDisposed = false;
    this.loadRequestId = 0;
    this.timeUpdateFrameId = null;
    this.progressFrameId = null;
    this.lastEmittedCurrentTime = -1;
    this.lastEmittedDuration = -1;
    this.lastEmittedBuffered = -1;
    this.onPlayListener = () => {
      var _a, _b;
      (_b = (_a = this.events).onPlay) == null ? void 0 : _b.call(_a);
      this.pluginManager.onPlay();
    };
    this.onPauseListener = () => {
      var _a, _b;
      (_b = (_a = this.events).onPause) == null ? void 0 : _b.call(_a);
      this.pluginManager.onPause();
    };
    this.onTimeUpdateListener = () => {
      if (this.timeUpdateFrameId !== null || this.isDisposed) {
        return;
      }
      this.timeUpdateFrameId = this.requestFrame(() => {
        var _a, _b;
        this.timeUpdateFrameId = null;
        if (this.isDisposed) {
          return;
        }
        const currentTime = this.videoElement.currentTime;
        const duration = this.videoElement.duration || 0;
        const currentTimeDelta = Math.abs(currentTime - this.lastEmittedCurrentTime);
        const durationDelta = Math.abs(duration - this.lastEmittedDuration);
        if (currentTimeDelta < 0.05 && durationDelta < 0.01) {
          return;
        }
        this.lastEmittedCurrentTime = currentTime;
        this.lastEmittedDuration = duration;
        (_b = (_a = this.events).onTimeUpdate) == null ? void 0 : _b.call(_a, currentTime, duration);
        this.pluginManager.onTimeUpdate({ currentTime, duration });
      });
    };
    this.onProgressListener = () => {
      if (this.progressFrameId !== null || this.isDisposed) {
        return;
      }
      this.progressFrameId = this.requestFrame(() => {
        var _a, _b;
        this.progressFrameId = null;
        if (this.isDisposed) {
          return;
        }
        const buffered = this.getBufferedPercentage();
        if (Math.abs(buffered - this.lastEmittedBuffered) < 0.25) {
          return;
        }
        this.lastEmittedBuffered = buffered;
        (_b = (_a = this.events).onProgress) == null ? void 0 : _b.call(_a, buffered);
      });
    };
    this.onVolumeChangeListener = () => {
      var _a, _b;
      const volume = this.videoElement.volume;
      const muted = this.videoElement.muted;
      (_b = (_a = this.events).onVolumeChange) == null ? void 0 : _b.call(_a, volume, muted);
      this.pluginManager.onVolumeChange({ volume, muted });
    };
    this.onErrorListener = () => {
      var _a, _b;
      const error = new Error("Video element error");
      (_b = (_a = this.events).onError) == null ? void 0 : _b.call(_a, error);
      this.pluginManager.onError({ error, src: this.currentSource, strategy: this.currentStrategy });
    };
    var _a, _b, _c;
    this.videoElement = videoElement;
    this.events = events;
    this.adapterRegistry = new AdapterRegistry();
    this.pluginManager = new VideoEnginePluginManager((_a = options.plugins) != null ? _a : []);
    this.resolveCapabilities = (_b = options.capabilitiesResolver) != null ? _b : getBrowserCapabilities;
    this.emeEnvironment = options.emeEnvironment;
    for (const adapter of defaultStreamingAdapters) {
      this.adapterRegistry.register(adapter);
    }
    for (const adapter of (_c = options.adapters) != null ? _c : []) {
      this.adapterRegistry.register(adapter);
    }
    this.setupVideoElementEvents();
    this.pluginManager.setup({ videoElement: this.videoElement });
  }
  async initialize() {
    this.assertNotDisposed("initialize");
    if (this.capabilities) {
      return;
    }
    if (this.initializationPromise) {
      await this.initializationPromise;
      return;
    }
    this.initializationPromise = (async () => {
      var _a, _b, _c, _d;
      try {
        const capabilities = await this.resolveCapabilities();
        if (this.isDisposed) {
          return;
        }
        this.capabilities = capabilities;
        this.pluginManager.onInit();
        (_b = (_a = this.events).onReady) == null ? void 0 : _b.call(_a);
      } catch (error) {
        if (!this.isDisposed) {
          (_d = (_c = this.events).onError) == null ? void 0 : _d.call(_c, error);
        }
        throw error;
      } finally {
        this.initializationPromise = void 0;
      }
    })();
    await this.initializationPromise;
  }
  async loadSource(config) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
    this.assertNotDisposed("loadSource");
    const requestId = ++this.loadRequestId;
    const { signal } = config;
    this.assertNotAborted(signal);
    if (!this.capabilities) {
      await this.initialize();
    }
    this.assertActiveLoadRequest(requestId);
    this.assertNotAborted(signal);
    if (!this.capabilities) {
      throw new Error("Failed to initialize video engine capabilities");
    }
    this.cleanupActiveAdapter();
    this.cleanupDrmController();
    this.applyVideoConfig(config);
    if ((_a = config.drm) == null ? void 0 : _a.enabled) {
      const drmController = await this.runWithAbortSignal(this.setupDrm(config.drm), signal, () => {
        this.cleanupDrmController();
      });
      if (this.isSupersededLoadRequest(requestId)) {
        drmController.destroy();
        throw this.createSupersededLoadError();
      }
      this.activeEmeController = drmController;
    }
    (_c = (_b = this.events).onLoadStart) == null ? void 0 : _c.call(_b);
    const candidateSources = this.getCandidateSources(config);
    const retryLimit = this.getRetryLimit(config);
    const retryDelayMs = this.getRetryDelayMs(config);
    const maxRetryDelayMs = this.getMaxRetryDelayMs(config, retryDelayMs);
    const backoffMultiplier = this.getBackoffMultiplier(config);
    const jitterRatio = this.getJitterRatio(config);
    const resolvedCandidates = candidateSources.map((src) => ({
      src,
      adapterFactory: this.adapterRegistry.resolve({
        src,
        capabilities: this.capabilities
      })
    }));
    const totalAttempts = resolvedCandidates.reduce((count, candidate) => {
      if (!candidate.adapterFactory) {
        return count + 1;
      }
      return count + retryLimit + 1;
    }, 0);
    const attemptErrors = [];
    let attemptNumber = 0;
    let lastAttemptStrategy;
    for (let sourceIndex = 0; sourceIndex < resolvedCandidates.length; sourceIndex += 1) {
      const candidate = resolvedCandidates[sourceIndex];
      this.assertActiveLoadRequest(requestId);
      this.assertNotAborted(signal);
      const src = candidate.src;
      const adapterFactory = candidate.adapterFactory;
      const strategy = (_d = adapterFactory == null ? void 0 : adapterFactory.id) != null ? _d : "unresolved";
      lastAttemptStrategy = strategy;
      const payload = {
        src,
        strategy,
        capabilities: this.capabilities
      };
      this.pluginManager.onSourceLoadStart(payload);
      if (!adapterFactory) {
        attemptNumber += 1;
        const unsupportedError = new Error(`Unsupported video format. This browser cannot play: ${src}`);
        attemptErrors.push(unsupportedError);
        this.pluginManager.onSourceLoadFailed({
          src,
          strategy,
          error: unsupportedError,
          attempt: attemptNumber,
          totalAttempts
        });
        const nextCandidate = resolvedCandidates[sourceIndex + 1];
        if (nextCandidate) {
          this.pluginManager.onFailover({
            fromSrc: src,
            fromStrategy: strategy,
            toSrc: nextCandidate.src,
            toStrategy: (_f = (_e = nextCandidate.adapterFactory) == null ? void 0 : _e.id) != null ? _f : "unresolved",
            error: unsupportedError,
            attempt: attemptNumber,
            totalAttempts
          });
        }
        continue;
      }
      for (let retryIndex = 0; retryIndex <= retryLimit; retryIndex += 1) {
        this.assertActiveLoadRequest(requestId);
        this.assertNotAborted(signal);
        attemptNumber += 1;
        const adapter = adapterFactory.create();
        let adapterDestroyedByAbort = false;
        try {
          await this.runWithAbortSignal(
            adapter.load({
              src,
              capabilities: this.capabilities,
              videoElement: this.videoElement,
              signal,
              onQualityChange: (quality) => {
                var _a2, _b2;
                (_b2 = (_a2 = this.events).onQualityChange) == null ? void 0 : _b2.call(_a2, quality);
                this.pluginManager.onQualityChange(quality);
              }
            }),
            signal,
            () => {
              adapter.destroy();
              adapterDestroyedByAbort = true;
            }
          );
          this.assertActiveLoadRequest(requestId);
          this.assertNotAborted(signal);
          this.activeAdapter = adapter;
          this.currentStrategy = adapterFactory.id;
          this.currentSource = src;
          this.pluginManager.onSourceLoaded(payload);
          (_h = (_g = this.events).onLoadEnd) == null ? void 0 : _h.call(_g);
          return;
        } catch (error) {
          const runtimeError = error;
          if (!adapterDestroyedByAbort) {
            adapter.destroy();
          }
          if (this.isAbortedLoadError(runtimeError)) {
            throw runtimeError;
          }
          if (this.isSupersededLoadRequest(requestId)) {
            throw this.createSupersededLoadError();
          }
          const canRetry = retryIndex < retryLimit && this.isRetriableLoadError(runtimeError, (_i = config.retryPolicy) == null ? void 0 : _i.retryOn);
          this.pluginManager.onSourceLoadFailed({
            src,
            strategy: adapterFactory.id,
            error: runtimeError,
            attempt: attemptNumber,
            totalAttempts
          });
          if (canRetry) {
            const delayMs = this.calculateRetryDelay({
              retryAttempt: retryIndex,
              baseDelayMs: retryDelayMs,
              maxDelayMs: maxRetryDelayMs,
              backoffMultiplier,
              jitterRatio
            });
            this.pluginManager.onRetry({
              src,
              strategy: adapterFactory.id,
              error: runtimeError,
              attempt: attemptNumber,
              retryAttempt: retryIndex + 1,
              maxRetries: retryLimit,
              retryDelayMs: delayMs
            });
            await this.waitForRetryDelay(delayMs, signal);
            continue;
          }
          attemptErrors.push(runtimeError);
          const nextCandidate = resolvedCandidates[sourceIndex + 1];
          if (nextCandidate) {
            this.pluginManager.onFailover({
              fromSrc: src,
              fromStrategy: adapterFactory.id,
              toSrc: nextCandidate.src,
              toStrategy: (_k = (_j = nextCandidate.adapterFactory) == null ? void 0 : _j.id) != null ? _k : "unresolved",
              error: runtimeError,
              attempt: attemptNumber,
              totalAttempts
            });
          }
          break;
        }
      }
    }
    const lastError = (_l = attemptErrors[attemptErrors.length - 1]) != null ? _l : new Error("Unknown playback failure");
    const failureSummary = new Error(
      `All playback sources failed (${totalAttempts} attempts). Last error: ${lastError.message}`
    );
    (_n = (_m = this.events).onError) == null ? void 0 : _n.call(_m, failureSummary);
    this.pluginManager.onError({
      error: failureSummary,
      src: candidateSources[candidateSources.length - 1],
      strategy: lastAttemptStrategy
    });
    throw failureSummary;
  }
  getQualityLevels() {
    var _a, _b;
    return (_b = (_a = this.activeAdapter) == null ? void 0 : _a.getQualityLevels()) != null ? _b : [];
  }
  setQuality(qualityId) {
    var _a;
    this.assertNotDisposed("setQuality");
    (_a = this.activeAdapter) == null ? void 0 : _a.setQuality(qualityId);
  }
  cleanup() {
    if (this.isDisposed) {
      return;
    }
    this.loadRequestId += 1;
    this.cleanupActiveAdapter();
    this.cleanupDrmController();
  }
  dispose() {
    if (this.isDisposed) {
      return;
    }
    this.isDisposed = true;
    this.loadRequestId += 1;
    this.cancelPendingFrames();
    this.removeVideoElementEvents();
    this.cleanupActiveAdapter();
    this.cleanupDrmController();
    this.pluginManager.dispose();
  }
  getCurrentStrategy() {
    return this.currentStrategy;
  }
  getCapabilities() {
    return this.capabilities;
  }
  getCurrentSource() {
    return this.currentSource;
  }
  applyVideoConfig(config) {
    var _a, _b, _c, _d;
    this.videoElement.autoplay = (_a = config.autoplay) != null ? _a : false;
    this.videoElement.muted = (_b = config.muted) != null ? _b : false;
    this.videoElement.loop = (_c = config.loop) != null ? _c : false;
    this.videoElement.playsInline = (_d = config.playsInline) != null ? _d : true;
    if (config.poster) {
      this.videoElement.poster = config.poster;
    }
  }
  setupVideoElementEvents() {
    this.videoElement.addEventListener("play", this.onPlayListener);
    this.videoElement.addEventListener("pause", this.onPauseListener);
    this.videoElement.addEventListener("timeupdate", this.onTimeUpdateListener);
    this.videoElement.addEventListener("progress", this.onProgressListener);
    this.videoElement.addEventListener("volumechange", this.onVolumeChangeListener);
    this.videoElement.addEventListener("error", this.onErrorListener);
  }
  removeVideoElementEvents() {
    this.videoElement.removeEventListener("play", this.onPlayListener);
    this.videoElement.removeEventListener("pause", this.onPauseListener);
    this.videoElement.removeEventListener("timeupdate", this.onTimeUpdateListener);
    this.videoElement.removeEventListener("progress", this.onProgressListener);
    this.videoElement.removeEventListener("volumechange", this.onVolumeChangeListener);
    this.videoElement.removeEventListener("error", this.onErrorListener);
  }
  getBufferedPercentage() {
    const buffered = this.videoElement.buffered;
    const duration = this.videoElement.duration;
    if (buffered.length === 0 || !duration) {
      return 0;
    }
    const bufferedEnd = buffered.end(buffered.length - 1);
    return Math.min(100, bufferedEnd / duration * 100);
  }
  requestFrame(callback) {
    if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
      return window.requestAnimationFrame(callback);
    }
    return setTimeout(callback, 16);
  }
  cancelFrame(id) {
    if (typeof window !== "undefined" && typeof window.cancelAnimationFrame === "function") {
      window.cancelAnimationFrame(id);
      return;
    }
    clearTimeout(id);
  }
  cancelPendingFrames() {
    if (this.timeUpdateFrameId !== null) {
      this.cancelFrame(this.timeUpdateFrameId);
      this.timeUpdateFrameId = null;
    }
    if (this.progressFrameId !== null) {
      this.cancelFrame(this.progressFrameId);
      this.progressFrameId = null;
    }
  }
  cleanupActiveAdapter() {
    var _a;
    (_a = this.activeAdapter) == null ? void 0 : _a.destroy();
    this.activeAdapter = void 0;
    this.currentStrategy = void 0;
    this.currentSource = void 0;
  }
  async setupDrm(configuration) {
    var _a, _b;
    try {
      return await createEmeController(this.videoElement, configuration, this.emeEnvironment);
    } catch (error) {
      const drmError = new Error(`Failed to initialize DRM: ${error.message}`);
      (_b = (_a = this.events).onError) == null ? void 0 : _b.call(_a, drmError);
      this.pluginManager.onError({
        error: drmError
      });
      throw drmError;
    }
  }
  cleanupDrmController() {
    var _a;
    (_a = this.activeEmeController) == null ? void 0 : _a.destroy();
    this.activeEmeController = void 0;
  }
  getCandidateSources(config) {
    var _a;
    const sources = [config.src, ...(_a = config.fallbackSources) != null ? _a : []].map((source) => source.trim()).filter((source) => source.length > 0);
    return Array.from(new Set(sources));
  }
  getRetryLimit(config) {
    var _a, _b;
    const configuredLimit = (_b = (_a = config.retryPolicy) == null ? void 0 : _a.maxRetries) != null ? _b : 0;
    return Math.max(0, Math.min(5, Math.floor(configuredLimit)));
  }
  getRetryDelayMs(config) {
    var _a, _b;
    const configuredDelayMs = (_b = (_a = config.retryPolicy) == null ? void 0 : _a.retryDelayMs) != null ? _b : 0;
    return Math.max(0, Math.min(5e3, Math.floor(configuredDelayMs)));
  }
  getMaxRetryDelayMs(config, fallbackDelayMs) {
    var _a, _b;
    const configuredMaxDelayMs = (_b = (_a = config.retryPolicy) == null ? void 0 : _a.maxRetryDelayMs) != null ? _b : fallbackDelayMs;
    return Math.max(0, Math.min(3e4, Math.floor(configuredMaxDelayMs)));
  }
  getBackoffMultiplier(config) {
    var _a, _b;
    const configuredMultiplier = (_b = (_a = config.retryPolicy) == null ? void 0 : _a.backoffMultiplier) != null ? _b : 1;
    return Math.max(1, Math.min(4, configuredMultiplier));
  }
  getJitterRatio(config) {
    var _a, _b;
    const configuredJitterRatio = (_b = (_a = config.retryPolicy) == null ? void 0 : _a.jitterRatio) != null ? _b : 0;
    return Math.max(0, Math.min(1, configuredJitterRatio));
  }
  isSupersededLoadRequest(requestId) {
    return requestId !== this.loadRequestId;
  }
  assertActiveLoadRequest(requestId) {
    if (this.isSupersededLoadRequest(requestId)) {
      throw this.createSupersededLoadError();
    }
  }
  createSupersededLoadError() {
    return new Error("VideoEngine.loadSource() superseded by a newer load request");
  }
  assertNotAborted(signal) {
    if (!(signal == null ? void 0 : signal.aborted)) {
      return;
    }
    throw this.createAbortedLoadError();
  }
  createAbortedLoadError() {
    const error = new Error("VideoEngine.loadSource() aborted");
    error.name = "AbortError";
    return error;
  }
  isAbortedLoadError(error) {
    return error.name === "AbortError" || error.message === "VideoEngine.loadSource() aborted";
  }
  isRetriableLoadError(error, retryOn) {
    if (this.isAbortedLoadError(error)) {
      return false;
    }
    const retryRules = retryOn != null ? retryOn : ["network", "timeout", "server"];
    if (retryRules.includes("all")) {
      return true;
    }
    const category = this.classifyLoadError(error);
    return retryRules.includes(category);
  }
  classifyLoadError(error) {
    const message = error.message.toLowerCase();
    if (message.includes("timeout")) {
      return "timeout";
    }
    if (message.includes("network") || message.includes("failed to fetch") || message.includes("ecconn") || message.includes("econn") || message.includes("err_network")) {
      return "network";
    }
    if (/(status|http)\s*5\d\d/.test(message) || /\b50\d\b/.test(message)) {
      return "server";
    }
    if (message.includes("unsupported") || message.includes("not supported") || message.includes("cannot play") || message.includes("codec")) {
      return "unsupported";
    }
    return "unknown";
  }
  async waitForRetryDelay(delayMs, signal) {
    if (delayMs <= 0) {
      this.assertNotAborted(signal);
      return;
    }
    await this.runWithAbortSignal(
      new Promise((resolve) => {
        globalThis.setTimeout(resolve, delayMs);
      }),
      signal
    );
  }
  calculateRetryDelay(options) {
    const {
      retryAttempt,
      baseDelayMs,
      maxDelayMs,
      backoffMultiplier,
      jitterRatio
    } = options;
    if (baseDelayMs <= 0) {
      return 0;
    }
    const exponentialDelay = baseDelayMs * Math.pow(backoffMultiplier, retryAttempt);
    const cappedDelay = Math.min(maxDelayMs, exponentialDelay);
    if (jitterRatio <= 0) {
      return Math.floor(cappedDelay);
    }
    const jitterDelta = cappedDelay * jitterRatio;
    const randomOffset = (Math.random() * 2 - 1) * jitterDelta;
    return Math.max(0, Math.floor(cappedDelay + randomOffset));
  }
  runWithAbortSignal(task, signal, onAbort) {
    if (!signal) {
      return task;
    }
    if (signal.aborted) {
      onAbort == null ? void 0 : onAbort();
      return Promise.reject(this.createAbortedLoadError());
    }
    return new Promise((resolve, reject) => {
      const cleanup = () => {
        signal.removeEventListener("abort", handleAbort);
      };
      const handleAbort = () => {
        cleanup();
        onAbort == null ? void 0 : onAbort();
        reject(this.createAbortedLoadError());
      };
      signal.addEventListener("abort", handleAbort, { once: true });
      task.then(
        (value) => {
          cleanup();
          resolve(value);
        },
        (error) => {
          cleanup();
          reject(error);
        }
      );
    });
  }
  assertNotDisposed(methodName) {
    if (this.isDisposed) {
      throw new Error(`VideoEngine.${methodName}() called after dispose`);
    }
  }
};

// src/hooks/use-video-player.ts
var TIME_EPSILON = 0.05;
var DURATION_EPSILON = 0.01;
var BUFFER_EPSILON = 0.25;
var VOLUME_EPSILON = 0.01;
var createInitialState = (options) => {
  var _a, _b;
  return {
    isPlaying: false,
    isPaused: true,
    isLoading: false,
    isMuted: (_a = options.muted) != null ? _a : false,
    currentTime: 0,
    duration: 0,
    volume: (_b = options.volume) != null ? _b : 1,
    buffered: 0,
    quality: "auto",
    playbackRate: 1,
    isFullscreen: false,
    isPictureInPicture: false,
    isTheaterMode: false,
    error: null,
    playCount: 0,
    totalWatchTime: 0,
    bufferingTime: 0,
    averageBitrate: 0,
    qualityChanges: 0
  };
};
var videoPlayerReducer = (state, action) => {
  switch (action.type) {
    case "ready": {
      return state.isLoading ? __spreadProps(__spreadValues({}, state), { isLoading: false }) : state;
    }
    case "play": {
      if (state.isPlaying && !state.isPaused) {
        return state;
      }
      return __spreadProps(__spreadValues({}, state), {
        isPlaying: true,
        isPaused: false,
        error: null,
        playCount: state.playCount + 1
      });
    }
    case "pause": {
      if (!state.isPlaying && state.isPaused) {
        return state;
      }
      return __spreadProps(__spreadValues({}, state), {
        isPlaying: false,
        isPaused: true,
        totalWatchTime: state.totalWatchTime + action.watchTime
      });
    }
    case "time_update": {
      const currentTimeDelta = Math.abs(state.currentTime - action.currentTime);
      const durationDelta = Math.abs(state.duration - action.duration);
      if (currentTimeDelta < TIME_EPSILON && durationDelta < DURATION_EPSILON) {
        return state;
      }
      return __spreadProps(__spreadValues({}, state), {
        currentTime: action.currentTime,
        duration: action.duration,
        error: action.currentTime > 0 ? null : state.error
      });
    }
    case "progress": {
      if (Math.abs(state.buffered - action.buffered) < BUFFER_EPSILON) {
        return state;
      }
      return __spreadProps(__spreadValues({}, state), { buffered: action.buffered });
    }
    case "volume_change": {
      if (Math.abs(state.volume - action.volume) < VOLUME_EPSILON && state.isMuted === action.isMuted) {
        return state;
      }
      return __spreadProps(__spreadValues({}, state), { volume: action.volume, isMuted: action.isMuted });
    }
    case "quality_change": {
      if (state.quality === action.quality) {
        return state;
      }
      return __spreadProps(__spreadValues({}, state), {
        quality: action.quality,
        qualityChanges: state.qualityChanges + 1
      });
    }
    case "error": {
      if (state.error === action.message && !state.isLoading) {
        return state;
      }
      return __spreadProps(__spreadValues({}, state), { error: action.message, isLoading: false });
    }
    case "load_start": {
      if (state.isLoading && state.error === null) {
        return state;
      }
      return __spreadProps(__spreadValues({}, state), { isLoading: true, error: null });
    }
    case "load_end": {
      if (!state.isLoading && action.bufferingTime <= 0) {
        return state;
      }
      return __spreadProps(__spreadValues({}, state), {
        isLoading: false,
        bufferingTime: state.bufferingTime + action.bufferingTime
      });
    }
    case "fullscreen_change": {
      return state.isFullscreen === action.isFullscreen ? state : __spreadProps(__spreadValues({}, state), { isFullscreen: action.isFullscreen });
    }
    case "pip_change": {
      return state.isPictureInPicture === action.isPictureInPicture ? state : __spreadProps(__spreadValues({}, state), { isPictureInPicture: action.isPictureInPicture });
    }
    case "playback_rate_change": {
      return state.playbackRate === action.playbackRate ? state : __spreadProps(__spreadValues({}, state), { playbackRate: action.playbackRate });
    }
    case "toggle_theater_mode": {
      return __spreadProps(__spreadValues({}, state), { isTheaterMode: !state.isTheaterMode });
    }
    default: {
      return state;
    }
  }
};
var calculateElapsedSeconds = (startedAt, now) => {
  if (startedAt <= 0) {
    return 0;
  }
  return Math.max(0, (now - startedAt) / 1e3);
};
var isExpectedLoadInterruption = (error) => {
  const message = error.message.toLowerCase();
  return error.name === "AbortError" || message.includes("loadsource() aborted") || message.includes("superseded by a newer load request");
};
var useVideoPlayer = (videoRef, options = {}) => {
  const [state, dispatch] = useReducer(videoPlayerReducer, options, createInitialState);
  const [engine, setEngine] = useState2(null);
  const [isEngineReady, setIsEngineReady] = useState2(false);
  const [pendingConfig, setPendingConfig] = useState2(null);
  const [isPlayPending, setIsPlayPending] = useState2(false);
  const [qualityLevels, setQualityLevels] = useState2([]);
  const [initialEnginePlugins] = useState2(() => options.enginePlugins);
  const lastPlayTimeRef = useRef2(0);
  const bufferingStartTimeRef = useRef2(0);
  useEffect2(() => {
    if (!videoRef.current) return;
    const videoElement = videoRef.current;
    const events = {
      onReady: () => {
        dispatch({ type: "ready" });
        setIsEngineReady(true);
      },
      onPlay: () => {
        dispatch({ type: "play" });
        lastPlayTimeRef.current = Date.now();
      },
      onPause: () => {
        const watchTime = calculateElapsedSeconds(lastPlayTimeRef.current, Date.now());
        dispatch({ type: "pause", watchTime });
        lastPlayTimeRef.current = 0;
      },
      onTimeUpdate: (currentTime, duration) => {
        const safeCurrentTime = Number.isFinite(currentTime) ? currentTime : 0;
        const safeDuration = Number.isFinite(duration) ? duration : 0;
        dispatch({ type: "time_update", currentTime: safeCurrentTime, duration: safeDuration });
      },
      onProgress: (buffered) => {
        const safeBuffered = Number.isFinite(buffered) ? buffered : 0;
        dispatch({ type: "progress", buffered: safeBuffered });
      },
      onVolumeChange: (volume, muted) => {
        const safeVolume = Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : 1;
        dispatch({ type: "volume_change", volume: safeVolume, isMuted: muted });
      },
      onQualityChange: (quality) => {
        dispatch({ type: "quality_change", quality });
      },
      onError: (error) => {
        dispatch({ type: "error", message: error.message });
      },
      onLoadStart: () => {
        dispatch({ type: "load_start" });
        bufferingStartTimeRef.current = Date.now();
      },
      onLoadEnd: () => {
        const bufferingTime = calculateElapsedSeconds(bufferingStartTimeRef.current, Date.now());
        dispatch({ type: "load_end", bufferingTime });
        bufferingStartTimeRef.current = 0;
      }
    };
    const videoEngine = new VideoEngine(videoElement, events, {
      plugins: initialEnginePlugins
    });
    setEngine(videoEngine);
    videoEngine.initialize().catch((error) => {
      dispatch({ type: "error", message: error.message });
    });
    return () => {
      videoEngine.dispose();
    };
  }, [videoRef, initialEnginePlugins]);
  useEffect2(() => {
    if (isEngineReady && engine && pendingConfig) {
      engine.loadSource(pendingConfig).then(() => {
        setQualityLevels(engine.getQualityLevels());
        setPendingConfig(null);
      }).catch((error) => {
        if (isExpectedLoadInterruption(error)) {
          setPendingConfig(null);
          return;
        }
        dispatch({ type: "error", message: `Failed to load video: ${error.message}` });
        setPendingConfig(null);
      });
    }
  }, [isEngineReady, engine, pendingConfig]);
  useEffect2(() => {
    if (typeof document === "undefined") return;
    const handleFullscreenChange = () => {
      dispatch({ type: "fullscreen_change", isFullscreen: Boolean(document.fullscreenElement) });
    };
    const handleEnterPiP = () => {
      dispatch({ type: "pip_change", isPictureInPicture: true });
    };
    const handleLeavePiP = () => {
      dispatch({ type: "pip_change", isPictureInPicture: false });
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    if (videoRef.current) {
      videoRef.current.addEventListener("enterpictureinpicture", handleEnterPiP);
      videoRef.current.addEventListener("leavepictureinpicture", handleLeavePiP);
    }
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      if (videoRef.current) {
        videoRef.current.removeEventListener("enterpictureinpicture", handleEnterPiP);
        videoRef.current.removeEventListener("leavepictureinpicture", handleLeavePiP);
      }
    };
  }, [videoRef]);
  const play = useCallback2(async () => {
    if (!videoRef.current || isPlayPending) return;
    try {
      setIsPlayPending(true);
      if (!videoRef.current.paused) {
        return;
      }
      await videoRef.current.play();
    } catch (error) {
      const errorMessage = error.message;
      if (!errorMessage.includes("user didn't interact") && !errorMessage.includes("autoplay") && !errorMessage.includes("gesture")) {
        dispatch({ type: "error", message: `Playback failed: ${errorMessage}` });
      }
    } finally {
      setIsPlayPending(false);
    }
  }, [videoRef, isPlayPending]);
  const pause = useCallback2(() => {
    if (!videoRef.current || isPlayPending) return;
    if (!videoRef.current.paused) {
      videoRef.current.pause();
    }
  }, [videoRef, isPlayPending]);
  const seek = useCallback2((time) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = time;
  }, [videoRef]);
  const setVolume = useCallback2((volume) => {
    if (!videoRef.current || !Number.isFinite(volume)) return;
    videoRef.current.volume = Math.max(0, Math.min(1, volume));
  }, [videoRef]);
  const toggleMute = useCallback2(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
  }, [videoRef]);
  const toggleFullscreen = useCallback2(async () => {
    if (!videoRef.current) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await videoRef.current.requestFullscreen();
      }
    } catch (error) {
      dispatch({ type: "error", message: `Fullscreen failed: ${error.message}` });
    }
  }, [videoRef]);
  const setQuality = useCallback2((qualityId) => {
    if (!engine) return;
    engine.setQuality(qualityId);
  }, [engine]);
  const setPlaybackRate = useCallback2((rate) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = rate;
    dispatch({ type: "playback_rate_change", playbackRate: rate });
  }, [videoRef]);
  const togglePictureInPicture = useCallback2(async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (e) {
    }
  }, [videoRef]);
  const toggleTheaterMode = useCallback2(() => {
    dispatch({ type: "toggle_theater_mode" });
  }, []);
  const load = useCallback2(async (config) => {
    if (!engine || !isEngineReady) {
      setPendingConfig(config);
      return;
    }
    try {
      await engine.loadSource(config);
      setQualityLevels(engine.getQualityLevels());
    } catch (error) {
      if (isExpectedLoadInterruption(error)) {
        return;
      }
      dispatch({ type: "error", message: `Failed to load video: ${error.message}` });
    }
  }, [engine, isEngineReady]);
  const controls = useMemo(() => ({
    play,
    pause,
    seek,
    setVolume,
    toggleMute,
    toggleFullscreen,
    togglePictureInPicture,
    toggleTheaterMode,
    setPlaybackRate,
    setQuality,
    load
  }), [
    play,
    pause,
    seek,
    setVolume,
    toggleMute,
    toggleFullscreen,
    togglePictureInPicture,
    toggleTheaterMode,
    setPlaybackRate,
    setQuality,
    load
  ]);
  useEffect2(() => {
    if (typeof window === "undefined") return;
    const handleKeyPress = (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          if (state.isPlaying && !state.isPaused) {
            controls.pause();
          } else {
            void controls.play();
          }
          break;
        case "ArrowLeft":
          e.preventDefault();
          controls.seek(Math.max(0, state.currentTime - 10));
          break;
        case "ArrowRight":
          e.preventDefault();
          controls.seek(Math.min(state.duration, state.currentTime + 10));
          break;
        case "ArrowUp":
          e.preventDefault();
          controls.setVolume(Math.min(1, state.volume + 0.1));
          break;
        case "ArrowDown":
          e.preventDefault();
          controls.setVolume(Math.max(0, state.volume - 0.1));
          break;
        case "m":
          e.preventDefault();
          controls.toggleMute();
          break;
        case "f":
          e.preventDefault();
          void controls.toggleFullscreen();
          break;
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9": {
          e.preventDefault();
          const percentage = Number.parseInt(e.key, 10) / 10;
          controls.seek(state.duration * percentage);
          break;
        }
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [state.isPlaying, state.isPaused, state.currentTime, state.duration, state.volume, controls]);
  return {
    state,
    controls,
    qualityLevels,
    engine
  };
};

// src/hooks/use-video-gestures.ts
import { useCallback as useCallback3, useRef as useRef3, useState as useState3, useEffect as useEffect3 } from "react";
var DEFAULT_CONFIG = {
  enableTapToPlay: true,
  enableDoubleTapSeek: true,
  enableSwipeVolume: true,
  enableSwipeBrightness: false,
  seekAmount: 10,
  volumeSensitivity: 0.02,
  brightnessSensitivity: 0.02
};
var useVideoGestures = (elementRef, callbacks, config = {}) => {
  const mergedConfig = __spreadValues(__spreadValues({}, DEFAULT_CONFIG), config);
  const touchState = useRef3({
    startX: 0,
    startY: 0,
    startTime: 0,
    lastTapTime: 0,
    tapCount: 0,
    isActive: false
  });
  const [isGestureActive, setIsGestureActive] = useState3(false);
  const handleTouchStart = useCallback3((event) => {
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      const now = Date.now();
      touchState.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        startTime: now,
        lastTapTime: touchState.current.lastTapTime,
        tapCount: now - touchState.current.lastTapTime < 300 ? touchState.current.tapCount + 1 : 1,
        isActive: true
      };
      setIsGestureActive(true);
    }
  }, []);
  const handleTouchMove = useCallback3((event) => {
    var _a, _b;
    if (!touchState.current.isActive || event.touches.length !== 1) return;
    const touch = event.touches[0];
    const deltaX = touch.clientX - touchState.current.startX;
    const deltaY = touch.clientY - touchState.current.startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    if (distance > 10) {
      event.preventDefault();
    }
    if (Math.abs(deltaY) > 20 && Math.abs(deltaX) < 50) {
      const element = elementRef.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const isRightSide = touch.clientX > rect.left + rect.width / 2;
      if (isRightSide && mergedConfig.enableSwipeVolume) {
        const volumeDelta = -deltaY * mergedConfig.volumeSensitivity;
        (_a = callbacks.onSwipeVolume) == null ? void 0 : _a.call(callbacks, volumeDelta);
      } else if (!isRightSide && mergedConfig.enableSwipeBrightness) {
        const brightnessDelta = -deltaY * mergedConfig.brightnessSensitivity;
        (_b = callbacks.onSwipeBrightness) == null ? void 0 : _b.call(callbacks, brightnessDelta);
      }
    }
  }, [elementRef, callbacks, mergedConfig]);
  const handleTouchEnd = useCallback3((event) => {
    var _a;
    if (!touchState.current.isActive) return;
    const now = Date.now();
    const duration = now - touchState.current.startTime;
    const tapCount = touchState.current.tapCount;
    touchState.current.isActive = false;
    setIsGestureActive(false);
    if (duration < 300) {
      if (tapCount === 1) {
        setTimeout(() => {
          var _a2;
          if (touchState.current.tapCount === 1 && mergedConfig.enableTapToPlay) {
            (_a2 = callbacks.onTap) == null ? void 0 : _a2.call(callbacks);
          }
        }, 300);
      } else if (tapCount === 2 && mergedConfig.enableDoubleTapSeek) {
        const element = elementRef.current;
        if (element) {
          const rect = element.getBoundingClientRect();
          const isLeftSide = touchState.current.startX < rect.left + rect.width / 2;
          (_a = callbacks.onDoubleTap) == null ? void 0 : _a.call(callbacks, isLeftSide ? "left" : "right");
        }
        touchState.current.tapCount = 0;
      }
    }
    touchState.current.lastTapTime = now;
  }, [elementRef, callbacks, mergedConfig]);
  const handleTouchPinch = useCallback3((event) => {
    if (event.touches.length === 2) {
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + Math.pow(touch2.clientY - touch1.clientY, 2)
      );
    }
  }, [callbacks]);
  const handleMouseClick = useCallback3((event) => {
    var _a, _b;
    if (!mergedConfig.enableTapToPlay) return;
    const now = Date.now();
    const timeDiff = now - touchState.current.lastTapTime;
    if (timeDiff < 300) {
      if (mergedConfig.enableDoubleTapSeek) {
        const element = elementRef.current;
        if (element) {
          const rect = element.getBoundingClientRect();
          const isLeftSide = event.clientX < rect.left + rect.width / 2;
          (_a = callbacks.onDoubleTap) == null ? void 0 : _a.call(callbacks, isLeftSide ? "left" : "right");
        }
      }
    } else {
      (_b = callbacks.onTap) == null ? void 0 : _b.call(callbacks);
    }
    touchState.current.lastTapTime = now;
  }, [elementRef, callbacks, mergedConfig]);
  useEffect3(() => {
    const element = elementRef.current;
    if (!element) return;
    element.addEventListener("touchstart", handleTouchStart, { passive: false });
    element.addEventListener("touchmove", handleTouchMove, { passive: false });
    element.addEventListener("touchend", handleTouchEnd, { passive: true });
    element.addEventListener("click", handleMouseClick);
    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
      element.removeEventListener("click", handleMouseClick);
    };
  }, [elementRef, handleTouchStart, handleTouchMove, handleTouchEnd, handleMouseClick]);
  return {
    isGestureActive,
    config: mergedConfig
  };
};

// src/contexts/player-config-context.tsx
import { createContext, useContext, useState as useState4, useEffect as useEffect4 } from "react";

// src/types/player-config.ts
var PlayerPresets = {
  // Default full experience
  default: {
    controls: {
      show: true,
      visibility: {
        playPause: true,
        progress: true,
        volume: true,
        quality: true,
        fullscreen: true,
        pictureInPicture: true,
        theaterMode: true,
        playbackRate: true,
        keyboardShortcuts: true,
        settings: true,
        time: true
      },
      position: "bottom"
    },
    keyboard: { enabled: true },
    gestures: { enabled: true, tapToPlay: true, doubleTapSeek: true },
    auto: { autoHideControls: true, autoHideDelay: 3e3 },
    features: { thumbnailPreview: true, chapters: true }
  }
};
var mergePlayerConfig = (base = {}, override = {}) => {
  var _a, _b;
  return {
    theme: __spreadValues(__spreadValues({}, base.theme), override.theme),
    controls: __spreadProps(__spreadValues(__spreadValues({}, base.controls), override.controls), {
      visibility: __spreadValues(__spreadValues({}, (_a = base.controls) == null ? void 0 : _a.visibility), (_b = override.controls) == null ? void 0 : _b.visibility)
    }),
    keyboard: __spreadValues(__spreadValues({}, base.keyboard), override.keyboard),
    gestures: __spreadValues(__spreadValues({}, base.gestures), override.gestures),
    auto: __spreadValues(__spreadValues({}, base.auto), override.auto),
    analytics: __spreadValues(__spreadValues({}, base.analytics), override.analytics),
    features: __spreadValues(__spreadValues({}, base.features), override.features),
    responsive: __spreadValues(__spreadValues({}, base.responsive), override.responsive),
    performance: __spreadValues(__spreadValues({}, base.performance), override.performance),
    customization: __spreadValues(__spreadValues({}, base.customization), override.customization)
  };
};

// src/contexts/player-config-context.tsx
import { jsx as jsx7 } from "react/jsx-runtime";
var PlayerConfigContext = createContext(void 0);
var PlayerConfigProvider = ({
  children,
  defaultConfig = PlayerPresets.default,
  storageKey = "nextjs-videoplayer-config"
}) => {
  const [config, setConfig] = useState4(defaultConfig);
  useEffect4(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const savedConfig = JSON.parse(saved);
          setConfig(mergePlayerConfig(defaultConfig, savedConfig));
        } catch (error) {
          getPlayerLogger().warn("Failed to load saved player config:", error);
        }
      }
    }
  }, [defaultConfig, storageKey]);
  const saveConfigToStorage = (newConfig) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify(newConfig));
    }
  };
  const updateConfig = (newConfig) => {
    const updatedConfig = mergePlayerConfig(config, newConfig);
    setConfig(updatedConfig);
    saveConfigToStorage(updatedConfig);
  };
  const resetConfig = () => {
    setConfig(defaultConfig);
    saveConfigToStorage(defaultConfig);
  };
  const saveConfig = (name) => {
    if (typeof window !== "undefined") {
      const savedConfigs = JSON.parse(localStorage.getItem(`${storageKey}-saved`) || "{}");
      savedConfigs[name] = config;
      localStorage.setItem(`${storageKey}-saved`, JSON.stringify(savedConfigs));
    }
  };
  const loadSavedConfig = (name) => {
    if (typeof window !== "undefined") {
      const savedConfigs = JSON.parse(localStorage.getItem(`${storageKey}-saved`) || "{}");
      if (savedConfigs[name]) {
        setConfig(savedConfigs[name]);
        saveConfigToStorage(savedConfigs[name]);
      }
    }
  };
  const getSavedConfigs = () => {
    if (typeof window !== "undefined") {
      const savedConfigs = JSON.parse(localStorage.getItem(`${storageKey}-saved`) || "{}");
      return Object.keys(savedConfigs);
    }
    return [];
  };
  return /* @__PURE__ */ jsx7(
    PlayerConfigContext.Provider,
    {
      value: {
        config,
        updateConfig,
        resetConfig,
        saveConfig,
        loadSavedConfig,
        getSavedConfigs
      },
      children
    }
  );
};
var usePlayerConfig = () => {
  const context = useContext(PlayerConfigContext);
  if (context === void 0) {
    throw new Error("usePlayerConfig must be used within a PlayerConfigProvider");
  }
  return context;
};

// src/components/player/configurable-video-player.tsx
import { jsx as jsx8, jsxs as jsxs6 } from "react/jsx-runtime";
var ConfigurableVideoPlayer = forwardRef(({
  src,
  fallbackSources,
  drmConfig,
  poster,
  thumbnailUrl,
  autoPlay,
  muted = false,
  loop = false,
  playsInline = true,
  className,
  configOverride,
  enginePlugins,
  aspectRatio = "auto",
  customAspectRatio,
  onReady,
  onPlay,
  onPause,
  onError,
  onTimeUpdate,
  onStateChange
}, ref) => {
  var _a, _b, _c, _d;
  const videoRef = useRef4(null);
  const containerRef = useRef4(null);
  const lastStateSignatureRef = useRef4(null);
  const onReadyRef = useRef4(onReady);
  const readySignalRef = useRef4(null);
  const { config: contextConfig } = usePlayerConfig();
  const config = configOverride ? __spreadValues(__spreadValues({}, contextConfig), configOverride) : contextConfig;
  const { state, controls: playerControls, qualityLevels, engine } = useVideoPlayer(videoRef, {
    autoPlay: (_b = autoPlay != null ? autoPlay : (_a = config.auto) == null ? void 0 : _a.autoPlay) != null ? _b : false,
    muted,
    volume: 1,
    enginePlugins
  });
  const gestureCallbacks = {
    onTap: () => {
      state.isPlaying ? playerControls.pause() : playerControls.play();
    },
    onDoubleTap: (direction) => {
      const seekAmount = 10;
      if (direction === "left") {
        playerControls.seek(Math.max(0, state.currentTime - seekAmount));
      } else {
        playerControls.seek(Math.min(state.duration, state.currentTime + seekAmount));
      }
    },
    onSwipeVolume: (delta) => {
      const newVolume = Math.max(0, Math.min(1, state.volume + delta));
      playerControls.setVolume(newVolume);
    }
  };
  useVideoGestures(videoRef, gestureCallbacks, {
    enableTapToPlay: true,
    enableDoubleTapSeek: true,
    enableSwipeVolume: false,
    seekAmount: 10,
    volumeSensitivity: 0.02
  });
  const getAspectRatio = () => {
    if (aspectRatio === "custom" && customAspectRatio) {
      return customAspectRatio;
    }
    if (aspectRatio === "auto" || state.isFullscreen || state.isTheaterMode) {
      return "auto";
    }
    return aspectRatio;
  };
  const isVerticalFormat = aspectRatio === "9/16" || aspectRatio === "3/4";
  const isSquareFormat = aspectRatio === "1/1";
  useEffect5(() => {
    onReadyRef.current = onReady;
  }, [onReady]);
  useEffect5(() => {
    var _a2, _b2;
    if (!src || !engine) return;
    const videoConfig = {
      src,
      fallbackSources,
      drm: drmConfig,
      poster,
      autoplay: (_b2 = autoPlay != null ? autoPlay : (_a2 = config.auto) == null ? void 0 : _a2.autoPlay) != null ? _b2 : false,
      muted,
      loop,
      playsInline
    };
    const timer = setTimeout(() => {
      playerControls.load(videoConfig);
    }, 50);
    return () => clearTimeout(timer);
  }, [src, fallbackSources, drmConfig, poster, autoPlay, muted, loop, playsInline, engine, (_c = config.auto) == null ? void 0 : _c.autoPlay]);
  useEffect5(() => {
    if (state.isPlaying) {
      onPlay == null ? void 0 : onPlay();
    } else if (state.isPaused) {
      onPause == null ? void 0 : onPause();
    }
  }, [state.isPlaying, state.isPaused, onPlay, onPause]);
  useEffect5(() => {
    if (state.error) {
      onError == null ? void 0 : onError(state.error);
    }
  }, [state.error, onError]);
  useEffect5(() => {
    onTimeUpdate == null ? void 0 : onTimeUpdate(state.currentTime, state.duration);
  }, [state.currentTime, state.duration, onTimeUpdate]);
  useEffect5(() => {
    if (!onStateChange) {
      return;
    }
    const signature = JSON.stringify({
      isPlaying: state.isPlaying,
      isPaused: state.isPaused,
      isLoading: state.isLoading,
      isMuted: state.isMuted,
      currentTime: Number(state.currentTime.toFixed(2)),
      duration: Number(state.duration.toFixed(2)),
      volume: Number(state.volume.toFixed(2)),
      buffered: Number(state.buffered.toFixed(2)),
      quality: state.quality,
      playbackRate: state.playbackRate,
      isFullscreen: state.isFullscreen,
      isPictureInPicture: state.isPictureInPicture,
      isTheaterMode: state.isTheaterMode,
      error: state.error,
      playCount: state.playCount,
      totalWatchTime: Number(state.totalWatchTime.toFixed(2)),
      bufferingTime: Number(state.bufferingTime.toFixed(2)),
      qualityChanges: state.qualityChanges
    });
    if (lastStateSignatureRef.current === signature) {
      return;
    }
    lastStateSignatureRef.current = signature;
    onStateChange(state);
  }, [state, onStateChange]);
  useEffect5(() => {
    var _a2;
    if (state.isLoading || state.duration <= 0) {
      return;
    }
    const readySignal = `${src != null ? src : "no-src"}|${state.duration}`;
    if (readySignalRef.current === readySignal) {
      return;
    }
    readySignalRef.current = readySignal;
    (_a2 = onReadyRef.current) == null ? void 0 : _a2.call(onReadyRef);
  }, [state.isLoading, state.duration, src]);
  React3.useImperativeHandle(ref, () => videoRef.current);
  const themeStyles = config.theme ? {
    "--player-primary": config.theme.primary || "#dc2626",
    "--player-secondary": config.theme.secondary || "#64748b",
    "--player-accent": config.theme.accent || "#dc2626",
    "--player-progress": config.theme.progressColor || "#dc2626",
    "--player-buffer": config.theme.bufferColor || "rgba(255,255,255,0.4)"
  } : {};
  const shouldShowControls = true;
  return /* @__PURE__ */ jsxs6(
    "div",
    {
      ref: containerRef,
      className: cn(
        "relative bg-black overflow-hidden group transition-all duration-300",
        "focus-within:outline-none focus-within:ring-2 focus-within:ring-white/30",
        state.isFullscreen && "fixed inset-0 z-50",
        state.isTheaterMode && "mx-auto max-w-none",
        // Format specific styles
        isVerticalFormat ? "max-w-sm mx-auto w-full" : isSquareFormat ? "max-w-lg mx-auto w-full" : "w-full",
        className
      ),
      style: __spreadValues({
        aspectRatio: getAspectRatio(),
        height: state.isTheaterMode ? "70vh" : isVerticalFormat ? "min(70vh, 80vw * 16/9)" : isSquareFormat ? "min(60vh, 90vw)" : "auto",
        maxHeight: isVerticalFormat ? "70vh" : isSquareFormat ? "60vh" : void 0,
        width: isVerticalFormat ? "min(400px, 90vw)" : isSquareFormat ? "min(500px, 90vw)" : "100%"
      }, themeStyles),
      children: [
        /* @__PURE__ */ jsx8(
          "video",
          __spreadProps(__spreadValues({
            ref: videoRef,
            className: "w-full h-full object-contain",
            controls: false,
            playsInline
          }, playsInline && { "webkit-playsinline": "" }), {
            poster,
            preload: "metadata"
          })
        ),
        state.isLoading && /* @__PURE__ */ jsx8("div", { className: "absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px]", children: /* @__PURE__ */ jsx8(LoadingSpinner, {}) }),
        state.error && /* @__PURE__ */ jsx8(
          ErrorDisplay,
          {
            error: state.error,
            onRetry: () => {
              var _a2, _b2;
              if (src) {
                playerControls.load({
                  src,
                  fallbackSources,
                  drm: drmConfig,
                  poster,
                  autoplay: (_b2 = autoPlay != null ? autoPlay : (_a2 = config.auto) == null ? void 0 : _a2.autoPlay) != null ? _b2 : false,
                  muted,
                  loop,
                  playsInline
                });
              }
            }
          }
        ),
        shouldShowControls && /* @__PURE__ */ jsx8(
          VideoControls,
          {
            state,
            controls: playerControls,
            qualityLevels,
            controlsConfig: {
              fullscreen: true,
              volume: true,
              quality: true,
              progress: true,
              playPause: true,
              playbackRate: true,
              pictureInPicture: true,
              theaterMode: true,
              settings: true,
              time: true
            },
            className: cn(
              "transition-opacity duration-300",
              "opacity-100 z-30 pointer-events-auto"
            )
          }
        ),
        ((_d = config.analytics) == null ? void 0 : _d.enabled) && /* @__PURE__ */ jsx8("div", { className: "hidden", "data-analytics": "true" })
      ]
    }
  );
});
ConfigurableVideoPlayer.displayName = "ConfigurableVideoPlayer";

// src/components/player/video-player.tsx
import React4, { useRef as useRef5, useEffect as useEffect6, forwardRef as forwardRef2, useCallback as useCallback4 } from "react";
import { jsx as jsx9, jsxs as jsxs7 } from "react/jsx-runtime";
var VideoPlayer = forwardRef2(({
  src,
  fallbackSources,
  drmConfig,
  poster,
  autoPlay = false,
  muted = false,
  loop = false,
  playsInline = true,
  className,
  controls = {
    show: true,
    fullscreen: true,
    quality: true,
    volume: true,
    progress: true,
    playPause: true,
    playbackRate: true,
    pictureInPicture: true,
    theaterMode: true
  },
  gestures = {
    enabled: true,
    tapToPlay: true,
    doubleTapSeek: true,
    swipeVolume: true
  },
  plugins = [],
  enginePlugins = [],
  onReady,
  onPlay,
  onPause,
  onError,
  onTimeUpdate,
  onStateChange
}, ref) => {
  const videoRef = useRef5(null);
  const containerRef = useRef5(null);
  const [showControls, setShowControls] = React4.useState(true);
  const controlsTimeoutRef = useRef5(null);
  const legacyPluginsInitializedRef = useRef5(false);
  const { state, controls: playerControls, qualityLevels, engine } = useVideoPlayer(videoRef, {
    autoPlay,
    muted,
    volume: 1,
    enginePlugins
  });
  const handlePlay = useCallback4(() => {
    onPlay == null ? void 0 : onPlay();
  }, [onPlay]);
  const handlePause = useCallback4(() => {
    onPause == null ? void 0 : onPause();
  }, [onPause]);
  const handleError = useCallback4((error) => {
    onError == null ? void 0 : onError(error);
  }, [onError]);
  const handleTimeUpdate = useCallback4((currentTime, duration) => {
    onTimeUpdate == null ? void 0 : onTimeUpdate(currentTime, duration);
  }, [onTimeUpdate]);
  const handleStateChange = useCallback4((newState) => {
    onStateChange == null ? void 0 : onStateChange(newState);
  }, [onStateChange]);
  const handleReady = useCallback4(() => {
    onReady == null ? void 0 : onReady();
  }, [onReady]);
  const { isGestureActive } = useVideoGestures(
    containerRef,
    {
      onTap: () => {
        if (gestures.tapToPlay && controls.playPause && !state.isLoading) {
          if (state.isPlaying && !state.isPaused) {
            playerControls.pause();
          } else if (state.isPaused && !state.isPlaying) {
            playerControls.play();
          }
        }
        showControlsTemporarily();
      },
      onDoubleTap: (direction) => {
        if (gestures.doubleTapSeek) {
          const seekAmount = direction === "left" ? -10 : 10;
          const newTime = Math.max(0, Math.min(state.duration, state.currentTime + seekAmount));
          playerControls.seek(newTime);
        }
      },
      onSwipeVolume: (delta) => {
        if (gestures.swipeVolume && controls.volume) {
          const newVolume = Math.max(0, Math.min(1, state.volume + delta));
          playerControls.setVolume(newVolume);
        }
      }
    },
    {
      enableTapToPlay: gestures.tapToPlay,
      enableDoubleTapSeek: gestures.doubleTapSeek,
      enableSwipeVolume: gestures.swipeVolume
    }
  );
  useEffect6(() => {
    if (!src || !engine) return;
    const config = {
      src,
      fallbackSources,
      drm: drmConfig,
      poster,
      autoplay: autoPlay,
      muted,
      loop,
      playsInline
    };
    const timer = setTimeout(() => {
      playerControls.load(config);
    }, 50);
    return () => clearTimeout(timer);
  }, [src, fallbackSources, drmConfig, poster, autoPlay, muted, loop, playsInline, engine]);
  useEffect6(() => {
    if (state.isPlaying) {
      handlePlay();
    } else if (state.isPaused) {
      handlePause();
    }
  }, [state.isPlaying, state.isPaused, handlePlay, handlePause]);
  useEffect6(() => {
    if (state.error) {
      handleError(state.error);
    }
  }, [state.error, handleError]);
  useEffect6(() => {
    handleTimeUpdate(state.currentTime, state.duration);
  }, [state.currentTime, state.duration, handleTimeUpdate]);
  useEffect6(() => {
    handleStateChange(state);
  }, [state, handleStateChange]);
  useEffect6(() => {
    if (!state.isLoading && state.duration > 0) {
      handleReady();
    }
  }, [state.isLoading, state.duration, handleReady]);
  useEffect6(() => {
    legacyPluginsInitializedRef.current = false;
  }, [engine]);
  useEffect6(() => {
    if (!engine || plugins.length === 0 || legacyPluginsInitializedRef.current) {
      return;
    }
    plugins.forEach((plugin) => {
      try {
        plugin({ engine, state, controls: playerControls });
      } catch (error) {
        getPlayerLogger().warn("Plugin initialization failed:", error);
      }
    });
    legacyPluginsInitializedRef.current = true;
  }, [engine, plugins, playerControls, state]);
  const showControlsTemporarily = React4.useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (state.isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3e3);
    }
  }, [state.isPlaying]);
  useEffect6(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleMouseMove = () => {
      showControlsTemporarily();
    };
    const handleMouseLeave = () => {
      if (state.isPlaying) {
        setShowControls(false);
      }
    };
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [showControlsTemporarily, state.isPlaying]);
  useEffect6(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);
  React4.useImperativeHandle(ref, () => videoRef.current);
  return /* @__PURE__ */ jsxs7(
    "div",
    {
      ref: containerRef,
      className: cn(
        "relative w-full bg-black overflow-hidden group transition-all duration-300",
        "focus-within:outline-none focus-within:ring-2 focus-within:ring-white/30",
        state.isFullscreen && "fixed inset-0 z-50",
        state.isTheaterMode && "mx-auto max-w-none",
        className
      ),
      style: {
        aspectRatio: state.isFullscreen || state.isTheaterMode ? "auto" : "16/9",
        height: state.isTheaterMode ? "70vh" : "auto"
      },
      children: [
        /* @__PURE__ */ jsx9(
          "video",
          __spreadProps(__spreadValues({
            ref: videoRef,
            className: "w-full h-full object-contain",
            playsInline
          }, playsInline && { "webkit-playsinline": "" }), {
            poster,
            preload: "metadata"
          })
        ),
        state.isLoading && /* @__PURE__ */ jsx9("div", { className: "absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px]", children: /* @__PURE__ */ jsx9(LoadingSpinner, {}) }),
        state.error && /* @__PURE__ */ jsx9("div", { className: "absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm", children: /* @__PURE__ */ jsx9(ErrorDisplay, { error: state.error, onRetry: () => playerControls.load({ src, fallbackSources, drm: drmConfig }) }) }),
        isGestureActive && gestures.enabled && /* @__PURE__ */ jsx9("div", { className: "absolute inset-0 pointer-events-none", children: /* @__PURE__ */ jsx9("div", { className: "absolute inset-0 bg-white/5 animate-pulse" }) }),
        controls.show && (showControls || state.isPaused || !state.duration) && /* @__PURE__ */ jsx9(
          VideoControls,
          {
            state,
            controls: playerControls,
            qualityLevels,
            controlsConfig: controls,
            onShow: () => setShowControls(true),
            onHide: () => setShowControls(false)
          }
        )
      ]
    }
  );
});
VideoPlayer.displayName = "VideoPlayer";

// src/components/controls/mobile-video-controls.tsx
import { useState as useState6, useEffect as useEffect8, useRef as useRef7, useCallback as useCallback5 } from "react";
import {
  Play as Play2,
  Pause as Pause2,
  Volume1 as Volume12,
  Volume2 as Volume22,
  VolumeX as VolumeX2,
  Maximize as Maximize2,
  Minimize as Minimize2,
  Settings as Settings2,
  Loader2 as Loader22,
  PictureInPicture as PictureInPicture3,
  Gauge as Gauge2,
  SkipBack,
  SkipForward,
  Check as Check2,
  ChevronRight as ChevronRight2,
  X
} from "lucide-react";

// src/components/player/video-thumbnail.tsx
import { useState as useState5, useEffect as useEffect7, useRef as useRef6 } from "react";
import { jsx as jsx10, jsxs as jsxs8 } from "react/jsx-runtime";
var formatTime2 = (seconds) => {
  if (!isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};
var VideoThumbnail = ({
  duration,
  currentTime,
  thumbnailUrl,
  thumbnailCount = 100,
  thumbnailSize = { width: 160, height: 90 },
  className,
  showTime = true,
  isMobile = false
}) => {
  const [thumbnailSrc, setThumbnailSrc] = useState5("");
  const [spritePosition, setSpritePosition] = useState5({ x: 0, y: 0 });
  const canvasRef = useRef6(null);
  useEffect7(() => {
    if (!thumbnailUrl || !duration) return;
    const progress = Math.max(0, Math.min(1, currentTime / duration));
    const thumbnailIndex = Math.floor(progress * (thumbnailCount - 1));
    if (thumbnailUrl.includes("sprite")) {
      const spriteCols = 10;
      const spriteRows = Math.ceil(thumbnailCount / spriteCols);
      const col = thumbnailIndex % spriteCols;
      const row = Math.floor(thumbnailIndex / spriteCols);
      setSpritePosition({
        x: col * thumbnailSize.width,
        y: row * thumbnailSize.height
      });
      setThumbnailSrc(thumbnailUrl);
    } else {
      const paddedIndex = thumbnailIndex.toString().padStart(3, "0");
      setThumbnailSrc(`${thumbnailUrl}/thumb_${paddedIndex}.jpg`);
    }
  }, [currentTime, duration, thumbnailUrl, thumbnailCount, thumbnailSize]);
  const generateFallbackThumbnail = async (videoSrc, time) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.muted = true;
    return new Promise((resolve) => {
      video.onloadeddata = () => {
        video.currentTime = time;
      };
      video.onseeked = () => {
        canvas.width = thumbnailSize.width;
        canvas.height = thumbnailSize.height;
        ctx.drawImage(video, 0, 0, thumbnailSize.width, thumbnailSize.height);
        const dataURL = canvas.toDataURL("image/jpeg", 0.8);
        resolve(dataURL);
      };
      video.src = videoSrc;
    });
  };
  if (!thumbnailSrc && !thumbnailUrl) {
    return null;
  }
  return /* @__PURE__ */ jsxs8(
    "div",
    {
      className: cn(
        "absolute bottom-6 transform -translate-x-1/2 pointer-events-none z-20",
        "bg-black/90 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-white/20",
        isMobile ? "bottom-12" : "bottom-6",
        className
      ),
      style: {
        width: thumbnailSize.width + 16,
        height: thumbnailSize.height + (showTime ? 40 : 16)
      },
      children: [
        /* @__PURE__ */ jsxs8(
          "div",
          {
            className: "relative bg-gray-800",
            style: {
              width: thumbnailSize.width,
              height: thumbnailSize.height,
              margin: "8px 8px 0 8px"
            },
            children: [
              thumbnailSrc ? /* @__PURE__ */ jsx10(
                "img",
                {
                  src: thumbnailSrc,
                  alt: `Preview at ${formatTime2(currentTime)}`,
                  className: "w-full h-full object-cover rounded",
                  style: (thumbnailUrl == null ? void 0 : thumbnailUrl.includes("sprite")) ? {
                    objectPosition: `-${spritePosition.x}px -${spritePosition.y}px`,
                    width: thumbnailSize.width * 10,
                    // Sprite sheet width
                    height: thumbnailSize.height * 10
                    // Sprite sheet height
                  } : void 0,
                  onError: () => {
                    setThumbnailSrc(`/api/placeholder/${thumbnailSize.width}/${thumbnailSize.height}`);
                  }
                }
              ) : /* @__PURE__ */ jsx10("div", { className: "w-full h-full bg-gray-700 flex items-center justify-center rounded", children: /* @__PURE__ */ jsx10("div", { className: "text-white/60 text-xs", children: "Loading..." }) }),
              /* @__PURE__ */ jsx10("div", { className: "absolute inset-0 bg-black/20 rounded" })
            ]
          }
        ),
        showTime && /* @__PURE__ */ jsx10("div", { className: "px-3 py-2 text-center", children: /* @__PURE__ */ jsx10("span", { className: "text-white text-sm font-medium", children: formatTime2(currentTime) }) }),
        /* @__PURE__ */ jsx10("div", { className: "absolute -bottom-1 left-1/2 transform -translate-x-1/2", children: /* @__PURE__ */ jsx10("div", { className: "w-3 h-3 bg-black/90 rotate-45 border-r border-b border-white/20" }) }),
        /* @__PURE__ */ jsx10("canvas", { ref: canvasRef, className: "hidden" })
      ]
    }
  );
};

// src/components/controls/mobile-video-controls.tsx
import { jsx as jsx11, jsxs as jsxs9 } from "react/jsx-runtime";
var formatTime3 = (seconds) => {
  if (!isFinite(seconds)) return "0:00";
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor(seconds % 3600 / 60);
  const secs = Math.floor(seconds % 60);
  if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};
var playbackRateOptions2 = [
  { value: 0.5, label: "0.5x" },
  { value: 0.75, label: "0.75x" },
  { value: 1, label: "Normal" },
  { value: 1.25, label: "1.25x" },
  { value: 1.5, label: "1.5x" },
  { value: 2, label: "2x" }
];
var iconBtnClass2 = "flex items-center justify-center w-11 h-11 rounded-full text-white hover:bg-white/10 active:bg-white/20 transition-colors duration-200 touch-manipulation";
var iconClass2 = "w-[22px] h-[22px]";
var MobileVideoControls = ({
  state,
  controls,
  qualityLevels,
  className,
  onShow,
  onHide,
  thumbnailPreview = false,
  thumbnailUrl
}) => {
  const [showSettings, setShowSettings] = useState6(false);
  const [settingsPage, setSettingsPage] = useState6("main");
  const [isDragging, setIsDragging] = useState6(false);
  const [seekingTime, setSeekingTime] = useState6(null);
  const [isMounted, setIsMounted] = useState6(false);
  const [isVisible, setIsVisible] = useState6(true);
  const [hoverTime, setHoverTime] = useState6(null);
  const [hoverX, setHoverX] = useState6(0);
  const hideTimeoutRef = useRef7(null);
  const progressRef = useRef7(null);
  const rafRef = useRef7(0);
  useEffect8(() => {
    setIsMounted(true);
  }, []);
  const showControlsTemporarily = useCallback5(() => {
    setIsVisible(true);
    onShow == null ? void 0 : onShow();
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    if (state.isPlaying && !showSettings) {
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
        onHide == null ? void 0 : onHide();
      }, 3e3);
    }
  }, [state.isPlaying, showSettings, onShow, onHide]);
  useEffect8(() => {
    if (!state.isPlaying || showSettings) {
      setIsVisible(true);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    }
  }, [state.isPlaying, showSettings]);
  const handleContainerTap = useCallback5((e) => {
    if (!isVisible) {
      e.preventDefault();
      e.stopPropagation();
      showControlsTemporarily();
      return;
    }
    if (e.target === e.currentTarget) {
      if (showSettings) {
        setShowSettings(false);
        return;
      }
      setIsVisible(false);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    }
  }, [isVisible, showControlsTemporarily, showSettings]);
  useEffect8(() => {
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);
  const displayTime = seekingTime !== null ? seekingTime : state.currentTime;
  const progressPercentage = state.duration > 0 ? displayTime / state.duration * 100 : 0;
  const bufferedPercentage = state.buffered;
  const positionFromClient = useCallback5((clientX) => {
    if (!progressRef.current) return 0;
    const rect = progressRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    return x / rect.width * state.duration;
  }, [state.duration]);
  const updateHover = useCallback5((clientX) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(x / rect.width, 1));
    setHoverTime(pct * state.duration);
    setHoverX(pct * 100);
  }, [state.duration]);
  const handleProgressClick = (e) => {
    if (isDragging) return;
    const time = positionFromClient(e.clientX);
    setSeekingTime(time);
    controls.seek(time);
    requestAnimationFrame(() => {
      setTimeout(() => setSeekingTime(null), 150);
    });
  };
  const handleProgressHover = (e) => updateHover(e.clientX);
  const handleProgressMouseDown = useCallback5((e) => {
    e.preventDefault();
    setIsDragging(true);
    setSeekingTime(positionFromClient(e.clientX));
  }, [positionFromClient]);
  const handleProgressTouchStart = useCallback5((e) => {
    setIsDragging(true);
    setSeekingTime(positionFromClient(e.touches[0].clientX));
  }, [positionFromClient]);
  useEffect8(() => {
    if (!isDragging) return;
    const onMove = (clientX) => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setSeekingTime(positionFromClient(clientX));
        updateHover(clientX);
      });
    };
    const onMouseMove = (e) => onMove(e.clientX);
    const onTouchMove = (e) => onMove(e.touches[0].clientX);
    const onEnd = () => {
      cancelAnimationFrame(rafRef.current);
      setIsDragging(false);
      setHoverTime(null);
      if (seekingTime !== null) controls.seek(seekingTime);
      setTimeout(() => setSeekingTime(null), 150);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onEnd);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [isDragging, positionFromClient, updateHover, seekingTime, controls]);
  const handleSeek = (direction) => {
    const amt = 10;
    controls.seek(direction === "backward" ? Math.max(0, state.currentTime - amt) : Math.min(state.duration, state.currentTime + amt));
    showControlsTemporarily();
  };
  const VolumeIcon = state.isMuted || state.volume === 0 ? VolumeX2 : state.volume < 0.5 ? Volume12 : Volume22;
  if (!isMounted) return null;
  return /* @__PURE__ */ jsxs9(
    "div",
    {
      className: cn(
        "absolute inset-0 flex flex-col text-white z-10 transition-opacity duration-300",
        isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-auto",
        className
      ),
      onClickCapture: handleContainerTap,
      style: { paddingBottom: "env(safe-area-inset-bottom)" },
      children: [
        /* @__PURE__ */ jsxs9("div", { className: cn("flex items-center gap-1.5 p-2 transition-opacity duration-300", isVisible ? "opacity-100" : "opacity-0"), children: [
          state.isLoading && /* @__PURE__ */ jsx11("div", { className: "rounded-full bg-black/60 backdrop-blur-md p-2", children: /* @__PURE__ */ jsx11(Loader22, { className: "h-4 w-4 animate-spin" }) }),
          state.playbackRate !== 1 && /* @__PURE__ */ jsx11("div", { className: "rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1", children: /* @__PURE__ */ jsxs9("span", { className: "text-xs font-medium", children: [
            state.playbackRate,
            "x"
          ] }) })
        ] }),
        /* @__PURE__ */ jsx11("div", { className: "flex-1 flex items-center justify-center", children: /* @__PURE__ */ jsxs9("div", { className: cn("flex items-center gap-8 sm:gap-10 transition-opacity duration-300", isVisible ? "opacity-100" : "opacity-0"), children: [
          /* @__PURE__ */ jsx11(
            "button",
            {
              type: "button",
              className: "flex items-center justify-center w-14 h-14 rounded-full bg-black/50 backdrop-blur-md text-white active:scale-95 transition-all duration-200 touch-manipulation",
              onClick: () => handleSeek("backward"),
              disabled: !state.duration,
              children: /* @__PURE__ */ jsx11(SkipBack, { className: "h-6 w-6" })
            }
          ),
          /* @__PURE__ */ jsx11(
            "button",
            {
              type: "button",
              className: "flex items-center justify-center w-[72px] h-[72px] rounded-full bg-black/60 backdrop-blur-md text-white active:scale-90 transition-all duration-200 touch-manipulation",
              onClick: () => {
                state.isPlaying ? controls.pause() : controls.play();
                showControlsTemporarily();
              },
              disabled: !state.duration && !state.isLoading,
              children: state.isLoading ? /* @__PURE__ */ jsx11(Loader22, { className: "h-9 w-9 animate-spin" }) : state.isPlaying ? /* @__PURE__ */ jsx11(Pause2, { className: "h-9 w-9" }) : /* @__PURE__ */ jsx11(Play2, { className: "h-9 w-9 ml-0.5" })
            }
          ),
          /* @__PURE__ */ jsx11(
            "button",
            {
              type: "button",
              className: "flex items-center justify-center w-14 h-14 rounded-full bg-black/50 backdrop-blur-md text-white active:scale-95 transition-all duration-200 touch-manipulation",
              onClick: () => handleSeek("forward"),
              disabled: !state.duration,
              children: /* @__PURE__ */ jsx11(SkipForward, { className: "h-6 w-6" })
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxs9("div", { className: cn("transition-opacity duration-300", isVisible ? "opacity-100" : "opacity-0"), children: [
          /* @__PURE__ */ jsxs9(
            "div",
            {
              ref: progressRef,
              className: "group/progress relative w-full cursor-pointer touch-manipulation",
              onClick: handleProgressClick,
              onMouseMove: handleProgressHover,
              onMouseDown: handleProgressMouseDown,
              onMouseLeave: () => {
                if (!isDragging) setHoverTime(null);
              },
              onTouchStart: handleProgressTouchStart,
              role: "slider",
              "aria-valuemin": 0,
              "aria-valuemax": state.duration || 0,
              "aria-valuenow": displayTime,
              "aria-valuetext": `${formatTime3(displayTime)} of ${formatTime3(state.duration)}`,
              tabIndex: 0,
              children: [
                hoverTime !== null && !thumbnailPreview && /* @__PURE__ */ jsx11(
                  "div",
                  {
                    className: "absolute bottom-full mb-3 -translate-x-1/2 bg-black/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-xs font-medium pointer-events-none z-10 whitespace-nowrap shadow-lg",
                    style: { left: `${hoverX}%` },
                    children: formatTime3(hoverTime)
                  }
                ),
                thumbnailPreview && hoverTime !== null && /* @__PURE__ */ jsx11("div", { className: "absolute bottom-full mb-2", style: { left: `${hoverX}%`, transform: "translateX(-50%)" }, children: /* @__PURE__ */ jsx11(
                  VideoThumbnail,
                  {
                    duration: state.duration,
                    currentTime: hoverTime,
                    thumbnailUrl,
                    isMobile: true,
                    thumbnailSize: { width: 120, height: 68 }
                  }
                ) }),
                /* @__PURE__ */ jsx11("div", { className: "h-5 flex items-end", children: /* @__PURE__ */ jsxs9("div", { className: cn(
                  "relative w-full transition-all duration-150",
                  isDragging ? "h-[5px]" : "h-[3px] group-hover/progress:h-[5px]"
                ), children: [
                  /* @__PURE__ */ jsx11("div", { className: "absolute inset-0 bg-white/20" }),
                  /* @__PURE__ */ jsx11("div", { className: "absolute left-0 top-0 h-full bg-white/40", style: { width: `${bufferedPercentage}%` } }),
                  /* @__PURE__ */ jsx11("div", { className: "absolute left-0 top-0 h-full bg-red-600", style: { width: `${progressPercentage}%` } }),
                  hoverTime !== null && /* @__PURE__ */ jsx11("div", { className: "absolute top-0 h-full w-[2px] bg-white/60 pointer-events-none", style: { left: `${hoverX}%` } }),
                  /* @__PURE__ */ jsx11("div", { className: cn(
                    "absolute top-1/2 w-[14px] h-[14px] bg-red-600 rounded-full -translate-y-1/2 transition-all duration-150 shadow-md",
                    isDragging ? "opacity-100 scale-110" : "opacity-0 group-hover/progress:opacity-100 group-hover/progress:scale-100"
                  ), style: { left: `calc(${progressPercentage}% - 7px)` } })
                ] }) })
              ]
            }
          ),
          /* @__PURE__ */ jsxs9("div", { className: "flex items-center gap-1.5 px-2 pb-2 pt-0.5", children: [
            /* @__PURE__ */ jsx11("div", { className: "flex items-center rounded-full bg-black/60 backdrop-blur-md px-3 h-10 sm:h-11", children: /* @__PURE__ */ jsxs9("span", { className: "text-white text-[11px] sm:text-xs tabular-nums whitespace-nowrap", children: [
              formatTime3(displayTime),
              " ",
              /* @__PURE__ */ jsx11("span", { className: "text-white/50", children: "/" }),
              " ",
              formatTime3(state.duration)
            ] }) }),
            /* @__PURE__ */ jsx11("div", { className: "flex-1 min-w-0" }),
            /* @__PURE__ */ jsxs9("div", { className: "flex items-center rounded-full bg-black/60 backdrop-blur-md", children: [
              /* @__PURE__ */ jsx11(
                "button",
                {
                  type: "button",
                  onClick: controls.toggleMute,
                  title: state.isMuted ? "Unmute" : "Mute",
                  className: iconBtnClass2,
                  children: /* @__PURE__ */ jsx11(VolumeIcon, { className: iconClass2 })
                }
              ),
              /* @__PURE__ */ jsx11(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setShowSettings(!showSettings);
                    setSettingsPage("main");
                  },
                  title: "Settings",
                  className: cn(iconBtnClass2, showSettings && "bg-white/10"),
                  children: /* @__PURE__ */ jsx11(Settings2, { className: cn(iconClass2, "transition-transform duration-300", showSettings && "rotate-45") })
                }
              ),
              /* @__PURE__ */ jsx11(
                "button",
                {
                  type: "button",
                  onClick: () => controls.toggleFullscreen(),
                  title: state.isFullscreen ? "Exit Fullscreen" : "Fullscreen",
                  className: iconBtnClass2,
                  children: state.isFullscreen ? /* @__PURE__ */ jsx11(Minimize2, { className: iconClass2 }) : /* @__PURE__ */ jsx11(Maximize2, { className: iconClass2 })
                }
              )
            ] })
          ] })
        ] }),
        showSettings && /* @__PURE__ */ jsx11(
          "div",
          {
            className: "absolute bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-200",
            onClick: (e) => e.stopPropagation(),
            children: /* @__PURE__ */ jsxs9(
              "div",
              {
                className: "bg-neutral-900/95 backdrop-blur-lg rounded-t-2xl overflow-hidden",
                style: { paddingBottom: "max(1rem, env(safe-area-inset-bottom))" },
                children: [
                  /* @__PURE__ */ jsxs9("div", { className: "flex items-center justify-between px-4 py-3 border-b border-white/10", children: [
                    /* @__PURE__ */ jsxs9("h3", { className: "text-sm font-medium text-white", children: [
                      settingsPage === "main" && "Settings",
                      settingsPage === "quality" && "Quality",
                      settingsPage === "speed" && "Playback Speed"
                    ] }),
                    /* @__PURE__ */ jsx11(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          settingsPage === "main" ? setShowSettings(false) : setSettingsPage("main");
                        },
                        className: "flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 text-white/70",
                        children: settingsPage === "main" ? /* @__PURE__ */ jsx11(X, { className: "w-5 h-5" }) : /* @__PURE__ */ jsx11(ChevronRight2, { className: "w-5 h-5 rotate-180" })
                      }
                    )
                  ] }),
                  settingsPage === "main" && /* @__PURE__ */ jsxs9("div", { className: "py-1", children: [
                    qualityLevels.length > 0 && /* @__PURE__ */ jsxs9(
                      "button",
                      {
                        type: "button",
                        className: "flex items-center justify-between w-full px-4 py-3 hover:bg-white/5 active:bg-white/10 transition-colors touch-manipulation",
                        onClick: () => setSettingsPage("quality"),
                        children: [
                          /* @__PURE__ */ jsxs9("div", { className: "flex items-center gap-3", children: [
                            /* @__PURE__ */ jsx11(Settings2, { className: "w-5 h-5 text-white/70" }),
                            /* @__PURE__ */ jsx11("span", { className: "text-sm text-white", children: "Quality" })
                          ] }),
                          /* @__PURE__ */ jsxs9("div", { className: "flex items-center gap-1", children: [
                            /* @__PURE__ */ jsx11("span", { className: "text-sm text-white/50", children: state.quality === "auto" ? "Auto" : state.quality }),
                            /* @__PURE__ */ jsx11(ChevronRight2, { className: "w-4 h-4 text-white/40" })
                          ] })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxs9(
                      "button",
                      {
                        type: "button",
                        className: "flex items-center justify-between w-full px-4 py-3 hover:bg-white/5 active:bg-white/10 transition-colors touch-manipulation",
                        onClick: () => setSettingsPage("speed"),
                        children: [
                          /* @__PURE__ */ jsxs9("div", { className: "flex items-center gap-3", children: [
                            /* @__PURE__ */ jsx11(Gauge2, { className: "w-5 h-5 text-white/70" }),
                            /* @__PURE__ */ jsx11("span", { className: "text-sm text-white", children: "Playback speed" })
                          ] }),
                          /* @__PURE__ */ jsxs9("div", { className: "flex items-center gap-1", children: [
                            /* @__PURE__ */ jsx11("span", { className: "text-sm text-white/50", children: state.playbackRate === 1 ? "Normal" : `${state.playbackRate}x` }),
                            /* @__PURE__ */ jsx11(ChevronRight2, { className: "w-4 h-4 text-white/40" })
                          ] })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsx11("div", { className: "px-4 py-3", children: /* @__PURE__ */ jsxs9("div", { className: "flex items-center gap-3", children: [
                      /* @__PURE__ */ jsx11("button", { type: "button", onClick: controls.toggleMute, className: "flex-shrink-0", children: /* @__PURE__ */ jsx11(VolumeIcon, { className: "w-5 h-5 text-white/70" }) }),
                      /* @__PURE__ */ jsx11(
                        Slider,
                        {
                          min: 0,
                          max: 100,
                          step: 1,
                          value: [Math.round((state.isMuted ? 0 : state.volume) * 100)],
                          onValueChange: (v) => {
                            if (Number.isFinite(v[0])) controls.setVolume(v[0] / 100);
                          },
                          className: "flex-1 [&_[data-slot=slider-track]]:bg-white/20 [&_[data-slot=slider-track]]:h-1 [&_[data-slot=slider-range]]:bg-white [&_[data-slot=slider-thumb]]:bg-white [&_[data-slot=slider-thumb]]:border-white [&_[data-slot=slider-thumb]]:size-4"
                        }
                      ),
                      /* @__PURE__ */ jsxs9("span", { className: "text-xs text-white/50 tabular-nums w-8 text-right", children: [
                        Math.round((state.isMuted ? 0 : state.volume) * 100),
                        "%"
                      ] })
                    ] }) }),
                    typeof document !== "undefined" && "pictureInPictureEnabled" in document && /* @__PURE__ */ jsxs9(
                      "button",
                      {
                        type: "button",
                        className: "flex items-center w-full px-4 py-3 hover:bg-white/5 active:bg-white/10 transition-colors touch-manipulation",
                        onClick: () => {
                          controls.togglePictureInPicture();
                          setShowSettings(false);
                        },
                        children: [
                          /* @__PURE__ */ jsx11(PictureInPicture3, { className: "w-5 h-5 text-white/70 mr-3" }),
                          /* @__PURE__ */ jsx11("span", { className: "text-sm text-white", children: "Picture-in-Picture" })
                        ]
                      }
                    )
                  ] }),
                  settingsPage === "quality" && /* @__PURE__ */ jsx11("div", { className: "py-1 max-h-64 overflow-y-auto animate-in slide-in-from-right-4 duration-200", children: qualityLevels.map((level) => /* @__PURE__ */ jsxs9(
                    "button",
                    {
                      type: "button",
                      className: "flex items-center w-full px-4 py-3 hover:bg-white/5 active:bg-white/10 transition-colors touch-manipulation",
                      onClick: () => {
                        controls.setQuality(level.id);
                        setSettingsPage("main");
                      },
                      children: [
                        /* @__PURE__ */ jsx11("span", { className: "w-6 flex-shrink-0", children: state.quality === level.label && /* @__PURE__ */ jsx11(Check2, { className: "w-4 h-4 text-white" }) }),
                        /* @__PURE__ */ jsx11("span", { className: cn("text-sm", state.quality === level.label ? "text-white font-medium" : "text-white/80"), children: level.label })
                      ]
                    },
                    level.id
                  )) }),
                  settingsPage === "speed" && /* @__PURE__ */ jsx11("div", { className: "py-1 animate-in slide-in-from-right-4 duration-200", children: playbackRateOptions2.map((opt) => /* @__PURE__ */ jsxs9(
                    "button",
                    {
                      type: "button",
                      className: "flex items-center w-full px-4 py-3 hover:bg-white/5 active:bg-white/10 transition-colors touch-manipulation",
                      onClick: () => {
                        controls.setPlaybackRate(opt.value);
                        setSettingsPage("main");
                      },
                      children: [
                        /* @__PURE__ */ jsx11("span", { className: "w-6 flex-shrink-0", children: state.playbackRate === opt.value && /* @__PURE__ */ jsx11(Check2, { className: "w-4 h-4 text-white" }) }),
                        /* @__PURE__ */ jsx11("span", { className: cn("text-sm", state.playbackRate === opt.value ? "text-white font-medium" : "text-white/80"), children: opt.label })
                      ]
                    },
                    opt.value
                  )) })
                ]
              }
            )
          }
        )
      ]
    }
  );
};

// src/components/demo/video-player-demo.tsx
import { useState as useState8 } from "react";

// src/components/demo/video-source-selector.tsx
import { useState as useState7, useEffect as useEffect9 } from "react";

// src/components/ui/card.tsx
import * as React7 from "react";
import { jsx as jsx12 } from "react/jsx-runtime";
var Card = React7.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx12(
    "div",
    __spreadValues({
      ref,
      className: cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )
    }, props)
  );
});
Card.displayName = "Card";
var CardHeader = React7.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx12(
    "div",
    __spreadValues({
      ref,
      className: cn("flex flex-col space-y-1.5 p-6", className)
    }, props)
  );
});
CardHeader.displayName = "CardHeader";
var CardTitle = React7.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx12(
    "h3",
    __spreadValues({
      ref,
      className: cn(
        "text-2xl font-semibold leading-none tracking-tight",
        className
      )
    }, props)
  );
});
CardTitle.displayName = "CardTitle";
var CardDescription = React7.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx12(
    "p",
    __spreadValues({
      ref,
      className: cn("text-sm text-muted-foreground", className)
    }, props)
  );
});
CardDescription.displayName = "CardDescription";
var CardContent = React7.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx12("div", __spreadValues({ ref, className: cn("p-6 pt-0", className) }, props));
});
CardContent.displayName = "CardContent";
var CardFooter = React7.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx12(
    "div",
    __spreadValues({
      ref,
      className: cn("flex items-center p-6 pt-0", className)
    }, props)
  );
});
CardFooter.displayName = "CardFooter";

// src/components/ui/badge.tsx
import { cva } from "class-variance-authority";
import { jsx as jsx13 } from "react/jsx-runtime";
var badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge(_a) {
  var _b = _a, { className, variant } = _b, props = __objRest(_b, ["className", "variant"]);
  return /* @__PURE__ */ jsx13("div", __spreadValues({ className: cn(badgeVariants({ variant }), className) }, props));
}

// src/components/ui/button.tsx
import * as React8 from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva as cva2 } from "class-variance-authority";
import { jsx as jsx14 } from "react/jsx-runtime";
var buttonVariants = cva2(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
var Button = React8.forwardRef((_a, ref) => {
  var _b = _a, { className, variant, size, asChild = false } = _b, props = __objRest(_b, ["className", "variant", "size", "asChild"]);
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx14(
    Comp,
    __spreadValues({
      ref,
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className }))
    }, props)
  );
});
Button.displayName = "Button";

// src/components/demo/video-source-selector.tsx
import { FileVideo, Play as Play3, Download, Info, AlertTriangle } from "lucide-react";
import { jsx as jsx15, jsxs as jsxs10 } from "react/jsx-runtime";
var isVideoFormatSupportedSimple = (url) => {
  var _a;
  if (typeof window === "undefined") {
    return true;
  }
  const extension = (_a = url.split(".").pop()) == null ? void 0 : _a.toLowerCase().split("?")[0];
  const supportedFormats = ["mp4", "webm", "ogg", "m3u8", "mpd"];
  return supportedFormats.includes(extension || "");
};
var videoSources = [
  {
    id: "html5-test",
    name: "HTML5 Test Video",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    format: "MP4",
    quality: "320p",
    size: "1.1MB",
    description: "W3Schools HTML5 test video - guaranteed to work",
    features: ["Reliable", "Small Size", "Educational"]
  },
  {
    id: "sintel-480p",
    name: "MP4 - Sintel (480p)",
    url: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
    format: "MP4",
    quality: "480p",
    size: "2.8MB",
    description: "SampleLib short MP4 sample",
    features: ["Reliable", "HTTPS", "Quick Load"]
  },
  {
    id: "tears-steel-480p",
    name: "MP4 - Tears of Steel (480p)",
    url: "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
    format: "MP4",
    quality: "480p",
    size: "5.3MB",
    description: "SampleLib medium-length MP4 sample",
    features: ["Reliable", "HTTPS", "MP4"]
  },
  {
    id: "elephant-dream",
    name: "MP4 - Elephant's Dream",
    url: "https://samplelib.com/lib/preview/mp4/sample-15s.mp4",
    format: "MP4",
    quality: "720p",
    size: "11.3MB",
    description: "SampleLib long MP4 sample",
    features: ["Reliable", "HTTPS", "Longer Clip"]
  },
  {
    id: "mp4-big-buck-bunny",
    name: "MP4 - Big Buck Bunny",
    url: "https://samplelib.com/lib/preview/mp4/sample-20s.mp4",
    format: "MP4",
    quality: "720p",
    size: "11.2MB",
    description: "Longer MP4 test clip for compatibility validation",
    features: ["Reliable", "HTTPS", "Single Quality"]
  },
  {
    id: "hls-apple-basic",
    name: "HLS - Apple Basic Stream",
    url: "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8",
    format: "HLS (.m3u8)",
    quality: "Adaptive",
    size: "~30s",
    description: "Apple's official HLS test stream",
    features: ["Apple Official", "Multiple Qualities", "Reliable"]
  }
];
var VideoSourceSelector = ({
  videoSources: propVideoSources,
  selectedVideo,
  onVideoSelect,
  onSourceSelect,
  currentSource,
  className = ""
}) => {
  const [isLoading, setIsLoading] = useState7(null);
  const [mounted, setMounted] = useState7(false);
  const [erroredSources, setErroredSources] = useState7(/* @__PURE__ */ new Set());
  const sources = propVideoSources || videoSources;
  useEffect9(() => {
    setMounted(true);
  }, []);
  const handleSourceSelect = async (source) => {
    if (isLoading) {
      return;
    }
    getPlayerLogger().info("Selecting video source:", source.name, source.url);
    setIsLoading(source.id);
    if (erroredSources.has(source.id)) {
      const newErroredSources = new Set(erroredSources);
      newErroredSources.delete(source.id);
      setErroredSources(newErroredSources);
    }
    try {
      if (onVideoSelect) {
        onVideoSelect(source);
      } else if (onSourceSelect) {
        await onSourceSelect(source);
      }
    } catch (error) {
      getPlayerLogger().error("Error selecting source:", error);
      setErroredSources((prev) => /* @__PURE__ */ new Set([...prev, source.id]));
    } finally {
      setTimeout(() => setIsLoading(null), 1e3);
    }
  };
  const getFormatColor = (format) => {
    switch (format.toLowerCase()) {
      case "hls (.m3u8)":
        return "bg-blue-500 text-white";
      case "dash (.mpd)":
        return "bg-green-500 text-white";
      case "mp4":
        return "bg-purple-500 text-white";
      case "webm":
        return "bg-orange-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };
  const getQualityColor = (quality) => {
    switch (quality.toLowerCase()) {
      case "adaptive":
        return "bg-emerald-500 text-white";
      case "1080p":
        return "bg-blue-500 text-white";
      case "720p":
        return "bg-cyan-500 text-white";
      case "480p":
        return "bg-yellow-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };
  if (!mounted) {
    return /* @__PURE__ */ jsx15("div", { className, children: /* @__PURE__ */ jsxs10(Card, { children: [
      /* @__PURE__ */ jsxs10(CardHeader, { children: [
        /* @__PURE__ */ jsxs10(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx15(FileVideo, { className: "h-5 w-5" }),
          "Video Format Showcase"
        ] }),
        /* @__PURE__ */ jsx15("p", { className: "text-sm text-muted-foreground", children: "Loading video formats..." })
      ] }),
      /* @__PURE__ */ jsx15(CardContent, { children: /* @__PURE__ */ jsx15("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: [1, 2, 3, 4, 5, 6].map((i) => /* @__PURE__ */ jsxs10("div", { className: "border rounded-lg p-4 animate-pulse", children: [
        /* @__PURE__ */ jsx15("div", { className: "h-4 bg-gray-200 rounded mb-2" }),
        /* @__PURE__ */ jsx15("div", { className: "h-3 bg-gray-200 rounded mb-2" }),
        /* @__PURE__ */ jsx15("div", { className: "h-3 bg-gray-200 rounded" })
      ] }, i)) }) })
    ] }) });
  }
  return /* @__PURE__ */ jsx15("div", { className, children: /* @__PURE__ */ jsxs10(Card, { children: [
    /* @__PURE__ */ jsxs10(CardHeader, { children: [
      /* @__PURE__ */ jsxs10(CardTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx15(FileVideo, { className: "h-5 w-5" }),
        "Video Format Showcase"
      ] }),
      /* @__PURE__ */ jsx15("p", { className: "text-sm text-muted-foreground", children: "Test different video formats and streaming protocols to explore all features" })
    ] }),
    /* @__PURE__ */ jsx15(CardContent, { children: /* @__PURE__ */ jsx15("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: sources.map((source) => {
      const isSupported = isVideoFormatSupportedSimple(source.url);
      const hasError = erroredSources.has(source.id);
      const isSelected = (selectedVideo == null ? void 0 : selectedVideo.id) === source.id || currentSource === source.url;
      return /* @__PURE__ */ jsx15(
        "div",
        {
          className: `border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${isSelected ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : hasError ? "border-red-300 bg-red-50 dark:bg-red-950/30" : isSupported ? "border-gray-200 hover:border-gray-300" : "border-red-200 bg-red-50 dark:bg-red-950 opacity-75"} ${isLoading === source.id ? "opacity-50 pointer-events-none" : ""}`,
          onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            if ((isSupported || hasError) && !isLoading) {
              handleSourceSelect(source);
            }
          },
          children: /* @__PURE__ */ jsxs10("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs10("div", { className: "flex items-start justify-between", children: [
              /* @__PURE__ */ jsx15("h3", { className: "font-medium text-sm leading-tight", children: source.name }),
              /* @__PURE__ */ jsxs10("div", { className: "flex items-center gap-1", children: [
                currentSource === source.url && /* @__PURE__ */ jsx15(Play3, { className: "h-4 w-4 text-blue-500 flex-shrink-0" }),
                hasError && /* @__PURE__ */ jsx15(AlertTriangle, { className: "h-4 w-4 text-red-500 flex-shrink-0" }),
                !isSupported && !hasError && /* @__PURE__ */ jsx15(AlertTriangle, { className: "h-4 w-4 text-red-500 flex-shrink-0" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs10("div", { className: "flex gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsx15(Badge, { className: `text-xs ${getFormatColor(source.format)}`, children: source.format }),
              /* @__PURE__ */ jsx15(Badge, { className: `text-xs ${getQualityColor(source.quality)}`, children: source.quality }),
              source.fallbackUrls && source.fallbackUrls.length > 0 && /* @__PURE__ */ jsx15(Badge, { variant: "outline", className: "text-xs", children: "Failover" }),
              source.aspectRatio && /* @__PURE__ */ jsx15(Badge, { variant: "outline", className: "text-xs", children: source.aspectRatio === "16/9" ? "\u{1F4FA} Landscape" : source.aspectRatio === "9/16" ? "\u{1F4F1} Vertical" : source.aspectRatio === "1/1" ? "\u2B1C Square" : source.aspectRatio })
            ] }),
            /* @__PURE__ */ jsx15("p", { className: "text-xs text-muted-foreground line-clamp-2", children: hasError ? "\u26A0\uFE0F This video failed to load. Click 'Retry' to try again." : source.description }),
            /* @__PURE__ */ jsxs10("div", { className: "flex items-center gap-4 text-xs text-muted-foreground", children: [
              source.size && /* @__PURE__ */ jsxs10("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx15(Download, { className: "h-3 w-3" }),
                source.size
              ] }),
              /* @__PURE__ */ jsxs10("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx15(Info, { className: "h-3 w-3" }),
                source.features.length,
                " features"
              ] })
            ] }),
            /* @__PURE__ */ jsxs10("div", { className: "space-y-1", children: [
              source.features.slice(0, 2).map((feature, index) => /* @__PURE__ */ jsxs10("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx15("div", { className: "w-1.5 h-1.5 bg-green-500 rounded-full" }),
                /* @__PURE__ */ jsx15("span", { className: "text-xs text-muted-foreground", children: feature })
              ] }, index)),
              source.features.length > 2 && /* @__PURE__ */ jsxs10("div", { className: "text-xs text-muted-foreground", children: [
                "+",
                source.features.length - 2,
                " more features"
              ] })
            ] }),
            /* @__PURE__ */ jsx15(
              Button,
              {
                size: "sm",
                className: "w-full mt-2",
                variant: currentSource === source.url ? "default" : hasError ? "destructive" : "outline",
                disabled: !isSupported && !hasError || isLoading === source.id,
                onClick: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if ((isSupported || hasError) && !isLoading) {
                    handleSourceSelect(source);
                  }
                },
                children: isLoading === source.id ? "Loading..." : hasError ? "Retry" : !isSupported ? "Not Supported" : currentSource === source.url ? "Playing" : "Load Video"
              }
            )
          ] })
        },
        source.id
      );
    }) }) })
  ] }) });
};

// src/components/demo/player-stats.tsx
import { jsx as jsx16, jsxs as jsxs11 } from "react/jsx-runtime";
var PlayerStats = ({ state }) => {
  return /* @__PURE__ */ jsxs11("div", { className: "bg-gray-100 dark:bg-gray-800 rounded-lg p-4 space-y-2", children: [
    /* @__PURE__ */ jsx16("h3", { className: "font-semibold text-gray-900 dark:text-white", children: "Player Statistics" }),
    /* @__PURE__ */ jsxs11("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [
      /* @__PURE__ */ jsxs11("div", { children: [
        /* @__PURE__ */ jsx16("span", { className: "text-gray-600 dark:text-gray-400", children: "Current Time:" }),
        /* @__PURE__ */ jsxs11("span", { className: "ml-2 font-mono", children: [
          state.currentTime.toFixed(2),
          "s"
        ] })
      ] }),
      /* @__PURE__ */ jsxs11("div", { children: [
        /* @__PURE__ */ jsx16("span", { className: "text-gray-600 dark:text-gray-400", children: "Duration:" }),
        /* @__PURE__ */ jsxs11("span", { className: "ml-2 font-mono", children: [
          state.duration.toFixed(2),
          "s"
        ] })
      ] }),
      /* @__PURE__ */ jsxs11("div", { children: [
        /* @__PURE__ */ jsx16("span", { className: "text-gray-600 dark:text-gray-400", children: "Volume:" }),
        /* @__PURE__ */ jsxs11("span", { className: "ml-2 font-mono", children: [
          Math.round(state.volume * 100),
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsxs11("div", { children: [
        /* @__PURE__ */ jsx16("span", { className: "text-gray-600 dark:text-gray-400", children: "Quality:" }),
        /* @__PURE__ */ jsx16("span", { className: "ml-2 font-mono", children: state.quality })
      ] }),
      /* @__PURE__ */ jsxs11("div", { children: [
        /* @__PURE__ */ jsx16("span", { className: "text-gray-600 dark:text-gray-400", children: "Buffered:" }),
        /* @__PURE__ */ jsxs11("span", { className: "ml-2 font-mono", children: [
          Math.round(state.buffered * 100),
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsxs11("div", { children: [
        /* @__PURE__ */ jsx16("span", { className: "text-gray-600 dark:text-gray-400", children: "Playback Rate:" }),
        /* @__PURE__ */ jsxs11("span", { className: "ml-2 font-mono", children: [
          state.playbackRate,
          "x"
        ] })
      ] })
    ] })
  ] });
};

// src/components/demo/feature-list.tsx
import { Check as Check3 } from "lucide-react";
import { jsx as jsx17, jsxs as jsxs12 } from "react/jsx-runtime";
var features = [
  { name: "HLS Streaming", description: "HTTP Live Streaming support", enabled: true },
  { name: "DASH Streaming", description: "Dynamic Adaptive Streaming", enabled: true },
  { name: "Mobile Gestures", description: "Touch-optimized controls", enabled: true },
  { name: "Thumbnail Preview", description: "Timeline hover previews", enabled: true },
  { name: "Quality Selection", description: "Manual quality control", enabled: true },
  { name: "Fullscreen", description: "Full viewport playback", enabled: true },
  { name: "Picture-in-Picture", description: "PiP mode support", enabled: true },
  { name: "Keyboard Shortcuts", description: "Hotkey navigation", enabled: true },
  { name: "Analytics", description: "Playback tracking", enabled: true },
  { name: "Auto-hide Controls", description: "Clean viewing experience", enabled: true }
];
var FeatureList = () => {
  return /* @__PURE__ */ jsxs12("div", { className: "bg-gray-100 dark:bg-gray-800 rounded-lg p-4", children: [
    /* @__PURE__ */ jsx17("h3", { className: "font-semibold text-gray-900 dark:text-white mb-4", children: "Features" }),
    /* @__PURE__ */ jsx17("div", { className: "grid gap-2", children: features.map((feature, index) => /* @__PURE__ */ jsxs12("div", { className: "flex items-center space-x-3", children: [
      /* @__PURE__ */ jsx17("div", { className: `w-4 h-4 rounded-full flex items-center justify-center ${feature.enabled ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`, children: feature.enabled && /* @__PURE__ */ jsx17(Check3, { className: "w-3 h-3" }) }),
      /* @__PURE__ */ jsxs12("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx17("div", { className: "text-sm font-medium text-gray-900 dark:text-white", children: feature.name }),
        /* @__PURE__ */ jsx17("div", { className: "text-xs text-gray-600 dark:text-gray-400", children: feature.description })
      ] })
    ] }, index)) })
  ] });
};

// src/components/demo/video-player-demo.tsx
import { jsx as jsx18, jsxs as jsxs13 } from "react/jsx-runtime";
var VideoPlayerDemo = () => {
  const videoSources2 = [
    {
      id: "bigbuck",
      name: "Big Buck Bunny (MP4)",
      url: "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
      format: "MP4",
      quality: "HD",
      size: "5.3MB",
      description: "High quality demo video",
      features: ["MP4", "HD Quality"],
      poster: "/api/placeholder/1280/720"
    },
    {
      id: "elephant",
      name: "Elephant Dream (MP4)",
      url: "https://samplelib.com/lib/preview/mp4/sample-15s.mp4",
      format: "MP4",
      quality: "HD",
      size: "11.3MB",
      description: "Animation showcase",
      features: ["MP4", "Animation"],
      poster: "/api/placeholder/1280/720"
    },
    {
      id: "sintel",
      name: "Sintel (MP4)",
      url: "https://samplelib.com/lib/preview/mp4/sample-20s.mp4",
      format: "MP4",
      quality: "HD",
      size: "11.2MB",
      description: "Blender Foundation movie",
      features: ["MP4", "Short Film"],
      poster: "/api/placeholder/1280/720"
    }
  ];
  const [selectedVideo, setSelectedVideo] = useState8(videoSources2[0]);
  const [isPlayerReady, setIsPlayerReady] = useState8(false);
  const [playerState, setPlayerState] = useState8({
    isPlaying: false,
    isPaused: true,
    isLoading: false,
    isMuted: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    buffered: 0,
    quality: "auto",
    playbackRate: 1,
    isFullscreen: false,
    isPictureInPicture: false,
    isTheaterMode: false,
    error: null,
    // Analytics data
    playCount: 0,
    totalWatchTime: 0,
    bufferingTime: 0,
    averageBitrate: 0,
    qualityChanges: 0
  });
  return /* @__PURE__ */ jsx18(PlayerConfigProvider, { children: /* @__PURE__ */ jsxs13("div", { className: "grid lg:grid-cols-3 gap-8", children: [
    /* @__PURE__ */ jsxs13("div", { className: "lg:col-span-2", children: [
      /* @__PURE__ */ jsx18(
        VideoSourceSelector,
        {
          sources: videoSources2,
          selectedSource: selectedVideo,
          onSourceChange: setSelectedVideo,
          className: "mb-6"
        }
      ),
      /* @__PURE__ */ jsx18(
        ConfigurableVideoPlayer,
        {
          src: selectedVideo.url,
          poster: selectedVideo.poster,
          autoPlay: false,
          muted: false,
          onReady: () => setIsPlayerReady(true),
          onStateChange: setPlayerState,
          className: "w-full shadow-2xl"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs13("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsx18(PlayerStats, { state: playerState }),
      /* @__PURE__ */ jsx18(FeatureList, {})
    ] })
  ] }) });
};

// src/components/config/player-config-panel.tsx
import { useState as useState9 } from "react";

// src/components/ui/switch.tsx
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { jsx as jsx19 } from "react/jsx-runtime";
function Switch(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx19(
    SwitchPrimitive.Root,
    __spreadProps(__spreadValues({
      "data-slot": "switch",
      className: cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )
    }, props), {
      children: /* @__PURE__ */ jsx19(
        SwitchPrimitive.Thumb,
        {
          "data-slot": "switch-thumb",
          className: cn(
            "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
          )
        }
      )
    })
  );
}

// src/components/ui/select.tsx
import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { jsx as jsx20, jsxs as jsxs14 } from "react/jsx-runtime";
function Select(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx20(SelectPrimitive.Root, __spreadValues({ "data-slot": "select" }, props));
}
function SelectValue(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx20(SelectPrimitive.Value, __spreadValues({ "data-slot": "select-value" }, props));
}
function SelectTrigger(_a) {
  var _b = _a, {
    className,
    size = "default",
    children
  } = _b, props = __objRest(_b, [
    "className",
    "size",
    "children"
  ]);
  return /* @__PURE__ */ jsxs14(
    SelectPrimitive.Trigger,
    __spreadProps(__spreadValues({
      "data-slot": "select-trigger",
      "data-size": size,
      className: cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )
    }, props), {
      children: [
        children,
        /* @__PURE__ */ jsx20(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx20(ChevronDownIcon, { className: "size-4 opacity-50" }) })
      ]
    })
  );
}
function SelectContent(_a) {
  var _b = _a, {
    className,
    children,
    position = "popper"
  } = _b, props = __objRest(_b, [
    "className",
    "children",
    "position"
  ]);
  return /* @__PURE__ */ jsx20(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs14(
    SelectPrimitive.Content,
    __spreadProps(__spreadValues({
      "data-slot": "select-content",
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
        position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      ),
      position
    }, props), {
      children: [
        /* @__PURE__ */ jsx20(SelectScrollUpButton, {}),
        /* @__PURE__ */ jsx20(
          SelectPrimitive.Viewport,
          {
            className: cn(
              "p-1",
              position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
            ),
            children
          }
        ),
        /* @__PURE__ */ jsx20(SelectScrollDownButton, {})
      ]
    })
  ) });
}
function SelectItem(_a) {
  var _b = _a, {
    className,
    children
  } = _b, props = __objRest(_b, [
    "className",
    "children"
  ]);
  return /* @__PURE__ */ jsxs14(
    SelectPrimitive.Item,
    __spreadProps(__spreadValues({
      "data-slot": "select-item",
      className: cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )
    }, props), {
      children: [
        /* @__PURE__ */ jsx20("span", { className: "absolute right-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ jsx20(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx20(CheckIcon, { className: "size-4" }) }) }),
        /* @__PURE__ */ jsx20(SelectPrimitive.ItemText, { children })
      ]
    })
  );
}
function SelectScrollUpButton(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx20(
    SelectPrimitive.ScrollUpButton,
    __spreadProps(__spreadValues({
      "data-slot": "select-scroll-up-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )
    }, props), {
      children: /* @__PURE__ */ jsx20(ChevronUpIcon, { className: "size-4" })
    })
  );
}
function SelectScrollDownButton(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx20(
    SelectPrimitive.ScrollDownButton,
    __spreadProps(__spreadValues({
      "data-slot": "select-scroll-down-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )
    }, props), {
      children: /* @__PURE__ */ jsx20(ChevronDownIcon, { className: "size-4" })
    })
  );
}

// src/components/ui/tabs.tsx
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { jsx as jsx21 } from "react/jsx-runtime";
function Tabs(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx21(
    TabsPrimitive.Root,
    __spreadValues({
      "data-slot": "tabs",
      className: cn("flex flex-col gap-2", className)
    }, props)
  );
}
function TabsList(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx21(
    TabsPrimitive.List,
    __spreadValues({
      "data-slot": "tabs-list",
      className: cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      )
    }, props)
  );
}
function TabsTrigger(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx21(
    TabsPrimitive.Trigger,
    __spreadValues({
      "data-slot": "tabs-trigger",
      className: cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )
    }, props)
  );
}
function TabsContent(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx21(
    TabsPrimitive.Content,
    __spreadValues({
      "data-slot": "tabs-content",
      className: cn("flex-1 outline-none", className)
    }, props)
  );
}

// src/components/ui/input.tsx
import { jsx as jsx22 } from "react/jsx-runtime";
function Input(_a) {
  var _b = _a, { className, type } = _b, props = __objRest(_b, ["className", "type"]);
  return /* @__PURE__ */ jsx22(
    "input",
    __spreadValues({
      type,
      "data-slot": "input",
      className: cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )
    }, props)
  );
}

// src/components/ui/label.tsx
import * as LabelPrimitive from "@radix-ui/react-label";
import { jsx as jsx23 } from "react/jsx-runtime";
function Label2(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx23(
    LabelPrimitive.Root,
    __spreadValues({
      "data-slot": "label",
      className: cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )
    }, props)
  );
}

// src/components/ui/separator.tsx
import * as React11 from "react";
import { jsx as jsx24 } from "react/jsx-runtime";
var Separator2 = React11.forwardRef(
  (_a, ref) => {
    var _b = _a, { className, orientation = "horizontal" } = _b, props = __objRest(_b, ["className", "orientation"]);
    return /* @__PURE__ */ jsx24(
      "div",
      __spreadValues({
        ref,
        className: cn(
          "shrink-0 bg-border",
          orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
          className
        )
      }, props)
    );
  }
);
Separator2.displayName = "Separator";

// src/components/config/player-config-panel.tsx
import { Settings as Settings3, Keyboard as Keyboard2, Smartphone as Smartphone2, Zap, Save, RotateCcw } from "lucide-react";
import { jsx as jsx25, jsxs as jsxs15 } from "react/jsx-runtime";
var PlayerConfigPanel = () => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t;
  const { config, updateConfig, resetConfig, saveConfig, loadSavedConfig, getSavedConfigs } = usePlayerConfig();
  const [saveConfigName, setSaveConfigName] = useState9("");
  const savedConfigs = getSavedConfigs();
  const handleControlVisibilityChange = (control, enabled) => {
    var _a2;
    updateConfig({
      controls: __spreadProps(__spreadValues({}, config.controls), {
        visibility: __spreadProps(__spreadValues({}, (_a2 = config.controls) == null ? void 0 : _a2.visibility), {
          [control]: enabled
        })
      })
    });
  };
  const handleAutoChange = (property, value) => {
    updateConfig({
      auto: __spreadProps(__spreadValues({}, config.auto), {
        [property]: value
      })
    });
  };
  const handleGestureChange = (property, value) => {
    updateConfig({
      gestures: __spreadProps(__spreadValues({}, config.gestures), {
        [property]: value
      })
    });
  };
  const controlLabels = {
    playPause: "Play/Pause Button",
    progress: "Progress Bar",
    volume: "Volume Control",
    quality: "Quality Selector",
    fullscreen: "Fullscreen Toggle",
    pictureInPicture: "Picture-in-Picture",
    theaterMode: "Theater Mode",
    playbackRate: "Playback Speed",
    keyboardShortcuts: "Keyboard Shortcuts",
    settings: "Settings Menu",
    time: "Time Display"
  };
  return /* @__PURE__ */ jsxs15(Card, { className: "w-full max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsxs15(CardHeader, { children: [
      /* @__PURE__ */ jsxs15(CardTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx25(Settings3, { className: "h-5 w-5" }),
        "Video Player Configuration"
      ] }),
      /* @__PURE__ */ jsxs15("div", { className: "flex gap-2 flex-wrap", children: [
        savedConfigs.length > 0 && /* @__PURE__ */ jsxs15(Select, { onValueChange: loadSavedConfig, children: [
          /* @__PURE__ */ jsx25(SelectTrigger, { className: "w-48", children: /* @__PURE__ */ jsx25(SelectValue, { placeholder: "Load Saved Config" }) }),
          /* @__PURE__ */ jsx25(SelectContent, { children: savedConfigs.map((name) => /* @__PURE__ */ jsx25(SelectItem, { value: name, children: name }, name)) })
        ] }),
        /* @__PURE__ */ jsxs15(Button, { variant: "outline", onClick: resetConfig, children: [
          /* @__PURE__ */ jsx25(RotateCcw, { className: "h-4 w-4 mr-2" }),
          "Reset"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx25(CardContent, { children: /* @__PURE__ */ jsxs15(Tabs, { defaultValue: "controls", className: "w-full", children: [
      /* @__PURE__ */ jsxs15(TabsList, { className: "grid w-full grid-cols-4", children: [
        /* @__PURE__ */ jsx25(TabsTrigger, { value: "controls", children: "Controls" }),
        /* @__PURE__ */ jsx25(TabsTrigger, { value: "behavior", children: "Behavior" }),
        /* @__PURE__ */ jsx25(TabsTrigger, { value: "gestures", children: "Gestures" }),
        /* @__PURE__ */ jsx25(TabsTrigger, { value: "save", children: "Save" })
      ] }),
      /* @__PURE__ */ jsxs15(TabsContent, { value: "controls", className: "space-y-6", children: [
        /* @__PURE__ */ jsxs15("div", { children: [
          /* @__PURE__ */ jsx25("h3", { className: "text-lg font-medium mb-4", children: "Control Visibility" }),
          /* @__PURE__ */ jsx25("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4", children: Object.entries(controlLabels).map(([key, label]) => {
            var _a2, _b2, _c2;
            return /* @__PURE__ */ jsxs15("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsx25(
                Switch,
                {
                  id: key,
                  checked: (_c2 = (_b2 = (_a2 = config.controls) == null ? void 0 : _a2.visibility) == null ? void 0 : _b2[key]) != null ? _c2 : true,
                  onCheckedChange: (checked) => handleControlVisibilityChange(key, checked)
                }
              ),
              /* @__PURE__ */ jsx25(Label2, { htmlFor: key, className: "text-sm", children: label })
            ] }, key);
          }) })
        ] }),
        /* @__PURE__ */ jsx25(Separator2, {}),
        /* @__PURE__ */ jsxs15("div", { children: [
          /* @__PURE__ */ jsx25("h3", { className: "text-lg font-medium mb-4", children: "Control Layout" }),
          /* @__PURE__ */ jsx25("div", { className: "grid grid-cols-1 gap-4", children: /* @__PURE__ */ jsxs15("div", { children: [
            /* @__PURE__ */ jsx25(Label2, { htmlFor: "size", children: "Size" }),
            /* @__PURE__ */ jsxs15(
              Select,
              {
                value: ((_a = config.controls) == null ? void 0 : _a.size) || "medium",
                onValueChange: (value) => updateConfig({
                  controls: __spreadProps(__spreadValues({}, config.controls), { size: value })
                }),
                children: [
                  /* @__PURE__ */ jsx25(SelectTrigger, { children: /* @__PURE__ */ jsx25(SelectValue, {}) }),
                  /* @__PURE__ */ jsxs15(SelectContent, { children: [
                    /* @__PURE__ */ jsx25(SelectItem, { value: "small", children: "Small" }),
                    /* @__PURE__ */ jsx25(SelectItem, { value: "medium", children: "Medium" }),
                    /* @__PURE__ */ jsx25(SelectItem, { value: "large", children: "Large" })
                  ] })
                ]
              }
            )
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx25(TabsContent, { value: "behavior", className: "space-y-6", children: /* @__PURE__ */ jsxs15("div", { children: [
        /* @__PURE__ */ jsxs15("h3", { className: "text-lg font-medium mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx25(Zap, { className: "h-5 w-5" }),
          "Auto Behaviors"
        ] }),
        /* @__PURE__ */ jsxs15("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs15("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx25(
              Switch,
              {
                id: "autoPlay",
                checked: (_c = (_b = config.auto) == null ? void 0 : _b.autoPlay) != null ? _c : false,
                onCheckedChange: (checked) => handleAutoChange("autoPlay", checked)
              }
            ),
            /* @__PURE__ */ jsx25(Label2, { htmlFor: "autoPlay", children: "Auto Play" })
          ] }),
          /* @__PURE__ */ jsxs15("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx25(
              Switch,
              {
                id: "autoHideControls",
                checked: (_e = (_d = config.auto) == null ? void 0 : _d.autoHideControls) != null ? _e : true,
                onCheckedChange: (checked) => handleAutoChange("autoHideControls", checked)
              }
            ),
            /* @__PURE__ */ jsx25(Label2, { htmlFor: "autoHideControls", children: "Auto Hide Controls" })
          ] }),
          /* @__PURE__ */ jsxs15("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx25(
              Switch,
              {
                id: "rememberVolume",
                checked: (_g = (_f = config.auto) == null ? void 0 : _f.rememberVolume) != null ? _g : true,
                onCheckedChange: (checked) => handleAutoChange("rememberVolume", checked)
              }
            ),
            /* @__PURE__ */ jsx25(Label2, { htmlFor: "rememberVolume", children: "Remember Volume" })
          ] }),
          /* @__PURE__ */ jsxs15("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx25(
              Switch,
              {
                id: "rememberPlaybackRate",
                checked: (_i = (_h = config.auto) == null ? void 0 : _h.rememberPlaybackRate) != null ? _i : true,
                onCheckedChange: (checked) => handleAutoChange("rememberPlaybackRate", checked)
              }
            ),
            /* @__PURE__ */ jsx25(Label2, { htmlFor: "rememberPlaybackRate", children: "Remember Playback Rate" })
          ] }),
          /* @__PURE__ */ jsxs15("div", { children: [
            /* @__PURE__ */ jsx25(Label2, { htmlFor: "autoHideDelay", children: "Auto Hide Delay (ms)" }),
            /* @__PURE__ */ jsx25(
              Input,
              {
                id: "autoHideDelay",
                type: "number",
                value: ((_j = config.auto) == null ? void 0 : _j.autoHideDelay) || 3e3,
                onChange: (e) => {
                  const parsed = Number.parseInt(e.target.value, 10);
                  if (Number.isFinite(parsed)) {
                    handleAutoChange("autoHideDelay", parsed);
                  }
                },
                min: "1000",
                max: "10000",
                step: "500"
              }
            )
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs15(TabsContent, { value: "gestures", className: "space-y-6", children: [
        /* @__PURE__ */ jsxs15("div", { children: [
          /* @__PURE__ */ jsxs15("h3", { className: "text-lg font-medium mb-4 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx25(Smartphone2, { className: "h-5 w-5" }),
            "Touch Gestures"
          ] }),
          /* @__PURE__ */ jsxs15("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs15("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsx25(
                Switch,
                {
                  id: "gesturesEnabled",
                  checked: (_l = (_k = config.gestures) == null ? void 0 : _k.enabled) != null ? _l : true,
                  onCheckedChange: (checked) => handleGestureChange("enabled", checked)
                }
              ),
              /* @__PURE__ */ jsx25(Label2, { htmlFor: "gesturesEnabled", children: "Enable Gestures" })
            ] }),
            /* @__PURE__ */ jsxs15("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsx25(
                Switch,
                {
                  id: "tapToPlay",
                  checked: (_n = (_m = config.gestures) == null ? void 0 : _m.tapToPlay) != null ? _n : true,
                  onCheckedChange: (checked) => handleGestureChange("tapToPlay", checked)
                }
              ),
              /* @__PURE__ */ jsx25(Label2, { htmlFor: "tapToPlay", children: "Tap to Play/Pause" })
            ] }),
            /* @__PURE__ */ jsxs15("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsx25(
                Switch,
                {
                  id: "doubleTapSeek",
                  checked: (_p = (_o = config.gestures) == null ? void 0 : _o.doubleTapSeek) != null ? _p : true,
                  onCheckedChange: (checked) => handleGestureChange("doubleTapSeek", checked)
                }
              ),
              /* @__PURE__ */ jsx25(Label2, { htmlFor: "doubleTapSeek", children: "Double Tap to Seek" })
            ] }),
            /* @__PURE__ */ jsxs15("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsx25(
                Switch,
                {
                  id: "swipeVolume",
                  checked: (_r = (_q = config.gestures) == null ? void 0 : _q.swipeVolume) != null ? _r : false,
                  onCheckedChange: (checked) => handleGestureChange("swipeVolume", checked)
                }
              ),
              /* @__PURE__ */ jsx25(Label2, { htmlFor: "swipeVolume", children: "Swipe for Volume" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx25(Separator2, {}),
        /* @__PURE__ */ jsxs15("div", { children: [
          /* @__PURE__ */ jsxs15("h3", { className: "text-lg font-medium mb-4 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx25(Keyboard2, { className: "h-5 w-5" }),
            "Keyboard Shortcuts"
          ] }),
          /* @__PURE__ */ jsxs15("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx25(
              Switch,
              {
                id: "keyboardEnabled",
                checked: (_t = (_s = config.keyboard) == null ? void 0 : _s.enabled) != null ? _t : true,
                onCheckedChange: (checked) => updateConfig({
                  keyboard: __spreadProps(__spreadValues({}, config.keyboard), { enabled: checked })
                })
              }
            ),
            /* @__PURE__ */ jsx25(Label2, { htmlFor: "keyboardEnabled", children: "Enable Keyboard Shortcuts" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs15(TabsContent, { value: "save", className: "space-y-6", children: [
        /* @__PURE__ */ jsxs15("div", { children: [
          /* @__PURE__ */ jsxs15("h3", { className: "text-lg font-medium mb-4 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx25(Save, { className: "h-5 w-5" }),
            "Save Configuration"
          ] }),
          /* @__PURE__ */ jsxs15("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx25(
              Input,
              {
                placeholder: "Configuration name...",
                value: saveConfigName,
                onChange: (e) => setSaveConfigName(e.target.value)
              }
            ),
            /* @__PURE__ */ jsx25(
              Button,
              {
                onClick: () => {
                  if (saveConfigName.trim()) {
                    saveConfig(saveConfigName.trim());
                    setSaveConfigName("");
                  }
                },
                disabled: !saveConfigName.trim(),
                children: "Save"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx25(Separator2, {})
      ] })
    ] }) })
  ] });
};

// src/core/drm/license-request.ts
var createTokenLicenseRequestHandler = (options) => {
  const {
    getToken,
    refreshToken,
    headerName = "Authorization",
    fetch: fetchFn = fetch
  } = options;
  const buildHeaders = (contextHeaders, token) => {
    const tokenValue = headerName.toLowerCase() === "authorization" ? `Bearer ${token}` : token;
    return __spreadProps(__spreadValues({
      "Content-Type": "application/octet-stream"
    }, contextHeaders), {
      [headerName]: tokenValue
    });
  };
  const requestLicense = async (context, token) => {
    return fetchFn(context.licenseServerUrl, {
      method: "POST",
      headers: buildHeaders(context.headers, token),
      body: context.message,
      signal: context.signal
    });
  };
  return async (context) => {
    let token = await getToken();
    let response = await requestLicense(context, token);
    if (response.status === 401 && refreshToken) {
      token = await refreshToken();
      response = await requestLicense(context, token);
    }
    if (!response.ok) {
      throw new Error(`License request failed with status ${response.status}`);
    }
    return response.arrayBuffer();
  };
};

// src/plugins/analytics.ts
var AnalyticsPlugin = class {
  constructor(config) {
    this.name = "analytics";
    this.events = [];
    this.config = __spreadValues({
      sampleRate: 1,
      events: {
        play: true,
        pause: true,
        seek: true,
        complete: true,
        error: true,
        source: true
      }
    }, config);
    this.sessionId = this.generateSessionId();
  }
  onSourceLoadStart(payload) {
    var _a;
    this.lastSource = payload;
    if ((_a = this.config.events) == null ? void 0 : _a.source) {
      this.track("source_load_start", {
        src: payload.src,
        strategy: payload.strategy
      });
    }
  }
  onSourceLoaded(payload) {
    var _a;
    this.lastSource = payload;
    if ((_a = this.config.events) == null ? void 0 : _a.source) {
      this.track("source_loaded", {
        src: payload.src,
        strategy: payload.strategy
      });
    }
  }
  onPlay() {
    var _a;
    if ((_a = this.config.events) == null ? void 0 : _a.play) {
      this.track("play");
    }
  }
  onPause() {
    var _a;
    if ((_a = this.config.events) == null ? void 0 : _a.pause) {
      this.track("pause");
    }
  }
  onTimeUpdate(payload) {
    var _a, _b;
    if (this.lastTimeUpdate && ((_a = this.config.events) == null ? void 0 : _a.seek)) {
      const delta = Math.abs(payload.currentTime - this.lastTimeUpdate.currentTime);
      if (delta > 5) {
        this.track("seek", {
          currentTime: payload.currentTime,
          duration: payload.duration
        });
      }
    }
    if (((_b = this.config.events) == null ? void 0 : _b.complete) && payload.duration > 0 && payload.currentTime / payload.duration >= 0.98) {
      this.track("complete", {
        currentTime: payload.currentTime,
        duration: payload.duration
      });
    }
    this.lastTimeUpdate = payload;
  }
  onError(payload) {
    var _a;
    if ((_a = this.config.events) == null ? void 0 : _a.error) {
      this.track("error", {
        src: payload.src,
        strategy: payload.strategy,
        error: payload.error.message
      });
    }
  }
  getEvents() {
    return [...this.events];
  }
  clearEvents() {
    this.events.length = 0;
  }
  track(type, metadata) {
    var _a, _b, _c, _d, _e;
    if (!this.config.enabled) {
      return;
    }
    if (Math.random() > ((_a = this.config.sampleRate) != null ? _a : 1)) {
      return;
    }
    const event = {
      type,
      timestamp: Date.now(),
      source: (_b = this.lastSource) == null ? void 0 : _b.src,
      strategy: (_c = this.lastSource) == null ? void 0 : _c.strategy,
      currentTime: (_d = this.lastTimeUpdate) == null ? void 0 : _d.currentTime,
      duration: (_e = this.lastTimeUpdate) == null ? void 0 : _e.duration,
      metadata: __spreadValues({
        sessionId: this.sessionId
      }, metadata)
    };
    this.events.push(event);
    if (this.config.apiEndpoint) {
      this.sendEvent(event);
    }
  }
  async sendEvent(event) {
    try {
      await fetch(this.config.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(event)
      });
    } catch (error) {
      getPlayerLogger().warn("Failed to send analytics event:", error);
    }
  }
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  }
};
var createAnalyticsPlugin = (config) => {
  return new AnalyticsPlugin(config);
};

// src/index.ts
var VERSION = "1.0.6";
export {
  AdapterRegistry,
  AnalyticsPlugin,
  ConfigurableVideoPlayer,
  ErrorDisplay,
  LoadingSpinner,
  MobileVideoControls,
  PlayerConfigPanel,
  PlayerConfigProvider,
  PlayerPresets,
  VERSION,
  VideoControls,
  VideoEngine,
  VideoEnginePluginManager,
  VideoPlayer,
  VideoPlayerDemo,
  VideoSourceSelector,
  VideoThumbnail,
  cn,
  createAnalyticsPlugin,
  createConsoleLogger,
  createEmeController,
  createTokenLicenseRequestHandler,
  defaultStreamingAdapters,
  getBrowserCapabilities,
  getPlayerLogger,
  getStreamingStrategy,
  isEmeSupported,
  mergePlayerConfig,
  setPlayerLogger,
  usePlayerConfig,
  useVideoGestures,
  useVideoPlayer
};
//# sourceMappingURL=index.mjs.map