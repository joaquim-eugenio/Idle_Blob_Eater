import { useGameStore } from '../store/gameStore';
import { ACTIVE_ABILITIES, type AbilityId } from '../lib/constants';
import { Magnet, Zap, Maximize, CloudRain, Lock } from 'lucide-react';

const ICON_MAP: Record<string, typeof Zap> = {
  Magnet, Zap, Maximize, CloudRain,
};

const ABILITY_COLORS: Record<AbilityId, { bg: string; glow: string; active: string }> = {
  magnet: { bg: 'bg-purple-500', glow: 'shadow-purple-400/60', active: 'border-purple-300' },
  speed:  { bg: 'bg-amber-500',  glow: 'shadow-amber-400/60',  active: 'border-amber-300'  },
  size:   { bg: 'bg-cyan-500',   glow: 'shadow-cyan-400/60',   active: 'border-cyan-300'   },
  food:   { bg: 'bg-emerald-500', glow: 'shadow-emerald-400/60', active: 'border-emerald-300' },
};

export function ActionBar() {
  const abilities = useGameStore((s) => s.abilities);
  const activateAbility = useGameStore((s) => s.activateAbility);
  const highestLevel = useGameStore((s) => s.highestLevelReached);
  const levelComplete = useGameStore((s) => s.levelComplete);
  const levelFailed = useGameStore((s) => s.levelFailed);

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[5] flex items-center gap-2 pointer-events-none">
      {ACTIVE_ABILITIES.map((def) => {
        const id = def.id as AbilityId;
        const ab = abilities[id];
        const Icon = ICON_MAP[def.icon];
        const colors = ABILITY_COLORS[id];
        const locked = highestLevel < def.unlockLevel;
        const ready = !locked && ab.cooldown <= 0 && !ab.active && !levelComplete && !levelFailed;
        const onCooldown = !locked && ab.cooldown > 0 && !ab.active;

        const cooldownFraction = onCooldown ? ab.cooldown / def.cooldown : 0;
        const circumference = Math.PI * 44;

        return (
          <button
            key={id}
            onClick={() => { if (ready) activateAbility(id); }}
            disabled={!ready}
            className={`relative w-[52px] h-[52px] rounded-full flex items-center justify-center transition-all pointer-events-auto ${
              locked
                ? 'bg-slate-700/80 border-2 border-slate-600 cursor-not-allowed'
                : ab.active
                  ? `${colors.bg} border-[3px] ${colors.active} animate-pulse shadow-lg ${colors.glow}`
                  : ready
                    ? `${colors.bg} border-2 border-white/30 shadow-lg ${colors.glow} active:scale-90 hover:brightness-110`
                    : `bg-slate-500/80 border-2 border-slate-400/30 cursor-not-allowed`
            }`}
          >
            {locked ? (
              <Lock size={18} className="text-slate-400" />
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
          </button>
        );
      })}
    </div>
  );
}
