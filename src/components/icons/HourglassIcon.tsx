import { GameIcon, type GameIconProps } from './GameIcon';

export function HourglassIcon({ size, className, style }: GameIconProps) {
  return (
    <GameIcon size={size} className={className} style={style}>
      <defs>
        <linearGradient id="hg-frame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
        <linearGradient id="hg-sand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>
      <rect x="12" y="4" width="24" height="5" rx="2" fill="url(#hg-frame)" stroke="#78350F" strokeWidth="2" />
      <rect x="12" y="39" width="24" height="5" rx="2" fill="url(#hg-frame)" stroke="#78350F" strokeWidth="2" />
      <path d="M14 9c0 0 0 10 10 15-10 5-10 15-10 15h20c0 0 0-10-10-15 10-5 10-15 10-15z" fill="#FEF3C7" stroke="#B8860B" strokeWidth="2" strokeLinejoin="round" />
      <path d="M18 12c0 0 0 6 6 9" fill="none" stroke="url(#hg-sand)" strokeWidth="3" strokeLinecap="round" />
      <path d="M20 36h8c0-3-2-5-4-6-2 1-4 3-4 6z" fill="url(#hg-sand)" />
      <ellipse cx="20" cy="12" rx="3" ry="1.5" fill="rgba(255,255,255,0.3)" />
    </GameIcon>
  );
}
