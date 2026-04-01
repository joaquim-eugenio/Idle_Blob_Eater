import { GameIcon, type GameIconProps } from './GameIcon';

export function WarningIcon({ size, className, style }: GameIconProps) {
  return (
    <GameIcon size={size} className={className} style={style}>
      <defs>
        <linearGradient id="warn-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      <polygon points="24,4 44,40 4,40" fill="url(#warn-bg)" stroke="#92400E" strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="22" y="16" width="4" height="12" rx="2" fill="#92400E" />
      <circle cx="24" cy="34" r="2.5" fill="#92400E" />
      <polygon points="24,8 20,14 28,14" fill="rgba(255,255,255,0.3)" />
    </GameIcon>
  );
}
