import { GameIcon, type GameIconProps } from './GameIcon';

export function SpinnerIcon({ size, className, style }: GameIconProps) {
  return (
    <GameIcon size={size} className={className} style={style}>
      <defs>
        <linearGradient id="spin-arc" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="16" fill="none" stroke="#E5E7EB" strokeWidth="4" />
      <path d="M24 8a16 16 0 0 1 14 8" fill="none" stroke="url(#spin-arc)" strokeWidth="4" strokeLinecap="round" />
    </GameIcon>
  );
}
