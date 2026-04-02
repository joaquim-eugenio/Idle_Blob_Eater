import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { OFFLINE_BASE_EFFICIENCY, OFFLINE_MAX_HOURS, SKILL_NODE_LOOKUP } from '../lib/constants';

export function useOfflineProgress() {
  const [offlineData, setOfflineData] = useState<{ earnings: number; timeAway: number } | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const state = useGameStore.getState();
    const now = Date.now();
    const elapsed = (now - state.lastSaveTimestamp) / 1000;

    if (elapsed < 60) return;

    const maxSeconds = OFFLINE_MAX_HOURS * 3600;
    const cappedSeconds = Math.min(elapsed, maxSeconds);
    const skillOfflineBonus = state.unlockedSkillNodes.reduce((acc, id) => (
      acc + (SKILL_NODE_LOOKUP[id]?.effects?.offlineEfficiency || 0)
    ), 0);
    const offlineRate = OFFLINE_BASE_EFFICIENCY + state.evolutionUpgrades.offlineRate * 0.1 + skillOfflineBonus;
    const earnings = Math.floor(state.moneyPerSecond * cappedSeconds * offlineRate);

    if (earnings > 0) {
      setOfflineData({ earnings, timeAway: elapsed });
    }
  }, []);

  const collect = (multiplier = 1) => {
    if (offlineData) {
      useGameStore.getState().applyOfflineProgress(Math.floor(offlineData.earnings * multiplier));
      setDismissed(true);
    }
  };

  const dismiss = () => {
    if (offlineData) {
      useGameStore.getState().applyOfflineProgress(offlineData.earnings);
    }
    setDismissed(true);
  };

  return {
    showModal: offlineData !== null && !dismissed,
    earnings: offlineData?.earnings || 0,
    timeAway: offlineData?.timeAway || 0,
    collect,
    dismiss,
  };
}
