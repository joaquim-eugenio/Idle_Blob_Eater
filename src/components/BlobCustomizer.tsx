import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import {
  SPECIAL_SKINS, BLOB_ITEMS, BLOB_FACES, BLOB_SKINS,
  RARITY_COLORS, type CosmeticRarity, type CosmeticCurrency,
} from '../lib/constants';
import { drawSpecialSkin, drawBlobItem, drawBlobFace, faceOverridesDefaultEyes, faceOverridesDefaultMouth } from '../lib/blobCosmetics';
import { X, Sparkle, Diamond, CurrencyDollar, Crown, TShirt, SmileySticker } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'motion/react';

const PREVIEW_NODES = 32;
const SPRING_K = 0.12;
const DAMPING = 0.7;
const POKE_STRENGTH = 8;
const INTERACTION_RADIUS_FACTOR = 1.8;

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

function formatCost(cost: number, currency: CosmeticCurrency): string {
  if (currency === 'gems') return `${cost}`;
  if (cost >= 1000) return `$${(cost / 1000).toFixed(cost % 1000 === 0 ? 0 : 1)}K`;
  return `$${cost}`;
}

function rarityLabel(rarity: CosmeticRarity): string {
  return rarity.charAt(0).toUpperCase() + rarity.slice(1);
}

export function BlobCustomizer() {
  const [tab, setTab] = useState<ShopTab>('skins');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<PreviewNode[]>([]);
  const animRef = useRef<number>(0);
  const pointerRef = useRef<{ down: boolean; x: number; y: number }>({ down: false, x: 0, y: 0 });

  const isOpen = useGameStore(s => s.customizerOpen);
  const openCustomizer = useGameStore(s => s.openCustomizer);
  const closeCustomizer = useGameStore(s => s.closeCustomizer);

  const currentLevel = useGameStore(s => s.currentLevel);
  const currentSkin = useGameStore(s => s.currentSkin);
  const currentSpecialSkin = useGameStore(s => s.currentSpecialSkin);
  const unlockedSpecialSkins = useGameStore(s => s.unlockedSpecialSkins);
  const currentItem = useGameStore(s => s.currentItem);
  const unlockedItems = useGameStore(s => s.unlockedItems);
  const currentFace = useGameStore(s => s.currentFace);
  const unlockedFaces = useGameStore(s => s.unlockedFaces);
  const money = useGameStore(s => s.money);
  const gems = useGameStore(s => s.gems);

  const buySpecialSkin = useGameStore(s => s.buySpecialSkin);
  const setSpecialSkin = useGameStore(s => s.setSpecialSkin);
  const buyBlobItem = useGameStore(s => s.buyBlobItem);
  const setItem = useGameStore(s => s.setItem);
  const buyBlobFace = useGameStore(s => s.buyBlobFace);
  const setFace = useGameStore(s => s.setFace);

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

    const grad = ctx.createRadialGradient(centerX, centerY - h * 0.1, 0, centerX, centerY, h * 0.7);
    grad.addColorStop(0, '#f8fafc');
    grad.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    const state = useGameStore.getState();

    ctx.save();
    ctx.beginPath();
    let prevNode = nodes[PREVIEW_NODES - 1];
    ctx.moveTo((prevNode.x + nodes[0].x) / 2, (prevNode.y + nodes[0].y) / 2);
    for (let i = 0; i < PREVIEW_NODES; i++) {
      const curr = nodes[i];
      const next = nodes[(i + 1) % PREVIEW_NODES];
      ctx.quadraticCurveTo(curr.x, curr.y, (curr.x + next.x) / 2, (curr.y + next.y) / 2);
    }
    ctx.closePath();

    if (state.currentSpecialSkin) {
      drawSpecialSkin(ctx, state.currentSpecialSkin, centerX, centerY, radius, time);
    } else {
      const baseColor = getBlobColor(state.currentLevel, state.currentSkin);
      ctx.fillStyle = baseColor;
      ctx.fill();
    }

    ctx.restore();

    let cx = 0, cy = 0;
    for (const node of nodes) { cx += node.x; cy += node.y; }
    cx /= PREVIEW_NODES;
    cy /= PREVIEW_NODES;
    const dx = 0, dy = 0;

    if (state.currentItem) {
      ctx.save();
      drawBlobItem(ctx, state.currentItem, nodes as any, cx, cy, radius, time, PREVIEW_NODES, dx, dy);
      ctx.restore();
    }

    const eyeY = cy - radius * 0.1 + dy;
    const eyeSize = radius * 0.08;
    const mouthY = cy + radius * 0.15 + dy;
    const mouthX = cx + dx;
    const faceId = state.currentFace;

    if (!faceOverridesDefaultEyes(faceId)) {
      ctx.fillStyle = '#1a237e';
      ctx.beginPath();
      ctx.arc(cx - radius * 0.25 + dx, eyeY, eyeSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + radius * 0.25 + dx, eyeY, eyeSize, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!faceOverridesDefaultMouth(faceId)) {
      ctx.fillStyle = '#1a237e';
      ctx.beginPath();
      ctx.arc(mouthX, mouthY, radius * 0.1, 0, Math.PI, false);
      ctx.fill();
    }

    if (faceId) {
      ctx.save();
      drawBlobFace(ctx, faceId, cx, cy, radius, dx, dy, time);
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

  const handlePointerUp = () => {
    pointerRef.current.down = false;
  };

  const canAfford = (cost: number, currency: CosmeticCurrency) =>
    currency === 'gems' ? gems >= cost : money >= cost;

  const renderShopItem = (
    item: { id: string; name: string; rarity: CosmeticRarity; currency: CosmeticCurrency; cost: number; description: string },
    isOwned: boolean,
    isActive: boolean,
    onBuy: () => void,
    onToggle: () => void
  ) => {
    const colors = RARITY_COLORS[item.rarity];
    const affordable = canAfford(item.cost, item.currency);
    return (
      <div key={item.id} className={`${colors.bg} rounded-xl p-3.5 border-2 ${colors.border} flex items-center justify-between gap-3`}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-800 truncate">{item.name}</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${colors.badge}`}>
              {rarityLabel(item.rarity)}
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5 font-body">{item.description}</div>
        </div>
        {isOwned ? (
          <button
            onClick={onToggle}
            className={`btn-game px-3 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${
              isActive
                ? 'bg-pink-500 text-white border-b-4 border-pink-700'
                : 'bg-slate-100 text-slate-600 border-b-4 border-slate-300 hover:bg-slate-200'
            }`}
          >
            {isActive ? 'Equipped' : 'Equip'}
          </button>
        ) : (
          <button
            onClick={onBuy}
            disabled={!affordable}
            className={`btn-game px-3 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all flex items-center gap-1.5 ${
              affordable
                ? 'bg-pink-500 text-white border-b-4 border-pink-700 hover:bg-pink-600'
                : 'bg-slate-100 text-slate-400 border-b-4 border-slate-200 cursor-not-allowed'
            }`}
          >
            {item.currency === 'gems' ? <Diamond size={14} /> : <CurrencyDollar size={14} />}
            {formatCost(item.cost, item.currency)}
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={openCustomizer}
          className="relative p-2.5 bg-pink-500 text-white rounded-full border-2 border-pink-600 shadow-md shadow-pink-200/30 hover:bg-pink-400 active:scale-95 transition-all"
        >
          <Sparkle size={18} />
        </button>
        <span className="text-[10px] font-bold text-pink-600">Style</span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCustomizer}
            className="fixed inset-0 bg-black/50 z-30 flex items-center justify-center p-3 sm:p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-lg rounded-3xl border-3 border-pink-400 shadow-lg shadow-pink-200/40 overflow-hidden flex flex-col max-h-[92dvh]"
            >
              <div className="p-4 flex justify-between items-center bg-pink-500 text-white">
                <div>
                  <h2 className="text-xl font-black tracking-tight">Customize Blob</h2>
                  <div className="text-sm opacity-90 flex items-center gap-3 mt-0.5 font-body">
                    <span className="flex items-center gap-1"><Diamond size={13} />{gems}</span>
                    <span className="flex items-center gap-1"><CurrencyDollar size={13} />${money >= 1000 ? `${(money / 1000).toFixed(1)}K` : money}</span>
                  </div>
                </div>
                <button onClick={closeCustomizer} className="p-2 border-2 border-white/50 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                  <X size={22} weight="bold" />
                </button>
              </div>

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
                <div className="absolute bottom-2 left-0 right-0 text-center text-xs text-slate-400 font-body pointer-events-none">
                  Touch and drag the blob!
                </div>
              </div>

              <div className="flex border-b-2 border-pink-100">
                {([
                  { id: 'skins' as const, label: 'Skins', Icon: Crown },
                  { id: 'items' as const, label: 'Items', Icon: TShirt },
                  { id: 'faces' as const, label: 'Faces', Icon: SmileySticker },
                ]).map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    className={`flex-1 py-2.5 text-sm font-bold transition-colors flex items-center justify-center gap-1.5 ${
                      tab === id ? 'text-pink-600 border-b-3 border-pink-500' : 'text-slate-400'
                    }`}
                  >
                    <Icon size={15} /> {label}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-auto p-3 space-y-2">
                {tab === 'skins' && SPECIAL_SKINS.map(skin =>
                  renderShopItem(
                    skin,
                    unlockedSpecialSkins.includes(skin.id),
                    currentSpecialSkin === skin.id,
                    () => buySpecialSkin(skin.id),
                    () => setSpecialSkin(currentSpecialSkin === skin.id ? '' : skin.id)
                  )
                )}
                {tab === 'items' && BLOB_ITEMS.map(item =>
                  renderShopItem(
                    item,
                    unlockedItems.includes(item.id),
                    currentItem === item.id,
                    () => buyBlobItem(item.id),
                    () => setItem(currentItem === item.id ? '' : item.id)
                  )
                )}
                {tab === 'faces' && BLOB_FACES.map(face =>
                  renderShopItem(
                    face,
                    unlockedFaces.includes(face.id),
                    currentFace === face.id,
                    () => buyBlobFace(face.id),
                    () => setFace(currentFace === face.id ? '' : face.id)
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
