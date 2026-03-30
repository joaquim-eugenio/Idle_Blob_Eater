export type WorldId = 'crumbs' | 'desk_drawer' | 'pencil_case' | 'lunchbox' | 'toy_box' | 'backpack' | 'bedroom' | 'kitchen' | 'bathroom' | 'living_room' | 'garage' | 'garden' | 'playground' | 'school' | 'neighborhood' | 'shopping_mall' | 'city_park' | 'construction_site' | 'downtown' | 'junkyard' | 'space_station' | 'candy_world' | 'deep_ocean' | 'volcano';

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
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.moveTo(0, -s * 0.5); ctx.lineTo(s * 0.5, s * 0.5); ctx.lineTo(-s * 0.5, s * 0.5); ctx.closePath(); ctx.fill();
  },
};

const square: ItemDef = {
  id: 'square', name: 'Square', world: 'crumbs', sizeTier: 1, baseValue: 2, weight: 1,
  draw(ctx, s, c) {
    ctx.fillStyle = c[1];
    roundRect(ctx, -s*0.4, -s*0.4, s*0.8, s*0.8, s*0.12); ctx.fill();
    ctx.strokeStyle = c[0]; ctx.lineWidth = s*0.06;
    ctx.beginPath(); ctx.moveTo(-s*0.28, -s*0.28); ctx.lineTo(s*0.28, s*0.28); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s*0.28, -s*0.28); ctx.lineTo(-s*0.28, s*0.28); ctx.stroke();
  },
};

const hexagon: ItemDef = {
  id: 'hexagon', name: 'Hexagon', world: 'crumbs', sizeTier: 1, baseValue: 3, weight: 1.2,
  draw(ctx, s, c) {
    ctx.fillStyle = c[2];
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const px = Math.cos(a) * s * 0.5, py = Math.sin(a) * s * 0.5;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath(); ctx.fill();
  },
};

const diamond: ItemDef = {
  id: 'diamond', name: 'Diamond', world: 'crumbs', sizeTier: 1, baseValue: 2, weight: 1,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0];
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.55); ctx.lineTo(s * 0.4, 0); ctx.lineTo(0, s * 0.55); ctx.lineTo(-s * 0.4, 0);
    ctx.closePath(); ctx.fill();
  },
};

const circle: ItemDef = {
  id: 'circle', name: 'Circle', world: 'crumbs', sizeTier: 1, baseValue: 1, weight: 1,
  draw(ctx, s, c) {
    ctx.fillStyle = c[1];
    ctx.beginPath(); ctx.arc(0, 0, s * 0.45, 0, Math.PI * 2); ctx.fill();
  },
};

const pentagon: ItemDef = {
  id: 'pentagon', name: 'Pentagon', world: 'crumbs', sizeTier: 1, baseValue: 2, weight: 1.1,
  draw(ctx, s, c) {
    ctx.fillStyle = c[2];
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      const px = Math.cos(a) * s * 0.48, py = Math.sin(a) * s * 0.48;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath(); ctx.fill();
  },
};

const cross: ItemDef = {
  id: 'cross', name: 'Cross', world: 'crumbs', sizeTier: 1, baseValue: 2, weight: 1,
  draw(ctx, s, c) {
    const t = s * 0.2, h = s * 0.5;
    ctx.fillStyle = c[0];
    ctx.fillRect(-t, -h, t * 2, h * 2);
    ctx.fillRect(-h, -t, h * 2, t * 2);
  },
};

const crescent: ItemDef = {
  id: 'crescent', name: 'Crescent', world: 'crumbs', sizeTier: 1, baseValue: 3, weight: 1.1,
  draw(ctx, s, c) {
    const r = s * 0.45;
    ctx.fillStyle = c[2];
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = c[1] || '#ffffff';
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath(); ctx.arc(r * 0.35, -r * 0.15, r * 0.85, 0, Math.PI * 2); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  },
};

const ring: ItemDef = {
  id: 'ring', name: 'Ring', world: 'crumbs', sizeTier: 1, baseValue: 2, weight: 0.9,
  draw(ctx, s, c) {
    ctx.save();
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.arc(0, 0, s * 0.44, 0, Math.PI * 2); ctx.fill();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath(); ctx.arc(0, 0, s * 0.22, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = c[1] || c[2] || '#000'; ctx.lineWidth = s * 0.035;
    ctx.beginPath(); ctx.arc(0, 0, s * 0.33, 0, Math.PI * 2); ctx.stroke();
  },
};

const arrow_shape: ItemDef = {
  id: 'arrow_shape', name: 'Arrow', world: 'crumbs', sizeTier: 1, baseValue: 3, weight: 1.1,
  draw(ctx, s, c) {
    ctx.fillStyle = c[2];
    ctx.beginPath();
    ctx.moveTo(-s * 0.38, -s * 0.12); ctx.lineTo(0, -s * 0.12); ctx.lineTo(0, -s * 0.3);
    ctx.lineTo(s * 0.42, 0); ctx.lineTo(0, s * 0.3); ctx.lineTo(0, s * 0.12); ctx.lineTo(-s * 0.38, s * 0.12);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = s * 0.04; ctx.stroke();
  },
};

// ─── Desk Drawer ───

const paperclip: ItemDef = {
  id: 'paperclip', name: 'Paperclip', world: 'desk_drawer', sizeTier: 2, baseValue: 4, weight: 1.5,
  draw(ctx, s, c) {
    ctx.strokeStyle = c[0]; ctx.lineWidth = s * 0.08; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-s * 0.15, s * 0.4);
    ctx.lineTo(-s * 0.15, -s * 0.3);
    ctx.arc(0, -s * 0.3, s * 0.15, Math.PI, 0);
    ctx.lineTo(s * 0.15, s * 0.2);
    ctx.arc(0.02, s * 0.2, s * 0.13, 0, Math.PI);
    ctx.lineTo(-s * 0.11, -s * 0.15);
    ctx.stroke();
  },
};

const button: ItemDef = {
  id: 'button', name: 'Button', world: 'desk_drawer', sizeTier: 2, baseValue: 3, weight: 1.3,
  draw(ctx, s, c) {
    ctx.fillStyle = c[1];
    ctx.beginPath(); ctx.arc(0, 0, s * 0.4, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = c[0]; ctx.lineWidth = s * 0.04;
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
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.arc(0, 0, s * 0.4, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = c[1]; ctx.lineWidth = s * 0.04;
    ctx.beginPath(); ctx.arc(0, 0, s * 0.3, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = c[1]; ctx.font = `bold ${s * 0.3}px 'Fredoka', sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('$', 0, 0);
  },
};

const marble: ItemDef = {
  id: 'marble', name: 'Marble', world: 'desk_drawer', sizeTier: 2, baseValue: 4, weight: 2.5,
  draw(ctx, s, c) {
    const r = s * 0.38;
    const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
    grad.addColorStop(0, c[1]); grad.addColorStop(1, c[0]);
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath(); ctx.arc(-r * 0.25, -r * 0.25, r * 0.18, 0, Math.PI * 2); ctx.fill();
  },
};

const dice: ItemDef = {
  id: 'dice', name: 'Dice', world: 'desk_drawer', sizeTier: 2, baseValue: 5, weight: 2,
  draw(ctx, s, c) {
    const h = s * 0.38;
    roundRect(ctx, -h, -h, h * 2, h * 2, s * 0.08);
    ctx.fillStyle = c[0]; ctx.fill();
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
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.arc(0, -s * 0.3, s * 0.15, 0, Math.PI * 2); ctx.fill();
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
    ctx.fillStyle = c[1];
    ctx.beginPath(); ctx.arc(0, 0, s * 0.28, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.arc(0, 0, s * 0.28, 0, Math.PI * 0.5); ctx.lineTo(0, 0); ctx.fill();
    ctx.beginPath(); ctx.arc(0, 0, s * 0.28, Math.PI, Math.PI * 1.5); ctx.lineTo(0, 0); ctx.fill();
    ctx.strokeStyle = c[2] || c[0]; ctx.lineWidth = s * 0.04; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-s * 0.28, 0); ctx.lineTo(-s * 0.45, -s * 0.12); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s * 0.28, 0); ctx.lineTo(s * 0.45, s * 0.12); ctx.stroke();
  },
};

const eraser: ItemDef = {
  id: 'eraser', name: 'Eraser', world: 'desk_drawer', sizeTier: 2, baseValue: 3, weight: 1.5,
  draw(ctx, s, c) {
    roundRect(ctx, -s * 0.35, -s * 0.2, s * 0.7, s * 0.4, s * 0.05);
    ctx.fillStyle = c[0]; ctx.fill();
    ctx.fillStyle = c[1];
    ctx.fillRect(-s * 0.35, -s * 0.2, s * 0.2, s * 0.4);
    ctx.strokeStyle = c[2] || c[1]; ctx.lineWidth = s * 0.02;
    ctx.beginPath(); ctx.moveTo(-s * 0.15, -s * 0.2); ctx.lineTo(-s * 0.15, s * 0.2); ctx.stroke();
  },
};

const thumbtack: ItemDef = {
  id: 'thumbtack', name: 'Thumbtack', world: 'desk_drawer', sizeTier: 2, baseValue: 4, weight: 1.5,
  draw(ctx, s, c) {
    ctx.fillStyle = c[1];
    ctx.beginPath(); ctx.moveTo(0, s * 0.48); ctx.lineTo(-s * 0.09, -s * 0.08); ctx.lineTo(s * 0.09, -s * 0.08); ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.arc(0, -s * 0.18, s * 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = s * 0.025; ctx.stroke();
  },
};

const rubber_stamp: ItemDef = {
  id: 'rubber_stamp', name: 'Rubber Stamp', world: 'desk_drawer', sizeTier: 2, baseValue: 4, weight: 1.7,
  draw(ctx, s, c) {
    ctx.fillStyle = c[1];
    roundRect(ctx, -s * 0.14, -s * 0.44, s * 0.28, s * 0.38, s * 0.05); ctx.fill();
    ctx.fillStyle = c[0];
    roundRect(ctx, -s * 0.36, s * 0.02, s * 0.72, s * 0.28, s * 0.05); ctx.fill();
    ctx.fillStyle = c[2];
    roundRect(ctx, -s * 0.2, s * 0.1, s * 0.4, s * 0.12, s * 0.03); ctx.fill();
  },
};

// ─── Pencil Case ───

const crayon: ItemDef = { id: 'crayon', name: 'Crayon', world: 'pencil_case', sizeTier: 2, baseValue: 4, weight: 1.3,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.fillRect(-s*0.08, -s*0.25, s*0.16, s*0.55); ctx.beginPath(); ctx.moveTo(-s*0.08, -s*0.25); ctx.lineTo(0, -s*0.45); ctx.lineTo(s*0.08, -s*0.25); ctx.closePath(); ctx.fill(); ctx.fillStyle = c[1]; ctx.fillRect(-s*0.08, 0, s*0.16, s*0.15); ctx.strokeStyle = c[2]||'#333'; ctx.lineWidth = s*0.02; ctx.beginPath(); ctx.moveTo(-s*0.08, -s*0.05); ctx.lineTo(s*0.08, -s*0.05); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-s*0.08, s*0.15); ctx.lineTo(s*0.08, s*0.15); ctx.stroke(); } };

const ruler: ItemDef = { id: 'ruler', name: 'Ruler', world: 'pencil_case', sizeTier: 2, baseValue: 3, weight: 1.5,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.fillRect(-s*0.45, -s*0.1, s*0.9, s*0.2); ctx.strokeStyle = c[1]||'#333'; ctx.lineWidth = s*0.02; for (let i = 0; i < 8; i++) { const x = -s*0.38+i*s*0.1; const h = i%2===0 ? s*0.08 : s*0.05; ctx.beginPath(); ctx.moveTo(x, -s*0.1); ctx.lineTo(x, -s*0.1+h); ctx.stroke(); } } };

const pencilSharpener: ItemDef = { id: 'pencil_sharpener', name: 'Pencil Sharpener', world: 'pencil_case', sizeTier: 2, baseValue: 3, weight: 2,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.moveTo(-s*0.25, -s*0.2); ctx.lineTo(s*0.25, -s*0.2); ctx.lineTo(s*0.3, s*0.2); ctx.lineTo(-s*0.3, s*0.2); ctx.closePath(); ctx.fill(); ctx.fillStyle = c[1]||'#333'; ctx.beginPath(); ctx.arc(0, 0, s*0.1, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = c[2]||'#666'; ctx.beginPath(); ctx.arc(0, 0, s*0.05, 0, Math.PI*2); ctx.fill(); } };

const rubberBand: ItemDef = { id: 'rubber_band', name: 'Rubber Band', world: 'pencil_case', sizeTier: 2, baseValue: 2, weight: 0.8,
  draw(ctx, s, c) { ctx.strokeStyle = c[0]; ctx.lineWidth = s*0.06; ctx.beginPath(); ctx.ellipse(0, 0, s*0.35, s*0.2, 0, 0, Math.PI*2); ctx.stroke(); } };

const sticker: ItemDef = { id: 'sticker', name: 'Sticker', world: 'pencil_case', sizeTier: 2, baseValue: 4, weight: 0.5,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0]; ctx.beginPath(); ctx.arc(0, 0, s*0.38, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[1]||'#fff'; ctx.beginPath(); ctx.arc(0, 0, s*0.32, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = c[2]||'#333';
    ctx.beginPath(); ctx.arc(-s*0.1, -s*0.08, s*0.05, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.1, -s*0.08, s*0.05, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = c[2]||'#333'; ctx.lineWidth = s*0.04; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(0, s*0.04, s*0.12, 0.15, Math.PI-0.15); ctx.stroke();
  } };

const eraserCap: ItemDef = { id: 'eraser_cap', name: 'Eraser Cap', world: 'pencil_case', sizeTier: 2, baseValue: 2, weight: 1,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; roundRect(ctx, -s*0.15, -s*0.25, s*0.3, s*0.5, s*0.06); ctx.fill(); ctx.fillStyle = c[1]||'#ddd'; ctx.beginPath(); ctx.ellipse(0, -s*0.25, s*0.15, s*0.06, 0, 0, Math.PI*2); ctx.fill(); } };

const pencil: ItemDef = {
  id: 'pencil', name: 'Pencil', world: 'pencil_case', sizeTier: 2, baseValue: 4, weight: 1.4,
  draw(ctx, s, c) {
    ctx.fillStyle = c[1]; roundRect(ctx, -s * 0.13, -s * 0.5, s * 0.26, s * 0.16, s * 0.05); ctx.fill();
    ctx.fillStyle = '#c9a227'; roundRect(ctx, -s * 0.11, -s * 0.36, s * 0.22, s * 0.08, s * 0.02); ctx.fill();
    ctx.fillStyle = c[0]; ctx.fillRect(-s * 0.1, -s * 0.28, s * 0.2, s * 0.5);
    ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = s * 0.018;
    ctx.beginPath(); ctx.moveTo(-s * 0.1, -s * 0.08); ctx.lineTo(s * 0.1, -s * 0.08); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s * 0.1, s * 0.08); ctx.lineTo(s * 0.1, s * 0.08); ctx.stroke();
    ctx.fillStyle = c[2] || '#333';
    ctx.beginPath(); ctx.moveTo(-s * 0.1, s * 0.22); ctx.lineTo(0, s * 0.48); ctx.lineTo(s * 0.1, s * 0.22); ctx.closePath(); ctx.fill();
  },
};

const tape_roll: ItemDef = {
  id: 'tape_roll', name: 'Tape Roll', world: 'pencil_case', sizeTier: 2, baseValue: 3, weight: 1.2,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0]; ctx.beginPath(); ctx.arc(0, 0, s * 0.4, 0, Math.PI * 2); ctx.fill();
    ctx.save(); ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath(); ctx.arc(0, 0, s * 0.17, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    ctx.strokeStyle = c[1]; ctx.lineWidth = s * 0.045;
    ctx.beginPath(); ctx.arc(0, 0, s * 0.285, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = c[0]; roundRect(ctx, s * 0.26, -s * 0.07, s * 0.2, s * 0.14, s * 0.03); ctx.fill();
  },
};

const scissors: ItemDef = {
  id: 'scissors', name: 'Scissors', world: 'pencil_case', sizeTier: 2, baseValue: 5, weight: 1.9,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0];
    ctx.save(); ctx.rotate(-0.4);
    ctx.beginPath(); ctx.ellipse(-s * 0.02, 0, s * 0.38, s * 0.085, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.save(); ctx.rotate(0.4);
    ctx.beginPath(); ctx.ellipse(s * 0.02, 0, s * 0.38, s * 0.085, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.fillStyle = '#6b7280';
    ctx.beginPath(); ctx.arc(0, 0, s * 0.055, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = c[1];
    ctx.save(); ctx.rotate(-0.4);
    ctx.beginPath(); ctx.ellipse(-s * 0.36, 0, s * 0.1, s * 0.075, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.save(); ctx.rotate(0.4);
    ctx.beginPath(); ctx.ellipse(s * 0.36, 0, s * 0.1, s * 0.075, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  },
};

const protractor: ItemDef = {
  id: 'protractor', name: 'Protractor', world: 'pencil_case', sizeTier: 2, baseValue: 4, weight: 1.5,
  draw(ctx, s, c) {
    const cy = s * 0.1, R = s * 0.42;
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.arc(0, cy, R, Math.PI, 0, false); ctx.lineTo(R, cy); ctx.lineTo(-R, cy); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = c[1]; ctx.lineWidth = s * 0.022;
    ctx.beginPath(); ctx.arc(0, cy, R * 0.92, Math.PI, 0, false); ctx.stroke();
    for (let i = 0; i <= 13; i++) {
      const ang = Math.PI + (i / 13) * Math.PI;
      const big = i % 3 === 0; const r0 = R * (big ? 0.78 : 0.84);
      ctx.beginPath(); ctx.moveTo(Math.cos(ang) * r0, cy + Math.sin(ang) * r0); ctx.lineTo(Math.cos(ang) * R * 0.98, cy + Math.sin(ang) * R * 0.98); ctx.stroke();
    }
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.arc(0, cy, s * 0.04, 0, Math.PI * 2); ctx.fill();
  },
};

// ─── Lunchbox ───

const sandwich: ItemDef = { id: 'sandwich', name: 'Sandwich', world: 'lunchbox', sizeTier: 3, baseValue: 6, weight: 2,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; roundRect(ctx, -s*0.3, -s*0.25, s*0.6, s*0.12, s*0.03); ctx.fill(); ctx.fillStyle = c[1]||'#4ade80'; ctx.fillRect(-s*0.28, -s*0.13, s*0.56, s*0.06); ctx.fillStyle = c[2]||'#f87171'; ctx.fillRect(-s*0.28, -s*0.07, s*0.56, s*0.06); ctx.fillStyle = c[0]; roundRect(ctx, -s*0.3, s*0.01, s*0.6, s*0.12, s*0.03); ctx.fill(); } };

const juiceBox: ItemDef = { id: 'juice_box', name: 'Juice Box', world: 'lunchbox', sizeTier: 3, baseValue: 5, weight: 1.8,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.fillRect(-s*0.18, -s*0.25, s*0.36, s*0.55); ctx.fillStyle = c[1]; ctx.fillRect(-s*0.18, -s*0.25, s*0.36, s*0.15); ctx.strokeStyle = c[2]||'#333'; ctx.lineWidth = s*0.03; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(s*0.05, -s*0.25); ctx.lineTo(s*0.08, -s*0.42); ctx.stroke(); } };

const cookieItem: ItemDef = { id: 'cookie', name: 'Cookie', world: 'lunchbox', sizeTier: 3, baseValue: 5, weight: 1.5,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.arc(0, 0, s*0.35, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = c[1]||'#3b1f0b'; ctx.beginPath(); ctx.arc(-s*0.1, -s*0.1, s*0.05, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(s*0.12, 0, s*0.05, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(-s*0.05, s*0.15, s*0.05, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(s*0.15, -s*0.15, s*0.04, 0, Math.PI*2); ctx.fill(); } };

const banana: ItemDef = { id: 'banana', name: 'Banana', world: 'lunchbox', sizeTier: 3, baseValue: 4, weight: 1.8,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.arc(0, s*0.3, s*0.55, -Math.PI*0.85, -Math.PI*0.15); ctx.arc(0, s*0.3, s*0.42, -Math.PI*0.15, -Math.PI*0.85, true); ctx.closePath(); ctx.fill(); ctx.fillStyle = c[1]||'#5b3a1a'; ctx.beginPath(); ctx.arc(s*0.25, -s*0.15, s*0.03, 0, Math.PI*2); ctx.fill(); } };

const cheeseSlice: ItemDef = { id: 'cheese_slice', name: 'Cheese Slice', world: 'lunchbox', sizeTier: 3, baseValue: 5, weight: 1.2,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.moveTo(0, -s*0.35); ctx.lineTo(s*0.35, s*0.25); ctx.lineTo(-s*0.35, s*0.25); ctx.closePath(); ctx.fill(); ctx.fillStyle = c[1]||'#fff8dc'; ctx.beginPath(); ctx.arc(-s*0.05, s*0.05, s*0.06, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(s*0.1, s*0.15, s*0.05, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(-s*0.12, s*0.18, s*0.04, 0, Math.PI*2); ctx.fill(); } };

const wrapper: ItemDef = { id: 'wrapper', name: 'Wrapper', world: 'lunchbox', sizeTier: 3, baseValue: 3, weight: 0.8,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.moveTo(-s*0.3, -s*0.1); ctx.lineTo(-s*0.15, -s*0.25); ctx.lineTo(s*0.05, -s*0.2); ctx.lineTo(s*0.25, -s*0.3); ctx.lineTo(s*0.3, -s*0.05); ctx.lineTo(s*0.2, s*0.15); ctx.lineTo(s*0.1, s*0.25); ctx.lineTo(-s*0.15, s*0.2); ctx.lineTo(-s*0.3, s*0.1); ctx.closePath(); ctx.fill(); ctx.strokeStyle = c[1]||'#aaa'; ctx.lineWidth = s*0.02; ctx.beginPath(); ctx.moveTo(-s*0.1, -s*0.1); ctx.lineTo(s*0.1, s*0.05); ctx.stroke(); ctx.beginPath(); ctx.moveTo(s*0.05, -s*0.15); ctx.lineTo(-s*0.05, s*0.1); ctx.stroke(); } };

const grape_bunch: ItemDef = {
  id: 'grape_bunch', name: 'Grape Bunch', world: 'lunchbox', sizeTier: 3, baseValue: 5, weight: 1.4,
  draw(ctx, s, c) {
    const stem = c[1] || '#4ade80';
    ctx.strokeStyle = stem; ctx.lineWidth = s * 0.045; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, -s * 0.5); ctx.quadraticCurveTo(s * 0.08, -s * 0.38, 0, -s * 0.28); ctx.stroke();
    ctx.fillStyle = c[0];
    const pts: [number, number][] = [[0, -s * 0.18], [-s * 0.14, s * 0.02], [s * 0.14, s * 0.02], [-s * 0.22, s * 0.22], [0, s * 0.2], [s * 0.22, s * 0.22]];
    for (const [gx, gy] of pts) { ctx.beginPath(); ctx.arc(gx, gy, s * 0.1, 0, Math.PI * 2); ctx.fill(); }
  },
};

const carrot_stick: ItemDef = {
  id: 'carrot_stick', name: 'Carrot Stick', world: 'lunchbox', sizeTier: 3, baseValue: 4, weight: 1.2,
  draw(ctx, s, c) {
    const leaves = c[1] || '#4ade80';
    ctx.fillStyle = leaves;
    for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.ellipse(i * s * 0.14, -s * 0.44, s * 0.07, s * 0.14, i * 0.5, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.moveTo(-s * 0.22, -s * 0.32); ctx.lineTo(s * 0.22, -s * 0.32); ctx.lineTo(s * 0.07, s * 0.42); ctx.lineTo(-s * 0.07, s * 0.42); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = s * 0.025;
    ctx.beginPath(); ctx.moveTo(0, -s * 0.22); ctx.lineTo(0, s * 0.32); ctx.stroke();
  },
};

const pretzel: ItemDef = {
  id: 'pretzel', name: 'Pretzel', world: 'lunchbox', sizeTier: 3, baseValue: 6, weight: 1.8,
  draw(ctx, s, c) {
    ctx.strokeStyle = c[0]; ctx.lineWidth = s * 0.11; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(-s * 0.38, s * 0.08);
    ctx.bezierCurveTo(-s * 0.52, -s * 0.35, -s * 0.12, -s * 0.42, 0, -s * 0.12);
    ctx.bezierCurveTo(s * 0.12, -s * 0.42, s * 0.52, -s * 0.35, s * 0.38, s * 0.08);
    ctx.bezierCurveTo(s * 0.32, s * 0.38, -s * 0.32, s * 0.38, -s * 0.38, s * 0.08);
    ctx.stroke();
    ctx.fillStyle = c[1];
    for (let i = 0; i < 8; i++) { const t = (i / 8) * Math.PI * 2; ctx.beginPath(); ctx.arc(Math.cos(t) * s * 0.28, Math.sin(t) * s * 0.18, s * 0.028, 0, Math.PI * 2); ctx.fill(); }
  },
};

const yogurt_cup: ItemDef = {
  id: 'yogurt_cup', name: 'Yogurt Cup', world: 'lunchbox', sizeTier: 3, baseValue: 5, weight: 1.5,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.moveTo(-s * 0.26, s * 0.28); ctx.lineTo(-s * 0.2, -s * 0.1); ctx.lineTo(s * 0.2, -s * 0.1); ctx.lineTo(s * 0.26, s * 0.28); ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[1]; roundRect(ctx, -s * 0.22, -s * 0.22, s * 0.44, s * 0.12, s * 0.04); ctx.fill();
    const spoon = c[2] || '#888';
    ctx.fillStyle = spoon; ctx.fillRect(s * 0.16, -s * 0.38, s * 0.035, s * 0.28);
    ctx.beginPath(); ctx.ellipse(s * 0.177, -s * 0.4, s * 0.07, s * 0.045, -0.2, 0, Math.PI * 2); ctx.fill();
  },
};

// ─── Toy Box ───

const buildingBlock: ItemDef = { id: 'building_block', name: 'Building Block', world: 'toy_box', sizeTier: 3, baseValue: 6, weight: 2.5,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.fillRect(-s*0.28, -s*0.28, s*0.56, s*0.56); ctx.strokeStyle = c[1]; ctx.lineWidth = s*0.04; ctx.strokeRect(-s*0.28, -s*0.28, s*0.56, s*0.56); ctx.fillStyle = c[1]; ctx.font = `bold ${s*0.35}px 'Fredoka', sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('A', 0, 0); } };

const toyCarItem: ItemDef = { id: 'toy_car', name: 'Toy Car', world: 'toy_box', sizeTier: 3, baseValue: 7, weight: 2,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; roundRect(ctx, -s*0.35, -s*0.05, s*0.7, s*0.2, s*0.04); ctx.fill(); roundRect(ctx, -s*0.18, -s*0.2, s*0.36, s*0.18, s*0.04); ctx.fill(); ctx.fillStyle = c[1]||'#333'; ctx.beginPath(); ctx.arc(-s*0.2, s*0.15, s*0.07, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(s*0.2, s*0.15, s*0.07, 0, Math.PI*2); ctx.fill(); } };

const actionFigure: ItemDef = { id: 'action_figure', name: 'Action Figure', world: 'toy_box', sizeTier: 3, baseValue: 8, weight: 1.5,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.arc(0, -s*0.28, s*0.12, 0, Math.PI*2); ctx.fill(); ctx.strokeStyle = c[0]; ctx.lineWidth = s*0.06; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, -s*0.16); ctx.lineTo(0, s*0.12); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-s*0.2, -s*0.05); ctx.lineTo(s*0.2, -s*0.05); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, s*0.12); ctx.lineTo(-s*0.15, s*0.35); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, s*0.12); ctx.lineTo(s*0.15, s*0.35); ctx.stroke(); } };

const teddyBear: ItemDef = { id: 'teddy_bear', name: 'Teddy Bear', world: 'toy_box', sizeTier: 3, baseValue: 7, weight: 2.5,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.arc(-s*0.15, -s*0.28, s*0.08, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(s*0.15, -s*0.28, s*0.08, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(0, -s*0.18, s*0.18, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(0, s*0.12, s*0.25, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = c[1]||'#333'; ctx.beginPath(); ctx.arc(-s*0.06, -s*0.22, s*0.03, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(s*0.06, -s*0.22, s*0.03, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(0, -s*0.15, s*0.03, 0, Math.PI*2); ctx.fill(); } };

const yoYo: ItemDef = { id: 'yo_yo', name: 'Yo-Yo', world: 'toy_box', sizeTier: 3, baseValue: 5, weight: 2,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.arc(0, 0, s*0.3, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = c[1]; ctx.beginPath(); ctx.arc(0, 0, s*0.15, 0, Math.PI*2); ctx.fill(); ctx.strokeStyle = c[2]||'#333'; ctx.lineWidth = s*0.03; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, -s*0.3); ctx.lineTo(0, -s*0.45); ctx.stroke(); } };

const spinningTop: ItemDef = { id: 'spinning_top', name: 'Spinning Top', world: 'toy_box', sizeTier: 3, baseValue: 6, weight: 2,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.moveTo(-s*0.25, -s*0.1); ctx.lineTo(s*0.25, -s*0.1); ctx.lineTo(0, s*0.4); ctx.closePath(); ctx.fill(); ctx.fillStyle = c[1]; ctx.beginPath(); ctx.ellipse(0, -s*0.1, s*0.25, s*0.08, 0, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = c[2]||c[0]; ctx.fillRect(-s*0.03, -s*0.3, s*0.06, s*0.2); } };

const puzzle_piece: ItemDef = {
  id: 'puzzle_piece', name: 'Puzzle Piece', world: 'toy_box', sizeTier: 3, baseValue: 6, weight: 2,
  draw(ctx, s, c) {
    const u = s * 0.3, tabR = u * 0.38, sockR = u * 0.32;
    ctx.fillStyle = c[0]; ctx.beginPath();
    ctx.moveTo(-u, u); ctx.lineTo(-u, -u); ctx.lineTo(-tabR, -u);
    ctx.arc(0, -u, tabR, Math.PI, 0, false); ctx.lineTo(u, -u);
    ctx.lineTo(u, -sockR); ctx.arc(u - sockR, 0, sockR, -Math.PI / 2, Math.PI / 2, false);
    ctx.lineTo(u, sockR); ctx.lineTo(u, u); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.22)'; ctx.lineWidth = s * 0.025; ctx.stroke();
  },
};

const bouncy_ball: ItemDef = {
  id: 'bouncy_ball', name: 'Bouncy Ball', world: 'toy_box', sizeTier: 3, baseValue: 7, weight: 2.1,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0]; ctx.beginPath(); ctx.arc(0, 0, s * 0.44, 0, Math.PI * 2); ctx.fill();
    ctx.save(); ctx.strokeStyle = c[1]; ctx.lineWidth = s * 0.09; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(0, 0, s * 0.32, -0.45, Math.PI + 0.45); ctx.stroke(); ctx.restore();
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.beginPath(); ctx.ellipse(-s * 0.16, -s * 0.2, s * 0.1, s * 0.07, -0.4, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = s * 0.025;
    ctx.beginPath(); ctx.arc(0, 0, s * 0.44, 0, Math.PI * 2); ctx.stroke();
  },
};

const toy_train: ItemDef = {
  id: 'toy_train', name: 'Toy Train', world: 'toy_box', sizeTier: 3, baseValue: 8, weight: 2.3,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0]; roundRect(ctx, -s * 0.42, -s * 0.06, s * 0.52, s * 0.24, s * 0.04); ctx.fill();
    ctx.fillStyle = c[2]; roundRect(ctx, -s * 0.06, -s * 0.34, s * 0.12, s * 0.22, s * 0.03); ctx.fill();
    ctx.fillRect(-s * 0.02, -s * 0.4, s * 0.04, s * 0.08);
    ctx.fillStyle = c[0]; roundRect(ctx, s * 0.12, -s * 0.12, s * 0.32, s * 0.2, s * 0.04); ctx.fill();
    ctx.fillStyle = c[1];
    ctx.beginPath(); ctx.arc(-s * 0.24, s * 0.2, s * 0.09, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.02, s * 0.2, s * 0.09, 0, Math.PI * 2); ctx.fill();
  },
};

const doll: ItemDef = {
  id: 'doll', name: 'Doll', world: 'toy_box', sizeTier: 3, baseValue: 5, weight: 1.9,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.moveTo(0, -s * 0.02); ctx.lineTo(-s * 0.28, s * 0.44); ctx.lineTo(s * 0.28, s * 0.44); ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[1] || '#f5deb3';
    ctx.beginPath(); ctx.arc(0, -s * 0.28, s * 0.15, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = c[2];
    for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.arc(i * s * 0.07, -s * 0.38, s * 0.045, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = '#1f2937';
    ctx.beginPath(); ctx.arc(-s * 0.05, -s * 0.3, s * 0.018, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.05, -s * 0.3, s * 0.018, 0, Math.PI * 2); ctx.fill();
  },
};

// ─── Backpack ───

const pen: ItemDef = {
  id: 'pen', name: 'Pen', world: 'backpack', sizeTier: 3, baseValue: 7, weight: 2,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0];
    ctx.fillRect(-s * 0.06, -s * 0.45, s * 0.12, s * 0.7);
    ctx.fillStyle = c[1];
    ctx.fillRect(-s * 0.06, -s * 0.45, s * 0.12, s * 0.12);
    ctx.fillStyle = c[2] || '#333';
    ctx.beginPath();
    ctx.moveTo(-s * 0.06, s * 0.25); ctx.lineTo(s * 0.06, s * 0.25); ctx.lineTo(0, s * 0.45);
    ctx.closePath(); ctx.fill();
  },
};

const key: ItemDef = {
  id: 'key', name: 'Key', world: 'backpack', sizeTier: 3, baseValue: 8, weight: 3,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.arc(0, -s * 0.25, s * 0.18, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = c[1] || c[0];
    ctx.beginPath(); ctx.arc(0, -s * 0.25, s * 0.1, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = c[0];
    ctx.fillRect(-s * 0.05, -s * 0.1, s * 0.1, s * 0.48);
    ctx.fillRect(s * 0.05, s * 0.2, s * 0.12, s * 0.06);
    ctx.fillRect(s * 0.05, s * 0.08, s * 0.08, s * 0.06);
  },
};

const usbDrive: ItemDef = {
  id: 'usb_drive', name: 'USB Drive', world: 'backpack', sizeTier: 3, baseValue: 7, weight: 1.8,
  draw(ctx, s, c) {
    roundRect(ctx, -s * 0.15, -s * 0.35, s * 0.3, s * 0.55, s * 0.04);
    ctx.fillStyle = c[0]; ctx.fill();
    ctx.fillStyle = c[1];
    ctx.fillRect(-s * 0.1, s * 0.2, s * 0.2, s * 0.2);
    ctx.fillStyle = c[2] || '#fff';
    ctx.fillRect(-s * 0.06, -s * 0.2, s * 0.12, s * 0.08);
  },
};

const wallet: ItemDef = {
  id: 'wallet', name: 'Wallet', world: 'backpack', sizeTier: 3, baseValue: 10, weight: 2.5,
  draw(ctx, s, c) {
    roundRect(ctx, -s * 0.35, -s * 0.28, s * 0.7, s * 0.56, s * 0.06);
    ctx.fillStyle = c[0]; ctx.fill();
    ctx.strokeStyle = c[1]; ctx.lineWidth = s * 0.03;
    ctx.beginPath(); ctx.moveTo(-s * 0.35, -s * 0.05); ctx.lineTo(s * 0.35, -s * 0.05); ctx.stroke();
    ctx.fillStyle = c[1];
    roundRect(ctx, s * 0.05, -s * 0.2, s * 0.22, s * 0.1, s * 0.02);
    ctx.fill();
  },
};

const glasses: ItemDef = {
  id: 'glasses', name: 'Glasses', world: 'backpack', sizeTier: 3, baseValue: 9, weight: 1.5,
  draw(ctx, s, c) {
    ctx.strokeStyle = c[0]; ctx.lineWidth = s * 0.05; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(-s * 0.2, 0, s * 0.18, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(s * 0.2, 0, s * 0.18, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s * 0.02, 0); ctx.lineTo(s * 0.02, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s * 0.38, -s * 0.04); ctx.lineTo(-s * 0.48, -s * 0.08); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s * 0.38, -s * 0.04); ctx.lineTo(s * 0.48, -s * 0.08); ctx.stroke();
  },
};

const remote: ItemDef = {
  id: 'remote', name: 'Remote', world: 'backpack', sizeTier: 3, baseValue: 8, weight: 2.2,
  draw(ctx, s, c) {
    roundRect(ctx, -s * 0.14, -s * 0.42, s * 0.28, s * 0.84, s * 0.06);
    ctx.fillStyle = c[0]; ctx.fill();
    ctx.fillStyle = c[1];
    ctx.beginPath(); ctx.arc(0, -s * 0.24, s * 0.06, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = c[2] || '#444';
    const bw = s * 0.06, bh = s * 0.05;
    ctx.fillRect(-bw, -s * 0.05, bw * 2, bh);
    ctx.fillRect(-bw, s * 0.05, bw * 2, bh);
    ctx.fillRect(-bw, s * 0.15, bw * 2, bh);
  },
};

const apple: ItemDef = {
  id: 'apple', name: 'Apple', world: 'backpack', sizeTier: 3, baseValue: 6, weight: 2.8,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.arc(-s * 0.08, s * 0.05, s * 0.32, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.08, s * 0.05, s * 0.32, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = c[1] || '#5b3a1a';
    ctx.fillRect(-s * 0.025, -s * 0.35, s * 0.05, s * 0.18);
    ctx.fillStyle = c[2] || '#4ade80';
    ctx.beginPath();
    ctx.moveTo(s * 0.02, -s * 0.28); ctx.quadraticCurveTo(s * 0.18, -s * 0.42, s * 0.12, -s * 0.2);
    ctx.fill();
  },
};

const mug: ItemDef = {
  id: 'mug', name: 'Mug', world: 'backpack', sizeTier: 3, baseValue: 9, weight: 3.5,
  draw(ctx, s, c) {
    roundRect(ctx, -s * 0.25, -s * 0.3, s * 0.45, s * 0.6, s * 0.06);
    ctx.fillStyle = c[0]; ctx.fill();
    ctx.strokeStyle = c[1]; ctx.lineWidth = s * 0.05;
    ctx.beginPath();
    ctx.arc(s * 0.25, 0, s * 0.14, -Math.PI * 0.4, Math.PI * 0.4);
    ctx.stroke();
    ctx.fillStyle = c[2] || '#8B4513';
    ctx.beginPath(); ctx.ellipse(0, -s * 0.3, s * 0.22, s * 0.06, 0, 0, Math.PI * 2); ctx.fill();
  },
};

const water_bottle: ItemDef = {
  id: 'water_bottle', name: 'Water Bottle', world: 'backpack', sizeTier: 3, baseValue: 8, weight: 2.5,
  draw(ctx, s, c) {
    ctx.fillStyle = c[1]; roundRect(ctx, -s * 0.13, -s * 0.46, s * 0.26, s * 0.12, s * 0.04); ctx.fill();
    ctx.fillStyle = c[0]; roundRect(ctx, -s * 0.18, -s * 0.32, s * 0.36, s * 0.62, s * 0.14); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = s * 0.04;
    ctx.beginPath(); ctx.moveTo(s * 0.12, -s * 0.18); ctx.lineTo(s * 0.12, s * 0.22); ctx.stroke();
    ctx.fillStyle = c[2]; roundRect(ctx, -s * 0.15, -s * 0.02, s * 0.3, s * 0.12, s * 0.03); ctx.fill();
  },
};

const headphones_item: ItemDef = {
  id: 'headphones_item', name: 'Headphones', world: 'backpack', sizeTier: 3, baseValue: 10, weight: 2.8,
  draw(ctx, s, c) {
    ctx.strokeStyle = c[0]; ctx.lineWidth = s * 0.095; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-s * 0.46, s * 0.06); ctx.quadraticCurveTo(0, -s * 0.44, s * 0.46, s * 0.06); ctx.stroke();
    ctx.fillStyle = c[1];
    ctx.beginPath(); ctx.arc(-s * 0.46, s * 0.1, s * 0.17, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.46, s * 0.1, s * 0.17, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = s * 0.04; ctx.stroke();
  },
};

// ─── Bedroom ───

const fan: ItemDef = {
  id: 'fan', name: 'Fan', world: 'bedroom', sizeTier: 5, baseValue: 25, weight: 6,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.arc(0, -s * 0.05, s * 0.35, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = c[1]; ctx.lineWidth = s * 0.03;
    ctx.beginPath(); ctx.arc(0, -s * 0.05, s * 0.35, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = c[1];
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2 - Math.PI / 2;
      ctx.beginPath();
      ctx.ellipse(Math.cos(a) * s * 0.16, -s * 0.05 + Math.sin(a) * s * 0.16, s * 0.2, s * 0.08, a, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = c[2] || c[0];
    ctx.fillRect(-s * 0.03, s * 0.3, s * 0.06, s * 0.12);
    roundRect(ctx, -s * 0.12, s * 0.42, s * 0.24, s * 0.04, s * 0.01);
    ctx.fill();
  },
};

const suitcase: ItemDef = {
  id: 'suitcase', name: 'Suitcase', world: 'bedroom', sizeTier: 5, baseValue: 33, weight: 9,
  draw(ctx, s, c) {
    roundRect(ctx, -s * 0.35, -s * 0.28, s * 0.7, s * 0.56, s * 0.05);
    ctx.fillStyle = c[0]; ctx.fill();
    ctx.strokeStyle = c[1]; ctx.lineWidth = s * 0.03;
    ctx.beginPath(); ctx.moveTo(-s * 0.35, 0); ctx.lineTo(s * 0.35, 0); ctx.stroke();
    ctx.fillStyle = c[1];
    roundRect(ctx, -s * 0.15, -s * 0.38, s * 0.3, s * 0.1, s * 0.03);
    ctx.fill();
    ctx.fillStyle = c[2] || '#ccc';
    ctx.fillRect(-s * 0.05, -s * 0.05, s * 0.1, s * 0.06);
  },
};

const pillow: ItemDef = { id: 'pillow', name: 'Pillow', world: 'bedroom', sizeTier: 4, baseValue: 12, weight: 3,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; roundRect(ctx, -s*0.35, -s*0.22, s*0.7, s*0.44, s*0.15); ctx.fill(); ctx.strokeStyle = c[1]||'#ddd'; ctx.lineWidth = s*0.02; ctx.beginPath(); ctx.moveTo(-s*0.15, -s*0.22); ctx.quadraticCurveTo(-s*0.15, 0, -s*0.15, s*0.22); ctx.stroke(); ctx.beginPath(); ctx.moveTo(s*0.15, -s*0.22); ctx.quadraticCurveTo(s*0.15, 0, s*0.15, s*0.22); ctx.stroke(); } };

const alarmClock: ItemDef = { id: 'alarm_clock', name: 'Alarm Clock', world: 'bedroom', sizeTier: 4, baseValue: 14, weight: 3.5,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.arc(-s*0.18, -s*0.3, s*0.1, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(s*0.18, -s*0.3, s*0.1, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(0, 0, s*0.3, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = c[1]||'#fff'; ctx.beginPath(); ctx.arc(0, 0, s*0.24, 0, Math.PI*2); ctx.fill(); ctx.strokeStyle = c[2]||'#333'; ctx.lineWidth = s*0.03; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -s*0.16); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(s*0.1, s*0.04); ctx.stroke(); } };

const slipper: ItemDef = { id: 'slipper', name: 'Slipper', world: 'bedroom', sizeTier: 4, baseValue: 10, weight: 2.5,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.moveTo(-s*0.3, s*0.1); ctx.quadraticCurveTo(-s*0.3, -s*0.2, 0, -s*0.25); ctx.quadraticCurveTo(s*0.3, -s*0.2, s*0.35, 0); ctx.quadraticCurveTo(s*0.35, s*0.2, s*0.15, s*0.2); ctx.lineTo(-s*0.2, s*0.2); ctx.quadraticCurveTo(-s*0.35, s*0.2, -s*0.3, s*0.1); ctx.closePath(); ctx.fill(); ctx.fillStyle = c[1]; ctx.beginPath(); ctx.arc(0, -s*0.05, s*0.18, Math.PI, 0); ctx.closePath(); ctx.fill(); } };

const teddy: ItemDef = { id: 'teddy', name: 'Teddy', world: 'bedroom', sizeTier: 4, baseValue: 13, weight: 3,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.arc(-s*0.17, -s*0.3, s*0.1, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(s*0.17, -s*0.3, s*0.1, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(0, -s*0.15, s*0.22, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(0, s*0.18, s*0.28, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = c[1]||'#333'; ctx.beginPath(); ctx.arc(-s*0.08, -s*0.2, s*0.03, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(s*0.08, -s*0.2, s*0.03, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = c[2]||'#ff6b6b'; ctx.beginPath(); ctx.arc(0, -s*0.12, s*0.04, 0, Math.PI*2); ctx.fill(); } };

const nightLamp: ItemDef = { id: 'night_lamp', name: 'Night Lamp', world: 'bedroom', sizeTier: 4, baseValue: 15, weight: 4,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.moveTo(-s*0.25, s*0.05); ctx.lineTo(-s*0.1, -s*0.3); ctx.lineTo(s*0.1, -s*0.3); ctx.lineTo(s*0.25, s*0.05); ctx.closePath(); ctx.fill(); ctx.fillStyle = c[1]||'#666'; ctx.fillRect(-s*0.03, s*0.05, s*0.06, s*0.22); ctx.fillStyle = c[2]||'#888'; roundRect(ctx, -s*0.12, s*0.27, s*0.24, s*0.05, s*0.02); ctx.fill(); } };

const hanger: ItemDef = { id: 'hanger', name: 'Hanger', world: 'bedroom', sizeTier: 4, baseValue: 9, weight: 2,
  draw(ctx, s, c) { ctx.strokeStyle = c[0]; ctx.lineWidth = s*0.05; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, -s*0.3, s*0.08, Math.PI, 0); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, -s*0.22); ctx.lineTo(-s*0.35, s*0.15); ctx.lineTo(s*0.35, s*0.15); ctx.closePath(); ctx.stroke(); } };

const book_stack: ItemDef = {
  id: 'book_stack', name: 'Book Stack', world: 'bedroom', sizeTier: 4, baseValue: 12, weight: 3.2,
  draw(ctx, s, c) {
    ctx.fillStyle = c[2]; ctx.fillRect(-s * 0.36, s * 0.02, s * 0.76, s * 0.12);
    ctx.fillStyle = c[1]; ctx.fillRect(-s * 0.33, -s * 0.1, s * 0.64, s * 0.12);
    ctx.fillStyle = c[0]; ctx.fillRect(-s * 0.27, -s * 0.22, s * 0.48, s * 0.12);
  },
};

const plushie: ItemDef = {
  id: 'plushie', name: 'Plushie', world: 'bedroom', sizeTier: 4, baseValue: 13, weight: 3.5,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.arc(-s * 0.3, -s * 0.02, s * 0.1, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.3, -s * 0.02, s * 0.1, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, s * 0.06, s * 0.32, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = c[1];
    ctx.beginPath(); ctx.arc(-s * 0.1, -s * 0.08, s * 0.04, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.1, -s * 0.08, s * 0.04, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = c[2] || c[0]; ctx.lineWidth = s * 0.025; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(0, s * 0.02, s * 0.1, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
  },
};

// ─── Kitchen ───

const smallTable: ItemDef = {
  id: 'small_table', name: 'Small Table', world: 'kitchen', sizeTier: 5, baseValue: 32, weight: 10,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0];
    roundRect(ctx, -s * 0.4, -s * 0.32, s * 0.8, s * 0.08, s * 0.02);
    ctx.fill();
    ctx.fillStyle = c[1] || c[0];
    ctx.fillRect(-s * 0.34, -s * 0.24, s * 0.06, s * 0.6);
    ctx.fillRect(s * 0.28, -s * 0.24, s * 0.06, s * 0.6);
  },
};

const microwave: ItemDef = {
  id: 'microwave', name: 'Microwave', world: 'kitchen', sizeTier: 5, baseValue: 28, weight: 11,
  draw(ctx, s, c) {
    roundRect(ctx, -s * 0.4, -s * 0.25, s * 0.8, s * 0.5, s * 0.04);
    ctx.fillStyle = c[0]; ctx.fill();
    ctx.fillStyle = c[1] || '#222';
    ctx.fillRect(-s * 0.35, -s * 0.2, s * 0.5, s * 0.4);
    ctx.fillStyle = c[2] || '#888';
    ctx.beginPath(); ctx.arc(s * 0.28, -s * 0.05, s * 0.04, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(s * 0.24, s * 0.06, s * 0.08, s * 0.03);
    ctx.fillRect(s * 0.24, s * 0.12, s * 0.08, s * 0.03);
  },
};

const fridge: ItemDef = {
  id: 'fridge', name: 'Fridge', world: 'kitchen', sizeTier: 6, baseValue: 62, weight: 22,
  draw(ctx, s, c) {
    roundRect(ctx, -s * 0.28, -s * 0.45, s * 0.56, s * 0.9, s * 0.04);
    ctx.fillStyle = c[0]; ctx.fill();
    ctx.strokeStyle = c[1]; ctx.lineWidth = s * 0.02;
    ctx.beginPath(); ctx.moveTo(-s * 0.28, -s * 0.1); ctx.lineTo(s * 0.28, -s * 0.1); ctx.stroke();
    ctx.fillStyle = c[2] || '#888';
    ctx.fillRect(s * 0.16, -s * 0.35, s * 0.04, s * 0.18);
    ctx.fillRect(s * 0.16, s * 0.0, s * 0.04, s * 0.25);
  },
};

const plate: ItemDef = { id: 'plate', name: 'Plate', world: 'kitchen', sizeTier: 4, baseValue: 13, weight: 4,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.arc(0, 0, s*0.4, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = c[1]||'#fff'; ctx.beginPath(); ctx.arc(0, 0, s*0.3, 0, Math.PI*2); ctx.fill(); ctx.strokeStyle = c[2]||'#ddd'; ctx.lineWidth = s*0.02; ctx.beginPath(); ctx.arc(0, 0, s*0.25, 0, Math.PI*2); ctx.stroke(); } };

const fryingPan: ItemDef = { id: 'frying_pan', name: 'Frying Pan', world: 'kitchen', sizeTier: 4, baseValue: 16, weight: 5,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.arc(0, 0, s*0.3, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = c[1]||'#555'; ctx.beginPath(); ctx.arc(0, 0, s*0.25, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = c[0]; roundRect(ctx, s*0.25, -s*0.05, s*0.25, s*0.1, s*0.03); ctx.fill(); } };

const rollingPin: ItemDef = { id: 'rolling_pin', name: 'Rolling Pin', world: 'kitchen', sizeTier: 4, baseValue: 12, weight: 4.5,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; roundRect(ctx, -s*0.3, -s*0.1, s*0.6, s*0.2, s*0.1); ctx.fill(); ctx.fillStyle = c[1]||'#666'; ctx.fillRect(-s*0.42, -s*0.05, s*0.14, s*0.1); ctx.fillRect(s*0.28, -s*0.05, s*0.14, s*0.1); } };

const whisk: ItemDef = { id: 'whisk', name: 'Whisk', world: 'kitchen', sizeTier: 4, baseValue: 11, weight: 3,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.fillRect(-s*0.04, s*0.05, s*0.08, s*0.35); ctx.strokeStyle = c[1]||'#999'; ctx.lineWidth = s*0.025; ctx.lineCap = 'round'; for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i*s*0.04, s*0.05); ctx.quadraticCurveTo(i*s*0.1, -s*0.2, 0, -s*0.4); ctx.stroke(); } } };

const cuttingBoard: ItemDef = { id: 'cutting_board', name: 'Cutting Board', world: 'kitchen', sizeTier: 4, baseValue: 14, weight: 5,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; roundRect(ctx, -s*0.25, -s*0.35, s*0.5, s*0.75, s*0.06); ctx.fill(); ctx.fillStyle = c[1]||'rgba(0,0,0,0.1)'; ctx.beginPath(); ctx.arc(0, s*0.28, s*0.06, 0, Math.PI*2); ctx.fill(); } };

const spiceJar: ItemDef = { id: 'spice_jar', name: 'Spice Jar', world: 'kitchen', sizeTier: 4, baseValue: 10, weight: 3.5,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; roundRect(ctx, -s*0.15, -s*0.15, s*0.3, s*0.45, s*0.04); ctx.fill(); ctx.fillStyle = c[1]; ctx.fillRect(-s*0.17, -s*0.25, s*0.34, s*0.12); ctx.fillStyle = c[2]||'#fff'; ctx.fillRect(-s*0.1, 0, s*0.2, s*0.12); } };

const oven_mitt: ItemDef = {
  id: 'oven_mitt', name: 'Oven Mitt', world: 'kitchen', sizeTier: 4, baseValue: 12, weight: 3.8,
  draw(ctx, s, c) {
    roundRect(ctx, -s * 0.22, -s * 0.28, s * 0.38, s * 0.52, s * 0.1);
    ctx.fillStyle = c[0]; ctx.fill();
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.arc(s * 0.18, -s * 0.12, s * 0.12, -Math.PI * 0.4, Math.PI * 0.5); ctx.lineTo(s * 0.28, s * 0.08); ctx.quadraticCurveTo(s * 0.22, s * 0.12, s * 0.12, s * 0.06); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = c[1]; ctx.lineWidth = s * 0.02; ctx.lineCap = 'round';
    for (let i = -2; i <= 2; i++) { const o = i * s * 0.08; ctx.beginPath(); ctx.moveTo(-s * 0.18 + o, -s * 0.22); ctx.lineTo(s * 0.12 + o, s * 0.18); ctx.stroke(); }
    for (let i = -2; i <= 2; i++) { const o = i * s * 0.08; ctx.beginPath(); ctx.moveTo(-s * 0.12 + o, s * 0.18); ctx.lineTo(s * 0.18 + o, -s * 0.22); ctx.stroke(); }
  },
};

// ─── Bathroom ───

const washingMachine: ItemDef = {
  id: 'washing_machine', name: 'Washing Machine', world: 'bathroom', sizeTier: 6, baseValue: 55, weight: 25,
  draw(ctx, s, c) {
    roundRect(ctx, -s * 0.35, -s * 0.38, s * 0.7, s * 0.76, s * 0.04);
    ctx.fillStyle = c[0]; ctx.fill();
    ctx.fillStyle = c[1] || '#ddd';
    ctx.fillRect(-s * 0.32, -s * 0.35, s * 0.64, s * 0.15);
    ctx.fillStyle = c[2] || '#333';
    ctx.beginPath(); ctx.arc(0, s * 0.08, s * 0.22, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = c[1] || '#aaa';
    ctx.beginPath(); ctx.arc(0, s * 0.08, s * 0.17, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = c[0];
    ctx.beginPath(); ctx.arc(s * 0.18, -s * 0.28, s * 0.04, 0, Math.PI * 2); ctx.fill();
  },
};

const bathtub: ItemDef = {
  id: 'bathtub', name: 'Bathtub', world: 'bathroom', sizeTier: 6, baseValue: 58, weight: 28,
  draw(ctx, s, c) {
    ctx.fillStyle = c[0];
    ctx.beginPath();
    ctx.moveTo(-s * 0.45, -s * 0.1);
    ctx.quadraticCurveTo(-s * 0.45, s * 0.3, -s * 0.25, s * 0.3);
    ctx.lineTo(s * 0.25, s * 0.3);
    ctx.quadraticCurveTo(s * 0.45, s * 0.3, s * 0.45, -s * 0.1);
    ctx.lineTo(-s * 0.45, -s * 0.1);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[1] || '#bde';
    ctx.beginPath();
    ctx.moveTo(-s * 0.38, -s * 0.1);
    ctx.quadraticCurveTo(-s * 0.38, s * 0.22, -s * 0.2, s * 0.22);
    ctx.lineTo(s * 0.2, s * 0.22);
    ctx.quadraticCurveTo(s * 0.38, s * 0.22, s * 0.38, -s * 0.1);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = c[2] || '#888';
    ctx.fillRect(-s * 0.42, s * 0.28, s * 0.08, s * 0.1);
    ctx.fillRect(s * 0.34, s * 0.28, s * 0.08, s * 0.1);
  },
};

const soap: ItemDef = { id: 'soap', name: 'Soap', world: 'bathroom', sizeTier: 4, baseValue: 10, weight: 2.5,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.ellipse(0, 0, s*0.3, s*0.2, 0, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = c[1]||'rgba(255,255,255,0.6)'; ctx.beginPath(); ctx.arc(-s*0.15, -s*0.2, s*0.06, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(s*0.05, -s*0.25, s*0.04, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(s*0.18, -s*0.18, s*0.05, 0, Math.PI*2); ctx.fill(); } };

const rubberDuck: ItemDef = { id: 'rubber_duck', name: 'Rubber Duck', world: 'bathroom', sizeTier: 4, baseValue: 12, weight: 2,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.arc(0, s*0.05, s*0.28, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(-s*0.15, -s*0.2, s*0.16, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = c[1]||'#e67e22'; ctx.beginPath(); ctx.moveTo(-s*0.3, -s*0.22); ctx.lineTo(-s*0.42, -s*0.18); ctx.lineTo(-s*0.3, -s*0.15); ctx.closePath(); ctx.fill(); ctx.fillStyle = c[2]||'#333'; ctx.beginPath(); ctx.arc(-s*0.2, -s*0.25, s*0.03, 0, Math.PI*2); ctx.fill(); } };

const toothbrush: ItemDef = { id: 'toothbrush', name: 'Toothbrush', world: 'bathroom', sizeTier: 4, baseValue: 9, weight: 1.5,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; roundRect(ctx, -s*0.05, -s*0.15, s*0.1, s*0.6, s*0.03); ctx.fill(); ctx.fillStyle = c[1]; roundRect(ctx, -s*0.08, -s*0.4, s*0.16, s*0.25, s*0.04); ctx.fill(); ctx.fillStyle = c[2]||'#fff'; for (let i = 0; i < 3; i++) { ctx.fillRect(-s*0.05, -s*0.36+i*s*0.07, s*0.1, s*0.04); } } };

const shampoo: ItemDef = { id: 'shampoo', name: 'Shampoo', world: 'bathroom', sizeTier: 4, baseValue: 11, weight: 3,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; roundRect(ctx, -s*0.18, -s*0.15, s*0.36, s*0.55, s*0.05); ctx.fill(); ctx.fillStyle = c[1]||c[0]; roundRect(ctx, -s*0.1, -s*0.35, s*0.2, s*0.22, s*0.06); ctx.fill(); ctx.fillStyle = c[2]||'#fff'; ctx.fillRect(-s*0.12, 0, s*0.24, s*0.1); } };

const towelRoll: ItemDef = { id: 'towel_roll', name: 'Towel Roll', world: 'bathroom', sizeTier: 4, baseValue: 13, weight: 4,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.fillRect(-s*0.3, -s*0.2, s*0.6, s*0.4); ctx.fillStyle = c[1]||'#eee'; ctx.beginPath(); ctx.ellipse(-s*0.3, 0, s*0.08, s*0.2, 0, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.ellipse(s*0.3, 0, s*0.08, s*0.2, 0, 0, Math.PI*2); ctx.fill(); ctx.strokeStyle = c[2]||'#ccc'; ctx.lineWidth = s*0.01; ctx.beginPath(); ctx.moveTo(-s*0.3, -s*0.08); ctx.lineTo(s*0.3, -s*0.08); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-s*0.3, s*0.08); ctx.lineTo(s*0.3, s*0.08); ctx.stroke(); } };

const mirrorItem: ItemDef = { id: 'mirror_item', name: 'Mirror', world: 'bathroom', sizeTier: 4, baseValue: 15, weight: 3.5,
  draw(ctx, s, c) { ctx.fillStyle = c[0]; ctx.beginPath(); ctx.ellipse(0, 0, s*0.3, s*0.4, 0, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = c[1]||'#d4f1f9'; ctx.beginPath(); ctx.ellipse(0, 0, s*0.24, s*0.34, 0, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.beginPath(); ctx.ellipse(-s*0.08, -s*0.1, s*0.08, s*0.15, -0.3, 0, Math.PI*2); ctx.fill(); } };

const hair_dryer: ItemDef = {
  id: 'hair_dryer', name: 'Hair Dryer', world: 'bathroom', sizeTier: 4, baseValue: 11, weight: 2.8,
  draw(ctx, s, c) {
    ctx.save(); ctx.rotate(-0.35);
    ctx.fillStyle = c[0]; roundRect(ctx, -s * 0.08, -s * 0.35, s * 0.42, s * 0.22, s * 0.04); ctx.fill();
    ctx.fillStyle = c[1];
    ctx.beginPath(); ctx.moveTo(s * 0.34, -s * 0.28); ctx.lineTo(s * 0.52, -s * 0.35); ctx.lineTo(s * 0.52, -s * 0.12); ctx.lineTo(s * 0.34, -s * 0.19); ctx.closePath(); ctx.fill();
    roundRect(ctx, -s * 0.06, s * 0.02, s * 0.14, s * 0.28, s * 0.03); ctx.fillStyle = c[0]; ctx.fill();
    ctx.fillStyle = c[2]; ctx.beginPath(); ctx.arc(s * 0.12, -s * 0.24, s * 0.035, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  },
};

const loofah: ItemDef = {
  id: 'loofah', name: 'Loofah', world: 'bathroom', sizeTier: 4, baseValue: 12, weight: 3,
  draw(ctx, s, c) {
    const r = s * 0.32;
    ctx.fillStyle = c[0]; ctx.beginPath(); ctx.arc(0, s * 0.06, r, 0, Math.PI * 2); ctx.fill();
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      ctx.beginPath(); ctx.arc(Math.cos(a) * r * 0.92, s * 0.06 + Math.sin(a) * r * 0.92, r * 0.22, a - 0.5, a + 0.5); ctx.fill();
    }
    ctx.strokeStyle = c[1]; ctx.lineWidth = s * 0.045; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(0, -s * 0.28, s * 0.08, Math.PI, 0); ctx.stroke();
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
];

export const ITEM_LOOKUP: Record<string, ItemDef> = Object.fromEntries(
  ITEM_CATALOG.map(item => [item.id, item])
);

export function getItemsForWorld(world: WorldId): ItemDef[] {
  if (world === 'junkyard') return ITEM_CATALOG.filter(item => item.world !== 'junkyard');
  return ITEM_CATALOG.filter(item => item.world === world);
}
