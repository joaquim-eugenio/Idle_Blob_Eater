import { GameIcon, type GameIconProps } from './GameIcon';

export function TreeIcon({ size, className, style }: GameIconProps) {
  return (
    <GameIcon size={size} className={className} style={style}>
      <defs>
        <linearGradient id="tree-trunk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A0845C" />
          <stop offset="100%" stopColor="#6B4F00" />
        </linearGradient>
        <linearGradient id="tree-leaf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="100%" stopColor="#16A34A" />
        </linearGradient>
      </defs>
      <rect x="21" y="28" width="6" height="16" rx="1" fill="url(#tree-trunk)" stroke="#5C3300" strokeWidth="2" />
      <path d="M24 4L10 22h8l-4 8h20l-4-8h8z" fill="url(#tree-leaf)" stroke="#14532D" strokeWidth="2.5" strokeLinejoin="round" />
      <ellipse cx="19" cy="14" rx="3" ry="4" fill="rgba(255,255,255,0.25)" />
    </GameIcon>
  );
}
