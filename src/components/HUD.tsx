import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { BASE_MAX_HUNGER, softCap } from '../lib/constants';
import { StarIcon, GearIcon } from './icons';
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
    levelComplete, levelFailed, reviveOffered,
    swipeStreak, frenzyDashActive, frenzyDashTimer } = useGameStore();

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
  const worldProgress = currentLevel - world.levelRange[0] + 1;
  const worldTotal = Number.isFinite(world.levelRange[1])
    ? world.levelRange[1] - world.levelRange[0] + 1
    : null;

  const hungerSyn = 1 + (upgrades.hungerSynergy || 0) * 0.5;
  const maxHunger = (BASE_MAX_HUNGER + softCap(upgrades.hungerMax || 0) * 20) * hungerSyn;

  const hungerPercent = Math.max(0, Math.min(100, (hunger / maxHunger) * 100));
  const hungerLow = hungerPercent < 20;
  const itemsPercent = levelItemsTotal > 0
    ? Math.max(0, Math.min(100, (levelItemsEaten / levelItemsTotal) * 100))
    : 0;

  return (
    <>
    <div className="absolute top-0 left-0 right-0 p-4 pt-safe-extra flex flex-col gap-2 pointer-events-none z-10">
      {/* Top row: Level left | $ centered | Settings right */}
      <div className="flex items-center relative">
        {/* Left: Level */}
        <div className="flex flex-col shrink-0">
          <div className="text-2xl font-black text-slate-800 drop-shadow-sm leading-tight">
            Level {currentLevel}
          </div>
          <div className="text-xs font-semibold text-slate-500 -mt-0.5 font-body flex items-center gap-1.5">
            <span>{world.name}</span>
            {worldTotal && (
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
                {worldProgress}/{worldTotal}
              </span>
            )}
          </div>
          {essence > 0 && (
            <div className="flex items-center gap-1 text-purple-500 text-xs font-bold mt-0.5">
              <StarIcon size={12} />
              {essence} Essence
            </div>
          )}
        </div>

        {/* Center: Money (absolutely centered on screen) */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div key={flashKey} className="text-lg font-black text-emerald-600 bg-white border-2 border-emerald-400 px-2.5 py-0.5 rounded-full shadow-md shadow-emerald-200/30 money-flash leading-tight">
            ${fmt(money)}
          </div>
          {moneyPerSecond > 0 && (
            <div className="text-[11px] font-bold text-emerald-500/80">
              ${fmt(moneyPerSecond)}/s
            </div>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right: Settings button */}
        <button
          onClick={() => setSettingsOpen(true)}
          className="btn-bar-icon pointer-events-auto p-2.5 bg-slate-300 text-white rounded-full border-2 border-slate-400 border-b-slate-500 hover:bg-slate-200 active:scale-95 shrink-0"
          aria-label="Settings"
        >
          <GearIcon size={24} />
        </button>
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
            levelComplete ? 'bg-emerald-500' : (levelFailed || reviveOffered) ? 'bg-red-500' : 'bg-blue-500'
          }`}
          style={{ width: `${levelComplete ? 100 : itemsPercent}%` }}
        />
        <span
          className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white"
          style={{ textShadow: '-1px -1px 0 rgba(0,0,0,0.35), 1px -1px 0 rgba(0,0,0,0.35), -1px 1px 0 rgba(0,0,0,0.35), 1px 1px 0 rgba(0,0,0,0.35)' }}
        >
          {levelComplete ? 'LEVEL CLEAR!' : (levelFailed || reviveOffered) ? 'STARVED!' : `ITEMS ${levelItemsEaten} / ${levelItemsTotal}`}
        </span>
      </div>

      {/* Swipe-streak meter */}
      <div className={`w-full bg-pink-200 rounded-full h-3 overflow-hidden relative border-2 ${frenzyDashActive ? 'border-pink-500 animate-pulse' : 'border-pink-300'}`}>
        <div
          className={`h-full transition-all duration-150 ease-out ${
            frenzyDashActive
              ? 'bg-gradient-to-r from-pink-500 via-amber-400 to-pink-500'
              : swipeStreak >= 75
                ? 'bg-pink-500'
                : swipeStreak >= 50
                  ? 'bg-orange-500'
                  : 'bg-amber-400'
          }`}
          style={{ width: `${frenzyDashActive ? 100 : Math.max(0, Math.min(100, swipeStreak))}%` }}
        />
        <span
          className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-white tracking-widest"
          style={{ textShadow: '-1px -1px 0 rgba(0,0,0,0.35), 1px -1px 0 rgba(0,0,0,0.35), -1px 1px 0 rgba(0,0,0,0.35), 1px 1px 0 rgba(0,0,0,0.35)' }}
        >
          {frenzyDashActive ? `FRENZY DASH ${frenzyDashTimer.toFixed(1)}s` : 'SWIPE STREAK'}
        </span>
      </div>
    </div>
    <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
