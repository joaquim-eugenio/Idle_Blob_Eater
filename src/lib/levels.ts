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
  // ── World 1: Crumbs ──
  {
    level: 1, name: 'First Crumbs', world: 'crumbs',
    items: [{ itemId: 'triangle', count: 4 }, { itemId: 'circle', count: 4 }],
    totalItems: 8,
    starThresholds: [25, 50, 90],
    rewards: { money: 10 },
  },
  {
    level: 2, name: 'Scattered Shapes', world: 'crumbs',
    items: [{ itemId: 'triangle', count: 4 }, { itemId: 'square', count: 4 }, { itemId: 'circle', count: 2 }],
    totalItems: 10,
    starThresholds: [30, 60, 105],
    rewards: { money: 18 },
  },
  {
    level: 3, name: 'Geometry Snack', world: 'crumbs',
    items: [{ itemId: 'triangle', count: 3 }, { itemId: 'square', count: 3 }, { itemId: 'hexagon', count: 3 }, { itemId: 'diamond', count: 3 }],
    totalItems: 12,
    starThresholds: [35, 65, 115],
    rewards: { money: 30 },
  },
  {
    level: 4, name: 'Shape Buffet', world: 'crumbs',
    items: [{ itemId: 'triangle', count: 4 }, { itemId: 'square', count: 3 }, { itemId: 'hexagon', count: 3 }, { itemId: 'pentagon', count: 3 }, { itemId: 'cross', count: 2 }],
    totalItems: 15,
    starThresholds: [40, 75, 130],
    rewards: { money: 45 },
  },
  {
    level: 5, name: 'Crumb Feast', world: 'crumbs',
    items: [{ itemId: 'triangle', count: 4 }, { itemId: 'square', count: 4 }, { itemId: 'hexagon', count: 3 }, { itemId: 'diamond', count: 3 }, { itemId: 'crescent', count: 3 }, { itemId: 'pentagon', count: 1 }],
    totalItems: 18,
    starThresholds: [50, 90, 155],
    rewards: { money: 65, gems: 1 },
  },

  // ── World 2: Desk Drawer ──
  {
    level: 6, name: 'Opening the Drawer', world: 'desk_drawer',
    items: [{ itemId: 'paperclip', count: 4 }, { itemId: 'eraser', count: 4 }],
    totalItems: 8,
    starThresholds: [30, 60, 110],
    rewards: { money: 80 },
  },
  {
    level: 7, name: 'Loose Change', world: 'desk_drawer',
    items: [{ itemId: 'coin', count: 3 }, { itemId: 'button', count: 3 }, { itemId: 'paperclip', count: 3 }],
    totalItems: 9,
    starThresholds: [35, 65, 115],
    rewards: { money: 100 },
  },
  {
    level: 8, name: 'Junk Collection', world: 'desk_drawer',
    items: [{ itemId: 'screw', count: 3 }, { itemId: 'marble', count: 3 }, { itemId: 'candy', count: 3 }, { itemId: 'button', count: 2 }],
    totalItems: 11,
    starThresholds: [40, 75, 130],
    rewards: { money: 130 },
  },
  {
    level: 9, name: 'Trinket Pile', world: 'desk_drawer',
    items: [{ itemId: 'dice', count: 3 }, { itemId: 'coin', count: 3 }, { itemId: 'candy', count: 3 }, { itemId: 'marble', count: 2 }, { itemId: 'eraser', count: 2 }],
    totalItems: 13,
    starThresholds: [45, 80, 140],
    rewards: { money: 160 },
  },
  {
    level: 10, name: 'Drawer Clean-Out', world: 'desk_drawer',
    items: [{ itemId: 'paperclip', count: 3 }, { itemId: 'coin', count: 3 }, { itemId: 'dice', count: 3 }, { itemId: 'screw', count: 3 }, { itemId: 'candy', count: 2 }, { itemId: 'marble', count: 1 }],
    totalItems: 15,
    starThresholds: [50, 90, 155],
    rewards: { money: 200, gems: 2 },
  },

  // ── Desk Drawer continued + Backpack transition ──
  {
    level: 11, name: 'Desk Sweep', world: 'desk_drawer',
    items: [{ itemId: 'eraser', count: 4 }, { itemId: 'screw', count: 3 }, { itemId: 'button', count: 3 }, { itemId: 'paperclip', count: 3 }, { itemId: 'candy', count: 3 }],
    totalItems: 16,
    starThresholds: [55, 100, 170],
    rewards: { money: 240 },
  },
  {
    level: 12, name: 'Marble Madness', world: 'desk_drawer',
    items: [{ itemId: 'marble', count: 5 }, { itemId: 'dice', count: 4 }, { itemId: 'coin', count: 4 }, { itemId: 'button', count: 4 }],
    totalItems: 17,
    starThresholds: [60, 110, 185],
    rewards: { money: 280 },
  },
  {
    level: 13, name: 'Tiny Treasures', world: 'desk_drawer',
    items: [{ itemId: 'coin', count: 5 }, { itemId: 'dice', count: 4 }, { itemId: 'marble', count: 3 }, { itemId: 'candy', count: 3 }, { itemId: 'screw', count: 3 }],
    totalItems: 18,
    starThresholds: [65, 115, 195],
    rewards: { money: 330 },
  },
  {
    level: 14, name: 'Full Drawer', world: 'desk_drawer',
    items: [{ itemId: 'paperclip', count: 4 }, { itemId: 'button', count: 4 }, { itemId: 'coin', count: 3 }, { itemId: 'eraser', count: 3 }, { itemId: 'marble', count: 3 }, { itemId: 'dice', count: 2 }],
    totalItems: 19,
    starThresholds: [70, 125, 210],
    rewards: { money: 380 },
  },
  {
    level: 15, name: 'Drawer Boss', world: 'desk_drawer',
    items: [{ itemId: 'coin', count: 4 }, { itemId: 'marble', count: 4 }, { itemId: 'dice', count: 4 }, { itemId: 'screw', count: 4 }, { itemId: 'candy', count: 4 }],
    totalItems: 20,
    starThresholds: [75, 135, 225],
    rewards: { money: 450, gems: 3 },
  },

  // ── World 3: Backpack ──
  {
    level: 16, name: 'Unzipped', world: 'backpack',
    items: [{ itemId: 'pen', count: 3 }, { itemId: 'key', count: 2 }, { itemId: 'eraser', count: 3 }],
    totalItems: 8,
    starThresholds: [50, 95, 165],
    rewards: { money: 500 },
  },
  {
    level: 17, name: 'Pocket Stuff', world: 'backpack',
    items: [{ itemId: 'usb_drive', count: 2 }, { itemId: 'glasses', count: 2 }, { itemId: 'pen', count: 3 }, { itemId: 'apple', count: 2 }],
    totalItems: 9,
    starThresholds: [55, 100, 175],
    rewards: { money: 580 },
  },
  {
    level: 18, name: 'School Supplies', world: 'backpack',
    items: [{ itemId: 'pen', count: 3 }, { itemId: 'wallet', count: 1 }, { itemId: 'apple', count: 2 }, { itemId: 'remote', count: 2 }, { itemId: 'key', count: 2 }],
    totalItems: 10,
    starThresholds: [60, 110, 190],
    rewards: { money: 660, essence: 1 },
  },
  {
    level: 19, name: 'Deep Pockets', world: 'backpack',
    items: [{ itemId: 'wallet', count: 2 }, { itemId: 'mug', count: 2 }, { itemId: 'glasses', count: 2 }, { itemId: 'usb_drive', count: 2 }, { itemId: 'remote', count: 2 }, { itemId: 'key', count: 1 }],
    totalItems: 11,
    starThresholds: [65, 120, 200],
    rewards: { money: 750 },
  },
  {
    level: 20, name: 'Backpack Raid', world: 'backpack',
    items: [{ itemId: 'pen', count: 3 }, { itemId: 'apple', count: 2 }, { itemId: 'mug', count: 2 }, { itemId: 'wallet', count: 2 }, { itemId: 'glasses', count: 2 }, { itemId: 'remote', count: 1 }],
    totalItems: 12,
    starThresholds: [70, 130, 215],
    rewards: { money: 850, gems: 3 },
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

  const totalItems = Math.floor(8 + levelNum * 0.85 + Math.pow(levelNum * 0.03, 1.7));

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

  const baseTime = 30 + levelNum * 1.8;
  const starThresholds: [number, number, number] = [
    Math.floor(baseTime * 0.85),
    Math.floor(baseTime * 1.5),
    Math.floor(baseTime * 2.4),
  ];

  const baseMoney = Math.floor(50 * Math.pow(1.12, levelNum - 1));
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
