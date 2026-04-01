import { GameIcon, type GameIconProps } from './GameIcon';

export function CoinIcon({ size, className, style }: GameIconProps) {
  return (
    <GameIcon size={size} className={className} style={style}>
      <defs>
        <linearGradient id="coin-face" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="50%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#CC9900" />
        </linearGradient>
        <linearGradient id="coin-edge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B8860B" />
          <stop offset="100%" stopColor="#8B6508" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="26" rx="16" ry="16" fill="url(#coin-edge)" stroke="#6B4F00" strokeWidth="2.5" />
      <ellipse cx="24" cy="24" rx="16" ry="16" fill="url(#coin-face)" stroke="#8B6508" strokeWidth="2.5" />
      <ellipse cx="24" cy="24" rx="12" ry="12" fill="none" stroke="#B8860B" strokeWidth="1.5" />
      <text x="24" y="30" textAnchor="middle" fontSize="18" fontWeight="900" fill="#8B6508" fontFamily="serif">$</text>
      <ellipse cx="19" cy="17" rx="5" ry="4" fill="rgba(255,255,255,0.35)" transform="rotate(-15 19 17)" />
    </GameIcon>
  );
}
