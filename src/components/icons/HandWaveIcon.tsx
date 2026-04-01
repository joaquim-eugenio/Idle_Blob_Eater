import type { GameIconProps } from './GameIcon';

const TWEMOJI_WAVE = 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/1f44b.svg';

export function HandWaveIcon({ size = 24, className, style }: GameIconProps) {
  return (
    <img
      src={TWEMOJI_WAVE}
      alt="wave"
      width={size}
      height={size}
      className={className}
      style={{
        filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.25))',
        ...style,
      }}
      draggable={false}
    />
  );
}
