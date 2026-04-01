import { GameIcon, type GameIconProps } from './GameIcon';

export function GearIcon({ size, className, style }: GameIconProps) {
  return (
    <GameIcon size={size} className={className} style={style}>
      <defs>
        <linearGradient id="gear-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#94A3B8" />
          <stop offset="50%" stopColor="#64748B" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>
      <path d="M21 6h6l1 4 3 1 3-2 4 4-2 3 1 3 4 1v6l-4 1-1 3 2 3-4 4-3-2-3 1-1 4h-6l-1-4-3-1-3 2-4-4 2-3-1-3-4-1v-6l4-1 1-3-2-3 4-4 3 2 3-1z" fill="url(#gear-body)" stroke="#334155" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="24" cy="24" r="7" fill="#334155" stroke="#1E293B" strokeWidth="2" />
      <circle cx="24" cy="24" r="4" fill="#64748B" />
      <ellipse cx="20" cy="14" rx="3" ry="2.5" fill="rgba(255,255,255,0.25)" />
    </GameIcon>
  );
}
