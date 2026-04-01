import { GameIcon, type GameIconProps } from './GameIcon';

interface CaretIconProps extends GameIconProps {
  direction?: 'right' | 'down' | 'left' | 'up';
}

const ROTATIONS = { right: 0, down: 90, left: 180, up: 270 };

export function CaretIcon({ size, className, style, direction = 'right' }: CaretIconProps) {
  return (
    <GameIcon size={size} className={className} style={style}>
      <g transform={`rotate(${ROTATIONS[direction]} 24 24)`}>
        <polygon points="18,10 34,24 18,38" fill="#FFD700" stroke="#92400E" strokeWidth="2.5" strokeLinejoin="round" />
        <polygon points="20,14 30,24 20,24" fill="rgba(255,255,255,0.3)" />
      </g>
    </GameIcon>
  );
}
