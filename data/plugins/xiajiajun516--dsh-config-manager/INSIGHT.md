# Config Manager

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[f1fb06b](https://github.com/xiajiajun516/dsh-config-manager/tree/f1fb06b3560a0ed4fe79a6be39372ddff5ce6f73)

<!-- BEGIN META -->
[![GitHub ★ 265](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=265&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/xiajiajun516/dsh-config-manager) [![npm 30d 19,037](https://img.shields.io/static/v1?label=npm+30d&message=19%2C037&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-config-manager) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-config-manager)
<!-- END META -->

> **功能**：将 DSH 配置和部分会话整理为可预览迁移包，提供逐项计划、快照恢复、可选凭据加密及同步入口。

> **亮点**：计划/执行分离、写前快照绑定、外部项不明与结构化secret处理形成迁移控制面，见 [Q02](#research-q02) 和 [Q03](#research-q03)。

> **主要限制**：默认逐项失败不触发全局回滚，文件类secret只告警不脱敏，redactedHits可含未改写命中；安全远端上传和可逆迁移不能由名字/流程推导，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

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
  - [Q01 · 迁移对象与产品范围，哪些是实际增量？](#detail-section-11)
  - [Q02 · 预览、确认、快照、执行和回滚是否等同全局事务？](#detail-section-12)
  - [Q03 · 默认排除密钥、凭据加密与文件内容安全怎么区分？](#detail-section-13)
  - [Q04 · 采用条件、成本与可证伪方向是什么？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：迁机与多环境维护者可审阅分区配置和路径映射，任务合格要再核外部依赖及重启结果，见 [Q01](#research-q01)。

手工复制目录和重装工具。插件增量在标准分区包、冲突计划、映射与恢复记录；系统进程、完整机器和所有外部工具状态不随配置自动恢复。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| 标准包 | 分区导出与校验 | 非整机镜像 |
| 导入计划 | 冲突、路径和逐项执行 | 默认失败不整体回滚 |
| 安全处理 | 结构剥值与凭据可选加密 | 文件原样只告警 |
| 恢复 | 快照/journal/重启提示 | 外部副作用非全局事务 |

**流程与依赖**

| 条件 | 用途 | 边界 |
|---|---|---|
| 匹配DSH/Node与文件权限 | Host API、分区和落盘 | 插件/CLI入口不等兼容实证 |
| 外部插件/MCP/路径/模型 | 目标环境运行 | 包配置不恢复所有外部状态 |
| Snapshot/Journal/锁适配 | 计划执行与恢复 | 外部副作用仍需人工核 |
| 强化scanner/密码 | 脱敏告警与可选加密 | 文件只告警，空密码拒绝非强度保证 |
| 远端账号与网络 | 同步通道 | 本轮未完整核载荷与权限 |

| 阶段 | 动作 | 判据 |
|---|---|---|
| 导出 | 选分区和安全选项 | 审真实文件、告警及加密范围 |
| 计划 | 分析冲突、路径、依赖 | 用户逐项核目标 |
| 执行 | confirm后先快照再应用 | 结果含failed/warning/部分保留 |
| 恢复 | 按策略/取消和journal处理 | 不假定外部效果原子撤销 |
| 验收 | 重启并跑实际任务 | 格式可读不是迁移合格 |

**效果与成本**

| 阶段 | 现金与资源 | 人工与时间 |
|---|---|---|
| 首次 | 备份/密码保管成本未知 | 选择分区、路径、依赖与安全审阅 |
| 持续 | ZIP/快照/vault/远端存储未知 | 保留策略、多适配器与宿主升级 |
| 故障 | 部分写与外部包资源未知 | 逐项核journal、盘面、回滚和重启 |
| 退出 | 远端副本另管 | 已改配置/包不随卸载撤销 |

| 项目 | 已支持机制 | 未知 |
|---|---|---|
| 可审阅迁移 | 计划、确认与写前快照 | 全部适配器任务合格率 |
| 密钥处理 | 结构剥值/文件告警/可选密文 | 明文漏报与完整远端安全 |
| 恢复 | journal及部分保留状态 | 全局外部撤销、节时节费 |

> **思考**：默认逐项失败不触发全局回滚，文件类secret只告警不脱敏，redactedHits可含未改写命中；安全远端上传和可逆迁移不能由名字/流程推导，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：计划/执行分离、写前快照绑定、外部项不明与结构化secret处理形成迁移控制面，见 [Q02](#research-q02) 和 [Q03](#research-q03)。

[Q02](#research-q02) 写前绑定、外部needs-attention值得借鉴；[Q03](#research-q03) 扫描与剥值计数需对读者明确，不能以redacted命名掩盖原样文件。

<a id="detail-section-5"></a>

### 1.4 主要限制

默认逐项失败不触发全局回滚，文件类secret只告警不脱敏，redactedHits可含未改写命中；安全远端上传和可逆迁移不能由名字/流程推导，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察为主，只在无真实秘密的本机副本先核导出/计划，全部安全与恢复边界清楚后再决定重要配置和远端试验，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

代表导出/计划/执行与加密源码已核，建议观察及合成副本验证；未执行迁移、修复、同步或加密实验。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/core/analyzer.ts、src/core/exporter.ts、src/core/importer.ts、src/index.ts、src/security/encryption.ts、src/sync/sync-engine.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整根统计，抽读public入口、Importer/Analyzer核心、Exporter、生产scanner来源、凭据加密与同步禁止明文条件；未全审所有适配器、远端通道、foreign/rewind/修复/路由安全。
- 下一步：合成秘密与副本核默认/加密/文件告警及vault，导入故障注入快照、逐项、取消、重启和外部命令；核盘面/journal与真实任务结果。本轮无运行证据。

**分析版本**

- **仓库**：[xiajiajun516/dsh-config-manager](https://github.com/xiajiajun516/dsh-config-manager)
- **版本号**：0.2.0（[固定提交 f1fb06b](https://github.com/xiajiajun516/dsh-config-manager/tree/f1fb06b3560a0ed4fe79a6be39372ddff5ce6f73)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

分开真实剥值/文件命中并标每项快照与外部不明，验证能否减少安全及恢复误判；未实现需求未知，见 [Q04](#research-q04)。

合成秘密与副本核默认/加密/文件告警及vault，导入故障注入快照、逐项、取消、重启和外部命令；核盘面/journal与真实任务结果。本轮无运行证据。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 60 | 17559 | — | — | 398239 |
| .mjs | source | 7 | 933 | 710 | 174 | — |
| .md | test | 7 | 2927 | — | — | 53520 |
| .ts | test | 464 | 125039 | 100878 | 13893 | — |
| .ts | source | 419 | 144871 | 96892 | 39495 | — |
| .tsx | source | 79 | 24882 | 18895 | 5423 | — |
| .md | example | 26 | 181 | — | — | 2065 |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/xiajiajun516/dsh-config-manager/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 40](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=40&color=737b86&logo=github)](https://github.com/xiajiajun516/dsh-config-manager/issues?q=is%3Aissue+created%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z) [![近30天关闭 40](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=40&color=737b86&logo=github)](https://github.com/xiajiajun516/dsh-config-manager/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核配置迁移审阅/执行/恢复与密钥处理的代表链，避免把一键迁移或扫描计数当完整安全与可逆保证。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 迁移对象与产品范围，哪些是实际增量？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

dsh-config-manager 0.2.0是原生DSH插件，也提供dcm CLI及core/schema导出。面向迁机或维护多环境的DSH用户，将设置、插件、MCP、Skills和部分会话/工作区整理为标准包，再在目标环境预览冲突和映射路径。相较直接复制DSH目录或手工重装，增量是适配器分区、内容校验、可审阅计划、快照/恢复和迁移记录；插件功能与工具权限仍由宿主/外部依赖提供。README的多来源、市场、同步、rewind属于宽产品主张，本轮重点核公共配置导出/导入，不以数量证明全覆盖。

配置包不是整台机器镜像。README明确启动栈profile不属普通备份，profile管理是另入口；跨机路径映射不安装外部命令/恢复进程，也不证明所有插件运行效果。需要匹配Node、DSH宿主API与文件权限，目标插件/MCP依赖、模型凭据、系统路径要单独核。包可读只证明格式，只有重启后对应任务合格才算迁移成功。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-5](https://github.com/xiajiajun516/dsh-config-manager/blob/f1fb06b3560a0ed4fe79a6be39372ddff5ce6f73/package.json#L2-L5)

版本与功能定位。

```text
  "name": "dsh-config-manager",
  "version": "0.2.0",
  "license": "MIT",
  "description": "Backup, restore, export, import, migrate and sync your DeepSeek Harness (DSH) configuration: settings, plugins, MCP servers, skills, agent presets and workspaces. One-click migration to another machine. DSH 配置一键备份、恢复、导出、导入、迁移与同步插件。",
```

**依据 2 · 源码核查**：[package.json:32-61](https://github.com/xiajiajun516/dsh-config-manager/blob/f1fb06b3560a0ed4fe79a6be39372ddff5ce6f73/package.json#L32-L61)

Node、CLI/core/schema/client出口。

<details>
<summary>查看原文（30行）</summary>

```text
    "node": "^22.19.0 || >=24.0.0"
  },
  "main": "./lib/index.js",
  "types": "./lib/index.d.ts",
  "bin": {
    "dsh-config-manager": "./lib/cli/index.js",
    "dcm": "./lib/cli/index.js"
  },
  "exports": {
    ".": {
      "types": "./lib/index.d.ts",
      "default": "./lib/index.js"
    },
    "./core": {
      "types": "./lib/core/index.d.ts",
      "default": "./lib/core/index.js"
    },
    "./schema": {
      "types": "./lib/schema/index.d.ts",
      "default": "./lib/schema/index.js"
    },
    "./client": {
      "types": "./lib/client.d.ts",
      "default": "./lib/client.js"
    },
    "./package.json": "./package.json",
    "./locale/*.json": "./locale/*.json"
  },
  "dsh": {
    "bundle": {
```

</details>

**依据 3 · 源码核查**：[README.md:48-62](https://github.com/xiajiajun516/dsh-config-manager/blob/f1fb06b3560a0ed4fe79a6be39372ddff5ce6f73/README.md#L48-L62)

配置包/宿主profile与路径/同步主张。

<details>
<summary>查看原文（15行）</summary>

```text
### Backup DeepSeek Harness configuration

Create a portable backup of your DSH settings, model providers, plugins, MCP servers, skills, agent presets and workspace — one ZIP file, no secret values included by default. (DSH's own profiles — `$DSH_HOME/profiles/<name>`, i.e. which plugin stack to boot — are machine-local and are **not** part of the backup; the **Environment → Profiles** view manages them instead — list / create / rename / delete, plus launching or stopping an independent instance for one.)

### Restore DeepSeek Harness on another machine

Export your current DSH environment as a single ZIP and import it on a new Windows, macOS or Linux machine. One click brings back settings, plugins, MCP servers, skills and global instructions (AGENTS.md).

### Migrate DSH configuration to a new computer

Move your complete DeepSeek Harness setup without manually reinstalling plugins, MCP servers and skills. Dead absolute paths are detected and remapped automatically (batch prefix mapping supported).

### Sync DSH configuration across machines

Keep portable configuration synchronized between machines through a private Git repository, WebDAV, an S3-compatible object store (AWS S3 / Alibaba OSS / Tencent COS / MinIO / Qiniu Kodo) or GitHub Gist — secrets do not sync by default (the payload is run through the SecretScanner); check "Export secrets" with an encryption password and `~/.dsh/.credentials.yaml` travels as scrypt + AES-256-GCM ciphertext inside the encrypted snapshot, so another machine can restore the credentials while the remote (Git host / WebDAV / object store / Gist) only ever sees ciphertext.
```

</details>

**依据 4 · 源码核查**：[src/core/importer.ts:1-17](https://github.com/xiajiajun516/dsh-config-manager/blob/f1fb06b3560a0ed4fe79a6be39372ddff5ce6f73/src/core/importer.ts#L1-L17)

标准导入分段门面。

<details>
<summary>查看原文（17行）</summary>

```text
/**
 * Importer 门面：封装导入 14 步流程（规范 §9），委托 Analyzer 三段式。
 *
 *  1 选 ZIP → 2 校验 ZIP → 3 读 manifest → 4 完整性 → 5 schema → 6 兼容
 *  → 7 扫描 → 8 ImportPlan → 9 Preview(Dry Run) → 10 用户确认
 *  → 11 快照 → 12 执行 → 13 校验 → 14 结果（失败则回滚）
 *
 * 安全阀：executeImportPlan 必须显式 confirm，否则拒绝（ImportNotConfirmedError）。
 * Dry Run：analyzeImport / createImportPlan 零写入（ZIP 全程内存解析，不进磁盘）。
 */
import type { ZipArchive, ZipSafetyLimits } from '../utils/zip.ts';
import type { MsgFunc } from './messages.ts';
import { Analyzer } from './analyzer.ts';
import type { PlanItemProgress } from './analyzer.ts';
import type { BootSafetyReport } from './boot-safety.ts';
import type {
  ConfigAdapter, HostContext, ImportAnalysis, ImportDecisions, ImportPlan,
```

</details>

#### 缺口

- 未逐分区、迁移来源和宿主版本验收。
  **影响**：不由代表源码推导所有适配器、远端通道或恢复结果。
  **进一步探讨**：选最小本机副本和另一测试目标，核配置差异、外部依赖与重启后任务，不用市场/分区数量验收。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 预览、确认、快照、执行和回滚是否等同全局事务？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

Importer把分析、createImportPlan和execute分开；门面声明前两者内存解析不落盘，执行会重新加载归档，再要求confirm===true。Analyzer在首项副作用前创建目标快照，若生产宿主提供snapshotBinding则绑定journal再markApplying；文件项登记指纹，外部项按不可证明处理needs-attention。这是真正的可审阅迁移与恢复工程，不是简单解压覆盖。

但不是全局事务：ExecuteOptions.rollbackOnError默认false，单项失败如实记录后继续；finalize也能产生warning、failed和needsRestart。取消只在安全边界处理，可选择保留部分，缺省/异常走回滚；保留分支保有快照供手工回滚。源码存在快照和回滚不证明外部安装、远端写或所有适配器副作用都能原子撤销。UI/API的confirm布尔只是一道执行门，不等于证明每项意图正确，用户仍须审阅目标、冲突和路径。失败、部分保留、待重启和恢复不明必须分别核对，不能把流程结束当环境恢复成功。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/importer.ts:35-58](https://github.com/xiajiajun516/dsh-config-manager/blob/f1fb06b3560a0ed4fe79a6be39372ddff5ce6f73/src/core/importer.ts#L35-L58)

显式confirm、默认非整体回滚、边界取消。

<details>
<summary>查看原文（24行）</summary>

```text
}

export interface ExecuteOptions {
  /** 用户确认（UI 收集）；非 true 一律拒绝执行 */
  confirm: boolean;
  /** 用户补录的秘密值（仅内存） */
  secretInputs?: Record<string, string>;
  /** 加密备份解密结果（仅内存；解密必须经 m4 encryption provider） */
  decryptedCredentials?: Map<string, string>;
  /** 任一项失败立即整体回滚（默认 false：单项失败如实记录并继续其余项） */
  rollbackOnError?: boolean;
  /** m1：每完成一个计划项的进度回调（透传给 Analyzer；不传则无埋点） */
  onItem?: (info: PlanItemProgress) => void;
  /** m1：每开始一个计划项的进度回调（供 UI 显示「正在执行项 X」/ 判定跳过按钮；不传则无埋点） */
  onItemStart?: (info: { adapter: SectionId; index: number; total: number; detail: string }) => void;
  /** 执行日志回调（逐计划项操作 + 子进程命令行，仅非敏感文本；透传给 Analyzer → ImportContext） */
  onLog?: (line: string) => void;
  /** Phase 4 生产 journal↔snapshot 绑定（deferred；透传给 Analyzer；不传 = 无 journal 绑定） */
  snapshotBinding?: TransactionSnapshotContext;
  /** 用户终止信号（透传给 Analyzer；只在计划项边界生效，见 analyzer.executeImportPlan） */
  cancelSignal?: AbortSignal;
  /** 安全点询问用户如何处置已应用部分（透传；缺省/抛错一律按 rollback 安全侧） */
  onCancelDecision?: () => Promise<'rollback' | 'keep'>;
  /** 「保留已应用项」分支的启动自洽审计（透传；不传 = 未审计，结果里如实标注） */
```

</details>

**依据 2 · 源码核查**：[src/core/importer.ts:73-106](https://github.com/xiajiajun516/dsh-config-manager/blob/f1fb06b3560a0ed4fe79a6be39372ddff5ce6f73/src/core/importer.ts#L73-L106)

分析/计划/execute门面接线。

<details>
<summary>查看原文（34行）</summary>

```text
   */
  analyzeImport(
    zipPath: string,
    opts: { decryptedCredentials?: Map<string, string> } = {},
  ): Promise<ImportAnalysis> {
    return this.analyzer.analyzeImport(zipPath, opts);
  }

  /**
   * 步骤 9：Dry Run / Preview —— 合并用户冲突决策与路径映射，输出最终可执行计划（零写入）。
   * `opts.decryptedCredentials`（仅内存）= 宿主已用备份密码解开的凭据：**参与计划生成**，
   * 让「归档里有值」的凭据都进计划（否则它们永远不会被写回，见 Analyzer.createImportPlan）。
   */
  createImportPlan(
    zipPath: string,
    decisions: ImportDecisions,
    opts: { decryptedCredentials?: Map<string, string> } = {},
  ): Promise<ImportPlan> {
    return this.analyzer.createImportPlan(zipPath, decisions, opts);
  }

  /** 步骤 10-14：确认 → 快照 → 执行 → 校验 → 结果；失败可整体回滚并如实报告 */
  executeImportPlan(zipPath: string, plan: ImportPlan, opts: ExecuteOptions): Promise<ImportResult> {
    return this.analyzer.executeImportPlan(zipPath, plan, {
      confirm: opts.confirm,
      secretInputs: opts.secretInputs,
      decryptedCredentials: opts.decryptedCredentials,
      rollbackOnError: opts.rollbackOnError,
      onItem: opts.onItem,
      onItemStart: opts.onItemStart,
      onLog: opts.onLog,
      snapshotBinding: opts.snapshotBinding,
      cancelSignal: opts.cancelSignal,
      onCancelDecision: opts.onCancelDecision,
```

</details>

**依据 3 · 源码核查**：[src/core/analyzer.ts:890-898](https://github.com/xiajiajun516/dsh-config-manager/blob/f1fb06b3560a0ed4fe79a6be39372ddff5ce6f73/src/core/analyzer.ts#L890-L898)

执行重读和确认门。

```text
    // （校验通过之后、真正写盘之前归档被换掉，是这条路径必须自己关掉的窗口）。
    const bundle = await this.loadBundle(zipPath, 'refresh');
    const analyzed = await this.analyzeBundle(bundle);
    applyMappingsToSections(analyzed.sections, plan.pathMappings, this.fileCollectionIds());

    // 10. 用户确认（安全阀：不确认绝不动数据）
    if (opts.confirm !== true) {
      throw new ImportNotConfirmedError(this.msg);
    }
```

**依据 4 · 源码核查**：[src/core/analyzer.ts:921-945](https://github.com/xiajiajun516/dsh-config-manager/blob/f1fb06b3560a0ed4fe79a6be39372ddff5ce6f73/src/core/analyzer.ts#L921-L945)

快照先行、journal绑定、外部不可证明。

<details>
<summary>查看原文（25行）</summary>

```text
    // 11. 快照（强制：导入前必须先备份将被修改的目标）。
    //     Phase 4：宿主注入 snapshotBinding 时，把 op-bound 元数据写入快照，并立即绑定 journal
    //     （SNAPSHOT_CREATED），保证「快照 durable+verified 且 journal 已知」先于首个 mutation。
    const snapshot = await createSnapshot({
      ctx: this.ctx,
      plan,
      sourceZip: zipPath,
      store: this.snapshotStore,
      adapters: this.adapters,
      operationId: opts.snapshotBinding?.operationId,
      operationType: opts.snapshotBinding?.operationType,
      environmentFingerprint: opts.snapshotBinding?.environmentFingerprint,
      ownerInstanceId: opts.snapshotBinding?.ownerInstanceId,
    });
    if (opts.snapshotBinding !== undefined) {
      await opts.snapshotBinding.bindSnapshot(snapshot.id);
      // 首个 destructive side effect 前：SNAPSHOT_CREATED→APPLYING（在首个 applyOne 之前调 markApplying）
      await opts.snapshotBinding.markApplying();
    }

    // P2-B（Phase 8）：逐计划项 WAL 预登记。将产生真实 side effect 的项在 apply 之前
    // 记为 planned（文件类带 beforeFp），使 crash 中途可按「仍 planned ⇒ 未应用」保守判定；
    // 非文件项 external=true（不可证明 → reconcile 恒 needs-attention，安全边界不放宽）。
    const sb = opts.snapshotBinding;
    const beforeFpByItem = new Map<string, string | null>();
```

</details>

**依据 5 · 源码核查**：[src/core/analyzer.ts:1033-1051](https://github.com/xiajiajun516/dsh-config-manager/blob/f1fb06b3560a0ed4fe79a6be39372ddff5ce6f73/src/core/analyzer.ts#L1033-L1051)

逐项应用和journal状态。

<details>
<summary>查看原文（19行）</summary>

```text
        const outcome = await this.applyOne(adapter, item, importCtx);
        importCtx.signal = undefined;
        // m1 埋点：每完成一个计划项上报（真实进度；onItem 抛错不得中断导入）
        itemIndex += 1;
        try {
          opts.onItem?.({
            adapter: item.adapter,
            index: itemIndex,
            total: totalItems,
            status: outcome.executed.status,
            detail: item.id,
          });
        } catch {
          // 埋点回调失败不影响导入执行（进度是尽力而为）
        }
        executed.push(outcome.executed);
        // P2-B（Phase 8）：逐项更新 journal step。文件类成功 → done + afterFp（reconcile 可判
        // recovered）；失败/warning/跳过 → 无不可靠 afterFp（attention/skipped → 保守 needs-attention）。
        if (sb?.recordStep !== undefined && beforeFpByItem.has(item.id)) {
```

</details>

**依据 6 · 源码核查**：[src/core/analyzer.ts:1097-1112](https://github.com/xiajiajun516/dsh-config-manager/blob/f1fb06b3560a0ed4fe79a6be39372ddff5ce6f73/src/core/analyzer.ts#L1097-L1112)

收尾结果和重启提示。

<details>
<summary>查看原文（16行）</summary>

```text
        for (const result of finalized) {
          const status: ExecutedItem['status'] = result.ok ? 'ok' : result.warning === true ? 'warning' : 'failed';
          executed.push({
            itemId: `${adapterId}:finalize`,
            status,
            ...(result.message !== undefined ? { message: result.message } : {}),
          });
          if (status === 'failed') anyFailed = true;
          // 分区收尾也能宣布「需要重启」（会话写入即属此类：DSH 的会话列表在启动期读取，
          // 不重启就看不到新导入的对话）。此前该字段只在逐项结果里被消费，收尾结果里的
          // needsRestart 会被静默丢掉 —— 用户拿不到这条必需提示。
          if (result.needsRestart === true) needsRestart = true;
          if (status !== 'ok' && result.message !== undefined) warnings.push(result.message);
        }
      }
      if ((cancelled && cancelDecision === 'rollback') || (opts.rollbackOnError && anyFailed)) break;
```

</details>

**依据 7 · 源码核查**：[src/core/analyzer.ts:1162-1187](https://github.com/xiajiajun516/dsh-config-manager/blob/f1fb06b3560a0ed4fe79a6be39372ddff5ce6f73/src/core/analyzer.ts#L1162-L1187)

部分保留与未执行项标记。

<details>
<summary>查看原文（26行）</summary>

```text
     * 快照**保持可用**（不标 done / 不标 rolled-back）——这是「保留」的可撤销承诺：
     * 用户随时可以在「备份」页用这笔导入前快照手动回滚。
     * 本分支**绝不允许抛错**：调用方处于正常返回路径上，抛错会把「已知结论：部分保留」换成
     * 异常 → runJournaled 记 NEEDS_ATTENTION + SAFE MODE，正好是本功能要避免的结局。
     */
    if (cancelled && cancelDecision === 'keep') {
      keptPartial = true;
      const executedIds = new Set(executed.map((e) => e.itemId));
      let abandoned = 0;
      if (sb?.recordStep !== undefined) {
        for (const item of plan.items) {
          if (!beforeFpByItem.has(item.id) || executedIds.has(item.id)) continue;
          abandoned += 1;
          try {
            const rel = Analyzer.fileRelFor(item, importCtx.target.profile);
            await sb.recordStep({
              id: item.id,
              adapter: item.adapter,
              kind: item.kind,
              ref: rel !== null ? resolveFileTarget(importCtx.target, item.adapter, item.target?.ref ?? '') : '',
              external: rel === null,
              status: 'skipped',
              beforeFp: beforeFpByItem.get(item.id) ?? null,
              afterFp: null,
              message: this.msg('import.cancelKeptSkippedItem'),
            });
```

</details>

#### 缺口

- 未故障注入崩溃/磁盘/外部包命令，也未验全部回滚适配器。
  **影响**：不由代表源码推导所有适配器、远端通道或恢复结果。
  **进一步探讨**：在目标副本注入快照失败、逐项失败、收尾失败、取消keep/rollback和重启，核文件与外部效果、journal和快照一致。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 默认排除密钥、凭据加密与文件内容安全怎么区分？

**研究主题**：功能与机制、缺陷与关键质疑、效果与总成本

#### 完整回答

Exporter在includeSecrets且无EncryptionProvider时拒绝；结构化分区经scanAndRedact剥值，文件类分区（Skills、预设、指令、pluginFiles、sessions等）却只scanText并告警，不改内容。其报告redactedHits也计入未改写的文件命中，不能从字段名理解成所有值已经清除；未知形状秘密更无法语义保证。默认scanner还可能无scanText，但生产index明确构建强化scanner并意图共用于HTTP、工具和定时导出，生产接线的每一路仍需验收。因此“默认不含secret”应限定设计的结构化凭据路径，不能当所有文件安全上传保证。

显式includeSecrets时读取.credentials.yaml原文并写security/secrets.enc；scrypt随机salt、AES-256-GCM随机iv，空密码拒绝但不强制复杂度。整体加密容器是另层，加密秘密块并不自动等于ZIP全部内容加密。同步引擎会拒includeSecrets而encrypt=false，但外部通道权限、凭据存储、元数据/日志和上传载荷未完整审计，本轮不能承诺“远端只见密文”对所有路径成立。导出还会尽力刷新本机敏感文件vault，异常只warning，所以本地备份也有磁盘副作用/保留成本；密钥密码必须用户独立保管，丢失不应推测可恢复。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/exporter.ts:264-266](https://github.com/xiajiajun516/dsh-config-manager/blob/f1fb06b3560a0ed4fe79a6be39372ddff5ce6f73/src/core/exporter.ts#L264-L266)

无加密provider不能导密钥。

```text
    const { includeSecrets, only } = options;
    if (includeSecrets && !this.encryption) {
      throw new Error(this.msg('export.encryptionRequired'));
```

**依据 2 · 源码核查**：[src/core/exporter.ts:345-381](https://github.com/xiajiajun516/dsh-config-manager/blob/f1fb06b3560a0ed4fe79a6be39372ddff5ce6f73/src/core/exporter.ts#L345-L381)

文件只告警不改，redactedHits非必然已脱敏。

<details>
<summary>查看原文（37行）</summary>

```text
      // 3. Secret 过滤：结构化数据逐一过 scanner（剥离值）；
      //    文件类分区（skills/agentPresets/agentInstructions/pluginFiles/sessions/self）是用户的真实文件，
      //    只做**文本级扫描 + 告警**，绝不改写/剥离内容（见 scanFileSectionText）。
      let sanitized = section.data;
      if (!isFileSection(adapter.id)) {
        const scanned = this.scanner.scanAndRedact(section.data);
        redactedHits.push(...scanned.hits);
        sanitized = scanned.sanitized;
      } else {
        const fileHits = scanFileSectionText(this.scanner, section.data);
        if (fileHits.length > 0) {
          // redactedHits 是**报告统计**通道（非告警通道）：仍计入全量命中（含同一文件的多行/多形态命中）。
          redactedHits.push(...fileHits);
          // 告警按**文件**去重（G-09/H1）：同一路径只告警一次。
          // 修复前按 hit 计数，同一行同时命中「字段名」与「值形状」会产出两条同路径告警，
          // 使少数文件就吃满上限，导致含真实明文凭据的其它文件被静默淹没（实测 redactedHits=8 而 5 条告警全属一个文件）。
          const hitPaths: string[] = [];
          const seenPaths = new Set<string>();
          for (const hit of fileHits) {
            if (seenPaths.has(hit.path)) continue;
            seenPaths.add(hit.path);
            hitPaths.push(hit.path);
          }
          // 上限语义 = 不同**文件**数 ≤ MAX_FILE_SECTION_WARNINGS_PER_SECTION（避免大分区刷屏）
          const warnedPaths = hitPaths.slice(0, MAX_FILE_SECTION_WARNINGS_PER_SECTION);
          for (const hitPath of warnedPaths) {
            warnings.push(this.msg('export.fileSectionSecrets', { section: adapter.id, path: hitPath }));
          }
          // 被截断的文件数必须**显式**汇总告警，否则截断本身又变成静默丢失。
          // 文案在 t4 域目录（src/core/messages-core.ts）：不再借用 export.fileSectionSecrets 传中文 path 值。
          const truncatedCount = hitPaths.length - warnedPaths.length;
          if (truncatedCount > 0) {
            warnings.push(engineMsg('core.exporter.fileSectionSecretsTruncated', { section: adapter.id, count: truncatedCount }));
          }
        }
      }
      sections.push({ ...section, data: sanitized });
```

</details>

**依据 3 · 源码核查**：[src/core/exporter.ts:429-450](https://github.com/xiajiajun516/dsh-config-manager/blob/f1fb06b3560a0ed4fe79a6be39372ddff5ce6f73/src/core/exporter.ts#L429-L450)

credentials原文单独加密块。

<details>
<summary>查看原文（22行）</summary>

```text
    // secrets.enc：有加密提供者即生成。includeSecrets=true 时加密真实的凭据原文；
    // 只勾选加密（不导出密钥）时加密空内容占位，备份仍标记 encrypted（导入需密码），
    // 但绝不把凭据值放进去（containsSecrets 保持 false；安全不变量不破）。
    if (this.encryption) {
      const credentialsFile = path.join(this.ctx.homeDir, '.credentials.yaml');
      let plaintext: string;
      if (includeSecrets) {
        try {
          const raw = await this.ctx.fs.readFile(credentialsFile);
          plaintext = Buffer.from(raw).toString('utf8');
        } catch (err) {
          warnings.push(this.msg('export.credentialsReadFailed', { reason: err instanceof Error ? err.message : String(err) }));
          plaintext = '';
        }
      } else {
        plaintext = '';
      }
      const result = await this.encryption.encrypt(plaintext);
      entries.push({ name: 'security/secrets.enc', data: result.blob });
      encryption = result.info;
      containsSecrets = includeSecrets && plaintext !== '';
      encrypted = true;
```

</details>

**依据 4 · 源码核查**：[src/core/exporter.ts:453-469](https://github.com/xiajiajun516/dsh-config-manager/blob/f1fb06b3560a0ed4fe79a6be39372ddff5ce6f73/src/core/exporter.ts#L453-L469)

默认导出刷新本地vault并尽力处理。

<details>
<summary>查看原文（17行）</summary>

```text
    // 4b. 文件级 vault（includeSecrets=false：敏感文件明文不进归档 → 镜像到本机 vault）。
    //     尽力而为：任何失败仅记警告，不中断导出。includeSecrets=true 时秘密已加密进归档，
    //     无需镜像（vault 只服务于「明文不进备份」的本机留存场景）。
    let vaultRefreshed = 0;
    if (!includeSecrets) {
      try {
        const vault = await refreshVault(this.ctx.fs, this.vaultDataDir, this.ctx.homeDir, DEFAULT_SENSITIVE_RELS);
        vaultRefreshed = vault.mirrored.length;
        if (vault.mirrored.length > 0) {
          warnings.push(this.msg('export.vaultRefreshed', { count: vault.mirrored.length }));
        }
        for (const s of vault.skipped) {
          warnings.push(this.msg('export.vaultRefreshSkipped', { rel: s.rel, reason: s.reason }));
        }
      } catch (err) {
        warnings.push(this.msg('export.vaultRefreshFailed', { reason: err instanceof Error ? err.message : String(err) }));
      }
```

</details>

**依据 5 · 源码核查**：[src/security/encryption.ts:82-105](https://github.com/xiajiajun516/dsh-config-manager/blob/f1fb06b3560a0ed4fe79a6be39372ddff5ce6f73/src/security/encryption.ts#L82-L105)

空密码拒绝、随机salt/iv及GCM。

<details>
<summary>查看原文（24行）</summary>

```text
export async function encryptCredentials(
  plaintext: string,
  password: string,
): Promise<{ blob: Uint8Array; info: EncryptionInfo }> {
  if (password === '') throw new SecurityError('BAD_PASSWORD', securityMsg('security.encryptionPasswordEmpty'));
  // 产品决策（2026-09-13）：加密**不做任何密码强度校验**——用户提供的任何密码都必须可用。
  // 请勿在此重新加入强度闸门；用户自定的密码策略不由本插件约束。
  const salt = crypto.randomBytes(SALT_LENGTH);
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = await deriveKey(password, salt);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  const header = Buffer.alloc(HEADER_LENGTH);
  header.write(SCHEMA_MAGIC, 0, 'ascii');
  header[4] = SCHEMA_VERSION;
  salt.copy(header, 5);
  iv.copy(header, 5 + SALT_LENGTH);
  authTag.copy(header, 5 + SALT_LENGTH + IV_LENGTH);

  const info: EncryptionInfo = {
    algorithm: 'aes-256-gcm',
    kdf: 'scrypt',
```

</details>

**依据 6 · 源码核查**：[src/index.ts:4071-4087](https://github.com/xiajiajun516/dsh-config-manager/blob/f1fb06b3560a0ed4fe79a6be39372ddff5ce6f73/src/index.ts#L4071-L4087)

生产强化scanner统一来源。

<details>
<summary>查看原文（17行）</summary>

```text
  // M1（G-09 接线）：secret 扫描器**单一实例**来源 —— 三条全量导出路径必须共用同一个实例，
  // 否则扫描档位漂移：HTTP 导出路由（makeRoutes）、Agent 模型工具 config_backup
  // （registerModelTools）、定时自动备份（BackupScheduler）。三处都在下方同步构造，故此声明
  // 必须早于三者（对象字面量中的 scanner 是即时求值，声明放在后面会 TDZ ReferenceError）。
  const secretScanner = createConfiguredSecretScanner(config?.personalPatterns)
  const runs = new RunRegistry({ msg: host.msg })
  const backupScheduler = new BackupScheduler({
    syncDir,
    exportsDir,
    host,
    adapters,
    runs,
    msg: host.msg,
    exporterVersion: PLUGIN_VERSION,
    // M1（G-09 接线）：与 HTTP 导出路由 / config_backup 同一 scanner 实例 —— 定时备份是
    // 无人值守路径，文件类分区的凭据告警与 redactedHits 统计必须与手动导出完全一致
    // （缺省不传 = Exporter 落回无 scanText 的 defaultSecretScanner，文件类分区静默不扫描）。
```

</details>

**依据 7 · 源码核查**：[src/sync/sync-engine.ts:869-870](https://github.com/xiajiajun516/dsh-config-manager/blob/f1fb06b3560a0ed4fe79a6be39372ddff5ce6f73/src/sync/sync-engine.ts#L869-L870)

显式秘密要求加密。

```text
    if (includeSecrets && !encrypt) {
      throw new Error(this.msg('sync.includeSecretsRequiresEncryption'));
```

#### 缺口

- 未全审远端载荷、文件secret漏报、vault保护和加密配置每条生产路径。
  **影响**：不由代表源码推导所有适配器、远端通道或恢复结果。
  **进一步探讨**：使用合成秘密和用户文件副本审ZIP/密文/日志/vault，核默认与includeSecrets/整体加密差别，先证明无明文再允许远端试验。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用条件、成本与可证伪方向是什么？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

建议观察，先用不含真实凭据的本机副本验证最小导出/预览，不对重要配置直接执行导入、修复、rewind或远端同步。首次需明确源/目标profile、路径、插件/MCP命令、模型凭据和保护范围；持续有ZIP/快照/vault/保留策略、网络、外部包与多适配器升级成本，金额/时间未测。故障恢复需逐项核状态和外部命令副作用，退出也要处理已写配置、已装包与远端副本，卸载插件不是反向事务。README“一键迁移”不能省去这些验收。

工程假设是让计划/结果显式标注每项“已脱敏/只扫描告警/原样文件/加密块”、写前快照覆盖、可撤销/外部不明及重启验收；尤其把redactedHits拆为真正剥值和仅文件命中，可减少误以为安全上传。当前已具扫描、计划、journal和快照，增量应验证理解及恢复效果，而不新造备份系统。用合成秘密+部分失败任务比较当前界面与标注后的漏判明文、错选导入、恢复时间；若无改善或确认负担更大就停止。真实付费需求与经济收益未知。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/exporter.ts:345-381](https://github.com/xiajiajun516/dsh-config-manager/blob/f1fb06b3560a0ed4fe79a6be39372ddff5ce6f73/src/core/exporter.ts#L345-L381)

安全分类的具体歧义。

<details>
<summary>查看原文（37行）</summary>

```text
      // 3. Secret 过滤：结构化数据逐一过 scanner（剥离值）；
      //    文件类分区（skills/agentPresets/agentInstructions/pluginFiles/sessions/self）是用户的真实文件，
      //    只做**文本级扫描 + 告警**，绝不改写/剥离内容（见 scanFileSectionText）。
      let sanitized = section.data;
      if (!isFileSection(adapter.id)) {
        const scanned = this.scanner.scanAndRedact(section.data);
        redactedHits.push(...scanned.hits);
        sanitized = scanned.sanitized;
      } else {
        const fileHits = scanFileSectionText(this.scanner, section.data);
        if (fileHits.length > 0) {
          // redactedHits 是**报告统计**通道（非告警通道）：仍计入全量命中（含同一文件的多行/多形态命中）。
          redactedHits.push(...fileHits);
          // 告警按**文件**去重（G-09/H1）：同一路径只告警一次。
          // 修复前按 hit 计数，同一行同时命中「字段名」与「值形状」会产出两条同路径告警，
          // 使少数文件就吃满上限，导致含真实明文凭据的其它文件被静默淹没（实测 redactedHits=8 而 5 条告警全属一个文件）。
          const hitPaths: string[] = [];
          const seenPaths = new Set<string>();
          for (const hit of fileHits) {
            if (seenPaths.has(hit.path)) continue;
            seenPaths.add(hit.path);
            hitPaths.push(hit.path);
          }
          // 上限语义 = 不同**文件**数 ≤ MAX_FILE_SECTION_WARNINGS_PER_SECTION（避免大分区刷屏）
          const warnedPaths = hitPaths.slice(0, MAX_FILE_SECTION_WARNINGS_PER_SECTION);
          for (const hitPath of warnedPaths) {
            warnings.push(this.msg('export.fileSectionSecrets', { section: adapter.id, path: hitPath }));
          }
          // 被截断的文件数必须**显式**汇总告警，否则截断本身又变成静默丢失。
          // 文案在 t4 域目录（src/core/messages-core.ts）：不再借用 export.fileSectionSecrets 传中文 path 值。
          const truncatedCount = hitPaths.length - warnedPaths.length;
          if (truncatedCount > 0) {
            warnings.push(engineMsg('core.exporter.fileSectionSecretsTruncated', { section: adapter.id, count: truncatedCount }));
          }
        }
      }
      sections.push({ ...section, data: sanitized });
```

</details>

**依据 2 · 源码核查**：[src/core/analyzer.ts:921-945](https://github.com/xiajiajun516/dsh-config-manager/blob/f1fb06b3560a0ed4fe79a6be39372ddff5ce6f73/src/core/analyzer.ts#L921-L945)

恢复覆盖及外部不明。

<details>
<summary>查看原文（25行）</summary>

```text
    // 11. 快照（强制：导入前必须先备份将被修改的目标）。
    //     Phase 4：宿主注入 snapshotBinding 时，把 op-bound 元数据写入快照，并立即绑定 journal
    //     （SNAPSHOT_CREATED），保证「快照 durable+verified 且 journal 已知」先于首个 mutation。
    const snapshot = await createSnapshot({
      ctx: this.ctx,
      plan,
      sourceZip: zipPath,
      store: this.snapshotStore,
      adapters: this.adapters,
      operationId: opts.snapshotBinding?.operationId,
      operationType: opts.snapshotBinding?.operationType,
      environmentFingerprint: opts.snapshotBinding?.environmentFingerprint,
      ownerInstanceId: opts.snapshotBinding?.ownerInstanceId,
    });
    if (opts.snapshotBinding !== undefined) {
      await opts.snapshotBinding.bindSnapshot(snapshot.id);
      // 首个 destructive side effect 前：SNAPSHOT_CREATED→APPLYING（在首个 applyOne 之前调 markApplying）
      await opts.snapshotBinding.markApplying();
    }

    // P2-B（Phase 8）：逐计划项 WAL 预登记。将产生真实 side effect 的项在 apply 之前
    // 记为 planned（文件类带 beforeFp），使 crash 中途可按「仍 planned ⇒ 未应用」保守判定；
    // 非文件项 external=true（不可证明 → reconcile 恒 needs-attention，安全边界不放宽）。
    const sb = opts.snapshotBinding;
    const beforeFpByItem = new Map<string, string | null>();
```

</details>

**依据 3 · 源码核查**：[src/core/importer.ts:43-58](https://github.com/xiajiajun516/dsh-config-manager/blob/f1fb06b3560a0ed4fe79a6be39372ddff5ce6f73/src/core/importer.ts#L43-L58)

部分失败/取消需要明确语义。

<details>
<summary>查看原文（16行）</summary>

```text
  decryptedCredentials?: Map<string, string>;
  /** 任一项失败立即整体回滚（默认 false：单项失败如实记录并继续其余项） */
  rollbackOnError?: boolean;
  /** m1：每完成一个计划项的进度回调（透传给 Analyzer；不传则无埋点） */
  onItem?: (info: PlanItemProgress) => void;
  /** m1：每开始一个计划项的进度回调（供 UI 显示「正在执行项 X」/ 判定跳过按钮；不传则无埋点） */
  onItemStart?: (info: { adapter: SectionId; index: number; total: number; detail: string }) => void;
  /** 执行日志回调（逐计划项操作 + 子进程命令行，仅非敏感文本；透传给 Analyzer → ImportContext） */
  onLog?: (line: string) => void;
  /** Phase 4 生产 journal↔snapshot 绑定（deferred；透传给 Analyzer；不传 = 无 journal 绑定） */
  snapshotBinding?: TransactionSnapshotContext;
  /** 用户终止信号（透传给 Analyzer；只在计划项边界生效，见 analyzer.executeImportPlan） */
  cancelSignal?: AbortSignal;
  /** 安全点询问用户如何处置已应用部分（透传；缺省/抛错一律按 rollback 安全侧） */
  onCancelDecision?: () => Promise<'rollback' | 'keep'>;
  /** 「保留已应用项」分支的启动自洽审计（透传；不传 = 未审计，结果里如实标注） */
```

</details>

**依据 4 · 源码核查**：[README.md:54-74](https://github.com/xiajiajun516/dsh-config-manager/blob/f1fb06b3560a0ed4fe79a6be39372ddff5ce6f73/README.md#L54-L74)

一键迁移和同步作者主张须有边界。

<details>
<summary>查看原文（21行）</summary>

```text
Export your current DSH environment as a single ZIP and import it on a new Windows, macOS or Linux machine. One click brings back settings, plugins, MCP servers, skills and global instructions (AGENTS.md).

### Migrate DSH configuration to a new computer

Move your complete DeepSeek Harness setup without manually reinstalling plugins, MCP servers and skills. Dead absolute paths are detected and remapped automatically (batch prefix mapping supported).

### Sync DSH configuration across machines

Keep portable configuration synchronized between machines through a private Git repository, WebDAV, an S3-compatible object store (AWS S3 / Alibaba OSS / Tencent COS / MinIO / Qiniu Kodo) or GitHub Gist — secrets do not sync by default (the payload is run through the SecretScanner); check "Export secrets" with an encryption password and `~/.dsh/.credentials.yaml` travels as scrypt + AES-256-GCM ciphertext inside the encrypted snapshot, so another machine can restore the credentials while the remote (Git host / WebDAV / object store / Gist) only ever sees ciphertext.

### Schedule automatic full backups

Turn on scheduled backups in the **Home → Scheduled backup** card (6h / 12h / 24h / 7d — or a **custom weekly weekday & time**) and DSH quietly keeps a fresh full backup of your configuration in the background — secrets are never included, so it stays safe on disk without a password. How many are kept is decided by the **retention policy** in the same card (last N + one per month + one per year), and consecutive failures are highlighted in red.

### Discover & install configurations from the marketplace

Browse the built-in official market for ready-made configurations (model providers, plugins, MCP servers, skills, agent presets…), preview what would be imported (dry-run), and install with one click — supply-chain warnings are always shown and every section must be explicitly approved before anything is written.

### Import from another AI agent (Claude Code, Cursor, Codex, …)

Your setup — and your chat history — already live in another AI coding agent on this machine? Pick the source and DSH Config Manager **translates it into a standard bundle** (MCP servers, skills, global instructions, conversations and the workspaces they belong to) and hands it to the same review-first import flow: preview → per-item conflict decisions → automatic snapshot → apply → rollback. 30 sources are recognized and 29 of them can migrate **chat history** too. Secret **values** are never read — only the key names, so the import plan can ask you to re-enter them.
```

</details>

#### 缺口

- 没有运行接受度、迁移合格率、误判安全和恢复时间数据。
  **影响**：不由代表源码推导所有适配器、远端通道或恢复结果。
  **进一步探讨**：新副本最小链验证后再用户对照，重点测错误、重做、人工/费用，不把旧样本兼容当新效果。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
