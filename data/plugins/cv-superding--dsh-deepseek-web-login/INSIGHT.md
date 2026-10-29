# dsh-deepseek-web-login

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[cfd684d](https://github.com/cv-superding/dsh-deepseek-web-login/tree/cfd684daf5f05cb09af2643073df38bcabe5e77c)

<!-- BEGIN META -->
[![GitHub ★ 326](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=326&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/cv-superding/dsh-deepseek-web-login) [![npm 30d 14,269](https://img.shields.io/static/v1?label=npm+30d&message=14%2C269&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-deepseek-web-login) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-deepseek-web-login)
<!-- END META -->

> **功能**：以网页版登录态向 DSH 提供 DeepSeek 模型，桥接流式回答、图片和提示词工具调用。

> **亮点**：工具调用从文本协议真实接到宿主事件，结合账号稳定身份及删除确认前保留清理义务，支持有条件的Agent适配研究；本轮未证明运行闭环。见[Q02](#research-q02)、[Q04](#research-q04)。

> **主要限制**：回复恢复可能伴随无图却仍标已附图的降级、链首约束丢失或远端会话未清，网页登录与凭据保管又是外部依赖；有文本不等于原任务办结，卸载也不等于登出。见[Q03](#research-q03)、[Q04](#research-q04)。

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
  - [Q01 · 接入类型与目标任务是什么，相对官方API增加什么？](#detail-section-11)
  - [Q02 · 提示词工具协议是否真正发给宿主执行？](#detail-section-12)
  - [Q03 · 图片、上下文及网页会话故障怎样改变结果？](#detail-section-13)
  - [Q04 · 凭证和浏览器生命周期有什么权限与退出边界？](#detail-section-14)
  - [Q05 · 采用总成本和可验证新方向是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有网页账号且希望在DSH执行工具任务的操作者，可观察非官方供应商适配；合格结果要核对真实工具和必需输入。见[Q01](#research-q01)。

基线是网页人工对话或正式API供应商；增量在Agent宿主集成，维护责任转到浏览器、登录态和私有协议。见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 原生模型供应商 | 在DSH选择网页模型 | 非官方接口，资格与浏览器必需 |
| 提示词工具桥 | 转JSON/XML调用为宿主工具块 | 解析不等于授权；串行开关不强制单调用 |
| 图片输入 | 上传并引用图像 | 拒绝后可降成无图，不等于图像任务完成 |
| 账号管理 | 登录、切换、导入导出与登出 | 本机明文登录态；备份另存 |
| full/chained上下文 | 重发历史或沿网页父链增量 | 链首约束可能丢失，质量需另验 |
| 网页会话清理 | 按账号记录并重试未确认删除 | 卸载尽力刷新不等于远端全清 |

**流程与依赖**

需Node、DSH服务、Chrome/Edge与网页登录资格，明文凭据及API保护也属于使用条件；完整表见[Q05](#research-q05)。

从保护和凭据范围开始，再验证只读到可逆工具，降级时按任务输入验收；步骤见[Q05](#research-q05)。

**效果与成本**

浏览器、重登、私有协议、故障输入及账号清理都产生成本，具体金额和耗时未知；阶段表见[Q05](#research-q05)。

工具桥和恢复机制可定位，真实合格率、额度及全周期节费无本轮数据；效果表见[Q05](#research-q05)。

> **思考**：回复恢复可能伴随无图却仍标已附图的降级、链首约束丢失或远端会话未清，网页登录与凭据保管又是外部依赖；有文本不等于原任务办结，卸载也不等于登出。见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：工具调用从文本协议真实接到宿主事件，结合账号稳定身份及删除确认前保留清理义务，支持有条件的Agent适配研究；本轮未证明运行闭环。见[Q02](#research-q02)、[Q04](#research-q04)。

工具事件桥、内容前重试守卫和按账号记待删会话值得借鉴；串行只是提示词，权限依赖宿主。认证导出和卸载保留凭据需明确生命周期，未作全面安全审计。见[Q02](#research-q02)、[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

回复恢复可能伴随无图却仍标已附图的降级、链首约束丢失或远端会话未清，网页登录与凭据保管又是外部依赖；有文本不等于原任务办结，卸载也不等于登出。见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察。后续在受信本地单用户环境以非敏感只读任务验证，再核对工具和图片失败；缺必需输入、工具未实执行或清理不明时停止，退回已验证模型供应商。见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认原生adapter与工具事件桥；真实网页资格、宿主闭环和保护未验证，采用观察。格式和恢复设计不等于已测收益，新假设未实现。

- 已检查：作者 README、包清单、源码路径 package.json、src/index.ts、src/adapter.ts、src/protocol.ts、src/auth.ts、src/accounts.ts、src/paths.ts、src/browser-transport.ts、src/context-feed.ts、src/login.ts、src/session-journal.ts、src/client/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向读provider注册、协议解析、流事件、图片降级、上下文模式、凭据原子写、导出/登出、浏览器与会话清理；未检查全部UI/自动切号/私有接口解析，未运行目标代码或读取真实凭据。
- 下一步：后续固定宿主版本测试只读和可逆工具、图片引用失败、长链早期约束、切号及删除失败；按合格任务、全部请求和人工修正比较正式API基线。

**分析版本**

- **仓库**：[cv-superding/dsh-deepseek-web-login](https://github.com/cv-superding/dsh-deepseek-web-login)
- **版本号**：1.0.3（[固定提交 cfd684d](https://github.com/cv-superding/dsh-deepseek-web-login/tree/cfd684daf5f05cb09af2643073df38bcabe5e77c)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是把输入齐备、工具实执行和结果核对作为公开任务级恢复状态，减少丢图或协议失败后的假完成；比较合格交付、遗漏和人工修正，维护代价长期高于正式替代时停止。见[Q05](#research-q05)。

后续固定宿主版本测试只读和可逆工具、图片引用失败、长链早期约束、切号及删除失败；按合格任务、全部请求和人工修正比较正式API基线。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 7658 | — | — | 120216 |
| .mjs | source | 41 | 3927 | 3034 | 626 | — |
| .js | source | 2 | 18427 | 14104 | 4424 | — |
| .ts | source | 34 | 24814 | 15930 | 7676 | — |
| .mjs | test | 83 | 23325 | 17902 | 3497 | — |

</details>

**活跃度**

[![Issue 未关闭 15](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=15&color=737b86&logo=github)](https://github.com/cv-superding/dsh-deepseek-web-login/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 11](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=11&color=737b86&logo=github)](https://github.com/cv-superding/dsh-deepseek-web-login/issues?q=is%3Aissue+created%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z) [![近30天关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/cv-superding/dsh-deepseek-web-login/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：网页模型接入的真实工具桥、输入降级和凭据生命周期边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 接入类型与目标任务是什么，相对官方API增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是原生DSH模型供应商适配器，index通过llm.registerAdapter注册deepseek-web，并提供宿主API与浏览器面板。它把已有网页版登录态接入DSH的模型调用；不调用正式API Key路径，而依赖网页私有接口、浏览器环境和账号凭据。不能把原生宿主接线误写成DeepSeek官方支持的服务接口。

目标是已有网页账号、希望在DSH中使用同类模型并执行工具任务的操作者。基线是直接在网页手动对话，或使用正式模型API供应商。插件增加DSH消息转写、流式事件转换、图片上传、账号管理与上下文会话管理；推理能力来自远端模型，工具权限和执行来自DSH。合格结果应是相同任务产生正确回答、参数正确的真实工具执行与明确结束状态，不能以“网页能回复”替代Agent闭环验收。

源码可确认适配层实现，不能确认目前网页资格、额度、反自动化策略或持续供给。作者称免费网页版可驱动Agent是能力主张，免费、稳定、不会受限不由插件保证。它让用户从官方API配置转为保管网页会话和维护浏览器/私有协议，成本与责任发生转移，不能简单视为“省下API费用”。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:1-6](https://github.com/cv-superding/dsh-deepseek-web-login/blob/cfd684daf5f05cb09af2643073df38bcabe5e77c/package.json#L1-L6)

作者明确非官方网页provider定位。

```text
{
  "name": "dsh-deepseek-web-login",
  "version": "1.0.3",
  "description": "Unofficial DSH plugin: use chat.deepseek.com web models as a DSH LLM provider (browser login capture + PoW solving + SSE streaming + prompting-based tool calls), provider route deepseek-web",
  "type": "module",
  "main": "./lib/index.js",
```

**依据 2 · 源码核查**：[src/index.ts:1100-1114](https://github.com/cv-superding/dsh-deepseek-web-login/blob/cfd684daf5f05cb09af2643073df38bcabe5e77c/src/index.ts#L1100-L1114)

实际adapter注册与host API。

<details>
<summary>查看原文（15行）</summary>

```text

  // 1) LLM 适配器：registerAdapter 内部走 ctx.effect（traceable 代理把副作用绑到本 fiber）
  ctx.llm.registerAdapter([PROVIDER], adapter)
  logger.info?.(`deepseek-web: 已注册 provider "${PROVIDER}"（模型：${MODEL_SPECS.map((spec) => spec.id).join(', ')}）`)

  // 2) host API
  ctx.effect(
    () =>
      ctx.webServer.register({
        kind: 'prefix',
        path: API_PREFIX,
        handler: async (req: any, res: any) => {
          const url = new URL(String(req.url ?? '/'), 'http://127.0.0.1')
          const route = url.pathname.slice(API_PREFIX.length) || '/'

```

</details>

**依据 3 · 源码核查**：[src/adapter.ts:1263-1281](https://github.com/cv-superding/dsh-deepseek-web-login/blob/cfd684daf5f05cb09af2643073df38bcabe5e77c/src/adapter.ts#L1263-L1281)

DSH历史与工具序列化到网页prompt。

<details>
<summary>查看原文（19行）</summary>

```text
    let promptParts = serializePromptParts({
      system: options?.system,
      messages: options?.messages ?? [],
      tools: (options?.tools ?? []) as ToolSchemaLike[],
      maxChars: deps.config.maxPromptChars ?? DEFAULT_MAX_PROMPT_CHARS,
      // 「一次一个工具」开关：只换协议指令那一段，其余 prompt 结构不变（**缺省＝串行**）。
      serialToolCalls: deps.config.serialToolCalls !== false,
      // 只对**首轮**传：它才是真正带 ref_file_ids 的那一次（续写轮 refFileIds 传空）。
      // 传了之后，被长度控制略过的图会写成 `[earlier image omitted]` 而不是 `[image attached]`
      // —— 标记与实发必须一致，否则模型会对着没送出去的图瞎猜。
      keptImageKeys: uploaded.keptKeys,
    })
    const prompt = promptParts.full

    const knownNames = new Set<string>((options?.tools ?? []).map((tool: any) => String(tool?.name ?? '')))
    // 自动续写的每一轮用全新的过滤器/守卫实例（上一轮的状态在轮次收尾时已吐净），
    // 否则跨请求的行缓冲会让续写内容与 hold 的尾部乱序。
    let filter = new ToolCallStreamFilter(knownNames)
    // 思考通道净化器（0.6.28）：此前思考是**原样直通**的，标记既上网页端、又进历史
```

</details>

#### 缺口

- 当前网页资格、额度和持续服务未测试
  **影响**：不能确认可用于稳定办结任务
  **进一步探讨**：后续在授权目标账号环境核对资格和任务闭环，不据静态声明推断。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 提示词工具协议是否真正发给宿主执行？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

工具桥确实不止一份提示词。serializePromptParts将system、messages和tools转写成网页接受的字符串；输出流进入ToolCallStreamFilter，从文本中收集JSON/XML等候选调用，adapter的emitCalls再输出宿主block-start、tool-call-delta和block-end。发现工具调用后以finish tool-calls结束这一轮，让宿主执行工具并把结果带回后续请求。因此源码支持“产生宿主能消费的工具调用事件”的链路，但本轮未运行，不证明一次真实任务已经闭环。

网页端没有原生function calling，格式主要靠协议约定和解析修复。默认“一个工具一次”是在提示词中要求，protocol注释明确不拦截多调用，模型仍可发多个并由DSH照常并行。不能把serial开关当并发硬限制或工具安全确认。宽容解析在流结束时会尝试修复转义、括号和闭合标签；这能挽救格式错误，也需要宿主重新校验参数及权限，不能将“解析出来”直接当成用户已授权的动作。

adapter构造knownNames并传入filter，但本次检查的filter只存knownTools字段，未见它在解析/flush处用作强制名称过滤。因此不能仅凭这个参数名称宣称未知工具一定会在此层被挡住；最终工具注册、参数校验及权限来自宿主。本研究没有检查全部宿主执行器，保留这一依赖而不推测可执行任意未注册工具。

最有价值的工程点是区分普通文本、思考、工具块与转写回声，并把未执行程序和不合格工具格式作为单独失败现象处理；这同样增加协议维护负担。应以真实工具名、参数、副作用和后续结果的记录验收，而不是测试文件数量或出现JSON来证明自主执行。

#### 证据与依据

**依据 1 · 源码核查**：[src/adapter.ts:1263-1281](https://github.com/cv-superding/dsh-deepseek-web-login/blob/cfd684daf5f05cb09af2643073df38bcabe5e77c/src/adapter.ts#L1263-L1281)

输入序列化与knownNames传给filter。

<details>
<summary>查看原文（19行）</summary>

```text
    let promptParts = serializePromptParts({
      system: options?.system,
      messages: options?.messages ?? [],
      tools: (options?.tools ?? []) as ToolSchemaLike[],
      maxChars: deps.config.maxPromptChars ?? DEFAULT_MAX_PROMPT_CHARS,
      // 「一次一个工具」开关：只换协议指令那一段，其余 prompt 结构不变（**缺省＝串行**）。
      serialToolCalls: deps.config.serialToolCalls !== false,
      // 只对**首轮**传：它才是真正带 ref_file_ids 的那一次（续写轮 refFileIds 传空）。
      // 传了之后，被长度控制略过的图会写成 `[earlier image omitted]` 而不是 `[image attached]`
      // —— 标记与实发必须一致，否则模型会对着没送出去的图瞎猜。
      keptImageKeys: uploaded.keptKeys,
    })
    const prompt = promptParts.full

    const knownNames = new Set<string>((options?.tools ?? []).map((tool: any) => String(tool?.name ?? '')))
    // 自动续写的每一轮用全新的过滤器/守卫实例（上一轮的状态在轮次收尾时已吐净），
    // 否则跨请求的行缓冲会让续写内容与 hold 的尾部乱序。
    let filter = new ToolCallStreamFilter(knownNames)
    // 思考通道净化器（0.6.28）：此前思考是**原样直通**的，标记既上网页端、又进历史
```

</details>

**依据 2 · 源码核查**：[src/adapter.ts:1332-1345](https://github.com/cv-superding/dsh-deepseek-web-login/blob/cfd684daf5f05cb09af2643073df38bcabe5e77c/src/adapter.ts#L1332-L1345)

解析调用转宿主事件。

<details>
<summary>查看原文（14行）</summary>

```text
    const emitCalls = function* (calls: readonly { id: string; name: string; arguments: string }[], fenced?: boolean): Generator<any> {
      // 🔴 0.6.39：记下这批调用是不是围栏包裹的（`undefined` = 本次没发出调用，不覆盖已有值）。
      if (calls.length > 0) callShape = fenced ? 'fenced' : 'bare'
      for (const call of calls) {
        const index = nextIndex++
        toolCallCount += 1
        yield { type: 'block-start', index, blockType: 'tool-call' }
        yield { type: 'tool-call-delta', index, id: call.id, name: call.name, argumentsDelta: call.arguments }
        yield {
          type: 'block-end',
          index,
          block: { type: 'tool-call', id: call.id, name: call.name, arguments: call.arguments },
        }
      }
```

</details>

**依据 3 · 源码核查**：[src/protocol.ts:210-219](https://github.com/cv-superding/dsh-deepseek-web-login/blob/cfd684daf5f05cb09af2643073df38bcabe5e77c/src/protocol.ts#L210-L219)

串行仅提示，不强制禁止多调用。

<details>
<summary>查看原文（10行）</summary>

```text
 * rule 3~8 **必须与上面那份逐字相同** —— 那几条是 JSON 正确性的防线
 * （转义、换行、不许复述转写…），跟批量无关，改一处忘另一处就会让其中一版丢掉防线。
 * `tests/check-tool-serial.mjs` 断言这两段逐字一致。
 *
 * ⚠️ 这是**引导模型**，不是强制：我们只改发给模型的文本，不拦截、不改写模型输出的
 * tool_calls（那会破坏 DSH 的工具执行链路 —— 它从我们转发的事件里解析调用）。
 * 模型偶尔仍可能发多个，那种情况下 DSH 照旧并行执行。文案里刻意不写"会被拒绝"，
 * 因为我们确实不拒绝 —— 写了就是撒谎，模型学会忽略之后这条指令就废了。
 */
export const SERIAL_TOOL_PROTOCOL_INSTRUCTIONS = `# Tool Calling Protocol
```

</details>

**依据 4 · 源码核查**：[src/protocol.ts:2044-2080](https://github.com/cv-superding/dsh-deepseek-web-login/blob/cfd684daf5f05cb09af2643073df38bcabe5e77c/src/protocol.ts#L2044-L2080)

knownTools保存与流尾宽容解析。

<details>
<summary>查看原文（37行）</summary>

```text
  private readonly knownTools?: ReadonlySet<string>
  /**
   * 本次流里**我们剥掉过一个调用围栏的开栏**（0.6.38）。
   *
   * ⇒ 之后出现的闭栏必定是同一个调用块的收尾，可以安全剥掉。
   * ⚠️ 有了这个标记才敢剥闭栏：否则"正文里正常的代码块"会被误伤
   * （`check-auto-continue` N03 / `check-tools-section` 各有用例守着）。
   */
  private sawCallFence = false

  constructor(knownTools?: ReadonlySet<string>) {
    this.knownTools = knownTools
  }

  push(text: string): FilterOutput {
    const out: FilterOutput = { text: '', calls: [] }
    if (text) {
      if (this.capture) this.capture.buffer += text
      else this.pending += text
    }
    this.drain(out)
    return out
  }

  flush(): FilterOutput {
    const out: FilterOutput = { text: '', calls: [] }
    if (this.capture) {
      // 流结束时仍未收全：先尝试宽容解析（转义修复 + 结构性补括号 + 缺闭合标签抢救）。
      const captured = this.capture
      const calls =
        captured.mode === 'xml' ? parseXmlToolCalls(captured.buffer) : parseSalvagedToolCallJson(captured.buffer)
      if (calls) {
        out.calls.push(...calls)
        // 0.1.82：调用块**之后**的正文不能跟着一起消失 —— 见 xmlToolCallTail 的说明。
        if (captured.mode === 'xml') out.text += stripStrayToolMarkup(xmlToolCallTail(captured.buffer))
      } else if (looksLikeToolCallBlock(captured.mode, captured.buffer))
        this.abandoned ??= { raw: captured.buffer, mode: captured.mode, reason: classifyFailure(captured.mode, captured.buffer) }
```

</details>

**依据 5 · 源码核查**：[src/adapter.ts:1740-1745](https://github.com/cv-superding/dsh-deepseek-web-login/blob/cfd684daf5f05cb09af2643073df38bcabe5e77c/src/adapter.ts#L1740-L1745)

工具调用finish交还宿主。

```text
    if (toolCallCount > 0) {
      // 🔴 0.6.39：留痕"这批调用是不是围栏包裹的"（`callShape` 由 `emitCalls` 累加得出）。
      // ⚠️ `undefined` = 本轮没有调用（区别于 'bare'：那是"没听话但执行了"）。
      noteCallShape(callShape ?? 'none', logger)
      yield { type: 'finish', reason: { kind: 'tool-calls' }, callShape }
      return
```

#### 缺口

- 目标宿主参数校验、权限及工具结果回流未独立运行核对
  **影响**：不能把源码事件桥当自主Agent已验证
  **进一步探讨**：用只读工具和可逆写工具分别记录调用、权限、结果及继续决策，再判断适用。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 图片、上下文及网页会话故障怎样改变结果？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

图片上传拒绝有内容交付守卫。canRetryImageReject要求INVALID_REF_FILE、尚未yield内容且次数未耗尽；第一次更新引用重试，后续可进入__skipImages不带图发送。这样避免已部分输出后透明重放，但“恢复成功”可能只是降成没有图片的请求。这里还有提示与实际输入不一致的源码风险。__skipImages将keptKeys设为undefined，而protocol的图像转写在kept为undefined时仍写[image attached]；earlier image omitted只在存在kept集合且当前key不在集合时出现，不能覆盖这个无图降级路径。因此原始messages仍有图像块并进入序列化时，可能没有实际图片引用却仍告诉模型图已附上。必需图片任务可能得到看似成功的无图回答；这是跨文件分支推导，尚未做宿主复现，不能报告实际发生频率。

上下文有full与chained，默认full每轮重发，chained依赖网页父消息链，只发增量。链包含账号、会话、固定头和历史，切号、换会话或头变化等条件会改变投喂决策；工具协议在链首，长会话服务器可能丢早期上下文，这个限制源码说明得很明确。减少请求字符串不等于减少模型实际token或保持语义，尤其不能把链式与全量结果直接当相同质量。

网页会话复用与清理是有远端副作用的状态。session-journal按账号保存“可能仍需删除”的会话，确认删除后才移除，强杀/删除失败留记录供后续扫尾；卸载退役复用槽并尽力flush，但不等待所有网络请求完成。因此“清理已安排”不等于远端已删除，用户自己的网页会话也不应被插件误认作应删对象。不同cleanup模式、保留设置和账号变化都影响实际数据留存。

本轮未执行网页请求、图片或长上下文任务，不能复述作者注释中的本机经历为独立复现。采用核心质疑是：为维持会话而发生的降级是否仍满足原任务，用户能否识别“只办了一部分”。使用时应从任务所需证据倒查，而不是只检查provider还在模型列表。

#### 证据与依据

**依据 1 · 源码核查**：[src/adapter.ts:244-252](https://github.com/cv-superding/dsh-deepseek-web-login/blob/cfd684daf5f05cb09af2643073df38bcabe5e77c/src/adapter.ts#L244-L252)

图片拒绝只在未交付内容时重试。

```text
 * 三个条件缺一不可：
 *  · 错误是**请求侧的图片引用被拒**（上传侧的 code 9 是另一回事，见 isInvalidRefFileError）
 *  · 这次请求**一个字都还没吐给上层** —— generator 已 yield 的内容撤不回来，
 *    重试只会让用户看到重复输出
 *  · 还没用完两次机会
 */
export function canRetryImageReject(error: any, yielded: boolean, attempt: number): boolean {
  return error?.code === 'INVALID_REF_FILE' && !yielded && attempt < 2
}
```

**依据 2 · 源码核查**：[src/adapter.ts:1087-1102](https://github.com/cv-superding/dsh-deepseek-web-login/blob/cfd684daf5f05cb09af2643073df38bcabe5e77c/src/adapter.ts#L1087-L1102)

有界重试与最终skipImages。

<details>
<summary>查看原文（16行）</summary>

```text
    while (true) {
      let yielded = false
      const inner = streamImpl(current)
      try {
        while (true) {
          const step = await inner.next()
          if (step.done === true) return
          yielded = true
          yield step.value
        }
      } catch (error: any) {
        if (!canRetryImageReject(error, yielded, attempt)) throw error
        attempt += 1
        current = attempt === 1 ? { ...options, __retryImages: true } : { ...options, __skipImages: true }
        logger?.warn?.(
          attempt === 1
```

</details>

**依据 3 · 源码核查**：[src/adapter.ts:1248-1273](https://github.com/cv-superding/dsh-deepseek-web-login/blob/cfd684daf5f05cb09af2643073df38bcabe5e77c/src/adapter.ts#L1248-L1273)

无图重试把keptKeys置undefined并传给序列化。

<details>
<summary>查看原文（26行）</summary>

```text
    //
    // `__skipImages`（降级重试的第二级）：连着两次都不被认，就**不带图**再发一次。
    // 宁可这一轮没有图，也不能让会话卡在"每轮都失败"上 —— 那等于整个会话作废。
    const uploaded =
      options?.__skipImages === true
        ? { ids: [], keys: undefined, keptKeys: undefined, notice: undefined }
        : await uploadRequestImages(auth, options?.messages, options?.signal)
    // ⚠️ 0.1.82：`__skipImages`（不带图重发）**绝不能**更新 lastImageKeys ——
    // 它记的是"上一轮那批 key 的 file_id 被服务端拒过"，抹成空集就等于下一轮
    // 又从中毒缓存出发，重演"2 次注定被拒 + 1 次无图"。
    if (uploaded.keptKeys) lastImageKeys = uploaded.keptKeys
    const refFileIds = uploaded.ids

    // 链式投喂需要 prompt 的**结构**（固定头 + 未截断的历史条目）才能算增量，
    // 所以这里取 parts、下面的 params 一起把 entries 传下去（见 context-feed.ts）。
    let promptParts = serializePromptParts({
      system: options?.system,
      messages: options?.messages ?? [],
      tools: (options?.tools ?? []) as ToolSchemaLike[],
      maxChars: deps.config.maxPromptChars ?? DEFAULT_MAX_PROMPT_CHARS,
      // 「一次一个工具」开关：只换协议指令那一段，其余 prompt 结构不变（**缺省＝串行**）。
      serialToolCalls: deps.config.serialToolCalls !== false,
      // 只对**首轮**传：它才是真正带 ref_file_ids 的那一次（续写轮 refFileIds 传空）。
      // 传了之后，被长度控制略过的图会写成 `[earlier image omitted]` 而不是 `[image attached]`
      // —— 标记与实发必须一致，否则模型会对着没送出去的图瞎猜。
      keptImageKeys: uploaded.keptKeys,
```

</details>

**依据 4 · 源码核查**：[src/protocol.ts:642-666](https://github.com/cv-superding/dsh-deepseek-web-login/blob/cfd684daf5f05cb09af2643073df38bcabe5e77c/src/protocol.ts#L642-L666)

kept未定义时仍标image attached，不能套用长度截断的omitted说明。

<details>
<summary>查看原文（25行）</summary>

```text
 * 最近的 N 张，更早的会被略过；此时若标记仍一律写 `[image attached]`，模型就会**以为它
 * 收到了那些图**，然后对着没送出去的图瞎猜。所以分两种标记写。
 *
 * ⚠️ **必须按顺序逐个产出，不能写成「N 个 attached 再 M 个 omitted」** ——
 * 那样标记的先后就不再对应图片的时间先后，模型会搞不清被省略的是哪几张。
 *
 * `kept` 为 undefined 时全部算「已发出」（＝ 0.1.77 之前的行为，续写轮与既有单测走这条路）；
 * 图没有 `attachmentId` 时也算「已发出」—— 那种情况判断不了，保守起见别把真发出去的标成省略。
 */
function blockImageMarks(
  blocks: readonly any[] | undefined,
  kept: ReadonlySet<string> | undefined,
): string[] {
  const marks: string[] = []
  const walk = (list: readonly any[] | undefined): void => {
    for (const block of list ?? []) {
      if (!block || typeof block !== 'object') continue
      if (block.type === 'image') {
        const key = String(block.attachment?.attachmentId ?? '')
        marks.push(!kept || !key || kept.has(key) ? '[image attached]' : '[earlier image omitted]')
      } else if (block.type === 'tool-result' && Array.isArray(block.content)) walk(block.content)
    }
  }
  walk(blocks)
  return marks
```

</details>

**依据 5 · 源码核查**：[src/context-feed.ts:1-25](https://github.com/cv-superding/dsh-deepseek-web-login/blob/cfd684daf5f05cb09af2643073df38bcabe5e77c/src/context-feed.ts#L1-L25)

full/chained语义及链首丢失风险。

<details>
<summary>查看原文（25行）</summary>

```text
/**
 * 上下文投喂方式 —— 每轮到底给网页端发什么。
 *
 * 两种模式（2026-09-14 加，用户可切换）：
 *
 *   full    每轮重发全量 prompt（默认）。
 *           webapi 每次 completion 都发 `parent_message_id: null`，每条消息都是会话里的
 *           根消息、没有父链 —— 服务端按消息树回溯上下文时回溯到空，**拿不到任何历史**。
 *           所以历史必须由我们自己每轮重发。DSH 的适配器契约本来就是无状态的
 *           （每轮把完整 messages 交给我们），这个模式最稳、行为和 0.1.61 及以前完全一致。
 *
 *   chained 链式投喂：只发**增量**，并把 `parent_message_id` 指向上一轮 assistant 的
 *           message_id，让服务端自己按链维护上下文。
 *           依据（读参考实现 + 抓真实帧，不是推理）：浏览器就是这么干的 ——
 *           参考实现里的 `nextParentMessageId = history?.parentMessageId ?? finalAssistantMessageId`
 *           `interceptor/request-augmentation.ts` 里 `isFirstMessage = parent_message_id === null`
 *           ⇒ 只有会话第一条的 parent 是 null，之后每轮都把上一条消息 id 当 parent 发上去。
 *           本轮 assistant 的 id 来自 SSE 首帧 `event: ready`
 *           （`{"request_message_id":1,"response_message_id":2,...}`，实测样本见
 *           `.workbuddy/tmp/shortq-r1-2026-09-14T04-17-41.sse`）。
 *
 * ⚠️ chained 的代价（必须知道，所以默认不开）：
 *   模型能看到的工具协议、系统提示、历史，全都在**链首那条消息**里；一旦服务端侧
 *   把早期上下文丢掉（长会话/超窗），模型就没有协议可依 —— 可能直接不按 JSON 发工具调用。
 *   本模块的对策是"能省则省、一有不确定就退回全量"：见 decideFeed 的判据。
```

</details>

**依据 6 · 源码核查**：[src/session-journal.ts:12-27](https://github.com/cv-superding/dsh-deepseek-web-login/blob/cfd684daf5f05cb09af2643073df38bcabe5e77c/src/session-journal.ts#L12-L27)

未确认远端删除前保留记录。

<details>
<summary>查看原文（16行）</summary>

```text
 * 证明这些会话确实是本插件建的（不是用户自己的聊天）。
 *
 * ## 做法
 *
 * 把「**还欠一次删除**」的会话按账号落盘：进入复用槽时记一条、进入待删队列时记一条，
 * **确认删掉之后才移除**。于是文件始终等于"服务端可能还留着、我们打算删"的集合：
 *
 *   - 正常退出：teardown 退役槽 + flush，删成功的会各自把记录摘掉；文件自然变空；
 *   - 被强杀：记录原样留着 → **下次启动扫尾**，按账号排进清理器补删；
 *   - 删失败：记录留着，下次启动再试（不会"记录没了、会话还在"）。
 *
 * 为什么记账号：网页端删除必须用**会话所属账号**的凭证 —— 拿 A 的凭证去删 B 的会话，
 * 轻则被服务端拒绝，重则 resp.ok 时被当成全部成功（见 CHANGELOG 的 F07）。
 *
 * 为什么不会越攒越多：一次模型调用最多让池子里多一个会话（20 轮复用），
 * 而这里只记"还没删掉的"，稳态就是 0~1 条。
```

</details>

**依据 7 · 源码核查**：[src/index.ts:2310-2333](https://github.com/cv-superding/dsh-deepseek-web-login/blob/cfd684daf5f05cb09af2643073df38bcabe5e77c/src/index.ts#L2310-L2333)

卸载尽力清理而不等待网络完成。

<details>
<summary>查看原文（24行）</summary>

```text

  // 3) 卸载即净：关登录窗口与定时器；**退出时把欠删的会话交出去**。不清理凭证 ——
  //    卸载/热重载插件不等于登出。
  ctx.effect(() => () => {
    try {
      if (isLoginWindowOpen()) closeLoginWindow()
    } catch {}
    // 2026-09-14：退出收尾。顺序很重要 ——
    //   ① `disposeSessionReuse()` 把复用槽里的会话**交回它自己的清理回调**（排队待删）。
    //      只清槽不排队 = 每次退出白丢一个会话（实测就是这么堆起来的）。
    //   ② `flush()` 尽力把队列里的删掉（同步返回，不等网络完成 —— 宿主的卸载流程
    //      不会为一个网络请求停留）。
    // 于是删不掉的仍会留在 `session-journal` 的记录里（记录只在**确认删掉**时摘除），
    // 下次启动的补删会接上。被强杀时同理。
    try {
      disposeSessionReuse()
    } catch {}
    try {
      void sessionCleaner.flush()
    } catch {}
    try {
      void shutdownBrowserTransport()
    } catch {}
  }, 'dsh-deepseek-web-login: teardown')
```

</details>

#### 缺口

- 图像降级提示、长链语义及清理结果未实测
  **影响**：不能声称恢复后仍保持任务合格或远端数据全清
  **进一步探讨**：分别构造必需图片、早期约束、切号和删除失败样本，核对最终回答与远端状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 凭证和浏览器生命周期有什么权限与退出边界？

**研究主题**：依赖、兼容与流程、工程质量与复用

#### 完整回答

凭证是可恢复网页版登录的token、cookie及请求头，保存在插件自治web-login/accounts目录，不在通用settings中。accounts原子写从临时文件创建起用0600，rename失败不先删原件；这比“先删后写”更保留恢复性，但它仍是本机明文凭证，Windows访问控制也不能只用Unix mode推断。导出备份会额外产生完整凭据文件；/accounts/export-json还会把明文交给界面，不能因为账号列表已掩码就说全部HTTP不含凭据。

Host API入口直接按route分派。本次index中未见独立Origin/loopback认证守卫；导出注释提到本机同源假设，但不能用注释证明插件自身执行了它。实际宿主可能提供外层访问控制，本轮没有核验部署，因此只适合按受信本地单用户前提理解，不把端点作为已隔离的多用户服务。

浏览器传输通过独立profile与CDP在页面上下文发请求，缺浏览器或启动失败会影响推理；这不是无额外进程的API adapter。卸载会关登录窗口、清理会话并shutdown传输，但明确保留凭据。logout另行移除当前凭据并清浏览器登录profile/分区，返回partitionCleared说明是否全清；账号移除直接删文件，没有假装“改名备份等于已登出”。已经导出的备份或其他账号不因当前登出自动消失。

值得借鉴的是账号稳定ID、删除确认前持久化清理义务、登出与卸载语义分开。移植成本包括浏览器生命周期、账号切换同步、文件权限和宿主访问控制；本次没有完整安全审计所有端点或证明登录态不被外部读取。

#### 证据与依据

**依据 1 · 源码核查**：[src/auth.ts:1-12](https://github.com/cv-superding/dsh-deepseek-web-login/blob/cfd684daf5f05cb09af2643073df38bcabe5e77c/src/auth.ts#L1-L12)

凭证门面与本机位置。

<details>
<summary>查看原文（12行）</summary>

```text
/**
 * dsh-deepseek-web-login — 凭证存储与结构化错误。
 *
 * 登录凭证来自 chat.deepseek.com 网页端（浏览器窗口捕获或手动粘贴）：
 * Bearer token + cookie + 反爬指纹头（x-hif-*）+ PoW WASM 地址。
 *
 * 存储已从「单个文件」升级成「**账号库**」（见 accounts.ts）：本文件只保留
 * 类型 + 存取门面 —— `readAuth()` 取当前生效的账号、`writeAuth()` 写入并设为当前、
 * `clearAuth()` 移除当前账号。这样适配器、登录流程、诊断等**所有调用点一行都不用改**。
 *
 * 位置：`${DSH_HOME || ~/.dsh}/web-login/accounts/<id>.json`（插件自治，
 * 不进 settings/credentials 缝合口，避免敏感凭据落入通用配置面）。
```

</details>

**依据 2 · 源码核查**：[src/accounts.ts:190-215](https://github.com/cv-superding/dsh-deepseek-web-login/blob/cfd684daf5f05cb09af2643073df38bcabe5e77c/src/accounts.ts#L190-L215)

明文JSON和原子替换权限。

<details>
<summary>查看原文（26行）</summary>

```text
export function writeJsonAtomic(file: string, value: unknown): void {
  mkdirSync(join(file, '..'), { recursive: true })
  const tmp = `${file}.tmp-${process.pid}`
  // 临时文件从创建起就是 0600：它装的是**可完整登录的凭证**，
  // 旧写法先按默认权限（受 umask 影响，常见 0644）落地、事后再 chmod，中间有暴露窗口。
  writeFileSync(tmp, JSON.stringify(value, null, 2), { encoding: 'utf8', mode: 0o600 })
  // ⚠️ F02（2026-09-12 审计）：旧写法是「先 rmSync 目标文件，再 rename 过去」——
  // 一旦 rename 失败（磁盘满 / 占用 / 权限），**原文件已经没了**，凭证直接丢失。
  // 而在 Windows 上 `fs.renameSync` 本来就能直接覆盖已存在的目标文件
  // （实测 win32 + Node 22：renameSync 成功覆盖，目标变新内容，临时文件消失），
  // 所以那句 rmSync 既没必要、也是唯一的丢数据风险点。去掉之后：
  // rename 失败 → 清掉临时文件 → 原文件完好无损。
  try {
    renameSync(tmp, file)
  } catch (error) {
    try {
      rmSync(tmp, { force: true })
    } catch {}
    throw error
  }
  if (process.platform !== 'win32') {
    try {
      chmodSync(file, 0o600)
    } catch {}
  }
}
```

</details>

**依据 3 · 源码核查**：[src/accounts.ts:375-385](https://github.com/cv-superding/dsh-deepseek-web-login/blob/cfd684daf5f05cb09af2643073df38bcabe5e77c/src/accounts.ts#L375-L385)

删除账号文件与清当前选择。

<details>
<summary>查看原文（11行）</summary>

```text
export function removeAccount(id: string): boolean {
  const file = accountFilePath(id)
  if (!existsSync(file)) return false
  try {
    rmSync(file, { force: true })
  } catch {
    return false
  }
  if (readIndex().activeId === id) clearActiveAccount()
  return true
}
```

</details>

**依据 4 · 源码核查**：[src/index.ts:1106-1117](https://github.com/cv-superding/dsh-deepseek-web-login/blob/cfd684daf5f05cb09af2643073df38bcabe5e77c/src/index.ts#L1106-L1117)

路由入口没有此处独立认证检查。

<details>
<summary>查看原文（12行）</summary>

```text
  ctx.effect(
    () =>
      ctx.webServer.register({
        kind: 'prefix',
        path: API_PREFIX,
        handler: async (req: any, res: any) => {
          const url = new URL(String(req.url ?? '/'), 'http://127.0.0.1')
          const route = url.pathname.slice(API_PREFIX.length) || '/'

          try {
            // 请求节流设置（设置页的开关与滑块）——读写都即时生效，并持久化到 gate.json
            if (req.method === 'GET' && route === '/gate') {
```

</details>

**依据 5 · 源码核查**：[src/index.ts:1553-1577](https://github.com/cv-superding/dsh-deepseek-web-login/blob/cfd684daf5f05cb09af2643073df38bcabe5e77c/src/index.ts#L1553-L1577)

两种凭据导出边界。

<details>
<summary>查看原文（25行）</summary>

```text
            if (req.method === 'POST' && route === '/accounts/export') {
              try {
                const result = exportAccountsToFile()
                sendJson(res, 200, { ok: true, ...result, warning: '导出文件含可完整登录的凭证，请妥善保管、勿分享' })
              } catch (error: any) {
                sendJson(res, 500, { ok: false, error: `导出失败：${error?.message ?? error}` })
              }
              return
            }
            // 首选路径：界面弹系统「另存为」让用户自己选位置与文件名，然后把内容写进去。
            //
            // ⚠️ 这一条会把**明文凭证**交给渲染进程（本机回环 + DSH 同源守卫）。
            // 为什么躲不开：要"让用户选保存位置"，只有渲染进程能弹系统对话框；
            // 而写盘必须由拿到那份数据的一方做。反过来"宿主只收一个路径"做不到 ——
            // File System Access 只给 FileSystemFileHandle、不暴露路径，宿主无从代写。
            // 权衡后接受：能读到这个响应的，本来就以本机同用户进程为主，
            // 而插件宿主自身有完整 fs 权限、直接读账号文件更省事，边际风险接近于零。
            // 不接受的场景也有出口：/accounts/export（上面那条）始终保留，凭证不出宿主。
            if (req.method === 'POST' && route === '/accounts/export-json') {
              try {
                sendJson(res, 200, { ok: true, ...exportAccounts() })
              } catch (error: any) {
                sendJson(res, 500, { ok: false, error: `导出失败：${error?.message ?? error}` })
              }
              return
```

</details>

**依据 6 · 源码核查**：[src/login.ts:919-938](https://github.com/cv-superding/dsh-deepseek-web-login/blob/cfd684daf5f05cb09af2643073df38bcabe5e77c/src/login.ts#L919-L938)

登出及浏览器清理返回边界。

<details>
<summary>查看原文（20行）</summary>

```text
export async function logout(): Promise<boolean> {
  closeLoginWindow()
  clearAuth()
  // 浏览器登录用的独立 profile 也是一个「登录态存放处」，退出要一起清 ——
  // 否则再点登录会直接复用里面的登录态，等于没退出。
  const browserProfileCleared = clearBrowserLoginProfile()
  // ⚠️ 必须 await：调用方（面板的「退出并登录其它账号」）紧接着就会打开登录窗口，
  // 分区没清完的话新窗口会带着旧账号的 cookie 打开 → 又登录回同一个账号。
  const partitionCleared = await clearLoginPartition().catch(() => false)
  // 0.1.84（R7）：不能用 || 掩盖 —— profile 没清 = 浏览器里还留着登录态，下次「浏览器窗口登录」
  // 会直接复用旧登录态（等于没退出，上面注释自己写了这个后果）。
  // 分区维度只在「环境真有 Electron」时才考核：桌面外环境没有分区可清，不该拖后腿。
  const partitionOK = partitionCleared || !electronAvailable()
  const cleared = browserProfileCleared && partitionOK
  lastResult = {
    ok: true,
    message: cleared
      ? '已退出登录：本地凭证与浏览器登录态都已清除'
      : !browserProfileCleared
        ? '已退出登录：本地凭证已清除，但**浏览器登录态未清掉**（浏览器窗口还开着或进程残留）——下次「浏览器窗口登录」会直接复用旧登录态，相当于没退出；请关掉浏览器后重试'
```

</details>

**依据 7 · 源码核查**：[src/browser-transport.ts:604-618](https://github.com/cv-superding/dsh-deepseek-web-login/blob/cfd684daf5f05cb09af2643073df38bcabe5e77c/src/browser-transport.ts#L604-L618)

实际启动外部浏览器。

<details>
<summary>查看原文（15行）</summary>

```text
export async function launchBrowserTransport(): Promise<BrowserTransportSession> {
  if (activeSession) return activeSession
  if (launchPromise) return launchPromise

  launchPromise = (async () => {
    const browser = findSystemBrowser()
    if (!browser) throw new Error('未找到 Edge/Chrome，无法启动浏览器代理传输层')

    await prepareTransportProfile(PROFILE_DIR, waitForPreviousTransportExit)

    const child = spawn(
      browser.path,
      transportBrowserArgs(PROFILE_DIR, transportPageUserAgent()),
      {
        stdio: 'ignore',
```

</details>

**依据 8 · 源码核查**：[src/index.ts:2310-2333](https://github.com/cv-superding/dsh-deepseek-web-login/blob/cfd684daf5f05cb09af2643073df38bcabe5e77c/src/index.ts#L2310-L2333)

卸载不等于登出。

<details>
<summary>查看原文（24行）</summary>

```text

  // 3) 卸载即净：关登录窗口与定时器；**退出时把欠删的会话交出去**。不清理凭证 ——
  //    卸载/热重载插件不等于登出。
  ctx.effect(() => () => {
    try {
      if (isLoginWindowOpen()) closeLoginWindow()
    } catch {}
    // 2026-09-14：退出收尾。顺序很重要 ——
    //   ① `disposeSessionReuse()` 把复用槽里的会话**交回它自己的清理回调**（排队待删）。
    //      只清槽不排队 = 每次退出白丢一个会话（实测就是这么堆起来的）。
    //   ② `flush()` 尽力把队列里的删掉（同步返回，不等网络完成 —— 宿主的卸载流程
    //      不会为一个网络请求停留）。
    // 于是删不掉的仍会留在 `session-journal` 的记录里（记录只在**确认删掉**时摘除），
    // 下次启动的补删会接上。被强杀时同理。
    try {
      disposeSessionReuse()
    } catch {}
    try {
      void sessionCleaner.flush()
    } catch {}
    try {
      void shutdownBrowserTransport()
    } catch {}
  }, 'dsh-deepseek-web-login: teardown')
```

</details>

#### 缺口

- 宿主外层API访问控制与目标OS凭据隔离未核实
  **影响**：不能确认共享、公网或多用户部署的隔离条件
  **进一步探讨**：后续核对宿主认证、端点可达范围和OS账号权限；没有证据前不扩大采用范围。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 采用总成本和可验证新方向是什么？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

采用暂列观察。虽然工具事件桥与本机状态管理有具体实现，但网页登录资格、真实闭环和宿主保护未获本轮证据；维护私有协议和明文登录态的负担也比普通供应商配置大。正式API或已经验证的供应商是可行退路，不因模型列表出现就让关键任务自动迁入。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node ^22.18.0或>=24.11.0、DSH llm/webServer | 启动必需 | adapter与设置面板 | 加载或API不兼容 |
| Chrome/Edge与可用网页登录态 | 推理必需 | 页面请求与账号资格 | 需重新登录或明确失败 |
| 私有接口、浏览器/CDP与协议兼容 | 持续必需 | 消息、图片、工具块 | 格式错误、断流或降级 |
| 本机目录权限与宿主访问控制 | 凭据使用必需 | 账号/备份/清理义务 | 不能按多用户隔离使用 |
| 真实工具与任务验收 | Agent任务必需 | 验证参数、副作用和结果 | 模型文本不算办结 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户核对宿主保护和凭据保存范围 | 接受非官方接口与浏览器维护 |
| 登录 | 用户在独立浏览器完成授权 | 掩码状态不等于已验证服务资格 |
| 查询 | 先只读、再有限可逆工具任务 | 核对真实调用和结果继续决策 |
| 恢复 | 用户识别丢图、断流或账号失效 | 必需输入缺失即任务不合格 |
| 退出 | 用户明确登出并核对profile/备份 | 卸载不代替清凭据，远端清理要确认 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 浏览器、磁盘与网络；金额未知 | 登录、配置、核对保护；耗时未知 | 网页额度不是稳定API预算 |
| 持续使用 | 模型请求、浏览器进程及历史输入量未知 | 格式、上下文、图片与结果复核 | 协议变动需维护 |
| 失败恢复 | 多次请求、重新上传与会话资源未知 | 重登、检查降级和远端遗留 | 有回答不等于保留原任务语义 |
| 升级退出 | 备份与清理资源未知 | 清账号/profile、检查journal及导出 | 凭据备份独立留存 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| DSH工具桥 | prompt→解析→tool-call事件链 | 同版本真实工具闭环可靠性 |
| 上下文管理 | full/chained与会话状态机制 | 合格率、token净节省 |
| 图像恢复 | 未yield守卫和无图退路 | 必需图像任务是否正确拒绝办结 |
| 成本与供给 | 使用网页登录而非API Key | 资格、额度和全周期经济性 |

新假设是以“输入仍齐备、调用真的执行、结果已核对”三类任务级状态公开恢复结果，而不只显示provider在线，可能减少有回答却漏掉必需图片/工具的假完成。最小验证固定任务和输入，比较本版、正式API基线及显式降级状态方案，记录合格交付、遗漏、人工修正、请求量和时间。只在遗漏减少且投入可接受时继续；若私有接口变动使维护和返工长期高于可用替代，应停止。这个方案未实现，也不证明新的商业机会。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:61-68](https://github.com/cv-superding/dsh-deepseek-web-login/blob/cfd684daf5f05cb09af2643073df38bcabe5e77c/package.json#L61-L68)

实际Node和构建脚本声明。

```text
  "scripts": {
    "build": "node scripts/build.mjs",
    "test": "node scripts/test-offline.mjs",
    "prepare": "node scripts/prepare.mjs"
  },
  "engines": {
    "node": "^22.18.0 || >=24.11.0"
  },
```

**依据 2 · 源码核查**：[src/adapter.ts:1332-1345](https://github.com/cv-superding/dsh-deepseek-web-login/blob/cfd684daf5f05cb09af2643073df38bcabe5e77c/src/adapter.ts#L1332-L1345)

工具桥实现支持而非运行证明。

<details>
<summary>查看原文（14行）</summary>

```text
    const emitCalls = function* (calls: readonly { id: string; name: string; arguments: string }[], fenced?: boolean): Generator<any> {
      // 🔴 0.6.39：记下这批调用是不是围栏包裹的（`undefined` = 本次没发出调用，不覆盖已有值）。
      if (calls.length > 0) callShape = fenced ? 'fenced' : 'bare'
      for (const call of calls) {
        const index = nextIndex++
        toolCallCount += 1
        yield { type: 'block-start', index, blockType: 'tool-call' }
        yield { type: 'tool-call-delta', index, id: call.id, name: call.name, argumentsDelta: call.arguments }
        yield {
          type: 'block-end',
          index,
          block: { type: 'tool-call', id: call.id, name: call.name, arguments: call.arguments },
        }
      }
```

</details>

**依据 3 · 源码核查**：[src/adapter.ts:1087-1102](https://github.com/cv-superding/dsh-deepseek-web-login/blob/cfd684daf5f05cb09af2643073df38bcabe5e77c/src/adapter.ts#L1087-L1102)

降级影响任务输入。

<details>
<summary>查看原文（16行）</summary>

```text
    while (true) {
      let yielded = false
      const inner = streamImpl(current)
      try {
        while (true) {
          const step = await inner.next()
          if (step.done === true) return
          yielded = true
          yield step.value
        }
      } catch (error: any) {
        if (!canRetryImageReject(error, yielded, attempt)) throw error
        attempt += 1
        current = attempt === 1 ? { ...options, __retryImages: true } : { ...options, __skipImages: true }
        logger?.warn?.(
          attempt === 1
```

</details>

**依据 4 · 源码核查**：[src/accounts.ts:190-215](https://github.com/cv-superding/dsh-deepseek-web-login/blob/cfd684daf5f05cb09af2643073df38bcabe5e77c/src/accounts.ts#L190-L215)

明文凭据托管负担。

<details>
<summary>查看原文（26行）</summary>

```text
export function writeJsonAtomic(file: string, value: unknown): void {
  mkdirSync(join(file, '..'), { recursive: true })
  const tmp = `${file}.tmp-${process.pid}`
  // 临时文件从创建起就是 0600：它装的是**可完整登录的凭证**，
  // 旧写法先按默认权限（受 umask 影响，常见 0644）落地、事后再 chmod，中间有暴露窗口。
  writeFileSync(tmp, JSON.stringify(value, null, 2), { encoding: 'utf8', mode: 0o600 })
  // ⚠️ F02（2026-09-12 审计）：旧写法是「先 rmSync 目标文件，再 rename 过去」——
  // 一旦 rename 失败（磁盘满 / 占用 / 权限），**原文件已经没了**，凭证直接丢失。
  // 而在 Windows 上 `fs.renameSync` 本来就能直接覆盖已存在的目标文件
  // （实测 win32 + Node 22：renameSync 成功覆盖，目标变新内容，临时文件消失），
  // 所以那句 rmSync 既没必要、也是唯一的丢数据风险点。去掉之后：
  // rename 失败 → 清掉临时文件 → 原文件完好无损。
  try {
    renameSync(tmp, file)
  } catch (error) {
    try {
      rmSync(tmp, { force: true })
    } catch {}
    throw error
  }
  if (process.platform !== 'win32') {
    try {
      chmodSync(file, 0o600)
    } catch {}
  }
}
```

</details>

**依据 5 · 源码核查**：[src/index.ts:2310-2333](https://github.com/cv-superding/dsh-deepseek-web-login/blob/cfd684daf5f05cb09af2643073df38bcabe5e77c/src/index.ts#L2310-L2333)

退出清理边界。

<details>
<summary>查看原文（24行）</summary>

```text

  // 3) 卸载即净：关登录窗口与定时器；**退出时把欠删的会话交出去**。不清理凭证 ——
  //    卸载/热重载插件不等于登出。
  ctx.effect(() => () => {
    try {
      if (isLoginWindowOpen()) closeLoginWindow()
    } catch {}
    // 2026-09-14：退出收尾。顺序很重要 ——
    //   ① `disposeSessionReuse()` 把复用槽里的会话**交回它自己的清理回调**（排队待删）。
    //      只清槽不排队 = 每次退出白丢一个会话（实测就是这么堆起来的）。
    //   ② `flush()` 尽力把队列里的删掉（同步返回，不等网络完成 —— 宿主的卸载流程
    //      不会为一个网络请求停留）。
    // 于是删不掉的仍会留在 `session-journal` 的记录里（记录只在**确认删掉**时摘除），
    // 下次启动的补删会接上。被强杀时同理。
    try {
      disposeSessionReuse()
    } catch {}
    try {
      void sessionCleaner.flush()
    } catch {}
    try {
      void shutdownBrowserTransport()
    } catch {}
  }, 'dsh-deepseek-web-login: teardown')
```

</details>

#### 缺口

- 没有同任务对照或实际恢复后的合格交付记录
  **影响**：不能确定总体成本与任务级状态方案收益
  **进一步探讨**：以固定非敏感任务做有无降级对照，保留全部失败与人工修正。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
