import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { WORLDS, getWorldForLevel } from '../lib/levels';
import { Globe, Lock, MapPin, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function WorldViewer() {
  const [isOpen, setIsOpen] = useState(false);
  const currentLevel = useGameStore(s => s.currentLevel);
  const highestLevel = useGameStore(s => s.highestLevelReached);
  const currentWorld = getWorldForLevel(currentLevel);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2.5 bg-emerald-500/80 text-white rounded-full shadow-md hover:bg-emerald-400 active:scale-95 transition-all"
      >
        <Globe size={18} />
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
              className="bg-white w-full max-w-sm rounded-2xl sm:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[88dvh]"
            >
              <div className="p-5 border-b border-slate-200 flex justify-between items-center">
                <h2 className="text-xl font-black text-slate-800">Worlds</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                  aria-label="Close world viewer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-3 space-y-2 flex-1 overflow-auto">
                {WORLDS.map(world => {
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
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                        isCurrent
                          ? 'bg-emerald-50 border-2 border-emerald-300'
                          : isReached
                            ? 'border border-slate-200'
                            : 'opacity-50 border border-slate-200'
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex-shrink-0 border border-slate-200 flex items-center justify-center"
                        style={{ backgroundColor: world.bgColor }}
                      >
                        {!isReached ? (
                          <Lock size={16} className="text-slate-400" />
                        ) : isCurrent ? (
                          <MapPin size={16} className="text-emerald-600" />
                        ) : null}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-700">{world.name}</span>
                          {isCurrent && (
                            <span className="text-[10px] font-bold bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">NOW</span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Levels {world.levelRange[0]} - {maxLevelInWorld}
                        </div>
                        {isReached && progress >= 0 && (
                          <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1 overflow-hidden">
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
