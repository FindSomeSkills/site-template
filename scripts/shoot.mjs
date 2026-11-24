// 截一张只含工具本体的图：?shot=1 去掉页面外壳，按 main 的边界裁切，2x。
// 用法：node scripts/shoot.mjs /tools/timestamp/ ../out/tool.png
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const target = process.argv[2] || '/tools/timestamp/';
const output = process.argv[3] || 'shot.png';
const PORT = 4398;
const root = 'dist';
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain' };
const server = createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const file = join(root, p);
  if (!existsSync(file)) {
    res.writeHead(404);
    res.end();
    return;
  }
  res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(PORT, r));

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1180, height: 900 }, deviceScaleFactor: 2, colorScheme: 'dark' });
const page = await context.newPage();
await page.goto(`http://127.0.0.1:${PORT}${target}?shot=1`, { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
const box = await page.locator('main').boundingBox();
await page.screenshot({
  path: output,
  clip: { x: Math.max(0, box.x - 12), y: Math.max(0, box.y - 12), width: box.width + 24, height: box.height + 24 },
});
console.log('saved', output);
await browser.close();
server.close();
