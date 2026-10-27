# dsh-plugin-ide-hub

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[f4e57a7](https://github.com/121212165/dsh-plugin-ide-hub/tree/f4e57a76bb8ac36867d237d148352ec15dfc0bc3)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/121212165/dsh-plugin-ide-hub) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-ide-hub)
<!-- END META -->

> **实现功能**：汇总多IDE本地会话、用量和规则，生成规则指针、配额计划与Obsidian快照。

> **核心亮点**：把分散会话/规则与手填额度计划放到同一交接入口，保留用户规则本体；价值主要是适配和流程组织。[Q01](#research-q01)、[Q02](#research-q02)

> **风险与缺陷**：运行导入依赖只列为devDependencies，扫描用stat跟随链接，计量字段依赖私有格式，批量写无事务；静态风险尚未等同真实失败。[Q03](#research-q03)、[Q04](#research-q04)

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
  - [Q01 · 多IDE盘点与规则同步改变什么交接流程？](#detail-section-11)
  - [Q02 · 日志、SQLite、额度与规则如何解析和聚合？](#detail-section-12)
  - [Q03 · 计量与路径扫描是否可靠，批写是否有一致性保证？](#detail-section-13)
  - [Q04 · 依赖闭合、初始化和导出步骤与失败成本怎样？](#detail-section-14)
  - [Q05 · 解析纯函数和回执可复用性及收益边界如何？](#detail-section-15)
  - [Q06 · 版本化适配器加计量可信度能否改善建议，适合谁试用？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：给多IDE用户定位旧任务、维护共享规则和查看本地记录，不能直接迁移厂商额度。

手工查IDE目录、维护AGENTS和普通vault导出可替代；未比较同条件恢复成功率。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 会话/用量盘点 | 汇总本地记录 | 私有格式覆盖不等完整计量 |
| hub-init | 一份规则本体与多IDE指针 | 建议先dry-run，批写非事务 |
| hub-migrate/today | 排序任务和额度计划 | 依赖手填或兄弟插件文件 |
| hub-export | 导出vault快照 | 写逐文件快照，需管理隐私 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=22.18及DSH命令服务 | 必需 | 插件加载 | 无法使用命令 |
| kit/schemastery可解析 | 必需 | 写文件及配置 | 导入失败风险 |
| 本地IDE记录/手填额度 | 对应功能必需 | 盘点与计划 | 覆盖不足或建议无依据 |
| 可写项目/vault | 写功能必需 | 指针和导出 | 可能部分写后失败 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 核对依赖并只读盘点 | 正确识别已知会话 |
| 预览 | 副本hub-init dry-run | 路径与改动均可解释 |
| 验收 | 检查规则真正生效及用量口径 | 不一致则回备份并停用建议 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 本地存储，金额未知 | 依赖核对、目录与规则预览 | 干净加载未确认 |
| 持续 | 日志扫描和vault副本 | 手填额度、核对格式/规则 | 无净节时数据 |
| 失败恢复 | 备份和部分新文件 | 比对指针、恢复旧规则 | 多文件非事务 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 统一盘点 | 适配本地状态并呈现 | 八种IDE当前覆盖完整性 |
| 用量/额度建议 | 字段解析与手填计划 | 厂商语义一致与成本正确性 |
| 规则共享 | 标记指针保留本体 | 各IDE实际加载与整组一致性 |

> **思考**：运行导入依赖只列为devDependencies，扫描用stat跟随链接，计量字段依赖私有格式，批量写无事务；静态风险尚未等同真实失败。[Q03](#research-q03)、[Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把分散会话/规则与手填额度计划放到同一交接入口，保留用户规则本体；价值主要是适配和流程组织。[Q01](#research-q01)、[Q02](#research-q02)

把分散会话/规则与手填额度计划放到同一交接入口，保留用户规则本体；价值主要是适配和流程组织。[Q01](#research-q01)、[Q02](#research-q02)

适配器分层和内容幂等写值得借鉴；运行依赖与多文件事务边界未闭合，stat扫描与“不跟链接”的注释不符。[Q03](#research-q03)、[Q05](#research-q05)

<a id="detail-section-5"></a>

### 1.4 主要限制

运行导入依赖只列为devDependencies，扫描用stat跟随链接，计量字段依赖私有格式，批量写无事务；静态风险尚未等同真实失败。[Q03](#research-q03)、[Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

先验证包在隔离profile可加载，再用项目副本dry-run检查扫描范围和指针；计量对齐真实账单后才依赖预算建议。[Q06](#research-q06)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

盘点/指针与本地计量机制可查；运行依赖闭合、私有格式计量和越界扫描待验证，先观察；可信度适配器方案未验证。

- 已检查：作者 README、包清单、源码路径 src/plugin.ts、src/hub/usage-reader.ts、src/hub/obsidian.ts、README.md、package.json、lib/plugin.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：读取入口/发布导入、规则初始化、用量适配与Obsidian写入；未核对全部八种IDE当前二进制或真实账单。
- 下一步：可进一步在隔离profile核对依赖，使用含外链的项目副本与真实日志做计量和写失败矩阵。

**分析版本**

- **仓库**：[121212165/dsh-plugin-ide-hub](https://github.com/121212165/dsh-plugin-ide-hub)
- **版本号**：0.7.0（[固定提交 f4e57a7](https://github.com/121212165/dsh-plugin-ide-hub/tree/f4e57a76bb8ac36867d237d148352ec15dfc0bc3)）
- **版本日期**：2026-10-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是版本化适配器输出覆盖与计量可信度，加内容摘要清单确认批写；用跨版本日志和中断样本衡量错误暴露与恢复质量。[Q06](#research-q06)

可进一步在隔离profile核对依赖，使用含外链的项目副本与真实日志做计量和写失败矩阵。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 13 | 1870 | 1747 | 127 | — |
| .md | source | 1 | 136 | — | — | 2890 |
| .ts | source | 13 | 2285 | 1953 | 174 | — |
| .ts | test | 10 | 1400 | 1216 | 53 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-26），可前往 [GitHub Issues](https://github.com/121212165/dsh-plugin-ide-hub/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对多IDE本地统一入口的增量、计量/路径与分发边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 多IDE盘点与规则同步改变什么交接流程？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向同时使用多个编码IDE的人，把分散的本地会话、规则、用量和配额计划放在同一命令入口，并用一份.hub规则本体给各IDE写指针。相对逐个翻目录和手工复制规则，贡献在本地读取适配与交接组织；它不实际迁移厂商额度，也不证明各IDE会读取相同指针。合格交付应是用户能定位会话、恢复正确任务并核对规则实际生效，而不是看见“8个适配器”就当所有格式都完整覆盖。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:17-30](https://github.com/121212165/dsh-plugin-ide-hub/blob/f4e57a76bb8ac36867d237d148352ec15dfc0bc3/README.md#L17-L30)

作者列出本地盘点、配额计划和指针的范围。

<details>
<summary>查看原文（14行）</summary>

```text
**EN** · One hub over the coding IDEs you actually run — dsh, Claude Code, Codex, ZCode, Qoder, CatPaw, Trae, OpenCode. It reads each tool's own on-disk state (sessions, usage, prompt-rule files) instead of calling any API, then gives you an inventory (`/ide-hub`), a quota-runway migration plan (`/hub-migrate`), usage breakdowns (`/hub-usage`), resumable sessions (`/hub-sessions`), a ranked "what should I do first" over the sibling plugins (`/today`) and an Obsidian export (`/hub-export`) — and, since `/hub-init`, writes back exactly one thing: a `.hub/` rule body plus a marker-delimited pointer in each tool's project rule file. · 45 `node --test` green · reads real local data on this machine · v0.4's Trae chat reader is **not yet wired into `/hub-sessions`** — see 已知边界.

DeepSeek Harness (dsh) 插件：跨 IDE 统一管理器。各家编码 IDE 都把会话、用量、提示词规则写在自己的磁盘目录里，本插件直接读这些文件（不调任何厂商 API），在 dsh 里出六个命令。读之外只有一处写：`/hub-init` 往**你自己指定的项目目录**里装 `.hub/` 规则本体与各 IDE 的指针段。

## 功能

- **`/ide-hub`**：8 个适配器的在装盘点（`N/8 在装，其中国产 M`）+ 每个工具的提示词规则文件发现（CLAUDE.md / AGENTS.md / .cursorrules 一类）。
- **`/hub-init [目录] [--dry-run] [--only …] [--remove]`**：指针生成器。建 `.hub/AGENTS.md`（规则本体，一份正文多处生效）+ `.hub/PROJECT_NOTES.md` + `.hub/STRUCTURE.json`（深度 2 的结构快照），再放 `hub-pointer` 标记段：**8 个工具全覆盖**——项目根 `AGENTS.md` 一份服务 codex / opencode / zcode / dsh / **qoder / catpaw**，`CLAUDE.md` 服务 Claude Code，Trae 因为它的「项目根 AGENTS.md」是设置里的开关（"Include AGENTS.md in the context"），单独写 `.trae/rules/project_rules.md` **和** `.trae-cn/rules/project_rules.md`（本机装的 TRAE SOLO CN 两条路径都在用）。
- 这些路径不是从文档抄的：2026-10-02 用 grep 从本机安装的厂商二进制里读出来（Trae 的 `ai-modules-chat/dist/index.mjs` 设置文案、Qoder 的 `qoder-worker-runtime.obf.mjs` 里 `AGENTS.override.md → AGENTS.md` 与 `projectConfigName=.qoder/.qoder-cn`、CatPaw 的 `catpaw-cli.exe` 里 `loadProjectRules(.catpaw/rules)` 与 `loadAgentMdFiles`）。**CatPaw 的 `.catpaw` 目录名可被 `CATPAW_DIR` 覆盖，所以指针挂 `AGENTS.md` 而不是它。**
- **`/hub-usage`**：用量。zcode 走本地 `model_usage` 库，出总量、轮数、缓存命中率、非完成态与工具错误数，并按 `provider/model` 逐行拆；claude-code / codex 走各自转录统计。
- **`/hub-sessions`**：最近会话列表 + 一键恢复命令（`claude --resume …` / `codex resume …` / `dsh --profile … --resume …`）。
- **`/today`**：**今天第一件事**。把四个兄弟插件写在磁盘上的事实汇成一个排序结论——quota 的 `summary.json`（预算与下步预估）、cost-ledger 的当月台账、task-forge 的 `ledger.jsonl`（谁卡在等谁）、tool-trace 的调用记录（连败=系统性故障）。规则表在 `src/hub/today.ts`，是纯函数、逐条有测试；读不到哪个文件就在输出里点名「看不到的部分」，不假装全知。
- **`/hub-migrate`**：配额迁移计划。按你配的 `remainingMajor` / `dailyMajor` / `priority` 算每个工具的耗尽倒计时，并给出该把活优先挪给谁。
- **`/hub-export`**：把盘点结果与规则文件导出成 Obsidian 笔记（`IDE-Hub/` 子树），未变化的文件跳过。
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 日志、SQLite、额度与规则如何解析和聚合？

**研究主题**：功能与机制

#### 完整回答

入口按registry对本地目录盘点，再由对应适配器解析日志/数据库；配额建议来自用户配置remainingMajor/dailyMajor，不是厂商实时查询。hub-init保留已有规则本体与备忘，更新结构快照并逐目标mergePointer；hub-export生成Obsidian快照，内容相同跳过写入。Codex读取total_token_usage，output字段直接把output_tokens与reasoning_output_tokens相加；若上游字段语义是包含关系，会高估。仅源码可说明公式，不能从fixture自洽证明各版本计量正确。

#### 证据与依据

**依据 1 · 源码核查**：[src/plugin.ts:70-87](https://github.com/121212165/dsh-plugin-ide-hub/blob/f4e57a76bb8ac36867d237d148352ec15dfc0bc3/src/plugin.ts#L70-L87)

配额与兄弟插件路径由配置供给。

<details>
<summary>查看原文（18行）</summary>

```text
export const Config = Schema.object({
  enabled: Schema.boolean().default(true),
  vaultDir: Schema.string(),
  quotas: Schema.array(
    Schema.object({
      tool: Schema.string().required(),
      remainingMajor: Schema.number().required(),
      dailyMajor: Schema.number().default(0),
      priority: Schema.union([Schema.const('work'), Schema.const('batch'), Schema.const('learning')]).default('work'),
    }),
  ).default([]),
  quotaSummaryPath: Schema.string().default(TODAY_DEFAULTS.quotaSummaryPath),
  costLedgerDir: Schema.string().default(TODAY_DEFAULTS.costLedgerDir),
  taskForgeLedger: Schema.string().default(TODAY_DEFAULTS.taskForgeLedger),
  toolTraceDir: Schema.string().default(TODAY_DEFAULTS.toolTraceDir),
  sessionInsightsDir: Schema.string().default(TODAY_DEFAULTS.sessionInsightsDir),
  forecastPath: Schema.string().default(TODAY_DEFAULTS.forecastPath),
  todayWindowDays: Schema.natural().default(TODAY_DEFAULTS.todayWindowDays),
```

</details>

**依据 2 · 源码核查**：[src/plugin.ts:285-314](https://github.com/121212165/dsh-plugin-ide-hub/blob/f4e57a76bb8ac36867d237d148352ec15dfc0bc3/src/plugin.ts#L285-L314)

规则本体保留、结构和逐目标指针写入。

<details>
<summary>查看原文（30行）</summary>

```text
  const bodyPath = join(root, HUB_BODY);
  if (readIf(bodyPath) !== null) {
    changes.push({ file: rel(bodyPath), outcome: 'kept', detail: '规则本体已存在，里面是项目自己的内容，未覆盖' });
  } else {
    changes.push(write(bodyPath, rel(bodyPath), renderHubAgents(project), '按模板新建，去填目标/命令/禁忌'));
  }

  const notesPath = join(root, '.hub', 'PROJECT_NOTES.md');
  if (readIf(notesPath) !== null) {
    changes.push({ file: rel(notesPath), outcome: 'kept', detail: '备忘已存在，未覆盖' });
  } else {
    changes.push(write(notesPath, rel(notesPath), renderProjectNotes(project), '按模板新建'));
  }

  const scan = scanTree(root);
  const structurePath = join(root, '.hub', 'STRUCTURE.json');
  changes.push(write(structurePath, rel(structurePath), renderStructureJson(project, scan.entries, now), `结构快照 ${scan.entries.length} 个条目（深度 2，跳过 .git 与 node_modules 等）`));

  const block = pointerBlock();
  for (const target of targets) {
    const file = join(root, target.path);
    const merged = mergePointer(readIf(file), block);
    if (merged.action === 'noop') {
      changes.push({ file: target.path, outcome: 'unchanged', detail: `指针段已在（${target.tools.join('/')}）` });
      continue;
    }
    const how = merged.action === 'create' ? '新建' : merged.action === 'append' ? '在已有内容后追加' : '重写';
    changes.push(write(file, target.path, merged.content, `${how}指针段 → ${target.tools.join('/')}（${target.notes[0] ?? '路径未核实'}）`));
  }
  return { project, root, changes, manual: manual.map((spec) => ({ tool: spec.tool, note: spec.note })), truncated: scan.truncated };
```

</details>

**依据 3 · 源码核查**：[src/hub/usage-reader.ts:95-112](https://github.com/121212165/dsh-plugin-ide-hub/blob/f4e57a76bb8ac36867d237d148352ec15dfc0bc3/src/hub/usage-reader.ts#L95-L112)

Codex总量字段和输出相加的具体公式。

<details>
<summary>查看原文（18行）</summary>

```text
export function codexRecord(line: CodexLine): UsageRecord | null {
  if (line.type !== 'event_msg') return null;
  const payload = line.payload;
  const total = payload?.info?.total_token_usage;
  if (payload?.type !== 'token_count' || !total || !line.timestamp) return null;
  const input = num(total.input_tokens);
  const output = num(total.output_tokens) + num(total.reasoning_output_tokens);
  const cacheRead = num(total.cached_input_tokens);
  return {
    tool: 'codex',
    sessionId: payload.session_id ?? 'unknown',
    at: line.timestamp,
    day: dayOf(line.timestamp),
    inputTokens: input,
    outputTokens: output,
    cacheReadTokens: cacheRead,
    cacheWriteTokens: 0,
  };
```

</details>

**依据 4 · 源码核查**：[src/hub/obsidian.ts:80-93](https://github.com/121212165/dsh-plugin-ide-hub/blob/f4e57a76bb8ac36867d237d148352ec15dfc0bc3/src/hub/obsidian.ts#L80-L93)

导出逐文件写入与相同内容跳过。

<details>
<summary>查看原文（14行）</summary>

```text
/** Idempotent write: identical content skips, changed content overwrites. */
export function writeNotes(vaultDir: string, notes: ObsidianNote[]): { written: string[]; skipped: number } {
  const written: string[] = [];
  let skipped = 0;
  for (const note of notes) {
    const file = join(vaultDir, note.path);
    if (existsSync(file) && readFileSync(file, 'utf8') === note.content) {
      skipped++;
      continue;
    }
    writeFileAtomic(file, note.content);
    written.push(note.path);
  }
  return { written, skipped };
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 计量与路径扫描是否可靠，批写是否有一致性保证？

**研究主题**：缺陷与关键质疑

#### 完整回答

结构扫描虽然声称不跟符号链接，实际先丢弃Dirent类型再statSync，遇到指向外部目录的链接会按目录进入，深度/数量上限仅限制范围，不能替代根目录围栏。用量解析依赖厂商私有格式，total累计记录的聚合及输出包含关系需独立核查；本轮不把潜在重复计量写成已确认账单错误。指针与Obsidian写入均逐文件完成，没有整组提交或回滚，失败可能留下部分新规则/旧快照。

#### 证据与依据

**依据 1 · 源码核查**：[src/plugin.ts:115-150](https://github.com/121212165/dsh-plugin-ide-hub/blob/f4e57a76bb8ac36867d237d148352ec15dfc0bc3/src/plugin.ts#L115-L150)

statSync跟随链接且递归。

<details>
<summary>查看原文（36行）</summary>

```text
export function scanTree(root: string, limit = 300, depth = 2): TreeScan {
  const entries: TreeEntry[] = [];
  let truncated = false;
  const walk = (dir: string, level: number): void => {
    if (truncated || level > depth) return;
    let names: string[];
    try {
      names = readdirSync(dir, { withFileTypes: true })
        .filter((entry) => !entry.name.startsWith('.') && !SKIP_DIRS.has(entry.name))
        .map((entry) => entry.name)
        .sort();
    } catch {
      return;
    }
    for (const name of names) {
      if (entries.length >= limit) {
        truncated = true;
        return;
      }
      const full = join(dir, name);
      const rel = relative(root, full).replace(/\\/g, '/');
      let stat;
      try {
        stat = statSync(full);
      } catch {
        continue;
      }
      if (stat.isDirectory()) {
        entries.push({ path: `${rel}/`, kind: 'dir' });
        walk(full, level + 1);
      } else if (stat.isFile()) {
        entries.push({ path: rel, kind: 'file', size: stat.size });
      }
    }
  };
  walk(root, 1);
```

</details>

**依据 2 · 源码核查**：[src/hub/usage-reader.ts:95-112](https://github.com/121212165/dsh-plugin-ide-hub/blob/f4e57a76bb8ac36867d237d148352ec15dfc0bc3/src/hub/usage-reader.ts#L95-L112)

计量假设由源码明确可见。

<details>
<summary>查看原文（18行）</summary>

```text
export function codexRecord(line: CodexLine): UsageRecord | null {
  if (line.type !== 'event_msg') return null;
  const payload = line.payload;
  const total = payload?.info?.total_token_usage;
  if (payload?.type !== 'token_count' || !total || !line.timestamp) return null;
  const input = num(total.input_tokens);
  const output = num(total.output_tokens) + num(total.reasoning_output_tokens);
  const cacheRead = num(total.cached_input_tokens);
  return {
    tool: 'codex',
    sessionId: payload.session_id ?? 'unknown',
    at: line.timestamp,
    day: dayOf(line.timestamp),
    inputTokens: input,
    outputTokens: output,
    cacheReadTokens: cacheRead,
    cacheWriteTokens: 0,
  };
```

</details>

**依据 3 · 源码核查**：[src/hub/obsidian.ts:80-93](https://github.com/121212165/dsh-plugin-ide-hub/blob/f4e57a76bb8ac36867d237d148352ec15dfc0bc3/src/hub/obsidian.ts#L80-L93)

逐笔写不构成多文件事务。

<details>
<summary>查看原文（14行）</summary>

```text
/** Idempotent write: identical content skips, changed content overwrites. */
export function writeNotes(vaultDir: string, notes: ObsidianNote[]): { written: string[]; skipped: number } {
  const written: string[] = [];
  let skipped = 0;
  for (const note of notes) {
    const file = join(vaultDir, note.path);
    if (existsSync(file) && readFileSync(file, 'utf8') === note.content) {
      skipped++;
      continue;
    }
    writeFileAtomic(file, note.content);
    written.push(note.path);
  }
  return { written, skipped };
```

</details>

#### 缺口

- 真实IDE版本字段定义、累计去重和符号链接目录样本未独立验证
  **影响**：盘点范围及用量建议可能偏离实际
  **进一步探讨**：与厂商账单/原始记录对齐，并在目录副本加入外链和中途写失败

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖闭合、初始化和导出步骤与失败成本怎样？

**研究主题**：依赖、兼容与流程

#### 完整回答

源码和发布lib都在运行时导入@dsh-family/kit与schemastery，但包清单把它们放在devDependencies，peer仅声明cordis。由此不能证明干净消费者环境会解析到这些包；有宿主或工作区偶然提供时可能可用，不能据静态清单断言必定无法加载。用户先确认Node>=22.18、宿主依赖及只读盘点，再对项目副本运行dry-run，审阅指针目标和vault范围后才写。未知依赖闭合影响当前可控试用路径，因此先观察，不以作者历史干净房报告替代本固定版本安装。

#### 证据与依据

**依据 1 · 源码核查**：[src/plugin.ts:6-12](https://github.com/121212165/dsh-plugin-ide-hub/blob/f4e57a76bb8ac36867d237d148352ec15dfc0bc3/src/plugin.ts#L6-L12)

运行时导入schemastery和kit。

```text
import type { Context } from '@deepseek-ai/cordis';
import Schema from '@deepseek-ai/schemastery';
import type {} from '@deepseek-ai/dsh-commands';
import { existsSync, readFileSync, readdirSync, rmdirSync, rmSync, statSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';

import { writeFileAtomic } from '@dsh-family/kit';
```

**依据 2 · 源码核查**：[lib/plugin.js:1-8](https://github.com/121212165/dsh-plugin-ide-hub/blob/f4e57a76bb8ac36867d237d148352ec15dfc0bc3/lib/plugin.js#L1-L8)

发布产物仍含外部运行时导入。

```text
import Schema from '@deepseek-ai/schemastery';
import { existsSync, readFileSync, readdirSync, rmdirSync, rmSync, statSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { writeFileAtomic } from '@dsh-family/kit';
import { defaultRegistry } from './hub/registry.js';
import { inventory, expandPath } from './hub/inventory.js';
import { HUB_BODY, POINTER_SPECS, mergePointer, pointerBlock, pointerTargets, renderHubAgents, renderProjectNotes, renderStructureJson, unmergePointer, } from './hub/pointers.js';
import { planMigration, renderPlan } from './hub/migrate.js';
```

**依据 3 · 源码核查**：[package.json:57-69](https://github.com/121212165/dsh-plugin-ide-hub/blob/f4e57a76bb8ac36867d237d148352ec15dfc0bc3/package.json#L57-L69)

这些包位于开发依赖，peer只列cordis。

<details>
<summary>查看原文（13行）</summary>

```text
  },
  "sideEffects": false,
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.2",
    "@deepseek-ai/dsh-base": "^0.1.2-alpha.4",
    "@deepseek-ai/schemastery": "3.18.2",
    "@deepseek-ai/dsh-tools": "^0.1.2-alpha.4",
    "@types/node": "26.6.2",
    "typescript": "7.0.2",
    "@dsh-family/kit": "github:121212165/dsh-plugin-kit#v0.1.0"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": ">=4.0.0"
```

</details>

**依据 4 · 作者声明**：[README.md:32-46](https://github.com/121212165/dsh-plugin-ide-hub/blob/f4e57a76bb8ac36867d237d148352ec15dfc0bc3/README.md#L32-L46)

作者安装流程和历史环境。

<details>
<summary>查看原文（15行）</summary>

````text
## 安装

三步，2026-10-03 在**全新 `DSH_HOME`** 上按本文档重跑通过（`@deepseek-ai/dsh@0.2.0-rc.2` + `pnpm 10.20.0`）：

```sh
# ① 装进 profile：dsh plugin 把参数原样转发给 pnpm，git 包会自动跑 prepare 构建 lib/
dsh plugin --profile web add github:121212165/dsh-plugin-ide-hub
```

② 把本仓库根目录 `cordis.patch.yml` 的内容**并进** `$DSH_HOME/profiles/web/cordis.patch.yml`。
该文件默认是 `[]`，所以要么整份替换，要么把 insert 条目并进同一个数组；**不要直接追加**——
追加会形成两个 YAML 文档，启动即报
`failed to parse overlay ... end of the stream or a document separator is expected`（本机实测踩过）。

③ 重启 dsh。配置层与 client 半都要重启才生效（客户端按 boot 时算出的内容 rev 下发，硬刷新浏览器没用）。
````

</details>

#### 缺口

- 固定版本独立消费者依赖解析尚无证据
  **影响**：无法确认可按文档直接加载
  **进一步探讨**：在隔离profile只安装发布包核对导入解析与禁用退出，保留依赖树

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 解析纯函数和回执可复用性及收益边界如何？

**研究主题**：效果与总成本、工程质量与复用

#### 完整回答

可借鉴适配器、纯聚合与命令层分离，规则merge保留用户正文并返回每文件结果，导出按内容跳过减少重复写。移植成本主要是各IDE私有路径/SQLite schema变动和计量语义维护；原子单文件写依赖外部kit，不应把它算作本项目原创。以一次“定位旧任务并用正确规则恢复”为合格单位，首次配置目录/额度与依赖，持续需手填额度和复核建议，失败需恢复部分写入文件。无真实节时/差错率数据，不能将零API等同零成本。

#### 证据与依据

**依据 1 · 源码核查**：[src/plugin.ts:285-314](https://github.com/121212165/dsh-plugin-ide-hub/blob/f4e57a76bb8ac36867d237d148352ec15dfc0bc3/src/plugin.ts#L285-L314)

本体保留、逐项结果与指针合并。

<details>
<summary>查看原文（30行）</summary>

```text
  const bodyPath = join(root, HUB_BODY);
  if (readIf(bodyPath) !== null) {
    changes.push({ file: rel(bodyPath), outcome: 'kept', detail: '规则本体已存在，里面是项目自己的内容，未覆盖' });
  } else {
    changes.push(write(bodyPath, rel(bodyPath), renderHubAgents(project), '按模板新建，去填目标/命令/禁忌'));
  }

  const notesPath = join(root, '.hub', 'PROJECT_NOTES.md');
  if (readIf(notesPath) !== null) {
    changes.push({ file: rel(notesPath), outcome: 'kept', detail: '备忘已存在，未覆盖' });
  } else {
    changes.push(write(notesPath, rel(notesPath), renderProjectNotes(project), '按模板新建'));
  }

  const scan = scanTree(root);
  const structurePath = join(root, '.hub', 'STRUCTURE.json');
  changes.push(write(structurePath, rel(structurePath), renderStructureJson(project, scan.entries, now), `结构快照 ${scan.entries.length} 个条目（深度 2，跳过 .git 与 node_modules 等）`));

  const block = pointerBlock();
  for (const target of targets) {
    const file = join(root, target.path);
    const merged = mergePointer(readIf(file), block);
    if (merged.action === 'noop') {
      changes.push({ file: target.path, outcome: 'unchanged', detail: `指针段已在（${target.tools.join('/')}）` });
      continue;
    }
    const how = merged.action === 'create' ? '新建' : merged.action === 'append' ? '在已有内容后追加' : '重写';
    changes.push(write(file, target.path, merged.content, `${how}指针段 → ${target.tools.join('/')}（${target.notes[0] ?? '路径未核实'}）`));
  }
  return { project, root, changes, manual: manual.map((spec) => ({ tool: spec.tool, note: spec.note })), truncated: scan.truncated };
```

</details>

**依据 2 · 源码核查**：[src/hub/obsidian.ts:80-93](https://github.com/121212165/dsh-plugin-ide-hub/blob/f4e57a76bb8ac36867d237d148352ec15dfc0bc3/src/hub/obsidian.ts#L80-L93)

内容幂等写与外部kit依赖。

<details>
<summary>查看原文（14行）</summary>

```text
/** Idempotent write: identical content skips, changed content overwrites. */
export function writeNotes(vaultDir: string, notes: ObsidianNote[]): { written: string[]; skipped: number } {
  const written: string[] = [];
  let skipped = 0;
  for (const note of notes) {
    const file = join(vaultDir, note.path);
    if (existsSync(file) && readFileSync(file, 'utf8') === note.content) {
      skipped++;
      continue;
    }
    writeFileAtomic(file, note.content);
    written.push(note.path);
  }
  return { written, skipped };
```

</details>

**依据 3 · 作者声明**：[README.md:28-30](https://github.com/121212165/dsh-plugin-ide-hub/blob/f4e57a76bb8ac36867d237d148352ec15dfc0bc3/README.md#L28-L30)

today信息和额度计划输入来源。

```text
- **`/today`**：**今天第一件事**。把四个兄弟插件写在磁盘上的事实汇成一个排序结论——quota 的 `summary.json`（预算与下步预估）、cost-ledger 的当月台账、task-forge 的 `ledger.jsonl`（谁卡在等谁）、tool-trace 的调用记录（连败=系统性故障）。规则表在 `src/hub/today.ts`，是纯函数、逐条有测试；读不到哪个文件就在输出里点名「看不到的部分」，不假装全知。
- **`/hub-migrate`**：配额迁移计划。按你配的 `remainingMajor` / `dailyMajor` / `priority` 算每个工具的耗尽倒计时，并给出该把活优先挪给谁。
- **`/hub-export`**：把盘点结果与规则文件导出成 Obsidian 笔记（`IDE-Hub/` 子树），未变化的文件跳过。
```

#### 缺口

- 合格会话恢复和规则生效的独立成功率缺失
  **影响**：未知统一入口是否抵消适配维护负担
  **进一步探讨**：用同一多IDE任务比较手动与hub流程，计入规则核验和格式修正时间

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 版本化适配器加计量可信度能否改善建议，适合谁试用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证方向是让每个适配器返回格式版本、覆盖范围、字段语义与去重口径，无法核实时只给原始计数而不输出确定预算建议；规则批写再以预览清单和内容摘要作统一确认。它由私有格式与多文件写入边界推导，相对增加适配器数量更强调可信度，代价是维护版本矩阵及显式未知状态。先用跨版本真实日志和中断写入样本检验错误计量、越界扫描及部分更新是否被暴露；若不能改善用户恢复正确率则否定。当前先观察，依赖闭合及扫描边界确认后才对副本试用。

#### 证据与依据

**依据 1 · 源码核查**：[src/hub/usage-reader.ts:95-112](https://github.com/121212165/dsh-plugin-ide-hub/blob/f4e57a76bb8ac36867d237d148352ec15dfc0bc3/src/hub/usage-reader.ts#L95-L112)

字段语义需版本化。

<details>
<summary>查看原文（18行）</summary>

```text
export function codexRecord(line: CodexLine): UsageRecord | null {
  if (line.type !== 'event_msg') return null;
  const payload = line.payload;
  const total = payload?.info?.total_token_usage;
  if (payload?.type !== 'token_count' || !total || !line.timestamp) return null;
  const input = num(total.input_tokens);
  const output = num(total.output_tokens) + num(total.reasoning_output_tokens);
  const cacheRead = num(total.cached_input_tokens);
  return {
    tool: 'codex',
    sessionId: payload.session_id ?? 'unknown',
    at: line.timestamp,
    day: dayOf(line.timestamp),
    inputTokens: input,
    outputTokens: output,
    cacheReadTokens: cacheRead,
    cacheWriteTokens: 0,
  };
```

</details>

**依据 2 · 源码核查**：[src/plugin.ts:115-150](https://github.com/121212165/dsh-plugin-ide-hub/blob/f4e57a76bb8ac36867d237d148352ec15dfc0bc3/src/plugin.ts#L115-L150)

扫描边界需要显式覆盖证明。

<details>
<summary>查看原文（36行）</summary>

```text
export function scanTree(root: string, limit = 300, depth = 2): TreeScan {
  const entries: TreeEntry[] = [];
  let truncated = false;
  const walk = (dir: string, level: number): void => {
    if (truncated || level > depth) return;
    let names: string[];
    try {
      names = readdirSync(dir, { withFileTypes: true })
        .filter((entry) => !entry.name.startsWith('.') && !SKIP_DIRS.has(entry.name))
        .map((entry) => entry.name)
        .sort();
    } catch {
      return;
    }
    for (const name of names) {
      if (entries.length >= limit) {
        truncated = true;
        return;
      }
      const full = join(dir, name);
      const rel = relative(root, full).replace(/\\/g, '/');
      let stat;
      try {
        stat = statSync(full);
      } catch {
        continue;
      }
      if (stat.isDirectory()) {
        entries.push({ path: `${rel}/`, kind: 'dir' });
        walk(full, level + 1);
      } else if (stat.isFile()) {
        entries.push({ path: rel, kind: 'file', size: stat.size });
      }
    }
  };
  walk(root, 1);
```

</details>

**依据 3 · 源码核查**：[src/plugin.ts:303-314](https://github.com/121212165/dsh-plugin-ide-hub/blob/f4e57a76bb8ac36867d237d148352ec15dfc0bc3/src/plugin.ts#L303-L314)

逐文件写可由清单化确认改造。

<details>
<summary>查看原文（12行）</summary>

```text
  const block = pointerBlock();
  for (const target of targets) {
    const file = join(root, target.path);
    const merged = mergePointer(readIf(file), block);
    if (merged.action === 'noop') {
      changes.push({ file: target.path, outcome: 'unchanged', detail: `指针段已在（${target.tools.join('/')}）` });
      continue;
    }
    const how = merged.action === 'create' ? '新建' : merged.action === 'append' ? '在已有内容后追加' : '重写';
    changes.push(write(file, target.path, merged.content, `${how}指针段 → ${target.tools.join('/')}（${target.notes[0] ?? '路径未核实'}）`));
  }
  return { project, root, changes, manual: manual.map((spec) => ({ tool: spec.tool, note: spec.note })), truncated: scan.truncated };
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
