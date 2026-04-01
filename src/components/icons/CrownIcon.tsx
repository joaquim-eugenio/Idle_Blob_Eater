import { GameIcon, type GameIconProps } from './GameIcon';

export function CrownIcon({ size, className, style }: GameIconProps) {
  return (
    <GameIcon size={size} className={className} style={style}>
      <defs>
        <linearGradient id="crown-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="40%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
      </defs>
      <path d="M8 34L12 16l8 8 4-14 4 14 8-8 4 18z" fill="url(#crown-body)" stroke="#7A5C00" strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="8" y="34" width="32" height="6" rx="2" fill="#B8860B" stroke="#7A5C00" strokeWidth="2" />
      <circle cx="24" cy="12" r="3" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
      <circle cx="14" cy="20" r="2.5" fill="#3B82F6" stroke="#1E40AF" strokeWidth="1.2" />
      <circle cx="34" cy="20" r="2.5" fill="#22C55E" stroke="#15803D" strokeWidth="1.2" />
      <ellipse cx="18" cy="22" rx="4" ry="5" fill="rgba(255,255,255,0.25)" />
    </GameIcon>
  );
}
