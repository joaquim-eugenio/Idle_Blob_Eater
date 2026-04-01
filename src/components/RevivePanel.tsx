import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SadFaceIcon, TVIcon, SkullIcon, WarningIcon } from './icons';
import { useGameStore } from '../store/gameStore';
import { showRewardedAd } from '../lib/ads';

export function RevivePanel() {
  const reviveOffered = useGameStore((s) => s.reviveOffered);
  const levelItemsEaten = useGameStore((s) => s.levelItemsEaten);
  const levelItemsTotal = useGameStore((s) => s.levelItemsTotal);
  const currentLevel = useGameStore((s) => s.currentLevel);
  const reviveBlob = useGameStore((s) => s.reviveBlob);
  const declineRevive = useGameStore((s) => s.declineRevive);
  const hasPhoenixBelch = useGameStore((s) => s.purchasedPermanentBoosts.includes('phoenix_belch'));

  const [adLoading, setAdLoading] = useState(false);
  const hasActed = useRef(false);

  const remaining = levelItemsTotal - levelItemsEaten;
  const progressPercent = levelItemsTotal > 0
    ? Math.min(100, (levelItemsEaten / levelItemsTotal) * 100)
    : 0;
  const isHighProgress = progressPercent >= 50;

  useEffect(() => {
    if (!reviveOffered) {
      setAdLoading(false);
      hasActed.current = false;
    }
  }, [reviveOffered]);

  const handleRevive = async () => {
    if (hasActed.current || adLoading) return;

    if (hasPhoenixBelch) {
      hasActed.current = true;
      reviveBlob();
      return;
    }

    setAdLoading(true);

    const success = await showRewardedAd();
    if (success) {
      hasActed.current = true;
      reviveBlob();
    } else {
      setAdLoading(false);
    }
  };

  const handleDecline = () => {
    if (hasActed.current) return;
    hasActed.current = true;
    declineRevive();
  };

  return (
    <AnimatePresence>
      {reviveOffered && (
        <motion.div
          key="revive"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-30 flex items-center justify-center bg-black/70"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="bg-white rounded-3xl border-3 border-orange-500 shadow-lg shadow-red-300/40 p-6 w-[90%] max-w-sm mx-auto flex flex-col items-center gap-3"
          >
            <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">
              Level {currentLevel}
            </div>

            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-orange-500 flex justify-center"
            >
              <SadFaceIcon size={56} />
            </motion.div>

            <div className="text-2xl font-black text-red-600">
              Your Blob is Dying!
            </div>

            {/* Progress at stake -- only shown when it would create FOMO */}
            {isHighProgress && (
              <div className="w-full">
                <div className="w-full bg-red-100 rounded-full h-5 overflow-hidden relative border-2 border-red-300">
                  <motion.div
                    initial={{ width: `${progressPercent}%` }}
                    animate={{ width: [`${progressPercent}%`, `${Math.max(0, progressPercent - 8)}%`, `${progressPercent}%`] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="h-full bg-red-400"
                  />
                  <span
                    className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white"
                    style={{ textShadow: '-1px -1px 0 rgba(0,0,0,0.3), 1px -1px 0 rgba(0,0,0,0.3), -1px 1px 0 rgba(0,0,0,0.3), 1px 1px 0 rgba(0,0,0,0.3)' }}
                  >
                    {levelItemsEaten} / {levelItemsTotal}
                  </span>
                </div>
                <div className="text-center mt-1.5">
                  <span className="text-sm font-black text-red-600">
                    Only {remaining} item{remaining !== 1 ? 's' : ''} away from victory!
                  </span>
                </div>
              </div>
            )}

            {/* Danger message */}
            <div className="bg-red-50 rounded-xl px-4 py-2.5 w-full border-2 border-red-200 flex items-start gap-2">
              <WarningIcon size={18} className="text-red-500 shrink-0 mt-0.5" />
              <div className="text-sm text-red-800 font-body">
                {isHighProgress
                  ? 'All your progress on this level will be lost! Save your blob before it\'s too late.'
                  : 'Your blob is fading away! Watch a short ad to bring it back to life.'}
              </div>
            </div>

            {/* Revive CTA -- green stands out against the red/orange danger theme as "safety" */}
            <button
              onClick={handleRevive}
              disabled={adLoading}
              className="btn-game w-full py-3.5 bg-emerald-500 text-white rounded-2xl font-bold text-lg border-b-4 border-emerald-700 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-300/40 animate-pulse"
            >
              {adLoading ? (
                <span>Loading Ad...</span>
              ) : hasPhoenixBelch ? (
                <span>Phoenix Belch!</span>
              ) : (
                <>
                  <TVIcon size={20} />
                  Save Your Blob!
                </>
              )}
            </button>

            <button
              onClick={handleDecline}
              className="text-xs text-slate-400 opacity-60 hover:text-slate-500 hover:opacity-100 transition-all font-body flex items-center gap-1"
            >
              <SkullIcon size={12} />
              Let it go...
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
