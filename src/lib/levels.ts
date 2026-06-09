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
  { id: 'crumbs',            name: 'Crumbs',            levelRange: [1, 5],          bgColor: '#f8fafc', gridColor: 'rgba(200,200,200,0.15)',     palette: ['#4ade80', '#facc15', '#f87171'], blobScale: 1.0 },
  { id: 'desk_drawer',       name: 'Desk Drawer',       levelRange: [6, 10],         bgColor: '#fef3c7', gridColor: 'rgba(180,140,60,0.1)',       palette: ['#f59e0b', '#dc2626', '#3b82f6'], blobScale: 1.2 },
  { id: 'sewing_kit',        name: 'Sewing Kit',        levelRange: [11, 15],        bgColor: '#fdf4ff', gridColor: 'rgba(168,85,247,0.10)',      palette: ['#a855f7', '#ec4899', '#f59e0b'], blobScale: 1.3 },
  { id: 'pencil_case',       name: 'Pencil Case',       levelRange: [16, 20],        bgColor: '#dbeafe', gridColor: 'rgba(59,130,246,0.1)',       palette: ['#3b82f6', '#ef4444', '#f59e0b'], blobScale: 1.4 },
  { id: 'art_supplies',      name: 'Art Supplies',      levelRange: [21, 25],        bgColor: '#ecfeff', gridColor: 'rgba(20,184,166,0.10)',      palette: ['#14b8a6', '#f472b6', '#fbbf24'], blobScale: 1.6 },
  { id: 'lunchbox',          name: 'Lunchbox',          levelRange: [26, 30],        bgColor: '#fef9c3', gridColor: 'rgba(234,179,8,0.1)',        palette: ['#f97316', '#84cc16', '#ef4444'], blobScale: 1.8 },
  { id: 'snack_drawer',      name: 'Snack Drawer',      levelRange: [31, 35],        bgColor: '#fff7ed', gridColor: 'rgba(234,88,12,0.10)',       palette: ['#ea580c', '#84cc16', '#a16207'], blobScale: 2.0 },
  { id: 'toy_box',           name: 'Toy Box',           levelRange: [36, 40],        bgColor: '#fce7f3', gridColor: 'rgba(236,72,153,0.08)',      palette: ['#ec4899', '#8b5cf6', '#06b6d4'], blobScale: 2.2 },
  { id: 'shoebox',           name: 'Shoebox',           levelRange: [41, 45],        bgColor: '#f5f5f4', gridColor: 'rgba(120,113,108,0.10)',     palette: ['#78716c', '#dc2626', '#0ea5e9'], blobScale: 2.4 },
  { id: 'backpack',          name: 'Backpack',          levelRange: [46, 50],        bgColor: '#eff6ff', gridColor: 'rgba(59,130,246,0.1)',       palette: ['#3b82f6', '#60a5fa', '#1e40af'], blobScale: 2.6 },
  { id: 'bedroom',           name: 'Bedroom',           levelRange: [51, 55],        bgColor: '#ede9fe', gridColor: 'rgba(139,92,246,0.08)',      palette: ['#8b5cf6', '#c084fc', '#6d28d9'], blobScale: 3.0 },
  { id: 'pantry',            name: 'Pantry',            levelRange: [56, 60],        bgColor: '#fef3c7', gridColor: 'rgba(202,138,4,0.10)',       palette: ['#ca8a04', '#dc2626', '#16a34a'], blobScale: 3.2 },
  { id: 'kitchen',           name: 'Kitchen',           levelRange: [61, 65],        bgColor: '#fff7ed', gridColor: 'rgba(234,88,12,0.08)',       palette: ['#ea580c', '#dc2626', '#ca8a04'], blobScale: 3.4 },
  { id: 'bathroom',          name: 'Bathroom',          levelRange: [66, 70],        bgColor: '#ecfeff', gridColor: 'rgba(6,182,212,0.08)',       palette: ['#06b6d4', '#0891b2', '#155e75'], blobScale: 3.8 },
  { id: 'laundry_room',      name: 'Laundry Room',      levelRange: [71, 75],        bgColor: '#eff6ff', gridColor: 'rgba(96,165,250,0.10)',      palette: ['#60a5fa', '#a5f3fc', '#fbbf24'], blobScale: 4.0 },
  { id: 'living_room',       name: 'Living Room',       levelRange: [76, 80],        bgColor: '#fdf2f8', gridColor: 'rgba(236,72,153,0.08)',      palette: ['#f472b6', '#ec4899', '#be185d'], blobScale: 4.2 },
  { id: 'hallway',           name: 'Hallway',           levelRange: [81, 85],        bgColor: '#fef2f2', gridColor: 'rgba(248,113,113,0.10)',     palette: ['#f87171', '#92400e', '#a1a1aa'], blobScale: 4.4 },
  { id: 'garage',            name: 'Garage',            levelRange: [86, 90],        bgColor: '#f1f5f9', gridColor: 'rgba(100,116,139,0.1)',      palette: ['#64748b', '#475569', '#f59e0b'], blobScale: 4.6 },
  { id: 'driveway',          name: 'Driveway',          levelRange: [91, 95],        bgColor: '#f1f5f9', gridColor: 'rgba(100,116,139,0.10)',     palette: ['#64748b', '#65a30d', '#facc15'], blobScale: 4.8 },
  { id: 'garden',            name: 'Garden',            levelRange: [96, 100],       bgColor: '#f0fdf4', gridColor: 'rgba(34,197,94,0.08)',       palette: ['#22c55e', '#16a34a', '#a855f7'], blobScale: 5.0 },
  { id: 'playground',        name: 'Playground',        levelRange: [101, 105],      bgColor: '#fef3c7', gridColor: 'rgba(249,115,22,0.08)',      palette: ['#f97316', '#eab308', '#0ea5e9'], blobScale: 5.4 },
  { id: 'school',            name: 'School',            levelRange: [106, 110],      bgColor: '#f5f5f4', gridColor: 'rgba(120,113,108,0.1)',      palette: ['#78716c', '#166534', '#1e40af'], blobScale: 5.8 },
  { id: 'bus_stop',          name: 'Bus Stop',          levelRange: [111, 115],      bgColor: '#fefce8', gridColor: 'rgba(202,138,4,0.10)',       palette: ['#eab308', '#ef4444', '#3b82f6'], blobScale: 6.0 },
  { id: 'neighborhood',      name: 'Neighborhood',      levelRange: [116, 121],      bgColor: '#faf5ff', gridColor: 'rgba(168,85,247,0.08)',      palette: ['#a855f7', '#7c3aed', '#c084fc'], blobScale: 6.2 },
  { id: 'shopping_mall',     name: 'Shopping Mall',     levelRange: [122, 127],      bgColor: '#fff1f2', gridColor: 'rgba(244,63,94,0.08)',       palette: ['#f43f5e', '#e11d48', '#fb7185'], blobScale: 6.6 },
  { id: 'city_park',         name: 'City Park',         levelRange: [128, 133],      bgColor: '#ecfdf5', gridColor: 'rgba(16,185,129,0.08)',      palette: ['#10b981', '#059669', '#047857'], blobScale: 7.2 },
  { id: 'skatepark',         name: 'Skatepark',         levelRange: [134, 138],      bgColor: '#f5f3ff', gridColor: 'rgba(139,92,246,0.10)',      palette: ['#8b5cf6', '#f472b6', '#22c55e'], blobScale: 7.4 },
  { id: 'construction_site', name: 'Construction Site', levelRange: [139, 144],      bgColor: '#fefce8', gridColor: 'rgba(202,138,4,0.08)',       palette: ['#ca8a04', '#a16207', '#92400e'], blobScale: 7.6 },
  { id: 'downtown',          name: 'Downtown',          levelRange: [145, 150],      bgColor: '#f5f5f4', gridColor: 'rgba(120,113,108,0.1)',      palette: ['#78716c', '#57534e', '#a8a29e'], blobScale: 8.0 },
  { id: 'junkyard',          name: 'Junkyard',          levelRange: [151, 155],      bgColor: '#e7e5e4', gridColor: 'rgba(120,113,108,0.12)',     palette: ['#78716c', '#a16207', '#dc2626'], blobScale: 8.5 },
  { id: 'train_yard',        name: 'Train Yard',        levelRange: [156, 160],      bgColor: '#1c1917', gridColor: 'rgba(120,113,108,0.10)',     palette: ['#a1a1aa', '#dc2626', '#f59e0b'], blobScale: 8.7 },
  { id: 'space_station',     name: 'Space Station',     levelRange: [161, 165],      bgColor: '#0f172a', gridColor: 'rgba(148,163,184,0.06)',     palette: ['#818cf8', '#a78bfa', '#c084fc'], blobScale: 9.0 },
  { id: 'candy_world',       name: 'Candy World',       levelRange: [166, 170],      bgColor: '#fdf2f8', gridColor: 'rgba(236,72,153,0.1)',       palette: ['#f472b6', '#c084fc', '#fb923c'], blobScale: 9.5 },
  { id: 'cloud_kingdom',     name: 'Cloud Kingdom',     levelRange: [171, 175],      bgColor: '#f0f9ff', gridColor: 'rgba(125,211,252,0.10)',     palette: ['#7dd3fc', '#fbbf24', '#f9a8d4'], blobScale: 9.7 },
  { id: 'deep_ocean',        name: 'Deep Ocean',        levelRange: [176, 180],      bgColor: '#082f49', gridColor: 'rgba(14,165,233,0.08)',      palette: ['#0ea5e9', '#06b6d4', '#22d3ee'], blobScale: 10.0 },
  { id: 'volcano',           name: 'Volcano',           levelRange: [181, 185],      bgColor: '#1c1917', gridColor: 'rgba(239,68,68,0.08)',       palette: ['#ef4444', '#f97316', '#eab308'], blobScale: 10.5 },
  { id: 'glacier',           name: 'Glacier',           levelRange: [186, 190],      bgColor: '#f0fdfa', gridColor: 'rgba(45,212,191,0.10)',      palette: ['#67e8f9', '#a5f3fc', '#cbd5e1'], blobScale: 11.0 },
  { id: 'desert_dunes',      name: 'Desert Dunes',      levelRange: [191, 195],      bgColor: '#fef3c7', gridColor: 'rgba(217,119,6,0.10)',       palette: ['#f59e0b', '#fbbf24', '#9a3412'], blobScale: 11.5 },
  { id: 'mountain_range',    name: 'Mountain Range',    levelRange: [196, 200],      bgColor: '#f1f5f9', gridColor: 'rgba(71,85,105,0.10)',       palette: ['#475569', '#a3a3a3', '#22c55e'], blobScale: 12.0 },
  { id: 'stratosphere',      name: 'Stratosphere',      levelRange: [201, 205],      bgColor: '#dbeafe', gridColor: 'rgba(59,130,246,0.10)',      palette: ['#3b82f6', '#e0f2fe', '#a78bfa'], blobScale: 12.5 },
  { id: 'moon_surface',      name: 'Moon Surface',      levelRange: [206, 210],      bgColor: '#1e293b', gridColor: 'rgba(148,163,184,0.10)',     palette: ['#cbd5e1', '#94a3b8', '#60a5fa'], blobScale: 13.0 },
  { id: 'red_planet',        name: 'Red Planet',        levelRange: [211, 215],      bgColor: '#7c2d12', gridColor: 'rgba(220,38,38,0.10)',       palette: ['#f97316', '#dc2626', '#fbbf24'], blobScale: 13.5 },
  { id: 'asteroid_belt',     name: 'Asteroid Belt',     levelRange: [216, 220],      bgColor: '#0f172a', gridColor: 'rgba(100,116,139,0.10)',     palette: ['#78716c', '#a16207', '#cbd5e1'], blobScale: 14.0 },
  { id: 'solar_system',      name: 'Solar System',      levelRange: [221, 225],      bgColor: '#020617', gridColor: 'rgba(168,85,247,0.10)',      palette: ['#fbbf24', '#3b82f6', '#dc2626'], blobScale: 14.5 },
  { id: 'nebula',            name: 'Nebula',            levelRange: [226, 230],      bgColor: '#1e1b4b', gridColor: 'rgba(168,85,247,0.10)',      palette: ['#c084fc', '#f472b6', '#22d3ee'], blobScale: 15.0 },
  { id: 'galaxy',            name: 'Galaxy',            levelRange: [231, 235],      bgColor: '#0c0a1f', gridColor: 'rgba(196,181,253,0.10)',     palette: ['#a78bfa', '#fbbf24', '#22d3ee'], blobScale: 15.5 },
  { id: 'universe_edge',     name: 'Universe Edge',     levelRange: [236, 240],      bgColor: '#000000', gridColor: 'rgba(255,255,255,0.05)',     palette: ['#f9a8d4', '#a78bfa', '#fde047'], blobScale: 16.0 },
  { id: 'multiverse',        name: 'Multiverse',        levelRange: [241, Infinity], bgColor: '#0a0118', gridColor: 'rgba(244,114,182,0.10)',     palette: ['#f472b6', '#22d3ee', '#fbbf24'], blobScale: 17.0 },
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

  // ── World 3: Sewing Kit (levels 11–15) ──
  {
    level: 11, name: 'Thread Spill', world: 'sewing_kit',
    items: [{ itemId: 'thread_spool', count: 6 }, { itemId: 'button_pack', count: 5 }, { itemId: 'sewing_needle', count: 4 }, { itemId: 'thimble', count: 4 }, { itemId: 'yarn_ball', count: 3 }, { itemId: 'pin_cushion', count: 3 }],
    totalItems: 25,
    starThresholds: [29, 51, 85],
    rewards: { money: 31 },
  },
  {
    level: 12, name: 'Button Avalanche', world: 'sewing_kit',
    items: [{ itemId: 'button_pack', count: 6 }, { itemId: 'thread_spool', count: 5 }, { itemId: 'ribbon', count: 5 }, { itemId: 'sewing_scissors', count: 4 }, { itemId: 'thimble', count: 4 }, { itemId: 'fabric_scrap', count: 4 }],
    totalItems: 28,
    starThresholds: [32, 56, 93],
    rewards: { money: 34 },
  },
  {
    level: 13, name: 'Yarn Tangle', world: 'sewing_kit',
    items: [{ itemId: 'yarn_ball', count: 5 }, { itemId: 'thread_spool', count: 5 }, { itemId: 'ribbon', count: 5 }, { itemId: 'fabric_scrap', count: 5 }, { itemId: 'zipper', count: 4 }, { itemId: 'pin_cushion', count: 4 }, { itemId: 'sewing_needle', count: 4 }],
    totalItems: 32,
    starThresholds: [37, 63, 105],
    rewards: { money: 39 },
  },
  {
    level: 14, name: 'Pincushion Pile', world: 'sewing_kit',
    items: [{ itemId: 'pin_cushion', count: 6 }, { itemId: 'sewing_needle', count: 6 }, { itemId: 'thimble', count: 5 }, { itemId: 'thread_spool', count: 5 }, { itemId: 'button_pack', count: 5 }, { itemId: 'sewing_scissors', count: 4 }, { itemId: 'zipper', count: 3 }, { itemId: 'fabric_scrap', count: 2 }],
    totalItems: 36,
    starThresholds: [41, 70, 117],
    rewards: { money: 43 },
  },
  {
    level: 15, name: 'Sewing Kit Overflow', world: 'sewing_kit',
    items: [{ itemId: 'thread_spool', count: 6 }, { itemId: 'button_pack', count: 6 }, { itemId: 'yarn_ball', count: 5 }, { itemId: 'ribbon', count: 5 }, { itemId: 'pin_cushion', count: 5 }, { itemId: 'sewing_needle', count: 5 }, { itemId: 'thimble', count: 4 }, { itemId: 'sewing_scissors', count: 4 }, { itemId: 'fabric_scrap', count: 2 }, { itemId: 'zipper', count: 2 }],
    totalItems: 44,
    starThresholds: [49, 85, 141],
    rewards: { money: 51, gems: 1 },
  },

  // ── World 4: Pencil Case (levels 16–20) ──
  {
    level: 16, name: 'Crayon Chaos', world: 'pencil_case',
    items: [{ itemId: 'crayon', count: 6 }, { itemId: 'ruler', count: 5 }, { itemId: 'rubber_band', count: 4 }, { itemId: 'pencil', count: 4 }, { itemId: 'sticker', count: 3 }, { itemId: 'tape_roll', count: 3 }],
    totalItems: 25,
    starThresholds: [29, 51, 85],
    rewards: { money: 45 },
  },
  {
    level: 17, name: 'Ruler Rally', world: 'pencil_case',
    items: [{ itemId: 'ruler', count: 6 }, { itemId: 'pencil_sharpener', count: 5 }, { itemId: 'scissors', count: 5 }, { itemId: 'crayon', count: 4 }, { itemId: 'eraser_cap', count: 4 }, { itemId: 'protractor', count: 4 }],
    totalItems: 28,
    starThresholds: [32, 56, 93],
    rewards: { money: 50 },
  },
  {
    level: 18, name: 'Sticker Storm', world: 'pencil_case',
    items: [{ itemId: 'sticker', count: 5 }, { itemId: 'tape_roll', count: 5 }, { itemId: 'pencil', count: 5 }, { itemId: 'crayon', count: 5 }, { itemId: 'rubber_band', count: 4 }, { itemId: 'scissors', count: 4 }, { itemId: 'pencil_sharpener', count: 4 }],
    totalItems: 32,
    starThresholds: [37, 63, 105],
    rewards: { money: 56 },
  },
  {
    level: 19, name: 'Sharp Collection', world: 'pencil_case',
    items: [{ itemId: 'scissors', count: 6 }, { itemId: 'pencil', count: 6 }, { itemId: 'protractor', count: 5 }, { itemId: 'crayon', count: 5 }, { itemId: 'ruler', count: 5 }, { itemId: 'pencil_sharpener', count: 4 }, { itemId: 'rubber_band', count: 3 }, { itemId: 'eraser_cap', count: 2 }],
    totalItems: 36,
    starThresholds: [41, 70, 117],
    rewards: { money: 62 },
  },
  {
    level: 20, name: 'Pencil Case Purge', world: 'pencil_case',
    items: [{ itemId: 'crayon', count: 6 }, { itemId: 'ruler', count: 6 }, { itemId: 'pencil', count: 5 }, { itemId: 'scissors', count: 5 }, { itemId: 'tape_roll', count: 5 }, { itemId: 'protractor', count: 5 }, { itemId: 'pencil_sharpener', count: 4 }, { itemId: 'rubber_band', count: 4 }, { itemId: 'sticker', count: 2 }, { itemId: 'eraser_cap', count: 2 }],
    totalItems: 44,
    starThresholds: [49, 85, 141],
    rewards: { money: 70, gems: 1 },
  },

  // ── World 5: Art Supplies (levels 21–25) ──
  {
    level: 21, name: 'Spilled Paint', world: 'art_supplies',
    items: [{ itemId: 'paint_tube', count: 9 }, { itemId: 'paint_brush', count: 9 }, { itemId: 'palette', count: 8 }, { itemId: 'marker', count: 8 }, { itemId: 'glue_stick', count: 8 }],
    totalItems: 42,
    starThresholds: [44, 75, 125],
    rewards: { money: 79, essence: 1 },
  },
  {
    level: 22, name: 'Marker Madness', world: 'art_supplies',
    items: [{ itemId: 'marker', count: 10 }, { itemId: 'paint_tube', count: 9 }, { itemId: 'paint_brush', count: 9 }, { itemId: 'glitter_pot', count: 9 }, { itemId: 'eraser_putty', count: 8 }],
    totalItems: 45,
    starThresholds: [46, 79, 133],
    rewards: { money: 86 },
  },
  {
    level: 23, name: 'Brush Bonanza', world: 'art_supplies',
    items: [{ itemId: 'paint_brush', count: 11 }, { itemId: 'palette', count: 10 }, { itemId: 'paint_tube', count: 10 }, { itemId: 'watercolor_pan', count: 9 }, { itemId: 'sketchbook', count: 8 }],
    totalItems: 48,
    starThresholds: [49, 84, 140],
    rewards: { money: 93 },
  },
  {
    level: 24, name: 'Glitter Storm', world: 'art_supplies',
    items: [{ itemId: 'glitter_pot', count: 10 }, { itemId: 'marker', count: 10 }, { itemId: 'paint_tube', count: 9 }, { itemId: 'paint_brush', count: 9 }, { itemId: 'charcoal_stick', count: 8 }, { itemId: 'sketchbook', count: 6 }],
    totalItems: 52,
    starThresholds: [52, 90, 150],
    rewards: { money: 100 },
  },
  {
    level: 25, name: 'Art Supply Tornado', world: 'art_supplies',
    items: [{ itemId: 'paint_tube', count: 12 }, { itemId: 'paint_brush', count: 12 }, { itemId: 'palette', count: 11 }, { itemId: 'marker', count: 11 }, { itemId: 'glitter_pot', count: 10 }, { itemId: 'sketchbook', count: 8 }],
    totalItems: 64,
    starThresholds: [64, 109, 182],
    rewards: { money: 117, gems: 2 },
  },

  // ── World 6: Lunchbox (levels 26–30) ──
  {
    level: 26, name: 'Packed Lunch', world: 'lunchbox',
    items: [{ itemId: 'sandwich', count: 10 }, { itemId: 'cookie', count: 10 }, { itemId: 'juice_box', count: 8 }, { itemId: 'banana', count: 7 }],
    totalItems: 35,
    starThresholds: [39, 66, 111],
    rewards: { money: 76 },
  },
  {
    level: 27, name: 'Snack Time', world: 'lunchbox',
    items: [{ itemId: 'cookie', count: 9 }, { itemId: 'juice_box', count: 8 }, { itemId: 'banana', count: 8 }, { itemId: 'cheese_slice', count: 7 }, { itemId: 'wrapper', count: 6 }],
    totalItems: 38,
    starThresholds: [41, 71, 119],
    rewards: { money: 82 },
  },
  {
    level: 28, name: 'Lunchbox Surprise', world: 'lunchbox',
    items: [{ itemId: 'sandwich', count: 10 }, { itemId: 'cookie', count: 9 }, { itemId: 'banana', count: 9 }, { itemId: 'juice_box', count: 8 }, { itemId: 'cheese_slice', count: 6 }],
    totalItems: 42,
    starThresholds: [45, 78, 130],
    rewards: { money: 89 },
  },
  {
    level: 29, name: 'Messy Lunch', world: 'lunchbox',
    items: [{ itemId: 'sandwich', count: 9 }, { itemId: 'cookie', count: 9 }, { itemId: 'juice_box', count: 8 }, { itemId: 'banana', count: 8 }, { itemId: 'cheese_slice', count: 7 }, { itemId: 'wrapper', count: 5 }],
    totalItems: 46,
    starThresholds: [49, 84, 141],
    rewards: { money: 96 },
  },
  {
    level: 30, name: 'Lunchbox Feast', world: 'lunchbox',
    items: [{ itemId: 'sandwich', count: 11 }, { itemId: 'cookie', count: 10 }, { itemId: 'juice_box', count: 10 }, { itemId: 'banana', count: 9 }, { itemId: 'cheese_slice', count: 9 }, { itemId: 'wrapper', count: 7 }],
    totalItems: 56,
    starThresholds: [59, 101, 169],
    rewards: { money: 113, gems: 2 },
  },

  // ── World 7: Snack Drawer (levels 31–35) ──
  {
    level: 31, name: 'Snack Pile', world: 'snack_drawer',
    items: [{ itemId: 'granola_bar', count: 12 }, { itemId: 'fruit_snack', count: 11 }, { itemId: 'mini_chocolate', count: 11 }, { itemId: 'gum_pack', count: 10 }, { itemId: 'raisin_box', count: 8 }],
    totalItems: 52,
    starThresholds: [48, 83, 139],
    rewards: { money: 124, essence: 1 },
  },
  {
    level: 32, name: 'Bag Bonanza', world: 'snack_drawer',
    items: [{ itemId: 'popcorn_bag', count: 12 }, { itemId: 'trail_mix', count: 12 }, { itemId: 'granola_bar', count: 11 }, { itemId: 'nut_packet', count: 10 }, { itemId: 'mints_tin', count: 10 }],
    totalItems: 55,
    starThresholds: [50, 87, 145],
    rewards: { money: 134 },
  },
  {
    level: 33, name: 'Crunchy Cluster', world: 'snack_drawer',
    items: [{ itemId: 'granola_bar', count: 11 }, { itemId: 'mini_chocolate', count: 11 }, { itemId: 'beef_jerky', count: 10 }, { itemId: 'fruit_snack', count: 10 }, { itemId: 'nut_packet', count: 9 }, { itemId: 'gum_pack', count: 7 }],
    totalItems: 58,
    starThresholds: [53, 91, 151],
    rewards: { money: 144 },
  },
  {
    level: 34, name: 'Snack Drawer Spill', world: 'snack_drawer',
    items: [{ itemId: 'beef_jerky', count: 12 }, { itemId: 'mini_chocolate', count: 11 }, { itemId: 'fruit_snack', count: 11 }, { itemId: 'popcorn_bag', count: 10 }, { itemId: 'trail_mix', count: 10 }, { itemId: 'gum_pack', count: 8 }],
    totalItems: 62,
    starThresholds: [56, 96, 160],
    rewards: { money: 154 },
  },
  {
    level: 35, name: 'Pantry Pre-Game', world: 'snack_drawer',
    items: [{ itemId: 'granola_bar', count: 12 }, { itemId: 'fruit_snack', count: 11 }, { itemId: 'mini_chocolate', count: 10 }, { itemId: 'gum_pack', count: 10 }, { itemId: 'popcorn_bag', count: 10 }, { itemId: 'trail_mix', count: 9 }, { itemId: 'beef_jerky', count: 8 }, { itemId: 'mints_tin', count: 6 }],
    totalItems: 76,
    starThresholds: [68, 116, 194],
    rewards: { money: 175, gems: 3 },
  },

  // ── World 8: Toy Box (levels 36–40) ──
  {
    level: 36, name: 'Toy Spill', world: 'toy_box',
    items: [{ itemId: 'building_block', count: 12 }, { itemId: 'toy_car', count: 12 }, { itemId: 'action_figure', count: 10 }, { itemId: 'teddy_bear', count: 8 }],
    totalItems: 42,
    starThresholds: [44, 75, 125],
    rewards: { money: 154, essence: 1 },
  },
  {
    level: 37, name: 'Playtime Pile', world: 'toy_box',
    items: [{ itemId: 'toy_car', count: 10 }, { itemId: 'building_block', count: 10 }, { itemId: 'action_figure', count: 10 }, { itemId: 'yo_yo', count: 8 }, { itemId: 'spinning_top', count: 7 }],
    totalItems: 45,
    starThresholds: [46, 79, 133],
    rewards: { money: 167 },
  },
  {
    level: 38, name: 'Action Alley', world: 'toy_box',
    items: [{ itemId: 'action_figure', count: 11 }, { itemId: 'teddy_bear', count: 10 }, { itemId: 'building_block', count: 10 }, { itemId: 'yo_yo', count: 9 }, { itemId: 'spinning_top', count: 8 }],
    totalItems: 48,
    starThresholds: [49, 84, 140],
    rewards: { money: 181 },
  },
  {
    level: 39, name: 'Toy Tumble', world: 'toy_box',
    items: [{ itemId: 'building_block', count: 10 }, { itemId: 'toy_car', count: 10 }, { itemId: 'action_figure', count: 9 }, { itemId: 'teddy_bear', count: 9 }, { itemId: 'yo_yo', count: 8 }, { itemId: 'spinning_top', count: 6 }],
    totalItems: 52,
    starThresholds: [52, 90, 150],
    rewards: { money: 196 },
  },
  {
    level: 40, name: 'Toy Box Tornado', world: 'toy_box',
    items: [{ itemId: 'building_block', count: 12 }, { itemId: 'toy_car', count: 12 }, { itemId: 'action_figure', count: 11 }, { itemId: 'teddy_bear', count: 11 }, { itemId: 'yo_yo', count: 10 }, { itemId: 'spinning_top', count: 8 }],
    totalItems: 64,
    starThresholds: [64, 109, 182],
    rewards: { money: 222, gems: 2 },
  },

  // ── World 9: Shoebox (levels 41–45) ──
  {
    level: 41, name: 'Shoelace Mess', world: 'shoebox',
    items: [{ itemId: 'shoelace', count: 14 }, { itemId: 'sock', count: 13 }, { itemId: 'sneaker', count: 12 }, { itemId: 'baseball_cap', count: 11 }, { itemId: 'sunglass_case', count: 10 }],
    totalItems: 60,
    starThresholds: [50, 86, 144],
    rewards: { money: 213, essence: 2 },
  },
  {
    level: 42, name: 'Sneaker Storm', world: 'shoebox',
    items: [{ itemId: 'sneaker', count: 12 }, { itemId: 'shoelace', count: 12 }, { itemId: 'wristwatch', count: 11 }, { itemId: 'beanie', count: 10 }, { itemId: 'mittens', count: 10 }, { itemId: 'sock', count: 9 }],
    totalItems: 64,
    starThresholds: [53, 91, 153],
    rewards: { money: 230 },
  },
  {
    level: 43, name: 'Sock Cyclone', world: 'shoebox',
    items: [{ itemId: 'sock', count: 13 }, { itemId: 'shoelace', count: 12 }, { itemId: 'sneaker', count: 12 }, { itemId: 'cleat', count: 11 }, { itemId: 'slipper_pair', count: 10 }, { itemId: 'mittens', count: 10 }],
    totalItems: 68,
    starThresholds: [56, 96, 161],
    rewards: { money: 248 },
  },
  {
    level: 44, name: 'Footwear Avalanche', world: 'shoebox',
    items: [{ itemId: 'sneaker', count: 12 }, { itemId: 'cleat', count: 11 }, { itemId: 'slipper_pair', count: 11 }, { itemId: 'shoelace', count: 11 }, { itemId: 'sock', count: 10 }, { itemId: 'beanie', count: 9 }, { itemId: 'baseball_cap', count: 8 }],
    totalItems: 72,
    starThresholds: [59, 101, 169],
    rewards: { money: 268 },
  },
  {
    level: 45, name: 'Shoebox Overflow', world: 'shoebox',
    items: [{ itemId: 'shoelace', count: 13 }, { itemId: 'sock', count: 12 }, { itemId: 'sneaker', count: 12 }, { itemId: 'baseball_cap', count: 12 }, { itemId: 'wristwatch', count: 11 }, { itemId: 'sunglass_case', count: 10 }, { itemId: 'mittens', count: 10 }, { itemId: 'beanie', count: 8 }],
    totalItems: 88,
    starThresholds: [71, 122, 204],
    rewards: { money: 290, gems: 3 },
  },

  // ── World 10: Backpack (levels 46–50) ──
  {
    level: 46, name: 'Unzipped', world: 'backpack',
    items: [{ itemId: 'pen', count: 11 }, { itemId: 'key', count: 10 }, { itemId: 'apple', count: 10 }, { itemId: 'usb_drive', count: 9 }, { itemId: 'glasses', count: 8 }],
    totalItems: 48,
    starThresholds: [47, 81, 135],
    rewards: { money: 290, essence: 2 },
  },
  {
    level: 47, name: 'Pocket Stuff', world: 'backpack',
    items: [{ itemId: 'usb_drive', count: 10 }, { itemId: 'glasses', count: 10 }, { itemId: 'pen', count: 9 }, { itemId: 'apple', count: 9 }, { itemId: 'key', count: 8 }, { itemId: 'remote', count: 6 }],
    totalItems: 52,
    starThresholds: [50, 87, 145],
    rewards: { money: 313 },
  },
  {
    level: 48, name: 'School Supplies', world: 'backpack',
    items: [{ itemId: 'pen', count: 11 }, { itemId: 'wallet', count: 10 }, { itemId: 'apple', count: 10 }, { itemId: 'remote', count: 9 }, { itemId: 'key', count: 9 }, { itemId: 'mug', count: 7 }],
    totalItems: 56,
    starThresholds: [54, 92, 154],
    rewards: { money: 338 },
  },
  {
    level: 49, name: 'Deep Pockets', world: 'backpack',
    items: [{ itemId: 'wallet', count: 10 }, { itemId: 'mug', count: 10 }, { itemId: 'glasses', count: 9 }, { itemId: 'usb_drive', count: 9 }, { itemId: 'remote', count: 8 }, { itemId: 'key', count: 7 }, { itemId: 'pen', count: 7 }],
    totalItems: 60,
    starThresholds: [57, 98, 163],
    rewards: { money: 365 },
  },
  {
    level: 50, name: 'Backpack Raid', world: 'backpack',
    items: [{ itemId: 'pen', count: 12 }, { itemId: 'apple', count: 11 }, { itemId: 'mug', count: 11 }, { itemId: 'wallet', count: 10 }, { itemId: 'glasses', count: 10 }, { itemId: 'remote', count: 9 }, { itemId: 'usb_drive', count: 7 }, { itemId: 'key', count: 5 }],
    totalItems: 75,
    starThresholds: [70, 121, 202],
    rewards: { money: 405, gems: 4 },
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
