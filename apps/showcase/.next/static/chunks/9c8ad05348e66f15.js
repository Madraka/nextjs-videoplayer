(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,51131,e=>{"use strict";var s=e.i(76809),r=e.i(65773),i=e.i(73946),a=e.i(56530),o=e.i(1888),t=e.i(66751),l=e.i(78471);function n({className:e,...r}){return(0,s.jsx)(t.Root,{"data-slot":"tabs",className:(0,l.cn)("flex flex-col gap-2",e),...r})}function c({className:e,...r}){return(0,s.jsx)(t.List,{"data-slot":"tabs-list",className:(0,l.cn)("bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",e),...r})}function d({className:e,...r}){return(0,s.jsx)(t.Trigger,{"data-slot":"tabs-trigger",className:(0,l.cn)("data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",e),...r})}function u({className:e,...r}){return(0,s.jsx)(t.Content,{"data-slot":"tabs-content",className:(0,l.cn)("flex-1 outline-none",e),...r})}var p=e.i(13949);let m=(0,e.i(3645).default)("code",[["path",{d:"m16 18 6-6-6-6",key:"eg8j8"}],["path",{d:"m8 6-6 6 6 6",key:"ppft3o"}]]);var g=e.i(24042),f=e.i(39200),h=e.i(62089),y=e.i(10129);let x=[{id:"demo",name:"Demo Video (MP4)",src:"https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",poster:"https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",description:"High quality MP4 demo video"},{id:"hls",name:"HLS Stream",src:"https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8",description:"Adaptive HLS streaming example"}],v=({title:e,description:o,config:t,code:l,icon:n})=>{let[c,d]=(0,r.useState)(!1),u=x[0];return(0,s.jsxs)(i.Card,{className:"w-full",children:[(0,s.jsxs)(i.CardHeader,{children:[(0,s.jsxs)(i.CardTitle,{className:"flex items-center gap-2",children:[n,e]}),(0,s.jsx)(i.CardDescription,{children:o})]}),(0,s.jsxs)(i.CardContent,{className:"space-y-4",children:[(0,s.jsx)("div",{className:"aspect-video w-full",children:(0,s.jsx)(p.ConfigurableVideoPlayer,{src:u.src,poster:u.poster,configOverride:t,className:"rounded-lg overflow-hidden"})}),(0,s.jsx)("div",{className:"flex gap-2",children:(0,s.jsxs)(a.Button,{variant:"outline",size:"sm",onClick:()=>d(!c),children:[(0,s.jsx)(m,{className:"h-4 w-4 mr-2"}),c?"Hide Code":"Show Code"]})}),c&&(0,s.jsx)("pre",{className:"bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-sm overflow-x-auto",children:(0,s.jsx)("code",{children:l})})]})]})};function b(){let e=[{title:"YouTube Style (Default)",description:"Full-featured player with all YouTube-like controls",icon:(0,s.jsx)(g.Play,{className:"h-5 w-5"}),config:p.PlayerPresets.youtube,code:`import { ConfigurableVideoPlayer, PlayerPresets } from '@madraka/nextjs-videoplayer';

// YouTube-style player with all features
<ConfigurableVideoPlayer
  src="your-video.mp4"
  configOverride={PlayerPresets.youtube}
/>`},{title:"Minimal Player",description:"Simple player with only essential controls",icon:(0,s.jsx)(f.Settings,{className:"h-5 w-5"}),config:p.PlayerPresets.minimal,code:`// Minimal player with basic controls only
<ConfigurableVideoPlayer
  src="your-video.mp4"
  configOverride={PlayerPresets.minimal}
/>`},{title:"Background Video",description:"No controls, auto-play for background videos",icon:(0,s.jsx)(h.Palette,{className:"h-5 w-5"}),config:p.PlayerPresets.background,code:`// Background video with no controls
<ConfigurableVideoPlayer
  src="your-video.mp4"
  configOverride={PlayerPresets.background}
/>`},{title:"Mobile Optimized",description:"Optimized for mobile devices with touch gestures",icon:(0,s.jsx)(y.Smartphone,{className:"h-5 w-5"}),config:p.PlayerPresets.mobile,code:`// Mobile-optimized player
<ConfigurableVideoPlayer
  src="your-video.mp4"
  configOverride={PlayerPresets.mobile}
/>`},{title:"Play Button Only",description:"Only play/pause button, no other controls",icon:(0,s.jsx)(g.Play,{className:"h-5 w-5"}),config:p.PlayerPresets.playOnly,code:`// Only play/pause button visible
<ConfigurableVideoPlayer
  src="your-video.mp4"
  configOverride={PlayerPresets.playOnly}
/>`},{title:"Custom Configuration",description:"Custom color theme and specific controls",icon:(0,s.jsx)(f.Settings,{className:"h-5 w-5"}),config:{theme:{primary:"#ff6b6b",progressColor:"#ff6b6b",accent:"#4ecdc4"},controls:{visibility:{playPause:!0,progress:!0,volume:!0,fullscreen:!0,theaterMode:!1,pictureInPicture:!1,quality:!1,playbackRate:!1}},auto:{autoHideControls:!1}},code:`// Custom themed player
<ConfigurableVideoPlayer
  src="your-video.mp4"
  configOverride={{
    theme: {
      primary: '#ff6b6b',
      progressColor: '#ff6b6b',
      accent: '#4ecdc4',
    },
    controls: {
      visibility: {
        playPause: true,
        progress: true,
        volume: true,
        fullscreen: true,
        // Hide advanced controls
        theaterMode: false,
        pictureInPicture: false,
        quality: false,
        playbackRate: false,
      },
    },
    auto: {
      autoHideControls: false, // Always show controls
    },
  }}
/>`}];return(0,s.jsx)(p.PlayerConfigProvider,{children:(0,s.jsxs)("div",{className:"container mx-auto py-8 px-4",children:[(0,s.jsxs)("div",{className:"mb-8",children:[(0,s.jsx)("h1",{className:"text-4xl font-bold mb-4",children:"Video Player Configuration Examples"}),(0,s.jsx)("p",{className:"text-lg text-muted-foreground",children:"Learn how to customize the video player for different use cases. Each example shows a different configuration preset and the corresponding code."})]}),(0,s.jsxs)(n,{defaultValue:"examples",className:"w-full",children:[(0,s.jsxs)(c,{className:"grid w-full grid-cols-2",children:[(0,s.jsx)(d,{value:"examples",children:"Configuration Examples"}),(0,s.jsx)(d,{value:"config-panel",children:"Live Configuration"})]}),(0,s.jsxs)(u,{value:"examples",className:"space-y-8",children:[(0,s.jsx)("div",{className:"grid gap-8",children:e.map((e,r)=>(0,s.jsx)(v,{...e},r))}),(0,s.jsxs)(i.Card,{className:"mt-12",children:[(0,s.jsxs)(i.CardHeader,{children:[(0,s.jsx)(i.CardTitle,{children:"How to Use Configuration"}),(0,s.jsx)(i.CardDescription,{children:"Step-by-step guide to implement configurable video players in your Next.js app"})]}),(0,s.jsxs)(i.CardContent,{className:"space-y-6",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("h3",{className:"text-lg font-medium mb-2",children:"1. Wrap your app with PlayerConfigProvider"}),(0,s.jsx)("pre",{className:"bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-sm overflow-x-auto",children:(0,s.jsx)("code",{children:`// app/layout.tsx or your root component
import { PlayerConfigProvider, PlayerPresets } from '@madraka/nextjs-videoplayer';

export default function RootLayout({ children }) {
  return (
    <PlayerConfigProvider defaultConfig={PlayerPresets.youtube}>
      {children}
    </PlayerConfigProvider>
  );
}`})})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("h3",{className:"text-lg font-medium mb-2",children:"2. Use ConfigurableVideoPlayer component"}),(0,s.jsx)("pre",{className:"bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-sm overflow-x-auto",children:(0,s.jsx)("code",{children:`// In your component
import { ConfigurableVideoPlayer } from '@madraka/nextjs-videoplayer';

function MyVideoComponent() {
  return (
    <ConfigurableVideoPlayer
      src="https://example.com/video.mp4"
      poster="https://example.com/poster.jpg"
      // Optional: Override global config for this instance
      configOverride={{
        controls: {
          visibility: {
            playbackRate: false, // Hide playback rate for this video
          },
        },
      }}
    />
  );
}`})})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("h3",{className:"text-lg font-medium mb-2",children:"3. Available Configuration Options"}),(0,s.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",children:["Control visibility (show/hide any button)","Custom themes and colors","Keyboard shortcuts configuration","Touch gesture settings","Auto-behaviors (autoplay, auto-hide)","Responsive breakpoints","Performance settings","Analytics tracking","Advanced features toggle"].map((e,r)=>(0,s.jsx)(o.Badge,{variant:"secondary",className:"p-2",children:e},r))})]})]})]})]}),(0,s.jsxs)(u,{value:"config-panel",children:[(0,s.jsx)(p.PlayerConfigPanel,{}),(0,s.jsxs)(i.Card,{className:"mt-8",children:[(0,s.jsxs)(i.CardHeader,{children:[(0,s.jsx)(i.CardTitle,{children:"Live Preview"}),(0,s.jsx)(i.CardDescription,{children:"The video below reflects your current configuration settings"})]}),(0,s.jsx)(i.CardContent,{children:(0,s.jsx)(p.ConfigurableVideoPlayer,{src:x[0].src,poster:x[0].poster,className:"aspect-video w-full rounded-lg overflow-hidden"})})]})]})]})]})})}e.s(["default",()=>b],51131)},43576,e=>{e.v(s=>Promise.all(["static/chunks/e9fe19719899fb39.js"].map(s=>e.l(s))).then(()=>s(20886)))},64184,e=>{e.v(s=>Promise.all(["static/chunks/be9c7c83086ef0d9.js"].map(s=>e.l(s))).then(()=>s(20860)))}]);