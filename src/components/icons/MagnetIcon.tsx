import { GameIcon, type GameIconProps } from './GameIcon';

export function MagnetIcon({ size, className, style }: GameIconProps) {
  return (
    <GameIcon size={size} className={className} style={style}>
      <defs>
        <linearGradient id="mag-red" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="100%" stopColor="#C0392B" />
        </linearGradient>
        <linearGradient id="mag-blue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#74B9FF" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient id="mag-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#CBD5E1" />
          <stop offset="40%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#64748B" />
        </linearGradient>
      </defs>
      {/* Horseshoe body */}
      <path
        d="M10 8h8v16c0 4 2.5 7 6 7s6-3 6-7V8h8v16c0 9-6 16-14 16S10 33 10 24z"
        fill="url(#mag-body)" stroke="#334155" strokeWidth="2.5" strokeLinejoin="round"
      />
      {/* Red pole (left) */}
      <rect x="9" y="6" width="10" height="10" rx="2" fill="url(#mag-red)" stroke="#991B1B" strokeWidth="2" />
      {/* Blue pole (right) */}
      <rect x="29" y="6" width="10" height="10" rx="2" fill="url(#mag-blue)" stroke="#1E3A8A" strokeWidth="2" />
      {/* Specular highlights on poles */}
      <rect x="11" y="8" width="3" height="5" rx="1" fill="rgba(255,255,255,0.45)" />
      <rect x="31" y="8" width="3" height="5" rx="1" fill="rgba(255,255,255,0.45)" />
      {/* Metallic highlight on body */}
      <path d="M13 17c0 0 0 8 3 11" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" />
      {/* Energy sparks */}
      <circle cx="7" cy="20" r="1.5" fill="#FBBF24" opacity="0.9" />
      <circle cx="41" cy="20" r="1.5" fill="#FBBF24" opacity="0.9" />
      <circle cx="5" cy="14" r="1" fill="#FDE68A" opacity="0.7" />
      <circle cx="43" cy="14" r="1" fill="#FDE68A" opacity="0.7" />
    </GameIcon>
  );
}
