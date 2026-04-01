import { GameIcon, type GameIconProps } from './GameIcon';

export function TVIcon({ size, className, style }: GameIconProps) {
  return (
    <GameIcon size={size} className={className} style={style}>
      <defs>
        <linearGradient id="tv-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
        <linearGradient id="tv-screen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#BFDBFE" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>
      </defs>
      <rect x="6" y="10" width="36" height="26" rx="4" fill="url(#tv-body)" stroke="#334155" strokeWidth="2.5" />
      <rect x="10" y="14" width="28" height="18" rx="2" fill="url(#tv-screen)" stroke="#1E40AF" strokeWidth="1.5" />
      <polygon points="20,20 20,28 28,24" fill="white" stroke="#1E40AF" strokeWidth="1" opacity="0.8" />
      <rect x="18" y="38" width="12" height="4" rx="1" fill="#475569" stroke="#334155" strokeWidth="1.5" />
      <ellipse cx="16" cy="18" rx="4" ry="3" fill="rgba(255,255,255,0.2)" />
    </GameIcon>
  );
}
