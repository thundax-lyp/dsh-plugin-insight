# Martty

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[b4dbfa0](https://github.com/openma-ai/Martty/tree/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/npm)

<!-- BEGIN META -->
[![GitHub ★ 81](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=81&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/openma-ai/Martty) [![npm 30d 1,981](https://img.shields.io/static/v1?label=npm+30d&message=1%2C981&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/martty) [![最新发布 2026-10-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-17&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/martty)
<!-- END META -->

> **功能**：提供Martty原生painter启动、DSH插件入口、ACP会话连接池及Harness安装管理的npm子包。

> **亮点**：[Q03](#research-q03) owner绑定/请求映射和[Q02](#research-q02) 安装取消清理是实质接线；best-effort配置不等强会话策略。

> **主要限制**：[Q03](#research-q03) 配置重assert失败仍可发送prompt；关闭本地pool非远端强停止。[Q04](#research-q04) 动态JS及包安装需信任。

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
  - [Q01 · npm子包提供哪种交付与启动路径？](#detail-section-11)
  - [Q02 · 二进制选择/下载、profile迁移与DSH启动怎样处理失败？](#detail-section-12)
  - [Q03 · ACP连接、切Harness与会话生命周期如何隔离？](#detail-section-13)
  - [Q04 · 插件运行与持久配置有哪些权限副作用成本？](#detail-section-14)
  - [Q05 · 适合何用，迁移价值和验证标准是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) npm/DSH终端用户需要知道实际启动的painter、agent与profile，并能保存/移除配方。

手工下载Rust客户端、配agent命令与脚本管理配置；子包集中分发和连接，而非新的推理服务。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 启动与DSH接入 | 选择平台painter及profile/agent/bundled路径 | 兼容回退须核实际notice |
| ACP会话路由 | session绑定owner和请求id映射 | 非租户隔离，配置重assert为best effort |
| Harness准备安装 | binary临时安装或npx/uvx准备 | 可选sha256，包准备有代码信任成本 |
| 安装取消与移除 | 停止下载/进程树、预览私有/共享资源 | 清理失败显式；不等停止活动agent |
| Client插件组合 | 主题/命令/槽和动态贡献生命周期 | 可信JS，不回滚已发生Host副作用 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=22.19与平台painter | 必需 | CLI及Cordis/Rust组合 | optional包缺失明确报错，env覆盖缺失会警告回退 |
| DSH或其他可信ACP agent | 非demo必需 | 模型工具执行 | 版本过低可能回bundled，需核notice |
| 网络/包管理器/提取器 | 新Harness安装需 | binary或npx/uvx准备 | 安装不等认证，失败查清理 |
| settings与会话目录 | 持久化需 | 配方、主题与恢复 | 不要删共享缓存当退出 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 核启动 | demo后选固定Harness/profile | 确认实际binary/agent和fallback notice |
| 核会话 | 两会话切默认、拒配置再发prompt | best-effort失败不当强策略 |
| 核安装取消 | 隔离目录下载/prepare并中断 | 清临时与共享资源保留分别检查 |
| 退出移除 | 先核在途工具，保设置并看移除预览 | pool SIGTERM非完成收据，失败回原CLI |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 平台包/Node/agent与网络资源 | 核版本路径、TTY、配方和凭据 | 金额/工时未测 |
| 持续 | Node/Rust/agent进程与模型tokens | 管理配置和可信插件 | 不改变供应商账单 |
| 失败 | 重装下载/重连和部分文件清理 | 查fallback、stderr、配置与活动工具 | 部分清理可失败，不盲删共享缓存 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 启动接入 | 实际分流profile/agent/bundled | 真实兼容矩阵与安装收益未知 |
| 会话路由 | owner命名空间与请求映射 | 配置拒绝后仍可能旧状态执行 |
| 生命周期管理 | 临时安装、取消等待与移除预览 | 供应链信任/真实清理效果未验 |

> **思考**：[Q03](#research-q03) 配置重assert失败仍可发送prompt；关闭本地pool非远端强停止。[Q04](#research-q04) 动态JS及包安装需信任。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q03](#research-q03) owner绑定/请求映射和[Q02](#research-q02) 安装取消清理是实质接线；best-effort配置不等强会话策略。

[Q02](#research-q02) 下载清理和分发层与[Q03](#research-q03) owner路由可复用；强配置/远端停止需要独立协议。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 配置重assert失败仍可发送prompt；关闭本地pool非远端强停止。[Q04](#research-q04) 动态JS及包安装需信任。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 观察可信单Harness启动并做双会话/拒配置/安装取消测试，失败保设置回原CLI。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定子包核心启动、连接池、下载/安装/移除与动态Client接线静态核查；未安装/启动/调用agent。

- 已检查：作者 README、包清单、源码路径 npm/package.json、npm/lib/index.js、npm/bin/martty.js、npm/lib/dsh-launch.js、npm/lib/spawn-tui.js、npm/lib/boot.js、npm/lib/harness-registry.js、npm/lib/download.js、npm/lib/harness-package.js、npm/lib/acp-client.js、npm/lib/acp-agent-pool.js、npm/lib/client-run.js、npm/lib/inspect.js、npm/lib/harness-removal.js 及固定范围 inventory；组件：npm。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定npm bin、painter选择、boot设置、dsh-launch、ACP client/pool、下载/代表安装移除及dynamic Client生命周期；未穷举所有registry归档/Host能力/平台。
- 下一步：固定b4dbfa05a049e0cd9410435c1e98bd29446cac3c的npm组件只读；未安装、下载外部包、启动原生/agent或运行测试。真实兼容、清理和收益未知。

**分析版本**

- **仓库**：[openma-ai/Martty](https://github.com/openma-ai/Martty)
- **版本号**：0.3.3（[固定提交 b4dbfa0](https://github.com/openma-ai/Martty/tree/b4dbfa05a049e0cd9410435c1e98bd29446cac3c)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 配置收敛收据门禁未实现，以拒绝/迟到回执下错模型和额外阻塞证伪。

固定b4dbfa05a049e0cd9410435c1e98bd29446cac3c的npm组件只读；未安装、下载外部包、启动原生/agent或运行测试。真实兼容、清理和收益未知。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 65 | 13757 | 11759 | 1111 | — |
| .md | source | 2 | 570 | — | — | 4586 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/openma-ai/Martty/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：npm使用者能否完成可信平台启动、连接正确ACP Harness并管理其安装与生命周期？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · npm子包提供哪种交付与启动路径？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

npm martty 0.3.3面向希望用npm分发原生终端客户端、或在DSH profile里加载TUI的开发者。bin martty-cli解析harness子命令、demo、--dsh及agent参数；普通路线选择原生painter再bootClient建独立Cordis Client树。主导出lib/index.js是name/inject/apply的dsh-tui-shell，package.dsh.bundle指向cordis.patch，因此子包是实际原生DSH插件与CLI双入口，不只是根Rust应用源码。

--dsh profile会查全局dsh版本和profile依赖：profile带Martty则交终端给dsh启动Host/runner；只有ACP bundle则作为本Client的agent命令；低于依赖门槛会提示并回退bundled，新于测试上限仅警告继续。明确指定全局环境不一定实际使用它，用户必须看notice，缺dsh或缺profile则报错。基线是手工装Rust二进制、拼ACP命令/配置，增量是平台包、启动兼容检查、Harness管理与Cordis组合。合格是知道实际二进制、Host/Client拓扑、agent recipe和配置目录，不仅进了界面。

#### 证据与依据

**依据 1 · 源码核查**：[npm/package.json:1-30](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/npm/package.json#L1-L30)

CLI与主导出。

<details>
<summary>查看原文（30行）</summary>

```text
{
  "name": "martty",
  "version": "0.3.3",
  "description": "Terminal-native ACP client UI; Cordis client tree, any ACP agent",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/openma-ai/Martty.git"
  },
  "homepage": "https://martty.sh",
  "bugs": {
    "url": "https://github.com/openma-ai/Martty/issues"
  },
  "type": "module",
  "main": "lib/index.js",
  "scripts": {
    "test:harness-ui": "node --test ../scripts/harness-management-tui.test.mjs ../scripts/harness-session-tui.test.mjs",
    "pretest": "node --test ../scripts/workflow-release.test.mjs ../scripts/package-alias.test.mjs ../scripts/harness-removal.test.mjs",
    "test": "node --test ../scripts/download.test.mjs ../scripts/package-native.test.mjs ../scripts/check-release-tag.test.mjs ../scripts/release-check.test.mjs ../scripts/check-static-elf.test.mjs ../scripts/smoke-old-linux.test.mjs ../scripts/cargo-guard.test.mjs ../scripts/build-npm.test.mjs ../scripts/client-profile.test.mjs ../scripts/plugin-runner.test.mjs ../scripts/profile-link-resolution.test.mjs ../scripts/packaged-acp-permission.test.mjs ../scripts/profile-smoke-tui.test.mjs ../scripts/release.test.mjs ../scripts/jsonrpc-line-transport.test.mjs ../scripts/tui-theme.test.mjs ../scripts/tui-presets.test.mjs ../scripts/tui-plugin-store.test.mjs ../scripts/tui-local-plugins.test.mjs ../scripts/tui-client-plugin-registry.test.mjs ../scripts/tui-slots.test.mjs ../scripts/tui-commands.test.mjs ../scripts/tui-overlay.test.mjs ../scripts/tui-agents.test.mjs ../scripts/tui-queue.test.mjs ../scripts/mux.test.mjs ../scripts/acp-client.test.mjs ../scripts/acp-agent-pool.test.mjs ../scripts/harnesses.test.mjs ../scripts/harness-discovery.test.mjs ../scripts/harness-discovery-scenario.test.mjs ../scripts/harness-view.test.mjs ../scripts/harness-onboarding.test.mjs ../scripts/harness-registry.test.mjs ../scripts/harness-badge.test.mjs ../scripts/harness-package.test.mjs ../scripts/acp-client-events.test.mjs ../scripts/acp-session-config.test.mjs ../scripts/acp-session-plan.test.mjs ../scripts/acp-session-stats.test.mjs ../scripts/acp-session-status.test.mjs ../scripts/agents-view.test.mjs ../scripts/plan-view.test.mjs ../scripts/queue-view.test.mjs ../scripts/stats-view.test.mjs ../scripts/status-view.test.mjs ../scripts/deepseek-logo.test.mjs ../scripts/runner.test.mjs ../scripts/inspect.test.mjs ../scripts/creator-overlay.test.mjs ../scripts/dsh-launch.test.mjs ../scripts/host-notice.test.mjs ../scripts/install-migration.test.mjs ../scripts/global-install-collision.test.mjs ../scripts/real-agent-e2e.test.mjs",
    "test:profile-install-matrix": "node --test ../scripts/profile-install-matrix.test.mjs"
  },
  "publishConfig": {
    "access": "public",
    "tag": "latest"
  },
  "exports": {
    ".": "./lib/index.js",
    "./ember": "./lib/ember.js",
    "./theme": "./lib/tui-theme.js",
    "./presets": "./lib/tui-presets.js",
```

</details>

**依据 2 · 源码核查**：[npm/lib/index.js:1-24](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/npm/lib/index.js#L1-L24)

真实插件导出及注入。

<details>
<summary>查看原文（24行）</summary>

```text
/**
 * TUI shell Cordis plugin: spawn the native painter and mux ACP + palettes.
 *
 * Injects `acpClient`, `acpSessionConfig`, the TUI registries, and the sibling
 * `tuiCordisClientRunner`.
 * The shell owns the native painter and only binds transport; it does not
 * evaluate dynamic Client code. Does not import dsh or dsh-acp.
 *
 *     dsh-tui --agent dsh-acp
 *     dsh-tui --agent dsh --agent-arg --profile --agent-arg acp
 */

import { nativeBinary, spawnPluginTui } from './spawn-tui.js'
import { CORDIS_METHODS } from './cordis-protocol.js'
import { muxAcpAndCompositor } from './mux.js'

export const name = 'dsh-tui-shell'
export const inject = [
  'acpClient', 'tuiTheme', 'tuiPresets', 'tuiSlots', 'tuiCommands', 'tuiOverlay',
  'acpClientEvents', 'acpSessionConfig', 'tuiQueue', 'tuiAgents', 'tuiCordisClientRunner',
]

const shellStateKey = Symbol.for('@openma/deepseek-harness-tui/shell-state')

```

</details>

**依据 3 · 源码核查**：[npm/bin/martty.js:89-119](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/npm/bin/martty.js#L89-L119)

启动参数与profile路径。

<details>
<summary>查看原文（31行）</summary>

```text
}

// Validate startup arguments before resolving the native painter. A source
// checkout must report the same usage errors as an installed package.
let parsed
let dshNotice
if (!wantHelp && !wantVersion && !wantDemo && !wantDemoSkin) {
  let dshPlan
  try {
    // `--dsh <profile>` attaches to the global dsh. Its version is checked
    // before anything spawns: below a floor, Martty keeps its bundled
    // harness and says why in the TUI; newer than tested only warns.
    const { profile, rest } = takeDshFlag(argv)
    if (profile !== null) dshPlan = planDshLaunch(profile, rest)
    parsed = parseClientArgv(rest)
    if (dshPlan?.mode === 'agent') parsed = { ...parsed, agent: dshPlan.agent }
    if (dshPlan?.mode === 'bundled') console.error(`martty: ${dshPlan.notice.text}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(message.startsWith('martty:') ? message : `martty: ${message}`)
    process.exit(Number.isInteger(error?.exitCode) ? error.exitCode : 1)
  }
  dshNotice = dshPlan?.notice
  if (dshPlan?.mode === 'profile') {
    // The profile carries Martty itself: dsh boots its Host tree and the
    // profile's runner starts the TUI on this terminal.
    process.exit(runDshProfile(dshPlan))
  }
}

if (configuredBin && !fs.existsSync(configuredBin)) {
```

</details>

**依据 4 · 源码核查**：[npm/lib/dsh-launch.js:157-192](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/npm/lib/dsh-launch.js#L157-L192)

实际profile/agent/bundled分流。

<details>
<summary>查看原文（36行）</summary>

```text
    `--dsh ${profile}: the global dsh ${dsh.version} is not supported (${needs}), so Martty is using its bundled harness.`,
    `Install a supported dsh (${INSTALL_HINT}) or update the profile: dsh plugin --profile ${profile} update`,
  ].join('\n')
}

export function untestedNotice(dsh) {
  return `The global dsh ${dsh.version} is newer than the newest dsh Martty was tested with (${TESTED_DSH_THROUGH}); continuing.`
}

/**
 * Resolve `--dsh <profile>`:
 * - `profile`: hand the terminal to `dsh --profile <name>` (the profile carries Martty);
 * - `agent`: spawn `dsh --profile <name>` as this Client's ACP agent;
 * - `bundled`: the global dsh is below a floor — keep the bundled harness and
 *   show `notice` in the TUI.
 * Missing dsh / missing profile still fail with a message: there is nothing
 * to attach to and the user named it explicitly.
 * @returns {{ mode: 'profile', command: string, args: string[], warning?: string }
 *   | { mode: 'agent', agent: { command: string, args: string[] }, notice?: { text: string, level: 'info' } }
 *   | { mode: 'bundled', notice: { text: string, level: 'warn' } }}
 */
export function planDshLaunch(profile, appArgs, options = {}) {
  const dsh = resolveGlobalDsh(options)
  const { mode, requirements } = inspectDshProfile(profile, dsh.version, options)
  if (requirements.some((requirement) => !requirement.supported)) {
    return { mode: 'bundled', notice: { text: fallbackNotice(profile, dsh, requirements), level: 'warn' } }
  }
  const untested = isUntested(dsh.version) ? untestedNotice(dsh) : undefined
  if (mode === 'profile') {
    return {
      mode, command: dsh.command, args: ['--profile', profile, ...appArgs],
      ...(untested ? { warning: `martty: ${untested}` } : {}),
    }
  }
  return {
    mode, agent: { command: dsh.command, args: ['--profile', profile] },
```

</details>

#### 缺口

- 真实profile兼容与首次安装体验未知
  **影响**：不能把版本通过或界面启动当agent正确绑定
  **进一步探讨**：固定一profile核进程命令、notice、实际agent版本和空会话

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 二进制选择/下载、profile迁移与DSH启动怎样处理失败？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

nativeBinary按环境覆盖、开发debug、可选平台包、vendor次序取第一个存在文件；平台key为platform-arch。没有painter则明确要求optional dependencies或源码构建，并非启动时偷偷下载Rust。bin对指定覆盖文件不存在打印告警后回退已装二进制，不能按注释“never silently fall back”误读为拒绝；存在检查不等可执行，spawn错误另输出诊断。settings默认MARTTY_HOME相关settings.json，legacy仅目标不存在时COPYFILE_EXCL迁移，损坏/竞态不阻启动，不保证所有旧配置语义兼容。

Harness binary安装另走registry：下载到同父目录临时.install，限制512MiB，有sha256才校hash，缺该字段不等已校验；提取有10分钟deadline和abort，核期望命令可执行后rename到版本/平台目录，finally清临时。已存在可执行安装直接复用，未全量审归档验证/签名与registry信任，不称供应链安全。download支持HTTP/HTTPS、连接30秒/空闲60秒，无总时限，持续慢速可长期占用；abort等待stop/文件句柄关闭再删部分文件，cleanup失败显式报错。

npx/uvx“prepare”只预热包环境并不调用ACP入口，但包管理器本身可以安装/运行依赖构建，非无代码副作用；有独立超时与取消进程树。安装完成也不认证、不代表agent服务能工作。

#### 证据与依据

**依据 1 · 源码核查**：[npm/lib/spawn-tui.js:16-60](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/npm/lib/spawn-tui.js#L16-L60)

原生二进制优先级及缺失错误。

<details>
<summary>查看原文（45行）</summary>

```text
const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** Select the first existing native painter in development-to-release order. */
export function selectNativeBinary({ envBin, devBin, optionalBin, packagedBin }) {
  for (const candidate of [envBin, devBin, optionalBin, packagedBin]) {
    if (typeof candidate === 'string' && candidate.length > 0 && fs.existsSync(candidate)) {
      return candidate
    }
  }
  return undefined
}

/**
 * Installed optional platform binary, or the local development binary.
 * Honors `MARTTY_BIN`, with `DSH_TUI_BIN` as a compatibility fallback.
 * @param {{ packageRoot?: string, platform?: string, arch?: string, envBin?: string | null, devBin?: string | null }} [options]
 * @returns {string}
 */
export function nativeBinary(options = {}) {
  const packageRoot = options.packageRoot ?? path.join(__dirname, '..')
  const platform = options.platform ?? process.platform
  const arch = options.arch ?? process.arch
  const key = `${platform}-${arch}`
  const exe = platform === 'win32' ? 'martty.exe' : 'martty'
  const packageName = `@openma/martty-${key}`
  const req = createRequire(path.join(packageRoot, 'package.json'))
  let optionalBin
  try { optionalBin = req.resolve(`${packageName}/bin/${exe}`) }
  catch (error) {
    if (error?.code !== 'MODULE_NOT_FOUND' && error?.code !== 'ERR_PACKAGE_PATH_NOT_EXPORTED') throw error
  }
  const envBin = options.envBin === undefined
    ? process.env.MARTTY_BIN || process.env.DSH_TUI_BIN : options.envBin
  const devBin = options.devBin === undefined
    ? path.join(packageRoot, '..', 'target', 'debug', exe) : options.devBin
  const packagedBin = path.join(packageRoot, 'vendor', key, exe)
  const selected = selectNativeBinary({ envBin, devBin, optionalBin, packagedBin })
  if (selected === undefined) {
    throw new Error(
      `Martty native package ${packageName} is missing for ${key}; reinstall Martty with optional dependencies`
      + ' (npm install --include=optional). From source, build with scripts/build-npm.sh.',
    )
  }
  return selected
}
```

</details>

**依据 2 · 源码核查**：[npm/bin/martty.js:121-145](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/npm/bin/martty.js#L121-L145)

覆盖缺失告警与spawn失败。

<details>
<summary>查看原文（25行）</summary>

```text
  // own build (devlocalinstall.sh has caught this confusion before).
  console.error(
    `martty: ${configuredBin} (from ${process.env.MARTTY_BIN ? 'MARTTY_BIN' : 'DSH_TUI_BIN'})`
      + ' does not exist — falling back to the installed native binary',
  )
}
let binaryPath
try {
  binaryPath = nativeBinary({ envBin: configuredBin && fs.existsSync(configuredBin) ? configuredBin : null })
} catch (error) {
  console.error(`martty: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
}

function exitFromSpawn(result) {
  if (result.error) {
    // A failed spawn (ENOENT, EACCES) sets status/signal to null; without
    // a diagnostic the process would just exit 1 with no explanation.
    console.error('martty: failed to launch the native binary: ' + result.error.message)
  }
  process.exit(
    result.status
      ?? (result.signal === 'SIGINT' ? 130 : result.signal === 'SIGTERM' ? 143 : 1),
  )
}
```

</details>

**依据 3 · 源码核查**：[npm/lib/boot.js:279-314](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/npm/lib/boot.js#L279-L314)

设置路径与独占旧配置复制。

<details>
<summary>查看原文（36行）</summary>

```text
export function uiSettingsPath(extraArgs = [], env = process.env, userHome = homedir()) {
  for (let index = 0; index < extraArgs.length; index += 1) {
    if (extraArgs[index] === '--session-root' && typeof extraArgs[index + 1] === 'string') {
      return path.join(extraArgs[index + 1], 'settings.json')
    }
  }
  return path.join(marttyHome(env, userHome), 'settings.json')
}

export function legacyUiSettingsPaths(extraArgs = [], userHome = homedir()) {
  const paths = []
  for (let index = 0; index < extraArgs.length; index += 1) {
    if (extraArgs[index] === '--session-root' && typeof extraArgs[index + 1] === 'string') {
      paths.push(path.join(extraArgs[index + 1], 'dsh-tui-settings.json'))
      break
    }
  }
  paths.push(path.join(userHome, '.dsh-tui', 'sessions', 'dsh-tui-settings.json'))
  return [...new Set(paths)]
}

export function migrateLegacyUiSettings(settingsPath, legacyPaths) {
  if (existsSync(settingsPath)) return false
  for (const legacyPath of legacyPaths) {
    if (!existsSync(legacyPath)) continue
    try {
      const value = JSON.parse(readFileSync(legacyPath, 'utf8'))
      if (value === null || typeof value !== 'object' || Array.isArray(value)) continue
      mkdirSync(path.dirname(settingsPath), { recursive: true })
      copyFileSync(legacyPath, settingsPath, constants.COPYFILE_EXCL)
      return true
    } catch {
      // A malformed or racing legacy file must not block TUI startup.
    }
  }
  return false
```

</details>

**依据 4 · 源码核查**：[npm/lib/harness-registry.js:402-480](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/npm/lib/harness-registry.js#L402-L480)

临时安装、可选hash、提取与rename。

<details>
<summary>查看原文（79行）</summary>

```text
  const commandParts = relativeCommand(distribution.command)
  const installRoot = options.installRoot ?? path.join(path.dirname(options.settingsPath), 'bin')
  const installDir = path.join(installRoot, id, version, target)
  const installedCommand = containedPath(installDir, commandParts)
  if (executable(installedCommand)) {
    options.onProgress?.({ phase: 'complete' })
    return {
      id: entry.id,
      label: entry.label,
      command: installedCommand,
      args: [...distribution.args],
      env: { ...distribution.env },
    }
  }
  if (existsSync(installDir)) {
    throw new Error(`incomplete binary installation already exists at ${installDir}`)
  }

  const suffix = archiveSuffix(distribution.archive)
  const parent = path.dirname(installDir)
  mkdirSync(parent, { recursive: true })
  const temporary = mkdtempSync(path.join(parent, '.install-'))
  try {
    const archivePath = path.join(temporary, `download${suffix}`)
    await (options.downloadFile ?? downloadFile)(distribution.archive, archivePath, {
      signal: options.signal,
      onProgress: options.onProgress,
      connectTimeoutMs: options.connectTimeoutMs ?? options.timeoutMs ?? 30_000,
      idleTimeoutMs: options.idleTimeoutMs ?? options.timeoutMs ?? 60_000,
      maxBytes: MAX_ARCHIVE_BYTES,
    })
    options.signal?.throwIfAborted()
    // Validate independently of the transport before trusting an archive.
    if (statSync(archivePath).size > MAX_ARCHIVE_BYTES) throw new Error('binary archive is larger than 512 MiB')
    if (typeof distribution.sha256 === 'string') {
      const hash = createHash('sha256')
      for await (const chunk of createReadStream(archivePath, { signal: options.signal })) hash.update(chunk)
      const actual = hash.digest('hex')
      if (actual !== distribution.sha256.toLowerCase()) {
        throw new Error(`binary checksum mismatch: expected ${distribution.sha256}, received ${actual}`)
      }
    }

    const extracted = path.join(temporary, 'payload')
    mkdirSync(extracted)
    // Archive inspection and extraction share a ten-minute default deadline;
    // callers can override it, and cancellation still interrupts the extractor.
    const extraction = timeoutSignal(options.extractTimeoutMs ?? 10 * 60_000, options.signal, 'binary extraction')
    try {
      options.onProgress?.({ phase: 'extract' })
      extraction.signal.throwIfAborted()
      if (options.extractArchive !== undefined) {
        await abortable(options.extractArchive(archivePath, extracted, distribution.archive, {
          signal: extraction.signal,
        }), extraction.signal)
      } else {
        // The native extractor waits for the terminated child to close before
        // cleanup, including on Windows where open files cannot be removed.
        await defaultExtractArchive(archivePath, extracted, distribution.archive, { signal: extraction.signal })
      }
      options.onProgress?.({ phase: 'verify' })
      extraction.signal.throwIfAborted()
      const extractedCommand = containedPath(extracted, commandParts)
      if (!existsSync(extractedCommand)) {
        throw new Error(`binary archive does not contain ${distribution.command}`)
      }
      if (process.platform !== 'win32') chmodSync(extractedCommand, 0o755)
      if (!executable(extractedCommand)) throw new Error('binary command is not an executable file')
      renameSync(extracted, installDir)
    } catch (error) {
      if (extraction.signal.aborted) throw extraction.signal.reason
      throw error
    } finally {
      extraction.cancel()
    }
  } finally {
    rmSync(temporary, { recursive: true, force: true })
  }
  options.onProgress?.({ phase: 'complete' })
```

</details>

**依据 5 · 源码核查**：[npm/lib/download.js:46-112](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/npm/lib/download.js#L46-L112)

下载预算与停止清理。

<details>
<summary>查看原文（67行）</summary>

```text
  const label = options.label ?? 'binary download'
  const cancelled = () => Object.assign(new Error(`${label} cancelled`), { name: 'AbortError' })
  if (options.signal?.aborted) throw cancelled()
  url = httpUrl(url)
  const filePath = path.resolve(destination)
  // This adapter owns only a new staging file, never a pre-existing user file.
  try {
    lstatSync(filePath)
    throw new Error(`download destination already exists: ${filePath}`)
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
  const connectTimeoutMs = options.connectTimeoutMs ?? 30_000
  const idleTimeoutMs = options.idleTimeoutMs ?? 60_000
  const maxBytes = options.maxBytes ?? 512 * 1024 * 1024
  const request = new AbortController()
  const downloader = new ArchiveDownloader(url, path.dirname(filePath), {
    fileName: path.basename(filePath),
    override: true,
    // The panel owns retry. SDK retry/resume can otherwise outlive cancellation.
    retry: false,
    resumeOnIncomplete: false,
    resumeIfFileExists: false,
    forceResume: false,
    removeOnStop: false,
    removeOnFail: false,
    httpRequestOptions: { signal: request.signal },
    httpsRequestOptions: { signal: request.signal },
  })

  return new Promise((resolve, reject) => {
    let state = 'running'
    let phase = 'connecting'
    let receivedBytes = 0
    let totalBytes
    let timer
    const cleanListeners = () => {
      clearTimeout(timer)
      options.signal?.removeEventListener('abort', onAbort)
    }
    const fail = (error) => {
      if (state !== 'running') return
      state = 'stopping'
      cleanListeners()
      request.abort(error)
      // SDK emits "download" before finishing stream setup. Let that setup
      // finish, then await closed handles before removing a partial file (Windows).
      void Promise.resolve().then(async () => {
        try {
          await downloader.stop()
          await rm(filePath, { force: true })
        } catch (cleanupError) {
          reject(new Error(`${error.message}; download cleanup failed: ${cleanupError.message}`, { cause: error }))
          return
        }
        reject(error)
      })
    }
    const onAbort = () => fail(cancelled())
    const resetTimer = () => {
      clearTimeout(timer)
      if (state !== 'running') return
      const duration = phase === 'connecting' ? connectTimeoutMs : idleTimeoutMs
      timer = setTimeout(() => fail(new Error(
        `${label} timed out (${phase} for ${duration}ms; received ${receivedBytes} bytes)`,
      )), duration)
    }
```

</details>

**依据 6 · 源码核查**：[npm/lib/harness-package.js:104-125](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/npm/lib/harness-package.js#L104-L125)

npx/uvx准备语义。

<details>
<summary>查看原文（22行）</summary>

```text
/**
 * Populate the package runner's cache without invoking the ACP entry point.
 * npm 7+ hashes --package specs exactly as normal npx invocations; stdin is not
 * a TTY, so first install needs no --yes flag. uvx --from builds the same package
 * environment before running Python (including package@version / @latest).
 * This never changes the saved recipe, selects a Harness, or inherits the TTY.
 */
export async function prepareHarnessPackage(entry, options = {}) {
  const distribution = entry?.distribution
  const spec = distribution?.args?.[0]
  if (!['npx', 'uvx'].includes(distribution?.type) || typeof spec !== 'string'
    || !spec.trim() || spec.startsWith('-') || /[\x00-\x1f\x7f]/.test(spec)) {
    throw new Error('Harness package recipe must specify an npx or uvx package')
  }
  if (options.signal?.aborted) throw cancellationError()
  const runner = entry.runner ?? distribution.command ?? distribution.type
  const args = distribution.type === 'npx'
    ? ['--package', spec, '--', process.execPath, '-e', '']
    : ['--from', spec, '--', 'python', '-c', '']
  const progress = (phase, detail) => options.onProgress?.({ phase, detail: safeText(detail) })
  progress('preparing', `Preparing ${entry.label ?? entry.id ?? spec}`)
  if (options.signal?.aborted) throw cancellationError()
```

</details>

#### 缺口

- 平台包供应链、归档全校验与真实故障清理未验
  **影响**：不能承诺安装原子性/来源可信；用户要区分painter和Harness安装
  **进一步探讨**：可丢弃目录核缺包/覆盖缺失/断下载/无hash/安装取消并检查残留

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · ACP连接、切Harness与会话生命周期如何隔离？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

acp-client接受外部config.stream或spawn配置agent，默认dsh-acp；stream由外部Host拥有，不被改default recipe替代。spawn服务复用相同命令/args/env的live连接，否则关闭旧pool并创建新pool；stderr按警告特征呈到dock，消息不等于业务错误完整检测。pool为每recipe建owner，session id命名空间绑定原owner，未知session非setup拒绝；恢复namespaced id找原namespace，没有对应原Harness会报选择原Harness，不把旧会话自动扔给新默认。

session/new在await initialize前捕获recipe，避免切默认抢走在途创建；setDefaultAgent只影响后续新会话。出站重写请求id并按owner.pending映射回，callback也返原owner；_dsh/cordis只有对端协商能力才转发。每prompt前按session记录重assert配置，防部分agent全局模型/effort泄漏，但applySessionConfig是best effort：某set_config_option拒绝时catch→undefined/break，随后configChain仍写prompt。因此不能承诺配置拒绝后绝不会用旧模型/权限继续；需要用户核实际状态，尤其跨session共享同一agent进程。

close给各owner pending合成失败、SIGTERM子进程、清回调并销毁本地流；未等待全部agent树退出/外部副作用终止。断连接或本地关闭不是远端调用取消收据，更不等租户隔离；同一用户多会话的路由隔离不能拿来证明跨账号凭据/账目隔离。

#### 证据与依据

**依据 1 · 源码核查**：[npm/lib/acp-client.js:74-125](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/npm/lib/acp-client.js#L74-L125)

stream/spawn复用与pool替换。

<details>
<summary>查看原文（52行）</summary>

```text
  events.register(sessionPlan)
  events.register(sessionStats)
  if (config.stream !== undefined && config.stream !== null) {
    const service = {
      kind: 'stream',
      stdin: config.stream.stdin,
      stdout: config.stream.stdout,
      child: config.stream.child,
    }
    provide(ctx, service)
    return
  }
  const agent = resolveAgent(config)
  if (
    liveAgent !== null
    && liveAgent.child.exitCode === null
    && !liveAgent.child.killed
    && !liveAgent.stdin.destroyed
    && liveAgent.command === agent.command
    && JSON.stringify(liveAgent.args) === JSON.stringify(agent.args ?? [])
    && JSON.stringify(liveAgent.env ?? {}) === JSON.stringify(agent.env ?? {})
  ) {
    provide(ctx, liveAgent)
    return
  }
  // A new Client tree owns a new pool; dispose every child of the old tree.
  if (liveAgent !== null) {
    try {
      liveAgent.close()
    } catch {
      // already gone
    }
  }
  liveAgent = null
  const noteAgentDiagnostics = installAgentWarnings(ctx)
  const service = createAgentPool(agent, {
    spawnAgent: (spec) => spawnAgent(spec, noteAgentDiagnostics),
    resolveAgent,
    diagnosticError,
  })
  if (liveAgentExitHook !== null) process.removeListener('exit', liveAgentExitHook)
  liveAgentExitHook = () => service.close()
  process.once('exit', liveAgentExitHook)
  liveAgent = service
  provide(ctx, service)
}

function spawnAgent(agent, onDiagnosticLine) {
  const child = spawn(agent.command, agent.args ?? [], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: harnessEnvironment(agent.env),
  })
```

</details>

**依据 2 · 源码核查**：[npm/lib/acp-agent-pool.js:145-178](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/npm/lib/acp-agent-pool.js#L145-L178)

session配置重assert及失败继续。

<details>
<summary>查看原文（34行）</summary>

```text
  function recordOptions(owner, sessionKey, options) {
    if (typeof sessionKey !== 'string' || !options) return
    const entries = options.map(optionEntry).filter(Boolean)
    if (entries.length === 0) return
    const config = owner.configs.get(sessionKey) ?? new Map()
    for (const [id, value] of entries) {
      config.set(id, value)
      owner.applied.set(id, value)
    }
    owner.configs.set(sessionKey, config)
  }

  /**
   * Re-apply a session's recorded config options the connection no longer
   * holds — one `set_config_option` per drifted option, in recorded order.
   * Best effort: a rejected assert must not block the turn it guarded.
   */
  async function applySessionConfig(owner, sessionKey) {
    const config = owner.configs.get(sessionKey)
    const bound = sessions.get(sessionKey)
    if (!config || !bound || bound.owner !== owner || owner.failed || closed) return
    for (const [configId, value] of config) {
      if (JSON.stringify(owner.applied.get(configId)) === JSON.stringify(value)) continue
      const id = `martty-config-${++nextRequest}`
      const params = { sessionId: bound.raw, configId, value }
      const result = await new Promise((resolve, reject) => {
        owner.pending.set(id, { resolve, reject, method: 'session/set_config_option', params, sessionKey })
        writeAgent(owner, { jsonrpc: '2.0', id, method: 'session/set_config_option', params })
      }).catch(() => undefined)
      if (result === undefined) break // assert failed — keep remaining options eligible
      recordOptions(owner, sessionKey, readConfigOptions(result)
        ?? [{ id: configId, currentValue: value }])
    }
  }
```

</details>

**依据 3 · 源码核查**：[npm/lib/acp-agent-pool.js:242-325](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/npm/lib/acp-agent-pool.js#L242-L325)

原owner、创建捕获和请求转发。

<details>
<summary>查看原文（84行）</summary>

```text
  function ownerFor(message) {
    const sid = message.params?.sessionId ?? message.params?.session_id
    if (typeof sid === 'string') {
      const bound = sessions.get(sid)
      if (bound) return bound.owner
      if (!setupMethods.has(message.method)) throw new Error(`Unknown ACP session: ${sid}`)
      const saved = /^martty:([a-f0-9]{24}):([\s\S]+)$/.exec(sid)
      if (saved) {
        const owner = [...connections.values()].find(owner => owner.namespace === saved[1] && !owner.failed)
          ?? (namespace(defaultAgent) === saved[1] ? connection(defaultAgent) : undefined)
        if (!owner) throw new Error('Select the session’s original Harness before resuming it')
        sessions.set(sid, { owner, raw: saved[2] })
        owner.sessions.set(saved[2], sid)
        return owner
      }
    }
    return context.getStore() ?? active
  }

  async function outgoing(message) {
    if (closed) return
    if (typeof message.method !== 'string') {
      const callback = callbacks.get(message.id)
      if (callback) {
        callbacks.delete(message.id)
        writeAgent(callback.owner, { ...message, id: callback.id })
      }
      return
    }
    let owner
    let params = message.params
    try {
      // Capture the recipe before awaiting initialization. Later default edits
      // cannot retarget a session/new request already in flight.
      if (message.method === 'session/new') {
        owner = authMethods.get(params?._meta?.marttyAuthMethod)?.owner ?? connection(defaultAgent)
        lastSetup = owner
        if (params?._meta?.marttyAuthMethod) {
          params = { ...params, _meta: { ...params._meta } }
          delete params._meta.marttyAuthMethod
        }
        await initialize(owner)
      } else if (message.method === 'initialize') {
        initializeParams = structuredClone(params ?? {})
        owner = active
      } else if (message.method === 'authenticate') {
        const method = authMethods.get(params?.methodId)
        owner = method?.owner ?? lastSetup ?? active
        if (method) params = { ...params, methodId: method.id }
      } else {
        owner = ownerFor(message)
        if (setupMethods.has(message.method)) await initialize(owner)
      }
      if (owner.failed) throw owner.failed
      if (message.method.startsWith('_dsh/cordis/') && readCordisCapability(owner.init) === null) {
        throw new Error('agent has not advertised _dsh/cordis')
      }
      const sessionKey = typeof params?.sessionId === 'string' ? params.sessionId
        : typeof params?.session_id === 'string' ? params.session_id : undefined
      if (params && typeof params === 'object') {
        params = { ...params }
        for (const key of ['sessionId', 'session_id']) {
          const bound = sessions.get(params[key])
          if (bound) params[key] = bound.raw
        }
      }
      const forwarded = { ...message, params }
      if (message.id !== undefined) {
        const id = `martty-client-${++nextRequest}`
        owner.pending.set(id, { id: message.id, method: message.method, params, sessionKey })
        forwarded.id = id
      }
      if (message.method === 'session/prompt' && sessionKey !== undefined) {
        // The prompt lands on stdin only after its session's config options
        // are re-asserted — the chain keeps cross-session order. Registering
        // the pending reply above (never inside the chain) keeps close() able
        // to settle it while an assert is still in flight.
        owner.configChain = owner.configChain.then(async () => {
          // Asserts resolve `undefined` on a failed set_config_option rather
          // than rejecting, so this chain cannot drop the prompt.
          await applySessionConfig(owner, sessionKey)
          if (!closed && !owner.failed) writeAgent(owner, forwarded)
        })
        return
```

</details>

**依据 4 · 源码核查**：[npm/lib/acp-agent-pool.js:345-379](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/npm/lib/acp-agent-pool.js#L345-L379)

改默认及close实际行为。

<details>
<summary>查看原文（35行）</summary>

```text
    get child() { return active.handle.child },
    get command() { return active.spec.command },
    get args() { return active.spec.args ?? [] },
    get env() { return active.spec.env },
    diagnostics() { return active.handle.diagnostics() },
    setDefaultAgent(spec) { defaultAgent = resolveAgent({ agent: spec }) },
    hasAgent(spec) { const owner = connections.get(identity(spec)); return !!owner && !owner.failed },
    selectSession(id) {
      const bound = sessions.get(id)
      if (bound) active = bound.owner
      else if (!id && lastSetup) active = lastSetup
    },
    capabilityFor(message) {
      const id = message?._meta?.marttyConnectionId
      const owner = id ? [...connections.values()].find(owner => owner.id === id) : ownerFor(message)
      return readCordisCapability(owner?.init)
    },
    withOrigin(message, callback) {
      const id = message?._meta?.marttyConnectionId
      const owner = [...connections.values()].find(owner => owner.id === id)
      return context.run(owner ?? active, callback)
    },
    close() {
      if (closed) return
      for (const owner of connections.values()) {
        fail(owner, new Error('acpClient is closed'))
        try { owner.handle.child.kill('SIGTERM') } catch { /* already exited */ }
      }
      closed = true
      callbacks.clear()
      input.destroy()
      output.destroy()
    },
  }
}
```

</details>

#### 缺口

- 各agent全局配置语义、完整树退出和断线结果未知
  **影响**：不能按UI绑定承诺强配置/取消/多租户隔离
  **进一步探讨**：用两会话模型不同且拒set_config的假/真实agent核prompt实际模型，退出后查子进程与远端结果

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 插件运行与持久配置有哪些权限副作用成本？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

bootClient new Cordis Context，选stream或resolved agent并恢复主题、slots/commands等服务；Host和Client不是共享树。dynamic Client code用new Function包async执行，传API trap并由fiber管理dispose；这可收回注册和定时器，但不是VM/OS隔离，trusted扩展可能在运行期间调用Host动作，停止插件不回滚已发生文件/网络副作用。窗口/主题能力发现不能当插件可信来源证明。

首次有Node>=22.19、平台painter、Cordis依赖、bundled或外部agent及模型认证；Harness install另需网络/包管理器或原生解包工具。持续成本有Node+Rust+agent多进程、日志/会话/设置、模型与工具计算，费用与节时未知。prepare可触发依赖安装；自动升级/清理不得当纯UI无副作用。取消安装有回收流程也需失败实测。

移除Harness先重算计划，forced不可删，共享/private安装分开；验证的私有目录先rename隔离再改配置，外部程序和共享npx/uvx缓存保留，cleanup失败会明确“配置已移除但清理失败”。这不是卸掉全部agent依赖或杀已运行会话。退出先停当前会话并核真实工具，再退出TTY；保settings/session，按移除预览决定删recipe，恢复失败回原agent，不手删共享缓存。

#### 证据与依据

**依据 1 · 源码核查**：[npm/lib/boot.js:80-137](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/npm/lib/boot.js#L80-L137)

Client树与Harness/settings组合。

<details>
<summary>查看原文（58行）</summary>

```text
export async function bootClient(options = {}) {
  const { Context } = await import('@deepseek-ai/cordis')
  const ctx = new Context()
  const settingsPath = options.settingsPath ?? uiSettingsPath(options.extraArgs ?? [])
  const forcedHarness = options.forcedHarness ?? null
  const acpConfig = options.stream !== undefined
    ? { stream: options.stream }
    : {
        agent: options.agent ?? resolveStackedAgent(import.meta.url, {
          settingsPath,
          forcedHarness,
        }),
      }
  if (options.settingsPath === undefined) {
    migrateLegacyUiSettings(settingsPath, legacyUiSettingsPaths(options.extraArgs ?? []))
  }
  const presetConfig = { settingsPath }
  let harnessDefaults = options.harnessDefaults
  if (harnessDefaults === undefined) {
    try {
      harnessDefaults = [{
        id: 'builtin-dsh',
        label: 'Bundled DeepSeek Harness',
        ...resolveDependencyStack(),
        source: 'builtin',
      }]
    } catch {
      harnessDefaults = []
    }
  }
  if (forcedHarness !== null) {
    const forcedEntry = { ...forcedHarness, source: 'forced' }
    const forcedIndex = harnessDefaults.findIndex(({ id }) => id === forcedHarness.id)
    if (forcedIndex === -1) harnessDefaults = [forcedEntry, ...harnessDefaults]
    else harnessDefaults = harnessDefaults.map((entry, index) => index === forcedIndex ? forcedEntry : entry)
  }
  const harnessConfig = {
    settingsPath,
    defaults: harnessDefaults,
    forcedHarness,
    pathValue: options.harnessPathValue,
    hostOwned: options.stream !== undefined,
  }
  if (typeof ctx.plugin === 'function') {
    await ctx.plugin({ name: 'tui-theme', inject: [], apply: applyTheme }, presetConfig)
    await ctx.plugin({ name: 'tui-theme-ayu', inject: ayuInject, apply: applyAyu })
    await ctx.plugin({ name: 'tui-theme-catppuccin', inject: catppuccinInject, apply: applyCatppuccin })
    await ctx.plugin({ name: 'tui-theme-kanagawa', inject: kanagawaInject, apply: applyKanagawa })
    await ctx.plugin({ name: 'tui-theme-everforest', inject: everforestInject, apply: applyEverforest })
    await ctx.plugin({ name: 'tui-theme-iceberg', inject: icebergInject, apply: applyIceberg })
    await ctx.plugin({ name: 'tui-theme-solarized', inject: solarizedInject, apply: applySolarized })
    await ctx.plugin({ name: 'tui-theme-one', inject: oneInject, apply: applyOne })
    await ctx.plugin({ name: 'tui-theme-tomorrow', inject: tomorrowInject, apply: applyTomorrow })
    restorePreferredTheme(ctx.get('tuiTheme'))
    await ctx.plugin({ name: 'tui-slots', inject: [], apply: applySlots })
    await ctx.plugin({ name: 'tui-commands', inject: [], apply: applyCommands })
    if (options.notice !== undefined) {
      await ctx.plugin({ name: 'launch-notice', inject: launchNoticeInject, apply: applyLaunchNotice }, options.notice)
```

</details>

**依据 2 · 源码核查**：[npm/lib/client-run.js:41-80](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/npm/lib/client-run.js#L41-L80)

动态JS执行与API trap。

<details>
<summary>查看原文（40行）</summary>

```text
export async function applyClientHalf(clientCode, env) {
  if (typeof clientCode !== 'string' || clientCode.trim().length === 0) {
    throw new Error('TUI Client half is empty')
  }
  let plugin
  try {
    const factory = new Function(
      'React',
      'styles',
      'host',
      'harness',
      'require',
      'process',
      'Buffer',
      'setTimeout',
      'setInterval',
      `return (async () => {\n${clientCode}\n})()`,
    )
    plugin = await factory(
      reactTrap,
      stylesTrap,
      hostFor(env),
      harnessTrap,
      requireTrap,
      processTrap,
      bufferTrap,
      timerGlobalTrap,
      timerGlobalTrap,
    )
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(
        `TUI Client half failed to parse: ${error.message}\n`
        + 'The Client half is plain JavaScript (no JSX, no TypeScript).',
      )
    }
    throw error
  }
  return applyClientPlugin(plugin, env)
}
```

</details>

**依据 3 · 源码核查**：[npm/lib/inspect.js:698-745](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/npm/lib/inspect.js#L698-L745)

fiber挂载/失败dispose。

<details>
<summary>查看原文（48行）</summary>

```text
  pluginId,
  clientCode,
  tuiTheme,
  tuiPresets,
  tuiSlots,
  tuiCommands,
  tuiOverlay,
  acpSessionConfig,
  acpSessionPlan,
  acpSessionStats,
  acpSessionStatus,
  timer,
  invoke,
) {
  if (typeof ctx.plugin !== 'function') {
    return applyClientHalf(clientCode, {
      pluginId,
      tuiTheme, tuiPresets, tuiSlots, tuiCommands, tuiOverlay, acpSessionConfig, acpSessionPlan,
      acpSessionStats, acpSessionStatus, timer, invoke,
    })
  }

  let applied
  const fiber = ctx.plugin({
    name: `tui-dynamic:${pluginId}`,
    inject: [],
    apply: async () => {
      applied = await applyClientHalf(clientCode, {
        pluginId,
        tuiTheme, tuiPresets, tuiSlots, tuiCommands, tuiOverlay, acpSessionConfig, acpSessionPlan,
        acpSessionStats, acpSessionStatus, timer, invoke,
      })
      return applied.dispose
    },
  })
  try {
    await fiber
  } catch (error) {
    await fiber.dispose()
    throw error
  }
  return {
    waitingFor: applied.waitingFor,
    dispose() {
      applied.dispose()
      return fiber.dispose()
    },
  }
```

</details>

**依据 4 · 源码核查**：[npm/lib/harness-removal.js:20-88](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/npm/lib/harness-removal.js#L20-L88)

私有/共享/forced移除与隔离清理。

<details>
<summary>查看原文（69行）</summary>

```text
function privateInstallation(settingsPath, entry) {
  const root = path.resolve(path.dirname(settingsPath), 'bin')
  const canonicalRoot = existsSync(root) ? realpathSync(root) : root
  const candidate = references(entry).find(value => inside(root, path.resolve(value)) || inside(canonicalRoot, path.resolve(value)))
  if (!candidate) return { resources: [], cleanupReason: 'No private binary installation. External programs and shared npx/uvx caches are kept.' }
  const parts = path.relative(inside(root, path.resolve(candidate)) ? root : canonicalRoot, path.resolve(candidate)).split(path.sep)
  // The installer owns bin/<registry-id>/<version>/<platform>, never the whole bin or id directory.
  if (parts.length < 4 || parts.slice(0, 3).some(part => !/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(part))) {
    return { resources: [], cleanupReason: 'The path is not a recognized private binary installation.' }
  }
  const directory = path.join(root, ...parts.slice(0, 3))
  let cursor = directory
  while (true) {
    try {
      if (lstatSync(cursor).isSymbolicLink()) return { resources: [], cleanupReason: 'A symbolic link is present; resource cleanup is disabled.' }
    } catch (error) { if (error.code !== 'ENOENT') throw error }
    const parent = path.dirname(cursor)
    if (cursor === path.dirname(root)) break
    cursor = parent
  }
  if (!existsSync(directory)) return { resources: [], cleanupReason: 'Private installation is already absent.' }
  if (hasLink(directory)) return { resources: [], cleanupReason: 'The installation contains a symbolic link; resource cleanup is disabled.' }
  return { resources: [directory] }
}

export function planHarnessRemoval(settingsPath, id, options = {}) {
  const entries = savedHarnesses(settingsPath)
  const entry = entries.find(entry => entry.id === id)
  if (!entry) throw new Error('Only a saved Harness configuration can be removed')
  if (options.isCurrent?.(entry)) throw new Error('This Harness is still running. Restart Martty with another default before removing it')
  const forced = [options.forcedHarness, ...(options.defaults ?? []).filter(entry => entry.source === 'forced')].filter(Boolean)
  if (forced.some(value => value.id === id || value.command === entry.command)) throw new Error('This Harness is product-forced and cannot be removed here')
  const installation = privateInstallation(settingsPath, entry)
  if (installation.resources.length) {
    const directory = installation.resources[0]
    const shared = [...entries.filter(value => value.id !== id), ...(options.defaults ?? []), ...forced]
      .some(value => references(value).some(ref => {
        const resolved = existsSync(ref) ? realpathSync(ref) : path.resolve(ref)
        return inside(directory, path.resolve(ref)) || inside(realpathSync(directory), resolved)
      }))
    if (shared) return { entry, resources: [], cleanupReason: 'The installation is shared by another Harness configuration; its resources must be kept.' }
  }
  return { entry, ...installation }
}

export function removeHarness(settingsPath, expected, options = {}) {
  const plan = planHarnessRemoval(settingsPath, expected.entry.id, options)
  if (JSON.stringify(plan.entry) !== JSON.stringify(expected.entry)) throw new Error('Harness configuration changed; review removal again')
  if (options.cleanup && plan.cleanupReason) throw new Error(plan.cleanupReason)
  if (options.cleanup && JSON.stringify(plan.resources) !== JSON.stringify(expected.resources)) throw new Error('Installation paths changed; review removal again')
  // Move the exact validated installation aside before changing settings. No external cache or ancestor is deleted.
  const moved = []
  try {
    if (options.cleanup) for (const resource of plan.resources) {
      const quarantine = path.join(path.dirname(resource), `.removed-${randomUUID()}`)
      renameSync(resource, quarantine)
      moved.push({ resource, quarantine })
    }
    removeHarnessConfiguration(settingsPath, plan.entry)
  } catch (error) {
    for (const { resource, quarantine } of moved.reverse()) renameSync(quarantine, resource)
    throw error
  }
  for (const { quarantine } of moved) {
    try { rmSync(quarantine, { recursive: true }) }
    catch (error) { throw new Error(`Configuration removed, but cleanup failed at ${quarantine}: ${error.message}`) }
  }
  return { entry: plan.entry, removed: moved.map(({ resource }) => resource) }
}
```

</details>

**依据 5 · 源码核查**：[npm/package.json:79-101](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/npm/package.json#L79-L101)

依赖和Node声明。

<details>
<summary>查看原文（23行）</summary>

```text
    "@openma/common": "^0.9.2",
    "@openma/deepseek-harness-acp": "0.4.39",
    "@resvg/resvg-js": "2.6.2",
    "cross-spawn": "^7.0.6",
    "node-downloader-helper": "2.1.11",
    "semver": "^7.8.5"
  },
  "devDependencies": {
    "@deepseek-ai/dsh": "0.2.0-rc.2"
  },
  "engines": {
    "node": ">=22.19.0",
    "dsh": ">=0.1.7-rc.2"
  },
  "keywords": [
    "deepseek",
    "harness",
    "tui",
    "agent",
    "acp",
    "agent-client-protocol"
  ]
}
```

</details>

#### 缺口

- 全部动态代码/Host权限、卸载回滚与真实资源成本未验
  **影响**：应限可信插件/配方并保留原agent与设置备份
  **进一步探讨**：可丢弃用户目录验证卸载预览、共享缓存保留、插件dispose及活动工具状态

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 适合何用，迁移价值和验证标准是什么？

**研究主题**：新假设与验证、采用判断

#### 完整回答

观察适合已有可信ACP/DSH环境、愿意核profile与多进程的终端开发者。先选已安装平台包启动demo核TTY，再固定可信Harness用普通文本，在界面核实际agent/模型与配置目录；不直接拿--dsh参数或包版本当已连接全局DSH。再试两个旧/新会话切默认、拒配置后prompt、退出/重连与安装取消；失败时保日志/settings并回原CLI核结果，停止自动重装/重试未知操作。

可迁移的是session绑定owner、请求id改写、安装临时目录+rename、下载取消等待清理，以及移除先预览共享资源。未实现方向是“配置收敛收据门禁”：prompt必须绑定所需session配置版本和agent回执，拒绝重assert就阻止发送并提供用户明确改选/放弃；只对明确选择的可降级配置允许继续。对照用全局配置agent、set_config拒绝/超时、旧响应迟到、切默认时new在途；成功是无静默错模型/权限、合法任务不过度阻塞，且不把未知配置视成功。若agent协议无法给权威状态或交互开销压倒收益，则保留原CLI而非堆更多状态标签。

#### 证据与依据

**依据 1 · 源码核查**：[npm/lib/acp-agent-pool.js:145-178](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/npm/lib/acp-agent-pool.js#L145-L178)

当前best-effort断点为新假设参照。

<details>
<summary>查看原文（34行）</summary>

```text
  function recordOptions(owner, sessionKey, options) {
    if (typeof sessionKey !== 'string' || !options) return
    const entries = options.map(optionEntry).filter(Boolean)
    if (entries.length === 0) return
    const config = owner.configs.get(sessionKey) ?? new Map()
    for (const [id, value] of entries) {
      config.set(id, value)
      owner.applied.set(id, value)
    }
    owner.configs.set(sessionKey, config)
  }

  /**
   * Re-apply a session's recorded config options the connection no longer
   * holds — one `set_config_option` per drifted option, in recorded order.
   * Best effort: a rejected assert must not block the turn it guarded.
   */
  async function applySessionConfig(owner, sessionKey) {
    const config = owner.configs.get(sessionKey)
    const bound = sessions.get(sessionKey)
    if (!config || !bound || bound.owner !== owner || owner.failed || closed) return
    for (const [configId, value] of config) {
      if (JSON.stringify(owner.applied.get(configId)) === JSON.stringify(value)) continue
      const id = `martty-config-${++nextRequest}`
      const params = { sessionId: bound.raw, configId, value }
      const result = await new Promise((resolve, reject) => {
        owner.pending.set(id, { resolve, reject, method: 'session/set_config_option', params, sessionKey })
        writeAgent(owner, { jsonrpc: '2.0', id, method: 'session/set_config_option', params })
      }).catch(() => undefined)
      if (result === undefined) break // assert failed — keep remaining options eligible
      recordOptions(owner, sessionKey, readConfigOptions(result)
        ?? [{ id: configId, currentValue: value }])
    }
  }
```

</details>

**依据 2 · 源码核查**：[npm/lib/acp-agent-pool.js:274-325](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/npm/lib/acp-agent-pool.js#L274-L325)

创建绑定与prompt链。

<details>
<summary>查看原文（52行）</summary>

```text
      // Capture the recipe before awaiting initialization. Later default edits
      // cannot retarget a session/new request already in flight.
      if (message.method === 'session/new') {
        owner = authMethods.get(params?._meta?.marttyAuthMethod)?.owner ?? connection(defaultAgent)
        lastSetup = owner
        if (params?._meta?.marttyAuthMethod) {
          params = { ...params, _meta: { ...params._meta } }
          delete params._meta.marttyAuthMethod
        }
        await initialize(owner)
      } else if (message.method === 'initialize') {
        initializeParams = structuredClone(params ?? {})
        owner = active
      } else if (message.method === 'authenticate') {
        const method = authMethods.get(params?.methodId)
        owner = method?.owner ?? lastSetup ?? active
        if (method) params = { ...params, methodId: method.id }
      } else {
        owner = ownerFor(message)
        if (setupMethods.has(message.method)) await initialize(owner)
      }
      if (owner.failed) throw owner.failed
      if (message.method.startsWith('_dsh/cordis/') && readCordisCapability(owner.init) === null) {
        throw new Error('agent has not advertised _dsh/cordis')
      }
      const sessionKey = typeof params?.sessionId === 'string' ? params.sessionId
        : typeof params?.session_id === 'string' ? params.session_id : undefined
      if (params && typeof params === 'object') {
        params = { ...params }
        for (const key of ['sessionId', 'session_id']) {
          const bound = sessions.get(params[key])
          if (bound) params[key] = bound.raw
        }
      }
      const forwarded = { ...message, params }
      if (message.id !== undefined) {
        const id = `martty-client-${++nextRequest}`
        owner.pending.set(id, { id: message.id, method: message.method, params, sessionKey })
        forwarded.id = id
      }
      if (message.method === 'session/prompt' && sessionKey !== undefined) {
        // The prompt lands on stdin only after its session's config options
        // are re-asserted — the chain keeps cross-session order. Registering
        // the pending reply above (never inside the chain) keeps close() able
        // to settle it while an assert is still in flight.
        owner.configChain = owner.configChain.then(async () => {
          // Asserts resolve `undefined` on a failed set_config_option rather
          // than rejecting, so this chain cannot drop the prompt.
          await applySessionConfig(owner, sessionKey)
          if (!closed && !owner.failed) writeAgent(owner, forwarded)
        })
        return
```

</details>

**依据 3 · 源码核查**：[npm/lib/harness-removal.js:65-88](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/npm/lib/harness-removal.js#L65-L88)

明确清理失败和退路。

<details>
<summary>查看原文（24行）</summary>

```text
export function removeHarness(settingsPath, expected, options = {}) {
  const plan = planHarnessRemoval(settingsPath, expected.entry.id, options)
  if (JSON.stringify(plan.entry) !== JSON.stringify(expected.entry)) throw new Error('Harness configuration changed; review removal again')
  if (options.cleanup && plan.cleanupReason) throw new Error(plan.cleanupReason)
  if (options.cleanup && JSON.stringify(plan.resources) !== JSON.stringify(expected.resources)) throw new Error('Installation paths changed; review removal again')
  // Move the exact validated installation aside before changing settings. No external cache or ancestor is deleted.
  const moved = []
  try {
    if (options.cleanup) for (const resource of plan.resources) {
      const quarantine = path.join(path.dirname(resource), `.removed-${randomUUID()}`)
      renameSync(resource, quarantine)
      moved.push({ resource, quarantine })
    }
    removeHarnessConfiguration(settingsPath, plan.entry)
  } catch (error) {
    for (const { resource, quarantine } of moved.reverse()) renameSync(quarantine, resource)
    throw error
  }
  for (const { quarantine } of moved) {
    try { rmSync(quarantine, { recursive: true }) }
    catch (error) { throw new Error(`Configuration removed, but cleanup failed at ${quarantine}: ${error.message}`) }
  }
  return { entry: plan.entry, removed: moved.map(({ resource }) => resource) }
}
```

</details>

#### 缺口

- 不同agent配置回执权威性与用户任务改善未测
  **影响**：假设不计入当前保障，不直接推荐全面替换
  **进一步探讨**：同任务对照原CLI并保配置拒绝/取消退出负向证据

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
