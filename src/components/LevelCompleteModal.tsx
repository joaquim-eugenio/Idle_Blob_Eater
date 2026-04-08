import { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CaretIcon, ArrowIcon, SadFaceIcon, BoltIcon, SpinnerIcon } from './icons';
import { useGameStore } from '../store/gameStore';
import { getWorldForLevel } from '../lib/levels';
import { getSuggestedUpgrade, getSuggestionReason, type RunContext } from '../lib/suggestUpgrade';
import { shouldShowInterstitial, showInterstitialAd, type InterstitialContext } from '../lib/ads';
import { pickQuote, LEVEL_CLEAR_QUOTES } from '../lib/blobQuotes';

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return Math.floor(n).toLocaleString();
}

function SkillTreeIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="22" x2="12" y2="13" />
      <line x1="12" y1="13" x2="5" y2="6" />
      <line x1="12" y1="13" x2="19" y2="6" />
      <line x1="12" y1="13" x2="12" y2="4" />
      <circle cx="12" cy="3" r="2.5" fill="currentColor" opacity={0.25} />
      <circle cx="5" cy="5" r="2.5" fill="currentColor" opacity={0.25} />
      <circle cx="19" cy="5" r="2.5" fill="currentColor" opacity={0.25} />
      <line x1="8" y1="22" x2="16" y2="22" />
    </svg>
  );
}

export function LevelCompleteModal() {
  const {
    levelComplete, levelFailed, levelStars, levelRewards, currentLevel,
    completeLevel, advanceToNextLevel, retryLevel, openSkillTree,
    money, unlockedSkillNodes, lastRunEatRatio, lastRunSurvivalTime,
    _oversizedVomitCount,
    buySuggestedAndRetry, buySuggestedUpgrade,
    highestLevelReached, interstitialLevelsSinceAd, interstitialSessionAdCount,
    interstitialLastTime, lastRewardedAdTime, recordInterstitialShown,
    setPendingWorldUnlock, noInterstitialAds,
  } = useGameStore();
  const [hasCollected, setHasCollected] = useState(false);
  const [justBought, setJustBought] = useState(false);
  const [showingAd, setShowingAd] = useState(false);
  const advancingRef = useRef(false);

  useEffect(() => {
    if (!levelComplete && !levelFailed) {
      advancingRef.current = false;
      setJustBought(false);
      setShowingAd(false);
    }
  }, [levelComplete, levelFailed]);

  useEffect(() => {
    if (levelComplete && !hasCollected) {
      completeLevel();
      setHasCollected(true);
    }
  }, [levelComplete]);

  const handleNext = async () => {
    if (advancingRef.current) return;
    advancingRef.current = true;

    const ctx: InterstitialContext = {
      highestLevelReached,
      currentLevel,
      levelsSinceLastAd: interstitialLevelsSinceAd,
      sessionAdCount: interstitialSessionAdCount,
      lastInterstitialTime: interstitialLastTime,
      lastRewardedAdTime,
      noInterstitialAds,
    };

    if (shouldShowInterstitial(ctx)) {
      setShowingAd(true);
      try {
        await showInterstitialAd();
        recordInterstitialShown();
      } catch {
        // Ad failed -- skip gracefully
      }
      setShowingAd(false);
    }

    setHasCollected(false);
    if (worldChanged) {
      setPendingWorldUnlock(currentWorld, nextWorld);
    } else {
      advanceToNextLevel();
    }
  };

  const handleRetry = () => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    retryLevel();
  };

  const runContext: RunContext | undefined = (lastRunEatRatio > 0 || lastRunSurvivalTime > 0)
    ? { eatRatio: lastRunEatRatio, survivalTime: lastRunSurvivalTime, oversizedVomitCount: _oversizedVomitCount }
    : undefined;

  const failSuggestion = useMemo(
    () => levelFailed ? getSuggestedUpgrade(money, unlockedSkillNodes, runContext) : null,
    [levelFailed, money, unlockedSkillNodes, lastRunEatRatio, lastRunSurvivalTime, _oversizedVomitCount],
  );

  const successSuggestion = useMemo(
    () => (hasCollected && levelRewards) ? getSuggestedUpgrade(money, unlockedSkillNodes) : null,
    [hasCollected, levelRewards, money, unlockedSkillNodes],
  );

  const handleBuyAndRetry = () => {
    if (advancingRef.current || !failSuggestion) return;
    advancingRef.current = true;
    buySuggestedAndRetry(failSuggestion.id);
  };

  const handleBuyOnSuccess = () => {
    if (!successSuggestion) return;
    buySuggestedUpgrade(successSuggestion.id);
    setJustBought(true);
  };

  const nextWorld = getWorldForLevel(currentLevel + 1);
  const currentWorld = getWorldForLevel(currentLevel);
  const worldChanged = nextWorld.id !== currentWorld.id;
  const isBossLevel = Number.isFinite(currentWorld.levelRange[1]) && currentWorld.levelRange[1] === currentLevel;

  const hungerQuote = useMemo(
    () => hasCollected ? pickQuote(LEVEL_CLEAR_QUOTES) : '',
    [hasCollected],
  );

  const showSuccess = hasCollected && levelRewards;
  const showFailure = levelFailed;

  return (
    <AnimatePresence>
      {showFailure && (
        <motion.div
          key="failure"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-30 flex items-center justify-center bg-black/50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="bg-white rounded-3xl border-3 border-red-400 shadow-lg shadow-red-200/40 p-6 w-[90%] max-w-sm mx-auto flex flex-col items-center gap-4"
          >
            <div className="text-lg font-bold text-slate-400 uppercase tracking-wider">
              Level {currentLevel}
            </div>

            <div className="text-3xl font-black text-red-600">
              Starved!
            </div>

            <div className="text-red-400 flex justify-center"><SadFaceIcon size={64} /></div>

            <div className="bg-red-50 rounded-xl px-6 py-3 w-full text-center border-2 border-red-200">
              <div className="text-sm font-bold text-red-700 uppercase tracking-wide">Level Failed</div>
              <div className="text-sm text-red-600 mt-1 font-body">
                Your blob ran out of energy! Eat faster to stay alive.
              </div>
            </div>

            <div className="flex items-center gap-2 bg-amber-50 rounded-xl px-4 py-3 w-full border-2 border-amber-200">
              <ArrowIcon direction="up" size={18} className="text-amber-600 shrink-0" />
              <span className="text-sm text-amber-800 font-body">
                {failSuggestion ? getSuggestionReason(failSuggestion) : 'Try upgrading Speed, Suction, or Hunger to clear faster!'}
              </span>
            </div>

            {failSuggestion ? (
              <div className="flex flex-col gap-2 w-full">
                <motion.button
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  onClick={handleBuyAndRetry}
                  className="btn-game w-full bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-2xl border-b-4 border-emerald-700 flex flex-col items-center justify-center transition-all"
                >
                  <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-wide">Recommended Upgrade</span>
                  <span className="flex items-center gap-1.5 text-sm mt-0.5">
                    <BoltIcon size={14} className="shrink-0" />
                    <span className="truncate">{failSuggestion.title}</span>
                    <span className="text-emerald-200 text-xs font-black shrink-0">${fmt(failSuggestion.cost)}</span>
                  </span>
                </motion.button>
                <button
                  onClick={handleRetry}
                  className="btn-game w-full bg-red-500 text-white font-bold text-base py-3 rounded-2xl border-b-4 border-red-700 flex items-center justify-center gap-2 transition-all"
                >
                  <ArrowIcon direction="refresh" size={18} />
                  Retry
                </button>
              </div>
            ) : (
              <div className="flex gap-3 w-full">
                <button
                  onClick={openSkillTree}
                  className="btn-game flex-1 bg-slate-100 text-slate-700 font-bold text-base py-3 rounded-2xl border-b-4 border-slate-300 flex items-center justify-center gap-2 transition-all"
                >
                  <SkillTreeIcon size={18} />
                  Skills
                </button>
                <button
                  onClick={handleRetry}
                  className="btn-game flex-1 bg-red-500 text-white font-bold text-base py-3 rounded-2xl border-b-4 border-red-700 flex items-center justify-center gap-2 transition-all"
                >
                  <ArrowIcon direction="refresh" size={18} />
                  Retry
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      {showSuccess && !showingAd && (
        <motion.div
          key="success"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-30 flex items-center justify-center bg-black/50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="bg-white rounded-3xl border-3 border-amber-400 shadow-lg shadow-amber-200/40 p-6 w-[90%] max-w-sm mx-auto flex flex-col items-center gap-4"
          >
            <div className="text-lg font-bold text-slate-400 uppercase tracking-wider">
              Level {currentLevel}
            </div>

            <div className="text-3xl font-black text-slate-800">
              {isBossLevel ? 'World Clear!' : 'Level Clear!'}
            </div>

            <div className="text-sm italic text-slate-400 text-center font-body -mt-1">
              {hungerQuote}
            </div>

            <div className="flex flex-col items-center gap-1 bg-emerald-50 rounded-xl px-6 py-3 w-full border-2 border-emerald-300">
              <div className="text-sm font-bold text-emerald-700 uppercase tracking-wide">Rewards</div>
              <div className="text-2xl font-black text-emerald-600">${fmt(levelRewards.money)}</div>
              <div className="flex gap-3 mt-1">
                {levelRewards.gems && levelRewards.gems > 0 && (
                  <span className="text-sm font-bold text-purple-600">+{levelRewards.gems} Gems</span>
                )}
                {levelRewards.essence && levelRewards.essence > 0 && (
                  <span className="text-sm font-bold text-violet-600">+{levelRewards.essence} Essence</span>
                )}
              </div>
            </div>

            {successSuggestion && !justBought ? (
              <div className="flex flex-col gap-2 w-full mt-1">
                <motion.button
                  key={successSuggestion.id}
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  onClick={handleBuyOnSuccess}
                  className="btn-game w-full bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-2xl border-b-4 border-emerald-700 flex flex-col items-center justify-center transition-all"
                >
                  <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-wide">Recommended Upgrade</span>
                  <span className="flex items-center gap-1.5 text-sm mt-0.5">
                    <BoltIcon size={14} className="shrink-0" />
                    <span className="truncate">{successSuggestion.title}</span>
                    <span className="text-emerald-200 text-xs font-black shrink-0">${fmt(successSuggestion.cost)}</span>
                  </span>
                </motion.button>
                <button
                  onClick={handleNext}
                  className="btn-game w-full bg-blue-500 text-white font-bold text-base py-3 rounded-2xl border-b-4 border-blue-700 flex items-center justify-center gap-2 transition-all"
                >
                  Next Level
                  <CaretIcon direction="right" size={18} />
                </button>
              </div>
            ) : (
              <div className="flex gap-3 w-full mt-1">
                {justBought ? (
                  <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex-1 bg-emerald-100 text-emerald-700 font-bold text-base py-3 rounded-2xl border-b-4 border-emerald-300 flex items-center justify-center gap-2"
                  >
                    Purchased!
                  </motion.div>
                ) : (
                  <button
                    onClick={openSkillTree}
                    className="btn-game flex-1 bg-slate-100 text-slate-700 font-bold text-base py-3 rounded-2xl border-b-4 border-slate-300 flex items-center justify-center gap-2 transition-all"
                  >
                    <SkillTreeIcon size={18} />
                    Skills
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="btn-game flex-1 bg-blue-500 text-white font-bold text-base py-3 rounded-2xl border-b-4 border-blue-700 flex items-center justify-center gap-2 transition-all"
                >
                  Next Level
                  <CaretIcon direction="right" size={18} />
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      {showingAd && (
        <motion.div
          key="interstitial"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-40 flex items-center justify-center bg-black/70"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 w-[80%] max-w-xs mx-auto flex flex-col items-center gap-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            >
              <SpinnerIcon size={40} className="text-blue-500" />
            </motion.div>
            <div className="text-base font-bold text-slate-600">Loading ad...</div>
            <div className="text-xs text-slate-400">Game will continue shortly</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
