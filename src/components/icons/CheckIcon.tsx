import { GameIcon, type GameIconProps } from './GameIcon';

export function CheckIcon({ size, className, style }: GameIconProps) {
  return (
    <GameIcon size={size} className={className} style={style}>
      <defs>
        <linearGradient id="check-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="100%" stopColor="#16A34A" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="18" fill="url(#check-bg)" stroke="#14532D" strokeWidth="2.5" />
      <polyline points="14,24 22,32 34,16" fill="none" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx="18" cy="16" rx="4" ry="3" fill="rgba(255,255,255,0.25)" />
    </GameIcon>
  );
}
