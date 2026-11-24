import { defineConfig } from 'astro/config';

// 站点地址从环境变量来，本地默认 localhost。
// 部署到 Cloudflare Pages / 任意静态托管都可以，构建产物是纯静态。
const site = process.env.SITE_URL || 'http://localhost:4321';

export default defineConfig({
  site,
  trailingSlash: 'always',
  build: { format: 'directory' },
});
