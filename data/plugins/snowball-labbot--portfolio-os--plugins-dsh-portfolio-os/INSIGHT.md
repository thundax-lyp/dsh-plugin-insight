# DSH Portfolio OS

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[b5d5254](https://github.com/Snowball-labbot/Portfolio-OS/tree/b5d525494bb212c1cbacfe71656d4eba22b9c2c0/plugins/dsh-portfolio-os)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Snowball-labbot/Portfolio-OS)
<!-- END META -->

> **功能**：在 DSH 内打开 Portfolio OS 全屏资产工作台，并管理本机 Windows Runtime 的启动和状态。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)把Windows Runtime查找、启动状态、侧栏全屏入口和frame就绪反馈连在一起，相对手工部署减少部分交接。它是应用集成增量，没有证明新的投资方法或收益。

> **主要限制**：[Q03](#research-q03)确认启动超时不终止子进程，默认关闭和卸载仍保留后台；重启也未等待exit确认。再加上[Q02](#research-q02)只认ok:true的health，就绪、超时和停止不能直接代表目标实例的完整状态。

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
  - [Q01 · 它是独立系统还是适配器，谁用它读什么数据？](#detail-section-11)
  - [Q02 · 工具如何调用服务，启动、写入和失败路径如何接线？](#detail-section-12)
  - [Q03 · 结果可信度和权限边界如何影响使用？](#detail-section-13)
  - [Q04 · 怎样在非交易决策场景试用、验收和退出？](#detail-section-14)
  - [Q05 · 能否让数据时点和结果出处随回答交付？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向希望在DSH Desktop内打开本地个人资产记录应用的Windows用户，适配器提供入口与Runtime管理，不提供模型持仓工具，见[Q01](#research-q01)。

相对在浏览器打开并自行部署独立Portfolio OS应用；本项贡献限定于发行与DSH接线，不把根系统投研能力归为子插件。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 全屏应用入口 | 在DSH内打开Portfolio OS | 实际独立应用，不是模型查询工具 |
| Runtime启动 | 按配置查找并运行本机服务 | 普通随包路径仅Windows，需核发行内容 |
| 状态与重试 | 检查health并提供start/restart | ok:true不含实例身份，重启不总是杀后重启 |
| frame就绪反馈 | 区分网页load和应用ready | source/origin校验不证明业务数据正确 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH connection与Web slots | 接入必需 | Host RPC、侧栏和全屏容器 | 对应入口不能成立，包声明<0.2.0 |
| 匹配Windows Runtime | 普通发行必需 | 本机应用和SQLite服务 | 非Windows需显式运行文件或开发sourceDir |
| 可写独立数据目录 | 保存必需 | 配置、数据库、上传和备份 | 不应以真实资产验证写入 |
| 用户另配AI API | 应用AI功能时需要 | 上层策略助手和简报 | 本项未核完整调用和费用，不视为插件自有模型 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户固定发行包、目标profile和独立目录 | 平台及宿主范围匹配 |
| 启动 | Host查health并选择Runtime子进程 | 不能只凭ok:true认定实例身份 |
| 展示 | 客户端加载frame并等应用ready | 超时或错误明确，手动核进程而非盲重试 |
| 验收退出 | 用户检查虚构样本导出和后台进程 | 关闭与卸载不等于停止或清除数据 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Runtime和存储，金额未知 | 发行核验、profile和目录配置 | 实际安装耗时未知 |
| 持续使用 | 后台服务、同步与可选API，费用未知 | 数据复核与备份 | 本地优先不等于离线 |
| 失败恢复与退出 | 后台遗留和备份占用未知 | 核端口、进程、目录与回退 | 超时不证明进程结束，卸载不删数据 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 应用接入 | RPC、启动器、侧栏和frame-ready链路 | 固定发行与目标宿主可用性 |
| 就绪反馈 | 区分文档load和应用ready | 目标应用版本与实例身份 |
| 部署简化 | WindowsRuntime查找与sourceDir回退 | 实际节省时间和恢复可靠性 |

> **思考**：[Q03](#research-q03)确认启动超时不终止子进程，默认关闭和卸载仍保留后台；重启也未等待exit确认。再加上[Q02](#research-q02)只认ok:true的health，就绪、超时和停止不能直接代表目标实例的完整状态。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)把Windows Runtime查找、启动状态、侧栏全屏入口和frame就绪反馈连在一起，相对手工部署减少部分交接。它是应用集成增量，没有证明新的投资方法或收益。

[Q02](#research-q02)的实例内并发startPromise、shell:false参数数组、frame source/origin校验和就绪分层值得参考；[Q03](#research-q03)缺少实例身份和退出确认，不能把超时作为终止证明。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)确认启动超时不终止子进程，默认关闭和卸载仍保留后台；重启也未等待exit确认。再加上[Q02](#research-q02)只认ok:true的health，就绪、超时和停止不能直接代表目标实例的完整状态。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04)先观察，只在匹配Windows和宿主的隔离profile用虚构样本检查固定发行；状态不符或后台无法确定时停止导入，回独立应用或原记录工具。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

原生DSH应用接入链路有源码支持；发行Runtime、目标宿主及生命周期失败结果未验证。采用结论为观察，实例握手只是未来假设。

- 已检查：作者 README、包清单、源码路径 plugins/dsh-portfolio-os/README.md、plugins/dsh-portfolio-os/package.json、plugins/dsh-portfolio-os/cordis.patch.yml、plugins/dsh-portfolio-os/index.js、plugins/dsh-portfolio-os/client.js、README.md、marketplace_runtime/launcher.py、marketplace_runtime/app.py、marketplace_runtime/scheduler.py、backend/main.py 及固定范围 inventory；组件：plugins/dsh-portfolio-os。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定plugins/dsh-portfolio-os子组件全入口与客户端主要生命周期；必要依赖单列检查marketplace_runtime launcher/app/scheduler及backend health。未审计根系统财务计算、交易能力、完整鉴权、凭据或数据导入，工程统计仅对应子组件，不把Python依赖计为插件LOC。
- 下一步：后续在隔离Windows和固定发行中验证占端口、延迟启动、重复重试、关闭及卸载的实际进程和样本数据；本轮未运行。

**分析版本**

- **仓库**：[Snowball-labbot/Portfolio-OS](https://github.com/Snowball-labbot/Portfolio-OS)
- **版本号**：0.2.1（[固定提交 b5d5254](https://github.com/Snowball-labbot/Portfolio-OS/tree/b5d525494bb212c1cbacfe71656d4eba22b9c2c0)）
- **版本日期**：2026-09-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)提出未验证的实例身份与生命周期握手，让health和frame绑定同一应用代际，并核对退出结果；用占端口和延迟退出对照，误判不下降或排障更重就否定。

后续在隔离Windows和固定发行中验证占端口、延迟启动、重复重试、关闭及卸载的实际进程和样本数据；本轮未运行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 666 | 611 | 10 | — |
| .md | source | 1 | 31 | — | — | 274 |
| .mjs | test | 1 | 67 | 59 | 3 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/Snowball-labbot/Portfolio-OS/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Snowball-labbot/Portfolio-OS/issues?q=is%3Aissue+created%3A2026-10-05T02%3A13%3A37.357Z..2026-11-04T02%3A13%3A37.357Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Snowball-labbot/Portfolio-OS/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T02%3A13%3A37.357Z..2026-11-04T02%3A13%3A37.357Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：本地Portfolio OS应用接入DSH的生命周期与就绪状态是否可核对，哪些条件限制采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它是独立系统还是适配器，谁用它读什么数据？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

研究对象是 Portfolio OS 仓库中 plugins/dsh-portfolio-os 的原生 DSH bundle。它把独立的本地资产应用装入 DSH 的全屏界面，并管理本地 Runtime 启动；不是向会话模型提供持仓查询工具。根系统关于多币种持仓、交易流水、研究库和 AI 助手的说明属于应用能力主张，不能全部归为这个适配器自己实现。合格的适配结果是目标版本本地应用正确启动，界面可用，关闭与后台进程状态可解释，用户数据留在预期目录；不是收益率或策略正确。

人群是希望把个人资产记录和资料整理应用放进 DSH Desktop 的 Windows 用户。原办法是在浏览器另开本地应用并自行安装运行环境；适配器增加侧栏入口、启动与状态管理，以及发行包内 Windows Runtime 的查找路径，可能减少部署交接。这里的具体增量是应用分发和宿主集成，而不是新的投资模型或交易机制。固定源码能证明安装布局和调用设计，不能证明 Release 真的包含正确可执行文件，也没有核验市场数据与财务计算。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/dsh-portfolio-os/README.md:1-12](https://github.com/Snowball-labbot/Portfolio-OS/blob/b5d525494bb212c1cbacfe71656d4eba22b9c2c0/plugins/dsh-portfolio-os/README.md#L1-L12)

作者明确这是市场插件、全屏应用与本地Runtime。

<details>
<summary>查看原文（12行）</summary>

```text
# DSH Portfolio OS

Portfolio OS 的 DSH Desktop 市场插件。安装后会启动随包附带的 Windows Runtime，并在 DSH 内以独立全屏页面打开资产投研平台。

## 使用方式

1. 从 DSH 插件市场安装“资产投研”。
2. 点击 DSH 侧栏的“资产投研”。首次启动会初始化本地 SQLite 数据库。
3. 在右上角“AI API”中配置 Agnes 或其他 OpenAI-compatible API。
4. 在本地注册账号并导入自己的资产备份。

无需 Docker、Python、Node.js 或源代码。数据默认保存在 `%LOCALAPPDATA%\PortfolioOS`，卸载插件不会自动删除用户数据。
```

</details>

**依据 2 · 作者声明**：[README.md:1-25](https://github.com/Snowball-labbot/Portfolio-OS/blob/b5d525494bb212c1cbacfe71656d4eba22b9c2c0/README.md#L1-L25)

根应用能力与整体结构；与子插件贡献分开。

<details>
<summary>查看原文（25行）</summary>

````text
# Portfolio OS Marketplace Edition

Portfolio OS 是一个本地优先的个人资产配置与投研工作台。这个仓库是面向 DSH 插件市场的独立发行版：用户安装插件后即可使用，不需要 Docker、PostgreSQL、Python 或源代码。

![Portfolio OS 资产总览](docs/screenshots/portfolio-dashboard.png)

## 功能

- 多币种持仓、现金账户、买卖与转仓流水
- 资产配置、核心暴露、地区分布与组合表现
- 市场观察、宏观事件、新闻、财报与社交热度
- 每日新闻、持仓复盘、研究库与量化研究记录
- AI 策略助手与自动研究简报
- 本地注册、资产备份导入与导出

市场版只管理当前用户可支配的个人组合，不包含家庭成员资产模块。

## 安装后的结构

```text
DSH Desktop
  └─ dsh-portfolio-os
       ├─ React frontend
       ├─ FastAPI backend
       ├─ SQLite database
````

</details>

**依据 3 · 源码核查**：[plugins/dsh-portfolio-os/package.json:1-24](https://github.com/Snowball-labbot/Portfolio-OS/blob/b5d525494bb212c1cbacfe71656d4eba22b9c2c0/plugins/dsh-portfolio-os/package.json#L1-L24)

原生bundle、main和客户端声明。

<details>
<summary>查看原文（24行）</summary>

```text
{
  "name": "dsh-portfolio-os",
  "version": "0.2.1",
  "description": "Install-and-run Portfolio OS inside DSH Desktop without Docker.",
  "type": "module",
  "main": "./index.js",
  "exports": {
    ".": "./index.js",
    "./client": "./client.js",
    "./package.json": "./package.json"
  },
  "files": ["index.js", "client.js", "cordis.patch.yml", "README.md", "vendor"],
  "keywords": ["dsh-plugin", "deepseek-harness", "portfolio", "investment-research"],
  "dsh": {
    "engines": { "dsh": ">=0.1.2-rc.1 <0.2.0" },
    "bundle": { "patch": "./cordis.patch.yml" },
    "client": {
      "platform": "web",
      "inject": ["@deepseek-ai/dsh-client-connection"]
    }
  },
  "scripts": { "test": "node --test tests/plugin.node.mjs" },
  "engines": { "node": ">=22" },
  "license": "MIT"
```

</details>

**依据 4 · 源码核查**：[plugins/dsh-portfolio-os/client.js:348-373](https://github.com/Snowball-labbot/Portfolio-OS/blob/b5d525494bb212c1cbacfe71656d4eba22b9c2c0/plugins/dsh-portfolio-os/client.js#L348-L373)

侧栏入口和应用surface的实际接线。

<details>
<summary>查看原文（26行）</summary>

```text
    var inject = ['connection', 'slots'];
    function apply(ctx) {
      var rpc = (ctx.connection && ctx.connection.rpc) || null;
      var shell = new PortfolioShell(rpc);
      ctx.effect(function () {
        ensureStyles();
        return function () {
          var style = document.querySelector('style[data-dsh-portfolio-style]');
          if (style) style.remove();
          shell.dispose();
        };
      }, 'portfolio-os: application surface');

      ctx.slots.inject('sidebar.footer.action', function () {
        return ctx.slots.register(
          {
            name: 'sidebar.footer.action',
            id: 'portfolio-os',
            order: 50,
            inject: function () {
              return { openPortfolio: function (trigger) { shell.open(trigger); } };
            },
          },
          Sidebar
        );
      });
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工具如何调用服务，启动、写入和失败路径如何接线？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

没有模型工具注册；实际链路是客户端侧栏打开全屏容器，RPC 调用 /dsh-portfolio-os 的 status/start/restart，Host service 检查本地 health，必要时启动子进程，再把 frontendUrl 交给 iframe。配置只允许 frontendUrl 和 healthUrl 的主机名为 localhost、127.0.0.1 或 ::1；默认本地端口41731。Runtime 优先显式可执行文件，其次Windows随包或可选Runtime包，再次开发sourceDir的Python launcher。非Windows没有随包解析路径，不能把Windows免配置声明推广到所有平台。

startPromise 合并同一实例内并发启动；health 3秒超时，启动总等待20至300秒可配置，轮询500毫秒。它检查的是HTTP成功且JSON的ok为true；Runtime后端health也只返回这个布尔值，不含产品、版本、实例或数据目录，所以已有别的兼容响应可能被当作就绪，未证明这已在真实环境发生。客户端又区分iframe文档load和来自同一frame、匹配origin的portfolio-os-ready消息，避免只看网页资源加载完成就消除遮罩；这些步骤提高状态可解释性，但没有验证用户业务流程。

子进程通过shell:false和参数数组启动，避免字符串shell拼接；继承父进程环境，stdio忽略，启动错误转为phase=error。健康状态不能证明导入、保存和备份正确，这些操作在独立应用而非该适配器中完成。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-portfolio-os/index.js:19-55](https://github.com/Snowball-labbot/Portfolio-OS/blob/b5d525494bb212c1cbacfe71656d4eba22b9c2c0/plugins/dsh-portfolio-os/index.js#L19-L55)

配置只按loopback主机名限制URL，并给出默认生命周期开关。

<details>
<summary>查看原文（37行）</summary>

```text
export function isLoopbackUrl(value) {
  try {
    const url = new URL(value)
    return ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
  } catch {
    return false
  }
}

export function redact(value) {
  return String(value ?? '')
    .replace(/(authorization\s*[:=]\s*bearer\s+)[^\s,;]+/gi, '$1[REDACTED]')
    .replace(/((?:api[_-]?key|token|secret|password)\s*[:=]\s*)[^\s,;]+/gi, '$1[REDACTED]')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_MESSAGE)
}

function normalizeConfig(raw = {}) {
  const port = Math.min(49_999, Math.max(10_240, Number(raw.port) || DEFAULT_PORT))
  const frontendUrl = String(raw.frontendUrl || `http://127.0.0.1:${port}`).trim()
  const healthUrl = String(raw.healthUrl || `${frontendUrl}/api/health`).trim()
  if (!isLoopbackUrl(frontendUrl) || !isLoopbackUrl(healthUrl)) {
    throw new Error('资产投研仅允许使用本机 loopback 地址。')
  }
  return {
    port,
    frontendUrl,
    healthUrl,
    runtimeExecutable: String(raw.runtimeExecutable || '').trim(),
    sourceDir: String(raw.sourceDir || '').trim(),
    pythonExecutable: String(raw.pythonExecutable || 'python').trim(),
    dataDir: String(raw.dataDir || path.join(process.env.LOCALAPPDATA || os.homedir(), 'PortfolioOS')).trim(),
    autoStart: raw.autoStart !== false,
    keepRunningOnExit: raw.keepRunningOnExit !== false,
    startupTimeoutSeconds: Math.min(300, Math.max(20, Number(raw.startupTimeoutSeconds) || 90)),
  }
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-portfolio-os/index.js:70-86](https://github.com/Snowball-labbot/Portfolio-OS/blob/b5d525494bb212c1cbacfe71656d4eba22b9c2c0/plugins/dsh-portfolio-os/index.js#L70-L86)

Windows随包与可选Runtime查找。

<details>
<summary>查看原文（17行）</summary>

```text
export async function resolvePackagedRuntime() {
  if (process.platform !== 'win32') return undefined
  const bundled = await firstAccessible([
    path.join(PLUGIN_ROOT, 'vendor', 'portfolio-os-runtime.exe'),
    path.join(PLUGIN_ROOT, 'vendor', 'portfolio-os-runtime', 'portfolio-os-runtime.exe'),
  ])
  if (bundled) return bundled
  try {
    const packageJson = require.resolve('@snowball-labbot/portfolio-os-win32-x64/package.json')
    const packageRoot = path.dirname(packageJson)
    return firstAccessible([
      path.join(packageRoot, 'bin', 'portfolio-os-runtime.exe'),
      path.join(packageRoot, 'bin', 'portfolio-os-runtime', 'portfolio-os-runtime.exe'),
    ])
  } catch {
    return undefined
  }
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-portfolio-os/index.js:124-164](https://github.com/Snowball-labbot/Portfolio-OS/blob/b5d525494bb212c1cbacfe71656d4eba22b9c2c0/plugins/dsh-portfolio-os/index.js#L124-L164)

健康判据与命令选择。

<details>
<summary>查看原文（41行）</summary>

```text
  async _applicationReady() {
    try {
      const response = await this.fetch(this.config.healthUrl, { signal: AbortSignal.timeout(3_000) })
      if (!response.ok) return false
      const payload = await response.json()
      return payload?.ok === true
    } catch {
      return false
    }
  }

  async checkStatus() {
    if (await this._applicationReady()) {
      this._set('ready', '资产投研已就绪')
    } else if (this.phase === 'ready') {
      this._set('error', '本地 Runtime 已停止；资产数据仍保存在本机。')
    }
    return this.snapshot()
  }

  async _command() {
    if (this.config.runtimeExecutable) {
      const executable = await firstAccessible([path.resolve(this.config.runtimeExecutable)])
      if (!executable) throw new Error(`找不到配置的 Runtime：${this.config.runtimeExecutable}`)
      return { executable, args: ['--port', String(this.config.port), '--data-dir', this.config.dataDir], cwd: path.dirname(executable) }
    }

    const packaged = await this.resolveRuntime()
    if (packaged) {
      return { executable: packaged, args: ['--port', String(this.config.port), '--data-dir', this.config.dataDir], cwd: path.dirname(packaged) }
    }

    if (this.config.sourceDir) {
      return {
        executable: this.config.pythonExecutable,
        args: ['-m', 'marketplace_runtime.launcher', '--port', String(this.config.port), '--data-dir', this.config.dataDir],
        cwd: path.resolve(this.config.sourceDir),
      }
    }

    throw new Error('插件包中未找到 Windows Runtime。请重新安装插件，或在开发模式配置 sourceDir。')
```

</details>

**依据 4 · 源码核查**：[plugins/dsh-portfolio-os/index.js:167-218](https://github.com/Snowball-labbot/Portfolio-OS/blob/b5d525494bb212c1cbacfe71656d4eba22b9c2c0/plugins/dsh-portfolio-os/index.js#L167-L218)

启动参数、并发合并、轮询和超时路径。

<details>
<summary>查看原文（52行）</summary>

```text
  async _launch() {
    const command = await this._command()
    const child = this.spawn(command.executable, command.args, {
      cwd: command.cwd,
      env: { ...process.env },
      detached: false,
      windowsHide: true,
      shell: false,
      stdio: 'ignore',
    })
    this.child = child
    child.once('error', (error) => {
      if (this.child === child) {
        this.child = undefined
        this._set('error', `Runtime 启动失败：${safeError(error)}`)
      }
    })
    child.once('exit', (code) => {
      if (this.child === child) {
        this.child = undefined
        if (this.phase !== 'stopping') this._set('error', `Runtime 已退出（代码 ${code ?? 'unknown'}）`)
      }
    })
  }

  async start() {
    if (this.startPromise) return this.startPromise
    this.startPromise = this._start().finally(() => { this.startPromise = undefined })
    return this.startPromise
  }

  async _start() {
    try {
      if (await this._applicationReady()) {
        this._set('ready', '资产投研已就绪')
        return this.snapshot()
      }
      this._set('starting_services', '正在启动本地资产投研 Runtime')
      await this._launch()
      const deadline = Date.now() + this.config.startupTimeoutSeconds * 1_000
      while (Date.now() < deadline) {
        if (await this._applicationReady()) {
          this._set('ready', '资产投研已就绪')
          return this.snapshot()
        }
        if (!this.child && this.phase === 'error') return this.snapshot()
        await delay(500)
      }
      throw new Error('本地 Runtime 启动超时，请查看 PortfolioOS 日志。')
    } catch (error) {
      this._set('error', safeError(error))
      return this.snapshot()
```

</details>

**依据 5 · 源码核查**：[plugins/dsh-portfolio-os/index.js:268-283](https://github.com/Snowball-labbot/Portfolio-OS/blob/b5d525494bb212c1cbacfe71656d4eba22b9c2c0/plugins/dsh-portfolio-os/index.js#L268-L283)

真实Host RPC和自动启动、卸载接线。

<details>
<summary>查看原文（16行）</summary>

```text
  const disposeRpc = ctx.connection.rpc.handle(CHANNEL, async (endpoint) => {
    try {
      if (endpoint === 'status') return ok(await service.checkStatus())
      if (endpoint === 'start') return ok(await service.start())
      if (endpoint === 'restart') return ok(await service.restart())
      throw new Error(`未知的资产投研操作：${endpoint}`)
    } catch (error) {
      return fail(error)
    }
  })

  const timer = rawConfig.autoStart === false ? undefined : setTimeout(() => { void service.start() }, 150)
  return () => {
    if (timer) clearTimeout(timer)
    disposeRpc()
    service.dispose()
```

</details>

**依据 6 · 源码核查**：[plugins/dsh-portfolio-os/client.js:192-233](https://github.com/Snowball-labbot/Portfolio-OS/blob/b5d525494bb212c1cbacfe71656d4eba22b9c2c0/plugins/dsh-portfolio-os/client.js#L192-L233)

文档加载与应用ready区分，并校验消息source和origin。

<details>
<summary>查看原文（42行）</summary>

```text
    PortfolioShell.prototype.onIframeLoad = function () {
      if (!this.frameBaseUrl || this.iframe.getAttribute('src') === 'about:blank') return;
      this.iframeLoaded = true;
      this.root.setAttribute('data-frame-phase', 'loaded');
      this.root.setAttribute('data-frame-phase', this.iframeAppReady ? 'ready' : 'document-loaded');
      if (!this.iframeAppReady) {
        this.loading.style.display = 'flex';
        this.loading.textContent = '页面资源已加载，正在初始化资产投研...';
      }
    };

    PortfolioShell.prototype.onIframeError = function () {
      this.iframeLoaded = false;
      this.root.setAttribute('data-frame-phase', 'error');
      this.loading.style.display = 'flex';
      this.loading.textContent = '资产投研页面加载失败，请点击“刷新页面”重试。';
    };

    PortfolioShell.prototype.onFrameMessage = function (event) {
      if (!this.iframe || event.source !== this.iframe.contentWindow) return;
      if (this.frameOrigin && event.origin !== this.frameOrigin) return;
      var data = event.data;
      if (!data || typeof data !== 'object') return;
      if (data.type === 'portfolio-os-ready') {
        this.iframeAppReady = true;
        this.root.setAttribute('data-frame-phase', 'ready');
        this.loading.style.display = 'none';
        if (this.iframeLoadTimer) clearTimeout(this.iframeLoadTimer);
        this.iframeLoadTimer = null;
        return;
      }
      if (data.type === 'portfolio-os-error') {
        this.iframeAppReady = false;
        this.root.setAttribute('data-frame-phase', 'error');
        this.loading.style.display = 'flex';
        var detail = typeof data.message === 'string' ? data.message.trim() : '';
        this.loading.textContent = detail
          ? '资产投研页面初始化失败：' + detail + '。请点击“刷新页面”重试。'
          : '资产投研页面初始化失败，请点击“刷新页面”重试。';
        if (this.iframeLoadTimer) clearTimeout(this.iframeLoadTimer);
        this.iframeLoadTimer = null;
      }
```

</details>

**依据 7 · 源码核查**：[backend/main.py:42-44](https://github.com/Snowball-labbot/Portfolio-OS/blob/b5d525494bb212c1cbacfe71656d4eba22b9c2c0/backend/main.py#L42-L44)

必要后端依赖的health仅返回ok:true，无实例身份。

```text
    @app.get("/api/health")
    def health() -> dict:
        return {"ok": True}
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 结果可信度和权限边界如何影响使用？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

适配器的重要限制是生命周期与实例身份，而非金融结论是否好看。默认autoStart开启，keepRunningOnExit也开启；关闭全屏页面只隐藏容器、停止轮询，不停止后台服务。卸载dispose默认不会kill子进程，数据目录也保留。启动等待超时仅记录error，没有在catch中终止已启动的子进程；因此超时不证明进程已经停止，重试前应核对实际端口和进程。restart对已跟踪child发送kill后等800毫秒，未等待真实exit；若服务健康但不是当前child，则仅重新连接而不重启。不能把按钮文字“重启服务”当成所有情形都重新启动。

loopback限制减少主动配置远程地址的范围，但URL检查不验证服务身份，也不是租户隔离或完整的凭据保护证明。实际launcher绑定127.0.0.1并在数据目录生成SQLite配置，但这属于必要后端依赖；没有审计全系统鉴权、凭据加密和数据导入计算。根README的DPAPI和不泄漏声明保留为作者主张，本报告不据此宣称已验证隐私安全。

Runtime启动会挂后台scheduler，已读代码显示定期同步和生成入口，因此“本地优先”不能理解成运行后绝不联网或没有持续资源消耗。尚未深入核查所有下游数据源和生成条件，不据此认定每次启动必产生付费模型请求。核心采用风险是用户以为关闭界面或启动失败就停止了服务，而实际后台仍可能存在，排查和退出由用户承担。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-portfolio-os/index.js:192-241](https://github.com/Snowball-labbot/Portfolio-OS/blob/b5d525494bb212c1cbacfe71656d4eba22b9c2c0/plugins/dsh-portfolio-os/index.js#L192-L241)

超时、restart和dispose没有统一等待进程退出确认。

<details>
<summary>查看原文（50行）</summary>

```text
  async start() {
    if (this.startPromise) return this.startPromise
    this.startPromise = this._start().finally(() => { this.startPromise = undefined })
    return this.startPromise
  }

  async _start() {
    try {
      if (await this._applicationReady()) {
        this._set('ready', '资产投研已就绪')
        return this.snapshot()
      }
      this._set('starting_services', '正在启动本地资产投研 Runtime')
      await this._launch()
      const deadline = Date.now() + this.config.startupTimeoutSeconds * 1_000
      while (Date.now() < deadline) {
        if (await this._applicationReady()) {
          this._set('ready', '资产投研已就绪')
          return this.snapshot()
        }
        if (!this.child && this.phase === 'error') return this.snapshot()
        await delay(500)
      }
      throw new Error('本地 Runtime 启动超时，请查看 PortfolioOS 日志。')
    } catch (error) {
      this._set('error', safeError(error))
      return this.snapshot()
    }
  }

  async restart() {
    if (this.child) {
      this._set('stopping', '正在重启本地 Runtime')
      this.child.kill()
      this.child = undefined
      await delay(800)
    } else if (await this._applicationReady()) {
      this._set('ready', 'Runtime 已在后台运行；页面已重新连接')
      return this.snapshot()
    }
    return this.start()
  }

  dispose() {
    if (!this.config.keepRunningOnExit && this.child) {
      this._set('stopping', '正在停止本地 Runtime')
      this.child.kill()
      this.child = undefined
    }
  }
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-portfolio-os/index.js:37-54](https://github.com/Snowball-labbot/Portfolio-OS/blob/b5d525494bb212c1cbacfe71656d4eba22b9c2c0/plugins/dsh-portfolio-os/index.js#L37-L54)

默认自动启动与退出保留后台。

<details>
<summary>查看原文（18行）</summary>

```text
function normalizeConfig(raw = {}) {
  const port = Math.min(49_999, Math.max(10_240, Number(raw.port) || DEFAULT_PORT))
  const frontendUrl = String(raw.frontendUrl || `http://127.0.0.1:${port}`).trim()
  const healthUrl = String(raw.healthUrl || `${frontendUrl}/api/health`).trim()
  if (!isLoopbackUrl(frontendUrl) || !isLoopbackUrl(healthUrl)) {
    throw new Error('资产投研仅允许使用本机 loopback 地址。')
  }
  return {
    port,
    frontendUrl,
    healthUrl,
    runtimeExecutable: String(raw.runtimeExecutable || '').trim(),
    sourceDir: String(raw.sourceDir || '').trim(),
    pythonExecutable: String(raw.pythonExecutable || 'python').trim(),
    dataDir: String(raw.dataDir || path.join(process.env.LOCALAPPDATA || os.homedir(), 'PortfolioOS')).trim(),
    autoStart: raw.autoStart !== false,
    keepRunningOnExit: raw.keepRunningOnExit !== false,
    startupTimeoutSeconds: Math.min(300, Math.max(20, Number(raw.startupTimeoutSeconds) || 90)),
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-portfolio-os/client.js:282-315](https://github.com/Snowball-labbot/Portfolio-OS/blob/b5d525494bb212c1cbacfe71656d4eba22b9c2c0/plugins/dsh-portfolio-os/client.js#L282-L315)

关闭页面只处理显示、键盘、轮询和frame，不请求stop。

<details>
<summary>查看原文（34行）</summary>

```text
    PortfolioShell.prototype.open = function (trigger) {
      if (this.root.style.display === 'flex') return;
      this.lastTrigger = trigger || document.activeElement;
      this.previousOverflow = document.documentElement.style.overflow;
      document.documentElement.style.overflow = 'hidden';
      if (!this.iframeAppReady) {
        this.resetFrame();
        this.loading.style.display = 'flex';
        this.loading.textContent = '正在启动本地资产投研服务...';
      }
      this.root.style.display = 'flex';
      this.root.setAttribute('aria-hidden', 'false');
      document.addEventListener('keydown', this.onKeyDown);
      this.refresh();
      if (!this.poller) this.poller = setInterval(this.refresh.bind(this), 15000);
    };
    PortfolioShell.prototype.close = function () {
      this.root.style.display = 'none';
      this.root.setAttribute('aria-hidden', 'true');
      document.documentElement.style.overflow = this.previousOverflow;
      document.removeEventListener('keydown', this.onKeyDown);
      if (this.poller) clearInterval(this.poller);
      this.poller = null;
      if (this.lastTrigger && this.lastTrigger.focus) this.lastTrigger.focus();
    };
    PortfolioShell.prototype.onKeyDown = function (event) {
      if (event.key === 'Escape') this.close();
    };
    PortfolioShell.prototype.dispose = function () {
      this.close();
      this.resetFrame();
      window.removeEventListener('message', this.onFrameMessage);
      if (this.root) this.root.remove();
      this.root = null;
```

</details>

**依据 4 · 源码核查**：[marketplace_runtime/launcher.py:13-40](https://github.com/Snowball-labbot/Portfolio-OS/blob/b5d525494bb212c1cbacfe71656d4eba22b9c2c0/marketplace_runtime/launcher.py#L13-L40)

必要依赖的数据目录和SQLite环境，非完整数据安全审计。

<details>
<summary>查看原文（28行）</summary>

```text
def _data_dir(configured: str | None = None) -> Path:
    configured = configured or os.getenv("PORTFOLIO_OS_DATA_DIR")
    base = Path(configured) if configured else Path(os.getenv("LOCALAPPDATA") or Path.home()) / "PortfolioOS"
    base = base.expanduser().resolve()
    for child in ("config", "data", "logs", "backups", "uploads"):
        (base / child).mkdir(parents=True, exist_ok=True)
    return base


def _runtime_config(data_dir: Path) -> dict:
    path = data_dir / "config" / "runtime.json"
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    config = {"schema_version": 1, "session_secret": secrets.token_urlsafe(48)}
    path.write_text(json.dumps(config, indent=2), encoding="utf-8")
    return config


def _configure_environment(port: int, data_dir: Path, config: dict) -> None:
    os.environ["PORTFOLIO_OS_DATA_DIR"] = str(data_dir)
    os.environ["DATABASE_URL"] = f"sqlite:///{(data_dir / 'data' / 'portfolio.db').as_posix()}"
    os.environ["SESSION_SECRET"] = config["session_secret"]
    os.environ["APP_ORIGIN"] = f"http://127.0.0.1:{port}"
    os.environ["SESSION_COOKIE_SECURE"] = "false"
    os.environ["SESSION_COOKIE_SAMESITE"] = "lax"
    os.environ.setdefault("ALLOW_OPEN_REGISTRATION", "true")
    bundle_root = Path(getattr(sys, "_MEIPASS", Path(__file__).resolve().parents[1]))
    os.environ.setdefault("PORTFOLIO_OS_STATIC_DIR", str(bundle_root / "frontend-dist"))
```

</details>

**依据 5 · 源码核查**：[marketplace_runtime/launcher.py:61-63](https://github.com/Snowball-labbot/Portfolio-OS/blob/b5d525494bb212c1cbacfe71656d4eba22b9c2c0/marketplace_runtime/launcher.py#L61-L63)

实际服务绑定127.0.0.1。

```text
    import uvicorn

    uvicorn.run("marketplace_runtime.app:app", host="127.0.0.1", port=args.port, log_level="info", access_log=False)
```

**依据 6 · 源码核查**：[marketplace_runtime/app.py:21-35](https://github.com/Snowball-labbot/Portfolio-OS/blob/b5d525494bb212c1cbacfe71656d4eba22b9c2c0/marketplace_runtime/app.py#L21-L35)

Runtime启动和停止后台scheduler线程。

<details>
<summary>查看原文（15行）</summary>

```text
@app.on_event("startup")
def start_marketplace_scheduler() -> None:
    global scheduler_thread
    if scheduler_thread and scheduler_thread.is_alive():
        return
    stop_scheduler.clear()
    scheduler_thread = Thread(target=run_scheduler, args=(stop_scheduler,), daemon=True, name="portfolio-os-scheduler")
    scheduler_thread.start()


@app.on_event("shutdown")
def stop_marketplace_scheduler() -> None:
    stop_scheduler.set()
    if scheduler_thread:
        scheduler_thread.join(timeout=5)
```

</details>

**依据 7 · 源码核查**：[marketplace_runtime/scheduler.py:45-73](https://github.com/Snowball-labbot/Portfolio-OS/blob/b5d525494bb212c1cbacfe71656d4eba22b9c2c0/marketplace_runtime/scheduler.py#L45-L73)

定期同步和生成入口存在，不能由本地存储推出离线。

<details>
<summary>查看原文（29行）</summary>

```text
def run_scheduler(stop: Event) -> None:
    intervals = {
        "macro": int(os.getenv("RESEARCH_MACRO_INTERVAL_SECONDS", str(6 * 60 * 60))),
        "earnings": int(os.getenv("RESEARCH_EARNINGS_INTERVAL_SECONDS", str(12 * 60 * 60))),
        "sec": int(os.getenv("RESEARCH_SEC_INTERVAL_SECONDS", str(10 * 60))),
        "news": int(os.getenv("RESEARCH_NEWS_INTERVAL_SECONDS", str(60 * 60))),
    }
    jobs = {
        "macro": sync_macro_events,
        "earnings": sync_earnings_events,
        "sec": sync_sec_events,
        "news": sync_research_news,
    }
    next_runs = {name: datetime.min.replace(tzinfo=UTC) for name in jobs}
    next_startup_attempt = datetime.min.replace(tzinfo=UTC)
    last_bedtime_day = None

    while not stop.is_set():
        now = datetime.now(UTC)
        for name, callback in jobs.items():
            if now >= next_runs[name]:
                _run_db_job(name, callback)
                next_runs[name] = now + timedelta(seconds=intervals[name])

        if now >= next_startup_attempt:
            generated = _run_generation("startup", run_startup_generation)
            _run_generation("daily-news", run_daily_news_generation)
            _run_generation("latest-us-close", run_market_close_generation)
            next_startup_attempt = now + (timedelta(days=1) if generated else timedelta(minutes=10))
```

</details>

#### 缺口

- 随包Windows Runtime的版本、内容与目标宿主实际兼容未核验。
  **影响**：源码路径存在不能证明安装后即可运行，尤其package声明DSH<0.2.0。
  **进一步探讨**：在隔离Windows测试profile核对固定tarball清单、可执行文件摘要和目标DSH加载状态。
- 不同失败时序下后台进程、端口和持久数据状态未知。
  **影响**：不能承诺重试不会重叠或退出必停止所有后台活动。
  **进一步探讨**：制造延迟启动、占端口、kill失败与卸载，独立核对进程退出和数据目录。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样在非交易决策场景试用、验收和退出？

**研究主题**：采用判断、效果与总成本、依赖、兼容与流程

#### 完整回答

当前建议观察。这个子插件的价值可以通过“在DSH内打开一份非敏感样本资产记录”来核查，不需要让它管理真实交易或采信AI建议。只在匹配的Windows和宿主范围、独立数据目录中测试固定发行包，先核对实际Runtime身份及版本，再创建虚构账户和样本记录，导出后对照输入字段，确认刷新、关闭、重启与卸载时服务和文件的真实状态。正式身份资料、真实资产备份及API凭据不应作为验证接线所必需输入。

包声明DSH>=0.1.2-rc.1且<0.2.0、Node>=22；这与根README“一装即用”不是同一证据层级。没有Windows Runtime内容、最新宿主接入及生命周期失败实验，尚不足以推荐直接试用真实资产流程。现金成本含本机计算、存储和用户另配API，金额和调用量未知；人工成本含校验发行包、备份、核对进程、数据迁移与排障，耗时没有本次测量。

成功必须同时看到目标应用ready、正确样本持久化和明确退出状态。若health就绪却页面或实例不符、超时后进程仍活动、样本导出不一致，停止导入并回到浏览器独立运行或原记录工具。卸载保留数据是升级便利，也是退出时需要另行备份与处理的责任，不能当成自动清理。此结论只评价适配器工程采用条件，不评价投资策略或预期收益。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-portfolio-os/package.json:14-24](https://github.com/Snowball-labbot/Portfolio-OS/blob/b5d525494bb212c1cbacfe71656d4eba22b9c2c0/plugins/dsh-portfolio-os/package.json#L14-L24)

确切DSH与Node声明范围限制适用环境。

<details>
<summary>查看原文（11行）</summary>

```text
  "dsh": {
    "engines": { "dsh": ">=0.1.2-rc.1 <0.2.0" },
    "bundle": { "patch": "./cordis.patch.yml" },
    "client": {
      "platform": "web",
      "inject": ["@deepseek-ai/dsh-client-connection"]
    }
  },
  "scripts": { "test": "node --test tests/plugin.node.mjs" },
  "engines": { "node": ">=22" },
  "license": "MIT"
```

</details>

**依据 2 · 作者声明**：[plugins/dsh-portfolio-os/README.md:5-12](https://github.com/Snowball-labbot/Portfolio-OS/blob/b5d525494bb212c1cbacfe71656d4eba22b9c2c0/plugins/dsh-portfolio-os/README.md#L5-L12)

作者操作步骤与卸载保留数据声明。

```text
## 使用方式

1. 从 DSH 插件市场安装“资产投研”。
2. 点击 DSH 侧栏的“资产投研”。首次启动会初始化本地 SQLite 数据库。
3. 在右上角“AI API”中配置 Agnes 或其他 OpenAI-compatible API。
4. 在本地注册账号并导入自己的资产备份。

无需 Docker、Python、Node.js 或源代码。数据默认保存在 `%LOCALAPPDATA%\PortfolioOS`，卸载插件不会自动删除用户数据。
```

**依据 3 · 源码核查**：[plugins/dsh-portfolio-os/index.js:124-139](https://github.com/Snowball-labbot/Portfolio-OS/blob/b5d525494bb212c1cbacfe71656d4eba22b9c2c0/plugins/dsh-portfolio-os/index.js#L124-L139)

就绪只对应健康响应，非持久化和业务验收。

<details>
<summary>查看原文（16行）</summary>

```text
  async _applicationReady() {
    try {
      const response = await this.fetch(this.config.healthUrl, { signal: AbortSignal.timeout(3_000) })
      if (!response.ok) return false
      const payload = await response.json()
      return payload?.ok === true
    } catch {
      return false
    }
  }

  async checkStatus() {
    if (await this._applicationReady()) {
      this._set('ready', '资产投研已就绪')
    } else if (this.phase === 'ready') {
      this._set('error', '本地 Runtime 已停止；资产数据仍保存在本机。')
```

</details>

**依据 4 · 源码核查**：[plugins/dsh-portfolio-os/index.js:235-240](https://github.com/Snowball-labbot/Portfolio-OS/blob/b5d525494bb212c1cbacfe71656d4eba22b9c2c0/plugins/dsh-portfolio-os/index.js#L235-L240)

dispose仅在显式不保留且child存在时发送kill。

```text
  dispose() {
    if (!this.config.keepRunningOnExit && this.child) {
      this._set('stopping', '正在停止本地 Runtime')
      this.child.kill()
      this.child = undefined
    }
```

#### 缺口

- 同条件安装成功率、样本持久化完整性与部署净节省未知。
  **影响**：无法声称安装免负担或带来可靠业务收益。
  **进一步探讨**：用隔离发行包记录完整首次启动、失败恢复和退出投入，与独立浏览器运行同一应用对照。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否让数据时点和结果出处随回答交付？

**研究主题**：新假设与验证

#### 完整回答

入口核查表明没有模型回答交付路径，不能把“结果出处随回答”假设当成当前插件功能。与其增加不存在的回答协议，本轮更有依据的未验证方向是让health和iframe-ready携带同一实例ID、应用版本及数据目录标识，并让Host在重启和退出时等待可核对的进程结束。推导来自Q02的布尔健康响应和Q03的超时、重启、保留后台差异。它改变的是就绪与生命周期契约，而不是资产建议生成质量。

最小实验在相同端口预置一个只返回ok:true的无关服务，分别比较现机制与身份绑定机制；再延迟启动、阻止退出、从已有后台重连。记录误判ready、错误重启对象、重复子进程和用户排障时间。若身份协议仍不能让Host和frame确认同一实例，或退出等待只增加延迟却不能确定结果，就应否定该设计。敏感目录路径可用不可逆标识，不应为了诊断把真实个人路径直接发给不相关方。此设计未实现，也没有运行结果，不计入当前插件贡献。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-portfolio-os/index.js:124-129](https://github.com/Snowball-labbot/Portfolio-OS/blob/b5d525494bb212c1cbacfe71656d4eba22b9c2c0/plugins/dsh-portfolio-os/index.js#L124-L129)

当前健康响应仅ok布尔。

```text
  async _applicationReady() {
    try {
      const response = await this.fetch(this.config.healthUrl, { signal: AbortSignal.timeout(3_000) })
      if (!response.ok) return false
      const payload = await response.json()
      return payload?.ok === true
```

**依据 2 · 源码核查**：[plugins/dsh-portfolio-os/client.js:210-220](https://github.com/Snowball-labbot/Portfolio-OS/blob/b5d525494bb212c1cbacfe71656d4eba22b9c2c0/plugins/dsh-portfolio-os/client.js#L210-L220)

应用ready事件只表明当前frame的消息，未绑定Host实例身份。

<details>
<summary>查看原文（11行）</summary>

```text
    PortfolioShell.prototype.onFrameMessage = function (event) {
      if (!this.iframe || event.source !== this.iframe.contentWindow) return;
      if (this.frameOrigin && event.origin !== this.frameOrigin) return;
      var data = event.data;
      if (!data || typeof data !== 'object') return;
      if (data.type === 'portfolio-os-ready') {
        this.iframeAppReady = true;
        this.root.setAttribute('data-frame-phase', 'ready');
        this.loading.style.display = 'none';
        if (this.iframeLoadTimer) clearTimeout(this.iframeLoadTimer);
        this.iframeLoadTimer = null;
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-portfolio-os/index.js:222-240](https://github.com/Snowball-labbot/Portfolio-OS/blob/b5d525494bb212c1cbacfe71656d4eba22b9c2c0/plugins/dsh-portfolio-os/index.js#L222-L240)

重启和退出没有可验证的完整退出握手。

<details>
<summary>查看原文（19行）</summary>

```text
  async restart() {
    if (this.child) {
      this._set('stopping', '正在重启本地 Runtime')
      this.child.kill()
      this.child = undefined
      await delay(800)
    } else if (await this._applicationReady()) {
      this._set('ready', 'Runtime 已在后台运行；页面已重新连接')
      return this.snapshot()
    }
    return this.start()
  }

  dispose() {
    if (!this.config.keepRunningOnExit && this.child) {
      this._set('stopping', '正在停止本地 Runtime')
      this.child.kill()
      this.child = undefined
    }
```

</details>

#### 缺口

- 实例身份和退出握手能否降低真实误判未知。
  **影响**：不能把工程设计设想当已有可靠性保证。
  **进一步探讨**：按本题占端口与失败时序对照测量误判和负担。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
