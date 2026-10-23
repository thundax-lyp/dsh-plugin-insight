# DSH Graphlint

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[4e810d8](https://github.com/AngelosZou/graphlint/tree/4e810d8ff8a380d419316be91ec03936de37393b/integrations/dsh)

<!-- BEGIN META -->
[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/AngelosZou/graphlint) [![npm 30d 1,244](https://img.shields.io/static/v1?label=npm+30d&message=1%2C244&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-graphlint) [![最新发布 2026-10-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-graphlint)
<!-- END META -->

> **实现功能**：为DSH提供graphlint依赖图查询、索引构建、配置工具和使用Skill。

> **核心亮点**：把graphlint CLI查询、建索引和入口规则配置接到DSH模型工具，增量在结果契约与后台任务接线。[Q03](#research-q03)

> **风险与缺陷**：静态图告警依赖入口建模，且PATH优先CLI未绑定版本；可解析告警不足以支持自动删除。[Q04](#research-q04)

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
  - [Q01 · 什么清理任务适合以依赖图辅助？](#detail-section-11)
  - [Q02 · 工具怎样从工作区调用CLI并处理结果？](#detail-section-12)
  - [Q03 · 贡献属于分析算法还是宿主接线？](#detail-section-13)
  - [Q04 · 最影响安全清理结论的是什么？](#detail-section-14)
  - [Q05 · 启动和持久化依赖怎样影响流程？](#detail-section-15)
  - [Q06 · 清理合格代码的总投入是什么？](#detail-section-16)
  - [Q07 · 哪些边界处理值得复用？](#detail-section-17)
  - [Q08 · 如何把告警转成更可靠的清理流程？](#detail-section-18)
  - [Q09 · 什么用户可控试用，什么情况应暂缓？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合AI生成代码后需要筛选死代码、未用导入和不可达组件的开发者。合格交付是经测试与人工核对的清理补丁，而不是告警清单本身。简单替代为终端graphlint query加人工复制结果；插件让Agent直接查图、重建索引和调整入口规则。不能根据告警自动删除框架回调或动态注册代码。

基线为同一CLI在终端运行并人工传递结果；不把CLI自身图算法算成适配新算法。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

|能力|主要用途|使用条件与边界|
|---|---|---|
|graphlint_query|检索死代码等告警和单图详情|需要CLI与入口规则，告警可能误报|
|graphlint_build|后台建立依赖索引|需轮询job，启动不等于完成|
|graphlint_config|读取或调整规则及排除项|会写项目配置，需核对权限|
|graphlint Skill|指导工具及CLI用法|指导不保证删除正确性|

#### 启动与依赖

|依赖或条件|是否必需|用途|缺失或不满足时|
|---|---|---|---|
|Node>=20、Cordis >=4.0.5-alpha.1 <5、dsh-tools >=0.1.0-rc.6 <0.3|启动必需|工具、job与timer|加载或操作失败|
|graphlint CLI|操作必需|实际依赖图分析|返回安装说明|
|正确入口规则与可写索引目录|效果必需|减少动态入口误报|结论可能不可靠|
|multi-folder|可选|辅助根目录|只允许主工作区|

#### 启动步骤

|步骤|执行者与动作|成功判据或失败处理|
|---|---|---|
|准备|用户固定CLI版本并加载重启|三工具可用|
|定位|模型确认root及配置|不误扫高层目录|
|查询|模型query或build后查看job|检查语义错误及遗漏|
|验收|用户核对动态入口并测试补丁|误报调规则，不自动删除|

#### 成本

|阶段|现金与资源成本|人工与时间投入|已知条件与未知项|
|---|---|---|---|
|首次使用|Python CLI和索引磁盘，金额未知|安装、重启及入口配置，耗时未知|初次索引依仓库大小|
|持续使用|增量索引和模型上下文，金额未知|逐项核对告警及测试，耗时未知|告警不等于可删除|
|失败恢复|重建索引，金额未知|调整规则及恢复代码，耗时未知|需要分支及回滚准备|

#### 效果

|效果项|当前证据支持|尚不能确定|
|---|---|---|
|可操作告警|结构化查询与详情信封|项目误报率|
|后台构建|job可跟踪和取消|大型仓库完成时间|
|清理收益|规则可调整|合格补丁率与总节时|

> **思考**：静态图告警依赖入口建模，且PATH优先CLI未绑定版本；可解析告警不足以支持自动删除。[Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把graphlint CLI查询、建索引和入口规则配置接到DSH模型工具，增量在结果契约与后台任务接线。[Q03](#research-q03)

把graphlint CLI查询、建索引和入口规则配置接到DSH模型工具，增量在结果契约与后台任务接线。[Q03](#research-q03)

可借鉴两种成功信封与exit-0语义错误的独立解析，避免把Graph不存在当正常空结果；后台启动失败会终止已产生子进程，避免无job持有的工作泄漏。root guard限制误扫高层目录但为词法路径检查，不是文件系统沙箱。类型引用宿主真实契约有助静态兼容检查，未执行构建不能声称当前编译成功。

<a id="detail-section-5"></a>

### 1.4 主要限制

静态图告警依赖入口建模，且PATH优先CLI未绑定版本；可解析告警不足以支持自动删除。[Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

已有graphlint使用经验且愿意逐项核对告警的开发者可先在分支试用。固定CLI版本、明确root与入口规则，再挑一个小模块查询，不自动删除动态入口；核对配置副作用、job取消及重新索引。不能把告警数量减少当业务交付，也不能把本插件推荐解释为其上游所有语言分析已通过验收。 [Q09](#research-q09)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码级确认宿主适配；未执行CLI、插件或清理任务，新设计假设未验证。

- 已检查：作者 README、包清单、源码路径 integrations/dsh/src/index.ts、integrations/dsh/src/tools/query.ts、integrations/dsh/src/tools/build.ts、integrations/dsh/src/tools/config.ts、integrations/dsh/src/root.ts、integrations/dsh/src/runner.ts、integrations/dsh/src/python.ts、integrations/dsh/src/parse.ts 及固定范围 inventory；组件：integrations/dsh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：组件限定integrations/dsh；检查root、CLI、query/config/build及解析，上游README仅用于明确算法边界，不将上游完整规模归插件。
- 下一步：固定CLI版本与入口规则，在静态/动态调用混合仓库核查误报、job取消、配置副作用与合格补丁成本。

**分析版本**

- **仓库**：[AngelosZou/graphlint](https://github.com/AngelosZou/graphlint)
- **版本号**：0.6.0（[固定提交 4e810d8](https://github.com/AngelosZou/graphlint/tree/4e810d8ff8a380d419316be91ec03936de37393b)）
- **版本日期**：2026-10-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是每个删除候选附带“入口假设、CLI版本、关联测试及反例”证据卡，人工确认后再清理，可降低动态引用误删而保留检索便利。推导自入口建模限制和可调规则工具。最小验证用静态函数与动态回调混合仓库，对比单看告警、证据卡和普通终端三组，计量错误删除、合格补丁率与总时间；若误删不降或复核负担超过收益，则否定该方案。 [Q08](#research-q08)

固定CLI版本与入口规则，在静态/动态调用混合仓库核查误报、job取消、配置副作用与合格补丁成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 145 | — | — | 915 |
| .mjs | source | 1 | 37 | 22 | 10 | — |
| .ts | source | 14 | 1367 | 964 | 316 | — |
| .ts | test | 8 | 975 | 813 | 59 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/AngelosZou/graphlint/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH graphlint适配能否把死代码候选变成可复核的清理任务，而不将静态告警误作删除证明？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 什么清理任务适合以依赖图辅助？

**研究主题**：场景与需求

#### 完整回答

适合AI生成代码后需要筛选死代码、未用导入和不可达组件的开发者。合格交付是经测试与人工核对的清理补丁，而不是告警清单本身。简单替代为终端graphlint query加人工复制结果；插件让Agent直接查图、重建索引和调整入口规则。不能根据告警自动删除框架回调或动态注册代码。

#### 证据与依据

**依据 1 · 作者声明**：[integrations/dsh/README.md:67-77](https://github.com/AngelosZou/graphlint/blob/4e810d8ff8a380d419316be91ec03936de37393b/integrations/dsh/README.md#L67-L77)

作者列工具用途。

<details>
<summary>查看原文（11行）</summary>

```text
## Tools

| Tool | Purpose |
|------|---------|
| `graphlint_query` | Query the dependency graph for dead code, unused imports, write-only variables, and other warnings. Fast incremental mode; JSON result. Common filters: `warn_types`, `graph_id`, `exclude_clean`, `include_tests`, `public_as_entry`. |
| `graphlint_build` | Full or incremental index rebuild as a **background job** (poll with `job_output`). |
| `graphlint_config` | `show` / `diff` / `get` / `set` entries in the project's `.graphlint/config.json`, plus `add-entry-rule` / `remove-entry-rule` / `add-exclude` / `remove-exclude` for custom entry rules and excludes. `diff` reports how the config differs from the shipped default rule template. |

The `graphlint` skill leads with these tools (they run inside the session working
directory and return structured results); the canonical CLI guidance follows as
reference.
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工具怎样从工作区调用CLI并处理结果？

**研究主题**：功能与机制

#### 完整回答

入口注册query/build/config及graphlint Skill；每次解析有效工作目录与可选辅助根目录，限制分析root后寻找PATH或venv中的CLI。query通过argv调用并解析列表与单图详情两种JSON信封；build启动子进程并挂接jobs，失败注册时终止已启动进程；config调用同一CLI修改.graphlint/config.json。插件自身不构建依赖图，核心分析由外部CLI完成。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh/src/tools/query.ts:65-94](https://github.com/AngelosZou/graphlint/blob/4e810d8ff8a380d419316be91ec03936de37393b/integrations/dsh/src/tools/query.ts#L65-L94)

root、CLI解析及JSON处理的主调用链。

<details>
<summary>查看原文（30行）</summary>

```text
      async execute(args, exec: ToolRunContext): Promise<Record<string, JsonValue>> {
        const sessionRoot = await resolveSessionCwd(exec, ctx.get?.bind(ctx))
        const extraRoots = await secondaryDirs(ctx, sessionRoot)
        let rootDir: string
        try {
          rootDir = guardAllowedRoot(args.root_dir, sessionRoot, extraRoots)
        } catch (err) {
          return { error: err instanceof Error ? err.message : String(err) }
        }
        const exe = await resolveGraphlint(ctx.subprocess, ctx.fs, rootDir)
        if (!exe) return { error: 'graphlint CLI not found. Install with: pip install graphlint' }
        const out = await runGraphlint(
          ctx.subprocess,
          ctx.timer,
          queryArgv(exe, {
            rootDir,
            warnTypes: args.warn_types,
            includeTests: args.include_tests,
            graphId: args.graph_id,
            publicAsEntry: args.public_as_entry,
            excludeClean: args.exclude_clean,
          }),
          rootDir,
          DEFAULT_LIMITS,
          exec.signal,
        )
        if (out.timedOut) {
          return { error: `graphlint query timed out after ${DEFAULT_LIMITS.doneCapMs}ms; the process tree was terminated.` }
        }
        return parseQueryOutput(out.stdout, out.stderr, out.exitCode)
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 贡献属于分析算法还是宿主接线？

**研究主题**：贡献与相对优势

#### 完整回答

本组件的增量是将CLI图分析变为结构化模型工具，并处理工作区、后台job所有权和不同JSON结果形状；它不是新死代码算法。相对终端复制更便于Agent持续清理，也暴露规则调整入口。静态图算法与多语言分析归同仓主项目，不能把整个monorepo的贡献和规模计入integrations/dsh插件。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh/src/index.ts:17-32](https://github.com/AngelosZou/graphlint/blob/4e810d8ff8a380d419316be91ec03936de37393b/integrations/dsh/src/index.ts#L17-L32)

组件明确调用外部实现而非内嵌分析器。

<details>
<summary>查看原文（16行）</summary>

```text
import type { PluginContext } from './types.js'
import { registerGraphlintSkill } from './skill.js'
import { registerQueryTool } from './tools/query.js'
import { registerBuildTool } from './tools/build.js'
import { registerConfigTool } from './tools/config.js'

export const name = 'dsh-graphlint'

export const inject = ['tools', 'subprocess', 'fs', 'skills', 'jobs', 'timer']

export function apply(ctx: PluginContext): void {
  registerGraphlintSkill(ctx)
  registerQueryTool(ctx)
  registerBuildTool(ctx)
  registerConfigTool(ctx)
}
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 最影响安全清理结论的是什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

入口与动态调用建模决定死代码告警真假。上游明确静态分析无法证明getattr、反射等动态引用，因此告警不能直接变成删除授权。此外本组件优先使用PATH中的graphlint，未探测或绑定版本；固定插件源码不代表实际CLI就是该提交的算法，JSON可解析也不代表结论可靠。需要同时记录CLI版本和项目入口规则。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:269-276](https://github.com/AngelosZou/graphlint/blob/4e810d8ff8a380d419316be91ec03936de37393b/README.md#L269-L276)

上游明确静态分析假阳性及入口配置边界。

```text
## Limitations

- **Static analysis only** — graphlint performs static analysis and cannot detect runtime linkage such as `getattr`, `importlib`, or dynamic dispatch patterns, which may result in false positives. This primarily affects Python; Rust's static dispatch model produces fewer false positives. **Mitigation:** add custom entry rules matching your codebase's conventions. For example, graphlint's own codebase uses `function_def:_detect_*` and `function_def:visit_*` patterns to prevent functions discovered via `getattr` from being flagged as dead.
- **Python dynamic imports** — due to Python's dynamic import mechanisms (`importlib`, `getattr`, metaclasses, etc.), the default entry templates may produce false positives in codebases that rely heavily on runtime dispatch. Users should tune the `entry_rules` configuration to match their project's conventions.
- **Rust macro expansion** — tree-sitter parses unexpanded source; procedural macros and `macro_rules!` bodies appear as opaque token trees. Some macro-generated call paths may be missed. `#[derive]` attributes are partially recognized via implicit `inherit` edges.
- **C# partial classes & reflection** — tree-sitter parses each `.cs` file independently; partial class fragments are merged into a single logical node via `part_of` edges, but members called only through reflection (`Activator.CreateInstance`, DI container registration) may be missed, similar to Python's dynamic import limitations.
- **C/C++ static analysis limits** — member calls resolve type-aware across translation units (via a project-wide class→method index), but there is **no virtual/overload/dynamic dispatch**: a call through a `Base*` pointer resolves statically to the base's method, so a derived override reached only that way may be reported dead. The preprocessor is treated as pure AST (`#if` is never evaluated, macros are not expanded); function-pointer indirect call targets are not traced; a `static` symbol in a header is per-TU. A pure-virtual (`= 0`) interface method is exempt from dead-code (dispatched by the vtable). C function parameters are not modelled as nodes, so a parameter named like a caller's local can resolve by flat name.
- **`--public-as-entry` scope** — this flag applies to languages with `public` visibility declarations (Rust `pub`, C# `public`). It has no effect on Python files. Toggling this flag triggers a full re-index. For long-term library analysis, prefer enabling the `rust_pub_api` entry rule via `graphlint config` to persist the setting.
```

#### 缺口

- 实际CLI版本、项目动态入口召回和误删率未知
  **影响**：不能宣称清理正确性或自动删除安全
  **进一步探讨**：以含动态回调的标注仓库核对告警，再记录实际CLI版本和规则配置

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动和持久化依赖怎样影响流程？

**研究主题**：依赖、兼容与流程

#### 完整回答

需要Node>=20、Cordis >=4.0.5-alpha.1 <5、dsh-tools >=0.1.0-rc.6 <0.3及DSH服务以及另装的graphlint Python CLI。查询可触发增量建索引，配置及索引持久化到分析root/.graphlint，所以查询并非对工作区绝对无写入。可选multi-folder扩展允许根目录。CLI缺失给安装提示，不会由插件自动安装。config与build代码未见显式会话sandboxPolicy变更门禁，采用前需在目标宿主核对可写边界。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh/src/tools/config.ts:72-106](https://github.com/AngelosZou/graphlint/blob/4e810d8ff8a380d419316be91ec03936de37393b/integrations/dsh/src/tools/config.ts#L72-L106)

配置调用含set操作，链路没有会话写模式检查。

<details>
<summary>查看原文（35行）</summary>

```text
      async execute(args, exec: ToolRunContext): Promise<Record<string, JsonValue>> {
        const requested = typeof args.action === 'string' ? args.action : 'show'
        const action: ConfigAction = (CONFIG_ACTIONS as readonly string[]).includes(requested)
          ? (requested as ConfigAction)
          : 'show'
        const sessionRoot = await resolveSessionCwd(exec, ctx.get?.bind(ctx))
        const extraRoots = await secondaryDirs(ctx, sessionRoot)
        let rootDir: string
        try {
          rootDir = guardAllowedRoot(args.root_dir, sessionRoot, extraRoots)
        } catch (err) {
          return { error: err instanceof Error ? err.message : String(err) }
        }
        const exe = await resolveGraphlint(ctx.subprocess, ctx.fs, rootDir)
        if (!exe) return { error: 'graphlint CLI not found. Install with: pip install graphlint' }
        const out = await runGraphlint(
          ctx.subprocess,
          ctx.timer,
          configArgv(exe, action, {
            key: args.key,
            value: args.value,
            ruleJson: args.rule_json,
            name: args.name,
            excludePattern: args.exclude_pattern,
          }),
          rootDir,
          LIMITS,
          exec.signal,
        )
        if (out.timedOut) return { error: `graphlint config timed out after ${LIMITS.doneCapMs}ms.` }
        return {
          ok: out.exitCode === 0,
          exit_code: out.exitCode,
          stdout: out.stdout.slice(0, 4000),
          stderr: out.stderr.slice(0, 1000),
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 清理合格代码的总投入是什么？

**研究主题**：效果与总成本

#### 完整回答

首次需安装CLI、加载并重启DSH，初次索引耗时受仓库规模影响；持续查询有增量重建、模型读告警和人工验证成本。删除候选仍需测试与回滚准备，恢复包括重建索引及纠正规则。query进程有120秒等待上限，build为可取消后台job，不能由启动工具15秒预算推断构建完成。没有相同清理任务的误报、节时及现金记录，不能估算ROI。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh/src/tools/build.ts:60-102](https://github.com/AngelosZou/graphlint/blob/4e810d8ff8a380d419316be91ec03936de37393b/integrations/dsh/src/tools/build.ts#L60-L102)

后台启动与实际构建完成分离。

<details>
<summary>查看原文（43行）</summary>

```text
      timeoutMs: 15_000,
      async execute(args, exec: ToolRunContext): Promise<Record<string, JsonValue>> {
        const sessionRoot = await resolveSessionCwd(exec, ctx.get?.bind(ctx))
        const extraRoots = await secondaryDirs(ctx, sessionRoot)
        let rootDir: string
        try {
          rootDir = guardAllowedRoot(args.root_dir, sessionRoot, extraRoots)
        } catch (err) {
          return { error: err instanceof Error ? err.message : String(err) }
        }
        const exe = await resolveGraphlint(ctx.subprocess, ctx.fs, rootDir)
        if (!exe) return { error: 'graphlint CLI not found. Install with: pip install graphlint' }
        const handle = ctx.subprocess.spawn({
          argv: buildArgv(exe, args.force === true),
          cwd: rootDir,
          stdio: {
            stdin: 'ignore',
            stdout: { maxBytes: 1_048_576 },
            stderr: { maxBytes: 262_144 },
          },
          graceMs: 15_000,
          signal: exec.signal,
          env: { PYTHONIOENCODING: 'utf-8' },
        })
        let jobId: string
        try {
          jobId = ctx.jobs.start({
            kind: 'graphlint-build',
            label: `graphlint build${args.force === true ? ' --force' : ''} in ${rootDir}`,
            outputLimitBytes: OUTPUT_LIMIT_BYTES,
            owner: sessionIdOf(exec),
            run: () => {
              let stdoutCursor = 0
              let stderrCursor = 0
              return {
                cancel: () => handle.terminate(),
                done: handle.done.then(
                  (outcome) =>
                    outcome.exitCode === 0
                      ? { status: 'completed' as const, detail: 'index build finished' }
                      : outcome.exitCode === null
                        ? { status: 'killed' as const, detail: 'process tree terminated' }
                        : { status: 'failed' as const, detail: `exit code: ${outcome.exitCode}` },
```

</details>

#### 缺口

- 缺少按仓库规模和动态语言分类的误报及人工复核耗时
  **影响**：无法证实清理效率超过终端流程
  **进一步探讨**：记录相同告警集的保留/删除判断、测试结果和端到端时间

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 哪些边界处理值得复用？

**研究主题**：工程质量与复用

#### 完整回答

可借鉴两种成功信封与exit-0语义错误的独立解析，避免把Graph不存在当正常空结果；后台启动失败会终止已产生子进程，避免无job持有的工作泄漏。root guard限制误扫高层目录但为词法路径检查，不是文件系统沙箱。类型引用宿主真实契约有助静态兼容检查，未执行构建不能声称当前编译成功。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh/src/parse.ts:123-165](https://github.com/AngelosZou/graphlint/blob/4e810d8ff8a380d419316be91ec03936de37393b/integrations/dsh/src/parse.ts#L123-L165)

空输出、JSON异常及语义error被区分。

<details>
<summary>查看原文（43行）</summary>

```text
export function parseQueryOutput(stdout: string, stderr: string, exitCode: number | null): QueryOutcome {
  if (stdout.trim().length === 0) {
    return {
      ok: false,
      error: `graphlint produced no output (exit ${exitCode})`,
      exitCode,
      stderrTail: stderr.slice(-800),
    }
  }
  let parsed: unknown
  try {
    parsed = JSON.parse(stdout)
  } catch {
    return {
      ok: false,
      error: `could not parse graphlint JSON output (exit ${exitCode})`,
      exitCode,
      stdoutTail: stdout.slice(-TAIL_LENGTH),
      stderrTail: stderr.slice(-TAIL_LENGTH),
    }
  }
  const record = parsed as {
    result?: unknown
    graph?: unknown
    status?: unknown
    message?: unknown
    query_time_ms?: unknown
    root_dir?: unknown
  }
  // The CLI reports a semantic failure (e.g. `Graph #999 not found`) as an
  // error envelope on an exit-0 run, so this must be checked BEFORE the success
  // shapes: otherwise the real reason is swallowed as an unknown shape.
  if (record.status === 'error') {
    const message =
      typeof record.message === 'string' && record.message.trim().length > 0
        ? record.message
        : 'graphlint reported an error'
    return {
      ok: false,
      error: message,
      exitCode,
      ...(stderr.trim().length > 0 ? { stderrTail: stderr.slice(-TAIL_LENGTH) } : {}),
    }
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 如何把告警转成更可靠的清理流程？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是每个删除候选附带“入口假设、CLI版本、关联测试及反例”证据卡，人工确认后再清理，可降低动态引用误删而保留检索便利。推导自入口建模限制和可调规则工具。最小验证用静态函数与动态回调混合仓库，对比单看告警、证据卡和普通终端三组，计量错误删除、合格补丁率与总时间；若误删不降或复核负担超过收益，则否定该方案。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh/src/tools/config.ts:37-59](https://github.com/AngelosZou/graphlint/blob/4e810d8ff8a380d419316be91ec03936de37393b/integrations/dsh/src/tools/config.ts#L37-L59)

入口规则可配置，为证据卡假设提供现有接口。

<details>
<summary>查看原文（23行）</summary>

```text
        action: {
          type: 'string',
          enum: CONFIG_ACTIONS,
          description:
            'show: display the full effective config; diff: how the config file differs from the shipped default rule ' +
            'template (which entry rules the user removed / added / overrode, template version gap); ' +
            'get: read one key; set: write one key/value pair; ' +
            'add-entry-rule: add a custom entry rule (needs rule_json); remove-entry-rule: remove a rule (needs name); ' +
            'add-exclude / remove-exclude: add or remove an exclude pattern (needs exclude_pattern).',
        },
        key: { type: 'string', description: 'Config key, required for get/set.' },
        value: {
          type: 'string',
          description: 'New value for set (pass lists/objects as compact JSON text).',
        },
        rule_json: {
          type: 'string',
          description:
            'JSON rule for add-entry-rule, e.g. {"name":"my_service","ast_pattern":"class_instantiation:FastAPI","file_pattern":"**/service.py"}.',
        },
        name: { type: 'string', description: 'Rule name for remove-entry-rule.' },
        exclude_pattern: { type: 'string', description: 'Pattern for add-exclude / remove-exclude.' },
        root_dir: { type: 'string', description: ROOT_DESCRIPTION },
```

</details>

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 什么用户可控试用，什么情况应暂缓？

**研究主题**：采用判断

#### 完整回答

已有graphlint使用经验且愿意逐项核对告警的开发者可先在分支试用。固定CLI版本、明确root与入口规则，再挑一个小模块查询，不自动删除动态入口；核对配置副作用、job取消及重新索引。不能把告警数量减少当业务交付，也不能把本插件推荐解释为其上游所有语言分析已通过验收。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh/src/python.ts:24-47](https://github.com/AngelosZou/graphlint/blob/4e810d8ff8a380d419316be91ec03936de37393b/integrations/dsh/src/python.ts#L24-L47)

CLI查找未绑定版本，试用须自行固定。

<details>
<summary>查看原文（24行）</summary>

```text
export async function resolveGraphlint(
  subprocess: Subprocess,
  fs: Fs | undefined,
  rootDir: string,
): Promise<string | null> {
  try {
    const exe = await subprocess.resolveExecutable('graphlint')
    if (exe) return exe
  } catch {
    /* PATH lookup failed; fall through to virtualenv probes */
  }
  const bins = process.platform === 'win32' ? WINDOWS_BINS : POSIX_BINS
  for (const rel of bins) {
    const candidate = join(rootDir, rel)
    try {
      const target = await fs?.resolve(candidate, { cwd: rootDir })
      if (target === undefined) continue
      const info = await fs?.stat(target)
      if (info) return candidate
    } catch {
      /* probe failed */
    }
  }
  return null
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
