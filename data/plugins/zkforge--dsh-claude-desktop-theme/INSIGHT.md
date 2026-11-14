# DSH Claude Desktop Theme

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[3351167](https://github.com/zkforge/dsh-claude-desktop-theme/tree/3351167efaaec44e21342af0436ba602d52fa17e)

<!-- BEGIN META -->
[![GitHub ★ 38](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=38&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zkforge/dsh-claude-desktop-theme) [![npm 30d 6,355](https://img.shields.io/static/v1?label=npm+30d&message=6%2C355&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-claude-desktop-theme) [![最新发布 2026-11-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-claude-desktop-theme)
<!-- END META -->

> **功能**：为 DeepSeek Harness Desktop 提供主题、界面布局和会话辅助功能。

> **亮点**：[Q01](#research-q01) 的主题覆盖与界面增强支持会话内操作。[Q02](#research-q02) 和 [Q03](#research-q03) 还核实了同会话上下文重置及本地分支查询能力。

> **主要限制**：[Q01](#research-q01) 部分界面依赖宿主构建类名，[Q02](#research-q02) 的上下文清理会追加事件，退出主题不会撤销。

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
  - [Q01 · 换主题后，用户实际得到哪些可用界面变化？](#detail-section-11)
  - [Q02 · 在原会话执行 /clear 会清理什么？](#detail-section-12)
  - [Q03 · 侧边辅助如何限制 Git 查询和显示？](#detail-section-13)
  - [Q04 · 如何比较启用和退出的成本与改进？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：常用 DSH Desktop 且希望调整侧栏、输入框和会话布局的使用者，可以在独立样例会话对比原生界面。

原生主题及工作区界面可完成相同任务，用户可以另用终端查看本地 Git 状态。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 主题与布局 | 修改侧栏、会话和输入区 | 受宿主构建与服务限制 |
| /clear | 清理活动会话上下文 | 空闲且无排队，日志仍保留 |
| 查询本地分支 | 对照当前工作区 | 只能读已注册的仓库路径 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH Desktop 和主题服务 | 视觉功能必需 | 样式和界面配置 | 部分增强可能不加载 |
| commands、会话服务 | /clear 必需 | 更新上下文和投影 | 命令无法挂载 |
| Git 与注册工作区 | 分支读取必需 | 本地状态显示 | 可见错误或未知工作区 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 在样例会话启用主题 | 对照原生控制 |
| 试用 | 核对输入、选择器与分支 | 无误触或操作缺失 |
| 退出 | 禁用插件并检查原主题 | 视觉恢复；会话事件另行核对 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 渲染与构建资源 | 检查版本、主题和按钮可达 | 耗时未知 |
| 持续使用 | 观察与本地分支查询资源 | 兼容性核对 | 负担未知 |
| 失败恢复 | 无实际金额 | 停用并核对会话状态 | 已写事件不会因关闭回撤 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 视觉界面 | 作用域样式与配置 | 各宿主构建覆盖 |
| 上下文整理 | 保留日志并替换会话片段 | 落盘故障时后果 |
| Git 信息 | 工作区限界与本地分支 | 日常节时 |

> **思考**：[Q01](#research-q01) 部分界面依赖宿主构建类名，[Q02](#research-q02) 的上下文清理会追加事件，退出主题不会撤销。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 的主题覆盖与界面增强支持会话内操作。[Q02](#research-q02) 和 [Q03](#research-q03) 还核实了同会话上下文重置及本地分支查询能力。

[Q01](#research-q01) 将样式、DOM 和 token 归到同一清理作用域，[Q03](#research-q03) 以已注册工作区代替任意客户端路径。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q01](#research-q01) 部分界面依赖宿主构建类名，[Q02](#research-q02) 的上下文清理会追加事件，退出主题不会撤销。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 在样例窗口试配主题。出现控制缺失就回到原生界面，关键会话勿用来测试上下文操作。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持主题及分支查询，也支持改变会话有效上下文的命令。不同宿主样式、命令持久化及实机体验待核实。

- 已检查：作者 README、包清单、源码路径 cordis.patch.yml、src/client/apply.ts、src/client/theme/mount.ts、src/host/clear.ts、src/host/index.ts、src/host/git.ts、package.json、README.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码中的主题装配、会话清理和 Git 查询。没有运行 DSH、发布构建、系统主题和截图测试，其他附加功能仅从入口识别。
- 下一步：用相同宿主、工作区和样例任务对照原生主题、开启及关闭，检查 [Q04](#research-q04) 所列键盘与视觉退出条件。

**分析版本**

- **仓库**：[zkforge/dsh-claude-desktop-theme](https://github.com/zkforge/dsh-claude-desktop-theme)
- **版本号**：0.10.5（[固定提交 3351167](https://github.com/zkforge/dsh-claude-desktop-theme/tree/3351167efaaec44e21342af0436ba602d52fa17e)）
- **版本日期**：2026-11-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 建议分开核查兼容层与稳定服务，对比未知构建时的模块级回退能否保住更多可用操作。

用相同宿主、工作区和样例任务对照原生主题、开启及关闭，检查 [Q04](#research-q04) 所列键盘与视觉退出条件。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 17 | 2275 | — | — | 66031 |
| .mjs | source | 27 | 3936 | 3289 | 473 | — |
| .ts | source | 175 | 31193 | 25116 | 4806 | — |
| .tsx | source | 23 | 3856 | 3266 | 398 | — |
| .mjs | test | 48 | 8370 | 7490 | 602 | — |
| .ts | test | 99 | 15127 | 12936 | 1169 | — |
| .mjs | example | 2 | 553 | 526 | 26 | — |
| .md | example | 1 | 18 | — | — | 143 |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/zkforge/dsh-claude-desktop-theme/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=7&color=737b86&logo=github)](https://github.com/zkforge/dsh-claude-desktop-theme/issues?q=is%3Aissue+created%3A2026-10-15T11%3A35%3A36.890Z..2026-11-14T11%3A35%3A36.890Z) [![近30天关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/zkforge/dsh-claude-desktop-theme/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-15T11%3A35%3A36.890Z..2026-11-14T11%3A35%3A36.890Z)



统计日期：2026-11-14。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：采用主题后能否完成同样的会话操作，并在宿主差异和会话辅助变更时维持清楚的退出条件？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 换主题后，用户实际得到哪些可用界面变化？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

想在 DSH Desktop 中统一会话、选择器及侧栏布局的人，可以以原生浅深色界面作对照。Bundle 加载宿主与浏览器半边，浏览器先挂设置并订阅配置。激活给 DOM 加标记、样式和语义 token 覆盖，订阅签名变化时先释放旧作用域再挂新方案，禁用直接退出样式应用。除了主题，装配入口还添加工作区、会话与菜单上的兼容功能。一些增强依赖每个 Host 构建的散列类名，未知构建会记日志且相关样式可能不起作用。失败激活会清理该作用域。选择颜色构成的便利较易核查，导航或任务效率提升仍依赖使用者是否需要这些额外操作。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:1-5](https://github.com/zkforge/dsh-claude-desktop-theme/blob/3351167efaaec44e21342af0436ba602d52fa17e/cordis.patch.yml#L1-L5)

加载目标模块。

```text
- insert:
    - id: ui-skin-ccd-style
      name: dsh-claude-desktop-theme
      config:
        enabled: true
```

**依据 2 · 源码核查**：[src/client/apply.ts:93-139](https://github.com/zkforge/dsh-claude-desktop-theme/blob/3351167efaaec44e21342af0436ba602d52fa17e/src/client/apply.ts#L93-L139)

设置、订阅与激活释放的入口。

<details>
<summary>查看原文（47行）</summary>

```text
export function apply(ctx: Context): void {
  if (typeof document === 'undefined') return;
  ctx.effect(() => {
    const host = createHostServices(ctx);
    const form = host.configForms.get(ENTRY_ID);
    const dom = createDomPort(document);
    let environment: FeatureEnvironment = {
      config: adoptConfig(undefined),
      logger: { debug: () => {}, error: () => {} },
      host,
      dom,
    };
    const logger: Logger = {
      debug: message => { if (environment.config.debug) console.debug(`[${PLUGIN_ID}] ${message}`); },
      error: (message, error) => console.error(`[${PLUGIN_ID}] ${message}`, error),
    };
    const settingsScope = new CleanupScope(error => logger.error('settings page cleanup failed', error));
    mountSettingsPage(ctx, dom, form, host.themePreference, SIDEBAR_NAVIGATION_ICONS.theme, settingsScope);
    let active: CleanupScope | null = null;
    let released = false;
    let applied: string | null = null;

    const sync = () => {
      if (released) return;
      const next = adoptConfig(form.getSnapshot().value);
      const signature = JSON.stringify(next);
      if (signature === applied) return;
      applied = signature;
      environment = { ...environment, config: next, logger };
      active?.dispose();
      active = null;
      if (!next.enabled) {
        logger.debug('disabled; native interface retained');
        return;
      }
      const scope = new CleanupScope(error => logger.error('cleanup failed', error));
      try {
        mountTheme(environment, scope);
        scope.add(mountPluginPage(document, error => logger.error('plugins: page enhancement failed', error), pluginCatalogPort(ctx)));
        if (next.features.sidebar) {
          scope.add(mountNavigationHistory(document, navigationHistoryPort(ctx), error => logger.error('navigation history: operation failed', error)));
        }
        const scheduleDraft = mountScheduleDraft(ctx, document, error => logger.error('schedule: draft preparation failed', error));
        scope.add(scheduleDraft.dispose);
        scope.add(mountSchedulePage(document, error => logger.error('schedule: page enhancement failed', error), scheduleDraft.prepare));
        scope.add(mountScheduleCardMenus(document, scheduleDeletePort(ctx), error => logger.error('schedule: card menu failed', error)));
        scope.add(mountScheduleDetail(document, scheduleDetailPort(ctx), error => logger.error('schedule: task detail failed', error)));
```

</details>

**依据 3 · 源码核查**：[src/client/theme/mount.ts:29-47](https://github.com/zkforge/dsh-claude-desktop-theme/blob/3351167efaaec44e21342af0436ba602d52fa17e/src/client/theme/mount.ts#L29-L47)

样式及主题 token 归入同一清理范围。

<details>
<summary>查看原文（19行）</summary>

```text
export function mountTheme(environment: FeatureEnvironment, scope: CleanupScope): void {
  scope.add(environment.dom.activate());
  scope.add(environment.dom.mountStyles(tokenCss));
  scope.add(environment.dom.mountStyles(baseCss));
  scope.add(environment.dom.mountStyles(composerCss));
  scope.add(environment.dom.mountStyles(queueCss));
  scope.add(environment.dom.mountStyles(menuCss));
  scope.add(environment.dom.mountStyles(dialogCss));
  scope.add(environment.dom.mountStyles(scrollbarCss));
  scope.add(environment.dom.mountStyles(scheduleCss));
  scope.add(environment.dom.mountStyles(navigationHistoryCss));
  scope.add(environment.dom.mountStyles(pluginsCss));
  scope.add(environment.dom.mountStyles(managementCss));
  scope.add(environment.dom.mountStyles(forgeCss));
  const tokens = resolveThemeTokens(environment.config);
  if (Object.keys(tokens).length > 0) {
    scope.add(environment.host.theme.overrideTokens(THEME_OVERRIDE_SOURCE, tokens));
  }
}
```

</details>

**依据 4 · 源码核查**：[src/client/apply.ts:268-303](https://github.com/zkforge/dsh-claude-desktop-theme/blob/3351167efaaec44e21342af0436ba602d52fa17e/src/client/apply.ts#L268-L303)

未知构建提示、失败与停用的清理。

<details>
<summary>查看原文（36行）</summary>

```text
        }
        /* The context ring's breakdown panel is this plugin's own surface over
           the ring the Composer draws, so it follows the same rule: the switch
           decides whether the ring opens our card or DSH's own panel. */
        if (next.features['context-panel']) {
          mountContextPanel(ctx, environment, scope);
        }
        mountFeatures(FEATURES, environment, scope);
        /* Host class names are hashed per DSH build, so a build this plugin has
           never seen makes every host selector miss. That failure is silent by
           nature — the native interface simply stays — so it is reported as
           soon as the shell's frame identifies the build. */
        scope.add(watchHostBuild(document, status => {
          if (status.state !== 'unknown') return;
          logger.error(
            'unregistered DSH build: the host class names changed, so the CCD styles stay off; '
            + 'refresh compat/host-builds.ts with `node scripts/host-prefixes.mjs <app.asar>`',
          );
        }));
      } catch (error) {
        scope.dispose();
        logger.error('activation failed; native interface retained', error);
        return;
      }
      active = scope;
    };

    const off = form.subscribe(sync);
    sync();
    return () => {
      released = true;
      off();
      settingsScope.dispose();
      active?.dispose();
      active = null;
    };
```

</details>

#### 缺口

- 未核查不同宿主编译出的具体界面覆盖
  **影响**：样式和操作影响无法按版本外推
  **进一步探讨**：固定同一个窗口、布局与宿主，反复切换主题检查原生控制和键盘焦点

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 在原会话执行 /clear 会清理什么？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

宿主注册 clear 命令、会话投影和会话存储，处理器确认插件开关。只有 agent 空闲、无排队消息且无额外命令参数时进入 maintenance。它读当前 surface，保留 system、developer 项目指令与技能目录，将其余连续片段追加 prune 和 replace 标记，最后追加边界并刷存储。历史原始日志不物理删除，命令也无需生成摘要。会话已经留下的凭据或其它内容仍可能存在原日志里；已有系统或开发者消息继续参与上下文。提交内批量追加不 await，避免常规新轮次插入片段之间，但落盘 await 发生在追加之后，给出的代码没有失败时自动撤销追加的分支。因此适合研究会话整理，不能宣称为删除历史或隐私清除。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/clear.ts:24-43](https://github.com/zkforge/dsh-claude-desktop-theme/blob/3351167efaaec44e21342af0436ba602d52fa17e/src/host/clear.ts#L24-L43)

清理边界投影与处于运行/排队时拒绝。

<details>
<summary>查看原文（20行）</summary>

```text
export function applyClearEvent(state: ClearBoundary, event: SessionEvent): ClearBoundary {
  if (event.type === 'turn/start') return { ...state, lastTurn: event.data.turn };
  if (event.type === 'user/message' && event.data.id.startsWith(CLEAR_MARKER)
    && event.data.source.kind === 'ccd-clear'
    && event.surfaceOp === 'append') {
    return { seq: event.seq, turn: state.lastTurn, lastTurn: state.lastTurn };
  }
  return state;
}

/** Keep the original log; replace conversational ranges with a fixed reset notice. */
export async function clearConversation(query: Pick<SessionQueryEngine, 'readSurface'>, invocation: CommandInvocation,
  flush: (session: Session) => Promise<void>): Promise<CommandResult> {
  const { agent, signal } = invocation;
  if (invocation.rawInput.trim()) return { kind: 'error', text: '用法：/clear（保留历史记录，清空当前对话上下文）' };
  if (agent.status !== 'idle' || agent.inbox.nextTurn.length || agent.inbox.nextStep.length) {
    return { kind: 'error', text: '请先停止当前回复并处理排队消息，再执行 /clear。' };
  }
  return agent.runMaintenance(async maintenance => {
    const snapshot = await query.readSurface(agent.id);
```

</details>

**依据 2 · 源码核查**：[src/host/clear.ts:43-77](https://github.com/zkforge/dsh-claude-desktop-theme/blob/3351167efaaec44e21342af0436ba602d52fa17e/src/host/clear.ts#L43-L77)

保留分类、批量事件、结束标记和落盘。

<details>
<summary>查看原文（35行）</summary>

```text
    const snapshot = await query.readSurface(agent.id);
    signal.throwIfAborted();
    maintenance.throwIfAborted();
    const ranges: (typeof snapshot.events)[] = [];
    let range: typeof snapshot.events = [];
    for (const event of snapshot.events) {
      // Workspace instructions and the available skill catalog remain durable context,
      // like Claude's project memory. Tool schemas and system settings also survive.
      const keep = event.type === 'system/message' || event.type === 'developer/message'
        || (event.type === 'user/message' && ['agent-instructions', 'skill-catalog'].includes(event.data.source.kind));
      if (keep) {
        if (range.length) { ranges.push(range); range = []; }
      } else range.push(event);
    }
    if (range.length) ranges.push(range);
    // No awaits inside the commit: maintenance holds new turns until all ranges land.
    for (const events of ranges) {
      const start = events[0]!.seq;
      const end = events.at(-1)!.seq;
      agent.session.append('compaction/prune', {
        shadowedRange: { start, end }, shadowedSeqs: events.map(event => event.seq),
        shadowedTokenCount: events.reduce((sum, event) => sum + priceMessage(derivedMessage(event as unknown as PricedEvent)), 0),
      });
      agent.session.append('user/message', {
        id: `ccd-cleared:${randomUUID()}` as MessageId, role: 'user', source: { kind: 'ccd-clear' },
        content: [{ type: 'text', text: CLEAR_TEXT }],
      }, { surfaceOp: { op: 'replace', startSeq: start, endSeq: end }, sourceEventSeqs: events.map(event => event.seq) });
    }
    const marker = agent.session.append('user/message', {
      id: `${CLEAR_MARKER}${invocation.commandId}` as MessageId, role: 'user', source: { kind: 'ccd-clear' },
      content: [{ type: 'text', text: CLEAR_TEXT }],
    }, { surfaceOp: 'append' });
    await flush(agent.session);
    return { kind: 'success', text: '上下文已清空，历史记录已保留。', sourceEventSeq: marker.seq };
  });
```

</details>

**依据 3 · 源码核查**：[src/host/clear.ts:81-98](https://github.com/zkforge/dsh-claude-desktop-theme/blob/3351167efaaec44e21342af0436ba602d52fa17e/src/host/clear.ts#L81-L98)

真实宿主命令与投影注册。

<details>
<summary>查看原文（18行）</summary>

```text
export function mountClearCommand(ctx: Context, enabled: () => boolean): void {
  ctx.inject(['commands', 'sessionQuery', 'sessionProjections', 'sessions'], injected => {
    if (!enabled()) return;
    const schema = { parse: readClearBoundary } as unknown as ZodType<ClearBoundary>;
    const projection = {
      key: 'ccdClear', stateVersion: 2, stateSchema: schema,
      init: () => ({ seq: null, turn: 0, lastTurn: 0 }), apply: applyClearEvent,
      wire: { viewSchema: schema, view: state => state },
    } satisfies ProjectionDefinition<'ccdClear'>;
    injected.sessionProjections.register(projection);
    const sessions = injected.get('sessions') as unknown as SessionStore;
    injected.commands.register({
      name: 'clear', description: '清空当前上下文，保留会话、项目与历史记录',
      handler: invocation => enabled()
        ? clearConversation(injected.sessionQuery, invocation, async session => { await sessions.flush(session); })
        : { kind: 'error', text: '请先启用 Claude 主题。' },
    });
  });
```

</details>

#### 缺口

- 未运行 /clear 后模型输入和落盘失败场景
  **影响**：只能确认事件变换，不能承诺完全可靠的重启恢复
  **进一步探讨**：在无敏感信息会话保存前后上下文和原日志，并模拟刷写失败与重启

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 侧边辅助如何限制 Git 查询和显示？

**研究主题**：功能与机制、依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

Host 只在配置开启后经 connection 注册 GET 分支查询。客户端提交注册的 workspace ID，Host 查注册表找其目录，未知工作区返回指定状态，不把用户输入直接用作 cwd。执行调用关闭 fsmonitor、命令提示和可选锁，有超时、缓冲区上限与取消信号。结果只枚举本地分支，然后查当前分支或 detached HEAD，列表达到上限会标截断。对任务来讲可减少切终端核对当前工作区，但没有全量远端分支或工作区切换成功的保证。缺 Git、非仓库和其他查询异常分别返回可见状态。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.ts:151-159](https://github.com/zkforge/dsh-claude-desktop-theme/blob/3351167efaaec44e21342af0436ba602d52fa17e/src/host/index.ts#L151-L159)

根模块挂载 Git 等功能。

```text
export function apply(ctx: Context, config: unknown): void {
  const host = (typeof config === 'object' && config !== null ? config : {}) as HostConfig;
  mountStatistics(ctx, () => readValue(host.enabled, false) === true);
  mountContextBreakdown(ctx, () => readValue(host.enabled, false) === true);
  mountDeepSeekBalance(ctx, () => readValue(host.enabled, false) === true);
  mountGitBranches(ctx, () => readValue(host.enabled, false) === true);
  mountWorktrees(ctx, () => readValue(host.enabled, false) === true);
  mountSessionInfo(ctx, () => readValue(host.enabled, false) === true);
  mountClearCommand(ctx, () => readValue(host.enabled, false) === true);
```

**依据 2 · 源码核查**：[src/host/git.ts:21-29](https://github.com/zkforge/dsh-claude-desktop-theme/blob/3351167efaaec44e21342af0436ba602d52fa17e/src/host/git.ts#L21-L29)

Git 执行限制。

```text
export const runGit: GitRunner = (cwd, args, signal, timeout = 5_000) => new Promise((resolve, reject) => {
  execFile('git', ['-c', 'core.fsmonitor=false', ...args], {
    cwd, signal, timeout, windowsHide: true, maxBuffer: 1 << 20, encoding: 'utf8',
    env: { ...process.env, LC_ALL: 'C', GIT_TERMINAL_PROMPT: '0', GIT_OPTIONAL_LOCKS: '0' },
  }, (error, stdout, stderr) => {
    if (error) reject(Object.assign(error, { stderr }));
    else resolve(stdout);
  });
});
```

**依据 3 · 源码核查**：[src/host/git.ts:38-64](https://github.com/zkforge/dsh-claude-desktop-theme/blob/3351167efaaec44e21342af0436ba602d52fa17e/src/host/git.ts#L38-L64)

本地分支、错误和截断。

<details>
<summary>查看原文（27行）</summary>

```text
export async function listBranches(cwd: string, run: GitRunner, signal: AbortSignal): Promise<GitBranchView> {
  let listed: string;
  try {
    listed = await run(cwd, ['for-each-ref', '--sort=-committerdate', `--count=${GIT_BRANCH_LIMIT + 1}`,
      '--format=%(refname:short)', 'refs/heads'], signal);
  } catch (error) {
    const failure = error as RunFailure;
    if (failure.code === 'ENOENT') return view('no-git');
    if (failure.code === 128 && /not a git repository/iu.test(String(failure.stderr ?? ''))) return view('not-repo');
    return view('error');
  }
  let current: string | null = null;
  let detached = false;
  try {
    // Also names an unborn branch, which `for-each-ref` cannot list yet.
    current = (await run(cwd, ['symbolic-ref', '--quiet', '--short', 'HEAD'], signal)).trim() || null;
  } catch {
    try {
      current = (await run(cwd, ['rev-parse', '--short', 'HEAD'], signal)).trim() || null;
      detached = current !== null;
    } catch { /* An empty repository without HEAD lists no current branch. */ }
  }
  const names = listed.split('\n').map(line => line.trim()).filter(Boolean);
  const truncated = names.length > GIT_BRANCH_LIMIT;
  const others = names.slice(0, GIT_BRANCH_LIMIT).filter(name => name !== current);
  const branches = current !== null && !detached ? [current, ...others] : others;
  return { state: 'ready', current, detached, branches: branches.slice(0, GIT_BRANCH_LIMIT), truncated };
```

</details>

**依据 4 · 源码核查**：[src/host/git.ts:74-98](https://github.com/zkforge/dsh-claude-desktop-theme/blob/3351167efaaec44e21342af0436ba602d52fa17e/src/host/git.ts#L74-L98)

宿主按工作区 ID 查询，处理未知及失败。

<details>
<summary>查看原文（25行）</summary>

```text
export function mountGitBranches(ctx: Context, isEnabled: () => boolean, run: GitRunner = runGit): void {
  ctx.inject(['connection'], injected => {
    if (!isEnabled()) return;
    const connection = injected.get('connection') as { fetch: { register(route: {
      path: string; methods: readonly string[]; requestBody: 'buffered';
      fetch(request: Request): Promise<Response>;
    }): () => Promise<void> } } | undefined;
    if (!connection) return;
    ctx.effect(() => connection.fetch.register({
      path: GIT_BRANCHES_PATH, methods: ['GET'], requestBody: 'buffered',
      fetch: async request => {
        const reply = (body: GitBranchView) => Response.json(body, { headers: { 'cache-control': 'no-store' } });
        if (!isEnabled()) return reply(view('error'));
        const id = new URL(request.url, 'http://host').searchParams.get('workspace') ?? '';
        const registry = injected.get('workspaceRegistry') as WorkspaceRegistryPort | undefined;
        let path: string | undefined;
        try { path = id === '' ? undefined : registry?.get(id)?.path; } catch { path = undefined; }
        if (path === undefined) return reply(view('unknown-workspace'));
        try {
          return reply(await listBranches(path, run, request.signal));
        } catch {
          return reply(view('error'));
        }
      },
    }), 'git: branch route');
```

</details>

#### 缺口

- 没有多工作区和实际连接接口的验证
  **影响**：能读什么可追踪，兼容与节时待测
  **进一步探讨**：比较 detached、无 Git 和超量分支时的呈现与原生终端

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何比较启用和退出的成本与改进？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

用单独测试会话比较原生和主题下同一个界面任务，例如选择模型、定位工作区及返回原会话。包声明了 Node 和 DSH 范围以及主题、模型、工作区服务。作者报告特定 macOS 版本冒烟及 Windows 当前限制，证据属于作者说明。初次要测试样式、主题冲突、输入焦点与服务加载；持续维护会受宿主类名和控制结构变化影响。关闭插件可触发样式清理，但已经执行的 clear 追加历史标记，关闭样式不撤销会话变化。若关键按钮不见或停用后仍抢焦点，应恢复原生界面，避免在重要会话测试 clear。一个可验证改进是在检测到未知构建时，只禁用依赖 DOM 的适配模块，保留稳定主题服务，但要对比操作完整性；如果其它界面更容易不一致，就保持原生回退。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:58-75](https://github.com/zkforge/dsh-claude-desktop-theme/blob/3351167efaaec44e21342af0436ba602d52fa17e/package.json#L58-L75)

版本及 Web 客户端依赖。

<details>
<summary>查看原文（18行）</summary>

```text
  "engines": {
    "node": ">=22.18.0",
    "dsh": ">=0.2.1-rc.3 <0.3.0-0"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-ui-renderer",
        "@deepseek-ai/dsh-client-ui-theme",
        "@deepseek-ai/dsh-client-ui-workspace",
        "@deepseek-ai/dsh-client-ui-model-selection",
        "@deepseek-ai/dsh-client-ui-sidebar-right"
      ]
    }
```

</details>

**依据 2 · 源码核查**：[src/client/apply.ts:275-303](https://github.com/zkforge/dsh-claude-desktop-theme/blob/3351167efaaec44e21342af0436ba602d52fa17e/src/client/apply.ts#L275-L303)

未知构建识别与移除。

<details>
<summary>查看原文（29行）</summary>

```text
        mountFeatures(FEATURES, environment, scope);
        /* Host class names are hashed per DSH build, so a build this plugin has
           never seen makes every host selector miss. That failure is silent by
           nature — the native interface simply stays — so it is reported as
           soon as the shell's frame identifies the build. */
        scope.add(watchHostBuild(document, status => {
          if (status.state !== 'unknown') return;
          logger.error(
            'unregistered DSH build: the host class names changed, so the CCD styles stay off; '
            + 'refresh compat/host-builds.ts with `node scripts/host-prefixes.mjs <app.asar>`',
          );
        }));
      } catch (error) {
        scope.dispose();
        logger.error('activation failed; native interface retained', error);
        return;
      }
      active = scope;
    };

    const off = form.subscribe(sync);
    sync();
    return () => {
      released = true;
      off();
      settingsScope.dispose();
      active?.dispose();
      active = null;
    };
```

</details>

**依据 3 · 源码核查**：[src/host/clear.ts:59-76](https://github.com/zkforge/dsh-claude-desktop-theme/blob/3351167efaaec44e21342af0436ba602d52fa17e/src/host/clear.ts#L59-L76)

实际添加会话事件。

<details>
<summary>查看原文（18行）</summary>

```text
    for (const events of ranges) {
      const start = events[0]!.seq;
      const end = events.at(-1)!.seq;
      agent.session.append('compaction/prune', {
        shadowedRange: { start, end }, shadowedSeqs: events.map(event => event.seq),
        shadowedTokenCount: events.reduce((sum, event) => sum + priceMessage(derivedMessage(event as unknown as PricedEvent)), 0),
      });
      agent.session.append('user/message', {
        id: `ccd-cleared:${randomUUID()}` as MessageId, role: 'user', source: { kind: 'ccd-clear' },
        content: [{ type: 'text', text: CLEAR_TEXT }],
      }, { surfaceOp: { op: 'replace', startSeq: start, endSeq: end }, sourceEventSeqs: events.map(event => event.seq) });
    }
    const marker = agent.session.append('user/message', {
      id: `${CLEAR_MARKER}${invocation.commandId}` as MessageId, role: 'user', source: { kind: 'ccd-clear' },
      content: [{ type: 'text', text: CLEAR_TEXT }],
    }, { surfaceOp: 'append' });
    await flush(agent.session);
    return { kind: 'success', text: '上下文已清空，历史记录已保留。', sourceEventSeq: marker.seq };
```

</details>

**依据 4 · 作者声明**：[README.md:120-122](https://github.com/zkforge/dsh-claude-desktop-theme/blob/3351167efaaec44e21342af0436ba602d52fa17e/README.md#L120-L122)

作者声明的兼容和实机边界。

```text
## 环境要求

DSH Desktop 版本声明范围为 `>=0.2.1-rc.3 <0.3.0-0`，允许后续 `0.2.x` 正式版与预发布版（含 `0.2.2-rc.2`）安装；放宽版本声明不代表已完成所有版本的实机验证。macOS（Apple 芯片）已通过 `0.2.2-rc.2` 实机冒烟测试，开发 SDK 保持 rc3 基线。Windows 10 及以上（64 位）的安装入口保留，新版 Windows 构建尚未实机验证。源码构建另需 Node.js ≥ 22.18.0。升级后请完整退出并重新打开 DSH，以加载宿主接口与会话投影。
```

#### 缺口

- 没有固定版本实际窗口操作和关闭后样式观察
  **影响**：无法确认所有覆盖和无冲突
  **进一步探讨**：在同宿主测主题启停、键盘操作和关键界面，检查未知构建和特性分组的回退

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
