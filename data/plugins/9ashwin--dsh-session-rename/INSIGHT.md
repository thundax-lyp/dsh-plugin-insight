# dsh-session-rename

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[f073bfa](https://github.com/9Ashwin/dsh-session-rename/tree/f073bfa1fa7e59832df5efacb5b94ee44749326c)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：向模型提供 rename_session 工具，显式设置当前或已加载会话标题。

> **核心亮点**：用零运行时包依赖的 Host 工具把宿主改名 API 暴露给模型。详见[Q01](#research-q01)、[Q04](#research-q04)。

> **风险与缺陷**：可指定任一已加载 session_id，而插件只校验非空，目标授权依赖未审宿主。详见[Q03](#research-q03)。

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
  - [Q01 · 工具填补什么缺口，会自动生成标题吗？](#detail-section-11)
  - [Q02 · 显式标题写入链和宿主依赖是什么？](#detail-section-12)
  - [Q03 · 传入其他 session_id 时有哪些边界？](#detail-section-13)
  - [Q04 · 无官方包依赖的实现代价和标题校验是什么？](#detail-section-14)
  - [Q05 · 什么使用方式能让标题变化可控？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：按需求编号为 DSH 会话命名，便于在历史列表定位。

宿主有标题 API，但模型没有可见改名工具；本包增加薄封装。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 模型工具 | 设置会话标题 | 仅已加载目标、授权未核 |

**流程与依赖**

| 服务 | 用途 | 缺失时 |
| --- | --- | --- |
| tools | 注册模型工具 | 插件无法加载 |
| agents | 查已加载会话 | 无指定目标 |
| sessionTitle | 实际改名 | 调用报错 |

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 规则 | 确定需求 ID | 标题可追溯 |
| 调用 | 默认当前会话 | 无误指目标 |
| 验证 | 重载/多用户测试 | 权限与标题正确 |

**效果与成本**

| 项目 | 边界 |
| --- | --- |
| 集成 | DSH tools/agents/sessionTitle |
| 治理 | 模型发起、可指定已加载会话 |
| 测试 | 标题持久性与权限 |

| 能力 | 状态 |
| --- | --- |
| 当前改名 | 源码有路径 |
| 指定会话 | 仅已加载 |
| 标题钉住 | 作者描述的宿主语义 |

> **思考**：可指定任一已加载 session_id，而插件只校验非空，目标授权依赖未审宿主。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：用零运行时包依赖的 Host 工具把宿主改名 API 暴露给模型。详见[Q01](#research-q01)、[Q04](#research-q04)。

用零运行时包依赖的 Host 工具把宿主改名 API 暴露给模型。详见[Q01](#research-q01)、[Q04](#research-q04)。

tools.register 手写参数/结果 schema、执行校验；动态获取 sessionTitle 服务；isConcurrencySafe:false。

<a id="detail-section-5"></a>

### 1.4 主要限制

可指定任一已加载 session_id，而插件只校验非空，目标授权依赖未审宿主。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先仅省略 session_id 命名当前会话；多用户前核宿主权限。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码实现模型显式改名；跨会话 session_id 无插件级权限校验，持久化/钉住依赖宿主。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 SHA 静态审阅 README、package、index.js；未运行目标插件/宿主。
- 下一步：固定 SHA 隔离环境核模型工具、标题事件、重载持久性、冷会话错误与跨用户权限。

**分析版本**

- **仓库**：[9Ashwin/dsh-session-rename](https://github.com/9Ashwin/dsh-session-rename)
- **版本号**：0.1.0（[固定提交 f073bfa](https://github.com/9Ashwin/dsh-session-rename/tree/f073bfa1fa7e59832df5efacb5b94ee44749326c)）
- **版本日期**：2026-09-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

默认仅当前会话、跨会话改名显式授权能缩小误操作面；尚未实现。详见[Q05](#research-q05)。

固定 SHA 隔离环境核模型工具、标题事件、重载持久性、冷会话错误与跨用户权限。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 117 | 78 | 31 | — |
| .md | source | 1 | 95 | — | — | 918 |
| .mjs | source | 1 | 131 | 104 | 13 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/9Ashwin/dsh-session-rename/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/9Ashwin/dsh-session-rename/issues?q=is%3Aissue+created%3A2026-09-22T06%3A26%3A33.051Z..2026-10-22T06%3A26%3A33.051Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/9Ashwin/dsh-session-rename/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A26%3A33.051Z..2026-10-22T06%3A26%3A33.051Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**核模型改名工具的目标作用域与宿主标题语义。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 工具填补什么缺口，会自动生成标题吗？

**研究主题：**场景与需求、贡献与相对优势

#### 完整回答

插件注册模型可见 rename_session 工具，title 必填；模型决定何时调用与标题内容，插件没有自动总结或触发。未给 session_id 时使用当前执行 agent 的会话。它补的是模型发起显式改名入口，而不是 UI 改名卡片或自动标题模型。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-24](https://github.com/9Ashwin/dsh-session-rename/blob/f073bfa1fa7e59832df5efacb5b94ee44749326c/README.md#L3-L24)

作者定位及标题语义。

<details>
<summary>查看原文（22行）</summary>

```text
A [DSH (DeepSeek Harness)](https://github.com/deepseek-ai/deepseek-harness) plugin that gives the **model** a `rename_session` tool — so the agent can retitle a session from inside the conversation.

一个 DSH 插件：给**模型**一个 `rename_session` 工具，让 agent 在对话中直接重命名当前会话。

## Why

DSH 的会话标题有三个来源——首条用户消息的确定性回退、可选的 LLM 生成 provider、显式重命名——但**只有 Host 侧 API**（`ctx.sessionTitle.rename(session, title)`）和线级的 `session.rename`。内置的 Web 客户端里没有改名入口，也没有任何模型可见的工具。这个插件补上模型这一侧。

它不做自动总结。要不要改名、改成什么，由模型按你的规则决定——典型用法是在 `AGENTS.md` 里约定：**开始一个新需求时，把需求 id 写进会话标题**。

## The tool

`rename_session`

| 参数 | 必填 | 说明 |
|---|---|---|
| `title` | 是 | 新标题。归一化后必须含可见字符。 |
| `session_id` | 否 | 目标会话 id。**省略即重命名当前会话**——日常用法。 |

返回 `{ session_id, title, seq }`（格式化 JSON 文本）。

标题语义由 `@deepseek-ai/dsh-session-title` 决定：写入一条 `source.kind === 'user'` 的 `session/title` 事件，**钉住**标题——进行中的自动生成被取代，后续用户消息也不再触发自动修订。标题只进会话日志，**绝不进入模型输入**。
```

</details>

**依据 2 · 源码核查**：[index.js:25-46](https://github.com/9Ashwin/dsh-session-rename/blob/f073bfa1fa7e59832df5efacb5b94ee44749326c/index.js#L25-L46)

模型工具定义与参数。

<details>
<summary>查看原文（22行）</summary>

```text
export function apply(ctx) {
  ctx.tools.register({
    name: 'rename_session',
    description:
      'Rename a session by setting an explicit title. A user title pins the session: in-flight automatic title generation is superseded and later user messages no longer revise it. Call this when the user asks to rename the conversation, or when the work has moved to a new task and the title should name it — for example naming the session after a requirement, issue, or ticket id ("PRD-042 ..."). Omit session_id to rename the session you are running in.',
    parameters: {
      type: 'object',
      additionalProperties: false,
      properties: {
        title: {
          type: 'string',
          description:
            'New session title. Must contain visible characters after normalization. Keep it short and descriptive; include the work item id when the session is about one.',
        },
        session_id: {
          type: 'string',
          description:
            'Target session id. Omit to rename the current session. A non-current session must already be loaded, otherwise the call fails.',
        },
      },
      required: ['title'],
    },
```

</details>

**依据 3 · 源码核查**：[index.js:75-94](https://github.com/9Ashwin/dsh-session-rename/blob/f073bfa1fa7e59832df5efacb5b94ee44749326c/index.js#L75-L94)

当前会话缺省处理。

<details>
<summary>查看原文（20行）</summary>

```text
    async execute(args, exec) {
      const input = args !== null && typeof args === 'object' ? args : {}

      const title = input.title
      if (typeof title !== 'string' || title.trim() === '') {
        throw new Error('rename_session: title is required and must be a non-empty string')
      }

      const targetId = input.session_id
      if (targetId !== undefined && (typeof targetId !== 'string' || targetId.trim() === '')) {
        throw new Error('rename_session: session_id must be a non-empty string when provided')
      }

      let session
      if (targetId === undefined) {
        if (exec.agent === undefined) {
          throw new Error('rename_session: no session_id was given and this call has no owning session')
        }
        session = exec.agent.session
      } else {
```

</details>

#### 缺口

- 未运行实际模型调用。
  **影响：**调用频率和标题质量未知。
  **进一步探讨：**隔离会话按工作项 ID 提示测试。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 显式标题写入链和宿主依赖是什么？

**研究主题：**功能与机制、依赖、兼容与流程

#### 完整回答

工具从 exec.agent 或 ctx.agents.get(id) 取会话，再动态获取 sessionTitle 服务并调用 rename。返回 session_id/title/eventSeq。README 称宿主服务写 source.kind=user 的 session/title 事件并钉住标题；这部分属于宿主语义，插件本身没有实现持久化。仅 tools、agents 是强制 inject，sessionTitle 缺失时执行报错。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:18-19](https://github.com/9Ashwin/dsh-session-rename/blob/f073bfa1fa7e59832df5efacb5b94ee44749326c/index.js#L18-L19)

强制服务。

```text
/** 必需服务：工具注册表与会话注册表。 */
export const inject = ['tools', 'agents']
```

**依据 2 · 源码核查**：[index.js:88-115](https://github.com/9Ashwin/dsh-session-rename/blob/f073bfa1fa7e59832df5efacb5b94ee44749326c/index.js#L88-L115)

目标查询、服务调用和结果。

<details>
<summary>查看原文（28行）</summary>

```text
      let session
      if (targetId === undefined) {
        if (exec.agent === undefined) {
          throw new Error('rename_session: no session_id was given and this call has no owning session')
        }
        session = exec.agent.session
      } else {
        const agent = ctx.agents.get(targetId)
        if (agent === undefined) {
          throw new Error(`cannot rename session ${targetId}: not loaded — open or switch to it first`)
        }
        session = agent.session
      }

      const sessionTitle = ctx.get('sessionTitle')
      if (sessionTitle === undefined) {
        throw new Error(
          'session-title-unavailable: the session-title service is not mounted, so no title can be written',
        )
      }

      const snapshot = sessionTitle.rename(session, title)
      return {
        session_id: String(session.id),
        title: snapshot.title,
        seq: snapshot.eventSeq,
      }
    },
```

</details>

**依据 3 · 作者声明**：[README.md:22-24](https://github.com/9Ashwin/dsh-session-rename/blob/f073bfa1fa7e59832df5efacb5b94ee44749326c/README.md#L22-L24)

宿主标题事件语义的作者说明。

```text
返回 `{ session_id, title, seq }`（格式化 JSON 文本）。

标题语义由 `@deepseek-ai/dsh-session-title` 决定：写入一条 `source.kind === 'user'` 的 `session/title` 事件，**钉住**标题——进行中的自动生成被取代，后续用户消息也不再触发自动修订。标题只进会话日志，**绝不进入模型输入**。
```

#### 缺口

- 未检查固定宿主 sessionTitle 实现或运行事件流。
  **影响：**钉住/持久化语义依赖宿主版本。
  **进一步探讨：**在测试会话检查 title 事件和重载后标题。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 传入其他 session_id 时有哪些边界？

**研究主题：**缺陷与关键质疑、工程质量与复用

#### 完整回答

显式 session_id 可指向 ctx.agents.get 能取到的任一已加载 agent；冷会话失败。插件只检非空字符串，不在源码中核调用 agent 与目标会话的所有权/用户权限，也不限定为当前会话。是否由宿主工具或 agents 服务做权限隔离，固定插件源码不能证明。跨会话改名是应重点测试的信任边界。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:39-43](https://github.com/9Ashwin/dsh-session-rename/blob/f073bfa1fa7e59832df5efacb5b94ee44749326c/index.js#L39-L43)

参数允许非当前会话。

```text
        session_id: {
          type: 'string',
          description:
            'Target session id. Omit to rename the current session. A non-current session must already be loaded, otherwise the call fails.',
        },
```

**依据 2 · 源码核查**：[index.js:83-100](https://github.com/9Ashwin/dsh-session-rename/blob/f073bfa1fa7e59832df5efacb5b94ee44749326c/index.js#L83-L100)

仅校验非空并查已加载 agent。

<details>
<summary>查看原文（18行）</summary>

```text
      const targetId = input.session_id
      if (targetId !== undefined && (typeof targetId !== 'string' || targetId.trim() === '')) {
        throw new Error('rename_session: session_id must be a non-empty string when provided')
      }

      let session
      if (targetId === undefined) {
        if (exec.agent === undefined) {
          throw new Error('rename_session: no session_id was given and this call has no owning session')
        }
        session = exec.agent.session
      } else {
        const agent = ctx.agents.get(targetId)
        if (agent === undefined) {
          throw new Error(`cannot rename session ${targetId}: not loaded — open or switch to it first`)
        }
        session = agent.session
      }
```

</details>

**依据 3 · 作者声明**：[README.md:76-82](https://github.com/9Ashwin/dsh-session-rename/blob/f073bfa1fa7e59832df5efacb5b94ee44749326c/README.md#L76-L82)

作者限制说明。

```text
## Limitations

- **只能改已加载的会话。** 传 `session_id` 时走 `ctx.agents.get()`，冷会话会报
  `not loaded — open or switch to it first`。省略 `session_id` 走当前会话，无此限制。
- **没有专属卡片。** 纯 host 插件，工具调用在对话流里显示为通用卡片；要专属视图需要
  额外注册客户端的 `tool.call.toolview`。
- **不自动触发。** 改成什么、什么时候改，由模型（即你的规则）决定。
```

#### 缺口

- 未审宿主 agents.get 授权与多用户隔离。
  **影响：**不能据插件源码断言可越权利用，但边界未展示。
  **进一步探讨：**在双用户隔离 profile 用无害标题验证权限。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 无官方包依赖的实现代价和标题校验是什么？

**研究主题：**效果与总成本、工程质量与复用

#### 完整回答

源码手写 tools.register schema 与 execute 校验，不 import @deepseek-ai 包，规避 link/Git 安装时的版本解析偏差。title 仅检查 trim 后非空，最终归一化交给 sessionTitle.rename；工具声明 isConcurrencySafe:false，但不能替代目标会话级并发控制验证。作者称 test.mjs 覆盖分支，本轮未运行。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:61-74](https://github.com/9Ashwin/dsh-session-rename/blob/f073bfa1fa7e59832df5efacb5b94ee44749326c/README.md#L61-L74)

作者解释零运行时依赖与代价。

<details>
<summary>查看原文（14行）</summary>

```text
## Design notes

**零运行时依赖。** 本插件不 `import` 任何 `@deepseek-ai/*` 包：工具对象按
`ctx.tools.register()` 的契约手写（`defineTool` 只是 spec→JSON Schema 的转换器，
`SessionId` 只是恒等 brand）。这样做的原因很实际：

- CLI 自带的 `dsh-tools` 与 profile 侧解析到的版本经常不一致；
- 以 `link:` / `github:` 安装的插件若 `import` 官方包，Node 会从插件的 realpath
  逐级向上找 `node_modules`，而 profile 的 `node_modules/@deepseek-ai/` 未必有对应版本。

结果是同一个 peer 被解析成两个版本、链接期抛
`does not provide an export named ...`。不 import 就同时避开这两个问题。

代价是自己做参数校验（`defineTool` 原本会包一层 JSON Schema 校验），`test.mjs` 覆盖了这些分支。
```

</details>

**依据 2 · 源码核查**：[index.js:30-68](https://github.com/9Ashwin/dsh-session-rename/blob/f073bfa1fa7e59832df5efacb5b94ee44749326c/index.js#L30-L68)

schema 与并发标记。

<details>
<summary>查看原文（39行）</summary>

```text
    parameters: {
      type: 'object',
      additionalProperties: false,
      properties: {
        title: {
          type: 'string',
          description:
            'New session title. Must contain visible characters after normalization. Keep it short and descriptive; include the work item id when the session is about one.',
        },
        session_id: {
          type: 'string',
          description:
            'Target session id. Omit to rename the current session. A non-current session must already be loaded, otherwise the call fails.',
        },
      },
      required: ['title'],
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          session_id: { type: 'string' },
          title: { type: 'string' },
          seq: { type: 'integer' },
        },
        required: ['session_id', 'title', 'seq'],
      },
      /**
       * 结果以格式化 JSON 文本返回，模型直接读结构化字段。
       * @param _args - 已校验的调用参数（此处不使用）。
       * @param value - 已校验的执行结果。
       * @returns 单块文本内容。
       */
      render(_args, value) {
        return [{ type: 'text', text: JSON.stringify(value, null, 2) }]
      },
    },
    isConcurrencySafe: () => false,
```

</details>

**依据 3 · 源码核查**：[index.js:75-85](https://github.com/9Ashwin/dsh-session-rename/blob/f073bfa1fa7e59832df5efacb5b94ee44749326c/index.js#L75-L85)

输入校验。

<details>
<summary>查看原文（11行）</summary>

```text
    async execute(args, exec) {
      const input = args !== null && typeof args === 'object' ? args : {}

      const title = input.title
      if (typeof title !== 'string' || title.trim() === '') {
        throw new Error('rename_session: title is required and must be a non-empty string')
      }

      const targetId = input.session_id
      if (targetId !== undefined && (typeof targetId !== 'string' || targetId.trim() === '')) {
        throw new Error('rename_session: session_id must be a non-empty string when provided')
```

</details>

**依据 4 · 源码核查**：[index.js:109-115](https://github.com/9Ashwin/dsh-session-rename/blob/f073bfa1fa7e59832df5efacb5b94ee44749326c/index.js#L109-L115)

宿主归一化结果。

```text
      const snapshot = sessionTitle.rename(session, title)
      return {
        session_id: String(session.id),
        title: snapshot.title,
        seq: snapshot.eventSeq,
      }
    },
```

#### 缺口

- 未运行 test.mjs 或并发改名。
  **影响：**宿主是否按标记串行、长标题如何截断未知。
  **进一步探讨：**隔离 profile 测并发和异常标题。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么使用方式能让标题变化可控？

**研究主题：**采用判断、新假设与验证

#### 完整回答

在个人会话按用户明确的工作项 ID 规则调用当前会话改名；不提供 session_id 可避免意外触碰其他已加载会话。需核实标题事件、重载持久性和权限后再用于多用户环境。若只需本会话，移除跨会话参数/增加目标授权检查会缩小信任面；属于改进设想。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:50-59](https://github.com/9Ashwin/dsh-session-rename/blob/f073bfa1fa7e59832df5efacb5b94ee44749326c/README.md#L50-L59)

作者给出的需求编号规则。

<details>
<summary>查看原文（10行）</summary>

````text
## Recipe: name the session after the work item

把这条加进你的 `AGENTS.md`，模型就会在有需求 id 时自己改名：

```md
- 开始一个新需求（出现 PRD-NNN、Issue #NNN 等需求 id）时，调用 `rename_session`，
  把会话标题改成 `<需求 id> <一句话描述>`，例如 `PRD-042 重构 router 层`。
```

`title` 由模型组织，插件不做任何拼装——所以规则想怎么写就怎么写（带不带 id、用哪种编号、要不要加阶段前缀都行）。
````

</details>

**依据 2 · 源码核查**：[index.js:89-100](https://github.com/9Ashwin/dsh-session-rename/blob/f073bfa1fa7e59832df5efacb5b94ee44749326c/index.js#L89-L100)

当前/其他会话分支。

<details>
<summary>查看原文（12行）</summary>

```text
      if (targetId === undefined) {
        if (exec.agent === undefined) {
          throw new Error('rename_session: no session_id was given and this call has no owning session')
        }
        session = exec.agent.session
      } else {
        const agent = ctx.agents.get(targetId)
        if (agent === undefined) {
          throw new Error(`cannot rename session ${targetId}: not loaded — open or switch to it first`)
        }
        session = agent.session
      }
```

</details>

**依据 3 · 源码核查**：[index.js:102-115](https://github.com/9Ashwin/dsh-session-rename/blob/f073bfa1fa7e59832df5efacb5b94ee44749326c/index.js#L102-L115)

服务调用。

<details>
<summary>查看原文（14行）</summary>

```text
      const sessionTitle = ctx.get('sessionTitle')
      if (sessionTitle === undefined) {
        throw new Error(
          'session-title-unavailable: the session-title service is not mounted, so no title can be written',
        )
      }

      const snapshot = sessionTitle.rename(session, title)
      return {
        session_id: String(session.id),
        title: snapshot.title,
        seq: snapshot.eventSeq,
      }
    },
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
