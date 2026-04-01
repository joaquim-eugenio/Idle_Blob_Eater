import { GameIcon, type GameIconProps } from './GameIcon';

export function SadFaceIcon({ size, className, style }: GameIconProps) {
  return (
    <GameIcon size={size} className={className} style={style}>
      <defs>
        <radialGradient id="sad-face" cx="0.4" cy="0.35" r="0.6">
          <stop offset="0%" stopColor="#FCA5A5" />
          <stop offset="100%" stopColor="#EF4444" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="18" fill="url(#sad-face)" stroke="#991B1B" strokeWidth="2.5" />
      <line x1="15" y1="17" x2="21" y2="23" stroke="#7F1D1D" strokeWidth="3" strokeLinecap="round" />
      <line x1="21" y1="17" x2="15" y2="23" stroke="#7F1D1D" strokeWidth="3" strokeLinecap="round" />
      <line x1="27" y1="17" x2="33" y2="23" stroke="#7F1D1D" strokeWidth="3" strokeLinecap="round" />
      <line x1="33" y1="17" x2="27" y2="23" stroke="#7F1D1D" strokeWidth="3" strokeLinecap="round" />
      <path d="M16 34c2-4 5-6 8-6s6 2 8 6" fill="none" stroke="#7F1D1D" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="17" cy="16" rx="3" ry="2" fill="rgba(255,255,255,0.3)" />
    </GameIcon>
  );
}
