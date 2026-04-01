import { GameIcon, type GameIconProps } from './GameIcon';

export function FireIcon({ size, className, style }: GameIconProps) {
  return (
    <GameIcon size={size} className={className} style={style}>
      <defs>
        <linearGradient id="fire-outer" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="30%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#DC2626" />
        </linearGradient>
        <linearGradient id="fire-inner" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>
      </defs>
      <path d="M24 4c0 6-8 10-8 20 0 7 4 12 8 14 4-2 8-7 8-14 0-10-8-14-8-20z" fill="url(#fire-outer)" stroke="#991B1B" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M24 16c0 4-4 6-4 12 0 3 2 6 4 7 2-1 4-4 4-7 0-6-4-8-4-12z" fill="url(#fire-inner)" stroke="#D97706" strokeWidth="1" strokeLinejoin="round" />
      <ellipse cx="20" cy="18" rx="2.5" ry="4" fill="rgba(255,255,255,0.25)" />
    </GameIcon>
  );
}
