# DeepSeek Harness CLI

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[4acd0f7](https://github.com/peiyuwang54/deepseek-harness-cli/tree/4acd0f7cc7714d31645e16de50802c796b5d36d5)

<!-- BEGIN META -->
[![GitHub ★ 66](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=66&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/peiyuwang54/deepseek-harness-cli)
<!-- END META -->

> **功能**：DeepSeek Harness 衍生终端客户端，提供交互、exec、会话恢复及平台包启动入口。

> **亮点**：以终端入口、profile组合、可脚本化exec和平台包启动组织一个Harness衍生客户端。相对自行搭建源码，平台解析和诊断入口提供可检查的分发/排障路径；相对官方宿主的独有贡献尚未充分归因。[Q01](#research-q01) [Q04](#research-q04)

> **主要限制**：采用关键不是功能数量，而是fork是否有足够独有收益抵偿整个宿主的制品、配置和权限迁移。resume不是外部操作回滚，exec退出只约束模型回合/结构输出；升级是逐文件替换，不能当原子回退。底层跨平台隔离与同版本制品均未验收。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

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
  - [Q01 · 这是什么类型，相对官方宿主和普通插件增加了什么？](#detail-section-11)
  - [Q02 · 入口如何启动任务，exec退出和resume分别保证什么？](#detail-section-12)
  - [Q03 · 默认、full-auto和yolo如何设置，能否视作隔离保证？](#detail-section-13)
  - [Q04 · 分发、诊断与升级会给用户增加什么负担？](#detail-section-14)
  - [Q05 · 现在是否值得迁移，可验证怎样的增量？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：开发者在项目目录通过终端反复提交读改代码任务；以工件和既有测试审查为合格结果，不以回合完成代替验收。[Q01](#research-q01)

参照现有官方Harness CLI/网页端以及从源码构建宿主。确认有平台分发和启动编排路径，但未固定官方全差异，不把继承的整个monorepo当此fork原创。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| profile启动 | 组合模型/Agent/工具客户端 | 依赖配置与加载，不是普通宿主插件 |
| exec与JSONL | 脚本提交任务并消费本次输出 | 完成回合不等于代码验收 |
| 结构结果要求 | 指定schema及最后消息文件 | 未捕获合格结果失败，业务含义另验 |
| resume | 继续持久化会话 | last按创建时间和cwd，非外部回滚 |
| 权限快捷设置 | 选择sandbox/approval组合 | full-auto与yolo不同，管理员可锁定 |
| 平台npm shim | 解析系统架构并启动制品 | 支持平台有限，制品未实际验收 |
| doctor入口 | 不启动profile的环境诊断 | 外部probe非业务任务验证 |

**流程与依赖**

#### 启动与依赖

| 条件 | 是否必需 | 作用 | 缺失时 |
|---|---|---|---|
| 平台发行包与shim运行环境 | 分发方式相关 | shim选择macOS/Linux arm64/x64或Windows x64包 | 不支持架构/缺包直接报错，不自动退到源码 |
| profile及workspace插件 | 必需 | 组合Agent、会话、模型和工具 | loader/所需服务缺失阻止正常任务链 |
| 模型配置及API凭据 | 模型任务必需 | 提供实际推理服务 | 外部服务可用性和费用需用户核实 |
| 持久化home | resume必需 | 列出并加载历史会话 | last无候选失败，兼容性未验收 |
| 权限与平台隔离适配 | 执行必需 | 设置sandbox/approval及写根 | preset缺失/锁定报错；底层强度待平台核查 |

源码构建根声明Node ^22.19.0或>=24.0.0与pnpm；它不等同已核实可执行制品依赖。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

#### 使用步骤

| 阶段 | 操作者与动作 | 可见结果与异常边界 |
|---|---|---|
| 对照 | 用户固定官方/fork版本、来源及副本home | 先确认独有需求和恢复路径 |
| 安装准备 | 用户查平台包/校验与PATH命中 | 不覆盖现有别名；hash失败在替换前退出 |
| 启动 | CLI加载分层环境与profile | 依赖组合后进入任务；错误需排障 |
| 执行 | 用户选择默认权限并提交受控任务 | exec输出本次文本/JSONL，schema缺失失败 |
| 恢复/中断 | 用户显式ID或last续任务 | last按创建时间/cwd；中断不证明外部停止 |
| 验收/退出 | 用户查工件及测试，恢复旧路径 | 退出码不是业务验收，保留旧home与发行物 |

当前为待执行验证步骤，不表示本轮安装完成。[Q02](#research-q02) [Q05](#research-q05)

**效果与成本**

#### 成本

| 阶段 | 现金/资源 | 人工投入 | 条件与未知 |
|---|---|---|---|
| 首次 | 平台包/源码下载、本地存储；金额未知 | 核实来源、PATH、模型凭据、profile及home | 未测分钟数，不能据单文件宣称零配置 |
| 持续 | 模型API、网络与工具执行资源 | 代码审查、权限选择、插件/MCP维护 | 外部价格和可用性本轮未核实 |
| 失败恢复 | 重新下载/旧版存储及可能重复API开销 | 查部分安装、状态兼容与残留操作 | 非原子多文件替换，恢复未实测 |
| 退出 | 保留旧发行物及配置存储 | 恢复别名/PATH并检查工件 | 删除程序不能回滚文件或远端副作用 |

对已有官方环境，收益差异不明使迁移负担当前不值得默认承担。[Q04](#research-q04) [Q05](#research-q05)

#### 效果

| 项目 | 源码支持 | 未验证 |
|---|---|---|
| 平台分发入口 | shim选择包并透传参数/stdio/信号 | npm制品对应及真实安装成功 |
| exec脚本输出 | 本次事件、schema缺失检查和退出条件 | 代码正确性、节时与任务质量 |
| 恢复会话 | 显式ID/按createdAt和cwd选择last | 旧宿主迁移、外部操作中断/回滚 |
| 权限选择 | sandbox和approval分别写入策略 | 所有平台/工具实际强制隔离 |
| 诊断 | boot-free入口与超时参数 | 实际连接和相比官方排障优势 |

没有执行目标或比较用户任务，不将功能链当收益实测。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

> **思考**：采用关键不是功能数量，而是fork是否有足够独有收益抵偿整个宿主的制品、配置和权限迁移。resume不是外部操作回滚，exec退出只约束模型回合/结构输出；升级是逐文件替换，不能当原子回退。底层跨平台隔离与同版本制品均未验收。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：以终端入口、profile组合、可脚本化exec和平台包启动组织一个Harness衍生客户端。相对自行搭建源码，平台解析和诊断入口提供可检查的分发/排障路径；相对官方宿主的独有贡献尚未充分归因。[Q01](#research-q01) [Q04](#research-q04)

启动setup先配置再发布Agent、sandbox与approval分别写事实、本次seq限定输出是明确工程边界。shim直接child信号、安装器逐文件写和profile SIGTERM零退出限制了可推导保证；只审定向链，未全面审计全部继承包。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-5"></a>

### 1.4 主要限制

采用关键不是功能数量，而是fork是否有足够独有收益抵偿整个宿主的制品、配置和权限迁移。resume不是外部操作回滚，exec退出只约束模型回合/结构输出；升级是逐文件替换，不能当原子回退。底层跨平台隔离与同版本制品均未验收。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

已有官方宿主的开发者当前保留原环境并观察。先固定官方差异与发行制品，再用独立home/副本项目核对默认权限、exec、resume、中断和旧版恢复，所有代码另做既有验收；无独有优势或制品/权限不可解释就停止迁移。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持客户端启动、exec、权限选择和分发机制判断；官方差异、实际制品安装、会话迁移、隔离及任务效果未验证，当前观察。

- 已检查：作者 README、包清单、源码路径 README.md、apps/cli/package.json、apps/cli/src/bin.ts、scripts/dsh-npm-shim.js、package.json、apps/cli/src/profile-boot.ts、packages/bundle/headless/src/index.ts、packages/bundle/headless/src/startup.ts、packages/interaction/permission-presets/src/index.ts、apps/cli/install/install.sh、apps/cli/install/README.md、apps/cli/src/doctor.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：inventory统计覆盖固定仓库，人工聚焦apps/cli启动、headless任务、permission-presets和平台分发；不把抽读范围当全仓审计，不归因所有继承代码。未构建、安装、运行doctor/测试/模型任务。
- 下一步：后续固定官方/分支及制品，在副本环境比较首个合格任务、默认权限拒绝、resume选择、中断工件、安装失败和恢复；记录环境与实际结果。本轮未执行。

**分析版本**

- **仓库**：[peiyuwang54/deepseek-harness-cli](https://github.com/peiyuwang54/deepseek-harness-cli)
- **版本号**：0.1.0-rc.15（[固定提交 4acd0f7](https://github.com/peiyuwang54/deepseek-harness-cli/tree/4acd0f7cc7714d31645e16de50802c796b5d36d5)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

比较平台shim加boot-free doctor是否相对固定官方发行物降低到首个合格任务的摩擦；先查官方是否已提供等效路径，再同OS/任务测安装成功、人工排障、权限与恢复，不牺牲业务验收。若只是包装或恢复变差则否定净收益，未执行不作已有贡献。[Q05](#research-q05)

后续固定官方/分支及制品，在副本环境比较首个合格任务、默认权限拒绝、resume选择、中断工件、安装失败和恢复；记录环境与实际结果。本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2375 | 174462 | — | — | 3255966 |
| .mjs | source | 19 | 2813 | 2295 | 277 | — |
| .mjs | test | 4 | 1042 | 1001 | 37 | — |
| .ts | source | 1454 | 263673 | 176427 | 69752 | — |
| .ts | test | 972 | 301639 | 258528 | 17212 | — |
| .ts | example | 91 | 10104 | 8149 | 1214 | — |
| .mjs | example | 10 | 616 | 524 | 41 | — |
| .md | test | 112 | 3850 | — | — | 21778 |
| .md | example | 58 | 3588 | — | — | 40315 |
| .js | test | 2 | 213 | 149 | 33 | — |
| .tsx | source | 141 | 29745 | 23179 | 5217 | — |
| .tsx | test | 121 | 39465 | 33139 | 2981 | — |
| .js | example | 6 | 65 | 49 | 14 | — |
| .cjs | source | 1 | 108 | 68 | 26 | — |
| .js | source | 1 | 64 | 50 | 8 | — |

</details>

**活跃度**

[![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/peiyuwang54/deepseek-harness-cli/issues?q=is%3Aissue+created%3A2026-10-06T08%3A55%3A05.110Z..2026-11-05T08%3A55%3A05.110Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/peiyuwang54/deepseek-harness-cli/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T08%3A55%3A05.110Z..2026-11-05T08%3A55%3A05.110Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：这个衍生CLI相对官方宿主的增量、启动执行和迁移条件是否值得采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 这是什么类型，相对官方宿主和普通插件增加了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

研究对象是DeepSeek Harness衍生CLI客户端及其整个monorepo来源条目，不是供现有宿主加载的一个普通插件。README把它描述成在终端读项目、改代码和执行命令的本地Agent，并明确与官方Harness同步；apps/cli包导出dsh、deepseek两个可执行入口，主程序按模式启动profile或管理子命令。适合开发者在项目目录反复提交交互/脚本任务，合格结果是代码变更经用户现有测试和审查接受，不是命令退出就算交付。

可确认的产品组织是将Harness的profile、模型、Agent、会话和工具体系配上CLI入口、exec输出以及独立平台分发。相对从源码搭环境，npm shim可直接解析平台可执行包；相对普通插件，这是更换/并存宿主发行物，需承担配置、会话和权限兼容的整体责任。相对官方CLI究竟新增哪些界面、语言或机制，本轮没有固定官方基线完整差异，不能把monorepo中已有的全部能力算成此fork原创，也不能从README的九种语言/主题宣传推导实际体验优势。

根包是private的@deepseek-ai/dsh-root，apps/cli仍标官方@deepseek-ai/dsh，README和shim则使用@peiyu_wang/deepseek-harness-cli。这是源码包身份与分发包身份不同，不能据根package猜测npm同名制品已被验证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-18](https://github.com/peiyuwang54/deepseek-harness-cli/blob/4acd0f7cc7714d31645e16de50802c796b5d36d5/README.md#L1-L18)

作者定义终端Agent和官方同步关系，尚非与官方差异证明。

<details>
<summary>查看原文（18行）</summary>

```text
<p align="center"><strong>DeepSeek CLI</strong> is an open-source coding agent powered by DeepSeek that runs locally in your terminal.</p>

&#8203;<div align="center">English | [中文](README.zh.md)</div>

<p align="center">
  <img src=".github/deepseek-cli-splash.png" alt="DeepSeek CLI terminal preview" width="80%" />
</p>

<p align="center"><strong>9 interface languages · 6 theme palettes · Agentic coding from plan to execution</strong></p>

<p align="center">
  <img src=".github/deepseek-cli-theme-swatches.svg" alt="DeepSeek CLI theme colors: DeepSeek, Cosmic Orange, Mist Blue, Sage, Lavender, and Deep Blue" width="280" />
</p>

---

**Note:** This is DeepSeek Harness CLI. We keep iterating in sync with the official [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness), and we look forward to your forks and stars.

```

</details>

**依据 2 · 源码核查**：[apps/cli/package.json:1-21](https://github.com/peiyuwang54/deepseek-harness-cli/blob/4acd0f7cc7714d31645e16de50802c796b5d36d5/apps/cli/package.json#L1-L21)

可执行别名及官方源包身份支持客户端分类。

<details>
<summary>查看原文（21行）</summary>

```text
{
  "name": "@deepseek-ai/dsh",
  "description": "dsh CLI profile boot, MCP management, plugin management, and shipped browser/TUI aliases",
  "version": "0.1.0-rc.15",
  "publishConfig": {
    "access": "public"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/deepseek-ai/deepseek-harness.git",
    "directory": "apps/cli"
  },
  "type": "module",
  "bin": {
    "dsh": "lib/bin.js",
    "deepseek": "lib/bin.js"
  },
  "files": [
    "lib/*.js",
    "config"
  ],
```

</details>

**依据 3 · 源码核查**：[apps/cli/src/bin.ts:27-71](https://github.com/peiyuwang54/deepseek-harness-cli/blob/4acd0f7cc7714d31645e16de50802c796b5d36d5/apps/cli/src/bin.ts#L27-L71)

实际CLI分派profile及管理模式。

<details>
<summary>查看原文（45行）</summary>

```text
const invocation = parseDshArgs(process.argv.slice(2), readVersion())

switch (invocation.mode) {
  case 'profile': {
    // `loadLayeredEnv` materializes accepted project/user values into
    // process.env. Preserve the original launching environment so a TUI
    // workspace handoff can load the replacement workspace's own `.env`
    // instead of inheriting the previous project's values as process-owned.
    // Capture before the dependency-heavy profile module is evaluated: module
    // initialization is not part of the environment the CLI inherited.
    const inheritedEnvironment = { ...process.env }
    const { runProfile } = await import('./profile-boot.ts')
    await runProfile({
      environment: loadLayeredEnv('dsh'),
      inheritedEnvironment,
      profile: invocation.profile,
      patchFiles: invocation.patches,
      args: invocation.args,
    })
    break
  }
  case 'plugin': {
    const { runPlugin } = await import('./plugin.ts')
    process.exit(runPlugin(invocation.profile, invocation.args))
    break
  }
  case 'mcp': {
    const { runMcp } = await import('./mcp.ts')
    process.exit(await runMcp(invocation.args))
    break
  }
  case 'doctor': {
    const { runDoctor } = await import('./doctor.ts')
    process.exit(await runDoctor(invocation.args))
    break
  }
  case 'completion': {
    const { runCompletion } = await import('./completion.ts')
    process.exit(runCompletion(invocation.args))
    break
  }
  case 'dump-config': {
    const { runDumpConfig } = await import('./dump-config.ts')
    runDumpConfig(invocation.profile, invocation.defaultOnly, invocation.patches)
    break
```

</details>

**依据 4 · 源码核查**：[scripts/dsh-npm-shim.js:15-38](https://github.com/peiyuwang54/deepseek-harness-cli/blob/4acd0f7cc7714d31645e16de50802c796b5d36d5/scripts/dsh-npm-shim.js#L15-L38)

fork平台包解析是具体分发实现。

<details>
<summary>查看原文（24行）</summary>

```text
const OS = { darwin: 'macos', linux: 'linux', win32: 'win' }
const CPU = { arm64: 'arm64', x64: 'x64' }

const os = OS[process.platform]
const cpu = CPU[process.arch]
if (!os || !cpu || (os === 'win' && cpu !== 'x64')) {
  console.error(
    `deepseek-harness-cli: unsupported platform ${process.platform}-${process.arch}. ` +
      'Supported: macOS (arm64, x64), Linux (arm64, x64), and Windows (x64).',
  )
  process.exit(1)
}

const packageName = `@peiyu_wang/deepseek-harness-cli-${os}-${cpu}`
const exeName = os === 'win' ? 'deepseek-harness-cli.exe' : 'deepseek-harness-cli'
let executable
try {
  executable = require.resolve(`${packageName}/bin/${exeName}`)
} catch {
  console.error(
    `deepseek-harness-cli: the ${packageName} package is not installed. ` +
      'Reinstall with: npm install -g @peiyu_wang/deepseek-harness-cli',
  )
  process.exit(1)
```

</details>

**依据 5 · 源码核查**：[package.json:1-20](https://github.com/peiyuwang54/deepseek-harness-cli/blob/4acd0f7cc7714d31645e16de50802c796b5d36d5/package.json#L1-L20)

根monorepo身份用于限制包名推断。

<details>
<summary>查看原文（20行）</summary>

```text
{
  "name": "@deepseek-ai/dsh-root",
  "version": "0.1.0-rc.15",
  "license": "MIT",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@11.7.0",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "workspaces": [
    "vendor/*",
    "packages/*/*",
    "native/landlock-run",
    "native/landlock-run/packages/*",
    "apps/*",
    "website"
  ],
  "scripts": {
    "build": "tsx scripts/build.ts",
```

</details>

#### 缺口

- 没有固定官方对照提交的完整diff，也没有同任务比较。
  **影响**：无法给fork全部功能归因或判断取代现有官方宿主的必要性。
  **进一步探讨**：先固定官方版本，逐项区分继承、改动和独有能力，再在相同任务比较。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 入口如何启动任务，exec退出和resume分别保证什么？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

bin先解析启动参数；profile模式捕获启动环境、加载分层环境后运行组合profile。composeLive按bundle patches、托管MCP、profile与home patches以及环境覆盖组合配置，提供启动参数等服务，再挂载插件树；因此具体工具和模型能力取决于实际profile，不是一个静态CLI文件就独立完成所有事。

headless等待loader及Agent、模型、preset、权限、sandboxPolicy、会话持久化等服务。prepareAgent先在未发布Agent的setup中配置当前模型、额外可写目录、权限和preset，再新建或恢复会话。resume显式ID直接交给agents.resume；--last列出持久化会话，默认筛当前cwd，按createdAt降序选择，而非按最后修改时间；--all放宽cwd范围。恢复表示加载会话继续提交新任务，不是回滚文件，也没有由此证明旧外部操作已经停止。

exec只订阅本次起始seq以后的事件，提交followup、等idle、flush会话，再输出文本或JSONL。schema存在但没有捕获合法结构结果时失败，普通完成且结构满足才exit0；这只是模型回合/输出条件，不是代码测试和业务验收。另profile启动层SIGTERM触发shutdown并请求0退出，不能把所有路径的退出码0都解释成任务成功。故脚本仍要检查期望工件和自己的验收命令，受中断时先核对实际文件和远端状态。

#### 证据与依据

**依据 1 · 源码核查**：[apps/cli/src/bin.ts:29-47](https://github.com/peiyuwang54/deepseek-harness-cli/blob/4acd0f7cc7714d31645e16de50802c796b5d36d5/apps/cli/src/bin.ts#L29-L47)

环境加载后启动profile，说明真正入口。

<details>
<summary>查看原文（19行）</summary>

```text
switch (invocation.mode) {
  case 'profile': {
    // `loadLayeredEnv` materializes accepted project/user values into
    // process.env. Preserve the original launching environment so a TUI
    // workspace handoff can load the replacement workspace's own `.env`
    // instead of inheriting the previous project's values as process-owned.
    // Capture before the dependency-heavy profile module is evaluated: module
    // initialization is not part of the environment the CLI inherited.
    const inheritedEnvironment = { ...process.env }
    const { runProfile } = await import('./profile-boot.ts')
    await runProfile({
      environment: loadLayeredEnv('dsh'),
      inheritedEnvironment,
      profile: invocation.profile,
      patchFiles: invocation.patches,
      args: invocation.args,
    })
    break
  }
```

</details>

**依据 2 · 源码核查**：[apps/cli/src/profile-boot.ts:363-403](https://github.com/peiyuwang54/deepseek-harness-cli/blob/4acd0f7cc7714d31645e16de50802c796b5d36d5/apps/cli/src/profile-boot.ts#L363-L403)

配置组合及启动服务提供链。

<details>
<summary>查看原文（41行）</summary>

```text
  const rootConfig = join(composed.profile.dir, PROFILE_ROOT_FILENAME)
  const diagnostics = configDiagnostics(composed, rootConfig, options.patchFiles)
  // Recomposition for the live user layers: bundle layers below, overlays
  // above, so a user edit can never displace them. Parsed app arguments are
  // not in here at all — they live in app-provided services that survive a
  // recomposition. BOTH
  // user files are re-read per generation (the HMR watcher hands us only the
  // changed file's patches, which one of the reads duplicates — fresh reads
  // keep the two watchers from stitching in each other's stale copy).
  // Fresh clones per generation: the include pushes `insert` rows into the
  // mounted tree BY REFERENCE and later id-targeted patches mutate those
  // objects in place. Reusing one parsed patch object across applications
  // would bake a user override into the bundle's in-memory insert row, so
  // removing the override could never revert the row to the bundle default.
  const composeLive = (): PatchOptions[] => structuredClone([
    ...composed.bundlePatches,
    ...profileMcpPatches(options.profile),
    ...loadOptionalPatches(NAME, composed.profile.patchPath) ?? [],
    ...loadOptionalPatches(NAME, homePatchPath()) ?? [],
    ...composed.overlays,
  ])
  // Cloned for the same insert-aliasing reason as composeLive: the boot
  // application must not mutate the objects later reloads recompose from.
  const ctx = await boot(NAME, rootConfig, structuredClone(allPatches(composed)), (hostCtx) => {
    app.current = hostCtx
    // Before any config-tree entry mounts, so plugins resolve all launch-time
    // environment values from the same immutable provenance snapshot.
    hostCtx.provide(DSH_LAUNCH_ENVIRONMENT_KEY, options.environment)
    hostCtx.provide(TUI_CONFIG_DIAGNOSTICS_KEY, diagnostics)
    // The command line and bounded exit request are launcher facts available
    // to every app plugin that injects the argument snapshot.
    provideCmdline(hostCtx, {
      args: options.args,
      exit: code => void shutdown.shutdown(code),
    })
    // A TUI may be supplied by the shipped profile or by a custom composition.
    // The launcher is the only layer that can reconstruct the exact profile,
    // overlays, pristine launch environment, and foreground-process lifetime.
    hostCtx.provide('tuiResumeHost', tuiHandoff)
  }, INSTALL_ANCHOR)
  app.current = ctx
```

</details>

**依据 3 · 源码核查**：[packages/bundle/headless/src/index.ts:161-177](https://github.com/peiyuwang54/deepseek-harness-cli/blob/4acd0f7cc7714d31645e16de50802c796b5d36d5/packages/bundle/headless/src/index.ts#L161-L177)

last按createdAt与cwd选择持久化会话，不是最近更新。

<details>
<summary>查看原文（17行）</summary>

```text
async function resumeSessionId(ctx: Context, startup: HeadlessStartupValues): Promise<SessionId | undefined> {
  const selection = startup.resume
  if (selection === undefined) return undefined
  if (!selection.last) return SessionId(selection.sessionId as string)
  const persistence = ctx.get('sessionPersistence')
  if (persistence === undefined) throw new Error('exec resume requires session persistence')
  const cwd = process.cwd()
  const candidates = (await persistence.list())
    .filter(header => selection.all || header.cwd === cwd)
    .sort((left, right) => right.createdAt - left.createdAt || String(right.id).localeCompare(String(left.id)))
  const newest = candidates[0]
  if (newest === undefined) {
    throw new Error(selection.all
      ? 'no persisted session is available to resume'
      : `no persisted session is available in ${cwd}; use --all to include other workspaces`)
  }
  return newest.id
```

</details>

**依据 4 · 源码核查**：[packages/bundle/headless/src/index.ts:203-248](https://github.com/peiyuwang54/deepseek-harness-cli/blob/4acd0f7cc7714d31645e16de50802c796b5d36d5/packages/bundle/headless/src/index.ts#L203-L248)

setup与create/resume接线。

<details>
<summary>查看原文（46行）</summary>

```text
async function prepareAgent(
  ctx: Context,
  startup: HeadlessStartupValues,
  schema: ObjectJsonSchema | undefined,
): Promise<{ agent: Agent; structured?: StructuredAttachment }> {
  const agents = ctx.get('agents')
  const defaultModel = ctx.get('agentDefaultModel')
  const presets = ctx.get('agentPresets')
  if (agents === undefined || defaultModel === undefined || presets === undefined) {
    throw new Error('the non-interactive Agent services were disposed before startup completed')
  }
  const selection = defaultModel.currentSelection()
  let structured: StructuredAttachment | undefined
  const setup = async (agentCtx: Context): Promise<void> => {
    const agent = agentCtx.agent
    if (agent === undefined) throw new Error('exec Agent setup has no scoped Agent')
    const selected: ModelSelectionRef = { current: selection, assembled: undefined }
    installModelSelection(agentCtx, selected)
    if (startup.additionalWritableRoots.length > 0) {
      ctx.sandboxPolicy.addWritableRoots(agent.session, startup.additionalWritableRoots)
    }
    installPermission(ctx, agent, startup.permissionMode, startup.permissionPolicy)
    await presets.mount(agentCtx, resolveSessionPreset(agent.session))
    if (schema !== undefined) structured = attachStructuredRuntime(agentCtx, schema)
  }
  const resumeId = await resumeSessionId(ctx, startup)
  if (resumeId !== undefined) {
    const handle = await agents.resume({
      resumeSessionId: resumeId,
      agentOptions: { provider: selection.provider, model: selection.model },
      setup,
    })
    return { agent: handle.agent, ...structured === undefined ? {} : { structured } }
  }
  const preset = await presets.resolve()
  const handle = await agents.create({
    sessionId: SessionId(`session-${randomUUID()}`),
    meta: {
      cwd: process.cwd(),
      agentPreset: preset.id,
      ...startup.ephemeral ? { ephemeral: true } : {},
    },
    agentOptions: { provider: selection.provider, model: selection.model },
    setup,
  })
  return { agent: handle.agent, ...structured === undefined ? {} : { structured } }
```

</details>

**依据 5 · 源码核查**：[packages/bundle/headless/src/index.ts:251-315](https://github.com/peiyuwang54/deepseek-harness-cli/blob/4acd0f7cc7714d31645e16de50802c796b5d36d5/packages/bundle/headless/src/index.ts#L251-L315)

本次事件范围、flush、结构输出与正常退出条件。

<details>
<summary>查看原文（65行）</summary>

```text
/** Run one fresh or resumed task and request process exit. */
async function run(ctx: Context, startup: HeadlessStartupValues, io: HeadlessIo): Promise<void> {
  await ctx.get('loader')?.await()
  if (ctx.get('headlessStartup') === undefined
    || ctx.get('agents') === undefined
    || ctx.get('agentDefaultModel') === undefined
    || ctx.get('agentPresets') === undefined
    || ctx.get('permissionPresets') === undefined
    || ctx.get('sandboxPolicy') === undefined
    || ctx.get('sessions') === undefined
    || ctx.get('sessionPersistence') === undefined
    || ctx.get('attachments') === undefined) return

  const [schema, images] = await Promise.all([
    outputSchema(startup.outputSchema),
    imageBlocks(ctx, startup.images),
  ])
  const { agent, structured } = await prepareAgent(ctx, startup, schema)
  await agent.whenIdle()
  const firstSeq = agent.session.seq
  const jsonl = startup.json
    ? new ExecJsonlEmitter((value) => { io.stdout.write(`${JSON.stringify(value)}\n`) })
    : undefined
  jsonl?.threadStarted(String(agent.session.id))
  const stopEvents = jsonl === undefined
    ? undefined
    : ctx.on('session/event', (session, event) => {
      if (session === agent.session && event.seq >= firstSeq) jsonl.event(event)
    })
  try {
    agent.followup(createUserMessage({
      content: [{ type: 'text', text: startup.task }, ...images],
      source: { kind: 'user' },
    }))
    await agent.whenIdle()
  } finally {
    stopEvents?.()
  }
  const sessions = ctx.get('sessions')
  if (sessions === undefined) return
  await sessions.flush(agent.session)
  const outcome = summarize(agent.session.events, firstSeq)
  const captured = structured?.captured()
  const structuredMissing = schema !== undefined && captured === undefined
  const resultText = captured === undefined ? outcome.text : JSON.stringify(captured.value)
  if (startup.outputLastMessage !== undefined) {
    await writeFile(resolve(process.cwd(), startup.outputLastMessage), resultText, 'utf8')
  }
  if (jsonl !== undefined) {
    if (captured !== undefined) jsonl.structuredResult(captured.value)
    jsonl.finish(structuredMissing
      ? 'the model completed without reporting schema-valid structured output'
      : outcome.reason === undefined
        ? 'the run ended without a turn result'
        : undefined)
  } else {
    io.stdout.write(`${resultText}\n`)
    if (structuredMissing) {
      io.stderr.write('deepseek exec: the model completed without reporting schema-valid structured output\n')
    } else if (outcome.reason?.kind === 'error') {
      io.stderr.write(`deepseek exec: ${outcome.reason.error.code}: ${outcome.reason.error.message}\n`)
    }
  }
  io.exit(outcome.reason?.kind === 'completed' && !structuredMissing ? 0 : 1)
}
```

</details>

**依据 6 · 源码核查**：[apps/cli/src/profile-boot.ts:315-349](https://github.com/peiyuwang54/deepseek-harness-cli/blob/4acd0f7cc7714d31645e16de50802c796b5d36d5/apps/cli/src/profile-boot.ts#L315-L349)

信号处置是进程生命周期，不是业务完成凭证。

<details>
<summary>查看原文（35行）</summary>

```text
export async function runProfile(options: RunProfileOptions): Promise<{ ctx: Context; shutdown: ProcessShutdown }> {
  const composed = composeProfile(options.profile, options.patchFiles)
  const app: { current?: Context } = {}
  let removeProcessListeners = (): void => {}
  let uninstallFailLoud = (): void => {}
  const shutdown = createProcessShutdown(async () => {
    removeProcessListeners()
    await app.current?.fiber.dispose()
  })
  const signalShutdown = new AbortController()
  let replacingProcess = false
  const interrupt = (code: number): void => {
    // Once a handoff commits, the replacement owns subsequent console signals.
    // Escalating the old tree's pending shutdown could exit before it restores
    // raw, mouse, and alternate-screen state or race the fallback child.
    if (replacingProcess) return
    signalShutdown.abort()
    shutdown.interrupt(code)
  }
  // Signals own teardown throughout the startup window, not only after boot()
  // settles: an inserted provider can publish before sibling rows finish mounting.
  // SIGTERM is a supervisor's ordinary stop request and exits 0 on every
  // surface — the launcher does not know whether the app considered its work
  // complete; SIGINT is a user interrupt and reports 130.
  const onSigterm = (): void => { interrupt(0) }
  const onSigint = (): void => { interrupt(130) }
  process.on('SIGTERM', onSigterm)
  process.on('SIGINT', onSigint)
  uninstallFailLoud = installFailLoud(NAME, process, async () => {
    await app.current?.fiber.dispose()
  })
  removeProcessListeners = () => {
    process.off('SIGTERM', onSigterm)
    process.off('SIGINT', onSigint)
    uninstallFailLoud()
```

</details>

#### 缺口

- 未启动固定制品，未验证持久化格式迁移或外部工具中断效果。
  **影响**：不能保证旧宿主会话可无损接续，也不能凭退出码排除遗留操作。
  **进一步探讨**：在副本home和仓库验证新建/恢复/中断，逐一检查工件与远端操作状态。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 默认、full-auto和yolo如何设置，能否视作隔离保证？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

headless参数明确把full-auto描述为工作区无人值守、拒绝更广动作，yolo及其长别名描述为无沙箱和无审批；full-auto与yolo互斥，也不能与显式sandbox/approval选项混用。启动setup实际调用permissionPresets.set或setPolicy，不只在帮助文案显示；缺对应preset会抛错，管理员锁定也会拒绝启动修改。

默认配置workspace-write搭配ask，full-auto为workspace-write加never，danger-full-access为danger-full-access加never。set/apply把sandbox与approval分别写入会话事实，具名preset另有permission/preset事件，故“不弹审批”与“允许任意访问”不是同义词。--add-dir在setup给sandboxPolicy添加可写根，会扩展工作区默认边界；恢复会话也执行同一setup，应复核本次启动选项而不凭历史界面印象。

这些源码可以证明启动策略选择和持久事实写入，不能证明任意操作系统上底层隔离、所有插件工具以及远端服务都在同一个强制边界。本轮未做系统级sandbox审计或攻击实验。任务若必须依赖严格隔离，先核对实际平台适配与工具执行路径；已有官方环境足够时不应为主题或入口差异直接迁移并打开yolo。

#### 证据与依据

**依据 1 · 源码核查**：[packages/bundle/headless/src/startup.ts:90-100](https://github.com/peiyuwang54/deepseek-harness-cli/blob/4acd0f7cc7714d31645e16de50802c796b5d36d5/packages/bundle/headless/src/startup.ts#L90-L100)

无人值守和额外写目录选项有明确不同语义。

<details>
<summary>查看原文（11行）</summary>

```text
    .option('--json', 'print lifecycle and result events as JSONL')
    .option('--ephemeral', 'run without persisting a fresh session')
    .option('-i, --image <file>', 'attach a local image (repeatable)', collect)
    .option('--output-schema <file>', 'JSON Schema file for the final result')
    .option('-o, --output-last-message <file>', 'write the last agent result to a file')
    .option('--full-auto', 'run without prompts inside the workspace; deny wider actions')
    .option('--yolo', 'run unrestricted without approval prompts')
    .option('--dangerously-bypass-approvals-and-sandbox', 'alias for --yolo')
    .option('--add-dir <dir>', 'add a writable directory alongside the workspace (repeatable)', collect)
    .addOption(new Option('-s, --sandbox <mode>', 'select the file sandbox mode').choices([...SANDBOX_MODES]))
    .addOption(new Option('-a, --ask-for-approval <policy>', 'select approval prompting').choices([...APPROVAL_POLICIES]))
```

</details>

**依据 2 · 源码核查**：[packages/bundle/headless/src/startup.ts:128-136](https://github.com/peiyuwang54/deepseek-harness-cli/blob/4acd0f7cc7714d31645e16de50802c796b5d36d5/packages/bundle/headless/src/startup.ts#L128-L136)

权限快捷选项冲突被拒绝。

```text
  const yolo = options.yolo === true || options.dangerouslyBypassApprovalsAndSandbox === true
  if (options.fullAuto === true && yolo) {
    program.error('error: --full-auto and --yolo are mutually exclusive')
  }
  if ((options.fullAuto === true || yolo)
    && (options.sandbox !== undefined || options.askForApproval !== undefined)) {
    program.error('error: --full-auto and --yolo cannot be combined with --sandbox or --ask-for-approval')
  }
  return yolo ? 'yolo' : options.fullAuto === true ? 'full-auto' : 'default'
```

**依据 3 · 源码核查**：[packages/bundle/headless/src/index.ts:180-200](https://github.com/peiyuwang54/deepseek-harness-cli/blob/4acd0f7cc7714d31645e16de50802c796b5d36d5/packages/bundle/headless/src/index.ts#L180-L200)

策略实际应用且缺preset会失败。

<details>
<summary>查看原文（21行）</summary>

```text
/** Apply a startup permission shortcut inside unpublished Agent setup. */
function installPermission(
  ctx: Context,
  agent: Agent,
  mode: HeadlessPermissionMode,
  policy: HeadlessStartupValues['permissionPolicy'],
): void {
  const permissions = ctx.get('permissionPresets')
  if (permissions === undefined) throw new Error('exec permission flags require permission presets')
  if (mode === 'default') {
    if (policy !== undefined) permissions.setPolicy(agent.session, policy)
    return
  }
  const target = mode === 'yolo' ? permissions.fullAccessPreset : permissions.fullAutoPreset
  if (target === undefined) {
    throw new Error(mode === 'yolo'
      ? '--yolo is unavailable because this profile has no unrestricted preset'
      : '--full-auto is unavailable because this profile has no workspace-only unattended preset')
  }
  permissions.set(agent.session, target)
}
```

</details>

**依据 4 · 源码核查**：[packages/interaction/permission-presets/src/index.ts:243-270](https://github.com/peiyuwang54/deepseek-harness-cli/blob/4acd0f7cc7714d31645e16de50802c796b5d36d5/packages/interaction/permission-presets/src/index.ts#L243-L270)

默认三个preset的sandbox/approval组合。

<details>
<summary>查看原文（28行）</summary>

```text
  // Inline schema call: the config catalog walks `static Config` statically.
  static Config: z<Config> = z.object({
    presets: z.dict(z.object({
      sandbox: z.union(SANDBOX_MODES as SandboxMode[]).required(),
      approval: z.union(APPROVAL_POLICIES as ApprovalPolicy[]).required(),
      name: z.string(),
      description: z.string(),
    })).default({
      'workspace-write': {
        sandbox: 'workspace-write', approval: 'ask',
        name: 'workspace-write', description: 'Write inside the workspace and permitted temporary directories; wider retries require approval.',
      },
      'full-auto': {
        sandbox: 'workspace-write', approval: 'never',
        name: 'full-auto', description: 'Run without prompts inside the workspace; wider actions are denied.',
      },
      'danger-full-access': {
        sandbox: 'danger-full-access', approval: 'never',
        name: 'danger-full-access', description: 'Full file access without approval prompts.',
      },
    }),
    defaultPreset: z.string(),
    security: z.object({
      toolAllow: z.array(String).default([]),
      toolDeny: z.array(String).default([]),
      commandAllow: z.array(String).default([]),
      commandDeny: z.array(String).default([]),
      networkAllowlist: z.array(String).default(undefined as unknown as string[]),
```

</details>

**依据 5 · 源码核查**：[packages/interaction/permission-presets/src/index.ts:560-602](https://github.com/peiyuwang54/deepseek-harness-cli/blob/4acd0f7cc7714d31645e16de50802c796b5d36d5/packages/interaction/permission-presets/src/index.ts#L560-L602)

锁定检查、分别写入策略及具名preset事实。

<details>
<summary>查看原文（43行）</summary>

```text
  set(session: Session, name: string): void {
    if (this.security.administratorLocked) throw new Error('permission presets are locked by the administrator policy')
    this.apply(session, name, (policy) =>{  setApprovalPolicy(session, policy) })
  }

  /**
   * Apply independently selected permission knobs without claiming a named
   * preset. The derived current value still resolves to a matching preset when
   * the resulting pair exists in the table, otherwise it becomes `custom`.
   * @param session - Session receiving the startup policy.
   * @param selection - Explicit knobs; omitted fields retain their effective values.
   */
  setPolicy(session: Session, selection: PermissionPolicySelection): void {
    if (this.security.administratorLocked) throw new Error('permission presets are locked by the administrator policy')
    const events = session.events
    if (selection.sandbox !== undefined
      && selection.sandbox !== (effectiveSandboxMode(events) ?? this.ctx.shell.sandboxMode)) {
      setSandboxMode(session, selection.sandbox)
    }
    if (selection.approval !== undefined
      && selection.approval !== (effectiveApprovalPolicy(events) ?? this.ctx.approval.config.policy ?? 'ask')) {
      setApprovalPolicy(session, selection.approval)
    }
  }

  /** Apply one preset with the caller-selected live or initialization policy writer. */
  private apply(session: Session, name: string, setApproval: (policy: ApprovalPolicy) => void): void {
    const spec = this.resolve(name)
    if (this.current(session.events) !== name) {
      session.append('permission/preset', { preset: name })
    }
    const events = session.events
    if (spec.sandbox !== (effectiveSandboxMode(events) ?? this.ctx.shell.sandboxMode)) {
      setSandboxMode(session, spec.sandbox)
    }
    if (spec.approval !== (effectiveApprovalPolicy(events) ?? this.ctx.approval.config.policy ?? 'ask')) {
      setApproval(spec.approval)
    }
  }

  /**
   * Fill every missing permission fact before a session is published. A
   * genuinely fresh session uses the current user default; seeded or partially
```

</details>

**依据 6 · 源码核查**：[packages/bundle/headless/src/index.ts:217-229](https://github.com/peiyuwang54/deepseek-harness-cli/blob/4acd0f7cc7714d31645e16de50802c796b5d36d5/packages/bundle/headless/src/index.ts#L217-L229)

额外可写根先于权限与preset挂载应用。

<details>
<summary>查看原文（13行）</summary>

```text
    const agent = agentCtx.agent
    if (agent === undefined) throw new Error('exec Agent setup has no scoped Agent')
    const selected: ModelSelectionRef = { current: selection, assembled: undefined }
    installModelSelection(agentCtx, selected)
    if (startup.additionalWritableRoots.length > 0) {
      ctx.sandboxPolicy.addWritableRoots(agent.session, startup.additionalWritableRoots)
    }
    installPermission(ctx, agent, startup.permissionMode, startup.permissionPolicy)
    await presets.mount(agentCtx, resolveSessionPreset(agent.session))
    if (schema !== undefined) structured = attachStructuredRuntime(agentCtx, schema)
  }
  const resumeId = await resumeSessionId(ctx, startup)
  if (resumeId !== undefined) {
```

</details>

#### 缺口

- 未全面追踪所有工具到不同平台底层隔离实施。
  **影响**：不能把策略记录等同跨工具/跨平台安全保证；受限任务采用条件未满足。
  **进一步探讨**：选实际OS逐条核对shell/文件工具适配，先验证拒绝越界写和审批路径，再讨论无人值守。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 分发、诊断与升级会给用户增加什么负担？

**研究主题**：依赖、兼容与流程、效果与总成本、工程质量与复用

#### 完整回答

分发脚本与源码开发依赖要分开。源码apps/cli依赖大量workspace包，根声明Node ^22.19.0或>=24.0.0和pnpm；平台npm shim本身需Node运行，但随后spawn对应OS/CPU可执行文件，透传argv和stdio。macOS/Linux的arm64/x64以及Windows x64被接受；缺平台包或不支持架构退出并提示重装。信号仅转发到该直接child，不能据此承诺整个进程树及远端效果都终止。

POSIX安装器先下载tar和同源sha256 sidecar，在临时目录验证哈希，再检查主程序、rg及macOS helper存在；这些失败位于替换前。随后逐个install主程序、rg、helper，创建deepseek/dsh软链，再改shell PATH。它不是多文件原子升级：中途磁盘权限等错误可能已替换部分文件，用户需保留旧版本与路径。哈希检验可查下载损坏，但同源包和哈希一起被替换时不证明发行者真实性；文档把attestation验证留给手动操作，不能写成安装器已自动验签。

doctor是无需启动profile的诊断入口，定义运行时、工作区、home、凭据、MCP、资源和终端检查，MCP probe默认5秒。这里核查诊断入口与参数定义，未逐项证实外部连接、更未执行doctor；诊断pass不构成模型任务质量或隔离验收。首次需要获取正确平台包/凭据并核对配置与别名；持续有模型/API、插件/MCP维护和审查成本；恢复需核查部分升级和会话兼容，退出需恢复原PATH别名、保留原home，不把未知费用/分钟写成零。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/dsh-npm-shim.js:15-64](https://github.com/peiyuwang54/deepseek-harness-cli/blob/4acd0f7cc7714d31645e16de50802c796b5d36d5/scripts/dsh-npm-shim.js#L15-L64)

平台解析、启动失败提示及直接child信号转发。

<details>
<summary>查看原文（50行）</summary>

```text
const OS = { darwin: 'macos', linux: 'linux', win32: 'win' }
const CPU = { arm64: 'arm64', x64: 'x64' }

const os = OS[process.platform]
const cpu = CPU[process.arch]
if (!os || !cpu || (os === 'win' && cpu !== 'x64')) {
  console.error(
    `deepseek-harness-cli: unsupported platform ${process.platform}-${process.arch}. ` +
      'Supported: macOS (arm64, x64), Linux (arm64, x64), and Windows (x64).',
  )
  process.exit(1)
}

const packageName = `@peiyu_wang/deepseek-harness-cli-${os}-${cpu}`
const exeName = os === 'win' ? 'deepseek-harness-cli.exe' : 'deepseek-harness-cli'
let executable
try {
  executable = require.resolve(`${packageName}/bin/${exeName}`)
} catch {
  console.error(
    `deepseek-harness-cli: the ${packageName} package is not installed. ` +
      'Reinstall with: npm install -g @peiyu_wang/deepseek-harness-cli',
  )
  process.exit(1)
}

function failToStart(error) {
  console.error(`deepseek-harness-cli: failed to start ${executable}: ${error.message}`)
  process.exit(1)
}

let child
try {
  child = spawn(executable, process.argv.slice(2), { stdio: 'inherit' })
} catch (error) {
  failToStart(error)
}
child.on('error', failToStart)
const signalHandlers = ['SIGINT', 'SIGTERM', 'SIGHUP'].map((signal) => {
  const forward = () => child.kill(signal)
  process.on(signal, forward)
  return [signal, forward]
})
child.on('exit', (code, signal) => {
  if (signal) {
    for (const [forwardedSignal, listener] of signalHandlers) process.off(forwardedSignal, listener)
    process.kill(process.pid, signal)
  }
  else process.exit(code ?? 0)
})
```

</details>

**依据 2 · 源码核查**：[apps/cli/install/install.sh:116-164](https://github.com/peiyuwang54/deepseek-harness-cli/blob/4acd0f7cc7714d31645e16de50802c796b5d36d5/apps/cli/install/install.sh#L116-L164)

临时下载、同源hash与逐文件安装顺序。

<details>
<summary>查看原文（49行）</summary>

```text
echo "deepseek-harness-cli: installing deepseek-harness-cli ${VERSION} for ${OS}-${ARCH}"
RELEASE_URL="${BASE_URL}/deepseek-harness-cli-v${VERSION}"
TARBALL_URL="${RELEASE_URL}/deepseek-harness-cli-${ARCH}-${OS}.tar.gz"
SHA_URL="${RELEASE_URL}/deepseek-harness-cli-${ARCH}-${OS}.sha256"

# --- download and verify ----------------------------------------------------
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT HUP INT TERM

curl -fsSL "$TARBALL_URL" -o "$TMP/deepseek-harness-cli.tar.gz"
curl -fsSL "$SHA_URL" -o "$TMP/deepseek-harness-cli.tar.gz.sha256"

sha256_of() {
  case "$OS" in
    macos) shasum -a 256 "$1" | awk '{print $1}' ;;
    linux) sha256sum "$1" | awk '{print $1}' ;;
  esac
}

EXPECTED="$(sed 's/[[:space:]].*//' "$TMP/deepseek-harness-cli.tar.gz.sha256")"
ACTUAL="$(sha256_of "$TMP/deepseek-harness-cli.tar.gz")"
if [ "$EXPECTED" != "$ACTUAL" ]; then
  echo "deepseek-harness-cli: checksum mismatch for ${TARBALL_URL}" >&2
  echo "deepseek-harness-cli: expected ${EXPECTED}, got ${ACTUAL}" >&2
  exit 1
fi

# --- install ----------------------------------------------------------------
mkdir -p "$INSTALL_DIR/bin"
tar -xzf "$TMP/deepseek-harness-cli.tar.gz" -C "$TMP"
if [ ! -x "$TMP/bin/deepseek-harness-cli" ]; then
  echo "deepseek-harness-cli: ${TARBALL_URL} did not contain an executable bin/deepseek-harness-cli" >&2
  exit 1
fi
[ -x "$TMP/bin/deepseek-harness-cli-rg" ] || { echo "deepseek-harness-cli: package is missing executable bin/deepseek-harness-cli-rg" >&2; exit 1; }
if [ "$OS" = macos ]; then
  [ -f "$TMP/bin/deepseek-harness-cli-spawn-helper" ] || { echo "deepseek-harness-cli: macOS package is missing bin/deepseek-harness-cli-spawn-helper" >&2; exit 1; }
fi
install -m 0755 "$TMP/bin/deepseek-harness-cli" "$INSTALL_DIR/bin/deepseek-harness-cli"
install -m 0755 "$TMP/bin/deepseek-harness-cli-rg" "$INSTALL_DIR/bin/deepseek-harness-cli-rg"
ln -sf deepseek-harness-cli "$INSTALL_DIR/bin/deepseek"
ln -sf deepseek-harness-cli "$INSTALL_DIR/bin/dsh"
if [ "$OS" = macos ]; then
  install -m 0755 "$TMP/bin/deepseek-harness-cli-spawn-helper" "$INSTALL_DIR/bin/deepseek-harness-cli-spawn-helper"
fi

echo "deepseek-harness-cli: installed $INSTALL_DIR/bin/deepseek and $INSTALL_DIR/bin/dsh"

# --- PATH -------------------------------------------------------------------
```

</details>

**依据 3 · 源码核查**：[apps/cli/install/install.sh:166-185](https://github.com/peiyuwang54/deepseek-harness-cli/blob/4acd0f7cc7714d31645e16de50802c796b5d36d5/apps/cli/install/install.sh#L166-L185)

PATH修改也属于安装影响。

<details>
<summary>查看原文（20行）</summary>

```text
  rc="$1"
  [ -f "$rc" ] || touch "$rc"
  if ! grep -qF "$INSTALL_DIR/bin" "$rc" 2>/dev/null; then
    printf '\nexport PATH="%s/bin:$PATH"\n' "$INSTALL_DIR" >> "$rc"
    echo "deepseek-harness-cli: added $INSTALL_DIR/bin to PATH in $rc"
  fi
}

case "${SHELL:-}" in
  *fish)
    fish_dir="${XDG_CONFIG_HOME:-$HOME/.config}/fish/conf.d"
    mkdir -p "$fish_dir"
    printf 'set -gx PATH "%s/bin" $PATH\n' "$INSTALL_DIR" > "$fish_dir/deepseek-harness-cli.fish"
    echo "deepseek-harness-cli: added $INSTALL_DIR/bin to PATH in $fish_dir/deepseek-harness-cli.fish"
    ;;
  *zsh)
    add_to_rc "$HOME/.zshrc"
    ;;
  *bash)
    add_to_rc "$HOME/.bashrc"
```

</details>

**依据 4 · 作者声明**：[apps/cli/install/README.md:50-66](https://github.com/peiyuwang54/deepseek-harness-cli/blob/4acd0f7cc7714d31645e16de50802c796b5d36d5/apps/cli/install/README.md#L50-L66)

文档区分checksum和手动attestation，非真实制品验收。

<details>
<summary>查看原文（17行）</summary>

````text
## Download recovery

The PowerShell installer applies the timeout and retry policy to release discovery, the tarball, and its checksum sidecar. It deletes an incomplete temporary file before retrying and reports the failing URL after the final attempt. A failed download or checksum check does not replace an existing installation.

## Integrity

The installer verifies the tarball against the `deepseek-harness-cli-<arch>-<os>.sha256` sidecar published with the same release and aborts on mismatch without touching an already-installed binary. This detects corruption; replacing both files can bypass it.

The release workflow signs GitHub build provenance for each tarball. To verify a downloaded tarball before installation, use GitHub CLI and require this repository's release workflow identity:

```sh
gh attestation verify deepseek-harness-cli-x64-linux.tar.gz \
  --repo peiyuwang54/deepseek-harness-cli \
  --signer-workflow peiyuwang54/deepseek-harness-cli/.github/workflows/deepseek-harness-cli-release.yml
```

This explicit verification requires an attestation produced by the release workflow; older releases without one fail verification. The installers and Homebrew cask automatically check checksums only. npm publications also request provenance; switching registry authentication to Trusted Publishing requires the package owner to configure the npm trusted publisher first.
````

</details>

**依据 5 · 源码核查**：[apps/cli/src/doctor.ts:1-11](https://github.com/peiyuwang54/deepseek-harness-cli/blob/4acd0f7cc7714d31645e16de50802c796b5d36d5/apps/cli/src/doctor.ts#L1-L11)

doctor无需profile但可调用MCP探测。

<details>
<summary>查看原文（11行）</summary>

```text
/** Boot-free installation and environment diagnostics for the CLI. */

import { accessSync, constants, existsSync, readFileSync, statSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { platform as hostPlatform, release } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { resolveDshHome } from '@deepseek-ai/dsh-home-paths'
import { probeMcpConnection } from '@deepseek-ai/dsh-mcp-client'
import { managedMcpTargets } from './mcp.ts'
```

</details>

**依据 6 · 源码核查**：[apps/cli/src/doctor.ts:55-90](https://github.com/peiyuwang54/deepseek-harness-cli/blob/4acd0f7cc7714d31645e16de50802c796b5d36d5/apps/cli/src/doctor.ts#L55-L90)

诊断范围、默认超时和参数解析。

<details>
<summary>查看原文（36行）</summary>

```text

const USAGE = `Usage:
  deepseek doctor [--json] [--mcp-timeout-ms N]

Checks the Node runtime, workspace, harness home, API credentials, MCP catalog,
enabled MCP connections, runtime assets, and terminal capabilities without
booting a profile.`

const MIN_NODE = { major: 22, minor: 19, patch: 0 }
const DEFAULT_MCP_PROBE_TIMEOUT_MS = 5_000

interface DoctorArguments {
  readonly json: boolean
  readonly mcpTimeoutMs: number
}

function parseDoctorArguments(args: readonly string[]): DoctorArguments {
  let json = false
  let mcpTimeoutMs = DEFAULT_MCP_PROBE_TIMEOUT_MS
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]
    if (argument === '--json') {
      json = true
      continue
    }
    if (argument === '--mcp-timeout-ms') {
      const raw = args[index + 1]
      if (raw === undefined) throw new Error('--mcp-timeout-ms needs a positive integer')
      const parsed = Number(raw)
      if (!Number.isSafeInteger(parsed) || parsed <= 0) throw new Error('--mcp-timeout-ms needs a positive integer')
      mcpTimeoutMs = parsed
      index += 1
      continue
    }
    throw new Error(`unknown option ${JSON.stringify(argument)}`)
  }
```

</details>

**依据 7 · 源码核查**：[apps/cli/package.json:24-65](https://github.com/peiyuwang54/deepseek-harness-cli/blob/4acd0f7cc7714d31645e16de50802c796b5d36d5/apps/cli/package.json#L24-L65)

源码模式依赖workspace组合，不等同单文件制品。

<details>
<summary>查看原文（42行）</summary>

```text
    "@deepseek-ai/cordis-plugin-hmr": "workspace:^",
    "@deepseek-ai/cordis-plugin-include": "workspace:^",
    "@deepseek-ai/cordis-plugin-loader": "workspace:^",
    "@deepseek-ai/cordis-plugin-timer": "workspace:^",
    "@deepseek-ai/dsh-agent-tool-presentation": "workspace:^",
    "@deepseek-ai/dsh-app-boot": "workspace:^",
    "@deepseek-ai/dsh-atomic-write": "workspace:^",
    "@deepseek-ai/dsh-base": "workspace:^",
    "@deepseek-ai/dsh-cordis-client-runner": "workspace:^",
    "@deepseek-ai/dsh-client-ui-agent-preset": "workspace:^",
    "@deepseek-ai/dsh-client-ui-cordis": "workspace:^",
    "@deepseek-ai/dsh-client-ui-directory-picker-browse": "workspace:^",
    "@deepseek-ai/dsh-client-ui-directory-picker-native": "workspace:^",
    "@deepseek-ai/dsh-command-compact": "workspace:^",
    "@deepseek-ai/dsh-command-goal": "workspace:^",
    "@deepseek-ai/dsh-compaction-basic": "workspace:^",
    "@deepseek-ai/dsh-compaction-tool-result-pruner": "workspace:^",
    "@deepseek-ai/dsh-goal": "workspace:^",
    "@deepseek-ai/dsh-goal-round-driver": "workspace:^",
    "@deepseek-ai/dsh-cmdline": "workspace:^",
    "@deepseek-ai/dsh-launch-environment": "workspace:^",
    "@deepseek-ai/dsh-fs-local": "workspace:^",
    "@deepseek-ai/dsh-headless": "workspace:^",
    "@deepseek-ai/dsh-mcp-client": "workspace:^",
    "@deepseek-ai/dsh-mcp": "workspace:^",
    "@deepseek-ai/dsh-home-paths": "workspace:^",
    "@deepseek-ai/dsh-host-directory-picker-browse": "workspace:^",
    "@deepseek-ai/dsh-host-directory-picker-native": "workspace:^",
    "@deepseek-ai/dsh-persona": "workspace:^",
    "@deepseek-ai/dsh-plan-mode": "workspace:^",
    "@deepseek-ai/dsh-terminal": "workspace:^",
    "@deepseek-ai/dsh-terminal-bash": "workspace:^",
    "@deepseek-ai/dsh-pwsh-local": "workspace:^",
    "@deepseek-ai/dsh-pwsh-sandbox": "workspace:^",
    "@deepseek-ai/dsh-session-projection": "workspace:^",
    "@deepseek-ai/dsh-session-reference": "workspace:^",
    "@deepseek-ai/dsh-time-context": "workspace:^",
    "@deepseek-ai/dsh-skill": "workspace:^",
    "@deepseek-ai/dsh-skill-filesystem": "workspace:^",
    "@deepseek-ai/dsh-jobs-local": "workspace:^",
    "@deepseek-ai/dsh-tmux-context": "workspace:^",
    "@deepseek-ai/dsh-token-meter": "workspace:^",
```

</details>

#### 缺口

- 没有核实发布制品与此源码的可追溯对应，也没安装或检查实际平台包。
  **影响**：跨平台可用性、升级恢复和分发便利仍仅有实现路径支持。
  **进一步探讨**：先固定发行tag/包版本、验证来源与hash/attestation，在副本环境检查安装、别名、doctor和恢复旧版。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 现在是否值得迁移，可验证怎样的增量？

**研究主题**：采用判断、新假设与验证、效果与总成本

#### 完整回答

当前应观察，保留已有官方宿主和工作配置；并不是认为CLI无法运行，而是尚未固定fork相对官方的独有收益、分发制品对应与home兼容，整个宿主替换成本比普通插件更大。确有CLI需求的开发者可把后续验证缩成不接敏感数据的副本仓库与独立home：先固定版本和官方对照，查别名命中路径、默认权限、一次受控exec与结构输出、会话恢复和异常中断，然后检查代码工件及自己的测试。验证前不让安装流程覆盖正在用的dsh路径。

可推导的研究假设是：平台shim和无需profile的doctor，是否比同版本官方现有安装/排障路径降低从空环境到首个可验收任务的摩擦。它来自明确的平台解析与诊断链，不是假设整个Agent能力新增；先比较双方是否已有同等路径，若已有则差异假设被直接削弱。固定OS、网络、模型、仓库任务，记录安装成功率、人工操作与排错时间、恢复旧版结果，并独立检查最终代码质量和权限拒绝。若只是安装更快但任务失败、权限条件变宽或升级恢复更差，不能算净收益。此比较未执行，不计作已有创新。

停止条件是制品不能绑定源码、同等官方路径已够用、配置迁移/权限不可解释或主任务验收退步。退路是保留旧发行物、独立配置与原PATH，回到原官方CLI或现有DSH界面；报告不把删除可执行文件等同清理模型服务上的外部状态。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/dsh-npm-shim.js:15-38](https://github.com/peiyuwang54/deepseek-harness-cli/blob/4acd0f7cc7714d31645e16de50802c796b5d36d5/scripts/dsh-npm-shim.js#L15-L38)

平台包解析为待比较的分发机制，而非已测节时。

<details>
<summary>查看原文（24行）</summary>

```text
const OS = { darwin: 'macos', linux: 'linux', win32: 'win' }
const CPU = { arm64: 'arm64', x64: 'x64' }

const os = OS[process.platform]
const cpu = CPU[process.arch]
if (!os || !cpu || (os === 'win' && cpu !== 'x64')) {
  console.error(
    `deepseek-harness-cli: unsupported platform ${process.platform}-${process.arch}. ` +
      'Supported: macOS (arm64, x64), Linux (arm64, x64), and Windows (x64).',
  )
  process.exit(1)
}

const packageName = `@peiyu_wang/deepseek-harness-cli-${os}-${cpu}`
const exeName = os === 'win' ? 'deepseek-harness-cli.exe' : 'deepseek-harness-cli'
let executable
try {
  executable = require.resolve(`${packageName}/bin/${exeName}`)
} catch {
  console.error(
    `deepseek-harness-cli: the ${packageName} package is not installed. ` +
      'Reinstall with: npm install -g @peiyu_wang/deepseek-harness-cli',
  )
  process.exit(1)
```

</details>

**依据 2 · 源码核查**：[apps/cli/src/doctor.ts:55-64](https://github.com/peiyuwang54/deepseek-harness-cli/blob/4acd0f7cc7714d31645e16de50802c796b5d36d5/apps/cli/src/doctor.ts#L55-L64)

无需profile和有界MCP超时为排障假设依据。

<details>
<summary>查看原文（10行）</summary>

```text

const USAGE = `Usage:
  deepseek doctor [--json] [--mcp-timeout-ms N]

Checks the Node runtime, workspace, harness home, API credentials, MCP catalog,
enabled MCP connections, runtime assets, and terminal capabilities without
booting a profile.`

const MIN_NODE = { major: 22, minor: 19, patch: 0 }
const DEFAULT_MCP_PROBE_TIMEOUT_MS = 5_000
```

</details>

**依据 3 · 源码核查**：[apps/cli/install/install.sh:147-164](https://github.com/peiyuwang54/deepseek-harness-cli/blob/4acd0f7cc7714d31645e16de50802c796b5d36d5/apps/cli/install/install.sh#L147-L164)

多文件替换和别名修改决定可逆验证要求。

<details>
<summary>查看原文（18行）</summary>

```text
  echo "deepseek-harness-cli: ${TARBALL_URL} did not contain an executable bin/deepseek-harness-cli" >&2
  exit 1
fi
[ -x "$TMP/bin/deepseek-harness-cli-rg" ] || { echo "deepseek-harness-cli: package is missing executable bin/deepseek-harness-cli-rg" >&2; exit 1; }
if [ "$OS" = macos ]; then
  [ -f "$TMP/bin/deepseek-harness-cli-spawn-helper" ] || { echo "deepseek-harness-cli: macOS package is missing bin/deepseek-harness-cli-spawn-helper" >&2; exit 1; }
fi
install -m 0755 "$TMP/bin/deepseek-harness-cli" "$INSTALL_DIR/bin/deepseek-harness-cli"
install -m 0755 "$TMP/bin/deepseek-harness-cli-rg" "$INSTALL_DIR/bin/deepseek-harness-cli-rg"
ln -sf deepseek-harness-cli "$INSTALL_DIR/bin/deepseek"
ln -sf deepseek-harness-cli "$INSTALL_DIR/bin/dsh"
if [ "$OS" = macos ]; then
  install -m 0755 "$TMP/bin/deepseek-harness-cli-spawn-helper" "$INSTALL_DIR/bin/deepseek-harness-cli-spawn-helper"
fi

echo "deepseek-harness-cli: installed $INSTALL_DIR/bin/deepseek and $INSTALL_DIR/bin/dsh"

# --- PATH -------------------------------------------------------------------
```

</details>

**依据 4 · 源码核查**：[packages/bundle/headless/src/index.ts:298-315](https://github.com/peiyuwang54/deepseek-harness-cli/blob/4acd0f7cc7714d31645e16de50802c796b5d36d5/packages/bundle/headless/src/index.ts#L298-L315)

输出与退出只约束回合和schema，业务工件另验收。

<details>
<summary>查看原文（18行）</summary>

```text
  }
  if (jsonl !== undefined) {
    if (captured !== undefined) jsonl.structuredResult(captured.value)
    jsonl.finish(structuredMissing
      ? 'the model completed without reporting schema-valid structured output'
      : outcome.reason === undefined
        ? 'the run ended without a turn result'
        : undefined)
  } else {
    io.stdout.write(`${resultText}\n`)
    if (structuredMissing) {
      io.stderr.write('deepseek exec: the model completed without reporting schema-valid structured output\n')
    } else if (outcome.reason?.kind === 'error') {
      io.stderr.write(`deepseek exec: ${outcome.reason.error.code}: ${outcome.reason.error.message}\n`)
    }
  }
  io.exit(outcome.reason?.kind === 'completed' && !structuredMissing ? 0 : 1)
}
```

</details>

**依据 5 · 作者声明**：[README.md:17-18](https://github.com/peiyuwang54/deepseek-harness-cli/blob/4acd0f7cc7714d31645e16de50802c796b5d36d5/README.md#L17-L18)

官方同步关系使固定上游比较成为迁移前提。

```text
**Note:** This is DeepSeek Harness CLI. We keep iterating in sync with the official [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness), and we look forward to your forks and stars.

```

#### 缺口

- 未证明分发和排障优于同版本官方，也无净采用收益。
  **影响**：不支持直接替换现有工作宿主或持续采用。
  **进一步探讨**：固定官方/分支与对应制品，在副本环境比较首个合格任务、权限和回滚成本；无差异则停止迁移。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
