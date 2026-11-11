# DSH Backup

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[b4e773c](https://github.com/xiaoyuyu6420/dsh-backup/tree/b4e773c0510c3a71432c43343045d807e4a79c66)

<!-- BEGIN META -->
[![GitHub ★ 40](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=40&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/xiaoyuyu6420/dsh-backup) [![npm 30d 5,142](https://img.shields.io/static/v1?label=npm+30d&message=5%2C142&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@xiaoyuyu6420/dsh-backup) [![最新发布 2026-11-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@xiaoyuyu6420/dsh-backup)
<!-- END META -->

> **功能**：备份、校验和恢复 DeepSeek Harness 会话、设置与技能，并提供预览和独立救援入口。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 将归档校验、预览和原目录保留组织成可核对的流程。

> **主要限制**：[Q03](#research-q03) 自动回滚覆盖解压失败路径；凭据恢复发生在之后，错误需先读回当前目录。

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
  - [Q01 · 哪类数据恢复适合使用该工具？](#detail-section-11)
  - [Q02 · 归档如何进入整包恢复？](#detail-section-12)
  - [Q03 · 恢复失败时哪些阶段会自动回滚？](#detail-section-13)
  - [Q04 · 怎样先验证一份备份可用？](#detail-section-14)
  - [Q05 · 阶段回执能否减少中断后猜测？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：迁移或升级前需要可核对的 DSH 数据副本，并验证恢复后的会话。

停宿主后手工复制和验证数据目录，并单独恢复依赖与凭据。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 恢复预览 | 列出待恢复范围 | 需确认具体归档 |
| 整包恢复 | 校验并保留原目录后解压 | 后续凭据和依赖另行核对 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH 与 tar | 必需 | 校验和解压 | 保留原件 |
| 目标外归档与可恢复副本 | 整包恢复必需 | 避免替换自身备份 | 移动备份目录再评估 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 选定测试档案并预览 | 归档可校验 |
| 恢复 | 在独立目标展开并核对 | 会话、凭据及依赖逐项确认 |
| 退出 | 异常后读回并查移旁副本 | 不要重复覆盖不明状态 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 备份和快照空间 | 准备隔离环境 | 峰值未知 |
| 持续 | 归档与验证资源 | 定期核对可恢复性 | 维护用时未知 |
| 失败 | 原目录与半成品同时存在 | 人工恢复和比对 | 后阶段错误须单独核对 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 归档恢复 | 校验、预览与快照 | 真实宿主可用 |
| 失败对账 | 解压失败有回滚及副本指引 | 凭据后阶段和进程中断 |

> **思考**：[Q03](#research-q03) 自动回滚覆盖解压失败路径；凭据恢复发生在之后，错误需先读回当前目录。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 将归档校验、预览和原目录保留组织成可核对的流程。

[Q02](#research-q02) 操作锁与流式条目检查提供边界。[Q03](#research-q03) 需区分解压失败与后处理失败。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 自动回滚覆盖解压失败路径；凭据恢复发生在之后，错误需先读回当前目录。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先用测试目录和固定归档验证，不开启同步。状态不明时从原副本核对。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查固定源码的整包恢复与主要失败边界。未运行真实归档、宿主和依赖安装。

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/oplock.js、README.md、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：聚焦整包恢复，未审计全量同步、救援工具和所有敏感路径。
- 下一步：用合成档案对解压、凭据复制和重启分别故障注入，核对目标与移旁原件。

**分析版本**

- **仓库**：[xiaoyuyu6420/dsh-backup](https://github.com/xiaoyuyu6420/dsh-backup)
- **版本号**：0.14.4（[固定提交 b4e773c](https://github.com/xiaoyuyu6420/dsh-backup/tree/b4e773c0510c3a71432c43343045d807e4a79c66)）
- **版本日期**：2026-11-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 分阶段回执可能缩短中断后定位原件与决定恢复的时间。

用合成档案对解压、凭据复制和重启分别故障注入，核对目标与移旁原件。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 17 | 1605 | — | — | 33354 |
| .js | source | 14 | 10156 | 8132 | 1600 | — |
| .mjs | source | 10 | 6710 | 5759 | 625 | — |
| .mjs | test | 1 | 165 | 149 | 0 | — |
| .js | example | 2 | 9 | 6 | 3 | — |
| .mjs | example | 1 | 8 | 5 | 2 | — |
| .jsx | source | 1 | 1446 | 1341 | 53 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-11），可前往 [GitHub Issues](https://github.com/xiaoyuyu6420/dsh-backup/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：需要迁移或恢复 DSH 工作数据的用户，能否确认归档范围、回滚边界和实际可恢复结果？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪类数据恢复适合使用该工具？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

遇到迁机或升级失败的 DSH 用户，需要在保留原数据的情况下找回会话、配置和技能。手工复制目录也能保全数据，但使用者需自己检查归档内容、路径及依赖。插件集中提供预览、校验、恢复和原目录保留。合格交付需要真实宿主能打开恢复后的会话，并独立检查凭据及插件是否恢复。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:35-50](https://github.com/xiaoyuyu6420/dsh-backup/blob/b4e773c0510c3a71432c43343045d807e4a79c66/README.md#L35-L50)

作者给出备份、恢复和校验范围。

<details>
<summary>查看原文（16行）</summary>

```text
- 🔐 **凭据不离开本机** —— API Key / Token 默认脱敏，明文只留在本机 vault；要更强，可选口令加密备份（AES-256-GCM）。
- ↩️ **恢复绝不静默覆盖** —— 恢复前先自动快照当前数据、预览要写入的内容，失败自动回滚。
- 🧭 **装上就知道怎么用** —— 首屏三步引导 + 每个高级功能一句人话说明；三个 Tab（备份 / 恢复 / 设置），主按钮只有一个「立即备份」。

## 它替你挡掉哪些事

| 你担心的 | dsh-backup 做的事 |
|---|---|
| 「升级把环境搞坏了」 | 宿主版本一变就自动拍 `dsh-pre-upgrade-` 快照——放心试新版，坏了随时回滚 |
| 「我误删 / 改坏了东西」 | `/backup restore latest --dry-run` 先预览要恢复什么再动手；恢复失败自动回滚并给出结果回执 |
| 「DSH 根本起不来了」 | 每次备份都会往备份目录放一个零依赖的**救援控制台**（`dsh-rescue` / `rescue.mjs`，或双击「点我恢复」）——不依赖 DSH 的网页版恢复界面 |
| 「API Key 会被传到云上吗」 | 凭据默认脱敏，不进备份包；明文只存本机 vault，永不离开这台机器 |
| 「会话日志损坏了」 | `/backup doctor` 体检并从备份定点修复；损坏文件先隔离再入档，防止轮换把好副本也带走 |
| 「升级后老会话打不开了」 | `/backup migrate-check` 迁移预检：升级前静态扫描全部会话，预测哪些会被新宿主拒绝、挂在哪条规则；旧版扁平凭据文件在宿主改写前自动存底 |
| 「换新电脑了」 | GitHub 同步：`/backup github pull` 拉回云端备份，`restore --sync-deps` 顺手重装插件 |
| 「备份悄悄坏了没人知道」 | 每份归档带 sha256，`/backup verify all` 随时体检；每日/每周分级保留，留得住有用的历史 |
```

</details>

**依据 2 · 源码核查**：[lib/index.js:2892-2917](https://github.com/xiaoyuyu6420/dsh-backup/blob/b4e773c0510c3a71432c43343045d807e4a79c66/lib/index.js#L2892-L2917)

预览返回，实际恢复快照和移旁。

<details>
<summary>查看原文（26行）</summary>

```text
    if (dryRun) {
      return {
        archive, files: entries.length, sample: entries.slice(0, 12), aside: null, snapshotPath: null, dryRun: true,
        targetExists,
        preflight: preflightLines(preflight, profileDirs),
      };
    }

    // Moving DSH_HOME would also move the selected archive, vault and operation
    // lock. Require relocating the complete backup directory before replacement.
    if (backupRootRelative(dshHome, root) !== null) {
      throw new Error('整包恢复前请把整个备份目录（含 vault）移到 DSH_HOME 外，并更新备份路径；当前备份目录位于待替换的数据目录内');
    }

    // 恢复前自动快照当前数据，并把当前数据移到旁边（而非合并覆盖）。
    // 快照用 dsh-pre-restore- 前缀与用户常规备份区分，经 listBackups 过滤
    // 后不进列表/轮换/latest 选择；每次恢复清掉上一次的快照防累积。
    const snapshot = targetExists
      ? await doBackup(undefined, signal, { namePrefix: 'dsh-pre-restore-', skipVault: true, skipRotate: true })
      : null;
    if (snapshot) await prunePreRestoreSnapshots([snapshot.name, picked.name], signal);
    const asideName = `${base}.pre-restore-${stampNow()}`;
    let aside = null;
    if (targetExists) {
      await renameBeside(parent, base, asideName, signal);
      aside = `${parent}/${asideName}`;
```

</details>

#### 缺口

- 没有真实迁机或大归档时间对照。
  **影响**：无法量化恢复窗口。
  **进一步探讨**：对同一合成 DSH 数据做手工副本与归档恢复测试。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 归档如何进入整包恢复？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

入口以 restore 操作锁包住，选归档并强制 verifyOne。明文或临时解密档经清单检查，只接受备份根内允许类型及受限硬链接。预览返回样本。正式恢复拒绝内嵌于待替换目录的备份根，对现有数据做快照并移旁，再解压到目标位置。操作锁对残留 PID 采取保守回收。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:2677-2717](https://github.com/xiaoyuyu6420/dsh-backup/blob/b4e773c0510c3a71432c43343045d807e4a79c66/lib/index.js#L2677-L2717)

安全清单与硬链接条件。

<details>
<summary>查看原文（41行）</summary>

```text
  async function safeArchiveEntries(pickedName, signal, options = {}) {
    const env = paths();
    const root = options.root ?? env.root;
    const base = options.base ?? env.dshHome.split('/').pop();
    const tar = await ctx.subprocess.resolveExecutable('tar');
    // 清单流式读取（#119）：不用有界收集——大归档的清单超过 spill 上限时会被截断，
    // 碎片会被误判成"不安全条目"而拒绝整包（详见 streamListingLines 注释）。
    const entries = [];
    const bad = [];
    // 路径检查（反斜杠归一化后再判）：`.dsh/..\..\escape.txt` 与 `/` 分隔的
    // `..` 段同样拒绝（Windows 风格路径变体）。
    const insideBase = (p) => Boolean(p)
      && !p.startsWith('/') && !/^[A-Za-z]:/.test(p)
      && !p.split('/').includes('..')
      && (p === base || p.startsWith(`${base}/`));
    const onLine = (line) => {
      const s = line.trim();
      if (!s) return true;
      const parsed = parseTarEntry(s);
      const name = parsed ? parsed.name.replace(/\\/g, '/').replace(/\/$/, '') : null;
      const link = parsed && parsed.link ? parsed.link.replace(/\\/g, '/').replace(/\/$/, '') : null;
      // 允许的类型：普通文件 '-'、目录 'd'，以及**目标也在备份根内**的硬链接 'h'。
      // 硬链接是 DSH 附件库（attachments/v1：files/ 与 file-objects/ 同一 inode）的
      // 正常形态，tar 会把第二个路径写成 'h' 条目——旧实现只放行 -/d，于是**带附件的
      // 归档一律被判"不安全条目"整体拒绝**，完整恢复/dry-run/分类型合并/doctor 修复/
      // 救援台全链路失效（#112）。硬链接不能跨文件系统、也不能指向目录，目标同为
      // 归档内相对路径时解压不会逃出备份根；符号链接（l）、设备等仍一律拒绝。
      const plainOk = Boolean(parsed) && Boolean(name) && (parsed.type === '-' || parsed.type === 'd') && insideBase(name);
      const hardOk = options.allowHardlinks !== false && Boolean(parsed) && parsed.type === 'h' && insideBase(name) && insideBase(link);
      if (!plainOk && !hardOk) {
        bad.push(parsed ? name : s);
      } else {
        entries.push(name);
      }
      return bad.length === 0; // 发现违规立即停读并终止 tar，不必读完
    };
    const listed = await streamListingLines([tar, '-tvzf', pickedName], root, signal, onLine);
    if (bad.length) {
      throw new Error(`归档包含不安全条目（拒绝恢复）：${bad.slice(0, 3).join(', ')}（已读清单 ${listed.lines} 行 / ${listed.bytes} 字节），恢复已中止`);
    }
    return entries;
```

</details>

**依据 2 · 源码核查**：[lib/index.js:2720-2747](https://github.com/xiaoyuyu6420/dsh-backup/blob/b4e773c0510c3a71432c43343045d807e4a79c66/lib/index.js#L2720-L2747)

锁、校验和临时文件。

<details>
<summary>查看原文（28行）</summary>

```text
  async function restoreArchive(selector, dryRun, signal, opts = {}) {
    return withOperationLock('restore', () => restoreArchiveInner(selector, dryRun, signal, opts));
  }

  async function restoreArchiveInner(selector, dryRun, signal, opts = {}) {
    const { home, dshHome, root } = paths();
    const picked = await pickArchive(selector);
    const archive = `${root}/${picked.name}`;

    // 恢复前强制校验：损坏的归档绝不覆盖现有数据。
    const v = await verifyOne(picked.name, home, signal);
    if (!v.ok) throw new Error(`校验未通过（${v.note}），恢复已中止`);

    // 加密归档：先解密到备份目录内临时 tar.gz（隐藏名 .decrypt-*，不进列表/轮换），
    // 后续 tar 全部针对明文临时文件；口令只经 opts.password（面板 RPC 内存态）传入，
    // 绝不落盘。finally 必清临时文件——它是明文 tar.gz，遗留会绕过加密边界。
    const encrypted = await isArchiveEncrypted(picked.name);
    let workName = picked.name;
    let cleanupArchive = null;
    if (encrypted) {
      const dec = await decryptArchiveFile(picked.name, opts?.password, signal);
      workName = dec.name;
      cleanupArchive = dec.cleanup;
    }
    try {
      return await restoreArchiveFromPlain(picked, workName, archive, dryRun, signal, opts, { home, dshHome, root });
    } finally {
      if (cleanupArchive) await cleanupArchive().catch(() => { /* 清理失败尽力而为 */ });
```

</details>

**依据 3 · 源码核查**：[lib/index.js:2892-2921](https://github.com/xiaoyuyu6420/dsh-backup/blob/b4e773c0510c3a71432c43343045d807e4a79c66/lib/index.js#L2892-L2921)

预览、备份目录边界、移旁和解压。

<details>
<summary>查看原文（30行）</summary>

```text
    if (dryRun) {
      return {
        archive, files: entries.length, sample: entries.slice(0, 12), aside: null, snapshotPath: null, dryRun: true,
        targetExists,
        preflight: preflightLines(preflight, profileDirs),
      };
    }

    // Moving DSH_HOME would also move the selected archive, vault and operation
    // lock. Require relocating the complete backup directory before replacement.
    if (backupRootRelative(dshHome, root) !== null) {
      throw new Error('整包恢复前请把整个备份目录（含 vault）移到 DSH_HOME 外，并更新备份路径；当前备份目录位于待替换的数据目录内');
    }

    // 恢复前自动快照当前数据，并把当前数据移到旁边（而非合并覆盖）。
    // 快照用 dsh-pre-restore- 前缀与用户常规备份区分，经 listBackups 过滤
    // 后不进列表/轮换/latest 选择；每次恢复清掉上一次的快照防累积。
    const snapshot = targetExists
      ? await doBackup(undefined, signal, { namePrefix: 'dsh-pre-restore-', skipVault: true, skipRotate: true })
      : null;
    if (snapshot) await prunePreRestoreSnapshots([snapshot.name, picked.name], signal);
    const asideName = `${base}.pre-restore-${stampNow()}`;
    let aside = null;
    if (targetExists) {
      await renameBeside(parent, base, asideName, signal);
      aside = `${parent}/${asideName}`;
    }
    try {
      const tar = await ctx.subprocess.resolveExecutable('tar');
      await spawnRun([tar, '-xzf', workName, '-C', parentTar(parent)], root, signal);
```

</details>

**依据 4 · 源码核查**：[lib/oplock.js:27-52](https://github.com/xiaoyuyu6420/dsh-backup/blob/b4e773c0510c3a71432c43343045d807e4a79c66/lib/oplock.js#L27-L52)

保守 PID 与坏锁处理。

<details>
<summary>查看原文（26行）</summary>

```text
/** 判断 pid 是否可能存活：仅 ESRCH 判死；其余（成功/EPERM/未知）一律判活。 */
export function isPidAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (err) {
    return err?.code !== 'ESRCH'; // Only a confirmed missing process may be reclaimed
  }
}

/** 死锁判定：pid 确定不存在才算死；心跳只作参考字段，不参与自动判定。 */
export function isLockStale(lock) {
  if (!lock || typeof lock !== 'object') return true;
  return !isPidAlive(Number(lock.pid));
}

async function readLockFile(lockPath) {
  try {
    return JSON.parse(await readFile(lockPath, 'utf8'));
  } catch (err) {
    if (err && err.code === 'ENOENT') return null;
    // 锁文件损坏（半截写/权限）：保守按「存在但读不了」处理，返回一个
    // pid=当前 的伪锁阻止 acquire，避免两个实例同时以为没锁。——但 EACCES
    // 更可能是权限问题，也按不持有处理？不：宁可阻塞也不并发踩踏。
    return { pid: process.pid, token: null, operation: 'unknown', startedAt: null, heartbeatAt: null, unreadable: true };
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 恢复失败时哪些阶段会自动回滚？

**研究主题**：缺陷与关键质疑

#### 完整回答

整包解压失败进入 catch，尝试清理半截目标并改回原名；回滚也失败时返回保留位置。解压后 vault 凭据恢复与可选依赖安装位于该 catch 之外。缺凭据可显式报告，vault 文件复制失败也可能向外抛出，此时新目录已展开，不能从错误推定原目录已恢复。依赖安装还有单项降级状态。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:2919-2940](https://github.com/xiaoyuyu6420/dsh-backup/blob/b4e773c0510c3a71432c43343045d807e4a79c66/lib/index.js#L2919-L2940)

解压失败及尽力恢复。

<details>
<summary>查看原文（22行）</summary>

```text
    try {
      const tar = await ctx.subprocess.resolveExecutable('tar');
      await spawnRun([tar, '-xzf', workName, '-C', parentTar(parent)], root, signal);
    } catch (err) {
      // 挪旁之后解压失败会让 .dsh 处于空位——这是恢复流程里用户最容易慌
      // 的时刻。尽力自动回滚：清掉半截解压产物、把原数据改回原名；连回滚
      // 都失败时，错误消息必须带上数据位置和手工还原方法，绝不抛裸异常。
      const reason = err && err.message ? err.message : String(err);
      let rolledBack = false;
      try {
        await rm(dshHome, { recursive: true, force: true });
        if (targetExists) await renameBeside(parent, asideName, base, signal);
        rolledBack = true;
      } catch {
        // 回滚失败：落入下方的人工指引分支，把位置交代清楚
      }
      if (rolledBack) {
        throw new Error(`解压归档失败：${friendlyReason(err)}。已自动还原到恢复前状态，数据未丢失，可处理后重试`);
      }
      throw new Error(aside
        ? `解压归档失败：${friendlyReason(err)}，且自动还原未成功。原数据完好保存在 ${aside}，把它改名回 "${dshHome}" 即可回到恢复前状态`
        : `解压归档失败：${friendlyReason(err)}，且清理未成功。半截解压产物在 ${dshHome}，删除后即可重试`);
```

</details>

**依据 2 · 源码核查**：[lib/index.js:2943-2965](https://github.com/xiaoyuyu6420/dsh-backup/blob/b4e773c0510c3a71432c43343045d807e4a79c66/lib/index.js#L2943-L2965)

凭据恢复在回滚分支之后。

<details>
<summary>查看原文（23行）</summary>

```text
    // vault 还原：脱敏归档恢复出的 ~/.dsh 不含凭据文件，从本机 vault 拷回。
    // vault 为空（跨机首恢复）时逐项记入 missing，由调用方提示重填——凭据
    // 无法从归档恢复是脱敏设计的直接代价，明确告知优于静默缺文件。
    const vaultRestored = [];
    const vaultMissing = [];
    if (Array.isArray(redactedFiles) && redactedFiles.length) {
      const vaultDir = `${root}/${VAULT_DIR}`;
      for (const rel of redactedFiles) {
        const src = `${vaultDir}/${rel}`;
        const have = await fsStat(src).then(() => true, (err) => {
          if (err && err.code === 'ENOENT') return false;
          throw err;
        });
        if (!have) {
          vaultMissing.push(rel);
          continue;
        }
        const dst = `${dshHome}/${rel}`;
        await mkdir(dirname(dst), { recursive: true });
        await copyFile(src, dst);
        vaultRestored.push(rel);
      }
    }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:2967-2995](https://github.com/xiaoyuyu6420/dsh-backup/blob/b4e773c0510c3a71432c43343045d807e4a79c66/lib/index.js#L2967-L2995)

依赖安装和结果分别记录。

<details>
<summary>查看原文（29行）</summary>

```text
    // 可选依赖重装：node_modules 不随归档，--sync-deps 对每个恢复出的 profile
    // 跑 pnpm install --frozen-lockfile（与 DSH 自身的装配套路一致）。pnpm
    // 不可用时降级为提示，不判恢复失败——配置与会话已经恢复到位。
    const deps = { installed: [], failed: [], note: null };
    if (opts?.syncDeps && profileDirs.length) {
      try {
        const pnpm = await ctx.subprocess.resolveExecutable('pnpm');
        for (const p of profileDirs) {
          try {
            await spawnRun([pnpm, 'install', '--frozen-lockfile'], `${dshHome}/profiles/${p}`, signal);
            deps.installed.push(p);
          } catch (err) {
            // lockfile 与声明漂移时 frozen 会失败：退回普通 install 再试一次
            try {
              await spawnRun([pnpm, 'install'], `${dshHome}/profiles/${p}`, signal);
              deps.installed.push(p);
            } catch (err2) {
              deps.failed.push(p);
            }
          }
        }
      } catch {
        deps.note = '未找到 pnpm，请在各 profile 目录手动执行 pnpm install';
      }
    }

    return {
      archive, files: entries.length, sample: [], aside, snapshotPath: snapshot ? snapshot.path : null, dryRun: false,
      preflight: preflightLines(preflight, profileDirs), vaultRestored, vaultMissing, deps, profiles: profileDirs,
```

</details>

#### 缺口

- 未实际模拟终止、权限失败及跨机 vault 缺失。
  **影响**：完整恢复和人工回退耗时未知。
  **进一步探讨**：在独立目录对解压和 vault 分别注入失败并核对原名和副本。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样先验证一份备份可用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

用独立可抛弃 DSH 数据目录和测试档案，确保归档、锁与凭据库在替换目标之外。先选固定档案执行预览及校验，再验证会话和依赖；不启用外部同步。恢复需要本地磁盘、归档工具和必要的宿主能力，跨机缺凭据需重新配置。若会话打不开、原目录和恢复状态无法对账，停止后续操作并按保留副本恢复。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:2724-2731](https://github.com/xiaoyuyu6420/dsh-backup/blob/b4e773c0510c3a71432c43343045d807e4a79c66/lib/index.js#L2724-L2731)

选档与强制校验。

```text
  async function restoreArchiveInner(selector, dryRun, signal, opts = {}) {
    const { home, dshHome, root } = paths();
    const picked = await pickArchive(selector);
    const archive = `${root}/${picked.name}`;

    // 恢复前强制校验：损坏的归档绝不覆盖现有数据。
    const v = await verifyOne(picked.name, home, signal);
    if (!v.ok) throw new Error(`校验未通过（${v.note}），恢复已中止`);
```

**依据 2 · 源码核查**：[lib/index.js:2900-2917](https://github.com/xiaoyuyu6420/dsh-backup/blob/b4e773c0510c3a71432c43343045d807e4a79c66/lib/index.js#L2900-L2917)

归档目录放置及快照。

<details>
<summary>查看原文（18行）</summary>

```text
    // Moving DSH_HOME would also move the selected archive, vault and operation
    // lock. Require relocating the complete backup directory before replacement.
    if (backupRootRelative(dshHome, root) !== null) {
      throw new Error('整包恢复前请把整个备份目录（含 vault）移到 DSH_HOME 外，并更新备份路径；当前备份目录位于待替换的数据目录内');
    }

    // 恢复前自动快照当前数据，并把当前数据移到旁边（而非合并覆盖）。
    // 快照用 dsh-pre-restore- 前缀与用户常规备份区分，经 listBackups 过滤
    // 后不进列表/轮换/latest 选择；每次恢复清掉上一次的快照防累积。
    const snapshot = targetExists
      ? await doBackup(undefined, signal, { namePrefix: 'dsh-pre-restore-', skipVault: true, skipRotate: true })
      : null;
    if (snapshot) await prunePreRestoreSnapshots([snapshot.name, picked.name], signal);
    const asideName = `${base}.pre-restore-${stampNow()}`;
    let aside = null;
    if (targetExists) {
      await renameBeside(parent, base, asideName, signal);
      aside = `${parent}/${asideName}`;
```

</details>

**依据 3 · 源码核查**：[lib/index.js:2943-2995](https://github.com/xiaoyuyu6420/dsh-backup/blob/b4e773c0510c3a71432c43343045d807e4a79c66/lib/index.js#L2943-L2995)

恢复凭据和依赖条件。

<details>
<summary>查看原文（53行）</summary>

```text
    // vault 还原：脱敏归档恢复出的 ~/.dsh 不含凭据文件，从本机 vault 拷回。
    // vault 为空（跨机首恢复）时逐项记入 missing，由调用方提示重填——凭据
    // 无法从归档恢复是脱敏设计的直接代价，明确告知优于静默缺文件。
    const vaultRestored = [];
    const vaultMissing = [];
    if (Array.isArray(redactedFiles) && redactedFiles.length) {
      const vaultDir = `${root}/${VAULT_DIR}`;
      for (const rel of redactedFiles) {
        const src = `${vaultDir}/${rel}`;
        const have = await fsStat(src).then(() => true, (err) => {
          if (err && err.code === 'ENOENT') return false;
          throw err;
        });
        if (!have) {
          vaultMissing.push(rel);
          continue;
        }
        const dst = `${dshHome}/${rel}`;
        await mkdir(dirname(dst), { recursive: true });
        await copyFile(src, dst);
        vaultRestored.push(rel);
      }
    }

    // 可选依赖重装：node_modules 不随归档，--sync-deps 对每个恢复出的 profile
    // 跑 pnpm install --frozen-lockfile（与 DSH 自身的装配套路一致）。pnpm
    // 不可用时降级为提示，不判恢复失败——配置与会话已经恢复到位。
    const deps = { installed: [], failed: [], note: null };
    if (opts?.syncDeps && profileDirs.length) {
      try {
        const pnpm = await ctx.subprocess.resolveExecutable('pnpm');
        for (const p of profileDirs) {
          try {
            await spawnRun([pnpm, 'install', '--frozen-lockfile'], `${dshHome}/profiles/${p}`, signal);
            deps.installed.push(p);
          } catch (err) {
            // lockfile 与声明漂移时 frozen 会失败：退回普通 install 再试一次
            try {
              await spawnRun([pnpm, 'install'], `${dshHome}/profiles/${p}`, signal);
              deps.installed.push(p);
            } catch (err2) {
              deps.failed.push(p);
            }
          }
        }
      } catch {
        deps.note = '未找到 pnpm，请在各 profile 目录手动执行 pnpm install';
      }
    }

    return {
      archive, files: entries.length, sample: [], aside, snapshotPath: snapshot ? snapshot.path : null, dryRun: false,
      preflight: preflightLines(preflight, profileDirs), vaultRestored, vaultMissing, deps, profiles: profileDirs,
```

</details>

**依据 4 · 作者声明**：[README.md:103-109](https://github.com/xiaoyuyu6420/dsh-backup/blob/b4e773c0510c3a71432c43343045d807e4a79c66/README.md#L103-L109)

按类型与敏感凭据归档提示。

```text
## 分类型备份

只想备份/恢复某几类数据？`--types`（或 `--only`）按内容类型子集操作，可选类型：`credentials`（凭据/api key）、`mcp`（MCP 配置）、`skills`（技能）、`sessions`（会话）、`settings`（设置）、`profiles`（插件 profiles）。

- **备份**：`/backup --types skills,sessions` 生成 `dsh-t-` 前缀的子集归档，与全量备份分开轮换、互不挤占保留份数
- **恢复**：`/backup restore <归档名> --types skills` 只把 skills 合并回现有 `~/.dsh`（先 `--dry-run` 预览；覆盖的现有文件自动留档 `.pre-merge-*`），其他类型完全不碰
- **凭据类型特殊**：`--types credentials` 会把 api key **明文**打进归档（默认全量备份是脱敏的）——这类归档绝不进 GitHub 同步，仅建议本机保存或手动拷到新机
```

#### 缺口

- 磁盘峰值和宿主兼容未测。
  **影响**：无法预测实际维护成本。
  **进一步探讨**：在一次性目录记录耗时、空间和兼容检查。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 阶段回执能否减少中断后猜测？

**研究主题**：新假设与验证

#### 完整回答

可为快照、移旁、解压、凭据还原及依赖恢复分别记录稳定状态与可读回的目录标识。现有快照和副本可作恢复输入。比较在各阶段中断后用户定位原件、判断重试与恢复的时间；若回执与磁盘状态不能可靠核对，仍不能自动重试。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:2906-2940](https://github.com/xiaoyuyu6420/dsh-backup/blob/b4e773c0510c3a71432c43343045d807e4a79c66/lib/index.js#L2906-L2940)

存在移旁与解压的状态差。

<details>
<summary>查看原文（35行）</summary>

```text
    // 恢复前自动快照当前数据，并把当前数据移到旁边（而非合并覆盖）。
    // 快照用 dsh-pre-restore- 前缀与用户常规备份区分，经 listBackups 过滤
    // 后不进列表/轮换/latest 选择；每次恢复清掉上一次的快照防累积。
    const snapshot = targetExists
      ? await doBackup(undefined, signal, { namePrefix: 'dsh-pre-restore-', skipVault: true, skipRotate: true })
      : null;
    if (snapshot) await prunePreRestoreSnapshots([snapshot.name, picked.name], signal);
    const asideName = `${base}.pre-restore-${stampNow()}`;
    let aside = null;
    if (targetExists) {
      await renameBeside(parent, base, asideName, signal);
      aside = `${parent}/${asideName}`;
    }
    try {
      const tar = await ctx.subprocess.resolveExecutable('tar');
      await spawnRun([tar, '-xzf', workName, '-C', parentTar(parent)], root, signal);
    } catch (err) {
      // 挪旁之后解压失败会让 .dsh 处于空位——这是恢复流程里用户最容易慌
      // 的时刻。尽力自动回滚：清掉半截解压产物、把原数据改回原名；连回滚
      // 都失败时，错误消息必须带上数据位置和手工还原方法，绝不抛裸异常。
      const reason = err && err.message ? err.message : String(err);
      let rolledBack = false;
      try {
        await rm(dshHome, { recursive: true, force: true });
        if (targetExists) await renameBeside(parent, asideName, base, signal);
        rolledBack = true;
      } catch {
        // 回滚失败：落入下方的人工指引分支，把位置交代清楚
      }
      if (rolledBack) {
        throw new Error(`解压归档失败：${friendlyReason(err)}。已自动还原到恢复前状态，数据未丢失，可处理后重试`);
      }
      throw new Error(aside
        ? `解压归档失败：${friendlyReason(err)}，且自动还原未成功。原数据完好保存在 ${aside}，把它改名回 "${dshHome}" 即可回到恢复前状态`
        : `解压归档失败：${friendlyReason(err)}，且清理未成功。半截解压产物在 ${dshHome}，删除后即可重试`);
```

</details>

**依据 2 · 源码核查**：[lib/index.js:2943-2995](https://github.com/xiaoyuyu6420/dsh-backup/blob/b4e773c0510c3a71432c43343045d807e4a79c66/lib/index.js#L2943-L2995)

解压后还有独立阶段。

<details>
<summary>查看原文（53行）</summary>

```text
    // vault 还原：脱敏归档恢复出的 ~/.dsh 不含凭据文件，从本机 vault 拷回。
    // vault 为空（跨机首恢复）时逐项记入 missing，由调用方提示重填——凭据
    // 无法从归档恢复是脱敏设计的直接代价，明确告知优于静默缺文件。
    const vaultRestored = [];
    const vaultMissing = [];
    if (Array.isArray(redactedFiles) && redactedFiles.length) {
      const vaultDir = `${root}/${VAULT_DIR}`;
      for (const rel of redactedFiles) {
        const src = `${vaultDir}/${rel}`;
        const have = await fsStat(src).then(() => true, (err) => {
          if (err && err.code === 'ENOENT') return false;
          throw err;
        });
        if (!have) {
          vaultMissing.push(rel);
          continue;
        }
        const dst = `${dshHome}/${rel}`;
        await mkdir(dirname(dst), { recursive: true });
        await copyFile(src, dst);
        vaultRestored.push(rel);
      }
    }

    // 可选依赖重装：node_modules 不随归档，--sync-deps 对每个恢复出的 profile
    // 跑 pnpm install --frozen-lockfile（与 DSH 自身的装配套路一致）。pnpm
    // 不可用时降级为提示，不判恢复失败——配置与会话已经恢复到位。
    const deps = { installed: [], failed: [], note: null };
    if (opts?.syncDeps && profileDirs.length) {
      try {
        const pnpm = await ctx.subprocess.resolveExecutable('pnpm');
        for (const p of profileDirs) {
          try {
            await spawnRun([pnpm, 'install', '--frozen-lockfile'], `${dshHome}/profiles/${p}`, signal);
            deps.installed.push(p);
          } catch (err) {
            // lockfile 与声明漂移时 frozen 会失败：退回普通 install 再试一次
            try {
              await spawnRun([pnpm, 'install'], `${dshHome}/profiles/${p}`, signal);
              deps.installed.push(p);
            } catch (err2) {
              deps.failed.push(p);
            }
          }
        }
      } catch {
        deps.note = '未找到 pnpm，请在各 profile 目录手动执行 pnpm install';
      }
    }

    return {
      archive, files: entries.length, sample: [], aside, snapshotPath: snapshot ? snapshot.path : null, dryRun: false,
      preflight: preflightLines(preflight, profileDirs), vaultRestored, vaultMissing, deps, profiles: profileDirs,
```

</details>

#### 缺口

- 逐阶段回执未实现。
  **影响**：实际恢复收益未知。
  **进一步探讨**：在同一测试档案上重复阶段中断。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
