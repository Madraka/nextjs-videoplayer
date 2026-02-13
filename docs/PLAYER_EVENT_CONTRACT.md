# Player Event Contract

## Scope

This document defines runtime guarantees for `VideoEngineEvents` and hook-level state updates in `useVideoPlayer`.

Applies to:

- `packages/player/src/core/video-engine.ts`
- `packages/player/src/hooks/use-video-player.ts`

## Event Guarantees

### `onReady()`

- Fired after engine capabilities are resolved.
- Intended to run once per engine lifecycle.
- Consumers should treat it as idempotent.

### `onPlay()` / `onPause()`

- Fired from native media events.
- Duplicate state transitions are ignored at hook reducer level.
- `onPause()` increments `totalWatchTime` by elapsed play session duration.

### `onTimeUpdate(currentTime, duration)`

- Emission is frame-throttled in the engine.
- Emission is skipped if delta is below thresholds:
  - `currentTime` delta `< 0.05s`
  - `duration` delta `< 0.01s`
- Hook reducer applies the same thresholds as a secondary guard.

### `onProgress(buffered)`

- Emission is frame-throttled in the engine.
- Emission is skipped if delta is below threshold:
  - `buffered` delta `< 0.25`
- Hook reducer applies the same threshold as a secondary guard.

### `onVolumeChange(volume, muted)`

- Volume is sanitized to finite range `[0, 1]` in hook layer.
- Hook reducer ignores updates where:
  - `abs(volumeDelta) < 0.01`
  - and `muted` unchanged.

### `onQualityChange(quality)`

- Hook reducer increments `qualityChanges` only when quality value changes.
- Duplicate quality values are treated as no-op.

### `onError(error)`

- Hook reducer updates error state only if message changed or loading was active.
- Repeated identical errors without state change are no-op.

### `onLoadStart()` / `onLoadEnd()`

- `onLoadStart()` sets loading state and resets transient error.
- `onLoadEnd()` accumulates buffering time.
- `onLoadEnd()` is no-op when:
  - already not loading
  - and computed buffering delta is `<= 0`.

## Consumer Guidance

- Treat all callbacks as eventually consistent runtime signals.
- Do not assume one-to-one mapping between native media events and emitted hook state updates.
- Avoid external `setState` feedback loops by diffing incoming player state before writing.

## Regression Requirements

Any change touching event thresholds or dispatch flow must include:

1. Reducer contract tests (`use-video-player.reducer.test.ts`).
2. Engine event contract tests (`video-engine.events.test.ts`) when engine emission behavior changes.
3. Showcase smoke validation (`pnpm -C apps/showcase build` and manual `dev` verification).
