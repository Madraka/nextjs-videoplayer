"use client";
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
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
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AdapterRegistry: () => AdapterRegistry,
  AnalyticsPlugin: () => AnalyticsPlugin,
  ConfigurableVideoPlayer: () => ConfigurableVideoPlayer,
  ErrorDisplay: () => ErrorDisplay,
  LoadingSpinner: () => LoadingSpinner,
  MobileVideoControls: () => MobileVideoControls,
  PlayerConfigPanel: () => PlayerConfigPanel,
  PlayerConfigProvider: () => PlayerConfigProvider,
  PlayerPresets: () => PlayerPresets,
  VERSION: () => VERSION,
  VideoControls: () => VideoControls,
  VideoEngine: () => VideoEngine,
  VideoEnginePluginManager: () => VideoEnginePluginManager,
  VideoPlayer: () => VideoPlayer,
  VideoPlayerDemo: () => VideoPlayerDemo,
  VideoSourceSelector: () => VideoSourceSelector,
  VideoThumbnail: () => VideoThumbnail,
  cn: () => cn,
  createAnalyticsPlugin: () => createAnalyticsPlugin,
  createEmeController: () => createEmeController,
  createTokenLicenseRequestHandler: () => createTokenLicenseRequestHandler,
  defaultStreamingAdapters: () => defaultStreamingAdapters,
  getBrowserCapabilities: () => getBrowserCapabilities,
  getStreamingStrategy: () => getStreamingStrategy,
  isEmeSupported: () => isEmeSupported,
  mergePlayerConfig: () => mergePlayerConfig,
  usePlayerConfig: () => usePlayerConfig,
  usePlayerPresets: () => usePlayerPresets,
  useVideoGestures: () => useVideoGestures,
  useVideoPlayer: () => useVideoPlayer
});
module.exports = __toCommonJS(index_exports);

// src/components/player/configurable-video-player.tsx
var import_react7 = __toESM(require("react"));

// src/lib/utils.ts
var import_clsx = require("clsx");
var import_tailwind_merge = require("tailwind-merge");
function cn(...inputs) {
  return (0, import_tailwind_merge.twMerge)((0, import_clsx.clsx)(inputs));
}

// src/components/controls/video-controls.tsx
var import_react = require("react");
var import_lucide_react4 = require("lucide-react");

// src/components/ui/button.tsx
var import_react_slot = require("@radix-ui/react-slot");
var import_class_variance_authority = require("class-variance-authority");
var import_jsx_runtime = require("react/jsx-runtime");
var buttonVariants = (0, import_class_variance_authority.cva)(
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
function Button(_a) {
  var _b = _a, {
    className,
    variant,
    size,
    asChild = false
  } = _b, props = __objRest(_b, [
    "className",
    "variant",
    "size",
    "asChild"
  ]);
  const Comp = asChild ? import_react_slot.Slot : "button";
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    Comp,
    __spreadValues({
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className }))
    }, props)
  );
}

// src/components/ui/slider.tsx
var React = __toESM(require("react"));
var SliderPrimitive = __toESM(require("@radix-ui/react-slider"));
var import_jsx_runtime2 = require("react/jsx-runtime");
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
  const _values = React.useMemo(
    () => Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max],
    [value, defaultValue, min, max]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
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
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          SliderPrimitive.Track,
          {
            "data-slot": "slider-track",
            className: cn(
              "bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
            ),
            children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
        Array.from({ length: _values.length }, (_, index) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          SliderPrimitive.Thumb,
          {
            "data-slot": "slider-thumb",
            className: "border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
          },
          index
        ))
      ]
    })
  );
}

// src/components/ui/dropdown-menu.tsx
var DropdownMenuPrimitive = __toESM(require("@radix-ui/react-dropdown-menu"));
var import_lucide_react = require("lucide-react");
var import_jsx_runtime3 = require("react/jsx-runtime");
function DropdownMenu(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(DropdownMenuPrimitive.Root, __spreadValues({ "data-slot": "dropdown-menu" }, props));
}
function DropdownMenuTrigger(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    DropdownMenuPrimitive.Trigger,
    __spreadValues({
      "data-slot": "dropdown-menu-trigger"
    }, props)
  );
}
function DropdownMenuContent(_a) {
  var _b = _a, {
    className,
    sideOffset = 4
  } = _b, props = __objRest(_b, [
    "className",
    "sideOffset"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    DropdownMenuPrimitive.Content,
    __spreadValues({
      "data-slot": "dropdown-menu-content",
      sideOffset,
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
        className
      )
    }, props)
  ) });
}
function DropdownMenuItem(_a) {
  var _b = _a, {
    className,
    inset,
    variant = "default"
  } = _b, props = __objRest(_b, [
    "className",
    "inset",
    "variant"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    DropdownMenuPrimitive.Item,
    __spreadValues({
      "data-slot": "dropdown-menu-item",
      "data-inset": inset,
      "data-variant": variant,
      className: cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )
    }, props)
  );
}

// src/components/ui/tooltip.tsx
var TooltipPrimitive = __toESM(require("@radix-ui/react-tooltip"));
var import_jsx_runtime4 = require("react/jsx-runtime");
function TooltipProvider(_a) {
  var _b = _a, {
    delayDuration = 0
  } = _b, props = __objRest(_b, [
    "delayDuration"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    TooltipPrimitive.Provider,
    __spreadValues({
      "data-slot": "tooltip-provider",
      delayDuration
    }, props)
  );
}
function Tooltip(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(TooltipProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(TooltipPrimitive.Root, __spreadValues({ "data-slot": "tooltip" }, props)) });
}
function TooltipTrigger(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(TooltipPrimitive.Trigger, __spreadValues({ "data-slot": "tooltip-trigger" }, props));
}
function TooltipContent(_a) {
  var _b = _a, {
    className,
    sideOffset = 0,
    children
  } = _b, props = __objRest(_b, [
    "className",
    "sideOffset",
    "children"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(TooltipPrimitive.Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
    TooltipPrimitive.Content,
    __spreadProps(__spreadValues({
      "data-slot": "tooltip-content",
      sideOffset,
      className: cn(
        "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
        className
      )
    }, props), {
      children: [
        children,
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(TooltipPrimitive.Arrow, { className: "bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" })
      ]
    })
  ) });
}

// src/components/ui/dialog.tsx
var DialogPrimitive = __toESM(require("@radix-ui/react-dialog"));
var import_lucide_react2 = require("lucide-react");
var import_jsx_runtime5 = require("react/jsx-runtime");
function Dialog(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(DialogPrimitive.Root, __spreadValues({ "data-slot": "dialog" }, props));
}
function DialogTrigger(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(DialogPrimitive.Trigger, __spreadValues({ "data-slot": "dialog-trigger" }, props));
}
function DialogPortal(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(DialogPrimitive.Portal, __spreadValues({ "data-slot": "dialog-portal" }, props));
}
function DialogOverlay(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(DialogPortal, { "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(DialogOverlay, {}),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
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
          showCloseButton && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
            DialogPrimitive.Close,
            {
              "data-slot": "dialog-close",
              className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_lucide_react2.XIcon, {}),
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "sr-only", children: "Close" })
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
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    DialogPrimitive.Title,
    __spreadValues({
      "data-slot": "dialog-title",
      className: cn("text-lg leading-none font-semibold", className)
    }, props)
  );
}

// src/components/controls/keyboard-shortcuts.tsx
var import_lucide_react3 = require("lucide-react");
var import_jsx_runtime6 = require("react/jsx-runtime");
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
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(Dialog, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(DialogTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Button, { variant: "ghost", size: "sm", className: "text-white hover:bg-white/20", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_lucide_react3.Keyboard, { className: "h-4 w-4" }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(DialogContent, { className: "max-w-md", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(DialogTitle, { children: "Keyboard Shortcuts" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "space-y-2", children: shortcuts.map((shortcut, index) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex justify-between items-center py-1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "text-sm text-muted-foreground", children: shortcut.description }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("kbd", { className: "px-2 py-1 text-xs bg-muted rounded font-mono", children: shortcut.key })
      ] }, index)) })
    ] })
  ] });
};

// src/components/controls/video-controls.tsx
var import_jsx_runtime7 = require("react/jsx-runtime");
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
var VideoControls = ({
  state,
  controls,
  qualityLevels,
  controlsConfig,
  onShow,
  onHide,
  className
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = (0, import_react.useState)(false);
  const [hoverTime, setHoverTime] = (0, import_react.useState)(null);
  const [isMounted, setIsMounted] = (0, import_react.useState)(false);
  (0, import_react.useEffect)(() => {
    setIsMounted(true);
  }, []);
  const handlePlayPause = () => {
    if (state.isLoading) return;
    if (state.isPlaying && !state.isPaused) {
      controls.pause();
    } else if (state.isPaused && !state.isPlaying) {
      controls.play();
    }
  };
  const handleProgressClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * state.duration;
    controls.seek(newTime);
  };
  const handleProgressHover = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const hoverX = event.clientX - rect.left;
    const percentage = hoverX / rect.width;
    const time = percentage * state.duration;
    setHoverTime(time);
  };
  const handleVolumeChange = (value) => {
    controls.setVolume(value[0] / 100);
  };
  const progressPercentage = state.duration > 0 ? state.currentTime / state.duration * 100 : 0;
  const bufferedPercentage = state.buffered;
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(TooltipProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: cn(
    "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent",
    "p-4 transition-opacity duration-300",
    className
  ), children: [
    controlsConfig.progress && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "mb-4", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
      "div",
      {
        className: "relative w-full h-1 bg-white/20 rounded-full cursor-pointer group",
        onClick: handleProgressClick,
        onMouseMove: handleProgressHover,
        onMouseLeave: () => setHoverTime(null),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            "div",
            {
              className: "absolute left-0 top-0 h-full bg-white/30 rounded-full",
              style: { width: `${bufferedPercentage}%` }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            "div",
            {
              className: "absolute left-0 top-0 h-full bg-blue-500 rounded-full",
              style: { width: `${progressPercentage}%` }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            "div",
            {
              className: "absolute top-1/2 w-3 h-3 bg-blue-500 rounded-full transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity",
              style: { left: `calc(${progressPercentage}% - 6px)` }
            }
          ),
          hoverTime !== null && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            "div",
            {
              className: "absolute bottom-6 transform -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-sm pointer-events-none z-10",
              style: { left: `${hoverTime / state.duration * 100}%` },
              children: formatTime(hoverTime)
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex items-center space-x-2", children: [
        controlsConfig.playPause && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(Tooltip, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: handlePlayPause,
              disabled: state.isLoading,
              className: "text-white hover:bg-white/10 p-2",
              children: state.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react4.Loader2, { className: "w-5 h-5 animate-spin" }) : state.isPlaying ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react4.Pause, { className: "w-5 h-5" }) : /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react4.Play, { className: "w-5 h-5" })
            }
          ) }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(TooltipContent, { children: state.isPlaying ? "Pause" : "Play" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "text-white text-sm font-mono", children: [
          formatTime(state.currentTime),
          " / ",
          formatTime(state.duration)
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex items-center space-x-2", children: [
        controlsConfig.volume && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
          "div",
          {
            className: "flex items-center space-x-2",
            onMouseEnter: () => setShowVolumeSlider(true),
            onMouseLeave: () => setShowVolumeSlider(false),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(Tooltip, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    onClick: controls.toggleMute,
                    className: "text-white hover:bg-white/10 p-2",
                    children: state.isMuted || state.volume === 0 ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react4.VolumeX, { className: "w-5 h-5" }) : /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react4.Volume2, { className: "w-5 h-5" })
                  }
                ) }),
                /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(TooltipContent, { children: state.isMuted ? "Unmute" : "Mute" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: cn(
                "transition-all duration-200 overflow-hidden",
                showVolumeSlider ? "w-20 opacity-100" : "w-0 opacity-0"
              ), children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
                Slider,
                {
                  value: [state.isMuted ? 0 : state.volume * 100],
                  onValueChange: handleVolumeChange,
                  max: 100,
                  step: 1,
                  className: "w-full"
                }
              ) })
            ]
          }
        ),
        controlsConfig.playbackRate && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(DropdownMenu, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(Tooltip, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "text-white hover:bg-white/10 p-2 min-w-[60px]",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react4.Gauge, { className: "w-4 h-4 mr-1" }),
                  /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { className: "text-xs", children: [
                    state.playbackRate,
                    "x"
                  ] })
                ]
              }
            ) }) }),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(TooltipContent, { children: "Playback Speed" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(DropdownMenuContent, { align: "end", className: "bg-black/90 border-white/10", children: playbackRateOptions.map((option) => /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
            DropdownMenuItem,
            {
              onClick: () => controls.setPlaybackRate(option.value),
              className: "text-white hover:bg-white/10 cursor-pointer",
              children: [
                option.label,
                state.playbackRate === option.value && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "ml-2 text-blue-400", children: "\u2713" })
              ]
            },
            option.value
          )) })
        ] }),
        controlsConfig.quality && qualityLevels.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(DropdownMenu, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(Tooltip, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "text-white hover:bg-white/10 p-2",
                children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react4.Settings, { className: "w-5 h-5" })
              }
            ) }) }),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(TooltipContent, { children: "Quality" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(DropdownMenuContent, { align: "end", className: "bg-black/90 border-white/10", children: qualityLevels.map((level) => /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
            DropdownMenuItem,
            {
              onClick: () => controls.setQuality(level.id),
              className: "text-white hover:bg-white/10 cursor-pointer",
              children: [
                level.label,
                state.quality === level.label && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "ml-2 text-blue-400", children: "\u2713" })
              ]
            },
            level.id
          )) })
        ] }),
        controlsConfig.theaterMode && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(Tooltip, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: controls.toggleTheaterMode,
              className: "text-white hover:bg-white/10 p-2",
              children: state.isTheaterMode ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react4.Smartphone, { className: "w-5 h-5" }) : /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react4.Monitor, { className: "w-5 h-5" })
            }
          ) }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(TooltipContent, { children: state.isTheaterMode ? "Exit Theater Mode" : "Theater Mode" })
        ] }),
        controlsConfig.pictureInPicture && isMounted && typeof document !== "undefined" && "pictureInPictureEnabled" in document && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(Tooltip, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: controls.togglePictureInPicture,
              className: "text-white hover:bg-white/10 p-2",
              children: state.isPictureInPicture ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react4.PictureInPicture2, { className: "w-5 h-5" }) : /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react4.PictureInPicture, { className: "w-5 h-5" })
            }
          ) }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(TooltipContent, { children: state.isPictureInPicture ? "Exit Picture-in-Picture" : "Picture-in-Picture" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(KeyboardShortcuts, {}),
        controlsConfig.fullscreen && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(Tooltip, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: controls.toggleFullscreen,
              className: "text-white hover:bg-white/10 p-2",
              children: state.isFullscreen ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react4.Minimize, { className: "w-5 h-5" }) : /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react4.Maximize, { className: "w-5 h-5" })
            }
          ) }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(TooltipContent, { children: state.isFullscreen ? "Exit Fullscreen" : "Fullscreen" })
        ] })
      ] })
    ] })
  ] }) });
};

// src/components/controls/mobile-video-controls.tsx
var import_react3 = require("react");
var import_lucide_react5 = require("lucide-react");

// src/components/player/video-thumbnail.tsx
var import_react2 = require("react");
var import_jsx_runtime8 = require("react/jsx-runtime");
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
  const [thumbnailSrc, setThumbnailSrc] = (0, import_react2.useState)("");
  const [spritePosition, setSpritePosition] = (0, import_react2.useState)({ x: 0, y: 0 });
  const canvasRef = (0, import_react2.useRef)(null);
  (0, import_react2.useEffect)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
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
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
          "div",
          {
            className: "relative bg-gray-800",
            style: {
              width: thumbnailSize.width,
              height: thumbnailSize.height,
              margin: "8px 8px 0 8px"
            },
            children: [
              thumbnailSrc ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
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
              ) : /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "w-full h-full bg-gray-700 flex items-center justify-center rounded", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "text-white/60 text-xs", children: "Loading..." }) }),
              /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "absolute inset-0 bg-black/20 rounded" })
            ]
          }
        ),
        showTime && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "px-3 py-2 text-center", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "text-white text-sm font-medium", children: formatTime2(currentTime) }) }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "absolute -bottom-1 left-1/2 transform -translate-x-1/2", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "w-3 h-3 bg-black/90 rotate-45 border-r border-b border-white/20" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("canvas", { ref: canvasRef, className: "hidden" })
      ]
    }
  );
};

// src/components/controls/mobile-video-controls.tsx
var import_jsx_runtime9 = require("react/jsx-runtime");
var formatTime3 = (seconds) => {
  if (!isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};
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
  const [showVolumePanel, setShowVolumePanel] = (0, import_react3.useState)(false);
  const [showSettings, setShowSettings] = (0, import_react3.useState)(false);
  const [isDragging, setIsDragging] = (0, import_react3.useState)(false);
  const [isMounted, setIsMounted] = (0, import_react3.useState)(false);
  const [isVisible, setIsVisible] = (0, import_react3.useState)(true);
  const [hoverTime, setHoverTime] = (0, import_react3.useState)(null);
  const [touchPosition, setTouchPosition] = (0, import_react3.useState)(null);
  const hideTimeoutRef = (0, import_react3.useRef)(null);
  (0, import_react3.useEffect)(() => {
    setIsMounted(true);
  }, []);
  const showControlsTemporarily = (0, import_react3.useCallback)(() => {
    setIsVisible(true);
    onShow == null ? void 0 : onShow();
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    if (state.isPlaying && !showVolumePanel && !showSettings) {
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
        onHide == null ? void 0 : onHide();
      }, 3e3);
    }
  }, [state.isPlaying, showVolumePanel, showSettings, onShow, onHide]);
  (0, import_react3.useEffect)(() => {
    if (!state.isPlaying || showVolumePanel || showSettings) {
      setIsVisible(true);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    }
  }, [state.isPlaying, showVolumePanel, showSettings]);
  const handleContainerTap = (0, import_react3.useCallback)((e) => {
    if (e.target === e.currentTarget) {
      setIsVisible(!isVisible);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      if (!isVisible && state.isPlaying && !showVolumePanel && !showSettings) {
        hideTimeoutRef.current = setTimeout(() => {
          setIsVisible(false);
          onHide == null ? void 0 : onHide();
        }, 3e3);
      }
    }
  }, [isVisible, state.isPlaying, showVolumePanel, showSettings, onHide]);
  (0, import_react3.useEffect)(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);
  const progressPercentage = state.duration > 0 ? state.currentTime / state.duration * 100 : 0;
  const bufferedPercentage = state.duration > 0 ? state.buffered / state.duration * 100 : 0;
  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * state.duration;
    controls.seek(newTime);
  };
  const handleProgressHover = (e) => {
    if (!thumbnailPreview) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const time = percent * state.duration;
    setHoverTime(time);
  };
  const handleProgressLeave = () => {
    setHoverTime(null);
  };
  const handleProgressTouch = (e) => {
    if (!thumbnailPreview) return;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (touch.clientX - rect.left) / rect.width;
    const time = percent * state.duration;
    setHoverTime(time);
    setTouchPosition({ x: touch.clientX, y: touch.clientY });
  };
  const handleTouchEnd = () => {
    setHoverTime(null);
    setTouchPosition(null);
  };
  const handleSeek = (direction) => {
    const seekAmount = 10;
    const newTime = direction === "backward" ? Math.max(0, state.currentTime - seekAmount) : Math.min(state.duration, state.currentTime + seekAmount);
    controls.seek(newTime);
  };
  if (!isMounted) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
    "div",
    {
      className: cn(
        "absolute inset-0 flex flex-col justify-between",
        "bg-gradient-to-t from-black/80 via-transparent to-black/60",
        "text-white transition-opacity duration-300",
        "z-10",
        // Ensure controls are above video
        isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        className
      ),
      onClick: handleContainerTap,
      style: { paddingBottom: "env(safe-area-inset-bottom)" },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent touch-auto", children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex items-center gap-3", children: [
            state.isLoading && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_lucide_react5.Loader2, { className: "h-5 w-5 animate-spin" }),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "px-2 py-1 bg-black/40 rounded text-xs font-medium", children: state.quality === "auto" ? "AUTO" : state.quality.toUpperCase() }),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "px-2 py-1 bg-black/40 rounded text-xs font-medium", children: state.isMuted ? "MUTED" : `${Math.round(state.volume * 100)}%` })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "h-12 w-12 p-0 text-white hover:bg-white/20 touch-manipulation",
                onClick: () => controls.toggleMute(),
                children: state.isMuted || state.volume === 0 ? /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_lucide_react5.VolumeX, { className: "h-6 w-6" }) : /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_lucide_react5.Volume2, { className: "h-6 w-6" })
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "h-12 w-12 p-0 text-white hover:bg-white/20 touch-manipulation",
                onClick: () => setShowVolumePanel(!showVolumePanel),
                children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_lucide_react5.MoreHorizontal, { className: "h-6 w-6" })
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "h-12 w-12 p-0 text-white hover:bg-white/20 touch-manipulation",
                onClick: () => controls.togglePictureInPicture(),
                disabled: !state.duration,
                children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_lucide_react5.PictureInPicture, { className: "h-6 w-6" })
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "h-12 w-12 p-0 text-white hover:bg-white/20 touch-manipulation",
                onClick: () => setShowSettings(!showSettings),
                children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_lucide_react5.Settings, { className: "h-6 w-6" })
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "h-12 w-12 p-0 text-white hover:bg-white/20 touch-manipulation",
                onClick: () => controls.toggleFullscreen(),
                children: state.isFullscreen ? /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_lucide_react5.Minimize, { className: "h-6 w-6" }) : /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_lucide_react5.Maximize, { className: "h-6 w-6" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "flex-1 flex items-center justify-center touch-auto", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex items-center gap-8", children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
            Button,
            {
              variant: "ghost",
              size: "lg",
              className: "h-16 w-16 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 text-white hover:bg-black/60 hover:scale-110 transition-all duration-200 touch-manipulation",
              onClick: () => handleSeek("backward"),
              disabled: !state.duration,
              children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_lucide_react5.SkipBack, { className: "h-8 w-8" })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
            Button,
            {
              variant: "ghost",
              size: "lg",
              className: "h-24 w-24 rounded-full bg-black/50 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-black/70 active:scale-95 transition-all duration-300 shadow-2xl touch-manipulation",
              onClick: () => {
                state.isPlaying ? controls.pause() : controls.play();
              },
              disabled: !state.duration && !state.isLoading,
              style: { minHeight: "96px", minWidth: "96px" },
              children: state.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_lucide_react5.Loader2, { className: "h-12 w-12 animate-spin" }) : state.isPlaying ? /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_lucide_react5.Pause, { className: "h-12 w-12" }) : /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_lucide_react5.Play, { className: "h-12 w-12 ml-1" })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
            Button,
            {
              variant: "ghost",
              size: "lg",
              className: "h-16 w-16 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 text-white hover:bg-black/60 hover:scale-110 transition-all duration-200 touch-manipulation",
              onClick: () => handleSeek("forward"),
              disabled: !state.duration,
              children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_lucide_react5.SkipForward, { className: "h-8 w-8" })
            }
          )
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "p-4 bg-gradient-to-t from-black/80 to-transparent space-y-2", style: { paddingBottom: "max(3rem, calc(3rem + env(safe-area-inset-bottom)))" }, children: [
          state.playbackRate !== 1 && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "flex justify-center mb-2", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "px-4 py-2 bg-white/20 rounded-full text-sm font-medium", children: [
            state.playbackRate,
            "x Speed"
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "space-y-2 touch-auto relative", children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
              "div",
              {
                className: "relative h-3 bg-white/20 rounded-full cursor-pointer group touch-manipulation",
                onClick: handleProgressClick,
                onMouseMove: handleProgressHover,
                onMouseLeave: handleProgressLeave,
                onTouchMove: handleProgressTouch,
                onTouchEnd: handleTouchEnd,
                style: { minHeight: "12px" },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
                    "div",
                    {
                      className: "absolute left-0 top-0 h-full bg-white/30 rounded-full transition-all duration-300",
                      style: { width: `${bufferedPercentage}%` }
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
                    "div",
                    {
                      className: "absolute left-0 top-0 h-full bg-white rounded-full transition-all duration-300",
                      style: { width: `${progressPercentage}%` }
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
                    "div",
                    {
                      className: "absolute top-1/2 transform -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg border-2 border-black/20 transition-all duration-200 group-active:scale-125",
                      style: { left: `calc(${progressPercentage}% - 10px)` }
                    }
                  ),
                  thumbnailPreview && hoverTime !== null && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
                    "div",
                    {
                      className: "absolute",
                      style: {
                        left: `${hoverTime / state.duration * 100}%`,
                        bottom: "100%",
                        transform: "translateX(-50%)"
                      },
                      children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
                        VideoThumbnail,
                        {
                          duration: state.duration,
                          currentTime: hoverTime,
                          thumbnailUrl,
                          isMobile: true,
                          thumbnailSize: { width: 120, height: 68 }
                        }
                      )
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex justify-between text-base font-medium", children: [
              /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { children: formatTime3(state.currentTime) }),
              /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { children: formatTime3(state.duration) })
            ] })
          ] })
        ] }),
        showVolumePanel && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "absolute top-16 left-4 bg-black/90 backdrop-blur-sm rounded-lg p-4 min-w-[200px]", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "space-y-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("h3", { className: "text-sm font-medium", children: "Audio Controls" }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("label", { className: "text-xs text-gray-300", children: "Volume" }),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
              Slider,
              {
                value: [state.isMuted ? 0 : state.volume * 100],
                onValueChange: ([value]) => {
                  controls.setVolume(value / 100);
                  if (value > 0 && state.isMuted) {
                    controls.toggleMute();
                  }
                },
                max: 100,
                step: 1,
                className: "w-full"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: "w-full",
              onClick: () => setShowVolumePanel(false),
              children: "Close"
            }
          )
        ] }) }),
        showSettings && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "absolute top-16 right-4 bg-black/90 backdrop-blur-sm rounded-lg p-4 min-w-[200px]", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "space-y-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("h3", { className: "text-sm font-medium", children: "Video Settings" }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("label", { className: "text-xs text-gray-300", children: "Quality" }),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "grid gap-1", children: qualityLevels.map((quality) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
              Button,
              {
                variant: state.quality === quality.id ? "default" : "ghost",
                size: "sm",
                className: "justify-start text-xs",
                onClick: () => controls.setQuality(quality.id),
                children: quality.label
              },
              quality.id
            )) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("label", { className: "text-xs text-gray-300", children: "Speed" }),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "grid grid-cols-2 gap-1", children: [0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
              Button,
              {
                variant: state.playbackRate === rate ? "default" : "ghost",
                size: "sm",
                className: "text-xs",
                onClick: () => controls.setPlaybackRate(rate),
                children: [
                  rate,
                  "x"
                ]
              },
              rate
            )) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: "w-full",
              onClick: () => setShowSettings(false),
              children: "Close"
            }
          )
        ] }) })
      ]
    }
  );
};

// src/components/player/loading-spinner.tsx
var import_jsx_runtime10 = require("react/jsx-runtime");
var LoadingSpinner = ({
  className,
  size = "medium"
}) => {
  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-8 h-8",
    large: "w-12 h-12"
  };
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: cn("flex items-center justify-center", className), children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
    "div",
    {
      className: cn(
        "animate-spin rounded-full border-2 border-gray-300 border-t-white",
        sizeClasses[size]
      )
    }
  ) });
};

// src/components/player/error-display.tsx
var import_lucide_react6 = require("lucide-react");
var import_jsx_runtime11 = require("react/jsx-runtime");
var ErrorDisplay = ({
  error,
  onRetry,
  className
}) => {
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: cn(
    "flex flex-col items-center justify-center space-y-4 p-6 text-white text-center max-w-md",
    className
  ), children: [
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(import_lucide_react6.AlertCircle, { className: "w-12 h-12 text-red-400" }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "space-y-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("h3", { className: "text-lg font-semibold", children: "Video Error" }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { className: "text-sm text-white/80", children: error })
    ] }),
    onRetry && /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
      Button,
      {
        onClick: onRetry,
        variant: "outline",
        size: "sm",
        className: "text-white border-white/20 hover:bg-white/10",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(import_lucide_react6.RefreshCw, { className: "w-4 h-4 mr-2" }),
          "Try Again"
        ]
      }
    )
  ] });
};

// src/hooks/use-video-player.ts
var import_react4 = require("react");

// src/core/adapters/adapter-registry.ts
var AdapterRegistry = class {
  constructor() {
    this.factories = [];
  }
  register(factory) {
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
    const dashjs = await import("dashjs");
    this.instance = dashjs.MediaPlayer().create();
    await new Promise((resolve, reject) => {
      const dash = this.instance;
      dash.on("streamInitialized", () => {
        resolve();
      });
      dash.on("error", (errorPayload) => {
        const errorValue = errorPayload == null ? void 0 : errorPayload.error;
        reject(new Error(`Dash.js error: ${errorValue != null ? errorValue : "unknown"}`));
      });
      dash.initialize(context.videoElement, context.src, false);
    });
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
  console.log("VideoEngine: Analyzing stream URL:", streamUrl);
  const isHlsUrl = streamUrl.includes(".m3u8");
  const isDashUrl = streamUrl.includes(".mpd");
  const isDirectVideo = streamUrl.match(/\.(mp4|webm|ogg|avi|mov)(\?|$)/i);
  console.log("VideoEngine: Format detection:", {
    isHlsUrl,
    isDashUrl,
    isDirectVideo: !!isDirectVideo,
    capabilities: {
      hasNativeHls: capabilities.hasNativeHls,
      hasHlsJs: capabilities.hasHlsJs,
      hasDashJs: capabilities.hasDashJs,
      isIOS: capabilities.isIOS
    }
  });
  if (isHlsUrl) {
    if (capabilities.hasNativeHls && capabilities.isIOS) {
      console.log("VideoEngine: Using native HLS strategy");
      return "native";
    }
    if (capabilities.hasHlsJs) {
      console.log("VideoEngine: Using HLS.js strategy");
      return "hlsjs";
    }
    console.log("VideoEngine: HLS not supported");
  }
  if (isDashUrl && capabilities.hasDashJs) {
    console.log("VideoEngine: Using DASH.js strategy");
    return "dashjs";
  }
  if (isDirectVideo) {
    const isSupported = isVideoFormatSupported(streamUrl);
    console.log("VideoEngine: Direct video format support check:", {
      url: streamUrl,
      isSupported
    });
    if (isSupported) {
      console.log("VideoEngine: Using direct video strategy");
      return "direct";
    } else {
      console.log("VideoEngine: Direct video format not supported by browser");
      return "unsupported";
    }
  }
  console.log("VideoEngine: Unsupported format");
  return "unsupported";
};

// src/core/adapters/direct-video-adapter.ts
var DirectVideoAdapter = class {
  constructor() {
    this.id = "direct";
  }
  async load(context) {
    const { videoElement, src } = context;
    if (!isVideoFormatSupported(src)) {
      throw new Error("Video format not supported by this browser");
    }
    videoElement.src = src;
    await new Promise((resolve, reject) => {
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
      const cleanup = () => {
        window.clearTimeout(timeout);
        videoElement.removeEventListener("loadeddata", onLoadedData);
        videoElement.removeEventListener("error", onError);
      };
      videoElement.addEventListener("loadeddata", onLoadedData);
      videoElement.addEventListener("error", onError);
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
    const { default: Hls } = await import("hls.js");
    if (!Hls.isSupported()) {
      throw new Error("HLS.js is not supported in this browser");
    }
    this.instance = new Hls({
      enableWorker: true,
      lowLatencyMode: false,
      backBufferLength: 90
    });
    await new Promise((resolve, reject) => {
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
    });
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
    const { videoElement, src } = context;
    videoElement.src = src;
    await new Promise((resolve, reject) => {
      const onLoadedData = () => {
        cleanup();
        resolve();
      };
      const onError = () => {
        cleanup();
        reject(new Error("Failed to load native HLS stream"));
      };
      const cleanup = () => {
        videoElement.removeEventListener("loadeddata", onLoadedData);
        videoElement.removeEventListener("error", onError);
      };
      videoElement.addEventListener("loadeddata", onLoadedData);
      videoElement.addEventListener("error", onError);
    });
  }
  destroy() {
  }
  getQualityLevels() {
    return [];
  }
  setQuality() {
  }
};
var createNativeHlsAdapter = () => {
  return new NativeHlsAdapter();
};

// src/core/adapters/default-adapters.ts
var isHls = (src) => src.includes(".m3u8");
var isDash = (src) => src.includes(".mpd");
var isDirect = (src) => /\.(mp4|webm|ogg|avi|mov)(\?|$)/i.test(src);
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
        console.warn("EME license exchange failed:", error);
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
      console.warn(`Plugin ${pluginName} failed during ${lifecycle}:`, error);
    }
  }
};

// src/core/video-engine.ts
var VideoEngine = class {
  constructor(videoElement, events = {}, options = {}) {
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
    var _a, _b, _c, _d;
    try {
      this.capabilities = await this.resolveCapabilities();
      this.pluginManager.onInit();
      (_b = (_a = this.events).onReady) == null ? void 0 : _b.call(_a);
    } catch (error) {
      (_d = (_c = this.events).onError) == null ? void 0 : _d.call(_c, error);
      throw error;
    }
  }
  async loadSource(config) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i;
    if (!this.capabilities) {
      await this.initialize();
    }
    if (!this.capabilities) {
      throw new Error("Failed to initialize video engine capabilities");
    }
    this.cleanupActiveAdapter();
    this.cleanupDrmController();
    this.applyVideoConfig(config);
    if ((_a = config.drm) == null ? void 0 : _a.enabled) {
      await this.setupDrm(config.drm);
    }
    (_c = (_b = this.events).onLoadStart) == null ? void 0 : _c.call(_b);
    const candidateSources = this.getCandidateSources(config);
    const totalAttempts = candidateSources.length;
    const attemptErrors = [];
    let lastAttemptStrategy;
    for (let index = 0; index < candidateSources.length; index += 1) {
      const src = candidateSources[index];
      const adapterFactory = this.adapterRegistry.resolve({
        src,
        capabilities: this.capabilities
      });
      const strategy = (_d = adapterFactory == null ? void 0 : adapterFactory.id) != null ? _d : "unresolved";
      lastAttemptStrategy = strategy;
      const payload = {
        src,
        strategy,
        capabilities: this.capabilities
      };
      this.pluginManager.onSourceLoadStart(payload);
      if (!adapterFactory) {
        const unsupportedError = new Error(`Unsupported video format. This browser cannot play: ${src}`);
        attemptErrors.push(unsupportedError);
        this.pluginManager.onSourceLoadFailed({
          src,
          strategy,
          error: unsupportedError,
          attempt: index + 1,
          totalAttempts
        });
        continue;
      }
      const adapter = adapterFactory.create();
      try {
        await adapter.load({
          src,
          capabilities: this.capabilities,
          videoElement: this.videoElement,
          onQualityChange: (quality) => {
            var _a2, _b2;
            (_b2 = (_a2 = this.events).onQualityChange) == null ? void 0 : _b2.call(_a2, quality);
            this.pluginManager.onQualityChange(quality);
          }
        });
        this.activeAdapter = adapter;
        this.currentStrategy = adapterFactory.id;
        this.currentSource = src;
        this.pluginManager.onSourceLoaded(payload);
        (_f = (_e = this.events).onLoadEnd) == null ? void 0 : _f.call(_e);
        return;
      } catch (error) {
        const runtimeError = error;
        adapter.destroy();
        attemptErrors.push(runtimeError);
        this.pluginManager.onSourceLoadFailed({
          src,
          strategy: adapterFactory.id,
          error: runtimeError,
          attempt: index + 1,
          totalAttempts
        });
      }
    }
    const lastError = (_g = attemptErrors[attemptErrors.length - 1]) != null ? _g : new Error("Unknown playback failure");
    const failureSummary = new Error(
      `All playback sources failed (${totalAttempts} attempts). Last error: ${lastError.message}`
    );
    (_i = (_h = this.events).onError) == null ? void 0 : _i.call(_h, failureSummary);
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
    (_a = this.activeAdapter) == null ? void 0 : _a.setQuality(qualityId);
  }
  cleanup() {
    this.cleanupActiveAdapter();
    this.cleanupDrmController();
  }
  dispose() {
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
    this.videoElement.addEventListener("play", () => {
      var _a, _b;
      (_b = (_a = this.events).onPlay) == null ? void 0 : _b.call(_a);
      this.pluginManager.onPlay();
    });
    this.videoElement.addEventListener("pause", () => {
      var _a, _b;
      (_b = (_a = this.events).onPause) == null ? void 0 : _b.call(_a);
      this.pluginManager.onPause();
    });
    this.videoElement.addEventListener("timeupdate", () => {
      var _a, _b;
      const currentTime = this.videoElement.currentTime;
      const duration = this.videoElement.duration || 0;
      (_b = (_a = this.events).onTimeUpdate) == null ? void 0 : _b.call(_a, currentTime, duration);
      this.pluginManager.onTimeUpdate({ currentTime, duration });
    });
    this.videoElement.addEventListener("progress", () => {
      var _a, _b;
      const buffered = this.getBufferedPercentage();
      (_b = (_a = this.events).onProgress) == null ? void 0 : _b.call(_a, buffered);
    });
    this.videoElement.addEventListener("volumechange", () => {
      var _a, _b;
      const volume = this.videoElement.volume;
      const muted = this.videoElement.muted;
      (_b = (_a = this.events).onVolumeChange) == null ? void 0 : _b.call(_a, volume, muted);
      this.pluginManager.onVolumeChange({ volume, muted });
    });
    this.videoElement.addEventListener("error", () => {
      var _a, _b;
      const error = new Error("Video element error");
      (_b = (_a = this.events).onError) == null ? void 0 : _b.call(_a, error);
      this.pluginManager.onError({ error, src: this.currentSource, strategy: this.currentStrategy });
    });
  }
  getBufferedPercentage() {
    const buffered = this.videoElement.buffered;
    const duration = this.videoElement.duration;
    if (buffered.length === 0 || !duration) {
      return 0;
    }
    const bufferedEnd = buffered.end(buffered.length - 1);
    return bufferedEnd / duration * 100;
  }
  cleanupActiveAdapter() {
    var _a;
    (_a = this.activeAdapter) == null ? void 0 : _a.destroy();
    this.activeAdapter = void 0;
    this.currentStrategy = void 0;
  }
  async setupDrm(configuration) {
    var _a, _b;
    try {
      this.activeEmeController = await createEmeController(this.videoElement, configuration, this.emeEnvironment);
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
};

// src/hooks/use-video-player.ts
var useVideoPlayer = (videoRef, options = {}) => {
  var _a, _b;
  const [state, setState] = (0, import_react4.useState)({
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
    // Analytics data
    playCount: 0,
    totalWatchTime: 0,
    bufferingTime: 0,
    averageBitrate: 0,
    qualityChanges: 0
  });
  const [engine, setEngine] = (0, import_react4.useState)(null);
  const [isEngineReady, setIsEngineReady] = (0, import_react4.useState)(false);
  const [pendingConfig, setPendingConfig] = (0, import_react4.useState)(null);
  const [isPlayPending, setIsPlayPending] = (0, import_react4.useState)(false);
  const [qualityLevels, setQualityLevels] = (0, import_react4.useState)([]);
  const [initialEnginePlugins] = (0, import_react4.useState)(() => options.enginePlugins);
  const [lastPlayTime, setLastPlayTime] = (0, import_react4.useState)(0);
  const [bufferingStartTime, setBufferingStartTime] = (0, import_react4.useState)(0);
  (0, import_react4.useEffect)(() => {
    if (!videoRef.current) return;
    const videoElement = videoRef.current;
    const events = {
      onReady: () => {
        console.log("VideoEngine: onReady event fired");
        setState((prev) => __spreadProps(__spreadValues({}, prev), { isLoading: false }));
        setIsEngineReady(true);
      },
      onPlay: () => {
        setState((prev) => __spreadProps(__spreadValues({}, prev), {
          isPlaying: true,
          isPaused: false,
          playCount: prev.playCount + 1
        }));
        setLastPlayTime(Date.now());
      },
      onPause: () => {
        setState((prev) => {
          const watchTime = lastPlayTime > 0 ? (Date.now() - lastPlayTime) / 1e3 : 0;
          return __spreadProps(__spreadValues({}, prev), {
            isPlaying: false,
            isPaused: true,
            totalWatchTime: prev.totalWatchTime + watchTime
          });
        });
      },
      onTimeUpdate: (currentTime, duration) => {
        setState((prev) => __spreadProps(__spreadValues({}, prev), { currentTime, duration }));
      },
      onProgress: (buffered) => {
        setState((prev) => __spreadProps(__spreadValues({}, prev), { buffered }));
      },
      onVolumeChange: (volume, muted) => {
        setState((prev) => __spreadProps(__spreadValues({}, prev), { volume, isMuted: muted }));
      },
      onQualityChange: (quality) => {
        setState((prev) => __spreadProps(__spreadValues({}, prev), {
          quality,
          qualityChanges: prev.qualityChanges + 1
        }));
      },
      onError: (error) => {
        setState((prev) => __spreadProps(__spreadValues({}, prev), { error: error.message, isLoading: false }));
      },
      onLoadStart: () => {
        setState((prev) => __spreadProps(__spreadValues({}, prev), { isLoading: true, error: null }));
        setBufferingStartTime(Date.now());
      },
      onLoadEnd: () => {
        setState((prev) => {
          const bufferingTime = bufferingStartTime > 0 ? (Date.now() - bufferingStartTime) / 1e3 : 0;
          return __spreadProps(__spreadValues({}, prev), {
            isLoading: false,
            bufferingTime: prev.bufferingTime + bufferingTime
          });
        });
      }
    };
    const videoEngine = new VideoEngine(videoElement, events, {
      plugins: initialEnginePlugins
    });
    setEngine(videoEngine);
    console.log("Initializing video engine...");
    videoEngine.initialize().then(() => {
      console.log("Video engine initialized successfully");
    }).catch((error) => {
      console.error("Video engine initialization failed:", error);
      setState((prev) => __spreadProps(__spreadValues({}, prev), { error: error.message }));
    });
    return () => {
      videoEngine.dispose();
    };
  }, [videoRef, initialEnginePlugins]);
  (0, import_react4.useEffect)(() => {
    if (isEngineReady && engine && pendingConfig) {
      console.log("Engine is ready, loading pending config:", pendingConfig.src);
      engine.loadSource(pendingConfig).then(() => {
        console.log("Pending video loaded successfully");
        const levels = engine.getQualityLevels();
        setQualityLevels(levels);
        setPendingConfig(null);
      }).catch((error) => {
        console.error("Pending video load error:", error);
        setState((prev) => __spreadProps(__spreadValues({}, prev), {
          error: `Failed to load video: ${error.message}`
        }));
        setPendingConfig(null);
      });
    }
  }, [isEngineReady, engine, pendingConfig]);
  (0, import_react4.useEffect)(() => {
    if (typeof document === "undefined") return;
    const handleFullscreenChange = () => {
      setState((prev) => __spreadProps(__spreadValues({}, prev), {
        isFullscreen: Boolean(document.fullscreenElement)
      }));
    };
    const handleEnterPiP = () => {
      setState((prev) => __spreadProps(__spreadValues({}, prev), { isPictureInPicture: true }));
    };
    const handleLeavePiP = () => {
      setState((prev) => __spreadProps(__spreadValues({}, prev), { isPictureInPicture: false }));
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
  const controls = {
    play: (0, import_react4.useCallback)(async () => {
      if (!videoRef.current || isPlayPending) return;
      try {
        setIsPlayPending(true);
        if (!videoRef.current.paused) {
          setIsPlayPending(false);
          return;
        }
        await videoRef.current.play();
        setIsPlayPending(false);
      } catch (error) {
        setIsPlayPending(false);
        console.error("Play failed:", error);
        const errorMessage = error.message;
        if (!errorMessage.includes("user didn't interact") && !errorMessage.includes("autoplay") && !errorMessage.includes("gesture")) {
          setState((prev) => __spreadProps(__spreadValues({}, prev), {
            error: `Playback failed: ${errorMessage}`
          }));
        }
      }
    }, [videoRef, isPlayPending]),
    pause: (0, import_react4.useCallback)(() => {
      if (!videoRef.current || isPlayPending) return;
      if (!videoRef.current.paused) {
        videoRef.current.pause();
      }
    }, [videoRef, isPlayPending]),
    seek: (0, import_react4.useCallback)((time) => {
      if (!videoRef.current) return;
      videoRef.current.currentTime = time;
    }, [videoRef]),
    setVolume: (0, import_react4.useCallback)((volume) => {
      if (!videoRef.current) return;
      videoRef.current.volume = Math.max(0, Math.min(1, volume));
    }, [videoRef]),
    toggleMute: (0, import_react4.useCallback)(() => {
      if (!videoRef.current) return;
      videoRef.current.muted = !videoRef.current.muted;
    }, [videoRef]),
    toggleFullscreen: (0, import_react4.useCallback)(async () => {
      if (!videoRef.current) return;
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        } else {
          await videoRef.current.requestFullscreen();
        }
      } catch (error) {
        setState((prev) => __spreadProps(__spreadValues({}, prev), {
          error: `Fullscreen failed: ${error.message}`
        }));
      }
    }, [videoRef]),
    setQuality: (0, import_react4.useCallback)((qualityId) => {
      if (!engine) return;
      engine.setQuality(qualityId);
    }, [engine]),
    setPlaybackRate: (0, import_react4.useCallback)((rate) => {
      if (!videoRef.current) return;
      videoRef.current.playbackRate = rate;
      setState((prev) => __spreadProps(__spreadValues({}, prev), { playbackRate: rate }));
    }, [videoRef]),
    togglePictureInPicture: (0, import_react4.useCallback)(async () => {
      if (!videoRef.current) return;
      try {
        if (state.isPictureInPicture) {
          await document.exitPictureInPicture();
        } else {
          await videoRef.current.requestPictureInPicture();
        }
      } catch (error) {
        console.error("Picture-in-Picture error:", error);
      }
    }, [videoRef, state.isPictureInPicture]),
    toggleTheaterMode: (0, import_react4.useCallback)(() => {
      setState((prev) => __spreadProps(__spreadValues({}, prev), {
        isTheaterMode: !prev.isTheaterMode
      }));
    }, []),
    load: (0, import_react4.useCallback)(async (config) => {
      if (!engine) {
        console.log("Engine not available yet, storing config as pending");
        setPendingConfig(config);
        return;
      }
      if (!isEngineReady) {
        console.log("Engine not ready yet, storing config as pending");
        setPendingConfig(config);
        return;
      }
      try {
        console.log("Loading video source:", config.src);
        await engine.loadSource(config);
        const levels = engine.getQualityLevels();
        setQualityLevels(levels);
        console.log("Video loaded successfully");
      } catch (error) {
        console.error("Video load error:", error);
        setState((prev) => __spreadProps(__spreadValues({}, prev), {
          error: `Failed to load video: ${error.message}`
        }));
      }
    }, [engine, isEngineReady])
  };
  (0, import_react4.useEffect)(() => {
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
            controls.play();
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
          controls.toggleFullscreen();
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
        case "9":
          e.preventDefault();
          const percentage = parseInt(e.key) / 10;
          controls.seek(state.duration * percentage);
          break;
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [state.isPlaying, state.currentTime, state.duration, state.volume, controls]);
  return {
    state,
    controls,
    qualityLevels,
    engine
  };
};

// src/hooks/use-video-gestures.ts
var import_react5 = require("react");
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
  const touchState = (0, import_react5.useRef)({
    startX: 0,
    startY: 0,
    startTime: 0,
    lastTapTime: 0,
    tapCount: 0,
    isActive: false
  });
  const [isGestureActive, setIsGestureActive] = (0, import_react5.useState)(false);
  const handleTouchStart = (0, import_react5.useCallback)((event) => {
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
  const handleTouchMove = (0, import_react5.useCallback)((event) => {
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
  const handleTouchEnd = (0, import_react5.useCallback)((event) => {
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
  const handleTouchPinch = (0, import_react5.useCallback)((event) => {
    if (event.touches.length === 2) {
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + Math.pow(touch2.clientY - touch1.clientY, 2)
      );
    }
  }, [callbacks]);
  const handleMouseClick = (0, import_react5.useCallback)((event) => {
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
  (0, import_react5.useEffect)(() => {
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
var import_react6 = require("react");

// src/types/player-config.ts
var PlayerPresets = {
  // YouTube-like experience
  youtube: {
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
      style: "youtube",
      position: "bottom"
    },
    keyboard: { enabled: true },
    gestures: { enabled: true, tapToPlay: true, doubleTapSeek: true },
    auto: { autoHideControls: true, autoHideDelay: 3e3 },
    features: { thumbnailPreview: true, chapters: true }
  },
  // Minimal player
  minimal: {
    controls: {
      show: true,
      visibility: {
        playPause: true,
        progress: true,
        fullscreen: true
      },
      style: "minimal"
    },
    keyboard: { enabled: false },
    gestures: { enabled: true, tapToPlay: true },
    auto: { autoHideControls: true, autoHideDelay: 2e3 }
  },
  // No controls (video background)
  background: {
    controls: { show: false },
    keyboard: { enabled: false },
    gestures: { enabled: false },
    auto: { autoPlay: true }
  },
  // Netflix-style
  netflix: {
    controls: {
      show: true,
      visibility: {
        playPause: true,
        progress: true,
        volume: true,
        fullscreen: true,
        playbackRate: true,
        time: true
      },
      style: "netflix"
    },
    theme: {
      primary: "#e50914",
      controlsBackground: "rgba(0,0,0,0.7)"
    },
    auto: { autoHideControls: true, autoHideDelay: 4e3 }
  },
  // Mobile-optimized
  mobile: {
    controls: {
      show: true,
      visibility: {
        playPause: true,
        progress: true,
        fullscreen: true,
        volume: false,
        // Hidden on mobile
        quality: true
      },
      size: "large"
    },
    gestures: {
      enabled: true,
      tapToPlay: true,
      doubleTapSeek: true,
      swipeVolume: true
    },
    responsive: {
      enabled: true,
      adaptiveControls: true,
      hideControlsOnMobile: ["volume", "keyboardShortcuts"]
    }
  },
  // Custom minimal with only play/pause
  playOnly: {
    controls: {
      show: true,
      visibility: {
        playPause: true,
        progress: false,
        volume: false,
        quality: false,
        fullscreen: false,
        pictureInPicture: false,
        theaterMode: false,
        playbackRate: false,
        keyboardShortcuts: false,
        settings: false,
        time: false
      },
      style: "minimal"
    },
    keyboard: { enabled: false },
    gestures: { enabled: true, tapToPlay: true }
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
var import_jsx_runtime12 = require("react/jsx-runtime");
var PlayerConfigContext = (0, import_react6.createContext)(void 0);
var PlayerConfigProvider = ({
  children,
  defaultConfig = PlayerPresets.youtube,
  storageKey = "nextjs-videoplayer-config"
}) => {
  const [config, setConfig] = (0, import_react6.useState)(defaultConfig);
  (0, import_react6.useEffect)(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const savedConfig = JSON.parse(saved);
          setConfig(mergePlayerConfig(defaultConfig, savedConfig));
        } catch (error) {
          console.warn("Failed to load saved player config:", error);
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
  const loadPreset = (presetName) => {
    const preset = PlayerPresets[presetName];
    if (preset) {
      setConfig(preset);
      saveConfigToStorage(preset);
    } else {
      console.warn(`Preset "${presetName}" not found`);
    }
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
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
    PlayerConfigContext.Provider,
    {
      value: {
        config,
        updateConfig,
        resetConfig,
        loadPreset,
        saveConfig,
        loadSavedConfig,
        getSavedConfigs
      },
      children
    }
  );
};
var usePlayerConfig = () => {
  const context = (0, import_react6.useContext)(PlayerConfigContext);
  if (context === void 0) {
    throw new Error("usePlayerConfig must be used within a PlayerConfigProvider");
  }
  return context;
};
var usePlayerPresets = () => {
  const { loadPreset } = usePlayerConfig();
  return {
    presets: Object.keys(PlayerPresets),
    loadPreset,
    getPresetConfig: (name) => PlayerPresets[name]
  };
};

// src/components/player/configurable-video-player.tsx
var import_jsx_runtime13 = require("react/jsx-runtime");
var ConfigurableVideoPlayer = (0, import_react7.forwardRef)(({
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
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  const videoRef = (0, import_react7.useRef)(null);
  const containerRef = (0, import_react7.useRef)(null);
  const [showControls, setShowControls] = import_react7.default.useState(true);
  const [isMobile, setIsMobile] = import_react7.default.useState(false);
  const controlsTimeoutRef = (0, import_react7.useRef)(null);
  (0, import_react7.useEffect)(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent;
      const isMobileDevice2 = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isSmallScreen = window.innerWidth < 768;
      const isTouchDevice = "ontouchstart" in window;
      setIsMobile(isMobileDevice2 || isSmallScreen && isTouchDevice);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  const { config: contextConfig } = usePlayerConfig();
  const config = configOverride ? __spreadValues(__spreadValues({}, contextConfig), configOverride) : contextConfig;
  const { state, controls: playerControls, qualityLevels, engine } = useVideoPlayer(videoRef, {
    autoPlay: (_b = autoPlay != null ? autoPlay : (_a = config.auto) == null ? void 0 : _a.autoPlay) != null ? _b : false,
    muted,
    volume: 1,
    enginePlugins
  });
  const gesturesConfig = config.gestures || {};
  const gestureCallbacks = {
    onTap: () => {
      if (isMobile) {
        setShowControls(!showControls);
      } else {
        state.isPlaying ? playerControls.pause() : playerControls.play();
      }
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
    enableTapToPlay: isMobile ? false : true,
    // On mobile, tap shows controls
    enableDoubleTapSeek: true,
    enableSwipeVolume: isMobile,
    seekAmount: 10,
    volumeSensitivity: 0.02
  });
  const autoHideControls = (_d = (_c = config.auto) == null ? void 0 : _c.autoHideControls) != null ? _d : true;
  const autoHideDelay = (_f = (_e = config.auto) == null ? void 0 : _e.autoHideDelay) != null ? _f : 3e3;
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
  (0, import_react7.useEffect)(() => {
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
  }, [src, fallbackSources, drmConfig, poster, autoPlay, muted, loop, playsInline, engine, (_g = config.auto) == null ? void 0 : _g.autoPlay]);
  (0, import_react7.useEffect)(() => {
    if (state.isPlaying) {
      onPlay == null ? void 0 : onPlay();
    } else if (state.isPaused) {
      onPause == null ? void 0 : onPause();
    }
  }, [state.isPlaying, state.isPaused, onPlay, onPause]);
  (0, import_react7.useEffect)(() => {
    if (state.error) {
      onError == null ? void 0 : onError(state.error);
    }
  }, [state.error, onError]);
  (0, import_react7.useEffect)(() => {
    onTimeUpdate == null ? void 0 : onTimeUpdate(state.currentTime, state.duration);
  }, [state.currentTime, state.duration, onTimeUpdate]);
  (0, import_react7.useEffect)(() => {
    onStateChange == null ? void 0 : onStateChange(state);
  }, [state, onStateChange]);
  (0, import_react7.useEffect)(() => {
    if (!state.isLoading && state.duration > 0) {
      onReady == null ? void 0 : onReady();
    }
  }, [state.isLoading, state.duration, onReady]);
  const showControlsTemporarily = (0, import_react7.useCallback)(() => {
    if (!autoHideControls) return;
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (state.isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, autoHideDelay);
    }
  }, [state.isPlaying, autoHideControls, autoHideDelay]);
  (0, import_react7.useEffect)(() => {
    const container = containerRef.current;
    if (!container || !autoHideControls) return;
    const handleMouseMove = () => {
      showControlsTemporarily();
    };
    const handleMouseLeave = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
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
  }, [showControlsTemporarily, state.isPlaying, autoHideControls]);
  (0, import_react7.useEffect)(() => {
    if (!autoHideControls || !state.isPlaying) {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    }
  }, [state.isPlaying, autoHideControls]);
  (0, import_react7.useEffect)(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);
  import_react7.default.useImperativeHandle(ref, () => videoRef.current);
  const themeStyles = config.theme ? {
    "--player-primary": config.theme.primary || "#3b82f6",
    "--player-secondary": config.theme.secondary || "#64748b",
    "--player-accent": config.theme.accent || "#ef4444",
    "--player-progress": config.theme.progressColor || "#3b82f6",
    "--player-buffer": config.theme.bufferColor || "#64748b"
  } : {};
  const controlsVisibility = ((_h = config.controls) == null ? void 0 : _h.visibility) || {};
  const shouldShowControls = ((_i = config.controls) == null ? void 0 : _i.show) !== false;
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
    "div",
    {
      ref: containerRef,
      className: cn(
        "relative bg-black overflow-hidden group transition-all duration-300",
        "focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500",
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
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
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
        state.isLoading && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: "absolute inset-0 flex items-center justify-center bg-black/50", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(LoadingSpinner, {}) }),
        state.error && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
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
        shouldShowControls && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_jsx_runtime13.Fragment, { children: isMobile ? /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
          MobileVideoControls,
          {
            state,
            controls: playerControls,
            qualityLevels,
            thumbnailPreview: (_j = config.features) == null ? void 0 : _j.thumbnailPreview,
            thumbnailUrl,
            className: cn(
              "transition-opacity duration-300",
              showControls ? "opacity-100" : "opacity-0",
              "hover:opacity-100"
            ),
            onShow: () => setShowControls(true),
            onHide: () => setShowControls(false)
          }
        ) : /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
          VideoControls,
          {
            state,
            controls: playerControls,
            qualityLevels,
            controlsConfig: {
              fullscreen: controlsVisibility.fullscreen !== false,
              volume: controlsVisibility.volume !== false,
              quality: controlsVisibility.quality !== false,
              progress: controlsVisibility.progress !== false,
              playPause: controlsVisibility.playPause !== false,
              playbackRate: controlsVisibility.playbackRate !== false,
              pictureInPicture: controlsVisibility.pictureInPicture !== false,
              theaterMode: controlsVisibility.theaterMode !== false,
              settings: controlsVisibility.settings !== false,
              time: controlsVisibility.time !== false
            },
            className: cn(
              "transition-opacity duration-300",
              showControls ? "opacity-100" : "opacity-0",
              "hover:opacity-100"
            ),
            onShow: () => setShowControls(true),
            onHide: () => setShowControls(false)
          }
        ) }),
        ((_k = config.analytics) == null ? void 0 : _k.enabled) && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: "hidden", "data-analytics": "true" })
      ]
    }
  );
});
ConfigurableVideoPlayer.displayName = "ConfigurableVideoPlayer";

// src/components/player/video-player.tsx
var import_react8 = __toESM(require("react"));
var import_jsx_runtime14 = require("react/jsx-runtime");
var VideoPlayer = (0, import_react8.forwardRef)(({
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
  const videoRef = (0, import_react8.useRef)(null);
  const containerRef = (0, import_react8.useRef)(null);
  const [showControls, setShowControls] = import_react8.default.useState(true);
  const controlsTimeoutRef = (0, import_react8.useRef)(null);
  const legacyPluginsInitializedRef = (0, import_react8.useRef)(false);
  const { state, controls: playerControls, qualityLevels, engine } = useVideoPlayer(videoRef, {
    autoPlay,
    muted,
    volume: 1,
    enginePlugins
  });
  const handlePlay = (0, import_react8.useCallback)(() => {
    onPlay == null ? void 0 : onPlay();
  }, [onPlay]);
  const handlePause = (0, import_react8.useCallback)(() => {
    onPause == null ? void 0 : onPause();
  }, [onPause]);
  const handleError = (0, import_react8.useCallback)((error) => {
    onError == null ? void 0 : onError(error);
  }, [onError]);
  const handleTimeUpdate = (0, import_react8.useCallback)((currentTime, duration) => {
    onTimeUpdate == null ? void 0 : onTimeUpdate(currentTime, duration);
  }, [onTimeUpdate]);
  const handleStateChange = (0, import_react8.useCallback)((newState) => {
    onStateChange == null ? void 0 : onStateChange(newState);
  }, [onStateChange]);
  const handleReady = (0, import_react8.useCallback)(() => {
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
  (0, import_react8.useEffect)(() => {
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
  (0, import_react8.useEffect)(() => {
    if (state.isPlaying) {
      handlePlay();
    } else if (state.isPaused) {
      handlePause();
    }
  }, [state.isPlaying, state.isPaused, handlePlay, handlePause]);
  (0, import_react8.useEffect)(() => {
    if (state.error) {
      handleError(state.error);
    }
  }, [state.error, handleError]);
  (0, import_react8.useEffect)(() => {
    handleTimeUpdate(state.currentTime, state.duration);
  }, [state.currentTime, state.duration, handleTimeUpdate]);
  (0, import_react8.useEffect)(() => {
    handleStateChange(state);
  }, [state, handleStateChange]);
  (0, import_react8.useEffect)(() => {
    if (!state.isLoading && state.duration > 0) {
      handleReady();
    }
  }, [state.isLoading, state.duration, handleReady]);
  (0, import_react8.useEffect)(() => {
    legacyPluginsInitializedRef.current = false;
  }, [engine]);
  (0, import_react8.useEffect)(() => {
    if (!engine || plugins.length === 0 || legacyPluginsInitializedRef.current) {
      return;
    }
    plugins.forEach((plugin) => {
      try {
        plugin({ engine, state, controls: playerControls });
      } catch (error) {
        console.warn("Plugin initialization failed:", error);
      }
    });
    legacyPluginsInitializedRef.current = true;
  }, [engine, plugins, playerControls, state]);
  const showControlsTemporarily = import_react8.default.useCallback(() => {
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
  (0, import_react8.useEffect)(() => {
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
  (0, import_react8.useEffect)(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);
  import_react8.default.useImperativeHandle(ref, () => videoRef.current);
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
    "div",
    {
      ref: containerRef,
      className: cn(
        "relative w-full bg-black overflow-hidden group transition-all duration-300",
        "focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500",
        state.isFullscreen && "fixed inset-0 z-50",
        state.isTheaterMode && "mx-auto max-w-none",
        className
      ),
      style: {
        aspectRatio: state.isFullscreen || state.isTheaterMode ? "auto" : "16/9",
        height: state.isTheaterMode ? "70vh" : "auto"
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
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
        state.isLoading && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "absolute inset-0 flex items-center justify-center bg-black/50", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(LoadingSpinner, {}) }),
        state.error && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "absolute inset-0 flex items-center justify-center bg-black/80", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(ErrorDisplay, { error: state.error, onRetry: () => playerControls.load({ src, fallbackSources, drm: drmConfig }) }) }),
        isGestureActive && gestures.enabled && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "absolute inset-0 pointer-events-none", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "absolute inset-0 bg-white/10 animate-pulse" }) }),
        controls.show && (showControls || state.isPaused || !state.duration) && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
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

// src/components/demo/video-player-demo.tsx
var import_react10 = require("react");

// src/components/demo/video-source-selector.tsx
var import_react9 = require("react");

// src/components/ui/card.tsx
var React8 = __toESM(require("react"));
var import_jsx_runtime15 = require("react/jsx-runtime");
var Card = React8.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
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
var CardHeader = React8.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
    "div",
    __spreadValues({
      ref,
      className: cn("flex flex-col space-y-1.5 p-6", className)
    }, props)
  );
});
CardHeader.displayName = "CardHeader";
var CardTitle = React8.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
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
var CardDescription = React8.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
    "p",
    __spreadValues({
      ref,
      className: cn("text-sm text-muted-foreground", className)
    }, props)
  );
});
CardDescription.displayName = "CardDescription";
var CardContent = React8.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("div", __spreadValues({ ref, className: cn("p-6 pt-0", className) }, props));
});
CardContent.displayName = "CardContent";
var CardFooter = React8.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
    "div",
    __spreadValues({
      ref,
      className: cn("flex items-center p-6 pt-0", className)
    }, props)
  );
});
CardFooter.displayName = "CardFooter";

// src/components/ui/badge.tsx
var import_class_variance_authority2 = require("class-variance-authority");
var import_jsx_runtime16 = require("react/jsx-runtime");
var badgeVariants = (0, import_class_variance_authority2.cva)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", __spreadValues({ className: cn(badgeVariants({ variant }), className) }, props));
}

// src/components/demo/video-source-selector.tsx
var import_lucide_react7 = require("lucide-react");
var import_jsx_runtime17 = require("react/jsx-runtime");
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
    url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    format: "MP4",
    quality: "480p",
    size: "17.2MB",
    description: "Blender Foundation short film - reliable Google storage",
    features: ["Blender Foundation", "Good Quality", "Google CDN"]
  },
  {
    id: "tears-steel-480p",
    name: "MP4 - Tears of Steel (480p)",
    url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    format: "MP4",
    quality: "480p",
    size: "12.3MB",
    description: "Another Blender Foundation film from Google storage",
    features: ["Blender Foundation", "Sci-Fi", "Google CDN"]
  },
  {
    id: "elephant-dream",
    name: "MP4 - Elephant's Dream",
    url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    format: "MP4",
    quality: "720p",
    size: "18.9MB",
    description: "First open movie by Blender Foundation",
    features: ["Open Source", "Creative Commons", "Google CDN"]
  },
  {
    id: "mp4-big-buck-bunny",
    name: "MP4 - Big Buck Bunny",
    url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    format: "MP4",
    quality: "720p",
    size: "158MB",
    description: "Classic MP4 video file for compatibility testing",
    features: ["Direct Download", "Wide Compatibility", "Single Quality"]
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
  const [isLoading, setIsLoading] = (0, import_react9.useState)(null);
  const [mounted, setMounted] = (0, import_react9.useState)(false);
  const [erroredSources, setErroredSources] = (0, import_react9.useState)(/* @__PURE__ */ new Set());
  const sources = propVideoSources || videoSources;
  (0, import_react9.useEffect)(() => {
    setMounted(true);
  }, []);
  const handleSourceSelect = async (source) => {
    if (isLoading) {
      return;
    }
    console.log("Selecting video source:", source.name, source.url);
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
      console.error("Error selecting source:", error);
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
    return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className, children: /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(Card, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(CardHeader, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(import_lucide_react7.FileVideo, { className: "h-5 w-5" }),
          "Video Format Showcase"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("p", { className: "text-sm text-muted-foreground", children: "Loading video formats..." })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: [1, 2, 3, 4, 5, 6].map((i) => /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "border rounded-lg p-4 animate-pulse", children: [
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "h-4 bg-gray-200 rounded mb-2" }),
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "h-3 bg-gray-200 rounded mb-2" }),
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "h-3 bg-gray-200 rounded" })
      ] }, i)) }) })
    ] }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className, children: /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(Card, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(CardHeader, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)(CardTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(import_lucide_react7.FileVideo, { className: "h-5 w-5" }),
        "Video Format Showcase"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("p", { className: "text-sm text-muted-foreground", children: "Test different video formats and streaming protocols to explore all features" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: sources.map((source) => {
      const isSupported = isVideoFormatSupportedSimple(source.url);
      const hasError = erroredSources.has(source.id);
      const isSelected = (selectedVideo == null ? void 0 : selectedVideo.id) === source.id || currentSource === source.url;
      return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
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
          children: /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "space-y-3", children: [
            /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "flex items-start justify-between", children: [
              /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("h3", { className: "font-medium text-sm leading-tight", children: source.name }),
              /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "flex items-center gap-1", children: [
                currentSource === source.url && /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(import_lucide_react7.Play, { className: "h-4 w-4 text-blue-500 flex-shrink-0" }),
                hasError && /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(import_lucide_react7.AlertTriangle, { className: "h-4 w-4 text-red-500 flex-shrink-0" }),
                !isSupported && !hasError && /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(import_lucide_react7.AlertTriangle, { className: "h-4 w-4 text-red-500 flex-shrink-0" })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "flex gap-2 flex-wrap", children: [
              /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(Badge, { className: `text-xs ${getFormatColor(source.format)}`, children: source.format }),
              /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(Badge, { className: `text-xs ${getQualityColor(source.quality)}`, children: source.quality }),
              source.fallbackUrls && source.fallbackUrls.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(Badge, { variant: "outline", className: "text-xs", children: "Failover" }),
              source.aspectRatio && /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(Badge, { variant: "outline", className: "text-xs", children: source.aspectRatio === "16/9" ? "\u{1F4FA} Landscape" : source.aspectRatio === "9/16" ? "\u{1F4F1} Vertical" : source.aspectRatio === "1/1" ? "\u2B1C Square" : source.aspectRatio })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("p", { className: "text-xs text-muted-foreground line-clamp-2", children: hasError ? "\u26A0\uFE0F This video failed to load. Click 'Retry' to try again." : source.description }),
            /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "flex items-center gap-4 text-xs text-muted-foreground", children: [
              source.size && /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(import_lucide_react7.Download, { className: "h-3 w-3" }),
                source.size
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(import_lucide_react7.Info, { className: "h-3 w-3" }),
                source.features.length,
                " features"
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "space-y-1", children: [
              source.features.slice(0, 2).map((feature, index) => /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "w-1.5 h-1.5 bg-green-500 rounded-full" }),
                /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { className: "text-xs text-muted-foreground", children: feature })
              ] }, index)),
              source.features.length > 2 && /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "text-xs text-muted-foreground", children: [
                "+",
                source.features.length - 2,
                " more features"
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
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
var import_jsx_runtime18 = require("react/jsx-runtime");
var PlayerStats = ({ state }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "bg-gray-100 dark:bg-gray-800 rounded-lg p-4 space-y-2", children: [
    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("h3", { className: "font-semibold text-gray-900 dark:text-white", children: "Player Statistics" }),
    /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [
      /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: "text-gray-600 dark:text-gray-400", children: "Current Time:" }),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("span", { className: "ml-2 font-mono", children: [
          state.currentTime.toFixed(2),
          "s"
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: "text-gray-600 dark:text-gray-400", children: "Duration:" }),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("span", { className: "ml-2 font-mono", children: [
          state.duration.toFixed(2),
          "s"
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: "text-gray-600 dark:text-gray-400", children: "Volume:" }),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("span", { className: "ml-2 font-mono", children: [
          Math.round(state.volume * 100),
          "%"
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: "text-gray-600 dark:text-gray-400", children: "Quality:" }),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: "ml-2 font-mono", children: state.quality })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: "text-gray-600 dark:text-gray-400", children: "Buffered:" }),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("span", { className: "ml-2 font-mono", children: [
          Math.round(state.buffered * 100),
          "%"
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: "text-gray-600 dark:text-gray-400", children: "Playback Rate:" }),
        /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("span", { className: "ml-2 font-mono", children: [
          state.playbackRate,
          "x"
        ] })
      ] })
    ] })
  ] });
};

// src/components/demo/feature-list.tsx
var import_lucide_react8 = require("lucide-react");
var import_jsx_runtime19 = require("react/jsx-runtime");
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
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "bg-gray-100 dark:bg-gray-800 rounded-lg p-4", children: [
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("h3", { className: "font-semibold text-gray-900 dark:text-white mb-4", children: "Features" }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("div", { className: "grid gap-2", children: features.map((feature, index) => /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "flex items-center space-x-3", children: [
      /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("div", { className: `w-4 h-4 rounded-full flex items-center justify-center ${feature.enabled ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`, children: feature.enabled && /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(import_lucide_react8.Check, { className: "w-3 h-3" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "flex-1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("div", { className: "text-sm font-medium text-gray-900 dark:text-white", children: feature.name }),
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("div", { className: "text-xs text-gray-600 dark:text-gray-400", children: feature.description })
      ] })
    ] }, index)) })
  ] });
};

// src/components/demo/video-player-demo.tsx
var import_jsx_runtime20 = require("react/jsx-runtime");
var VideoPlayerDemo = () => {
  const videoSources2 = [
    {
      id: "bigbuck",
      name: "Big Buck Bunny (MP4)",
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      format: "MP4",
      quality: "HD",
      size: "158MB",
      description: "High quality demo video",
      features: ["MP4", "HD Quality"],
      poster: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg"
    },
    {
      id: "elephant",
      name: "Elephant Dream (MP4)",
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      format: "MP4",
      quality: "HD",
      size: "120MB",
      description: "Animation showcase",
      features: ["MP4", "Animation"],
      poster: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg"
    },
    {
      id: "sintel",
      name: "Sintel (MP4)",
      url: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      format: "MP4",
      quality: "HD",
      size: "90MB",
      description: "Blender Foundation movie",
      features: ["MP4", "Short Film"],
      poster: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg"
    }
  ];
  const [selectedVideo, setSelectedVideo] = (0, import_react10.useState)(videoSources2[0]);
  const [isPlayerReady, setIsPlayerReady] = (0, import_react10.useState)(false);
  const [playerState, setPlayerState] = (0, import_react10.useState)({
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
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(PlayerConfigProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "grid lg:grid-cols-3 gap-8", children: [
    /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "lg:col-span-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
        VideoSourceSelector,
        {
          sources: videoSources2,
          selectedSource: selectedVideo,
          onSourceChange: setSelectedVideo,
          className: "mb-6"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
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
    /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "space-y-6", children: [
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(PlayerStats, { state: playerState }),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(FeatureList, {})
    ] })
  ] }) });
};

// src/components/config/player-config-panel.tsx
var import_react11 = require("react");

// src/components/ui/switch.tsx
var SwitchPrimitive = __toESM(require("@radix-ui/react-switch"));
var import_jsx_runtime21 = require("react/jsx-runtime");
function Switch(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
    SwitchPrimitive.Root,
    __spreadProps(__spreadValues({
      "data-slot": "switch",
      className: cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )
    }, props), {
      children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
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
var SelectPrimitive = __toESM(require("@radix-ui/react-select"));
var import_lucide_react9 = require("lucide-react");
var import_jsx_runtime22 = require("react/jsx-runtime");
function Select(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(SelectPrimitive.Root, __spreadValues({ "data-slot": "select" }, props));
}
function SelectValue(_a) {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(SelectPrimitive.Value, __spreadValues({ "data-slot": "select-value" }, props));
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
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(
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
        /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(import_lucide_react9.ChevronDownIcon, { className: "size-4 opacity-50" }) })
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
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(SelectPrimitive.Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(
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
        /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(SelectScrollUpButton, {}),
        /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
          SelectPrimitive.Viewport,
          {
            className: cn(
              "p-1",
              position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
            ),
            children
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(SelectScrollDownButton, {})
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
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(
    SelectPrimitive.Item,
    __spreadProps(__spreadValues({
      "data-slot": "select-item",
      className: cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )
    }, props), {
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("span", { className: "absolute right-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(import_lucide_react9.CheckIcon, { className: "size-4" }) }) }),
        /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(SelectPrimitive.ItemText, { children })
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
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
    SelectPrimitive.ScrollUpButton,
    __spreadProps(__spreadValues({
      "data-slot": "select-scroll-up-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )
    }, props), {
      children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(import_lucide_react9.ChevronUpIcon, { className: "size-4" })
    })
  );
}
function SelectScrollDownButton(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
    SelectPrimitive.ScrollDownButton,
    __spreadProps(__spreadValues({
      "data-slot": "select-scroll-down-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )
    }, props), {
      children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(import_lucide_react9.ChevronDownIcon, { className: "size-4" })
    })
  );
}

// src/components/ui/tabs.tsx
var TabsPrimitive = __toESM(require("@radix-ui/react-tabs"));
var import_jsx_runtime23 = require("react/jsx-runtime");
function Tabs(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
    TabsPrimitive.Content,
    __spreadValues({
      "data-slot": "tabs-content",
      className: cn("flex-1 outline-none", className)
    }, props)
  );
}

// src/components/ui/input.tsx
var import_jsx_runtime24 = require("react/jsx-runtime");
function Input(_a) {
  var _b = _a, { className, type } = _b, props = __objRest(_b, ["className", "type"]);
  return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
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
var LabelPrimitive = __toESM(require("@radix-ui/react-label"));
var import_jsx_runtime25 = require("react/jsx-runtime");
function Label3(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
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
var React11 = __toESM(require("react"));
var import_jsx_runtime26 = require("react/jsx-runtime");
var Separator3 = React11.forwardRef(
  (_a, ref) => {
    var _b = _a, { className, orientation = "horizontal" } = _b, props = __objRest(_b, ["className", "orientation"]);
    return /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
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
Separator3.displayName = "Separator";

// src/components/config/player-config-panel.tsx
var import_lucide_react10 = require("lucide-react");
var import_jsx_runtime27 = require("react/jsx-runtime");
var PlayerConfigPanel = () => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u;
  const { config, updateConfig, resetConfig, saveConfig, loadSavedConfig, getSavedConfigs } = usePlayerConfig();
  const { presets, loadPreset } = usePlayerPresets();
  const [saveConfigName, setSaveConfigName] = (0, import_react11.useState)("");
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
  const handleThemeChange = (property, value) => {
    updateConfig({
      theme: __spreadProps(__spreadValues({}, config.theme), {
        [property]: value
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
  return /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(Card, { className: "w-full max-w-4xl mx-auto", children: [
    /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(CardHeader, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(CardTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(import_lucide_react10.Settings, { className: "h-5 w-5" }),
        "Video Player Configuration"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "flex gap-2 flex-wrap", children: [
        /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(Select, { onValueChange: loadPreset, children: [
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(SelectTrigger, { className: "w-48", children: /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(SelectValue, { placeholder: "Load Preset" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(SelectContent, { children: presets.map((preset) => /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(SelectItem, { value: preset, children: preset.charAt(0).toUpperCase() + preset.slice(1) }, preset)) })
        ] }),
        savedConfigs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(Select, { onValueChange: loadSavedConfig, children: [
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(SelectTrigger, { className: "w-48", children: /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(SelectValue, { placeholder: "Load Saved Config" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(SelectContent, { children: savedConfigs.map((name) => /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(SelectItem, { value: name, children: name }, name)) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(Button, { variant: "outline", onClick: resetConfig, children: [
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(import_lucide_react10.RotateCcw, { className: "h-4 w-4 mr-2" }),
          "Reset"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(Tabs, { defaultValue: "controls", className: "w-full", children: [
      /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(TabsList, { className: "grid w-full grid-cols-5", children: [
        /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(TabsTrigger, { value: "controls", children: "Controls" }),
        /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(TabsTrigger, { value: "theme", children: "Theme" }),
        /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(TabsTrigger, { value: "behavior", children: "Behavior" }),
        /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(TabsTrigger, { value: "gestures", children: "Gestures" }),
        /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(TabsTrigger, { value: "save", children: "Save" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(TabsContent, { value: "controls", className: "space-y-6", children: [
        /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("h3", { className: "text-lg font-medium mb-4", children: "Control Visibility" }),
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4", children: Object.entries({
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
          }).map(([key, label]) => {
            var _a2, _b2, _c2;
            return /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
                Switch,
                {
                  id: key,
                  checked: (_c2 = (_b2 = (_a2 = config.controls) == null ? void 0 : _a2.visibility) == null ? void 0 : _b2[key]) != null ? _c2 : true,
                  onCheckedChange: (checked) => handleControlVisibilityChange(key, checked)
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(Label3, { htmlFor: key, className: "text-sm", children: label })
            ] }, key);
          }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(Separator3, {}),
        /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("h3", { className: "text-lg font-medium mb-4", children: "Control Style" }),
          /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(Label3, { htmlFor: "style", children: "Style" }),
              /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(
                Select,
                {
                  value: ((_a = config.controls) == null ? void 0 : _a.style) || "youtube",
                  onValueChange: (value) => updateConfig({
                    controls: __spreadProps(__spreadValues({}, config.controls), { style: value })
                  }),
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(SelectValue, {}) }),
                    /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(SelectContent, { children: [
                      /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(SelectItem, { value: "youtube", children: "YouTube" }),
                      /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(SelectItem, { value: "vimeo", children: "Vimeo" }),
                      /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(SelectItem, { value: "netflix", children: "Netflix" }),
                      /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(SelectItem, { value: "minimal", children: "Minimal" })
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(Label3, { htmlFor: "size", children: "Size" }),
              /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(
                Select,
                {
                  value: ((_b = config.controls) == null ? void 0 : _b.size) || "medium",
                  onValueChange: (value) => updateConfig({
                    controls: __spreadProps(__spreadValues({}, config.controls), { size: value })
                  }),
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(SelectValue, {}) }),
                    /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(SelectContent, { children: [
                      /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(SelectItem, { value: "small", children: "Small" }),
                      /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(SelectItem, { value: "medium", children: "Medium" }),
                      /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(SelectItem, { value: "large", children: "Large" })
                    ] })
                  ]
                }
              )
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(TabsContent, { value: "theme", className: "space-y-6", children: /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("h3", { className: "text-lg font-medium mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(import_lucide_react10.Palette, { className: "h-5 w-5" }),
          "Color Theme"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("div", { className: "grid grid-cols-2 gap-4", children: Object.entries({
          primary: "Primary Color",
          secondary: "Secondary Color",
          accent: "Accent Color",
          progressColor: "Progress Color",
          bufferColor: "Buffer Color"
        }).map(([key, label]) => {
          var _a2;
          return /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(Label3, { htmlFor: key, children: label }),
            /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
              Input,
              {
                id: key,
                type: "color",
                value: ((_a2 = config.theme) == null ? void 0 : _a2[key]) || "#3b82f6",
                onChange: (e) => handleThemeChange(key, e.target.value),
                className: "h-10"
              }
            )
          ] }, key);
        }) })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(TabsContent, { value: "behavior", className: "space-y-6", children: /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("h3", { className: "text-lg font-medium mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(import_lucide_react10.Zap, { className: "h-5 w-5" }),
          "Auto Behaviors"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "space-y-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
              Switch,
              {
                id: "autoPlay",
                checked: (_d = (_c = config.auto) == null ? void 0 : _c.autoPlay) != null ? _d : false,
                onCheckedChange: (checked) => handleAutoChange("autoPlay", checked)
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(Label3, { htmlFor: "autoPlay", children: "Auto Play" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
              Switch,
              {
                id: "autoHideControls",
                checked: (_f = (_e = config.auto) == null ? void 0 : _e.autoHideControls) != null ? _f : true,
                onCheckedChange: (checked) => handleAutoChange("autoHideControls", checked)
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(Label3, { htmlFor: "autoHideControls", children: "Auto Hide Controls" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
              Switch,
              {
                id: "rememberVolume",
                checked: (_h = (_g = config.auto) == null ? void 0 : _g.rememberVolume) != null ? _h : true,
                onCheckedChange: (checked) => handleAutoChange("rememberVolume", checked)
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(Label3, { htmlFor: "rememberVolume", children: "Remember Volume" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
              Switch,
              {
                id: "rememberPlaybackRate",
                checked: (_j = (_i = config.auto) == null ? void 0 : _i.rememberPlaybackRate) != null ? _j : true,
                onCheckedChange: (checked) => handleAutoChange("rememberPlaybackRate", checked)
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(Label3, { htmlFor: "rememberPlaybackRate", children: "Remember Playback Rate" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(Label3, { htmlFor: "autoHideDelay", children: "Auto Hide Delay (ms)" }),
            /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
              Input,
              {
                id: "autoHideDelay",
                type: "number",
                value: ((_k = config.auto) == null ? void 0 : _k.autoHideDelay) || 3e3,
                onChange: (e) => handleAutoChange("autoHideDelay", parseInt(e.target.value)),
                min: "1000",
                max: "10000",
                step: "500"
              }
            )
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(TabsContent, { value: "gestures", className: "space-y-6", children: [
        /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("h3", { className: "text-lg font-medium mb-4 flex items-center gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(import_lucide_react10.Smartphone, { className: "h-5 w-5" }),
            "Touch Gestures"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "space-y-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
                Switch,
                {
                  id: "gesturesEnabled",
                  checked: (_m = (_l = config.gestures) == null ? void 0 : _l.enabled) != null ? _m : true,
                  onCheckedChange: (checked) => handleGestureChange("enabled", checked)
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(Label3, { htmlFor: "gesturesEnabled", children: "Enable Gestures" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
                Switch,
                {
                  id: "tapToPlay",
                  checked: (_o = (_n = config.gestures) == null ? void 0 : _n.tapToPlay) != null ? _o : true,
                  onCheckedChange: (checked) => handleGestureChange("tapToPlay", checked)
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(Label3, { htmlFor: "tapToPlay", children: "Tap to Play/Pause" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
                Switch,
                {
                  id: "doubleTapSeek",
                  checked: (_q = (_p = config.gestures) == null ? void 0 : _p.doubleTapSeek) != null ? _q : true,
                  onCheckedChange: (checked) => handleGestureChange("doubleTapSeek", checked)
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(Label3, { htmlFor: "doubleTapSeek", children: "Double Tap to Seek" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
                Switch,
                {
                  id: "swipeVolume",
                  checked: (_s = (_r = config.gestures) == null ? void 0 : _r.swipeVolume) != null ? _s : false,
                  onCheckedChange: (checked) => handleGestureChange("swipeVolume", checked)
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(Label3, { htmlFor: "swipeVolume", children: "Swipe for Volume" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(Separator3, {}),
        /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("h3", { className: "text-lg font-medium mb-4 flex items-center gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(import_lucide_react10.Keyboard, { className: "h-5 w-5" }),
            "Keyboard Shortcuts"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
              Switch,
              {
                id: "keyboardEnabled",
                checked: (_u = (_t = config.keyboard) == null ? void 0 : _t.enabled) != null ? _u : true,
                onCheckedChange: (checked) => updateConfig({
                  keyboard: __spreadProps(__spreadValues({}, config.keyboard), { enabled: checked })
                })
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(Label3, { htmlFor: "keyboardEnabled", children: "Enable Keyboard Shortcuts" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(TabsContent, { value: "save", className: "space-y-6", children: [
        /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("h3", { className: "text-lg font-medium mb-4 flex items-center gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(import_lucide_react10.Save, { className: "h-5 w-5" }),
            "Save Configuration"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
              Input,
              {
                placeholder: "Configuration name...",
                value: saveConfigName,
                onChange: (e) => setSaveConfigName(e.target.value)
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
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
        /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(Separator3, {}),
        /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("h3", { className: "text-lg font-medium mb-4", children: "Quick Presets" }),
          /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-2", children: presets.map((preset) => /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
            Button,
            {
              variant: "outline",
              onClick: () => loadPreset(preset),
              className: "justify-start",
              children: /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(Badge, { variant: "secondary", className: "mr-2", children: preset })
            },
            preset
          )) })
        ] })
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
      console.warn("Failed to send analytics event:", error);
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
var VERSION = "1.0.0";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
  createEmeController,
  createTokenLicenseRequestHandler,
  defaultStreamingAdapters,
  getBrowserCapabilities,
  getStreamingStrategy,
  isEmeSupported,
  mergePlayerConfig,
  usePlayerConfig,
  usePlayerPresets,
  useVideoGestures,
  useVideoPlayer
});
//# sourceMappingURL=index.js.map