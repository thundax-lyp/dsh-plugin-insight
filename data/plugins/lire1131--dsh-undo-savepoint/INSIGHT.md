# dsh-undo-savepoint

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[528a8a6](https://github.com/lire1131/dsh-undo-savepoint/tree/528a8a6f27e22c46d9709e7dee01e6cd5b22e367)

<!-- BEGIN META -->
[![GitHub ★ 194](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=194&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/lire1131/dsh-undo-savepoint) [![npm 30d 5,289](https://img.shields.io/static/v1?label=npm+30d&message=5%2C289&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-undo-savepoint) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-undo-savepoint)
<!-- END META -->

> **功能**：为DSH配置与插件代码保存恢复点并提供宿主及局外急救入口，逐文件恢复和秘密副本仍需独立核验。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 限定配置/插件捕获与pre恢复、敏感占位拒写/字节回读/结果报告改善人工备份接线，外部面和作者跨平台声明不当本轮验收。

> **主要限制**：[Q03](#research-q03) 逐文件覆盖无整批补偿且快照非整树，missing/skipped仍ok；手写route仅Origin约束、全局准入未核，vault真实秘密副本不是脱敏即安全。

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
  - [Q01 · 这个savepoint保护什么，和项目Git回退有什么区别？](#detail-section-11)
  - [Q02 · 捕获和恢复主链有哪些实际保护？](#detail-section-12)
  - [Q03 · 整树、并发、权限和ok的边界是什么？](#detail-section-13)
  - [Q04 · 怎样限定采用及验证分阶段恢复收据？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：频繁改DSH配置/插件的用户要从坏配置恢复，需字节/依赖/重启正确，不是任意项目工作树撤销。

独立备份profile/settings与重装插件；本包自动组织/明细/局外救援，不保证全资源事务。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 配置/插件快照 | 变更恢复资料 | 扩展/限额过滤非整树，秘密vault另存 |
| undo/redo/restore | 逐文件回写 | pre恢复与明细，非全批补偿 |
| 依赖/重启提示 | 恢复后可运行性 | 可选install/needsRestart，不单ok验收 |
| 宿主/局外急救 | DSH挂时管理 | 独立面权限/功能须分别验 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=20/兼容DSH profile | 宿主模式必需 | tools/prompt/web | 宽engine非同版验收 |
| 可写快照/blob/vault目录 | 必需 | 捕获/恢复 | 独立备份/权限需核 |
| 插件依赖/包管理器 | 恢复后按需 | 还原依赖状态 | needsRestart/install另验 |
| 精确DSH_HOME/profile | 安全前提 | 避错实例配置 | 先隔离假home |
| 宿主/局外接口授权 | 采用前提 | 高权恢复/修复入口 | Origin非身份授权证明 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 隔离 | 假home/profile/插件和独立备份 | 不用真实秘密/唯一树 |
| 捕获 | 核manifest过滤/截断/vault | 不当整树 |
| 恢复 | 对照字节/missing/skipped/新增文件 | ok不单验收 |
| 运行 | 单独核依赖/重启/接口权限 | 非所有恢复都立即生效 |
| 退出 | 停接口/服务并保库/vault/日志 | 秘密副本另处理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | Node/宿主/备份磁盘 | home/profile/权限/范围核 | 金额工时未知 |
| 持续 | watch/快照/blob/vault | 缺失/截断/隐私维护 | 原秘密副本留本机 |
| 失败恢复 | 重复写/install/重启 | 查部分恢复/实际字节/依赖 | 停机与恢复量未知 |
| 退出 | 快照/日志/秘密留存 | 备份后卸挂载并停局外服务 | 未验自动清除 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 捕获 | 定域/代码blob/manifest | 全文件/所有资源完整性 |
| 恢复保护 | pre/temp rename/敏感拒写回读 | 多文件/多进程/重启可用 |
| 报告 | missing/skipped/needsRestart | 用户是否误认整批成功 |
| 急救 | 作者宿主/局外入口 | 全功能与接口授权验收 |

> **思考**：[Q03](#research-q03) 逐文件覆盖无整批补偿且快照非整树，missing/skipped仍ok；手写route仅Origin约束、全局准入未核，vault真实秘密副本不是脱敏即安全。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 限定配置/插件捕获与pre恢复、敏感占位拒写/字节回读/结果报告改善人工备份接线，外部面和作者跨平台声明不当本轮验收。

[Q02](#research-q02) 恢复前点/敏感0600与占位拒写/回读保护可借鉴；[Q03](#research-q03) 单文件原子非全批事务、快照过滤非整树、失败/身份与秘密留存需显式。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 逐文件覆盖无整批补偿且快照非整树，missing/skipped仍ok；手写route仅Origin约束、全局准入未核，vault真实秘密副本不是脱敏即安全。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 观察，先隔离假home+非敏感副本核范围、接口权限、部分恢复与重启，独立备份不省；错恢复/缺失停写查明细/字节，回人工备份。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核固定发布lib配置/插件快照恢复主链、vault/限额与宿主route；未运行目标/服务/测试，不全审ZIP/会话修复/doctor/safe-mode或局外鉴权。

- 已检查：作者 README、包清单、源码路径 README.md、lib/base.mjs、lib/core.mjs、lib/index.js、lib/snapshot.mjs、lib/spec.json、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：发布lib snapshot/base/core恢复主链与index准入/挂点；不审全部千行插件、ZIP/消息撤回/doctor/safe-mode/局外server，不运行目标。
- 下一步：[Q04](#research-q04) 第N写失败/blob缺/prune/新增文件/多进程/vault miss矩阵，核误完成/恢复停机与权限，未执行。

**分析版本**

- **仓库**：[lire1131/dsh-undo-savepoint](https://github.com/lire1131/dsh-undo-savepoint)
- **版本号**：0.5.0（[固定提交 528a8a6](https://github.com/lire1131/dsh-undo-savepoint/tree/528a8a6f27e22c46d9709e7dee01e6cd5b22e367)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 未验证内容版本/持久阶段收据、partial语义与前置预检，参照已有pre/明细/回读，用故障并发矩阵比误认恢复和停机成本。

[Q04](#research-q04) 第N写失败/blob缺/prune/新增文件/多进程/vault miss矩阵，核误完成/恢复停机与权限，未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 2257 | — | — | 43759 |
| .mjs | source | 29 | 14135 | 11349 | 2281 | — |
| .js | source | 3 | 5356 | 4854 | 473 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/lire1131/dsh-undo-savepoint/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=5&color=737b86&logo=github)](https://github.com/lire1131/dsh-undo-savepoint/issues?q=is%3Aissue+created%3A2026-10-03T05%3A16%3A13.796Z..2026-11-02T05%3A16%3A13.796Z) [![近30天关闭 8](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=8&color=737b86&logo=github)](https://github.com/lire1131/dsh-undo-savepoint/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T05%3A16%3A13.796Z..2026-11-02T05%3A16%3A13.796Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：配置/插件快照恢复有哪些实际保护，范围/部分失败与权限如何影响采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 这个savepoint保护什么，和项目Git回退有什么区别？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

原生DSH插件带客户端及局外CLI/GUI/Web工具，重点是配置和插件代码改坏时保存/恢复、启动故障救援；不是把任意项目工作树和模型历史共同回滚。另有message rollback/scan/doctor面，本轮不将未全审的独立面当配置恢复保证。用户需愿意运维DSH profile且保独立备份，尤其插件改动/升级较多者；基线是手工备份settings/profile与重装插件。

实际增量是定域快照、恢复前保险点、差异/恢复报告与宿主起不来时可用的外部入口，已有模型/宿主能力分开。作者宣称跨平台/CI/自愈是线索非本轮执行；合格结果为选定配置/代码字节正确、秘密未错置、依赖/重启后宿主可用，不是按钮ok或目录有快照。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-27](https://github.com/lire1131/dsh-undo-savepoint/blob/528a8a6f27e22c46d9709e7dee01e6cd5b22e367/package.json#L1-L27)

插件/子客户端及Node、发布版本。

<details>
<summary>查看原文（27行）</summary>

```text
{
  "name": "dsh-undo-savepoint",
  "version": "0.5.0",
  "description": "DSH undo/rollback system: snapshot config files on change, undo/redo the last action from the WebUI or by chat, and roll back broken plugin trees without reinstalling. Works even when DSH fails to boot (offline CLI + GUI).",
  "type": "module",
  "icon": "./tools/webui/logo.png",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "scripts": {
    "test": "node tools/check-size.mjs && node tools/check-client-exports.mjs && node tools/check-version.mjs && node tools/check-routes.mjs && node tools/smoke-test.mjs && node tools/host-api-smoke.mjs && node tools/undo-server-smoke.mjs && node tools/home-resolution-test.mjs && node tools/e2e-watch.mjs",
    "prepublishOnly": "npm test"
  },
  "engines": {
    "dsh": ">=0.0.1-0 || >=0.1.0-rc.2 || >=0.1.1-rc.1 || >=0.1.2-alpha.2 || >=0.1.2-rc.1 || >=0.1.5-rc.1 || >=0.1.5-rc.2 || >=0.2.0-rc.2 || >=0.2.1-0",
    "node": ">=20.0.0"
  },
  "dsh": {
    "runtime": "host",
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
```

</details>

**依据 2 · 作者声明**：[README.md:7-10](https://github.com/lire1131/dsh-undo-savepoint/blob/528a8a6f27e22c46d9709e7dee01e6cd5b22e367/README.md#L7-L10)

作者安全管家定位。

```text

**为 [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) 打造的安全管家：改设置自动存档，一键撤销 / 恢复 / 回退到任意版本；主动体检、升级护航、崩溃自愈；DSH 起不来时局外 WebUI / GUI / CLI 依然可用。**

管家的做事方式是主动检查，有异常才说话，正常时安静。启动 30 秒后完成第一次体检；崩溃后给出可回退的最后正常快照；检测到 DSH 版本变化时先打升级保险快照再放行。
```

**依据 3 · 作者声明**：[README.md:74-95](https://github.com/lire1131/dsh-undo-savepoint/blob/528a8a6f27e22c46d9709e7dee01e6cd5b22e367/README.md#L74-L95)

作者急救与依赖分工。

<details>
<summary>查看原文（22行）</summary>

```text
## 崩溃急救速查（按场景选工具）

| 场景 | 操作 |
|---|---|
| 配置 / 插件被改坏 | 对话 / WebUI / CLI：`undo` 或 `restore -Id <id>` |
| 插件代码被改坏 | 同上（快照含插件代码树，一键还原） |
| 上次异常退出，不知回退到哪 | WebUI / GUI 横幅显示 last-good 快照，一键回退 |
| **DSH 完全起不来** | 桌面「DSH撤销管理器」→ **安全模式**按钮（或 CLI `safe-mode -Label on`）→ 重启 DSH 保证能启动 |
| 崩溃横幅提示会话损坏 | 对话 / CLI：`undo_scan quarantine=true` 修复（或离线 `dsh-undo.ps1 scan --fix`） |
| 恢复后可能缺插件（跨机） | 恢复报告预检提示；先装插件或进安全模式 |
| 配置「突然变了」 | CLI `recent` / 对话 `undo_recent` 查回滚日志 |
| 撤销涉及插件 / 挂载 | 报告提示「重启 DSH 后生效」 |

| 安全模式确认：一键禁用除本插件外的全部用户插件，保证 DSH 能启动，之后再逐个排查 |
|---|
| ![safemode](https://cdn.jsdelivr.net/gh/lire1131/dsh-undo-savepoint@master/docs/shots/safe-mode-confirm.png) |

## 安装

前置：已安装 DSH（`@deepseek-ai/dsh`）与 Node.js（≥20）。宿主模式运行于提供
tools / systemPrompt / webServer 服务的 profile（Web 型 profile 均满足）；
DSH 完全无法启动时改用局外 CLI / GUI，不依赖宿主。
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 捕获和恢复主链有哪些实际保护？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

FILE_SPECS指定profile/home配置文件，插件代码只选扩展名、排目录/文件且每文件256KiB、每插件约5MiB；manifest含skipped/truncated。敏感模式可将配置脱敏入快照，真实值另存本机内容寻址env-vault，不随普通导出；这不是不存在秘密副本或加密证明。

restore先hasOpenTurn阻活跃回合，选目标、createSnapshot(pre-restore)后复核目标未被prune；undo/restore逐文件apply，temp+rename重试。敏感YAML含占位符拒写，敏感文件先0600写并对有before文件回读失配恢复原内容，插件/路径名有safeRel和当前discover目录保护。恢复后ensureMount、标needsRestart、可选syncDeps、依赖预检并记日志，最后ok附restored/missing/notes/skipped。这些是具体恢复防护，不以“有备份”替代主链核验。

#### 证据与依据

**依据 1 · 源码核查**：[lib/spec.json:1-17](https://github.com/lire1131/dsh-undo-savepoint/blob/528a8a6f27e22c46d9709e7dee01e6cd5b22e367/lib/spec.json#L1-L17)

配置/代码范围与大小。

<details>
<summary>查看原文（17行）</summary>

```text
{
  "configFiles": [
    { "root": "profile", "rel": "cordis.patch.yml" },
    { "root": "profile", "rel": "package.json" },
    { "root": "profile", "rel": "cordis.yml" },
    { "root": "profile", "rel": "pnpm-workspace.yaml" },
    { "root": "profile", "rel": "pnpm-lock.yaml" },
    { "root": "home", "rel": "cordis.patch.yml" },
    { "root": "home", "rel": "settings.yaml" },
    { "root": "home", "rel": ".env" },
    { "root": "home", "rel": ".credentials.yaml" }
  ],
  "pluginCodeExts": [".js", ".mjs", ".cjs", ".ts", ".mts", ".cts", ".json", ".yml", ".yaml"],
  "pluginExcludeDirNames": ["node_modules", ".git", "dist", "build", "cache", ".cache", "coverage", ".turbo"],
  "pluginExcludeFileNames": ["package-lock.json", "pnpm-lock.yaml", "yarn.lock", ".DS_Store"],
  "pluginMaxFileBytes": 262144,
  "pluginMaxSnapshotBytes": 5242880
```

</details>

**依据 2 · 源码核查**：[lib/snapshot.mjs:83-132](https://github.com/lire1131/dsh-undo-savepoint/blob/528a8a6f27e22c46d9709e7dee01e6cd5b22e367/lib/snapshot.mjs#L83-L132)

真实捕获/脱敏/vault/插件记录。

<details>
<summary>查看原文（50行）</summary>

```text
async function createSnapshot(cfg, kind, reason, opts = {}) {
  const base = kind === 'manual' ? cfg.manualDir : cfg.autoDir;
  await fs.mkdir(base, { recursive: true });
  let id;
  do {
    id = makeId();
  } while (await pathExists(join(base, id)));
  const dir = join(base, id);
  await fs.mkdir(dir, { recursive: true });
  const files = [];
  const envVaultRefs = {};
  const redacted = [];
  const redactedPreexisting = [];
  for (const spec of FILE_SPECS) {
    const src = filePath(cfg, spec);
    if (!(await pathExists(src))) continue;
    const name = destName(spec);
    const dest = join(dir, name);
    const buf = await fs.readFile(src);
    if (SENSITIVE_DESTS.has(name) && isRedacting(cfg)) {
      const text = buf.toString('utf8');
      const redactedText = isYamlDest(name) ? redactYamlContent(text) : redactEnvContent(text);
      await fs.writeFile(dest, redactedText, 'utf8');
      // #41 守卫一：活文件内容已含占位符（被先前脱敏文本污染）⇒ 拒绝把污染文本入库为
      // 「真值」，否则还原时会把占位符当真值写回（W36 之前是非法 YAML）。快照目录仍写
      // 脱敏副本（真实性记录），还原侧由守卫二拒写。正常文件不受影响。
      if (text.includes(REDACTED_PLACEHOLDER)) {
        redactedPreexisting.push(name);
      } else {
        const sha = sha1Hex(buf);
        await writeVault(cfg, sha, buf);
        envVaultRefs[name] = sha;
      }
      redacted.push(name);
      files.push({ name, size: Buffer.byteLength(redactedText) });
      continue;
    }
    await fs.copyFile(src, dest);
    files.push({ name, size: buf.length });
  }
  const plugins = [];
  for (const p of await discoverPlugins(cfg)) {
    const tree = await collectPluginTree(cfg, p.dir);
    const refs = [];
    for (const f of tree.files) {
      await writeBlob(cfg, f.hash, await fs.readFile(f.abs));
      refs.push({ path: f.rel, hash: f.hash, size: f.size });
    }
    plugins.push({ name: p.name, dir: p.dir, version: p.version, files: refs, skipped: tree.skipped, truncated: tree.truncated });
  }
```

</details>

**依据 3 · 源码核查**：[lib/base.mjs:300-318](https://github.com/lire1131/dsh-undo-savepoint/blob/528a8a6f27e22c46d9709e7dee01e6cd5b22e367/lib/base.mjs#L300-L318)

本机vault字节写入无加密实现。

<details>
<summary>查看原文（19行）</summary>

```text

/** 本机 vault：<autoDir>/env-vault/<内容sha1>.env（内容寻址去重，不随导出带走）。 */
function vaultDir(cfg) {
  return join(cfg.autoDir, 'env-vault');
}
async function writeVault(cfg, sha1, buf) {
  const dir = vaultDir(cfg);
  const target = join(dir, `${sha1}.env`);
  if (await pathExists(target)) return;
  await fs.mkdir(dir, { recursive: true });
  const tmp = `${target}.tmp`;
  await fs.writeFile(tmp, buf);
  await fs.rename(tmp, target).catch(() => { /* 并发写入已存在 */ });
}
async function readVault(cfg, sha1) {
  try { return await fs.readFile(join(vaultDir(cfg), `${sha1}.env`)); } catch { return null; }
}

/**
```

</details>

**依据 4 · 源码核查**：[lib/core.mjs:207-265](https://github.com/lire1131/dsh-undo-savepoint/blob/528a8a6f27e22c46d9709e7dee01e6cd5b22e367/lib/core.mjs#L207-L265)

敏感拒写/temp/rename/回读保护。

<details>
<summary>查看原文（59行）</summary>

```text
  const restored = [];
  const missing = [];
  const notes = [];
  const skipped = [];
  const hashes = new Map();
  for (const file of (snap.files ?? [])) {
    const spec = findSpec(file.name);
    if (!spec) continue;
    const src = join(snap._dir, file.name);
    if (!(await pathExists(src))) continue;
    let buf = await fs.readFile(src);
    let sensitiveNote = null;
    if (SENSITIVE_DESTS.has(file.name)) {
      const ref = snap.envVaultRefs?.[file.name];
      if (ref) {
        const real = await readVault(cfg, ref);
        if (real) buf = real;
        else sensitiveNote = `${file.name}: vault missing — redacted placeholder restored, please fill in the real values`;
      } else if (snap.sensitiveMode === 'redact') {
        sensitiveNote = `${file.name}: restored as redacted placeholder (values were stripped from this snapshot)`;
      }
      // #41 守卫二（W49 起认 .yml，issue #39）：YAML 敏感文件的还原候选含占位符 ⇒ 拒写，
      // 活文件保持原样。命中面：vault 条目被历史版本污染 / vault miss 降级 / 无 ref 的老快照。
      // 后缀口径必须与 redactByDest / snapshot 采集一致，否则 .yml 会被判成「非候选」
      // 而把占位符写回活文件。.env 不拦：占位符 .env 语法合法，是文档化降级行为。
      if (isYamlDest(file.name) && buf.includes(REDACTED_PLACEHOLDER)) {
        skipped.push(`${file.name}: candidate content contains "${REDACTED_PLACEHOLDER}" — file skipped to keep the live file intact (#41)`);
        continue;
      }
    }
    const target = filePath(cfg, spec);
    await fs.mkdir(dirname(target), { recursive: true });
    const tmp = `${target}.undo-tmp`;
    // 增强写入即 0600：消除"先按默认 umask(0644) 落盘、恢复完才 chmod"的短暂窗口
    const sensitive = SENSITIVE_DESTS.has(file.name);
    // #41 守卫三（自愈兜底，对齐 #41 回复里的回读承诺）：敏感文件写前捕获原字节，
    // 写后字节级回读失配（部分写/盘面损坏）⇒ 回写原内容并记 skip。守卫二在前，
    // 本条理论不可达；before 为 null（活文件原本不存在）时跳过。
    const before = sensitive ? await fs.readFile(target).catch(() => null) : null;
    await fs.writeFile(tmp, buf, sensitive ? { mode: 0o600 } : undefined);
    await renameWithRetry(tmp, target);
    if (before) {
      const written = await fs.readFile(target).catch(() => null);
      if (!written || !written.equals(buf)) {
        const tmp2 = `${target}.undo-tmp`;
        await fs.writeFile(tmp2, before, { mode: 0o600 });
        await renameWithRetry(tmp2, target);
        skipped.push(`${file.name}: post-write verification failed — live file rolled back to pre-restore content (#41)`);
        continue;
      }
    }
    // #17: 恢复的敏感文件必须保持 owner-only(0600),否则 credentials-local
    // 在 POSIX 上拒绝启动(默认 umask 会让 writeFile 写出 0644)。
    if (SENSITIVE_DESTS.has(file.name)) {
      try { await fs.chmod(target, 0o600); } catch { /* 平台不支持则忽略 */ }
    }
    hashes.set(file.name, sha1Hex(buf));
    restored.push(file.name);
    if (sensitiveNote) notes.push(sensitiveNote);
```

</details>

**依据 5 · 源码核查**：[lib/core.mjs:1144-1186](https://github.com/lire1131/dsh-undo-savepoint/blob/528a8a6f27e22c46d9709e7dee01e6cd5b22e367/lib/core.mjs#L1144-L1186)

busy/pre恢复/目标prune复核/报告。

<details>
<summary>查看原文（43行）</summary>

```text
async function restore(cfg, mode, id, options = {}) {
  if (hasOpenTurn()) return busyError();
  const syncDeps = options.syncDeps === true;
  const list = await listSnapshots(cfg);
  if (mode === 'undo') {
    const cur = await currentState(cfg);
    const candidates = await undoCandidates(cfg, list);
    if (candidates.length === 0) return { ok: false, error: t('undo.nothing') };
    let target = candidates.find((c) => !sameState(cur, c.st)) ?? null;
    if (!target) {
      return {
        ok: true,
        unchanged: true,
        targetId: candidates[0].s.id,
        message: t('undo.alreadyMatches'),
      };
    }
    let stepped = target !== candidates[0];
    const pre = await createSnapshot(cfg, 'pre-restore', `before-restore:${target.s.id} (${target.s.kind}: ${target.s.reason ?? ''})`);
    // 拍 pre-restore 会顺带 pruneAuto：目标快照若在 auto store 且超出 keepAuto，可能就在
    // 这一刻被删掉。旧实现会让 applySnapshot 对着已消失的目录跑出一次静默的空成功
    // （restored 为空却报成功，用户以为回滚了，其实什么都没改）。这里重取候选，拿不到
    // 仍可读的目标就明确报错，绝不返回假成功。
    if (!(await pathExists(target.s._dir))) {
      const fresh = await undoCandidates(cfg, await listSnapshots(cfg));
      const alt = fresh.find((c) => !sameState(cur, c.st)) ?? null;
      if (!alt) return { ok: false, error: t('undo.targetGone') };
      target = alt;
      stepped = target !== fresh[0];
    }
    cfg.suppressAuto++;
    try {
      const { restored, missing, notes, skipped } = await applySnapshot(cfg, target.s);
      if (stepped) await markFlag(candidates[0].s, 'stepped', true);
      const remounted = await ensureMount(cfg);
      const needsRestart = testNeedsRestart(restored);
      const deps = await reconcileDependencies(cfg, restored, syncDeps);
      const preflight = await preflightSnapshot(cfg, target.s);
      await appendRollbackLog(cfg, { mode: 'undo', targetId: target.s.id, targetKind: target.s.kind, preSnapshotId: pre.id, files: restored, missing, notes, skipped, needsRestart, deps, preflightMissing: preflight.missing });
      return { ok: true, restored, missing, notes, skipped, needsRestart, deps, preflight, targetId: target.s.id, targetKind: target.s.kind, targetReason: target.s.reason, preSnapshotId: pre.id, stepped, remounted };
    } finally {
      cfg.suppressAuto--;
    }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 整树、并发、权限和ok的边界是什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

apply按snapshot列出的配置/插件/profile文件逐个覆盖；missing blob/目录不在discover等可记missing跳过，末尾ok仍真需看明细。已读代码没有删除当前插件目录中快照未列新增文件的步骤，故不能称回到精确整树；过滤/大小上限/静默readdir或stat失败也使捕获非完整，某些lib/dist资源不在范围。依赖预检在apply之后，不是写前完整兼容拒绝，重启/可选install还要另做。

每文件替换不等多文件事务，写第N文件失败可留下此前文件已恢复；restore finally只suppressAuto--，未见主链自动全批补偿或持久恢复phase。pre-restore是可选人工恢复路但不保证本次原子回滚。hasOpenTurn是时点检测非跨进程锁，同名target.undo-tmp与外部写者/并发局外工具冲突仍需验证，不推断已丢数据。

宿主/api/undo手写route所读准入只比较可选Origin与Host，无Origin脚本放行，未见该handler应用级owner校验；不据此断言可被未授权远端访问，宿主全局认证/部署需另核。敏感restore0600是积极措施，vault本机真实字节写默认权限并非加密，导出/ZIP和局外server鉴权未全审，不能把“脱敏快照”概括成秘密全生命周期安全。

#### 证据与依据

**依据 1 · 源码核查**：[lib/core.mjs:266-301](https://github.com/lire1131/dsh-undo-savepoint/blob/528a8a6f27e22c46d9709e7dee01e6cd5b22e367/lib/core.mjs#L266-L301)

只列文件写与missing，无新增文件删除。

<details>
<summary>查看原文（36行）</summary>

```text
  }
  const liveDirs = new Set((await discoverPlugins(cfg)).map((p) => p.dir));
  for (const p of (snap.plugins ?? [])) {
    if (!safeRel(p.name) || !liveDirs.has(p.dir)) {
      missing.push(`plugin ${p.name}: directory no longer present (${p.dir})`);
      continue;
    }
    for (const f of (p.files ?? [])) {
      if (!safeRel(f.path)) { missing.push(`${p.name}/${f.path}: unsafe path, skipped`); continue; }
      const buf = await readBlob(cfg, f.hash);
      if (!buf) { missing.push(`${p.name}/${f.path}: snapshot blob missing`); continue; }
      const target = join(p.dir, f.path);
      await fs.mkdir(dirname(target), { recursive: true });
      const tmp = `${target}.undo-tmp`;
      await fs.writeFile(tmp, buf);
      await renameWithRetry(tmp, target);
      const key = `plugin:${p.name}/${f.path}`;
      hashes.set(key, f.hash);
      restored.push(key);
    }
  }
  for (const f of (snap.profileFiles ?? [])) {
    if (!f.hash || !safeRel(f.path)) continue;
    const buf = await readBlob(cfg, f.hash);
    if (!buf) { missing.push(`profile:${f.path}: snapshot blob missing`); continue; }
    const target = join(rootDir(cfg, 'profile'), f.path);
    await fs.mkdir(dirname(target), { recursive: true });
    const tmp = `${target}.undo-tmp`;
    await fs.writeFile(tmp, buf);
    await renameWithRetry(tmp, target);
    const key = `profile:${f.path}`;
    hashes.set(key, f.hash);
    restored.push(key);
  }
  cfg.restoredHashes = hashes;
  return { restored, missing, notes, skipped };
```

</details>

**依据 2 · 源码核查**：[lib/base.mjs:654-684](https://github.com/lire1131/dsh-undo-savepoint/blob/528a8a6f27e22c46d9709e7dee01e6cd5b22e367/lib/base.mjs#L654-L684)

过滤/上限与失败跳过。

<details>
<summary>查看原文（31行）</summary>

```text
async function collectPluginTree(cfg, dir) {
  const files = [];
  const skipped = [];
  const dirs = [];
  let total = 0;
  let truncated = false;
  const walk = async (rel) => {
    if (truncated) return;
    let entries;
    try { entries = await fs.readdir(join(dir, rel), { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      const r = rel === '' ? e.name : `${rel}/${e.name}`;
      if (e.isDirectory()) {
        if (EXCLUDE_DIRS.has(e.name)) continue;
        dirs.push(r);
        await walk(r);
      } else if (e.isFile()) {
        if (!isCodeFile(e.name)) continue;
        const abs = join(dir, r);
        let st;
        try { st = await fs.stat(abs); } catch { continue; }
        if (st.size > MAX_FILE_BYTES) { skipped.push({ path: r, reason: 'too-large' }); continue; }
        if (total + st.size > MAX_SNAP_BYTES) { truncated = true; return; }
        const hash = sha1Hex(await fs.readFile(abs));
        files.push({ rel: r, abs, hash, size: st.size });
        total += st.size;
      }
    }
  };
  await walk('');
  return { files, skipped, truncated, dirs };
```

</details>

**依据 3 · 源码核查**：[lib/core.mjs:1211-1231](https://github.com/lire1131/dsh-undo-savepoint/blob/528a8a6f27e22c46d9709e7dee01e6cd5b22e367/lib/core.mjs#L1211-L1231)

逐批恢复/finally非全批补偿。

<details>
<summary>查看原文（21行）</summary>

```text
  let target = findSnapshot(list, id ?? '');
  if (!target) return { ok: false, error: t('undo.notFound', { id }) };
  const pre = await createSnapshot(cfg, 'pre-restore', `before-restore:${target.id} (${target.kind}: ${target.reason ?? ''})`);
  // 同 undo 分支：拍 pre-restore 可能把目标自己 prune 掉，复核目录仍在，否则明确报错。
  if (!(await pathExists(target._dir))) {
    const again = findSnapshot(await listSnapshots(cfg), target.id);
    if (!again) return { ok: false, error: t('undo.targetGone') };
    target = again;
  }
  cfg.suppressAuto++;
  try {
    const { restored, missing, notes, skipped } = await applySnapshot(cfg, target);
    const remounted = await ensureMount(cfg);
    const needsRestart = testNeedsRestart(restored);
    const deps = await reconcileDependencies(cfg, restored, syncDeps);
    const preflight = await preflightSnapshot(cfg, target);
    await appendRollbackLog(cfg, { mode: 'restore', targetId: target.id, targetKind: target.kind, preSnapshotId: pre.id, files: restored, missing, notes, skipped, needsRestart, deps, preflightMissing: preflight.missing });
    return { ok: true, restored, missing, notes, skipped, needsRestart, deps, preflight, targetId: target.id, targetKind: target.kind, targetReason: target.reason, preSnapshotId: pre.id, stepped: false, remounted };
  } finally {
    cfg.suppressAuto--;
  }
```

</details>

**依据 4 · 源码核查**：[lib/snapshot.mjs:40-68](https://github.com/lire1131/dsh-undo-savepoint/blob/528a8a6f27e22c46d9709e7dee01e6cd5b22e367/lib/snapshot.mjs#L40-L68)

预检仅解析候选，缺失条件。

<details>
<summary>查看原文（29行）</summary>

```text
async function preflightSnapshot(cfg, snap) {
  const names = new Set();
  const patchFile = (snap.files ?? []).find((f) => f.name === 'profile-cordis.patch.yml');
  if (patchFile) {
    try {
      const text = await fs.readFile(join(snap._dir, patchFile.name), 'utf8');
      for (const m of text.matchAll(/name:\s*['"]?([^'"\s]+)['"]?/g)) {
        const n = m[1];
        if (n.startsWith('./') || n.startsWith('../') || n.startsWith('/') || n.startsWith('\\')) continue; // 本地文件
        if (n === 'dsh-undo-savepoint') continue; // 自身永远在
        names.add(n);
      }
    } catch { /* patch 缺失则跳过 */ }
  }
  const pkgFile = (snap.files ?? []).find((f) => f.name === 'profile-package.json');
  if (pkgFile) {
    try {
      const pkg = JSON.parse(await fs.readFile(join(snap._dir, pkgFile.name), 'utf8'));
      for (const n of (pkg.dsh?.profile?.bundles ?? [])) {
        if (typeof n === 'string' && n !== 'dsh-undo-savepoint') names.add(n);
      }
    } catch { /* package.json 缺失则跳过 */ }
  }
  const missing = [];
  for (const n of names) {
    if (canResolveAny(cfg, n)) continue;
    missing.push(n);
  }
  return { missing, checked: names.size };
```

</details>

**依据 5 · 源码核查**：[lib/index.js:1344-1366](https://github.com/lire1131/dsh-undo-savepoint/blob/528a8a6f27e22c46d9709e7dee01e6cd5b22e367/lib/index.js#L1344-L1366)

手写route Origin准入。

<details>
<summary>查看原文（23行）</summary>

```text
    safeEffect(() => webServer.register({
      kind: 'prefix',
      path: '/api/undo',
      handler: async (req, res) => {
        try {
          const url = new URL(req.url ?? '/', 'http://dsh.local');
          const path = url.pathname;
          const method = (req.method ?? 'GET').toUpperCase();
          // M2 加固：跨站 CSRF 防护——浏览器跨源 POST 必带 Origin，与 Host 不符即拒；
          // 无 Origin（本机脚本/curl）放行。同源 UI 请求 Origin.host === Host，不受影响。
          const origin = req.headers?.origin;
          if (origin) {
            let ok = false;
            try {
              const o = new URL(origin);
              const host = String(req.headers?.host ?? '');
              ok = o.host === host && (o.protocol === 'http:' || o.protocol === 'https:');
            } catch { ok = false; }
            if (!ok) {
              return send(res, 403, { ok: false, error: { code: 'forbidden', message: 'cross-origin request rejected' } });
            }
          }
          if (method === 'GET' && path === '/api/undo/list') {
```

</details>

**依据 6 · 源码核查**：[lib/base.mjs:300-318](https://github.com/lire1131/dsh-undo-savepoint/blob/528a8a6f27e22c46d9709e7dee01e6cd5b22e367/lib/base.mjs#L300-L318)

vault本机存储范围。

<details>
<summary>查看原文（19行）</summary>

```text

/** 本机 vault：<autoDir>/env-vault/<内容sha1>.env（内容寻址去重，不随导出带走）。 */
function vaultDir(cfg) {
  return join(cfg.autoDir, 'env-vault');
}
async function writeVault(cfg, sha1, buf) {
  const dir = vaultDir(cfg);
  const target = join(dir, `${sha1}.env`);
  if (await pathExists(target)) return;
  await fs.mkdir(dir, { recursive: true });
  const tmp = `${target}.tmp`;
  await fs.writeFile(tmp, buf);
  await fs.rename(tmp, target).catch(() => { /* 并发写入已存在 */ });
}
async function readVault(cfg, sha1) {
  try { return await fs.readFile(join(vaultDir(cfg), `${sha1}.env`)); } catch { return null; }
}

/**
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样限定采用及验证分阶段恢复收据？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

建议观察，先隔离DSH_HOME/profile，非敏感配置和假插件副本核快照范围/缺失、恢复字节/重启，确认宿主与局外接口授权再评试用。保存点不能做唯一备份，不用真实凭据或唯一插件树探索；跨机导入、会话修复/安全模式需分别验，不因主恢复可用就授权全部修复。

首次Node>=20、精确profile、快照目录/权限和依赖准备；持续watch/定时快照、blob/vault磁盘和人工比对，恢复可能npm/pnpm网络安装及重启停任务，金额/耗时未知。失败保pre-restore和独立备份，停写核已恢复列表/实际文件，再人工选择恢复而非盲重复undo；退出先备份库/vault/日志和卸载挂载，局外server/服务进程独立停，真实秘密副本另处理。

未验证方向是持久阶段/逐文件结果与内容版本绑定的恢复收据，明确partial而不只ok，将目标缺失/依赖预检前置，并在用户选择下处理快照之外新增文件。参照已有preSnapshotId、missing/skipped、回读保护而非再造备份。隔离模拟第N文件写错、blob缺失、prune目标、额外文件、两个进程与vault miss；测错误“已恢复”判断和修复人工/停机。若现有报告已足够或新账本漂移/补偿风险超过收益则否定；未运行这些实验。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:18-27](https://github.com/lire1131/dsh-undo-savepoint/blob/528a8a6f27e22c46d9709e7dee01e6cd5b22e367/package.json#L18-L27)

运行依赖。

<details>
<summary>查看原文（10行）</summary>

```text
  "engines": {
    "dsh": ">=0.0.1-0 || >=0.1.0-rc.2 || >=0.1.1-rc.1 || >=0.1.2-alpha.2 || >=0.1.2-rc.1 || >=0.1.5-rc.1 || >=0.1.5-rc.2 || >=0.2.0-rc.2 || >=0.2.1-0",
    "node": ">=20.0.0"
  },
  "dsh": {
    "runtime": "host",
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
```

</details>

**依据 2 · 源码核查**：[lib/core.mjs:1162-1186](https://github.com/lire1131/dsh-undo-savepoint/blob/528a8a6f27e22c46d9709e7dee01e6cd5b22e367/lib/core.mjs#L1162-L1186)

已有pre/明细与恢复路。

<details>
<summary>查看原文（25行）</summary>

```text
    const pre = await createSnapshot(cfg, 'pre-restore', `before-restore:${target.s.id} (${target.s.kind}: ${target.s.reason ?? ''})`);
    // 拍 pre-restore 会顺带 pruneAuto：目标快照若在 auto store 且超出 keepAuto，可能就在
    // 这一刻被删掉。旧实现会让 applySnapshot 对着已消失的目录跑出一次静默的空成功
    // （restored 为空却报成功，用户以为回滚了，其实什么都没改）。这里重取候选，拿不到
    // 仍可读的目标就明确报错，绝不返回假成功。
    if (!(await pathExists(target.s._dir))) {
      const fresh = await undoCandidates(cfg, await listSnapshots(cfg));
      const alt = fresh.find((c) => !sameState(cur, c.st)) ?? null;
      if (!alt) return { ok: false, error: t('undo.targetGone') };
      target = alt;
      stepped = target !== fresh[0];
    }
    cfg.suppressAuto++;
    try {
      const { restored, missing, notes, skipped } = await applySnapshot(cfg, target.s);
      if (stepped) await markFlag(candidates[0].s, 'stepped', true);
      const remounted = await ensureMount(cfg);
      const needsRestart = testNeedsRestart(restored);
      const deps = await reconcileDependencies(cfg, restored, syncDeps);
      const preflight = await preflightSnapshot(cfg, target.s);
      await appendRollbackLog(cfg, { mode: 'undo', targetId: target.s.id, targetKind: target.s.kind, preSnapshotId: pre.id, files: restored, missing, notes, skipped, needsRestart, deps, preflightMissing: preflight.missing });
      return { ok: true, restored, missing, notes, skipped, needsRestart, deps, preflight, targetId: target.s.id, targetKind: target.s.kind, targetReason: target.s.reason, preSnapshotId: pre.id, stepped, remounted };
    } finally {
      cfg.suppressAuto--;
    }
```

</details>

**依据 3 · 源码核查**：[lib/core.mjs:1211-1231](https://github.com/lire1131/dsh-undo-savepoint/blob/528a8a6f27e22c46d9709e7dee01e6cd5b22e367/lib/core.mjs#L1211-L1231)

部分失败假设与结果基线。

<details>
<summary>查看原文（21行）</summary>

```text
  let target = findSnapshot(list, id ?? '');
  if (!target) return { ok: false, error: t('undo.notFound', { id }) };
  const pre = await createSnapshot(cfg, 'pre-restore', `before-restore:${target.id} (${target.kind}: ${target.reason ?? ''})`);
  // 同 undo 分支：拍 pre-restore 可能把目标自己 prune 掉，复核目录仍在，否则明确报错。
  if (!(await pathExists(target._dir))) {
    const again = findSnapshot(await listSnapshots(cfg), target.id);
    if (!again) return { ok: false, error: t('undo.targetGone') };
    target = again;
  }
  cfg.suppressAuto++;
  try {
    const { restored, missing, notes, skipped } = await applySnapshot(cfg, target);
    const remounted = await ensureMount(cfg);
    const needsRestart = testNeedsRestart(restored);
    const deps = await reconcileDependencies(cfg, restored, syncDeps);
    const preflight = await preflightSnapshot(cfg, target);
    await appendRollbackLog(cfg, { mode: 'restore', targetId: target.id, targetKind: target.kind, preSnapshotId: pre.id, files: restored, missing, notes, skipped, needsRestart, deps, preflightMissing: preflight.missing });
    return { ok: true, restored, missing, notes, skipped, needsRestart, deps, preflight, targetId: target.id, targetKind: target.kind, targetReason: target.reason, preSnapshotId: pre.id, stepped: false, remounted };
  } finally {
    cfg.suppressAuto--;
  }
```

</details>

**依据 4 · 源码核查**：[lib/base.mjs:300-318](https://github.com/lire1131/dsh-undo-savepoint/blob/528a8a6f27e22c46d9709e7dee01e6cd5b22e367/lib/base.mjs#L300-L318)

vault留存成本。

<details>
<summary>查看原文（19行）</summary>

```text

/** 本机 vault：<autoDir>/env-vault/<内容sha1>.env（内容寻址去重，不随导出带走）。 */
function vaultDir(cfg) {
  return join(cfg.autoDir, 'env-vault');
}
async function writeVault(cfg, sha1, buf) {
  const dir = vaultDir(cfg);
  const target = join(dir, `${sha1}.env`);
  if (await pathExists(target)) return;
  await fs.mkdir(dir, { recursive: true });
  const tmp = `${target}.tmp`;
  await fs.writeFile(tmp, buf);
  await fs.rename(tmp, target).catch(() => { /* 并发写入已存在 */ });
}
async function readVault(cfg, sha1) {
  try { return await fs.readFile(join(vaultDir(cfg), `${sha1}.env`)); } catch { return null; }
}

/**
```

</details>

#### 缺口

- 宿主/局外鉴权、跨平台/并发/故障恢复及全成本未验，独立功能面未全审
  **影响**：不支持真实配置无损恢复和持续采用，来源源码不等运行
  **进一步探讨**：隔离home+假配置/插件故障矩阵，核权限/字节/重启及磁盘/停机成本，独立外部面另审。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
