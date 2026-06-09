import { type ItemDef } from './itemCatalog';
import { itemHighlight, darken } from './drawUtils';

function rRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ═══════════════════════════════════════════════════════════════════
// SEWING KIT — sizeTier 2
// ═══════════════════════════════════════════════════════════════════

export const thread_spool: ItemDef = { id: 'thread_spool', name: 'Thread Spool', world: 'sewing_kit', sizeTier: 2, baseValue: 4, weight: 1.4,
  draw(ctx, s, c) {
    ctx.fillStyle = c[1]; rRect(ctx, -s*0.18, -s*0.32, s*0.36, s*0.64, s*0.04); ctx.fill();
    ctx.fillStyle = c[0]; rRect(ctx, -s*0.22, -s*0.32, s*0.44, s*0.08, s*0.03); ctx.fill();
    rRect(ctx, -s*0.22, s*0.24, s*0.44, s*0.08, s*0.03); ctx.fill();
    ctx.strokeStyle = darken(c[0], 0.2); ctx.lineWidth = s*0.02;
    for (let i = 0; i < 6; i++) { const y = -s*0.22 + i*s*0.08; ctx.beginPath(); ctx.moveTo(-s*0.18, y); ctx.lineTo(s*0.18, y+s*0.04); ctx.stroke(); }
    itemHighlight(ctx, -s*0.08, -s*0.18, s*0.06, s*0.04);
  },
};

export const button_pack: ItemDef = { id: 'button_pack', name: 'Button Pack', world: 'sewing_kit', sizeTier: 2, baseValue: 3, weight: 1.2,
  draw(ctx, s, c) {
    ctx.fillStyle = c[2]; ctx.beginPath(); ctx.arc(0, 0, s*0.4, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = darken(c[2], 0.3); ctx.lineWidth = s*0.03; ctx.stroke();
    ctx.fillStyle = darken(c[2], 0.4);
    for (let i = 0; i < 4; i++) { const a = i*Math.PI/2 + Math.PI/4; ctx.beginPath(); ctx.arc(Math.cos(a)*s*0.12, Math.sin(a)*s*0.12, s*0.05, 0, Math.PI*2); ctx.fill(); }
    itemHighlight(ctx, -s*0.15, -s*0.18, s*0.1, s*0.06);
  },
};

export const sewing_needle: ItemDef = { id: 'sewing_needle', name: 'Needle', world: 'sewing_kit', sizeTier: 2, baseValue: 4, weight: 0.8,
  draw(ctx, s, c) {
    ctx.strokeStyle = c[2] || '#cbd5e1'; ctx.lineWidth = s*0.05; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-s*0.4, s*0.35); ctx.lineTo(s*0.35, -s*0.3); ctx.stroke();
    ctx.fillStyle = c[0]; ctx.beginPath(); ctx.ellipse(-s*0.32, s*0.28, s*0.08, s*0.06, -0.7, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = c[1]; ctx.lineWidth = s*0.02;
    ctx.beginPath(); ctx.moveTo(-s*0.32, s*0.28); ctx.bezierCurveTo(-s*0.5, s*0.4, -s*0.45, s*0.5, -s*0.3, s*0.45); ctx.stroke();
  },
};

export const thimble: ItemDef = { id: 'thimble', name: 'Thimble', world: 'sewing_kit', sizeTier: 2, baseValue: 4, weight: 1.5,
  draw(ctx, s, c) {
    ctx.fillStyle = c[2] || '#a1a1aa';
    ctx.beginPath(); ctx.moveTo(-s*0.2, s*0.3); ctx.lineTo(-s*0.18, -s*0.2); ctx.quadraticCurveTo(0, -s*0.4, s*0.18, -s*0.2); ctx.lineTo(s*0.2, s*0.3); ctx.closePath(); ctx.fill();
    ctx.fillStyle = darken(c[2] || '#a1a1aa', 0.3);
    for (let r = 0; r < 4; r++) { for (let k = -1; k <= 1; k++) { ctx.beginPath(); ctx.arc(k*s*0.08 + (r%2)*s*0.04, -s*0.15 + r*s*0.08, s*0.018, 0, Math.PI*2); ctx.fill(); } }
    ctx.strokeStyle = darken(c[2] || '#a1a1aa', 0.4); ctx.lineWidth = s*0.02;
    ctx.beginPath(); ctx.moveTo(-s*0.2, s*0.3); ctx.lineTo(s*0.2, s*0.3); ctx.stroke();
    itemHighlight(ctx, -s*0.08, -s*0.15, s*0.05, s*0.1);
  },
};

export const yarn_ball: ItemDef = { id: 'yarn_ball', name: 'Yarn Ball', world: 'sewing_kit', sizeTier: 2, baseValue: 5, weight: 1.8,
  draw(ctx, s, c) {
    ctx.fillStyle = c[1]; ctx.beginPath(); ctx.arc(0, 0, s*0.4, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = darken(c[1], 0.2); ctx.lineWidth = s*0.025;
    for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.ellipse(0, 0, s*0.4, s*0.15, i*Math.PI/6, 0, Math.PI*2); ctx.stroke(); }
    ctx.strokeStyle = c[1]; ctx.lineWidth = s*0.04; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(s*0.35, s*0.1); ctx.bezierCurveTo(s*0.55, s*0.25, s*0.5, s*0.4, s*0.45, s*0.45); ctx.stroke();
    itemHighlight(ctx, -s*0.15, -s*0.18, s*0.1, s*0.07);
  },
};

export const pin_cushion: ItemDef = { id: 'pin_cushion', name: 'Pin Cushion', world: 'sewing_kit', sizeTier: 2, baseValue: 5, weight: 1.7,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0]; ctx.beginPath(); ctx.arc(0, 0, s*0.38, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = darken(c[0], 0.25); ctx.lineWidth = s*0.02;
    for (let i = 0; i < 8; i++) { const a = (i/8)*Math.PI*2; ctx.beginPath(); ctx.moveTo(Math.cos(a)*s*0.1, Math.sin(a)*s*0.1); ctx.lineTo(Math.cos(a)*s*0.36, Math.sin(a)*s*0.36); ctx.stroke(); }
    const pinPositions: [number, number, string][] = [[-0.2, -0.2, c[1]], [0.18, -0.15, c[2]], [0.05, 0.22, c[1]], [-0.15, 0.18, c[2]]];
    for (const [px, py, col] of pinPositions) { ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = s*0.03; ctx.beginPath(); ctx.moveTo(px*s, py*s); ctx.lineTo(px*s*1.6, py*s*1.6); ctx.stroke(); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(px*s*1.6, py*s*1.6, s*0.05, 0, Math.PI*2); ctx.fill(); }
    itemHighlight(ctx, -s*0.12, -s*0.15, s*0.08, s*0.05);
  },
};

export const ribbon: ItemDef = { id: 'ribbon', name: 'Ribbon', world: 'sewing_kit', sizeTier: 2, baseValue: 3, weight: 0.9,
  draw(ctx, s, c) {
    ctx.fillStyle = c[1];
    ctx.beginPath(); ctx.moveTo(-s*0.4, -s*0.2); ctx.quadraticCurveTo(-s*0.1, -s*0.05, 0, 0); ctx.quadraticCurveTo(-s*0.1, s*0.05, -s*0.4, s*0.2); ctx.lineTo(-s*0.3, 0); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(s*0.4, -s*0.2); ctx.quadraticCurveTo(s*0.1, -s*0.05, 0, 0); ctx.quadraticCurveTo(s*0.1, s*0.05, s*0.4, s*0.2); ctx.lineTo(s*0.3, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = darken(c[1], 0.3); rRect(ctx, -s*0.07, -s*0.1, s*0.14, s*0.2, s*0.02); ctx.fill();
    itemHighlight(ctx, -s*0.18, -s*0.1, s*0.08, s*0.04);
  },
};

export const sewing_scissors: ItemDef = { id: 'sewing_scissors', name: 'Sewing Scissors', world: 'sewing_kit', sizeTier: 2, baseValue: 5, weight: 1.6,
  draw(ctx, s, c) {
    ctx.strokeStyle = c[2] || '#9ca3af'; ctx.lineWidth = s*0.05; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-s*0.3, -s*0.3); ctx.lineTo(s*0.3, s*0.3); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s*0.3, -s*0.3); ctx.lineTo(-s*0.3, s*0.3); ctx.stroke();
    ctx.fillStyle = c[0]; ctx.beginPath(); ctx.arc(-s*0.32, s*0.32, s*0.1, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.32, s*0.32, s*0.1, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[2] || '#9ca3af'; ctx.beginPath(); ctx.arc(0, 0, s*0.04, 0, Math.PI*2); ctx.fill();
  },
};

export const fabric_scrap: ItemDef = { id: 'fabric_scrap', name: 'Fabric Scrap', world: 'sewing_kit', sizeTier: 2, baseValue: 3, weight: 0.7,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.moveTo(-s*0.35, -s*0.25); ctx.lineTo(s*0.3, -s*0.3); ctx.lineTo(s*0.38, s*0.2); ctx.lineTo(-s*0.25, s*0.32); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = darken(c[0], 0.3); ctx.lineWidth = s*0.015;
    for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(i*s*0.08, -s*0.3); ctx.lineTo(i*s*0.08, s*0.3); ctx.stroke(); }
    for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(-s*0.35, i*s*0.08); ctx.lineTo(s*0.35, i*s*0.08); ctx.stroke(); }
  },
};

export const zipper: ItemDef = { id: 'zipper', name: 'Zipper', world: 'sewing_kit', sizeTier: 2, baseValue: 4, weight: 1.1,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0]; rRect(ctx, -s*0.4, -s*0.1, s*0.8, s*0.2, s*0.03); ctx.fill();
    ctx.fillStyle = darken(c[0], 0.3);
    for (let i = -3; i <= 3; i++) { rRect(ctx, i*s*0.1 - s*0.04, -s*0.08, s*0.08, s*0.06, s*0.01); ctx.fill(); rRect(ctx, i*s*0.1 - s*0.04, s*0.02, s*0.08, s*0.06, s*0.01); ctx.fill(); }
    ctx.fillStyle = c[2] || '#a1a1aa'; rRect(ctx, s*0.05, -s*0.14, s*0.12, s*0.28, s*0.04); ctx.fill();
    ctx.strokeStyle = darken(c[2] || '#a1a1aa', 0.4); ctx.lineWidth = s*0.015; ctx.stroke();
  },
};

// ═══════════════════════════════════════════════════════════════════
// ART SUPPLIES — sizeTier 2
// ═══════════════════════════════════════════════════════════════════

export const paint_tube: ItemDef = { id: 'paint_tube', name: 'Paint Tube', world: 'art_supplies', sizeTier: 2, baseValue: 4, weight: 1.3,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0]; rRect(ctx, -s*0.12, -s*0.35, s*0.24, s*0.55, s*0.05); ctx.fill();
    ctx.fillStyle = c[2] || '#a3a3a3'; rRect(ctx, -s*0.14, s*0.16, s*0.28, s*0.1, s*0.02); ctx.fill();
    ctx.fillStyle = darken(c[2] || '#a3a3a3', 0.3); rRect(ctx, -s*0.06, s*0.22, s*0.12, s*0.14, s*0.02); ctx.fill();
    ctx.fillStyle = c[1]; ctx.beginPath(); ctx.arc(0, s*0.4, s*0.06, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = darken(c[0], 0.3); ctx.lineWidth = s*0.015;
    for (let i = 0; i < 3; i++) { const y = -s*0.2 + i*s*0.1; ctx.beginPath(); ctx.moveTo(-s*0.1, y); ctx.lineTo(s*0.1, y); ctx.stroke(); }
    itemHighlight(ctx, -s*0.05, -s*0.18, s*0.04, s*0.1);
  },
};

export const paint_brush: ItemDef = { id: 'paint_brush', name: 'Paint Brush', world: 'art_supplies', sizeTier: 2, baseValue: 4, weight: 1.0,
  draw(ctx, s, c) {
    ctx.fillStyle = '#92400e'; rRect(ctx, -s*0.04, -s*0.15, s*0.08, s*0.5, s*0.02); ctx.fill();
    ctx.fillStyle = c[2] || '#a3a3a3'; rRect(ctx, -s*0.06, -s*0.25, s*0.12, s*0.14, s*0.02); ctx.fill();
    ctx.fillStyle = c[1];
    ctx.beginPath(); ctx.moveTo(-s*0.08, -s*0.25); ctx.lineTo(s*0.08, -s*0.25); ctx.lineTo(s*0.05, -s*0.42); ctx.lineTo(-s*0.05, -s*0.42); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = darken(c[1], 0.3); ctx.lineWidth = s*0.012;
    for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i*s*0.025, -s*0.25); ctx.lineTo(i*s*0.025, -s*0.42); ctx.stroke(); }
  },
};

export const palette: ItemDef = { id: 'palette', name: 'Palette', world: 'art_supplies', sizeTier: 2, baseValue: 5, weight: 1.5,
  draw(ctx, s, c) {
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath(); ctx.ellipse(0, 0, s*0.42, s*0.32, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fef3c7'; ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath(); ctx.arc(s*0.2, -s*0.05, s*0.08, 0, Math.PI*2); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = darken('#fef3c7', 0.3); ctx.lineWidth = s*0.015;
    ctx.beginPath(); ctx.ellipse(0, 0, s*0.42, s*0.32, 0, 0, Math.PI*2); ctx.stroke();
    const blobs: [number, number, string][] = [[-0.22, -0.1, c[0]], [-0.1, 0.12, c[1]], [0.1, -0.12, c[2]], [0.0, 0.08, '#ef4444'], [-0.18, 0.08, '#3b82f6']];
    for (const [bx, by, col] of blobs) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(bx*s, by*s, s*0.05, 0, Math.PI*2); ctx.fill(); }
  },
};

export const marker: ItemDef = { id: 'marker', name: 'Marker', world: 'art_supplies', sizeTier: 2, baseValue: 3, weight: 1.0,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0]; rRect(ctx, -s*0.08, -s*0.4, s*0.16, s*0.55, s*0.03); ctx.fill();
    ctx.fillStyle = darken(c[0], 0.3); rRect(ctx, -s*0.09, -s*0.42, s*0.18, s*0.06, s*0.02); ctx.fill();
    ctx.fillStyle = '#1e293b';
    ctx.beginPath(); ctx.moveTo(-s*0.06, s*0.15); ctx.lineTo(s*0.06, s*0.15); ctx.lineTo(s*0.03, s*0.35); ctx.lineTo(-s*0.03, s*0.35); ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[1]; rRect(ctx, -s*0.04, s*0.32, s*0.08, s*0.05, s*0.01); ctx.fill();
    itemHighlight(ctx, -s*0.04, -s*0.25, s*0.03, s*0.12);
  },
};

export const glue_stick: ItemDef = { id: 'glue_stick', name: 'Glue Stick', world: 'art_supplies', sizeTier: 2, baseValue: 3, weight: 1.1,
  draw(ctx, s, c) {
    ctx.fillStyle = c[1]; rRect(ctx, -s*0.1, -s*0.35, s*0.2, s*0.6, s*0.04); ctx.fill();
    ctx.fillStyle = c[2] || '#fbbf24'; rRect(ctx, -s*0.11, -s*0.38, s*0.22, s*0.08, s*0.02); ctx.fill();
    ctx.fillStyle = '#fef9c3'; rRect(ctx, -s*0.07, -s*0.42, s*0.14, s*0.06, s*0.02); ctx.fill();
    ctx.fillStyle = '#1e293b'; ctx.font = `bold ${s*0.1}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('GLUE', 0, 0);
    itemHighlight(ctx, -s*0.06, -s*0.2, s*0.04, s*0.1);
  },
};

export const glitter_pot: ItemDef = { id: 'glitter_pot', name: 'Glitter Pot', world: 'art_supplies', sizeTier: 2, baseValue: 5, weight: 1.4,
  draw(ctx, s, c) {
    ctx.fillStyle = c[1]; rRect(ctx, -s*0.22, -s*0.15, s*0.44, s*0.45, s*0.04); ctx.fill();
    ctx.fillStyle = c[2] || '#fbbf24'; rRect(ctx, -s*0.24, -s*0.25, s*0.48, s*0.12, s*0.04); ctx.fill();
    ctx.strokeStyle = darken(c[2] || '#fbbf24', 0.3); ctx.lineWidth = s*0.02;
    rRect(ctx, -s*0.24, -s*0.25, s*0.48, s*0.12, s*0.04); ctx.stroke();
    for (let i = 0; i < 12; i++) { ctx.fillStyle = i%2 ? c[0] : c[2] || '#fbbf24'; ctx.beginPath(); ctx.arc((Math.random()-0.5)*s*0.4, (Math.random()-0.05)*s*0.3 - s*0.05, s*0.02, 0, Math.PI*2); ctx.fill(); }
    itemHighlight(ctx, -s*0.12, -s*0.05, s*0.06, s*0.04);
  },
};

export const watercolor_pan: ItemDef = { id: 'watercolor_pan', name: 'Watercolors', world: 'art_supplies', sizeTier: 2, baseValue: 5, weight: 1.7,
  draw(ctx, s, c) {
    ctx.fillStyle = '#1e293b'; rRect(ctx, -s*0.42, -s*0.22, s*0.84, s*0.44, s*0.03); ctx.fill();
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#1e293b'];
    for (let r = 0; r < 2; r++) { for (let i = 0; i < 4; i++) { ctx.fillStyle = colors[r*4 + i]; rRect(ctx, -s*0.38 + i*s*0.2, -s*0.18 + r*s*0.2, s*0.16, s*0.16, s*0.02); ctx.fill(); } }
    ctx.strokeStyle = darken('#1e293b', 0.3); ctx.lineWidth = s*0.02;
    rRect(ctx, -s*0.42, -s*0.22, s*0.84, s*0.44, s*0.03); ctx.stroke();
  },
};

export const charcoal_stick: ItemDef = { id: 'charcoal_stick', name: 'Charcoal', world: 'art_supplies', sizeTier: 2, baseValue: 3, weight: 1.0,
  draw(ctx, s, c) {
    ctx.fillStyle = '#1c1917'; rRect(ctx, -s*0.06, -s*0.4, s*0.12, s*0.8, s*0.02); ctx.fill();
    ctx.fillStyle = '#44403c';
    ctx.beginPath(); ctx.moveTo(-s*0.06, -s*0.4); ctx.lineTo(s*0.06, -s*0.4); ctx.lineTo(s*0.04, -s*0.35); ctx.lineTo(-s*0.04, -s*0.35); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#44403c'; ctx.lineWidth = s*0.012;
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(-s*0.06, -s*0.3 + i*s*0.15); ctx.lineTo(s*0.06, -s*0.28 + i*s*0.15); ctx.stroke(); }
  },
};

export const eraser_putty: ItemDef = { id: 'eraser_putty', name: 'Kneaded Eraser', world: 'art_supplies', sizeTier: 2, baseValue: 3, weight: 0.8,
  draw(ctx, s, c) {
    ctx.fillStyle = c[2] || '#a8a29e';
    ctx.beginPath(); ctx.moveTo(-s*0.3, -s*0.18); ctx.bezierCurveTo(-s*0.4, -s*0.05, -s*0.35, s*0.15, -s*0.2, s*0.25); ctx.bezierCurveTo(0, s*0.32, s*0.25, s*0.2, s*0.32, s*0.05); ctx.bezierCurveTo(s*0.4, -s*0.15, s*0.2, -s*0.3, 0, -s*0.25); ctx.bezierCurveTo(-s*0.15, -s*0.22, -s*0.2, -s*0.25, -s*0.3, -s*0.18); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = darken(c[2] || '#a8a29e', 0.2); ctx.lineWidth = s*0.015;
    ctx.beginPath(); ctx.arc(-s*0.1, 0, s*0.05, 0, Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.arc(s*0.1, -s*0.05, s*0.04, 0, Math.PI*2); ctx.stroke();
    itemHighlight(ctx, -s*0.18, -s*0.12, s*0.08, s*0.04);
  },
};

export const sketchbook: ItemDef = { id: 'sketchbook', name: 'Sketchbook', world: 'art_supplies', sizeTier: 2, baseValue: 6, weight: 2.0,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0]; rRect(ctx, -s*0.3, -s*0.4, s*0.6, s*0.8, s*0.02); ctx.fill();
    ctx.fillStyle = '#fef9c3'; rRect(ctx, -s*0.27, -s*0.37, s*0.54, s*0.74, s*0.01); ctx.fill();
    ctx.fillStyle = darken(c[0], 0.4);
    for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.arc(-s*0.3, i*s*0.1, s*0.02, 0, Math.PI*2); ctx.fill(); }
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = s*0.01;
    ctx.beginPath(); ctx.moveTo(-s*0.2, -s*0.2); ctx.lineTo(s*0.15, -s*0.05); ctx.lineTo(-s*0.05, s*0.18); ctx.stroke();
    itemHighlight(ctx, -s*0.2, -s*0.32, s*0.08, s*0.05);
  },
};

// ═══════════════════════════════════════════════════════════════════
// SNACK DRAWER — sizeTier 3
// ═══════════════════════════════════════════════════════════════════

export const granola_bar: ItemDef = { id: 'granola_bar', name: 'Granola Bar', world: 'snack_drawer', sizeTier: 3, baseValue: 5, weight: 1.5,
  draw(ctx, s, c) {
    ctx.fillStyle = c[2] || '#a16207'; rRect(ctx, -s*0.4, -s*0.15, s*0.8, s*0.3, s*0.04); ctx.fill();
    ctx.fillStyle = darken(c[2] || '#a16207', 0.3);
    for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.arc((Math.random()-0.5)*s*0.7, (Math.random()-0.5)*s*0.2, s*0.025, 0, Math.PI*2); ctx.fill(); }
    ctx.fillStyle = c[0]; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc((Math.random()-0.5)*s*0.7, (Math.random()-0.5)*s*0.2, s*0.018, 0, Math.PI*2); ctx.fill(); }
    ctx.strokeStyle = darken(c[2] || '#a16207', 0.4); ctx.lineWidth = s*0.015;
    rRect(ctx, -s*0.4, -s*0.15, s*0.8, s*0.3, s*0.04); ctx.stroke();
    itemHighlight(ctx, -s*0.18, -s*0.08, s*0.1, s*0.04);
  },
};

export const fruit_snack: ItemDef = { id: 'fruit_snack', name: 'Fruit Snack', world: 'snack_drawer', sizeTier: 3, baseValue: 6, weight: 1.3,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0]; rRect(ctx, -s*0.32, -s*0.4, s*0.64, s*0.7, s*0.05); ctx.fill();
    ctx.fillStyle = '#fef9c3'; rRect(ctx, -s*0.25, -s*0.3, s*0.5, s*0.45, s*0.03); ctx.fill();
    ctx.fillStyle = c[1];
    for (let r = 0; r < 3; r++) { for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.arc(i*s*0.12, -s*0.18 + r*s*0.15, s*0.04, 0, Math.PI*2); ctx.fill(); } }
    ctx.fillStyle = darken(c[0], 0.3);
    for (let i = 0; i < 12; i++) { rRect(ctx, -s*0.3 + i*s*0.05, s*0.18, s*0.03, s*0.1, s*0.005); ctx.fill(); }
    itemHighlight(ctx, -s*0.18, -s*0.3, s*0.08, s*0.05);
  },
};

export const mini_chocolate: ItemDef = { id: 'mini_chocolate', name: 'Mini Chocolate', world: 'snack_drawer', sizeTier: 3, baseValue: 7, weight: 1.4,
  draw(ctx, s, c) {
    ctx.fillStyle = c[2] || '#7c2d12'; rRect(ctx, -s*0.32, -s*0.18, s*0.64, s*0.36, s*0.04); ctx.fill();
    ctx.fillStyle = c[1] || '#fbbf24'; rRect(ctx, -s*0.3, -s*0.16, s*0.18, s*0.32, s*0.02); ctx.fill();
    ctx.fillStyle = '#7c2d12'; ctx.font = `bold ${s*0.08}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('CHOC', s*0.07, 0);
    ctx.strokeStyle = darken(c[2] || '#7c2d12', 0.3); ctx.lineWidth = s*0.015;
    rRect(ctx, -s*0.32, -s*0.18, s*0.64, s*0.36, s*0.04); ctx.stroke();
    itemHighlight(ctx, -s*0.15, -s*0.1, s*0.08, s*0.03);
  },
};

export const gum_pack: ItemDef = { id: 'gum_pack', name: 'Gum Pack', world: 'snack_drawer', sizeTier: 3, baseValue: 5, weight: 1.0,
  draw(ctx, s, c) {
    ctx.fillStyle = c[1]; rRect(ctx, -s*0.18, -s*0.38, s*0.36, s*0.74, s*0.04); ctx.fill();
    ctx.fillStyle = '#ffffff'; rRect(ctx, -s*0.13, -s*0.3, s*0.26, s*0.55, s*0.02); ctx.fill();
    ctx.fillStyle = c[0]; ctx.font = `bold ${s*0.1}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('GUM', 0, -s*0.08);
    ctx.fillStyle = c[1]; ctx.beginPath(); ctx.arc(0, s*0.1, s*0.08, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = darken(c[1], 0.3); ctx.lineWidth = s*0.015;
    rRect(ctx, -s*0.18, -s*0.38, s*0.36, s*0.74, s*0.04); ctx.stroke();
  },
};

export const raisin_box: ItemDef = { id: 'raisin_box', name: 'Raisin Box', world: 'snack_drawer', sizeTier: 3, baseValue: 5, weight: 1.4,
  draw(ctx, s, c) {
    ctx.fillStyle = c[2] || '#7c2d12'; rRect(ctx, -s*0.22, -s*0.35, s*0.44, s*0.7, s*0.03); ctx.fill();
    ctx.fillStyle = '#fef3c7'; rRect(ctx, -s*0.18, -s*0.3, s*0.36, s*0.5, s*0.02); ctx.fill();
    ctx.fillStyle = c[2] || '#7c2d12';
    for (let r = 0; r < 3; r++) { for (let i = 0; i < 2; i++) { ctx.beginPath(); ctx.arc(-s*0.08 + i*s*0.16, -s*0.18 + r*s*0.12, s*0.035, 0, Math.PI*2); ctx.fill(); } }
    ctx.strokeStyle = darken(c[2] || '#7c2d12', 0.3); ctx.lineWidth = s*0.015;
    rRect(ctx, -s*0.22, -s*0.35, s*0.44, s*0.7, s*0.03); ctx.stroke();
    itemHighlight(ctx, -s*0.13, -s*0.27, s*0.06, s*0.05);
  },
};

export const beef_jerky: ItemDef = { id: 'beef_jerky', name: 'Beef Jerky', world: 'snack_drawer', sizeTier: 3, baseValue: 7, weight: 1.6,
  draw(ctx, s, c) {
    ctx.fillStyle = '#ef4444'; rRect(ctx, -s*0.22, -s*0.35, s*0.44, s*0.7, s*0.03); ctx.fill();
    ctx.fillStyle = '#1c1917';
    ctx.beginPath(); ctx.moveTo(-s*0.15, -s*0.15); ctx.bezierCurveTo(-s*0.18, 0, s*0.05, s*0.05, s*0.15, -s*0.05); ctx.bezierCurveTo(s*0.18, s*0.1, -s*0.05, s*0.18, -s*0.15, s*0.1); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.font = `bold ${s*0.06}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('JERKY', 0, s*0.25);
    ctx.strokeStyle = darken('#ef4444', 0.3); ctx.lineWidth = s*0.015;
    rRect(ctx, -s*0.22, -s*0.35, s*0.44, s*0.7, s*0.03); ctx.stroke();
  },
};

export const popcorn_bag: ItemDef = { id: 'popcorn_bag', name: 'Popcorn Bag', world: 'snack_drawer', sizeTier: 3, baseValue: 6, weight: 1.2,
  draw(ctx, s, c) {
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.moveTo(-s*0.28, -s*0.4); ctx.lineTo(s*0.28, -s*0.4); ctx.lineTo(s*0.32, s*0.35); ctx.lineTo(-s*0.32, s*0.35); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffffff';
    for (let i = -2; i <= 2; i++) { rRect(ctx, i*s*0.1 - s*0.025, -s*0.4 + Math.abs(i)*s*0.04, s*0.05, s*0.6, s*0.01); ctx.fill(); }
    ctx.fillStyle = '#fef9c3';
    const popcorn: [number, number][] = [[-0.15, -0.42], [0, -0.45], [0.15, -0.42], [-0.08, -0.35], [0.08, -0.38]];
    for (const [px, py] of popcorn) { ctx.beginPath(); ctx.arc(px*s, py*s, s*0.06, 0, Math.PI*2); ctx.fill(); }
    ctx.strokeStyle = darken('#ef4444', 0.3); ctx.lineWidth = s*0.015;
    ctx.beginPath(); ctx.moveTo(-s*0.28, -s*0.4); ctx.lineTo(s*0.28, -s*0.4); ctx.lineTo(s*0.32, s*0.35); ctx.lineTo(-s*0.32, s*0.35); ctx.closePath(); ctx.stroke();
  },
};

export const trail_mix: ItemDef = { id: 'trail_mix', name: 'Trail Mix', world: 'snack_drawer', sizeTier: 3, baseValue: 6, weight: 1.5,
  draw(ctx, s, c) {
    ctx.fillStyle = '#fef3c7'; rRect(ctx, -s*0.32, -s*0.32, s*0.64, s*0.64, s*0.05); ctx.fill();
    const items: [number, number, string, number][] = [[-0.18, -0.15, '#a16207', 0.05], [0.1, -0.18, '#84cc16', 0.04], [-0.1, 0.05, '#dc2626', 0.045], [0.18, 0.1, '#7c2d12', 0.04], [0, 0.18, '#fbbf24', 0.05], [-0.2, 0.18, '#a16207', 0.035]];
    for (const [px, py, col, r] of items) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(px*s, py*s, s*r, 0, Math.PI*2); ctx.fill(); }
    ctx.strokeStyle = darken('#fef3c7', 0.3); ctx.lineWidth = s*0.015;
    rRect(ctx, -s*0.32, -s*0.32, s*0.64, s*0.64, s*0.05); ctx.stroke();
    itemHighlight(ctx, -s*0.18, -s*0.22, s*0.08, s*0.04);
  },
};

export const nut_packet: ItemDef = { id: 'nut_packet', name: 'Nut Packet', world: 'snack_drawer', sizeTier: 3, baseValue: 5, weight: 1.3,
  draw(ctx, s, c) {
    ctx.fillStyle = c[2] || '#a16207'; rRect(ctx, -s*0.28, -s*0.32, s*0.56, s*0.64, s*0.04); ctx.fill();
    ctx.fillStyle = c[1]; rRect(ctx, -s*0.24, -s*0.28, s*0.48, s*0.18, s*0.02); ctx.fill();
    ctx.fillStyle = '#1e293b'; ctx.font = `bold ${s*0.08}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('NUTS', 0, -s*0.19);
    ctx.fillStyle = darken(c[2] || '#a16207', 0.4);
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.ellipse((Math.random()-0.5)*s*0.4, s*0.05 + (Math.random()-0.5)*s*0.2, s*0.05, s*0.04, Math.random()*Math.PI, 0, Math.PI*2); ctx.fill(); }
    ctx.strokeStyle = darken(c[2] || '#a16207', 0.4); ctx.lineWidth = s*0.015;
    rRect(ctx, -s*0.28, -s*0.32, s*0.56, s*0.64, s*0.04); ctx.stroke();
  },
};

export const mints_tin: ItemDef = { id: 'mints_tin', name: 'Mints Tin', world: 'snack_drawer', sizeTier: 3, baseValue: 6, weight: 1.6,
  draw(ctx, s, c) {
    ctx.fillStyle = c[1] || '#84cc16'; rRect(ctx, -s*0.3, -s*0.2, s*0.6, s*0.4, s*0.04); ctx.fill();
    ctx.fillStyle = '#ffffff'; rRect(ctx, -s*0.25, -s*0.15, s*0.5, s*0.3, s*0.02); ctx.fill();
    ctx.fillStyle = c[1] || '#84cc16'; ctx.font = `bold ${s*0.1}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('MINTS', 0, 0);
    ctx.strokeStyle = darken(c[1] || '#84cc16', 0.3); ctx.lineWidth = s*0.02;
    rRect(ctx, -s*0.3, -s*0.2, s*0.6, s*0.4, s*0.04); ctx.stroke();
    itemHighlight(ctx, -s*0.18, -s*0.13, s*0.1, s*0.04);
  },
};

// ═══════════════════════════════════════════════════════════════════
// SHOEBOX — sizeTier 3
// ═══════════════════════════════════════════════════════════════════

export const shoelace: ItemDef = { id: 'shoelace', name: 'Shoelace', world: 'shoebox', sizeTier: 3, baseValue: 4, weight: 0.6,
  draw(ctx, s, c) {
    ctx.strokeStyle = c[0]; ctx.lineWidth = s*0.04; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-s*0.4, s*0.2); ctx.bezierCurveTo(-s*0.2, -s*0.3, s*0.2, s*0.3, s*0.4, -s*0.2); ctx.stroke();
    ctx.fillStyle = c[2] || '#1e293b'; ctx.beginPath(); ctx.arc(-s*0.4, s*0.2, s*0.05, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.4, -s*0.2, s*0.05, 0, Math.PI*2); ctx.fill();
  },
};

export const sock: ItemDef = { id: 'sock', name: 'Sock', world: 'shoebox', sizeTier: 3, baseValue: 5, weight: 1.0,
  draw(ctx, s, c) {
    ctx.fillStyle = c[2] || '#a1a1aa';
    ctx.beginPath(); ctx.moveTo(-s*0.15, -s*0.4); ctx.lineTo(s*0.15, -s*0.4); ctx.lineTo(s*0.15, s*0.05); ctx.lineTo(s*0.4, s*0.18); ctx.lineTo(s*0.4, s*0.32); ctx.lineTo(-s*0.15, s*0.32); ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[0]; rRect(ctx, -s*0.16, -s*0.4, s*0.32, s*0.1, s*0.02); ctx.fill();
    ctx.strokeStyle = darken(c[2] || '#a1a1aa', 0.3); ctx.lineWidth = s*0.015;
    ctx.beginPath(); ctx.moveTo(-s*0.15, -s*0.4); ctx.lineTo(s*0.15, -s*0.4); ctx.lineTo(s*0.15, s*0.05); ctx.lineTo(s*0.4, s*0.18); ctx.lineTo(s*0.4, s*0.32); ctx.lineTo(-s*0.15, s*0.32); ctx.closePath(); ctx.stroke();
    itemHighlight(ctx, -s*0.05, -s*0.2, s*0.05, s*0.1);
  },
};

export const sneaker: ItemDef = { id: 'sneaker', name: 'Sneaker', world: 'shoebox', sizeTier: 3, baseValue: 8, weight: 2.5,
  draw(ctx, s, c) {
    ctx.fillStyle = c[1] || '#dc2626';
    ctx.beginPath(); ctx.moveTo(-s*0.4, s*0.05); ctx.lineTo(-s*0.4, -s*0.18); ctx.quadraticCurveTo(-s*0.3, -s*0.3, -s*0.05, -s*0.3); ctx.lineTo(s*0.35, -s*0.1); ctx.quadraticCurveTo(s*0.45, s*0.05, s*0.45, s*0.15); ctx.lineTo(-s*0.4, s*0.15); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffffff'; rRect(ctx, -s*0.4, s*0.1, s*0.85, s*0.12, s*0.03); ctx.fill();
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = s*0.025;
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-s*0.2 + i*s*0.12, -s*0.2); ctx.lineTo(-s*0.15 + i*s*0.12, -s*0.05); ctx.stroke(); }
    ctx.strokeStyle = darken(c[1] || '#dc2626', 0.3); ctx.lineWidth = s*0.018;
    ctx.beginPath(); ctx.moveTo(-s*0.4, s*0.05); ctx.lineTo(-s*0.4, -s*0.18); ctx.quadraticCurveTo(-s*0.3, -s*0.3, -s*0.05, -s*0.3); ctx.lineTo(s*0.35, -s*0.1); ctx.quadraticCurveTo(s*0.45, s*0.05, s*0.45, s*0.15); ctx.stroke();
    itemHighlight(ctx, -s*0.2, -s*0.22, s*0.08, s*0.04);
  },
};

export const baseball_cap: ItemDef = { id: 'baseball_cap', name: 'Baseball Cap', world: 'shoebox', sizeTier: 3, baseValue: 7, weight: 1.8,
  draw(ctx, s, c) {
    ctx.fillStyle = c[1] || '#dc2626';
    ctx.beginPath(); ctx.arc(0, 0, s*0.32, Math.PI, 0); ctx.lineTo(s*0.32, s*0.05); ctx.lineTo(-s*0.32, s*0.05); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, s*0.08, s*0.42, s*0.1, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = darken(c[1] || '#dc2626', 0.4); ctx.font = `bold ${s*0.16}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('B', 0, -s*0.1);
    ctx.fillStyle = c[2] || '#0ea5e9'; ctx.beginPath(); ctx.arc(0, -s*0.32, s*0.04, 0, Math.PI*2); ctx.fill();
    itemHighlight(ctx, -s*0.18, -s*0.22, s*0.08, s*0.05);
  },
};

export const sunglass_case: ItemDef = { id: 'sunglass_case', name: 'Sunglass Case', world: 'shoebox', sizeTier: 3, baseValue: 6, weight: 1.5,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0]; rRect(ctx, -s*0.4, -s*0.15, s*0.8, s*0.3, s*0.06); ctx.fill();
    ctx.strokeStyle = darken(c[0], 0.3); ctx.lineWidth = s*0.02;
    ctx.beginPath(); ctx.moveTo(-s*0.38, 0); ctx.lineTo(s*0.38, 0); ctx.stroke();
    ctx.fillStyle = c[2] || '#0ea5e9'; ctx.beginPath(); ctx.arc(s*0.32, s*0.05, s*0.04, 0, Math.PI*2); ctx.fill();
    rRect(ctx, -s*0.4, -s*0.15, s*0.8, s*0.3, s*0.06); ctx.stroke();
    itemHighlight(ctx, -s*0.2, -s*0.1, s*0.1, s*0.04);
  },
};

export const wristwatch: ItemDef = { id: 'wristwatch', name: 'Wristwatch', world: 'shoebox', sizeTier: 3, baseValue: 8, weight: 1.5,
  draw(ctx, s, c) {
    ctx.fillStyle = c[2] || '#1e293b'; rRect(ctx, -s*0.18, -s*0.4, s*0.36, s*0.18, s*0.03); ctx.fill();
    rRect(ctx, -s*0.18, s*0.22, s*0.36, s*0.18, s*0.03); ctx.fill();
    ctx.fillStyle = c[0]; ctx.beginPath(); ctx.arc(0, 0, s*0.25, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = darken(c[0], 0.4); ctx.lineWidth = s*0.025; ctx.stroke();
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(0, 0, s*0.18, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = s*0.025;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -s*0.13); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(s*0.1, s*0.05); ctx.stroke();
    itemHighlight(ctx, -s*0.07, -s*0.08, s*0.05, s*0.03);
  },
};

export const beanie: ItemDef = { id: 'beanie', name: 'Beanie', world: 'shoebox', sizeTier: 3, baseValue: 7, weight: 1.4,
  draw(ctx, s, c) {
    ctx.fillStyle = c[1] || '#dc2626';
    ctx.beginPath(); ctx.arc(0, s*0.05, s*0.32, Math.PI, 0); ctx.lineTo(s*0.32, s*0.18); ctx.lineTo(-s*0.32, s*0.18); ctx.closePath(); ctx.fill();
    ctx.fillStyle = darken(c[1] || '#dc2626', 0.2); rRect(ctx, -s*0.34, s*0.16, s*0.68, s*0.1, s*0.02); ctx.fill();
    ctx.fillStyle = c[2] || '#0ea5e9'; ctx.beginPath(); ctx.arc(0, -s*0.32, s*0.08, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = darken(c[2] || '#0ea5e9', 0.3); ctx.lineWidth = s*0.018;
    for (let i = 0; i < 6; i++) { const a = i*Math.PI/3; ctx.beginPath(); ctx.moveTo(0, -s*0.32); ctx.lineTo(Math.cos(a)*s*0.04, -s*0.32 + Math.sin(a)*s*0.04); ctx.stroke(); }
    itemHighlight(ctx, -s*0.18, -s*0.18, s*0.08, s*0.05);
  },
};

export const mittens: ItemDef = { id: 'mittens', name: 'Mittens', world: 'shoebox', sizeTier: 3, baseValue: 6, weight: 1.2,
  draw(ctx, s, c) {
    ctx.fillStyle = c[1] || '#dc2626';
    for (let m = 0; m < 2; m++) { const offset = m === 0 ? -s*0.18 : s*0.18;
      ctx.beginPath(); ctx.moveTo(offset - s*0.1, s*0.3); ctx.lineTo(offset - s*0.12, -s*0.1); ctx.quadraticCurveTo(offset - s*0.12, -s*0.3, offset, -s*0.3); ctx.quadraticCurveTo(offset + s*0.08, -s*0.3, offset + s*0.08, -s*0.15); ctx.lineTo(offset + s*0.14, -s*0.05); ctx.lineTo(offset + s*0.14, s*0.3); ctx.closePath(); ctx.fill();
    }
    ctx.fillStyle = '#ffffff'; rRect(ctx, -s*0.32, s*0.25, s*0.64, s*0.07, s*0.02); ctx.fill();
    itemHighlight(ctx, -s*0.18, -s*0.15, s*0.06, s*0.06);
  },
};

export const cleat: ItemDef = { id: 'cleat', name: 'Soccer Cleat', world: 'shoebox', sizeTier: 3, baseValue: 8, weight: 2.6,
  draw(ctx, s, c) {
    ctx.fillStyle = c[2] || '#0ea5e9';
    ctx.beginPath(); ctx.moveTo(-s*0.4, s*0.0); ctx.lineTo(-s*0.4, -s*0.1); ctx.quadraticCurveTo(-s*0.35, -s*0.22, -s*0.1, -s*0.22); ctx.lineTo(s*0.4, -s*0.05); ctx.quadraticCurveTo(s*0.45, s*0.1, s*0.4, s*0.15); ctx.lineTo(-s*0.4, s*0.15); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#1e293b';
    for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.arc(i*s*0.12 + s*0.05, s*0.18, s*0.03, 0, Math.PI*2); ctx.fill(); }
    ctx.fillStyle = '#ffffff'; rRect(ctx, -s*0.4, s*0.05, s*0.85, s*0.05, s*0.02); ctx.fill();
    ctx.strokeStyle = darken(c[2] || '#0ea5e9', 0.3); ctx.lineWidth = s*0.018;
    ctx.beginPath(); ctx.moveTo(-s*0.4, s*0.0); ctx.lineTo(-s*0.4, -s*0.1); ctx.quadraticCurveTo(-s*0.35, -s*0.22, -s*0.1, -s*0.22); ctx.lineTo(s*0.4, -s*0.05); ctx.stroke();
    itemHighlight(ctx, -s*0.2, -s*0.15, s*0.08, s*0.04);
  },
};

export const slipper_pair: ItemDef = { id: 'slipper_pair', name: 'Slippers', world: 'shoebox', sizeTier: 3, baseValue: 6, weight: 1.5,
  draw(ctx, s, c) {
    ctx.fillStyle = c[1] || '#dc2626';
    for (let i = 0; i < 2; i++) { const offset = i === 0 ? -s*0.18 : s*0.18;
      ctx.beginPath(); ctx.ellipse(offset, s*0.05, s*0.16, s*0.25, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = darken(c[1] || '#dc2626', 0.3); rRect(ctx, offset - s*0.12, -s*0.12, s*0.24, s*0.1, s*0.04); ctx.fill();
      ctx.fillStyle = c[1] || '#dc2626';
    }
    itemHighlight(ctx, -s*0.22, -s*0.05, s*0.05, s*0.06);
  },
};

// ═══════════════════════════════════════════════════════════════════
// PANTRY — sizeTier 4
// ═══════════════════════════════════════════════════════════════════

export const cereal_box: ItemDef = { id: 'cereal_box', name: 'Cereal Box', world: 'pantry', sizeTier: 4, baseValue: 9, weight: 3.0,
  draw(ctx, s, c) {
    ctx.fillStyle = c[1] || '#dc2626'; rRect(ctx, -s*0.28, -s*0.4, s*0.56, s*0.8, s*0.03); ctx.fill();
    ctx.fillStyle = '#fef9c3'; rRect(ctx, -s*0.22, -s*0.32, s*0.44, s*0.34, s*0.02); ctx.fill();
    ctx.fillStyle = c[0]; ctx.font = `bold ${s*0.1}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('CRUNCH', 0, -s*0.18);
    ctx.fillStyle = c[2] || '#16a34a';
    for (let r = 0; r < 2; r++) { for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(-s*0.15 + i*s*0.1, s*0.15 + r*s*0.1, s*0.04, 0, Math.PI*2); ctx.fill(); } }
    ctx.strokeStyle = darken(c[1] || '#dc2626', 0.3); ctx.lineWidth = s*0.018;
    rRect(ctx, -s*0.28, -s*0.4, s*0.56, s*0.8, s*0.03); ctx.stroke();
    itemHighlight(ctx, -s*0.18, -s*0.32, s*0.08, s*0.05);
  },
};

export const soup_can: ItemDef = { id: 'soup_can', name: 'Soup Can', world: 'pantry', sizeTier: 4, baseValue: 8, weight: 3.5,
  draw(ctx, s, c) {
    ctx.fillStyle = c[2] || '#a3a3a3'; rRect(ctx, -s*0.25, -s*0.4, s*0.5, s*0.8, s*0.03); ctx.fill();
    ctx.fillStyle = c[1] || '#dc2626'; rRect(ctx, -s*0.25, -s*0.2, s*0.5, s*0.4, s*0.0); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.font = `bold ${s*0.08}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('SOUP', 0, 0);
    ctx.strokeStyle = darken(c[2] || '#a3a3a3', 0.3); ctx.lineWidth = s*0.02;
    ctx.beginPath(); ctx.moveTo(-s*0.25, -s*0.36); ctx.lineTo(s*0.25, -s*0.36); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s*0.25, s*0.36); ctx.lineTo(s*0.25, s*0.36); ctx.stroke();
    rRect(ctx, -s*0.25, -s*0.4, s*0.5, s*0.8, s*0.03); ctx.stroke();
    itemHighlight(ctx, -s*0.16, -s*0.3, s*0.06, s*0.18);
  },
};

export const jam_jar: ItemDef = { id: 'jam_jar', name: 'Jam Jar', world: 'pantry', sizeTier: 4, baseValue: 9, weight: 3.5,
  draw(ctx, s, c) {
    ctx.fillStyle = c[1] || '#dc2626'; rRect(ctx, -s*0.22, -s*0.15, s*0.44, s*0.5, s*0.04); ctx.fill();
    ctx.fillStyle = c[2] || '#16a34a'; rRect(ctx, -s*0.24, -s*0.32, s*0.48, s*0.18, s*0.04); ctx.fill();
    ctx.fillStyle = '#ffffff'; rRect(ctx, -s*0.18, -s*0.05, s*0.36, s*0.18, s*0.02); ctx.fill();
    ctx.fillStyle = '#1e293b'; ctx.font = `bold ${s*0.06}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('JAM', 0, s*0.04);
    ctx.strokeStyle = darken(c[2] || '#16a34a', 0.3); ctx.lineWidth = s*0.02;
    ctx.beginPath(); ctx.moveTo(-s*0.24, -s*0.14); ctx.lineTo(s*0.24, -s*0.14); ctx.stroke();
    itemHighlight(ctx, -s*0.13, -s*0.05, s*0.05, s*0.15);
  },
};

export const pasta_box: ItemDef = { id: 'pasta_box', name: 'Pasta Box', world: 'pantry', sizeTier: 4, baseValue: 8, weight: 2.8,
  draw(ctx, s, c) {
    ctx.fillStyle = c[2] || '#16a34a'; rRect(ctx, -s*0.4, -s*0.25, s*0.8, s*0.5, s*0.03); ctx.fill();
    ctx.fillStyle = '#fef9c3'; rRect(ctx, -s*0.36, -s*0.2, s*0.4, s*0.4, s*0.02); ctx.fill();
    ctx.fillStyle = c[0]; ctx.font = `bold ${s*0.07}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('PASTA', s*0.18, 0);
    ctx.strokeStyle = c[1] || '#fbbf24'; ctx.lineWidth = s*0.02;
    for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(-s*0.32, i*s*0.06); ctx.lineTo(-s*0.04, i*s*0.06); ctx.stroke(); }
    ctx.strokeStyle = darken(c[2] || '#16a34a', 0.3); ctx.lineWidth = s*0.018;
    rRect(ctx, -s*0.4, -s*0.25, s*0.8, s*0.5, s*0.03); ctx.stroke();
  },
};

export const rice_bag: ItemDef = { id: 'rice_bag', name: 'Rice Bag', world: 'pantry', sizeTier: 4, baseValue: 8, weight: 4.5,
  draw(ctx, s, c) {
    ctx.fillStyle = '#fef9c3';
    ctx.beginPath(); ctx.moveTo(-s*0.3, -s*0.35); ctx.lineTo(s*0.3, -s*0.35); ctx.lineTo(s*0.36, s*0.35); ctx.lineTo(-s*0.36, s*0.35); ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[0]; rRect(ctx, -s*0.28, -s*0.18, s*0.56, s*0.16, s*0.02); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.font = `bold ${s*0.08}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('RICE', 0, -s*0.1);
    ctx.fillStyle = '#1e293b';
    for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.ellipse((Math.random()-0.5)*s*0.5, s*0.12 + (Math.random()-0.5)*s*0.3, s*0.012, s*0.005, Math.random()*Math.PI, 0, Math.PI*2); ctx.fill(); }
    ctx.strokeStyle = darken('#fef9c3', 0.3); ctx.lineWidth = s*0.018;
    ctx.beginPath(); ctx.moveTo(-s*0.3, -s*0.35); ctx.lineTo(s*0.3, -s*0.35); ctx.lineTo(s*0.36, s*0.35); ctx.lineTo(-s*0.36, s*0.35); ctx.closePath(); ctx.stroke();
  },
};

export const peanut_butter: ItemDef = { id: 'peanut_butter', name: 'Peanut Butter', world: 'pantry', sizeTier: 4, baseValue: 10, weight: 3.8,
  draw(ctx, s, c) {
    ctx.fillStyle = '#fef9c3'; rRect(ctx, -s*0.25, -s*0.15, s*0.5, s*0.5, s*0.04); ctx.fill();
    ctx.fillStyle = '#92400e'; rRect(ctx, -s*0.24, -s*0.1, s*0.48, s*0.42, s*0.02); ctx.fill();
    ctx.fillStyle = c[2] || '#a16207'; rRect(ctx, -s*0.27, -s*0.32, s*0.54, s*0.2, s*0.04); ctx.fill();
    ctx.fillStyle = '#ffffff'; rRect(ctx, -s*0.2, s*0.0, s*0.4, s*0.2, s*0.02); ctx.fill();
    ctx.fillStyle = '#92400e'; ctx.font = `bold ${s*0.06}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('PB', 0, s*0.1);
    ctx.strokeStyle = darken(c[2] || '#a16207', 0.3); ctx.lineWidth = s*0.02;
    ctx.beginPath(); ctx.moveTo(-s*0.27, -s*0.13); ctx.lineTo(s*0.27, -s*0.13); ctx.stroke();
  },
};

export const ketchup_bottle: ItemDef = { id: 'ketchup_bottle', name: 'Ketchup', world: 'pantry', sizeTier: 4, baseValue: 9, weight: 3.0,
  draw(ctx, s, c) {
    ctx.fillStyle = '#dc2626';
    ctx.beginPath(); ctx.moveTo(-s*0.18, s*0.4); ctx.lineTo(-s*0.18, -s*0.18); ctx.quadraticCurveTo(-s*0.18, -s*0.32, -s*0.1, -s*0.34); ctx.lineTo(s*0.1, -s*0.34); ctx.quadraticCurveTo(s*0.18, -s*0.32, s*0.18, -s*0.18); ctx.lineTo(s*0.18, s*0.4); ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[2] || '#16a34a'; rRect(ctx, -s*0.1, -s*0.4, s*0.2, s*0.08, s*0.02); ctx.fill();
    ctx.fillStyle = '#ffffff'; rRect(ctx, -s*0.16, -s*0.05, s*0.32, s*0.25, s*0.02); ctx.fill();
    ctx.fillStyle = '#dc2626'; ctx.font = `bold ${s*0.08}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('57', 0, s*0.08);
    itemHighlight(ctx, -s*0.1, -s*0.2, s*0.04, s*0.15);
  },
};

export const oil_can: ItemDef = { id: 'oil_can', name: 'Oil Bottle', world: 'pantry', sizeTier: 4, baseValue: 8, weight: 3.5,
  draw(ctx, s, c) {
    ctx.fillStyle = c[2] || '#16a34a';
    ctx.beginPath(); ctx.moveTo(-s*0.2, s*0.4); ctx.lineTo(-s*0.2, -s*0.05); ctx.quadraticCurveTo(-s*0.2, -s*0.18, -s*0.08, -s*0.2); ctx.lineTo(-s*0.06, -s*0.35); ctx.lineTo(s*0.06, -s*0.35); ctx.lineTo(s*0.08, -s*0.2); ctx.quadraticCurveTo(s*0.2, -s*0.18, s*0.2, -s*0.05); ctx.lineTo(s*0.2, s*0.4); ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[1] || '#fbbf24'; rRect(ctx, -s*0.16, s*0.05, s*0.32, s*0.25, s*0.02); ctx.fill();
    ctx.fillStyle = '#1e293b'; ctx.font = `bold ${s*0.07}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('OIL', 0, s*0.18);
    ctx.fillStyle = '#1e293b'; rRect(ctx, -s*0.07, -s*0.4, s*0.14, s*0.06, s*0.01); ctx.fill();
    itemHighlight(ctx, -s*0.13, -s*0.05, s*0.04, s*0.2);
  },
};

export const sugar_bag: ItemDef = { id: 'sugar_bag', name: 'Sugar Bag', world: 'pantry', sizeTier: 4, baseValue: 7, weight: 3.5,
  draw(ctx, s, c) {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.moveTo(-s*0.32, -s*0.35); ctx.lineTo(s*0.32, -s*0.35); ctx.lineTo(s*0.38, s*0.35); ctx.lineTo(-s*0.38, s*0.35); ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[1] || '#fbbf24'; rRect(ctx, -s*0.32, -s*0.05, s*0.64, s*0.25, s*0.02); ctx.fill();
    ctx.fillStyle = '#1e293b'; ctx.font = `bold ${s*0.1}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('SUGAR', 0, s*0.08);
    ctx.fillStyle = darken('#ffffff', 0.1);
    for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.arc((Math.random()-0.5)*s*0.5, -s*0.18 + (Math.random()-0.5)*s*0.15, s*0.012, 0, Math.PI*2); ctx.fill(); }
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = s*0.018;
    ctx.beginPath(); ctx.moveTo(-s*0.32, -s*0.35); ctx.lineTo(s*0.32, -s*0.35); ctx.lineTo(s*0.38, s*0.35); ctx.lineTo(-s*0.38, s*0.35); ctx.closePath(); ctx.stroke();
  },
};

export const cookie_tin: ItemDef = { id: 'cookie_tin', name: 'Cookie Tin', world: 'pantry', sizeTier: 4, baseValue: 11, weight: 4.0,
  draw(ctx, s, c) {
    ctx.fillStyle = c[1] || '#dc2626'; ctx.beginPath(); ctx.ellipse(0, s*0.05, s*0.4, s*0.15, 0, 0, Math.PI*2); ctx.fill();
    rRect(ctx, -s*0.4, -s*0.25, s*0.8, s*0.3, s*0.02); ctx.fill();
    ctx.fillStyle = darken(c[1] || '#dc2626', 0.2); ctx.beginPath(); ctx.ellipse(0, -s*0.25, s*0.4, s*0.15, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[2] || '#16a34a'; rRect(ctx, -s*0.32, -s*0.18, s*0.64, s*0.16, s*0.02); ctx.fill();
    ctx.fillStyle = '#fef9c3'; ctx.font = `bold ${s*0.08}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('COOKIES', 0, -s*0.1);
    itemHighlight(ctx, -s*0.2, -s*0.22, s*0.1, s*0.04);
  },
};

// ═══════════════════════════════════════════════════════════════════
// LAUNDRY ROOM — sizeTier 4
// ═══════════════════════════════════════════════════════════════════

export const laundry_basket: ItemDef = { id: 'laundry_basket', name: 'Laundry Basket', world: 'laundry_room', sizeTier: 4, baseValue: 12, weight: 4.0,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.moveTo(-s*0.35, -s*0.2); ctx.lineTo(s*0.35, -s*0.2); ctx.lineTo(s*0.3, s*0.35); ctx.lineTo(-s*0.3, s*0.35); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = darken(c[0], 0.35); ctx.lineWidth = s*0.02;
    for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(i*s*0.08, -s*0.2); ctx.lineTo(i*s*0.07, s*0.35); ctx.stroke(); }
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-s*0.35 + i*s*0.005, -s*0.18 + i*s*0.13); ctx.lineTo(s*0.35 - i*s*0.005, -s*0.18 + i*s*0.13); ctx.stroke(); }
    ctx.fillStyle = c[1] || '#a5f3fc';
    ctx.beginPath(); ctx.ellipse(-s*0.1, -s*0.15, s*0.1, s*0.05, 0.2, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(s*0.1, -s*0.18, s*0.08, s*0.04, -0.3, 0, Math.PI*2); ctx.fill();
    itemHighlight(ctx, -s*0.18, -s*0.12, s*0.07, s*0.04);
  },
};

export const detergent_jug: ItemDef = { id: 'detergent_jug', name: 'Detergent', world: 'laundry_room', sizeTier: 4, baseValue: 11, weight: 4.5,
  draw(ctx, s, c) {
    ctx.fillStyle = c[2] || '#fbbf24'; rRect(ctx, -s*0.28, -s*0.25, s*0.56, s*0.6, s*0.04); ctx.fill();
    ctx.fillStyle = darken(c[2] || '#fbbf24', 0.3); rRect(ctx, -s*0.1, -s*0.4, s*0.2, s*0.18, s*0.03); ctx.fill();
    ctx.fillStyle = c[0]; rRect(ctx, -s*0.2, s*0.05, s*0.4, s*0.18, s*0.02); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.font = `bold ${s*0.07}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('CLEAN', 0, s*0.13);
    ctx.fillStyle = darken(c[0], 0.3); rRect(ctx, s*0.18, -s*0.1, s*0.12, s*0.18, s*0.02); ctx.fill();
    itemHighlight(ctx, -s*0.18, -s*0.18, s*0.06, s*0.1);
  },
};

export const dryer_sheet_box: ItemDef = { id: 'dryer_sheet_box', name: 'Dryer Sheets', world: 'laundry_room', sizeTier: 4, baseValue: 9, weight: 2.5,
  draw(ctx, s, c) {
    ctx.fillStyle = c[1] || '#a5f3fc'; rRect(ctx, -s*0.32, -s*0.22, s*0.64, s*0.44, s*0.03); ctx.fill();
    ctx.fillStyle = '#ffffff'; rRect(ctx, -s*0.28, -s*0.18, s*0.56, s*0.3, s*0.02); ctx.fill();
    ctx.fillStyle = c[0]; ctx.font = `bold ${s*0.08}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('FRESH', 0, -s*0.07);
    ctx.fillStyle = c[2] || '#fbbf24';
    for (let i = 0; i < 5; i++) { const a = i*Math.PI/2.5; ctx.beginPath(); ctx.moveTo(0, s*0.04); for (let p = 0; p < 6; p++) { const t = p*Math.PI/3 + a; ctx.lineTo(Math.cos(t)*s*0.04, Math.sin(t)*s*0.04 + s*0.04); } ctx.fill(); }
    ctx.strokeStyle = darken(c[1] || '#a5f3fc', 0.3); ctx.lineWidth = s*0.018;
    rRect(ctx, -s*0.32, -s*0.22, s*0.64, s*0.44, s*0.03); ctx.stroke();
  },
};

export const iron: ItemDef = { id: 'iron', name: 'Iron', world: 'laundry_room', sizeTier: 4, baseValue: 13, weight: 5.0,
  draw(ctx, s, c) {
    ctx.fillStyle = c[2] || '#fbbf24';
    ctx.beginPath(); ctx.moveTo(-s*0.35, s*0.1); ctx.lineTo(s*0.3, s*0.05); ctx.quadraticCurveTo(s*0.4, s*0.05, s*0.42, s*0.18); ctx.lineTo(s*0.4, s*0.25); ctx.lineTo(-s*0.32, s*0.25); ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[0]; rRect(ctx, -s*0.3, -s*0.2, s*0.55, s*0.32, s*0.05); ctx.fill();
    ctx.fillStyle = darken(c[0], 0.3); rRect(ctx, -s*0.1, -s*0.35, s*0.2, s*0.16, s*0.03); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(0, -s*0.1, s*0.05, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[1] || '#a5f3fc'; ctx.beginPath(); ctx.arc(0, -s*0.1, s*0.025, 0, Math.PI*2); ctx.fill();
    itemHighlight(ctx, -s*0.18, -s*0.15, s*0.08, s*0.04);
  },
};

export const ironing_board: ItemDef = { id: 'ironing_board', name: 'Ironing Board', world: 'laundry_room', sizeTier: 4, baseValue: 12, weight: 4.5,
  draw(ctx, s, c) {
    ctx.fillStyle = c[1] || '#a5f3fc';
    ctx.beginPath(); ctx.ellipse(0, -s*0.05, s*0.4, s*0.15, 0, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = c[2] || '#fbbf24'; ctx.lineWidth = s*0.025;
    ctx.beginPath(); ctx.moveTo(-s*0.2, s*0.1); ctx.lineTo(-s*0.05, s*0.4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s*0.2, s*0.1); ctx.lineTo(s*0.05, s*0.4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s*0.05, s*0.4); ctx.lineTo(s*0.05, s*0.4); ctx.stroke();
    ctx.strokeStyle = darken(c[1] || '#a5f3fc', 0.3); ctx.lineWidth = s*0.018;
    ctx.beginPath(); ctx.ellipse(0, -s*0.05, s*0.4, s*0.15, 0, 0, Math.PI*2); ctx.stroke();
    itemHighlight(ctx, -s*0.18, -s*0.1, s*0.1, s*0.04);
  },
};

export const hanger_rack: ItemDef = { id: 'hanger_rack', name: 'Hanger Rack', world: 'laundry_room', sizeTier: 4, baseValue: 11, weight: 3.5,
  draw(ctx, s, c) {
    ctx.strokeStyle = c[2] || '#fbbf24'; ctx.lineWidth = s*0.04;
    ctx.beginPath(); ctx.moveTo(-s*0.4, -s*0.25); ctx.lineTo(s*0.4, -s*0.25); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s*0.38, -s*0.3); ctx.lineTo(-s*0.38, -s*0.2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s*0.38, -s*0.3); ctx.lineTo(s*0.38, -s*0.2); ctx.stroke();
    ctx.strokeStyle = c[0]; ctx.lineWidth = s*0.02;
    for (let i = 0; i < 4; i++) { const x = -s*0.27 + i*s*0.18; ctx.beginPath(); ctx.moveTo(x - s*0.05, -s*0.22); ctx.quadraticCurveTo(x, -s*0.18, x + s*0.05, -s*0.22); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, -s*0.22); ctx.lineTo(x, -s*0.1); ctx.lineTo(x - s*0.05, -s*0.05); ctx.lineTo(x + s*0.05, -s*0.05); ctx.lineTo(x, -s*0.1); ctx.stroke();
    }
    ctx.fillStyle = c[1] || '#a5f3fc';
    for (let i = 0; i < 4; i++) { const x = -s*0.27 + i*s*0.18; rRect(ctx, x - s*0.06, -s*0.05, s*0.12, s*0.3, s*0.02); ctx.fill(); }
  },
};

export const fabric_softener: ItemDef = { id: 'fabric_softener', name: 'Fabric Softener', world: 'laundry_room', sizeTier: 4, baseValue: 10, weight: 4.0,
  draw(ctx, s, c) {
    ctx.fillStyle = c[1] || '#a5f3fc'; rRect(ctx, -s*0.25, -s*0.25, s*0.5, s*0.6, s*0.04); ctx.fill();
    ctx.fillStyle = '#ffffff'; rRect(ctx, -s*0.22, -s*0.18, s*0.44, s*0.18, s*0.02); ctx.fill();
    ctx.fillStyle = c[0]; ctx.font = `bold ${s*0.07}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('SOFT', 0, -s*0.09);
    ctx.fillStyle = c[2] || '#fbbf24'; rRect(ctx, -s*0.1, -s*0.4, s*0.2, s*0.18, s*0.03); ctx.fill();
    ctx.fillStyle = darken(c[1] || '#a5f3fc', 0.3); rRect(ctx, -s*0.18, s*0.05, s*0.36, s*0.25, s*0.02); ctx.fill();
    itemHighlight(ctx, -s*0.15, -s*0.15, s*0.06, s*0.06);
  },
};

export const lint_roller: ItemDef = { id: 'lint_roller', name: 'Lint Roller', world: 'laundry_room', sizeTier: 4, baseValue: 8, weight: 1.5,
  draw(ctx, s, c) {
    ctx.fillStyle = c[2] || '#fbbf24'; rRect(ctx, -s*0.04, -s*0.4, s*0.08, s*0.4, s*0.02); ctx.fill();
    ctx.fillStyle = c[0]; rRect(ctx, -s*0.06, -s*0.05, s*0.12, s*0.15, s*0.02); ctx.fill();
    ctx.fillStyle = '#ffffff'; rRect(ctx, -s*0.32, s*0.1, s*0.64, s*0.22, s*0.04); ctx.fill();
    ctx.fillStyle = darken('#ffffff', 0.1);
    for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(i*s*0.08, s*0.1); ctx.lineTo(i*s*0.08, s*0.32); ctx.stroke(); }
    ctx.strokeStyle = darken('#ffffff', 0.3); ctx.lineWidth = s*0.015;
    rRect(ctx, -s*0.32, s*0.1, s*0.64, s*0.22, s*0.04); ctx.stroke();
    itemHighlight(ctx, -s*0.18, s*0.14, s*0.08, s*0.04);
  },
};

export const clothes_pin: ItemDef = { id: 'clothes_pin', name: 'Clothes Pin', world: 'laundry_room', sizeTier: 4, baseValue: 7, weight: 1.0,
  draw(ctx, s, c) {
    ctx.fillStyle = c[2] || '#fbbf24'; rRect(ctx, -s*0.08, -s*0.4, s*0.16, s*0.7, s*0.02); ctx.fill();
    ctx.fillStyle = darken(c[2] || '#fbbf24', 0.3);
    ctx.beginPath(); ctx.moveTo(-s*0.08, s*0.0); ctx.lineTo(s*0.08, s*0.0); ctx.lineTo(s*0.05, s*0.2); ctx.lineTo(-s*0.05, s*0.2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[1] || '#a5f3fc'; ctx.beginPath(); ctx.arc(0, s*0.0, s*0.04, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = darken(c[2] || '#fbbf24', 0.3); ctx.lineWidth = s*0.015;
    rRect(ctx, -s*0.08, -s*0.4, s*0.16, s*0.7, s*0.02); ctx.stroke();
  },
};

export const washing_bin: ItemDef = { id: 'washing_bin', name: 'Washing Bin', world: 'laundry_room', sizeTier: 4, baseValue: 12, weight: 4.5,
  draw(ctx, s, c) {
    ctx.fillStyle = c[1] || '#a5f3fc';
    ctx.beginPath(); ctx.moveTo(-s*0.38, -s*0.25); ctx.lineTo(s*0.38, -s*0.25); ctx.lineTo(s*0.32, s*0.35); ctx.lineTo(-s*0.32, s*0.35); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.ellipse(0, -s*0.18, s*0.18, s*0.06, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(s*0.05, -s*0.2, s*0.08, s*0.04, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[0]; rRect(ctx, -s*0.4, -s*0.3, s*0.05, s*0.65, s*0.02); ctx.fill();
    rRect(ctx, s*0.35, -s*0.3, s*0.05, s*0.65, s*0.02); ctx.fill();
    ctx.strokeStyle = darken(c[1] || '#a5f3fc', 0.3); ctx.lineWidth = s*0.02;
    ctx.beginPath(); ctx.moveTo(-s*0.38, -s*0.25); ctx.lineTo(s*0.38, -s*0.25); ctx.lineTo(s*0.32, s*0.35); ctx.lineTo(-s*0.32, s*0.35); ctx.closePath(); ctx.stroke();
    itemHighlight(ctx, -s*0.2, -s*0.18, s*0.1, s*0.04);
  },
};

// HALLWAY T5
export const umbrella_stand: ItemDef = { id: 'umbrella_stand', name: 'Umbrella Stand', world: 'hallway', sizeTier: 5, baseValue: 15, weight: 5,
  draw(ctx, s, c) { ctx.fillStyle = c[2] || '#a1a1aa'; rRect(ctx, -s*0.18, -s*0.3, s*0.36, s*0.65, s*0.05); ctx.fill();
    ctx.fillStyle = c[0]; ctx.beginPath(); ctx.moveTo(s*0.1, -s*0.4); ctx.lineTo(s*0.1, s*0.0); ctx.stroke();
    ctx.beginPath(); ctx.arc(s*0.1, -s*0.4, s*0.18, Math.PI*1.1, Math.PI*1.9); ctx.fill();
    ctx.strokeStyle = darken(c[2] || '#a1a1aa', 0.3); ctx.lineWidth = s*0.02; rRect(ctx, -s*0.18, -s*0.3, s*0.36, s*0.65, s*0.05); ctx.stroke();
    itemHighlight(ctx, -s*0.1, -s*0.2, s*0.05, s*0.15); } };

export const coat_rack: ItemDef = { id: 'coat_rack', name: 'Coat Rack', world: 'hallway', sizeTier: 5, baseValue: 14, weight: 5,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#92400e'; rRect(ctx, -s*0.04, -s*0.4, s*0.08, s*0.7, s*0.02); ctx.fill();
    rRect(ctx, -s*0.2, s*0.3, s*0.4, s*0.08, s*0.02); ctx.fill();
    ctx.strokeStyle = c[2] || '#a1a1aa'; ctx.lineWidth = s*0.04; ctx.lineCap = 'round';
    for (let i = 0; i < 4; i++) { const a = i*Math.PI/2 + Math.PI/4; ctx.beginPath(); ctx.moveTo(0, -s*0.4); ctx.lineTo(Math.cos(a)*s*0.18, -s*0.4 + Math.abs(Math.sin(a))*s*0.1); ctx.stroke(); }
    ctx.fillStyle = c[0]; ctx.beginPath(); ctx.moveTo(s*0.16, -s*0.36); ctx.lineTo(s*0.22, -s*0.2); ctx.lineTo(s*0.1, -s*0.18); ctx.closePath(); ctx.fill(); } };

export const throw_rug: ItemDef = { id: 'throw_rug', name: 'Throw Rug', world: 'hallway', sizeTier: 5, baseValue: 13, weight: 4,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; rRect(ctx, -s*0.4, -s*0.18, s*0.8, s*0.36, s*0.02); ctx.fill();
    ctx.strokeStyle = c[2] || '#a1a1aa'; ctx.lineWidth = s*0.04;
    for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i*s*0.16, -s*0.18); ctx.lineTo(i*s*0.16, s*0.18); ctx.stroke(); }
    ctx.fillStyle = c[1] || '#92400e';
    for (let i = 0; i < 8; i++) { ctx.fillRect(-s*0.4 + i*s*0.1, -s*0.22, s*0.04, s*0.04); ctx.fillRect(-s*0.4 + i*s*0.1, s*0.18, s*0.04, s*0.04); }
    itemHighlight(ctx, -s*0.2, -s*0.1, s*0.1, s*0.04); } };

export const hallway_mirror: ItemDef = { id: 'hallway_mirror', name: 'Hallway Mirror', world: 'hallway', sizeTier: 5, baseValue: 16, weight: 5,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#92400e'; rRect(ctx, -s*0.22, -s*0.4, s*0.44, s*0.8, s*0.06); ctx.fill();
    ctx.fillStyle = '#dbeafe'; rRect(ctx, -s*0.16, -s*0.34, s*0.32, s*0.68, s*0.04); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath(); ctx.moveTo(-s*0.16, s*0.34); ctx.lineTo(s*0.16, -s*0.34); ctx.lineTo(s*0.05, -s*0.34); ctx.lineTo(-s*0.16, s*0.18); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = darken(c[1] || '#92400e', 0.3); ctx.lineWidth = s*0.02; rRect(ctx, -s*0.22, -s*0.4, s*0.44, s*0.8, s*0.06); ctx.stroke(); } };

export const side_table: ItemDef = { id: 'side_table', name: 'Side Table', world: 'hallway', sizeTier: 5, baseValue: 18, weight: 7,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#92400e'; rRect(ctx, -s*0.35, -s*0.25, s*0.7, s*0.12, s*0.03); ctx.fill();
    rRect(ctx, -s*0.3, -s*0.15, s*0.05, s*0.55, s*0.02); ctx.fill();
    rRect(ctx, s*0.25, -s*0.15, s*0.05, s*0.55, s*0.02); ctx.fill();
    rRect(ctx, -s*0.32, s*0.0, s*0.64, s*0.05, s*0.02); ctx.fill();
    ctx.fillStyle = c[0]; ctx.beginPath(); ctx.arc(0, -s*0.35, s*0.08, 0, Math.PI*2); ctx.fill();
    itemHighlight(ctx, -s*0.18, -s*0.22, s*0.1, s*0.03); } };

export const hallway_lamp: ItemDef = { id: 'hallway_lamp', name: 'Hallway Lamp', world: 'hallway', sizeTier: 5, baseValue: 16, weight: 4,
  draw(ctx, s, c) { ctx.fillStyle = c[2] || '#a1a1aa'; rRect(ctx, -s*0.04, -s*0.05, s*0.08, s*0.4, s*0.01); ctx.fill();
    rRect(ctx, -s*0.15, s*0.32, s*0.3, s*0.06, s*0.02); ctx.fill();
    ctx.fillStyle = c[1] || '#92400e';
    ctx.beginPath(); ctx.moveTo(-s*0.18, -s*0.05); ctx.lineTo(s*0.18, -s*0.05); ctx.lineTo(s*0.14, -s*0.32); ctx.lineTo(-s*0.14, -s*0.32); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fef9c3'; rRect(ctx, -s*0.13, -s*0.32, s*0.26, s*0.04, s*0.01); ctx.fill();
    itemHighlight(ctx, -s*0.08, -s*0.2, s*0.04, s*0.06); } };

export const doormat_indoor: ItemDef = { id: 'doormat_indoor', name: 'Doormat', world: 'hallway', sizeTier: 5, baseValue: 12, weight: 3,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#92400e'; rRect(ctx, -s*0.4, -s*0.2, s*0.8, s*0.4, s*0.03); ctx.fill();
    ctx.fillStyle = c[2] || '#a1a1aa';
    ctx.font = `bold ${s*0.14}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('WELCOME', 0, 0);
    ctx.strokeStyle = darken(c[1] || '#92400e', 0.3); ctx.lineWidth = s*0.015;
    rRect(ctx, -s*0.4, -s*0.2, s*0.8, s*0.4, s*0.03); ctx.stroke(); } };

export const key_dish: ItemDef = { id: 'key_dish', name: 'Key Dish', world: 'hallway', sizeTier: 5, baseValue: 13, weight: 3,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.ellipse(0, 0, s*0.4, s*0.18, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = darken(c[0], 0.2); ctx.beginPath(); ctx.ellipse(0, -s*0.05, s*0.32, s*0.14, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[2] || '#a1a1aa';
    ctx.beginPath(); ctx.arc(-s*0.12, -s*0.04, s*0.06, 0, Math.PI*2); ctx.fill();
    rRect(ctx, -s*0.12, -s*0.04, s*0.18, s*0.025, s*0.005); ctx.fill();
    ctx.fillStyle = c[1] || '#fbbf24'; ctx.beginPath(); ctx.arc(s*0.1, s*0.05, s*0.04, 0, Math.PI*2); ctx.fill();
    itemHighlight(ctx, -s*0.18, -s*0.08, s*0.08, s*0.03); } };

export const picture_frame: ItemDef = { id: 'picture_frame', name: 'Picture Frame', world: 'hallway', sizeTier: 5, baseValue: 14, weight: 3,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#92400e'; rRect(ctx, -s*0.32, -s*0.36, s*0.64, s*0.72, s*0.03); ctx.fill();
    ctx.fillStyle = '#dbeafe'; rRect(ctx, -s*0.26, -s*0.3, s*0.52, s*0.6, s*0.02); ctx.fill();
    ctx.fillStyle = c[2] || '#22c55e'; rRect(ctx, -s*0.26, s*0.0, s*0.52, s*0.3, 0); ctx.fill();
    ctx.fillStyle = c[0]; ctx.beginPath(); ctx.arc(s*0.05, -s*0.05, s*0.08, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = darken(c[1] || '#92400e', 0.4); ctx.lineWidth = s*0.018; rRect(ctx, -s*0.32, -s*0.36, s*0.64, s*0.72, s*0.03); ctx.stroke(); } };

export const shoe_tray: ItemDef = { id: 'shoe_tray', name: 'Shoe Tray', world: 'hallway', sizeTier: 5, baseValue: 13, weight: 4,
  draw(ctx, s, c) { ctx.fillStyle = c[2] || '#a1a1aa'; rRect(ctx, -s*0.4, -s*0.1, s*0.8, s*0.3, s*0.04); ctx.fill();
    ctx.fillStyle = darken(c[2] || '#a1a1aa', 0.2); rRect(ctx, -s*0.36, -s*0.06, s*0.72, s*0.22, s*0.02); ctx.fill();
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.ellipse(-s*0.18, s*0.05, s*0.13, s*0.07, -0.3, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(s*0.18, s*0.05, s*0.13, s*0.07, 0.3, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = darken(c[2] || '#a1a1aa', 0.3); ctx.lineWidth = s*0.015; rRect(ctx, -s*0.4, -s*0.1, s*0.8, s*0.3, s*0.04); ctx.stroke(); } };

// DRIVEWAY T5
export const tricycle: ItemDef = { id: 'tricycle', name: 'Tricycle', world: 'driveway', sizeTier: 5, baseValue: 16, weight: 6,
  draw(ctx, s, c) { ctx.strokeStyle = c[0]; ctx.lineWidth = s*0.04;
    ctx.beginPath(); ctx.arc(-s*0.25, s*0.18, s*0.15, 0, Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.arc(s*0.25, s*0.22, s*0.1, 0, Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s*0.25, s*0.18); ctx.lineTo(s*0.05, -s*0.15); ctx.lineTo(s*0.25, s*0.22); ctx.stroke();
    ctx.fillStyle = c[2] || '#facc15'; rRect(ctx, -s*0.05, -s*0.3, s*0.2, s*0.12, s*0.02); ctx.fill();
    ctx.fillStyle = c[1] || '#65a30d'; rRect(ctx, s*0.0, -s*0.05, s*0.05, s*0.2, s*0.01); ctx.fill();
    itemHighlight(ctx, -s*0.05, -s*0.25, s*0.04, s*0.04); } };

export const recycling_bin: ItemDef = { id: 'recycling_bin', name: 'Recycling Bin', world: 'driveway', sizeTier: 5, baseValue: 14, weight: 5,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#65a30d';
    ctx.beginPath(); ctx.moveTo(-s*0.28, -s*0.3); ctx.lineTo(s*0.28, -s*0.3); ctx.lineTo(s*0.24, s*0.35); ctx.lineTo(-s*0.24, s*0.35); ctx.closePath(); ctx.fill();
    ctx.fillStyle = darken(c[1] || '#65a30d', 0.3); rRect(ctx, -s*0.32, -s*0.35, s*0.64, s*0.08, s*0.02); ctx.fill();
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 3; i++) { const a = i*Math.PI*2/3; ctx.beginPath(); ctx.moveTo(Math.cos(a)*s*0.1, Math.sin(a)*s*0.1); ctx.lineTo(Math.cos(a+0.3)*s*0.18, Math.sin(a+0.3)*s*0.18); ctx.lineTo(Math.cos(a-0.3)*s*0.18, Math.sin(a-0.3)*s*0.18); ctx.closePath(); ctx.fill(); }
    itemHighlight(ctx, -s*0.15, -s*0.2, s*0.06, s*0.1); } };

export const garbage_can: ItemDef = { id: 'garbage_can', name: 'Garbage Can', world: 'driveway', sizeTier: 5, baseValue: 13, weight: 5,
  draw(ctx, s, c) { ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.moveTo(-s*0.28, -s*0.3); ctx.lineTo(s*0.28, -s*0.3); ctx.lineTo(s*0.24, s*0.35); ctx.lineTo(-s*0.24, s*0.35); ctx.closePath(); ctx.fill();
    ctx.fillStyle = darken(c[0], 0.3); rRect(ctx, -s*0.34, -s*0.35, s*0.68, s*0.08, s*0.02); ctx.fill();
    ctx.fillStyle = darken(c[0], 0.2);
    for (let i = 0; i < 4; i++) { ctx.fillRect(-s*0.26 + i*s*0.13, -s*0.2, s*0.04, s*0.5); }
    rRect(ctx, -s*0.05, -s*0.4, s*0.1, s*0.06, s*0.01); ctx.fill();
    itemHighlight(ctx, -s*0.15, -s*0.18, s*0.05, s*0.18); } };

export const hose_reel: ItemDef = { id: 'hose_reel', name: 'Hose Reel', world: 'driveway', sizeTier: 5, baseValue: 14, weight: 5,
  draw(ctx, s, c) { ctx.fillStyle = c[2] || '#facc15';
    ctx.beginPath(); ctx.arc(0, 0, s*0.32, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = c[1] || '#65a30d'; ctx.lineWidth = s*0.025;
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(0, 0, s*0.08 + i*s*0.05, 0, Math.PI*2); ctx.stroke(); }
    ctx.fillStyle = darken(c[2] || '#facc15', 0.3); ctx.beginPath(); ctx.arc(0, 0, s*0.05, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = c[1] || '#65a30d'; ctx.lineWidth = s*0.04; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(s*0.32, 0); ctx.bezierCurveTo(s*0.5, s*0.1, s*0.45, s*0.3, s*0.3, s*0.4); ctx.stroke(); } };

export const planter_box: ItemDef = { id: 'planter_box', name: 'Planter Box', world: 'driveway', sizeTier: 5, baseValue: 13, weight: 5,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; rRect(ctx, -s*0.36, -s*0.15, s*0.72, s*0.4, s*0.04); ctx.fill();
    ctx.fillStyle = '#92400e'; rRect(ctx, -s*0.32, -s*0.1, s*0.64, s*0.2, s*0.02); ctx.fill();
    ctx.fillStyle = c[1] || '#65a30d';
    for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.ellipse(i*s*0.14, -s*0.18, s*0.06, s*0.1, 0, 0, Math.PI*2); ctx.fill(); }
    ctx.fillStyle = c[2] || '#facc15';
    for (let i = -2; i <= 2; i+=2) { ctx.beginPath(); ctx.arc(i*s*0.14, -s*0.22, s*0.03, 0, Math.PI*2); ctx.fill(); }
    itemHighlight(ctx, -s*0.18, -s*0.08, s*0.1, s*0.04); } };

export const motion_light: ItemDef = { id: 'motion_light', name: 'Motion Light', world: 'driveway', sizeTier: 5, baseValue: 15, weight: 4,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; rRect(ctx, -s*0.04, -s*0.4, s*0.08, s*0.3, s*0.01); ctx.fill();
    ctx.fillStyle = darken(c[0], 0.2); rRect(ctx, -s*0.25, -s*0.15, s*0.5, s*0.25, s*0.04); ctx.fill();
    ctx.fillStyle = '#fef9c3'; rRect(ctx, -s*0.2, -s*0.1, s*0.4, s*0.18, s*0.03); ctx.fill();
    ctx.fillStyle = '#fde047'; ctx.globalAlpha = 0.4;
    ctx.beginPath(); ctx.moveTo(0, s*0.1); ctx.lineTo(-s*0.4, s*0.4); ctx.lineTo(s*0.4, s*0.4); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = c[2] || '#facc15'; ctx.beginPath(); ctx.arc(0, 0, s*0.04, 0, Math.PI*2); ctx.fill(); } };

export const garden_tool_rack: ItemDef = { id: 'garden_tool_rack', name: 'Tool Rack', world: 'driveway', sizeTier: 5, baseValue: 16, weight: 5,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#65a30d'; rRect(ctx, -s*0.35, s*0.2, s*0.7, s*0.06, s*0.02); ctx.fill();
    rRect(ctx, -s*0.35, -s*0.32, s*0.05, s*0.6, s*0.01); ctx.fill();
    rRect(ctx, s*0.3, -s*0.32, s*0.05, s*0.6, s*0.01); ctx.fill();
    ctx.strokeStyle = c[0]; ctx.lineWidth = s*0.04; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-s*0.18, -s*0.3); ctx.lineTo(-s*0.18, s*0.18); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -s*0.3); ctx.lineTo(0, s*0.18); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s*0.18, -s*0.3); ctx.lineTo(s*0.18, s*0.18); ctx.stroke();
    ctx.fillStyle = c[2] || '#facc15';
    rRect(ctx, -s*0.22, -s*0.34, s*0.08, s*0.06, s*0.01); ctx.fill();
    rRect(ctx, -s*0.04, -s*0.32, s*0.08, s*0.04, s*0.01); ctx.fill();
    rRect(ctx, s*0.14, -s*0.34, s*0.08, s*0.06, s*0.01); ctx.fill(); } };

export const mailbox_post: ItemDef = { id: 'mailbox_post', name: 'Mailbox Post', world: 'driveway', sizeTier: 5, baseValue: 14, weight: 5,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#65a30d'; rRect(ctx, -s*0.04, -s*0.05, s*0.08, s*0.45, s*0.01); ctx.fill();
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.moveTo(-s*0.22, -s*0.05); ctx.lineTo(s*0.22, -s*0.05); ctx.lineTo(s*0.22, -s*0.28); ctx.arc(0, -s*0.28, s*0.22, 0, Math.PI, true); ctx.lineTo(-s*0.22, -s*0.28); ctx.closePath(); ctx.fill();
    ctx.fillStyle = darken(c[0], 0.3); rRect(ctx, -s*0.06, -s*0.18, s*0.12, s*0.1, s*0.02); ctx.fill();
    ctx.fillStyle = c[2] || '#facc15'; rRect(ctx, s*0.22, -s*0.25, s*0.04, s*0.15, s*0.01); ctx.fill();
    itemHighlight(ctx, -s*0.12, -s*0.32, s*0.06, s*0.05); } };

export const decorative_rock: ItemDef = { id: 'decorative_rock', name: 'Decorative Rock', world: 'driveway', sizeTier: 5, baseValue: 11, weight: 6,
  draw(ctx, s, c) { ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.moveTo(-s*0.35, s*0.1); ctx.bezierCurveTo(-s*0.4, -s*0.1, -s*0.2, -s*0.32, s*0.05, -s*0.3); ctx.bezierCurveTo(s*0.3, -s*0.28, s*0.4, -s*0.05, s*0.35, s*0.15); ctx.bezierCurveTo(s*0.2, s*0.35, -s*0.2, s*0.32, -s*0.35, s*0.1); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = darken(c[0], 0.4); ctx.lineWidth = s*0.015;
    ctx.beginPath(); ctx.moveTo(-s*0.18, -s*0.1); ctx.lineTo(s*0.0, s*0.1); ctx.lineTo(s*0.18, -s*0.05); ctx.stroke();
    itemHighlight(ctx, -s*0.18, -s*0.18, s*0.1, s*0.04); } };

export const sprinkler_head: ItemDef = { id: 'sprinkler_head', name: 'Sprinkler', world: 'driveway', sizeTier: 5, baseValue: 13, weight: 4,
  draw(ctx, s, c) { ctx.fillStyle = c[2] || '#facc15'; ctx.beginPath(); ctx.arc(0, 0, s*0.18, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = darken(c[2] || '#facc15', 0.3); rRect(ctx, -s*0.04, s*0.1, s*0.08, s*0.3, s*0.01); ctx.fill();
    ctx.strokeStyle = '#67e8f9'; ctx.lineWidth = s*0.02;
    for (let i = 0; i < 5; i++) { const a = -Math.PI/2 + (i-2)*0.3; ctx.beginPath(); ctx.moveTo(Math.cos(a)*s*0.18, Math.sin(a)*s*0.18); ctx.lineTo(Math.cos(a)*s*0.4, Math.sin(a)*s*0.4); ctx.stroke(); }
    ctx.fillStyle = '#67e8f9';
    for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc((Math.random()-0.5)*s*0.5, (Math.random()-0.7)*s*0.4, s*0.018, 0, Math.PI*2); ctx.fill(); }
    itemHighlight(ctx, -s*0.08, -s*0.08, s*0.05, s*0.04); } };

// BUS STOP T5
export const bus_stop_sign: ItemDef = { id: 'bus_stop_sign', name: 'Bus Stop Sign', world: 'bus_stop', sizeTier: 5, baseValue: 14, weight: 4,
  draw(ctx, s, c) { ctx.fillStyle = c[2] || '#3b82f6'; rRect(ctx, -s*0.04, s*0.0, s*0.08, s*0.4, s*0.01); ctx.fill();
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.arc(0, -s*0.2, s*0.22, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${s*0.16}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('BUS', 0, -s*0.2);
    ctx.strokeStyle = darken(c[0], 0.3); ctx.lineWidth = s*0.02;
    ctx.beginPath(); ctx.arc(0, -s*0.2, s*0.22, 0, Math.PI*2); ctx.stroke();
    itemHighlight(ctx, -s*0.1, -s*0.28, s*0.06, s*0.04); } };

export const bus_bench: ItemDef = { id: 'bus_bench', name: 'Bus Bench', world: 'bus_stop', sizeTier: 5, baseValue: 16, weight: 7,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#ef4444'; rRect(ctx, -s*0.4, -s*0.15, s*0.8, s*0.12, s*0.02); ctx.fill();
    rRect(ctx, -s*0.4, -s*0.3, s*0.8, s*0.08, s*0.02); ctx.fill();
    ctx.fillStyle = darken(c[1] || '#ef4444', 0.3);
    rRect(ctx, -s*0.36, -s*0.03, s*0.04, s*0.4, s*0.01); ctx.fill();
    rRect(ctx, s*0.32, -s*0.03, s*0.04, s*0.4, s*0.01); ctx.fill();
    rRect(ctx, -s*0.04, -s*0.03, s*0.04, s*0.4, s*0.01); ctx.fill();
    itemHighlight(ctx, -s*0.18, -s*0.25, s*0.1, s*0.03); } };

export const ticket_machine: ItemDef = { id: 'ticket_machine', name: 'Ticket Machine', world: 'bus_stop', sizeTier: 5, baseValue: 17, weight: 6,
  draw(ctx, s, c) { ctx.fillStyle = c[2] || '#3b82f6'; rRect(ctx, -s*0.22, -s*0.4, s*0.44, s*0.8, s*0.04); ctx.fill();
    ctx.fillStyle = '#0f172a'; rRect(ctx, -s*0.18, -s*0.32, s*0.36, s*0.2, s*0.02); ctx.fill();
    ctx.fillStyle = c[0]; ctx.font = `bold ${s*0.1}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('$2.50', 0, -s*0.22);
    ctx.fillStyle = darken(c[2] || '#3b82f6', 0.3);
    for (let r = 0; r < 3; r++) { for (let i = 0; i < 3; i++) { rRect(ctx, -s*0.15 + i*s*0.1, -s*0.05 + r*s*0.08, s*0.08, s*0.06, s*0.01); ctx.fill(); } }
    ctx.fillStyle = c[0]; rRect(ctx, -s*0.15, s*0.2, s*0.3, s*0.1, s*0.01); ctx.fill();
    itemHighlight(ctx, -s*0.13, -s*0.28, s*0.06, s*0.04); } };

export const bike_rack_bs: ItemDef = { id: 'bike_rack_bs', name: 'Bike Rack', world: 'bus_stop', sizeTier: 5, baseValue: 13, weight: 5,
  draw(ctx, s, c) { ctx.strokeStyle = c[2] || '#3b82f6'; ctx.lineWidth = s*0.04; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-s*0.4, s*0.3); ctx.lineTo(-s*0.4, s*0.0); ctx.lineTo(-s*0.25, -s*0.15); ctx.lineTo(-s*0.1, s*0.0); ctx.lineTo(s*0.1, s*0.0); ctx.lineTo(s*0.25, -s*0.15); ctx.lineTo(s*0.4, s*0.0); ctx.lineTo(s*0.4, s*0.3); ctx.stroke();
    ctx.fillStyle = darken(c[2] || '#3b82f6', 0.3);
    rRect(ctx, -s*0.42, s*0.28, s*0.04, s*0.08, s*0.01); ctx.fill();
    rRect(ctx, s*0.38, s*0.28, s*0.04, s*0.08, s*0.01); ctx.fill(); } };

export const recycling_station: ItemDef = { id: 'recycling_station', name: 'Recycling Station', world: 'bus_stop', sizeTier: 5, baseValue: 15, weight: 6,
  draw(ctx, s, c) { for (let i = 0; i < 3; i++) { const cols = ['#3b82f6', '#22c55e', '#facc15']; ctx.fillStyle = cols[i];
    rRect(ctx, -s*0.42 + i*s*0.28, -s*0.2, s*0.22, s*0.5, s*0.03); ctx.fill();
    ctx.fillStyle = darken(cols[i], 0.3); rRect(ctx, -s*0.42 + i*s*0.28, -s*0.25, s*0.22, s*0.06, s*0.02); ctx.fill();
    ctx.fillStyle = '#1e293b'; rRect(ctx, -s*0.36 + i*s*0.28, -s*0.05, s*0.1, s*0.04, s*0.01); ctx.fill(); }
    itemHighlight(ctx, -s*0.3, -s*0.15, s*0.05, s*0.06); } };

export const ad_poster: ItemDef = { id: 'ad_poster', name: 'Ad Poster', world: 'bus_stop', sizeTier: 5, baseValue: 12, weight: 3,
  draw(ctx, s, c) { ctx.fillStyle = c[2] || '#3b82f6'; rRect(ctx, -s*0.32, -s*0.4, s*0.64, s*0.8, s*0.02); ctx.fill();
    ctx.fillStyle = c[1] || '#ef4444'; rRect(ctx, -s*0.28, -s*0.36, s*0.56, s*0.4, s*0.02); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.font = `bold ${s*0.14}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('SALE!', 0, -s*0.16);
    ctx.fillStyle = c[0]; ctx.font = `bold ${s*0.08}px sans-serif`;
    ctx.fillText('50% OFF', 0, s*0.14);
    ctx.fillText('TODAY', 0, s*0.26); } };

export const bus_shelter_pillar: ItemDef = { id: 'bus_shelter_pillar', name: 'Shelter Pillar', world: 'bus_stop', sizeTier: 5, baseValue: 14, weight: 6,
  draw(ctx, s, c) { ctx.fillStyle = c[2] || '#3b82f6'; rRect(ctx, -s*0.1, -s*0.4, s*0.2, s*0.78, s*0.02); ctx.fill();
    ctx.fillStyle = darken(c[2] || '#3b82f6', 0.3); rRect(ctx, -s*0.14, s*0.36, s*0.28, s*0.06, s*0.02); ctx.fill();
    rRect(ctx, -s*0.18, -s*0.42, s*0.36, s*0.06, s*0.02); ctx.fill();
    ctx.fillStyle = '#dbeafe'; rRect(ctx, -s*0.07, -s*0.3, s*0.14, s*0.4, s*0.01); ctx.fill();
    itemHighlight(ctx, -s*0.06, -s*0.2, s*0.04, s*0.2); } };

export const lamp_post_bs: ItemDef = { id: 'lamp_post_bs', name: 'Lamp Post', world: 'bus_stop', sizeTier: 5, baseValue: 14, weight: 4,
  draw(ctx, s, c) { ctx.fillStyle = c[2] || '#3b82f6'; rRect(ctx, -s*0.04, -s*0.1, s*0.08, s*0.5, s*0.01); ctx.fill();
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.moveTo(-s*0.15, -s*0.1); ctx.lineTo(s*0.15, -s*0.1); ctx.lineTo(s*0.1, -s*0.32); ctx.lineTo(-s*0.1, -s*0.32); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fef9c3'; rRect(ctx, -s*0.08, -s*0.32, s*0.16, s*0.04, s*0.01); ctx.fill();
    ctx.fillStyle = '#fde047'; ctx.globalAlpha = 0.3;
    ctx.beginPath(); ctx.arc(0, -s*0.2, s*0.18, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = darken(c[2] || '#3b82f6', 0.3); rRect(ctx, -s*0.08, s*0.36, s*0.16, s*0.04, s*0.01); ctx.fill(); } };

export const traffic_sign_bs: ItemDef = { id: 'traffic_sign_bs', name: 'Traffic Sign', world: 'bus_stop', sizeTier: 5, baseValue: 13, weight: 4,
  draw(ctx, s, c) { ctx.fillStyle = c[2] || '#3b82f6'; rRect(ctx, -s*0.04, s*0.0, s*0.08, s*0.4, s*0.01); ctx.fill();
    ctx.fillStyle = c[1] || '#ef4444';
    ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = i*Math.PI/4 + Math.PI/8; const px = Math.cos(a)*s*0.25, py = Math.sin(a)*s*0.25 - s*0.15; if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); } ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.font = `bold ${s*0.14}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('STOP', 0, -s*0.15);
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = s*0.02;
    ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = i*Math.PI/4 + Math.PI/8; const px = Math.cos(a)*s*0.21, py = Math.sin(a)*s*0.21 - s*0.15; if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); } ctx.closePath(); ctx.stroke(); } };

export const water_fountain_bs: ItemDef = { id: 'water_fountain_bs', name: 'Water Fountain', world: 'bus_stop', sizeTier: 5, baseValue: 13, weight: 5,
  draw(ctx, s, c) { ctx.fillStyle = c[2] || '#3b82f6'; rRect(ctx, -s*0.25, -s*0.05, s*0.5, s*0.4, s*0.04); ctx.fill();
    ctx.fillStyle = darken(c[2] || '#3b82f6', 0.3); rRect(ctx, -s*0.22, -s*0.1, s*0.44, s*0.06, s*0.02); ctx.fill();
    ctx.fillStyle = '#dbeafe'; ctx.beginPath(); ctx.ellipse(0, -s*0.04, s*0.16, s*0.05, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#67e8f9';
    ctx.beginPath(); ctx.arc(0, -s*0.15, s*0.04, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, -s*0.21, s*0.025, s*0.06, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#a3a3a3'; rRect(ctx, -s*0.04, -s*0.16, s*0.08, s*0.12, s*0.01); ctx.fill();
    itemHighlight(ctx, -s*0.12, s*0.05, s*0.05, s*0.04); } };

// SKATEPARK T6
export const skate_ramp: ItemDef = { id: 'skate_ramp', name: 'Skate Ramp', world: 'skatepark', sizeTier: 6, baseValue: 18, weight: 7,
  draw(ctx, s, c) { ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.moveTo(-s*0.4, s*0.3); ctx.lineTo(s*0.4, s*0.3); ctx.lineTo(s*0.4, -s*0.1); ctx.bezierCurveTo(s*0.2, -s*0.1, -s*0.1, s*0.05, -s*0.4, s*0.3); ctx.closePath(); ctx.fill();
    ctx.fillStyle = darken(c[0], 0.3);
    ctx.beginPath(); ctx.moveTo(s*0.4, -s*0.1); ctx.lineTo(s*0.4, s*0.3); ctx.lineTo(s*0.36, s*0.3); ctx.lineTo(s*0.36, -s*0.1); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = c[2] || '#22c55e'; ctx.lineWidth = s*0.03;
    ctx.beginPath(); ctx.moveTo(-s*0.4, s*0.3); ctx.bezierCurveTo(-s*0.1, s*0.05, s*0.2, -s*0.1, s*0.4, -s*0.1); ctx.stroke();
    itemHighlight(ctx, -s*0.1, s*0.1, s*0.1, s*0.04); } };

export const half_pipe_section: ItemDef = { id: 'half_pipe_section', name: 'Half-pipe', world: 'skatepark', sizeTier: 6, baseValue: 20, weight: 8,
  draw(ctx, s, c) { ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.moveTo(-s*0.4, -s*0.3); ctx.lineTo(-s*0.4, s*0.2); ctx.bezierCurveTo(-s*0.4, s*0.4, s*0.4, s*0.4, s*0.4, s*0.2); ctx.lineTo(s*0.4, -s*0.3); ctx.lineTo(s*0.3, -s*0.3); ctx.lineTo(s*0.3, s*0.2); ctx.bezierCurveTo(s*0.3, s*0.32, -s*0.3, s*0.32, -s*0.3, s*0.2); ctx.lineTo(-s*0.3, -s*0.3); ctx.closePath(); ctx.fill();
    ctx.fillStyle = darken(c[0], 0.3);
    ctx.beginPath(); ctx.moveTo(-s*0.3, s*0.2); ctx.bezierCurveTo(-s*0.3, s*0.32, s*0.3, s*0.32, s*0.3, s*0.2); ctx.lineTo(s*0.3, s*0.15); ctx.bezierCurveTo(s*0.3, s*0.27, -s*0.3, s*0.27, -s*0.3, s*0.15); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = c[1] || '#f472b6'; ctx.lineWidth = s*0.02;
    ctx.beginPath(); ctx.moveTo(-s*0.4, -s*0.3); ctx.lineTo(s*0.4, -s*0.3); ctx.stroke(); } };

export const bowl_rim: ItemDef = { id: 'bowl_rim', name: 'Skate Bowl', world: 'skatepark', sizeTier: 6, baseValue: 22, weight: 8,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.ellipse(0, 0, s*0.4, s*0.3, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = darken(c[0], 0.4); ctx.beginPath(); ctx.ellipse(0, s*0.02, s*0.32, s*0.22, 0, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = c[1] || '#f472b6'; ctx.lineWidth = s*0.025;
    ctx.beginPath(); ctx.ellipse(0, 0, s*0.4, s*0.3, 0, 0, Math.PI*2); ctx.stroke();
    ctx.fillStyle = c[2] || '#22c55e'; ctx.font = `bold ${s*0.1}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('SKATE', 0, s*0.04); } };

export const grind_rail: ItemDef = { id: 'grind_rail', name: 'Grind Rail', world: 'skatepark', sizeTier: 6, baseValue: 17, weight: 6,
  draw(ctx, s, c) { ctx.fillStyle = c[2] || '#22c55e';
    rRect(ctx, -s*0.4, -s*0.04, s*0.8, s*0.08, s*0.02); ctx.fill();
    ctx.fillStyle = darken(c[2] || '#22c55e', 0.4);
    rRect(ctx, -s*0.36, s*0.04, s*0.04, s*0.32, s*0.01); ctx.fill();
    rRect(ctx, s*0.32, s*0.04, s*0.04, s*0.32, s*0.01); ctx.fill();
    rRect(ctx, -s*0.02, s*0.04, s*0.04, s*0.32, s*0.01); ctx.fill();
    itemHighlight(ctx, -s*0.2, -s*0.02, s*0.15, s*0.02); } };

export const skate_helmet: ItemDef = { id: 'skate_helmet', name: 'Skate Helmet', world: 'skatepark', sizeTier: 6, baseValue: 19, weight: 5,
  draw(ctx, s, c) { ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.arc(0, 0, s*0.3, Math.PI*1.1, Math.PI*1.9, false); ctx.lineTo(s*0.3, s*0.1); ctx.lineTo(-s*0.3, s*0.1); ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[1] || '#f472b6';
    ctx.fillRect(-s*0.05, -s*0.3, s*0.1, s*0.4);
    ctx.fillStyle = darken(c[0], 0.3); rRect(ctx, -s*0.32, s*0.08, s*0.64, s*0.05, s*0.01); ctx.fill();
    for (let i = 0; i < 3; i++) { ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.arc(-s*0.18 + i*s*0.18, -s*0.1, s*0.03, 0, Math.PI*2); ctx.fill(); }
    itemHighlight(ctx, -s*0.18, -s*0.2, s*0.12, s*0.05); } };

export const knee_pad: ItemDef = { id: 'knee_pad', name: 'Knee Pad', world: 'skatepark', sizeTier: 6, baseValue: 16, weight: 4,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; rRect(ctx, -s*0.25, -s*0.3, s*0.5, s*0.6, s*0.08); ctx.fill();
    ctx.fillStyle = darken(c[0], 0.3); ctx.beginPath(); ctx.arc(0, 0, s*0.18, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[1] || '#f472b6'; rRect(ctx, -s*0.28, -s*0.32, s*0.56, s*0.08, s*0.02); ctx.fill();
    rRect(ctx, -s*0.28, s*0.24, s*0.56, s*0.08, s*0.02); ctx.fill();
    itemHighlight(ctx, -s*0.1, -s*0.18, s*0.06, s*0.05); } };

export const trick_board: ItemDef = { id: 'trick_board', name: 'Trick Board', world: 'skatepark', sizeTier: 6, baseValue: 21, weight: 6,
  draw(ctx, s, c) { ctx.fillStyle = c[0];
    rRect(ctx, -s*0.4, -s*0.08, s*0.8, s*0.16, s*0.06); ctx.fill();
    ctx.fillStyle = c[1] || '#f472b6';
    rRect(ctx, -s*0.35, -s*0.06, s*0.7, s*0.12, s*0.04); ctx.fill();
    ctx.fillStyle = c[2] || '#22c55e'; ctx.font = `bold ${s*0.1}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('FLIP', 0, 0);
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath(); ctx.arc(-s*0.25, s*0.16, s*0.06, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.25, s*0.16, s*0.06, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath(); ctx.arc(-s*0.25, s*0.16, s*0.025, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.25, s*0.16, s*0.025, 0, Math.PI*2); ctx.fill(); } };

export const skate_vending: ItemDef = { id: 'skate_vending', name: 'Skate Vending', world: 'skatepark', sizeTier: 6, baseValue: 20, weight: 8,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; rRect(ctx, -s*0.3, -s*0.4, s*0.6, s*0.8, s*0.04); ctx.fill();
    ctx.fillStyle = '#0f172a'; rRect(ctx, -s*0.26, -s*0.36, s*0.52, s*0.5, s*0.02); ctx.fill();
    ctx.fillStyle = c[2] || '#22c55e';
    for (let r = 0; r < 3; r++) { for (let i = 0; i < 3; i++) { rRect(ctx, -s*0.22 + i*s*0.16, -s*0.32 + r*s*0.16, s*0.12, s*0.12, s*0.02); ctx.fill(); ctx.fillStyle = i % 2 ? c[1] || '#f472b6' : c[2] || '#22c55e'; } }
    ctx.fillStyle = darken(c[0], 0.3); rRect(ctx, -s*0.22, s*0.18, s*0.44, s*0.16, s*0.02); ctx.fill();
    ctx.fillStyle = c[1] || '#f472b6'; ctx.font = `bold ${s*0.08}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('GEAR', 0, s*0.26);
    itemHighlight(ctx, -s*0.18, -s*0.32, s*0.06, s*0.4); } };

export const skate_bench: ItemDef = { id: 'skate_bench', name: 'Concrete Bench', world: 'skatepark', sizeTier: 6, baseValue: 18, weight: 7,
  draw(ctx, s, c) { ctx.fillStyle = c[2] || '#22c55e'; rRect(ctx, -s*0.4, -s*0.1, s*0.8, s*0.16, s*0.02); ctx.fill();
    ctx.fillStyle = darken(c[2] || '#22c55e', 0.3);
    rRect(ctx, -s*0.36, s*0.06, s*0.06, s*0.3, s*0.01); ctx.fill();
    rRect(ctx, s*0.3, s*0.06, s*0.06, s*0.3, s*0.01); ctx.fill();
    ctx.strokeStyle = c[1] || '#f472b6'; ctx.lineWidth = s*0.02;
    ctx.beginPath(); ctx.moveTo(-s*0.35, -s*0.06); ctx.lineTo(s*0.35, -s*0.06); ctx.stroke();
    itemHighlight(ctx, -s*0.18, -s*0.08, s*0.12, s*0.03); } };

export const energy_drink_crate: ItemDef = { id: 'energy_drink_crate', name: 'Energy Crate', world: 'skatepark', sizeTier: 6, baseValue: 19, weight: 7,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; rRect(ctx, -s*0.32, -s*0.25, s*0.64, s*0.5, s*0.03); ctx.fill();
    ctx.fillStyle = darken(c[0], 0.3); rRect(ctx, -s*0.32, s*0.2, s*0.64, s*0.05, s*0.02); ctx.fill();
    for (let i = 0; i < 4; i++) { ctx.fillStyle = i % 2 ? c[1] || '#f472b6' : c[2] || '#22c55e';
      rRect(ctx, -s*0.28 + i*s*0.14, -s*0.2, s*0.12, s*0.4, s*0.02); ctx.fill();
      ctx.fillStyle = '#ffffff'; ctx.fillRect(-s*0.26 + i*s*0.14, -s*0.05, s*0.08, s*0.04); }
    itemHighlight(ctx, -s*0.18, -s*0.18, s*0.06, s*0.1); } };

// TRAIN YARD T7
export const rail_car: ItemDef = { id: 'rail_car', name: 'Rail Car', world: 'train_yard', sizeTier: 7, baseValue: 28, weight: 9,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#dc2626'; rRect(ctx, -s*0.42, -s*0.2, s*0.84, s*0.32, s*0.02); ctx.fill();
    ctx.fillStyle = darken(c[1] || '#dc2626', 0.3);
    for (let i = 0; i < 3; i++) { rRect(ctx, -s*0.32 + i*s*0.22, -s*0.15, s*0.18, s*0.22, s*0.02); ctx.fill(); ctx.fillStyle = '#dbeafe'; rRect(ctx, -s*0.3 + i*s*0.22, -s*0.12, s*0.14, s*0.16, s*0.01); ctx.fill(); ctx.fillStyle = darken(c[1] || '#dc2626', 0.3); }
    ctx.fillStyle = c[0]; ctx.beginPath(); ctx.arc(-s*0.25, s*0.18, s*0.08, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.25, s*0.18, s*0.08, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = darken(c[0], 0.4);
    ctx.beginPath(); ctx.arc(-s*0.25, s*0.18, s*0.04, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.25, s*0.18, s*0.04, 0, Math.PI*2); ctx.fill();
    itemHighlight(ctx, -s*0.2, -s*0.15, s*0.1, s*0.04); } };

export const locomotive: ItemDef = { id: 'locomotive', name: 'Locomotive', world: 'train_yard', sizeTier: 7, baseValue: 32, weight: 10,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#dc2626'; rRect(ctx, -s*0.42, -s*0.05, s*0.7, s*0.25, s*0.02); ctx.fill();
    rRect(ctx, -s*0.42, -s*0.25, s*0.4, s*0.25, s*0.02); ctx.fill();
    ctx.fillStyle = '#dbeafe'; rRect(ctx, -s*0.38, -s*0.22, s*0.34, s*0.18, s*0.01); ctx.fill();
    ctx.fillStyle = c[0]; rRect(ctx, s*0.05, -s*0.18, s*0.1, s*0.18, s*0.01); ctx.fill();
    ctx.fillStyle = '#1e293b';
    ctx.beginPath(); ctx.arc(-s*0.3, s*0.22, s*0.08, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(-s*0.05, s*0.22, s*0.08, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.2, s*0.22, s*0.08, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = darken(c[2] || '#f59e0b', 0.2); ctx.beginPath(); ctx.arc(s*0.32, -s*0.05, s*0.06, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[2] || '#f59e0b'; ctx.beginPath(); ctx.arc(s*0.32, -s*0.05, s*0.04, 0, Math.PI*2); ctx.fill();
    itemHighlight(ctx, -s*0.3, -s*0.18, s*0.1, s*0.04); } };

export const signal_lamp: ItemDef = { id: 'signal_lamp', name: 'Signal Lamp', world: 'train_yard', sizeTier: 7, baseValue: 24, weight: 6,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; rRect(ctx, -s*0.04, -s*0.2, s*0.08, s*0.55, s*0.01); ctx.fill();
    ctx.fillStyle = darken(c[0], 0.3); rRect(ctx, -s*0.18, -s*0.4, s*0.36, s*0.25, s*0.04); ctx.fill();
    ctx.fillStyle = '#dc2626'; ctx.beginPath(); ctx.arc(0, -s*0.34, s*0.07, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#facc15'; ctx.beginPath(); ctx.arc(0, -s*0.22, s*0.07, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#22c55e'; ctx.beginPath(); ctx.arc(0, -s*0.1, s*0.05, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fde047'; ctx.globalAlpha = 0.4; ctx.beginPath(); ctx.arc(0, -s*0.22, s*0.13, 0, Math.PI*2); ctx.fill(); ctx.globalAlpha = 1;
    itemHighlight(ctx, -s*0.09, -s*0.36, s*0.04, s*0.03); } };

export const freight_container: ItemDef = { id: 'freight_container', name: 'Freight Container', world: 'train_yard', sizeTier: 7, baseValue: 26, weight: 9,
  draw(ctx, s, c) { ctx.fillStyle = c[2] || '#f59e0b'; rRect(ctx, -s*0.42, -s*0.25, s*0.84, s*0.5, s*0.02); ctx.fill();
    ctx.fillStyle = darken(c[2] || '#f59e0b', 0.3);
    for (let i = -3; i <= 3; i++) { ctx.fillRect(i*s*0.12, -s*0.25, s*0.02, s*0.5); }
    rRect(ctx, -s*0.42, -s*0.27, s*0.84, s*0.04, s*0.01); ctx.fill();
    rRect(ctx, -s*0.42, s*0.23, s*0.84, s*0.04, s*0.01); ctx.fill();
    ctx.fillStyle = c[0]; ctx.font = `bold ${s*0.1}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('FRGHT', 0, 0);
    ctx.fillStyle = darken(c[2] || '#f59e0b', 0.5);
    rRect(ctx, s*0.3, -s*0.05, s*0.04, s*0.08, s*0.005); ctx.fill();
    itemHighlight(ctx, -s*0.3, -s*0.2, s*0.15, s*0.04); } };

export const coupling: ItemDef = { id: 'coupling', name: 'Coupling', world: 'train_yard', sizeTier: 7, baseValue: 22, weight: 7,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; rRect(ctx, -s*0.4, -s*0.08, s*0.3, s*0.16, s*0.02); ctx.fill();
    rRect(ctx, s*0.1, -s*0.08, s*0.3, s*0.16, s*0.02); ctx.fill();
    ctx.fillStyle = darken(c[0], 0.4); ctx.beginPath(); ctx.arc(-s*0.05, 0, s*0.12, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.05, 0, s*0.12, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[1] || '#dc2626'; ctx.beginPath(); ctx.arc(-s*0.05, 0, s*0.06, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.05, 0, s*0.06, 0, Math.PI*2); ctx.fill();
    itemHighlight(ctx, -s*0.3, -s*0.05, s*0.1, s*0.03); } };

export const water_tower: ItemDef = { id: 'water_tower', name: 'Water Tower', world: 'train_yard', sizeTier: 7, baseValue: 30, weight: 9,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; rRect(ctx, -s*0.25, -s*0.3, s*0.5, s*0.4, s*0.04); ctx.fill();
    ctx.fillStyle = darken(c[0], 0.3); rRect(ctx, -s*0.28, -s*0.34, s*0.56, s*0.08, s*0.02); ctx.fill();
    ctx.strokeStyle = c[2] || '#f59e0b'; ctx.lineWidth = s*0.03;
    ctx.beginPath(); ctx.moveTo(-s*0.2, s*0.1); ctx.lineTo(-s*0.32, s*0.4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s*0.2, s*0.1); ctx.lineTo(s*0.32, s*0.4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s*0.32, s*0.4); ctx.lineTo(s*0.32, s*0.4); ctx.stroke();
    ctx.fillStyle = c[1] || '#dc2626'; ctx.font = `bold ${s*0.08}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('H₂O', 0, -s*0.1);
    itemHighlight(ctx, -s*0.15, -s*0.25, s*0.08, s*0.04); } };

export const freight_crate: ItemDef = { id: 'freight_crate', name: 'Freight Crate', world: 'train_yard', sizeTier: 7, baseValue: 23, weight: 7,
  draw(ctx, s, c) { ctx.fillStyle = '#92400e'; rRect(ctx, -s*0.32, -s*0.25, s*0.64, s*0.5, s*0.02); ctx.fill();
    ctx.strokeStyle = darken('#92400e', 0.4); ctx.lineWidth = s*0.025;
    rRect(ctx, -s*0.32, -s*0.25, s*0.64, s*0.5, s*0.02); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s*0.32, -s*0.05); ctx.lineTo(s*0.32, -s*0.05); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -s*0.25); ctx.lineTo(0, s*0.25); ctx.stroke();
    ctx.fillStyle = c[2] || '#f59e0b'; ctx.font = `bold ${s*0.09}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('CARGO', 0, -s*0.15);
    ctx.fillStyle = c[1] || '#dc2626'; rRect(ctx, -s*0.04, s*0.08, s*0.08, s*0.06, s*0.01); ctx.fill();
    itemHighlight(ctx, -s*0.18, -s*0.18, s*0.1, s*0.03); } };

export const gantry_base: ItemDef = { id: 'gantry_base', name: 'Gantry Base', world: 'train_yard', sizeTier: 7, baseValue: 27, weight: 9,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; rRect(ctx, -s*0.4, s*0.25, s*0.16, s*0.15, s*0.02); ctx.fill();
    rRect(ctx, s*0.24, s*0.25, s*0.16, s*0.15, s*0.02); ctx.fill();
    ctx.strokeStyle = c[0]; ctx.lineWidth = s*0.04;
    ctx.beginPath(); ctx.moveTo(-s*0.3, s*0.25); ctx.lineTo(-s*0.3, -s*0.3); ctx.lineTo(s*0.3, -s*0.3); ctx.lineTo(s*0.3, s*0.25); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s*0.3, -s*0.15); ctx.lineTo(s*0.3, -s*0.15); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s*0.3, -s*0.3); ctx.lineTo(s*0.3, -s*0.15); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s*0.3, -s*0.3); ctx.lineTo(-s*0.3, -s*0.15); ctx.stroke();
    ctx.fillStyle = c[1] || '#dc2626'; rRect(ctx, -s*0.05, -s*0.32, s*0.1, s*0.08, s*0.02); ctx.fill(); } };

export const fuel_tank: ItemDef = { id: 'fuel_tank', name: 'Fuel Tank', world: 'train_yard', sizeTier: 7, baseValue: 25, weight: 8,
  draw(ctx, s, c) { ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.ellipse(0, 0, s*0.4, s*0.2, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = darken(c[0], 0.3); ctx.beginPath(); ctx.ellipse(s*0.35, 0, s*0.06, s*0.18, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[1] || '#dc2626'; rRect(ctx, -s*0.34, s*0.18, s*0.04, s*0.18, s*0.01); ctx.fill();
    rRect(ctx, s*0.3, s*0.18, s*0.04, s*0.18, s*0.01); ctx.fill();
    ctx.fillStyle = c[2] || '#f59e0b'; ctx.font = `bold ${s*0.09}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('FUEL', 0, 0);
    ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(-s*0.25, -s*0.12, s*0.04, 0, Math.PI*2); ctx.fill();
    itemHighlight(ctx, -s*0.2, -s*0.12, s*0.12, s*0.04); } };

export const switching_lever: ItemDef = { id: 'switching_lever', name: 'Switching Lever', world: 'train_yard', sizeTier: 7, baseValue: 22, weight: 6,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; rRect(ctx, -s*0.18, s*0.15, s*0.36, s*0.18, s*0.02); ctx.fill();
    ctx.strokeStyle = c[0]; ctx.lineWidth = s*0.04; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, s*0.2); ctx.lineTo(s*0.2, -s*0.3); ctx.stroke();
    ctx.fillStyle = c[1] || '#dc2626'; ctx.beginPath(); ctx.arc(s*0.2, -s*0.3, s*0.07, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = darken(c[0], 0.4); ctx.beginPath(); ctx.arc(0, s*0.22, s*0.05, 0, Math.PI*2); ctx.fill();
    itemHighlight(ctx, -s*0.05, s*0.18, s*0.05, s*0.03); } };

// CLOUD KINGDOM T7
export const cloud_puff: ItemDef = { id: 'cloud_puff', name: 'Cloud Puff', world: 'cloud_kingdom', sizeTier: 7, baseValue: 22, weight: 5,
  draw(ctx, s, c) { ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(-s*0.18, s*0.05, s*0.18, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, -s*0.1, s*0.22, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.2, s*0.0, s*0.2, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.05, s*0.15, s*0.16, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.arc(-s*0.05, -s*0.06, s*0.025, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.07, -s*0.04, s*0.025, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[2] || '#f9a8d4';
    ctx.beginPath(); ctx.arc(-s*0.06, s*0.05, s*0.04, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.08, s*0.05, s*0.04, 0, Math.PI*2); ctx.fill(); } };

export const sky_castle: ItemDef = { id: 'sky_castle', name: 'Sky Castle', world: 'cloud_kingdom', sizeTier: 7, baseValue: 32, weight: 9,
  draw(ctx, s, c) { ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, s*0.35, s*0.3, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[0]; rRect(ctx, -s*0.25, -s*0.1, s*0.5, s*0.4, s*0.02); ctx.fill();
    rRect(ctx, -s*0.3, -s*0.18, s*0.12, s*0.08, s*0.01); ctx.fill();
    rRect(ctx, -s*0.06, -s*0.18, s*0.12, s*0.08, s*0.01); ctx.fill();
    rRect(ctx, s*0.18, -s*0.18, s*0.12, s*0.08, s*0.01); ctx.fill();
    ctx.fillStyle = c[1] || '#fbbf24';
    ctx.beginPath(); ctx.moveTo(-s*0.3, -s*0.18); ctx.lineTo(-s*0.24, -s*0.32); ctx.lineTo(-s*0.18, -s*0.18); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-s*0.06, -s*0.18); ctx.lineTo(0, -s*0.32); ctx.lineTo(s*0.06, -s*0.18); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(s*0.18, -s*0.18); ctx.lineTo(s*0.24, -s*0.32); ctx.lineTo(s*0.3, -s*0.18); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#0f172a'; rRect(ctx, -s*0.05, s*0.1, s*0.1, s*0.2, s*0.04); ctx.fill();
    itemHighlight(ctx, -s*0.18, s*0.0, s*0.08, s*0.05); } };

export const hot_air_balloon: ItemDef = { id: 'hot_air_balloon', name: 'Hot Air Balloon', world: 'cloud_kingdom', sizeTier: 7, baseValue: 28, weight: 7,
  draw(ctx, s, c) { ctx.fillStyle = c[2] || '#f9a8d4';
    ctx.beginPath(); ctx.arc(0, -s*0.05, s*0.3, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[1] || '#fbbf24';
    for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(i*s*0.15, -s*0.3); ctx.bezierCurveTo(i*s*0.15, -s*0.05, i*s*0.15, s*0.05, i*s*0.15, s*0.05); ctx.stroke(); }
    ctx.strokeStyle = c[0]; ctx.lineWidth = s*0.012;
    ctx.beginPath(); ctx.moveTo(-s*0.18, s*0.16); ctx.lineTo(-s*0.1, s*0.32); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s*0.18, s*0.16); ctx.lineTo(s*0.1, s*0.32); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, s*0.22); ctx.lineTo(0, s*0.32); ctx.stroke();
    ctx.fillStyle = '#92400e'; rRect(ctx, -s*0.13, s*0.32, s*0.26, s*0.12, s*0.02); ctx.fill();
    itemHighlight(ctx, -s*0.15, -s*0.18, s*0.1, s*0.06); } };

export const weather_vane: ItemDef = { id: 'weather_vane', name: 'Weather Vane', world: 'cloud_kingdom', sizeTier: 7, baseValue: 24, weight: 6,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#fbbf24'; rRect(ctx, -s*0.04, -s*0.05, s*0.08, s*0.4, s*0.01); ctx.fill();
    ctx.strokeStyle = c[1] || '#fbbf24'; ctx.lineWidth = s*0.04; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-s*0.25, -s*0.05); ctx.lineTo(s*0.25, -s*0.05); ctx.moveTo(0, -s*0.3); ctx.lineTo(0, s*0.2); ctx.stroke();
    ctx.fillStyle = darken(c[1] || '#fbbf24', 0.3);
    ctx.font = `bold ${s*0.08}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('N', 0, -s*0.36); ctx.fillText('S', 0, s*0.26); ctx.fillText('E', s*0.32, -s*0.05); ctx.fillText('W', -s*0.32, -s*0.05);
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.moveTo(0, -s*0.22); ctx.lineTo(s*0.18, -s*0.05); ctx.lineTo(0, s*0.05); ctx.lineTo(-s*0.18, -s*0.05); ctx.closePath(); ctx.fill(); } };

export const lightning_bolt: ItemDef = { id: 'lightning_bolt', name: 'Lightning Bolt', world: 'cloud_kingdom', sizeTier: 7, baseValue: 26, weight: 6,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#fbbf24';
    ctx.beginPath(); ctx.moveTo(s*0.05, -s*0.4); ctx.lineTo(-s*0.18, s*0.05); ctx.lineTo(-s*0.02, s*0.05); ctx.lineTo(-s*0.1, s*0.4); ctx.lineTo(s*0.18, -s*0.05); ctx.lineTo(s*0.02, -s*0.05); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = darken(c[1] || '#fbbf24', 0.3); ctx.lineWidth = s*0.02;
    ctx.beginPath(); ctx.moveTo(s*0.05, -s*0.4); ctx.lineTo(-s*0.18, s*0.05); ctx.lineTo(-s*0.02, s*0.05); ctx.lineTo(-s*0.1, s*0.4); ctx.lineTo(s*0.18, -s*0.05); ctx.lineTo(s*0.02, -s*0.05); ctx.closePath(); ctx.stroke();
    ctx.fillStyle = '#fef9c3'; ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.arc(0, 0, s*0.32, 0, Math.PI*2); ctx.fill(); ctx.globalAlpha = 1;
    itemHighlight(ctx, -s*0.05, -s*0.2, s*0.04, s*0.1); } };

export const rainbow_arc: ItemDef = { id: 'rainbow_arc', name: 'Rainbow Arc', world: 'cloud_kingdom', sizeTier: 7, baseValue: 25, weight: 6,
  draw(ctx, s, c) { const cols = ['#dc2626', '#f59e0b', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7'];
    ctx.lineWidth = s*0.05;
    for (let i = 0; i < cols.length; i++) { ctx.strokeStyle = cols[i]; ctx.beginPath(); ctx.arc(0, s*0.25, s*0.4 - i*s*0.05, Math.PI, Math.PI*2); ctx.stroke(); }
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(-s*0.4, s*0.25, s*0.1, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.4, s*0.25, s*0.1, 0, Math.PI*2); ctx.fill(); } };

export const wind_chime: ItemDef = { id: 'wind_chime', name: 'Wind Chime', world: 'cloud_kingdom', sizeTier: 7, baseValue: 23, weight: 5,
  draw(ctx, s, c) { ctx.fillStyle = '#92400e';
    ctx.beginPath(); ctx.ellipse(0, -s*0.3, s*0.18, s*0.06, 0, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = c[0]; ctx.lineWidth = s*0.012;
    for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i*s*0.07, -s*0.28); ctx.lineTo(i*s*0.07, s*0.0); ctx.stroke(); }
    ctx.fillStyle = c[1] || '#fbbf24';
    for (let i = -2; i <= 2; i++) { rRect(ctx, i*s*0.07 - s*0.025, s*0.0, s*0.05, s*0.2 - Math.abs(i)*s*0.025, s*0.01); ctx.fill(); }
    ctx.fillStyle = c[2] || '#f9a8d4'; ctx.beginPath(); ctx.arc(0, s*0.3, s*0.04, 0, Math.PI*2); ctx.fill();
    itemHighlight(ctx, -s*0.1, -s*0.32, s*0.06, s*0.02); } };

export const sky_beacon: ItemDef = { id: 'sky_beacon', name: 'Sky Beacon', world: 'cloud_kingdom', sizeTier: 7, baseValue: 27, weight: 7,
  draw(ctx, s, c) { ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.moveTo(-s*0.18, s*0.35); ctx.lineTo(s*0.18, s*0.35); ctx.lineTo(s*0.1, -s*0.2); ctx.lineTo(-s*0.1, -s*0.2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = darken(c[0], 0.3); rRect(ctx, -s*0.12, -s*0.22, s*0.24, s*0.06, s*0.02); ctx.fill();
    ctx.fillStyle = c[1] || '#fbbf24'; rRect(ctx, -s*0.1, -s*0.34, s*0.2, s*0.14, s*0.03); ctx.fill();
    ctx.fillStyle = '#fef9c3'; ctx.globalAlpha = 0.6;
    ctx.beginPath(); ctx.moveTo(0, -s*0.27); ctx.lineTo(s*0.4, -s*0.4); ctx.lineTo(s*0.4, -s*0.15); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(0, -s*0.27); ctx.lineTo(-s*0.4, -s*0.4); ctx.lineTo(-s*0.4, -s*0.15); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
    itemHighlight(ctx, -s*0.06, -s*0.3, s*0.05, s*0.05); } };

export const comet_tail: ItemDef = { id: 'comet_tail', name: 'Comet Tail', world: 'cloud_kingdom', sizeTier: 7, baseValue: 24, weight: 5,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#fbbf24';
    ctx.beginPath(); ctx.arc(s*0.25, -s*0.25, s*0.1, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fef9c3'; ctx.globalAlpha = 0.7; ctx.beginPath(); ctx.arc(s*0.25, -s*0.25, s*0.16, 0, Math.PI*2); ctx.fill(); ctx.globalAlpha = 1;
    ctx.strokeStyle = c[2] || '#f9a8d4'; ctx.lineWidth = s*0.03; ctx.lineCap = 'round';
    for (let i = 0; i < 6; i++) { ctx.globalAlpha = 1 - i*0.15;
      ctx.beginPath(); ctx.moveTo(s*0.18 - i*s*0.06, -s*0.18 + i*s*0.06); ctx.lineTo(s*0.05 - i*s*0.06, -s*0.05 + i*s*0.06); ctx.stroke(); }
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(s*0.27, -s*0.28, s*0.03, 0, Math.PI*2); ctx.fill(); } };

export const cloud_throne: ItemDef = { id: 'cloud_throne', name: 'Cloud Throne', world: 'cloud_kingdom', sizeTier: 7, baseValue: 32, weight: 9,
  draw(ctx, s, c) { ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, s*0.2, s*0.35, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[1] || '#fbbf24';
    rRect(ctx, -s*0.22, -s*0.05, s*0.44, s*0.3, s*0.04); ctx.fill();
    rRect(ctx, -s*0.22, -s*0.32, s*0.44, s*0.3, s*0.04); ctx.fill();
    ctx.fillStyle = darken(c[1] || '#fbbf24', 0.3);
    rRect(ctx, -s*0.26, -s*0.32, s*0.05, s*0.6, s*0.02); ctx.fill();
    rRect(ctx, s*0.21, -s*0.32, s*0.05, s*0.6, s*0.02); ctx.fill();
    ctx.fillStyle = c[2] || '#f9a8d4';
    for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i*s*0.08, -s*0.32); ctx.lineTo(i*s*0.08 + s*0.04, -s*0.4); ctx.lineTo(i*s*0.08 + s*0.08, -s*0.32); ctx.closePath(); ctx.fill(); }
    itemHighlight(ctx, -s*0.15, -s*0.25, s*0.1, s*0.04); } };

// GLACIER T8
export const ice_block: ItemDef = { id: 'ice_block', name: 'Ice Block', world: 'glacier', sizeTier: 8, baseValue: 35, weight: 9,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#a5f3fc';
    ctx.beginPath(); ctx.moveTo(-s*0.32, -s*0.3); ctx.lineTo(s*0.3, -s*0.32); ctx.lineTo(s*0.36, s*0.32); ctx.lineTo(-s*0.34, s*0.34); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.moveTo(-s*0.32, -s*0.3); ctx.lineTo(-s*0.05, -s*0.05); ctx.lineTo(-s*0.34, s*0.34); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = darken(c[1] || '#a5f3fc', 0.3); ctx.lineWidth = s*0.02;
    ctx.beginPath(); ctx.moveTo(-s*0.32, -s*0.3); ctx.lineTo(s*0.3, -s*0.32); ctx.lineTo(s*0.36, s*0.32); ctx.lineTo(-s*0.34, s*0.34); ctx.closePath(); ctx.stroke();
    itemHighlight(ctx, -s*0.18, -s*0.18, s*0.1, s*0.06); } };

export const glacial_peak: ItemDef = { id: 'glacial_peak', name: 'Glacial Peak', world: 'glacier', sizeTier: 8, baseValue: 38, weight: 10,
  draw(ctx, s, c) { ctx.fillStyle = c[2] || '#cbd5e1';
    ctx.beginPath(); ctx.moveTo(-s*0.4, s*0.4); ctx.lineTo(-s*0.1, -s*0.3); ctx.lineTo(s*0.05, s*0.0); ctx.lineTo(s*0.2, -s*0.4); ctx.lineTo(s*0.4, s*0.4); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.moveTo(-s*0.1, -s*0.3); ctx.lineTo(-s*0.18, -s*0.05); ctx.lineTo(s*0.05, s*0.0); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(s*0.2, -s*0.4); ctx.lineTo(s*0.12, -s*0.15); ctx.lineTo(s*0.28, -s*0.15); ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[1] || '#a5f3fc'; ctx.globalAlpha = 0.6;
    ctx.beginPath(); ctx.moveTo(s*0.05, s*0.0); ctx.lineTo(s*0.15, s*0.4); ctx.lineTo(-s*0.1, s*0.4); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
    itemHighlight(ctx, -s*0.15, -s*0.2, s*0.06, s*0.08); } };

export const frozen_mammoth: ItemDef = { id: 'frozen_mammoth', name: 'Frozen Mammoth', world: 'glacier', sizeTier: 8, baseValue: 45, weight: 11,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#a5f3fc'; ctx.globalAlpha = 0.6;
    rRect(ctx, -s*0.4, -s*0.32, s*0.8, s*0.64, s*0.05); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#92400e';
    ctx.beginPath(); ctx.ellipse(0, s*0.05, s*0.3, s*0.16, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(-s*0.22, -s*0.05, s*0.13, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = darken('#92400e', 0.3);
    ctx.beginPath(); ctx.moveTo(-s*0.3, s*0.0); ctx.bezierCurveTo(-s*0.4, s*0.05, -s*0.42, s*0.25, -s*0.34, s*0.18); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fef9c3';
    ctx.beginPath(); ctx.moveTo(-s*0.28, -s*0.08); ctx.bezierCurveTo(-s*0.38, -s*0.04, -s*0.36, s*0.1, -s*0.3, s*0.06); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.arc(-s*0.27, -s*0.1, s*0.02, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#92400e';
    rRect(ctx, -s*0.18, s*0.18, s*0.05, s*0.14, s*0.01); ctx.fill();
    rRect(ctx, s*0.13, s*0.18, s*0.05, s*0.14, s*0.01); ctx.fill();
    itemHighlight(ctx, -s*0.2, -s*0.22, s*0.1, s*0.04); } };

export const igloo: ItemDef = { id: 'igloo', name: 'Igloo', world: 'glacier', sizeTier: 8, baseValue: 36, weight: 9,
  draw(ctx, s, c) { ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, s*0.1, s*0.35, Math.PI, Math.PI*2); ctx.fill();
    rRect(ctx, -s*0.35, s*0.1, s*0.7, s*0.05, 0); ctx.fill();
    ctx.strokeStyle = c[2] || '#cbd5e1'; ctx.lineWidth = s*0.018;
    for (let r = 0; r < 4; r++) { ctx.beginPath(); ctx.arc(0, s*0.1, s*0.35 - r*s*0.075, Math.PI, Math.PI*2); ctx.stroke(); }
    for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(i*s*0.1, s*0.1); ctx.lineTo(i*s*0.1, s*0.1 - Math.sqrt(Math.max(0, 0.1225 - (i*0.1)**2))*s); ctx.stroke(); }
    ctx.fillStyle = '#0f172a';
    ctx.beginPath(); ctx.arc(0, s*0.1, s*0.1, Math.PI, Math.PI*2); ctx.fill();
    rRect(ctx, -s*0.1, s*0.05, s*0.2, s*0.06, 0); ctx.fill();
    itemHighlight(ctx, -s*0.18, -s*0.05, s*0.06, s*0.04); } };

export const polar_pole: ItemDef = { id: 'polar_pole', name: 'Polar Pole', world: 'glacier', sizeTier: 8, baseValue: 33, weight: 8,
  draw(ctx, s, c) { for (let i = 0; i < 6; i++) { ctx.fillStyle = i % 2 ? '#dc2626' : '#ffffff';
    rRect(ctx, -s*0.05, -s*0.4 + i*s*0.13, s*0.1, s*0.13, s*0.01); ctx.fill(); }
    ctx.fillStyle = c[2] || '#cbd5e1'; ctx.beginPath(); ctx.arc(0, -s*0.4, s*0.08, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[0]; ctx.beginPath(); ctx.arc(0, -s*0.4, s*0.05, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 5; i++) { const a = i*Math.PI*2/5 - Math.PI/2;
      ctx.beginPath(); ctx.moveTo(Math.cos(a)*s*0.16, Math.sin(a)*s*0.16 - s*0.4); ctx.lineTo(Math.cos(a+0.4)*s*0.06, Math.sin(a+0.4)*s*0.06 - s*0.4); ctx.lineTo(Math.cos(a-0.4)*s*0.06, Math.sin(a-0.4)*s*0.06 - s*0.4); ctx.closePath(); ctx.fill(); }
    itemHighlight(ctx, -s*0.03, s*0.0, s*0.02, s*0.05); } };

export const ice_spire: ItemDef = { id: 'ice_spire', name: 'Ice Spire', world: 'glacier', sizeTier: 8, baseValue: 34, weight: 8,
  draw(ctx, s, c) { ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.moveTo(-s*0.18, s*0.4); ctx.lineTo(s*0.0, -s*0.4); ctx.lineTo(s*0.18, s*0.4); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.6;
    ctx.beginPath(); ctx.moveTo(-s*0.18, s*0.4); ctx.lineTo(s*0.0, -s*0.4); ctx.lineTo(-s*0.05, s*0.4); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = c[1] || '#a5f3fc';
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc((Math.random()-0.5)*s*0.2, -s*0.3 + i*s*0.16, s*0.025, 0, Math.PI*2); ctx.fill(); }
    itemHighlight(ctx, -s*0.04, -s*0.2, s*0.03, s*0.2); } };

export const frozen_lake: ItemDef = { id: 'frozen_lake', name: 'Frozen Lake', world: 'glacier', sizeTier: 8, baseValue: 32, weight: 8,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#a5f3fc';
    ctx.beginPath(); ctx.ellipse(0, 0, s*0.4, s*0.25, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.7;
    ctx.beginPath(); ctx.ellipse(-s*0.1, -s*0.05, s*0.32, s*0.18, 0, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = c[0]; ctx.lineWidth = s*0.012;
    ctx.beginPath(); ctx.moveTo(-s*0.3, -s*0.05); ctx.lineTo(s*0.1, s*0.1); ctx.lineTo(s*0.25, -s*0.1); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s*0.0, -s*0.18); ctx.lineTo(s*0.1, s*0.1); ctx.stroke();
    itemHighlight(ctx, -s*0.18, -s*0.1, s*0.12, s*0.05); } };

export const ice_cave: ItemDef = { id: 'ice_cave', name: 'Ice Cave', world: 'glacier', sizeTier: 8, baseValue: 38, weight: 10,
  draw(ctx, s, c) { ctx.fillStyle = c[2] || '#cbd5e1';
    rRect(ctx, -s*0.4, -s*0.3, s*0.8, s*0.65, s*0.06); ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath(); ctx.moveTo(-s*0.22, s*0.35); ctx.lineTo(-s*0.22, -s*0.05); ctx.bezierCurveTo(-s*0.22, -s*0.18, s*0.22, -s*0.18, s*0.22, -s*0.05); ctx.lineTo(s*0.22, s*0.35); ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[1] || '#a5f3fc';
    for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i*s*0.08, -s*0.05); ctx.lineTo(i*s*0.08 - s*0.025, s*0.1); ctx.lineTo(i*s*0.08 + s*0.025, s*0.1); ctx.closePath(); ctx.fill(); }
    itemHighlight(ctx, -s*0.2, -s*0.22, s*0.15, s*0.05); } };

export const snow_drift: ItemDef = { id: 'snow_drift', name: 'Snow Drift', world: 'glacier', sizeTier: 8, baseValue: 30, weight: 7,
  draw(ctx, s, c) { ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-s*0.4, s*0.3);
    ctx.bezierCurveTo(-s*0.35, s*0.0, -s*0.15, -s*0.1, s*0.0, -s*0.05);
    ctx.bezierCurveTo(s*0.15, s*0.0, s*0.3, -s*0.2, s*0.4, s*0.05);
    ctx.lineTo(s*0.4, s*0.35);
    ctx.lineTo(-s*0.4, s*0.35);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[1] || '#a5f3fc'; ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.moveTo(-s*0.4, s*0.3); ctx.bezierCurveTo(-s*0.35, s*0.05, -s*0.15, -s*0.05, s*0.0, s*0.0); ctx.bezierCurveTo(s*0.15, s*0.05, s*0.3, -s*0.15, s*0.4, s*0.1);
    ctx.lineTo(s*0.4, s*0.05); ctx.bezierCurveTo(s*0.3, -s*0.2, s*0.15, s*0.0, s*0.0, -s*0.05); ctx.bezierCurveTo(-s*0.15, -s*0.1, -s*0.35, s*0.0, -s*0.4, s*0.3); ctx.closePath();
    ctx.fill(); ctx.globalAlpha = 1;
    for (let i = 0; i < 6; i++) { ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc((Math.random()-0.5)*s*0.7, (Math.random()-0.7)*s*0.4, s*0.02, 0, Math.PI*2); ctx.fill(); } } };

export const frozen_geyser: ItemDef = { id: 'frozen_geyser', name: 'Frozen Geyser', world: 'glacier', sizeTier: 8, baseValue: 40, weight: 9,
  draw(ctx, s, c) { ctx.fillStyle = c[2] || '#cbd5e1'; rRect(ctx, -s*0.18, s*0.0, s*0.36, s*0.4, s*0.04); ctx.fill();
    ctx.fillStyle = c[1] || '#a5f3fc';
    ctx.beginPath();
    ctx.moveTo(-s*0.15, s*0.0); ctx.lineTo(-s*0.05, -s*0.2); ctx.lineTo(-s*0.18, -s*0.4); ctx.lineTo(s*0.0, -s*0.3); ctx.lineTo(s*0.15, -s*0.4); ctx.lineTo(s*0.05, -s*0.2); ctx.lineTo(s*0.15, s*0.0);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.moveTo(-s*0.1, -s*0.05); ctx.lineTo(-s*0.02, -s*0.2); ctx.lineTo(s*0.08, -s*0.05);
    ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = darken(c[2] || '#cbd5e1', 0.3); ctx.lineWidth = s*0.018; rRect(ctx, -s*0.18, s*0.0, s*0.36, s*0.4, s*0.04); ctx.stroke();
    itemHighlight(ctx, -s*0.06, -s*0.3, s*0.04, s*0.12); } };

// DESERT DUNES T8
export const sand_dune: ItemDef = { id: 'sand_dune', name: 'Sand Dune', world: 'desert_dunes', sizeTier: 8, baseValue: 32, weight: 8,
  draw(ctx, s, c) { ctx.fillStyle = c[0];
    ctx.beginPath();
    ctx.moveTo(-s*0.4, s*0.35);
    ctx.bezierCurveTo(-s*0.3, s*0.1, -s*0.05, -s*0.2, s*0.15, -s*0.05);
    ctx.bezierCurveTo(s*0.3, s*0.1, s*0.35, s*0.25, s*0.4, s*0.35);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = darken(c[0], 0.2); ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.moveTo(s*0.15, -s*0.05); ctx.bezierCurveTo(s*0.3, s*0.1, s*0.35, s*0.25, s*0.4, s*0.35);
    ctx.lineTo(s*0.15, s*0.35); ctx.closePath();
    ctx.fill(); ctx.globalAlpha = 1;
    ctx.strokeStyle = c[1] || '#fbbf24'; ctx.lineWidth = s*0.012;
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-s*0.3 + i*s*0.2, s*0.2); ctx.bezierCurveTo(-s*0.25 + i*s*0.2, s*0.18, -s*0.2 + i*s*0.2, s*0.22, -s*0.15 + i*s*0.2, s*0.2); ctx.stroke(); }
    itemHighlight(ctx, s*0.1, -s*0.0, s*0.08, s*0.04); } };

export const giant_cactus: ItemDef = { id: 'giant_cactus', name: 'Giant Cactus', world: 'desert_dunes', sizeTier: 8, baseValue: 35, weight: 9,
  draw(ctx, s, c) { ctx.fillStyle = '#22c55e';
    rRect(ctx, -s*0.1, -s*0.4, s*0.2, s*0.8, s*0.08); ctx.fill();
    rRect(ctx, -s*0.3, -s*0.1, s*0.12, s*0.3, s*0.05); ctx.fill();
    rRect(ctx, -s*0.3, -s*0.18, s*0.05, s*0.15, s*0.02); ctx.fill();
    rRect(ctx, s*0.18, -s*0.2, s*0.12, s*0.35, s*0.05); ctx.fill();
    rRect(ctx, s*0.25, -s*0.3, s*0.05, s*0.18, s*0.02); ctx.fill();
    ctx.strokeStyle = darken('#22c55e', 0.3); ctx.lineWidth = s*0.012;
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-s*0.05, -s*0.35 + i*s*0.2); ctx.lineTo(-s*0.05, -s*0.32 + i*s*0.2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(s*0.05, -s*0.35 + i*s*0.2); ctx.lineTo(s*0.05, -s*0.32 + i*s*0.2); ctx.stroke(); }
    ctx.fillStyle = c[2] || '#9a3412'; ctx.beginPath(); ctx.arc(s*0.0, -s*0.42, s*0.04, 0, Math.PI*2); ctx.fill();
    itemHighlight(ctx, -s*0.05, -s*0.3, s*0.03, s*0.5); } };

export const oasis: ItemDef = { id: 'oasis', name: 'Oasis', world: 'desert_dunes', sizeTier: 8, baseValue: 38, weight: 10,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.ellipse(0, s*0.1, s*0.4, s*0.3, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#3b82f6'; ctx.beginPath(); ctx.ellipse(0, s*0.1, s*0.28, s*0.18, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#67e8f9'; ctx.globalAlpha = 0.6;
    ctx.beginPath(); ctx.ellipse(-s*0.05, s*0.05, s*0.18, s*0.09, 0, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#92400e'; rRect(ctx, -s*0.32, -s*0.3, s*0.05, s*0.4, s*0.01); ctx.fill();
    rRect(ctx, s*0.27, -s*0.3, s*0.05, s*0.4, s*0.01); ctx.fill();
    ctx.fillStyle = '#22c55e';
    ctx.beginPath(); ctx.ellipse(-s*0.3, -s*0.32, s*0.16, s*0.07, -0.4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(s*0.3, -s*0.32, s*0.16, s*0.07, 0.4, 0, Math.PI*2); ctx.fill();
    itemHighlight(ctx, -s*0.05, s*0.05, s*0.08, s*0.04); } };

export const pyramid: ItemDef = { id: 'pyramid', name: 'Pyramid', world: 'desert_dunes', sizeTier: 8, baseValue: 42, weight: 11,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#fbbf24';
    ctx.beginPath(); ctx.moveTo(-s*0.4, s*0.35); ctx.lineTo(0, -s*0.35); ctx.lineTo(s*0.4, s*0.35); ctx.closePath(); ctx.fill();
    ctx.fillStyle = darken(c[1] || '#fbbf24', 0.3);
    ctx.beginPath(); ctx.moveTo(0, -s*0.35); ctx.lineTo(s*0.4, s*0.35); ctx.lineTo(s*0.0, s*0.35); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = darken(c[1] || '#fbbf24', 0.4); ctx.lineWidth = s*0.012;
    for (let i = 1; i < 6; i++) { const t = i/6;
      ctx.beginPath(); ctx.moveTo(-s*0.4 + t*s*0.4, s*0.35 - t*s*0.7); ctx.lineTo(s*0.4 - t*s*0.4, s*0.35 - t*s*0.7); ctx.stroke(); }
    ctx.fillStyle = '#0f172a'; rRect(ctx, -s*0.04, s*0.18, s*0.08, s*0.17, 0); ctx.fill();
    itemHighlight(ctx, -s*0.18, s*0.05, s*0.06, s*0.1); } };

export const sphinx: ItemDef = { id: 'sphinx', name: 'Sphinx', world: 'desert_dunes', sizeTier: 8, baseValue: 44, weight: 11,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#fbbf24';
    rRect(ctx, -s*0.4, s*0.0, s*0.8, s*0.35, s*0.04); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.25, -s*0.1, s*0.18, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = darken(c[1] || '#fbbf24', 0.3);
    rRect(ctx, s*0.05, -s*0.22, s*0.4, s*0.12, s*0.02); ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath(); ctx.arc(s*0.32, -s*0.12, s*0.02, 0, Math.PI*2); ctx.fill();
    rRect(ctx, s*0.34, -s*0.06, s*0.06, s*0.02, 0); ctx.fill();
    ctx.fillStyle = c[2] || '#9a3412';
    rRect(ctx, -s*0.38, s*0.3, s*0.06, s*0.1, s*0.01); ctx.fill();
    rRect(ctx, -s*0.22, s*0.3, s*0.06, s*0.1, s*0.01); ctx.fill();
    itemHighlight(ctx, -s*0.2, s*0.05, s*0.1, s*0.04); } };

export const giant_scorpion: ItemDef = { id: 'giant_scorpion', name: 'Giant Scorpion', world: 'desert_dunes', sizeTier: 8, baseValue: 36, weight: 8,
  draw(ctx, s, c) { ctx.fillStyle = c[2] || '#9a3412';
    ctx.beginPath(); ctx.ellipse(0, s*0.05, s*0.22, s*0.13, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(-s*0.25, s*0.0, s*0.1, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-s*0.32, -s*0.05); ctx.lineTo(-s*0.42, -s*0.15); ctx.lineTo(-s*0.36, -s*0.18); ctx.lineTo(-s*0.28, -s*0.05); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-s*0.32, s*0.05); ctx.lineTo(-s*0.42, s*0.15); ctx.lineTo(-s*0.36, s*0.18); ctx.lineTo(-s*0.28, s*0.05); ctx.closePath(); ctx.fill();
    for (let i = 0; i < 4; i++) { ctx.strokeStyle = c[2] || '#9a3412'; ctx.lineWidth = s*0.025;
      ctx.beginPath(); ctx.moveTo(-s*0.1 + i*s*0.08, s*0.1); ctx.lineTo(-s*0.15 + i*s*0.08, s*0.25); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-s*0.1 + i*s*0.08, -s*0.05); ctx.lineTo(-s*0.15 + i*s*0.08, -s*0.2); ctx.stroke(); }
    ctx.fillStyle = c[2] || '#9a3412';
    ctx.beginPath(); ctx.moveTo(s*0.2, s*0.05); ctx.bezierCurveTo(s*0.4, -s*0.1, s*0.4, -s*0.3, s*0.25, -s*0.32); ctx.bezierCurveTo(s*0.32, -s*0.18, s*0.3, -s*0.05, s*0.2, s*0.0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = darken(c[2] || '#9a3412', 0.5);
    ctx.beginPath(); ctx.moveTo(s*0.25, -s*0.32); ctx.lineTo(s*0.18, -s*0.4); ctx.lineTo(s*0.3, -s*0.36); ctx.closePath(); ctx.fill(); } };

export const camel: ItemDef = { id: 'camel', name: 'Camel', world: 'desert_dunes', sizeTier: 8, baseValue: 35, weight: 8,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#fbbf24';
    ctx.beginPath(); ctx.ellipse(0, s*0.05, s*0.3, s*0.13, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(-s*0.15, -s*0.1, s*0.1, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.13, -s*0.1, s*0.1, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(-s*0.32, -s*0.05, s*0.07, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-s*0.38, -s*0.05); ctx.lineTo(-s*0.42, -s*0.15); ctx.lineTo(-s*0.32, -s*0.05); ctx.closePath(); ctx.fill();
    rRect(ctx, -s*0.18, s*0.16, s*0.05, s*0.18, s*0.01); ctx.fill();
    rRect(ctx, s*0.13, s*0.16, s*0.05, s*0.18, s*0.01); ctx.fill();
    ctx.fillStyle = darken(c[1] || '#fbbf24', 0.3);
    ctx.beginPath(); ctx.arc(-s*0.32, -s*0.04, s*0.025, 0, Math.PI*2); ctx.fill();
    itemHighlight(ctx, -s*0.18, -s*0.18, s*0.1, s*0.04); } };

export const ancient_ruin: ItemDef = { id: 'ancient_ruin', name: 'Ancient Ruin', world: 'desert_dunes', sizeTier: 8, baseValue: 36, weight: 9,
  draw(ctx, s, c) { ctx.fillStyle = c[2] || '#9a3412';
    rRect(ctx, -s*0.32, s*0.15, s*0.64, s*0.2, s*0.02); ctx.fill();
    rRect(ctx, -s*0.32, -s*0.32, s*0.1, s*0.5, s*0.02); ctx.fill();
    rRect(ctx, -s*0.05, -s*0.22, s*0.1, s*0.4, s*0.02); ctx.fill();
    rRect(ctx, s*0.22, -s*0.36, s*0.1, s*0.55, s*0.02); ctx.fill();
    ctx.fillStyle = darken(c[2] || '#9a3412', 0.3);
    rRect(ctx, -s*0.34, -s*0.36, s*0.14, s*0.06, s*0.02); ctx.fill();
    rRect(ctx, s*0.2, -s*0.4, s*0.14, s*0.06, s*0.02); ctx.fill();
    ctx.fillStyle = c[1] || '#fbbf24';
    for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.arc(i*s*0.18, s*0.32, s*0.025, 0, Math.PI*2); ctx.fill(); }
    itemHighlight(ctx, -s*0.18, s*0.18, s*0.1, s*0.04); } };

export const sandstone_arch: ItemDef = { id: 'sandstone_arch', name: 'Sandstone Arch', world: 'desert_dunes', sizeTier: 8, baseValue: 37, weight: 10,
  draw(ctx, s, c) { ctx.fillStyle = c[2] || '#9a3412';
    ctx.beginPath();
    ctx.moveTo(-s*0.4, s*0.35);
    ctx.lineTo(-s*0.4, -s*0.2);
    ctx.bezierCurveTo(-s*0.4, -s*0.4, s*0.4, -s*0.4, s*0.4, -s*0.2);
    ctx.lineTo(s*0.4, s*0.35);
    ctx.lineTo(s*0.22, s*0.35);
    ctx.lineTo(s*0.22, -s*0.15);
    ctx.bezierCurveTo(s*0.22, -s*0.3, -s*0.22, -s*0.3, -s*0.22, -s*0.15);
    ctx.lineTo(-s*0.22, s*0.35);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = darken(c[2] || '#9a3412', 0.3);
    ctx.beginPath(); ctx.arc(-s*0.4, -s*0.2, s*0.18, Math.PI/2, Math.PI); ctx.lineTo(-s*0.4, s*0.35); ctx.closePath(); ctx.fill();
    itemHighlight(ctx, -s*0.05, -s*0.32, s*0.1, s*0.04); } };

export const mirage_tent: ItemDef = { id: 'mirage_tent', name: 'Mirage Tent', world: 'desert_dunes', sizeTier: 8, baseValue: 33, weight: 8,
  draw(ctx, s, c) { ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.moveTo(-s*0.4, s*0.35); ctx.lineTo(0, -s*0.35); ctx.lineTo(s*0.4, s*0.35); ctx.closePath(); ctx.fill();
    ctx.fillStyle = darken(c[0], 0.3);
    ctx.beginPath(); ctx.moveTo(0, -s*0.35); ctx.lineTo(s*0.4, s*0.35); ctx.lineTo(s*0.0, s*0.35); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath(); ctx.moveTo(-s*0.1, s*0.35); ctx.lineTo(0, s*0.05); ctx.lineTo(s*0.1, s*0.35); ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[1] || '#fbbf24';
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(-s*0.3 + i*s*0.2, -s*0.1 + i*0.04*s, s*0.025, 0, Math.PI*2); ctx.fill(); }
    ctx.strokeStyle = c[2] || '#9a3412'; ctx.lineWidth = s*0.012;
    ctx.beginPath(); ctx.moveTo(0, -s*0.35); ctx.lineTo(0, -s*0.4); ctx.stroke();
    ctx.fillStyle = c[2] || '#9a3412'; rRect(ctx, -s*0.025, -s*0.42, s*0.05, s*0.08, 0); ctx.fill();
    itemHighlight(ctx, -s*0.18, -s*0.05, s*0.08, s*0.04); } };

// MOUNTAIN RANGE T8
export const mountain_peak: ItemDef = { id: 'mountain_peak', name: 'Mountain Peak', world: 'mountain_range', sizeTier: 8, baseValue: 38, weight: 10,
  draw(ctx, s, c) { ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.moveTo(-s*0.4, s*0.4); ctx.lineTo(0, -s*0.4); ctx.lineTo(s*0.4, s*0.4); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.moveTo(-s*0.18, -s*0.0); ctx.lineTo(0, -s*0.4); ctx.lineTo(s*0.18, -s*0.0); ctx.lineTo(s*0.05, -s*0.05); ctx.lineTo(0, -s*0.18); ctx.lineTo(-s*0.05, -s*0.05); ctx.closePath(); ctx.fill();
    ctx.fillStyle = darken(c[0], 0.4);
    ctx.beginPath(); ctx.moveTo(0, -s*0.4); ctx.lineTo(s*0.4, s*0.4); ctx.lineTo(s*0.1, s*0.4); ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[2] || '#22c55e';
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-s*0.3 + i*s*0.18, s*0.35); ctx.lineTo(-s*0.32 + i*s*0.18, s*0.4); ctx.lineTo(-s*0.28 + i*s*0.18, s*0.4); ctx.closePath(); ctx.fill(); }
    itemHighlight(ctx, -s*0.1, -s*0.2, s*0.05, s*0.1); } };

export const avalanche: ItemDef = { id: 'avalanche', name: 'Avalanche', world: 'mountain_range', sizeTier: 8, baseValue: 36, weight: 9,
  draw(ctx, s, c) { ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.moveTo(-s*0.4, -s*0.3); ctx.lineTo(s*0.4, s*0.3); ctx.lineTo(-s*0.4, s*0.4); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 12; i++) { const r = s*0.08 + Math.random()*s*0.08;
      ctx.beginPath(); ctx.arc(-s*0.3 + Math.random()*s*0.6, s*0.0 + Math.random()*s*0.3, r, 0, Math.PI*2); ctx.fill(); }
    ctx.fillStyle = c[1] || '#a3a3a3'; ctx.globalAlpha = 0.6;
    for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.arc(-s*0.3 + Math.random()*s*0.55, s*0.05 + Math.random()*s*0.25, s*0.04, 0, Math.PI*2); ctx.fill(); }
    ctx.globalAlpha = 1;
    itemHighlight(ctx, -s*0.18, s*0.05, s*0.06, s*0.04); } };

export const ski_lodge: ItemDef = { id: 'ski_lodge', name: 'Ski Lodge', world: 'mountain_range', sizeTier: 8, baseValue: 40, weight: 10,
  draw(ctx, s, c) { ctx.fillStyle = '#92400e';
    rRect(ctx, -s*0.32, -s*0.05, s*0.64, s*0.4, s*0.02); ctx.fill();
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.moveTo(-s*0.36, -s*0.05); ctx.lineTo(0, -s*0.32); ctx.lineTo(s*0.36, -s*0.05); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.moveTo(-s*0.36, -s*0.05); ctx.lineTo(0, -s*0.32); ctx.lineTo(s*0.36, -s*0.05); ctx.lineTo(s*0.3, -s*0.05); ctx.lineTo(0, -s*0.27); ctx.lineTo(-s*0.3, -s*0.05); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fbbf24';
    rRect(ctx, -s*0.22, s*0.05, s*0.1, s*0.12, s*0.01); ctx.fill();
    rRect(ctx, s*0.12, s*0.05, s*0.1, s*0.12, s*0.01); ctx.fill();
    ctx.fillStyle = '#0f172a';
    rRect(ctx, -s*0.06, s*0.1, s*0.12, s*0.25, s*0.01); ctx.fill();
    ctx.strokeStyle = '#92400e'; ctx.lineWidth = s*0.02;
    ctx.beginPath(); ctx.moveTo(-s*0.06, s*0.22); ctx.lineTo(s*0.06, s*0.22); ctx.stroke();
    itemHighlight(ctx, -s*0.18, -s*0.18, s*0.08, s*0.04); } };

export const giant_eagle: ItemDef = { id: 'giant_eagle', name: 'Giant Eagle', world: 'mountain_range', sizeTier: 8, baseValue: 42, weight: 9,
  draw(ctx, s, c) { ctx.fillStyle = '#92400e';
    ctx.beginPath(); ctx.ellipse(0, s*0.05, s*0.16, s*0.13, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, -s*0.12, s*0.1, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[1] || '#a3a3a3';
    ctx.beginPath(); ctx.moveTo(-s*0.16, s*0.0); ctx.bezierCurveTo(-s*0.4, -s*0.15, -s*0.42, s*0.15, -s*0.18, s*0.18); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(s*0.16, s*0.0); ctx.bezierCurveTo(s*0.4, -s*0.15, s*0.42, s*0.15, s*0.18, s*0.18); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath(); ctx.moveTo(-s*0.04, -s*0.12); ctx.lineTo(s*0.04, -s*0.05); ctx.lineTo(-s*0.04, -s*0.05); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath(); ctx.arc(-s*0.04, -s*0.16, s*0.02, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[2] || '#22c55e';
    rRect(ctx, -s*0.05, s*0.18, s*0.04, s*0.1, s*0.01); ctx.fill();
    rRect(ctx, s*0.01, s*0.18, s*0.04, s*0.1, s*0.01); ctx.fill();
    itemHighlight(ctx, -s*0.05, -s*0.16, s*0.04, s*0.03); } };

export const boulder_mr: ItemDef = { id: 'boulder_mr', name: 'Boulder', world: 'mountain_range', sizeTier: 8, baseValue: 33, weight: 9,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#a3a3a3';
    ctx.beginPath();
    ctx.moveTo(-s*0.32, s*0.18); ctx.bezierCurveTo(-s*0.4, -s*0.05, -s*0.18, -s*0.32, s*0.05, -s*0.3); ctx.bezierCurveTo(s*0.32, -s*0.28, s*0.4, -s*0.05, s*0.32, s*0.18); ctx.bezierCurveTo(s*0.18, s*0.36, -s*0.18, s*0.36, -s*0.32, s*0.18); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = darken(c[1] || '#a3a3a3', 0.4); ctx.lineWidth = s*0.018;
    ctx.beginPath(); ctx.moveTo(-s*0.2, -s*0.05); ctx.lineTo(s*0.0, s*0.1); ctx.lineTo(s*0.2, -s*0.1); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s*0.05, s*0.18); ctx.lineTo(s*0.1, s*0.25); ctx.stroke();
    itemHighlight(ctx, -s*0.18, -s*0.18, s*0.1, s*0.05); } };

export const mountain_tunnel: ItemDef = { id: 'mountain_tunnel', name: 'Mountain Tunnel', world: 'mountain_range', sizeTier: 8, baseValue: 35, weight: 10,
  draw(ctx, s, c) { ctx.fillStyle = c[0];
    ctx.beginPath();
    ctx.moveTo(-s*0.4, s*0.35); ctx.lineTo(-s*0.4, -s*0.05);
    ctx.bezierCurveTo(-s*0.4, -s*0.32, s*0.4, -s*0.32, s*0.4, -s*0.05);
    ctx.lineTo(s*0.4, s*0.35);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(-s*0.18, s*0.35); ctx.lineTo(-s*0.18, -s*0.0);
    ctx.bezierCurveTo(-s*0.18, -s*0.18, s*0.18, -s*0.18, s*0.18, -s*0.0);
    ctx.lineTo(s*0.18, s*0.35);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[1] || '#a3a3a3';
    rRect(ctx, -s*0.22, -s*0.18, s*0.44, s*0.08, s*0.02); ctx.fill();
    ctx.fillStyle = c[2] || '#22c55e';
    for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.arc(i*s*0.1, s*0.36, s*0.03, 0, Math.PI*2); ctx.fill(); }
    itemHighlight(ctx, -s*0.25, -s*0.1, s*0.1, s*0.04); } };

export const alpine_lake: ItemDef = { id: 'alpine_lake', name: 'Alpine Lake', world: 'mountain_range', sizeTier: 8, baseValue: 32, weight: 9,
  draw(ctx, s, c) { ctx.fillStyle = c[0];
    rRect(ctx, -s*0.4, -s*0.2, s*0.8, s*0.55, s*0.05); ctx.fill();
    ctx.fillStyle = '#67e8f9';
    ctx.beginPath(); ctx.ellipse(0, s*0.08, s*0.32, s*0.22, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.ellipse(-s*0.08, s*0.0, s*0.22, s*0.13, 0, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = c[1] || '#a3a3a3';
    ctx.beginPath(); ctx.moveTo(-s*0.4, -s*0.18); ctx.lineTo(-s*0.2, -s*0.32); ctx.lineTo(0, -s*0.18); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(s*0.05, -s*0.18); ctx.lineTo(s*0.25, -s*0.36); ctx.lineTo(s*0.4, -s*0.18); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.moveTo(-s*0.2, -s*0.32); ctx.lineTo(-s*0.15, -s*0.22); ctx.lineTo(-s*0.25, -s*0.22); ctx.closePath(); ctx.fill();
    itemHighlight(ctx, -s*0.1, s*0.05, s*0.1, s*0.04); } };

export const cliff_face: ItemDef = { id: 'cliff_face', name: 'Cliff Face', world: 'mountain_range', sizeTier: 8, baseValue: 34, weight: 10,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#a3a3a3';
    rRect(ctx, -s*0.35, -s*0.4, s*0.7, s*0.8, s*0.03); ctx.fill();
    ctx.strokeStyle = darken(c[1] || '#a3a3a3', 0.4); ctx.lineWidth = s*0.015;
    for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(-s*0.35, -s*0.3 + i*s*0.13); ctx.lineTo(s*0.35, -s*0.32 + i*s*0.13); ctx.stroke(); }
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(-s*0.3 + i*s*0.15, -s*0.4); ctx.lineTo(-s*0.32 + i*s*0.15, s*0.4); ctx.stroke(); }
    ctx.fillStyle = c[2] || '#22c55e';
    ctx.beginPath(); ctx.ellipse(-s*0.18, -s*0.34, s*0.06, s*0.04, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(s*0.15, -s*0.34, s*0.08, s*0.04, 0, 0, Math.PI*2); ctx.fill();
    itemHighlight(ctx, -s*0.18, -s*0.18, s*0.08, s*0.04); } };

export const glacier_tongue: ItemDef = { id: 'glacier_tongue', name: 'Glacier Tongue', world: 'mountain_range', sizeTier: 8, baseValue: 36, weight: 9,
  draw(ctx, s, c) { ctx.fillStyle = '#a5f3fc';
    ctx.beginPath();
    ctx.moveTo(-s*0.32, -s*0.4); ctx.lineTo(s*0.32, -s*0.4);
    ctx.bezierCurveTo(s*0.32, -s*0.1, s*0.18, s*0.2, s*0.05, s*0.4);
    ctx.bezierCurveTo(-s*0.05, s*0.35, -s*0.18, s*0.18, -s*0.32, -s*0.05);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#67e8f9'; ctx.globalAlpha = 0.6;
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-s*0.25 + i*s*0.13, -s*0.35); ctx.lineTo(-s*0.05 + i*s*0.13, s*0.3); ctx.lineTo(-s*0.15 + i*s*0.13, s*0.3); ctx.closePath(); ctx.fill(); }
    ctx.globalAlpha = 1;
    ctx.fillStyle = c[1] || '#a3a3a3';
    rRect(ctx, -s*0.4, -s*0.45, s*0.84, s*0.06, s*0.01); ctx.fill();
    itemHighlight(ctx, -s*0.18, -s*0.25, s*0.06, s*0.2); } };

export const observatory_mr: ItemDef = { id: 'observatory_mr', name: 'Observatory', world: 'mountain_range', sizeTier: 8, baseValue: 40, weight: 10,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#a3a3a3';
    rRect(ctx, -s*0.28, s*0.0, s*0.56, s*0.35, s*0.03); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, s*0.0, s*0.25, Math.PI, Math.PI*2); ctx.fill();
    ctx.fillStyle = darken('#ffffff', 0.15);
    ctx.beginPath(); ctx.arc(0, s*0.0, s*0.25, Math.PI, Math.PI*1.4); ctx.fill();
    ctx.fillStyle = '#0f172a';
    rRect(ctx, -s*0.05, -s*0.22, s*0.1, s*0.25, 0); ctx.fill();
    ctx.fillStyle = c[2] || '#22c55e';
    rRect(ctx, -s*0.06, s*0.18, s*0.12, s*0.15, s*0.01); ctx.fill();
    ctx.fillStyle = '#fde047';
    rRect(ctx, -s*0.22, s*0.1, s*0.08, s*0.06, s*0.01); ctx.fill();
    rRect(ctx, s*0.14, s*0.1, s*0.08, s*0.06, s*0.01); ctx.fill();
    itemHighlight(ctx, -s*0.15, -s*0.15, s*0.08, s*0.05); } };

// STRATOSPHERE T9
export const jet_plane: ItemDef = { id: 'jet_plane', name: 'Jet Plane', world: 'stratosphere', sizeTier: 9, baseValue: 50, weight: 11,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#e0f2fe';
    ctx.beginPath(); ctx.ellipse(0, 0, s*0.4, s*0.08, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = darken(c[1] || '#e0f2fe', 0.3);
    ctx.beginPath(); ctx.moveTo(-s*0.05, -s*0.05); ctx.lineTo(s*0.0, -s*0.25); ctx.lineTo(s*0.18, -s*0.05); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-s*0.3, -s*0.05); ctx.lineTo(-s*0.2, s*0.0); ctx.lineTo(-s*0.15, s*0.2); ctx.lineTo(-s*0.25, s*0.2); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-s*0.3, s*0.05); ctx.lineTo(-s*0.2, s*0.0); ctx.lineTo(-s*0.15, -s*0.2); ctx.lineTo(-s*0.25, -s*0.2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[0];
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(s*0.0 + i*s*0.06, -s*0.005, s*0.018, 0, Math.PI*2); ctx.fill(); }
    ctx.fillStyle = c[2] || '#a78bfa';
    ctx.beginPath(); ctx.arc(s*0.32, 0, s*0.04, 0, Math.PI*2); ctx.fill();
    itemHighlight(ctx, -s*0.15, -s*0.04, s*0.2, s*0.02); } };

export const weather_balloon: ItemDef = { id: 'weather_balloon', name: 'Weather Balloon', world: 'stratosphere', sizeTier: 9, baseValue: 45, weight: 9,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#e0f2fe';
    ctx.beginPath(); ctx.arc(0, -s*0.1, s*0.25, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.6;
    ctx.beginPath(); ctx.ellipse(-s*0.08, -s*0.18, s*0.1, s*0.06, 0, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = darken(c[1] || '#e0f2fe', 0.3);
    ctx.beginPath(); ctx.moveTo(-s*0.05, s*0.13); ctx.lineTo(s*0.05, s*0.13); ctx.lineTo(s*0.0, s*0.2); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = c[0]; ctx.lineWidth = s*0.012;
    ctx.beginPath(); ctx.moveTo(-s*0.04, s*0.18); ctx.lineTo(-s*0.06, s*0.32); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s*0.04, s*0.18); ctx.lineTo(s*0.06, s*0.32); ctx.stroke();
    ctx.fillStyle = c[2] || '#a78bfa';
    rRect(ctx, -s*0.1, s*0.32, s*0.2, s*0.1, s*0.02); ctx.fill();
    ctx.fillStyle = '#fde047';
    rRect(ctx, -s*0.06, s*0.34, s*0.04, s*0.04, 0); ctx.fill();
    rRect(ctx, s*0.02, s*0.34, s*0.04, s*0.04, 0); ctx.fill(); } };

export const low_satellite: ItemDef = { id: 'low_satellite', name: 'Low Satellite', world: 'stratosphere', sizeTier: 9, baseValue: 55, weight: 11,
  draw(ctx, s, c) { ctx.fillStyle = c[2] || '#a78bfa';
    rRect(ctx, -s*0.1, -s*0.1, s*0.2, s*0.2, s*0.02); ctx.fill();
    ctx.fillStyle = c[0];
    rRect(ctx, -s*0.4, -s*0.06, s*0.3, s*0.12, s*0.01); ctx.fill();
    rRect(ctx, s*0.1, -s*0.06, s*0.3, s*0.12, s*0.01); ctx.fill();
    ctx.fillStyle = darken(c[0], 0.4);
    for (let i = 0; i < 6; i++) { ctx.fillRect(-s*0.4 + i*s*0.05, -s*0.06, s*0.005, s*0.12); ctx.fillRect(s*0.1 + i*s*0.05, -s*0.06, s*0.005, s*0.12); }
    ctx.fillStyle = c[1] || '#e0f2fe';
    ctx.beginPath(); ctx.arc(0, -s*0.18, s*0.04, 0, Math.PI*2); ctx.fill();
    rRect(ctx, -s*0.025, -s*0.32, s*0.05, s*0.16, s*0.01); ctx.fill();
    ctx.fillStyle = '#fde047';
    ctx.beginPath(); ctx.arc(0, -s*0.32, s*0.03, 0, Math.PI*2); ctx.fill();
    itemHighlight(ctx, -s*0.06, -s*0.06, s*0.04, s*0.04); } };

export const space_junk: ItemDef = { id: 'space_junk', name: 'Space Junk', world: 'stratosphere', sizeTier: 9, baseValue: 42, weight: 9,
  draw(ctx, s, c) { ctx.fillStyle = c[0];
    ctx.beginPath();
    ctx.moveTo(-s*0.2, -s*0.3); ctx.lineTo(s*0.05, -s*0.2); ctx.lineTo(s*0.25, -s*0.3); ctx.lineTo(s*0.3, s*0.0); ctx.lineTo(s*0.15, s*0.25); ctx.lineTo(-s*0.18, s*0.2); ctx.lineTo(-s*0.3, -s*0.05); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = c[1] || '#e0f2fe'; ctx.globalAlpha = 0.7;
    rRect(ctx, -s*0.15, -s*0.05, s*0.18, s*0.1, s*0.01); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = darken(c[0], 0.4);
    rRect(ctx, s*0.0, -s*0.18, s*0.12, s*0.04, 0); ctx.fill();
    rRect(ctx, -s*0.1, s*0.12, s*0.08, s*0.04, 0); ctx.fill();
    rRect(ctx, s*0.1, s*0.05, s*0.04, s*0.1, 0); ctx.fill();
    ctx.fillStyle = c[2] || '#a78bfa';
    ctx.beginPath(); ctx.arc(s*0.18, -s*0.18, s*0.04, 0, Math.PI*2); ctx.fill();
    itemHighlight(ctx, -s*0.18, -s*0.18, s*0.06, s*0.04); } };

export const ozone_wisp: ItemDef = { id: 'ozone_wisp', name: 'Ozone Wisp', world: 'stratosphere', sizeTier: 9, baseValue: 38, weight: 7,
  draw(ctx, s, c) { ctx.fillStyle = c[2] || '#a78bfa'; ctx.globalAlpha = 0.5;
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.ellipse(-s*0.2 + i*s*0.1, Math.sin(i)*s*0.1, s*0.15, s*0.06, 0.2, 0, Math.PI*2); ctx.fill(); }
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = c[1] || '#e0f2fe';
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.ellipse(-s*0.15 + i*s*0.1, Math.cos(i)*s*0.08, s*0.1, s*0.04, -0.3, 0, Math.PI*2); ctx.fill(); }
    ctx.globalAlpha = 1;
    ctx.fillStyle = c[0];
    for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.arc((Math.random()-0.5)*s*0.7, (Math.random()-0.5)*s*0.5, s*0.012, 0, Math.PI*2); ctx.fill(); } } };

export const aurora_veil: ItemDef = { id: 'aurora_veil', name: 'Aurora Veil', world: 'stratosphere', sizeTier: 9, baseValue: 48, weight: 8,
  draw(ctx, s, c) { const cols = ['#22c55e', '#a78bfa', '#22d3ee', '#f472b6'];
    for (let l = 0; l < 4; l++) { ctx.fillStyle = cols[l]; ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.moveTo(-s*0.4, s*0.4 - l*s*0.05);
      for (let i = 0; i < 9; i++) { const x = -s*0.4 + i*s*0.1; const y = -s*0.2 - l*s*0.05 + Math.sin(i + l)*s*0.06; ctx.lineTo(x, y); }
      ctx.lineTo(s*0.4, s*0.4 - l*s*0.05); ctx.closePath();
      ctx.fill(); }
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.arc((Math.random()-0.5)*s*0.7, -s*0.3 + Math.random()*s*0.2, s*0.012, 0, Math.PI*2); ctx.fill(); } } };

export const hot_air_pocket: ItemDef = { id: 'hot_air_pocket', name: 'Hot Air Pocket', world: 'stratosphere', sizeTier: 9, baseValue: 40, weight: 8,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.globalAlpha = 0.7;
    ctx.beginPath(); ctx.arc(0, 0, s*0.32, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[2] || '#a78bfa';
    ctx.beginPath(); ctx.arc(0, 0, s*0.24, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath(); ctx.arc(0, 0, s*0.14, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#fef9c3';
    ctx.beginPath(); ctx.arc(0, 0, s*0.06, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = s*0.012;
    for (let i = 0; i < 8; i++) { const a = i*Math.PI/4;
      ctx.beginPath(); ctx.moveTo(Math.cos(a)*s*0.34, Math.sin(a)*s*0.34); ctx.lineTo(Math.cos(a)*s*0.42, Math.sin(a)*s*0.42); ctx.stroke(); } } };

export const strato_capsule: ItemDef = { id: 'strato_capsule', name: 'Strato Capsule', world: 'stratosphere', sizeTier: 9, baseValue: 50, weight: 10,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#e0f2fe';
    ctx.beginPath();
    ctx.moveTo(-s*0.18, s*0.25); ctx.lineTo(s*0.18, s*0.25);
    ctx.bezierCurveTo(s*0.22, s*0.0, s*0.1, -s*0.32, 0, -s*0.35);
    ctx.bezierCurveTo(-s*0.1, -s*0.32, -s*0.22, s*0.0, -s*0.18, s*0.25);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[2] || '#a78bfa';
    ctx.beginPath(); ctx.arc(0, -s*0.1, s*0.08, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = darken(c[1] || '#e0f2fe', 0.3);
    rRect(ctx, -s*0.2, s*0.22, s*0.4, s*0.05, s*0.01); ctx.fill();
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.moveTo(-s*0.18, s*0.27); ctx.lineTo(-s*0.28, s*0.4); ctx.lineTo(-s*0.1, s*0.36); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(s*0.18, s*0.27); ctx.lineTo(s*0.28, s*0.4); ctx.lineTo(s*0.1, s*0.36); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath(); ctx.arc(s*0.0, s*0.4, s*0.04, 0, Math.PI*2); ctx.fill();
    itemHighlight(ctx, -s*0.08, -s*0.18, s*0.05, s*0.1); } };

export const lightning_storm: ItemDef = { id: 'lightning_storm', name: 'Lightning Storm', world: 'stratosphere', sizeTier: 9, baseValue: 46, weight: 9,
  draw(ctx, s, c) { ctx.fillStyle = '#475569';
    ctx.beginPath(); ctx.arc(-s*0.18, -s*0.1, s*0.2, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.05, -s*0.18, s*0.22, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.22, -s*0.05, s*0.18, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath(); ctx.moveTo(s*0.0, s*0.0); ctx.lineTo(-s*0.1, s*0.18); ctx.lineTo(-s*0.04, s*0.18); ctx.lineTo(-s*0.1, s*0.32); ctx.lineTo(s*0.05, s*0.1); ctx.lineTo(-s*0.0, s*0.1); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(s*0.18, s*0.0); ctx.lineTo(s*0.08, s*0.18); ctx.lineTo(s*0.16, s*0.18); ctx.lineTo(s*0.08, s*0.36); ctx.lineTo(s*0.24, s*0.1); ctx.lineTo(s*0.16, s*0.1); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fef9c3'; ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.arc(-s*0.05, s*0.18, s*0.18, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.13, s*0.18, s*0.18, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1; } };

export const contrails_knot: ItemDef = { id: 'contrails_knot', name: 'Contrails Knot', world: 'stratosphere', sizeTier: 9, baseValue: 36, weight: 7,
  draw(ctx, s, c) { ctx.strokeStyle = '#ffffff'; ctx.lineWidth = s*0.06; ctx.lineCap = 'round';
    ctx.globalAlpha = 0.8;
    ctx.beginPath(); ctx.moveTo(-s*0.4, -s*0.2); ctx.bezierCurveTo(-s*0.1, s*0.1, s*0.1, -s*0.1, s*0.4, s*0.2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s*0.4, s*0.1); ctx.bezierCurveTo(-s*0.1, -s*0.05, s*0.1, s*0.15, s*0.4, -s*0.05); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s*0.3, s*0.3); ctx.bezierCurveTo(s*0.0, s*0.0, s*0.1, s*0.1, s*0.3, -s*0.3); ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.fillStyle = c[2] || '#a78bfa';
    ctx.beginPath(); ctx.moveTo(-s*0.4, -s*0.2); ctx.lineTo(-s*0.34, -s*0.16); ctx.lineTo(-s*0.34, -s*0.24); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(s*0.4, s*0.2); ctx.lineTo(s*0.34, s*0.16); ctx.lineTo(s*0.34, s*0.24); ctx.closePath(); ctx.fill(); } };

// MOON SURFACE T9
export const lunar_crater: ItemDef = { id: 'lunar_crater', name: 'Lunar Crater', world: 'moon_surface', sizeTier: 9, baseValue: 42, weight: 9,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#94a3b8';
    ctx.beginPath(); ctx.arc(0, 0, s*0.4, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = darken(c[1] || '#94a3b8', 0.4);
    ctx.beginPath(); ctx.arc(0, 0, s*0.32, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#1e293b';
    ctx.beginPath(); ctx.arc(0, s*0.04, s*0.22, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = darken(c[1] || '#94a3b8', 0.3);
    for (let i = 0; i < 6; i++) { const a = i*Math.PI/3; ctx.beginPath(); ctx.arc(Math.cos(a)*s*0.36, Math.sin(a)*s*0.36, s*0.04, 0, Math.PI*2); ctx.fill(); }
    ctx.fillStyle = c[0]; ctx.globalAlpha = 0.6;
    ctx.beginPath(); ctx.ellipse(-s*0.05, -s*0.04, s*0.13, s*0.07, 0, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    itemHighlight(ctx, -s*0.18, -s*0.18, s*0.1, s*0.04); } };

export const moon_rover: ItemDef = { id: 'moon_rover', name: 'Moon Rover', world: 'moon_surface', sizeTier: 9, baseValue: 50, weight: 10,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; rRect(ctx, -s*0.32, -s*0.05, s*0.64, s*0.22, s*0.03); ctx.fill();
    rRect(ctx, -s*0.18, -s*0.22, s*0.36, s*0.18, s*0.02); ctx.fill();
    ctx.fillStyle = '#1e293b'; rRect(ctx, -s*0.15, -s*0.2, s*0.3, s*0.13, s*0.01); ctx.fill();
    ctx.fillStyle = c[2] || '#60a5fa';
    rRect(ctx, -s*0.13, -s*0.18, s*0.26, s*0.1, s*0.01); ctx.fill();
    ctx.fillStyle = '#1e293b';
    ctx.beginPath(); ctx.arc(-s*0.22, s*0.22, s*0.1, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, s*0.22, s*0.1, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.22, s*0.22, s*0.1, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[1] || '#94a3b8';
    ctx.beginPath(); ctx.arc(-s*0.22, s*0.22, s*0.04, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, s*0.22, s*0.04, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.22, s*0.22, s*0.04, 0, Math.PI*2); ctx.fill();
    rRect(ctx, s*0.28, -s*0.18, s*0.04, s*0.18, s*0.01); ctx.fill();
    ctx.fillStyle = '#dc2626';
    rRect(ctx, s*0.3, -s*0.2, s*0.06, s*0.04, 0); ctx.fill();
    itemHighlight(ctx, -s*0.18, -s*0.02, s*0.1, s*0.04); } };

export const lunar_lander: ItemDef = { id: 'lunar_lander', name: 'Lunar Lander', world: 'moon_surface', sizeTier: 9, baseValue: 55, weight: 11,
  draw(ctx, s, c) { ctx.fillStyle = c[2] || '#60a5fa';
    rRect(ctx, -s*0.18, -s*0.18, s*0.36, s*0.25, s*0.04); ctx.fill();
    ctx.fillStyle = c[1] || '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(-s*0.18, s*0.07); ctx.lineTo(s*0.18, s*0.07); ctx.lineTo(s*0.25, s*0.2); ctx.lineTo(-s*0.25, s*0.2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[0];
    rRect(ctx, -s*0.32, s*0.2, s*0.06, s*0.18, s*0.01); ctx.fill();
    rRect(ctx, s*0.26, s*0.2, s*0.06, s*0.18, s*0.01); ctx.fill();
    rRect(ctx, -s*0.04, s*0.2, s*0.08, s*0.18, s*0.01); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-s*0.32, s*0.38); ctx.lineTo(-s*0.4, s*0.38); ctx.lineTo(-s*0.36, s*0.32); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(s*0.32, s*0.38); ctx.lineTo(s*0.4, s*0.38); ctx.lineTo(s*0.36, s*0.32); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath(); ctx.arc(0, -s*0.06, s*0.07, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fde047';
    rRect(ctx, -s*0.08, -s*0.32, s*0.16, s*0.14, s*0.02); ctx.fill();
    itemHighlight(ctx, -s*0.13, -s*0.13, s*0.06, s*0.05); } };

export const moon_flag: ItemDef = { id: 'moon_flag', name: 'Moon Flag', world: 'moon_surface', sizeTier: 9, baseValue: 38, weight: 7,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#94a3b8';
    rRect(ctx, -s*0.04, -s*0.4, s*0.08, s*0.7, s*0.01); ctx.fill();
    rRect(ctx, -s*0.18, s*0.3, s*0.36, s*0.06, s*0.01); ctx.fill();
    ctx.fillStyle = '#dc2626';
    rRect(ctx, s*0.04, -s*0.4, s*0.3, s*0.22, s*0.01); ctx.fill();
    ctx.fillStyle = '#ffffff';
    rRect(ctx, s*0.04, -s*0.32, s*0.3, s*0.06, 0); ctx.fill();
    rRect(ctx, s*0.04, -s*0.22, s*0.3, s*0.04, 0); ctx.fill();
    ctx.fillStyle = c[2] || '#60a5fa';
    rRect(ctx, s*0.04, -s*0.4, s*0.13, s*0.13, s*0.01); ctx.fill();
    ctx.fillStyle = '#fde047';
    for (let i = 0; i < 5; i++) { const a = i*Math.PI*2/5 - Math.PI/2;
      ctx.beginPath(); ctx.arc(s*0.1 + Math.cos(a)*s*0.04, -s*0.34 + Math.sin(a)*s*0.04, s*0.008, 0, Math.PI*2); ctx.fill(); }
    itemHighlight(ctx, s*0.05, -s*0.36, s*0.08, s*0.03); } };

export const lunar_boulder: ItemDef = { id: 'lunar_boulder', name: 'Lunar Boulder', world: 'moon_surface', sizeTier: 9, baseValue: 36, weight: 9,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(-s*0.32, s*0.22); ctx.bezierCurveTo(-s*0.4, -s*0.05, -s*0.18, -s*0.32, s*0.05, -s*0.3); ctx.bezierCurveTo(s*0.32, -s*0.28, s*0.4, -s*0.05, s*0.32, s*0.22); ctx.bezierCurveTo(s*0.18, s*0.36, -s*0.18, s*0.36, -s*0.32, s*0.22); ctx.closePath(); ctx.fill();
    ctx.fillStyle = darken(c[1] || '#94a3b8', 0.4);
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(-s*0.18 + i*s*0.1, -s*0.05 + Math.sin(i)*s*0.08, s*0.025, 0, Math.PI*2); ctx.fill(); }
    ctx.fillStyle = c[0]; ctx.globalAlpha = 0.4;
    ctx.beginPath(); ctx.ellipse(-s*0.05, -s*0.08, s*0.16, s*0.07, 0, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    itemHighlight(ctx, -s*0.18, -s*0.18, s*0.1, s*0.04); } };

export const lunar_base: ItemDef = { id: 'lunar_base', name: 'Lunar Base', world: 'moon_surface', sizeTier: 9, baseValue: 58, weight: 11,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#94a3b8';
    ctx.beginPath(); ctx.arc(-s*0.2, s*0.1, s*0.15, Math.PI, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.18, s*0.1, s*0.18, Math.PI, Math.PI*2); ctx.fill();
    rRect(ctx, -s*0.35, s*0.05, s*0.7, s*0.08, 0); ctx.fill();
    ctx.fillStyle = darken(c[1] || '#94a3b8', 0.3);
    rRect(ctx, -s*0.06, s*0.08, s*0.12, s*0.05, 0); ctx.fill();
    ctx.fillStyle = c[2] || '#60a5fa';
    ctx.beginPath(); ctx.arc(-s*0.2, s*0.05, s*0.05, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.18, s*0.0, s*0.06, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[0];
    rRect(ctx, -s*0.04, -s*0.32, s*0.08, s*0.4, s*0.01); ctx.fill();
    rRect(ctx, -s*0.18, -s*0.32, s*0.36, s*0.04, s*0.01); ctx.fill();
    ctx.fillStyle = '#fde047';
    ctx.beginPath(); ctx.arc(0, -s*0.32, s*0.04, 0, Math.PI*2); ctx.fill();
    itemHighlight(ctx, -s*0.18, s*0.0, s*0.06, s*0.05); } };

export const regolith_pile: ItemDef = { id: 'regolith_pile', name: 'Regolith Pile', world: 'moon_surface', sizeTier: 9, baseValue: 35, weight: 8,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(-s*0.4, s*0.35);
    ctx.bezierCurveTo(-s*0.3, s*0.0, -s*0.05, -s*0.15, s*0.1, s*0.0);
    ctx.bezierCurveTo(s*0.25, s*0.15, s*0.3, s*0.25, s*0.4, s*0.35);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = darken(c[1] || '#94a3b8', 0.3);
    for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.arc(-s*0.3 + i*s*0.08, s*0.18 + Math.sin(i)*s*0.1, s*0.03, 0, Math.PI*2); ctx.fill(); }
    ctx.fillStyle = c[0]; ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.moveTo(-s*0.4, s*0.35); ctx.bezierCurveTo(-s*0.3, s*0.0, -s*0.05, -s*0.15, s*0.1, s*0.0); ctx.bezierCurveTo(s*0.0, s*0.05, -s*0.15, s*0.1, -s*0.18, s*0.35); ctx.closePath();
    ctx.fill(); ctx.globalAlpha = 1; } };

export const moon_dust_cloud: ItemDef = { id: 'moon_dust_cloud', name: 'Dust Cloud', world: 'moon_surface', sizeTier: 9, baseValue: 32, weight: 7,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#94a3b8'; ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.arc(-s*0.18, s*0.05, s*0.18, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, -s*0.1, s*0.22, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.2, s*0.0, s*0.2, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.05, s*0.15, s*0.16, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.arc(-s*0.1, s*0.0, s*0.1, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.1, s*0.05, s*0.08, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    for (let i = 0; i < 6; i++) { ctx.fillStyle = c[2] || '#60a5fa'; ctx.beginPath(); ctx.arc((Math.random()-0.5)*s*0.5, (Math.random()-0.5)*s*0.4, s*0.012, 0, Math.PI*2); ctx.fill(); } } };

export const lunar_mining_rig: ItemDef = { id: 'lunar_mining_rig', name: 'Mining Rig', world: 'moon_surface', sizeTier: 9, baseValue: 52, weight: 10,
  draw(ctx, s, c) { ctx.fillStyle = c[0];
    rRect(ctx, -s*0.3, s*0.0, s*0.6, s*0.3, s*0.03); ctx.fill();
    ctx.fillStyle = c[1] || '#94a3b8';
    rRect(ctx, -s*0.04, -s*0.4, s*0.08, s*0.4, s*0.01); ctx.fill();
    ctx.strokeStyle = c[1] || '#94a3b8'; ctx.lineWidth = s*0.04;
    ctx.beginPath(); ctx.moveTo(0, -s*0.4); ctx.lineTo(s*0.25, -s*0.05); ctx.stroke();
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath(); ctx.moveTo(s*0.25, -s*0.05); ctx.lineTo(s*0.32, s*0.0); ctx.lineTo(s*0.25, s*0.05); ctx.lineTo(s*0.18, s*0.0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#1e293b';
    ctx.beginPath(); ctx.arc(-s*0.18, s*0.32, s*0.08, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.18, s*0.32, s*0.08, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[2] || '#60a5fa';
    rRect(ctx, -s*0.22, s*0.05, s*0.18, s*0.1, s*0.01); ctx.fill();
    itemHighlight(ctx, -s*0.18, s*0.05, s*0.08, s*0.04); } };

export const abandoned_suit: ItemDef = { id: 'abandoned_suit', name: 'Abandoned Suit', world: 'moon_surface', sizeTier: 9, baseValue: 40, weight: 8,
  draw(ctx, s, c) { ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, -s*0.18, s*0.14, 0, Math.PI*2); ctx.fill();
    rRect(ctx, -s*0.18, -s*0.05, s*0.36, s*0.32, s*0.04); ctx.fill();
    rRect(ctx, -s*0.32, -s*0.02, s*0.13, s*0.2, s*0.04); ctx.fill();
    rRect(ctx, s*0.19, -s*0.02, s*0.13, s*0.2, s*0.04); ctx.fill();
    rRect(ctx, -s*0.16, s*0.27, s*0.13, s*0.12, s*0.02); ctx.fill();
    rRect(ctx, s*0.03, s*0.27, s*0.13, s*0.12, s*0.02); ctx.fill();
    ctx.fillStyle = '#0f172a';
    rRect(ctx, -s*0.1, -s*0.22, s*0.2, s*0.1, s*0.02); ctx.fill();
    ctx.fillStyle = c[2] || '#60a5fa'; ctx.globalAlpha = 0.5;
    rRect(ctx, -s*0.08, -s*0.21, s*0.16, s*0.07, s*0.02); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#dc2626';
    ctx.beginPath(); ctx.arc(0, s*0.05, s*0.05, 0, Math.PI*2); ctx.fill();
    itemHighlight(ctx, -s*0.06, -s*0.22, s*0.04, s*0.03); } };

// RED PLANET T9
export const mars_rover: ItemDef = { id: 'mars_rover', name: 'Mars Rover', world: 'red_planet', sizeTier: 9, baseValue: 50, weight: 10,
  draw(ctx, s, c) { ctx.fillStyle = c[2] || '#fbbf24';
    rRect(ctx, -s*0.3, -s*0.05, s*0.6, s*0.18, s*0.02); ctx.fill();
    rRect(ctx, -s*0.18, -s*0.2, s*0.36, s*0.18, s*0.02); ctx.fill();
    ctx.fillStyle = c[0];
    rRect(ctx, -s*0.36, -s*0.32, s*0.32, s*0.1, s*0.01); ctx.fill();
    rRect(ctx, s*0.04, -s*0.36, s*0.32, s*0.1, s*0.01); ctx.fill();
    ctx.fillStyle = '#1e293b';
    for (let i = 0; i < 4; i++) { ctx.fillRect(-s*0.34 + i*s*0.08, -s*0.32, s*0.005, s*0.1); ctx.fillRect(s*0.06 + i*s*0.08, -s*0.36, s*0.005, s*0.1); }
    ctx.beginPath(); ctx.arc(-s*0.22, s*0.18, s*0.08, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, s*0.18, s*0.08, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.22, s*0.18, s*0.08, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[1] || '#dc2626';
    rRect(ctx, s*0.18, -s*0.18, s*0.04, s*0.08, 0); ctx.fill();
    rRect(ctx, -s*0.13, -s*0.16, s*0.08, s*0.06, s*0.01); ctx.fill();
    itemHighlight(ctx, -s*0.18, -s*0.16, s*0.08, s*0.04); } };

export const dust_storm: ItemDef = { id: 'dust_storm', name: 'Dust Storm', world: 'red_planet', sizeTier: 9, baseValue: 38, weight: 8,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#dc2626'; ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.arc(-s*0.18, s*0.05, s*0.22, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, -s*0.1, s*0.25, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.2, s*0.0, s*0.22, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.arc(-s*0.05, s*0.02, s*0.16, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.1, -s*0.05, s*0.13, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = c[2] || '#fbbf24';
    for (let i = 0; i < 10; i++) { ctx.beginPath(); ctx.arc((Math.random()-0.5)*s*0.7, (Math.random()-0.5)*s*0.6, s*0.015, 0, Math.PI*2); ctx.fill(); }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = '#92400e'; ctx.lineWidth = s*0.012;
    for (let i = 0; i < 5; i++) { const a = i*Math.PI*2/5;
      ctx.beginPath(); ctx.arc(0, 0, s*0.32, a, a + 0.6); ctx.stroke(); } } };

export const polar_ice_cap: ItemDef = { id: 'polar_ice_cap', name: 'Polar Ice Cap', world: 'red_planet', sizeTier: 9, baseValue: 40, weight: 9,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#dc2626';
    ctx.beginPath(); ctx.arc(0, 0, s*0.4, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, -s*0.25, s*0.32, 0, Math.PI, false); ctx.lineTo(-s*0.32, -s*0.25); ctx.closePath();
    ctx.save(); ctx.beginPath(); ctx.arc(0, 0, s*0.4, 0, Math.PI*2); ctx.clip();
    ctx.fillRect(-s*0.4, -s*0.4, s*0.8, s*0.18);
    ctx.restore();
    ctx.fillStyle = darken('#ffffff', 0.15);
    ctx.beginPath(); ctx.ellipse(0, -s*0.25, s*0.3, s*0.05, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = darken(c[1] || '#dc2626', 0.3);
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(-s*0.2 + i*s*0.1, s*0.15 + Math.sin(i)*s*0.05, s*0.02, 0, Math.PI*2); ctx.fill(); }
    itemHighlight(ctx, -s*0.18, -s*0.32, s*0.08, s*0.04); } };

export const olympus_mons: ItemDef = { id: 'olympus_mons', name: 'Olympus Mons', world: 'red_planet', sizeTier: 9, baseValue: 55, weight: 11,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#dc2626';
    ctx.beginPath();
    ctx.moveTo(-s*0.4, s*0.4); ctx.lineTo(-s*0.18, -s*0.15); ctx.lineTo(s*0.18, -s*0.15); ctx.lineTo(s*0.4, s*0.4); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = darken(c[1] || '#dc2626', 0.3);
    ctx.beginPath();
    ctx.moveTo(-s*0.18, -s*0.15); ctx.lineTo(s*0.18, -s*0.15); ctx.lineTo(s*0.4, s*0.4); ctx.lineTo(s*0.0, s*0.4); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath(); ctx.ellipse(0, -s*0.15, s*0.18, s*0.05, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[2] || '#fbbf24';
    ctx.beginPath(); ctx.ellipse(0, -s*0.18, s*0.13, s*0.04, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, -s*0.22, s*0.06, s*0.03, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[0]; ctx.globalAlpha = 0.5;
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(-s*0.13 + i*s*0.08, -s*0.32 - i*s*0.02, s*0.04, 0, Math.PI*2); ctx.fill(); }
    ctx.globalAlpha = 1;
    itemHighlight(ctx, -s*0.18, s*0.05, s*0.06, s*0.1); } };

export const valles_marineris: ItemDef = { id: 'valles_marineris', name: 'Valles Marineris', world: 'red_planet', sizeTier: 9, baseValue: 48, weight: 10,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#dc2626';
    rRect(ctx, -s*0.4, -s*0.3, s*0.8, s*0.6, s*0.04); ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(-s*0.36, -s*0.05); ctx.lineTo(-s*0.24, -s*0.12); ctx.lineTo(s*0.0, -s*0.05); ctx.lineTo(s*0.24, -s*0.13); ctx.lineTo(s*0.36, -s*0.06); ctx.lineTo(s*0.36, s*0.05); ctx.lineTo(s*0.24, s*0.0); ctx.lineTo(s*0.0, s*0.07); ctx.lineTo(-s*0.24, s*0.0); ctx.lineTo(-s*0.36, s*0.05); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = darken(c[1] || '#dc2626', 0.4);
    ctx.beginPath();
    ctx.moveTo(-s*0.36, -s*0.05); ctx.lineTo(-s*0.24, -s*0.12); ctx.lineTo(s*0.0, -s*0.05); ctx.lineTo(s*0.24, -s*0.13); ctx.lineTo(s*0.36, -s*0.06); ctx.lineTo(s*0.32, s*0.0); ctx.lineTo(s*0.0, -s*0.0); ctx.lineTo(-s*0.32, s*0.0); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = c[2] || '#fbbf24';
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(-s*0.25 + i*s*0.16, s*0.18, s*0.02, 0, Math.PI*2); ctx.fill(); }
    itemHighlight(ctx, -s*0.18, -s*0.22, s*0.1, s*0.04); } };

export const mars_base: ItemDef = { id: 'mars_base', name: 'Mars Base', world: 'red_planet', sizeTier: 9, baseValue: 56, weight: 11,
  draw(ctx, s, c) { ctx.fillStyle = c[2] || '#fbbf24';
    ctx.beginPath(); ctx.arc(-s*0.18, s*0.1, s*0.16, Math.PI, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.18, s*0.1, s*0.18, Math.PI, Math.PI*2); ctx.fill();
    rRect(ctx, -s*0.36, s*0.06, s*0.72, s*0.06, 0); ctx.fill();
    ctx.fillStyle = darken(c[2] || '#fbbf24', 0.3);
    rRect(ctx, -s*0.06, s*0.08, s*0.12, s*0.05, 0); ctx.fill();
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.arc(-s*0.18, s*0.05, s*0.06, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.18, s*0.0, s*0.07, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[1] || '#dc2626';
    rRect(ctx, -s*0.04, -s*0.32, s*0.08, s*0.4, s*0.01); ctx.fill();
    rRect(ctx, -s*0.18, -s*0.32, s*0.36, s*0.05, s*0.01); ctx.fill();
    ctx.fillStyle = '#fef9c3';
    ctx.beginPath(); ctx.arc(0, -s*0.34, s*0.04, 0, Math.PI*2); ctx.fill();
    itemHighlight(ctx, -s*0.18, s*0.0, s*0.06, s*0.05); } };

export const alien_fossil: ItemDef = { id: 'alien_fossil', name: 'Alien Fossil', world: 'red_planet', sizeTier: 9, baseValue: 60, weight: 9,
  draw(ctx, s, c) { ctx.fillStyle = c[2] || '#fbbf24';
    rRect(ctx, -s*0.35, -s*0.3, s*0.7, s*0.6, s*0.04); ctx.fill();
    ctx.fillStyle = darken(c[2] || '#fbbf24', 0.3);
    ctx.beginPath();
    ctx.moveTo(-s*0.22, s*0.2); ctx.lineTo(-s*0.05, s*0.15); ctx.lineTo(-s*0.0, s*0.0); ctx.lineTo(s*0.1, -s*0.05); ctx.lineTo(s*0.18, -s*0.15); ctx.lineTo(s*0.22, -s*0.18);
    ctx.lineWidth = s*0.04; ctx.strokeStyle = darken(c[2] || '#fbbf24', 0.5); ctx.stroke();
    ctx.fillStyle = darken(c[2] || '#fbbf24', 0.5);
    ctx.beginPath(); ctx.arc(-s*0.22, s*0.2, s*0.07, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.22, -s*0.18, s*0.06, 0, Math.PI*2); ctx.fill();
    for (let i = 0; i < 5; i++) { const a = i*0.6 + 1.5; const px = -s*0.05 + i*s*0.05, py = -i*s*0.02 - s*0.05;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + Math.cos(a)*s*0.06, py + Math.sin(a)*s*0.06); ctx.stroke(); }
    itemHighlight(ctx, -s*0.18, -s*0.18, s*0.1, s*0.04); } };

export const terraform_tower: ItemDef = { id: 'terraform_tower', name: 'Terraform Tower', world: 'red_planet', sizeTier: 9, baseValue: 58, weight: 11,
  draw(ctx, s, c) { ctx.fillStyle = c[0];
    ctx.beginPath();
    ctx.moveTo(-s*0.18, s*0.4); ctx.lineTo(-s*0.08, -s*0.4); ctx.lineTo(s*0.08, -s*0.4); ctx.lineTo(s*0.18, s*0.4); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = darken(c[0], 0.3);
    rRect(ctx, -s*0.13, s*0.0, s*0.26, s*0.04, 0); ctx.fill();
    rRect(ctx, -s*0.13, s*0.18, s*0.26, s*0.04, 0); ctx.fill();
    rRect(ctx, -s*0.13, -s*0.2, s*0.26, s*0.04, 0); ctx.fill();
    ctx.fillStyle = c[2] || '#fbbf24';
    ctx.beginPath(); ctx.arc(0, -s*0.4, s*0.1, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#67e8f9'; ctx.globalAlpha = 0.6;
    ctx.beginPath(); ctx.arc(0, -s*0.4, s*0.16, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = c[1] || '#dc2626';
    rRect(ctx, -s*0.22, s*0.36, s*0.44, s*0.05, s*0.01); ctx.fill();
    itemHighlight(ctx, -s*0.05, -s*0.3, s*0.04, s*0.5); } };

export const red_boulder: ItemDef = { id: 'red_boulder', name: 'Red Boulder', world: 'red_planet', sizeTier: 9, baseValue: 36, weight: 9,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#dc2626';
    ctx.beginPath();
    ctx.moveTo(-s*0.32, s*0.18); ctx.bezierCurveTo(-s*0.4, -s*0.05, -s*0.18, -s*0.32, s*0.05, -s*0.3); ctx.bezierCurveTo(s*0.32, -s*0.28, s*0.4, -s*0.05, s*0.32, s*0.18); ctx.bezierCurveTo(s*0.18, s*0.36, -s*0.18, s*0.36, -s*0.32, s*0.18); ctx.closePath(); ctx.fill();
    ctx.fillStyle = darken(c[1] || '#dc2626', 0.4);
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(-s*0.18 + i*s*0.13, s*0.0 + Math.sin(i)*s*0.1, s*0.025, 0, Math.PI*2); ctx.fill(); }
    ctx.fillStyle = c[2] || '#fbbf24'; ctx.globalAlpha = 0.4;
    ctx.beginPath(); ctx.ellipse(-s*0.05, -s*0.08, s*0.13, s*0.07, 0, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    itemHighlight(ctx, -s*0.18, -s*0.22, s*0.1, s*0.05); } };

export const ancient_artifact: ItemDef = { id: 'ancient_artifact', name: 'Ancient Artifact', world: 'red_planet', sizeTier: 9, baseValue: 60, weight: 8,
  draw(ctx, s, c) { ctx.fillStyle = c[2] || '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(0, -s*0.4);
    for (let i = 0; i < 8; i++) { const a = i*Math.PI/4 + Math.PI/2;
      ctx.lineTo(Math.cos(a)*s*0.3, Math.sin(a)*s*0.3); ctx.lineTo(Math.cos(a + Math.PI/8)*s*0.18, Math.sin(a + Math.PI/8)*s*0.18); }
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.arc(0, 0, s*0.13, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#67e8f9'; ctx.globalAlpha = 0.6;
    ctx.beginPath(); ctx.arc(0, 0, s*0.18, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = c[1] || '#dc2626';
    for (let i = 0; i < 6; i++) { const a = i*Math.PI/3;
      ctx.beginPath(); ctx.arc(Math.cos(a)*s*0.25, Math.sin(a)*s*0.25, s*0.025, 0, Math.PI*2); ctx.fill(); }
    itemHighlight(ctx, -s*0.05, -s*0.05, s*0.04, s*0.04); } };

// ASTEROID BELT T9
export const asteroid_chunk: ItemDef = { id: 'asteroid_chunk', name: 'Asteroid Chunk', world: 'asteroid_belt', sizeTier: 9, baseValue: 40, weight: 9,
  draw(ctx, s, c) { ctx.fillStyle = c[0];
    ctx.beginPath();
    ctx.moveTo(-s*0.3, -s*0.05); ctx.lineTo(-s*0.18, -s*0.32); ctx.lineTo(s*0.1, -s*0.3); ctx.lineTo(s*0.32, -s*0.13); ctx.lineTo(s*0.32, s*0.18); ctx.lineTo(s*0.05, s*0.32); ctx.lineTo(-s*0.22, s*0.22); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = darken(c[0], 0.4);
    for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(-s*0.18 + i*s*0.1, -s*0.05 + Math.sin(i*1.5)*s*0.1, s*0.025, 0, Math.PI*2); ctx.fill(); }
    ctx.fillStyle = c[1] || '#a16207'; ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.ellipse(-s*0.05, -s*0.08, s*0.13, s*0.07, 0, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    itemHighlight(ctx, -s*0.18, -s*0.22, s*0.1, s*0.04); } };

export const mining_drone: ItemDef = { id: 'mining_drone', name: 'Mining Drone', world: 'asteroid_belt', sizeTier: 9, baseValue: 50, weight: 9,
  draw(ctx, s, c) { ctx.fillStyle = c[2] || '#cbd5e1';
    ctx.beginPath(); ctx.arc(0, 0, s*0.18, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[0];
    rRect(ctx, -s*0.32, -s*0.08, s*0.15, s*0.16, s*0.02); ctx.fill();
    rRect(ctx, s*0.17, -s*0.08, s*0.15, s*0.16, s*0.02); ctx.fill();
    ctx.fillStyle = darken(c[2] || '#cbd5e1', 0.3);
    rRect(ctx, -s*0.32, -s*0.04, s*0.14, s*0.08, s*0.01); ctx.fill();
    rRect(ctx, s*0.18, -s*0.04, s*0.14, s*0.08, s*0.01); ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath(); ctx.arc(0, -s*0.04, s*0.06, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#dc2626';
    ctx.beginPath(); ctx.arc(0, -s*0.04, s*0.03, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[1] || '#a16207';
    rRect(ctx, -s*0.04, s*0.18, s*0.08, s*0.13, s*0.01); ctx.fill();
    ctx.fillStyle = '#67e8f9';
    rRect(ctx, -s*0.05, s*0.28, s*0.1, s*0.04, 0); ctx.fill();
    itemHighlight(ctx, -s*0.06, -s*0.1, s*0.05, s*0.04); } };

export const ice_comet: ItemDef = { id: 'ice_comet', name: 'Ice Comet', world: 'asteroid_belt', sizeTier: 9, baseValue: 45, weight: 8,
  draw(ctx, s, c) { ctx.fillStyle = c[2] || '#cbd5e1';
    ctx.beginPath(); ctx.arc(s*0.18, -s*0.18, s*0.13, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#67e8f9'; ctx.globalAlpha = 0.7;
    ctx.beginPath(); ctx.arc(s*0.18, -s*0.18, s*0.2, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = c[1] || '#a16207'; ctx.lineWidth = s*0.04; ctx.lineCap = 'round';
    for (let i = 0; i < 8; i++) { ctx.globalAlpha = 1 - i*0.12;
      ctx.beginPath(); ctx.moveTo(s*0.1 - i*s*0.05, -s*0.1 + i*s*0.05); ctx.lineTo(-s*0.0 - i*s*0.05, s*0.0 + i*s*0.05); ctx.stroke(); }
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(s*0.2, -s*0.2, s*0.04, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#67e8f9';
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(-s*0.3 + Math.random()*s*0.3, s*0.2 + Math.random()*s*0.15, s*0.018, 0, Math.PI*2); ctx.fill(); } } };

export const pirate_ship: ItemDef = { id: 'pirate_ship', name: 'Pirate Ship', world: 'asteroid_belt', sizeTier: 9, baseValue: 58, weight: 11,
  draw(ctx, s, c) { ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(-s*0.4, s*0.05); ctx.lineTo(s*0.3, s*0.05); ctx.lineTo(s*0.4, s*0.18); ctx.lineTo(-s*0.32, s*0.18); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = c[0];
    rRect(ctx, -s*0.18, -s*0.08, s*0.32, s*0.13, s*0.02); ctx.fill();
    ctx.fillStyle = darken('#0f172a', 0.3);
    for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.arc(i*s*0.13, s*0.12, s*0.018, 0, Math.PI*2); ctx.fill(); }
    ctx.fillStyle = c[2] || '#cbd5e1';
    rRect(ctx, -s*0.04, -s*0.4, s*0.08, s*0.32, 0); ctx.fill();
    ctx.fillStyle = c[1] || '#a16207';
    ctx.beginPath();
    ctx.moveTo(s*0.0, -s*0.4); ctx.lineTo(s*0.18, -s*0.32); ctx.lineTo(s*0.0, -s*0.22); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#dc2626';
    ctx.beginPath(); ctx.arc(s*0.06, -s*0.3, s*0.025, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fde047';
    ctx.beginPath(); ctx.arc(s*0.32, s*0.0, s*0.04, 0, Math.PI*2); ctx.fill();
    itemHighlight(ctx, -s*0.13, -s*0.04, s*0.1, s*0.04); } };

export const debris_cloud: ItemDef = { id: 'debris_cloud', name: 'Debris Cloud', world: 'asteroid_belt', sizeTier: 9, baseValue: 36, weight: 7,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.globalAlpha = 0.4;
    ctx.beginPath(); ctx.arc(0, 0, s*0.4, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    for (let i = 0; i < 14; i++) { ctx.fillStyle = i % 3 === 0 ? c[1] || '#a16207' : c[2] || '#cbd5e1';
      const r = s*(0.02 + Math.random()*0.05);
      const x = (Math.random()-0.5)*s*0.7;
      const y = (Math.random()-0.5)*s*0.6;
      ctx.beginPath();
      ctx.moveTo(x - r, y); ctx.lineTo(x, y - r); ctx.lineTo(x + r, y); ctx.lineTo(x, y + r); ctx.closePath();
      ctx.fill(); }
    ctx.fillStyle = '#fde047';
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc((Math.random()-0.5)*s*0.7, (Math.random()-0.5)*s*0.6, s*0.012, 0, Math.PI*2); ctx.fill(); } } };

export const asteroid_beacon: ItemDef = { id: 'asteroid_beacon', name: 'Asteroid Beacon', world: 'asteroid_belt', sizeTier: 9, baseValue: 42, weight: 8,
  draw(ctx, s, c) { ctx.fillStyle = c[0];
    rRect(ctx, -s*0.2, s*0.05, s*0.4, s*0.3, s*0.04); ctx.fill();
    ctx.fillStyle = darken(c[0], 0.4);
    rRect(ctx, -s*0.15, s*0.18, s*0.3, s*0.04, 0); ctx.fill();
    ctx.fillStyle = c[1] || '#a16207';
    rRect(ctx, -s*0.04, -s*0.2, s*0.08, s*0.3, s*0.01); ctx.fill();
    ctx.fillStyle = '#dc2626';
    ctx.beginPath(); ctx.arc(0, -s*0.25, s*0.08, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fef9c3'; ctx.globalAlpha = 0.6;
    ctx.beginPath(); ctx.arc(0, -s*0.25, s*0.16, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = '#dc2626'; ctx.lineWidth = s*0.012;
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(0, -s*0.25, s*0.18 + i*s*0.04, -Math.PI/4, Math.PI/4); ctx.stroke(); } } };

export const mineral_chunk: ItemDef = { id: 'mineral_chunk', name: 'Mineral Chunk', world: 'asteroid_belt', sizeTier: 9, baseValue: 44, weight: 9,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#a16207';
    ctx.beginPath();
    ctx.moveTo(0, -s*0.32); ctx.lineTo(s*0.28, -s*0.13); ctx.lineTo(s*0.22, s*0.22); ctx.lineTo(-s*0.22, s*0.22); ctx.lineTo(-s*0.28, -s*0.13); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = c[2] || '#cbd5e1';
    ctx.beginPath();
    ctx.moveTo(0, -s*0.32); ctx.lineTo(s*0.0, s*0.0); ctx.lineTo(-s*0.28, -s*0.13); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = darken(c[1] || '#a16207', 0.4);
    ctx.beginPath();
    ctx.moveTo(0, s*0.0); ctx.lineTo(s*0.28, -s*0.13); ctx.lineTo(s*0.22, s*0.22); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = c[0]; ctx.globalAlpha = 0.6;
    ctx.beginPath(); ctx.moveTo(0, -s*0.32); ctx.lineTo(s*0.05, -s*0.18); ctx.lineTo(-s*0.05, -s*0.18); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1; } };

export const hollow_rock: ItemDef = { id: 'hollow_rock', name: 'Hollow Rock', world: 'asteroid_belt', sizeTier: 9, baseValue: 38, weight: 8,
  draw(ctx, s, c) { ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.arc(0, 0, s*0.4, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath(); ctx.arc(0, 0, s*0.25, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[1] || '#a16207';
    ctx.beginPath(); ctx.arc(0, 0, s*0.18, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#67e8f9'; ctx.globalAlpha = 0.7;
    ctx.beginPath(); ctx.arc(-s*0.05, -s*0.03, s*0.13, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = darken(c[0], 0.4);
    for (let i = 0; i < 6; i++) { const a = i*Math.PI/3;
      ctx.beginPath(); ctx.arc(Math.cos(a)*s*0.32, Math.sin(a)*s*0.32, s*0.025, 0, Math.PI*2); ctx.fill(); }
    itemHighlight(ctx, -s*0.18, -s*0.22, s*0.05, s*0.04); } };

export const drifting_capsule: ItemDef = { id: 'drifting_capsule', name: 'Drifting Capsule', world: 'asteroid_belt', sizeTier: 9, baseValue: 48, weight: 9,
  draw(ctx, s, c) { ctx.fillStyle = c[2] || '#cbd5e1';
    rRect(ctx, -s*0.32, -s*0.13, s*0.64, s*0.26, s*0.13); ctx.fill();
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.arc(s*0.18, 0, s*0.06, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = darken(c[2] || '#cbd5e1', 0.3);
    rRect(ctx, -s*0.05, -s*0.13, s*0.025, s*0.26, 0); ctx.fill();
    rRect(ctx, s*0.05, -s*0.13, s*0.025, s*0.26, 0); ctx.fill();
    ctx.fillStyle = c[1] || '#a16207';
    ctx.beginPath(); ctx.moveTo(-s*0.32, -s*0.05); ctx.lineTo(-s*0.4, -s*0.13); ctx.lineTo(-s*0.4, s*0.13); ctx.lineTo(-s*0.32, s*0.05); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#dc2626'; rRect(ctx, -s*0.28, -s*0.05, s*0.04, s*0.1, 0); ctx.fill();
    itemHighlight(ctx, -s*0.18, -s*0.06, s*0.13, s*0.04); } };

export const ore_vein: ItemDef = { id: 'ore_vein', name: 'Ore Vein', world: 'asteroid_belt', sizeTier: 9, baseValue: 41, weight: 9,
  draw(ctx, s, c) { ctx.fillStyle = c[0];
    ctx.beginPath();
    ctx.moveTo(-s*0.4, s*0.18); ctx.lineTo(-s*0.32, -s*0.32); ctx.lineTo(s*0.13, -s*0.32); ctx.lineTo(s*0.4, s*0.0); ctx.lineTo(s*0.32, s*0.32); ctx.lineTo(-s*0.18, s*0.32); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = c[1] || '#a16207';
    ctx.beginPath(); ctx.moveTo(-s*0.32, -s*0.18); ctx.lineTo(-s*0.05, -s*0.05); ctx.lineTo(s*0.18, s*0.0); ctx.lineTo(s*0.32, s*0.18); ctx.lineWidth = s*0.06; ctx.stroke();
    ctx.fillStyle = '#fde047';
    for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(-s*0.25 + i*s*0.1, -s*0.05 + i*s*0.04, s*0.025, 0, Math.PI*2); ctx.fill(); }
    ctx.fillStyle = darken(c[0], 0.4);
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(-s*0.18 + i*s*0.13, s*0.18, s*0.018, 0, Math.PI*2); ctx.fill(); }
    itemHighlight(ctx, -s*0.18, -s*0.22, s*0.1, s*0.04); } };

// SOLAR SYSTEM T10
export const planet_earth: ItemDef = { id: 'planet_earth', name: 'Earth', world: 'solar_system', sizeTier: 10, baseValue: 70, weight: 10,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#3b82f6';
    ctx.beginPath(); ctx.arc(0, 0, s*0.4, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#22c55e';
    ctx.beginPath(); ctx.ellipse(-s*0.13, -s*0.05, s*0.13, s*0.1, 0.2, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(s*0.18, s*0.13, s*0.1, s*0.07, -0.3, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(s*0.05, -s*0.18, s*0.07, s*0.05, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.6;
    ctx.beginPath(); ctx.ellipse(-s*0.05, s*0.05, s*0.16, s*0.04, 0.3, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(s*0.13, -s*0.13, s*0.1, s*0.03, -0.2, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, -s*0.4, s*0.06, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, s*0.4, s*0.05, 0, Math.PI*2); ctx.fill();
    itemHighlight(ctx, -s*0.18, -s*0.22, s*0.1, s*0.04); } };

export const planet_venus: ItemDef = { id: 'planet_venus', name: 'Venus', world: 'solar_system', sizeTier: 10, baseValue: 65, weight: 10,
  draw(ctx, s, c) { ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.arc(0, 0, s*0.4, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = darken(c[0], 0.2);
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.ellipse(0, -s*0.2 + i*s*0.1, s*0.32 - Math.abs(i-2)*s*0.05, s*0.04, 0, 0, Math.PI*2); ctx.fill(); }
    ctx.fillStyle = '#fef9c3'; ctx.globalAlpha = 0.4;
    ctx.beginPath(); ctx.ellipse(-s*0.1, -s*0.05, s*0.18, s*0.08, 0.3, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = darken(c[0], 0.4);
    ctx.beginPath(); ctx.arc(s*0.08, s*0.13, s*0.05, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(-s*0.18, s*0.05, s*0.04, 0, Math.PI*2); ctx.fill();
    itemHighlight(ctx, -s*0.18, -s*0.22, s*0.1, s*0.04); } };

export const planet_mars_ss: ItemDef = { id: 'planet_mars_ss', name: 'Mars', world: 'solar_system', sizeTier: 10, baseValue: 65, weight: 10,
  draw(ctx, s, c) { ctx.fillStyle = c[2] || '#dc2626';
    ctx.beginPath(); ctx.arc(0, 0, s*0.4, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = darken(c[2] || '#dc2626', 0.3);
    ctx.beginPath(); ctx.ellipse(-s*0.05, s*0.13, s*0.18, s*0.08, 0.3, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(s*0.18, -s*0.05, s*0.1, s*0.05, -0.2, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, -s*0.36, s*0.08, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, s*0.36, s*0.06, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = darken(c[2] || '#dc2626', 0.4);
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(-s*0.18 + i*s*0.1, -s*0.05 + Math.sin(i)*s*0.13, s*0.018, 0, Math.PI*2); ctx.fill(); }
    itemHighlight(ctx, -s*0.18, -s*0.22, s*0.1, s*0.04); } };

export const gas_giant: ItemDef = { id: 'gas_giant', name: 'Gas Giant', world: 'solar_system', sizeTier: 10, baseValue: 80, weight: 11,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#3b82f6';
    ctx.beginPath(); ctx.arc(0, 0, s*0.4, 0, Math.PI*2); ctx.fill();
    const bandCols = [c[2] || '#dc2626', c[0] || '#fbbf24', '#ffffff', c[2] || '#dc2626', c[0] || '#fbbf24'];
    for (let i = 0; i < 5; i++) { ctx.fillStyle = bandCols[i]; ctx.globalAlpha = 0.7;
      ctx.beginPath(); ctx.ellipse(0, -s*0.25 + i*s*0.13, s*0.4 - Math.abs(i-2)*s*0.04, s*0.05, 0, 0, Math.PI*2); ctx.fill(); }
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#dc2626';
    ctx.beginPath(); ctx.ellipse(-s*0.13, s*0.05, s*0.07, s*0.04, 0.2, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = darken(c[1] || '#3b82f6', 0.4); ctx.globalAlpha = 0.4;
    ctx.beginPath(); ctx.arc(s*0.13, s*0.13, s*0.18, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    itemHighlight(ctx, -s*0.18, -s*0.22, s*0.1, s*0.04); } };

export const sun_spot: ItemDef = { id: 'sun_spot', name: 'Sun Spot', world: 'solar_system', sizeTier: 10, baseValue: 75, weight: 9,
  draw(ctx, s, c) { ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.arc(0, 0, s*0.4, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fef9c3'; ctx.globalAlpha = 0.6;
    ctx.beginPath(); ctx.arc(0, 0, s*0.32, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#fb923c';
    for (let i = 0; i < 8; i++) { const a = i*Math.PI/4;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a)*s*0.4, Math.sin(a)*s*0.4);
      ctx.lineTo(Math.cos(a + 0.15)*s*0.5, Math.sin(a + 0.15)*s*0.5);
      ctx.lineTo(Math.cos(a - 0.15)*s*0.5, Math.sin(a - 0.15)*s*0.5);
      ctx.closePath(); ctx.fill(); }
    ctx.fillStyle = darken(c[0], 0.5);
    ctx.beginPath(); ctx.arc(s*0.1, s*0.05, s*0.05, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(-s*0.13, -s*0.1, s*0.04, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.arc(-s*0.1, -s*0.13, s*0.13, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1; } };

export const comet_ss: ItemDef = { id: 'comet_ss', name: 'Comet', world: 'solar_system', sizeTier: 10, baseValue: 60, weight: 9,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#3b82f6';
    ctx.beginPath(); ctx.arc(s*0.22, -s*0.22, s*0.13, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#67e8f9'; ctx.globalAlpha = 0.6;
    ctx.beginPath(); ctx.arc(s*0.22, -s*0.22, s*0.22, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = c[0]; ctx.globalAlpha = 0.7;
    for (let i = 0; i < 10; i++) { ctx.globalAlpha = 1 - i*0.1;
      ctx.beginPath();
      const x = s*0.15 - i*s*0.05, y = -s*0.15 + i*s*0.05;
      ctx.ellipse(x, y, s*0.06 - i*s*0.005, s*0.025, -0.785, 0, Math.PI*2); ctx.fill(); }
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(s*0.25, -s*0.25, s*0.04, 0, Math.PI*2); ctx.fill(); } };

export const asteroid_cluster: ItemDef = { id: 'asteroid_cluster', name: 'Asteroid Cluster', world: 'solar_system', sizeTier: 10, baseValue: 55, weight: 9,
  draw(ctx, s, c) { for (let i = 0; i < 7; i++) { ctx.fillStyle = i % 2 ? c[2] || '#dc2626' : '#a16207';
    const x = (Math.random()-0.5)*s*0.6;
    const y = (Math.random()-0.5)*s*0.6;
    const r = s*(0.05 + Math.random()*0.08);
    ctx.beginPath();
    ctx.moveTo(x, y - r); ctx.lineTo(x + r*0.8, y - r*0.3); ctx.lineTo(x + r, y + r*0.5); ctx.lineTo(x - r*0.3, y + r); ctx.lineTo(x - r, y); ctx.closePath();
    ctx.fill(); }
    ctx.fillStyle = '#fde047';
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc((Math.random()-0.5)*s*0.7, (Math.random()-0.5)*s*0.7, s*0.012, 0, Math.PI*2); ctx.fill(); } } };

export const dwarf_planet: ItemDef = { id: 'dwarf_planet', name: 'Dwarf Planet', world: 'solar_system', sizeTier: 10, baseValue: 60, weight: 9,
  draw(ctx, s, c) { ctx.fillStyle = c[2] || '#dc2626';
    ctx.beginPath(); ctx.arc(0, 0, s*0.28, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = darken(c[2] || '#dc2626', 0.3);
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(-s*0.15 + i*s*0.08, -s*0.05 + Math.sin(i)*s*0.13, s*0.025, 0, Math.PI*2); ctx.fill(); }
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, -s*0.25, s*0.06, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[0]; ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.ellipse(-s*0.05, -s*0.05, s*0.13, s*0.06, 0, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = darken(c[2] || '#dc2626', 0.5);
    ctx.beginPath(); ctx.arc(s*0.18, s*0.13, s*0.04, 0, Math.PI*2); ctx.fill();
    itemHighlight(ctx, -s*0.13, -s*0.18, s*0.06, s*0.04); } };

export const planetary_ring: ItemDef = { id: 'planetary_ring', name: 'Ringed Planet', world: 'solar_system', sizeTier: 10, baseValue: 78, weight: 11,
  draw(ctx, s, c) { ctx.strokeStyle = c[0]; ctx.lineWidth = s*0.05;
    ctx.beginPath(); ctx.ellipse(0, 0, s*0.4, s*0.13, 0.2, 0, Math.PI*2); ctx.stroke();
    ctx.strokeStyle = darken(c[0], 0.3); ctx.lineWidth = s*0.025;
    ctx.beginPath(); ctx.ellipse(0, 0, s*0.36, s*0.11, 0.2, 0, Math.PI*2); ctx.stroke();
    ctx.fillStyle = c[1] || '#3b82f6';
    ctx.beginPath(); ctx.arc(0, 0, s*0.22, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = darken(c[1] || '#3b82f6', 0.3);
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(0, -s*0.08 + i*s*0.08, s*0.18, s*0.025, 0, 0, Math.PI*2); ctx.fill(); }
    ctx.strokeStyle = c[0]; ctx.lineWidth = s*0.05;
    ctx.save(); ctx.beginPath(); ctx.arc(0, 0, s*0.22, 0, Math.PI*2); ctx.clip();
    ctx.beginPath(); ctx.ellipse(0, 0, s*0.4, s*0.13, 0.2, 0, Math.PI); ctx.stroke();
    ctx.restore();
    itemHighlight(ctx, -s*0.13, -s*0.18, s*0.06, s*0.04); } };

export const jupiter_storm: ItemDef = { id: 'jupiter_storm', name: 'Jupiter Storm', world: 'solar_system', sizeTier: 10, baseValue: 82, weight: 11,
  draw(ctx, s, c) { ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.arc(0, 0, s*0.4, 0, Math.PI*2); ctx.fill();
    const bands = ['#fef9c3', c[2] || '#dc2626', c[0], '#fef9c3', c[2] || '#dc2626'];
    for (let i = 0; i < 5; i++) { ctx.fillStyle = bands[i];
      ctx.beginPath(); ctx.ellipse(0, -s*0.25 + i*s*0.13, s*0.4 - Math.abs(i-2)*s*0.04, s*0.05, 0, 0, Math.PI*2); ctx.fill(); }
    ctx.fillStyle = '#dc2626';
    ctx.beginPath(); ctx.ellipse(s*0.05, s*0.05, s*0.13, s*0.07, 0.2, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = darken('#dc2626', 0.3);
    ctx.beginPath(); ctx.ellipse(s*0.05, s*0.05, s*0.08, s*0.04, 0.2, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fef9c3'; ctx.globalAlpha = 0.4;
    ctx.beginPath(); ctx.arc(-s*0.13, -s*0.13, s*0.18, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1; } };

// NEBULA T10
export const star_birth: ItemDef = { id: 'star_birth', name: 'Star Birth', world: 'nebula', sizeTier: 10, baseValue: 70, weight: 9,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.globalAlpha = 0.6;
    ctx.beginPath(); ctx.arc(0, 0, s*0.4, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[2] || '#22d3ee';
    ctx.beginPath(); ctx.arc(0, 0, s*0.32, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fef9c3';
    ctx.beginPath(); ctx.arc(0, 0, s*0.18, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, 0, s*0.08, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#fef9c3'; ctx.lineWidth = s*0.025; ctx.lineCap = 'round';
    for (let i = 0; i < 8; i++) { const a = i*Math.PI/4;
      ctx.beginPath(); ctx.moveTo(Math.cos(a)*s*0.13, Math.sin(a)*s*0.13); ctx.lineTo(Math.cos(a)*s*0.32, Math.sin(a)*s*0.32); ctx.stroke(); }
    ctx.fillStyle = c[1] || '#f472b6';
    for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc((Math.random()-0.5)*s*0.7, (Math.random()-0.5)*s*0.7, s*0.018, 0, Math.PI*2); ctx.fill(); } } };

export const gas_cloud: ItemDef = { id: 'gas_cloud', name: 'Gas Cloud', world: 'nebula', sizeTier: 10, baseValue: 55, weight: 8,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.arc(-s*0.18, s*0.05, s*0.22, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[1] || '#f472b6';
    ctx.beginPath(); ctx.arc(s*0.05, -s*0.13, s*0.25, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[2] || '#22d3ee';
    ctx.beginPath(); ctx.arc(s*0.18, s*0.13, s*0.22, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(s*0.0, s*0.0, s*0.13, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#fde047';
    for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.arc((Math.random()-0.5)*s*0.7, (Math.random()-0.5)*s*0.6, s*0.012, 0, Math.PI*2); ctx.fill(); } } };

export const pulsar: ItemDef = { id: 'pulsar', name: 'Pulsar', world: 'nebula', sizeTier: 10, baseValue: 75, weight: 9,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.globalAlpha = 0.4;
    ctx.beginPath(); ctx.arc(0, 0, s*0.32, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, 0, s*0.08, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[2] || '#22d3ee'; ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(s*0.4, -s*0.13); ctx.lineTo(s*0.4, s*0.13); ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(-s*0.4, -s*0.13); ctx.lineTo(-s*0.4, s*0.13); ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = c[1] || '#f472b6';
    ctx.beginPath(); ctx.arc(s*0.4, 0, s*0.04, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(-s*0.4, 0, s*0.04, 0, Math.PI*2); ctx.fill();
    for (let i = 0; i < 5; i++) { ctx.fillStyle = '#fde047'; ctx.beginPath(); ctx.arc((Math.random()-0.5)*s*0.7, (Math.random()-0.5)*s*0.7, s*0.015, 0, Math.PI*2); ctx.fill(); } } };

export const dying_star: ItemDef = { id: 'dying_star', name: 'Dying Star', world: 'nebula', sizeTier: 10, baseValue: 72, weight: 10,
  draw(ctx, s, c) { ctx.fillStyle = '#dc2626';
    ctx.beginPath(); ctx.arc(0, 0, s*0.32, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ea580c';
    ctx.beginPath(); ctx.arc(0, 0, s*0.22, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath(); ctx.arc(0, 0, s*0.13, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fef9c3';
    ctx.beginPath(); ctx.arc(0, 0, s*0.05, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#dc2626'; ctx.lineWidth = s*0.025;
    for (let i = 0; i < 12; i++) { const a = i*Math.PI/6;
      ctx.beginPath(); ctx.moveTo(Math.cos(a)*s*0.32, Math.sin(a)*s*0.32); ctx.lineTo(Math.cos(a)*s*0.4, Math.sin(a)*s*0.4); ctx.stroke(); }
    ctx.fillStyle = c[1] || '#f472b6'; ctx.globalAlpha = 0.4;
    ctx.beginPath(); ctx.arc(0, 0, s*0.45, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1; } };

export const supernova_fragment: ItemDef = { id: 'supernova_fragment', name: 'Supernova Fragment', world: 'nebula', sizeTier: 10, baseValue: 78, weight: 9,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#f472b6'; ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.arc(0, 0, s*0.4, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = c[2] || '#22d3ee';
    ctx.beginPath();
    ctx.moveTo(-s*0.32, -s*0.05); ctx.lineTo(-s*0.13, -s*0.32); ctx.lineTo(s*0.05, -s*0.13); ctx.lineTo(s*0.32, -s*0.18); ctx.lineTo(s*0.18, s*0.13); ctx.lineTo(s*0.13, s*0.32); ctx.lineTo(-s*0.13, s*0.13); ctx.lineTo(-s*0.18, s*0.32); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fef9c3';
    ctx.beginPath(); ctx.arc(0, 0, s*0.1, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#fde047'; ctx.lineWidth = s*0.012;
    for (let i = 0; i < 12; i++) { const a = i*Math.PI/6;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a)*s*0.4, Math.sin(a)*s*0.4); ctx.stroke(); }
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, 0, s*0.04, 0, Math.PI*2); ctx.fill(); } };

export const dark_matter_wisp: ItemDef = { id: 'dark_matter_wisp', name: 'Dark Matter Wisp', world: 'nebula', sizeTier: 10, baseValue: 65, weight: 8,
  draw(ctx, s, c) { ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(-s*0.4, s*0.0);
    ctx.bezierCurveTo(-s*0.32, -s*0.32, s*0.0, -s*0.32, s*0.13, -s*0.05);
    ctx.bezierCurveTo(s*0.32, s*0.05, s*0.4, s*0.32, s*0.18, s*0.32);
    ctx.bezierCurveTo(-s*0.05, s*0.32, -s*0.32, s*0.18, -s*0.4, s*0.0);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[0]; ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.moveTo(-s*0.32, s*0.0); ctx.bezierCurveTo(-s*0.18, -s*0.22, s*0.0, -s*0.22, s*0.1, -s*0.05); ctx.bezierCurveTo(s*0.0, -s*0.13, -s*0.18, -s*0.05, -s*0.32, s*0.0); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = c[1] || '#f472b6'; ctx.globalAlpha = 0.7;
    for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc((Math.random()-0.5)*s*0.6, (Math.random()-0.5)*s*0.5, s*0.025, 0, Math.PI*2); ctx.fill(); }
    ctx.globalAlpha = 1; } };

export const ion_stream: ItemDef = { id: 'ion_stream', name: 'Ion Stream', world: 'nebula', sizeTier: 10, baseValue: 60, weight: 8,
  draw(ctx, s, c) { ctx.strokeStyle = c[2] || '#22d3ee'; ctx.lineWidth = s*0.06; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-s*0.4, s*0.18);
    ctx.bezierCurveTo(-s*0.13, -s*0.13, s*0.0, s*0.13, s*0.13, -s*0.18);
    ctx.bezierCurveTo(s*0.22, -s*0.32, s*0.32, -s*0.18, s*0.4, s*0.0);
    ctx.stroke();
    ctx.strokeStyle = c[1] || '#f472b6'; ctx.lineWidth = s*0.04;
    ctx.beginPath();
    ctx.moveTo(-s*0.4, s*0.0);
    ctx.bezierCurveTo(-s*0.13, -s*0.32, s*0.0, s*0.0, s*0.13, -s*0.32);
    ctx.bezierCurveTo(s*0.22, -s*0.18, s*0.32, s*0.0, s*0.4, -s*0.13);
    ctx.stroke();
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.arc(-s*0.4, s*0.18, s*0.05, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.4, s*0.0, s*0.05, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fef9c3';
    for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.arc(-s*0.32 + i*s*0.1, Math.sin(i)*s*0.13, s*0.012, 0, Math.PI*2); ctx.fill(); } } };

export const light_wave: ItemDef = { id: 'light_wave', name: 'Light Wave', world: 'nebula', sizeTier: 10, baseValue: 58, weight: 7,
  draw(ctx, s, c) { for (let r = 0; r < 4; r++) { ctx.strokeStyle = r % 2 ? c[1] || '#f472b6' : c[2] || '#22d3ee'; ctx.lineWidth = s*0.025; ctx.globalAlpha = 1 - r*0.2;
    ctx.beginPath(); ctx.arc(0, 0, s*0.13 + r*s*0.07, 0, Math.PI*2); ctx.stroke(); }
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, 0, s*0.08, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fde047';
    for (let i = 0; i < 6; i++) { const a = i*Math.PI/3;
      ctx.beginPath(); ctx.arc(Math.cos(a)*s*0.32, Math.sin(a)*s*0.32, s*0.018, 0, Math.PI*2); ctx.fill(); }
    ctx.fillStyle = c[0]; ctx.globalAlpha = 0.3;
    ctx.beginPath(); ctx.arc(0, 0, s*0.4, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1; } };

export const cosmic_dust: ItemDef = { id: 'cosmic_dust', name: 'Cosmic Dust', world: 'nebula', sizeTier: 10, baseValue: 52, weight: 7,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.globalAlpha = 0.3;
    ctx.beginPath(); ctx.arc(0, 0, s*0.4, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    for (let i = 0; i < 30; i++) { ctx.fillStyle = i % 3 === 0 ? c[1] || '#f472b6' : i % 3 === 1 ? c[2] || '#22d3ee' : '#ffffff';
      ctx.beginPath(); ctx.arc((Math.random()-0.5)*s*0.7, (Math.random()-0.5)*s*0.7, s*(0.005 + Math.random()*0.012), 0, Math.PI*2); ctx.fill(); }
    ctx.fillStyle = '#fde047';
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc((Math.random()-0.5)*s*0.6, (Math.random()-0.5)*s*0.5, s*0.018, 0, Math.PI*2); ctx.fill(); } } };

export const plasma_sphere: ItemDef = { id: 'plasma_sphere', name: 'Plasma Sphere', world: 'nebula', sizeTier: 10, baseValue: 75, weight: 9,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.globalAlpha = 0.6;
    ctx.beginPath(); ctx.arc(0, 0, s*0.4, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[2] || '#22d3ee';
    ctx.beginPath(); ctx.arc(0, 0, s*0.32, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[1] || '#f472b6';
    ctx.beginPath(); ctx.arc(0, 0, s*0.18, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fef9c3';
    ctx.beginPath(); ctx.arc(0, 0, s*0.06, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = '#fde047'; ctx.lineWidth = s*0.012;
    for (let i = 0; i < 6; i++) { const a = i*Math.PI/3;
      ctx.beginPath();
      const len = s*0.32;
      const sx = Math.cos(a)*s*0.06, sy = Math.sin(a)*s*0.06;
      const ex = Math.cos(a)*len, ey = Math.sin(a)*len;
      const mx = (sx+ex)/2 + Math.cos(a + Math.PI/2)*s*0.06, my = (sy+ey)/2 + Math.sin(a + Math.PI/2)*s*0.06;
      ctx.moveTo(sx, sy); ctx.quadraticCurveTo(mx, my, ex, ey); ctx.stroke(); }
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, 0, s*0.025, 0, Math.PI*2); ctx.fill(); } };

// GALAXY T10
export const spiral_arm: ItemDef = { id: 'spiral_arm', name: 'Spiral Arm', world: 'galaxy', sizeTier: 10, baseValue: 80, weight: 10,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.globalAlpha = 0.4;
    ctx.beginPath(); ctx.arc(0, 0, s*0.4, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#fef9c3';
    ctx.beginPath(); ctx.arc(0, 0, s*0.08, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = c[2] || '#22d3ee'; ctx.lineWidth = s*0.04;
    for (let arm = 0; arm < 4; arm++) { ctx.beginPath();
      for (let t = 0; t < 30; t++) { const angle = t*0.18 + arm*Math.PI/2; const r = s*0.05 + t*s*0.011;
        if (t === 0) ctx.moveTo(Math.cos(angle)*r, Math.sin(angle)*r);
        else ctx.lineTo(Math.cos(angle)*r, Math.sin(angle)*r); }
      ctx.stroke(); }
    ctx.fillStyle = c[1] || '#fbbf24'; ctx.globalAlpha = 0.8;
    for (let i = 0; i < 20; i++) { const a = Math.random()*Math.PI*2; const r = s*(0.1 + Math.random()*0.3);
      ctx.beginPath(); ctx.arc(Math.cos(a)*r, Math.sin(a)*r, s*0.012, 0, Math.PI*2); ctx.fill(); }
    ctx.globalAlpha = 1; } };

export const star_cluster: ItemDef = { id: 'star_cluster', name: 'Star Cluster', world: 'galaxy', sizeTier: 10, baseValue: 70, weight: 9,
  draw(ctx, s, c) { ctx.fillStyle = c[2] || '#22d3ee'; ctx.globalAlpha = 0.4;
    ctx.beginPath(); ctx.arc(0, 0, s*0.4, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#fef9c3';
    for (let i = 0; i < 15; i++) { const a = (Math.random())*Math.PI*2; const r = Math.random()*s*0.32;
      ctx.beginPath();
      ctx.arc(Math.cos(a)*r, Math.sin(a)*r, s*(0.018 + Math.random()*0.025), 0, Math.PI*2); ctx.fill(); }
    ctx.fillStyle = c[0];
    for (let i = 0; i < 10; i++) { const a = (Math.random())*Math.PI*2; const r = Math.random()*s*0.32;
      ctx.beginPath(); ctx.arc(Math.cos(a)*r, Math.sin(a)*r, s*(0.008 + Math.random()*0.012), 0, Math.PI*2); ctx.fill(); }
    ctx.fillStyle = c[1] || '#fbbf24';
    ctx.beginPath(); ctx.arc(0, 0, s*0.05, 0, Math.PI*2); ctx.fill(); } };

export const small_black_hole: ItemDef = { id: 'small_black_hole', name: 'Black Hole', world: 'galaxy', sizeTier: 10, baseValue: 88, weight: 10,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#fbbf24'; ctx.globalAlpha = 0.6;
    ctx.beginPath(); ctx.arc(0, 0, s*0.4, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = c[0]; ctx.lineWidth = s*0.06;
    ctx.beginPath(); ctx.ellipse(0, 0, s*0.32, s*0.18, 0, 0, Math.PI*2); ctx.stroke();
    ctx.strokeStyle = c[2] || '#22d3ee'; ctx.lineWidth = s*0.04;
    ctx.beginPath(); ctx.ellipse(0, 0, s*0.36, s*0.22, 0, 0, Math.PI*2); ctx.stroke();
    ctx.fillStyle = '#000000';
    ctx.beginPath(); ctx.arc(0, 0, s*0.18, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[1] || '#fbbf24'; ctx.globalAlpha = 0.8;
    ctx.beginPath(); ctx.arc(0, 0, s*0.13, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#000000';
    ctx.beginPath(); ctx.arc(0, 0, s*0.08, 0, Math.PI*2); ctx.fill(); } };

export const galactic_core: ItemDef = { id: 'galactic_core', name: 'Galactic Core', world: 'galaxy', sizeTier: 10, baseValue: 90, weight: 11,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.arc(0, 0, s*0.4, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[1] || '#fbbf24';
    ctx.beginPath(); ctx.arc(0, 0, s*0.32, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fef9c3';
    ctx.beginPath(); ctx.arc(0, 0, s*0.22, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, 0, s*0.13, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = '#fef9c3'; ctx.lineWidth = s*0.025; ctx.lineCap = 'round';
    for (let i = 0; i < 16; i++) { const a = i*Math.PI/8;
      ctx.beginPath(); ctx.moveTo(Math.cos(a)*s*0.18, Math.sin(a)*s*0.18); ctx.lineTo(Math.cos(a)*s*0.4, Math.sin(a)*s*0.4); ctx.stroke(); }
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, 0, s*0.05, 0, Math.PI*2); ctx.fill(); } };

export const dark_nebula: ItemDef = { id: 'dark_nebula', name: 'Dark Nebula', world: 'galaxy', sizeTier: 10, baseValue: 68, weight: 9,
  draw(ctx, s, c) { ctx.fillStyle = c[2] || '#22d3ee'; ctx.globalAlpha = 0.4;
    ctx.beginPath(); ctx.arc(0, 0, s*0.4, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.moveTo(-s*0.3, -s*0.05); ctx.bezierCurveTo(-s*0.32, -s*0.32, s*0.05, -s*0.32, s*0.18, -s*0.13); ctx.bezierCurveTo(s*0.32, s*0.05, s*0.18, s*0.32, s*0.0, s*0.32); ctx.bezierCurveTo(-s*0.18, s*0.22, -s*0.32, s*0.18, -s*0.3, -s*0.05); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = c[0]; ctx.globalAlpha = 0.4;
    for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.arc(-s*0.18 + i*s*0.05, -s*0.13 + Math.sin(i)*s*0.18, s*(0.025 + Math.random()*0.02), 0, Math.PI*2); ctx.fill(); }
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#fef9c3';
    for (let i = 0; i < 12; i++) { ctx.beginPath(); ctx.arc((Math.random()-0.5)*s*0.7, (Math.random()-0.5)*s*0.7, s*0.012, 0, Math.PI*2); ctx.fill(); } } };

export const neutron_star: ItemDef = { id: 'neutron_star', name: 'Neutron Star', world: 'galaxy', sizeTier: 10, baseValue: 82, weight: 10,
  draw(ctx, s, c) { ctx.fillStyle = c[2] || '#22d3ee'; ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.arc(0, 0, s*0.4, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[1] || '#fbbf24';
    ctx.beginPath(); ctx.arc(0, 0, s*0.18, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, 0, s*0.1, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = c[0]; ctx.lineWidth = s*0.025; ctx.globalAlpha = 0.7;
    for (let r = 0; r < 4; r++) { ctx.beginPath(); ctx.arc(0, 0, s*0.18 + r*s*0.06, 0, Math.PI*2); ctx.stroke(); }
    ctx.globalAlpha = 1;
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.moveTo(-s*0.4, -s*0.04); ctx.lineTo(s*0.4, -s*0.04); ctx.lineTo(s*0.4, s*0.04); ctx.lineTo(-s*0.4, s*0.04); ctx.closePath();
    ctx.globalAlpha = 0.5; ctx.fill(); ctx.globalAlpha = 1; } };

export const quasar: ItemDef = { id: 'quasar', name: 'Quasar', world: 'galaxy', sizeTier: 10, baseValue: 85, weight: 10,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#fbbf24'; ctx.globalAlpha = 0.4;
    ctx.beginPath(); ctx.arc(0, 0, s*0.4, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[0];
    ctx.beginPath();
    ctx.moveTo(0, -s*0.4); ctx.lineTo(s*0.05, -s*0.05); ctx.lineTo(s*0.13, -s*0.05); ctx.lineTo(s*0.0, s*0.4); ctx.lineTo(-s*0.13, -s*0.05); ctx.lineTo(-s*0.05, -s*0.05); ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#fef9c3';
    ctx.beginPath(); ctx.arc(0, 0, s*0.13, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, 0, s*0.05, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[2] || '#22d3ee'; ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.moveTo(-s*0.4, 0); ctx.lineTo(-s*0.05, -s*0.05); ctx.lineTo(-s*0.05, s*0.05); ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(s*0.4, 0); ctx.lineTo(s*0.05, -s*0.05); ctx.lineTo(s*0.05, s*0.05); ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1; } };

export const galactic_dust: ItemDef = { id: 'galactic_dust', name: 'Galactic Dust', world: 'galaxy', sizeTier: 10, baseValue: 55, weight: 8,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.globalAlpha = 0.3;
    ctx.beginPath(); ctx.ellipse(0, 0, s*0.4, s*0.18, 0.2, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    for (let i = 0; i < 40; i++) { ctx.fillStyle = i % 4 === 0 ? c[1] || '#fbbf24' : i % 4 === 1 ? c[2] || '#22d3ee' : i % 4 === 2 ? '#ffffff' : c[0];
      ctx.beginPath(); ctx.arc((Math.random()-0.5)*s*0.7, (Math.random()-0.5)*s*0.36, s*(0.005 + Math.random()*0.012), 0, Math.PI*2); ctx.fill(); }
    ctx.fillStyle = '#fef9c3';
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc((Math.random()-0.5)*s*0.6, (Math.random()-0.5)*s*0.3, s*0.018, 0, Math.PI*2); ctx.fill(); } } };

export const dyson_sphere: ItemDef = { id: 'dyson_sphere', name: 'Dyson Sphere', world: 'galaxy', sizeTier: 10, baseValue: 90, weight: 11,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#fbbf24';
    ctx.beginPath(); ctx.arc(0, 0, s*0.18, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fef9c3'; ctx.globalAlpha = 0.6;
    ctx.beginPath(); ctx.arc(0, 0, s*0.25, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = c[0]; ctx.lineWidth = s*0.04;
    for (let i = 0; i < 6; i++) { ctx.beginPath();
      ctx.ellipse(0, 0, s*0.4, s*0.13, i*Math.PI/6, 0, Math.PI*2); ctx.stroke(); }
    ctx.fillStyle = c[2] || '#22d3ee';
    for (let i = 0; i < 12; i++) { const a = i*Math.PI/6;
      ctx.beginPath(); ctx.arc(Math.cos(a)*s*0.4, Math.sin(a)*s*0.13, s*0.025, 0, Math.PI*2); ctx.fill(); }
    ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.4;
    ctx.beginPath(); ctx.arc(-s*0.05, -s*0.05, s*0.08, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1; } };

export const alien_megastructure: ItemDef = { id: 'alien_megastructure', name: 'Alien Megastructure', world: 'galaxy', sizeTier: 10, baseValue: 95, weight: 11,
  draw(ctx, s, c) { ctx.fillStyle = c[2] || '#22d3ee';
    ctx.beginPath();
    ctx.moveTo(-s*0.32, -s*0.32); ctx.lineTo(s*0.32, -s*0.32); ctx.lineTo(s*0.4, s*0.0); ctx.lineTo(s*0.32, s*0.32); ctx.lineTo(-s*0.32, s*0.32); ctx.lineTo(-s*0.4, s*0.0); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = c[0];
    ctx.beginPath();
    ctx.moveTo(-s*0.18, -s*0.18); ctx.lineTo(s*0.18, -s*0.18); ctx.lineTo(s*0.22, s*0.0); ctx.lineTo(s*0.18, s*0.18); ctx.lineTo(-s*0.18, s*0.18); ctx.lineTo(-s*0.22, s*0.0); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = c[1] || '#fbbf24';
    ctx.beginPath(); ctx.arc(0, 0, s*0.08, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fef9c3'; ctx.globalAlpha = 0.7;
    ctx.beginPath(); ctx.arc(0, 0, s*0.13, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = '#67e8f9'; ctx.lineWidth = s*0.018;
    for (let i = 0; i < 6; i++) { const a = i*Math.PI/3;
      ctx.beginPath(); ctx.moveTo(Math.cos(a)*s*0.13, Math.sin(a)*s*0.13); ctx.lineTo(Math.cos(a)*s*0.32, Math.sin(a)*s*0.32); ctx.stroke(); }
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, 0, s*0.04, 0, Math.PI*2); ctx.fill(); } };

// UNIVERSE EDGE T11
export const cosmic_web: ItemDef = { id: 'cosmic_web', name: 'Cosmic Web', world: 'universe_edge', sizeTier: 11, baseValue: 110, weight: 11,
  draw(ctx, s, c) { ctx.strokeStyle = c[1] || '#a78bfa'; ctx.lineWidth = s*0.018;
    const nodes: [number, number][] = [];
    for (let i = 0; i < 8; i++) { const a = i*Math.PI/4 + Math.random()*0.3; const r = s*(0.18 + Math.random()*0.18);
      nodes.push([Math.cos(a)*r, Math.sin(a)*r]); }
    for (let i = 0; i < nodes.length; i++) { for (let j = i + 1; j < nodes.length; j++) {
      ctx.globalAlpha = 0.6;
      ctx.beginPath(); ctx.moveTo(nodes[i][0], nodes[i][1]); ctx.lineTo(nodes[j][0], nodes[j][1]); ctx.stroke(); } }
    ctx.globalAlpha = 1;
    ctx.fillStyle = c[0];
    nodes.forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, s*0.04, 0, Math.PI*2); ctx.fill(); });
    ctx.fillStyle = c[2] || '#fde047';
    ctx.beginPath(); ctx.arc(0, 0, s*0.06, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    nodes.forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, s*0.018, 0, Math.PI*2); ctx.fill(); }); } };

export const void_bubble: ItemDef = { id: 'void_bubble', name: 'Void Bubble', world: 'universe_edge', sizeTier: 11, baseValue: 100, weight: 10,
  draw(ctx, s, c) { ctx.fillStyle = '#000000';
    ctx.beginPath(); ctx.arc(0, 0, s*0.4, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = c[1] || '#a78bfa'; ctx.lineWidth = s*0.04;
    ctx.beginPath(); ctx.arc(0, 0, s*0.32, 0, Math.PI*2); ctx.stroke();
    ctx.strokeStyle = c[0]; ctx.lineWidth = s*0.025;
    ctx.beginPath(); ctx.arc(0, 0, s*0.4, 0, Math.PI*2); ctx.stroke();
    ctx.fillStyle = c[2] || '#fde047';
    for (let i = 0; i < 5; i++) { const a = i*Math.PI*2/5;
      ctx.beginPath(); ctx.arc(Math.cos(a)*s*0.36, Math.sin(a)*s*0.36, s*0.025, 0, Math.PI*2); ctx.fill(); }
    ctx.fillStyle = c[1] || '#a78bfa'; ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.arc(-s*0.13, -s*0.13, s*0.13, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1; } };

export const antimatter_cluster: ItemDef = { id: 'antimatter_cluster', name: 'Antimatter Cluster', world: 'universe_edge', sizeTier: 11, baseValue: 115, weight: 11,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#a78bfa'; ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.arc(0, 0, s*0.4, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = c[0];
    for (let i = 0; i < 5; i++) { const a = i*Math.PI*2/5 - Math.PI/2;
      ctx.beginPath(); ctx.arc(Math.cos(a)*s*0.18, Math.sin(a)*s*0.18, s*0.07, 0, Math.PI*2); ctx.fill(); }
    ctx.fillStyle = c[2] || '#fde047';
    ctx.beginPath(); ctx.arc(0, 0, s*0.08, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = s*0.012;
    for (let i = 0; i < 5; i++) { const a = i*Math.PI*2/5 - Math.PI/2;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a)*s*0.18, Math.sin(a)*s*0.18); ctx.stroke(); }
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.arc((Math.random()-0.5)*s*0.7, (Math.random()-0.5)*s*0.7, s*0.012, 0, Math.PI*2); ctx.fill(); } } };

export const big_bang_echo: ItemDef = { id: 'big_bang_echo', name: 'Big Bang Echo', world: 'universe_edge', sizeTier: 11, baseValue: 120, weight: 11,
  draw(ctx, s, c) { for (let r = 0; r < 6; r++) { const cols = ['#dc2626', c[2] || '#fde047', c[0], c[1] || '#a78bfa', '#22d3ee', '#3b82f6'];
    ctx.strokeStyle = cols[r]; ctx.lineWidth = s*0.025; ctx.globalAlpha = 1 - r*0.13;
    ctx.beginPath(); ctx.arc(0, 0, s*0.06 + r*s*0.06, 0, Math.PI*2); ctx.stroke(); }
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#fef9c3';
    ctx.beginPath(); ctx.arc(0, 0, s*0.05, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, 0, s*0.025, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#fef9c3'; ctx.lineWidth = s*0.012; ctx.lineCap = 'round';
    for (let i = 0; i < 12; i++) { const a = i*Math.PI/6;
      ctx.beginPath(); ctx.moveTo(Math.cos(a)*s*0.05, Math.sin(a)*s*0.05); ctx.lineTo(Math.cos(a)*s*0.36, Math.sin(a)*s*0.36); ctx.stroke(); } } };

export const cosmic_string: ItemDef = { id: 'cosmic_string', name: 'Cosmic String', world: 'universe_edge', sizeTier: 11, baseValue: 105, weight: 10,
  draw(ctx, s, c) { ctx.strokeStyle = c[1] || '#a78bfa'; ctx.lineWidth = s*0.04; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-s*0.4, -s*0.32);
    ctx.bezierCurveTo(-s*0.2, s*0.1, s*0.1, -s*0.2, s*0.4, s*0.32);
    ctx.stroke();
    ctx.strokeStyle = c[2] || '#fde047'; ctx.lineWidth = s*0.025;
    ctx.beginPath();
    ctx.moveTo(-s*0.4, -s*0.32);
    ctx.bezierCurveTo(-s*0.2, s*0.1, s*0.1, -s*0.2, s*0.4, s*0.32);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 8; i++) { const t = i/7;
      const x = -s*0.4 + t*s*0.8; const y = -s*0.32 + t*s*0.64 + Math.sin(t*Math.PI*2)*s*0.13;
      ctx.beginPath(); ctx.arc(x, y, s*0.018, 0, Math.PI*2); ctx.fill(); }
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.arc(-s*0.4, -s*0.32, s*0.05, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.4, s*0.32, s*0.05, 0, Math.PI*2); ctx.fill(); } };

export const universe_filament: ItemDef = { id: 'universe_filament', name: 'Universe Filament', world: 'universe_edge', sizeTier: 11, baseValue: 100, weight: 10,
  draw(ctx, s, c) { ctx.strokeStyle = c[1] || '#a78bfa'; ctx.lineWidth = s*0.018;
    for (let r = 0; r < 5; r++) { const offsetY = -s*0.2 + r*s*0.1;
      ctx.beginPath();
      ctx.moveTo(-s*0.4, offsetY);
      for (let i = 0; i < 8; i++) { ctx.lineTo(-s*0.32 + i*s*0.1, offsetY + Math.sin(i + r)*s*0.04); }
      ctx.lineTo(s*0.4, offsetY); ctx.stroke(); }
    ctx.fillStyle = c[2] || '#fde047';
    for (let r = 0; r < 5; r++) { const offsetY = -s*0.2 + r*s*0.1;
      for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(-s*0.3 + i*s*0.13, offsetY, s*0.025, 0, Math.PI*2); ctx.fill(); } }
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.arc((Math.random()-0.5)*s*0.7, (Math.random()-0.5)*s*0.6, s*0.012, 0, Math.PI*2); ctx.fill(); } } };

export const dark_energy: ItemDef = { id: 'dark_energy', name: 'Dark Energy', world: 'universe_edge', sizeTier: 11, baseValue: 110, weight: 11,
  draw(ctx, s, c) { ctx.fillStyle = '#000000';
    ctx.beginPath(); ctx.arc(0, 0, s*0.4, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[1] || '#a78bfa'; ctx.globalAlpha = 0.6;
    ctx.beginPath(); ctx.arc(0, 0, s*0.32, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[2] || '#fde047'; ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.arc(0, 0, s*0.22, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = c[0]; ctx.lineWidth = s*0.025;
    for (let i = 0; i < 8; i++) { const a = i*Math.PI/4;
      ctx.beginPath();
      const r1 = s*0.13, r2 = s*0.4;
      ctx.moveTo(Math.cos(a)*r1, Math.sin(a)*r1); ctx.lineTo(Math.cos(a)*r2, Math.sin(a)*r2);
      ctx.stroke(); }
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, 0, s*0.06, 0, Math.PI*2); ctx.fill();
    for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc((Math.random()-0.5)*s*0.7, (Math.random()-0.5)*s*0.7, s*0.012, 0, Math.PI*2); ctx.fill(); } } };

export const light_bend: ItemDef = { id: 'light_bend', name: 'Light Bend', world: 'universe_edge', sizeTier: 11, baseValue: 95, weight: 9,
  draw(ctx, s, c) { ctx.strokeStyle = '#ffffff'; ctx.lineWidth = s*0.025; ctx.globalAlpha = 0.7;
    for (let i = 0; i < 6; i++) { const offset = -s*0.32 + i*s*0.13;
      ctx.beginPath();
      ctx.moveTo(-s*0.4, offset);
      for (let t = 0; t < 8; t++) { const x = -s*0.4 + t*s*0.13; const distFactor = 1 - Math.abs(x)/(s*0.4);
        const y = offset + distFactor*s*0.13;
        ctx.lineTo(x, y); }
      ctx.stroke(); }
    ctx.globalAlpha = 1;
    ctx.fillStyle = c[1] || '#a78bfa';
    ctx.beginPath(); ctx.arc(0, 0, s*0.18, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.beginPath(); ctx.arc(0, 0, s*0.13, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[2] || '#fde047';
    for (let i = 0; i < 6; i++) { const a = i*Math.PI/3;
      ctx.beginPath(); ctx.arc(Math.cos(a)*s*0.18, Math.sin(a)*s*0.18, s*0.018, 0, Math.PI*2); ctx.fill(); } } };

export const primordial_atom: ItemDef = { id: 'primordial_atom', name: 'Primordial Atom', world: 'universe_edge', sizeTier: 11, baseValue: 105, weight: 10,
  draw(ctx, s, c) { ctx.strokeStyle = c[2] || '#fde047'; ctx.lineWidth = s*0.018;
    ctx.beginPath(); ctx.ellipse(0, 0, s*0.36, s*0.13, 0, 0, Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0, 0, s*0.36, s*0.13, Math.PI/3, 0, Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0, 0, s*0.36, s*0.13, -Math.PI/3, 0, Math.PI*2); ctx.stroke();
    ctx.fillStyle = c[1] || '#a78bfa';
    ctx.beginPath(); ctx.arc(0, 0, s*0.13, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.arc(s*0.36, 0, s*0.04, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(-s*0.18, s*0.32, s*0.04, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(-s*0.18, -s*0.32, s*0.04, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fef9c3';
    ctx.beginPath(); ctx.arc(0, 0, s*0.05, 0, Math.PI*2); ctx.fill(); } };

export const edge_wall: ItemDef = { id: 'edge_wall', name: 'Edge Wall', world: 'universe_edge', sizeTier: 11, baseValue: 120, weight: 11,
  draw(ctx, s, c) { ctx.fillStyle = '#000000';
    ctx.fillRect(s*0.0, -s*0.4, s*0.4, s*0.8);
    ctx.fillStyle = c[1] || '#a78bfa'; ctx.globalAlpha = 0.5;
    ctx.fillRect(-s*0.4, -s*0.4, s*0.4, s*0.8);
    ctx.globalAlpha = 1;
    const grad = ctx.createLinearGradient(-s*0.05, 0, s*0.05, 0);
    grad.addColorStop(0, c[1] || '#a78bfa'); grad.addColorStop(0.5, '#ffffff'); grad.addColorStop(1, '#000000');
    ctx.fillStyle = grad;
    ctx.fillRect(-s*0.05, -s*0.4, s*0.1, s*0.8);
    ctx.fillStyle = c[2] || '#fde047';
    for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.arc(-s*0.32 + Math.random()*s*0.13, -s*0.32 + Math.random()*s*0.64, s*0.018, 0, Math.PI*2); ctx.fill(); }
    ctx.fillStyle = c[0];
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(s*0.18 + Math.random()*s*0.18, -s*0.32 + Math.random()*s*0.64, s*0.018, 0, Math.PI*2); ctx.fill(); }
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = s*0.018;
    ctx.beginPath(); ctx.moveTo(0, -s*0.4); ctx.lineTo(0, s*0.4); ctx.stroke(); } };

// MULTIVERSE T12
export const parallel_earth: ItemDef = { id: 'parallel_earth', name: 'Parallel Earth', world: 'multiverse', sizeTier: 12, baseValue: 140, weight: 11,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#22d3ee';
    ctx.beginPath(); ctx.arc(0, 0, s*0.4, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.ellipse(-s*0.13, s*0.0, s*0.13, s*0.1, 0.2, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(s*0.18, s*0.13, s*0.1, s*0.07, -0.3, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[2] || '#fbbf24'; ctx.globalAlpha = 0.7;
    ctx.beginPath(); ctx.ellipse(-s*0.05, s*0.05, s*0.18, s*0.04, 0.3, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, -s*0.4, s*0.06, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#000000'; ctx.globalAlpha = 0.4;
    ctx.beginPath(); ctx.arc(0, 0, s*0.4, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = c[2] || '#fbbf24'; ctx.lineWidth = s*0.025;
    ctx.beginPath(); ctx.arc(0, 0, s*0.4, 0, Math.PI*2); ctx.stroke();
    itemHighlight(ctx, -s*0.18, -s*0.22, s*0.1, s*0.04); } };

export const mirror_universe: ItemDef = { id: 'mirror_universe', name: 'Mirror Universe', world: 'multiverse', sizeTier: 12, baseValue: 150, weight: 11,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.arc(-s*0.13, 0, s*0.32, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[1] || '#22d3ee';
    ctx.beginPath(); ctx.arc(s*0.13, 0, s*0.32, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.moveTo(-s*0.04, -s*0.4); ctx.lineTo(s*0.04, -s*0.4); ctx.lineTo(s*0.04, s*0.4); ctx.lineTo(-s*0.04, s*0.4); ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[2] || '#fbbf24';
    ctx.beginPath(); ctx.arc(-s*0.18, 0, s*0.07, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.18, 0, s*0.07, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.beginPath(); ctx.arc(-s*0.18, 0, s*0.04, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.18, 0, s*0.04, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.6;
    ctx.beginPath(); ctx.moveTo(0, -s*0.4); ctx.lineTo(s*0.13, 0); ctx.lineTo(0, s*0.4); ctx.lineTo(-s*0.13, 0); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1; } };

export const dimensional_shard: ItemDef = { id: 'dimensional_shard', name: 'Dimensional Shard', world: 'multiverse', sizeTier: 12, baseValue: 145, weight: 11,
  draw(ctx, s, c) { ctx.fillStyle = c[1] || '#22d3ee';
    ctx.beginPath();
    ctx.moveTo(0, -s*0.4); ctx.lineTo(s*0.18, -s*0.05); ctx.lineTo(s*0.13, s*0.4); ctx.lineTo(-s*0.13, s*0.4); ctx.lineTo(-s*0.18, -s*0.05);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.moveTo(0, -s*0.4); ctx.lineTo(-s*0.05, -s*0.05); ctx.lineTo(-s*0.13, s*0.4);
    ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = c[2] || '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(s*0.05, -s*0.18); ctx.lineTo(s*0.13, -s*0.05); ctx.lineTo(s*0.05, s*0.05); ctx.lineTo(-s*0.05, -s*0.05);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = c[0]; ctx.lineWidth = s*0.012;
    ctx.beginPath();
    ctx.moveTo(0, -s*0.4); ctx.lineTo(s*0.18, -s*0.05); ctx.lineTo(s*0.13, s*0.4); ctx.lineTo(-s*0.13, s*0.4); ctx.lineTo(-s*0.18, -s*0.05);
    ctx.closePath(); ctx.stroke();
    itemHighlight(ctx, -s*0.05, -s*0.25, s*0.04, s*0.05); } };

export const divergence_point: ItemDef = { id: 'divergence_point', name: 'Divergence Point', world: 'multiverse', sizeTier: 12, baseValue: 155, weight: 11,
  draw(ctx, s, c) { ctx.fillStyle = c[2] || '#fbbf24'; ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.arc(0, 0, s*0.4, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, 0, s*0.08, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = c[0]; ctx.lineWidth = s*0.025; ctx.lineCap = 'round';
    for (let i = 0; i < 5; i++) { const a = i*Math.PI*2/5 - Math.PI/2;
      const endX = Math.cos(a)*s*0.36, endY = Math.sin(a)*s*0.36;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(endX, endY); ctx.stroke();
      ctx.fillStyle = i % 2 ? c[1] || '#22d3ee' : c[2] || '#fbbf24';
      ctx.beginPath(); ctx.arc(endX, endY, s*0.05, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = i % 2 ? c[1] || '#22d3ee' : c[2] || '#fbbf24'; }
    ctx.fillStyle = '#fef9c3';
    ctx.beginPath(); ctx.arc(0, 0, s*0.04, 0, Math.PI*2); ctx.fill(); } };

export const paradox_knot: ItemDef = { id: 'paradox_knot', name: 'Paradox Knot', world: 'multiverse', sizeTier: 12, baseValue: 150, weight: 11,
  draw(ctx, s, c) { ctx.strokeStyle = c[0]; ctx.lineWidth = s*0.06; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-s*0.32, -s*0.13);
    ctx.bezierCurveTo(-s*0.05, -s*0.32, s*0.32, s*0.13, -s*0.05, s*0.32);
    ctx.bezierCurveTo(-s*0.32, s*0.13, s*0.05, -s*0.32, s*0.32, -s*0.13);
    ctx.bezierCurveTo(s*0.18, s*0.05, -s*0.05, s*0.13, -s*0.32, -s*0.13);
    ctx.stroke();
    ctx.strokeStyle = c[1] || '#22d3ee'; ctx.lineWidth = s*0.04;
    ctx.beginPath();
    ctx.moveTo(-s*0.32, -s*0.13);
    ctx.bezierCurveTo(-s*0.05, -s*0.32, s*0.32, s*0.13, -s*0.05, s*0.32);
    ctx.bezierCurveTo(-s*0.32, s*0.13, s*0.05, -s*0.32, s*0.32, -s*0.13);
    ctx.stroke();
    ctx.fillStyle = c[2] || '#fbbf24';
    ctx.beginPath(); ctx.arc(0, 0, s*0.06, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(-s*0.32, -s*0.13, s*0.025, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.32, -s*0.13, s*0.025, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(-s*0.05, s*0.32, s*0.025, 0, Math.PI*2); ctx.fill(); } };

export const lost_timeline: ItemDef = { id: 'lost_timeline', name: 'Lost Timeline', world: 'multiverse', sizeTier: 12, baseValue: 140, weight: 11,
  draw(ctx, s, c) { ctx.strokeStyle = c[1] || '#22d3ee'; ctx.lineWidth = s*0.025;
    for (let r = 0; r < 4; r++) { ctx.globalAlpha = 1 - r*0.18; const offsetY = -s*0.18 + r*s*0.13;
      ctx.beginPath();
      for (let t = 0; t < 9; t++) { const x = -s*0.4 + t*s*0.1; const y = offsetY + Math.sin(t + r)*s*0.07;
        if (t === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
      ctx.stroke(); }
    ctx.globalAlpha = 1;
    ctx.fillStyle = c[2] || '#fbbf24';
    for (let r = 0; r < 4; r++) { const offsetY = -s*0.18 + r*s*0.13;
      ctx.beginPath(); ctx.arc(-s*0.4, offsetY, s*0.04, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = c[0]; ctx.beginPath(); ctx.arc(s*0.4, offsetY, s*0.04, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = c[2] || '#fbbf24'; }
    ctx.strokeStyle = '#dc2626'; ctx.lineWidth = s*0.025;
    ctx.beginPath(); ctx.moveTo(0, -s*0.32); ctx.lineTo(s*0.13, s*0.32); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s*0.13, -s*0.32); ctx.lineTo(0, s*0.32); ctx.stroke(); } };

export const axis_of_reality: ItemDef = { id: 'axis_of_reality', name: 'Axis of Reality', world: 'multiverse', sizeTier: 12, baseValue: 160, weight: 11,
  draw(ctx, s, c) { ctx.strokeStyle = c[0]; ctx.lineWidth = s*0.04;
    ctx.beginPath(); ctx.moveTo(0, -s*0.4); ctx.lineTo(0, s*0.4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s*0.4, 0); ctx.lineTo(s*0.4, 0); ctx.stroke();
    ctx.strokeStyle = c[1] || '#22d3ee'; ctx.lineWidth = s*0.04;
    ctx.beginPath(); ctx.moveTo(-s*0.32, -s*0.32); ctx.lineTo(s*0.32, s*0.32); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s*0.32, s*0.32); ctx.lineTo(s*0.32, -s*0.32); ctx.stroke();
    ctx.fillStyle = c[2] || '#fbbf24';
    ctx.beginPath(); ctx.arc(0, 0, s*0.13, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, 0, s*0.07, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.arc(0, -s*0.4, s*0.05, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, s*0.4, s*0.05, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.4, 0, s*0.05, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(-s*0.4, 0, s*0.05, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[1] || '#22d3ee';
    ctx.beginPath(); ctx.arc(s*0.32, s*0.32, s*0.04, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(-s*0.32, -s*0.32, s*0.04, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.32, -s*0.32, s*0.04, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(-s*0.32, s*0.32, s*0.04, 0, Math.PI*2); ctx.fill(); } };

export const infinity_loop: ItemDef = { id: 'infinity_loop', name: 'Infinity Loop', world: 'multiverse', sizeTier: 12, baseValue: 155, weight: 11,
  draw(ctx, s, c) { ctx.strokeStyle = c[0]; ctx.lineWidth = s*0.06; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(-s*0.18, 0, s*0.13, 0, Math.PI*2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(s*0.18, 0, s*0.13, 0, Math.PI*2);
    ctx.stroke();
    ctx.strokeStyle = c[1] || '#22d3ee'; ctx.lineWidth = s*0.04;
    ctx.beginPath();
    ctx.arc(-s*0.18, 0, s*0.13, 0, Math.PI*2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(s*0.18, 0, s*0.13, 0, Math.PI*2);
    ctx.stroke();
    ctx.fillStyle = c[2] || '#fbbf24';
    ctx.beginPath(); ctx.arc(-s*0.18, 0, s*0.04, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.18, 0, s*0.04, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, 0, s*0.08, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#fef9c3'; ctx.lineWidth = s*0.012;
    for (let i = 0; i < 8; i++) { const a = i*Math.PI/4;
      ctx.beginPath(); ctx.moveTo(Math.cos(a)*s*0.08, Math.sin(a)*s*0.08); ctx.lineTo(Math.cos(a)*s*0.13, Math.sin(a)*s*0.13); ctx.stroke(); } } };

export const omega_artifact: ItemDef = { id: 'omega_artifact', name: 'Omega Artifact', world: 'multiverse', sizeTier: 12, baseValue: 170, weight: 11,
  draw(ctx, s, c) { ctx.fillStyle = c[2] || '#fbbf24'; ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.arc(0, 0, s*0.4, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = c[0];
    ctx.beginPath();
    for (let i = 0; i < 12; i++) { const a = i*Math.PI/6;
      const r = i % 2 === 0 ? s*0.32 : s*0.18;
      if (i === 0) ctx.moveTo(Math.cos(a)*r, Math.sin(a)*r); else ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r); }
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[1] || '#22d3ee';
    ctx.beginPath(); ctx.arc(0, 0, s*0.13, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${s*0.18}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('Ω', 0, s*0.01);
    ctx.strokeStyle = '#fef9c3'; ctx.lineWidth = s*0.018;
    ctx.beginPath(); ctx.arc(0, 0, s*0.18, 0, Math.PI*2); ctx.stroke();
    ctx.fillStyle = '#fde047';
    for (let i = 0; i < 6; i++) { const a = i*Math.PI/3 + Math.PI/6;
      ctx.beginPath(); ctx.arc(Math.cos(a)*s*0.32, Math.sin(a)*s*0.32, s*0.018, 0, Math.PI*2); ctx.fill(); } } };

export const multiverse_seed: ItemDef = { id: 'multiverse_seed', name: 'Multiverse Seed', world: 'multiverse', sizeTier: 12, baseValue: 180, weight: 11,
  draw(ctx, s, c) { for (let r = 0; r < 5; r++) { const cols = ['#000000', c[0], c[1] || '#22d3ee', c[2] || '#fbbf24', '#ffffff'];
    ctx.fillStyle = cols[r];
    ctx.beginPath(); ctx.arc(0, 0, s*0.4 - r*s*0.07, 0, Math.PI*2); ctx.fill(); }
    ctx.strokeStyle = c[2] || '#fbbf24'; ctx.lineWidth = s*0.012;
    for (let i = 0; i < 12; i++) { const a = i*Math.PI/6;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a)*s*0.4, Math.sin(a)*s*0.4); ctx.stroke(); }
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, 0, s*0.04, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[0]; ctx.globalAlpha = 0.6;
    for (let i = 0; i < 8; i++) { const a = Math.random()*Math.PI*2; const r = s*(0.18 + Math.random()*0.18);
      ctx.beginPath(); ctx.arc(Math.cos(a)*r, Math.sin(a)*r, s*0.018, 0, Math.PI*2); ctx.fill(); }
    ctx.globalAlpha = 1; } };

