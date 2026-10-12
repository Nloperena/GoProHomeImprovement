import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parse, serialize } from 'parse5';

const root = process.cwd();
const staticDir = path.join(root, '.vercel/output/static');
const manifest = JSON.parse(
  await readFile(path.join(root, '.cache/image-manifest.json'), 'utf8'),
);

function attr(node, name) {
  return node.attrs?.find((item) => item.name === name)?.value ?? '';
}

function setAttr(node, name, value) {
  const existing = node.attrs?.find((item) => item.name === name);
  if (existing) existing.value = value;
  else node.attrs.push({ name, value });
}

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

function srcset(variants, key) {
  return variants.map((variant) => `${variant[key]} ${variant.width}w`).join(', ');
}

function sizesFor(imgClass, parentClass) {
  if (/\bh-1[046]\b/.test(imgClass) || /\bh-10\b/.test(imgClass)) return '240px';
  if (imgClass.includes('absolute') && imgClass.includes('inset-0')) return '100vw';
  if (imgClass.includes('h-64')) {
    return '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw';
  }
  if (parentClass.includes('aspect-square')) {
    return '(min-width: 768px) 33vw, 50vw';
  }
  if (/\bh-(72|80|96)\b/.test(parentClass)) {
    return '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw';
  }
  return '(min-width: 1280px) 800px, 100vw';
}

function buildPicture(img, entry, sizes) {
  const alt = escapeAttr(attr(img, 'alt'));
  const className = escapeAttr(attr(img, 'class'));
  const loading = escapeAttr(attr(img, 'loading') || 'lazy');
  const fetchPriority = attr(img, 'fetchpriority');
  const decoding = fetchPriority === 'high' ? 'auto' : 'async';
  const priorityAttr = fetchPriority ? ` fetchpriority="${escapeAttr(fetchPriority)}"` : '';
  const html = `<picture class="opt-picture"><source type="image/avif" srcset="${srcset(entry.variants, 'avif')}" sizes="${sizes}"><source type="image/webp" srcset="${srcset(entry.variants, 'webp')}" sizes="${sizes}"><img src="${escapeAttr(attr(img, 'src'))}" srcset="${srcset(entry.variants, 'webp')}" sizes="${sizes}" width="${entry.width}" height="${entry.height}" alt="${alt}" class="${className}" loading="${loading}" decoding="${decoding}"${priorityAttr}></picture>`;
  const fragment = parse(html, { sourceCodeLocationInfo: false });
  const htmlNode = fragment.childNodes.find((node) => node.nodeName === 'html');
  const body = htmlNode.childNodes.find((node) => node.nodeName === 'body');
  return body.childNodes.find((node) => node.nodeName === 'picture');
}

function rewriteTree(node, state) {
  if (!node.childNodes) return;
  for (const child of [...node.childNodes]) {
    if (child.nodeName !== 'img') {
      rewriteTree(child, state);
      continue;
    }
    const src = attr(child, 'src');
    const entry = manifest[src];
    if (!entry?.width) continue;

    setAttr(child, 'width', String(entry.width));
    setAttr(child, 'height', String(entry.height));
    if (!entry.variants?.length) {
      if (src.includes('footer-logo') && !attr(child, 'loading')) setAttr(child, 'loading', 'lazy');
      continue;
    }

    const isLogo = src.includes('logo');
    const parentClass = attr(node, 'class');
    const imgClass = attr(child, 'class');
    const isLcp = !isLogo && !state.lcpChosen;
    if (isLcp) {
      state.lcpChosen = true;
      setAttr(child, 'loading', 'eager');
      setAttr(child, 'fetchpriority', 'high');
    } else if (attr(child, 'fetchpriority') !== 'high') {
      setAttr(child, 'loading', 'lazy');
      setAttr(child, 'fetchpriority', 'low');
    }

    const picture = buildPicture(child, entry, sizesFor(imgClass, parentClass));
    const index = node.childNodes.indexOf(child);
    node.childNodes[index] = picture;
    picture.parentNode = node;
  }
}

function rewriteHtml(html) {
  const document = parse(html);
  rewriteTree(document, { lcpChosen: false });
  return serialize(document);
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(fullPath)));
    else if (entry.name.endsWith('.html')) files.push(fullPath);
  }
  return files;
}

const files = await walk(staticDir);
let rewritten = 0;
for (const file of files) {
  const original = await readFile(file, 'utf8');
  if (!original.includes('/images/')) continue;
  const next = rewriteHtml(original);
  if (next !== original) {
    await writeFile(file, next);
    rewritten += 1;
  }
}
const staticStat = await stat(staticDir);
console.log(`Rewrote responsive images in ${rewritten} HTML files (${staticStat.isDirectory() ? 'static' : 'missing'})`);
