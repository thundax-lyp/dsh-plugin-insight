# Anime Garden for DeepSeek Harness

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[c835344](https://github.com/yjl9903/AnimeGarden/tree/c83534477bfbdc27010d5115447b487b9a7846b3/plugins/dsh)

<!-- BEGIN META -->
[![GitHub ★ 1,393](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C393&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/yjl9903/AnimeGarden) [![npm 30d 778](https://img.shields.io/static/v1?label=npm+30d&message=778&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-animegarden) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-animegarden)
<!-- END META -->

> **功能**：在 DSH 会话或侧边栏搜索 Anime Garden 资源，查看周历并打开播放或磁力链接。

> **亮点**：[Q01](#research-q01) 把已有目录查询和资源卡接到 DSH 会话，减少手动转录。

> **主要限制**：[Q03](#research-q03) 磁力交给宿主机器，面板还会尝试发送遥测。

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
  - [Q01 · 留在 DSH 搜索资源有什么增量？](#detail-section-11)
  - [Q02 · 磁力操作在哪台机器执行？](#detail-section-12)
  - [Q03 · 面板会产生哪些外部数据请求？](#detail-section-13)
  - [Q04 · 哪类用户值得考虑接入？](#detail-section-14)
  - [Q05 · 明确标出链接实际处理位置是否有用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH 讨论 Anime Garden 资源的用户可以把目录查询留在会话和侧栏。

在网站查询并复制链接保留原服务体验，但结果需要手动带回会话。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 会话和面板搜索 | 查找目录资源 | 需要上游 API |
| 浮窗播放 | 打开外部播放链接 | 第三方服务可用性未测 |
| 磁力交接 | 在宿主发起系统开启 | 需合适平台和客户端 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Anime Garden API | 搜索必需 | 查询目录 | 外连或服务失败时无法查找 |
| DSH Web 服务与 subprocess | 磁力唤起必需 | 交给宿主应用 | 改用复制或退出 |
| 外部播放器或 BT 客户端 | 对应操作必需 | 处理资源 | 发起请求不能保证成功 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 确认资源与出站策略 | 策略不匹配则保留原流程 |
| 检索 | 使用会话或面板搜索 | 核对分页、返回结果和来源 |
| 交接 | 确认打开位置和应用 | 失败时手工处理链接或卸载 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 外部流量及资源成本未知 | 安装与策略核对耗时未知 | 需兼容 profile |
| 持续 | API 和播放资源支出未知 | 搜索复核耗时未知 | 会话和面板依赖外连 |
| 恢复 | 重新查询成本未知 | 排查路由与默认应用耗时未知 | 可关闭打开功能 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话检索 | 结构化结果进入 DSH | 减少转录的实际幅度 |
| 磁力交接 | 宿主参数化请求 | 客户端完成行为 |
| 外连边界 | 可定位面板遥测字段 | 实际发送和留存 |

> **思考**：[Q03](#research-q03) 磁力交给宿主机器，面板还会尝试发送遥测。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把已有目录查询和资源卡接到 DSH 会话，减少手动转录。

路由区分连接拒绝、请求格式、体积和系统开启错误。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 磁力交给宿主机器，面板还会尝试发送遥测。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 优先确认网络与宿主位置，试验时先只核对搜索。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持工具、面板、遥测和磁力交接。外部服务和系统启动未运行。

- 已检查：作者 README、包清单、源码路径 plugins/dsh/README.md、plugins/dsh/src/host/resources/index.ts、plugins/dsh/src/client/index.ts、plugins/dsh/src/client/magnet/index.ts、plugins/dsh/src/host/magnet/index.ts、plugins/dsh/src/client/components/AnimeGardenPanel.tsx、plugins/dsh/src/client/api/umami.ts、plugins/dsh/src/client/hooks/useSearchActions.ts、plugins/dsh/src/shared/config.ts、plugins/dsh/src/shared/keepshare.ts、plugins/dsh/src/host/index.ts 及固定范围 inventory；组件：plugins/dsh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 monorepo 内 plugins/dsh，未运行宿主、网页或外部服务。
- 下一步：在许可资源和隔离 profile 核对查询、遥测及 host 的链接交接。

**分析版本**

- **仓库**：[yjl9903/AnimeGarden](https://github.com/yjl9903/AnimeGarden)
- **版本号**：0.1.8（[固定提交 c835344](https://github.com/yjl9903/AnimeGarden/tree/c83534477bfbdc27010d5115447b487b9a7846b3)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 用可见的处理位置标签验证能否降低远程宿主误操作。

在许可资源和隔离 profile 核对查询、遥测及 host 的链接交接。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .ts | source | 56 | 5998 | 4165 | 1380 | — |
| .md | source | 1 | 50 | — | — | 437 |
| .tsx | source | 15 | 2043 | 1719 | 190 | — |

</details>

**活跃度**

[![Issue 未关闭 21](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=21&color=737b86&logo=github)](https://github.com/yjl9903/AnimeGarden/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：区分 DSH 内的搜索、外部播放和启动系统 BT 客户端三种链路。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 留在 DSH 搜索资源有什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

Anime Garden 用户可在会话里让工具返回结构化筛选条件、分页、时间和资源列表。浏览器插件也注册侧栏、主面板及工具卡片。相对在网站另开标签再复制结果，这使同一会话能讨论查询结果并在界面内继续处理链接。它复用上游资源，不能凭界面集成推断目录更完整或播放更可靠。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/dsh/README.md:7-13](https://github.com/yjl9903/AnimeGarden/blob/c83534477bfbdc27010d5115447b487b9a7846b3/plugins/dsh/README.md#L7-L13)

作者描述会话和面板功能

```text
在 DeepSeek Harness 里搜索 Anime Garden 的动画 BT 资源.

- **会话搜索**：让 AI 能搜索 Anime Garden 资源
- **搜索面板**：输入即搜, 可按字幕组和类型筛选动画资源
- **新番周历**：查看当季新番动画, 快速筛选动画资源
- **浮窗播放**：播放链接直接在 DSH 内以浮窗打开, 边看边聊
- **磁力链接打开**：资源行的磁力链接直接唤起系统默认 BT 客户端
```

**依据 2 · 源码核查**：[plugins/dsh/src/host/resources/index.ts:43-57](https://github.com/yjl9903/AnimeGarden/blob/c83534477bfbdc27010d5115447b487b9a7846b3/plugins/dsh/src/host/resources/index.ts#L43-L57)

工具把外部搜索映射成结构化结果

<details>
<summary>查看原文（15行）</summary>

```text
export async function executeSearchResources(
  options: ResolvedOptions,
  rawArgs: unknown,
  exec: ToolRunContext | undefined
): Promise<SearchResult> {
  const args = isRecord(rawArgs) ? rawArgs : {};
  const request = buildFetchOptions(options, args);
  const result = await searchResources(options, request, exec?.signal);

  return {
    filter: mapFilter(result.filter),
    pagination: result.pagination,
    timestamp: result.timestamp.toISOString(),
    resources: result.resources.map(mapResource)
  };
```

</details>

**依据 3 · 源码核查**：[plugins/dsh/src/client/index.ts:95-124](https://github.com/yjl9903/AnimeGarden/blob/c83534477bfbdc27010d5115447b487b9a7846b3/plugins/dsh/src/client/index.ts#L95-L124)

客户端注册结果卡和面板

<details>
<summary>查看原文（30行）</summary>

```text
      if (options.embeddedPlayback) registerPlaybackFeature(ctx, t);

      // Magnet anchors anywhere in the page go to the Host's OS opener; the
      // panel's download action and the conversation card both render them.
      // Disabled keeps the panel's copy behavior and leaves foreign anchors
      // untouched.
      if (options.openMagnet) registerMagnetFeature(ctx, t);

      // The search tool's result card; it reuses both global link behaviors
      // above for its play and magnet actions.
      registerToolView(ctx);

      // The sidebar button; its id doubles as the `main` keyed-slot key.
      ctx.slots.inject('sidebar.panellist', () =>
        ctx.slots.register(
          {
            name: 'sidebar.panellist',
            id: PANEL_ID,
            order: 30,
            label: () => t('panel'),
            locale: NS
          },
          AnimeGardenIcon
        )
      );

      // The page; clicking the sidebar button selects this key through ctx.layout.
      ctx.slots.inject('main', () =>
        ctx.slots.register(
          {
```

</details>

#### 缺口

- 无实际用户流程对照
  **影响**：无法量化少切换窗口的价值
  **进一步探讨**：比较同一资源查找的步骤及正确率

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 磁力操作在哪台机器执行？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

浏览器将磁力 URI 提交到同源宿主路由。路由先调用 DSH 连接拒绝判定，再限制 POST、JSON、请求体和 BitTorrent URI，最终通过宿主 subprocess 以参数数组启动平台开启器，避免在这层拼接 shell。进程启动窗口超时也可能返回成功，所以成功响应只说明交接尝试没有立即报错，不能证明客户端接收或开始下载。Web UI 访问远程宿主时，默认开启的动作发生在宿主机器，未必是用户正在操作的电脑。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh/src/client/magnet/index.ts:45-57](https://github.com/yjl9903/AnimeGarden/blob/c83534477bfbdc27010d5115447b487b9a7846b3/plugins/dsh/src/client/magnet/index.ts#L45-L57)

浏览器发出宿主路由请求

<details>
<summary>查看原文（13行）</summary>

```text
export async function openMagnet(magnet: string): Promise<MagnetOpenResult> {
  try {
    const response = await fetch(OPEN_MAGNET_PATH, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ magnet })
    });
    if (response.ok) return { ok: true, message: '' };

    let message = `HTTP ${String(response.status)}`;
    try {
      message = failureMessage(await response.json(), message);
    } catch {
```

</details>

**依据 2 · 源码核查**：[plugins/dsh/src/host/magnet/index.ts:214-246](https://github.com/yjl9903/AnimeGarden/blob/c83534477bfbdc27010d5115447b487b9a7846b3/plugins/dsh/src/host/magnet/index.ts#L214-L246)

连接拒绝、方法和体积限制

<details>
<summary>查看原文（33行）</summary>

```text
  const rejection = ctx.connection.requestRejection(request);
  if (rejection !== undefined) {
    response.statusCode = rejection;
    response.end();
    return;
  }

  if ((request.method ?? '').toUpperCase() !== 'POST') {
    sendMethodNotAllowed(response);
    return;
  }

  const contentType = String(request.headers['content-type'] ?? '')
    .split(';', 1)[0]
    ?.trim()
    .toLowerCase();
  if (contentType !== 'application/json') {
    sendJson(response, 415, {
      code: 'unsupported-media-type',
      message: 'content-type must be application/json'
    });
    return;
  }

  let text: string | null;
  try {
    text = await readBoundedBody(request);
  } catch {
    sendJson(response, 400, { code: 'bad-request', message: 'request body unreadable' });
    return;
  }
  if (text === null) {
    sendJson(response, 413, { code: 'payload-too-large', message: 'request body is too large' });
```

</details>

**依据 3 · 源码核查**：[plugins/dsh/src/host/magnet/index.ts:107-129](https://github.com/yjl9903/AnimeGarden/blob/c83534477bfbdc27010d5115447b487b9a7846b3/plugins/dsh/src/host/magnet/index.ts#L107-L129)

在宿主执行参数数组和超时返回

<details>
<summary>查看原文（23行）</summary>

```text
async function launchMagnet(ctx: HostWebContext, magnet: string): Promise<void> {
  const launcher = launcherFor(process.platform);
  if (launcher === null) throw new Error(`unsupported platform: ${process.platform}`);

  const executable = await ctx.subprocess.resolveExecutable(launcher.command);
  const handle = ctx.subprocess.spawn({
    argv: [executable, ...launcher.prefix, magnet],
    cwd: process.cwd(),
    stdio: {
      stdin: 'ignore',
      stdout: { maxBytes: OPENER_OUTPUT_BYTES },
      stderr: { maxBytes: OPENER_OUTPUT_BYTES }
    },
    graceMs: OPENER_GRACE_MS
  });

  const outcome = await raceLaunchWindow(handle.done);
  if (outcome === LAUNCH_TIMEOUT) return;
  if (outcome.exitCode === 0) return;

  const stderr = openerStderr(handle);
  const detail = stderr !== '' ? stderr : `exit code ${String(outcome.exitCode)}`;
  throw new Error(`the system could not open the magnet link (${detail})`);
```

</details>

**依据 4 · 源码核查**：[plugins/dsh/src/host/magnet/index.ts:250-267](https://github.com/yjl9903/AnimeGarden/blob/c83534477bfbdc27010d5115447b487b9a7846b3/plugins/dsh/src/host/magnet/index.ts#L250-L267)

输入验证、成功和失败响应

<details>
<summary>查看原文（18行）</summary>

```text
  const magnet = parseMagnetBody(text);
  if (magnet === null) {
    sendJson(response, 400, {
      code: 'invalid-magnet',
      message: 'request body must be JSON with a BitTorrent magnet URI in "magnet"'
    });
    return;
  }

  try {
    await launchMagnet(ctx, magnet);
    sendJson(response, 200, { ok: true });
  } catch (error) {
    sendJson(response, 502, {
      code: 'launch-failed',
      message: error instanceof Error ? error.message : String(error)
    });
  }
```

</details>

#### 缺口

- 未测连接判定和平台默认应用的真实行为
  **影响**：无法确认某个远程部署的访问或交付范围
  **进一步探讨**：用隔离宿主核对合法、非法和无客户端场景

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 面板会产生哪些外部数据请求？

**研究主题**：缺陷与关键质疑

#### 完整回答

面板挂载会触发统计调用。Umami 模块构建屏幕尺寸、语言、标题及固定页面字段，POST 外部端点，失败静默。过滤操作还会发送筛选类型和值。搜索本身需要 Anime Garden 服务，第三方播放地址由磁力 URI 的首段编码生成，使用时资源标识可传给播放服务。关闭磁力或浮窗配置控制这两种 UI 行为，配置对象并未给出统计关闭键。不能从统计发送失败时界面正常推断没有外部数据尝试。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh/src/client/components/AnimeGardenPanel.tsx:101-106](https://github.com/yjl9903/AnimeGarden/blob/c83534477bfbdc27010d5115447b487b9a7846b3/plugins/dsh/src/client/components/AnimeGardenPanel.tsx#L101-L106)

面板挂载发送页面统计

```text

  // One pageview when the plugin panel is entered.
  React.useEffect(() => {
    trackPageview();
  }, []);

```

**依据 2 · 源码核查**：[plugins/dsh/src/client/api/umami.ts:47-88](https://github.com/yjl9903/AnimeGarden/blob/c83534477bfbdc27010d5115447b487b9a7846b3/plugins/dsh/src/client/api/umami.ts#L47-L88)

统计请求字段、网络发送和失败处理

<details>
<summary>查看原文（42行）</summary>

```text
function basePayload(title = ''): Record<string, string> {
  const screen =
    typeof window.screen === 'undefined' ? '' : `${window.screen.width}x${window.screen.height}`;

  return {
    website: UMAMI_WEBSITE,
    screen,
    language: typeof navigator === 'undefined' ? '' : navigator.language,
    title: title || (typeof document === 'undefined' ? '' : document.title),
    hostname: UMAMI_HOSTNAME,
    url: PANEL_URL,
    referrer: '',
    tag: SOURCE_TAG
  };
}

/** POST one collect payload, silently ignoring network/CORS failures. */
function send(body: { type: 'event' | 'pageview'; payload: Record<string, unknown> }): void {
  try {
    if (typeof window === 'undefined') return;
    void fetch(UMAMI_ENDPOINT, {
      method: 'POST',
      keepalive: true,
      headers: {
        'Content-Type': 'application/json',
        'x-umami-website-id': UMAMI_WEBSITE,
        'x-umami-hostname': UMAMI_HOSTNAME
      },
      body: JSON.stringify(body)
    }).catch(() => undefined);
  } catch {
    // Analytics must never break the panel.
  }
}

/**
 * Send one Umami event without ever interrupting the user action that triggered it.
 * @param name - event name, identical to the website's analytics event.
 * @param payload - event fields, identical to the website's payload schema.
 */
export function track<E extends TrackEventName>(name: E, payload: TrackEventMap[E]): void {
  send({ type: 'event', payload: { ...basePayload(), name, data: payload } });
```

</details>

**依据 3 · 源码核查**：[plugins/dsh/src/client/hooks/useSearchActions.ts:31-53](https://github.com/yjl9903/AnimeGarden/blob/c83534477bfbdc27010d5115447b487b9a7846b3/plugins/dsh/src/client/hooks/useSearchActions.ts#L31-L53)

筛选事件携带值

<details>
<summary>查看原文（23行）</summary>

```text
  );

  /** Toolbar fan-sub dropdown: rewrite the `字幕组:` tokens in the search text. */
  const applyFansubs = React.useCallback(
    (next: string[]): void => {
      for (const value of next) {
        if (!fanSubSet.has(value)) {
          track('resources.filter.click', { filterType: 'fansub', value });
        }
      }
      applyQuery(setSearchFilters(store.store.state.input, { fansubs: next }));
    },
    [applyQuery, fanSubSet, store]
  );

  /** Toolbar type dropdown: rewrite the `类型:` tokens in the search text. */
  const applyTypes = React.useCallback(
    (next: string[]): void => {
      for (const value of next) {
        if (!typeSet.has(value)) {
          track('resources.filter.click', { filterType: 'type', value });
        }
      }
```

</details>

**依据 4 · 源码核查**：[plugins/dsh/src/shared/config.ts:44-51](https://github.com/yjl9903/AnimeGarden/blob/c83534477bfbdc27010d5115447b487b9a7846b3/plugins/dsh/src/shared/config.ts#L44-L51)

选项仅规范化两种打开行为

```text
export function normalizePluginOptions(value: unknown): PluginOptions {
  const source: Record<string, unknown> =
    typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {};
  return {
    embeddedPlayback: readBooleanOption(source, 'embeddedPlayback'),
    openMagnet: readBooleanOption(source, 'openMagnet')
  };
}
```

**依据 5 · 源码核查**：[plugins/dsh/src/shared/keepshare.ts:15-18](https://github.com/yjl9903/AnimeGarden/blob/c83534477bfbdc27010d5115447b487b9a7846b3/plugins/dsh/src/shared/keepshare.ts#L15-L18)

从磁力 URI 构造播放地址

```text
export function keepshareUrl(magnet: string): string {
  if (magnet.length === 0) return '';
  return `${KEEPSHARE_PREFIX}${encodeURIComponent(magnet.split('&')[0])}`;
}
```

#### 缺口

- 未捕获实际浏览器和第三方服务日志
  **影响**：不能断言指定部署请求均成功或给出对方保留策略
  **进一步探讨**：用网络面板观察字段和目标域名

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪类用户值得考虑接入？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

已经在 DSH 讨论授权资源、且允许访问外部资源 API 的用户，可先评估会话查找是否比网站更顺。面板、浮窗和磁力要有兼容 Web 服务；磁力路由还注入连接和 subprocess，目标设备需默认客户端。仅评估搜索时，可以关闭浮窗和磁力打开，仍需判断面板遥测是否符合环境要求。若无相关政策或不能接受外连，维持浏览器或本地索引。卸载和重装见作者流程；配置、排障和外部服务代价无本轮测量。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/dsh/README.md:15-46](https://github.com/yjl9903/AnimeGarden/blob/c83534477bfbdc27010d5115447b487b9a7846b3/plugins/dsh/README.md#L15-L46)

安装、配置默认值和卸载重装

<details>
<summary>查看原文（32行）</summary>

````text
## 安装

把下面这句发给你的 DeepSeek Harness:

```text
从 npm 安装最新版 dsh-plugin-animegarden 到当前运行的 DeepSeek Harness
```

也可以手动安装: **Plugins → Add plugin** 输入包名, 或执行 `dsh plugin add dsh-plugin-animegarden`.

安装后, 侧边栏出现 🌸 Anime Garden.

[![dsh-plugin](https://github.com/yjl9903/AnimeGarden/raw/main/assets/dsh-plugin.png)](https://www.npmjs.com/package/dsh-plugin-animegarden)

## 配置

插件行为可以在 Loader 行的 `config` 里开关 (默认值如下), 修改后需要重载插件并刷新页面:

```yaml
config:
  baseURL: https://api.animes.garden
  # KeepShare 播放链接用 DSH 内嵌浮窗打开; false 时保持浏览器新标签页
  embeddedPlayback: true
  # 磁力链接交给系统默认 BT 客户端 (面板按钮与会话卡片)
  openMagnet: true
```

从 npm 安装时, 可在 profile 的 `cordis.patch.yml` 里按 id `animegarden` 覆盖 (匹配的 override 会整体替换 `config`, 记得同时写 `baseURL`).

## 更新

暂时不支持自动更新, 先在 **插件 → 已安装插件** 中卸载当前版本, 再按上面的方式安装最新版.
````

</details>

**依据 2 · 源码核查**：[plugins/dsh/src/host/index.ts:37-48](https://github.com/yjl9903/AnimeGarden/blob/c83534477bfbdc27010d5115447b487b9a7846b3/plugins/dsh/src/host/index.ts#L37-L48)

搜索注册与 Web 能力依赖分开

<details>
<summary>查看原文（12行）</summary>

```text
export function registerAnimeGardenTools(
  ctx: PluginToolContext,
  options: ResolvedOptions
): () => void {
  const disposer = registerSearchResourcesTool(ctx, options);

  ctx.inject?.(['webServer', 'connection', 'subprocess'], (web) => {
    registerOptionsInjection(web, options);
    if (options.openMagnet) registerOpenMagnetRoute(web);
  });

  return disposer;
```

</details>

**依据 3 · 源码核查**：[plugins/dsh/src/host/resources/index.ts:71-83](https://github.com/yjl9903/AnimeGarden/blob/c83534477bfbdc27010d5115447b487b9a7846b3/plugins/dsh/src/host/resources/index.ts#L71-L83)

工具声明和宿主超时

<details>
<summary>查看原文（13行）</summary>

```text
  const definition: ToolDefinition<SearchResult> = {
    name: SEARCH_RESOURCES_TOOL_NAME,
    description: TOOL_DESCRIPTION,
    parameters: PARAMETERS_SCHEMA,
    output: { schema: OUTPUT_SCHEMA, render: renderMarkdown },
    // Backstop for the harness timeout policy; `searchResources` enforces the
    // tighter 15 s budget cooperatively so a slow API yields a readable error.
    timeoutMs: REQUEST_TIMEOUT_MS + 5_000,
    isConcurrencySafe: () => true,
    execute: (args, exec) => executeSearchResources(options, args, exec)
  };

  return ctx.tools.register(definition);
```

</details>

#### 缺口

- 未运行宿主和外部 API
  **影响**：不能确定发布包兼容、耗时和目标资源可用性
  **进一步探讨**：先用明确可用的授权资源测试搜索并核对出站请求

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 明确标出链接实际处理位置是否有用？

**研究主题**：新假设与验证

#### 完整回答

现有路由提示发起成功或失败，可测试在按钮旁明确标出宿主处理、外部播放或复制三种交接，是否降低远程 profile 上的误操作。让同一组用户在本地和远程场景选择目标设备，记录错误地点启动、重复点击和完成时间。若提示不能减少错误且增加寻找按钮时间，则否定。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh/src/host/index.ts:41-46](https://github.com/yjl9903/AnimeGarden/blob/c83534477bfbdc27010d5115447b487b9a7846b3/plugins/dsh/src/host/index.ts#L41-L46)

宿主侧可打开链接

```text
  const disposer = registerSearchResourcesTool(ctx, options);

  ctx.inject?.(['webServer', 'connection', 'subprocess'], (web) => {
    registerOptionsInjection(web, options);
    if (options.openMagnet) registerOpenMagnetRoute(web);
  });
```

**依据 2 · 源码核查**：[plugins/dsh/src/host/magnet/index.ts:107-129](https://github.com/yjl9903/AnimeGarden/blob/c83534477bfbdc27010d5115447b487b9a7846b3/plugins/dsh/src/host/magnet/index.ts#L107-L129)

启动结果只覆盖交接窗口

<details>
<summary>查看原文（23行）</summary>

```text
async function launchMagnet(ctx: HostWebContext, magnet: string): Promise<void> {
  const launcher = launcherFor(process.platform);
  if (launcher === null) throw new Error(`unsupported platform: ${process.platform}`);

  const executable = await ctx.subprocess.resolveExecutable(launcher.command);
  const handle = ctx.subprocess.spawn({
    argv: [executable, ...launcher.prefix, magnet],
    cwd: process.cwd(),
    stdio: {
      stdin: 'ignore',
      stdout: { maxBytes: OPENER_OUTPUT_BYTES },
      stderr: { maxBytes: OPENER_OUTPUT_BYTES }
    },
    graceMs: OPENER_GRACE_MS
  });

  const outcome = await raceLaunchWindow(handle.done);
  if (outcome === LAUNCH_TIMEOUT) return;
  if (outcome.exitCode === 0) return;

  const stderr = openerStderr(handle);
  const detail = stderr !== '' ? stderr : `exit code ${String(outcome.exitCode)}`;
  throw new Error(`the system could not open the magnet link (${detail})`);
```

</details>

#### 缺口

- 未观察真实误操作
  **影响**：只能作为待验证界面假设
  **进一步探讨**：用受控宿主和虚拟开启器做同任务对照

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
