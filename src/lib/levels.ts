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
  { id: 'crumbs',            name: 'Crumbs',            levelRange: [1, 5],        bgColor: '#f8fafc', gridColor: 'rgba(200,200,200,0.15)',     palette: ['#4ade80', '#facc15', '#f87171'], blobScale: 1.0 },
  { id: 'desk_drawer',       name: 'Desk Drawer',       levelRange: [6, 10],       bgColor: '#fef3c7', gridColor: 'rgba(180,140,60,0.1)',       palette: ['#f59e0b', '#dc2626', '#3b82f6'], blobScale: 1.2 },
  { id: 'pencil_case',       name: 'Pencil Case',       levelRange: [11, 15],      bgColor: '#dbeafe', gridColor: 'rgba(59,130,246,0.1)',       palette: ['#3b82f6', '#ef4444', '#f59e0b'], blobScale: 1.4 },
  { id: 'lunchbox',          name: 'Lunchbox',          levelRange: [16, 20],      bgColor: '#fef9c3', gridColor: 'rgba(234,179,8,0.1)',        palette: ['#f97316', '#84cc16', '#ef4444'], blobScale: 1.8 },
  { id: 'toy_box',           name: 'Toy Box',           levelRange: [21, 25],      bgColor: '#fce7f3', gridColor: 'rgba(236,72,153,0.08)',      palette: ['#ec4899', '#8b5cf6', '#06b6d4'], blobScale: 2.2 },
  { id: 'backpack',          name: 'Backpack',          levelRange: [26, 30],      bgColor: '#eff6ff', gridColor: 'rgba(59,130,246,0.1)',       palette: ['#3b82f6', '#60a5fa', '#1e40af'], blobScale: 2.6 },
  { id: 'bedroom',           name: 'Bedroom',           levelRange: [31, 35],      bgColor: '#ede9fe', gridColor: 'rgba(139,92,246,0.08)',      palette: ['#8b5cf6', '#c084fc', '#6d28d9'], blobScale: 3.0 },
  { id: 'kitchen',           name: 'Kitchen',           levelRange: [36, 40],      bgColor: '#fff7ed', gridColor: 'rgba(234,88,12,0.08)',       palette: ['#ea580c', '#dc2626', '#ca8a04'], blobScale: 3.4 },
  { id: 'bathroom',          name: 'Bathroom',          levelRange: [41, 45],      bgColor: '#ecfeff', gridColor: 'rgba(6,182,212,0.08)',       palette: ['#06b6d4', '#0891b2', '#155e75'], blobScale: 3.8 },
  { id: 'living_room',       name: 'Living Room',       levelRange: [46, 50],      bgColor: '#fdf2f8', gridColor: 'rgba(236,72,153,0.08)',      palette: ['#f472b6', '#ec4899', '#be185d'], blobScale: 4.2 },
  { id: 'garage',            name: 'Garage',            levelRange: [51, 55],      bgColor: '#f1f5f9', gridColor: 'rgba(100,116,139,0.1)',      palette: ['#64748b', '#475569', '#f59e0b'], blobScale: 4.6 },
  { id: 'garden',            name: 'Garden',            levelRange: [56, 60],      bgColor: '#f0fdf4', gridColor: 'rgba(34,197,94,0.08)',       palette: ['#22c55e', '#16a34a', '#a855f7'], blobScale: 5.0 },
  { id: 'playground',        name: 'Playground',        levelRange: [61, 65],      bgColor: '#fef3c7', gridColor: 'rgba(249,115,22,0.08)',      palette: ['#f97316', '#eab308', '#0ea5e9'], blobScale: 5.4 },
  { id: 'school',            name: 'School',            levelRange: [66, 70],      bgColor: '#f5f5f4', gridColor: 'rgba(120,113,108,0.1)',      palette: ['#78716c', '#166534', '#1e40af'], blobScale: 5.8 },
  { id: 'neighborhood',      name: 'Neighborhood',      levelRange: [71, 76],      bgColor: '#faf5ff', gridColor: 'rgba(168,85,247,0.08)',     palette: ['#a855f7', '#7c3aed', '#c084fc'], blobScale: 6.2 },
  { id: 'shopping_mall',     name: 'Shopping Mall',     levelRange: [77, 82],      bgColor: '#fff1f2', gridColor: 'rgba(244,63,94,0.08)',       palette: ['#f43f5e', '#e11d48', '#fb7185'], blobScale: 6.6 },
  { id: 'city_park',         name: 'City Park',         levelRange: [83, 88],      bgColor: '#ecfdf5', gridColor: 'rgba(16,185,129,0.08)',      palette: ['#10b981', '#059669', '#047857'], blobScale: 7.2 },
  { id: 'construction_site', name: 'Construction Site', levelRange: [89, 94],      bgColor: '#fefce8', gridColor: 'rgba(202,138,4,0.08)',       palette: ['#ca8a04', '#a16207', '#92400e'], blobScale: 7.6 },
  { id: 'downtown',          name: 'Downtown',          levelRange: [95, 100],     bgColor: '#f5f5f4', gridColor: 'rgba(120,113,108,0.1)',      palette: ['#78716c', '#57534e', '#a8a29e'], blobScale: 8.0 },
  { id: 'junkyard',          name: 'Junkyard',          levelRange: [101, 105],    bgColor: '#e7e5e4', gridColor: 'rgba(120,113,108,0.12)',     palette: ['#78716c', '#a16207', '#dc2626'], blobScale: 8.5 },
  { id: 'space_station',     name: 'Space Station',     levelRange: [106, 110],    bgColor: '#0f172a', gridColor: 'rgba(148,163,184,0.06)',     palette: ['#818cf8', '#a78bfa', '#c084fc'], blobScale: 9.0 },
  { id: 'candy_world',       name: 'Candy World',       levelRange: [111, 115],    bgColor: '#fdf2f8', gridColor: 'rgba(236,72,153,0.1)',       palette: ['#f472b6', '#c084fc', '#fb923c'], blobScale: 9.5 },
  { id: 'deep_ocean',        name: 'Deep Ocean',        levelRange: [116, 120],    bgColor: '#082f49', gridColor: 'rgba(14,165,233,0.08)',      palette: ['#0ea5e9', '#06b6d4', '#22d3ee'], blobScale: 10.0 },
  { id: 'volcano',           name: 'Volcano',           levelRange: [121, Infinity], bgColor: '#1c1917', gridColor: 'rgba(239,68,68,0.08)',    palette: ['#ef4444', '#f97316', '#eab308'], blobScale: 10.5 },
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
  // ── World 1: Crumbs (levels 1–5) ──
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

  // ── World 2: Desk Drawer (levels 6–10) ──
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

  // ── World 3: Pencil Case (levels 11–15) ──
  {
    level: 11, name: 'Crayon Chaos', world: 'pencil_case',
    items: [{ itemId: 'crayon', count: 6 }, { itemId: 'ruler', count: 5 }, { itemId: 'rubber_band', count: 4 }, { itemId: 'pencil', count: 4 }, { itemId: 'sticker', count: 3 }, { itemId: 'tape_roll', count: 3 }],
    totalItems: 25,
    starThresholds: [29, 51, 85],
    rewards: { money: 31 },
  },
  {
    level: 12, name: 'Ruler Rally', world: 'pencil_case',
    items: [{ itemId: 'ruler', count: 6 }, { itemId: 'pencil_sharpener', count: 5 }, { itemId: 'scissors', count: 5 }, { itemId: 'crayon', count: 4 }, { itemId: 'eraser_cap', count: 4 }, { itemId: 'protractor', count: 4 }],
    totalItems: 28,
    starThresholds: [32, 56, 93],
    rewards: { money: 34 },
  },
  {
    level: 13, name: 'Sticker Storm', world: 'pencil_case',
    items: [{ itemId: 'sticker', count: 5 }, { itemId: 'tape_roll', count: 5 }, { itemId: 'pencil', count: 5 }, { itemId: 'crayon', count: 5 }, { itemId: 'rubber_band', count: 4 }, { itemId: 'scissors', count: 4 }, { itemId: 'pencil_sharpener', count: 4 }],
    totalItems: 32,
    starThresholds: [37, 63, 105],
    rewards: { money: 39 },
  },
  {
    level: 14, name: 'Sharp Collection', world: 'pencil_case',
    items: [{ itemId: 'scissors', count: 6 }, { itemId: 'pencil', count: 6 }, { itemId: 'protractor', count: 5 }, { itemId: 'crayon', count: 5 }, { itemId: 'ruler', count: 5 }, { itemId: 'pencil_sharpener', count: 4 }, { itemId: 'rubber_band', count: 3 }, { itemId: 'eraser_cap', count: 2 }],
    totalItems: 36,
    starThresholds: [41, 70, 117],
    rewards: { money: 43 },
  },
  {
    level: 15, name: 'Pencil Case Purge', world: 'pencil_case',
    items: [{ itemId: 'crayon', count: 6 }, { itemId: 'ruler', count: 6 }, { itemId: 'pencil', count: 5 }, { itemId: 'scissors', count: 5 }, { itemId: 'tape_roll', count: 5 }, { itemId: 'protractor', count: 5 }, { itemId: 'pencil_sharpener', count: 4 }, { itemId: 'rubber_band', count: 4 }, { itemId: 'sticker', count: 2 }, { itemId: 'eraser_cap', count: 2 }],
    totalItems: 44,
    starThresholds: [49, 85, 141],
    rewards: { money: 51, gems: 1 },
  },

  // ── World 4: Lunchbox (levels 16–20) ──
  {
    level: 16, name: 'Packed Lunch', world: 'lunchbox',
    items: [{ itemId: 'sandwich', count: 10 }, { itemId: 'cookie', count: 10 }, { itemId: 'juice_box', count: 8 }, { itemId: 'banana', count: 7 }],
    totalItems: 35,
    starThresholds: [39, 66, 111],
    rewards: { money: 45 },
  },
  {
    level: 17, name: 'Snack Time', world: 'lunchbox',
    items: [{ itemId: 'cookie', count: 9 }, { itemId: 'juice_box', count: 8 }, { itemId: 'banana', count: 8 }, { itemId: 'cheese_slice', count: 7 }, { itemId: 'wrapper', count: 6 }],
    totalItems: 38,
    starThresholds: [41, 71, 119],
    rewards: { money: 48 },
  },
  {
    level: 18, name: 'Lunchbox Surprise', world: 'lunchbox',
    items: [{ itemId: 'sandwich', count: 10 }, { itemId: 'cookie', count: 9 }, { itemId: 'banana', count: 9 }, { itemId: 'juice_box', count: 8 }, { itemId: 'cheese_slice', count: 6 }],
    totalItems: 42,
    starThresholds: [45, 78, 130],
    rewards: { money: 53 },
  },
  {
    level: 19, name: 'Messy Lunch', world: 'lunchbox',
    items: [{ itemId: 'sandwich', count: 9 }, { itemId: 'cookie', count: 9 }, { itemId: 'juice_box', count: 8 }, { itemId: 'banana', count: 8 }, { itemId: 'cheese_slice', count: 7 }, { itemId: 'wrapper', count: 5 }],
    totalItems: 46,
    starThresholds: [49, 84, 141],
    rewards: { money: 58 },
  },
  {
    level: 20, name: 'Lunchbox Feast', world: 'lunchbox',
    items: [{ itemId: 'sandwich', count: 11 }, { itemId: 'cookie', count: 10 }, { itemId: 'juice_box', count: 10 }, { itemId: 'banana', count: 9 }, { itemId: 'cheese_slice', count: 9 }, { itemId: 'wrapper', count: 7 }],
    totalItems: 56,
    starThresholds: [59, 101, 169],
    rewards: { money: 68, gems: 2 },
  },

  // ── World 5: Toy Box (levels 21–25) ──
  {
    level: 21, name: 'Toy Spill', world: 'toy_box',
    items: [{ itemId: 'building_block', count: 12 }, { itemId: 'toy_car', count: 12 }, { itemId: 'action_figure', count: 10 }, { itemId: 'teddy_bear', count: 8 }],
    totalItems: 42,
    starThresholds: [44, 75, 125],
    rewards: { money: 58, essence: 1 },
  },
  {
    level: 22, name: 'Playtime Pile', world: 'toy_box',
    items: [{ itemId: 'toy_car', count: 10 }, { itemId: 'building_block', count: 10 }, { itemId: 'action_figure', count: 10 }, { itemId: 'yo_yo', count: 8 }, { itemId: 'spinning_top', count: 7 }],
    totalItems: 45,
    starThresholds: [46, 79, 133],
    rewards: { money: 63 },
  },
  {
    level: 23, name: 'Action Alley', world: 'toy_box',
    items: [{ itemId: 'action_figure', count: 11 }, { itemId: 'teddy_bear', count: 10 }, { itemId: 'building_block', count: 10 }, { itemId: 'yo_yo', count: 9 }, { itemId: 'spinning_top', count: 8 }],
    totalItems: 48,
    starThresholds: [49, 84, 140],
    rewards: { money: 67 },
  },
  {
    level: 24, name: 'Toy Tumble', world: 'toy_box',
    items: [{ itemId: 'building_block', count: 10 }, { itemId: 'toy_car', count: 10 }, { itemId: 'action_figure', count: 9 }, { itemId: 'teddy_bear', count: 9 }, { itemId: 'yo_yo', count: 8 }, { itemId: 'spinning_top', count: 6 }],
    totalItems: 52,
    starThresholds: [52, 90, 150],
    rewards: { money: 73 },
  },
  {
    level: 25, name: 'Toy Box Tornado', world: 'toy_box',
    items: [{ itemId: 'building_block', count: 12 }, { itemId: 'toy_car', count: 12 }, { itemId: 'action_figure', count: 11 }, { itemId: 'teddy_bear', count: 11 }, { itemId: 'yo_yo', count: 10 }, { itemId: 'spinning_top', count: 8 }],
    totalItems: 64,
    starThresholds: [64, 109, 182],
    rewards: { money: 85, gems: 2 },
  },

  // ── World 6: Backpack (levels 26–30) ──
  {
    level: 26, name: 'Unzipped', world: 'backpack',
    items: [{ itemId: 'pen', count: 11 }, { itemId: 'key', count: 10 }, { itemId: 'apple', count: 10 }, { itemId: 'usb_drive', count: 9 }, { itemId: 'glasses', count: 8 }],
    totalItems: 48,
    starThresholds: [47, 81, 135],
    rewards: { money: 75, essence: 1 },
  },
  {
    level: 27, name: 'Pocket Stuff', world: 'backpack',
    items: [{ itemId: 'usb_drive', count: 10 }, { itemId: 'glasses', count: 10 }, { itemId: 'pen', count: 9 }, { itemId: 'apple', count: 9 }, { itemId: 'key', count: 8 }, { itemId: 'remote', count: 6 }],
    totalItems: 52,
    starThresholds: [50, 87, 145],
    rewards: { money: 81 },
  },
  {
    level: 28, name: 'School Supplies', world: 'backpack',
    items: [{ itemId: 'pen', count: 11 }, { itemId: 'wallet', count: 10 }, { itemId: 'apple', count: 10 }, { itemId: 'remote', count: 9 }, { itemId: 'key', count: 9 }, { itemId: 'mug', count: 7 }],
    totalItems: 56,
    starThresholds: [54, 92, 154],
    rewards: { money: 87 },
  },
  {
    level: 29, name: 'Deep Pockets', world: 'backpack',
    items: [{ itemId: 'wallet', count: 10 }, { itemId: 'mug', count: 10 }, { itemId: 'glasses', count: 9 }, { itemId: 'usb_drive', count: 9 }, { itemId: 'remote', count: 8 }, { itemId: 'key', count: 7 }, { itemId: 'pen', count: 7 }],
    totalItems: 60,
    starThresholds: [57, 98, 163],
    rewards: { money: 94 },
  },
  {
    level: 30, name: 'Backpack Raid', world: 'backpack',
    items: [{ itemId: 'pen', count: 12 }, { itemId: 'apple', count: 11 }, { itemId: 'mug', count: 11 }, { itemId: 'wallet', count: 10 }, { itemId: 'glasses', count: 10 }, { itemId: 'remote', count: 9 }, { itemId: 'usb_drive', count: 7 }, { itemId: 'key', count: 5 }],
    totalItems: 75,
    starThresholds: [70, 121, 202],
    rewards: { money: 110, gems: 2 },
  },

  // ── World 7: Bedroom (levels 31–35) ──
  {
    level: 31, name: 'Messy Room', world: 'bedroom',
    items: [{ itemId: 'pillow', count: 12 }, { itemId: 'alarm_clock', count: 11 }, { itemId: 'slipper', count: 11 }, { itemId: 'teddy', count: 10 }, { itemId: 'night_lamp', count: 8 }],
    totalItems: 52,
    starThresholds: [48, 83, 139],
    rewards: { money: 95, essence: 1 },
  },
  {
    level: 32, name: 'Closet Cascade', world: 'bedroom',
    items: [{ itemId: 'hanger', count: 12 }, { itemId: 'slipper', count: 12 }, { itemId: 'pillow', count: 11 }, { itemId: 'night_lamp', count: 10 }, { itemId: 'fan', count: 10 }],
    totalItems: 55,
    starThresholds: [50, 87, 145],
    rewards: { money: 102 },
  },
  {
    level: 33, name: 'Pillow Fort', world: 'bedroom',
    items: [{ itemId: 'pillow', count: 11 }, { itemId: 'teddy', count: 11 }, { itemId: 'alarm_clock', count: 10 }, { itemId: 'slipper', count: 10 }, { itemId: 'hanger', count: 9 }, { itemId: 'night_lamp', count: 7 }],
    totalItems: 58,
    starThresholds: [53, 91, 151],
    rewards: { money: 109 },
  },
  {
    level: 34, name: 'Bedroom Blitz', world: 'bedroom',
    items: [{ itemId: 'fan', count: 12 }, { itemId: 'suitcase', count: 11 }, { itemId: 'pillow', count: 11 }, { itemId: 'alarm_clock', count: 10 }, { itemId: 'hanger', count: 10 }, { itemId: 'slipper', count: 8 }],
    totalItems: 62,
    starThresholds: [56, 96, 160],
    rewards: { money: 118 },
  },
  {
    level: 35, name: 'Bedroom Blowout', world: 'bedroom',
    items: [{ itemId: 'pillow', count: 12 }, { itemId: 'alarm_clock', count: 11 }, { itemId: 'slipper', count: 10 }, { itemId: 'teddy', count: 10 }, { itemId: 'night_lamp', count: 10 }, { itemId: 'hanger', count: 9 }, { itemId: 'fan', count: 8 }, { itemId: 'suitcase', count: 6 }],
    totalItems: 76,
    starThresholds: [68, 116, 194],
    rewards: { money: 134, gems: 3 },
  },

  // ── World 8: Kitchen (levels 36–40) ──
  {
    level: 36, name: "Soup's On", world: 'kitchen',
    items: [{ itemId: 'plate', count: 13 }, { itemId: 'frying_pan', count: 12 }, { itemId: 'whisk', count: 11 }, { itemId: 'rolling_pin', count: 10 }, { itemId: 'spice_jar', count: 10 }],
    totalItems: 56,
    starThresholds: [49, 85, 142],
    rewards: { money: 124, essence: 2 },
  },
  {
    level: 37, name: 'Recipe Rumble', world: 'kitchen',
    items: [{ itemId: 'plate', count: 12 }, { itemId: 'cutting_board', count: 11 }, { itemId: 'spice_jar', count: 10 }, { itemId: 'frying_pan', count: 10 }, { itemId: 'whisk', count: 9 }, { itemId: 'rolling_pin', count: 8 }],
    totalItems: 60,
    starThresholds: [52, 90, 150],
    rewards: { money: 134 },
  },
  {
    level: 38, name: 'Kitchen Chaos', world: 'kitchen',
    items: [{ itemId: 'frying_pan', count: 12 }, { itemId: 'plate', count: 12 }, { itemId: 'rolling_pin', count: 11 }, { itemId: 'cutting_board', count: 10 }, { itemId: 'whisk', count: 10 }, { itemId: 'spice_jar', count: 9 }],
    totalItems: 64,
    starThresholds: [55, 95, 159],
    rewards: { money: 144 },
  },
  {
    level: 39, name: "Chef's Challenge", world: 'kitchen',
    items: [{ itemId: 'plate', count: 11 }, { itemId: 'frying_pan', count: 11 }, { itemId: 'rolling_pin', count: 10 }, { itemId: 'whisk', count: 10 }, { itemId: 'cutting_board', count: 10 }, { itemId: 'spice_jar', count: 9 }, { itemId: 'small_table', count: 7 }],
    totalItems: 68,
    starThresholds: [58, 100, 167],
    rewards: { money: 154 },
  },
  {
    level: 40, name: 'Kitchen Catastrophe', world: 'kitchen',
    items: [{ itemId: 'plate', count: 13 }, { itemId: 'frying_pan', count: 12 }, { itemId: 'rolling_pin', count: 11 }, { itemId: 'whisk', count: 11 }, { itemId: 'cutting_board', count: 10 }, { itemId: 'spice_jar', count: 10 }, { itemId: 'small_table', count: 9 }, { itemId: 'microwave', count: 8 }],
    totalItems: 84,
    starThresholds: [71, 122, 204],
    rewards: { money: 175, gems: 3 },
  },

  // ── World 9: Bathroom (levels 41–45) ──
  {
    level: 41, name: 'Bubble Bath', world: 'bathroom',
    items: [{ itemId: 'soap', count: 14 }, { itemId: 'rubber_duck', count: 13 }, { itemId: 'toothbrush', count: 12 }, { itemId: 'shampoo', count: 11 }, { itemId: 'towel_roll', count: 10 }],
    totalItems: 60,
    starThresholds: [50, 86, 144],
    rewards: { money: 165, essence: 2 },
  },
  {
    level: 42, name: 'Splash Zone', world: 'bathroom',
    items: [{ itemId: 'rubber_duck', count: 12 }, { itemId: 'soap', count: 12 }, { itemId: 'toothbrush', count: 11 }, { itemId: 'shampoo', count: 10 }, { itemId: 'towel_roll', count: 10 }, { itemId: 'mirror_item', count: 9 }],
    totalItems: 64,
    starThresholds: [53, 91, 153],
    rewards: { money: 177 },
  },
  {
    level: 43, name: 'Sudsy Sweep', world: 'bathroom',
    items: [{ itemId: 'soap', count: 13 }, { itemId: 'toothbrush', count: 12 }, { itemId: 'rubber_duck', count: 12 }, { itemId: 'shampoo', count: 11 }, { itemId: 'towel_roll', count: 10 }, { itemId: 'mirror_item', count: 10 }],
    totalItems: 68,
    starThresholds: [56, 96, 161],
    rewards: { money: 191 },
  },
  {
    level: 44, name: 'Bathroom Blitz', world: 'bathroom',
    items: [{ itemId: 'rubber_duck', count: 12 }, { itemId: 'soap', count: 11 }, { itemId: 'toothbrush', count: 11 }, { itemId: 'shampoo', count: 11 }, { itemId: 'towel_roll', count: 10 }, { itemId: 'mirror_item', count: 9 }, { itemId: 'washing_machine', count: 8 }],
    totalItems: 72,
    starThresholds: [59, 101, 169],
    rewards: { money: 205 },
  },
  {
    level: 45, name: 'Bathroom Flood', world: 'bathroom',
    items: [{ itemId: 'soap', count: 13 }, { itemId: 'rubber_duck', count: 12 }, { itemId: 'toothbrush', count: 12 }, { itemId: 'shampoo', count: 12 }, { itemId: 'towel_roll', count: 11 }, { itemId: 'mirror_item', count: 10 }, { itemId: 'washing_machine', count: 10 }, { itemId: 'bathtub', count: 8 }],
    totalItems: 88,
    starThresholds: [71, 122, 204],
    rewards: { money: 230, gems: 3 },
  },

  // ── World 10: Living Room (levels 46–50) ──
  {
    level: 46, name: 'Cozy Clutter', world: 'living_room',
    items: [{ itemId: 'book', count: 12 }, { itemId: 'lamp', count: 12 }, { itemId: 'smartphone', count: 11 }, { itemId: 'potted_plant', count: 11 }, { itemId: 'toaster', count: 10 }, { itemId: 'shoe', count: 9 }],
    totalItems: 65,
    starThresholds: [52, 89, 149],
    rewards: { money: 224, essence: 2 },
  },
  {
    level: 47, name: 'Remote Rumble', world: 'living_room',
    items: [{ itemId: 'basketball', count: 12 }, { itemId: 'clock', count: 12 }, { itemId: 'book', count: 12 }, { itemId: 'lamp', count: 11 }, { itemId: 'smartphone', count: 11 }, { itemId: 'shoe', count: 10 }],
    totalItems: 68,
    starThresholds: [54, 93, 155],
    rewards: { money: 240 },
  },
  {
    level: 48, name: 'Living Room Scramble', world: 'living_room',
    items: [{ itemId: 'potted_plant', count: 12 }, { itemId: 'guitar', count: 11 }, { itemId: 'book', count: 11 }, { itemId: 'lamp', count: 10 }, { itemId: 'smartphone', count: 10 }, { itemId: 'toaster', count: 10 }, { itemId: 'shoe', count: 8 }],
    totalItems: 72,
    starThresholds: [57, 97, 162],
    rewards: { money: 258 },
  },
  {
    level: 49, name: 'Furniture Frenzy', world: 'living_room',
    items: [{ itemId: 'chair', count: 12 }, { itemId: 'sofa', count: 12 }, { itemId: 'book', count: 11 }, { itemId: 'lamp', count: 11 }, { itemId: 'clock', count: 10 }, { itemId: 'basketball', count: 10 }, { itemId: 'guitar', count: 10 }],
    totalItems: 76,
    starThresholds: [59, 102, 170],
    rewards: { money: 277 },
  },
  {
    level: 50, name: 'Living Room Showdown', world: 'living_room',
    items: [{ itemId: 'book', count: 11 }, { itemId: 'lamp', count: 11 }, { itemId: 'smartphone', count: 10 }, { itemId: 'potted_plant', count: 10 }, { itemId: 'toaster', count: 10 }, { itemId: 'shoe', count: 9 }, { itemId: 'basketball', count: 9 }, { itemId: 'clock', count: 9 }, { itemId: 'chair', count: 8 }, { itemId: 'guitar', count: 7 }],
    totalItems: 94,
    starThresholds: [73, 125, 208],
    rewards: { money: 309, gems: 4 },
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

  let totalItems = Math.floor(5 + levelNum * 2.2 + Math.pow(levelNum, 1.4) * 0.1);

  const worldIndex = WORLDS.indexOf(world);
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

  const baseMoney = Math.floor(5 * Math.pow(1.08, levelNum) + totalItems * 0.8);
  const isWorldStart = world.levelRange[0] === levelNum;

  const rewards: { money: number; essence?: number; gems?: number } = {
    money: baseMoney,
  };
  if (isWorldBoss) {
    rewards.gems = Math.floor(1 + worldIndex / 3);
  } else if (isMilestone10) {
    rewards.gems = Math.floor(2 + levelNum / 20);
  }
  if (isWorldStart) {
    rewards.essence = Math.floor(1 + levelNum / 30);
  }

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
