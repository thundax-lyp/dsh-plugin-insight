# dsh-temptask

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[f8e1cb1](https://github.com/Aeroscis/dsh-temptask/tree/f8e1cb1fa06c5237a9dce44817cffd853bf16cae)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Aeroscis/dsh-temptask) [![npm 30d 968](https://img.shields.io/static/v1?label=npm+30d&message=968&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@aeroscis/dsh-temptask) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@aeroscis/dsh-temptask)
<!-- END META -->

> **功能**：为 DSH 创建、清理并转正临时任务工作区。

> **亮点**：[Q02](#research-q02) 将任务目录与多个会话的清理流程集中管理。

> **主要限制**：[Q03](#research-q03) 跨卷复制及回滚不构成原子事务，取消会话也是尽力而为。

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
  - [Q01 · 为什么要单独管理临时任务？](#detail-section-11)
  - [Q02 · 删除确认及活跃会话如何处理？](#detail-section-12)
  - [Q03 · 转正失败是否一定无损回滚？](#detail-section-13)
  - [Q04 · 何时适用及删除前如何恢复？](#detail-section-14)
  - [Q05 · 怎样让用户更好判断是否清理？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要处理一次性问题并整理工作区的 DSH 用户。

用户可手工创建目录、工作区和清理。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| 临时工作区 | 组织任务和会话 | 不是权限沙箱 |
| 删除 | 清理目录 | 确认且取消会话为尽力 |
| 转正 | 搬迁目录 | 跨卷非原子、回滚尽力 |
| 会话处理 | 归档或保留 | 与目录删除非同一原子事务 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH 会话与工作区 | 必需 | 任务和会话管理 | 能力不可用或降级 |
| 可写临时目录 | 创建必需 | 保存工作内容 | 创建失败 |
| 可靠备份 | 重要数据清理必需 | 恢复误删 | 无法保证恢复 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户配置 DSH 与临时根目录 | 路径可写可用 |
| 创建 | 用户创建并使用任务 | 工作区与会话关联 |
| 检查 | 用户核对结果、活动进程与备份 | 有未保存数据则停止 |
| 清理或转正 | 用户确认操作 | 失败时核查源、目标和会话 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 磁盘与软件费用未知 | 配置时间未知 | 需兼容 DSH |
| 持续使用 | 临时目录与模型资源未知 | 整理及审核时间未知 | 目录不是权限隔离 |
| 失败恢复 | 双份复制磁盘费用未知 | 人工恢复时间未知 | 跨卷及取消失败未实测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 临时任务 | 目录和工作区关联 | 节省时间及隔离安全性 |
| 删除确认 | 路由要求确认参数 | 真实用户授权及取消成功 |
| 转正 | 支持跨卷复制 | 完整性及回滚可靠性 |

> **思考**：[Q03](#research-q03) 跨卷复制及回滚不构成原子事务，取消会话也是尽力而为。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 将任务目录与多个会话的清理流程集中管理。

[Q02](#research-q02) 取消是尽力；[Q03](#research-q03) 跨卷复制与回滚非事务。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 跨卷复制及回滚不构成原子事务，取消会话也是尽力而为。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 删除前核对备份与活动进程，部分失败时先检查两端。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码静态核查；未创建、转正或删除任何目标目录。

- 已检查：作者 README、包清单、源码路径 README.md、src/routes.ts、src/tasks.ts、src/promote.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根源码静态检查；未运行或删除目标内容。
- 下一步：隔离目录验证活动会话取消失败、跨卷复制和中断恢复。

**分析版本**

- **仓库**：[Aeroscis/dsh-temptask](https://github.com/Aeroscis/dsh-temptask)
- **版本号**：0.5.0（[固定提交 f8e1cb1](https://github.com/Aeroscis/dsh-temptask/tree/f8e1cb1fa06c5237a9dce44817cffd853bf16cae)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 对照现有确认显示清理前证据，验证误删与负担。

隔离目录验证活动会话取消失败、跨卷复制和中断恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 1144 | — | — | 21221 |
| .js | source | 16 | 5577 | 4322 | 1255 | — |
| .mjs | source | 7 | 3881 | 3170 | 389 | — |
| .tsx | source | 1 | 3157 | 2355 | 626 | — |
| .ts | source | 15 | 4392 | 3032 | 974 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Aeroscis/dsh-temptask/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Aeroscis/dsh-temptask/issues?q=is%3Aissue+created%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Aeroscis/dsh-temptask/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查临时目录、清理和转正失败边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 为什么要单独管理临时任务？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

DSH 用户可为一次性工作建立独立目录与工作区，减少手工建目录、会话归档和清理；手工目录和宿主工作区已有相似能力。目录分离不是进程、权限或网络沙箱，也未证明节省时间。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:1-10](https://github.com/Aeroscis/dsh-temptask/blob/f8e1cb1fa06c5237a9dce44817cffd853bf16cae/README.md#L1-L10)

作者说明临时目录及工作区。

<details>
<summary>查看原文（10行）</summary>

```text
# dsh-temptask — DSH 临时任务

给 DeepSeek Harness 加一个「**临时任务**」入口：一键开一个隔离的临时工作目录，在里面聊。
实验、临时调试、一次性问题——即开即用、用完就清。

- **一个任务 = 一个目录 = 一个工作区**（侧边栏里的那一项）：`<DSH_HOME>/dsh-temptask/<时间戳>/`。所以侧边栏长成
  DSH 原生的样子：**任务工作区 → 它的会话**，展开、归档、搜索、拖拽都是官方能力。
- **不用起名**：工作区名就是那个时间戳目录；会话标题由 DSH 按首条消息自动总结，显示在会话行上。
- **聊出成果了就转正**：改名、搬到你要的正式目录、**连这段对话一起带过去**，从此不再被自动清理。
- 侧边栏一行：**主区点击 = 新建**，右边五个按钮（清理 / 转正 / 打开根目录 / 说明 / 设置）；也有 `/temptask` 命令。
```

</details>

**依据 2 · 源码核查**：[src/tasks.ts:349-360](https://github.com/Aeroscis/dsh-temptask/blob/f8e1cb1fa06c5237a9dce44817cffd853bf16cae/src/tasks.ts#L349-L360)

打开缺失目录返回错误。

<details>
<summary>查看原文（12行）</summary>

```text
  /**
   * 打开任务：目录缺失报 MISSING_DIR；会话还活着就复用，否则在同一目录新建一条会话。
   * 顺带自愈：节点被用户在侧边栏删掉时，重新按路径建回来。
   */
  async open(
    query: string,
  ): Promise<ApiResult<{ task: TaskView; sessionId: string; reused: boolean }>> {
    const resolved = this.resolveTask(query);
    if ('ok' in resolved) return resolved;
    const task = resolved.task;

    if (!existsSync(task.path)) {
```

</details>

#### 缺口

- 无与手工流程对照
  **影响**：不能量化省时
  **进一步探讨**：对同一临时任务比较操作数和恢复成本。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 删除确认及活跃会话如何处理？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

delete 和 clean HTTP 路由要求 confirm=true；remove 查任务并调用 dispose，读取会话账目后尽力取消存活会话，再删目录、按策略处理会话和工作区。取消只计成功数，失败不会阻止目录删除；确认参数本身也不是独立人类身份或授权证明。

#### 证据与依据

**依据 1 · 源码核查**：[src/routes.ts:176-204](https://github.com/Aeroscis/dsh-temptask/blob/f8e1cb1fa06c5237a9dce44817cffd853bf16cae/src/routes.ts#L176-L204)

删除和清理确认门。

<details>
<summary>查看原文（29行）</summary>

```text
    route(`${API_PREFIX}/delete`, 'POST', async (body) => {
      const id = asString(body.id).trim();
      if (id.length === 0) {
        return { ok: false, code: ERROR_CODES.badRequest, message: '缺少任务 ID' } satisfies ApiError;
      }
      if (!asBoolean(body.confirm)) {
        return {
          ok: false,
          code: ERROR_CODES.confirm,
          message: '删除是不可恢复操作，需要二次确认',
          hint: '客户端应弹出确认框后带 confirm: true 重试。',
        } satisfies ApiError;
      }
      return manager.remove(id);
    }),

    route(`${API_PREFIX}/clean`, 'POST', async (body) => {
      if (!asBoolean(body.confirm)) {
        return {
          ok: false,
          code: ERROR_CODES.confirm,
          message: '清理是不可恢复操作，需要二次确认',
          hint: '客户端应弹出确认框后带 confirm: true 重试。',
        } satisfies ApiError;
      }
      const ids = Array.isArray(body.ids)
        ? body.ids.filter((value): value is string => typeof value === 'string')
        : undefined;
      const result = await manager.clean({ ids, all: asBoolean(body.all) });
```

</details>

**依据 2 · 源码核查**：[src/tasks.ts:429-454](https://github.com/Aeroscis/dsh-temptask/blob/f8e1cb1fa06c5237a9dce44817cffd853bf16cae/src/tasks.ts#L429-L454)

删除入口与结果。

<details>
<summary>查看原文（26行）</summary>

```text
  async remove(
    id: string,
  ): Promise<
    ApiResult<{
      task: TaskView;
      dirRemoved: boolean;
      workspaceRemoved: boolean;
      sessionsArchived: number;
      sessionsCanceled: number;
    }>
  > {
    const task = this.deps.store.find(id);
    if (task === undefined) return failure(ERROR_CODES.notFound, `任务不存在：${id}`);

    const disposed = await this.disposeTask(task);
    if (disposed instanceof TaskError) return this.toFailure(disposed);

    await this.deps.store.mutate((draft) => {
      draft.tasks = draft.tasks.filter((row) => row.id !== id);
    });
    this.touchedAt.delete(id);
    this.deps.log(
      'info',
      `removed task ${id} (dir: ${String(disposed.dirRemoved)}, archived sessions: ${disposed.sessionsArchived}, policy: ${this.deps.config().onDeleteSessions})`,
    );
    return { ok: true, task: this.toView(task), ...disposed };
```

</details>

**依据 3 · 源码核查**：[src/tasks.ts:721-743](https://github.com/Aeroscis/dsh-temptask/blob/f8e1cb1fa06c5237a9dce44817cffd853bf16cae/src/tasks.ts#L721-L743)

读取会话、尽力取消后删除目录。

<details>
<summary>查看原文（23行）</summary>

```text
  private async disposeTask(task: Task): Promise<
    | TaskError
    | {
        dirRemoved: boolean;
        workspaceRemoved: boolean;
        sessionsArchived: number;
        sessionsCanceled: number;
      }
  > {
    // 1) 会话账目必须在删工作区之前读
    const account = sessionAccountOf(this.deps.ctx, task.workspaceId);
    const sessionIds = account.length > 0 ? account : task.sessionId === undefined ? [] : [task.sessionId];

    // 2) 活着的会话先中止当轮
    let sessionsCanceled = 0;
    for (const sessionId of sessionIds) {
      if (!isSessionLive(this.deps.ctx, sessionId)) continue;
      if (await cancelSession(this.deps.ctx, sessionId)) sessionsCanceled += 1;
    }

    // 3) 删目录（失败则整体中止，不留半清理状态）
    const dirRemoved = await this.removeDirectory(task);
    if (dirRemoved instanceof TaskError) return dirRemoved;
```

</details>

#### 缺口

- 未运行活动会话或删除
  **影响**：不能证明取消完成、后台进程停止或目录无后续写入
  **进一步探讨**：隔离目录模拟取消失败、活动进程及删除错误。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 转正失败是否一定无损回滚？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

转正路由要求确认；跨卷 rename 返回 EXDEV 时复制再删源，源删除失败会报新旧两份存在，需人工核对。后续回滚为 best-effort 且可能失败；故不能将转正看作跨文件系统原子事务或保证失败后只有一份。

#### 证据与依据

**依据 1 · 源码核查**：[src/routes.ts:208-219](https://github.com/Aeroscis/dsh-temptask/blob/f8e1cb1fa06c5237a9dce44817cffd853bf16cae/src/routes.ts#L208-L219)

转正确认。

<details>
<summary>查看原文（12行）</summary>

```text
    // 转正：临时任务 → 正式工作区（搬目录 + 建正式节点 + 复刻对话）。
    // 破坏性在于「目录会被搬走」，所以同样要求显式 confirm；带历史与否由 carry 决定（默认 true）。
    route(`${API_PREFIX}/promote`, 'POST', async (body) => {
      if (!asBoolean(body.confirm)) {
        return {
          ok: false,
          code: ERROR_CODES.confirm,
          message: '转正会把任务目录搬到新位置（不可自动撤销），需要二次确认',
          hint: '客户端应弹出确认框后带 confirm: true 重试。',
        } satisfies ApiError;
      }
      return manager.promote({
```

</details>

**依据 2 · 源码核查**：[src/promote.ts:159-185](https://github.com/Aeroscis/dsh-temptask/blob/f8e1cb1fa06c5237a9dce44817cffd853bf16cae/src/promote.ts#L159-L185)

跨卷复制和删除源失败。

<details>
<summary>查看原文（27行）</summary>

```text
async function moveDirectory(from: string, to: string): Promise<'rename' | 'copy'> {
  try {
    await rename(from, to);
    return 'rename';
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === 'EXDEV') {
      try {
        // errorOnExist + force:false：目标已经被我们在上面查过不存在，这里再兜一层。
        await cp(from, to, { recursive: true, errorOnExist: true, force: false });
      } catch (copyError) {
        throw new PromoteError(
          ERROR_CODES.fs,
          `跨卷复制失败：${from} → ${to}`,
          messageOf(copyError),
        );
      }
      try {
        await rm(from, { recursive: true, force: true });
      } catch (removeError) {
        // 新家已经就位，旧目录删不掉只是留个副本——不算失败，但必须说清楚。
        throw new PromoteError(
          ERROR_CODES.fs,
          `已复制到 ${to}，但旧目录删不掉：${from}`,
          `${messageOf(removeError)}\n新旧两份都在磁盘上；确认新家内容无误后手动删除旧目录即可。`,
        );
      }
```

</details>

**依据 3 · 源码核查**：[src/promote.ts:199-210](https://github.com/Aeroscis/dsh-temptask/blob/f8e1cb1fa06c5237a9dce44817cffd853bf16cae/src/promote.ts#L199-L210)

回滚可能失败。

<details>
<summary>查看原文（12行）</summary>

```text
/** 第 4/5 步失败时的回滚：把目录搬回去（best-effort，失败只记日志）。 */
async function rollbackMove(from: string, to: string): Promise<boolean> {
  try {
    await rename(to, from);
    return true;
  } catch {
    try {
      await cp(to, from, { recursive: true, errorOnExist: true, force: false });
      await rm(to, { recursive: true, force: true });
      return true;
    } catch {
      return false;
```

</details>

#### 缺口

- 未运行跨卷或中断
  **影响**：无法证明复制完整、回滚与历史复刻
  **进一步探讨**：隔离双卷注入复制、删源及回滚失败并核对两端。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 何时适用及删除前如何恢复？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

依赖兼容 DSH 工作区及会话服务和可写目录；目录可能包含未保存成果，删除不可自动撤销。删除或转正前用户应检查目录、活动进程与备份，取消失败或转正部分失败时停止并手工核实源和目标；成本及实际兼容性未知。

#### 证据与依据

**依据 1 · 源码核查**：[src/routes.ts:176-198](https://github.com/Aeroscis/dsh-temptask/blob/f8e1cb1fa06c5237a9dce44817cffd853bf16cae/src/routes.ts#L176-L198)

破坏性操作需显式确认。

<details>
<summary>查看原文（23行）</summary>

```text
    route(`${API_PREFIX}/delete`, 'POST', async (body) => {
      const id = asString(body.id).trim();
      if (id.length === 0) {
        return { ok: false, code: ERROR_CODES.badRequest, message: '缺少任务 ID' } satisfies ApiError;
      }
      if (!asBoolean(body.confirm)) {
        return {
          ok: false,
          code: ERROR_CODES.confirm,
          message: '删除是不可恢复操作，需要二次确认',
          hint: '客户端应弹出确认框后带 confirm: true 重试。',
        } satisfies ApiError;
      }
      return manager.remove(id);
    }),

    route(`${API_PREFIX}/clean`, 'POST', async (body) => {
      if (!asBoolean(body.confirm)) {
        return {
          ok: false,
          code: ERROR_CODES.confirm,
          message: '清理是不可恢复操作，需要二次确认',
          hint: '客户端应弹出确认框后带 confirm: true 重试。',
```

</details>

**依据 2 · 源码核查**：[src/tasks.ts:730-743](https://github.com/Aeroscis/dsh-temptask/blob/f8e1cb1fa06c5237a9dce44817cffd853bf16cae/src/tasks.ts#L730-L743)

会话取消与目录删除。

<details>
<summary>查看原文（14行）</summary>

```text
    // 1) 会话账目必须在删工作区之前读
    const account = sessionAccountOf(this.deps.ctx, task.workspaceId);
    const sessionIds = account.length > 0 ? account : task.sessionId === undefined ? [] : [task.sessionId];

    // 2) 活着的会话先中止当轮
    let sessionsCanceled = 0;
    for (const sessionId of sessionIds) {
      if (!isSessionLive(this.deps.ctx, sessionId)) continue;
      if (await cancelSession(this.deps.ctx, sessionId)) sessionsCanceled += 1;
    }

    // 3) 删目录（失败则整体中止，不留半清理状态）
    const dirRemoved = await this.removeDirectory(task);
    if (dirRemoved instanceof TaskError) return dirRemoved;
```

</details>

**依据 3 · 源码核查**：[src/promote.ts:176-185](https://github.com/Aeroscis/dsh-temptask/blob/f8e1cb1fa06c5237a9dce44817cffd853bf16cae/src/promote.ts#L176-L185)

复制后删源失败提示。

<details>
<summary>查看原文（10行）</summary>

```text
      try {
        await rm(from, { recursive: true, force: true });
      } catch (removeError) {
        // 新家已经就位，旧目录删不掉只是留个副本——不算失败，但必须说清楚。
        throw new PromoteError(
          ERROR_CODES.fs,
          `已复制到 ${to}，但旧目录删不掉：${from}`,
          `${messageOf(removeError)}\n新旧两份都在磁盘上；确认新家内容无误后手动删除旧目录即可。`,
        );
      }
```

</details>

#### 缺口

- 未做真实迁移或恢复
  **影响**：无法量化成本及可靠性
  **进一步探讨**：使用隔离目录和备份演练异常及恢复。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样让用户更好判断是否清理？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

现有接口已有确认并在跨卷删源失败提示两份目录，是直接反证。假设确认前展示活动会话、待删目录和备份核对状态，帮助用户决定继续或取消；对照现有确认，在活动会话、取消失败、未保存文件及无活动场景测误删、误停、核对时间和提示疲劳。误删不降、误导增加或成本抵消收益则否定；未穷尽客户端现有详细展示。

#### 证据与依据

**依据 1 · 源码核查**：[src/routes.ts:176-198](https://github.com/Aeroscis/dsh-temptask/blob/f8e1cb1fa06c5237a9dce44817cffd853bf16cae/src/routes.ts#L176-L198)

已有确认。

<details>
<summary>查看原文（23行）</summary>

```text
    route(`${API_PREFIX}/delete`, 'POST', async (body) => {
      const id = asString(body.id).trim();
      if (id.length === 0) {
        return { ok: false, code: ERROR_CODES.badRequest, message: '缺少任务 ID' } satisfies ApiError;
      }
      if (!asBoolean(body.confirm)) {
        return {
          ok: false,
          code: ERROR_CODES.confirm,
          message: '删除是不可恢复操作，需要二次确认',
          hint: '客户端应弹出确认框后带 confirm: true 重试。',
        } satisfies ApiError;
      }
      return manager.remove(id);
    }),

    route(`${API_PREFIX}/clean`, 'POST', async (body) => {
      if (!asBoolean(body.confirm)) {
        return {
          ok: false,
          code: ERROR_CODES.confirm,
          message: '清理是不可恢复操作，需要二次确认',
          hint: '客户端应弹出确认框后带 confirm: true 重试。',
```

</details>

**依据 2 · 源码核查**：[src/tasks.ts:730-743](https://github.com/Aeroscis/dsh-temptask/blob/f8e1cb1fa06c5237a9dce44817cffd853bf16cae/src/tasks.ts#L730-L743)

已统计并尽力取消会话。

<details>
<summary>查看原文（14行）</summary>

```text
    // 1) 会话账目必须在删工作区之前读
    const account = sessionAccountOf(this.deps.ctx, task.workspaceId);
    const sessionIds = account.length > 0 ? account : task.sessionId === undefined ? [] : [task.sessionId];

    // 2) 活着的会话先中止当轮
    let sessionsCanceled = 0;
    for (const sessionId of sessionIds) {
      if (!isSessionLive(this.deps.ctx, sessionId)) continue;
      if (await cancelSession(this.deps.ctx, sessionId)) sessionsCanceled += 1;
    }

    // 3) 删目录（失败则整体中止，不留半清理状态）
    const dirRemoved = await this.removeDirectory(task);
    if (dirRemoved instanceof TaskError) return dirRemoved;
```

</details>

**依据 3 · 源码核查**：[src/promote.ts:176-185](https://github.com/Aeroscis/dsh-temptask/blob/f8e1cb1fa06c5237a9dce44817cffd853bf16cae/src/promote.ts#L176-L185)

已有部分失败指引。

<details>
<summary>查看原文（10行）</summary>

```text
      try {
        await rm(from, { recursive: true, force: true });
      } catch (removeError) {
        // 新家已经就位，旧目录删不掉只是留个副本——不算失败，但必须说清楚。
        throw new PromoteError(
          ERROR_CODES.fs,
          `已复制到 ${to}，但旧目录删不掉：${from}`,
          `${messageOf(removeError)}\n新旧两份都在磁盘上；确认新家内容无误后手动删除旧目录即可。`,
        );
      }
```

</details>

#### 缺口

- 未穷尽客户端提示及用户行为
  **影响**：不能认定新增展示不存在或有收益
  **进一步探讨**：在隔离工作区对照现有确认和原型。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
