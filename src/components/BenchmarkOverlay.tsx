import { useGameStore, getBenchFrameTimes } from '../store/gameStore';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

const GAME_FONT = "'Fredoka', sans-serif";

function StatRow({ label, value, unit, color }: { label: string; value: string | number; unit?: string; color?: string }) {
  return (
    <div className="flex justify-between items-baseline py-1.5 border-b border-white/10 last:border-0">
      <span className="text-sm text-white/60 font-medium">{label}</span>
      <span className="text-lg font-black" style={{ color: color || '#ffffff', fontFamily: GAME_FONT }}>
        {value}{unit && <span className="text-sm font-bold opacity-60 ml-0.5">{unit}</span>}
      </span>
    </div>
  );
}

function getRating(avgFps: number): { label: string; color: string; emoji: string } {
  if (avgFps >= 58) return { label: 'Excellent', color: '#4ade80', emoji: '' };
  if (avgFps >= 45) return { label: 'Good', color: '#facc15', emoji: '' };
  if (avgFps >= 30) return { label: 'Playable', color: '#fb923c', emoji: '' };
  return { label: 'Low', color: '#ef4444', emoji: '' };
}

function getFpsColor(fps: number): string {
  if (fps >= 55) return '#4ade80';
  if (fps >= 40) return '#facc15';
  if (fps >= 25) return '#fb923c';
  return '#ef4444';
}

export function BenchmarkOverlay() {
  const phase = useGameStore(s => s._benchmarkPhase);
  const results = useGameStore(s => s._benchmarkResults);
  const startTime = useGameStore(s => s._benchmarkStartTime);
  const duration = useGameStore(s => s._benchmarkDuration);
  const itemCount = useGameStore(s => s._benchmarkItemCount);
  const stopBenchmark = useGameStore(s => s.debugStopBenchmark);

  // Poll FPS from the mutable frame-times buffer every 250ms
  const [recentFps, setRecentFps] = useState(0);
  useEffect(() => {
    if (phase !== 'running') return;
    const id = setInterval(() => {
      const ft = getBenchFrameTimes();
      const now = performance.now();
      let count = 0;
      for (let i = ft.length - 1; i >= 0; i--) {
        if (now - ft[i] > 1000) break;
        count++;
      }
      setRecentFps(count);
    }, 250);
    return () => clearInterval(id);
  }, [phase]);

  if (phase === 'idle') return null;

  if (phase === 'running') {
    const elapsed = startTime > 0 ? Math.min((performance.now() - startTime) / 1000, duration) : 0;
    const progress = Math.min(1, elapsed / duration);

    return (
      <div className="fixed inset-x-0 top-0 z-50 pointer-events-none">
        <div className="mx-auto max-w-lg pt-3 px-3">
          <div className="bg-black/70 backdrop-blur-sm rounded-2xl border border-white/10 p-3 pointer-events-auto">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-white/80 text-xs font-bold uppercase tracking-wider">Benchmark Running</span>
              </div>
              <span
                className="text-2xl font-black tabular-nums"
                style={{ fontFamily: GAME_FONT, color: getFpsColor(recentFps) }}
              >
                {recentFps} <span className="text-sm font-bold opacity-50">FPS</span>
              </span>
            </div>

            <div className="flex justify-between text-xs text-white/50 mb-1">
              <span>{itemCount} items on screen</span>
              <span>{Math.ceil(duration - elapsed)}s remaining</span>
            </div>

            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${progress * 100}%`,
                  background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'results' && results) {
    const rating = getRating(results.avgFps);

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="w-full max-w-sm"
          >
            <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl border-2 border-white/10 overflow-hidden shadow-2xl">
              {/* Header */}
              <div
                className="p-5 pb-4 text-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3), rgba(236,72,153,0.2))',
                }}
              >
                <h2 className="text-2xl font-black text-white mb-1" style={{ fontFamily: GAME_FONT }}>
                  Benchmark Complete
                </h2>
                <div
                  className="text-4xl font-black mt-2 mb-1"
                  style={{ fontFamily: GAME_FONT, color: rating.color }}
                >
                  {rating.label}
                </div>
                <div className="text-sm text-white/50">
                  {results.duration}s test with {results.itemCount} objects
                </div>
              </div>

              {/* Stats */}
              <div className="px-5 py-3">
                <StatRow label="Average FPS" value={results.avgFps} unit="fps" color={getFpsColor(results.avgFps)} />
                <StatRow label="Maximum FPS" value={results.maxFps} unit="fps" color={getFpsColor(results.maxFps)} />
                <StatRow label="Minimum FPS" value={results.minFps} unit="fps" color={getFpsColor(results.minFps)} />
                <StatRow label="1% Low FPS" value={results.p1Fps} unit="fps" color={getFpsColor(results.p1Fps)} />
                <StatRow label="Total Frames" value={results.totalFrames} />
                <StatRow label="Objects Rendered" value={results.itemCount} />
              </div>

              {/* Button */}
              <div className="p-5 pt-2">
                <button
                  onClick={stopBenchmark}
                  className="w-full py-3.5 rounded-2xl font-black text-base text-white transition-all active:scale-[0.97]"
                  style={{
                    fontFamily: GAME_FONT,
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
                  }}
                >
                  Back to Game
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return null;
}
