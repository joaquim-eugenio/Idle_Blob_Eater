import { GameIcon, type GameIconProps } from './GameIcon';

export function ShirtIcon({ size, className, style }: GameIconProps) {
  return (
    <GameIcon size={size} className={className} style={style}>
      <defs>
        <linearGradient id="shirt-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#818CF8" />
          <stop offset="100%" stopColor="#4338CA" />
        </linearGradient>
      </defs>
      <path d="M16 8L8 14v8l6-2v18h20V20l6 2v-8l-8-6c0 0-2 4-8 4s-8-4-8-4z" fill="url(#shirt-body)" stroke="#312E81" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M20 8c0 2 2 4 4 4s4-2 4-4" fill="none" stroke="#312E81" strokeWidth="1.5" />
      <ellipse cx="19" cy="16" rx="4" ry="5" fill="rgba(255,255,255,0.2)" />
      <path d="M21 26l3-3 3 3-3 4z" fill="#FFD700" stroke="#B8860B" strokeWidth="1" opacity="0.8" />
    </GameIcon>
  );
}
