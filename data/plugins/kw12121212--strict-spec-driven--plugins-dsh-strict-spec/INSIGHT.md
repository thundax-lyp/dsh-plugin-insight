# dsh-plugin-strict-spec

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[6045abf](https://github.com/kw12121212/strict-spec-driven/tree/6045abf43f6338f28344032c707428f82f36b865/plugins/dsh-strict-spec)

<!-- BEGIN META -->
[![npm 30d 543](https://img.shields.io/static/v1?label=npm+30d&message=543&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-strict-spec) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-strict-spec)
<!-- END META -->

> **功能**：在 DeepSeek Harness 中浏览 strict 工作流文档并提供内置工作流工具。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 组织会话文档及读取错误；[Q03](#research-q03) 提供确认式目标入口。

> **主要限制**：[Q03](#research-q03) 查看本身与目标驱动的后续修改必须分开判断；[Q04](#research-q04) 实际 Skill 来源依赖宿主。

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
  - [Q01 · Strict 文档查看器相比打开 YAML 文件有什么增量？](#detail-section-11)
  - [Q02 · 文档如何读入，文件边界和目录截断怎样表达？](#detail-section-12)
  - [Q03 · 只读视图与目标按钮的权限边界是什么？](#detail-section-13)
  - [Q04 · 内置 Skill、宿主版本和失败恢复有什么条件？](#detail-section-14)
  - [Q05 · 如何减少目标启动时的版本和工作区误认？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：使用 strict-spec-driven 的 DSH 用户希望在会话中查阅工作区文档和推进里程碑。

直接打开和查阅 YAML，再自行配置和运行工作流命令。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| 文档视图 | 在 Session 中浏览 YAML | 目录可能截断 |
| 目标启动 | 确认后向 Session 提交目标 | 后续 Agent 可能写文件 |
| 内置 Skill | 提供工作流入口 | 外部同名技能可能优先 |

**流程与依赖**

| 依赖 | 条件 | 用途 | 缺失影响 |
|---|---|---|---|
| 固定范围 DSH 客户端和服务 | 必需 | 文档、Session 与命令 | 不兼容或入口缺失 |
| 工作区 strict YAML | 查看需要 | 显示结构化文档 | 空态或解析错误 |
| 内置/外部 Skill 与 CLI | 推进目标需要 | 执行 strict 工作流 | 功能或版本可能不同 |
| 明确 Session 和授权 | 提交目标需要 | 管理后续工作 | 可能修改非预期工作区 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
|---|---|---|
| 准备 | 核对宿主版本和 Skill 来源 | 不匹配则回原始文件 |
| 查看 | 选择 Session 并打开文档 | 留意截断与错误 |
| 确认 | 用户核对 objective 和目标 Session | 不符合预期则取消 |
| 执行 | 宿主和 Agent 运行后续目标 | 按现有授权和备份处理结果 |

**效果与成本**

| 阶段 | 资源 | 人工 | 未知 |
|---|---|---|---|
| 首次 | 兼容宿主和工作区 | 核对版本与 Skill 来源 | 宿主加载未验 |
| 持续 | 文档读取与 watch | 复核状态及目标范围 | 性能和更新延迟未知 |
| 恢复 | 工作区备份 | 检查目标及后续文件修改 | 回滚与取消未测 |

| 结果 | 依据 | 未知 |
|---|---|---|
| 文档视图 | Session 端口与 YAML 解析 | 实际浏览体验 |
| 目标确认 | 显示 objective 并单次提交 | 后续 Agent 操作与结果 |
| 内置 Skill | provider 与候选 rank | 实际宿主优先级 |

> **思考**：[Q03](#research-q03) 查看本身与目标驱动的后续修改必须分开判断；[Q04](#research-q04) 实际 Skill 来源依赖宿主。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 组织会话文档及读取错误；[Q03](#research-q03) 提供确认式目标入口。

[Q02](#research-q02) 分页读取有空页防循环并返回分类错误；[Q03](#research-q03) 通过 pending 状态避免重复提交。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 查看本身与目标驱动的后续修改必须分开判断；[Q04](#research-q04) 实际 Skill 来源依赖宿主。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先核对宿主、工作区及实际 Skill；[Q03](#research-q03) 确认目标前审阅 Session 和后续授权。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本静态核查，未运行 DSH、目标或内置 CLI。

- 已检查：作者 README、包清单、源码路径 plugins/dsh-strict-spec/README.md、plugins/dsh-strict-spec/package.json、plugins/dsh-strict-spec/src/client.ts、plugins/dsh-strict-spec/src/model/port.ts、plugins/dsh-strict-spec/src/model/loader.ts、plugins/dsh-strict-spec/src/client/GoalLaunchControl.tsx、plugins/dsh-strict-spec/src/model/goalLaunch.ts、plugins/dsh-strict-spec/src/host.ts、plugins/dsh-strict-spec/src/host/builtinTooling.ts 及固定范围 inventory；组件：plugins/dsh-strict-spec。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查客户端注册、文档加载、目标提交状态机及 host 内置提供者；未审完整 CLI、所有视图或宿主授权实现。
- 下一步：隔离宿主测试目录截断、解析、外部 Skill 优先级、目标拒绝及后续工作区变化；本次未执行。

**分析版本**

- **仓库**：[kw12121212/strict-spec-driven](https://github.com/kw12121212/strict-spec-driven)
- **版本号**：0.5.1（[固定提交 6045abf](https://github.com/kw12121212/strict-spec-driven/tree/6045abf43f6338f28344032c707428f82f36b865)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设显示目标工作区与 Skill 来源能减少误认，需与现有确认对照。

隔离宿主测试目录截断、解析、外部 Skill 优先级、目标拒绝及后续工作区变化；本次未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 426 | — | — | 4261 |
| .ts | source | 30 | 6580 | 4425 | 1765 | — |
| .tsx | source | 12 | 2989 | 2480 | 393 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-04），可前往 [GitHub Issues](https://github.com/kw12121212/strict-spec-driven/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查文档查看、确认式目标提交及内置 Skill 的版本和权限边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Strict 文档查看器相比打开 YAML 文件有什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向在 DSH 会话中使用 strict-spec-driven 工作流的人，插件将会话工作区的 strict YAML 组织为文档树和结构化视图；相较手动浏览文件，它提供会话绑定、文档分类和解析错误视图。数据中的 roadmap 状态仍是文档声明，不应当作插件独立计算或验证。它还提供内置 Skill/CLI 和确认后提交目标的入口，因此整个插件不应简单描述为纯只读工具。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/dsh-strict-spec/README.md:1-8](https://github.com/kw12121212/strict-spec-driven/blob/6045abf43f6338f28344032c707428f82f36b865/plugins/dsh-strict-spec/README.md#L1-L8)

作者说明 Session 工作区文档视图。

```text
# dsh-plugin-strict-spec

[中文](README.zh.md)

A read-only viewer for strict workflow documents inside DeepSeek Harness (dsh).
It shows the `.strict-spec-driven/` directory of a Session's workspace as a
document tree and renders each strict YAML artifact in a view made for it.

```

**依据 2 · 作者声明**：[plugins/dsh-strict-spec/README.md:39-48](https://github.com/kw12121212/strict-spec-driven/blob/6045abf43f6338f28344032c707428f82f36b865/plugins/dsh-strict-spec/README.md#L39-L48)

作者区分只读视图与启动目标。

<details>
<summary>查看原文（10行）</summary>

```text
## Read-Only Guarantee

The viewer offers no control that writes, edits, or deletes strict workflow
files, and viewing never changes a file. Views show declared field values
exactly as written; they never compute roadmap status or validation results.
Change strict artifacts through `strict-spec-cli` as usual.

The one control that hands work to a Session is the milestone goal launcher
described below. It writes no file itself; any file change afterwards comes
from the Session's agent running the submitted goal.
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-strict-spec/src/client.ts:112-129](https://github.com/kw12121212/strict-spec-driven/blob/6045abf43f6338f28344032c707428f82f36b865/plugins/dsh-strict-spec/src/client.ts#L112-L129)

会话文档端口和目标启动器。

<details>
<summary>查看原文（18行）</summary>

```text
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register("strictSpec", { zh, en }), "dsh-plugin-strict-spec: dictionaries");
  const t = ctx.locale.bind("strictSpec");
  // The seams both surfaces consume: one stateless remote workspace-files
  // port shared by the page viewer and every per-Session tab surface, the
  // session catalog adapted from the injected service faces, and the
  // root-scoped page selection that survives page remounts. Created once
  // per client load so each surface keeps its own viewer state.
  const remotePort = createRemotePort({ workspaceFiles: ctx.remote.workspaceFiles });
  const viewer = createViewerStores(remotePort);
  const page = createPageSelectionStore();
  const controller = createPageController(viewer, page.store);
  const picker = createSessionCatalogPort(ctx.sessions, ctx.workspaces);
  // The milestone goal launchers: one per Session over the one command
  // port, shared by the page and the tab surfaces so both entry points
  // show the same Session's launch state.
  const goalLaunchers = createGoalLaunchers(createCommandPort({ commands: ctx.remote.commands }));
  const tabSurfaces = createTabSurfaces(remotePort, goalLaunchers);
```

</details>

**依据 4 · 源码核查**：[plugins/dsh-strict-spec/src/host.ts:72-82](https://github.com/kw12121212/strict-spec-driven/blob/6045abf43f6338f28344032c707428f82f36b865/plugins/dsh-strict-spec/src/host.ts#L72-L82)

注册内置工具提供者。

<details>
<summary>查看原文（11行）</summary>

```text
export function apply(ctx: Context, config: Config = {}): void {
  if (config.builtinTooling === false) return;
  const distDir = path.dirname(fileURLToPath(import.meta.url));
  ctx.skills.registerProvider(() =>
    createBuiltinToolingProvider({
      skillsDir: path.join(distDir, "skills"),
      cliPath: path.join(distDir, "cli", "strict-spec-cli.js"),
      execPath: process.execPath,
      provenanceMarker: buildProvenanceMarker(readPluginVersion(distDir)),
    }),
  );
```

</details>

#### 缺口

- 没有真实用户及手工文件浏览对照
  **影响**：不能证明定位速度或工作流结果改善
  **进一步探讨**：固定工作区和任务对比查找时间与误读。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 文档如何读入，文件边界和目录截断怎样表达？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

客户端把会话 ID 传入宿主 workspaceFiles 端口，以工作区相对路径列目录和读文件；文档先尝试完整字节并严格 UTF-8 解码，过大时分页读到 EOF，再用 CORE_SCHEMA 解析 YAML；空页但非 EOF 报错避免循环，解析或读取失败返回分类错误。端口注释说明目录列表有上限和 truncated 标记、无分页；因此文档树可能仅显示部分目录内容，是否正确显示依赖宿主版本和实际 UI。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-strict-spec/src/client.ts:112-124](https://github.com/kw12121212/strict-spec-driven/blob/6045abf43f6338f28344032c707428f82f36b865/plugins/dsh-strict-spec/src/client.ts#L112-L124)

创建远端文档端口和界面状态。

<details>
<summary>查看原文（13行）</summary>

```text
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register("strictSpec", { zh, en }), "dsh-plugin-strict-spec: dictionaries");
  const t = ctx.locale.bind("strictSpec");
  // The seams both surfaces consume: one stateless remote workspace-files
  // port shared by the page viewer and every per-Session tab surface, the
  // session catalog adapted from the injected service faces, and the
  // root-scoped page selection that survives page remounts. Created once
  // per client load so each surface keeps its own viewer state.
  const remotePort = createRemotePort({ workspaceFiles: ctx.remote.workspaceFiles });
  const viewer = createViewerStores(remotePort);
  const page = createPageSelectionStore();
  const controller = createPageController(viewer, page.store);
  const picker = createSessionCatalogPort(ctx.sessions, ctx.workspaces);
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-strict-spec/src/model/port.ts:1-14](https://github.com/kw12121212/strict-spec-driven/blob/6045abf43f6338f28344032c707428f82f36b865/plugins/dsh-strict-spec/src/model/port.ts#L1-L14)

会话路径、截断与 watch 约束。

<details>
<summary>查看原文（14行）</summary>

```text
/**
 * The workspace-files port: the only seam the discovery model uses to reach
 * the Session workspace.
 *
 * The interface mirrors the wire contract of the pinned dsh release's
 * `remote.workspaceFiles` namespace — every method takes the sessionId first,
 * because the Host derives the workspace root from it; `list` speaks
 * workspace-relative paths and reports direct children only, cut to the entry
 * cap with a `truncated` flag and no paging; `readBytes` without a range
 * returns the complete file under the complete-file cap; and `changes` yields
 * watch frames for one file or one directory's direct entries and is not
 * recursive. Expressing that seam as a plugin-owned interface keeps every
 * model module free of dsh imports, so the whole model runs under
 * `bun test/run.ts` against a scripted fake while the client passes the real
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-strict-spec/src/model/loader.ts:47-68](https://github.com/kw12121212/strict-spec-driven/blob/6045abf43f6338f28344032c707428f82f36b865/plugins/dsh-strict-spec/src/model/loader.ts#L47-L68)

分页读取和空页防循环。

<details>
<summary>查看原文（22行）</summary>

```text
async function readAllPages(
  port: WorkspaceFilesPort,
  sessionId: string,
  path: string,
  signal?: AbortSignal,
): Promise<string> {
  const parts: string[] = [];
  let offset = 1;
  for (;;) {
    const page = await port.read(sessionId, path, { offset }, signal);
    if (page.lines > 0) {
      parts.push(page.text);
      offset += page.lines;
    } else if (!page.eof) {
      // A page that holds no lines and no eof would loop forever; treat the
      // walk as failed rather than hanging on a misbehaving backend.
      throw new Error("workspace read page reported neither lines nor eof");
    }
    if (page.eof) {
      return parts.length === 0 ? "" : parts.join("\n");
    }
  }
```

</details>

**依据 4 · 源码核查**：[plugins/dsh-strict-spec/src/model/loader.ts:78-107](https://github.com/kw12121212/strict-spec-driven/blob/6045abf43f6338f28344032c707428f82f36b865/plugins/dsh-strict-spec/src/model/loader.ts#L78-L107)

完整读取、错误和 YAML 解析。

<details>
<summary>查看原文（30行）</summary>

```text
export async function loadDocument(
  port: WorkspaceFilesPort,
  sessionId: string,
  path: string,
  signal?: AbortSignal,
): Promise<DocumentLoadResult> {
  let text: string;
  try {
    const window = await port.readBytes(sessionId, path, {}, signal);
    try {
      text = utf8Decoder.decode(window.data);
    } catch {
      // The byte read carries no text gating; invalid UTF-8 surfaces here.
      return { ok: false, error: { kind: "read", code: "workspace-file/not-text" } satisfies ReadError };
    }
  } catch (byteError) {
    if (workspaceFileErrorCode(byteError) !== "workspace-file/too-large") {
      return { ok: false, error: toReadError(byteError) };
    }
    try {
      text = await readAllPages(port, sessionId, path, signal);
    } catch (pageError) {
      return { ok: false, error: toReadError(pageError) };
    }
  }
  try {
    const data = load(text, { schema: CORE_SCHEMA });
    return { ok: true, data, artifactType: declaredArtifactType(data) };
  } catch (parseError) {
    return { ok: false, error: toLocatedParseError(parseError, text) };
```

</details>

#### 缺口

- 未运行固定宿主、超大文件或真实变更通知
  **影响**：无法保证性能、权限与界面更新
  **进一步探讨**：固定工作区核对截断、解析失败和 watch 断线。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 只读视图与目标按钮的权限边界是什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

文档查看入口本身调用读取端口，README 将视图称只读；目标控制则显示 Session 和完整固定 objective，用户进入 confirming 后才能提交，pending 时重复确认被忽略。确认后经 remote.commands.execute 向该 Session 发送 /goal，objective 要求 agent 反复推荐并经 strict-spec-auto 到归档。按钮自身不直接写工作区，但提交目标可能驱动后续 Agent 执行、修改文件，不能把它视为无副作用；实际命令权限、完成与回滚由宿主及工作流决定，未执行。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-strict-spec/src/client/GoalLaunchControl.tsx:50-65](https://github.com/kw12121212/strict-spec-driven/blob/6045abf43f6338f28344032c707428f82f36b865/plugins/dsh-strict-spec/src/client/GoalLaunchControl.tsx#L50-L65)

显示目标、Session 和确认/取消按钮。

<details>
<summary>查看原文（16行）</summary>

```text
/** Renders the launch control for one state, without hooks. */
export function GoalLaunchControlView(props: GoalLaunchControlViewProps): ReactNode {
  const { state, objective, sessionId, actions, t } = props;
  if (state.phase === "confirming" || state.phase === "pending") {
    const pending = state.phase === "pending";
    return (
      <div className={styles.goalLaunch} role="group" aria-label={t("roadmap.goal-launch")}>
        <div className={styles.goalConfirmTitle}>{t("roadmap.goal-confirm-title")}</div>
        <div className={styles.goalConfirmSession}>{t("roadmap.goal-confirm-session", { sessionId })}</div>
        <pre className={styles.goalObjective}>{objective}</pre>
        <div className={styles.goalActions}>
          <Button variant="primary" size="sm" disabled={pending} onClick={() => void actions.confirm()}>
            {pending ? t("roadmap.goal-pending") : t("roadmap.goal-confirm")}
          </Button>
          <Button variant="ghost" size="sm" disabled={pending} onClick={() => actions.cancel()}>
            {t("roadmap.goal-cancel")}
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-strict-spec/src/model/goalLaunch.ts:28-43](https://github.com/kw12121212/strict-spec-driven/blob/6045abf43f6338f28344032c707428f82f36b865/plugins/dsh-strict-spec/src/model/goalLaunch.ts#L28-L43)

固定目标与命令。

<details>
<summary>查看原文（16行）</summary>

```text
/**
 * The fixed goal objective: repeatedly run strict-roadmap-recommend until
 * the milestone its first recommendation selects is complete, with every
 * stop condition stated so the goal completes or blocks instead of idling.
 */
export const MILESTONE_GOAL_OBJECTIVE =
  "Repeatedly run the strict-roadmap-recommend skill until one roadmap milestone is complete. "
  + "In the first round, run it without a milestone hint; the milestone that owns the planned change it recommends is the target milestone. "
  + "In every later round, pass the target milestone id as the milestone hint, so the recommendation runs with --milestone <target-milestone-id>, "
  + "and carry each recommended change through strict-spec-auto to archive. "
  + "Complete the goal once strict-spec-cli roadmap-status reports every planned change of the target milestone complete. "
  + "Block the goal, stating the reason, when the recommendation reports roadmap-error, refine-milestone, or no-candidate before the target milestone is complete, "
  + "or when a created change has open questions that need a human answer.";

/** The exact command line one confirmed launch submits. */
export const MILESTONE_GOAL_COMMAND_LINE = `/goal ${MILESTONE_GOAL_OBJECTIVE}`;
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-strict-spec/src/model/goalLaunch.ts:80-93](https://github.com/kw12121212/strict-spec-driven/blob/6045abf43f6338f28344032c707428f82f36b865/plugins/dsh-strict-spec/src/model/goalLaunch.ts#L80-L93)

提交至远端命令。

<details>
<summary>查看原文（14行）</summary>

```text
/**
 * Adapts the generated client remote face to the command port: the
 * required attachments array always reaches the host as `[]`, an
 * `undefined` value becomes `unknown-command`, and a failed envelope
 * rejects with the wire's error.
 */
export function createCommandPort(remote: RemoteCommandsFace): CommandPort {
  return {
    execute: async (sessionId, line) => {
      const outcome = await remote.commands.execute(sessionId, line, []);
      if (!outcome.ok) {
        throw outcome.error;
      }
      return outcome.value === undefined ? { kind: "unknown-command" } : { kind: "executed", result: outcome.value.result };
```

</details>

**依据 4 · 源码核查**：[plugins/dsh-strict-spec/src/model/goalLaunch.ts:169-207](https://github.com/kw12121212/strict-spec-driven/blob/6045abf43f6338f28344032c707428f82f36b865/plugins/dsh-strict-spec/src/model/goalLaunch.ts#L169-L207)

确认状态、单次提交和拒绝。

<details>
<summary>查看原文（39行）</summary>

```text
export function createGoalLauncher(port: CommandPort, sessionId: string): GoalLauncher {
  const state = createSnapshotStore<GoalLaunchState>(IDLE);
  const phase = (): GoalLaunchState["phase"] => state.getSnapshot().phase;
  return {
    sessionId,
    objective: MILESTONE_GOAL_OBJECTIVE,
    state,
    actions: {
      request(): void {
        if (phase() === "confirming" || phase() === "pending") {
          return;
        }
        state.set({ phase: "confirming" });
      },
      cancel(): void {
        if (phase() !== "confirming") {
          return;
        }
        state.set(IDLE);
      },
      async confirm(): Promise<void> {
        if (phase() !== "confirming") {
          return;
        }
        state.set({ phase: "pending" });
        let next: GoalLaunchState;
        try {
          const outcome = await port.execute(sessionId, MILESTONE_GOAL_COMMAND_LINE);
          if (outcome.kind === "unknown-command") {
            next = { phase: "refused", refusal: { kind: "unavailable" } };
          } else if (outcome.result.kind === "error") {
            next = { phase: "refused", refusal: { kind: "refused", text: outcome.result.text } };
          } else {
            next = { phase: "launched" };
          }
        } catch (error) {
          next = { phase: "refused", refusal: { kind: "failed", message: failureMessage(error) } };
        }
        state.set(next);
```

</details>

**依据 5 · 作者声明**：[plugins/dsh-strict-spec/README.md:39-48](https://github.com/kw12121212/strict-spec-driven/blob/6045abf43f6338f28344032c707428f82f36b865/plugins/dsh-strict-spec/README.md#L39-L48)

作者的只读视图边界。

<details>
<summary>查看原文（10行）</summary>

```text
## Read-Only Guarantee

The viewer offers no control that writes, edits, or deletes strict workflow
files, and viewing never changes a file. Views show declared field values
exactly as written; they never compute roadmap status or validation results.
Change strict artifacts through `strict-spec-cli` as usual.

The one control that hands work to a Session is the milestone goal launcher
described below. It writes no file itself; any file change afterwards comes
from the Session's agent running the submitted goal.
```

</details>

#### 缺口

- 未审计完整 strict-spec-auto 和宿主授权
  **影响**：无法保证后续任务无文件修改或遵守具体审批
  **进一步探讨**：隔离会话核对目标确认、拒绝及实际后续执行。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 内置 Skill、宿主版本和失败恢复有什么条件？

**研究主题**：效果与总成本、采用判断

#### 完整回答

host 默认注册内置 Skill provider，读取包内技能并把 CLI 引用指向 host 的 Node 和随包 CLI；关闭 builtinTooling 可停用该提供者。源码给内置候选 rank 600，注释称外部根优先；实际仲裁取决于固定宿主 registry，未核查宿主实现。package 限制 DSH >=0.2.1-rc.2 <0.2.2，README 的该版本已测试为作者声明。使用者需核对实际加载的 Skill 来源、目标 Session 和文件备份；版本或来源不符则停止目标并改为查看原始文档。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-strict-spec/src/host.ts:24-40](https://github.com/kw12121212/strict-spec-driven/blob/6045abf43f6338f28344032c707428f82f36b865/plugins/dsh-strict-spec/src/host.ts#L24-L40)

内置开关默认开启。

<details>
<summary>查看原文（17行）</summary>

```text
/** Built-in tooling configuration: one master switch, on by default. */
export interface Config {
  /**
   * Enable the built-in strict skill and CLI provision. Skills and CLI are
   * one provision — the served skill bodies are the bundled CLI's only
   * session entry point — so one switch governs both, and turning it off
   * leaves the viewer-only plugin and hands precedence back to any external
   * installation.
   */
  builtinTooling?: boolean;
}

/** Validated configuration schema for the plugin row's config. */
export const Config = Schema.object({
  builtinTooling: Schema.boolean()
    .default(true)
    .description("Serve the built-in strict skills and strict-spec-cli from this plugin."),
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-strict-spec/src/host.ts:72-82](https://github.com/kw12121212/strict-spec-driven/blob/6045abf43f6338f28344032c707428f82f36b865/plugins/dsh-strict-spec/src/host.ts#L72-L82)

注册和包内路径。

<details>
<summary>查看原文（11行）</summary>

```text
export function apply(ctx: Context, config: Config = {}): void {
  if (config.builtinTooling === false) return;
  const distDir = path.dirname(fileURLToPath(import.meta.url));
  ctx.skills.registerProvider(() =>
    createBuiltinToolingProvider({
      skillsDir: path.join(distDir, "skills"),
      cliPath: path.join(distDir, "cli", "strict-spec-cli.js"),
      execPath: process.execPath,
      provenanceMarker: buildProvenanceMarker(readPluginVersion(distDir)),
    }),
  );
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-strict-spec/src/host/builtinTooling.ts:41-50](https://github.com/kw12121212/strict-spec-driven/blob/6045abf43f6338f28344032c707428f82f36b865/plugins/dsh-strict-spec/src/host/builtinTooling.ts#L41-L50)

候选 rank 与外部优先说明。

<details>
<summary>查看原文（10行）</summary>

```text
/**
 * Candidate rank of the pinned dsh line's bundled band: within one registry
 * layer the resolver picks the lowest rank for a duplicate name, and the
 * filesystem provider's roots occupy 100 (project-dsh) through 500
 * (user-agents), so the bundled band loses every same-layer duel against an
 * external copy. Across layers a preset's local discovery registers nearer
 * than this deployment-level provider, which makes external copies win there
 * too — the built-in copies serve only names no external root offers.
 */
export const BUILTIN_TOOLING_RANK = 600;
```

</details>

**依据 4 · 源码核查**：[plugins/dsh-strict-spec/src/host/builtinTooling.ts:217-250](https://github.com/kw12121212/strict-spec-driven/blob/6045abf43f6338f28344032c707428f82f36b865/plugins/dsh-strict-spec/src/host/builtinTooling.ts#L217-L250)

列举与加载时重写 CLI。

<details>
<summary>查看原文（34行）</summary>

```text
export function createBuiltinToolingProvider(assets: BuiltinToolingAssets): SkillProvider {
  const invocation = buildCliInvocation(assets.execPath, assets.cliPath);
  return {
    name: BUILTIN_TOOLING_PROVIDER_NAME,
    async list(): Promise<readonly SkillCandidate[]> {
      const records = await listBundledSkills(assets.skillsDir);
      return records.map((record): SkillCandidate => ({
        name: record.name,
        description: `${record.description}${assets.provenanceMarker}`,
        invocation: INVOCATION,
        source: "bundled",
        provider: BUILTIN_TOOLING_PROVIDER_NAME,
        resourceBase: { kind: "directory", path: path.dirname(record.filePath) },
        rank: BUILTIN_TOOLING_RANK,
        locator: record.filePath,
      }));
    },
    async get(candidate: SkillCandidate): Promise<SkillDefinition | undefined> {
      let text: string;
      try {
        text = await readFile(String(candidate.locator), "utf8");
      } catch {
        return undefined;
      }
      const parsed = parseSkillFrontmatter(text);
      if (parsed === undefined || parsed.name !== candidate.name) return undefined;
      return {
        name: parsed.name,
        description: `${parsed.description}${assets.provenanceMarker}`,
        invocation: INVOCATION,
        source: "bundled",
        provider: BUILTIN_TOOLING_PROVIDER_NAME,
        resourceBase: { kind: "directory", path: path.dirname(String(candidate.locator)) },
        content: rewriteCliToken(parsed.body, invocation),
```

</details>

**依据 5 · 源码核查**：[plugins/dsh-strict-spec/package.json:33-42](https://github.com/kw12121212/strict-spec-driven/blob/6045abf43f6338f28344032c707428f82f36b865/plugins/dsh-strict-spec/package.json#L33-L42)

宿主版本和准备脚本。

<details>
<summary>查看原文（10行）</summary>

```text
        "@deepseek-ai/dsh-client-ui-sidebar",
        "@deepseek-ai/dsh-client-ui-sidebar-right",
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-commands"
      ],
      "platform": "web"
    }
  },
  "engines": {
    "dsh": ">=0.2.1-rc.2 <0.2.2"
```

</details>

**依据 6 · 作者声明**：[plugins/dsh-strict-spec/README.md:124-128](https://github.com/kw12121212/strict-spec-driven/blob/6045abf43f6338f28344032c707428f82f36b865/plugins/dsh-strict-spec/README.md#L124-L128)

作者版本兼容与测试声明。

```text
## Supported dsh Releases

The plugin declares `engines.dsh` as `>=0.2.1-rc.2 <0.2.2` and was tested with
dsh `0.2.1-rc.2`. In a dsh release outside that range it registers no document
UI at all rather than showing a partially working viewer.
```

#### 缺口

- 未运行固定宿主或核验外部 Skill 解析优先级
  **影响**：不能保证实际加载的版本及关闭后的恢复
  **进一步探讨**：隔离宿主同时安装同名外部副本，检查目录及禁用后行为。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何减少目标启动时的版本和工作区误认？

**研究主题**：新假设与验证

#### 完整回答

现有确认已显示 objective 和 Session，不能声称完全没有确认。根据 Q03 的目标可驱动后续写入及 Q04 的外部 Skill 覆盖，假设在确认视图同时显示当前 workspace 和实际解析到的 Skill 来源、版本及有效性，可减少对任务范围的误认。对照现有确认，在同名 Skill 和多 Session 场景测错误目标选择、判断耗时与来源漂移；若宿主已可靠提供且额外状态过期造成误导则否定。该方案未实现。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-strict-spec/src/client/GoalLaunchControl.tsx:50-65](https://github.com/kw12121212/strict-spec-driven/blob/6045abf43f6338f28344032c707428f82f36b865/plugins/dsh-strict-spec/src/client/GoalLaunchControl.tsx#L50-L65)

已有 Session 和目标确认。

<details>
<summary>查看原文（16行）</summary>

```text
/** Renders the launch control for one state, without hooks. */
export function GoalLaunchControlView(props: GoalLaunchControlViewProps): ReactNode {
  const { state, objective, sessionId, actions, t } = props;
  if (state.phase === "confirming" || state.phase === "pending") {
    const pending = state.phase === "pending";
    return (
      <div className={styles.goalLaunch} role="group" aria-label={t("roadmap.goal-launch")}>
        <div className={styles.goalConfirmTitle}>{t("roadmap.goal-confirm-title")}</div>
        <div className={styles.goalConfirmSession}>{t("roadmap.goal-confirm-session", { sessionId })}</div>
        <pre className={styles.goalObjective}>{objective}</pre>
        <div className={styles.goalActions}>
          <Button variant="primary" size="sm" disabled={pending} onClick={() => void actions.confirm()}>
            {pending ? t("roadmap.goal-pending") : t("roadmap.goal-confirm")}
          </Button>
          <Button variant="ghost" size="sm" disabled={pending} onClick={() => actions.cancel()}>
            {t("roadmap.goal-cancel")}
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-strict-spec/src/host/builtinTooling.ts:41-50](https://github.com/kw12121212/strict-spec-driven/blob/6045abf43f6338f28344032c707428f82f36b865/plugins/dsh-strict-spec/src/host/builtinTooling.ts#L41-L50)

候选优先级依赖。

<details>
<summary>查看原文（10行）</summary>

```text
/**
 * Candidate rank of the pinned dsh line's bundled band: within one registry
 * layer the resolver picks the lowest rank for a duplicate name, and the
 * filesystem provider's roots occupy 100 (project-dsh) through 500
 * (user-agents), so the bundled band loses every same-layer duel against an
 * external copy. Across layers a preset's local discovery registers nearer
 * than this deployment-level provider, which makes external copies win there
 * too — the built-in copies serve only names no external root offers.
 */
export const BUILTIN_TOOLING_RANK = 600;
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-strict-spec/src/model/goalLaunch.ts:189-207](https://github.com/kw12121212/strict-spec-driven/blob/6045abf43f6338f28344032c707428f82f36b865/plugins/dsh-strict-spec/src/model/goalLaunch.ts#L189-L207)

确认后命令提交。

<details>
<summary>查看原文（19行）</summary>

```text
      async confirm(): Promise<void> {
        if (phase() !== "confirming") {
          return;
        }
        state.set({ phase: "pending" });
        let next: GoalLaunchState;
        try {
          const outcome = await port.execute(sessionId, MILESTONE_GOAL_COMMAND_LINE);
          if (outcome.kind === "unknown-command") {
            next = { phase: "refused", refusal: { kind: "unavailable" } };
          } else if (outcome.result.kind === "error") {
            next = { phase: "refused", refusal: { kind: "refused", text: outcome.result.text } };
          } else {
            next = { phase: "launched" };
          }
        } catch (error) {
          next = { phase: "refused", refusal: { kind: "failed", message: failureMessage(error) } };
        }
        state.set(next);
```

</details>

#### 缺口

- 未核查全部宿主界面或候选方案
  **影响**：不能断言新增显示有价值
  **进一步探讨**：用固定多工作区和同名技能配置开展对照。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
