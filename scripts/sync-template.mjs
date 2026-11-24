// 把模板的更新拉进一个已经建好的站。
// 设计前提：模板会一直改，站点一直长；两者必须在文件层面分开。
//   shared：布局、样式、组件、脚本、headers —— 站点不手改，直接接受模板更新
//   owned ：内容配置、页面、redirects —— 模板不覆盖，只提示差异
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const cfg = pkg.siteTemplate || {};
const shared = cfg.shared || [];
const owned = cfg.owned || [];
const apply = process.argv.includes('--apply');
const remote = process.env.TEMPLATE_REMOTE || 'template';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();

try {
  git('remote', 'get-url', remote);
} catch {
  console.error(`没有名为 ${remote} 的远端。先加一次：git remote add ${remote} <模板仓库地址>`);
  process.exit(1);
}

git('fetch', remote, '--quiet');
const range = `${remote}/main`;
const changed = git('diff', '--name-only', `HEAD...${range}`).split('\n').filter(Boolean);
const sharedChanged = changed.filter((f) => shared.some((s) => f === s || f.startsWith(s + '/')));
const ownedChanged = changed.filter((f) => owned.some((s) => f === s || f.startsWith(s + '/')));

console.log(`模板有 ${changed.length} 个文件变化，其中共享部分 ${sharedChanged.length} 个：`);
for (const f of sharedChanged) console.log('  ' + f);
if (ownedChanged.length) {
  console.log(`\n本站自己的部分也变了 ${ownedChanged.length} 个（模板不会覆盖，自己看要不要跟）：`);
  for (const f of ownedChanged.slice(0, 20)) console.log('  ' + f);
}
if (!sharedChanged.length) {
  console.log('\n共享部分没有更新。');
  process.exit(0);
}
if (!apply) {
  console.log('\n只预览。确认要接受共享部分更新：node scripts/sync-template.mjs --apply');
  process.exit(0);
}
execFileSync('git', ['checkout', range, '--', ...sharedChanged], { stdio: 'inherit' });
console.log('\n已把共享部分的更新取到工作区。跑 npm run verify，过了再提交。');
