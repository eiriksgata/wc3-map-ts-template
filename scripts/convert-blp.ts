/**
 * Convert JPG/PNG to Warcraft III 1.27a BLP1.
 *
 * Usage:
 *   yarn convert:blp <input> [output]
 *   yarn convert:blp 图片素材/白泽UI/技能/移动.jpg
 *   yarn convert:blp 图片素材/白泽UI/技能 --out maps/resource/Texture/ui/skills -r
 *   yarn convert:blp foo.png --import Texture/ui/foo.blp
 */

import * as fs from "fs";
import * as path from "path";
import sharp from "sharp";
import {
  assertBlp1Magic,
  describeBlp1Header,
  encodeBlp1Jpeg,
  encodeBlp1Palette,
  imageHasTransparency,
  isPowerOfTwo,
  nextPowerOfTwo,
  type RgbaImage,
} from "./lib/blp1";

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png"]);
const REPO_ROOT = path.resolve(__dirname, "..");
const IMP_INI = path.join(REPO_ROOT, "maps", "table", "imp.ini");
const MAPS_RESOURCE = path.join(REPO_ROOT, "maps", "resource");

type FormatOpt = "auto" | "palette" | "jpeg";

interface CliOptions {
  input?: string;
  output?: string;
  out?: string;
  recursive: boolean;
  importPath?: string;
  format: FormatOpt;
  quality: number;
  size?: { width: number; height: number };
  keepSize: boolean;
  mipmaps: boolean;
  dryRun: boolean;
  help: boolean;
}

function printHelp(): void {
  const text = [
    "将 JPG/PNG 转为魔兽争霸 III 1.27a 可用的 BLP1（不是 BLP2/DXT）。",
    "",
    "用法:",
    "  yarn convert:blp <input> [output] [options]",
    "",
    "选项:",
    "  -o, --out <path>              输出文件或目录",
    "  -r, --recursive               递归处理目录",
    "  --import <mpqPath>            写入 maps/resource/<mpqPath> 并登记 maps/table/imp.ini",
    "  --format auto|palette|jpeg    默认 auto（有透明→调色板，否则 JPEG）",
    "  --quality <1-100>             JPEG 质量，默认 85",
    "  --size <N>|<WxH>              强制输出尺寸（如 64 或 256x64）",
    "  --keep-size                   不把宽高拉到 2 的幂",
    "  --no-mipmaps                  只写 mip 0",
    "  --dry-run                     只打印计划，不写文件",
    "  -h, --help",
    "",
    "示例:",
    "  yarn convert:blp 图片素材/白泽UI/技能/移动.jpg",
    "  yarn convert:blp icon.png --import Texture/ui/icon.blp --size 64",
    "  yarn convert:blp 图片素材/白泽UI/技能 -r --import Texture/ui/skills",
  ].join("\n");
  console.log(text);
}

function parseSize(raw: string): { width: number; height: number } {
  const pair = /^(\d+)x(\d+)$/i.exec(raw.trim());
  if (pair) {
    return { width: Number(pair[1]), height: Number(pair[2]) };
  }
  const n = Number(raw);
  if (Number.isInteger(n) && n > 0) {
    return { width: n, height: n };
  }
  throw new Error(`Invalid --size ${JSON.stringify(raw)} (use N or WxH)`);
}

function parseArgs(argv: string[]): CliOptions {
  const opts: CliOptions = {
    recursive: false,
    format: "auto",
    quality: 85,
    keepSize: false,
    mipmaps: true,
    dryRun: false,
    help: false,
  };
  const positional: string[] = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const next = () => {
      const value = argv[++i];
      if (value === undefined || value.startsWith("-")) {
        throw new Error(`Missing value for ${arg}`);
      }
      return value;
    };

    switch (arg) {
      case "-h":
      case "--help":
        opts.help = true;
        break;
      case "-r":
      case "--recursive":
        opts.recursive = true;
        break;
      case "--keep-size":
        opts.keepSize = true;
        break;
      case "--no-mipmaps":
        opts.mipmaps = false;
        break;
      case "--dry-run":
        opts.dryRun = true;
        break;
      case "-o":
      case "--out":
        opts.out = next();
        break;
      case "--import":
        opts.importPath = next();
        break;
      case "--format": {
        const value = next();
        if (value !== "auto" && value !== "palette" && value !== "jpeg") {
          throw new Error(`Invalid --format ${value}`);
        }
        opts.format = value;
        break;
      }
      case "--quality": {
        const value = Number(next());
        if (!Number.isInteger(value) || value < 1 || value > 100) {
          throw new Error("--quality must be an integer 1-100");
        }
        opts.quality = value;
        break;
      }
      case "--size":
        opts.size = parseSize(next());
        break;
      default:
        if (arg.startsWith("-")) {
          throw new Error(`Unknown option ${arg}`);
        }
        positional.push(arg);
        break;
    }
  }

  opts.input = positional[0];
  opts.output = positional[1];
  return opts;
}

function isImageFile(filePath: string): boolean {
  return IMAGE_EXT.has(path.extname(filePath).toLowerCase());
}

function collectImages(input: string, recursive: boolean): string[] {
  const stat = fs.statSync(input);
  if (stat.isFile()) {
    if (!isImageFile(input)) {
      throw new Error(`Not a JPG/PNG: ${input}`);
    }
    return [path.resolve(input)];
  }
  if (!stat.isDirectory()) {
    throw new Error(`Not a file or directory: ${input}`);
  }

  const found: string[] = [];
  const walk = (dir: string, recurse: boolean) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (recurse) {
          walk(full, true);
        }
        continue;
      }
      if (entry.isFile() && isImageFile(full)) {
        found.push(full);
      }
    }
  };
  walk(input, recursive);
  found.sort((a, b) => a.localeCompare(b));
  return found;
}

function toPosix(p: string): string {
  return p.replace(/\\/g, "/");
}

function toMpqPath(p: string): string {
  return toPosix(p).replace(/^\/+/, "").replace(/\//g, "\\");
}

function importIsFilePath(importPath: string): boolean {
  return path.extname(importPath).toLowerCase() === ".blp";
}

function defaultBlpName(src: string): string {
  return `${path.parse(src).name}.blp`;
}

function resolveJobs(
  sources: string[],
  inputRoot: string,
  opts: CliOptions,
): Array<{ src: string; dest: string; mpqPath?: string }> {
  const inputStat = fs.statSync(inputRoot);
  const explicitOut = opts.out ?? opts.output;

  return sources.map((src) => {
    if (opts.importPath) {
      const relFromInput = inputStat.isDirectory()
        ? path.relative(inputRoot, src)
        : defaultBlpName(src);
      const relBlp = path.join(
        path.dirname(relFromInput),
        `${path.parse(relFromInput).name}.blp`,
      );

      let mpqRel: string;
      if (importIsFilePath(opts.importPath)) {
        if (sources.length !== 1) {
          throw new Error("--import with a .blp file path requires a single input file");
        }
        mpqRel = opts.importPath;
      } else if (inputStat.isFile()) {
        const base = defaultBlpName(src);
        mpqRel = path.join(opts.importPath, base);
      } else {
        mpqRel = path.join(opts.importPath, relBlp);
      }

      const mpqPath = toMpqPath(mpqRel);
      return {
        src,
        dest: path.join(MAPS_RESOURCE, mpqPath.replace(/\\/g, path.sep)),
        mpqPath,
      };
    }

    if (explicitOut) {
      const outPath = path.resolve(explicitOut);
      const outIsDir =
        explicitOut.endsWith("/") ||
        explicitOut.endsWith("\\") ||
        path.extname(explicitOut).toLowerCase() !== ".blp" ||
        (fs.existsSync(outPath) && fs.statSync(outPath).isDirectory()) ||
        sources.length > 1 ||
        inputStat.isDirectory();
      if (outIsDir) {
        const rel = inputStat.isDirectory()
          ? path.join(path.dirname(path.relative(inputRoot, src)), defaultBlpName(src))
          : defaultBlpName(src);
        return { src, dest: path.join(outPath, rel) };
      }
      return { src, dest: outPath };
    }

    return { src, dest: path.join(path.dirname(src), defaultBlpName(src)) };
  });
}

function registerImpIni(mpqPath: string, dryRun: boolean): "added" | "exists" {
  if (!fs.existsSync(IMP_INI)) {
    throw new Error(`imp.ini not found: ${IMP_INI}`);
  }
  const original = fs.readFileSync(IMP_INI, "utf8");
  const nl = original.includes("\r\n") ? "\r\n" : "\n";
  const escaped = mpqPath.replace(/\\/g, "\\\\");
  const entry = `"${escaped}"`;
  const already = original.split(/\r?\n/).some((line) => {
    const trimmed = line.trim().replace(/,$/, "");
    return trimmed.toLowerCase() === entry.toLowerCase();
  });
  if (already) {
    return "exists";
  }
  if (dryRun) {
    return "added";
  }

  const close = original.lastIndexOf("}");
  if (close < 0) {
    throw new Error("imp.ini is missing closing }");
  }
  const insertion = `${entry},${nl}`;
  const updated = original.slice(0, close) + insertion + original.slice(close);
  fs.writeFileSync(IMP_INI, updated, "utf8");
  return "added";
}

async function loadRgba(filePath: string): Promise<RgbaImage> {
  const { data, info } = await sharp(filePath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return {
    width: info.width,
    height: info.height,
    data: Buffer.from(data),
  };
}

function targetSize(
  width: number,
  height: number,
  opts: CliOptions,
): { width: number; height: number; resized: boolean } {
  if (opts.size) {
    return { width: opts.size.width, height: opts.size.height, resized: width !== opts.size.width || height !== opts.size.height };
  }
  if (opts.keepSize) {
    return { width, height, resized: false };
  }
  const tw = nextPowerOfTwo(width);
  const th = nextPowerOfTwo(height);
  return { width: tw, height: th, resized: tw !== width || th !== height };
}

async function resizeRgba(image: RgbaImage, width: number, height: number): Promise<RgbaImage> {
  if (image.width === width && image.height === height) {
    return image;
  }
  const { data, info } = await sharp(image.data, {
    raw: { width: image.width, height: image.height, channels: 4 },
  })
    .resize(width, height, { fit: "fill", kernel: "lanczos3" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { width: info.width, height: info.height, data: Buffer.from(data) };
}

function flattenRgb(image: RgbaImage): Buffer {
  const rgb = Buffer.alloc(image.width * image.height * 3);
  for (let p = 0, o = 0; p < image.data.length; p += 4, o += 3) {
    const a = image.data[p + 3] / 255;
    rgb[o] = Math.round(image.data[p] * a);
    rgb[o + 1] = Math.round(image.data[p + 1] * a);
    rgb[o + 2] = Math.round(image.data[p + 2] * a);
  }
  return rgb;
}

async function encodeJpegBuffer(rgb: Buffer, width: number, height: number, quality: number): Promise<Buffer> {
  return sharp(rgb, { raw: { width, height, channels: 3 } })
    .jpeg({ quality, progressive: false, chromaSubsampling: "4:2:0" })
    .toBuffer();
}

async function buildJpegMips(image: RgbaImage, quality: number, generateMipmaps: boolean): Promise<Buffer[]> {
  const mips: Buffer[] = [];
  let w = image.width;
  let h = image.height;
  while (true) {
    const resized = await resizeRgba(image, w, h);
    mips.push(await encodeJpegBuffer(flattenRgb(resized), w, h, quality));
    if (!generateMipmaps || (w === 1 && h === 1)) {
      break;
    }
    w = Math.max(1, w >> 1);
    h = Math.max(1, h >> 1);
  }
  return mips;
}

async function convertOne(
  src: string,
  dest: string,
  opts: CliOptions,
): Promise<{ format: "jpeg" | "palette"; width: number; height: number; bytes: number }> {
  const loaded = await loadRgba(src);
  const target = targetSize(loaded.width, loaded.height, opts);
  const resized = await resizeRgba(loaded, target.width, target.height);
  const transparent = imageHasTransparency(resized);

  let format: "jpeg" | "palette";
  if (opts.format === "auto") {
    format = transparent ? "palette" : "jpeg";
  } else {
    format = opts.format;
  }

  let encoded: Buffer;
  if (format === "palette") {
    encoded = encodeBlp1Palette(resized, opts.mipmaps);
  } else {
    const jpegMips = await buildJpegMips(resized, opts.quality, opts.mipmaps);
    encoded = encodeBlp1Jpeg({
      width: resized.width,
      height: resized.height,
      jpegMips,
      alphaBits: 0,
    });
  }

  assertBlp1Magic(encoded, dest);
  if (!opts.dryRun) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, encoded);
  }
  return { format, width: resized.width, height: resized.height, bytes: encoded.length };
}

async function main(): Promise<void> {
  let opts: CliOptions;
  try {
    opts = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
    return;
  }

  if (opts.help || !opts.input) {
    printHelp();
    if (!opts.help && !opts.input) {
      process.exitCode = 1;
    }
    return;
  }

  const inputRoot = path.resolve(opts.input);
  if (!fs.existsSync(inputRoot)) {
    console.error(`Input not found: ${opts.input}`);
    process.exitCode = 1;
    return;
  }

  const sources = collectImages(inputRoot, opts.recursive);
  if (sources.length === 0) {
    console.error(`No JPG/PNG files found under ${opts.input}`);
    process.exitCode = 1;
    return;
  }

  const jobs = resolveJobs(sources, inputRoot, opts);
  let failed = 0;

  for (const job of jobs) {
    try {
      const result = await convertOne(job.src, job.dest, opts);
      const relSrc = path.relative(REPO_ROOT, job.src) || job.src;
      const relDest = path.relative(REPO_ROOT, job.dest) || job.dest;
      const header = opts.dryRun
        ? { magic: "BLP1", content: result.format === "jpeg" ? 0 : 1 }
        : describeBlp1Header(fs.readFileSync(job.dest));
      const potWarn =
        !isPowerOfTwo(result.width) || !isPowerOfTwo(result.height)
          ? " (not power-of-two; 1.27a may need DzUnlockBlpSizeLimit)"
          : "";
      const importNote = job.mpqPath
        ? `; imp ${registerImpIni(job.mpqPath, opts.dryRun)} "${job.mpqPath.replace(/\\/g, "\\\\")}"`
        : "";
      const prefix = opts.dryRun ? "[dry-run] " : "";
      console.log(
        `${prefix}${relSrc} -> ${relDest} (${header.magic} ${result.format} ${result.width}x${result.height} ${result.bytes} bytes)${potWarn}${importNote}`,
      );
    } catch (error) {
      failed++;
      console.error(`Failed ${job.src}: ${error instanceof Error ? error.message : error}`);
    }
  }

  if (failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
