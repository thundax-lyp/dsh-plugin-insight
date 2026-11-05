# Envoy

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[c639ca5](https://github.com/regrevia/Envoy/tree/c639ca55eb226f7c4dd5c2af48c167a1fcafe3f3/integrations/dsh/envoy-dsh)

<!-- BEGIN META -->
[![GitHub ★ 96](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=96&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/regrevia/Envoy) [![npm 30d 2,394](https://img.shields.io/static/v1?label=npm+30d&message=2%2C394&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/envoy-dsh) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/envoy-dsh)
<!-- END META -->

> **功能**：DSH 子包注册 Envoy Skill、MCP 和链接读取提示，输出可定位资料。

> **亮点**：[Q01](#research-q01) 给公开链接加读取路由和可引用材料路径。

> **主要限制**：[Q02](#research-q02) 需外部 runtime，探索基准不足以证明事实正确。

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
  - [Q01 · DSH 子包如何改变公开链接的读取流程？](#detail-section-11)
  - [Q02 · 后端与基准有什么采用限制？](#detail-section-12)
  - [Q03 · 怎样判断对资料整理有帮助？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户把文章、PDF、音视频链接交给 DSH 整理。

原生读取或人工选择工具并整理材料。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 链接路由 | 提示选读取工具 | 模型仍决定调用 |
| 读取后端 | 返回可定位素材 | 依赖外部 Envoy |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Envoy runtime 和兼容 DSH | 必需 | 提供读取 MCP | 版本不符拒绝或 provision |
| 浏览器、ASR 和站点权限 | 按材料需要 | 渲染和转写 | 登录墙需人工 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 确认 runtime | 固定有权限材料 |
| 读取 | 交链接并检查工具 | 核对返回来源 |
| 写作 | 使用保留材料和定位 | 缺口单独补查 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 下载成本未知 | 配置 runtime 和模型 | 按功能差异 |
| 持续 | 资源未知 | 核对素材和站点变化 | 缓存需维护 |
| 失败 | 人工时间未知 | 按缺口取材 | 登录或验证码单独处理 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 资料读取 | 带来源定位的材料 | 覆盖、正确性和节时 |

> **思考**：[Q02](#research-q02) 需外部 runtime，探索基准不足以证明事实正确。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 给公开链接加读取路由和可引用材料路径。

[Q02](#research-q02) Launcher 可 provision，版本和站点能力都需核对。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 需外部 runtime，探索基准不足以证明事实正确。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 固定链接同预算人工对照。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核对适配、路由和启动；未运行链接读取。

- 已检查：作者 README、包清单、源码路径 integrations/dsh/envoy-dsh/README.md、integrations/dsh/envoy-dsh/index.js、integrations/dsh/envoy-dsh/launch.cjs 及固定范围 inventory；组件：integrations/dsh/envoy-dsh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅固定 DSH 子包，根引擎能力作为作者主张，未运行。
- 下一步：相同时限核对文章、PDF 和视频材料与引用。

**分析版本**

- **仓库**：[regrevia/Envoy](https://github.com/regrevia/Envoy)
- **版本号**：0.1.44（[固定提交 c639ca5](https://github.com/regrevia/Envoy/tree/c639ca55eb226f7c4dd5c2af48c167a1fcafe3f3)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 相同时限比较材料覆盖和事实错误。

相同时限核对文章、PDF 和视频材料与引用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 678 | 443 | 196 | — |
| .js | test | 1 | 166 | 149 | 59 | — |
| .cjs | source | 1 | 270 | 208 | 42 | — |
| .md | source | 3 | 1264 | — | — | 10823 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/regrevia/Envoy/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/regrevia/Envoy/issues?q=is%3Aissue+created%3A2026-10-06T05%3A08%3A46.024Z..2026-11-05T05%3A08%3A46.024Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/regrevia/Envoy/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T05%3A08%3A46.024Z..2026-11-05T05%3A08%3A46.024Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 用户能否从公开链接取得可核对的资料并减少手工选工具？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · DSH 子包如何改变公开链接的读取流程？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

子包挂 Envoy MCP 并注册适配 Skill，在符合条件的首个 step 前插入一条路由提示。它先取得下游决策，判断 enter、当前消息、退出标记及可用公开 URL 后才加消息。相对用户手工选择读取工具，提示引导模型用保留材料与定位信息，但不是强制执行保证。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh/envoy-dsh/README.md:3-14](https://github.com/regrevia/Envoy/blob/c639ca55eb226f7c4dd5c2af48c167a1fcafe3f3/integrations/dsh/envoy-dsh/README.md#L3-L14)

子包三项职责。

<details>
<summary>查看原文（12行）</summary>

```text
This package is a DeepSeek Harness bundle for [Envoy](../../../README.md). It
does three things in one install:

1. mounts Envoy's stdio MCP bridge with `@deepseek-ai/dsh-mcp-client`;
2. registers an adapted Envoy Agent Skill on the public `ctx.skills` service;
3. listens to the `agent/pre-step` event and, on the first step of a turn whose
   user message contains a public link, prepends one short routing message.

The adaptation keeps Envoy's reading, discovery, expansion, visual handoff, and
capability behavior. It changes only the integration surface: the skill uses
the `mcp__envoy__*` tool names that DeepSeek Harness assigns to the mounted
server.
```

</details>

**依据 2 · 源码核查**：[integrations/dsh/envoy-dsh/index.js:640-675](https://github.com/regrevia/Envoy/blob/c639ca55eb226f7c4dd5c2af48c167a1fcafe3f3/integrations/dsh/envoy-dsh/index.js#L640-L675)

下游决策与提示接线。

<details>
<summary>查看原文（36行）</summary>

```text
  if (decision === null || typeof decision !== 'object') return decision
  if (decision.kind !== 'enter') return decision
  if (!Array.isArray(decision.messages) || decision.messages.length === 0) {
    return decision
  }
  if (!shouldInjectLinkRouting(payload)) return decision
  const messages = payload.messages
  if (messages.some(isRoutingMessage)) return decision
  if (decision.messages.some(isRoutingMessage)) return decision
  const text = messages.map(messageText).join('\n')
  if (isOptedOut(text)) return decision
  const urls = routableUrls(text)
  if (urls.length === 0) return decision
  const routingMessage = createRoutingUserMessage(urls, {
    language: detectRoutingLanguage(text),
  })
  return { ...decision, messages: [routingMessage, ...decision.messages] }
}

/**
 * Register the Envoy skill provider synchronously, as `ctx.skills` requires,
 * and install the link-routing waterfall listener.
 * @param {import('cordis').Context} ctx
 */
export function apply(ctx) {
  ctx.skills.registerProvider(() => provider)
  if (typeof ctx.on !== 'function') return
  ctx.on('agent/pre-step', async (payload, next) => {
    const decision = await next()
    try {
      return injectLinkRouting(decision, payload)
    } catch (error) {
      // A routing notice must never break a turn: degrade to the untouched
      // decision, which is what the default handler produced.
      ctx.logger?.warn?.('envoy-dsh: link routing skipped', error)
      return decision
```

</details>

**依据 3 · 源码核查**：[integrations/dsh/envoy-dsh/README.md:18-36](https://github.com/regrevia/Envoy/blob/c639ca55eb226f7c4dd5c2af48c167a1fcafe3f3/integrations/dsh/envoy-dsh/README.md#L18-L36)

作者材料与探索对照。

<details>
<summary>查看原文（19行）</summary>

```text
## One link in, AI-ready material out

Whatever you are looking at, hand it over and get the thing you wanted out:
Markdown, a wiki page, a knowledge-base entry. Douyin, Bilibili, Xiaohongshu,
Zhihu, WeChat posts, articles, PDFs and podcasts all take the same path. A read
returns a source-linked transcript with timestamps, frames, and a `material_id`
you can quote, so the agent writes from what was actually said, not from the title. For a whole feed,
`envoy collect` checkpoints every item, so an interrupted run resumes instead
of restarting.

Measured on 123 live links across those platforms: **80% usable as source
material** — that is 93% of the links that answered at all — with **0 failures**
and every gap named.

Same 60 turns per arm, with and without the bundle: **ends normally without saying
it could not read 22% → 92%**, **times out 68% → 0**, **answer hits at least one
reference-fact keyword 23% → 82%**.
That A/B is exploratory (different caps, no human correctness review); the per-read
behaviour is what the tests assert.
```

</details>

#### 缺口

- 没有独立读取或正确性测试
  **影响**：无法证明材料覆盖与模型服从提示
  **进一步探讨**：同一链接比对实际素材、缺口和引用

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 后端与基准有什么采用限制？

**研究主题**：工程质量与复用、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

launch 解析外部或私有 runtime，外部版本不足会拒绝，私有缺失则尝试 provision，再以 stdio 启 MCP。依赖浏览器、ASR、网络及站点登录条件。作者 A/B 时间上限不同且无人工正确性复核，不能用完成比例证明答案质量。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh/envoy-dsh/launch.cjs:227-246](https://github.com/regrevia/Envoy/blob/c639ca55eb226f7c4dd5c2af48c167a1fcafe3f3/integrations/dsh/envoy-dsh/launch.cjs#L227-L246)

版本和自动 provision。

<details>
<summary>查看原文（20行）</summary>

```text
  if (binary) {
    const have = versionOf(binary)
    if (have && atLeast(have, REQUIRED)) return binary
    if (external) {
      fail(
        binary + ' is Envoy ' + (have || 'unknown') + ', this DSH bundle needs >=' + REQUIRED +
        '; upgrade that install (uv tool upgrade envoy-cli, or brew/uv accordingly) or unset ' +
        'ENVOY_BIN / PATH envoy so the bundle provisions its own runtime',
      )
    }
    process.stderr.write(
      'envoy-dsh: upgrading the bundled runtime from ' + (have || 'unknown') + ' to ' + VERSION +
      '; the Envoy settings and downloaded models are kept\n',
    )
  }

  provision()
  if (!existsSync(RUNTIME_BIN)) fail('runtime install finished without ' + RUNTIME_BIN)
  if (!versionOf(RUNTIME_BIN)) fail('cannot run ' + RUNTIME_BIN + ' --version after install')
  return RUNTIME_BIN
```

</details>

**依据 2 · 源码核查**：[integrations/dsh/envoy-dsh/launch.cjs:249-270](https://github.com/regrevia/Envoy/blob/c639ca55eb226f7c4dd5c2af48c167a1fcafe3f3/integrations/dsh/envoy-dsh/launch.cjs#L249-L270)

MCP 子进程。

<details>
<summary>查看原文（22行）</summary>

```text
const binary = resolveRuntime()

// Hand the process over to `envoy mcp`. The MCP client talks to this process
// over stdio, so the child's stdio is wired straight to this process's own
// handles rather than 'inherit': under a cmd.exe hop the inherited console
// handles are not the pipes the MCP client reads, and the handshake goes
// silent. Passing process.stdin/stdout/stderr keeps the same descriptors.
const env = Object.assign({}, process.env)
env.PATH = env.PATH ? BIN_DIR + delimiter + env.PATH : BIN_DIR
if (IS_WINDOWS && !env.PATHEXT) env.PATHEXT = '.COM;.EXE;.BAT;.CMD'

// A .cmd shim (what `install.ps1` puts on PATH) needs cmd.exe to start.
const [command, commandArgs] = shellInvocation(binary, ['mcp'])
const child = spawn(command, commandArgs, {
  stdio: [process.stdin, process.stdout, process.stderr],
  env,
})
child.on('error', (error) => fail('cannot start ' + binary + ': ' + error.message))
child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal)
  process.exit(code === null ? 1 : code)
})
```

</details>

**依据 3 · 源码核查**：[integrations/dsh/envoy-dsh/README.md:58-70](https://github.com/regrevia/Envoy/blob/c639ca55eb226f7c4dd5c2af48c167a1fcafe3f3/integrations/dsh/envoy-dsh/README.md#L58-L70)

作者对比限制。

<details>
<summary>查看原文（13行）</summary>

```text
The turn-level A/B we ran is exploratory, not a claim: the two arms had
different time limits (900 s and 2400 s) and one arm was graded terminal-only.
Article-level citation counts came out level within noise over 60 turns per arm.
What this bundle guarantees is the per-read behaviour above, and the tests
assert it.

## What stays the same without the bundle

Reading a link without Envoy still works. What the bundle adds is not a new
capability the model lacks, but a bounded one: declared visual input, a
retained material you can search instead of re-fetching, an explicit gap when
a source cannot be read, and a human step instead of an executable command
when the page needs one.
```

</details>

#### 缺口

- 实际站点、登录和依赖下载未测
  **影响**：首次安装体积及材料质量未知
  **进一步探讨**：逐站点验证登录墙、失败状态和素材来源

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样判断对资料整理有帮助？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

固定少量文章、PDF 和公开视频，在隔离环境对照原生读取与此 bundle，按同一时限人工标注正文覆盖、时间定位和事实错误。先预装或确认 runtime 与可选模型，只使用本人有权访问的材料。若无法核对保留材料或结果只剩标题，就回到人工取材。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh/envoy-dsh/README.md:49-60](https://github.com/regrevia/Envoy/blob/c639ca55eb226f7c4dd5c2af48c167a1fcafe3f3/integrations/dsh/envoy-dsh/README.md#L49-L60)

材料类型及对照限制。

<details>
<summary>查看原文（12行）</summary>

```text
| Ask | Harness on its own | With this bundle |
| --- | --- | --- |
| Long article, WeChat post, Zhihu column | Truncated text, or only the digest | Body text with headings and source locators |
| PDF | First pages, or a screenshot of the page | Per-page text with page numbers and locators |
| Video (Douyin, Bilibili) | Title, cover, description, danmaku | Bound player file; captions or ASR with a coverage figure; frames when the host declares it can show them |
| Audio | Nothing usable | Timestamped transcript; low confidence and no-speech are stated, not hidden |
| Login wall | 403, empty body, or a captcha page | `challenge_required` plus the human step: import cookies for one site scope, or sign in once |
| Unreadable page | A plausible guess | `partial` with the part that was read, and the gap named |

The turn-level A/B we ran is exploratory, not a claim: the two arms had
different time limits (900 s and 2400 s) and one arm was graded terminal-only.
Article-level citation counts came out level within noise over 60 turns per arm.
```

</details>

**依据 2 · 源码核查**：[integrations/dsh/envoy-dsh/launch.cjs:227-246](https://github.com/regrevia/Envoy/blob/c639ca55eb226f7c4dd5c2af48c167a1fcafe3f3/integrations/dsh/envoy-dsh/launch.cjs#L227-L246)

版本前置成本。

<details>
<summary>查看原文（20行）</summary>

```text
  if (binary) {
    const have = versionOf(binary)
    if (have && atLeast(have, REQUIRED)) return binary
    if (external) {
      fail(
        binary + ' is Envoy ' + (have || 'unknown') + ', this DSH bundle needs >=' + REQUIRED +
        '; upgrade that install (uv tool upgrade envoy-cli, or brew/uv accordingly) or unset ' +
        'ENVOY_BIN / PATH envoy so the bundle provisions its own runtime',
      )
    }
    process.stderr.write(
      'envoy-dsh: upgrading the bundled runtime from ' + (have || 'unknown') + ' to ' + VERSION +
      '; the Envoy settings and downloaded models are kept\n',
    )
  }

  provision()
  if (!existsSync(RUNTIME_BIN)) fail('runtime install finished without ' + RUNTIME_BIN)
  if (!versionOf(RUNTIME_BIN)) fail('cannot run ' + RUNTIME_BIN + ' --version after install')
  return RUNTIME_BIN
```

</details>

#### 缺口

- 人工正确性和任务收益未知
  **影响**：不能推算文章产出效率
  **进一步探讨**：同一时限盲评并记录失败与人工步骤

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
