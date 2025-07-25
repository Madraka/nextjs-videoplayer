# 🎬 NextJS Video Player

[![NPM Version](https://img.shields.io/npm/v/@madraka/nextjs-videoplayer.svg)](https://www.npmjs.com/package/@madraka/nextjs-videoplayer)
[![License](https://img.shields.io/npm/l/@madraka/nextjs-videoplayer.svg)](https://github.com/madraka/nextjs-videoplayer/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Demo](https://img.shields.io/badge/Demo-Live-brightgreen.svg)](https://nextjsvideoplayer.vercel.app/)

Modern, customizable video player for Next.js applications with adaptive streaming, mobile optimization, and advanced features.

## ✨ Features

- 🎯 **Next.js 13+ App Router Ready**
- 📱 **Mobile-First Design** with VK Player-inspired controls
- 🎬 **Adaptive Streaming** (HLS.js & Dash.js support)
- 🖼️ **Thumbnail Previews** with sprite sheet support
- 🎨 **Highly Customizable** with TypeScript configuration
- 👆 **Touch Gestures** optimized for mobile
- ⚡ **Performance Optimized** with lazy loading
- 🎪 **Multiple Presets** (YouTube, Netflix, Minimal, etc.)
- 📊 **Built-in Analytics** tracking
- ♿ **Accessibility** compliant

## 🚀 Quick Start

### Installation

```bash
# Using npm
npm install @madraka/nextjs-videoplayer

# Using pnpm  
pnpm add @madraka/nextjs-videoplayer

# Using yarn
yarn add @madraka/nextjs-videoplayer

# Install directly from GitHub
npm install github:Madraka/nextjs-videoplayer
```

### Basic Usage

```tsx
'use client';

import { ConfigurableVideoPlayer } from '@madraka/nextjs-videoplayer';

export default function MyVideoPage() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <ConfigurableVideoPlayer
        src="https://example.com/video.m3u8"
        poster="https://example.com/poster.jpg"
        aspectRatio="16/9"
      />
    </div>
  );
}
```

### With Configuration

```tsx
'use client';

import { 
  ConfigurableVideoPlayer,
  PlayerConfigProvider,
  PlayerPresets 
} from '@madraka/nextjs-videoplayer';

export default function AdvancedVideoPage() {
  return (
    <PlayerConfigProvider config={PlayerPresets.youtube}>
      <ConfigurableVideoPlayer
        src="https://example.com/video.m3u8"
        thumbnailUrl="https://example.com/thumbnails/"
        aspectRatio="16/9"
        autoPlay={false}
        muted={false}
        onPlay={() => console.log('Video started playing')}
        onPause={() => console.log('Video paused')}
      />
    </PlayerConfigProvider>
  );
}
```

## 📚 Documentation

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | - | Video source URL (HLS, DASH, MP4) |
| `poster` | `string` | - | Poster image URL |
| `thumbnailUrl` | `string` | - | Base URL for thumbnail previews |
| `aspectRatio` | `'auto' \| '16/9' \| '4/3' \| '1/1' \| '9/16'` | `'auto'` | Video aspect ratio |
| `autoPlay` | `boolean` | `false` | Auto-play video |
| `muted` | `boolean` | `false` | Start muted |
| `loop` | `boolean` | `false` | Loop video |
| `playsInline` | `boolean` | `true` | Plays inline on mobile |

### Event Callbacks

```tsx
<ConfigurableVideoPlayer
  src="video.m3u8"
  onReady={() => console.log('Player ready')}
  onPlay={() => console.log('Playing')}
  onPause={() => console.log('Paused')}
  onError={(error) => console.error('Error:', error)}
  onTimeUpdate={(currentTime, duration) => {
    console.log(`${currentTime}s / ${duration}s`);
  }}
/>
```

### Presets

Choose from pre-configured player styles:

```tsx
import { PlayerPresets } from '@madraka/nextjs-videoplayer';

// YouTube-style player
<PlayerConfigProvider config={PlayerPresets.youtube}>

// Netflix-style player  
<PlayerConfigProvider config={PlayerPresets.netflix}>

// Minimal controls
<PlayerConfigProvider config={PlayerPresets.minimal}>

// Mobile-optimized
<PlayerConfigProvider config={PlayerPresets.mobile}>

// No controls (background video)
<PlayerConfigProvider config={PlayerPresets.background}>
```

## 🎨 Styling

### With Tailwind CSS

The player works seamlessly with Tailwind CSS:

```tsx
<ConfigurableVideoPlayer
  src="video.m3u8"
  className="rounded-lg shadow-xl"
  aspectRatio="16/9"
/>
```

## 📱 Mobile Optimization

The player automatically detects mobile devices and provides:

- Touch-optimized controls
- Gesture support (tap, double-tap, swipe)
- Auto-hide controls
- Responsive layout
- Mobile-first design

## 🔧 Advanced Features

### Analytics

```tsx
const analyticsConfig = {
  analytics: {
    enabled: true,
    trackPlay: true,
    trackPause: true,
    trackSeek: true,
    trackQualityChange: true
  }
};
```

### Keyboard Shortcuts

- `Space` - Play/Pause
- `F` - Fullscreen
- `M` - Mute/Unmute
- `←/→` - Seek backward/forward
- `↑/↓` - Volume up/down

### Thumbnail Previews

```tsx
<ConfigurableVideoPlayer
  src="video.m3u8"
  thumbnailUrl="https://cdn.example.com/thumbnails/"
  // Expects thumbnails at: thumbnailUrl + "sprite.jpg"
  // And thumbnails.vtt for timing information
/>
```

## 🔧 Configuration Options NextJS Video Player

[![NPM Version](https://img.shields.io/npm/v/@madraka/nextjs-videoplayer.svg)](https://www.npmjs.com/package/@madraka/nextjs-videoplayer)
[![License](https://img.shields.io/npm/l/@madraka/nextjs-videoplayer.svg)](https://github.com/madraka/n## � Configuration Options

### Player Configuration

Create custom configurations for different use cases:

```tsx
import { PlayerConfig } from '@madraka/nextjs-videoplayer';

const customConfig: PlayerConfig = {
  theme: {
    primaryColor: '#3b82f6',
    backgroundColor: '#000000',
    controlsOpacity: 0.8,
  },
  controls: {
    showPlayButton: true,
    showVolumeControl: true,
    showProgressBar: true,
    showFullscreenButton: true,
    showSettingsButton: true,
    autoHide: true,
    autoHideDelay: 3000,
  },
  playback: {
    autoPlay: false,
    muted: false,
    loop: false,
    playsInline: true,
    preload: 'metadata',
  },
  gestures: {
    enabled: true,
    doubleTapToSeek: true,
    swipeToSeek: true,
    pinchToZoom: false,
  },
  analytics: {
    enabled: true,
    trackPlay: true,
    trackPause: true,
    trackSeek: true,
    trackQualityChange: true,
  }
};

<PlayerConfigProvider config={customConfig}>
  <ConfigurableVideoPlayer src="video.m3u8" />
</PlayerConfigProvider>
```

### Video Formats Support

The player automatically detects and handles multiple video formats:

- **HLS (.m3u8)** - HTTP Live Streaming for adaptive bitrate
- **DASH (.mpd)** - Dynamic Adaptive Streaming over HTTP  
- **MP4** - Standard progressive download
- **WebM** - Modern web video format
- **MOV** - QuickTime format

```tsx
// HLS Stream
<ConfigurableVideoPlayer src="https://example.com/stream.m3u8" />

// DASH Stream  
<ConfigurableVideoPlayer src="https://example.com/stream.mpd" />

// Progressive MP4
<ConfigurableVideoPlayer src="https://example.com/video.mp4" />

// Multiple sources with fallback
<ConfigurableVideoPlayer 
  src={[
    { src: "video.m3u8", type: "application/x-mpegURL" },
    { src: "video.mp4", type: "video/mp4" }
  ]} 
/>
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by VK Player for mobile UX
- Built with [HLS.js](https://github.com/video-dev/hls.js/) and [Dash.js](https://github.com/Dash-Industry-Forum/dash.js/)
- UI components by [Radix UI](https://www.radix-ui.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

Made with ❤️ for the Next.js communityblob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

Modern, customizable video player for Next.js applications with adaptive streaming, mobile optimization, and advanced features.

## ✨ Features

- 🎯 **Next.js 13+ App Router Ready**
- 📱 **Mobile-First Design** with VK Player-inspired controls
- 🎬 **Adaptive Streaming** (HLS.js & Dash.js support)
- 🖼️ **Thumbnail Previews** with sprite sheet support
- 🎨 **Highly Customizable** with TypeScript configuration
- 👆 **Touch Gestures** optimized for mobile
- ⚡ **Performance Optimized** with lazy loading
- 🎪 **Multiple Presets** (YouTube, Netflix, Minimal, etc.)
- 📊 **Built-in Analytics** tracking
- ♿ **Accessibility** compliant

## 🚀 Quick Start

### Installation

```bash
# Using npm
npm install @madraka/nextjs-videoplayer

# Using pnpm  
pnpm add @madraka/nextjs-videoplayer

# Using yarn
yarn add @madraka/nextjs-videoplayer

# Install directly from GitHub
npm install github:Madraka/nextjs-videoplayer

# Using pnpm for GitHub installation  
pnpm add github:Madraka/nextjs-videoplayer

# Using yarn for GitHub installation
yarn add github:Madraka/nextjs-videoplayer
```

### Basic Usage

```tsx
'use client';

import { ConfigurableVideoPlayer } from '@madraka/nextjs-videoplayer';

export default function MyVideoPage() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <ConfigurableVideoPlayer
        src="https://example.com/video.m3u8"
        poster="https://example.com/poster.jpg"
        aspectRatio="16/9"
      />
    </div>
  );
}
```

### With Configuration

```tsx
'use client';

import { 
  ConfigurableVideoPlayer,
  PlayerConfigProvider,
  PlayerPresets 
} from '@madraka/nextjs-videoplayer';

export default function AdvancedVideoPage() {
  return (
    <PlayerConfigProvider config={PlayerPresets.youtube}>
      <ConfigurableVideoPlayer
        src="https://example.com/video.m3u8"
        thumbnailUrl="https://example.com/thumbnails/"
        aspectRatio="16/9"
        autoPlay={false}
        muted={false}
        onPlay={() => console.log('Video started playing')}
        onPause={() => console.log('Video paused')}
      />
    </PlayerConfigProvider>
  );
}
```

## � Documentation

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | - | Video source URL (HLS, DASH, MP4) |
| `poster` | `string` | - | Poster image URL |
| `thumbnailUrl` | `string` | - | Base URL for thumbnail previews |
| `aspectRatio` | `'auto' \| '16/9' \| '4/3' \| '1/1' \| '9/16'` | `'auto'` | Video aspect ratio |
| `autoPlay` | `boolean` | `false` | Auto-play video |
| `muted` | `boolean` | `false` | Start muted |
| `loop` | `boolean` | `false` | Loop video |
| `playsInline` | `boolean` | `true` | Plays inline on mobile |

### Event Callbacks

```tsx
<ConfigurableVideoPlayer
  src="video.m3u8"
  onReady={() => console.log('Player ready')}
  onPlay={() => console.log('Playing')}
  onPause={() => console.log('Paused')}
  onError={(error) => console.error('Error:', error)}
  onTimeUpdate={(currentTime, duration) => {
    console.log(`${currentTime}s / ${duration}s`);
  }}
/>
```

### Presets

Choose from pre-configured player styles:

```tsx
import { PlayerPresets } from '@madraka/nextjs-videoplayer';

// YouTube-style player
<PlayerConfigProvider config={PlayerPresets.youtube}>

// Netflix-style player  
<PlayerConfigProvider config={PlayerPresets.netflix}>

// Minimal controls
<PlayerConfigProvider config={PlayerPresets.minimal}>

// Mobile-optimized
<PlayerConfigProvider config={PlayerPresets.mobile}>

// No controls (background video)
<PlayerConfigProvider config={PlayerPresets.background}>
```

## � Styling

### With Tailwind CSS

The player works seamlessly with Tailwind CSS:

```tsx
<ConfigurableVideoPlayer
  src="video.m3u8"
  className="rounded-lg shadow-xl"
  aspectRatio="16/9"
/>
```

## 📱 Mobile Optimization

The player automatically detects mobile devices and provides:

- Touch-optimized controls
- Gesture support (tap, double-tap, swipe)
- Auto-hide controls
- Responsive layout
- Mobile-first design

## � Advanced Features

### Analytics

```tsx
const analyticsConfig = {
  analytics: {
    enabled: true,
    trackPlay: true,
    trackPause: true,
    trackSeek: true,
    trackQualityChange: true
  }
};
```

### Keyboard Shortcuts

- `Space` - Play/Pause
- `F` - Fullscreen
- `M` - Mute/Unmute
- `←/→` - Seek backward/forward
- `↑/↓` - Volume up/down

### Thumbnail Previews

```tsx
<ConfigurableVideoPlayer
  src="video.m3u8"
  thumbnailUrl="https://cdn.example.com/thumbnails/"
  // Expects thumbnails at: thumbnailUrl + "sprite.jpg"
  // And thumbnails.vtt for timing information
/>
```

## 🛠️ Development

```bash
# Clone the repository
git clone https://github.com/madraka/nextjs-videoplayer.git

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build package
pnpm build:package
```

### 🚀 Release Process

```bash
# Patch version (1.0.0 → 1.0.1)
pnpm version:patch

# Minor version (1.0.0 → 1.1.0)  
pnpm version:minor

# Major version (1.0.0 → 2.0.0)
pnpm version:major

# Push changes and trigger CI/CD
git push --follow-tags
```

### 📦 GitHub Installation

```bash
# Latest from main branch
npm install github:Madraka/nextjs-videoplayer

# Specific version/tag
npm install github:Madraka/nextjs-videoplayer#v1.0.0

# In package.json
{
  "dependencies": {
    "@madraka/nextjs-videoplayer": "github:Madraka/nextjs-videoplayer#v1.0.0"
  }
}
```

## 📦 Package Structure

```
@madraka/nextjs-videoplayer/
├── dist/                 # Built package
├── src/
│   ├── components/       # React components
│   ├── hooks/           # Custom hooks  
│   ├── core/            # Video engine
│   ├── types/           # TypeScript types
│   └── lib/             # Utilities
├── README.md
└── package.json
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## � License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by VK Player for mobile UX
- Built with [HLS.js](https://github.com/video-dev/hls.js/) and [Dash.js](https://github.com/Dash-Industry-Forum/dash.js/)
- UI components by [Radix UI](https://www.radix-ui.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

Made with ❤️ for the Next.js community
