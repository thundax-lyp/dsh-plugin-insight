# dsh-verify

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[d969899](https://github.com/263311487-ux/dsh-verify/tree/d969899808e51dcccd261588f667b18633020fca)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/263311487-ux/dsh-verify) [![npm 30d 2,385](https://img.shields.io/static/v1?label=npm+30d&message=2%2C385&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-verify) [![最新发布 2026-10-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-09&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-verify)
<!-- END META -->

> **实现功能**：执行 JSON 浏览器步骤并生成断言、截图和视觉差异报告，提供 CLI、MCP 与 DSH 工具入口。

> **核心亮点**：将小型JSON动作、真实浏览器与可读结果接到CLI/MCP/DSH，降低手写测试接线；独立执行不等需求或作者独立。详见[Q01](#research-q01)。

> **风险与缺陷**：首次expect_screenshot创建基线即PASS，结果只对应给定步骤；DSH spawnSync阻塞host且未见会话策略接线，不能当无人复核交付保证。详见[Q03](#research-q03)。

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
  - [Q01 · 相对Agent自述和Playwright脚本增加什么？](#detail-section-11)
  - [Q02 · JSON spec怎样生成真实浏览器和报告？](#detail-section-12)
  - [Q03 · PASS、视觉基线和宿主执行有什么限制？](#detail-section-13)
  - [Q04 · 依赖、三阶段成本与工程设计是什么？](#detail-section-14)
  - [Q05 · 可推导何种更强记录，当前怎样采用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：Agent网页交付后用真实浏览器检查明确行为，合格结果只覆盖独立审读过的spec和基线，不是整站认证。详见[Q01](#research-q01)。

直接Playwright与人工浏览器检查是简单对照，插件减少接线并提供报告，不改变需求覆盖和独立性责任。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| JSON行为断言 | 检查网页动作 | 覆盖由spec决定 |
| 视觉差异 | 对比截图 | 基线需独立批准 |
| CLI/MCP/DSH | 多入口调用 | DSH同步阻塞需注意 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| Node/Playwright/browser | 执行步骤 | 未装browser为runner错误 |
| 可信spec与目标 | 定义检查 | 不全覆盖不能全站通过 |
| 经批准视觉基线 | 回归对照 | 新基线不是独立证明 |
| 可选LLM API | 生成spec | 费用与独立审读另算 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 安装依赖/browser | 开发者 | runner可启动 |
| 审spec及基线 | 需求/验收者 | 有必要反例且对应构建 |
| 执行并读报告 | 工具/开发者 | 原动作/截图支持有限结论 |
| 故障分类后处理 | 开发者 | 不混淆FAIL/ERROR/新基线 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 下载浏览器及依赖 | 写/审spec、批准基线 | 浏览器下载/依赖规模与spec审阅工时未知 |
| 持续使用 | browser CPU/内存、截图/CI；可选gen API费 | 分析报告和覆盖，节省未测 | browser/截图/CI资源和可选gen API费依任务；节省未知 |
| 失败恢复 | 重跑及保留报告 | 区分产品FAIL与runner ERROR，审慎更新基线 | FAIL与ERROR要分；重跑/基线重审工时未知 |


#### 效果

| 目标 | 源码支持 | 边界 |
| --- | --- | --- |
| 真实行为检查 | Playwright步骤 | 只查spec覆盖 |
| 视觉回归 | 像素差阈值 | 初始创建基线直接PASS |
| 验收材料 | HTML/截图/差异 | 非完整审计或独立需求证明 |

> **思考**：首次expect_screenshot创建基线即PASS，结果只对应给定步骤；DSH spawnSync阻塞host且未见会话策略接线，不能当无人复核交付保证。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将小型JSON动作、真实浏览器与可读结果接到CLI/MCP/DSH，降低手写测试接线；独立执行不等需求或作者独立。详见[Q01](#research-q01)。

将小型JSON动作、真实浏览器与可读结果接到CLI/MCP/DSH，降低手写测试接线；独立执行不等需求或作者独立。详见[Q01](#research-q01)。

逐步结果、固定视口和真浏览器对照可借鉴；DSH同步子进程及静默注册失败应理解，视觉测试存在不等测试通过。详见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

首次expect_screenshot创建基线即PASS，结果只对应给定步骤；DSH spawnSync阻塞host且未见会话策略接线，不能当无人复核交付保证。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议可信本地有限spec试用，故意缺陷应失败、合法实现应通过；空覆盖、新基线和ERROR不放行，host阻塞或范围不清时停止。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

真实浏览器步骤和报告机制有源码支持；初始基线PASS、覆盖和宿主阻塞限制结果。运行绑定收据为未验证方向。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、dsh/plugin.mjs、bin/verify.mjs、bin/gen.mjs、tests/visual.test.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交DSH包装、CLI步骤/视觉基线/静态server、可选gen和视觉测试源码阅读；不启动浏览器、模型或目标服务，不把历史Arena排名当当前有效证据。
- 下一步：进一步探讨从空spec、初始基线、故意缺CSS和runner缺browser四类反例入手，再比较正确发现率、漏检和维护成本。

**分析版本**

- **仓库**：[263311487-ux/dsh-verify](https://github.com/263311487-ux/dsh-verify)
- **版本号**：0.9.6（[固定提交 d969899](https://github.com/263311487-ux/dsh-verify/tree/d969899808e51dcccd261588f667b18633020fca)）
- **版本日期**：2026-10-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可研究绑定构建/spec/批准基线及browser版本的运行收据，区分新基线、比较PASS和runner错误，并盲评能否正确界定放行范围。当前未验证。详见[Q05](#research-q05)。

进一步探讨从空spec、初始基线、故意缺CSS和runner缺browser四类反例入手，再比较正确发现率、漏检和维护成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 20 | 1032 | — | — | 8834 |
| .mjs | source | 12 | 1432 | 1275 | 88 | — |
| .js | source | 2 | 46 | 28 | 8 | — |
| .mjs | test | 8 | 518 | 458 | 8 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/263311487-ux/dsh-verify/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/263311487-ux/dsh-verify/issues?q=is%3Aissue+created%3A2026-09-22T05%3A14%3A17.880Z..2026-10-22T05%3A14%3A17.880Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/263311487-ux/dsh-verify/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A14%3A17.880Z..2026-10-22T05%3A14%3A17.880Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本浏览器执行器怎样给出有限spec的PASS/FAIL，视觉基线、执行范围与证据独立性限制是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相对Agent自述和Playwright脚本增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向让Agent交付网页后需要核对具体交互的开发者。输入是明确JSON步骤与目标构建，合格结果是实际浏览器执行这些步骤的断言和必要截图，不是模型说完成。简单替代是直接写Playwright或人工点页面；插件提供小型动作语言、CLI/DSH/MCP接线和HTML结果，减少每次写测试工程的门槛。

底层浏览器来自Playwright，断言只是已写spec覆盖的范围。应用和spec可能来自同一Agent，因此浏览器执行独立于模型口头自评，不等于需求标准或作者独立。README已明确PASS不证明完整性、安全、无障碍或独立审查；DSH工具description仍称independent acceptance并要求prove works，读者应按实际有限断言收窄理解。已有贡献是执行和可读记录，不是全自动质量认证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-7](https://github.com/263311487-ux/dsh-verify/blob/d969899808e51dcccd261588f667b18633020fca/README.md#L3-L7)

作者首屏限定浏览器断言的证明范围。

```text
[中文](README.zh.md) | English

> **Witness** — Check the behavior your browser spec describes.
> Browser assertions can expose some implementation gaps; they do not prove an app is complete or independently reviewed.
> *(Witness is the product name; `dsh-verify` is the package name — same thing.)*
```

**依据 2 · 作者声明**：[README.md:40-44](https://github.com/263311487-ux/dsh-verify/blob/d969899808e51dcccd261588f667b18633020fca/README.md#L40-L44)

作者明确有限spec与独立性边界。

```text
`init [directory]` only writes a local fixture and two JSON specs. It never calls an LLM, launches a browser, or downloads anything. The destination must be new (its parent must exist); existing directories, files, and symlinks are refused without changes. No force/overwrite option. GitHub package and browser installation require internet; these starter checks use localhost only. `gen` and MCP `generate_and_verify` are optional, separate features that require an LLM key.

To check your own app, edit the JSON steps; keep `serve` for static files or use `base` for an existing URL. `serve` paths resolve from the command's current directory, not the spec file. A PASS applies only to the supplied checks in that run; it does not establish complete coverage, security, accessibility, or independent authorship. The app and spec may come from the same agent; review the spec separately when independence matters. Reports retain assertion details and explicitly requested screenshots, not a complete audit trail.

![dsh-verify — Agents say done. The browser proves it.](assets/social-card.png)
```

**依据 3 · 源码核查**：[dsh/plugin.mjs:13-20](https://github.com/263311487-ux/dsh-verify/blob/d969899808e51dcccd261588f667b18633020fca/dsh/plugin.mjs#L13-L20)

DSH工具描述和参数表达较强验收措辞。

```text
      ctx.tools.register(defineTool({
        name: 'dsh_verify',
        description: 'Witness — independent browser acceptance testing for agent-built web apps. Runs the dsh-verify CLI (real browser; PASS/FAIL with evidence receipts). Use when the agent built or changed a web app and must prove it works in a real browser.',
        parameters: {
          spec: { type: 'string', required: true, description: 'Path or glob to a JSON acceptance spec, e.g. specs/landing.json' },
          url: { type: 'string', description: 'Target URL; overrides spec.serve / spec.base / step path' },
          out: { type: 'string', description: 'Output directory for report.html + screenshots (default: ./dsh-verify-out)' },
          browser: { type: 'string', enum: ['chromium', 'firefox', 'webkit'], description: 'Browser engine (default: chromium)' },
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · JSON spec怎样生成真实浏览器和报告？

**研究主题**：功能与机制

#### 完整回答

runOne读JSON，选chromium/firefox/webkit，serve目录可启动本地HTTP或使用目标base，启动浏览器1280x800页面，按顺序goto/click及各类expect操作。pageerror加入失败，console/network错误仅在对应断言步骤检查；每步try/catch保留失败，未知动作也fail，最后报告收集的步骤和截图/差异文件。

DSH插件注册dsh_verify，拼CLI argv然后spawnSync当前Node，固定180秒与16MiB输出上限，status0映射ok。这里是直接宿主子进程，所读入口未接会话sandboxPolicy或cwd；spec路径和serve按进程目录解释。可选gen使用LLM读取页面facts和requirements生成JSON，它不是执行断言时的LLM裁判，也不能因为格式验证就保证需求覆盖。init只生成本地模板，两条路线须区分。

#### 证据与依据

**依据 1 · 源码核查**：[bin/verify.mjs:131-159](https://github.com/263311487-ux/dsh-verify/blob/d969899808e51dcccd261588f667b18633020fca/bin/verify.mjs#L131-L159)

浏览器选择、server、事件和步骤执行。

<details>
<summary>查看原文（29行）</summary>

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

  try {
    browser = await engine.launch({ headless: !headed });
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    const consoleErrors = [];
    const networkErrors = [];
    page.on('pageerror', (e) => { results.push({ action: 'pageerror', ok: false, detail: String(e) }); });
    page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    page.on('response', (r) => { if (r.status() >= 400) networkErrors.push(`${r.status()} ${r.url()}`); });
    page.on('requestfailed', (r) => { networkErrors.push(`failed ${r.url()}`); });

    for (const step of spec.steps || []) {
      const a = step.action;
      try {
        if (a === 'goto') { await page.goto(step.url || base + (step.path || '/index.html'), { waitUntil: 'load' }); pass(step, page.url()); }
        else if (a === 'wait') { await page.waitForTimeout(step.ms || 500); pass(step, `${step.ms || 500}ms`); }
        else if (a === 'click') {
          const n = step.count || 1;
```

</details>

**依据 2 · 源码核查**：[dsh/plugin.mjs:42-57](https://github.com/263311487-ux/dsh-verify/blob/d969899808e51dcccd261588f667b18633020fca/dsh/plugin.mjs#L42-L57)

同步CLI启动、超时及status映射。

<details>
<summary>查看原文（16行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[bin/gen.mjs:119-139](https://github.com/263311487-ux/dsh-verify/blob/d969899808e51dcccd261588f667b18633020fca/bin/gen.mjs#L119-L139)

可选LLM生成spec的外部请求。

<details>
<summary>查看原文（21行）</summary>

```text
export async function generateSpec({ url, requirements = '', pageFacts, model, apiKey, baseUrl, provider = 'deepseek', signal }) {
  const key = apiKey || process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY;
  if (!key) throw new Error('no LLM API key — set DEEPSEEK_API_KEY (or pass --api-key)');
  const base = baseUrl || (provider === 'openai' ? 'https://api.openai.com/v1' : 'https://api.deepseek.com');
  const mdl = model || (provider === 'openai' ? 'gpt-4o-mini' : 'deepseek-v4-flash');
  if (!pageFacts) throw new Error('pageFacts is required (browse the page first)');

  const res = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: mdl,
      messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: buildPrompt({ url, requirements, facts: pageFacts }) }],
      temperature: 0.2,
      response_format: { type: 'json_object' },
    }),
    signal,
  });
  if (!res.ok) throw new Error(`LLM API ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = await res.json();
  const content = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '';
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · PASS、视觉基线和宿主执行有什么限制？

**研究主题**：缺陷与关键质疑

#### 完整回答

视觉expect_screenshot在基线不存在或updateBaselines时写当前png并pass，所以首次绿色只说明建立基线，不能证明与已批准设计一致。即使存在基线，差异比例及像素容差只是视觉变化判据，不能判断按钮实现业务正确。spec.steps为空时循环不做覆盖，验收应由读者另行检查是否真的存在必要动作与反例；同一Agent写“刚好符合实现”的检查仍可能漏需求。

DSH入口spawnSync会阻塞host线程直至子进程返回，三分钟上限可能影响其他会话；它对目标URL、文件spec和out目录没有本地工作区限制，真实权限取决于宿主执行边界。工具导入失败catch为空会静默不注册，不能把未见工具解释为没有风险。静态serve按路径字符串前缀与stat/read提供文件，所读片段未物理核对symlink；仅绑定127.0.0.1不等文件范围隔离。以上为源码边界，未启动浏览器或复现。

#### 证据与依据

**依据 1 · 源码核查**：[bin/verify.mjs:225-245](https://github.com/263311487-ux/dsh-verify/blob/d969899808e51dcccd261588f667b18633020fca/bin/verify.mjs#L225-L245)

基线不存在/更新直接pass。

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

**依据 2 · 源码核查**：[bin/verify.mjs:153-156](https://github.com/263311487-ux/dsh-verify/blob/d969899808e51dcccd261588f667b18633020fca/bin/verify.mjs#L153-L156)

步骤由spec给定，不自行证明覆盖。

```text
    for (const step of spec.steps || []) {
      const a = step.action;
      try {
        if (a === 'goto') { await page.goto(step.url || base + (step.path || '/index.html'), { waitUntil: 'load' }); pass(step, page.url()); }
```

**依据 3 · 源码核查**：[dsh/plugin.mjs:42-61](https://github.com/263311487-ux/dsh-verify/blob/d969899808e51dcccd261588f667b18633020fca/dsh/plugin.mjs#L42-L61)

同步进程、参数及静默catch。

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

**依据 4 · 源码核查**：[bin/verify.mjs:81-98](https://github.com/263311487-ux/dsh-verify/blob/d969899808e51dcccd261588f667b18633020fca/bin/verify.mjs#L81-L98)

本地静态server的路径检查与读取。

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

- 目标宿主对直接子进程权限、实际spec需求覆盖与基线审批未固定。
  **影响**：不能作为无人复核的交付放行或安全认证。
  **进一步探讨**：先固定构建/spec/基线并独立审读必要反例，确认只运行可信目录和目标，再判断结果范围。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖、三阶段成本与工程设计是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、工程质量与复用

#### 完整回答

需要Node>=20、Playwright及所选浏览器下载，MCP另需SDK，DSH工具依宿主dsh-tools动态导入。运行已有spec无需模型Key；gen或generate_and_verify才需要外部LLM及预算。固定视口和本地server便于构造反例，逐步结果与差异图可检查；tests/visual源码明确测试baseline create→page change FAIL→update PASS，这证明作者定义了生命周期，未证明基线内容正确，本轮也未执行。

首次成本包括安装包/浏览器、写或审读spec、创建经认可基线；持续成本是浏览器CPU/内存、截图存储、CI时间和可选模型生成费。失败恢复要区分断言失败、浏览器未装、server/网络及runner错误，不能把ERROR算产品FAIL；更新基线应先人工确认而不是为了绿灯覆盖。实际任务覆盖、维护spec与flaky率没有本轮数据，不量化节省或通过率。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-19](https://github.com/263311487-ux/dsh-verify/blob/d969899808e51dcccd261588f667b18633020fca/package.json#L1-L19)

独立CLI和MCP入口。

<details>
<summary>查看原文（19行）</summary>

```text
{
  "name": "dsh-verify",
  "version": "0.9.6",
  "description": "Witness — browser acceptance checks for agent-built web apps. CLI, MCP, AI-drafted checklists, visual regression, and multi-browser reports.",
  "keywords": [
    "deepseek",
    "agent",
    "ai-agent",
    "llm",
    "mcp",
    "mcp-server",
    "acceptance-testing",
    "e2e",
    "browser-automation",
    "playwright",
    "visual-regression",
    "verification",
    "dsh",
    "cordis"
```

</details>

**依据 2 · 源码核查**：[tests/visual.test.mjs:11-29](https://github.com/263311487-ux/dsh-verify/blob/d969899808e51dcccd261588f667b18633020fca/tests/visual.test.mjs#L11-L29)

视觉基线生命周期的测试预期。

<details>
<summary>查看原文（19行）</summary>

```text
test('visual regression: baseline create -> PASS -> page change FAIL -> update baseline PASS', async () => {
  const work = await mkdtemp(join(tmpdir(), 'dshv-vis-'));
  await cp(join(root, 'demo', 'fixed'), join(work, 'site'), { recursive: true });
  const specPath = join(work, 'spec.json');
  const spec = {
    title: 'visual regression test',
    serve: join(work, 'site'),
    steps: [
      { action: 'goto', path: '/index.html' },
      { action: 'expect_screenshot', name: 'home' },
      { action: 'expect_console_errors', present: false },
    ],
  };
  await writeFile(specPath, JSON.stringify(spec));
  const out = join(work, 'out');

  const first = await runOne(specPath, out, {});
  assert.equal(first.ok, true, JSON.stringify(first.failed));
  assert.ok(first.failed.every((f) => f.action !== 'expect_screenshot'));
```

</details>

**依据 3 · 源码核查**：[bin/gen.mjs:119-137](https://github.com/263311487-ux/dsh-verify/blob/d969899808e51dcccd261588f667b18633020fca/bin/gen.mjs#L119-L137)

可选生成才用外部Key/API。

<details>
<summary>查看原文（19行）</summary>

```text
export async function generateSpec({ url, requirements = '', pageFacts, model, apiKey, baseUrl, provider = 'deepseek', signal }) {
  const key = apiKey || process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY;
  if (!key) throw new Error('no LLM API key — set DEEPSEEK_API_KEY (or pass --api-key)');
  const base = baseUrl || (provider === 'openai' ? 'https://api.openai.com/v1' : 'https://api.deepseek.com');
  const mdl = model || (provider === 'openai' ? 'gpt-4o-mini' : 'deepseek-v4-flash');
  if (!pageFacts) throw new Error('pageFacts is required (browse the page first)');

  const res = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: mdl,
      messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: buildPrompt({ url, requirements, facts: pageFacts }) }],
      temperature: 0.2,
      response_format: { type: 'json_object' },
    }),
    signal,
  });
  if (!res.ok) throw new Error(`LLM API ${res.status}: ${(await res.text()).slice(0, 300)}`);
```

</details>

#### 缺口

- 缺少真实项目spec维护、波动失败和错误分类的成本对照。
  **影响**：无法判断比直接Playwright/人工验收更划算。
  **进一步探讨**：同构建同需求对照脚本与工具，记录正确发现、漏检、总运行及维护时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可推导何种更强记录，当前怎样采用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证方向是把构建commit、spec hash、基线hash与批准来源、浏览器/依赖版本、断言覆盖和runner状态绑定成单次可审读收据，将“基线创建”与“已比对PASS”分开。推导来自结果颜色强于记录实际范围，尤其首次基线pass和spec作者独立性。最小验证给审阅者相同页面的漏spec、空spec、新基线、真回归和runner错误，比较是否能正确界定可放行范围；若只是加hash而不能解释覆盖，否定其作为充分验收方案。

建议仅在可信本地应用、明确spec与基线的范围试用CLI或DSH工具，保留独立需求检查。成功标准是故意缺陷样例被正确断言捕获，合法实现通过，报告能查原动作和截图；未执行任何必要断言、新基线或运行错误不应当产品已验收。host长时间阻塞、范围不清或频繁为过测试改基线时停止自动放行。长期自动放行仍需独立spec与批准基线，且DSH同步执行会占住宿主线程，当前适合有限任务试用而非直接全局启用。

#### 证据与依据

**依据 1 · 源码核查**：[bin/verify.mjs:225-245](https://github.com/263311487-ux/dsh-verify/blob/d969899808e51dcccd261588f667b18633020fca/bin/verify.mjs#L225-L245)

基线create和compare需在收据区分。

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

**依据 2 · 源码核查**：[dsh/plugin.mjs:48-57](https://github.com/263311487-ux/dsh-verify/blob/d969899808e51dcccd261588f667b18633020fca/dsh/plugin.mjs#L48-L57)

status与截取报告不等完整验收依据。

<details>
<summary>查看原文（10行）</summary>

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
          };
```

</details>

**依据 3 · 作者声明**：[README.md:40-44](https://github.com/263311487-ux/dsh-verify/blob/d969899808e51dcccd261588f667b18633020fca/README.md#L40-L44)

作者已有有限覆盖原则。

```text
`init [directory]` only writes a local fixture and two JSON specs. It never calls an LLM, launches a browser, or downloads anything. The destination must be new (its parent must exist); existing directories, files, and symlinks are refused without changes. No force/overwrite option. GitHub package and browser installation require internet; these starter checks use localhost only. `gen` and MCP `generate_and_verify` are optional, separate features that require an LLM key.

To check your own app, edit the JSON steps; keep `serve` for static files or use `base` for an existing URL. `serve` paths resolve from the command's current directory, not the spec file. A PASS applies only to the supplied checks in that run; it does not establish complete coverage, security, accessibility, or independent authorship. The app and spec may come from the same agent; review the spec separately when independence matters. Reports retain assertion details and explicitly requested screenshots, not a complete audit trail.

![dsh-verify — Agents say done. The browser proves it.](assets/social-card.png)
```

#### 缺口

- 运行绑定收据和独立需求覆盖流程未验证。
  **影响**：新设计只作为假设，当前结果仍由人界定。
  **进一步探讨**：固定混合反例后盲评审阅者是否正确区分PASS范围、基线创建和ERROR。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
