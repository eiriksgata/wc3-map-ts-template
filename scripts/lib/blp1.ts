/**
 * Warcraft III 1.27a BLP1 encoder.
 *
 * WC3 1.27a only loads BLP1 (magic "BLP1"). Do not emit BLP2 / DXT.
 *
 * Layout matches in-repo textures such as maps/resource/Texture/lightning/jiguang.blp:
 * JPEG content uses jpegHeaderSize = 0 and each mip is a complete JPEG (SOI…EOI).
 * Palette content uses a 256-color BGRA table plus per-mip index (+ optional 8-bit alpha).
 */

export interface RgbaImage {
  width: number;
  height: number;
  /** Tight packed RGBA (4 bytes per pixel). */
  data: Buffer;
}

const BLP1_MAGIC = Buffer.from("BLP1", "ascii");
const HEADER_SIZE = 156;
const MIP_COUNT = 16;
const PALETTE_COLORS = 256;
const PALETTE_BYTES = PALETTE_COLORS * 4;

export function isBlp1(buf: Buffer): boolean {
  return buf.length >= 4 && buf.slice(0, 4).equals(BLP1_MAGIC);
}

export function assertBlp1Magic(buf: Buffer, label = "output"): void {
  if (!isBlp1(buf)) {
    const magic = buf.slice(0, Math.min(4, buf.length)).toString("latin1");
    throw new Error(`${label} is not BLP1 (got magic ${JSON.stringify(magic)})`);
  }
}

export function nextPowerOfTwo(n: number): number {
  if (n <= 1) {
    return 1;
  }
  return 1 << Math.ceil(Math.log2(n));
}

export function isPowerOfTwo(n: number): boolean {
  return n >= 1 && (n & (n - 1)) === 0;
}

export function imageHasTransparency(image: RgbaImage): boolean {
  const { data } = image;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 255) {
      return true;
    }
  }
  return false;
}

function writeHeader(buf: Buffer, fields: {
  content: 0 | 1;
  alphaBits: number;
  width: number;
  height: number;
  extra: number;
  hasMipmaps: number;
  offsets: number[];
  sizes: number[];
}): void {
  BLP1_MAGIC.copy(buf, 0);
  buf.writeUInt32LE(fields.content, 4);
  buf.writeUInt32LE(fields.alphaBits, 8);
  buf.writeUInt32LE(fields.width, 12);
  buf.writeUInt32LE(fields.height, 16);
  buf.writeUInt32LE(fields.extra, 20);
  buf.writeUInt32LE(fields.hasMipmaps, 24);
  for (let i = 0; i < MIP_COUNT; i++) {
    buf.writeUInt32LE(fields.offsets[i] ?? 0, 28 + i * 4);
    buf.writeUInt32LE(fields.sizes[i] ?? 0, 92 + i * 4);
  }
}

function mipChainSizes(width: number, height: number, generateMipmaps: boolean): Array<{ width: number; height: number }> {
  const levels: Array<{ width: number; height: number }> = [{ width, height }];
  if (!generateMipmaps) {
    return levels;
  }
  let w = width;
  let h = height;
  while (w > 1 || h > 1) {
    w = Math.max(1, w >> 1);
    h = Math.max(1, h >> 1);
    levels.push({ width: w, height: h });
  }
  return levels;
}

function boxDownsample(image: RgbaImage): RgbaImage {
  const destW = Math.max(1, image.width >> 1);
  const destH = Math.max(1, image.height >> 1);
  const dest = Buffer.alloc(destW * destH * 4);
  const { width, height, data } = image;
  for (let y = 0; y < destH; y++) {
    for (let x = 0; x < destW; x++) {
      const x0 = x * 2;
      const y0 = y * 2;
      const x1 = Math.min(width, x0 + 2);
      const y1 = Math.min(height, y0 + 2);
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      let n = 0;
      for (let sy = y0; sy < y1; sy++) {
        for (let sx = x0; sx < x1; sx++) {
          const i = (sy * width + sx) * 4;
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          a += data[i + 3];
          n++;
        }
      }
      const o = (y * destW + x) * 4;
      dest[o] = Math.round(r / n);
      dest[o + 1] = Math.round(g / n);
      dest[o + 2] = Math.round(b / n);
      dest[o + 3] = Math.round(a / n);
    }
  }
  return { width: destW, height: destH, data: dest };
}

/**
 * Encode BLP1 JPEG. Each entry in `jpegMips` must be a complete JPEG (starts with FFD8).
 * Shared jpeg header size is 0, matching jiguang.blp in this repo.
 */
export function encodeBlp1Jpeg(options: {
  width: number;
  height: number;
  jpegMips: Buffer[];
  /** 0 or 8. JPEG itself has no alpha; 8 matches some WC3 UI BLPs. */
  alphaBits?: number;
}): Buffer {
  const { width, height, jpegMips } = options;
  if (jpegMips.length < 1) {
    throw new Error("encodeBlp1Jpeg requires at least one JPEG mip");
  }
  const alphaBits = options.alphaBits ?? 0;
  const offsets = new Array<number>(MIP_COUNT).fill(0);
  const sizes = new Array<number>(MIP_COUNT).fill(0);

  let cursor = HEADER_SIZE + 4;
  let total = cursor;
  for (let i = 0; i < jpegMips.length && i < MIP_COUNT; i++) {
    const mip = jpegMips[i];
    if (mip.length < 2 || mip[0] !== 0xff || mip[1] !== 0xd8) {
      throw new Error(`JPEG mip ${i} does not start with SOI (FFD8)`);
    }
    offsets[i] = cursor;
    sizes[i] = mip.length;
    cursor += mip.length;
    total += mip.length;
  }

  const buf = Buffer.alloc(total);
  writeHeader(buf, {
    content: 0,
    alphaBits,
    width,
    height,
    extra: 5,
    hasMipmaps: jpegMips.length > 1 ? 1 : 0,
    offsets,
    sizes,
  });
  buf.writeUInt32LE(0, HEADER_SIZE);
  for (let i = 0; i < jpegMips.length && i < MIP_COUNT; i++) {
    jpegMips[i].copy(buf, offsets[i]);
  }
  return buf;
}

interface PaletteResult {
  paletteBgra: Buffer;
  colorCount: number;
  quantized: boolean;
}

function collectOpaqueRgb(image: RgbaImage): Buffer {
  const rgb: number[] = [];
  for (let i = 0; i < image.data.length; i += 4) {
    if (image.data[i + 3] === 0) {
      continue;
    }
    rgb.push(image.data[i], image.data[i + 1], image.data[i + 2]);
  }
  return Buffer.from(rgb);
}

function uniquePalette(rgb: Buffer): { palette: Buffer; count: number } | undefined {
  const seen = new Map<number, number>();
  const palette = Buffer.alloc(PALETTE_BYTES);
  let count = 0;
  for (let i = 0; i < rgb.length; i += 3) {
    const key = (rgb[i] << 16) | (rgb[i + 1] << 8) | rgb[i + 2];
    if (seen.has(key)) {
      continue;
    }
    if (count >= PALETTE_COLORS) {
      return undefined;
    }
    seen.set(key, count);
    const o = count * 4;
    palette[o] = rgb[i + 2];
    palette[o + 1] = rgb[i + 1];
    palette[o + 2] = rgb[i];
    palette[o + 3] = 0;
    count++;
  }
  return { palette, count: Math.max(1, count) };
}

interface ColorBox {
  start: number;
  end: number;
}

function channelRange(rgb: Buffer, start: number, end: number, ch: number): number {
  let min = 255;
  let max = 0;
  for (let i = start; i < end; i++) {
    const v = rgb[i * 3 + ch];
    if (v < min) min = v;
    if (v > max) max = v;
  }
  return max - min;
}

function sortRgbSlice(rgb: Buffer, start: number, end: number, ch: number): void {
  const n = end - start;
  const idx = new Array<number>(n);
  for (let i = 0; i < n; i++) idx[i] = start + i;
  idx.sort((a, b) => rgb[a * 3 + ch] - rgb[b * 3 + ch]);
  const copy = Buffer.from(rgb.slice(start * 3, end * 3));
  for (let i = 0; i < n; i++) {
    const src = (idx[i] - start) * 3;
    const dest = (start + i) * 3;
    rgb[dest] = copy[src];
    rgb[dest + 1] = copy[src + 1];
    rgb[dest + 2] = copy[src + 2];
  }
}

function medianCutPalette(rgb: Buffer, maxColors: number): { palette: Buffer; count: number } {
  const pixelCount = Math.floor(rgb.length / 3);
  if (pixelCount === 0) {
    return { palette: Buffer.alloc(PALETTE_BYTES), count: 1 };
  }
  const boxes: ColorBox[] = [{ start: 0, end: pixelCount }];
  while (boxes.length < maxColors) {
    let best = -1;
    let bestRange = -1;
    let bestCh = 0;
    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i];
      if (box.end - box.start <= 1) {
        continue;
      }
      for (let ch = 0; ch < 3; ch++) {
        const range = channelRange(rgb, box.start, box.end, ch);
        if (range > bestRange) {
          bestRange = range;
          best = i;
          bestCh = ch;
        }
      }
    }
    if (best < 0 || bestRange <= 0) {
      break;
    }
    const box = boxes[best];
    sortRgbSlice(rgb, box.start, box.end, bestCh);
    const mid = box.start + Math.floor((box.end - box.start) / 2);
    boxes[best] = { start: box.start, end: mid };
    boxes.push({ start: mid, end: box.end });
  }

  const palette = Buffer.alloc(PALETTE_BYTES);
  for (let i = 0; i < boxes.length; i++) {
    const { start, end } = boxes[i];
    let r = 0;
    let g = 0;
    let b = 0;
    const n = end - start;
    for (let p = start; p < end; p++) {
      r += rgb[p * 3];
      g += rgb[p * 3 + 1];
      b += rgb[p * 3 + 2];
    }
    const o = i * 4;
    palette[o] = Math.round(b / n);
    palette[o + 1] = Math.round(g / n);
    palette[o + 2] = Math.round(r / n);
    palette[o + 3] = 0;
  }
  return { palette, count: boxes.length };
}

function nearestIndex(paletteBgra: Buffer, colorCount: number, r: number, g: number, b: number): number {
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < colorCount; i++) {
    const o = i * 4;
    const db = paletteBgra[o] - b;
    const dg = paletteBgra[o + 1] - g;
    const dr = paletteBgra[o + 2] - r;
    const dist = dr * dr + dg * dg + db * db;
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
      if (dist === 0) {
        break;
      }
    }
  }
  return best;
}

function mapIndices(image: RgbaImage, paletteBgra: Buffer, colorCount: number, dither: boolean): Buffer {
  const { width, height, data } = image;
  const indices = Buffer.alloc(width * height);
  const used = Math.max(1, Math.min(PALETTE_COLORS, colorCount));

  if (!dither) {
    for (let p = 0; p < width * height; p++) {
      const i = p * 4;
      indices[p] = nearestIndex(paletteBgra, used, data[i], data[i + 1], data[i + 2]);
    }
    return indices;
  }

  const errR = new Float32Array(width * height);
  const errG = new Float32Array(width * height);
  const errB = new Float32Array(width * height);
  for (let p = 0; p < width * height; p++) {
    errR[p] = data[p * 4];
    errG[p] = data[p * 4 + 1];
    errB[p] = data[p * 4 + 2];
  }

  const diffuse = (x: number, y: number, factor: number, dr: number, dg: number, db: number) => {
    if (x < 0 || x >= width || y < 0 || y >= height) {
      return;
    }
    const p = y * width + x;
    errR[p] += dr * factor;
    errG[p] += dg * factor;
    errB[p] += db * factor;
  };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const p = y * width + x;
      const r = clampByte(errR[p]);
      const g = clampByte(errG[p]);
      const b = clampByte(errB[p]);
      const idx = nearestIndex(paletteBgra, used, r, g, b);
      indices[p] = idx;
      const o = idx * 4;
      const dr = r - paletteBgra[o + 2];
      const dg = g - paletteBgra[o + 1];
      const db = b - paletteBgra[o];
      diffuse(x + 1, y, 7 / 16, dr, dg, db);
      diffuse(x - 1, y + 1, 3 / 16, dr, dg, db);
      diffuse(x, y + 1, 5 / 16, dr, dg, db);
      diffuse(x + 1, y + 1, 1 / 16, dr, dg, db);
    }
  }
  return indices;
}

function clampByte(v: number): number {
  if (v < 0) return 0;
  if (v > 255) return 255;
  return v | 0;
}

function buildPalette(image: RgbaImage): PaletteResult {
  let samples = collectOpaqueRgb(image);
  if (samples.length === 0) {
    samples = Buffer.from([0, 0, 0]);
  }
  const maxSamplePixels = 256 * 256;
  const sampleCount = samples.length / 3;
  if (sampleCount > maxSamplePixels) {
    const step = Math.ceil(sampleCount / maxSamplePixels);
    const trimmed: number[] = [];
    for (let i = 0; i < sampleCount; i += step) {
      trimmed.push(samples[i * 3], samples[i * 3 + 1], samples[i * 3 + 2]);
    }
    samples = Buffer.from(trimmed);
  }

  const unique = uniquePalette(samples);
  if (unique) {
    return { paletteBgra: unique.palette, colorCount: unique.count, quantized: false };
  }
  const built = medianCutPalette(Buffer.from(samples), PALETTE_COLORS);
  return { paletteBgra: built.palette, colorCount: built.count, quantized: true };
}

function extractAlpha(image: RgbaImage): Buffer {
  const alpha = Buffer.alloc(image.width * image.height);
  for (let p = 0; p < alpha.length; p++) {
    alpha[p] = image.data[p * 4 + 3];
  }
  return alpha;
}

/**
 * Encode BLP1 palettized (256 colors). Uses 8-bit alpha when the source has transparency,
 * otherwise 0-bit alpha.
 */
export function encodeBlp1Palette(image: RgbaImage, generateMipmaps = true): Buffer {
  const hasAlpha = imageHasTransparency(image);
  const alphaBits = hasAlpha ? 8 : 0;
  const { paletteBgra, colorCount, quantized } = buildPalette(image);

  const levels: RgbaImage[] = [image];
  if (generateMipmaps) {
    let current = image;
    const chain = mipChainSizes(image.width, image.height, true);
    for (let i = 1; i < chain.length; i++) {
      current = boxDownsample(current);
      levels.push(current);
    }
  }

  const mipPayloads: Buffer[] = [];
  for (let i = 0; i < levels.length; i++) {
    const level = levels[i];
    const indices = mapIndices(level, paletteBgra, colorCount, quantized && i === 0);
    if (alphaBits === 8) {
      mipPayloads.push(Buffer.concat([indices, extractAlpha(level)]));
    } else {
      mipPayloads.push(indices);
    }
  }

  const offsets = new Array<number>(MIP_COUNT).fill(0);
  const sizes = new Array<number>(MIP_COUNT).fill(0);
  let cursor = HEADER_SIZE + PALETTE_BYTES;
  let total = cursor;
  for (let i = 0; i < mipPayloads.length && i < MIP_COUNT; i++) {
    offsets[i] = cursor;
    sizes[i] = mipPayloads[i].length;
    cursor += mipPayloads[i].length;
    total += mipPayloads[i].length;
  }

  const buf = Buffer.alloc(total);
  writeHeader(buf, {
    content: 1,
    alphaBits,
    width: image.width,
    height: image.height,
    extra: 5,
    hasMipmaps: mipPayloads.length > 1 ? 1 : 0,
    offsets,
    sizes,
  });
  paletteBgra.copy(buf, HEADER_SIZE);
  for (let i = 0; i < mipPayloads.length && i < MIP_COUNT; i++) {
    mipPayloads[i].copy(buf, offsets[i]);
  }
  return buf;
}

export function describeBlp1Header(buf: Buffer): {
  magic: string;
  content: number;
  alphaBits: number;
  width: number;
  height: number;
  extra: number;
  hasMipmaps: number;
} {
  return {
    magic: buf.slice(0, 4).toString("ascii"),
    content: buf.readUInt32LE(4),
    alphaBits: buf.readUInt32LE(8),
    width: buf.readUInt32LE(12),
    height: buf.readUInt32LE(16),
    extra: buf.readUInt32LE(20),
    hasMipmaps: buf.readUInt32LE(24),
  };
}
