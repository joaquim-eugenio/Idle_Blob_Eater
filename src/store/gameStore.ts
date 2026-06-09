import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  BASE_MAX_HUNGER, BASE_HUNGER_DRAIN, BASE_SPEED, BASE_SUCTION,
  UPGRADE_SOFT_CAP, softCap,
  EVOLUTION_UPGRADES, ACHIEVEMENTS,
  DAILY_REWARDS, STREAK_MULTIPLIERS, BLOB_SKINS, SKILL_TREE_NODES,
  SKILL_NODE_LOOKUP, SkillNodeDef, SKILL_BRANCH_ORDER, getStarterSkillNodesFromLegacy, SKILL_GATES,
  ACTIVE_ABILITIES, type AbilityId, ABILITY_CHARGES,
  SPECIAL_SKINS, BLOB_ITEMS, BLOB_FACES,
  getOversizedConfig, OVERSIZED_MIN_LEVEL_IN_WORLD, OVERSIZED_PROACTIVE_VALUE_MULT,
  OVERSIZED_VOMIT_STAGES,
  SWIPE_FRICTION, SWIPE_MIN_VEL,
  STEER_SPEED_MULT, STEER_ACCEL_LERP, STEER_PERFECT_WINDOW,
  RAM_VEL_THRESHOLD, PERFECT_SWIPE_THRESHOLD,
  FRENZY_DASH_THRESHOLD, FRENZY_DASH_DURATION,
} from '../lib/constants';
import { showRewardedAd, canShowAdForAbility } from '../lib/ads';
import { getLevel, getWorldForLevel, WORLDS, type WorldDef } from '../lib/levels';
import { ITEM_LOOKUP, getItemsForWorld } from '../lib/itemCatalog';
import {
  CONSUMABLES, PERMANENT_BOOSTS, IAP_BOOSTS,
  FEATURED_PACKS, MILESTONE_PACKS, GEM_PACKS,
  GEM_BUNDLES, IAP_BUNDLES,
  FREE_GIFT_COOLDOWN_MS, FREE_GIFT_MAX_DAILY, FREE_GIFT_POOL,
  getDailyDealForDate, getTimedBoostForConsumable,
  type FreeGiftReward,
} from '../lib/storeItems';
import { purchaseProduct } from '../lib/iap';

export interface Item {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  type: string;
  value: number;
  weight: number;
  isLegacy?: boolean;
  isOversized?: boolean;
  isOversizedFragment?: boolean;
  // Bonus / ability-spawned food (e.g. Food Rain). Bonus food does not count
  // toward level progression and does not refill hunger; only its money value
  // is granted. Kept under the legacy `isTapFood` name for compatibility.
  isTapFood?: boolean;
  // ramHitsRequired/Received replace the old tap-count system. The legacy
  // splitTapsRequired/Received aliases are kept as optional properties for
  // save migration compatibility but are no longer driven by the game loop.
  ramHitsRequired?: number;
  ramHitsReceived?: number;
  splitTapsRequired?: number;
  splitTapsReceived?: number;
  splitState?: 'whole' | 'cracking' | 'splitting' | 'swallowing';
  vomitAttempts?: number;
  lastVomitTime?: number;
  _ignoreUntil?: number;
  _ramCooldown?: number;
  oversizedStage?: number;
  swallowTime?: number;
  _fragmentsRemaining?: number;
}

export interface Upgrades {
  speed: number;
  boostSpawnRate: number;
  speedSynergy?: number;
  suction: number;
  suctionStrength: number;
  suctionSynergy?: number;
  hungerDrain: number;
  hungerMax: number;
  hungerSynergy?: number;
  spawnRate: number;
  spawnValue: number;
  spawnSynergy?: number;
  [key: string]: number | undefined;
}

export interface EvolutionUpgrades {
  startingMoney: number;
  globalSpeed: number;
  globalSuction: number;
  hungerResist: number;
  spawnValueMult: number;
  swipeMastery: number;
  glideMastery: number;
  startingLevel: number;
  dashRadius: number;
  [key: string]: number;
}

export interface GameStats {
  totalFoodEaten: number;
  totalMoneyEarned: number;
  totalStarsEaten: number;
  highestLevel: number;
  totalUpgradesBought: number;
  totalSynergiesBought: number;
  highestCombo: number;
  highestSpeed: number;
  totalTaps: number;
  timePlayed: number;
  totalPrestiges: number;
  totalLevelsCompleted: number;
  totalStarsEarned: number;
  worldsCompleted: number;
}

export interface DailyRewardState {
  lastClaimDate: string;
  streak: number;
  cycleDay: number;
}

export interface SkillEffects {
  speedFlat: number;
  speedMult: number;
  suctionFlat: number;
  suctionMult: number;
  spawnRateMult: number;
  valueMult: number;
  hungerDrainMult: number;
  hungerMaxFlat: number;
  comboWindow: number;
  comboCap: number;
  starSpawnRateMult: number;
  lowHungerFrenzyMult: number;
  lowHungerThreshold: number;
  frenzyShieldSeconds: number;
  chainVacuumRadius: number;
  overkillCashRatio: number;
  weightReduction: number;
  magnetRadius: number;
  comboValueScale: number;
  multiEatRadius: number;
  critEatChance: number;
  hungerOnEat: number;
  speedPerCombo: number;
  oversizedValueMult: number;
  // Momentum branch — swipe-dash gameplay.
  swipeImpulseMult: number;
  frictionReduction: number;
  dashEatRadius: number;
  perfectSwipeMult: number;
  magnetWhileDashing: number;
  streakWindow: number;
  streakBonusMult: number;
  ramHitsReduction: number;
}

export interface SkillTelemetry {
  runStartTimestamp: number;
  firstKeystoneAt: number | null;
  gateUnlockTimes: Partial<Record<'gateA' | 'gateB' | 'gateC', number>>;
  nodePickCount: Record<string, number>;
  lastAbandonPoint: string;
}

const EMPTY_SKILL_EFFECTS: SkillEffects = {
  speedFlat: 0, speedMult: 0, suctionFlat: 0, suctionMult: 0,
  spawnRateMult: 0, valueMult: 0, hungerDrainMult: 0, hungerMaxFlat: 0,
  comboWindow: 0, comboCap: 10, starSpawnRateMult: 0,
  lowHungerFrenzyMult: 0, lowHungerThreshold: 0.3,
  frenzyShieldSeconds: 0, chainVacuumRadius: 0, overkillCashRatio: 0,
  weightReduction: 0, magnetRadius: 0,
  comboValueScale: 0, multiEatRadius: 0, critEatChance: 0,
  hungerOnEat: 0, speedPerCombo: 0, oversizedValueMult: 0,
  swipeImpulseMult: 0, frictionReduction: 0, dashEatRadius: 0,
  perfectSwipeMult: 0, magnetWhileDashing: 0,
  streakWindow: 0, streakBonusMult: 0, ramHitsReduction: 0,
};

const DEFAULT_UPGRADES: Upgrades = {
  speed: 0, boostSpawnRate: 0,
  suction: 0, suctionStrength: 0,
  hungerDrain: 0, hungerMax: 0,
  spawnRate: 0, spawnValue: 0,
};

const DEFAULT_EVOLUTION: EvolutionUpgrades = {
  startingMoney: 0, globalSpeed: 0, globalSuction: 0,
  hungerResist: 0, spawnValueMult: 0, swipeMastery: 0,
  glideMastery: 0, startingLevel: 0, dashRadius: 0,
};

const DEFAULT_STATS: GameStats = {
  totalFoodEaten: 0, totalMoneyEarned: 0, totalStarsEaten: 0,
  highestLevel: 1, totalUpgradesBought: 0, totalSynergiesBought: 0,
  highestCombo: 0, highestSpeed: 0, totalTaps: 0, timePlayed: 0,
  totalPrestiges: 0, totalLevelsCompleted: 0, totalStarsEarned: 0,
  worldsCompleted: 0,
};

const DEFAULT_DAILY: DailyRewardState = {
  lastClaimDate: '', streak: 0, cycleDay: 0,
};

export interface AbilityState {
  cooldown: number;
  active: boolean;
  timer: number;
}

type AbilitiesMap = Record<AbilityId, AbilityState>;

const DEFAULT_ABILITIES: AbilitiesMap = {
  magnet: { cooldown: 0, active: false, timer: 0 },
  speed:  { cooldown: 0, active: false, timer: 0 },
  size:   { cooldown: 0, active: false, timer: 0 },
  food:   { cooldown: 0, active: false, timer: 0 },
};

type AbilityChargesMap = Record<AbilityId, number>;

const DEFAULT_ABILITY_CHARGES: AbilityChargesMap = {
  magnet: ABILITY_CHARGES.magnet.maxCharges,
  speed:  ABILITY_CHARGES.speed.maxCharges,
  size:   ABILITY_CHARGES.size.maxCharges,
  food:   ABILITY_CHARGES.food.maxCharges,
};

const DEFAULT_AD_RECHARGE_TIME: Record<AbilityId, number> = {
  magnet: 0, speed: 0, size: 0, food: 0,
};

const DEFAULT_SKILL_TELEMETRY: SkillTelemetry = {
  runStartTimestamp: Date.now(),
  firstKeystoneAt: null,
  gateUnlockTimes: {},
  nodePickCount: {},
  lastAbandonPoint: '',
};

function getAchievementBonuses(unlockedIds: string[]) {
  let moneyMult = 0;
  let speedMult = 0;
  for (const ach of ACHIEVEMENTS) {
    if (unlockedIds.includes(ach.id)) {
      if (ach.reward.type === 'money_mult') moneyMult += ach.reward.value;
      if (ach.reward.type === 'speed_mult') speedMult += ach.reward.value;
    }
  }
  return { moneyMult: 1 + moneyMult, speedMult: 1 + speedMult };
}

function getSkillEffects(unlockedNodeIds: string[]): SkillEffects {
  const fx: SkillEffects = { ...EMPTY_SKILL_EFFECTS };
  for (const nodeId of unlockedNodeIds) {
    const node = SKILL_NODE_LOOKUP[nodeId];
    if (!node?.effects) continue;
    const entries = Object.entries(node.effects) as Array<[keyof SkillEffects, number]>;
    for (const [k, v] of entries) {
      if (typeof v !== 'number') continue;
      if (k === 'comboCap') fx.comboCap = Math.max(fx.comboCap, v);
      else if (k === 'lowHungerThreshold') fx.lowHungerThreshold = Math.max(fx.lowHungerThreshold, v);
      else fx[k] += v;
    }
  }
  return fx;
}

function hasChapterKeystone(unlockedNodeIds: string[], branch: string, chapter: number) {
  return unlockedNodeIds.some((id) => {
    const node = SKILL_NODE_LOOKUP[id];
    return node && node.branch === branch && node.chapter >= chapter && node.type === 'keystone';
  });
}

function hasChapterProgress(unlockedNodeIds: string[], branch: string, chapter: number) {
  return unlockedNodeIds.some((id) => {
    const node = SKILL_NODE_LOOKUP[id];
    return node && node.branch === branch && node.chapter >= chapter;
  });
}

function getChoiceLock(node: SkillNodeDef, unlockedNodeIds: string[]) {
  if (!node.choiceGroup) return false;
  return SKILL_TREE_NODES.some((n) =>
    n.choiceGroup === node.choiceGroup &&
    n.id !== node.id &&
    unlockedNodeIds.includes(n.id)
  );
}

function canUnlockNode(node: SkillNodeDef, unlockedNodeIds: string[]): boolean {
  if (node.type === 'gate') return false;

  if (node.requires.length > 0) {
    const reqNodes = node.requires.map((r) => SKILL_NODE_LOOKUP[r]).filter(Boolean);
    const choiceGroups = new Set(reqNodes.filter((n) => n.choiceGroup).map((n) => n.choiceGroup!));

    for (const reqId of node.requires) {
      const reqNode = SKILL_NODE_LOOKUP[reqId];
      if (reqNode?.choiceGroup && choiceGroups.has(reqNode.choiceGroup)) {
        const siblingsInReqs = node.requires.filter((r) => SKILL_NODE_LOOKUP[r]?.choiceGroup === reqNode.choiceGroup);
        const anyUnlocked = siblingsInReqs.some((r) => unlockedNodeIds.includes(r));
        if (!anyUnlocked) return false;
      } else {
        if (!unlockedNodeIds.includes(reqId)) return false;
      }
    }
  }

  if (node.gateRequired === 'gateA' && !unlockedNodeIds.includes('gate_a_unlock')) return false;
  if (node.gateRequired === 'gateB' && !unlockedNodeIds.includes('gate_b_unlock')) return false;
  if (node.gateRequired === 'gateC' && !unlockedNodeIds.includes('gate_c_unlock')) return false;
  if (getChoiceLock(node, unlockedNodeIds)) return false;
  return true;
}

const MASTERY_CHOICE_GROUPS = ['hunt_mastery', 'feast_mastery', 'survival_mastery', 'auto_mastery'];
const BRANCH_MASTERY_NODES = ['hunt_mastery_node', 'feast_mastery_node', 'survival_mastery_node', 'auto_mastery_node'];

function hasMasteryChoice(unlockedNodeIds: string[], branch: string): boolean {
  const groupMap: Record<string, string> = { hunt: 'hunt_mastery', feast: 'feast_mastery', survival: 'survival_mastery', momentum: 'auto_mastery' };
  const group = groupMap[branch];
  if (!group) return false;
  return SKILL_TREE_NODES.some((n) => n.choiceGroup === group && unlockedNodeIds.includes(n.id));
}

function checkGateUnlocks(
  nextUnlocked: string[],
  nextFlash: string[],
  nextTelemetry: SkillTelemetry,
  moneyPerSecond: number,
  runStartTimestamp: number,
): number {
  let bonusMoney = 0;

  const unlockGate = (gateNodeId: string, gateKey: 'gateA' | 'gateB' | 'gateC') => {
    if (!nextUnlocked.includes(gateNodeId)) {
      nextUnlocked.push(gateNodeId);
      nextFlash.unshift(`gate:${gateKey}`);
      nextTelemetry.gateUnlockTimes = {
        ...nextTelemetry.gateUnlockTimes,
        [gateKey]: Date.now() - runStartTimestamp,
      };
      bonusMoney += Math.max(250, moneyPerSecond * SKILL_GATES[gateKey].moneyBurstMultiplier);
    }
  };

  const ch1Keystones = SKILL_BRANCH_ORDER.filter((branch) =>
    hasChapterKeystone(nextUnlocked, branch, 1)
  ).length;
  if (ch1Keystones >= 2) unlockGate('gate_a_unlock', 'gateA');

  const allBranchesMastery = SKILL_BRANCH_ORDER.every((branch) =>
    hasMasteryChoice(nextUnlocked, branch)
  );
  if (allBranchesMastery && nextUnlocked.includes('gate_a_unlock')) unlockGate('gate_b_unlock', 'gateB');

  const allMasteryNodes = BRANCH_MASTERY_NODES.every((id) => nextUnlocked.includes(id));
  const hasTranscendence = nextUnlocked.includes('apex_transcendence');
  if (allMasteryNodes && hasTranscendence && nextUnlocked.includes('gate_b_unlock')) {
    unlockGate('gate_c_unlock', 'gateC');
  }

  return bonusMoney;
}

function splitOversizedItem(
  item: Item,
  allItems: Item[],
  worldIdx: number,
  valueMult: number,
  skillOversizedValueMult: number,
): { newItems: Item[]; removedId: string; fragmentCount: number } {
  const config = getOversizedConfig(worldIdx)!;
  const fragmentCount = config.fragmentCount;
  const effectiveValueMult = valueMult + skillOversizedValueMult;
  const perFragValue = (item.value * effectiveValueMult) / fragmentCount;
  const world = WORLDS[worldIdx];
  const blobScale = world.blobScale;

  const fragments: Item[] = [];
  for (let i = 0; i < fragmentCount; i++) {
    const angle = (i / fragmentCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
    fragments.push({
      id: Math.random().toString(36).substr(2, 9),
      x: item.x,
      y: item.y,
      vx: Math.cos(angle) * 90 * blobScale,
      vy: Math.sin(angle) * 90 * blobScale,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 2,
      type: item.type,
      value: perFragValue,
      weight: item.weight * 0.5,
      isOversizedFragment: true,
    });
  }

  const newItems = allItems.filter(i => i.id !== item.id).concat(fragments);
  return { newItems, removedId: item.id, fragmentCount };
}

function buildLevelItems(levelNum: number, blobX: number, blobY: number): Item[] {
  const def = getLevel(levelNum);
  const items: Item[] = [];

  const allEntries: { itemId: string; catalogItem: (typeof ITEM_LOOKUP)[string] }[] = [];
  for (const entry of def.items) {
    const catalogItem = ITEM_LOOKUP[entry.itemId];
    if (!catalogItem) continue;
    for (let i = 0; i < entry.count; i++) {
      allEntries.push({ itemId: entry.itemId, catalogItem });
    }
  }

  const totalCount = allEntries.length;
  const cols = Math.max(1, Math.ceil(Math.sqrt(totalCount)));
  const rows = Math.ceil(totalCount / cols);
  const world = getWorldForLevel(levelNum);
  const avgSizeTier = allEntries.reduce((s, e) => s + e.catalogItem.sizeTier, 0) / Math.max(1, totalCount);
  const avgItemSize = (6 + avgSizeTier * 4) * world.blobScale;
  const levelSpread = 1 + levelNum * 0.055;
  const spacing = (avgItemSize * 2.5 + 20) * levelSpread;
  const minDist = (avgItemSize * 2 + 30) + levelNum * 5.5;

  const clusterW = cols * spacing;
  const clusterH = rows * spacing;

  for (let idx = 0; idx < totalCount; idx++) {
    const { catalogItem } = allEntries[idx];
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    let dx = col * spacing - clusterW / 2 + (Math.random() - 0.5) * spacing * 0.5;
    let dy = row * spacing - clusterH / 2 + (Math.random() - 0.5) * spacing * 0.5;

    const dist = Math.hypot(dx, dy);
    if (dist < minDist) {
      const scale = minDist / Math.max(1, dist);
      dx *= scale;
      dy *= scale;
    }

    items.push({
      id: Math.random().toString(36).substr(2, 9),
      x: blobX + dx,
      y: blobY + dy,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 1,
      type: catalogItem.id,
      value: catalogItem.baseValue * (1 + (levelNum - 1) * 0.03),
      weight: catalogItem.weight,
    });
  }

  const worldIdx = WORLDS.indexOf(world);
  if (worldIdx > 0) {
    const prevWorld = WORLDS[worldIdx - 1];
    const prevPool = getItemsForWorld(prevWorld.id);
    if (prevPool.length > 0) {
      const legacyCount = 3 + Math.floor(Math.random() * 3);
      for (let li = 0; li < legacyCount; li++) {
        const pick = prevPool[Math.floor(Math.random() * prevPool.length)];
        const angle = Math.random() * Math.PI * 2;
        const dist = minDist * 0.5 + Math.random() * spacing * 1.5;
        items.push({
          id: Math.random().toString(36).substr(2, 9),
          x: blobX + Math.cos(angle) * dist,
          y: blobY + Math.sin(angle) * dist,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 1,
          type: pick.id,
          value: pick.baseValue,
          weight: pick.weight * 0.3,
          isLegacy: true,
        });
      }
    }
  }

  const levelInWorld = levelNum - world.levelRange[0];
  const oversizedConfig = getOversizedConfig(worldIdx);
  if (oversizedConfig && levelInWorld >= OVERSIZED_MIN_LEVEL_IN_WORLD && worldIdx < WORLDS.length - 1) {
    const nextWorld = WORLDS[worldIdx + 1];
    const nextPool = getItemsForWorld(nextWorld.id);
    const isFirstEligible = levelInWorld === OVERSIZED_MIN_LEVEL_IN_WORLD;
    const shouldSpawn = isFirstEligible || Math.random() < oversizedConfig.spawnChance;
    if (nextPool.length > 0 && shouldSpawn) {
      const count = isFirstEligible ? 1 : 1 + Math.floor(Math.random() * oversizedConfig.maxCount);
      const spawnCount = Math.min(count, oversizedConfig.maxCount);
      for (let oi = 0; oi < spawnCount; oi++) {
        const pick = nextPool[Math.floor(Math.random() * nextPool.length)];
        const angle = Math.random() * Math.PI * 2;
        const dist = minDist * 1.5 + Math.random() * spacing * 2;
        items.push({
          id: Math.random().toString(36).substr(2, 9),
          x: blobX + Math.cos(angle) * dist,
          y: blobY + Math.sin(angle) * dist,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.5,
          type: pick.id,
          value: pick.baseValue * (1 + (levelNum - 1) * 0.03) * 2,
          weight: pick.weight * 1.5,
          isOversized: true,
          ramHitsRequired: oversizedConfig.tapsRequired,
          ramHitsReceived: 0,
          splitState: 'whole',
          vomitAttempts: 0,
          oversizedStage: OVERSIZED_VOMIT_STAGES,
          _fragmentsRemaining: oversizedConfig.fragmentCount,
          lastVomitTime: 0,
        });
      }
    }
  }

  return items;
}

interface GameState {
  money: number;
  currentLevel: number;
  hunger: number;
  levelItemsEaten: number;
  levelItemsTotal: number;
  levelComplete: boolean;
  levelFailed: boolean;
  reviveOffered: boolean;
  reviveUsedThisAttempt: boolean;
  levelStars: number;
  levelStartTime: number;
  levelRewards: { money: number; essence?: number; gems?: number } | null;
  highestLevelReached: number;
  blobGrowth: number;

  blobPosition: { x: number; y: number };
  blobVelocity: { x: number; y: number };
  // Analog-stick steering: while a finger is held, dirX/dirY/magnitude describe
  // the input vector from the blob's screen position to the touch. The tick
  // loop uses this to drive blobVelocity directly. On release, active goes
  // false and the friction model takes over.
  steerInput: {
    active: boolean;
    dirX: number;
    dirY: number;
    magnitude: number;
  };
  items: Item[];
  upgrades: Upgrades;
  starSpawnTimer: number;
  boostActive: boolean;
  boostTimer: number;
  starBoostActive: boolean;
  starBoostTimer: number;
  levelUpTime: number;

  // Swipe-streak / Frenzy Dash dopamine layer
  swipeStreak: number;
  lastSwipeTime: number;
  frenzyDashActive: boolean;
  frenzyDashTimer: number;
  perfectSwipePending: number;        // seconds remaining in current perfect-swipe window
  _swipeItemCount: number;            // items eaten in the current swipe (resets per impulse)
  _perfectSwipeFired: boolean;        // true once Perfect Swipe banner has been shown for this swipe
  newRecordFlag: 'time' | 'stars' | 'both' | null;

  bestTimes: Record<number, number>;
  bestStars: Record<number, number>;

  essence: number;
  currentRunMoney: number;
  evolutionUpgrades: EvolutionUpgrades;

  gems: number;
  unlockedSkins: string[];
  currentSkin: string;
  currentSpecialSkin: string;
  unlockedSpecialSkins: string[];
  currentItem: string;
  unlockedItems: string[];
  currentFace: string;
  unlockedFaces: string[];

  achievements: string[];
  newAchievements: string[];
  stats: GameStats;

  comboCount: number;
  comboTimer: number;

  dailyReward: DailyRewardState;

  unlockedSkillNodes: string[];
  skillFlashEvents: string[];
  skillTelemetry: SkillTelemetry;

  tutorialStep: number;
  tutorialComplete: boolean;

  sessionCount: number;

  completedHints: string[];
  activeHint: string | null;

  lastRunEatRatio: number;
  lastRunSurvivalTime: number;

  skillTreeOpen: boolean;
  customizerOpen: boolean;
  _openPanelCount: number;

  abilities: AbilitiesMap;
  abilityCharges: AbilityChargesMap;
  lastAdRechargeTime: Record<AbilityId, number>;
  lastDailyChargeRefill: string;

  interstitialLevelsSinceAd: number;
  interstitialSessionAdCount: number;
  interstitialLastTime: number;
  lastRewardedAdTime: number;

  // Store state
  purchasedPacks: string[];
  purchasedPermanentBoosts: string[];
  noInterstitialAds: boolean;
  consumableInventory: Record<string, number>;
  activeTimedBoosts: Array<{ id: string; expiresAt: number }>;
  freeGiftLastClaim: number;
  freeGiftClaimsToday: number;
  lastFreeGiftDate: string;
  dailyDealDate: string;
  dailyDealPurchased: boolean;
  spicyMealActive: boolean;

  moneyPerSecond: number;

  _moneyBuffer: number;
  _moneyBufferTime: number;
  _achievementTimer: number;
  _levelInitialized: boolean;
  _shieldCooldown: number;
  _minHungerPct: number;
  _introPlaying: boolean;
  _oversizedVomitCount: number;
  _benchmarkActive: boolean;

  pendingWorldUnlock: { from: WorldDef; to: WorldDef } | null;

  sfxEnabled: boolean;
  musicEnabled: boolean;
  hapticsEnabled: boolean;

  setPendingWorldUnlock: (from: WorldDef, to: WorldDef) => void;
  clearPendingWorldUnlock: () => void;
  toggleSetting: (key: 'sfxEnabled' | 'musicEnabled' | 'hapticsEnabled') => void;
  initLevel: (levelNum: number) => void;
  completeLevel: () => void;
  endIntro: () => void;
  advanceToNextLevel: () => void;
  retryLevel: () => void;
  reviveBlob: () => void;
  declineRevive: () => void;
  buyUpgrade: (type: keyof Upgrades, cost: number) => void;
  unlockSkillNode: (nodeId: string) => void;
  dismissSkillFlashEvent: (id: string) => void;
  activateBoost: () => void;
  activateStarBoost: () => void;
  tick: (delta: number, width: number, height: number) => void;
  resetGame: () => void;
  prestige: () => void;
  buyEvolutionUpgrade: (id: string) => void;
  setSteerInput: (active: boolean, dirX: number, dirY: number, magnitude: number) => void;
  claimDailyReward: () => void;
  buyPermanentBoost: (id: string) => void;
  buyConsumable: (id: string) => void;
  useConsumable: (id: string) => void;
  buyGemBundle: (id: string) => void;
  buyIAPProduct: (productId: string) => Promise<boolean>;
  claimFreeGift: () => FreeGiftReward | null;
  buyDailyDeal: () => void;
  buyBlobSkin: (id: string) => void;
  setSkin: (id: string) => void;
  buySpecialSkin: (id: string) => void;
  setSpecialSkin: (id: string) => void;
  buyBlobItem: (id: string) => void;
  setItem: (id: string) => void;
  buyBlobFace: (id: string) => void;
  setFace: (id: string) => void;
  dismissAchievement: (id: string) => void;
  completeTutorial: () => void;
  advanceTutorial: () => void;
  showHint: (id: string) => void;
  dismissHint: (id: string) => void;
  activateAbility: (id: AbilityId) => void;
  rechargeAbility: (id: AbilityId) => Promise<boolean>;
  rechargeAllAbilities: () => Promise<boolean>;
  checkDailyChargeRefill: () => boolean;
  buySuggestedAndRetry: (nodeId: string) => void;
  buySuggestedUpgrade: (nodeId: string) => void;
  recordInterstitialShown: () => void;
  openSkillTree: () => void;
  closeSkillTree: () => void;
  openCustomizer: () => void;
  closeCustomizer: () => void;
  panelOpened: () => void;
  panelClosed: () => void;
  clearNewRecordFlag: () => void;
  debugAddResources: (money: number, gems: number, essence: number) => void;
  debugFillHunger: () => void;
  debugUnlockAllCosmetics: () => void;
  debugStartBenchmark: () => void;
  debugSetLevel: (level: number) => void;
}

export function getCurrentWorld(level: number): WorldDef {
  return getWorldForLevel(level);
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      money: 0,
      currentLevel: 1,
      hunger: BASE_MAX_HUNGER * 0.6,
      levelItemsEaten: 0,
      levelItemsTotal: 0,
      levelComplete: false,
      levelFailed: false,
      reviveOffered: false,
      reviveUsedThisAttempt: false,
      levelStars: 0,
      levelStartTime: Date.now(),
      levelRewards: null,
      highestLevelReached: 1,
      blobGrowth: 0,

      blobPosition: { x: 200, y: 300 },
      blobVelocity: { x: 0, y: 0 },
      steerInput: { active: false, dirX: 0, dirY: 0, magnitude: 0 },
      items: [],
      upgrades: { ...DEFAULT_UPGRADES },
      starSpawnTimer: 10,
      boostActive: false,
      boostTimer: 0,
      starBoostActive: false,
      starBoostTimer: 0,
      levelUpTime: 0,

      swipeStreak: 0,
      lastSwipeTime: 0,
      frenzyDashActive: false,
      frenzyDashTimer: 0,
      perfectSwipePending: 0,
      _swipeItemCount: 0,
      _perfectSwipeFired: false,
      newRecordFlag: null,

      bestTimes: {},
      bestStars: {},

      essence: 0,
      currentRunMoney: 0,
      evolutionUpgrades: { ...DEFAULT_EVOLUTION },

      gems: 0,
      unlockedSkins: ['default'],
      currentSkin: 'default',
      currentSpecialSkin: '',
      unlockedSpecialSkins: [],
      currentItem: '',
      unlockedItems: [],
      currentFace: '',
      unlockedFaces: [],

      achievements: [],
      newAchievements: [],
      stats: { ...DEFAULT_STATS },

      comboCount: 0,
      comboTimer: 0,

      dailyReward: { ...DEFAULT_DAILY },

      unlockedSkillNodes: [],
      skillFlashEvents: [],
      skillTelemetry: { ...DEFAULT_SKILL_TELEMETRY },

      tutorialStep: 0,
      tutorialComplete: false,

      sessionCount: 0,

      completedHints: [],
      activeHint: null,

      lastRunEatRatio: 0,
      lastRunSurvivalTime: 0,

      skillTreeOpen: false,
      customizerOpen: false,
      _openPanelCount: 0,

      abilities: { ...DEFAULT_ABILITIES },
      abilityCharges: { ...DEFAULT_ABILITY_CHARGES },
      lastAdRechargeTime: { ...DEFAULT_AD_RECHARGE_TIME },
      lastDailyChargeRefill: '',

      interstitialLevelsSinceAd: 0,
      interstitialSessionAdCount: 0,
      interstitialLastTime: 0,
      lastRewardedAdTime: 0,

      purchasedPacks: [],
      purchasedPermanentBoosts: [],
      noInterstitialAds: false,
      consumableInventory: {},
      activeTimedBoosts: [],
      freeGiftLastClaim: 0,
      freeGiftClaimsToday: 0,
      lastFreeGiftDate: '',
      dailyDealDate: '',
      dailyDealPurchased: false,
      spicyMealActive: false,

      moneyPerSecond: 0,

      _moneyBuffer: 0,
      _moneyBufferTime: 0,
      _achievementTimer: 0,
      _levelInitialized: false,
      _shieldCooldown: 0,
      _minHungerPct: 1,
      _introPlaying: false,
      _oversizedVomitCount: 0,
      _benchmarkActive: false,

      pendingWorldUnlock: null,

      sfxEnabled: true,
      musicEnabled: true,
      hapticsEnabled: true,

      setPendingWorldUnlock: (from, to) => set({ pendingWorldUnlock: { from, to } }),
      clearPendingWorldUnlock: () => set({ pendingWorldUnlock: null }),

      toggleSetting: (key) => set((state) => ({ [key]: !state[key] })),

      initLevel: (levelNum) => set((state) => {
        const def = getLevel(levelNum);
        const levelItems = buildLevelItems(levelNum, 200, 300);

        return {
          currentLevel: levelNum,
          items: levelItems,
          levelItemsEaten: 0,
          levelItemsTotal: def.totalItems,
          levelComplete: false,
          levelFailed: false,
          reviveOffered: false,
          reviveUsedThisAttempt: false,
          levelStars: 0,
          levelStartTime: Date.now(),
          levelRewards: null,
          blobPosition: { x: 200, y: 300 },
          blobVelocity: { x: 0, y: 0 },
          steerInput: { active: false, dirX: 0, dirY: 0, magnitude: 0 },
          comboCount: 0,
          comboTimer: 0,
          swipeStreak: 0,
          lastSwipeTime: 0,
          frenzyDashActive: false,
          frenzyDashTimer: 0,
          perfectSwipePending: 0,
          _swipeItemCount: 0,
          _perfectSwipeFired: false,
          starSpawnTimer: 8,
          levelUpTime: 0,
          highestLevelReached: Math.max(state.highestLevelReached, levelNum),
          abilities: { ...DEFAULT_ABILITIES },
          _levelInitialized: true,
          _shieldCooldown: 0,
          _minHungerPct: 1,
          _introPlaying: true,
          _oversizedVomitCount: 0,
        };
      }),

      completeLevel: () => set((state) => {
        if (!state.levelComplete) return state;

        const def = getLevel(state.currentLevel);
        const elapsedSecs = (Date.now() - state.levelStartTime) / 1000;

        const minHp = state._minHungerPct;
        let stars = 1;
        if (elapsedSecs <= def.starThresholds[1] && minHp >= 0.10) stars = 2;
        if (elapsedSecs <= def.starThresholds[0] && minHp >= 0.40) stars = 3;

        const rewards = def.rewards;
        const starBonus = stars === 3 ? 1.5 : stars === 2 ? 1.2 : 1;
        const finalMoney = Math.floor(rewards.money * starBonus);

        const world = getWorldForLevel(state.currentLevel);
        const isWorldBoss = Number.isFinite(world.levelRange[1]) && world.levelRange[1] === state.currentLevel;
        const worldsInc = isWorldBoss ? 1 : 0;

        const lvl = state.currentLevel;
        const prevBestTime = state.bestTimes[lvl];
        const prevBestStars = state.bestStars[lvl] || 0;
        const beatTime = prevBestTime === undefined || elapsedSecs < prevBestTime;
        const beatStars = stars > prevBestStars;
        const newRecordFlag: GameState['newRecordFlag'] =
          beatTime && beatStars ? 'both' :
          beatTime ? 'time' :
          beatStars ? 'stars' :
          null;

        const nextBestTimes = beatTime
          ? { ...state.bestTimes, [lvl]: elapsedSecs }
          : state.bestTimes;
        const nextBestStars = beatStars
          ? { ...state.bestStars, [lvl]: stars }
          : state.bestStars;

        return {
          levelStars: stars,
          levelRewards: { ...rewards, money: finalMoney },
          money: state.money + finalMoney,
          essence: state.essence + (rewards.essence || 0),
          gems: state.gems + (rewards.gems || 0),
          currentRunMoney: state.currentRunMoney + finalMoney,
          interstitialLevelsSinceAd: state.interstitialLevelsSinceAd + 1,
          bestTimes: nextBestTimes,
          bestStars: nextBestStars,
          newRecordFlag,
          stats: {
            ...state.stats,
            totalLevelsCompleted: state.stats.totalLevelsCompleted + 1,
            totalStarsEarned: state.stats.totalStarsEarned + stars,
            totalMoneyEarned: state.stats.totalMoneyEarned + finalMoney,
            highestLevel: Math.max(state.stats.highestLevel, state.currentLevel),
            worldsCompleted: state.stats.worldsCompleted + worldsInc,
          },
        };
      }),

      clearNewRecordFlag: () => set({ newRecordFlag: null }),

      endIntro: () => set({ _introPlaying: false, levelStartTime: Date.now(), _minHungerPct: 1 }),

      advanceToNextLevel: () => {
        const state = get();
        get().initLevel(state.currentLevel + 1);
        const curHunger = get().hunger;
        const minAdvanceHunger = BASE_MAX_HUNGER * 0.5;
        if (curHunger < minAdvanceHunger) {
          set({ hunger: minAdvanceHunger });
        }
      },

      retryLevel: () => {
        const state = get();
        get().initLevel(state.currentLevel);
        set({ hunger: BASE_MAX_HUNGER * 0.6 });
      },

      reviveBlob: () => set({
        reviveOffered: false,
        reviveUsedThisAttempt: true,
        hunger: BASE_MAX_HUNGER * 0.4,
        _shieldCooldown: 0,
      }),

      declineRevive: () => set({
        reviveOffered: false,
        levelFailed: true,
      }),

      buyUpgrade: (type, cost) => set((state) => {
        if (state.money < cost) return state;

        const currentLevel = state.upgrades[type] || 0;
        if (!String(type).endsWith('Synergy') && currentLevel >= UPGRADE_SOFT_CAP) return state;

        const getSynergyFor = (t: string) => {
          if (t === 'speed' || t === 'boostSpawnRate') return 'speedSynergy';
          if (t === 'suction' || t === 'suctionStrength') return 'suctionSynergy';
          if (t === 'hungerDrain' || t === 'hungerMax') return 'hungerSynergy';
          if (t === 'spawnRate' || t === 'spawnValue') return 'spawnSynergy';
          return null;
        };

        const synType = getSynergyFor(String(type));
        if (synType) {
          const currentBlock = Math.floor(currentLevel / 6);
          const synLevel = state.upgrades[synType] || 0;
          if (currentBlock > synLevel) return state;
        }

        if (String(type).endsWith('Synergy')) {
          const reqLevel = (currentLevel + 1) * 6;
          let branchA = '', branchB = '';
          if (type === 'speedSynergy') { branchA = 'speed'; branchB = 'boostSpawnRate'; }
          if (type === 'suctionSynergy') { branchA = 'suction'; branchB = 'suctionStrength'; }
          if (type === 'hungerSynergy') { branchA = 'hungerDrain'; branchB = 'hungerMax'; }
          if (type === 'spawnSynergy') { branchA = 'spawnRate'; branchB = 'spawnValue'; }
          if ((state.upgrades[branchA] || 0) < reqLevel || (state.upgrades[branchB] || 0) < reqLevel) {
            return state;
          }
        }

        const isSynergy = String(type).endsWith('Synergy');
        return {
          money: state.money - cost,
          upgrades: { ...state.upgrades, [type]: currentLevel + 1 },
          stats: {
            ...state.stats,
            totalUpgradesBought: state.stats.totalUpgradesBought + 1,
            totalSynergiesBought: state.stats.totalSynergiesBought + (isSynergy ? 1 : 0),
          },
        };
      }),

      unlockSkillNode: (nodeId) => set((state) => {
        const node = SKILL_NODE_LOOKUP[nodeId];
        if (!node) return state;
        if (state.unlockedSkillNodes.includes(nodeId)) return state;
        if (state.money < node.cost) return state;
        if (!canUnlockNode(node, state.unlockedSkillNodes)) return state;

        const nextUnlocked = [...state.unlockedSkillNodes, nodeId];
        const nextFlash = [`node:${nodeId}`, ...state.skillFlashEvents].slice(0, 8);
        const nextTelemetry: SkillTelemetry = {
          ...state.skillTelemetry,
          nodePickCount: {
            ...state.skillTelemetry.nodePickCount,
            [nodeId]: (state.skillTelemetry.nodePickCount[nodeId] || 0) + 1,
          },
        };
        if (node.type === 'keystone' && !nextTelemetry.firstKeystoneAt) {
          nextTelemetry.firstKeystoneAt = Date.now() - state.skillTelemetry.runStartTimestamp;
        }

        const bonusMoney = checkGateUnlocks(
          nextUnlocked, nextFlash, nextTelemetry,
          state.moneyPerSecond, state.skillTelemetry.runStartTimestamp,
        );

        const nextUpgrades = { ...state.upgrades };
        switch (nodeId) {
          case 'hunt_pathing': nextUpgrades.speed = (nextUpgrades.speed || 0) + 1; break;
          case 'hunt_dash_on_star': nextUpgrades.boostSpawnRate = (nextUpgrades.boostSpawnRate || 0) + 1; break;
          case 'hunt_suction_cone': nextUpgrades.suction = (nextUpgrades.suction || 0) + 1; break;
          case 'hunt_target_lock': nextUpgrades.suctionStrength = (nextUpgrades.suctionStrength || 0) + 1; break;
          case 'hunt_tracker_elite': nextUpgrades.speed = (nextUpgrades.speed || 0) + 1; break;
          case 'hunt_apex': nextUpgrades.suctionStrength = (nextUpgrades.suctionStrength || 0) + 1; break;
          case 'feast_combo_timer': nextUpgrades.spawnValue = (nextUpgrades.spawnValue || 0) + 1; break;
          case 'feast_overkill': nextUpgrades.spawnSynergy = (nextUpgrades.spawnSynergy || 0) + 1; break;
          case 'feast_epicurean': nextUpgrades.spawnValue = (nextUpgrades.spawnValue || 0) + 1; break;
          case 'feast_apex': nextUpgrades.spawnSynergy = (nextUpgrades.spawnSynergy || 0) + 1; break;
          case 'survival_digestive': nextUpgrades.hungerDrain = (nextUpgrades.hungerDrain || 0) + 1; break;
          case 'survival_shield': nextUpgrades.hungerSynergy = (nextUpgrades.hungerSynergy || 0) + 1; break;
          case 'survival_keystone': nextUpgrades.hungerMax = (nextUpgrades.hungerMax || 0) + 1; break;
          case 'survival_adaptation': nextUpgrades.hungerDrain = (nextUpgrades.hungerDrain || 0) + 1; break;
          case 'survival_apex': nextUpgrades.hungerMax = (nextUpgrades.hungerMax || 0) + 1; break;
          case 'auto_tap_drone': nextUpgrades.spawnSynergy = (nextUpgrades.spawnSynergy || 0) + 1; break;
          case 'auto_tap_optimizer': nextUpgrades.boostSpawnRate = (nextUpgrades.boostSpawnRate || 0) + 1; break;
          case 'auto_offline_core': nextUpgrades.spawnRate = (nextUpgrades.spawnRate || 0) + 1; break;
          case 'auto_keystone': nextUpgrades.spawnRate = (nextUpgrades.spawnRate || 0) + 1; break;
          case 'auto_neural_net': nextUpgrades.spawnValue = (nextUpgrades.spawnValue || 0) + 1; break;
          case 'auto_apex': nextUpgrades.spawnRate = (nextUpgrades.spawnRate || 0) + 1; break;
          default: break;
        }

        return {
          money: state.money - node.cost + bonusMoney,
          unlockedSkillNodes: nextUnlocked,
          skillFlashEvents: nextFlash,
          skillTelemetry: nextTelemetry,
          upgrades: nextUpgrades,
          stats: {
            ...state.stats,
            totalUpgradesBought: state.stats.totalUpgradesBought + 1,
          },
        };
      }),

      dismissSkillFlashEvent: (id) => set((state) => ({
        skillFlashEvents: state.skillFlashEvents.filter((event) => event !== id),
      })),

      buySuggestedAndRetry: (nodeId) => {
        get().unlockSkillNode(nodeId);
        get().retryLevel();
      },

      buySuggestedUpgrade: (nodeId) => {
        get().unlockSkillNode(nodeId);
      },

      activateBoost: () => set({ boostActive: true, boostTimer: 10 }),
      activateStarBoost: () => set({ starBoostActive: true, starBoostTimer: 5 }),

      activateAbility: (id) => set((state) => {
        const def = ACTIVE_ABILITIES.find((a) => a.id === id);
        if (!def) return state;
        const ab = state.abilities[id];
        if (ab.cooldown > 0 || ab.active) return state;
        if (state.levelComplete || state.levelFailed) return state;
        if (state.highestLevelReached < def.unlockLevel) return state;
        if (state.abilityCharges[id] <= 0) return state;

        const newCharges = {
          ...state.abilityCharges,
          [id]: state.abilityCharges[id] - 1,
        };

        if (id === 'food') {
          const skillFx = getSkillEffects(state.unlockedSkillNodes);
          const hungerSyn = 1 + (state.upgrades.hungerSynergy || 0) * 0.5;
          const maxHunger = (BASE_MAX_HUNGER + softCap(state.upgrades.hungerMax || 0) * 20 + skillFx.hungerMaxFlat) * hungerSyn;
          const hungerRestore = maxHunger * 0.2;
          const bx = state.blobPosition.x;
          const by = state.blobPosition.y;
          const newItems = [...state.items];
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const dist = 80 + Math.random() * 40;
            const foodValue = 1.5 * Math.sqrt(state.currentLevel) * 2;
            newItems.push({
              id: Math.random().toString(36).substr(2, 9),
              x: bx + Math.cos(angle) * dist,
              y: by + Math.sin(angle) * dist,
              vx: 0, vy: 0,
              rotation: 0, rotationSpeed: (Math.random() - 0.5) * 2,
              type: 'square', value: foodValue, weight: 0.5, isTapFood: true,
            });
          }
          return {
            items: newItems,
            hunger: Math.min(state.hunger + hungerRestore, maxHunger),
            abilityCharges: newCharges,
            abilities: {
              ...state.abilities,
              food: { cooldown: def.cooldown, active: false, timer: 0 },
            },
          };
        }

        return {
          abilityCharges: newCharges,
          abilities: {
            ...state.abilities,
            [id]: { cooldown: def.cooldown, active: true, timer: def.duration },
          },
        };
      }),

      rechargeAbility: async (id) => {
        const state = get();
        if (!canShowAdForAbility(id, state.lastAdRechargeTime)) return false;
        if (state.abilityCharges[id] >= ABILITY_CHARGES[id].maxCharges) return false;

        const success = await showRewardedAd();
        if (!success) return false;

        set((s) => ({
          abilityCharges: {
            ...s.abilityCharges,
            [id]: Math.min(
              s.abilityCharges[id] + ABILITY_CHARGES[id].adRefillAmount,
              ABILITY_CHARGES[id].maxCharges,
            ),
          },
          lastAdRechargeTime: { ...s.lastAdRechargeTime, [id]: Date.now() },
          lastRewardedAdTime: Date.now(),
        }));
        return true;
      },

      rechargeAllAbilities: async () => {
        const success = await showRewardedAd();
        if (!success) return false;

        set(() => ({
          abilityCharges: { ...DEFAULT_ABILITY_CHARGES },
          lastAdRechargeTime: {
            magnet: Date.now(), speed: Date.now(),
            size: Date.now(), food: Date.now(),
          },
          lastRewardedAdTime: Date.now(),
        }));
        return true;
      },

      checkDailyChargeRefill: () => {
        const today = new Date().toISOString().split('T')[0];
        const state = get();
        if (state.lastDailyChargeRefill === today) return false;

        set({
          abilityCharges: { ...DEFAULT_ABILITY_CHARGES },
          lastDailyChargeRefill: today,
        });
        return true;
      },

      prestige: () => set((state) => {
        const spicyMult = state.spicyMealActive ? 2 : 1;
        const essenceGained = Math.max(1, Math.floor(Math.sqrt(state.currentRunMoney / 500))) * spicyMult;
        const newTotalPrestiges = state.stats.totalPrestiges + 1;
        const startMoney = 5 * Math.pow(2, state.evolutionUpgrades.startingMoney);
        const startLevel = 1 + state.evolutionUpgrades.startingLevel;

        return {
          money: startMoney,
          currentLevel: startLevel,
          hunger: BASE_MAX_HUNGER,
          levelItemsEaten: 0,
          levelItemsTotal: 0,
          levelComplete: false,
          levelFailed: false,
          reviveOffered: false,
          reviveUsedThisAttempt: false,
          levelStars: 0,
          levelStartTime: Date.now(),
          levelRewards: null,
          blobPosition: { x: 200, y: 300 },
          blobVelocity: { x: 0, y: 0 },
          steerInput: { active: false, dirX: 0, dirY: 0, magnitude: 0 },
          items: [],
          upgrades: { ...DEFAULT_UPGRADES },
          starSpawnTimer: 10,
          boostActive: false,
          boostTimer: 0,
          starBoostActive: false,
          starBoostTimer: 0,
          levelUpTime: 0,
          essence: state.essence + essenceGained,
          currentRunMoney: 0,
          spicyMealActive: false,
          comboCount: 0,
          comboTimer: 0,
          swipeStreak: 0,
          lastSwipeTime: 0,
          frenzyDashActive: false,
          frenzyDashTimer: 0,
          perfectSwipePending: 0,
          _swipeItemCount: 0,
          _perfectSwipeFired: false,
          abilities: { ...DEFAULT_ABILITIES },
          abilityCharges: { ...DEFAULT_ABILITY_CHARGES },
          _moneyBuffer: 0,
          _moneyBufferTime: 0,
          moneyPerSecond: 0,
          unlockedSkillNodes: [],
          skillFlashEvents: [],
          skillTelemetry: {
            ...DEFAULT_SKILL_TELEMETRY,
            runStartTimestamp: Date.now(),
            lastAbandonPoint: state.unlockedSkillNodes[state.unlockedSkillNodes.length - 1] || '',
          },
          stats: {
            ...state.stats,
            totalPrestiges: newTotalPrestiges,
            highestLevel: Math.max(state.stats.highestLevel, state.currentLevel),
          },
          _levelInitialized: false,
          _shieldCooldown: 0,
          _minHungerPct: 1,
        };
      }),

      buyEvolutionUpgrade: (id) => set((state) => {
        const def = EVOLUTION_UPGRADES[id];
        if (!def) return state;
        const currentLevel = state.evolutionUpgrades[id] || 0;
        if (currentLevel >= def.maxLevel) return state;
        const cost = def.cost(currentLevel);
        if (state.essence < cost) return state;
        return {
          essence: state.essence - cost,
          evolutionUpgrades: { ...state.evolutionUpgrades, [id]: currentLevel + 1 },
        };
      }),

      // Analog-stick steering. Called on every pointerdown / pointermove /
      // pointerup from GameCanvas. While active, the tick loop uses dirX/dirY
      // and magnitude to drive blobVelocity directly (see "Movement" block in
      // tick). Magnitude is clamped to [0,1].
      //
      // Each pointerdown opens a new "input session": we refresh the perfect
      // window and reset the per-session item counter so the player can earn
      // a fresh PERFECT bonus per touch.
      setSteerInput: (active, dirX, dirY, magnitude) => set((state) => {
        if (!active) {
          // Releasing the finger — clear input. The tick will then transition
          // velocity via friction. We deliberately leave perfectSwipePending /
          // streak alone so any in-flight bonuses still resolve naturally.
          if (!state.steerInput.active) return state;
          return {
            steerInput: { active: false, dirX: 0, dirY: 0, magnitude: 0 },
          };
        }

        if (state.levelComplete || state.levelFailed || state.reviveOffered) return state;
        if (state._introPlaying) return state;
        if (state._openPanelCount > 0) return state;

        const len = Math.hypot(dirX, dirY) || 1;
        const nx = dirX / len;
        const ny = dirY / len;
        const mag = Math.max(0, Math.min(1, magnitude));
        const wasActive = state.steerInput.active;
        const now = performance.now() / 1000;

        if (!wasActive) {
          return {
            steerInput: { active: true, dirX: nx, dirY: ny, magnitude: mag },
            lastSwipeTime: now,
            perfectSwipePending: STEER_PERFECT_WINDOW,
            _swipeItemCount: 0,
            _perfectSwipeFired: false,
            stats: { ...state.stats, totalTaps: state.stats.totalTaps + 1 },
          };
        }

        // Continuing session — keep the streak window alive so streak doesn't
        // decay while the player is actively driving the blob.
        return {
          steerInput: { active: true, dirX: nx, dirY: ny, magnitude: mag },
          lastSwipeTime: now,
        };
      }),

      claimDailyReward: () => set((state) => {
        const today = new Date().toISOString().split('T')[0];
        if (state.dailyReward.lastClaimDate === today) return state;

        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const isConsecutive = state.dailyReward.lastClaimDate === yesterday;
        const newStreak = isConsecutive ? state.dailyReward.streak + 1 : 1;
        const newCycleDay = (state.dailyReward.cycleDay + 1) % 7;

        const reward = DAILY_REWARDS[state.dailyReward.cycleDay];
        const streakMult = STREAK_MULTIPLIERS[Math.min(newStreak - 1, STREAK_MULTIPLIERS.length - 1)];
        const amount = Math.floor(reward.amount * streakMult);

        const updates: Partial<GameState> = {
          dailyReward: { lastClaimDate: today, streak: newStreak, cycleDay: newCycleDay },
        };

        if (reward.type === 'money') updates.money = state.money + amount;
        if (reward.type === 'gems') updates.gems = state.gems + amount;

        return updates as any;
      }),

      buyPermanentBoost: (id) => set((state) => {
        const boost = PERMANENT_BOOSTS.find(b => b.id === id);
        if (!boost) return state;
        if (state.purchasedPermanentBoosts.includes(id)) return state;
        if (state.gems < boost.cost) return state;
        return {
          gems: state.gems - boost.cost,
          purchasedPermanentBoosts: [...state.purchasedPermanentBoosts, id],
        };
      }),

      buyConsumable: (id) => set((state) => {
        const item = CONSUMABLES.find(c => c.id === id);
        if (!item) return state;
        if (state.gems < item.cost) return state;
        return {
          gems: state.gems - item.cost,
          consumableInventory: {
            ...state.consumableInventory,
            [id]: (state.consumableInventory[id] || 0) + 1,
          },
        };
      }),

      useConsumable: (id) => set((state) => {
        const count = state.consumableInventory[id] || 0;
        if (count <= 0) return state;

        const updates: any = {
          consumableInventory: {
            ...state.consumableInventory,
            [id]: count - 1,
          },
        };

        if (id === 'power_nap') {
          // Big Gulp: jump 25% of remaining level items eaten instantly.
          const remaining = Math.max(0, state.levelItemsTotal - state.levelItemsEaten);
          const bonus = Math.ceil(remaining * 0.25);
          updates.levelItemsEaten = state.levelItemsEaten + bonus;
          updates.stats = {
            ...state.stats,
            totalFoodEaten: state.stats.totalFoodEaten + bonus,
          };
        } else if (id === 'gulp_and_go') {
          updates.levelComplete = true;
          updates.levelItemsEaten = state.levelItemsTotal;
          updates.levelUpTime = Date.now();
        } else if (id === 'spicy_meal') {
          updates.spicyMealActive = true;
        } else if (id === 'feeding_frenzy') {
          const timedBoost = getTimedBoostForConsumable('feeding_frenzy');
          if (timedBoost) {
            updates.activeTimedBoosts = [
              ...state.activeTimedBoosts.filter(b => b.id !== timedBoost.id),
              { id: timedBoost.id, expiresAt: Date.now() + timedBoost.durationMs },
            ];
          }
        } else if (id === 'big_burp') {
          updates.abilityCharges = {
            magnet: ABILITY_CHARGES.magnet.maxCharges,
            speed: ABILITY_CHARGES.speed.maxCharges,
            size: ABILITY_CHARGES.size.maxCharges,
            food: ABILITY_CHARGES.food.maxCharges,
          };
        }

        return updates;
      }),

      buyGemBundle: (id) => set((state) => {
        const bundle = GEM_BUNDLES.find(b => b.id === id);
        if (!bundle) return state;
        if (state.gems < bundle.cost) return state;

        const updates: any = {
          gems: state.gems - bundle.cost + (bundle.rewards.gems || 0),
          money: state.money + (bundle.rewards.money || 0),
        };

        if (bundle.rewards.consumables) {
          const newInv = { ...state.consumableInventory };
          for (const [cid, qty] of Object.entries(bundle.rewards.consumables)) {
            newInv[cid] = (newInv[cid] || 0) + qty;
          }
          updates.consumableInventory = newInv;
        }

        return updates;
      }),

      buyIAPProduct: async (productId) => {
        const success = await purchaseProduct(productId);
        if (!success) return false;

        const state = get();

        const featuredPack = [...FEATURED_PACKS, ...MILESTONE_PACKS].find(p => p.id === productId);
        if (featuredPack && featuredPack.oneTime && state.purchasedPacks.includes(productId)) return false;

        const gemPack = GEM_PACKS.find(p => p.id === productId);
        const iapBoost = IAP_BOOSTS.find(b => b.id === productId);
        const iapBundle = IAP_BUNDLES.find(b => b.id === productId);

        set((s) => {
          const updates: any = {};

          if (featuredPack) {
            updates.purchasedPacks = [...s.purchasedPacks, productId];
            if (featuredPack.rewards.gems) updates.gems = (s.gems || 0) + featuredPack.rewards.gems;
            if (featuredPack.rewards.money) updates.money = (s.money || 0) + featuredPack.rewards.money;
            if (featuredPack.rewards.essence) updates.essence = (s.essence || 0) + featuredPack.rewards.essence;
            if (featuredPack.rewards.noInterstitialAds) updates.noInterstitialAds = true;
            if (featuredPack.rewards.skinId) {
              updates.unlockedSpecialSkins = [...s.unlockedSpecialSkins, featuredPack.rewards.skinId];
            }
          } else if (gemPack) {
            updates.gems = (s.gems || 0) + gemPack.gems + gemPack.bonus;
          } else if (iapBoost) {
            if (!s.purchasedPermanentBoosts.includes(productId)) {
              updates.purchasedPermanentBoosts = [...s.purchasedPermanentBoosts, productId];
            }
          } else if (iapBundle) {
            if (iapBundle.oneTime) {
              updates.purchasedPacks = [...s.purchasedPacks, productId];
            }
            if (iapBundle.rewards.gems) updates.gems = (s.gems || 0) + iapBundle.rewards.gems;
            if (iapBundle.rewards.money) updates.money = (s.money || 0) + iapBundle.rewards.money;
            if (iapBundle.rewards.skinId) {
              updates.unlockedSpecialSkins = [...s.unlockedSpecialSkins, iapBundle.rewards.skinId];
            }
            if (iapBundle.rewards.consumables) {
              const newInv = { ...s.consumableInventory };
              for (const [cid, qty] of Object.entries(iapBundle.rewards.consumables)) {
                newInv[cid] = (newInv[cid] || 0) + qty;
              }
              updates.consumableInventory = newInv;
            }
          }

          return updates;
        });

        return true;
      },

      claimFreeGift: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        const isNewDay = state.lastFreeGiftDate !== today;
        const claimsToday = isNewDay ? 0 : state.freeGiftClaimsToday;

        if (claimsToday >= FREE_GIFT_MAX_DAILY) return null;
        if (!isNewDay && Date.now() - state.freeGiftLastClaim < FREE_GIFT_COOLDOWN_MS) return null;

        const reward = FREE_GIFT_POOL[Math.floor(Math.random() * FREE_GIFT_POOL.length)];

        set((s) => {
          const updates: any = {
            freeGiftLastClaim: Date.now(),
            freeGiftClaimsToday: claimsToday + 1,
            lastFreeGiftDate: today,
          };

          if (reward.type === 'money') updates.money = s.money + reward.amount;
          else if (reward.type === 'gems') updates.gems = s.gems + reward.amount;
          else if (reward.type === 'consumable' && reward.consumableId) {
            updates.consumableInventory = {
              ...s.consumableInventory,
              [reward.consumableId]: (s.consumableInventory[reward.consumableId] || 0) + reward.amount,
            };
          }

          return updates;
        });

        return reward;
      },

      buyDailyDeal: () => set((state) => {
        const today = new Date().toISOString().split('T')[0];
        if (state.dailyDealPurchased && state.dailyDealDate === today) return state;

        const deal = getDailyDealForDate(today);
        if (state.gems < deal.dealCost) return state;

        const updates: any = {
          gems: state.gems - deal.dealCost,
          dailyDealPurchased: true,
          dailyDealDate: today,
        };

        if (deal.itemType === 'consumable') {
          updates.consumableInventory = {
            ...state.consumableInventory,
            [deal.itemId]: (state.consumableInventory[deal.itemId] || 0) + 1,
          };
        }

        return updates;
      }),

      buyBlobSkin: (id) => set((state) => {
        const skin = BLOB_SKINS.find(s => s.id === id);
        if (!skin || state.unlockedSkins.includes(id)) return state;
        if (state.gems < skin.cost) return state;
        return {
          gems: state.gems - skin.cost,
          unlockedSkins: [...state.unlockedSkins, id],
          currentSkin: id,
          currentSpecialSkin: '',
        };
      }),

      setSkin: (id) => set((state) => {
        if (!state.unlockedSkins.includes(id)) return state;
        return { currentSkin: id, currentSpecialSkin: '' };
      }),

      buySpecialSkin: (id) => set((state) => {
        const skin = SPECIAL_SKINS.find(s => s.id === id);
        if (!skin || state.unlockedSpecialSkins.includes(id)) return state;
        if (skin.currency === 'gems') {
          if (state.gems < skin.cost) return state;
          return { gems: state.gems - skin.cost, unlockedSpecialSkins: [...state.unlockedSpecialSkins, id], currentSpecialSkin: id, currentSkin: 'default' };
        }
        if (state.money < skin.cost) return state;
        return { money: state.money - skin.cost, unlockedSpecialSkins: [...state.unlockedSpecialSkins, id], currentSpecialSkin: id, currentSkin: 'default' };
      }),

      setSpecialSkin: (id) => set((state) => {
        if (id === '') return { currentSpecialSkin: '' };
        if (!state.unlockedSpecialSkins.includes(id)) return state;
        return { currentSpecialSkin: id, currentSkin: 'default' };
      }),

      buyBlobItem: (id) => set((state) => {
        const item = BLOB_ITEMS.find(i => i.id === id);
        if (!item || state.unlockedItems.includes(id)) return state;
        if (item.currency === 'gems') {
          if (state.gems < item.cost) return state;
          return { gems: state.gems - item.cost, unlockedItems: [...state.unlockedItems, id], currentItem: id };
        }
        if (state.money < item.cost) return state;
        return { money: state.money - item.cost, unlockedItems: [...state.unlockedItems, id], currentItem: id };
      }),

      setItem: (id) => set((state) => {
        if (id === '') return { currentItem: '' };
        if (!state.unlockedItems.includes(id)) return state;
        return { currentItem: id };
      }),

      buyBlobFace: (id) => set((state) => {
        const face = BLOB_FACES.find(f => f.id === id);
        if (!face || state.unlockedFaces.includes(id)) return state;
        if (face.currency === 'gems') {
          if (state.gems < face.cost) return state;
          return { gems: state.gems - face.cost, unlockedFaces: [...state.unlockedFaces, id], currentFace: id };
        }
        if (state.money < face.cost) return state;
        return { money: state.money - face.cost, unlockedFaces: [...state.unlockedFaces, id], currentFace: id };
      }),

      setFace: (id) => set((state) => {
        if (id === '') return { currentFace: '' };
        if (!state.unlockedFaces.includes(id)) return state;
        return { currentFace: id };
      }),

      dismissAchievement: (id) => set((state) => ({
        newAchievements: state.newAchievements.filter(a => a !== id),
      })),

      completeTutorial: () => set({ tutorialComplete: true, tutorialStep: 5 }),
      advanceTutorial: () => set((state) => {
        const next = state.tutorialStep + 1;
        if (next >= 5) return { tutorialStep: 5, tutorialComplete: true };
        return { tutorialStep: next };
      }),

      showHint: (id) => set((state) => {
        if (state.completedHints.includes(id) || state.activeHint) return state;
        return { activeHint: id };
      }),

      dismissHint: (id) => set((state) => ({
        activeHint: state.activeHint === id ? null : state.activeHint,
        completedHints: state.completedHints.includes(id)
          ? state.completedHints
          : [...state.completedHints, id],
      })),

      recordInterstitialShown: () => set((state) => ({
        interstitialLevelsSinceAd: 0,
        interstitialSessionAdCount: state.interstitialSessionAdCount + 1,
        interstitialLastTime: Date.now(),
      })),

      openSkillTree: () => set((s) => ({ skillTreeOpen: true, _openPanelCount: s._openPanelCount + 1 })),
      closeSkillTree: () => set((s) => ({ skillTreeOpen: false, _openPanelCount: Math.max(0, s._openPanelCount - 1) })),
      openCustomizer: () => set((s) => ({ customizerOpen: true, _openPanelCount: s._openPanelCount + 1 })),
      closeCustomizer: () => set((s) => ({ customizerOpen: false, _openPanelCount: Math.max(0, s._openPanelCount - 1) })),
      panelOpened: () => set((s) => ({ _openPanelCount: s._openPanelCount + 1 })),
      panelClosed: () => set((s) => ({ _openPanelCount: Math.max(0, s._openPanelCount - 1) })),

      debugAddResources: (addMoney, addGems, addEssence) => set((state) => ({
        money: state.money + addMoney,
        gems: state.gems + addGems,
        essence: state.essence + addEssence,
      })),

      debugFillHunger: () => set({ hunger: BASE_MAX_HUNGER }),

      debugUnlockAllCosmetics: () => set({
        unlockedSkins: BLOB_SKINS.map(s => s.id),
        unlockedSpecialSkins: SPECIAL_SKINS.map(s => s.id),
        unlockedItems: BLOB_ITEMS.map(i => i.id),
        unlockedFaces: BLOB_FACES.map(f => f.id),
      }),

      debugSetLevel: (level) => {
        get().initLevel(level);
      },

      debugStartBenchmark: () => set((state) => {
        const world = getWorldForLevel(state.currentLevel);
        const pool = getItemsForWorld(world.id);
        if (pool.length === 0) return {};
        const blobX = 200, blobY = 300;
        const benchItems: Item[] = [];
        const count = 300;
        const spread = 800 * world.blobScale;
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = 80 + Math.random() * spread;
          const pick = pool[Math.floor(Math.random() * pool.length)];
          benchItems.push({
            id: Math.random().toString(36).substr(2, 9),
            x: blobX + Math.cos(angle) * dist,
            y: blobY + Math.sin(angle) * dist,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 2,
            type: pick.id,
            value: pick.baseValue,
            weight: pick.weight,
          });
        }
        return {
          items: benchItems,
          levelItemsTotal: count,
          levelItemsEaten: 0,
          levelComplete: false,
          levelFailed: false,
          hunger: BASE_MAX_HUNGER,
          _benchmarkActive: true,
          _levelInitialized: true,
        };
      }),

      resetGame: () => set({
        money: 0, currentLevel: 1, hunger: BASE_MAX_HUNGER * 0.6,
        levelItemsEaten: 0, levelItemsTotal: 0, levelComplete: false,
        levelFailed: false, reviveOffered: false, reviveUsedThisAttempt: false,
        levelStars: 0, levelStartTime: Date.now(), levelRewards: null,
        highestLevelReached: 1, blobGrowth: 0,
        blobPosition: { x: 200, y: 300 }, blobVelocity: { x: 0, y: 0 },
        steerInput: { active: false, dirX: 0, dirY: 0, magnitude: 0 },
        items: [],
        upgrades: { ...DEFAULT_UPGRADES },
        starSpawnTimer: 10,
        boostActive: false, boostTimer: 0,
        starBoostActive: false, starBoostTimer: 0,
        levelUpTime: 0,
        essence: 0, currentRunMoney: 0,
        evolutionUpgrades: { ...DEFAULT_EVOLUTION },
        gems: 0, unlockedSkins: ['default'], currentSkin: 'default',
        achievements: [], newAchievements: [],
        stats: { ...DEFAULT_STATS },
        comboCount: 0, comboTimer: 0,
        swipeStreak: 0, lastSwipeTime: 0,
        frenzyDashActive: false, frenzyDashTimer: 0, perfectSwipePending: 0,
        _swipeItemCount: 0, _perfectSwipeFired: false,
        newRecordFlag: null, bestTimes: {}, bestStars: {},
        dailyReward: { ...DEFAULT_DAILY },
        unlockedSkillNodes: [],
        skillFlashEvents: [],
        skillTelemetry: { ...DEFAULT_SKILL_TELEMETRY, runStartTimestamp: Date.now() },
        tutorialStep: 0, tutorialComplete: false,
        sessionCount: 0, completedHints: [], activeHint: null,
        lastRunEatRatio: 0, lastRunSurvivalTime: 0,
        skillTreeOpen: false, customizerOpen: false, _openPanelCount: 0,
        abilities: { ...DEFAULT_ABILITIES },
        abilityCharges: { ...DEFAULT_ABILITY_CHARGES },
        lastAdRechargeTime: { ...DEFAULT_AD_RECHARGE_TIME },
        lastDailyChargeRefill: '',
        interstitialLevelsSinceAd: 0, interstitialSessionAdCount: 0,
        interstitialLastTime: 0, lastRewardedAdTime: 0,
        moneyPerSecond: 0,
        purchasedPacks: [], purchasedPermanentBoosts: [], noInterstitialAds: false,
        consumableInventory: {}, activeTimedBoosts: [],
        freeGiftLastClaim: 0, freeGiftClaimsToday: 0, lastFreeGiftDate: '',
        dailyDealDate: '', dailyDealPurchased: false,
        spicyMealActive: false,
        _moneyBuffer: 0, _moneyBufferTime: 0, _achievementTimer: 0,
        _levelInitialized: false, _shieldCooldown: 0, _minHungerPct: 1, _introPlaying: false,
        _benchmarkActive: false,
      }),

      tick: (delta, width, height) => set((state) => {
        if (!state._levelInitialized) {
          const def = getLevel(state.currentLevel);
          const levelItems = buildLevelItems(state.currentLevel, state.blobPosition.x, state.blobPosition.y);
          return {
            items: levelItems,
            levelItemsTotal: def.totalItems,
            levelFailed: false,
            reviveOffered: false,
            reviveUsedThisAttempt: false,
            levelStartTime: Date.now(),
            _levelInitialized: true,
            _minHungerPct: 1,
            _introPlaying: true,
          };
        }

        if (state._introPlaying) return {};

        if (!state.completedHints.includes('oversized_food') &&
            state.activeHint !== 'oversized_food') {
          const bx = state.blobPosition.x;
          const by = state.blobPosition.y;
          const world = getWorldForLevel(state.currentLevel);
          const viewRadius = 160 * world.blobScale / 2.5;
          const nearbyOversized = state.items.some(i =>
            i.isOversized && Math.hypot(i.x - bx, i.y - by) < viewRadius
          );
          if (nearbyOversized) {
            return { activeHint: 'oversized_food', levelStartTime: Date.now() };
          }
        }

        if (state.activeHint) {
          return { levelStartTime: Date.now() };
        }

        if (state._openPanelCount > 0) {
          return { levelStartTime: Date.now() };
        }

        if (state.levelComplete || state.levelFailed || state.reviveOffered) return {};

        const evo = state.evolutionUpgrades;
        const world = getWorldForLevel(state.currentLevel);
        const achBonuses = getAchievementBonuses(state.achievements);
        const hasDoubleMoney = state.purchasedPermanentBoosts.includes('double_digest');
        const skillFx = getSkillEffects(state.unlockedSkillNodes);

        const newTimedBoosts = state.activeTimedBoosts.filter(b => b.expiresAt > Date.now());
        const feedingFrenzyActive = newTimedBoosts.some(b => b.id === 'feeding_frenzy_active');
        const storeFrenzyMult = feedingFrenzyActive ? 3 : 1;
        const goldenGutMult = state.purchasedPermanentBoosts.includes('golden_gut') ? 1.3 : 1;

        const blobScale = world.blobScale;

        // --- Hunger ---
        const hungerSyn = 1 + (state.upgrades.hungerSynergy || 0) * 0.5;
        const maxHunger = (BASE_MAX_HUNGER + softCap(state.upgrades.hungerMax || 0) * 20 + skillFx.hungerMaxFlat) * hungerSyn;
        const levelFactor = 1 + Math.pow(Math.max(0, state.currentLevel - 3), 1.4) * 0.065;
        const rawDrain = BASE_HUNGER_DRAIN * levelFactor;
        const evoHungerResist = Math.pow(0.95, evo.hungerResist);
        const baseDrain = Math.max(0.5, rawDrain * Math.pow(0.95, softCap(state.upgrades.hungerDrain || 0)) * evoHungerResist) / hungerSyn;
        const minDrain = baseDrain * 0.7;
        const effectiveDrain = Math.max(minDrain, baseDrain * (state.hunger / maxHunger)) * (1 + skillFx.hungerDrainMult);
        const hungerFloor = state.currentLevel <= 5 ? 1 : 0;

        let newShieldCooldown = state._shieldCooldown;
        let newHunger: number;

        if (newShieldCooldown > 0 && newShieldCooldown <= skillFx.frenzyShieldSeconds) {
          newHunger = state.hunger;
          newShieldCooldown -= delta;
          if (newShieldCooldown <= 0) {
            newShieldCooldown = -10;
          }
        } else {
          newHunger = Math.max(hungerFloor, state.hunger - effectiveDrain * delta);
          if (newShieldCooldown < 0) {
            newShieldCooldown = Math.min(0, newShieldCooldown + delta);
          }
          if (skillFx.frenzyShieldSeconds > 0 && newShieldCooldown === 0
              && (newHunger / maxHunger) < 0.08) {
            newShieldCooldown = skillFx.frenzyShieldSeconds;
          }
        }

        if (newHunger <= 0) {
          const deathContext = {
            lastRunEatRatio: state.levelItemsTotal > 0 ? state.levelItemsEaten / state.levelItemsTotal : 0,
            lastRunSurvivalTime: (Date.now() - state.levelStartTime) / 1000,
          };
          if (!state.reviveUsedThisAttempt) {
            return { hunger: 0, reviveOffered: true, _shieldCooldown: 0, _minHungerPct: 0, ...deathContext };
          }
          return { hunger: 0, levelFailed: true, _shieldCooldown: 0, _minHungerPct: 0, ...deathContext };
        }

        const hungerPctNow = newHunger / maxHunger;
        const newMinHungerPct = Math.min(state._minHungerPct, hungerPctNow);

        // --- Speed ---
        const speedSyn = 1 + (state.upgrades.speedSynergy || 0) * 0.5;
        const evoSpeedMult = 1 + evo.globalSpeed * 0.1;
        const adBoostMultiplier = state.boostActive ? 3 : 1;
        const starSpeedMultiplier = state.starBoostActive ? 1.5 : 1;
        const frenzyActive = (newHunger / Math.max(1, maxHunger)) <= skillFx.lowHungerThreshold;
        const frenzySpeedMult = frenzyActive ? 1 + skillFx.lowHungerFrenzyMult : 1;
        const abilitySpeedMult = state.abilities.speed.active ? 4 : 1;
        const comboSpeedMult = skillFx.speedPerCombo > 0 ? 1 + skillFx.speedPerCombo * state.comboCount : 1;
        const turboTummyMult = state.purchasedPermanentBoosts.includes('turbo_tummy') ? 1.25 : 1;
        const speed = (BASE_SPEED + softCap(state.upgrades.speed || 0) * 25)
          * adBoostMultiplier * starSpeedMultiplier * speedSyn
          * evoSpeedMult * achBonuses.speedMult
          * (1 + skillFx.speedMult) * frenzySpeedMult * abilitySpeedMult * comboSpeedMult * turboTummyMult
          + skillFx.speedFlat;

        // --- Suction ---
        const suctionSyn = 1 + (state.upgrades.suctionSynergy || 0) * 0.5;
        const evoSuctionMult = 1 + evo.globalSuction * 0.1;
        const abilitySuctionMult = state.abilities.size.active ? 2 : 1;
        const stickyTongueMult = state.purchasedPermanentBoosts.includes('sticky_tongue') ? 1.5 : 1;
        const suctionBase = (BASE_SUCTION + softCap(state.upgrades.suction || 0) * 15)
          * suctionSyn * Math.sqrt(blobScale) * evoSuctionMult
          * (1 + skillFx.suctionMult) * abilitySuctionMult * stickyTongueMult + skillFx.suctionFlat;
        // dashEatRadiusBonus and frenzyDashSuctionMult are computed below in the movement block

        const suctionStrength = (1 + softCap(state.upgrades.suctionStrength || 0) * 0.18) * suctionSyn;

        // --- Movement (analog-stick: direct velocity while held + friction on release) ---
        // Model:
        //   • While `steerInput.active`, the blob's target velocity is
        //     direction × max-speed × magnitude. We lerp current velocity
        //     toward that target so direction changes feel snappy but not
        //     jarring (no instant teleporting between vectors).
        //   • When inactive, friction decays the velocity exponentially —
        //     this is the "coast" feel after the player lets go.
        let { x, y } = state.blobPosition;
        let { x: vx, y: vy } = state.blobVelocity;

        const evoGlideMult = Math.max(0.2, 1 - (evo.glideMastery || 0) * 0.05);
        const baseFriction = SWIPE_FRICTION * Math.max(0, 1 - skillFx.frictionReduction) * evoGlideMult;
        const swipeMastery = 1 + (evo.swipeMastery || 0) * 0.08;
        const swipeImpulse = 1 + skillFx.swipeImpulseMult;
        const steerFrenzyMult = state.frenzyDashActive ? 1.4 : 1;
        const steerMaxSpeed = speed * STEER_SPEED_MULT * swipeMastery * swipeImpulse * steerFrenzyMult;

        if (state.steerInput.active && state.steerInput.magnitude > 0) {
          const targetVx = state.steerInput.dirX * steerMaxSpeed * state.steerInput.magnitude;
          const targetVy = state.steerInput.dirY * steerMaxSpeed * state.steerInput.magnitude;
          // Frame-rate-independent lerp: same convergence speed at any FPS.
          // STEER_ACCEL_LERP is calibrated for 60 FPS; scale by delta×60.
          const t = Math.min(1, STEER_ACCEL_LERP * delta * 60);
          vx += (targetVx - vx) * t;
          vy += (targetVy - vy) * t;
        } else {
          const decay = Math.exp(-baseFriction * delta);
          vx *= decay;
          vy *= decay;
          const restMag = Math.hypot(vx, vy);
          if (restMag < SWIPE_MIN_VEL) {
            vx = 0;
            vy = 0;
          }
        }

        x += vx * delta;
        y += vy * delta;

        const speedMag = Math.hypot(vx, vy);
        const newBlobVelocity = { x: vx, y: vy };
        const targetNow = performance.now() / 1000;

        // --- Frenzy Dash timer + bonuses ---
        let newFrenzyDashActive = state.frenzyDashActive;
        let newFrenzyDashTimer = state.frenzyDashTimer;
        if (newFrenzyDashActive) {
          newFrenzyDashTimer = Math.max(0, newFrenzyDashTimer - delta);
          if (newFrenzyDashTimer <= 0) newFrenzyDashActive = false;
        }
        const frenzyDashSuctionMult = newFrenzyDashActive ? 2 : 1;
        const dashSpeed = speedMag;
        const isDashing = dashSpeed > RAM_VEL_THRESHOLD;
        const evoDashRadius = (evo.dashRadius || 0) * 4;
        const dashEatRadiusBonus = isDashing ? (skillFx.dashEatRadius + evoDashRadius) : 0;
        const magnetWhileDashingMult = (isDashing && skillFx.magnetWhileDashing > 0) ? skillFx.magnetWhileDashing : 1;
        const suction = suctionBase * frenzyDashSuctionMult + dashEatRadiusBonus;

        // --- Collisions ---
        const remainingItems: Item[] = [];
        let moneyGained = 0;
        let hungerFoodGained = 0;
        let itemsEaten = 0;
        let starsEaten = 0;

        let newStarBoostActive = state.starBoostActive;
        let newStarBoostTimer = state.starBoostTimer;
        let newBoostActive = state.boostActive;
        let newBoostTimer = state.boostTimer;
        const maxDespawnDist = Math.max(width, height) * 3 * blobScale;

        const evoValueMult = 1 + evo.spawnValueMult * 0.15;
        const gemMoneyMult = hasDoubleMoney ? 2 : 1;

        const eatenSet = new Set<string>();
        let vomitCount = 0;
        let vomitHungerLost = 0;
        let fragmentsCreated = 0;

        const osWorldIdx = WORLDS.indexOf(getWorldForLevel(state.currentLevel));
        const osCfg = getOversizedConfig(osWorldIdx);
        const swallowDuration = 0.4;
        const tickNow = performance.now() / 1000;

        for (const item of state.items) {
          const dist = Math.hypot(item.x - x, item.y - y);

          // Handle items currently being swallowed by the blob
          if (item.isOversized && item.splitState === 'swallowing') {
            const elapsed = tickNow - (item.swallowTime || 0);
            if (elapsed >= swallowDuration && osCfg) {
              vomitCount++;
              vomitHungerLost += osCfg.vomitHungerPenalty;
              const currentStage = item.oversizedStage || 1;

              if (currentStage > 1) {
                const newStage = currentStage - 1;
                const totalFrags = item._fragmentsRemaining || osCfg.fragmentCount;
                const fragsA = Math.ceil(totalFrags / 2);
                const fragsB = Math.floor(totalFrags / 2);
                const baseTaps = item.ramHitsRequired ?? item.splitTapsRequired ?? 3;
                const reducedTaps = Math.max(1, Math.ceil(baseTaps * newStage / OVERSIZED_VOMIT_STAGES));
                for (let vi = 0; vi < 2; vi++) {
                  const vAngle = (vi === 0 ? 0 : Math.PI) + (Math.random() - 0.5) * 1.0;
                  remainingItems.push({
                    id: Math.random().toString(36).substr(2, 9),
                    x, y,
                    vx: Math.cos(vAngle) * 70 * blobScale,
                    vy: Math.sin(vAngle) * 70 * blobScale,
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 2,
                    type: item.type,
                    value: item.value / 2,
                    weight: item.weight * 0.7,
                    isOversized: true,
                    oversizedStage: newStage,
                    ramHitsRequired: reducedTaps,
                    ramHitsReceived: 0,
                    splitTapsRequired: reducedTaps,
                    splitTapsReceived: 0,
                    splitState: 'whole',
                    vomitAttempts: 0,
                    lastVomitTime: 0,
                    _ignoreUntil: tickNow + osCfg.postVomitIgnoreTime,
                    _fragmentsRemaining: vi === 0 ? fragsA : fragsB,
                  });
                }
              } else {
                const fragCount = item._fragmentsRemaining || osCfg.fragmentCount;
                const effectiveVomitMult = osCfg.vomitValueMult + skillFx.oversizedValueMult;
                const perFragValue = (item.value * effectiveVomitMult) / Math.max(1, fragCount);
                for (let fi = 0; fi < fragCount; fi++) {
                  const fAngle = (fi / fragCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
                  remainingItems.push({
                    id: Math.random().toString(36).substr(2, 9),
                    x, y,
                    vx: Math.cos(fAngle) * 90 * blobScale,
                    vy: Math.sin(fAngle) * 90 * blobScale,
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 2,
                    type: item.type,
                    value: perFragValue,
                    weight: item.weight * 0.3,
                    isOversizedFragment: true,
                  });
                }
                fragmentsCreated += fragCount;
              }
              continue;
            }
            item.vx = (x - item.x) * 10;
            item.vy = (y - item.y) * 10;
            item.x += item.vx * delta;
            item.y += item.vy * delta;
            remainingItems.push(item);
            continue;
          }

          item.x += item.vx * delta;
          item.y += item.vy * delta;
          item.rotation += item.rotationSpeed * delta;

          const weightFactor = 1 / Math.max(1, item.weight * 0.45 * (1 - skillFx.weightReduction));

          if (state.abilities.magnet.active && dist > suction) {
            const magnetAngle = Math.atan2(y - item.y, x - item.x);
            item.vx += Math.cos(magnetAngle) * 200 * delta;
            item.vy += Math.sin(magnetAngle) * 200 * delta;
            item.vx *= 0.92;
            item.vy *= 0.92;
          } else if (dist < suction * 2 && dist >= suction) {
            const pullSpeed = (suction * 2 - dist) * suctionStrength * delta * weightFactor;
            const angle = Math.atan2(y - item.y, x - item.x);
            const chainBoost = skillFx.chainVacuumRadius > 0 && dist < suction + skillFx.chainVacuumRadius ? 1.5 : 1;
            item.vx += Math.cos(angle) * pullSpeed * 0.5 * chainBoost;
            item.vy += Math.sin(angle) * pullSpeed * 0.5 * chainBoost;
            item.rotationSpeed += (Math.random() - 0.5) * pullSpeed * 0.01;
            item.vx *= 0.95;
            item.vy *= 0.95;
          } else if (skillFx.magnetRadius > 0 && dist < Math.max(width, height) * skillFx.magnetRadius * blobScale * magnetWhileDashingMult) {
            const magnetAngle = Math.atan2(y - item.y, x - item.x);
            item.vx += Math.cos(magnetAngle) * 8 * delta;
            item.vy += Math.sin(magnetAngle) * 8 * delta;
            item.vx *= 0.98;
            item.vy *= 0.98;
          } else {
            item.vx *= 0.99;
            item.vy *= 0.99;
          }

          if (dist < suction) {
            if (item.isOversized && item.splitState !== 'splitting' && item.splitState !== 'swallowing') {
              if (item._ignoreUntil && tickNow < item._ignoreUntil) {
                remainingItems.push(item);
                continue;
              }
              // Ram-to-crack: only register a hit when the blob is moving
              // fast enough and the per-item cooldown has elapsed.
              const ramReady = !item._ramCooldown || tickNow >= item._ramCooldown;
              if (dashSpeed >= RAM_VEL_THRESHOLD && ramReady) {
                const required = Math.max(1,
                  (item.ramHitsRequired ?? item.splitTapsRequired ?? 3) - skillFx.ramHitsReduction
                );
                const received = (item.ramHitsReceived ?? item.splitTapsReceived ?? 0) + 1;
                item.ramHitsReceived = received;
                item.splitTapsReceived = received;
                item.splitState = 'cracking';
                item._ramCooldown = tickNow + 0.18;

                // Knockback the blob and the item
                const ramAngle = Math.atan2(y - item.y, x - item.x);
                vx += Math.cos(ramAngle) * dashSpeed * 0.6;
                vy += Math.sin(ramAngle) * dashSpeed * 0.6;
                newBlobVelocity.x = vx;
                newBlobVelocity.y = vy;
                item.vx -= Math.cos(ramAngle) * dashSpeed * 0.4;
                item.vy -= Math.sin(ramAngle) * dashSpeed * 0.4;

                if (received >= required) {
                  const wIdx = WORLDS.indexOf(getWorldForLevel(state.currentLevel));
                  const { newItems, fragmentCount } = splitOversizedItem(
                    item, [item], wIdx,
                    OVERSIZED_PROACTIVE_VALUE_MULT, skillFx.oversizedValueMult,
                  );
                  for (const f of newItems) {
                    if (f.id !== item.id) remainingItems.push(f);
                  }
                  fragmentsCreated += fragmentCount;
                } else {
                  remainingItems.push(item);
                }
              } else {
                remainingItems.push(item);
              }
              continue;
            }
            eatenSet.add(item.id);
            if (item.type === 'star') {
              newStarBoostActive = true;
              newStarBoostTimer = 5;
              starsEaten++;
            } else {
              const critRoll = skillFx.critEatChance > 0 && Math.random() < skillFx.critEatChance ? 3 : 1;
              moneyGained += item.value * critRoll;
              if (!item.isTapFood) {
                hungerFoodGained += item.value * 0.20;
              }
              if (!item.isTapFood && !item.isLegacy) {
                itemsEaten++;
              }
            }
          } else if (dist < maxDespawnDist) {
            remainingItems.push(item);
          }
        }

        if (skillFx.multiEatRadius > 0 && eatenSet.size > 0) {
          const multiRadius = skillFx.multiEatRadius * blobScale;
          const stillRemaining: Item[] = [];
          for (const item of remainingItems) {
            if (item.type === 'star' || item.isOversized) { stillRemaining.push(item); continue; }
            const distToBlob = Math.hypot(item.x - x, item.y - y);
            if (distToBlob < suction + multiRadius) {
              const critRoll = skillFx.critEatChance > 0 && Math.random() < skillFx.critEatChance ? 3 : 1;
              moneyGained += item.value * critRoll;
              if (!item.isTapFood) hungerFoodGained += item.value * 0.20;
              if (!item.isTapFood && !item.isLegacy) itemsEaten++;
            } else {
              stillRemaining.push(item);
            }
          }
          remainingItems.length = 0;
          remainingItems.push(...stillRemaining);
        }

        // --- Combo ---
        const baseComboWindow = Math.max(0.5, 1.2 / (1 + (state.currentLevel - 1) * 0.02));
        let newComboCount = state.comboCount;
        let newComboTimer = state.comboTimer;
        if (itemsEaten > 0) {
          newComboCount += itemsEaten;
          newComboTimer = baseComboWindow + skillFx.comboWindow;
        } else {
          newComboTimer = Math.max(0, newComboTimer - delta);
          if (newComboTimer <= 0) newComboCount = 0;
        }
        if (state.unlockedSkillNodes.includes('feast_combo_floor') && newComboCount > 0) {
          newComboCount = Math.max(2, newComboCount);
        }
        const comboCap = Math.max(10, skillFx.comboCap);
        const comboMult = 1 + (Math.max(0, Math.min(newComboCount, comboCap) - 1)) * 0.06;
        const comboScaleMult = skillFx.comboValueScale > 0 ? 1 + skillFx.comboValueScale * Math.min(newComboCount, comboCap) : 1;

        const frenzyValueMult = frenzyActive ? 1 + skillFx.lowHungerFrenzyMult * 0.5 : 1;
        // Apply Perfect Swipe value bonus when player collects 3+ items in a single swipe window
        const swipeWindowActive = state.perfectSwipePending > 0;
        const willBePerfect = swipeWindowActive
          && (state._swipeItemCount + itemsEaten) >= PERFECT_SWIPE_THRESHOLD;
        const perfectSwipeBonus = willBePerfect ? 1 + (skillFx.perfectSwipeMult || 0) + 0.25 : 1;
        const frenzyDashValueMult = newFrenzyDashActive ? 2 : 1;
        const streakBonus = 1 + (skillFx.streakBonusMult || 0) * (state.swipeStreak / 100);
        moneyGained *= adBoostMultiplier * achBonuses.moneyMult * gemMoneyMult
          * evoValueMult * comboMult * comboScaleMult * (1 + skillFx.valueMult) * frenzyValueMult
          * storeFrenzyMult * goldenGutMult * perfectSwipeBonus * frenzyDashValueMult * streakBonus;

        let newMoney = state.money + moneyGained;
        let newRunMoney = state.currentRunMoney + moneyGained;
        let newLevelUpTime = state.levelUpTime;

        if (skillFx.hungerOnEat > 0 && itemsEaten > 0) {
          hungerFoodGained += skillFx.hungerOnEat * itemsEaten;
        }

        if (hungerFoodGained > 0) {
          const hungerDeficit = maxHunger - newHunger;
          if (hungerFoodGained <= hungerDeficit) {
            newHunger += hungerFoodGained;
          } else {
            newHunger = maxHunger;
            const overflow = hungerFoodGained - hungerDeficit;
            if (skillFx.overkillCashRatio > 0) {
              const overkillCash = overflow * skillFx.overkillCashRatio;
              newMoney += overkillCash;
              newRunMoney += overkillCash;
              moneyGained += overkillCash;
            }
          }
        }

        if (vomitHungerLost > 0) {
          newHunger = Math.max(0, newHunger - vomitHungerLost);
        }

        const newOversizedVomitCount = state._oversizedVomitCount + vomitCount;

        // --- Level completion detection ---
        const newLevelItemsTotal = state.levelItemsTotal + fragmentsCreated;
        const newLevelItemsEaten = state.levelItemsEaten + itemsEaten;
        const nonStarItems = remainingItems.filter(i => i.type !== 'star' && !i.isTapFood && !i.isLegacy && !i.isOversized);
        let newLevelComplete = state.levelComplete;
        if (nonStarItems.length === 0 && newLevelItemsEaten >= newLevelItemsTotal && newLevelItemsTotal > 0) {
          newLevelComplete = true;
          newLevelUpTime = Date.now();
        }

        // --- Stars (power-ups, still spawn on timer) ---
        let newStarSpawnTimer = state.starSpawnTimer - delta;
        if (newStarSpawnTimer <= 0 && !newLevelComplete) {
          const starSpeedSyn = 1 + (state.upgrades.speedSynergy || 0) * 0.5;
          const starSpawnRate = Math.max(3, 18 * Math.pow(0.8, state.upgrades.boostSpawnRate || 0)) / starSpeedSyn / (1 + skillFx.starSpawnRateMult);
          newStarSpawnTimer = starSpawnRate;
          remainingItems.push({
            id: Math.random().toString(36).substr(2, 9),
            x: x + (Math.random() - 0.5) * width * 1.2 * blobScale,
            y: y + (Math.random() - 0.5) * height * 1.2 * blobScale,
            vx: (Math.random() - 0.5) * 30, vy: (Math.random() - 0.5) * 30,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 4,
            type: 'star', value: 0, weight: 0,
          });
        }

        // --- Boost timers ---
        if (newBoostActive) {
          newBoostTimer -= delta;
          if (newBoostTimer <= 0) { newBoostActive = false; newBoostTimer = 0; }
        }
        if (newStarBoostActive) {
          newStarBoostTimer -= delta;
          if (newStarBoostTimer <= 0) { newStarBoostActive = false; newStarBoostTimer = 0; }
        }

        // --- Active Abilities ---
        const newAbilities = { ...state.abilities };
        for (const aDef of ACTIVE_ABILITIES) {
          const aid = aDef.id as AbilityId;
          const ab = { ...newAbilities[aid] };
          if (ab.cooldown > 0) {
            ab.cooldown = Math.max(0, ab.cooldown - delta);
          }
          if (ab.active && ab.timer > 0) {
            ab.timer = Math.max(0, ab.timer - delta);
            if (ab.timer <= 0) {
              ab.active = false;
              ab.timer = 0;
            }
          }
          newAbilities[aid] = ab;
        }

        // --- $/sec tracking ---
        let newMoneyBuffer = state._moneyBuffer + moneyGained;
        let newMoneyBufferTime = state._moneyBufferTime + delta;
        let newMoneyPerSecond = state.moneyPerSecond;
        if (newMoneyBufferTime >= 2) {
          newMoneyPerSecond = newMoneyBuffer / newMoneyBufferTime;
          newMoneyBuffer = 0;
          newMoneyBufferTime = 0;
        }

        // --- Stats ---
        const newStats = { ...state.stats };
        newStats.totalFoodEaten += itemsEaten;
        newStats.totalMoneyEarned += moneyGained;
        newStats.totalStarsEaten += starsEaten;
        newStats.highestLevel = Math.max(newStats.highestLevel, state.currentLevel);
        newStats.highestCombo = Math.max(newStats.highestCombo, newComboCount);
        newStats.highestSpeed = Math.max(newStats.highestSpeed, speed);
        newStats.timePlayed += delta;

        // --- Achievements (check every ~1s) ---
        let newAchievementsList = [...state.achievements];
        let newGems = state.gems;
        let achTimer = state._achievementTimer + delta;
        if (achTimer >= 1) {
          achTimer = 0;
          for (const ach of ACHIEVEMENTS) {
            if (newAchievementsList.includes(ach.id)) continue;
            const statVal = (newStats as any)[ach.stat] || 0;
            if (statVal >= ach.threshold) {
              newAchievementsList.push(ach.id);
              if (ach.reward.type === 'gems') newGems += ach.reward.value;
            }
          }
        }

        // --- Contextual hints (piggyback on achievement timer) ---
        let newActiveHint = state.activeHint;
        let newCompletedHints = state.completedHints;

        // Hint triggers disabled for now
        // if (achTimer === 0 && !newActiveHint) {
        //   const elapsed = (Date.now() - state.levelStartTime) / 1000;
        //   if (state.currentLevel === 1 && elapsed > 1 && !newCompletedHints.includes('blob_intro')) {
        //     newActiveHint = 'blob_intro';
        //   } else if (state.currentLevel === 2 && newLevelItemsEaten >= 3 && !newCompletedHints.includes('tap_hint')) {
        //     newActiveHint = 'tap_hint';
        //   } else if (state.currentLevel >= 4 && hungerPctNow < 0.25 && !newCompletedHints.includes('skill_tree_hint')) {
        //     newActiveHint = 'skill_tree_hint';
        //   }
        // }

        // --- Swipe streak / Frenzy Dash trigger ---
        let newSwipeStreak = state.swipeStreak;
        let newPerfectSwipePending = state.perfectSwipePending;
        let newSwipeItemCount = state._swipeItemCount;
        let newPerfectSwipeFired = state._perfectSwipeFired;
        const streakWindow = 1.2 + (skillFx.streakWindow || 0);
        if (itemsEaten > 0 && (tickNow - state.lastSwipeTime) <= streakWindow) {
          newSwipeStreak = Math.min(100, newSwipeStreak + itemsEaten);
        } else if (tickNow - state.lastSwipeTime > streakWindow) {
          newSwipeStreak = Math.max(0, newSwipeStreak - delta * 8);
        }
        if (newSwipeStreak >= FRENZY_DASH_THRESHOLD && !newFrenzyDashActive) {
          newFrenzyDashActive = true;
          newFrenzyDashTimer = FRENZY_DASH_DURATION;
          newSwipeStreak = 0;
        }
        if (newPerfectSwipePending > 0) {
          newSwipeItemCount += itemsEaten;
          if (!newPerfectSwipeFired && newSwipeItemCount >= PERFECT_SWIPE_THRESHOLD) {
            newPerfectSwipeFired = true;
          }
          newPerfectSwipePending = Math.max(0, newPerfectSwipePending - delta);
          if (newPerfectSwipePending === 0) {
            newSwipeItemCount = 0;
            newPerfectSwipeFired = false;
          }
        }

        return {
          hunger: newHunger,
          blobPosition: { x, y },
          blobVelocity: newBlobVelocity,
          items: remainingItems,
          money: newMoney,
          currentRunMoney: newRunMoney,
          levelItemsEaten: newLevelItemsEaten,
          levelItemsTotal: newLevelItemsTotal,
          levelComplete: newLevelComplete,
          blobGrowth: state.blobGrowth + itemsEaten * 0.01,
          starSpawnTimer: newStarSpawnTimer,
          boostActive: newBoostActive,
          boostTimer: newBoostTimer,
          starBoostActive: newStarBoostActive,
          starBoostTimer: newStarBoostTimer,
          levelUpTime: newLevelUpTime,
          comboCount: newComboCount,
          comboTimer: newComboTimer,
          swipeStreak: newSwipeStreak,
          frenzyDashActive: newFrenzyDashActive,
          frenzyDashTimer: newFrenzyDashTimer,
          perfectSwipePending: newPerfectSwipePending,
          _swipeItemCount: newSwipeItemCount,
          _perfectSwipeFired: newPerfectSwipeFired,
          moneyPerSecond: newMoneyPerSecond,
          stats: newStats,
          achievements: newAchievementsList,
          gems: newGems,
          _moneyBuffer: newMoneyBuffer,
          _moneyBufferTime: newMoneyBufferTime,
          _achievementTimer: achTimer,
          abilities: newAbilities,
          activeHint: newActiveHint,
          completedHints: newCompletedHints,
          _shieldCooldown: newShieldCooldown,
          _minHungerPct: newMinHungerPct,
          _oversizedVomitCount: newOversizedVomitCount,
          activeTimedBoosts: newTimedBoosts,
        };
      })
    }),
    {
      name: 'idle-blob-storage',
      partialize: (state) => ({
        money: state.money,
        currentLevel: state.currentLevel,
        hunger: state.hunger,
        levelItemsEaten: state.levelItemsEaten,
        levelItemsTotal: state.levelItemsTotal,
        highestLevelReached: state.highestLevelReached,
        blobGrowth: state.blobGrowth,
        upgrades: state.upgrades,
        essence: state.essence,
        currentRunMoney: state.currentRunMoney,
        evolutionUpgrades: state.evolutionUpgrades,
        gems: state.gems,
        unlockedSkins: state.unlockedSkins,
        currentSkin: state.currentSkin,
        currentSpecialSkin: state.currentSpecialSkin,
        unlockedSpecialSkins: state.unlockedSpecialSkins,
        currentItem: state.currentItem,
        unlockedItems: state.unlockedItems,
        currentFace: state.currentFace,
        unlockedFaces: state.unlockedFaces,
        achievements: state.achievements,
        stats: state.stats,
        dailyReward: state.dailyReward,
        unlockedSkillNodes: state.unlockedSkillNodes,
        skillTelemetry: state.skillTelemetry,
        tutorialStep: state.tutorialStep,
        tutorialComplete: state.tutorialComplete,
        sessionCount: state.sessionCount,
        completedHints: state.completedHints,
        sfxEnabled: state.sfxEnabled,
        musicEnabled: state.musicEnabled,
        hapticsEnabled: state.hapticsEnabled,
        abilityCharges: state.abilityCharges,
        lastDailyChargeRefill: state.lastDailyChargeRefill,
        interstitialLevelsSinceAd: state.interstitialLevelsSinceAd,
        purchasedPacks: state.purchasedPacks,
        purchasedPermanentBoosts: state.purchasedPermanentBoosts,
        noInterstitialAds: state.noInterstitialAds,
        consumableInventory: state.consumableInventory,
        activeTimedBoosts: state.activeTimedBoosts,
        freeGiftLastClaim: state.freeGiftLastClaim,
        freeGiftClaimsToday: state.freeGiftClaimsToday,
        lastFreeGiftDate: state.lastFreeGiftDate,
        dailyDealDate: state.dailyDealDate,
        dailyDealPurchased: state.dailyDealPurchased,
        spicyMealActive: state.spicyMealActive,
        bestTimes: state.bestTimes,
        bestStars: state.bestStars,
        schemaVersion: 3,
      }),
      merge: (persisted: any, current) => {
        // ─── Save migration for 24→48 worlds expansion ───
        const OLD_TO_NEW_WORLD_START: Record<number, number> = {
          1: 1, 6: 6, 11: 16, 16: 26, 21: 36, 26: 46, 31: 51, 36: 61, 41: 66, 46: 76,
          51: 86, 56: 96, 61: 101, 66: 106, 71: 116, 77: 122, 83: 128, 89: 139,
          95: 145, 101: 151, 106: 161, 111: 166, 116: 176, 121: 181,
        };
        const oldStarts = Object.keys(OLD_TO_NEW_WORLD_START).map(Number).sort((a, b) => a - b);
        function migrateLevel(oldLevel: number): number {
          if (!oldLevel || oldLevel <= 0) return 1;
          let oldStart = oldStarts[0];
          for (const startLvl of oldStarts) {
            if (oldLevel >= startLvl) oldStart = startLvl;
          }
          return OLD_TO_NEW_WORLD_START[oldStart] + (oldLevel - oldStart);
        }
        const needsMigration = persisted && (!persisted.schemaVersion || persisted.schemaVersion < 2);
        if (needsMigration && persisted) {
          if (typeof persisted.currentLevel === 'number') persisted.currentLevel = migrateLevel(persisted.currentLevel);
          if (typeof persisted.highestLevelReached === 'number') persisted.highestLevelReached = migrateLevel(persisted.highestLevelReached);
          if (persisted.stats && typeof persisted.stats.highestLevel === 'number') {
            persisted.stats.highestLevel = migrateLevel(persisted.stats.highestLevel);
          }
          persisted.schemaVersion = 2;
        }

        // ─── Idle→Active rework: refund obsolete tap upgrades & strip dead persisted fields ───
        let refundMoney = 0;
        const cleanedUpgrades = { ...(persisted?.upgrades || {}) };
        const obsoleteTapUpgrades: string[] = ['tapValue', 'tapCooldown', 'tapSynergy'];
        for (const key of obsoleteTapUpgrades) {
          if (typeof (cleanedUpgrades as any)[key] === 'number') {
            const lvl = (cleanedUpgrades as any)[key] as number;
            refundMoney += Math.round(10 * Math.pow(1.5, lvl));
            delete (cleanedUpgrades as any)[key];
          }
        }
        const cleanedEvolution = { ...(persisted?.evolutionUpgrades || {}) };
        for (const key of ['tapMastery', 'offlineRate', 'autopilotRate']) {
          if (typeof (cleanedEvolution as any)[key] === 'number') {
            delete (cleanedEvolution as any)[key];
          }
        }

        const persistedSchema = persisted?.schemaVersion || 0;
        if (persistedSchema < 3 && persisted) {
          delete persisted.lastSaveTimestamp;
          delete persisted.moneyPerSecond;
          delete persisted.autopilotActive;
          delete persisted.autopilotSnapshot;
          delete persisted.lastTapTime;
          delete persisted.offlineBoost24hExpires;
          delete persisted.wanderAngle;
          delete persisted._autoTapAccum;
          delete persisted._autoSplitAccum;
          persisted.schemaVersion = 3;
        }

        const migratedLevel = persisted?.currentLevel || persisted?.level || 1;
        return {
          ...current,
          ...(persisted || {}),
          currentLevel: migratedLevel,
          upgrades: { ...DEFAULT_UPGRADES, ...cleanedUpgrades },
          evolutionUpgrades: { ...DEFAULT_EVOLUTION, ...cleanedEvolution },
          stats: { ...DEFAULT_STATS, ...(persisted?.stats || {}) },
          dailyReward: { ...DEFAULT_DAILY, ...(persisted?.dailyReward || {}) },
          unlockedSkillNodes: persisted?.unlockedSkillNodes || getStarterSkillNodesFromLegacy(persisted?.upgrades || {}),
          skillFlashEvents: [],
          skillTelemetry: {
            ...DEFAULT_SKILL_TELEMETRY,
            ...(persisted?.skillTelemetry || {}),
            runStartTimestamp: Date.now(),
          },
          money: (persisted?.money || 0) + refundMoney,
          sessionCount: (persisted?.sessionCount || 0) + 1,
          completedHints: persisted?.tutorialComplete
            ? ['blob_intro', 'tap_hint', 'money_hint', 'skill_tree_hint', 'worlds_hint']
            : (persisted?.completedHints || []),
          activeHint: null,
          achievements: persisted?.achievements || [],
          newAchievements: [],
          unlockedSkins: persisted?.unlockedSkins || ['default'],
          currentSpecialSkin: persisted?.currentSpecialSkin || '',
          unlockedSpecialSkins: persisted?.unlockedSpecialSkins || [],
          currentItem: persisted?.currentItem || '',
          unlockedItems: persisted?.unlockedItems || [],
          currentFace: persisted?.currentFace || '',
          unlockedFaces: persisted?.unlockedFaces || [],
          highestLevelReached: persisted?.highestLevelReached || migratedLevel,
          blobGrowth: persisted?.blobGrowth || 0,
          abilityCharges: { ...DEFAULT_ABILITY_CHARGES, ...(persisted?.abilityCharges || {}) },
          lastDailyChargeRefill: persisted?.lastDailyChargeRefill || '',
          lastAdRechargeTime: { ...DEFAULT_AD_RECHARGE_TIME },
          interstitialLevelsSinceAd: persisted?.interstitialLevelsSinceAd || 0,
          interstitialSessionAdCount: 0,
          interstitialLastTime: 0,
          lastRewardedAdTime: 0,
          purchasedPacks: persisted?.purchasedPacks || [],
          purchasedPermanentBoosts: (() => {
            const boosts: string[] = (persisted?.purchasedPermanentBoosts || []).filter(
              (b: string) => b !== 'sleep_eating'
            );
            const legacyGemItems: string[] = (persisted as any)?.purchasedGemItems || [];
            if (legacyGemItems.includes('double_money') && !boosts.includes('double_digest')) {
              return [...boosts, 'double_digest'];
            }
            return boosts;
          })(),
          noInterstitialAds: persisted?.noInterstitialAds || false,
          consumableInventory: persisted?.consumableInventory || {},
          activeTimedBoosts: (persisted?.activeTimedBoosts || []).filter((b: any) => b.expiresAt > Date.now()),
          freeGiftLastClaim: persisted?.freeGiftLastClaim || 0,
          freeGiftClaimsToday: persisted?.freeGiftClaimsToday || 0,
          lastFreeGiftDate: persisted?.lastFreeGiftDate || '',
          dailyDealDate: persisted?.dailyDealDate || '',
          dailyDealPurchased: persisted?.dailyDealPurchased || false,
          spicyMealActive: persisted?.spicyMealActive || false,
          bestTimes: persisted?.bestTimes || {},
          bestStars: persisted?.bestStars || {},
          blobVelocity: { x: 0, y: 0 },
          steerInput: { active: false, dirX: 0, dirY: 0, magnitude: 0 },
          swipeStreak: 0,
          lastSwipeTime: 0,
          frenzyDashActive: false,
          frenzyDashTimer: 0,
          perfectSwipePending: 0,
          _swipeItemCount: 0,
          _perfectSwipeFired: false,
          newRecordFlag: null,
          _levelInitialized: false,
        };
      },
    }
  )
);
