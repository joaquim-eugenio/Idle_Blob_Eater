import { GameIcon, type GameIconProps } from './GameIcon';

export function RobotIcon({ size, className, style }: GameIconProps) {
  return (
    <GameIcon size={size} className={className} style={style}>
      <defs>
        <linearGradient id="robot-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A5B4FC" />
          <stop offset="50%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#4338CA" />
        </linearGradient>
      </defs>
      <rect x="6" y="4" width="6" height="10" rx="2" fill="#818CF8" stroke="#3730A3" strokeWidth="1.5" />
      <rect x="36" y="4" width="6" height="10" rx="2" fill="#818CF8" stroke="#3730A3" strokeWidth="1.5" />
      <rect x="12" y="8" width="24" height="20" rx="5" fill="url(#robot-body)" stroke="#312E81" strokeWidth="2.5" />
      <circle cx="19" cy="18" r="4" fill="#22D3EE" stroke="#0E7490" strokeWidth="1.5" />
      <circle cx="29" cy="18" r="4" fill="#22D3EE" stroke="#0E7490" strokeWidth="1.5" />
      <circle cx="19" cy="18" r="1.5" fill="white" />
      <circle cx="29" cy="18" r="1.5" fill="white" />
      <rect x="18" y="23" width="12" height="3" rx="1.5" fill="#312E81" />
      <rect x="16" y="30" width="16" height="12" rx="3" fill="url(#robot-body)" stroke="#312E81" strokeWidth="2" />
      <line x1="24" y1="31" x2="24" y2="41" stroke="#312E81" strokeWidth="1.5" />
      <line x1="17" y1="36" x2="31" y2="36" stroke="#312E81" strokeWidth="1.5" />
      <rect x="20" y="2" width="8" height="6" rx="3" fill="#818CF8" stroke="#3730A3" strokeWidth="1.5" />
      <circle cx="24" cy="4.5" r="1.5" fill="#22D3EE" />
    </GameIcon>
  );
}
