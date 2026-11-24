# CHANGELOG

## 0.1.0 — 2026-11-25

第一个可运行骨架。

- Astro + 纯 CSS 主题：浅色默认，`?theme=dark` 覆盖，三态切换位留在脚本里
- `?shot=1` 与 `?embed=1` 两个模式；`_headers` 带 `frame-ancestors`
- 工具页、报错页两种页面形态，中英各一套
- sitemap 由 `site.mjs` 生成，条数参与验收
- `verify.mjs`：构建 + 逐页检查 + sitemap 对账 + 调 `visual-check`
- `visual-check.mjs`：2 语言 × 浅/深/无 JS，深色亮度 < 70、浅色 > 140
- `shoot.mjs`：按 main 边界裁切 2x 截图
- `deploy.mjs`：Cloudflare Pages
- `sync-template.mjs`：shared / owned 分离，站点按需接受模板更新
