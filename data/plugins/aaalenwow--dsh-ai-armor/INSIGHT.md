# dsh-ai-armor

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[dedf8d3](https://github.com/AAAlenwow/dsh-ai-armor/tree/dedf8d32fcaaa70e8584f432ba1c63b103f133dc)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：将Git回归、堆栈、配置、shell转义和MyBatis Plus静态审计工具合并分发。

> **核心亮点**：将五个既有子插件统一装载，降低发现与安装入口数量，但没有形成跨工具联合诊断机制。它相对“分别安装五个子插件，或直接使用 Git、配置解析器、IDE 检查和人工审阅”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

> **风险与缺陷**：其中 bisect 需要执行复现脚本并切换 Git 状态，不能把整包概括为完全不执行代码或无副作用。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 目标用户、反复任务、原有办法与合格结果是什么？](#detail-section-11)
  - [Q02 · 入口、调用链、数据和状态如何实现核心能力？](#detail-section-12)
  - [Q03 · 相比宿主原生能力和简单替代，具体增量与归属是什么？](#detail-section-13)
  - [Q04 · 什么前提最可能使核心贡献无法转化为端到端价值？](#detail-section-14)
  - [Q05 · 启动、持续生效和失败恢复各依赖什么，操作负担由谁承担？](#detail-section-15)
  - [Q06 · 完成一个合格任务的首次、持续和失败恢复成本与效果是什么？](#detail-section-16)
  - [Q07 · 实现是否可靠可维护，哪些设计可复用，移植代价是什么？](#detail-section-17)
  - [Q08 · 由贡献与反例可推导什么未验证方向，如何证伪？](#detail-section-18)
  - [Q09 · 对谁值得观察或试用，成功与停止标准是什么？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望在 AI 改码后按事故类型调用定向诊断工具的开发者可用它一次安装注册 Git 回归定位、堆栈解码、配置校验、跨平台 shell 转义和 SQL 静态审计工具；合格结果是输出可回指提交、堆栈、配置或 SQL 位置，并经项目测试或人工复核。详见[Q01](#research-q01)。

基线是分别安装五个子插件，或直接使用 Git、配置解析器、IDE 检查和人工审阅。本项的价值主要来自将五个既有子插件统一装载，降低发现与安装入口数量，但没有形成跨工具联合诊断机制；尚无同任务、同资源与同验收口径的运行对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Git 回归定位 | 提供最近变更、blame、introducer 与可复现 bisect。 | 仅确认固定源码存在；运行效果、规模与兼容范围未做宿主验收 |
| 故障材料解码 | 解析堆栈和配置问题并输出定位。 | 仅确认固定源码存在；运行效果、规模与兼容范围未做宿主验收 |
| 命令与SQL审计 | 提供跨平台 shell 转义和 MyBatis Plus 静态检查。 | 仅确认固定源码存在；运行效果、规模与兼容范围未做宿主验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH tools/Web 与 bundle patch | 必需 | 动态加载五个子插件工具定义 | 任一子插件加载失败需列出缺失工具 |
| Git仓库与可重复 repro shell | 仅 bisect 必需 | 切换历史提交并执行复现脚本 | 脏工作树或不可审阅命令时禁用 |
| 待分析源码/堆栈/配置/MyBatis代码 | 按工具必需 | 提供具体诊断输入 | 输入类型不匹配时不得给通用结论 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 按事故类型选择一个工具而非整包盲跑 | 输入和预期 finding 明确 |
| 2 | 静态工具直接分析；bisect 先复制到临时 worktree 并展示 repro | 主工作树不被切换 |
| 3 | 用项目测试或人工证据复核 finding | 误报被标记，临时 worktree 删除前保存定位 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地CPU/磁盘与一个bundle安装 | 审阅八个工具权限和适用输入 | 比五包分装节省多少分钟未知 |
| 持续使用 | 静态解析/Git历史遍历资源 | 选择工具、准备输入、复核 finding | 各工具准确率与复核分钟未知 |
| 失败恢复 | bisect重复测试和临时副本空间 | 恢复Git状态、终止repro、清理副本 | 历史脚本造成外部副作用时不可由Git回滚 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 统一分发 | 入口循环注册五个子插件工具 | 部分加载失败是否隔离 |
| 定向诊断 | 各子插件有独立规则/解析器 | 真实项目误报漏报与净节时 |
| Git定位 | bisect可执行repro并定位提交 | 不可信历史提交与脚本副作用 |

> **思考**：其中 bisect 需要执行复现脚本并切换 Git 状态，不能把整包概括为完全不执行代码或无副作用。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将五个既有子插件统一装载，降低发现与安装入口数量，但没有形成跨工具联合诊断机制。它相对“分别安装五个子插件，或直接使用 Git、配置解析器、IDE 检查和人工审阅”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

将五个既有子插件统一装载，降低发现与安装入口数量，但没有形成跨工具联合诊断机制。它相对“分别安装五个子插件，或直接使用 Git、配置解析器、IDE 检查和人工审阅”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

固定源码把关键职责收敛到 lib/index.js 及其相邻模块，便于追踪入口与状态。可借鉴的是显式宿主接线与配置边界；移植仍需重做 API 兼容、权限、持久化和“用项目测试或人工证据复核 finding｜误报被标记，临时 worktree 删除前保存定位”验证。详见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

其中 bisect 需要执行复现脚本并切换 Git 状态，不能把整包概括为完全不执行代码或无副作用。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

可先试用静态只读工具；Git bisect只应在干净的可丢弃副本和审阅过的复现命令中运行。 采用结论是试用，不是安装保证；成功与停止标准见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献为源码支持的宿主接线与流程组合；效果、兼容和恢复没有真实宿主证据。未来方向保持未验证，不计入当前贡献。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅核查固定提交的作者材料、包清单、关键源码和完整组件 inventory；未运行插件、测试、安装、外部服务或真实宿主任务。
- 下一步：选取每类10个已知真值样本，对照原生命令/独立工具，记录正确finding数、误报、人工复核分钟；bisect只在临时worktree运行并监控网络/文件副作用，主工作树变化即否定安全采用。

**分析版本**

- **仓库**：[AAAlenwow/dsh-ai-armor](https://github.com/AAAlenwow/dsh-ai-armor)
- **版本号**：0.1.0（[固定提交 dedf8d3](https://github.com/AAAlenwow/dsh-ai-armor/tree/dedf8d32fcaaa70e8584f432ba1c63b103f133dc)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未来可探索：可按场景延迟注册工具，并把 bisect 固定在临时 worktree 与显式命令预览中，降低误选与仓库副作用。该方向由现有贡献与限制推导，尚未实现；失败或恢复负担不改善即应否定。详见[Q08](#research-q08)。

选取每类10个已知真值样本，对照原生命令/独立工具，记录正确finding数、误报、人工复核分钟；bisect只在临时worktree运行并监控网络/文件副作用，主工作树变化即否定安全采用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 18 | 2260 | 1756 | 355 | — |
| .md | source | 8 | 531 | — | — | 3479 |
| .mjs | test | 11 | 1133 | 929 | 110 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/AAAlenwow/dsh-ai-armor/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：确认 dsh-ai-armor 在固定版本中实际实现了什么、相对基线的贡献与关键限制，并给出有证据边界的采用和未来验证结论。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 目标用户、反复任务、原有办法与合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

目标用户是希望在 AI 改码后按事故类型调用定向诊断工具的开发者。反复任务是一次安装注册 Git 回归定位、堆栈解码、配置校验、跨平台 shell 转义和 SQL 静态审计工具。原有办法为分别安装五个子插件，或直接使用 Git、配置解析器、IDE 检查和人工审阅。合格结果必须达到“输出可回指提交、堆栈、配置或 SQL 位置，并经项目测试或人工复核”，不能以安装成功、工具注册或一次演示替代。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-19](https://github.com/AAAlenwow/dsh-ai-armor/blob/dedf8d32fcaaa70e8584f432ba1c63b103f133dc/README.md#L1-L19)

作者材料限定目标任务和操作入口；研究回答另加合格交付标准。

<details>
<summary>查看原文（19行）</summary>

````text
# dsh-ai-armor

> **AI 写代码后,一次性定位 5 类常见生产事故的"护甲"。** 一次安装,5 个工具,8 个 tool slot,都是给"AI 写完代码"那一刻准备的——stack trace 来了、解码;git 出 bug 了、二分定位;config 改坏了、校验;shell 命令拼错了、跨平台转义;MyBatis Plus SQL 写糙了、静态审计。

## 这个 bundle 里有什么

| 子插件 | 工具 | 解决的生产问题 |
|--------|------|----------------|
| **[dsh-when-broke](./plugins/dsh-when-broke/README.md)** | `when_broke_find_introducer`<br>`when_broke_recent_changes`<br>`when_broke_bisect_with_repro`<br>`when_broke_blame_age` | 这段代码从哪个 commit 来的?最近谁动过这个文件?线上 bug 是哪个 commit 引入的?这行代码新写的还是老的? |
| **[dsh-stackdecoder](./plugins/dsh-stackdecoder/README.md)** | `decode_stack` | AI 拿到一段堆栈文本,1 次调用解析出每帧 file:line + 上下文代码片段,不用逐帧 read_file 来回问 |
| **[dsh-config-guard](./plugins/dsh-config-guard/README.md)** | `validate_config` | AI 改完 application.yml / .env / .properties 后,验证有没有重复键、tab 缩进、键名打错、缺必需字段 |
| **[dsh-cmd-shield](./plugins/dsh-cmd-shield/README.md)** | `build_shell_invocation` | AI 拼 shell 命令经常被引号/`$`/CJK/路径空格搞坏(尤其 Windows),这个工具替 agent 做转义,POSIX/PowerShell/cmd 各家规则都对齐 |
| **[dsh-mp-auditor](./plugins/dsh-mp-auditor/README.md)** | `audit_mp_code` | 扫 MyBatis Plus 项目,挑出 N+1 / 漏 `@Transactional` / `LIKE '%xxx%'` / `SELECT *` / 缺 WHERE 的 UPDATE/DELETE |

## 安装

```bash
dsh plugin add AAAlenwow/dsh-ai-armor
```
````

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 入口、调用链、数据和状态如何实现核心能力？

**研究主题**：功能与机制

#### 完整回答

lib/index.js 中的固定片段显示关键入口、注册或生命周期接线，包清单限定加载组件。实际链路围绕“按事故类型选择一个工具而非整包盲跑｜输入和预期 finding 明确；静态工具直接分析；bisect 先复制到临时 worktree 并展示 repro｜主工作树不被切换；用项目测试或人工证据复核 finding｜误报被标记，临时 worktree 删除前保存定位”推进，状态发生在插件配置、宿主服务或外部目标中。静态路径只能证明机制存在，不能证明注册后所有分支可运行。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:29-45](https://github.com/AAAlenwow/dsh-ai-armor/blob/dedf8d32fcaaa70e8584f432ba1c63b103f133dc/lib/index.js#L29-L45)

关键源码片段支持入口、注册或生命周期接线。

<details>
<summary>查看原文（17行）</summary>

```text
export const name = "dsh-ai-armor";
export const inject = ["tools"];

export async function apply(ctx) {
  for (const sp of subPlugins) {
    try {
      const mod = await import(sp.path);
      const tools = mod.tools || [];
      for (const t of tools) ctx.tools.register(t);
      ctx.logger?.info?.(
        `dsh-ai-armor: registered ${tools.length} tools from ${sp.name} (${tools.map((t) => t.name).join(", ")})`
      );
    } catch (e) {
      ctx.logger?.error?.(`dsh-ai-armor: failed to load ${sp.name}: ${e.message}`);
    }
  }
}
```

</details>

**依据 2 · 作者声明**：[package.json:1-26](https://github.com/AAAlenwow/dsh-ai-armor/blob/dedf8d32fcaaa70e8584f432ba1c63b103f133dc/package.json#L1-L26)

包清单绑定版本、入口和宿主声明。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "dsh-ai-armor",
  "version": "0.1.0",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/AAAlenwow/dsh-ai-armor.git"
  },
  "description": "Five production-grade DSH tools (when-broke, stackdecoder, config-guard, cmd-shield, mp-auditor) bundled into one plugin: git regression finder, stack-trace decoder, config-file validator, cross-platform shell escape, MyBatis Plus SQL auditor. 五个生产级 DSH 工具合一：git 回归定位、堆栈解码、配置校验、跨平台 shell 转义、MyBatis Plus SQL 审计。",
  "keywords": [
    "deepseek-harness",
    "dsh",
    "dsh-plugin",
    "git",
    "stack-trace",
    "config",
    "shell",
    "mybatis-plus",
    "sql-audit",
    "ai-safety"
  ],
  "license": "MIT",
  "main": "./lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./package.json": "./package.json"
  },
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相比宿主原生能力和简单替代，具体增量与归属是什么？

**研究主题**：贡献与相对优势

#### 完整回答

研究者识别的增量是将五个既有子插件统一装载，降低发现与安装入口数量，但没有形成跨工具联合诊断机制。参照是“分别安装五个子插件，或直接使用 Git、配置解析器、IDE 检查和人工审阅”。贡献归属于本插件的集成、状态编排或工作流封装，不把外部服务、上游算法或子组件能力重复算作原创，也不从功能数量推断用户收益。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:29-45](https://github.com/AAAlenwow/dsh-ai-armor/blob/dedf8d32fcaaa70e8584f432ba1c63b103f133dc/lib/index.js#L29-L45)

源码证明本插件承担接线或编排，而非仅有文字描述。

<details>
<summary>查看原文（17行）</summary>

```text
export const name = "dsh-ai-armor";
export const inject = ["tools"];

export async function apply(ctx) {
  for (const sp of subPlugins) {
    try {
      const mod = await import(sp.path);
      const tools = mod.tools || [];
      for (const t of tools) ctx.tools.register(t);
      ctx.logger?.info?.(
        `dsh-ai-armor: registered ${tools.length} tools from ${sp.name} (${tools.map((t) => t.name).join(", ")})`
      );
    } catch (e) {
      ctx.logger?.error?.(`dsh-ai-armor: failed to load ${sp.name}: ${e.message}`);
    }
  }
}
```

</details>

**依据 2 · 作者声明**：[README.md:1-19](https://github.com/AAAlenwow/dsh-ai-armor/blob/dedf8d32fcaaa70e8584f432ba1c63b103f133dc/README.md#L1-L19)

README 提供作者主张，用于与源码可见机制分开比较。

<details>
<summary>查看原文（19行）</summary>

````text
# dsh-ai-armor

> **AI 写代码后,一次性定位 5 类常见生产事故的"护甲"。** 一次安装,5 个工具,8 个 tool slot,都是给"AI 写完代码"那一刻准备的——stack trace 来了、解码;git 出 bug 了、二分定位;config 改坏了、校验;shell 命令拼错了、跨平台转义;MyBatis Plus SQL 写糙了、静态审计。

## 这个 bundle 里有什么

| 子插件 | 工具 | 解决的生产问题 |
|--------|------|----------------|
| **[dsh-when-broke](./plugins/dsh-when-broke/README.md)** | `when_broke_find_introducer`<br>`when_broke_recent_changes`<br>`when_broke_bisect_with_repro`<br>`when_broke_blame_age` | 这段代码从哪个 commit 来的?最近谁动过这个文件?线上 bug 是哪个 commit 引入的?这行代码新写的还是老的? |
| **[dsh-stackdecoder](./plugins/dsh-stackdecoder/README.md)** | `decode_stack` | AI 拿到一段堆栈文本,1 次调用解析出每帧 file:line + 上下文代码片段,不用逐帧 read_file 来回问 |
| **[dsh-config-guard](./plugins/dsh-config-guard/README.md)** | `validate_config` | AI 改完 application.yml / .env / .properties 后,验证有没有重复键、tab 缩进、键名打错、缺必需字段 |
| **[dsh-cmd-shield](./plugins/dsh-cmd-shield/README.md)** | `build_shell_invocation` | AI 拼 shell 命令经常被引号/`$`/CJK/路径空格搞坏(尤其 Windows),这个工具替 agent 做转义,POSIX/PowerShell/cmd 各家规则都对齐 |
| **[dsh-mp-auditor](./plugins/dsh-mp-auditor/README.md)** | `audit_mp_code` | 扫 MyBatis Plus 项目,挑出 N+1 / 漏 `@Transactional` / `LIKE '%xxx%'` / `SELECT *` / 缺 WHERE 的 UPDATE/DELETE |

## 安装

```bash
dsh plugin add AAAlenwow/dsh-ai-armor
```
````

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么前提最可能使核心贡献无法转化为端到端价值？

**研究主题**：缺陷与关键质疑

#### 完整回答

最有力支持是固定源码确有相应接线；最关键反例或其他解释是其中 bisect 需要执行复现脚本并切换 Git 状态，不能把整包概括为完全不执行代码或无副作用。若失败后不能判断副作用是否已发生，局部自动化可能把恢复负担转移给用户。该问题不直接否定插件，但会把适用范围收窄到可隔离、可回读的任务。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:29-45](https://github.com/AAAlenwow/dsh-ai-armor/blob/dedf8d32fcaaa70e8584f432ba1c63b103f133dc/lib/index.js#L29-L45)

源码显示关键状态边界，也说明为什么需要运行时故障验证。

<details>
<summary>查看原文（17行）</summary>

```text
export const name = "dsh-ai-armor";
export const inject = ["tools"];

export async function apply(ctx) {
  for (const sp of subPlugins) {
    try {
      const mod = await import(sp.path);
      const tools = mod.tools || [];
      for (const t of tools) ctx.tools.register(t);
      ctx.logger?.info?.(
        `dsh-ai-armor: registered ${tools.length} tools from ${sp.name} (${tools.map((t) => t.name).join(", ")})`
      );
    } catch (e) {
      ctx.logger?.error?.(`dsh-ai-armor: failed to load ${sp.name}: ${e.message}`);
    }
  }
}
```

</details>

#### 缺口

- 缺少针对“其中 bisect 需要执行复现脚本并切换 Git 状态，不能把整包概括为完全不执行代码或无副作用”的固定版本故障注入记录
  **影响**：无法确认核心贡献在异常路径仍成立
  **进一步探讨**：选取每类10个已知真值样本，对照原生命令/独立工具，记录正确finding数、误报、人工复核分钟；bisect只在临时worktree运行并监控网络/文件副作用，主工作树变化即否定安全采用。 本题重点观察异常是否改变贡献结论。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、持续生效和失败恢复各依赖什么，操作负担由谁承担？

**研究主题**：依赖、兼容与流程

#### 完整回答

关键依赖分别是：DSH tools/Web 与 bundle patch｜必需｜动态加载五个子插件工具定义｜任一子插件加载失败需列出缺失工具；Git仓库与可重复 repro shell｜仅 bisect 必需｜切换历史提交并执行复现脚本｜脏工作树或不可审阅命令时禁用；待分析源码/堆栈/配置/MyBatis代码｜按工具必需｜提供具体诊断输入｜输入类型不匹配时不得给通用结论。启动者负责版本与权限，使用者负责输入和验收，维护者负责外部服务/API 漂移。失败恢复按“用项目测试或人工证据复核 finding｜误报被标记，临时 worktree 删除前保存定位”执行；包依赖存在或工具可注册都不表示业务已经办结。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:1-26](https://github.com/AAAlenwow/dsh-ai-armor/blob/dedf8d32fcaaa70e8584f432ba1c63b103f133dc/package.json#L1-L26)

包清单提供运行时、依赖和分发边界。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "dsh-ai-armor",
  "version": "0.1.0",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/AAAlenwow/dsh-ai-armor.git"
  },
  "description": "Five production-grade DSH tools (when-broke, stackdecoder, config-guard, cmd-shield, mp-auditor) bundled into one plugin: git regression finder, stack-trace decoder, config-file validator, cross-platform shell escape, MyBatis Plus SQL auditor. 五个生产级 DSH 工具合一：git 回归定位、堆栈解码、配置校验、跨平台 shell 转义、MyBatis Plus SQL 审计。",
  "keywords": [
    "deepseek-harness",
    "dsh",
    "dsh-plugin",
    "git",
    "stack-trace",
    "config",
    "shell",
    "mybatis-plus",
    "sql-audit",
    "ai-safety"
  ],
  "license": "MIT",
  "main": "./lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./package.json": "./package.json"
  },
```

</details>

**依据 2 · 源码核查**：[lib/index.js:29-45](https://github.com/AAAlenwow/dsh-ai-armor/blob/dedf8d32fcaaa70e8584f432ba1c63b103f133dc/lib/index.js#L29-L45)

源码提供实际宿主接线，用于区分声明依赖与调用依赖。

<details>
<summary>查看原文（17行）</summary>

```text
export const name = "dsh-ai-armor";
export const inject = ["tools"];

export async function apply(ctx) {
  for (const sp of subPlugins) {
    try {
      const mod = await import(sp.path);
      const tools = mod.tools || [];
      for (const t of tools) ctx.tools.register(t);
      ctx.logger?.info?.(
        `dsh-ai-armor: registered ${tools.length} tools from ${sp.name} (${tools.map((t) => t.name).join(", ")})`
      );
    } catch (e) {
      ctx.logger?.error?.(`dsh-ai-armor: failed to load ${sp.name}: ${e.message}`);
    }
  }
}
```

</details>

#### 缺口

- 真实宿主中的依赖失效顺序与部分成功状态未观测
  **影响**：无法确认重试是否会重复副作用
  **进一步探讨**：选取每类10个已知真值样本，对照原生命令/独立工具，记录正确finding数、误报、人工复核分钟；bisect只在临时worktree运行并监控网络/文件副作用，主工作树变化即否定安全采用。 另逐项切断依赖并回读部分成功状态。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 完成一个合格任务的首次、持续和失败恢复成本与效果是什么？

**研究主题**：效果与总成本

#### 完整回答

成本必须以“输出可回指提交、堆栈、配置或 SQL 位置，并经项目测试或人工复核”为合格单位。三阶段投入为：首次使用｜本地CPU/磁盘与一个bundle安装｜审阅八个工具权限和适用输入｜比五包分装节省多少分钟未知；持续使用｜静态解析/Git历史遍历资源｜选择工具、准备输入、复核 finding｜各工具准确率与复核分钟未知；失败恢复｜bisect重复测试和临时副本空间｜恢复Git状态、终止repro、清理副本｜历史脚本造成外部副作用时不可由Git回滚。当前源码只支持机制存在，效果维度为“统一分发｜入口循环注册五个子插件工具｜部分加载失败是否隔离；定向诊断｜各子插件有独立规则/解析器｜真实项目误报漏报与净节时；Git定位｜bisect可执行repro并定位提交｜不可信历史提交与脚本副作用”。没有合格数、总尝试、人工分钟与现金/资源量，因此不能计算单位成本、节时或ROI。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-19](https://github.com/AAAlenwow/dsh-ai-armor/blob/dedf8d32fcaaa70e8584f432ba1c63b103f133dc/README.md#L1-L19)

作者材料支持操作范围，不提供同条件成本或合格率。

<details>
<summary>查看原文（19行）</summary>

````text
# dsh-ai-armor

> **AI 写代码后,一次性定位 5 类常见生产事故的"护甲"。** 一次安装,5 个工具,8 个 tool slot,都是给"AI 写完代码"那一刻准备的——stack trace 来了、解码;git 出 bug 了、二分定位;config 改坏了、校验;shell 命令拼错了、跨平台转义;MyBatis Plus SQL 写糙了、静态审计。

## 这个 bundle 里有什么

| 子插件 | 工具 | 解决的生产问题 |
|--------|------|----------------|
| **[dsh-when-broke](./plugins/dsh-when-broke/README.md)** | `when_broke_find_introducer`<br>`when_broke_recent_changes`<br>`when_broke_bisect_with_repro`<br>`when_broke_blame_age` | 这段代码从哪个 commit 来的?最近谁动过这个文件?线上 bug 是哪个 commit 引入的?这行代码新写的还是老的? |
| **[dsh-stackdecoder](./plugins/dsh-stackdecoder/README.md)** | `decode_stack` | AI 拿到一段堆栈文本,1 次调用解析出每帧 file:line + 上下文代码片段,不用逐帧 read_file 来回问 |
| **[dsh-config-guard](./plugins/dsh-config-guard/README.md)** | `validate_config` | AI 改完 application.yml / .env / .properties 后,验证有没有重复键、tab 缩进、键名打错、缺必需字段 |
| **[dsh-cmd-shield](./plugins/dsh-cmd-shield/README.md)** | `build_shell_invocation` | AI 拼 shell 命令经常被引号/`$`/CJK/路径空格搞坏(尤其 Windows),这个工具替 agent 做转义,POSIX/PowerShell/cmd 各家规则都对齐 |
| **[dsh-mp-auditor](./plugins/dsh-mp-auditor/README.md)** | `audit_mp_code` | 扫 MyBatis Plus 项目,挑出 N+1 / 漏 `@Transactional` / `LIKE '%xxx%'` / `SELECT *` / 缺 WHERE 的 UPDATE/DELETE |

## 安装

```bash
dsh plugin add AAAlenwow/dsh-ai-armor
```
````

</details>

**依据 2 · 作者声明**：[package.json:1-26](https://github.com/AAAlenwow/dsh-ai-armor/blob/dedf8d32fcaaa70e8584f432ba1c63b103f133dc/package.json#L1-L26)

包清单支持本地/外部资源与依赖边界的定性判断。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "dsh-ai-armor",
  "version": "0.1.0",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/AAAlenwow/dsh-ai-armor.git"
  },
  "description": "Five production-grade DSH tools (when-broke, stackdecoder, config-guard, cmd-shield, mp-auditor) bundled into one plugin: git regression finder, stack-trace decoder, config-file validator, cross-platform shell escape, MyBatis Plus SQL auditor. 五个生产级 DSH 工具合一：git 回归定位、堆栈解码、配置校验、跨平台 shell 转义、MyBatis Plus SQL 审计。",
  "keywords": [
    "deepseek-harness",
    "dsh",
    "dsh-plugin",
    "git",
    "stack-trace",
    "config",
    "shell",
    "mybatis-plus",
    "sql-audit",
    "ai-safety"
  ],
  "license": "MIT",
  "main": "./lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./package.json": "./package.json"
  },
```

</details>

#### 缺口

- 缺少按合格任务统计的总尝试、失败、人工分钟与现金/资源量
  **影响**：无法比较总成本与净收益
  **进一步探讨**：选取每类10个已知真值样本，对照原生命令/独立工具，记录正确finding数、误报、人工复核分钟；bisect只在临时worktree运行并监控网络/文件副作用，主工作树变化即否定安全采用。 同时按合格交付数汇总总尝试、人工分钟和资源量。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 实现是否可靠可维护，哪些设计可复用，移植代价是什么？

**研究主题**：工程质量与复用

#### 完整回答

固定源码把核心职责落在 lib/index.js 及相邻模块，入口可追踪；inventory 仅作规模和静态候选索引。可复用的是“将五个既有子插件统一装载，降低发现与安装入口数量，但没有形成跨工具联合诊断机制”的显式接线方式。移植必须重做宿主API、权限、状态持久化和“用项目测试或人工证据复核 finding｜误报被标记，临时 worktree 删除前保存定位”验证，不能从测试脚本存在推断当前环境可靠。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:29-45](https://github.com/AAAlenwow/dsh-ai-armor/blob/dedf8d32fcaaa70e8584f432ba1c63b103f133dc/lib/index.js#L29-L45)

固定源码用于评价职责和宿主耦合。

<details>
<summary>查看原文（17行）</summary>

```text
export const name = "dsh-ai-armor";
export const inject = ["tools"];

export async function apply(ctx) {
  for (const sp of subPlugins) {
    try {
      const mod = await import(sp.path);
      const tools = mod.tools || [];
      for (const t of tools) ctx.tools.register(t);
      ctx.logger?.info?.(
        `dsh-ai-armor: registered ${tools.length} tools from ${sp.name} (${tools.map((t) => t.name).join(", ")})`
      );
    } catch (e) {
      ctx.logger?.error?.(`dsh-ai-armor: failed to load ${sp.name}: ${e.message}`);
    }
  }
}
```

</details>

**依据 2 · 作者声明**：[package.json:1-26](https://github.com/AAAlenwow/dsh-ai-armor/blob/dedf8d32fcaaa70e8584f432ba1c63b103f133dc/package.json#L1-L26)

包清单用于确认版本、分发与依赖面。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "dsh-ai-armor",
  "version": "0.1.0",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/AAAlenwow/dsh-ai-armor.git"
  },
  "description": "Five production-grade DSH tools (when-broke, stackdecoder, config-guard, cmd-shield, mp-auditor) bundled into one plugin: git regression finder, stack-trace decoder, config-file validator, cross-platform shell escape, MyBatis Plus SQL auditor. 五个生产级 DSH 工具合一：git 回归定位、堆栈解码、配置校验、跨平台 shell 转义、MyBatis Plus SQL 审计。",
  "keywords": [
    "deepseek-harness",
    "dsh",
    "dsh-plugin",
    "git",
    "stack-trace",
    "config",
    "shell",
    "mybatis-plus",
    "sql-audit",
    "ai-safety"
  ],
  "license": "MIT",
  "main": "./lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./package.json": "./package.json"
  },
```

</details>

#### 缺口

- 未执行仓库测试、安装和真实宿主压力/升级验证
  **影响**：维护性和异常恢复只能作源码级判断
  **进一步探讨**：选取每类10个已知真值样本，对照原生命令/独立工具，记录正确finding数、误报、人工复核分钟；bisect只在临时worktree运行并监控网络/文件副作用，主工作树变化即否定安全采用。 在此之外记录构建、卸载和宿主升级后的回归面积。

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由贡献与反例可推导什么未验证方向，如何证伪？

**研究主题**：新假设与验证

#### 完整回答

由“将五个既有子插件统一装载，降低发现与安装入口数量，但没有形成跨工具联合诊断机制”和“其中 bisect 需要执行复现脚本并切换 Git 状态，不能把整包概括为完全不执行代码或无副作用”推导的新方向是可按场景延迟注册工具，并把 bisect 固定在临时 worktree 与显式命令预览中，降低误选与仓库副作用。它不是当前能力。最小验证为选取每类10个已知真值样本，对照原生命令/独立工具，记录正确finding数、误报、人工复核分钟；bisect只在临时worktree运行并监控网络/文件副作用，主工作树变化即否定安全采用。 若合格结果不改善、误差/副作用越界或恢复负担高于“分别安装五个子插件，或直接使用 Git、配置解析器、IDE 检查和人工审阅”，即削弱或推翻假设。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:29-45](https://github.com/AAAlenwow/dsh-ai-armor/blob/dedf8d32fcaaa70e8584f432ba1c63b103f133dc/lib/index.js#L29-L45)

假设只以已实现机制和边界为推导起点，不表示源码已经实现新方向。

<details>
<summary>查看原文（17行）</summary>

```text
export const name = "dsh-ai-armor";
export const inject = ["tools"];

export async function apply(ctx) {
  for (const sp of subPlugins) {
    try {
      const mod = await import(sp.path);
      const tools = mod.tools || [];
      for (const t of tools) ctx.tools.register(t);
      ctx.logger?.info?.(
        `dsh-ai-armor: registered ${tools.length} tools from ${sp.name} (${tools.map((t) => t.name).join(", ")})`
      );
    } catch (e) {
      ctx.logger?.error?.(`dsh-ai-armor: failed to load ${sp.name}: ${e.message}`);
    }
  }
}
```

</details>

#### 缺口

- 假设尚无实现、需求频率或效果数据
  **影响**：不能计入插件贡献、创新效果或商业机会
  **进一步探讨**：选取每类10个已知真值样本，对照原生命令/独立工具，记录正确finding数、误报、人工复核分钟；bisect只在临时worktree运行并监控网络/文件副作用，主工作树变化即否定安全采用。 只验证最小原型，不改变当前能力状态。

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 对谁值得观察或试用，成功与停止标准是什么？

**研究主题**：采用判断

#### 完整回答

当前结论为小范围试用。可先试用静态只读工具；Git bisect只应在干净的可丢弃副本和审阅过的复现命令中运行。 试用成功标准是“输出可回指提交、堆栈、配置或 SQL 位置，并经项目测试或人工复核”，并且 部分加载失败是否隔离、真实项目误报漏报与净节时、不可信历史提交与脚本副作用 有可接受结果；停止标准包括发生其中 bisect 需要执行复现脚本并切换 Git 状态，不能把整包概括为完全不执行代码或无副作用所述核心风险、出现未知副作用自动重试，或总人工/资源成本高于“分别安装五个子插件，或直接使用 Git、配置解析器、IDE 检查和人工审阅”。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-19](https://github.com/AAAlenwow/dsh-ai-armor/blob/dedf8d32fcaaa70e8584f432ba1c63b103f133dc/README.md#L1-L19)

作者材料限定可操作范围；采用结论由研究者结合限制给出。

<details>
<summary>查看原文（19行）</summary>

````text
# dsh-ai-armor

> **AI 写代码后,一次性定位 5 类常见生产事故的"护甲"。** 一次安装,5 个工具,8 个 tool slot,都是给"AI 写完代码"那一刻准备的——stack trace 来了、解码;git 出 bug 了、二分定位;config 改坏了、校验;shell 命令拼错了、跨平台转义;MyBatis Plus SQL 写糙了、静态审计。

## 这个 bundle 里有什么

| 子插件 | 工具 | 解决的生产问题 |
|--------|------|----------------|
| **[dsh-when-broke](./plugins/dsh-when-broke/README.md)** | `when_broke_find_introducer`<br>`when_broke_recent_changes`<br>`when_broke_bisect_with_repro`<br>`when_broke_blame_age` | 这段代码从哪个 commit 来的?最近谁动过这个文件?线上 bug 是哪个 commit 引入的?这行代码新写的还是老的? |
| **[dsh-stackdecoder](./plugins/dsh-stackdecoder/README.md)** | `decode_stack` | AI 拿到一段堆栈文本,1 次调用解析出每帧 file:line + 上下文代码片段,不用逐帧 read_file 来回问 |
| **[dsh-config-guard](./plugins/dsh-config-guard/README.md)** | `validate_config` | AI 改完 application.yml / .env / .properties 后,验证有没有重复键、tab 缩进、键名打错、缺必需字段 |
| **[dsh-cmd-shield](./plugins/dsh-cmd-shield/README.md)** | `build_shell_invocation` | AI 拼 shell 命令经常被引号/`$`/CJK/路径空格搞坏(尤其 Windows),这个工具替 agent 做转义,POSIX/PowerShell/cmd 各家规则都对齐 |
| **[dsh-mp-auditor](./plugins/dsh-mp-auditor/README.md)** | `audit_mp_code` | 扫 MyBatis Plus 项目,挑出 N+1 / 漏 `@Transactional` / `LIKE '%xxx%'` / `SELECT *` / 缺 WHERE 的 UPDATE/DELETE |

## 安装

```bash
dsh plugin add AAAlenwow/dsh-ai-armor
```
````

</details>

**依据 2 · 源码核查**：[lib/index.js:29-45](https://github.com/AAAlenwow/dsh-ai-armor/blob/dedf8d32fcaaa70e8584f432ba1c63b103f133dc/lib/index.js#L29-L45)

源码证据只支撑窄范围试用/观察，不构成安装验收。

<details>
<summary>查看原文（17行）</summary>

```text
export const name = "dsh-ai-armor";
export const inject = ["tools"];

export async function apply(ctx) {
  for (const sp of subPlugins) {
    try {
      const mod = await import(sp.path);
      const tools = mod.tools || [];
      for (const t of tools) ctx.tools.register(t);
      ctx.logger?.info?.(
        `dsh-ai-armor: registered ${tools.length} tools from ${sp.name} (${tools.map((t) => t.name).join(", ")})`
      );
    } catch (e) {
      ctx.logger?.error?.(`dsh-ai-armor: failed to load ${sp.name}: ${e.message}`);
    }
  }
}
```

</details>

#### 缺口

- 未有真实用户频率、迁移意愿与固定版本宿主验收
  **影响**：不能升级为持续安装或生产采用
  **进一步探讨**：选取每类10个已知真值样本，对照原生命令/独立工具，记录正确finding数、误报、人工复核分钟；bisect只在临时worktree运行并监控网络/文件副作用，主工作树变化即否定安全采用。 试用结束还需访谈目标用户的重复频率与退出意愿。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
