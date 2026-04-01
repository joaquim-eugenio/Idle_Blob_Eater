import { GameIcon, type GameIconProps } from './GameIcon';

export function ShieldIcon({ size, className, style }: GameIconProps) {
  return (
    <GameIcon size={size} className={className} style={style}>
      <defs>
        <linearGradient id="shield-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="shield-trim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
      </defs>
      <path d="M24 4L8 12v12c0 10 7 17 16 20 9-3 16-10 16-20V12z" fill="url(#shield-body)" stroke="#1E3A8A" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M24 8L12 14v10c0 8 5 13 12 16 7-3 12-8 12-16V14z" fill="none" stroke="url(#shield-trim)" strokeWidth="2" strokeLinejoin="round" />
      <ellipse cx="20" cy="16" rx="4" ry="5" fill="rgba(255,255,255,0.25)" />
      <path d="M20 24l4-4 4 4-4 6z" fill="url(#shield-trim)" stroke="#B8860B" strokeWidth="1" opacity="0.7" />
    </GameIcon>
  );
}
