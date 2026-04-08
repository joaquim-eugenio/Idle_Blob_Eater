import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { useGameStore } from '../store/gameStore';
import {
  SPECIAL_SKINS, BLOB_ITEMS, BLOB_FACES, BLOB_SKINS,
  RARITY_COLORS, type CosmeticRarity, type CosmeticCurrency,
} from '../lib/constants';
import { drawSpecialSkin, drawBlobItem, drawBlobFace, faceOverridesDefaultEyes, faceOverridesDefaultMouth } from '../lib/blobCosmetics';
import { blobGradient, darken } from '../lib/drawUtils';
import { CloseIcon, StarIcon, GemIcon, CoinIcon, CrownIcon, ShirtIcon, SmileyIcon } from './icons';
import { motion, AnimatePresence } from 'motion/react';

const PREVIEW_NODES = 32;
const SPRING_K = 0.12;
const DAMPING = 0.7;
const POKE_STRENGTH = 8;
const INTERACTION_RADIUS_FACTOR = 1.8;
const THUMB_SIZE = 44;

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

class PreviewNode {
  x: number; y: number; vx: number; vy: number;
  constructor(x: number, y: number) {
    this.x = x; this.y = y; this.vx = 0; this.vy = 0;
  }
}

type ShopTab = 'skins' | 'items' | 'faces';
type PreviewState = { type: 'skin' | 'specialSkin' | 'item' | 'face'; id: string } | null;

function formatCost(cost: number, currency: CosmeticCurrency): string {
  if (currency === 'gems') return `${cost}`;
  if (cost >= 1000) return `$${(cost / 1000).toFixed(cost % 1000 === 0 ? 0 : 1)}K`;
  return `$${cost}`;
}

function rarityLabel(rarity: CosmeticRarity): string {
  return rarity.charAt(0).toUpperCase() + rarity.slice(1);
}

// ─── Mini Canvas Thumbnail ───────────────────────────────────────────────────

const Thumbnail = memo(function Thumbnail({ type, id }: { type: string; id: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = THUMB_SIZE * dpr;
    canvas.height = THUMB_SIZE * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, THUMB_SIZE, THUMB_SIZE);

    const cx = THUMB_SIZE / 2, cy = THUMB_SIZE / 2, r = THUMB_SIZE * 0.38;

    if (type === 'specialSkin') {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.closePath();
      ctx.save();
      drawSpecialSkin(ctx, id, cx, cy, r, 0);
      ctx.restore();
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0,0,0,0.18)'; ctx.lineWidth = 1.5; ctx.lineJoin = 'round';
      ctx.stroke();
    } else if (type === 'skin') {
      const skin = BLOB_SKINS.find(sk => sk.id === id);
      const color = skin && skin.colors.length > 0 ? skin.colors[0] : '#0088ff';
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = blobGradient(ctx, cx, cy, r, color); ctx.fill();
      ctx.strokeStyle = darken(color, 0.35); ctx.lineWidth = 1.5; ctx.lineJoin = 'round'; ctx.stroke();
      ctx.save();
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.beginPath(); ctx.ellipse(cx - r * 0.2, cy - r * 0.25, r * 0.35, r * 0.22, -0.3, 0, Math.PI * 2);
      ctx.fill(); ctx.restore();
    } else if (type === 'item') {
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = blobGradient(ctx, cx, cy, r, '#94a3b8'); ctx.fill();
      ctx.strokeStyle = darken('#94a3b8', 0.3); ctx.lineWidth = 1; ctx.stroke();
      const mockNodes: any[] = [];
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2;
        mockNodes.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, vx: 0, vy: 0 });
      }
      ctx.save();
      drawBlobItem(ctx, id, mockNodes, cx, cy, r, 0, 16, 0, 0);
      ctx.restore();
    } else if (type === 'face') {
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = blobGradient(ctx, cx, cy, r, '#0088ff'); ctx.fill();
      ctx.strokeStyle = darken('#0088ff', 0.35); ctx.lineWidth = 1; ctx.stroke();
      if (!faceOverridesDefaultEyes(id)) {
        ctx.fillStyle = '#1a237e';
        const ey = cy - r * 0.1, es = r * 0.09;
        ctx.beginPath(); ctx.arc(cx - r * 0.25, ey, es, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + r * 0.25, ey, es, 0, Math.PI * 2); ctx.fill();
      }
      if (!faceOverridesDefaultMouth(id)) {
        ctx.fillStyle = '#1a237e';
        ctx.beginPath(); ctx.arc(cx, cy + r * 0.15, r * 0.1, 0, Math.PI, false); ctx.fill();
      }
      ctx.save();
      drawBlobFace(ctx, id, cx, cy, r * 0.9, 0, 0, 0);
      ctx.restore();
    }
  }, [type, id]);

  return (
    <canvas
      ref={ref}
      style={{ width: THUMB_SIZE, height: THUMB_SIZE }}
      className="rounded-lg flex-shrink-0"
    />
  );
});

// ─── Main Component ──────────────────────────────────────────────────────────

export function BlobCustomizer() {
  const [tab, setTab] = useState<ShopTab>('skins');
  const [preview, setPreview] = useState<PreviewState>(null);
  const previewRef = useRef<PreviewState>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<PreviewNode[]>([]);
  const animRef = useRef<number>(0);
  const pointerRef = useRef<{ down: boolean; x: number; y: number }>({ down: false, x: 0, y: 0 });

  useEffect(() => { previewRef.current = preview; }, [preview]);

  const isOpen = useGameStore(s => s.customizerOpen);
  const openCustomizer = useGameStore(s => s.openCustomizer);
  const closeCustomizer = useGameStore(s => s.closeCustomizer);

  const currentLevel = useGameStore(s => s.currentLevel);
  const currentSkin = useGameStore(s => s.currentSkin);
  const unlockedSkins = useGameStore(s => s.unlockedSkins);
  const currentSpecialSkin = useGameStore(s => s.currentSpecialSkin);
  const unlockedSpecialSkins = useGameStore(s => s.unlockedSpecialSkins);
  const currentItem = useGameStore(s => s.currentItem);
  const unlockedItems = useGameStore(s => s.unlockedItems);
  const currentFace = useGameStore(s => s.currentFace);
  const unlockedFaces = useGameStore(s => s.unlockedFaces);
  const money = useGameStore(s => s.money);
  const gems = useGameStore(s => s.gems);

  const buyBlobSkin = useGameStore(s => s.buyBlobSkin);
  const setSkin = useGameStore(s => s.setSkin);
  const buySpecialSkin = useGameStore(s => s.buySpecialSkin);
  const setSpecialSkin = useGameStore(s => s.setSpecialSkin);
  const buyBlobItem = useGameStore(s => s.buyBlobItem);
  const setItem = useGameStore(s => s.setItem);
  const buyBlobFace = useGameStore(s => s.buyBlobFace);
  const setFace = useGameStore(s => s.setFace);

  const handleClose = useCallback(() => {
    setPreview(null);
    closeCustomizer();
  }, [closeCustomizer]);

  const initNodes = useCallback((centerX: number, centerY: number, radius: number) => {
    const nodes: PreviewNode[] = [];
    for (let i = 0; i < PREVIEW_NODES; i++) {
      const angle = (i / PREVIEW_NODES) * Math.PI * 2;
      nodes.push(new PreviewNode(
        centerX + Math.cos(angle) * radius,
        centerY + Math.sin(angle) * radius
      ));
    }
    nodesRef.current = nodes;
  }, []);

  // ─── Blob Preview Renderer ───

  const drawPreview = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const centerX = w / 2;
    const centerY = h / 2;
    const radius = Math.min(w, h) * 0.3;
    const time = performance.now() / 1000;

    if (nodesRef.current.length === 0) {
      initNodes(centerX, centerY, radius);
    }
    const nodes = nodesRef.current;

    const breathRadius = radius + Math.sin(time * 2) * radius * 0.03;
    for (let i = 0; i < PREVIEW_NODES; i++) {
      const node = nodes[i];
      const angle = (i / PREVIEW_NODES) * Math.PI * 2;
      const tx = centerX + Math.cos(angle) * breathRadius;
      const ty = centerY + Math.sin(angle) * breathRadius;
      node.vx += (tx - node.x) * SPRING_K;
      node.vy += (ty - node.y) * SPRING_K;
      node.vx *= DAMPING;
      node.vy *= DAMPING;
      node.x += node.vx;
      node.y += node.vy;
    }

    if (pointerRef.current.down) {
      const px = pointerRef.current.x;
      const py = pointerRef.current.y;
      const interactionR = radius * INTERACTION_RADIUS_FACTOR;
      for (const node of nodes) {
        const dist = Math.hypot(node.x - px, node.y - py);
        if (dist < interactionR && dist > 0) {
          const force = (1 - dist / interactionR) * POKE_STRENGTH;
          const angle = Math.atan2(node.y - py, node.x - px);
          node.vx += Math.cos(angle) * force;
          node.vy += Math.sin(angle) * force;
        }
      }
    }

    ctx.clearRect(0, 0, w, h);

    const bgGrad = ctx.createRadialGradient(centerX, centerY - h * 0.1, 0, centerX, centerY, h * 0.7);
    bgGrad.addColorStop(0, '#f8fafc');
    bgGrad.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    const state = useGameStore.getState();
    const pv = previewRef.current;

    const displaySpecialSkin = pv?.type === 'specialSkin' ? pv.id
      : pv?.type === 'skin' ? ''
      : state.currentSpecialSkin;
    const displaySkin = pv?.type === 'skin' ? pv.id : state.currentSkin;
    const displayItem = pv?.type === 'item' ? pv.id : state.currentItem;
    const displayFace = pv?.type === 'face' ? pv.id : state.currentFace;

    const buildBlobPath = () => {
      ctx.beginPath();
      const pn = nodes[PREVIEW_NODES - 1];
      ctx.moveTo((pn.x + nodes[0].x) / 2, (pn.y + nodes[0].y) / 2);
      for (let i = 0; i < PREVIEW_NODES; i++) {
        const curr = nodes[i];
        const next = nodes[(i + 1) % PREVIEW_NODES];
        ctx.quadraticCurveTo(curr.x, curr.y, (curr.x + next.x) / 2, (curr.y + next.y) / 2);
      }
      ctx.closePath();
    };

    const baseColor = getBlobColor(state.currentLevel, displaySkin);

    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.22)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 5;

    buildBlobPath();

    if (displaySpecialSkin) {
      ctx.save();
      drawSpecialSkin(ctx, displaySpecialSkin, centerX, centerY, radius, time);
      ctx.restore();
    } else {
      ctx.fillStyle = blobGradient(ctx, centerX, centerY, radius, baseColor);
      ctx.fill();
    }

    ctx.restore();

    buildBlobPath();
    ctx.strokeStyle = displaySpecialSkin ? 'rgba(0,0,0,0.2)' : darken(baseColor, 0.35);
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.stroke();

    ctx.save();
    buildBlobPath();
    ctx.clip();
    ctx.fillStyle = 'rgba(255,255,255,0.28)';
    ctx.beginPath();
    ctx.ellipse(
      centerX - radius * 0.22,
      centerY - radius * 0.28,
      radius * 0.45, radius * 0.3,
      -0.4, 0, Math.PI * 2
    );
    ctx.fill();
    ctx.restore();

    let cx = 0, cy = 0;
    for (const node of nodes) { cx += node.x; cy += node.y; }
    cx /= PREVIEW_NODES;
    cy /= PREVIEW_NODES;

    if (displayItem) {
      ctx.save();
      drawBlobItem(ctx, displayItem, nodes as any, cx, cy, radius, time, PREVIEW_NODES, 0, 0);
      ctx.restore();
    }

    const eyeY = cy - radius * 0.1;
    const eyeSize = radius * 0.08;

    if (!faceOverridesDefaultEyes(displayFace)) {
      ctx.fillStyle = '#1a237e';
      ctx.beginPath(); ctx.arc(cx - radius * 0.25, eyeY, eyeSize, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + radius * 0.25, eyeY, eyeSize, 0, Math.PI * 2); ctx.fill();
    }

    if (!faceOverridesDefaultMouth(displayFace)) {
      ctx.fillStyle = '#1a237e';
      ctx.beginPath(); ctx.arc(cx, cy + radius * 0.15, radius * 0.1, 0, Math.PI, false); ctx.fill();
    }

    if (displayFace) {
      ctx.save();
      drawBlobFace(ctx, displayFace, cx, cy, radius, 0, 0, time);
      ctx.restore();
    }

    animRef.current = requestAnimationFrame(drawPreview);
  }, [initNodes]);

  useEffect(() => {
    if (isOpen) {
      nodesRef.current = [];
      animRef.current = requestAnimationFrame(drawPreview);
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [isOpen, drawPreview]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    pointerRef.current = { down: true, x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!pointerRef.current.down) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    pointerRef.current.x = e.clientX - rect.left;
    pointerRef.current.y = e.clientY - rect.top;
  };

  const handlePointerUp = () => { pointerRef.current.down = false; };

  const canAfford = (cost: number, currency: CosmeticCurrency) =>
    currency === 'gems' ? gems >= cost : money >= cost;

  const handleTabChange = (newTab: ShopTab) => {
    setPreview(null);
    setTab(newTab);
  };

  // ─── Shop Item Card (special skins, items, faces) ───

  const renderShopItem = (
    item: { id: string; name: string; rarity: CosmeticRarity; currency: CosmeticCurrency; cost: number; description: string },
    thumbType: 'specialSkin' | 'item' | 'face',
    isOwned: boolean,
    isActive: boolean,
    onBuy: () => void,
    onToggle: () => void,
  ) => {
    const colors = RARITY_COLORS[item.rarity];
    const affordable = canAfford(item.cost, item.currency);
    const isPreviewing = preview?.type === thumbType && preview.id === item.id;

    return (
      <div
        key={item.id}
        className={`${colors.bg} rounded-xl p-3 border-2 ${
          isPreviewing ? 'border-pink-400 ring-2 ring-pink-200/60' : isActive ? 'border-pink-400' : colors.border
        } flex items-center gap-3 transition-all`}
      >
        <Thumbnail type={thumbType} id={item.id} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-800 truncate">{item.name}</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${colors.badge}`}>
              {rarityLabel(item.rarity)}
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5 font-body">{item.description}</div>
        </div>
        <div className="flex flex-col gap-1.5 flex-shrink-0">
          {!isActive && (
            <button
              onClick={() => setPreview(isPreviewing ? null : { type: thumbType, id: item.id })}
              className={`btn-game px-3 py-1.5 rounded-lg font-bold text-xs whitespace-nowrap transition-all ${
                isPreviewing
                  ? 'bg-pink-100 text-pink-600 border-b-2 border-pink-300'
                  : 'bg-slate-50 text-slate-500 border-b-2 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {isPreviewing ? 'Previewing' : 'Preview'}
            </button>
          )}
          {isOwned ? (
            <button
              onClick={() => { onToggle(); setPreview(null); }}
              className={`btn-game px-3 py-1.5 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-pink-500 text-white border-b-3 border-pink-700'
                  : 'bg-emerald-500 text-white border-b-3 border-emerald-700 hover:bg-emerald-600'
              }`}
            >
              {isActive ? 'Equipped' : 'Equip'}
            </button>
          ) : (
            <button
              onClick={onBuy}
              disabled={!affordable}
              className={`btn-game px-3 py-1.5 rounded-lg font-bold text-xs whitespace-nowrap transition-all flex items-center gap-1.5 ${
                affordable
                  ? 'bg-pink-500 text-white border-b-2 border-pink-700 hover:bg-pink-600'
                  : 'bg-slate-100 text-slate-400 border-b-2 border-slate-200 cursor-not-allowed'
              }`}
            >
              {item.currency === 'gems' ? <GemIcon size={12} /> : <CoinIcon size={12} />}
              {formatCost(item.cost, item.currency)}
            </button>
          )}
        </div>
      </div>
    );
  };

  // ─── Basic Color Skin Card ───

  const renderBasicSkin = (skin: typeof BLOB_SKINS[number]) => {
    const isOwned = unlockedSkins.includes(skin.id);
    const isActive = currentSkin === skin.id && !currentSpecialSkin;
    const isPreviewing = preview?.type === 'skin' && preview.id === skin.id;
    const affordable = skin.cost === 0 || gems >= skin.cost;

    return (
      <div
        key={skin.id}
        className={`bg-white rounded-xl p-3 border-2 ${
          isPreviewing ? 'border-pink-400 ring-2 ring-pink-200/60' : isActive ? 'border-pink-400' : 'border-slate-200'
        } flex items-center gap-3 transition-all`}
      >
        <Thumbnail type="skin" id={skin.id} />
        <div className="flex-1 min-w-0">
          <span className="font-bold text-sm text-slate-800">{skin.name}</span>
          {skin.colors.length > 0 && (
            <div className="flex gap-1 mt-1">
              {skin.colors.map((c, i) => (
                <div key={i} className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ background: c }} />
              ))}
            </div>
          )}
          {skin.colors.length === 0 && (
            <div className="text-xs text-slate-400 mt-0.5 font-body">Changes with level</div>
          )}
        </div>
        <div className="flex flex-col gap-1.5 flex-shrink-0">
          {!isActive && (
            <button
              onClick={() => setPreview(isPreviewing ? null : { type: 'skin', id: skin.id })}
              className={`btn-game px-3 py-1.5 rounded-lg font-bold text-xs whitespace-nowrap transition-all ${
                isPreviewing
                  ? 'bg-pink-100 text-pink-600 border-b-2 border-pink-300'
                  : 'bg-slate-50 text-slate-500 border-b-2 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {isPreviewing ? 'Previewing' : 'Preview'}
            </button>
          )}
          {isOwned ? (
            <button
              onClick={() => { setSkin(skin.id); setPreview(null); }}
              className={`btn-game px-3 py-1.5 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-pink-500 text-white border-b-3 border-pink-700'
                  : 'bg-emerald-500 text-white border-b-3 border-emerald-700 hover:bg-emerald-600'
              }`}
            >
              {isActive ? 'Equipped' : 'Equip'}
            </button>
          ) : (
            <button
              onClick={() => buyBlobSkin(skin.id)}
              disabled={!affordable}
              className={`btn-game px-3 py-1.5 rounded-lg font-bold text-xs whitespace-nowrap transition-all flex items-center gap-1.5 ${
                affordable
                  ? 'bg-pink-500 text-white border-b-2 border-pink-700 hover:bg-pink-600'
                  : 'bg-slate-100 text-slate-400 border-b-2 border-slate-200 cursor-not-allowed'
              }`}
            >
              <GemIcon size={12} /> {skin.cost}
            </button>
          )}
        </div>
      </div>
    );
  };

  // ─── Render ───

  return (
    <>
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={openCustomizer}
          className="btn-bar-icon relative p-2.5 bg-pink-500 text-white rounded-full border-2 border-pink-600 border-b-pink-700 hover:bg-pink-400 active:scale-95"
        >
          <StarIcon size={18} />
        </button>
        <span className="text-[10px] font-bold text-pink-600">Style</span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-30 flex items-center justify-center p-3 sm:p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-lg rounded-3xl border-3 border-pink-400 shadow-lg shadow-pink-200/40 overflow-hidden flex flex-col max-h-[92dvh]"
            >
              {/* Header */}
              <div className="panel-header-game p-4 flex justify-between items-center bg-pink-500 text-white">
                <div>
                  <h2 className="text-xl font-black tracking-tight">Customize Blob</h2>
                  <div className="text-sm opacity-90 flex items-center gap-3 mt-0.5 font-body">
                    <span className="flex items-center gap-1"><GemIcon size={13} />{gems}</span>
                    <span className="flex items-center gap-1"><CoinIcon size={13} />${money >= 1000 ? `${(money / 1000).toFixed(1)}K` : money}</span>
                  </div>
                </div>
                <button onClick={handleClose} className="p-2 border-2 border-white/50 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                  <CloseIcon size={22} />
                </button>
              </div>

              {/* Blob Preview Canvas */}
              <div className="relative bg-slate-100 border-b-2 border-slate-200">
                <canvas
                  ref={canvasRef}
                  className="w-full"
                  style={{ height: 220, touchAction: 'none' }}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                />
                {preview && (
                  <div className="absolute top-2 left-0 right-0 flex justify-center pointer-events-none">
                    <span className="bg-pink-500/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm shadow-sm">
                      Previewing cosmetic
                    </span>
                  </div>
                )}
                <div className="absolute bottom-2 left-0 right-0 text-center text-xs text-slate-400 font-body pointer-events-none">
                  Touch and drag the blob!
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b-2 border-pink-100">
                {([
                  { id: 'skins' as const, label: 'Skins', Icon: CrownIcon },
                  { id: 'items' as const, label: 'Items', Icon: ShirtIcon },
                  { id: 'faces' as const, label: 'Faces', Icon: SmileyIcon },
                ]).map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    onClick={() => handleTabChange(id)}
                    className={`flex-1 py-2.5 text-sm font-bold transition-colors flex items-center justify-center gap-1.5 ${
                      tab === id ? 'text-pink-600 border-b-3 border-pink-500' : 'text-slate-400'
                    }`}
                  >
                    <Icon size={15} /> {label}
                  </button>
                ))}
              </div>

              {/* Shop List */}
              <div className="flex-1 overflow-auto p-3 space-y-2">
                {tab === 'skins' && (
                  <>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 pb-1">Color Skins</div>
                    {BLOB_SKINS.map(skin => renderBasicSkin(skin))}
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 pt-3 pb-1">Special Skins</div>
                    {SPECIAL_SKINS.map(skin =>
                      renderShopItem(
                        skin, 'specialSkin',
                        unlockedSpecialSkins.includes(skin.id),
                        currentSpecialSkin === skin.id,
                        () => buySpecialSkin(skin.id),
                        () => { setSpecialSkin(currentSpecialSkin === skin.id ? '' : skin.id); setPreview(null); },
                      )
                    )}
                  </>
                )}
                {tab === 'items' && BLOB_ITEMS.map(item =>
                  renderShopItem(
                    item, 'item',
                    unlockedItems.includes(item.id),
                    currentItem === item.id,
                    () => buyBlobItem(item.id),
                    () => { setItem(currentItem === item.id ? '' : item.id); setPreview(null); },
                  )
                )}
                {tab === 'faces' && BLOB_FACES.map(face =>
                  renderShopItem(
                    face, 'face',
                    unlockedFaces.includes(face.id),
                    currentFace === face.id,
                    () => buyBlobFace(face.id),
                    () => { setFace(currentFace === face.id ? '' : face.id); setPreview(null); },
                  )
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
