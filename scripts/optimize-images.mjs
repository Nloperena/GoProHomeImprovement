import { mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const srcDir = path.join(root, 'public/images');
const outDir = path.join(srcDir, 'opt');
const manifestPath = path.join(root, '.cache/image-manifest.json');
const WIDTHS = [400, 640, 800, 1100, 1400, 1920];
const MIN_BYTES = 8 * 1024;

async function mapPool(items, limit, worker) {
  const results = new Array(items.length);
  let next = 0;
  async function run() {
    while (next < items.length) {
      const index = next++;
      results[index] = await worker(items[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}

function variantWidths(intrinsicWidth) {
  const smaller = WIDTHS.filter((width) => width < intrinsicWidth - 16);
  const widths = [...smaller, intrinsicWidth];
  return [...new Set(widths)].sort((a, b) => a - b);
}

async function encodeVariant(filePath, name, width) {
  const base = path.join(outDir, `${name}-${width}`);
  const avifPath = `${base}.avif`;
  const webpPath = `${base}.webp`;
  const sourceStat = await stat(filePath);
  const fresh = await bothFresh(sourceStat.mtimeMs, avifPath, webpPath);
  if (!fresh) {
    const pipeline = () => sharp(filePath).rotate().resize({ width, withoutEnlargement: true });
    await pipeline().avif({ quality: 50, effort: 4 }).toFile(avifPath);
    await pipeline().webp({ quality: 75, effort: 4 }).toFile(webpPath);
  }
  const [avifStat, webpStat] = await Promise.all([stat(avifPath), stat(webpPath)]);
  return {
    width,
    avif: `/images/opt/${name}-${width}.avif`,
    webp: `/images/opt/${name}-${width}.webp`,
    avifBytes: avifStat.size,
    webpBytes: webpStat.size,
  };
}

async function bothFresh(sourceMtime, avifPath, webpPath) {
  try {
    const [avifStat, webpStat] = await Promise.all([stat(avifPath), stat(webpPath)]);
    return avifStat.mtimeMs >= sourceMtime && webpStat.mtimeMs >= sourceMtime;
  } catch {
    return false;
  }
}

async function optimizeFile(fileName) {
  const filePath = path.join(srcDir, fileName);
  const sourceStat = await stat(filePath);
  const meta = await sharp(filePath).metadata();
  const entry = {
    width: meta.width,
    height: meta.height,
    bytes: sourceStat.size,
    variants: [],
  };

  if (!meta.width || !meta.height || sourceStat.size < MIN_BYTES) {
    return [`/images/${fileName}`, entry];
  }

  const widths = variantWidths(meta.width);
  entry.variants = await mapPool(widths, 2, (width) =>
    encodeVariant(filePath, path.parse(fileName).name, width),
  );
  const largest = entry.variants[entry.variants.length - 1];
  const saved = sourceStat.size - largest.avifBytes;
  console.log(
    `${fileName}: ${Math.round(sourceStat.size / 1024)}KB jpg → ${entry.variants.length} sizes, ` +
      `full avif ${Math.round(largest.avifBytes / 1024)}KB (${Math.round(saved / 1024)}KB smaller)`,
  );
  return [`/images/${fileName}`, entry];
}

await mkdir(outDir, { recursive: true });
await mkdir(path.dirname(manifestPath), { recursive: true });

const files = (await readdir(srcDir)).filter((name) => /\.(jpe?g|png)$/i.test(name));
const pairs = await mapPool(files, 3, optimizeFile);
const manifest = Object.fromEntries(pairs);
await writeFile(manifestPath, JSON.stringify(manifest));
console.log(`Wrote ${Object.keys(manifest).length} image entries`);
