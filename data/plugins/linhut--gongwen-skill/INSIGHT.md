# 公文全流程处理专家

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[6a41282](https://github.com/linhut/gongwen-skill/tree/6a41282aa5ae3ed3bbc55ad9adc33bcff80c7353)

<!-- BEGIN META -->
[![GitHub ★ 99](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=99&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/linhut/gongwen-skill) [![npm 30d 3,414](https://img.shields.io/static/v1?label=npm+30d&message=3%2C414&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/gongwen-skill) [![最新发布 2026-10-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/gongwen-skill)
<!-- END META -->

> **功能**：在 DSH 中调用公文检查、修复与修订工具

> **亮点**：[Q01](#research-q01) 把格式、模板和修订处理集中到 Agent 入口。

> **主要限制**：[Q03](#research-q03) 直接子进程权限和最终渲染需核对。

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
  - [Q01 · 交付如何验收？](#detail-section-11)
  - [Q02 · DSH 如何运行？](#detail-section-12)
  - [Q03 · 权限与质量边界？](#detail-section-13)
  - [Q04 · 采用退出成本？](#detail-section-14)
  - [Q05 · 哪些结果否定目标？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：文秘人员反复处理公文格式与修订。

Word 手工排版与修订。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| Word 手工排版与修订。 | 可直接比较 | 保留人工步骤 |
| 公文全流程处理专家 | 把格式、模板和修订处理集中到 Agent 入口。 | 直接子进程权限和最终渲染需核对。 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 宿主 | 必需 | DSH 模型工具转调本机 Python CLI。 | 用隔离 profile 确认 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 文秘人员反复处理公文格式与修订。 | 保留原流程 |
| 试验 | DSH 模型工具转调本机 Python CLI。 | 观察固定版本 |
| 复核 | 用虚构文档验证原件、取消与渲染。 | 比对任务结果 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 安装与运行成本未知 | 配置准备耗时未知 | 视 profile 而定 |
| 持续 | 持续运行成本未知 | 日常维护耗时未知 | 视任务频率而定 |
| 恢复 | 回退成本未知 | 恢复原流程耗时未知 | 视已有数据而定 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 整理虚构公文并逐项检查版式和内容改动 | 能减少固定排版工时而保持文本可核查。 | 用虚构文档验证原件、取消与渲染。 |

> **思考**：[Q03](#research-q03) 直接子进程权限和最终渲染需核对。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把格式、模板和修订处理集中到 Agent 入口。

argv 调用和结构化结果，设置同步本机。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 直接子进程权限和最终渲染需核对。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 用虚构文档验证原件、取消与渲染。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的整理虚构公文并逐项检查版式和内容改动。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、dsh/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的整理虚构公文并逐项检查版式和内容改动。未执行目标代码或实际宿主验证。
- 下一步：保存原件、产物和逐页审阅。

**分析版本**

- **仓库**：[linhut/gongwen-skill](https://github.com/linhut/gongwen-skill)
- **版本号**：2.15.0（[固定提交 6a41282](https://github.com/linhut/gongwen-skill/tree/6a41282aa5ae3ed3bbc55ad9adc33bcff80c7353)）
- **版本日期**：2026-10-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 能减少固定排版工时而保持文本可核查。

保存原件、产物和逐页审阅。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 9 | 5113 | — | — | 66014 |
| .js | source | 4 | 1283 | 1034 | 142 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/linhut/gongwen-skill/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：整理虚构公文并逐项检查版式和内容改动

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 交付如何验收？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

文秘人员可检查 docx、套模板并检查修订。基线是 Word 手工排版，验收要逐页视觉比对与修订文本核对，不能仅以 CLI 退出码认定符合标准。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-23](https://github.com/linhut/gongwen-skill/blob/6a41282aa5ae3ed3bbc55ad9adc33bcff80c7353/README.md#L13-L23)

作者描述格式、修订和标准目标

<details>
<summary>查看原文（11行）</summary>

```text
> 中文公文全流程处理专家——基于 **GB/T 9704《党政机关公文格式》** 国家标准，支持 **格式检查与修复、内容优化（Word 原生修订+批注/差异对比版）、模板生成、Markdown 转公文、版头版记页码注入、事实核验、风格增强** 等完整能力。原生支持 **DeepSeek Harness (DSH)** 技能系统，打包为可被 AI Agent 直接调用的 Skill，完全自包含，克隆即用。

[![CI](https://img.shields.io/badge/CI-Passing-brightgreen)](https://github.com/linhut/gongwen-skill/actions)
[![PyPI](https://img.shields.io/pypi/v/gongwen-skill)](https://pypi.org/project/gongwen-skill/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)
![GB/T 9704](https://img.shields.io/badge/standard-GB%2FT%209704-red.svg)
![DSH](https://img.shields.io/badge/DSH-Compatible-brightgreen)
![Downloads](https://img.shields.io/pypi/dm/gongwen-skill)

本 Skill 源自开源桌面项目 [AI 公文智能优化助手](https://github.com/linhut/document-ai-assistant)，将其核心格式引擎抽取、剥离桌面端/数据库依赖后独立发行，支持公文的**模板建立、解析、规则检查、自动修复、内容优化、Markdown 转公文**全流程能力。同时原生集成 **DeepSeek Harness (DSH)** 技能系统，支持 DSH Agent 自动发现与加载。
```

</details>

**依据 2 · 源码核查**：[dsh/index.js:439-445](https://github.com/linhut/gongwen-skill/blob/6a41282aa5ae3ed3bbc55ad9adc33bcff80c7353/dsh/index.js#L439-L445)

模型工具入口

```text
// 注册官方模型工具（defineTool + ctx.tools.register，schema 自动流入系统提示词）
function registerGongwenTool(ctx) {
  ctx.tools.register(defineTool({
    name: "gongwen",
    description:
      "运行公文全流程处理专家（gongwen-skill）CLI 命令：check（格式检查）、optimize（自动修复）、optimize-content（内容修订对比版）、md2docx（Markdown 转公文）、template（模板生成）、style-learn（样式学习）、list-types（列出公文类型）、doctor（全面诊断）、handoff（会话交接）等。",
    parameters: {
```

#### 缺口

- 标准完整符合性未独立核查。
  **影响**：可减少重复排版。
  **进一步探讨**：以虚构通知做基准。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH 如何运行？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

工具将命令参数转为 python -m gongwen argv，继承宿主环境。成功时尝试解析 JSON，取消 signal 触发 child.kill。设置同步本机配置。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/index.js:325-370](https://github.com/linhut/gongwen-skill/blob/6a41282aa5ae3ed3bbc55ad9adc33bcff80c7353/dsh/index.js#L325-L370)

子进程和返回映射

<details>
<summary>查看原文（46行）</summary>

```text
  const positionalKeys = POSITIONAL_ARGS[command] || [];
  const cliArgs = ["-m", "gongwen", command, ..._to_cli_args(rest, positionalKeys)];

  return await new Promise((resolvePromise) => {
    const child = spawn("python", cliArgs, {
      cwd,
      env: { ...process.env, PYTHONIOENCODING: "utf-8", PYTHONUTF8: "1" },
      windowsHide: true,
    });
    const abort = () => child.kill();
    signal?.addEventListener("abort", abort, { once: true });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => (stdout += chunk.toString("utf-8")));
    child.stderr.on("data", (chunk) => (stderr += chunk.toString("utf-8")));
    child.on("error", (err) => {
      signal?.removeEventListener("abort", abort);
      resolvePromise({
        success: false,
        error: `python spawn failed: ${err.message}`,
        cli: `python ${cliArgs.join(" ")}`,
        cwd,
      });
    });
    child.on("close", (code) => {
      signal?.removeEventListener("abort", abort);
      if (code === 0) {
        const trimmed = stdout.trim();
        if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
          try {
            resolvePromise({ success: true, data: JSON.parse(trimmed), stderr: stderr.trim() });
            return;
          } catch {
            // 非 JSON
          }
        }
        resolvePromise({ success: true, output: trimmed, stderr: stderr.trim() });
      } else {
        resolvePromise({
          success: false,
          exit_code: code,
          output: stdout.trim(),
          stderr: stderr.trim(),
          cli: `python ${cliArgs.join(" ")}`,
          cwd,
        });
```

</details>

**依据 2 · 源码核查**：[dsh/index.js:536-557](https://github.com/linhut/gongwen-skill/blob/6a41282aa5ae3ed3bbc55ad9adc33bcff80c7353/dsh/index.js#L536-L557)

设置回写

<details>
<summary>查看原文（22行）</summary>

```text
          const scope = settingsCtx.settings.register(SETTINGS_NS, schema, { applies: "live" });

          // 一次性迁移：dsh-config.json → settings 命名空间（仅当用户层为空）
          try {
            const legacy = _read_config();
            if (legacy) {
              const desc = settingsCtx.settings
                .describe({ redactSecrets: true })
                .find((d) => d.ns === SETTINGS_NS);
              const userEmpty = !desc || !desc.user || Object.keys(desc.user).length === 0;
              if (userEmpty) void scope.update(legacy);
            }
          } catch {
            // 迁移失败不影响注册
          }

          // watch：settings 变更 → 回写 dsh-config.json（CLI 侧事实源，保持兼容）
          const off = scope.watch((next) => {
            try {
              _write_config(next);
            } catch (e) {
              console.error("[gongwen-skill] settings sync failed:", e);
```

</details>

#### 缺口

- 依赖本机 Python、字体和包定位。
  **影响**：入口失败有结构化输出。
  **进一步探讨**：分别测试缺解释器和无效输入。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 权限与质量边界？

**研究主题**：缺陷与关键质疑

#### 完整回答

原生 spawn 不等于宿主沙箱，源码没有在该调用传递文件访问策略。修改文档与内容优化都应保留原件。字体存在也不能证明 Word 排版一致。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/index.js:325-335](https://github.com/linhut/gongwen-skill/blob/6a41282aa5ae3ed3bbc55ad9adc33bcff80c7353/dsh/index.js#L325-L335)

直接启动 Python

<details>
<summary>查看原文（11行）</summary>

```text
  const positionalKeys = POSITIONAL_ARGS[command] || [];
  const cliArgs = ["-m", "gongwen", command, ..._to_cli_args(rest, positionalKeys)];

  return await new Promise((resolvePromise) => {
    const child = spawn("python", cliArgs, {
      cwd,
      env: { ...process.env, PYTHONIOENCODING: "utf-8", PYTHONUTF8: "1" },
      windowsHide: true,
    });
    const abort = () => child.kill();
    signal?.addEventListener("abort", abort, { once: true });
```

</details>

**依据 2 · 作者声明**：[README.md:13-23](https://github.com/linhut/gongwen-skill/blob/6a41282aa5ae3ed3bbc55ad9adc33bcff80c7353/README.md#L13-L23)

作者承诺版式与内容工作流

<details>
<summary>查看原文（11行）</summary>

```text
> 中文公文全流程处理专家——基于 **GB/T 9704《党政机关公文格式》** 国家标准，支持 **格式检查与修复、内容优化（Word 原生修订+批注/差异对比版）、模板生成、Markdown 转公文、版头版记页码注入、事实核验、风格增强** 等完整能力。原生支持 **DeepSeek Harness (DSH)** 技能系统，打包为可被 AI Agent 直接调用的 Skill，完全自包含，克隆即用。

[![CI](https://img.shields.io/badge/CI-Passing-brightgreen)](https://github.com/linhut/gongwen-skill/actions)
[![PyPI](https://img.shields.io/pypi/v/gongwen-skill)](https://pypi.org/project/gongwen-skill/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)
![GB/T 9704](https://img.shields.io/badge/standard-GB%2FT%209704-red.svg)
![DSH](https://img.shields.io/badge/DSH-Compatible-brightgreen)
![Downloads](https://img.shields.io/pypi/dm/gongwen-skill)

本 Skill 源自开源桌面项目 [AI 公文智能优化助手](https://github.com/linhut/document-ai-assistant)，将其核心格式引擎抽取、剥离桌面端/数据库依赖后独立发行，支持公文的**模板建立、解析、规则检查、自动修复、内容优化、Markdown 转公文**全流程能力。同时原生集成 **DeepSeek Harness (DSH)** 技能系统，支持 DSH Agent 自动发现与加载。
```

</details>

#### 缺口

- 文件操作边界与渲染结果未验。
  **影响**：敏感文稿应在明确路径中操作。
  **进一步探讨**：用只读原件测试输出路径。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用退出成本？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

准备 Python、模板、字体和独立 profile，模型内容优化另有模型成本。工具会写配置和预设目录，退出需备份文稿及配置并检查预设留存。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/index.js:36-44](https://github.com/linhut/gongwen-skill/blob/6a41282aa5ae3ed3bbc55ad9adc33bcff80c7353/dsh/index.js#L36-L44)

本机配置根

```text
const APP_DATA_DIR = join(homedir(), ".gongwen-skill");
const CONFIG_FILE = join(APP_DATA_DIR, "dsh-config.json");
const DEFAULTS_FILE = join(resolve(__dirname, ".."), "etc", "dsh-config-defaults.json");

// settings 命名空间（官方要求小写 kebab-case；与浏览器卡片同名配对）
const SETTINGS_NS = "gongwen-skill";

// 系统提示段落名（官方约定 plugin:<name>，重复注册会抛错）
const SECTION_NAME = "plugin:gongwen-skill";
```

**依据 2 · 源码核查**：[dsh/index.js:378-383](https://github.com/linhut/gongwen-skill/blob/6a41282aa5ae3ed3bbc55ad9adc33bcff80c7353/dsh/index.js#L378-L383)

预设安装目录

```text
// ~/.dsh/.agent-presets/gongwen-skill/，使 DSH Web 新建会话可选「公文全流程处理专家」预设。
// 参照官方插件模式（np-ppt）：每次 apply 幂等同步；用户自行修改过的预设会被插件版本覆盖，
// 如需自定义可从该预设 copy 出新预设再改。
function ensurePresetInstalled() {
  try {
    const userPresetDir = join(homedir(), ".dsh", ".agent-presets", "gongwen-skill");
```

**依据 3 · 作者声明**：[README.md:16-20](https://github.com/linhut/gongwen-skill/blob/6a41282aa5ae3ed3bbc55ad9adc33bcff80c7353/README.md#L16-L20)

作者说明 Python 条件

```text
[![PyPI](https://img.shields.io/pypi/v/gongwen-skill)](https://pypi.org/project/gongwen-skill/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)
![GB/T 9704](https://img.shields.io/badge/standard-GB%2FT%209704-red.svg)
![DSH](https://img.shields.io/badge/DSH-Compatible-brightgreen)
```

#### 缺口

- 字体和标准模板授权范围待核。
  **影响**：人工审阅占主要验收成本。
  **进一步探讨**：把生成与人工核对分别计时。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些结果否定目标？

**研究主题**：新假设与验证

#### 完整回答

对照手工排版和插件，核对页码、标题、数字、否定词及修订可接受性，模拟缺字体和中断。原件被覆盖、修订不可追踪或导出视觉偏差未提示时，当前组合不满足任务。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/index.js:329-370](https://github.com/linhut/gongwen-skill/blob/6a41282aa5ae3ed3bbc55ad9adc33bcff80c7353/dsh/index.js#L329-L370)

运行和取消可注入失败

<details>
<summary>查看原文（42行）</summary>

```text
    const child = spawn("python", cliArgs, {
      cwd,
      env: { ...process.env, PYTHONIOENCODING: "utf-8", PYTHONUTF8: "1" },
      windowsHide: true,
    });
    const abort = () => child.kill();
    signal?.addEventListener("abort", abort, { once: true });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => (stdout += chunk.toString("utf-8")));
    child.stderr.on("data", (chunk) => (stderr += chunk.toString("utf-8")));
    child.on("error", (err) => {
      signal?.removeEventListener("abort", abort);
      resolvePromise({
        success: false,
        error: `python spawn failed: ${err.message}`,
        cli: `python ${cliArgs.join(" ")}`,
        cwd,
      });
    });
    child.on("close", (code) => {
      signal?.removeEventListener("abort", abort);
      if (code === 0) {
        const trimmed = stdout.trim();
        if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
          try {
            resolvePromise({ success: true, data: JSON.parse(trimmed), stderr: stderr.trim() });
            return;
          } catch {
            // 非 JSON
          }
        }
        resolvePromise({ success: true, output: trimmed, stderr: stderr.trim() });
      } else {
        resolvePromise({
          success: false,
          exit_code: code,
          output: stdout.trim(),
          stderr: stderr.trim(),
          cli: `python ${cliArgs.join(" ")}`,
          cwd,
        });
```

</details>

**依据 2 · 作者声明**：[README.md:13-23](https://github.com/linhut/gongwen-skill/blob/6a41282aa5ae3ed3bbc55ad9adc33bcff80c7353/README.md#L13-L23)

作者交付目标可转为检查项

<details>
<summary>查看原文（11行）</summary>

```text
> 中文公文全流程处理专家——基于 **GB/T 9704《党政机关公文格式》** 国家标准，支持 **格式检查与修复、内容优化（Word 原生修订+批注/差异对比版）、模板生成、Markdown 转公文、版头版记页码注入、事实核验、风格增强** 等完整能力。原生支持 **DeepSeek Harness (DSH)** 技能系统，打包为可被 AI Agent 直接调用的 Skill，完全自包含，克隆即用。

[![CI](https://img.shields.io/badge/CI-Passing-brightgreen)](https://github.com/linhut/gongwen-skill/actions)
[![PyPI](https://img.shields.io/pypi/v/gongwen-skill)](https://pypi.org/project/gongwen-skill/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)
![GB/T 9704](https://img.shields.io/badge/standard-GB%2FT%209704-red.svg)
![DSH](https://img.shields.io/badge/DSH-Compatible-brightgreen)
![Downloads](https://img.shields.io/pypi/dm/gongwen-skill)

本 Skill 源自开源桌面项目 [AI 公文智能优化助手](https://github.com/linhut/document-ai-assistant)，将其核心格式引擎抽取、剥离桌面端/数据库依赖后独立发行，支持公文的**模板建立、解析、规则检查、自动修复、内容优化、Markdown 转公文**全流程能力。同时原生集成 **DeepSeek Harness (DSH)** 技能系统，支持 DSH Agent 自动发现与加载。
```

</details>

#### 缺口

- 未运行生成及渲染。
  **影响**：可分开衡量格式与语义。
  **进一步探讨**：保存原件、产物和逐页审阅。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
