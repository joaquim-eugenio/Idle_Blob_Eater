import { motion } from 'motion/react';
import { Clock, Coins, X, SmileyXEyes, CheckCircle, Hourglass, Television, ArrowCounterClockwise, CaretRight } from '@phosphor-icons/react';
import { type AutopilotResult } from '../store/gameStore';
import { useGameStore } from '../store/gameStore';

function formatTime(seconds: number) {
  if (seconds < 60) return `${Math.floor(seconds)}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return Math.floor(n).toLocaleString();
}

interface Props {
  result: AutopilotResult;
  onDismiss: () => void;
  onRevive: () => void;
}

export function AutopilotResultModal({ result, onDismiss, onRevive }: Props) {
  const advanceToNextLevel = useGameStore(s => s.advanceToNextLevel);
  const retryLevel = useGameStore(s => s.retryLevel);
  const completeLevel = useGameStore(s => s.completeLevel);

  const itemsProgress = result.totalItems > 0
    ? Math.round((result.itemsEaten / (result.totalItems - (result.totalItems - result.itemsEaten - (result.totalItems - result.itemsEaten)))) * 100)
    : 0;

  const progressPercent = result.totalItems > 0
    ? Math.min(100, Math.round((result.itemsEaten / result.totalItems) * 100))
    : 0;

  const handleAdvance = () => {
    completeLevel();
    onDismiss();
    advanceToNextLevel();
  };

  const handleRetry = () => {
    onDismiss();
    retryLevel();
  };

  const borderColor = result.outcome === 'completed'
    ? 'border-emerald-400'
    : result.outcome === 'died'
      ? 'border-red-400'
      : 'border-amber-400';

  const shadowColor = result.outcome === 'completed'
    ? 'shadow-emerald-200/40'
    : result.outcome === 'died'
      ? 'shadow-red-200/40'
      : 'shadow-amber-200/40';

  return (
    <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`bg-white rounded-3xl border-3 ${borderColor} shadow-lg ${shadowColor} w-full max-w-sm p-4 sm:p-6 text-center`}
      >
        <div className="flex justify-end -mb-2">
          <button
            onClick={onDismiss}
            className="p-1.5 text-slate-400 hover:text-slate-600 border-2 border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X size={16} weight="bold" />
          </button>
        </div>

        {result.outcome === 'completed' && (
          <>
            <div className="text-emerald-500 flex justify-center mb-2">
              <CheckCircle size={48} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-1">Autopilot Complete!</h2>
            <div className="text-sm text-slate-500 font-body mb-3">
              Level {result.level} cleared in {formatTime(result.timeAlive)}
            </div>

            <div className="bg-emerald-50 rounded-2xl p-4 mb-4 border-2 border-emerald-300">
              <div className="text-sm text-emerald-600 font-semibold mb-1">Your blob ate all items</div>
              <div className="text-2xl font-black text-emerald-600 flex items-center justify-center gap-2">
                <Coins size={28} />
                ${fmt(result.moneyEarned)}
              </div>
              <div className="text-xs text-emerald-500 mt-1 font-body">1-star clear (autopilot)</div>
            </div>

            <button
              onClick={handleAdvance}
              className="btn-game w-full py-2.5 sm:py-3 bg-blue-500 text-white rounded-xl font-bold text-base sm:text-lg border-b-4 border-blue-700 hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
            >
              Next Level
              <CaretRight size={18} />
            </button>
          </>
        )}

        {result.outcome === 'partial' && (
          <>
            <div className="text-amber-500 flex justify-center mb-2">
              <Hourglass size={48} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-1">Still Working...</h2>
            <div className="text-sm text-slate-500 font-body mb-3">
              Level {result.level} - {formatTime(result.timeAlive)} elapsed
            </div>

            <div className="bg-amber-50 rounded-2xl p-4 mb-3 border-2 border-amber-300">
              <div className="text-sm text-amber-600 font-semibold mb-2">Progress</div>
              <div className="w-full bg-amber-200 rounded-full h-4 overflow-hidden relative mb-2">
                <div
                  className="h-full bg-amber-500 transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white"
                  style={{ textShadow: '-1px -1px 0 rgba(0,0,0,0.3), 1px 1px 0 rgba(0,0,0,0.3)' }}>
                  {result.itemsEaten} / {result.totalItems} items
                </span>
              </div>
              <div className="text-xl font-black text-amber-600 flex items-center justify-center gap-2">
                <Coins size={22} />
                ${fmt(result.moneyEarned)}
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={onDismiss}
                className="btn-game w-full py-2.5 bg-blue-500 text-white rounded-xl font-bold text-base border-b-4 border-blue-700 hover:bg-blue-600 transition-all"
              >
                Resume Playing
              </button>
            </div>
          </>
        )}

        {result.outcome === 'died' && (
          <>
            <div className="text-red-400 flex justify-center mb-2">
              <SmileyXEyes size={56} />
            </div>
            <h2 className="text-2xl font-black text-red-600 mb-1">Blob Starved!</h2>
            <div className="flex items-center justify-center gap-1.5 text-slate-500 text-sm mb-3 font-body">
              <Clock size={14} />
              <span>Survived {formatTime(result.timeAlive)} on Level {result.level}</span>
            </div>

            <div className="bg-red-50 rounded-2xl p-4 mb-3 border-2 border-red-300">
              <div className="text-sm text-red-600 font-semibold mb-2">Progress Before Death</div>
              <div className="w-full bg-red-200 rounded-full h-4 overflow-hidden relative mb-2">
                <div
                  className="h-full bg-red-500 transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white"
                  style={{ textShadow: '-1px -1px 0 rgba(0,0,0,0.3), 1px 1px 0 rgba(0,0,0,0.3)' }}>
                  {result.itemsEaten} / {result.totalItems} items
                </span>
              </div>
              <div className="text-lg font-black text-red-600 flex items-center justify-center gap-2">
                <Coins size={20} />
                ${fmt(result.moneyEarned)} earned
              </div>
            </div>

            <div className="bg-amber-50 rounded-xl px-4 py-2 mb-3 border-2 border-amber-200">
              <span className="text-xs text-amber-800 font-body">
                Upgrade Survival skills to help your blob last longer!
              </span>
            </div>

            <div className="space-y-2">
              <button
                onClick={onRevive}
                className="btn-game w-full py-2.5 bg-amber-400 text-amber-900 rounded-xl font-bold text-sm border-b-4 border-amber-600 hover:bg-amber-300 transition-all flex items-center justify-center gap-2"
              >
                <Television size={16} /> Watch Ad to Revive
              </button>
              <button
                onClick={handleRetry}
                className="btn-game w-full py-2.5 bg-red-500 text-white rounded-xl font-bold text-base border-b-4 border-red-700 hover:bg-red-600 transition-all flex items-center justify-center gap-2"
              >
                <ArrowCounterClockwise size={16} />
                Retry Level
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
