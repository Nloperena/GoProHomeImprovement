import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const staticDir = path.join(process.cwd(), '.vercel/output/static');
const cssCache = new Map();
const linkPattern = /<link rel="stylesheet" href="(\/_astro\/[^"]+\.css)">/g;

async function readCss(href) {
  if (!cssCache.has(href)) {
    const filePath = path.join(staticDir, href.slice(1));
    const css = (await readFile(filePath, 'utf8')).replace(/<\/style/gi, '<\\/style');
    cssCache.set(href, css);
  }
  return cssCache.get(href);
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

let inlined = 0;
for (const file of await walk(staticDir)) {
  const html = await readFile(file, 'utf8');
  const matches = [...html.matchAll(linkPattern)];
  if (matches.length === 0) continue;
  let next = html;
  for (const match of matches) {
    const css = await readCss(match[1]);
    next = next.replace(match[0], `<style>${css}</style>`);
  }
  await writeFile(file, next);
  inlined += 1;
}

const bytes = [...cssCache.values()].reduce((sum, css) => sum + css.length, 0);
console.log(`Inlined ${bytes} bytes of CSS into ${inlined} HTML files`);
