import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PlayerLoggerBootstrap from "./player-logger-bootstrap";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NextJS Video Player - Modern HLS/DASH Streaming Component",
  description: "Modern, customizable video player for Next.js with HLS/DASH support, mobile optimization, gesture controls, and advanced streaming features. Perfect for video streaming applications.",
  keywords: [
    "nextjs video player",
    "react video player", 
    "hls streaming",
    "dash streaming",
    "mobile video player",
    "video component",
    "streaming player",
    "typescript video player",
    "tailwindcss video player",
    "adaptive bitrate streaming"
  ],
  authors: [{ name: "Madraka", url: "https://github.com/madraka" }],
  creator: "Madraka",
  publisher: "Madraka",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nextjsvideoplayer.vercel.app",
    title: "NextJS Video Player - Modern HLS/DASH Streaming Component",
    description: "Modern, customizable video player for Next.js with HLS/DASH support, mobile optimization, and advanced streaming features.",
    siteName: "NextJS Video Player",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Next.js Video Player Demo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NextJS Video Player - Modern HLS/DASH Streaming Component",
    description: "Modern, customizable video player for Next.js with HLS/DASH support, mobile optimization, and advanced streaming features.",
    images: ["/og-image.png"],
    creator: "@madraka",
  },
  verification: {
    google: "your-google-verification-code", // Google Search Console doğrulama kodu
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Video Player" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "NextJS Video Player",
              "description": "Modern, customizable video player for Next.js with HLS/DASH support, mobile optimization, and advanced streaming features",
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "Web Browser",
              "author": {
                "@type": "Person",
                "name": "Madraka",
                "url": "https://github.com/madraka"
              },
              "programmingLanguage": ["TypeScript", "React", "Next.js"],
              "license": "https://opensource.org/licenses/MIT",
              "downloadUrl": "https://www.npmjs.com/package/@madraka/nextjs-videoplayer",
              "codeRepository": "https://github.com/madraka/nextjs-videoplayer",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "HLS/DASH Streaming Support",
                "Mobile Gesture Controls", 
                "Adaptive Bitrate Streaming",
                "TypeScript Support",
                "Tailwind CSS Styling",
                "Plugin Architecture",
                "Live Streaming Support"
              ]
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PlayerLoggerBootstrap />
        {children}
      </body>
    </html>
  );
}
