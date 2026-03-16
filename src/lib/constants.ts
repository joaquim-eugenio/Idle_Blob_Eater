export const FPS = 60;
export const BASE_SPEED = 150; // pixels per second
export const BASE_SUCTION = 50; // pixels
export const BASE_HUNGER_DRAIN = 5; // hunger per second
export const BASE_MAX_HUNGER = 100;
export const BASE_SPAWN_RATE = 500; // ms per spawn
export const BASE_SPAWN_VALUE = 1;

export const UPGRADE_COSTS: Record<string, (level: number) => number> = {
  speed: (level: number) => Math.floor(10 * Math.pow(1.5, level)),
  boostSpawnRate: (level: number) => Math.floor(30 * Math.pow(1.6, level)),
  speedSynergy: (level: number) => Math.floor(500 * Math.pow(3, level)),

  suction: (level: number) => Math.floor(15 * Math.pow(1.6, level)),
  suctionStrength: (level: number) => Math.floor(20 * Math.pow(1.7, level)),
  suctionSynergy: (level: number) => Math.floor(600 * Math.pow(3, level)),

  hungerDrain: (level: number) => Math.floor(20 * Math.pow(1.7, level)),
  hungerMax: (level: number) => Math.floor(10 * Math.pow(1.4, level)),
  hungerSynergy: (level: number) => Math.floor(400 * Math.pow(3, level)),

  spawnRate: (level: number) => Math.floor(25 * Math.pow(1.8, level)),
  spawnValue: (level: number) => Math.floor(50 * Math.pow(2.0, level)),
  spawnSynergy: (level: number) => Math.floor(800 * Math.pow(3, level)),
};
