export type WorldId = 'crumbs' | 'desk_drawer' | 'backpack' | 'room' | 'house' | 'warehouse' | 'outdoors';

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

// ─── World 1: Crumbs (geometric shapes) ───

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
    ctx.fillRect(-s * 0.5, -s * 0.5, s, s);
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

// ─── World 2: Desk Drawer (tiny objects) ───

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
    ctx.fillStyle = c[1]; ctx.font = `bold ${s * 0.3}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
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

// ─── World 3: Backpack (small objects) ───

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

// ─── World 4: Room (medium objects) ───

const book: ItemDef = {
  id: 'book', name: 'Book', world: 'room', sizeTier: 4, baseValue: 15, weight: 4,
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
  id: 'lamp', name: 'Lamp', world: 'room', sizeTier: 4, baseValue: 17, weight: 5,
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
  id: 'smartphone', name: 'Smartphone', world: 'room', sizeTier: 4, baseValue: 20, weight: 3,
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
  id: 'potted_plant', name: 'Potted Plant', world: 'room', sizeTier: 4, baseValue: 14, weight: 6,
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
  id: 'toaster', name: 'Toaster', world: 'room', sizeTier: 4, baseValue: 16, weight: 5.5,
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
  id: 'shoe', name: 'Shoe', world: 'room', sizeTier: 4, baseValue: 12, weight: 3.5,
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
  id: 'basketball', name: 'Basketball', world: 'room', sizeTier: 4, baseValue: 18, weight: 4.5,
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
  id: 'clock', name: 'Clock', world: 'room', sizeTier: 4, baseValue: 19, weight: 4,
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

// ─── World 5: House (large objects) ───

const chair: ItemDef = {
  id: 'chair', name: 'Chair', world: 'house', sizeTier: 5, baseValue: 30, weight: 8,
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

const monitor: ItemDef = {
  id: 'monitor', name: 'Monitor', world: 'house', sizeTier: 5, baseValue: 38, weight: 7,
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

const fan: ItemDef = {
  id: 'fan', name: 'Fan', world: 'house', sizeTier: 5, baseValue: 25, weight: 6,
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

const guitar: ItemDef = {
  id: 'guitar', name: 'Guitar', world: 'house', sizeTier: 5, baseValue: 40, weight: 5,
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

const suitcase: ItemDef = {
  id: 'suitcase', name: 'Suitcase', world: 'house', sizeTier: 5, baseValue: 33, weight: 9,
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

const printer: ItemDef = {
  id: 'printer', name: 'Printer', world: 'house', sizeTier: 5, baseValue: 35, weight: 10,
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

const smallTable: ItemDef = {
  id: 'small_table', name: 'Small Table', world: 'house', sizeTier: 5, baseValue: 32, weight: 10,
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
  id: 'microwave', name: 'Microwave', world: 'house', sizeTier: 5, baseValue: 28, weight: 11,
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

// ─── World 6: Warehouse (extra large objects) ───

const desk: ItemDef = {
  id: 'desk', name: 'Desk', world: 'warehouse', sizeTier: 6, baseValue: 45, weight: 14,
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
  id: 'bookshelf', name: 'Bookshelf', world: 'warehouse', sizeTier: 6, baseValue: 50, weight: 18,
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

const fridge: ItemDef = {
  id: 'fridge', name: 'Fridge', world: 'warehouse', sizeTier: 6, baseValue: 62, weight: 22,
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

const washingMachine: ItemDef = {
  id: 'washing_machine', name: 'Washing Machine', world: 'warehouse', sizeTier: 6, baseValue: 55, weight: 25,
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

const sofa: ItemDef = {
  id: 'sofa', name: 'Sofa', world: 'warehouse', sizeTier: 6, baseValue: 68, weight: 20,
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

const bathtub: ItemDef = {
  id: 'bathtub', name: 'Bathtub', world: 'warehouse', sizeTier: 6, baseValue: 58, weight: 28,
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

const bicycle: ItemDef = {
  id: 'bicycle', name: 'Bicycle', world: 'warehouse', sizeTier: 6, baseValue: 52, weight: 12,
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

const piano: ItemDef = {
  id: 'piano', name: 'Piano', world: 'warehouse', sizeTier: 6, baseValue: 75, weight: 30,
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

// ─── World 7: Outdoors (massive objects) ───

const car: ItemDef = {
  id: 'car', name: 'Car', world: 'outdoors', sizeTier: 7, baseValue: 130, weight: 35,
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

const tree: ItemDef = {
  id: 'tree', name: 'Tree', world: 'outdoors', sizeTier: 7, baseValue: 110, weight: 40,
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

const dumpster: ItemDef = {
  id: 'dumpster', name: 'Dumpster', world: 'outdoors', sizeTier: 7, baseValue: 100, weight: 45,
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

const streetLamp: ItemDef = {
  id: 'street_lamp', name: 'Street Lamp', world: 'outdoors', sizeTier: 7, baseValue: 96, weight: 15,
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

const mailbox: ItemDef = {
  id: 'mailbox', name: 'Mailbox', world: 'outdoors', sizeTier: 7, baseValue: 88, weight: 12,
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
  id: 'bench', name: 'Bench', world: 'outdoors', sizeTier: 7, baseValue: 85, weight: 16,
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

const trashCan: ItemDef = {
  id: 'trash_can', name: 'Trash Can', world: 'outdoors', sizeTier: 7, baseValue: 80, weight: 10,
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

const hydrant: ItemDef = {
  id: 'hydrant', name: 'Fire Hydrant', world: 'outdoors', sizeTier: 7, baseValue: 92, weight: 18,
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

// ─── Export catalog ───

export const ITEM_CATALOG: ItemDef[] = [
  // World 1: Crumbs
  triangle, square, hexagon, diamond, circle, pentagon, cross, crescent,
  // World 2: Desk Drawer
  paperclip, button, coin, marble, dice, screw, candy, eraser,
  // World 3: Backpack
  pen, key, usbDrive, wallet, glasses, remote, apple, mug,
  // World 4: Room
  book, lamp, smartphone, pottedPlant, toaster, shoe, basketball, clock,
  // World 5: House
  chair, monitor, fan, guitar, suitcase, printer, smallTable, microwave,
  // World 6: Warehouse
  desk, bookshelf, fridge, washingMachine, sofa, bathtub, bicycle, piano,
  // World 7: Outdoors
  car, tree, dumpster, streetLamp, mailbox, bench, trashCan, hydrant,
];

export const ITEM_LOOKUP: Record<string, ItemDef> = Object.fromEntries(
  ITEM_CATALOG.map(item => [item.id, item])
);

export function getItemsForWorld(world: WorldId): ItemDef[] {
  return ITEM_CATALOG.filter(item => item.world === world);
}
