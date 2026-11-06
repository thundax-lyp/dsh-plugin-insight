# DeepSeek Harness

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[fcc0ad4](https://github.com/deepseek-ai/deepseek-harness/tree/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159)

<!-- BEGIN META -->
[![GitHub ★ 273,708](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=273%2C708&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)
<!-- END META -->

> **功能**：基于 Cordis 插件架构的开源 Agent 宿主，可组合模型、工具、执行策略、会话与交互界面。

> **亮点**：将profile准入、作用域工具执行、审批/取消结果与会话耐久检查点组织为可扩展接缝，缺执行器/无审批渠道/flush失败都有真实拒绝路径，见 [Q02](#research-q02)至 [Q05](#research-q05)。

> **主要限制**：版本准入不是运行契约或权限验证；默认policy allow不等每动作人批，ABORTED不撤副作用，内存事件/工具结果不是外部效果与持久共同事务，见 [Q03](#research-q03)至 [Q05](#research-q05)。

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
  - [Q01 · 根仓是插件还是宿主基础设施，为谁改变什么？](#detail-section-11)
  - [Q02 · profile和版本准入如何形成实际配置，是否等于运行兼容？](#detail-section-12)
  - [Q03 · 模型工具调用怎样执行并回到Agent，作用域代表什么？](#detail-section-13)
  - [Q04 · 审批、守卫和取消真实限制哪些动作？](#detail-section-14)
  - [Q05 · 会话日志什么时候算持久，写失败是否还会执行？](#detail-section-15)
  - [Q06 · 什么具体用法值得先试，完整负担与退路是什么？](#detail-section-16)
  - [Q07 · 可借鉴的生产方向是什么，哪些条件会推翻？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要组装模型/工具/交互面的开发者，用一个脱敏只读任务核接线与故障，而非将宿主当第三方插件安装，见 [Q01](#research-q01)。

自写SDK Agent循环/工具UI和既有宿主。根项目提供可组合接缝，Cordis和各执行能力来自上游/子包；没有同任务维护成本对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
| --- | --- | --- |
| profile | bundle/用户层组合 | skipped需查，semver非运行保证 |
| Agent循环 | 模型到工具与后续步骤 | completed非业务验收 |
| native执行 | policy/ask/guard/body/result | 非全部executor/OS隔离 |
| approval | once决定与审计 | 真实answerer身份本轮未全审 |
| 会话持久 | buffer到sync/检查点 | 条件接线、外部效果非共同事务 |

**流程与依赖**

#### 依赖

| 条件 | 用途 | 缺失/边界 |
| --- | --- | --- |
| Node>=24.9 / 成品 | Host启动 | private根非发布CLI |
| Cordis/profile/bundle | 配置与服务作用域 | skipped不等全部加载 |
| 模型/凭据 | 推理与usage | 可用/费用未验 |
| 选中executor/工具/实际sandbox | 执行动作 | scope非OS隔离 |
| 策略/approval answerer | 产生ask与处理决定 | 默认allow非强制人批 |
| JSONL writer/checkpoint | 耐久边界 | 任意profile不能套base保证 |

#### 步骤

| 步骤 | 操作 | 判据/退路 |
| --- | --- | --- |
| 准备 | 脱敏独立profile/环境/备份 | 固定版本和一个只读工具 |
| 配置 | 查skipped与actual executor | range通过仍核服务 |
| 一任务 | 读小文件给可核答案 | 查Host callId/结果 |
| 审批 | ask无渠道/never拒绝 | 不靠模型confirmed |
| 持久 | flush并重启读取 | 无writer false需识别 |
| 退出 | 停工作/存日志/撤权限 | 回已知profile/SDK |

**效果与成本**

#### 成本

| 阶段 | 现金/资源 | 人工时间 | 边界 |
| --- | --- | --- | --- |
| 首次 | Node/成品/模型/隔离环境 | profile/权限/备份/接线 | 未测工时/费用 |
| 持续 | 模型/工具/会话磁盘 | 插件升级/策略/任务复核 | 不因可组合推节时 |
| 失败 | 重试/部分外部影响 | 日志与实际目标核对 | 无通用回滚/幂等 |
| 退出 | 日志/附件/后台状态 | 停工作/撤凭据/清理 | 取消不等撤销 |

#### 效果

| 项目 | 当前支持 | 未确认 |
| --- | --- | --- |
| 组合 | profile patch/版本声明 | 实际插件互换工时 |
| 执行 | native策略/审批/guard/body | 全部工具/部署安全 |
| 持久 | JSONL追加sync与checkpoint | 全迁移/断电/外部exactly-once |
| 开发收益 | 可复用接缝 | 同任务错误/维护成本降低 |

> **思考**：版本准入不是运行契约或权限验证；默认policy allow不等每动作人批，ABORTED不撤副作用，内存事件/工具结果不是外部效果与持久共同事务，见 [Q03](#research-q03)至 [Q05](#research-q05)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将profile准入、作用域工具执行、审批/取消结果与会话耐久检查点组织为可扩展接缝，缺执行器/无审批渠道/flush失败都有真实拒绝路径，见 [Q02](#research-q02)至 [Q05](#research-q05)。

native执行/真实approval与持久失败接线具体，scope和事件等接缝可扩展；必须限定base/特定executor/checkpoint条件，不能拿接口/实验状态代全部署验收，见 [Q02](#research-q02)至 [Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

版本准入不是运行契约或权限验证；默认policy allow不等每动作人批，ABORTED不撤副作用，内存事件/工具结果不是外部效果与持久共同事务，见 [Q03](#research-q03)至 [Q05](#research-q05)。

<a id="detail-section-6"></a>

### 1.5 使用建议

开发者在独立脱敏profile只接一个已审只读工具，核答案/审批拒绝/flush重启；任何未预期副作用或状态不一致就停并回已知配置，见 [Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

根private monorepo为基础设施，0.2.2-rc.1。已定向核profile/兼容、base native工具dispatch与approval服务、Session内存到JSONL实际append/fsync和checkpoint；未运行或全审12168文件、全部工具/PTC/远程/桌面/Web鉴权/沙箱/迁移。

- 已检查：作者 README、包清单、源码路径 README.zh.md、SAFETY.md、package.json、packages/boot/app-boot/src/plugin-compatibility.ts、packages/boot/app-boot/src/profile.ts、packages/bundle/base/cordis.patch.yml、packages/core/agent-loop/src/agent.ts、packages/core/session/src/index.ts、packages/core/tool-executor-native/src/index.ts、packages/core/tools/src/index.ts、packages/core/tools/src/pipeline.ts、packages/interaction/user-approval/src/index.ts、packages/session/session-checkpoint-policy/src/index.ts、packages/session/session-persistence-jsonl/src/index.ts、packages/session/session-persistence-jsonl/src/storage.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：root/README/SAFETY；profile加载/兼容；base tools/native/checkpoint/JSONL行；Agent最终消息和tool batch；scoped executor/pipeline snapshot/policy/guard/body/cancel；approval服务asked/decided/never/answerer；Session commit/flush、JSONL live buffer/contiguous/append fsync与rollback。未执行，未全审所有工具体/PTC/远程/沙箱/真实答复UI/多平台generation迁移/全部宿主入口。
- 下一步：- 下一步单脱敏文件/只读工具核实际callId、答案、approval拒绝与重启日志。
- 固定四类接缝故障，核下游是否真实未执行及已发生影响。
- 没有运行Host/工具/模型或测试，不把仓内测试声明当本轮结果。

**分析版本**

- **仓库**：[deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)
- **版本号**：0.2.2-rc.1（[固定提交 fcc0ad4](https://github.com/deepseek-ai/deepseek-harness/tree/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

升级时增加scope卸载/ask无渠道/已执行取消/落盘失败四接缝样本，与仅semver比较真实检出和维护负担；无净收益就放弃，见 [Q07](#research-q07)。

- 下一步单脱敏文件/只读工具核实际callId、答案、approval拒绝与重启日志。
- 固定四类接缝故障，核下游是否真实未执行及已发生影响。
- 没有运行Host/工具/模型或测试，不把仓内测试声明当本轮结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4713 | 454537 | — | — | 6684587 |
| .mjs | source | 126 | 10209 | 7993 | 1640 | — |
| .mjs | test | 16 | 3614 | 3403 | 101 | — |
| .ts | source | 3083 | 544819 | 390873 | 121490 | — |
| .ts | test | 2811 | 749139 | 657686 | 38231 | — |
| .mjs | example | 68 | 4695 | 4171 | 324 | — |
| .ts | example | 119 | 5718 | 4658 | 595 | — |
| .md | test | 323 | 7259 | — | — | 62714 |
| .js | source | 10 | 349 | 326 | 20 | — |
| .tsx | source | 438 | 71254 | 56214 | 11608 | — |
| .cjs | example | 3 | 32 | 30 | 2 | — |
| .tsx | test | 404 | 131717 | 116257 | 6120 | — |
| .md | example | 18 | 397 | — | — | 3644 |
| .js | example | 26 | 504 | 439 | 50 | — |
| .js | test | 5 | 977 | 851 | 44 | — |
| .cjs | source | 5 | 129 | 76 | 37 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/deepseek-ai/deepseek-harness/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：定向核profile组合、native工具执行/审批/取消和JSONL会话持久检查点代表闭环，限定未审全仓与部署。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根仓是插件还是宿主基础设施，为谁改变什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根包@deepseek-ai/dsh-root为private monorepo，0.2.2-rc.1、Node>=24.9.0、pnpm11.28.5；这是Agent宿主/框架基础设施，不是可单独安装的第三方插件。README给出npx @deepseek-ai/dsh web和源码构建两种渠道，不能把private根包当发布CLI。面向需要组装模型、工具、交互与执行策略的开发者，参照自行用SDK写Agent循环和逐工具接UI，本项将这些接缝做成Cordis插件/作用域服务与profile组合；Cordis架构为上游依赖，不能归成本仓独创。

作者明确开发者预览、兼容破坏预期；SAFETY明示未安全审计、可能执行模型代码/命令、接触被授予的凭据/文件/网络。插件化不等所有部署隔离安全，也不等已验证生产收益。本轮只定向代表执行/会话持久闭环，不把monorepo每个插件/桌面/Web/远程/sandbox全部审过。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-18](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/package.json#L1-L18)

private根包/版本/Node与workspace。

<details>
<summary>查看原文（18行）</summary>

```text
{
  "name": "@deepseek-ai/dsh-root",
  "version": "0.2.2-rc.1",
  "license": "MIT",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@11.28.5",
  "engines": {
    "node": ">=24.9.0"
  },
  "workspaces": [
    "vendor/*",
    "packages/*/*",
    "native/system",
    "native/system/packages/*",
    "apps/*",
    "website"
  ],
```

</details>

**依据 2 · 作者声明**：[README.zh.md:5-14](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/README.zh.md#L5-L14)

作者宿主定位、Cordis及开发预览。

<details>
<summary>查看原文（10行）</summary>

```text
DeepSeek Harness（`dsh`）是由 [DeepSeek AI](https://deepseek.com) 开发的开源 agent harness（智能体框架）。

它构建于**一切皆插件**的架构之上，由 [Cordis](https://github.com/cordiverse/cordis) 驱动，其设计参见论文 [_A Programming Paradigm for Spatiotemporal Composability_](https://arxiv.org/abs/2608.25512)。

文档：[https://deepseek-harness.github.io/deepseek-harness/](https://deepseek-harness.github.io/deepseek-harness/)

## 开发者预览

DeepSeek Harness 处于 _开发者预览_ 阶段，正在快速迭代。**未来将出现破坏兼容性的变更。**

```

</details>

**依据 3 · 作者声明**：[README.zh.md:20-45](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/README.zh.md#L20-L45)

发布CLI与源码构建渠道。

<details>
<summary>查看原文（26行）</summary>

````text

### 通过 `npm` 运行

安装 `Node.js`，然后运行：

```sh
npx @deepseek-ai/dsh web
```

该命令默认会在 `http://127.0.0.1:3080` 启动 Web UI，本机启动时还会用默认浏览器打开页面。通过 SSH 启动时只打印宿主机 URL，因为本地转发地址由 SSH 客户端或编辑器持有。传入 `--no-open` 可仅运行服务器而不打开浏览器。详见 [Web UI 指南](docs/user/guide/index.zh.md)。

<a id="run-from-source"></a>

### 从源码运行

如需从仓库源码运行：

```sh
git clone https://github.com/deepseek-ai/deepseek-harness.git
cd deepseek-harness
pnpm install
pnpm run build
pnpm dsh web
```

`pnpm run build` 会准备仓库产物。`pnpm dsh web` 会直接使用这些已构建产物，不会重新构建。
````

</details>

**依据 4 · 作者声明**：[SAFETY.md:5-17](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/SAFETY.md#L5-L17)

作者明确预览、安全审计与权限边界。

<details>
<summary>查看原文（13行）</summary>

```text
## Experimental status

DeepSeek Harness is experimental developer-preview software. It has not undergone a security audit and must not be treated as secure or production-ready.

The project can execute model-generated code and commands, load third-party plugins, and access the network, processes, credentials, and files made available to it. Incorrect model output, defects, misconfiguration, malicious input, or untrusted plugins may damage the host computer, modify or delete files, disclose data or credentials, or cause other unintended effects.

## Sandbox limitations

Sandboxing, approval prompts, and permission controls can reduce risk, but they do not guarantee isolation or prevent damage. Even correctly enforced restrictions cannot protect resources that the project is allowed to access.

Do not rely on DeepSeek Harness as the sole security control for untrusted workloads.

## Responsible use
```

</details>

#### 缺口

- 无与现有SDK同条件接入/维护/业务结果对照，未审全部入口与部署。
  **影响**：可判断基础设施接缝，不能凭全插件架构承诺生产收益。
  **进一步探讨**：固定一个已有SDK小任务，比较接入一个工具和交互面的代码/维护/故障恢复，而非比较包数。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · profile和版本准入如何形成实际配置，是否等于运行兼容？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

loadProfile按manifest.dsh.profile.bundles顺序解析包，要求dsh.bundle声明，校平台/兼容后加载各patch，失败记录skippedBundles而不改manifest；用户层patch最后独立读取，错误不等同跳过整个用户配置。composeEntries对空树应用克隆后的所有patch层，顺序影响实际组合，不能把目录列表当全部已挂载。

兼容检查只读manifest：自有engines.dsh存在时单独决定，忽略dsh peers；否则逐@deepseek-ai/dsh或dsh-* peer校semver，includePrerelease，workspace三种简写映射当前版本。精确name@version→runtime豁免允许带风险继续，但不是调用级权限或运行API验收。能满足range不证明slots/服务/取消/存储契约没变；跳过某bundle的profile仍可能启动而缺功能，必须查skippedBundles和实际服务。

base bundle实际挂tools/native executor（PTC disabled）与session-checkpoint-policy和JSONL持久后端，为后续代表链提供接线；其他profile可覆盖或不选这些行，不给所有部署同一保证。

#### 证据与依据

**依据 1 · 源码核查**：[packages/boot/app-boot/src/profile.ts:680-712](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/packages/boot/app-boot/src/profile.ts#L680-L712)

实际bundle准入、错误记录与用户层。

<details>
<summary>查看原文（33行）</summary>

```text
  dir: string,
  installAnchor: string,
  options: { userLayer?: boolean } = {},
): Profile {
  const manifest = dropRetiredBundles(dir, readProfileManifest(binName, dir))
  const bundles = manifest.dsh?.profile?.bundles ?? []
  const layers: ProfileLayer[] = []
  const skippedBundles: SkippedBundle[] = []
  const exemptions = bundles.length === 0 ? {} : readProfileVersionExemptions(dir)
  for (const packageName of bundles) {
    try {
      const packageDir = resolveBundleDir(binName, packageName, installAnchor, dir)
      const bundleManifest = readProfileManifest(binName, packageDir)
      const bundle = bundleManifest.dsh?.bundle
      if (bundle === undefined) {
        throw new Error(`${binName}: profile bundle ${JSON.stringify(packageName)} declares no dsh.bundle in its package.json`)
      }
      assertBundlePlatform(bundle.platforms, process.platform)
      // A bundle is not a plugin row, so row admission never reads its own dsh requirements.
      const issue = evaluatePluginCompatibility(bundleManifest, exemptions)
      if (issue !== undefined && !issue.exempted) throw new Error(pluginCompatibilityWarning(issue))
      const patchPaths = bundlePatchPaths(packageDir, bundle)
      const patches = patchPaths.flatMap(patchPath => loadOverlayPatches(binName, patchPath))
      layers.push({ packageName, packageDir, patchPaths, patches })
    } catch (error) {
      skippedBundles.push({ packageName, reason: String(error) })
    }
  }
  const patchPath = join(dir, PROFILE_PATCH_FILENAME)
  const patches = options.userLayer !== false && existsSync(patchPath)
    ? loadOverlayPatches(binName, patchPath)
    : []
  return { name: basename(dir), dir, layers, patchPath, patches, skippedBundles }
```

</details>

**依据 2 · 源码核查**：[packages/boot/app-boot/src/profile.ts:755-762](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/packages/boot/app-boot/src/profile.ts#L755-L762)

有序patch应用到空配置树。

```text
export function composeEntries(
  layers: readonly PatchOptions[][], warn: (message: string) => void = () => {},
): EntryOptions[] {
  return applyEntryPatches([], structuredClone(layers.flat()), (message: string, ...args: unknown[]) => {
    let index = 0
    warn(message.replace(/%C/g, () => JSON.stringify(args[index++])))
  })
}
```

**依据 3 · 源码核查**：[packages/boot/app-boot/src/plugin-compatibility.ts:49-76](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/packages/boot/app-boot/src/plugin-compatibility.ts#L49-L76)

engines优先、peer与workspace规则。

<details>
<summary>查看原文（28行）</summary>

```text
}

function satisfies(runtimeVersion: string, range: string): boolean {
  return range.trim() !== '' && semver.satisfies(runtimeVersion, range, { includePrerelease: true })
}

function unmetRequirements(fields: Record<string, unknown>, runtimeVersion: string): Record<string, string> {
  const engines = Object.hasOwn(fields, 'engines') ? objectOf(fields.engines, 'Plugin manifest engines') : {}
  if (Object.hasOwn(engines, 'dsh')) {
    const range = engines.dsh
    if (typeof range !== 'string') throw new Error('Plugin manifest engines.dsh must be a string')
    return satisfies(runtimeVersion, range) ? {} : { 'engines.dsh': range }
  }
  if (!Object.hasOwn(fields, 'peerDependencies')) return {}
  const dependencies = objectOf(fields.peerDependencies, 'Plugin manifest peerDependencies')
  const unmet: Record<string, string> = {}
  for (const [name, range] of Object.entries(dependencies)) {
    if (typeof range !== 'string') {
      throw new Error(`Plugin manifest peerDependencies[${JSON.stringify(name)}] must be a string`)
    }
    if (name !== '@deepseek-ai/dsh' && !name.startsWith('@deepseek-ai/dsh-')) continue
    const requirement = ['workspace:^', 'workspace:~', 'workspace:*'].includes(range) ? runtimeVersion : range
    if (!satisfies(runtimeVersion, requirement)) unmet[name] = range
  }
  return unmet
}

/**
```

</details>

**依据 4 · 源码核查**：[packages/boot/app-boot/src/plugin-compatibility.ts:89-106](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/packages/boot/app-boot/src/plugin-compatibility.ts#L89-L106)

精确豁免判定。

<details>
<summary>查看原文（18行）</summary>

```text
  exemptions: Readonly<Record<string, readonly string[]>> = {},
  runtimeVersion = getDshRuntimeVersion(),
): PluginCompatibility | undefined {
  runtimeVersionOf(runtimeVersion)
  const fields = objectOf(manifest, 'Plugin manifest')
  const requirements = unmetRequirements(fields, runtimeVersion)
  if (Object.keys(requirements).length === 0) return undefined
  const name = identityField(fields, 'name')
  const version = identityField(fields, 'version')
  const key = `${name}@${version}`
  const exemptedVersions = Object.hasOwn(exemptions, key) ? exemptions[key] : undefined
  const exempted = exemptedVersions?.includes(runtimeVersion) === true
  return { name, version, runtimeVersion, requirements, exempted }
}

/**
 * Describe unmet requirements, their risk, and the exact-version remedy.
 * Surfaces with their own grant mechanism or locale render the structured result themselves.
```

</details>

**依据 5 · 源码核查**：[packages/bundle/base/cordis.patch.yml:134-142](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/packages/bundle/base/cordis.patch.yml#L134-L142)

base JSONL后端行。

```text
    # document.
    - id: llm-pi-ai
      name: '@deepseek-ai/dsh-llm-pi-ai'

    - id: session-persistence-jsonl
      name: '@deepseek-ai/dsh-session-persistence-jsonl'
      config:
        root: !!js dshHomePath('sessions')

```

**依据 6 · 源码核查**：[packages/bundle/base/cordis.patch.yml:427-430](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/packages/bundle/base/cordis.patch.yml#L427-L430)

base checkpoint policy实际挂载。

```text
    # Durability checkpoints before each model request and top-level dispatch.
    - id: session-checkpoint-policy
      name: '@deepseek-ai/dsh-session-checkpoint-policy'

```

**依据 7 · 源码核查**：[packages/bundle/base/cordis.patch.yml:510-521](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/packages/bundle/base/cordis.patch.yml#L510-L521)

base tools/native及disabled PTC。

<details>
<summary>查看原文（12行）</summary>

```text
    # Shared tool definitions and the deployment’s native executor.
    - id: tools
      name: '@deepseek-ai/dsh-tools'

    - id: tool-executor-native
      name: '@deepseek-ai/dsh-tool-executor-native'

    - id: tool-executor-ptc
      name: '@deepseek-ai/dsh-tool-executor-ptc'
      disabled: true

    # The deployment persona is a deployment choice; plan-mode and tool plugins own
```

</details>

#### 缺口

- 未审全部profile模板/加载器解析/每个平台与豁免管理UI。
  **影响**：本文只核base与代表准入链，版本通过不能代表真实插件可用。
  **进一步探讨**：在独立profile核正常/不兼容/豁免/缺依赖四样本，逐一查生效配置、skippedBundles和工具实际存在。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 模型工具调用怎样执行并回到Agent，作用域代表什么？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

Agent先把最终assistant/message（含tool-call与usage）append入会话；无tool-call才completed，否则tools.execute拿当前Agent、signal、turn/step、toolSet和并发限制。附加上下文进next-step inbox；批失败保留partial附加上下文再抛cause，不能把抛错理解成所有工具没做。concluded可结束轮次，completed只是Agent循环终态，不是外部业务验收。

tools.execute选择nearest scope provider，找不到/已卸载的选中executor抛ToolExecutorUnavailableError，不悄悄回退别的执行器；NativeToolExecutor实际构造共享pipeline并调用executeToolBatch。pipeline先snapshotJsonValue并deepFreeze参数，保留Host execution token/callId/rootCallId/agent/toolSet，不直接用模型自己声称的会话归属。dispatch按agent/toolSet再次resolve工具，调用真正tool.execute并规范返回/异常；并非只注册schema或把函数名输出。

作用域是宿主内能力/继承选择，非OS沙箱或多用户身份隔离。本轮没有逐个工具执行体/远程适配器审计，不能从native dispatcher推出shell/文件/HTTP副作用都安全或有幂等。同样工具schema可由其他executor表现不同，需针对实际profile核。

#### 证据与依据

**依据 1 · 源码核查**：[packages/core/agent-loop/src/agent.ts:570-609](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/packages/core/agent-loop/src/agent.ts#L570-L609)

最终消息入日志、工具批执行/附加上下文/partial失败。

<details>
<summary>查看原文（40行）</summary>

```text
            model: request.model,
            ...live.replayState !== undefined ? { replayState: live.replayState } : {},
          },
        })
        live.settle(
          'assistant/message',
          () => this.session.append('assistant/message', {
            turn,
            step,
            message,
            ...live.usage === undefined ? {} : { usage: live.usage },
            stream: live.stream,
          }, { surfaceOp: 'append' }).seq,
        )
        if (finish.kind === 'max-tokens') return { kind: 'max-tokens' }

        const toolCalls = message.content.filter(block => block.type === 'tool-call')
        if (toolCalls.length === 0) return { kind: 'completed' }
        const maxParallelToolCalls = this.loopCtx.agentLoop.config.maxParallelToolCalls.get()
        try {
          const result = await this.loopCtx.tools.execute({
            calls: toolCalls, signal, agent: this, log: { turn, step },
            maxParallelToolCalls, toolSet: decision.toolSet,
          })
          for (const context of result.additionalContexts) {
            this.inbox.splice('next-step', this.inbox.nextStep.length, 0, [context])
          }
          return result.concluded ? { kind: 'completed' } : null
        } catch (error: unknown) {
          if (!(error instanceof ToolBatchExecutionError)) throw error
          for (const context of error.partial.additionalContexts) {
            this.inbox.splice('next-step', this.inbox.nextStep.length, 0, [context])
          }
          throw error.cause
        }
      } catch (error: unknown) {
        if (!live.ended) live.abandon()
        throw error
      }
    }
```

</details>

**依据 2 · 源码核查**：[packages/core/tools/src/index.ts:353-377](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/packages/core/tools/src/index.ts#L353-L377)

实际作用域选择/缺执行器拒绝。

<details>
<summary>查看原文（25行）</summary>

```text
   * Resolve the nearest scoped provider, or the deployment default.
   * @param scope - Agent or preset scope; omitted selects only the root contribution.
   * @returns the selected executor; throws when it is missing or unloaded.
   */
  private selectExecutor(scope?: ScopeKey): ToolExecutor {
    let record: Registration | undefined
    for (const key of scopeChainOf(scope)) {
      record = this.scoped.get(key)
      if (record !== undefined) break
    }
    record ??= this.root
    const executor = record?.executor
    if (executor === undefined) throw new ToolExecutorUnavailableError()
    return executor
  }

  /**
   * Delegate a raw call batch to its Agent's provider or the deployment default.
   * Select at dispatch; accepted batches settle through that provider even if it unloads.
   * @param input - original calls, optional owning Agent, and optional logging step.
   * @returns the selected executor's settled batch; unavailable selections reject.
   */
  async execute(input: ToolBatchInput): Promise<ToolBatchResult> {
    return this.selectExecutor(input.agent).execute(input)
  }
```

</details>

**依据 3 · 源码核查**：[packages/core/tool-executor-native/src/index.ts:8-35](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/packages/core/tool-executor-native/src/index.ts#L8-L35)

真实pipeline/executeToolBatch接线和挂载。

<details>
<summary>查看原文（28行）</summary>

```text
export class NativeToolExecutor implements ToolExecutor {
  private readonly pipeline: ToolExecutionPipeline

  constructor(ctx: Context, private readonly maxParallel: () => number = () => 10) {
    this.pipeline = new ToolExecutionPipeline(ctx)
  }

  describe(tools: readonly ToolDefinition[]): ToolModelInput {
    return { schemas: tools.map(definition => projectToolSchema(definition, false)) }
  }

  execute(input: ToolBatchInput): Promise<ToolBatchResult> {
    return executeToolBatch(input, this.pipeline, this.maxParallel)
  }
}

/** Cordis plugin name. */
export const name = 'native-tool-executor'
/** Tool registration and scoped dispatch. */
export const inject = ['tools']

/**
 * Select native execution in the mounting scope.
 * @param ctx - context owning this executor's selection and lifetime.
 */
export function apply(ctx: Context): void {
  ctx.tools.setExecutor(new NativeToolExecutor(ctx))
}
```

</details>

**依据 4 · 源码核查**：[packages/core/tools/src/pipeline.ts:116-164](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/packages/core/tools/src/pipeline.ts#L116-L164)

Host执行对象、参数快照冻结与取消状态。

<details>
<summary>查看原文（49行）</summary>

```text
  private createExecution(exec: ToolExecutionInput): ScheduledToolPreparation | { kind: 'ready'; exec: MutableToolRunContext } {
    const deferredContexts: UserMessage[] = []
    const token = createExecutionToken()
    const callId = exec.callId
    const rootCallId = exec.rootCallId ?? callId
    const name = exec.name
    const agent = exec.agent
    const parent = exec.parent
    const signal = exec.signal
    // Executor refusals precede extensible policy; unknown tools retain dispatch-stage handling.
    const visible = this.get(name, agent, exec.toolSet)
    const rejection = visible === undefined ? undefined : this.source.reject?.(name, parent !== undefined)
    const rejected = rejection !== undefined
    const concludingExecutions = this.concludingExecutions
    const base = {
      token,
      callId,
      rootCallId,
      name,
      signal,
      ...agent !== undefined ? { agent } : {},
      ...exec.toolSet !== undefined ? { toolSet: exec.toolSet } : {},
      ...parent !== undefined ? { parent } : {},
      ...exec.schema !== undefined ? { schema: exec.schema } : {},
      deferContext(context: UserMessage): void {
        deferredContexts.push(context)
      },
      concludeTurn(this: ToolExecution): void {
        concludingExecutions.add(this)
      },
    }
    // Capture callbacks before argument getters run; rejected calls retain finalization only when aborted.
    const capturedFinalizer = visible?.finalizeContent?.bind(visible)
    const capturedProjector = visible?.projectContent?.bind(visible)
    const finalizerFor = (): ToolDefinition['finalizeContent'] | undefined =>
      rejected && !signal.aborted ? undefined : capturedFinalizer
    try {
      const detached = snapshotJsonValue(exec.arguments)
      if (detached === undefined) {
        throw new TypeError('tool execution arguments must be losslessly JSON-serializable')
      }
      const execution: MutableToolRunContext = { ...base, arguments: deepFreeze(detached) }
      this.deferredContexts.set(execution, deferredContexts)
      this.contentFinalizers.set(execution, finalizerFor())
      if (!rejected) this.contentProjectors.set(execution, capturedProjector)
      this.cancellationStates.set(execution, {
        callerSignal: signal,
        bodyInvoked: false,
      })
```

</details>

**依据 5 · 源码核查**：[packages/core/tools/src/pipeline.ts:258-285](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/packages/core/tools/src/pipeline.ts#L258-L285)

resolve后真正执行tool.execute与返回/异常。

<details>
<summary>查看原文（28行）</summary>

```text
  private async dispatchToolBody(exec: MutableToolRunContext): Promise<ToolExecutionResult> {
    const state = this.cancellationStates.get(exec)
    /* v8 ignore next -- only registry-minted executions reach the staged scheduler methods */
    if (state === undefined) throw new Error('tool registry scheduler invariant violated: missing cancellation state')
    const wrapperSignal = exec.signal
    const fused = fuseToolSignals(state.callerSignal, wrapperSignal)
    const signal = fused.signal

    if (isAborted(signal)) {
      fused.dispose()
      return toolAbortedBeforeDispatchResult()
    }
    exec.signal = signal
    try {
      const tool = this.resolveExecution(exec.name, exec.agent, exec.parent !== undefined, exec.toolSet)
      if (!tool) throw new ToolNotFoundError(exec.name)
      state.bodyInvoked = true
      const returned = await tool.execute(exec.arguments, exec)
      const result = this.createSuccessResult(exec, tool, returned)
      return isAborted(signal)
        ? toolAbortedResult(result)
        : result
    } catch (error: unknown) {
      return toolErrorResult(error)
    } finally {
      fused.dispose()
      exec.signal = wrapperSignal
    }
```

</details>

#### 缺口

- 未验全部工具体、远程/PTC executor、并发调度所有分支和OS隔离。
  **影响**：代表native链可追，但不能外推全目录工具已安全验收或业务exactly-once。
  **进一步探讨**：只选独立临时目录里的一个已审只读工具，核模型→Host callId→实际结果/日志，再分别试scope缺executor和partial失败。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 审批、守卫和取消真实限制哪些动作？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

pipeline顺序是pre-execute waterfall（默认allow），ask才进approval.request，allow后再checkGuards，取消/拒绝均不进入工具体；所以不是所有调用都必须人工批准，实际策略插件必须真的产生ask/deny。guards按global及继承scope顺序首个拒绝生效。ask无approval服务、无Agent或无可用answerer均拒绝；不是把模型参数confirmed=true当批准。

approval服务要求当前open turn，为本次随机request id写asked/decided审计事件；never策略在派发answerer前直接rejected。ask经scope waterfall，异常/非枚举答复归unavailable，signal取消先赢则后到答案丢弃；只allowed-once成为allow。真正交互answerer与用户身份验证由具体入口承担，本轮没有全审Web/远程/CLI答复通道，不能声称任一已加载第三方插件都无法冒充策略或answerer。

原caller signal独立保存，与wrapper signal融合；启动前取消跳体，已启动tool.execute则await其settle，返回成功在已abort时变ABORTED，工具原有错误仍保留。取消不是抢占式杀线程/进程，不撤销已写文件/发送请求/已提交交易；tool忽略signal或外部已执行都需查目标。完整around/post/finalization链允许插件扩展，可信插件与实际工具的合作是边界。

#### 证据与依据

**依据 1 · 源码核查**：[packages/core/tools/src/pipeline.ts:190-231](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/packages/core/tools/src/pipeline.ts#L190-L231)

默认allow、ask、guard与启动前取消顺序。

<details>
<summary>查看原文（42行）</summary>

```text
  async prepare(input: ToolExecutionInput): Promise<ScheduledToolPreparation> {
    const created = this.createExecution(input)
    if (created.kind !== 'ready') return created
    const exec = created.exec
    if (this.callerCancelled(exec)) {
      return { kind: 'final-result', exec, result: toolAbortedBeforeDispatchResult() }
    }
    try {
      const carrier = scopeTarget(this.tools, exec.agent)
      const gate = await this.ctx.waterfall(
        carrier, 'tools/pre-execute', exec,
        () => Promise.resolve<PreToolDecision>({ kind: 'allow' }),
      )
      const askResolution = gate.kind === 'ask'
        ? await this.serviceAsk(exec, gate)
        : { decision: gate, approvalCancelled: false }
      const { decision } = askResolution
      if (this.callerCancelled(exec) && askResolution.approvalCancelled) {
        return { kind: 'post-result', exec, result: toolAbortedBeforeDispatchResult() }
      }
      if (decision.kind === 'cancel') {
        return { kind: 'post-result', exec, result: toolAbortedBeforeDispatchResult() }
      }
      const denialReason = decision.kind === 'allow' ? this.tools.checkGuards(exec) : decision.reason
      const denialInfo = decision.kind === 'deny' ? decision.info : undefined
      if (denialReason !== undefined) {
        return {
          kind: 'post-result',
          exec,
          result: this.materializeFinalResult({
            content: [{ type: 'text', text: `Error: ${denialReason}` }],
            isError: true,
            error: { message: denialReason, ...denialInfo === undefined ? {} : { info: denialInfo } },
          }),
        }
      }
      if (this.callerCancelled(exec)) {
        return { kind: 'post-result', exec, result: toolAbortedBeforeDispatchResult() }
      }
      return { kind: 'dispatch', exec }
    } catch (error: unknown) {
      return { kind: 'final-result', exec, result: toolErrorResult(error) }
```

</details>

**依据 2 · 源码核查**：[packages/core/tools/src/index.ts:393-402](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/packages/core/tools/src/index.ts#L393-L402)

真实global/inherited guards首拒绝。

<details>
<summary>查看原文（10行）</summary>

```text
  checkGuards(exec: ToolExecution): string | undefined {
    for (const layer of [this.guards.global, ...this.guards.chainLayers(exec.agent)]) {
      for (const guard of layer.guards.values()) {
        const reason = guard(exec)
        if (reason !== undefined) return reason
      }
    }
    return undefined
  }

```

</details>

**依据 3 · 源码核查**：[packages/core/tools/src/pipeline.ts:432-472](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/packages/core/tools/src/pipeline.ts#L432-L472)

只有allowed-once放行，缺服务/Agent/渠道拒绝。

<details>
<summary>查看原文（41行）</summary>

```text
  private async serviceAsk(
    exec: ToolExecution,
    ask: Extract<PreToolDecision, { kind: 'ask' }>,
  ): Promise<ToolAskResolution> {
    const approval = this.ctx.get('approval')
    if (approval === undefined) {
      return {
        decision: { kind: 'deny', reason: ask.reason ?? `tool "${exec.name}" requires approval (not yet supported)` },
        approvalCancelled: false,
      }
    }
    if (exec.agent === undefined) {
      return {
        decision: { kind: 'deny', reason: `tool "${exec.name}" requires approval, but the call has no agent to route it through` },
        approvalCancelled: false,
      }
    }
    const outcome = await approval.request({
      agent: exec.agent,
      toolName: exec.name,
      callId: exec.callId,
      ...ask.reason !== undefined ? { reason: ask.reason } : {},
      ...ask.displayReason !== undefined ? { displayReason: ask.displayReason } : {},
      signal: exec.signal,
    })
    switch (outcome) {
      case 'allowed-once': return { decision: { kind: 'allow' }, approvalCancelled: false }
      case 'rejected': return {
        decision: { kind: 'deny', reason: `the user rejected tool "${exec.name}"` },
        approvalCancelled: false,
      }
      case 'cancelled': return {
        decision: { kind: 'deny', reason: `approval for tool "${exec.name}" was cancelled` },
        approvalCancelled: true,
      }
      case 'unavailable': return {
        decision: { kind: 'deny', reason: `tool "${exec.name}" requires approval, but no approval channel is available` },
        approvalCancelled: false,
      }
      default: return assertNever(outcome, 'ApprovalOutcome')
    }
```

</details>

**依据 4 · 源码核查**：[packages/interaction/user-approval/src/index.ts:242-261](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/packages/interaction/user-approval/src/index.ts#L242-L261)

open turn与asked/decided审计。

<details>
<summary>查看原文（20行）</summary>

```text
  async request(req: ApprovalRequest): Promise<ApprovalOutcome> {
    const session = req.agent.session
    if (!this.approvalStateOf(session).turnOpen) {
      throw new Error(
        'approval.request() outside an open turn: the approval/asked + approval/decided audit pair '
        + 'must be turn-enclosed (a bare event between turns is crash-tail garbage on reload). '
        + 'Ask from inside the turn that needs the decision.',
      )
    }
    const id = ApprovalRequestId(randomUUID())
    session.append('approval/asked', {
      id,
      toolName: req.toolName,
      ...req.callId !== undefined ? { callId: req.callId } : {},
      ...req.reason !== undefined ? { reason: req.reason } : {},
    })
    const outcome = await this.decide(req, session)
    session.append('approval/decided', { id, outcome })
    return outcome
  }
```

</details>

**依据 5 · 源码核查**：[packages/interaction/user-approval/src/index.ts:293-334](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/packages/interaction/user-approval/src/index.ts#L293-L334)

never先拒绝，answerer异常/取消/晚答处理。

<details>
<summary>查看原文（42行）</summary>

```text
  private async decide(req: ApprovalRequest, session: Session): Promise<ApprovalOutcome> {
    const signal = req.signal
    if (signal?.aborted) return 'cancelled'
    // The 'never' policy is decided HERE, before any dispatch: a listener
    // registered with `prepend: true` after this service mounts would sit
    // ahead of any gate LISTENER, so a listener-shaped gate cannot keep the
    // documented promise that 'never' rejects deterministically regardless
    // of registration order — only the service's own request path can.
    if (this.effectivePolicy(session) === 'never') return 'rejected'
    // Enter the promise chain BEFORE dispatching: a listener that throws
    // SYNCHRONOUSLY (before its first await) must land in the same rejection
    // path as an async one — `Promise.resolve(call())` would let it escape
    // the containment into the caller.
    const answer: Promise<ApprovalOutcome> = Promise.resolve().then(
      () => this.ctx.waterfall(
        scopeTarget(req.agent, req.agent), 'approval/request', req,
        () => Promise.resolve<ApprovalOutcome>('unavailable'),
      ),
    ).then(
      // Normalize a rogue (non-vocabulary) answerer return to the fail-closed
      // outcome instead of leaking it into callers' closed-union switches.
      outcome => OUTCOMES.includes(outcome) ? outcome : 'unavailable',
      // A throwing answerer must fail the QUESTION closed, not the caller's
      // tool call open — the seam contains its callbacks.
      () => 'unavailable',
    )
    if (signal === undefined) return answer
    return await new Promise<ApprovalOutcome>((resolve) => {
      const onAbort = () => {
        signal.removeEventListener('abort', onAbort)
        resolve('cancelled')
      }
      signal.addEventListener('abort', onAbort, { once: true })
      void answer.then((outcome) => {
        signal.removeEventListener('abort', onAbort)
        // After an abort won the race this resolve is a settled-promise no-op:
        // the late answer is discarded by construction.
        resolve(outcome)
      })
    })
  }
}
```

</details>

**依据 6 · 源码核查**：[packages/core/tools/src/pipeline.ts:258-285](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/packages/core/tools/src/pipeline.ts#L258-L285)

caller/wrapper信号融合、await body与ABORTED。

<details>
<summary>查看原文（28行）</summary>

```text
  private async dispatchToolBody(exec: MutableToolRunContext): Promise<ToolExecutionResult> {
    const state = this.cancellationStates.get(exec)
    /* v8 ignore next -- only registry-minted executions reach the staged scheduler methods */
    if (state === undefined) throw new Error('tool registry scheduler invariant violated: missing cancellation state')
    const wrapperSignal = exec.signal
    const fused = fuseToolSignals(state.callerSignal, wrapperSignal)
    const signal = fused.signal

    if (isAborted(signal)) {
      fused.dispose()
      return toolAbortedBeforeDispatchResult()
    }
    exec.signal = signal
    try {
      const tool = this.resolveExecution(exec.name, exec.agent, exec.parent !== undefined, exec.toolSet)
      if (!tool) throw new ToolNotFoundError(exec.name)
      state.bodyInvoked = true
      const returned = await tool.execute(exec.arguments, exec)
      const result = this.createSuccessResult(exec, tool, returned)
      return isAborted(signal)
        ? toolAbortedResult(result)
        : result
    } catch (error: unknown) {
      return toolErrorResult(error)
    } finally {
      fused.dispose()
      exec.signal = wrapperSignal
    }
```

</details>

**依据 7 · 源码核查**：[packages/core/tools/src/pipeline.ts:295-326](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/packages/core/tools/src/pipeline.ts#L295-L326)

around执行后caller取消结果归一。

<details>
<summary>查看原文（32行）</summary>

```text
  async dispatch(exec: ToolRunContext): Promise<ScheduledToolDispatch> {
    try {
      const mutableExec = exec as MutableToolRunContext
      const carrier = scopeTarget(this.tools, exec.agent)
      const result = await this.ctx.waterfall(
        carrier, 'tools/execute', mutableExec,
        () => this.dispatchToolBody(mutableExec),
      )
      const normalized = this.normalizeDispatchResult(exec, result)
      const deferredContexts = this.deferredContexts.get(exec)
      /* v8 ignore next -- dispatch only receives executions minted by this registry's prepare stage */
      if (deferredContexts === undefined) throw new Error('tool registry scheduler invariant violated: unprepared execution')
      const resultWithDeferredContexts: ToolExecutionResult = deferredContexts.length === 0
        ? normalized
        : this.markCanonical(exec, {
          ...normalized,
          additionalContexts: [
            ...deferredContexts,
            ...normalized.additionalContexts ?? [],
          ],
        })
      return {
        kind: 'post-result',
        result: this.callerCancelled(exec) && !resultWithDeferredContexts.isError
          ? this.cancellationResult(exec, resultWithDeferredContexts)
          : resultWithDeferredContexts,
      }
    } catch (error: unknown) {
      return { kind: 'final-result', result: toolErrorResult(error) }
    }
  }

```

</details>

#### 缺口

- 未审所有策略和真实人工答复端身份、沙箱/子进程终止和外部回滚。
  **影响**：只能确认native审批接缝，不能将提示或ABORTED当全系统安全/无副作用。
  **进一步探讨**：分别核无answerer、never、拒绝/取消、body已写后取消，检查工具确未调用/实际目标是否已变；只在临时副本测试。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 会话日志什么时候算持久，写失败是否还会执行？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

Session.commit先校event并push内存log，再通知contained session/event observers，观察者错误不会回滚已接受内存事件；内存可见不等磁盘。JSONL backend install真实监听event把已绑定writer的事件进buffer，后台失败warn且保留有序批；session/flush会await drainLive再writer.flush。drain失败将整批放回buffer、pause后抛，persistContiguous持write lease、查seq连续性、修torn tail，persistBatch成功后才移动cursor。

后端persistBatch实际走首次materialize或已存在appendLines；appendLines写编码文本后handle.sync，失败尝试回滚旧文件size，回滚也失败抛AggregateError，不能假定失败总是无字节残留。这里不是仅读API注释的耐久承诺。本轮没有全审generation迁移/lease实现/Windows与zstd恢复，只核代表已有日志追加。

SessionStore.flush通过原carrier收全部listener，allSettled后任何失败抛；无参与者返回false。base挂checkpoint policy：model stream在first chunk前flush，顶层有Agent且非nested工具在next body前flush，pre-step也flush；写失败会阻这些代表下游边界，nested复用outer已记录call，无sessionId/找不到session的模型调用与无Agent/nested工具不走该关。policy没有把flush false单独拒绝，所以不能把任意配置、缺writer的profile都宣称已耐久。真正工具外部副作用和记录仍非共同事务：body后断电/结果未入盘可能需要人工查目标，不承诺自动exactly-once恢复。

#### 证据与依据

**依据 1 · 源码核查**：[packages/core/session/src/index.ts:889-910](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/packages/core/session/src/index.ts#L889-L910)

内存push再contained observers。

<details>
<summary>查看原文（22行）</summary>

```text
   * @param event - the candidate built at the current log length.
   * @param entry - the attachment read before the candidate was built.
   */
  private commit(event: SessionEvent, entry: SessionEntry | undefined): void {
    this.surfaceManager.validateNext(event)

    if (entry !== undefined) entry.appending = true
    try {
      const callbackArgs: unknown[] = [this, event]
      const callbacks = entry === undefined
        ? undefined
        : collectSessionCallbacks(entry.emitCtx, [entry.carrier, 'session/event', ...callbackArgs])
      this.log.push(event)
      this.eventsSnapshot = undefined
      if (entry !== undefined && callbacks !== undefined) {
        invokeContainedSessionObservers(entry.emitCtx, 'session/event', entry.id, callbackArgs, callbacks)
      }
    } finally {
      if (entry !== undefined) {
        entry.appending = false
        if (entry.detachRequested && entry.announcement !== 'dispatching') entry.detach()
      }
```

</details>

**依据 2 · 源码核查**：[packages/session/session-persistence-jsonl/src/storage.ts:549-568](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/packages/session/session-persistence-jsonl/src/storage.ts#L549-L568)

事件buffer、flush/disposed真实接线。

<details>
<summary>查看原文（20行）</summary>

```text
      yield ctx.on('session/event', (session: Session, event) => {
        writers.get(session.id)?.enqueueLive(event, (error) => {
          ctx.logger.warn(`session-persistence: background write for session "${session.id}" failed (buffered events retained): ${String(error)}`)
        })
      })
      yield ctx.on('session/flush', (session: Session) => {
        const writer = writers.get(session.id)
        if (writer === null || writer === undefined) return undefined
        return (async () => {
          await writer.drainLive()
          await writer.flush()
        })()
      })
      yield ctx.on('session/disposed', (session: Session) => {
        const writer = writers.get(session.id)
        if (writer === null || writer === undefined) return
        writer.close().catch((error: unknown) => {
          ctx.logger.warn(`session-persistence: final drain for session "${session.id}" failed: ${String(error)}`)
        })
      })
```

</details>

**依据 3 · 源码核查**：[packages/session/session-persistence-jsonl/src/storage.ts:288-345](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/packages/session/session-persistence-jsonl/src/storage.ts#L288-L345)

保留失败批、连续性/lease/写后cursor。

<details>
<summary>查看原文（58行）</summary>

```text
  drainLive(): Promise<void> {
    return this.draining ??= this.drainBuffered().finally(() => {
      this.draining = undefined
    })
  }

  private async drainBuffered(): Promise<void> {
    if (this.batchTimer !== undefined) {
      clearTimeout(this.batchTimer)
      this.batchTimer = undefined
    }
    this.drainPaused = false
    while (this.buffered.length > 0) {
      // Capture inside the chained turn so events landing while an earlier
      // batch writes coalesce into the next one, in order.
      await this.enqueueChain(async () => {
        // Only this single-flight drain splices the buffer, so the batch the
        // while-guard saw is still here when the chained turn runs.
        const batch = this.buffered.splice(0)
        try {
          await this.persistContiguous(materializeAppendBatch(batch))
        } catch (error: unknown) {
          this.buffered = batch.concat(this.buffered)
          this.drainPaused = true
          throw error
        }
      })
    }
  }

  /** The shared durable-append body: contiguity, ownership, torn-tail repair, storage write, state advance. */
  private async persistContiguous(batch: readonly SessionEvent[]): Promise<void> {
    if (this.access !== 'write') throw new SessionReadOnlyError(this.id, 'append')
    if (batch.length === 0) return
    await this.ensureLease()
    assertContiguous(this.id, batch, this.state.cursor)
    // Commit any pending torn-tail repair first, clearing each step's state
    // only once it lands so a failed step retries on the next mutation:
    // truncate the torn bytes, then durably rewrite the complete events
    // recovered from them (already counted in the primed cursor).
    if (this.state.tornTruncateTo !== undefined) {
      await this.storage.truncateTornTail(this.header, this.state.tornTruncateTo)
      this.state.tornTruncateTo = undefined
    }
    if (this.state.recoveredTail !== undefined) {
      if (this.state.recoveredTail.length > 0) {
        await this.storage.persistBatch(this.header, this.state.recoveredTail, this.state.materialized, this.state.inheritedEventCount)
      }
      this.state.recoveredTail = undefined
    }
    await this.storage.persistBatch(this.header, batch, this.state.materialized, this.state.inheritedEventCount)
    this.state.materialized = true
    this.state.cursor += batch.length
    this.state.primed = undefined
    this.observedLength = this.state.cursor
  }

  /**
```

</details>

**依据 4 · 源码核查**：[packages/session/session-persistence-jsonl/src/index.ts:911-937](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/packages/session/session-persistence-jsonl/src/index.ts#L911-L937)

真实persistBatch分派。

<details>
<summary>查看原文（27行）</summary>

```text
  async persistBatch(
    header: SessionHeader,
    events: readonly SessionEvent[],
    isMaterialized: boolean,
    inheritedEventCount: SessionLogOffsetType,
  ): Promise<void> {
    this.coldLogMemo.delete(header.id)
    await this.ensureRootEncoding()
    if (isMaterialized) {
      await this.appendLines(header, events)
    } else {
      await this.materialize(header, inheritedEventCount, events)
      this.tracker.materialized(header.id)
    }
  }

  /**
   * Materialize a header-only artifact for an explicitly durable empty session.
   * @param header - the session's stored header.
   * @param inheritedEventCount - the exact fork-inherited prefix length written into the header line.
   */
  async persistHeader(header: SessionHeader, inheritedEventCount: SessionLogOffsetType): Promise<void> {
    this.coldLogMemo.delete(header.id)
    await this.ensureRootEncoding()
    await this.materialize(header, inheritedEventCount, [])
    this.tracker.materialized(header.id)
  }
```

</details>

**依据 5 · 源码核查**：[packages/session/session-persistence-jsonl/src/index.ts:1413-1442](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/packages/session/session-persistence-jsonl/src/index.ts#L1413-L1442)

实际append write/sync与失败回滚。

<details>
<summary>查看原文（30行）</summary>

```text
  private async appendLines(meta: SessionHeader, events: readonly SessionEvent[]): Promise<void> {
    const content = await this.encodeEventBatch(events)
    const path = logPath(this.root, meta.cwd, meta.id, this.compression)
    const handle = await open(path, 'a')
    let closed = false
    const closeAppendHandle = async (): Promise<void> => {
      if (closed) return
      closed = true
      await handle.close()
    }

    try {
      const { size: before } = await handle.stat()
      try {
        await handle.writeFile(content)
        await handle.sync()
      } catch (error) {
        try {
          await closeAppendHandle()
          await this.rollbackAppend(path, before)
        } catch (rollbackError) {
          throw new AggregateError([error, rollbackError], `failed to roll back append to "${path}"`)
        }
        throw error
      }
    } finally {
      await closeAppendHandle()
    }
  }

```

</details>

**依据 6 · 源码核查**：[packages/core/session/src/index.ts:1342-1361](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/packages/core/session/src/index.ts#L1342-L1361)

flush全listener结算/失败与false。

<details>
<summary>查看原文（20行）</summary>

```text
  async flush(session: Session): Promise<boolean> {
    const { carrier } = this.liveEntryFor(session)
    const callbackArgs: unknown[] = [session]
    const callbacks = collectSessionCallbacks(this.ctx, [carrier, 'session/flush', session])
    const results = await Promise.allSettled(callbacks.map((callback) => {
      try {
        return callback(...callbackArgs)
      } catch (error: unknown) {
        // Preserve the listener's exact rejection value; flush is a caller-owned
        // failure boundary, and Cordis listeners may throw arbitrary values.
        // oxlint-disable-next-line typescript/prefer-promise-reject-errors
        return Promise.reject(error)
      }
    }))
    const failure = results.find((result): result is PromiseRejectedResult => result.status === 'rejected')
    if (failure !== undefined) throw failure.reason
    return callbacks.length > 0
  }

  /** Return the exact live entry; detached/prepared objects reject. */
```

</details>

**依据 7 · 源码核查**：[packages/session/session-checkpoint-policy/src/index.ts:29-37](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/packages/session/session-checkpoint-policy/src/index.ts#L29-L37)

模型flush后才next stream。

```text
function afterCheckpoint(
  ctx: Context,
  session: Session,
  next: () => AsyncIterable<StreamChunk>,
): AsyncIterable<StreamChunk> {
  return (async function* (): AsyncIterable<StreamChunk> {
    await ctx.sessions.flush(session)
    yield* next()
  })()
```

**依据 8 · 源码核查**：[packages/session/session-checkpoint-policy/src/index.ts:64-83](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/packages/session/session-checkpoint-policy/src/index.ts#L64-L83)

真实模型/top-level工具/pre-step检查点和旁路。

<details>
<summary>查看原文（20行）</summary>

```text
  ctx.on('llm/stream', (options, next): AsyncIterable<StreamChunk> => {
    if (options.sessionId === undefined) return next()
    const session = ctx.sessions.get(options.sessionId)
    return session === undefined ? next() : afterCheckpoint(ctx, session, next)
  })

  ctx.on('tools/execute', async (exec, next): Promise<ToolExecutionResult> => {
    if (exec.agent === undefined || exec.parent !== undefined) return next()
    await ctx.sessions.flush(exec.agent.session)
    if (exec.signal.aborted) return abortedBeforeDispatchResult()
    return next()
  })

  // Before each request, persist everything committed by the preceding step;
  // the first step's call is an intentional no-op beyond any prompt intake.
  ctx.on('agent/pre-step', async ({ agent }, next): Promise<PreStepDecision> => {
    await ctx.sessions.flush(agent.session)
    return next()
  })
}
```

</details>

#### 缺口

- 未验崩溃/磁盘满/回滚失败、多进程lease、全部格式迁移和checkpoint覆盖。
  **影响**：代表链强于仅内存日志，但不能承诺所有部署/外部效果自动可恢复。
  **进一步探讨**：副本模拟后台写失败与显式flush失败，核adapter/tool未启动；再body已生效结果未落盘时核重启和实际目标，禁止盲重放。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 什么具体用法值得先试，完整负担与退路是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

有Agent扩展需求且能审插件的开发者，可在单独profile、无私密凭据的可丢弃环境，固定Host0.2.2-rc.1/模型与一个只读小工具，只做一次“读脱敏小文件并给可核答案”，核scope/native实际被选、无answerer时ask拒绝、成功结果与session flush后重启读取一致；不要首试shell写出/远程公网或多插件大组合。原SDK/已知配置是退路，出现缺服务、意外写入、日志不同步或审批边界不明就停止并回原配置。

首次需Node>=24.9、构建/发布成品、profile/模型路由与凭据、工具与实际sandbox/网络、持久后端及备份；默认Web地址自述127.0.0.1:3080不证明每个部署的暴露与鉴权。持续模型输入/输出与工具资源、会话/附件磁盘，维护插件升级/策略/人工验收。失败包括重试模型/部分工具副作用、权限调查与状态恢复，时间现金没有测值，不能填零。退出需停止Agent/背景工作，保存规范日志与产物，撤profile/插件/凭据权限，清理数据按保留策略；取消/卸载不会自动撤销已发生外部效果。安全说明明确推荐可丢弃环境和最小权限，本轮照此限定而不宣称Host已生产安全。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-18](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/package.json#L1-L18)

版本/Node/构建环境声明。

<details>
<summary>查看原文（18行）</summary>

```text
{
  "name": "@deepseek-ai/dsh-root",
  "version": "0.2.2-rc.1",
  "license": "MIT",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@11.28.5",
  "engines": {
    "node": ">=24.9.0"
  },
  "workspaces": [
    "vendor/*",
    "packages/*/*",
    "native/system",
    "native/system/packages/*",
    "apps/*",
    "website"
  ],
```

</details>

**依据 2 · 作者声明**：[README.zh.md:20-45](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/README.zh.md#L20-L45)

安装运行与本机Web入口自述。

<details>
<summary>查看原文（26行）</summary>

````text

### 通过 `npm` 运行

安装 `Node.js`，然后运行：

```sh
npx @deepseek-ai/dsh web
```

该命令默认会在 `http://127.0.0.1:3080` 启动 Web UI，本机启动时还会用默认浏览器打开页面。通过 SSH 启动时只打印宿主机 URL，因为本地转发地址由 SSH 客户端或编辑器持有。传入 `--no-open` 可仅运行服务器而不打开浏览器。详见 [Web UI 指南](docs/user/guide/index.zh.md)。

<a id="run-from-source"></a>

### 从源码运行

如需从仓库源码运行：

```sh
git clone https://github.com/deepseek-ai/deepseek-harness.git
cd deepseek-harness
pnpm install
pnpm run build
pnpm dsh web
```

`pnpm run build` 会准备仓库产物。`pnpm dsh web` 会直接使用这些已构建产物，不会重新构建。
````

</details>

**依据 3 · 作者声明**：[SAFETY.md:7-25](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/SAFETY.md#L7-L25)

实际可能权限及可丢弃/最小权限建议。

<details>
<summary>查看原文（19行）</summary>

```text
DeepSeek Harness is experimental developer-preview software. It has not undergone a security audit and must not be treated as secure or production-ready.

The project can execute model-generated code and commands, load third-party plugins, and access the network, processes, credentials, and files made available to it. Incorrect model output, defects, misconfiguration, malicious input, or untrusted plugins may damage the host computer, modify or delete files, disclose data or credentials, or cause other unintended effects.

## Sandbox limitations

Sandboxing, approval prompts, and permission controls can reduce risk, but they do not guarantee isolation or prevent damage. Even correctly enforced restrictions cannot protect resources that the project is allowed to access.

Do not rely on DeepSeek Harness as the sole security control for untrusted workloads.

## Responsible use

- Run the project with the least privileges and access required.
- Prefer a disposable virtual machine, container, or dedicated environment.
- Keep backups of files that the project can access.
- Do not expose sensitive credentials or data unless you accept the risk.
- Review plugins, configuration, and proposed commands before allowing them to run.

## No warranty or liability
```

</details>

**依据 4 · 源码核查**：[packages/core/tools/src/pipeline.ts:432-472](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/packages/core/tools/src/pipeline.ts#L432-L472)

无approval/answerer失败闭合。

<details>
<summary>查看原文（41行）</summary>

```text
  private async serviceAsk(
    exec: ToolExecution,
    ask: Extract<PreToolDecision, { kind: 'ask' }>,
  ): Promise<ToolAskResolution> {
    const approval = this.ctx.get('approval')
    if (approval === undefined) {
      return {
        decision: { kind: 'deny', reason: ask.reason ?? `tool "${exec.name}" requires approval (not yet supported)` },
        approvalCancelled: false,
      }
    }
    if (exec.agent === undefined) {
      return {
        decision: { kind: 'deny', reason: `tool "${exec.name}" requires approval, but the call has no agent to route it through` },
        approvalCancelled: false,
      }
    }
    const outcome = await approval.request({
      agent: exec.agent,
      toolName: exec.name,
      callId: exec.callId,
      ...ask.reason !== undefined ? { reason: ask.reason } : {},
      ...ask.displayReason !== undefined ? { displayReason: ask.displayReason } : {},
      signal: exec.signal,
    })
    switch (outcome) {
      case 'allowed-once': return { decision: { kind: 'allow' }, approvalCancelled: false }
      case 'rejected': return {
        decision: { kind: 'deny', reason: `the user rejected tool "${exec.name}"` },
        approvalCancelled: false,
      }
      case 'cancelled': return {
        decision: { kind: 'deny', reason: `approval for tool "${exec.name}" was cancelled` },
        approvalCancelled: true,
      }
      case 'unavailable': return {
        decision: { kind: 'deny', reason: `tool "${exec.name}" requires approval, but no approval channel is available` },
        approvalCancelled: false,
      }
      default: return assertNever(outcome, 'ApprovalOutcome')
    }
```

</details>

**依据 5 · 源码核查**：[packages/session/session-checkpoint-policy/src/index.ts:64-83](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/packages/session/session-checkpoint-policy/src/index.ts#L64-L83)

代表检查点条件。

<details>
<summary>查看原文（20行）</summary>

```text
  ctx.on('llm/stream', (options, next): AsyncIterable<StreamChunk> => {
    if (options.sessionId === undefined) return next()
    const session = ctx.sessions.get(options.sessionId)
    return session === undefined ? next() : afterCheckpoint(ctx, session, next)
  })

  ctx.on('tools/execute', async (exec, next): Promise<ToolExecutionResult> => {
    if (exec.agent === undefined || exec.parent !== undefined) return next()
    await ctx.sessions.flush(exec.agent.session)
    if (exec.signal.aborted) return abortedBeforeDispatchResult()
    return next()
  })

  // Before each request, persist everything committed by the preceding step;
  // the first step's call is an intentional no-op beyond any prompt intake.
  ctx.on('agent/pre-step', async ({ agent }, next): Promise<PreStepDecision> => {
    await ctx.sessions.flush(agent.session)
    return next()
  })
}
```

</details>

#### 缺口

- 没有安装/模型/工具任务实测、真实集成工时/运行账单/退出验收。
  **影响**：只建议开发者隔离小样本试用，无法许诺更省钱省时或承接不可信生产负载。
  **进一步探讨**：先核固定模型一个脱敏只读任务的答案、审批与重启日志，再记录接入/修复分钟和usage与原SDK比较。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 可借鉴的生产方向是什么，哪些条件会推翻？

**研究主题**：贡献与相对优势、新假设与验证

#### 完整回答

技术贡献是可组合profile到作用域工具执行与会话检查点的清晰接缝：配置声明、选中executor、审批/guard、工具结算和耐久记录各有独立语义，而非仅提供工具schema。Cordis/模型/OS执行能力来自上游和各包；根项目组合它们，不能把全仓每插件都归成本次已独立验收。已有SDK同样能实现这些机制，本项相对优势应以增量接入和故障定位成本衡量，而非包数、绿CI或“一切皆插件”口号。

候选是插件升级验收增加一组真实接缝合同样本，而不只semver：scope provider卸载应拒绝而非降级、ask无answerer应拒绝、body已启动取消须保留已影响状态解释、后台落盘失败须使checkpoint阻下游。对一组固定旧新插件，在同脱敏任务与故障注入下比较“仅版本声明检查”与增加接缝样本的漏检/误报、维护时间和错误重试；若不多发现真实用户故障或维护负担超过收益就推翻。本轮只给验证设计，未运行、不是已交付兼容保证。

#### 证据与依据

**依据 1 · 源码核查**：[packages/core/tools/src/index.ts:353-377](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/packages/core/tools/src/index.ts#L353-L377)

作用域executor卸载失败边界。

<details>
<summary>查看原文（25行）</summary>

```text
   * Resolve the nearest scoped provider, or the deployment default.
   * @param scope - Agent or preset scope; omitted selects only the root contribution.
   * @returns the selected executor; throws when it is missing or unloaded.
   */
  private selectExecutor(scope?: ScopeKey): ToolExecutor {
    let record: Registration | undefined
    for (const key of scopeChainOf(scope)) {
      record = this.scoped.get(key)
      if (record !== undefined) break
    }
    record ??= this.root
    const executor = record?.executor
    if (executor === undefined) throw new ToolExecutorUnavailableError()
    return executor
  }

  /**
   * Delegate a raw call batch to its Agent's provider or the deployment default.
   * Select at dispatch; accepted batches settle through that provider even if it unloads.
   * @param input - original calls, optional owning Agent, and optional logging step.
   * @returns the selected executor's settled batch; unavailable selections reject.
   */
  async execute(input: ToolBatchInput): Promise<ToolBatchResult> {
    return this.selectExecutor(input.agent).execute(input)
  }
```

</details>

**依据 2 · 源码核查**：[packages/core/tools/src/pipeline.ts:432-472](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/packages/core/tools/src/pipeline.ts#L432-L472)

approval不可用拒绝。

<details>
<summary>查看原文（41行）</summary>

```text
  private async serviceAsk(
    exec: ToolExecution,
    ask: Extract<PreToolDecision, { kind: 'ask' }>,
  ): Promise<ToolAskResolution> {
    const approval = this.ctx.get('approval')
    if (approval === undefined) {
      return {
        decision: { kind: 'deny', reason: ask.reason ?? `tool "${exec.name}" requires approval (not yet supported)` },
        approvalCancelled: false,
      }
    }
    if (exec.agent === undefined) {
      return {
        decision: { kind: 'deny', reason: `tool "${exec.name}" requires approval, but the call has no agent to route it through` },
        approvalCancelled: false,
      }
    }
    const outcome = await approval.request({
      agent: exec.agent,
      toolName: exec.name,
      callId: exec.callId,
      ...ask.reason !== undefined ? { reason: ask.reason } : {},
      ...ask.displayReason !== undefined ? { displayReason: ask.displayReason } : {},
      signal: exec.signal,
    })
    switch (outcome) {
      case 'allowed-once': return { decision: { kind: 'allow' }, approvalCancelled: false }
      case 'rejected': return {
        decision: { kind: 'deny', reason: `the user rejected tool "${exec.name}"` },
        approvalCancelled: false,
      }
      case 'cancelled': return {
        decision: { kind: 'deny', reason: `approval for tool "${exec.name}" was cancelled` },
        approvalCancelled: true,
      }
      case 'unavailable': return {
        decision: { kind: 'deny', reason: `tool "${exec.name}" requires approval, but no approval channel is available` },
        approvalCancelled: false,
      }
      default: return assertNever(outcome, 'ApprovalOutcome')
    }
```

</details>

**依据 3 · 源码核查**：[packages/core/tools/src/pipeline.ts:258-285](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/packages/core/tools/src/pipeline.ts#L258-L285)

已启动取消结算。

<details>
<summary>查看原文（28行）</summary>

```text
  private async dispatchToolBody(exec: MutableToolRunContext): Promise<ToolExecutionResult> {
    const state = this.cancellationStates.get(exec)
    /* v8 ignore next -- only registry-minted executions reach the staged scheduler methods */
    if (state === undefined) throw new Error('tool registry scheduler invariant violated: missing cancellation state')
    const wrapperSignal = exec.signal
    const fused = fuseToolSignals(state.callerSignal, wrapperSignal)
    const signal = fused.signal

    if (isAborted(signal)) {
      fused.dispose()
      return toolAbortedBeforeDispatchResult()
    }
    exec.signal = signal
    try {
      const tool = this.resolveExecution(exec.name, exec.agent, exec.parent !== undefined, exec.toolSet)
      if (!tool) throw new ToolNotFoundError(exec.name)
      state.bodyInvoked = true
      const returned = await tool.execute(exec.arguments, exec)
      const result = this.createSuccessResult(exec, tool, returned)
      return isAborted(signal)
        ? toolAbortedResult(result)
        : result
    } catch (error: unknown) {
      return toolErrorResult(error)
    } finally {
      fused.dispose()
      exec.signal = wrapperSignal
    }
```

</details>

**依据 4 · 源码核查**：[packages/session/session-persistence-jsonl/src/storage.ts:288-316](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/packages/session/session-persistence-jsonl/src/storage.ts#L288-L316)

保留持久失败批。

<details>
<summary>查看原文（29行）</summary>

```text
  drainLive(): Promise<void> {
    return this.draining ??= this.drainBuffered().finally(() => {
      this.draining = undefined
    })
  }

  private async drainBuffered(): Promise<void> {
    if (this.batchTimer !== undefined) {
      clearTimeout(this.batchTimer)
      this.batchTimer = undefined
    }
    this.drainPaused = false
    while (this.buffered.length > 0) {
      // Capture inside the chained turn so events landing while an earlier
      // batch writes coalesce into the next one, in order.
      await this.enqueueChain(async () => {
        // Only this single-flight drain splices the buffer, so the batch the
        // while-guard saw is still here when the chained turn runs.
        const batch = this.buffered.splice(0)
        try {
          await this.persistContiguous(materializeAppendBatch(batch))
        } catch (error: unknown) {
          this.buffered = batch.concat(this.buffered)
          this.drainPaused = true
          throw error
        }
      })
    }
  }
```

</details>

**依据 5 · 源码核查**：[packages/session/session-checkpoint-policy/src/index.ts:64-83](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/packages/session/session-checkpoint-policy/src/index.ts#L64-L83)

checkpoint真正拦下游。

<details>
<summary>查看原文（20行）</summary>

```text
  ctx.on('llm/stream', (options, next): AsyncIterable<StreamChunk> => {
    if (options.sessionId === undefined) return next()
    const session = ctx.sessions.get(options.sessionId)
    return session === undefined ? next() : afterCheckpoint(ctx, session, next)
  })

  ctx.on('tools/execute', async (exec, next): Promise<ToolExecutionResult> => {
    if (exec.agent === undefined || exec.parent !== undefined) return next()
    await ctx.sessions.flush(exec.agent.session)
    if (exec.signal.aborted) return abortedBeforeDispatchResult()
    return next()
  })

  // Before each request, persist everything committed by the preceding step;
  // the first step's call is an intentional no-op beyond any prompt intake.
  ctx.on('agent/pre-step', async ({ agent }, next): Promise<PreStepDecision> => {
    await ctx.sessions.flush(agent.session)
    return next()
  })
}
```

</details>

**依据 6 · 源码核查**：[packages/boot/app-boot/src/plugin-compatibility.ts:49-76](https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/packages/boot/app-boot/src/plugin-compatibility.ts#L49-L76)

版本范围只处理声明。

<details>
<summary>查看原文（28行）</summary>

```text
}

function satisfies(runtimeVersion: string, range: string): boolean {
  return range.trim() !== '' && semver.satisfies(runtimeVersion, range, { includePrerelease: true })
}

function unmetRequirements(fields: Record<string, unknown>, runtimeVersion: string): Record<string, string> {
  const engines = Object.hasOwn(fields, 'engines') ? objectOf(fields.engines, 'Plugin manifest engines') : {}
  if (Object.hasOwn(engines, 'dsh')) {
    const range = engines.dsh
    if (typeof range !== 'string') throw new Error('Plugin manifest engines.dsh must be a string')
    return satisfies(runtimeVersion, range) ? {} : { 'engines.dsh': range }
  }
  if (!Object.hasOwn(fields, 'peerDependencies')) return {}
  const dependencies = objectOf(fields.peerDependencies, 'Plugin manifest peerDependencies')
  const unmet: Record<string, string> = {}
  for (const [name, range] of Object.entries(dependencies)) {
    if (typeof range !== 'string') {
      throw new Error(`Plugin manifest peerDependencies[${JSON.stringify(name)}] must be a string`)
    }
    if (name !== '@deepseek-ai/dsh' && !name.startsWith('@deepseek-ai/dsh-')) continue
    const requirement = ['workspace:^', 'workspace:~', 'workspace:*'].includes(range) ? runtimeVersion : range
    if (!satisfies(runtimeVersion, requirement)) unmet[name] = range
  }
  return unmet
}

/**
```

</details>

#### 缺口

- 未对真实插件升级故障集做对照。
  **影响**：不能说接缝测试已减少事故或替代全部兼容审核。
  **进一步探讨**：从一次已知升级故障固定重现与反例，分别计检出和维护分钟，无净收益就保留简单版本检查。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
