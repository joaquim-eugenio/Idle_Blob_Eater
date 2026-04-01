import { GameIcon, type GameIconProps } from './GameIcon';

export function TrophyIcon({ size, className, style }: GameIconProps) {
  return (
    <GameIcon size={size} className={className} style={style}>
      <defs>
        <linearGradient id="trophy-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="40%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
        <linearGradient id="trophy-base" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8B6914" />
          <stop offset="100%" stopColor="#5C4400" />
        </linearGradient>
      </defs>
      <path d="M14 8h20v14c0 6-4 10-10 10s-10-4-10-10V8z" fill="url(#trophy-body)" stroke="#7A5C00" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M14 12c-4 0-7 2-7 6s3 6 7 6" fill="url(#trophy-body)" stroke="#7A5C00" strokeWidth="2" strokeLinejoin="round" />
      <path d="M34 12c4 0 7 2 7 6s-3 6-7 6" fill="url(#trophy-body)" stroke="#7A5C00" strokeWidth="2" strokeLinejoin="round" />
      <rect x="20" y="32" width="8" height="4" rx="1" fill="url(#trophy-base)" stroke="#5C4400" strokeWidth="1.5" />
      <rect x="16" y="36" width="16" height="5" rx="2" fill="url(#trophy-base)" stroke="#5C4400" strokeWidth="1.5" />
      <ellipse cx="21" cy="14" rx="4" ry="5" fill="rgba(255,255,255,0.35)" />
      <path d="M20 18l4-6 4 6-4 3z" fill="#FFF8DC" opacity="0.5" />
    </GameIcon>
  );
}
