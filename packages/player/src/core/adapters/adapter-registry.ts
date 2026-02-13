import type { AdapterSelectionContext, StreamingAdapterFactory } from '@/core/adapters/types';

export class AdapterRegistry {
  private readonly factories: StreamingAdapterFactory[] = [];

  register(factory: StreamingAdapterFactory): void {
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
