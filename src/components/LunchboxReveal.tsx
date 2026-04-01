import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LunchboxRevealProps {
  reward: string;
  onClose: () => void;
}

type Phase = 'enter' | 'shake' | 'burst' | 'reveal' | 'done';

function makeParticles() {
  return Array.from({ length: 14 }, (_, i) => ({
    id: i,
    angle: (i / 14) * 360 + Math.random() * 15,
    delay: Math.random() * 0.12,
    distance: 70 + Math.random() * 80,
    size: 5 + Math.random() * 7,
    color: ['#fbbf24', '#f59e0b', '#8b5cf6', '#ec4899', '#10b981', '#3b82f6', '#ef4444'][i % 7],
  }));
}

function makeConfetti() {
  return Array.from({ length: 24 }, (_, i) => ({
    id: i,
    x: -120 + Math.random() * 240,
    delay: Math.random() * 0.3,
    duration: 0.8 + Math.random() * 0.6,
    size: 4 + Math.random() * 5,
    color: ['#fbbf24', '#f59e0b', '#8b5cf6', '#ec4899', '#10b981', '#3b82f6', '#ef4444', '#f97316'][i % 8],
    rotation: Math.random() * 720 - 360,
  }));
}

function makeSparkles() {
  return Array.from({ length: 6 }, (_, i) => ({
    id: i,
    x: -30 + Math.random() * 60,
    y: -35 + Math.random() * 50,
    delay: i * 0.08,
  }));
}

const RAYS_BG = `conic-gradient(from 0deg, ${
  Array.from({ length: 18 }, (_, i) =>
    `${i % 2 === 0 ? 'rgba(251,191,36,0.25)' : 'transparent'} ${i * 20}deg`
  ).join(', ')
})`;

export function LunchboxReveal({ reward, onClose }: LunchboxRevealProps) {
  const [phase, setPhase] = useState<Phase>('enter');

  const particles = useMemo(makeParticles, []);
  const confetti = useMemo(makeConfetti, []);
  const sparkles = useMemo(makeSparkles, []);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('shake'), 350),
      setTimeout(() => setPhase('burst'), 900),
      setTimeout(() => setPhase('reveal'), 1200),
      setTimeout(() => setPhase('done'), 1500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleDismiss = useCallback(() => {
    if (phase === 'done' || phase === 'reveal') onClose();
  }, [phase, onClose]);

  const isPostBurst = phase === 'burst' || phase === 'reveal' || phase === 'done';
  const isPostReveal = phase === 'reveal' || phase === 'done';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onClick={handleDismiss}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'radial-gradient(circle, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.88) 100%)' }}
    >
      {/* Pulsing radial glow */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 280,
          height: 280,
          background: 'radial-gradient(circle, rgba(251,191,36,0.45) 0%, rgba(251,191,36,0.1) 50%, transparent 70%)',
        }}
        animate={{
          scale: phase === 'shake' ? [1, 1.2, 1] : isPostBurst ? [1.8, 2.2] : 1,
          opacity: isPostBurst ? [0.8, 0] : 0.7,
        }}
        transition={
          phase === 'shake'
            ? { duration: 0.25, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.5 }
        }
      />

      {/* Light rays on burst */}
      {isPostBurst && (
        <motion.div
          className="absolute pointer-events-none"
          initial={{ opacity: 0, scale: 0.3, rotate: 0 }}
          animate={{ opacity: [0, 0.7, 0.15], scale: [0.3, 2.2, 2.8], rotate: 30 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ width: 350, height: 350, background: RAYS_BG, borderRadius: '50%' }}
        />
      )}

      {/* White flash on burst */}
      {phase === 'burst' && (
        <motion.div
          className="absolute inset-0 bg-white pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.85, 0] }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      )}

      {/* Burst particles */}
      {isPostBurst && particles.map(p => (
        <motion.div
          key={`p${p.id}`}
          className="absolute rounded-full pointer-events-none"
          style={{ width: p.size, height: p.size, backgroundColor: p.color }}
          initial={{ x: 0, y: 0, scale: 1.2, opacity: 1 }}
          animate={{
            x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
            y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
            scale: 0,
            opacity: 0,
          }}
          transition={{ duration: 0.55, delay: p.delay, ease: 'easeOut' }}
        />
      ))}

      {/* Confetti rain */}
      {isPostReveal && confetti.map(c => (
        <motion.div
          key={`c${c.id}`}
          className="absolute pointer-events-none"
          style={{
            width: c.size,
            height: c.size * 1.8,
            backgroundColor: c.color,
            borderRadius: 1,
          }}
          initial={{ x: c.x, y: -60, rotate: 0, opacity: 1 }}
          animate={{ y: 220, rotate: c.rotation, opacity: 0 }}
          transition={{ duration: c.duration, delay: c.delay, ease: [0.25, 0.1, 0.25, 1] }}
        />
      ))}

      {/* Lunchbox (visible during enter + shake, exits on burst) */}
      <AnimatePresence>
        {!isPostBurst && (
          <motion.div
            className="relative select-none"
            style={{ fontSize: 80, lineHeight: 1 }}
            initial={{ scale: 0, rotate: -20, y: 30 }}
            animate={{
              scale: 1,
              rotate: phase === 'shake' ? [-4, 5, -7, 8, -10, 10, -6, 4, -3] : 0,
              y: 0,
            }}
            exit={{ scale: 1.6, opacity: 0, y: -10 }}
            transition={
              phase === 'shake'
                ? {
                    rotate: { duration: 0.45, repeat: Infinity, ease: 'easeInOut' },
                    scale: { type: 'spring', damping: 9, stiffness: 220 },
                  }
                : { type: 'spring', damping: 9, stiffness: 220 }
            }
          >
            🎁
            {/* Sparkles during shake */}
            {phase === 'shake' && sparkles.map(s => (
              <motion.div
                key={`s${s.id}`}
                className="absolute text-base pointer-events-none"
                style={{ top: s.y, left: s.x }}
                animate={{ opacity: [0, 1, 0], scale: [0.4, 1.1, 0.4], y: [0, -12, 0] }}
                transition={{ duration: 0.35, repeat: Infinity, delay: s.delay }}
              >
                ✨
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reward reveal */}
      <AnimatePresence>
        {isPostReveal && (
          <motion.div
            className="absolute flex flex-col items-center gap-2.5"
            initial={{ scale: 0, y: 25 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 11, stiffness: 250 }}
          >
            {/* Celebration emoji */}
            <motion.div
              className="text-5xl select-none"
              animate={{ rotate: [0, -12, 12, -6, 6, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              🎉
            </motion.div>

            {/* Reward badge */}
            <motion.div
              className="relative"
              initial={{ scale: 0.3 }}
              animate={{ scale: [0.3, 1.12, 1] }}
              transition={{ duration: 0.35, delay: 0.05, ease: 'easeOut' }}
            >
              {/* Glow ring behind badge */}
              <motion.div
                className="absolute -inset-3 rounded-2xl pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.4) 0%, transparent 70%)' }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.8, 0.5, 0.8] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="relative bg-gradient-to-b from-amber-400 to-amber-500 text-white font-black text-xl sm:text-2xl px-7 py-3.5 rounded-2xl shadow-xl shadow-amber-500/40 border-b-4 border-amber-600">
                {reward}!
              </div>
            </motion.div>

            {/* Tap prompt */}
            {phase === 'done' && (
              <motion.div
                className="text-white/50 text-xs font-body mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.7] }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                Tap anywhere to continue
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
