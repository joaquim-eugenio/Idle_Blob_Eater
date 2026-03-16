import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  BASE_MAX_HUNGER, 
  BASE_HUNGER_DRAIN, 
  BASE_SPEED, 
  BASE_SUCTION, 
  BASE_SPAWN_RATE 
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
  
  [key: string]: number | undefined;
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
  
  buyUpgrade: (type: keyof Upgrades, cost: number) => void;
  activateBoost: () => void;
  activateStarBoost: () => void;
  tick: (delta: number, width: number, height: number) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      money: 0,
      level: 1,
      hunger: BASE_MAX_HUNGER,
      foodEaten: 0,
      blobPosition: { x: 200, y: 300 },
      items: [],
      upgrades: {
        speed: 0,
        boostSpawnRate: 0,
        suction: 0,
        suctionStrength: 0,
        hungerDrain: 0,
        hungerMax: 0,
        spawnRate: 0,
        spawnValue: 0,
      },
      spawnTimer: 0,
      starSpawnTimer: 10,
      boostActive: false,
      boostTimer: 0,
      starBoostActive: false,
      starBoostTimer: 0,
      wanderAngle: Math.random() * Math.PI * 2,

      buyUpgrade: (type, cost) => set((state) => {
        if (state.money >= cost) {
          // Check if blocked by synergy
          const getSynergyFor = (t: string) => {
            if (t === 'speed' || t === 'boostSpawnRate') return 'speedSynergy';
            if (t === 'suction' || t === 'suctionStrength') return 'suctionSynergy';
            if (t === 'hungerDrain' || t === 'hungerMax') return 'hungerSynergy';
            if (t === 'spawnRate' || t === 'spawnValue') return 'spawnSynergy';
            return null;
          };

          const synType = getSynergyFor(type);
          if (synType) {
            const currentLevel = state.upgrades[type] || 0;
            const currentBlock = Math.floor(currentLevel / 6);
            const synLevel = state.upgrades[synType] || 0;
            if (currentBlock > synLevel) {
              return state; // Blocked
            }
          }

          if (type.endsWith('Synergy')) {
            const reqLevel = ((state.upgrades[type] || 0) + 1) * 6;
            let branchA = '', branchB = '';
            if (type === 'speedSynergy') { branchA = 'speed'; branchB = 'boostSpawnRate'; }
            if (type === 'suctionSynergy') { branchA = 'suction'; branchB = 'suctionStrength'; }
            if (type === 'hungerSynergy') { branchA = 'hungerDrain'; branchB = 'hungerMax'; }
            if (type === 'spawnSynergy') { branchA = 'spawnRate'; branchB = 'spawnValue'; }
            
            if ((state.upgrades[branchA] || 0) < reqLevel || (state.upgrades[branchB] || 0) < reqLevel) {
              return state; // Blocked, prerequisites not met
            }
          }

          return {
            money: state.money - cost,
            upgrades: {
              ...state.upgrades,
              [type]: (state.upgrades[type] || 0) + 1
            }
          };
        }
        return state;
      }),

      activateBoost: () => set({ boostActive: true, boostTimer: 30 }),
      activateStarBoost: () => set({ starBoostActive: true, starBoostTimer: 5 }),

      resetGame: () => set({
        money: 0,
        level: 1,
        hunger: BASE_MAX_HUNGER,
        foodEaten: 0,
        blobPosition: { x: 200, y: 300 },
        items: [],
        upgrades: {
          speed: 0,
          boostSpawnRate: 0,
          suction: 0,
          suctionStrength: 0,
          hungerDrain: 0,
          hungerMax: 0,
          spawnRate: 0,
          spawnValue: 0,
        },
        spawnTimer: 0,
        starSpawnTimer: 10,
        boostActive: false,
        boostTimer: 0,
        starBoostActive: false,
        starBoostTimer: 0,
        wanderAngle: Math.random() * Math.PI * 2,
      }),

      tick: (delta, width, height) => set((state) => {
        const blobScale = 1 + (state.level - 1) * 0.2;
        const maxTier = Math.floor((state.level - 1) / 5) + 1;

        const hungerSyn = 1 + (state.upgrades.hungerSynergy || 0) * 0.5;
        const maxHunger = (BASE_MAX_HUNGER + (state.upgrades.hungerMax || 0) * 20) * hungerSyn;
        const baseDrain = Math.max(1, BASE_HUNGER_DRAIN - (state.upgrades.hungerDrain || 0) * 0.5 + state.level * 0.5) / hungerSyn;
        
        // Dynamic drain: higher when full, lower when starving.
        // This creates an equilibrium where the blob maintains its hunger
        // but needs upgrades to actually fill the bar and overflow to level up.
        const dynamicDrain = baseDrain * (state.hunger / (maxHunger * 0.4));
        
        const speedSyn = 1 + (state.upgrades.speedSynergy || 0) * 0.5;
        const adBoostMultiplier = state.boostActive ? 3 : 1;
        const starSpeedMultiplier = state.starBoostActive ? 1.5 : 1;
        const speed = (BASE_SPEED + (state.upgrades.speed || 0) * 20) * adBoostMultiplier * starSpeedMultiplier * speedSyn * blobScale;
        
        const suctionSyn = 1 + (state.upgrades.suctionSynergy || 0) * 0.5;
        const suction = (BASE_SUCTION + (state.upgrades.suction || 0) * 15) * suctionSyn * blobScale;
        const suctionStrength = (1 + (state.upgrades.suctionStrength || 0) * 0.5) * suctionSyn;
        
        let newHunger = state.hunger - dynamicDrain * delta;
        if (newHunger < 1) newHunger = 1; // Never truly hits 0

        let { x, y } = state.blobPosition;
        let targetItem = null;
        let minDist = Infinity;

        // Find nearest item that can be eaten
        for (const item of state.items) {
          if (item.tier > maxTier && item.type !== 'star') continue; // Ignore items too big
          const dist = Math.hypot(item.x - x, item.y - y);
          if (dist < minDist) {
            minDist = dist;
            targetItem = item;
          }
        }

        let newWanderAngle = state.wanderAngle;

        // Move towards target or wander
        if (targetItem) {
          const angle = Math.atan2(targetItem.y - y, targetItem.x - x);
          x += Math.cos(angle) * speed * delta;
          y += Math.sin(angle) * speed * delta;
          newWanderAngle = angle;
        } else {
          // Wander smoothly
          newWanderAngle += (Math.random() - 0.5) * delta * 2;
          x += Math.cos(newWanderAngle) * (speed * 0.5) * delta;
          y += Math.sin(newWanderAngle) * (speed * 0.5) * delta;
        }

        const remainingItems = [];
        let moneyGained = 0;
        let foodGained = 0;

        let newStarBoostActive = state.starBoostActive;
        let newStarBoostTimer = state.starBoostTimer;
        let newBoostActive = state.boostActive;
        let newBoostTimer = state.boostTimer;

        const maxDespawnDist = Math.max(width, height) * 2 * blobScale;

        // Check collisions (suction)
        for (const item of state.items) {
          const dist = Math.hypot(item.x - x, item.y - y);
          const canEat = item.tier <= maxTier || item.type === 'star';
          
          // Apply natural floating movement
          item.x += item.vx * delta;
          item.y += item.vy * delta;
          item.rotation += item.rotationSpeed * delta;

          // Magnetic pull effect for items within 3x suction radius
          if (canEat && dist < suction * 3 && dist >= suction) {
            const pullSpeed = (suction * 3 - dist) * suctionStrength * delta;
            const angle = Math.atan2(y - item.y, x - item.x);
            
            // Add velocity towards the blob
            item.vx += Math.cos(angle) * pullSpeed * 0.5;
            item.vy += Math.sin(angle) * pullSpeed * 0.5;
            
            // Spin faster when being sucked in
            item.rotationSpeed += (Math.random() - 0.5) * pullSpeed * 0.01;
            
            // Apply friction to prevent orbiting forever
            item.vx *= 0.95;
            item.vy *= 0.95;
          } else {
            // Natural friction in space
            item.vx *= 0.99;
            item.vy *= 0.99;
          }

          if (canEat && dist < suction) {
            if (item.type === 'star') {
              newStarBoostActive = true;
              newStarBoostTimer = 5;
            } else {
              moneyGained += item.value * adBoostMultiplier;
              foodGained += item.value;
            }
          } else if (dist < maxDespawnDist) {
            remainingItems.push(item);
          }
        }

        let newFoodEaten = state.foodEaten;
        let newLevel = state.level;
        let newMoney = state.money + moneyGained;

        // Apply food
        if (foodGained > 0) {
          const hungerDeficit = maxHunger - newHunger;
          if (foodGained <= hungerDeficit) {
            newHunger += foodGained;
          } else {
            newHunger = maxHunger;
            // Only excess food goes to level progress
            newFoodEaten += (foodGained - hungerDeficit);
          }
        }

        // Level up check
        const foodToNextLevel = 100 * Math.pow(1.5, state.level - 1);
        if (newFoodEaten >= foodToNextLevel) {
          newLevel += 1;
          newFoodEaten -= foodToNextLevel;
        }

        // Spawn items (cap scales with blob size to maintain density, but capped to prevent lag)
        let newSpawnTimer = state.spawnTimer - delta;
        const itemCap = Math.min(200, Math.floor(50 * blobScale));
        
        if (newSpawnTimer <= 0 && remainingItems.length < itemCap) {
          const spawnSyn = 1 + (state.upgrades.spawnSynergy || 0) * 0.5;
          // Spawn rate increases slightly with blob scale to maintain density
          const spawnRate = Math.max(0.01, (BASE_SPAWN_RATE / 1000) * Math.pow(0.85, state.upgrades.spawnRate || 0) / (spawnSyn * Math.sqrt(blobScale)));
          newSpawnTimer = spawnRate;
          
          // Determine tier (spawn mostly around maxTier, up to maxTier + 1 to tease)
          let tier = Math.max(1, maxTier - 2);
          const targetTier = Math.min(maxTier + 1, 10); // Cap at tier 10
          for (let i = tier; i < targetTier; i++) {
            if (Math.random() > 0.4) tier++;
            else break;
          }
          
          const typeRand = Math.random();
          let type: ItemType = 'triangle';
          let baseVal = 1;
          if (typeRand > 0.9) { type = 'hexagon'; baseVal = 4; }
          else if (typeRand > 0.6) { type = 'square'; baseVal = 2; }

          // Scale value by tier
          baseVal *= Math.pow(5, tier - 1);

          const value = baseVal * Math.pow(1.2, state.upgrades.spawnValue || 0) * spawnSyn;

          remainingItems.push({
            id: Math.random().toString(36).substr(2, 9),
            x: x + (Math.random() - 0.5) * width * 1.5 * blobScale,
            y: y + (Math.random() - 0.5) * height * 1.5 * blobScale,
            vx: (Math.random() - 0.5) * 20,
            vy: (Math.random() - 0.5) * 20,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 2,
            type,
            value,
            tier
          });
        }

        // Spawn stars
        let newStarSpawnTimer = state.starSpawnTimer - delta;
        if (newStarSpawnTimer <= 0 && remainingItems.length < itemCap + 5) {
          // Base 15s, reduces with boostSpawnRate upgrade
          const speedSyn = 1 + (state.upgrades.speedSynergy || 0) * 0.5;
          const starSpawnRate = Math.max(2, 15 * Math.pow(0.8, state.upgrades.boostSpawnRate || 0)) / speedSyn;
          newStarSpawnTimer = starSpawnRate;
          
          remainingItems.push({
            id: Math.random().toString(36).substr(2, 9),
            x: x + (Math.random() - 0.5) * width * 1.5 * blobScale,
            y: y + (Math.random() - 0.5) * height * 1.5 * blobScale,
            vx: (Math.random() - 0.5) * 30,
            vy: (Math.random() - 0.5) * 30,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 4,
            type: 'star',
            value: 0,
            tier: 1
          });
        }

        // Handle boost timer
        if (newBoostActive) {
          newBoostTimer -= delta;
          if (newBoostTimer <= 0) {
            newBoostActive = false;
            newBoostTimer = 0;
          }
        }

        if (newStarBoostActive) {
          newStarBoostTimer -= delta;
          if (newStarBoostTimer <= 0) {
            newStarBoostActive = false;
            newStarBoostTimer = 0;
          }
        }

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
      }),
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        ...persistedState,
        upgrades: {
          ...currentState.upgrades,
          ...(persistedState?.upgrades || {})
        }
      }),
    }
  )
);
