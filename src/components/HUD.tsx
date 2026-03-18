import { useGameStore } from '../store/gameStore';
import { BASE_MAX_HUNGER, softCap } from '../lib/constants';
import { PlaySquare, Sparkles } from 'lucide-react';
import { AchievementPanel } from './AchievementPanel';
import { StatsPanel } from './StatsPanel';
import { GemShop } from './GemShop';
import { BiomeSelector } from './BiomeSelector';

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return Math.floor(n).toLocaleString();
}

export function HUD() {
  const { level, hunger, foodEaten, money, upgrades, boostActive, activateBoost,
    moneyPerSecond, essence, comboCount, unlockedSkillNodes, skillFlashEvents, dismissSkillFlashEvent } = useGameStore();

  const hungerSyn = 1 + (upgrades.hungerSynergy || 0) * 0.5;
  const maxHunger = (BASE_MAX_HUNGER + softCap(upgrades.hungerMax || 0) * 20) * hungerSyn;
  const foodToNextLevel = 25 * Math.pow(2.2, level - 1);

  const hungerPercent = Math.max(0, Math.min(100, (hunger / maxHunger) * 100));
  const levelPercent = Math.max(0, Math.min(100, (foodEaten / foodToNextLevel) * 100));
  const activeTraitTags = [
    unlockedSkillNodes.includes('hunt_dash_on_star') ? 'Star Dash' : null,
    unlockedSkillNodes.includes('feast_overkill') ? 'Overkill Cash' : null,
    unlockedSkillNodes.includes('survival_frenzy') ? 'Frenzy' : null,
    unlockedSkillNodes.includes('auto_tap_drone') ? 'Auto Tap' : null,
    unlockedSkillNodes.includes('gate_b_unlock') ? 'Chapter 3' : null,
  ].filter(Boolean) as string[];

  return (
    <div className="absolute top-0 left-0 right-0 p-4 pt-safe flex flex-col gap-2 pointer-events-none z-10">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <div className="text-2xl font-bold text-slate-800 drop-shadow-sm">
            Level {level}
          </div>
          {essence > 0 && (
            <div className="flex items-center gap-1 text-purple-500 text-xs font-bold mt-0.5">
              <Sparkles size={12} />
              {essence} Essence
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <div className="text-xl font-bold text-emerald-600 bg-white/80 px-3 py-1 rounded-full shadow-sm backdrop-blur-sm">
            ${fmt(money)}
          </div>
          {moneyPerSecond > 0 && (
            <div className="text-[11px] font-bold text-emerald-500/80 px-2">
              ${fmt(moneyPerSecond)}/s
            </div>
          )}
        </div>
      </div>

      {activeTraitTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 justify-center pointer-events-none">
          {activeTraitTags.map((tag) => (
            <span key={tag} className="text-[10px] sm:text-xs bg-indigo-500/90 text-white px-2 py-0.5 rounded-full shadow-sm">
              {tag}
            </span>
          ))}
        </div>
      )}

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
          LEVEL
        </span>
      </div>

      {/* Combo indicator */}
      {comboCount >= 3 && (
        <div className="text-center mt-1">
          <span className={`inline-block text-white font-black text-sm px-3 py-0.5 rounded-full shadow-md animate-pulse ${
            comboCount >= 10 ? 'bg-red-500' : comboCount >= 5 ? 'bg-orange-500' : 'bg-amber-500'
          }`}>
            x{Math.min(comboCount, 10)} COMBO!
          </span>
        </div>
      )}

      {/* Action buttons row */}
      <div className="flex flex-wrap justify-between items-center mt-3 pointer-events-auto gap-2">
        <div className="flex gap-2 flex-wrap">
          <AchievementPanel />
          <StatsPanel />
          <GemShop />
          <BiomeSelector />
        </div>
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

      {skillFlashEvents.length > 0 && (
        <div className="pointer-events-auto flex justify-center mt-1">
          <button
            onClick={() => dismissSkillFlashEvent(skillFlashEvents[0])}
            className="text-[10px] sm:text-xs font-bold bg-blue-600 text-white px-3 py-1 rounded-full shadow-md animate-pulse"
          >
            {skillFlashEvents[0].startsWith('gate:') ? 'Gate Breakthrough!' : 'New Skill Unlocked!'}
          </button>
        </div>
      )}
    </div>
  );
}
