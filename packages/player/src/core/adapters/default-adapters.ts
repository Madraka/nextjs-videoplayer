import { createDashJsAdapter } from '@/core/adapters/dashjs-adapter';
import { createDirectVideoAdapter } from '@/core/adapters/direct-video-adapter';
import { createHlsJsAdapter } from '@/core/adapters/hlsjs-adapter';
import { createNativeHlsAdapter } from '@/core/adapters/native-hls-adapter';
import type { AdapterSelectionContext, StreamingAdapterFactory } from '@/core/adapters/types';

const getNormalizedPath = (src: string): string => {
  try {
    return new URL(src, 'https://localhost').pathname.toLowerCase();
  } catch {
    return src.toLowerCase();
  }
};

const isHls = (src: string) => /\.m3u8$/i.test(getNormalizedPath(src));
const isDash = (src: string) => /\.mpd$/i.test(getNormalizedPath(src));
const isDirect = (src: string) => /\.(mp4|webm|ogg|avi|mov)$/i.test(getNormalizedPath(src));

export const defaultStreamingAdapters: StreamingAdapterFactory[] = [
  {
    id: 'native',
    priority: 100,
    canHandle: ({ src, capabilities }: AdapterSelectionContext) => {
      return isHls(src) && capabilities.hasNativeHls && capabilities.isIOS;
    },
    create: createNativeHlsAdapter,
  },
  {
    id: 'hlsjs',
    priority: 90,
    canHandle: ({ src, capabilities }: AdapterSelectionContext) => {
      return isHls(src) && capabilities.hasHlsJs;
    },
    create: createHlsJsAdapter,
  },
  {
    id: 'dashjs',
    priority: 80,
    canHandle: ({ src, capabilities }: AdapterSelectionContext) => {
      return isDash(src) && capabilities.hasDashJs;
    },
    create: createDashJsAdapter,
  },
  {
    id: 'direct',
    priority: 70,
    canHandle: ({ src }: AdapterSelectionContext) => {
      return isDirect(src);
    },
    create: createDirectVideoAdapter,
  },
];
