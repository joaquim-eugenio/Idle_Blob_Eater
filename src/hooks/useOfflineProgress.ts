import { useEffect, useState, useCallback } from 'react';
import { useGameStore, type AutopilotResult } from '../store/gameStore';
import { OFFLINE_BASE_EFFICIENCY, OFFLINE_MAX_HOURS, SKILL_NODE_LOOKUP } from '../lib/constants';

function resolveOffline() {
  const state = useGameStore.getState();
  const now = Date.now();
  const elapsed = (now - state.lastSaveTimestamp) / 1000;

  if (elapsed < 60) {
    if (state.autopilotActive) {
      useGameStore.getState().deactivateAutopilot();
    }
    return { offlineData: null, autopilotResult: null };
  }

  if (state.autopilotActive && state.autopilotSnapshot) {
    const result = useGameStore.getState().resolveAutopilot();
    if (result) {
      return { offlineData: null, autopilotResult: result };
    }
  }

  const hasDeepFoodComa = state.purchasedPermanentBoosts?.includes('deep_food_coma');
  const maxHours = hasDeepFoodComa ? 16 : OFFLINE_MAX_HOURS;
  const maxSeconds = maxHours * 3600;
  const cappedSeconds = Math.min(elapsed, maxSeconds);
  const skillOfflineBonus = state.unlockedSkillNodes.reduce((acc, id) => (
    acc + (SKILL_NODE_LOOKUP[id]?.effects?.offlineEfficiency || 0)
  ), 0);
  const offlineRate = OFFLINE_BASE_EFFICIENCY + state.evolutionUpgrades.offlineRate * 0.1 + skillOfflineBonus;
  const hasSleepEating = state.purchasedPermanentBoosts?.includes('sleep_eating');
  const has24hBoost = (state.offlineBoost24hExpires || 0) > Date.now();
  const offlineBoostMult = (hasSleepEating || has24hBoost) ? 2 : 1;
  const earnings = Math.floor(state.moneyPerSecond * cappedSeconds * offlineRate * offlineBoostMult);

  if (earnings > 0) {
    return { offlineData: { earnings, timeAway: elapsed }, autopilotResult: null };
  }

  return { offlineData: null, autopilotResult: null };
}

export function useOfflineProgress() {
  const [offlineData, setOfflineData] = useState<{ earnings: number; timeAway: number } | null>(null);
  const [autopilotResult, setAutopilotResult] = useState<AutopilotResult | null>(null);
  const [dismissed, setDismissed] = useState(false);

  const runResolve = useCallback(() => {
    const { offlineData: od, autopilotResult: ar } = resolveOffline();
    if (ar) {
      setAutopilotResult(ar);
      setDismissed(false);
    } else if (od) {
      setOfflineData(od);
      setDismissed(false);
    }
  }, []);

  useEffect(() => {
    runResolve();
  }, [runResolve]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        runResolve();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [runResolve]);

  const collect = (multiplier = 1) => {
    if (offlineData) {
      useGameStore.getState().applyOfflineProgress(Math.floor(offlineData.earnings * multiplier));
      setOfflineData(null);
      setDismissed(true);
    }
  };

  const dismiss = () => {
    if (offlineData) {
      useGameStore.getState().applyOfflineProgress(offlineData.earnings);
    }
    setOfflineData(null);
    setDismissed(true);
  };

  const dismissAutopilot = () => {
    setAutopilotResult(null);
    setDismissed(true);
  };

  const reviveAutopilot = () => {
    if (autopilotResult) {
      useGameStore.getState().reviveFromAutopilot(autopilotResult);
      setAutopilotResult(null);
      setDismissed(true);
    }
  };

  return {
    showModal: offlineData !== null && !dismissed && !autopilotResult,
    showAutopilotModal: autopilotResult !== null && !dismissed,
    autopilotResult,
    earnings: offlineData?.earnings || 0,
    timeAway: offlineData?.timeAway || 0,
    collect,
    dismiss,
    dismissAutopilot,
    reviveAutopilot,
  };
}
