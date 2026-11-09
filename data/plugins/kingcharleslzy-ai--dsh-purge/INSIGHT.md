# dsh-purge Community

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[126caa2](https://github.com/kingcharleslzy-ai/dsh-purge/tree/126caa2c99297223a7e0e87e604aecfc802f396e)

<!-- BEGIN META -->
[![GitHub ★ 5,482](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5%2C482&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/kingcharleslzy-ai/dsh-purge)
<!-- END META -->

> **功能**：集中管理 DSH 提示词、补丁状态和备份的宿主插件。显式应用可改写宿主审批及文件写入策略。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示，插件把按宿主核对、补丁应用和回退入口组织到同一维护流程。具体增量来自磁盘写入、锚点识别和结果聚合。

> **主要限制**：[Q02](#research-q02) 文件写入围栏的引擎补丁可独立影响 read-only 的实际效果。[Q03](#research-q03) 多宿主应用可留下部分写入，模型工具完成文案不足以确认完整状态。 Web 提示词写入独立于宿主补丁循环，模型工具的提示词门也位于可更改环境和清理文件的调用之后。

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
  - [Q01 · 对本地 DSH 维护者增加了什么？](#detail-section-11)
  - [Q02 · 应用调用会写入哪些安全相关目标？](#detail-section-12)
  - [Q03 · 备份失败、锚点偏移与多宿主部分成功怎样呈现？](#detail-section-13)
  - [Q04 · 哪些条件决定采用成本？](#detail-section-14)
  - [Q05 · 逐宿主预检和恢复演练能否减少不可恢复状态？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：负责自有 DSH Web 或 Desktop 实例的维护者，需要在安装、升级或自定义设置后确认宿主的补丁、权限和可恢复状态。

维护者以 DSH 原生 profile 配置管理提示词和权限，另保存宿主文件，手工比对每次写入和恢复结果。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **用户命令**：CLI dsh-purge 状态、应用和恢复
- **模型工具**：purge_status、purge_apply 和 purge_revert
- **Host 路由**：DSH Web 应用与状态路由

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 对应版本和布局的 DSH Desktop 或 Web profile | 启动必需 | 承载 Cordis 插件与应用路径 | 安装、注册或补丁匹配可能失败 |
| Node 18 及以上、Cordis 4 系 | 启动必需 | 执行根包及加载接口 | 运行条件未满足 |
| 可写目标、可单独恢复的宿主副本 | 观察只读状态时可选，评估写入时必需 | 存储补丁与保留退出条件 | 停在状态核对，避免继续应用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 维护者核对 DSH_HOME、profile、宿主路径 | 目标与活动进程可辨认 |
| 加载 | DSH 挂载插件，维护者核对状态 | 读取到预期宿主与补丁条目 |
| 应用 | 维护者在隔离副本按目标核对备份、提示词与完成字段 | 任何目标失败即停止，分别检查已发生的变更 |
| 验收 | 维护者重启后复核实际读写权限，必要时恢复 | 核对文件哈希、逐文件恢复错误与权限语义 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 可丢弃的 DSH 实例、独立备份和磁盘空间 | 核对 profile、宿主路径和许可模式 | 备份所需空间及人时未测 |
| 持续使用 | 宿主升级和重启所需的环境与停机 | 逐目标核对锚点、写入和重启后权限 | 复验频率与停机未量化 |
| 失败恢复 | 有独立备份的干净宿主与原生配置 | 分别核对提示词、宿主文件和目录清理，必要时重建 | 恢复耗时和完整性未验证 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 宿主补丁状态 | 可读状态、逐条应用结果和 Web 完整性字段有源码入口 | 相对手工核查的时间与误报率 |
| 权限行为 | 有默认许可与引擎文件围栏替换定义，应用按锚点写入 | 各宿主是否加载、OS 层权限和用户实际结果 |
| 故障恢复 | 有逐文件备份、恢复状态以及 profile 快照日志 | 跨宿主失败后恢复完整性、人时和停机 |

> **思考**：[Q02](#research-q02) 文件写入围栏的引擎补丁可独立影响 read-only 的实际效果。[Q03](#research-q03) 多宿主应用可留下部分写入，模型工具完成文案不足以确认完整状态。 Web 提示词写入独立于宿主补丁循环，模型工具的提示词门也位于可更改环境和清理文件的调用之后。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示，插件把按宿主核对、补丁应用和回退入口组织到同一维护流程。具体增量来自磁盘写入、锚点识别和结果聚合。

逐文件备份、profile 快照、原子单文件写入与跨宿主应用属于不同层次。状态读者应核对失败、目标覆盖和实际加载，模型工具的计数只能表示已应用和已存在的补丁数。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 文件写入围栏的引擎补丁可独立影响 read-only 的实际效果。[Q03](#research-q03) 多宿主应用可留下部分写入，模型工具完成文案不足以确认完整状态。 Web 提示词写入独立于宿主补丁循环，模型工具的提示词门也位于可更改环境和清理文件的调用之后。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q01](#research-q01) 适合持有独立宿主副本的维护者先观察状态入口。[Q02](#research-q02) 若需要维持原有只读语义，先留在原生配置。[Q03](#research-q03) 出现快照失败、任何预期目标未写或只读测试异常，即停止应用并核验备份，必要时从干净副本恢复。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码验证真实 DSH 插件接线、权限修改、逐宿主写入和状态差异。没有执行补丁、安装、重启或宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、bin/dsh-purge.js、lib/index.js、lib/patches/index.mjs、lib/patches/code.mjs、lib/patches/engine.mjs、lib/core.js、lib/core/verify.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根 DSH 插件与 CLI 的主应用链、核心权限补丁及多宿主恢复边界。演练台、更新器、独立面板和所有版本兼容性另需核查。
- 下一步：目前只有固定源码。下一步在无真实账户的隔离环境创建两份有基线哈希的宿主，令第二份某一锚点不匹配，比较两入口报告、变更文件及恢复哈希，再以临时文件核对实际只读策略。

**分析版本**

- **仓库**：[kingcharleslzy-ai/dsh-purge](https://github.com/kingcharleslzy-ai/dsh-purge)
- **版本号**：1.6.86（[固定提交 126caa2](https://github.com/kingcharleslzy-ai/dsh-purge/tree/126caa2c99297223a7e0e87e604aecfc802f396e)）
- **版本日期**：2026-11-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 先在全部目标完成锚点和备份预检，可能减少宿主之间的部分写入；用第二宿主受控失败对照验证。

目前只有固定源码。下一步在无真实账户的隔离环境创建两份有基线哈希的宿主，令第二份某一锚点不匹配，比较两入口报告、变更文件及恢复哈希，再以临时文件核对实际只读策略。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 135 | 10577 | — | — | 184884 |
| .js | source | 133 | 79715 | 72947 | 4745 | — |
| .mjs | source | 61 | 8182 | 7515 | 681 | — |
| .mjs | test | 101 | 11252 | 10387 | 501 | — |
| .cjs | test | 9 | 2143 | 2124 | 21 | — |

</details>

**活跃度**

[![Issue 未关闭 15](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=15&color=737b86&logo=github)](https://github.com/kingcharleslzy-ai/dsh-purge/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 84](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=84&color=737b86&logo=github)](https://github.com/kingcharleslzy-ai/dsh-purge/issues?q=is%3Aissue+created%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z) [![近30天关闭 69](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=69&color=737b86&logo=github)](https://github.com/kingcharleslzy-ai/dsh-purge/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z)



统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断管理自有 DSH 实例的人能否借统一入口核对补丁写入和恢复状态，以及权限修改与部分失败会怎样影响采用。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 对本地 DSH 维护者增加了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

作者把它定位为管理本机 DSH 的提示词、补丁状态和恢复的组件。包内的 Cordis 组合会装载插件，状态和应用命令也可从独立 CLI 进入。相对维护者逐个找宿主文件并手抄改动，它会枚举宿主、输出补丁结果并分开执行恢复。合格任务是维护者能明确每个目标的写入结果、重启要求及回退点。只有提示词编辑需求或原生配置已经足够时，扩大的宿主变更范围可能没有相应价值。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:39-46](https://github.com/kingcharleslzy-ai/dsh-purge/blob/126caa2c99297223a7e0e87e604aecfc802f396e/README.md#L39-L46)

作者描述的目标用户和维护动作

```text
dsh-purge Community 是一个跑在你自己机器上的 Harness 附加组件。它把日常使用里最消耗注意力的几件事收敛到一处：

- **看清楚状态**：安装、补丁、注入到底有没有就绪，一条命令或一屏面板给结论；
- **少一些往返**：把反复出现的确认与打断，收敛成一次设置；
- **随时能回去**：应用、回滚、开关都留记录，操作前自动快照；
- **方便做实验**：提示词、规则、预设集中管理，改坏了能撤。

目标很简单：**让助手更连贯地配合你的学习与动手实验**，而不是每做一步都先停下来问一句。
```

**依据 2 · 源码核查**：[package.json:83-108](https://github.com/kingcharleslzy-ai/dsh-purge/blob/126caa2c99297223a7e0e87e604aecfc802f396e/package.json#L83-L108)

根包 DSH bundle、客户端与安装方式

<details>
<summary>查看原文（26行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-sidebar-right"
      ]
    },
    "install": {
      "preferred": "tarball",
      "tarball": "https://github.com/kingcharleslzy-ai/dsh-purge/releases/download/v1.6.86/dsh-purge-community-1.6.86.tgz",
      "git": "https://github.com/kingcharleslzy-ai/dsh-purge.git"
    },
    "compatibility": {
      "dsh": ">=0.2.1-rc.1 <0.3.0",
      "profiles": [
        "desktop",
        "web"
      ],
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:27-45](https://github.com/kingcharleslzy-ai/dsh-purge/blob/126caa2c99297223a7e0e87e604aecfc802f396e/cordis.patch.yml#L27-L45)

加载插件、修改提示词配置，声明 autoApplyOnStart 关闭

<details>
<summary>查看原文（19行）</summary>

```text
- id: system-prompt
  config:
    includeHarnessIdentity: false
    personaPrefix: ""
    # The runtime checks cwd availability; the config layer must not require it.
    personaSuffix: ""

- insert:
    - id: dsh-purge
      name: 'dsh-purge-community'
      inject: [systemPrompt, tools]
      config:
        enabled: true
        excludePresets: []
        autoApplyOnStart: false
        autoUpdateOnStart: false
        autoRevertOnMissing: false
        injectOnce: false
        stripMnemon: true
```

</details>

**依据 4 · 源码核查**：[bin/dsh-purge.js:44-56](https://github.com/kingcharleslzy-ai/dsh-purge/blob/126caa2c99297223a7e0e87e604aecfc802f396e/bin/dsh-purge.js#L44-L56)

CLI 状态与更改动作入口

<details>
<summary>查看原文（13行）</summary>

```text
  if (mode === "--help" || args.includes("-h")) {
    console.log(`dsh-purge 用法:
  dsh-purge --status     显示状态
  dsh-purge --apply      应用全部清洗（提示词+代码+shim+override）
  dsh-purge --revert     回滚还原
  dsh-purge --uninstall  卸载插件（已应用则先还原）
  dsh-purge --edit       编辑注入文件 prompt-inject.md
  dsh-purge --help       帮助`);
    return;
  }

  const state = await hostCore.gatherState();
  console.log(printStatus(state));
```

</details>

#### 缺口

- 未取得维护者反复遇到状态误报或确认摩擦的直接记录。
  **影响**：无法衡量重复操作时间和是否足以换取维护负担。
  **进一步探讨**：选同版本自有测试实例记录手工核对与插件核对各需几步。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 应用调用会写入哪些安全相关目标？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

根 manifest 的组合加载插件，Web 应用显式接到多宿主补丁，补丁组纳入代码与引擎替换。命中版本锚点并写入时，配置缺省许可可变为 danger-full-access，对该模式的审批默认变为 never，已有 `DSH_PERMISSION_MODE` 的判断仍保留。另一条引擎补丁把原先检查 read-only 与工作区范围的 `checkedTarget` 换成直接返回目标，因此即使界面选择 read-only，若该补丁已经命中且被宿主加载，这一特定文件检查也会失效。补丁代码命中只给出磁盘层证据，当前宿主实际载入与 OS 层限制需另测。 Web 入口先尝试保存用户提示词或初始化默认稿，再执行宿主补丁循环。保存抛错只记日志，随后仍会应用宿主补丁。模型工具则先调用环境初始化及桌面命令目录清理，再检查宿主与提示词条件。初始化可能补 DSH_HOME 或清除已固定的全访问环境值。目录清理在命中条件时可移走插件备份、删除插件产物或剥离 dsh.cmd 的旧注入。即使提示词检查拒绝，早先这些前置操作仍可能已发生。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:2300-2322](https://github.com/kingcharleslzy-ai/dsh-purge/blob/126caa2c99297223a7e0e87e604aecfc802f396e/lib/index.js#L2300-L2322)

Web 应用实际调用全组补丁并评估完成

<details>
<summary>查看原文（23行）</summary>

```text
            try {
              await core.commitOverrideOnApply(state.dsh_home, incoming);
            } catch (e) {
              console.warn("[dsh-purge] apply override:", String(e && e.message ? e.message : e));
            }
            const httpMulti = await core.applyPatchesAllHosts(core.ALL_PATCHES, {
              preserveClientBundles: false,
              forApply: true,
            });
            const report = httpMulti.report;
            const shim = await core.patchAllShims();
            let cliRepair = null;
            try {
              cliRepair = core.repairOfficialCliAfterUnpack();
            } catch (e) {
              cliRepair = { ok: false, error: String(e && e.message ? e.message : e) };
            }
            const flash = core.silenceCmdFlash(httpMulti.hosts[0]?.aiBase || state.ai_base);
            const summary = core.summarizeApplyReport(report);
            const hostWritten =
              core.allPatchHostsWritten(httpMulti.hosts) || core.hostCleanMarkersPresent(state.ai_base);
            const hookDenyRestoreFailed = (httpMulti.hookDenyRestoreFailed || []).length > 0;
            const complete = summary.failed.length === 0 && flash.ok === true && hostWritten && !hookDenyRestoreFailed;
```

</details>

**依据 2 · 源码核查**：[lib/patches/index.mjs:2-8](https://github.com/kingcharleslzy-ai/dsh-purge/blob/126caa2c99297223a7e0e87e604aecfc802f396e/lib/patches/index.mjs#L2-L8)

代码和引擎补丁进入 ALL_PATCHES

```text
import { PATCHES } from './prompt.mjs';
import { CODE_PATCHES } from './code.mjs';
import { ENGINE_PATCHES } from './engine.mjs';
import { NEW_TOOL_PATCHES } from './new-tools.mjs';
import { OPT_IN_PATCHES } from './opt-in.mjs';

export const ALL_PATCHES = [...PATCHES, ...CODE_PATCHES, ...ENGINE_PATCHES, ...NEW_TOOL_PATCHES, ...OPT_IN_PATCHES];
```

**依据 3 · 源码核查**：[lib/patches/code.mjs:3-39](https://github.com/kingcharleslzy-ai/dsh-purge/blob/126caa2c99297223a7e0e87e604aecfc802f396e/lib/patches/code.mjs#L3-L39)

系统写权限字面量与缺省模式、审批修改

<details>
<summary>查看原文（37行）</summary>

```text
  {
    id: 6, name: "SANDBOX_DENY_FILE_WRITE", layer: "代码", layer_en: "Code",
    desc: "沙箱 deny file-write / sandbox deny",
    file: "sandbox-local",
    rel: ["lib", "index.js"],
    patterns: ['"(deny file-write*)"'],
    replace: '"(allow file-write*)"',
    marker: "(allow file-write*)",
  },
  {
    // 只改 YAML 默认值，不写 DSH_PERMISSION_MODE，避免锁死设置页。
    id: 7, name: "SANDBOX_MODE_DEFAULT", layer: "代码", layer_en: "Code",
    desc: "沙箱默认 danger-full-access（可被 UI 切换，不写死 env） / soft default only",
    file: "base",
    rel: ["cordis.patch.yml"],
    patterns: [
      "mode: !!js process.env.DSH_PERMISSION_MODE ?? 'workspace-write'",
    ],
    replace: "mode: !!js process.env.DSH_PERMISSION_MODE ?? 'danger-full-access'",
    marker: "mode: !!js process.env.DSH_PERMISSION_MODE ?? 'danger-full-access'",
  },
  {
    // policy 与 mode 一起出现，permission-presets 才能对上。
    id: 8, name: "APPROVAL_POLICY_DEFAULT", layer: "代码", layer_en: "Code",
    desc: "审批：danger-full-access → never（与 mode 组合合法） / compose with mode",
    file: "base",
    rel: ["cordis.patch.yml"],
    patterns: [
      "policy: !!js \"(process.env.DSH_PERMISSION_MODE ?? 'workspace-write') " +
      "=== 'danger-full-access' ? 'never' : 'ask'\"",
    ],
    replace:
      "policy: !!js \"(process.env.DSH_PERMISSION_MODE ?? 'danger-full-access') " +
      "=== 'danger-full-access' ? 'never' : 'ask'\"",
    marker:
      "policy: !!js \"(process.env.DSH_PERMISSION_MODE ?? 'danger-full-access') " +
      "=== 'danger-full-access' ? 'never' : 'ask'\"",
```

</details>

**依据 4 · 源码核查**：[lib/patches/engine.mjs:203-230](https://github.com/kingcharleslzy-ai/dsh-purge/blob/126caa2c99297223a7e0e87e604aecfc802f396e/lib/patches/engine.mjs#L203-L230)

文件工具 checkedTarget 的围栏替换

<details>
<summary>查看原文（28行）</summary>

```text
    id: 16, name: "FS_FENCE_DISABLED", layer: "代码", layer_en: "Code",
    desc: "文件系统围栏取消 / fs fence disabled",
    file: "fs-sandbox",
    rel: ["lib", "index.js"],
    patterns: [
      'async checkedTarget(target, sandboxPolicy) {\n' +
      '\t\tconst policy = sandboxPolicy ?? this.ctx.sandboxPolicy.resolve();\n' +
      '\t\tconst { mode } = policy;\n' +
      '\t\tif (mode === "danger-full-access") return target;\n' +
      '\t\tif (mode === "read-only") throw new FsError(`cannot write "${target.displayPath}": file access denied under read-only mode`, "FS_SANDBOX_DENIED");\n' +
      '\t\tconst fresh = await this.resolve(target.displayPath);\n' +
      '\t\tlet contained = false;\n' +
      '\t\tfor (const root of writableRoots(policy)) if (await isPathUnder(fresh.targetKey, root)) {\n' +
      '\t\t\tcontained = true;\n' +
      '\t\t\tbreak;\n' +
      '\t\t}\n' +
      '\t\tif (!contained) throw new FsError(`cannot write "${target.displayPath}": file access denied under workspace-write mode`, "FS_SANDBOX_DENIED");\n' +
      '\t\treturn fresh;\n' +
      '\t}',
    ],
    replace:
      'async checkedTarget(target, sandboxPolicy) {\n' +
      '\t\t// [dsh-purge] filesystem sandbox bypass: the per-call policy fence is\n' +
      '\t\t// disabled — write/edit mutations are never denied regardless of the\n' +
      '\t\t// resolved read-only / workspace-write mode.\n' +
      '\t\treturn target;\n' +
      '\t}',
    marker: "[dsh-purge] filesystem sandbox bypass",
```

</details>

**依据 5 · 源码核查**：[lib/core.js:3441-3459](https://github.com/kingcharleslzy-ai/dsh-purge/blob/126caa2c99297223a7e0e87e604aecfc802f396e/lib/core.js#L3441-L3459)

读取目标及锚点命中数量保护

<details>
<summary>查看原文（19行）</summary>

```text
        let text;
        try {
          text = await loadText(fp);
        } catch {
          lastError = "read_error";
          continue;
        }
        // 启动自愈才跳过。点应用/重启若也跳过，client.js 上的补丁会一直 pending，重启被取消。
        if (preserveClientBundles && isWatchedClientBundle(fp)) {
          if (filePatchSettled(text, p, fp)) already += 1;
          else if (patchHasRemainingWork(text, p, fp) || p.strictFiles) notFound += 1;
          continue;
        }
        const appliedText = applyReplacementsToText(text, p, fp);
        if (appliedText.hitMismatch) {
          // 命中数和 expect 不符：整条拒写，并记录实际数量，避免把不相干的第二处一起改掉。
          notFound += 1;
          lastError = `hit_mismatch:${appliedText.hitMismatch.expected}!=${appliedText.hitMismatch.actual}`;
          continue;
```

</details>

**依据 6 · 源码核查**：[lib/core.js:4462-4473](https://github.com/kingcharleslzy-ai/dsh-purge/blob/126caa2c99297223a7e0e87e604aecfc802f396e/lib/core.js#L4462-L4473)

Web 的提示词提交分流到保存或默认初始化

<details>
<summary>查看原文（12行）</summary>

```text
export async function commitOverrideOnApply(dshHome, incoming) {
  const home = path.normalize(String(dshHome || findDshHome() || ""));
  if (!home) return { action: "skip", reason: "no_home" };
  if (isKeepableUserOverride(home, incoming)) {
    const saved = await saveOverrideContent(home, incoming);
    return { ...saved, action: "saved_user" };
  }
  const seed = seedPromptInjectAtBoot(home);
  try {
    rememberCommittedOverride(home, readPromptInjectFileSync(home) || defaultOverrideText());
  } catch { /* hang 仍会在 refresh 时再钉 */ }
  return seed;
```

</details>

**依据 7 · 源码核查**：[lib/index.js:1777-1787](https://github.com/kingcharleslzy-ai/dsh-purge/blob/126caa2c99297223a7e0e87e604aecfc802f396e/lib/index.js#L1777-L1787)

模型工具先调用初始化与目录清理，随后才检查提示词

<details>
<summary>查看原文（11行）</summary>

```text
      async execute() {
        core.applyRuntimeEnv();
        const scrubbed = core.sanitizeDesktopCommandRuntimes();
        const state = await core.gatherState();
        if (!state.ai_base) return { text: "ERROR: " + core.missingAiBaseMessage() };
        const blocked = rejectIfNeedPrompt(state.dsh_home);
        if (blocked) return { text: "ERROR: " + blocked.error };
        const toolMulti = await core.applyPatchesAllHosts(core.ALL_PATCHES, {
          preserveClientBundles: false,
          forApply: true,
        });
```

</details>

**依据 8 · 源码核查**：[lib/core.js:1409-1436](https://github.com/kingcharleslzy-ai/dsh-purge/blob/126caa2c99297223a7e0e87e604aecfc802f396e/lib/core.js#L1409-L1436)

初始化实际可能改变进程环境

<details>
<summary>查看原文（28行）</summary>

```text
export function applyRuntimeEnv() {
  if (!String(process.env.DSH_HOME || "").trim()) {
    for (const cand of desktopDshHomeGuesses()) {
      if (!isDshHomeDir(cand)) continue;
      process.env.DSH_HOME = cand;
      break;
    }
  }
  // 启动时可能尚未组完依赖；Apply 时清掉失败缓存再探。
  if (memo.ai.ready && !memo.ai.value) memo.ai = { ready: false, value: null };
  if (process.env.DSH_PERMISSION_MODE === "danger-full-access") {
    delete process.env.DSH_PERMISSION_MODE;
  }
  if (!String(process.env.DSH_DESKTOP_INSTALL || "").trim()) {
    try {
      const fp = path.join(findDshHome(), "dsh-purge", "desktop-install.txt");
      if (hostFs.existsSync(fp)) {
        const line = hostFs.readFileSync(fp, "utf8").split(/\r?\n/).map((s) => s.trim()).find(Boolean);
        if (line) process.env.DSH_DESKTOP_INSTALL = line;
      }
    } catch {
      // 非致命
    }
  }
  return {
    DSH_PERMISSION_MODE: process.env.DSH_PERMISSION_MODE || "(unset — UI/session controls mode)",
    DSH_HOME: process.env.DSH_HOME || "",
  };
```

</details>

**依据 9 · 源码核查**：[lib/core.js:4034-4094](https://github.com/kingcharleslzy-ai/dsh-purge/blob/126caa2c99297223a7e0e87e604aecfc802f396e/lib/core.js#L4034-L4094)

目录清理的备份迁移、残留删除和 dsh.cmd 注入剥离

<details>
<summary>查看原文（61行）</summary>

```text
    } else {
      ensureDirSync(path.dirname(external));
      // 原子拷贝,写一半不留烂 external。
      const tmp = `${external}.${process.pid}.${Date.now()}.copytmp`;
      fs.copyFileSync(bak, tmp);
      fs.renameSync(tmp, external);
      externalGood = true;
      cleaned.push(`relocated_bak:${original}`);
    }
  } catch (e) {
    cleaned.push(`relocate_failed:${original}:${e}`);
  }
  if (!externalGood) {
    cleaned.push(`kept_in_bin_bak:${original}`);
    return;
  }
  try {
    fs.unlinkSync(bak);
    cleaned.push(`removed_in_bin_bak:${original}`);
  } catch (e) {
    cleaned.push(`remove_failed:${original}:${e}`);
  }
}

function stripCmdInjectSync(cmdPath, cleaned) {
  if (!(isFile(cmdPath) && isTextShim(cmdPath) && shimIsPatched(cmdPath))) return;
  try {
    fs.writeFileSync(cmdPath, stripShimInject(fs.readFileSync(cmdPath, "utf8")), "utf8");
    cleaned.push("stripped_cmd_inject");
  } catch (e) {
    cleaned.push(`error_strip_cmd:${e}`);
  }
}

export function sanitizeDesktopCommandRuntimes() {
  const report = [];
  for (const dir of listDesktopCommandRuntimeDirs()) {
    const cleaned = [];
    let names = [];
    try {
      names = fs.readdirSync(dir);
    } catch {
      continue;
    }
    for (const name of names) {
      // 只动本插件产生的 bak。
      if (!/\.dshpurge\.bak$/i.test(name) && !/\.dshpurge\./i.test(name)) continue;
      try {
        if (name.toLowerCase().endsWith(".dshpurge.bak")) scrubInBinBak(dir, name, cleaned);
        else {
          fs.unlinkSync(path.join(dir, name));
          cleaned.push(`deleted_artifact:${name}`);
        }
      } catch (e) {
        cleaned.push(`error:${name}:${e}`);
      }
    }
    stripCmdInjectSync(path.join(dir, "dsh.cmd"), cleaned);
    if (cleaned.length) report.push({ dir, cleaned });
  }
  return report;
```

</details>

#### 缺口

- 没有固定宿主运行时及 OS 层写入矩阵。
  **影响**：无法验证每个平台是否命中、是否加载以及主机外层约束。
  **进一步探讨**：用一次性宿主检测应用前后只读及越过工作区的文件工具行为。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 备份失败、锚点偏移与多宿主部分成功怎样呈现？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

循环逐宿主备份并应用。逐文件备份报错阻断当前宿主，先前宿主可能已写。进入单宿主应用后，profile 快照失败记录日志并继续；写入失败记录到补丁结果，前面的写入没有统一回撤。聚合有允许缺失和可选锚点的分支。Web 响应同时有 `ok` 和 `complete`，而模型工具把已应用与已存在计数格式化为“清洗完成”，没有检查剩余失败项。回滚按现有备份逐文件尝试，还原错误单独记录，缺备份的现有文件会跳过。维护者应以目标状态、失败项和恢复核对为准。 因 Web 先提交提示词、失败时记录日志再继续，宿主补丁报告无法单独证实提示词保存结果，恢复也应分别核对两类变更。

#### 证据与依据

**依据 1 · 源码核查**：[lib/core.js:1852-1893](https://github.com/kingcharleslzy-ai/dsh-purge/blob/126caa2c99297223a7e0e87e604aecfc802f396e/lib/core.js#L1852-L1893)

每个宿主先备份再写入的序列

<details>
<summary>查看原文（42行）</summary>

```text
export async function applyPatchesAllHosts(patches = ALL_PATCHES, options = {}) {
  const settings = options.hooksDeny?.settings || getHooksDenySettings();
  const pick = options.hooksDeny?.selectPatches || hooksDeny.selectPatches;
  const selected = pick(patches, settings);
  const hookDenyRestoreFailed = [];
  const hookDenyRestoreChanged = [];
  const hosts = [];
  const seen = new Set();
  for (const raw of enumeratePatchAiBases({ discover: options.forApply === true || options.discover === true })) {
    const aiBase = await resolveAiBaseForApply(raw, options);
    if (!aiBase) continue;
    const key = path.normalize(aiBase).replace(/\\/g, "/").toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const backups = await backupAll(aiBase);
    if (backups.errors.length) {
      const readOnlyLinux = process.platform === "linux" && backups.errors.some(([, error]) => /EACCES|EPERM|EROFS/.test(String(error)));
      const remedy = readOnlyLinux
        ? " Linux 宿主目录不可写。请重新运行 Linux 安装脚本创建用户可写副本，退出当前 DSH，再用 ~/.local/bin/dsh web 启动后应用。无需修改 /usr 权限。"
        : " Check permissions and retry.";
      throw new Error(`Host backup failed (${backups.errors.length} files); patch writes cancelled.${remedy}`);
    }
    if (settings.hooksDenyBypass === false) {
      const restored = await restoreHookDenyForBases([aiBase]);
      hookDenyRestoreFailed.push(...restored.failed);
      hookDenyRestoreChanged.push(...restored.changed);
    }
    const report = await applyPatches(aiBase, selected, options);
    hosts.push({
      aiBase,
      report,
      summary: summarizeApplyReport(report),
      hostWritten: hostCleanMarkersPresent(aiBase),
      flash: silenceCmdFlash(aiBase),
    });
  }
  return {
    hosts,
    report: mergeApplyReports(hosts.map((h) => h.report)),
    hookDenyRestoreFailed,
    hookDenyRestoreChanged,
  };
```

</details>

**依据 2 · 源码核查**：[lib/core.js:3382-3401](https://github.com/kingcharleslzy-ai/dsh-purge/blob/126caa2c99297223a7e0e87e604aecfc802f396e/lib/core.js#L3382-L3401)

profile 快照失败有日志且继续

<details>
<summary>查看原文（20行）</summary>

```text
export async function applyPatches(aiBase, patches = ALL_PATCHES, options = {}) {
  // 每次整份写入前先做一次 profile 级快照。快照失败不阻断：逐文件 .dshpurge.bak 仍在，
  // 但要在日志里留痕，方便事后确认"这次没有 profile 快照"。
  let snapshot = "skipped";
  try {
    const home = findDshHome();
    if (home) {
      snapshot = (await new Maintenance({ home, aiBase }).backup("before-host-patches"))?.id || "done";
    }
  } catch (e) {
    snapshot = `error:${e && e.message ? e.message : e}`;
    console.warn("[dsh-purge] profile snapshot before apply failed:", snapshot);
  }
  restoreMissingOriginalsFromBak(aiBase);
  refreshStaleBaksForUpgrade(aiBase);
  const files = targetFiles(aiBase);
  const report = [];
  const preserveClientBundles = options.preserveClientBundles === true;
  await repairPluginCordisYaml();
  for (const p of patches) {
```

</details>

**依据 3 · 源码核查**：[lib/core.js:3470-3505](https://github.com/kingcharleslzy-ai/dsh-purge/blob/126caa2c99297223a7e0e87e604aecfc802f396e/lib/core.js#L3470-L3505)

单文件保存错误和报告聚合

<details>
<summary>查看原文（36行）</summary>

```text
        if (changed && [17, 61, 93].includes(p.id) && !filePatchSettled(textOut, p, fp)) {
          notFound += 1;
          lastError = p.id === 17 ? "incomplete_observation_policy" : "incomplete_sandbox_policy";
          continue;
        }
        if (changed) {
          try {
            const wrote = await saveText(fp, textOut);
            if (wrote) applied += 1;
            else already += 1;
          } catch (e) {
            lastError = `write_error:${e}`;
          }
          continue;
        }
        if (filePatchSettled(text, p, fp)) {
          already += 1;
        } else if ([17, 61, 93].includes(p.id) || patchHasRemainingWork(text, p, fp) || p.strictFiles) {
          notFound += 1;
        }
      }
    }
    const status = rollupPatchStatus({
      applied, already, missing, notFound, lastError, keyCount: keys.length,
      layoutSoft: isLayoutSoftPatch(p),
      strictFiles: !!p.strictFiles,
    });
    report.push({
      patch_id: p.id,
      name: p.name,
      status,
      path: paths[0] || files[keys[0]],
      applied,
      already,
      missing,
    });
```

</details>

**依据 4 · 源码核查**：[lib/core/verify.mjs:89-128](https://github.com/kingcharleslzy-ai/dsh-purge/blob/126caa2c99297223a7e0e87e604aecfc802f396e/lib/core/verify.mjs#L89-L128)

软状态和严格目标例外

<details>
<summary>查看原文（40行）</summary>

```text
export function rollupPatchStatus({ applied, already, missing, notFound, lastError, keyCount, layoutSoft, strictFiles }) {
  if (strictFiles && lastError) return lastError;
  if (strictFiles && notFound > 0) return "pattern_not_found";
  if (applied > 0) return "applied";
  if (already > 0 && (notFound === 0 || layoutSoft)) return "already";
  if (missing === keyCount) return "missing_file";
  if (lastError) return lastError;
  // 文件在，但这份原文不在：列表里本来就是跳过，不能再把整次应用判失败。
  if (notFound === 0) return "skipped";
  return "pattern_not_found";
}

export const ALWAYS_SOFT_STATUSES = new Set(["applied", "already", "missing_file", "skipped", "na", "off", "disabled"]);

export function patchAppliesHere(patch, surface = detectSurface()) {
  const want = patch?.surfaces;
  if (!Array.isArray(want) || want.length === 0) return true;
  const adapter = adapterFor(surface);
  return want.includes(adapter) || want.includes(surface);
}

export function isPatchResultSoftOk(row, patch = null) {
  if (!row) return false;
  if (ALWAYS_SOFT_STATUSES.has(row.status)) return true;
  const p = patch || ALL_PATCHES.find((x) => x.id === row.patch_id || x.id === row.id);
  if (p?.strictFiles && row.status === "pattern_not_found") return false;
  if (p?.optional && row.status === "pattern_not_found") return true;
  if (isLayoutSoftPatch(p) && row.status === "pattern_not_found") return true;
  return false;
}

export function summarizeApplyReport(report, patches = ALL_PATCHES) {
  const byId = new Map(patches.map((p) => [p.id, p]));
  const failed = [];
  const soft = [];
  for (const row of report) {
    const patch = byId.get(row.patch_id) || byId.get(row.id);
    if (isPatchResultSoftOk(row, patch)) soft.push(row);
    else failed.push(row);
  }
```

</details>

**依据 5 · 源码核查**：[lib/index.js:1784-1795](https://github.com/kingcharleslzy-ai/dsh-purge/blob/126caa2c99297223a7e0e87e604aecfc802f396e/lib/index.js#L1784-L1795)

模型工具仅统计 applied、already

<details>
<summary>查看原文（12行）</summary>

```text
        const toolMulti = await core.applyPatchesAllHosts(core.ALL_PATCHES, {
          preserveClientBundles: false,
          forApply: true,
        });
        await core.patchAllShims();
        const flash = core.silenceCmdFlash(toolMulti.hosts[0]?.aiBase || state.ai_base);
        const report = toolMulti.report;
        const applied = report.filter((r) => r.status === "applied").length;
        const already = report.filter((r) => r.status === "already").length;
        const scrubNote = scrubbed.length ? ` desktop_scrub=${scrubbed.length}` : "";
        return { text: `清洗完成 / applied=${applied}, already=${already}.${scrubNote} phase-1=${flash.phase1} 重启 dsh 生效.` };
      },
```

</details>

**依据 6 · 源码核查**：[lib/index.js:2357-2376](https://github.com/kingcharleslzy-ai/dsh-purge/blob/126caa2c99297223a7e0e87e604aecfc802f396e/lib/index.js#L2357-L2376)

Web 成功包与完整性状态分开

<details>
<summary>查看原文（20行）</summary>

```text
            sendJson(response, 200, {
              ok: true,
              complete,
              restarting: false,
              manualQuit: Boolean(manualHandoff),
              handoff: manualHandoff?.handoff || null,
              restart_after_apply: shouldRestart,
              unpacked_asar: shouldRestart,
              needs_full_quit: shouldRestart,
              asar_still_sealed: sealedNow,
              asar_swap_started: Boolean(manualHandoff),
              applied: summary.applied,
              already: summary.already,
              failed: summary.failed.length,
              failed_items: summary.failed.map((r) => ({
                id: r.patch_id,
                name: r.name,
                status: r.status,
              })),
              report: report.map((r) => ({ id: r.patch_id, name: r.name, status: r.status })),
```

</details>

**依据 7 · 源码核查**：[lib/core.js:2690-2734](https://github.com/kingcharleslzy-ai/dsh-purge/blob/126caa2c99297223a7e0e87e604aecfc802f396e/lib/core.js#L2690-L2734)

逐文件恢复、用户配置保护和缺备份跳过

<details>
<summary>查看原文（45行）</summary>

```text
export async function revertAll(aiBase, options = {}) {
  const errors = [];
  restoreMissingOriginalsFromBak(aiBase, {errors});
  const files = targetFiles(aiBase);
  const reverted = [];
  const skipped = [];
  const preservedUser = [];
  const preserveClientBundles = options.preserveClientBundles === true;
  for (const fp of flattenTargetPaths(files)) {
    const bak = fp + ".dshpurge.bak";
    if (errors.some(([file]) => file === fp)) continue;
    // 启动自愈不能把前端 client.js 盖回去：copyFile 即使字节相同也会改 mtime（#63）。
    if (preserveClientBundles && isWatchedClientBundle(fp)) {
      skipped.push(fp);
      continue;
    }
    // 用户 patch 层：有 bak 也只丢掉 bak，绝不 copy 回去（#43）。
    if (isUserProfilePatchFile(fp)) {
      if (fs.existsSync(bak)) {
        try {
          await fsp.unlink(bak);
          preservedUser.push(fp);
        } catch (e) {
          errors.push([fp, String(e)]);
        }
      }
      continue;
    }
    if (fs.existsSync(bak)) {
      try {
        if (fs.lstatSync(bak).isFile() && fs.statSync(bak).size > 0 && fs.existsSync(fp) && await sameFileBytes(fp, bak)) {
          skipped.push(fp);
          continue;
        }
        await restoreBackupFile(fp, bak);
        await fsp.unlink(bak);
        reverted.push(fp);
      } catch (e) {
        errors.push([fp, String(e)]);
      }
      continue;
    }
    // 没有 bak 时绝不删除目标。源码部署的构建产物缺备份时，删了无法自愈（#41）。
    if (fs.existsSync(fp)) skipped.push(fp);
  }
```

</details>

**依据 8 · 源码核查**：[lib/index.js:2300-2308](https://github.com/kingcharleslzy-ai/dsh-purge/blob/126caa2c99297223a7e0e87e604aecfc802f396e/lib/index.js#L2300-L2308)

提示词保存和宿主补丁的分步失败边界

```text
            try {
              await core.commitOverrideOnApply(state.dsh_home, incoming);
            } catch (e) {
              console.warn("[dsh-purge] apply override:", String(e && e.message ? e.message : e));
            }
            const httpMulti = await core.applyPatchesAllHosts(core.ALL_PATCHES, {
              preserveClientBundles: false,
              forApply: true,
            });
```

#### 缺口

- 尚未模拟第二宿主失败及回滚失败。
  **影响**：不能确认某个备份组合能重建真实实例及会话环境。
  **进一步探讨**：让第二宿主在锚点或写入处失败，逐文件比较状态和恢复哈希。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪些条件决定采用成本？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

Node、Cordis、可写且版本布局适配的 DSH 实例是前提。兼容声明含 `unknown`，成功安装之后仍要验明活动进程加载哪份宿主。安装及升级负责人先记录宿主目标和独立备份，持续复核权限行为、应用结果和重启，失败时核对逐文件恢复错误与重启后的实际权限。只需要只读状态或不能承担全量恢复的维护者宜留在观察，出现快照失败、任一目标失败或权限超出可接受范围即停止，在已知干净副本恢复或回到原生配置。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:98-126](https://github.com/kingcharleslzy-ai/dsh-purge/blob/126caa2c99297223a7e0e87e604aecfc802f396e/package.json#L98-L126)

打包位置、逐版兼容声明、peer 和 Node 条件

<details>
<summary>查看原文（29行）</summary>

```text
    "install": {
      "preferred": "tarball",
      "tarball": "https://github.com/kingcharleslzy-ai/dsh-purge/releases/download/v1.6.86/dsh-purge-community-1.6.86.tgz",
      "git": "https://github.com/kingcharleslzy-ai/dsh-purge.git"
    },
    "compatibility": {
      "dsh": ">=0.2.1-rc.1 <0.3.0",
      "profiles": [
        "desktop",
        "web"
      ],
      "dshReleases": {
        "0.2.1-rc.1": "compatible",
        "0.2.1-rc.2": "compatible",
        "0.2.1-rc.3": "compatible",
        "0.2.1-rc.4": "unknown",
        "0.2.1-rc.5": "compatible",
        "0.2.2-alpha.2": "unknown"
      }
    }
  },
  "publishConfig": {
    "access": "public"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1"
  },
  "engines": {
    "node": ">=18"
```

</details>

**依据 2 · 作者声明**：[README.md:149-156](https://github.com/kingcharleslzy-ai/dsh-purge/blob/126caa2c99297223a7e0e87e604aecfc802f396e/README.md#L149-L156)

作者区别安装、备份及活动进程重启

```text
### 安装会改什么，以及怎么确认

- 社区安装器在迁移前备份，调用当前实例的官方 `dsh plugin --profile … add …`，再核对安装版本和入口；保留提示词、规则、更新偏好及其他插件设置。
- **不是“完全不碰宿主目录”**：解包桌面布局缺失/损坏 `app/runtime` 链接时，会保留旧链接并修复到该安装的 runtime；冲突则停止。Linux 系统宿主只读时可能创建用户副本，并在成功后切换用户启动器。详见[安装指南](docs/INSTALLATION.md)。
- 插件加载前若市场安装失败（issue #7），插件本身尚未运行；先读脱敏错误、核对依赖来源，不能承诺安装器能修复所有市场或网络错误。
- 不自动应用宿主补丁、不自动重启、不改代理、不修改全局 npm 源或清空缓存。脚本和 bootstrap 从本仓库 `master` 下载；Release 包另做 SHA256 校验，这不是对下载脚本的独立签名验证。
- 命令退出码非零就视为失败。安装成功后记录 `backup_id`，核对磁盘版本；运行中的 DSH 仍可能显示旧版，待用户方便时手动退出重开。`dry-run` 成功、备份存在或市场卡片出现都不能替代安装成功证据。
- 回滚优先用「Purge → 状态 → 本机备份」，选择本次安装前的备份；无界面时按[安装指南中的 CLI 回滚](docs/INSTALLATION.md#cli-rollback)执行。不要假设 `purge-community` 已加入系统 PATH。
```

**依据 3 · 源码核查**：[bin/dsh-purge.js:105-131](https://github.com/kingcharleslzy-ai/dsh-purge/blob/126caa2c99297223a7e0e87e604aecfc802f396e/bin/dsh-purge.js#L105-L131)

CLI 不完整与回滚失败报告

<details>
<summary>查看原文（27行）</summary>

```text
    if (failed) {
      console.error("应用未完成 / Apply incomplete. 请处理上述错误；重启不能修复写入失败。");
      process.exitCode = 1;
    } else console.log("全部完成 / All done。重启 dsh 生效 / Restart dsh to take effect.");
  } else if (mode === "--revert") {
    let failed = false;
    if (state.ai_base || hostCore.enumeratePatchAiBases().length) {
      const { reverted, errors } = await hostCore.revertAllHosts();
      if (errors.length) failed = true;
      for (const p of reverted) console.log(`  ✓ 已还原 / Reverted ${p}`);
      for (const [p, e] of errors) console.log(`  ⚠ 还原失败 ${p}: ${e}`);
      if (reverted.length === 0) console.log("  - 没有补丁备份可还原 / no patch backup");
    }
    if (state.shim_dir) {
      const r = await hostCore.revertShim(state.shim_dir);
      for (const [fname, st] of Object.entries(r)) {
        if (typeof st === "string" && /^error:/.test(st)) failed = true;
        if (st === "reverted" || st === "stripped_inject") console.log(`  ✓ shim ${fname}: ${st}`);
        else console.log(`  - shim ${fname}: ${st}`);
      }
    }
    console.log("");
    if (failed) {
      console.error("回滚未完成 / Revert incomplete. 原文件与失败备份保留，请处理上述错误。");
      process.exitCode = 1;
    } else console.log("回滚完成 / Revert done。重启 dsh 后恢复 / restart to restore.");
    console.log("注: prompt-inject.md 保留（用户文件）/ prompt-inject.md kept (user file)");
```

</details>

#### 缺口

- 没有升级、重启与权限复验的人时。
  **影响**：不可估算每次更新的人力及停机。
  **进一步探讨**：在副本分别计首次核对、一次升级以及强制恢复的时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 逐宿主预检和恢复演练能否减少不可恢复状态？

**研究主题**：新假设与验证

#### 完整回答

提出可证伪对照。在同一隔离测试中准备两个已知哈希的宿主副本，给第二副本设置唯一一处不匹配的锚点或受控写入错误。记录原流程的已修改文件数、失败被哪些入口显示、重建恢复人时。再加入写前全目标备份与锚点预检，重复同样故障。若跨宿主变化没有减少或预检人时抵消恢复收益，假设不成立。另在重启后用无敏感内容的临时文件验证许可模式行为。

#### 证据与依据

**依据 1 · 源码核查**：[lib/core.js:1860-1885](https://github.com/kingcharleslzy-ai/dsh-purge/blob/126caa2c99297223a7e0e87e604aecfc802f396e/lib/core.js#L1860-L1885)

每宿主顺序是失败注入的来源

<details>
<summary>查看原文（26行）</summary>

```text
  for (const raw of enumeratePatchAiBases({ discover: options.forApply === true || options.discover === true })) {
    const aiBase = await resolveAiBaseForApply(raw, options);
    if (!aiBase) continue;
    const key = path.normalize(aiBase).replace(/\\/g, "/").toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const backups = await backupAll(aiBase);
    if (backups.errors.length) {
      const readOnlyLinux = process.platform === "linux" && backups.errors.some(([, error]) => /EACCES|EPERM|EROFS/.test(String(error)));
      const remedy = readOnlyLinux
        ? " Linux 宿主目录不可写。请重新运行 Linux 安装脚本创建用户可写副本，退出当前 DSH，再用 ~/.local/bin/dsh web 启动后应用。无需修改 /usr 权限。"
        : " Check permissions and retry.";
      throw new Error(`Host backup failed (${backups.errors.length} files); patch writes cancelled.${remedy}`);
    }
    if (settings.hooksDenyBypass === false) {
      const restored = await restoreHookDenyForBases([aiBase]);
      hookDenyRestoreFailed.push(...restored.failed);
      hookDenyRestoreChanged.push(...restored.changed);
    }
    const report = await applyPatches(aiBase, selected, options);
    hosts.push({
      aiBase,
      report,
      summary: summarizeApplyReport(report),
      hostWritten: hostCleanMarkersPresent(aiBase),
      flash: silenceCmdFlash(aiBase),
```

</details>

**依据 2 · 源码核查**：[lib/core.js:3441-3459](https://github.com/kingcharleslzy-ai/dsh-purge/blob/126caa2c99297223a7e0e87e604aecfc802f396e/lib/core.js#L3441-L3459)

已存在的单目标锚点保护

<details>
<summary>查看原文（19行）</summary>

```text
        let text;
        try {
          text = await loadText(fp);
        } catch {
          lastError = "read_error";
          continue;
        }
        // 启动自愈才跳过。点应用/重启若也跳过，client.js 上的补丁会一直 pending，重启被取消。
        if (preserveClientBundles && isWatchedClientBundle(fp)) {
          if (filePatchSettled(text, p, fp)) already += 1;
          else if (patchHasRemainingWork(text, p, fp) || p.strictFiles) notFound += 1;
          continue;
        }
        const appliedText = applyReplacementsToText(text, p, fp);
        if (appliedText.hitMismatch) {
          // 命中数和 expect 不符：整条拒写，并记录实际数量，避免把不相干的第二处一起改掉。
          notFound += 1;
          lastError = `hit_mismatch:${appliedText.hitMismatch.expected}!=${appliedText.hitMismatch.actual}`;
          continue;
```

</details>

**依据 3 · 源码核查**：[lib/index.js:2357-2376](https://github.com/kingcharleslzy-ai/dsh-purge/blob/126caa2c99297223a7e0e87e604aecfc802f396e/lib/index.js#L2357-L2376)

Web 失败项是候选测量指标

<details>
<summary>查看原文（20行）</summary>

```text
            sendJson(response, 200, {
              ok: true,
              complete,
              restarting: false,
              manualQuit: Boolean(manualHandoff),
              handoff: manualHandoff?.handoff || null,
              restart_after_apply: shouldRestart,
              unpacked_asar: shouldRestart,
              needs_full_quit: shouldRestart,
              asar_still_sealed: sealedNow,
              asar_swap_started: Boolean(manualHandoff),
              applied: summary.applied,
              already: summary.already,
              failed: summary.failed.length,
              failed_items: summary.failed.map((r) => ({
                id: r.patch_id,
                name: r.name,
                status: r.status,
              })),
              report: report.map((r) => ({ id: r.patch_id, name: r.name, status: r.status })),
```

</details>

#### 缺口

- 没有执行故障注入。
  **影响**：无法量化预检收益或保证回滚有效。
  **进一步探讨**：固定两份副本，在第二份做一处非匹配锚点，先比较应用后宿主差异和两入口输出。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
