# dsh-plugin-ide-hub

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[a1fd8af](https://github.com/121212165/dsh-plugin-ide-hub/tree/a1fd8af301675b41e9115e22f837d9f466c2d351)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/121212165/dsh-plugin-ide-hub) [![npm 30d 554](https://img.shields.io/static/v1?label=npm+30d&message=554&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-ide-hub) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-ide-hub)
<!-- END META -->

> **功能**：在 DSH 汇总本地编码工具的会话、用量和项目规则。

> **亮点**：[Q01](#research-q01) 集中本地盘点，[Q02](#research-q02) 提供恢复命令与规则初始化。

> **主要限制**：[Q03](#research-q03) 移除直接删除 STRUCTURE.json，标记外空白也可能规范；扫描失败可被跳过。

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
  - [Q01 · IDE Hub 相对手动检查各工具解决什么？](#detail-section-11)
  - [Q02 · 盘点、会话恢复和规则初始化如何工作？](#detail-section-12)
  - [Q03 · 规则写入和移除如何保护或删除用户数据？](#detail-section-13)
  - [Q04 · 隐私、依赖及安全采用是什么？](#detail-section-14)
  - [Q05 · 如何让用户决定是否信任扫描及规则变更？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在多个编码工具间查看会话并维护项目规则。

用户手工查看各 IDE 目录并维护规则文件。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 盘点 | 汇总本地工具数据 | 目录读取失败可能跳过 |
| 恢复命令 | 提示支持工具的 CLI | 不等于执行成功 |
| 规则初始化 | 写入主体与指针 | 先 dry-run 与备份 |

| 依赖或条件 | 是否必需 | 用途 | 不满足时 |
|---|---|---|---|
| DSH 与命令服务 | 必需 | 注册命令 | 无法使用 |
| 可读 IDE 数据目录 | 盘点需要 | 会话与用量 | 跳过或不完整 |
| @dsh-family/kit | 包依赖 | 写入辅助 | 无法加载 |
| 项目备份 | 写入前重要 | 保障恢复 | 误删难恢复 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 备份复制项目并核数据授权 | 不明则停止 |
| 盘点 | 用户查看命令输出 | 对照原始 IDE 数据 |
| 预览 | 对副本运行 dry-run | 核规则与路径 |
| 修改 | 确认后人工核差异 | 异常停止并从备份恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 准备 | 备份存储未知 | 授权和路径核查 | 可能含敏感会话 |
| 盘点 | 本地扫描成本未知 | 核遗漏与恢复命令 | 部分读取失败被跳过 |
| 维护 | 规则文件存储未知 | 人工复核与恢复 | 多文件事务未证 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 盘点 | 本地有限扫描 | 全部会话完整 |
| 恢复 | 生成部分 CLI 命令 | 自动恢复成功 |
| 规则 | 管理标记及正文模板 | 故障回滚无损 |

> **思考**：[Q03](#research-q03) 移除直接删除 STRUCTURE.json，标记外空白也可能规范；扫描失败可被跳过。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 集中本地盘点，[Q02](#research-q02) 提供恢复命令与规则初始化。

[Q03](#research-q03) 移除时直接删 STRUCTURE.json，标记处理会规范部分空白。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 移除直接删除 STRUCTURE.json，标记外空白也可能规范；扫描失败可被跳过。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 对复制项目先备份、dry-run 并核差异；不完整或删除风险不明时停止。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查盘点、恢复命令及规则写入删除代表路径；未运行目标或外部依赖。

- 已检查：作者 README、包清单、源码路径 README.md、src/plugin.ts、src/hub/inventory.ts、src/hub/usage-reader.ts、package.json、src/hub/pointers.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定 README、命令入口、盘点、恢复映射和规则指针；未运行宿主、IDE 或外部 kit。
- 下一步：[Q05](#research-q05) 核现有输出后做权限、截断和中途失败对照。

**分析版本**

- **仓库**：[121212165/dsh-plugin-ide-hub](https://github.com/121212165/dsh-plugin-ide-hub)
- **版本号**：0.7.0（[固定提交 a1fd8af](https://github.com/121212165/dsh-plugin-ide-hub/tree/a1fd8af301675b41e9115e22f837d9f466c2d351)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设结合覆盖、删除与备份的计划可减少误判；未验证。

[Q05](#research-q05) 核现有输出后做权限、截断和中途失败对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 13 | 1870 | 1747 | 127 | — |
| .md | source | 1 | 136 | — | — | 2890 |
| .ts | source | 13 | 2285 | 1953 | 174 | — |
| .ts | test | 10 | 1400 | 1216 | 53 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/121212165/dsh-plugin-ide-hub/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/121212165/dsh-plugin-ide-hub/issues?q=is%3Aissue+created%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/121212165/dsh-plugin-ide-hub/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 IDE 盘点、恢复命令及规则写入删除边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · IDE Hub 相对手动检查各工具解决什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

README:17-19 描述从本地多个编码工具读取会话、用量和规则，集中在 DSH 命令中。相对手工查各目录，其增量是汇总入口和规则指针；工具本身记录、模型或官方同步不是该插件贡献。作者明确 Trae 聊天读取尚未接入会话命令；未测跨工具覆盖、时间节省及实际用户需求。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:17-19](https://github.com/121212165/dsh-plugin-ide-hub/blob/a1fd8af301675b41e9115e22f837d9f466c2d351/README.md#L17-L19)

作者描述用途及 Trae 限制。

```text
**EN** · One hub over the coding IDEs you actually run — dsh, Claude Code, Codex, ZCode, Qoder, CatPaw, Trae, OpenCode. It reads each tool's own on-disk state (sessions, usage, prompt-rule files) instead of calling any API, then gives you an inventory (`/ide-hub`), a quota-runway migration plan (`/hub-migrate`), usage breakdowns (`/hub-usage`), resumable sessions (`/hub-sessions`), a ranked "what should I do first" over the sibling plugins (`/today`) and an Obsidian export (`/hub-export`) — and, since `/hub-init`, writes back exactly one thing: a `.hub/` rule body plus a marker-delimited pointer in each tool's project rule file. · 45 `node --test` green · reads real local data on this machine · v0.4's Trae chat reader is **not yet wired into `/hub-sessions`** — see 已知边界.

DeepSeek Harness (dsh) 插件：跨 IDE 统一管理器。各家编码 IDE 都把会话、用量、提示词规则写在自己的磁盘目录里，本插件直接读这些文件（不调任何厂商 API），在 dsh 里出六个命令。读之外只有一处写：`/hub-init` 往**你自己指定的项目目录**里装 `.hub/` 规则本体与各 IDE 的指针段。
```

**依据 2 · 源码核查**：[src/plugin.ts:340-349](https://github.com/121212165/dsh-plugin-ide-hub/blob/a1fd8af301675b41e9115e22f837d9f466c2d351/src/plugin.ts#L340-L349)

注册盘点命令。

<details>
<summary>查看原文（10行）</summary>

```text
  ctx.commands.register({
    name: 'ide-hub',
    description: '跨 IDE 数据盘点：Trae/Qoder/ZCode/CatPaw/Codex/Claude Code/OpenCode/dsh 的会话与规则文件',
    handler: () => {
      const inventories = registry.map(inventory);
      const rules: RuleFileInfo[] = discoverRules(registry);
      const lines = [renderInventory(inventories), '', `提示词规则文件 ${rules.length} 份:`, ...rules.map((rule) => `  [${rule.tool}] ${rule.path}`)];
      return { kind: 'success', text: lines.join('\n') };
    },
  });
```

</details>

**依据 3 · 源码核查**：[src/hub/inventory.ts:94-105](https://github.com/121212165/dsh-plugin-ide-hub/blob/a1fd8af301675b41e9115e22f837d9f466c2d351/src/hub/inventory.ts#L94-L105)

遍历各配置根目录。

<details>
<summary>查看原文（12行）</summary>

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
```

</details>

#### 缺口

- 未测真实工具或覆盖率
  **影响**：不能保证所有会话完整
  **进一步探讨**：对照各工具原始数据进行盘点。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 盘点、会话恢复和规则初始化如何工作？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

plugin.ts:340-349 注册 /ide-hub 并调用 registry.map(inventory)；inventory.ts:31-37、94-105 限深扫描，读目录失败直接返回，不能将计数作为完整事实。usage-reader.ts:117-132 对支持的工具生成恢复命令字符串，不等于自动执行或成功恢复。plugin.ts:351-382 注册 /hub-init 并解析目录及 dry-run，实际规则文件写入由 runHubInit 路径负责；@dsh-family/kit 的写入实现不在本仓库，不能自行断言其底层原子性。

#### 证据与依据

**依据 1 · 源码核查**：[src/plugin.ts:340-382](https://github.com/121212165/dsh-plugin-ide-hub/blob/a1fd8af301675b41e9115e22f837d9f466c2d351/src/plugin.ts#L340-L382)

注册盘点和初始化命令。

<details>
<summary>查看原文（43行）</summary>

```text
  ctx.commands.register({
    name: 'ide-hub',
    description: '跨 IDE 数据盘点：Trae/Qoder/ZCode/CatPaw/Codex/Claude Code/OpenCode/dsh 的会话与规则文件',
    handler: () => {
      const inventories = registry.map(inventory);
      const rules: RuleFileInfo[] = discoverRules(registry);
      const lines = [renderInventory(inventories), '', `提示词规则文件 ${rules.length} 份:`, ...rules.map((rule) => `  [${rule.tool}] ${rule.path}`)];
      return { kind: 'success', text: lines.join('\n') };
    },
  });

  ctx.commands.register({
    name: 'hub-init',
    description: '给项目装 .hub/ 规则本体并给各 IDE 的项目级规则文件挂指针：/hub-init [目录] [--dry-run] [--only codex,claude-code] [--remove]',
    input: { hint: '[目录] [--dry-run] [--only 工具,…] [--remove]' },
    handler: ({ rawInput }) => {
      const raw = String(rawInput ?? '').trim();
      const remove = /(^|\s)--remove(\s|$)/.test(raw);
      const dryRun = /(^|\s)--dry-run(\s|$)/.test(raw);
      const onlyMatch = /(?:^|\s)--only[\s=]+(\S+)/.exec(raw);
      const known = POINTER_SPECS.map((spec) => spec.tool);
      const only = onlyMatch?.[1] ? onlyMatch[1].split(',').map((tool) => tool.trim().toLowerCase()).filter(Boolean) : undefined;
      if (only) {
        const unknown = only.filter((tool) => !known.includes(tool));
        if (unknown.length) return { kind: 'error', text: `不认识的工具：${unknown.join(', ')}。可选：${known.join(' / ')}。` };
      }
      const withoutFlags = raw.replace(/--remove|--dry-run/g, '').replace(/--only[\s=]+\S+/g, '').trim();
      const dirArg = withoutFlags.split(/\s+/)[0] ?? '';
      const root = resolve(expandPath(dirArg || process.cwd()));
      if (!existsSync(root) || !statSync(root).isDirectory()) {
        return { kind: 'error', text: `目录不存在或不是目录：${root}。用法：/hub-init [项目目录]，不给目录就用当前工作目录。` };
      }
      const result = runHubInit(root, { remove, dryRun, only });
      const lines = [`${dryRun ? '[dry-run] ' : ''}${remove ? '卸载' : '安装'} ${result.project} · ${root}`];
      for (const change of result.changes) lines.push(`  ${OUTCOME_MARK[change.outcome]} ${change.file} — ${change.detail}`);
      if (!result.changes.length) lines.push('  （没有任何本插件写过的东西）');
      if (!remove && result.manual.length) {
        lines.push('', '这几家的项目级规则路径本机未核实，指针没有替你写（写错文件比不写更糟）：', ...result.manual.map((item) => `  · ${item.tool}：${item.note}`));
      }
      if (result.truncated) lines.push('', '⚠ 结构快照到达条目上限被截断。');
      if (!remove) lines.push('', `下一步：填 ${HUB_BODY}（目标/命令/约定/禁忌），跨窗口无损交接用 task-forge 的 /forge --to ide:<工具名>。`);
      return { kind: 'success', text: lines.join('\n') };
    },
```

</details>

**依据 2 · 源码核查**：[src/hub/inventory.ts:31-37](https://github.com/121212165/dsh-plugin-ide-hub/blob/a1fd8af301675b41e9115e22f837d9f466c2d351/src/hub/inventory.ts#L31-L37)

扫描深度和读目录失败。

```text
function walk(root: string, spec: IdeSpec, depth: number, state: WalkStat): void {
  if (depth > 4 || !existsSync(root)) return;
  let entries: string[];
  try {
    entries = readdirSync(root);
  } catch {
    return;
```

**依据 3 · 源码核查**：[src/hub/inventory.ts:94-105](https://github.com/121212165/dsh-plugin-ide-hub/blob/a1fd8af301675b41e9115e22f837d9f466c2d351/src/hub/inventory.ts#L94-L105)

按数据根盘点。

<details>
<summary>查看原文（12行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[src/hub/usage-reader.ts:117-132](https://github.com/121212165/dsh-plugin-ide-hub/blob/a1fd8af301675b41e9115e22f837d9f466c2d351/src/hub/usage-reader.ts#L117-L132)

按工具构造恢复命令。

<details>
<summary>查看原文（16行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[package.json:83-85](https://github.com/121212165/dsh-plugin-ide-hub/blob/a1fd8af301675b41e9115e22f837d9f466c2d351/package.json#L83-L85)

固定 kit 依赖。

```text
  "dependencies": {
    "@dsh-family/kit": "github:121212165/dsh-plugin-kit#v0.2.1"
  }
```

#### 缺口

- 未运行命令或外部 kit
  **影响**：无法证明会话恢复和写入效果
  **进一步探讨**：隔离项目逐项核输出和文件变更。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 规则写入和移除如何保护或删除用户数据？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

plugin.ts:278-301 中 dry-run 不写，已有 .hub/AGENTS.md 与 PROJECT_NOTES 保留，STRUCTURE.json 按扫描重生成；移除时 254-270 直接删除 STRUCTURE.json，但规则正文和备忘仅在与模板完全相同时删除，否则保留。pointers.ts:61-98 根据标记抽取管理块，删除后会规范部分周围空白，并非字节完全不变。不能仅凭注释声称无残留或跨多文件事务：中途失败和外部 kit 行为未验。

#### 证据与依据

**依据 1 · 源码核查**：[src/plugin.ts:254-270](https://github.com/121212165/dsh-plugin-ide-hub/blob/a1fd8af301675b41e9115e22f837d9f466c2d351/src/plugin.ts#L254-L270)

结构文件直接删除，已编辑模板保留。

<details>
<summary>查看原文（17行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[src/plugin.ts:278-301](https://github.com/121212165/dsh-plugin-ide-hub/blob/a1fd8af301675b41e9115e22f837d9f466c2d351/src/plugin.ts#L278-L301)

dry-run 与现有文件的处理。

<details>
<summary>查看原文（24行）</summary>

```text
  const write = (absolute: string, display: string, content: string, detail: string): InitChange => {
    if (options.dryRun) {
      return { file: display, outcome: readIf(absolute) === null ? 'created' : 'updated', detail: `${detail}（dry-run，未写盘）` };
    }
    return { file: display, outcome: writeIfChanged(absolute, content), detail };
  };

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
```

</details>

**依据 3 · 源码核查**：[src/hub/pointers.ts:61-98](https://github.com/121212165/dsh-plugin-ide-hub/blob/a1fd8af301675b41e9115e22f837d9f466c2d351/src/hub/pointers.ts#L61-L98)

标记块移除、合并和空白处理。

<details>
<summary>查看原文（38行）</summary>

```text
/** Everything outside the managed block, with the blank line the block was
 * separated by taken back too — so an uninstall leaves no trailing scar. */
export function stripPointer(content: string): string {
  const begin = content.indexOf(POINTER_BEGIN);
  const end = content.indexOf(POINTER_END);
  if (begin === -1 || end === -1 || end < begin) return content;
  const head = content.slice(0, begin).replace(/\s+$/, '');
  const tail = content.slice(end + POINTER_END.length).replace(/^\s*\n+/, '');
  if (!head && !tail.trim()) return '';
  if (!head) return tail.trimStart();
  return tail ? `${head}\n\n${tail.replace(/\s+$/, '')}\n` : `${head}\n`;
}

export type MergeAction = 'noop' | 'rewrite' | 'append' | 'create';

export interface MergeResult {
  action: MergeAction;
  content: string;
}

/** Idempotent attach: never duplicate the block, never drop the user's own text.
 * `existing === null` means the file does not exist yet. */
export function mergePointer(existing: string | null, block = pointerBlock()): MergeResult {
  if (existing === null) return { action: 'create', content: `${block}\n` };
  if (hasPointer(existing)) {
    const stripped = stripPointer(existing);
    const body = stripped.trim() === '' ? '' : `${stripped.replace(/\s+$/, '')}\n\n`;
    const content = `${body}${block}\n`;
    return { action: content === existing ? 'noop' : 'rewrite', content };
  }
  if (existing.trim() === '') return { action: 'rewrite', content: `${block}\n` };
  return { action: 'append', content: `${existing.replace(/\s+$/, '')}\n\n${block}\n` };
}

/** Remove our block; a file that had nothing else in it should be deleted. */
export function unmergePointer(existing: string): { content: string; deleteFile: boolean } {
  const left = stripPointer(existing);
  return { content: left, deleteFile: left.trim() === '' };
```

</details>

#### 缺口

- 未测试中途失败或链接目录
  **影响**：不能保证完整回滚和逐字保留
  **进一步探讨**：备份后用隔离项目注入失败及对比文件。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 隐私、依赖及安全采用是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

README:17-19 描述读取本地 IDE 会话和用量；package.json:83-85 依赖单独的 kit。会话数据、项目路径和规则可能敏感，扫描范围受本地权限、深度和文件布局限制；模型之外还需要人工处理规则、迁移及备份，实际耗时未知。先在复制项目运行 dry-run，核根路径、预览与现有规则；若扫描不完整、项目敏感或删除结果不清楚则停止，保留原始备份并人工比对。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:17-19](https://github.com/121212165/dsh-plugin-ide-hub/blob/a1fd8af301675b41e9115e22f837d9f466c2d351/README.md#L17-L19)

作者描述读取数据及规则写入。

```text
**EN** · One hub over the coding IDEs you actually run — dsh, Claude Code, Codex, ZCode, Qoder, CatPaw, Trae, OpenCode. It reads each tool's own on-disk state (sessions, usage, prompt-rule files) instead of calling any API, then gives you an inventory (`/ide-hub`), a quota-runway migration plan (`/hub-migrate`), usage breakdowns (`/hub-usage`), resumable sessions (`/hub-sessions`), a ranked "what should I do first" over the sibling plugins (`/today`) and an Obsidian export (`/hub-export`) — and, since `/hub-init`, writes back exactly one thing: a `.hub/` rule body plus a marker-delimited pointer in each tool's project rule file. · 45 `node --test` green · reads real local data on this machine · v0.4's Trae chat reader is **not yet wired into `/hub-sessions`** — see 已知边界.

DeepSeek Harness (dsh) 插件：跨 IDE 统一管理器。各家编码 IDE 都把会话、用量、提示词规则写在自己的磁盘目录里，本插件直接读这些文件（不调任何厂商 API），在 dsh 里出六个命令。读之外只有一处写：`/hub-init` 往**你自己指定的项目目录**里装 `.hub/` 规则本体与各 IDE 的指针段。
```

**依据 2 · 源码核查**：[package.json:83-85](https://github.com/121212165/dsh-plugin-ide-hub/blob/a1fd8af301675b41e9115e22f837d9f466c2d351/package.json#L83-L85)

外部 kit 固定标签依赖。

```text
  "dependencies": {
    "@dsh-family/kit": "github:121212165/dsh-plugin-kit#v0.2.1"
  }
```

**依据 3 · 源码核查**：[src/hub/inventory.ts:31-37](https://github.com/121212165/dsh-plugin-ide-hub/blob/a1fd8af301675b41e9115e22f837d9f466c2d351/src/hub/inventory.ts#L31-L37)

有限扫描和跳过错误。

```text
function walk(root: string, spec: IdeSpec, depth: number, state: WalkStat): void {
  if (depth > 4 || !existsSync(root)) return;
  let entries: string[];
  try {
    entries = readdirSync(root);
  } catch {
    return;
```

**依据 4 · 源码核查**：[src/plugin.ts:254-270](https://github.com/121212165/dsh-plugin-ide-hub/blob/a1fd8af301675b41e9115e22f837d9f466c2d351/src/plugin.ts#L254-L270)

移除边界。

<details>
<summary>查看原文（17行）</summary>

```text
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
```

</details>

**依据 5 · 源码核查**：[src/plugin.ts:278-301](https://github.com/121212165/dsh-plugin-ide-hub/blob/a1fd8af301675b41e9115e22f837d9f466c2d351/src/plugin.ts#L278-L301)

dry-run 与现有规则处理。

<details>
<summary>查看原文（24行）</summary>

```text
  const write = (absolute: string, display: string, content: string, detail: string): InitChange => {
    if (options.dryRun) {
      return { file: display, outcome: readIf(absolute) === null ? 'created' : 'updated', detail: `${detail}（dry-run，未写盘）` };
    }
    return { file: display, outcome: writeIfChanged(absolute, content), detail };
  };

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
```

</details>

#### 缺口

- 未测兼容、数据敏感度和实际成本
  **影响**：不能推断汇总完整或恢复无损
  **进一步探讨**：隔离备份并检查 dry-run。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何让用户决定是否信任扫描及规则变更？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

现有 dry-run 已列预期文件，扫描结果也有截断状态；重复增加 dry-run 或计数不构成增量。设想在一次初始化计划中列出各 IDE 根的可读性、跳过原因、将覆盖/删除的现有文件和可恢复备份，提示用户决定继续、补查或取消；不上传路径和会话。对照现有 dry-run 和盘点，在不可读目录、截断、改过的 STRUCTURE.json、缺规则文件及中途失败下测遗漏、误判和复核时间；若不能可靠发现跳过或预测删除、备份不可恢复则否定。先核现有输出是否已有等价明细。

#### 证据与依据

**依据 1 · 源码核查**：[src/hub/inventory.ts:31-37](https://github.com/121212165/dsh-plugin-ide-hub/blob/a1fd8af301675b41e9115e22f837d9f466c2d351/src/hub/inventory.ts#L31-L37)

现有读错误被跳过。

```text
function walk(root: string, spec: IdeSpec, depth: number, state: WalkStat): void {
  if (depth > 4 || !existsSync(root)) return;
  let entries: string[];
  try {
    entries = readdirSync(root);
  } catch {
    return;
```

**依据 2 · 源码核查**：[src/plugin.ts:254-270](https://github.com/121212165/dsh-plugin-ide-hub/blob/a1fd8af301675b41e9115e22f837d9f466c2d351/src/plugin.ts#L254-L270)

移除 STRUCTURE.json 与保留模板分支。

<details>
<summary>查看原文（17行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[src/plugin.ts:278-301](https://github.com/121212165/dsh-plugin-ide-hub/blob/a1fd8af301675b41e9115e22f837d9f466c2d351/src/plugin.ts#L278-L301)

已有 dry-run。

<details>
<summary>查看原文（24行）</summary>

```text
  const write = (absolute: string, display: string, content: string, detail: string): InitChange => {
    if (options.dryRun) {
      return { file: display, outcome: readIf(absolute) === null ? 'created' : 'updated', detail: `${detail}（dry-run，未写盘）` };
    }
    return { file: display, outcome: writeIfChanged(absolute, content), detail };
  };

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
```

</details>

**依据 4 · 源码核查**：[src/plugin.ts:115-151](https://github.com/121212165/dsh-plugin-ide-hub/blob/a1fd8af301675b41e9115e22f837d9f466c2d351/src/plugin.ts#L115-L151)

扫描限制与截断。

<details>
<summary>查看原文（37行）</summary>

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
  return { entries, truncated };
```

</details>

#### 缺口

- 未穷尽全部命令输出和无原型
  **影响**：增量与收益未证
  **进一步探讨**：先核输出，再在复制项目故障对照。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
