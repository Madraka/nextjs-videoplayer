import type { BrowserCapabilities } from '@/core/compatibility';

export interface AdapterSelectionContext {
  src: string;
  capabilities: BrowserCapabilities;
}

export interface AdapterLoadContext extends AdapterSelectionContext {
  videoElement: HTMLVideoElement;
  onQualityChange?: (quality: string) => void;
  signal?: AbortSignal;
}

export interface QualityLevel {
  id: string;
  label: string;
  height?: number;
}

export interface StreamingAdapter {
  readonly id: string;
  load(context: AdapterLoadContext): Promise<void>;
  destroy(): void;
  getQualityLevels(): QualityLevel[];
  setQuality(qualityId: string): void;
}

export interface StreamingAdapterFactory {
  readonly id: string;
  readonly priority: number;
  canHandle(context: AdapterSelectionContext): boolean;
  create(): StreamingAdapter;
}
