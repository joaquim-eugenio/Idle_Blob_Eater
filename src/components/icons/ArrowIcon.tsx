import { GameIcon, type GameIconProps } from './GameIcon';

type ArrowDirection = 'right' | 'left' | 'up' | 'down' | 'refresh';

interface ArrowIconProps extends GameIconProps {
  direction?: ArrowDirection;
}

const ROTATIONS: Record<ArrowDirection, number> = {
  right: 0,
  down: 90,
  left: 180,
  up: 270,
  refresh: 0,
};

export function ArrowIcon({ size, className, style, direction = 'right' }: ArrowIconProps) {
  if (direction === 'refresh') {
    return (
      <GameIcon size={size} className={className} style={style}>
        <defs>
          <linearGradient id="arrow-ref" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
        <path d="M36 20a14 14 0 1 1-4-9" fill="none" stroke="url(#arrow-ref)" strokeWidth="4" strokeLinecap="round" />
        <polygon points="38,8 38,20 28,14" fill="url(#arrow-ref)" stroke="#047857" strokeWidth="1.5" strokeLinejoin="round" />
      </GameIcon>
    );
  }

  const rot = ROTATIONS[direction];
  return (
    <GameIcon size={size} className={className} style={style}>
      <defs>
        <linearGradient id="arrow-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      <g transform={`rotate(${rot} 24 24)`}>
        <path d="M10 24h24" stroke="url(#arrow-body)" strokeWidth="4.5" strokeLinecap="round" />
        <polygon points="30,14 40,24 30,34" fill="url(#arrow-body)" stroke="#1D4ED8" strokeWidth="2" strokeLinejoin="round" />
      </g>
    </GameIcon>
  );
}
