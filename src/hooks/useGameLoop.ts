// The game tick is driven directly from GameCanvas's render loop. Running a
// separate requestAnimationFrame for the simulation (as this hook used to)
// caused tick/render to drift out of sync across frames — the browser could
// schedule them in either order, occasionally running two ticks before a
// render or two renders before a tick, which made the blob's motion look
// like it was "skipping frames". See .cursor/rules/canvas2d-performance.mdc
// section 7: "Single requestAnimationFrame loop".
//
// This hook is kept as a no-op for API compatibility with App.tsx.
export function useGameLoop() {
  // intentionally empty
}
