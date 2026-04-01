import { GameIcon, type GameIconProps } from './GameIcon';

export function TapHandIcon({ size, className, style }: GameIconProps) {
  return (
    <GameIcon size={size} className={className} style={style}>
      <defs>
        <linearGradient id="hand-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FDDCB5" />
          <stop offset="100%" stopColor="#E8A96B" />
        </linearGradient>
      </defs>
      <path d="M24 4v20" stroke="url(#hand-skin)" strokeWidth="8" strokeLinecap="round" />
      <path d="M24 24c0 0-12 2-12 10 0 4 3 8 12 8s12-4 12-8c0-8-12-10-12-10z" fill="url(#hand-skin)" stroke="#B07840" strokeWidth="2.5" strokeLinejoin="round" />
      <ellipse cx="18" cy="34" rx="3" ry="4" fill="none" stroke="#C49060" strokeWidth="1.2" />
      <ellipse cx="24" cy="35" rx="3" ry="4" fill="none" stroke="#C49060" strokeWidth="1.2" />
      <ellipse cx="30" cy="34" rx="3" ry="4" fill="none" stroke="#C49060" strokeWidth="1.2" />
      <ellipse cx="22" cy="10" rx="2.5" ry="4" fill="rgba(255,255,255,0.3)" />
      <circle cx="24" cy="4" r="4" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" opacity="0.8" />
      <path d="M20 2l-2-2M28 2l2-2M24 0v-2" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </GameIcon>
  );
}
