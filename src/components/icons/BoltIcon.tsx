import { GameIcon, type GameIconProps } from './GameIcon';

export function BoltIcon({ size, className, style }: GameIconProps) {
  return (
    <GameIcon size={size} className={className} style={style}>
      <defs>
        <linearGradient id="bolt-body" x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="40%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>
      <polygon points="28,4 12,26 22,26 18,44 36,20 26,20" fill="url(#bolt-body)" stroke="#92400E" strokeWidth="2.5" strokeLinejoin="round" />
      <polygon points="26,8 16,24 22,24 20,34" fill="rgba(255,255,255,0.3)" strokeLinejoin="round" />
    </GameIcon>
  );
}
