import { GameIcon, type GameIconProps } from './GameIcon';

export function LockIcon({ size, className, style }: GameIconProps) {
  return (
    <GameIcon size={size} className={className} style={style}>
      <defs>
        <linearGradient id="lock-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="50%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>
        <linearGradient id="lock-shackle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>
      <path d="M15 20V16c0-5 4-9 9-9s9 4 9 9v4" fill="none" stroke="url(#lock-shackle)" strokeWidth="4" strokeLinecap="round" />
      <rect x="11" y="20" width="26" height="20" rx="4" fill="url(#lock-body)" stroke="#78350F" strokeWidth="2.5" />
      <circle cx="24" cy="30" r="4" fill="#78350F" />
      <rect x="22" y="30" width="4" height="6" rx="1" fill="#78350F" />
      <ellipse cx="18" cy="25" rx="3" ry="2.5" fill="rgba(255,255,255,0.25)" />
    </GameIcon>
  );
}
