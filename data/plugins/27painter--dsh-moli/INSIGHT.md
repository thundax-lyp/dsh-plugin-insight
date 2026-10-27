# dsh-moli

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[56a2872](https://github.com/27painter/dsh-moli/tree/56a28721fc2977f450d3ada9f03acad50e9b97d4)

<!-- BEGIN META -->
[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/27painter/dsh-moli) [![npm 30d 1,991](https://img.shields.io/static/v1?label=npm+30d&message=1%2C991&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-moli) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-moli)
<!-- END META -->

> **功能**：将本地 Moli 无头浏览器接入 DSH，提供渲染抓取、选择器读取、截图、PDF与引擎探测。

> **亮点**：把上游浏览器接为DSH工具，并显式处理选择器互斥、空输出和二进制结果；渲染能力归Moli上游，不能把字符样本推成通用收益。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：默认insecureTls:true降低证书核验；抓取使用spawnSync可能占用宿主事件循环，安装器摘要若无受信预期值也不提供来源认证。[Q03](#research-q03) [Q04](#research-q04)

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
  - [Q01 · 本插件相对web_fetch和直接运行Moli，实际增加了什么？](#detail-section-11)
  - [Q02 · 选择器、滚动和输出如何保持不被静默忽略？](#detail-section-12)
  - [Q03 · 可信抓取与共享宿主响应性受到什么关键限制？](#detail-section-13)
  - [Q04 · 引擎安装、持续抓取和失败退出有哪些投入？](#detail-section-14)
  - [Q05 · 什么最小改造能同时改善来源可信度和宿主响应？](#detail-section-15)
  - [Q06 · 当前应观察还是可直接用于生产网页任务？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要读取动态网页、特定容器或截图的DSH用户；静态正文已有web_fetch时无需浏览器。[Q01](#research-q01)

普通fetch适合静态正文，独立运行Moli适合不需DSH接线的任务；本插件不证明普遍更快。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| moli_fetch | 渲染、选择器、截图与PDF | 独立Moli；selector互斥；默认TLS需审 |
| moli_probe | 定位与探测引擎、可选安装 | 安装会运行第三方脚本；摘要认证需受信预期值 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH与Node>=20.12 | 启动必需 | 工具注册 | 核对兼容 |
| 匹配平台Moli | 抓取必需 | 渲染网页 | 先审来源再安装 |
| 网络与严格TLS | 可信抓取必需 | 获取目标页 | 不以不安全默认掩盖错误 |
| cookie/profile | 登录任务才需 | 保持会话 | 不保证公开fetch即可代替 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户核定引擎和TLS | 路径、版本、来源明确 |
| 探测 | 用户调用probe | 不把可执行等同所有网站通过 |
| 抓取 | Agent选择dump或selector | 冲突参数明确拒绝 |
| 核对 | 用户检查页面状态与输出 | 缺内容或宿主停顿即停止 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 引擎下载、宿主与磁盘；金额未知 | 核对平台、引擎来源、TLS和代理；时间未知 | npm包不含引擎 |
| 持续使用 | 浏览器资源、模型上下文和输出存储 | 核对内容与选择器 | 合格任务成本未测 |
| 失败恢复 | 重试及引擎诊断资源 | 区分HTTP、等待、选择器和输出错误 | 不应把所有失败当需重装 |

以状态正确且内容足够的页面结果计量，不能把短输出当合格。[Q04](#research-q04)

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 动态网页 | CLI渲染接线 | 真实网站兼容及内容完整性 |
| 定向读取 | 选择器互斥、返回匹配信息 | 净token和合格率 |
| 图像/PDF | 二进制文件路径检查 | 实际生成质量 |

> **思考**：默认insecureTls:true降低证书核验；抓取使用spawnSync可能占用宿主事件循环，安装器摘要若无受信预期值也不提供来源认证。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把上游浏览器接为DSH工具，并显式处理选择器互斥、空输出和二进制结果；渲染能力归Moli上游，不能把字符样本推成通用收益。[Q01](#research-q01) [Q02](#research-q02)

参数冲突转结构化错误、空输出区分与stdout文件描述符可借鉴；迁移需锁定CLI协议，抓取同步与默认TLS策略不能直接沿用。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

默认insecureTls:true降低证书核验；抓取使用spawnSync可能占用宿主事件循环，安装器摘要若无受信预期值也不提供来源认证。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察；先在隔离宿主准备已审引擎并设严格TLS，核对公开页面与退出；敏感登录、共享宿主和高可信取证应暂缓。[Q06](#research-q06)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

工具适配与参数检查有源码支持；跨站效果、真实引擎兼容和宿主响应未实测。受信引擎锁与异步抓取为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、lib/moli.js、lib/install.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交只读入口、runner、安装器、包声明与README；未执行目标代码、验证脚本或浏览器。
- 下一步：经授权对固定引擎做错误证书、慢页面、零匹配与取消实验，记录同宿主响应和字节来源；本轮未执行。[Q05](#research-q05)

**分析版本**

- **仓库**：[27painter/dsh-moli](https://github.com/27painter/dsh-moli)
- **版本号**：1.1.20（[固定提交 56a2872](https://github.com/27painter/dsh-moli/tree/56a28721fc2977f450d3ada9f03acad50e9b97d4)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是受信字节与引擎锁定、严格TLS和异步可取消抓取；用错误证书、替换安装器与慢页面检查是否同时保住来源和响应性。[Q05](#research-q05)

经授权对固定引擎做错误证书、慢页面、零匹配与取消实验，记录同宿主响应和字节来源；本轮未执行。[Q05](#research-q05)

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 4 | 2762 | 1810 | 852 | — |
| .md | source | 2 | 1176 | — | — | 13129 |
| .mjs | source | 14 | 1924 | 1402 | 412 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/27painter/dsh-moli/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/27painter/dsh-moli/issues?q=is%3Aissue+created%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/27painter/dsh-moli/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本Moli适配器在哪些网页任务中优于普通fetch，认证、进程和引擎依赖是否限制采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 本插件相对web_fetch和直接运行Moli，实际增加了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是已有 DSH、需要读取 JavaScript 渲染页或保存截图的用户。普通 web_fetch 已能取得静态正文时，引入独立浏览器没有必要；动态页面、选择器容器和图片才是明确适用场景。源码注册 moli_fetch 与 moli_probe，将 Moli CLI 的渲染、选择器、文件输出及探测接入模型工具协议，合格结果是目标页面状态正确、所选内容足够且输出文件对应当前页面。浏览器渲染本身属于 Moli 上游，本插件的贡献是输入输出适配、参数冲突处理和可解释失败，而不是原创浏览器或已证明的网页准确率。作者列举的字符压缩样本只是特定页面报告，不能推出普遍节省。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-36](https://github.com/27painter/dsh-moli/blob/56a28721fc2977f450d3ada9f03acad50e9b97d4/README.md#L13-L36)

作者给出静态fetch基线与适用任务。

<details>
<summary>查看原文（24行）</summary>

```text
## What it does, and when you want it

A plain HTTP fetch returns the HTML the server sent. That is enough for articles, docs and APIs, and
DSH already covers it with `web_fetch`. It is not enough for anything a browser has to build:

- **Single-page apps** — a client-rendered news site, dashboard or docs site. The response is an empty
  shell; the content appears only after scripts run.
- **Logins and consent walls** — a page that needs a session or cookie before it shows anything.
- **Pictures** — a screenshot to see what a page looks like, or a PDF to keep.
- **One value from deep inside a page** — a price, a count, a title, read with a selector instead of
  pulling the whole document.
- **A list you can read for 7% of the page** — `selector` returns only the matched containers, which
  on a real feed measured 1,779 characters against 139,338 for the same page as Markdown. If you are
  about to fetch a listing page and skim it, read the `selector` section under Usage first.

For those jobs this plugin gives the agent two tools:

| Tool | What it does |
|---|---|
| `moli_fetch` | Renders a URL and returns Markdown, HTML, a semantic tree, or a JSON envelope carrying the HTTP status; **reads one container with `selector`**; evaluates a JavaScript expression; writes a PNG screenshot or a PDF |
| `moli_probe` | Reports whether the engine is installed, which version, and whether HTTPS works — and installs Moli when it is missing |

The practical question is whether the agent needs the page as a **browser** would see it. If a plain
fetch already returns the text you want, `web_fetch` is lighter and faster.
```

</details>

**依据 2 · 源码核查**：[index.js:351-359](https://github.com/27painter/dsh-moli/blob/56a28721fc2977f450d3ada9f03acad50e9b97d4/index.js#L351-L359)

源码明确注册抓取工具及返回类型。

```text
  ctx.tools.register({
    name: 'moli_fetch',
    description: 'Fetch a URL with the local Moli headless browser: rendered HTML or Markdown, the semantic'
      + ' tree, a JSON envelope with status and final_url, a JavaScript expression result, a PNG screenshot, or a'
      + ' PDF. Use it for pages that need real rendering or JavaScript; prefer web_fetch for plain text. Screenshot'
      + ' and pdf dumps require writeTo. If moli is missing, run moli_probe with action "install" first.',
    parameters: FETCH_PARAMETERS,
    output: { schema: FETCH_OUTPUT_SCHEMA, render: renderFetch },
    isConcurrencySafe: args => args.writeTo === undefined || args.writeTo === '',
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 选择器、滚动和输出如何保持不被静默忽略？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

moli_fetch 先定位引擎，再把参数交给 runFetch。runFetch 明确拒绝 selector 与 dump 或 eval 同用，二进制输出缺 writeTo 也拒绝，避免表面调用成功却得到另一类结果。combineEval 把滚动与选择器读取整合进单一表达式，因为上游只接受一个 --eval。抓取把stdout写文件描述符，保留二进制字节，错误页面有状态分支；空输出且无stderr可为合法空页面，有stderr则作为失败。可借鉴处是把上游CLI语义冲突转为结构化错误并让用户看见，不是只转发参数。限制是这些检查依赖Moli当前协议，不能保证未来引擎语义或所有网站行为。

#### 证据与依据

**依据 1 · 源码核查**：[lib/moli.js:148-192](https://github.com/27painter/dsh-moli/blob/56a28721fc2977f450d3ada9f03acad50e9b97d4/lib/moli.js#L148-L192)

单eval约束与滚动/读取组合。

<details>
<summary>查看原文（45行）</summary>

```text
 * Build the one expression the engine will run from `scroll`, `selector` and `eval`.
 *
 * The engine accepts a single `--eval`, so everything that has to happen before the
 * page is captured is composed here, in the order the caller expects: scroll first,
 * then read (a selector or the caller's expression).
 *
 * What gets returned depends on whether anything else will produce the output, and
 * getting this wrong breaks the feature in one direction or the other:
 *
 * - **A `dump` was requested.** The dump produces the output, so the expression is
 *   there only for its side effects and its value is discarded by the engine anyway.
 *   It must still be passed, or the scroll never runs.
 * - **No `dump`.** The expression's value *is* the output, whether it is a selector
 *   or the caller's own expression.
 * - **No `dump`, no selector, no caller expression, only `scroll`.** The engine
 *   prints whatever `--eval` evaluates to, so passing the scroll expression here
 *   would replace the page with the scroll's return value. `undefined` is returned
 *   instead, leaving the engine's default output -- the serialized document --
 *   intact. This is the case that shipped broken: `moli_fetch url=... scroll=600`
 *   answered `600`.
 *
 * @param evalExpression - the caller's expression, if any.
 * @param scroll - the caller's `scroll` value, if any.
 * @param hasDump - whether the caller also asked for a dump.
 * @param selector - the caller's CSS selector, if any.
 * @returns the expression to pass, or undefined to let the engine decide.
 */
export function combineEval(evalExpression, scroll, hasDump = false, selector = undefined) {
  const move = scrollScript(scroll);
  const read = selectorScript(selector);
  const caller = evalExpression === undefined || evalExpression === '' ? undefined : evalExpression;

  // A selector is a read, so it replaces the caller's expression rather than being
  // chained with it; `buildArgs` rejects the two together, so only one is ever set.
  // The selector script is already a call expression; a caller's expression has to be
  // wrapped so its value is what the engine reports.
  const body = read !== undefined ? { code: read, wrapped: true } : (caller === undefined ? undefined : { code: caller, wrapped: false });

  if (move === undefined) return body === undefined ? undefined : body.code;
  if (body === undefined) {
    // No read at all: keep the scroll only when a dump will produce the output.
    return hasDump ? move : undefined;
  }
  // The read goes last so its value is the one the engine reports; losing it would
  // contradict the documented `eval` behaviour.
```

</details>

**依据 2 · 源码核查**：[lib/moli.js:507-543](https://github.com/27painter/dsh-moli/blob/56a28721fc2977f450d3ada9f03acad50e9b97d4/lib/moli.js#L507-L543)

参数互斥和二进制路径检查。

<details>
<summary>查看原文（37行）</summary>

```text
  // `selector` replaces the whole-page output, so combining it with either reader is a
  // call that cannot do what it says: one of the two would be silently ignored. That
  // is the failure mode this plugin keeps having to fix, so it is refused up front and
  // as a structured result, the same way a binary dump with no writeTo is.
  if (typeof args.selector === 'string' && args.selector.trim() !== '') {
    if (args.dump !== undefined) {
      return {
        ok: false,
        url: args.url,
        selector: args.selector,
        error: '`selector` and `dump` cannot be combined: a selector returns one container\'s text and a dump returns the whole page, so one of them could only be ignored',
        hint: 'Use `selector` to read part of the page, or `dump` to read all of it.',
      };
    }
    if (args.eval !== undefined && args.eval !== '') {
      return {
        ok: false,
        url: args.url,
        selector: args.selector,
        error: '`selector` and `eval` cannot be combined: only one expression value can be returned',
        hint: 'Put the extra work in `eval` and drop `selector`, or keep `selector` and read the text it returns.',
      };
    }
  }
  const argv = buildArgs(args);
  const timeoutMs = args.timeoutMs ?? 30000;
  const isBinary = BINARY_DUMPS.has(args.dump);

  // Reject a byte-returning dump with nowhere to put it before spending a fetch.
  if (isBinary && (args.writeTo === undefined || args.writeTo === '')) {
    return {
      ok: false,
      url: args.url,
      error: `dump "${String(args.dump)}" produces bytes and cannot be returned as text`,
      sandboxTlsBlock: false,
      hint: `Pass writeTo with an absolute .${args.dump === 'pdf' ? 'pdf' : 'png'} path, then read that file.`,
    };
```

</details>

**依据 3 · 源码核查**：[lib/moli.js:556-590](https://github.com/27painter/dsh-moli/blob/56a28721fc2977f450d3ada9f03acad50e9b97d4/lib/moli.js#L556-L590)

空输出区分stderr失败与合法空页面。

<details>
<summary>查看原文（35行）</summary>

```text
  // Empty stdout on a zero exit is not a failure: a page can legitimately have
  // no content in the requested format, which is exactly what a client-rendered
  // page yields under `noJs` with a text dump. moli is right to print nothing
  // for it, and the old code answered with "moli exited with status 0 and no
  // output" plus a hint to re-check the install, sending the caller after a host
  // that was never broken.
  //
  // Both decisions live in this one branch on purpose. Splitting them -- empty
  // stdout treated as success here and stderr checked further down -- lets the
  // case below (silent stdout, a complaint on stderr, exit 0) fall through to
  // the normal success path with the complaint silently dropped.
  if (outcome.status === 0 && bytes === 0) {
    if (stderr !== '') {
      return {
        ok: false,
        url: args.url,
        error: stderr,
        sandboxTlsBlock: isSandboxTlsFailure(stderr),
        unreachable: false,
        possiblyUnreachable: false,
        hint: 'The engine exited cleanly but produced no output and explained why on stderr; the text above is its own message.',
      };
    }
    return {
      ok: true,
      url: args.url,
      kind: 'text',
      dump: args.dump ?? 'html',
      content: '',
      chars: 0,
      bytes: 0,
      empty: true,
      note: 'moli succeeded and produced no output, so the page had no content in this format. '
        + 'A page whose content is built by JavaScript yields nothing when noJs is set; '
        + 'the same URL renders normally without it.',
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 可信抓取与共享宿主响应性受到什么关键限制？

**研究主题**：缺陷与关键质疑

#### 完整回答

默认 insecureTls:true，并在未明确覆盖时传入抓取参数，意味着为解决作者网络环境的证书吊销访问问题而默认降低TLS核验。用户不能把HTTPS内容等同受完整证书检查的可信来源，敏感登录与高可信取证应先设为false。抓取底层runOnce使用spawnSync，即使execute声明async，调用同步子进程仍在等待期间占据宿主事件循环；实际延迟大小没有测量，但不能称为完全异步抓取。安装链与抓取不同，安装已走runAsync，不能把同步风险泛化到所有操作。最强支持是参数与错误分类确有实现，关键反例是页面能返回不等于来源认证及宿主可响应均成立。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:26-35](https://github.com/27painter/dsh-moli/blob/56a28721fc2977f450d3ada9f03acad50e9b97d4/index.js#L26-L35)

默认关闭完整TLS检查的配置。

<details>
<summary>查看原文（10行）</summary>

```text
/** Deployment configuration defaults; override via the plugin's `config` entry. */
const DEFAULTS = {
  defaultTimeoutMs: 30000,
  maxChars: 200000,
  // Behind this machine's filtering proxy Schannel cannot reach the CRL/OCSP
  // responder, so GitHub and some APIs fail with
  // `CRYPT_E_REVOCATION_OFFLINE` ("the revocation server is offline").
  // moli's no-verify flag clears that; set insecureTls: false to enforce full
  // certificate checks on a network that can reach the responders.
  insecureTls: true,
```

</details>

**依据 2 · 源码核查**：[lib/moli.js:501-506](https://github.com/27painter/dsh-moli/blob/56a28721fc2977f450d3ada9f03acad50e9b97d4/lib/moli.js#L501-L506)

默认TLS配置在未显式覆盖时进入调用。

```text
export function runFetch(options) {
  // The configured no-verify default applies only when the call stays silent;
  // an explicit false still means "verify fully".
  const args = options.insecureTls === true && options.args.insecureTls === undefined
    ? { ...options.args, insecureTls: true }
    : options.args;
```

**依据 3 · 源码核查**：[lib/moli.js:356-377](https://github.com/27painter/dsh-moli/blob/56a28721fc2977f450d3ada9f03acad50e9b97d4/lib/moli.js#L356-L377)

真实抓取使用spawnSync。

<details>
<summary>查看原文（22行）</summary>

```text
export function runOnce(options) {
  const dir = mkdtempSync(join(tmpdir(), 'dsh-moli-'));
  const outPath = join(dir, 'stdout.bin');
  const errPath = join(dir, 'stderr.txt');
  let outFd;
  let errFd;
  try {
    outFd = openSync(outPath, 'w');
    errFd = openSync(errPath, 'w');
    const spawnArgs = [...options.args];
    if (options.timeoutMs !== undefined) spawnArgs.push('-t', String(options.timeoutMs));
    if (options.proxy !== undefined && options.proxy !== '') {
      spawnArgs.push('--http-proxy', options.proxy);
    }
    const result = spawnSync(options.exe, spawnArgs, {
      stdio: ['ignore', outFd, errFd],
      // Cancellation backstop, not the engine's readiness deadline: it must sit
      // above the `-t` value handed to moli, or the process is killed before it
      // can report its own timeout.
      timeout: options.spawnTimeoutMs ?? (options.timeoutMs === undefined ? 60000 : options.timeoutMs + 30000),
      windowsHide: true,
    });
```

</details>

**依据 4 · 源码核查**：[lib/install.js:701-722](https://github.com/27painter/dsh-moli/blob/56a28721fc2977f450d3ada9f03acad50e9b97d4/lib/install.js#L701-L722)

安装路径为异步，限制不应泛化。

<details>
<summary>查看原文（22行）</summary>

```text
    let run;
    if (process.platform === 'win32') {
      // Windows runs asynchronously too: spawn the installer without blocking
      // the DSH host's event loop. The outer timeout sends SIGTERM then
      // SIGKILL, and an abort signal kills it immediately, so the host keeps
      // serving requests while PowerShell's Invoke-WebRequest does its work.
      run = await runAsync({
        command: options.powershell ?? 'powershell.exe',
        args,
        env,
        timeoutMs,
        signal: options.signal,
      });
    } else {
      // Linux/macOS keeps its existing asynchronous behaviour.
      run = await runAsync({
        command: 'sh',
        args,
        env,
        timeoutMs,
        signal: options.signal,
      });
```

</details>

#### 缺口

- 未测慢页面对同宿主其他请求的实际阻塞程度。
  **影响**：不能量化吞吐损失或判断共享宿主是否可接受。
  **进一步探讨**：在隔离宿主同时发慢抓取与轻量请求，记录响应延迟。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 引擎安装、持续抓取和失败退出有哪些投入？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

插件包不含引擎，用户必须另备匹配平台的 Moli；README给出独立二进制及路径配置，大小是作者报告而非本轮下载。安装下载 latest 安装脚本，可提供 expectedSha256 在执行前拒绝不匹配；未传入可信摘要时，返回计算摘要只证明本次字节可标识，不证明发布者可信，也未绑定未来引擎版本。网络、代理、平台及磁盘由用户承担，登录状态还需管理profileDir/cookieFile。持续抓取需浏览器CPU/内存、模型上下文及输出存储，selector可减少返回文本但可能漏掉所需内容。失败恢复要区分网络、选择器、HTTP和输出路径错误，不能一律重装；金额、耗时及单位合格任务成本均未知。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:68-91](https://github.com/27painter/dsh-moli/blob/56a28721fc2977f450d3ada9f03acad50e9b97d4/README.md#L68-L91)

作者说明npm包不包含独立Moli引擎。

<details>
<summary>查看原文（24行）</summary>

```text
> Rust binary, built and released by the Moli project on its own schedule.
>
> **Why it cannot be bundled:**
>
> - **Size.** The engine is roughly 4,000× the plugin. Every install and every plugin update would
>   carry a browser.
> - **Ownership.** Moli is `lexmount/moli` under its own MIT copyright. Redistributing its binary
>   through this package would mean re-publishing someone else's artifact as our own.
> - **Platforms.** The engine ships per OS and per architecture — Windows/Linux/macOS × x64/arm64.
>   Bundling would pin one build into every user's install.
> - **Versions.** The plugin must work with whatever Moli version a user has, including Moli releases
>   that appear after the plugin was published. Bundling would lock the pair together.
>
> **There is no npm package for the engine either.** The registry names `moli` and `moli-cli` belong to
> unrelated projects, and `@lexmount/moli` does not exist. Moli ships as prebuilt binaries on
> [GitHub Releases](https://github.com/lexmount/moli/releases/latest) — do not install the engine by
> guessing a package name.

## The two situations after installing

The two download routes above install the same thing. What differs is whether Moli is already on the
machine — and that decides whether you are finished or have one more step.

### Situation A — Moli is already installed: nothing else to do
```

</details>

**依据 2 · 源码核查**：[index.js:149-154](https://github.com/27painter/dsh-moli/blob/56a28721fc2977f450d3ada9f03acad50e9b97d4/index.js#L149-L154)

代理和登录状态文件参数。

```text
    proxy: {
      type: 'string',
      description: 'Forward proxy for this call, e.g. "http://127.0.0.1:7890". Overrides the plugin configuration for one call; loopback URLs always bypass it.',
    },
    profileDir: { type: 'string', description: 'Moli profile directory carrying imported cookies or storage.' },
    cookieFile: { type: 'string', description: 'Netscape/curl cookie-jar file to send.' },
```

**依据 3 · 源码核查**：[lib/install.js:640-679](https://github.com/27painter/dsh-moli/blob/56a28721fc2977f450d3ada9f03acad50e9b97d4/lib/install.js#L640-L679)

下载最新安装器并可选比对调用者摘要。

<details>
<summary>查看原文（40行）</summary>

```text
export async function installMoli(options = {}) {
  const timeoutMs = options.timeoutMs ?? 180000;
  const workDir = mkdtempSync(join(tmpdir(), 'dsh-moli-install-'));
  const target = join(workDir, process.platform === 'win32' ? 'moli-installer.ps1' : 'moli-installer.sh');
  try {
    // Head: one proxy decision, shared by the download below and the run after it.
    const proxyConfig = resolveProxy(options.proxy);
    const proxyAlive = proxyConfig === undefined ? false : await proxyListens(proxyConfig.url);
    const proxy = proxyConfig === undefined ? undefined : proxyConfig.url;

    const download = await downloadInstaller({
      target,
      installerUrl: options.installerUrl,
      proxy,
      timeoutMs: options.downloadTimeoutMs ?? 60000,
      locate: options.locate ?? findMoli,
      exePath: options.exePath,
    });

    if (download.ok !== true) {
      return {
        ok: false,
        error: download.error,
        attempts: download.attempts,
        note: 'No route to the release host worked. The manual install command below is the fallback.',
        manualInstall: MANUAL_INSTALL,
      };
    }

    // Verify before executing anything, whenever the caller states an expectation.
    if (typeof options.expectedSha256 === 'string' && options.expectedSha256.length > 0) {
      const expected = options.expectedSha256.trim().toLowerCase();
      if (expected !== download.sha256) {
        return {
          ok: false,
          error: `installer checksum mismatch: expected ${expected}, got ${download.sha256}`,
          installerSha256: download.sha256,
          expectedSha256: expected,
          method: download.method,
          note: 'Refusing to execute the installer.',
```

</details>

#### 缺口

- 缺少有来源的固定引擎版本、可信摘要与跨站合格任务对照。
  **影响**：供应链及总成本不能由插件固定SHA覆盖。
  **进一步探讨**：固定引擎和安装器字节，记录公开页面任务的资源、时间与失败重试。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么最小改造能同时改善来源可信度和宿主响应？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是将引擎与安装器锁为受信摘要，默认严格TLS，并把抓取放入可取消异步工作进程，再让结果附页面状态和选择器匹配数量。它由Q03的认证与同步执行限制、Q02的结构化输出基础推导；比现有参数包装多了可审环境和独立生命周期，但会增加版本矩阵维护与进程管理。最小验证使用错误证书、被替换安装脚本、慢页面及零匹配选择器，比较当前实现与原型。应拒绝未知字节、保持同宿主轻量请求可响应、明确零匹配和内容完整性；任一仍被当成功或取消后进程残留，就否定当前原型。未执行实验，不能把此设想列为插件当前能力。

#### 证据与依据

**依据 1 · 源码核查**：[lib/install.js:669-679](https://github.com/27painter/dsh-moli/blob/56a28721fc2977f450d3ada9f03acad50e9b97d4/lib/install.js#L669-L679)

已有摘要拒绝点可作为固定供应链的实现基础。

<details>
<summary>查看原文（11行）</summary>

```text
    // Verify before executing anything, whenever the caller states an expectation.
    if (typeof options.expectedSha256 === 'string' && options.expectedSha256.length > 0) {
      const expected = options.expectedSha256.trim().toLowerCase();
      if (expected !== download.sha256) {
        return {
          ok: false,
          error: `installer checksum mismatch: expected ${expected}, got ${download.sha256}`,
          installerSha256: download.sha256,
          expectedSha256: expected,
          method: download.method,
          note: 'Refusing to execute the installer.',
```

</details>

**依据 2 · 源码核查**：[lib/moli.js:370-375](https://github.com/27painter/dsh-moli/blob/56a28721fc2977f450d3ada9f03acad50e9b97d4/lib/moli.js#L370-L375)

同步执行是改异步的具体动因。

```text
    const result = spawnSync(options.exe, spawnArgs, {
      stdio: ['ignore', outFd, errFd],
      // Cancellation backstop, not the engine's readiness deadline: it must sit
      // above the `-t` value handed to moli, or the process is killed before it
      // can report its own timeout.
      timeout: options.spawnTimeoutMs ?? (options.timeoutMs === undefined ? 60000 : options.timeoutMs + 30000),
```

#### 缺口

- 受信摘要来源与多平台异步退出行为未建立。
  **影响**：假设尚不能保证供应链或可靠取消。
  **进一步探讨**：先在单一平台实现受信字节锁与取消实验，再决定扩展。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 当前应观察还是可直接用于生产网页任务？

**研究主题**：采用判断

#### 完整回答

建议观察，尤其对共享宿主、敏感登录和需要可信来源的任务。虽然注册、选择器冲突、输出及安装错误链足以解释功能，默认TLS与抓取同步阻塞直接影响主要采用前提，单纯宣称页面能渲染不足以抵消。感兴趣的个人用户可先手工准备已审引擎、明确insecureTls:false，仅在隔离宿主核对公开低敏感页面；这是一条补证路径，不是本轮试用通过。相对直接运行Moli，优势是DSH工具接线和错误解释；若普通web_fetch已有完整正文则用原工具，若出现证书错误、不明引擎字节、页面内容缺失或宿主明显停顿，则停止并回到独立浏览器流程。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:26-35](https://github.com/27painter/dsh-moli/blob/56a28721fc2977f450d3ada9f03acad50e9b97d4/index.js#L26-L35)

默认TLS条件阻碍可信任务采用。

<details>
<summary>查看原文（10行）</summary>

```text
/** Deployment configuration defaults; override via the plugin's `config` entry. */
const DEFAULTS = {
  defaultTimeoutMs: 30000,
  maxChars: 200000,
  // Behind this machine's filtering proxy Schannel cannot reach the CRL/OCSP
  // responder, so GitHub and some APIs fail with
  // `CRYPT_E_REVOCATION_OFFLINE` ("the revocation server is offline").
  // moli's no-verify flag clears that; set insecureTls: false to enforce full
  // certificate checks on a network that can reach the responders.
  insecureTls: true,
```

</details>

**依据 2 · 源码核查**：[index.js:351-381](https://github.com/27painter/dsh-moli/blob/56a28721fc2977f450d3ada9f03acad50e9b97d4/index.js#L351-L381)

DSH工具与本地执行链。

<details>
<summary>查看原文（31行）</summary>

```text
  ctx.tools.register({
    name: 'moli_fetch',
    description: 'Fetch a URL with the local Moli headless browser: rendered HTML or Markdown, the semantic'
      + ' tree, a JSON envelope with status and final_url, a JavaScript expression result, a PNG screenshot, or a'
      + ' PDF. Use it for pages that need real rendering or JavaScript; prefer web_fetch for plain text. Screenshot'
      + ' and pdf dumps require writeTo. If moli is missing, run moli_probe with action "install" first.',
    parameters: FETCH_PARAMETERS,
    output: { schema: FETCH_OUTPUT_SCHEMA, render: renderFetch },
    isConcurrencySafe: args => args.writeTo === undefined || args.writeTo === '',
    async execute(args, exec) {
      if (exec.signal?.aborted === true) throw new Error('moli_fetch aborted before start');
      const exe = engine();
      if (exe === undefined) {
        return {
          ok: false,
          url: args.url,
          error: 'moli was not found',
          sandboxTlsBlock: false,
          hint: 'Call moli_probe with action "install" to download it, or set the dsh-moli config field `exePath` to the absolute moli path.',
          manualInstall: MANUAL_INSTALL,
        };
      }
      // A per-call proxy wins over the plugin configuration, so one host behind a
      // different proxy does not require a reconfiguration.
      return runFetch({
        exe,
        args: { ...args, timeoutMs: args.timeoutMs ?? defaultTimeoutMs },
        maxChars,
        proxy: typeof args.proxy === 'string' && args.proxy !== '' ? args.proxy : proxy,
        insecureTls,
      });
```

</details>

**依据 3 · 源码核查**：[lib/moli.js:370-375](https://github.com/27painter/dsh-moli/blob/56a28721fc2977f450d3ada9f03acad50e9b97d4/lib/moli.js#L370-L375)

同步进程影响共享宿主条件。

```text
    const result = spawnSync(options.exe, spawnArgs, {
      stdio: ['ignore', outFd, errFd],
      // Cancellation backstop, not the engine's readiness deadline: it must sit
      // above the `-t` value handed to moli, or the process is killed before it
      // can report its own timeout.
      timeout: options.spawnTimeoutMs ?? (options.timeoutMs === undefined ? 60000 : options.timeoutMs + 30000),
```

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
