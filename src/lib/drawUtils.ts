// Shared drawing utilities for mobile-game-quality canvas rendering.
// Provides color manipulation + reusable "icon-style" drawing primitives
// (gradients, outlines, specular highlights) used by blob, food items, etc.

export function hexToHsl(color: string): [number, number, number] {
  const trimmed = color.trim();
  const hslMatch = trimmed.match(/^hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%/);
  if (hslMatch) {
    return [parseFloat(hslMatch[1]), parseFloat(hslMatch[2]), parseFloat(hslMatch[3])];
  }
  let hex = trimmed.replace('#', '');
  if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  if (isNaN(r) || isNaN(g) || isNaN(b)) return [0, 0, 50];
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [h * 360, s * 100, l * 100];
}

export function hslToString(h: number, s: number, l: number, a = 1): string {
  if (a < 1) return `hsla(${h|0}, ${s|0}%, ${l|0}%, ${a})`;
  return `hsl(${h|0}, ${s|0}%, ${l|0}%)`;
}

export function darken(hex: string, amount = 0.25): string {
  const [h, s, l] = hexToHsl(hex);
  return hslToString(h, Math.min(100, s + 5), Math.max(0, l * (1 - amount)));
}

export function lighten(hex: string, amount = 0.2): string {
  const [h, s, l] = hexToHsl(hex);
  return hslToString(h, Math.max(0, s - 3), Math.min(100, l + (100 - l) * amount));
}

const _gradCache = new Map<string, [number, number, number]>();
function cachedHsl(hex: string): [number, number, number] {
  let v = _gradCache.get(hex);
  if (!v) { v = hexToHsl(hex); _gradCache.set(hex, v); }
  return v;
}

export function itemGradient(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, r: number,
  baseColor: string
): CanvasGradient {
  const [h, s, l] = cachedHsl(baseColor);
  const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.05, x, y, r);
  grad.addColorStop(0, hslToString(h, Math.max(0, s - 5), Math.min(100, l + 18)));
  grad.addColorStop(0.6, hslToString(h, s, l));
  grad.addColorStop(1, hslToString(h, Math.min(100, s + 8), Math.max(0, l - 14)));
  return grad;
}

export function itemLinearGradient(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number, x2: number, y2: number,
  baseColor: string
): CanvasGradient {
  const [h, s, l] = cachedHsl(baseColor);
  const grad = ctx.createLinearGradient(x1, y1, x2, y2);
  grad.addColorStop(0, hslToString(h, Math.max(0, s - 5), Math.min(100, l + 15)));
  grad.addColorStop(0.5, hslToString(h, s, l));
  grad.addColorStop(1, hslToString(h, Math.min(100, s + 8), Math.max(0, l - 12)));
  return grad;
}

export function itemOutline(ctx: CanvasRenderingContext2D, color: string, width: number) {
  ctx.strokeStyle = darken(color, 0.35);
  ctx.lineWidth = width;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.stroke();
}

export function itemHighlight(ctx: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.38)';
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function blobGradient(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, radius: number,
  baseColor: string
): CanvasGradient {
  const [h, s, l] = cachedHsl(baseColor);
  const grad = ctx.createRadialGradient(cx - radius * 0.25, cy - radius * 0.25, radius * 0.05, cx, cy, radius);
  grad.addColorStop(0, hslToString(h, Math.max(0, s - 8), Math.min(100, l + 22)));
  grad.addColorStop(0.55, hslToString(h, s, l));
  grad.addColorStop(1, hslToString(h, Math.min(100, s + 10), Math.max(0, l - 18)));
  return grad;
}
