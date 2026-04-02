import { type WorldId, getItemsForWorld } from './itemCatalog';

export interface WorldDef {
  id: WorldId;
  name: string;
  levelRange: [number, number]; // [minLevel, maxLevel] — maxLevel = Infinity for last world
  bgColor: string;
  gridColor: string;
  palette: string[]; // 3 colors used for items in this world
  blobScale: number; // base visual scale of the blob in this world
}

export const WORLDS: WorldDef[] = [
  { id: 'crumbs',       name: 'Crumbs',       levelRange: [1, 5],      bgColor: '#f8fafc', gridColor: 'rgba(200,200,200,0.15)', palette: ['#4ade80', '#facc15', '#f87171'], blobScale: 1 },
  { id: 'desk_drawer',  name: 'Desk Drawer',  levelRange: [6, 15],     bgColor: '#fef3c7', gridColor: 'rgba(180,140,60,0.1)',   palette: ['#a8a29e', '#78716c', '#d6d3d1'], blobScale: 1.6 },
  { id: 'backpack',     name: 'Backpack',     levelRange: [16, 30],    bgColor: '#eff6ff', gridColor: 'rgba(59,130,246,0.1)',   palette: ['#3b82f6', '#60a5fa', '#1e40af'], blobScale: 2.4 },
  { id: 'room',         name: 'Room',         levelRange: [31, 50],    bgColor: '#fdf2f8', gridColor: 'rgba(236,72,153,0.08)',  palette: ['#f472b6', '#ec4899', '#be185d'], blobScale: 3.4 },
  { id: 'house',        name: 'House',        levelRange: [51, 75],    bgColor: '#f0fdf4', gridColor: 'rgba(34,197,94,0.08)',   palette: ['#22c55e', '#16a34a', '#166534'], blobScale: 4.6 },
  { id: 'warehouse',    name: 'Warehouse',    levelRange: [76, 100],   bgColor: '#f5f5f4', gridColor: 'rgba(120,113,108,0.1)', palette: ['#78716c', '#57534e', '#a8a29e'], blobScale: 6.0 },
  { id: 'outdoors',     name: 'Outdoors',     levelRange: [101, Infinity], bgColor: '#ecfdf5', gridColor: 'rgba(16,185,129,0.08)', palette: ['#10b981', '#059669', '#047857'], blobScale: 8.0 },
];

export const WORLD_LOOKUP: Record<WorldId, WorldDef> = Object.fromEntries(
  WORLDS.map(w => [w.id, w])
) as Record<WorldId, WorldDef>;

export function getWorldForLevel(level: number): WorldDef {
  for (const w of WORLDS) {
    if (level >= w.levelRange[0] && level <= w.levelRange[1]) return w;
  }
  return WORLDS[WORLDS.length - 1];
}

export interface LevelDef {
  level: number;
  name: string;
  world: WorldId;
  items: { itemId: string; count: number }[];
  totalItems: number;
  starThresholds: [number, number, number]; // seconds for 3-star, 2-star, 1-star
  rewards: { money: number; essence?: number; gems?: number };
}

const HANDCRAFTED_LEVELS: LevelDef[] = [
  // ── World 1: Crumbs (8 → 20 items) ──
  {
    level: 1, name: 'First Crumbs', world: 'crumbs',
    items: [{ itemId: 'triangle', count: 4 }, { itemId: 'circle', count: 4 }],
    totalItems: 8,
    starThresholds: [12, 20, 32],
    rewards: { money: 5 },
  },
  {
    level: 2, name: 'Scattered Shapes', world: 'crumbs',
    items: [{ itemId: 'triangle', count: 4 }, { itemId: 'square', count: 3 }, { itemId: 'circle', count: 3 }],
    totalItems: 10,
    starThresholds: [14, 24, 38],
    rewards: { money: 8 },
  },
  {
    level: 3, name: 'Geometry Snack', world: 'crumbs',
    items: [{ itemId: 'triangle', count: 3 }, { itemId: 'square', count: 3 }, { itemId: 'hexagon', count: 3 }, { itemId: 'diamond', count: 4 }],
    totalItems: 13,
    starThresholds: [17, 30, 48],
    rewards: { money: 14 },
  },
  {
    level: 4, name: 'Shape Buffet', world: 'crumbs',
    items: [{ itemId: 'triangle', count: 3 }, { itemId: 'square', count: 3 }, { itemId: 'hexagon', count: 3 }, { itemId: 'pentagon', count: 3 }, { itemId: 'cross', count: 2 }, { itemId: 'diamond', count: 2 }],
    totalItems: 16,
    starThresholds: [20, 36, 56],
    rewards: { money: 20 },
  },
  {
    level: 5, name: 'Crumb Feast', world: 'crumbs',
    items: [{ itemId: 'triangle', count: 4 }, { itemId: 'square', count: 4 }, { itemId: 'hexagon', count: 3 }, { itemId: 'diamond', count: 3 }, { itemId: 'crescent', count: 3 }, { itemId: 'pentagon', count: 2 }, { itemId: 'cross', count: 1 }],
    totalItems: 20,
    starThresholds: [24, 42, 66],
    rewards: { money: 30, gems: 1 },
  },

  // ── World 2: Desk Drawer (22 → 58 items) ──
  {
    level: 6, name: 'Opening the Drawer', world: 'desk_drawer',
    items: [{ itemId: 'paperclip', count: 6 }, { itemId: 'eraser', count: 6 }, { itemId: 'button', count: 5 }, { itemId: 'candy', count: 5 }],
    totalItems: 22,
    starThresholds: [26, 46, 72],
    rewards: { money: 38 },
  },
  {
    level: 7, name: 'Loose Change', world: 'desk_drawer',
    items: [{ itemId: 'coin', count: 6 }, { itemId: 'button', count: 5 }, { itemId: 'paperclip', count: 5 }, { itemId: 'eraser', count: 5 }, { itemId: 'screw', count: 4 }],
    totalItems: 25,
    starThresholds: [28, 50, 80],
    rewards: { money: 48 },
  },
  {
    level: 8, name: 'Junk Collection', world: 'desk_drawer',
    items: [{ itemId: 'screw', count: 5 }, { itemId: 'marble', count: 5 }, { itemId: 'candy', count: 5 }, { itemId: 'button', count: 5 }, { itemId: 'coin', count: 4 }, { itemId: 'dice', count: 4 }],
    totalItems: 28,
    starThresholds: [30, 54, 86],
    rewards: { money: 58 },
  },
  {
    level: 9, name: 'Trinket Pile', world: 'desk_drawer',
    items: [{ itemId: 'dice', count: 6 }, { itemId: 'coin', count: 6 }, { itemId: 'candy', count: 5 }, { itemId: 'marble', count: 5 }, { itemId: 'eraser', count: 5 }, { itemId: 'screw', count: 5 }],
    totalItems: 32,
    starThresholds: [34, 60, 96],
    rewards: { money: 72 },
  },
  {
    level: 10, name: 'Drawer Clean-Out', world: 'desk_drawer',
    items: [{ itemId: 'paperclip', count: 6 }, { itemId: 'coin', count: 6 }, { itemId: 'dice', count: 6 }, { itemId: 'screw', count: 6 }, { itemId: 'candy', count: 5 }, { itemId: 'marble', count: 5 }, { itemId: 'eraser', count: 4 }],
    totalItems: 38,
    starThresholds: [38, 68, 108],
    rewards: { money: 90, gems: 2 },
  },

  // ── Desk Drawer continued ──
  {
    level: 11, name: 'Desk Sweep', world: 'desk_drawer',
    items: [{ itemId: 'eraser', count: 7 }, { itemId: 'screw', count: 7 }, { itemId: 'button', count: 7 }, { itemId: 'paperclip', count: 6 }, { itemId: 'candy', count: 6 }, { itemId: 'marble', count: 4 }, { itemId: 'coin', count: 3 }],
    totalItems: 40,
    starThresholds: [40, 70, 112],
    rewards: { money: 105 },
  },
  {
    level: 12, name: 'Marble Madness', world: 'desk_drawer',
    items: [{ itemId: 'marble', count: 8 }, { itemId: 'dice', count: 7 }, { itemId: 'coin', count: 7 }, { itemId: 'button', count: 7 }, { itemId: 'candy', count: 7 }, { itemId: 'screw', count: 7 }],
    totalItems: 43,
    starThresholds: [42, 74, 118],
    rewards: { money: 120 },
  },
  {
    level: 13, name: 'Tiny Treasures', world: 'desk_drawer',
    items: [{ itemId: 'coin', count: 8 }, { itemId: 'dice', count: 8 }, { itemId: 'marble', count: 8 }, { itemId: 'candy', count: 7 }, { itemId: 'screw', count: 7 }, { itemId: 'eraser', count: 4 }, { itemId: 'button', count: 4 }],
    totalItems: 46,
    starThresholds: [44, 78, 124],
    rewards: { money: 135 },
  },
  {
    level: 14, name: 'Full Drawer', world: 'desk_drawer',
    items: [{ itemId: 'paperclip', count: 8 }, { itemId: 'button', count: 8 }, { itemId: 'coin', count: 8 }, { itemId: 'eraser', count: 7 }, { itemId: 'marble', count: 7 }, { itemId: 'dice', count: 6 }, { itemId: 'screw', count: 6 }],
    totalItems: 50,
    starThresholds: [46, 82, 132],
    rewards: { money: 155 },
  },
  {
    level: 15, name: 'Drawer Boss', world: 'desk_drawer',
    items: [{ itemId: 'coin', count: 9 }, { itemId: 'marble', count: 9 }, { itemId: 'dice', count: 8 }, { itemId: 'screw', count: 8 }, { itemId: 'candy', count: 8 }, { itemId: 'paperclip', count: 8 }, { itemId: 'button', count: 5 }, { itemId: 'eraser', count: 3 }],
    totalItems: 58,
    starThresholds: [52, 92, 148],
    rewards: { money: 185, gems: 3 },
  },

  // ── World 3: Backpack (55 → 75 items) ──
  {
    level: 16, name: 'Unzipped', world: 'backpack',
    items: [{ itemId: 'pen', count: 10 }, { itemId: 'key', count: 9 }, { itemId: 'apple', count: 9 }, { itemId: 'usb_drive', count: 9 }, { itemId: 'glasses', count: 9 }, { itemId: 'remote', count: 9 }],
    totalItems: 55,
    starThresholds: [48, 86, 138],
    rewards: { money: 200, essence: 1 },
  },
  {
    level: 17, name: 'Pocket Stuff', world: 'backpack',
    items: [{ itemId: 'usb_drive', count: 10 }, { itemId: 'glasses', count: 10 }, { itemId: 'pen', count: 10 }, { itemId: 'apple', count: 10 }, { itemId: 'key', count: 9 }, { itemId: 'remote', count: 9 }],
    totalItems: 58,
    starThresholds: [50, 90, 144],
    rewards: { money: 225 },
  },
  {
    level: 18, name: 'School Supplies', world: 'backpack',
    items: [{ itemId: 'pen', count: 11 }, { itemId: 'wallet', count: 10 }, { itemId: 'apple', count: 10 }, { itemId: 'remote', count: 10 }, { itemId: 'key', count: 10 }, { itemId: 'mug', count: 5 }, { itemId: 'glasses', count: 6 }],
    totalItems: 62,
    starThresholds: [52, 94, 150],
    rewards: { money: 255 },
  },
  {
    level: 19, name: 'Deep Pockets', world: 'backpack',
    items: [{ itemId: 'wallet', count: 11 }, { itemId: 'mug', count: 10 }, { itemId: 'glasses', count: 10 }, { itemId: 'usb_drive', count: 10 }, { itemId: 'remote', count: 9 }, { itemId: 'key', count: 8 }, { itemId: 'pen', count: 8 }],
    totalItems: 66,
    starThresholds: [54, 98, 156],
    rewards: { money: 285 },
  },
  {
    level: 20, name: 'Backpack Raid', world: 'backpack',
    items: [{ itemId: 'pen', count: 12 }, { itemId: 'apple', count: 11 }, { itemId: 'mug', count: 11 }, { itemId: 'wallet', count: 11 }, { itemId: 'glasses', count: 10 }, { itemId: 'remote', count: 10 }, { itemId: 'usb_drive', count: 5 }, { itemId: 'key', count: 5 }],
    totalItems: 75,
    starThresholds: [60, 106, 170],
    rewards: { money: 330, gems: 3 },
  },
];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export function generateLevel(levelNum: number): LevelDef {
  const world = getWorldForLevel(levelNum);
  const pool = getItemsForWorld(world.id);
  if (pool.length === 0) return generateLevel(levelNum - 1);

  const rng = seededRandom(levelNum * 7919 + 31);

  let totalItems = Math.floor(5 + levelNum * 2.8 + Math.pow(levelNum, 1.5) * 0.12);

  const isWorldBoss = Number.isFinite(world.levelRange[1]) && world.levelRange[1] === levelNum;
  const isMilestone10 = levelNum % 10 === 0;
  const isMilestone5 = levelNum % 5 === 0;
  if (isWorldBoss) totalItems = Math.floor(totalItems * 1.25);
  else if (isMilestone10) totalItems = Math.floor(totalItems * 1.15);
  else if (isMilestone5) totalItems = Math.floor(totalItems * 1.10);

  const items: { itemId: string; count: number }[] = [];
  let remaining = totalItems;
  const shuffled = [...pool].sort(() => rng() - 0.5);
  const numTypes = Math.min(shuffled.length, 3 + Math.floor(rng() * Math.min(shuffled.length - 2, 4)));

  for (let i = 0; i < numTypes && remaining > 0; i++) {
    const isLast = i === numTypes - 1;
    const count = isLast ? remaining : Math.max(1, Math.floor(remaining / (numTypes - i) * (0.6 + rng() * 0.8)));
    items.push({ itemId: shuffled[i].id, count: Math.min(count, remaining) });
    remaining -= items[items.length - 1].count;
  }
  if (remaining > 0) {
    items[items.length - 1].count += remaining;
  }

  const ipsBase = 0.5 + levelNum * 0.008;
  const baseTime = totalItems / ipsBase;
  const starThresholds: [number, number, number] = [
    Math.floor(baseTime * 0.7),
    Math.floor(baseTime * 1.2),
    Math.floor(baseTime * 2.0),
  ];

  const baseMoney = Math.floor(5 * Math.pow(1.10, levelNum - 1) + totalItems * 0.8);
  const isMilestone = levelNum % 10 === 0;
  const isWorldStart = world.levelRange[0] === levelNum;

  const rewards: { money: number; essence?: number; gems?: number } = {
    money: baseMoney,
  };
  if (isMilestone) {
    rewards.gems = Math.floor(2 + levelNum / 20);
  }
  if (isWorldStart || levelNum % 25 === 0) {
    rewards.essence = Math.floor(1 + levelNum / 30);
  }

  const worldIndex = WORLDS.indexOf(world);
  const names = [
    `${world.name} ${levelNum - world.levelRange[0] + 1}`,
    `${world.name} Sweep`,
    `${world.name} Rush`,
    `Deep ${world.name}`,
    `${world.name} Feast`,
    `${world.name} Blitz`,
  ];
  const name = names[Math.floor(rng() * names.length)];

  return {
    level: levelNum,
    name,
    world: world.id,
    items,
    totalItems,
    starThresholds,
    rewards,
  };
}

export function getLevel(levelNum: number): LevelDef {
  const handcrafted = HANDCRAFTED_LEVELS.find(l => l.level === levelNum);
  if (handcrafted) return handcrafted;
  return generateLevel(levelNum);
}

export function getLevelRewardSummary(levelNum: number): string {
  const def = getLevel(levelNum);
  const parts: string[] = [`$${def.rewards.money}`];
  if (def.rewards.gems) parts.push(`${def.rewards.gems} Gems`);
  if (def.rewards.essence) parts.push(`${def.rewards.essence} Essence`);
  return parts.join(' + ');
}
