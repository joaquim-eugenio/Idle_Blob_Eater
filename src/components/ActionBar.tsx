import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { ACTIVE_ABILITIES, ABILITY_CHARGES, AD_RECHARGE_COOLDOWN_MS, type AbilityId } from '../lib/constants';
import { MagnetIcon, BoltIcon, ExpandIcon, CloudRainIcon, LockIcon, ArrowIcon, SpinnerIcon } from './icons';
import type { GameIconProps } from './icons';
import { canShowAdForAbility, adCooldownRemaining } from '../lib/ads';

const ICON_MAP: Record<string, React.FC<GameIconProps>> = {
  Magnet: MagnetIcon, Zap: BoltIcon, Maximize: ExpandIcon, CloudRain: CloudRainIcon,
};

const ABILITY_COLORS: Record<AbilityId, { bg: string; glow: string; active: string }> = {
  magnet: { bg: 'bg-purple-500', glow: 'shadow-purple-400/60', active: 'border-purple-300' },
  speed:  { bg: 'bg-amber-500',  glow: 'shadow-amber-400/60',  active: 'border-amber-300'  },
  size:   { bg: 'bg-cyan-500',   glow: 'shadow-cyan-400/60',   active: 'border-cyan-300'   },
  food:   { bg: 'bg-emerald-500', glow: 'shadow-emerald-400/60', active: 'border-emerald-300' },
};

export function ActionBar() {
  const abilities = useGameStore((s) => s.abilities);
  const abilityCharges = useGameStore((s) => s.abilityCharges);
  const lastAdRechargeTime = useGameStore((s) => s.lastAdRechargeTime);
  const activateAbility = useGameStore((s) => s.activateAbility);
  const rechargeAbility = useGameStore((s) => s.rechargeAbility);
  const highestLevel = useGameStore((s) => s.highestLevelReached);
  const levelComplete = useGameStore((s) => s.levelComplete);
  const levelFailed = useGameStore((s) => s.levelFailed);
  const reviveOffered = useGameStore((s) => s.reviveOffered);

  const [rechargingId, setRechargingId] = useState<AbilityId | null>(null);
  const [adCooldowns, setAdCooldowns] = useState<Record<AbilityId, number>>({
    magnet: 0, speed: 0, size: 0, food: 0,
  });

  useEffect(() => {
    const hasAnyCooldown = Object.values(lastAdRechargeTime).some(
      (t) => t > 0 && Date.now() - t < AD_RECHARGE_COOLDOWN_MS
    );
    if (!hasAnyCooldown) return;

    const interval = setInterval(() => {
      const next: Record<string, number> = {};
      let anyActive = false;
      for (const id of ['magnet', 'speed', 'size', 'food'] as AbilityId[]) {
        const remaining = adCooldownRemaining(id, lastAdRechargeTime);
        next[id] = remaining;
        if (remaining > 0) anyActive = true;
      }
      setAdCooldowns(next as Record<AbilityId, number>);
      if (!anyActive) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [lastAdRechargeTime]);

  const handleClick = async (id: AbilityId, charges: number, ready: boolean) => {
    if (rechargingId) return;

    if (charges > 0 && ready) {
      activateAbility(id);
      return;
    }

    if (charges <= 0 && !canShowAdForAbility(id, lastAdRechargeTime)) return;
    if (charges <= 0) {
      setRechargingId(id);
      try {
        await rechargeAbility(id);
      } finally {
        setRechargingId(null);
      }
    }
  };

  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-[5] flex items-center gap-2 pointer-events-none">
      {ACTIVE_ABILITIES.map((def) => {
        const id = def.id as AbilityId;
        const ab = abilities[id];
        const charges = abilityCharges[id];
        const maxCharges = ABILITY_CHARGES[id].maxCharges;
        const Icon = ICON_MAP[def.icon];
        const colors = ABILITY_COLORS[id];
        const locked = highestLevel < def.unlockLevel;
        const empty = charges <= 0;
        const isRecharging = rechargingId === id;
        const adOnCooldown = !canShowAdForAbility(id, lastAdRechargeTime);
        const adCdSec = Math.ceil(adCooldowns[id] / 1000);

        const ready = !locked && !empty && ab.cooldown <= 0 && !ab.active
          && !levelComplete && !levelFailed && !reviveOffered;
        const onCooldown = !locked && !empty && ab.cooldown > 0 && !ab.active;

        const cooldownFraction = onCooldown ? ab.cooldown / def.cooldown : 0;
        const circumference = Math.PI * 44;

        const isLowCharge = charges === 1 && !locked;
        const canTap = locked ? false
          : empty ? (!adOnCooldown && !isRecharging)
          : ready;

        return (
          <button
            key={id}
            onClick={() => {
              if (!locked) handleClick(id, charges, ready);
            }}
            disabled={locked || (!canTap && !onCooldown && !ab.active)}
            className={`ability-btn-game relative w-[52px] h-[52px] rounded-full flex items-center justify-center pointer-events-auto ${
              locked
                ? 'bg-slate-700/80 border-2 border-slate-600 cursor-not-allowed'
                : isRecharging
                  ? 'bg-slate-600/90 border-2 border-amber-400 animate-pulse cursor-wait'
                  : empty
                    ? 'bg-slate-700/90 border-2 border-amber-400/60'
                    : ab.active
                      ? `${colors.bg} border-[3px] ${colors.active} animate-pulse ring-2 ring-white/30`
                      : ready
                        ? `${colors.bg} border-2 border-white/50`
                        : `bg-slate-500/80 border-2 border-slate-400/30 cursor-not-allowed`
            }`}
          >
            {locked ? (
              <LockIcon size={18} className="text-slate-400" />
            ) : isRecharging ? (
              <SpinnerIcon size={20} className="text-amber-300 animate-spin" />
            ) : empty ? (
              <ArrowIcon size={20} direction="refresh" className="text-amber-300" />
            ) : (
              <Icon size={20} className="text-white drop-shadow-md" />
            )}

            {onCooldown && (
              <>
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 52 52">
                  <circle
                    cx="26" cy="26" r="22"
                    fill="none"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="3"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - cooldownFraction)}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[11px] font-black text-white/90 drop-shadow-md">
                  {Math.ceil(ab.cooldown)}
                </span>
              </>
            )}

            {ab.active && def.duration > 0 && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-white text-[9px] font-black text-slate-800 shadow-sm">
                {Math.ceil(ab.timer)}s
              </span>
            )}

            {locked && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-slate-600 text-[9px] font-bold text-slate-300 whitespace-nowrap">
                Lv.{def.unlockLevel}
              </span>
            )}

            {/* Charge badge */}
            {!locked && !empty && (
              <span className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-black flex items-center justify-center shadow-sm ${
                charges === maxCharges
                  ? 'bg-emerald-400 text-white'
                  : isLowCharge
                    ? 'bg-amber-400 text-amber-900 animate-pulse'
                    : 'bg-white/90 text-slate-700'
              }`}>
                {charges}
              </span>
            )}

            {/* Empty state: refill amount or ad cooldown timer */}
            {!locked && empty && !isRecharging && (
              adOnCooldown && adCdSec > 0 ? (
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-slate-600 text-[9px] font-bold text-slate-300 whitespace-nowrap">
                  {adCdSec}s
                </span>
              ) : (
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-amber-400 text-[9px] font-black text-amber-900 whitespace-nowrap shadow-sm">
                  +{ABILITY_CHARGES[id].adRefillAmount}
                </span>
              )
            )}
          </button>
        );
      })}
    </div>
  );
}
