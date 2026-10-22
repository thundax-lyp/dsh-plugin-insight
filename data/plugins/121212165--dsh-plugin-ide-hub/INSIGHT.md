# dsh-plugin-ide-hub

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[814621b](https://github.com/121212165/dsh-plugin-ide-hub/tree/814621be897a27752550b0be6f7be2bc44ccb897)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-ide-hub)
<!-- END META -->

> **实现功能**：汇总多IDE本地会话与用量、手填额度建议和日程规则，生成共享提示词指针并导出Obsidian快照。

> **核心亮点**：汇总分散IDE磁盘事实并让规则共用正文，减少切换。详见[Q01](#research-q01)。

> **风险与缺陷**：workspace运行依赖未闭合，用量字段可能重复计量，结构扫描跟链接而规则批写缺事务。详见[Q02](#research-q02)、[Q03](#research-q03)、[Q04](#research-q04)。

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
  - [Q01 · 统一IDE管理具体统一了什么？](#detail-section-11)
  - [Q02 · 本地读取、排序和安装依赖如何组成？](#detail-section-12)
  - [Q03 · 用量与恢复命令有何语义风险？](#detail-section-13)
  - [Q04 · 规则写入与导出是否安全且幂等？](#detail-section-14)
  - [Q05 · 工程证据和使用成本支持哪些结论？](#detail-section-15)
  - [Q06 · 推荐条件与进一步探讨方向是什么？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：多编码工具用户集中找会话、查本地用量和管理项目规则。详见[Q01](#research-q01)。

各IDE原生会话/用量页面、手工规则和Obsidian整理，集中便利不等跨工具计费准确。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 本地会话/用量 | 多IDE查询 | 部分视图/格式契约 |
| 手填额度和today | 规则建议 | 非自动迁移 |
| 指针/快照导出 | 规则管理 | 写入和同步需审阅 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| Node>=22.18/SQLite | 本地库 | API/schema匹配 |
| Cordis/Schema/commands | 注册命令 | 宿主ABI |
| prepare/TypeScript/kit | 生成lib和原子写辅助 | workspace解析来源未知 |
| 本地IDE数据/vault | 读取与导出 | 路径/格式/同步敏感 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 核分发依赖 | 维护者 | 独立构建/加载来源清楚 |
| 只读盘点 | 用户 | 数字与原工具对账 |
| dry-run规则 | 用户 | 链接/目标与备份 |
| 审阅导出 | 用户 | vault隐私与部分写入可恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 可构建依赖/本地IDE根 | 核版本、字段与规则备份 | 需对齐构建与IDE字段；准备工时未知 |
| 持续使用 | 同步全历史扫描，无模型API | 多格式契约维护/大文件延迟 | 无插件模型API；全历史扫描规模与延迟未知 |
| 失败恢复 | 原规则/原工具账目 | 对账、部分写入与指针回退 | 规则导出扩大数据驻留；对账和部分写修复工时未知 |


#### 效果

| 目标 | 源码支持 | 边界 |
| --- | --- | --- |
| 集中找状态 | 多根/DB/JSONL | 文件证据非全真实会话 |
| 额度建议 | 手填runway规则 | 非额度迁移/账单 |
| 规则共用 | .hub标记指针 | 链接与批写需审阅 |

> **思考**：workspace运行依赖未闭合，用量字段可能重复计量，结构扫描跟链接而规则批写缺事务。详见[Q02](#research-q02)、[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：汇总分散IDE磁盘事实并让规则共用正文，减少切换。详见[Q01](#research-q01)。

汇总分散IDE磁盘事实并让规则共用正文，减少切换。详见[Q01](#research-q01)。

纯解析与排序分层、盲区回执可借鉴；fixture自洽不等外部计量正确。详见[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

workspace运行依赖未闭合，用量字段可能重复计量，结构扫描跟链接而规则批写缺事务。详见[Q02](#research-q02)、[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，可信本地只读盘点优先，规则写入先dry-run和Git备份。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

集中管理流程源码可查，独立依赖、计量契约、同步扫描和链接写入边界限制采用。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/plugin.ts、src/hub/inventory.ts、src/hub/usage.ts、src/hub/usage-reader.ts、src/hub/migrate.ts、src/hub/today.ts、src/hub/obsidian.ts、src/hub/zcode-db.ts、src/hub/trae-db.ts、test/usage.test.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定plugin命令、inventory、usage/reader、migrate、today规则接口、Obsidian及ZCode/Trae关键读取、fixture定向核查，不穷尽全部adapter。
- 下一步：进一步从跨日累计、真实字段、链接环和重复导出探讨版本化回执/预算扫描。

**分析版本**

- **仓库**：[121212165/dsh-plugin-ide-hub](https://github.com/121212165/dsh-plugin-ide-hub)
- **版本号**：0.7.0（[固定提交 814621b](https://github.com/121212165/dsh-plugin-ide-hub/tree/814621be897a27752550b0be6f7be2bc44ccb897)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

研究版本化适配器/差分计数与损失回执、物理root扫描预算及内容hash导出，比较误差和恢复。当前未验证。详见[Q06](#research-q06)。

进一步从跨日累计、真实字段、链接环和重复导出探讨版本化回执/预算扫描。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 136 | — | — | 2890 |
| .ts | source | 13 | 2285 | 1953 | 174 | — |
| .ts | test | 10 | 1400 | 1216 | 53 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=grey&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-ide-hub/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=grey&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-ide-hub/issues?q=is%3Aissue+created%3A2026-09-22T06%3A06%3A23.793Z..2026-10-22T06%3A06%3A23.793Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-ide-hub/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A06%3A23.793Z..2026-10-22T06%3A06%3A23.793Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：跨IDE本地事实和规则管理如何工作，计量/写入/分发的边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 统一IDE管理具体统一了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向同时使用多种编码工具的个人用户，在DSH命令中盘点本地会话证据、查询用量/最近会话/周活跃、查看手填额度迁移建议，将规则指针接到同一.hub正文，并导出Obsidian快照。today另读取兄弟插件本地事实给规则排序。贡献是把分散磁盘契约和规则入口集中，不是把账号额度真正迁移，也没有代替各IDE执行任务或自动恢复会话。恢复输出是命令文本。

八适配器并不等八家都有相同深度的用量/内容读取。inventory只计符合后缀或目录名的“会话证据”，present是路径存在，不是软件安装/登录验证。源码已把Trae接入sessions/week，与README旧英语段“未接入”不同，报告以固定实现为准。合格结果需标明来源/部分本地视图和字段含义，不能把文件数当唯一真实会话数。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:17-30](https://github.com/121212165/dsh-plugin-ide-hub/blob/814621be897a27752550b0be6f7be2bc44ccb897/README.md#L17-L30)

作者功能表和旧Trae文字。

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

**依据 2 · 源码核查**：[src/hub/inventory.ts:94-115](https://github.com/121212165/dsh-plugin-ide-hub/blob/814621be897a27752550b0be6f7be2bc44ccb897/src/hub/inventory.ts#L94-L115)

present和统计语义。

<details>
<summary>查看原文（22行）</summary>

```text
export function inventory(spec: IdeSpec): IdeInventory {
  const roots: IdeInventory['roots'] = [];
  for (const raw of spec.dataRoots) {
    const root = expandPath(raw);
    if (!existsSync(root)) {
      roots.push({ root, present: false, sessions: 0, bytes: 0, lastActive: null });
      continue;
    }
    const state: WalkStat = { sessions: 0, bytes: 0, lastActive: null };
    walk(root, spec, 0, state);
    roots.push({ root, present: true, sessions: state.sessions, bytes: state.bytes, lastActive: state.lastActive ? new Date(state.lastActive).toISOString() : null });
  }
  const presentRoots = roots.filter((root) => root.present);
  return {
    tool: spec.tool,
    vendor: spec.vendor,
    present: presentRoots.length > 0,
    sessions: presentRoots.reduce((total, root) => total + root.sessions, 0),
    bytes: presentRoots.reduce((total, root) => total + root.bytes, 0),
    lastActive: presentRoots.map((root) => root.lastActive).filter(Boolean).sort().at(-1) ?? null,
    roots,
  };
```

</details>

**依据 3 · 源码核查**：[src/plugin.ts:432-478](https://github.com/121212165/dsh-plugin-ide-hub/blob/814621be897a27752550b0be6f7be2bc44ccb897/src/plugin.ts#L432-L478)

实际sessions/week接入。

<details>
<summary>查看原文（47行）</summary>

```text
  ctx.commands.register({
    name: 'hub-sessions',
    description: '跨 IDE 最近会话 + 一键恢复命令（claude --resume / codex resume / dsh --resume …）',
    handler: () => {
      const records = [...scanClaudeCode(), ...scanCodex()];
      const sessions = [...recentSessions(records, 10), ...readZcodeSessions(undefined, 5)];
      const trae = traeChatSessions(scanTrae(), 5);
      const traeLines = trae.map((session) => `  [trae] ${(session.updatedAt || '').slice(0, 16).replace('T', ' ')} · ${session.title.slice(0, 30)}（${session.localMessages} 条本地消息${session.hasMore ? '，云上有更多' : ''}）— 无 CLI 恢复命令，需在 Trae 内打开项目 ${session.workspaceFolder ?? ''}`);
      const lines = sessions.map((session) => {
        const cwd = session.cwd ? ` · ${session.cwd}` : '';
        const resume = session.resumeCommand ?? '（该工具无私有恢复命令）';
        return `  [${session.tool}] ${session.at.slice(0, 16).replace('T', ' ')}${cwd}\n    ↳ ${resume}`;
      });
      if (!sessions.length && !traeLines.length) return { kind: 'error', text: '没有找到可恢复的会话。' };
      const sections = [
        ...(sessions.length ? [`最近 ${sessions.length} 个会话:`, ...lines] : []),
        ...(traeLines.length ? [`trae 最近 ${traeLines.length} 个会话（本地转录，需在 Trae 内恢复）:`, ...traeLines] : []),
      ];
      return { kind: 'success', text: sections.join('\n') };
    },
  });

  ctx.commands.register({
    name: 'hub-week',
    description: '各 IDE 近 7 天活跃：会话数/轮次/token/活跃日（复用 /hub-sessions 同源读取器）',
    handler: () => {
      const now = new Date();
      const weekToken = (record: { tool: string; sessionId: string; at: string; day: string; inputTokens: number; outputTokens: number; cacheReadTokens: number; cacheWriteTokens: number }) => ({
        tool: record.tool,
        sessionId: record.sessionId,
        at: record.at,
        day: record.day,
        totalTokens: record.inputTokens + record.outputTokens + record.cacheReadTokens + record.cacheWriteTokens,
      });
      const sources = [
        ...scanClaudeCode().map(weekToken),
        ...scanCodex().map(weekToken),
        ...readZcodeUsage().map(weekToken),
        ...traeChatSessions(scanTrae(), 100).map((session) => ({
          tool: 'trae',
          sessionId: session.sessionId,
          at: session.updatedAt ?? '',
          day: (session.updatedAt ?? '').slice(0, 10),
          totalTokens: undefined as number | undefined,
        })),
      ];
      return { kind: 'success', text: renderWeek(weekActivity(sources, now)) };
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 本地读取、排序和安装依赖如何组成？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

plugin只注入commands，命令即时扫描默认registry根；Claude/Codex读JSONL，ZCode/Trae用node:sqlite readOnly读本地库，rules发现后按需读正文。migrate用用户填写remainingMajor/dailyMajor算floor天数，<=2标耗尽、<=7紧张，再选余额更大的候选；候选不按priority过滤，queue优先找同priority否则任意healthy首项，不能当质量/价格/模型能力匹配。today是可测试纯规则表，缺失源保留blind，不是AI自主规划或因果预测。

package main在lib而固定树无lib，Git安装依赖prepare执行tsc；源码运行import @dsh-family/kit，但包仅将workspace:*列devDependencies，固定独立仓库没提供该包，干净安装/打包依赖闭合无法从本仓库证明。Node>=22.18且宿主Cordis/Schema/commands需匹配。README干净安装经历是作者对其环境的报告，不能覆盖当前workspace依赖疑点。

#### 证据与依据

**依据 1 · 源码核查**：[src/plugin.ts:6-37](https://github.com/121212165/dsh-plugin-ide-hub/blob/814621be897a27752550b0be6f7be2bc44ccb897/src/plugin.ts#L6-L37)

运行导入与commands。

<details>
<summary>查看原文（32行）</summary>

```text
import type { Context } from '@deepseek-ai/cordis';
import Schema from '@deepseek-ai/schemastery';
import type {} from '@deepseek-ai/dsh-commands';
import { existsSync, readFileSync, readdirSync, rmdirSync, rmSync, statSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';

import { writeFileAtomic } from '@dsh-family/kit';

import { defaultRegistry, type IdeSpec } from './hub/registry.ts';
import { inventory, expandPath, type IdeInventory } from './hub/inventory.ts';
import {
  HUB_BODY,
  POINTER_SPECS,
  mergePointer,
  pointerBlock,
  pointerTargets,
  renderHubAgents,
  renderProjectNotes,
  renderStructureJson,
  unmergePointer,
  type TreeEntry,
} from './hub/pointers.ts';
import { planMigration, renderPlan, type QuotaState } from './hub/migrate.ts';
import { prioritiseToday, renderToday, type TodaySignals } from './hub/today.ts';
import { readBudget, readForecast, readSessions, readSpend, readTasks, readTools } from './hub/today-readers.ts';
import { discoverRules, renderInventoryNote, renderMigrationNote, renderRulesNotes, writeNotes, type RuleFileInfo } from './hub/obsidian.ts';
import { scanClaudeCode, scanCodex, aggregate, renderUsage, recentSessions, weekActivity, renderWeek, type UsageRecord } from './hub/usage.ts';
import { readZcodeUsage, readZcodeSessions, readZcodeModels, zcodeStats, type ZcodeUsageRecord } from './hub/zcode-db.ts';
import { scanTrae, traeChatSessions } from './hub/trae-db.ts';

export const name = 'ide-hub';
export const inject = ['commands'];
```

</details>

**依据 2 · 源码核查**：[src/hub/migrate.ts:27-59](https://github.com/121212165/dsh-plugin-ide-hub/blob/814621be897a27752550b0be6f7be2bc44ccb897/src/hub/migrate.ts#L27-L59)

阈值和迁移候选。

<details>
<summary>查看原文（33行）</summary>

```text
export function planMigration(states: QuotaState[]): MigrationPlan {
  const daysLeft = (state: QuotaState): number | null =>
    state.dailyMajor > 0 ? Math.floor(state.remainingMajor / state.dailyMajor) : state.remainingMajor > 0 ? null : 0;
  const verdictOf = (state: QuotaState): MigrationAdvice['verdict'] => {
    if (state.remainingMajor <= 0) return 'exhausted';
    const left = daysLeft(state);
    if (left === null) return 'idle';
    if (left <= 2) return 'exhausted';
    if (left <= 7) return 'tight';
    return 'healthy';
  };
  const advisories: MigrationAdvice[] = states.map((state) => {
    const verdict = verdictOf(state);
    const migrateTo =
      verdict === 'exhausted' || verdict === 'tight'
        ? states
            .filter((other) => other.tool !== state.tool && other.remainingMajor > state.remainingMajor)
            .sort((a, b) => b.remainingMajor - a.remainingMajor)
            .slice(0, 2)
            .map((other) => ({ tool: other.tool, daysLeft: daysLeft(other) }))
        : [];
    return { tool: state.tool, daysLeft: daysLeft(state), verdict, migrateTo };
  });
  // tomorrow's run-queue: put work on healthy tools of matching priority, batch on idle/cheap
  const healthy = states
    .filter((state) => verdictOf(state) === 'healthy' || verdictOf(state) === 'idle')
    .sort((a, b) => b.remainingMajor - a.remainingMajor);
  const queue: MigrationPlan['queue'] = [];
  for (const priority of ['work', 'batch', 'learning'] as const) {
    const match = healthy.find((state) => state.priority === priority) ?? healthy[0];
    if (match) queue.push({ tool: match.tool, priority });
  }
  return { advisories, queue };
```

</details>

**依据 3 · 源码核查**：[src/hub/today.ts:81-120](https://github.com/121212165/dsh-plugin-ide-hub/blob/814621be897a27752550b0be6f7be2bc44ccb897/src/hub/today.ts#L81-L120)

快照/盲区与规则。

<details>
<summary>查看原文（40行）</summary>

```text
export interface TodaySignals {
  now: Date;
  budget: BudgetSignal | null;
  spend: SpendSignal | null;
  tasks: TaskSignal[];
  tools: ToolSignal | null;
  /** optional so older signal snapshots stay valid; null/absent = blind spot */
  sessions?: SessionsSignal | null;
  forecast?: ForecastSignal | null;
}

export interface TodayAction {
  /** what to do, in the user's words */
  do: string;
  /** which signal made this the answer */
  why: string;
  /** the command that acts on it */
  command: string;
}

export interface TodayPlan {
  headline: string;
  actions: TodayAction[];
  /** blocks that were missing, so the answer never claims full sight */
  blind: string[];
}

/** Tuning knobs, stated as numbers the tests can pin. */
export const TODAY_RULES = {
  /** ratio at which the budget becomes the headline */
  budgetAlert: 0.8,
  /** a relay nobody has read back after this many hours blocks the day */
  ackStaleHours: 24,
  /** tool-trace streak length that counts as systemic (matches error-radar) */
  streakAlert: 3,
  /** error-rate line, fraction (error-radar's default 20%) */
  errorRateAlert: 0.2,
  /** daysUntilBudget at or below which the burn-out becomes an action */
  burnSoonDays: 7,
};
```

</details>

**依据 4 · 源码核查**：[src/hub/zcode-db.ts:1-37](https://github.com/121212165/dsh-plugin-ide-hub/blob/814621be897a27752550b0be6f7be2bc44ccb897/src/hub/zcode-db.ts#L1-L37)

SQLite依赖。

<details>
<summary>查看原文（37行）</summary>

```text
import { DatabaseSync } from 'node:sqlite';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import type { UsageRecord, SessionRef } from './usage-reader.ts';

/** ZCode local telemetry reader (v0.3). The structured logs redact token
 * counts, but the harness persists full per-turn/per-model usage in
 * ~/.zcode/cli/db/db.sqlite (tables: session, turn_usage, model_usage).
 * Opened read-only so a live harness is never disturbed. */

export interface ZcodeUsageRecord extends UsageRecord {
  durationMs: number;
  toolCalls: number;
  toolErrors: number;
  status: string;
}

export interface ZcodeSessionRef extends SessionRef {
  title?: string | undefined;
  turns: number;
  lastActive: string;
}

export function zcodeDbPath(root?: string): string {
  return root ?? join(homedir(), '.zcode', 'cli', 'db', 'db.sqlite');
}

const num = (value: unknown): number => (typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : 0);

function iso(ms: unknown): string {
  return typeof ms === 'number' && ms > 0 ? new Date(ms).toISOString() : new Date(0).toISOString();
}

export function readZcodeUsage(dbPath: string = zcodeDbPath()): ZcodeUsageRecord[] {
  if (!existsSync(dbPath)) return [];
  const db = new DatabaseSync(dbPath, { readOnly: true });
```

</details>

**依据 5 · 源码核查**：[package.json:1-41](https://github.com/121212165/dsh-plugin-ide-hub/blob/814621be897a27752550b0be6f7be2bc44ccb897/package.json#L1-L41)

main/build。

<details>
<summary>查看原文（41行）</summary>

```text
{
  "name": "dsh-plugin-ide-hub",
  "version": "0.7.0",
  "description": "dsh plugin: unified manager across coding IDEs (Trae/Qoder/ZCode/CatPaw/Codex/Claude Code/OpenCode/dsh) — session inventory, quota migration planning, shared prompt-rules registry, Obsidian knowledge export.",
  "type": "module",
  "license": "MIT",
  "main": "./lib/index.js",
  "types": "./lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./package.json": "./package.json",
    "./locale/*": "./locale/*",
    "./icon.svg": "./icon.svg"
  },
  "files": [
    "lib",
    "src",
    "cordis.patch.yml",
    "README.md",
    "LICENSE",
    "icon.svg",
    "locale"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "engines": {
    "node": ">=22.18"
  },
  "scripts": {
    "build": "tsc -p tsconfig.build.json",
    "prepare": "npm run build",
    "test": "node --test \"test/*.test.ts\"",
    "typecheck": "tsc --noEmit",
    "check": "npm run typecheck && npm test && npm run build"
  },
```

</details>

**依据 6 · 源码核查**：[package.json:57-68](https://github.com/121212165/dsh-plugin-ide-hub/blob/814621be897a27752550b0be6f7be2bc44ccb897/package.json#L57-L68)

workspace dev依赖。

<details>
<summary>查看原文（12行）</summary>

```text
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.2",
    "@deepseek-ai/dsh-base": "^0.1.2-alpha.4",
    "@deepseek-ai/schemastery": "3.18.2",
    "@deepseek-ai/dsh-tools": "^0.1.2-alpha.4",
    "@types/node": "26.6.2",
    "typescript": "7.0.2",
    "@dsh-family/kit": "workspace:*"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": ">=4.0.0"
  },
```

</details>

**依据 7 · 作者声明**：[README.md:34-38](https://github.com/121212165/dsh-plugin-ide-hub/blob/814621be897a27752550b0be6f7be2bc44ccb897/README.md#L34-L38)

作者安装声称。

````text
三步，2026-10-03 在**全新 `DSH_HOME`** 上按本文档重跑通过（`@deepseek-ai/dsh@0.2.0-rc.2` + `pnpm 10.20.0`）：

```sh
# ① 装进 profile：dsh plugin 把参数原样转发给 pnpm，git 包会自动跑 prepare 构建 lib/
dsh plugin --profile web add github:121212165/dsh-plugin-ide-hub
````

#### 缺口

- @dsh-family/kit在独立Git安装/发布包的实际解析来源未由固定仓库给出
  **影响**：不能据README声称认定当前分发可独立构建和加载
  **进一步探讨**：核对锁定分发包内容与运行依赖声明，保留宿主安装版本

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 用量与恢复命令有何语义风险？

**研究主题**：缺陷与关键质疑

#### 完整回答

Codex扫描每文件只留最后累计token_count，避免把多个累计值直接相加是合理修正；但全部会话累计量归到末事件day，跨日会话不能还原每日增量。codexRecord将output_tokens与reasoning_output_tokens相加，aggregate又把input和cached_input相加；若对应格式中的reasoning/cache本就是父字段子集会重复计量，目标测试只验证自己设定数字，不证明上游实际契约。session_meta只取payload.session_id，若特定格式用其他ID字段会落unknown，多会话按同key去重失真。不能把读到的token汇总直接当实际账单或跨工具可比成本。

坏行/读错多静默跳过，没有逐文件损失回执。resumeCommand直接插会话ID/路径，无shell引用且不校验字符；插件只展示不执行，但用户复制不可信本地转录产生的命令前仍需审阅。Trae明确本地分页hasMore，ZCode SQL绑定既定表结构，schema漂移可失败；只读数据库不等所有工具本地状态完整。

#### 证据与依据

**依据 1 · 源码核查**：[src/hub/usage.ts:47-94](https://github.com/121212165/dsh-plugin-ide-hub/blob/814621be897a27752550b0be6f7be2bc44ccb897/src/hub/usage.ts#L47-L94)

累计末事件与session meta。

<details>
<summary>查看原文（48行）</summary>

```text
export function scanCodex(codexRoot?: string): UsageRecord[] {
  const root = codexRoot ?? join(homedir(), '.codex', 'sessions');
  const records: UsageRecord[] = [];
  if (!existsSync(root)) return records;
  const stack = [root];
  while (stack.length) {
    const current = stack.pop()!;
    let entries: string[];
    try {
      entries = readdirSync(current);
    } catch {
      continue;
    }
    for (const name of entries) {
      const full = join(current, name);
      try {
        if (statSync(full).isDirectory()) {
          stack.push(full);
          continue;
        }
      } catch {
        continue;
      }
      if (!name.endsWith('.jsonl')) continue;
      let cwd: string | undefined;
      let sessionId: string | undefined;
      // token_count totals are cumulative within a session: keep only the LAST
      // event, otherwise summing every event multiplies the real spend
      let last: UsageRecord | null = null;
      for (const line of readLines(full)) {
        try {
          const parsed = JSON.parse(line) as import('./usage-reader.ts').CodexLine;
          if (parsed.type === 'session_meta' && parsed.payload) {
            cwd = parsed.payload.cwd;
            sessionId = parsed.payload.session_id;
          }
          const record = codexRecord(parsed);
          if (record) {
            last = { ...record, cwd, sessionId: record.sessionId === 'unknown' ? (sessionId ?? 'unknown') : record.sessionId };
          }
        } catch {
          // malformed line: skip
        }
      }
      if (last) records.push(last);
    }
  }
  return records;
```

</details>

**依据 2 · 源码核查**：[src/hub/usage.ts:110-152](https://github.com/121212165/dsh-plugin-ide-hub/blob/814621be897a27752550b0be6f7be2bc44ccb897/src/hub/usage.ts#L110-L152)

相加聚合。

<details>
<summary>查看原文（43行）</summary>

```text
export function aggregate(records: UsageRecord[]): UsageAggregate[] {
  const byTool = new Map<string, UsageRecord[]>();
  for (const record of records) {
    const group = byTool.get(record.tool) ?? [];
    group.push(record);
    byTool.set(record.tool, group);
  }
  const out: UsageAggregate[] = [];
  for (const [tool, group] of byTool) {
    const byDay = new Map<string, { day: string; totalTokens: number; events: number }>();
    const byModel = new Map<string, number>();
    const projects = new Set<string>();
    let input = 0;
    let output = 0;
    let cacheRead = 0;
    let cacheWrite = 0;
    for (const record of group) {
      const tokens = record.inputTokens + record.outputTokens + record.cacheReadTokens + record.cacheWriteTokens;
      input += record.inputTokens;
      output += record.outputTokens;
      cacheRead += record.cacheReadTokens;
      cacheWrite += record.cacheWriteTokens;
      const day = byDay.get(record.day) ?? { day: record.day, totalTokens: 0, events: 0 };
      day.totalTokens += tokens;
      day.events++;
      byDay.set(record.day, day);
      if (record.model) byModel.set(record.model, (byModel.get(record.model) ?? 0) + tokens);
      if (record.cwd) projects.add(record.cwd);
    }
    out.push({
      tool,
      days: byDay.size,
      inputTokens: input,
      outputTokens: output,
      cacheReadTokens: cacheRead,
      cacheWriteTokens: cacheWrite,
      totalTokens: input + output + cacheRead + cacheWrite,
      byDay: [...byDay.values()].sort((a, b) => (a.day < b.day ? -1 : 1)),
      byModel: [...byModel.entries()].map(([model, totalTokens]) => ({ model, totalTokens })).sort((a, b) => b.totalTokens - a.totalTokens),
      projects: projects.size,
    });
  }
  return out.sort((a, b) => b.totalTokens - a.totalTokens);
```

</details>

**依据 3 · 源码核查**：[src/hub/usage-reader.ts:95-112](https://github.com/121212165/dsh-plugin-ide-hub/blob/814621be897a27752550b0be6f7be2bc44ccb897/src/hub/usage-reader.ts#L95-L112)

Codex字段相加。

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

**依据 4 · 源码核查**：[src/hub/usage-reader.ts:117-133](https://github.com/121212165/dsh-plugin-ide-hub/blob/814621be897a27752550b0be6f7be2bc44ccb897/src/hub/usage-reader.ts#L117-L133)

命令插值。

<details>
<summary>查看原文（17行）</summary>

```text
export function resumeCommand(tool: string, sessionId: string, sessionPath?: string): string | null {
  switch (tool) {
    case 'claude-code':
      return `claude --resume ${sessionId}`;
    case 'codex':
      return `codex resume ${sessionId}`;
    case 'dsh':
      return `dsh --resume ${sessionId}`;
    case 'zcode':
      return `zcode --resume ${sessionId}`;
    case 'opencode':
      return sessionPath ? `opencode --session ${sessionPath}` : null;
    case 'pi':
      return sessionPath ? `pi --session ${sessionPath}` : null;
    default:
      return null; // private formats: no public resume flag known yet
  }
```

</details>

**依据 5 · 源码核查**：[src/hub/trae-db.ts:6-21](https://github.com/121212165/dsh-plugin-ide-hub/blob/814621be897a27752550b0be6f7be2bc44ccb897/src/hub/trae-db.ts#L6-L21)

本地部分视图。

<details>
<summary>查看原文（16行）</summary>

```text
/** Trae (CN) chat reader (v0.4). One workspaceStorage dir per project; the AI
 * chat lives in state.vscdb under key 'memento/icube-ai-agent-storage' as
 * {list: [{sessionId, title, createdAt, updatedAt, messages: [{role, content,
 * modelInfo: {display_model_name}}], hasMore}]} — including per-message model
 * names. Chat bodies may be server-paginated (hasMore + nextPageToken): local
 * data is a partial view and the reader reports it as such. Read-only. */

export interface TraeChatSession {
  sessionId: string;
  title: string;
  workspaceFolder?: string | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
  localMessages: number;
  hasMore: boolean;
  models: string[]; // per-message display model names, in order
```

</details>

**依据 6 · 源码核查**：[test/usage.test.ts:27-36](https://github.com/121212165/dsh-plugin-ide-hub/blob/814621be897a27752550b0be6f7be2bc44ccb897/test/usage.test.ts#L27-L36)

人为设定计数样例。

<details>
<summary>查看原文（10行）</summary>

```text
test('codex token_count event parses with reasoning folded into output', () => {
  const record = codexRecord({
    timestamp: '2026-09-30T08:00:00.000Z',
    type: 'event_msg',
    payload: { type: 'token_count', info: { total_token_usage: { input_tokens: 1000, cached_input_tokens: 800, output_tokens: 40, reasoning_output_tokens: 60 } }, session_id: '01a' },
  });
  assert.ok(record);
  assert.equal(record!.outputTokens, 100); // 40 + 60 reasoning
  assert.equal(record!.cacheReadTokens, 800);
});
```

</details>

#### 缺口

- 对应版本转录中cache/reasoning是否包含在input/output及session ID字段的真实契约
  **影响**：重复计量或unknown去重会影响用量和会话排序
  **进一步探讨**：用版本化真实样例与原工具账目做字段对账，不把fixture自洽当准确度

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 规则写入与导出是否安全且幂等？

**研究主题**：缺陷与关键质疑

#### 完整回答

hub-init保留已有规则本体/PROJECT_NOTES，只给各规则文件合并标记指针；remove摘指针并保留修改模板，减少覆盖个人正文，提供dry-run有实用价值。但STRUCTURE.json安装每次重写、remove无条件删除，不保留用户改稿。scanTree注释称不跟symlink，实际readdir丢掉Dirent类型再statSync，会跟目录链接向外遍历，虽深度2/300条限制规模，不能声称结构读取从不出root。目标.hub/规则路径也未做物理root/link核对，项目内预置链接可能让读取/写入落外部，未复现利用。

Obsidian导出读完整规则正文，包含本地路径，需审查秘密与同步范围；按固定目标名覆写，无逐笔确认/独立备份，多个工具同basename规则可能冲突。updated每次用当前时间拼frontmatter，writeNotes逐字比较，因此重复命令即使业务内容没变也通常重写，不符合“未变化跳过”的用户理解。多文件批处理没有事务，失败可能只写部分。atomic kit实现未在本仓库，不能只从函数名保证其耐崩溃/路径约束。

#### 证据与依据

**依据 1 · 源码核查**：[src/plugin.ts:113-151](https://github.com/121212165/dsh-plugin-ide-hub/blob/814621be897a27752550b0be6f7be2bc44ccb897/src/plugin.ts#L113-L151)

stat跟链接与规模界限。

<details>
<summary>查看原文（39行）</summary>

```text
/** Shallow, bounded, hidden-free: enough for an agent to know where things live,
 * cheap enough to regenerate every time, and it never follows a symlink tree. */
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
  return { entries, truncated };
```

</details>

**依据 2 · 源码核查**：[src/plugin.ts:231-274](https://github.com/121212165/dsh-plugin-ide-hub/blob/814621be897a27752550b0be6f7be2bc44ccb897/src/plugin.ts#L231-L274)

卸载策略和STRUCTURE删除。

<details>
<summary>查看原文（44行）</summary>

```text
  if (options.remove) {
    for (const target of targets) {
      const file = join(root, target.path);
      const existing = readIf(file);
      if (existing === null) continue;
      const { content, deleteFile } = unmergePointer(existing);
      if (content === existing) {
        changes.push({ file: target.path, outcome: 'unchanged', detail: '没有本插件的指针段' });
        continue;
      }
      if (options.dryRun) {
        changes.push({ file: target.path, outcome: deleteFile ? 'removed' : 'updated', detail: deleteFile ? '将删除（除指针段外没有内容）' : '将只摘掉指针段' });
        continue;
      }
      if (deleteFile) {
        rmSync(file, { force: true });
        pruneEmptyDirs(file, root);
        changes.push({ file: target.path, outcome: 'removed', detail: '除指针段外没有内容，已删除' });
      } else {
        writeFileAtomic(file, content);
        changes.push({ file: target.path, outcome: 'updated', detail: '已摘掉指针段，其余内容原样保留' });
      }
    }
    const structure = join(root, '.hub', 'STRUCTURE.json');
    if (readIf(structure) !== null) {
      if (!options.dryRun) rmSync(structure, { force: true });
      changes.push({ file: '.hub/STRUCTURE.json', outcome: 'removed', detail: '生成物，直接删' });
    }
    for (const [file, template] of [
      [join(root, HUB_BODY), renderHubAgents(project)],
      [join(root, '.hub', 'PROJECT_NOTES.md'), renderProjectNotes(project)],
    ] as const) {
      const existing = readIf(file);
      const path = rel(file);
      if (existing === null) continue;
      if (existing === template) {
        if (!options.dryRun) rmSync(file, { force: true });
        changes.push({ file: path, outcome: 'removed', detail: '仍是未改动的模板，已删除' });
      } else {
        changes.push({ file: path, outcome: 'kept', detail: '里面有你自己写的内容，没删——确认后手工删除' });
      }
    }
    const hubDir = join(root, '.hub');
    if (!options.dryRun && existsSync(hubDir) && readdirSync(hubDir).length === 0) rmSync(hubDir, { recursive: true, force: true });
```

</details>

**依据 3 · 源码核查**：[src/plugin.ts:285-312](https://github.com/121212165/dsh-plugin-ide-hub/blob/814621be897a27752550b0be6f7be2bc44ccb897/src/plugin.ts#L285-L312)

保留正文与合并指针。

<details>
<summary>查看原文（28行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[src/plugin.ts:395-409](https://github.com/121212165/dsh-plugin-ide-hub/blob/814621be897a27752550b0be6f7be2bc44ccb897/src/plugin.ts#L395-L409)

每次updated与导出。

<details>
<summary>查看原文（15行）</summary>

```text
    name: 'hub-export',
    description: '把盘点/迁移计划/规则快照导出到 Obsidian 的 IDE-Hub/ 子树',
    handler: () => {
      if (!config.vaultDir) return { kind: 'error', text: '未配置 ide-hub.vaultDir。' };
      const vaultDir = expandPath(config.vaultDir);
      const updated = new Date().toISOString();
      const inventories = registry.map(inventory);
      const rules: RuleFileInfo[] = discoverRules(registry);
      const notes = [
        renderInventoryNote(renderInventory(inventories).split('\n'), updated),
        renderMigrationNote(renderPlan(planMigration(config.quotas as QuotaState[])).split('\n'), updated),
        ...renderRulesNotes(rules, updated),
      ];
      const result = writeNotes(vaultDir, notes);
      return { kind: 'success', text: `导出完成：${result.written.length} 写入 / ${result.skipped} 未变。\n${result.written.map((file) => `  ${file}`).join('\n')}` };
```

</details>

**依据 5 · 源码核查**：[src/hub/obsidian.ts:40-93](https://github.com/121212165/dsh-plugin-ide-hub/blob/814621be897a27752550b0be6f7be2bc44ccb897/src/hub/obsidian.ts#L40-L93)

正文读取和逐字覆盖。

<details>
<summary>查看原文（54行）</summary>

```text
function frontmatter(title: string, tags: string[], updated: string): string {
  return ['---', `title: "${title.replace(/"/g, '\\"')}"`, `updated: ${updated}`, 'tags:', ...tags.map((tag) => `  - ${tag}`), '---'].join('\n');
}

export function renderInventoryNote(lines: string[], updated: string): ObsidianNote {
  const content = `${frontmatter('IDE 会话清单', ['ide-hub', 'inventory'], updated)}\n\n# IDE 会话清单\n\n${lines.join('\n')}\n`;
  return { path: 'IDE-Hub/会话清单.md', content };
}

export function renderMigrationNote(lines: string[], updated: string): ObsidianNote {
  const content = `${frontmatter('额度迁移计划', ['ide-hub', 'quota'], updated)}\n\n# 额度迁移计划\n\n${lines.join('\n')}\n`;
  return { path: 'IDE-Hub/额度迁移计划.md', content };
}

export function renderRulesNotes(rules: RuleFileInfo[], updated: string): ObsidianNote[] {
  const index = `${frontmatter('提示词规则索引', ['ide-hub', 'prompts'], updated)}\n\n# 提示词规则索引\n\n${rules
    .map((rule) => `- [${rule.tool}] ${rule.path}（${rule.bytes} 字节，改于 ${rule.mtime.slice(0, 10)}）`)
    .join('\n')}\n`;
  const notes: ObsidianNote[] = [{ path: 'IDE-Hub/prompts/索引.md', content: index }];
  // A tool can register several rule files (e.g. claude-code's CLAUDE.md +
  // AGENTS.md); suffix the filename so they don't overwrite each other.
  const perTool = new Map<string, number>();
  for (const rule of rules) perTool.set(rule.tool, (perTool.get(rule.tool) ?? 0) + 1);
  for (const rule of rules) {
    let body = '';
    try {
      body = readFileSync(rule.path, 'utf8');
    } catch {
      body = '（读取失败）';
    }
    const stem = basename(rule.path).replace(/\.[^.]+$/, '');
    const name = (perTool.get(rule.tool) ?? 0) > 1 ? `${rule.tool}-${stem}` : rule.tool;
    notes.push({
      path: `IDE-Hub/prompts/${name}.md`,
      content: `${frontmatter(`${name} 规则快照`, ['ide-hub', 'prompts', rule.tool], updated)}\n\n# ${name} 规则快照\n\n来源: ${rule.path}\n\n${body}\n`,
    });
  }
  return notes;
}

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

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 工程证据和使用成本支持哪些结论？

**研究主题**：工程质量与复用、效果与总成本

#### 完整回答

模块将registry、读盘、纯解析、排序与渲染分开，usage/migrate/today/pointers/hub-init等测试可读，坏输入和缺失源降级思想可借鉴；本次检查fixture与关键测试片段，没有运行，也未穷尽所有DB适配器。usage fixture把reasoning相加写成预期，不能验证外部字段包含关系；稳定输出与业务计量正确是两类证据。

首次要对齐构建依赖/宿主、默认数据根、各IDE版本和规则备份；持续插件本身不调模型或厂商API，但同步读整份JSONL/递归遍历无文件总量或字节上限，Codex还用stat遍历链接且无visited，超大历史/链接环会阻塞命令线程。today各镜像文件契约和SQL表会随兄弟插件/IDE变动，需维护；导出复制规则与路径到vault扩大本地数据驻留。恢复要分辨未找到、解析损失、旧格式、部分写入和指针回滚，节省切换时间与额度规划收益没有同任务量化。

#### 证据与依据

**依据 1 · 源码核查**：[src/hub/usage.ts:8-94](https://github.com/121212165/dsh-plugin-ide-hub/blob/814621be897a27752550b0be6f7be2bc44ccb897/src/hub/usage.ts#L8-L94)

同步全文件/遍历。

<details>
<summary>查看原文（87行）</summary>

```text
/** Scanners: walk the on-disk roots for each supported tool and emit uniform
 * records. Scanning is read-only and bounded (recent files only when the root
 * is huge is a future knob). */

function readLines(path: string): string[] {
  try {
    return readFileSync(path, 'utf8').split(/\r?\n/).filter((line) => line.trim());
  } catch {
    return [];
  }
}

export function scanClaudeCode(claudeRoot?: string): UsageRecord[] {
  const root = claudeRoot ?? join(homedir(), '.claude', 'projects');
  const records: UsageRecord[] = [];
  if (!existsSync(root)) return records;
  for (const projectDir of readdirSync(root)) {
    const projectPath = join(root, projectDir);
    let files: string[] = [];
    try {
      if (!statSync(projectPath).isDirectory()) continue;
      files = readdirSync(projectPath).filter((name) => name.endsWith('.jsonl'));
    } catch {
      continue;
    }
    for (const file of files) {
      for (const line of readLines(join(projectPath, file))) {
        try {
          const record = claudeRecord(JSON.parse(line));
          if (record) records.push(record);
        } catch {
          // malformed line: skip
        }
      }
    }
  }
  return records;
}

export function scanCodex(codexRoot?: string): UsageRecord[] {
  const root = codexRoot ?? join(homedir(), '.codex', 'sessions');
  const records: UsageRecord[] = [];
  if (!existsSync(root)) return records;
  const stack = [root];
  while (stack.length) {
    const current = stack.pop()!;
    let entries: string[];
    try {
      entries = readdirSync(current);
    } catch {
      continue;
    }
    for (const name of entries) {
      const full = join(current, name);
      try {
        if (statSync(full).isDirectory()) {
          stack.push(full);
          continue;
        }
      } catch {
        continue;
      }
      if (!name.endsWith('.jsonl')) continue;
      let cwd: string | undefined;
      let sessionId: string | undefined;
      // token_count totals are cumulative within a session: keep only the LAST
      // event, otherwise summing every event multiplies the real spend
      let last: UsageRecord | null = null;
      for (const line of readLines(full)) {
        try {
          const parsed = JSON.parse(line) as import('./usage-reader.ts').CodexLine;
          if (parsed.type === 'session_meta' && parsed.payload) {
            cwd = parsed.payload.cwd;
            sessionId = parsed.payload.session_id;
          }
          const record = codexRecord(parsed);
          if (record) {
            last = { ...record, cwd, sessionId: record.sessionId === 'unknown' ? (sessionId ?? 'unknown') : record.sessionId };
          }
        } catch {
          // malformed line: skip
        }
      }
      if (last) records.push(last);
    }
  }
  return records;
```

</details>

**依据 2 · 源码核查**：[test/usage.test.ts:7-67](https://github.com/121212165/dsh-plugin-ide-hub/blob/814621be897a27752550b0be6f7be2bc44ccb897/test/usage.test.ts#L7-L67)

fixture和恢复命令测试。

<details>
<summary>查看原文（61行）</summary>

```text
test('claude assistant line with usage parses into a record', () => {
  const record = claudeRecord({
    type: 'assistant',
    sessionId: 'abc-123',
    timestamp: '2026-09-30T08:00:00.000Z',
    cwd: 'C:/proj',
    message: { model: 'claude-5', usage: { input_tokens: 100, output_tokens: 50, cache_read_input_tokens: 9000, cache_creation_input_tokens: 200 } },
  });
  assert.ok(record);
  assert.equal(record!.tool, 'claude-code');
  assert.equal(record!.day, '2026-09-30');
  assert.equal(record!.inputTokens, 100);
  assert.equal(record!.cacheReadTokens, 9000);
});

test('claude user lines and zero-usage synthetic lines are skipped', () => {
  assert.equal(claudeRecord({ type: 'user', sessionId: 's', timestamp: 'x' }), null);
  assert.equal(claudeRecord({ type: 'assistant', sessionId: 's', timestamp: 'x', message: { usage: { input_tokens: 0, output_tokens: 0 } } }), null);
});

test('codex token_count event parses with reasoning folded into output', () => {
  const record = codexRecord({
    timestamp: '2026-09-30T08:00:00.000Z',
    type: 'event_msg',
    payload: { type: 'token_count', info: { total_token_usage: { input_tokens: 1000, cached_input_tokens: 800, output_tokens: 40, reasoning_output_tokens: 60 } }, session_id: '01a' },
  });
  assert.ok(record);
  assert.equal(record!.outputTokens, 100); // 40 + 60 reasoning
  assert.equal(record!.cacheReadTokens, 800);
});

test('codex non-token events are skipped', () => {
  assert.equal(codexRecord({ type: 'event_msg', payload: { type: 'agent_reasoning' } }), null);
  assert.equal(codexRecord({ type: 'response_item' }), null);
});

test('aggregate groups per tool with days and models', () => {
  const record = (over: Partial<UsageRecord>): UsageRecord =>
    ({ tool: 'claude-code', sessionId: 's', at: '2026-09-30T08:00:00.000Z', day: '2026-09-30', inputTokens: 100, outputTokens: 50, cacheReadTokens: 0, cacheWriteTokens: 0, model: 'claude-5', cwd: 'C:/proj', ...over }) as UsageRecord;
  const result = aggregate([
    record({}),
    record({ sessionId: 's2', model: 'claude-5' }),
    record({ day: '2026-09-29', at: '2026-09-29T08:00:00.000Z', tool: 'codex', model: undefined, cwd: 'C:/other' }),
  ]);
  assert.equal(result.length, 2);
  const claude = result.find((tool) => tool.tool === 'claude-code')!;
  assert.equal(claude.totalTokens, 300);
  assert.equal(claude.days, 1);
  assert.equal(claude.projects, 1);
  const codex = result.find((tool) => tool.tool === 'codex')!;
  assert.equal(codex.days, 1);
});

test('recentSessions dedupes per session and maps resume commands', () => {
  const record = (over: Partial<UsageRecord>): UsageRecord =>
    ({ tool: 'claude-code', sessionId: 'abc', at: '2026-09-30T08:00:00.000Z', day: '2026-09-30', inputTokens: 1, outputTokens: 1, cacheReadTokens: 0, cacheWriteTokens: 0, ...over }) as UsageRecord;
  const sessions = recentSessions([record({}), record({ at: '2026-09-30T09:00:00.000Z' }), record({ tool: 'codex', sessionId: '01a', at: '2026-09-30T10:00:00.000Z' })], 10);
  assert.equal(sessions.length, 2);
  assert.equal(sessions[0]!.resumeCommand, 'codex resume 01a');
  assert.equal(sessions[1]!.resumeCommand, 'claude --resume abc');
  assert.equal(resumeCommand('catpaw', 'x'), null);
```

</details>

**依据 3 · 源码核查**：[src/hub/today.ts:1-11](https://github.com/121212165/dsh-plugin-ide-hub/blob/814621be897a27752550b0be6f7be2bc44ccb897/src/hub/today.ts#L1-L11)

镜像契约。

<details>
<summary>查看原文（11行）</summary>

```text
/** The `/today` aggregation: one ranked answer to "现在该做什么".
 *
 * Four plugins each hold a piece of the day — quota (预算与下步预估), cost-ledger
 * (这个月已经烧掉多少), task-forge (哪些交接卡在谁那里), tool-trace (工具面能不能干活).
 * None of them is ordered against the others, which is exactly the "没有内在顺序"
 * complaint. This module is the rule table that imposes one: pure functions over a
 * `TodaySignals` snapshot, so the ordering is testable without any disk or host.
 *
 * Every reader is a *mirror* of another plugin's on-disk contract (they are separate
 * packages and cannot import each other). Tolerance is the contract: a missing or
 * malformed file yields null for that block and the rules simply have less to say.
```

</details>

**依据 4 · 源码核查**：[src/hub/obsidian.ts:80-93](https://github.com/121212165/dsh-plugin-ide-hub/blob/814621be897a27752550b0be6f7be2bc44ccb897/src/hub/obsidian.ts#L80-L93)

逐文件写入。

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

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 推荐条件与进一步探讨方向是什么？

**研究主题**：新假设与验证、采用判断

#### 完整回答

先观察，主要是独立构建运行依赖未闭合、用量字段计量风险及root链接/批写边界。可信本地用户可先只读盘点并把数量当证据近似；规则写入先dry-run、人工审阅及Git备份，vault限制个人可信同步。不要用总token作为结算、根据手填runway自动迁移工作负载，也不要直接复制未知会话来源的恢复命令。写入或计量发生差异时回原工具和备份核对，不从成功字样推完整迁移。

继续研究每适配器的版本化字段契约、累计计数差分和未知/坏行损失回执，执行扫描预算与lstat/visited/物理root校验；导出按业务内容hash去掉时间噪声，批写带清单/回滚及外部编辑检测。基线为当前累计末条、同步扫描和逐字覆写，反例包括跨日累计、cache/reasoning子集、不同session-meta格式、符号链接环/外链、规则同basename和相同内容二次导出。比较对账误差、漏会话、扫描峰值、越界读写与恢复工时；方向尚未验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/hub/usage.ts:47-94](https://github.com/121212165/dsh-plugin-ide-hub/blob/814621be897a27752550b0be6f7be2bc44ccb897/src/hub/usage.ts#L47-L94)

计数/遍历基线。

<details>
<summary>查看原文（48行）</summary>

```text
export function scanCodex(codexRoot?: string): UsageRecord[] {
  const root = codexRoot ?? join(homedir(), '.codex', 'sessions');
  const records: UsageRecord[] = [];
  if (!existsSync(root)) return records;
  const stack = [root];
  while (stack.length) {
    const current = stack.pop()!;
    let entries: string[];
    try {
      entries = readdirSync(current);
    } catch {
      continue;
    }
    for (const name of entries) {
      const full = join(current, name);
      try {
        if (statSync(full).isDirectory()) {
          stack.push(full);
          continue;
        }
      } catch {
        continue;
      }
      if (!name.endsWith('.jsonl')) continue;
      let cwd: string | undefined;
      let sessionId: string | undefined;
      // token_count totals are cumulative within a session: keep only the LAST
      // event, otherwise summing every event multiplies the real spend
      let last: UsageRecord | null = null;
      for (const line of readLines(full)) {
        try {
          const parsed = JSON.parse(line) as import('./usage-reader.ts').CodexLine;
          if (parsed.type === 'session_meta' && parsed.payload) {
            cwd = parsed.payload.cwd;
            sessionId = parsed.payload.session_id;
          }
          const record = codexRecord(parsed);
          if (record) {
            last = { ...record, cwd, sessionId: record.sessionId === 'unknown' ? (sessionId ?? 'unknown') : record.sessionId };
          }
        } catch {
          // malformed line: skip
        }
      }
      if (last) records.push(last);
    }
  }
  return records;
```

</details>

**依据 2 · 源码核查**：[src/plugin.ts:113-151](https://github.com/121212165/dsh-plugin-ide-hub/blob/814621be897a27752550b0be6f7be2bc44ccb897/src/plugin.ts#L113-L151)

结构扫描基线。

<details>
<summary>查看原文（39行）</summary>

```text
/** Shallow, bounded, hidden-free: enough for an agent to know where things live,
 * cheap enough to regenerate every time, and it never follows a symlink tree. */
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
  return { entries, truncated };
```

</details>

**依据 3 · 源码核查**：[src/hub/obsidian.ts:40-93](https://github.com/121212165/dsh-plugin-ide-hub/blob/814621be897a27752550b0be6f7be2bc44ccb897/src/hub/obsidian.ts#L40-L93)

时间与覆写基线。

<details>
<summary>查看原文（54行）</summary>

```text
function frontmatter(title: string, tags: string[], updated: string): string {
  return ['---', `title: "${title.replace(/"/g, '\\"')}"`, `updated: ${updated}`, 'tags:', ...tags.map((tag) => `  - ${tag}`), '---'].join('\n');
}

export function renderInventoryNote(lines: string[], updated: string): ObsidianNote {
  const content = `${frontmatter('IDE 会话清单', ['ide-hub', 'inventory'], updated)}\n\n# IDE 会话清单\n\n${lines.join('\n')}\n`;
  return { path: 'IDE-Hub/会话清单.md', content };
}

export function renderMigrationNote(lines: string[], updated: string): ObsidianNote {
  const content = `${frontmatter('额度迁移计划', ['ide-hub', 'quota'], updated)}\n\n# 额度迁移计划\n\n${lines.join('\n')}\n`;
  return { path: 'IDE-Hub/额度迁移计划.md', content };
}

export function renderRulesNotes(rules: RuleFileInfo[], updated: string): ObsidianNote[] {
  const index = `${frontmatter('提示词规则索引', ['ide-hub', 'prompts'], updated)}\n\n# 提示词规则索引\n\n${rules
    .map((rule) => `- [${rule.tool}] ${rule.path}（${rule.bytes} 字节，改于 ${rule.mtime.slice(0, 10)}）`)
    .join('\n')}\n`;
  const notes: ObsidianNote[] = [{ path: 'IDE-Hub/prompts/索引.md', content: index }];
  // A tool can register several rule files (e.g. claude-code's CLAUDE.md +
  // AGENTS.md); suffix the filename so they don't overwrite each other.
  const perTool = new Map<string, number>();
  for (const rule of rules) perTool.set(rule.tool, (perTool.get(rule.tool) ?? 0) + 1);
  for (const rule of rules) {
    let body = '';
    try {
      body = readFileSync(rule.path, 'utf8');
    } catch {
      body = '（读取失败）';
    }
    const stem = basename(rule.path).replace(/\.[^.]+$/, '');
    const name = (perTool.get(rule.tool) ?? 0) > 1 ? `${rule.tool}-${stem}` : rule.tool;
    notes.push({
      path: `IDE-Hub/prompts/${name}.md`,
      content: `${frontmatter(`${name} 规则快照`, ['ide-hub', 'prompts', rule.tool], updated)}\n\n# ${name} 规则快照\n\n来源: ${rule.path}\n\n${body}\n`,
    });
  }
  return notes;
}

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

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
