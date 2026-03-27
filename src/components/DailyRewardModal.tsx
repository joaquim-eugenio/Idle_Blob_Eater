import { useGameStore } from '../store/gameStore';
import { DAILY_REWARDS, STREAK_MULTIPLIERS } from '../lib/constants';
import { Gift, Fire, X } from '@phosphor-icons/react';
import { motion } from 'motion/react';

interface Props {
  onClaim: () => void;
  onDismiss: () => void;
}

export function DailyRewardModal({ onClaim, onDismiss }: Props) {
  const dailyReward = useGameStore(s => s.dailyReward);
  const claimDailyReward = useGameStore(s => s.claimDailyReward);

  const currentDay = dailyReward.cycleDay;
  const streak = dailyReward.streak;
  const streakMult = STREAK_MULTIPLIERS[Math.min(streak, STREAK_MULTIPLIERS.length - 1)];

  const handleClaim = () => {
    claimDailyReward();
    onClaim();
  };

  return (
    <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl border-3 border-amber-400 shadow-lg shadow-amber-200/40 w-full max-w-sm p-4 sm:p-5 text-center"
      >
        <div className="flex justify-end -mb-2">
          <button
            onClick={onDismiss}
            className="p-1.5 text-slate-400 hover:text-slate-600 border-2 border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Close daily reward modal"
          >
            <X size={16} />
          </button>
        </div>
        <div className="text-3xl mb-1"><Gift size={40} className="mx-auto text-amber-500" /></div>
        <h2 className="text-xl font-black text-slate-800 mb-1">Daily Reward</h2>
        {streak > 1 && (
          <div className="flex items-center justify-center gap-1 text-orange-500 text-sm font-bold mb-3">
            <Fire size={16} />
            {streak} day streak! ({streakMult}x bonus)
          </div>
        )}

        <div className="grid grid-cols-7 gap-1 mb-4">
          {DAILY_REWARDS.map((reward, i) => {
            const isToday = i === currentDay;
            const isPast = i < currentDay;
            return (
              <div
                key={i}
                className={`rounded-lg p-1.5 text-center border-2 transition-all ${
                  isToday
                    ? 'border-amber-500 bg-amber-50 scale-110 shadow-md shadow-amber-200/40'
                    : isPast
                      ? 'border-slate-200 bg-slate-100 opacity-50'
                      : 'border-slate-200 bg-white'
                }`}
              >
                <div className="text-[8px] font-bold text-slate-400">D{reward.day}</div>
                <div className={`text-[9px] font-bold ${isToday ? 'text-amber-600' : 'text-slate-600'}`}>
                  {reward.label}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleClaim}
          className="btn-game w-full py-2.5 sm:py-3 bg-amber-500 text-white rounded-xl font-bold text-base sm:text-lg border-b-4 border-amber-700 hover:bg-amber-400 transition-all"
        >
          Claim Day {currentDay + 1}!
        </button>
      </motion.div>
    </div>
  );
}
