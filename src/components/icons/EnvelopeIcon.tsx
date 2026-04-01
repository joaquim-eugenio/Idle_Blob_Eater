import { GameIcon, type GameIconProps } from './GameIcon';

export function EnvelopeIcon({ size, className, style }: GameIconProps) {
  return (
    <GameIcon size={size} className={className} style={style}>
      <defs>
        <linearGradient id="env-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="100%" stopColor="#D4A853" />
        </linearGradient>
        <linearGradient id="env-flap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B8860B" />
          <stop offset="100%" stopColor="#8B6914" />
        </linearGradient>
      </defs>
      <rect x="6" y="12" width="36" height="26" rx="3" fill="url(#env-body)" stroke="#8B6914" strokeWidth="2.5" />
      <path d="M6 14l18 13 18-13" fill="url(#env-flap)" stroke="#6B4F00" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="24" cy="32" r="4" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
      <ellipse cx="16" cy="18" rx="4" ry="2.5" fill="rgba(255,255,255,0.25)" />
    </GameIcon>
  );
}
