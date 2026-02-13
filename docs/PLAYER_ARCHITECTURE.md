# Player Architecture

## Objective

Provide a stable core for enterprise use cases where playback transport logic and product-specific behavior evolve independently.

## Layers

1. `VideoEngine`
- Owns media element lifecycle.
- Detects capabilities.
- Selects and executes streaming adapter.
- Emits typed lifecycle hooks to plugins.

2. Adapter Layer (`src/core/adapters`)
- `StreamingAdapterFactory`: source matching + priority.
- `StreamingAdapter`: runtime implementation contract.
- `AdapterRegistry`: deterministic adapter selection.
- Built-ins: `native`, `hlsjs`, `dashjs`, `direct`.

3. Plugin Layer (`src/core/plugins`)
- `VideoEnginePlugin`: typed lifecycle hooks.
- `VideoEnginePluginManager`: safe plugin isolation (one plugin failure does not crash engine).
- Hook coverage:
  - `setup`, `onInit`
  - `onSourceLoadStart`, `onSourceLoaded`
  - `onPlay`, `onPause`, `onTimeUpdate`, `onVolumeChange`, `onQualityChange`
  - `onError`, `onDispose`

## Runtime Flow

1. `VideoEngine.initialize()` resolves browser capabilities.
2. `loadSource()` queries `AdapterRegistry` with source + capabilities.
3. Highest-priority compatible adapter is instantiated and loaded.
4. Plugin manager receives lifecycle events before/after load and during playback.
5. On source change or disposal, active adapter is destroyed and plugins are notified.

## Extension Points

1. Add custom adapter
- Implement `StreamingAdapterFactory`.
- Register via `VideoEngineOptions.adapters`.
- Use `priority` to control override behavior over defaults.

2. Add custom plugin
- Implement `VideoEnginePlugin`.
- Attach via `VideoEngineOptions.plugins` or `ConfigurableVideoPlayer.enginePlugins`.
- Keep plugins side-effect focused (analytics, policy, telemetry, feature toggles).

## Integration Guidance

1. Prefer adapter customization for transport concerns
- Protocol handling, failover, DRM bootstrap, quality source mapping.

2. Prefer plugins for product behavior
- Analytics, business rules, observability, A/B logic.

3. Keep player UI separate from playback domain
- UI components consume state and controls.
- Engine remains framework-neutral and testable.

## Validation Baseline

- Unit tests for adapter registry ordering and matching.
- Unit tests for plugin lifecycle delivery and error isolation.
- CI gates include lint, type-check, tests, API surface check, bundle size check, showcase build.
