import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  BASE_MAX_HUNGER, BASE_HUNGER_DRAIN, BASE_SPEED, BASE_SUCTION,
  BASE_TAP_COOLDOWN, BASE_TAP_VALUE_MULT, UPGRADE_SOFT_CAP, softCap,
  EVOLUTION_UPGRADES, ACHIEVEMENTS,
  DAILY_REWARDS, STREAK_MULTIPLIERS, GEM_SHOP_ITEMS, BLOB_SKINS, SKILL_TREE_NODES,
  SKILL_NODE_LOOKUP, SkillNodeDef, SKILL_BRANCH_ORDER, getStarterSkillNodesFromLegacy, SKILL_GATES,
  ACTIVE_ABILITIES, type AbilityId,
  SPECIAL_SKINS, BLOB_ITEMS, BLOB_FACES,
} from '../lib/constants';
import { getLevel, getWorldForLevel, WORLDS, type WorldDef } from '../lib/levels';
import { ITEM_LOOKUP, getItemsForWorld } from '../lib/itemCatalog';

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
  isAutoTap?: boolean;
  isLegacy?: boolean;
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
  weightReduction: number;
  magnetRadius: number;
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
  weightReduction: 0, magnetRadius: 0,
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

  skillTreeOpen: boolean;
  customizerOpen: boolean;

  abilities: AbilitiesMap;

  lastSaveTimestamp: number;
  moneyPerSecond: number;

  lastTapTime: number;

  _moneyBuffer: number;
  _moneyBufferTime: number;
  _achievementTimer: number;
  _levelInitialized: boolean;
  _shieldCooldown: number;
  _minHungerPct: number;
  _introPlaying: boolean;
  _autoTapAccum: number;
  _benchmarkActive: boolean;

  initLevel: (levelNum: number) => void;
  completeLevel: () => void;
  endIntro: () => void;
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
  openSkillTree: () => void;
  closeSkillTree: () => void;
  openCustomizer: () => void;
  closeCustomizer: () => void;
  applyOfflineProgress: (earnings: number) => void;
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

      skillTreeOpen: false,
      customizerOpen: false,

      abilities: { ...DEFAULT_ABILITIES },

      lastSaveTimestamp: Date.now(),
      moneyPerSecond: 0,

      lastTapTime: 0,

      _moneyBuffer: 0,
      _moneyBufferTime: 0,
      _achievementTimer: 0,
      _levelInitialized: false,
      _shieldCooldown: 0,
      _minHungerPct: 1,
      _introPlaying: false,
      _autoTapAccum: 0,
      _benchmarkActive: false,

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
          abilities: { ...DEFAULT_ABILITIES },
          _levelInitialized: true,
          _shieldCooldown: 0,
          _minHungerPct: 1,
          _introPlaying: true,
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

        const hintToShow = state.activeHint;
        // Hint triggers disabled for now
        // if (!hintToShow) {
        //   const world = getWorldForLevel(state.currentLevel);
        //   const worldIdx = WORLDS.indexOf(world);
        //   if (worldIdx > 0 && !state.completedHints.includes('worlds_hint')) {
        //     hintToShow = 'worlds_hint';
        //   } else if (!state.completedHints.includes('money_hint')) {
        //     hintToShow = 'money_hint';
        //   }
        // }

        return {
          levelStars: stars,
          levelRewards: { ...rewards, money: finalMoney },
          money: state.money + finalMoney,
          essence: state.essence + (rewards.essence || 0),
          gems: state.gems + (rewards.gems || 0),
          currentRunMoney: state.currentRunMoney + finalMoney,
          activeHint: hintToShow,
          stats: {
            ...state.stats,
            totalLevelsCompleted: state.stats.totalLevelsCompleted + 1,
            totalStarsEarned: state.stats.totalStarsEarned + stars,
            totalMoneyEarned: state.stats.totalMoneyEarned + finalMoney,
            highestLevel: Math.max(state.stats.highestLevel, state.currentLevel),
          },
        };
      }),

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

      activateAbility: (id) => set((state) => {
        const def = ACTIVE_ABILITIES.find((a) => a.id === id);
        if (!def) return state;
        const ab = state.abilities[id];
        if (ab.cooldown > 0 || ab.active) return state;
        if (state.levelComplete || state.levelFailed) return state;
        if (state.highestLevelReached < def.unlockLevel) return state;

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
            abilities: {
              ...state.abilities,
              food: { cooldown: def.cooldown, active: false, timer: 0 },
            },
          };
        }

        return {
          abilities: {
            ...state.abilities,
            [id]: { cooldown: def.cooldown, active: true, timer: def.duration },
          },
        };
      }),

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
          abilities: { ...DEFAULT_ABILITIES },
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
          _autoTapAccum: 0,
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
        const baseVal = 1.5 * Math.sqrt(state.currentLevel);
        const value = baseVal * BASE_TAP_VALUE_MULT
          * (1 + softCap(state.upgrades.tapValue || 0) * 0.25 + skillFx.tapValueMult) * tapSyn * tapMasteryMult;

        const bx = state.blobPosition.x;
        const by = state.blobPosition.y;
        const tapDist = Math.hypot(worldX - bx, worldY - by);
        const minSpawnDist = 40;
        if (tapDist < minSpawnDist) return state;

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

      openSkillTree: () => set({ skillTreeOpen: true }),
      closeSkillTree: () => set({ skillTreeOpen: false }),
      openCustomizer: () => set({ customizerOpen: true }),
      closeCustomizer: () => set({ customizerOpen: false }),

      applyOfflineProgress: (earnings) => set((state) => ({
        money: state.money + earnings,
        stats: { ...state.stats, totalMoneyEarned: state.stats.totalMoneyEarned + earnings },
        currentRunMoney: state.currentRunMoney + earnings,
      })),

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
        sessionCount: 0, completedHints: [], activeHint: null, skillTreeOpen: false, customizerOpen: false,
        abilities: { ...DEFAULT_ABILITIES },
        lastSaveTimestamp: Date.now(), moneyPerSecond: 0,
        lastTapTime: 0,
        _moneyBuffer: 0, _moneyBufferTime: 0, _achievementTimer: 0,
        _levelInitialized: false, _shieldCooldown: 0, _minHungerPct: 1, _introPlaying: false,
        _autoTapAccum: 0, _benchmarkActive: false,
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
            _minHungerPct: 1,
            _introPlaying: true,
          };
        }

        if (state._introPlaying) return {};

        if (state.activeHint) {
          return { levelStartTime: Date.now() };
        }

        if (state.skillTreeOpen) {
          return { levelStartTime: Date.now() };
        }

        if (state.customizerOpen) {
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
          return { hunger: 0, levelFailed: true, _shieldCooldown: 0, _minHungerPct: 0 };
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
        const speed = (BASE_SPEED + softCap(state.upgrades.speed || 0) * 25)
          * adBoostMultiplier * starSpeedMultiplier * speedSyn
          * evoSpeedMult * achBonuses.speedMult
          * (1 + skillFx.speedMult) * frenzySpeedMult * abilitySpeedMult
          + skillFx.speedFlat;

        // --- Suction ---
        const suctionSyn = 1 + (state.upgrades.suctionSynergy || 0) * 0.5;
        const evoSuctionMult = 1 + evo.globalSuction * 0.1;
        const abilitySuctionMult = state.abilities.size.active ? 2 : 1;
        const suction = (BASE_SUCTION + softCap(state.upgrades.suction || 0) * 15)
          * suctionSyn * Math.sqrt(blobScale) * evoSuctionMult
          * (1 + skillFx.suctionMult) * abilitySuctionMult + skillFx.suctionFlat;
        const suctionStrength = (1 + softCap(state.upgrades.suctionStrength || 0) * 0.18) * suctionSyn;

        // --- Movement ---
        let { x, y } = state.blobPosition;
        let targetItem: Item | null = null;
        const hasTargetLock = state.unlockedSkillNodes.includes('hunt_target_lock');

        if (hasTargetLock) {
          let bestScore = -Infinity;
          for (const item of state.items) {
            if (item.type === 'star' || !item.isTapFood) {
              const dist = Math.max(1, Math.hypot(item.x - x, item.y - y));
              const score = (item.value || 1) / (dist * 0.5);
              if (score > bestScore) { bestScore = score; targetItem = item; }
            }
          }
          if (!targetItem) {
            for (const item of state.items) {
              const dist = Math.max(1, Math.hypot(item.x - x, item.y - y));
              const score = (item.value || 1) / (dist * 0.5);
              if (score > bestScore) { bestScore = score; targetItem = item; }
            }
          }
        } else {
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

          const weightFactor = 1 / Math.max(1, item.weight * 0.45 * (1 - skillFx.weightReduction));

          if (item.isAutoTap && dist > suction) {
            const homeAngle = Math.atan2(y - item.y, x - item.x);
            item.vx = Math.cos(homeAngle) * dist * 3;
            item.vy = Math.sin(homeAngle) * dist * 3;
          } else if (state.abilities.magnet.active && dist > suction) {
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
          } else if (skillFx.magnetRadius > 0 && dist < Math.max(width, height) * skillFx.magnetRadius * blobScale) {
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
            if (item.type === 'star') {
              newStarBoostActive = true;
              newStarBoostTimer = 5;
              starsEaten++;
            } else {
              moneyGained += item.value;
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

        const frenzyValueMult = frenzyActive ? 1 + skillFx.lowHungerFrenzyMult * 0.5 : 1;
        moneyGained *= adBoostMultiplier * achBonuses.moneyMult * gemMoneyMult
          * evoValueMult * comboMult * (1 + skillFx.valueMult) * frenzyValueMult;

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
        const nonStarItems = remainingItems.filter(i => i.type !== 'star' && !i.isTapFood && !i.isLegacy);
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

        // --- Auto-tap: spawn visible food that homes toward the blob ---
        let newAutoTapAccum = state._autoTapAccum;
        if (skillFx.autoTapRate > 0) {
          newAutoTapAccum += skillFx.autoTapRate * delta;
          const tapMasteryMult = 1 + (evo.tapMastery || 0) * 0.2;
          const tapSyn = 1 + (state.upgrades.tapSynergy || 0) * 0.5;
          const baseVal = 1.5 * Math.sqrt(state.currentLevel);
          const tapValue = baseVal * BASE_TAP_VALUE_MULT
            * (1 + softCap(state.upgrades.tapValue || 0) * 0.25 + skillFx.tapValueMult) * tapSyn * tapMasteryMult;

          while (newAutoTapAccum >= 1) {
            newAutoTapAccum -= 1;
            const spawnDist = suction * 2.5;
            remainingItems.push({
              id: Math.random().toString(36).substr(2, 9),
              x: x + Math.cos(newWanderAngle) * spawnDist,
              y: y + Math.sin(newWanderAngle) * spawnDist,
              vx: 0, vy: 0,
              rotation: 0, rotationSpeed: (Math.random() - 0.5) * 2,
              type: 'square', value: tapValue, weight: 1, isTapFood: true, isAutoTap: true,
            });
          }
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
          gems: newGems,
          lastSaveTimestamp: newSaveTimestamp,
          _moneyBuffer: newMoneyBuffer,
          _moneyBufferTime: newMoneyBufferTime,
          _achievementTimer: achTimer,
          abilities: newAbilities,
          activeHint: newActiveHint,
          completedHints: newCompletedHints,
          _shieldCooldown: newShieldCooldown,
          _minHungerPct: newMinHungerPct,
          _autoTapAccum: newAutoTapAccum,
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
          sessionCount: (persisted?.sessionCount || 0) + 1,
          completedHints: persisted?.tutorialComplete
            ? ['blob_intro', 'tap_hint', 'money_hint', 'skill_tree_hint', 'worlds_hint']
            : (persisted?.completedHints || []),
          activeHint: null,
          achievements: persisted?.achievements || [],
          newAchievements: [],
          purchasedGemItems: persisted?.purchasedGemItems || [],
          unlockedSkins: persisted?.unlockedSkins || ['default'],
          currentSpecialSkin: persisted?.currentSpecialSkin || '',
          unlockedSpecialSkins: persisted?.unlockedSpecialSkins || [],
          currentItem: persisted?.currentItem || '',
          unlockedItems: persisted?.unlockedItems || [],
          currentFace: persisted?.currentFace || '',
          unlockedFaces: persisted?.unlockedFaces || [],
          highestLevelReached: persisted?.highestLevelReached || migratedLevel,
          blobGrowth: persisted?.blobGrowth || 0,
          _levelInitialized: false,
        };
      },
    }
  )
);
