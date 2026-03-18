import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import {
  SKILL_BRANCH_LABELS, SKILL_BRANCH_ORDER, SKILL_NODE_LOOKUP,
  SKILL_TREE_NODES, type SkillNodeDef,
} from '../lib/constants';
import { AnimatePresence, motion } from 'motion/react';
import { Bot, Check, Coins, Lock, Shield, Sparkles, X, Zap } from 'lucide-react';

function SkillTreeIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="22" x2="12" y2="13" />
      <line x1="12" y1="13" x2="5" y2="6" />
      <line x1="12" y1="13" x2="19" y2="6" />
      <line x1="12" y1="13" x2="12" y2="4" />
      <circle cx="12" cy="3" r="2.5" fill="currentColor" opacity={0.25} />
      <circle cx="5" cy="5" r="2.5" fill="currentColor" opacity={0.25} />
      <circle cx="19" cy="5" r="2.5" fill="currentColor" opacity={0.25} />
      <line x1="8" y1="22" x2="16" y2="22" />
    </svg>
  );
}

const CX = 1100;
const CY = 1100;
const CANVAS = 2200;
const HUB_DIST = 180;
const NODE_START = 280;
const ROW_GAP = 65;
const ZIGZAG = 48;
const CHOICE_SPREAD = 72;
const GATE_A_R = 670;
const GATE_B_R = 930;
const PROX_THRESHOLD = 140;

const BRANCH_ANGLE: Record<string, number> = {
  hunt: -Math.PI / 2,
  feast: Math.PI,
  survival: 0,
  automation: Math.PI / 2,
};

const BRANCH_HEX: Record<string, string> = {
  hunt: '#f59e0b', feast: '#10b981', survival: '#f43f5e',
  automation: '#0ea5e9', evolution: '#6366f1',
};

const BRANCH_CSS: Record<string, { ring: string; fill: string; text: string }> = {
  hunt:       { ring: 'border-amber-400',   fill: 'bg-amber-50',   text: 'text-amber-600'   },
  feast:      { ring: 'border-emerald-400', fill: 'bg-emerald-50', text: 'text-emerald-600' },
  survival:   { ring: 'border-rose-400',    fill: 'bg-rose-50',    text: 'text-rose-600'    },
  automation: { ring: 'border-sky-400',     fill: 'bg-sky-50',     text: 'text-sky-600'     },
  evolution:  { ring: 'border-indigo-400',  fill: 'bg-indigo-50',  text: 'text-indigo-600'  },
};

const BRANCH_ICON: Record<string, typeof Zap> = {
  hunt: Zap, feast: Coins, survival: Shield, automation: Bot,
};

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return Math.floor(n).toLocaleString();
}

function buildPositions(): Record<string, { x: number; y: number }> {
  const map: Record<string, { x: number; y: number }> = {};

  for (const branch of SKILL_BRANCH_ORDER) {
    const a = BRANCH_ANGLE[branch];
    const ax = Math.cos(a), ay = Math.sin(a);
    const px = -ay, py = ax;

    const nodes = SKILL_TREE_NODES
      .filter((n) => n.branch === branch)
      .sort((na, nb) => na.row - nb.row || na.cost - nb.cost);

    const byRow = new Map<number, SkillNodeDef[]>();
    for (const n of nodes) {
      if (!byRow.has(n.row)) byRow.set(n.row, []);
      byRow.get(n.row)!.push(n);
    }

    let seq = 0;
    for (const [row, group] of byRow) {
      const dist = NODE_START + (row - 1) * ROW_GAP;
      if (group.length === 1) {
        const nd = group[0];
        let perp = (seq % 2 === 0 ? -1 : 1) * ZIGZAG;
        if (nd.type === 'keystone') perp = 0;
        map[nd.id] = { x: CX + ax * dist + px * perp, y: CY + ay * dist + py * perp };
        seq++;
      } else {
        group.forEach((nd, i) => {
          const perp = i === 0 ? -CHOICE_SPREAD : CHOICE_SPREAD;
          map[nd.id] = { x: CX + ax * dist + px * perp, y: CY + ay * dist + py * perp };
        });
        seq += group.length;
      }
    }
  }

  map['apex_transcendence'] = { x: CX, y: CY };
  map['gate_a_unlock'] = { x: CX, y: CY };
  map['gate_b_unlock'] = { x: CX, y: CY };
  return map;
}

function isNodeVisible(node: SkillNodeDef, u: Set<string>): boolean {
  if (u.has(node.id)) return true;
  if (node.type === 'gate') return false;
  if (node.requires.length === 0) return true;

  const reqNodes = node.requires.map((r) => SKILL_NODE_LOOKUP[r]).filter(Boolean);
  const cg = new Set(reqNodes.filter((n) => n.choiceGroup).map((n) => n.choiceGroup!));
  for (const reqId of node.requires) {
    const rn = SKILL_NODE_LOOKUP[reqId];
    if (rn?.choiceGroup && cg.has(rn.choiceGroup)) {
      const siblings = node.requires.filter((r) => SKILL_NODE_LOOKUP[r]?.choiceGroup === rn.choiceGroup);
      if (!siblings.some((r) => u.has(r))) return false;
    } else {
      if (!u.has(reqId)) return false;
    }
  }
  if (node.gateRequired === 'gateA' && !u.has('gate_a_unlock')) return false;
  if (node.gateRequired === 'gateB' && !u.has('gate_b_unlock')) return false;
  return true;
}

function canPurchase(node: SkillNodeDef, u: Set<string>, money: number): boolean {
  if (node.type === 'gate' || u.has(node.id) || money < node.cost) return false;
  if (!isNodeVisible(node, u)) return false;
  if (node.choiceGroup && SKILL_TREE_NODES.some(
    (n) => n.choiceGroup === node.choiceGroup && n.id !== node.id && u.has(n.id)
  )) return false;
  return true;
}

function choiceLocked(node: SkillNodeDef, u: Set<string>): boolean {
  if (!node.choiceGroup) return false;
  return SKILL_TREE_NODES.some(
    (n) => n.choiceGroup === node.choiceGroup && n.id !== node.id && u.has(n.id)
  );
}

export function SkillTree() {
  const [isOpen, setIsOpen] = useState(false);
  const [zoom, setZoom] = useState(0.9);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const vpRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number>(0);

  const money = useGameStore((s) => s.money);
  const unlock = useGameStore((s) => s.unlockSkillNode);
  const unlockedIds = useGameStore((s) => s.unlockedSkillNodes);

  const uSet = useMemo(() => new Set(unlockedIds), [unlockedIds]);
  const gateA = uSet.has('gate_a_unlock');
  const gateB = uSet.has('gate_b_unlock');

  const pos = useMemo(buildPositions, []);

  const visible = useMemo(
    () => SKILL_TREE_NODES.filter((n) => n.type !== 'gate' && isNodeVisible(n, uSet)),
    [uSet],
  );

  const hubs = useMemo(() => SKILL_BRANCH_ORDER.map((b) => ({
    branch: b,
    x: CX + Math.cos(BRANCH_ANGLE[b]) * HUB_DIST,
    y: CY + Math.sin(BRANCH_ANGLE[b]) * HUB_DIST,
  })), []);

  const lines = useMemo(() => {
    const out: Array<{ x1: number; y1: number; x2: number; y2: number; color: string; bright: boolean }> = [];
    const vIds = new Set(visible.map((n) => n.id));

    for (const hub of hubs) {
      out.push({ x1: CX, y1: CY, x2: hub.x, y2: hub.y, color: '#d1d5db', bright: false });
      const first = SKILL_TREE_NODES.find((n) => n.branch === hub.branch && n.requires.length === 0);
      if (first && vIds.has(first.id)) {
        const p = pos[first.id];
        out.push({ x1: hub.x, y1: hub.y, x2: p.x, y2: p.y, color: uSet.has(first.id) ? BRANCH_HEX[hub.branch] : '#d1d5db', bright: uSet.has(first.id) });
      }
    }

    for (const nd of visible) {
      if (nd.id === 'apex_transcendence') continue;
      const to = pos[nd.id];
      if (!to) continue;
      for (const rId of nd.requires) {
        if (!vIds.has(rId)) continue;
        const from = pos[rId];
        if (!from) continue;
        const both = uSet.has(nd.id) && uSet.has(rId);
        out.push({ x1: from.x, y1: from.y, x2: to.x, y2: to.y, color: both ? (BRANCH_HEX[nd.branch] || '#6366f1') : '#d1d5db', bright: both });
      }
    }

    const apexNode = SKILL_NODE_LOOKUP['apex_transcendence'];
    if (apexNode && vIds.has('apex_transcendence')) {
      for (const rId of apexNode.requires) {
        if (!vIds.has(rId)) continue;
        const from = pos[rId];
        if (!from) continue;
        const both = uSet.has('apex_transcendence') && uSet.has(rId);
        out.push({ x1: from.x, y1: from.y, x2: CX, y2: CY, color: both ? '#6366f1' : '#a5b4fc', bright: both });
      }
    }

    return out;
  }, [visible, pos, uSet, hubs]);

  const centerOn = useCallback((pt: { x: number; y: number }, z = zoom, smooth = true) => {
    const vp = vpRef.current;
    if (!vp) return;
    const l = pt.x * z - vp.clientWidth / 2;
    const t = pt.y * z - vp.clientHeight / 2;
    const mL = Math.max(0, CANVAS * z - vp.clientWidth);
    const mT = Math.max(0, CANVAS * z - vp.clientHeight);
    vp.scrollTo({ left: Math.max(0, Math.min(mL, l)), top: Math.max(0, Math.min(mT, t)), behavior: smooth ? 'smooth' : 'auto' });
  }, [zoom]);

  useEffect(() => {
    if (!isOpen) return;
    setZoom(0.9);
    requestAnimationFrame(() => centerOn({ x: CX, y: CY }, 0.9, false));
  }, [isOpen, centerOn]);

  useEffect(() => {
    const vp = vpRef.current;
    if (!vp || !isOpen) return;
    const tick = () => {
      const cx = (vp.scrollLeft + vp.clientWidth / 2) / zoom;
      const cy = (vp.scrollTop + vp.clientHeight / 2) / zoom;
      let best: string | null = null;
      let bestD = PROX_THRESHOLD;
      for (const nd of visible) {
        const p = pos[nd.id];
        if (!p) continue;
        const d = Math.hypot(p.x - cx, p.y - cy);
        if (d < bestD) { bestD = d; best = nd.id; }
      }
      setFocusedId(best);
    };
    const onScroll = () => { clearTimeout(timerRef.current); timerRef.current = window.setTimeout(tick, 100); };
    vp.addEventListener('scroll', onScroll, { passive: true });
    tick();
    return () => { vp.removeEventListener('scroll', onScroll); clearTimeout(timerRef.current); };
  }, [isOpen, zoom, visible, pos]);

  const handleTap = (nd: SkillNodeDef, e: React.MouseEvent) => {
    e.stopPropagation();
    if (canPurchase(nd, uSet, money)) unlock(nd.id);
  };

  const apexVisible = isNodeVisible(SKILL_NODE_LOOKUP['apex_transcendence'], uSet);
  const apexUnlocked = uSet.has('apex_transcendence');
  const apexBuyable = canPurchase(SKILL_NODE_LOOKUP['apex_transcendence'], uSet, money);

  return (
    <>
      <div className="absolute bottom-8 right-8 z-10">
        <button onClick={() => setIsOpen(true)} className="relative w-16 h-16 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 active:scale-95 transition-all" aria-label="Open skill tree">
          <SkillTreeIcon size={26} />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-40 flex items-center justify-center p-2 sm:p-4" onClick={() => setIsOpen(false)}>
            <motion.div initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.97, opacity: 0 }} className="bg-slate-50 w-full max-w-7xl h-[92dvh] rounded-2xl sm:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>

              {/* Header */}
              <div className="px-4 py-3 border-b border-slate-200 bg-white flex items-center shrink-0">
                <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full" aria-label="Close">
                  <X size={20} />
                </button>
                <div className="flex-1 flex justify-center">
                  <div className="px-5 py-1.5 rounded-full bg-emerald-50 border-2 border-emerald-300 text-emerald-700 text-xl font-black whitespace-nowrap">
                    ${fmt(money)}
                  </div>
                </div>
                <div className="w-9" />
              </div>

              {/* Viewport */}
              <div ref={vpRef} className="overflow-auto flex-1 touch-pan-x touch-pan-y">
                <div className="relative" style={{ width: CANVAS * zoom, height: CANVAS * zoom }}>
                  <div className="absolute left-0 top-0" style={{ width: CANVAS, height: CANVAS, transform: `scale(${zoom})`, transformOrigin: 'top left' }}>

                    {/* Dot background */}
                    <div className="absolute inset-0" style={{ background: '#f8fafc', backgroundImage: 'radial-gradient(circle, #e2e8f0 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

                    {/* SVG: rings + connectors */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                      <circle cx={CX} cy={CY} r={GATE_A_R} fill="none" stroke={gateA ? '#818cf8' : '#94a3b8'} strokeWidth={gateA ? 3 : 2} strokeDasharray={gateA ? undefined : '10 8'} opacity={gateA ? 0.65 : 0.2} />
                      <circle cx={CX} cy={CY} r={GATE_B_R} fill="none" stroke={gateB ? '#818cf8' : '#94a3b8'} strokeWidth={gateB ? 3 : 2} strokeDasharray={gateB ? undefined : '10 8'} opacity={gateB ? 0.65 : 0.2} />
                      {lines.map((l, i) => (
                        <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={l.color} strokeWidth={l.bright ? 5 : 4} strokeLinecap="round" opacity={l.bright ? 1 : 0.4} />
                      ))}
                    </svg>

                    {/* Blob Core */}
                    <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: CX, top: CY, zIndex: 4 }}>
                      {apexVisible ? (
                        <button
                          onClick={(e) => handleTap(SKILL_NODE_LOOKUP['apex_transcendence'], e)}
                          className={`w-[100px] h-[100px] rounded-full border-[5px] flex flex-col items-center justify-center transition-all ${
                            apexUnlocked
                              ? 'bg-gradient-to-br from-indigo-100 to-purple-100 border-indigo-400 shadow-xl shadow-indigo-300/50'
                              : apexBuyable
                                ? 'bg-white border-indigo-400 shadow-lg ring-2 ring-offset-2 ring-indigo-400 animate-pulse cursor-pointer'
                                : 'bg-slate-100 border-slate-300'
                          }`}
                        >
                          {apexUnlocked ? (
                            <Sparkles size={30} className="text-indigo-600" />
                          ) : (
                            <>
                              <Sparkles size={22} className={apexBuyable ? 'text-indigo-500' : 'text-slate-400'} />
                              <span className={`text-[7px] font-black mt-0.5 ${apexBuyable ? 'text-indigo-600' : 'text-slate-400'}`}>APEX</span>
                            </>
                          )}
                          {!apexUnlocked && (
                            <span className={`absolute -bottom-3 px-2 py-0.5 rounded-full text-[9px] font-black ${apexBuyable ? 'bg-indigo-600 text-white' : 'bg-slate-500 text-white'}`}>
                              $700
                            </span>
                          )}
                        </button>
                      ) : (
                        <div className="w-[100px] h-[100px] rounded-full border-[5px] border-slate-300 bg-white flex items-center justify-center">
                          <div className="w-[50px] h-[50px] rounded-full border-[4px] border-slate-300 flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-slate-400" />
                          </div>
                        </div>
                      )}
                      <div className="absolute left-1/2 -translate-x-1/2 top-[108px] px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-black shadow-sm whitespace-nowrap">
                        Blob Core
                      </div>
                    </div>

                    {/* Branch hubs */}
                    {hubs.map(({ branch, x, y }) => {
                      const Icon = BRANCH_ICON[branch];
                      const css = BRANCH_CSS[branch];
                      const angle = BRANCH_ANGLE[branch];
                      const labelAngle = angle + (branch === 'automation' ? 1 : -1) * (Math.PI / 2);
                      const lx = x + Math.cos(labelAngle) * 85;
                      const ly = y + Math.sin(labelAngle) * 85;
                      return (
                        <React.Fragment key={branch}>
                          <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: x, top: y, zIndex: 4 }}>
                            <div className={`w-[66px] h-[66px] rounded-full border-[4px] ${css.ring} bg-white flex items-center justify-center shadow-sm`}>
                              <Icon size={24} className={css.text} />
                            </div>
                          </div>
                          <div className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ left: lx, top: ly, zIndex: 4 }}>
                            <span className={`text-[11px] font-black ${css.text} uppercase tracking-wider whitespace-nowrap`}>
                              {SKILL_BRANCH_LABELS[branch]}
                            </span>
                          </div>
                        </React.Fragment>
                      );
                    })}

                    {/* Skill nodes */}
                    {visible.filter((n) => n.id !== 'apex_transcendence').map((nd) => {
                      const p = pos[nd.id];
                      if (!p) return null;
                      const unlocked = uSet.has(nd.id);
                      const buyable = canPurchase(nd, uSet, money);
                      const cLocked = choiceLocked(nd, uSet);
                      const css = BRANCH_CSS[nd.branch] || BRANCH_CSS.evolution;
                      const hex = BRANCH_HEX[nd.branch] || '#6366f1';
                      const Icon = BRANCH_ICON[nd.branch] || Sparkles;

                      const isMinor = nd.type === 'minor';
                      const isKS = nd.type === 'keystone';
                      const sz = isMinor ? 48 : isKS ? 68 : 56;
                      const bw = isKS ? 4 : 3;

                      let border: string, bg: string, shadow: string, extra: string;
                      if (unlocked) {
                        border = hex; bg = 'white'; shadow = `0 2px 8px ${hex}40`; extra = '';
                      } else if (buyable) {
                        border = '#3b82f6'; bg = 'white'; shadow = '0 0 0 3px rgba(59,130,246,0.3)'; extra = 'animate-pulse cursor-pointer';
                      } else if (cLocked) {
                        border = '#cbd5e1'; bg = '#e2e8f0'; shadow = 'none'; extra = 'opacity-40 cursor-not-allowed';
                      } else {
                        border = '#cbd5e1'; bg = '#f1f5f9'; shadow = 'none'; extra = '';
                      }

                      return (
                        <button
                          key={nd.id}
                          onClick={(e) => handleTap(nd, e)}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-all ${extra}`}
                          style={{ left: p.x, top: p.y, width: sz, height: sz, borderWidth: bw, borderStyle: 'solid', borderColor: border, background: bg, boxShadow: shadow, zIndex: 5 }}
                        >
                          {unlocked ? (
                            <div className="flex items-center justify-center" style={{ color: hex }}>
                              <Check size={isMinor ? 16 : 20} strokeWidth={3} />
                            </div>
                          ) : (
                            <Icon size={isMinor ? 14 : 18} style={{ color: buyable ? hex : '#94a3b8' }} />
                          )}

                          {!unlocked && !cLocked && (
                            <span className="absolute -bottom-2.5 px-1.5 py-0.5 rounded-full text-[8px] font-black text-white" style={{ background: buyable ? '#3b82f6' : '#64748b' }}>
                              ${nd.cost}
                            </span>
                          )}
                          {isKS && !unlocked && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 border border-amber-500 flex items-center justify-center">
                              <Sparkles size={8} className="text-amber-800" />
                            </span>
                          )}
                          {nd.choiceGroup && !unlocked && !cLocked && (
                            <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-purple-400 border border-purple-500 flex items-center justify-center text-white text-[7px] font-black">?</span>
                          )}
                          {cLocked && (
                            <Lock size={12} className="text-slate-400" />
                          )}
                        </button>
                      );
                    })}

                    {/* Proximity tooltip */}
                    {focusedId && focusedId !== 'apex_transcendence' && (() => {
                      const nd = SKILL_NODE_LOOKUP[focusedId];
                      const p = pos[focusedId];
                      if (!nd || !p) return null;
                      const unlocked = uSet.has(nd.id);
                      const buyable = canPurchase(nd, uSet, money);
                      return (
                        <div className="absolute pointer-events-none" style={{ left: p.x, top: p.y + (nd.type === 'keystone' ? 48 : nd.type === 'minor' ? 36 : 40), transform: 'translateX(-50%)', zIndex: 20 }}>
                          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800/95 backdrop-blur text-white rounded-xl px-3 py-2 shadow-xl max-w-[190px] text-center">
                            <div className="text-[11px] font-black">{nd.title}</div>
                            <div className="text-[9px] text-slate-300 mt-0.5 leading-snug">{nd.shortDesc}</div>
                            {!unlocked && <div className="text-[10px] font-bold text-amber-300 mt-1">Cost: ${nd.cost}</div>}
                            {buyable && <div className="text-[10px] font-bold text-emerald-300 mt-0.5">Tap to unlock</div>}
                            {unlocked && <div className="text-[9px] font-bold text-emerald-400 mt-0.5">Unlocked</div>}
                          </motion.div>
                        </div>
                      );
                    })()}

                    {/* Apex tooltip */}
                    {focusedId === 'apex_transcendence' && apexVisible && (() => {
                      const nd = SKILL_NODE_LOOKUP['apex_transcendence'];
                      if (!nd) return null;
                      return (
                        <div className="absolute pointer-events-none" style={{ left: CX, top: CY + 68, transform: 'translateX(-50%)', zIndex: 20 }}>
                          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800/95 backdrop-blur text-white rounded-xl px-3 py-2 shadow-xl max-w-[190px] text-center">
                            <div className="text-[11px] font-black">{nd.title}</div>
                            <div className="text-[9px] text-slate-300 mt-0.5 leading-snug">{nd.shortDesc}</div>
                            {!apexUnlocked && <div className="text-[10px] font-bold text-amber-300 mt-1">Cost: ${nd.cost}</div>}
                            {apexBuyable && <div className="text-[10px] font-bold text-emerald-300 mt-0.5">Tap to unlock</div>}
                            {apexUnlocked && <div className="text-[9px] font-bold text-emerald-400 mt-0.5">Unlocked</div>}
                          </motion.div>
                        </div>
                      );
                    })()}

                  </div>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
