# Awesome DSH Plugins

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[bed1673](https://github.com/kejixiaoliang/awesome-dsh-plugins/tree/bed16737b10bc4b65658328bc27d3e4b68bd6c39)

<!-- BEGIN META -->
[![GitHub ★ 73](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=73&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/kejixiaoliang/awesome-dsh-plugins)
<!-- END META -->

> **功能**：按人工分类清单生成双语索引和可搜索静态插件目录

> **亮点**：[Q01](#research-q01) [Q01](#research-q01) 集中分类、描述、安装文本和检索入口。

> **主要限制**：[Q03](#research-q03) [Q03](#research-q03) 仅格式/重复/链接检查，无目标版本或质量认证。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程亮点](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 目录自身交付什么？](#detail-section-11)
  - [Q02 · 清单如何生成并更新？](#detail-section-12)
  - [Q03 · 格式校验和收录是否构成质量保证？](#detail-section-13)
  - [Q04 · 读者和维护者怎样采用退出？](#detail-section-14)
  - [Q05 · 分类入口怎样证伪便利收益？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：想发现DSH生态候选的读者需要分类入口。

GitHub关键词搜索与普通链接清单。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 多入口目录 | 同分类源派生README/INDEX/data.js | 描述与命令人工提供 |
| 静态检索 | 按字段、类别和star筛 | 星数非实时或质量证据 |
| 维护校验 | 格式重复与HTTP链接检查 | 不运行目标或核版本 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 浏览器或Markdown阅读器 | 读者 | 静态发现 | 无DSH运行时 |
| Node与分类清单 | 维护者 | 生成多份派生数据 | 缺文件可能跳过/生成不全 |
| GitHub token和Actions权限 | 自动探星/发布 | 查star并推生成变更 | 失败保旧值需查日志 |
| 目标插件环境 | 安装另需 | 独立安装/验收 | 目录不提供兼容保证 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 发现 | 搜索分类，记录原仓链接和需求 | 不以star替代任务匹配 |
| 复核 | 回原仓固定SHA查安装与权限 | 命令仅复制未执行 |
| 退出/维护 | 关闭阅读；维护者停CI撤token保清单 | 已装第三方另移除 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 静态文件阅读资源未知 | 按需求找候选耗时未知 | 无需账号；人工核验时间未知 |
| 持续 | CI请求与静态工件资源未知 | 维护分类/描述/失效链接耗时未知 | 实际费用与更新耗时未知 |
| 恢复 | 生成差异及第三方包资源未知 | 停CI撤token，另卸已装包耗时未知 | 目录退出不管目标运行 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 检索 | 实际按字段分类排序 | 合格命中和省时未测 |
| 一致性维护 | 生成器读取统一清单 | 远端CI与派生产物当前一致性未运行 |
| 格式质量 | 正则和去重校验 | 安装质量和安全完全另验 |

> **思考**：[Q03](#research-q03) [Q03](#research-q03) 仅格式/重复/链接检查，无目标版本或质量认证。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) [Q01](#research-q01) 集中分类、描述、安装文本和检索入口。

核生成、探星、校验、CI和Web检索实现，未执行。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) [Q03](#research-q03) 仅格式/重复/链接检查，无目标版本或质量认证。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) [Q04](#research-q04) 仅发现与跳转，安装目标另固定版本隔离验收。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的判断分类聚合资源怎样帮助发现并维持描述与安装边界。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.zh.md、web/README.md、web/app.js、scripts/gen-web-data.mjs、scripts/gen-readme.mjs、scripts/probe-stars.mjs、.github/workflows/sync.yml、scripts/validate.mjs、CONTRIBUTING.md、.github/workflows/linkcheck.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的判断分类聚合资源怎样帮助发现并维持描述与安装边界。未执行目标代码或实际宿主验证。
- 下一步：保留候选集合、需求和独立验收，别用star作为正确标签

**分析版本**

- **仓库**：[kejixiaoliang/awesome-dsh-plugins](https://github.com/kejixiaoliang/awesome-dsh-plugins)
- **版本号**：未声明（[固定提交 bed1673](https://github.com/kejixiaoliang/awesome-dsh-plugins/tree/bed16737b10bc4b65658328bc27d3e4b68bd6c39)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) [Q05](#research-q05) 检索便利是否减少时间需相同候选集验证。

保留候选集合、需求和独立验收，别用star作为正确标签

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 27 | 2901 | — | — | 57235 |
| .mjs | source | 5 | 468 | 365 | 50 | — |
| .js | source | 2 | 3936 | 3895 | 363 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/kejixiaoliang/awesome-dsh-plugins/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断分类聚合资源怎样帮助发现并维持描述与安装边界

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 目录自身交付什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

root是resource：人工维护分类清单、双语README、扁平INDEX和静态web目录，不是可安装DSH插件或运行时。README自称353条/14类，是固定版本作者统计，不代表已验证353个插件功能。它相对散落仓库链接增加分类、描述、star和安装命令的统一入口；web实际有搜索/筛选/排序/复制，与README“不做站点”表述有差异，应按静态实现范围理解。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:17-44](https://github.com/kejixiaoliang/awesome-dsh-plugins/blob/bed16737b10bc4b65658328bc27d3e4b68bd6c39/README.zh.md#L17-L44)

作者定位与用法

<details>
<summary>查看原文（28行）</summary>

```text
## 🧭 这是什么

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 是 DeepSeek 开源的 agent harness——既是可直接运行的 Coding Agent，底层又是一套「**一切皆插件**」的框架：模型、工具、沙箱、会话存储、UI、乃至 Agent Loop 本身都是插件。

本仓库是一个**社区维护的插件索引**，只做一件事：**把散落在 GitHub 上的 DSH 插件按分类整理好，让你直接在仓库里浏览、点击跳转到对应仓库**。不做站点、不做运行时，纯粹是一份可读、可跳转、可贡献的目录。

- ✅ 官方安装：`dsh plugin --profile <name> add <pkg>`（转发 pnpm，支持 npm / git / tarball）
- ✅ 官方发现渠道：npm + GitHub [`dsh-plugin`](https://github.com/topics/dsh-plugin) topic（**无官方内置市场**）

## ✨ 为什么选这个目录

已经有多个 `awesome-dsh-*` 列表，本目录的不同在于：

- **14 个手选自研分类**，边界清晰（见 [分类定义](docs/taxonomy.md)），不是一锅乱炖
- **每条附 star + 安装命令**，一眼判断热度、一键安装
- **双语**（英文主 + 中文），一键切换
- **README 内折叠浏览**，不用跳转就能看完全部分类
- **机器可读数据**（[web/data.js](web/data.js)）+ 生成脚本 + 自动同步 CI

## ⚡ 快速开始

三种用法，任选其一：

1. **浏览**：展开下方任意分类（或点进分类文件），每条插件点链接直达 GitHub 仓库。
2. **搜索**：在仓库页按 `t`（或 `Ctrl+F`）搜关键词，如 `mcp`、`记忆`、`TUI`、`飞书`、`多Agent`。
3. **机器消费**：直接读 [`web/data.js`](web/data.js)（由 14 类清单生成，说明见 [web/README.md](web/README.md)）。

## 🔥 热门插件
```

</details>

**依据 2 · 作者声明**：[web/README.md:1-41](https://github.com/kejixiaoliang/awesome-dsh-plugins/blob/bed16737b10bc4b65658328bc27d3e4b68bd6c39/web/README.md#L1-L41)

静态网页范围

<details>
<summary>查看原文（41行）</summary>

````text
# web/ — 插件目录展示页

> 一个**纯静态、零构建**的 DeepSeek Harness（`dsh`）插件目录展示页。
> 把本仓库的 14 类插件清单做成能搜索、能筛选、能一键复制安装命令的网页。

## 快速预览

三种方式任选其一：

1. **直接双击 `web/index.html`**（最简单）
   数据已经内联进 `web/data.js`，不依赖服务器、不受 `file://` 的 CORS 限制，双击即可打开。

2. **本地静态服务器**（推荐，体验和线上一致）
   ```bash
   # 任选其一
   npx serve web
   python -m http.server 8899 --directory web
   # 然后浏览器打开 http://127.0.0.1:8899/
   ```

3. **部署到 GitHub Pages**（可选）
   纯静态无需构建，把 `web/` 推上去配 Pages 即可（见下文「部署」）。

## 文件结构

```
web/
  index.html   页面结构（头部统计 / 搜索 / 分类 chips / 卡片网格 / 详情弹窗）
  styles.css   样式（简洁现代浅色）
  app.js       交互逻辑（搜索 / 筛选 / 排序 / 复制 / 详情弹窗）
  data.js      数据（由脚本生成，内联 window.__DSH_DATA__）
  README.md    本文档
```

## 功能

- **实时搜索**：匹配名称 / 描述 / 仓库 / 安装命令 / 分类（`Ctrl+K` 快速聚焦搜索框）
- **14 类筛选**：顶部 chips 点选分类，显示每类插件数
- **排序**：⭐ 最多 / ⭐ 最少 / 名称 A→Z
- **详情弹窗**：点卡片看完整描述、GitHub 仓库、安装命令
- **一键复制**：安装命令一键复制（Clipboard API + 降级方案）
````

</details>

**依据 3 · 源码核查**：[web/app.js:120-143](https://github.com/kejixiaoliang/awesome-dsh-plugins/blob/bed16737b10bc4b65658328bc27d3e4b68bd6c39/web/app.js#L120-L143)

实际搜索和排序

<details>
<summary>查看原文（24行）</summary>

```text
  function filteredPlugins() {
    const q = state.query.trim().toLowerCase();
    let list = plugins;
    if (state.category !== null) {
      list = list.filter((p) => p.category === state.category);
    }
    if (q) {
      list = list.filter((p) => {
        const hay = [
          p.name, p.owner, p.repo, p.description, p.install,
          catLabel(p.category),
        ].filter(Boolean).join(' ').toLowerCase();
        return hay.includes(q);
      });
    }
    const sorted = [...list];
    if (state.sort === 'stars-desc') {
      sorted.sort((a, b) => (b.stars ?? -1) - (a.stars ?? -1));
    } else if (state.sort === 'stars-asc') {
      sorted.sort((a, b) => (a.stars ?? -1) - (b.stars ?? -1));
    } else if (state.sort === 'name-asc') {
      sorted.sort((a, b) => a.name.localeCompare(b.name, 'zh'));
    }
    return sorted;
```

</details>

#### 缺口

- 分类是否提高目标插件命中率未测
  **影响**：不能按列表规模或star排序推采用质量
  **进一步探讨**：用同一需求与候选集对照原始搜索和分类目录

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 清单如何生成并更新？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

taxonomy指定plugins/*.md，生成脚本逐行解析链接、描述、star和末尾dsh命令，输出window.__DSH_DATA__及生成时间；不是运行时拉实时GitHub。gen-readme另用descriptions-en映射，缺英文回中文，热门按star前10。probe-stars只探已收录仓库，20个并发，更新star，改名/404只控制台报告，网络/限流吞掉保留旧值；不会自动发现新插件。sync CI每3小时执行探星与三个生成器并commit/push，linkcheck每周lychee仅查可访问性。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/gen-web-data.mjs:26-109](https://github.com/kejixiaoliang/awesome-dsh-plugins/blob/bed16737b10bc4b65658328bc27d3e4b68bd6c39/scripts/gen-web-data.mjs#L26-L109)

实际解析和静态产物

<details>
<summary>查看原文（84行）</summary>

```text
// 1) 分类表
const taxonomy = readJson(join(ROOT, 'data', 'taxonomy.json'), { categories: [] });
const categories = taxonomy.categories || [];

// 2) 解析 plugins/*.md
const plugins = [];
const perCategory = new Map(); // catId -> count

for (const cat of categories) {
  let text = '';
  try {
    text = readFileSync(join(ROOT, 'plugins', cat.file), 'utf8');
  } catch {
    console.warn(`⚠️  跳过：找不到 plugins/${cat.file}`);
    continue;
  }

  let count = 0;
  for (const line of text.split(/\r?\n/)) {
    const link = line.match(/^-\s*\[([^\]]+)\]\(([^)]+)\)/);
    if (!link) continue;

    const name = link[1].trim();
    const url = link[2].trim();
    let rest = line.slice(link[0].length);

    // 安装命令：行尾最后一个以 `dsh` 开头的反引号片段
    let install = null;
    const instMatch = rest.match(/`(dsh[^`]*)`\s*$/);
    if (instMatch) {
      install = instMatch[1];
      rest = rest.slice(0, instMatch.index);
    }

    // star：⭐ 后跟数字（可能含千分位逗号）
    let stars = null;
    const starMatch = rest.match(/⭐\s*([\d,]+)/);
    if (starMatch) {
      stars = parseInt(starMatch[1].replace(/,/g, ''), 10);
      rest = rest.replace(/⭐\s*[\d,]+/, '');
    }

    // 描述：去掉前导「 — 」与尾部「 · 」
    const description = rest
      .replace(/^\s*—\s*/, '')
      .replace(/\s*·\s*$/, '')
      .trim();

    const gh = url.match(/github\.com\/([^/]+)\/([^/]+)/);
    const owner = gh ? gh[1] : '';
    const repo = gh ? gh[2] : '';

    plugins.push({
      name,
      url,
      owner,
      repo,
      description,
      stars,
      install,
      category: cat.id,
    });
    count += 1;
  }
  perCategory.set(cat.id, count);
}

// 3) 产出 data.js
const data = {
  generatedAt: new Date().toISOString(),
  source: 'scripts/gen-web-data.mjs',
  stats: {
    plugins: plugins.length,
    categories: categories.length,
    withInstall: plugins.filter((p) => p.install).length,
    withStars: plugins.filter((p) => typeof p.stars === 'number').length,
  },
  categories,
  plugins,
};

mkdirSync(WEB_DIR, { recursive: true });
writeFileSync(
  join(WEB_DIR, 'data.js'),
```

</details>

**依据 2 · 源码核查**：[scripts/gen-readme.mjs:18-46](https://github.com/kejixiaoliang/awesome-dsh-plugins/blob/bed16737b10bc4b65658328bc27d3e4b68bd6c39/scripts/gen-readme.mjs#L18-L46)

双语映射与回退

<details>
<summary>查看原文（29行）</summary>

```text
// 英文描述映射（fullName 小写 -> 英文描述），用于英文版 README
let EN_DESC = {}
try {
  EN_DESC = JSON.parse(readFileSync(join(ROOT, 'data', 'descriptions-en.json'), 'utf8'))
} catch { /* 文件不存在则回退中文描述 */ }

// 把一行 `- [name](url) — 描述 [⭐N] [· \`install\`]` 解析成字段
function parseEntry(line) {
  const m = line.match(/^-\s*\[([^\]]+)\]\((https:\/\/github\.com\/([^/]+\/[^)/?#]+))\)\s*—\s*(.*)$/)
  if (!m) return null
  let [, name, url, full, rest] = m
  let install = ''
  const im = rest.match(/\s*·\s*(`[^`]+`)\s*$/)
  if (im) { install = im[1]; rest = rest.replace(/\s*·\s*`[^`]+`\s*$/, '') }
  let star = 0
  const sm = rest.match(/\s*⭐\s*(\d+)\s*$/)
  if (sm) { star = Number(sm[1]); rest = rest.replace(/\s*⭐\s*\d+\s*$/, '') }
  return { name, url, full: full.toLowerCase(), desc: rest.trim(), star, install }
}

// 英文版用英文描述，中文版用中文描述
function getDesc(e, lang) {
  if (lang === 'en' && EN_DESC[e.full]) return EN_DESC[e.full]
  return e.desc
}

const esc = (s) => s.replace(/\|/g, '\\|')

function extractEntries(file) {
```

</details>

**依据 3 · 源码核查**：[scripts/probe-stars.mjs:26-81](https://github.com/kejixiaoliang/awesome-dsh-plugins/blob/bed16737b10bc4b65658328bc27d3e4b68bd6c39/scripts/probe-stars.mjs#L26-L81)

探星与错误保留

<details>
<summary>查看原文（56行）</summary>

```text
// 2. 探测实时 star（分批并发），并检测改名 / 死仓库
const H = { Authorization: `Bearer ${token}`, 'User-Agent': 'dsh-probe', Accept: 'application/vnd.github+json' }
const starMap = new Map() // 小写 fullName -> stars
const renamed = [] // { from, to }
const dead = [] // fullName
const fulls = [...listed]

for (let i = 0; i < fulls.length; i += 20) {
  const batch = fulls.slice(i, i + 20)
  await Promise.all(batch.map(async (full) => {
    try {
      const res = await fetch(`https://api.github.com/repos/${full}`, { headers: H })
      if (res.status === 404) { dead.push(full); return }
      if (!res.ok) return
      const repo = await res.json()
      if (typeof repo.stargazers_count === 'number') starMap.set(full, repo.stargazers_count)
      // 改名检测：GitHub 对改名仓库返回重定向，full_name 是新名字
      if (repo.full_name && repo.full_name.toLowerCase() !== full) {
        renamed.push({ from: full, to: repo.full_name })
      }
    } catch { /* 网络/限流错误，忽略 */ }
  }))
}

// 3. 更新 plugins/*.md 每个条目的 ⭐（保留已有 install 命令）
let mdUpdated = 0
for (const f of CATEGORY_FILES) {
  const path = join(PLUGINS_DIR, f)
  const content = readFileSync(path, 'utf8')
  const lines = content.split('\n')
  const out = lines.map((line) => {
    const m = line.match(/^(-\s*\[[^\]]+\]\(https:\/\/github\.com\/([^/]+\/[^)/?#]+)\)\s*—\s*)(.*)$/)
    if (!m) return line
    const linkPart = m[1]
    const full = m[2].toLowerCase()
    const rest = m[3]
    if (!starMap.has(full)) return line
    const newStar = starMap.get(full)
    const existingInstall = rest.match(/`dsh plugin add ([^`]+)`/)?.[1] ?? null
    let clean = rest.replace(/\s*⭐\s*\d+/g, '').replace(/\s*·\s*`dsh plugin add [^`]+`/g, '').trimEnd()
    let tail = ''
    if (newStar > 0) tail += ` ⭐${newStar}`
    if (existingInstall) tail += ` · \`dsh plugin add ${existingInstall}\``
    mdUpdated++
    return `${linkPart}${clean}${tail}`
  })
  writeFileSync(path, out.join('\n'))
}

console.log(`探测 ${listed.size} 个仓库，md 更新 ${mdUpdated} 条`)
if (renamed.length) {
  console.log(`\n⚠️ 改名仓库 ${renamed.length} 个：`)
  for (const r of renamed) console.log(`  ${r.from} → ${r.to}`)
}
if (dead.length) {
  console.log(`\n❌ 死仓库（404）${dead.length} 个：`)
```

</details>

**依据 4 · 源码核查**：[.github/workflows/sync.yml:1-35](https://github.com/kejixiaoliang/awesome-dsh-plugins/blob/bed16737b10bc4b65658328bc27d3e4b68bd6c39/.github/workflows/sync.yml#L1-L35)

定时生成并推送

<details>
<summary>查看原文（35行）</summary>

```text
name: sync-data

on:
  schedule:
    - cron: '0 */3 * * *'    # 每 3 小时
  workflow_dispatch:          # 支持手动触发

permissions:
  contents: write

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # 直接探测目录里每个插件的实时 GitHub star（不依赖上游 star 快照）。
      - name: Probe live GitHub stars
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: node scripts/probe-stars.mjs

      - name: Regenerate README, INDEX and web data
        run: |
          node scripts/gen-index.mjs
          node scripts/gen-readme.mjs
          node scripts/gen-web-data.mjs

      - name: Commit and push
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add plugins/ INDEX.md README.md README.zh.md web/data.js
          git commit -m "chore: sync live stars from GitHub" || exit 0
          git push
```

</details>

#### 缺口

- 本轮未执行生成器或远端CI，线上产物同步时效未核
  **影响**：旧星数可保留且派生产物可能滞后，不能宣称实时
  **进一步探讨**：核清单与data.js生成时间/条目，对照一次失败探测日志

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 格式校验和收录是否构成质量保证？

**研究主题**：缺陷与关键质疑

#### 完整回答

validate仅核条目正则、GitHub URL形状及小写owner/repo重复；不安装、不核manifest/提交/依赖，也不验证附带命令。贡献指南列公开代码、非恶意等要求且明确收录不背书，但这不是自动审计实现。链接检查接受重定向和HTTP成功，不证明兼容。star可反映根仓整合/宿主关注而非某组件能力，条目没有固定SHA验证绑定。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/validate.mjs:13-49](https://github.com/kejixiaoliang/awesome-dsh-plugins/blob/bed16737b10bc4b65658328bc27d3e4b68bd6c39/scripts/validate.mjs#L13-L49)

仅格式/重复本地校验

<details>
<summary>查看原文（37行）</summary>

```text
const CATEGORY_FILES = taxonomy.categories.map((c) => c.file)

const ENTRY_RE = /^-\s*\[[^\]]+\]\(https:\/\/github\.com\/[^)]+\)\s*—\s*.*$/

const errors = []

// 目录条目格式 + 重复仓库校验
const seen = new Map() // fullName(小写) -> 分类文件
let total = 0
for (const f of CATEGORY_FILES) {
  const content = readFileSync(join(PLUGINS_DIR, f), 'utf8')
  for (const line of content.split('\n')) {
    if (!line.startsWith('- [')) continue
    if (!ENTRY_RE.test(line)) {
      errors.push(`格式错误 [${f}]: ${line.trim().slice(0, 70)}`)
      continue
    }
    const m = line.match(/\(https:\/\/github\.com\/([^/]+\/[^)/?#]+)\)/)
    if (m) {
      const full = m[1].toLowerCase()
      total++
      if (seen.has(full)) {
        errors.push(`重复仓库 [${f}]: ${full}（已见于 ${seen.get(full)}）`)
      } else {
        seen.set(full, f)
      }
    }
  }
}

if (errors.length) {
  console.error(`校验失败，共 ${errors.length} 个问题：`)
  for (const e of errors) console.error('  ✗ ' + e)
  process.exit(1)
}

console.log(`校验通过：目录 ${total} 条（唯一 ${seen.size}），无格式错误、无重复`)
```

</details>

**依据 2 · 作者声明**：[CONTRIBUTING.md:21-35](https://github.com/kejixiaoliang/awesome-dsh-plugins/blob/bed16737b10bc4b65658328bc27d3e4b68bd6c39/CONTRIBUTING.md#L21-L35)

收录标准

<details>
<summary>查看原文（15行）</summary>

```text

## 收录与拒收标准

**收录（YES）**：
- 是 DeepSeek Harness（`dsh`）专属插件/技能/MCP/皮肤/桌面端等，可通过 `dsh plugin add` 或 `.dsh-plugin` / `dsh.plugin.json` 安装
- 有公开 GitHub 仓库、有 README、有可运行代码

**拒收（NO）**：
- 通用 Claude / Codex / Cursor 插件（除非明确支持 DSH，并在 README 里说明）
- 无 README、无代码的占位仓库
- 已归档且彻底失效（可标记「已归档」而非直接删除，除非无法访问）
- 明显恶意、窃取凭据、含后门的插件
- 纯付费/闭源插件（可收录，但需在描述注明「付费/闭源」）

> 边界模糊时，开 Issue 讨论，不擅自拒收。
```

</details>

**依据 3 · 作者声明**：[CONTRIBUTING.md:62-66](https://github.com/kejixiaoliang/awesome-dsh-plugins/blob/bed16737b10bc4b65658328bc27d3e4b68bd6c39/CONTRIBUTING.md#L62-L66)

不背书声明

```text
见 [docs/taxonomy.md](docs/taxonomy.md)。一个插件可跨多个分类，但以最贴切的一个为主分类，避免重复收录。

## 免责声明

收录不代表安全/质量背书。安装第三方插件即运行第三方代码，请自行审阅源码、风险自担。
```

**依据 4 · 源码核查**：[.github/workflows/linkcheck.yml:17-29](https://github.com/kejixiaoliang/awesome-dsh-plugins/blob/bed16737b10bc4b65658328bc27d3e4b68bd6c39/.github/workflows/linkcheck.yml#L17-L29)

仅HTTP链接检测

<details>
<summary>查看原文（13行）</summary>

```text

      - name: Check links
        id: lychee
        uses: lycheeverse/lychee-action@v2
        with:
          update-existing: true
          args: --no-progress --accept 200,201,204,301,302,304,307,308 --timeout 20 --max-redirects 3 --exclude 'img\.shields\.io' '**/*.md'
          fail: true
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Open issue on dead links
        if: failure()
```

</details>

#### 缺口

- 每个链接目标的当前兼容、安全和安装命令未在本轮审计
  **影响**：复制命令执行会运行第三方代码，不能把目录校验通过当安装通过
  **进一步探讨**：回原仓固定版本读manifest与权限，在独立profile验收目标

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 读者和维护者怎样采用退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

读者可离线读README/INDEX或打开web静态页，无DSH凭据；复制按钮只写剪贴板，不执行命令。真正安装另在用户宿主进行，停用目录不移除已安装包。维护者需Node生成脚本与GitHub token做探星，自动CI有contents:write和linkcheck issues:write；分类/双语描述仍人工审核。首次整理/同步，持续链接纠错和分类维护，失败恢复对照原清单重生成；停定时CI和撤token后可归档静态产物，无目标插件生命周期管理。

#### 证据与依据

**依据 1 · 源码核查**：[web/app.js:66-89](https://github.com/kejixiaoliang/awesome-dsh-plugins/blob/bed16737b10bc4b65658328bc27d3e4b68bd6c39/web/app.js#L66-L89)

复制仅剪贴板

<details>
<summary>查看原文（24行）</summary>

```text
  // 复制（Clipboard API + 降级方案）
  function copyText(text) {
    if (!text) return Promise.resolve(false);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(() => true, () => fallbackCopy(text));
    }
    return Promise.resolve(fallbackCopy(text));
  }
  function fallbackCopy(text) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }

```

</details>

**依据 2 · 源码核查**：[scripts/probe-stars.mjs:11-14](https://github.com/kejixiaoliang/awesome-dsh-plugins/blob/bed16737b10bc4b65658328bc27d3e4b68bd6c39/scripts/probe-stars.mjs#L11-L14)

探星token条件

```text
const token = process.env.GITHUB_TOKEN
if (!token) throw new Error('需要 GITHUB_TOKEN 环境变量')

const taxonomy = JSON.parse(readFileSync(join(ROOT, 'data', 'taxonomy.json'), 'utf8'))
```

**依据 3 · 源码核查**：[.github/workflows/sync.yml:8-35](https://github.com/kejixiaoliang/awesome-dsh-plugins/blob/bed16737b10bc4b65658328bc27d3e4b68bd6c39/.github/workflows/sync.yml#L8-L35)

CI权限与生成写入

<details>
<summary>查看原文（28行）</summary>

```text
permissions:
  contents: write

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # 直接探测目录里每个插件的实时 GitHub star（不依赖上游 star 快照）。
      - name: Probe live GitHub stars
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: node scripts/probe-stars.mjs

      - name: Regenerate README, INDEX and web data
        run: |
          node scripts/gen-index.mjs
          node scripts/gen-readme.mjs
          node scripts/gen-web-data.mjs

      - name: Commit and push
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add plugins/ INDEX.md README.md README.zh.md web/data.js
          git commit -m "chore: sync live stars from GitHub" || exit 0
          git push
```

</details>

**依据 4 · 作者声明**：[CONTRIBUTING.md:6-19](https://github.com/kejixiaoliang/awesome-dsh-plugins/blob/bed16737b10bc4b65658328bc27d3e4b68bd6c39/CONTRIBUTING.md#L6-L19)

人工收录步骤

<details>
<summary>查看原文（14行）</summary>

````text

1. **确认插件满足基本门槛**：
   - 是 DeepSeek Harness（`dsh`）插件/技能/MCP/皮肤/桌面端等，可通过 `dsh plugin add` 或 `.dsh-plugin` / `dsh.plugin.json` 安装；
   - 有公开 GitHub 仓库；
   - 有一句可读的功能描述。
2. **确认它不在目录里**（在对应分类文件里搜一下）。
3. **选择分类**：按 [docs/taxonomy.md](docs/taxonomy.md) 的 14 类边界，选最贴切的一个。
4. **在对应分类文件**（`plugins/<分类>.md`）里加一行：

```markdown
- [插件名](https://github.com/owner/repo) — 一句话描述
```

5. 可选：在描述末尾加 ` ⭐stars`、打包形态或协议（`static`/`dynamic`）。
````

</details>

#### 缺口

- 本轮未运行页面/脚本，CI消耗、人工整理及第三方安装成本未知
  **影响**：不能以静态零构建推整套使用零成本或可一键退出第三方
  **进一步探讨**：仅发现阶段采用，执行命令前独立复核；维护者先分支核派生差异

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 分类入口怎样证伪便利收益？

**研究主题**：新假设与验证

#### 完整回答

同一需求比较GitHub搜索、扁平INDEX和分类web，在相同候选集记录命中/误判、阅读耗时和原仓核验次数。加入失效链接、缺安装命令和高star无关项目；若筛选主要跟热度走或总核验时间未改善，则只把它当链接索引，回原始来源搜索。当前机制仅支持检索入口存在，不支持省时/安全收益。

#### 证据与依据

**依据 1 · 源码核查**：[web/app.js:120-143](https://github.com/kejixiaoliang/awesome-dsh-plugins/blob/bed16737b10bc4b65658328bc27d3e4b68bd6c39/web/app.js#L120-L143)

搜索字段和star排序对照

<details>
<summary>查看原文（24行）</summary>

```text
  function filteredPlugins() {
    const q = state.query.trim().toLowerCase();
    let list = plugins;
    if (state.category !== null) {
      list = list.filter((p) => p.category === state.category);
    }
    if (q) {
      list = list.filter((p) => {
        const hay = [
          p.name, p.owner, p.repo, p.description, p.install,
          catLabel(p.category),
        ].filter(Boolean).join(' ').toLowerCase();
        return hay.includes(q);
      });
    }
    const sorted = [...list];
    if (state.sort === 'stars-desc') {
      sorted.sort((a, b) => (b.stars ?? -1) - (a.stars ?? -1));
    } else if (state.sort === 'stars-asc') {
      sorted.sort((a, b) => (a.stars ?? -1) - (b.stars ?? -1));
    } else if (state.sort === 'name-asc') {
      sorted.sort((a, b) => a.name.localeCompare(b.name, 'zh'));
    }
    return sorted;
```

</details>

**依据 2 · 源码核查**：[scripts/validate.mjs:13-41](https://github.com/kejixiaoliang/awesome-dsh-plugins/blob/bed16737b10bc4b65658328bc27d3e4b68bd6c39/scripts/validate.mjs#L13-L41)

校验不覆盖质量

<details>
<summary>查看原文（29行）</summary>

```text
const CATEGORY_FILES = taxonomy.categories.map((c) => c.file)

const ENTRY_RE = /^-\s*\[[^\]]+\]\(https:\/\/github\.com\/[^)]+\)\s*—\s*.*$/

const errors = []

// 目录条目格式 + 重复仓库校验
const seen = new Map() // fullName(小写) -> 分类文件
let total = 0
for (const f of CATEGORY_FILES) {
  const content = readFileSync(join(PLUGINS_DIR, f), 'utf8')
  for (const line of content.split('\n')) {
    if (!line.startsWith('- [')) continue
    if (!ENTRY_RE.test(line)) {
      errors.push(`格式错误 [${f}]: ${line.trim().slice(0, 70)}`)
      continue
    }
    const m = line.match(/\(https:\/\/github\.com\/([^/]+\/[^)/?#]+)\)/)
    if (m) {
      const full = m[1].toLowerCase()
      total++
      if (seen.has(full)) {
        errors.push(`重复仓库 [${f}]: ${full}（已见于 ${seen.get(full)}）`)
      } else {
        seen.set(full, f)
      }
    }
  }
}
```

</details>

#### 缺口

- 没有本轮用户对照或目标插件验证
  **影响**：无法确认更快选到合格插件
  **进一步探讨**：保留候选集合、需求和独立验收，别用star作为正确标签

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
