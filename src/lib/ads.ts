import { AD_RECHARGE_COOLDOWN_MS, INTERSTITIAL_CONFIG, type AbilityId } from './constants';
import { getWorldForLevel } from './levels';

export function showRewardedAd(): Promise<boolean> {
  // Stub: replace with real SDK (AdMob, Unity Ads, IronSource) when deploying
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 1500);
  });
}

export function showInterstitialAd(): Promise<boolean> {
  // Stub: replace with real SDK (AdMob, Unity Ads, IronSource) when deploying
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 2000);
  });
}

export interface InterstitialContext {
  highestLevelReached: number;
  currentLevel: number;
  levelsSinceLastAd: number;
  sessionAdCount: number;
  lastInterstitialTime: number;
  lastRewardedAdTime: number;
  noInterstitialAds?: boolean;
}

export function shouldShowInterstitial(ctx: InterstitialContext): boolean {
  if (ctx.noInterstitialAds) return false;

  const cfg = INTERSTITIAL_CONFIG;

  if (ctx.highestLevelReached <= cfg.graceLevels) return false;

  if (ctx.sessionAdCount >= cfg.sessionCap) return false;

  if (ctx.lastInterstitialTime > 0 && Date.now() - ctx.lastInterstitialTime < cfg.cooldownMs) {
    return false;
  }

  if (ctx.lastRewardedAdTime > 0 && Date.now() - ctx.lastRewardedAdTime < cfg.rewardedAdGraceMs) {
    return false;
  }

  if (cfg.worldTransitionExempt) {
    const curWorld = getWorldForLevel(ctx.currentLevel);
    const nextWorld = getWorldForLevel(ctx.currentLevel + 1);
    if (curWorld.id !== nextWorld.id) return false;
  }

  if (ctx.levelsSinceLastAd < cfg.baseInterval) return false;

  const overshoot = ctx.levelsSinceLastAd - cfg.baseInterval;
  const probability = Math.min(cfg.maxProbability, cfg.baseProbability + cfg.probabilityStep * overshoot);
  return Math.random() < probability;
}

export function canShowAdForAbility(
  id: AbilityId,
  lastAdRechargeTime: Record<AbilityId, number>,
): boolean {
  const last = lastAdRechargeTime[id] || 0;
  return Date.now() - last >= AD_RECHARGE_COOLDOWN_MS;
}

export function adCooldownRemaining(
  id: AbilityId,
  lastAdRechargeTime: Record<AbilityId, number>,
): number {
  const last = lastAdRechargeTime[id] || 0;
  return Math.max(0, AD_RECHARGE_COOLDOWN_MS - (Date.now() - last));
}
