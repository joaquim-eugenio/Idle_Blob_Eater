import { itemGradient, itemLinearGradient, itemOutline, itemHighlight, darken } from './drawUtils';
import * as N from './newItems';

export type WorldId = 'crumbs' | 'desk_drawer' | 'sewing_kit' | 'pencil_case' | 'art_supplies' | 'lunchbox' | 'snack_drawer' | 'toy_box' | 'shoebox' | 'backpack' | 'bedroom' | 'pantry' | 'kitchen' | 'bathroom' | 'laundry_room' | 'living_room' | 'hallway' | 'garage' | 'driveway' | 'garden' | 'playground' | 'school' | 'bus_stop' | 'neighborhood' | 'shopping_mall' | 'city_park' | 'skatepark' | 'construction_site' | 'downtown' | 'junkyard' | 'train_yard' | 'space_station' | 'candy_world' | 'cloud_kingdom' | 'deep_ocean' | 'volcano' | 'glacier' | 'desert_dunes' | 'mountain_range' | 'stratosphere' | 'moon_surface' | 'red_planet' | 'asteroid_belt' | 'solar_system' | 'nebula' | 'galaxy' | 'universe_edge' | 'multiverse';

export interface ItemDef {
  id: string;
  name: string;
  world: WorldId;
  sizeTier: number;
  baseValue: number;
  weight: number;
  draw: (ctx: CanvasRenderingContext2D, size: number, colors: string[]) => void;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
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

// ─── Crumbs ───

const triangle: ItemDef = {
  id: 'triangle', name: 'Triangle', world: 'crumbs', sizeTier: 1, baseValue: 1, weight: 1,
  draw(ctx, s, c) {
    ctx.fillStyle = itemGradient(ctx, 0, 0, s * 0.5, c[0]);
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.45);
    ctx.quadraticCurveTo(s * 0.08, -s * 0.42, s * 0.47, s * 0.42);
    ctx.quadraticCurveTo(0, s * 0.48, -s * 0.47, s * 0.42);
    ctx.quadraticCurveTo(-s * 0.08, -s * 0.42, 0, -s * 0.45);
    ctx.closePath();
    ctx.fill();
    itemOutline(ctx, c[0], s * 0.04);
    itemHighlight(ctx, -s * 0.12, -s * 0.15, s * 0.14, s * 0.09);
  },
};

const square: ItemDef = {
  id: 'square', name: 'Square', world: 'crumbs', sizeTier: 1, baseValue: 2, weight: 1,
  draw(ctx, s, c) {
    ctx.fillStyle = itemGradient(ctx, 0, 0, s * 0.5, c[1]);
    roundRect(ctx, -s*0.4, -s*0.4, s*0.8, s*0.8, s*0.12); ctx.fill();
    itemOutline(ctx, c[1], s * 0.04);
    ctx.strokeStyle = darken(c[0], 0.15); ctx.lineWidth = s*0.04;
    ctx.beginPath(); ctx.moveTo(-s*0.24, -s*0.24); ctx.lineTo(s*0.24, s*0.24); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s*0.24, -s*0.24); ctx.lineTo(-s*0.24, s*0.24); ctx.stroke();
    itemHighlight(ctx, -s * 0.15, -s * 0.18, s * 0.15, s * 0.1);
  },
};

const hexagon: ItemDef = {
  id: 'hexagon', name: 'Hexagon', world: 'crumbs', sizeTier: 1, baseValue: 3, weight: 1.2,
  draw(ctx, s, c) {
    ctx.fillStyle = itemGradient(ctx, 0, 0, s * 0.5, c[2]);
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const px = Math.cos(a) * s * 0.5, py = Math.sin(a) * s * 0.5;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath(); ctx.fill();
    itemOutline(ctx, c[2], s * 0.04);
    itemHighlight(ctx, -s * 0.13, -s * 0.15, s * 0.15, s * 0.1);
  },
};

const diamond: ItemDef = {
  id: 'diamond', name: 'Diamond', world: 'crumbs', sizeTier: 1, baseValue: 2, weight: 1,
  draw(ctx, s, c) {
    ctx.fillStyle = itemGradient(ctx, 0, 0, s * 0.5, c[0]);
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.55); ctx.lineTo(s * 0.4, 0); ctx.lineTo(0, s * 0.55); ctx.lineTo(-s * 0.4, 0);
    ctx.closePath(); ctx.fill();
    itemOutline(ctx, c[0], s * 0.04);
    itemHighlight(ctx, -s * 0.1, -s * 0.18, s * 0.12, s * 0.08);
  },
};

const circle: ItemDef = {
  id: 'circle', name: 'Circle', world: 'crumbs', sizeTier: 1, baseValue: 1, weight: 1,
  draw(ctx, s, c) {
    ctx.fillStyle = itemGradient(ctx, 0, 0, s * 0.45, c[1]);
    ctx.beginPath(); ctx.arc(0, 0, s * 0.45, 0, Math.PI * 2); ctx.fill();
    itemOutline(ctx, c[1], s * 0.04);
    itemHighlight(ctx, -s * 0.13, -s * 0.13, s * 0.14, s * 0.09);
  },
};

const pentagon: ItemDef = {
  id: 'pentagon', name: 'Pentagon', world: 'crumbs', sizeTier: 1, baseValue: 2, weight: 1.1,
  draw(ctx, s, c) {
    ctx.fillStyle = itemGradient(ctx, 0, 0, s * 0.48, c[2]);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      const px = Math.cos(a) * s * 0.48, py = Math.sin(a) * s * 0.48;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath(); ctx.fill();
    itemOutline(ctx, c[2], s * 0.04);
    itemHighlight(ctx, -s * 0.12, -s * 0.16, s * 0.14, s * 0.09);
  },
};

const cross: ItemDef = {
  id: 'cross', name: 'Cross', world: 'crumbs', sizeTier: 1, baseValue: 2, weight: 1,
  draw(ctx, s, c) {
    const t = s * 0.2, h = s * 0.5, r = s * 0.06;
    ctx.fillStyle = itemGradient(ctx, 0, 0, h, c[0]);
    roundRect(ctx, -t, -h, t * 2, h * 2, r); ctx.fill();
    itemOutline(ctx, c[0], s * 0.04);
    roundRect(ctx, -h, -t, h * 2, t * 2, r); ctx.fill();
    itemOutline(ctx, c[0], s * 0.04);
    itemHighlight(ctx, -s * 0.1, -s * 0.2, s * 0.1, s * 0.08);
  },
};

const crescent: ItemDef = {
  id: 'crescent', name: 'Crescent', world: 'crumbs', sizeTier: 1, baseValue: 3, weight: 1.1,
  draw(ctx, s, c) {
    const r = s * 0.45;
    ctx.fillStyle = itemGradient(ctx, 0, 0, r, c[2]);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
    itemOutline(ctx, c[2], s * 0.04);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(r * 0.35, -r * 0.15, r * 0.85, 0, Math.PI * 2); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    itemHighlight(ctx, -s * 0.2, -s * 0.12, s * 0.1, s * 0.07);
  },
};

const ring: ItemDef = {
  id: 'ring', name: 'Ring', world: 'crumbs', sizeTier: 1, baseValue: 2, weight: 0.9,
  draw(ctx, s, c) {
    ctx.save();
    ctx.fillStyle = itemGradient(ctx, 0, 0, s * 0.44, c[0]);
    ctx.beginPath(); ctx.arc(0, 0, s * 0.44, 0, Math.PI * 2); ctx.fill();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(0, 0, s * 0.22, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = darken(c[0], 0.35); ctx.lineWidth = s * 0.045;
    ctx.beginPath(); ctx.arc(0, 0, s * 0.44, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = darken(c[1] || c[2] || c[0], 0.2); ctx.lineWidth = s * 0.03;
    ctx.beginPath(); ctx.arc(0, 0, s * 0.33, 0, Math.PI * 2); ctx.stroke();
    itemHighlight(ctx, -s * 0.18, -s * 0.18, s * 0.1, s * 0.07);
  },
};

const arrow_shape: ItemDef = {
  id: 'arrow_shape', name: 'Arrow', world: 'crumbs', sizeTier: 1, baseValue: 3, weight: 1.1,
  draw(ctx, s, c) {
    ctx.fillStyle = itemGradient(ctx, 0, 0, s * 0.42, c[2]);
    ctx.beginPath();
    ctx.moveTo(-s * 0.38, -s * 0.12); ctx.lineTo(0, -s * 0.12); ctx.lineTo(0, -s * 0.3);
    ctx.lineTo(s * 0.42, 0); ctx.lineTo(0, s * 0.3); ctx.lineTo(0, s * 0.12); ctx.lineTo(-s * 0.38, s * 0.12);
    ctx.closePath(); ctx.fill();
    itemOutline(ctx, c[2], s * 0.04);
    itemHighlight(ctx, -s * 0.1, -s * 0.1, s * 0.12, s * 0.07);
  },
};

// ─── Desk Drawer ───

const paperclip: ItemDef = {
  id: 'paperclip', name: 'Paperclip', world: 'desk_drawer', sizeTier: 2, baseValue: 4, weight: 1.5,
  draw(ctx, s, c) {
    const clipPath = () => {
      ctx.beginPath();
      ctx.moveTo(-s * 0.15, s * 0.4);
      ctx.lineTo(-s * 0.15, -s * 0.3);
      ctx.arc(0, -s * 0.3, s * 0.15, Math.PI, 0);
      ctx.lineTo(s * 0.15, s * 0.2);
      ctx.arc(0.02, s * 0.2, s * 0.13, 0, Math.PI);
      ctx.lineTo(-s * 0.11, -s * 0.15);
    };
    ctx.strokeStyle = darken(c[0], 0.15); ctx.lineWidth = s * 0.09; ctx.lineCap = 'round';
    clipPath(); ctx.stroke();
    ctx.strokeStyle = itemLinearGradient(ctx, -s*0.15, -s*0.45, s*0.15, s*0.4, c[0]);
    ctx.lineWidth = s * 0.06;
    clipPath(); ctx.stroke();
    itemHighlight(ctx, -s*0.05, -s*0.32, s*0.06, s*0.06);
  },
};

const button: ItemDef = {
  id: 'button', name: 'Button', world: 'desk_drawer', sizeTier: 2, baseValue: 3, weight: 1.3,
  draw(ctx, s, c) {
    ctx.fillStyle = itemGradient(ctx, 0, 0, s * 0.4, c[1]);
    ctx.beginPath(); ctx.arc(0, 0, s * 0.4, 0, Math.PI * 2); ctx.fill();
    itemOutline(ctx, c[1], s * 0.04);
    ctx.strokeStyle = darken(c[0], 0.2); ctx.lineWidth = s * 0.03;
    ctx.beginPath(); ctx.arc(0, 0, s * 0.28, 0, Math.PI * 2); ctx.stroke();
    const h = s * 0.08;
    ctx.fillStyle = c[2] || c[0];
    ctx.beginPath(); ctx.arc(-h, -h, s * 0.04, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(h, -h, s * 0.04, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(-h, h, s * 0.04, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(h, h, s * 0.04, 0, Math.PI * 2); ctx.fill();
  },
};

const coin: ItemDef = {
  id: 'coin', name: 'Coin', world: 'desk_drawer', sizeTier: 2, baseValue: 5, weight: 2,
  draw(ctx, s, c) {
    ctx.fillStyle = itemGradient(ctx, 0, 0, s * 0.4, c[0]);
    ctx.beginPath(); ctx.arc(0, 0, s * 0.4, 0, Math.PI * 2); ctx.fill();
    itemOutline(ctx, c[0], s * 0.04);
    ctx.strokeStyle = darken(c[1], 0.15); ctx.lineWidth = s * 0.03;
    ctx.beginPath(); ctx.arc(0, 0, s * 0.3, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = c[1]; ctx.font = `bold ${s * 0.3}px 'Fredoka', sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('$', 0, 0);
  },
};

const marble: ItemDef = {
  id: 'marble', name: 'Marble', world: 'desk_drawer', sizeTier: 2, baseValue: 4, weight: 2.5,
  draw(ctx, s, c) {
    const r = s * 0.38;
    ctx.fillStyle = itemGradient(ctx, 0, 0, r, c[0]);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
    itemOutline(ctx, c[0], s * 0.035);
    itemHighlight(ctx, -r * 0.25, -r * 0.25, r * 0.2, r * 0.14);
  },
};

const dice: ItemDef = {
  id: 'dice', name: 'Dice', world: 'desk_drawer', sizeTier: 2, baseValue: 5, weight: 2,
  draw(ctx, s, c) {
    const h = s * 0.38;
    roundRect(ctx, -h, -h, h * 2, h * 2, s * 0.08);
    ctx.fillStyle = itemGradient(ctx, 0, 0, h, c[0]); ctx.fill();
    itemOutline(ctx, c[0], s * 0.04);
    ctx.fillStyle = c[1];
    const d = s * 0.05;
    ctx.beginPath(); ctx.arc(-h * 0.5, -h * 0.5, d, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(h * 0.5, -h * 0.5, d, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, 0, d, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(-h * 0.5, h * 0.5, d, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(h * 0.5, h * 0.5, d, 0, Math.PI * 2); ctx.fill();
  },
};

const screw: ItemDef = {
  id: 'screw', name: 'Screw', world: 'desk_drawer', sizeTier: 2, baseValue: 3, weight: 1.8,
  draw(ctx, s, c) {
    ctx.fillStyle = itemGradient(ctx, 0, -s * 0.3, s * 0.15, c[0]);
    ctx.beginPath(); ctx.arc(0, -s * 0.3, s * 0.15, 0, Math.PI * 2); ctx.fill();
    itemOutline(ctx, c[0], s * 0.03);
    ctx.strokeStyle = c[0]; ctx.lineWidth = s * 0.08; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, -s * 0.15); ctx.lineTo(0, s * 0.45); ctx.stroke();
    ctx.strokeStyle = c[1]; ctx.lineWidth = s * 0.04;
    for (let i = 0; i < 4; i++) {
      const yy = -s * 0.1 + i * s * 0.13;
      ctx.beginPath(); ctx.moveTo(-s * 0.1, yy); ctx.lineTo(s * 0.1, yy + s * 0.04); ctx.stroke();
    }
  },
};

const candy: ItemDef = {
  id: 'candy', name: 'Candy', world: 'desk_drawer', sizeTier: 2, baseValue: 4, weight: 1.2,
  draw(ctx, s, c) {
    ctx.fillStyle = itemGradient(ctx, 0, 0, s * 0.28, c[1]);
    ctx.beginPath(); ctx.arc(0, 0, s * 0.28, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.arc(0, 0, s * 0.28, 0, Math.PI * 0.5); ctx.lineTo(0, 0); ctx.fill();
    ctx.beginPath(); ctx.arc(0, 0, s * 0.28, Math.PI, Math.PI * 1.5); ctx.lineTo(0, 0); ctx.fill();
    itemOutline(ctx, c[1], s * 0.035);
    ctx.strokeStyle = darken(c[2] || c[0], 0.15); ctx.lineWidth = s * 0.04; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-s * 0.28, 0); ctx.lineTo(-s * 0.45, -s * 0.12); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s * 0.28, 0); ctx.lineTo(s * 0.45, s * 0.12); ctx.stroke();
  },
};

const eraser: ItemDef = {
  id: 'eraser', name: 'Eraser', world: 'desk_drawer', sizeTier: 2, baseValue: 3, weight: 1.5,
  draw(ctx, s, c) {
    roundRect(ctx, -s * 0.35, -s * 0.2, s * 0.7, s * 0.4, s * 0.05);
    ctx.fillStyle = itemLinearGradient(ctx, -s * 0.35, -s * 0.2, s * 0.35, s * 0.2, c[0]); ctx.fill();
    itemOutline(ctx, c[0], s * 0.035);
    ctx.fillStyle = darken(c[1], 0.05);
    ctx.fillRect(-s * 0.35, -s * 0.2, s * 0.2, s * 0.4);
    ctx.strokeStyle = darken(c[2] || c[1], 0.2); ctx.lineWidth = s * 0.02;
    ctx.beginPath(); ctx.moveTo(-s * 0.15, -s * 0.2); ctx.lineTo(-s * 0.15, s * 0.2); ctx.stroke();
  },
};

const thumbtack: ItemDef = {
  id: 'thumbtack', name: 'Thumbtack', world: 'desk_drawer', sizeTier: 2, baseValue: 4, weight: 1.5,
  draw(ctx, s, c) {
    ctx.fillStyle = c[1];
    ctx.beginPath(); ctx.moveTo(0, s * 0.48); ctx.lineTo(-s * 0.09, -s * 0.08); ctx.lineTo(s * 0.09, -s * 0.08); ctx.closePath(); ctx.fill();
    ctx.fillStyle = itemGradient(ctx, 0, -s * 0.18, s * 0.2, c[0]);
    ctx.beginPath(); ctx.arc(0, -s * 0.18, s * 0.2, 0, Math.PI * 2); ctx.fill();
    itemOutline(ctx, c[0], s * 0.03);
  },
};

const rubber_stamp: ItemDef = {
  id: 'rubber_stamp', name: 'Rubber Stamp', world: 'desk_drawer', sizeTier: 2, baseValue: 4, weight: 1.7,
  draw(ctx, s, c) {
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.14, -s*0.44, s*0.14, -s*0.06, c[1]);
    roundRect(ctx, -s * 0.14, -s * 0.44, s * 0.28, s * 0.38, s * 0.05); ctx.fill();
    itemOutline(ctx, c[1], s*0.025);
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.36, s*0.02, s*0.36, s*0.3, c[0]);
    roundRect(ctx, -s * 0.36, s * 0.02, s * 0.72, s * 0.28, s * 0.05); ctx.fill();
    itemOutline(ctx, c[0], s*0.025);
    ctx.fillStyle = c[2];
    roundRect(ctx, -s * 0.2, s * 0.1, s * 0.4, s * 0.12, s * 0.03); ctx.fill();
    itemHighlight(ctx, -s*0.04, -s*0.3, s*0.06, s*0.08);
  },
};

// ─── Pencil Case ───

const crayon: ItemDef = { id: 'crayon', name: 'Crayon', world: 'pencil_case', sizeTier: 2, baseValue: 4, weight: 1.3,
  draw(ctx, s, c) {
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.08, -s*0.45, s*0.08, s*0.3, c[0]);
    ctx.beginPath(); ctx.moveTo(-s*0.08, s*0.3); ctx.lineTo(-s*0.08, -s*0.25); ctx.lineTo(0, -s*0.45);
    ctx.lineTo(s*0.08, -s*0.25); ctx.lineTo(s*0.08, s*0.3); ctx.closePath();
    ctx.fill(); itemOutline(ctx, c[0], s*0.025);
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.08, 0, s*0.08, s*0.15, c[1]);
    ctx.fillRect(-s*0.08, 0, s*0.16, s*0.15);
    ctx.strokeStyle = darken(c[2]||'#333'); ctx.lineWidth = s*0.02;
    ctx.beginPath(); ctx.moveTo(-s*0.08, -s*0.05); ctx.lineTo(s*0.08, -s*0.05); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s*0.08, s*0.15); ctx.lineTo(s*0.08, s*0.15); ctx.stroke();
    itemHighlight(ctx, -s*0.02, -s*0.18, s*0.04, s*0.1);
  } };

const ruler: ItemDef = { id: 'ruler', name: 'Ruler', world: 'pencil_case', sizeTier: 2, baseValue: 3, weight: 1.5,
  draw(ctx, s, c) {
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.45, -s*0.1, s*0.45, s*0.1, c[0]);
    roundRect(ctx, -s*0.45, -s*0.1, s*0.9, s*0.2, s*0.03); ctx.fill();
    itemOutline(ctx, c[0], s*0.025);
    ctx.strokeStyle = darken(c[1]||'#333'); ctx.lineWidth = s*0.02;
    for (let i = 0; i < 8; i++) { const x = -s*0.38+i*s*0.1; const h = i%2===0 ? s*0.08 : s*0.05; ctx.beginPath(); ctx.moveTo(x, -s*0.1); ctx.lineTo(x, -s*0.1+h); ctx.stroke(); }
    itemHighlight(ctx, -s*0.15, -s*0.06, s*0.2, s*0.04);
  } };

const pencilSharpener: ItemDef = { id: 'pencil_sharpener', name: 'Pencil Sharpener', world: 'pencil_case', sizeTier: 2, baseValue: 3, weight: 2,
  draw(ctx, s, c) {
    ctx.fillStyle = itemGradient(ctx, 0, 0, s*0.35, c[0]);
    ctx.beginPath(); ctx.moveTo(-s*0.25, -s*0.2); ctx.lineTo(s*0.25, -s*0.2); ctx.lineTo(s*0.3, s*0.2); ctx.lineTo(-s*0.3, s*0.2); ctx.closePath();
    ctx.fill(); itemOutline(ctx, c[0], s*0.025);
    ctx.fillStyle = itemGradient(ctx, 0, 0, s*0.1, c[1]||'#333');
    ctx.beginPath(); ctx.arc(0, 0, s*0.1, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[2]||'#666'; ctx.beginPath(); ctx.arc(0, 0, s*0.05, 0, Math.PI*2); ctx.fill();
    itemHighlight(ctx, -s*0.1, -s*0.1, s*0.1, s*0.06);
  } };

const rubberBand: ItemDef = { id: 'rubber_band', name: 'Rubber Band', world: 'pencil_case', sizeTier: 2, baseValue: 2, weight: 0.8,
  draw(ctx, s, c) {
    ctx.strokeStyle = darken(c[0], 0.15); ctx.lineWidth = s*0.08;
    ctx.beginPath(); ctx.ellipse(0, 0, s*0.35, s*0.2, 0, 0, Math.PI*2); ctx.stroke();
    ctx.strokeStyle = c[0]; ctx.lineWidth = s*0.06;
    ctx.beginPath(); ctx.ellipse(0, 0, s*0.35, s*0.2, 0, 0, Math.PI*2); ctx.stroke();
    itemHighlight(ctx, -s*0.1, -s*0.08, s*0.14, s*0.05);
  } };

const sticker: ItemDef = { id: 'sticker', name: 'Sticker', world: 'pencil_case', sizeTier: 2, baseValue: 4, weight: 0.5,
  draw(ctx, s, c) {
    ctx.fillStyle = itemGradient(ctx, 0, 0, s*0.38, c[0]);
    ctx.beginPath(); ctx.arc(0, 0, s*0.38, 0, Math.PI*2); ctx.fill();
    itemOutline(ctx, c[0], s*0.025);
    ctx.fillStyle = c[1]||'#fff'; ctx.beginPath(); ctx.arc(0, 0, s*0.32, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[2]||'#333';
    ctx.beginPath(); ctx.arc(-s*0.1, -s*0.08, s*0.05, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.1, -s*0.08, s*0.05, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = c[2]||'#333'; ctx.lineWidth = s*0.04; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(0, s*0.04, s*0.12, 0.15, Math.PI-0.15); ctx.stroke();
    itemHighlight(ctx, -s*0.1, -s*0.12, s*0.12, s*0.07);
  } };

const eraserCap: ItemDef = { id: 'eraser_cap', name: 'Eraser Cap', world: 'pencil_case', sizeTier: 2, baseValue: 2, weight: 1,
  draw(ctx, s, c) {
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.15, -s*0.25, s*0.15, s*0.25, c[0]);
    roundRect(ctx, -s*0.15, -s*0.25, s*0.3, s*0.5, s*0.06); ctx.fill();
    itemOutline(ctx, c[0], s*0.025);
    ctx.fillStyle = c[1]||'#ddd'; ctx.beginPath(); ctx.ellipse(0, -s*0.25, s*0.15, s*0.06, 0, 0, Math.PI*2); ctx.fill();
    itemHighlight(ctx, -s*0.05, -s*0.15, s*0.06, s*0.1);
  } };

const pencil: ItemDef = {
  id: 'pencil', name: 'Pencil', world: 'pencil_case', sizeTier: 2, baseValue: 4, weight: 1.4,
  draw(ctx, s, c) {
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.13, -s*0.5, s*0.13, -s*0.34, c[1]);
    roundRect(ctx, -s * 0.13, -s * 0.5, s * 0.26, s * 0.16, s * 0.05); ctx.fill();
    ctx.fillStyle = '#c9a227'; roundRect(ctx, -s * 0.11, -s * 0.36, s * 0.22, s * 0.08, s * 0.02); ctx.fill();
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.1, -s*0.28, s*0.1, s*0.22, c[0]);
    roundRect(ctx, -s * 0.1, -s * 0.28, s * 0.2, s * 0.5, s*0.01); ctx.fill();
    itemOutline(ctx, c[0], s*0.02);
    ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = s * 0.018;
    ctx.beginPath(); ctx.moveTo(-s * 0.1, -s * 0.08); ctx.lineTo(s * 0.1, -s * 0.08); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s * 0.1, s * 0.08); ctx.lineTo(s * 0.1, s * 0.08); ctx.stroke();
    ctx.fillStyle = itemGradient(ctx, 0, s*0.35, s*0.1, c[2] || '#333');
    ctx.beginPath(); ctx.moveTo(-s * 0.1, s * 0.22); ctx.lineTo(0, s * 0.48); ctx.lineTo(s * 0.1, s * 0.22); ctx.closePath(); ctx.fill();
    itemHighlight(ctx, -s*0.03, -s*0.12, s*0.04, s*0.1);
  },
};

const tape_roll: ItemDef = {
  id: 'tape_roll', name: 'Tape Roll', world: 'pencil_case', sizeTier: 2, baseValue: 3, weight: 1.2,
  draw(ctx, s, c) {
    ctx.fillStyle = itemGradient(ctx, 0, 0, s*0.4, c[0]);
    ctx.beginPath(); ctx.arc(0, 0, s * 0.4, 0, Math.PI * 2); ctx.fill();
    itemOutline(ctx, c[0], s*0.025);
    ctx.save(); ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath(); ctx.arc(0, 0, s * 0.17, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    ctx.strokeStyle = darken(c[1]); ctx.lineWidth = s * 0.045;
    ctx.beginPath(); ctx.arc(0, 0, s * 0.285, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = itemGradient(ctx, s*0.36, 0, s*0.1, c[0]);
    roundRect(ctx, s * 0.26, -s * 0.07, s * 0.2, s * 0.14, s * 0.03); ctx.fill();
    itemHighlight(ctx, -s*0.12, -s*0.12, s*0.1, s*0.07);
  },
};

const scissors: ItemDef = {
  id: 'scissors', name: 'Scissors', world: 'pencil_case', sizeTier: 2, baseValue: 5, weight: 1.9,
  draw(ctx, s, c) {
    ctx.fillStyle = itemGradient(ctx, 0, 0, s*0.4, c[0]);
    ctx.save(); ctx.rotate(-0.4);
    ctx.beginPath(); ctx.ellipse(-s * 0.02, 0, s * 0.38, s * 0.085, 0, 0, Math.PI * 2); ctx.fill();
    itemOutline(ctx, c[0], s*0.02); ctx.restore();
    ctx.fillStyle = itemGradient(ctx, 0, 0, s*0.4, c[0]);
    ctx.save(); ctx.rotate(0.4);
    ctx.beginPath(); ctx.ellipse(s * 0.02, 0, s * 0.38, s * 0.085, 0, 0, Math.PI * 2); ctx.fill();
    itemOutline(ctx, c[0], s*0.02); ctx.restore();
    ctx.fillStyle = '#6b7280'; ctx.beginPath(); ctx.arc(0, 0, s * 0.055, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = itemGradient(ctx, -s*0.36, 0, s*0.1, c[1]);
    ctx.save(); ctx.rotate(-0.4);
    ctx.beginPath(); ctx.ellipse(-s * 0.36, 0, s * 0.1, s * 0.075, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    ctx.fillStyle = itemGradient(ctx, s*0.36, 0, s*0.1, c[1]);
    ctx.save(); ctx.rotate(0.4);
    ctx.beginPath(); ctx.ellipse(s * 0.36, 0, s * 0.1, s * 0.075, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    itemHighlight(ctx, -s*0.08, -s*0.06, s*0.1, s*0.05);
  },
};

const protractor: ItemDef = {
  id: 'protractor', name: 'Protractor', world: 'pencil_case', sizeTier: 2, baseValue: 4, weight: 1.5,
  draw(ctx, s, c) {
    const cy = s * 0.1, R = s * 0.42;
    ctx.fillStyle = itemGradient(ctx, 0, cy - R*0.3, R, c[0]);
    ctx.beginPath(); ctx.arc(0, cy, R, Math.PI, 0, false); ctx.lineTo(R, cy); ctx.lineTo(-R, cy); ctx.closePath();
    ctx.fill(); itemOutline(ctx, c[0], s*0.025);
    ctx.strokeStyle = darken(c[1]); ctx.lineWidth = s * 0.022;
    ctx.beginPath(); ctx.arc(0, cy, R * 0.92, Math.PI, 0, false); ctx.stroke();
    for (let i = 0; i <= 13; i++) {
      const ang = Math.PI + (i / 13) * Math.PI;
      const big = i % 3 === 0; const r0 = R * (big ? 0.78 : 0.84);
      ctx.beginPath(); ctx.moveTo(Math.cos(ang) * r0, cy + Math.sin(ang) * r0); ctx.lineTo(Math.cos(ang) * R * 0.98, cy + Math.sin(ang) * R * 0.98); ctx.stroke();
    }
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.arc(0, cy, s * 0.04, 0, Math.PI * 2); ctx.fill();
    itemHighlight(ctx, -s*0.12, cy - s*0.15, s*0.14, s*0.06);
  },
};

// ─── Lunchbox ───

const sandwich: ItemDef = { id: 'sandwich', name: 'Sandwich', world: 'lunchbox', sizeTier: 3, baseValue: 6, weight: 2,
  draw(ctx, s, c) {
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.3, -s*0.25, s*0.3, -s*0.13, c[0]);
    roundRect(ctx, -s*0.3, -s*0.25, s*0.6, s*0.12, s*0.03); ctx.fill();
    itemOutline(ctx, c[0], s*0.02);
    ctx.fillStyle = c[1]||'#4ade80'; ctx.fillRect(-s*0.28, -s*0.13, s*0.56, s*0.06);
    ctx.fillStyle = c[2]||'#f87171'; ctx.fillRect(-s*0.28, -s*0.07, s*0.56, s*0.06);
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.3, s*0.01, s*0.3, s*0.13, c[0]);
    roundRect(ctx, -s*0.3, s*0.01, s*0.6, s*0.12, s*0.03); ctx.fill();
    itemOutline(ctx, c[0], s*0.02);
    itemHighlight(ctx, -s*0.1, -s*0.2, s*0.15, s*0.05);
  } };

const juiceBox: ItemDef = { id: 'juice_box', name: 'Juice Box', world: 'lunchbox', sizeTier: 3, baseValue: 5, weight: 1.8,
  draw(ctx, s, c) {
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.18, -s*0.25, s*0.18, s*0.3, c[0]);
    roundRect(ctx, -s*0.18, -s*0.25, s*0.36, s*0.55, s*0.03); ctx.fill();
    itemOutline(ctx, c[0], s*0.02);
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.18, -s*0.25, s*0.18, -s*0.1, c[1]);
    ctx.fillRect(-s*0.18, -s*0.25, s*0.36, s*0.15);
    ctx.strokeStyle = darken(c[2]||'#333'); ctx.lineWidth = s*0.03; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(s*0.05, -s*0.25); ctx.lineTo(s*0.08, -s*0.42); ctx.stroke();
    itemHighlight(ctx, -s*0.06, -s*0.15, s*0.06, s*0.1);
  } };

const cookieItem: ItemDef = { id: 'cookie', name: 'Cookie', world: 'lunchbox', sizeTier: 3, baseValue: 5, weight: 1.5,
  draw(ctx, s, c) {
    ctx.fillStyle = itemGradient(ctx, 0, 0, s*0.35, c[0]);
    ctx.beginPath(); ctx.arc(0, 0, s*0.35, 0, Math.PI*2); ctx.fill();
    itemOutline(ctx, c[0], s*0.025);
    ctx.fillStyle = c[1]||'#3b1f0b';
    ctx.beginPath(); ctx.arc(-s*0.1, -s*0.1, s*0.05, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.12, 0, s*0.05, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(-s*0.05, s*0.15, s*0.05, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.15, -s*0.15, s*0.04, 0, Math.PI*2); ctx.fill();
    itemHighlight(ctx, -s*0.1, -s*0.1, s*0.1, s*0.07);
  } };

const banana: ItemDef = { id: 'banana', name: 'Banana', world: 'lunchbox', sizeTier: 3, baseValue: 4, weight: 1.8,
  draw(ctx, s, c) {
    ctx.fillStyle = itemGradient(ctx, 0, 0, s*0.5, c[0]);
    ctx.beginPath(); ctx.arc(0, s*0.3, s*0.55, -Math.PI*0.85, -Math.PI*0.15);
    ctx.arc(0, s*0.3, s*0.42, -Math.PI*0.15, -Math.PI*0.85, true); ctx.closePath();
    ctx.fill(); itemOutline(ctx, c[0], s*0.025);
    ctx.fillStyle = c[1]||'#5b3a1a'; ctx.beginPath(); ctx.arc(s*0.25, -s*0.15, s*0.03, 0, Math.PI*2); ctx.fill();
    itemHighlight(ctx, -s*0.05, -s*0.12, s*0.1, s*0.05);
  } };

const cheeseSlice: ItemDef = { id: 'cheese_slice', name: 'Cheese Slice', world: 'lunchbox', sizeTier: 3, baseValue: 5, weight: 1.2,
  draw(ctx, s, c) {
    ctx.fillStyle = itemGradient(ctx, 0, 0, s*0.4, c[0]);
    ctx.beginPath(); ctx.moveTo(0, -s*0.35); ctx.lineTo(s*0.35, s*0.25); ctx.lineTo(-s*0.35, s*0.25); ctx.closePath();
    ctx.fill(); itemOutline(ctx, c[0], s*0.025);
    ctx.fillStyle = c[1]||'#fff8dc';
    ctx.beginPath(); ctx.arc(-s*0.05, s*0.05, s*0.06, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.1, s*0.15, s*0.05, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(-s*0.12, s*0.18, s*0.04, 0, Math.PI*2); ctx.fill();
    itemHighlight(ctx, -s*0.08, -s*0.12, s*0.1, s*0.06);
  } };

const wrapper: ItemDef = { id: 'wrapper', name: 'Wrapper', world: 'lunchbox', sizeTier: 3, baseValue: 3, weight: 0.8,
  draw(ctx, s, c) {
    ctx.fillStyle = itemGradient(ctx, 0, 0, s*0.35, c[0]);
    ctx.beginPath(); ctx.moveTo(-s*0.3, -s*0.1); ctx.lineTo(-s*0.15, -s*0.25); ctx.lineTo(s*0.05, -s*0.2);
    ctx.lineTo(s*0.25, -s*0.3); ctx.lineTo(s*0.3, -s*0.05); ctx.lineTo(s*0.2, s*0.15);
    ctx.lineTo(s*0.1, s*0.25); ctx.lineTo(-s*0.15, s*0.2); ctx.lineTo(-s*0.3, s*0.1); ctx.closePath();
    ctx.fill(); itemOutline(ctx, c[0], s*0.02);
    ctx.strokeStyle = darken(c[1]||'#aaa'); ctx.lineWidth = s*0.02;
    ctx.beginPath(); ctx.moveTo(-s*0.1, -s*0.1); ctx.lineTo(s*0.1, s*0.05); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s*0.05, -s*0.15); ctx.lineTo(-s*0.05, s*0.1); ctx.stroke();
    itemHighlight(ctx, -s*0.08, -s*0.1, s*0.1, s*0.06);
  } };

const grape_bunch: ItemDef = {
  id: 'grape_bunch', name: 'Grape Bunch', world: 'lunchbox', sizeTier: 3, baseValue: 5, weight: 1.4,
  draw(ctx, s, c) {
    const stem = c[1] || '#4ade80';
    ctx.strokeStyle = darken(stem); ctx.lineWidth = s * 0.045; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, -s * 0.5); ctx.quadraticCurveTo(s * 0.08, -s * 0.38, 0, -s * 0.28); ctx.stroke();
    const pts: [number, number][] = [[0, -s * 0.18], [-s * 0.14, s * 0.02], [s * 0.14, s * 0.02], [-s * 0.22, s * 0.22], [0, s * 0.2], [s * 0.22, s * 0.22]];
    for (const [gx, gy] of pts) {
      ctx.fillStyle = itemGradient(ctx, gx, gy, s * 0.1, c[0]);
      ctx.beginPath(); ctx.arc(gx, gy, s * 0.1, 0, Math.PI * 2); ctx.fill();
    }
    itemHighlight(ctx, -s*0.06, -s*0.12, s*0.08, s*0.05);
  },
};

const carrot_stick: ItemDef = {
  id: 'carrot_stick', name: 'Carrot Stick', world: 'lunchbox', sizeTier: 3, baseValue: 4, weight: 1.2,
  draw(ctx, s, c) {
    const leaves = c[1] || '#4ade80';
    ctx.fillStyle = itemGradient(ctx, 0, -s*0.44, s*0.14, leaves);
    for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.ellipse(i * s * 0.14, -s * 0.44, s * 0.07, s * 0.14, i * 0.5, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.22, -s*0.32, s*0.22, s*0.42, c[0]);
    ctx.beginPath(); ctx.moveTo(-s * 0.22, -s * 0.32); ctx.lineTo(s * 0.22, -s * 0.32); ctx.lineTo(s * 0.07, s * 0.42); ctx.lineTo(-s * 0.07, s * 0.42); ctx.closePath();
    ctx.fill(); itemOutline(ctx, c[0], s*0.02);
    ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = s * 0.025;
    ctx.beginPath(); ctx.moveTo(0, -s * 0.22); ctx.lineTo(0, s * 0.32); ctx.stroke();
    itemHighlight(ctx, -s*0.06, -s*0.15, s*0.05, s*0.1);
  },
};

const pretzel: ItemDef = {
  id: 'pretzel', name: 'Pretzel', world: 'lunchbox', sizeTier: 3, baseValue: 6, weight: 1.8,
  draw(ctx, s, c) {
    ctx.strokeStyle = darken(c[0], 0.15); ctx.lineWidth = s * 0.13; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(-s * 0.38, s * 0.08);
    ctx.bezierCurveTo(-s * 0.52, -s * 0.35, -s * 0.12, -s * 0.42, 0, -s * 0.12);
    ctx.bezierCurveTo(s * 0.12, -s * 0.42, s * 0.52, -s * 0.35, s * 0.38, s * 0.08);
    ctx.bezierCurveTo(s * 0.32, s * 0.38, -s * 0.32, s * 0.38, -s * 0.38, s * 0.08);
    ctx.stroke();
    ctx.strokeStyle = c[0]; ctx.lineWidth = s * 0.11;
    ctx.beginPath();
    ctx.moveTo(-s * 0.38, s * 0.08);
    ctx.bezierCurveTo(-s * 0.52, -s * 0.35, -s * 0.12, -s * 0.42, 0, -s * 0.12);
    ctx.bezierCurveTo(s * 0.12, -s * 0.42, s * 0.52, -s * 0.35, s * 0.38, s * 0.08);
    ctx.bezierCurveTo(s * 0.32, s * 0.38, -s * 0.32, s * 0.38, -s * 0.38, s * 0.08);
    ctx.stroke();
    ctx.fillStyle = c[1];
    for (let i = 0; i < 8; i++) { const t = (i / 8) * Math.PI * 2; ctx.beginPath(); ctx.arc(Math.cos(t) * s * 0.28, Math.sin(t) * s * 0.18, s * 0.028, 0, Math.PI * 2); ctx.fill(); }
    itemHighlight(ctx, -s*0.1, -s*0.12, s*0.1, s*0.06);
  },
};

const yogurt_cup: ItemDef = {
  id: 'yogurt_cup', name: 'Yogurt Cup', world: 'lunchbox', sizeTier: 3, baseValue: 5, weight: 1.5,
  draw(ctx, s, c) {
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.26, -s*0.1, s*0.26, s*0.28, c[0]);
    ctx.beginPath(); ctx.moveTo(-s * 0.26, s * 0.28); ctx.lineTo(-s * 0.2, -s * 0.1); ctx.lineTo(s * 0.2, -s * 0.1); ctx.lineTo(s * 0.26, s * 0.28); ctx.closePath();
    ctx.fill(); itemOutline(ctx, c[0], s*0.02);
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.22, -s*0.22, s*0.22, -s*0.1, c[1]);
    roundRect(ctx, -s * 0.22, -s * 0.22, s * 0.44, s * 0.12, s * 0.04); ctx.fill();
    const spoon = c[2] || '#888';
    ctx.fillStyle = spoon; ctx.fillRect(s * 0.16, -s * 0.38, s * 0.035, s * 0.28);
    ctx.beginPath(); ctx.ellipse(s * 0.177, -s * 0.4, s * 0.07, s * 0.045, -0.2, 0, Math.PI * 2); ctx.fill();
    itemHighlight(ctx, -s*0.06, -s*0.05, s*0.08, s*0.06);
  },
};

// ─── Toy Box ───

const buildingBlock: ItemDef = { id: 'building_block', name: 'Building Block', world: 'toy_box', sizeTier: 3, baseValue: 6, weight: 2.5,
  draw(ctx, s, c) {
    ctx.fillStyle = itemGradient(ctx, 0, 0, s*0.4, c[0]);
    roundRect(ctx, -s*0.28, -s*0.28, s*0.56, s*0.56, s*0.04); ctx.fill();
    itemOutline(ctx, c[0], s*0.03);
    ctx.fillStyle = c[1]; ctx.font = `bold ${s*0.35}px 'Fredoka', sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('A', 0, 0);
    itemHighlight(ctx, -s*0.1, -s*0.12, s*0.12, s*0.08);
  } };

const toyCarItem: ItemDef = { id: 'toy_car', name: 'Toy Car', world: 'toy_box', sizeTier: 3, baseValue: 7, weight: 2,
  draw(ctx, s, c) {
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.35, -s*0.2, s*0.35, s*0.15, c[0]);
    roundRect(ctx, -s*0.35, -s*0.05, s*0.7, s*0.2, s*0.04); ctx.fill();
    roundRect(ctx, -s*0.18, -s*0.2, s*0.36, s*0.18, s*0.04); ctx.fill();
    itemOutline(ctx, c[0], s*0.02);
    ctx.fillStyle = itemGradient(ctx, -s*0.2, s*0.15, s*0.07, c[1]||'#333');
    ctx.beginPath(); ctx.arc(-s*0.2, s*0.15, s*0.07, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = itemGradient(ctx, s*0.2, s*0.15, s*0.07, c[1]||'#333');
    ctx.beginPath(); ctx.arc(s*0.2, s*0.15, s*0.07, 0, Math.PI*2); ctx.fill();
    itemHighlight(ctx, -s*0.12, -s*0.12, s*0.12, s*0.06);
  } };

const actionFigure: ItemDef = { id: 'action_figure', name: 'Action Figure', world: 'toy_box', sizeTier: 3, baseValue: 8, weight: 1.5,
  draw(ctx, s, c) {
    ctx.fillStyle = itemGradient(ctx, 0, -s*0.28, s*0.12, c[0]);
    ctx.beginPath(); ctx.arc(0, -s*0.28, s*0.12, 0, Math.PI*2); ctx.fill();
    itemOutline(ctx, c[0], s*0.02);
    ctx.strokeStyle = c[0]; ctx.lineWidth = s*0.06; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, -s*0.16); ctx.lineTo(0, s*0.12); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s*0.2, -s*0.05); ctx.lineTo(s*0.2, -s*0.05); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, s*0.12); ctx.lineTo(-s*0.15, s*0.35); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, s*0.12); ctx.lineTo(s*0.15, s*0.35); ctx.stroke();
    itemHighlight(ctx, -s*0.04, -s*0.32, s*0.05, s*0.04);
  } };

const teddyBear: ItemDef = { id: 'teddy_bear', name: 'Teddy Bear', world: 'toy_box', sizeTier: 3, baseValue: 7, weight: 2.5,
  draw(ctx, s, c) {
    ctx.fillStyle = itemGradient(ctx, 0, 0, s*0.3, c[0]);
    ctx.beginPath(); ctx.arc(-s*0.15, -s*0.28, s*0.08, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.15, -s*0.28, s*0.08, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, -s*0.18, s*0.18, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, s*0.12, s*0.25, 0, Math.PI*2); ctx.fill();
    itemOutline(ctx, c[0], s*0.02);
    ctx.fillStyle = c[1]||'#333';
    ctx.beginPath(); ctx.arc(-s*0.06, -s*0.22, s*0.03, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.06, -s*0.22, s*0.03, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, -s*0.15, s*0.03, 0, Math.PI*2); ctx.fill();
    itemHighlight(ctx, -s*0.08, -s*0.22, s*0.08, s*0.05);
  } };

const yoYo: ItemDef = { id: 'yo_yo', name: 'Yo-Yo', world: 'toy_box', sizeTier: 3, baseValue: 5, weight: 2,
  draw(ctx, s, c) {
    ctx.fillStyle = itemGradient(ctx, 0, 0, s*0.3, c[0]);
    ctx.beginPath(); ctx.arc(0, 0, s*0.3, 0, Math.PI*2); ctx.fill();
    itemOutline(ctx, c[0], s*0.025);
    ctx.fillStyle = itemGradient(ctx, 0, 0, s*0.15, c[1]);
    ctx.beginPath(); ctx.arc(0, 0, s*0.15, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = darken(c[2]||'#333'); ctx.lineWidth = s*0.03; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, -s*0.3); ctx.lineTo(0, -s*0.45); ctx.stroke();
    itemHighlight(ctx, -s*0.1, -s*0.1, s*0.08, s*0.06);
  } };

const spinningTop: ItemDef = { id: 'spinning_top', name: 'Spinning Top', world: 'toy_box', sizeTier: 3, baseValue: 6, weight: 2,
  draw(ctx, s, c) {
    ctx.fillStyle = itemGradient(ctx, 0, 0, s*0.35, c[0]);
    ctx.beginPath(); ctx.moveTo(-s*0.25, -s*0.1); ctx.lineTo(s*0.25, -s*0.1); ctx.lineTo(0, s*0.4); ctx.closePath();
    ctx.fill(); itemOutline(ctx, c[0], s*0.025);
    ctx.fillStyle = itemGradient(ctx, 0, -s*0.1, s*0.25, c[1]);
    ctx.beginPath(); ctx.ellipse(0, -s*0.1, s*0.25, s*0.08, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[2]||c[0]; ctx.fillRect(-s*0.03, -s*0.3, s*0.06, s*0.2);
    itemHighlight(ctx, -s*0.08, -s*0.08, s*0.08, s*0.04);
  } };

const puzzle_piece: ItemDef = {
  id: 'puzzle_piece', name: 'Puzzle Piece', world: 'toy_box', sizeTier: 3, baseValue: 6, weight: 2,
  draw(ctx, s, c) {
    const u = s * 0.3, tabR = u * 0.38, sockR = u * 0.32;
    ctx.fillStyle = itemGradient(ctx, 0, 0, u, c[0]);
    ctx.beginPath();
    ctx.moveTo(-u, u); ctx.lineTo(-u, -u); ctx.lineTo(-tabR, -u);
    ctx.arc(0, -u, tabR, Math.PI, 0, false); ctx.lineTo(u, -u);
    ctx.lineTo(u, -sockR); ctx.arc(u - sockR, 0, sockR, -Math.PI / 2, Math.PI / 2, false);
    ctx.lineTo(u, sockR); ctx.lineTo(u, u); ctx.closePath();
    ctx.fill(); itemOutline(ctx, c[0], s * 0.025);
    itemHighlight(ctx, -s*0.06, -s*0.08, s*0.08, s*0.05);
  },
};

const bouncy_ball: ItemDef = {
  id: 'bouncy_ball', name: 'Bouncy Ball', world: 'toy_box', sizeTier: 3, baseValue: 7, weight: 2.1,
  draw(ctx, s, c) {
    ctx.fillStyle = itemGradient(ctx, 0, 0, s*0.44, c[0]);
    ctx.beginPath(); ctx.arc(0, 0, s * 0.44, 0, Math.PI * 2); ctx.fill();
    itemOutline(ctx, c[0], s*0.025);
    ctx.save(); ctx.strokeStyle = c[1]; ctx.lineWidth = s * 0.09; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(0, 0, s * 0.32, -0.45, Math.PI + 0.45); ctx.stroke(); ctx.restore();
    itemHighlight(ctx, -s*0.16, -s*0.2, s*0.1, s*0.07);
  },
};

const toy_train: ItemDef = {
  id: 'toy_train', name: 'Toy Train', world: 'toy_box', sizeTier: 3, baseValue: 8, weight: 2.3,
  draw(ctx, s, c) {
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.42, -s*0.06, s*0.1, s*0.18, c[0]);
    roundRect(ctx, -s * 0.42, -s * 0.06, s * 0.52, s * 0.24, s * 0.04); ctx.fill();
    itemOutline(ctx, c[0], s*0.02);
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.06, -s*0.4, s*0.06, -s*0.12, c[2]);
    roundRect(ctx, -s * 0.06, -s * 0.34, s * 0.12, s * 0.22, s * 0.03); ctx.fill();
    ctx.fillRect(-s * 0.02, -s * 0.4, s * 0.04, s * 0.08);
    ctx.fillStyle = itemLinearGradient(ctx, s*0.12, -s*0.12, s*0.44, s*0.08, c[0]);
    roundRect(ctx, s * 0.12, -s * 0.12, s * 0.32, s * 0.2, s * 0.04); ctx.fill();
    ctx.fillStyle = itemGradient(ctx, -s*0.24, s*0.2, s*0.09, c[1]);
    ctx.beginPath(); ctx.arc(-s * 0.24, s * 0.2, s * 0.09, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = itemGradient(ctx, s*0.02, s*0.2, s*0.09, c[1]);
    ctx.beginPath(); ctx.arc(s * 0.02, s * 0.2, s * 0.09, 0, Math.PI * 2); ctx.fill();
    itemHighlight(ctx, -s*0.15, -s*0.05, s*0.1, s*0.05);
  },
};

const doll: ItemDef = {
  id: 'doll', name: 'Doll', world: 'toy_box', sizeTier: 3, baseValue: 5, weight: 1.9,
  draw(ctx, s, c) {
    ctx.fillStyle = itemGradient(ctx, 0, s*0.2, s*0.3, c[0]);
    ctx.beginPath(); ctx.moveTo(0, -s * 0.02); ctx.lineTo(-s * 0.28, s * 0.44); ctx.lineTo(s * 0.28, s * 0.44); ctx.closePath();
    ctx.fill(); itemOutline(ctx, c[0], s*0.02);
    ctx.fillStyle = itemGradient(ctx, 0, -s*0.28, s*0.15, c[1] || '#f5deb3');
    ctx.beginPath(); ctx.arc(0, -s * 0.28, s * 0.15, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = c[2];
    for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.arc(i * s * 0.07, -s * 0.38, s * 0.045, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = '#1f2937';
    ctx.beginPath(); ctx.arc(-s * 0.05, -s * 0.3, s * 0.018, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.05, -s * 0.3, s * 0.018, 0, Math.PI * 2); ctx.fill();
    itemHighlight(ctx, -s*0.04, -s*0.32, s*0.05, s*0.04);
  },
};

// ─── Backpack ───

const pen: ItemDef = {
  id: 'pen', name: 'Pen', world: 'backpack', sizeTier: 3, baseValue: 7, weight: 2,
  draw(ctx, s, c) {
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.06, -s*0.45, s*0.06, s*0.25, c[0]);
    roundRect(ctx, -s * 0.06, -s * 0.45, s * 0.12, s * 0.7, s*0.02); ctx.fill();
    itemOutline(ctx, c[0], s*0.02);
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.06, -s*0.45, s*0.06, -s*0.33, c[1]);
    ctx.fillRect(-s * 0.06, -s * 0.45, s * 0.12, s * 0.12);
    ctx.fillStyle = itemGradient(ctx, 0, s*0.35, s*0.06, c[2] || '#333');
    ctx.beginPath(); ctx.moveTo(-s * 0.06, s * 0.25); ctx.lineTo(s * 0.06, s * 0.25); ctx.lineTo(0, s * 0.45); ctx.closePath(); ctx.fill();
    itemHighlight(ctx, -s*0.02, -s*0.2, s*0.03, s*0.1);
  },
};

const key: ItemDef = {
  id: 'key', name: 'Key', world: 'backpack', sizeTier: 3, baseValue: 8, weight: 3,
  draw(ctx, s, c) {
    ctx.fillStyle = itemGradient(ctx, 0, -s*0.25, s*0.18, c[0]);
    ctx.beginPath(); ctx.arc(0, -s * 0.25, s * 0.18, 0, Math.PI * 2); ctx.fill();
    itemOutline(ctx, c[0], s*0.02);
    ctx.fillStyle = c[1] || c[0]; ctx.beginPath(); ctx.arc(0, -s * 0.25, s * 0.1, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.05, -s*0.1, s*0.05, s*0.38, c[0]);
    ctx.fillRect(-s * 0.05, -s * 0.1, s * 0.1, s * 0.48);
    ctx.fillRect(s * 0.05, s * 0.2, s * 0.12, s * 0.06);
    ctx.fillRect(s * 0.05, s * 0.08, s * 0.08, s * 0.06);
    itemHighlight(ctx, -s*0.06, -s*0.3, s*0.06, s*0.05);
  },
};

const usbDrive: ItemDef = {
  id: 'usb_drive', name: 'USB Drive', world: 'backpack', sizeTier: 3, baseValue: 7, weight: 1.8,
  draw(ctx, s, c) {
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.15, -s*0.35, s*0.15, s*0.2, c[0]);
    roundRect(ctx, -s * 0.15, -s * 0.35, s * 0.3, s * 0.55, s * 0.04); ctx.fill();
    itemOutline(ctx, c[0], s*0.02);
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.1, s*0.2, s*0.1, s*0.4, c[1]);
    ctx.fillRect(-s * 0.1, s * 0.2, s * 0.2, s * 0.2);
    ctx.fillStyle = c[2] || '#fff'; ctx.fillRect(-s * 0.06, -s * 0.2, s * 0.12, s * 0.08);
    itemHighlight(ctx, -s*0.05, -s*0.22, s*0.06, s*0.08);
  },
};

const wallet: ItemDef = {
  id: 'wallet', name: 'Wallet', world: 'backpack', sizeTier: 3, baseValue: 10, weight: 2.5,
  draw(ctx, s, c) {
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.35, -s*0.28, s*0.35, s*0.28, c[0]);
    roundRect(ctx, -s * 0.35, -s * 0.28, s * 0.7, s * 0.56, s * 0.06); ctx.fill();
    itemOutline(ctx, c[0], s*0.025);
    ctx.strokeStyle = darken(c[1]); ctx.lineWidth = s * 0.03;
    ctx.beginPath(); ctx.moveTo(-s * 0.35, -s * 0.05); ctx.lineTo(s * 0.35, -s * 0.05); ctx.stroke();
    ctx.fillStyle = itemLinearGradient(ctx, s*0.05, -s*0.2, s*0.27, -s*0.1, c[1]);
    roundRect(ctx, s * 0.05, -s * 0.2, s * 0.22, s * 0.1, s * 0.02); ctx.fill();
    itemHighlight(ctx, -s*0.12, -s*0.18, s*0.15, s*0.06);
  },
};

const glasses: ItemDef = {
  id: 'glasses', name: 'Glasses', world: 'backpack', sizeTier: 3, baseValue: 9, weight: 1.5,
  draw(ctx, s, c) {
    ctx.strokeStyle = darken(c[0], 0.15); ctx.lineWidth = s * 0.06; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(-s * 0.2, 0, s * 0.18, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(s * 0.2, 0, s * 0.18, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = c[0]; ctx.lineWidth = s * 0.05;
    ctx.beginPath(); ctx.arc(-s * 0.2, 0, s * 0.18, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(s * 0.2, 0, s * 0.18, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s * 0.02, 0); ctx.lineTo(s * 0.02, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s * 0.38, -s * 0.04); ctx.lineTo(-s * 0.48, -s * 0.08); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s * 0.38, -s * 0.04); ctx.lineTo(s * 0.48, -s * 0.08); ctx.stroke();
    itemHighlight(ctx, -s*0.25, -s*0.06, s*0.06, s*0.04);
  },
};

const remote: ItemDef = {
  id: 'remote', name: 'Remote', world: 'backpack', sizeTier: 3, baseValue: 8, weight: 2.2,
  draw(ctx, s, c) {
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.14, -s*0.42, s*0.14, s*0.42, c[0]);
    roundRect(ctx, -s * 0.14, -s * 0.42, s * 0.28, s * 0.84, s * 0.06); ctx.fill();
    itemOutline(ctx, c[0], s*0.02);
    ctx.fillStyle = itemGradient(ctx, 0, -s*0.24, s*0.06, c[1]);
    ctx.beginPath(); ctx.arc(0, -s * 0.24, s * 0.06, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = c[2] || '#444';
    const bw = s * 0.06, bh = s * 0.05;
    ctx.fillRect(-bw, -s * 0.05, bw * 2, bh);
    ctx.fillRect(-bw, s * 0.05, bw * 2, bh);
    ctx.fillRect(-bw, s * 0.15, bw * 2, bh);
    itemHighlight(ctx, -s*0.04, -s*0.28, s*0.05, s*0.08);
  },
};

const apple: ItemDef = {
  id: 'apple', name: 'Apple', world: 'backpack', sizeTier: 3, baseValue: 6, weight: 2.8,
  draw(ctx, s, c) {
    ctx.fillStyle = itemGradient(ctx, 0, s*0.05, s*0.35, c[0]);
    ctx.beginPath(); ctx.arc(-s * 0.08, s * 0.05, s * 0.32, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.08, s * 0.05, s * 0.32, 0, Math.PI * 2); ctx.fill();
    itemOutline(ctx, c[0], s*0.02);
    ctx.fillStyle = c[1] || '#5b3a1a'; ctx.fillRect(-s * 0.025, -s * 0.35, s * 0.05, s * 0.18);
    ctx.fillStyle = c[2] || '#4ade80';
    ctx.beginPath(); ctx.moveTo(s * 0.02, -s * 0.28); ctx.quadraticCurveTo(s * 0.18, -s * 0.42, s * 0.12, -s * 0.2); ctx.fill();
    itemHighlight(ctx, -s*0.1, -s*0.08, s*0.1, s*0.07);
  },
};

const mug: ItemDef = {
  id: 'mug', name: 'Mug', world: 'backpack', sizeTier: 3, baseValue: 9, weight: 3.5,
  draw(ctx, s, c) {
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.25, -s*0.3, s*0.2, s*0.3, c[0]);
    roundRect(ctx, -s * 0.25, -s * 0.3, s * 0.45, s * 0.6, s * 0.06); ctx.fill();
    itemOutline(ctx, c[0], s*0.025);
    ctx.strokeStyle = darken(c[1]); ctx.lineWidth = s * 0.05;
    ctx.beginPath(); ctx.arc(s * 0.25, 0, s * 0.14, -Math.PI * 0.4, Math.PI * 0.4); ctx.stroke();
    ctx.fillStyle = itemGradient(ctx, 0, -s*0.3, s*0.22, c[2] || '#8B4513');
    ctx.beginPath(); ctx.ellipse(0, -s * 0.3, s * 0.22, s * 0.06, 0, 0, Math.PI * 2); ctx.fill();
    itemHighlight(ctx, -s*0.1, -s*0.18, s*0.1, s*0.06);
  },
};

const water_bottle: ItemDef = {
  id: 'water_bottle', name: 'Water Bottle', world: 'backpack', sizeTier: 3, baseValue: 8, weight: 2.5,
  draw(ctx, s, c) {
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.13, -s*0.46, s*0.13, -s*0.34, c[1]);
    roundRect(ctx, -s * 0.13, -s * 0.46, s * 0.26, s * 0.12, s * 0.04); ctx.fill();
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.18, -s*0.32, s*0.18, s*0.3, c[0]);
    roundRect(ctx, -s * 0.18, -s * 0.32, s * 0.36, s * 0.62, s * 0.14); ctx.fill();
    itemOutline(ctx, c[0], s*0.02);
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = s * 0.04;
    ctx.beginPath(); ctx.moveTo(s * 0.12, -s * 0.18); ctx.lineTo(s * 0.12, s * 0.22); ctx.stroke();
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.15, -s*0.02, s*0.15, s*0.1, c[2]);
    roundRect(ctx, -s * 0.15, -s * 0.02, s * 0.3, s * 0.12, s * 0.03); ctx.fill();
    itemHighlight(ctx, -s*0.06, -s*0.2, s*0.06, s*0.1);
  },
};

const headphones_item: ItemDef = {
  id: 'headphones_item', name: 'Headphones', world: 'backpack', sizeTier: 3, baseValue: 10, weight: 2.8,
  draw(ctx, s, c) {
    ctx.strokeStyle = darken(c[0], 0.15); ctx.lineWidth = s * 0.11; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-s * 0.46, s * 0.06); ctx.quadraticCurveTo(0, -s * 0.44, s * 0.46, s * 0.06); ctx.stroke();
    ctx.strokeStyle = c[0]; ctx.lineWidth = s * 0.095;
    ctx.beginPath(); ctx.moveTo(-s * 0.46, s * 0.06); ctx.quadraticCurveTo(0, -s * 0.44, s * 0.46, s * 0.06); ctx.stroke();
    ctx.fillStyle = itemGradient(ctx, -s*0.46, s*0.1, s*0.17, c[1]);
    ctx.beginPath(); ctx.arc(-s * 0.46, s * 0.1, s * 0.17, 0, Math.PI * 2); ctx.fill();
    itemOutline(ctx, c[1], s*0.02);
    ctx.fillStyle = itemGradient(ctx, s*0.46, s*0.1, s*0.17, c[1]);
    ctx.beginPath(); ctx.arc(s * 0.46, s * 0.1, s * 0.17, 0, Math.PI * 2); ctx.fill();
    itemOutline(ctx, c[1], s*0.02);
    itemHighlight(ctx, -s*0.5, s*0.04, s*0.06, s*0.04);
  },
};

// ─── Bedroom ───

const fan: ItemDef = {
  id: 'fan', name: 'Fan', world: 'bedroom', sizeTier: 5, baseValue: 25, weight: 6,
  draw(ctx, s, c) {
    ctx.fillStyle = itemGradient(ctx, 0, -s*0.05, s*0.35, c[0]);
    ctx.beginPath(); ctx.arc(0, -s * 0.05, s * 0.35, 0, Math.PI * 2); ctx.fill();
    itemOutline(ctx, c[0], s*0.025);
    ctx.fillStyle = itemGradient(ctx, 0, -s*0.05, s*0.2, c[1]);
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2 - Math.PI / 2;
      ctx.beginPath();
      ctx.ellipse(Math.cos(a) * s * 0.16, -s * 0.05 + Math.sin(a) * s * 0.16, s * 0.2, s * 0.08, a, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = c[2] || c[0];
    ctx.fillRect(-s * 0.03, s * 0.3, s * 0.06, s * 0.12);
    roundRect(ctx, -s * 0.12, s * 0.42, s * 0.24, s * 0.04, s * 0.01); ctx.fill();
    itemHighlight(ctx, -s*0.12, -s*0.15, s*0.1, s*0.06);
  },
};

const suitcase: ItemDef = {
  id: 'suitcase', name: 'Suitcase', world: 'bedroom', sizeTier: 5, baseValue: 33, weight: 9,
  draw(ctx, s, c) {
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.35, -s*0.28, s*0.35, s*0.28, c[0]);
    roundRect(ctx, -s * 0.35, -s * 0.28, s * 0.7, s * 0.56, s * 0.05); ctx.fill();
    itemOutline(ctx, c[0], s*0.025);
    ctx.strokeStyle = darken(c[1]); ctx.lineWidth = s * 0.03;
    ctx.beginPath(); ctx.moveTo(-s * 0.35, 0); ctx.lineTo(s * 0.35, 0); ctx.stroke();
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.15, -s*0.38, s*0.15, -s*0.28, c[1]);
    roundRect(ctx, -s * 0.15, -s * 0.38, s * 0.3, s * 0.1, s * 0.03); ctx.fill();
    ctx.fillStyle = c[2] || '#ccc'; ctx.fillRect(-s * 0.05, -s * 0.05, s * 0.1, s * 0.06);
    itemHighlight(ctx, -s*0.12, -s*0.18, s*0.15, s*0.06);
  },
};

const pillow: ItemDef = { id: 'pillow', name: 'Pillow', world: 'bedroom', sizeTier: 4, baseValue: 12, weight: 3,
  draw(ctx, s, c) {
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.35, -s*0.22, s*0.35, s*0.22, c[0]);
    roundRect(ctx, -s*0.35, -s*0.22, s*0.7, s*0.44, s*0.15); ctx.fill();
    itemOutline(ctx, c[0], s*0.02);
    ctx.strokeStyle = darken(c[1]||'#ddd'); ctx.lineWidth = s*0.02;
    ctx.beginPath(); ctx.moveTo(-s*0.15, -s*0.22); ctx.quadraticCurveTo(-s*0.15, 0, -s*0.15, s*0.22); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s*0.15, -s*0.22); ctx.quadraticCurveTo(s*0.15, 0, s*0.15, s*0.22); ctx.stroke();
    itemHighlight(ctx, -s*0.12, -s*0.1, s*0.15, s*0.06);
  } };

const alarmClock: ItemDef = { id: 'alarm_clock', name: 'Alarm Clock', world: 'bedroom', sizeTier: 4, baseValue: 14, weight: 3.5,
  draw(ctx, s, c) {
    ctx.fillStyle = itemGradient(ctx, 0, 0, s*0.3, c[0]);
    ctx.beginPath(); ctx.arc(-s*0.18, -s*0.3, s*0.1, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.18, -s*0.3, s*0.1, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, 0, s*0.3, 0, Math.PI*2); ctx.fill();
    itemOutline(ctx, c[0], s*0.025);
    ctx.fillStyle = c[1]||'#fff'; ctx.beginPath(); ctx.arc(0, 0, s*0.24, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = darken(c[2]||'#333'); ctx.lineWidth = s*0.03; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -s*0.16); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(s*0.1, s*0.04); ctx.stroke();
    itemHighlight(ctx, -s*0.1, -s*0.1, s*0.08, s*0.06);
  } };

const slipper: ItemDef = { id: 'slipper', name: 'Slipper', world: 'bedroom', sizeTier: 4, baseValue: 10, weight: 2.5,
  draw(ctx, s, c) {
    ctx.fillStyle = itemGradient(ctx, 0, 0, s*0.35, c[0]);
    ctx.beginPath(); ctx.moveTo(-s*0.3, s*0.1); ctx.quadraticCurveTo(-s*0.3, -s*0.2, 0, -s*0.25);
    ctx.quadraticCurveTo(s*0.3, -s*0.2, s*0.35, 0); ctx.quadraticCurveTo(s*0.35, s*0.2, s*0.15, s*0.2);
    ctx.lineTo(-s*0.2, s*0.2); ctx.quadraticCurveTo(-s*0.35, s*0.2, -s*0.3, s*0.1); ctx.closePath();
    ctx.fill(); itemOutline(ctx, c[0], s*0.02);
    ctx.fillStyle = itemGradient(ctx, 0, -s*0.05, s*0.18, c[1]);
    ctx.beginPath(); ctx.arc(0, -s*0.05, s*0.18, Math.PI, 0); ctx.closePath(); ctx.fill();
    itemHighlight(ctx, -s*0.1, -s*0.1, s*0.1, s*0.05);
  } };

const teddy: ItemDef = { id: 'teddy', name: 'Teddy', world: 'bedroom', sizeTier: 4, baseValue: 13, weight: 3,
  draw(ctx, s, c) {
    ctx.fillStyle = itemGradient(ctx, 0, 0, s*0.3, c[0]);
    ctx.beginPath(); ctx.arc(-s*0.17, -s*0.3, s*0.1, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.17, -s*0.3, s*0.1, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, -s*0.15, s*0.22, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, s*0.18, s*0.28, 0, Math.PI*2); ctx.fill();
    itemOutline(ctx, c[0], s*0.02);
    ctx.fillStyle = c[1]||'#333';
    ctx.beginPath(); ctx.arc(-s*0.08, -s*0.2, s*0.03, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.08, -s*0.2, s*0.03, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[2]||'#ff6b6b'; ctx.beginPath(); ctx.arc(0, -s*0.12, s*0.04, 0, Math.PI*2); ctx.fill();
    itemHighlight(ctx, -s*0.08, -s*0.2, s*0.08, s*0.05);
  } };

const nightLamp: ItemDef = { id: 'night_lamp', name: 'Night Lamp', world: 'bedroom', sizeTier: 4, baseValue: 15, weight: 4,
  draw(ctx, s, c) {
    ctx.fillStyle = itemGradient(ctx, 0, -s*0.1, s*0.25, c[0]);
    ctx.beginPath(); ctx.moveTo(-s*0.25, s*0.05); ctx.lineTo(-s*0.1, -s*0.3); ctx.lineTo(s*0.1, -s*0.3); ctx.lineTo(s*0.25, s*0.05); ctx.closePath();
    ctx.fill(); itemOutline(ctx, c[0], s*0.02);
    ctx.fillStyle = c[1]||'#666'; ctx.fillRect(-s*0.03, s*0.05, s*0.06, s*0.22);
    ctx.fillStyle = c[2]||'#888'; roundRect(ctx, -s*0.12, s*0.27, s*0.24, s*0.05, s*0.02); ctx.fill();
    itemHighlight(ctx, -s*0.08, -s*0.15, s*0.06, s*0.06);
  } };

const hanger: ItemDef = { id: 'hanger', name: 'Hanger', world: 'bedroom', sizeTier: 4, baseValue: 9, weight: 2,
  draw(ctx, s, c) {
    ctx.strokeStyle = darken(c[0], 0.15); ctx.lineWidth = s*0.06; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(0, -s*0.3, s*0.08, Math.PI, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -s*0.22); ctx.lineTo(-s*0.35, s*0.15); ctx.lineTo(s*0.35, s*0.15); ctx.closePath(); ctx.stroke();
    ctx.strokeStyle = c[0]; ctx.lineWidth = s*0.05;
    ctx.beginPath(); ctx.arc(0, -s*0.3, s*0.08, Math.PI, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -s*0.22); ctx.lineTo(-s*0.35, s*0.15); ctx.lineTo(s*0.35, s*0.15); ctx.closePath(); ctx.stroke();
    itemHighlight(ctx, -s*0.08, -s*0.25, s*0.06, s*0.04);
  } };

const book_stack: ItemDef = {
  id: 'book_stack', name: 'Book Stack', world: 'bedroom', sizeTier: 4, baseValue: 12, weight: 3.2,
  draw(ctx, s, c) {
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.36, s*0.02, s*0.4, s*0.14, c[2]);
    roundRect(ctx, -s * 0.36, s * 0.02, s * 0.76, s * 0.12, s*0.02); ctx.fill();
    itemOutline(ctx, c[2], s*0.02);
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.33, -s*0.1, s*0.31, s*0.02, c[1]);
    roundRect(ctx, -s * 0.33, -s * 0.1, s * 0.64, s * 0.12, s*0.02); ctx.fill();
    itemOutline(ctx, c[1], s*0.02);
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.27, -s*0.22, s*0.21, -s*0.1, c[0]);
    roundRect(ctx, -s * 0.27, -s * 0.22, s * 0.48, s * 0.12, s*0.02); ctx.fill();
    itemOutline(ctx, c[0], s*0.02);
    itemHighlight(ctx, -s*0.1, -s*0.18, s*0.1, s*0.04);
  },
};

const plushie: ItemDef = {
  id: 'plushie', name: 'Plushie', world: 'bedroom', sizeTier: 4, baseValue: 13, weight: 3.5,
  draw(ctx, s, c) {
    ctx.fillStyle = itemGradient(ctx, 0, s*0.06, s*0.35, c[0]);
    ctx.beginPath(); ctx.arc(-s * 0.3, -s * 0.02, s * 0.1, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.3, -s * 0.02, s * 0.1, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, s * 0.06, s * 0.32, 0, Math.PI * 2); ctx.fill();
    itemOutline(ctx, c[0], s*0.02);
    ctx.fillStyle = c[1];
    ctx.beginPath(); ctx.arc(-s * 0.1, -s * 0.08, s * 0.04, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.1, -s * 0.08, s * 0.04, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = c[2] || c[0]; ctx.lineWidth = s * 0.025; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(0, s * 0.02, s * 0.1, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
    itemHighlight(ctx, -s*0.1, -s*0.05, s*0.1, s*0.06);
  },
};

// ─── Kitchen ───

const smallTable: ItemDef = {
  id: 'small_table', name: 'Small Table', world: 'kitchen', sizeTier: 5, baseValue: 32, weight: 10,
  draw(ctx, s, c) {
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.4, -s*0.32, s*0.4, -s*0.24, c[0]);
    roundRect(ctx, -s * 0.4, -s * 0.32, s * 0.8, s * 0.08, s * 0.02); ctx.fill();
    itemOutline(ctx, c[0], s*0.02);
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.34, -s*0.24, -s*0.28, s*0.36, c[1] || c[0]);
    ctx.fillRect(-s * 0.34, -s * 0.24, s * 0.06, s * 0.6);
    ctx.fillRect(s * 0.28, -s * 0.24, s * 0.06, s * 0.6);
    itemHighlight(ctx, -s*0.15, -s*0.3, s*0.2, s*0.03);
  },
};

const microwave: ItemDef = {
  id: 'microwave', name: 'Microwave', world: 'kitchen', sizeTier: 5, baseValue: 28, weight: 11,
  draw(ctx, s, c) {
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.4, -s*0.25, s*0.4, s*0.25, c[0]);
    roundRect(ctx, -s * 0.4, -s * 0.25, s * 0.8, s * 0.5, s * 0.04); ctx.fill();
    itemOutline(ctx, c[0], s*0.025);
    ctx.fillStyle = c[1] || '#222'; ctx.fillRect(-s * 0.35, -s * 0.2, s * 0.5, s * 0.4);
    ctx.fillStyle = c[2] || '#888';
    ctx.beginPath(); ctx.arc(s * 0.28, -s * 0.05, s * 0.04, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(s * 0.24, s * 0.06, s * 0.08, s * 0.03);
    ctx.fillRect(s * 0.24, s * 0.12, s * 0.08, s * 0.03);
    itemHighlight(ctx, -s*0.15, -s*0.15, s*0.15, s*0.06);
  },
};

const fridge: ItemDef = {
  id: 'fridge', name: 'Fridge', world: 'kitchen', sizeTier: 6, baseValue: 62, weight: 22,
  draw(ctx, s, c) {
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.28, -s*0.45, s*0.28, s*0.45, c[0]);
    roundRect(ctx, -s * 0.28, -s * 0.45, s * 0.56, s * 0.9, s * 0.04); ctx.fill();
    itemOutline(ctx, c[0], s*0.025);
    ctx.strokeStyle = darken(c[1]); ctx.lineWidth = s * 0.02;
    ctx.beginPath(); ctx.moveTo(-s * 0.28, -s * 0.1); ctx.lineTo(s * 0.28, -s * 0.1); ctx.stroke();
    ctx.fillStyle = c[2] || '#888';
    ctx.fillRect(s * 0.16, -s * 0.35, s * 0.04, s * 0.18);
    ctx.fillRect(s * 0.16, s * 0.0, s * 0.04, s * 0.25);
    itemHighlight(ctx, -s*0.1, -s*0.3, s*0.1, s*0.08);
  },
};

const plate: ItemDef = { id: 'plate', name: 'Plate', world: 'kitchen', sizeTier: 4, baseValue: 13, weight: 4,
  draw(ctx, s, c) {
    ctx.fillStyle = itemGradient(ctx, 0, 0, s*0.4, c[0]);
    ctx.beginPath(); ctx.arc(0, 0, s*0.4, 0, Math.PI*2); ctx.fill();
    itemOutline(ctx, c[0], s*0.02);
    ctx.fillStyle = c[1]||'#fff'; ctx.beginPath(); ctx.arc(0, 0, s*0.3, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = c[2]||'#ddd'; ctx.lineWidth = s*0.02; ctx.beginPath(); ctx.arc(0, 0, s*0.25, 0, Math.PI*2); ctx.stroke();
    itemHighlight(ctx, -s*0.12, -s*0.12, s*0.1, s*0.06);
  } };

const fryingPan: ItemDef = { id: 'frying_pan', name: 'Frying Pan', world: 'kitchen', sizeTier: 4, baseValue: 16, weight: 5,
  draw(ctx, s, c) {
    ctx.fillStyle = itemGradient(ctx, 0, 0, s*0.3, c[0]);
    ctx.beginPath(); ctx.arc(0, 0, s*0.3, 0, Math.PI*2); ctx.fill();
    itemOutline(ctx, c[0], s*0.025);
    ctx.fillStyle = c[1]||'#555'; ctx.beginPath(); ctx.arc(0, 0, s*0.25, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = itemLinearGradient(ctx, s*0.25, -s*0.05, s*0.5, s*0.05, c[0]);
    roundRect(ctx, s*0.25, -s*0.05, s*0.25, s*0.1, s*0.03); ctx.fill();
    itemHighlight(ctx, -s*0.1, -s*0.1, s*0.08, s*0.06);
  } };

const rollingPin: ItemDef = { id: 'rolling_pin', name: 'Rolling Pin', world: 'kitchen', sizeTier: 4, baseValue: 12, weight: 4.5,
  draw(ctx, s, c) {
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.3, -s*0.1, s*0.3, s*0.1, c[0]);
    roundRect(ctx, -s*0.3, -s*0.1, s*0.6, s*0.2, s*0.1); ctx.fill();
    itemOutline(ctx, c[0], s*0.02);
    ctx.fillStyle = c[1]||'#666'; ctx.fillRect(-s*0.42, -s*0.05, s*0.14, s*0.1); ctx.fillRect(s*0.28, -s*0.05, s*0.14, s*0.1);
    itemHighlight(ctx, -s*0.1, -s*0.06, s*0.12, s*0.04);
  } };

const whisk: ItemDef = { id: 'whisk', name: 'Whisk', world: 'kitchen', sizeTier: 4, baseValue: 11, weight: 3,
  draw(ctx, s, c) {
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.04, s*0.05, s*0.04, s*0.4, c[0]);
    roundRect(ctx, -s*0.04, s*0.05, s*0.08, s*0.35, s*0.02); ctx.fill();
    ctx.strokeStyle = darken(c[1]||'#999'); ctx.lineWidth = s*0.025; ctx.lineCap = 'round';
    for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i*s*0.04, s*0.05); ctx.quadraticCurveTo(i*s*0.1, -s*0.2, 0, -s*0.4); ctx.stroke(); }
    itemHighlight(ctx, -s*0.03, -s*0.15, s*0.04, s*0.06);
  } };

const cuttingBoard: ItemDef = { id: 'cutting_board', name: 'Cutting Board', world: 'kitchen', sizeTier: 4, baseValue: 14, weight: 5,
  draw(ctx, s, c) {
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.25, -s*0.35, s*0.25, s*0.4, c[0]);
    roundRect(ctx, -s*0.25, -s*0.35, s*0.5, s*0.75, s*0.06); ctx.fill();
    itemOutline(ctx, c[0], s*0.02);
    ctx.fillStyle = c[1]||'rgba(0,0,0,0.1)'; ctx.beginPath(); ctx.arc(0, s*0.28, s*0.06, 0, Math.PI*2); ctx.fill();
    itemHighlight(ctx, -s*0.08, -s*0.2, s*0.1, s*0.06);
  } };

const spiceJar: ItemDef = { id: 'spice_jar', name: 'Spice Jar', world: 'kitchen', sizeTier: 4, baseValue: 10, weight: 3.5,
  draw(ctx, s, c) {
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.15, -s*0.15, s*0.15, s*0.3, c[0]);
    roundRect(ctx, -s*0.15, -s*0.15, s*0.3, s*0.45, s*0.04); ctx.fill();
    itemOutline(ctx, c[0], s*0.02);
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.17, -s*0.25, s*0.17, -s*0.13, c[1]);
    ctx.fillRect(-s*0.17, -s*0.25, s*0.34, s*0.12);
    ctx.fillStyle = c[2]||'#fff'; ctx.fillRect(-s*0.1, 0, s*0.2, s*0.12);
    itemHighlight(ctx, -s*0.05, -s*0.08, s*0.06, s*0.06);
  } };

const oven_mitt: ItemDef = {
  id: 'oven_mitt', name: 'Oven Mitt', world: 'kitchen', sizeTier: 4, baseValue: 12, weight: 3.8,
  draw(ctx, s, c) {
    ctx.fillStyle = itemGradient(ctx, 0, 0, s*0.35, c[0]);
    roundRect(ctx, -s * 0.22, -s * 0.28, s * 0.38, s * 0.52, s * 0.1); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.18, -s * 0.12, s * 0.12, -Math.PI * 0.4, Math.PI * 0.5); ctx.lineTo(s * 0.28, s * 0.08); ctx.quadraticCurveTo(s * 0.22, s * 0.12, s * 0.12, s * 0.06); ctx.closePath(); ctx.fill();
    itemOutline(ctx, c[0], s*0.02);
    ctx.strokeStyle = darken(c[1]); ctx.lineWidth = s * 0.02; ctx.lineCap = 'round';
    for (let i = -2; i <= 2; i++) { const o = i * s * 0.08; ctx.beginPath(); ctx.moveTo(-s * 0.18 + o, -s * 0.22); ctx.lineTo(s * 0.12 + o, s * 0.18); ctx.stroke(); }
    for (let i = -2; i <= 2; i++) { const o = i * s * 0.08; ctx.beginPath(); ctx.moveTo(-s * 0.12 + o, s * 0.18); ctx.lineTo(s * 0.18 + o, -s * 0.22); ctx.stroke(); }
    itemHighlight(ctx, -s*0.08, -s*0.15, s*0.08, s*0.06);
  },
};

// ─── Bathroom ───

const washingMachine: ItemDef = {
  id: 'washing_machine', name: 'Washing Machine', world: 'bathroom', sizeTier: 6, baseValue: 55, weight: 25,
  draw(ctx, s, c) {
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.35, -s*0.38, s*0.35, s*0.38, c[0]);
    roundRect(ctx, -s * 0.35, -s * 0.38, s * 0.7, s * 0.76, s * 0.04); ctx.fill();
    itemOutline(ctx, c[0], s*0.025);
    ctx.fillStyle = c[1] || '#ddd'; ctx.fillRect(-s * 0.32, -s * 0.35, s * 0.64, s * 0.15);
    ctx.fillStyle = itemGradient(ctx, 0, s*0.08, s*0.22, c[2] || '#333');
    ctx.beginPath(); ctx.arc(0, s * 0.08, s * 0.22, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = c[1] || '#aaa'; ctx.beginPath(); ctx.arc(0, s * 0.08, s * 0.17, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = c[0]; ctx.beginPath(); ctx.arc(s * 0.18, -s * 0.28, s * 0.04, 0, Math.PI * 2); ctx.fill();
    itemHighlight(ctx, -s*0.12, -s*0.25, s*0.12, s*0.05);
  },
};

const bathtub: ItemDef = {
  id: 'bathtub', name: 'Bathtub', world: 'bathroom', sizeTier: 6, baseValue: 58, weight: 28,
  draw(ctx, s, c) {
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.45, -s*0.1, s*0.45, s*0.3, c[0]);
    ctx.beginPath();
    ctx.moveTo(-s * 0.45, -s * 0.1); ctx.quadraticCurveTo(-s * 0.45, s * 0.3, -s * 0.25, s * 0.3);
    ctx.lineTo(s * 0.25, s * 0.3); ctx.quadraticCurveTo(s * 0.45, s * 0.3, s * 0.45, -s * 0.1);
    ctx.lineTo(-s * 0.45, -s * 0.1); ctx.closePath();
    ctx.fill(); itemOutline(ctx, c[0], s*0.025);
    ctx.fillStyle = c[1] || '#bde';
    ctx.beginPath();
    ctx.moveTo(-s * 0.38, -s * 0.1); ctx.quadraticCurveTo(-s * 0.38, s * 0.22, -s * 0.2, s * 0.22);
    ctx.lineTo(s * 0.2, s * 0.22); ctx.quadraticCurveTo(s * 0.38, s * 0.22, s * 0.38, -s * 0.1); ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[2] || '#888';
    ctx.fillRect(-s * 0.42, s * 0.28, s * 0.08, s * 0.1); ctx.fillRect(s * 0.34, s * 0.28, s * 0.08, s * 0.1);
    itemHighlight(ctx, -s*0.15, -s*0.08, s*0.15, s*0.04);
  },
};

const soap: ItemDef = { id: 'soap', name: 'Soap', world: 'bathroom', sizeTier: 4, baseValue: 10, weight: 2.5,
  draw(ctx, s, c) {
    ctx.fillStyle = itemGradient(ctx, 0, 0, s*0.3, c[0]);
    ctx.beginPath(); ctx.ellipse(0, 0, s*0.3, s*0.2, 0, 0, Math.PI*2); ctx.fill();
    itemOutline(ctx, c[0], s*0.02);
    ctx.fillStyle = c[1]||'rgba(255,255,255,0.6)';
    ctx.beginPath(); ctx.arc(-s*0.15, -s*0.2, s*0.06, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.05, -s*0.25, s*0.04, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.18, -s*0.18, s*0.05, 0, Math.PI*2); ctx.fill();
    itemHighlight(ctx, -s*0.1, -s*0.06, s*0.1, s*0.05);
  } };

const rubberDuck: ItemDef = { id: 'rubber_duck', name: 'Rubber Duck', world: 'bathroom', sizeTier: 4, baseValue: 12, weight: 2,
  draw(ctx, s, c) {
    ctx.fillStyle = itemGradient(ctx, 0, 0, s*0.3, c[0]);
    ctx.beginPath(); ctx.arc(0, s*0.05, s*0.28, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(-s*0.15, -s*0.2, s*0.16, 0, Math.PI*2); ctx.fill();
    itemOutline(ctx, c[0], s*0.02);
    ctx.fillStyle = c[1]||'#e67e22';
    ctx.beginPath(); ctx.moveTo(-s*0.3, -s*0.22); ctx.lineTo(-s*0.42, -s*0.18); ctx.lineTo(-s*0.3, -s*0.15); ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[2]||'#333'; ctx.beginPath(); ctx.arc(-s*0.2, -s*0.25, s*0.03, 0, Math.PI*2); ctx.fill();
    itemHighlight(ctx, -s*0.05, -s*0.08, s*0.08, s*0.05);
  } };

const toothbrush: ItemDef = { id: 'toothbrush', name: 'Toothbrush', world: 'bathroom', sizeTier: 4, baseValue: 9, weight: 1.5,
  draw(ctx, s, c) {
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.05, -s*0.15, s*0.05, s*0.45, c[0]);
    roundRect(ctx, -s*0.05, -s*0.15, s*0.1, s*0.6, s*0.03); ctx.fill();
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.08, -s*0.4, s*0.08, -s*0.15, c[1]);
    roundRect(ctx, -s*0.08, -s*0.4, s*0.16, s*0.25, s*0.04); ctx.fill();
    itemOutline(ctx, c[1], s*0.02);
    ctx.fillStyle = c[2]||'#fff'; for (let i = 0; i < 3; i++) { ctx.fillRect(-s*0.05, -s*0.36+i*s*0.07, s*0.1, s*0.04); }
    itemHighlight(ctx, -s*0.03, -s*0.3, s*0.03, s*0.06);
  } };

const shampoo: ItemDef = { id: 'shampoo', name: 'Shampoo', world: 'bathroom', sizeTier: 4, baseValue: 11, weight: 3,
  draw(ctx, s, c) {
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.18, -s*0.15, s*0.18, s*0.4, c[0]);
    roundRect(ctx, -s*0.18, -s*0.15, s*0.36, s*0.55, s*0.05); ctx.fill();
    itemOutline(ctx, c[0], s*0.02);
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.1, -s*0.35, s*0.1, -s*0.13, c[1]||c[0]);
    roundRect(ctx, -s*0.1, -s*0.35, s*0.2, s*0.22, s*0.06); ctx.fill();
    ctx.fillStyle = c[2]||'#fff'; ctx.fillRect(-s*0.12, 0, s*0.24, s*0.1);
    itemHighlight(ctx, -s*0.06, -s*0.05, s*0.06, s*0.08);
  } };

const towelRoll: ItemDef = { id: 'towel_roll', name: 'Towel Roll', world: 'bathroom', sizeTier: 4, baseValue: 13, weight: 4,
  draw(ctx, s, c) {
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.3, -s*0.2, s*0.3, s*0.2, c[0]);
    roundRect(ctx, -s*0.3, -s*0.2, s*0.6, s*0.4, s*0.02); ctx.fill();
    itemOutline(ctx, c[0], s*0.02);
    ctx.fillStyle = c[1]||'#eee';
    ctx.beginPath(); ctx.ellipse(-s*0.3, 0, s*0.08, s*0.2, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(s*0.3, 0, s*0.08, s*0.2, 0, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = darken(c[2]||'#ccc'); ctx.lineWidth = s*0.01;
    ctx.beginPath(); ctx.moveTo(-s*0.3, -s*0.08); ctx.lineTo(s*0.3, -s*0.08); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s*0.3, s*0.08); ctx.lineTo(s*0.3, s*0.08); ctx.stroke();
    itemHighlight(ctx, -s*0.1, -s*0.1, s*0.12, s*0.05);
  } };

const mirrorItem: ItemDef = { id: 'mirror_item', name: 'Mirror', world: 'bathroom', sizeTier: 4, baseValue: 15, weight: 3.5,
  draw(ctx, s, c) {
    ctx.fillStyle = itemGradient(ctx, 0, 0, s*0.35, c[0]);
    ctx.beginPath(); ctx.ellipse(0, 0, s*0.3, s*0.4, 0, 0, Math.PI*2); ctx.fill();
    itemOutline(ctx, c[0], s*0.025);
    ctx.fillStyle = c[1]||'#d4f1f9'; ctx.beginPath(); ctx.ellipse(0, 0, s*0.24, s*0.34, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.beginPath(); ctx.ellipse(-s*0.08, -s*0.1, s*0.08, s*0.15, -0.3, 0, Math.PI*2); ctx.fill();
  } };

const hair_dryer: ItemDef = {
  id: 'hair_dryer', name: 'Hair Dryer', world: 'bathroom', sizeTier: 4, baseValue: 11, weight: 2.8,
  draw(ctx, s, c) {
    ctx.save(); ctx.rotate(-0.35);
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.08, -s*0.35, s*0.34, -s*0.13, c[0]);
    roundRect(ctx, -s * 0.08, -s * 0.35, s * 0.42, s * 0.22, s * 0.04); ctx.fill();
    itemOutline(ctx, c[0], s*0.02);
    ctx.fillStyle = itemGradient(ctx, s*0.43, -s*0.24, s*0.1, c[1]);
    ctx.beginPath(); ctx.moveTo(s * 0.34, -s * 0.28); ctx.lineTo(s * 0.52, -s * 0.35); ctx.lineTo(s * 0.52, -s * 0.12); ctx.lineTo(s * 0.34, -s * 0.19); ctx.closePath(); ctx.fill();
    ctx.fillStyle = itemLinearGradient(ctx, -s*0.06, s*0.02, s*0.08, s*0.3, c[0]);
    roundRect(ctx, -s * 0.06, s * 0.02, s * 0.14, s * 0.28, s * 0.03); ctx.fill();
    ctx.fillStyle = c[2]; ctx.beginPath(); ctx.arc(s * 0.12, -s * 0.24, s * 0.035, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    itemHighlight(ctx, -s*0.06, -s*0.2, s*0.06, s*0.05);
  },
};

const loofah: ItemDef = {
  id: 'loofah', name: 'Loofah', world: 'bathroom', sizeTier: 4, baseValue: 12, weight: 3,
  draw(ctx, s, c) {
    const r = s * 0.32;
    ctx.fillStyle = itemGradient(ctx, 0, s*0.06, r, c[0]);
    ctx.beginPath(); ctx.arc(0, s * 0.06, r, 0, Math.PI * 2); ctx.fill();
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      ctx.beginPath(); ctx.arc(Math.cos(a) * r * 0.92, s * 0.06 + Math.sin(a) * r * 0.92, r * 0.22, a - 0.5, a + 0.5); ctx.fill();
    }
    itemOutline(ctx, c[0], s*0.02);
    ctx.strokeStyle = darken(c[1]); ctx.lineWidth = s * 0.045; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(0, -s * 0.28, s * 0.08, Math.PI, 0); ctx.stroke();
    itemHighlight(ctx, -s*0.1, -s*0.02, s*0.1, s*0.06);
  },
};

// ─── Living Room ───

const book: ItemDef = {
  id: 'book', name: 'Book', world: 'living_room', sizeTier: 4, baseValue: 15, weight: 4,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0];
    ctx.fillRect(-s * 0.3, -s * 0.4, s * 0.6, s * 0.8);
    ctx.fillStyle = c[1];
    ctx.fillRect(-s * 0.3, -s * 0.4, s * 0.08, s * 0.8);
    ctx.fillStyle = c[2] || '#fff';
    ctx.fillRect(-s * 0.1, -s * 0.25, s * 0.3, s * 0.04);
    ctx.fillRect(-s * 0.1, -s * 0.15, s * 0.2, s * 0.03);
  },
};

const lamp: ItemDef = {
  id: 'lamp', name: 'Lamp', world: 'living_room', sizeTier: 4, baseValue: 17, weight: 5,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0];
    ctx.beginPath();
    ctx.moveTo(-s * 0.3, s * 0.05); ctx.lineTo(-s * 0.15, -s * 0.35);
    ctx.lineTo(s * 0.15, -s * 0.35); ctx.lineTo(s * 0.3, s * 0.05);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[1] || '#666';
    ctx.fillRect(-s * 0.03, s * 0.05, s * 0.06, s * 0.28);
    ctx.fillStyle = c[2] || '#888';
    roundRect(ctx, -s * 0.15, s * 0.33, s * 0.3, s * 0.06, s * 0.02);
    ctx.fill();
  },
};

const smartphone: ItemDef = {
  id: 'smartphone', name: 'Smartphone', world: 'living_room', sizeTier: 4, baseValue: 20, weight: 3,
  draw(ctx, s, c) {
    roundRect(ctx, -s * 0.18, -s * 0.38, s * 0.36, s * 0.76, s * 0.05);
    ctx.fillStyle = c[0]; ctx.fill();
    roundRect(ctx, -s * 0.14, -s * 0.3, s * 0.28, s * 0.54, s * 0.02);
    ctx.fillStyle = c[1]; ctx.fill();
    ctx.fillStyle = c[2] || '#555';
    ctx.beginPath(); ctx.arc(0, s * 0.3, s * 0.04, 0, Math.PI * 2); ctx.fill();
  },
};

const pottedPlant: ItemDef = {
  id: 'potted_plant', name: 'Potted Plant', world: 'living_room', sizeTier: 4, baseValue: 14, weight: 6,
  draw(ctx, s, c) {
    ctx.fillStyle = c[2] || '#8B4513';
    ctx.beginPath();
    ctx.moveTo(-s * 0.22, s * 0.05); ctx.lineTo(-s * 0.17, s * 0.4);
    ctx.lineTo(s * 0.17, s * 0.4); ctx.lineTo(s * 0.22, s * 0.05);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.arc(0, -s * 0.1, s * 0.28, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(-s * 0.15, -s * 0.25, s * 0.15, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.15, -s * 0.25, s * 0.15, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = c[1] || c[0];
    ctx.beginPath(); ctx.arc(0, -s * 0.32, s * 0.12, 0, Math.PI * 2); ctx.fill();
  },
};

const toaster: ItemDef = {
  id: 'toaster', name: 'Toaster', world: 'living_room', sizeTier: 4, baseValue: 16, weight: 5.5,
  draw(ctx, s, c) {
    roundRect(ctx, -s * 0.35, -s * 0.2, s * 0.7, s * 0.4, s * 0.08);
    ctx.fillStyle = c[0]; ctx.fill();
    ctx.fillStyle = c[1] || '#333';
    ctx.fillRect(-s * 0.18, -s * 0.18, s * 0.08, s * 0.22);
    ctx.fillRect(s * 0.06, -s * 0.18, s * 0.08, s * 0.22);
    ctx.fillStyle = c[2] || '#888';
    ctx.beginPath(); ctx.arc(s * 0.28, 0, s * 0.04, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = c[0];
    ctx.fillRect(-s * 0.3, s * 0.2, s * 0.12, s * 0.06);
    ctx.fillRect(s * 0.18, s * 0.2, s * 0.12, s * 0.06);
  },
};

const shoe: ItemDef = {
  id: 'shoe', name: 'Shoe', world: 'living_room', sizeTier: 4, baseValue: 12, weight: 3.5,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0];
    ctx.beginPath();
    ctx.moveTo(-s * 0.35, -s * 0.05);
    ctx.quadraticCurveTo(-s * 0.35, -s * 0.25, -s * 0.1, -s * 0.25);
    ctx.lineTo(s * 0.1, -s * 0.25);
    ctx.lineTo(s * 0.1, -s * 0.05);
    ctx.lineTo(s * 0.4, -s * 0.05);
    ctx.quadraticCurveTo(s * 0.45, s * 0.15, s * 0.35, s * 0.2);
    ctx.lineTo(-s * 0.35, s * 0.2);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[1];
    ctx.fillRect(-s * 0.35, s * 0.12, s * 0.8, s * 0.08);
  },
};

const basketball: ItemDef = {
  id: 'basketball', name: 'Basketball', world: 'living_room', sizeTier: 4, baseValue: 18, weight: 4.5,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.arc(0, 0, s * 0.4, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = c[1]; ctx.lineWidth = s * 0.03;
    ctx.beginPath(); ctx.moveTo(-s * 0.4, 0); ctx.lineTo(s * 0.4, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -s * 0.4); ctx.lineTo(0, s * 0.4); ctx.stroke();
    ctx.beginPath(); ctx.arc(-s * 0.12, 0, s * 0.38, -Math.PI * 0.35, Math.PI * 0.35); ctx.stroke();
    ctx.beginPath(); ctx.arc(s * 0.12, 0, s * 0.38, Math.PI * 0.65, Math.PI * 1.35); ctx.stroke();
  },
};

const clock: ItemDef = {
  id: 'clock', name: 'Clock', world: 'living_room', sizeTier: 4, baseValue: 19, weight: 4,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.arc(0, 0, s * 0.4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = c[1] || '#fff';
    ctx.beginPath(); ctx.arc(0, 0, s * 0.34, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = c[2] || '#333'; ctx.lineWidth = s * 0.03; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -s * 0.22); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(s * 0.15, 0); ctx.stroke();
    ctx.fillStyle = c[2] || '#333';
    ctx.beginPath(); ctx.arc(0, 0, s * 0.03, 0, Math.PI * 2); ctx.fill();
  },
};

const chair: ItemDef = {
  id: 'chair', name: 'Chair', world: 'living_room', sizeTier: 5, baseValue: 30, weight: 8,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0];
    ctx.fillRect(-s * 0.3, -s * 0.1, s * 0.6, s * 0.08);
    ctx.fillRect(-s * 0.3, -s * 0.45, s * 0.07, s * 0.35);
    ctx.fillRect(s * 0.23, -s * 0.45, s * 0.07, s * 0.35);
    ctx.fillRect(-s * 0.28, -s * 0.45, s * 0.56, s * 0.07);
    ctx.fillStyle = c[1] || c[0];
    ctx.fillRect(-s * 0.26, -s * 0.02, s * 0.06, s * 0.42);
    ctx.fillRect(s * 0.2, -s * 0.02, s * 0.06, s * 0.42);
    ctx.fillRect(-s * 0.26, -s * 0.02, s * 0.06, s * 0.42);
    ctx.fillRect(s * 0.2, -s * 0.02, s * 0.06, s * 0.42);
  },
};

const guitar: ItemDef = {
  id: 'guitar', name: 'Guitar', world: 'living_room', sizeTier: 5, baseValue: 40, weight: 5,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.arc(0, s * 0.15, s * 0.25, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, -s * 0.05, s * 0.18, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = c[1] || '#333';
    ctx.fillRect(-s * 0.03, -s * 0.5, s * 0.06, s * 0.5);
    ctx.fillStyle = c[2] || '#222';
    ctx.beginPath(); ctx.arc(0, s * 0.18, s * 0.06, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(-s * 0.08, -s * 0.5, s * 0.16, s * 0.05);
  },
};

const sofa: ItemDef = {
  id: 'sofa', name: 'Sofa', world: 'living_room', sizeTier: 6, baseValue: 68, weight: 20,
  draw(ctx, s, c) {
    roundRect(ctx, -s * 0.45, -s * 0.15, s * 0.9, s * 0.35, s * 0.06);
    ctx.fillStyle = c[0]; ctx.fill();
    roundRect(ctx, -s * 0.45, -s * 0.35, s * 0.9, s * 0.25, s * 0.06);
    ctx.fillStyle = c[1] || c[0]; ctx.fill();
    roundRect(ctx, -s * 0.45, -s * 0.25, s * 0.15, s * 0.4, s * 0.04);
    ctx.fillStyle = c[0]; ctx.fill();
    roundRect(ctx, s * 0.3, -s * 0.25, s * 0.15, s * 0.4, s * 0.04);
    ctx.fill();
    ctx.fillStyle = c[2] || c[0];
    ctx.fillRect(-s * 0.38, s * 0.2, s * 0.1, s * 0.12);
    ctx.fillRect(s * 0.28, s * 0.2, s * 0.1, s * 0.12);
  },
};

const piano: ItemDef = {
  id: 'piano', name: 'Piano', world: 'living_room', sizeTier: 6, baseValue: 75, weight: 30,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0];
    ctx.fillRect(-s * 0.4, -s * 0.35, s * 0.8, s * 0.55);
    ctx.fillStyle = c[1] || '#fff';
    ctx.fillRect(-s * 0.35, s * 0.0, s * 0.7, s * 0.15);
    ctx.fillStyle = c[2] || '#111';
    const kw = s * 0.06;
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(-s * 0.28 + i * s * 0.14, s * 0.0, kw, s * 0.09);
    }
    ctx.fillStyle = c[0];
    ctx.fillRect(-s * 0.36, s * 0.2, s * 0.06, s * 0.2);
    ctx.fillRect(s * 0.3, s * 0.2, s * 0.06, s * 0.2);
  },
};

// ─── Garage ───

const wrench: ItemDef = { id: 'wrench', name: 'Wrench', world: 'garage', sizeTier: 5, baseValue: 25, weight: 6,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.fillRect(-s*0.05, -s*0.15, s*0.1, s*0.55); ctx.beginPath(); ctx.arc(0, -s*0.18, s*0.15, -Math.PI*0.8, Math.PI*0.8); ctx.closePath(); ctx.fill(); ctx.fillStyle = c[1]||'#888'; ctx.beginPath(); ctx.arc(0, -s*0.18, s*0.08, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = c[2]||'#666'; roundRect(ctx, -s*0.08, s*0.3, s*0.16, s*0.08, s*0.02); ctx.fill(); } };

const tire: ItemDef = { id: 'tire', name: 'Tire', world: 'garage', sizeTier: 5, baseValue: 30, weight: 10,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.arc(0, 0, s*0.4, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = c[1]||'#555'; ctx.beginPath(); ctx.arc(0, 0, s*0.25, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = c[2]||'#888'; ctx.beginPath(); ctx.arc(0, 0, s*0.12, 0, Math.PI*2); ctx.fill(); ctx.strokeStyle = c[0]; ctx.lineWidth = s*0.03; for (let i = 0; i < 6; i++) { const a = (i/6)*Math.PI*2; ctx.beginPath(); ctx.moveTo(Math.cos(a)*s*0.26, Math.sin(a)*s*0.26); ctx.lineTo(Math.cos(a)*s*0.38, Math.sin(a)*s*0.38); ctx.stroke(); } } };

const paintCan: ItemDef = { id: 'paint_can', name: 'Paint Can', world: 'garage', sizeTier: 5, baseValue: 22, weight: 8,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.fillRect(-s*0.2, -s*0.2, s*0.4, s*0.45); ctx.fillStyle = c[1]||'#ddd'; ctx.beginPath(); ctx.ellipse(0, -s*0.2, s*0.2, s*0.07, 0, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.ellipse(0, s*0.25, s*0.2, s*0.07, 0, 0, Math.PI*2); ctx.fill(); ctx.strokeStyle = c[2]||'#888'; ctx.lineWidth = s*0.03; ctx.beginPath(); ctx.arc(0, -s*0.2, s*0.22, Math.PI, 0); ctx.stroke(); } };

const toolbox: ItemDef = { id: 'toolbox', name: 'Toolbox', world: 'garage', sizeTier: 5, baseValue: 28, weight: 9,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; roundRect(ctx, -s*0.35, -s*0.15, s*0.7, s*0.38, s*0.04); ctx.fill(); ctx.fillStyle = c[1]||'#888'; ctx.fillRect(-s*0.35, -s*0.15, s*0.7, s*0.08); ctx.strokeStyle = c[2]||'#555'; ctx.lineWidth = s*0.03; ctx.beginPath(); ctx.arc(0, -s*0.15, s*0.12, Math.PI, 0); ctx.stroke(); ctx.fillStyle = c[2]||'#ccc'; ctx.fillRect(-s*0.06, -s*0.12, s*0.12, s*0.06); } };

const oilCan: ItemDef = { id: 'oil_can', name: 'Oil Can', world: 'garage', sizeTier: 5, baseValue: 20, weight: 7,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.fillRect(-s*0.2, -s*0.15, s*0.4, s*0.4); ctx.fillStyle = c[1]||'#ddd'; ctx.beginPath(); ctx.ellipse(0, -s*0.15, s*0.2, s*0.06, 0, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = c[0]; ctx.beginPath(); ctx.moveTo(s*0.1, -s*0.15); ctx.lineTo(s*0.35, -s*0.35); ctx.lineTo(s*0.38, -s*0.3); ctx.lineTo(s*0.15, -s*0.12); ctx.closePath(); ctx.fill(); } };

const bolt: ItemDef = { id: 'bolt', name: 'Bolt', world: 'garage', sizeTier: 5, baseValue: 18, weight: 5,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = (i/6)*Math.PI*2; const px = Math.cos(a)*s*0.2, py = -s*0.2+Math.sin(a)*s*0.2; if (i===0) ctx.moveTo(px, py); else ctx.lineTo(px, py); } ctx.closePath(); ctx.fill(); ctx.fillStyle = c[1]||'#888'; ctx.fillRect(-s*0.06, 0, s*0.12, s*0.35); ctx.strokeStyle = c[2]||'#666'; ctx.lineWidth = s*0.02; for (let i = 0; i < 3; i++) { const yy = s*0.06+i*s*0.1; ctx.beginPath(); ctx.moveTo(-s*0.08, yy); ctx.lineTo(s*0.08, yy+s*0.03); ctx.stroke(); } } };

const screwdriver_item: ItemDef = {
  id: 'screwdriver_item', name: 'Screwdriver', world: 'garage', sizeTier: 5, baseValue: 22, weight: 6,
  draw(ctx, s, c) {
    roundRect(ctx, -s * 0.1, -s * 0.42, s * 0.2, s * 0.28, s * 0.06); ctx.fillStyle = c[0]; ctx.fill();
    ctx.strokeStyle = c[0]; ctx.lineWidth = s * 0.025;
    ctx.beginPath(); ctx.moveTo(-s * 0.08, -s * 0.32); ctx.lineTo(s * 0.08, -s * 0.32); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s * 0.08, -s * 0.22); ctx.lineTo(s * 0.08, -s * 0.22); ctx.stroke();
    ctx.fillStyle = c[1] || '#999'; ctx.fillRect(-s * 0.025, -s * 0.14, s * 0.05, s * 0.38);
    ctx.beginPath(); ctx.moveTo(-s * 0.06, s * 0.28); ctx.lineTo(0, s * 0.38); ctx.lineTo(s * 0.06, s * 0.28); ctx.closePath(); ctx.fill();
  },
};

const hammer_item: ItemDef = {
  id: 'hammer_item', name: 'Hammer', world: 'garage', sizeTier: 5, baseValue: 24, weight: 7,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0]; ctx.fillRect(-s * 0.35, -s * 0.42, s * 0.5, s * 0.14);
    ctx.beginPath(); ctx.moveTo(s * 0.15, -s * 0.42); ctx.lineTo(s * 0.28, -s * 0.38); ctx.lineTo(s * 0.22, -s * 0.28); ctx.lineTo(s * 0.12, -s * 0.32); ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[1] || '#8B4513'; ctx.fillRect(-s * 0.04, -s * 0.28, s * 0.08, s * 0.52);
  },
};

const flashlight_item: ItemDef = {
  id: 'flashlight_item', name: 'Flashlight', world: 'garage', sizeTier: 5, baseValue: 23, weight: 5.5,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0]; roundRect(ctx, -s * 0.12, -s * 0.05, s * 0.24, s * 0.45, s * 0.06); ctx.fill();
    ctx.fillStyle = c[1];
    ctx.beginPath(); ctx.moveTo(-s * 0.14, -s * 0.05); ctx.lineTo(0, -s * 0.38); ctx.lineTo(s * 0.14, -s * 0.05); ctx.closePath(); ctx.fill();
    const g = ctx.createRadialGradient(0, -s * 0.42, 0, 0, -s * 0.42, s * 0.2);
    g.addColorStop(0, 'rgba(255,248,200,0.85)'); g.addColorStop(1, 'rgba(255,248,200,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, -s * 0.42, s * 0.18, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = c[2] || '#444'; ctx.beginPath(); ctx.arc(s * 0.14, s * 0.08, s * 0.045, 0, Math.PI * 2); ctx.fill();
  },
};

const duct_tape: ItemDef = {
  id: 'duct_tape', name: 'Duct Tape', world: 'garage', sizeTier: 5, baseValue: 21, weight: 7,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0]; ctx.beginPath(); ctx.arc(0, s * 0.02, s * 0.38, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = c[1] || '#888'; ctx.beginPath(); ctx.arc(0, s * 0.02, s * 0.16, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.moveTo(s * 0.25, -s * 0.18); ctx.lineTo(s * 0.4, -s * 0.25); ctx.lineTo(s * 0.42, -s * 0.1); ctx.lineTo(s * 0.32, -s * 0.05); ctx.closePath(); ctx.fill();
  },
};

// ─── Garden ───

const flowerPot: ItemDef = { id: 'flower_pot', name: 'Flower Pot', world: 'garden', sizeTier: 5, baseValue: 24, weight: 7,
  draw(ctx, s, c) { ctx.fillStyle = c[2]||'#8B4513'; ctx.beginPath(); ctx.moveTo(-s*0.2, 0); ctx.lineTo(-s*0.15, s*0.35); ctx.lineTo(s*0.15, s*0.35); ctx.lineTo(s*0.2, 0); ctx.closePath(); ctx.fill(); ctx.fillStyle = c[1]||'#4ade80'; ctx.fillRect(-s*0.02, -s*0.2, s*0.04, s*0.25); ctx.fillStyle = c[0]; ctx.beginPath(); ctx.arc(0, -s*0.25, s*0.15, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = c[1]||'#fde68a'; ctx.beginPath(); ctx.arc(0, -s*0.25, s*0.06, 0, Math.PI*2); ctx.fill(); } };

const wateringCan: ItemDef = { id: 'watering_can', name: 'Watering Can', world: 'garden', sizeTier: 5, baseValue: 22, weight: 6,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; roundRect(ctx, -s*0.2, -s*0.05, s*0.4, s*0.3, s*0.04); ctx.fill(); ctx.beginPath(); ctx.moveTo(s*0.15, -s*0.05); ctx.lineTo(s*0.35, -s*0.3); ctx.lineTo(s*0.4, -s*0.25); ctx.lineTo(s*0.2, 0); ctx.closePath(); ctx.fill(); ctx.strokeStyle = c[1]||'#888'; ctx.lineWidth = s*0.04; ctx.beginPath(); ctx.arc(0, -s*0.15, s*0.15, Math.PI*0.8, Math.PI*0.2, true); ctx.stroke(); } };

const gardenGnome: ItemDef = { id: 'garden_gnome', name: 'Garden Gnome', world: 'garden', sizeTier: 5, baseValue: 30, weight: 8,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.moveTo(0, -s*0.45); ctx.lineTo(-s*0.15, -s*0.15); ctx.lineTo(s*0.15, -s*0.15); ctx.closePath(); ctx.fill(); ctx.fillStyle = c[1]||'#f5deb3'; ctx.beginPath(); ctx.arc(0, -s*0.1, s*0.12, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = c[0]; ctx.beginPath(); ctx.moveTo(-s*0.2, -s*0.02); ctx.lineTo(-s*0.22, s*0.35); ctx.lineTo(s*0.22, s*0.35); ctx.lineTo(s*0.2, -s*0.02); ctx.closePath(); ctx.fill(); ctx.fillStyle = c[2]||'#333'; ctx.beginPath(); ctx.arc(-s*0.05, -s*0.12, s*0.02, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(s*0.05, -s*0.12, s*0.02, 0, Math.PI*2); ctx.fill(); } };

const butterflyItem: ItemDef = { id: 'butterfly', name: 'Butterfly', world: 'garden', sizeTier: 5, baseValue: 18, weight: 2,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.ellipse(-s*0.18, -s*0.05, s*0.18, s*0.25, -0.3, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.ellipse(s*0.18, -s*0.05, s*0.18, s*0.25, 0.3, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = c[1]||'#333'; ctx.fillRect(-s*0.02, -s*0.2, s*0.04, s*0.4); ctx.strokeStyle = c[2]||'#333'; ctx.lineWidth = s*0.02; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, -s*0.2); ctx.lineTo(-s*0.08, -s*0.32); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, -s*0.2); ctx.lineTo(s*0.08, -s*0.32); ctx.stroke(); } };

const ladybug: ItemDef = { id: 'ladybug', name: 'Ladybug', world: 'garden', sizeTier: 5, baseValue: 20, weight: 3,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.arc(0, 0, s*0.3, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = c[1]||'#333'; ctx.beginPath(); ctx.arc(0, -s*0.28, s*0.12, 0, Math.PI*2); ctx.fill(); ctx.strokeStyle = c[1]||'#333'; ctx.lineWidth = s*0.03; ctx.beginPath(); ctx.moveTo(0, -s*0.3); ctx.lineTo(0, s*0.3); ctx.stroke(); ctx.fillStyle = c[1]||'#333'; ctx.beginPath(); ctx.arc(-s*0.12, -s*0.08, s*0.05, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(s*0.12, -s*0.08, s*0.05, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(-s*0.1, s*0.12, s*0.05, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(s*0.1, s*0.12, s*0.05, 0, Math.PI*2); ctx.fill(); } };

const pinecone: ItemDef = { id: 'pinecone', name: 'Pinecone', world: 'garden', sizeTier: 5, baseValue: 25, weight: 5,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.ellipse(0, 0, s*0.22, s*0.35, 0, 0, Math.PI*2); ctx.fill(); ctx.strokeStyle = c[1]||'#5b3a1a'; ctx.lineWidth = s*0.02; for (let i = -3; i <= 3; i++) { const y = i*s*0.09; ctx.beginPath(); ctx.moveTo(-s*0.18, y); ctx.quadraticCurveTo(0, y-s*0.06, s*0.18, y); ctx.stroke(); } } };

const snail: ItemDef = {
  id: 'snail', name: 'Snail', world: 'garden', sizeTier: 5, baseValue: 22, weight: 4,
  draw(ctx, s, c) {
    ctx.fillStyle = c[1] || '#a3a3a3';
    ctx.beginPath(); ctx.moveTo(-s * 0.35, s * 0.12); ctx.quadraticCurveTo(-s * 0.4, s * 0.28, -s * 0.15, s * 0.32); ctx.quadraticCurveTo(s * 0.25, s * 0.35, s * 0.38, s * 0.15); ctx.quadraticCurveTo(s * 0.35, -s * 0.05, s * 0.05, -s * 0.08); ctx.quadraticCurveTo(-s * 0.25, -s * 0.05, -s * 0.35, s * 0.12); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = c[1] || '#888'; ctx.lineWidth = s * 0.02; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-s * 0.08, -s * 0.12); ctx.lineTo(-s * 0.12, -s * 0.32); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s * 0.08, -s * 0.12); ctx.lineTo(s * 0.12, -s * 0.32); ctx.stroke();
    ctx.fillStyle = c[0]; ctx.beginPath(); ctx.arc(-s * 0.05, -s * 0.12, s * 0.22, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = c[2] || 'rgba(0,0,0,0.2)'; ctx.lineWidth = s * 0.02;
    for (let i = 0; i < 3; i++) { const r = s * (0.08 + i * 0.045); ctx.beginPath(); ctx.arc(-s * 0.05, -s * 0.12, r, -Math.PI * 0.1, Math.PI * 1.4); ctx.stroke(); }
  },
};

const leaf_item: ItemDef = {
  id: 'leaf_item', name: 'Leaf', world: 'garden', sizeTier: 5, baseValue: 20, weight: 3.5,
  draw(ctx, s, c) {
    ctx.save(); ctx.rotate(-0.35);
    ctx.fillStyle = c[0]; ctx.beginPath(); ctx.moveTo(0, -s * 0.38); ctx.quadraticCurveTo(s * 0.32, -s * 0.05, 0, s * 0.38); ctx.quadraticCurveTo(-s * 0.32, -s * 0.05, 0, -s * 0.38); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = c[1]; ctx.lineWidth = s * 0.025; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, -s * 0.35); ctx.lineTo(0, s * 0.35); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -s * 0.1); ctx.lineTo(s * 0.14, -s * 0.22); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, s * 0.02); ctx.lineTo(s * 0.18, s * 0.02); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, s * 0.12); ctx.lineTo(s * 0.12, s * 0.22); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -s * 0.05); ctx.lineTo(-s * 0.14, -s * 0.18); ctx.stroke();
    ctx.restore();
  },
};

const mushroom_item: ItemDef = {
  id: 'mushroom_item', name: 'Mushroom', world: 'garden', sizeTier: 5, baseValue: 24, weight: 5,
  draw(ctx, s, c) {
    ctx.fillStyle = c[2] || '#f5deb3'; roundRect(ctx, -s * 0.1, s * 0.05, s * 0.2, s * 0.32, s * 0.04); ctx.fill();
    ctx.fillStyle = c[0]; ctx.beginPath(); ctx.arc(0, -s * 0.02, s * 0.32, Math.PI, 0); ctx.lineTo(s * 0.32, s * 0.08); ctx.quadraticCurveTo(0, s * 0.12, -s * 0.32, s * 0.08); ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[1] || '#fff';
    ctx.beginPath(); ctx.arc(-s * 0.12, -s * 0.18, s * 0.05, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.14, -s * 0.12, s * 0.045, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.02, -s * 0.28, s * 0.04, 0, Math.PI * 2); ctx.fill();
  },
};

const birdhouse: ItemDef = {
  id: 'birdhouse', name: 'Birdhouse', world: 'garden', sizeTier: 5, baseValue: 26, weight: 6,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0]; ctx.fillRect(-s * 0.22, -s * 0.05, s * 0.44, s * 0.38);
    ctx.fillStyle = c[1]; ctx.beginPath(); ctx.moveTo(0, -s * 0.38); ctx.lineTo(-s * 0.28, -s * 0.05); ctx.lineTo(s * 0.28, -s * 0.05); ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[2] || '#333'; ctx.beginPath(); ctx.arc(0, s * 0.08, s * 0.08, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = c[0]; ctx.fillRect(-s * 0.04, s * 0.16, s * 0.08, s * 0.06);
  },
};

// ─── Playground ───

const jumpRope: ItemDef = { id: 'jump_rope', name: 'Jump Rope', world: 'playground', sizeTier: 5, baseValue: 22, weight: 3,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; roundRect(ctx, -s*0.4, -s*0.12, s*0.12, s*0.24, s*0.03); ctx.fill(); roundRect(ctx, s*0.28, -s*0.12, s*0.12, s*0.24, s*0.03); ctx.fill(); ctx.strokeStyle = c[1]||'#888'; ctx.lineWidth = s*0.04; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-s*0.34, s*0.12); ctx.quadraticCurveTo(0, s*0.45, s*0.34, s*0.12); ctx.stroke(); } };

const chalkStick: ItemDef = { id: 'chalk_stick', name: 'Chalk Stick', world: 'playground', sizeTier: 5, baseValue: 18, weight: 4,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; roundRect(ctx, -s*0.08, -s*0.35, s*0.16, s*0.7, s*0.04); ctx.fill(); ctx.fillStyle = c[1]||'#fff'; ctx.beginPath(); ctx.ellipse(0, -s*0.35, s*0.08, s*0.03, 0, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = c[2]||'rgba(255,255,255,0.3)'; ctx.fillRect(-s*0.06, s*0.1, s*0.12, s*0.15); } };

const sandboxBucket: ItemDef = { id: 'sandbox_bucket', name: 'Sandbox Bucket', world: 'playground', sizeTier: 5, baseValue: 24, weight: 5,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.moveTo(-s*0.2, -s*0.15); ctx.lineTo(-s*0.25, s*0.25); ctx.lineTo(s*0.25, s*0.25); ctx.lineTo(s*0.2, -s*0.15); ctx.closePath(); ctx.fill(); ctx.strokeStyle = c[1]||'#888'; ctx.lineWidth = s*0.04; ctx.beginPath(); ctx.arc(0, -s*0.15, s*0.18, Math.PI, 0); ctx.stroke(); } };

const frisbee: ItemDef = { id: 'frisbee', name: 'Frisbee', world: 'playground', sizeTier: 5, baseValue: 20, weight: 3,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.arc(0, 0, s*0.38, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = c[1]; ctx.beginPath(); ctx.arc(0, 0, s*0.25, 0, Math.PI*2); ctx.fill(); ctx.strokeStyle = c[2]||'#fff'; ctx.lineWidth = s*0.02; ctx.beginPath(); ctx.arc(0, 0, s*0.3, 0, Math.PI*2); ctx.stroke(); } };

const kite: ItemDef = { id: 'kite', name: 'Kite', world: 'playground', sizeTier: 5, baseValue: 26, weight: 2,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.moveTo(0, -s*0.35); ctx.lineTo(s*0.25, 0); ctx.lineTo(0, s*0.2); ctx.lineTo(-s*0.25, 0); ctx.closePath(); ctx.fill(); ctx.strokeStyle = c[1]; ctx.lineWidth = s*0.02; ctx.beginPath(); ctx.moveTo(0, -s*0.35); ctx.lineTo(0, s*0.2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-s*0.25, 0); ctx.lineTo(s*0.25, 0); ctx.stroke(); ctx.strokeStyle = c[2]||'#888'; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, s*0.2); ctx.quadraticCurveTo(s*0.1, s*0.3, -s*0.05, s*0.4); ctx.stroke(); } };

const swingSeat: ItemDef = { id: 'swing_seat', name: 'Swing Seat', world: 'playground', sizeTier: 5, baseValue: 28, weight: 6,
  draw(ctx, s, c) { ctx.strokeStyle = c[1]||'#888'; ctx.lineWidth = s*0.03; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-s*0.15, s*0.05); ctx.lineTo(-s*0.2, -s*0.4); ctx.stroke(); ctx.beginPath(); ctx.moveTo(s*0.15, s*0.05); ctx.lineTo(s*0.2, -s*0.4); ctx.stroke(); ctx.fillStyle = c[0]; roundRect(ctx, -s*0.22, s*0.05, s*0.44, s*0.08, s*0.02); ctx.fill(); } };

const whistle_item: ItemDef = {
  id: 'whistle_item', name: 'Whistle', world: 'playground', sizeTier: 5, baseValue: 22, weight: 4,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0]; roundRect(ctx, -s * 0.35, -s * 0.08, s * 0.55, s * 0.16, s * 0.05); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-s * 0.35, 0); ctx.lineTo(-s * 0.48, -s * 0.02); ctx.lineTo(-s * 0.48, s * 0.02); ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[1]; roundRect(ctx, s * 0.12, -s * 0.1, s * 0.22, s * 0.2, s * 0.04); ctx.fill();
  },
};

const skateboard: ItemDef = {
  id: 'skateboard', name: 'Skateboard', world: 'playground', sizeTier: 5, baseValue: 24, weight: 5,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0]; roundRect(ctx, -s * 0.42, -s * 0.06, s * 0.84, s * 0.12, s * 0.06); ctx.fill();
    ctx.fillStyle = c[1] || '#333';
    ctx.beginPath(); ctx.arc(-s * 0.28, s * 0.12, s * 0.07, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.28, s * 0.12, s * 0.07, 0, Math.PI * 2); ctx.fill();
  },
};

const water_gun: ItemDef = {
  id: 'water_gun', name: 'Water Gun', world: 'playground', sizeTier: 5, baseValue: 23, weight: 4.5,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0]; ctx.fillRect(-s * 0.28, -s * 0.06, s * 0.5, s * 0.14);
    ctx.fillRect(-s * 0.08, s * 0.08, s * 0.12, s * 0.2);
    ctx.beginPath(); ctx.moveTo(s * 0.22, -s * 0.06); ctx.lineTo(s * 0.38, -s * 0.04); ctx.lineTo(s * 0.38, s * 0.04); ctx.lineTo(s * 0.22, s * 0.06); ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[1]; ctx.beginPath(); ctx.ellipse(-s * 0.02, -s * 0.18, s * 0.14, s * 0.1, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = c[2]; ctx.fillRect(s * 0.32, -s * 0.02, s * 0.08, s * 0.04);
  },
};

const traffic_cone_small: ItemDef = {
  id: 'traffic_cone_small', name: 'Small Traffic Cone', world: 'playground', sizeTier: 5, baseValue: 21, weight: 3.5,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0]; ctx.beginPath(); ctx.moveTo(0, -s * 0.32); ctx.lineTo(-s * 0.18, s * 0.22); ctx.lineTo(s * 0.18, s * 0.22); ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[1] || '#fff'; ctx.fillRect(-s * 0.12, -s * 0.02, s * 0.24, s * 0.07);
    ctx.fillStyle = c[0]; roundRect(ctx, -s * 0.2, s * 0.22, s * 0.4, s * 0.06, s * 0.02); ctx.fill();
  },
};

// ─── School ───

const monitor: ItemDef = {
  id: 'monitor', name: 'Monitor', world: 'school', sizeTier: 5, baseValue: 38, weight: 7,
  draw(ctx, s, c) {
    roundRect(ctx, -s * 0.4, -s * 0.35, s * 0.8, s * 0.55, s * 0.03);
    ctx.fillStyle = c[0]; ctx.fill();
    roundRect(ctx, -s * 0.35, -s * 0.3, s * 0.7, s * 0.45, s * 0.02);
    ctx.fillStyle = c[1]; ctx.fill();
    ctx.fillStyle = c[2] || c[0];
    ctx.fillRect(-s * 0.05, s * 0.2, s * 0.1, s * 0.12);
    roundRect(ctx, -s * 0.15, s * 0.32, s * 0.3, s * 0.05, s * 0.02);
    ctx.fill();
  },
};

const printer: ItemDef = {
  id: 'printer', name: 'Printer', world: 'school', sizeTier: 5, baseValue: 35, weight: 10,
  draw(ctx, s, c) {
    roundRect(ctx, -s * 0.38, -s * 0.18, s * 0.76, s * 0.36, s * 0.04);
    ctx.fillStyle = c[0]; ctx.fill();
    ctx.fillStyle = c[1] || '#eee';
    ctx.fillRect(-s * 0.25, -s * 0.35, s * 0.5, s * 0.18);
    ctx.fillStyle = c[2] || '#ddd';
    ctx.fillRect(-s * 0.2, s * 0.1, s * 0.4, s * 0.12);
    ctx.fillStyle = c[1] || '#888';
    ctx.fillRect(s * 0.15, -s * 0.08, s * 0.08, s * 0.04);
    ctx.fillRect(s * 0.15, 0, s * 0.08, s * 0.04);
  },
};

const desk: ItemDef = {
  id: 'desk', name: 'Desk', world: 'school', sizeTier: 6, baseValue: 45, weight: 14,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0];
    ctx.fillRect(-s * 0.45, -s * 0.3, s * 0.9, s * 0.1);
    ctx.fillStyle = c[1] || c[0];
    ctx.fillRect(-s * 0.4, -s * 0.2, s * 0.06, s * 0.55);
    ctx.fillRect(s * 0.34, -s * 0.2, s * 0.06, s * 0.55);
    ctx.fillRect(-s * 0.4, -s * 0.2, s * 0.38, s * 0.06);
    ctx.fillStyle = c[2] || '#999';
    ctx.fillRect(-s * 0.36, -s * 0.1, s * 0.3, s * 0.04);
    ctx.fillRect(-s * 0.36, -s * 0.02, s * 0.3, s * 0.04);
  },
};

const bookshelf: ItemDef = {
  id: 'bookshelf', name: 'Bookshelf', world: 'school', sizeTier: 6, baseValue: 50, weight: 18,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0];
    ctx.fillRect(-s * 0.38, -s * 0.45, s * 0.76, s * 0.9);
    ctx.fillStyle = c[1] || '#fff';
    for (let r = 0; r < 3; r++) {
      const yy = -s * 0.38 + r * s * 0.3;
      ctx.fillRect(-s * 0.34, yy, s * 0.68, s * 0.26);
    }
    const bColors = [c[2] || '#e74c3c', c[0], c[2] || '#3498db'];
    for (let r = 0; r < 3; r++) {
      const yy = -s * 0.36 + r * s * 0.3;
      for (let b = 0; b < 5; b++) {
        ctx.fillStyle = bColors[(r + b) % bColors.length];
        ctx.fillRect(-s * 0.32 + b * s * 0.13, yy, s * 0.1, s * 0.22);
      }
    }
  },
};

const globe: ItemDef = { id: 'globe', name: 'Globe', world: 'school', sizeTier: 5, baseValue: 32, weight: 7,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.arc(0, -s*0.05, s*0.3, 0, Math.PI*2); ctx.fill(); ctx.strokeStyle = c[1]||'#2563eb'; ctx.lineWidth = s*0.02; ctx.beginPath(); ctx.moveTo(-s*0.3, -s*0.05); ctx.lineTo(s*0.3, -s*0.05); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, -s*0.35); ctx.lineTo(0, s*0.25); ctx.stroke(); ctx.beginPath(); ctx.ellipse(0, -s*0.05, s*0.15, s*0.3, 0, 0, Math.PI*2); ctx.stroke(); ctx.fillStyle = c[2]||'#888'; ctx.fillRect(-s*0.03, s*0.25, s*0.06, s*0.12); roundRect(ctx, -s*0.12, s*0.35, s*0.24, s*0.04, s*0.01); ctx.fill(); } };

const chalkboard: ItemDef = { id: 'chalkboard', name: 'Chalkboard', world: 'school', sizeTier: 5, baseValue: 35, weight: 10,
  draw(ctx, s, c) { ctx.fillStyle = c[1]||'#5b3a1a'; ctx.fillRect(-s*0.42, -s*0.32, s*0.84, s*0.64); ctx.fillStyle = c[0]; ctx.fillRect(-s*0.38, -s*0.28, s*0.76, s*0.52); ctx.fillStyle = c[2]||'#ddd'; ctx.fillRect(-s*0.35, s*0.24, s*0.7, s*0.04); ctx.fillStyle = '#fff'; ctx.fillRect(-s*0.28, s*0.25, s*0.06, s*0.02); } };

const backpackBig: ItemDef = { id: 'backpack_big', name: 'Backpack', world: 'school', sizeTier: 5, baseValue: 28, weight: 6,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; roundRect(ctx, -s*0.25, -s*0.3, s*0.5, s*0.65, s*0.08); ctx.fill(); ctx.fillStyle = c[1]; roundRect(ctx, -s*0.2, s*0.05, s*0.4, s*0.2, s*0.04); ctx.fill(); ctx.strokeStyle = c[2]||'#555'; ctx.lineWidth = s*0.04; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-s*0.18, -s*0.3); ctx.lineTo(-s*0.18, -s*0.42); ctx.stroke(); ctx.beginPath(); ctx.moveTo(s*0.18, -s*0.3); ctx.lineTo(s*0.18, -s*0.42); ctx.stroke(); } };

const lunchTray: ItemDef = { id: 'lunch_tray', name: 'Lunch Tray', world: 'school', sizeTier: 5, baseValue: 24, weight: 5,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; roundRect(ctx, -s*0.4, -s*0.25, s*0.8, s*0.5, s*0.04); ctx.fill(); ctx.strokeStyle = c[1]||'#999'; ctx.lineWidth = s*0.02; ctx.beginPath(); ctx.moveTo(s*0.05, -s*0.25); ctx.lineTo(s*0.05, s*0.25); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-s*0.4, 0); ctx.lineTo(s*0.05, 0); ctx.stroke(); } };

const schoolBell: ItemDef = { id: 'school_bell', name: 'School Bell', world: 'school', sizeTier: 5, baseValue: 30, weight: 8,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.moveTo(-s*0.08, -s*0.2); ctx.lineTo(-s*0.28, s*0.2); ctx.lineTo(s*0.28, s*0.2); ctx.lineTo(s*0.08, -s*0.2); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.arc(0, -s*0.2, s*0.08, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = c[1]||'#333'; ctx.beginPath(); ctx.arc(0, s*0.2, s*0.05, 0, Math.PI*2); ctx.fill(); ctx.strokeStyle = c[2]||'#888'; ctx.lineWidth = s*0.03; ctx.beginPath(); ctx.arc(0, -s*0.3, s*0.06, Math.PI, 0); ctx.stroke(); } };

const pencilCup: ItemDef = { id: 'pencil_cup', name: 'Pencil Cup', world: 'school', sizeTier: 5, baseValue: 22, weight: 4,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.fillRect(-s*0.18, -s*0.1, s*0.36, s*0.4); ctx.fillStyle = c[1]||'#ddd'; ctx.beginPath(); ctx.ellipse(0, -s*0.1, s*0.18, s*0.05, 0, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = c[2]||'#f59e0b'; ctx.fillRect(-s*0.1, -s*0.35, s*0.04, s*0.28); ctx.fillStyle = c[1]||'#3b82f6'; ctx.fillRect(-s*0.02, -s*0.38, s*0.04, s*0.3); ctx.fillStyle = c[0]; ctx.fillRect(s*0.06, -s*0.32, s*0.04, s*0.24); } };

// ─── Neighborhood ───

const bicycle: ItemDef = {
  id: 'bicycle', name: 'Bicycle', world: 'neighborhood', sizeTier: 6, baseValue: 52, weight: 12,
  draw(ctx, s, c) {
    ctx.strokeStyle = c[0]; ctx.lineWidth = s * 0.04; ctx.lineCap = 'round';
    const wr = s * 0.2;
    ctx.beginPath(); ctx.arc(-s * 0.25, s * 0.1, wr, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(s * 0.25, s * 0.1, wr, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = c[1] || c[0]; ctx.lineWidth = s * 0.03;
    ctx.beginPath(); ctx.moveTo(-s * 0.25, s * 0.1); ctx.lineTo(0, -s * 0.15); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -s * 0.15); ctx.lineTo(s * 0.25, s * 0.1); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -s * 0.15); ctx.lineTo(-s * 0.1, -s * 0.15); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -s * 0.15); ctx.lineTo(s * 0.1, -s * 0.3); ctx.stroke();
    ctx.strokeStyle = c[2] || '#333'; ctx.lineWidth = s * 0.025;
    ctx.beginPath(); ctx.moveTo(s * 0.06, -s * 0.3); ctx.lineTo(s * 0.16, -s * 0.3); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s * 0.15, -s * 0.15); ctx.lineTo(-s * 0.12, -s * 0.25); ctx.stroke();
  },
};

const mailbox: ItemDef = {
  id: 'mailbox', name: 'Mailbox', world: 'neighborhood', sizeTier: 7, baseValue: 88, weight: 12,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0];
    roundRect(ctx, -s * 0.2, -s * 0.25, s * 0.4, s * 0.35, s * 0.04);
    ctx.fill();
    ctx.beginPath(); ctx.arc(0, -s * 0.25, s * 0.2, Math.PI, 0); ctx.fill();
    ctx.fillStyle = c[1] || '#333';
    ctx.fillRect(-s * 0.04, s * 0.1, s * 0.08, s * 0.35);
    ctx.fillStyle = c[2] || '#eee';
    ctx.fillRect(-s * 0.12, -s * 0.12, s * 0.24, s * 0.05);
  },
};

const bench: ItemDef = {
  id: 'bench', name: 'Bench', world: 'neighborhood', sizeTier: 7, baseValue: 85, weight: 16,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0];
    ctx.fillRect(-s * 0.45, -s * 0.08, s * 0.9, s * 0.08);
    ctx.fillStyle = c[1] || c[0];
    ctx.fillRect(-s * 0.45, -s * 0.28, s * 0.9, s * 0.06);
    ctx.fillStyle = c[2] || '#555';
    ctx.fillRect(-s * 0.38, 0, s * 0.06, s * 0.3);
    ctx.fillRect(s * 0.32, 0, s * 0.06, s * 0.3);
    ctx.fillRect(-s * 0.38, -s * 0.28, s * 0.06, s * 0.04);
    ctx.fillRect(s * 0.32, -s * 0.28, s * 0.06, s * 0.04);
  },
};

const hydrant: ItemDef = {
  id: 'hydrant', name: 'Fire Hydrant', world: 'neighborhood', sizeTier: 7, baseValue: 92, weight: 18,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0];
    roundRect(ctx, -s * 0.12, -s * 0.18, s * 0.24, s * 0.45, s * 0.06);
    ctx.fill();
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.arc(0, -s * 0.22, s * 0.1, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = c[1] || c[0];
    ctx.fillRect(-s * 0.22, -s * 0.02, s * 0.44, s * 0.08);
    ctx.fillStyle = c[2] || '#666';
    roundRect(ctx, -s * 0.16, s * 0.25, s * 0.32, s * 0.06, s * 0.02);
    ctx.fill();
  },
};

const fencePost: ItemDef = { id: 'fence_post', name: 'Fence Post', world: 'neighborhood', sizeTier: 6, baseValue: 45, weight: 12,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.fillRect(-s*0.1, -s*0.2, s*0.2, s*0.55); ctx.beginPath(); ctx.moveTo(-s*0.1, -s*0.2); ctx.lineTo(0, -s*0.38); ctx.lineTo(s*0.1, -s*0.2); ctx.closePath(); ctx.fill(); ctx.strokeStyle = c[1]||'#666'; ctx.lineWidth = s*0.02; ctx.beginPath(); ctx.moveTo(-s*0.1, 0); ctx.lineTo(s*0.1, 0); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-s*0.1, s*0.15); ctx.lineTo(s*0.1, s*0.15); ctx.stroke(); } };

const gardenHose: ItemDef = { id: 'garden_hose', name: 'Garden Hose', world: 'neighborhood', sizeTier: 6, baseValue: 40, weight: 8,
  draw(ctx, s, c) { ctx.strokeStyle = c[0]; ctx.lineWidth = s*0.06; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, 0, s*0.3, 0, Math.PI*1.7); ctx.stroke(); ctx.strokeStyle = c[1]||c[0]; ctx.lineWidth = s*0.06; ctx.beginPath(); ctx.arc(0, 0, s*0.18, 0.5, Math.PI*1.8); ctx.stroke(); ctx.fillStyle = c[2]||'#888'; ctx.fillRect(s*0.25, -s*0.1, s*0.15, s*0.06); } };

const birdBath: ItemDef = { id: 'bird_bath', name: 'Bird Bath', world: 'neighborhood', sizeTier: 6, baseValue: 50, weight: 14,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.moveTo(-s*0.35, -s*0.1); ctx.quadraticCurveTo(-s*0.3, 0, -s*0.1, 0); ctx.lineTo(s*0.1, 0); ctx.quadraticCurveTo(s*0.3, 0, s*0.35, -s*0.1); ctx.lineTo(-s*0.35, -s*0.1); ctx.closePath(); ctx.fill(); ctx.fillStyle = c[1]||'#b0d4f1'; ctx.beginPath(); ctx.ellipse(0, -s*0.1, s*0.3, s*0.06, 0, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = c[0]; ctx.fillRect(-s*0.06, 0, s*0.12, s*0.25); roundRect(ctx, -s*0.15, s*0.25, s*0.3, s*0.06, s*0.02); ctx.fill(); } };

const sprinkler: ItemDef = {
  id: 'sprinkler', name: 'Sprinkler', world: 'neighborhood', sizeTier: 6, baseValue: 45, weight: 10,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0]; roundRect(ctx, -s * 0.22, s * 0.12, s * 0.44, s * 0.14, s * 0.03); ctx.fill();
    ctx.fillRect(-s * 0.04, -s * 0.32, s * 0.08, s * 0.46);
    ctx.beginPath(); ctx.arc(0, -s * 0.32, s * 0.06, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = c[1] || '#60a5fa'; ctx.lineWidth = s * 0.035; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, -s * 0.38); ctx.quadraticCurveTo(s * 0.28, -s * 0.52, s * 0.42, -s * 0.28); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -s * 0.38); ctx.quadraticCurveTo(-s * 0.28, -s * 0.52, -s * 0.42, -s * 0.28); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -s * 0.38); ctx.lineTo(0, -s * 0.48); ctx.stroke();
  },
};

const dog_house: ItemDef = {
  id: 'dog_house', name: 'Dog House', world: 'neighborhood', sizeTier: 6, baseValue: 48, weight: 12,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0]; roundRect(ctx, -s * 0.32, -s * 0.02, s * 0.64, s * 0.38, s * 0.03); ctx.fill();
    ctx.fillStyle = c[1]; ctx.beginPath(); ctx.moveTo(-s * 0.38, -s * 0.02); ctx.lineTo(0, -s * 0.38); ctx.lineTo(s * 0.38, -s * 0.02); ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[2] || '#333'; ctx.beginPath(); ctx.ellipse(0, s * 0.12, s * 0.12, s * 0.16, 0, 0, Math.PI * 2); ctx.fill();
  },
};

const lawn_mower: ItemDef = {
  id: 'lawn_mower', name: 'Lawn Mower', world: 'neighborhood', sizeTier: 6, baseValue: 50, weight: 14,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0]; roundRect(ctx, -s * 0.32, -s * 0.08, s * 0.52, s * 0.28, s * 0.04); ctx.fill();
    ctx.fillStyle = c[1] || '#333';
    ctx.beginPath(); ctx.arc(-s * 0.18, s * 0.2, s * 0.1, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.08, s * 0.2, s * 0.1, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#bbb';
    ctx.beginPath(); ctx.arc(-s * 0.18, s * 0.2, s * 0.04, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.08, s * 0.2, s * 0.04, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = c[2]; ctx.lineWidth = s * 0.045; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(s * 0.2, -s * 0.04); ctx.lineTo(s * 0.42, -s * 0.38); ctx.stroke();
  },
};

// ─── Shopping Mall ───

const shoppingBag: ItemDef = { id: 'shopping_bag', name: 'Shopping Bag', world: 'shopping_mall', sizeTier: 6, baseValue: 48, weight: 8,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.fillRect(-s*0.25, -s*0.15, s*0.5, s*0.5); ctx.strokeStyle = c[1]||'#888'; ctx.lineWidth = s*0.03; ctx.beginPath(); ctx.arc(-s*0.08, -s*0.15, s*0.08, Math.PI, 0); ctx.stroke(); ctx.beginPath(); ctx.arc(s*0.08, -s*0.15, s*0.08, Math.PI, 0); ctx.stroke(); ctx.fillStyle = c[2]||'#fff'; ctx.fillRect(-s*0.1, s*0.05, s*0.2, s*0.08); } };

const mannequin: ItemDef = { id: 'mannequin', name: 'Mannequin', world: 'shopping_mall', sizeTier: 6, baseValue: 55, weight: 12,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.arc(0, -s*0.3, s*0.1, 0, Math.PI*2); ctx.fill(); ctx.fillRect(-s*0.03, -s*0.2, s*0.06, s*0.08); ctx.beginPath(); ctx.moveTo(-s*0.18, -s*0.12); ctx.lineTo(s*0.18, -s*0.12); ctx.lineTo(s*0.12, s*0.25); ctx.lineTo(-s*0.12, s*0.25); ctx.closePath(); ctx.fill(); ctx.fillStyle = c[1]||'#888'; ctx.fillRect(-s*0.03, s*0.25, s*0.06, s*0.12); roundRect(ctx, -s*0.1, s*0.37, s*0.2, s*0.04, s*0.01); ctx.fill(); } };

const shoppingCart: ItemDef = { id: 'shopping_cart', name: 'Shopping Cart', world: 'shopping_mall', sizeTier: 6, baseValue: 52, weight: 15,
  draw(ctx, s, c) { ctx.strokeStyle = c[0]; ctx.lineWidth = s*0.04; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-s*0.35, -s*0.3); ctx.lineTo(-s*0.2, -s*0.3); ctx.lineTo(-s*0.1, s*0.1); ctx.lineTo(s*0.3, s*0.1); ctx.lineTo(s*0.35, -s*0.2); ctx.lineTo(-s*0.15, -s*0.2); ctx.stroke(); ctx.fillStyle = c[1]||'#333'; ctx.beginPath(); ctx.arc(-s*0.05, s*0.2, s*0.06, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(s*0.22, s*0.2, s*0.06, 0, Math.PI*2); ctx.fill(); } };

const escalatorStep: ItemDef = { id: 'escalator_step', name: 'Escalator Step', world: 'shopping_mall', sizeTier: 6, baseValue: 60, weight: 20,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.moveTo(-s*0.35, s*0.2); ctx.lineTo(-s*0.35, 0); ctx.lineTo(-s*0.1, 0); ctx.lineTo(-s*0.1, -s*0.2); ctx.lineTo(s*0.15, -s*0.2); ctx.lineTo(s*0.15, -s*0.35); ctx.lineTo(s*0.35, -s*0.35); ctx.lineTo(s*0.35, s*0.2); ctx.closePath(); ctx.fill(); ctx.strokeStyle = c[1]||'#888'; ctx.lineWidth = s*0.02; ctx.beginPath(); ctx.moveTo(-s*0.3, 0); ctx.lineTo(-s*0.1, 0); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-s*0.05, -s*0.2); ctx.lineTo(s*0.15, -s*0.2); ctx.stroke(); } };

const fountainMall: ItemDef = { id: 'fountain_mall', name: 'Fountain', world: 'shopping_mall', sizeTier: 6, baseValue: 65, weight: 22,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.ellipse(0, s*0.15, s*0.4, s*0.12, 0, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.ellipse(0, 0, s*0.25, s*0.08, 0, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = c[1]||'#93c5fd'; ctx.beginPath(); ctx.ellipse(0, s*0.15, s*0.35, s*0.08, 0, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = c[2]||'#888'; ctx.fillRect(-s*0.03, -s*0.05, s*0.06, s*0.2); ctx.strokeStyle = c[1]||'#93c5fd'; ctx.lineWidth = s*0.03; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, -s*0.05); ctx.lineTo(0, -s*0.25); ctx.stroke(); } };

const storeSign: ItemDef = { id: 'store_sign', name: 'Store Sign', world: 'shopping_mall', sizeTier: 6, baseValue: 50, weight: 10,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; roundRect(ctx, -s*0.35, -s*0.18, s*0.7, s*0.36, s*0.04); ctx.fill(); ctx.strokeStyle = c[1]; ctx.lineWidth = s*0.04; roundRect(ctx, -s*0.35, -s*0.18, s*0.7, s*0.36, s*0.04); ctx.stroke(); ctx.fillStyle = c[2]||'#fff'; ctx.font = `bold ${s*0.18}px 'Fredoka', sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('SALE', 0, 0); } };

const gift_box: ItemDef = {
  id: 'gift_box', name: 'Gift Box', world: 'shopping_mall', sizeTier: 6, baseValue: 55, weight: 10,
  draw(ctx, s, c) {
    const h = s * 0.32; roundRect(ctx, -h, -h, h * 2, h * 2, s * 0.04); ctx.fillStyle = c[0]; ctx.fill();
    ctx.fillStyle = c[1]; ctx.fillRect(-s * 0.06, -h, s * 0.12, h * 2); ctx.fillRect(-h, -s * 0.06, h * 2, s * 0.12);
    ctx.fillStyle = c[2];
    ctx.beginPath(); ctx.ellipse(-s * 0.1, -h - s * 0.06, s * 0.08, s * 0.1, -0.4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(s * 0.1, -h - s * 0.06, s * 0.08, s * 0.1, 0.4, 0, Math.PI * 2); ctx.fill();
  },
};

const hanger_item: ItemDef = {
  id: 'hanger_item', name: 'Clothes Hanger', world: 'shopping_mall', sizeTier: 6, baseValue: 48, weight: 6,
  draw(ctx, s, c) {
    ctx.strokeStyle = c[0]; ctx.lineWidth = s * 0.055; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.arc(0, -s * 0.32, s * 0.07, Math.PI, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -s * 0.25); ctx.lineTo(-s * 0.38, s * 0.22); ctx.lineTo(s * 0.38, s * 0.22); ctx.closePath(); ctx.stroke();
  },
};

const perfume_bottle: ItemDef = {
  id: 'perfume_bottle', name: 'Perfume Bottle', world: 'shopping_mall', sizeTier: 6, baseValue: 60, weight: 12,
  draw(ctx, s, c) {
    roundRect(ctx, -s * 0.22, s * 0.02, s * 0.44, s * 0.36, s * 0.12); ctx.fillStyle = c[0]; ctx.fill();
    ctx.fillStyle = c[1]; ctx.fillRect(-s * 0.08, -s * 0.18, s * 0.16, s * 0.22);
    ctx.fillStyle = c[2]; ctx.beginPath(); ctx.ellipse(0, -s * 0.32, s * 0.1, s * 0.07, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.beginPath(); ctx.ellipse(-s * 0.08, s * 0.12, s * 0.06, s * 0.1, -0.3, 0, Math.PI * 2); ctx.fill();
  },
};

const price_tag: ItemDef = {
  id: 'price_tag', name: 'Price Tag', world: 'shopping_mall', sizeTier: 6, baseValue: 50, weight: 8,
  draw(ctx, s, c) {
    const w = s * 0.38, hh = s * 0.22;
    ctx.beginPath(); ctx.moveTo(-w * 0.5 + s * 0.12, -hh); ctx.lineTo(w * 0.5, -hh); ctx.lineTo(w * 0.5, hh); ctx.lineTo(-w * 0.5 + s * 0.12, hh); ctx.lineTo(-w * 0.5, 0); ctx.closePath();
    ctx.fillStyle = c[0]; ctx.fill(); ctx.strokeStyle = c[1]; ctx.lineWidth = s * 0.025; ctx.stroke();
    ctx.strokeStyle = c[1]; ctx.lineWidth = s * 0.02; ctx.beginPath(); ctx.arc(-w * 0.5 + s * 0.08, 0, s * 0.045, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = c[2] || '#333'; ctx.font = `bold ${s * 0.22}px 'Fredoka', sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('$', s * 0.06, 0);
  },
};

// ─── City Park ───

const tree: ItemDef = {
  id: 'tree', name: 'Tree', world: 'city_park', sizeTier: 7, baseValue: 110, weight: 40,
  draw(ctx, s, c) {
    ctx.fillStyle = c[2] || '#6b3e1f';
    ctx.fillRect(-s * 0.06, s * 0.05, s * 0.12, s * 0.4);
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.arc(0, -s * 0.15, s * 0.32, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(-s * 0.18, 0, s * 0.22, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.18, 0, s * 0.22, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = c[1] || c[0];
    ctx.beginPath(); ctx.arc(s * 0.08, -s * 0.28, s * 0.18, 0, Math.PI * 2); ctx.fill();
  },
};

const streetLamp: ItemDef = {
  id: 'street_lamp', name: 'Street Lamp', world: 'city_park', sizeTier: 7, baseValue: 96, weight: 15,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0];
    ctx.fillRect(-s * 0.03, -s * 0.15, s * 0.06, s * 0.6);
    roundRect(ctx, -s * 0.1, s * 0.42, s * 0.2, s * 0.05, s * 0.02);
    ctx.fill();
    ctx.fillStyle = c[1] || '#fde68a';
    ctx.beginPath();
    ctx.moveTo(-s * 0.18, -s * 0.15); ctx.lineTo(s * 0.18, -s * 0.15);
    ctx.lineTo(s * 0.12, -s * 0.38); ctx.lineTo(-s * 0.12, -s * 0.38);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[2] || '#888';
    ctx.fillRect(-s * 0.14, -s * 0.4, s * 0.28, s * 0.04);
  },
};

const pond: ItemDef = { id: 'pond', name: 'Pond', world: 'city_park', sizeTier: 7, baseValue: 85, weight: 25,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.ellipse(0, 0, s*0.4, s*0.28, 0, 0, Math.PI*2); ctx.fill(); ctx.strokeStyle = c[1]||'#fff'; ctx.lineWidth = s*0.02; ctx.beginPath(); ctx.moveTo(-s*0.15, -s*0.05); ctx.quadraticCurveTo(-s*0.08, -s*0.12, 0, -s*0.05); ctx.quadraticCurveTo(s*0.08, s*0.02, s*0.15, -s*0.05); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-s*0.1, s*0.1); ctx.quadraticCurveTo(-s*0.03, s*0.03, s*0.05, s*0.1); ctx.stroke(); } };

const swingSet: ItemDef = { id: 'swing_set', name: 'Swing Set', world: 'city_park', sizeTier: 7, baseValue: 90, weight: 18,
  draw(ctx, s, c) { ctx.strokeStyle = c[0]; ctx.lineWidth = s*0.04; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-s*0.35, s*0.35); ctx.lineTo(-s*0.15, -s*0.35); ctx.stroke(); ctx.beginPath(); ctx.moveTo(s*0.35, s*0.35); ctx.lineTo(s*0.15, -s*0.35); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-s*0.15, -s*0.35); ctx.lineTo(s*0.15, -s*0.35); ctx.stroke(); ctx.strokeStyle = c[1]||'#888'; ctx.lineWidth = s*0.02; ctx.beginPath(); ctx.moveTo(-s*0.05, -s*0.35); ctx.lineTo(-s*0.08, s*0.1); ctx.stroke(); ctx.beginPath(); ctx.moveTo(s*0.05, -s*0.35); ctx.lineTo(s*0.02, s*0.1); ctx.stroke(); ctx.fillStyle = c[2]||'#8B4513'; ctx.fillRect(-s*0.12, s*0.1, s*0.18, s*0.05); } };

const statue: ItemDef = { id: 'statue', name: 'Statue', world: 'city_park', sizeTier: 7, baseValue: 95, weight: 20,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.fillRect(-s*0.2, s*0.1, s*0.4, s*0.25); ctx.fillStyle = c[1]||'#ccc'; ctx.beginPath(); ctx.arc(0, -s*0.1, s*0.1, 0, Math.PI*2); ctx.fill(); ctx.fillRect(-s*0.12, 0, s*0.24, s*0.12); ctx.fillStyle = c[2]||'#aaa'; ctx.fillRect(-s*0.24, s*0.28, s*0.48, s*0.08); } };

const picnic_basket: ItemDef = {
  id: 'picnic_basket', name: 'Picnic Basket', world: 'city_park', sizeTier: 7, baseValue: 88, weight: 15,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0]; roundRect(ctx, -s * 0.3, -s * 0.05, s * 0.6, s * 0.42, s * 0.04); ctx.fill();
    ctx.strokeStyle = c[1] || '#8B4513'; ctx.lineWidth = s * 0.018;
    for (let i = 0; i < 6; i++) { const y = -s * 0.02 + i * s * 0.065; ctx.beginPath(); ctx.moveTo(-s * 0.26, y); ctx.lineTo(s * 0.26, y); ctx.stroke(); }
    ctx.strokeStyle = c[2]; ctx.lineWidth = s * 0.04;
    ctx.beginPath(); ctx.moveTo(-s * 0.22, -s * 0.05); ctx.quadraticCurveTo(0, -s * 0.45, s * 0.22, -s * 0.05); ctx.stroke();
  },
};

const soccer_ball: ItemDef = {
  id: 'soccer_ball', name: 'Soccer Ball', world: 'city_park', sizeTier: 7, baseValue: 85, weight: 12,
  draw(ctx, s, c) {
    const R = s * 0.4;
    ctx.fillStyle = c[0]; ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = c[1] || '#333';
    const pent = (px: number, py: number, pr: number, rot: number) => { ctx.beginPath(); for (let i = 0; i < 5; i++) { const a = rot + (i / 5) * Math.PI * 2 - Math.PI / 2; if (i === 0) ctx.moveTo(px + Math.cos(a) * pr, py + Math.sin(a) * pr); else ctx.lineTo(px + Math.cos(a) * pr, py + Math.sin(a) * pr); } ctx.closePath(); };
    ctx.save(); ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.clip();
    pent(0, 0, s * 0.14, 0); ctx.fill();
    for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2 - Math.PI / 2; pent(Math.cos(a) * R * 0.72, Math.sin(a) * R * 0.72, s * 0.11, a + Math.PI / 5); ctx.fill(); }
    ctx.restore();
    ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = s * 0.02; ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.stroke();
  },
};

const park_fountain: ItemDef = {
  id: 'park_fountain', name: 'Park Fountain', world: 'city_park', sizeTier: 7, baseValue: 95, weight: 22,
  draw(ctx, s, c) {
    ctx.fillStyle = c[2]; roundRect(ctx, -s * 0.18, s * 0.28, s * 0.36, s * 0.08, s * 0.02); ctx.fill();
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.ellipse(0, s * 0.22, s * 0.38, s * 0.1, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, s * 0.05, s * 0.28, s * 0.08, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(-s * 0.05, -s * 0.15, s * 0.1, s * 0.28);
    ctx.beginPath(); ctx.ellipse(0, -s * 0.15, s * 0.12, s * 0.05, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = c[1] || '#60a5fa'; ctx.lineWidth = s * 0.04; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, -s * 0.2); ctx.quadraticCurveTo(s * 0.25, -s * 0.42, s * 0.45, -s * 0.18); ctx.stroke();
  },
};

const bird_feeder: ItemDef = {
  id: 'bird_feeder', name: 'Bird Feeder', world: 'city_park', sizeTier: 7, baseValue: 82, weight: 10,
  draw(ctx, s, c) {
    ctx.strokeStyle = '#888'; ctx.lineWidth = s * 0.025; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, -s * 0.48); ctx.lineTo(0, -s * 0.38); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, -s * 0.52, s * 0.05, Math.PI, 0); ctx.stroke();
    ctx.fillStyle = c[1]; ctx.beginPath(); ctx.moveTo(0, -s * 0.38); ctx.lineTo(-s * 0.22, -s * 0.22); ctx.lineTo(s * 0.22, -s * 0.22); ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[0]; roundRect(ctx, -s * 0.12, -s * 0.2, s * 0.24, s * 0.42, s * 0.06); ctx.fill();
    ctx.fillStyle = c[2]; ctx.fillRect(-s * 0.22, s * 0.2, s * 0.44, s * 0.05);
  },
};

const park_lamp: ItemDef = {
  id: 'park_lamp', name: 'Park Lamp', world: 'city_park', sizeTier: 7, baseValue: 90, weight: 14,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0]; roundRect(ctx, -s * 0.14, s * 0.32, s * 0.28, s * 0.06, s * 0.02); ctx.fill();
    ctx.fillRect(-s * 0.035, s * 0.05, s * 0.07, s * 0.32);
    const g = c[1] || '#fde68a';
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, -s * 0.18, s * 0.12, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = c[0]; ctx.lineWidth = s * 0.025; ctx.beginPath(); ctx.arc(0, -s * 0.18, s * 0.12, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = c[0]; ctx.beginPath(); ctx.moveTo(-s * 0.08, -s * 0.06); ctx.lineTo(0, -s * 0.18); ctx.lineTo(s * 0.08, -s * 0.06); ctx.closePath(); ctx.fill();
  },
};

// ─── Construction Site ───

const craneArm: ItemDef = { id: 'crane_arm', name: 'Crane Arm', world: 'construction_site', sizeTier: 7, baseValue: 100, weight: 25,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.fillRect(-s*0.04, -s*0.4, s*0.08, s*0.8); ctx.fillRect(-s*0.04, -s*0.4, s*0.45, s*0.06); ctx.strokeStyle = c[1]||'#888'; ctx.lineWidth = s*0.02; ctx.beginPath(); ctx.moveTo(0, -s*0.34); ctx.lineTo(s*0.35, -s*0.34); ctx.stroke(); ctx.fillStyle = c[2]||'#333'; ctx.fillRect(s*0.35, -s*0.4, s*0.04, s*0.3); } };

const hardHat: ItemDef = { id: 'hard_hat', name: 'Hard Hat', world: 'construction_site', sizeTier: 7, baseValue: 82, weight: 8,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.arc(0, 0, s*0.3, Math.PI, 0); ctx.fill(); ctx.fillRect(-s*0.38, 0, s*0.76, s*0.08); ctx.fillStyle = c[1]||'#ddd'; ctx.fillRect(-s*0.15, -s*0.12, s*0.3, s*0.04); } };

const concreteBlock: ItemDef = { id: 'concrete_block', name: 'Concrete Block', world: 'construction_site', sizeTier: 7, baseValue: 90, weight: 30,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.fillRect(-s*0.35, -s*0.2, s*0.7, s*0.4); ctx.strokeStyle = c[1]||'#999'; ctx.lineWidth = s*0.02; ctx.beginPath(); ctx.moveTo(-s*0.1, -s*0.2); ctx.lineTo(-s*0.1, s*0.2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(s*0.1, -s*0.2); ctx.lineTo(s*0.1, s*0.2); ctx.stroke(); ctx.fillStyle = c[2]||'#777'; ctx.fillRect(-s*0.35, -s*0.2, s*0.7, s*0.04); } };

const trafficCone: ItemDef = { id: 'traffic_cone', name: 'Traffic Cone', world: 'construction_site', sizeTier: 7, baseValue: 78, weight: 10,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.moveTo(0, -s*0.35); ctx.lineTo(-s*0.2, s*0.25); ctx.lineTo(s*0.2, s*0.25); ctx.closePath(); ctx.fill(); ctx.fillStyle = c[1]||'#fff'; ctx.fillRect(-s*0.1, -s*0.05, s*0.2, s*0.06); ctx.fillRect(-s*0.14, s*0.1, s*0.28, s*0.06); ctx.fillStyle = c[0]; roundRect(ctx, -s*0.24, s*0.25, s*0.48, s*0.06, s*0.02); ctx.fill(); } };

const barrel: ItemDef = { id: 'barrel', name: 'Barrel', world: 'construction_site', sizeTier: 7, baseValue: 88, weight: 18,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; roundRect(ctx, -s*0.22, -s*0.32, s*0.44, s*0.64, s*0.04); ctx.fill(); ctx.strokeStyle = c[1]||'#888'; ctx.lineWidth = s*0.03; ctx.beginPath(); ctx.moveTo(-s*0.22, -s*0.15); ctx.lineTo(s*0.22, -s*0.15); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-s*0.22, s*0.15); ctx.lineTo(s*0.22, s*0.15); ctx.stroke(); ctx.fillStyle = c[2]||'#ddd'; ctx.beginPath(); ctx.ellipse(0, -s*0.32, s*0.22, s*0.06, 0, 0, Math.PI*2); ctx.fill(); } };

const steelBeam: ItemDef = { id: 'steel_beam', name: 'Steel Beam', world: 'construction_site', sizeTier: 7, baseValue: 95, weight: 28,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.fillRect(-s*0.35, -s*0.25, s*0.7, s*0.06); ctx.fillRect(-s*0.35, s*0.19, s*0.7, s*0.06); ctx.fillRect(-s*0.06, -s*0.25, s*0.12, s*0.5); ctx.strokeStyle = c[1]||'#666'; ctx.lineWidth = s*0.02; ctx.beginPath(); ctx.moveTo(-s*0.35, -s*0.19); ctx.lineTo(s*0.35, -s*0.19); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-s*0.35, s*0.19); ctx.lineTo(s*0.35, s*0.19); ctx.stroke(); } };

const shovel_item: ItemDef = {
  id: 'shovel_item', name: 'Shovel', world: 'construction_site', sizeTier: 7, baseValue: 82, weight: 12,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0]; ctx.beginPath(); ctx.moveTo(0, s * 0.08); ctx.quadraticCurveTo(s * 0.22, s * 0.28, s * 0.18, s * 0.42); ctx.lineTo(-s * 0.18, s * 0.42); ctx.quadraticCurveTo(-s * 0.22, s * 0.28, 0, s * 0.08); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = c[1] || '#8B4513'; ctx.lineWidth = s * 0.07; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, s * 0.06); ctx.lineTo(0, -s * 0.42); ctx.stroke();
    ctx.fillStyle = c[2]; ctx.fillRect(-s * 0.16, -s * 0.48, s * 0.32, s * 0.08);
  },
};

const caution_sign: ItemDef = {
  id: 'caution_sign', name: 'Caution Sign', world: 'construction_site', sizeTier: 7, baseValue: 78, weight: 8,
  draw(ctx, s, c) {
    const h = s * 0.38;
    ctx.fillStyle = c[0]; ctx.beginPath(); ctx.moveTo(0, -h); ctx.lineTo(h * 0.866, h * 0.5); ctx.lineTo(-h * 0.866, h * 0.5); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = c[1] || '#333'; ctx.lineWidth = s * 0.04; ctx.stroke();
    ctx.fillStyle = c[1] || '#333'; ctx.font = `bold ${s * 0.32}px 'Fredoka', sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('!', 0, h * 0.06);
  },
};

const wheelbarrow: ItemDef = {
  id: 'wheelbarrow', name: 'Wheelbarrow', world: 'construction_site', sizeTier: 7, baseValue: 88, weight: 18,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0]; ctx.beginPath(); ctx.moveTo(-s * 0.42, s * 0.05); ctx.lineTo(s * 0.15, -s * 0.18); ctx.lineTo(s * 0.38, -s * 0.05); ctx.lineTo(-s * 0.18, s * 0.22); ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[1] || '#333'; ctx.beginPath(); ctx.arc(s * 0.12, s * 0.22, s * 0.12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#777'; ctx.beginPath(); ctx.arc(s * 0.12, s * 0.22, s * 0.045, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = c[2]; ctx.lineWidth = s * 0.045; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-s * 0.35, s * 0.12); ctx.lineTo(-s * 0.52, s * 0.28); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s * 0.22, s * 0.18); ctx.lineTo(-s * 0.42, s * 0.32); ctx.stroke();
  },
};

const jackhammer: ItemDef = {
  id: 'jackhammer', name: 'Jackhammer', world: 'construction_site', sizeTier: 7, baseValue: 90, weight: 15,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0]; roundRect(ctx, -s * 0.18, -s * 0.38, s * 0.36, s * 0.42, s * 0.05); ctx.fill();
    ctx.fillStyle = c[1]; ctx.fillRect(-s * 0.38, -s * 0.22, s * 0.22, s * 0.08); ctx.fillRect(s * 0.16, -s * 0.22, s * 0.22, s * 0.08);
    ctx.fillStyle = c[2] || '#888'; ctx.fillRect(-s * 0.05, s * 0.04, s * 0.1, s * 0.38);
    ctx.fillStyle = '#666'; ctx.beginPath(); ctx.moveTo(-s * 0.08, s * 0.42); ctx.lineTo(s * 0.08, s * 0.42); ctx.lineTo(s * 0.04, s * 0.48); ctx.lineTo(-s * 0.04, s * 0.48); ctx.closePath(); ctx.fill();
  },
};

// ─── Downtown ───

const car: ItemDef = {
  id: 'car', name: 'Car', world: 'downtown', sizeTier: 7, baseValue: 130, weight: 35,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0];
    roundRect(ctx, -s * 0.45, -s * 0.05, s * 0.9, s * 0.25, s * 0.04);
    ctx.fill();
    ctx.fillStyle = c[0];
    roundRect(ctx, -s * 0.25, -s * 0.25, s * 0.5, s * 0.22, s * 0.06);
    ctx.fill();
    ctx.fillStyle = c[1] || '#b0d4f1';
    roundRect(ctx, -s * 0.2, -s * 0.22, s * 0.18, s * 0.16, s * 0.02);
    ctx.fill();
    roundRect(ctx, s * 0.03, -s * 0.22, s * 0.18, s * 0.16, s * 0.02);
    ctx.fill();
    ctx.fillStyle = c[2] || '#333';
    ctx.beginPath(); ctx.arc(-s * 0.28, s * 0.2, s * 0.1, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.28, s * 0.2, s * 0.1, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#888';
    ctx.beginPath(); ctx.arc(-s * 0.28, s * 0.2, s * 0.05, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.28, s * 0.2, s * 0.05, 0, Math.PI * 2); ctx.fill();
  },
};

const dumpster: ItemDef = {
  id: 'dumpster', name: 'Dumpster', world: 'downtown', sizeTier: 7, baseValue: 100, weight: 45,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0];
    ctx.beginPath();
    ctx.moveTo(-s * 0.4, -s * 0.2);
    ctx.lineTo(-s * 0.35, s * 0.25);
    ctx.lineTo(s * 0.35, s * 0.25);
    ctx.lineTo(s * 0.4, -s * 0.2);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[1] || c[0];
    ctx.fillRect(-s * 0.42, -s * 0.3, s * 0.84, s * 0.12);
    ctx.strokeStyle = c[2] || '#555'; ctx.lineWidth = s * 0.03;
    ctx.beginPath(); ctx.moveTo(-s * 0.15, -s * 0.2); ctx.lineTo(-s * 0.12, s * 0.25); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s * 0.15, -s * 0.2); ctx.lineTo(s * 0.12, s * 0.25); ctx.stroke();
  },
};

const trashCan: ItemDef = {
  id: 'trash_can', name: 'Trash Can', world: 'downtown', sizeTier: 7, baseValue: 80, weight: 10,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0];
    ctx.beginPath();
    ctx.moveTo(-s * 0.2, -s * 0.2);
    ctx.lineTo(-s * 0.16, s * 0.35);
    ctx.lineTo(s * 0.16, s * 0.35);
    ctx.lineTo(s * 0.2, -s * 0.2);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[1] || c[0];
    roundRect(ctx, -s * 0.24, -s * 0.3, s * 0.48, s * 0.12, s * 0.03);
    ctx.fill();
    ctx.strokeStyle = c[2] || '#666'; ctx.lineWidth = s * 0.02;
    ctx.beginPath(); ctx.moveTo(-s * 0.08, -s * 0.15); ctx.lineTo(-s * 0.06, s * 0.3); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s * 0.08, -s * 0.15); ctx.lineTo(s * 0.06, s * 0.3); ctx.stroke();
  },
};

const phoneBooth: ItemDef = { id: 'phone_booth', name: 'Phone Booth', world: 'downtown', sizeTier: 7, baseValue: 92, weight: 16,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.fillRect(-s*0.18, -s*0.4, s*0.36, s*0.8); ctx.fillStyle = c[1]||'#b0d4f1'; ctx.fillRect(-s*0.14, -s*0.3, s*0.28, s*0.45); ctx.strokeStyle = c[2]||'#666'; ctx.lineWidth = s*0.02; ctx.beginPath(); ctx.moveTo(0, -s*0.3); ctx.lineTo(0, s*0.15); ctx.stroke(); ctx.fillStyle = c[0]; ctx.fillRect(-s*0.2, -s*0.42, s*0.4, s*0.06); } };

const parkingMeter: ItemDef = { id: 'parking_meter', name: 'Parking Meter', world: 'downtown', sizeTier: 7, baseValue: 85, weight: 12,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.fillRect(-s*0.03, -s*0.05, s*0.06, s*0.42); roundRect(ctx, -s*0.1, s*0.35, s*0.2, s*0.05, s*0.02); ctx.fill(); ctx.fillStyle = c[1]||'#888'; roundRect(ctx, -s*0.12, -s*0.3, s*0.24, s*0.28, s*0.04); ctx.fill(); ctx.fillStyle = c[2]||'#333'; ctx.beginPath(); ctx.arc(0, -s*0.2, s*0.06, 0, Math.PI*2); ctx.fill(); } };

const traffic_light_item: ItemDef = {
  id: 'traffic_light_item', name: 'Traffic Light', world: 'downtown', sizeTier: 7, baseValue: 95, weight: 15,
  draw(ctx, s, c) {
    roundRect(ctx, -s * 0.14, -s * 0.42, s * 0.28, s * 0.72, s * 0.04); ctx.fillStyle = c[0]; ctx.fill();
    const cy = [-s * 0.28, 0, s * 0.28]; const cols = ['#ef4444', '#eab308', '#22c55e'];
    for (let i = 0; i < 3; i++) { ctx.fillStyle = cols[i]; ctx.beginPath(); ctx.arc(0, cy[i], s * 0.09, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = c[0]; ctx.fillRect(-s * 0.05, s * 0.32, s * 0.1, s * 0.2);
    roundRect(ctx, -s * 0.12, s * 0.5, s * 0.24, s * 0.05, s * 0.02); ctx.fill();
  },
};

const newspaper_box: ItemDef = {
  id: 'newspaper_box', name: 'Newspaper Box', world: 'downtown', sizeTier: 7, baseValue: 85, weight: 16,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0]; roundRect(ctx, -s * 0.32, -s * 0.28, s * 0.64, s * 0.52, s * 0.03); ctx.fill();
    ctx.fillStyle = c[1] || '#b0d4f1'; roundRect(ctx, -s * 0.22, -s * 0.18, s * 0.36, s * 0.28, s * 0.02); ctx.fill();
    ctx.fillStyle = '#f8fafc'; ctx.fillRect(-s * 0.18, -s * 0.12, s * 0.28, s * 0.18);
    ctx.fillStyle = c[2]; ctx.fillRect(-s * 0.06, s * 0.26, s * 0.05, s * 0.14); ctx.fillRect(s * 0.02, s * 0.26, s * 0.05, s * 0.14);
  },
};

const bus_stop_sign: ItemDef = {
  id: 'bus_stop_sign', name: 'Bus Stop', world: 'downtown', sizeTier: 7, baseValue: 88, weight: 12,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0]; ctx.fillRect(-s * 0.04, -s * 0.05, s * 0.08, s * 0.55);
    roundRect(ctx, -s * 0.1, s * 0.48, s * 0.2, s * 0.05, s * 0.02); ctx.fill();
    roundRect(ctx, -s * 0.32, -s * 0.42, s * 0.64, s * 0.32, s * 0.03); ctx.fillStyle = c[1]; ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = s * 0.025; ctx.stroke();
    ctx.fillStyle = c[2] || '#fff'; ctx.font = `bold ${s * 0.14}px 'Fredoka', sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('BUS', 0, -s * 0.26);
  },
};

const fire_escape_item: ItemDef = {
  id: 'fire_escape_item', name: 'Fire Escape', world: 'downtown', sizeTier: 7, baseValue: 92, weight: 18,
  draw(ctx, s, c) {
    ctx.strokeStyle = c[0]; ctx.lineWidth = s * 0.045; ctx.lineCap = 'square';
    const w = s * 0.28; const ys = [-s * 0.32, -s * 0.08, s * 0.16, s * 0.38];
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-w, ys[i]); ctx.lineTo(w, ys[i]); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(-w, ys[0]); ctx.lineTo(w, ys[1]); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w, ys[1]); ctx.lineTo(-w, ys[2]); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-w, ys[2]); ctx.lineTo(w, ys[3]); ctx.stroke();
    ctx.lineWidth = s * 0.03;
    ctx.beginPath(); ctx.moveTo(-w, ys[0]); ctx.lineTo(-w, ys[3]); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w, ys[0]); ctx.lineTo(w, ys[3]); ctx.stroke();
  },
};

const hot_dog_cart: ItemDef = {
  id: 'hot_dog_cart', name: 'Hot Dog Cart', world: 'downtown', sizeTier: 7, baseValue: 100, weight: 20,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0]; roundRect(ctx, -s * 0.38, -s * 0.08, s * 0.76, s * 0.36, s * 0.04); ctx.fill();
    ctx.fillStyle = c[1]; ctx.beginPath(); ctx.arc(0, -s * 0.38, s * 0.42, Math.PI, 0); ctx.lineTo(s * 0.42, -s * 0.08); ctx.lineTo(-s * 0.42, -s * 0.08); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = c[0]; ctx.lineWidth = s * 0.03; ctx.beginPath(); ctx.moveTo(0, -s * 0.38); ctx.lineTo(0, -s * 0.08); ctx.stroke();
    ctx.fillStyle = c[2] || '#333';
    ctx.beginPath(); ctx.arc(-s * 0.22, s * 0.28, s * 0.09, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.22, s * 0.28, s * 0.09, 0, Math.PI * 2); ctx.fill();
  },
};

// ─── Space Station ───

const satellite: ItemDef = { id: 'satellite', name: 'Satellite', world: 'space_station', sizeTier: 8, baseValue: 140, weight: 15,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.fillRect(-s*0.1, -s*0.1, s*0.2, s*0.2); ctx.fillStyle = c[1]||'#2563eb'; ctx.fillRect(-s*0.45, -s*0.08, s*0.32, s*0.16); ctx.fillRect(s*0.13, -s*0.08, s*0.32, s*0.16); ctx.strokeStyle = c[2]||'#555'; ctx.lineWidth = s*0.02; ctx.beginPath(); ctx.moveTo(-s*0.3, -s*0.08); ctx.lineTo(-s*0.3, s*0.08); ctx.stroke(); ctx.beginPath(); ctx.moveTo(s*0.3, -s*0.08); ctx.lineTo(s*0.3, s*0.08); ctx.stroke(); } };

const asteroid: ItemDef = { id: 'asteroid', name: 'Asteroid', world: 'space_station', sizeTier: 8, baseValue: 120, weight: 35,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.moveTo(s*0.1, -s*0.35); ctx.lineTo(s*0.3, -s*0.2); ctx.lineTo(s*0.35, s*0.05); ctx.lineTo(s*0.2, s*0.3); ctx.lineTo(-s*0.05, s*0.35); ctx.lineTo(-s*0.3, s*0.2); ctx.lineTo(-s*0.35, -s*0.05); ctx.lineTo(-s*0.2, -s*0.3); ctx.closePath(); ctx.fill(); ctx.fillStyle = c[1]||'#666'; ctx.beginPath(); ctx.arc(-s*0.1, -s*0.05, s*0.06, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(s*0.1, s*0.1, s*0.08, 0, Math.PI*2); ctx.fill(); } };

const spaceFood: ItemDef = { id: 'space_food', name: 'Space Food', world: 'space_station', sizeTier: 8, baseValue: 100, weight: 8,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; roundRect(ctx, -s*0.25, -s*0.18, s*0.5, s*0.36, s*0.04); ctx.fill(); ctx.strokeStyle = c[1]||'#aaa'; ctx.lineWidth = s*0.02; ctx.beginPath(); ctx.moveTo(-s*0.25, -s*0.05); ctx.lineTo(s*0.25, -s*0.05); ctx.stroke(); ctx.fillStyle = c[2]||'#fff'; ctx.font = `${s*0.1}px 'Fredoka', sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('NASA', 0, s*0.06); } };

const astronautGlove: ItemDef = { id: 'astronaut_glove', name: 'Astronaut Glove', world: 'space_station', sizeTier: 8, baseValue: 110, weight: 10,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; roundRect(ctx, -s*0.15, -s*0.05, s*0.3, s*0.4, s*0.06); ctx.fill(); ctx.fillRect(-s*0.22, -s*0.05, s*0.12, s*0.22); ctx.fillRect(-s*0.08, -s*0.25, s*0.1, s*0.25); ctx.fillRect(s*0.04, -s*0.28, s*0.1, s*0.28); ctx.fillRect(s*0.16, -s*0.2, s*0.1, s*0.2); ctx.strokeStyle = c[1]||'#aaa'; ctx.lineWidth = s*0.02; ctx.beginPath(); ctx.moveTo(-s*0.15, s*0.1); ctx.lineTo(s*0.15, s*0.1); ctx.stroke(); } };

const spaceWrench: ItemDef = { id: 'space_wrench', name: 'Space Wrench', world: 'space_station', sizeTier: 8, baseValue: 115, weight: 12,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.fillRect(-s*0.04, -s*0.2, s*0.08, s*0.5); ctx.beginPath(); ctx.arc(0, -s*0.22, s*0.14, -Math.PI*0.75, Math.PI*0.75); ctx.closePath(); ctx.fill(); ctx.fillStyle = c[1]||'#555'; ctx.beginPath(); ctx.arc(0, -s*0.22, s*0.06, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = c[2]||'#888'; roundRect(ctx, -s*0.07, s*0.22, s*0.14, s*0.08, s*0.02); ctx.fill(); } };

const moonRock: ItemDef = { id: 'moon_rock', name: 'Moon Rock', world: 'space_station', sizeTier: 8, baseValue: 130, weight: 40,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.moveTo(-s*0.1, -s*0.3); ctx.lineTo(s*0.2, -s*0.25); ctx.lineTo(s*0.3, -s*0.05); ctx.lineTo(s*0.25, s*0.2); ctx.lineTo(s*0.05, s*0.3); ctx.lineTo(-s*0.25, s*0.25); ctx.lineTo(-s*0.3, s*0.05); ctx.lineTo(-s*0.25, -s*0.15); ctx.closePath(); ctx.fill(); ctx.fillStyle = c[1]||'#888'; ctx.beginPath(); ctx.arc(-s*0.08, s*0.05, s*0.06, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(s*0.12, -s*0.08, s*0.05, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(0, s*0.18, s*0.04, 0, Math.PI*2); ctx.fill(); } };

const planet: ItemDef = {
  id: 'planet', name: 'Planet', world: 'space_station', sizeTier: 8, baseValue: 120, weight: 20,
  draw(ctx, s, c) {
    const r = s * 0.32;
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.38)';
    ctx.beginPath(); ctx.arc(-r * 0.32, -r * 0.36, r * 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = c[1]; ctx.lineWidth = s * 0.055; ctx.lineCap = 'round';
    ctx.save(); ctx.rotate(0.38);
    ctx.beginPath(); ctx.ellipse(0, 0, s * 0.54, s * 0.11, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
    ctx.strokeStyle = c[1]; ctx.globalAlpha = 0.35;
    ctx.save(); ctx.rotate(0.38);
    ctx.beginPath(); ctx.ellipse(0, 0, s * 0.58, s * 0.07, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.restore(); ctx.globalAlpha = 1;
  },
};

const space_helmet: ItemDef = {
  id: 'space_helmet', name: 'Space Helmet', world: 'space_station', sizeTier: 8, baseValue: 115, weight: 12,
  draw(ctx, s, c) {
    const visor = c[1] || '#b0d4f1';
    ctx.fillStyle = c[0];
    ctx.beginPath();
    ctx.arc(0, -s * 0.05, s * 0.36, Math.PI, 0);
    ctx.lineTo(s * 0.36, s * 0.1);
    ctx.quadraticCurveTo(0, s * 0.2, -s * 0.36, s * 0.1);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = c[0]; ctx.lineWidth = s * 0.025;
    ctx.beginPath();
    ctx.arc(0, -s * 0.05, s * 0.36, Math.PI, 0);
    ctx.lineTo(s * 0.36, s * 0.1);
    ctx.quadraticCurveTo(0, s * 0.2, -s * 0.36, s * 0.1);
    ctx.closePath(); ctx.stroke();
    ctx.fillStyle = visor;
    ctx.beginPath();
    ctx.arc(0, -s * 0.06, s * 0.26, Math.PI * 1.05, -Math.PI * 0.05);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath();
    ctx.ellipse(-s * 0.1, -s * 0.2, s * 0.09, s * 0.05, -0.45, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = c[2] || c[0];
    roundRect(ctx, -s * 0.33, s * 0.1, s * 0.66, s * 0.14, s * 0.05); ctx.fill();
    ctx.strokeStyle = c[0]; ctx.lineWidth = s * 0.03;
    ctx.beginPath(); ctx.moveTo(-s * 0.33, s * 0.1); ctx.lineTo(s * 0.33, s * 0.1); ctx.stroke();
  },
};

const rocket_item: ItemDef = {
  id: 'rocket_item', name: 'Rocket', world: 'space_station', sizeTier: 8, baseValue: 130, weight: 18,
  draw(ctx, s, c) {
    ctx.fillStyle = c[1];
    ctx.beginPath(); ctx.moveTo(0, -s * 0.4); ctx.lineTo(s * 0.13, -s * 0.14); ctx.lineTo(-s * 0.13, -s * 0.14); ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[0];
    roundRect(ctx, -s * 0.11, -s * 0.14, s * 0.22, s * 0.4, s * 0.04); ctx.fill();
    ctx.fillStyle = c[1];
    ctx.beginPath(); ctx.moveTo(-s * 0.11, s * 0.16); ctx.lineTo(-s * 0.24, s * 0.32); ctx.lineTo(-s * 0.11, s * 0.26); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(s * 0.11, s * 0.16); ctx.lineTo(s * 0.24, s * 0.32); ctx.lineTo(s * 0.11, s * 0.26); ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[2];
    ctx.beginPath(); ctx.arc(0, -s * 0.02, s * 0.065, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = s * 0.02;
    ctx.beginPath(); ctx.arc(0, -s * 0.02, s * 0.065, 0, Math.PI * 2); ctx.stroke();
  },
};

const ufo: ItemDef = {
  id: 'ufo', name: 'UFO', world: 'space_station', sizeTier: 8, baseValue: 110, weight: 15,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.ellipse(0, s * 0.05, s * 0.44, s * 0.13, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = s * 0.02;
    ctx.stroke();
    ctx.fillStyle = c[1];
    ctx.beginPath(); ctx.arc(0, -s * 0.02, s * 0.2, Math.PI, 0); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.beginPath(); ctx.arc(0, -s * 0.02, s * 0.2, Math.PI, 0); ctx.stroke();
    const lights = c[2] || '#fde68a';
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2 + 0.2;
      const x = Math.cos(a) * s * 0.4;
      const y = s * 0.05 + Math.sin(a) * s * 0.09;
      ctx.fillStyle = lights;
      ctx.beginPath(); ctx.arc(x, y, s * 0.035, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.beginPath(); ctx.arc(x - s * 0.01, y - s * 0.01, s * 0.012, 0, Math.PI * 2); ctx.fill();
    }
  },
};

// ─── Candy World ───

const lollipop: ItemDef = { id: 'lollipop', name: 'Lollipop', world: 'candy_world', sizeTier: 8, baseValue: 105, weight: 10,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.arc(0, -s*0.12, s*0.25, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = c[1]; ctx.beginPath(); ctx.arc(0, -s*0.12, s*0.25, 0, Math.PI); ctx.fill(); ctx.fillStyle = c[2]||'#8B4513'; ctx.fillRect(-s*0.03, s*0.13, s*0.06, s*0.32); } };

const gummyBear: ItemDef = { id: 'gummy_bear', name: 'Gummy Bear', world: 'candy_world', sizeTier: 8, baseValue: 110, weight: 12,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.arc(-s*0.12, -s*0.28, s*0.08, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(s*0.12, -s*0.28, s*0.08, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(0, -s*0.16, s*0.15, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(0, s*0.1, s*0.22, 0, Math.PI*2); ctx.fill(); ctx.fillRect(-s*0.2, s*0.15, s*0.1, s*0.2); ctx.fillRect(s*0.1, s*0.15, s*0.1, s*0.2); ctx.fillStyle = c[1]||'#333'; ctx.beginPath(); ctx.arc(-s*0.05, -s*0.18, s*0.02, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(s*0.05, -s*0.18, s*0.02, 0, Math.PI*2); ctx.fill(); } };

const candyCane: ItemDef = { id: 'candy_cane', name: 'Candy Cane', world: 'candy_world', sizeTier: 8, baseValue: 100, weight: 8,
  draw(ctx, s, c) { ctx.strokeStyle = c[0]; ctx.lineWidth = s*0.1; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(s*0.05, s*0.35); ctx.lineTo(s*0.05, -s*0.15); ctx.arc(-s*0.1, -s*0.15, s*0.15, 0, Math.PI, true); ctx.stroke(); ctx.strokeStyle = c[1]; ctx.lineWidth = s*0.04; ctx.beginPath(); ctx.moveTo(s*0.05, s*0.35); ctx.lineTo(s*0.05, -s*0.15); ctx.arc(-s*0.1, -s*0.15, s*0.15, 0, Math.PI, true); ctx.stroke(); } };

const cupcake: ItemDef = { id: 'cupcake', name: 'Cupcake', world: 'candy_world', sizeTier: 8, baseValue: 120, weight: 15,
  draw(ctx, s, c) { ctx.fillStyle = c[2]||'#8B4513'; ctx.beginPath(); ctx.moveTo(-s*0.2, -s*0.02); ctx.lineTo(-s*0.15, s*0.3); ctx.lineTo(s*0.15, s*0.3); ctx.lineTo(s*0.2, -s*0.02); ctx.closePath(); ctx.fill(); ctx.fillStyle = c[0]; ctx.beginPath(); ctx.arc(0, -s*0.02, s*0.22, Math.PI, 0); ctx.fill(); ctx.fillStyle = c[1]; ctx.beginPath(); ctx.arc(0, -s*0.15, s*0.15, Math.PI, 0); ctx.fill(); ctx.fillStyle = c[0]; ctx.beginPath(); ctx.arc(0, -s*0.28, s*0.04, 0, Math.PI*2); ctx.fill(); } };

const donutItem: ItemDef = { id: 'donut_item', name: 'Donut', world: 'candy_world', sizeTier: 8, baseValue: 115, weight: 14,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.arc(0, 0, s*0.35, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = c[1]; ctx.beginPath(); ctx.arc(-s*0.15, -s*0.15, s*0.05, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(s*0.1, -s*0.2, s*0.04, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(s*0.2, 0, s*0.05, 0, Math.PI*2); ctx.fill(); ctx.globalCompositeOperation = 'destination-out'; ctx.beginPath(); ctx.arc(0, 0, s*0.12, 0, Math.PI*2); ctx.fill(); ctx.globalCompositeOperation = 'source-over'; } };

const chocolateBar: ItemDef = { id: 'chocolate_bar', name: 'Chocolate Bar', world: 'candy_world', sizeTier: 8, baseValue: 125, weight: 18,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; roundRect(ctx, -s*0.3, -s*0.2, s*0.6, s*0.4, s*0.04); ctx.fill(); ctx.strokeStyle = c[1]||'#3b1f0b'; ctx.lineWidth = s*0.02; ctx.beginPath(); ctx.moveTo(-s*0.1, -s*0.2); ctx.lineTo(-s*0.1, s*0.2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(s*0.1, -s*0.2); ctx.lineTo(s*0.1, s*0.2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-s*0.3, 0); ctx.lineTo(s*0.3, 0); ctx.stroke(); } };

const cotton_candy: ItemDef = {
  id: 'cotton_candy', name: 'Cotton Candy', world: 'candy_world', sizeTier: 8, baseValue: 108, weight: 8,
  draw(ctx, s, c) {
    const puff = c[0];
    const stick = c[1] || '#8B4513';
    const blobs: [number, number, number][] = [[0, -s * 0.28, s * 0.22], [-s * 0.18, -s * 0.18, s * 0.18], [s * 0.2, -s * 0.2, s * 0.19], [-s * 0.12, -s * 0.38, s * 0.16], [s * 0.1, -s * 0.36, s * 0.17], [0, -s * 0.42, s * 0.14], [-s * 0.22, -s * 0.32, s * 0.12], [s * 0.22, -s * 0.32, s * 0.13]];
    ctx.fillStyle = puff;
    for (const [bx, by, br] of blobs) {
      ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.beginPath(); ctx.arc(-s * 0.08, -s * 0.35, s * 0.06, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = stick; ctx.lineWidth = s * 0.045; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, -s * 0.08); ctx.lineTo(s * 0.06, s * 0.42); ctx.stroke();
  },
};

const ice_cream_cone: ItemDef = {
  id: 'ice_cream_cone', name: 'Ice Cream Cone', world: 'candy_world', sizeTier: 8, baseValue: 115, weight: 12,
  draw(ctx, s, c) {
    const cone = c[2] || '#d4a017';
    ctx.fillStyle = cone;
    ctx.beginPath(); ctx.moveTo(0, s * 0.38); ctx.lineTo(-s * 0.22, -s * 0.02); ctx.lineTo(s * 0.22, -s * 0.02); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = s * 0.015;
    for (let i = -2; i <= 2; i++) {
      const o = i * s * 0.07;
      ctx.beginPath(); ctx.moveTo(o, s * 0.28); ctx.lineTo(o + s * 0.14, -s * 0.02); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(o, s * 0.28); ctx.lineTo(o - s * 0.14, -s * 0.02); ctx.stroke();
    }
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.arc(0, -s * 0.18, s * 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = c[1];
    ctx.beginPath(); ctx.arc(0, -s * 0.38, s * 0.17, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath(); ctx.arc(-s * 0.06, -s * 0.44, s * 0.05, 0, Math.PI * 2); ctx.fill();
  },
};

const jawbreaker: ItemDef = {
  id: 'jawbreaker', name: 'Jawbreaker', world: 'candy_world', sizeTier: 8, baseValue: 105, weight: 14,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.arc(0, 0, s * 0.38, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.08)'; ctx.lineWidth = s * 0.02;
    ctx.stroke();
    ctx.fillStyle = c[1];
    ctx.beginPath(); ctx.arc(0, 0, s * 0.28, 0, Math.PI * 2); ctx.fill();
    ctx.stroke();
    ctx.fillStyle = c[2];
    ctx.beginPath(); ctx.arc(0, 0, s * 0.16, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.beginPath(); ctx.arc(-s * 0.12, -s * 0.12, s * 0.06, 0, Math.PI * 2); ctx.fill();
  },
};

const gumball_machine: ItemDef = {
  id: 'gumball_machine', name: 'Gumball Machine', world: 'candy_world', sizeTier: 8, baseValue: 125, weight: 18,
  draw(ctx, s, c) {
    ctx.strokeStyle = c[0]; ctx.lineWidth = s * 0.04;
    ctx.beginPath(); ctx.arc(0, -s * 0.12, s * 0.3, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.arc(0, -s * 0.12, s * 0.26, 0, Math.PI * 2); ctx.fill();
    const dots: [number, number][] = [[-0.1, -0.18], [0.08, -0.2], [0.12, -0.1], [-0.12, -0.08], [0, -0.25], [-0.05, -0.14], [0.15, -0.16], [-0.14, -0.2]];
    const cols = [c[0], c[1], c[2], '#ef4444', '#22c55e', '#eab308'];
    dots.forEach(([dx, dy], i) => {
      ctx.fillStyle = cols[i % cols.length];
      ctx.beginPath(); ctx.arc(dx * s, dy * s, s * 0.045, 0, Math.PI * 2); ctx.fill();
    });
    ctx.fillStyle = c[1];
    roundRect(ctx, -s * 0.26, s * 0.02, s * 0.52, s * 0.28, s * 0.04); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    roundRect(ctx, -s * 0.08, s * 0.14, s * 0.16, s * 0.06, s * 0.02); ctx.fill();
    ctx.strokeStyle = c[0]; ctx.lineWidth = s * 0.025;
    ctx.beginPath(); ctx.moveTo(-s * 0.26, s * 0.02); ctx.lineTo(s * 0.26, s * 0.02); ctx.stroke();
  },
};

// ─── Deep Ocean ───

const fishItem: ItemDef = { id: 'fish', name: 'Fish', world: 'deep_ocean', sizeTier: 8, baseValue: 110, weight: 15,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.moveTo(s*0.35, 0); ctx.quadraticCurveTo(s*0.15, -s*0.25, -s*0.15, -s*0.2); ctx.quadraticCurveTo(-s*0.25, 0, -s*0.15, s*0.2); ctx.quadraticCurveTo(s*0.15, s*0.25, s*0.35, 0); ctx.closePath(); ctx.fill(); ctx.fillStyle = c[1]||c[0]; ctx.beginPath(); ctx.moveTo(-s*0.2, 0); ctx.lineTo(-s*0.38, -s*0.18); ctx.lineTo(-s*0.38, s*0.18); ctx.closePath(); ctx.fill(); ctx.fillStyle = c[2]||'#333'; ctx.beginPath(); ctx.arc(s*0.15, -s*0.05, s*0.04, 0, Math.PI*2); ctx.fill(); } };

const seashell: ItemDef = { id: 'seashell', name: 'Seashell', world: 'deep_ocean', sizeTier: 8, baseValue: 100, weight: 12,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.moveTo(0, s*0.3); ctx.quadraticCurveTo(-s*0.35, s*0.15, -s*0.3, -s*0.1); ctx.quadraticCurveTo(-s*0.2, -s*0.35, s*0.05, -s*0.3); ctx.quadraticCurveTo(s*0.3, -s*0.25, s*0.25, s*0.05); ctx.quadraticCurveTo(s*0.2, s*0.25, 0, s*0.3); ctx.closePath(); ctx.fill(); ctx.strokeStyle = c[1]||'#deb887'; ctx.lineWidth = s*0.02; ctx.beginPath(); ctx.arc(-s*0.02, -s*0.02, s*0.12, 0.5, Math.PI*1.8); ctx.stroke(); ctx.beginPath(); ctx.arc(-s*0.02, -s*0.02, s*0.06, 0.5, Math.PI*1.5); ctx.stroke(); } };

const treasureChest: ItemDef = { id: 'treasure_chest', name: 'Treasure Chest', world: 'deep_ocean', sizeTier: 8, baseValue: 140, weight: 25,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.fillRect(-s*0.3, -s*0.05, s*0.6, s*0.35); ctx.beginPath(); ctx.arc(0, -s*0.05, s*0.3, Math.PI, 0); ctx.fill(); ctx.fillStyle = c[1]||'#fbbf24'; ctx.fillRect(-s*0.3, -s*0.05, s*0.6, s*0.04); ctx.fillStyle = c[2]||'#fbbf24'; ctx.fillRect(-s*0.06, -s*0.1, s*0.12, s*0.12); } };

const coralItem: ItemDef = { id: 'coral', name: 'Coral', world: 'deep_ocean', sizeTier: 8, baseValue: 105, weight: 18,
  draw(ctx, s, c) { ctx.strokeStyle = c[0]; ctx.lineWidth = s*0.06; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, s*0.3); ctx.lineTo(0, 0); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-s*0.2, -s*0.25); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(s*0.2, -s*0.2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-s*0.2, -s*0.25); ctx.lineTo(-s*0.3, -s*0.38); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-s*0.2, -s*0.25); ctx.lineTo(-s*0.1, -s*0.4); ctx.stroke(); ctx.beginPath(); ctx.moveTo(s*0.2, -s*0.2); ctx.lineTo(s*0.3, -s*0.35); ctx.stroke(); ctx.fillStyle = c[1]||c[0]; ctx.beginPath(); ctx.arc(-s*0.3, -s*0.38, s*0.04, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(-s*0.1, -s*0.4, s*0.04, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(s*0.3, -s*0.35, s*0.04, 0, Math.PI*2); ctx.fill(); } };

const jellyfish: ItemDef = { id: 'jellyfish', name: 'Jellyfish', world: 'deep_ocean', sizeTier: 8, baseValue: 115, weight: 8,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.arc(0, -s*0.1, s*0.25, Math.PI, 0); ctx.fill(); ctx.strokeStyle = c[1]||c[0]; ctx.lineWidth = s*0.03; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-s*0.15, -s*0.1); ctx.quadraticCurveTo(-s*0.2, s*0.15, -s*0.12, s*0.35); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, -s*0.1); ctx.quadraticCurveTo(s*0.05, s*0.1, -s*0.02, s*0.38); ctx.stroke(); ctx.beginPath(); ctx.moveTo(s*0.15, -s*0.1); ctx.quadraticCurveTo(s*0.2, s*0.15, s*0.12, s*0.35); ctx.stroke(); } };

const anchorItem: ItemDef = { id: 'anchor', name: 'Anchor', world: 'deep_ocean', sizeTier: 8, baseValue: 130, weight: 30,
  draw(ctx, s, c) { ctx.strokeStyle = c[0]; ctx.lineWidth = s*0.06; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, -s*0.15); ctx.lineTo(0, s*0.3); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-s*0.2, -s*0.05); ctx.lineTo(s*0.2, -s*0.05); ctx.stroke(); ctx.beginPath(); ctx.arc(0, s*0.15, s*0.22, Math.PI*0.15, Math.PI*0.85); ctx.stroke(); ctx.fillStyle = c[0]; ctx.beginPath(); ctx.arc(0, -s*0.22, s*0.1, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = c[1]||'#888'; ctx.beginPath(); ctx.arc(0, -s*0.22, s*0.05, 0, Math.PI*2); ctx.fill(); } };

const starfish_item: ItemDef = {
  id: 'starfish_item', name: 'Starfish', world: 'deep_ocean', sizeTier: 8, baseValue: 110, weight: 15,
  draw(ctx, s, c) {
    const n = 5;
    const wBase = s * 0.13;
    const wTip = s * 0.045;
    const r0 = s * 0.11;
    const r1 = s * 0.4;
    const tipR = s * 0.052;
    ctx.fillStyle = c[0];
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (i / n) * Math.PI * 2 + 0.08 * Math.sin(i * 1.7);
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      const px = -sa;
      const py = ca;
      const bx = ca * r0 + px * wBase;
      const by = sa * r0 + py * wBase;
      const tx = ca * r1;
      const ty = sa * r1;
      const lx = ca * r1 + px * wTip;
      const ly = sa * r1 + py * wTip;
      const rx = ca * r1 - px * wTip;
      const ry = sa * r1 - py * wTip;
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.quadraticCurveTo(ca * (r0 + r1) * 0.55 + px * wBase * 0.55, sa * (r0 + r1) * 0.55 + py * wBase * 0.55, lx, ly);
      ctx.arc(tx, ty, tipR, a + Math.PI / 2 + 0.15, a - Math.PI / 2 - 0.15, true);
      ctx.quadraticCurveTo(ca * (r0 + r1) * 0.55 - px * wBase * 0.45, sa * (r0 + r1) * 0.55 - py * wBase * 0.45, -bx, -by);
      ctx.quadraticCurveTo(px * wBase * 0.3, py * wBase * 0.3, bx, by);
      ctx.closePath(); ctx.fill();
    }
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.arc(0, 0, s * 0.14, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = c[1] || 'rgba(0,0,0,0.2)';
    for (let j = 0; j < 9; j++) {
      const ba = (j / 9) * Math.PI * 2;
      const jr = s * (0.04 + (j % 3) * 0.015);
      ctx.beginPath(); ctx.arc(Math.cos(ba) * s * 0.06, Math.sin(ba) * s * 0.06, jr, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = s * 0.015;
    ctx.beginPath(); ctx.arc(0, 0, s * 0.14, 0, Math.PI * 2); ctx.stroke();
  },
};

const octopus_item: ItemDef = {
  id: 'octopus_item', name: 'Octopus', world: 'deep_ocean', sizeTier: 8, baseValue: 120, weight: 18,
  draw(ctx, s, c) {
    const tent = c[1] || c[0];
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.arc(0, -s * 0.12, s * 0.28, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = tent; ctx.lineWidth = s * 0.055; ctx.lineCap = 'round';
    const legs = [-0.35, -0.12, 0.12, 0.35];
    legs.forEach((ox, i) => {
      ctx.beginPath();
      ctx.moveTo(ox * s * 0.35, s * 0.08);
      ctx.quadraticCurveTo(ox * s * 0.5, s * 0.22, ox * s * 0.25 + (i % 2 === 0 ? -1 : 1) * s * 0.08, s * 0.38);
      ctx.quadraticCurveTo(ox * s * 0.15, s * 0.32, ox * s * 0.1, s * 0.42);
      ctx.stroke();
    });
    ctx.fillStyle = c[2] || '#333';
    ctx.beginPath(); ctx.arc(-s * 0.1, -s * 0.16, s * 0.035, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.1, -s * 0.16, s * 0.035, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(-s * 0.1, -s * 0.16, s * 0.012, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.1, -s * 0.16, s * 0.012, 0, Math.PI * 2); ctx.fill();
  },
};

const submarine_item: ItemDef = {
  id: 'submarine_item', name: 'Submarine', world: 'deep_ocean', sizeTier: 8, baseValue: 125, weight: 25,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0];
    roundRect(ctx, -s * 0.32, -s * 0.12, s * 0.62, s * 0.24, s * 0.12); ctx.fill();
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.arc(s * 0.3, 0, s * 0.12, -Math.PI / 2, Math.PI / 2); ctx.lineTo(-s * 0.32, s * 0.12); ctx.lineTo(-s * 0.32, -s * 0.12); ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[1];
    roundRect(ctx, -s * 0.06, -s * 0.32, s * 0.16, s * 0.18, s * 0.02); ctx.fill();
    ctx.strokeStyle = c[2] || '#333'; ctx.lineWidth = s * 0.035; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0.02 * s, -s * 0.32); ctx.lineTo(0.02 * s, -s * 0.48); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s * 0.08, -s * 0.48); ctx.lineTo(s * 0.12, -s * 0.48); ctx.stroke();
    ctx.strokeStyle = c[2] || '#555'; ctx.lineWidth = s * 0.025;
    ctx.beginPath(); ctx.arc(-s * 0.38, 0, s * 0.06, 0, Math.PI * 2); ctx.stroke();
    for (let k = 0; k < 3; k++) {
      const ang = Math.PI * 0.25 + k * Math.PI * 0.25;
      ctx.beginPath(); ctx.moveTo(-s * 0.38, 0); ctx.lineTo(-s * 0.38 + Math.cos(ang) * s * 0.1, Math.sin(ang) * s * 0.1); ctx.stroke();
    }
  },
};

const diving_helmet: ItemDef = {
  id: 'diving_helmet', name: 'Diving Helmet', world: 'deep_ocean', sizeTier: 8, baseValue: 130, weight: 22,
  draw(ctx, s, c) {
    const glass = c[1] || '#b0d4f1';
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.arc(0, -s * 0.05, s * 0.34, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = s * 0.02;
    ctx.stroke();
    ctx.fillStyle = glass;
    ctx.beginPath(); ctx.arc(0, -s * 0.05, s * 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = c[0]; ctx.lineWidth = s * 0.04;
    ctx.beginPath(); ctx.arc(0, -s * 0.05, s * 0.2, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath(); ctx.arc(-s * 0.08, -s * 0.12, s * 0.06, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = c[0];
    roundRect(ctx, -s * 0.38, s * 0.22, s * 0.76, s * 0.1, s * 0.02); ctx.fill();
    ctx.fillStyle = c[2] || '#555';
    for (let i = 0; i < 8; i++) {
      const rx = -s * 0.32 + (i / 7) * s * 0.64;
      ctx.beginPath(); ctx.arc(rx, s * 0.28, s * 0.022, 0, Math.PI * 2); ctx.fill();
    }
  },
};

// ─── Volcano ───

const lavaRock: ItemDef = { id: 'lava_rock', name: 'Lava Rock', world: 'volcano', sizeTier: 8, baseValue: 120, weight: 35,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.moveTo(-s*0.15, -s*0.3); ctx.lineTo(s*0.15, -s*0.28); ctx.lineTo(s*0.3, -s*0.1); ctx.lineTo(s*0.25, s*0.2); ctx.lineTo(s*0.05, s*0.3); ctx.lineTo(-s*0.2, s*0.25); ctx.lineTo(-s*0.3, 0); ctx.lineTo(-s*0.28, -s*0.18); ctx.closePath(); ctx.fill(); ctx.fillStyle = c[1]||'#ff6b35'; ctx.beginPath(); ctx.moveTo(-s*0.05, -s*0.1); ctx.lineTo(s*0.08, s*0.05); ctx.lineTo(-s*0.1, s*0.1); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.arc(s*0.12, -s*0.1, s*0.05, 0, Math.PI*2); ctx.fill(); } };

const obsidianShard: ItemDef = { id: 'obsidian_shard', name: 'Obsidian Shard', world: 'volcano', sizeTier: 8, baseValue: 130, weight: 20,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.moveTo(0, -s*0.45); ctx.lineTo(s*0.15, -s*0.1); ctx.lineTo(s*0.25, s*0.2); ctx.lineTo(s*0.05, s*0.35); ctx.lineTo(-s*0.1, s*0.15); ctx.lineTo(-s*0.2, -s*0.05); ctx.closePath(); ctx.fill(); ctx.fillStyle = c[1]||'rgba(255,255,255,0.2)'; ctx.beginPath(); ctx.moveTo(0, -s*0.45); ctx.lineTo(s*0.05, -s*0.1); ctx.lineTo(-s*0.1, s*0.05); ctx.lineTo(-s*0.2, -s*0.05); ctx.closePath(); ctx.fill(); } };

const rubyItem: ItemDef = { id: 'ruby', name: 'Ruby', world: 'volcano', sizeTier: 8, baseValue: 145, weight: 15,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = (i/6)*Math.PI*2-Math.PI/2; const px = Math.cos(a)*s*0.3, py = Math.sin(a)*s*0.3; if (i===0) ctx.moveTo(px, py); else ctx.lineTo(px, py); } ctx.closePath(); ctx.fill(); ctx.fillStyle = c[1]||'rgba(255,255,255,0.3)'; ctx.beginPath(); ctx.moveTo(0, -s*0.3); ctx.lineTo(s*0.15, 0); ctx.lineTo(-s*0.15, 0); ctx.closePath(); ctx.fill(); ctx.strokeStyle = c[2]||'rgba(255,255,255,0.2)'; ctx.lineWidth = s*0.02; ctx.beginPath(); ctx.moveTo(0, -s*0.3); ctx.lineTo(0, s*0.3); ctx.stroke(); } };

const magmaDrop: ItemDef = { id: 'magma_drop', name: 'Magma Drop', world: 'volcano', sizeTier: 8, baseValue: 110, weight: 12,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.moveTo(0, -s*0.4); ctx.quadraticCurveTo(s*0.3, 0, s*0.2, s*0.2); ctx.arc(0, s*0.2, s*0.2, 0, Math.PI); ctx.quadraticCurveTo(-s*0.3, 0, 0, -s*0.4); ctx.closePath(); ctx.fill(); ctx.fillStyle = c[1]||'rgba(255,255,100,0.5)'; ctx.beginPath(); ctx.moveTo(0, -s*0.25); ctx.quadraticCurveTo(s*0.12, 0, s*0.08, s*0.1); ctx.arc(0, s*0.1, s*0.08, 0, Math.PI); ctx.quadraticCurveTo(-s*0.12, 0, 0, -s*0.25); ctx.closePath(); ctx.fill(); } };

const ember: ItemDef = { id: 'ember', name: 'Ember', world: 'volcano', sizeTier: 8, baseValue: 100, weight: 5,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.arc(0, 0, s*0.2, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = c[1]||'#ffdd57'; ctx.beginPath(); ctx.arc(0, 0, s*0.12, 0, Math.PI*2); ctx.fill(); ctx.strokeStyle = c[0]; ctx.lineWidth = s*0.03; ctx.lineCap = 'round'; for (let i = 0; i < 8; i++) { const a = (i/8)*Math.PI*2; ctx.beginPath(); ctx.moveTo(Math.cos(a)*s*0.24, Math.sin(a)*s*0.24); ctx.lineTo(Math.cos(a)*s*0.35, Math.sin(a)*s*0.35); ctx.stroke(); } } };

const volcanicCrystal: ItemDef = { id: 'volcanic_crystal', name: 'Volcanic Crystal', world: 'volcano', sizeTier: 8, baseValue: 135, weight: 18,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.moveTo(-s*0.08, s*0.35); ctx.lineTo(-s*0.15, -s*0.1); ctx.lineTo(0, -s*0.42); ctx.lineTo(s*0.15, -s*0.1); ctx.lineTo(s*0.08, s*0.35); ctx.closePath(); ctx.fill(); ctx.fillStyle = c[1]||'rgba(255,255,255,0.25)'; ctx.beginPath(); ctx.moveTo(0, -s*0.42); ctx.lineTo(s*0.15, -s*0.1); ctx.lineTo(s*0.08, s*0.35); ctx.lineTo(0, s*0.3); ctx.closePath(); ctx.fill(); ctx.strokeStyle = c[2]||'rgba(255,255,255,0.15)'; ctx.lineWidth = s*0.02; ctx.beginPath(); ctx.moveTo(0, -s*0.42); ctx.lineTo(0, s*0.32); ctx.stroke(); } };

const fossil: ItemDef = {
  id: 'fossil', name: 'Fossil', world: 'volcano', sizeTier: 8, baseValue: 115, weight: 20,
  draw(ctx, s, c) {
    const slab = c[1] || '#a8a29e';
    const bone = c[0];
    roundRect(ctx, -s * 0.38, -s * 0.28, s * 0.76, s * 0.56, s * 0.08); ctx.fillStyle = slab; ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = s * 0.02;
    roundRect(ctx, -s * 0.38, -s * 0.28, s * 0.76, s * 0.56, s * 0.08); ctx.stroke();
    ctx.fillStyle = bone;
    ctx.beginPath(); ctx.arc(-s * 0.22, 0, s * 0.1, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.22, 0, s * 0.1, 0, Math.PI * 2); ctx.fill();
    roundRect(ctx, -s * 0.22, -s * 0.05, s * 0.44, s * 0.1, s * 0.03); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath(); ctx.arc(-s * 0.22, 0, s * 0.04, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.22, 0, s * 0.04, 0, Math.PI * 2); ctx.fill();
  },
};

const geode: ItemDef = {
  id: 'geode', name: 'Geode', world: 'volcano', sizeTier: 8, baseValue: 130, weight: 25,
  draw(ctx, s, c) {
    const shell = c[1] || '#78716c';
    ctx.fillStyle = shell;
    ctx.beginPath();
    ctx.moveTo(-s * 0.36, s * 0.06);
    ctx.arc(0, s * 0.06, s * 0.36, Math.PI, 0);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = s * 0.02;
    ctx.beginPath(); ctx.arc(0, s * 0.06, s * 0.36, Math.PI, 0); ctx.stroke();
    const faceY = s * 0.06;
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.moveTo(-s * 0.34, faceY); ctx.lineTo(s * 0.34, faceY); ctx.lineTo(0, faceY + s * 0.02); ctx.closePath(); ctx.fill();
    const crystals: [number, number][] = [[-0.22, 0.1], [0, 0.08], [0.18, 0.11], [-0.1, 0.14], [0.12, 0.16], [-0.26, 0.14]];
    for (let i = 0; i < crystals.length; i++) {
      const [cx, cy] = crystals[i];
      ctx.fillStyle = i % 2 === 0 ? c[0] : (c[2] || c[0]);
      ctx.beginPath();
      ctx.moveTo(cx * s, cy * s);
      ctx.lineTo(cx * s - s * 0.05, cy * s + s * 0.12);
      ctx.lineTo(cx * s + s * 0.05, cy * s + s * 0.12);
      ctx.closePath(); ctx.fill();
    }
  },
};

const lava_lamp_item: ItemDef = {
  id: 'lava_lamp_item', name: 'Lava Lamp', world: 'volcano', sizeTier: 8, baseValue: 110, weight: 12,
  draw(ctx, s, c) {
    const outline = c[1] || '#333';
    ctx.strokeStyle = outline; ctx.lineWidth = s * 0.035;
    ctx.beginPath(); ctx.moveTo(-s * 0.14, -s * 0.28); ctx.lineTo(-s * 0.14, s * 0.18); ctx.arc(0, s * 0.18, s * 0.14, Math.PI, 0, true); ctx.lineTo(s * 0.14, -s * 0.28); ctx.stroke();
    ctx.fillStyle = 'rgba(255,200,120,0.15)';
    ctx.beginPath(); ctx.moveTo(-s * 0.12, -s * 0.26); ctx.lineTo(-s * 0.12, s * 0.16); ctx.arc(0, s * 0.16, s * 0.12, Math.PI, 0, true); ctx.lineTo(s * 0.12, -s * 0.26); ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.ellipse(-s * 0.04, -s * 0.05, s * 0.08, s * 0.1, 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(s * 0.05, s * 0.08, s * 0.09, s * 0.07, -0.3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, -s * 0.18, s * 0.07, s * 0.06, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = c[1] || '#444';
    roundRect(ctx, -s * 0.2, s * 0.22, s * 0.4, s * 0.12, s * 0.03); ctx.fill();
    ctx.fillStyle = outline;
    roundRect(ctx, -s * 0.16, s * 0.26, s * 0.32, s * 0.04, s * 0.02); ctx.fill();
  },
};

const dragon_egg: ItemDef = {
  id: 'dragon_egg', name: 'Dragon Egg', world: 'volcano', sizeTier: 8, baseValue: 140, weight: 28,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.ellipse(0, s * 0.02, s * 0.3, s * 0.42, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.beginPath(); ctx.ellipse(-s * 0.1, -s * 0.22, s * 0.12, s * 0.18, -0.4, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = c[1]; ctx.lineWidth = s * 0.018;
    const rows = 5;
    for (let r = 0; r < rows; r++) {
      const yy = -s * 0.32 + r * s * 0.14;
      for (let k = -2; k <= 2; k++) {
        const xx = k * s * 0.14 + (r % 2) * s * 0.07;
        ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx + s * 0.1, yy + s * 0.1); ctx.lineTo(xx, yy + s * 0.2); ctx.lineTo(xx - s * 0.1, yy + s * 0.1); ctx.closePath(); ctx.stroke();
      }
    }
    ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = s * 0.02;
    ctx.beginPath(); ctx.ellipse(0, s * 0.02, s * 0.3, s * 0.42, 0, 0, Math.PI * 2); ctx.stroke();
  },
};

// ─── Visual Enhancement Wrapper ───
// Worlds whose items were individually reworked with explicit gradients,
// outlines and highlights. They only need the drop-shadow pass.
const MANUAL_WORLDS: Set<string> = new Set([
  'crumbs','desk_drawer','pencil_case','lunchbox','toy_box',
  'backpack','bedroom','kitchen','bathroom',
]);

const _fillDesc = Object.getOwnPropertyDescriptor(
  CanvasRenderingContext2D.prototype, 'fillStyle',
)!;

function enhanceItem(item: ItemDef): ItemDef {
  const manual = MANUAL_WORLDS.has(item.world);
  const origDraw = item.draw;
  return {
    ...item,
    draw(ctx, s, c) {
      if (!manual) {
        const paletteSet = new Set(c.filter(Boolean));
        Object.defineProperty(ctx, 'fillStyle', {
          configurable: true, enumerable: true,
          get() { return _fillDesc.get!.call(ctx); },
          set(val: any) {
            if (typeof val === 'string' && paletteSet.has(val)) {
              _fillDesc.set!.call(ctx, itemGradient(ctx, 0, 0, s * 0.4, val));
            } else {
              _fillDesc.set!.call(ctx, val);
            }
          },
        });
      }

      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.18)';
      ctx.shadowBlur = s * 0.06;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = s * 0.03;

      origDraw.call(this, ctx, s, c);

      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      ctx.restore();

      if (!manual) {
        delete (ctx as any).fillStyle;
        itemHighlight(ctx, -s * 0.1, -s * 0.12, s * 0.12, s * 0.08);
      }
    },
  };
}

// ─── Export catalog ───

export const ITEM_CATALOG: ItemDef[] = [
  // Crumbs
  triangle, square, hexagon, diamond, circle, pentagon, cross, crescent, ring, arrow_shape,
  // Desk Drawer
  paperclip, button, coin, marble, dice, screw, candy, eraser, thumbtack, rubber_stamp,
  // Pencil Case
  crayon, ruler, pencilSharpener, rubberBand, sticker, eraserCap, pencil, tape_roll, scissors, protractor,
  // Lunchbox
  sandwich, juiceBox, cookieItem, banana, cheeseSlice, wrapper, grape_bunch, carrot_stick, pretzel, yogurt_cup,
  // Toy Box
  buildingBlock, toyCarItem, actionFigure, teddyBear, yoYo, spinningTop, puzzle_piece, bouncy_ball, toy_train, doll,
  // Backpack
  pen, key, usbDrive, wallet, glasses, remote, apple, mug, water_bottle, headphones_item,
  // Bedroom
  fan, suitcase, pillow, alarmClock, slipper, teddy, nightLamp, hanger, book_stack, plushie,
  // Kitchen
  smallTable, microwave, fridge, plate, fryingPan, rollingPin, whisk, cuttingBoard, spiceJar, oven_mitt,
  // Bathroom
  washingMachine, bathtub, soap, rubberDuck, toothbrush, shampoo, towelRoll, mirrorItem, hair_dryer, loofah,
  // Living Room
  book, lamp, smartphone, pottedPlant, toaster, shoe, basketball, clock, chair, guitar, sofa, piano,
  // Garage
  wrench, tire, paintCan, toolbox, oilCan, bolt, screwdriver_item, hammer_item, flashlight_item, duct_tape,
  // Garden
  flowerPot, wateringCan, gardenGnome, butterflyItem, ladybug, pinecone, snail, leaf_item, mushroom_item, birdhouse,
  // Playground
  jumpRope, chalkStick, sandboxBucket, frisbee, kite, swingSeat, whistle_item, skateboard, water_gun, traffic_cone_small,
  // School
  monitor, printer, desk, bookshelf, globe, chalkboard, backpackBig, lunchTray, schoolBell, pencilCup,
  // Neighborhood
  bicycle, mailbox, bench, hydrant, fencePost, gardenHose, birdBath, sprinkler, dog_house, lawn_mower,
  // Shopping Mall
  shoppingBag, mannequin, shoppingCart, escalatorStep, fountainMall, storeSign, gift_box, hanger_item, perfume_bottle, price_tag,
  // City Park
  tree, streetLamp, pond, swingSet, statue, picnic_basket, soccer_ball, park_fountain, bird_feeder, park_lamp,
  // Construction Site
  craneArm, hardHat, concreteBlock, trafficCone, barrel, steelBeam, shovel_item, caution_sign, wheelbarrow, jackhammer,
  // Downtown
  car, dumpster, trashCan, phoneBooth, parkingMeter, traffic_light_item, newspaper_box, bus_stop_sign, fire_escape_item, hot_dog_cart,
  // Space Station
  satellite, asteroid, spaceFood, astronautGlove, spaceWrench, moonRock, planet, space_helmet, rocket_item, ufo,
  // Candy World
  lollipop, gummyBear, candyCane, cupcake, donutItem, chocolateBar, cotton_candy, ice_cream_cone, jawbreaker, gumball_machine,
  // Deep Ocean
  fishItem, seashell, treasureChest, coralItem, jellyfish, anchorItem, starfish_item, octopus_item, submarine_item, diving_helmet,
  // Volcano
  lavaRock, obsidianShard, rubyItem, magmaDrop, ember, volcanicCrystal, fossil, geode, lava_lamp_item, dragon_egg,
  // ─── NEW WORLDS (24) ───
  // Sewing Kit
  N.thread_spool, N.button_pack, N.sewing_needle, N.thimble, N.yarn_ball, N.pin_cushion, N.ribbon, N.sewing_scissors, N.fabric_scrap, N.zipper,
  // Art Supplies
  N.paint_tube, N.paint_brush, N.palette, N.marker, N.glue_stick, N.glitter_pot, N.watercolor_pan, N.charcoal_stick, N.eraser_putty, N.sketchbook,
  // Snack Drawer
  N.granola_bar, N.fruit_snack, N.mini_chocolate, N.gum_pack, N.raisin_box, N.beef_jerky, N.popcorn_bag, N.trail_mix, N.nut_packet, N.mints_tin,
  // Shoebox
  N.shoelace, N.sock, N.sneaker, N.baseball_cap, N.sunglass_case, N.wristwatch, N.beanie, N.mittens, N.cleat, N.slipper_pair,
  // Pantry
  N.cereal_box, N.soup_can, N.jam_jar, N.pasta_box, N.rice_bag, N.peanut_butter, N.ketchup_bottle, N.oil_can, N.sugar_bag, N.cookie_tin,
  // Laundry Room
  N.laundry_basket, N.detergent_jug, N.dryer_sheet_box, N.iron, N.ironing_board, N.hanger_rack, N.fabric_softener, N.lint_roller, N.clothes_pin, N.washing_bin,
  // Hallway
  N.umbrella_stand, N.coat_rack, N.throw_rug, N.hallway_mirror, N.side_table, N.hallway_lamp, N.doormat_indoor, N.key_dish, N.picture_frame, N.shoe_tray,
  // Driveway
  N.tricycle, N.recycling_bin, N.garbage_can, N.hose_reel, N.planter_box, N.motion_light, N.garden_tool_rack, N.mailbox_post, N.decorative_rock, N.sprinkler_head,
  // Bus Stop
  N.bus_stop_sign, N.bus_bench, N.ticket_machine, N.bike_rack_bs, N.recycling_station, N.ad_poster, N.bus_shelter_pillar, N.lamp_post_bs, N.traffic_sign_bs, N.water_fountain_bs,
  // Skatepark
  N.skate_ramp, N.half_pipe_section, N.bowl_rim, N.grind_rail, N.skate_helmet, N.knee_pad, N.trick_board, N.skate_vending, N.skate_bench, N.energy_drink_crate,
  // Train Yard
  N.rail_car, N.locomotive, N.signal_lamp, N.freight_container, N.coupling, N.water_tower, N.freight_crate, N.gantry_base, N.fuel_tank, N.switching_lever,
  // Cloud Kingdom
  N.cloud_puff, N.sky_castle, N.hot_air_balloon, N.weather_vane, N.lightning_bolt, N.rainbow_arc, N.wind_chime, N.sky_beacon, N.comet_tail, N.cloud_throne,
  // Glacier
  N.ice_block, N.glacial_peak, N.frozen_mammoth, N.igloo, N.polar_pole, N.ice_spire, N.frozen_lake, N.ice_cave, N.snow_drift, N.frozen_geyser,
  // Desert Dunes
  N.sand_dune, N.giant_cactus, N.oasis, N.pyramid, N.sphinx, N.giant_scorpion, N.camel, N.ancient_ruin, N.sandstone_arch, N.mirage_tent,
  // Mountain Range
  N.mountain_peak, N.avalanche, N.ski_lodge, N.giant_eagle, N.boulder_mr, N.mountain_tunnel, N.alpine_lake, N.cliff_face, N.glacier_tongue, N.observatory_mr,
  // Stratosphere
  N.jet_plane, N.weather_balloon, N.low_satellite, N.space_junk, N.ozone_wisp, N.aurora_veil, N.hot_air_pocket, N.strato_capsule, N.lightning_storm, N.contrails_knot,
  // Moon Surface
  N.lunar_crater, N.moon_rover, N.lunar_lander, N.moon_flag, N.lunar_boulder, N.lunar_base, N.regolith_pile, N.moon_dust_cloud, N.lunar_mining_rig, N.abandoned_suit,
  // Red Planet
  N.mars_rover, N.dust_storm, N.polar_ice_cap, N.olympus_mons, N.valles_marineris, N.mars_base, N.alien_fossil, N.terraform_tower, N.red_boulder, N.ancient_artifact,
  // Asteroid Belt
  N.asteroid_chunk, N.mining_drone, N.ice_comet, N.pirate_ship, N.debris_cloud, N.asteroid_beacon, N.mineral_chunk, N.hollow_rock, N.drifting_capsule, N.ore_vein,
  // Solar System
  N.planet_earth, N.planet_venus, N.planet_mars_ss, N.gas_giant, N.sun_spot, N.comet_ss, N.asteroid_cluster, N.dwarf_planet, N.planetary_ring, N.jupiter_storm,
  // Nebula
  N.star_birth, N.gas_cloud, N.pulsar, N.dying_star, N.supernova_fragment, N.dark_matter_wisp, N.ion_stream, N.light_wave, N.cosmic_dust, N.plasma_sphere,
  // Galaxy
  N.spiral_arm, N.star_cluster, N.small_black_hole, N.galactic_core, N.dark_nebula, N.neutron_star, N.quasar, N.galactic_dust, N.dyson_sphere, N.alien_megastructure,
  // Universe Edge
  N.cosmic_web, N.void_bubble, N.antimatter_cluster, N.big_bang_echo, N.cosmic_string, N.universe_filament, N.dark_energy, N.light_bend, N.primordial_atom, N.edge_wall,
  // Multiverse
  N.parallel_earth, N.mirror_universe, N.dimensional_shard, N.divergence_point, N.paradox_knot, N.lost_timeline, N.axis_of_reality, N.infinity_loop, N.omega_artifact, N.multiverse_seed,
].map(enhanceItem);

export const ITEM_LOOKUP: Record<string, ItemDef> = Object.fromEntries(
  ITEM_CATALOG.map(item => [item.id, item])
);

export function getItemsForWorld(world: WorldId): ItemDef[] {
  if (world === 'junkyard') return ITEM_CATALOG.filter(item => item.world !== 'junkyard');
  return ITEM_CATALOG.filter(item => item.world === world);
}
