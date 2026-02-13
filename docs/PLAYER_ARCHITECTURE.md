# Player Architecture

## Objective

Provide a stable core for enterprise use cases where playback transport logic and product-specific behavior evolve independently.

## Layers

1. `VideoEngine`
- Owns media element lifecycle.
- Detects capabilities.
- Selects and executes streaming adapter.
- Supports ordered source failover (`src` + `fallbackSources`).
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
  - `onSourceLoadStart`, `onSourceLoaded`, `onSourceLoadFailed`
  - `onPlay`, `onPause`, `onTimeUpdate`, `onVolumeChange`, `onQualityChange`
  - `onError`, `onDispose`

4. DRM Layer (`src/core/drm`)
- `createEmeController`: initializes MediaKeys and license exchange workflow.
- `isEmeSupported`: feature detection helper.
- Engine-level optional `drm` config per source load.

## Runtime Flow

1. `VideoEngine.initialize()` resolves browser capabilities.
2. `loadSource()` queries `AdapterRegistry` with source + capabilities.
3. If DRM is configured, engine initializes EME session manager before playback.
4. Highest-priority compatible adapter is instantiated and loaded.
5. If source load fails, engine retries next fallback source before surfacing terminal error.
6. Plugin manager receives lifecycle events before/after load and during playback.
7. On source change or disposal, active adapter and active DRM controller are destroyed.

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
