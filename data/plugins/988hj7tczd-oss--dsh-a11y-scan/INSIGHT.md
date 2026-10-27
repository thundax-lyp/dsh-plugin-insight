# dsh-a11y-scan

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[8515929](https://github.com/988hj7tczd-oss/dsh-a11y-scan/tree/8515929d9e914cc0cadd60416676608ea1da03ae)

<!-- BEGIN META -->
[![npm 30d 83](https://img.shields.io/static/v1?label=npm+30d&message=83&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-a11y-scan) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-a11y-scan)
<!-- END META -->

> **实现功能**：在DSH中调用axe扫描本地HTML或确认URL，输出定位、修复线索、人工复核项和多格式报告。

> **核心亮点**：把目标发现、axe错误与命中、修复线索和人工复核接入结构化DSH工具，贡献在编排而非新检测算法。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **风险与缺陷**：静态服务只作词法目录检查再原生读文件，未核物理路径；浏览器加载本地HTML仍可有网络/脚本副作用，confirmUrl不是授权收据。详见[Q02](#research-q02)。

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
  - [Q01 · 业务场景和HTML到报告的主链是什么？](#detail-section-11)
  - [Q02 · 相对直接axe CLI贡献在哪，文件与网络边界是什么？](#detail-section-12)
  - [Q03 · 安装、引擎、输出与退出依赖什么？](#detail-section-13)
  - [Q04 · 三阶段成本和效果如何判断？](#detail-section-14)
  - [Q05 · 可复用工程和能力清单假设怎样检验？](#detail-section-15)
  - [Q06 · 当前建议、继续研究入口和停止条件是什么？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：前端开发者把可访问性自动检查接入工具流程，仍需人工确认真实任务与规则覆盖。

直接axe CLI加人工复核与报告可替代；DSH接线减少编排，但不减少真实浏览器和人工检查需求。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| HTML发现 | 文件/目录页面选择 | 50页/深度10，非动态全站爬取 |
| axe编排 | 浏览器规则命中 | 需另装引擎，不代表合规认证 |
| 报告 | 定位/建议/人工复核 | 页面片段有留存责任 |
| URL/输出 | 可选网络扫描/写报告 | 参数显式不等独立授权 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=22.18及DSH tools/fs/subprocess | 主链必需 | 工具注册、发现/读取和执行 | 当前package为registry版本，旧link说明需辨别 |
| 用户安装axe CLI及Chrome/Puppeteer | 实际扫描必需 | 加载页面与规则引擎 | 不自动安装，缺失报prerequisite |
| 可加载HTML/构建产物 | 本地目标必需 | 静态服务页面 | 纯源码目录可能无HTML，扫描不到不等无问题 |
| URL确认参数与网络策略 | 远程目标必需 | 允许指定目标进入浏览器 | 参数不验证真实人类授权，也不限制子资源 |
| 可写reportFile目标 | 保存报告时可选 | 输出md/html/json | 默认不写，显式参数可能覆盖文件 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者固定引擎/浏览器和DSH，选可信无敏感HTML | 明确JS/网络与静态服务目录范围 |
| 加载 | 安装并挂载工具，单独准备axe CLI | 缺引擎不自动下载安装 |
| 扫描 | 选择页面、tags和可选报告输出 | 区分错误、incomplete、命中与未覆盖 |
| 退出 | 确认子进程和临时服务结束，治理报告 | 报告可能含页面HTML片段/路径 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | axe/浏览器下载与构建环境，金额未知 | 版本、目标、网络/文件权限核对 | 模拟fixture不代表真实引擎可用 |
| 持续使用 | 逐页浏览器启动/扫描、HTML资源请求 | 排除误报、补人工复核与修复 | 最多50页/深度10，时长未测 |
| 失败恢复 | 引擎/浏览器安装排错、重扫和报告重建 | 判断部分页面未完成与错误 | 错误不能被0违规掩盖 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 自动定位 | axe命中映射为impact/selector/修复建议 | 固定真实引擎命中质量与覆盖 |
| 人工衔接 | incomplete和固定复核清单单列 | 实际键盘/读屏任务是否合格 |
| 可重复输出 | 同一report生成md/html/json | 不同页面状态和规则版本的可比性 |

> **思考**：静态服务只作词法目录检查再原生读文件，未核物理路径；浏览器加载本地HTML仍可有网络/脚本副作用，confirmUrl不是授权收据。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把目标发现、axe错误与命中、修复线索和人工复核接入结构化DSH工具，贡献在编排而非新检测算法。详见[Q01](#research-q01)与[Q02](#research-q02)。

把目标发现、axe错误与命中、修复线索和人工复核接入结构化DSH工具，贡献在编排而非新检测算法。详见[Q01](#research-q01)与[Q02](#research-q02)。

可复用的是FsAdapter/AxeEngine可注入seam、目标计划和报告纯函数分离、错误作为报告结构、URL闸门在引擎前以及finally关本地服务。HTML报告把嵌入JSON的<转义，防止元素HTML中的script结束标签破坏嵌入。模拟engine适合确定性编排测试，但不能代替真实浏览器规则验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

静态服务只作词法目录检查再原生读文件，未核物理路径；浏览器加载本地HTML仍可有网络/脚本副作用，confirmUrl不是授权收据。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

可信无敏感页面可限范围试用作自动线索，先核实际网络/文件与规则覆盖，保留人工复核。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持HTML发现、axe扫描与结构报告集成；静态服务词法路径和资源范围未形成完整隔离，自动规则通过不证明全部无障碍。绑定文件/引擎/规则与网络源的扫描能力清单尚未验证。

- 已检查：作者 README、包清单、源码路径 src/index.ts、src/runner.ts、README.md、src/report.ts、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定工具、runner目标/CLI/静态服务/报告写及report人工清单和HTML嵌入；未执行引擎、页面或宿主，不认证WCAG全覆盖。
- 下一步：进一步探讨可用链接/外链/重定向夹具和固定缺陷页面集核对资源边界、规则覆盖、命中与完整人时。

**分析版本**

- **仓库**：[988hj7tczd-oss/dsh-a11y-scan](https://github.com/988hj7tczd-oss/dsh-a11y-scan)
- **版本号**：0.1.0（[固定提交 8515929](https://github.com/988hj7tczd-oss/dsh-a11y-scan/tree/8515929d9e914cc0cadd60416676608ea1da03ae)）
- **版本日期**：2026-08-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨扫描能力清单，绑定资源realpath、引擎/规则和网络源，静态服务只暴露计划文件；动态资源兼容成本未验证。详见[Q05](#research-q05)。

进一步探讨可用链接/外链/重定向夹具和固定缺陷页面集核对资源边界、规则覆盖、命中与完整人时。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 237 | — | — | 2851 |
| .ts | source | 4 | 1910 | 1538 | 251 | — |
| .ts | test | 2 | 467 | 369 | 48 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/988hj7tczd-oss/dsh-a11y-scan/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/988hj7tczd-oss/dsh-a11y-scan/issues?q=is%3Aissue+created%3A2026-09-22T05%3A39%3A56.584Z..2026-10-22T05%3A39%3A56.584Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/988hj7tczd-oss/dsh-a11y-scan/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A39%3A56.584Z..2026-10-22T05%3A39%3A56.584Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查axe扫描编排、文件/网络边界与自动报告采用成本。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 业务场景和HTML到报告的主链是什么？

**研究主题**：场景与需求、功能与机制

#### 完整回答

面向在DSH工作流核查前端HTML/构建产物的开发者，输入为本地文件/目录或明确选择的URL，输出axe命中、无法判断项和人工复核清单及可选报告。合格交付需目标、引擎/规则/页面覆盖明确，并把错误和未完成与0命中分开；报告不是全站可访问性或合规证书。

工具注入tools/fs/subprocess，经FsAdapter发现最多50页/深度10，本地页启动127.0.0.1静态服务，逐页用npx --no-install axe CLI扫描并解析JSON。report纯函数标准化/排序、附常见建议，再渲染md/html/json。URL不带confirmUrl会在引擎前形成错误，reportFile才通过fs写入报告。实际规则tags按level和wcag21选择一个家族加best-practice，不应凭产品名推断全部规则均覆盖。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:23-30](https://github.com/988hj7tczd-oss/dsh-a11y-scan/blob/8515929d9e914cc0cadd60416676608ea1da03ae/src/index.ts#L23-L30)

工具注册与注入。

```text
/**
 * Hard dependencies: `tools` (registration), `fs` (target resolution + reads
 * + the opt-in `reportFile` write), `subprocess` (the axe-CLI scan backend).
 */
export const inject = ['tools', 'fs', 'subprocess']

export function apply(ctx: Context): void {
  ctx.tools.register(defineA11yScanTool(ctx))
```

**依据 2 · 源码核查**：[src/runner.ts:101-133](https://github.com/988hj7tczd-oss/dsh-a11y-scan/blob/8515929d9e914cc0cadd60416676608ea1da03ae/src/runner.ts#L101-L133)

实际tags与扫描上限。

<details>
<summary>查看原文（33行）</summary>

```text
const LEVEL_TAG_SUFFIXES: Readonly<Record<ScanLevel, string[]>> = {
  A: ['a'],
  AA: ['a', 'aa'],
  AAA: ['a', 'aa', 'aaa'],
}

/**
 * The axe `runOnly.tags` set for a scan configuration. `wcag21: true` picks
 * the WCAG 2.1 tag family (`wcag21a/aa/aaa`), `false` the classic `wcag2a/
 * aa/aaa` family; `best-practice` is always included. Exported so tests can
 * assert that `level`/`wcag21` switches change the rule set (acceptance 3).
 */
export function runOnlyTags(level: ScanLevel, wcag21: boolean): string[] {
  const base = wcag21 ? 'wcag21' : 'wcag2'
  const tags = LEVEL_TAG_SUFFIXES[level].map((suffix) => `${base}${suffix}`)
  tags.push('best-practice')
  return tags
}

const URL_PATTERN = /^https?:\/\//i
const HTML_EXT = /\.(html?)$/i

export function isHttpUrl(path: string): boolean {
  return URL_PATTERN.test(path)
}

const SKIP_DIRECTORIES = new Set([
  'node_modules', '.git', '.hg', '.svn', '.idea', '.vscode',
  '__pycache__', '.venv', 'venv', '.cache', '.turbo', '.next/cache',
])

export const MAX_PAGES = 50
const MAX_DEPTH = 10
```

</details>

**依据 3 · 源码核查**：[src/runner.ts:419-438](https://github.com/988hj7tczd-oss/dsh-a11y-scan/blob/8515929d9e914cc0cadd60416676608ea1da03ae/src/runner.ts#L419-L438)

逐页引擎和finally关服务。

<details>
<summary>查看原文（20行）</summary>

```text
export function createAxeCliEngine(ctx: Context): AxeEngine {
  const subprocess = ctx.subprocess
  return {
    async run(request) {
      const server = request.rootDir !== null && request.pages.some((page) => !isHttpUrl(page.resource))
        ? await startStaticServer(request.rootDir)
        : null
      const cwd = request.rootDir ?? process.cwd()
      try {
        const pageResults: AxePageResult[] = []
        for (const page of request.pages) {
          if (request.signal?.aborted === true) break
          const url = isHttpUrl(page.resource)
            ? page.resource
            : (server as StaticServer).urlFor(page.resource)
          pageResults.push(await runSinglePage(subprocess, { label: page.label, url }, request.tags, cwd, request.signal))
        }
        return { engine: 'axe-cli', pages: pageResults }
      } finally {
        if (server !== null) await server.close()
```

</details>

**依据 4 · 源码核查**：[src/runner.ts:451-460](https://github.com/988hj7tczd-oss/dsh-a11y-scan/blob/8515929d9e914cc0cadd60416676608ea1da03ae/src/runner.ts#L451-L460)

实际CLI参数。

<details>
<summary>查看原文（10行）</summary>

```text
  const spec: SubprocessSpawnSpec = {
    argv: ['npx', '--no-install', '@axe-core/cli', page.url, '--format', 'json', '--tags', tags.join(',')],
    cwd,
    stdio: {
      stdin: 'ignore',
      stdout: { maxBytes: AXE_CLI_OUTPUT_CAP, spill: { maxBytes: AXE_CLI_SPILL_CAP } },
      stderr: { maxBytes: 2 * 1024 * 1024 },
    },
    graceMs: AXE_CLI_GRACE_MS,
    signal,
```

</details>

**依据 5 · 源码核查**：[src/runner.ts:561-573](https://github.com/988hj7tczd-oss/dsh-a11y-scan/blob/8515929d9e914cc0cadd60416676608ea1da03ae/src/runner.ts#L561-L573)

URL参数闸门。

<details>
<summary>查看原文（13行）</summary>

```text
  if (isHttpUrl(target)) {
    kind = 'url'
    if (args.confirmUrl !== true) {
      errors.push({
        kind: 'url-confirmation-required',
        message:
          'URL 扫描需要用户显式确认：请先确认目标 URL 的可信度与网络访问策略，'
          + '再以 confirmUrl: true 重试。本地文件优先，避免对不可信站点发起浏览器扫描。',
        retryable: true,
      })
    } else {
      pagesToScan.push({ label: target, resource: target })
    }
```

</details>

**依据 6 · 源码核查**：[src/runner.ts:617-638](https://github.com/988hj7tczd-oss/dsh-a11y-scan/blob/8515929d9e914cc0cadd60416676608ea1da03ae/src/runner.ts#L617-L638)

报告装配和显式输出。

<details>
<summary>查看原文（22行）</summary>

```text
  const report = buildReport({
    meta: { target, kind, level, wcag21, tags, engine: engineName !== '' ? engineName : 'not-run', timestamp },
    pages,
    errors,
  })
  let rendered = renderReport(report, out)

  // Opt-in report write; the default remains strictly read-only.
  let reportPath: string | null = null
  if (args.reportFile !== undefined && args.reportFile !== '') {
    try {
      const target = await fs.resolve(args.reportFile)
      await fs.writeText(target, rendered)
      reportPath = target.displayPath
    } catch (err) {
      report.errors.push({
        kind: 'fs',
        message: `写入报告文件失败（${args.reportFile}）: ${String(err)}`,
        retryable: true,
      })
      rendered = renderReport(report, out)
    }
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 相对直接axe CLI贡献在哪，文件与网络边界是什么？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

贡献是把目标发现、引擎前置错误、规则结果定位/建议、人工复核和多格式报告接入DSH结构化工具，降低脚本接线负担。规则检测来自axe，修复建议是规则级常见方法，不是自动修复正确性证据。人工清单清楚提醒自动扫描的限制，不能把固定清单当实际人工验证。

重要边界是只读描述只说明默认不改目标代码，不等页面没有副作用。真实浏览器加载HTML/JS和资源，当前CLI参数没有显示网络拦截；本地HTML也可能引用远程脚本/图片。URL的confirmUrl是调用者布尔参数，不能证明人类确实批准，也没有绑定跳转/子资源范围。

临时静态服务做normalize和字符串目录边界后直接node fsReadFile，未realpath核对符号链接，也绕开FsAdapter作为读取路径。目录内链接可能被本地服务读取到边界外文件，具体可达需页面/宿主环境；不是已复现外泄。服务暴露整个目标目录下可请求资源，而不只已选HTML。报告含页面元素HTML/路径亦需留存治理。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-17](https://github.com/988hj7tczd-oss/dsh-a11y-scan/blob/8515929d9e914cc0cadd60416676608ea1da03ae/README.md#L13-L17)

作者只读与人工复核定位。

```text

- **只读扫描**：绝不自动修改代码或文件；写报告文件需显式 `reportFile` 参数。
- **可编程独立工具**：调用即得结构化结果，可进 CI / Workflow / Agent 循环。
- **自动化 + 人工复核并存**：axe 扫不到或无法判定的项（焦点顺序语义、键盘操作、朗读顺序等）输出为「需人工复核清单」与 `incomplete` 项。

```

**依据 2 · 源码核查**：[src/report.ts:482-507](https://github.com/988hj7tczd-oss/dsh-a11y-scan/blob/8515929d9e914cc0cadd60416676608ea1da03ae/src/report.ts#L482-L507)

固定人工复核条目。

<details>
<summary>查看原文（26行）</summary>

```text
export const MANUAL_REVIEW_CHECKLIST: ManualReviewItem[] = [
  {
    id: 'focus-order',
    title: '焦点顺序是否与视觉顺序一致',
    sc: '2.4.3',
    detail: '用 Tab 走查：遮挡层、弹窗、动态插入内容后的焦点落点与恢复逻辑需人工确认，自动化只能测到 Tab 可达性。',
  },
  {
    id: 'keyboard-trap',
    title: '无键盘焦点陷阱',
    sc: '2.1.2',
    detail: 'Tab 应能离开所有组件；模态/抽屉开启时焦点应被正确圈定并在关闭后归还。',
  },
  {
    id: 'reading-order',
    title: '屏幕阅读器朗读顺序与标题层级语义',
    sc: '1.3.2 / 2.4.6',
    detail: '用 NVDA / VoiceOver 试听：DOM 顺序 ≠ 视觉顺序时确认朗读顺序可理解；h1–h6 层级表达真实内容结构。',
  },
  {
    id: 'alt-quality',
    title: '非文本内容的替代文本质量',
    sc: '1.1.1',
    detail: '自动化只验证 alt 存在；是否准确等价于图片传达的信息需人工判断（数据图、图表、截图类尤其重要）。',
  },
  {
```

</details>

**依据 3 · 源码核查**：[src/runner.ts:344-366](https://github.com/988hj7tczd-oss/dsh-a11y-scan/blob/8515929d9e914cc0cadd60416676608ea1da03ae/src/runner.ts#L344-L366)

词法路径检查后serveFile。

<details>
<summary>查看原文（23行）</summary>

```text
export async function startStaticServer(rootDir: string): Promise<StaticServer> {
  const server: Server = createServer((req: IncomingMessage, res: ServerResponse) => {
    const requestUrl = req.url ?? '/'
    // Malformed percent-encoding (e.g. `/%zz`) makes decodeURIComponent throw;
    // never let a request crash the scan server (or the host process).
    let pathname: string
    try {
      pathname = decodeURIComponent(requestUrl.split('?')[0] ?? '/')
    } catch {
      res.writeHead(400, { 'Content-Type': 'text/plain' })
      res.end('bad request')
      return
    }
    // `normalize` keeps a trailing separator; strip it so confinement checks
    // and `root + sep` joins are exact.
    const root = normalize(rootDir).replace(/[/\\]+$/, '')
    const safe = normalize(join(root, pathname))
    if (safe === root || !safe.startsWith(`${root}${sep}`)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('not found')
      return
    }
    void serveFile(safe, res)
```

</details>

**依据 4 · 源码核查**：[src/runner.ts:388-393](https://github.com/988hj7tczd-oss/dsh-a11y-scan/blob/8515929d9e914cc0cadd60416676608ea1da03ae/src/runner.ts#L388-L393)

原生fsReadFile实际读取。

```text
function serveFile(absPath: string, res: ServerResponse): void {
  void fsReadFile(absPath)
    .then((content) => {
      const ext = (pathBasename(absPath).match(/\.[a-z0-9]+$/i)?.[0] ?? '').toLowerCase()
      res.writeHead(200, { 'Content-Type': MIME[ext] ?? 'application/octet-stream' })
      res.end(content)
```

**依据 5 · 源码核查**：[src/runner.ts:451-460](https://github.com/988hj7tczd-oss/dsh-a11y-scan/blob/8515929d9e914cc0cadd60416676608ea1da03ae/src/runner.ts#L451-L460)

无所示网络限制的axe执行参数。

<details>
<summary>查看原文（10行）</summary>

```text
  const spec: SubprocessSpawnSpec = {
    argv: ['npx', '--no-install', '@axe-core/cli', page.url, '--format', 'json', '--tags', tags.join(',')],
    cwd,
    stdio: {
      stdin: 'ignore',
      stdout: { maxBytes: AXE_CLI_OUTPUT_CAP, spill: { maxBytes: AXE_CLI_SPILL_CAP } },
      stderr: { maxBytes: 2 * 1024 * 1024 },
    },
    graceMs: AXE_CLI_GRACE_MS,
    signal,
```

</details>

**依据 6 · 源码核查**：[src/runner.ts:561-573](https://github.com/988hj7tczd-oss/dsh-a11y-scan/blob/8515929d9e914cc0cadd60416676608ea1da03ae/src/runner.ts#L561-L573)

URL接受依赖布尔参数。

<details>
<summary>查看原文（13行）</summary>

```text
  if (isHttpUrl(target)) {
    kind = 'url'
    if (args.confirmUrl !== true) {
      errors.push({
        kind: 'url-confirmation-required',
        message:
          'URL 扫描需要用户显式确认：请先确认目标 URL 的可信度与网络访问策略，'
          + '再以 confirmUrl: true 重试。本地文件优先，避免对不可信站点发起浏览器扫描。',
        retryable: true,
      })
    } else {
      pagesToScan.push({ label: target, resource: target })
    }
```

</details>

#### 缺口

- 实际浏览器网络、重定向、页面脚本和符号链接资源的可达性未复现。
  **影响**：不能将本地只读扫描称为零网络或物理目录隔离。
  **进一步探讨**：可先用假资源/无敏感目录夹具检查外部请求和链接解析，再按明确授权研究受限浏览器策略。
- 固定axe版本下tags对应的规则全集与WCAG覆盖没有独立验证。
  **影响**：不能把选择wcag21家族等同全部相关要求被检查。
  **进一步探讨**：可固定axe规则元数据，对照实际tags和未选规则列表，说明漏检边界再评估报告。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 安装、引擎、输出与退出依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

当前package声明registry版DSH内部依赖及Node>=22.18，README顶部仍强调相邻dsh-src/link开发布局，二者应区分，不把旧说明当当前包必然无法装。axe CLI/Chrome不随包提供，需用户预装且目标cwd能解析；工具不自动安装。FsAdapter负责报告输出，但静态服务另用原生fs，不能用适配器权限替它承诺所有读取受控。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=22.18及DSH tools/fs/subprocess | 主链必需 | 工具注册、发现/读取和执行 | 当前package为registry版本，旧link说明需辨别 |
| 用户安装axe CLI及Chrome/Puppeteer | 实际扫描必需 | 加载页面与规则引擎 | 不自动安装，缺失报prerequisite |
| 可加载HTML/构建产物 | 本地目标必需 | 静态服务页面 | 纯源码目录可能无HTML，扫描不到不等无问题 |
| URL确认参数与网络策略 | 远程目标必需 | 允许指定目标进入浏览器 | 参数不验证真实人类授权，也不限制子资源 |
| 可写reportFile目标 | 保存报告时可选 | 输出md/html/json | 默认不写，显式参数可能覆盖文件 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者固定引擎/浏览器和DSH，选可信无敏感HTML | 明确JS/网络与静态服务目录范围 |
| 加载 | 安装并挂载工具，单独准备axe CLI | 缺引擎不自动下载安装 |
| 扫描 | 选择页面、tags和可选报告输出 | 区分错误、incomplete、命中与未覆盖 |
| 退出 | 确认子进程和临时服务结束，治理报告 | 报告可能含页面HTML片段/路径 |


#### 证据与依据

**依据 1 · 源码核查**：[package.json:64-68](https://github.com/988hj7tczd-oss/dsh-a11y-scan/blob/8515929d9e914cc0cadd60416676608ea1da03ae/package.json#L64-L68)

当前DSH registry依赖。

```text
  "dependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-fs": "0.1.1-rc.2",
    "@deepseek-ai/dsh-subprocess": "0.1.1-rc.2",
    "@deepseek-ai/dsh-tools": "0.1.1-rc.2"
```

**依据 2 · 源码核查**：[package.json:84-86](https://github.com/988hj7tczd-oss/dsh-a11y-scan/blob/8515929d9e914cc0cadd60416676608ea1da03ae/package.json#L84-L86)

Node引擎。

```text
  "engines": {
    "node": ">=22.18.0"
  }
```

**依据 3 · 作者声明**：[README.md:3-9](https://github.com/988hj7tczd-oss/dsh-a11y-scan/blob/8515929d9e914cc0cadd60416676608ea1da03ae/README.md#L3-L9)

旧开发link前置说明。

```text
> [!IMPORTANT]
> **依赖前置：相邻 `dsh-src` 检出（`link:` 依赖）**
> 本项目在开发形态下使用 `link:` 依赖指向相邻的 DeepSeek Harness 源码检出（`dsh-src`），
> 与当前仓库保持同一父目录布局（`<parent>/dsh-src`）。克隆本仓库后：
> 1. 先把官方 `deepseek-ai/deepseek-harness` 检出到与本仓库同级的 `dsh-src/` 目录，并执行其 `pnpm install && pnpm run build`；
> 2. 再按下方「安装」一节执行本仓库的 `pnpm install --offline && pnpm build` 与测试。
> 发布到 npm 的版本会尽量把 `link:` 依赖替换为 registry 真实版本；无法替换的内部包保持 `link:`，见各包 README 说明。
```

**依据 4 · 源码核查**：[src/runner.ts:415-426](https://github.com/988hj7tczd-oss/dsh-a11y-scan/blob/8515929d9e914cc0cadd60416676608ea1da03ae/src/runner.ts#L415-L426)

引擎预装与cwd。

<details>
<summary>查看原文（12行）</summary>

```text
 * Prerequisite (documented in README): `@axe-core/cli` resolves from the
 * target directory (`npm i -D @axe-core/cli`, which pulls puppeteer/Chrome).
 * The tool never installs it automatically — a clear error tells the user how.
 */
export function createAxeCliEngine(ctx: Context): AxeEngine {
  const subprocess = ctx.subprocess
  return {
    async run(request) {
      const server = request.rootDir !== null && request.pages.some((page) => !isHttpUrl(page.resource))
        ? await startStaticServer(request.rootDir)
        : null
      const cwd = request.rootDir ?? process.cwd()
```

</details>

**依据 5 · 源码核查**：[src/runner.ts:280-307](https://github.com/988hj7tczd-oss/dsh-a11y-scan/blob/8515929d9e914cc0cadd60416676608ea1da03ae/src/runner.ts#L280-L307)

FsAdapter与报告写。

<details>
<summary>查看原文（28行）</summary>

```text
  }
  return {
    async resolve(path) {
      const target = await ctx.fs.resolve(path)
      return { handle: { target } satisfies CtxFsHandle, displayPath: target.displayPath }
    },
    async stat(target) {
      const info = await ctx.fs.stat(toTarget(target))
      if (info === undefined) return undefined
      return { type: info.type, size: info.size }
    },
    async listDir(target) {
      const entries = await ctx.fs.listDir(toTarget(target))
      return entries.map((entry) => ({
        name: entry.name,
        type: entry.type,
        target: {
          handle: { target: entry.target } satisfies CtxFsHandle,
          displayPath: entry.target.displayPath,
        },
      }))
    },
    async readText(target) {
      return ctx.fs.readText(toTarget(target))
    },
    async writeText(target, content) {
      await ctx.fs.writeText(toTarget(target), content)
    },
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 三阶段成本和效果如何判断？

**研究主题**：效果与总成本

#### 完整回答

共同任务应是同页面状态检出并人工确认/修复真实缺陷，而不是输出报告文件。扫描要浏览器、静态资源及逐页执行，最多50页与深度10是覆盖边界，不代表50页耗时固定；未发现HTML、引擎缺失或某页失败不能被解读为无障碍通过。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | axe/浏览器下载与构建环境，金额未知 | 版本、目标、网络/文件权限核对 | 模拟fixture不代表真实引擎可用 |
| 持续使用 | 逐页浏览器启动/扫描、HTML资源请求 | 排除误报、补人工复核与修复 | 最多50页/深度10，时长未测 |
| 失败恢复 | 引擎/浏览器安装排错、重扫和报告重建 | 判断部分页面未完成与错误 | 错误不能被0违规掩盖 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 自动定位 | axe命中映射为impact/selector/修复建议 | 固定真实引擎命中质量与覆盖 |
| 人工衔接 | incomplete和固定复核清单单列 | 实际键盘/读屏任务是否合格 |
| 可重复输出 | 同一report生成md/html/json | 不同页面状态和规则版本的可比性 |

与直接axe CLI加人工报告对照时，需计引擎部署、误报/漏检分析、键盘/读屏复核与重扫，不能按规则命中数推断生产率。

#### 证据与依据

**依据 1 · 源码核查**：[src/runner.ts:132-133](https://github.com/988hj7tczd-oss/dsh-a11y-scan/blob/8515929d9e914cc0cadd60416676608ea1da03ae/src/runner.ts#L132-L133)

页数和深度上限。

```text
export const MAX_PAGES = 50
const MAX_DEPTH = 10
```

**依据 2 · 源码核查**：[src/runner.ts:199-205](https://github.com/988hj7tczd-oss/dsh-a11y-scan/blob/8515929d9e914cc0cadd60416676608ea1da03ae/src/runner.ts#L199-L205)

无HTML明确错误。

```text
  const files = await collectHtmlFiles(fs, root, 0)
  if (files.length === 0) {
    throw new TargetError(
      'no-html',
      `在 ${root.displayPath} 未发现 HTML 文件（已扫描子目录，含 dist/out/build 构建产物）。`
      + '如为纯 JS 前端项目，请先构建产生 HTML，或把 path 指向 vite/next 的构建输出目录。',
      false,
```

**依据 3 · 源码核查**：[src/runner.ts:428-438](https://github.com/988hj7tczd-oss/dsh-a11y-scan/blob/8515929d9e914cc0cadd60416676608ea1da03ae/src/runner.ts#L428-L438)

逐页执行及清理。

<details>
<summary>查看原文（11行）</summary>

```text
        const pageResults: AxePageResult[] = []
        for (const page of request.pages) {
          if (request.signal?.aborted === true) break
          const url = isHttpUrl(page.resource)
            ? page.resource
            : (server as StaticServer).urlFor(page.resource)
          pageResults.push(await runSinglePage(subprocess, { label: page.label, url }, request.tags, cwd, request.signal))
        }
        return { engine: 'axe-cli', pages: pageResults }
      } finally {
        if (server !== null) await server.close()
```

</details>

**依据 4 · 源码核查**：[src/report.ts:482-507](https://github.com/988hj7tczd-oss/dsh-a11y-scan/blob/8515929d9e914cc0cadd60416676608ea1da03ae/src/report.ts#L482-L507)

人工复核保留。

<details>
<summary>查看原文（26行）</summary>

```text
export const MANUAL_REVIEW_CHECKLIST: ManualReviewItem[] = [
  {
    id: 'focus-order',
    title: '焦点顺序是否与视觉顺序一致',
    sc: '2.4.3',
    detail: '用 Tab 走查：遮挡层、弹窗、动态插入内容后的焦点落点与恢复逻辑需人工确认，自动化只能测到 Tab 可达性。',
  },
  {
    id: 'keyboard-trap',
    title: '无键盘焦点陷阱',
    sc: '2.1.2',
    detail: 'Tab 应能离开所有组件；模态/抽屉开启时焦点应被正确圈定并在关闭后归还。',
  },
  {
    id: 'reading-order',
    title: '屏幕阅读器朗读顺序与标题层级语义',
    sc: '1.3.2 / 2.4.6',
    detail: '用 NVDA / VoiceOver 试听：DOM 顺序 ≠ 视觉顺序时确认朗读顺序可理解；h1–h6 层级表达真实内容结构。',
  },
  {
    id: 'alt-quality',
    title: '非文本内容的替代文本质量',
    sc: '1.1.1',
    detail: '自动化只验证 alt 存在；是否准确等价于图片传达的信息需人工判断（数据图、图表、截图类尤其重要）。',
  },
  {
```

</details>

#### 缺口

- 没有同真实引擎/页面集的命中质量、时延、资源与人工修复对照。
  **影响**：不能承诺合规、准确率或净节省。
  **进一步探讨**：可先固定页面、规则版本及已知缺陷，对照CLI和人工复核记录漏检、误报、耗时与最终修复质量。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可复用工程和能力清单假设怎样检验？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

可复用的是FsAdapter/AxeEngine可注入seam、目标计划和报告纯函数分离、错误作为报告结构、URL闸门在引擎前以及finally关本地服务。HTML报告把嵌入JSON的<转义，防止元素HTML中的script结束标签破坏嵌入。模拟engine适合确定性编排测试，但不能代替真实浏览器规则验证。

由Q02可探讨未验证的“扫描能力清单”。执行前绑定选定HTML及资源realpath、规则/引擎版本、允许网络源和报告路径，静态服务只暴露计划文件，浏览器默认拦外部网络，新增资源或重定向需明确范围。相对当前目录级服务和confirmUrl布尔，它使扫描实际读取/访问可审阅。代价是动态前端资源发现、网络依赖与规则兼容。可用链接逃逸、HTML外链、重定向和缺资源夹具比较越界读取/网络与命中损失；若限制导致隐蔽漏扫或仍访问未列资源，应修正/否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/runner.ts:65-92](https://github.com/988hj7tczd-oss/dsh-a11y-scan/blob/8515929d9e914cc0cadd60416676608ea1da03ae/src/runner.ts#L65-L92)

可注入engine/fs界面。

<details>
<summary>查看原文（28行）</summary>

```text
export interface AxeEngine {
  run(request: AxeRunRequest): Promise<AxeRunResult>
}

/** Minimal filesystem surface the scanner needs (subset of `ctx.fs`). */
export interface FsAdapterTarget {
  /** Opaque backend identity. Real adapter stores the backend FsTarget. */
  handle: unknown
  /** Model/UI-facing path. */
  displayPath: string
}

export interface FsAdapterDirEntry {
  name: string
  type: 'file' | 'directory' | 'other'
  target: FsAdapterTarget
}

export interface FsAdapter {
  resolve(path: string): Promise<FsAdapterTarget>
  stat(target: FsAdapterTarget): Promise<{ type: 'file' | 'directory' | 'other'; size?: number } | undefined>
  listDir(target: FsAdapterTarget): Promise<FsAdapterDirEntry[]>
  readText(target: FsAdapterTarget): Promise<string>
  /**
   * Only used for the opt-in `reportFile` write; must be idempotent for the
   * report content (the scanner's default is strictly read-only).
   */
  writeText(target: FsAdapterTarget, content: string): Promise<void>
```

</details>

**依据 2 · 源码核查**：[src/runner.ts:419-438](https://github.com/988hj7tczd-oss/dsh-a11y-scan/blob/8515929d9e914cc0cadd60416676608ea1da03ae/src/runner.ts#L419-L438)

finally关闭服务。

<details>
<summary>查看原文（20行）</summary>

```text
export function createAxeCliEngine(ctx: Context): AxeEngine {
  const subprocess = ctx.subprocess
  return {
    async run(request) {
      const server = request.rootDir !== null && request.pages.some((page) => !isHttpUrl(page.resource))
        ? await startStaticServer(request.rootDir)
        : null
      const cwd = request.rootDir ?? process.cwd()
      try {
        const pageResults: AxePageResult[] = []
        for (const page of request.pages) {
          if (request.signal?.aborted === true) break
          const url = isHttpUrl(page.resource)
            ? page.resource
            : (server as StaticServer).urlFor(page.resource)
          pageResults.push(await runSinglePage(subprocess, { label: page.label, url }, request.tags, cwd, request.signal))
        }
        return { engine: 'axe-cli', pages: pageResults }
      } finally {
        if (server !== null) await server.close()
```

</details>

**依据 3 · 源码核查**：[src/report.ts:682-690](https://github.com/988hj7tczd-oss/dsh-a11y-scan/blob/8515929d9e914cc0cadd60416676608ea1da03ae/src/report.ts#L682-L690)

HTML JSON嵌入转义。

```text
export function renderHtml(report: A11yReport, template: string = defaultTemplateHtml): string {
  const json = JSON.stringify(buildHtmlProjection(report))
    // Never let `</script>` inside element HTML break the embed.
    .replace(/</g, '\\u003c')
  if (!template.includes(TEMPLATE_DATA_MARKER)) {
    throw new Error('report template is missing the data marker __A11Y_DATA_JSON__')
  }
  return template.replace(TEMPLATE_DATA_MARKER, json)
}
```

**依据 4 · 源码核查**：[src/runner.ts:344-366](https://github.com/988hj7tczd-oss/dsh-a11y-scan/blob/8515929d9e914cc0cadd60416676608ea1da03ae/src/runner.ts#L344-L366)

能力计划假设针对静态服务。

<details>
<summary>查看原文（23行）</summary>

```text
export async function startStaticServer(rootDir: string): Promise<StaticServer> {
  const server: Server = createServer((req: IncomingMessage, res: ServerResponse) => {
    const requestUrl = req.url ?? '/'
    // Malformed percent-encoding (e.g. `/%zz`) makes decodeURIComponent throw;
    // never let a request crash the scan server (or the host process).
    let pathname: string
    try {
      pathname = decodeURIComponent(requestUrl.split('?')[0] ?? '/')
    } catch {
      res.writeHead(400, { 'Content-Type': 'text/plain' })
      res.end('bad request')
      return
    }
    // `normalize` keeps a trailing separator; strip it so confinement checks
    // and `root + sep` joins are exact.
    const root = normalize(rootDir).replace(/[/\\]+$/, '')
    const safe = normalize(join(root, pathname))
    if (safe === root || !safe.startsWith(`${root}${sep}`)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('not found')
      return
    }
    void serveFile(safe, res)
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 当前建议、继续研究入口和停止条件是什么？

**研究主题**：采用判断

#### 完整回答

推荐trial，限可信无敏感HTML、明确网络边界且已固定axe/浏览器的开发者，作为自动检查线索。默认不修改代码和不自动安装引擎有实用价值，但本地HTML不是天然无网络，报告也不代表真实用户任务可访问。先保留人工复核，不把产品文字作为合规保证。

继续探讨可先用无敏感夹具核对静态服务物理路径和浏览器请求，再固定实际tags覆盖与真实引擎输出。发现计划外资源/网络访问、引擎未运行却被当通过、报告输出路径不明或页面超过上限仍称全站完成，应停止并修正范围。Q02/Q04的隔离/覆盖与完整任务结果影响扩大采用，本轮未执行扫描。

#### 证据与依据

**依据 1 · 源码核查**：[src/runner.ts:344-393](https://github.com/988hj7tczd-oss/dsh-a11y-scan/blob/8515929d9e914cc0cadd60416676608ea1da03ae/src/runner.ts#L344-L393)

本地服务物理路径边界。

<details>
<summary>查看原文（50行）</summary>

```text
export async function startStaticServer(rootDir: string): Promise<StaticServer> {
  const server: Server = createServer((req: IncomingMessage, res: ServerResponse) => {
    const requestUrl = req.url ?? '/'
    // Malformed percent-encoding (e.g. `/%zz`) makes decodeURIComponent throw;
    // never let a request crash the scan server (or the host process).
    let pathname: string
    try {
      pathname = decodeURIComponent(requestUrl.split('?')[0] ?? '/')
    } catch {
      res.writeHead(400, { 'Content-Type': 'text/plain' })
      res.end('bad request')
      return
    }
    // `normalize` keeps a trailing separator; strip it so confinement checks
    // and `root + sep` joins are exact.
    const root = normalize(rootDir).replace(/[/\\]+$/, '')
    const safe = normalize(join(root, pathname))
    if (safe === root || !safe.startsWith(`${root}${sep}`)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('not found')
      return
    }
    void serveFile(safe, res)
  })
  await new Promise<void>((resolveListen, rejectListen) => {
    server.once('error', rejectListen)
    server.listen(0, '127.0.0.1', () => resolveListen())
  })
  const address = server.address()
  const port = address !== null && typeof address === 'object' ? address.port : 0
  const origin = `http://127.0.0.1:${port}`
  return {
    origin,
    urlFor(rel) {
      return `${origin}/${rel.split(sep).join('/')}`
    },
    close() {
      return new Promise<void>((resolveClose) => {
        server.close(() => resolveClose())
      })
    },
  }
}

function serveFile(absPath: string, res: ServerResponse): void {
  void fsReadFile(absPath)
    .then((content) => {
      const ext = (pathBasename(absPath).match(/\.[a-z0-9]+$/i)?.[0] ?? '').toLowerCase()
      res.writeHead(200, { 'Content-Type': MIME[ext] ?? 'application/octet-stream' })
      res.end(content)
```

</details>

**依据 2 · 源码核查**：[src/runner.ts:561-573](https://github.com/988hj7tczd-oss/dsh-a11y-scan/blob/8515929d9e914cc0cadd60416676608ea1da03ae/src/runner.ts#L561-L573)

URL闸门。

<details>
<summary>查看原文（13行）</summary>

```text
  if (isHttpUrl(target)) {
    kind = 'url'
    if (args.confirmUrl !== true) {
      errors.push({
        kind: 'url-confirmation-required',
        message:
          'URL 扫描需要用户显式确认：请先确认目标 URL 的可信度与网络访问策略，'
          + '再以 confirmUrl: true 重试。本地文件优先，避免对不可信站点发起浏览器扫描。',
        retryable: true,
      })
    } else {
      pagesToScan.push({ label: target, resource: target })
    }
```

</details>

**依据 3 · 源码核查**：[src/report.ts:482-507](https://github.com/988hj7tczd-oss/dsh-a11y-scan/blob/8515929d9e914cc0cadd60416676608ea1da03ae/src/report.ts#L482-L507)

人工复核必要性。

<details>
<summary>查看原文（26行）</summary>

```text
export const MANUAL_REVIEW_CHECKLIST: ManualReviewItem[] = [
  {
    id: 'focus-order',
    title: '焦点顺序是否与视觉顺序一致',
    sc: '2.4.3',
    detail: '用 Tab 走查：遮挡层、弹窗、动态插入内容后的焦点落点与恢复逻辑需人工确认，自动化只能测到 Tab 可达性。',
  },
  {
    id: 'keyboard-trap',
    title: '无键盘焦点陷阱',
    sc: '2.1.2',
    detail: 'Tab 应能离开所有组件；模态/抽屉开启时焦点应被正确圈定并在关闭后归还。',
  },
  {
    id: 'reading-order',
    title: '屏幕阅读器朗读顺序与标题层级语义',
    sc: '1.3.2 / 2.4.6',
    detail: '用 NVDA / VoiceOver 试听：DOM 顺序 ≠ 视觉顺序时确认朗读顺序可理解；h1–h6 层级表达真实内容结构。',
  },
  {
    id: 'alt-quality',
    title: '非文本内容的替代文本质量',
    sc: '1.1.1',
    detail: '自动化只验证 alt 存在；是否准确等价于图片传达的信息需人工判断（数据图、图表、截图类尤其重要）。',
  },
  {
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
