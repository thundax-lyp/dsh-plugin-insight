# Awesome DeepSeek Harness Plugins

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[32afc28](https://github.com/web-casa/Awesome-DeepSeek-Harness-Plugins/tree/32afc285bc42e1e3d9b460217cf52ed018c2b000)

<!-- BEGIN META -->
[![GitHub ★ 113](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=113&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/web-casa/Awesome-DeepSeek-Harness-Plugins)
<!-- END META -->

> **功能**：将 marketplace 索引转为可浏览、可校验的双语插件目录

> **亮点**：[Q01](#research-q01) 提供可追溯到商城的双语目录和结构化索引。

> **主要限制**：[Q03](#research-q03) 索引验证只覆盖结构，安装兼容与安全状态需另核。

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
  - [Q01 · 目录具体交付什么？](#detail-section-11)
  - [Q02 · 生成和验证机制是什么？](#detail-section-12)
  - [Q03 · 安全状态和安装命令说明什么？](#detail-section-13)
  - [Q04 · 如何采用并退出？](#detail-section-14)
  - [Q05 · 怎样判定索引有帮助？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户需按用途初步发现 DSH 插件。

直接搜索 GitHub 或 npm。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 直接搜索 GitHub 或 npm。 | 可直接比较 | 保留人工步骤 |
| Awesome DeepSeek Harness Plugins | 提供可追溯到商城的双语目录和结构化索引。 | 索引验证只覆盖结构，安装兼容与安全状态需另核。 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 宿主 | 必需 | 本地 JSON 经分类和格式化生成双语 README。 | 用隔离 profile 确认 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户需按用途初步发现 DSH 插件。 | 保留原流程 |
| 试验 | 本地 JSON 经分类和格式化生成双语 README。 | 观察固定版本 |
| 复核 | 用固定提交作发现源，并对实际包独立验证。 | 比对任务结果 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 安装与运行成本未知 | 配置准备耗时未知 | 视 profile 而定 |
| 持续 | 持续运行成本未知 | 日常维护耗时未知 | 视任务频率而定 |
| 恢复 | 回退成本未知 | 恢复原流程耗时未知 | 视已有数据而定 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 按用途找到候选包并复核来源 | 可缩短发现候选的时间并保持来源可追溯。 | 用固定提交作发现源，并对实际包独立验证。 |

> **思考**：[Q03](#research-q03) 索引验证只覆盖结构，安装兼容与安全状态需另核。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 提供可追溯到商城的双语目录和结构化索引。

验证器及生成脚本可追溯，自动化仅生成文档。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 索引验证只覆盖结构，安装兼容与安全状态需另核。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 用固定提交作发现源，并对实际包独立验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的按用途找到候选包并复核来源。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、scripts/generate.mjs、scripts/validate.mjs、.github/workflows/update.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的按用途找到候选包并复核来源。未执行目标代码或实际宿主验证。
- 下一步：保留候选清单和每个实际包的证据。

**分析版本**

- **仓库**：[web-casa/Awesome-DeepSeek-Harness-Plugins](https://github.com/web-casa/Awesome-DeepSeek-Harness-Plugins)
- **版本号**：未声明（[固定提交 32afc28](https://github.com/web-casa/Awesome-DeepSeek-Harness-Plugins/tree/32afc285bc42e1e3d9b460217cf52ed018c2b000)）
- **版本日期**：2026-08-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 可缩短发现候选的时间并保持来源可追溯。

保留候选清单和每个实际包的证据。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 901 | — | — | 24067 |
| .mjs | source | 2 | 425 | 371 | 37 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/web-casa/Awesome-DeepSeek-Harness-Plugins/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：按用途找到候选包并复核来源

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 目录具体交付什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

维护者和用户可直接阅读分类索引，再沿包链接核查来源。相对逐个搜索 GitHub，双语列表和 JSON 降低收集成本。验收时抽同一类别的条目核对 slug、仓库和商城链接。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-19](https://github.com/web-casa/Awesome-DeepSeek-Harness-Plugins/blob/32afc285bc42e1e3d9b460217cf52ed018c2b000/README.md#L3-L19)

作者描述索引来源与商城页面

<details>
<summary>查看原文（17行）</summary>

```text
> The official, auto-generated awesome list for the **DeepSeek Harness (DSH)** Cordis plugin ecosystem —
> curated by [cordis.run](https://cordis.run), the DeepSeek Harness plugin marketplace.

**331 DeepSeek Harness plugins** · curated from the [cordis.run open plugin index](data/plugins.json).

Every listed DeepSeek Harness plugin has a **one-line install command** and a **security scan status** on its cordis.run page.

[中文版](README.zh.md) | English

---

## What is DeepSeek Harness?

**DeepSeek Harness (DSH)** is an agent harness for DeepSeek models. Its plugin system — **Cordis** —
lets you install packages from npm or GitHub that declare a `dsh.bundle` and patch them into a DSH profile.
This list indexes **DeepSeek Harness Cordis plugins** with a checked package source
and `dsh.bundle` declaration, listed on [cordis.run](https://cordis.run).
```

</details>

**依据 2 · 源码核查**：[scripts/generate.mjs:55-81](https://github.com/web-casa/Awesome-DeepSeek-Harness-Plugins/blob/32afc285bc42e1e3d9b460217cf52ed018c2b000/scripts/generate.mjs#L55-L81)

按分类构建列表并写总数

<details>
<summary>查看原文（27行）</summary>

```text
const data = JSON.parse(readFileSync(join(process.cwd(), "data", "plugins.json"), "utf8"));
const plugins = data.plugins;

const byCat = new Map();
for (const p of plugins) {
  for (const c of p.categories) {
    if (!byCat.has(c)) byCat.set(c, []);
    byCat.get(c).push(p);
  }
}
const usedCats = Object.keys(CATEGORY_META).filter((c) => (byCat.get(c)?.length ?? 0) > 0);
const uncat = plugins.filter((p) => p.categories.length === 0);

// ────────────────────────── 英文 README ──────────────────────────

function genEn() {
  const lines = [];
  const push = (s = "") => lines.push(s);

  push("# Awesome DeepSeek Harness Plugins");
  push();
  push("> The official, auto-generated awesome list for the **DeepSeek Harness (DSH)** Cordis plugin ecosystem —");
  push("> curated by [cordis.run](https://cordis.run), the DeepSeek Harness plugin marketplace.");
  push();
  push(`**${data.total} DeepSeek Harness plugins** · curated from the [cordis.run open plugin index](data/plugins.json).`);
  push();
  push("Every listed DeepSeek Harness plugin has a **one-line install command** and a **security scan status** on its cordis.run page.");
```

</details>

#### 缺口

- 覆盖仅限索引收录。
  **影响**：可以作为候选发现入口。
  **进一步探讨**：比较同一任务在 GitHub 和目录的命中。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 生成和验证机制是什么？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

生成器读本地 JSON，按多个分类构建 README。验证器检查日期、计数、字段和来源类型。更新 workflow 由手动触发并只在生成文档变化时提交。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/generate.mjs:40-66](https://github.com/web-casa/Awesome-DeepSeek-Harness-Plugins/blob/32afc285bc42e1e3d9b460217cf52ed018c2b000/scripts/generate.mjs#L40-L66)

本地数据及类别映射

<details>
<summary>查看原文（27行）</summary>

```text
const esc = (s) => s.replace(/\|/g, "\\|").replace(/\n/g, " ");
const slug = (s) => s.toLowerCase().replace(/[^\p{L}\p{N} ]/gu, "").replace(/ /g, "-");
const firstSentence = (desc) => {
  if (!desc) return "A DeepSeek Harness Cordis plugin.";
  const cleaned = desc.replace(/\s+/g, " ").trim();
  const cut = cleaned.split(/\.\s/)[0] ?? cleaned;
  return cut.length > 120 ? `${cut.slice(0, 117)}…` : cut;
};
const firstSentenceZh = (desc) => {
  if (!desc) return "一个 DeepSeek Harness Cordis 插件。";
  const cleaned = desc.replace(/\s+/g, " ").trim();
  const cut = cleaned.split(/[。！？]\s*/)[0] ?? cleaned;
  return cut.length > 80 ? `${cut.slice(0, 77)}…` : cut;
};

const data = JSON.parse(readFileSync(join(process.cwd(), "data", "plugins.json"), "utf8"));
const plugins = data.plugins;

const byCat = new Map();
for (const p of plugins) {
  for (const c of p.categories) {
    if (!byCat.has(c)) byCat.set(c, []);
    byCat.get(c).push(p);
  }
}
const usedCats = Object.keys(CATEGORY_META).filter((c) => (byCat.get(c)?.length ?? 0) > 0);
const uncat = plugins.filter((p) => p.categories.length === 0);
```

</details>

**依据 2 · 源码核查**：[scripts/validate.mjs:58-95](https://github.com/web-casa/Awesome-DeepSeek-Harness-Plugins/blob/32afc285bc42e1e3d9b460217cf52ed018c2b000/scripts/validate.mjs#L58-L95)

计数、必填字段和来源类型

<details>
<summary>查看原文（38行）</summary>

```text
check(/^\d{4}-\d{2}-\d{2}$/.test(data.version), "data.version", "must use YYYY-MM-DD format");
check(
  typeof data.generatedAt === "string" && !Number.isNaN(Date.parse(data.generatedAt)),
  "data.generatedAt",
  "must be an ISO-compatible timestamp",
);
check(Number.isInteger(data.total) && data.total >= 0, "data.total", "must be a non-negative integer");
check(Array.isArray(data.plugins), "data.plugins", "must be an array");

if (Array.isArray(data.plugins)) {
  check(data.total === data.plugins.length, "data.total", `expected ${data.plugins.length}, received ${data.total}`);

  const seenSlugs = new Map();

  data.plugins.forEach((plugin, index) => {
    const path = `data.plugins[${index}]`;
    check(plugin && typeof plugin === "object" && !Array.isArray(plugin), path, "must be an object");
    if (!plugin || typeof plugin !== "object" || Array.isArray(plugin)) return;

    for (const field of ["slug", "name", "npmPackage", "latestVersion", "installCommand", "cordisUrl"]) {
      check(isNonEmptyString(plugin[field]), `${path}.${field}`, "must be a non-empty string");
    }

    for (const field of ["nameZh", "description", "descriptionZh", "repoUrl", "author", "license", "securityStatus"]) {
      check(isNullableString(plugin[field]), `${path}.${field}`, "must be a string or null");
    }

    check(
      isNullableNonNegativeInteger(plugin.downloadsCached),
      `${path}.downloadsCached`,
      "must be a non-negative integer or null",
    );
    check(
      isNullableNonNegativeInteger(plugin.stars),
      `${path}.stars`,
      "must be a non-negative integer or null",
    );
    check(allowedSourceTypes.has(plugin.sourceType), `${path}.sourceType`, "must be github or registry");
```

</details>

**依据 3 · 源码核查**：[.github/workflows/update.yml:3-7](https://github.com/web-casa/Awesome-DeepSeek-Harness-Plugins/blob/32afc285bc42e1e3d9b460217cf52ed018c2b000/.github/workflows/update.yml#L3-L7)

手动触发

```text
on:
  workflow_dispatch:

permissions:
  contents: write
```

**依据 4 · 源码核查**：[.github/workflows/update.yml:27-40](https://github.com/web-casa/Awesome-DeepSeek-Harness-Plugins/blob/32afc285bc42e1e3d9b460217cf52ed018c2b000/.github/workflows/update.yml#L27-L40)

生成并按差异提交文档

<details>
<summary>查看原文（14行）</summary>

```text
      - name: Regenerate README
        run: node scripts/generate.mjs

      - name: Commit and push if changed
        run: |
          if ! git diff --quiet -- README.md README.zh.md; then
            git config user.name "github-actions[bot]"
            git config user.email "github-actions[bot]@users.noreply.github.com"
            git add README.md README.zh.md
            git commit -m "docs: regenerate READMEs $(date -u +%Y-%m-%d)"
            git push
          else
            echo "No changes"
          fi
```

</details>

#### 缺口

- 跨类别重复呈现不可当作独立插件计数。
  **影响**：可复查生成口径。
  **进一步探讨**：按 JSON slug 对账两版输出。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 安全状态和安装命令说明什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

验证器把安装命令当作非空字符串，securityStatus 只允许字符串或空。生成脚本宣传商城扫描状态，但这个仓库的字段检查不能证明插件安全、兼容或安装命令仍可用。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/validate.mjs:77-95](https://github.com/web-casa/Awesome-DeepSeek-Harness-Plugins/blob/32afc285bc42e1e3d9b460217cf52ed018c2b000/scripts/validate.mjs#L77-L95)

只对安装字符串和安全状态做结构检查

<details>
<summary>查看原文（19行）</summary>

```text
    for (const field of ["slug", "name", "npmPackage", "latestVersion", "installCommand", "cordisUrl"]) {
      check(isNonEmptyString(plugin[field]), `${path}.${field}`, "must be a non-empty string");
    }

    for (const field of ["nameZh", "description", "descriptionZh", "repoUrl", "author", "license", "securityStatus"]) {
      check(isNullableString(plugin[field]), `${path}.${field}`, "must be a string or null");
    }

    check(
      isNullableNonNegativeInteger(plugin.downloadsCached),
      `${path}.downloadsCached`,
      "must be a non-negative integer or null",
    );
    check(
      isNullableNonNegativeInteger(plugin.stars),
      `${path}.stars`,
      "must be a non-negative integer or null",
    );
    check(allowedSourceTypes.has(plugin.sourceType), `${path}.sourceType`, "must be github or registry");
```

</details>

**依据 2 · 源码核查**：[scripts/generate.mjs:74-81](https://github.com/web-casa/Awesome-DeepSeek-Harness-Plugins/blob/32afc285bc42e1e3d9b460217cf52ed018c2b000/scripts/generate.mjs#L74-L81)

文档描述商城扫描状态

```text
  push("# Awesome DeepSeek Harness Plugins");
  push();
  push("> The official, auto-generated awesome list for the **DeepSeek Harness (DSH)** Cordis plugin ecosystem —");
  push("> curated by [cordis.run](https://cordis.run), the DeepSeek Harness plugin marketplace.");
  push();
  push(`**${data.total} DeepSeek Harness plugins** · curated from the [cordis.run open plugin index](data/plugins.json).`);
  push();
  push("Every listed DeepSeek Harness plugin has a **one-line install command** and a **security scan status** on its cordis.run page.");
```

#### 缺口

- 上游扫描算法和实际安装未检验。
  **影响**：索引和独立软件审计需分开。
  **进一步探讨**：核查一个已下架或版本变更的候选。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何采用并退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

使用固定提交的 README 或 JSON，不需作为 DSH bundle 安装。消费方保留输入提交、slug 和原始来源。成本主要是核对上游状态、清理过期映射与维护分类。停用只需移除索引入口，独立审核记录保留。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/generate.mjs:1-11](https://github.com/web-casa/Awesome-DeepSeek-Harness-Plugins/blob/32afc285bc42e1e3d9b460217cf52ed018c2b000/scripts/generate.mjs#L1-L11)

零依赖文档生成

<details>
<summary>查看原文（11行）</summary>

```text
/**
 * 从 data/plugins.json 生成 README.md（英文）与 README.zh.md（中文）。
 * awesome 仓库专用，零依赖。
 *
 * ⚠️ 与主仓库 scripts/plugins/generate-awesome.ts 保持同步（逻辑一致，仅 TS/JS 语法差异）。
 * 改动本文件时，必须同步更新主仓库的 generate-awesome.ts。
 *
 * 用法: node scripts/generate.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
```

</details>

**依据 2 · 源码核查**：[scripts/generate.mjs:55-66](https://github.com/web-casa/Awesome-DeepSeek-Harness-Plugins/blob/32afc285bc42e1e3d9b460217cf52ed018c2b000/scripts/generate.mjs#L55-L66)

本地 JSON 入口

<details>
<summary>查看原文（12行）</summary>

```text
const data = JSON.parse(readFileSync(join(process.cwd(), "data", "plugins.json"), "utf8"));
const plugins = data.plugins;

const byCat = new Map();
for (const p of plugins) {
  for (const c of p.categories) {
    if (!byCat.has(c)) byCat.set(c, []);
    byCat.get(c).push(p);
  }
}
const usedCats = Object.keys(CATEGORY_META).filter((c) => (byCat.get(c)?.length ?? 0) > 0);
const uncat = plugins.filter((p) => p.categories.length === 0);
```

</details>

**依据 3 · 源码核查**：[.github/workflows/update.yml:27-40](https://github.com/web-casa/Awesome-DeepSeek-Harness-Plugins/blob/32afc285bc42e1e3d9b460217cf52ed018c2b000/.github/workflows/update.yml#L27-L40)

此 workflow 刷新 README

<details>
<summary>查看原文（14行）</summary>

```text
      - name: Regenerate README
        run: node scripts/generate.mjs

      - name: Commit and push if changed
        run: |
          if ! git diff --quiet -- README.md README.zh.md; then
            git config user.name "github-actions[bot]"
            git config user.email "github-actions[bot]@users.noreply.github.com"
            git add README.md README.zh.md
            git commit -m "docs: regenerate READMEs $(date -u +%Y-%m-%d)"
            git push
          else
            echo "No changes"
          fi
```

</details>

#### 缺口

- 索引数据更新频率和同步延迟未验证。
  **影响**：应把数据时效作为单独字段。
  **进一步探讨**：比较 JSON 时间和目标包实际版本。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样判定索引有帮助？

**研究主题**：新假设与验证

#### 完整回答

用相同插件需求对照直接搜仓库和通过目录查找，记录来源准确率、耗时、过期和未覆盖项。若条目无法定位对应包，或缺失主流候选且不能注明覆盖范围，则不应作为单一发现源。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/validate.mjs:58-95](https://github.com/web-casa/Awesome-DeepSeek-Harness-Plugins/blob/32afc285bc42e1e3d9b460217cf52ed018c2b000/scripts/validate.mjs#L58-L95)

快照时间、计数和条目字段可核对

<details>
<summary>查看原文（38行）</summary>

```text
check(/^\d{4}-\d{2}-\d{2}$/.test(data.version), "data.version", "must use YYYY-MM-DD format");
check(
  typeof data.generatedAt === "string" && !Number.isNaN(Date.parse(data.generatedAt)),
  "data.generatedAt",
  "must be an ISO-compatible timestamp",
);
check(Number.isInteger(data.total) && data.total >= 0, "data.total", "must be a non-negative integer");
check(Array.isArray(data.plugins), "data.plugins", "must be an array");

if (Array.isArray(data.plugins)) {
  check(data.total === data.plugins.length, "data.total", `expected ${data.plugins.length}, received ${data.total}`);

  const seenSlugs = new Map();

  data.plugins.forEach((plugin, index) => {
    const path = `data.plugins[${index}]`;
    check(plugin && typeof plugin === "object" && !Array.isArray(plugin), path, "must be an object");
    if (!plugin || typeof plugin !== "object" || Array.isArray(plugin)) return;

    for (const field of ["slug", "name", "npmPackage", "latestVersion", "installCommand", "cordisUrl"]) {
      check(isNonEmptyString(plugin[field]), `${path}.${field}`, "must be a non-empty string");
    }

    for (const field of ["nameZh", "description", "descriptionZh", "repoUrl", "author", "license", "securityStatus"]) {
      check(isNullableString(plugin[field]), `${path}.${field}`, "must be a string or null");
    }

    check(
      isNullableNonNegativeInteger(plugin.downloadsCached),
      `${path}.downloadsCached`,
      "must be a non-negative integer or null",
    );
    check(
      isNullableNonNegativeInteger(plugin.stars),
      `${path}.stars`,
      "must be a non-negative integer or null",
    );
    check(allowedSourceTypes.has(plugin.sourceType), `${path}.sourceType`, "must be github or registry");
```

</details>

**依据 2 · 作者声明**：[README.md:6-19](https://github.com/web-casa/Awesome-DeepSeek-Harness-Plugins/blob/32afc285bc42e1e3d9b460217cf52ed018c2b000/README.md#L6-L19)

作者说明覆盖来源

<details>
<summary>查看原文（14行）</summary>

```text
**331 DeepSeek Harness plugins** · curated from the [cordis.run open plugin index](data/plugins.json).

Every listed DeepSeek Harness plugin has a **one-line install command** and a **security scan status** on its cordis.run page.

[中文版](README.zh.md) | English

---

## What is DeepSeek Harness?

**DeepSeek Harness (DSH)** is an agent harness for DeepSeek models. Its plugin system — **Cordis** —
lets you install packages from npm or GitHub that declare a `dsh.bundle` and patch them into a DSH profile.
This list indexes **DeepSeek Harness Cordis plugins** with a checked package source
and `dsh.bundle` declaration, listed on [cordis.run](https://cordis.run).
```

</details>

#### 缺口

- 未完成跨目录抽样。
  **影响**：可以量化候选发现贡献。
  **进一步探讨**：保留候选清单和每个实际包的证据。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
