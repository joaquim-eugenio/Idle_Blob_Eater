import { GameIcon, type GameIconProps } from './GameIcon';

export function ChartIcon({ size, className, style }: GameIconProps) {
  return (
    <GameIcon size={size} className={className} style={style}>
      <defs>
        <linearGradient id="chart-paper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="100%" stopColor="#D4A853" />
        </linearGradient>
        <linearGradient id="chart-bar1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="chart-bar2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient id="chart-bar3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>
      <rect x="8" y="6" width="32" height="36" rx="3" fill="url(#chart-paper)" stroke="#8B6914" strokeWidth="2.5" />
      <rect x="13" y="26" width="5" height="10" rx="1" fill="url(#chart-bar1)" stroke="#047857" strokeWidth="1.2" />
      <rect x="21" y="18" width="5" height="18" rx="1" fill="url(#chart-bar2)" stroke="#1D4ED8" strokeWidth="1.2" />
      <rect x="29" y="14" width="5" height="22" rx="1" fill="url(#chart-bar3)" stroke="#B45309" strokeWidth="1.2" />
      <line x1="12" y1="37" x2="36" y2="37" stroke="#8B6914" strokeWidth="1.5" />
      <ellipse cx="16" cy="12" rx="5" ry="3" fill="rgba(255,255,255,0.3)" />
    </GameIcon>
  );
}
