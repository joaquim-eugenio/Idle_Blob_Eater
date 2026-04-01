import { GameIcon, type GameIconProps } from './GameIcon';

export function CloseIcon({ size, className, style }: GameIconProps) {
  return (
    <GameIcon size={size} className={className} style={style}>
      <circle cx="24" cy="24" r="18" fill="#EF4444" stroke="#991B1B" strokeWidth="2.5" />
      <line x1="16" y1="16" x2="32" y2="32" stroke="white" strokeWidth="4" strokeLinecap="round" />
      <line x1="32" y1="16" x2="16" y2="32" stroke="white" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="18" cy="16" rx="4" ry="3" fill="rgba(255,255,255,0.2)" />
    </GameIcon>
  );
}
