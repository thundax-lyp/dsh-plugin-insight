# dsh-plugin-gate

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[b75c3a1](https://github.com/863683348/dsh-plugin-gate/tree/b75c3a1b768448ee84a6fa07735206e6f8945411)

<!-- BEGIN META -->
[![npm 30d 1,494](https://img.shields.io/static/v1?label=npm+30d&message=1%2C494&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-gate) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-gate)
<!-- END META -->

> **实现功能**：向 DSH Agent 提供插件源码静态扫描、风险差分/报告及破坏性操作建议工具，以 systemPrompt 提醒调用。

> **核心亮点**：把静态签名、OSV 查询和基线差分整合为 Agent 可调用工具；详见[Q01](#research-q01)。

> **风险与缺陷**：扫描截断/读取或 OSV 失败不一定改变 PASS；guard 不是执行钩子，“绝不写文件”不涵盖 diff/report 可选写入。详见[Q02](#research-q02)、[Q03](#research-q03)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 安装前扫描能覆盖什么？](#detail-section-11)
  - [Q02 · PASS 是否代表扫描完整和安全？](#detail-section-12)
  - [Q03 · 数据保护守卫和只读承诺有什么边界？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：安装陌生插件前检查源码与依赖风险，或在删除前提示目标范围。

人工审阅插件 package.json、安装脚本、源码与依赖公告；本工具自动聚合启发式命中。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| gate_scan | 源码签名 | PASS 非保证 |
| gate_guard | 删除前提示 | 非强制 |
| gate_diff/report | 留存证据 | 可写工作区 |

**流程与依赖**

#### 条件

| 条件 | 用途 | 缺失时 |
| --- | --- | --- |
| DSH tools/fs/systemPrompt | 注册与读取 | 功能不可用 |
| npm/OSV 网络 | 远端与依赖查验 | 结果不完整 |
| Agent 主动调用 | 安装/删除前检查 | 无约束 |

#### 审查

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 固定版本 | npm@version/目录 | 扫描对象确定 |
| 看覆盖 | hits 与 notes | 无漏检提示 |
| 决策 | 人工复核 | 不仅依赖 PASS |

**效果与成本**

#### 成本

| 项 | 资源 | 边界 |
| --- | --- | --- |
| 扫描 | 目录读取/npm 下载 | 截断与跳过 |
| OSV | 外部查询 | 超时/少量依赖 |
| 人工复核 | 命中和 notes | 误报/漏报 |

#### 效果

| 项 | 源码支持 | 未知 |
| --- | --- | --- |
| 静态扫描 | 规则/OSV | 真实检出率 |
| 差分报告 | 可选写基线/报告 | 工作流采纳率 |
| 误删提醒 | 正则/路径判定 | 强制性为无 |

> **思考**：扫描截断/读取或 OSV 失败不一定改变 PASS；guard 不是执行钩子，“绝不写文件”不涵盖 diff/report 可选写入。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把静态签名、OSV 查询和基线差分整合为 Agent 可调用工具；详见[Q01](#research-q01)。

把静态签名、OSV 查询和基线差分整合为 Agent 可调用工具；详见[Q01](#research-q01)。

Cordis 插件注册四个模型工具并注入提示段；扫描 verdict 由 high/medium 命中数得出，截断 notes 不参与。

<a id="detail-section-5"></a>

### 1.4 主要限制

扫描截断/读取或 OSV 失败不一定改变 PASS；guard 不是执行钩子，“绝不写文件”不涵盖 diff/report 可选写入。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

只在明确源码版本上扫描，逐项审阅 hits、notes 和 filesScanned；对高权限插件增加人工/沙箱审查。详见[Q02](#research-q02)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码证明启发式扫描和提示式守卫；未接入强制安装/执行拦截，PASS 可在扫描不完整时出现。

- 已检查：作者 README、包清单、源码路径 README.zh.md、package.json、lib/index.js、lib/scan.js、lib/protect.js、lib/rules.js、lib/osv.js、lib/baseline.js、lib/report.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态审阅固定提交 README、扫描/保护/工具注册源码；未运行目标插件、被扫样本或宿主命令。
- 下一步：隔离构造截断目录/大文件/OSV 故障和危险命令，检验 PASS、guard 与 write opt-in；评估误报漏报。

**分析版本**

- **仓库**：[863683348/dsh-plugin-gate](https://github.com/863683348/dsh-plugin-gate)
- **版本号**：1.3.2（[固定提交 b75c3a1](https://github.com/863683348/dsh-plugin-gate/tree/b75c3a1b768448ee84a6fa07735206e6f8945411)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

将覆盖率不全升为 WARN、把 destructive guard 接入宿主执行层，可减少误信 PASS 和漏拦截；待验证。详见[Q02](#research-q02)、[Q03](#research-q03)。

隔离构造截断目录/大文件/OSV 故障和危险命令，检验 PASS、guard 与 write opt-in；评估误报漏报。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 285 | — | — | 2702 |
| .js | source | 8 | 2169 | 1804 | 267 | — |
| .mjs | source | 1 | 117 | 103 | 7 | — |
| .mjs | test | 7 | 865 | 784 | 36 | — |

</details>

**活跃度**

[![Issue 未关闭 6](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=6&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-gate/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 3](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-gate/issues?q=is%3Aissue+created%3A2026-09-22T06%3A34%3A06.582Z..2026-10-22T06%3A34%3A06.582Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-gate/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A34%3A06.582Z..2026-10-22T06%3A34%3A06.582Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**核实安全扫描和破坏性命令守卫的实际接入、PASS 含义及写入边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 安装前扫描能覆盖什么？

**研究主题：**场景与需求、贡献与相对优势、功能与机制

#### 完整回答

插件注册 gate_scan 模型工具，接受本地目录或 npm tarball，对源码中的脚本、混淆、凭据、网络、二进制等签名做启发式扫描；可选对少量精确版本直接依赖查询 OSV，输出命中行和 BLOCK/WARN/PASS。它还注册 gate_diff 和 gate_report 以比较基线及导出报告。systemPrompt 文本引导 Agent 安装前调用，但代码没有拦截 dsh plugin add 的执行路径，因此“闸门”取决于 Agent 自愿调用。结果是静态特征，不等价于恶意性证明。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:1-16](https://github.com/863683348/dsh-plugin-gate/blob/b75c3a1b768448ee84a6fa07735206e6f8945411/README.zh.md#L1-L16)

作者称安装前 60 条规则和只读扫描。

<details>
<summary>查看原文（16行）</summary>

```text
# dsh-plugin-gate（安装安全闸门）

**DeepSeek Harness 插件的安装安全闸门与数据保护闸 —— 在 `dsh plugin add` 之前，用 60 条静态签名规则（31 高危 / 24 中危 / 5 低危）扫描插件源码中的恶意安装脚本、凭据窃取、混淆与外传行为；并以 12 种危险命令模式与工作区边界检查，在 `rm -rf` 一类误删事故发生前将其拦截。**

插件市场膨胀迅速（数千条目），恶意代码混入插件只是时间问题。本插件为 agent 提供 `gate_scan` 工具，可扫描插件源码——**本地目录**或 **npm tarball**——检测经典恶意代码形态：

| 维度 | 检查内容 |
|---|---|
| **脚本** | npm 生命周期脚本（pre/install/postinstall）、exec/spawn/shell:true、curl\|sh、编码 PowerShell、cmd/WSH 启动、动态 require |
| **混淆** | eval / new Function / vm.runIn*、十六进制转义洪泛、base64 大块、字符数组打包 |
| **权限** | 读取凭据环境变量（OPENAI_API_KEY 等）、读取 ssh/aws/npmrc 文件、写入系统/家目录/点文件、chmod 777、沙箱权限升级请求 |
| **网络** | 外部 URL 与主机、fetch/axios/socket/WebSocket/DNS API、云元数据端点（169.254.169.254）、Discord/Telegram/Slack webhook、.onion、读文件后外发的"窃取"形态 |
| **密钥** | 硬编码 `sk-` 密钥、`ghp_` token、AWS key、私钥块、Bearer token |
| **供应链** | 精确版本直接依赖对接 **Google OSV** 漏洞库核查（range 与官方 @deepseek-ai 包跳过；可配置，离线静默降级） |

闸门**只读**：绝不执行被扫描的代码，绝不写文件。
```

</details>

**依据 2 · 源码核查**：[lib/index.js:94-116](https://github.com/863683348/dsh-plugin-gate/blob/b75c3a1b768448ee84a6fa07735206e6f8945411/lib/index.js#L94-L116)

runScan 分流 npm tarball/本地目录。

<details>
<summary>查看原文（23行）</summary>

```text
function apply(ctx, config) {
  const { baselineFile, reportFile } = config;

  /** Scan one target (npm spec or directory) and canonicalize the result. */
  async function runScan(args, exec) {
    const opts = scanOpts(config, args);
    const spec = String(args.target || "").trim();
    if (spec.length === 0) throw new Error("gate: target is required");
    let result;
    if (spec.startsWith("npm:")) {
      const pkgSpec = spec.slice(4).trim();
      if (pkgSpec.length === 0) throw new Error("gate: npm: needs a package name, e.g. npm:dsh-plugin-focus");
      result = await scanNpmPackage(pkgSpec, {
        fetchImpl: fetch,
        maxTarballBytes: config.maxTarballBytes,
        maxFileBytes: config.maxFileBytes,
        allowlistHosts: config.allowlistHosts,
        timeoutMs: 25000,
      });
    } else {
      const cwd = exec.agent && exec.agent.session && exec.agent.session.header ? exec.agent.session.header.cwd : undefined;
      const target = await ctx.fs.resolve(spec, cwd !== undefined ? { cwd, signal: exec.signal } : { signal: exec.signal });
      result = await scanDirectory(ctx.fs, target, opts, exec.signal);
```

</details>

**依据 3 · 源码核查**：[lib/index.js:135-148](https://github.com/863683348/dsh-plugin-gate/blob/b75c3a1b768448ee84a6fa07735206e6f8945411/lib/index.js#L135-L148)

注册 gate_scan。

<details>
<summary>查看原文（14行）</summary>

```text
  ctx.tools.register(defineTool({
    name: "gate_scan",
    description: "Installation safety gate for plugins: scan a plugin source (a local directory, or an npm package via the npm: prefix) for malicious install scripts, dangerous permissions and file writes, credential reads, obfuscation, and network callbacks, then return a verdict (BLOCK / WARN / PASS) with per-line evidence. Use it BEFORE installing any plugin from a marketplace or registry. Examples: target \"npm:dsh-plugin-focus\", target \"./downloaded-plugin\", or an absolute directory path.",
    parameters: {
      target: {
        type: "string",
        required: true,
        description: "Where to scan. A local directory path, or an npm spec prefixed with npm: (e.g. npm:dsh-plugin-focus, npm:dsh-plugin-focus@1.0.1).",
      },
      includeNodeModules: {
        type: "boolean",
        description: "Optional override: descend into node_modules when scanning a directory (default off).",
      },
    },
```

</details>

**依据 4 · 源码核查**：[lib/index.js:283-345](https://github.com/863683348/dsh-plugin-gate/blob/b75c3a1b768448ee84a6fa07735206e6f8945411/lib/index.js#L283-L345)

注册差分工具。

<details>
<summary>查看原文（63行）</summary>

```text

  ctx.tools.register(defineTool({
    name: "gate_diff",
    description: "Compare a fresh scan of a target against the stored baseline (.dsh/gate-baseline.json in the session workspace): report findings that are NEW, RESOLVED, CHANGED (count differs) or UNCHANGED since the last baseline, plus the verdict transition. Use it after a fix to confirm the risk actually went away and nothing new appeared; pass update=true to store this scan as the new baseline. Findings are fingerprinted by rule + severity + file, so line shifts do not create false 'new' entries.",
    parameters: {
      target: {
        type: "string",
        required: true,
        description: "Where to scan: a local directory path, or an npm spec prefixed with npm: (e.g. npm:dsh-plugin-focus).",
      },
      update: { type: "boolean", description: "Store this scan as the new baseline (default false)." },
      includeNodeModules: { type: "boolean", description: "Descend into node_modules when scanning a directory." },
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: true,
        properties: {
          verdict: { type: "string" },
          added: { type: "integer", required: true },
          resolved: { type: "integer", required: true },
          changed: { type: "integer", required: true },
          unchanged: { type: "integer", required: true },
          clean: { type: "boolean", required: true },
          updated: { type: "boolean", required: true },
          path: { type: "string" },
          text: { type: "string", required: true },
        },
      },
      render: (_args, value) => [{ type: "text", text: value.text }],
    },
    execute: async (args, exec) => {
      const result = await runScan(args, exec);
      const cwd = exec.agent && exec.agent.session && exec.agent.session.header ? exec.agent.session.header.cwd : undefined;
      const path = await resolveWorkspaceFile(ctx, baselineFile, cwd, exec.signal);
      let baseline = null;
      const info = await ctx.fs.stat(path, exec.signal);
      if (info !== undefined) {
        try { baseline = JSON.parse(await ctx.fs.readText(path, exec.signal)); } catch { baseline = null; }
      }
      const target = String(args.target || "");
      const diff = diffBaseline({ baseline, result, target });
      let updated = false;
      if (args.update === true) {
        await ctx.fs.writeText(path, JSON.stringify(buildBaseline({ target, result }), null, 2), undefined, exec.signal);
        updated = true;
      }
      return {
        verdict: result.verdict ?? null,
        added: diff.counts.added,
        resolved: diff.counts.resolved,
        changed: diff.counts.changed,
        unchanged: diff.counts.unchanged,
        clean: diff.clean,
        updated,
        path: ctx.fs.processPath(path),
        text: renderDiff({ diff, target }) + (updated ? "\n\nBaseline updated: " + ctx.fs.processPath(path) : ""),
      };
    },
    presentCall: (args) => ({ card: "generic", title: "Gate diff: " + String(args.target || ""), kind: "other", rawInput: args }),
  }));

  ctx.tools.register(defineTool({
```

</details>

**依据 5 · 源码核查**：[lib/index.js:408-415](https://github.com/863683348/dsh-plugin-gate/blob/b75c3a1b768448ee84a6fa07735206e6f8945411/lib/index.js#L408-L415)

systemPrompt 文字引导。

```text
  if (config.promptSection) {
    ctx.effect(() => ctx.systemPrompt.section({
      name: "gate:instructions",
      order: config.sectionOrder,
      text: GATE_SECTION_TEXT,
    }), "gate.section()");
  }
}
```

#### 缺口

- 未在 DSH 安装流程接入点做真实阻断验证。
  **影响：**Agent 不调用时不会执行扫描。
  **进一步探讨：**在隔离 profile 观察插件安装命令前是否被自动拦截或只靠提示词。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · PASS 是否代表扫描完整和安全？

**研究主题：**缺陷与关键质疑、工程质量与复用

#### 完整回答

buildResult 只按 high/medium 命中决定 BLOCK/WARN/PASS；目录超 maxFiles、文件过大/不可读、遍历报错、tarball 解包截断及 OSV 查询失败只写入 notes，未必影响判定。于是部分内容未检或依赖漏洞数据库不可用时仍可得到 PASS，使用者需先核对 filesScanned/filesTotal 与 notes，且目录 filesTotal 只是已收集文件数，不代表整个目录。README 对 PASS 的启发式性质有提醒，但若把 PASS 视为“已审完所有源码”会误判。建议覆盖率不全时至少 WARN，并在 UI/文本中突出未检原因。

#### 证据与依据

**依据 1 · 源码核查**：[lib/scan.js:312-378](https://github.com/863683348/dsh-plugin-gate/blob/b75c3a1b768448ee84a6fa07735206e6f8945411/lib/scan.js#L312-L378)

目录跳过与截断 notes。

<details>
<summary>查看原文（67行）</summary>

```text
export async function scanDirectory(fs, root, opts = {}, signal) {
  const { maxFiles = 1000, maxFileBytes = 2 * 1024 * 1024, includeNodeModules = false, allowlistHosts = [] } = opts;
  const rootTarget = typeof root === "string" ? await fs.resolve(root, { signal }) : root;
  const rootPath = fs.processPath(rootTarget);

  const { files, truncatedDir, dirError } = await collectFiles(fs, rootTarget, { maxFiles, includeNodeModules }, signal);

  const hits = [];
  const notes = [];
  const hosts = new Set();
  const readAndSendFiles = [];
  let filesScanned = 0;
  let pkgInfo = null;

  for (const f of files) {
    if (isBinaryName(f.rel)) {
      hits.push({
        rule: "binary_blob",
        category: CATEGORY.BINARY,
        severity: "medium",
        file: f.rel,
        line: 1,
        count: 1,
        evidence: "binary file in package (" + path.extname(f.rel) + ")",
        hint: "Binary artifacts can hide compiled payloads; rebuild from source instead of shipping them.",
      });
      continue;
    }
    if (f.size !== undefined && f.size > maxFileBytes) {
      notes.push({ file: f.rel, kind: "oversized", detail: f.size + " bytes > " + maxFileBytes });
      continue;
    }
    const content = await readFileCapped(fs, f.target, maxFileBytes, signal);
    if (content === null) {
      notes.push({ file: f.rel, kind: "unreadable", detail: "binary or oversized or unreadable" });
      continue;
    }
    filesScanned += 1;
    const res = scanFileText({ rel: f.rel, content });
    hits.push(...res.hits);
    notes.push(...res.notes);
    if (res.pkg) pkgInfo = res.pkg;
    for (const h of extractHosts(content)) hosts.add(h);
    if (hasReadAndSend(content)) readAndSendFiles.push(f.rel);
  }

  if (truncatedDir) notes.push({ file: ".", kind: "truncated", detail: "file count exceeded maxFiles=" + maxFiles });
  if (dirError) notes.push({ file: ".", kind: "dir-error", detail: dirError });

  if (opts.osvCheck && pkgInfo) {
    const deps = exactVersionDeps(pkgInfo.depMap || {}, { max: opts.osvMaxDeps || 8 });
    const osv = await checkOsvDeps(opts.fetchImpl || fetch, deps, { timeoutMs: opts.osvTimeoutMs || 10000 });
    hits.push(...osv.hits);
    notes.push(...osv.notes);
  }

  return buildResult({
    mode: "dir",
    target: rootPath,
    hits,
    notes,
    hosts: [...hosts],
    readAndSendFiles,
    filesScanned,
    filesTotal: files.length,
    truncatedDir,
    allowlistHosts,
```

</details>

**依据 2 · 源码核查**：[lib/scan.js:493-500](https://github.com/863683348/dsh-plugin-gate/blob/b75c3a1b768448ee84a6fa07735206e6f8945411/lib/scan.js#L493-L500)

tarball 截断写 notes。

```text
  const { extractTarball } = await import("./targz.js");
  const { files, truncated } = extractTarball(buf, { maxBytes: maxTarballBytes * 2, maxFiles: 2000 });

  const result = scanTarballFiles(files, { maxFileBytes, allowlistHosts });
  result.target = name + "@" + versionMeta.version;
  if (truncated.files || truncated.traversal || truncated.pax) {
    result.notes.push({ file: "tarball", kind: "truncated", detail: JSON.stringify(truncated) });
  }
```

**依据 3 · 源码核查**：[lib/scan.js:546-580](https://github.com/863683348/dsh-plugin-gate/blob/b75c3a1b768448ee84a6fa07735206e6f8945411/lib/scan.js#L546-L580)

判定只看命中等级。

<details>
<summary>查看原文（35行）</summary>

```text
/** Finalize counts, verdict, network summary and recommendations. */
function buildResult(base, overrides = {}) {
  const allowlistHosts = (overrides.allowlistHosts || base.allowlistHosts || []).map((h) => String(h).toLowerCase());
  const hits = dedupeHits(base.hits || []);
  const summary = { high: 0, medium: 0, low: 0, categories: {} };
  for (const h of hits) {
    summary[h.severity] += 1;
    summary.categories[h.category] = (summary.categories[h.category] || 0) + 1;
  }
  const score = (summary.high || 0) * SEVERITY_WEIGHT.high + (summary.medium || 0) * SEVERITY_WEIGHT.medium + (summary.low || 0) * SEVERITY_WEIGHT.low;
  const verdict = summary.high > 0 ? "BLOCK" : summary.medium > 0 ? "WARN" : "PASS";

  const hosts = [...new Set((base.hosts || []).map((h) => h.toLowerCase()))];
  const unallowlisted = hosts.filter((h) => !LOCAL_HOSTS.has(h) && !allowlistHosts.includes(h));

  const recommendations = [];
  if (verdict === "BLOCK") recommendations.push("BLOCK: high-severity patterns found. Do NOT install this package until every high hit is explained and resolved.");
  if (summary.medium > 0) recommendations.push("WARN: medium-severity patterns found. Review every hit in context before deciding to install.");
  if (summary.categories[CATEGORY.SCRIPTS] > 0) recommendations.push("Inspect npm lifecycle scripts (pre/install/postinstall) — they execute during install without your explicit action.");
  if (summary.categories[CATEGORY.NETWORK] > 0) recommendations.push("Network I/O detected: verify every destination, and confirm no data leaves the workspace without purpose.");
  if (summary.categories[CATEGORY.PERMISSIONS] > 0) recommendations.push("File/permission access detected: confirm reads/writes stay inside the session workspace and no credentials are touched.");
  if (summary.categories[CATEGORY.SECRETS] > 0) recommendations.push("Hardcoded credential material found — treat the package as compromised if any hit is a live secret.");
  if (summary.categories[CATEGORY.OBFUSCATION] > 0) recommendations.push("Obfuscated code paths found — decode and review before trusting runtime behavior.");
  if (summary.categories[CATEGORY.BINARY] > 0) recommendations.push("Binary artifacts shipped in the package — prefer building from source.");
  if (recommendations.length === 0) recommendations.push("No risky patterns detected by signature scan. This is a heuristic result, not a guarantee — review critical plugins manually too.");
  if (verdict === "BLOCK") recommendations.push("Gate policy: refuse installation on BLOCK verdicts unless the maintainer provides a clean rebuild you can scan again.");

  return {
    verdict,
    score,
    mode: base.mode,
    target: base.target,
    filesScanned: base.filesScanned,
    filesTotal: base.filesTotal,
    summary,
```

</details>

**依据 4 · 作者声明**：[README.zh.md:34-40](https://github.com/863683348/dsh-plugin-gate/blob/b75c3a1b768448ee84a6fa07735206e6f8945411/README.zh.md#L34-L40)

作者解释 PASS 是启发式。

```text
### 判定语义

- **BLOCK**：存在高危特征（安装期执行、编码 PowerShell、eval/Function、云元数据探测、webhook、私钥、读取凭据）。修复并重新扫描前不要安装。
- **WARN**：中等风险特征需人工复核（网络 I/O、家目录写入、base64 大块）。逐条看证据再决定。
- **PASS**：未发现风险签名。仅为启发式结果，对陌生作者仍需保持警惕。

上下文感知：文件未 import `child_process` 时，`exec()`/正则 `RegExp#exec` 命中会被降级，减少误报；代码执行类规则（exec、eval、curl|sh、PowerShell…）出现在**注释或文档**中时自动降为 low（示例而非行为），而密钥与 webhook 即使在注释中仍保持高警示。依赖从 git/http/file 安装会标记为 `risky_dependency`，超 4000 字符的压缩单行标记为 `minified_line`（low）。
```

#### 缺口

- 未用实际受限 tarball/目录运行扫描。
  **影响：**具体绕过比例和误报率未量测。
  **进一步探讨：**用超 1000 文件、超 2 MiB 文件和 OSV 失败样本验证判定，并对照人工审阅。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 数据保护守卫和只读承诺有什么边界？

**研究主题：**依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

gate_guard 是 Agent 可选调用的模型工具，对命令用正则、路径用字符串规范化判定；它没有 hook shell/file API，不能强制阻止删除。路径判定在缺少 workspace 时先返回 WARN，连根路径都不会 BLOCK；有 workspace 时，内部任意路径均返回 WARN，不形成细粒度 PASS。README “绝不写文件”仅适用于 gate_scan 的扫描过程：gate_diff 的 update=true 会写基线，gate_report 的 write=true 会写报告，且都通过宿主 fs 写入会话工作区。这些写入是明示 opt-in，但整体插件并非严格只读。采用时应把它当提示/审查工具，不能替代宿主权限与执行前强制拦截。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:240-281](https://github.com/863683348/dsh-plugin-gate/blob/b75c3a1b768448ee84a6fa07735206e6f8945411/lib/index.js#L240-L281)

gate_guard 的可选注册和调用。

<details>
<summary>查看原文（42行）</summary>

```text
  ctx.tools.register(defineTool({
    name: "gate_guard",
    description: "Data-protection guard: before ANY destructive operation, evaluate a shell command (gate_guard with command) or a file target (gate_guard with path + action) and get a BLOCK / WARN / PASS verdict with reasons. BLOCK = device/root-level destruction — refuse. WARN = recursive, outside-workspace, or critical file — confirm the exact target first. PASS = no destructive signature. Use it before rm -rf, Remove-Item -Recurse, rmdir /s, del /f /s, format, dd, mkfs, or deleting/overwriting files.",
    parameters: {
      input: {
        type: "object",
        additionalProperties: false,
        properties: {
          command: { type: "string", description: "要评估的 shell 命令（如 rm -rf ./node_modules）" },
          path: { type: "string", description: "要删除/覆盖的文件或目录路径" },
          action: { type: "string", enum: ["delete", "overwrite", "move"], description: "路径操作类型，默认 delete" },
        },
      },
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: true,
        properties: {
          verdict: { type: "string", enum: ["BLOCK", "WARN", "PASS"] },
          reasons: { type: "array", items: { type: "string" } },
          suggestion: { type: "string" },
        },
      },
      render: (_a, v) => [{ type: "text", text: v.verdict + ": " + v.reasons.join("; ") + "\n" + v.suggestion }],
    },
    execute: async (args, exec) => {
      const cwd = exec.agent?.session?.header?.cwd;
      if (args.command) {
        const r = evaluateCommand(args.command);
        const suggestion = r.verdict === "BLOCK" ? "Refuse: this destroys data at a device or root level. Do not run it." : r.verdict === "WARN" ? "Confirm the exact target before proceeding; it is a recursive/force delete." : "No destructive signature detected — proceed with normal caution.";
        return { verdict: r.verdict, reasons: r.reasons, suggestion };
      }
      if (args.path) {
        const r = evaluatePath(args.path, cwd, { action: args.action || "delete" });
        const suggestion = r.verdict === "BLOCK" ? "Refuse: the target is a root or the workspace itself. Confirm intent." : "Confirm the exact path before proceeding. A critical file or workspace boundary is involved.";
        return { verdict: r.verdict, reasons: r.reasons, suggestion };
      }
      return { verdict: "WARN", reasons: ["provide either command or path"], suggestion: "Call gate_guard with a command string or a file path." };
    },
    presentCall: (args) => ({ card: "generic", title: "Gate guard", kind: "other", rawInput: args }),
  }));
```

</details>

**依据 2 · 源码核查**：[lib/protect.js:34-73](https://github.com/863683348/dsh-plugin-gate/blob/b75c3a1b768448ee84a6fa07735206e6f8945411/lib/protect.js#L34-L73)

正则命令判断与字符串路径边界。

<details>
<summary>查看原文（40行）</summary>

```text
/** Evaluate a shell command string. Pure. */
export function evaluateCommand(cmd, { workspace } = {}) {
  const text = String(cmd ?? "");
  if (!text.trim()) return { verdict: "PASS", reasons: ["empty command"] };
  for (const p of BLOCK_PATTERNS) {
    if (p.re.test(text)) return { verdict: "BLOCK", reasons: [p.why] };
  }
  const warns = [];
  for (const p of WARN_PATTERNS) {
    if (p.re.test(text)) warns.push(p.why);
  }
  if (warns.length) return { verdict: "WARN", reasons: warns };
  return { verdict: "PASS", reasons: ["no destructive signature detected"] };
}

function normalize(p) {
  let s = String(p ?? "").replace(/\\/g, "/");
  if (s.length > 1) s = s.replace(/[\/]+$/, "");
  return s;
}

/** Evaluate a file-op target against the workspace boundary. Pure. */
export function evaluatePath(path, workspace, { action = "delete" } = {}) {
  const target = normalize(path);
  const ws = normalize(workspace);
  const reasons = [];
  if (!target) return { verdict: "WARN", reasons: ["empty target"] };
  if (!ws) return { verdict: "WARN", reasons: ["no workspace boundary available — confirm the target manually"] };

  const isRoot = target === "/" || /^[a-zA-Z]:[\/]?$/.test(target);
  if (isRoot) return { verdict: "BLOCK", reasons: ["target is a filesystem/drive root"] };
  if (CRITICAL_RE.test(target)) reasons.push("target is a critical file (" + action + " on " + target + ")");
  if (target === ws) return { verdict: "BLOCK", reasons: ["target is the workspace root itself"] };
  if (target.startsWith(ws + "/")) {
    reasons.push("target is inside the workspace — confirm the exact path");
    return { verdict: CRITICAL_RE.test(target) ? "WARN" : "WARN", reasons };
  }
  reasons.push("target is OUTSIDE the workspace — explicit user intent required");
  return { verdict: "WARN", reasons };
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:314-340](https://github.com/863683348/dsh-plugin-gate/blob/b75c3a1b768448ee84a6fa07735206e6f8945411/lib/index.js#L314-L340)

gate_diff 可更新写基线。

<details>
<summary>查看原文（27行）</summary>

```text
    execute: async (args, exec) => {
      const result = await runScan(args, exec);
      const cwd = exec.agent && exec.agent.session && exec.agent.session.header ? exec.agent.session.header.cwd : undefined;
      const path = await resolveWorkspaceFile(ctx, baselineFile, cwd, exec.signal);
      let baseline = null;
      const info = await ctx.fs.stat(path, exec.signal);
      if (info !== undefined) {
        try { baseline = JSON.parse(await ctx.fs.readText(path, exec.signal)); } catch { baseline = null; }
      }
      const target = String(args.target || "");
      const diff = diffBaseline({ baseline, result, target });
      let updated = false;
      if (args.update === true) {
        await ctx.fs.writeText(path, JSON.stringify(buildBaseline({ target, result }), null, 2), undefined, exec.signal);
        updated = true;
      }
      return {
        verdict: result.verdict ?? null,
        added: diff.counts.added,
        resolved: diff.counts.resolved,
        changed: diff.counts.changed,
        unchanged: diff.counts.unchanged,
        clean: diff.clean,
        updated,
        path: ctx.fs.processPath(path),
        text: renderDiff({ diff, target }) + (updated ? "\n\nBaseline updated: " + ctx.fs.processPath(path) : ""),
      };
```

</details>

**依据 4 · 源码核查**：[lib/index.js:374-404](https://github.com/863683348/dsh-plugin-gate/blob/b75c3a1b768448ee84a6fa07735206e6f8945411/lib/index.js#L374-L404)

gate_report 可写报告。

<details>
<summary>查看原文（31行）</summary>

```text
    execute: async (args, exec) => {
      const result = await runScan(args, exec);
      const format = args.format === "json" ? "json" : "md";
      const findings = Array.isArray(result.hits) ? result.hits.length : 0;
      const cwd = exec.agent && exec.agent.session && exec.agent.session.header ? exec.agent.session.header.cwd : undefined;
      let diff = null;
      if (args.withBaseline !== false) {
        const baselinePath = await resolveWorkspaceFile(ctx, baselineFile, cwd, exec.signal);
        const info = await ctx.fs.stat(baselinePath, exec.signal);
        if (info !== undefined) {
          try {
            const baseline = JSON.parse(await ctx.fs.readText(baselinePath, exec.signal));
            diff = diffBaseline({ baseline, result, target: String(args.target || "") });
          } catch { diff = null; }
        }
      }
      const date = new Date().toISOString();
      const target = String(args.target || "");
      const body = format === "json"
        ? renderJsonReport({ target, result, date, diff })
        : renderMarkdownReport({ target, result, date, diff });
      let writtenPath;
      if (args.write === true) {
        const outFile = args.path || (format === "json" ? reportFile.replace(/\.md$/, ".json") : reportFile);
        const outPath = await resolveWorkspaceFile(ctx, outFile, cwd, exec.signal);
        await ctx.fs.writeText(outPath, body, undefined, exec.signal);
        writtenPath = ctx.fs.processPath(outPath);
      }
      const text = writtenPath ? body + "\n\nWritten to " + writtenPath : body;
      return { verdict: result.verdict ?? null, format, findings, path: writtenPath, text };
    },
```

</details>

**依据 5 · 作者声明**：[README.zh.md:16-16](https://github.com/863683348/dsh-plugin-gate/blob/b75c3a1b768448ee84a6fa07735206e6f8945411/README.zh.md#L16-L16)

作者称闸门绝不写文件。

```text
闸门**只读**：绝不执行被扫描的代码，绝不写文件。
```

#### 缺口

- 未运行宿主 shell/file API 观察真实约束。
  **影响：**实际 Agent 调用率和防误删效果未知。
  **进一步探讨：**在隔离会话测试不调用 guard 时的宿主行为；将强制保护下沉到执行层。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
