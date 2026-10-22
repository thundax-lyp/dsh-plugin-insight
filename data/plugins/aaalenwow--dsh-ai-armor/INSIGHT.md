# dsh-ai-armor

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[dedf8d3](https://github.com/AAAlenwow/dsh-ai-armor/tree/dedf8d32fcaaa70e8584f432ba1c63b103f133dc)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：将 Git 回归、堆栈、配置、shell 转义和 MyBatis Plus 静态审计的八个工具合并分发。

> **核心亮点**：一包分发五个已独立存在的工具，减少安装/审阅入口；没有新的联合诊断机制。详见[Q02](#research-q02)。

> **风险与缺陷**：bisect 将 repro 作为 bash 脚本执行并切换 Git 检出，与 README 的离线且不执行代码表述冲突。详见[Q03](#research-q03)。

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
  - [Q01 · 五类事故的共同触发是什么，合格结果怎样判断？](#detail-section-11)
  - [Q02 · Bundle 实际如何集成五个子插件，额外带来什么？](#detail-section-12)
  - [Q03 · “不执行任何代码”和生产级保障的声明有何边界？](#detail-section-13)
  - [Q04 · 安装与持续使用的真实边界是什么？](#detail-section-14)
  - [Q05 · 应如何采用及验证一包八工具的净价值？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：AI 改代码后对多类常见故障做定向检查；结论须由项目测试或人工复核。

五个独立插件或 Git/IDE/配置验证等现成工具；Bundle 主要减少安装步骤。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| Git 回归 | 定位提交 | bisect 执行 repro 并切换仓库 |
| 堆栈解码 | 文件行和上下文 | 源码必须可读 |
| 配置/SQL | 规则候选 | 非完整语义验证 |
| shell 构造 | 提供引用字符串 | 非执行安全证明 |

**流程与依赖**

| 条件 | 用途 | 失败时 |
| --- | --- | --- |
| DSH tools/Web | 工具注册 | 无入口 |
| 本地源码与 Git | 定位/审计 | 上下文缺失 |
| bash 与可重复 repro | bisect | 结果失真或副作用 |

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 选型 | 按事故选单工具 | 输入适配 |
| 运行 | 只读预检或隔离 bisect | 记录工具和版本 |
| 验收 | 人工/测试复核 finding | 缺陷真实且无残留 |

**效果与成本**

| 阶段 | 投入 | 未知 |
| --- | --- | --- |
| 安装 | 一个包、八工具位 | 宿主注册成功率 |
| 使用 | 选工具、核结果 | 误报与节约时间 |
| Git bisect | 安全复现脚本及仓库副本 | 历史提交执行副作用 |

| 结果 | 支持 | 未证实 |
| --- | --- | --- |
| 一次安装 | 五子插件动态注册 | 八项总能成功 |
| 故障定位 | 各类规则和 Git 工具 | 真实准确率、净节约 |
| 安全性 | 多数工具本地 | bisect 无副作用，实际会执行 |

> **思考**：bisect 将 repro 作为 bash 脚本执行并切换 Git 检出，与 README 的离线且不执行代码表述冲突。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：一包分发五个已独立存在的工具，减少安装/审阅入口；没有新的联合诊断机制。详见[Q02](#research-q02)。

一包分发五个已独立存在的工具，减少安装/审阅入口；没有新的联合诊断机制。详见[Q02](#research-q02)。

apply 循环逐个 import 并吞单项失败，故可能部分注册；bisect 构建 bash 脚本并调用 git bisect run，不能视作纯只读。

<a id="detail-section-5"></a>

### 1.4 主要限制

bisect 将 repro 作为 bash 脚本执行并切换 Git 检出，与 README 的离线且不执行代码表述冲突。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先用静态/只读工具，bisect 仅在干净的可丢弃 Git 副本和显式命令审阅后使用。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持工具合包，但不支持 README“完全不执行代码”的声明；未运行宿主或准确性测试。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、plugins/dsh-when-broke/lib/bisect-with-repro.js、plugins/dsh-mp-auditor/lib/index.js、plugins/dsh-stackdecoder/lib/decode-stack.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：审阅固定提交 README、包入口、bisect 与若干子插件源码；未执行目标插件、测试或宿主。
- 下一步：在隔离宿主和可丢弃 Git 工程逐工具核注册及输出；用含误报样本对照独立插件，记录 Git 工作树和 shell 副作用。

**分析版本**

- **仓库**：[AAAlenwow/dsh-ai-armor](https://github.com/AAAlenwow/dsh-ai-armor)
- **版本号**：0.1.0（[固定提交 dedf8d3](https://github.com/AAAlenwow/dsh-ai-armor/tree/dedf8d32fcaaa70e8584f432ba1c63b103f133dc)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

若按场景选择性注册、在临时 worktree 审阅并执行 bisect，可降低工具选择和仓库副作用风险；尚未实现。详见[Q05](#research-q05)。

在隔离宿主和可丢弃 Git 工程逐工具核注册及输出；用含误报样本对照独立插件，记录 Git 工作树和 shell 副作用。

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

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AAAlenwow/dsh-ai-armor/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AAAlenwow/dsh-ai-armor/issues?q=is%3Aissue+created%3A2026-09-22T05%3A36%3A48.408Z..2026-10-22T05%3A36%3A48.408Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AAAlenwow/dsh-ai-armor/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A36%3A48.408Z..2026-10-22T05%3A36%3A48.408Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**厘清五工具 Bundle 的实际增量、声明冲突和安全采用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 五类事故的共同触发是什么，合格结果怎样判断？

**研究主题：**场景与需求

#### 完整回答

作者把 Git 回归、堆栈、配置、shell 转义、MyBatis Plus SQL 扫描放在“AI 写完代码后”同一入口，合计 8 个工具位。实际使用要按事故类型选工具；合格结果是来源定位、可读上下文或审计候选经人工/测试复核，不能把静态提示当成生产安全证明。基线是分别使用 Git、配置解析器、IDE 静态分析和人工复查。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-13](https://github.com/AAAlenwow/dsh-ai-armor/blob/dedf8d32fcaaa70e8584f432ba1c63b103f133dc/README.md#L3-L13)

作者场景和八工具清单。

<details>
<summary>查看原文（11行）</summary>

```text
> **AI 写代码后,一次性定位 5 类常见生产事故的"护甲"。** 一次安装,5 个工具,8 个 tool slot,都是给"AI 写完代码"那一刻准备的——stack trace 来了、解码;git 出 bug 了、二分定位;config 改坏了、校验;shell 命令拼错了、跨平台转义;MyBatis Plus SQL 写糙了、静态审计。

## 这个 bundle 里有什么

| 子插件 | 工具 | 解决的生产问题 |
|--------|------|----------------|
| **[dsh-when-broke](./plugins/dsh-when-broke/README.md)** | `when_broke_find_introducer`<br>`when_broke_recent_changes`<br>`when_broke_bisect_with_repro`<br>`when_broke_blame_age` | 这段代码从哪个 commit 来的?最近谁动过这个文件?线上 bug 是哪个 commit 引入的?这行代码新写的还是老的? |
| **[dsh-stackdecoder](./plugins/dsh-stackdecoder/README.md)** | `decode_stack` | AI 拿到一段堆栈文本,1 次调用解析出每帧 file:line + 上下文代码片段,不用逐帧 read_file 来回问 |
| **[dsh-config-guard](./plugins/dsh-config-guard/README.md)** | `validate_config` | AI 改完 application.yml / .env / .properties 后,验证有没有重复键、tab 缩进、键名打错、缺必需字段 |
| **[dsh-cmd-shield](./plugins/dsh-cmd-shield/README.md)** | `build_shell_invocation` | AI 拼 shell 命令经常被引号/`$`/CJK/路径空格搞坏(尤其 Windows),这个工具替 agent 做转义,POSIX/PowerShell/cmd 各家规则都对齐 |
| **[dsh-mp-auditor](./plugins/dsh-mp-auditor/README.md)** | `audit_mp_code` | 扫 MyBatis Plus 项目,挑出 N+1 / 漏 `@Transactional` / `LIKE '%xxx%'` / `SELECT *` / 缺 WHERE 的 UPDATE/DELETE |
```

</details>

**依据 2 · 源码核查**：[lib/index.js:20-45](https://github.com/AAAlenwow/dsh-ai-armor/blob/dedf8d32fcaaa70e8584f432ba1c63b103f133dc/lib/index.js#L20-L45)

打包加载并注册各工具。

<details>
<summary>查看原文（26行）</summary>

```text
// Sub-plugins (relative path → expected tool count)
const subPlugins = [
  { name: "dsh-when-broke", path: join(pluginsRoot, "dsh-when-broke", "lib", "index.js") },
  { name: "dsh-stackdecoder", path: join(pluginsRoot, "dsh-stackdecoder", "lib", "index.js") },
  { name: "dsh-config-guard", path: join(pluginsRoot, "dsh-config-guard", "lib", "index.js") },
  { name: "dsh-cmd-shield", path: join(pluginsRoot, "dsh-cmd-shield", "lib", "index.js") },
  { name: "dsh-mp-auditor", path: join(pluginsRoot, "dsh-mp-auditor", "lib", "index.js") },
];

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

**依据 3 · 作者声明**：[README.md:66-71](https://github.com/AAAlenwow/dsh-ai-armor/blob/dedf8d32fcaaa70e8584f432ba1c63b103f133dc/README.md#L66-L71)

作者声称仅建议不自动修复。

```text
## 不在范围内

- **不执行任何代码 / 不发起网络请求** — 全部离线运行,适合企业内网
- **不依赖任何 npm 包** — 装上就能用,版本兼容问题为零
- **不替你"自动 fix"** — 给出 finding + suggestion,具体修改由人或 AI agent 自己来
- **不替代 IDE 静态分析** — IDE 看的是开发时实时反馈,这些工具是"AI 写完那一刻的最后一公里"
```

#### 缺口

- 没有用户工作流对照。
  **影响：**节省时间和缺陷拦截率未知。
  **进一步探讨：**固定五类样例与现有工具逐类比较。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · Bundle 实际如何集成五个子插件，额外带来什么？

**研究主题：**功能与机制、贡献与相对优势

#### 完整回答

主入口在 apply 中逐个动态 import 五个内置子插件，枚举各自 tools 并注册；单个导入失败只记录错误并继续。它提供一次安装的分发与工具汇聚，不新增跨工具编排、共用诊断状态或统一结论。子插件保留独立入口，若 Bundle 和独立包同装会发生工具 ID 冲突，README 也明确提示。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:20-45](https://github.com/AAAlenwow/dsh-ai-armor/blob/dedf8d32fcaaa70e8584f432ba1c63b103f133dc/lib/index.js#L20-L45)

逐个加载、注册、捕获失败。

<details>
<summary>查看原文（26行）</summary>

```text
// Sub-plugins (relative path → expected tool count)
const subPlugins = [
  { name: "dsh-when-broke", path: join(pluginsRoot, "dsh-when-broke", "lib", "index.js") },
  { name: "dsh-stackdecoder", path: join(pluginsRoot, "dsh-stackdecoder", "lib", "index.js") },
  { name: "dsh-config-guard", path: join(pluginsRoot, "dsh-config-guard", "lib", "index.js") },
  { name: "dsh-cmd-shield", path: join(pluginsRoot, "dsh-cmd-shield", "lib", "index.js") },
  { name: "dsh-mp-auditor", path: join(pluginsRoot, "dsh-mp-auditor", "lib", "index.js") },
];

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

**依据 2 · 作者声明**：[README.md:29-49](https://github.com/AAAlenwow/dsh-ai-armor/blob/dedf8d32fcaaa70e8584f432ba1c63b103f133dc/README.md#L29-L49)

单独安装与捆绑价值说法。

<details>
<summary>查看原文（21行）</summary>

````text
每个子插件都可以**单独安装**(如果你只需要其中一个):

```bash
dsh plugin add AAAlenwow/dsh-when-broke    # 4 个工具
dsh plugin add AAAlenwow/dsh-stackdecoder  # 1 个工具
dsh plugin add AAAlenwow/dsh-config-guard  # 1 个工具
dsh plugin add AAAlenwow/dsh-cmd-shield    # 1 个工具
dsh plugin add AAAlenwow/dsh-mp-auditor    # 1 个工具
```

## 为什么打包

这 5 个工具解决的问题有一个共同特征:**都是 AI 写完代码后那一刻最容易爆雷的地方**。

- 堆栈一贴,AI 不会自动定位本地代码 → `decode_stack`
- `git blame` / `git bisect` 在 shell 里跑可以但需要 AI 拼命令和解析输出 → `when_broke_*`
- YAML/ENV 写错一个 tab 或一个重复键,服务启动失败 → `validate_config`
- Windows PowerShell 跟 bash 转义规则不一样,AI 经常写错 → `build_shell_invocation`
- MyBatis Plus N+1 不会报错但会拖慢数据库,AI 自己看不到 → `audit_mp_code`

**一个 bundle,一个 PR,一个 review,搞定 8 个 tool slot。**比 5 次单独发布少 4 轮审核往返,普通用户一次安装全有。
````

</details>

**依据 3 · 作者声明**：[README.md:94-106](https://github.com/AAAlenwow/dsh-ai-armor/blob/dedf8d32fcaaa70e8584f432ba1c63b103f133dc/README.md#L94-L106)

独立包及 ID 冲突提示。

<details>
<summary>查看原文（13行）</summary>

```text
## Standalone sub-plugins

Every tool in this bundle is also published as a standalone installable plugin:

| Repo | Tools |
|---|---|
| [dsh-when-broke](https://github.com/AAAlenwow/dsh-when-broke) | 4 — when_broke_find_introducer / when_broke_recent_changes / when_broke_bisect_with_repro / when_broke_blame_age |
| [dsh-stackdecoder](https://github.com/AAAlenwow/dsh-stackdecoder) | 1 — decode_stack |
| [dsh-config-guard](https://github.com/AAAlenwow/dsh-config-guard) | 1 — validate_config |
| [dsh-cmd-shield](https://github.com/AAAlenwow/dsh-cmd-shield) | 1 — build_shell_invocation |
| [dsh-mp-auditor](https://github.com/AAAlenwow/dsh-mp-auditor) | 1 — audit_mp_code |

Install either the bundle or the standalone packages, not both (tool ids would collide).
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · “不执行任何代码”和生产级保障的声明有何边界？

**研究主题：**缺陷与关键质疑、工程质量与复用

#### 完整回答

README 的“不执行任何代码”与 when_broke_bisect_with_repro 源码冲突：该工具将用户给的单行 repro 写入 bash 脚本，以 git bisect run 在一系列历史提交上运行，且调用前先 bisect reset。即使每次 finally 试图 reset，也会改动仓库检出状态并执行任意复现命令。只有单行校验，无命令白名单或隔离。主 Bundle 对导入失败仅记日志，不保证八项全注册。MyBatis 扫描是规则/候选而非运行时 SQL 证据；README 性能数为作者报告，未复测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:51-69](https://github.com/AAAlenwow/dsh-ai-armor/blob/dedf8d32fcaaa70e8584f432ba1c63b103f133dc/README.md#L51-L69)

作者性能和“不执行代码”声明。

<details>
<summary>查看原文（19行）</summary>

```text
## 性能(全本地,无外部依赖)

每个工具都是**纯本地、无网络调用、无第三方依赖**(只用 Node.js 内置 `fs`/`path`/`child_process`/`crypto`)。所有测试跑在普通 MacBook M1 上:

| 工具 | 典型 latency | 输出大小 | 适用场景 |
|------|-------------|---------|---------|
| `when_broke_find_introducer` | 15-300ms | ~1-2KB | 出 bug 后,反查可疑代码的来源 |
| `when_broke_recent_changes` | 5-30ms | ~1-2KB | 出 bug 后,看最近谁改过这个文件 |
| `when_broke_bisect_with_repro` | 1-60s(取决于 repro) | ~2-3KB | 出 bug 后,二分定位第一个坏 commit |
| `when_broke_blame_age` | <10ms | ~150 字节 | 一行代码是不是新写的 |
| `decode_stack` | <1ms/帧 | ~2-5KB(10 帧) | 拿到堆栈,定位到本地代码 |
| `validate_config` | <1ms | ~500-700 字节 | CI 前置检查、agent 自检 |
| `build_shell_invocation` | <2ms | ~120-380 字节 | AI 拼 shell 命令前先转义 |
| `audit_mp_code` | <10ms/1000 文件 | ~1-2KB | 写完 MyBatis Plus 代码后扫描 |

## 不在范围内

- **不执行任何代码 / 不发起网络请求** — 全部离线运行,适合企业内网
- **不依赖任何 npm 包** — 装上就能用,版本兼容问题为零
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-when-broke/lib/bisect-with-repro.js:29-68](https://github.com/AAAlenwow/dsh-ai-armor/blob/dedf8d32fcaaa70e8584f432ba1c63b103f133dc/plugins/dsh-when-broke/lib/bisect-with-repro.js#L29-L68)

repro 写入 shell，bisect run 执行。

<details>
<summary>查看原文（40行）</summary>

```text
export async function bisectWithRepro({ good, bad, repro, cwd, timeoutMs = 60_000 } = {}) {
  if (!isGitRepo(cwd)) {
    return { ok: false, error: "当前目录不在 git 仓库内。" };
  }
  if (!good || !bad || !repro) {
    return { ok: false, error: "需要 good(已知好 commit)、bad(已知坏 commit)、repro(复现命令)三个参数" };
  }
  if (typeof repro !== "string" || repro.includes("\n")) {
    return { ok: false, error: "repro 必须是单行命令(不能含换行;若需多步请包成 shell 脚本)" };
  }

  const t0 = Date.now();
  let tmpDir = null;
  const log = [];

  // Always reset first in case a previous bisect was interrupted
  try { git(["bisect", "reset"], { cwd, allowFailure: true }); } catch {}

  // Wrap the repro in a small shell script so `git bisect run` can call it.
  // The script must exit 0 = good, 1 = bad, 125 = skip-this-commit.
  tmpDir = mkdtempSync(join(tmpdir(), "dsh-when-broke-"));
  const reproScript = join(tmpDir, "repro.sh");
  writeFileSync(reproScript, `#!/usr/bin/env bash\nset -e\ncd "${cwd}"\n${repro}\n`, { mode: 0o755 });

  try {
    git(["bisect", "start"], { cwd });
    log.push("bisect start");
    git(["bisect", "bad", bad], { cwd });
    log.push(`bisect bad ${bad.slice(0, 7)}`);
    git(["bisect", "good", good], { cwd });
    log.push(`bisect good ${good.slice(0, 7)}`);

    // Tell git to skip commits that can't be tested (e.g. build failure).
    // The script exits 125 if repro can't run; git bisect treats that as skip.
    const r = spawnSync("git", [
      "bisect", "run",
      // Lower default term-quiet to false so we see git's own step output.
      // We capture stdout/stderr into log below.
      reproScript,
    ], { cwd, encoding: "utf8", timeout: timeoutMs });
```

</details>

**依据 3 · 源码核查**：[lib/index.js:32-45](https://github.com/AAAlenwow/dsh-ai-armor/blob/dedf8d32fcaaa70e8584f432ba1c63b103f133dc/lib/index.js#L32-L45)

动态注册失败继续。

<details>
<summary>查看原文（14行）</summary>

```text
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

**依据 4 · 源码核查**：[plugins/dsh-mp-auditor/lib/index.js:8-16](https://github.com/AAAlenwow/dsh-ai-armor/blob/dedf8d32fcaaa70e8584f432ba1c63b103f133dc/plugins/dsh-mp-auditor/lib/index.js#L8-L16)

规则扫描声称。

```text
const TOOL_DESCRIPTION = [
  '静态扫描 MyBatis Plus 项目源码,挑出常见的 SQL/事务性能与安全问题。',
  '检查项:',
  '- SELECT * (应改用显式列名)',
  '- UPDATE/DELETE 缺 WHERE (会全表更新/删除!)',
  '- LIKE \'%xxx\' (前导 %,B-tree 索引失效)',
  '- Service 方法 ≥2 处写操作但缺 @Transactional (部分失败数据不一致)',
  '- 循环里调 mapper.find*/list* (疑似 N+1)',
  '返回 ok / summary / findings[]。'
```

#### 缺口

- 未运行目标插件或测试。
  **影响：**复现命令副作用、全工具注册和准确率未独立验证。
  **进一步探讨：**在可丢弃 Git 副本与带误报样本的固定工程隔离试验。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装与持续使用的真实边界是什么？

**研究主题：**依赖、兼容与流程、效果与总成本

#### 完整回答

固定包版本 0.1.0、MIT，兼容声明 DSH>=0.1.7-alpha.1/web；五个子插件随包发布，没有 npm 依赖。运行却需要 Node 内置 fs/path/child_process、Git 和可访问源码，bisect 还需要 bash 与可安全重复运行的 repro。八工具位增加选择负担。作者给出毫秒级性能表和“零版本兼容”说法，但本轮未复测；源码并不能证明宿主接口兼容或所有平台的转义正确。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-44](https://github.com/AAAlenwow/dsh-ai-armor/blob/dedf8d32fcaaa70e8584f432ba1c63b103f133dc/package.json#L1-L44)

包和兼容声明。

<details>
<summary>查看原文（44行）</summary>

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
  "files": [
    "cordis.patch.yml",
    "lib",
    "plugins",
    "README.md"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "compatibility": {
      "dsh": ">=0.1.7-alpha.1",
      "profiles": [
        "web"
      ]
    }
  },
  "type": "module"
```

</details>

**依据 2 · 源码核查**：[lib/index.js:20-45](https://github.com/AAAlenwow/dsh-ai-armor/blob/dedf8d32fcaaa70e8584f432ba1c63b103f133dc/lib/index.js#L20-L45)

打包和注册路径。

<details>
<summary>查看原文（26行）</summary>

```text
// Sub-plugins (relative path → expected tool count)
const subPlugins = [
  { name: "dsh-when-broke", path: join(pluginsRoot, "dsh-when-broke", "lib", "index.js") },
  { name: "dsh-stackdecoder", path: join(pluginsRoot, "dsh-stackdecoder", "lib", "index.js") },
  { name: "dsh-config-guard", path: join(pluginsRoot, "dsh-config-guard", "lib", "index.js") },
  { name: "dsh-cmd-shield", path: join(pluginsRoot, "dsh-cmd-shield", "lib", "index.js") },
  { name: "dsh-mp-auditor", path: join(pluginsRoot, "dsh-mp-auditor", "lib", "index.js") },
];

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

**依据 3 · 源码核查**：[plugins/dsh-when-broke/lib/bisect-with-repro.js:47-68](https://github.com/AAAlenwow/dsh-ai-armor/blob/dedf8d32fcaaa70e8584f432ba1c63b103f133dc/plugins/dsh-when-broke/lib/bisect-with-repro.js#L47-L68)

bash 和 git bisect 依赖。

<details>
<summary>查看原文（22行）</summary>

```text
  // Wrap the repro in a small shell script so `git bisect run` can call it.
  // The script must exit 0 = good, 1 = bad, 125 = skip-this-commit.
  tmpDir = mkdtempSync(join(tmpdir(), "dsh-when-broke-"));
  const reproScript = join(tmpDir, "repro.sh");
  writeFileSync(reproScript, `#!/usr/bin/env bash\nset -e\ncd "${cwd}"\n${repro}\n`, { mode: 0o755 });

  try {
    git(["bisect", "start"], { cwd });
    log.push("bisect start");
    git(["bisect", "bad", bad], { cwd });
    log.push(`bisect bad ${bad.slice(0, 7)}`);
    git(["bisect", "good", good], { cwd });
    log.push(`bisect good ${good.slice(0, 7)}`);

    // Tell git to skip commits that can't be tested (e.g. build failure).
    // The script exits 125 if repro can't run; git bisect treats that as skip.
    const r = spawnSync("git", [
      "bisect", "run",
      // Lower default term-quiet to false so we see git's own step output.
      // We capture stdout/stderr into log below.
      reproScript,
    ], { cwd, encoding: "utf8", timeout: timeoutMs });
```

</details>

**依据 4 · 作者声明**：[README.md:51-64](https://github.com/AAAlenwow/dsh-ai-armor/blob/dedf8d32fcaaa70e8584f432ba1c63b103f133dc/README.md#L51-L64)

作者时延表。

<details>
<summary>查看原文（14行）</summary>

```text
## 性能(全本地,无外部依赖)

每个工具都是**纯本地、无网络调用、无第三方依赖**(只用 Node.js 内置 `fs`/`path`/`child_process`/`crypto`)。所有测试跑在普通 MacBook M1 上:

| 工具 | 典型 latency | 输出大小 | 适用场景 |
|------|-------------|---------|---------|
| `when_broke_find_introducer` | 15-300ms | ~1-2KB | 出 bug 后,反查可疑代码的来源 |
| `when_broke_recent_changes` | 5-30ms | ~1-2KB | 出 bug 后,看最近谁改过这个文件 |
| `when_broke_bisect_with_repro` | 1-60s(取决于 repro) | ~2-3KB | 出 bug 后,二分定位第一个坏 commit |
| `when_broke_blame_age` | <10ms | ~150 字节 | 一行代码是不是新写的 |
| `decode_stack` | <1ms/帧 | ~2-5KB(10 帧) | 拿到堆栈,定位到本地代码 |
| `validate_config` | <1ms | ~500-700 字节 | CI 前置检查、agent 自检 |
| `build_shell_invocation` | <2ms | ~120-380 字节 | AI 拼 shell 命令前先转义 |
| `audit_mp_code` | <10ms/1000 文件 | ~1-2KB | 写完 MyBatis Plus 代码后扫描 |
```

</details>

#### 缺口

- 没有宿主兼容/跨平台运行记录。
  **影响：**安装成功率与单次诊断成本未知。
  **进一步探讨：**隔离 DSH 主机按五类输入核注册、调用、时延与副作用。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 应如何采用及验证一包八工具的净价值？

**研究主题：**新假设与验证、采用判断

#### 完整回答

可先把配置、堆栈和静态审计用于只读预检，将 Git bisect 作为显式授权、干净工作树和可丢弃副本中的专门动作。新增但未实现的假设：按场景选择性注册工具，并给 bisect 加运行前差异预览、临时 worktree、命令审阅及终态复核，可保留一包安装便利又减少误调用风险。对照五个独立插件测安装/审核次数、工具选择错误、真实缺陷检出、误报、运行时与工作树残留。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:20-45](https://github.com/AAAlenwow/dsh-ai-armor/blob/dedf8d32fcaaa70e8584f432ba1c63b103f133dc/lib/index.js#L20-L45)

当前全量注册且失败部分继续。

<details>
<summary>查看原文（26行）</summary>

```text
// Sub-plugins (relative path → expected tool count)
const subPlugins = [
  { name: "dsh-when-broke", path: join(pluginsRoot, "dsh-when-broke", "lib", "index.js") },
  { name: "dsh-stackdecoder", path: join(pluginsRoot, "dsh-stackdecoder", "lib", "index.js") },
  { name: "dsh-config-guard", path: join(pluginsRoot, "dsh-config-guard", "lib", "index.js") },
  { name: "dsh-cmd-shield", path: join(pluginsRoot, "dsh-cmd-shield", "lib", "index.js") },
  { name: "dsh-mp-auditor", path: join(pluginsRoot, "dsh-mp-auditor", "lib", "index.js") },
];

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

**依据 2 · 作者声明**：[README.md:39-49](https://github.com/AAAlenwow/dsh-ai-armor/blob/dedf8d32fcaaa70e8584f432ba1c63b103f133dc/README.md#L39-L49)

作者称一次安装审阅。

<details>
<summary>查看原文（11行）</summary>

```text
## 为什么打包

这 5 个工具解决的问题有一个共同特征:**都是 AI 写完代码后那一刻最容易爆雷的地方**。

- 堆栈一贴,AI 不会自动定位本地代码 → `decode_stack`
- `git blame` / `git bisect` 在 shell 里跑可以但需要 AI 拼命令和解析输出 → `when_broke_*`
- YAML/ENV 写错一个 tab 或一个重复键,服务启动失败 → `validate_config`
- Windows PowerShell 跟 bash 转义规则不一样,AI 经常写错 → `build_shell_invocation`
- MyBatis Plus N+1 不会报错但会拖慢数据库,AI 自己看不到 → `audit_mp_code`

**一个 bundle,一个 PR,一个 review,搞定 8 个 tool slot。**比 5 次单独发布少 4 轮审核往返,普通用户一次安装全有。
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-when-broke/lib/bisect-with-repro.js:44-68](https://github.com/AAAlenwow/dsh-ai-armor/blob/dedf8d32fcaaa70e8584f432ba1c63b103f133dc/plugins/dsh-when-broke/lib/bisect-with-repro.js#L44-L68)

现行 bisect 有副作用。

<details>
<summary>查看原文（25行）</summary>

```text
  // Always reset first in case a previous bisect was interrupted
  try { git(["bisect", "reset"], { cwd, allowFailure: true }); } catch {}

  // Wrap the repro in a small shell script so `git bisect run` can call it.
  // The script must exit 0 = good, 1 = bad, 125 = skip-this-commit.
  tmpDir = mkdtempSync(join(tmpdir(), "dsh-when-broke-"));
  const reproScript = join(tmpDir, "repro.sh");
  writeFileSync(reproScript, `#!/usr/bin/env bash\nset -e\ncd "${cwd}"\n${repro}\n`, { mode: 0o755 });

  try {
    git(["bisect", "start"], { cwd });
    log.push("bisect start");
    git(["bisect", "bad", bad], { cwd });
    log.push(`bisect bad ${bad.slice(0, 7)}`);
    git(["bisect", "good", good], { cwd });
    log.push(`bisect good ${good.slice(0, 7)}`);

    // Tell git to skip commits that can't be tested (e.g. build failure).
    // The script exits 125 if repro can't run; git bisect treats that as skip.
    const r = spawnSync("git", [
      "bisect", "run",
      // Lower default term-quiet to false so we see git's own step output.
      // We capture stdout/stderr into log below.
      reproScript,
    ], { cwd, encoding: "utf8", timeout: timeoutMs });
```

</details>

**依据 4 · 作者声明**：[README.md:94-106](https://github.com/AAAlenwow/dsh-ai-armor/blob/dedf8d32fcaaa70e8584f432ba1c63b103f133dc/README.md#L94-L106)

独立插件基线。

<details>
<summary>查看原文（13行）</summary>

```text
## Standalone sub-plugins

Every tool in this bundle is also published as a standalone installable plugin:

| Repo | Tools |
|---|---|
| [dsh-when-broke](https://github.com/AAAlenwow/dsh-when-broke) | 4 — when_broke_find_introducer / when_broke_recent_changes / when_broke_bisect_with_repro / when_broke_blame_age |
| [dsh-stackdecoder](https://github.com/AAAlenwow/dsh-stackdecoder) | 1 — decode_stack |
| [dsh-config-guard](https://github.com/AAAlenwow/dsh-config-guard) | 1 — validate_config |
| [dsh-cmd-shield](https://github.com/AAAlenwow/dsh-cmd-shield) | 1 — build_shell_invocation |
| [dsh-mp-auditor](https://github.com/AAAlenwow/dsh-mp-auditor) | 1 — audit_mp_code |

Install either the bundle or the standalone packages, not both (tool ids would collide).
```

</details>

#### 缺口

- 选择性注册与隔离 bisect 尚未实现。
  **影响：**不能当作当前贡献。
  **进一步探讨：**用沙盒副本与五类固定事故进行对照。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
