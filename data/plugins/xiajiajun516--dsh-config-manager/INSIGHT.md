# DSH Config Manager

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[d82407d](https://github.com/xiajiajun516/dsh-config-manager/tree/d82407de89e70cff75f1ccc76605ac1c902eddd0)

<!-- BEGIN META -->
[![GitHub ★ 330](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=330&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/xiajiajun516/dsh-config-manager) [![npm 30d 30,121](https://img.shields.io/static/v1?label=npm+30d&message=30%2C121&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-config-manager) [![最新发布 2026-11-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-12&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-config-manager)
<!-- END META -->

> **功能**：备份、迁移和同步 DSH 配置，并从其他工具导入会话。

> **亮点**：[Q01](#research-q01) 同时读取加密及旧 Trae 会话，按 ID 去重并返回可区分的诊断。[Q02](#research-q02) 将确认、目标快照和补偿接到迁移流程。

> **主要限制**：[Q03](#research-q03) 文件告警不剥值，远端列表失败后仍可能继续上传。[Q01](#research-q01) 临时明文的删除也要核实际结果。

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
  - [Q01 · 加密 Trae 会话怎样进入迁移候选，失败能否和空库区分？](#detail-section-11)
  - [Q02 · 导入确认、加密凭据和失败恢复分别保护哪些步骤？](#detail-section-12)
  - [Q03 · 为何导出告警和远端检查不等于归档可安全共享？](#detail-section-13)
  - [Q04 · 如何以独立迁移核对完整性和单位成本？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：切换设备或编码工具的 DSH 用户要迁移必要配置与历史，并能回查实际恢复结果。

人工复制选定配置，分别导出旧助手历史，手工比对并维护备份。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 配置迁移 | 分析和导入分区 | 确认前建计划，写前建快照 |
| 外部会话 | 读取 Trae 新旧数据 | 格式、密钥和临时明文需核 |
| 同步 | 发布或取回快照 | 文件告警不等于脱敏 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH 与目标写权限 | 本地迁移需要 | 分析、快照、导入 | 停止写入 |
| 可读 SQLite 和有效 Trae 密钥 | 加密导入需要 | 取得会话记录 | 按诊断核源 |
| 经验证的远端和密码 | 敏感同步条件 | 上传和保护 | 保持离线 |

| 步骤 | 谁操作 | 操作与结果 | 失败处理 |
| --- | --- | --- | --- |
| 准备 | 用户 | 备份并选非敏感副本 | 先查来源问题码 |
| 执行 | 用户 | 核计划、范围和确认 | 检查本次快照 |
| 验收 | 用户 | 对比目标、会话与残留 | 退出并从副本恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 本地副本和存储 | 核兼容、密钥和范围 | 格式覆盖未测 |
| 持续 | 同步与保留空间 | 检查文件内容 | 单位迁移成本未知 |
| 恢复 | 临时库与快照 | 验证清理、补偿和目标 | 失败回执需对账 |
| 退出 | 本地和远端副本 | 保留备份并停同步 | 不依赖自动删除 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话迁移 | 加密库优先与同 ID 去重 | 真实版本兼容 |
| 本地恢复 | 预检、快照和逆序补偿 | 各分区真实恢复 |
| 共享控制 | 结构化过滤和远端告警 | 文件无泄漏及并发安全 |

> **思考**：[Q03](#research-q03) 文件告警不剥值，远端列表失败后仍可能继续上传。[Q01](#research-q01) 临时明文的删除也要核实际结果。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 同时读取加密及旧 Trae 会话，按 ID 去重并返回可区分的诊断。[Q02](#research-q02) 将确认、目标快照和补偿接到迁移流程。

[Q01](#research-q01) 来源诊断避免把不可读误当空，[Q02](#research-q02) 执行和验证分别报告；[Q03](#research-q03) 远端预检与真实上传需分别核查。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 文件告警不剥值，远端列表失败后仍可能继续上传。[Q01](#research-q01) 临时明文的删除也要核实际结果。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先只做本地隔离迁移，逐条核目标并检查实际归档。[Q03](#research-q03) 远端不可核时保持离线。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认代表性的 Trae 读取、迁移与同步边界；真实格式兼容、异常补偿、隐私和收益未验。

- 已检查：作者 README、包清单、源码路径 CHANGELOG.md、src/core/analyzer.ts、src/core/exporter.ts、src/core/importer.ts、src/foreign/read-trae.ts、src/foreign/trae-sqlcipher.ts、src/sync/push-precheck.ts、src/sync/sync-engine.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读代表性 Trae、分析导入、导出筛查和远端预检；其他适配器及真实故障未验证，未执行插件。
- 下一步：用同 ID、错密钥和大小超限样本，对照落盘、临时清理、失败回滚与远端未知时实际上传。

**分析版本**

- **仓库**：[xiajiajun516/dsh-config-manager](https://github.com/xiajiajun516/dsh-config-manager)
- **版本号**：0.8.2（[固定提交 d82407d](https://github.com/xiajiajun516/dsh-config-manager/tree/d82407de89e70cff75f1ccc76605ac1c902eddd0)）
- **版本日期**：2026-11-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 比较分区剥值、仅告警与未检查状态的回执是否减少误共享和恢复漏项。

用同 ID、错密钥和大小超限样本，对照落盘、临时清理、失败回滚与远端未知时实际上传。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 199 | 28476 | — | — | 650771 |
| .mjs | source | 33 | 2176 | 1821 | 245 | — |
| .js | source | 2 | 16 | 16 | 0 | — |
| .ts | test | 495 | 135737 | 109522 | 15149 | — |
| .ts | source | 467 | 153408 | 102013 | 42474 | — |
| .tsx | source | 82 | 25408 | 19159 | 5738 | — |
| .md | example | 26 | 181 | — | — | 2065 |
| .md | test | 1 | 312 | — | — | 4651 |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/xiajiajun516/dsh-config-manager/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 30](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=30&color=737b86&logo=github)](https://github.com/xiajiajun516/dsh-config-manager/issues?q=is%3Aissue+created%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z) [![近30天关闭 37](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=37&color=737b86&logo=github)](https://github.com/xiajiajun516/dsh-config-manager/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：用户怎样把配置与 Trae 历史迁入 DSH，哪些步骤能验证数据完整、回滚及敏感内容范围？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 加密 Trae 会话怎样进入迁移候选，失败能否和空库区分？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

切换开发工具的用户可把历史一起迁入新环境，而不用手工摘录。读取器先检测 SQLite 能力；加密库通道按大小和密钥判定，必要时解密至临时文件并只读解析。数据库缺失、超限和 schema 错误使用不同结果，调用者将问题映射为 skip 后继续旧库。先读加密记录并记规范化 ID，旧 state.vscdb 同 ID 跳过，因此重复控制依赖 ID 一致，不能保证识别不同 ID 的同一内容。临时明文在 finally 尝试删除，清理失败被吞，不能宣称进程被杀或文件系统失败时无残留。

#### 证据与依据

**依据 1 · 作者声明**：[CHANGELOG.md:31-45](https://github.com/xiajiajun516/dsh-config-manager/blob/d82407de89e70cff75f1ccc76605ac1c902eddd0/CHANGELOG.md#L31-L45)

作者声明新版及旧版 Trae 同时可读。

<details>
<summary>查看原文（15行）</summary>

```text
## [0.8.2] - 2026-11-12

> **新版 Trae 的会话，现在也能导进来了**：这几个发行版把会话搬进了加密数据库，插件以前只认得旧文件、导出来是空的；现在两种形态都读，同一段对话不算两遍。导入失败时也不再只说一句「导入失败」，而是写清是哪一种原因，并带上问题码。
>
> **Theme**: sessions from newer Trae builds import again — conversations now come out of the encrypted database as well as the old session files, and a failed import states which kind of problem it hit instead of one generic message.

### 🆕 新增 · Added

- **Trae（含 Trae CN / TRAE SOLO）新版的会话现在也能导入了**：这几个发行版把会话搬进了加密数据库，插件以前只认得旧的会话文件、导出来是空的；现在会连同该库里的会话一起读出来导入，旧的会话文件也照样认，同一段对话不会算两遍。（issue #134）
  **Sessions from newer Trae builds (Trae CN / TRAE SOLO included) can now be imported**: those builds moved conversations into an encrypted database, which the plugin used to skip entirely and produce an empty result; conversations are now read from it as well, the old session files still work, and the same conversation is not counted twice.

### 🐛 修复 · Fixed

- **导入失败时告诉你是哪种原因，而不是只说一句「导入失败」**：加密库密钥对不上、库超过体积上限、库结构不是预期形态、该来源的对话存储本版还不迁移，现在都在点击导入前或失败当下写清是哪一种（中英都有），错误里还会带上稳定的问题码便于排查。（issue #134）
  **A failed import now says which kind of problem it is instead of one generic "import failed"**: a key mismatch on the encrypted database, an oversized database, an unexpected database shape, or a source whose conversation storage this version does not migrate yet — each is stated before or at the moment the import fails (in both languages), with the stable problem code shown alongside.
```

</details>

**依据 2 · 源码核查**：[src/foreign/read-trae.ts:405-443](https://github.com/xiajiajun516/dsh-config-manager/blob/d82407de89e70cff75f1ccc76605ac1c902eddd0/src/foreign/read-trae.ts#L405-L443)

SQLite 依赖、加密库优先和诊断转交。

<details>
<summary>查看原文（39行）</summary>

```text
export async function readTrae(
  opts: RootProbeOptions & { readonly maxFiles?: number; readonly maxEncryptedDbBytes?: number },
): Promise<SessionReadOutcome<TraeSessionFile>> {
  const platform = normalizePlatform(opts.platform);
  const findings: ForeignSkip[] = [];
  const files: TraeSessionFile[] = [];
  const seen = new Set<string>();
  const maxFiles = opts.maxFiles ?? MAX_SESSIONS;

  const capability = await sqliteCapability();
  if (!capability.available) {
    return {
      files: [],
      readFindings: [{ code: 'source-unreadable', origin: 'trae', detail: 'sqlite-' + String(capability.reason) }],
      extraCounts: { 'trae.vscdb': 0 },
    };
  }

  const extraSkips: ForeignSkip[] = [];
  let truncated = false;

  // ① 加密库通道（2.3.x）：先读 —— 迁移后的库才是权威，同 id 冲突以它为准
  const encryptedDbs: string[] = [];
  for (const userDir of traeUserDataDirs(opts)) {
    const dbPath = traeDbPathFor(userDir, platform);
    if (await isFile(dbPath)) encryptedDbs.push(dbPath);
  }
  let encryptedSessions = 0;
  for (const dbPath of encryptedDbs) {
    const outcome = await readTraeEncryptedDatabase(dbPath, {
      env: opts.env,
      platform,
      ...(opts.maxEncryptedDbBytes !== undefined ? { maxBytes: opts.maxEncryptedDbBytes } : {}),
      maxSessions: maxFiles,
    });
    // 密钥错/超限/截断/表结构不符 ⇒ 稳定码（绝不静默 0 会话）；旧库有货时继续走旧库
    if (outcome.problem !== undefined) {
      extraSkips.push(traeDbSkipOf(outcome.problem));
      continue;
```

</details>

**依据 3 · 源码核查**：[src/foreign/read-trae.ts:451-480](https://github.com/xiajiajun516/dsh-config-manager/blob/d82407de89e70cff75f1ccc76605ac1c902eddd0/src/foreign/read-trae.ts#L451-L480)

记录规范化 ID，再读旧库。

<details>
<summary>查看原文（30行）</summary>

```text
    if (outcome.truncated === true) truncated = true;
    for (const session of outcome.sessions) {
      if (files.length >= maxFiles) { truncated = true; break; }
      const id = isSafeIrId(session.id) ? session.id : safeFragment('trae-db-' + session.id);
      if (seen.has(id)) continue;
      const ignored: Record<string, number> = {};
      const parsed = recordsOf(session.items, ignored);
      seen.add(id);
      files.push({
        id,
        cwd: session.cwd,
        createdAt: session.createdAt,
        title: session.title ?? '',
        records: parsed.records,
        raw: parsed.raw,
        bad: 0,
        ignored,
      });
      encryptedSessions += 1;
    }
  }

  // ② 旧 state.vscdb 通道（保留）：同 id 已被加密库计入的不再重复
  const dbs: string[] = [];
  for (const userDir of traeUserDataDirs(opts)) {
    dbs.push(...await traeVscdbPaths(userDir, platform));
  }
  let candidateKeys = 0;
  for (const dbPath of dbs) {
    if (files.length >= maxFiles) { truncated = true; break; }
```

</details>

**依据 4 · 源码核查**：[src/foreign/read-trae.ts:509-525](https://github.com/xiajiajun516/dsh-config-manager/blob/d82407de89e70cff75f1ccc76605ac1c902eddd0/src/foreign/read-trae.ts#L509-L525)

旧库复用 seen。

<details>
<summary>查看原文（17行）</summary>

```text
      for (const raw of traeSessionsOfValue(parsedValue, key, platform, findings)) {
        if (files.length >= maxFiles) { truncated = true; break; }
        if (seen.has(raw.id)) continue;
        seen.add(raw.id);
        files.push({
          id: raw.id,
          cwd: raw.cwd,
          createdAt: raw.createdAt,
          title: raw.title,
          records: raw.records,
          raw: raw.raw,
          bad: 0,
          ignored: raw.ignored,
        });
      }
    }
    db.close();
```

</details>

**依据 5 · 源码核查**：[src/foreign/trae-sqlcipher.ts:514-552](https://github.com/xiajiajun516/dsh-config-manager/blob/d82407de89e70cff75f1ccc76605ac1c902eddd0/src/foreign/trae-sqlcipher.ts#L514-L552)

限制、临时明文、只读打开及尽力清理。

<details>
<summary>查看原文（39行）</summary>

```text
  const stat = await statOrNull(sourcePath);
  if (stat === null || !stat.isFile()) {
    return { sessions: [], problem: { code: 'trae-db-decrypt-failed', detail: 'missing' } };
  }
  const maxBytes = options.maxBytes ?? TRAE_DB_MAX_BYTES;
  if (stat.size > maxBytes) {
    return { sessions: [], problem: { code: 'trae-db-too-large', detail: 'copy-too-large', count: stat.size } };
  }
  const resolution = resolveTraeDbKey(options.env);
  if ('problem' in resolution) return { sessions: [], problem: resolution.problem };

  const plaintextSource = await isPlaintextSqlite(sourcePath);
  const dir = plaintextSource ? null : await fs.mkdtemp(path.join(os.tmpdir(), 'dcm-trae-db-'));
  try {
    let target = sourcePath;
    let pages: number | undefined;
    let mode: 'decrypted' | 'plaintext' = 'plaintext';
    if (dir !== null) {
      target = path.join(dir, 'database.plain.db');
      const decrypted = await decryptTraeDatabase(sourcePath, target, resolution.key);
      if (!decrypted.ok) return { sessions: [], problem: decrypted.problem };
      pages = decrypted.pages;
      mode = 'decrypted';
    }
    // 明文库是我们自己的临时副本（无 -wal/-shm）：上限与加密库同档，避免第二次复制撞全局 1 GiB
    const opened = await openSqliteReadOnlyEx(target, { maxCopyBytes: maxBytes });
    if (opened.db === null) {
      return { sessions: [], problem: { code: 'trae-db-schema-mismatch', detail: 'open-' + String(opened.problem ?? 'failed') } };
    }
    try {
      return { ...readSchema(opened.db, options), pages, mode };
    } finally {
      opened.db.close();
    }
  } catch {
    return { sessions: [], problem: { code: 'trae-db-decrypt-failed', detail: 'io-error' } };
  } finally {
    // 明文只在本次导入内存在：无论成败都删（失败也不留半截）
    if (dir !== null) await fs.rm(dir, { recursive: true, force: true }).catch(() => undefined);
```

</details>

#### 缺口

- 未测真实 Trae 变体、跨版本 ID 和异常时临时明文残留
  **影响**：不能承诺无遗漏、无重复或无残留
  **进一步探讨**：用可丢弃副本比对加密及旧库同 ID、错密钥和中途取消

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 导入确认、加密凭据和失败恢复分别保护哪些步骤？

**研究主题**：依赖、兼容与流程、工程质量与复用

#### 完整回答

分析后的导入必须有显式确认，加密备份缺已解密凭据直接拒绝。写入前建立目标快照，存在宿主 snapshotBinding 才将操作信息纳入快照绑定。执行阶段若启用 rollbackOnError，失败时用已执行记录逆序补偿；导入后校验的错误则以告警列出，不把已写入状态改成从未写入。取消、失败与部分保留应按回执对账，不能从存在快照推断所有适配器和外部状态都有原子恢复。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/analyzer.ts:870-909](https://github.com/xiajiajun516/dsh-config-manager/blob/d82407de89e70cff75f1ccc76605ac1c902eddd0/src/core/analyzer.ts#L870-L909)

确认、解密条件、强制创建快照。

<details>
<summary>查看原文（40行）</summary>

```text
    // 10. 用户确认（安全阀：不确认绝不动数据）
    if (opts.confirm !== true) {
      throw new ImportNotConfirmedError(this.msg);
    }

    // 10b. 加密不变量：加密备份必须已成功解密（decryptedCredentials 由宿主用备份密码
    // 解开 security/secrets.enc 后注入）。未解密（undefined）一律拒绝执行——
    // 不允许把加密凭据静默降级为「缺凭据照常导入」，否则加密备份与普通备份无区别。
    if (bundle.manifest.security.encrypted && opts.decryptedCredentials === undefined) {
      throw new Error(this.msg('import.encryptedPasswordRequired'));
    }

    const importCtx: ImportContext = {
      manifest: bundle.manifest,
      targetPlatform: this.ctx.platform,
      target: this.ctx,
      sections: analyzed.sections,
      pathMappings: plan.pathMappings,
      resolutions: {},
      secretInputs: opts.secretInputs ?? {},
      decryptedCredentials: opts.decryptedCredentials,
      log: this.ctx.log,
      msg: this.msg,
      onLog: opts.onLog,
    };

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
```

</details>

**依据 2 · 源码核查**：[src/core/analyzer.ts:1196-1215](https://github.com/xiajiajun516/dsh-config-manager/blob/d82407de89e70cff75f1ccc76605ac1c902eddd0/src/core/analyzer.ts#L1196-L1215)

失败补偿与校验告警分开。

<details>
<summary>查看原文（20行）</summary>

```text
    // 失败整体回滚（rollbackOnError）：逆序补偿 + 诚实报告
    if (opts.rollbackOnError && anyFailed) {
      return await this.rollbackApplied(snapshot, executed, warnings, plan, opts.snapshotBinding, 'failed')
    }

    // 13. 校验（执行后：对最终数据再 validate；失败仅告警，不掩盖已完成项）
    // 保留分支跳过：analyzed.sections 是整个包的数据，而盘上只有一部分，校验结论会系统性偏负
    // （「该分区数据不完整」类告警）——那属于噪声，不是真问题。改由启动自洽审计报真实风险。
    for (const adapter of keptPartial ? [] : this.adapters) {
      const data = analyzed.sections.get(adapter.id);
      if (data === undefined) continue;
      try {
        const v = await adapter.validate(data, this.msg);
        for (const issue of v.issues) {
          if (issue.severity === 'error') warnings.push(this.msg('import.postValidationIssue', { adapter: adapter.id, message: issue.message }));
        }
      } catch (err) {
        warnings.push(this.msg('import.postValidationFailed', { adapter: adapter.id, reason: err instanceof Error ? err.message : String(err) }));
      }
    }
```

</details>

**依据 3 · 源码核查**：[src/core/importer.ts:102-115](https://github.com/xiajiajun516/dsh-config-manager/blob/d82407de89e70cff75f1ccc76605ac1c902eddd0/src/core/importer.ts#L102-L115)

入口将默认失败策略及绑定传入 analyzer。

<details>
<summary>查看原文（14行）</summary>

```text
  }

  /** 步骤 10-14：确认 → 快照 → 执行 → 校验 → 结果；失败可整体回滚并如实报告 */
  executeImportPlan(zipPath: string, plan: ImportPlan, opts: ExecuteOptions): Promise<ImportResult> {
    return this.analyzer.executeImportPlan(zipPath, plan, {
      confirm: opts.confirm,
      secretInputs: opts.secretInputs,
      decryptedCredentials: opts.decryptedCredentials,
      rollbackOnError: opts.rollbackOnError ?? DEFAULT_ROLLBACK_ON_ERROR,
      onItem: opts.onItem,
      onItemStart: opts.onItemStart,
      onLog: opts.onLog,
      snapshotBinding: opts.snapshotBinding,
      cancelSignal: opts.cancelSignal,
```

</details>

#### 缺口

- 未测试实际宿主、分区和中断点的恢复
  **影响**：不能当完整环境恢复保证
  **进一步探讨**：给测试迁移的第二分区制造失败并比对目标文件、快照和回执

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 为何导出告警和远端检查不等于归档可安全共享？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

结构化分区通过扫描器剥离值。用户文件类分区只扫描和告警，保留原始内容；同步也不走该类内容的结构化剥值，凭据选项要求启用加密。远端预检发现明确的新快照可拒绝冲突，列表异常却记警告后放行，接着仍可能调用传输上传。传输自身还可能拒绝，但不能把预检理解为远端未知即停。对包含文件的迁移应检查实际归档，对远端不明时先停同步。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/exporter.ts:346-367](https://github.com/xiajiajun516/dsh-config-manager/blob/d82407de89e70cff75f1ccc76605ac1c902eddd0/src/core/exporter.ts#L346-L367)

文件文本告警不改写。

<details>
<summary>查看原文（22行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[src/sync/push-precheck.ts:46-74](https://github.com/xiajiajun516/dsh-config-manager/blob/d82407de89e70cff75f1ccc76605ac1c902eddd0/src/sync/push-precheck.ts#L46-L74)

列表失败告警后继续，明确推进且无法收养时拒绝。

<details>
<summary>查看原文（29行）</summary>

```text
export async function resolvePushBase(opts: PushBaseOptions): Promise<PushBaseOutcome> {
  const state = await loadSyncState(opts.stateDir, opts.fsx, opts.msg);
  const base = state.lastSnapshotId;
  if (base === '') return { ok: true, base };
  if (opts.index.reason !== undefined) {
    opts.warnings.push(opts.msg('sync.pushAdvanceCheckFailed', { reason: opts.index.reason }));
    return { ok: true, base };
  }
  const metas = opts.index.metas;
  if (metas.length === 0) return { ok: true, base };
  const latest = metas[metas.length - 1]!.id; // list 按 createdAt 升序 → 最新在末
  if (latest === base) return { ok: true, base };
  const adopted = await adoptOwnRemoteHead({
    stateDir: opts.stateDir,
    fsx: opts.fsx,
    localSnapshotsDir: opts.localSnapshotsDir,
    metas,
    remoteId: latest,
    base,
    transport: opts.transport,
    hostname: opts.hostname ?? os.hostname(),
    msg: opts.msg,
    warnings: opts.warnings,
  });
  if (adopted === null) {
    // 无法安全断言「远端没变」时的保守拒绝：不 upload、不记基线、不改 sync-state。
    return { ok: false, message: opts.msg('sync.pushRemoteAdvanced', { remote: latest, base }) };
  }
  return { ok: true, base: adopted, adopted };
```

</details>

**依据 3 · 源码核查**：[src/sync/sync-engine.ts:843-887](https://github.com/xiajiajun516/dsh-config-manager/blob/d82407de89e70cff75f1ccc76605ac1c902eddd0/src/sync/sync-engine.ts#L843-L887)

加密条件、预检返回及分区净化。

<details>
<summary>查看原文（45行）</summary>

```text
    /** 0.4.1：本次推送前收养的「本机自己推的」远端快照（非空 ⇒ 上次推送被打断过，已在报告里如实回传） */
    let adopted: string | undefined;
    const includeSecrets = opts.includeSecrets ?? false;
    const encrypt = opts.encrypt ?? false;
    // 安全不变量：导出密钥必须加密；加密必须给密码（密码绝不落盘）
    if (includeSecrets && !encrypt) {
      throw new Error(this.msg('sync.includeSecretsRequiresEncryption'));
    }
    if (encrypt && (opts.password === undefined || opts.password === '')) {
      throw new Error(this.msg('sync.encryptRequiresPassword'));
    }
    // SYN-02：本轮只列一次远端 index（推进检测 + 继承会话删除墓碑共用；墓碑累积在最新快照里）
    const remoteIndex = await listRemoteSnapshotIndex(this.transport);
    const remoteTombstones = remoteIndex.reason === undefined ? remoteTombstonesOf(remoteIndex.metas) : [];
    // 远端推进检测（判据与 0.4.1 自愈收养全在 push-precheck.ts）；冲突时**不抛错**、
    // 不 upload、不记基线、不改 sync-state，只把文案回给调用方走 force 出口。
    if (opts.force !== true) {
      const pre = await resolvePushBase({
        stateDir: this.stateDir, fsx: this.fsx, localSnapshotsDir: this.localSnapshotsDir,
        index: remoteIndex, transport: { type: this.transport.type, ref: this.transportRef },
        msg: this.msg, warnings,
      });
      if (!pre.ok) return { ok: false, snapshotId: '', sections: [], warnings, conflict: true, message: pre.message };
      adopted = pre.adopted;
    }
    const plainSections: Partial<Record<SectionId, SectionData>> = {};
    const targets = this.pushTargets(opts.sections, warnings);
    for (const adapter of targets) {
      let section: ExportSection;
      try {
        section = await adapter.export(this.ctx, {
          includeSecrets,
          // 可选分区（sessions）：显式勾选清单 > 「最新 N 个」上限（其余分区零变化）
          ...this.sessionExportOptions(adapter.id, opts.sessions),
        });
      } catch (err) {
        warnings.push(this.msg('sync.sectionFailed', { adapter: adapter.id, reason: err instanceof Error ? err.message : String(err) }));
        continue;
      }
      warnings.push(...section.warnings);
      // includeSecrets=true：凭据值保留（随后整体加密）；否则过 SecretScanner 剥离（默认安全）
      const data = isFileSection(adapter.id) || includeSecrets
        ? section.data
        : this.scanner.scanAndRedact(section.data).sanitized;
      plainSections[adapter.id] = data as SectionData;
```

</details>

**依据 4 · 源码核查**：[src/sync/sync-engine.ts:948-969](https://github.com/xiajiajun516/dsh-config-manager/blob/d82407de89e70cff75f1ccc76605ac1c902eddd0/src/sync/sync-engine.ts#L948-L969)

实际上传与后续本地基线。

<details>
<summary>查看原文（22行）</summary>

```text
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
    // ③ 记录祖先基线：写 sync-state（lastSnapshotId + 每分区 hash/updatedAt + lastSyncAt + transport）+ 裁剪。
    //    基线 hash 用明文（hasLocalChanges 与本地明文可比）；加密快照不写明文祖先副本（密钥不落盘）。
    await this.recordBaseline(id, plainSections, nowIso, {
      // issue #107：加密快照也落**密文**祖先副本（密码只在本进程内存里用；磁盘上只有密文）。
      // 不落任何副本的旧行为会让每轮合并都缺共同祖先 → 三方退化成两方、整分区冲突，
      // 用户被迫反复人工裁决。明文通道不受影响（缺省走 writeAncestor 的明文散文件布局）。
      ...(encrypted ? { ancestorPassword: opts.password! } : {}),
      // 只有本轮真的跟踪了 sessions 才覆盖这两个字段（见 computeSessionBookkeeping）
      ...(bookkeeping.tracked
        ? { sessionUnits: bookkeeping.sessionUnits, deletedSessions: bookkeeping.tombstones }
        : {}),
```

</details>

#### 缺口

- 实际归档命中率、各传输冲突行为及并发未测
  **影响**：无法判断外发范围或保证同步不冲突
  **进一步探讨**：用假秘密和失败传输检查归档、上传次数及祖先账

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何以独立迁移核对完整性和单位成本？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

先用无真实账号的档案，只导一个明确配置分区及少量假会话。将手工复制和插件迁移各走一遍，以分区数据、会话条数和恢复后内容相符为验收；错密钥、同 ID、路径变化和无效备份各留一例。首用需要选来源和备份，持续需审查文件内容和兼容，恢复要比对快照及错误码，现金与人时分别记。可尝试让每个分区显示实际剥值、仅告警和未查范围，并把这些状态联到导入回执。若与现有提示相比不减少误带凭据和漏项，则保留当前方式。

#### 证据与依据

**依据 1 · 源码核查**：[src/foreign/read-trae.ts:426-455](https://github.com/xiajiajun516/dsh-config-manager/blob/d82407de89e70cff75f1ccc76605ac1c902eddd0/src/foreign/read-trae.ts#L426-L455)

源、故障和 ID 对照入口。

<details>
<summary>查看原文（30行）</summary>

```text
  // ① 加密库通道（2.3.x）：先读 —— 迁移后的库才是权威，同 id 冲突以它为准
  const encryptedDbs: string[] = [];
  for (const userDir of traeUserDataDirs(opts)) {
    const dbPath = traeDbPathFor(userDir, platform);
    if (await isFile(dbPath)) encryptedDbs.push(dbPath);
  }
  let encryptedSessions = 0;
  for (const dbPath of encryptedDbs) {
    const outcome = await readTraeEncryptedDatabase(dbPath, {
      env: opts.env,
      platform,
      ...(opts.maxEncryptedDbBytes !== undefined ? { maxBytes: opts.maxEncryptedDbBytes } : {}),
      maxSessions: maxFiles,
    });
    // 密钥错/超限/截断/表结构不符 ⇒ 稳定码（绝不静默 0 会话）；旧库有货时继续走旧库
    if (outcome.problem !== undefined) {
      extraSkips.push(traeDbSkipOf(outcome.problem));
      continue;
    }
    if (outcome.dropped !== undefined && outcome.dropped > 0) {
      findings.push({ code: 'source-unreadable', origin: 'trae', detail: 'encrypted-row-json-error', count: outcome.dropped });
    }
    if (outcome.skipped !== undefined && outcome.skipped > 0) {
      findings.push({ code: 'source-unreadable', origin: 'trae', detail: 'encrypted-session-without-id', count: outcome.skipped });
    }
    if (outcome.truncated === true) truncated = true;
    for (const session of outcome.sessions) {
      if (files.length >= maxFiles) { truncated = true; break; }
      const id = isSafeIrId(session.id) ? session.id : safeFragment('trae-db-' + session.id);
      if (seen.has(id)) continue;
```

</details>

**依据 2 · 源码核查**：[src/core/analyzer.ts:896-909](https://github.com/xiajiajun516/dsh-config-manager/blob/d82407de89e70cff75f1ccc76605ac1c902eddd0/src/core/analyzer.ts#L896-L909)

备份与恢复验收依据。

<details>
<summary>查看原文（14行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[src/core/exporter.ts:346-367](https://github.com/xiajiajun516/dsh-config-manager/blob/d82407de89e70cff75f1ccc76605ac1c902eddd0/src/core/exporter.ts#L346-L367)

对比现有文件告警。

<details>
<summary>查看原文（22行）</summary>

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
```

</details>

#### 缺口

- 真实迁机时间、恢复率和人工核对净收益未知
  **影响**：不能据此推荐持续同步
  **进一步探讨**：比较一次合格迁移的准备、恢复、模型或服务开销和复核耗时

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
