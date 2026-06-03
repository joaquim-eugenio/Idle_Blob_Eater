// High-frequency "eat" feedback system. Designed for max dopamine per byte:
// confetti bursts + twinkling star sparkles + bright shockwave rings, all
// world-space so they live alongside items and pop in front of the blob.
//
// Performance rules (see .cursor/rules/canvas2d-performance.mdc):
//   - NO shadowBlur on any draw call
//   - Star sparkle uses a single module-level Path2D (reused every frame)
//   - Confetti uses fillRect (cheapest primitive on the GPU)
//   - Particles are viewport-culled before drawing
//   - Mutable module-level cap prevents runaway memory growth
//
// All coordinates are WORLD-space; render inside the camera transform.

export type EatParticleType = 'confetti' | 'sparkle' | 'shockwave';

export interface EatParticle {
  type: EatParticleType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  birth: number;
  life: number;
  color: string;
  size: number;
  startRadius?: number;
  endRadius?: number;
  /** Per-particle gravity (world units / s²). Set at spawn so the arc stays
   *  visually consistent regardless of how big the blob currently is. */
  gravity?: number;
}

// 8-pointed star, built once. Drawn with ctx.scale(s, s) so it stays crisp at any size.
const STAR_PATH: Path2D = (() => {
  const p = new Path2D();
  const outerR = 1, innerR = 0.42;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    if (i === 0) p.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    else p.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  p.closePath();
  return p;
})();

const MAX_PARTICLES = 480;

/**
 * Emit a celebration burst at the location where an item was eaten.
 *
 * `blobRadius` is the BLOB'S CURRENT WORLD-SPACE RADIUS. All particle sizes,
 * speeds and gravity are derived from it so the burst stays visually
 * proportional whether the blob is 10wu or 100wu. Confetti chunks land at
 * roughly 12–24% of the blob radius — small enough to read as "crumbs flying
 * off the food", never bigger than the blob itself.
 *
 * Intensity scales on three axes:
 *   - item value tier (tiny / small / medium / huge)
 *   - active combo count (more = juicier)
 *   - the blob's own radius (keeps proportions correct as it grows)
 */
export function spawnEatBurst(
  particles: EatParticle[],
  x: number,
  y: number,
  itemPalette: string[],
  itemSize: number,
  value: number,
  comboCount: number,
  blobRadius: number,
  now: number,
): void {
  let valueTier = 0;
  if (value >= 50) valueTier = 3;
  else if (value >= 10) valueTier = 2;
  else if (value >= 2) valueTier = 1;

  const comboBoost = 1 + Math.min(2, comboCount * 0.05);
  const intensity = (1 + valueTier * 0.4) * comboBoost;
  const useGold = comboCount >= 5 || valueTier >= 2;
  const useRainbow = comboCount >= 10;

  // Base units derived from blob radius. sizeUnit is ~10% of blob radius so
  // particles can never visually dominate the blob; speedUnit makes particles
  // cover ~1 blob radius per 0.25s of life.
  const sizeUnit = blobRadius * 0.1;
  const speedUnit = blobRadius * 4;
  const gravity = blobRadius * 25;

  // ---- Confetti chunks ----
  const confettiCount = Math.round((7 + valueTier * 3) * comboBoost);
  for (let i = 0; i < confettiCount; i++) {
    const angle = (i / confettiCount) * Math.PI * 2 + Math.random() * 0.7;
    const speed = (1.2 + Math.random() * 2.8) * speedUnit * intensity;
    let color: string;
    if (useRainbow && i % 3 === 0) {
      color = RAINBOW[i % RAINBOW.length];
    } else if (useGold && i % 4 === 0) {
      color = '#fde047';
    } else {
      color = itemPalette[i % itemPalette.length] || '#fbbf24';
    }
    particles.push({
      type: 'confetti',
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.0 * speedUnit,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 22,
      birth: now,
      life: 0.55 + Math.random() * 0.35,
      color,
      size: (1.2 + Math.random() * 1.2) * sizeUnit,
      gravity,
    });
  }

  // ---- Star sparkles ----
  const sparkleCount = 4 + Math.min(8, comboCount) + valueTier * 2;
  for (let i = 0; i < sparkleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = (0.8 + Math.random() * 2.0) * speedUnit;
    particles.push({
      type: 'sparkle',
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.6 * speedUnit,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 8,
      birth: now,
      life: 0.45 + Math.random() * 0.3,
      color: i % 2 === 0 ? '#ffffff' : (useGold ? '#fde047' : (itemPalette[1] || '#ffffff')),
      size: (0.9 + Math.random() * 1.1) * sizeUnit,
    });
  }

  // ---- White shockwave (sized from the item itself, already palette-scaled) ----
  particles.push({
    type: 'shockwave', x, y, vx: 0, vy: 0,
    rotation: 0, rotationSpeed: 0,
    birth: now, life: 0.38,
    color: '#ffffff',
    size: itemSize,
    startRadius: itemSize * 0.35,
    endRadius: itemSize * (2.6 + valueTier * 0.5),
  });

  // ---- Golden combo halo (only on bigger eats / streaks) ----
  if (useGold) {
    particles.push({
      type: 'shockwave', x, y, vx: 0, vy: 0,
      rotation: 0, rotationSpeed: 0,
      birth: now, life: 0.55,
      color: comboCount >= 10 ? '#f59e0b' : '#fbbf24',
      size: itemSize * 1.2,
      startRadius: itemSize * 0.5,
      endRadius: itemSize * (3.5 + Math.min(2.5, comboCount * 0.1)),
    });
  }

  if (particles.length > MAX_PARTICLES) {
    particles.splice(0, particles.length - MAX_PARTICLES);
  }
}

/**
 * Emit a centered "milestone" burst (combo 5/10/25/...). Bigger, brighter,
 * uses the milestone's signature color instead of the item palette. All
 * sizes / speeds are derived from `blobRadius` so the celebration scales
 * with the blob.
 */
export function spawnMilestoneBurst(
  particles: EatParticle[],
  x: number,
  y: number,
  signatureColor: string,
  blobRadius: number,
  now: number,
): void {
  const sizeUnit = blobRadius * 0.13;   // slightly chunkier than a regular eat
  const speedUnit = blobRadius * 5;     // a bit faster than a regular eat
  const gravity = blobRadius * 25;

  const colors = [signatureColor, '#fde047', '#ffffff', signatureColor];
  const count = 22;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const speed = (1.6 + Math.random() * 1.2) * speedUnit;
    particles.push({
      type: 'confetti',
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.3 * speedUnit,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 25,
      birth: now,
      life: 0.8 + Math.random() * 0.4,
      color: colors[i % colors.length],
      size: (1.3 + Math.random() * 1.3) * sizeUnit,
      gravity,
    });
  }
  for (let i = 0; i < 12; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = (0.8 + Math.random() * 2.2) * speedUnit;
    particles.push({
      type: 'sparkle',
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.9 * speedUnit,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 10,
      birth: now,
      life: 0.6 + Math.random() * 0.4,
      color: i % 2 === 0 ? '#ffffff' : '#fde047',
      size: (1.0 + Math.random() * 1.2) * sizeUnit,
    });
  }
  // Double shockwave — radii scale with blobRadius too.
  particles.push({
    type: 'shockwave', x, y, vx: 0, vy: 0,
    rotation: 0, rotationSpeed: 0,
    birth: now, life: 0.55,
    color: '#ffffff', size: blobRadius,
    startRadius: blobRadius * 0.6,
    endRadius: blobRadius * 5.5,
  });
  particles.push({
    type: 'shockwave', x, y, vx: 0, vy: 0,
    rotation: 0, rotationSpeed: 0,
    birth: now, life: 0.7,
    color: signatureColor, size: blobRadius,
    startRadius: blobRadius * 0.9,
    endRadius: blobRadius * 7,
  });

  if (particles.length > MAX_PARTICLES) {
    particles.splice(0, particles.length - MAX_PARTICLES);
  }
}

const RAINBOW = ['#ef4444', '#f97316', '#facc15', '#22c55e', '#06b6d4', '#a855f7', '#ec4899'];

/**
 * Step physics and render. Call inside the camera transform, AFTER the blob
 * (so particles pop in front for maximum perceived impact).
 *
 * delta is in seconds; clamped internally to avoid huge skips on tab-refocus.
 */
export function updateAndDrawParticles(
  ctx: CanvasRenderingContext2D,
  particles: EatParticle[],
  now: number,
  delta: number,
  viewL: number, viewR: number, viewT: number, viewB: number,
  zoom: number,
): void {
  const dt = Math.min(delta, 0.05);
  if (particles.length === 0) return;

  // Drop dead particles + simulate (single pass)
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    const age = now - p.birth;
    if (age >= p.life) {
      particles.splice(i, 1);
      continue;
    }
    const t = age / p.life;

    if (p.type === 'confetti') {
      p.vy += (p.gravity ?? 380) * dt;
      p.vx *= 0.97;
      p.vy *= 0.985;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rotation += p.rotationSpeed * dt;
      if (p.x < viewL || p.x > viewR || p.y < viewT || p.y > viewB) continue;

      const alpha = t < 0.65 ? 1 : 1 - (t - 0.65) / 0.35;
      const w = p.size * (1 - t * 0.15);
      const h = w * 0.55;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.fillRect(-w * 0.5, -h * 0.5, w, h);
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.fillRect(-w * 0.5, -h * 0.5, w, h * 0.33);
      ctx.restore();
    } else if (p.type === 'sparkle') {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.9;
      p.vy *= 0.9;
      p.rotation += p.rotationSpeed * dt;
      if (p.x < viewL || p.x > viewR || p.y < viewT || p.y > viewB) continue;

      const alpha = t < 0.4 ? 1 : 1 - (t - 0.4) / 0.6;
      const s = p.size * (0.4 + Math.sin(t * Math.PI) * 0.9);
      if (s <= 0) continue;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.scale(s, s);
      ctx.fillStyle = p.color;
      ctx.fill(STAR_PATH);
      ctx.restore();
    } else if (p.type === 'shockwave') {
      const sr = p.startRadius || 0;
      const er = p.endRadius || sr;
      const easeT = 1 - (1 - t) * (1 - t);
      const radius = sr + (er - sr) * easeT;
      // Cull when fully offscreen (cheap AABB vs circle approximation)
      if (
        p.x + radius < viewL || p.x - radius > viewR ||
        p.y + radius < viewT || p.y - radius > viewB
      ) continue;

      const alpha = (1 - t) * 0.85;
      const lw = Math.max(1, (4 * (1 - t * 0.6)) / zoom);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = p.color;
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }
}

// Vibration throttling lives with the caller (it has the timer ref). We expose
// a pure helper that picks an appropriate pattern based on context.
export function pickHapticPattern(value: number, comboCount: number): number | number[] {
  if (comboCount >= 25) return [30, 20, 30, 20, 40];
  if (comboCount >= 10) return [22, 18, 28];
  if (comboCount >= 5) return 28;
  if (value >= 50) return 24;
  if (value >= 10) return 18;
  return 12;
}

/**
 * Fire-and-forget haptic. No-op on platforms without Vibration API or when
 * the user has disabled haptics in settings. Caller is responsible for
 * rate-limiting so we don't drain battery on frenzy taps.
 */
export function triggerHaptic(pattern: number | number[]): void {
  if (typeof navigator === 'undefined') return;
  const v = (navigator as Navigator & { vibrate?: (p: number | number[]) => boolean }).vibrate;
  if (typeof v !== 'function') return;
  try { v.call(navigator, pattern); } catch { /* ignore */ }
}
