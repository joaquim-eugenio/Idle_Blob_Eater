import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { BASE_MAX_HUNGER, softCap } from '../lib/constants';
import { Sparkle, GearSix } from '@phosphor-icons/react';
import { getWorldForLevel } from '../lib/levels';
import { SettingsPanel } from './SettingsPanel';

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return Math.floor(n).toLocaleString();
}

export function HUD() {
  const { currentLevel, hunger, levelItemsEaten, levelItemsTotal, money, upgrades,
    moneyPerSecond, essence,
    levelComplete, levelFailed } = useGameStore();

  const prevMoney = useRef(money);
  const [flashKey, setFlashKey] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    if (money > prevMoney.current) {
      setFlashKey((k) => k + 1);
    }
    prevMoney.current = money;
  }, [money]);

  const world = getWorldForLevel(currentLevel);

  const hungerSyn = 1 + (upgrades.hungerSynergy || 0) * 0.5;
  const maxHunger = (BASE_MAX_HUNGER + softCap(upgrades.hungerMax || 0) * 20) * hungerSyn;

  const hungerPercent = Math.max(0, Math.min(100, (hunger / maxHunger) * 100));
  const hungerLow = hungerPercent < 20;
  const itemsPercent = levelItemsTotal > 0
    ? Math.max(0, Math.min(100, (levelItemsEaten / levelItemsTotal) * 100))
    : 0;

  return (
    <>
    <div className="absolute top-0 left-0 right-0 p-4 pt-safe flex flex-col gap-2 pointer-events-none z-10">
      <div className="flex justify-between items-start relative">
        <div className="flex flex-col">
          <div className="text-2xl font-black text-slate-800 drop-shadow-sm">
            Level {currentLevel}
          </div>
          <div className="text-xs font-semibold text-slate-500 -mt-0.5 font-body">
            {world.name}
          </div>
          {essence > 0 && (
            <div className="flex items-center gap-1 text-purple-500 text-xs font-bold mt-0.5">
              <Sparkle size={12} />
              {essence} Essence
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-0.5">
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-1.5 text-slate-400 hover:text-slate-600 pointer-events-auto transition-colors"
            aria-label="Settings"
          >
            <GearSix size={18} />
          </button>
          <div key={flashKey} className="text-xl font-black text-emerald-600 bg-white border-2 border-emerald-400 px-3 py-1 rounded-full shadow-md shadow-emerald-200/30 money-flash">
            ${fmt(money)}
          </div>
          {moneyPerSecond > 0 && (
            <div className="text-[11px] font-bold text-emerald-500/80 px-2">
              ${fmt(moneyPerSecond)}/s
            </div>
          )}
        </div>
      </div>

      {/* Hunger Bar */}
      <div className={`w-full bg-rose-300 rounded-full h-5 overflow-hidden relative border-2 border-rose-400 ${hungerLow ? 'animate-pulse' : ''}`}>
        <div
          className={`h-full transition-all duration-200 ease-out ${hungerLow ? 'bg-red-500' : 'bg-rose-500'}`}
          style={{ width: `${hungerPercent}%` }}
        />
        <span
          className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white"
          style={{ textShadow: '-1px -1px 0 rgba(0,0,0,0.35), 1px -1px 0 rgba(0,0,0,0.35), -1px 1px 0 rgba(0,0,0,0.35), 1px 1px 0 rgba(0,0,0,0.35)' }}
        >
          HUNGER
        </span>
      </div>

      {/* Items Progress Bar */}
      <div className="w-full bg-blue-300 rounded-full h-4 overflow-hidden relative border-2 border-blue-400">
        <div
          className={`h-full transition-all duration-200 ease-out ${
            levelComplete ? 'bg-emerald-500' : levelFailed ? 'bg-red-500' : 'bg-blue-500'
          }`}
          style={{ width: `${levelComplete ? 100 : itemsPercent}%` }}
        />
        <span
          className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white"
          style={{ textShadow: '-1px -1px 0 rgba(0,0,0,0.35), 1px -1px 0 rgba(0,0,0,0.35), -1px 1px 0 rgba(0,0,0,0.35), 1px 1px 0 rgba(0,0,0,0.35)' }}
        >
          {levelComplete ? 'LEVEL CLEAR!' : levelFailed ? 'STARVED!' : `ITEMS ${levelItemsEaten} / ${levelItemsTotal}`}
        </span>
      </div>

    </div>
    <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
