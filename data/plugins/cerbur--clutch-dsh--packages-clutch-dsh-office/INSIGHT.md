# Clutch DSH Office

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[4714f11](https://github.com/Cerbur/clutch-dsh/tree/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-office)

<!-- BEGIN META -->
[![GitHub ★ 45](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=45&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Cerbur/clutch-dsh) [![npm 30d 592](https://img.shields.io/static/v1?label=npm+30d&message=592&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@cerbur/clutch-dsh-office) [![最新发布 2026-11-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@cerbur/clutch-dsh-office)
<!-- END META -->

> **功能**：在 DSH Web 用 3D 厨房和活跃列表查看会话的待处理、运行和未读状态，并打开原会话。

> **亮点**：将宿主状态集中到一个可点击的工作区视图，提供稳定场景座位及溢出列表。保留角色位置减少视觉跳动是设计意图，其任务价值仍待比较。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：单个会话的状态优先级不会决定座位或列表的全局优先级。四席满时待处理会话可能在场景之外，判断下一步仍需查列表和原会话。[Q02](#research-q02)

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
  - [Q01 · 谁会用厨房面板检查会话，点击会进入哪里？](#detail-section-11)
  - [Q02 · 会话进入活跃列表、占据四个座位和显示计时的规则是什么？](#detail-section-12)
  - [Q03 · WebGL 失败或厨房滚出屏幕时，用户还能看到哪些内容？](#detail-section-13)
  - [Q04 · 试用需要什么依赖，资产从哪里到浏览器，失败后如何退出？](#detail-section-14)
  - [Q05 · 怎样验证场景能否帮助分辨下一条要处理的会话？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH Web 并行处理多个会话的个人需要及时找到有待处理请求的工作。作者展示了三维厨房和活跃列表，截图包含模拟状态。[Q01](#research-q01)

基线为 DSH 原生会话列表和原会话视图。简化对照是在相同状态数据上只显示活跃列表。[Q01](#research-q01) [Q05](#research-q05)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 活跃列表 | 定位会话并跳转 | 当前工作区原生数据就绪 |
| 厨房角色 | 快速感知状态 | 最多四席，活动溢出仍看列表 |
| 场景错误恢复 | 重试图形初始化 | 列表与场景错误独立 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH API 和 UI | 必需 | 注册 Web 扩展并读取会话 | 回原生会话视图 |
| WebGL2 和 WebP | 场景要求 | 显示厨房和材质 | 宿主数据就绪时可看列表 |
| 同源资源与浏览器完整性校验 | 场景要求 | 加载打包资源 | 使用列表或按界面重试 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户在隔离配置试两个活动会话 | 状态和目标与原生视图一致 |
| 挤满 | 用户加入第五条并构造待处理状态 | 列表仍找得到并能点击 |
| 失败 | 用户核对重连或 WebGL 错误 | 无法对齐则移除插件条目 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 安装下载、GPU 初始化与现金成本未测 | 安装、隔离配置、构造测试会话 | 按独立配置试用 |
| 持续 | 前台 GPU 内存、帧耗和网络量未测 | 人工核对宿主状态和排查浏览器 | 离屏分支会销毁场景 |
| 失败恢复 | 重连、重试与重新打开耗时未测 | 回原生列表查找并核对同一会话 | 状态未就绪时回原生视图 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 集中定位 | 活跃列表打开宿主会话 | 节省时间和减少漏看的幅度 |
| 稳定座位 | 保留仍活跃成员 | 过量会话下的认知收益 |
| 场景降级 | 错误时列表独立 | 各浏览器的恢复和成本 |

> **思考**：单个会话的状态优先级不会决定座位或列表的全局优先级。四席满时待处理会话可能在场景之外，判断下一步仍需查列表和原会话。[Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将宿主状态集中到一个可点击的工作区视图，提供稳定场景座位及溢出列表。保留角色位置减少视觉跳动是设计意图，其任务价值仍待比较。[Q01](#research-q01) [Q02](#research-q02)

浏览器相交检测决定场景生命周期，运行时管理图形资源和渲染，客户端和服务端都校验资产。宿主连通及工作区就绪与图形初始化各有失败边界。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-5"></a>

### 1.4 主要限制

单个会话的状态优先级不会决定座位或列表的全局优先级。四席满时待处理会话可能在场景之外，判断下一步仍需查列表和原会话。[Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

限定一个隔离的兼容 DSH Web 配置，从两条已知状态的测试会话开始，扩至第五条。确认待处理项能在列表找到，打开的是同一工作区原会话。主动断开再重连，以原生状态为核对依据。不同步或无法定位时移除 Office 配置条目并重载宿主。 [Q02](#research-q02) [Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持工作区状态投影、四席机制和列表回退。尚无固定版本宿主运行、渲染成本与任务对照结果。

- 已检查：作者 README、包清单、源码路径 packages/clutch-dsh-office/README.md、packages/clutch-dsh-office/cordis.patch.yml、packages/clutch-dsh-office/src/client/entry.tsx、packages/clutch-dsh-office/src/client/OfficeDashboard.tsx、packages/clutch-dsh-office/src/client/readiness.ts、packages/clutch-dsh-office/src/client/native-facts.ts、packages/clutch-dsh-office/src/office/session-board.ts、packages/clutch-dsh-office/src/client/session-time.ts、packages/clutch-dsh-office/src/client/scene/KitchenCanvas.tsx、packages/clutch-dsh-office/src/client/scene/runtime.ts、packages/clutch-dsh-office/package.json、packages/clutch-dsh-office/src/index.ts、packages/clutch-dsh-office/src/client/scene/asset-bytes.ts 及固定范围 inventory；组件：packages/clutch-dsh-office。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只研究 monorepo 中 packages/clutch-dsh-office。其余同仓组件及 DSH 宿主实现未纳入。
- 下一步：固定源码静态核查，作者截图含模拟状态。未安装或运行目标，未验收 npm 包、认证、真实宿主和浏览器。

**分析版本**

- **仓库**：[Cerbur/clutch-dsh](https://github.com/Cerbur/clutch-dsh)
- **版本号**：0.1.1（[固定提交 4714f11](https://github.com/Cerbur/clutch-dsh/tree/4714f11b634e13ea8f128692eae68a29bf3d6a6d)）
- **版本日期**：2026-11-08（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

用明确的列表溢出提示保留座位稳定性，假设可减少待处理漏看。用同状态数据和原生列表交叉验证，若错误率或发现时间没有改善即放弃。[Q05](#research-q05)

固定源码静态核查，作者截图含模拟状态。未安装或运行目标，未验收 npm 包、认证、真实宿主和浏览器。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 60 | 5368 | — | — | 115461 |
| .mjs | source | 17 | 3098 | 3011 | 41 | — |
| .tsx | source | 3 | 480 | 467 | 1 | — |
| .ts | source | 68 | 5785 | 5377 | 217 | — |
| .mjs | test | 43 | 9714 | 9353 | 75 | — |
| .tsx | test | 1 | 19 | 19 | 0 | — |
| .ts | test | 2 | 332 | 329 | 1 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/Cerbur/clutch-dsh/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=4&color=737b86&logo=github)](https://github.com/Cerbur/clutch-dsh/issues?q=is%3Aissue+created%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z) [![近30天关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/Cerbur/clutch-dsh/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z)



统计日期：2026-11-10。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实 DSH Web 用户能否更容易找到值得处理的会话，区分宿主状态、场景投影和实际试用收益。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁会用厨房面板检查会话，点击会进入哪里？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

适合在同一 DSH Web 工作区里同时等待多个会话的个人。原办法是从宿主会话列表逐个查看。Web 扩展订阅浏览器连通状态、连接代次、原生会话和运行状态，把仍需关注的会话投影为厨房角色和一份列表。面板出现在主视图和侧边栏，正式模式通过 uiWorkspace.openSession 打开对应宿主会话。数据未就绪会清空面板投影以免保留旧状态，演示模式使用独立数据且不导航。实际增量是聚焦当前工作区内的活跃状态、把打开原会话留在同一界面。

#### 证据与依据

**依据 1 · 作者声明**：[packages/clutch-dsh-office/README.md:5-7](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-office/README.md#L5-L7)

作者描述共享 3D 厨房和活跃会话表。

```text
Kitchen Chaos brings your active DeepSeek Harness Sessions into a shared 3D
kitchen. Up to four whale girls wander alongside persistent Session bubbles,
while the list below keeps every Session needing attention within reach.
```

**依据 2 · 作者声明**：[packages/clutch-dsh-office/README.md:35-46](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-office/README.md#L35-L46)

README 截图包含模拟状态。

<details>
<summary>查看原文（12行）</summary>

```text
## Features

| Feature                       | Preview                                                                                                                                                     | Behavior                                                                                                                                                                                                |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Shared kitchen                | <img src="assets/screenshots/office-session-board.jpg" width="600" alt="Local preview: four simulated Session characters in Kitchen Chaos">                 | Up to four whale girls represent running, pending-interaction or unread-completed Sessions. The counter and list include overflow; idle Sessions are hidden.                                            |
| Clickable Session bubbles     | Same view above                                                                                                                                             | Persistent title, workspace and status bubbles open the corresponding native Session. Tooltips and the list keep long titles accessible.                                                                |
| Active Session list           | <img src="assets/screenshots/office-session-list.jpg" width="600" alt="Local preview: four active Session states, with no idle rows">                       | Newest updates first, with title and workspace. Running rows show elapsed time, unread completions show completion time, and pending interactions retain their status. The list is not limited to four. |
| Whale girls and local preview | <img src="assets/screenshots/office-character-soft-fill.jpg" width="600" alt="Local preview: four simulated whale girls with soft, bright shading">         | Independent walking, small stepping turns and automatic blinking, with soft character lighting. Preview one to four simulated characters without changing real Sessions.                                |
| Cozy kitchen                  | <img src="assets/screenshots/office-optimized-kitchen.jpg" width="600" alt="Kitchen with warm window light, a coated range hood and a wooden platform rim"> | A detailed kitchen with gentle warm lighting and soft surfaces.                                                                                                                                         |

The Session and character screenshots use the labeled local preview; their four
entries are simulated.
```

</details>

**依据 3 · 源码核查**：[packages/clutch-dsh-office/cordis.patch.yml:1-3](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-office/cordis.patch.yml#L1-L3)

Cordis 安装补丁插入真实插件。

```text
- insert:
    - id: clutch-dsh-office
      name: '@cerbur/clutch-dsh-office'
```

**依据 4 · 源码核查**：[packages/clutch-dsh-office/src/client/entry.tsx:75-130](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-office/src/client/entry.tsx#L75-L130)

原生数据订阅、投影与数据就绪接线。

<details>
<summary>查看原文（56行）</summary>

```text
  const online = useSyncExternalStore(subscribeOnline, isOnline);
  const state = useSyncExternalStore(connection.state.subscribe, connection.state.getSnapshot);
  const generation = useSyncExternalStore(
    connection.generation.subscribe,
    connection.generation.getSnapshot,
  );
  const workspace = useSyncExternalStore(
    source.subscribe.bind(source),
    source.getSnapshot.bind(source),
  );
  const list: SessionListState = (useSessions as UseSessions)((value: SessionListState) => value);
  const status: SessionStatusSnapshot = (useSessionStatus as UseSessionStatus)(
    (value: SessionStatusSnapshot) => value,
  );
  const previous = useRef<readonly Actor[]>([]);
  const board = useMemo(() => {
    const projections = new Map(Object.entries(list.projectionsBySession));
    const facts = recentSessionFacts(
      list.ids,
      list.byId,
      status,
      workspace.archivedSessionIds,
      workspace.items.map((item) => ({
        id: item.workspaceId,
        title: item.title,
        sessionIds: item.sessionIds,
      })),
      (id) => {
        const title: unknown = Object.entries(projections.get(id)?.values ?? {}).find(
          ([key]) => key === 'title',
        )?.[1];
        return typeof title === 'string' ? title : undefined;
      },
      t('ungrouped'),
    );
    return projectSessionBoard(facts, previous.current);
  }, [workspace, list, status, t]);
  useLayoutEffect(() => {
    previous.current = board.office.actors;
  }, [board]);
  const phase = officePhase({
    online,
    connection: state,
    generation,
    workspaceState: workspace.state,
    workspacePhase: workspace.phase,
    sessionPhase: list.phase,
  });
  return (
    <OfficeDashboard
      version={__OFFICE_VERSION__}
      board={board}
      phase={phase}
      t={t}
      onOpenSession={openSession}
    />
```

</details>

**依据 5 · 源码核查**：[packages/clutch-dsh-office/src/client/entry.tsx:134-169](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-office/src/client/entry.tsx#L134-L169)

注册主视图和侧栏，使用宿主 openSession。

<details>
<summary>查看原文（36行）</summary>

```text
export function apply(ctx: Context): void {
  ctx.effect(() => ctx.locale.register('clutch.office', { en, zh }));
  ctx.effect(() => {
    const style = document.createElement('style');
    style.dataset.clutchOffice = '';
    style.textContent = OFFICE_CSS;
    document.head.append(style);
    return () => style.remove();
  });
  ctx.slots.inject('main', () =>
    ctx.slots.register(
      {
        name: 'main',
        key: 'clutch-dsh-office',
        locale: 'clutch.office',
        inject: () => ({
          source: ctx.workspaces.list,
          connection: ctx.get('connection') as ConnectionHandle,
          openSession: (id: string) =>
            ctx.uiWorkspace.openSession(id as Parameters<Context['uiWorkspace']['openSession']>[0]),
        }),
      },
      NativeOffice,
    ),
  );
  ctx.slots.inject('sidebar.panellist', () =>
    ctx.slots.register(
      {
        name: 'sidebar.panellist',
        id: 'clutch-dsh-office',
        order: 45,
        label: () => ctx.locale.bind('clutch.office')('nav'),
      },
      OfficeIcon,
    ),
  );
```

</details>

**依据 6 · 源码核查**：[packages/clutch-dsh-office/src/client/OfficeDashboard.tsx:22-43](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-office/src/client/OfficeDashboard.tsx#L22-L43)

演示数据单独处理，未就绪清除展示。

<details>
<summary>查看原文（22行）</summary>

```text
      Array.from({ length: count }, (_, i) => ({
        id: `preview-${i}`,
        label: [t('sampleBuild'), t('sampleReview'), t('sampleDone'), t('samplePlan')][i],
        workspaceTitle: ['clutch-dsh', 'whale-studio', 'kitchen', 'clutch-dsh'][i],
        eligible: true,
        activity: i === 1 || i === 3 ? 'waiting' : i === 2 ? 'idle' : 'working',
        status: (['running', 'question', 'unread', 'approval'] as const)[i],
        running: i === 0,
        unread: i === 2,
        updatedAt: previewEpoch - (i === 0 ? 20_000 : 65_000),
      })),
    [count, t, previewEpoch],
  );
  const display = useMemo(
    () => (preview ? projectSessionBoard(demo) : board),
    [preview, demo, board],
  );
  const ready = preview || phase === 'ready';
  const office = ready
    ? display.office
    : { ...display.office, actors: [], activeCount: 0, overflow: 0 };
  const rows = useMemo(() => (ready ? display.sessions : []), [ready, display.sessions]);
```

</details>

**依据 7 · 源码核查**：[packages/clutch-dsh-office/src/client/OfficeDashboard.tsx:93-134](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-office/src/client/OfficeDashboard.tsx#L93-L134)

场景和活跃列表独立展示。

<details>
<summary>查看原文（42行）</summary>

```text
        <div className="co-preview-controls">
          <strong>{t('previewLabel')}</strong>
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              className="co-chip"
              aria-pressed={count === n}
              onClick={() => setCount(n)}
            >
              {n} {t('actors')}
            </button>
          ))}
          <small>{t('previewNote')}</small>
        </div>
      )}
      <article className="co-room">
        <KitchenCanvas office={office} t={t} onOpenSession={preview ? undefined : onOpenSession} />
        {!ready && (
          <div className="co-scene-caption" role="status">
            {t(phase === 'error' ? 'unavailable' : 'loading')}
          </div>
        )}
      </article>
      <section className="co-recent" aria-label={t('recentSessions')}>
        <header>
          <h2>{t('recentSessions')}</h2>
          <span className="co-count">{ready ? rows.length : '—'}</span>
        </header>
        {!ready ? (
          <p role="status">{t(phase === 'error' ? 'unavailable' : 'loading')}</p>
        ) : rows.length === 0 ? (
          <p className="co-vacant">{t('noRecent')}</p>
        ) : (
          <ul className="co-session-list">
            {rows.map((row) => (
              <li key={row.id}>
                <button
                  className="co-session-row"
                  disabled={preview}
                  onClick={() => onOpenSession(row.id)}
                  data-office-session={row.id}
                >
```

</details>

**依据 8 · 源码核查**：[packages/clutch-dsh-office/src/client/readiness.ts:12-21](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-office/src/client/readiness.ts#L12-L21)

离线或连接代次无效时等待就绪。

<details>
<summary>查看原文（10行）</summary>

```text
  if (!input.online || input.connection !== 'connected' || input.generation === undefined)
    return 'loading';
  if (input.workspaceState === 'error') return 'error';
  if (
    input.workspaceState === 'loading' ||
    input.workspacePhase !== 'ready' ||
    input.sessionPhase !== 'ready'
  )
    return 'loading';
  return 'ready';
```

</details>

#### 缺口

- 没有同工作区宿主会话列表对照。
  **影响**：无法判断原生界面已提供的同类提示与本面板实际节时。
  **进一步探讨**：用相同会话和版本做原生列表与 Office 的回合比较。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 会话进入活跃列表、占据四个座位和显示计时的规则是什么？

**研究主题**：功能与机制、缺陷与关键质疑、贡献与相对优势

#### 完整回答

状态投影依据宿主会话 ID，过滤缺失、归档、空白及子代理行。运行中的子代理可以向祖先传播运行状态，源码分支未显示相同的子代理待处理传播。每个会话按待处理、运行、未读的顺序分类。活跃表按更新时间倒序排序，同值用 ID 稳定处理。四个座位保留仍活跃的旧成员，空位按活跃表顺序补齐。较早的待处理会话可能只在列表出现，不能用场景是否出现角色判断有没有待处理工作。运行时间用可观测切换或更新时间估计，缺时间保持未知，不能用作执行日志。

#### 证据与依据

**依据 1 · 作者声明**：[packages/clutch-dsh-office/README.md:48-61](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-office/README.md#L48-L61)

作者描述状态顺序与稳定座位。

<details>
<summary>查看原文（14行）</summary>

```text
## Usage

1. Open **Office** in the sidebar to see **DSH Office · Kitchen Chaos**, one kitchen
   and the active Session list.
2. Running, pending-interaction and unread-completed Sessions qualify for a
   character. Priority is pending interaction, running, then unread completion.
   Running subagents roll up to their parent Session.
3. The first four eligible Sessions keep their character slots until they leave.
   Later arrivals wait for a free slot and remain accessible in the list.
4. Click a bubble or list row to open its native Session. Opening Office alone does
   not acknowledge unread completions; DSH manages read state.
5. Double-click the version tag to toggle the labeled one-to-four-character local
   preview. Double-click again to return to live Sessions. Simulated bubbles and
   rows do not navigate.
```

</details>

**依据 2 · 源码核查**：[packages/clutch-dsh-office/src/client/native-facts.ts:59-99](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-office/src/client/native-facts.ts#L59-L99)

会话过滤、祖先运行传播与单条状态优先级。

<details>
<summary>查看原文（41行）</summary>

```text
  const status = new Map(statuses),
    archived = new Set(archivedIds);
  const listed = new Set(ids);
  const runningChildren = new Set<string>();
  for (const id of listed) {
    let child = byId[id];
    if (child?.origin !== 'subagent' || !(status.get(id)?.running ?? child.running)) continue;
    const seen = new Set<string>([id]);
    while (child?.origin === 'subagent' && child.parentId && !seen.has(child.parentId)) {
      seen.add(child.parentId);
      runningChildren.add(child.parentId);
      child = byId[child.parentId];
    }
  }
  return [...listed].flatMap((id) => {
    const summary = byId[id];
    if (!summary || archived.has(id) || summary.blank || summary.origin === 'subagent') return [];
    const current = status.get(id),
      interaction = current?.pendingInteraction;
    const kind =
      interaction && typeof interaction === 'object' && 'kind' in interaction
        ? interaction.kind
        : undefined;
    const pending =
      kind === 'approval' || kind === 'plan-review' || kind === 'question' ? kind : undefined;
    const running = (current?.running ?? summary.running) || runningChildren.has(id);
    const unread = current?.completionUnread === true;
    const state: SessionState = pending ?? (running ? 'running' : unread ? 'unread' : 'idle');
    const workspace = workspaces.find((w) => w.sessionIds.includes(id));
    return [
      {
        id,
        label: summary.title || titleFor(id) || summary.displayTitle || id.slice(0, 8),
        eligible: true,
        workspaceId: workspace?.id,
        workspaceTitle: workspace?.title || ungrouped,
        status: state,
        running,
        unread,
        activity: pending ? 'waiting' : running ? 'working' : 'idle',
        updatedAt: Number.isFinite(summary.updatedAt) ? summary.updatedAt : undefined,
```

</details>

**依据 3 · 源码核查**：[packages/clutch-dsh-office/src/office/session-board.ts:3-35](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-office/src/office/session-board.ts#L3-L35)

列表按更新时间排序，座位保留并按序补空。

<details>
<summary>查看原文（33行）</summary>

```text
/** Session identity owns a stable visual slot; native state owns unread acknowledgement. */
export function projectSessionBoard(
  sessions: readonly RecentSession[],
  previous: readonly Actor[] = [],
): SessionBoard {
  const recent = [
    ...new Map(sessions.filter((s) => s.eligible).map((s) => [s.id, s])).values(),
  ].sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0) || a.id.localeCompare(b.id));
  const active = recent.filter((s) => s.status !== 'idle');
  const remaining = new Map(active.map((s) => [s.id, s]));
  const actors: Actor[] = [];
  const occupied = new Set<number>();
  const add = (s: RecentSession, seat: Actor['seat']) => {
    actors.push({
      id: s.id,
      label: s.label,
      workspaceTitle: s.workspaceTitle,
      status: s.status,
      activity: s.activity,
      seat,
      roaming: true,
    });
    occupied.add(seat);
    remaining.delete(s.id);
  };
  for (const actor of previous) {
    const s = remaining.get(actor.id);
    if (s && actors.length < 4 && !occupied.has(actor.seat)) add(s, actor.seat);
  }
  for (const s of remaining.values()) {
    if (actors.length === 4) break;
    const seat = ([0, 1, 2, 3] as const).find((n) => !occupied.has(n))!;
    add(s, seat);
```

</details>

**依据 4 · 源码核查**：[packages/clutch-dsh-office/src/client/session-time.ts:9-42](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-office/src/client/session-time.ts#L9-L42)

观测时点和更新时间回退用于估时。

<details>
<summary>查看原文（34行）</summary>

```text
/** Mirrors notification-bell display clocks, never persisted or treated as native events. */
export function activityClocks(
  previous: ReadonlyMap<string, ActivityClock>,
  sessions: readonly RecentSession[],
  now: number,
): ReadonlyMap<string, ActivityClock> {
  return new Map(
    sessions.map((session) => {
      const old = previous.get(session.id);
      const updatedAt = Number.isFinite(session.updatedAt) ? session.updatedAt : undefined;
      const transitioned = old !== undefined && old.running !== session.running;
      const newPrompt =
        session.running &&
        updatedAt !== undefined &&
        (old?.updatedAt === undefined || updatedAt > old.updatedAt);
      return [
        session.id,
        {
          running: session.running,
          updatedAt,
          since: transitioned ? now : newPrompt ? updatedAt : (old?.since ?? updatedAt),
        },
      ];
    }),
  );
}

export function elapsedTime(since: number | undefined, now: number): string | undefined {
  if (since === undefined || !Number.isFinite(since) || !Number.isFinite(now)) return undefined;
  const seconds = Math.max(0, Math.floor((now - since) / 1000));
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ${seconds % 60}s`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
```

</details>

**依据 5 · 源码核查**：[packages/clutch-dsh-office/src/client/OfficeDashboard.tsx:47-69](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-office/src/client/OfficeDashboard.tsx#L47-L69)

可见时钟刷新及状态文案。

<details>
<summary>查看原文（23行）</summary>

```text
  useEffect(() => {
    previousClocks.current = clocks;
    setNow(Date.now());
  }, [clocks]);
  const hasRunning = rows.some((row) => row.status === 'running');
  useEffect(() => {
    if (!hasRunning) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    const sync = () => {
      if (timer !== undefined) clearInterval(timer);
      timer = undefined;
      if (!document.hidden) {
        setNow(Date.now());
        timer = setInterval(() => setNow(Date.now()), 1000);
      }
    };
    sync();
    document.addEventListener('visibilitychange', sync);
    return () => {
      if (timer !== undefined) clearInterval(timer);
      document.removeEventListener('visibilitychange', sync);
    };
  }, [hasRunning]);
```

</details>

#### 缺口

- 没有实测宿主重连、工作区切换和嵌套子代理事件。
  **影响**：无法量化恢复时长和分类延迟。
  **进一步探讨**：在四个运行会话占满后加入更新时间较早的待处理会话，再重连核对列表、座位与原生状态。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · WebGL 失败或厨房滚出屏幕时，用户还能看到哪些内容？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

场景使用 IntersectionObserver，仅在可见时创建运行时，离屏、重试和卸载会走清理分支。运行时管理帧调度、尺寸和上下文事件，销毁时释放静态物体、模型、照明及渲染资源。初始化失败或上下文丢失时 Canvas 显示错误与重试，宿主数据就绪时活跃列表仍可读和点击。场景离屏销毁不能推得整页 CPU 或网络开销归零，列表和宿主订阅属于另一路径。

#### 证据与依据

**依据 1 · 源码核查**：[packages/clutch-dsh-office/src/client/scene/KitchenCanvas.tsx:54-84](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-office/src/client/scene/KitchenCanvas.tsx#L54-L84)

场景创建和离屏、卸载清理。

<details>
<summary>查看原文（31行）</summary>

```text
  useEffect(() => {
    const element = container.current;
    if (!element) return;
    let failed = false;
    const observer = new IntersectionObserver(([entry]) => {
      // Offscreen rooms release their contexts, so a long overview cannot exhaust WebGL's context limit.
      if (!entry.isIntersecting) {
        runtime.current?.dispose();
        runtime.current = undefined;
        return;
      }
      if (failed || runtime.current) return;
      try {
        runtime.current = createKitchenRuntime(element, (kind) => {
          failed = true;
          setFailure(kind);
        });
        runtime.current.update(latestActors.current);
      } catch (error) {
        console.warn('clutch-dsh-office: WebGL initialization failed', error);
        failed = true;
        setFailure('webgl');
      }
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      runtime.current?.dispose();
      runtime.current = undefined;
    };
  }, [attempt]);
```

</details>

**依据 2 · 源码核查**：[packages/clutch-dsh-office/src/client/scene/KitchenCanvas.tsx:93-105](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-office/src/client/scene/KitchenCanvas.tsx#L93-L105)

错误提示及重试入口。

<details>
<summary>查看原文（13行）</summary>

```text
      {failure && (
        <div className="co-scene-error" role="alert">
          {t(failure)}
          <button
            className="co-button"
            onClick={() => {
              setFailure(undefined);
              setAttempt((value) => value + 1);
            }}
          >
            {t('retry')}
          </button>
        </div>
```

</details>

**依据 3 · 源码核查**：[packages/clutch-dsh-office/src/client/scene/runtime.ts:95-111](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-office/src/client/scene/runtime.ts#L95-L111)

绘制频率控制。

<details>
<summary>查看原文（17行）</summary>

```text
  const draw = (now: number) => {
    frame = 0;
    if (disposed || failed || !visible || document.hidden) return;
    // Keep the timestamp of the last *drawn* frame: skipped RAFs must not slow motion.
    if (actors.size && !reduced.matches && nextDrawAt !== undefined && now < nextDrawAt - 1e-6) {
      frame = requestAnimationFrame(draw);
      return;
    }
    const delta = last === undefined ? 0 : Math.min((now - last) / 1000, 0.06);
    last = now;
    // Keep a cadence deadline rather than resetting it to the last RAF. Small
    // refresh-rate drift otherwise forces a whole extra RAF skip every frame.
    nextDrawAt =
      nextDrawAt === undefined
        ? now + frameInterval
        : nextDrawAt +
          Math.max(1, Math.floor((now - nextDrawAt) / frameInterval) + 1) * frameInterval;
```

</details>

**依据 4 · 源码核查**：[packages/clutch-dsh-office/src/client/scene/runtime.ts:214-252](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-office/src/client/scene/runtime.ts#L214-L252)

帧调度及上下文丢失处理。

<details>
<summary>查看原文（39行）</summary>

```text
  const schedule = (staticShadows = false) => {
    // Only room asset arrivals alter static occluders; actors have their own map.
    if (staticShadows) {
      renderer.shadowMap.needsUpdate = true;
      staticFrame.invalidate();
    }
    if (!frame && !disposed && !failed && visible && !document.hidden)
      frame = requestAnimationFrame(draw);
  };
  const pause = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    last = undefined;
    nextDrawAt = undefined;
    for (const live of actors.values()) live.model.animation?.pause();
  };
  const visibility = () => {
    pause();
    schedule();
  };
  const contextLost = (event: Event) => {
    event.preventDefault();
    failed = true;
    pause();
    onFailure('contextLost');
  };
  const resize = new ResizeObserver(() => {
    width = Math.max(1, container.clientWidth);
    height = Math.max(1, container.clientHeight);
    const aspect = width / height;
    resizeKitchenCamera(camera, aspect);
    renderer.setPixelRatio(kitchenPixelRatio(width, height, window.devicePixelRatio));
    renderer.setSize(width, height, false);
    staticFrame.invalidate();
    schedule();
  });
  container.prepend(renderer.domElement);
  resize.observe(container);
  document.addEventListener('visibilitychange', visibility);
```

</details>

**依据 5 · 源码核查**：[packages/clutch-dsh-office/src/client/scene/runtime.ts:295-310](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-office/src/client/scene/runtime.ts#L295-L310)

释放场景资源与 WebGL 上下文。

<details>
<summary>查看原文（16行）</summary>

```text
    dispose() {
      disposed = true;
      pause();
      resize.disconnect();
      document.removeEventListener('visibilitychange', visibility);
      reduced.removeEventListener('change', visibility);
      renderer.domElement.removeEventListener('webglcontextlost', contextLost);
      for (const actor of actors.values()) actor.models.dispose();
      actors.clear();
      models.dispose();
      renderGuard.dispose();
      staticFrame.dispose();
      lighting.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
```

</details>

**依据 6 · 源码核查**：[packages/clutch-dsh-office/src/client/OfficeDashboard.tsx:93-134](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-office/src/client/OfficeDashboard.tsx#L93-L134)

数据就绪的列表与 Canvas 分开渲染。

<details>
<summary>查看原文（42行）</summary>

```text
        <div className="co-preview-controls">
          <strong>{t('previewLabel')}</strong>
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              className="co-chip"
              aria-pressed={count === n}
              onClick={() => setCount(n)}
            >
              {n} {t('actors')}
            </button>
          ))}
          <small>{t('previewNote')}</small>
        </div>
      )}
      <article className="co-room">
        <KitchenCanvas office={office} t={t} onOpenSession={preview ? undefined : onOpenSession} />
        {!ready && (
          <div className="co-scene-caption" role="status">
            {t(phase === 'error' ? 'unavailable' : 'loading')}
          </div>
        )}
      </article>
      <section className="co-recent" aria-label={t('recentSessions')}>
        <header>
          <h2>{t('recentSessions')}</h2>
          <span className="co-count">{ready ? rows.length : '—'}</span>
        </header>
        {!ready ? (
          <p role="status">{t(phase === 'error' ? 'unavailable' : 'loading')}</p>
        ) : rows.length === 0 ? (
          <p className="co-vacant">{t('noRecent')}</p>
        ) : (
          <ul className="co-session-list">
            {rows.map((row) => (
              <li key={row.id}>
                <button
                  className="co-session-row"
                  disabled={preview}
                  onClick={() => onOpenSession(row.id)}
                  data-office-session={row.id}
                >
```

</details>

#### 缺口

- 没有实测 WebGL2、设备 GPU 占用与资源释放后内存。
  **影响**：代码不能证明低端浏览器或长时间切换的可用性。
  **进一步探讨**：记录渲染失败、滚动、标签页切换与恢复时的列表点击和性能轨迹。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 试用需要什么依赖，资产从哪里到浏览器，失败后如何退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

源码声明兼容的 DSH API/UI peer 版本、Web 扩展与 Three.js，作者列出 WebGL2 和 WebP 浏览器要求。服务端通过 Cordis 注册 GET/HEAD 资源入口，只允许构建索引中匹配标识和 SHA-256 的打包文件，核对字节数和哈希并使用私有不可变缓存。浏览器按文档相对地址同源请求，限制并发，支持超时与取消，接收后再次校验长度和 SHA-256。调用入口处于宿主连接注册链，项目这部分不能单独证明具体环境的认证隔离。首次只在隔离配置装配，用少量可控会话验证状态和打开目标，失败时从配置移除该插件条目并回原生列表。 首次成本由用户承担安装、隔离配置和构造测试会话的人工时间，以及首次下载与 GPU 初始化的资源开销。持续成本包括可见窗口的渲染帧、GPU 内存、资产请求和排查浏览器或连接问题的人工时间。故障恢复包括等待重连或重试，以及人工到原生列表核对和重新打开会话。以“正确找到一条需要处理的会话并打开原会话”为一个合格任务，分别记录每个合格任务的人工分钟、场景资源与故障重做时间。金额、人工分钟和图形资源量均未测。

#### 证据与依据

**依据 1 · 源码核查**：[packages/clutch-dsh-office/package.json:50-65](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-office/package.json#L50-L65)

DSH Web 发布与装配字段。

<details>
<summary>查看原文（16行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-api-workspace-controller",
        "@deepseek-ai/dsh-client-ui-layout",
        "@deepseek-ai/dsh-client-ui-sidebar",
        "@deepseek-ai/dsh-client-ui-session",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-workspace"
      ],
      "platform": "web"
    }
```

</details>

**依据 2 · 源码核查**：[packages/clutch-dsh-office/package.json:72-86](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-office/package.json#L72-L86)

Three.js 与 DSH API/UI peer。

<details>
<summary>查看原文（15行）</summary>

```text
  "dependencies": {
    "three": "^0.180.0"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.5",
    "@deepseek-ai/dsh-api-session-controller": ">=0.2.1-rc.2",
    "@deepseek-ai/dsh-api-workspace-controller": ">=0.2.1-rc.2",
    "@deepseek-ai/dsh-client-connection": ">=0.2.1-rc.2",
    "@deepseek-ai/dsh-client-locale": ">=0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-layout": ">=0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-renderer": ">=0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-session": ">=0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-sidebar": ">=0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-slots": ">=0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-workspace": ">=0.2.1-rc.2"
```

</details>

**依据 3 · 作者声明**：[packages/clutch-dsh-office/README.md:63-76](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-office/README.md#L63-L76)

作者声明浏览器要求和效果边界。

<details>
<summary>查看原文（14行）</summary>

```text
## Requirements and limits

- Requires DSH Web Client, initially tested with `dsh-v0.2.1-rc.2`, and a browser
  supporting WebGL 2 and WebP images. Rendering failures offer a reload action.
- Only active, nonblank, unarchived parent Sessions from the native list appear.
  Missing workspace relationships are labeled **Ungrouped**.
- Office does not issue model requests, read Session histories or write Session
  logs. Character movement is decorative and does not indicate actual tool activity.
- Disconnection clears stale characters and list rows until reconnection. Displayed
  times are estimates based on native updates and observed transitions, not execution
  logs; missing times are shown explicitly.
- Reduced motion stops wandering, turning gestures and blinking. Hidden scenes pause; offscreen scenes
  release rendering resources and rebuild on return. Animation is capped at 30 FPS; performance depends on
  your device, and close zooms may reveal reduced texture or shadow detail.
```

</details>

**依据 4 · 源码核查**：[packages/clutch-dsh-office/src/index.ts:18-45](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-office/src/index.ts#L18-L45)

读取索引并限制资产 ID、长度、MIME 与哈希。

<details>
<summary>查看原文（28行）</summary>

```text
/** Build output is the only file allowlist; requests never select filesystem paths. */
export function createOfficeAssetHandler(index: unknown, packageRoot: URL) {
  const table = new Map<string, AssetRecord>();
  const parsed = index as { schemaVersion?: number; assets?: AssetRecord[] };
  if (!parsed || parsed.schemaVersion !== 1 || !Array.isArray(parsed.assets))
    throw new Error('Office: invalid asset index');
  for (const asset of parsed.assets) {
    if (
      !asset ||
      typeof asset.assetId !== 'string' ||
      !/^(models|lighting)\/(?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9][A-Za-z0-9._-]*\.(glb|png|bin)$/.test(
        asset.assetId,
      ) ||
      asset.path !== 'assets/' + asset.assetId ||
      !/^[a-f0-9]{64}$/.test(asset.sha256) ||
      !Number.isSafeInteger(asset.bytes) ||
      asset.bytes <= 0 ||
      table.has(asset.assetId) ||
      asset.mime !==
        (asset.path.endsWith('.glb')
          ? 'model/gltf-binary'
          : asset.path.endsWith('.png')
            ? 'image/png'
            : 'application/octet-stream')
    )
      throw new Error('Office: invalid asset index entry');
    table.set(asset.assetId, asset);
  }
```

</details>

**依据 5 · 源码核查**：[packages/clutch-dsh-office/src/index.ts:46-87](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-office/src/index.ts#L46-L87)

严格请求路由、读取包内文件并校验。

<details>
<summary>查看原文（42行）</summary>

```text
  return async (request: Request): Promise<Response> => {
    const base = {
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    };
    const reject = (status: number) => new Response(null, { status, headers: base });
    if (request.method !== 'GET' && request.method !== 'HEAD')
      return new Response(null, {
        status: 405,
        headers: { ...base, Allow: 'GET, HEAD' },
      });
    const url = new URL(request.url);
    if (url.pathname !== OFFICE_ASSET_PATH) return reject(404);
    if (
      [...url.searchParams.keys()].some((key) => key !== 'assetId' && key !== 'sha256') ||
      url.searchParams.getAll('assetId').length !== 1 ||
      url.searchParams.getAll('sha256').length !== 1
    )
      return reject(400);
    const asset = table.get(url.searchParams.get('assetId')!);
    if (!asset || url.searchParams.get('sha256') !== asset.sha256) return reject(404);
    let bytes: Awaited<ReturnType<typeof readFile>>;
    try {
      bytes = await readFile(new URL(asset.path, packageRoot), {
        signal: request.signal,
      });
    } catch (error) {
      return reject((error as NodeJS.ErrnoException).code === 'ENOENT' ? 404 : 503);
    }
    if (
      bytes.length !== asset.bytes ||
      createHash('sha256').update(bytes).digest('hex') !== asset.sha256
    )
      return reject(503);
    const headers = {
      'Content-Type': asset.mime,
      'Content-Length': String(asset.bytes),
      'Cache-Control': 'private, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
      ETag: '"' + asset.sha256 + '"',
    };
    return new Response(request.method === 'HEAD' ? null : new Uint8Array(bytes), { headers });
```

</details>

**依据 6 · 源码核查**：[packages/clutch-dsh-office/src/index.ts:91-107](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-office/src/index.ts#L91-L107)

资产请求接入 Cordis connection.fetch 注册。

<details>
<summary>查看原文（17行）</summary>

```text
/** Connection authenticates owner requests before dispatching this exact binary route. */
export async function apply(ctx: Context): Promise<void> {
  const packageRoot = new URL('../', import.meta.url);
  const index: unknown = JSON.parse(
    await readFile(new URL('asset-index.json', import.meta.url), 'utf8'),
  );
  const fetch = createOfficeAssetHandler(index, packageRoot);
  ctx.effect(
    () =>
      ctx.connection.fetch.register({
        path: OFFICE_ASSET_PATH,
        methods: ['GET', 'HEAD'],
        requestBody: 'buffered',
        fetch,
      }),
    'office:assets',
  );
```

</details>

**依据 7 · 源码核查**：[packages/clutch-dsh-office/src/client/scene/asset-bytes.ts:31-85](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-office/src/client/scene/asset-bytes.ts#L31-L85)

同源、并发、超时、取消和前端完整性检查。

<details>
<summary>查看原文（55行）</summary>

```text
  async function fetchAsset(asset: AssetDescriptor, signal: AbortSignal): Promise<ArrayBuffer> {
    if (active >= 2) await new Promise<void>((resolve) => waiting.push(resolve));
    else active++;
    const timeout = new AbortController();
    const combined = AbortSignal.any([signal, timeout.signal]);
    const timer = setTimeout(
      () => timeout.abort(new DOMException('Office asset timed out', 'TimeoutError')),
      timeoutMs,
    );
    let removeAbort = () => {};
    try {
      combined.throwIfAborted();
      const canceled = new Promise<never>((_resolve, reject) => {
        const abort = () => reject(combined.reason);
        combined.addEventListener('abort', abort, { once: true });
        removeAbort = () => combined.removeEventListener('abort', abort);
      });
      return await Promise.race([
        canceled,
        (async () => {
          const query = new URLSearchParams({
            assetId: asset.assetId,
            sha256: asset.sha256,
          });
          // App-owned URLs are document-relative; same-origin cookies carry DSH browser authentication.
          const target = 'api/clutch-dsh-office/assets?' + query;
          const response = await fetchBytes(target, {
            signal: combined,
            credentials: 'same-origin',
          });
          if (!response.ok)
            throw new Error('Office asset HTTP ' + response.status + ': ' + asset.assetId);
          const declared = response.headers.get('content-length');
          if (
            !response.headers.has('content-encoding') &&
            declared !== null &&
            Number(declared) !== asset.bytes
          )
            throw new Error('Office asset length mismatch');
          const buffer = await response.arrayBuffer();
          if (buffer.byteLength !== asset.bytes) throw new Error('Office asset length mismatch');
          combined.throwIfAborted();
          const hash = await crypto.subtle.digest('SHA-256', buffer);
          const hex = Array.from(new Uint8Array(hash), (v) => v.toString(16).padStart(2, '0')).join(
            '',
          );
          if (hex !== asset.sha256) throw new Error('Office asset checksum mismatch');
          combined.throwIfAborted();
          return buffer;
        })(),
      ]);
    } finally {
      clearTimeout(timer);
      removeAbort();
      turn();
```

</details>

#### 缺口

- 没有读回 npm 发布包字节或验证宿主连接认证。
  **影响**：不能确认各代理环境和宿主版本的安装与资产可达性。
  **进一步探讨**：在授权后以隔离配置验证目标版本的包资源、离线、重连和撤销，核对请求能否按预期被拒绝。
- 首次、持续和故障恢复成本均无实测。
  **影响**：无法计算每个合格任务的资源和人工代价，也无法判断场景能否抵消排查开销。
  **进一步探讨**：按上述任务记录安装时间、浏览器帧耗、资产流量和回退用时，和原生列表比对。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样验证场景能否帮助分辨下一条要处理的会话？

**研究主题**：新假设与验证

#### 完整回答

可比较原生列表、Office 完整视图与同状态数据的列表视图。候选改进是给列表增加可见的待处理溢出提示，保留已占座位的稳定性。以两到五个会话构造运行、等待确认和未读，预设各回合正确目标。交叉排列顺序，记录首次正确打开耗时、漏看待处理、误开次数与前台帧耗，在离屏和重连后重复。若完整视图不优于同数据列表，场景的额外成本缺少流程收益证据。若提示增加误开，或待处理过滤口径本身不一致，推翻提示假设。

#### 证据与依据

**依据 1 · 源码核查**：[packages/clutch-dsh-office/src/office/session-board.ts:3-35](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-office/src/office/session-board.ts#L3-L35)

座位稳定与列表完整性可作为两个独立变量。

<details>
<summary>查看原文（33行）</summary>

```text
/** Session identity owns a stable visual slot; native state owns unread acknowledgement. */
export function projectSessionBoard(
  sessions: readonly RecentSession[],
  previous: readonly Actor[] = [],
): SessionBoard {
  const recent = [
    ...new Map(sessions.filter((s) => s.eligible).map((s) => [s.id, s])).values(),
  ].sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0) || a.id.localeCompare(b.id));
  const active = recent.filter((s) => s.status !== 'idle');
  const remaining = new Map(active.map((s) => [s.id, s]));
  const actors: Actor[] = [];
  const occupied = new Set<number>();
  const add = (s: RecentSession, seat: Actor['seat']) => {
    actors.push({
      id: s.id,
      label: s.label,
      workspaceTitle: s.workspaceTitle,
      status: s.status,
      activity: s.activity,
      seat,
      roaming: true,
    });
    occupied.add(seat);
    remaining.delete(s.id);
  };
  for (const actor of previous) {
    const s = remaining.get(actor.id);
    if (s && actors.length < 4 && !occupied.has(actor.seat)) add(s, actor.seat);
  }
  for (const s of remaining.values()) {
    if (actors.length === 4) break;
    const seat = ([0, 1, 2, 3] as const).find((n) => !occupied.has(n))!;
    add(s, seat);
```

</details>

**依据 2 · 源码核查**：[packages/clutch-dsh-office/src/client/OfficeDashboard.tsx:93-134](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-office/src/client/OfficeDashboard.tsx#L93-L134)

现有界面把场景和列表分开。

<details>
<summary>查看原文（42行）</summary>

```text
        <div className="co-preview-controls">
          <strong>{t('previewLabel')}</strong>
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              className="co-chip"
              aria-pressed={count === n}
              onClick={() => setCount(n)}
            >
              {n} {t('actors')}
            </button>
          ))}
          <small>{t('previewNote')}</small>
        </div>
      )}
      <article className="co-room">
        <KitchenCanvas office={office} t={t} onOpenSession={preview ? undefined : onOpenSession} />
        {!ready && (
          <div className="co-scene-caption" role="status">
            {t(phase === 'error' ? 'unavailable' : 'loading')}
          </div>
        )}
      </article>
      <section className="co-recent" aria-label={t('recentSessions')}>
        <header>
          <h2>{t('recentSessions')}</h2>
          <span className="co-count">{ready ? rows.length : '—'}</span>
        </header>
        {!ready ? (
          <p role="status">{t(phase === 'error' ? 'unavailable' : 'loading')}</p>
        ) : rows.length === 0 ? (
          <p className="co-vacant">{t('noRecent')}</p>
        ) : (
          <ul className="co-session-list">
            {rows.map((row) => (
              <li key={row.id}>
                <button
                  className="co-session-row"
                  disabled={preview}
                  onClick={() => onOpenSession(row.id)}
                  data-office-session={row.id}
                >
```

</details>

#### 缺口

- 未执行对照试用。
  **影响**：不能将演示中的可读性推为真实行为收益。
  **进一步探讨**：同宿主交叉测量正确性和耗时，并记录浏览器版本及活跃会话数。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
