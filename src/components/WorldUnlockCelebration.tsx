import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StarIcon, TreeIcon } from './icons';
import { useGameStore } from '../store/gameStore';
import { WORLDS, type WorldDef } from '../lib/levels';
import { getItemsForWorld, type ItemDef } from '../lib/itemCatalog';
import { pickQuote, WORLD_UNLOCK_QUOTES } from '../lib/blobQuotes';

function getWorldIndex(world: WorldDef): number {
  return WORLDS.findIndex(w => w.id === world.id) + 1;
}

function getFiniteWorldCount(): number {
  return WORLDS.filter(w => Number.isFinite(w.levelRange[1])).length;
}

function pickPreviewItems(world: WorldDef, count = 4): ItemDef[] {
  const pool = getItemsForWorld(world.id);
  const sorted = [...pool].sort((a, b) => b.baseValue - a.baseValue || b.sizeTier - a.sizeTier);
  const picks: ItemDef[] = [];
  const step = Math.max(1, Math.floor(sorted.length / count));
  for (let i = 0; i < count && i * step < sorted.length; i++) {
    picks.push(sorted[i * step]);
  }
  return picks;
}

function ItemPreview({ item, palette, delay }: { key?: string; item: ItemDef; palette: string[]; delay: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = 56 * dpr;
    canvas.height = 56 * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, 56, 56);
    ctx.save();
    ctx.translate(28, 28);
    item.draw(ctx, 24, palette);
    ctx.restore();
  }, [item, palette]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.7 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: 'spring', damping: 15, stiffness: 200 }}
      className="flex flex-col items-center gap-1"
    >
      <div className="w-14 h-14 rounded-xl bg-white/80 border-2 border-white/50 shadow-md flex items-center justify-center backdrop-blur-sm">
        <canvas
          ref={canvasRef}
          width={56}
          height={56}
          className="w-[56px] h-[56px]"
        />
      </div>
      <span className="text-[9px] font-bold text-white/80 max-w-[60px] text-center leading-tight truncate">
        {item.name}
      </span>
    </motion.div>
  );
}

const PARTICLE_COUNT = 35;

function ConfettiBurst({ palette }: { palette: string[] }) {
  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const angle = (Math.PI * 2 * i) / PARTICLE_COUNT + (Math.random() - 0.5) * 0.8;
      const distance = 120 + Math.random() * 180;
      const color = palette[i % palette.length];
      const size = 6 + Math.random() * 6;
      const isCircle = Math.random() > 0.5;
      return { angle, distance, color, size, isCircle, rotation: Math.random() * 720 - 360 };
    });
  }, [palette]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          initial={{
            x: '-50%',
            y: '-50%',
            opacity: 1,
            scale: 0,
            rotate: 0,
          }}
          animate={{
            x: `calc(-50% + ${Math.cos(p.angle) * p.distance}px)`,
            y: `calc(-50% + ${Math.sin(p.angle) * p.distance + 80}px)`,
            opacity: 0,
            scale: [0, 1.2, 0.8],
            rotate: p.rotation,
          }}
          transition={{
            duration: 1.4 + Math.random() * 0.6,
            ease: [0.2, 0.8, 0.3, 1],
            delay: Math.random() * 0.15,
          }}
          className="absolute left-1/2 top-[40%]"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.isCircle ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
}

export function WorldUnlockCelebration() {
  const pending = useGameStore(s => s.pendingWorldUnlock);
  const clearPendingWorldUnlock = useGameStore(s => s.clearPendingWorldUnlock);
  const advanceToNextLevel = useGameStore(s => s.advanceToNextLevel);
  const openSkillTree = useGameStore(s => s.openSkillTree);

  const [phase, setPhase] = useState(0);

  const stableFrom = useRef<WorldDef | null>(null);
  const stableTo = useRef<WorldDef | null>(null);

  if (pending && !stableFrom.current) {
    stableFrom.current = pending.from;
    stableTo.current = pending.to;
  }

  const fromWorld = stableFrom.current;
  const toWorld = stableTo.current;

  useEffect(() => {
    if (!pending) {
      setPhase(0);
      stableFrom.current = null;
      stableTo.current = null;
      return;
    }
    setPhase(1);
    const t2 = setTimeout(() => setPhase(2), 1200);
    const t3 = setTimeout(() => setPhase(3), 2200);
    const t4 = setTimeout(() => setPhase(4), 3000);
    return () => { clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [pending]);

  const previewItems = useMemo(
    () => toWorld ? pickPreviewItems(toWorld) : [],
    [toWorld],
  );

  const hungerQuote = useMemo(
    () => pending ? pickQuote(WORLD_UNLOCK_QUOTES) : '',
    [pending],
  );

  const handleExplore = useCallback(() => {
    clearPendingWorldUnlock();
    advanceToNextLevel();
  }, [clearPendingWorldUnlock, advanceToNextLevel]);

  const handleSkills = useCallback(() => {
    clearPendingWorldUnlock();
    advanceToNextLevel();
    openSkillTree();
  }, [clearPendingWorldUnlock, advanceToNextLevel, openSkillTree]);

  if (!fromWorld || !toWorld) return null;

  const worldIndex = getWorldIndex(toWorld);
  const totalWorlds = getFiniteWorldCount();

  return (
    <AnimatePresence>
      {pending && (
        <motion.div
          key="world-unlock"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 z-40 flex items-center justify-center"
        >
          {/* Backdrop: dark base + floating palette orbs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-black/85"
          />
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: [0, 0.45, 0.35, 0.45],
                scale: [0.5, 1, 1.1, 1],
                x: ['-10%', '5%', '-5%', '5%'],
                y: ['-5%', '10%', '5%', '10%'],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-[20%] -left-[20%] w-[70%] h-[70%] rounded-full"
              style={{
                background: toWorld.palette[0],
                filter: 'blur(80px)',
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: [0, 0.4, 0.3, 0.4],
                scale: [0.5, 1.1, 1, 1.1],
                x: ['10%', '-5%', '5%', '-5%'],
                y: ['5%', '-10%', '-5%', '-10%'],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
              className="absolute -bottom-[20%] -right-[20%] w-[65%] h-[65%] rounded-full"
              style={{
                background: toWorld.palette[1],
                filter: 'blur(80px)',
              }}
            />
            {toWorld.palette[2] && (
              <motion.div
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{
                  opacity: [0, 0.25, 0.2, 0.25],
                  scale: [0.4, 0.9, 1, 0.9],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                className="absolute top-[30%] left-[20%] w-[50%] h-[50%] rounded-full"
                style={{
                  background: toWorld.palette[2],
                  filter: 'blur(90px)',
                }}
              />
            )}
          </div>

          {/* Confetti */}
          {phase >= 1 && <ConfettiBurst palette={fromWorld.palette} />}
          {phase >= 2 && <ConfettiBurst palette={toWorld.palette} />}

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center w-full max-w-sm px-6">

            {/* Phase 1: World Complete */}
            <AnimatePresence mode="wait">
              {phase >= 1 && phase < 2 && (
                <motion.div
                  key="phase1"
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">
                    World Complete
                  </div>
                  <div
                    className="text-4xl font-black text-white drop-shadow-lg text-center"
                    style={{ textShadow: `0 0 30px ${fromWorld.palette[0]}80, 0 4px 12px rgba(0,0,0,0.4)` }}
                  >
                    {fromWorld.name}
                  </div>
                  <div
                    className="w-32 h-1.5 rounded-full mt-2"
                    style={{ background: `linear-gradient(90deg, ${fromWorld.palette[0]}, ${fromWorld.palette[1]}, ${fromWorld.palette[2]})` }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Phase 2+: New World */}
            <AnimatePresence>
              {phase >= 2 && (
                <motion.div
                  key="phase2"
                  initial={{ scale: 0.5, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ type: 'spring', damping: 14, stiffness: 180 }}
                  className="flex flex-col items-center gap-3"
                >
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-2"
                  >
                    <StarIcon size={16} className="text-amber-300" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
                      New World Unlocked
                    </span>
                    <StarIcon size={16} className="text-amber-300" />
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.15, type: 'spring', damping: 10, stiffness: 150 }}
                    className="text-5xl font-black text-white text-center world-glow-pulse"
                    style={{
                      textShadow: `0 0 40px ${toWorld.palette[0]}90, 0 0 80px ${toWorld.palette[1]}50, 0 4px 12px rgba(0,0,0,0.5)`,
                    }}
                  >
                    {toWorld.name}
                  </motion.div>

                  {/* Palette bar */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
                    className="w-48 h-2 rounded-full origin-center"
                    style={{
                      background: `linear-gradient(90deg, ${toWorld.palette[0]}, ${toWorld.palette[1]}, ${toWorld.palette[2]})`,
                      boxShadow: `0 0 20px ${toWorld.palette[0]}60`,
                    }}
                  />

                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="text-sm italic text-white/60 text-center font-body mt-1"
                  >
                    {hungerQuote}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Phase 3: Item previews */}
            <AnimatePresence>
              {phase >= 3 && previewItems.length > 0 && (
                <motion.div
                  key="phase3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start justify-center gap-3 mt-6"
                >
                  {previewItems.map((item, i) => (
                    <ItemPreview
                      key={item.id}
                      item={item}
                      palette={toWorld.palette}
                      delay={i * 0.1}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Phase 4: Progress badge + CTAs */}
            <AnimatePresence>
              {phase >= 4 && (
                <motion.div
                  key="phase4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', damping: 18, stiffness: 200 }}
                  className="flex flex-col items-center gap-3 mt-8 w-full"
                >
                  <div className="text-[11px] font-bold text-white/50 uppercase tracking-wider">
                    World {worldIndex} of {totalWorlds}
                  </div>

                  <button
                    onClick={handleExplore}
                    className="btn-game w-full py-3.5 rounded-2xl font-black text-lg text-white border-b-4 transition-all active:scale-95"
                    style={{
                      backgroundColor: toWorld.palette[0],
                      borderBottomColor: toWorld.palette[1],
                      boxShadow: `0 0 24px ${toWorld.palette[0]}50`,
                    }}
                  >
                    Explore {toWorld.name}
                  </button>

                  <button
                    onClick={handleSkills}
                    className="btn-game flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl font-bold text-sm text-white/70 bg-white/10 border-2 border-white/20 transition-all active:scale-95"
                  >
                    <TreeIcon size={16} />
                    Upgrade Skills First
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
