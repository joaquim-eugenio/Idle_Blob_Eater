import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { ChartBar, ArrowCounterClockwise, X } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'motion/react';

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return Math.floor(n).toLocaleString();
}

function fmtTime(seconds: number): string {
  if (seconds < 60) return `${Math.floor(seconds)}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${Math.floor(seconds % 60)}s`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

export function StatsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const stats = useGameStore(s => s.stats);
  const mps = useGameStore(s => s.moneyPerSecond);
  const level = useGameStore(s => s.currentLevel);
  const essence = useGameStore(s => s.essence);
  const resetGame = useGameStore(s => s.resetGame);

  const rows = [
    ['Money/sec', `$${fmt(mps)}`],
    ['Current Level', level.toString()],
    ['Highest Level', stats.highestLevel.toString()],
    ['Levels Completed', (stats.totalLevelsCompleted || 0).toString()],
    ['Stars Earned', (stats.totalStarsEarned || 0).toString()],
    ['Total Items Eaten', fmt(stats.totalFoodEaten)],
    ['Total Money Earned', `$${fmt(stats.totalMoneyEarned)}`],
    ['Boost Stars Collected', stats.totalStarsEaten.toString()],
    ['Best Combo', `x${stats.highestCombo}`],
    ['Top Speed', Math.floor(stats.highestSpeed).toString()],
    ['Total Taps', stats.totalTaps.toString()],
    ['Upgrades Bought', stats.totalUpgradesBought.toString()],
    ['Times Evolved', stats.totalPrestiges.toString()],
    ['Total Essence', essence.toString()],
    ['Time Played', fmtTime(stats.timePlayed)],
  ];

  return (
    <>
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2.5 bg-blue-500 text-white rounded-full border-2 border-blue-600 shadow-md shadow-blue-200/30 hover:bg-blue-400 active:scale-95 transition-all"
        >
          <ChartBar size={18} />
        </button>
        <span className="text-[10px] font-bold text-blue-600">Stats</span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setIsOpen(false); setConfirmReset(false); }}
            className="fixed inset-0 bg-black/50 z-30 flex items-center justify-center p-3 sm:p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-sm rounded-3xl border-3 border-blue-400 shadow-lg shadow-blue-200/40 overflow-hidden flex flex-col max-h-[88dvh]"
            >
              <div className="p-5 flex justify-between items-center bg-blue-500 text-white">
                <h2 className="text-xl font-black tracking-tight">Statistics</h2>
                <button onClick={() => setIsOpen(false)} className="p-2 border-2 border-white/50 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                  <X size={20} weight="bold" />
                </button>
              </div>
              <div className="p-4 space-y-1 flex-1 overflow-auto">
                {rows.map(([label, value]) => (
                  <div key={label} className="flex justify-between items-center py-2 px-2 rounded-lg even:bg-blue-50/50">
                    <span className="text-sm text-slate-600 font-body">{label}</span>
                    <span className="text-sm font-bold text-slate-800">{value}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t-2 border-blue-100">
                {!confirmReset ? (
                  <button
                    onClick={() => setConfirmReset(true)}
                    className="btn-game w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-red-600 bg-red-50 border-b-4 border-red-200 hover:bg-red-100 transition-all"
                  >
                    <ArrowCounterClockwise size={15} />
                    Reset All Progress
                  </button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-center text-red-600 font-bold">This will erase ALL progress permanently. Are you sure?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setConfirmReset(false)}
                        className="btn-game flex-1 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 border-b-4 border-slate-300 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => { resetGame(); setConfirmReset(false); setIsOpen(false); }}
                        className="btn-game flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-red-500 border-b-4 border-red-700 transition-all"
                      >
                        Yes, Reset
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
