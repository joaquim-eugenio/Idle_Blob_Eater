import type { ItemDef } from './itemCatalog';

const RENDER_SCALE = 4;

interface CacheEntry {
  canvas: HTMLCanvasElement;
  halfSize: number;
}

const cache = new Map<string, CacheEntry>();

let currentInvalidationKey = '';

export function invalidateSpriteCache() {
  cache.clear();
}

export function setSpriteGeneration(key: string) {
  if (key !== currentInvalidationKey) {
    currentInvalidationKey = key;
    cache.clear();
  }
}

function buildCacheKey(itemId: string, sizeBase: number, palette: string[]): string {
  return `${itemId}|${(sizeBase * 100) | 0}|${palette[0]}|${palette[1] || ''}`;
}

export function getCachedSprite(
  itemDef: ItemDef,
  sizeBase: number,
  palette: string[],
): CacheEntry {
  const key = buildCacheKey(itemDef.id, sizeBase, palette);
  let entry = cache.get(key);
  if (entry) return entry;

  const padding = Math.ceil(sizeBase * 0.35) + 6;
  const halfSize = Math.ceil(sizeBase * 0.65) + padding;
  const pxSize = Math.ceil(halfSize * 2 * RENDER_SCALE);

  // Use a real HTMLCanvasElement so its 2D context is a true
  // CanvasRenderingContext2D — required by itemCatalog's enhanceItem
  // which patches fillStyle via Object.defineProperty on the prototype.
  const offscreen = document.createElement('canvas');
  offscreen.width = pxSize;
  offscreen.height = pxSize;
  const ctx = offscreen.getContext('2d')!;
  ctx.scale(RENDER_SCALE, RENDER_SCALE);
  ctx.translate(halfSize, halfSize);

  itemDef.draw(ctx, sizeBase, palette);

  entry = { canvas: offscreen, halfSize };
  cache.set(key, entry);
  return entry;
}

export function drawCachedItem(
  ctx: CanvasRenderingContext2D,
  itemDef: ItemDef,
  sizeBase: number,
  palette: string[],
) {
  const { canvas, halfSize } = getCachedSprite(itemDef, sizeBase, palette);
  ctx.drawImage(
    canvas,
    -halfSize, -halfSize,
    halfSize * 2, halfSize * 2,
  );
}

export function getCacheSize(): number {
  return cache.size;
}
