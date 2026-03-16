export const FPS = 60;
export const BASE_SPEED = 180; // pixels per second
export const BASE_SUCTION = 80; // pixels
export const BASE_HUNGER_DRAIN = 2.5; // hunger per second
export const BASE_MAX_HUNGER = 100;
export const BASE_SPAWN_RATE = 400; // ms per spawn
export const BASE_SPAWN_VALUE = 1;

export const UPGRADE_COSTS: Record<string, (level: number) => number> = {
  speed: (level: number) => Math.floor(8 * Math.pow(1.35, level)),
  boostSpawnRate: (level: number) => Math.floor(20 * Math.pow(1.45, level)),
  speedSynergy: (level: number) => Math.floor(300 * Math.pow(2.5, level)),

  suction: (level: number) => Math.floor(10 * Math.pow(1.4, level)),
  suctionStrength: (level: number) => Math.floor(12 * Math.pow(1.45, level)),
  suctionSynergy: (level: number) => Math.floor(350 * Math.pow(2.5, level)),

  hungerDrain: (level: number) => Math.floor(12 * Math.pow(1.4, level)),
  hungerMax: (level: number) => Math.floor(8 * Math.pow(1.35, level)),
  hungerSynergy: (level: number) => Math.floor(250 * Math.pow(2.5, level)),

  spawnRate: (level: number) => Math.floor(15 * Math.pow(1.5, level)),
  spawnValue: (level: number) => Math.floor(25 * Math.pow(1.6, level)),
  spawnSynergy: (level: number) => Math.floor(400 * Math.pow(2.5, level)),
};
