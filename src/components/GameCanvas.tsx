import React, { useEffect, useRef, useCallback } from 'react';
import { useGameStore, Item } from '../store/gameStore';
import { BASE_SUCTION, BIOMES, BLOB_SKINS } from '../lib/constants';

const LEVEL_COLORS = [
  '#0088ff', '#22c55e', '#f97316', '#ef4444',
  '#a855f7', '#ec4899', '#14b8a6', '#eab308',
];

function getBlobColor(level: number, skinId: string): string {
  const skin = BLOB_SKINS.find(s => s.id === skinId);
  if (skin && skin.colors.length > 0) {
    return skin.colors[(level - 1) % skin.colors.length];
  }
  if (level <= LEVEL_COLORS.length) return LEVEL_COLORS[level - 1];
  return `hsl(${(level * 47) % 360}, 80%, 55%)`;
}

interface FloatingText {
  x: number; y: number; text: string; birth: number; value: number;
}

interface Ripple {
  x: number; y: number; birth: number;
}

const NUM_NODES = 16;
const SPRING_K = 0.15;
const DAMPING = 0.65;

class BlobNode {
  x: number; y: number; vx: number; vy: number;
  constructor(x: number, y: number) {
    this.x = x; this.y = y; this.vx = 0; this.vy = 0;
  }
}

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<BlobNode[]>([]);
  const prevItemsRef = useRef<Item[]>([]);
  const camPosRef = useRef({ x: 200, y: 300 });
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);

  const handleTap = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    let clientX: number, clientY: number;
    if ('touches' in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const screenX = clientX - rect.left;
    const screenY = clientY - rect.top;

    const state = useGameStore.getState();
    const blobScale = 1 + (state.level - 1) * 0.35;
    const zoom = 1 / blobScale;

    const worldX = camPosRef.current.x + (screenX - canvas.width / 2) / zoom;
    const worldY = camPosRef.current.y + (screenY - canvas.height / 2) / zoom;

    ripplesRef.current.push({ x: worldX, y: worldY, birth: performance.now() / 1000 });

    state.tapFood(worldX, worldY);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      const state = useGameStore.getState();
      const { blobPosition, items, level, upgrades, starBoostActive, boostActive,
        currentBiome, currentSkin, comboCount, hunger, unlockedSkillNodes } = state;

      const biome = BIOMES.find(b => b.id === currentBiome) || BIOMES[0];
      const blobVisualScale = 1 + (level - 1) * 0.35;

      // Clear with biome background
      ctx.fillStyle = biome.bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();

      // Camera
      const targetCamX = blobPosition.x;
      const targetCamY = blobPosition.y;
      if (Math.hypot(camPosRef.current.x - targetCamX, camPosRef.current.y - targetCamY) > 1000) {
        camPosRef.current.x = targetCamX;
        camPosRef.current.y = targetCamY;
      } else {
        camPosRef.current.x += (targetCamX - camPosRef.current.x) * 0.1;
        camPosRef.current.y += (targetCamY - camPosRef.current.y) * 0.1;
      }

      const zoom = 1 / blobVisualScale;
      const maxTier = level;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-camPosRef.current.x, -camPosRef.current.y);

      // Grid
      ctx.strokeStyle = biome.gridColor;
      ctx.lineWidth = 1 / zoom;
      const gridSize = 100;
      const startX = Math.floor((camPosRef.current.x - canvas.width / 2 / zoom) / gridSize) * gridSize;
      const endX = startX + canvas.width / zoom + gridSize;
      const startY = Math.floor((camPosRef.current.y - canvas.height / 2 / zoom) / gridSize) * gridSize;
      const endY = startY + canvas.height / zoom + gridSize;
      ctx.beginPath();
      for (let gx = startX; gx <= endX; gx += gridSize) { ctx.moveTo(gx, startY); ctx.lineTo(gx, endY); }
      for (let gy = startY; gy <= endY; gy += gridSize) { ctx.moveTo(startX, gy); ctx.lineTo(endX, gy); }
      ctx.stroke();

      // Ambient particles for space biome
      if (currentBiome === 'space') {
        const time = performance.now() / 1000;
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        for (let i = 0; i < 30; i++) {
          const sx = camPosRef.current.x + Math.sin(i * 73.7 + time * 0.1) * canvas.width / zoom;
          const sy = camPosRef.current.y + Math.cos(i * 91.3 + time * 0.07) * canvas.height / zoom;
          ctx.beginPath();
          ctx.arc(sx, sy, 1.5 / zoom, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Suction radius
      const gameBlobScale = 1 + (level - 1) * 0.15;
      const suctionSyn = 1 + (upgrades.suctionSynergy || 0) * 0.5;
      const suctionRadius = (BASE_SUCTION + (upgrades.suction || 0) * 15) * suctionSyn * Math.sqrt(gameBlobScale);
      const hasSuctionCone = unlockedSkillNodes.includes('hunt_suction_cone');
      const hasFrenzy = unlockedSkillNodes.includes('survival_frenzy');
      const hasDash = unlockedSkillNodes.includes('hunt_dash_on_star');

      // Vortex effect when suction is high
      if (suctionRadius > 120) {
        const time = performance.now() / 1000;
        const vortexAlpha = Math.min(0.3, (suctionRadius - 120) / 300);
        for (let i = 0; i < 8; i++) {
          const angle = time * 2 + (i / 8) * Math.PI * 2;
          const r = suctionRadius * (0.4 + Math.sin(time * 3 + i) * 0.15);
          ctx.beginPath();
          ctx.arc(
            blobPosition.x + Math.cos(angle) * r,
            blobPosition.y + Math.sin(angle) * r,
            3 / zoom, 0, Math.PI * 2
          );
          ctx.fillStyle = `rgba(59, 130, 246, ${vortexAlpha})`;
          ctx.fill();
        }
      }

      ctx.beginPath();
      ctx.arc(blobPosition.x, blobPosition.y, suctionRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.lineWidth = 2 / zoom;
      ctx.setLineDash([8 / zoom, 8 / zoom]);
      ctx.stroke();
      ctx.setLineDash([]);

      if (hasSuctionCone) {
        const coneDir = Math.atan2(blobPosition.y - camPosRef.current.y, blobPosition.x - camPosRef.current.x);
        const coneSpread = Math.PI / 3;
        ctx.beginPath();
        ctx.moveTo(blobPosition.x, blobPosition.y);
        ctx.arc(blobPosition.x, blobPosition.y, suctionRadius * 1.25, coneDir - coneSpread, coneDir + coneSpread);
        ctx.closePath();
        ctx.fillStyle = 'rgba(59, 130, 246, 0.12)';
        ctx.fill();
      }

      // Ripple effects
      const now = performance.now() / 1000;
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const rip = ripplesRef.current[i];
        const age = now - rip.birth;
        if (age > 0.6) { ripplesRef.current.splice(i, 1); continue; }
        const progress = age / 0.6;
        const ripRadius = 20 + progress * 60;
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, ripRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(59, 130, 246, ${0.5 * (1 - progress)})`;
        ctx.lineWidth = (3 / zoom) * (1 - progress);
        ctx.stroke();
      }

      // Items
      const baseItemScale = 1 + (upgrades.spawnValue || 0) * 0.15;
      items.forEach(item => {
        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.rotate(item.rotation || 0);
        const tierScale = Math.pow(1.18, item.tier - 1);
        const itemScale = baseItemScale * tierScale * (item.isTapFood ? 1.2 : 1);
        ctx.scale(itemScale, itemScale);
        const canEat = item.tier <= maxTier || item.type === 'star';
        if (!canEat) ctx.globalAlpha = 0.4;

        if (item.type === 'triangle') {
          ctx.fillStyle = biome.foodColors.triangle;
          ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(10, 10); ctx.lineTo(-10, 10); ctx.fill();
        } else if (item.type === 'square') {
          ctx.fillStyle = item.isTapFood ? '#60a5fa' : biome.foodColors.square;
          ctx.fillRect(-10, -10, 20, 20);
          if (item.isTapFood) {
            ctx.strokeStyle = '#93c5fd';
            ctx.lineWidth = 2;
            ctx.strokeRect(-10, -10, 20, 20);
          }
        } else if (item.type === 'hexagon') {
          ctx.fillStyle = biome.foodColors.hexagon;
          ctx.beginPath();
          for (let hi = 0; hi < 6; hi++) {
            const ha = (hi / 6) * Math.PI * 2;
            const px = Math.cos(ha) * 12, py = Math.sin(ha) * 12;
            if (hi === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.fill();
        } else if (item.type === 'star') {
          const time = performance.now() / 1000;
          ctx.shadowBlur = 40; ctx.shadowColor = '#e9d5ff';
          const pulse = 1 + Math.sin(time * 8 + item.x) * 0.15;
          ctx.scale(pulse, pulse);
          ctx.fillStyle = '#d8b4fe';
          ctx.beginPath();
          for (let si = 0; si < 10; si++) {
            const sa = (si / 10) * Math.PI * 2 - Math.PI / 2;
            const sr = si % 2 === 0 ? 18 : 7;
            if (si === 0) ctx.moveTo(Math.cos(sa) * sr, Math.sin(sa) * sr);
            else ctx.lineTo(Math.cos(sa) * sr, Math.sin(sa) * sr);
          }
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          for (let si = 0; si < 10; si++) {
            const sa = (si / 10) * Math.PI * 2 - Math.PI / 2;
            const sr = si % 2 === 0 ? 8 : 3;
            if (si === 0) ctx.moveTo(Math.cos(sa) * sr, Math.sin(sa) * sr);
            else ctx.lineTo(Math.cos(sa) * sr, Math.sin(sa) * sr);
          }
          ctx.fill();
          ctx.shadowBlur = 10; ctx.shadowColor = '#ffffff';
          for (let si = 0; si < 12; si++) {
            const sp = si % 2 === 0 ? 4 : -3;
            const sparkA = time * sp + (si * Math.PI * 2) / 12;
            const sparkD = 25 + Math.sin(time * 5 + si * 2) * 15;
            const sparkSize = Math.max(0, 2.5 + Math.sin(time * 10 + si));
            if (sparkSize > 0) {
              ctx.fillStyle = si % 3 === 0 ? '#f3e8ff' : '#ffffff';
              ctx.beginPath();
              ctx.arc(Math.cos(sparkA) * sparkD, Math.sin(sparkA) * sparkD, sparkSize, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          ctx.shadowBlur = 0;
        }
        ctx.restore();
      });

      // Blob
      const baseSize = 60 * blobVisualScale;
      const time = performance.now() / 1000;
      const breath = Math.sin(time * 2) * (baseSize * 0.05);
      const radius = (baseSize + breath) / 2;
      const nodes = nodesRef.current;
      const hungerSyn = 1 + (upgrades.hungerSynergy || 0) * 0.5;
      const maxHunger = (100 + (upgrades.hungerMax || 0) * 40) * hungerSyn;
      const hungerPct = hunger / maxHunger;
      const frenzyActive = hasFrenzy && hungerPct < 0.35;

      if (nodes.length === 0) {
        for (let i = 0; i < NUM_NODES; i++) {
          const angle = (i / NUM_NODES) * Math.PI * 2;
          nodes.push(new BlobNode(blobPosition.x + Math.cos(angle) * radius, blobPosition.y + Math.sin(angle) * radius));
        }
      }

      // Eating bump
      const currentItems = items;
      const prevItems = prevItemsRef.current;
      if (prevItems.length > 0) {
        const currentItemIds = new Set(currentItems.map(i => i.id));
        const eatenItems = prevItems.filter(i => !currentItemIds.has(i.id));
        eatenItems.forEach(item => {
          const dist = Math.hypot(item.x - blobPosition.x, item.y - blobPosition.y);
          if (dist < suctionRadius + 50) {
            if (item.type !== 'star' && item.value > 0) {
              floatingTextsRef.current.push({
                x: item.x, y: item.y,
                text: `+$${Math.floor(item.value)}`,
                birth: now, value: item.value,
              });
            }
            const angle = Math.atan2(item.y - blobPosition.y, item.x - blobPosition.x);
            for (let ni = 0; ni < NUM_NODES; ni++) {
              const nodeAngle = (ni / NUM_NODES) * Math.PI * 2;
              let diff = Math.abs(nodeAngle - angle);
              if (diff > Math.PI) diff = 2 * Math.PI - diff;
              if (diff < Math.PI / 2) {
                const force = (Math.PI / 2 - diff) * 25 * blobVisualScale;
                nodes[ni].vx += Math.cos(angle) * force;
                nodes[ni].vy += Math.sin(angle) * force;
              }
            }
          }
        });
      }
      prevItemsRef.current = currentItems;

      // Physics
      for (let i = 0; i < NUM_NODES; i++) {
        const node = nodes[i];
        const angle = (i / NUM_NODES) * Math.PI * 2;
        const targetX = blobPosition.x + Math.cos(angle) * radius;
        const targetY = blobPosition.y + Math.sin(angle) * radius;
        node.vx += (targetX - node.x) * SPRING_K;
        node.vy += (targetY - node.y) * SPRING_K;
        node.vx *= DAMPING; node.vy *= DAMPING;
        node.x += node.vx; node.y += node.vy;
      }

      // Draw blob body
      const baseColor = getBlobColor(level, currentSkin);
      if (starBoostActive) {
        ctx.shadowBlur = 30; ctx.shadowColor = '#d8b4fe'; ctx.fillStyle = '#a855f7';
      } else if (boostActive) {
        ctx.shadowBlur = 20; ctx.shadowColor = '#facc15'; ctx.fillStyle = baseColor;
      } else if (frenzyActive) {
        ctx.shadowBlur = 20; ctx.shadowColor = '#fb923c'; ctx.fillStyle = '#fb923c';
      } else {
        ctx.shadowBlur = 0; ctx.fillStyle = baseColor;
      }

      ctx.beginPath();
      let prevNode = nodes[NUM_NODES - 1];
      let firstMidX = (prevNode.x + nodes[0].x) / 2;
      let firstMidY = (prevNode.y + nodes[0].y) / 2;
      ctx.moveTo(firstMidX, firstMidY);
      for (let i = 0; i < NUM_NODES; i++) {
        const currNode = nodes[i];
        const nextNode = nodes[(i + 1) % NUM_NODES];
        ctx.quadraticCurveTo(currNode.x, currNode.y, (currNode.x + nextNode.x) / 2, (currNode.y + nextNode.y) / 2);
      }
      ctx.fill();
      ctx.shadowBlur = 0;

      // Face
      let cx = 0, cy = 0;
      for (let i = 0; i < NUM_NODES; i++) { cx += nodes[i].x; cy += nodes[i].y; }
      cx /= NUM_NODES; cy /= NUM_NODES;
      let dx = blobPosition.x - cx, dy = blobPosition.y - cy;
      const maxParallax = radius * 0.4;
      const parallaxDist = Math.hypot(dx, dy);
      if (parallaxDist > maxParallax) { dx = (dx / parallaxDist) * maxParallax; dy = (dy / parallaxDist) * maxParallax; }

      ctx.fillStyle = '#1a237e';

      // Blob expressions
      const isEating = comboCount > 0;
      const isSleepy = hungerPct < 0.25;
      const isExcited = starBoostActive;

      const eyeY = cy - radius * 0.1 + dy;
      const eyeSize = radius * 0.08;

      if (isSleepy) {
        // Half-closed eyes
        ctx.fillRect(cx - radius * 0.3 + dx - eyeSize, eyeY - 1, eyeSize * 2, 3);
        ctx.fillRect(cx + radius * 0.2 + dx - eyeSize, eyeY - 1, eyeSize * 2, 3);
      } else if (isExcited) {
        // Wide eyes
        ctx.beginPath(); ctx.arc(cx - radius * 0.25 + dx, eyeY, eyeSize * 1.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + radius * 0.25 + dx, eyeY, eyeSize * 1.3, 0, Math.PI * 2); ctx.fill();
        // Sparkle in eyes
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(cx - radius * 0.23 + dx, eyeY - eyeSize * 0.4, eyeSize * 0.4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + radius * 0.27 + dx, eyeY - eyeSize * 0.4, eyeSize * 0.4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#1a237e';
      } else {
        // Normal eyes
        ctx.beginPath(); ctx.arc(cx - radius * 0.25 + dx, eyeY, eyeSize, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + radius * 0.25 + dx, eyeY, eyeSize, 0, Math.PI * 2); ctx.fill();
      }

      // Mouth
      const mouthY = cy + radius * 0.15 + dy;
      const mouthX = cx + dx;
      if (isEating && comboCount >= 3) {
        // Open mouth
        ctx.beginPath();
        ctx.arc(mouthX, mouthY, radius * 0.12, 0, Math.PI * 2);
        ctx.fill();
      } else if (isSleepy) {
        // Tiny mouth
        ctx.beginPath();
        ctx.arc(mouthX, mouthY + radius * 0.02, radius * 0.05, 0, Math.PI, false);
        ctx.fill();
      } else if (isExcited || isEating) {
        // Big smile
        ctx.beginPath();
        ctx.arc(mouthX, mouthY, radius * 0.13, 0, Math.PI, false);
        ctx.fill();
      } else {
        // Normal smile
        ctx.beginPath();
        ctx.arc(mouthX, mouthY, radius * 0.1, 0, Math.PI, false);
        ctx.fill();
      }

      // Level-up celebration
      const levelUpAge = (Date.now() - state.levelUpTime) / 1000;
      if (levelUpAge < 1.5 && state.levelUpTime > 0) {
        const progress = levelUpAge / 1.5;
        const ringRadius = radius * (1.5 + progress * 3);
        const ringAlpha = 1 - progress;

        // Screen flash
        if (levelUpAge < 0.2) {
          ctx.fillStyle = `rgba(250, 204, 21, ${0.3 * (1 - levelUpAge / 0.2)})`;
          const flashR = Math.max(canvas.width, canvas.height) / zoom;
          ctx.fillRect(blobPosition.x - flashR, blobPosition.y - flashR, flashR * 2, flashR * 2);
        }

        ctx.beginPath();
        ctx.arc(blobPosition.x, blobPosition.y, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${ringAlpha * 0.8})`;
        ctx.lineWidth = (6 / zoom) * (1 - progress);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(blobPosition.x, blobPosition.y, ringRadius * 0.7, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(250, 204, 21, ${ringAlpha * 0.5})`;
        ctx.lineWidth = (3 / zoom) * (1 - progress);
        ctx.stroke();

        for (let pi = 0; pi < 16; pi++) {
          const pAngle = (pi / 16) * Math.PI * 2 + levelUpAge * 2;
          const pDist = radius + progress * radius * 4;
          const px = blobPosition.x + Math.cos(pAngle) * pDist;
          const py = blobPosition.y + Math.sin(pAngle) * pDist;
          const pSize = (5 / zoom) * (1 - progress);
          if (pSize > 0) {
            const colors = ['#facc15', '#ffffff', '#f97316', '#22c55e'];
            ctx.fillStyle = `${colors[pi % colors.length]}${Math.round(ringAlpha * 255).toString(16).padStart(2, '0')}`;
            ctx.beginPath();
            ctx.arc(px, py, pSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      ctx.restore();

      // Screen-space floating text
      const texts = floatingTextsRef.current;
      for (let i = texts.length - 1; i >= 0; i--) {
        const ft = texts[i];
        const age = now - ft.birth;
        if (age > 1.0) { texts.splice(i, 1); continue; }

        const screenX = (ft.x - camPosRef.current.x) * zoom + canvas.width / 2;
        const screenY = (ft.y - camPosRef.current.y) * zoom + canvas.height / 2 - age * 40;
        const alpha = 1 - age;
        const valueScale = Math.min(2, 1 + ft.value / 50);
        const scale = (1 + age * 0.3) * valueScale;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = `bold ${Math.round(14 * scale)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#000000';
        ctx.fillText(ft.text, screenX + 1, screenY + 1);

        const tier = ft.value > 20 ? '#f59e0b' : ft.value > 10 ? '#eab308' : '#22c55e';
        ctx.fillStyle = tier;
        ctx.fillText(ft.text, screenX, screenY);
        ctx.restore();
      }

      // Level-up text
      if (levelUpAge < 2.0 && state.levelUpTime > 0) {
        const textAlpha = levelUpAge < 0.5 ? 1 : Math.max(0, 1 - (levelUpAge - 0.5) / 1.5);
        const textScale = levelUpAge < 0.3 ? 0.5 + (levelUpAge / 0.3) * 0.5 : 1.0;
        ctx.save();
        ctx.globalAlpha = textAlpha;
        ctx.font = `bold ${Math.round(56 * textScale)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#000000';
        ctx.fillText(`LEVEL ${state.level}!`, canvas.width / 2 + 2, canvas.height / 2 - 60 + 2);
        ctx.fillStyle = '#facc15';
        ctx.fillText(`LEVEL ${state.level}!`, canvas.width / 2, canvas.height / 2 - 60);
        ctx.restore();
      }


      if (hasDash && starBoostActive) {
        ctx.save();
        ctx.globalAlpha = 0.35;
        ctx.strokeStyle = '#c4b5fd';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2 - 80, canvas.height / 2 + 44);
        ctx.lineTo(canvas.width / 2 + 80, canvas.height / 2 + 44);
        ctx.stroke();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0"
      onClick={handleTap}
      onTouchStart={handleTap}
    />
  );
}
