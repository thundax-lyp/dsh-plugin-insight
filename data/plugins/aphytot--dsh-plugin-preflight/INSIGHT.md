# dsh-plugin-preflight

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[ae10f46](https://github.com/AphyTOT/dsh-plugin-preflight/tree/ae10f46bcf65258d61fe54d966e8bdcc0daf60f6)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AphyTOT/dsh-plugin-preflight)
<!-- END META -->

> **实现功能**：以 CLI 和模型工具预检 DSH 插件清单、patch、客户端包和预发布 peer 范围。

> **核心亮点**：把DSH特有组合与预发布peer约束变成可重复结构报告，并在不知道宿主版本时限制判断，避免猜测兼容；增量是提交前诊断而非功能验收。[Q01](#research-q01) [Q02](#research-q02)

> **风险与缺陷**：正则外形检查和简化semver不能证明宿主组合正确；宿主版本无法解析时部分规则静默，工具注册失败也静默，用户可能误读无错误为完整通过。[Q03](#research-q03)

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
  - [Q01 · 预检比人工阅读清单增加什么？](#detail-section-11)
  - [Q02 · CLI与模型工具如何共享规则和环境？](#detail-section-12)
  - [Q03 · 无报告能证明什么，误报漏报与成本如何？](#detail-section-13)
  - [Q04 · 可否发布覆盖与环境证明？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：插件作者在提交或发布前反复核对结构规则，可把报告接入CI；绿色结果只覆盖已实现检查。[Q01](#research-q01)

人工阅读贡献指南与npm打包检查可覆盖部分同类问题；该工具增加可重复领域规则，不替代宿主解析。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| CLI预检 | 提交前结构报告 | Node和目标目录可读，非运行验收 |
| strict与JSON输出 | 接入CI | warning阻断由使用者选择 |
| 模型工具预检 | Agent检查仓库 | dsh-tools可解析并成功注册 |
| peer范围核对 | 对照实际宿主版本 | 版本不可见时覆盖有限 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=18.12与可读仓库 | CLI必需 | 读取规则目标 | 无法预检 |
| dsh-tools与tools服务 | 模型工具必需 | 注册plugin_preflight | 降级CLI，工具缺席 |
| 目标profile依赖清单 | 具体peer判断必需 | 取得实际版本 | 除有限wildcard外静默 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 作者指定仓库与宿主环境 | 路径和版本正确 |
| 检查 | CLI或模型工具运行 | 取得报告和退出状态 |
| 修复 | 作者核对finding并重检 | 无阻断后继续打包与加载验证 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Node与CI资源，金额未知 | 配置目录、strict策略 | 宿主解析环境影响覆盖 |
| 持续使用 | 文件读取与CI资源未测 | 审阅finding和规则升级 | 不能代替功能验证 |
| 失败恢复 | 重新检查资源未知 | 回原规则、实际打包与宿主核查 | 误报漏报率未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 结构问题报告 | 固定规则与修复提示 | 真实误报漏报率 |
| CI接入 | CLI strict和JSON实现 | 当前CI环境兼容 |
| 插件可用性 | 仅部分结构约束 | 功能、渲染与宿主行为 |

> **思考**：正则外形检查和简化semver不能证明宿主组合正确；宿主版本无法解析时部分规则静默，工具注册失败也静默，用户可能误读无错误为完整通过。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把DSH特有组合与预发布peer约束变成可重复结构报告，并在不知道宿主版本时限制判断，避免猜测兼容；增量是提交前诊断而非功能验收。[Q01](#research-q01) [Q02](#research-q02)

把DSH特有组合与预发布peer约束变成可重复结构报告，并在不知道宿主版本时限制判断，避免猜测兼容；增量是提交前诊断而非功能验收。[Q01](#research-q01) [Q02](#research-q02)

共享check减少CLI与模型工具语义漂移，延迟导入避免运行时解析失败阻断整个宿主；但吞错降低可观测性，简化解析器需要差分验证。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

正则外形检查和简化semver不能证明宿主组合正确；宿主版本无法解析时部分规则静默，工具注册失败也静默，用户可能误读无错误为完整通过。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先对已知正确和已知错误的插件各检查一次，核对规则是否符合当前宿主。把它加入提交前流程，保留真实打包和加载检查；本地链接导致工具缺席时确认CLI路径。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态规则与共享入口有源码支持；误报漏报、当前宿主兼容与真实效果未独立执行验证。覆盖证明方案为假设。

- 已检查：作者 README、包清单、源码路径 lib/check.js、lib/index.js、lib/cli.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定检查器、CLI与宿主入口源码；未执行目标代码、作者测试或真实宿主。
- 下一步：以官方semver与宿主patch解析为参照检查边界，核对不同目录、链接安装和实际工具注册，未执行。

**分析版本**

- **仓库**：[AphyTOT/dsh-plugin-preflight](https://github.com/AphyTOT/dsh-plugin-preflight)
- **版本号**：0.1.1（[固定提交 ae10f46](https://github.com/AphyTOT/dsh-plugin-preflight/tree/ae10f46bcf65258d61fe54d966e8bdcc0daf60f6)）
- **版本日期**：2026-09-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可增加已检查/未知的覆盖报告，并以固定官方解析器差分核对边界；若提示不能促成行动或依赖破坏离线诊断，应收窄。未验证。[Q04](#research-q04)

以官方semver与宿主patch解析为参照检查边界，核对不同目录、链接安装和实际工具注册，未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 409 | — | — | 3777 |
| .js | source | 5 | 898 | 570 | 263 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-24），可前往 [GitHub Issues](https://github.com/AphyTOT/dsh-plugin-preflight/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：检验预检规则的提交前价值、环境依赖与静态覆盖边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 预检比人工阅读清单增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它面向 DSH 插件作者和提交清单的维护者，在发布前重复检查 manifest、patch、浏览器 bundle 和 peer 范围。合格结果是带稳定规则名、严重程度和修复提示的结构报告，能在 CI 阻止已知阻断问题。相对人工翻贡献指南，增量是可重复执行和可机器消费；相对通用 npm 检查，增量是 DSH 的 Loader 与预发布版本约束。它不评功能效果、代码质量或真实宿主可用性。README 的目录调查与执行结果属于作者声明，本次没有重跑，不以这些数值作为独立收益证据。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-34](https://github.com/AphyTOT/dsh-plugin-preflight/blob/ae10f46bcf65258d61fe54d966e8bdcc0daf60f6/README.md#L5-L34)

作者定义提交前检查与规则范围。

<details>
<summary>查看原文（30行）</summary>

````text
Check a [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) plugin **before** you submit it to the
[community list](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) — or before you publish it at all.

```sh
npx dsh-plugin-preflight              # check the current directory
npx dsh-plugin-preflight path/to/repo # check somewhere else
npx dsh-plugin-preflight --strict     # fail on warnings too, for CI
```

Exit code is `0` when nothing blocks a submission and `1` when something does, so it drops straight into a workflow.

## What it catches

The list's own [contributing guide](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/main/contributing.md) is the
specification. These are the parts of it a machine can verify:

| Rule | Why it matters |
|---|---|
| `bundle/missing` | Declaring only `dsh.client` is **the most common reason a submission is rejected** — `dsh.bundle` is what makes a plugin installable |
| `bundle/patch-missing` | `dsh.bundle.patch` points at a file that does not exist |
| `patch/no-name`, `patch/name-mismatch` | The patch layer inserts no row, or a row named something that is not this package — nothing mounts |
| `patch/id-missing` | Rows without a stable `id` cannot be targeted by a later patch layer |
| `client/export-missing`, `client/bundle-missing` | Declares `dsh.client` but ships no `./client` export — the client module system throws |
| `client/loader-missing`, `client/id-mismatch` | A client bundle must be a lazy-CJS factory registering `window.__ModuleLoader__.load({ id, factory })` under the package's own name |
| `client/external-self` | A row that lists its own package in `dsh.client.external` makes composition throw |
| `deps/host-packages` | `@deepseek-ai/*` services belong in `peerDependencies`, not `dependencies` |
| `peer/prerelease-tuple` | The range does not match the harness you actually have installed — see below |
| `peer/wildcard` | A bare `*` matches no prerelease at all |
| `files/bin-uncovered` | The CLI is not in `files[]`, so it vanishes from the published tarball |
| `manifest/*`, `description/*`, `metadata/*` | BOM-corrupted or unparseable manifests, marketing language, unverifiable counts, missing `repository.url` |
````

</details>

**依据 2 · 源码核查**：[lib/check.js:120-160](https://github.com/AphyTOT/dsh-plugin-preflight/blob/ae10f46bcf65258d61fe54d966e8bdcc0daf60f6/lib/check.js#L120-L160)

报告按规则收集并检查 manifest/bundle，支持结构预检判断。

<details>
<summary>查看原文（41行）</summary>

```text
export async function check(options = {}) {
  const dir = resolve(options.dir ?? process.cwd());
  const findings = [];
  const add = (level, rule, message, fix) => {
    findings.push(fix === undefined ? { level, rule, message } : { level, rule, message, fix });
  };

  const manifestPath = join(dir, 'package.json');
  if (!existsSync(manifestPath)) {
    add('error', 'manifest/missing', `no package.json at ${manifestPath}`, 'run this from the root of your plugin repository');
    return buildReport(dir, null, findings);
  }

  const parsedManifest = readJson(manifestPath);
  if (parsedManifest.error !== undefined) {
    add('error', 'manifest/unparseable', `package.json is not valid JSON: ${parsedManifest.error}`);
    return buildReport(dir, null, findings);
  }
  const pkg = parsedManifest.value;
  const pkgName = typeof pkg.name === 'string' ? pkg.name : null;

  const host = resolveHostVersion(dir);

  // ── installability: the #1 reason submissions are rejected ────────────────
  const dsh = pkg.dsh !== null && typeof pkg.dsh === 'object' ? pkg.dsh : undefined;
  const bundle = dsh?.bundle;
  const patchSpec = bundle !== null && typeof bundle === 'object' ? bundle.patch : undefined;

  if (bundle === undefined) {
    add(
      pkg.dsh?.client !== undefined ? 'error' : 'warning',
      'bundle/missing',
      pkg.dsh?.client !== undefined
        ? 'declares dsh.client but NOT dsh.bundle — this is the most common rejection reason, and dsh.client alone is not installable'
        : 'no dsh.bundle declaration — the plugin cannot be installed with `dsh plugin add` and will not be listed',
      '"dsh": { "bundle": { "patch": "./cordis.patch.yml" } }',
    );
  } else if (typeof patchSpec !== 'string' || patchSpec === '') {
    add('error', 'bundle/patch-spec', 'dsh.bundle.patch must be a non-empty string path', '"bundle": { "patch": "./cordis.patch.yml" }');
  } else if (!existsSync(join(dir, normalizeRelative(patchSpec)))) {
    add('error', 'bundle/patch-missing', `dsh.bundle.patch points at "${patchSpec}", which does not exist`, `create ${patchSpec}`);
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · CLI与模型工具如何共享规则和环境？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

CLI 与宿主工具都调用 check 和 renderReport，共享同一文件读取规则。宿主半部延迟导入 dsh-tools，导入或注册失败被吞掉，保留 CLI 路径但模型工具可能缺席；这是以可降级换可观测性的取舍。宿主版本解析从被检查目录向上寻找 node_modules 的包清单，所以当前工作目录和安装布局会改变 peer 检查结论。没有解析到版本时，除 dsh-* 裸 wildcard 外不猜版本；解析到时用内置简化 semver 判断。CLI strict 可把 warnings 计入阻断，而默认成功只表示未发现 error。读源码路径不执行目标插件，但使用者仍需选择正确仓库与对应宿主环境。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:29-51](https://github.com/AphyTOT/dsh-plugin-preflight/blob/ae10f46bcf65258d61fe54d966e8bdcc0daf60f6/lib/index.js#L29-L51)

延迟运行时导入和工具注册的条件。

<details>
<summary>查看原文（23行）</summary>

```text
async function loadToolRuntime() {
  if (toolRuntimeProbed) return toolRuntime;
  toolRuntimeProbed = true;
  try {
    toolRuntime = await import('@deepseek-ai/dsh-tools');
  } catch {
    toolRuntime = null;
  }
  return toolRuntime;
}

export function apply(ctx) {
  void loadToolRuntime().then((runtime) => {
    // No tools runtime reachable: stay mounted as a CLI-only plugin rather than
    // taking the harness down with us.
    if (runtime === null || typeof runtime.defineTool !== 'function') return;

    ctx.tools.register(runtime.defineTool({
      name: 'plugin_preflight',
      description: 'Check a DeepSeek Harness plugin repository against the community list\'s '
        + 'submission requirements before submitting it: the dsh.bundle manifest, cordis.patch.yml '
        + 'wiring, the client bundle shape, and peer ranges that silently exclude prerelease builds '
        + 'of the harness. Returns a dsh-plugin-preflight/v1 report of errors, warnings and fixes. Read-only.',
```

</details>

**依据 2 · 源码核查**：[lib/check.js:61-81](https://github.com/AphyTOT/dsh-plugin-preflight/blob/ae10f46bcf65258d61fe54d966e8bdcc0daf60f6/lib/check.js#L61-L81)

宿主版本由目录向上解析，限定环境语义。

<details>
<summary>查看原文（21行）</summary>

```text
function resolvePackageJson(packageName, fromDir) {
  const parts = packageName.split('/');
  let dir = resolve(fromDir);
  for (;;) {
    const candidate = join(dir, 'node_modules', ...parts, 'package.json');
    if (existsSync(candidate)) return candidate;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

/** The version of an installed host package, or null when it cannot be resolved. */
function hostVersionOf(packageName, fromDir) {
  const manifestPath = resolvePackageJson(packageName, fromDir);
  if (manifestPath === null) return null;
  const parsed = readJson(manifestPath);
  if (parsed.error !== undefined) return null;
  const version = parsed.value?.version;
  return typeof version === 'string' && version !== '' ? version : null;
```

</details>

**依据 3 · 源码核查**：[lib/check.js:242-278](https://github.com/AphyTOT/dsh-plugin-preflight/blob/ae10f46bcf65258d61fe54d966e8bdcc0daf60f6/lib/check.js#L242-L278)

无法确定宿主时仅作有限 wildcard 判断，不推测目标版本。

<details>
<summary>查看原文（37行）</summary>

```text
    const resolved = hostVersionOf(peerName, dir);
    if (resolved === null) {
      // No installed version to compare against. Judge the range on its own terms, but
      // ONLY for packages that publish prereleases exclusively.
      //
      // This restriction is the whole correctness of the check. `@deepseek-ai/dsh-*`
      // packages are prerelease-only (every one of their 23 published versions carries a
      // tag), so a range that cannot admit a prerelease is a real defect there. But
      // `@deepseek-ai/cordis` and `schemastery` publish stable releases too, and for them
      // "^4.0.1" is simply correct — flagging it reported a 92% hazard rate across the
      // catalog that was pure false positives.
      if (PRERELEASE_ONLY.test(peerName) && /^[*xX]$/.test(range.trim())) {
        // The ONLY call this tool makes without a resolved version, because it is not a
        // judgement about which prerelease matters — npm itself rejects it. `*` has no
        // prerelease-tagged comparator on any tuple, so it excludes every prerelease,
        // and every DeepSeek Harness release is one.
        add(
          'warning',
          'peer/wildcard',
          `peer "${peerName}": "*" does not match ANY prerelease version, and every DeepSeek Harness release is a prerelease`,
          'name a range that reaches the version you target, e.g. ">=0.1.5-rc.1 <0.2.0-0"',
        );
      }

      // Everything else stays SILENT here, on purpose.
      //
      // Without an installed host there is no version to test against, and three attempts
      // at inferring one were wrong in three different ways: probing a range's own tuple
      // with "-rc.1" lands below a "^0.1.5-rc.2" lower bound; probing with the registry's
      // newest prerelease (0.1.6-alpha.2) lands above the range that deliberately stops
      // before it; probing stable-only packages flagged "^4.0.1" on cordis as broken.
      // Every one of those reported a correct manifest as defective.
      //
      // Run inside a dsh profile and the check above resolves the real version and makes
      // a concrete, verifiable claim instead. A linter that invents findings to look
      // thorough is worse than one that admits what it cannot see.
      continue;
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 无报告能证明什么，误报漏报与成本如何？

**研究主题**：缺陷与关键质疑、效果与总成本、采用判断

#### 完整回答

没有 finding 只能说明当前规则与可见环境未发现问题。patchNames 和 patchIdCount 是逐行正则，不解析完整 YAML 语义，复杂嵌套、别名或表达式不在等价于宿主组合执行的覆盖中；client bundle 也检查外形而非渲染。自写 semver 子集需要持续与真实包管理器对照，不能把有限作者用例扩展为通用兼容保证。package 的 dsh-tools peer 声明限制在0.2.0之前，当前较新宿主能否安装还需用户选定环境核对。成本单位是一轮真实阻断错误发现与修复。首次接入 CLI/CI、持续处理 warnings、失败时回原规则和真实宿主复核都占人工，金额耗时未知。适合将其作为额外提交前检查试用，不应让绿色结果替代代码审阅、打包检查和宿主验收。

#### 证据与依据

**依据 1 · 源码核查**：[lib/check.js:98-110](https://github.com/AphyTOT/dsh-plugin-preflight/blob/ae10f46bcf65258d61fe54d966e8bdcc0daf60f6/lib/check.js#L98-L110)

正则抽取名称与ID不等于完整 YAML 组合语义。

<details>
<summary>查看原文（13行）</summary>

```text
/** Collect a single `name:` value out of a target row in cordis.patch.yml. */
function patchNames(text) {
  // Match `name:` only, at the start of a line, tolerating a list marker, a sibling
  // `id:` line above, and a trailing comment. A non-greedy capture without the comment
  // group swallows the rest of the line and silently under-reports names.
  return [...text.matchAll(/^[ \t]*(?:-[ \t]+)?name:[ \t]*['"]?([^'"\r\n#]+?)['"]?[ \t]*(?:#.*)?$/gm)]
    .map((m) => m[1].trim())
    .filter((n) => n !== '');
}

/** Count `id:` rows, used to notice entries that were never given an id. */
function patchIdCount(text) {
  return [...text.matchAll(/^[ \t]*(?:-[ \t]+)?id:[ \t]*['"]?([^'"\r\n#]+?)['"]?[ \t]*(?:#.*)?$/gm)].length;
```

</details>

**依据 2 · 作者声明**：[README.md:111-128](https://github.com/AphyTOT/dsh-plugin-preflight/blob/ae10f46bcf65258d61fe54d966e8bdcc0daf60f6/README.md#L111-L128)

作者明确简化semver和平台矩阵未验证，不能升级证据。

<details>
<summary>查看原文（18行）</summary>

````text
- Nothing has been published to npm, so the registry path is untested end to end.
- The one-day repository-age bar and the `dsh-plugin` topic are unchecked by design.
- No Windows/macOS/Linux matrix; development happened on Windows only.
- `peer/prerelease-tuple` has only ever fired against fixtures. Every real plugin it has been pointed at
  either resolves correctly or is deliberately left alone.

## Install as a DSH plugin

```sh
dsh plugin --profile web add dsh-plugin-preflight
```

This adds one read-only, model-facing tool so an agent scaffolding a plugin can check its own work:

```
plugin_preflight(dir)
```

````

</details>

**依据 3 · 源码核查**：[package.json:49-52](https://github.com/AphyTOT/dsh-plugin-preflight/blob/ae10f46bcf65258d61fe54d966e8bdcc0daf60f6/package.json#L49-L52)

固定包的宿主 peer 范围须与实际版本匹配。

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-tools": ">=0.1.0-rc.1 <0.2.0-0 || >=0.1.5-rc.1 <0.2.0-0"
  }
```

#### 缺口

- 没有独立语义用例集与目标宿主版本匹配结果。
  **影响**：误报漏报率及新宿主安装性未知。
  **进一步探讨**：将复杂patch和semver边界与宿主解析、node-semver输出逐例对照。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 可否发布覆盖与环境证明？

**研究主题**：新假设与验证

#### 完整回答

可提出未验证的覆盖说明报告，将每组规则标为已检查、不适用或因缺宿主而未知，绑定实际读取清单版本，并以官方解析器的固定版本作差分参照。它从当前环境未知时静默推导，增量是帮助用户区分无错误与未检查，不强行新增错误。新增代价包括报告版本兼容、参照依赖维护和复杂规则的执行成本。最小验证对同一manifest在独立仓库和profile内运行，要求版本缺失明确、已知正确范围不误报、复杂patch差分能定位漏项；若未知提示引起大量无行动噪音或参照依赖阻碍离线使用，应收窄为可选诊断。未实现，不计入当前贡献。

#### 证据与依据

**依据 1 · 源码核查**：[lib/check.js:266-278](https://github.com/AphyTOT/dsh-plugin-preflight/blob/ae10f46bcf65258d61fe54d966e8bdcc0daf60f6/lib/check.js#L266-L278)

环境不明时静默为显式覆盖说明提供推导。

<details>
<summary>查看原文（13行）</summary>

```text
      // Everything else stays SILENT here, on purpose.
      //
      // Without an installed host there is no version to test against, and three attempts
      // at inferring one were wrong in three different ways: probing a range's own tuple
      // with "-rc.1" lands below a "^0.1.5-rc.2" lower bound; probing with the registry's
      // newest prerelease (0.1.6-alpha.2) lands above the range that deliberately stops
      // before it; probing stable-only packages flagged "^4.0.1" on cordis as broken.
      // Every one of those reported a correct manifest as defective.
      //
      // Run inside a dsh profile and the check above resolves the real version and makes
      // a concrete, verifiable claim instead. A linter that invents findings to look
      // thorough is worse than one that admits what it cannot see.
      continue;
```

</details>

#### 缺口

- 覆盖报告可用性与差分维护成本未测。
  **影响**：新方案价值未知。
  **进一步探讨**：先用少量真实插件和边界fixture评审提示是否可行动。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
