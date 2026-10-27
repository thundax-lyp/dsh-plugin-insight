# dsh-toolbox-web

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[c915fdb](https://github.com/AbcdefgXW/dsh-toolbox-web/tree/c915fdb857bea9380ed0c181169d43c8350c4d7e)

<!-- BEGIN META -->
[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AbcdefgXW/dsh-toolbox-web) [![npm 30d 977](https://img.shields.io/static/v1?label=npm+30d&message=977&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-toolbox-web) [![最新发布 2026-09-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-16&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-toolbox-web)
<!-- END META -->

> **实现功能**：为 DSH Web 提供会话、目录、搜索、回收站、配置与预设等管理面板。

> **核心亮点**：相对分散终端脚本，贡献是统一管理入口及回收站/搜索组织；部分功能直接改宿主日志而非调用原生会话控制，便利与数据格式维护成本绑定。[Q01](#research-q01)

> **风险与缺陷**：消息读取尾部已适配最高代日志，但truncate/edit仍固定session.jsonl.zstd，且备份失败返回null后仍写入；这使新代日志与失败恢复成为实质源码边界，未做宿主复现。[Q03](#research-q03)

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
  - [Q01 · 工具箱统一入口适合什么任务？](#detail-section-11)
  - [Q02 · 管理方法怎样到达磁盘与回收站？](#detail-section-12)
  - [Q03 · 代际日志和备份失败如何影响写操作？](#detail-section-13)
  - [Q04 · 怎样控制资料管理的失败成本？](#detail-section-14)
  - [Q05 · 原生控制API或统一解析能否减少格式维护？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向大量会话与工作目录的DSH用户；合格结果是能找到、整理和恢复目标资料，并保持宿主可见状态与磁盘一致。

宿主原生会话管理加系统目录工具可替代部分功能；直接脚本需要理解zstd代际格式，本组件将其封装为UI但没有消除底层耦合。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 会话/目录管理 | 搜索、复制、分叉及整理 | 直接文件格式耦合，需备份 |
| 消息截断和编辑 | 从指定seq重建日志 | 固定旧文件名，需核对代际 |
| 回收站 | 恢复删除的会话或目录 | TTL和state持久化需检查 |
| 配置/预设与嵌入搜索 | 集中维护及查询 | 可选外部模型费用未知 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH settings、typert、agents | 必需 | 服务与界面接线 | 注册不可用 |
| 可读写DSH会话与工作区 | 管理必需 | 索引和文件变更 | 权限失败或格式不匹配 |
| 嵌入模型/供应商 | 语义搜索可选 | 建索引和查询 | 可用普通搜索；价格未知 |
| 独立备份与停止写入 | 写操作前必要控制 | 恢复和一致性 | 内置备份失败不会自动拒绝 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 在复制profile核对路径与日志代际 | 只读列表/搜索与原生一致 |
| 2 | 先试回收站和恢复副本 | 原路径冲突处理可理解 |
| 3 | 消息写操作前停止会话并独立备份 | 核对最高代文件与宿主刷新；异常保留副本 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 索引、备份及插件资源 | 查目录/日志格式、建立备份 | 配置量较多，耗时未知 |
| 持续使用 | 同步解压、缓存、可选模型费 | 标签整理和结果复核 | 大会话受预算控制但未实测 |
| 失败恢复 | 原文件、备份及trash空间 | 核对代际、原路径和内存状态 | 默认state位置及TTL需管理 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 集中管理 | Service对多个模块接线 | 对大量会话净节时 |
| 删除恢复 | 回收站元数据与冲突后缀 | 升级/断电下完整恢复 |
| 消息写入 | 截断编辑实现存在 | 新日志代际正确目标与活跃会话一致性 |

> **思考**：消息读取尾部已适配最高代日志，但truncate/edit仍固定session.jsonl.zstd，且备份失败返回null后仍写入；这使新代日志与失败恢复成为实质源码边界，未做宿主复现。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对分散终端脚本，贡献是统一管理入口及回收站/搜索组织；部分功能直接改宿主日志而非调用原生会话控制，便利与数据格式维护成本绑定。[Q01](#research-q01)

相对分散终端脚本，贡献是统一管理入口及回收站/搜索组织；部分功能直接改宿主日志而非调用原生会话控制，便利与数据格式维护成本绑定。[Q01](#research-q01)

列表统计用setImmediate让出和预览数量/大小预算，是改善宿主响应的可借鉴手段；但消息管理仍用同步文件写回，读取和写入的代际解析不一致。回收站跨设备复制后删除并单独写meta，需考虑中断窗口；不应以有回收站就称无损管理。

<a id="detail-section-5"></a>

### 1.4 主要限制

消息读取尾部已适配最高代日志，但truncate/edit仍固定session.jsonl.zstd，且备份失败返回null后仍写入；这使新代日志与失败恢复成为实质源码边界，未做宿主复现。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

当前建议观察。可先在复制profile使用只读列表与搜索，消息截断、编辑和批量整理应等代际与备份语义核对后再用；不要依赖插件state作为唯一备份。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

贡献为固定源码支持的设计解释，效果未独立验证；未来设计假设尚未实现或验证。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/messages.js、lib/sessions.js、lib/trash.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查后端Service、会话/消息/回收站模块与统计预算；未审核全部客户端、定时渠道或嵌入供应商。
- 下一步：复制包含v0/vN日志的profile，对照原生列表和各写操作；人为使备份目录不可写，验证是否应拒绝，再模拟回收站中断核对原文，未执行。

**分析版本**

- **仓库**：[AbcdefgXW/dsh-toolbox-web](https://github.com/AbcdefgXW/dsh-toolbox-web)
- **版本号**：0.1.29（[固定提交 c915fdb](https://github.com/AbcdefgXW/dsh-toolbox-web/tree/c915fdb857bea9380ed0c181169d43c8350c4d7e)）
- **版本日期**：2026-09-16（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是将会话写操作迁到宿主控制API或至少统一最高代解析并强制备份成功，再核对内存/落盘一致性；比较迁移会话的误改和恢复率，若兼容负担不降则否定。[Q05](#research-q05)

复制包含v0/vN日志的profile，对照原生列表和各写操作；人为使备份目录不可写，验证是否应拒绝，再模拟回收站中断核对原文，未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 14 | 6557 | 5648 | 683 | — |
| .md | source | 2 | 369 | — | — | 4365 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/AbcdefgXW/dsh-toolbox-web/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：AbcdefgXW/dsh-toolbox-web 固定组件如何完成目标任务，贡献在何种边界成立，是否适合可控试用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 工具箱统一入口适合什么任务？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

大量会话、目录和配置分散时，用户需要搜索、整理并恢复目标资料。源码Service聚合sessions、workspace、search、embed、trash、presets等模块，降低单独运行脚本的入口负担。合格交付仍是资料准确可恢复，不是管理活动本身。部分原生功能和系统工具已有替代，因此价值取决于频率与维护代价，不能用功能数量推断效率。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:19-60](https://github.com/AbcdefgXW/dsh-toolbox-web/blob/c915fdb857bea9380ed0c181169d43c8350c4d7e/index.js#L19-L60)

具体聚合模块与操作。

<details>
<summary>查看原文（42行）</summary>

```text
import {
  listAllSessions,
  deleteSession,
  copySession,
  resetSessionCwd,
  nextCopySuffix,
  forkSession,
  readSessionTitle,
  readSessionStats,
  readSessionStatsLite,
  clearProjCache,
  WORKSPACE_ROOT,
} from "./lib/sessions.js";
import { sessionStatsReliable, warmStatsCache } from "./lib/stats-cache.js";
import {
  listSubdirs,
  createSubdir,
  renameSubdir,
  deleteSubdir,
  copySubdir,
  refreshSessionCounts,
} from "./lib/workspace.js";
import {
  searchAll,
  setOfficialSearch,
  getOfficialSearchState,
  clearSearchCache,
  readMessagesBySeqs,
} from "./lib/search.js";
import { buildEmbedIndex, embedQuery, listEmbedModels, testEmbedConnection } from "./lib/embed.js";
import {
  trashItem,
  listTrash,
  restoreTrashEntry,
  emptyTrash,
  startTrashWatcher,
} from "./lib/trash.js";
import { getConfig, setConfigField, resetConfig } from "./lib/config.js";
import { listPresets, readPresetFile, savePresetFile } from "./lib/presets.js";
import { decompressFirstFrame } from "./lib/zstd.js";
import { listTags, setSessionTags, removeTag, renameTag } from "./lib/tags.js";
import { listMessagesTail, truncateSessionAt, editMessageAt } from "./lib/messages.js";
```

</details>

**依据 2 · 源码核查**：[index.js:123-129](https://github.com/AbcdefgXW/dsh-toolbox-web/blob/c915fdb857bea9380ed0c181169d43c8350c4d7e/index.js#L123-L129)

typert Service接线。

```text
export const inject = ["settings", "typert", "agents"];

/** 端点实现：一个 Service，方法名 = typert 端点 method。 */
class ToolsApi extends Service {
  constructor(ctx) {
    super(ctx, "dsh-toolbox-api");
    this.typertRemote = bindTypertRemote(this, this.name, { namespace: "dsh-toolbox" });
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 管理方法怎样到达磁盘与回收站？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

Service从DSH配置注入，模块直接读取zstd日志和会话目录。trashItem先创建条目目录，移动内容后写原路径与时间元数据；跨设备时复制后删除源。restore读取meta并在冲突时加恢复后缀。消息编辑另有备份路径。这些是多个持久化阶段，不能自动当事务；需核对插件state目录和保留策略。

#### 证据与依据

**依据 1 · 源码核查**：[lib/trash.js:16-45](https://github.com/AbcdefgXW/dsh-toolbox-web/blob/c915fdb857bea9380ed0c181169d43c8350c4d7e/lib/trash.js#L16-L45)

state位置及分阶段移动/写meta。

<details>
<summary>查看原文（30行）</summary>

```text
const TRASH_ROOT = path.join(
  process.env.DSH_CHANNELS_STATE_DIR?.trim() ||
    path.join(fileURLToPath(new URL("../", import.meta.url)), "state"),
  "trash",
);

/** 跨设备安全移动（rename 失败时 fallback 复制+删除）。 */
function moveAcrossDevices(src, dst) {
  try {
    fs.renameSync(src, dst);
  } catch (err) {
    if (err?.code !== "EXDEV") throw err;
    fs.cpSync(src, dst, { recursive: true });
    fs.rmSync(src, { recursive: true, force: true });
  }
}

/** 把路径移入回收站。 */
export function trashItem({ type, name, sourcePath, meta = {} }) {
  fs.mkdirSync(TRASH_ROOT, { recursive: true });
  const seq = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const entryDir = path.join(TRASH_ROOT, `${type}-${seq}-${sanitize(name)}`);
  fs.mkdirSync(entryDir, { recursive: true });
  moveAcrossDevices(sourcePath, path.join(entryDir, "data"));
  fs.writeFileSync(
    path.join(entryDir, "meta.json"),
    JSON.stringify({ type, name, sourcePath, deletedAt: Date.now(), ...meta }, null, 2),
    "utf-8",
  );
  return entryDir;
```

</details>

**依据 2 · 源码核查**：[lib/trash.js:70-89](https://github.com/AbcdefgXW/dsh-toolbox-web/blob/c915fdb857bea9380ed0c181169d43c8350c4d7e/lib/trash.js#L70-L89)

恢复冲突处理。

<details>
<summary>查看原文（20行）</summary>

```text
/** 恢复：移回原路径（原路径被占用时改名 -恢复x）。 */
export function restoreTrashEntry(entryDir) {
  const metaPath = path.join(entryDir, "meta.json");
  if (!fs.existsSync(metaPath)) return { ok: false, error: "元数据丢失" };
  const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
  const dataPath = path.join(entryDir, "data");
  if (!fs.existsSync(dataPath)) return { ok: false, error: "数据缺失" };
  let target = meta.sourcePath;
  if (fs.existsSync(target)) {
    let n = 1;
    const base = target;
    while (fs.existsSync(target)) {
      target = `${base}-恢复${n}`;
      n += 1;
    }
  }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  moveAcrossDevices(dataPath, target);
  fs.rmSync(entryDir, { recursive: true, force: true });
  return { ok: true, restoredTo: target };
```

</details>

**依据 3 · 源码核查**：[lib/messages.js:17-33](https://github.com/AbcdefgXW/dsh-toolbox-web/blob/c915fdb857bea9380ed0c181169d43c8350c4d7e/lib/messages.js#L17-L33)

独立备份位置和失败返回null。

<details>
<summary>查看原文（17行）</summary>

```text
const BACKUP_ROOT = path.join(fileURLToPath(new URL("../", import.meta.url)), "state", "backups");

/** 操作前备份原会话文件（保留最近 20 份）。 */
function backupFile(file) {
  try {
    fs.mkdirSync(BACKUP_ROOT, { recursive: true });
    const name = path.basename(path.dirname(file)) + "-" + Date.now() + ".zstd";
    fs.copyFileSync(file, path.join(BACKUP_ROOT, name));
    // 清理：只保留最近 20 个
    const all = fs.readdirSync(BACKUP_ROOT).sort();
    while (all.length > 20) {
      fs.rmSync(path.join(BACKUP_ROOT, all.shift()), { force: true });
    }
    return name;
  } catch {
    return null;
  }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 代际日志和备份失败如何影响写操作？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

listMessagesTail明确通过resolveSessionLog读取最高代文件；truncateSessionAt和editMessageAt仍固定session.jsonl.zstd。若宿主使用vN代日志，读到的目标与写入目标可能不同，这是源码边界而非已复现事故。backupFile捕获错误返回null，调用者随后仍解压并writeFileSync，因此不能承诺“操作前一定成功备份”。同步写回也需协调宿主内存与活动会话，当前未验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/messages.js:87-92](https://github.com/AbcdefgXW/dsh-toolbox-web/blob/c915fdb857bea9380ed0c181169d43c8350c4d7e/lib/messages.js#L87-L92)

尾部读取已采用最高代解析。

```text
export function listMessagesTail(sessionPath, limit = 20) {
  // 【修正】官方加载器只认「最高代」日志（v0 = session.jsonl.zstd；vN = session.v<N>.jsonl.zstd）。
  // 旧实现硬编码 session.jsonl.zstd，导致迁移到 v3 代之后的会话取不到最新消息预览（返回"会话文件不存在"）。
  const log = resolveSessionLog(sessionPath);
  const file = log ? log.file : path.join(sessionPath, "session.jsonl.zstd");
  if (!fs.existsSync(file)) return { ok: false, error: "会话文件不存在" };
```

**依据 2 · 源码核查**：[lib/messages.js:141-173](https://github.com/AbcdefgXW/dsh-toolbox-web/blob/c915fdb857bea9380ed0c181169d43c8350c4d7e/lib/messages.js#L141-L173)

截断固定文件并不检查备份成功后再写。

<details>
<summary>查看原文（33行）</summary>

```text
/** 截断：保留 seq < atSeq 的所有事件（删除目标消息及其后全部）。 */
export function truncateSessionAt(sessionPath, atSeq) {
  const file = path.join(sessionPath, "session.jsonl.zstd");
  if (!fs.existsSync(file)) return { ok: false, error: "会话文件不存在" };
  const backup = backupFile(file);
  const text = decompressSessionFile(file);
  const lines = text.split("\n");
  const keep = [];
  let header = null;
  let removed = 0;
  for (const line of lines) {
    if (!line.trim()) continue;
    let ev;
    try {
      ev = JSON.parse(line);
    } catch {
      continue;
    }
    if (header === null) {
      header = ev; // 首行 header 保留
      keep.push(line);
      continue;
    }
    if (typeof ev.seq === "number" && ev.seq >= atSeq) {
      removed += 1;
      continue;
    }
    keep.push(line);
  }
  if (header === null) return { ok: false, error: "文件结构异常" };
  const out = compressSessionText(keep.join("\n"));
  fs.writeFileSync(file, out);
  return { ok: true, removed, kept: keep.length, backup };
```

</details>

**依据 3 · 源码核查**：[lib/messages.js:176-181](https://github.com/AbcdefgXW/dsh-toolbox-web/blob/c915fdb857bea9380ed0c181169d43c8350c4d7e/lib/messages.js#L176-L181)

编辑同样固定文件名。

```text
/** 编辑：替换目标消息文本 + 删除其后所有事件（该消息保留）。 */
export function editMessageAt(sessionPath, atSeq, content) {
  const file = path.join(sessionPath, "session.jsonl.zstd");
  if (!fs.existsSync(file)) return { ok: false, error: "会话文件不存在" };
  const backup = backupFile(file);
  const text = decompressSessionFile(file);
```

#### 缺口

- 实际新宿主日志、活跃内存和失败恢复未复现
  **影响**：妨碍关键会话写入采用
  **进一步探讨**：复制vN会话并模拟备份失败，核对真实写入目标与宿主显示。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样控制资料管理的失败成本？

**研究主题**：效果与总成本、采用判断

#### 完整回答

当前建议先观察并仅在复制profile做只读浏览搜索。写操作应独立备份、停止会话并确认最高代文件，不能把内置备份或回收站当唯一恢复机制。持续成本包括同步解压、索引、备份空间和可选嵌入模型费用。源码的预览上限与事件循环让出改善响应设计，但作者测量注释未独立复核，不能据此报告本轮性能。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:151-180](https://github.com/AbcdefgXW/dsh-toolbox-web/blob/c915fdb857bea9380ed0c181169d43c8350c4d7e/index.js#L151-L180)

列表预算与让出机制。

<details>
<summary>查看原文（30行）</summary>

```text
    // 【性能约束】原实现在一个 handler 里对全部会话同步「算统计 + 解压取最新消息」，
    // 实测 216 个会话合计约 11.5s，且中途不让出事件循环 → Node 主线程被独占，
    // 用户此时切到「预设 / 配置文件 / 子目录」等其它 Tab，请求全部排在后面（表现为"什么都要等会话加载完"）。
    // 现改为两条约束：
    //   ① 逐条处理时定期让出事件循环（setImmediate），让其它工具调用能插空执行；
    //   ② 最新消息预览只对「最近活跃 + 体积可控」的前 N 个取，并设总时间预算，超预算即停（其余留空）。
    const yieldLoop = () => new Promise((r) => setImmediate(r));
    // 单会话超过该体积不预取预览：解压是同步操作，单个 16MB 会话实测就要 3.3s，无法中断。
    const LATEST_MAX_BYTES = 4 * 1024 * 1024;
    const LATEST_LIMIT = 40;
    const LATEST_BUDGET_MS = 1500;
    let i = 0;
    for (const s of all) {
      if (archivedIds.has(s.sessionId) || archivedIds.has(s.sessionDir)) continue;
      const stats = sessionStatsReliable(s.path, s.sessionId);
      let mtimeMs = 0;
      try { mtimeMs = fs.statSync(s.path).mtimeMs; } catch {}
      out.push({
        sessionId: s.sessionId,
        cwd: s.cwd,
        title: stats?.title ?? null,
        size: stats?.size ?? 0,
        turns: stats?.turns ?? 0,
        latest: null, // 由下面的「最近活跃」批次补；未补到的保持 null，前端自动不显示该行
        parentSession: s.header?.parentSession ?? null, // 子代理会话标记（前端分 tab 管理）
        delegationDepth: s.header?.delegationDepth ?? 0,
        _path: s.path,   // 内部临时字段，返回前删除
        _mtime: mtimeMs, // 内部临时字段，返回前删除
      });
      if ((++i & 15) === 0) await yieldLoop();
```

</details>

**依据 2 · 源码核查**：[lib/trash.js:103-110](https://github.com/AbcdefgXW/dsh-toolbox-web/blob/c915fdb857bea9380ed0c181169d43c8350c4d7e/lib/trash.js#L103-L110)

回收站保留策略会影响恢复。

```text
/**
 * 自动清除：删除超过 retentionDays 的条目。
 * @param {number} retentionDays 0 = 不自动清
 * @returns 清除的条目数
 */
export function purgeTrash(retentionDays) {
  if (!retentionDays || retentionDays <= 0) return 0;
  const cutoff = Date.now() - retentionDays * 24 * 60 * 60 * 1000;
```

**依据 3 · 源码核查**：[lib/messages.js:19-33](https://github.com/AbcdefgXW/dsh-toolbox-web/blob/c915fdb857bea9380ed0c181169d43c8350c4d7e/lib/messages.js#L19-L33)

备份数量与失败语义。

<details>
<summary>查看原文（15行）</summary>

```text
/** 操作前备份原会话文件（保留最近 20 份）。 */
function backupFile(file) {
  try {
    fs.mkdirSync(BACKUP_ROOT, { recursive: true });
    const name = path.basename(path.dirname(file)) + "-" + Date.now() + ".zstd";
    fs.copyFileSync(file, path.join(BACKUP_ROOT, name));
    // 清理：只保留最近 20 个
    const all = fs.readdirSync(BACKUP_ROOT).sort();
    while (all.length > 20) {
      fs.rmSync(path.join(BACKUP_ROOT, all.shift()), { force: true });
    }
    return name;
  } catch {
    return null;
  }
```

</details>

#### 缺口

- 总人工时间、资源峰值和恢复率未知
  **影响**：不能量化整理收益或无损保证
  **进一步探讨**：固定会话集比较只读搜索和写入恢复的完整耗时与成功判据。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 原生控制API或统一解析能否减少格式维护？

**研究主题**：新假设与验证

#### 完整回答

未验证假设优先用宿主会话控制接口管理写操作；缺接口时至少统一最高代解析、强制备份成功并核对活动内存。推导来自读写路径不一致和非强制备份。以迁移日志、旧日志、不可写备份和并发会话为对照，检查错代写入与可恢复率；如果宿主接口缺关键能力，可保留只读工具箱，不应继续放宽写入保证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/messages.js:87-92](https://github.com/AbcdefgXW/dsh-toolbox-web/blob/c915fdb857bea9380ed0c181169d43c8350c4d7e/lib/messages.js#L87-L92)

已有解析器可作统一入口。

```text
export function listMessagesTail(sessionPath, limit = 20) {
  // 【修正】官方加载器只认「最高代」日志（v0 = session.jsonl.zstd；vN = session.v<N>.jsonl.zstd）。
  // 旧实现硬编码 session.jsonl.zstd，导致迁移到 v3 代之后的会话取不到最新消息预览（返回"会话文件不存在"）。
  const log = resolveSessionLog(sessionPath);
  const file = log ? log.file : path.join(sessionPath, "session.jsonl.zstd");
  if (!fs.existsSync(file)) return { ok: false, error: "会话文件不存在" };
```

**依据 2 · 源码核查**：[lib/messages.js:141-173](https://github.com/AbcdefgXW/dsh-toolbox-web/blob/c915fdb857bea9380ed0c181169d43c8350c4d7e/lib/messages.js#L141-L173)

当前写操作是需要替换的参照。

<details>
<summary>查看原文（33行）</summary>

```text
/** 截断：保留 seq < atSeq 的所有事件（删除目标消息及其后全部）。 */
export function truncateSessionAt(sessionPath, atSeq) {
  const file = path.join(sessionPath, "session.jsonl.zstd");
  if (!fs.existsSync(file)) return { ok: false, error: "会话文件不存在" };
  const backup = backupFile(file);
  const text = decompressSessionFile(file);
  const lines = text.split("\n");
  const keep = [];
  let header = null;
  let removed = 0;
  for (const line of lines) {
    if (!line.trim()) continue;
    let ev;
    try {
      ev = JSON.parse(line);
    } catch {
      continue;
    }
    if (header === null) {
      header = ev; // 首行 header 保留
      keep.push(line);
      continue;
    }
    if (typeof ev.seq === "number" && ev.seq >= atSeq) {
      removed += 1;
      continue;
    }
    keep.push(line);
  }
  if (header === null) return { ok: false, error: "文件结构异常" };
  const out = compressSessionText(keep.join("\n"));
  fs.writeFileSync(file, out);
  return { ok: true, removed, kept: keep.length, backup };
```

</details>

#### 缺口

- 宿主写接口覆盖与原型未验证
  **影响**：不是现有修复
  **进一步探讨**：先定义允许的写入和恢复不变量，再在副本实现对照。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
