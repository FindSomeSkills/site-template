// 部署到 Cloudflare Pages。需要两个环境变量：
//   CLOUDFLARE_API_TOKEN  账号级 token，Pages:Edit
//   CF_PAGES_PROJECT      项目名（在 Cloudflare 控制台建一次即可）
import { execFileSync } from 'node:child_process';

const token = process.env.CLOUDFLARE_API_TOKEN;
const project = process.env.CF_PAGES_PROJECT;
if (!token) {
  console.error('缺 CLOUDFLARE_API_TOKEN。放到 ~/.dsh/.credentials.yaml 或用户环境变量里，不要写进仓库。');
  process.exit(1);
}
if (!project) {
  console.error('缺 CF_PAGES_PROJECT（Cloudflare 上的 Pages 项目名）。');
  process.exit(1);
}
execFileSync('npx', ['astro', 'build'], { stdio: 'inherit', shell: true });
execFileSync(
  'npx',
  ['wrangler', 'pages', 'deploy', 'dist', '--project-name', project, '--branch', 'main'],
  { stdio: 'inherit', shell: true }
);
