import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { BIOMES } from '../lib/constants';
import { Globe, Lock, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function BiomeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const currentBiome = useGameStore(s => s.currentBiome);
  const totalPrestiges = useGameStore(s => s.stats.totalPrestiges);
  const setBiome = useGameStore(s => s.setBiome);

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
                <h2 className="text-xl font-black text-slate-800">Biome Selector</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                  aria-label="Close biome selector"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-3 space-y-2 flex-1 overflow-auto">
                {BIOMES.map(biome => {
                  const unlocked = biome.requiredPrestiges <= totalPrestiges;
                  const isActive = biome.id === currentBiome;
                  return (
                    <button
                      key={biome.id}
                      onClick={() => { if (unlocked) { setBiome(biome.id); setIsOpen(false); } }}
                      disabled={!unlocked}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                        isActive
                          ? 'bg-emerald-50 border border-emerald-200'
                          : unlocked
                            ? 'hover:bg-slate-50 border border-slate-200'
                            : 'opacity-50 cursor-not-allowed border border-slate-200'
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex-shrink-0 border border-slate-200"
                        style={{ backgroundColor: biome.bgColor }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-slate-700">{biome.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {biome.bonus.value > 0
                            ? `+${Math.round(biome.bonus.value * 100)}% ${biome.bonus.type}`
                            : 'No bonus'}
                        </div>
                      </div>
                      {!unlocked && <Lock size={14} className="text-slate-400 flex-shrink-0" />}
                      {isActive && <Check size={14} className="text-emerald-500 flex-shrink-0" />}
                    </button>
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
