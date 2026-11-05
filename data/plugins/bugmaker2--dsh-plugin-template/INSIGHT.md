# DSH Plugin Template

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[31af7eb](https://github.com/bugmaker2/dsh-plugin-template/tree/31af7ebeb8d07cff73253f52f9a9f530cde9de9a)

<!-- BEGIN META -->
[![GitHub ★ 103](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=103&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/bugmaker2/dsh-plugin-template)
<!-- END META -->

> **功能**：展示带共享协议的宿主和客户端插件骨架

> **亮点**：[Q01](#research-q01) 提供可追踪的最小端到端骨架。

> **主要限制**：[Q03](#research-q03) 无副作用示例尚未覆盖授权和长任务取消。

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
  - [Q01 · 模板交付什么？](#detail-section-11)
  - [Q02 · 协议如何避免漂移？](#detail-section-12)
  - [Q03 · 权限与取消到什么程度？](#detail-section-13)
  - [Q04 · 采用和退出？](#detail-section-14)
  - [Q05 · 怎样判定有用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：开发者开始编写双端插件。

从 SDK 文档独立装配。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 从 SDK 文档独立装配。 | 可直接比较 | 保留人工步骤 |
| DSH Plugin Template | 提供可追踪的最小端到端骨架。 | 无副作用示例尚未覆盖授权和长任务取消。 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 宿主 | 必需 | 共享 wire 描述贯通宿主 Remote 和客户端标签。 | 用隔离 profile 确认 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 开发者开始编写双端插件。 | 保留原流程 |
| 试验 | 共享 wire 描述贯通宿主 Remote 和客户端标签。 | 观察固定版本 |
| 复核 | 隔离 profile 检查合法、非法和卸载。 | 比对任务结果 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 安装与运行成本未知 | 配置准备耗时未知 | 视 profile 而定 |
| 持续 | 持续运行成本未知 | 日常维护耗时未知 | 视任务频率而定 |
| 恢复 | 回退成本未知 | 恢复原流程耗时未知 | 视已有数据而定 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 以最小问候流程确认插件开发链路 | 可降低首个双端插件的接线时间。 | 隔离 profile 检查合法、非法和卸载。 |

> **思考**：[Q03](#research-q03) 无副作用示例尚未覆盖授权和长任务取消。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 提供可追踪的最小端到端骨架。

共享契约和显式 mount/dispose。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 无副作用示例尚未覆盖授权和长任务取消。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 隔离 profile 检查合法、非法和卸载。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的以最小问候流程确认插件开发链路。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/contract.ts、src/runtime.ts、src/client/index.tsx 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的以最小问候流程确认插件开发链路。未执行目标代码或实际宿主验证。
- 下一步：保留输入、返回和清理记录。

**分析版本**

- **仓库**：[bugmaker2/dsh-plugin-template](https://github.com/bugmaker2/dsh-plugin-template)
- **版本号**：0.1.0（[固定提交 31af7eb](https://github.com/bugmaker2/dsh-plugin-template/tree/31af7ebeb8d07cff73253f52f9a9f530cde9de9a)）
- **版本日期**：2026-08-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 可降低首个双端插件的接线时间。

保留输入、返回和清理记录。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 30 | 16 | 11 | — |
| .js | source | 1 | 8 | 7 | 0 | — |
| .md | source | 2 | 232 | — | — | 1364 |
| .tsx | source | 2 | 116 | 80 | 22 | — |
| .ts | source | 9 | 221 | 120 | 78 | — |
| .ts | test | 2 | 48 | 41 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/bugmaker2/dsh-plugin-template/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/bugmaker2/dsh-plugin-template/issues?q=is%3Aissue+created%3A2026-10-06T05%3A08%3A46.024Z..2026-11-05T05%3A08%3A46.024Z)

暂未获取：近30天关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：以最小问候流程确认插件开发链路

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 模板交付什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

开发者可从宿主问候 Remote 和客户端标签页起步，验证配置到结果的往返。相对从零接 SDK，验收是正常输入返回预期文本，空白及过长输入被拒。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:8-10](https://github.com/bugmaker2/dsh-plugin-template/blob/31af7ebeb8d07cff73253f52f9a9f530cde9de9a/README.md#L8-L10)

作者说明模板及问候用例

```text
A complete dual-side [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) plugin template. It demonstrates the full plugin surface — a **host** plugin exposing a Typert Remote, and a **client** plugin mounting that Remote into a React view — with type-checking, linting, unit tests, CI, and publishing metadata wired up.

Out of the box it registers a `greet` Remote: the host composes `"Hello, <name>"` from a configurable prefix, and the client renders the result in a new "Greet" tab.
```

**依据 2 · 源码核查**：[src/contract.ts:12-15](https://github.com/bugmaker2/dsh-plugin-template/blob/31af7ebeb8d07cff73253f52f9a9f530cde9de9a/src/contract.ts#L12-L15)

名称和结果的 wire schema

```text
/** Wire codec for the caller's name. */
export const nameSchema = z.string().trim().min(1).max(200)
/** Wire codec for the greeting result projection. */
export const greetResultSchema = z.object({ message: z.string() }).readonly()
```

#### 缺口

- 通用业务功能仍需开发。
  **影响**：减少接线摸索。
  **进一步探讨**：用独立 profile 检查一轮。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 协议如何避免漂移？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

共享 descriptors 给双方引用，宿主再解析名称并组合配置结果。客户端 mount remote 后注册标签页，卸载时处理 dispose。

#### 证据与依据

**依据 1 · 源码核查**：[src/contract.ts:25-30](https://github.com/bugmaker2/dsh-plugin-template/blob/31af7ebeb8d07cff73253f52f9a9f530cde9de9a/src/contract.ts#L25-L30)

共享调用描述

```text
/** Strict Typert descriptors shared by the host and browser halves. */
export const DSH_TEMPLATE_INVOCATIONS: readonly InvocationDescriptor[] = [
  {
    id: 'dsh-plugin-template#greet/greet', service: 'greet', namespace: 'greet', method: 'greet', invocation: { kind: 'direct' },
    parameters: [nameParameter], cancellation: { parameter: 'signal' }, result: greetResult,
  },
```

**依据 2 · 源码核查**：[src/runtime.ts:14-24](https://github.com/bugmaker2/dsh-plugin-template/blob/31af7ebeb8d07cff73253f52f9a9f530cde9de9a/src/runtime.ts#L14-L24)

宿主实际验证及问候

<details>
<summary>查看原文（11行）</summary>

```text
export class GreetRuntime extends TypertRemoteService {
  /** @param ctx - owning Cordis context. @param config - resolved plugin config. */
  constructor(ctx: Context, private readonly config: ResolvedConfig) { super(ctx, 'greet') }

  /** Compose a greeting from the configured prefix and the caller's name. */
  @Remote
  async greet(name: string, signal?: AbortSignal): Promise<GreetResult> {
    void signal
    const checked = nameSchema.parse(name)
    const suffix = this.config.excited ? '!' : ''
    return { message: `${this.config.greeting}, ${checked}${suffix}` }
```

</details>

**依据 3 · 源码核查**：[src/client/index.tsx:25-48](https://github.com/bugmaker2/dsh-plugin-template/blob/31af7ebeb8d07cff73253f52f9a9f530cde9de9a/src/client/index.tsx#L25-L48)

挂载、卸载和标签注册

<details>
<summary>查看原文（24行）</summary>

```text
  ctx.effect(async () => {
    const dispose = await ctx.remote.$mount(DSH_TEMPLATE_REMOTE)
    greet = (ctx.reflect as unknown as { get(name: string): unknown }).get('remote.greet')
    if (greet === undefined) throw new Error('dsh-plugin-template: the greet Remote namespace did not mount')
    return () => { greet = undefined; void dispose() }
  }, 'dsh-plugin-template: remote')

  const actions: GreetActions = {
    greet: (name: string) => {
      if (greet === undefined) return Promise.reject(new Error('dsh-plugin-template: greet Remote is not mounted'))
      const fn = (greet as Record<string, unknown>).greet
      if (typeof fn !== 'function') return Promise.reject(new Error('dsh-plugin-template: greet method is not available'))
      return (fn as (n: string) => unknown)(name) as ReturnType<GreetActions['greet']>
    },
  }

  // Register the greet tab into the session conversation view ring.
  ctx.slots.inject('conversation.view', () => ctx.slots.register({
    name: 'conversation.view',
    id: 'dsh-plugin-template',
    order: 20,
    label: () => t('view.label'),
    inject: () => ({ actions, t }),
  }, (props: TemplateViewSlotProps) => <TemplateView actions={props.actions} t={props.t} />))
```

</details>

#### 缺口

- 依赖 SDK 版本仍会改变接线。
  **影响**：共享协议降低字段不一致。
  **进一步探讨**：升级前做 wire 对照。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 权限与取消到什么程度？

**研究主题**：缺陷与关键质疑

#### 完整回答

模板方法只做字符串拼接，显式忽略 signal。把它扩展为网络或文件操作时，需要补授权、取消及副作用语义。

#### 证据与依据

**依据 1 · 源码核查**：[src/runtime.ts:18-24](https://github.com/bugmaker2/dsh-plugin-template/blob/31af7ebeb8d07cff73253f52f9a9f530cde9de9a/src/runtime.ts#L18-L24)

方法忽略取消 signal

```text
  /** Compose a greeting from the configured prefix and the caller's name. */
  @Remote
  async greet(name: string, signal?: AbortSignal): Promise<GreetResult> {
    void signal
    const checked = nameSchema.parse(name)
    const suffix = this.config.excited ? '!' : ''
    return { message: `${this.config.greeting}, ${checked}${suffix}` }
```

**依据 2 · 源码核查**：[src/contract.ts:28-29](https://github.com/bugmaker2/dsh-plugin-template/blob/31af7ebeb8d07cff73253f52f9a9f530cde9de9a/src/contract.ts#L28-L29)

wire 声明取消参数

```text
    id: 'dsh-plugin-template#greet/greet', service: 'greet', namespace: 'greet', method: 'greet', invocation: { kind: 'direct' },
    parameters: [nameParameter], cancellation: { parameter: 'signal' }, result: greetResult,
```

#### 缺口

- 不能外推到高副作用业务。
  **影响**：基础问候正确不足以证明生产服务。
  **进一步探讨**：扩展前设计取消测试。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用和退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

复制模板后先改包、服务和 namespace，按仓库说明核对目标 DSH。成本在 SDK 维护及业务实现。退出测试 profile 时确认 tab 和 remote 无残留。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:14-26](https://github.com/bugmaker2/dsh-plugin-template/blob/31af7ebeb8d07cff73253f52f9a9f530cde9de9a/README.md#L14-L26)

作者标注组成文件

<details>
<summary>查看原文（13行）</summary>

````text
```text
package.json           # dsh.bundle + dsh.client manifests, scripts, peer deps
cordis.patch.yml       # mounts the host plugin row into a profile
dsh.plugin.json        # dsh.so registry manifest
src/index.ts           # host entry: Config schema + Typert manifest registration
src/runtime.ts         # host Remote service (TypertRemoteService)
src/typert.ts          # Typert model manifest
src/contract.ts        # strict wire contract shared by host and client
src/types.ts           # shared host/client types
src/client/index.tsx   # client entry: mounts Remote + registers the view slot
src/client/remote.ts   # client Remote contribution + typed namespace
src/client/locales.ts  # zh / en dictionaries
src/client/view.tsx    # minimal React view
````

</details>

**依据 2 · 源码核查**：[src/client/index.tsx:25-30](https://github.com/bugmaker2/dsh-plugin-template/blob/31af7ebeb8d07cff73253f52f9a9f530cde9de9a/src/client/index.tsx#L25-L30)

remote 释放路径

```text
  ctx.effect(async () => {
    const dispose = await ctx.remote.$mount(DSH_TEMPLATE_REMOTE)
    greet = (ctx.reflect as unknown as { get(name: string): unknown }).get('remote.greet')
    if (greet === undefined) throw new Error('dsh-plugin-template: the greet Remote namespace did not mount')
    return () => { greet = undefined; void dispose() }
  }, 'dsh-plugin-template: remote')
```

#### 缺口

- 样式清理未验证。
  **影响**：复制后命名冲突需要检验。
  **进一步探讨**：同装两份改名模板。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样判定有用？

**研究主题**：新假设与验证

#### 完整回答

比较从零接入与模板起步耗时，测试重复 mount、服务缺失和非法输入。若两实例互串 namespace 或卸载仍能调用，则基础目标未达到。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.tsx:25-37](https://github.com/bugmaker2/dsh-plugin-template/blob/31af7ebeb8d07cff73253f52f9a9f530cde9de9a/src/client/index.tsx#L25-L37)

缺服务有显式错误

<details>
<summary>查看原文（13行）</summary>

```text
  ctx.effect(async () => {
    const dispose = await ctx.remote.$mount(DSH_TEMPLATE_REMOTE)
    greet = (ctx.reflect as unknown as { get(name: string): unknown }).get('remote.greet')
    if (greet === undefined) throw new Error('dsh-plugin-template: the greet Remote namespace did not mount')
    return () => { greet = undefined; void dispose() }
  }, 'dsh-plugin-template: remote')

  const actions: GreetActions = {
    greet: (name: string) => {
      if (greet === undefined) return Promise.reject(new Error('dsh-plugin-template: greet Remote is not mounted'))
      const fn = (greet as Record<string, unknown>).greet
      if (typeof fn !== 'function') return Promise.reject(new Error('dsh-plugin-template: greet method is not available'))
      return (fn as (n: string) => unknown)(name) as ReturnType<GreetActions['greet']>
```

</details>

**依据 2 · 源码核查**：[src/contract.ts:12-15](https://github.com/bugmaker2/dsh-plugin-template/blob/31af7ebeb8d07cff73253f52f9a9f530cde9de9a/src/contract.ts#L12-L15)

边界输入可验

```text
/** Wire codec for the caller's name. */
export const nameSchema = z.string().trim().min(1).max(200)
/** Wire codec for the greeting result projection. */
export const greetResultSchema = z.object({ message: z.string() }).readonly()
```

#### 缺口

- 无本次宿主结果。
  **影响**：可测开发成本和协议可靠性。
  **进一步探讨**：保留输入、返回和清理记录。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
