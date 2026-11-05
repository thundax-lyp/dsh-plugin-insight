# DSH Raw HTML

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[ab1f1d5](https://github.com/plolpl789/dsh-raw-html/tree/ab1f1d56748e5a4f1a3b6c61bb648a812d260b12)

<!-- BEGIN META -->
[![GitHub ★ 94](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=94&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/plolpl789/dsh-raw-html)
<!-- END META -->

> **功能**：以宿主前端补丁呈现 HTML 卡片并注入视觉设计规范

> **亮点**：[Q01](#research-q01) 整合 HTML 图表公式与风格约束。

> **主要限制**：[Q03](#research-q03) 可信模式及宿主 bundle 修改要求独立检验。

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
  - [Q01 · 交付是什么？](#detail-section-11)
  - [Q02 · 补丁如何实施？](#detail-section-12)
  - [Q03 · 可信模式扩大什么？](#detail-section-13)
  - [Q04 · 采用退出成本？](#detail-section-14)
  - [Q05 · 什么否定采用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户希望会话中的 HTML 成为可阅读卡片。

显示源码或外部页面。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 显示源码或外部页面。 | 可直接比较 | 保留人工步骤 |
| DSH Raw HTML | 整合 HTML 图表公式与风格约束。 | 可信模式及宿主 bundle 修改要求独立检验。 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 宿主 | 必需 | 前端 bundle 补丁提供渲染，插件控制开关与规范。 | 用隔离 profile 确认 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户希望会话中的 HTML 成为可阅读卡片。 | 保留原流程 |
| 试验 | 前端 bundle 补丁提供渲染，插件控制开关与规范。 | 观察固定版本 |
| 复核 | 静态卡起步，在测试 bundle 验证关闭和恢复。 | 比对任务结果 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 安装与运行成本未知 | 配置准备耗时未知 | 视 profile 而定 |
| 持续 | 持续运行成本未知 | 日常维护耗时未知 | 视任务频率而定 |
| 恢复 | 回退成本未知 | 恢复原流程耗时未知 | 视已有数据而定 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 在会话内看可操作卡片并维持可回退渲染 | 可减少外部预览切换。 | 静态卡起步，在测试 bundle 验证关闭和恢复。 |

> **思考**：[Q03](#research-q03) 可信模式及宿主 bundle 修改要求独立检验。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 整合 HTML 图表公式与风格约束。

子补丁做锚点检查及备份。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 可信模式及宿主 bundle 修改要求独立检验。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 静态卡起步，在测试 bundle 验证关闭和恢复。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的在会话内看可操作卡片并维持可回退渲染。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、patch/install-all.cjs、patch/trusted-patch.cjs、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的在会话内看可操作卡片并维持可回退渲染。未执行目标代码或实际宿主验证。
- 下一步：保留源消息、请求及文件哈希。

**分析版本**

- **仓库**：[plolpl789/dsh-raw-html](https://github.com/plolpl789/dsh-raw-html)
- **版本号**：0.6.0（[固定提交 ab1f1d5](https://github.com/plolpl789/dsh-raw-html/tree/ab1f1d56748e5a4f1a3b6c61bb648a812d260b12)）
- **版本日期**：2026-08-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 可减少外部预览切换。

保留源消息、请求及文件哈希。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 27 | 2484 | — | — | 70649 |
| .md | example | 1 | 19 | — | — | 307 |
| .js | source | 3 | 5097 | 4067 | 825 | — |
| .cjs | source | 12 | 1968 | 1384 | 404 | — |
| .cjs | test | 7 | 661 | 546 | 73 | — |
| .mjs | test | 8 | 2401 | 2041 | 246 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/plolpl789/dsh-raw-html/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在会话内看可操作卡片并维持可回退渲染

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 交付是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

用户可把消息中的 HTML、图表和公式呈现为卡片。对照源码围栏，应检查数据值、视觉结构和展开复制。插件包含设计规范，但样式规则不会保证内容准确。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-11](https://github.com/plolpl789/dsh-raw-html/blob/ab1f1d56748e5a4f1a3b6c61bb648a812d260b12/README.md#L3-L11)

作者说明补丁与插件分工

```text
在 DeepSeek Harness Web GUI 中实现 **VCP（Visual-Synesthesia，视觉通感）协议**：
消息里的 HTML 从「一坨源码」变成真正渲染的界面，并让 agent 按一套**可维护的设计规范**输出。

**即插即用**：任何电脑、任何 agent —— 跑一次一键安装器补丁（`node patch/install-all.cjs`，渲染能力+可信模式全到位）
+ 安装本插件 + 打开浏览器「</>」开关（渲染/美学双开关）→
浏览器开始渲染 HTML（含 SVG 卡片 / Mermaid 图表 / KaTeX 公式），agent 开始按规范输出（设计原则 / 中文排版 / 字体搭配）。

> 渲染能力（HTML/SVG/图表/公式）由补丁注入前端 bundle，插件负责开关与协议注入——
> 详细步骤见下方「安装」章节。
```

**依据 2 · 源码核查**：[package.json:17-28](https://github.com/plolpl789/dsh-raw-html/blob/ab1f1d56748e5a4f1a3b6c61bb648a812d260b12/package.json#L17-L28)

包包括客户端与补丁

<details>
<summary>查看原文（12行）</summary>

```text
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "lib/*.js",
    "assets",
    "patch/*.js",
    "patch/*.cjs",
```

</details>

#### 缺口

- 实际渲染依赖宿主编译形态。
  **影响**：减少另开网页。
  **进一步探讨**：先用静态数据卡。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 补丁如何实施？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

总安装器串行运行多份子补丁，遇到失败退出。可信补丁按旧或新前端锚点替换过滤逻辑，单子补丁做语法校验、备份及失败回滚。

#### 证据与依据

**依据 1 · 源码核查**：[patch/install-all.cjs:43-57](https://github.com/plolpl789/dsh-raw-html/blob/ab1f1d56748e5a4f1a3b6c61bb648a812d260b12/patch/install-all.cjs#L43-L57)

多步骤串行执行

<details>
<summary>查看原文（15行）</summary>

```text
for (let i = 0; i < STEPS.length; i++) {
  const step = STEPS[i]
  console.log(`\n[install-all] 步骤 ${i + 1}/${STEPS.length}：${step.name}`)
  const args = [path.join(scriptDir, step.script)]
  if (bundleArg) args.push(bundleArg)
  const r = spawnSync(process.execPath, args, { stdio: 'inherit' })
  if (r.error) {
    console.error(`[install-all] ✗ 步骤 ${i + 1} 执行异常：${r.error.message}`)
    console.error('[install-all] 请确认已安装 Node.js（node -v 可运行）。')
    process.exit(1)
  }
  if (r.status !== 0) {
    console.error(`[install-all] ✗ 步骤 ${i + 1} 失败（退出码 ${r.status}）。`)
    console.error('[install-all]   子脚本已安全中止、未写入损坏产物；请按上面日志排查后重试。')
    process.exit(r.status || 1)
```

</details>

**依据 2 · 源码核查**：[patch/trusted-patch.cjs:65-99](https://github.com/plolpl789/dsh-raw-html/blob/ab1f1d56748e5a4f1a3b6c61bb648a812d260b12/patch/trusted-patch.cjs#L65-L99)

锚点、备份和健康检查

<details>
<summary>查看原文（35行）</summary>

```text
if (t.indexOf(TRUSTED_OLD) !== -1 || t.indexOf(TRUSTED_NEW) !== -1) {
  console.log('[trusted] 补丁已应用，跳过')
  process.exit(0)
}

const count = t.split(ANCHOR).length - 1
if (count !== 1) {
  console.error(`[trusted] 锚点命中 ${count} 次（需要恰好 1 次），中止，未写入任何修改`)
  console.error('[trusted] 若 bundle 尚未打过渲染补丁，请先运行 install-v6.cjs（它会注入 script 硬过滤锚点）')
  process.exit(1)
}

// 语法预检（包进函数上下文，return 才合法；新老变量名分别预检）
try {
  new vm.Script('function vc(n,r){const i=n,s={};' + TRUSTED_OLD + '}', { filename: 'trusted-fragment-old' })
  new vm.Script('function Xu(n,i){const l=n,u={};' + TRUSTED_NEW + '}', { filename: 'trusted-fragment-new' })
} catch (e) {
  console.error('[trusted] 补丁片段语法校验失败:', e.message)
  process.exit(1)
}

const stamp = new Date().toISOString().replace(/[:.]/g, '-')
const bak = `${file}.bak-trusted-${stamp}`
fs.copyFileSync(file, bak)

t = t.split(ANCHOR).join(TRUSTED)
fs.writeFileSync(file, t, 'utf8')

// 健康检查
try {
  execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' })
  console.log('[trusted] 健康检查通过：node --check OK')
} catch (e) {
  fs.copyFileSync(bak, file)
  console.error('[trusted] 健康检查失败，已回滚到备份！')
```

</details>

#### 缺口

- 整体步骤不构成原子事务。
  **影响**：失败后要逐个核对已完成改动。
  **进一步探讨**：在测试 bundle 模拟后步骤失败。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 可信模式扩大什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

浏览器开关可开启 script、iframe、object、embed 的条件放行。运行环境与宿主页共享的具体影响应通过网络和 DOM 验证，用户对会话来源的信任不足以证明生成脚本可靠。

#### 证据与依据

**依据 1 · 源码核查**：[patch/trusted-patch.cjs:21-31](https://github.com/plolpl789/dsh-raw-html/blob/ab1f1d56748e5a4f1a3b6c61bb648a812d260b12/patch/trusted-patch.cjs#L21-L31)

条件放行的标签

<details>
<summary>查看原文（11行）</summary>

```text
// ---- 锚点：vc()/Xu() 里 script/iframe/object/embed 硬过滤（install-v6 注入产物）----
// 老版前端（rc.5~rc.7 · vc/hp 形态，属性变量 i）与新版前端（rc.8+ / 0.1.1-rc.x · Xu/jd 形态，变量 l）
// 各一套锚点（install-v6.cjs 分别注入 SCRIPT_FILTER 与 SCRIPT_FILTER_NEW），代际自动探测。
const ANCHOR_OLD =
  'if(i.localName==="script"||i.localName==="iframe"||i.localName==="object"||i.localName==="embed")return null;'
const TRUSTED_OLD =
  'if(!(typeof window!=="undefined"&&typeof window.__vcpTrusted==="function"&&window.__vcpTrusted())&&(i.localName==="script"||i.localName==="iframe"||i.localName==="object"||i.localName==="embed"))return null;'
const ANCHOR_NEW =
  'if(l.localName==="script"||l.localName==="iframe"||l.localName==="object"||l.localName==="embed")return null;'
const TRUSTED_NEW =
  'if(!(typeof window!=="undefined"&&typeof window.__vcpTrusted==="function"&&window.__vcpTrusted())&&(l.localName==="script"||l.localName==="iframe"||l.localName==="object"||l.localName==="embed"))return null;'
```

</details>

**依据 2 · 源码核查**：[lib/client.js:69-78](https://github.com/plolpl789/dsh-raw-html/blob/ab1f1d56748e5a4f1a3b6c61bb648a812d260b12/lib/client.js#L69-L78)

本地开关及全局标记

<details>
<summary>查看原文（10行）</summary>

```text
    // 双人私密会话内容双方可信 → 正文可放行 script（WebGL/Shader/fetch 由此解锁）。
    // v7.2 起本模块由插件 client 层提供：安装插件 = 可用，停用插件 = 徽章消失、
    // window.__vcpTrusted 未定义 → 主 bundle 渲染层（vc()/parseOpen）防御式调用
    // 自动返回 false（安全默认），可信模式彻底跟随插件生命周期。
    // 开关：localStorage['raw-html.trusted']==='1' 或 window.__DSH_TRUSTED__===true。
    function isTrusted() {
      try {
        if (window.__DSH_TRUSTED__ === true) return true
        if (window.localStorage.getItem('raw-html.trusted') === '1') return true
      } catch (e) {}
```

</details>

#### 缺口

- 开关状态跨会话影响和脚本权限未验。
  **影响**：默认过滤与开启后的能力不同。
  **进一步探讨**：保持关闭先验证静态卡。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用退出成本？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需固定宿主 bundle 和补丁版本，备份原产物后检查分步状态。首次成本含定位及回归，升级需重新核查锚点。退出恢复所有原 bundle、停用插件并核对可信开关和缓存留存。

#### 证据与依据

**依据 1 · 源码核查**：[patch/install-all.cjs:19-20](https://github.com/plolpl789/dsh-raw-html/blob/ab1f1d56748e5a4f1a3b6c61bb648a812d260b12/patch/install-all.cjs#L19-L20)

作者提供显式 bundle 路径

```text
 *   node patch/install-all.cjs                     # 自动探测 dist bundle
 *   node patch/install-all.cjs <bundle路径>         # 指定 bundle（多环境/多 profile）
```

**依据 2 · 源码核查**：[patch/trusted-patch.cjs:87-105](https://github.com/plolpl789/dsh-raw-html/blob/ab1f1d56748e5a4f1a3b6c61bb648a812d260b12/patch/trusted-patch.cjs#L87-L105)

版本化备份和改写

<details>
<summary>查看原文（19行）</summary>

```text
const bak = `${file}.bak-trusted-${stamp}`
fs.copyFileSync(file, bak)

t = t.split(ANCHOR).join(TRUSTED)
fs.writeFileSync(file, t, 'utf8')

// 健康检查
try {
  execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' })
  console.log('[trusted] 健康检查通过：node --check OK')
} catch (e) {
  fs.copyFileSync(bak, file)
  console.error('[trusted] 健康检查失败，已回滚到备份！')
  process.exit(1)
}

console.log('[trusted] ✓ vc 层可信模式补丁已写入')
console.log('[trusted] 文件:', file)
console.log('[trusted] 备份:', bak)
```

</details>

#### 缺口

- 多补丁恢复顺序未知。
  **影响**：单移除插件可能保留已改前端。
  **进一步探讨**：按原文件摘要回验。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么否定采用？

**研究主题**：新假设与验证

#### 完整回答

静态卡、Mermaid、公式和禁用脚本做同源对照，加入半截流式内容与补丁失败。若关闭仍执行脚本、正文丢字或恢复后摘要不一致，则当前组合不满足边界和可靠性。

#### 证据与依据

**依据 1 · 源码核查**：[patch/trusted-patch.cjs:25-31](https://github.com/plolpl789/dsh-raw-html/blob/ab1f1d56748e5a4f1a3b6c61bb648a812d260b12/patch/trusted-patch.cjs#L25-L31)

关闭条件可验证

```text
  'if(i.localName==="script"||i.localName==="iframe"||i.localName==="object"||i.localName==="embed")return null;'
const TRUSTED_OLD =
  'if(!(typeof window!=="undefined"&&typeof window.__vcpTrusted==="function"&&window.__vcpTrusted())&&(i.localName==="script"||i.localName==="iframe"||i.localName==="object"||i.localName==="embed"))return null;'
const ANCHOR_NEW =
  'if(l.localName==="script"||l.localName==="iframe"||l.localName==="object"||l.localName==="embed")return null;'
const TRUSTED_NEW =
  'if(!(typeof window!=="undefined"&&typeof window.__vcpTrusted==="function"&&window.__vcpTrusted())&&(l.localName==="script"||l.localName==="iframe"||l.localName==="object"||l.localName==="embed"))return null;'
```

**依据 2 · 源码核查**：[patch/install-all.cjs:43-57](https://github.com/plolpl789/dsh-raw-html/blob/ab1f1d56748e5a4f1a3b6c61bb648a812d260b12/patch/install-all.cjs#L43-L57)

分步失败可注入

<details>
<summary>查看原文（15行）</summary>

```text
for (let i = 0; i < STEPS.length; i++) {
  const step = STEPS[i]
  console.log(`\n[install-all] 步骤 ${i + 1}/${STEPS.length}：${step.name}`)
  const args = [path.join(scriptDir, step.script)]
  if (bundleArg) args.push(bundleArg)
  const r = spawnSync(process.execPath, args, { stdio: 'inherit' })
  if (r.error) {
    console.error(`[install-all] ✗ 步骤 ${i + 1} 执行异常：${r.error.message}`)
    console.error('[install-all] 请确认已安装 Node.js（node -v 可运行）。')
    process.exit(1)
  }
  if (r.status !== 0) {
    console.error(`[install-all] ✗ 步骤 ${i + 1} 失败（退出码 ${r.status}）。`)
    console.error('[install-all]   子脚本已安全中止、未写入损坏产物；请按上面日志排查后重试。')
    process.exit(r.status || 1)
```

</details>

#### 缺口

- 尚未实际运行补丁。
  **影响**：应分开验证渲染、执行和恢复。
  **进一步探讨**：保留源消息、请求及文件哈希。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
