import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { GEM_SHOP_ITEMS } from '../lib/constants';
import { Gem, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function GemShop() {
  const [isOpen, setIsOpen] = useState(false);
  const gems = useGameStore(s => s.gems);
  const purchased = useGameStore(s => s.purchasedGemItems);
  const buyGemShopItem = useGameStore(s => s.buyGemShopItem);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2.5 bg-purple-500/90 text-white rounded-full shadow-md hover:bg-purple-400 active:scale-95 transition-all"
      >
        <Gem size={18} />
        <div className="absolute -top-1 -right-1 bg-purple-300 text-purple-900 text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
          {gems}
        </div>
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
              <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <div>
                  <h2 className="text-xl font-black tracking-tight">Gem Shop</h2>
                  <div className="text-sm opacity-90 flex items-center gap-1.5 mt-0.5">
                    <Gem size={14} /><span>{gems} Gems</span>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                  <X size={22} />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-4 space-y-2">
                {GEM_SHOP_ITEMS.map(item => {
                  const owned = item.type === 'permanent' && purchased.includes(item.id);
                  const canAfford = gems >= item.cost;
                  return (
                    <div key={item.id} className="bg-white rounded-xl p-4 border border-slate-200 flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="font-bold text-sm text-slate-800">{item.name}</div>
                        <div className="text-xs text-slate-500">{item.desc}</div>
                      </div>
                      <button
                        onClick={() => buyGemShopItem(item.id)}
                        disabled={owned || !canAfford}
                        className={`px-3 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all flex items-center gap-1.5 ${
                          owned
                            ? 'bg-green-100 text-green-600 cursor-default'
                            : canAfford
                              ? 'bg-purple-500 text-white hover:bg-purple-600 active:scale-95'
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {owned ? 'Owned' : <><Gem size={14} />{item.cost}</>}
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
