import { GameIcon, type GameIconProps } from './GameIcon';

export function GemIcon({ size, className, style }: GameIconProps) {
  return (
    <GameIcon size={size} className={className} style={style}>
      <defs>
        <linearGradient id="gem-main" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="40%" stopColor="#9333EA" />
          <stop offset="100%" stopColor="#581C87" />
        </linearGradient>
        <linearGradient id="gem-face" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D8B4FE" />
          <stop offset="100%" stopColor="#7E22CE" />
        </linearGradient>
      </defs>
      <polygon points="24,6 38,18 32,42 16,42 10,18" fill="url(#gem-main)" stroke="#4C1D95" strokeWidth="2.5" strokeLinejoin="round" />
      <polygon points="24,6 30,18 24,42 18,18" fill="url(#gem-face)" stroke="#4C1D95" strokeWidth="1" strokeLinejoin="round" opacity="0.6" />
      <polygon points="10,18 38,18 32,42 16,42" fill="none" stroke="#4C1D95" strokeWidth="1" strokeLinejoin="round" opacity="0.4" />
      <line x1="24" y1="6" x2="24" y2="42" stroke="#7E22CE" strokeWidth="0.8" opacity="0.3" />
      <polygon points="16,12 22,10 19,18" fill="rgba(255,255,255,0.45)" />
      <ellipse cx="20" cy="14" rx="3" ry="2.5" fill="rgba(255,255,255,0.3)" />
    </GameIcon>
  );
}
