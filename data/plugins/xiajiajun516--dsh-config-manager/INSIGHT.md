# DSH Config Manager

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[63d3ee9](https://github.com/xiajiajun516/dsh-config-manager/tree/63d3ee956e20c0dd8520c41498cb473da91328ce)

<!-- BEGIN META -->
[![GitHub ★ 280](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=280&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/xiajiajun516/dsh-config-manager) [![npm 30d 18,656](https://img.shields.io/static/v1?label=npm+30d&message=18%2C656&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-config-manager) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-config-manager)
<!-- END META -->

> **功能**：备份、恢复、迁移和同步 DeepSeek Harness 配置。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 把分区、计划和恢复快照组织成迁移流程；不能证明所有依赖或结果自动恢复。

> **主要限制**：[Q03](#research-q03) 文件命中仅告警而非剥值，[Q04](#research-q04) 远端状态未知时仍可能继续上传；[Q02](#research-q02) 单项失败默认不保证整批回滚。

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
  - [Q01 · 哪些用户迁移或备份 DSH 配置，与手工复制文件有何差别？](#detail-section-11)
  - [Q02 · 导入如何分析、计划、确认并执行，部分失败是否回滚？](#detail-section-12)
  - [Q03 · 导出所谓脱敏、加密与文件扫描保护了哪些数据？](#detail-section-13)
  - [Q04 · 同步、账户、文件、宿主和恢复各有哪些前提与成本？](#detail-section-14)
  - [Q05 · 能否让作者识别未剥值的文件命中与部分导入状态？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH 用户需要备份配置、迁机或同步多个环境。

用户可手工备份配置文件并逐项核对和恢复外部依赖。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 分区导出 | 打包配置与文件 | 文件扫描命中只告警 |
| 导入计划 | 核查分区和路径 | 必须确认，单项失败可部分应用 |
| 恢复快照 | 保存变更前状态 | 外部系统恢复未证明 |
| 远端同步 | 上传或合并快照 | 远端检查未知时可能继续 |

| 依赖或条件 | 是否必需 | 用途 | 不满足时 |
|---|---|---|---|
| Node 与兼容 DSH | 宿主插件需要 | 启动与接口 | 无法加载或未验证 |
| 本地配置与写权限 | 导入导出需要 | 读取分区和创建快照 | 操作失败或部分完成 |
| 加密提供者与密码 | 导出凭据需要 | 保护密钥载荷 | 缺失时拒绝相应操作 |
| 远端账号与网络 | 仅远端同步需要 | 上传或下载快照 | 失败或状态未知 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份当前配置并选择目标分区 | 单独记录 profile 与外部依赖 |
| 导出 | 审查结构化剥值与文件告警 | 秘密可能仍在文件时停止上传 |
| 计划 | 检查路径映射、外部项和导入差异 | 未确认不执行 |
| 执行 | 逐项核对日志、快照与重启结果 | 部分失败按实际状态恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 本地存储与可选远端费用未知 | 配置导出、密码和备份 | 未测迁机完整性 |
| 持续 | 定期上传和存储费用未知 | 审核文件、分区和冲突 | 远端时效与权限未知 |
| 恢复 | 快照与重试资源未知 | 检查部分结果与回滚 | 跨外部系统不能保证原子 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 导入 | 确认、快照和逐项执行 | 全批原子及所有依赖恢复 |
| 密钥处理 | 结构化剥值与可选加密 | 文件内容已脱敏或无泄露 |
| 同步 | 已知远端推进时报告冲突 | 远端不可读时一致性 |

> **思考**：[Q03](#research-q03) 文件命中仅告警而非剥值，[Q04](#research-q04) 远端状态未知时仍可能继续上传；[Q02](#research-q02) 单项失败默认不保证整批回滚。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 把分区、计划和恢复快照组织成迁移流程；不能证明所有依赖或结果自动恢复。

[Q02](#research-q02) 快照与可选绑定支持恢复，[Q03](#research-q03) 区分剥值与仅扫描，[Q04](#research-q04) 远端未知有继续分支。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 文件命中仅告警而非剥值，[Q04](#research-q04) 远端状态未知时仍可能继续上传；[Q02](#research-q02) 单项失败默认不保证整批回滚。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先用隔离配置和本地备份验证分区，确认文件内容后再导入；远端状态或秘密处理不明时停止上传。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码的代表性导出、导入、加密和同步分支已查；未运行插件或远端。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/core/analyzer.ts、src/index.ts、src/core/exporter.ts、src/security/encryption.ts、src/sync/sync-engine.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读根清单、README、导出、分析、加密与同步代表分支；未运行宿主、远端或故障实验，未穷尽扫描规则、各适配器和外部服务。
- 下一步：用合成秘密、超大文件、不可读远端及分区失败验证报告、实际归档、快照和部分回滚；按 [Q05](#research-q05) 衡量误判。

**分析版本**

- **仓库**：[xiajiajun516/dsh-config-manager](https://github.com/xiajiajun516/dsh-config-manager)
- **版本号**：0.2.3（[固定提交 63d3ee9](https://github.com/xiajiajun516/dsh-config-manager/tree/63d3ee956e20c0dd8520c41498cb473da91328ce)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设按分区区分已剥值、仅告警和未扫描，并关联导入结果可减少误判；尚未验证。

用合成秘密、超大文件、不可读远端及分区失败验证报告、实际归档、快照和部分回滚；按 [Q05](#research-q05) 衡量误判。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 60 | 17637 | — | — | 400375 |
| .mjs | source | 7 | 933 | 710 | 174 | — |
| .md | test | 7 | 2927 | — | — | 53520 |
| .ts | test | 464 | 125263 | 101066 | 13922 | — |
| .ts | source | 420 | 145042 | 96979 | 39570 | — |
| .tsx | source | 79 | 24883 | 18895 | 5426 | — |
| .md | example | 26 | 181 | — | — | 2065 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-01），可前往 [GitHub Issues](https://github.com/xiajiajun516/dsh-config-manager/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查配置导出、凭据、导入与远端同步边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪些用户迁移或备份 DSH 配置，与手工复制文件有何差别？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

README:46-62 将场景描述为用户备份、迁机或在多设备同步设置、插件及相关内容；package.json:1-5 是作者对备份和迁移的定位。与人工复制文件相比，工具提供分区、路径映射、导入计划和写前快照；这些可帮助用户检查动作，但不能仅凭一键宣传证明每项外部依赖、凭据或新宿主均能恢复。README:48-50 明示 DSH profile 本身不包含在备份中；完整迁机还需要逐项核实。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:46-62](https://github.com/xiajiajun516/dsh-config-manager/blob/63d3ee956e20c0dd8520c41498cb473da91328ce/README.md#L46-L62)

作者描述备份迁移及排除 profile。

<details>
<summary>查看原文（17行）</summary>

```text
## 🎯 Use Cases

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

**依据 2 · 源码核查**：[package.json:1-5](https://github.com/xiajiajun516/dsh-config-manager/blob/63d3ee956e20c0dd8520c41498cb473da91328ce/package.json#L1-L5)

包版本与功能描述。

```text
{
  "name": "dsh-config-manager",
  "version": "0.2.3",
  "license": "MIT",
  "description": "Backup, restore, export, import, migrate and sync your DeepSeek Harness (DSH) configuration: settings, plugins, MCP servers, skills, agent presets and workspaces. One-click migration to another machine. DSH 配置一键备份、恢复、导出、导入、迁移与同步插件。",
```

**依据 3 · 源码核查**：[src/core/analyzer.ts:889-904](https://github.com/xiajiajun516/dsh-config-manager/blob/63d3ee956e20c0dd8520c41498cb473da91328ce/src/core/analyzer.ts#L889-L904)

确认和加密备份导入条件。

<details>
<summary>查看原文（16行）</summary>

```text
    // 写盘入口一律 refresh：**不复用**跨请求缓存，绝不能拿「几分钟前校验过」的结果去改用户数据
    // （校验通过之后、真正写盘之前归档被换掉，是这条路径必须自己关掉的窗口）。
    const bundle = await this.loadBundle(zipPath, 'refresh');
    const analyzed = await this.analyzeBundle(bundle);
    applyMappingsToSections(analyzed.sections, plan.pathMappings, this.fileCollectionIds());

    // 10. 用户确认（安全阀：不确认绝不动数据）
    if (opts.confirm !== true) {
      throw new ImportNotConfirmedError(this.msg);
    }

    // 10b. 加密不变量：加密备份必须已成功解密（decryptedCredentials 由宿主用备份密码
    // 解开 security/secrets.enc 后注入）。未解密（undefined）一律拒绝执行——
    // 不允许把加密凭据静默降级为「缺凭据照常导入」，否则加密备份与普通备份无区别。
    if (bundle.manifest.security.encrypted && opts.decryptedCredentials === undefined) {
      throw new Error(this.msg('import.encryptedPasswordRequired'));
```

</details>

#### 缺口

- 未在真实两机测试依赖恢复、重启及人工耗时
  **影响**：无法声称完整迁机或节时
  **进一步探讨**：隔离环境比较手工复制与导出导入并逐项核对。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 导入如何分析、计划、确认并执行，部分失败是否回滚？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

analyzer.ts:889-904 在写入前重新加载和分析 bundle，必须 confirm，且加密包要求已解密凭据；921-938 写前创建快照并在宿主提供 binding 时关联 journal。1068-1083 记录逐项结果，仅 rollbackOnError 开启时因单项失败中断；1144-1155 的取消分支可尝试回滚。默认单项失败不会自动整批回滚，单项成功、失败、警告及重启要求要逐项检查；快照和 journal 为恢复提供材料，不证明所有外部系统或中断均可逆。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/analyzer.ts:889-904](https://github.com/xiajiajun516/dsh-config-manager/blob/63d3ee956e20c0dd8520c41498cb473da91328ce/src/core/analyzer.ts#L889-L904)

重新加载、确认和凭据条件。

<details>
<summary>查看原文（16行）</summary>

```text
    // 写盘入口一律 refresh：**不复用**跨请求缓存，绝不能拿「几分钟前校验过」的结果去改用户数据
    // （校验通过之后、真正写盘之前归档被换掉，是这条路径必须自己关掉的窗口）。
    const bundle = await this.loadBundle(zipPath, 'refresh');
    const analyzed = await this.analyzeBundle(bundle);
    applyMappingsToSections(analyzed.sections, plan.pathMappings, this.fileCollectionIds());

    // 10. 用户确认（安全阀：不确认绝不动数据）
    if (opts.confirm !== true) {
      throw new ImportNotConfirmedError(this.msg);
    }

    // 10b. 加密不变量：加密备份必须已成功解密（decryptedCredentials 由宿主用备份密码
    // 解开 security/secrets.enc 后注入）。未解密（undefined）一律拒绝执行——
    // 不允许把加密凭据静默降级为「缺凭据照常导入」，否则加密备份与普通备份无区别。
    if (bundle.manifest.security.encrypted && opts.decryptedCredentials === undefined) {
      throw new Error(this.msg('import.encryptedPasswordRequired'));
```

</details>

**依据 2 · 源码核查**：[src/core/analyzer.ts:921-938](https://github.com/xiajiajun516/dsh-config-manager/blob/63d3ee956e20c0dd8520c41498cb473da91328ce/src/core/analyzer.ts#L921-L938)

写前快照及可选 journal 绑定。

<details>
<summary>查看原文（18行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[src/core/analyzer.ts:1068-1083](https://github.com/xiajiajun516/dsh-config-manager/blob/63d3ee956e20c0dd8520c41498cb473da91328ce/src/core/analyzer.ts#L1068-L1083)

逐项失败与可选中断。

<details>
<summary>查看原文（16行）</summary>

```text
                ? 'done'
                : outcome.executed.status === 'skipped'
                  ? 'skipped'
                  : 'attention',
            beforeFp: beforeFpByItem.get(item.id) ?? null,
            afterFp,
            message: outcome.executed.message ?? null,
          });
        }
        // 仅硬失败计入 anyFailed（warning 属非致命：目标不可达等，不触发回滚，§34.17）
        if (outcome.executed.status === 'failed') anyFailed = true;
        if (outcome.needsRestart) needsRestart = true;
        if (outcome.warning) warnings.push(outcome.warning);
        if (opts.rollbackOnError && outcome.executed.status === 'failed') break;
      }
      // 分区收尾（issue #45 ④）：会话位置护栏等必须等本分区全部写完才做的动作。
```

</details>

**依据 4 · 源码核查**：[src/core/analyzer.ts:1144-1155](https://github.com/xiajiajun516/dsh-config-manager/blob/63d3ee956e20c0dd8520c41498cb473da91328ce/src/core/analyzer.ts#L1144-L1155)

取消时回滚分支。

<details>
<summary>查看原文（12行）</summary>

```text
    }

    // 用户终止 + 选择「回滚」：与「失败整体回滚」复用同一条补偿路径（绝不新造第二份回滚）
    if (cancelled && cancelDecision === 'rollback') {
      const rolledBack = await this.rollbackApplied(snapshot, executed, warnings, plan, opts.snapshotBinding, 'cancelled')
      return { ...rolledBack, cancelled: true, keptPartial: false }
    }

    /**
     * 用户终止 + 选择「保留已应用项」：在安全点停下之后必须补齐三件事，否则「保留」就退化成
     * 「把半成品丢给用户、DSH 起不来再让用户自己猜」：
     *  ① 分区收尾（上方 finalizeApply / finalizeImport 已按条件跑完）；
```

</details>

**依据 5 · 源码核查**：[src/index.ts:4121-4132](https://github.com/xiajiajun516/dsh-config-manager/blob/63d3ee956e20c0dd8520c41498cb473da91328ce/src/index.ts#L4121-L4132)

模型工具接入同一核心与扫描器。

<details>
<summary>查看原文（12行）</summary>

```text
  // Agent 可调用的模型工具（P0-1）：复用 src/core 引擎与同一 makeSyncEngine 来源。
  // 不依赖 webServer：host 侧能力在无 Web 部署时仍可用；tools 服务未组合时内部守卫跳过。
  registerModelTools(ctx, {
    host,
    adapters,
    exportsDir,
    snapshotsDir,
    syncDir,
    makeSyncEngine,
    exporterVersion: PLUGIN_VERSION,
    // M1：与 HTTP 导出路由同一个 scanner（G-09 文件类分区凭据告警在两条路径上一致）。
    scanner: secretScanner,
```

</details>

#### 缺口

- 未注入分区失败、进程崩溃及宿主重启
  **影响**：不能保证全批原子或恢复成功
  **进一步探讨**：在隔离配置模拟部分失败、取消与重启并比对快照。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 导出所谓脱敏、加密与文件扫描保护了哪些数据？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

exporter.ts:70-102 的默认扫描器对结构化对象的敏感字段剥值，二进制原样跳过；107-116、133-139 限定文件扫描字节预算并说明只报告不改写。345-357 实际将文件命中也放入名为 redactedHits 的统计，但文件内容未被剥离，因此计数不是全部已脱敏证明。encryption.ts:72-93 对显式导出的凭据用 scrypt 派生并以 AES-256-GCM 加密，代码不强制密码强度；加密也不等于任意文件分区在所有配置下已被保护。README:42、50 的“默认无秘密”应按上述更窄边界理解，上传前仍需核原文和收件方。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/exporter.ts:70-102](https://github.com/xiajiajun516/dsh-config-manager/blob/63d3ee956e20c0dd8520c41498cb473da91328ce/src/core/exporter.ts#L70-L102)

结构化字段剥值和二进制跳过。

<details>
<summary>查看原文（33行）</summary>

```text
/** 缺省 SecretScanner：递归黑名单字段剥离（字段名大小写不敏感；二进制/Uint8Array 原样跳过） */
export function defaultSecretScanner(): SecretScanner {
  const SENSITIVE_FIELDS = [
    'password', 'passwd', 'token', 'accesstoken', 'refreshtoken', 'apikey',
    'secret', 'credential', 'authorization', 'cookie', 'privatekey', 'clientsecret',
  ];
  /** 仅存「引用名」而非值的字段（如 apiKeyEnv=DEEPSEEK_API_KEY 是环境变量名，不是秘密） */
  const REFERENCE_FIELDS = new Set([
    'apikeyenv', 'api_key_env', 'apikeyname', 'tokenenv', 'accesstokenenv',
    'refreshtokenenv', 'clientsecretenv', 'passwordenv',
  ]);
  return {
    scanAndRedact(data: unknown): { sanitized: unknown; hits: SensitiveHit[] } {
      const hits: SensitiveHit[] = [];
      const walk = (v: unknown, p: string): unknown => {
        if (v === null || typeof v !== 'object') return v;
        if (v instanceof Uint8Array) return v; // 二进制内容不按字段展开
        if (Array.isArray(v)) return v.map((item, i) => walk(item, `${p}[${i}]`));
        const out: Record<string, unknown> = {};
        for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
          const lower = k.toLowerCase().replace(/[^a-z0-9]/g, '');
          const isRefName = REFERENCE_FIELDS.has(lower);
          const sensitive = !isRefName && SENSITIVE_FIELDS.some((f) => lower.includes(f));
          if (sensitive && typeof val === 'string' && val !== '') {
            hits.push({ path: p === '' ? k : `${p}.${k}`, field: k });
            out[k] = ''; // 值剥离为空串（保留字段名与位置，供「需补录」提示）
            continue;
          }
          out[k] = walk(val, p === '' ? k : `${p}.${k}`);
        }
        return out;
      };
      return { sanitized: walk(data, ''), hits };
```

</details>

**依据 2 · 源码核查**：[src/core/exporter.ts:107-116](https://github.com/xiajiajun516/dsh-config-manager/blob/63d3ee956e20c0dd8520c41498cb473da91328ce/src/core/exporter.ts#L107-L116)

文件扫描预算及只报告。

<details>
<summary>查看原文（10行）</summary>

```text
/* ---------------- G-09：文件类分区文本级扫描（只报告，绝不改写） ---------------- */

/**
 * 单文件扫描字节上限（1 MiB）。超大文件只扫描前 1 MiB：
 * 凭据通常出现在配置/脚本的头部；超过上限的剩余部分放弃扫描，避免单个巨型文件拖垮导出。
 */
export const FILE_SECTION_SCAN_MAX_BYTES = 1024 * 1024;

/** 一次导出中所有文件类分区的累计扫描字节上限（16 MiB），防「成千上万小文件」拖慢导出 */
export const FILE_SECTION_SCAN_TOTAL_BUDGET_BYTES = 16 * 1024 * 1024;
```

</details>

**依据 3 · 源码核查**：[src/core/exporter.ts:133-139](https://github.com/xiajiajun516/dsh-config-manager/blob/63d3ee956e20c0dd8520c41498cb473da91328ce/src/core/exporter.ts#L133-L139)

文件扫描不改写。

```text
/**
 * 文件类分区内容扫描（G-09）：
 *  - 走注入 scanner 的 `scanText`（只报告不改写；`scanAndRedact` 会剥离值，**不得**用于用户文件）；
 *  - 扫描档位与 `src/market/prepare.ts` 的导出侧扫描保持一致：默认保守档 +
 *    值形状启发式（`valuePatterns` 默认开），**不启用** `highEntropy`（默认关，误报率高）；
 *  - 二进制文件（含 NUL）跳过：文本扫描对它无意义且必然误报；
 *  - 单文件上限 `FILE_SECTION_SCAN_MAX_BYTES`、累计上限 `FILE_SECTION_SCAN_TOTAL_BUDGET_BYTES`：
```

**依据 4 · 源码核查**：[src/core/exporter.ts:345-357](https://github.com/xiajiajun516/dsh-config-manager/blob/63d3ee956e20c0dd8520c41498cb473da91328ce/src/core/exporter.ts#L345-L357)

结构化剥值与文件命中统计差异。

<details>
<summary>查看原文（13行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[src/security/encryption.ts:72-93](https://github.com/xiajiajun516/dsh-config-manager/blob/63d3ee956e20c0dd8520c41498cb473da91328ce/src/security/encryption.ts#L72-L93)

凭据加密与密码强度条件。

<details>
<summary>查看原文（22行）</summary>

```text
/** 派生密钥（scrypt，参数可来自 manifest；默认常量） */
export async function deriveKey(
  password: string,
  salt: Uint8Array,
  params: EncryptionInfo['kdfParams'] = SCRYPT_PARAMS,
): Promise<Buffer> {
  return scryptAsync(password, salt, params.keyLength, { N: params.N, r: params.r, p: params.p });
}

/** 加密 .credentials.yaml 原文 → { blob, info }（info 直接进 manifest.security.encryption） */
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
```

</details>

**依据 6 · 作者声明**：[README.md:42-50](https://github.com/xiajiajun516/dsh-config-manager/blob/63d3ee956e20c0dd8520c41498cb473da91328ce/README.md#L42-L50)

作者默认无秘密的宣传。

```text
> ⚠️ **Security first**: no secrets (API Key / Token / Password) are exported by default. See [Security](#-security).

---

## 🎯 Use Cases

### Backup DeepSeek Harness configuration

Create a portable backup of your DSH settings, model providers, plugins, MCP servers, skills, agent presets and workspace — one ZIP file, no secret values included by default. (DSH's own profiles — `$DSH_HOME/profiles/<name>`, i.e. which plugin stack to boot — are machine-local and are **not** part of the backup; the **Environment → Profiles** view manages them instead — list / create / rename / delete, plus launching or stopping an independent instance for one.)
```

#### 缺口

- 未实测扫描规则、所有归档内容和不同同步通道
  **影响**：无法证明没有未发现或未改写的秘密
  **进一步探讨**：用合成敏感值检查结构化、文本和大文件的实际导出。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 同步、账户、文件、宿主和恢复各有哪些前提与成本？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

sync-engine.ts:864-873 要求导出凭据时加密并提供非空密码；875-891 对已确认远端推进返回冲突，但读取远端列表失败时仅警告并继续，不能将同步理解为未知状态下必定阻断。975 附近调用 transport 上传，数据外发和远端配置均由用户负责。package.json:31-32、60-70、98-105 声明 Node 版本、Web 依赖与 DSH peer；作者文档列多种远端但本次未核每一通道。需要迁机的用户可先导出隔离测试包、确认命中和备份，导入后逐项检查；远端状态、明文文件或密钥无法确认时停止上传并用本机离线备份。成本、远端行为和重启兼容未知。

#### 证据与依据

**依据 1 · 源码核查**：[src/sync/sync-engine.ts:864-891](https://github.com/xiajiajun516/dsh-config-manager/blob/63d3ee956e20c0dd8520c41498cb473da91328ce/src/sync/sync-engine.ts#L864-L891)

加密条件、远端推进及未知继续。

<details>
<summary>查看原文（28行）</summary>

```text
  async push(opts: SyncPushOptions = {}): Promise<SyncPushReport> {
    const warnings: string[] = [];
    const includeSecrets = opts.includeSecrets ?? false;
    const encrypt = opts.encrypt ?? false;
    // 安全不变量：导出密钥必须加密；加密必须给密码（密码绝不落盘）
    if (includeSecrets && !encrypt) {
      throw new Error(this.msg('sync.includeSecretsRequiresEncryption'));
    }
    if (encrypt && (opts.password === undefined || opts.password === '')) {
      throw new Error(this.msg('sync.encryptRequiresPassword'));
    }
    // 远端推进检测：不一致 = 远端被别的设备推过（或本机基线已被裁剪）。
    // 此时推上去会覆盖/架空别人的改动 → 直接返回冲突（**不抛错**、不 upload、不记基线、不改 sync-state）。
    if (opts.force !== true) {
      const check = await this.remoteAdvancedCheck();
      if (check.reason !== undefined) {
        // 读不到远端列表 ⇒ 无法判定。按原样继续（上传本身会再暴露通道问题），但如实说明。
        warnings.push(this.msg('sync.pushAdvanceCheckFailed', { reason: check.reason }));
      } else if (check.blocked) {
        return {
          ok: false,
          snapshotId: '',
          sections: [],
          warnings,
          conflict: true,
          message: this.msg('sync.pushRemoteAdvanced', { remote: check.latest, base: check.base }),
        };
      }
```

</details>

**依据 2 · 源码核查**：[src/sync/sync-engine.ts:964-979](https://github.com/xiajiajun516/dsh-config-manager/blob/63d3ee956e20c0dd8520c41498cb473da91328ce/src/sync/sync-engine.ts#L964-L979)

上传及后续状态。

<details>
<summary>查看原文（16行）</summary>

```text
      },
      sections,
      ...(credentials !== undefined ? { credentials } : {}),
    };

    // ① 本地散文件快照副本（审计；复用 t2 layout，不写 ZIP）。
    //    加密快照不写本地散文件副本（磁盘不落任何密文/明文载荷；远端已存密文）。
    if (this.localSnapshotsDir !== undefined && !encrypted) {
      await writeSnapshotToDir(snapshot, joinFs(this.localSnapshotsDir, id), this.fsx);
    }
    // ② 上传远端（传输通道负责散文件落盘 + 提交推送）
    await this.transport.upload(snapshot);
    // ②·1 裁剪远端快照：保留最新 MAX_REMOTE_SNAPSHOTS 个（含刚 push 的）。
    //      删除失败只告警（进 warnings），不上抛 —— 不阻断 push 主流程。
    //      放在 upload 之后（保证新快照已推送成功）与 recordBaseline 之前（先管好远端再记基线）。
    await this.pruneRemoteSnapshots(id, warnings);
```

</details>

**依据 3 · 源码核查**：[package.json:31-32](https://github.com/xiajiajun516/dsh-config-manager/blob/63d3ee956e20c0dd8520c41498cb473da91328ce/package.json#L31-L32)

Node 声明。

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
```

**依据 4 · 源码核查**：[package.json:60-70](https://github.com/xiajiajun516/dsh-config-manager/blob/63d3ee956e20c0dd8520c41498cb473da91328ce/package.json#L60-L70)

Web 客户端依赖声明。

<details>
<summary>查看原文（11行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-ui-settings"
      ],
      "platform": "web"
```

</details>

**依据 5 · 源码核查**：[package.json:98-105](https://github.com/xiajiajun516/dsh-config-manager/blob/63d3ee956e20c0dd8520c41498cb473da91328ce/package.json#L98-L105)

DSH peer 声明。

```text
  "peerDependencies": {
    "@deepseek-ai/dsh-agent-presets": ">=0.1.0-rc.6 <0.3.0-0",
    "@deepseek-ai/dsh-client-connection": ">=0.1.0-rc.6 <0.3.0-0",
    "@deepseek-ai/dsh-client-locale": ">=0.1.0-rc.6 <0.3.0-0",
    "@deepseek-ai/dsh-client-runtime": ">=0.1.0-rc.6 <0.3.0-0",
    "@deepseek-ai/dsh-client-ui-primitives": ">=0.1.0-rc.6 <0.3.0-0",
    "@deepseek-ai/dsh-client-ui-settings": ">=0.1.0-rc.6 <0.3.0-0",
    "@deepseek-ai/dsh-client-ui-slots": ">=0.1.0-rc.6 <0.3.0-0",
```

**依据 6 · 作者声明**：[README.md:60-62](https://github.com/xiajiajun516/dsh-config-manager/blob/63d3ee956e20c0dd8520c41498cb473da91328ce/README.md#L60-L62)

作者描述同步通道。

```text
### Sync DSH configuration across machines

Keep portable configuration synchronized between machines through a private Git repository, WebDAV, an S3-compatible object store (AWS S3 / Alibaba OSS / Tencent COS / MinIO / Qiniu Kodo) or GitHub Gist — secrets do not sync by default (the payload is run through the SecretScanner); check "Export secrets" with an encryption password and `~/.dsh/.credentials.yaml` travels as scrypt + AES-256-GCM ciphertext inside the encrypted snapshot, so another machine can restore the credentials while the remote (Git host / WebDAV / object store / Gist) only ever sees ciphertext.
```

#### 缺口

- 未运行远端故障、传输配置、两端导入与卸载
  **影响**：不能保证隐私、远端一致或回滚成本
  **进一步探讨**：用假远端断连及隔离 profile 验证告警、冲突和恢复。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否让作者识别未剥值的文件命中与部分导入状态？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

现有导出已经报告 redactedHits 和文件警告，导入已有快照、journal 和可选 rollbackOnError，故再显示单一命中数或简单增加备份不是增量。未验证设想是在导出/上传前给每个分区显示“结构化已剥值、文件命中仅告警、未扫描/超限”三类可核实状态，并允许用户排除文件或取消；导入结果按每项关联快照、已应用、失败、外部状态未知及回滚结果，未知不标成功。依赖扫描器提供覆盖范围与明确动作，不能把未扫描解释为无密钥。对照现有 warning、redactedHits 和 journal，用合成秘密覆盖结构化字段、文件命中、超限文件及未知远端，并注入中途分区失败；比较误以为已脱敏/全回滚次数、人工检查时间、遗漏与敏感泄露。若未扫描显示安全、外部状态不明当完成、泄露内容或误判无下降且负担过高，则否定；尚未实现或验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/exporter.ts:107-116](https://github.com/xiajiajun516/dsh-config-manager/blob/63d3ee956e20c0dd8520c41498cb473da91328ce/src/core/exporter.ts#L107-L116)

已有文件扫描上限。

<details>
<summary>查看原文（10行）</summary>

```text
/* ---------------- G-09：文件类分区文本级扫描（只报告，绝不改写） ---------------- */

/**
 * 单文件扫描字节上限（1 MiB）。超大文件只扫描前 1 MiB：
 * 凭据通常出现在配置/脚本的头部；超过上限的剩余部分放弃扫描，避免单个巨型文件拖垮导出。
 */
export const FILE_SECTION_SCAN_MAX_BYTES = 1024 * 1024;

/** 一次导出中所有文件类分区的累计扫描字节上限（16 MiB），防「成千上万小文件」拖慢导出 */
export const FILE_SECTION_SCAN_TOTAL_BUDGET_BYTES = 16 * 1024 * 1024;
```

</details>

**依据 2 · 源码核查**：[src/core/exporter.ts:345-357](https://github.com/xiajiajun516/dsh-config-manager/blob/63d3ee956e20c0dd8520c41498cb473da91328ce/src/core/exporter.ts#L345-L357)

命中既有报告和未改写文件。

<details>
<summary>查看原文（13行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[src/core/analyzer.ts:921-938](https://github.com/xiajiajun516/dsh-config-manager/blob/63d3ee956e20c0dd8520c41498cb473da91328ce/src/core/analyzer.ts#L921-L938)

写前快照与 journal。

<details>
<summary>查看原文（18行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[src/core/analyzer.ts:1068-1083](https://github.com/xiajiajun516/dsh-config-manager/blob/63d3ee956e20c0dd8520c41498cb473da91328ce/src/core/analyzer.ts#L1068-L1083)

单项失败与可选回滚。

<details>
<summary>查看原文（16行）</summary>

```text
                ? 'done'
                : outcome.executed.status === 'skipped'
                  ? 'skipped'
                  : 'attention',
            beforeFp: beforeFpByItem.get(item.id) ?? null,
            afterFp,
            message: outcome.executed.message ?? null,
          });
        }
        // 仅硬失败计入 anyFailed（warning 属非致命：目标不可达等，不触发回滚，§34.17）
        if (outcome.executed.status === 'failed') anyFailed = true;
        if (outcome.needsRestart) needsRestart = true;
        if (outcome.warning) warnings.push(outcome.warning);
        if (opts.rollbackOnError && outcome.executed.status === 'failed') break;
      }
      // 分区收尾（issue #45 ④）：会话位置护栏等必须等本分区全部写完才做的动作。
```

</details>

**依据 5 · 源码核查**：[src/sync/sync-engine.ts:875-891](https://github.com/xiajiajun516/dsh-config-manager/blob/63d3ee956e20c0dd8520c41498cb473da91328ce/src/sync/sync-engine.ts#L875-L891)

远端未知仅警告。

<details>
<summary>查看原文（17行）</summary>

```text
    // 远端推进检测：不一致 = 远端被别的设备推过（或本机基线已被裁剪）。
    // 此时推上去会覆盖/架空别人的改动 → 直接返回冲突（**不抛错**、不 upload、不记基线、不改 sync-state）。
    if (opts.force !== true) {
      const check = await this.remoteAdvancedCheck();
      if (check.reason !== undefined) {
        // 读不到远端列表 ⇒ 无法判定。按原样继续（上传本身会再暴露通道问题），但如实说明。
        warnings.push(this.msg('sync.pushAdvanceCheckFailed', { reason: check.reason }));
      } else if (check.blocked) {
        return {
          ok: false,
          snapshotId: '',
          sections: [],
          warnings,
          conflict: true,
          message: this.msg('sync.pushRemoteAdvanced', { remote: check.latest, base: check.base }),
        };
      }
```

</details>

#### 缺口

- 没有统一状态原型、完整扫描覆盖信息和人工验证
  **影响**：无法证明降低误判或维护成本可接受
  **进一步探讨**：先核各 scanner 覆盖元数据，再做合成数据与故障对照。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
