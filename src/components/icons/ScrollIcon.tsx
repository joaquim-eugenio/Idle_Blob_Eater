import { GameIcon, type GameIconProps } from './GameIcon';

export function ScrollIcon({ size, className, style }: GameIconProps) {
  return (
    <GameIcon size={size} className={className} style={style}>
      <defs>
        <linearGradient id="scroll-paper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="100%" stopColor="#D4A853" />
        </linearGradient>
        <linearGradient id="scroll-roll" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C4A35A" />
          <stop offset="100%" stopColor="#8B6914" />
        </linearGradient>
      </defs>
      <rect x="12" y="8" width="24" height="32" rx="2" fill="url(#scroll-paper)" stroke="#8B6914" strokeWidth="2" />
      <rect x="10" y="6" width="28" height="6" rx="3" fill="url(#scroll-roll)" stroke="#6B4F00" strokeWidth="2" />
      <rect x="10" y="38" width="28" height="6" rx="3" fill="url(#scroll-roll)" stroke="#6B4F00" strokeWidth="2" />
      <line x1="16" y1="18" x2="32" y2="18" stroke="#A0845C" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="23" x2="30" y2="23" stroke="#A0845C" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="28" x2="28" y2="28" stroke="#A0845C" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="33" x2="26" y2="33" stroke="#A0845C" strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="17" cy="10" rx="4" ry="2" fill="rgba(255,255,255,0.3)" />
    </GameIcon>
  );
}
