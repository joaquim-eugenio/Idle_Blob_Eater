import { GameIcon, type GameIconProps } from './GameIcon';

export function MapPinIcon({ size, className, style }: GameIconProps) {
  return (
    <GameIcon size={size} className={className} style={style}>
      <defs>
        <linearGradient id="pin-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F87171" />
          <stop offset="100%" stopColor="#DC2626" />
        </linearGradient>
      </defs>
      <path d="M24 44l-12-16c-3-4-4-9-4-14 0-9 7-10 16-10s16 1 16 10c0 5-1 10-4 14z" fill="url(#pin-body)" stroke="#991B1B" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="24" cy="18" r="7" fill="white" stroke="#991B1B" strokeWidth="1.5" />
      <circle cx="24" cy="18" r="3" fill="#DC2626" />
      <ellipse cx="19" cy="12" rx="3" ry="2.5" fill="rgba(255,255,255,0.3)" />
    </GameIcon>
  );
}
