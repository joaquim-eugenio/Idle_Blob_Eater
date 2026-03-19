import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  BASE_MAX_HUNGER, BASE_HUNGER_DRAIN, BASE_SPEED, BASE_SUCTION,
  BASE_TAP_COOLDOWN, BASE_TAP_VALUE_MULT, UPGRADE_SOFT_CAP, softCap,
  EVOLUTION_UPGRADES, ACHIEVEMENTS,
  DAILY_REWARDS, STREAK_MULTIPLIERS, GEM_SHOP_ITEMS, BLOB_SKINS, SKILL_TREE_NODES,
  SKILL_NODE_LOOKUP, SkillNodeDef, SKILL_BRANCH_ORDER, getStarterSkillNodesFromLegacy, SKILL_GATES,
} from '../lib/constants';
import { getLevel, getWorldForLevel, type WorldDef } from '../lib/levels';
import { ITEM_LOOKUP } from '../lib/itemCatalog';

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
  isTapFood?: boolean;
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
  tapValue: number;
  tapCooldown: number;
  tapSynergy?: number;
  [key: string]: number | undefined;
}

export interface EvolutionUpgrades {
  startingMoney: number;
  globalSpeed: number;
  globalSuction: number;
  hungerResist: number;
  spawnValueMult: number;
  tapMastery: number;
  offlineRate: number;
  startingLevel: number;
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
  tapValueMult: number;
  tapCooldownMult: number;
  offlineEfficiency: number;
  autoTapRate: number;
  starSpawnRateMult: number;
  lowHungerFrenzyMult: number;
  lowHungerThreshold: number;
  frenzyShieldSeconds: number;
  chainVacuumRadius: number;
  overkillCashRatio: number;
}

export interface SkillTelemetry {
  runStartTimestamp: number;
  firstKeystoneAt: number | null;
  gateUnlockTimes: Partial<Record<'gateA' | 'gateB', number>>;
  nodePickCount: Record<string, number>;
  lastAbandonPoint: string;
}

const EMPTY_SKILL_EFFECTS: SkillEffects = {
  speedFlat: 0, speedMult: 0, suctionFlat: 0, suctionMult: 0,
  spawnRateMult: 0, valueMult: 0, hungerDrainMult: 0, hungerMaxFlat: 0,
  comboWindow: 0, comboCap: 10, tapValueMult: 0, tapCooldownMult: 0,
  offlineEfficiency: 0, autoTapRate: 0, starSpawnRateMult: 0,
  lowHungerFrenzyMult: 0, lowHungerThreshold: 0.3,
  frenzyShieldSeconds: 0, chainVacuumRadius: 0, overkillCashRatio: 0,
};

const DEFAULT_UPGRADES: Upgrades = {
  speed: 0, boostSpawnRate: 0,
  suction: 0, suctionStrength: 0,
  hungerDrain: 0, hungerMax: 0,
  spawnRate: 0, spawnValue: 0,
  tapValue: 0, tapCooldown: 0,
};

const DEFAULT_EVOLUTION: EvolutionUpgrades = {
  startingMoney: 0, globalSpeed: 0, globalSuction: 0,
  hungerResist: 0, spawnValueMult: 0, tapMastery: 0,
  offlineRate: 0, startingLevel: 0,
};

const DEFAULT_STATS: GameStats = {
  totalFoodEaten: 0, totalMoneyEarned: 0, totalStarsEaten: 0,
  highestLevel: 1, totalUpgradesBought: 0, totalSynergiesBought: 0,
  highestCombo: 0, highestSpeed: 0, totalTaps: 0, timePlayed: 0,
  totalPrestiges: 0, totalLevelsCompleted: 0, totalStarsEarned: 0,
};

const DEFAULT_DAILY: DailyRewardState = {
  lastClaimDate: '', streak: 0, cycleDay: 0,
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
  if (getChoiceLock(node, unlockedNodeIds)) return false;
  return true;
}

function checkGateUnlocks(
  nextUnlocked: string[],
  nextFlash: string[],
  nextTelemetry: SkillTelemetry,
  moneyPerSecond: number,
  runStartTimestamp: number,
): number {
  let bonusMoney = 0;

  const unlockGate = (gateNodeId: string, gateKey: 'gateA' | 'gateB') => {
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

  const allBranchesCh2 = SKILL_BRANCH_ORDER.every((branch) =>
    hasChapterProgress(nextUnlocked, branch, 2)
  );
  if (allBranchesCh2 && nextUnlocked.includes('gate_a_unlock')) unlockGate('gate_b_unlock', 'gateB');

  return bonusMoney;
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
  const levelSpread = 1 + levelNum * 0.04;
  const spacing = (avgItemSize * 2.5 + 20) * levelSpread;
  const minDist = (avgItemSize * 2 + 30) + levelNum * 4;

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
      value: catalogItem.baseValue * (1 + (levelNum - 1) * 0.08),
      weight: catalogItem.weight,
    });
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
  levelStars: number;
  levelStartTime: number;
  levelRewards: { money: number; essence?: number; gems?: number } | null;
  highestLevelReached: number;
  blobGrowth: number;

  blobPosition: { x: number; y: number };
  items: Item[];
  upgrades: Upgrades;
  starSpawnTimer: number;
  boostActive: boolean;
  boostTimer: number;
  starBoostActive: boolean;
  starBoostTimer: number;
  wanderAngle: number;
  levelUpTime: number;

  essence: number;
  currentRunMoney: number;
  evolutionUpgrades: EvolutionUpgrades;

  gems: number;
  purchasedGemItems: string[];
  unlockedSkins: string[];
  currentSkin: string;

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

  lastSaveTimestamp: number;
  moneyPerSecond: number;

  lastTapTime: number;

  _moneyBuffer: number;
  _moneyBufferTime: number;
  _achievementTimer: number;
  _levelInitialized: boolean;

  initLevel: (levelNum: number) => void;
  completeLevel: () => void;
  advanceToNextLevel: () => void;
  retryLevel: () => void;
  buyUpgrade: (type: keyof Upgrades, cost: number) => void;
  unlockSkillNode: (nodeId: string) => void;
  dismissSkillFlashEvent: (id: string) => void;
  activateBoost: () => void;
  activateStarBoost: () => void;
  tick: (delta: number, width: number, height: number) => void;
  resetGame: () => void;
  prestige: () => void;
  buyEvolutionUpgrade: (id: string) => void;
  tapFood: (worldX: number, worldY: number) => void;
  claimDailyReward: () => void;
  buyGemShopItem: (id: string) => void;
  buyBlobSkin: (id: string) => void;
  setSkin: (id: string) => void;
  dismissAchievement: (id: string) => void;
  completeTutorial: () => void;
  advanceTutorial: () => void;
  applyOfflineProgress: (earnings: number) => void;
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
      levelStars: 0,
      levelStartTime: Date.now(),
      levelRewards: null,
      highestLevelReached: 1,
      blobGrowth: 0,

      blobPosition: { x: 200, y: 300 },
      items: [],
      upgrades: { ...DEFAULT_UPGRADES },
      starSpawnTimer: 10,
      boostActive: false,
      boostTimer: 0,
      starBoostActive: false,
      starBoostTimer: 0,
      wanderAngle: Math.random() * Math.PI * 2,
      levelUpTime: 0,

      essence: 0,
      currentRunMoney: 0,
      evolutionUpgrades: { ...DEFAULT_EVOLUTION },

      gems: 0,
      purchasedGemItems: [],
      unlockedSkins: ['default'],
      currentSkin: 'default',

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

      lastSaveTimestamp: Date.now(),
      moneyPerSecond: 0,

      lastTapTime: 0,

      _moneyBuffer: 0,
      _moneyBufferTime: 0,
      _achievementTimer: 0,
      _levelInitialized: false,

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
          levelStars: 0,
          levelStartTime: Date.now(),
          levelRewards: null,
          blobPosition: { x: 200, y: 300 },
          wanderAngle: Math.random() * Math.PI * 2,
          comboCount: 0,
          comboTimer: 0,
          starSpawnTimer: 8,
          levelUpTime: 0,
          highestLevelReached: Math.max(state.highestLevelReached, levelNum),
          _levelInitialized: true,
        };
      }),

      completeLevel: () => set((state) => {
        if (!state.levelComplete) return state;

        const def = getLevel(state.currentLevel);
        const elapsedSecs = (Date.now() - state.levelStartTime) / 1000;

        let stars = 1;
        if (elapsedSecs <= def.starThresholds[1]) stars = 2;
        if (elapsedSecs <= def.starThresholds[0]) stars = 3;

        const rewards = def.rewards;
        const starBonus = stars === 3 ? 1.5 : stars === 2 ? 1.2 : 1;
        const finalMoney = Math.floor(rewards.money * starBonus);

        return {
          levelStars: stars,
          levelRewards: { ...rewards, money: finalMoney },
          money: state.money + finalMoney,
          essence: state.essence + (rewards.essence || 0),
          gems: state.gems + (rewards.gems || 0),
          currentRunMoney: state.currentRunMoney + finalMoney,
          stats: {
            ...state.stats,
            totalLevelsCompleted: state.stats.totalLevelsCompleted + 1,
            totalStarsEarned: state.stats.totalStarsEarned + stars,
            totalMoneyEarned: state.stats.totalMoneyEarned + finalMoney,
            highestLevel: Math.max(state.stats.highestLevel, state.currentLevel),
          },
        };
      }),

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

      buyUpgrade: (type, cost) => set((state) => {
        if (state.money < cost) return state;

        const currentLevel = state.upgrades[type] || 0;
        if (!String(type).endsWith('Synergy') && currentLevel >= UPGRADE_SOFT_CAP) return state;

        const getSynergyFor = (t: string) => {
          if (t === 'speed' || t === 'boostSpawnRate') return 'speedSynergy';
          if (t === 'suction' || t === 'suctionStrength') return 'suctionSynergy';
          if (t === 'hungerDrain' || t === 'hungerMax') return 'hungerSynergy';
          if (t === 'spawnRate' || t === 'spawnValue') return 'spawnSynergy';
          if (t === 'tapValue' || t === 'tapCooldown') return 'tapSynergy';
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
          if (type === 'tapSynergy') { branchA = 'tapValue'; branchB = 'tapCooldown'; }
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
          tutorialStep: state.tutorialStep === 3 ? 4 : state.tutorialStep,
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
          case 'feast_combo_timer': nextUpgrades.spawnValue = (nextUpgrades.spawnValue || 0) + 1; break;
          case 'feast_overkill': nextUpgrades.spawnSynergy = (nextUpgrades.spawnSynergy || 0) + 1; break;
          case 'survival_digestive': nextUpgrades.hungerDrain = (nextUpgrades.hungerDrain || 0) + 1; break;
          case 'survival_shield': nextUpgrades.hungerSynergy = (nextUpgrades.hungerSynergy || 0) + 1; break;
          case 'survival_keystone': nextUpgrades.hungerMax = (nextUpgrades.hungerMax || 0) + 1; break;
          case 'auto_tap_drone': nextUpgrades.tapSynergy = (nextUpgrades.tapSynergy || 0) + 1; break;
          case 'auto_tap_optimizer': nextUpgrades.tapValue = (nextUpgrades.tapValue || 0) + 1; break;
          case 'auto_offline_core': nextUpgrades.tapCooldown = (nextUpgrades.tapCooldown || 0) + 1; break;
          case 'auto_keystone': nextUpgrades.spawnRate = (nextUpgrades.spawnRate || 0) + 1; break;
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

      activateBoost: () => set({ boostActive: true, boostTimer: 10 }),
      activateStarBoost: () => set({ starBoostActive: true, starBoostTimer: 5 }),

      prestige: () => set((state) => {
        const essenceGained = Math.max(1, Math.floor(Math.sqrt(state.currentRunMoney / 500)));
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
          levelStars: 0,
          levelStartTime: Date.now(),
          levelRewards: null,
          blobPosition: { x: 200, y: 300 },
          items: [],
          upgrades: { ...DEFAULT_UPGRADES },
          starSpawnTimer: 10,
          boostActive: false,
          boostTimer: 0,
          starBoostActive: false,
          starBoostTimer: 0,
          wanderAngle: Math.random() * Math.PI * 2,
          levelUpTime: 0,
          essence: state.essence + essenceGained,
          currentRunMoney: 0,
          comboCount: 0,
          comboTimer: 0,
          lastTapTime: 0,
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

      tapFood: (worldX, worldY) => set((state) => {
        if (state.levelComplete || state.levelFailed) return state;

        const now = performance.now() / 1000;
        const skillFx = getSkillEffects(state.unlockedSkillNodes);
        const tapSyn = 1 + (state.upgrades.tapSynergy || 0) * 0.5;
        const cooldown = BASE_TAP_COOLDOWN * Math.pow(0.9, softCap(state.upgrades.tapCooldown || 0)) / tapSyn
          * Math.max(0.3, 1 + skillFx.tapCooldownMult);
        if (now - state.lastTapTime < cooldown) return state;

        const tapMasteryMult = 1 + (state.evolutionUpgrades.tapMastery || 0) * 0.2;
        const baseVal = 4 * Math.sqrt(state.currentLevel);
        const value = baseVal * BASE_TAP_VALUE_MULT
          * (1 + softCap(state.upgrades.tapValue || 0) * 0.25 + skillFx.tapValueMult) * tapSyn * tapMasteryMult;

        const newItem: Item = {
          id: Math.random().toString(36).substr(2, 9),
          x: worldX, y: worldY,
          vx: 0, vy: 0,
          rotation: 0, rotationSpeed: (Math.random() - 0.5) * 2,
          type: 'square', value, weight: 1, isTapFood: true,
        };

        return {
          items: [...state.items, newItem],
          lastTapTime: now,
          stats: { ...state.stats, totalTaps: state.stats.totalTaps + 1 },
          tutorialStep: state.tutorialStep === 1 ? 2 : state.tutorialStep,
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

      buyGemShopItem: (id) => set((state) => {
        const item = GEM_SHOP_ITEMS.find(i => i.id === id);
        if (!item) return state;
        if (item.type === 'permanent' && state.purchasedGemItems.includes(id)) return state;
        if (state.gems < item.cost) return state;

        const updates: any = { gems: state.gems - item.cost };

        if (item.type === 'permanent') {
          updates.purchasedGemItems = [...state.purchasedGemItems, id];
        } else if (id === 'time_warp') {
          updates.money = state.money + state.moneyPerSecond * 7200;
        } else if (id === 'instant_level') {
          updates.levelComplete = true;
          updates.levelItemsEaten = state.levelItemsTotal;
          updates.levelUpTime = Date.now();
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
        };
      }),

      setSkin: (id) => set((state) => {
        if (!state.unlockedSkins.includes(id)) return state;
        return { currentSkin: id };
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

      applyOfflineProgress: (earnings) => set((state) => ({
        money: state.money + earnings,
        stats: { ...state.stats, totalMoneyEarned: state.stats.totalMoneyEarned + earnings },
        currentRunMoney: state.currentRunMoney + earnings,
      })),

      resetGame: () => set({
        money: 0, currentLevel: 1, hunger: BASE_MAX_HUNGER * 0.6,
        levelItemsEaten: 0, levelItemsTotal: 0, levelComplete: false,
        levelFailed: false,
        levelStars: 0, levelStartTime: Date.now(), levelRewards: null,
        highestLevelReached: 1, blobGrowth: 0,
        blobPosition: { x: 200, y: 300 }, items: [],
        upgrades: { ...DEFAULT_UPGRADES },
        starSpawnTimer: 10,
        boostActive: false, boostTimer: 0,
        starBoostActive: false, starBoostTimer: 0,
        wanderAngle: Math.random() * Math.PI * 2, levelUpTime: 0,
        essence: 0, currentRunMoney: 0,
        evolutionUpgrades: { ...DEFAULT_EVOLUTION },
        gems: 0, purchasedGemItems: [], unlockedSkins: ['default'], currentSkin: 'default',
        achievements: [], newAchievements: [],
        stats: { ...DEFAULT_STATS },
        comboCount: 0, comboTimer: 0,
        dailyReward: { ...DEFAULT_DAILY },
        unlockedSkillNodes: [],
        skillFlashEvents: [],
        skillTelemetry: { ...DEFAULT_SKILL_TELEMETRY, runStartTimestamp: Date.now() },
        tutorialStep: 0, tutorialComplete: false,
        lastSaveTimestamp: Date.now(), moneyPerSecond: 0,
        lastTapTime: 0,
        _moneyBuffer: 0, _moneyBufferTime: 0, _achievementTimer: 0,
        _levelInitialized: false,
      }),

      tick: (delta, width, height) => set((state) => {
        if (!state._levelInitialized) {
          const def = getLevel(state.currentLevel);
          const levelItems = buildLevelItems(state.currentLevel, state.blobPosition.x, state.blobPosition.y);
          return {
            items: levelItems,
            levelItemsTotal: def.totalItems,
            levelFailed: false,
            levelStartTime: Date.now(),
            _levelInitialized: true,
          };
        }

        if (!state.tutorialComplete) {
          return { levelStartTime: Date.now() };
        }

        if (state.levelComplete || state.levelFailed) return {};

        const evo = state.evolutionUpgrades;
        const world = getWorldForLevel(state.currentLevel);
        const achBonuses = getAchievementBonuses(state.achievements);
        const hasDoubleMoney = state.purchasedGemItems.includes('double_money');
        const skillFx = getSkillEffects(state.unlockedSkillNodes);

        const blobScale = world.blobScale;

        // --- Hunger ---
        const hungerSyn = 1 + (state.upgrades.hungerSynergy || 0) * 0.5;
        const maxHunger = (BASE_MAX_HUNGER + softCap(state.upgrades.hungerMax || 0) * 20 + skillFx.hungerMaxFlat) * hungerSyn;
        const levelFactor = 1 + Math.pow(Math.max(0, state.currentLevel - 3), 1.2) * 0.08;
        const rawDrain = BASE_HUNGER_DRAIN * levelFactor;
        const evoHungerResist = Math.pow(0.95, evo.hungerResist);
        const baseDrain = Math.max(0.5, rawDrain * Math.pow(0.95, softCap(state.upgrades.hungerDrain || 0)) * evoHungerResist) / hungerSyn;
        const minDrain = baseDrain * 0.7;
        const effectiveDrain = Math.max(minDrain, baseDrain * (state.hunger / maxHunger)) * (1 + skillFx.hungerDrainMult);
        const hungerFloor = state.currentLevel <= 5 ? 1 : 0;
        let newHunger = Math.max(hungerFloor, state.hunger - effectiveDrain * delta);

        if (newHunger <= 0) {
          return { hunger: 0, levelFailed: true };
        }

        // --- Speed ---
        const speedSyn = 1 + (state.upgrades.speedSynergy || 0) * 0.5;
        const evoSpeedMult = 1 + evo.globalSpeed * 0.1;
        const adBoostMultiplier = state.boostActive ? 3 : 1;
        const starSpeedMultiplier = state.starBoostActive ? 1.5 : 1;
        const frenzyActive = (newHunger / Math.max(1, maxHunger)) <= skillFx.lowHungerThreshold;
        const frenzySpeedMult = frenzyActive ? 1 + skillFx.lowHungerFrenzyMult : 1;
        const speed = (BASE_SPEED + softCap(state.upgrades.speed || 0) * 25)
          * adBoostMultiplier * starSpeedMultiplier * speedSyn
          * evoSpeedMult * achBonuses.speedMult
          * (1 + skillFx.speedMult) * frenzySpeedMult
          + skillFx.speedFlat;

        // --- Suction ---
        const suctionSyn = 1 + (state.upgrades.suctionSynergy || 0) * 0.5;
        const evoSuctionMult = 1 + evo.globalSuction * 0.1;
        const suction = (BASE_SUCTION + softCap(state.upgrades.suction || 0) * 15)
          * suctionSyn * Math.sqrt(blobScale) * evoSuctionMult
          * (1 + skillFx.suctionMult) + skillFx.suctionFlat;
        const suctionStrength = (1 + softCap(state.upgrades.suctionStrength || 0) * 0.18) * suctionSyn;

        // --- Movement ---
        let { x, y } = state.blobPosition;
        let targetItem: Item | null = null;
        let minDist = Infinity;

        for (const item of state.items) {
          if (item.type === 'star' || !item.isTapFood) {
            const dist = Math.hypot(item.x - x, item.y - y);
            if (dist < minDist) { minDist = dist; targetItem = item; }
          }
        }
        if (!targetItem) {
          for (const item of state.items) {
            const dist = Math.hypot(item.x - x, item.y - y);
            if (dist < minDist) { minDist = dist; targetItem = item; }
          }
        }

        let newWanderAngle = state.wanderAngle;
        if (targetItem) {
          const angle = Math.atan2(targetItem.y - y, targetItem.x - x);
          x += Math.cos(angle) * speed * delta;
          y += Math.sin(angle) * speed * delta;
          newWanderAngle = angle;
        } else {
          newWanderAngle += (Math.random() - 0.5) * delta * 2;
          x += Math.cos(newWanderAngle) * (speed * 0.5) * delta;
          y += Math.sin(newWanderAngle) * (speed * 0.5) * delta;
        }

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

        for (const item of state.items) {
          const dist = Math.hypot(item.x - x, item.y - y);

          item.x += item.vx * delta;
          item.y += item.vy * delta;
          item.rotation += item.rotationSpeed * delta;

          const weightFactor = 1 / Math.max(1, item.weight * 0.3);

          if (dist < suction * 2 && dist >= suction) {
            const pullSpeed = (suction * 2 - dist) * suctionStrength * delta * weightFactor;
            const angle = Math.atan2(y - item.y, x - item.x);
            const chainBoost = skillFx.chainVacuumRadius > 0 && dist < suction + skillFx.chainVacuumRadius ? 1.5 : 1;
            item.vx += Math.cos(angle) * pullSpeed * 0.5 * chainBoost;
            item.vy += Math.sin(angle) * pullSpeed * 0.5 * chainBoost;
            item.rotationSpeed += (Math.random() - 0.5) * pullSpeed * 0.01;
            item.vx *= 0.95;
            item.vy *= 0.95;
          } else {
            item.vx *= 0.99;
            item.vy *= 0.99;
          }

          if (dist < suction) {
            if (item.type === 'star') {
              newStarBoostActive = true;
              newStarBoostTimer = 5;
              starsEaten++;
            } else {
              moneyGained += item.value;
              hungerFoodGained += item.value * 0.12;
              itemsEaten++;
            }
          } else if (dist < maxDespawnDist) {
            remainingItems.push(item);
          }
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

        moneyGained *= adBoostMultiplier * achBonuses.moneyMult * gemMoneyMult
          * evoValueMult * comboMult * (1 + skillFx.valueMult);

        let newMoney = state.money + moneyGained;
        let newRunMoney = state.currentRunMoney + moneyGained;
        let newLevelUpTime = state.levelUpTime;

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

        // --- Level completion detection ---
        const newLevelItemsEaten = state.levelItemsEaten + itemsEaten;
        const nonStarItems = remainingItems.filter(i => i.type !== 'star' && !i.isTapFood);
        let newLevelComplete = state.levelComplete;
        if (nonStarItems.length === 0 && newLevelItemsEaten >= state.levelItemsTotal && state.levelItemsTotal > 0) {
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
        let newAchievements = [...state.newAchievements];
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
              newAchievements.push(ach.id);
              if (ach.reward.type === 'gems') newGems += ach.reward.value;
            }
          }
        }

        // --- Auto-tap as flat passive income ---
        const autoTapPower = (state.upgrades.tapSynergy || 0) + skillFx.autoTapRate;
        if (autoTapPower > 0) {
          const autoTapMoney = autoTapPower * 1.5 * Math.sqrt(state.currentLevel);
          newMoney += autoTapMoney * delta;
          newRunMoney += autoTapMoney * delta;
          moneyGained += autoTapMoney * delta;
        }

        const newSaveTimestamp = Date.now();

        return {
          hunger: newHunger,
          blobPosition: { x, y },
          items: remainingItems,
          money: newMoney,
          currentRunMoney: newRunMoney,
          levelItemsEaten: newLevelItemsEaten,
          levelComplete: newLevelComplete,
          blobGrowth: state.blobGrowth + itemsEaten * 0.01,
          starSpawnTimer: newStarSpawnTimer,
          boostActive: newBoostActive,
          boostTimer: newBoostTimer,
          starBoostActive: newStarBoostActive,
          starBoostTimer: newStarBoostTimer,
          wanderAngle: newWanderAngle,
          levelUpTime: newLevelUpTime,
          comboCount: newComboCount,
          comboTimer: newComboTimer,
          moneyPerSecond: newMoneyPerSecond,
          stats: newStats,
          achievements: newAchievementsList,
          newAchievements,
          gems: newGems,
          lastSaveTimestamp: newSaveTimestamp,
          _moneyBuffer: newMoneyBuffer,
          _moneyBufferTime: newMoneyBufferTime,
          _achievementTimer: achTimer,
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
        purchasedGemItems: state.purchasedGemItems,
        unlockedSkins: state.unlockedSkins,
        currentSkin: state.currentSkin,
        achievements: state.achievements,
        stats: state.stats,
        dailyReward: state.dailyReward,
        unlockedSkillNodes: state.unlockedSkillNodes,
        skillTelemetry: state.skillTelemetry,
        tutorialStep: state.tutorialStep,
        tutorialComplete: state.tutorialComplete,
        lastSaveTimestamp: state.lastSaveTimestamp,
        moneyPerSecond: state.moneyPerSecond,
      }),
      merge: (persisted: any, current) => {
        const migratedLevel = persisted?.currentLevel || persisted?.level || 1;
        return {
          ...current,
          ...(persisted || {}),
          currentLevel: migratedLevel,
          upgrades: { ...DEFAULT_UPGRADES, ...(persisted?.upgrades || {}) },
          evolutionUpgrades: { ...DEFAULT_EVOLUTION, ...(persisted?.evolutionUpgrades || {}) },
          stats: { ...DEFAULT_STATS, ...(persisted?.stats || {}) },
          dailyReward: { ...DEFAULT_DAILY, ...(persisted?.dailyReward || {}) },
          unlockedSkillNodes: persisted?.unlockedSkillNodes || getStarterSkillNodesFromLegacy(persisted?.upgrades || {}),
          skillFlashEvents: [],
          skillTelemetry: {
            ...DEFAULT_SKILL_TELEMETRY,
            ...(persisted?.skillTelemetry || {}),
            runStartTimestamp: Date.now(),
          },
          achievements: persisted?.achievements || [],
          newAchievements: [],
          purchasedGemItems: persisted?.purchasedGemItems || [],
          unlockedSkins: persisted?.unlockedSkins || ['default'],
          highestLevelReached: persisted?.highestLevelReached || migratedLevel,
          blobGrowth: persisted?.blobGrowth || 0,
          _levelInitialized: false,
        };
      },
    }
  )
);
