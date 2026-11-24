// 站点自己的内容配置：改这里，不动 layouts / scripts。
// 新增一个工具页 = 往 tools 里加一条 + 写一个页面组件；新增文章 = 往 guides 里加一条。

export const SITE = {
  name: 'Example Toolbox',
  short: 'example',
  url: process.env.SITE_URL || 'http://localhost:4321',
  langs: ['en', 'zh'],
  nav: {
    en: [
      { label: 'Tools', href: '/#tools' },
      { label: 'Guides', href: '/guides/' },
      { label: '中文', href: '/zh/' },
    ],
    zh: [
      { label: '工具', href: '/zh/#tools' },
      { label: '指南', href: '/zh/guides/' },
      { label: 'English', href: '/' },
    ],
  },
  home: {
    en: {
      title: 'Example Toolbox — small tools that run in the browser',
      h1: 'Small tools, no signup',
      lede: 'A template home page. Each card is one tool page; the layout, theme and acceptance checks are already in place.',
      note: 'Two demo tools are wired up. Replace them with the ones you actually need.',
    },
    zh: {
      title: '示例工具箱 —— 跑在浏览器里的小工具',
      h1: '小工具，不用注册',
      lede: '这是模板的首页。每张卡对应一个工具页，布局、主题、验收脚本都已经就位。',
      note: '目前挂的是两个演示工具，换成你真正要做的那些即可。',
    },
  },
  tools: [
    {
      slug: 'timestamp',
      en: {
        title: 'Unix timestamp converter',
        h1: 'Unix timestamp converter',
        lede: 'Paste a timestamp or a date. Both sides update as you type. Runs entirely in the browser.',
        desc: 'Convert a Unix timestamp to a local date and back, without sending anything to a server.',
        kind: 'tool',
      },
      zh: {
        title: 'Unix 时间戳转换',
        h1: 'Unix 时间戳转换',
        lede: '粘一个时间戳或日期，两边随输入更新。全部在浏览器里跑。',
        desc: '时间戳与本地日期互转，不上传任何数据。',
        kind: 'tool',
      },
    },
    {
      slug: 'slugify',
      en: {
        title: 'Slug generator',
        h1: 'Slug generator',
        lede: 'Turn a title into a URL slug. Lowercase, ASCII, hyphens, no server round-trip.',
        desc: 'Convert a title into a URL-safe slug in the browser, with the rules visible in the page.',
        kind: 'tool',
      },
      zh: {
        title: 'URL slug 生成',
        h1: 'URL slug 生成',
        lede: '把标题变成 URL slug：小写、ASCII、连字符，不联网。',
        desc: '在浏览器里把标题转成 URL 安全的 slug，规则写在页面上。',
        kind: 'tool',
      },
    },
  ],
  guides: [
    {
      slug: 'example-error',
      en: {
        title: 'Example error — what it means and what to run',
        h1: 'Example error: connection refused',
        desc: 'The shape of an error guide: the message verbatim, the cause, the command, and how you know it is fixed.',
        sections: [
          {
            h: 'The error, verbatim',
            p: ['Copy the message exactly as it appears. People search the string, not your paraphrase of it.'],
          },
          {
            h: 'What causes it',
            p: ['One paragraph. Name the layer: the process, the network, the configuration. If the same message can come from two layers, say how to tell them apart.'],
          },
          {
            h: 'The fix',
            p: ['One command or one setting. If it needs three steps, list them; if it needs a guess, say what to check first.'],
          },
          {
            h: 'How you know it is fixed',
            p: ['Describe the observable result, not "it should work now".'],
          },
        ],
      },
      zh: {
        title: '示例报错 —— 什么意思、该敲哪条命令',
        h1: '示例报错：connection refused',
        desc: '报错页的标准形状：原文、原因、修法、怎么算修好。',
        sections: [
          { h: '报错原文', p: ['照抄原文。人搜的是那串字，不是你的转述。'] },
          { h: '什么导致的', p: ['一段话，点名是哪一层：进程、网络、配置。同一个提示如果可能来自两层，写清怎么区分。'] },
          { h: '怎么修', p: ['一条命令或一个设置。要三步就列三步；要猜就先说查哪里。'] },
          { h: '怎么算修好', p: ['写可观察的结果，不写「这下应该好了」。'] },
        ],
      },
    },
    {
      slug: 'adding-a-tool',
      en: {
        title: 'Adding a tool to this template',
        h1: 'Adding a tool',
        desc: 'Where a new tool page goes, what the card needs, and which checks must pass before it ships.',
        sections: [
          {
            h: 'One entry, one page, one card',
            p: [
              'Add the entry to `src/lib/site.mjs` under `tools`, write `src/pages/tools/<slug>.astro` for English and the zh copy under `src/pages/zh/tools/<slug>.astro`, and the home page picks up the card automatically.',
            ],
            code: 'src/lib/site.mjs\nsrc/pages/tools/<slug>.astro\nsrc/pages/zh/tools/<slug>.astro',
          },
          {
            h: 'What the page must contain',
            p: [
              'A heading, one sentence saying what it does, the tool itself, and a short section explaining the rules it applies. The embed block is shared; it appears on any page that imports it.',
            ],
          },
          {
            h: 'Before it ships',
            p: [
              'Run `npm run verify`. It builds, checks every page for the basics, and renders each language in light, dark and no-JS mode. A tool that fails the dark check is usually one with a hardcoded colour.',
            ],
          },
        ],
      },
      zh: {
        title: '往这个模板里加一个工具',
        h1: '加一个工具',
        desc: '新工具页放哪、卡片要什么、上线前必须过哪些检查。',
        sections: [
          {
            h: '一条配置、一个页面、一张卡片',
            p: ['在 `src/lib/site.mjs` 的 `tools` 里加一条，写 `src/pages/tools/<slug>.astro` 和 `src/pages/zh/tools/<slug>.astro`，首页的卡片会自动出现。'],
            code: 'src/lib/site.mjs\nsrc/pages/tools/<slug>.astro\nsrc/pages/zh/tools/<slug>.astro',
          },
          {
            h: '页面里要有什么',
            p: ['标题、一句说明它做什么、工具本体、一小节讲它按什么规则算。嵌入块是共用的，哪个页面 import 就在哪个页面出现。'],
          },
          {
            h: '上线前',
            p: ['跑 `npm run verify`：构建、逐页检查基本功、每种语言各渲染浅色/深色/无 JS 三种。深色检查挂了，基本都是写死了颜色。'],
          },
        ],
      },
    },
  ],
};

export const t = (obj, lang) => obj[lang] ?? obj.en;
