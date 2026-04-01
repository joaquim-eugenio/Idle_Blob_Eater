import { GameIcon, type GameIconProps } from './GameIcon';

export function ExpandIcon({ size, className, style }: GameIconProps) {
  return (
    <GameIcon size={size} className={className} style={style}>
      <defs>
        <linearGradient id="exp-arr" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#67E8F9" />
          <stop offset="50%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#0891B2" />
        </linearGradient>
        <radialGradient id="exp-center" cx="0.4" cy="0.35" r="0.6">
          <stop offset="0%" stopColor="#A5F3FC" />
          <stop offset="60%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#0E7490" />
        </radialGradient>
      </defs>
      {/* Center circle with inner square */}
      <circle cx="24" cy="24" r="6.5" fill="url(#exp-center)" stroke="#164E63" strokeWidth="2.5" />
      <rect x="21" y="21" width="6" height="6" rx="1" fill="#164E63" opacity="0.5" />
      <ellipse cx="22" cy="22" rx="2" ry="1.5" fill="rgba(255,255,255,0.4)" />
      {/* Top-left arrow */}
      <g>
        <path d="M14 6L6 6L6 14" fill="none" stroke="url(#exp-arr)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        <polygon points="4,4 14,4 4,14" fill="url(#exp-arr)" stroke="#0E7490" strokeWidth="1.5" strokeLinejoin="round" opacity="0.35" />
        <line x1="16" y1="16" x2="10" y2="10" stroke="url(#exp-arr)" strokeWidth="3.5" strokeLinecap="round" />
      </g>
      {/* Top-right arrow */}
      <g>
        <path d="M34 6L42 6L42 14" fill="none" stroke="url(#exp-arr)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        <polygon points="44,4 34,4 44,14" fill="url(#exp-arr)" stroke="#0E7490" strokeWidth="1.5" strokeLinejoin="round" opacity="0.35" />
        <line x1="32" y1="16" x2="38" y2="10" stroke="url(#exp-arr)" strokeWidth="3.5" strokeLinecap="round" />
      </g>
      {/* Bottom-left arrow */}
      <g>
        <path d="M14 42L6 42L6 34" fill="none" stroke="url(#exp-arr)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        <polygon points="4,44 14,44 4,34" fill="url(#exp-arr)" stroke="#0E7490" strokeWidth="1.5" strokeLinejoin="round" opacity="0.35" />
        <line x1="16" y1="32" x2="10" y2="38" stroke="url(#exp-arr)" strokeWidth="3.5" strokeLinecap="round" />
      </g>
      {/* Bottom-right arrow */}
      <g>
        <path d="M34 42L42 42L42 34" fill="none" stroke="url(#exp-arr)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        <polygon points="44,44 34,44 44,34" fill="url(#exp-arr)" stroke="#0E7490" strokeWidth="1.5" strokeLinejoin="round" opacity="0.35" />
        <line x1="32" y1="32" x2="38" y2="38" stroke="url(#exp-arr)" strokeWidth="3.5" strokeLinecap="round" />
      </g>
    </GameIcon>
  );
}
