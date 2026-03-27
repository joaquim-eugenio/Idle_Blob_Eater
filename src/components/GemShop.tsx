import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { GEM_SHOP_ITEMS } from '../lib/constants';
import { Diamond, X } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'motion/react';

export function GemShop() {
  const [isOpen, setIsOpen] = useState(false);
  const gems = useGameStore(s => s.gems);
  const purchased = useGameStore(s => s.purchasedGemItems);
  const buyGemShopItem = useGameStore(s => s.buyGemShopItem);

  return (
    <>
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={() => setIsOpen(true)}
          className="relative p-2.5 bg-purple-500 text-white rounded-full border-2 border-purple-600 shadow-md shadow-purple-200/30 hover:bg-purple-400 active:scale-95 transition-all"
        >
          <Diamond size={18} />
          <div className="absolute -top-1 -right-1 bg-purple-300 text-purple-900 text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
            {gems}
          </div>
        </button>
        <span className="text-[10px] font-bold text-purple-600">Gems</span>
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
              className="bg-white w-full max-w-lg rounded-3xl border-3 border-purple-400 shadow-lg shadow-purple-200/40 overflow-hidden flex flex-col max-h-[88dvh]"
            >
              <div className="p-5 flex justify-between items-center bg-purple-500 text-white">
                <div>
                  <h2 className="text-xl font-black tracking-tight">Gem Shop</h2>
                  <div className="text-sm opacity-90 flex items-center gap-1.5 mt-0.5 font-body">
                    <Diamond size={14} /><span>{gems} Gems</span>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 border-2 border-white/50 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                  <X size={22} />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-4 space-y-2">
                {GEM_SHOP_ITEMS.map(item => {
                  const owned = item.type === 'permanent' && purchased.includes(item.id);
                  const canAfford = gems >= item.cost;
                  return (
                    <div key={item.id} className="bg-purple-50/50 rounded-xl p-4 border-2 border-purple-200 flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="font-bold text-sm text-slate-800">{item.name}</div>
                        <div className="text-xs text-slate-500 font-body">{item.desc}</div>
                      </div>
                      <button
                        onClick={() => buyGemShopItem(item.id)}
                        disabled={owned || !canAfford}
                        className={`btn-game px-3 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all flex items-center gap-1.5 ${
                          owned
                            ? 'bg-green-100 text-green-600 border-b-4 border-green-200 cursor-default'
                            : canAfford
                              ? 'bg-purple-500 text-white border-b-4 border-purple-700 hover:bg-purple-600'
                              : 'bg-slate-100 text-slate-400 border-b-4 border-slate-200 cursor-not-allowed'
                        }`}
                      >
                        {owned ? 'Owned' : <><Diamond size={14} />{item.cost}</>}
                      </button>
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
