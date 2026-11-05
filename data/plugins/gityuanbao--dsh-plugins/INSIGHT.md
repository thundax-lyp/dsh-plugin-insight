# DSH Plugins 中文导航

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[9c80866](https://github.com/gityuanbao/DSH-Plugins/tree/9c80866c143d2057670acc9baa47698561a626e3)

<!-- BEGIN META -->
[![GitHub ★ 85](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=85&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/gityuanbao/DSH-Plugins)
<!-- END META -->

> **功能**：提供带安装、起步建议与限制的插件发现目录

> **亮点**：[Q01](#research-q01) 增加采用线索的集中整理。

> **主要限制**：[Q03](#research-q03) 快照与来源类别不证明当前可装或安全。

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
  - [Q01 · 目录比链接合集多做了什么？](#detail-section-11)
  - [Q02 · 结构检查能维护什么？](#detail-section-12)
  - [Q03 · 核验标签的证据边界？](#detail-section-13)
  - [Q04 · 采用和退出需要什么？](#detail-section-14)
  - [Q05 · 怎样验证目录贡献？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：中文读者需从候选仓库走到可核查的安装起步。

自由搜索后逐个读README。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 采用线索目录 | 同时查看用途、人群、安装与限制 | 固定快照，需回源 |
| 结构校验 | 检查重复、链接和指标顺序 | 不执行第三方插件 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Git与文档浏览 | 必需 | 读取固定快照 | 无法据失效链接推断包状态 |
| 目标插件资料 | 安装前必需 | 核对版本、权限和兼容 | 缺失则停止安装决策 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 初筛 | 读者按需求记录候选与日期 | 候选可定位到仓库 |
| 核查 | 读者回源核对命令和权限 | 保留目标固定版本 |
| 退出 | 移除目录引用 | 已装第三方包独立卸载 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 浏览资源未知 | 筛选候选和回源核对耗时未知 | 文档无需宿主安装 |
| 持续 | 更新资源未知 | 人工重核快照和限制耗时未知 | JSON与README共同维护 |
| 恢复 | 退出资源未知 | 移除索引依赖耗时未知 | 第三方状态不属于本目录 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 字段覆盖 | 数据含功能、人群、安装和限制 | 读者初筛用时未测 |
| 来源核验 | 脚本要求来源类别及链接 | 主张和当前包一致性未知 |

> **思考**：[Q03](#research-q03) 快照与来源类别不证明当前可装或安全。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 增加采用线索的集中整理。

验证器覆盖链接、字段及快照排序。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 快照与来源类别不证明当前可装或安全。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 只作发现源，回源固定包版本并独立验收。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的帮助中文读者筛选下一步需独立核查的插件。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 data/plugins.json、README.md、scripts/validate-catalog.mjs、docs/METHODOLOGY.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的帮助中文读者筛选下一步需独立核查的插件。未执行目标代码或实际宿主验证。
- 下一步：保留需求、候选、回源结果和用时。

**分析版本**

- **仓库**：[gityuanbao/DSH-Plugins](https://github.com/gityuanbao/DSH-Plugins)
- **版本号**：1.0.0（[固定提交 9c80866](https://github.com/gityuanbao/DSH-Plugins/tree/9c80866c143d2057670acc9baa47698561a626e3)）
- **版本日期**：2026-08-16（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 可减少候选初筛时间，需对照时效核实。

保留需求、候选、回源结果和用时。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 7 | 1278 | — | — | 14122 |
| .mjs | source | 1 | 113 | 94 | 1 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/gityuanbao/DSH-Plugins/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/gityuanbao/DSH-Plugins/issues?q=is%3Aissue+created%3A2026-10-06T05%3A36%3A35.976Z..2026-11-05T05%3A36%3A35.976Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/gityuanbao/DSH-Plugins/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T05%3A36%3A35.976Z..2026-11-05T05%3A36%3A35.976Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：帮助中文读者筛选下一步需独立核查的插件

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 目录比链接合集多做了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

读者可按插件用途、人群、安装和首次操作一起筛选，避免找到仓库后仍不知道从哪开始。数据条目实际包含install、tip、caveats等字段，说明它提供的是整理后的采用线索，未经运行的第三方插件仍需回源核查。合格发现结果是找准仓库和包，再定位目标版本的依赖与风险。

#### 证据与依据

**依据 1 · 源码核查**：[data/plugins.json:9-33](https://github.com/gityuanbao/DSH-Plugins/blob/9c80866c143d2057670acc9baa47698561a626e3/data/plugins.json#L9-L33)

实际条目包含人群、安装和限制

<details>
<summary>查看原文（25行）</summary>

```text
      "id": "dsh-web-ui",
      "name": "dsh-web-ui",
      "repository": "zhu1090093659/dsh-web-ui",
      "url": "https://github.com/zhu1090093659/dsh-web-ui",
      "tier": "popular",
      "type": "integration-pack",
      "categories": ["ui", "workflow", "remote-access"],
      "function": "A Web UI plugin and theme pack with a task board, Git graph, file preview, mobile remote access, SSH, vision, usage stats, pets, and themes.",
      "audiences": ["DSH Web power users", "developers who want an all-in-one workbench"],
      "install": {
        "command": "dsh plugin --profile web add @linxin666/dsh-web-ui-all",
        "profile": "web",
        "pinned": false,
        "source": "npm"
      },
      "tip": "Install individual subpackages when you only need one feature; this reduces UI conflicts and makes failures easier to isolate.",
      "caveats": ["Large permission surface", "pnpm 11 release-age and hoisted-layout details require attention"],
      "license": "Apache-2.0",
      "metrics": {
        "stars": 2223,
        "forks": 118,
        "created_at": "2026-08-12T05:15:20Z",
        "pushed_at": "2026-08-15T07:42:56Z"
      },
      "verified_sources": ["repository-readme", "github-api", "dsh-plugin-topic"]
```

</details>

**依据 2 · 作者声明**：[README.md:7-12](https://github.com/gityuanbao/DSH-Plugins/blob/9c80866c143d2057670acc9baa47698561a626e3/README.md#L7-L12)

作者说明中文采用导引

```text
<p align="center">
  <strong>别再一个个翻仓库了。好用的、热门的、有点意思的 DSH 插件，都在这里。</strong>
</p>

<p align="center">
  不只给你一串链接——每个插件都写清楚：<strong>能做什么、适合谁、怎么安装、装完第一步怎么用，以及哪里容易踩坑。</strong>
```

#### 缺口

- 各条安装和限制是否仍匹配当前版本未核。
  **影响**：过期指引可能让读者安装错误包或忽略新权限。
  **进一步探讨**：抽取三种需求逐条核对实际仓库。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 结构检查能维护什么？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

验证器检查身份唯一、仓库URL和README链接、必填采用字段、快照指标和分层排序。方法文档规定popular按快照star门槛排序，且star不代表质量。脚本没有实际安装或动态安全检查。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/validate-catalog.mjs:37-75](https://github.com/gityuanbao/DSH-Plugins/blob/9c80866c143d2057670acc9baa47698561a626e3/scripts/validate-catalog.mjs#L37-L75)

字段与唯一性检查

<details>
<summary>查看原文（39行）</summary>

```text
for (const [index, plugin] of (catalog.plugins ?? []).entries()) {
  const prefix = `plugins[${index}]${plugin?.id ? ` (${plugin.id})` : ''}`;
  const required = [
    'id', 'name', 'repository', 'url', 'tier', 'type', 'categories', 'function',
    'audiences', 'install', 'tip', 'caveats', 'license', 'metrics', 'verified_sources'
  ];

  for (const key of required) {
    if (!(key in (plugin ?? {}))) fail(`${prefix}: missing ${key}`);
  }

  if (!/^[a-z0-9][a-z0-9-]*$/.test(plugin.id ?? '')) fail(`${prefix}: invalid id`);
  if (ids.has(plugin.id)) fail(`${prefix}: duplicate id`);
  ids.add(plugin.id);

  if (!/^[^/]+\/[^/]+$/.test(plugin.repository ?? '')) fail(`${prefix}: repository must be owner/name`);
  if (repositories.has(plugin.repository)) fail(`${prefix}: duplicate repository`);
  repositories.add(plugin.repository);

  const expectedUrl = `https://github.com/${plugin.repository}`;
  if (plugin.url !== expectedUrl) fail(`${prefix}: url must equal ${expectedUrl}`);
  if (!readme.includes(expectedUrl)) fail(`${prefix}: README is missing the repository link`);

  if (!allowedTiers.has(plugin.tier)) fail(`${prefix}: tier must be popular or rising`);
  if (!Array.isArray(plugin.categories) || plugin.categories.length === 0) fail(`${prefix}: categories must be non-empty`);
  if (!Array.isArray(plugin.audiences) || plugin.audiences.length === 0) fail(`${prefix}: audiences must be non-empty`);
  if (!Array.isArray(plugin.caveats) || plugin.caveats.length === 0) fail(`${prefix}: caveats must be non-empty`);
  if (!Array.isArray(plugin.verified_sources) || plugin.verified_sources.length < 2) fail(`${prefix}: at least two verification sources are required`);
  if (typeof plugin.function !== 'string' || plugin.function.length < 30) fail(`${prefix}: function is too short`);
  if (typeof plugin.tip !== 'string' || plugin.tip.length < 30) fail(`${prefix}: tip is too short`);

  if (!plugin.install || typeof plugin.install !== 'object') {
    fail(`${prefix}: install must be an object`);
  } else {
    for (const key of ['command', 'profile', 'pinned', 'source']) {
      if (!(key in plugin.install)) fail(`${prefix}: install is missing ${key}`);
    }
    if (typeof plugin.install.pinned !== 'boolean') fail(`${prefix}: install.pinned must be boolean`);
  }
```

</details>

**依据 2 · 源码核查**：[scripts/validate-catalog.mjs:77-99](https://github.com/gityuanbao/DSH-Plugins/blob/9c80866c143d2057670acc9baa47698561a626e3/scripts/validate-catalog.mjs#L77-L99)

指标和分层校验

<details>
<summary>查看原文（23行）</summary>

```text
  if (!plugin.metrics || typeof plugin.metrics !== 'object') {
    fail(`${prefix}: metrics must be an object`);
  } else {
    for (const key of ['stars', 'forks', 'created_at', 'pushed_at']) {
      if (!(key in plugin.metrics)) fail(`${prefix}: metrics is missing ${key}`);
    }
    if (!Number.isInteger(plugin.metrics.stars) || plugin.metrics.stars < 0) fail(`${prefix}: stars must be a non-negative integer`);
    if (!Number.isInteger(plugin.metrics.forks) || plugin.metrics.forks < 0) fail(`${prefix}: forks must be a non-negative integer`);
    if (Number.isNaN(Date.parse(plugin.metrics.created_at))) fail(`${prefix}: invalid created_at`);
    if (Number.isNaN(Date.parse(plugin.metrics.pushed_at))) fail(`${prefix}: invalid pushed_at`);
  }

  if (plugin.tier === 'popular' && plugin.metrics?.stars < 100) {
    fail(`${prefix}: popular entries require at least 100 snapshot stars`);
  }
  if (plugin.tier === 'rising' && plugin.metrics?.stars >= 100) {
    fail(`${prefix}: entries with 100+ snapshot stars belong in popular`);
  }

  const tierRank = plugin.tier === 'popular' ? 0 : 1;
  if (tierRank < previousTierRank) fail(`${prefix}: tiers must be grouped popular before rising`);
  if (tierRank === previousTierRank && plugin.metrics?.stars > previousStars) {
    fail(`${prefix}: entries within a tier must be sorted by snapshot stars descending`);
```

</details>

**依据 3 · 源码核查**：[docs/METHODOLOGY.md:29-43](https://github.com/gityuanbao/DSH-Plugins/blob/9c80866c143d2057670acc9baa47698561a626e3/docs/METHODOLOGY.md#L29-L43)

分层意图与局限

<details>
<summary>查看原文（15行）</summary>

```text
## 分层规则

### 热门精选

- 本次快照至少 100 Star；
- 存在可核验的 DSH 接入说明；
- 按快照 Star 从高到低排列；
- Star 只表示关注度，不代表代码质量、安全或兼容性。

### 新锐观察

- 未达到 100 Star；
- 发布很新，或有近期社区讨论；
- 具备独特且清晰的使用场景；
- 必须显式提醒读者其成熟度较低。
```

</details>

#### 缺口

- README细节与JSON语义是否一致需人工审查。
  **影响**：有链接不等于文字正确，结构通过会漏语义错误。
  **进一步探讨**：比对tip与实际包说明。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 核验标签的证据边界？

**研究主题**：缺陷与关键质疑

#### 完整回答

JSON的verified_sources是类别字符串，验证器只要求至少两项，并不读取原件核实主张。固定数据日期为2026-08-15。方法将README和源码列为高等级来源，但二者能支持的行为证据不同，不能据此声称当前插件运行或安全已验证。

#### 证据与依据

**依据 1 · 源码核查**：[data/plugins.json:1-6](https://github.com/gityuanbao/DSH-Plugins/blob/9c80866c143d2057670acc9baa47698561a626e3/data/plugins.json#L1-L6)

数据快照日期与声明

```text
{
  "schema_version": 1,
  "title": "DSH Plugins",
  "as_of": "2026-08-15",
  "metrics_source": "https://api.github.com/search/repositories?q=topic%3Adsh-plugin&sort=stars&order=desc",
  "disclaimer": "A listing is not a security audit or an endorsement. DeepSeek Harness is in developer preview.",
```

**依据 2 · 源码核查**：[scripts/validate-catalog.mjs:64-66](https://github.com/gityuanbao/DSH-Plugins/blob/9c80866c143d2057670acc9baa47698561a626e3/scripts/validate-catalog.mjs#L64-L66)

来源类别计数

```text
  if (!Array.isArray(plugin.verified_sources) || plugin.verified_sources.length < 2) fail(`${prefix}: at least two verification sources are required`);
  if (typeof plugin.function !== 'string' || plugin.function.length < 30) fail(`${prefix}: function is too short`);
  if (typeof plugin.tip !== 'string' || plugin.tip.length < 30) fail(`${prefix}: tip is too short`);
```

**依据 3 · 源码核查**：[docs/METHODOLOGY.md:45-62](https://github.com/gityuanbao/DSH-Plugins/blob/9c80866c143d2057670acc9baa47698561a626e3/docs/METHODOLOGY.md#L45-L62)

作者证据分级与反证检查

<details>
<summary>查看原文（18行）</summary>

```text
## 证据等级

| 等级 | 证据 | 用法 |
|---|---|---|
| 高 | 官方 DSH 文档、项目源代码、项目 README、Release、GitHub API 原始数据 | 支撑功能、安装、版本与仓库状态 |
| 中 | 社区精选列表、作者发布帖 | 辅助判断可发现性、近期关注与使用场景 |
| 低 | 转述、截图、无原始链接的评论 | 只作为搜索线索，不写入确定结论 |

## 反证检查

定稿前对每个候选项目检查：

- 是否只是给一个既有项目补了 `dsh-plugin` Topic；
- 是否真的存在 DSH 安装说明或可发现的 Skill/Preset；
- README 的性能数据是否只来自单一任务；
- 安装是否会执行远程脚本、构建脚本或获得广泛本机权限；
- 是否把“收录”“Star 多”或“作者自述”误写成安全审计；
- 是否存在许可证、版本兼容或外部服务依赖等重要限制。
```

</details>

#### 缺口

- 原始采集证据及各插件当前行为未覆盖。
  **影响**：无法使用列表层级代替安装决策。
  **进一步探讨**：保留目标包固定版本并单独做源码与宿主验收。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用和退出需要什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

它是resource目录，无需作为DSH插件安装。阅读者保存选中条目及快照日期，然后回到作者安装文档确认版本和权限。维护者按方法更新JSON与README，运行验证也只确认结构。首次成本是筛选，持续成本是过时来源复核，退出移除目录引用即可，已装第三方包另行处理。

#### 证据与依据

**依据 1 · 源码核查**：[docs/METHODOLOGY.md:64-72](https://github.com/gityuanbao/DSH-Plugins/blob/9c80866c143d2057670acc9baa47698561a626e3/docs/METHODOLOGY.md#L64-L72)

目录维护步骤

```text
## 更新规则

更新一次快照时需要：

1. 重新获取 Star、Fork 与最后 Push 时间；
2. 检查 README 的安装命令和兼容版本；
3. 更新 `data/plugins.json` 与 README 中对应描述；
4. 运行 `npm run validate`；
5. 在 PR 中说明新增、删除、升级或降级的证据。
```

**依据 2 · 源码核查**：[data/plugins.json:18-25](https://github.com/gityuanbao/DSH-Plugins/blob/9c80866c143d2057670acc9baa47698561a626e3/data/plugins.json#L18-L25)

示例未固定安装版本及限制

```text
      "install": {
        "command": "dsh plugin --profile web add @linxin666/dsh-web-ui-all",
        "profile": "web",
        "pinned": false,
        "source": "npm"
      },
      "tip": "Install individual subpackages when you only need one feature; this reduces UI conflicts and makes failures easier to isolate.",
      "caveats": ["Large permission surface", "pnpm 11 release-age and hoisted-layout details require attention"],
```

#### 缺口

- 跨目录覆盖和更新频率没有独立数据。
  **影响**：单一目录可能漏掉更合适候选并增加返工。
  **进一步探讨**：用另一发现入口对照后再选包。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样验证目录贡献？

**研究主题**：新假设与验证

#### 完整回答

给同一组中文任务，比较自由搜索、只读本目录和加回源核对三组的耗时与候选正确率，记录失效命令和漏项。若整理建议显著过期，或二次核对成本超过节省时间，则仅保留其历史发现价值。该方案尚未执行，不构成用户收益证据。

#### 证据与依据

**依据 1 · 源码核查**：[data/plugins.json:9-33](https://github.com/gityuanbao/DSH-Plugins/blob/9c80866c143d2057670acc9baa47698561a626e3/data/plugins.json#L9-L33)

可抽样核对的采用字段

<details>
<summary>查看原文（25行）</summary>

```text
      "id": "dsh-web-ui",
      "name": "dsh-web-ui",
      "repository": "zhu1090093659/dsh-web-ui",
      "url": "https://github.com/zhu1090093659/dsh-web-ui",
      "tier": "popular",
      "type": "integration-pack",
      "categories": ["ui", "workflow", "remote-access"],
      "function": "A Web UI plugin and theme pack with a task board, Git graph, file preview, mobile remote access, SSH, vision, usage stats, pets, and themes.",
      "audiences": ["DSH Web power users", "developers who want an all-in-one workbench"],
      "install": {
        "command": "dsh plugin --profile web add @linxin666/dsh-web-ui-all",
        "profile": "web",
        "pinned": false,
        "source": "npm"
      },
      "tip": "Install individual subpackages when you only need one feature; this reduces UI conflicts and makes failures easier to isolate.",
      "caveats": ["Large permission surface", "pnpm 11 release-age and hoisted-layout details require attention"],
      "license": "Apache-2.0",
      "metrics": {
        "stars": 2223,
        "forks": 118,
        "created_at": "2026-08-12T05:15:20Z",
        "pushed_at": "2026-08-15T07:42:56Z"
      },
      "verified_sources": ["repository-readme", "github-api", "dsh-plugin-topic"]
```

</details>

**依据 2 · 源码核查**：[docs/METHODOLOGY.md:64-72](https://github.com/gityuanbao/DSH-Plugins/blob/9c80866c143d2057670acc9baa47698561a626e3/docs/METHODOLOGY.md#L64-L72)

更新要求可作为时效对照

```text
## 更新规则

更新一次快照时需要：

1. 重新获取 Star、Fork 与最后 Push 时间；
2. 检查 README 的安装命令和兼容版本；
3. 更新 `data/plugins.json` 与 README 中对应描述；
4. 运行 `npm run validate`；
5. 在 PR 中说明新增、删除、升级或降级的证据。
```

#### 缺口

- 没有任务命中和耗时对照。
  **影响**：无法确认目录是否比直接搜索更高效。
  **进一步探讨**：保留需求、候选、回源结果和用时。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
