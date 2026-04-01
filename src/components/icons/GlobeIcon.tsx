import { GameIcon, type GameIconProps } from './GameIcon';

export function GlobeIcon({ size, className, style }: GameIconProps) {
  return (
    <GameIcon size={size} className={className} style={style}>
      <defs>
        <radialGradient id="globe-sea" cx="0.4" cy="0.35" r="0.6">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#1E40AF" />
        </radialGradient>
        <radialGradient id="globe-land" cx="0.4" cy="0.35" r="0.5">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="100%" stopColor="#15803D" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="18" fill="url(#globe-sea)" stroke="#1E3A5F" strokeWidth="2.5" />
      <path d="M16 14c2-1 5 0 6 2s3 4 6 3 4-2 6 0-1 5-3 6-5 0-7 2-2 5-5 6-5-1-6-3 0-5-2-7 2-3 3-5 0-3 2-4z" fill="url(#globe-land)" stroke="#15803D" strokeWidth="1" opacity="0.9" />
      <path d="M12 28c1 2 3 3 5 2s3-2 3-1-1 3-3 4" fill="url(#globe-land)" stroke="#15803D" strokeWidth="1" opacity="0.8" />
      <ellipse cx="18" cy="16" rx="6" ry="5" fill="rgba(255,255,255,0.25)" />
      <path d="M24 6c0 0 2 0 2 0" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
    </GameIcon>
  );
}
