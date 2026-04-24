import { existsSync, renameSync, cpSync, rmSync, readdirSync, writeFileSync } from 'fs';

const p = '.open-next';

// 1. Rename worker.js to _worker.js (Cloudflare Pages Advanced Mode)
if (existsSync(`${p}/worker.js`)) {
  renameSync(`${p}/worker.js`, `${p}/_worker.js`);
  console.log('[fix-cf] Renamed worker.js -> _worker.js');
} else {
  console.error('[fix-cf] ERROR: worker.js not found in .open-next/');
  process.exit(1);
}

// 2. Move assets from .open-next/assets/ to .open-next/ root
if (existsSync(`${p}/assets`)) {
  const entries = readdirSync(`${p}/assets`);
  for (const entry of entries) {
    const src = `${p}/assets/${entry}`;
    const dest = `${p}/${entry}`;
    if (!existsSync(dest)) {
      cpSync(src, dest, { recursive: true });
      console.log(`[fix-cf] Copied assets/${entry} -> ${entry}`);
    } else {
      console.log(`[fix-cf] Skipped assets/${entry} (already exists at root)`);
    }
  }
  rmSync(`${p}/assets`, { recursive: true });
  console.log('[fix-cf] Removed assets/ directory');
}

// 3. Create _routes.json for Cloudflare Pages Advanced Mode
const routesJson = {
  version: 1,
  include: ['/*'],
  exclude: ['/_next/static/*', '/favicon.ico', '/robots.txt', '/sitemap.xml']
};

writeFileSync(`${p}/_routes.json`, JSON.stringify(routesJson, null, 2));
console.log('[fix-cf] Created _routes.json');

// 4. Create _headers for caching static assets
const headers = `/_next/static/*
  Cache-Control: public, max-age=31536000, immutable

/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
`;

writeFileSync(`${p}/_headers`, headers);
console.log('[fix-cf] Created _headers');

console.log('[fix-cf] Done! Output ready for Cloudflare Pages Advanced Mode.');
