import { GameIcon, type GameIconProps } from './GameIcon';

export function CloudRainIcon({ size, className, style }: GameIconProps) {
  return (
    <GameIcon size={size} className={className} style={style}>
      <defs>
        <linearGradient id="cr-cloud" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>
        <linearGradient id="cr-drop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#86EFAC" />
          <stop offset="100%" stopColor="#16A34A" />
        </linearGradient>
      </defs>
      {/* Cloud - puffy overlapping circles for cartoon feel */}
      <circle cx="17" cy="16" r="9" fill="url(#cr-cloud)" stroke="#475569" strokeWidth="2" />
      <circle cx="28" cy="14" r="10" fill="url(#cr-cloud)" stroke="#475569" strokeWidth="2" />
      <circle cx="12" cy="20" r="7" fill="url(#cr-cloud)" stroke="#475569" strokeWidth="2" />
      <circle cx="36" cy="19" r="7" fill="url(#cr-cloud)" stroke="#475569" strokeWidth="2" />
      {/* Cloud base - covers the circle bottoms */}
      <rect x="5" y="18" width="38" height="8" rx="4" fill="url(#cr-cloud)" stroke="#475569" strokeWidth="2" />
      {/* Highlight on cloud */}
      <ellipse cx="18" cy="12" rx="5" ry="3" fill="rgba(255,255,255,0.6)" />
      {/* Food drops - green teardrop shapes */}
      <path d="M13 30c-1.5 2.5-1.5 5 0 6 1.5 1 3 0.5 3-1.5s-1.5-4.5-3-4.5z" fill="url(#cr-drop)" stroke="#15803D" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M23 32c-1.5 2.5-1.5 5 0 6 1.5 1 3 0.5 3-1.5s-1.5-4.5-3-4.5z" fill="url(#cr-drop)" stroke="#15803D" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M33 29c-1.5 2.5-1.5 5 0 6 1.5 1 3 0.5 3-1.5s-1.5-4.5-3-4.5z" fill="url(#cr-drop)" stroke="#15803D" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Tiny sparkle on drops */}
      <circle cx="14" cy="33" r="0.8" fill="rgba(255,255,255,0.7)" />
      <circle cx="24" cy="35" r="0.8" fill="rgba(255,255,255,0.7)" />
      <circle cx="34" cy="32" r="0.8" fill="rgba(255,255,255,0.7)" />
    </GameIcon>
  );
}
