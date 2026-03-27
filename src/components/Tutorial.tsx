import { useEffect, useRef, type ReactNode } from 'react';
import { useGameStore } from '../store/gameStore';
import { motion, AnimatePresence } from 'motion/react';
import { Hand, CurrencyDollar, Sparkle, Globe } from '@phosphor-icons/react';

interface HintConfig {
  message: string;
  position: 'top-center' | 'bottom-center' | 'bottom-right';
  icon?: ReactNode;
  autoDismissMs?: number;
}

const HINT_CONFIGS: Record<string, HintConfig> = {
  blob_intro: {
    message: "This is your Blob! It eats all items to clear each level.",
    position: 'top-center',
    icon: <Sparkle size={20} className="text-blue-300 shrink-0" />,
  },
  tap_hint: {
    message: "Tap the screen to drop extra items for your Blob!",
    position: 'top-center',
    icon: <Hand size={20} className="text-amber-300 shrink-0" />,
  },
  money_hint: {
    message: "You earned cash! Use it to buy upgrades.",
    position: 'top-center',
    icon: <CurrencyDollar size={20} className="text-emerald-300 shrink-0" />,
    autoDismissMs: 4000,
  },
  skill_tree_hint: {
    message: "Try the Skill Tree for permanent boosts!",
    position: 'bottom-right',
    icon: <Sparkle size={20} className="text-purple-300 shrink-0" />,
    autoDismissMs: 5000,
  },
  worlds_hint: {
    message: "New worlds await with bigger challenges!",
    position: 'top-center',
    icon: <Globe size={20} className="text-cyan-300 shrink-0" />,
    autoDismissMs: 4000,
  },
};

const POSITION_CLASSES: Record<string, string> = {
  'top-center': 'top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2',
  'bottom-center': 'bottom-36 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-24 right-6',
};

export function Tutorial() {
  const activeHint = useGameStore(s => s.activeHint);
  const dismissHint = useGameStore(s => s.dismissHint);

  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const config = activeHint ? HINT_CONFIGS[activeHint] : null;

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!activeHint || !config?.autoDismissMs) return;

    timerRef.current = setTimeout(() => {
      dismissHint(activeHint);
    }, config.autoDismissMs);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [activeHint, config, dismissHint]);

  return (
    <AnimatePresence>
      {activeHint && config && (
        <motion.div
          key={activeHint}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-40 pointer-events-none"
        >
          <div className="absolute inset-0 bg-black/30" />

          <div className={`absolute ${POSITION_CLASSES[config.position]} pointer-events-auto`}>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white rounded-2xl border-3 border-blue-400 shadow-lg shadow-blue-200/30 p-5 max-w-xs text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                {config.icon}
              </div>
              <div className="text-lg font-bold text-slate-800 mb-4 font-body">{config.message}</div>
              <button
                onClick={() => dismissHint(activeHint)}
                className="btn-game px-6 py-2 bg-blue-500 text-white rounded-xl font-bold text-sm border-b-4 border-blue-700 hover:bg-blue-600 transition-all"
              >
                Got it
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
