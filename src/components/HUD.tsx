import { useEffect, useRef, useState } from 'react';
import { useGameStore, computeAutopilotClearRate } from '../store/gameStore';
import { BASE_MAX_HUNGER, BASE_HUNGER_DRAIN, softCap, SKILL_NODE_LOOKUP, AUTOPILOT_DRAIN_MULT } from '../lib/constants';
import { StarIcon, GearIcon, RobotIcon } from './icons';
import { getWorldForLevel } from '../lib/levels';
import { SettingsPanel } from './SettingsPanel';

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return Math.floor(n).toLocaleString();
}

function getSkillEffectsLight(unlockedNodeIds: string[]) {
  let autopilotHungerResist = 0;
  for (const id of unlockedNodeIds) {
    const node = SKILL_NODE_LOOKUP[id];
    if (!node?.effects) continue;
    if (node.effects.autopilotHungerResist) autopilotHungerResist += node.effects.autopilotHungerResist;
  }
  return { autopilotHungerResist };
}

function formatDuration(seconds: number) {
  if (seconds < 60) return `${Math.ceil(seconds)}s`;
  if (seconds < 3600) return `${Math.ceil(seconds / 60)}m`;
  const h = Math.floor(seconds / 3600);
  const m = Math.ceil((seconds % 3600) / 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function HUD() {
  const { currentLevel, hunger, levelItemsEaten, levelItemsTotal, money, upgrades,
    moneyPerSecond, essence,
    levelComplete, levelFailed, reviveOffered,
    unlockedSkillNodes, evolutionUpgrades, achievements } = useGameStore();

  const prevMoney = useRef(money);
  const [flashKey, setFlashKey] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const hasAutopilot = unlockedSkillNodes.includes('auto_autopilot_unlock');
  const showIdleInfo = hasAutopilot && !levelComplete && !levelFailed && !reviveOffered && (levelItemsTotal - levelItemsEaten) > 0;

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


      {/* Autopilot info toast */}
      {showIdleInfo && (
        <AutopilotInfoToast
          currentLevel={currentLevel}
          upgrades={upgrades}
          evolutionUpgrades={evolutionUpgrades}
          unlockedSkillNodes={unlockedSkillNodes}
          achievements={achievements}
          hunger={hunger}
          levelItemsEaten={levelItemsEaten}
          levelItemsTotal={levelItemsTotal}
        />
      )}

    </div>
    <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}

function AutopilotInfoToast({
  currentLevel, upgrades, evolutionUpgrades, unlockedSkillNodes, achievements,
  hunger, levelItemsEaten, levelItemsTotal,
}: {
  currentLevel: number;
  upgrades: any;
  evolutionUpgrades: any;
  unlockedSkillNodes: string[];
  achievements: string[];
  hunger: number;
  levelItemsEaten: number;
  levelItemsTotal: number;
}) {
  const clearRate = computeAutopilotClearRate({ upgrades, evolutionUpgrades, unlockedSkillNodes, achievements });
  const itemsRemaining = levelItemsTotal - levelItemsEaten;
  const estSeconds = itemsRemaining > 0 ? itemsRemaining / clearRate : 0;

  const skillFx = getSkillEffectsLight(unlockedSkillNodes);
  const hungerSyn = 1 + ((upgrades.hungerSynergy as number) || 0) * 0.5;
  const levelFactor = 1 + Math.pow(Math.max(0, currentLevel - 3), 1.4) * 0.065;
  const rawDrain = BASE_HUNGER_DRAIN * levelFactor;
  const evoHungerResist = Math.pow(0.95, evolutionUpgrades.hungerResist || 0);
  const baseDrain = Math.max(0.5, rawDrain * Math.pow(0.95, softCap(upgrades.hungerDrain || 0)) * evoHungerResist) / hungerSyn;
  const autopilotDrain = baseDrain * AUTOPILOT_DRAIN_MULT * Math.max(0, 1 - skillFx.autopilotHungerResist);

  const avgItemValue = 1 + (currentLevel - 1) * 0.03;
  const restorePerItem = avgItemValue * 0.20;
  const netDrainPerSec = autopilotDrain - (clearRate * restorePerItem);
  const survivalSeconds = netDrainPerSec > 0 ? hunger / netDrainPerSec : Infinity;

  let riskLabel: string;
  let dotColor: string;
  if (survivalSeconds === Infinity || survivalSeconds > estSeconds * 1.5) {
    riskLabel = 'Safe';
    dotColor = 'bg-emerald-500';
  } else if (survivalSeconds > estSeconds) {
    riskLabel = 'Risky';
    dotColor = 'bg-amber-500';
  } else {
    riskLabel = 'Danger';
    dotColor = 'bg-red-500';
  }

  return (
    <div className="self-end flex items-center gap-1.5 bg-white/80 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-sm border border-slate-200/80 text-[10px] font-bold">
      <RobotIcon size={11} className="text-indigo-400 shrink-0" />
      <span className="text-slate-500">Auto ~{formatDuration(estSeconds)}</span>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
      <span className="text-slate-500">{riskLabel}</span>
    </div>
  );
}
