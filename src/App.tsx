import { useEffect, useState } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { HUD } from './components/HUD';
import { SkillTree } from './components/SkillTree';
import { EvolutionPanel } from './components/EvolutionPanel';
import { AchievementToast } from './components/AchievementToast';
import { Tutorial } from './components/Tutorial';
import { WelcomeBackModal } from './components/WelcomeBackModal';
import { DailyRewardModal } from './components/DailyRewardModal';
import { useGameLoop } from './hooks/useGameLoop';
import { useOfflineProgress } from './hooks/useOfflineProgress';
import { useGameStore } from './store/gameStore';

export default function App() {
  useGameLoop();

  const offline = useOfflineProgress();
  const dailyReward = useGameStore(s => s.dailyReward);
  const [dailyDismissed, setDailyDismissed] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const showDaily = dailyReward.lastClaimDate !== today && !dailyDismissed;
  const showWelcome = !showDaily && offline.showModal;

  useEffect(() => {
    const preventDefault = (e: Event) => e.preventDefault();
    document.addEventListener('gesturestart', preventDefault);
    document.addEventListener('gesturechange', preventDefault);
    document.addEventListener('gestureend', preventDefault);
    return () => {
      document.removeEventListener('gesturestart', preventDefault);
      document.removeEventListener('gesturechange', preventDefault);
      document.removeEventListener('gestureend', preventDefault);
    };
  }, []);

  return (
    <div className="relative w-full h-[100dvh] bg-white overflow-hidden select-none touch-none">
      <GameCanvas />
      <HUD />
      <SkillTree />
      <EvolutionPanel />
      <AchievementToast />
      <Tutorial />

      {showDaily && (
        <DailyRewardModal
          onClaim={() => setDailyDismissed(true)}
          onDismiss={() => setDailyDismissed(true)}
        />
      )}

      {showWelcome && (
        <WelcomeBackModal
          earnings={offline.earnings}
          timeAway={offline.timeAway}
          onCollect={(mult) => offline.collect(mult)}
          onClose={() => offline.dismiss()}
        />
      )}
    </div>
  );
}
