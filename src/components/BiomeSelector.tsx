import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { usePanelPause } from '../hooks/usePanelPause';
import { WORLDS, getWorldForLevel } from '../lib/levels';
import { GlobeIcon, LockIcon, MapPinIcon, CloseIcon } from './icons';
import { motion, AnimatePresence } from 'motion/react';

export function WorldViewer() {
  const [isOpen, setIsOpen] = useState(false);
  usePanelPause(isOpen);
  const currentLevel = useGameStore(s => s.currentLevel);
  const highestLevel = useGameStore(s => s.highestLevelReached);
  const currentWorld = getWorldForLevel(currentLevel);

  return (
    <>
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={() => setIsOpen(true)}
          className="btn-bar-icon p-2.5 bg-emerald-500 text-white rounded-full border-2 border-emerald-600 border-b-emerald-700 hover:bg-emerald-400 active:scale-95"
        >
          <GlobeIcon size={18} />
        </button>
        <span className="text-[10px] font-bold text-emerald-600">Worlds</span>
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
              className="bg-white w-full max-w-sm rounded-3xl border-3 border-emerald-400 shadow-lg shadow-emerald-200/40 overflow-hidden flex flex-col max-h-[88dvh]"
            >
              <div className="panel-header-game p-5 flex justify-between items-center bg-emerald-500 text-white">
                <h2 className="text-xl font-black tracking-tight">Worlds</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 border-2 border-white/50 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                  aria-label="Close world viewer"
                >
                  <CloseIcon size={20} />
                </button>
              </div>

              <div className="p-3 space-y-1.5 flex-1 overflow-auto">
                {[
                  { label: 'Micro', worlds: WORLDS.slice(0, 5) },
                  { label: 'Small', worlds: WORLDS.slice(5, 10) },
                  { label: 'Medium', worlds: WORLDS.slice(10, 16) },
                  { label: 'Large', worlds: WORLDS.slice(16, 23) },
                  { label: 'Giant', worlds: WORLDS.slice(23, 30) },
                  { label: 'Epic', worlds: WORLDS.slice(30, 36) },
                  { label: 'Cosmic', worlds: WORLDS.slice(36, 44) },
                  { label: 'Universal', worlds: WORLDS.slice(44, 48) },
                ].map(tier => (
                  <div key={tier.label}>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 pt-2 pb-1">{tier.label}</div>
                    <div className="space-y-1.5">
                      {tier.worlds.map(world => {
                        const isReached = highestLevel >= world.levelRange[0];
                        const isCurrent = world.id === currentWorld.id;
                        const maxLevelInWorld = world.levelRange[1] === Infinity ? '...' : world.levelRange[1];
                        const levelsInWorld = world.levelRange[1] === Infinity
                          ? Math.max(0, highestLevel - world.levelRange[0] + 1)
                          : world.levelRange[1] - world.levelRange[0] + 1;
                        const levelsCleared = Math.max(0, Math.min(
                          highestLevel - world.levelRange[0] + 1,
                          world.levelRange[1] === Infinity ? Infinity : levelsInWorld
                        ));
                        const progress = world.levelRange[1] === Infinity
                          ? -1
                          : Math.min(100, Math.max(0, (levelsCleared / levelsInWorld) * 100));

                        return (
                          <div
                            key={world.id}
                            className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${
                              isCurrent
                                ? 'bg-emerald-50 border-2 border-emerald-400'
                                : isReached
                                  ? 'border-2 border-slate-200'
                                  : 'opacity-50 border-2 border-slate-200'
                            }`}
                          >
                            <div
                              className="w-9 h-9 rounded-lg flex-shrink-0 border border-slate-200 flex items-center justify-center"
                              style={{ backgroundColor: world.bgColor }}
                            >
                              {!isReached ? (
                                <LockIcon size={14} className="text-slate-400" />
                              ) : isCurrent ? (
                                <MapPinIcon size={14} className="text-emerald-600" />
                              ) : null}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-700">{world.name}</span>
                                {isCurrent && (
                                  <span className="text-[9px] font-bold bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">NOW</span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                Levels {world.levelRange[0]} - {maxLevelInWorld}
                              </div>
                              {isReached && progress >= 0 && (
                                <div className="w-full bg-emerald-100 rounded-full h-1.5 mt-1 overflow-hidden border border-emerald-200">
                                  <div
                                    className="bg-emerald-400 h-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
