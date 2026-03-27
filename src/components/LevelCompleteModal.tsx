import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CaretRight, ArrowCounterClockwise, ArrowUp, SmileyXEyes } from '@phosphor-icons/react';
import { useGameStore } from '../store/gameStore';
import { getWorldForLevel } from '../lib/levels';

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return Math.floor(n).toLocaleString();
}

function SkillTreeIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="22" x2="12" y2="13" />
      <line x1="12" y1="13" x2="5" y2="6" />
      <line x1="12" y1="13" x2="19" y2="6" />
      <line x1="12" y1="13" x2="12" y2="4" />
      <circle cx="12" cy="3" r="2.5" fill="currentColor" opacity={0.25} />
      <circle cx="5" cy="5" r="2.5" fill="currentColor" opacity={0.25} />
      <circle cx="19" cy="5" r="2.5" fill="currentColor" opacity={0.25} />
      <line x1="8" y1="22" x2="16" y2="22" />
    </svg>
  );
}

export function LevelCompleteModal() {
  const {
    levelComplete, levelFailed, levelStars, levelRewards, currentLevel,
    completeLevel, advanceToNextLevel, retryLevel, openSkillTree,
  } = useGameStore();
  const [hasCollected, setHasCollected] = useState(false);
  const advancingRef = useRef(false);

  useEffect(() => {
    if (!levelComplete && !levelFailed) {
      advancingRef.current = false;
    }
  }, [levelComplete, levelFailed]);

  useEffect(() => {
    if (levelComplete && !hasCollected) {
      completeLevel();
      setHasCollected(true);
    }
  }, [levelComplete]);

  const handleNext = () => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    setHasCollected(false);
    advanceToNextLevel();
  };

  const handleRetry = () => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    retryLevel();
  };

  const nextWorld = getWorldForLevel(currentLevel + 1);
  const currentWorld = getWorldForLevel(currentLevel);
  const worldChanged = nextWorld.id !== currentWorld.id;

  const showSuccess = hasCollected && levelRewards;
  const showFailure = levelFailed;

  return (
    <AnimatePresence>
      {showFailure && (
        <motion.div
          key="failure"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-30 flex items-center justify-center bg-black/50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="bg-white rounded-3xl border-3 border-red-400 shadow-lg shadow-red-200/40 p-6 w-[90%] max-w-sm mx-auto flex flex-col items-center gap-4"
          >
            <div className="text-lg font-bold text-slate-400 uppercase tracking-wider">
              Level {currentLevel}
            </div>

            <div className="text-3xl font-black text-red-600">
              Starved!
            </div>

            <div className="text-red-400 flex justify-center"><SmileyXEyes size={64} /></div>

            <div className="bg-red-50 rounded-xl px-6 py-3 w-full text-center border-2 border-red-200">
              <div className="text-sm font-bold text-red-700 uppercase tracking-wide">Level Failed</div>
              <div className="text-sm text-red-600 mt-1 font-body">
                Your blob ran out of energy! Eat faster to stay alive.
              </div>
            </div>

            <div className="flex items-center gap-2 bg-amber-50 rounded-xl px-4 py-3 w-full border-2 border-amber-200">
              <ArrowUp size={18} className="text-amber-600 shrink-0" />
              <span className="text-sm text-amber-800 font-body">
                Try upgrading Speed, Suction, or Hunger to clear faster!
              </span>
            </div>

            <div className="flex gap-3 w-full">
              <button
                onClick={openSkillTree}
                className="btn-game flex-1 bg-slate-100 text-slate-700 font-bold text-base py-3 rounded-2xl border-b-4 border-slate-300 flex items-center justify-center gap-2 transition-all"
              >
                <SkillTreeIcon size={18} />
                Skills
              </button>
              <button
                onClick={handleRetry}
                className="btn-game flex-1 bg-red-500 text-white font-bold text-base py-3 rounded-2xl border-b-4 border-red-700 flex items-center justify-center gap-2 transition-all"
              >
                <ArrowCounterClockwise size={18} />
                Retry
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showSuccess && (
        <motion.div
          key="success"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-30 flex items-center justify-center bg-black/50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="bg-white rounded-3xl border-3 border-amber-400 shadow-lg shadow-amber-200/40 p-6 w-[90%] max-w-sm mx-auto flex flex-col items-center gap-4"
          >
            <div className="text-lg font-bold text-slate-400 uppercase tracking-wider">
              Level {currentLevel}
            </div>

            <div className="text-3xl font-black text-slate-800">
              Level Clear!
            </div>

            <div className="flex flex-col items-center gap-1 bg-emerald-50 rounded-xl px-6 py-3 w-full border-2 border-emerald-300">
              <div className="text-sm font-bold text-emerald-700 uppercase tracking-wide">Rewards</div>
              <div className="text-2xl font-black text-emerald-600">${fmt(levelRewards.money)}</div>
              <div className="flex gap-3 mt-1">
                {levelRewards.gems && levelRewards.gems > 0 && (
                  <span className="text-sm font-bold text-purple-600">+{levelRewards.gems} Gems</span>
                )}
                {levelRewards.essence && levelRewards.essence > 0 && (
                  <span className="text-sm font-bold text-violet-600">+{levelRewards.essence} Essence</span>
                )}
              </div>
            </div>

            {worldChanged && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-indigo-50 rounded-xl px-4 py-2 text-center border-2 border-indigo-200"
              >
                <div className="text-xs font-bold text-indigo-400 uppercase">New World Unlocked</div>
                <div className="text-lg font-black text-indigo-700">{nextWorld.name}</div>
              </motion.div>
            )}

            <div className="flex gap-3 w-full mt-1">
              <button
                onClick={openSkillTree}
                className="btn-game flex-1 bg-slate-100 text-slate-700 font-bold text-base py-3 rounded-2xl border-b-4 border-slate-300 flex items-center justify-center gap-2 transition-all"
              >
                <SkillTreeIcon size={18} />
                Skills
              </button>
              <button
                onClick={handleNext}
                className="btn-game flex-1 bg-blue-500 text-white font-bold text-base py-3 rounded-2xl border-b-4 border-blue-700 flex items-center justify-center gap-2 transition-all"
              >
                Next Level
                <CaretRight size={18} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
