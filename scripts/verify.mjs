// 发布前一条命令：构建、逐页基本功、语言清洁度、本机路径、sitemap 条数，最后跑渲染验收。
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { SITE } from '../src/lib/site.mjs';

const fail = [];
const pass = [];
const ok = (name) => pass.push(name);
const bad = (name, detail) => fail.push({ name, detail });

execFileSync('npx', ['astro', 'build'], { stdio: 'inherit', shell: true });
ok('构建通过');

const pages = [];
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p);
    else if (entry === 'index.html') pages.push(p);
  }
})('dist');

const cjk = /[\u4e00-\u9fa5]/;
let missingTitle = 0;
let missingDesc = 0;
let localPath = 0;
let literalEscape = 0;
let langLeak = 0;

for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const isZh = file.includes(`${join('dist', 'zh')}`) || file.includes('\\zh\\');
  if (!/<title>[^<]+<\/title>/.test(html)) missingTitle += 1;
  if (!/<meta name="description" content="[^"]+"/.test(html)) missingDesc += 1;
  const body = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<nav[\s\S]*?<\/nav>/g, '');
  if (/C:\\\\|Knowledge base|\/Users\//.test(body)) localPath += 1;
  if (body.includes('\\n') && /<p>[^<]*\\n[^<]*<\/p>/.test(body)) literalEscape += 1;
  if (!isZh) {
    const visible = body.replace(/<[^>]+>/g, ' ');
    if (cjk.test(visible)) langLeak += 1;
  }
}
pages.length ? ok(`生成了 ${pages.length} 个页面`) : bad('页面', '一个都没有');
missingTitle === 0 ? ok('每页都有 title') : bad('title', `${missingTitle} 页缺`);
missingDesc === 0 ? ok('每页都有 description') : bad('description', `${missingDesc} 页缺`);
localPath === 0 ? ok('没有本机路径') : bad('本机路径', `${localPath} 页含本机路径`);
literalEscape === 0 ? ok('没有字面量转义符') : bad('转义符', `${literalEscape} 页可疑`);
langLeak === 0 ? ok('英文页没有中文') : bad('语言混入', `${langLeak} 个英文页含中文`);

const sitemap = join('dist', 'sitemap.xml');
if (existsSync(sitemap)) {
  const xml = readFileSync(sitemap, 'utf8');
  const locs = (xml.match(/<loc>/g) || []).length;
  const expected = 1 + SITE.tools.length * 2 + SITE.guides.length * 2 + 3;
  locs === expected ? ok(`sitemap ${locs} 条，与配置一致`) : bad('sitemap', `${locs} 条，配置算出 ${expected}`);
} else {
  bad('sitemap', '没生成');
}

try {
  execFileSync('node', ['scripts/visual-check.mjs'], { stdio: 'inherit', shell: true });
  ok('六组渲染验收');
} catch {
  bad('渲染验收', '见上面的输出');
}

console.log('\n' + pass.map((p) => `  PASS  ${p}`).join('\n'));
if (fail.length) {
  console.log('\n' + fail.map((f) => `  FAIL  ${f.name}：${f.detail}`).join('\n'));
  process.exit(1);
}
console.log('\n全部通过。');
