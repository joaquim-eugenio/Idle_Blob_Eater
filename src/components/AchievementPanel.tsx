import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { ACHIEVEMENTS } from '../lib/constants';
import { Trophy, X, Diamond, CurrencyDollar, Lightning } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'motion/react';

const CATEGORY_LABELS: Record<string, string> = {
  eating: 'Eating', money: 'Money', levels: 'Levels',
  upgrades: 'Upgrades', prestige: 'Prestige', special: 'Special',
};

export function AchievementPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const achievements = useGameStore(s => s.achievements);
  const stats = useGameStore(s => s.stats);

  const categories = [...new Set(ACHIEVEMENTS.map(a => a.category))];
  const total = ACHIEVEMENTS.length;
  const unlocked = achievements.length;

  return (
    <>
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={() => setIsOpen(true)}
          className="relative p-2.5 bg-amber-500 text-white rounded-full border-2 border-amber-600 shadow-md shadow-amber-200/30 hover:bg-amber-400 active:scale-95 transition-all"
        >
          <Trophy size={18} />
          {unlocked > 0 && (
            <div className="absolute -top-1 -right-1 bg-amber-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {unlocked}
            </div>
          )}
        </button>
        <span className="text-[10px] font-bold text-amber-600">Awards</span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-30 flex items-center justify-center p-3 sm:p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-lg rounded-3xl border-3 border-amber-400 shadow-lg shadow-amber-200/40 overflow-hidden flex flex-col max-h-[88dvh]"
            >
              <div className="p-5 flex justify-between items-center bg-amber-500 text-white">
                <div>
                  <h2 className="text-xl font-black tracking-tight">Achievements</h2>
                  <div className="text-sm opacity-90 mt-0.5 font-body">{unlocked}/{total} Unlocked</div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 border-2 border-white/50 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                  <X size={22} />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-4 space-y-4">
                {categories.map(cat => {
                  const catAchievements = ACHIEVEMENTS.filter(a => a.category === cat);
                  return (
                    <div key={cat}>
                      <h3 className="font-bold text-slate-600 text-xs uppercase tracking-wider mb-2 px-1">
                        {CATEGORY_LABELS[cat] || cat}
                      </h3>
                      <div className="space-y-1.5">
                        {catAchievements.map(ach => {
                          const isUnlocked = achievements.includes(ach.id);
                          const statVal = (stats as any)[ach.stat] || 0;
                          const progress = Math.min(1, statVal / ach.threshold);

                          return (
                            <div
                              key={ach.id}
                              className={`rounded-xl p-3 border-2 flex items-center gap-3 transition-colors ${
                                isUnlocked
                                  ? 'bg-amber-50 border-amber-300'
                                  : 'bg-slate-50 border-slate-200'
                              }`}
                            >
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                                isUnlocked ? 'bg-amber-400 text-white' : 'bg-slate-200 text-slate-400'
                              }`}>
                                <Trophy size={16} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className={`font-bold text-sm ${isUnlocked ? 'text-amber-700' : 'text-slate-700'}`}>
                                  {ach.name}
                                </div>
                                <div className="text-xs text-slate-500 font-body">{ach.desc}</div>
                                {!isUnlocked && (
                                  <div className="mt-1 h-2 bg-amber-100 rounded-full overflow-hidden border border-amber-200">
                                    <div
                                      className="h-full bg-amber-400 rounded-full transition-all"
                                      style={{ width: `${progress * 100}%` }}
                                    />
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-xs font-bold flex-shrink-0">
                                {ach.reward.type === 'gems' && (
                                  <span className={isUnlocked ? 'text-purple-500' : 'text-slate-400'}>
                                    <Diamond size={12} className="inline mr-0.5" />{ach.reward.value}
                                  </span>
                                )}
                                {ach.reward.type === 'money_mult' && (
                                  <span className={isUnlocked ? 'text-emerald-500' : 'text-slate-400'}>
                                    <CurrencyDollar size={12} className="inline" />+{Math.round(ach.reward.value * 100)}%
                                  </span>
                                )}
                                {ach.reward.type === 'speed_mult' && (
                                  <span className={isUnlocked ? 'text-blue-500' : 'text-slate-400'}>
                                    <Lightning size={12} className="inline" />+{Math.round(ach.reward.value * 100)}%
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
