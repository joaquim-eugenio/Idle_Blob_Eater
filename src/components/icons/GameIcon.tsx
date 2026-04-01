import type { ReactNode, CSSProperties } from 'react';

export interface GameIconProps {
  size?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function GameIcon({ size = 24, className, style, children }: GameIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      style={{
        filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.35))',
        ...style,
      }}
    >
      <defs>
        <linearGradient id="gi-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#F5A623" />
          <stop offset="100%" stopColor="#C8860A" />
        </linearGradient>
        <linearGradient id="gi-silver" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8E8E8" />
          <stop offset="50%" stopColor="#B0B0B0" />
          <stop offset="100%" stopColor="#808080" />
        </linearGradient>
        <radialGradient id="gi-highlight" cx="0.35" cy="0.25" r="0.5">
          <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      {children}
    </svg>
  );
}
