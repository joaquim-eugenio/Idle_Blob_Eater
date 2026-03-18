import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { GEM_SHOP_ITEMS, BLOB_SKINS } from '../lib/constants';
import { Gem, X, Palette, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function GemShop() {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<'shop' | 'skins'>('shop');
  const gems = useGameStore(s => s.gems);
  const purchased = useGameStore(s => s.purchasedGemItems);
  const unlockedSkins = useGameStore(s => s.unlockedSkins);
  const currentSkin = useGameStore(s => s.currentSkin);
  const buyGemShopItem = useGameStore(s => s.buyGemShopItem);
  const buyBlobSkin = useGameStore(s => s.buyBlobSkin);
  const setSkin = useGameStore(s => s.setSkin);

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

              <div className="flex border-b border-slate-200">
                <button
                  onClick={() => setTab('shop')}
                  className={`flex-1 py-2.5 text-sm font-bold transition-colors flex items-center justify-center gap-1.5 ${
                    tab === 'shop' ? 'text-purple-600 border-b-2 border-purple-500' : 'text-slate-400'
                  }`}
                >
                  <ShoppingBag size={16} /> Shop
                </button>
                <button
                  onClick={() => setTab('skins')}
                  className={`flex-1 py-2.5 text-sm font-bold transition-colors flex items-center justify-center gap-1.5 ${
                    tab === 'skins' ? 'text-purple-600 border-b-2 border-purple-500' : 'text-slate-400'
                  }`}
                >
                  <Palette size={16} /> Skins
                </button>
              </div>

              <div className="flex-1 overflow-auto p-4 space-y-2">
                {tab === 'shop' && GEM_SHOP_ITEMS.map(item => {
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

                {tab === 'skins' && BLOB_SKINS.filter(s => s.id !== 'default').map(skin => {
                  const owned = unlockedSkins.includes(skin.id);
                  const isActive = currentSkin === skin.id;
                  const canAfford = gems >= skin.cost;
                  return (
                    <div key={skin.id} className="bg-white rounded-xl p-4 border border-slate-200 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-full flex-shrink-0" style={{
                          background: `linear-gradient(135deg, ${skin.colors.join(', ')})`,
                        }} />
                        <div>
                          <div className="font-bold text-sm text-slate-800">{skin.name}</div>
                          {isActive && <div className="text-xs text-purple-500 font-semibold">Equipped</div>}
                        </div>
                      </div>
                      {owned ? (
                        <button
                          onClick={() => setSkin(isActive ? 'default' : skin.id)}
                          className={`px-3 py-2 rounded-lg font-bold text-sm transition-all ${
                            isActive
                              ? 'bg-purple-100 text-purple-600'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {isActive ? 'Unequip' : 'Equip'}
                        </button>
                      ) : (
                        <button
                          onClick={() => buyBlobSkin(skin.id)}
                          disabled={!canAfford}
                          className={`px-3 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all flex items-center gap-1.5 ${
                            canAfford
                              ? 'bg-purple-500 text-white hover:bg-purple-600 active:scale-95'
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          <Gem size={14} />{skin.cost}
                        </button>
                      )}
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
