# dsh-aiignore

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[8179e10](https://github.com/WJDdidi-1/ai-context-doctor/tree/8179e10a1ce7496dcf4ca6dcf2105189f255e289/plugin)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/WJDdidi-1/ai-context-doctor) [![npm 30d 9,990](https://img.shields.io/static/v1?label=npm+30d&message=9%2C990&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-aiignore) [![最新发布 2026-11-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-aiignore)
<!-- END META -->

> **功能**：扫描工作区上下文噪声，并提供读取规则与报告面板。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将扫描器结果接到 DSH 守卫和面板，不声称扫描器算法为本组件原创。

> **主要限制**：[Q02](#research-q02) 只拦特定 read 路径且异常放行；[Q03](#research-q03) 撤销可能覆盖期间编辑。

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
  - [Q01 · 插件为谁提供什么，相对根扫描器和手工规则增加什么？](#detail-section-11)
  - [Q02 · 哪些读取会经过守卫，异常和其他入口如何处理？](#detail-section-12)
  - [Q03 · 规则写入和撤销具有什么条件与恢复风险？](#detail-section-13)
  - [Q04 · 如何验证可检测并发编辑的安全撤销？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望减少无关文件进入 Agent 上下文的 DSH 用户。

用户可手动维护忽略规则或直接运行根扫描器；插件接入宿主读取和面板。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| read 守卫 | 减少部分噪声读取 | 指定工具和路径，异常放行 |
| 上下文扫描 | 查看分类及估计 | 依赖扫描器，估计非实际 token |
| 规则管理 | 写入与撤销 .aiignore | 撤销仅内存快照，可能覆盖后续编辑 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH tools.guard | 拦截需要 | 读取规则评估 | 仅有提示或无守卫 |
| ai-context-doctor | 扫描与分类需要 | 提供规则和估计 | 包依赖不可用则无法加载 |
| 可写工作区 | 优化需要 | 写规则及策略 | 写失败返回错误 |
| 人工核查和备份 | 使用建议 | 避免误拦和恢复覆盖 | 不能把估计当实际结果 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 备份已有规则并检查宿主版本 | 无法恢复则停止 |
| 观察 | 扫描并查看候选规则 | 核对任务必需文件 |
| 应用 | 用户决定是否写规则 | 比较写前后内容 |
| 恢复 | 手工比较现有文件与备份 | 避免撤销覆盖后续编辑 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 扫描及模型资源未知 | 审阅规则与备份 | 宿主兼容未测 |
| 持续 | 扫描与模型成本未知 | 核误拦和必要文件 | 实际 token 未对照 |
| 恢复 | 文件副本资源未知 | 对比规则与恢复 | 重启和并发未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 有条件拒读 | 特定 read guard 路径 | 其他读取是否覆盖 |
| 规则管理 | 优化写入与内存撤销 | 并发编辑恢复安全 |
| token 估计 | 调用依赖估计器 | 实际模型 token 与净收益 |

> **思考**：[Q02](#research-q02) 只拦特定 read 路径且异常放行；[Q03](#research-q03) 撤销可能覆盖期间编辑。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将扫描器结果接到 DSH 守卫和面板，不声称扫描器算法为本组件原创。

[Q02](#research-q02) 守卫和扫描职责区分清楚，但异常放行和工具名限制需显式保留。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 只拦特定 read 路径且异常放行；[Q03](#research-q03) 撤销可能覆盖期间编辑。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 备份后在隔离工作区观察误拦与规则变化，不一致时停用并手工比较恢复。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

定向静态核查插件 Host 路径，未运行目标、外部扫描器或宿主。

- 已检查：作者 README、包清单、源码路径 plugin/README.md、plugin/package.json、plugin/index.js 及固定范围 inventory；组件：plugin。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 package、Host 默认项、read guard、规则优化撤销及路由代表路径；未全审 Client、依赖扫描器、宿主认证或所有读取入口。
- 下一步：隔离 profile 对照 read、shell、缺 cwd、规则误拦、并发编辑和重启撤销。

**分析版本**

- **仓库**：[WJDdidi-1/ai-context-doctor](https://github.com/WJDdidi-1/ai-context-doctor)
- **版本号**：0.38.2（[固定提交 8179e10](https://github.com/WJDdidi-1/ai-context-doctor/tree/8179e10a1ce7496dcf4ca6dcf2105189f255e289)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 假设撤销前比较文件摘要可减少误覆盖，尚未验证。

隔离 profile 对照 read、shell、缺 cwd、规则误拦、并发编辑和重启撤销。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 1237 | — | — | 11045 |
| .js | source | 5 | 7541 | 6031 | 882 | — |
| .mjs | source | 3 | 191 | 153 | 16 | — |
| .mjs | test | 27 | 3063 | 2468 | 195 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-04），可前往 [GitHub Issues](https://github.com/WJDdidi-1/ai-context-doctor/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 DSH 守卫、分类规则和撤销边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 插件为谁提供什么，相对根扫描器和手工规则增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

dsh-aiignore 面向希望减少 Agent 把生成物、日志等读进上下文的 DSH 用户。插件调用依赖包 ai-context-doctor 的扫描和分类，增加宿主时机、读取守卫与交互面板；手写忽略文件或运行根 CLI 也能整理候选，因此不能把扫描算法全部算插件原创。自动分类和 token 范围是估计，不证明任务质量或真实节省。

#### 证据与依据

**依据 1 · 作者声明**：[plugin/README.md:1-12](https://github.com/WJDdidi-1/ai-context-doctor/blob/8179e10a1ce7496dcf4ca6dcf2105189f255e289/plugin/README.md#L1-L12)

作者描述扫描器归属。

<details>
<summary>查看原文（12行）</summary>

```text
# dsh-aiignore — context noise guard for DeepSeek Harness

A Host plugin that checks a workspace **when a session opens it** and tells the
agent which files would waste its context — build output, lockfiles, logs,
huge files.

The scan is the same one the [`ai-context-doctor`](https://www.npmjs.com/package/ai-context-doctor)
CLI runs; this package only decides *when* to run it and how to phrase the
result for the model. Everything is local: no network, no API key, no upload.

## Requirements

```

</details>

**依据 2 · 源码核查**：[plugin/package.json:1-11](https://github.com/WJDdidi-1/ai-context-doctor/blob/8179e10a1ce7496dcf4ca6dcf2105189f255e289/plugin/package.json#L1-L11)

组件名称和出口。

<details>
<summary>查看原文（11行）</summary>

```text
{
  "name": "dsh-aiignore",
  "version": "0.38.2",
  "description": "See what a conversation feeds the model, what your rules keep out, and what one click would change.",
  "license": "Apache-2.0",
  "type": "module",
  "exports": {
    ".": "./index.js",
    "./client": "./client.js",
    "./locale/*.json": "./locale/*.json",
    "./icon": "./icon.svg"
```

</details>

**依据 3 · 源码核查**：[plugin/index.js:1-23](https://github.com/WJDdidi-1/ai-context-doctor/blob/8179e10a1ce7496dcf4ca6dcf2105189f255e289/plugin/index.js#L1-L23)

实际导入扫描与规则函数。

<details>
<summary>查看原文（23行）</summary>

```text
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import {
  scanLevels,
  scanRepository,
  classifyPath,
  estimateTokens,
  matchesAiignore,
  parseRules,
  writeAiignore,
  levelFor,
  levelBlocksCategory,
  scoreNoise,
  noiseCategory,
  contextScore,
  isBinaryPath,
  LEVELS,
  DEFAULT_LEVEL
} from 'ai-context-doctor';
import { createWorkspaceState, recordSkip, recordRead, recordWrite, allowPath, allowAnyPath, isAllowed, buildReport } from './report.js';
import { listDirectory } from './tree.js';
```

</details>

#### 缺口

- 未对照任务质量与实际 token
  **影响**：无法估计净收益或误拦率
  **进一步探讨**：同任务比较读取结果、成本和必要文件遗漏。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 哪些读取会经过守卫，异常和其他入口如何处理？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

插件尝试通过 tools.guard 安装守卫，默认策略 deny；只有名为 read 且可从参数取得路径、会话 meta.cwd 可用的读取进入 decideRead。工作区外、缺文件、非 read、策略关闭或异常返回 undefined，不由此守卫阻止；用户规则和分类阈值可拒绝符合条件的读取。其他工具、shell 与软链接等实际行为尚未全面审计，不能将其当作安全隔离或全路径敏感信息防泄漏。

#### 证据与依据

**依据 1 · 源码核查**：[plugin/index.js:29-40](https://github.com/WJDdidi-1/ai-context-doctor/blob/8179e10a1ce7496dcf4ca6dcf2105189f255e289/plugin/index.js#L29-L40)

默认策略和扫描上限。

<details>
<summary>查看原文（12行）</summary>

```text
const DEFAULTS = {
  // Inject only when the workspace is worse than this.
  healthThreshold: 80,
  // Scanning is a synchronous directory walk: cap it so opening a huge
  // monorepo cannot stall the Host.
  maxFiles: 20000,
  maxBytes: 256 * 1024 * 1024,
  // 'deny' refuses reads of generated output, lockfiles, logs and huge files;
  // 'off' only warns at session start. There is no middle setting on purpose:
  // a policy nobody can predict is worse than none.
  readPolicy: 'deny'
};
```

</details>

**依据 2 · 源码核查**：[plugin/index.js:130-151](https://github.com/WJDdidi-1/ai-context-doctor/blob/8179e10a1ce7496dcf4ca6dcf2105189f255e289/plugin/index.js#L130-L151)

路径和文件判断。

<details>
<summary>查看原文（22行）</summary>

```text
export function inspectRead({ root, filePath }) {
  if (typeof root !== 'string' || typeof filePath !== 'string') return { inside: false };

  const absolute = path.resolve(root, filePath);
  const relative = path.relative(root, absolute);
  if (relative === '' || relative.startsWith('..') || path.isAbsolute(relative)) {
    // Outside the workspace: not ours to judge.
    return { inside: false };
  }

  let size = 0;
  try {
    const stats = fs.statSync(absolute);
    if (!stats.isFile()) return { inside: false };
    size = stats.size;
  } catch {
    // Missing file: let the read tool report that in its own words.
    return { inside: false };
  }

  const normalized = relative.split(path.sep).join('/');
  return { inside: true, relativePath: normalized, bytes: size, classified: classifyPath(normalized, size) };
```

</details>

**依据 3 · 源码核查**：[plugin/index.js:163-193](https://github.com/WJDdidi-1/ai-context-doctor/blob/8179e10a1ce7496dcf4ca6dcf2105189f255e289/plugin/index.js#L163-L193)

用户规则与分类决定。

<details>
<summary>查看原文（31行）</summary>

```text
export function decideRead({ root, filePath, policy = 'deny', rules, level = DEFAULT_LEVEL }) {
  if (policy !== 'deny') return { block: false };

  const inspected = inspectRead({ root, filePath });
  if (inspected.inside !== true) return { block: false };

  // The user's own file wins over the heuristic: a hand-written rule is a
  // decision, and it can refuse files the classifier considers clean.
  const rule = matchesAiignore(rules, inspected.relativePath);
  if (rule !== undefined) {
    return {
      block: true,
      relativePath: inspected.relativePath,
      bytes: inspected.bytes,
      reason: 'listed in .aiignore',
      rule,
      tokens: estimateTokens(inspected.bytes)
    };
  }

  // Then the strength the user set. One slider, one meaning: each level names
  // what it stops and what that costs, and the same numbers drive the guard.
  const entry = levelFor(level);
  const noise = inspected.classified.noise;
  if (noise !== undefined && levelBlocksCategory(entry, noiseCategory(noise.reason))) {
    return {
      block: true,
      relativePath: inspected.relativePath,
      bytes: inspected.bytes,
      reason: noise.reason,
      tokens: estimateTokens(inspected.bytes)
```

</details>

**依据 4 · 源码核查**：[plugin/index.js:1150-1160](https://github.com/WJDdidi-1/ai-context-doctor/blob/8179e10a1ce7496dcf4ca6dcf2105189f255e289/plugin/index.js#L1150-L1160)

参数和会话 cwd 条件。

<details>
<summary>查看原文（11行）</summary>

```text
  const guard = (exec) => {
    try {
      if (exec === null || typeof exec !== 'object') return undefined;

      const args = exec.arguments !== null && typeof exec.arguments === 'object' ? exec.arguments : {};
      const filePath = typeof args.file_path === 'string' ? args.file_path : args.path;
      if (typeof filePath !== 'string' || filePath.length === 0) return undefined;

      const session = exec.agent !== null && exec.agent !== undefined ? exec.agent.session : undefined;
      const cwd = session !== null && session !== undefined && session.meta !== undefined ? session.meta.cwd : undefined;
      if (typeof cwd !== 'string' || cwd.length === 0) return undefined;
```

</details>

**依据 5 · 源码核查**：[plugin/index.js:1177-1207](https://github.com/WJDdidi-1/ai-context-doctor/blob/8179e10a1ce7496dcf4ca6dcf2105189f255e289/plugin/index.js#L1177-L1207)

只处理 read 与异常放行。

<details>
<summary>查看原文（31行）</summary>

```text
      if (options.readPolicy !== 'deny') return undefined;
      // Only the file-read tool carries a path we can judge.
      if (exec.name !== 'read') return undefined;

      const decision = decideRead({ root: cwd, filePath, policy: options.readPolicy, rules: rulesFor(cwd), level: readPolicy(cwd) });
      const state = stateFor(cwd);

      if (decision.block === true) {
        if (isAllowed(state, decision.relativePath)) {
          recordRead(state, { relativePath: decision.relativePath, bytes: decision.bytes, verdict: 'allowed' });
          return undefined;
        }
        recordSkip(state, decision);
        bumpStats(cwd, { tokens: estimateTokens(decision.bytes) });
        return formatDenial(decision);
      }

      // Not refused: still worth counting, so the panel can show what this
      // session actually spent instead of only what it saved.
      const inspected = inspectRead({ root: cwd, filePath });
      if (inspected.inside === true) {
        recordRead(state, {
          relativePath: inspected.relativePath,
          bytes: inspected.bytes,
          verdict: inspected.classified.review === undefined ? 'useful' : 'review'
        });
      }
      return undefined;
    } catch {
      // A guard that throws would break every tool call in the session.
      return undefined;
```

</details>

**依据 6 · 源码核查**：[plugin/index.js:1211-1222](https://github.com/WJDdidi-1/ai-context-doctor/blob/8179e10a1ce7496dcf4ca6dcf2105189f255e289/plugin/index.js#L1211-L1222)

tools.guard 注册与不可用时的回退。

<details>
<summary>查看原文（12行）</summary>

```text
  let guardInstalled = false;
  const installGuard = (serviceCtx) => {
    if (guardInstalled) return;
    try {
      const tools = serviceCtx !== null && serviceCtx !== undefined ? serviceCtx.tools : undefined;
      if (tools !== null && tools !== undefined && typeof tools.guard === 'function') {
        tools.guard(guard);
        guardInstalled = true;
      }
    } catch {
      // Tool registry not mounted in this profile: warnings only.
    }
```

</details>

#### 缺口

- 未运行宿主和其他读文件工具
  **影响**：不能证明完整覆盖或防泄漏
  **进一步探讨**：隔离 profile 分别验证 read、shell、缺 cwd 和软链接。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 规则写入和撤销具有什么条件与恢复风险？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

优化会读取当前 .aiignore 快照，调用依赖的 writeAiignore 写入建议并在进程内 Map 记住前值；撤销从该快照恢复文件或删除新建文件。重启后 Map 不保留；优化之后若用户另行编辑文件，撤销会写回旧快照，可能覆盖中间编辑。面板路由对跨来源请求做检查，外层身份和可达性未审；本组件有文件写入，不能将无网络作者描述理解为只读。先备份规则，用隔离仓库查看建议和被阻止文件；误拦或状态变化时手动比较后恢复。

#### 证据与依据

**依据 1 · 源码核查**：[plugin/index.js:1087-1111](https://github.com/WJDdidi-1/ai-context-doctor/blob/8179e10a1ce7496dcf4ca6dcf2105189f255e289/plugin/index.js#L1087-L1111)

优化前快照与写入。

<details>
<summary>查看原文（25行）</summary>

```text
const optimizeBackup = new Map();

/**
 * One click: turn the report's suggestions into `.aiignore` and remember what was
 * there before. The effect is real — the guard reads this file on every read, so
 * the noise stops reaching the model immediately, not at the next restart.
 *
 * @param {string} cwd
 * @param {ReturnType<typeof scanRepository>} report
 * @param {string[]} [rules] Rules to write instead of the workspace's own suggestions.
 * @returns {{ added: string[], written: boolean, saved: { min: number, max: number } }}
 */
export function optimizeWorkspace(cwd, report, rules) {
  const target = path.join(cwd, '.aiignore');
  let previous = null;
  try {
    previous = fs.readFileSync(target, 'utf8');
  } catch {
    previous = null;
  }

  const wanted = Array.isArray(rules) && rules.length > 0 ? rules : report.suggestedAiignore;
  const result = writeAiignore(target, wanted);
  optimizeBackup.set(cwd, { previous, at: Date.now() });
  ruleCache.delete(cwd);
```

</details>

**依据 2 · 源码核查**：[plugin/index.js:1119-1138](https://github.com/WJDdidi-1/ai-context-doctor/blob/8179e10a1ce7496dcf4ca6dcf2105189f255e289/plugin/index.js#L1119-L1138)

内存备份与恢复/删除。

<details>
<summary>查看原文（20行）</summary>

```text
/**
 * Put the file back exactly as it was before the last Optimize.
 *
 * @param {string} cwd
 * @returns {{ undone: boolean, restored: 'previous' | 'removed' | 'none' }}
 */
export function undoOptimize(cwd) {
  const backup = optimizeBackup.get(cwd);
  if (backup === undefined) return { undone: false, restored: 'none' };

  const target = path.join(cwd, '.aiignore');
  try {
    if (backup.previous === null) fs.unlinkSync(target);
    else fs.writeFileSync(target, backup.previous);
  } catch {
    return { undone: false, restored: 'none' };
  }

  optimizeBackup.delete(cwd);
  ruleCache.delete(cwd);
```

</details>

**依据 3 · 源码核查**：[plugin/index.js:2124-2168](https://github.com/WJDdidi-1/ai-context-doctor/blob/8179e10a1ce7496dcf4ca6dcf2105189f255e289/plugin/index.js#L2124-L2168)

POST 检查、扫描、优化和重扫。

<details>
<summary>查看原文（45行）</summary>

```text
  const optimizeHandler = (req, res) => {
    if (req.method !== 'POST') return sendJson(res, 405, { error: 'method-not-allowed' });
    if (crossOrigin(req) === true) return sendJson(res, 403, { error: 'cross-origin' });

    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 20000) req.destroy();
    });
    req.on('end', () => {
      let parsed = {};
      if (body.trim().length > 0) {
        try {
          parsed = JSON.parse(body);
        } catch {
          return sendJson(res, 400, { error: 'invalid-json' });
        }
      }

      const asked = parsed !== null && typeof parsed === 'object' && typeof parsed.session === 'string' ? parsed.session : null;
      let conversation = null;
      if (asked !== null) {
        // A conversation without a projection is not an error: the panel still
        // knows which folder it is showing, and optimising that folder is a
        // useful thing to do. Falling back beats a 404 the caller cannot use.
        conversation = conversationReport(asked);
      }

      // The summary page acts on a row the panel is not showing, so it names the
      // folder itself; the panel just omits it and gets its own workspace.
      const named = parsed !== null && typeof parsed === 'object' && typeof parsed.cwd === 'string' && path.isAbsolute(parsed.cwd)
        ? path.resolve(parsed.cwd)
        : undefined;
      const cwd = named !== undefined
        ? named
        : (askedCwd(req) !== undefined
          ? askedCwd(req)
          : (conversation !== null && conversation.cwd !== null ? conversation.cwd : resolveWorkspace()));
      if (cwd === undefined || cwd === null) return sendJson(res, 404, { error: 'no-workspace' });

      try {
        const before = scanWithPolicy(cwd);
        const rules = conversation !== null ? conversation.suggestedAiignore : undefined;
        const result = optimizeWorkspace(cwd, before, rules);
        const after = scanWithPolicy(cwd);
```

</details>

**依据 4 · 源码核查**：[plugin/package.json:32-35](https://github.com/WJDdidi-1/ai-context-doctor/blob/8179e10a1ce7496dcf4ca6dcf2105189f255e289/plugin/package.json#L32-L35)

外部扫描包依赖。

```text
      "immediately": true,
      "inject": [
        "@deepseek-ai/dsh-client-ui-conversation"
      ]
```

#### 缺口

- 未测多会话并发编辑、重启或宿主路由权限
  **影响**：不能确认恢复安全或远端可达性
  **进一步探讨**：隔离目录更改规则后撤销，并核宿主认证及失败。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何验证可检测并发编辑的安全撤销？

**研究主题**：新假设与验证

#### 完整回答

假设优化时记录写入后文件摘要，撤销前比对当前文件；发现变化则提示合并而非直接覆盖，可减少用户后续编辑丢失。这不是当前实现，且摘要核对不能替代文件锁或权限控制。对照现有快照恢复，在无变化、外部追加、删除与重启后撤销场景统计丢规则、误拒和恢复时间；无法减少丢失或带来过量冲突提示则否定。

#### 证据与依据

**依据 1 · 源码核查**：[plugin/index.js:1099-1111](https://github.com/WJDdidi-1/ai-context-doctor/blob/8179e10a1ce7496dcf4ca6dcf2105189f255e289/plugin/index.js#L1099-L1111)

当前内存快照和写入。

<details>
<summary>查看原文（13行）</summary>

```text
export function optimizeWorkspace(cwd, report, rules) {
  const target = path.join(cwd, '.aiignore');
  let previous = null;
  try {
    previous = fs.readFileSync(target, 'utf8');
  } catch {
    previous = null;
  }

  const wanted = Array.isArray(rules) && rules.length > 0 ? rules : report.suggestedAiignore;
  const result = writeAiignore(target, wanted);
  optimizeBackup.set(cwd, { previous, at: Date.now() });
  ruleCache.delete(cwd);
```

</details>

**依据 2 · 源码核查**：[plugin/index.js:1125-1138](https://github.com/WJDdidi-1/ai-context-doctor/blob/8179e10a1ce7496dcf4ca6dcf2105189f255e289/plugin/index.js#L1125-L1138)

撤销不检查当前文件变化。

<details>
<summary>查看原文（14行）</summary>

```text
export function undoOptimize(cwd) {
  const backup = optimizeBackup.get(cwd);
  if (backup === undefined) return { undone: false, restored: 'none' };

  const target = path.join(cwd, '.aiignore');
  try {
    if (backup.previous === null) fs.unlinkSync(target);
    else fs.writeFileSync(target, backup.previous);
  } catch {
    return { undone: false, restored: 'none' };
  }

  optimizeBackup.delete(cwd);
  ruleCache.delete(cwd);
```

</details>

#### 缺口

- 没有实现或对照摘要策略
  **影响**：不能判断一致性和成本
  **进一步探讨**：使用隔离目录测试并发修改及恢复。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
