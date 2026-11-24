# site-template

一个能直接开工的工具站骨架。不是教程，括号里每一条都是踩过的坑。

## 起步

```bash
npm install
npm run dev        # http://localhost:4321
npm run verify     # 构建 + 逐页检查 + 六组渲染验收
```

改 `src/lib/site.mjs` 里的站名、语言、工具与文章，页面自动出来。

## 目录里什么是你的，什么不是

| 目录 | 归属 | 说明 |
| --- | --- | --- |
| `src/lib/site.mjs` | **你的** | 站名、导航、工具列表、文章 |
| `src/pages/` | **你的** | 每个工具一个页面，加工具就是加页面 |
| `src/layouts/` | 共享 | 布局、主题脚本、截图与嵌入模式 |
| `src/styles/` | 共享 | 颜色 token，浅色默认，深色覆盖 |
| `src/components/` | 共享 | 页面组件与工具 UI |
| `scripts/` | 共享 | 验收、截图、部署、同步模板 |
| `public/_headers` | 共享 | 含 `frame-ancestors`，删了嵌入就白屏 |
| `public/_redirects` | **你的** | 合并页面时的 301 |

共享部分不要手改。要改就改模板仓库，再同步下来，否则每建一个站都在分叉。

## 常用命令

```bash
npm run build      # 静态产物在 dist/
npm run verify     # 发布前必跑
npm run visual     # 只跑六组渲染验收
npm run shoot /tools/timestamp/ out.png   # 只截工具本体，2x
npm run deploy     # 需要 CLOUDFLARE_API_TOKEN 与 CF_PAGES_PROJECT
npm run sync       # 预览模板更新；加 --apply 接受共享部分
```

## 这个骨架里已有的东西

- **浅色默认 + 三态主题**：`?theme=dark` 可覆盖，首屏内联脚本防白闪
- **`?shot=1`**：截图时摘掉导航与标题，只留工具本体
- **`?embed=1` + `frame-ancestors`**：别的站可以 iframe 引用，页面上直接给代码
- **两套页面形态**：工具页（输入输出在浏览器里跑）与报错页（原文、原因、命令、复验）
- **sitemap 自动生成**，条数与 `site.mjs` 对得上
- **验收脚本**：本机路径、字面量转义、英文页中文、深色页亮度、无 JS 内容缺失

## 为什么长这样

见 `docs/PLAYBOOK.md`（同一份内容已登记为 DSH 技能 `tool-site-build`，建站时会被自动加载）。那是从一个真站上归纳出来的：哪些做法有用、哪些是噪声、哪些是坑。
