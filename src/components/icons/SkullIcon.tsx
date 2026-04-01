import { GameIcon, type GameIconProps } from './GameIcon';

export function SkullIcon({ size, className, style }: GameIconProps) {
  return (
    <GameIcon size={size} className={className} style={style}>
      <defs>
        <radialGradient id="skull-bone" cx="0.4" cy="0.35" r="0.6">
          <stop offset="0%" stopColor="#F8FAFC" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </radialGradient>
      </defs>
      <path d="M24 6c-10 0-16 7-16 16 0 6 3 10 6 12v6h6v-4h8v4h6v-6c3-2 6-6 6-12 0-9-6-16-16-16z" fill="url(#skull-bone)" stroke="#475569" strokeWidth="2.5" strokeLinejoin="round" />
      <ellipse cx="18" cy="20" rx="5" ry="6" fill="#1E293B" />
      <ellipse cx="30" cy="20" rx="5" ry="6" fill="#1E293B" />
      <ellipse cx="18" cy="19" rx="2" ry="2.5" fill="#EF4444" opacity="0.6" />
      <ellipse cx="30" cy="19" rx="2" ry="2.5" fill="#EF4444" opacity="0.6" />
      <rect x="21" y="30" width="2" height="4" rx="0.5" fill="#475569" />
      <rect x="25" y="30" width="2" height="4" rx="0.5" fill="#475569" />
      <path d="M20 28h8" stroke="#475569" strokeWidth="1.5" />
    </GameIcon>
  );
}
