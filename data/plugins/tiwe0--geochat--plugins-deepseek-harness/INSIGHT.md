# GeoChat 画布

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[288b3b1](https://github.com/tiwe0/GeoChat/tree/288b3b15be39312b2baf771eaf015f67b9f841a2/plugins/deepseek-harness)

<!-- BEGIN META -->
[![GitHub ★ 125](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=125&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/tiwe0/GeoChat)
<!-- END META -->

> **功能**：让 DSH 模型操作会话右侧的 GeoGebra 画布

> **亮点**：[Q01](#research-q01) 在同一会话内执行并检查对象。

> **主要限制**：[Q03](#research-q03) 回执失败后需检查真实 Applet 状态。

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
  - [Q01 · 可复核的用户交付是什么？](#detail-section-11)
  - [Q02 · 会话和画布怎样对应？](#detail-section-12)
  - [Q03 · 超时能否保证画布没改？](#detail-section-13)
  - [Q04 · 采用及退出条件？](#detail-section-14)
  - [Q05 · 怎样比较收益和失败？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户希望在 DSH 内构建可操作数学图。

把表达式手工复制到 GeoGebra。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 把表达式手工复制到 GeoGebra。 | 可直接比较 | 保留人工步骤 |
| GeoChat 画布 | 在同一会话内执行并检查对象。 | 回执失败后需检查真实 Applet 状态。 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 宿主 | 必需 | 宿主工具经原生会话流操作同侧栏的 GeoGebra Applet。 | 用隔离 profile 确认 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户希望在 DSH 内构建可操作数学图。 | 保留原流程 |
| 试验 | 宿主工具经原生会话流操作同侧栏的 GeoGebra Applet。 | 观察固定版本 |
| 复核 | 使用固定 Web 版本对照双会话与断流。 | 比对任务结果 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 安装与运行成本未知 | 配置准备耗时未知 | 视 profile 而定 |
| 持续 | 持续运行成本未知 | 日常维护耗时未知 | 视任务频率而定 |
| 恢复 | 回退成本未知 | 恢复原流程耗时未知 | 视已有数据而定 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 根据自然语言构造并检查可操作的几何对象 | 常见构图可以减少窗口切换而维持数学准确。 | 使用固定 Web 版本对照双会话与断流。 |

> **思考**：[Q03](#research-q03) 回执失败后需检查真实 Applet 状态。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 在同一会话内执行并检查对象。

Broker 匹配回执，打开器合并取消和 deadline。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 回执失败后需检查真实 Applet 状态。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 使用固定 Web 版本对照双会话与断流。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的根据自然语言构造并检查可操作的几何对象。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 plugins/deepseek-harness/README.md、plugins/deepseek-harness/src/index.ts、plugins/deepseek-harness/src/native-broker.ts、plugins/deepseek-harness/src/canvas-opener.ts 及固定范围 inventory；组件：plugins/deepseek-harness。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的根据自然语言构造并检查可操作的几何对象。未执行目标代码或实际宿主验证。
- 下一步：保存对象清单、操作前后状态和回执。

**分析版本**

- **仓库**：[tiwe0/GeoChat](https://github.com/tiwe0/GeoChat)
- **版本号**：0.1.5（[固定提交 288b3b1](https://github.com/tiwe0/GeoChat/tree/288b3b15be39312b2baf771eaf015f67b9f841a2)）
- **版本日期**：2026-10-16（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 常见构图可以减少窗口切换而维持数学准确。

保存对象清单、操作前后状态和回执。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 452 | — | — | 12998 |
| .ts | source | 14 | 2771 | 2568 | 15 | — |
| .tsx | source | 3 | 339 | 306 | 1 | — |
| .mjs | source | 2 | 445 | 422 | 4 | — |
| .ts | test | 11 | 1957 | 1800 | 6 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/tiwe0/GeoChat/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/tiwe0/GeoChat/issues?q=is%3Aissue+created%3A2026-10-06T03%3A59%3A20.742Z..2026-11-05T03%3A59%3A20.742Z)

暂未获取：近30天关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：根据自然语言构造并检查可操作的几何对象

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 可复核的用户交付是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

教学或探索时，用自然语言构造曲线和交点并在同一会话可视检查。比让模型仅输出表达式后手工复制，工具能在 Applet 内执行并读取对象。最小验收是两曲线、交点坐标与拖动后的关系可从实际对象检验。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/deepseek-harness/README.md:63-77](https://github.com/tiwe0/GeoChat/blob/288b3b15be39312b2baf771eaf015f67b9f841a2/plugins/deepseek-harness/README.md#L63-L77)

示例和预期工具序列

<details>
<summary>查看原文（15行）</summary>

```text
## 使用示例

Harness 需要启用原生 skills 服务及其 `skill` 工具（标准 profile 中提供），才能按需读取技能。先读取 `geochat` 技能，再开始作图。

可以向 Harness 提问：

> 在 GeoChat 画布上绘制 f(x)=x² 和 y=2x+3，求交点并标注。保留已有对象，完成后检查交点是否同时位于两条曲线上。

> 用 If 建立分段函数，再用 Sequence 生成采样点，说明定义域边界。先查语法，最后检查实际对象。

> 绘制单位圆上的点，以滑块参数驱动一圈动画，给出播放、暂停与重置方式。

典型调用顺序：`geochat_open_canvas` → `geochat_getCanvasContext` → `geochat_search_commands` → `geochat_executeGeoGebraCommands` → `geochat_inspectGeoGebraObjects`。

`geochat_open_canvas` 无参数，自动使用工具所属 session，展开并选中右侧画布，等 Applet 就绪后才返回 `opened: true, ready: true`。重复调用只展开/聚焦，不清空已有构造。它不会切换到另一段对话；当前会话没有连接中的界面，或同时显示在多个窗口时会明确报错，不广播打开、不替换画布。超时或取消后不保留等待下次重连的打开请求。
```

</details>

**依据 2 · 源码核查**：[plugins/deepseek-harness/src/index.ts:141-189](https://github.com/tiwe0/GeoChat/blob/288b3b15be39312b2baf771eaf015f67b9f841a2/plugins/deepseek-harness/src/index.ts#L141-L189)

注册实际画布操作和辅助工具

<details>
<summary>查看原文（49行）</summary>

```text
export function registerCanvasTools(
  ctx: Context,
  broker: NativeCanvasBroker,
  includeSkills: boolean,
  skillsDirectory?: string | URL,
  opener: CanvasOpener = new CanvasOpener(broker)
): void {
  ctx.effect(() => () => opener.dispose());
  const skills = includeSkills ? loadBundledSkills({ skillsDirectory }) : [];
  for (const tool of CANVAS_TOOLS) {
    ctx.tools.register(
      define(
        "publicName" in tool ? tool.publicName : `geochat_${tool.name}`,
        tool.description,
        {
          type: "object",
          additionalProperties: false,
          required: tool.required,
          properties: tool.properties
        },
        async (args, exec) => {
          if (tool.name === "executeGeoGebraCommands") validateCanvasCommands(args.commands as string[]);
          const value = await broker.run(sessionId(exec), tool.name, args, exec.signal);
          return projectImage(ctx, value, exec.signal);
        }
      )
    );
  }
  ctx.tools.register(
    define(
      "geochat_open_canvas",
      "返回：opened=true 及 connected、ready、busy、queued 状态，成功返回前已等待当前会话 Applet 就绪。使用：作图或读取画布前，主动展开并选中当前 Harness 会话右侧 GeoChat 画布；无参数，重复调用保留已有构造。边界：不创建数学对象、不清空画布、不切换其他会话，也不返回截图；没有连接中的当前会话界面、存在多窗口歧义或加载超时时报错。画布只在页面内存中保留，不保证关闭或刷新后恢复。",
      { type: "object", additionalProperties: false, properties: {} },
      async (_args, exec) => opener.open(sessionId(exec), exec.signal)
    )
  );
  ctx.tools.register(
    define(
      "geochat_status",
      "返回：当前会话画布的 connected、ready、busy 和 queued 状态快照。使用：诊断是否连接、就绪或正在处理请求；未连接时先调用 geochat_open_canvas。边界：只读状态，不主动打开或修复连接；ready 不证明任何构造或视觉效果正确，也不表示动画持续播放，需用 geochat_inspectGeoGebraObjects/geochat_getValue 和 geochat_capture_canvas 分别验证。",
      {
        type: "object",
        additionalProperties: false,
        properties: {}
      },
      async (_args, exec) => broker.status(sessionId(exec))
    )
  );
  ctx.tools.register(
```

</details>

#### 缺口

- 需要区分数学结果与图像外观。
  **影响**：减少上下文切换并可核对对象。
  **进一步探讨**：选交点有闭式解的任务。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 会话和画布怎样对应？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

工具取得会话身份，Native Remote 将命令与客户端匹配。Broker 在分派状态下按回执 ID 接收响应，排队有上限。打开器将请求与取消、生命周期及 deadline 组合。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/deepseek-harness/README.md:79-88](https://github.com/tiwe0/GeoChat/blob/288b3b15be39312b2baf771eaf015f67b9f841a2/plugins/deepseek-harness/README.md#L79-L88)

作者描述官方 Remote 和会话对应

<details>
<summary>查看原文（10行）</summary>

```text
## 原生调用架构

插件不自建 HTTP/MCP 工具通道，也不使用 Host → Client 函数 RPC；它使用 Harness 官方原生 Remote 的 Typert 双向流把 Host 工具与当前 session 的 Canvas Client 连接起来。官方 carrier 的内部传输由 Harness 管理，不在本文中假定为无 HTTP/WS：

1. ToolRuntime 从 `exec.agent.id` 取得 `SessionId`，并通过 agent lookup 校验该 session。
2. Client 根层先为屏幕上的 session 建立轻量 `connectUi` 控制订阅，不依赖 Applet 挂载；主动打开工具通过此流调用 Harness 的 `sidebarRight.openTab`。Applet 就绪后才建立 `connect` 画布流，Host 向流中发送带 correlation id 的命令。
3. Client 内的 `GeoGebraController` 直接执行命令，并通过 `clientHandle.send(reply)` 返回结果。
4. Host 通过 `ctx.invocation.uplink()` 读取匹配回复。取消、deadline、stream 断开或 Client 卸载会结束 pending 调用；迟到回复会被丢弃。

命令和回复都按经过验证的 `SessionId` 隔离。缺少 agent、lookup 失败、没有匹配 Client 或 session 不一致时，工具调用直接失败，不回退到共享画布或其他传输通道。
```

</details>

**依据 2 · 源码核查**：[plugins/deepseek-harness/src/native-broker.ts:304-324](https://github.com/tiwe0/GeoChat/blob/288b3b15be39312b2baf771eaf015f67b9f841a2/plugins/deepseek-harness/src/native-broker.ts#L304-L324)

仅接收匹配的已分派响应

<details>
<summary>查看原文（21行）</summary>

```text
  acceptReply(lease: Lease, reply: NativeCanvasReply): boolean {
    const state = this.currentState(lease);
    const call = state?.active;
    if (!state || !call || call.state !== "dispatched" || call.id !== reply.id) return false;

    if (reply.ok) {
      let encoded: { size: number; json: string };
      try {
        encoded = jsonSize(reply.result, "result");
      } catch (error) {
        this.failProtocol(state, call, error as Error);
        return false;
      }
      if (encoded.size > this.maxResultBytes) {
        this.failProtocol(state, call, new Error(`GeoChat native canvas result exceeds ${this.maxResultBytes} bytes.`));
        return false;
      }
      this.settle(call, () => call.resolve(JSON.parse(encoded.json)));
    } else {
      this.settle(call, () =>
        call.reject(new Error(`GeoChat canvas operation failed. ${safeClientError(reply.error)}`))
```

</details>

**依据 3 · 源码核查**：[plugins/deepseek-harness/src/canvas-opener.ts:44-52](https://github.com/tiwe0/GeoChat/blob/288b3b15be39312b2baf771eaf015f67b9f841a2/plugins/deepseek-harness/src/canvas-opener.ts#L44-L52)

组合停止条件

```text
  async open(sessionId: string, signal?: AbortSignal): Promise<NativeCanvasStatus & { opened: true }> {
    this.assertLive();
    signal?.throwIfAborted();
    const deadline = AbortSignal.timeout(this.timeoutMs);
    const combined = AbortSignal.any([this.lifetime.signal, deadline, ...(signal ? [signal] : [])]);
    const client = this.target(sessionId);
    const check = () => {
      combined.throwIfAborted();
      if (this.target(sessionId) !== client || !this.requests.status(client.id).connected) {
```

#### 缺口

- 源码只说明预期链路。
  **影响**：不同会话可并行而不混用对象。
  **进一步探讨**：两个 session 构造同名对象并比对。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 超时能否保证画布没改？

**研究主题**：缺陷与关键质疑

#### 完整回答

Broker 丢弃不匹配回复可避免误配，但响应缺失无法说明浏览器 Applet 在断开前是否执行。自动重试有可能重复效果，超时后应先检查对象。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/deepseek-harness/src/native-broker.ts:304-324](https://github.com/tiwe0/GeoChat/blob/288b3b15be39312b2baf771eaf015f67b9f841a2/plugins/deepseek-harness/src/native-broker.ts#L304-L324)

仅接收当前已分派调用的回执

<details>
<summary>查看原文（21行）</summary>

```text
  acceptReply(lease: Lease, reply: NativeCanvasReply): boolean {
    const state = this.currentState(lease);
    const call = state?.active;
    if (!state || !call || call.state !== "dispatched" || call.id !== reply.id) return false;

    if (reply.ok) {
      let encoded: { size: number; json: string };
      try {
        encoded = jsonSize(reply.result, "result");
      } catch (error) {
        this.failProtocol(state, call, error as Error);
        return false;
      }
      if (encoded.size > this.maxResultBytes) {
        this.failProtocol(state, call, new Error(`GeoChat native canvas result exceeds ${this.maxResultBytes} bytes.`));
        return false;
      }
      this.settle(call, () => call.resolve(JSON.parse(encoded.json)));
    } else {
      this.settle(call, () =>
        call.reject(new Error(`GeoChat canvas operation failed. ${safeClientError(reply.error)}`))
```

</details>

**依据 2 · 源码核查**：[plugins/deepseek-harness/src/canvas-opener.ts:82-90](https://github.com/tiwe0/GeoChat/blob/288b3b15be39312b2baf771eaf015f67b9f841a2/plugins/deepseek-harness/src/canvas-opener.ts#L82-L90)

打开超时返回错误

```text
          return { opened: true, ...status };
        }
        await delay(20, undefined, { signal: combined });
      }
    } catch (error) {
      if (deadline.aborted && !signal?.aborted && !this.lifetime.signal.aborted) {
        throw new Error("GeoChat canvas was not ready before the opening deadline. Check the canvas loading state.");
      }
      throw error;
```

#### 缺口

- 网络断开和客户端执行的竞争未重现。
  **影响**：不能用回执错误代替对象状态。
  **进一步探讨**：执行后断流，再读取当前对象。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用及退出条件？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

只评估此仓库 DSH 子目录。作者声明 Web rc.2 和 Node 24+，Release 包独立，Applet 资源随包。安装前核对版本和散列，记录冷启动、插件体积与模型成本。退出前保存需要的构造，卸载并重启测试原 profile。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/deepseek-harness/README.md:5-12](https://github.com/tiwe0/GeoChat/blob/288b3b15be39312b2baf771eaf015f67b9f841a2/plugins/deepseek-harness/README.md#L5-L12)

作者列出宿主与 Applet 分发范围

```text
## 当前支持范围

- **目标版本：DeepSeek Harness `0.2.0-rc.2`，Node.js 24+。** SDK 使用明确版本；部分 SDK 的 npm `latest` 仍指向旧版本，不要省略版本安装。
- 20 个工具：17 个画布工具、主动打开画布、Applet 状态和离线命令搜索。没有异步动作队列或 `wait_action`。
- 55 个内置数学技能投射为 Harness 原生 `geochat-*` 技能，另有入口技能 `geochat`。命令参考直接复用仓库实现，构建时打包，不依赖源码路径。
- Harness Web 原生右侧“GeoChat 画布”页签直接挂载一个 Applet；不添加聊天框、工具栏、设置或第二块画布。
- Applet 资源随插件离线打包；不依赖 GeoChat 桌面、MCP、外部 CDN 或模型 Key。
- 不暴露数据库、历史会话、密钥、SQL、任意调试工具或内部 `__restoreCanvasXml`。
```

**依据 2 · 作者声明**：[plugins/deepseek-harness/README.md:22-47](https://github.com/tiwe0/GeoChat/blob/288b3b15be39312b2baf771eaf015f67b9f841a2/plugins/deepseek-harness/README.md#L22-L47)

作者给出 release、重启、内存画布和 Web 限制

<details>
<summary>查看原文（26行）</summary>

````text
## 下载已构建版本

[下载 dsh-geochat-plugin 0.1.5](https://github.com/tiwe0/GeoChat/releases/download/dsh-plugin-v0.1.5/dsh-geochat-plugin-0.1.5.tgz)，并在 Release 中核对 SHA-256 校验文件。该版本只更新 Harness 插件，不替换 GeoChat 桌面版。

```sh
dsh plugin --profile web add https://github.com/tiwe0/GeoChat/releases/download/dsh-plugin-v0.1.5/dsh-geochat-plugin-0.1.5.tgz
```

安装后重新启动对应 Harness profile。重启会清空当前内存画布，请先保存需要保留的构造。适用版本和载体限制见上文。

![GeoChat 在 DeepSeek Harness 中展示太阳系画布](https://raw.githubusercontent.com/tiwe0/GeoChat/dsh-plugin-v0.1.5/docs/media/geochat-dsh-plugin.png)

## 构建与安装

需要 Node.js 24 或更高版本。以下命令以 Harness `0.2.0-rc.2` 的公开 CLI 语法为准，并安装到 Web profile：

```sh
cd /absolute/path/to/GeoChat/plugins/deepseek-harness
node --version
npm ci
npm run build
npm pack
dsh plugin --profile web add /absolute/path/to/GeoChat/plugins/deepseek-harness/dsh-geochat-plugin-0.1.5.tgz
```

`node --version` 应显示 `v24` 或更高版本。`npm pack` 会执行 `prepack`，因此会再次运行完整 `npm run check`。若使用自定义 Web profile，将命令中的 `web` 替换为对应 profile 名称。当前插件只支持 Harness Web 载体；不要把该安装说明用于 Desktop carrier。
````

</details>

#### 缺口

- 真实启动及保存兼容性未测。
  **影响**：首次加载和退出成本由运行环境决定。
  **进一步探讨**：固定包和同版宿主独立试用。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样比较收益和失败？

**研究主题**：新假设与验证

#### 完整回答

用同一曲线交点任务比较手工 GeoGebra 和插件，记录准确性、耗时、撤销和交付对象。增加断流、重复打开和双窗口。同会话以外对象被改变、结果错误或超时后无法确认效果时，当前配置不适合自动操作。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/deepseek-harness/README.md:69-88](https://github.com/tiwe0/GeoChat/blob/288b3b15be39312b2baf771eaf015f67b9f841a2/plugins/deepseek-harness/README.md#L69-L88)

有复现任务和多窗口边界

<details>
<summary>查看原文（20行）</summary>

```text
> 在 GeoChat 画布上绘制 f(x)=x² 和 y=2x+3，求交点并标注。保留已有对象，完成后检查交点是否同时位于两条曲线上。

> 用 If 建立分段函数，再用 Sequence 生成采样点，说明定义域边界。先查语法，最后检查实际对象。

> 绘制单位圆上的点，以滑块参数驱动一圈动画，给出播放、暂停与重置方式。

典型调用顺序：`geochat_open_canvas` → `geochat_getCanvasContext` → `geochat_search_commands` → `geochat_executeGeoGebraCommands` → `geochat_inspectGeoGebraObjects`。

`geochat_open_canvas` 无参数，自动使用工具所属 session，展开并选中右侧画布，等 Applet 就绪后才返回 `opened: true, ready: true`。重复调用只展开/聚焦，不清空已有构造。它不会切换到另一段对话；当前会话没有连接中的界面，或同时显示在多个窗口时会明确报错，不广播打开、不替换画布。超时或取消后不保留等待下次重连的打开请求。

## 原生调用架构

插件不自建 HTTP/MCP 工具通道，也不使用 Host → Client 函数 RPC；它使用 Harness 官方原生 Remote 的 Typert 双向流把 Host 工具与当前 session 的 Canvas Client 连接起来。官方 carrier 的内部传输由 Harness 管理，不在本文中假定为无 HTTP/WS：

1. ToolRuntime 从 `exec.agent.id` 取得 `SessionId`，并通过 agent lookup 校验该 session。
2. Client 根层先为屏幕上的 session 建立轻量 `connectUi` 控制订阅，不依赖 Applet 挂载；主动打开工具通过此流调用 Harness 的 `sidebarRight.openTab`。Applet 就绪后才建立 `connect` 画布流，Host 向流中发送带 correlation id 的命令。
3. Client 内的 `GeoGebraController` 直接执行命令，并通过 `clientHandle.send(reply)` 返回结果。
4. Host 通过 `ctx.invocation.uplink()` 读取匹配回复。取消、deadline、stream 断开或 Client 卸载会结束 pending 调用；迟到回复会被丢弃。

命令和回复都按经过验证的 `SessionId` 隔离。缺少 agent、lookup 失败、没有匹配 Client 或 session 不一致时，工具调用直接失败，不回退到共享画布或其他传输通道。
```

</details>

**依据 2 · 源码核查**：[plugins/deepseek-harness/src/native-broker.ts:304-324](https://github.com/tiwe0/GeoChat/blob/288b3b15be39312b2baf771eaf015f67b9f841a2/plugins/deepseek-harness/src/native-broker.ts#L304-L324)

回执条件可测试

<details>
<summary>查看原文（21行）</summary>

```text
  acceptReply(lease: Lease, reply: NativeCanvasReply): boolean {
    const state = this.currentState(lease);
    const call = state?.active;
    if (!state || !call || call.state !== "dispatched" || call.id !== reply.id) return false;

    if (reply.ok) {
      let encoded: { size: number; json: string };
      try {
        encoded = jsonSize(reply.result, "result");
      } catch (error) {
        this.failProtocol(state, call, error as Error);
        return false;
      }
      if (encoded.size > this.maxResultBytes) {
        this.failProtocol(state, call, new Error(`GeoChat native canvas result exceeds ${this.maxResultBytes} bytes.`));
        return false;
      }
      this.settle(call, () => call.resolve(JSON.parse(encoded.json)));
    } else {
      this.settle(call, () =>
        call.reject(new Error(`GeoChat canvas operation failed. ${safeClientError(reply.error)}`))
```

</details>

#### 缺口

- 未运行目标组件。
  **影响**：将模型数学能力、界面可用性和会话隔离分别验收。
  **进一步探讨**：保存对象清单、操作前后状态和回执。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
