import { GameIcon, type GameIconProps } from './GameIcon';

export function GiftIcon({ size, className, style }: GameIconProps) {
  return (
    <GameIcon size={size} className={className} style={style}>
      <defs>
        <linearGradient id="gift-box" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        <linearGradient id="gift-ribbon" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      <rect x="8" y="20" width="32" height="22" rx="3" fill="url(#gift-box)" stroke="#5B21B6" strokeWidth="2.5" />
      <rect x="6" y="14" width="36" height="8" rx="3" fill="url(#gift-box)" stroke="#5B21B6" strokeWidth="2.5" />
      <rect x="21" y="14" width="6" height="28" fill="url(#gift-ribbon)" stroke="#B45309" strokeWidth="1.5" />
      <path d="M24 14c-3-4-8-6-10-4s0 6 4 6" fill="none" stroke="url(#gift-ribbon)" strokeWidth="3" strokeLinecap="round" />
      <path d="M24 14c3-4 8-6 10-4s0 6-4 6" fill="none" stroke="url(#gift-ribbon)" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="15" cy="18" rx="3" ry="2" fill="rgba(255,255,255,0.25)" />
    </GameIcon>
  );
}
