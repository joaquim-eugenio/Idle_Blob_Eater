import { useGameStore } from '../store/gameStore';
import { ACHIEVEMENTS } from '../lib/constants';
import { Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function AchievementToast() {
  const newAchievements = useGameStore(s => s.newAchievements);
  const dismiss = useGameStore(s => s.dismissAchievement);

  const latest = newAchievements[0];
  const def = latest ? ACHIEVEMENTS.find(a => a.id === latest) : null;

  return (
    <AnimatePresence>
      {def && (
        <motion.div
          key={def.id}
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          className="absolute top-20 left-1/2 -translate-x-1/2 z-40"
        >
          <button
            onClick={() => dismiss(def.id)}
            className="bg-amber-500 text-white rounded-2xl px-5 py-3 shadow-xl flex items-center gap-3 hover:bg-amber-600 transition-colors"
          >
            <Trophy size={22} />
            <div className="text-left">
              <div className="font-black text-sm">{def.name}</div>
              <div className="text-xs opacity-90">{def.desc}</div>
              <div className="text-xs font-bold mt-0.5 text-amber-200">
                {def.reward.type === 'gems' ? `+${def.reward.value} Gems` :
                 def.reward.type === 'money_mult' ? `+${Math.round(def.reward.value * 100)}% Money` :
                 `+${Math.round(def.reward.value * 100)}% Speed`}
              </div>
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
