import { useGameStore } from '../store/gameStore';
import { BASE_MAX_HUNGER } from '../lib/constants';
import { PlaySquare } from 'lucide-react';

export function HUD() {
  const { level, hunger, foodEaten, money, upgrades, boostActive, activateBoost } = useGameStore();
  
  const maxTier = Math.floor((level - 1) / 3) + 1;
  const hungerSyn = 1 + (upgrades.hungerSynergy || 0) * 0.5;
  const maxHunger = (BASE_MAX_HUNGER + (upgrades.hungerMax || 0) * 30) * hungerSyn;
  const foodToNextLevel = 40 * level;
  
  const hungerPercent = Math.max(0, Math.min(100, (hunger / maxHunger) * 100));
  const levelPercent = Math.max(0, Math.min(100, (foodEaten / foodToNextLevel) * 100));

  return (
    <div className="absolute top-0 left-0 right-0 p-4 pt-safe flex flex-col gap-2 pointer-events-none z-10">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <div className="text-2xl font-bold text-slate-800 drop-shadow-sm">
            Level {level}
          </div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Tier {maxTier} Blob
          </div>
        </div>
        <div className="text-xl font-bold text-emerald-600 bg-white/80 px-3 py-1 rounded-full shadow-sm backdrop-blur-sm">
          ${Math.floor(money)}
        </div>
      </div>
      
      {/* Hunger Bar */}
      <div className="w-full bg-slate-200 rounded-full h-4 shadow-inner overflow-hidden relative">
        <div 
          className="bg-rose-500 h-full transition-all duration-200 ease-out"
          style={{ width: `${hungerPercent}%` }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-md">
          HUNGER
        </span>
      </div>

      {/* Level Bar */}
      <div className="w-full bg-slate-200 rounded-full h-3 shadow-inner overflow-hidden relative mt-1">
        <div 
          className="bg-blue-500 h-full transition-all duration-200 ease-out"
          style={{ width: `${levelPercent}%` }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white drop-shadow-md">
          SIZE
        </span>
      </div>

      {/* Monetization / Ad Boost Button */}
      <div className="flex justify-end mt-4 pointer-events-auto">
        <button 
          onClick={activateBoost}
          disabled={boostActive}
          className={`px-3 py-2 rounded-xl font-bold text-sm shadow-md flex items-center gap-2 transition-all ${
            boostActive 
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
              : 'bg-amber-400 text-amber-900 hover:bg-amber-300 active:scale-95'
          }`}
        >
          <PlaySquare size={16} />
          {boostActive ? 'Boost Active!' : 'Ad: 3x Boost'}
        </button>
      </div>
    </div>
  );
}
