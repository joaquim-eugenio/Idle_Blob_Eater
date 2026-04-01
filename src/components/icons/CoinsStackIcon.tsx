import { GameIcon, type GameIconProps } from './GameIcon';

export function CoinsStackIcon({ size, className, style }: GameIconProps) {
  return (
    <GameIcon size={size} className={className} style={style}>
      <defs>
        <linearGradient id="coins-face" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="100%" stopColor="#CC9900" />
        </linearGradient>
        <linearGradient id="coins-edge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B8860B" />
          <stop offset="100%" stopColor="#8B6508" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="36" rx="16" ry="6" fill="url(#coins-edge)" stroke="#6B4F00" strokeWidth="2" />
      <ellipse cx="24" cy="34" rx="16" ry="6" fill="url(#coins-face)" stroke="#8B6508" strokeWidth="2" />
      <ellipse cx="24" cy="28" rx="14" ry="5" fill="url(#coins-edge)" stroke="#6B4F00" strokeWidth="1.8" />
      <ellipse cx="24" cy="26" rx="14" ry="5" fill="url(#coins-face)" stroke="#8B6508" strokeWidth="1.8" />
      <ellipse cx="24" cy="20" rx="12" ry="4.5" fill="url(#coins-edge)" stroke="#6B4F00" strokeWidth="1.5" />
      <ellipse cx="24" cy="18" rx="12" ry="4.5" fill="url(#coins-face)" stroke="#8B6508" strokeWidth="1.5" />
      <ellipse cx="24" cy="12" rx="10" ry="4" fill="url(#coins-edge)" stroke="#6B4F00" strokeWidth="1.5" />
      <ellipse cx="24" cy="10" rx="10" ry="4" fill="url(#coins-face)" stroke="#8B6508" strokeWidth="1.5" />
      <ellipse cx="20" cy="9" rx="3" ry="1.5" fill="rgba(255,255,255,0.35)" />
    </GameIcon>
  );
}
