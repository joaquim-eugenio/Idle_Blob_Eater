import { useEffect, useState } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { HUD } from './components/HUD';
import { SkillTree } from './components/SkillTree';
import { ActionBar } from './components/ActionBar';
import { EvolutionPanel } from './components/EvolutionPanel';
import { Tutorial } from './components/Tutorial';
import { DailyRewardModal } from './components/DailyRewardModal';
import { LevelCompleteModal } from './components/LevelCompleteModal';
import { RevivePanel } from './components/RevivePanel';
import { AchievementPanel } from './components/AchievementPanel';
import { AchievementToast } from './components/AchievementToast';
import { StatsPanel } from './components/StatsPanel';
import { Store } from './components/Store';
import { BlobCustomizer } from './components/BlobCustomizer';
import { WorldViewer } from './components/BiomeSelector';
import { WorldUnlockCelebration } from './components/WorldUnlockCelebration';
import { useGameLoop } from './hooks/useGameLoop';
import { useGameStore } from './store/gameStore';

export default function App() {
  useGameLoop();

  const dailyReward = useGameStore(s => s.dailyReward);
  const sessionCount = useGameStore(s => s.sessionCount);
  const checkDailyChargeRefill = useGameStore(s => s.checkDailyChargeRefill);
  const [dailyDismissed, setDailyDismissed] = useState(false);

  useEffect(() => {
    checkDailyChargeRefill();
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const showDaily = sessionCount > 1 && dailyReward.lastClaimDate !== today && !dailyDismissed;

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
      <ActionBar />
      <SkillTree />
      <EvolutionPanel />
      <RevivePanel />
      <LevelCompleteModal />
      <WorldUnlockCelebration />
      <AchievementToast />

      {/* Bottom panel bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-100 to-white border-t-2 border-slate-300/60 pb-safe">
        <div className="flex justify-evenly items-center px-4 py-2.5">
          <AchievementPanel />
          <StatsPanel />
          <Store />
          <BlobCustomizer />
          <WorldViewer />
        </div>
      </div>
      <Tutorial />

      {showDaily && (
        <DailyRewardModal
          onClaim={() => setDailyDismissed(true)}
          onDismiss={() => setDailyDismissed(true)}
        />
      )}
    </div>
  );
}
