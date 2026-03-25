import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { ACHIEVEMENTS } from '../lib/constants';
import { Trophy, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function AchievementToast() {
  const newAchievements = useGameStore(s => s.newAchievements);
  const dismissAchievement = useGameStore(s => s.dismissAchievement);
  const skillFlashEvents = useGameStore(s => s.skillFlashEvents);
  const dismissSkillFlash = useGameStore(s => s.dismissSkillFlashEvent);

  const latestAch = newAchievements[0];
  const achDef = latestAch ? ACHIEVEMENTS.find(a => a.id === latestAch) : null;

  const latestSkill = !achDef && skillFlashEvents.length > 0 ? skillFlashEvents[0] : null;

  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const currentId = achDef?.id ?? latestSkill ?? null;

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!currentId) return;

    const ms = achDef ? 3500 : 3000;
    timerRef.current = setTimeout(() => {
      if (achDef) dismissAchievement(achDef.id);
      else if (latestSkill) dismissSkillFlash(latestSkill);
    }, ms);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [currentId, achDef, latestSkill, dismissAchievement, dismissSkillFlash]);

  const isGate = latestSkill?.startsWith('gate:');

  return (
    <AnimatePresence>
      {achDef && (
        <motion.div
          key={`ach-${achDef.id}`}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40"
        >
          <button
            onClick={() => dismissAchievement(achDef.id)}
            className="bg-amber-500 text-white rounded-2xl px-5 py-3 shadow-xl flex items-center gap-3 hover:bg-amber-600 transition-colors"
          >
            <Trophy size={22} />
            <div className="text-left">
              <div className="font-black text-sm">{achDef.name}</div>
              <div className="text-xs opacity-90">{achDef.desc}</div>
              <div className="text-xs font-bold mt-0.5 text-amber-200">
                {achDef.reward.type === 'gems' ? `+${achDef.reward.value} Gems` :
                 achDef.reward.type === 'money_mult' ? `+${Math.round(achDef.reward.value * 100)}% Money` :
                 `+${Math.round(achDef.reward.value * 100)}% Speed`}
              </div>
            </div>
          </button>
        </motion.div>
      )}

      {!achDef && latestSkill && (
        <motion.div
          key={`skill-${latestSkill}`}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40"
        >
          <button
            onClick={() => dismissSkillFlash(latestSkill)}
            className={`${isGate ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-2xl px-5 py-3 shadow-xl flex items-center gap-3 transition-colors`}
          >
            <Zap size={20} />
            <div className="font-black text-sm">
              {isGate ? 'Gate Breakthrough!' : 'New Skill Unlocked!'}
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
