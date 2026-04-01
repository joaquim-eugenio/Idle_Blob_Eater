import { GameIcon, type GameIconProps } from './GameIcon';

export function StarIcon({ size, className, style }: GameIconProps) {
  return (
    <GameIcon size={size} className={className} style={style}>
      <defs>
        <linearGradient id="star-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="40%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>
      <polygon points="24,4 29,17 43,18 33,27 36,41 24,34 12,41 15,27 5,18 19,17" fill="url(#star-body)" stroke="#92400E" strokeWidth="2.5" strokeLinejoin="round" />
      <polygon points="24,8 27,17 20,17" fill="rgba(255,255,255,0.4)" />
      <ellipse cx="20" cy="16" rx="3" ry="2.5" fill="rgba(255,255,255,0.3)" />
    </GameIcon>
  );
}
