import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  BASE_MAX_HUNGER, BASE_HUNGER_DRAIN, BASE_SPEED, BASE_SUCTION, BASE_SPAWN_RATE,
  BASE_TAP_COOLDOWN, BASE_TAP_VALUE_MULT, UPGRADE_SOFT_CAP, TAP_FOOD_LEVEL_RATIO, NATURAL_FOOD_LEVEL_RATIO, softCap,
  EVOLUTION_UPGRADES, ACHIEVEMENTS, BIOMES, LEVEL_MILESTONES,
  DAILY_REWARDS, STREAK_MULTIPLIERS, GEM_SHOP_ITEMS, BLOB_SKINS, SKILL_TREE_NODES,
  SKILL_NODE_LOOKUP, SkillNodeDef, SKILL_BRANCH_ORDER, getStarterSkillNodesFromLegacy, SKILL_GATES,
} from '../lib/constants';

export type ItemType = 'triangle' | 'square' | 'hexagon' | 'star';

export interface Item {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  type: ItemType;
  value: number;
  tier: number;
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
  speedFlat: 0,
  speedMult: 0,
  suctionFlat: 0,
  suctionMult: 0,
  spawnRateMult: 0,
  valueMult: 0,
  hungerDrainMult: 0,
  hungerMaxFlat: 0,
  comboWindow: 0,
  comboCap: 10,
  tapValueMult: 0,
  tapCooldownMult: 0,
  offlineEfficiency: 0,
  autoTapRate: 0,
  starSpawnRateMult: 0,
  lowHungerFrenzyMult: 0,
  lowHungerThreshold: 0.3,
  frenzyShieldSeconds: 0,
  chainVacuumRadius: 0,
  overkillCashRatio: 0,
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
  totalPrestiges: 0,
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
      if (k === 'comboCap') {
        fx.comboCap = Math.max(fx.comboCap, v);
      } else if (k === 'lowHungerThreshold') {
        fx.lowHungerThreshold = Math.max(fx.lowHungerThreshold, v);
      } else {
        fx[k] += v;
      }
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
  if (ch1Keystones >= 2) {
    unlockGate('gate_a_unlock', 'gateA');
  }

  const allBranchesCh2 = SKILL_BRANCH_ORDER.every((branch) =>
    hasChapterProgress(nextUnlocked, branch, 2)
  );
  if (allBranchesCh2 && nextUnlocked.includes('gate_a_unlock')) {
    unlockGate('gate_b_unlock', 'gateB');
  }

  return bonusMoney;
}

interface GameState {
  money: number;
  level: number;
  hunger: number;
  foodEaten: number;
  blobPosition: { x: number; y: number };
  items: Item[];
  upgrades: Upgrades;
  spawnTimer: number;
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

  currentBiome: string;

  unlockedSkillNodes: string[];
  skillFlashEvents: string[];
  skillTelemetry: SkillTelemetry;

  tutorialStep: number;
  tutorialComplete: boolean;

  lastSaveTimestamp: number;
  moneyPerSecond: number;

  lastTapTime: number;
  claimedMilestones: number[];

  _moneyBuffer: number;
  _moneyBufferTime: number;
  _achievementTimer: number;
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
  setBiome: (id: string) => void;
  setSkin: (id: string) => void;
  dismissAchievement: (id: string) => void;
  completeTutorial: () => void;
  advanceTutorial: () => void;
  applyOfflineProgress: (earnings: number) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      money: 0,
      level: 1,
      hunger: BASE_MAX_HUNGER * 0.6,
      foodEaten: 0,
      blobPosition: { x: 200, y: 300 },
      items: [],
      upgrades: { ...DEFAULT_UPGRADES },
      spawnTimer: 0,
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

      currentBiome: 'meadow',
      unlockedSkillNodes: [],
      skillFlashEvents: [],
      skillTelemetry: { ...DEFAULT_SKILL_TELEMETRY },

      tutorialStep: 0,
      tutorialComplete: false,

      lastSaveTimestamp: Date.now(),
      moneyPerSecond: 0,

      lastTapTime: 0,
      claimedMilestones: [],

      _moneyBuffer: 0,
      _moneyBufferTime: 0,
      _achievementTimer: 0,

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

        const unlockedBiomes = BIOMES
          .filter(b => b.requiredPrestiges <= newTotalPrestiges)
          .map(b => b.id);

        return {
          money: startMoney,
          level: startLevel,
          hunger: BASE_MAX_HUNGER,
          foodEaten: 0,
          blobPosition: { x: 200, y: 300 },
          items: [],
          upgrades: { ...DEFAULT_UPGRADES },
          spawnTimer: 0,
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
          claimedMilestones: [],
          lastTapTime: 0,
          _moneyBuffer: 0,
          _moneyBufferTime: 0,
          moneyPerSecond: 0,
          currentBiome: unlockedBiomes.includes(state.currentBiome) ? state.currentBiome : 'meadow',
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
            highestLevel: Math.max(state.stats.highestLevel, state.level),
          },
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
        const now = performance.now() / 1000;
        const skillFx = getSkillEffects(state.unlockedSkillNodes);
        const tapSyn = 1 + (state.upgrades.tapSynergy || 0) * 0.5;
        const cooldown = BASE_TAP_COOLDOWN * Math.pow(0.9, softCap(state.upgrades.tapCooldown || 0)) / tapSyn
          * Math.max(0.3, 1 + skillFx.tapCooldownMult);
        if (now - state.lastTapTime < cooldown) return state;

        const maxTier = state.level;
        const baseVal = 4 * Math.sqrt(maxTier);
        const tapMasteryMult = 1 + (state.evolutionUpgrades.tapMastery || 0) * 0.2;
        const value = baseVal * BASE_TAP_VALUE_MULT
          * (1 + softCap(state.upgrades.tapValue || 0) * 0.25 + skillFx.tapValueMult) * tapSyn * tapMasteryMult;

        const newItem: Item = {
          id: Math.random().toString(36).substr(2, 9),
          x: worldX, y: worldY,
          vx: 0, vy: 0,
          rotation: 0, rotationSpeed: (Math.random() - 0.5) * 2,
          type: 'square', value, tier: maxTier, isTapFood: true,
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
          updates.level = state.level + 1;
          updates.foodEaten = 0;
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

      setBiome: (id) => set((state) => {
        const biome = BIOMES.find(b => b.id === id);
        if (!biome || biome.requiredPrestiges > state.stats.totalPrestiges) return state;
        return { currentBiome: id };
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
        money: 0, level: 1, hunger: BASE_MAX_HUNGER * 0.6, foodEaten: 0,
        blobPosition: { x: 200, y: 300 }, items: [],
        upgrades: { ...DEFAULT_UPGRADES },
        spawnTimer: 0, starSpawnTimer: 10,
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
        currentBiome: 'meadow',
        unlockedSkillNodes: [],
        skillFlashEvents: [],
        skillTelemetry: { ...DEFAULT_SKILL_TELEMETRY, runStartTimestamp: Date.now() },
        tutorialStep: 0, tutorialComplete: false,
        lastSaveTimestamp: Date.now(), moneyPerSecond: 0,
        lastTapTime: 0, claimedMilestones: [],
        _moneyBuffer: 0, _moneyBufferTime: 0, _achievementTimer: 0,
      }),

      tick: (delta, width, height) => set((state) => {
        const evo = state.evolutionUpgrades;
        const biome = BIOMES.find(b => b.id === state.currentBiome) || BIOMES[0];
        const achBonuses = getAchievementBonuses(state.achievements);
        const hasDoubleMoney = state.purchasedGemItems.includes('double_money');
        const skillFx = getSkillEffects(state.unlockedSkillNodes);

        const blobScale = 1 + (state.level - 1) * 0.15;
        const maxTier = state.level;

        // --- Hunger ---
        const hungerSyn = 1 + (state.upgrades.hungerSynergy || 0) * 0.5;
        const maxHunger = (BASE_MAX_HUNGER + softCap(state.upgrades.hungerMax || 0) * 20 + skillFx.hungerMaxFlat) * hungerSyn;
        const levelFactor = 1 + (state.level - 1) * 0.6;
        const rawDrain = BASE_HUNGER_DRAIN * levelFactor;
        const evoHungerResist = Math.pow(0.95, evo.hungerResist);
        const baseDrain = Math.max(0.5, rawDrain * Math.pow(0.95, softCap(state.upgrades.hungerDrain || 0)) * evoHungerResist) / hungerSyn;
        const dynamicDrain = baseDrain * (state.hunger / maxHunger) * (1 - skillFx.hungerDrainMult);
        let newHunger = Math.max(1, state.hunger - dynamicDrain * delta);

        // --- Speed ---
        const speedSyn = 1 + (state.upgrades.speedSynergy || 0) * 0.5;
        const evoSpeedMult = 1 + evo.globalSpeed * 0.1;
        const biomeSpeedMult = biome.bonus.type === 'speed' ? 1 + biome.bonus.value : 1;
        const adBoostMultiplier = state.boostActive ? 3 : 1;
        const starSpeedMultiplier = state.starBoostActive ? 1.5 : 1;
        const frenzyActive = (newHunger / Math.max(1, maxHunger)) <= skillFx.lowHungerThreshold;
        const frenzySpeedMult = frenzyActive ? 1 + skillFx.lowHungerFrenzyMult : 1;
        const speed = (BASE_SPEED + softCap(state.upgrades.speed || 0) * 25)
          * adBoostMultiplier * starSpeedMultiplier * speedSyn
          * evoSpeedMult * biomeSpeedMult * achBonuses.speedMult
          * (1 + skillFx.speedMult) * frenzySpeedMult
          + skillFx.speedFlat;

        // --- Suction ---
        const suctionSyn = 1 + (state.upgrades.suctionSynergy || 0) * 0.5;
        const evoSuctionMult = 1 + evo.globalSuction * 0.1;
        const biomeSuctionMult = biome.bonus.type === 'suction' ? 1 + biome.bonus.value : 1;
        const suction = (BASE_SUCTION + softCap(state.upgrades.suction || 0) * 15)
          * suctionSyn * Math.sqrt(blobScale) * evoSuctionMult * biomeSuctionMult
          * (1 + skillFx.suctionMult) + skillFx.suctionFlat;
        const suctionStrength = (1 + softCap(state.upgrades.suctionStrength || 0) * 0.18) * suctionSyn;

        // --- Movement ---
        let { x, y } = state.blobPosition;
        let targetItem: Item | null = null;
        let minDist = Infinity;

        for (const item of state.items) {
          if (item.tier > maxTier && item.type !== 'star') continue;
          const dist = Math.hypot(item.x - x, item.y - y);
          if (dist < minDist) { minDist = dist; targetItem = item; }
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
        let levelFoodGained = 0;
        let hungerFoodGained = 0;
        let itemsEaten = 0;
        let starsEaten = 0;

        let newStarBoostActive = state.starBoostActive;
        let newStarBoostTimer = state.starBoostTimer;
        let newBoostActive = state.boostActive;
        let newBoostTimer = state.boostTimer;
        const maxDespawnDist = Math.max(width, height) * 2 * blobScale;

        // Value multipliers
        const evoValueMult = 1 + evo.spawnValueMult * 0.15;
        const biomeValueMult = biome.bonus.type === 'value' ? 1 + biome.bonus.value : 1;
        const gemMoneyMult = hasDoubleMoney ? 2 : 1;

        for (const item of state.items) {
          const dist = Math.hypot(item.x - x, item.y - y);
          const canEat = item.tier <= maxTier || item.type === 'star';

          item.x += item.vx * delta;
          item.y += item.vy * delta;
          item.rotation += item.rotationSpeed * delta;

          if (canEat && dist < suction * 2 && dist >= suction) {
            const pullSpeed = (suction * 2 - dist) * suctionStrength * delta;
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

          if (canEat && dist < suction) {
            if (item.type === 'star') {
              newStarBoostActive = true;
              newStarBoostTimer = 5;
              starsEaten++;
            } else {
              moneyGained += item.value;
              levelFoodGained += item.isTapFood ? item.value * TAP_FOOD_LEVEL_RATIO : item.value * NATURAL_FOOD_LEVEL_RATIO;
              hungerFoodGained += item.value;
              itemsEaten++;
            }
          } else if (dist < maxDespawnDist) {
            remainingItems.push(item);
          }
        }

        // --- Combo ---
        // Base window shrinks as level rises: 1.2s at lv1 → ~0.5s floor
        const baseComboWindow = Math.max(0.5, 1.2 / (1 + (state.level - 1) * 0.04));
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

        // Apply all money multipliers
        moneyGained *= adBoostMultiplier * achBonuses.moneyMult * gemMoneyMult
          * evoValueMult * biomeValueMult * comboMult * (1 + skillFx.valueMult);

        // --- Food / Level ---
        let newFoodEaten = state.foodEaten;
        let newLevel = state.level;
        let newMoney = state.money + moneyGained;
        let newRunMoney = state.currentRunMoney + moneyGained;
        let newLevelUpTime = state.levelUpTime;
        let newClaimedMilestones = [...state.claimedMilestones];

        newFoodEaten += levelFoodGained;

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

        const sizeDecayRate = rawDrain * 0.12;
        newFoodEaten = Math.max(0, newFoodEaten - sizeDecayRate * delta);

        const foodToNextLevel = 25 * Math.pow(2.2, state.level - 1);
        if (newFoodEaten >= foodToNextLevel) {
          newLevel += 1;
          newFoodEaten -= foodToNextLevel;
          newLevelUpTime = Date.now();

          if (LEVEL_MILESTONES.includes(newLevel) && !newClaimedMilestones.includes(newLevel)) {
            const milestoneReward = 15 * newLevel * newLevel;
            newMoney += milestoneReward;
            newRunMoney += milestoneReward;
            newClaimedMilestones.push(newLevel);
          }
        }

        // --- Spawning ---
        let newSpawnTimer = state.spawnTimer - delta;
        const itemCap = 25;
        const spawnSyn = 1 + (state.upgrades.spawnSynergy || 0) * 0.5;
        const biomeSpawnMult = biome.bonus.type === 'spawn' ? 1 + biome.bonus.value : 1;
        const spawnInterval = Math.max(0.01,
          (BASE_SPAWN_RATE / 1000) * Math.pow(0.88, softCap(state.upgrades.spawnRate || 0))
          / biomeSpawnMult / (1 + skillFx.spawnRateMult));

        const eatableCount = remainingItems.filter(item => item.tier <= maxTier || item.type === 'star').length;
        let spawnsThisTick = 0;
        const maxSpawnsPerTick = 3;

        while (newSpawnTimer <= 0 && eatableCount + spawnsThisTick < itemCap && spawnsThisTick < maxSpawnsPerTick) {
          newSpawnTimer += spawnInterval;

          let tier: number;
          const rand = Math.random();
          if (rand < 0.08) tier = maxTier + 1;
          else if (rand < 0.35 && maxTier > 1) tier = Math.ceil(Math.random() * (maxTier - 1));
          else tier = maxTier;

          const typeRand = Math.random();
          let type: ItemType = 'triangle';
          let baseVal = 2;
          if (typeRand > 0.9) { type = 'hexagon'; baseVal = 8; }
          else if (typeRand > 0.6) { type = 'square'; baseVal = 4; }

          baseVal *= Math.pow(1.12, tier - 1);
          const value = baseVal * (1 + softCap(state.upgrades.spawnValue || 0) * 0.15) * spawnSyn;

          remainingItems.push({
            id: Math.random().toString(36).substr(2, 9),
            x: x + (Math.random() - 0.5) * width * 1.2 * blobScale,
            y: y + (Math.random() - 0.5) * height * 1.2 * blobScale,
            vx: (Math.random() - 0.5) * 20, vy: (Math.random() - 0.5) * 20,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 2,
            type, value, tier,
          });
          spawnsThisTick++;
        }

        // --- Stars ---
        let newStarSpawnTimer = state.starSpawnTimer - delta;
        if (newStarSpawnTimer <= 0 && remainingItems.length < itemCap + 5) {
          const starSpeedSyn = 1 + (state.upgrades.speedSynergy || 0) * 0.5;
          const starSpawnRate = Math.max(2, 15 * Math.pow(0.8, state.upgrades.boostSpawnRate || 0)) / starSpeedSyn / (1 + skillFx.starSpawnRateMult);
          newStarSpawnTimer = starSpawnRate;
          remainingItems.push({
            id: Math.random().toString(36).substr(2, 9),
            x: x + (Math.random() - 0.5) * width * 1.2 * blobScale,
            y: y + (Math.random() - 0.5) * height * 1.2 * blobScale,
            vx: (Math.random() - 0.5) * 30, vy: (Math.random() - 0.5) * 30,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 4,
            type: 'star', value: 0, tier: 1,
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
        newStats.highestLevel = Math.max(newStats.highestLevel, newLevel);
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

        // --- Auto-tap as flat passive income (bypasses multiplier chain) ---
        const autoTapPower = (state.upgrades.tapSynergy || 0) + skillFx.autoTapRate;
        if (autoTapPower > 0) {
          const autoTapMoney = autoTapPower * 1.5 * Math.sqrt(maxTier);
          newMoney += autoTapMoney * delta;
          newRunMoney += autoTapMoney * delta;
          moneyGained += autoTapMoney * delta;
        }

        // --- Save timestamp ---
        const newSaveTimestamp = Date.now();

        return {
          hunger: newHunger,
          blobPosition: { x, y },
          items: remainingItems,
          money: newMoney,
          foodEaten: newFoodEaten,
          level: newLevel,
          spawnTimer: newSpawnTimer,
          starSpawnTimer: newStarSpawnTimer,
          boostActive: newBoostActive,
          boostTimer: newBoostTimer,
          starBoostActive: newStarBoostActive,
          starBoostTimer: newStarBoostTimer,
          wanderAngle: newWanderAngle,
          levelUpTime: newLevelUpTime,
          currentRunMoney: newRunMoney,
          comboCount: newComboCount,
          comboTimer: newComboTimer,
          moneyPerSecond: newMoneyPerSecond,
          stats: newStats,
          achievements: newAchievementsList,
          newAchievements,
          gems: newGems,
          claimedMilestones: newClaimedMilestones,
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
        level: state.level,
        hunger: state.hunger,
        foodEaten: state.foodEaten,
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
        currentBiome: state.currentBiome,
        unlockedSkillNodes: state.unlockedSkillNodes,
        skillTelemetry: state.skillTelemetry,
        tutorialStep: state.tutorialStep,
        tutorialComplete: state.tutorialComplete,
        lastSaveTimestamp: state.lastSaveTimestamp,
        moneyPerSecond: state.moneyPerSecond,
        claimedMilestones: state.claimedMilestones,
      }),
      merge: (persisted: any, current) => ({
        ...current,
        ...(persisted || {}),
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
        claimedMilestones: persisted?.claimedMilestones || [],
      }),
    }
  )
);
