# Player API Contract Matrix

## Purpose

Define which public/critical player APIs are protected by deterministic contract tests and enforced in CI.

## CI Gate

Contract gate command:

```bash
pnpm run test:contracts
```

This command is required in:

1. `.github/workflows/showcase-ci.yml`
2. `.github/workflows/package-publish.yml`

## Contract Matrix

| Domain | API / Contract | Expected Behavior | Test File |
| --- | --- | --- | --- |
| Engine Lifecycle | `VideoEngine.initialize()` | Concurrent calls initialize capabilities once and emit ready once | `packages/player/src/core/video-engine.lifecycle.test.ts` |
| Engine Lifecycle | `VideoEngine.dispose()` guard | `loadSource()` after dispose throws explicit lifecycle error | `packages/player/src/core/video-engine.lifecycle.test.ts` |
| Engine Lifecycle | `VideoEngine.loadSource()` supersession | Older in-flight loads cannot overwrite state after a newer load starts | `packages/player/src/core/video-engine.lifecycle.test.ts` |
| Engine Lifecycle | `VideoEngine.loadSource()` abort signal | In-flight adapter load is canceled with `AbortError` when signal aborts | `packages/player/src/core/video-engine.lifecycle.test.ts` |
| Engine Source Loading | `VideoEngine.loadSource()` failover | Fallback sources are attempted in order on load failure | `packages/player/src/core/video-engine.failover.test.ts` |
| Engine Source Loading | `retryPolicy` retry-before-failover | Same source is retried up to policy limit before fallback source is attempted | `packages/player/src/core/video-engine.failover.test.ts` |
| Engine Source Loading | `retryPolicy.retryOn` classification | Retries only configured error classes (e.g. network/timeout), skips unsupported unless explicitly allowed | `packages/player/src/core/video-engine.failover.test.ts` |
| Engine Source Loading | Source normalization | Trim/empty/duplicate sources are normalized before attempts | `packages/player/src/core/video-engine.failover.test.ts` |
| Plugin Lifecycle | Retry/failover observability | Plugins receive `onRetry` and `onFailover` with source transition metadata | `packages/player/src/core/video-engine.failover.test.ts` |
| Engine Events | Media event bindings | Engine events fire before dispose and stop after dispose | `packages/player/src/core/video-engine.events.test.ts` |
| Engine Events | Emission thresholds and throttling | `timeupdate` / `progress` are frame-throttled and below-threshold deltas are filtered before hook state updates | `docs/PLAYER_EVENT_CONTRACT.md` + `packages/player/src/hooks/use-video-player.reducer.test.ts` |
| Engine State | Active strategy/source cleanup | `cleanup()` clears active source and strategy | `packages/player/src/core/video-engine.events.test.ts` |
| Engine Quality | Quality API contract | `getQualityLevels()` and `setQuality()` delegate to active adapter | `packages/player/src/core/video-engine.lifecycle.test.ts` |
| Adapter Selection | `AdapterRegistry.resolve()` priority | Highest-priority compatible adapter is selected | `packages/player/src/core/adapters/adapter-registry.test.ts` |
| Adapter Selection | Adapter re-registration | Registering same `id` replaces previous adapter entry | `packages/player/src/core/adapters/adapter-registry.test.ts` |
| Adapter Runtime | Direct/Native/HLS.js/DASH adapter abort | Adapter load promises reject with `AbortError` on canceled signal and release runtime instances | `packages/player/src/core/adapters/adapter-abort.test.ts` |
| Default Adapters | URL format detection | HLS/DASH/direct matching handles uppercase + querystring URLs | `packages/player/src/core/adapters/default-adapters.test.ts` |
| Strategy Mapping | `getStreamingStrategy()` | Strategy mapping is stable for HLS/native/DASH/direct/unsupported | `packages/player/src/core/compatibility.test.ts` |
| DRM Core | `createEmeController()` | First supported key system initializes media keys correctly | `packages/player/src/core/drm/eme-controller.test.ts` |
| DRM Core | Unsupported key systems | Controller throws deterministic unsupported-key-system error | `packages/player/src/core/drm/eme-controller.test.ts` |
| DRM License | `createTokenLicenseRequestHandler()` | License request uses token header and retries once after `401` | `packages/player/src/core/drm/license-request.test.ts` |
| Plugin Isolation | `VideoEnginePluginManager` | Plugin failures are isolated and do not stop other plugins | `packages/player/src/core/plugins/plugin-manager.test.ts` |
| Hook Analytics Utils | `calculateElapsedSeconds()` | Timing math never produces negative durations | `packages/player/src/hooks/use-video-player-utils.test.ts` |
| Config Schema | `PlayerConfiguration` defaults | Presets/defaults remain stable for config consumers | `packages/player/src/types/player-config.test.ts` |

## Maintenance Rules

1. Any new public API in `packages/player/src/index.ts` must be mapped to at least one contract test.
2. Any breaking behavior change must update this matrix and test assertions in the same PR.
3. PRs that touch engine/adapter/plugin/DRM code should run `pnpm run test:contracts` locally before merge.
