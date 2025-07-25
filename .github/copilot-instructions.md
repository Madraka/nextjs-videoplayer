# Copilot Instructions for Next.js 15 Video Player

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a Next.js 15 video player project with modern streaming capabilities, built with:
- **Next.js 15 App Router** with TypeScript
- **ShadCN UI + Tailwind CSS** for components
- **HLS.js & Dash.js** for adaptive streaming
- **Mobile-first design** with touch gesture support
- **Plugin architecture** for extensibility

## Architecture Guidelines

### Core Components
- Use **ShadCN UI components** for all UI elements
- Follow **mobile-first responsive design**
- Implement **TypeScript strict mode**
- Use **App Router** patterns (app directory)

### Video Streaming
- Detect **native HLS support** vs **HLS.js** requirement
- Handle **browser compatibility** gracefully
- Support **adaptive bitrate streaming**
- Implement **autoplay policy compliance**

### Code Style
- Use **functional components** with hooks
- Implement **proper error boundaries**
- Follow **accessibility standards**
- Use **Tailwind CSS** utility classes
- Keep components **modular and reusable**

### File Organization
```
/src
  /app              # Next.js App Router
  /components
    /player         # Core video player UI
    /controls       # Player control elements
    /plugins        # Plugin UI components
    /ui             # ShadCN UI components
  /core             # Video engine & adapters
  /hooks            # Custom React hooks
  /lib              # Utilities & helpers
  /plugins          # Plugin logic
  /themes           # Theme configurations
```

### Development Practices
- Always handle **loading states**
- Implement **error handling**
- Use **progressive enhancement**
- Test on **multiple devices/browsers**
- Optimize for **performance**
- Follow **SEO best practices**
