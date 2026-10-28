# Witness（dsh-verify）

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[e7ce637](https://github.com/263311487-ux/dsh-verify/tree/e7ce6376fec8cf94f41ce46264baeb348911693b)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/263311487-ux/dsh-verify) [![npm 30d 2,530](https://img.shields.io/static/v1?label=npm+30d&message=2%2C530&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-verify) [![最新发布 2026-10-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-verify)
<!-- END META -->

> **功能**：用可复跑 JSON 浏览器断言检查网页行为，并输出逐步报告与截图

> **亮点**：把常见动作/断言、真实浏览器和报告封装为JSON流程，并接CLI/MCP/DSH，减少手写接线；确定性执行不等需求、覆盖或作者独立。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：首次截图基线创建即PASS不能当视觉回归通过；DSH spawnSync阻塞Host且注册失败静默；serve优先于url还可能使实际目标与工具描述不符。通过只对应本次给定断言。[Q03](#research-q03)

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
  - [Q01 · 谁使用Witness，实际入口是什么？](#detail-section-11)
  - [Q02 · 执行和报告怎样闭环？](#detail-section-12)
  - [Q03 · PASS、截图基线与URL覆盖的边界是什么？](#detail-section-13)
  - [Q04 · 要完成合格检查，用户还承担什么？](#detail-section-14)
  - [Q05 · 怎么试用，哪项改进值得检验？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：有明确网页验收标准的开发者/CI用户，需要真实浏览器检查交付中的具体行为。

手写Playwright、agent浏览器操作加人工清单；浏览器能力来自Playwright，独立性来自spec审阅。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| JSON浏览器检查 | 动作、文本、样式及请求断言 | 只验证给定覆盖 |
| 截图比较 | 像素基线回归 | 首次创建即pass，需独立批准 |
| CLI/MCP/DSH | 接入agent或CI | DSH同步执行，gen需额外LLM |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node20+、Playwright与浏览器 | 检查必需 | 真浏览器执行 | 浏览器需独立一次下载，未装不能验证 |
| 可访问测试页/本地目录 | 场景必需 | 被测目标 | serve相对cwd且优先于url，应核实际地址 |
| 独立审阅spec与基线 | 合格验收必需 | 覆盖与预期定义 | 同agent写spec不构成独立审查 |
| LLM key/provider | 仅gen必需 | 草拟spec | 确定性runner不需key，生成另计费 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户准备测试环境与浏览器，固定目标 | 不在生产数据上试不可逆动作 |
| 2 | 用户审JSON，设正确与故意错误用例 | 审实际URL和serve目录 |
| 3 | CLI/MCP执行并回读HTML+PNG | PASS/FAIL及断言一致；新基线另批准 |
| 4 | 用户核覆盖再集成CI/DSH | Host工具不可见/阻塞先回CLI |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Node依赖/浏览器下载资源未知 | 安装、写spec与基线审批 | init本身不下载也不启动浏览器 |
| 持续使用 | 浏览器、报告存储；可选LLM费未知 | 维护断言与状态、审截图 | 无同任务节时数据 |
| 失败恢复 | 重跑/截图/diff资源未知 | 排目标、依赖、基线与业务副作用 | 失败尝试需计入 |
| 退出 | 报告/基线存储未知 | 停MCP/禁插件，保留可追溯spec | 浏览器缓存另管理 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 显式网页行为 | 真浏览器动作/断言与非空通过 | 整体功能完整、安全、可访问性 |
| 视觉回归 | 有基线时按像素阈值比较 | 首次创建不证明正确，设计语义未知 |
| 检查可复跑 | JSON/HTML和显式截图 | 独立作者、完整审计和效率收益 |

> **思考**：首次截图基线创建即PASS不能当视觉回归通过；DSH spawnSync阻塞Host且注册失败静默；serve优先于url还可能使实际目标与工具描述不符。通过只对应本次给定断言。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把常见动作/断言、真实浏览器和报告封装为JSON流程，并接CLI/MCP/DSH，减少手写接线；确定性执行不等需求、覆盖或作者独立。[Q01](#research-q01) [Q02](#research-q02)

逐步结果、finally清浏览器/server、非空通过和退出码易接CI；同步DSH子进程、静默import失败、首次基线PASS及serve/url优先级是需理解的实际边界。可复用声明式小型检查，但复杂流程仍适合直接Playwright。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

首次截图基线创建即PASS不能当视觉回归通过；DSH spawnSync阻塞Host且注册失败静默；serve优先于url还可能使实际目标与工具描述不符。通过只对应本次给定断言。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

已有明确标准的开发者先在localhost用正确/故意错误断言试用，回读实际URL和报告；未审spec或基线不能放行，Host阻塞或目标不符退回CLI/手写Playwright。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

入口、浏览器runner和报告/退出机制为源码支持；本轮未执行。作者示例/CI不是本轮验证；严格收据为未来假设。

- 已检查：作者 README、包清单、源码路径 package.json、README.md、dsh/plugin.mjs、mcp/server.mjs、bin/verify.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根组件45个tracked文件统计；重点DSH/MCP注册、runOne浏览器/基线/退出路径、README/package。未执行目标/浏览器，未把作者示例和CI当独立验证；未审全部gen/arena算法。 本轮重新核对固定源码的注册、核心执行、失败边界和归属，不将作者测试作本轮运行证据。
- 下一步：同页面故障集比较JSON与手写Playwright，独立审spec，固定构建与批准基线，记录实际URL、漏检、误放行、总尝试和人工分钟；DSH另测注册/超时与Host响应。

**分析版本**

- **仓库**：[263311487-ux/dsh-verify](https://github.com/263311487-ux/dsh-verify)
- **版本号**：0.9.6（[固定提交 e7ce637](https://github.com/263311487-ux/dsh-verify/tree/e7ce6376fec8cf94f41ce46264baeb348911693b)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是运行收据绑定构建、spec、浏览器及批准基线，并分开新建基线/比较通过/runner错误；故障集盲评判断范围与误放行，无改善或额外成本过高即否定。[Q05](#research-q05)

同页面故障集比较JSON与手写Playwright，独立审spec，固定构建与批准基线，记录实际URL、漏检、误放行、总尝试和人工分钟；DSH另测注册/超时与Host响应。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 23 | 1099 | — | — | 9236 |
| .mjs | source | 12 | 1432 | 1275 | 88 | — |
| .js | source | 2 | 46 | 28 | 8 | — |
| .mjs | test | 8 | 518 | 458 | 8 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/263311487-ux/dsh-verify/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/263311487-ux/dsh-verify/issues?q=is%3Aissue+created%3A2026-09-28T03%3A54%3A21.981Z..2026-10-28T03%3A54%3A21.981Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/263311487-ux/dsh-verify/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-28T03%3A54%3A21.981Z..2026-10-28T03%3A54%3A21.981Z)



统计日期：2026-10-28。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：JSON浏览器断言比agent自述多提供什么证据，PASS的范围和成本是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁使用Witness，实际入口是什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

给agent生成/修改网页后需要核查具体可观察行为的开发者与CI用户，合格任务是人工审定spec覆盖预期行为、真实浏览器执行并返回可读报告。相对agent自述或手写Playwright，它把常见动作/断言编码为JSON，接到CLI、MCP和DSH；Playwright提供浏览器能力，不归本包原创。DSH main注册一个dsh_verify工具，参数为spec/url/out/browser；MCP声明verify_spec、verify_url、generate_and_verify、health，前两者无需模型判断，生成spec才需要LLM。作者把runner称independent不代表需求或spec作者独立；同agent生成页面和spec仍需外部复核覆盖。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:22-42](https://github.com/263311487-ux/dsh-verify/blob/e7ce6376fec8cf94f41ce46264baeb348911693b/README.md#L22-L42)

作者给无key路径并明确PASS和独立性边界。

<details>
<summary>查看原文（21行）</summary>

````text
## First success — no API key

Requires Node.js 20+ and a one-time Chromium download. Install the current npm release with `npm install --save-dev dsh-verify@0.9.6`, then run `npx dsh-verify init`. Alternatively, run from a clone checkout:

```bash
git clone https://github.com/263311487-ux/dsh-verify && cd dsh-verify
npm ci
npx playwright install chromium
node bin/verify.mjs init
cd dsh-verify-starter
node ../bin/verify.mjs --spec dsh-verify.spec.json
# PASS (5/5), exit 0 -> dsh-verify-out/report.html
node ../bin/verify.mjs --spec dsh-verify.fail.json --out failed-report
# Intentional FAIL (4/5), exit 1 -> failed-report/report.html
```

Open either HTML report with its adjacent PNG file. The failing spec deliberately expects wrong text; inspect the assertion and screenshot. [Existing missing-CSS failure report](evidence/buggy-report.html) is another inspectable example.

`init [directory]` only writes a local fixture and two JSON specs. It never calls an LLM, launches a browser, or downloads anything. The destination must be new (its parent must exist); existing directories, files, and symlinks are refused without changes. No force/overwrite option. GitHub package and browser installation require internet; these starter checks use localhost only. `gen` and MCP `generate_and_verify` are optional, separate features that require an LLM key.

To check your own app, edit the JSON steps; keep `serve` for static files or use `base` for an existing URL. `serve` paths resolve from the command's current directory, not the spec file. A PASS applies only to the supplied checks in that run; it does not establish complete coverage, security, accessibility, or independent authorship. The app and spec may come from the same agent; review the spec separately when independence matters. Reports retain assertion details and explicitly requested screenshots, not a complete audit trail.
````

</details>

**依据 2 · 源码核查**：[README.md:75-100](https://github.com/263311487-ux/dsh-verify/blob/e7ce6376fec8cf94f41ce46264baeb348911693b/README.md#L75-L100)

与Playwright/agent browser/视觉工具的参照。

<details>
<summary>查看原文（26行）</summary>

````text
## How it fits with other tools

- Playwright scripts provide a general browser API. This package exposes common checks as a reviewable JSON spec and report; custom scripts remain useful for flows outside this schema.
- LLM evaluation tools can assess open-ended outputs and may also integrate browsers. This package evaluates explicit browser assertions without an LLM deciding their result.
- Agent browser tools let agents operate a page. Stored specs make repeat runs inspectable; independent review still depends on who writes and reviews the spec.
- Visual regression tools detect pixel changes. This package combines screenshot comparisons with behavior assertions; coverage depends on the chosen checks.

## Use it three ways

| Entry point | What it's for | One-liner |
|---|---|---|
| **MCP server** | Your AI agent verifies its own deliverable, mid-session | `claude mcp add dsh-verify -- npx -y -p dsh-verify dsh-verify-mcp` |
| **CLI** | You or your CI verify a build/URL | `npx dsh-verify init` |
| **GitHub Action** | Every push runs real-browser checks | `uses: 263311487-ux/dsh-verify/.github/actions/dsh-verify@main` |

### From any AI agent (MCP)

```bash
claude mcp add dsh-verify -- npx -y -p dsh-verify dsh-verify-mcp
```

Then tell your agent, in plain words:

> Verify http://localhost:3000 — click `#dark-toggle`, then check `body` background-color changed. Screenshot it.

Tools exposed: `verify_spec` (run a spec JSON), `verify_url` (inline checks, no files), `generate_and_verify` (the AI drafts the checklist, real Chromium executes it), `health`.
````

</details>

**依据 3 · 源码核查**：[dsh/plugin.mjs:7-21](https://github.com/263311487-ux/dsh-verify/blob/e7ce6376fec8cf94f41ce46264baeb348911693b/dsh/plugin.mjs#L7-L21)

真实DSH工具注册。

<details>
<summary>查看原文（15行）</summary>

```text
export const name = 'dsh-verify';
export const inject = ['tools'];

export function apply(ctx) {
  import('@deepseek-ai/dsh-tools')
    .then(({ defineTool }) => {
      ctx.tools.register(defineTool({
        name: 'dsh_verify',
        description: 'Witness — independent browser acceptance testing for agent-built web apps. Runs the dsh-verify CLI (real browser; PASS/FAIL with evidence receipts). Use when the agent built or changed a web app and must prove it works in a real browser.',
        parameters: {
          spec: { type: 'string', required: true, description: 'Path or glob to a JSON acceptance spec, e.g. specs/landing.json' },
          url: { type: 'string', description: 'Target URL; overrides spec.serve / spec.base / step path' },
          out: { type: 'string', description: 'Output directory for report.html + screenshots (default: ./dsh-verify-out)' },
          browser: { type: 'string', enum: ['chromium', 'firefox', 'webkit'], description: 'Browser engine (default: chromium)' },
        },
```

</details>

**依据 4 · 源码核查**：[mcp/server.mjs:27-91](https://github.com/263311487-ux/dsh-verify/blob/e7ce6376fec8cf94f41ce46264baeb348911693b/mcp/server.mjs#L27-L91)

四个MCP工具和可选LLM生成。

<details>
<summary>查看原文（65行）</summary>

```text
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'verify_spec',
      description:
        'Run a dsh-verify acceptance spec (JSON file, or glob) against a real headless Chromium. ' +
        'The spec may serve a local static dir (spec.serve) or target any URL (spec.base / step.url). ' +
        'Returns PASS/FAIL with per-step results and a self-contained HTML report path. ' +
        'Exit-code semantics: ok=true means every step passed. This is deterministic — no LLM judges the outcome.',
      inputSchema: {
        type: 'object',
        properties: {
          specPath: { type: 'string', description: 'Path to the spec JSON file or glob (e.g. specs/*.json)' },
          out: { type: 'string', description: 'Output dir for report.html + screenshots (default: ./dsh-verify-out)' },
          url: { type: 'string', description: 'Optional target URL override (spec.base / step path ignored)' },
          headed: { type: 'boolean', description: 'Run with a visible browser (debug only)' },
        },
        required: ['specPath'],
      },
    },
    {
      name: 'verify_url',
      description:
        'Verify a live URL against a list of human-style checks, driven by a real headless Chromium. ' +
        'Checks are dsh-verify steps: goto/click/fill/wait/expect_text/expect_class/capture_style/' +
        'expect_style_changed/expect_url_contains/expect_navigation/expect_console_errors/' +
        'expect_network_errors/screenshot. If no goto step is given, a goto to the url is prepended. ' +
        'Returns PASS/FAIL with per-step results and a self-contained HTML report path. Deterministic — no LLM judges the outcome.',
      inputSchema: {
        type: 'object',
        properties: {
          url: { type: 'string', description: 'Target URL to open' },
          checks: {
            type: 'array',
            description: 'Human-style checks, e.g. [{action:"click",selector:"#dark-toggle"}, {action:"capture_style",selector:"body",prop:"backgroundColor",var:"bg"}, {action:"expect_style_changed",selector:"body",prop:"backgroundColor",var:"bg"}]',
            items: { type: 'object' },
          },
          out: { type: 'string', description: 'Output dir for report.html + screenshots (default: ./dsh-verify-out)' },
          headed: { type: 'boolean', description: 'Run with a visible browser (debug only)' },
        },
        required: ['url', 'checks'],
      },
    },
    {
      name: 'generate_and_verify',
      description:
        'AI-drafts an acceptance checklist for a URL (LLM writes it, a real browser executes it), then immediately runs it in real Chromium. ' +
        'Pass requirements as a plain-language description of what a human QA should verify (e.g. "dark-mode toggle changes the background color"). ' +
        'Requires DEEPSEEK_API_KEY or OPENAI_API_KEY in the server environment. Returns the drafted spec path plus the PASS/FAIL verdict, per-step results and report path.',
      inputSchema: {
        type: 'object',
        properties: {
          url: { type: 'string', description: 'Target URL to verify' },
          requirements: { type: 'string', description: 'Plain-language QA requirements (optional)' },
          out: { type: 'string', description: 'Output dir for spec + report (default: ./dsh-verify-out)' },
          model: { type: 'string', description: 'LLM model (default: deepseek-v4-flash)' },
          headed: { type: 'boolean', description: 'Run with a visible browser (debug only)' },
        },
        required: ['url'],
      },
    },
    {
      name: 'health',
      description: 'Check that the dsh-verify MCP server and its Chromium browser are ready to run verifications.',
      inputSchema: { type: 'object', properties: {} },
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 执行和报告怎样闭环？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

runOne读取spec，选择Chromium/Firefox/WebKit，静态serve起127.0.0.1随机端口，否则访问base；动作逐条执行、异常转单步fail而非忽略。finally关闭浏览器和临时server，results.every(ok)且total>0才通过；输出HTML包括逐步assertion及显式请求的截图/diff。main按spec逐个运行，全部通过才exit0，缺spec或无匹配exit2；runner异常走exit1。可借鉴点是把黑箱页面行为转为可复跑检查并保留失败上下文，不把浏览器启动或截图存在当通过。报告不是完整audit trail，浏览器console/network等也只受spec所选断言约束；本轮不执行这些功能。

#### 证据与依据

**依据 1 · 源码核查**：[bin/verify.mjs:81-98](https://github.com/263311487-ux/dsh-verify/blob/e7ce6376fec8cf94f41ce46264baeb348911693b/bin/verify.mjs#L81-L98)

仅localhost静态server。

<details>
<summary>查看原文（18行）</summary>

```text
async function serveDir(dir) {
  const root = resolve(dir);
  const server = createServer(async (req, res) => {
    try {
      const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
      let fp = join(root, urlPath);
      if (!fp.startsWith(root)) { res.writeHead(403); return res.end(); }
      let st = await stat(fp).catch(() => null);
      if (st && st.isDirectory()) fp = join(fp, 'index.html');
      const data = await readFile(fp);
      res.writeHead(200, { 'content-type': MIME[extname(fp).toLowerCase()] || 'application/octet-stream' });
      res.end(data);
    } catch {
      res.writeHead(404); res.end('not found');
    }
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  return { url: `http://127.0.0.1:${server.address().port}`, close: () => server.close() };
```

</details>

**依据 2 · 源码核查**：[bin/verify.mjs:131-141](https://github.com/263311487-ux/dsh-verify/blob/e7ce6376fec8cf94f41ce46264baeb348911693b/bin/verify.mjs#L131-L141)

spec/engine/base的实际初始化。

<details>
<summary>查看原文（11行）</summary>

```text
export async function runOne(specPath, outDir, { headed, url, updateBaselines, browser: browserName } = {}) {
  const spec = JSON.parse(await readFile(specPath, 'utf8'));
  const engine = BROWSERS[browserName || spec.browser || 'chromium'];
  if (!engine) throw new Error(`unknown browser "${browserName || spec.browser}" (chromium | firefox | webkit)`);
  const served = spec.serve ? await serveDir(spec.serve) : null;
  const base = served ? served.url : (url || spec.base || 'http://localhost');
  const results = [];
  let browser = null;

  const fail = (step, msg) => results.push({ ...step, ok: false, detail: msg });
  const pass = (step, detail) => results.push({ ...step, ok: true, detail: detail || 'ok' });
```

</details>

**依据 3 · 源码核查**：[bin/verify.mjs:250-262](https://github.com/263311487-ux/dsh-verify/blob/e7ce6376fec8cf94f41ce46264baeb348911693b/bin/verify.mjs#L250-L262)

未知action失败、异常收集、cleanup和非空通过。

<details>
<summary>查看原文（13行）</summary>

```text
        else fail(step, `unknown action "${a}"`);
      } catch (e) {
        fail(step, String(e && e.message || e).slice(0, 300));
      }
    }
  } finally {
    if (browser) await browser.close().catch(() => {});
    if (served) served.close();
  }

  const passed = results.filter((r) => r.ok).length;
  const total = results.length;
  const ok = results.every((r) => r.ok) && total > 0;
```

</details>

**依据 4 · 源码核查**：[bin/verify.mjs:323-358](https://github.com/263311487-ux/dsh-verify/blob/e7ce6376fec8cf94f41ce46264baeb348911693b/bin/verify.mjs#L323-L358)

多spec verdict及明确退出。

<details>
<summary>查看原文（36行）</summary>

```text
  if (has('help')) { process.stdout.write(HELP); process.exit(0); }
  const pattern = arg('spec');
  if (!pattern) { process.stdout.write(HELP); process.exit(2); }
  const specPaths = await expandSpecPaths(pattern);
  if (specPaths.length === 0) { console.error(`no specs matched: ${pattern}`); process.exit(2); }
  const outDir = resolve(arg('out', 'dsh-verify-out'));
  const multi = specPaths.length > 1;
  const results = [];

  for (const sp of specPaths) {
    const specOut = multi ? join(outDir, basename(sp).replace(/\.json$/, '')) : outDir;
    const r = await runOne(sp, specOut, { headed: has('headed'), url: arg('url'), updateBaselines: has('update-baselines'), browser: arg('browser') });
    results.push(r);
    if (multi) {
      console.log(`${r.ok ? '[PASS]' : '[FAIL]'} ${sp} (${r.passed}/${r.total})`);
      if (!r.ok) printFailed(r.failed);
    } else {
      console.log(`\ndsh-verify: ${r.ok ? 'PASS' : 'FAIL'} (${r.passed}/${r.total})`);
      if (!r.ok) printFailed(r.failed);
      console.log(`report: ${r.report}`);
    }
  }

  const allOk = results.length > 0 && results.every((r) => r.ok);
  if (!has('json') && results.length > 0) {
    console.log(`\nWitness — useful? ⭐ star the repo: https://github.com/263311487-ux/dsh-verify`);
  }
  if (has('json')) {
    process.stdout.write(JSON.stringify({
      verdict: allOk ? 'PASS' : 'FAIL',
      specs: results.map((r) => ({ name: r.name, verdict: r.ok ? 'PASS' : 'FAIL', passed: r.passed, total: r.total, failed: r.failed, report: r.report })),
      passed: results.filter((r) => r.ok).length,
      total: results.length,
    }) + '\n');
  }
  process.exit(allOk ? 0 : 1);
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · PASS、截图基线与URL覆盖的边界是什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

首次expect_screenshot在基线缺失时写当前图并pass，--update-baselines同样更新并pass；这证明创建了基线，不是同已批准图比较成功。断言都可由同一agent编写，因此完整性、语义与独立性不能从通过率推出。DSH工具execute内spawnSync最多180秒，会阻塞当前Node事件循环，超时status可能null；结果仍按status===0判断，而import失败catch为空会静默缺工具。另一个具体行为是runOne先用spec.serve起server，base优先served.url，只有没有serve才用传入url，和工具文字“url overrides serve”不一致；指定url不必然把静态spec转向线上目标。应回读实际goto与报告URL，不能以参数表代替被测对象身份。

#### 证据与依据

**依据 1 · 源码核查**：[bin/verify.mjs:225-245](https://github.com/263311487-ux/dsh-verify/blob/e7ce6376fec8cf94f41ce46264baeb348911693b/bin/verify.mjs#L225-L245)

首次/更新基线直接pass与后续像素阈值比较。

<details>
<summary>查看原文（21行）</summary>

```text
        else if (a === 'expect_screenshot') {
          const name = (step.name || `shot-${results.length}`).replace(/[^\w.-]/g, '_');
          const baseDir = join(outDir, 'baselines');
          const basePath = join(baseDir, name + '.png');
          const png = await snap(page, step);
          await mkdir(baseDir, { recursive: true });
          if (updateBaselines || !(await stat(basePath).catch(() => null))) {
            await writeFile(basePath, png);
            pass(step, updateBaselines ? 'baseline updated' : 'baseline created');
          } else {
            const base = await readFile(basePath);
            const c = comparePng(base, png, { tolerance: step.tolerance ?? 10 });
            const threshold = step.threshold ?? 0.01;
            if (c.diffRatio <= threshold) {
              pass(step, `diff ${(c.diffRatio * 100).toFixed(2)}% <= ${(threshold * 100).toFixed(2)}%`);
            } else {
              const diffDir = join(outDir, 'diffs');
              await mkdir(diffDir, { recursive: true });
              const diffRel = 'diffs/' + name + '-diff.png';
              await writeFile(join(outDir, diffRel), c.diffPng || Buffer.from(''));
              fail(step, `diff ${(c.diffRatio * 100).toFixed(2)}% > ${(threshold * 100).toFixed(2)}% (${c.note || diffRel})`);
```

</details>

**依据 2 · 源码核查**：[bin/verify.mjs:131-136](https://github.com/263311487-ux/dsh-verify/blob/e7ce6376fec8cf94f41ce46264baeb348911693b/bin/verify.mjs#L131-L136)

serve优先，URL只在无serve时生效。

```text
export async function runOne(specPath, outDir, { headed, url, updateBaselines, browser: browserName } = {}) {
  const spec = JSON.parse(await readFile(specPath, 'utf8'));
  const engine = BROWSERS[browserName || spec.browser || 'chromium'];
  if (!engine) throw new Error(`unknown browser "${browserName || spec.browser}" (chromium | firefox | webkit)`);
  const served = spec.serve ? await serveDir(spec.serve) : null;
  const base = served ? served.url : (url || spec.base || 'http://localhost');
```

**依据 3 · 源码核查**：[dsh/plugin.mjs:42-61](https://github.com/263311487-ux/dsh-verify/blob/e7ce6376fec8cf94f41ce46264baeb348911693b/dsh/plugin.mjs#L42-L61)

同步子进程、超时和静默注册失败。

<details>
<summary>查看原文（20行）</summary>

```text
        async execute(args) {
          const bin = fileURLToPath(new URL('../bin/verify.mjs', import.meta.url));
          const argv = [bin, '--json', '--spec', String(args.spec)];
          if (args.url) argv.push('--url', String(args.url));
          if (args.out) argv.push('--out', String(args.out));
          if (args.browser) argv.push('--browser', String(args.browser));
          const r = spawnSync(process.execPath, argv, { encoding: 'utf8', timeout: 180000, maxBuffer: 16 * 1024 * 1024 });
          const stdout = (r.stdout || '').trim();
          const stderr = (r.stderr || '').trim();
          return {
            ok: r.status === 0,
            exitCode: r.status,
            summary: stdout.split('\n').slice(-6).join('\n'),
            report: stdout.slice(0, 8000),
            stderr: stderr.slice(0, 2000),
          };
        },
      }));
    })
    .catch(() => {});
```

</details>

#### 缺口

- Host真实工具注册、180秒阻塞影响及不同URL/serve组合未运行验证。
  **影响**：不能宣称无人复核安全放行或远程目标必然正确。
  **进一步探讨**：隔离profile用不同标识的静态/远程页，检查传url后的实际地址；长任务观察Host响应，并单独批准基线。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 要完成合格检查，用户还承担什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

首次需要Node20+、Playwright依赖和对应浏览器下载；init只写新目录fixture/spec，无模型/浏览器/下载动作，不能当安装验收。持续成本主要是编写可观察断言、准备状态和测试数据、审批基线、浏览器资源和失败排查。gen/MCP generate_and_verify是可选模型调用，要另核key、输入内容和费用；无需key的确定性runner不代表所有路径免费。静态serve目录相对命令cwd而非spec位置，用户应确认不会暴露无关本地资源；有写操作的网页检查也会产生真实业务副作用，应在测试环境用可恢复数据。没有合格任务对照无法算每次验收节时或单位成本。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:24-42](https://github.com/263311487-ux/dsh-verify/blob/e7ce6376fec8cf94f41ce46264baeb348911693b/README.md#L24-L42)

Node、浏览器、init和serve cwd/报告边界。

<details>
<summary>查看原文（19行）</summary>

````text
Requires Node.js 20+ and a one-time Chromium download. Install the current npm release with `npm install --save-dev dsh-verify@0.9.6`, then run `npx dsh-verify init`. Alternatively, run from a clone checkout:

```bash
git clone https://github.com/263311487-ux/dsh-verify && cd dsh-verify
npm ci
npx playwright install chromium
node bin/verify.mjs init
cd dsh-verify-starter
node ../bin/verify.mjs --spec dsh-verify.spec.json
# PASS (5/5), exit 0 -> dsh-verify-out/report.html
node ../bin/verify.mjs --spec dsh-verify.fail.json --out failed-report
# Intentional FAIL (4/5), exit 1 -> failed-report/report.html
```

Open either HTML report with its adjacent PNG file. The failing spec deliberately expects wrong text; inspect the assertion and screenshot. [Existing missing-CSS failure report](evidence/buggy-report.html) is another inspectable example.

`init [directory]` only writes a local fixture and two JSON specs. It never calls an LLM, launches a browser, or downloads anything. The destination must be new (its parent must exist); existing directories, files, and symlinks are refused without changes. No force/overwrite option. GitHub package and browser installation require internet; these starter checks use localhost only. `gen` and MCP `generate_and_verify` are optional, separate features that require an LLM key.

To check your own app, edit the JSON steps; keep `serve` for static files or use `base` for an existing URL. `serve` paths resolve from the command's current directory, not the spec file. A PASS applies only to the supplied checks in that run; it does not establish complete coverage, security, accessibility, or independent authorship. The app and spec may come from the same agent; review the spec separately when independence matters. Reports retain assertion details and explicitly requested screenshots, not a complete audit trail.
````

</details>

**依据 2 · 源码核查**：[mcp/server.mjs:70-85](https://github.com/263311487-ux/dsh-verify/blob/e7ce6376fec8cf94f41ce46264baeb348911693b/mcp/server.mjs#L70-L85)

可选生成的key/模型条件。

<details>
<summary>查看原文（16行）</summary>

```text
    {
      name: 'generate_and_verify',
      description:
        'AI-drafts an acceptance checklist for a URL (LLM writes it, a real browser executes it), then immediately runs it in real Chromium. ' +
        'Pass requirements as a plain-language description of what a human QA should verify (e.g. "dark-mode toggle changes the background color"). ' +
        'Requires DEEPSEEK_API_KEY or OPENAI_API_KEY in the server environment. Returns the drafted spec path plus the PASS/FAIL verdict, per-step results and report path.',
      inputSchema: {
        type: 'object',
        properties: {
          url: { type: 'string', description: 'Target URL to verify' },
          requirements: { type: 'string', description: 'Plain-language QA requirements (optional)' },
          out: { type: 'string', description: 'Output dir for spec + report (default: ./dsh-verify-out)' },
          model: { type: 'string', description: 'LLM model (default: deepseek-v4-flash)' },
          headed: { type: 'boolean', description: 'Run with a visible browser (debug only)' },
        },
        required: ['url'],
```

</details>

**依据 3 · 源码核查**：[bin/verify.mjs:81-98](https://github.com/263311487-ux/dsh-verify/blob/e7ce6376fec8cf94f41ce46264baeb348911693b/bin/verify.mjs#L81-L98)

静态读取真实文件并监听localhost。

<details>
<summary>查看原文（18行）</summary>

```text
async function serveDir(dir) {
  const root = resolve(dir);
  const server = createServer(async (req, res) => {
    try {
      const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
      let fp = join(root, urlPath);
      if (!fp.startsWith(root)) { res.writeHead(403); return res.end(); }
      let st = await stat(fp).catch(() => null);
      if (st && st.isDirectory()) fp = join(fp, 'index.html');
      const data = await readFile(fp);
      res.writeHead(200, { 'content-type': MIME[extname(fp).toLowerCase()] || 'application/octet-stream' });
      res.end(data);
    } catch {
      res.writeHead(404); res.end('not found');
    }
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  return { url: `http://127.0.0.1:${server.address().port}`, close: () => server.close() };
```

</details>

#### 缺口

- spec维护时间、浏览器资源、LLM生成成本和缺陷检出率未知。
  **影响**：不能断言比手写Playwright便宜或更独立。
  **进一步探讨**：同页面同故障集对照手写脚本，计断言审阅/失败/重跑全成本与漏检。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎么试用，哪项改进值得检验？

**研究主题**：采用判断、新假设与验证

#### 完整回答

适合已有明确网页验收标准且能审spec的开发者先在localhost测试页面试用：独立指定一个应通过和一个故意错误的断言，检查实际URL、HTML与相邻PNG，再批准截图基线；原生DSH集成另核工具注册与Host可响应。不能把PASS作为安全、无障碍或完整交付证明。未验证假设是绑定构建/spec/浏览器版本/已批准基线的运行收据，区分baseline_created、comparison_pass与runner_error，可降低错误放行。以同一构建变更spec/基线/URL的故障集盲评维护者能否判断检查范围；错误放行不降或文书成本更高即否定。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:38-42](https://github.com/263311487-ux/dsh-verify/blob/e7ce6376fec8cf94f41ce46264baeb348911693b/README.md#L38-L42)

检查报告/截图与PASS范围的作者边界。

```text
Open either HTML report with its adjacent PNG file. The failing spec deliberately expects wrong text; inspect the assertion and screenshot. [Existing missing-CSS failure report](evidence/buggy-report.html) is another inspectable example.

`init [directory]` only writes a local fixture and two JSON specs. It never calls an LLM, launches a browser, or downloads anything. The destination must be new (its parent must exist); existing directories, files, and symlinks are refused without changes. No force/overwrite option. GitHub package and browser installation require internet; these starter checks use localhost only. `gen` and MCP `generate_and_verify` are optional, separate features that require an LLM key.

To check your own app, edit the JSON steps; keep `serve` for static files or use `base` for an existing URL. `serve` paths resolve from the command's current directory, not the spec file. A PASS applies only to the supplied checks in that run; it does not establish complete coverage, security, accessibility, or independent authorship. The app and spec may come from the same agent; review the spec separately when independence matters. Reports retain assertion details and explicitly requested screenshots, not a complete audit trail.
```

**依据 2 · 源码核查**：[bin/verify.mjs:225-245](https://github.com/263311487-ux/dsh-verify/blob/e7ce6376fec8cf94f41ce46264baeb348911693b/bin/verify.mjs#L225-L245)

当前首次基线pass是新状态分类的依据。

<details>
<summary>查看原文（21行）</summary>

```text
        else if (a === 'expect_screenshot') {
          const name = (step.name || `shot-${results.length}`).replace(/[^\w.-]/g, '_');
          const baseDir = join(outDir, 'baselines');
          const basePath = join(baseDir, name + '.png');
          const png = await snap(page, step);
          await mkdir(baseDir, { recursive: true });
          if (updateBaselines || !(await stat(basePath).catch(() => null))) {
            await writeFile(basePath, png);
            pass(step, updateBaselines ? 'baseline updated' : 'baseline created');
          } else {
            const base = await readFile(basePath);
            const c = comparePng(base, png, { tolerance: step.tolerance ?? 10 });
            const threshold = step.threshold ?? 0.01;
            if (c.diffRatio <= threshold) {
              pass(step, `diff ${(c.diffRatio * 100).toFixed(2)}% <= ${(threshold * 100).toFixed(2)}%`);
            } else {
              const diffDir = join(outDir, 'diffs');
              await mkdir(diffDir, { recursive: true });
              const diffRel = 'diffs/' + name + '-diff.png';
              await writeFile(join(outDir, diffRel), c.diffPng || Buffer.from(''));
              fail(step, `diff ${(c.diffRatio * 100).toFixed(2)}% > ${(threshold * 100).toFixed(2)}% (${c.note || diffRel})`);
```

</details>

**依据 3 · 源码核查**：[dsh/plugin.mjs:48-56](https://github.com/263311487-ux/dsh-verify/blob/e7ce6376fec8cf94f41ce46264baeb348911693b/dsh/plugin.mjs#L48-L56)

状态null/文本裁剪为runner错误辨识的依据。

```text
          const r = spawnSync(process.execPath, argv, { encoding: 'utf8', timeout: 180000, maxBuffer: 16 * 1024 * 1024 });
          const stdout = (r.stdout || '').trim();
          const stderr = (r.stderr || '').trim();
          return {
            ok: r.status === 0,
            exitCode: r.status,
            summary: stdout.split('\n').slice(-6).join('\n'),
            report: stdout.slice(0, 8000),
            stderr: stderr.slice(0, 2000),
```

#### 缺口

- 更严格运行收据对误放行和维护成本的改善未知。
  **影响**：新假设不计已有贡献或已证需求。
  **进一步探讨**：在故障集记录范围判断错误、漏检和人工分钟，不改善就保留人工清单。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
