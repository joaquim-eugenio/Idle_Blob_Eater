import { GameIcon, type GameIconProps } from './GameIcon';

export function ExternalLinkIcon({ size, className, style }: GameIconProps) {
  return (
    <GameIcon size={size} className={className} style={style}>
      <defs>
        <linearGradient id="extlink-box" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      <rect x="8" y="14" width="26" height="26" rx="4" fill="url(#extlink-box)" stroke="#1E3A8A" strokeWidth="2.5" />
      <path d="M28 8h12v12" fill="none" stroke="#FBBF24" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="40" y1="8" x2="24" y2="24" stroke="#FBBF24" strokeWidth="3.5" strokeLinecap="round" />
    </GameIcon>
  );
}
