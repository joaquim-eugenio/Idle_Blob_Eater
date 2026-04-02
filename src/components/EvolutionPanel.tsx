import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { EVOLUTION_UPGRADES } from '../lib/constants';
import { Sparkles, X, ArrowUp, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function EvolutionPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const essence = useGameStore(s => s.essence);
  const currentRunMoney = useGameStore(s => s.currentRunMoney);
  const evo = useGameStore(s => s.evolutionUpgrades);
  const level = useGameStore(s => s.currentLevel);
  const prestige = useGameStore(s => s.prestige);
  const buyEvolutionUpgrade = useGameStore(s => s.buyEvolutionUpgrade);

  const essenceToGain = Math.max(1, Math.floor(Math.sqrt(currentRunMoney / 500)));
  const canPrestige = level >= 5;

  return (
    <>
      <div className="absolute bottom-8 left-8 z-[5]">
        <button
          onClick={() => setIsOpen(true)}
          className="relative w-16 h-16 bg-purple-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-purple-600 active:scale-95 transition-all"
        >
          <Sparkles size={28} />
          {essence > 0 && (
            <div className="absolute -top-1 -right-1 bg-purple-300 text-purple-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
              {essence}
            </div>
          )}
        </button>
      </div>

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
              <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                <div>
                  <h2 className="text-xl font-black tracking-tight">Evolution</h2>
                  <div className="text-sm opacity-90 flex items-center gap-1.5 mt-0.5">
                    <Sparkles size={14} />
                    <span>{essence} Essence</span>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                  <X size={22} />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-4 space-y-4">
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-4 border border-purple-200">
                  <div className="flex items-center gap-2 text-purple-700 font-bold text-sm mb-2">
                    <AlertTriangle size={16} />
                    Evolving resets your money, level progress, and upgrades
                  </div>
                  <div className="text-center mb-3">
                    <div className="text-3xl font-black text-purple-600">+{essenceToGain}</div>
                    <div className="text-sm text-purple-500">Essence to gain</div>
                  </div>
                  <button
                    onClick={() => { if (canPrestige) { prestige(); } }}
                    disabled={!canPrestige}
                    className={`w-full py-3 rounded-xl font-bold text-lg transition-all ${
                      canPrestige
                        ? 'bg-purple-500 text-white hover:bg-purple-600 active:scale-[0.98] shadow-lg shadow-purple-300'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {canPrestige ? 'Evolve Now' : `Clear Level 5 to Evolve`}
                  </button>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-slate-700 text-sm px-1">Evolution Upgrades</h3>
                  {Object.entries(EVOLUTION_UPGRADES).map(([id, def]) => {
                    const currentLevel = evo[id] || 0;
                    const maxed = currentLevel >= def.maxLevel;
                    const cost = maxed ? 0 : def.cost(currentLevel);
                    const canAfford = essence >= cost && !maxed;

                    return (
                      <div key={id} className="bg-white rounded-xl p-3 border border-slate-200 flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm text-slate-800">{def.name}</div>
                          <div className="text-xs text-slate-500">{def.desc}</div>
                          <div className="text-xs text-purple-500 font-semibold mt-0.5">
                            Lv. {currentLevel}/{def.maxLevel}
                          </div>
                        </div>
                        <button
                          onClick={() => buyEvolutionUpgrade(id)}
                          disabled={!canAfford}
                          className={`px-3 py-1.5 rounded-lg font-bold text-sm whitespace-nowrap transition-all flex items-center gap-1 ${
                            maxed
                              ? 'bg-green-100 text-green-600 cursor-default'
                              : canAfford
                                ? 'bg-purple-500 text-white hover:bg-purple-600 active:scale-95'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {maxed ? 'MAX' : (
                            <>
                              <ArrowUp size={14} />
                              {cost}
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
