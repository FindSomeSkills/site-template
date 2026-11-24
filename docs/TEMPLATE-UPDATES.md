# 模板怎么更新，站点怎么跟

模板会一直改：验收脚本会发现新坑，布局会补模式，脚本会加参数。所以一开始就把「模板」和「站点内容」分开。

## 三条规则

1. **共享目录不手改。** `src/layouts`、`src/styles`、`src/components`、`scripts`、`public/_headers` 只在模板仓库里改。
2. **站点只动自己的。** `src/lib/site.mjs`、`src/pages`、`public/_redirects` 属于站点，模板更新不覆盖。
3. **每次更新都要过验收。** 同步完先 `npm run verify`，过了再提交。

## 站点怎么接更新

一次性配置：

```bash
git remote add template <模板仓库地址>
```

之后每次：

```bash
npm run sync              # 列出模板改了哪些共享文件
npm run sync -- --apply   # 接受共享部分（本站自己的文件不动）
npm run verify            # 必须过
```

冲突只在一种情况下出现：你手改了共享文件。那时不要强推，把改动挪回模板仓库，再重新同步。

## 模板自己怎么迭代

- 加一个模式（比如新的截图规则）→ 改共享部分 + 升版本号 + 写 `CHANGELOG.md`
- 站点的 `package.json` 里记着 `siteTemplate.shared` / `owned`，清单变了要同步改
- 破坏性改动（目录搬家、脚本参数改语义）→ 主版本号 +1，并在 CHANGELOG 写清迁移步骤
