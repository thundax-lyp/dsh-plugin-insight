# dsh-moli

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[16b5886](https://github.com/27painter/dsh-moli/tree/16b5886d35827047e3e8736da356c8c55c9ae564)

<!-- BEGIN META -->
[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/27painter/dsh-moli) [![npm 30d 1,514](https://img.shields.io/static/v1?label=npm+30d&message=1%2C514&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-moli) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-moli)
<!-- END META -->

> **功能**：把本地Moli无头浏览器接入Harness，支持渲染抓取、选择器读取、截图和PDF。

> **亮点**：把独立Moli浏览器适配为两个Harness工具，补充选择器冲突检查、等待与错误分类、文件输出及安装诊断；渲染能力属于Moli上游。参见[Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：默认insecureTls:true削弱证书核验；安装器来自可变latest，计算SHA256只记录所执行字节，没有可信发布摘要作比对。抓取又使用spawnSync，较慢页面可能阻塞Host事件循环；这些限制直接影响可信抓取与部署负担。参见[Q03](#research-q03)。

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
  - [Q01 · 谁需要渲染网页抓取和探测，相对手工或宿主原生办法增加什么？](#detail-section-11)
  - [Q02 · Moli CLI参数、安装器与输出边界如何从入口形成完整调用链，依赖失效怎么办？](#detail-section-12)
  - [Q03 · 什么实现边界最可能使渲染网页抓取和探测的贡献不成立，哪些工程设计可复用？](#detail-section-13)
  - [Q04 · 完成一次合格任务的首次、持续和恢复负担是什么？](#detail-section-14)
  - [Q05 · 可从Moli CLI参数、安装器与输出边界的限制推导什么可证伪改进？](#detail-section-15)
  - [Q06 · 哪些用户可以受控采用渲染网页抓取和探测，何时应停止？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要读取JavaScript渲染页、登录态容器或网页截图/PDF的Harness用户。合格结果应核对页面状态、内容及输出文件；静态文本已可fetch时无需启动浏览器。

静态公开页优先普通fetch；动态页面可用独立浏览器脚本，本插件把接线/诊断放入Harness但不保证更快。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| moli_fetch | 渲染网页、定向读取、截图/PDF | 独立引擎，参数互斥与输出权限 |
| moli_probe | 定位/探测/安装引擎 | 安装运行外部latest脚本，hash非认证 |
| 设置页 | 代理、TLS和引擎生命周期 | schema依赖可降级，默认TLS需核对 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node >=20.12、Harness tools | 必需 | 注册两个模型工具 | 工具不可用 |
| 独立Moli引擎及平台能力 | 必需 | 真实页面渲染 | npm包不包含引擎，需另外安装 |
| 目标网络/代理与TLS | 必需 | 访问网页及安装源 | 默认insecureTls:true需主动核对 |
| cookie/profile文件、输出权限 | 特定操作必需 | 登录态和截图/PDF | 本地凭据/文件需用户管理 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户核对已安装引擎或审查官方安装材料 | probe报告路径/版本，摘要不是签名校验 |
| 2 | 优先启用严格TLS并确认代理 | HTTPS诊断有效，不能仅有可执行路径 |
| 3 | Agent按任务选择selector或dump/eval | 核对matched、status、truncated及文件 |
| 4 | 结果为空或超时先查条件和错误页 | 不把空白页当无信息，必要时改普通fetch |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 单独下载浏览器引擎及磁盘，金额未知 | 审安装源、平台、代理和TLS | 引擎latest与插件固定版独立变化 |
| 持续使用 | 浏览器进程/网络及模型阅读token | 维护选择器、等待和登录态 | 字符减少不等于等比例token/费用下降 |
| 失败恢复 | 重试渲染与下载、残留输出 | 判别HTTP错误/不可达/条件超时 | 截图/PDF及cookie需自行清理 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 渲染访问 | 本地浏览器CLI参数与状态处理 | 真实目标网站兼容与反爬 |
| 定向读取 | selector与等待条件校验 | 跨站内容完整性及净token节省 |
| 可诊断安装 | 多路径下载与SHA256记录 | 脚本真实性及未来引擎兼容 |

> **思考**：默认insecureTls:true削弱证书核验；安装器来自可变latest，计算SHA256只记录所执行字节，没有可信发布摘要作比对。抓取又使用spawnSync，较慢页面可能阻塞Host事件循环；这些限制直接影响可信抓取与部署负担。参见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把独立Moli浏览器适配为两个Harness工具，补充选择器冲突检查、等待与错误分类、文件输出及安装诊断；渲染能力属于Moli上游。参见[Q01](#research-q01)、[Q02](#research-q02)。

raw JSON schema注册、参数互斥与失败分类可借鉴；同步子进程和不安全默认值得调整。复用时需锁定外部CLI协议、权限和认证策略。

<a id="detail-section-5"></a>

### 1.4 主要限制

默认insecureTls:true削弱证书核验；安装器来自可变latest，计算SHA256只记录所执行字节，没有可信发布摘要作比对。抓取又使用spawnSync，较慢页面可能阻塞Host事件循环；这些限制直接影响可信抓取与部署负担。参见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察；先仅对公开低敏感页面检查严格TLS、已知引擎版本与错误状态，再决定受控试用。生产登录凭据、强来源认证或共享Host延迟敏感任务应暂缓。参见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持工具与诊断链；来源认证、实际页面效果及改造假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、lib/moli.js、lib/install.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定版入口、argv/进程/输出和安装器来源及校验语义；未执行Moli或验证脚本，不把已有旧报告当本轮运行。
- 下一步：固定引擎及公开页面检查证书、HTTP状态、选择器、慢响应和中断，并记录端到端任务质量与Host延迟。

**分析版本**

- **仓库**：[27painter/dsh-moli](https://github.com/27painter/dsh-moli)
- **版本号**：1.1.20（[固定提交 16b5886](https://github.com/27painter/dsh-moli/tree/16b5886d35827047e3e8736da356c8c55c9ae564)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可将引擎/安装脚本锁为可审版本并验证受信摘要，抓取改为可取消异步进程，同时返回页面状态与选择器覆盖收据。用故意错误证书、安装器变更及慢页面对照，若不拒绝未授权字节或Host仍阻塞则否定；假设未验证，维护版本矩阵有额外成本。参见[Q05](#research-q05)。

固定引擎及公开页面检查证书、HTTP状态、选择器、慢响应和中断，并记录端到端任务质量与Host延迟。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 4 | 2756 | 1810 | 846 | — |
| .md | source | 2 | 1176 | — | — | 13129 |
| .mjs | source | 14 | 1908 | 1390 | 405 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/27painter/dsh-moli/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/27painter/dsh-moli/issues?q=is%3Aissue+created%3A2026-09-23T01%3A49%3A26.824Z..2026-10-23T01%3A49%3A26.824Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/27painter/dsh-moli/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-23T01%3A49%3A26.824Z..2026-10-23T01%3A49%3A26.824Z)



统计日期：2026-10-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在固定提交 16b5886d35827047e3e8736da356c8c55c9ae564 和截止 2026-10-23T01:41:11Z 范围内，渲染网页抓取和探测能为明确用户提供什么可核查增量，其关键限制、总成本和采用条件是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要渲染网页抓取和探测，相对手工或宿主原生办法增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要客户端渲染、登录态或图片/PDF的用户可以获得浏览器视角结果，原生普通fetch适合静态文本且负担更小。该版可用selector只抽容器，但作者列出的字符节省只说明具体页面样本；合格交付需核对预期元素、HTTP状态与文件内容，不由ok:true自动成立。贡献在Harness集成和诊断，不把Moli渲染器算本项目原创。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-41](https://github.com/27painter/dsh-moli/blob/16b5886d35827047e3e8736da356c8c55c9ae564/README.md#L13-L41)

作者场景、两工具和静态fetch替代

<details>
<summary>查看原文（29行）</summary>

````text
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
  agent ──moli_fetch──▶ dsh-moli plugin ──spawns──▶ moli.exe
                              ▲                         │
                              │                    renders the page,
````

</details>

**依据 2 · 源码核查**：[index.js:103-109](https://github.com/27painter/dsh-moli/blob/16b5886d35827047e3e8736da356c8c55c9ae564/index.js#L103-L109)

selector与eval/dump边界说明

```text
    selector: {
      type: 'string',
      description: 'Return the text of the elements this CSS selector matches instead of the whole page. This is the cheap way to read one container out of a noisy listing page: the cards on a feed measured 1,829 characters against 95,605 for the same page as markdown. All matches are joined with newlines and the result reports how many there were; matching nothing is an error, not empty content, because the engine cannot distinguish an empty selection from a page with no text. Not compatible with `dump` or `eval` — one of them could only be ignored.',
    },
    eval: {
      type: 'string',
      description: 'JavaScript expression evaluated once the page is ready; its value is returned as text or JSON instead of the page. Combining it with `dump` does NOT return both: the engine discards the expression value and dumps the resulting page state instead (its own documented semantics). Use `eval` alone to read a value, or `dump` alone to read the page.',
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · Moli CLI参数、安装器与输出边界如何从入口形成完整调用链，依赖失效怎么办？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

tools注册moli_fetch后检查abort和引擎路径，再由runFetch构造argv、执行本地进程、解析stdout/stderr并按writeTo写文件；probe另查版本/HTTPS或安装。需要Node/Harness tools、独立引擎、网络及文件权限，用户先probe并核TLS，再按selector或dump使用。schemastery缺失时设置页降级但工具仍可注册，不能把装包成功当引擎可用。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:19-35](https://github.com/27painter/dsh-moli/blob/16b5886d35827047e3e8736da356c8c55c9ae564/index.js#L19-L35)

可选schema和默认TLS

<details>
<summary>查看原文（17行）</summary>

```text
let z;
try {
  z = (await import('@deepseek-ai/schemastery')).default;
} catch {
  z = undefined;
}

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

**依据 2 · 源码核查**：[index.js:351-376](https://github.com/27painter/dsh-moli/blob/16b5886d35827047e3e8736da356c8c55c9ae564/index.js#L351-L376)

工具执行入口与缺引擎处理

<details>
<summary>查看原文（26行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[lib/moli.js:440-479](https://github.com/27painter/dsh-moli/blob/16b5886d35827047e3e8736da356c8c55c9ae564/lib/moli.js#L440-L479)

argv构造与TLS/HTTP参数

<details>
<summary>查看原文（40行）</summary>

```text
export function buildArgs(args) {
  if (args.dump !== undefined && !TEXT_DUMPS.has(args.dump) && !BINARY_DUMPS.has(args.dump)) {
    throw new Error(`unsupported dump: ${String(args.dump)}`);
  }
  if (args.wait !== undefined && args.wait !== '' && !WAIT_STAGES.has(args.wait)) {
    throw new Error(`unsupported wait stage: ${String(args.wait)}`);
  }
  const needsLayout = LAYOUT_DUMPS.has(args.dump) || args.layout === true || args.scrollbars === true;
  const argv = ['fetch', args.url];

  if (args.dump !== undefined) argv.push('-d', args.dump);
  // Screenshots and PDFs silently produce nothing without the layout renderer.
  if (needsLayout) argv.push('--layout');
  if (args.scrollbars === true) argv.push('--scrollbars');
  // `scroll` and `selector` ride along in the same expression: the engine takes a
  // single `--eval`. `hasDump` matters -- see combineEval -- because with a dump the
  // expression exists only for its side effect, and without one it becomes the output.
  const evaluation = combineEval(args.eval, args.scroll, args.dump !== undefined, args.selector);
  if (evaluation !== undefined) argv.push('--eval', evaluation);
  if (args.wait !== undefined && args.wait !== '') argv.push('--wait', args.wait);
  if (args.waitSelector !== undefined && args.waitSelector !== '') argv.push('--wait-selector', args.waitSelector);
  if (args.waitScript !== undefined && args.waitScript !== '') argv.push('--wait-script', args.waitScript);
  // Response waits: the right way to await an AJAX list, where a fixed delay is a
  // guess. The engine takes one of each, and a caller supplying several is asking
  // for "any of these", which is the engine's own semantics for multiple waits.
  if (args.waitResponseUrl !== undefined && args.waitResponseUrl !== '') argv.push('--wait-response-url', args.waitResponseUrl);
  if (args.waitResponseJson !== undefined && args.waitResponseJson !== '') argv.push('--wait-response-json', args.waitResponseJson);
  // The engine's own switch, but only when the caller asked for a failure to be
  // surfaced: adding it unconditionally would turn every 404 into `ok: false` and
  // change what existing calls do.
  if (args.failOnHttpError === true) argv.push('--fail-with-body');
  if (args.delayMs !== undefined) argv.push('--delay-ms', String(args.delayMs));
  if (args.noJs === true) argv.push('--disable-js');
  if (args.noCss === true) argv.push('--disable-css');
  if (args.resources === true) argv.push('--resource');
  if (args.withFrames === true) argv.push('--with-frames');
  if (args.insecureTls === true) argv.push('--insecure-disable-tls-host-verification');
  if (args.userAgent !== undefined && args.userAgent !== '') argv.push('--user-agent', args.userAgent);
  if (args.profileDir !== undefined && args.profileDir !== '') argv.push('--profile-dir', args.profileDir);
  if (args.cookieFile !== undefined && args.cookieFile !== '') argv.push('--cookie-file', args.cookieFile);
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么实现边界最可能使渲染网页抓取和探测的贡献不成立，哪些工程设计可复用？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

可信抓取最怕把成功读到页面与来源已认证混为一谈。该版默认跳过TLS主机核验，用户可显式关闭；latest安装器SHA256为事后记录，未与可信上游值核验。同步spawnSync对Host有阻塞风险，虽安装器采用异步子进程并有树清理，不应把安装异步泛化为抓取异步。工程可借鉴参数冲突拒绝和诊断分类，但兼容性依赖外部引擎。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:27-35](https://github.com/27painter/dsh-moli/blob/16b5886d35827047e3e8736da356c8c55c9ae564/index.js#L27-L35)

TLS不安全默认值

```text
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

**依据 2 · 源码核查**：[lib/moli.js:356-389](https://github.com/27painter/dsh-moli/blob/16b5886d35827047e3e8736da356c8c55c9ae564/lib/moli.js#L356-L389)

同步进程执行

<details>
<summary>查看原文（34行）</summary>

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
    closeSync(outFd);
    outFd = undefined;
    closeSync(errFd);
    errFd = undefined;

    const stdout = existsSync(outPath) ? readFileSync(outPath) : Buffer.alloc(0);
    const stderrText = existsSync(errPath) ? readFileSync(errPath, 'utf8') : '';
    const failed = result.error !== undefined && result.error !== null;
    return {
      status: failed ? null : (result.status ?? 0),
      stdout,
      stderr: condense(stderrText),
```

</details>

**依据 3 · 源码核查**：[lib/install.js:749-756](https://github.com/27painter/dsh-moli/blob/16b5886d35827047e3e8736da356c8c55c9ae564/lib/install.js#L749-L756)

SHA256记录且无官方checksum对照

```text
    return {
      ok: true,
      exe,
      version,
      installerSha256: download.sha256,
      installerBytes: download.bytes,
      method: download.method,
      note: 'Installed from the official release installer. The SHA256 above is what was actually run; Moli publishes no checksum file to compare it against.',
```

#### 缺口

- 严格TLS、慢页面及多平台引擎的同版本实测缺失
  **影响**：来源可信度与共享Host可用性不能确认
  **进一步探讨**：用固定引擎和已知证书/慢响应页记录结果与Host延迟

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 完成一次合格任务的首次、持续和恢复负担是什么？

**研究主题**：效果与总成本

#### 完整回答

首次需单独获取并管理引擎、核对代理及TLS；持续需浏览器CPU/内存、网络和模型阅读成本，选择器维护/登录刷新为人工；失败还需区分HTTP错误、等待条件和网络问题并检查部分输出。字符裁剪不等于减少底层浏览器任务，未测净token、耗时或金额，不能照抄样本节省比例。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:65-85](https://github.com/27painter/dsh-moli/blob/16b5886d35827047e3e8736da356c8c55c9ae564/README.md#L65-L85)

插件与引擎独立分发

<details>
<summary>查看原文（21行）</summary>

```text
> **The npm package is the plugin only — it does not contain the Moli engine.**
>
> The npm tarball is 26 kB: eight JavaScript and text files. `moli.exe` is a separate ~101 MB compiled
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

```

</details>

**依据 2 · 源码核查**：[lib/moli.js:495-512](https://github.com/27painter/dsh-moli/blob/16b5886d35827047e3e8736da356c8c55c9ae564/lib/moli.js#L495-L512)

参数冲突拒绝

<details>
<summary>查看原文（18行）</summary>

```text
export function runFetch(options) {
  // The configured no-verify default applies only when the call stays silent;
  // an explicit false still means "verify fully".
  const args = options.insecureTls === true && options.args.insecureTls === undefined
    ? { ...options.args, insecureTls: true }
    : options.args;
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
```

</details>

**依据 3 · 源码核查**：[lib/moli.js:657-660](https://github.com/27painter/dsh-moli/blob/16b5886d35827047e3e8736da356c8c55c9ae564/lib/moli.js#L657-L660)

等待条件失败与网络区分

```text
      ? `The selector ${JSON.stringify(args.waitSelector)} never matched. The page loaded, so this is not a network problem: check the spelling, and confirm the element is there with \`selector\` (it reports the match count, where a wait only times out) or \`dump\`.`
      : args.waitScript !== undefined
        ? 'The wait expression never became truthy. The page loaded, so this is not a network problem: check the expression against the page with `eval`, and remember it is polled rather than evaluated once.'
        : (args.waitResponseUrl !== undefined || args.waitResponseJson !== undefined)
```

#### 缺口

- 单位合格抓取的总时间和成本未知
  **影响**：无法判断渲染是否优于fetch或其他浏览器工具
  **进一步探讨**：同页面任务对照静态fetch/完整渲染/selector，计入失败和人工核对

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可从Moli CLI参数、安装器与输出边界的限制推导什么可证伪改进？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是固定引擎版本与受信摘要、默认严格TLS，并以异步可取消执行隔离慢页面。它针对可变安装源和同步执行，而不是替换上游浏览器。最小对照包含错误证书、篡改安装器、长期等待和中断，任何未授权字节被执行或Host延迟不降均否定；平台支持矩阵与回滚包增加维护负担。

#### 证据与依据

**依据 1 · 源码核查**：[lib/install.js:45-48](https://github.com/27painter/dsh-moli/blob/16b5886d35827047e3e8736da356c8c55c9ae564/lib/install.js#L45-L48)

latest可变安装源

```text
/** Official installer for the latest release. */
export const INSTALLER_URL = process.platform === 'win32'
  ? 'https://github.com/lexmount/moli/releases/latest/download/moli-installer.ps1'
  : 'https://github.com/lexmount/moli/releases/latest/download/moli-installer.sh';
```

**依据 2 · 源码核查**：[lib/moli.js:356-389](https://github.com/27painter/dsh-moli/blob/16b5886d35827047e3e8736da356c8c55c9ae564/lib/moli.js#L356-L389)

同步执行改造切入点

<details>
<summary>查看原文（34行）</summary>

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
    closeSync(outFd);
    outFd = undefined;
    closeSync(errFd);
    errFd = undefined;

    const stdout = existsSync(outPath) ? readFileSync(outPath) : Buffer.alloc(0);
    const stderrText = existsSync(errPath) ? readFileSync(errPath, 'utf8') : '';
    const failed = result.error !== undefined && result.error !== null;
    return {
      status: failed ? null : (result.status ?? 0),
      stdout,
      stderr: condense(stderrText),
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 哪些用户可以受控采用渲染网页抓取和探测，何时应停止？

**研究主题**：采用判断

#### 完整回答

建议观察，适合能管理本地浏览器/代理的技术用户先评估公开低敏感页；不熟悉TLS和登录态边界者、生产凭据及多人共享Host暂缓。成功标准为严格TLS下读到预定内容、正确区分404/空选择器并能取消/退出；默认证书绕过、长时间Host阻塞或状态误读即停止。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:148-154](https://github.com/27painter/dsh-moli/blob/16b5886d35827047e3e8736da356c8c55c9ae564/index.js#L148-L154)

TLS与cookie/profile暴露的操作边界

```text
    insecureTls: { type: 'boolean', description: 'Skip TLS host verification. Use only for a known-broken local endpoint.' },
    proxy: {
      type: 'string',
      description: 'Forward proxy for this call, e.g. "http://127.0.0.1:7890". Overrides the plugin configuration for one call; loopback URLs always bypass it.',
    },
    profileDir: { type: 'string', description: 'Moli profile directory carrying imported cookies or storage.' },
    cookieFile: { type: 'string', description: 'Netscape/curl cookie-jar file to send.' },
```

**依据 2 · 源码核查**：[lib/install.js:756-759](https://github.com/27painter/dsh-moli/blob/16b5886d35827047e3e8736da356c8c55c9ae564/lib/install.js#L756-L759)

安装验证边界和临时目录清理

```text
      note: 'Installed from the official release installer. The SHA256 above is what was actually run; Moli publishes no checksum file to compare it against.',
    };
  } finally {
    rmSync(workDir, { recursive: true, force: true });
```

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
