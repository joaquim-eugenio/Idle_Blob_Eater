export const FPS = 60;
export const BASE_SPEED = 30;
export const BASE_SUCTION = 22;
export const BASE_HUNGER_DRAIN = 3.0;
export const BASE_MAX_HUNGER = 100;
export const BASE_SPAWN_RATE = 800;
export const BASE_SPAWN_VALUE = 1;

export const UPGRADE_SOFT_CAP = 30;
export const BASE_TAP_COOLDOWN = 0.5;
export const BASE_TAP_VALUE_MULT = 1.5;
export const OFFLINE_BASE_EFFICIENCY = 0.1;
export const OFFLINE_MAX_HOURS = 8;

export function softCap(rawLevel: number, threshold: number = 5): number {
  if (rawLevel <= threshold) return rawLevel;
  const excess = rawLevel - threshold;
  return threshold + excess / (1 + excess * 0.1);
}

export const UPGRADE_COSTS: Record<string, (level: number) => number> = {
  speed: (level) => Math.floor(10 * Math.pow(1.8, level)),
  boostSpawnRate: (level) => Math.floor(15 * Math.pow(1.8, level)),
  speedSynergy: (level) => Math.floor(500 * Math.pow(4.0, level)),
  suction: (level) => Math.floor(12 * Math.pow(1.8, level)),
  suctionStrength: (level) => Math.floor(15 * Math.pow(1.8, level)),
  suctionSynergy: (level) => Math.floor(500 * Math.pow(4.0, level)),
  hungerDrain: (level) => Math.floor(15 * Math.pow(1.7, level)),
  hungerMax: (level) => Math.floor(10 * Math.pow(1.7, level)),
  hungerSynergy: (level) => Math.floor(500 * Math.pow(4.0, level)),
  spawnRate: (level) => Math.floor(20 * Math.pow(2.0, level)),
  spawnValue: (level) => Math.floor(25 * Math.pow(2.0, level)),
  spawnSynergy: (level) => Math.floor(500 * Math.pow(4.0, level)),
  tapValue: (level) => Math.floor(15 * Math.pow(1.8, level)),
  tapCooldown: (level) => Math.floor(20 * Math.pow(1.8, level)),
  tapSynergy: (level) => Math.floor(500 * Math.pow(4.0, level)),
};

export const EVOLUTION_UPGRADES: Record<string, { name: string; desc: string; maxLevel: number; cost: (level: number) => number }> = {
  startingMoney: { name: 'Starting Capital', desc: 'Start each run with more money', maxLevel: 10, cost: (l) => Math.floor(2 * Math.pow(1.8, l)) },
  globalSpeed: { name: 'Swift Evolution', desc: '+10% speed per level', maxLevel: 20, cost: (l) => Math.floor(3 * Math.pow(1.5, l)) },
  globalSuction: { name: 'Magnetic Pull', desc: '+10% suction per level', maxLevel: 20, cost: (l) => Math.floor(3 * Math.pow(1.5, l)) },
  hungerResist: { name: 'Efficient Digestion', desc: '-5% hunger drain per level', maxLevel: 15, cost: (l) => Math.floor(4 * Math.pow(1.6, l)) },
  spawnValueMult: { name: 'Rich Feast', desc: '+15% item value per level', maxLevel: 20, cost: (l) => Math.floor(3 * Math.pow(1.5, l)) },
  tapMastery: { name: 'Tap Mastery', desc: '+20% tap value per level', maxLevel: 10, cost: (l) => Math.floor(5 * Math.pow(2, l)) },
  offlineRate: { name: 'Idle Earnings', desc: '+10% offline efficiency per level', maxLevel: 5, cost: (l) => Math.floor(10 * Math.pow(2, l)) },
  startingLevel: { name: 'Head Start', desc: 'Start at a higher level after prestige', maxLevel: 5, cost: (l) => Math.floor(15 * Math.pow(2.5, l)) },
};

export interface AchievementDef {
  id: string;
  name: string;
  desc: string;
  category: string;
  threshold: number;
  stat: string;
  reward: { type: 'money_mult' | 'speed_mult' | 'gems'; value: number };
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'first_bite', name: 'First Bite', desc: 'Eat 1 food item', category: 'eating', stat: 'totalFoodEaten', threshold: 1, reward: { type: 'money_mult', value: 0.01 } },
  { id: 'hungry_blob', name: 'Hungry Blob', desc: 'Eat 50 food items', category: 'eating', stat: 'totalFoodEaten', threshold: 50, reward: { type: 'money_mult', value: 0.02 } },
  { id: 'glutton', name: 'Glutton', desc: 'Eat 500 food items', category: 'eating', stat: 'totalFoodEaten', threshold: 500, reward: { type: 'gems', value: 2 } },
  { id: 'devourer', name: 'Devourer', desc: 'Eat 5,000 food items', category: 'eating', stat: 'totalFoodEaten', threshold: 5000, reward: { type: 'gems', value: 5 } },
  { id: 'insatiable', name: 'Insatiable', desc: 'Eat 50,000 food items', category: 'eating', stat: 'totalFoodEaten', threshold: 50000, reward: { type: 'gems', value: 10 } },
  { id: 'pocket_change', name: 'Pocket Change', desc: 'Earn $100 total', category: 'money', stat: 'totalMoneyEarned', threshold: 100, reward: { type: 'money_mult', value: 0.02 } },
  { id: 'comfortable', name: 'Comfortable', desc: 'Earn $1,000 total', category: 'money', stat: 'totalMoneyEarned', threshold: 1000, reward: { type: 'money_mult', value: 0.02 } },
  { id: 'rich_blob', name: 'Rich Blob', desc: 'Earn $10,000 total', category: 'money', stat: 'totalMoneyEarned', threshold: 10000, reward: { type: 'gems', value: 3 } },
  { id: 'wealthy', name: 'Wealthy', desc: 'Earn $100,000 total', category: 'money', stat: 'totalMoneyEarned', threshold: 100000, reward: { type: 'gems', value: 5 } },
  { id: 'blob_billionaire', name: 'Blob Billionaire', desc: 'Earn $1,000,000 total', category: 'money', stat: 'totalMoneyEarned', threshold: 1000000, reward: { type: 'gems', value: 10 } },
  { id: 'growing_up', name: 'Growing Up', desc: 'Clear level 5', category: 'levels', stat: 'highestLevel', threshold: 5, reward: { type: 'money_mult', value: 0.02 } },
  { id: 'big_blob', name: 'Big Blob', desc: 'Clear level 10', category: 'levels', stat: 'highestLevel', threshold: 10, reward: { type: 'gems', value: 2 } },
  { id: 'mega_blob', name: 'Mega Blob', desc: 'Clear level 20', category: 'levels', stat: 'highestLevel', threshold: 20, reward: { type: 'gems', value: 5 } },
  { id: 'giga_blob', name: 'Giga Blob', desc: 'Clear level 35', category: 'levels', stat: 'highestLevel', threshold: 35, reward: { type: 'gems', value: 8 } },
  { id: 'cosmic_blob', name: 'Cosmic Blob', desc: 'Clear level 50', category: 'levels', stat: 'highestLevel', threshold: 50, reward: { type: 'gems', value: 15 } },
  { id: 'world_explorer', name: 'World Explorer', desc: 'Clear 25 levels total', category: 'levels', stat: 'totalLevelsCompleted', threshold: 25, reward: { type: 'money_mult', value: 0.03 } },
  { id: 'level_grinder', name: 'Level Grinder', desc: 'Clear 100 levels total', category: 'levels', stat: 'totalLevelsCompleted', threshold: 100, reward: { type: 'gems', value: 10 } },
  { id: 'star_performer', name: 'Star Performer', desc: 'Earn 50 stars total', category: 'levels', stat: 'totalStarsEarned', threshold: 50, reward: { type: 'gems', value: 5 } },
  { id: 'perfectionist', name: 'Perfectionist', desc: 'Earn 150 stars total', category: 'levels', stat: 'totalStarsEarned', threshold: 150, reward: { type: 'gems', value: 10 } },
  { id: 'first_upgrade', name: 'First Upgrade', desc: 'Buy your first upgrade', category: 'upgrades', stat: 'totalUpgradesBought', threshold: 1, reward: { type: 'money_mult', value: 0.01 } },
  { id: 'upgrade_addict', name: 'Upgrade Addict', desc: 'Buy 25 upgrades', category: 'upgrades', stat: 'totalUpgradesBought', threshold: 25, reward: { type: 'money_mult', value: 0.03 } },
  { id: 'synergy_master', name: 'Synergy Master', desc: 'Buy a synergy upgrade', category: 'upgrades', stat: 'totalSynergiesBought', threshold: 1, reward: { type: 'gems', value: 3 } },
  { id: 'fully_synergized', name: 'Fully Synergized', desc: 'Buy 4 synergies', category: 'upgrades', stat: 'totalSynergiesBought', threshold: 4, reward: { type: 'gems', value: 5 } },
  { id: 'first_evolution', name: 'First Evolution', desc: 'Prestige for the first time', category: 'prestige', stat: 'totalPrestiges', threshold: 1, reward: { type: 'gems', value: 5 } },
  { id: 'evolve_5', name: 'Evolved Being', desc: 'Prestige 5 times', category: 'prestige', stat: 'totalPrestiges', threshold: 5, reward: { type: 'gems', value: 10 } },
  { id: 'evolve_10', name: 'Transcendent', desc: 'Prestige 10 times', category: 'prestige', stat: 'totalPrestiges', threshold: 10, reward: { type: 'gems', value: 15 } },
  { id: 'evolve_25', name: 'Eternal Blob', desc: 'Prestige 25 times', category: 'prestige', stat: 'totalPrestiges', threshold: 25, reward: { type: 'gems', value: 25 } },
  { id: 'star_collector', name: 'Star Collector', desc: 'Collect 50 stars', category: 'special', stat: 'totalStarsEaten', threshold: 50, reward: { type: 'speed_mult', value: 0.05 } },
  { id: 'star_hoarder', name: 'Star Hoarder', desc: 'Collect 200 stars', category: 'special', stat: 'totalStarsEaten', threshold: 200, reward: { type: 'gems', value: 5 } },
  { id: 'combo_king', name: 'Combo King', desc: 'Reach a 10x combo', category: 'special', stat: 'highestCombo', threshold: 10, reward: { type: 'money_mult', value: 0.05 } },
  { id: 'combo_legend', name: 'Combo Legend', desc: 'Reach a 25x combo', category: 'special', stat: 'highestCombo', threshold: 25, reward: { type: 'gems', value: 5 } },
  { id: 'speed_demon', name: 'Speed Demon', desc: 'Reach 1000+ speed', category: 'special', stat: 'highestSpeed', threshold: 1000, reward: { type: 'speed_mult', value: 0.05 } },
  { id: 'tap_master', name: 'Tap Master', desc: 'Tap 500 times', category: 'special', stat: 'totalTaps', threshold: 500, reward: { type: 'gems', value: 3 } },
];

export interface BiomeDef {
  id: string;
  name: string;
  requiredPrestiges: number;
  bonus: { type: 'suction' | 'speed' | 'spawn' | 'value'; value: number };
  bgColor: string;
  gridColor: string;
  foodColors: { triangle: string; square: string; hexagon: string };
}

export const BIOMES: BiomeDef[] = [
  { id: 'meadow', name: 'Meadow', requiredPrestiges: 0, bonus: { type: 'value', value: 0 }, bgColor: '#f8fafc', gridColor: 'rgba(200, 200, 200, 0.15)', foodColors: { triangle: '#4ade80', square: '#facc15', hexagon: '#f87171' } },
  { id: 'ocean', name: 'Ocean', requiredPrestiges: 1, bonus: { type: 'suction', value: 0.2 }, bgColor: '#eff6ff', gridColor: 'rgba(59, 130, 246, 0.12)', foodColors: { triangle: '#67e8f9', square: '#38bdf8', hexagon: '#818cf8' } },
  { id: 'volcano', name: 'Volcano', requiredPrestiges: 3, bonus: { type: 'speed', value: 0.2 }, bgColor: '#fef2f2', gridColor: 'rgba(239, 68, 68, 0.1)', foodColors: { triangle: '#fb923c', square: '#f87171', hexagon: '#dc2626' } },
  { id: 'space', name: 'Space', requiredPrestiges: 5, bonus: { type: 'spawn', value: 0.2 }, bgColor: '#0f172a', gridColor: 'rgba(148, 163, 184, 0.06)', foodColors: { triangle: '#a78bfa', square: '#c084fc', hexagon: '#e879f9' } },
  { id: 'candy', name: 'Candy Land', requiredPrestiges: 10, bonus: { type: 'value', value: 0.25 }, bgColor: '#fdf2f8', gridColor: 'rgba(236, 72, 153, 0.1)', foodColors: { triangle: '#f472b6', square: '#c084fc', hexagon: '#fb923c' } },
];

export const DAILY_REWARDS = [
  { day: 1, type: 'money' as const, amount: 50, label: '$50' },
  { day: 2, type: 'gems' as const, amount: 2, label: '2 Gems' },
  { day: 3, type: 'money' as const, amount: 200, label: '$200' },
  { day: 4, type: 'gems' as const, amount: 3, label: '3 Gems' },
  { day: 5, type: 'money' as const, amount: 800, label: '$800' },
  { day: 6, type: 'gems' as const, amount: 5, label: '5 Gems' },
  { day: 7, type: 'gems' as const, amount: 10, label: '10 Gems' },
];

export const STREAK_MULTIPLIERS = [1, 1.2, 1.5, 2, 2.5, 3, 5];

export interface BlobSkinDef {
  id: string;
  name: string;
  cost: number;
  colors: string[];
}

export const BLOB_SKINS: BlobSkinDef[] = [
  { id: 'default', name: 'Classic', cost: 0, colors: [] },
  { id: 'fire', name: 'Fire Blob', cost: 15, colors: ['#ef4444', '#f97316', '#eab308'] },
  { id: 'ice', name: 'Ice Blob', cost: 15, colors: ['#67e8f9', '#06b6d4', '#0ea5e9'] },
  { id: 'galaxy', name: 'Galaxy Blob', cost: 25, colors: ['#7c3aed', '#6366f1', '#818cf8'] },
  { id: 'golden', name: 'Golden Blob', cost: 30, colors: ['#eab308', '#f59e0b', '#fbbf24'] },
  { id: 'toxic', name: 'Toxic Blob', cost: 20, colors: ['#22c55e', '#84cc16', '#a3e635'] },
  { id: 'shadow', name: 'Shadow Blob', cost: 25, colors: ['#1e293b', '#334155', '#475569'] },
  { id: 'rainbow', name: 'Rainbow Blob', cost: 50, colors: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'] },
];

export type CosmeticRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type CosmeticCurrency = 'money' | 'gems';

export interface SpecialSkinDef {
  id: string;
  name: string;
  rarity: CosmeticRarity;
  currency: CosmeticCurrency;
  cost: number;
  description: string;
}

export interface BlobItemDef {
  id: string;
  name: string;
  rarity: CosmeticRarity;
  currency: CosmeticCurrency;
  cost: number;
  description: string;
}

export interface BlobFaceDef {
  id: string;
  name: string;
  rarity: CosmeticRarity;
  currency: CosmeticCurrency;
  cost: number;
  description: string;
}

export const SPECIAL_SKINS: SpecialSkinDef[] = [
  { id: 'lava_flow', name: 'Lava Flow', rarity: 'common', currency: 'money', cost: 5000, description: 'Animated lava with glowing cracks' },
  { id: 'ocean_depths', name: 'Ocean Depths', rarity: 'common', currency: 'money', cost: 8000, description: 'Pulsing wave rings on deep blue' },
  { id: 'pixel_blob', name: 'Pixel Blob', rarity: 'common', currency: 'money', cost: 12000, description: 'Retro checkerboard pattern' },
  { id: 'candy_swirl', name: 'Candy Swirl', rarity: 'rare', currency: 'gems', cost: 10, description: 'Spinning candy stripe colors' },
  { id: 'slime_king', name: 'Slime King', rarity: 'rare', currency: 'gems', cost: 12, description: 'Translucent green with dripping goo' },
  { id: 'cherry_blossom', name: 'Cherry Blossom', rarity: 'rare', currency: 'gems', cost: 15, description: 'Pink glow with orbiting petals' },
  { id: 'frozen_heart', name: 'Frozen Heart', rarity: 'rare', currency: 'gems', cost: 15, description: 'Ice blue with crystal crack lines' },
  { id: 'electric_storm', name: 'Electric Storm', rarity: 'epic', currency: 'gems', cost: 25, description: 'Cyan with animated lightning arcs' },
  { id: 'nebula', name: 'Nebula', rarity: 'epic', currency: 'gems', cost: 25, description: 'Deep space gradient with twinkling stars' },
  { id: 'magma_core', name: 'Magma Core', rarity: 'epic', currency: 'gems', cost: 30, description: 'Dark shell with glowing pulsing core' },
  { id: 'holographic', name: 'Holographic', rarity: 'epic', currency: 'gems', cost: 35, description: 'Shifting rainbow shimmer effect' },
  { id: 'crystal', name: 'Crystal', rarity: 'legendary', currency: 'gems', cost: 50, description: 'Faceted gem look with specular highlights' },
  { id: 'void_walker', name: 'Void Walker', rarity: 'legendary', currency: 'gems', cost: 50, description: 'Dark void with spiraling particles' },
  { id: 'dragon_scale', name: 'Dragon Scale', rarity: 'legendary', currency: 'gems', cost: 60, description: 'Gold-red scale pattern with fiery glow' },
  { id: 'disco_ball', name: 'Disco Ball', rarity: 'legendary', currency: 'gems', cost: 75, description: 'Mirror tiles with colored light rays' },
];

export const BLOB_ITEMS: BlobItemDef[] = [
  { id: 'red_bow_tie', name: 'Red Bow Tie', rarity: 'common', currency: 'money', cost: 3000, description: 'A dapper bow tie' },
  { id: 'flower', name: 'Daisy', rarity: 'common', currency: 'money', cost: 4000, description: 'A cheerful flower' },
  { id: 'party_hat', name: 'Party Hat', rarity: 'common', currency: 'money', cost: 5000, description: 'Party time!' },
  { id: 'scarf', name: 'Cozy Scarf', rarity: 'rare', currency: 'gems', cost: 8, description: 'Warm and stylish' },
  { id: 'headphones', name: 'Headphones', rarity: 'rare', currency: 'gems', cost: 10, description: 'Vibing to the beat' },
  { id: 'pirate_patch', name: 'Pirate Patch', rarity: 'rare', currency: 'gems', cost: 10, description: 'Arrr matey!' },
  { id: 'sunglasses', name: 'Cool Shades', rarity: 'rare', currency: 'gems', cost: 12, description: 'Too cool for school' },
  { id: 'ninja_bandana', name: 'Ninja Bandana', rarity: 'epic', currency: 'gems', cost: 20, description: 'Stealthy and swift' },
  { id: 'cape', name: 'Hero Cape', rarity: 'epic', currency: 'gems', cost: 20, description: 'Every blob needs a cape' },
  { id: 'crown', name: 'Royal Crown', rarity: 'epic', currency: 'gems', cost: 25, description: 'Fit for a king' },
  { id: 'monocle', name: "Gentleman's Monocle", rarity: 'epic', currency: 'gems', cost: 25, description: 'Quite distinguished' },
  { id: 'halo', name: 'Angel Halo', rarity: 'legendary', currency: 'gems', cost: 40, description: 'Heavenly glow' },
  { id: 'devil_horns', name: 'Devil Horns', rarity: 'legendary', currency: 'gems', cost: 40, description: 'A little mischievous' },
  { id: 'wizard_hat', name: 'Wizard Hat', rarity: 'legendary', currency: 'gems', cost: 50, description: 'Arcane power awaits' },
  { id: 'top_hat', name: 'Top Hat', rarity: 'legendary', currency: 'gems', cost: 60, description: 'The height of elegance' },
];

export const BLOB_FACES: BlobFaceDef[] = [
  { id: 'thick_brows', name: 'Thick Eyebrows', rarity: 'common', currency: 'money', cost: 2000, description: 'Bold and expressive' },
  { id: 'blush', name: 'Rosy Cheeks', rarity: 'common', currency: 'money', cost: 3000, description: 'Adorably blushing' },
  { id: 'freckles', name: 'Freckles', rarity: 'common', currency: 'money', cost: 3000, description: 'Sun-kissed dots' },
  { id: 'beauty_mark', name: 'Beauty Mark', rarity: 'common', currency: 'money', cost: 2000, description: 'A touch of glamour' },
  { id: 'handlebar', name: 'Handlebar Mustache', rarity: 'rare', currency: 'gems', cost: 8, description: 'Twirl-worthy stache' },
  { id: 'red_lips', name: 'Red Lipstick', rarity: 'rare', currency: 'gems', cost: 8, description: 'Bold red lips' },
  { id: 'long_lashes', name: 'Long Eyelashes', rarity: 'rare', currency: 'gems', cost: 10, description: 'Flutter those lashes' },
  { id: 'cat_whiskers', name: 'Cat Whiskers', rarity: 'rare', currency: 'gems', cost: 10, description: 'Nyaa~' },
  { id: 'anime_eyes', name: 'Anime Eyes', rarity: 'epic', currency: 'gems', cost: 20, description: 'Big sparkly anime eyes' },
  { id: 'star_eyes', name: 'Star Eyes', rarity: 'epic', currency: 'gems', cost: 22, description: 'Starry-eyed wonder' },
  { id: 'heart_eyes', name: 'Heart Eyes', rarity: 'epic', currency: 'gems', cost: 22, description: 'Love at first sight' },
  { id: 'goatee', name: 'Goatee', rarity: 'epic', currency: 'gems', cost: 18, description: 'Wise and rugged' },
  { id: 'full_beard', name: 'Full Beard', rarity: 'legendary', currency: 'gems', cost: 35, description: 'Majestic facial hair' },
  { id: 'cyclops', name: 'Cyclops', rarity: 'legendary', currency: 'gems', cost: 40, description: 'One eye to rule them all' },
  { id: 'wink_sparkle', name: 'Wink & Sparkle', rarity: 'legendary', currency: 'gems', cost: 45, description: 'Charming wink with sparkle' },
];

export const RARITY_COLORS: Record<CosmeticRarity, { bg: string; border: string; text: string; badge: string }> = {
  common: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-600', badge: 'bg-slate-200 text-slate-700' },
  rare: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', badge: 'bg-blue-200 text-blue-700' },
  epic: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', badge: 'bg-purple-200 text-purple-700' },
  legendary: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', badge: 'bg-amber-200 text-amber-800' },
};

export const GEM_SHOP_ITEMS = [
  { id: 'double_money', name: '2x Money', desc: 'Permanent 2x money multiplier', cost: 50, type: 'permanent' as const },
  { id: 'time_warp', name: 'Time Warp', desc: 'Earn 2 hours of offline income', cost: 10, type: 'consumable' as const },
  { id: 'instant_level', name: 'Skip Level', desc: 'Skip current level (1-star rewards)', cost: 15, type: 'consumable' as const },
];

export const LEVEL_MILESTONES = [5, 10, 15, 20, 25, 30, 40, 50, 75, 100];

export type SkillBranchId = 'hunt' | 'feast' | 'survival' | 'automation' | 'evolution';
export type SkillNodeType = 'minor' | 'trait' | 'mechanic' | 'conditional' | 'choice' | 'keystone' | 'gate';

export interface SkillNodeDef {
  id: string;
  title: string;
  shortDesc: string;
  branch: SkillBranchId;
  chapter: 1 | 2 | 3;
  type: SkillNodeType;
  cost: number;
  row: number;
  requires: string[];
  gateRequired?: 'gateA' | 'gateB';
  choiceGroup?: string;
  effects?: Partial<{
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
  }>;
}

export const SKILL_GATES = {
  gateA: {
    id: 'gateA',
    name: 'Evolution Gate A',
    desc: 'Requires 2 branch keystones',
    moneyBurstMultiplier: 120,
  },
  gateB: {
    id: 'gateB',
    name: 'Evolution Gate B',
    desc: 'All branches must reach chapter 2',
    moneyBurstMultiplier: 220,
  },
} as const;

export const SKILL_TREE_NODES: SkillNodeDef[] = [
  // ── Hunt branch ──  (2.5x escalation, minors at 0.75x breather)
  { id: 'hunt_swift',        title: 'Swift Legs',         shortDesc: '+15 speed',                    branch: 'hunt', chapter: 1, type: 'minor',    cost: 25,    row: 1, requires: [],                  effects: { speedFlat: 15 } },
  { id: 'hunt_pathing',      title: 'Predator Pathing',   shortDesc: 'Sharper chase movement',       branch: 'hunt', chapter: 1, type: 'trait',    cost: 100,   row: 2, requires: ['hunt_swift'],       effects: { speedFlat: 20 } },
  { id: 'hunt_dash_on_star', title: 'Star Dash',          shortDesc: 'Dash after star pickups',      branch: 'hunt', chapter: 1, type: 'mechanic', cost: 250,   row: 3, requires: ['hunt_pathing'],     effects: { starSpawnRateMult: 0.2, speedMult: 0.08 } },
  { id: 'hunt_keen',         title: 'Keen Senses',        shortDesc: '+6 suction range',             branch: 'hunt', chapter: 1, type: 'minor',    cost: 150,   row: 4, requires: ['hunt_dash_on_star'], effects: { suctionFlat: 6 } },
  { id: 'hunt_suction_cone', title: 'Gravitational Pull',  shortDesc: 'Expanded pull field and reduced item drag', branch: 'hunt', chapter: 1, type: 'mechanic', cost: 600,  row: 5, requires: ['hunt_keen'],         effects: { suctionFlat: 8, weightReduction: 0.4 } },
  { id: 'hunt_target_lock',  title: 'Target Lock',        shortDesc: 'Prioritize highest value items nearby', branch: 'hunt', chapter: 1, type: 'keystone', cost: 1500,  row: 6, requires: ['hunt_suction_cone'], effects: { valueMult: 0.08 } },
  { id: 'hunt_agile',        title: 'Agile Pursuit',      shortDesc: '+6% speed',                    branch: 'hunt', chapter: 2, type: 'minor',    cost: 3000,  row: 8, requires: ['hunt_target_lock'],  gateRequired: 'gateA', effects: { speedMult: 0.06 } },
  { id: 'hunt_vector_shift', title: 'Vector Shift',       shortDesc: 'Extra accel after turns',      branch: 'hunt', chapter: 2, type: 'mechanic', cost: 8000,  row: 9, requires: ['hunt_agile'],        gateRequired: 'gateA', effects: { speedMult: 0.14, suctionMult: 0.08 } },
  { id: 'hunt_chain_vacuum', title: 'Chain Vacuum',       shortDesc: 'Nearby food chains into pull',  branch: 'hunt', chapter: 2, type: 'mechanic', cost: 18000, row: 10, requires: ['hunt_vector_shift'], gateRequired: 'gateA', effects: { chainVacuumRadius: 70 } },
  { id: 'hunt_apex',         title: 'Apex Hunter',        shortDesc: 'Massive chase and pickup boost', branch: 'hunt', chapter: 3, type: 'keystone', cost: 80000, row: 12, requires: ['hunt_chain_vacuum'], gateRequired: 'gateB', effects: { speedMult: 0.28, suctionMult: 0.2, valueMult: 0.06 } },

  // ── Feast branch ──
  { id: 'feast_bites',       title: 'Bigger Bites',       shortDesc: '+2% food value',               branch: 'feast', chapter: 1, type: 'minor',    cost: 25,    row: 1, requires: [],                    effects: { valueMult: 0.02 } },
  { id: 'feast_combo_timer', title: 'Long Table',          shortDesc: 'Longer combo windows',          branch: 'feast', chapter: 1, type: 'trait',    cost: 100,   row: 2, requires: ['feast_bites'],        effects: { comboWindow: 0.35 } },
  { id: 'feast_combo_floor', title: 'Combo Floor',         shortDesc: 'Combo never drops below x2',   branch: 'feast', chapter: 1, type: 'mechanic', cost: 250,   row: 3, requires: ['feast_combo_timer'],  effects: { valueMult: 0.04 } },
  { id: 'feast_digest',      title: 'Quick Digestion',     shortDesc: '+0.15s combo window',           branch: 'feast', chapter: 1, type: 'minor',    cost: 150,   row: 4, requires: ['feast_combo_floor'],  effects: { comboWindow: 0.15 } },
  { id: 'feast_overkill',    title: 'Overkill Conversion', shortDesc: 'Overflow food grants cash',    branch: 'feast', chapter: 1, type: 'mechanic', cost: 600,  row: 5, requires: ['feast_digest'],       effects: { overkillCashRatio: 0.1 } },
  { id: 'feast_keystone',    title: 'Golden Appetite',     shortDesc: 'Combo cap raised + value spike', branch: 'feast', chapter: 1, type: 'keystone', cost: 1500,  row: 6, requires: ['feast_overkill'],    effects: { comboCap: 18, valueMult: 0.09 } },
  { id: 'feast_choice_cash', title: 'Cashout Burst',       shortDesc: 'Huge single-hit value spikes',  branch: 'feast', chapter: 2, type: 'choice',   cost: 8000,  row: 9, requires: ['feast_keystone'],    gateRequired: 'gateA', choiceGroup: 'feast_style', effects: { valueMult: 0.13 } },
  { id: 'feast_choice_chain', title: 'Infinite Chain',     shortDesc: 'Sustained combo power',         branch: 'feast', chapter: 2, type: 'choice',   cost: 8000,  row: 9, requires: ['feast_keystone'],    gateRequired: 'gateA', choiceGroup: 'feast_style', effects: { comboWindow: 0.75, comboCap: 24 } },
  { id: 'feast_apex',        title: 'Banquet Protocol',    shortDesc: 'Permanent combo economy',       branch: 'feast', chapter: 3, type: 'keystone', cost: 80000, row: 12, requires: ['feast_choice_cash', 'feast_choice_chain'], gateRequired: 'gateB', effects: { valueMult: 0.17, comboWindow: 0.6 } },

  // ── Survival branch ──
  { id: 'survival_skin',       title: 'Thick Skin',             shortDesc: '+20 max hunger',               branch: 'survival', chapter: 1, type: 'minor',       cost: 25,    row: 1, requires: [],                        effects: { hungerMaxFlat: 20 } },
  { id: 'survival_digestive',  title: 'Adaptive Digestion',     shortDesc: 'Lower hunger drain',           branch: 'survival', chapter: 1, type: 'trait',        cost: 100,   row: 2, requires: ['survival_skin'],          effects: { hungerDrainMult: -0.08 } },
  { id: 'survival_shield',     title: 'Starvation Shield',      shortDesc: 'Brief no-decay windows',       branch: 'survival', chapter: 1, type: 'mechanic',     cost: 250,   row: 3, requires: ['survival_digestive'],     effects: { frenzyShieldSeconds: 0.8 } },
  { id: 'survival_endurance',  title: 'Endurance',              shortDesc: '-4% hunger drain',              branch: 'survival', chapter: 1, type: 'minor',        cost: 150,   row: 4, requires: ['survival_shield'],        effects: { hungerDrainMult: -0.04 } },
  { id: 'survival_frenzy',     title: 'Low-Hunger Frenzy',      shortDesc: 'Speed/value boost when starving', branch: 'survival', chapter: 1, type: 'conditional', cost: 600,  row: 5, requires: ['survival_endurance'],     effects: { lowHungerThreshold: 0.3, lowHungerFrenzyMult: 0.3 } },
  { id: 'survival_keystone',   title: 'Last Stand Metabolism',  shortDesc: 'High hunger tank + frenzy',    branch: 'survival', chapter: 1, type: 'keystone',     cost: 1500,  row: 6, requires: ['survival_frenzy'],        effects: { hungerMaxFlat: 55, hungerDrainMult: -0.1 } },
  { id: 'survival_tradeoff',   title: 'Risk Reactor',           shortDesc: 'More risk, bigger frenzy',     branch: 'survival', chapter: 2, type: 'conditional',  cost: 8000,  row: 9, requires: ['survival_keystone'],      gateRequired: 'gateA', effects: { lowHungerFrenzyMult: 0.24, lowHungerThreshold: 0.4 } },
  { id: 'survival_reservoir',  title: 'Deep Reservoir',         shortDesc: 'Large hunger capacity',        branch: 'survival', chapter: 2, type: 'trait',        cost: 8000,  row: 9, requires: ['survival_keystone'],      gateRequired: 'gateA', effects: { hungerMaxFlat: 80 } },
  { id: 'survival_apex',       title: 'Immortal Core',          shortDesc: 'Late run stamina + economy',   branch: 'survival', chapter: 3, type: 'keystone',     cost: 80000, row: 12, requires: ['survival_tradeoff', 'survival_reservoir'], gateRequired: 'gateB', effects: { hungerDrainMult: -0.22, valueMult: 0.1 } },

  // ── Automation branch ──
  { id: 'auto_servo',          title: 'Basic Servo',        shortDesc: '+0.1 auto-tap rate',           branch: 'automation', chapter: 1, type: 'minor',    cost: 25,    row: 1, requires: [],                    effects: { autoTapRate: 0.1 } },
  { id: 'auto_tap_drone',      title: 'Tap Drone',          shortDesc: 'Passive tap food generation',  branch: 'automation', chapter: 1, type: 'mechanic', cost: 100,   row: 2, requires: ['auto_servo'],         effects: { autoTapRate: 0.25, tapValueMult: 0.2 } },
  { id: 'auto_tap_optimizer',  title: 'Efficient Systems',  shortDesc: 'Improved tap output and reduced hunger drain', branch: 'automation', chapter: 1, type: 'trait',    cost: 250,   row: 3, requires: ['auto_tap_drone'],     effects: { tapValueMult: 0.25, tapCooldownMult: -0.1, hungerDrainMult: -0.03 } },
  { id: 'auto_signal',         title: 'Proximity Sensors',  shortDesc: 'Slight suction expansion and tap boost', branch: 'automation', chapter: 1, type: 'minor',    cost: 150,   row: 4, requires: ['auto_tap_optimizer'], effects: { tapValueMult: 0.08, suctionFlat: 5 } },
  { id: 'auto_offline_core',   title: 'Offline Core',       shortDesc: 'Offline efficiency increase',  branch: 'automation', chapter: 1, type: 'mechanic', cost: 600,  row: 5, requires: ['auto_signal'],        effects: { offlineEfficiency: 0.15 } },
  { id: 'auto_keystone',       title: 'Autopilot Brain',    shortDesc: 'Supercharged auto-tap',        branch: 'automation', chapter: 1, type: 'keystone', cost: 1500,  row: 6, requires: ['auto_offline_core'],  effects: { autoTapRate: 0.5, offlineEfficiency: 0.1 } },
  { id: 'auto_choice_builder', title: 'Builder AI',         shortDesc: 'Tap efficiency focus',            branch: 'automation', chapter: 2, type: 'choice', cost: 8000,  row: 9, requires: ['auto_keystone'],     gateRequired: 'gateA', choiceGroup: 'auto_style', effects: { autoTapRate: 0.3, valueMult: 0.05 } },
  { id: 'auto_choice_farmer',  title: 'Magnetic Field',     shortDesc: 'Items across the level drift toward the blob', branch: 'automation', chapter: 2, type: 'choice',   cost: 8000,  row: 9, requires: ['auto_keystone'],     gateRequired: 'gateA', choiceGroup: 'auto_style', effects: { magnetRadius: 1.0, autoTapRate: 0.2 } },
  { id: 'auto_apex',           title: 'Singularity Ops',    shortDesc: 'Massive passive scaling',      branch: 'automation', chapter: 3, type: 'keystone', cost: 80000, row: 12, requires: ['auto_choice_builder', 'auto_choice_farmer'], gateRequired: 'gateB', effects: { offlineEfficiency: 0.2, autoTapRate: 0.8, magnetRadius: 0.5, suctionMult: 0.1 } },

  // ── Gates and Apex ──
  { id: 'gate_a_unlock',       title: 'Gate A',             shortDesc: '2 keystones required',         branch: 'evolution', chapter: 2, type: 'gate',     cost: 0,     row: 7,  requires: [] },
  { id: 'gate_b_unlock',       title: 'Gate B',             shortDesc: 'All branches at chapter 2',    branch: 'evolution', chapter: 3, type: 'gate',     cost: 0,     row: 11, requires: [] },
  { id: 'apex_transcendence',  title: 'Apex Transcendence', shortDesc: 'Cross-branch capstone',        branch: 'evolution', chapter: 3, type: 'keystone', cost: 250000, row: 13, requires: ['hunt_apex', 'feast_apex', 'survival_apex', 'auto_apex'], gateRequired: 'gateB', effects: { valueMult: 0.18, speedMult: 0.18, suctionMult: 0.18, offlineEfficiency: 0.15 } },
];

export const SKILL_NODE_LOOKUP = Object.fromEntries(
  SKILL_TREE_NODES.map((node) => [node.id, node])
) as Record<string, SkillNodeDef>;

export const SKILL_BRANCH_ORDER: SkillBranchId[] = ['hunt', 'feast', 'survival', 'automation'];

export const ACTIVE_ABILITIES = [
  { id: 'magnet', name: 'Magnet Pull',  desc: 'Pull all items toward blob',          icon: 'Magnet',    duration: 3, cooldown: 18, unlockLevel: 1  },
  { id: 'speed',  name: 'Speed Surge',  desc: '4x speed burst',                      icon: 'Zap',       duration: 4, cooldown: 18, unlockLevel: 1  },
  { id: 'size',   name: 'Size Boost',   desc: 'Double blob size and suction range',   icon: 'Maximize',  duration: 4, cooldown: 25, unlockLevel: 5  },
  { id: 'food',   name: 'Food Rain',    desc: 'Spawn food + restore hunger',          icon: 'CloudRain', duration: 0, cooldown: 30, unlockLevel: 10 },
] as const;

export type AbilityId = typeof ACTIVE_ABILITIES[number]['id'];

export const SKILL_BRANCH_LABELS: Record<SkillBranchId, string> = {
  hunt: 'Hunt',
  feast: 'Feast',
  survival: 'Survival',
  automation: 'Automation',
  evolution: 'Evolution Gate',
};

export function getStarterSkillNodesFromLegacy(upgrades: Record<string, number | undefined>): string[] {
  const branchSeeds: string[] = [];
  const oldTotals = {
    hunt: (upgrades.speed || 0) + (upgrades.suction || 0) + (upgrades.suctionStrength || 0),
    feast: (upgrades.spawnValue || 0) + (upgrades.spawnSynergy || 0),
    survival: (upgrades.hungerDrain || 0) + (upgrades.hungerMax || 0) + (upgrades.hungerSynergy || 0),
    automation: (upgrades.tapValue || 0) + (upgrades.tapCooldown || 0) + (upgrades.tapSynergy || 0) + (upgrades.spawnRate || 0) + (upgrades.boostSpawnRate || 0),
  };

  if (oldTotals.hunt >= 4) branchSeeds.push('hunt_pathing');
  if (oldTotals.feast >= 4) branchSeeds.push('feast_combo_timer');
  if (oldTotals.survival >= 4) branchSeeds.push('survival_digestive');
  if (oldTotals.automation >= 4) branchSeeds.push('auto_tap_drone');

  if (oldTotals.hunt >= 14) branchSeeds.push('hunt_dash_on_star');
  if (oldTotals.feast >= 14) branchSeeds.push('feast_combo_floor');
  if (oldTotals.survival >= 14) branchSeeds.push('survival_shield');
  if (oldTotals.automation >= 14) branchSeeds.push('auto_tap_optimizer');

  return branchSeeds;
}
