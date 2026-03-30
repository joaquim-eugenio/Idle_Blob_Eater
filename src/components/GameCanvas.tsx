import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useGameStore, Item, getCurrentWorld, computeTapCooldown } from '../store/gameStore';
import { BASE_SUCTION, BLOB_SKINS, OVERSIZED_SIZE_MULT, OVERSIZED_VOMIT_STAGES, getOversizedConfig } from '../lib/constants';
import { drawSpecialSkin, drawBlobItem, drawBlobFace, faceOverridesDefaultEyes, faceOverridesDefaultMouth } from '../lib/blobCosmetics';
import { ITEM_LOOKUP } from '../lib/itemCatalog';
import { getWorldForLevel, WORLD_LOOKUP, WORLDS } from '../lib/levels';

const GAME_FONT = "'Fredoka', sans-serif";

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
  type: 'normal' | 'cooldown' | 'blob' | 'crack';
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

function drawStarItem(ctx: CanvasRenderingContext2D, item: Item) {
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

function drawTapFood(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#60a5fa';
  ctx.fillRect(-10, -10, 20, 20);
  ctx.strokeStyle = '#93c5fd';
  ctx.lineWidth = 2;
  ctx.strokeRect(-10, -10, 20, 20);
}

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<BlobNode[]>([]);
  const prevItemsRef = useRef<Item[]>([]);
  const camPosRef = useRef({ x: 200, y: 300 });
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const prevComboRef = useRef(0);
  const ripplesRef = useRef<Ripple[]>([]);
  const eatPopRef = useRef(0);
  const vomitAnimRef = useRef(0);
  const displayedSizeScaleRef = useRef(0);
  const introRef = useRef({
    level: 0,
    startTime: 0,
    active: false,
    overviewZoom: 1,
    centerX: 200,
    centerY: 300,
  });
  const fpsTimesRef = useRef<number[]>([]);
  const tutorialPosRef = useRef<{ x: number; y: number; r: number; itemId: string } | null>(null);
  const [tutorialVisible, setTutorialVisible] = useState(false);

  const handleTutorialTap = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const state = useGameStore.getState();
    const osItem = state.items.find(i => i.isOversized && i.splitState !== 'splitting');
    if (osItem) state.tapOversizedItem(osItem.id);
    state.dismissHint('oversized_food');
    setTutorialVisible(false);
  }, []);

  const handleTap = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const state = useGameStore.getState();
    if (state._introPlaying) return;
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

    const world = getWorldForLevel(state.currentLevel);
    const blobVisScale = world.blobScale;
    const zoom = 2.5 / blobVisScale;

    const worldX = camPosRef.current.x + (screenX - canvas.width / 2) / zoom;
    const worldY = camPosRef.current.y + (screenY - canvas.height / 2) / zoom;

    const now = performance.now() / 1000;
    const isTutorialActive = state.activeHint === 'oversized_food';

    const worldForTap = getWorldForLevel(state.currentLevel);
    const wIdx = WORLDS.indexOf(worldForTap);
    const nextWorldForTap = wIdx < WORLDS.length - 1 ? WORLDS[wIdx + 1] : worldForTap;
    for (const item of state.items) {
      if (!item.isOversized || item.splitState === 'splitting' || item.splitState === 'swallowing') continue;
      const catalogItem = ITEM_LOOKUP[item.type];
      if (!catalogItem) continue;
      const tapStage = item.oversizedStage || OVERSIZED_VOMIT_STAGES;
      const tapStageFrac = tapStage / OVERSIZED_VOMIT_STAGES;
      const tapSizeMult = 1 + (OVERSIZED_SIZE_MULT - 1) * tapStageFrac;
      const itemSize = (6 + catalogItem.sizeTier * 4) * nextWorldForTap.blobScale * tapSizeMult;
      const hitDist = Math.hypot(worldX - item.x, worldY - item.y);
      if (hitDist < itemSize * (isTutorialActive ? 1.2 : 0.8)) {
        ripplesRef.current.push({ x: worldX, y: worldY, birth: now, type: 'crack' });
        const tapsAfter = (item.splitTapsReceived || 0) + 1;
        const osCfg = getOversizedConfig(wIdx);
        const total = item.splitTapsRequired || (osCfg?.tapsRequired ?? 3);
        floatingTextsRef.current.push({
          x: item.x, y: item.y - itemSize * 0.5,
          text: tapsAfter >= total ? 'SPLIT!' : `${tapsAfter}/${total}`,
          birth: now, value: -1,
        });
        state.tapOversizedItem(item.id);
        if (isTutorialActive) {
          state.dismissHint('oversized_food');
        }
        return;
      }
    }

    if (isTutorialActive) return;

    const bx = state.blobPosition.x;
    const by = state.blobPosition.y;
    const tapDist = Math.hypot(worldX - bx, worldY - by);
    const MIN_SPAWN_DIST = 40;

    if (tapDist < MIN_SPAWN_DIST) {
      ripplesRef.current.push({ x: worldX, y: worldY, birth: now, type: 'blob' });

      const nodes = nodesRef.current;
      const angle = Math.atan2(worldY - by, worldX - bx);
      for (let ni = 0; ni < NUM_NODES; ni++) {
        const nodeAngle = (ni / NUM_NODES) * Math.PI * 2;
        let diff = Math.abs(nodeAngle - angle);
        if (diff > Math.PI) diff = 2 * Math.PI - diff;
        if (diff < Math.PI / 2) {
          const force = (Math.PI / 2 - diff) * 15 * world.blobScale;
          nodes[ni].vx -= Math.cos(angle) * force;
          nodes[ni].vy -= Math.sin(angle) * force;
        }
      }

      const POKE_TEXTS = ['Hey!', 'That tickles!', 'Feed me!', 'Hehe!', 'Boop!'];
      const text = POKE_TEXTS[Math.floor(Math.random() * POKE_TEXTS.length)];
      floatingTextsRef.current.push({ x: bx, y: by - 20, text, birth: now, value: -1 });
      return;
    }

    const cooldown = computeTapCooldown(state.upgrades, state.unlockedSkillNodes);
    if (now - state.lastTapTime < cooldown) {
      ripplesRef.current.push({ x: worldX, y: worldY, birth: now, type: 'cooldown' });
      return;
    }

    ripplesRef.current.push({ x: worldX, y: worldY, birth: now, type: 'normal' });
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
      const { blobPosition, items, currentLevel, upgrades, starBoostActive, boostActive,
        currentSkin, comboCount, hunger, unlockedSkillNodes, levelComplete, blobGrowth,
        levelItemsEaten, levelItemsTotal } = state;

      const world = getWorldForLevel(currentLevel);
      const blobVisualScale = world.blobScale;
      const growFactor = 1 + 0.3 * Math.log(1 + (blobGrowth || 0) * 10);
      const levelInWorld = currentLevel - world.levelRange[0];
      const worldLevelCount = (world.levelRange[1] === Infinity ? 30 : world.levelRange[1]) - world.levelRange[0] + 1;
      const worldProgress = Math.min(1, levelInWorld / Math.max(1, worldLevelCount));
      const baseSizeScale = (0.3 + 0.7 * worldProgress) * blobVisualScale * 0.5;
      const eatProgress = levelItemsTotal > 0 ? levelItemsEaten / levelItemsTotal : 0;
      const targetSizeScale = baseSizeScale * (1 + eatProgress * 0.25);
      if (displayedSizeScaleRef.current === 0) displayedSizeScaleRef.current = targetSizeScale;
      displayedSizeScaleRef.current += (targetSizeScale - displayedSizeScaleRef.current) * 0.15;
      const blobSizeScale = displayedSizeScaleRef.current;

      const normalZoom = 2.5 / blobVisualScale;
      const INTRO_HOLD = 1.0;
      const INTRO_ZOOM_DUR = 0.7;
      const INTRO_TOTAL = INTRO_HOLD + INTRO_ZOOM_DUR;

      if (state._introPlaying && !introRef.current.active) {
        introRef.current.level = currentLevel;
        introRef.current.startTime = performance.now() / 1000;

        introRef.current.active = true;

        const nonStarItems = items.filter(i => i.type !== 'star');
        if (nonStarItems.length > 0) {
          let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
          for (const item of nonStarItems) {
            minX = Math.min(minX, item.x);
            maxX = Math.max(maxX, item.x);
            minY = Math.min(minY, item.y);
            maxY = Math.max(maxY, item.y);
          }
          minX = Math.min(minX, blobPosition.x);
          maxX = Math.max(maxX, blobPosition.x);
          minY = Math.min(minY, blobPosition.y);
          maxY = Math.max(maxY, blobPosition.y);

          const padding = 100;
          const boundsW = (maxX - minX) + padding * 2;
          const boundsH = (maxY - minY) + padding * 2;
          introRef.current.overviewZoom = Math.min(
            canvas.width / boundsW,
            canvas.height / boundsH,
            normalZoom * 0.7
          );
          introRef.current.centerX = (minX + maxX) / 2;
          introRef.current.centerY = (minY + maxY) / 2;
        } else {
          introRef.current.active = false;
          state.endIntro();
        }
      }

      ctx.fillStyle = world.bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();

      let zoom = normalZoom;
      const introElapsed = performance.now() / 1000 - introRef.current.startTime;

      if (introRef.current.active && state._introPlaying) {
        if (introElapsed < INTRO_HOLD) {
          zoom = introRef.current.overviewZoom;
          camPosRef.current.x = introRef.current.centerX;
          camPosRef.current.y = introRef.current.centerY;
        } else if (introElapsed < INTRO_TOTAL) {
          const t = (introElapsed - INTRO_HOLD) / INTRO_ZOOM_DUR;
          const eased = 1 - Math.pow(1 - t, 3);
          zoom = introRef.current.overviewZoom + (normalZoom - introRef.current.overviewZoom) * eased;
          camPosRef.current.x = introRef.current.centerX + (blobPosition.x - introRef.current.centerX) * eased;
          camPosRef.current.y = introRef.current.centerY + (blobPosition.y - introRef.current.centerY) * eased;
        } else {
          introRef.current.active = false;
          state.endIntro();
          zoom = normalZoom;
          camPosRef.current.x = blobPosition.x;
          camPosRef.current.y = blobPosition.y;
        }
      } else {
        const targetCamX = blobPosition.x;
        const targetCamY = blobPosition.y;
        if (Math.hypot(camPosRef.current.x - targetCamX, camPosRef.current.y - targetCamY) > 1000) {
          camPosRef.current.x = targetCamX;
          camPosRef.current.y = targetCamY;
        } else {
          camPosRef.current.x += (targetCamX - camPosRef.current.x) * 0.1;
          camPosRef.current.y += (targetCamY - camPosRef.current.y) * 0.1;
        }
      }

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-camPosRef.current.x, -camPosRef.current.y);

      // Grid
      ctx.strokeStyle = world.gridColor;
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

      // Suction radius
      const gameBlobScale = blobVisualScale;
      const suctionSyn = 1 + (upgrades.suctionSynergy || 0) * 0.5;
      const suctionRadius = (BASE_SUCTION + (upgrades.suction || 0) * 15) * suctionSyn * Math.sqrt(gameBlobScale);
      const hasSuctionCone = unlockedSkillNodes.includes('hunt_suction_cone');
      const hasFrenzy = unlockedSkillNodes.includes('survival_frenzy');
      const hasDash = unlockedSkillNodes.includes('hunt_dash_on_star');

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

        let ripRadius: number, color: string, lineW: number;
        if (rip.type === 'cooldown') {
          ripRadius = 15 + progress * 25;
          color = `rgba(150, 150, 150, ${0.35 * (1 - progress)})`;
          lineW = (2 / zoom) * (1 - progress);
        } else if (rip.type === 'blob') {
          ripRadius = 15 + progress * 40;
          color = `rgba(255, 255, 255, ${0.5 * (1 - progress)})`;
          lineW = (2.5 / zoom) * (1 - progress);
        } else if (rip.type === 'crack') {
          ripRadius = 10 + progress * 35;
          color = `rgba(255, 200, 50, ${0.6 * (1 - progress)})`;
          lineW = (3 / zoom) * (1 - progress);
        } else {
          ripRadius = 20 + progress * 60;
          color = `rgba(59, 130, 246, ${0.5 * (1 - progress)})`;
          lineW = (3 / zoom) * (1 - progress);
        }

        ctx.beginPath();
        ctx.arc(rip.x, rip.y, ripRadius, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineW;
        ctx.stroke();
      }

      // Items
      items.forEach(item => {
        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.rotate(item.rotation || 0);

        if (item.type === 'star') {
          const worldIdx = Math.max(0, WORLDS.indexOf(world));
          const starSizeTier = Math.min(worldIdx + 1, 5);
          const starScale = (6 + starSizeTier * 4) * world.blobScale / 36;
          ctx.scale(starScale, starScale);
          drawStarItem(ctx, item);
        } else if (item.isTapFood) {
          const tapSize = (6 + 2 * 4) * world.blobScale;
          const tapScale = tapSize / 20;
          ctx.scale(tapScale, tapScale);
          drawTapFood(ctx);
        } else if (item.isOversized) {
          const catalogItem = ITEM_LOOKUP[item.type];
          if (catalogItem) {
            const worldIdx = Math.max(0, WORLDS.indexOf(world));
            const nextW = worldIdx < WORLDS.length - 1 ? WORLDS[worldIdx + 1] : world;
            const stage = item.oversizedStage || OVERSIZED_VOMIT_STAGES;
            const stageFraction = stage / OVERSIZED_VOMIT_STAGES;
            const sizeMult = 1 + (OVERSIZED_SIZE_MULT - 1) * stageFraction;
            const sizeBase = (6 + catalogItem.sizeTier * 4) * nextW.blobScale * sizeMult;
            const itemPalette = nextW.palette;
            const crackProgress = (item.splitTapsReceived || 0) / (item.splitTapsRequired || 3);
            const animTime = performance.now() / 1000;

            // Swallowing animation: shrink and fade as item enters blob
            if (item.splitState === 'swallowing') {
              const swallowProgress = Math.min(1, (animTime - (item.swallowTime || 0)) / 0.4);
              const swallowScale = 1 - swallowProgress * 0.8;
              ctx.scale(swallowScale, swallowScale);
              ctx.globalAlpha = 1 - swallowProgress;
            }

            const shakeAmp = crackProgress * 2;
            if (shakeAmp > 0) {
              ctx.translate(
                (Math.random() - 0.5) * shakeAmp,
                (Math.random() - 0.5) * shakeAmp,
              );
            }

            const glowPulse = 0.3 + Math.sin(animTime * 3) * 0.15;
            ctx.save();
            ctx.globalAlpha = Math.min(ctx.globalAlpha, glowPulse);
            ctx.beginPath();
            ctx.arc(0, 0, sizeBase * 0.8, 0, Math.PI * 2);
            ctx.fillStyle = itemPalette[0];
            ctx.fill();
            ctx.restore();

            ctx.save();
            ctx.beginPath();
            ctx.arc(0, 0, sizeBase * 0.65, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255,255,255,${0.4 + Math.sin(animTime * 2) * 0.2})`;
            ctx.lineWidth = 2;
            ctx.setLineDash([4, 4]);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.restore();

            catalogItem.draw(ctx, sizeBase, itemPalette);

            if (crackProgress > 0) {
              ctx.save();
              ctx.strokeStyle = 'rgba(255,255,255,0.9)';
              ctx.shadowColor = 'rgba(0,0,0,0.5)';
              ctx.shadowBlur = 2;
              ctx.lineWidth = 1.5;
              const crackCount = Math.ceil(crackProgress * 5);
              for (let ci = 0; ci < crackCount; ci++) {
                const ca = (ci / crackCount) * Math.PI * 2 + ci * 1.3;
                const len = sizeBase * 0.3 * crackProgress;
                ctx.beginPath();
                ctx.moveTo(Math.cos(ca) * sizeBase * 0.1, Math.sin(ca) * sizeBase * 0.1);
                const mx = Math.cos(ca + 0.3) * len * 0.5;
                const my = Math.sin(ca + 0.3) * len * 0.5;
                ctx.lineTo(mx, my);
                ctx.lineTo(Math.cos(ca) * len, Math.sin(ca) * len);
                ctx.stroke();
              }
              ctx.restore();
            }
          }
        } else if (item.isOversizedFragment) {
          const catalogItem = ITEM_LOOKUP[item.type];
          if (catalogItem) {
            const sizeBase = (6 + catalogItem.sizeTier * 4) * world.blobScale;
            catalogItem.draw(ctx, sizeBase, world.palette);
          }
        } else {
          const catalogItem = ITEM_LOOKUP[item.type];
          if (catalogItem) {
            const itemWorld = item.isLegacy ? WORLD_LOOKUP[catalogItem.world] : world;
            const itemPalette = item.isLegacy ? itemWorld.palette : world.palette;
            const sizeBase = (6 + catalogItem.sizeTier * 4) * itemWorld.blobScale;
            if (item.isLegacy) {
              ctx.globalAlpha = 0.7;
            }
            catalogItem.draw(ctx, sizeBase, itemPalette);
            if (item.isLegacy) {
              ctx.globalAlpha = 1;
            }
          } else {
            ctx.fillStyle = world.palette[0];
            ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.fill();
          }
        }
        ctx.restore();
      });

      // Blob
      const abState = state.abilities;
      const abilitySizeMult = abState.size.active ? 1.6 : 1;
      const baseSize = 60 * blobSizeScale * growFactor * abilitySizeMult;
      const time = performance.now() / 1000;
      const breath = Math.sin(time * 2) * (baseSize * 0.05);
      eatPopRef.current *= 0.88;
      if (eatPopRef.current < 0.001) eatPopRef.current = 0;
      const radius = ((baseSize + breath) / 2) * (1 + eatPopRef.current);
      const nodes = nodesRef.current;
      const hungerSyn = 1 + (upgrades.hungerSynergy || 0) * 0.5;
      const maxHunger = (100 + (upgrades.hungerMax || 0) * 40) * hungerSyn;
      const hungerPct = hunger / maxHunger;
      const frenzyThreshold = unlockedSkillNodes.includes('survival_tradeoff') ? 0.4 : 0.3;
      const frenzyActive = hasFrenzy && hungerPct < frenzyThreshold;

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
        if (eatenItems.length > 0) {
          eatPopRef.current = Math.min(0.3, eatPopRef.current + eatenItems.length * 0.15);
        }
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

      // Vomit detection: items that were swallowing in previous frame but are now gone
      const VOMIT_TEXTS = ['BLEURGH!', 'Too big!', "Can't swallow!", 'URK!', 'NOPE!', '*gag*'];
      const currentIds = new Set(currentItems.map(i => i.id));
      const prevSwallowing = prevItems.filter(i => i.isOversized && i.splitState === 'swallowing');
      for (const swallowed of prevSwallowing) {
        if (!currentIds.has(swallowed.id)) {
          vomitAnimRef.current = now;
          const text = VOMIT_TEXTS[Math.floor(Math.random() * VOMIT_TEXTS.length)];
          floatingTextsRef.current.push({
            x: blobPosition.x, y: blobPosition.y - radius * 1.5,
            text, birth: now, value: -1,
          });
          for (let ni = 0; ni < NUM_NODES; ni++) {
            nodes[ni].vx += (Math.random() - 0.5) * 12 * blobVisualScale;
            nodes[ni].vy += (Math.random() - 0.5) * 12 * blobVisualScale;
          }
        }
      }

      // Combo floating text
      if (comboCount >= 2 && comboCount > prevComboRef.current) {
        floatingTextsRef.current.push({
          x: blobPosition.x - radius * 1.2,
          y: blobPosition.y + radius * 0.8,
          text: `x${Math.min(comboCount, 10)}`,
          birth: now,
          value: -2,
        });
      }
      prevComboRef.current = comboCount;

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
      const baseColor = getBlobColor(currentLevel, currentSkin);
      const specialSkinId = state.currentSpecialSkin;
      if (abState.size.active) {
        ctx.shadowBlur = 35; ctx.shadowColor = '#22d3ee'; ctx.fillStyle = baseColor;
      } else if (starBoostActive) {
        ctx.shadowBlur = 30; ctx.shadowColor = '#d8b4fe'; ctx.fillStyle = '#a855f7';
      } else if (boostActive) {
        ctx.shadowBlur = 20; ctx.shadowColor = '#facc15'; ctx.fillStyle = baseColor;
      } else if (frenzyActive) {
        ctx.shadowBlur = 0; ctx.fillStyle = baseColor;
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

      if (specialSkinId && !starBoostActive) {
        ctx.save();
        drawSpecialSkin(ctx, specialSkinId, blobPosition.x, blobPosition.y, radius, time);
        ctx.restore();
      } else {
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      const vomitAge = now - vomitAnimRef.current;
      if (vomitAge < 0.6) {
        const vAlpha = 0.3 * (1 - vomitAge / 0.6);
        ctx.save();
        ctx.globalAlpha = vAlpha;
        ctx.fillStyle = 'rgba(100, 220, 80, 1)';
        ctx.beginPath();
        let vPrev = nodes[NUM_NODES - 1];
        ctx.moveTo((vPrev.x + nodes[0].x) / 2, (vPrev.y + nodes[0].y) / 2);
        for (let vi = 0; vi < NUM_NODES; vi++) {
          const vCurr = nodes[vi];
          const vNext = nodes[(vi + 1) % NUM_NODES];
          ctx.quadraticCurveTo(vCurr.x, vCurr.y, (vCurr.x + vNext.x) / 2, (vCurr.y + vNext.y) / 2);
        }
        ctx.fill();
        ctx.restore();
      }

      // Active ability VFX
      if (abState.magnet.active) {
        for (let ri = 0; ri < 3; ri++) {
          const ringPhase = (time * 3 + ri * 0.7) % 1;
          const ringR = radius * (1.5 + ringPhase * 3);
          const ringAlpha = 0.4 * (1 - ringPhase);
          ctx.beginPath();
          ctx.arc(blobPosition.x, blobPosition.y, ringR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(168, 85, 247, ${ringAlpha})`;
          ctx.lineWidth = (4 / zoom) * (1 - ringPhase * 0.5);
          ctx.stroke();
        }
      }

      if (abState.speed.active) {
        const moveAngle = Math.atan2(
          blobPosition.y - camPosRef.current.y,
          blobPosition.x - camPosRef.current.x
        );
        for (let li = 0; li < 6; li++) {
          const spread = (li - 2.5) * 0.3;
          const trailAngle = moveAngle + Math.PI + spread;
          const trailLen = radius * (1.5 + Math.sin(time * 12 + li) * 0.5);
          const tx = blobPosition.x + Math.cos(trailAngle) * trailLen;
          const ty = blobPosition.y + Math.sin(trailAngle) * trailLen;
          ctx.beginPath();
          ctx.moveTo(blobPosition.x, blobPosition.y);
          ctx.lineTo(tx, ty);
          ctx.strokeStyle = `rgba(250, 204, 21, ${0.3 - li * 0.04})`;
          ctx.lineWidth = (3 - li * 0.3) / zoom;
          ctx.stroke();
        }
        ctx.shadowBlur = 0;
      }

      if (abState.size.active) {
        ctx.beginPath();
        ctx.arc(blobPosition.x, blobPosition.y, radius * 1.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 211, 238, ${0.08 + Math.sin(time * 4) * 0.04})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(blobPosition.x, blobPosition.y, radius * 1.2, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(34, 211, 238, ${0.3 + Math.sin(time * 6) * 0.1})`;
        ctx.lineWidth = 2 / zoom;
        ctx.stroke();
      }

      if (frenzyActive) {
        const haloY = blobPosition.y - radius * 1.15;
        const haloX = blobPosition.x;
        const pulse = 1 + Math.sin(time * 6) * 0.12;
        const flicker = 0.6 + Math.sin(time * 8) * 0.15 + Math.sin(time * 13) * 0.1;
        ctx.save();
        ctx.shadowBlur = 18 / zoom;
        ctx.shadowColor = '#fb923c';
        ctx.strokeStyle = `rgba(251, 146, 60, ${flicker})`;
        ctx.lineWidth = (3.5 / zoom) * pulse;
        ctx.beginPath();
        ctx.ellipse(haloX, haloY, radius * 0.35 * pulse, radius * 0.1 * pulse, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = `rgba(253, 186, 116, ${flicker * 0.5})`;
        ctx.lineWidth = (2 / zoom) * pulse;
        ctx.beginPath();
        ctx.ellipse(haloX, haloY, radius * 0.28 * pulse, radius * 0.07 * pulse, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.restore();
      }

      // Equipped item (behind face, on body)
      const equippedItem = state.currentItem;
      let cx = 0, cy = 0;
      for (let i = 0; i < NUM_NODES; i++) { cx += nodes[i].x; cy += nodes[i].y; }
      cx /= NUM_NODES; cy /= NUM_NODES;
      let dx = blobPosition.x - cx, dy = blobPosition.y - cy;
      const maxParallax = radius * 0.4;
      const parallaxDist = Math.hypot(dx, dy);
      if (parallaxDist > maxParallax) { dx = (dx / parallaxDist) * maxParallax; dy = (dy / parallaxDist) * maxParallax; }

      if (equippedItem) {
        ctx.save();
        drawBlobItem(ctx, equippedItem, nodes as any, cx, cy, radius, time, NUM_NODES, dx, dy);
        ctx.restore();
      }

      // Face
      const equippedFace = state.currentFace;
      ctx.fillStyle = '#1a237e';

      const isEating = comboCount > 0;
      const isSleepy = hungerPct < 0.25;
      const isExcited = starBoostActive;
      const isLevelDone = levelComplete;

      const eyeY = cy - radius * 0.1 + dy;
      const eyeSize = radius * 0.08;

      if (!faceOverridesDefaultEyes(equippedFace)) {
        if (isLevelDone) {
          ctx.beginPath(); ctx.arc(cx - radius * 0.25 + dx, eyeY, eyeSize * 1.2, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(cx + radius * 0.25 + dx, eyeY, eyeSize * 1.2, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath(); ctx.arc(cx - radius * 0.23 + dx, eyeY - eyeSize * 0.3, eyeSize * 0.35, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(cx + radius * 0.27 + dx, eyeY - eyeSize * 0.3, eyeSize * 0.35, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#1a237e';
        } else if (isSleepy) {
          const leftEyeX = cx - radius * 0.25 + dx;
          const rightEyeX = cx + radius * 0.25 + dx;
          ctx.strokeStyle = '#1a237e';
          ctx.lineWidth = Math.max(1.5, radius * 0.03);
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(leftEyeX - eyeSize, eyeY + eyeSize * 0.5);
          ctx.quadraticCurveTo(leftEyeX, eyeY - eyeSize * 0.2, leftEyeX + eyeSize, eyeY);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(rightEyeX - eyeSize, eyeY);
          ctx.quadraticCurveTo(rightEyeX, eyeY - eyeSize * 0.2, rightEyeX + eyeSize, eyeY + eyeSize * 0.5);
          ctx.stroke();
        } else if (isExcited) {
          ctx.beginPath(); ctx.arc(cx - radius * 0.25 + dx, eyeY, eyeSize * 1.3, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(cx + radius * 0.25 + dx, eyeY, eyeSize * 1.3, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath(); ctx.arc(cx - radius * 0.23 + dx, eyeY - eyeSize * 0.4, eyeSize * 0.4, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(cx + radius * 0.27 + dx, eyeY - eyeSize * 0.4, eyeSize * 0.4, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#1a237e';
        } else {
          ctx.beginPath(); ctx.arc(cx - radius * 0.25 + dx, eyeY, eyeSize, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(cx + radius * 0.25 + dx, eyeY, eyeSize, 0, Math.PI * 2); ctx.fill();
        }
      }

      // Mouth
      const mouthY = cy + radius * 0.15 + dy;
      const mouthX = cx + dx;
      if (!faceOverridesDefaultMouth(equippedFace)) {
        if (isLevelDone) {
          ctx.beginPath();
          ctx.arc(mouthX, mouthY, radius * 0.15, 0, Math.PI, false);
          ctx.fill();
        } else if (isEating && comboCount >= 3) {
          ctx.beginPath(); ctx.arc(mouthX, mouthY, radius * 0.12, 0, Math.PI * 2); ctx.fill();
        } else if (isSleepy) {
          ctx.beginPath(); ctx.arc(mouthX, mouthY + radius * 0.02, radius * 0.05, 0, Math.PI, false); ctx.fill();
        } else if (isExcited || isEating) {
          ctx.beginPath(); ctx.arc(mouthX, mouthY, radius * 0.13, 0, Math.PI, false); ctx.fill();
        } else {
          ctx.beginPath(); ctx.arc(mouthX, mouthY, radius * 0.1, 0, Math.PI, false); ctx.fill();
        }
      }

      // Custom face cosmetic overlay
      if (equippedFace) {
        ctx.save();
        drawBlobFace(ctx, equippedFace, cx, cy, radius, dx, dy, time);
        ctx.restore();
      }

      // Level-up celebration
      const levelUpAge = (Date.now() - state.levelUpTime) / 1000;
      if (levelUpAge < 1.5 && state.levelUpTime > 0) {
        const progress = levelUpAge / 1.5;
        const ringRadius = radius * (1.5 + progress * 3);
        const ringAlpha = 1 - progress;

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
            ctx.beginPath(); ctx.arc(px, py, pSize, 0, Math.PI * 2); ctx.fill();
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
        const valueScale = ft.value < 0 ? 1 : Math.min(2, 1 + ft.value / 50);
        const scale = (1 + age * 0.3) * valueScale;

        ctx.save();
        ctx.globalAlpha = alpha;
        const isCombo = ft.value === -2;
        const fontSize = isCombo ? Math.round(22 * scale) : Math.round(14 * scale);
        ctx.font = `bold ${fontSize}px ${GAME_FONT}`;
        ctx.textAlign = 'center';

        if (isCombo) {
          ctx.fillStyle = '#facc15';
          ctx.fillText(ft.text, screenX, screenY);
        } else {
          ctx.fillStyle = '#000000';
          ctx.fillText(ft.text, screenX + 1, screenY + 1);
          const tier = ft.value < 0 ? '#f0abfc'
            : ft.value > 20 ? '#f59e0b' : ft.value > 10 ? '#eab308' : '#22c55e';
          ctx.fillStyle = tier;
          ctx.fillText(ft.text, screenX, screenY);
        }
        ctx.restore();
      }

      // Level complete text
      if (levelComplete && levelUpAge < 2.0 && state.levelUpTime > 0) {
        const textAlpha = levelUpAge < 0.5 ? 1 : Math.max(0, 1 - (levelUpAge - 0.5) / 1.5);
        const textScale = levelUpAge < 0.3 ? 0.5 + (levelUpAge / 0.3) * 0.5 : 1.0;
        ctx.save();
        ctx.globalAlpha = textAlpha;
        ctx.font = `900 ${Math.round(48 * textScale)}px ${GAME_FONT}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#000000';
        ctx.fillText('LEVEL CLEAR!', canvas.width / 2 + 2, canvas.height / 2 - 60 + 2);
        ctx.fillStyle = '#facc15';
        ctx.fillText('LEVEL CLEAR!', canvas.width / 2, canvas.height / 2 - 60);
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

      // Level intro overlay
      if (introRef.current.active && state._introPlaying) {
        const fadeOut = introElapsed < INTRO_HOLD
          ? 1
          : Math.max(0, 1 - (introElapsed - INTRO_HOLD) / (INTRO_ZOOM_DUR * 0.5));

        if (fadeOut > 0) {
          ctx.save();
          ctx.globalAlpha = fadeOut * 0.25;
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.restore();

          ctx.save();
          ctx.globalAlpha = fadeOut;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          const titleY = canvas.height * 0.38;
          ctx.font = `900 52px ${GAME_FONT}`;
          ctx.fillStyle = 'rgba(0,0,0,0.3)';
          ctx.fillText(`Level ${currentLevel}`, canvas.width / 2 + 2, titleY + 2);
          ctx.fillStyle = '#ffffff';
          ctx.fillText(`Level ${currentLevel}`, canvas.width / 2, titleY);

          ctx.font = `22px ${GAME_FONT}`;
          ctx.fillStyle = 'rgba(255,255,255,0.7)';
          ctx.fillText(world.name, canvas.width / 2, titleY + 40);

          ctx.restore();
        }
      }

      // Oversized food tutorial: update position ref for HTML overlay
      if (state.activeHint === 'oversized_food') {
        const osItem = items.find(i => i.isOversized && i.splitState !== 'splitting');
        if (osItem) {
          const sx = (osItem.x - camPosRef.current.x) * zoom + canvas.width / 2;
          const sy = (osItem.y - camPosRef.current.y) * zoom + canvas.height / 2;
          const catalogE = ITEM_LOOKUP[osItem.type];
          const osStage = osItem.oversizedStage || OVERSIZED_VOMIT_STAGES;
          const stageFrac = osStage / OVERSIZED_VOMIT_STAGES;
          const sizeMult = 1 + (OVERSIZED_SIZE_MULT - 1) * stageFrac;
          const itemRad = catalogE
            ? (6 + catalogE.sizeTier * 4) * (getWorldForLevel(currentLevel + 1)?.blobScale || 1) * sizeMult * zoom
            : 30;
          tutorialPosRef.current = { x: sx, y: sy, r: itemRad * 1.5, itemId: osItem.id };
          if (!tutorialVisible) setTutorialVisible(true);
        }
      } else if (tutorialPosRef.current) {
        tutorialPosRef.current = null;
        if (tutorialVisible) setTutorialVisible(false);
      }

      if (state._benchmarkActive) {
        const now = performance.now();
        const frameTimes = fpsTimesRef.current;
        frameTimes.push(now);
        while (frameTimes.length > 0 && frameTimes[0] < now - 1000) frameTimes.shift();
        const fps = frameTimes.length;
        const itemCount = state.items.length;

        const label = `FPS: ${fps}  |  Items: ${itemCount}`;
        ctx.save();
        ctx.font = 'bold 14px monospace';
        const textW = ctx.measureText(label).width;
        const px = canvas.width - textW - 24;
        const py = 12;
        ctx.fillStyle = 'rgba(0,0,0,0.65)';
        ctx.beginPath();
        ctx.roundRect(px - 8, py - 4, textW + 16, 24, 8);
        ctx.fill();
        ctx.fillStyle = fps < 30 ? '#ef4444' : fps < 50 ? '#facc15' : '#4ade80';
        ctx.textBaseline = 'top';
        ctx.fillText(label, px, py);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const tp = tutorialVisible ? tutorialPosRef.current : null;

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        onClick={handleTap}
        onTouchStart={handleTap}
      />
      {tp && (
        <div
          className="fixed inset-0"
          style={{ zIndex: 9999, touchAction: 'none' }}
          onClick={handleTutorialTap}
          onTouchStart={handleTutorialTap}
        >
          {/* Full-screen dark overlay with spotlight cutout */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at ${tp.x}px ${tp.y}px, transparent ${tp.r}px, rgba(0,0,0,0.65) ${tp.r + 18}px)`,
            }}
          />

          {/* Pulsing glow ring */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              left: tp.x - tp.r - 4,
              top: tp.y - tp.r - 4,
              width: (tp.r + 4) * 2,
              height: (tp.r + 4) * 2,
              border: '3px solid rgba(255,220,80,0.8)',
              boxShadow: '0 0 18px 4px rgba(255,220,80,0.4), inset 0 0 18px 4px rgba(255,220,80,0.15)',
              animation: 'tutPulse 1.2s ease-in-out infinite',
            }}
          />

          {/* Tapping hand emoji */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: tp.x + tp.r * 0.3,
              top: tp.y + tp.r * 0.1,
              fontSize: Math.min(56, window.innerWidth * 0.11),
              animation: 'tutTap 1s ease-in-out infinite',
              filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))',
              transformOrigin: 'center bottom',
            }}
          >
            👆
          </div>

          {/* Text */}
          <div
            className="absolute left-0 right-0 pointer-events-none text-center"
            style={{ top: tp.y - tp.r - 64 }}
          >
            <div
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontWeight: 900,
                fontSize: Math.min(30, window.innerWidth * 0.06),
                color: '#fde68a',
                textShadow: '0 2px 8px rgba(0,0,0,0.6), 0 0 20px rgba(253,230,138,0.3)',
              }}
            >
              Tap to break!
            </div>
            <div
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontSize: Math.min(15, window.innerWidth * 0.032),
                color: 'rgba(255,255,255,0.85)',
                textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                marginTop: 4,
              }}
            >
              This food is too big to eat whole
            </div>
          </div>

          <style>{`
            @keyframes tutPulse {
              0%, 100% { transform: scale(1); opacity: 0.7; }
              50% { transform: scale(1.08); opacity: 1; }
            }
            @keyframes tutTap {
              0%, 100% { transform: translateY(0) scale(1); }
              40% { transform: translateY(-10px) scale(1.05); }
              55% { transform: translateY(4px) scale(0.92); }
              70% { transform: translateY(-2px) scale(1); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
