import { GameIcon, type GameIconProps } from './GameIcon';

export function ClockIcon({ size, className, style }: GameIconProps) {
  return (
    <GameIcon size={size} className={className} style={style}>
      <defs>
        <radialGradient id="clock-face" cx="0.4" cy="0.35" r="0.6">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="100%" stopColor="#F5D98A" />
        </radialGradient>
        <linearGradient id="clock-rim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B8860B" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="19" fill="url(#clock-rim)" stroke="#5C3300" strokeWidth="2.5" />
      <circle cx="24" cy="24" r="16" fill="url(#clock-face)" stroke="#B8860B" strokeWidth="1.5" />
      <line x1="24" y1="24" x2="24" y2="14" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
      <line x1="24" y1="24" x2="32" y2="24" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="24" r="2.5" fill="#78350F" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => {
        const angle = (i * 30 - 90) * Math.PI / 180;
        const x = 24 + Math.cos(angle) * 13.5;
        const y = 24 + Math.sin(angle) * 13.5;
        return <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.5 : 0.8} fill="#92400E" />;
      })}
      <ellipse cx="19" cy="17" rx="4" ry="3" fill="rgba(255,255,255,0.3)" />
    </GameIcon>
  );
}
