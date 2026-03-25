interface BlobNode {
  x: number; y: number; vx: number; vy: number;
}

// ─── SPECIAL SKIN DRAW FUNCTIONS ────────────────────────────────────────────

function drawLavaFlow(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, time: number) {
  const grad = ctx.createRadialGradient(cx, cy, radius * 0.1, cx, cy, radius);
  grad.addColorStop(0, '#fbbf24');
  grad.addColorStop(0.4, '#f97316');
  grad.addColorStop(0.8, '#dc2626');
  grad.addColorStop(1, '#7f1d1d');
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.save();
  ctx.clip();
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = radius * 0.04;
  ctx.globalAlpha = 0.6;
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + time * 0.3;
    const r1 = radius * 0.2;
    const r2 = radius * 0.85;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
    ctx.quadraticCurveTo(
      cx + Math.cos(a + 0.3) * radius * 0.5,
      cy + Math.sin(a + 0.3) * radius * 0.5,
      cx + Math.cos(a + 0.1) * r2,
      cy + Math.sin(a + 0.1) * r2
    );
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawOceanDepths(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, time: number) {
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  grad.addColorStop(0, '#67e8f9');
  grad.addColorStop(0.5, '#0ea5e9');
  grad.addColorStop(1, '#1e3a5f');
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.save();
  ctx.clip();
  for (let i = 0; i < 4; i++) {
    const phase = (time * 1.5 + i * 0.8) % 3;
    const r = radius * (0.2 + phase * 0.3);
    const alpha = 0.4 * (1 - phase / 3);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(103, 232, 249, ${alpha})`;
    ctx.lineWidth = radius * 0.03;
    ctx.stroke();
  }
  ctx.restore();
}

function drawPixelBlob(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, _time: number) {
  ctx.fillStyle = '#4ade80';
  ctx.fill();
  ctx.save();
  ctx.clip();
  const gridSize = radius * 0.2;
  const startX = cx - radius;
  const startY = cy - radius;
  for (let gx = startX; gx < cx + radius; gx += gridSize) {
    for (let gy = startY; gy < cy + radius; gy += gridSize) {
      const ix = Math.floor((gx - startX) / gridSize);
      const iy = Math.floor((gy - startY) / gridSize);
      if ((ix + iy) % 2 === 0) {
        ctx.fillStyle = 'rgba(34, 197, 94, 0.5)';
        ctx.fillRect(gx, gy, gridSize, gridSize);
      }
    }
  }
  ctx.restore();
}

function drawCandySwirl(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, time: number) {
  const colors = ['#ec4899', '#f472b6', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa'];
  const segments = colors.length;
  const rotation = time * 0.5;
  ctx.save();
  ctx.clip();
  for (let i = 0; i < segments; i++) {
    const startAngle = (i / segments) * Math.PI * 2 + rotation;
    const endAngle = ((i + 1) / segments) * Math.PI * 2 + rotation;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius * 1.2, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = colors[i];
    ctx.fill();
  }
  ctx.restore();
}

function drawSlimeKing(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, time: number) {
  ctx.fillStyle = 'rgba(74, 222, 128, 0.7)';
  ctx.fill();
  ctx.save();
  ctx.clip();
  const grad = ctx.createRadialGradient(cx, cy - radius * 0.2, 0, cx, cy, radius);
  grad.addColorStop(0, 'rgba(187, 247, 208, 0.4)');
  grad.addColorStop(1, 'rgba(22, 101, 52, 0.5)');
  ctx.fillStyle = grad;
  ctx.fill();
  for (let i = 0; i < 4; i++) {
    const dx = Math.sin(time + i * 1.8) * radius * 0.3;
    const dripY = cy + radius * 0.6 + Math.sin(time * 2 + i) * radius * 0.15;
    ctx.beginPath();
    ctx.ellipse(cx + dx, dripY, radius * 0.08, radius * 0.18, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(22, 163, 74, 0.6)';
    ctx.fill();
  }
  ctx.restore();
}

function drawCherryBlossom(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, time: number) {
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  grad.addColorStop(0, '#fce7f3');
  grad.addColorStop(0.6, '#f9a8d4');
  grad.addColorStop(1, '#ec4899');
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.save();
  ctx.clip();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + time * 0.4;
    const r = radius * (0.5 + Math.sin(time + i) * 0.2);
    const px = cx + Math.cos(a) * r;
    const py = cy + Math.sin(a) * r;
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(a + time);
    ctx.beginPath();
    ctx.ellipse(0, 0, radius * 0.05, radius * 0.1, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(251, 207, 232, 0.8)';
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

function drawFrozenHeart(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, _time: number) {
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  grad.addColorStop(0, '#e0f2fe');
  grad.addColorStop(0.5, '#7dd3fc');
  grad.addColorStop(1, '#0284c7');
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.save();
  ctx.clip();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = radius * 0.02;
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * radius * 0.9, cy + Math.sin(a) * radius * 0.9);
    ctx.stroke();
    const branchA1 = a + 0.4;
    const branchA2 = a - 0.4;
    const mid = radius * 0.5;
    const bx = cx + Math.cos(a) * mid;
    const by = cy + Math.sin(a) * mid;
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(bx + Math.cos(branchA1) * radius * 0.25, by + Math.sin(branchA1) * radius * 0.25);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(bx + Math.cos(branchA2) * radius * 0.25, by + Math.sin(branchA2) * radius * 0.25);
    ctx.stroke();
  }
  ctx.restore();
}

function drawElectricStorm(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, time: number) {
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  grad.addColorStop(0, '#67e8f9');
  grad.addColorStop(0.6, '#06b6d4');
  grad.addColorStop(1, '#155e75');
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.save();
  ctx.clip();
  const seed = Math.floor(time * 3);
  ctx.strokeStyle = '#e0f2fe';
  ctx.lineWidth = radius * 0.03;
  ctx.shadowBlur = 8;
  ctx.shadowColor = '#67e8f9';
  for (let i = 0; i < 3; i++) {
    const a1 = ((seed + i * 37) % 100) / 100 * Math.PI * 2;
    const a2 = ((seed + i * 37 + 50) % 100) / 100 * Math.PI * 2;
    const x1 = cx + Math.cos(a1) * radius * 0.7;
    const y1 = cy + Math.sin(a1) * radius * 0.7;
    const x2 = cx + Math.cos(a2) * radius * 0.7;
    const y2 = cy + Math.sin(a2) * radius * 0.7;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    const segs = 4;
    for (let s = 1; s <= segs; s++) {
      const t = s / segs;
      const jx = (Math.sin(seed * 7 + i * 13 + s * 17) * 0.5) * radius * 0.2;
      const jy = (Math.cos(seed * 11 + i * 19 + s * 23) * 0.5) * radius * 0.2;
      ctx.lineTo(x1 + (x2 - x1) * t + jx, y1 + (y2 - y1) * t + jy);
    }
    ctx.stroke();
  }
  ctx.shadowBlur = 0;
  ctx.restore();
}

function drawNebula(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, time: number) {
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  grad.addColorStop(0, '#e879f9');
  grad.addColorStop(0.4, '#a855f7');
  grad.addColorStop(0.7, '#6d28d9');
  grad.addColorStop(1, '#1e1b4b');
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.save();
  ctx.clip();
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 + Math.sin(time * 0.3 + i) * 0.2;
    const r = radius * (0.2 + (i % 4) * 0.15 + Math.sin(time * 2 + i * 2) * 0.05);
    const sx = cx + Math.cos(a) * r;
    const sy = cy + Math.sin(a) * r;
    const twinkle = 0.4 + Math.sin(time * 4 + i * 3) * 0.4;
    ctx.beginPath();
    ctx.arc(sx, sy, radius * 0.02, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
    ctx.fill();
  }
  ctx.restore();
}

function drawMagmaCore(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, time: number) {
  const coreSize = 0.3 + Math.sin(time * 3) * 0.08;
  const grad = ctx.createRadialGradient(cx, cy, radius * coreSize, cx, cy, radius);
  grad.addColorStop(0, '#fbbf24');
  grad.addColorStop(0.3, '#f97316');
  grad.addColorStop(0.6, '#7f1d1d');
  grad.addColorStop(1, '#1c1917');
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.save();
  ctx.clip();
  const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * coreSize);
  coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
  coreGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * coreSize * 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawHolographic(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, time: number) {
  ctx.save();
  ctx.clip();
  const slices = 36;
  for (let i = 0; i < slices; i++) {
    const a1 = (i / slices) * Math.PI * 2;
    const a2 = ((i + 1) / slices) * Math.PI * 2;
    const hue = ((i / slices) * 360 + time * 60) % 360;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius * 1.2, a1, a2);
    ctx.closePath();
    ctx.fillStyle = `hsla(${hue}, 80%, 65%, 0.9)`;
    ctx.fill();
  }
  const highlightX = cx + Math.cos(time * 1.5) * radius * 0.3;
  const highlightY = cy + Math.sin(time * 1.5) * radius * 0.3;
  const hGrad = ctx.createRadialGradient(highlightX, highlightY, 0, highlightX, highlightY, radius * 0.6);
  hGrad.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
  hGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = hGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawCrystal(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, time: number) {
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  grad.addColorStop(0, '#e0e7ff');
  grad.addColorStop(0.5, '#a5b4fc');
  grad.addColorStop(1, '#4f46e5');
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.save();
  ctx.clip();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = radius * 0.015;
  const facets = 8;
  for (let i = 0; i < facets; i++) {
    const a = (i / facets) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius);
    ctx.stroke();
  }
  const specX = cx + Math.cos(time * 0.8) * radius * 0.35;
  const specY = cy + Math.sin(time * 0.8) * radius * 0.35;
  const sGrad = ctx.createRadialGradient(specX, specY, 0, specX, specY, radius * 0.35);
  sGrad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
  sGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = sGrad;
  ctx.beginPath();
  ctx.arc(specX, specY, radius * 0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawVoidWalker(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, time: number) {
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  grad.addColorStop(0, '#1e1b4b');
  grad.addColorStop(0.5, '#0f0a1e');
  grad.addColorStop(1, '#000000');
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.save();
  ctx.clip();
  for (let i = 0; i < 10; i++) {
    const spiralAngle = (i / 10) * Math.PI * 2 + time * 1.2;
    const spiralR = radius * (0.8 - (time * 0.2 + i * 0.05) % 0.7);
    const px = cx + Math.cos(spiralAngle) * spiralR;
    const py = cy + Math.sin(spiralAngle) * spiralR;
    const size = radius * 0.03 * (0.5 + Math.sin(time * 3 + i) * 0.5);
    ctx.beginPath();
    ctx.arc(px, py, size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(168, 85, 247, ${0.4 + Math.sin(time * 2 + i * 2) * 0.3})`;
    ctx.fill();
  }
  ctx.restore();
}

function drawDragonScale(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, _time: number) {
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  grad.addColorStop(0, '#fbbf24');
  grad.addColorStop(0.5, '#dc2626');
  grad.addColorStop(1, '#7f1d1d');
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.save();
  ctx.clip();
  const scaleSize = radius * 0.15;
  const rows = Math.ceil(radius * 2 / (scaleSize * 0.8));
  for (let row = 0; row < rows; row++) {
    const y = cy - radius + row * scaleSize * 0.8;
    const offset = row % 2 === 0 ? 0 : scaleSize * 0.5;
    for (let col = -1; col < rows + 1; col++) {
      const x = cx - radius + col * scaleSize + offset;
      const dist = Math.hypot(x - cx, y - cy);
      if (dist > radius + scaleSize) continue;
      ctx.beginPath();
      ctx.arc(x, y, scaleSize, Math.PI * 0.8, Math.PI * 0.2);
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.35)';
      ctx.lineWidth = radius * 0.015;
      ctx.stroke();
    }
  }
  ctx.shadowBlur = 10;
  ctx.shadowColor = '#f97316';
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.95, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(249, 115, 22, 0.3)';
  ctx.lineWidth = radius * 0.04;
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.restore();
}

function drawDiscoBall(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, time: number) {
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  grad.addColorStop(0, '#e2e8f0');
  grad.addColorStop(0.5, '#94a3b8');
  grad.addColorStop(1, '#475569');
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.save();
  ctx.clip();
  const tileSize = radius * 0.14;
  for (let gx = cx - radius; gx < cx + radius; gx += tileSize * 1.1) {
    for (let gy = cy - radius; gy < cy + radius; gy += tileSize * 1.1) {
      const dist = Math.hypot(gx - cx, gy - cy);
      if (dist > radius * 0.9) continue;
      const hue = (gx * 3 + gy * 5 + time * 80) % 360;
      const brightness = 60 + Math.sin(time * 4 + gx * 0.1 + gy * 0.1) * 20;
      ctx.fillStyle = `hsla(${hue}, 40%, ${brightness}%, 0.4)`;
      ctx.fillRect(gx, gy, tileSize * 0.9, tileSize * 0.9);
    }
  }
  const rayColors = ['#ef4444', '#3b82f6', '#22c55e', '#fbbf24', '#ec4899'];
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + time * 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    const rx = cx + Math.cos(a) * radius * 1.3;
    const ry = cy + Math.sin(a) * radius * 1.3;
    ctx.lineTo(rx, ry);
    ctx.strokeStyle = `${rayColors[i]}66`;
    ctx.lineWidth = radius * 0.06;
    ctx.stroke();
  }
  ctx.restore();
}

const SKIN_DRAW_MAP: Record<string, (ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, time: number) => void> = {
  lava_flow: drawLavaFlow,
  ocean_depths: drawOceanDepths,
  pixel_blob: drawPixelBlob,
  candy_swirl: drawCandySwirl,
  slime_king: drawSlimeKing,
  cherry_blossom: drawCherryBlossom,
  frozen_heart: drawFrozenHeart,
  electric_storm: drawElectricStorm,
  nebula: drawNebula,
  magma_core: drawMagmaCore,
  holographic: drawHolographic,
  crystal: drawCrystal,
  void_walker: drawVoidWalker,
  dragon_scale: drawDragonScale,
  disco_ball: drawDiscoBall,
};

export function drawSpecialSkin(ctx: CanvasRenderingContext2D, skinId: string, cx: number, cy: number, radius: number, time: number): boolean {
  const fn = SKIN_DRAW_MAP[skinId];
  if (!fn) return false;
  fn(ctx, cx, cy, radius, time);
  return true;
}

// ─── BLOB ITEM (ACCESSORY) DRAW FUNCTIONS ───────────────────────────────────

function getNodePos(nodes: BlobNode[], index: number, total: number): { x: number; y: number } {
  const i = ((index % total) + total) % total;
  return { x: nodes[i].x, y: nodes[i].y };
}

function midpoint(a: { x: number; y: number }, b: { x: number; y: number }): { x: number; y: number } {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function drawRedBowTie(ctx: CanvasRenderingContext2D, nodes: BlobNode[], _cx: number, cy: number, radius: number, _time: number, numNodes: number) {
  const bot = getNodePos(nodes, Math.floor(numNodes * 0.25), numNodes);
  const size = radius * 0.18;
  const tieY = bot.y - radius * 0.08;
  ctx.save();
  ctx.translate(bot.x, tieY);
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-size, -size * 0.6);
  ctx.lineTo(-size * 0.3, 0);
  ctx.lineTo(-size, size * 0.6);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(size, -size * 0.6);
  ctx.lineTo(size * 0.3, 0);
  ctx.lineTo(size, size * 0.6);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#b91c1c';
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawFlower(ctx: CanvasRenderingContext2D, nodes: BlobNode[], _cx: number, _cy: number, radius: number, time: number, numNodes: number) {
  const topRight = getNodePos(nodes, Math.floor(numNodes * 0.875), numNodes);
  const petalSize = radius * 0.08;
  const bob = Math.sin(time * 2) * radius * 0.02;
  ctx.save();
  ctx.translate(topRight.x, topRight.y + bob);
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    ctx.beginPath();
    ctx.ellipse(Math.cos(a) * petalSize, Math.sin(a) * petalSize, petalSize * 0.7, petalSize * 0.4, a, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(0, 0, petalSize * 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawPartyHat(ctx: CanvasRenderingContext2D, nodes: BlobNode[], _cx: number, _cy: number, radius: number, _time: number, numNodes: number) {
  const top = getNodePos(nodes, Math.floor(numNodes * 0.75), numNodes);
  const left = getNodePos(nodes, Math.floor(numNodes * 0.69), numNodes);
  const right = getNodePos(nodes, Math.floor(numNodes * 0.81), numNodes);
  const baseL = midpoint(top, left);
  const baseR = midpoint(top, right);
  const tipY = top.y - radius * 0.55;
  ctx.save();
  ctx.fillStyle = '#8b5cf6';
  ctx.beginPath();
  ctx.moveTo(baseL.x, baseL.y);
  ctx.lineTo((baseL.x + baseR.x) / 2, tipY);
  ctx.lineTo(baseR.x, baseR.y);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = radius * 0.02;
  const stripes = 3;
  for (let i = 1; i <= stripes; i++) {
    const t = i / (stripes + 1);
    const y = baseL.y + (tipY - baseL.y) * t;
    const halfW = (1 - t) * (baseR.x - baseL.x) * 0.5;
    const mx = (baseL.x + baseR.x) / 2;
    ctx.beginPath();
    ctx.moveTo(mx - halfW, y);
    ctx.lineTo(mx + halfW, y);
    ctx.stroke();
  }
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc((baseL.x + baseR.x) / 2, tipY, radius * 0.04, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawScarf(ctx: CanvasRenderingContext2D, nodes: BlobNode[], _cx: number, _cy: number, radius: number, time: number, numNodes: number) {
  ctx.save();
  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = radius * 0.08;
  ctx.lineCap = 'round';
  ctx.beginPath();
  const startIdx = Math.floor(numNodes * 0.1);
  const endIdx = Math.floor(numNodes * 0.4);
  const first = getNodePos(nodes, startIdx, numNodes);
  ctx.moveTo(first.x, first.y);
  for (let i = startIdx + 1; i <= endIdx; i++) {
    const n = getNodePos(nodes, i, numNodes);
    ctx.lineTo(n.x, n.y);
  }
  ctx.stroke();
  const last = getNodePos(nodes, endIdx, numNodes);
  const dangLen = radius * 0.3;
  const wave = Math.sin(time * 3) * radius * 0.05;
  ctx.beginPath();
  ctx.moveTo(last.x, last.y);
  ctx.quadraticCurveTo(last.x - dangLen * 0.3 + wave, last.y + dangLen * 0.5, last.x - dangLen * 0.5 + wave * 1.5, last.y + dangLen);
  ctx.stroke();
  ctx.restore();
}

function drawHeadphones(ctx: CanvasRenderingContext2D, nodes: BlobNode[], cx: number, _cy: number, radius: number, _time: number, numNodes: number) {
  const left = getNodePos(nodes, Math.floor(numNodes * 0.5), numNodes);
  const right = getNodePos(nodes, 0, numNodes);
  const top = getNodePos(nodes, Math.floor(numNodes * 0.75), numNodes);
  const cupR = radius * 0.18;
  const padR = radius * 0.14;

  const lx = left.x + radius * 0.04;
  const ly = left.y;
  const rx = right.x - radius * 0.04;
  const ry = right.y;

  ctx.save();
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = radius * 0.05;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(lx, ly - cupR * 0.3);
  ctx.quadraticCurveTo(top.x, top.y - radius * 0.5, rx, ry - cupR * 0.3);
  ctx.stroke();

  for (const [ex, ey] of [[lx, ly], [rx, ry]]) {
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.ellipse(ex, ey, cupR * 0.6, cupR, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.ellipse(ex, ey, padR * 0.5, padR * 0.85, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.arc(ex, ey, padR * 0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#475569';
    ctx.lineWidth = radius * 0.01;
    ctx.beginPath();
    ctx.arc(ex, ey, padR * 0.25, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawPiratePatch(ctx: CanvasRenderingContext2D, _nodes: BlobNode[], cx: number, cy: number, radius: number, _time: number, _numNodes: number) {
  const eyeX = cx - radius * 0.25;
  const eyeY = cy - radius * 0.1;
  ctx.save();

  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = radius * 0.025;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(eyeX - radius * 0.12, eyeY - radius * 0.04);
  ctx.quadraticCurveTo(cx - radius * 0.6, eyeY - radius * 0.5, cx, cy - radius * 0.95);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(eyeX + radius * 0.12, eyeY - radius * 0.04);
  ctx.quadraticCurveTo(cx + radius * 0.2, eyeY - radius * 0.55, cx + radius * 0.5, cy - radius * 0.8);
  ctx.stroke();

  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.ellipse(eyeX, eyeY, radius * 0.13, radius * 0.14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.ellipse(eyeX, eyeY, radius * 0.09, radius * 0.1, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawSunglasses(ctx: CanvasRenderingContext2D, _nodes: BlobNode[], cx: number, cy: number, radius: number, dx: number, dy: number) {
  const eyeY = cy - radius * 0.1 + dy;
  const leftX = cx - radius * 0.25 + dx;
  const rightX = cx + radius * 0.25 + dx;
  const lensW = radius * 0.16;
  const lensH = radius * 0.11;
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.beginPath();
  ctx.ellipse(leftX, eyeY, lensW, lensH, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(rightX, eyeY, lensW, lensH, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = radius * 0.025;
  ctx.beginPath();
  ctx.moveTo(leftX + lensW, eyeY);
  ctx.lineTo(rightX - lensW, eyeY);
  ctx.stroke();
  const gradient = ctx.createLinearGradient(leftX - lensW, eyeY - lensH, leftX + lensW, eyeY + lensH);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(leftX, eyeY, lensW * 0.7, lensH * 0.5, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(rightX, eyeY, lensW * 0.7, lensH * 0.5, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawNinjaBandana(ctx: CanvasRenderingContext2D, nodes: BlobNode[], cx: number, _cy: number, radius: number, time: number, numNodes: number) {
  ctx.save();
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  const bandStart = Math.floor(numNodes * 0.6);
  const bandEnd = Math.floor(numNodes * 0.9);
  const bandWidth = radius * 0.07;
  const firstN = getNodePos(nodes, bandStart, numNodes);
  ctx.moveTo(firstN.x, firstN.y - bandWidth);
  for (let i = bandStart + 1; i <= bandEnd; i++) {
    const n = getNodePos(nodes, i % numNodes, numNodes);
    ctx.lineTo(n.x, n.y - bandWidth);
  }
  for (let i = bandEnd; i >= bandStart; i--) {
    const n = getNodePos(nodes, i % numNodes, numNodes);
    ctx.lineTo(n.x, n.y + bandWidth);
  }
  ctx.closePath();
  ctx.fill();
  const tailNode = getNodePos(nodes, Math.floor(numNodes * 0.5), numNodes);
  const tailLen = radius * 0.4;
  const wave1 = Math.sin(time * 4) * radius * 0.06;
  const wave2 = Math.sin(time * 4 + 1.5) * radius * 0.08;
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = radius * 0.06;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(tailNode.x, tailNode.y);
  ctx.quadraticCurveTo(tailNode.x - tailLen * 0.4 + wave1, tailNode.y - tailLen * 0.3, tailNode.x - tailLen + wave2, tailNode.y - tailLen * 0.2);
  ctx.stroke();
  ctx.lineWidth = radius * 0.04;
  ctx.beginPath();
  ctx.moveTo(tailNode.x, tailNode.y + bandWidth * 0.5);
  ctx.quadraticCurveTo(tailNode.x - tailLen * 0.3 + wave2, tailNode.y - tailLen * 0.2, tailNode.x - tailLen * 0.8 + wave1, tailNode.y - tailLen * 0.1);
  ctx.stroke();
  ctx.restore();

  const topNode = getNodePos(nodes, Math.floor(numNodes * 0.75), numNodes);
  ctx.fillStyle = '#64748b';
  ctx.beginPath();
  ctx.arc(topNode.x, topNode.y, radius * 0.035, 0, Math.PI * 2);
  ctx.fill();
}

function drawCape(ctx: CanvasRenderingContext2D, nodes: BlobNode[], _cx: number, _cy: number, radius: number, time: number, numNodes: number) {
  const topAttach = getNodePos(nodes, Math.floor(numNodes * 0.625), numNodes);
  const botAttach = getNodePos(nodes, Math.floor(numNodes * 0.375), numNodes);
  const capeLen = radius * 1.1;
  const segments = 8;

  ctx.save();
  const attachMidX = (topAttach.x + botAttach.x) / 2;
  const attachMidY = (topAttach.y + botAttach.y) / 2;
  const attachH = Math.abs(topAttach.y - botAttach.y);

  const points: { x: number; y: number }[][] = [];
  for (let s = 0; s <= segments; s++) {
    const t = s / segments;
    const waveAmp = t * t * radius * 0.25;
    const waveOffset = Math.sin(time * 4 - t * Math.PI * 1.5) * waveAmp;
    const secondaryWave = Math.sin(time * 6.5 - t * Math.PI * 2.5) * waveAmp * 0.3;

    const segX = attachMidX - t * capeLen;
    const halfH = (attachH * 0.5) * (1 + t * 0.4);

    const topY = attachMidY - halfH + waveOffset + secondaryWave;
    const botY = attachMidY + halfH + waveOffset - secondaryWave * 0.5;
    points.push([
      { x: segX, y: topY },
      { x: segX, y: botY },
    ]);
  }

  const grad = ctx.createLinearGradient(attachMidX, attachMidY, attachMidX - capeLen, attachMidY);
  grad.addColorStop(0, '#dc2626');
  grad.addColorStop(0.5, '#b91c1c');
  grad.addColorStop(1, '#7f1d1d');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(topAttach.x, topAttach.y);
  for (let s = 1; s <= segments; s++) {
    const prev = points[s - 1][0];
    const curr = points[s][0];
    ctx.quadraticCurveTo(prev.x, prev.y, (prev.x + curr.x) / 2, (prev.y + curr.y) / 2);
  }
  const tip = points[segments];
  ctx.lineTo(tip[0].x, tip[0].y);
  ctx.lineTo(tip[1].x, tip[1].y);
  for (let s = segments - 1; s >= 1; s--) {
    const prev = points[s + 1][1];
    const curr = points[s][1];
    ctx.quadraticCurveTo(prev.x, prev.y, (prev.x + curr.x) / 2, (prev.y + curr.y) / 2);
  }
  ctx.lineTo(botAttach.x, botAttach.y);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = radius * 0.01;
  for (let s = 2; s < segments; s += 2) {
    ctx.beginPath();
    ctx.moveTo(points[s][0].x, points[s][0].y);
    ctx.lineTo(points[s][1].x, points[s][1].y);
    ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
  ctx.lineWidth = radius * 0.015;
  ctx.beginPath();
  ctx.moveTo(topAttach.x, topAttach.y);
  for (let s = 1; s <= segments; s++) {
    ctx.lineTo(points[s][0].x, points[s][0].y);
  }
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(botAttach.x, botAttach.y);
  for (let s = 1; s <= segments; s++) {
    ctx.lineTo(points[s][1].x, points[s][1].y);
  }
  ctx.stroke();

  ctx.restore();
}

function drawCrown(ctx: CanvasRenderingContext2D, nodes: BlobNode[], _cx: number, _cy: number, radius: number, _time: number, numNodes: number) {
  const nTop = getNodePos(nodes, Math.floor(numNodes * 0.75), numNodes);
  const nL = getNodePos(nodes, Math.floor(numNodes * 0.65), numNodes);
  const nR = getNodePos(nodes, Math.floor(numNodes * 0.85), numNodes);
  const baseY = Math.min(nTop.y, nL.y, nR.y);
  const crownH = radius * 0.3;
  const w = Math.abs(nR.x - nL.x) * 0.7;
  const mx = (nL.x + nR.x) / 2;
  ctx.save();
  const grad = ctx.createLinearGradient(mx, baseY - crownH, mx, baseY);
  grad.addColorStop(0, '#fbbf24');
  grad.addColorStop(1, '#d97706');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(mx - w / 2, baseY);
  ctx.lineTo(mx - w / 2, baseY - crownH * 0.6);
  ctx.lineTo(mx - w / 4, baseY - crownH * 0.3);
  ctx.lineTo(mx, baseY - crownH);
  ctx.lineTo(mx + w / 4, baseY - crownH * 0.3);
  ctx.lineTo(mx + w / 2, baseY - crownH * 0.6);
  ctx.lineTo(mx + w / 2, baseY);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(mx, baseY - crownH * 0.85, radius * 0.03, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#3b82f6';
  ctx.beginPath();
  ctx.arc(mx - w / 4, baseY - crownH * 0.45, radius * 0.025, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(mx + w / 4, baseY - crownH * 0.45, radius * 0.025, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawMonocle(ctx: CanvasRenderingContext2D, _nodes: BlobNode[], cx: number, cy: number, radius: number, _time: number, _numNodes: number) {
  const eyeX = cx + radius * 0.25;
  const eyeY = cy - radius * 0.1;
  const monoR = radius * 0.12;
  ctx.save();
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = radius * 0.025;
  ctx.beginPath();
  ctx.arc(eyeX, eyeY, monoR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = 'rgba(219, 234, 254, 0.2)';
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(eyeX + monoR * 0.7, eyeY + monoR * 0.7);
  ctx.quadraticCurveTo(eyeX + radius * 0.15, cy + radius * 0.3, cx + radius * 0.5, cy + radius * 0.35);
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = radius * 0.015;
  ctx.stroke();
  ctx.restore();
}

function drawHalo(ctx: CanvasRenderingContext2D, nodes: BlobNode[], _cx: number, _cy: number, radius: number, time: number, numNodes: number) {
  const top = getNodePos(nodes, Math.floor(numNodes * 0.75), numNodes);
  const haloY = top.y - radius * 0.35 + Math.sin(time * 2) * radius * 0.03;
  const haloX = top.x;
  ctx.save();
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = radius * 0.04;
  ctx.shadowBlur = 12;
  ctx.shadowColor = '#fbbf24';
  ctx.beginPath();
  ctx.ellipse(haloX, haloY, radius * 0.25, radius * 0.08, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.restore();
}

function drawDevilHorns(ctx: CanvasRenderingContext2D, nodes: BlobNode[], _cx: number, _cy: number, radius: number, _time: number, numNodes: number) {
  const nL = getNodePos(nodes, Math.floor(numNodes * 0.65), numNodes);
  const nR = getNodePos(nodes, Math.floor(numNodes * 0.85), numNodes);
  const hornH = radius * 0.35;
  ctx.save();
  ctx.fillStyle = '#991b1b';
  ctx.beginPath();
  ctx.moveTo(nL.x - radius * 0.05, nL.y);
  ctx.quadraticCurveTo(nL.x - radius * 0.15, nL.y - hornH * 0.6, nL.x - radius * 0.1, nL.y - hornH);
  ctx.quadraticCurveTo(nL.x, nL.y - hornH * 0.4, nL.x + radius * 0.05, nL.y);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(nR.x - radius * 0.05, nR.y);
  ctx.quadraticCurveTo(nR.x, nR.y - hornH * 0.4, nR.x + radius * 0.1, nR.y - hornH);
  ctx.quadraticCurveTo(nR.x + radius * 0.15, nR.y - hornH * 0.6, nR.x + radius * 0.05, nR.y);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawWizardHat(ctx: CanvasRenderingContext2D, nodes: BlobNode[], _cx: number, _cy: number, radius: number, _time: number, numNodes: number) {
  const nTop = getNodePos(nodes, Math.floor(numNodes * 0.75), numNodes);
  const nL = getNodePos(nodes, Math.floor(numNodes * 0.63), numNodes);
  const nR = getNodePos(nodes, Math.floor(numNodes * 0.87), numNodes);
  const baseY = Math.min(nTop.y, nL.y, nR.y) + radius * 0.05;
  const hatH = radius * 0.7;
  const brimW = Math.abs(nR.x - nL.x) * 0.7;
  const mx = (nL.x + nR.x) / 2;
  const tipX = mx + (nTop.x - mx) * 0.3;
  ctx.save();
  const grad = ctx.createLinearGradient(mx, baseY - hatH, mx, baseY);
  grad.addColorStop(0, '#1e3a5f');
  grad.addColorStop(1, '#312e81');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(mx - brimW / 2, baseY);
  ctx.lineTo(tipX + radius * 0.15, baseY - hatH);
  ctx.quadraticCurveTo(tipX + radius * 0.2, baseY - hatH - radius * 0.1, tipX + radius * 0.25, baseY - hatH + radius * 0.05);
  ctx.lineTo(mx + brimW / 2, baseY);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = radius * 0.025;
  ctx.beginPath();
  ctx.moveTo(mx - brimW / 2 - radius * 0.08, baseY);
  ctx.lineTo(mx + brimW / 2 + radius * 0.08, baseY);
  ctx.stroke();
  ctx.fillStyle = '#fbbf24';
  const starX = mx + radius * 0.05;
  const starY = baseY - hatH * 0.45;
  const starR = radius * 0.06;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const sa = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const sr = i % 2 === 0 ? starR : starR * 0.4;
    if (i === 0) ctx.moveTo(starX + Math.cos(sa) * sr, starY + Math.sin(sa) * sr);
    else ctx.lineTo(starX + Math.cos(sa) * sr, starY + Math.sin(sa) * sr);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawTopHat(ctx: CanvasRenderingContext2D, nodes: BlobNode[], _cx: number, _cy: number, radius: number, _time: number, numNodes: number) {
  const nTop = getNodePos(nodes, Math.floor(numNodes * 0.75), numNodes);
  const baseY = nTop.y + radius * 0.05;
  const hatH = radius * 0.45;
  const hatW = radius * 0.35;
  const brimW = radius * 0.55;
  const restX = getNodePos(nodes, Math.floor(numNodes * 0.75), numNodes).x;
  const tilt = (nTop.x - restX) * 0.01;
  ctx.save();
  ctx.translate(nTop.x, baseY);
  ctx.rotate(tilt);
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.ellipse(0, 0, brimW, radius * 0.06, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-hatW, -hatH, hatW * 2, hatH);
  ctx.beginPath();
  ctx.ellipse(0, -hatH, hatW, radius * 0.05, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#1e293b';
  ctx.fill();
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = radius * 0.025;
  ctx.beginPath();
  ctx.moveTo(-hatW, -radius * 0.05);
  ctx.lineTo(hatW, -radius * 0.05);
  ctx.stroke();
  ctx.restore();
}

export function drawBlobItem(
  ctx: CanvasRenderingContext2D,
  itemId: string,
  nodes: BlobNode[],
  cx: number,
  cy: number,
  radius: number,
  time: number,
  numNodes: number,
  dx: number,
  dy: number
) {
  if (!itemId) return;
  switch (itemId) {
    case 'red_bow_tie': drawRedBowTie(ctx, nodes, cx, cy, radius, time, numNodes); break;
    case 'flower': drawFlower(ctx, nodes, cx, cy, radius, time, numNodes); break;
    case 'party_hat': drawPartyHat(ctx, nodes, cx, cy, radius, time, numNodes); break;
    case 'scarf': drawScarf(ctx, nodes, cx, cy, radius, time, numNodes); break;
    case 'headphones': drawHeadphones(ctx, nodes, cx, cy, radius, time, numNodes); break;
    case 'pirate_patch': drawPiratePatch(ctx, nodes, cx + dx, cy + dy, radius, time, numNodes); break;
    case 'sunglasses': drawSunglasses(ctx, nodes, cx, cy, radius, dx, dy); break;
    case 'ninja_bandana': drawNinjaBandana(ctx, nodes, cx, cy, radius, time, numNodes); break;
    case 'cape': drawCape(ctx, nodes, cx, cy, radius, time, numNodes); break;
    case 'crown': drawCrown(ctx, nodes, cx, cy, radius, time, numNodes); break;
    case 'monocle': drawMonocle(ctx, nodes, cx + dx, cy + dy, radius, time, numNodes); break;
    case 'halo': drawHalo(ctx, nodes, cx, cy, radius, time, numNodes); break;
    case 'devil_horns': drawDevilHorns(ctx, nodes, cx, cy, radius, time, numNodes); break;
    case 'wizard_hat': drawWizardHat(ctx, nodes, cx, cy, radius, time, numNodes); break;
    case 'top_hat': drawTopHat(ctx, nodes, cx, cy, radius, time, numNodes); break;
  }
}

// ─── BLOB FACE COSMETIC DRAW FUNCTIONS ──────────────────────────────────────

function drawThickBrows(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, dx: number, dy: number) {
  const eyeY = cy - radius * 0.1 + dy;
  const browY = eyeY - radius * 0.1;
  const browW = radius * 0.12;
  ctx.save();
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = radius * 0.04;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - radius * 0.35 + dx, browY + radius * 0.02);
  ctx.quadraticCurveTo(cx - radius * 0.25 + dx, browY - radius * 0.04, cx - radius * 0.15 + dx, browY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + radius * 0.15 + dx, browY);
  ctx.quadraticCurveTo(cx + radius * 0.25 + dx, browY - radius * 0.04, cx + radius * 0.35 + dx, browY + radius * 0.02);
  ctx.stroke();
  ctx.restore();
}

function drawBlush(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, dx: number, dy: number) {
  const eyeY = cy - radius * 0.1 + dy;
  const blushY = eyeY + radius * 0.12;
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = '#fb7185';
  ctx.beginPath();
  ctx.ellipse(cx - radius * 0.3 + dx, blushY, radius * 0.1, radius * 0.06, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + radius * 0.3 + dx, blushY, radius * 0.1, radius * 0.06, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawFreckles(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, dx: number, dy: number) {
  const baseY = cy + radius * 0.02 + dy;
  ctx.save();
  ctx.fillStyle = '#92400e';
  ctx.globalAlpha = 0.5;
  const spots = [
    [-0.18, -0.02], [-0.22, 0.04], [-0.14, 0.05],
    [0.18, -0.02], [0.22, 0.04], [0.14, 0.05],
  ];
  for (const [ox, oy] of spots) {
    ctx.beginPath();
    ctx.arc(cx + ox * radius + dx, baseY + oy * radius, radius * 0.018, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawBeautyMark(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, dx: number, dy: number) {
  const mouthY = cy + radius * 0.15 + dy;
  ctx.save();
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(cx + radius * 0.18 + dx, mouthY - radius * 0.05, radius * 0.025, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawHandlebar(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, dx: number, dy: number) {
  const mouthY = cy + radius * 0.12 + dy;
  ctx.save();
  ctx.strokeStyle = '#422006';
  ctx.lineWidth = radius * 0.03;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - radius * 0.22 + dx, mouthY + radius * 0.02);
  ctx.quadraticCurveTo(cx - radius * 0.28 + dx, mouthY - radius * 0.08, cx - radius * 0.3 + dx, mouthY - radius * 0.06);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - radius * 0.02 + dx, mouthY);
  ctx.quadraticCurveTo(cx - radius * 0.12 + dx, mouthY + radius * 0.03, cx - radius * 0.22 + dx, mouthY + radius * 0.02);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + radius * 0.02 + dx, mouthY);
  ctx.quadraticCurveTo(cx + radius * 0.12 + dx, mouthY + radius * 0.03, cx + radius * 0.22 + dx, mouthY + radius * 0.02);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + radius * 0.22 + dx, mouthY + radius * 0.02);
  ctx.quadraticCurveTo(cx + radius * 0.28 + dx, mouthY - radius * 0.08, cx + radius * 0.3 + dx, mouthY - radius * 0.06);
  ctx.stroke();
  ctx.restore();
}

function drawRedLips(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, dx: number, dy: number) {
  const mouthY = cy + radius * 0.15 + dy;
  const mouthX = cx + dx;
  ctx.save();
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.moveTo(mouthX - radius * 0.14, mouthY);
  ctx.quadraticCurveTo(mouthX - radius * 0.07, mouthY - radius * 0.08, mouthX, mouthY - radius * 0.03);
  ctx.quadraticCurveTo(mouthX + radius * 0.07, mouthY - radius * 0.08, mouthX + radius * 0.14, mouthY);
  ctx.quadraticCurveTo(mouthX + radius * 0.07, mouthY + radius * 0.08, mouthX, mouthY + radius * 0.04);
  ctx.quadraticCurveTo(mouthX - radius * 0.07, mouthY + radius * 0.08, mouthX - radius * 0.14, mouthY);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawLongLashes(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, dx: number, dy: number) {
  const eyeY = cy - radius * 0.1 + dy;
  const eyeSize = radius * 0.08;
  ctx.save();
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = radius * 0.02;
  ctx.lineCap = 'round';
  for (const side of [-1, 1]) {
    const ex = cx + side * radius * 0.25 + dx;
    for (let i = 0; i < 3; i++) {
      const a = -Math.PI * 0.7 + (i / 2) * Math.PI * 0.4;
      ctx.beginPath();
      ctx.moveTo(ex + Math.cos(a) * eyeSize, eyeY + Math.sin(a) * eyeSize);
      ctx.lineTo(ex + Math.cos(a) * eyeSize * 2, eyeY + Math.sin(a) * eyeSize * 2);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawCatWhiskers(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, dx: number, dy: number) {
  const baseY = cy + radius * 0.05 + dy;
  ctx.save();
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = radius * 0.015;
  ctx.lineCap = 'round';
  for (const side of [-1, 1]) {
    for (let i = 0; i < 3; i++) {
      const yOff = (i - 1) * radius * 0.06;
      const startX = cx + side * radius * 0.12 + dx;
      const endX = cx + side * radius * 0.45 + dx;
      ctx.beginPath();
      ctx.moveTo(startX, baseY + yOff);
      ctx.lineTo(endX, baseY + yOff + (i - 1) * radius * 0.04);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawAnimeEyes(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, dx: number, dy: number) {
  const eyeY = cy - radius * 0.1 + dy;
  const eyeW = radius * 0.13;
  const eyeH = radius * 0.16;
  for (const side of [-1, 1]) {
    const ex = cx + side * radius * 0.22 + dx;
    ctx.save();
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.ellipse(ex, eyeY, eyeW, eyeH, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#6366f1';
    ctx.beginPath();
    ctx.ellipse(ex, eyeY + eyeH * 0.1, eyeW * 0.7, eyeH * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.arc(ex, eyeY + eyeH * 0.15, eyeW * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(ex + eyeW * 0.25, eyeY - eyeH * 0.15, eyeW * 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ex - eyeW * 0.15, eyeY + eyeH * 0.2, eyeW * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = radius * 0.025;
    ctx.beginPath();
    ctx.moveTo(ex - eyeW * 1.1, eyeY - eyeH * 0.6);
    ctx.quadraticCurveTo(ex, eyeY - eyeH * 1.1, ex + eyeW * 1.1, eyeY - eyeH * 0.5);
    ctx.stroke();
    ctx.restore();
  }
}

function drawStarEyes(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, dx: number, dy: number) {
  const eyeY = cy - radius * 0.1 + dy;
  const starR = radius * 0.09;
  ctx.save();
  ctx.fillStyle = '#facc15';
  for (const side of [-1, 1]) {
    const ex = cx + side * radius * 0.25 + dx;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
      const r = i % 2 === 0 ? starR : starR * 0.4;
      if (i === 0) ctx.moveTo(ex + Math.cos(a) * r, eyeY + Math.sin(a) * r);
      else ctx.lineTo(ex + Math.cos(a) * r, eyeY + Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function drawHeartEyes(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, dx: number, dy: number) {
  const eyeY = cy - radius * 0.08 + dy;
  const s = radius * 0.06;
  ctx.save();
  ctx.fillStyle = '#ef4444';
  for (const side of [-1, 1]) {
    const ex = cx + side * radius * 0.25 + dx;
    ctx.beginPath();
    ctx.moveTo(ex, eyeY + s * 1.2);
    ctx.bezierCurveTo(ex - s * 1.5, eyeY - s * 0.5, ex - s * 1.5, eyeY - s * 1.8, ex, eyeY - s * 0.6);
    ctx.bezierCurveTo(ex + s * 1.5, eyeY - s * 1.8, ex + s * 1.5, eyeY - s * 0.5, ex, eyeY + s * 1.2);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function drawGoatee(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, dx: number, dy: number) {
  const mouthY = cy + radius * 0.15 + dy;
  const mouthX = cx + dx;
  ctx.save();
  ctx.fillStyle = '#422006';
  ctx.beginPath();
  ctx.moveTo(mouthX - radius * 0.08, mouthY + radius * 0.06);
  ctx.quadraticCurveTo(mouthX, mouthY + radius * 0.2, mouthX + radius * 0.08, mouthY + radius * 0.06);
  ctx.quadraticCurveTo(mouthX, mouthY + radius * 0.12, mouthX - radius * 0.08, mouthY + radius * 0.06);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawFullBeard(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, dx: number, dy: number) {
  const baseY = cy + radius * 0.05 + dy;
  const beardX = cx + dx;
  ctx.save();
  ctx.fillStyle = '#78350f';
  ctx.beginPath();
  ctx.moveTo(beardX - radius * 0.35, baseY);
  ctx.quadraticCurveTo(beardX - radius * 0.4, baseY + radius * 0.2, beardX - radius * 0.2, baseY + radius * 0.35);
  ctx.quadraticCurveTo(beardX, baseY + radius * 0.5, beardX + radius * 0.2, baseY + radius * 0.35);
  ctx.quadraticCurveTo(beardX + radius * 0.4, baseY + radius * 0.2, beardX + radius * 0.35, baseY);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = '#451a03';
  ctx.beginPath();
  ctx.moveTo(beardX - radius * 0.2, baseY + radius * 0.1);
  ctx.quadraticCurveTo(beardX, baseY + radius * 0.45, beardX + radius * 0.2, baseY + radius * 0.1);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawCyclopsEye(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, dx: number, dy: number) {
  const eyeY = cy - radius * 0.08 + dy;
  const eyeX = cx + dx;
  const eyeR = radius * 0.16;
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(eyeX, eyeY, eyeR, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#16a34a';
  ctx.beginPath();
  ctx.arc(eyeX, eyeY, eyeR * 0.65, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(eyeX, eyeY, eyeR * 0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(eyeX + eyeR * 0.2, eyeY - eyeR * 0.2, eyeR * 0.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = radius * 0.02;
  ctx.beginPath();
  ctx.arc(eyeX, eyeY, eyeR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawWinkSparkle(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, dx: number, dy: number, time: number) {
  const eyeY = cy - radius * 0.1 + dy;
  const eyeSize = radius * 0.08;

  ctx.save();
  ctx.fillStyle = '#1a237e';
  ctx.beginPath();
  ctx.arc(cx + radius * 0.25 + dx, eyeY, eyeSize * 1.1, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx + radius * 0.27 + dx, eyeY - eyeSize * 0.3, eyeSize * 0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#1a237e';
  ctx.lineWidth = Math.max(1.5, radius * 0.03);
  ctx.lineCap = 'round';
  ctx.beginPath();
  const winkX = cx - radius * 0.25 + dx;
  ctx.moveTo(winkX - eyeSize, eyeY);
  ctx.quadraticCurveTo(winkX, eyeY + eyeSize * 0.4, winkX + eyeSize, eyeY);
  ctx.stroke();

  const sparkleSize = eyeSize * 0.5 * (0.8 + Math.sin(time * 6) * 0.3);
  const sx = cx + radius * 0.38 + dx;
  const sy = eyeY - eyeSize * 0.8;
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = radius * 0.02;
  ctx.beginPath();
  ctx.moveTo(sx, sy - sparkleSize); ctx.lineTo(sx, sy + sparkleSize);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(sx - sparkleSize, sy); ctx.lineTo(sx + sparkleSize, sy);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(sx - sparkleSize * 0.6, sy - sparkleSize * 0.6);
  ctx.lineTo(sx + sparkleSize * 0.6, sy + sparkleSize * 0.6);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(sx + sparkleSize * 0.6, sy - sparkleSize * 0.6);
  ctx.lineTo(sx - sparkleSize * 0.6, sy + sparkleSize * 0.6);
  ctx.stroke();

  const mouthY = cy + radius * 0.15 + dy;
  const mouthX = cx + dx;
  ctx.fillStyle = '#ec4899';
  ctx.beginPath();
  ctx.arc(mouthX + radius * 0.06, mouthY + radius * 0.02, radius * 0.04, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export type FaceDrawOverride = 'anime_eyes' | 'star_eyes' | 'heart_eyes' | 'cyclops' | 'wink_sparkle';
const FACE_OVERRIDES_SET = new Set<string>(['anime_eyes', 'star_eyes', 'heart_eyes', 'cyclops', 'wink_sparkle']);

export function faceOverridesDefaultEyes(faceId: string): boolean {
  return FACE_OVERRIDES_SET.has(faceId);
}

export function faceOverridesDefaultMouth(faceId: string): boolean {
  return faceId === 'red_lips' || faceId === 'wink_sparkle';
}

export function drawBlobFace(
  ctx: CanvasRenderingContext2D,
  faceId: string,
  cx: number,
  cy: number,
  radius: number,
  dx: number,
  dy: number,
  time: number
) {
  if (!faceId) return;
  switch (faceId) {
    case 'thick_brows': drawThickBrows(ctx, cx, cy, radius, dx, dy); break;
    case 'blush': drawBlush(ctx, cx, cy, radius, dx, dy); break;
    case 'freckles': drawFreckles(ctx, cx, cy, radius, dx, dy); break;
    case 'beauty_mark': drawBeautyMark(ctx, cx, cy, radius, dx, dy); break;
    case 'handlebar': drawHandlebar(ctx, cx, cy, radius, dx, dy); break;
    case 'red_lips': drawRedLips(ctx, cx, cy, radius, dx, dy); break;
    case 'long_lashes': drawLongLashes(ctx, cx, cy, radius, dx, dy); break;
    case 'cat_whiskers': drawCatWhiskers(ctx, cx, cy, radius, dx, dy); break;
    case 'anime_eyes': drawAnimeEyes(ctx, cx, cy, radius, dx, dy); break;
    case 'star_eyes': drawStarEyes(ctx, cx, cy, radius, dx, dy); break;
    case 'heart_eyes': drawHeartEyes(ctx, cx, cy, radius, dx, dy); break;
    case 'goatee': drawGoatee(ctx, cx, cy, radius, dx, dy); break;
    case 'full_beard': drawFullBeard(ctx, cx, cy, radius, dx, dy); break;
    case 'cyclops': drawCyclopsEye(ctx, cx, cy, radius, dx, dy); break;
    case 'wink_sparkle': drawWinkSparkle(ctx, cx, cy, radius, dx, dy, time); break;
  }
}
