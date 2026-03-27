import { useEffect, useState } from 'react';
import { IconContext } from '@phosphor-icons/react';
import { GameCanvas } from './components/GameCanvas';
import { HUD } from './components/HUD';
import { SkillTree } from './components/SkillTree';
import { ActionBar } from './components/ActionBar';
import { EvolutionPanel } from './components/EvolutionPanel';
import { Tutorial } from './components/Tutorial';
import { WelcomeBackModal } from './components/WelcomeBackModal';
import { DailyRewardModal } from './components/DailyRewardModal';
import { LevelCompleteModal } from './components/LevelCompleteModal';
import { AchievementPanel } from './components/AchievementPanel';
import { StatsPanel } from './components/StatsPanel';
import { GemShop } from './components/GemShop';
import { BlobCustomizer } from './components/BlobCustomizer';
import { WorldViewer } from './components/BiomeSelector';
import { DebugPanel } from './components/DebugPanel';
import { useGameLoop } from './hooks/useGameLoop';
import { useOfflineProgress } from './hooks/useOfflineProgress';
import { useGameStore } from './store/gameStore';

export default function App() {
  useGameLoop();

  const offline = useOfflineProgress();
  const dailyReward = useGameStore(s => s.dailyReward);
  const sessionCount = useGameStore(s => s.sessionCount);
  const [dailyDismissed, setDailyDismissed] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const showDaily = sessionCount > 1 && dailyReward.lastClaimDate !== today && !dailyDismissed;
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
    <IconContext.Provider value={{ weight: 'fill' }}>
    <div className="relative w-full h-[100dvh] bg-white overflow-hidden select-none touch-none">
      <GameCanvas />
      <HUD />
      <ActionBar />
      <SkillTree />
      {/* <EvolutionPanel /> */}
      <LevelCompleteModal />

      {/* Bottom panel bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe">
        <div className="flex justify-evenly items-center px-2 py-2">
          <AchievementPanel />
          <StatsPanel />
          <GemShop />
          <BlobCustomizer />
          <WorldViewer />
          <DebugPanel />
        </div>
      </div>
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
    </IconContext.Provider>
  );
}
