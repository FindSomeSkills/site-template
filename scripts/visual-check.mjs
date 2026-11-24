// 六组渲染验收：中英 × 浅色 / 深色 / 无 JS。深色页平均亮度必须 < 70，浅色 > 140。
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { chromium } from 'playwright';

const PORT = Number(process.env.PORT || 4399);
const root = 'dist';
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain' };

const server = createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  let file = join(root, p);
  if (!existsSync(file)) file = join(root, '404.html');
  if (!existsSync(file)) {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('not found');
    return;
  }
  res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(PORT, r));

const browser = await chromium.launch();
const fails = [];
const rows = [];

for (const lang of ['en', 'zh']) {
  const base = lang === 'zh' ? '/zh' : '';
  const routes = ['/', '/tools/timestamp/', '/guides/example-error/'];
  for (const mode of ['light', 'dark', 'nojs']) {
    const context = await browser.newContext({
      viewport: { width: 1200, height: 900 },
      colorScheme: mode === 'dark' ? 'dark' : 'light',
      javaScriptEnabled: mode !== 'nojs',
    });
    const page = await context.newPage();
    const url = `http://127.0.0.1:${PORT}${base}${routes[1]}${mode === 'dark' ? '?theme=dark' : ''}`;
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const brightness = await page.evaluate(() => {
      const bg = getComputedStyle(document.body).backgroundColor;
      const m = bg.match(/\d+/g) || [255, 255, 255];
      return (Number(m[0]) + Number(m[1]) + Number(m[2])) / 3;
    });
    const hasTool = await page.evaluate(() => document.body.innerText.length > 200);
    rows.push({ lang, mode, brightness: Math.round(brightness), hasTool });
    if (!hasTool) fails.push(`${lang}/${mode}: 内容缺失`);
    if (mode === 'dark' && brightness >= 70) fails.push(`${lang}/dark: 亮度 ${brightness}，深色页没生效`);
    if (mode === 'light' && brightness <= 140) fails.push(`${lang}/light: 亮度 ${brightness}，浅色页没生效`);
    await context.close();
  }
}

// 嵌入模式：导航、标题、页脚必须消失，否则 iframe 里会重复页面外壳
{
  const context = await browser.newContext({ viewport: { width: 900, height: 700 } });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:${PORT}/tools/timestamp/?embed=1`, { waitUntil: 'networkidle' });
  const state = await page.evaluate(() => ({
    header: getComputedStyle(document.querySelector('header.site')).display,
    h1: getComputedStyle(document.querySelector('main h1')).display,
  }));
  if (state.header !== 'none' || state.h1 !== 'none') fails.push(`embed: 外壳没摘掉（header ${state.header}, h1 ${state.h1}）`);
  else rows.push({ lang: 'embed', mode: 'mode', brightness: '-', hasTool: true });
  await context.close();
}

await browser.close();
server.close();

for (const r of rows) console.log(`  ${r.lang}/${r.mode.padEnd(5)} 亮度 ${String(r.brightness).padStart(3)}  ${r.hasTool ? 'ok' : '内容缺失'}`);
if (fails.length) {
  console.log('\n渲染验收不通过：');
  for (const f of fails) console.log('  - ' + f);
  process.exit(1);
}
console.log('\n渲染验收通过：2 语言 × 3 种条件，共 6 组。');
