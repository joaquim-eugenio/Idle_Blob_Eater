export type StoreItemType = 'permanent_boost' | 'consumable' | 'iap_pack' | 'gem_pack' | 'bundle';
export type StoreCurrency = 'gems' | 'real_money';

export interface PermanentBoostDef {
  id: string;
  name: string;
  desc: string;
  cost: number;
  currency: StoreCurrency;
  priceLabel: string;
  icon: string;
}

export interface ConsumableDef {
  id: string;
  name: string;
  desc: string;
  cost: number;
  icon: string;
}

export interface GemPackDef {
  id: string;
  name: string;
  gems: number;
  bonus: number;
  price: string;
  priceValue: number;
  badge?: string;
}

export interface IAPPackDef {
  id: string;
  name: string;
  desc: string;
  price: string;
  priceValue: number;
  badge?: string;
  oneTime: boolean;
  unlockCondition?: { type: 'level' | 'prestige'; value: number };
  contents: string[];
  rewards: {
    gems?: number;
    money?: number;
    essence?: number;
    skinId?: string;
    noInterstitialAds?: boolean;
    offlineBoost24h?: boolean;
  };
}

export interface BundleDef {
  id: string;
  name: string;
  desc: string;
  cost: number;
  currency: StoreCurrency;
  priceLabel: string;
  badge?: string;
  oneTime: boolean;
  weekendOnly?: boolean;
  savings: string;
  contents: string[];
  rewards: {
    gems?: number;
    money?: number;
    consumables?: Record<string, number>;
    randomCosmetic?: { minRarity: 'common' | 'rare' | 'epic' | 'legendary' };
    skinId?: string;
  };
}

export interface TimedBoostDef {
  id: string;
  consumableId: string;
  durationMs: number;
  moneyMult?: number;
}

// ── Featured Packs (IAP) ──

export const FEATURED_PACKS: IAPPackDef[] = [
  {
    id: 'first_bite_pack',
    name: 'First Bite Pack',
    desc: 'The ultimate starter meal — no more annoying ads, plus a fat stack of goodies!',
    price: '$2.99',
    priceValue: 2.99,
    badge: 'BEST VALUE',
    oneTime: true,
    contents: ['No Forced Ads', '50 Gems', '$5,000', '20 Essence', '"Golden Belly" Skin', '2x Offline (24h)'],
    rewards: { gems: 50, money: 5000, essence: 20, skinId: 'golden_belly_vip', noInterstitialAds: true, offlineBoost24h: true },
  },
];

export const MILESTONE_PACKS: IAPPackDef[] = [
  {
    id: 'snack_break',
    name: 'Snack Break',
    desc: 'A tasty little treat to fuel your adventure!',
    price: '$1.99',
    priceValue: 1.99,
    badge: 'NEW!',
    oneTime: true,
    unlockCondition: { type: 'level', value: 10 },
    contents: ['25 Gems', '$3,000', '1 Random Rare Skin'],
    rewards: { gems: 25, money: 3000 },
  },
  {
    id: 'lunch_rush',
    name: 'Lunch Rush',
    desc: 'The mid-game power lunch your blob deserves!',
    price: '$2.99',
    priceValue: 2.99,
    badge: 'NEW!',
    oneTime: true,
    unlockCondition: { type: 'level', value: 25 },
    contents: ['50 Gems', '$15,000', '15 Essence'],
    rewards: { gems: 50, money: 15000, essence: 15 },
  },
  {
    id: 'all_you_can_eat',
    name: 'All-You-Can-Eat',
    desc: 'Unlimited plate, unlimited power. Dig in!',
    price: '$4.99',
    priceValue: 4.99,
    badge: 'NEW!',
    oneTime: true,
    unlockCondition: { type: 'level', value: 50 },
    contents: ['100 Gems', '$50,000', '30 Essence', '1 Legendary Cosmetic'],
    rewards: { gems: 100, money: 50000, essence: 30 },
  },
  {
    id: 'reborn_and_hungry',
    name: 'Reborn & Hungry',
    desc: 'Back from prestige and hungrier than ever!',
    price: '$3.99',
    priceValue: 3.99,
    badge: 'NEW!',
    oneTime: true,
    unlockCondition: { type: 'prestige', value: 1 },
    contents: ['80 Gems', '50 Essence', 'Exclusive Prestige Skin'],
    rewards: { gems: 80, essence: 50, skinId: 'prestige_aura' },
  },
];

// ── Gem Packs (Real Money) ──

export const GEM_PACKS: GemPackDef[] = [
  { id: 'gem_nibble',      name: 'Gem Nibble',     gems: 10,  bonus: 0,   price: '$0.99',  priceValue: 0.99 },
  { id: 'gem_snack',       name: 'Gem Snack',      gems: 30,  bonus: 5,   price: '$1.99',  priceValue: 1.99,  badge: 'POPULAR' },
  { id: 'gem_feast',       name: 'Gem Feast',       gems: 80,  bonus: 20,  price: '$4.99',  priceValue: 4.99,  badge: 'BEST VALUE' },
  { id: 'gem_buffet',      name: 'Gem Buffet',      gems: 200, bonus: 80,  price: '$9.99',  priceValue: 9.99,  badge: '+40% BONUS' },
  { id: 'gem_food_court',  name: 'Gem Food Court',  gems: 500, bonus: 250, price: '$19.99', priceValue: 19.99, badge: '+50% BONUS' },
];

// ── Permanent Boosts (Gem-priced) ──

export const PERMANENT_BOOSTS: PermanentBoostDef[] = [
  { id: 'double_digest',  name: 'Double Digest',  desc: 'Permanently double all money income',       cost: 50, currency: 'gems', priceLabel: '50', icon: 'coin' },
  { id: 'sleep_eating',   name: 'Sleep Eating',   desc: 'Double offline & welcome-back earnings',    cost: 40, currency: 'gems', priceLabel: '40', icon: 'clock' },
  { id: 'sticky_tongue',  name: 'Sticky Tongue',  desc: 'Permanently increase suction radius +50%',  cost: 35, currency: 'gems', priceLabel: '35', icon: 'magnet' },
  { id: 'extra_stomach',  name: 'Extra Stomach',  desc: '+1 max charge on all abilities',             cost: 45, currency: 'gems', priceLabel: '45', icon: 'bolt' },
  { id: 'phoenix_belch',  name: 'Phoenix Belch',  desc: 'Revive without watching ads — just burp!',  cost: 60, currency: 'gems', priceLabel: '60', icon: 'fire' },
];

// ── Real-Money Permanent Boosts ──

export const IAP_BOOSTS: PermanentBoostDef[] = [
  { id: 'turbo_tummy',    name: 'Turbo Tummy',    desc: 'Permanent +25% blob speed',                         cost: 1.99, currency: 'real_money', priceLabel: '$1.99', icon: 'bolt' },
  { id: 'golden_gut',     name: 'Golden Gut',     desc: 'Permanent +30% money from all sources',             cost: 2.99, currency: 'real_money', priceLabel: '$2.99', icon: 'coin' },
  { id: 'deep_food_coma', name: 'Deep Food Coma', desc: 'Offline cap raised from 8h to 16h',                 cost: 1.99, currency: 'real_money', priceLabel: '$1.99', icon: 'clock' },
  { id: 'blob_vacuum',    name: 'Blob Vacuum',    desc: 'Items within range auto-collected (passive suction)', cost: 3.99, currency: 'real_money', priceLabel: '$3.99', icon: 'magnet' },
];

// ── Consumable Items (Gem-priced) ──

export const CONSUMABLES: ConsumableDef[] = [
  { id: 'power_nap',       name: 'Power Nap',       desc: 'Earn 2 hours of offline income instantly', cost: 10, icon: 'clock' },
  { id: 'gulp_and_go',     name: 'Gulp & Go',       desc: 'Skip current level (1-star rewards)',       cost: 15, icon: 'bolt' },
  { id: 'spicy_meal',      name: 'Spicy Meal',      desc: '2x essence on your next prestige',          cost: 20, icon: 'fire' },
  { id: 'feeding_frenzy',  name: 'Feeding Frenzy',  desc: '3x money for 30 minutes',                   cost: 8,  icon: 'star' },
  { id: 'big_burp',        name: 'Big Burp',        desc: 'Instantly refill all ability charges',       cost: 5,  icon: 'bolt' },
];

// ── Timed Boost Definitions ──

export const TIMED_BOOSTS: TimedBoostDef[] = [
  { id: 'feeding_frenzy_active', consumableId: 'feeding_frenzy', durationMs: 30 * 60 * 1000, moneyMult: 3 },
];

// ── Bundles ──

export const GEM_BUNDLES: BundleDef[] = [
  {
    id: 'snack_pack',
    name: 'Snack Pack',
    desc: '3x Power Nap + 2x Feeding Frenzy + $2,000',
    cost: 75,
    currency: 'gems',
    priceLabel: '75',
    savings: 'Save 25%',
    oneTime: false,
    contents: ['3x Power Nap', '2x Feeding Frenzy', '$2,000'],
    rewards: { money: 2000, consumables: { power_nap: 3, feeding_frenzy: 2 } },
  },
  {
    id: 'rebirth_feast',
    name: 'Rebirth Feast',
    desc: '3x Spicy Meal + 2x Power Nap + $5,000',
    cost: 100,
    currency: 'gems',
    priceLabel: '100',
    savings: 'Save 30%',
    oneTime: false,
    contents: ['3x Spicy Meal', '2x Power Nap', '$5,000'],
    rewards: { money: 5000, consumables: { spicy_meal: 3, power_nap: 2 } },
  },
  {
    id: 'mystery_munch_box',
    name: 'Mystery Munch Box',
    desc: '1 random rare+ skin, face, or item',
    cost: 40,
    currency: 'gems',
    priceLabel: '40',
    savings: '???',
    oneTime: false,
    contents: ['1 Random Rare+ Cosmetic'],
    rewards: { randomCosmetic: { minRarity: 'rare' } },
  },
];

export const IAP_BUNDLES: BundleDef[] = [
  {
    id: 'weekend_binge',
    name: 'Weekend Binge',
    desc: '30 Gems + 2x Power Nap + $3,000',
    cost: 1.99,
    currency: 'real_money',
    priceLabel: '$1.99',
    savings: 'Save 35%',
    oneTime: false,
    weekendOnly: true,
    contents: ['30 Gems', '2x Power Nap', '$3,000'],
    rewards: { gems: 30, money: 3000, consumables: { power_nap: 2 } },
  },
  {
    id: 'blobs_banquet',
    name: "Blob's Banquet",
    desc: '150 Gems + Exclusive Skin + $25,000 + 2x Feeding Frenzy',
    cost: 6.99,
    currency: 'real_money',
    priceLabel: '$6.99',
    badge: 'BEST VALUE',
    savings: 'Save 40%',
    oneTime: true,
    contents: ['150 Gems', 'Exclusive Legendary Skin', '$25,000', '2x Feeding Frenzy'],
    rewards: { gems: 150, money: 25000, skinId: 'banquet_blob', consumables: { feeding_frenzy: 2 } },
  },
];

// ── Free Gift Rewards ──

export interface FreeGiftReward {
  type: 'money' | 'gems' | 'consumable';
  amount: number;
  label: string;
  consumableId?: string;
}

export const FREE_GIFT_COOLDOWN_MS = 4 * 60 * 60 * 1000; // 4 hours
export const FREE_GIFT_MAX_DAILY = 3;

export const FREE_GIFT_POOL: FreeGiftReward[] = [
  { type: 'money', amount: 100, label: '$100' },
  { type: 'money', amount: 200, label: '$200' },
  { type: 'money', amount: 500, label: '$500' },
  { type: 'gems', amount: 1, label: '1 Gem' },
  { type: 'gems', amount: 2, label: '2 Gems' },
  { type: 'gems', amount: 3, label: '3 Gems' },
  { type: 'consumable', amount: 1, label: 'Power Nap', consumableId: 'power_nap' },
  { type: 'consumable', amount: 1, label: 'Big Burp', consumableId: 'big_burp' },
];

// ── Daily Deal Pool ──

export interface DailyDealDef {
  itemId: string;
  itemType: 'consumable' | 'permanent_boost';
  originalCost: number;
  dealCost: number;
  name: string;
  desc: string;
}

export const DAILY_DEAL_POOL: DailyDealDef[] = [
  { itemId: 'power_nap',      itemType: 'consumable',      originalCost: 10, dealCost: 5,  name: 'Power Nap',      desc: '2 hours of offline income' },
  { itemId: 'gulp_and_go',    itemType: 'consumable',      originalCost: 15, dealCost: 8,  name: 'Gulp & Go',      desc: 'Skip current level' },
  { itemId: 'feeding_frenzy', itemType: 'consumable',      originalCost: 8,  dealCost: 4,  name: 'Feeding Frenzy', desc: '3x money for 30 min' },
  { itemId: 'big_burp',       itemType: 'consumable',      originalCost: 5,  dealCost: 3,  name: 'Big Burp',       desc: 'Refill all abilities' },
  { itemId: 'spicy_meal',     itemType: 'consumable',      originalCost: 20, dealCost: 10, name: 'Spicy Meal',     desc: '2x essence on next prestige' },
];

export function getDailyDealForDate(dateStr: string): DailyDealDef {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) | 0;
  }
  const idx = Math.abs(hash) % DAILY_DEAL_POOL.length;
  return DAILY_DEAL_POOL[idx];
}

// ── Lookup helpers ──

export const ALL_PERMANENT_BOOSTS = [...PERMANENT_BOOSTS, ...IAP_BOOSTS];
export const ALL_PACKS = [...FEATURED_PACKS, ...MILESTONE_PACKS];

export function getConsumable(id: string): ConsumableDef | undefined {
  return CONSUMABLES.find(c => c.id === id);
}

export function getPermanentBoost(id: string): PermanentBoostDef | undefined {
  return ALL_PERMANENT_BOOSTS.find(b => b.id === id);
}

export function getTimedBoostForConsumable(consumableId: string): TimedBoostDef | undefined {
  return TIMED_BOOSTS.find(t => t.consumableId === consumableId);
}
