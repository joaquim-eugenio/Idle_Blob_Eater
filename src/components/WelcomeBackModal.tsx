import { motion } from 'motion/react';
import { Clock, Coins, X, HandWaving, Television } from '@phosphor-icons/react';

function formatTime(seconds: number) {
  if (seconds < 60) return `${Math.floor(seconds)}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

interface Props {
  earnings: number;
  timeAway: number;
  onCollect: (mult?: number) => void;
  onClose: () => void;
}

export function WelcomeBackModal({ earnings, timeAway, onCollect, onClose }: Props) {
  return (
    <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl border-3 border-emerald-400 shadow-lg shadow-emerald-200/40 w-full max-w-sm p-4 sm:p-6 text-center"
      >
        <div className="flex justify-end -mb-2">
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 border-2 border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Close welcome back modal"
          >
            <X size={16} weight="bold" />
          </button>
        </div>
        <div className="text-amber-400 flex justify-center mb-2"><HandWaving size={48} /></div>
        <h2 className="text-2xl font-black text-slate-800 mb-1">Welcome Back!</h2>
        <div className="flex items-center justify-center gap-1.5 text-slate-500 text-sm mb-4 font-body">
          <Clock size={14} />
          <span>You were away for {formatTime(timeAway)}</span>
        </div>

        <div className="bg-emerald-50 rounded-2xl p-4 mb-4 border-2 border-emerald-300">
          <div className="text-sm text-emerald-600 font-semibold mb-1">Your blob earned</div>
          <div className="text-3xl font-black text-emerald-600 flex items-center justify-center gap-2">
            <Coins size={28} />
            ${earnings.toLocaleString()}
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => onCollect(1)}
            className="btn-game w-full py-2.5 sm:py-3 bg-emerald-500 text-white rounded-xl font-bold text-base sm:text-lg border-b-4 border-emerald-700 hover:bg-emerald-600 transition-all"
          >
            Collect
          </button>
          <button
            onClick={() => onCollect(2)}
            className="btn-game w-full py-2.5 bg-amber-400 text-amber-900 rounded-xl font-bold text-sm border-b-4 border-amber-600 hover:bg-amber-300 transition-all flex items-center justify-center gap-2"
          >
            <Television size={16} /> Watch Ad for 2x
          </button>
        </div>
      </motion.div>
    </div>
  );
}
