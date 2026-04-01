import { GameIcon, type GameIconProps } from './GameIcon';

export function BugIcon({ size, className, style }: GameIconProps) {
  return (
    <GameIcon size={size} className={className} style={style}>
      <defs>
        <linearGradient id="bug-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#86EFAC" />
          <stop offset="100%" stopColor="#16A34A" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="14" rx="8" ry="7" fill="url(#bug-body)" stroke="#14532D" strokeWidth="2.5" />
      <ellipse cx="24" cy="30" rx="12" ry="12" fill="url(#bug-body)" stroke="#14532D" strokeWidth="2.5" />
      <line x1="24" y1="20" x2="24" y2="42" stroke="#14532D" strokeWidth="1.5" />
      <line x1="14" y1="28" x2="34" y2="28" stroke="#14532D" strokeWidth="1.5" />
      <path d="M12 22l-6-4" stroke="#14532D" strokeWidth="2" strokeLinecap="round" />
      <path d="M36 22l6-4" stroke="#14532D" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 32l-4 2" stroke="#14532D" strokeWidth="2" strokeLinecap="round" />
      <path d="M38 32l4 2" stroke="#14532D" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 40l-4 4" stroke="#14532D" strokeWidth="2" strokeLinecap="round" />
      <path d="M36 40l4 4" stroke="#14532D" strokeWidth="2" strokeLinecap="round" />
      <circle cx="20" cy="12" r="2.5" fill="white" stroke="#14532D" strokeWidth="1" />
      <circle cx="28" cy="12" r="2.5" fill="white" stroke="#14532D" strokeWidth="1" />
      <circle cx="20" cy="12.5" r="1" fill="#14532D" />
      <circle cx="28" cy="12.5" r="1" fill="#14532D" />
      <path d="M18 6c-2-4-1-6 0-6" stroke="#14532D" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M30 6c2-4 1-6 0-6" stroke="#14532D" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </GameIcon>
  );
}
