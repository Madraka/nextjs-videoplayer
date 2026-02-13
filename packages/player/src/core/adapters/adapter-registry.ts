import type { AdapterSelectionContext, StreamingAdapterFactory } from '@/core/adapters/types';

export class AdapterRegistry {
  private readonly factories: StreamingAdapterFactory[] = [];

  register(factory: StreamingAdapterFactory): void {
    const existingIndex = this.factories.findIndex((candidate) => candidate.id === factory.id);
    if (existingIndex >= 0) {
      this.factories.splice(existingIndex, 1);
    }

    this.factories.push(factory);
    this.factories.sort((a, b) => b.priority - a.priority);
  }

  resolve(context: AdapterSelectionContext): StreamingAdapterFactory | undefined {
    return this.factories.find((factory) => factory.canHandle(context));
  }

  list(): readonly StreamingAdapterFactory[] {
    return this.factories;
  }
}
