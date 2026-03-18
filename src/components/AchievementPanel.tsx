import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { ACHIEVEMENTS } from '../lib/constants';
import { Trophy, X, Gem, DollarSign, Zap } from 'lucide-react';
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
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2.5 bg-amber-400/90 text-amber-900 rounded-full shadow-md hover:bg-amber-300 active:scale-95 transition-all"
      >
        <Trophy size={18} />
        {unlocked > 0 && (
          <div className="absolute -top-1 -right-1 bg-amber-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {unlocked}
          </div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-30 flex items-center justify-center p-3 sm:p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-50 w-full max-w-lg rounded-2xl sm:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[88dvh]"
            >
              <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-amber-400 to-orange-400 text-white">
                <div>
                  <h2 className="text-xl font-black tracking-tight">Achievements</h2>
                  <div className="text-sm opacity-90 mt-0.5">{unlocked}/{total} Unlocked</div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
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
                              className={`rounded-xl p-3 border flex items-center gap-3 transition-colors ${
                                isUnlocked
                                  ? 'bg-amber-50 border-amber-200'
                                  : 'bg-white border-slate-200'
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
                                <div className="text-xs text-slate-500">{ach.desc}</div>
                                {!isUnlocked && (
                                  <div className="mt-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
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
                                    <Gem size={12} className="inline mr-0.5" />{ach.reward.value}
                                  </span>
                                )}
                                {ach.reward.type === 'money_mult' && (
                                  <span className={isUnlocked ? 'text-emerald-500' : 'text-slate-400'}>
                                    <DollarSign size={12} className="inline" />+{Math.round(ach.reward.value * 100)}%
                                  </span>
                                )}
                                {ach.reward.type === 'speed_mult' && (
                                  <span className={isUnlocked ? 'text-blue-500' : 'text-slate-400'}>
                                    <Zap size={12} className="inline" />+{Math.round(ach.reward.value * 100)}%
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
