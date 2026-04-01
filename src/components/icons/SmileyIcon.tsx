import { GameIcon, type GameIconProps } from './GameIcon';

export function SmileyIcon({ size, className, style }: GameIconProps) {
  return (
    <GameIcon size={size} className={className} style={style}>
      <defs>
        <radialGradient id="smiley-face" cx="0.4" cy="0.35" r="0.6">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#F59E0B" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="18" fill="url(#smiley-face)" stroke="#92400E" strokeWidth="2.5" />
      <ellipse cx="17" cy="20" rx="3" ry="3.5" fill="#92400E" />
      <ellipse cx="31" cy="20" rx="3" ry="3.5" fill="#92400E" />
      <path d="M15 28c2 5 7 7 9 7s7-2 9-7" fill="none" stroke="#92400E" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="16" cy="16" rx="3" ry="2" fill="rgba(255,255,255,0.4)" />
      <circle cx="18" cy="18" r="1.2" fill="white" opacity="0.6" />
      <circle cx="32" cy="18" r="1.2" fill="white" opacity="0.6" />
    </GameIcon>
  );
}
