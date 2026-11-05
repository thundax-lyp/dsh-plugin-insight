# MakoCode

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[6a1a1cd](https://github.com/liebaojun/MakoCode/tree/6a1a1cd69c9217f35727945ae1bb9d007740c542)

<!-- BEGIN META -->
[![GitHub ★ 158](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=158&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/liebaojun/MakoCode)
<!-- END META -->

> **功能**：用 Electron 视觉小说界面封装 Claude Code CLI，提供角色、配音和会话交互。

> **亮点**：[Q01](#research-q01) 提供角色界面和前端消息桥。

> **主要限制**：[Q03](#research-q03) 真实调用路径可把提供方凭据原样打到 stderr。

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
  - [Q01 · 这是 DSH 扩展还是桌面客户端？](#detail-section-11)
  - [Q02 · 消息怎样交给 Claude Code？](#detail-section-12)
  - [Q03 · 凭据与权限有哪些直接限制？](#detail-section-13)
  - [Q04 · DSH 用户应如何选择？](#detail-section-14)
  - [Q05 · 日志脱敏能否保留排障价值？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要 DSH 扩展的人可识别此条目是独立客户端。

直接运行 CLI 可保留原有文本交互。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 桌面界面 | 呈现会话与角色 | 不接 DSH |
| CLI 桥 | 发送请求和接收输出 | 有未遮罩日志路径 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Electron 和 Claude CLI | 必需 | 运行独立客户端 | 无法发请求 |
| 模型账号 | 真实聊天需要 | 调用提供方 | 仅用替身核查 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 阅读 | 核对凭据日志 | 不要用真实凭据试此路径 |
| 核查 | 用 CLI 替身 | 验证流和脱敏 |
| 退出 | 关闭应用 | 继续原宿主 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 依赖成本未知 | 配置耗时未知 | 独立安装 |
| 持续 | 模型费用未知 | 维护耗时未知 | 需要保护日志 |
| 恢复 | 恢复成本未知 | 清理耗时未知 | 历史输出范围未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 主题界面 | 可查独立进程与说明 | 真实体验未测 |

> **思考**：[Q03](#research-q03) 真实调用路径可把提供方凭据原样打到 stderr。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 提供角色界面和前端消息桥。

断连会终止直接进程，权限和外部副作用仍要分别核查。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 真实调用路径可把提供方凭据原样打到 stderr。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 只用无凭据替身或静态阅读。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的独立桌面客户端的 CLI 接线、权限与日志。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、server.js、electron-main.js、lib/settings.js、lib/utils.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的独立桌面客户端的 CLI 接线、权限与日志。未执行目标代码或实际宿主验证。
- 下一步：用伪令牌扫描完整输出

**分析版本**

- **仓库**：[liebaojun/MakoCode](https://github.com/liebaojun/MakoCode)
- **版本号**：1.6.7（[固定提交 6a1a1cd](https://github.com/liebaojun/MakoCode/tree/6a1a1cd69c9217f35727945ae1bb9d007740c542)）
- **版本日期**：2026-08-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 验证脱敏日志能否保留排障能力。

用伪令牌扫描完整输出

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 2646 | — | — | 23267 |
| .js | source | 13 | 4627 | 3636 | 613 | — |
| .js | test | 1 | 44 | 41 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/liebaojun/MakoCode/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：独立桌面客户端的 CLI 接线、权限与日志

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 这是 DSH 扩展还是桌面客户端？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根入口是 Electron，README 明确封装 Claude Code。可在主题化桌面界面调用原 CLI，但没有 DSH bundle 接口。相比终端直接运行，主要增量是立绘、场景和交互层。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-6](https://github.com/liebaojun/MakoCode/blob/6a1a1cd69c9217f35727945ae1bb9d007740c542/README.md#L1-L6)

作者定位

```text
# MakoCode — 茉子版 Agent

<p align="center">
  <strong>一个自带完整 Galgame 界面的桌面 AI Agent</strong><br>
  以《千恋＊万花》常陆茉子为主题形象，封装 Claude Code CLI 为沉浸式视觉小说体验
</p>
```

**依据 2 · 作者声明**：[README.md:28-45](https://github.com/liebaojun/MakoCode/blob/6a1a1cd69c9217f35727945ae1bb9d007740c542/README.md#L28-L45)

角色和配音

<details>
<summary>查看原文（18行）</summary>

```text
### 🎮 Galgame 沉浸界面
- **角色立绘系统**：常陆茉子 + 朝武芳乃双角色，超 110 张 PNG 表情立绘
- **动态位置状态机**：说话者居中放大，听者侧移缩小，0.7s 平滑过渡
- **场景背景**：6 张和风场景（和室/浴室/餐厅/道场/旅店/神社），1.5s 淡入淡出
- **BGM 系统**：30+ 首千恋万花原声 BGM，按场景自动切换
- **樱花粒子**：35 片花瓣永远飘落，随机大小/速度/旋转
- **思考气泡**：AI 思考时弹出茉子风格俏皮话气泡
- **打字机效果**：逐字显示 + Markdown 渲染 + KaTeX 公式支持

<p align="center">
  <img src="assets/screenshots/chat.png" alt="茉子对话界面，AI 实时聊天" width="700">
</p>

### 🗣️ 语音系统
- 30 条预生成问候语音（GPT-SoVITS TTS）
- 7 条思考语音（嗯.../喵.../啊...等）
- 语音缓存管理（FIFO 200MB 上限）
- 独立音量控制
```

</details>

**依据 3 · 源码核查**：[package.json:1-13](https://github.com/liebaojun/MakoCode/blob/6a1a1cd69c9217f35727945ae1bb9d007740c542/package.json#L1-L13)

Electron 启动入口

<details>
<summary>查看原文（13行）</summary>

```text
{
  "name": "makocode",
  "version": "1.6.7",
  "description": "MakoCode - Hitachi Mako Galgame AI Companion",
  "author": "liebaojun",
  "main": "electron-main.js",
  "scripts": {
    "start": "electron .",
    "test": "node test/platform.test.js",
    "build": "electron-builder --win",
    "build:dir": "electron-builder --win --dir",
    "build:mac": "electron-builder --mac --arm64",
    "build:mac:dir": "electron-builder --mac --arm64 --dir"
```

</details>

**依据 4 · 源码核查**：[server.js:1142-1149](https://github.com/liebaojun/MakoCode/blob/6a1a1cd69c9217f35727945ae1bb9d007740c542/server.js#L1142-L1149)

实际 CLI 子进程

```text
  const { command: claudeCmd, args: claudeArgs } = platform.claudeInvocation(args, env);

  log(`Spawning: ${claudeCmd} ${claudeArgs.join(" ")} (prompt via stdin, ${prompt.length} chars)`);

  const proc = spawn(claudeCmd, claudeArgs, {
    env,
    stdio: ["pipe", "pipe", "pipe"],
  });
```

#### 缺口

- 未运行图形界面
  **影响**：体验与稳定性未知
  **进一步探讨**：用模拟 CLI 检查渲染和退出

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 消息怎样交给 Claude Code？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

客户端连接回环服务，服务以 stream-json 模式启动 CLI，并把 prompt 从 stdin 写入。断连时尝试杀直接进程并移除挂起问题。可以从输出传递消息，但本地断开不证明工具产生的外部效果已经回退。

#### 证据与依据

**依据 1 · 源码核查**：[electron-main.js:158-172](https://github.com/liebaojun/MakoCode/blob/6a1a1cd69c9217f35727945ae1bb9d007740c542/electron-main.js#L158-L172)

Electron 启动服务

<details>
<summary>查看原文（15行）</summary>

```text
    // 使用 process.execPath（Electron 内置运行时）+ Node 模式
    // 子进程检测到 MAKO_SERVER_MODE=1 后只运行 server.js，不创建窗口
    serverProc = spawn(process.execPath, [serverPath, String(SERVER_PORT)], {
      cwd: APP_DIR,
      env,
      stdio: ['pipe', 'pipe', 'pipe'],
      detached: process.platform !== 'win32',
    });

    serverProc.stdout.on('data', (data) => {
      process.stdout.write(data);
    });

    serverProc.stderr.on('data', (data) => {
      process.stderr.write(data);
```

</details>

**依据 2 · 源码核查**：[server.js:1097-1119](https://github.com/liebaojun/MakoCode/blob/6a1a1cd69c9217f35727945ae1bb9d007740c542/server.js#L1097-L1119)

CLI 参数

<details>
<summary>查看原文（23行）</summary>

```text
// ─── 单次对话（--print 模式）─────────────────────────
function streamChat(res, prompt, sessionId, allowedTools, permissionMode) {
  const env = buildEnv();
  const args = ["--output-format", "stream-json", "--verbose", "--input-format", "stream-json"];

  if (sessionId) {
    args.push("--session-id", sessionId);
  }

  if (allowedTools && allowedTools.length > 0) {
    args.push("--allowedTools", allowedTools.join(","));
  }

  if (permissionMode && permissionMode !== "default") {
    // MakoCode 的 bypass → Claude CLI 的 bypassPermissions，其余直接通过
    const CLI_MODE_MAP = { bypass: 'bypassPermissions' };
    const cliMode = CLI_MODE_MAP[permissionMode] || permissionMode;
    args.push("--permission-mode", cliMode);
  }

  // --model 显式指定模型，优先级高于 settings.json 的 env.ANTHROPIC_MODEL
  args.push("--model", currentModel);
  args.push("--print");
```

</details>

**依据 3 · 源码核查**：[server.js:1142-1169](https://github.com/liebaojun/MakoCode/blob/6a1a1cd69c9217f35727945ae1bb9d007740c542/server.js#L1142-L1169)

子进程、stdin 和断连

<details>
<summary>查看原文（28行）</summary>

```text
  const { command: claudeCmd, args: claudeArgs } = platform.claudeInvocation(args, env);

  log(`Spawning: ${claudeCmd} ${claudeArgs.join(" ")} (prompt via stdin, ${prompt.length} chars)`);

  const proc = spawn(claudeCmd, claudeArgs, {
    env,
    stdio: ["pipe", "pipe", "pipe"],
  });

  // 注册待回答问题（供 /api/respond 使用），5分钟无响应自动清理
  const qId = crypto.randomUUID();
  setPendingQuestion(qId, { proc, res, question: null });

  // 客户端断开时杀死进程，防止会话锁定
  res.on('close', () => {
    deletePendingQuestion(qId);
    if (proc.exitCode === null) {
      log('Client disconnected, killing claude process');
      proc.kill();
    }
  });

  // 发送 question ID 给前端（用于回答时关联）
  writeLine(res, { type: "gallm_init", qId });

  // 通过 stdin 发送 stream-json 格式的 prompt，不关闭 stdin（权限答案需回写）
  const stdinMsg = JSON.stringify({ type: "user", message: { role: "user", content: prompt } });
  proc.stdin.write(stdinMsg + "\n");
```

</details>

#### 缺口

- 未测试过程树和外部工具
  **影响**：无法保证全量取消
  **进一步探讨**：用无副作用替身模拟断线

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 凭据与权限有哪些直接限制？

**研究主题**：缺陷与关键质疑

#### 完整回答

buildEnv 会将配置令牌放入 ANTHROPIC_AUTH_TOKEN 和 ANTHROPIC_API_KEY。streamChat 收集这些前缀变量并把整段 settings 写到日志，日志实现直写 stderr。因此调用此路径且令牌存在时会把凭据写入日志；本次没有读取真实令牌。请求还可选择 bypass，并映射到 CLI 的 bypassPermissions。

#### 证据与依据

**依据 1 · 源码核查**：[lib/settings.js:88-96](https://github.com/liebaojun/MakoCode/blob/6a1a1cd69c9217f35727945ae1bb9d007740c542/lib/settings.js#L88-L96)

令牌进入环境

```text
function buildEnv() {
  const env = { ...process.env };
  env.ANTHROPIC_BASE_URL = makoSettings.ANTHROPIC_BASE_URL;
  if (makoSettings.ANTHROPIC_AUTH_TOKEN) {
    env.ANTHROPIC_AUTH_TOKEN = makoSettings.ANTHROPIC_AUTH_TOKEN;
    env.ANTHROPIC_API_KEY = makoSettings.ANTHROPIC_AUTH_TOKEN;
  }
  env.ANTHROPIC_MODEL = currentModel;
  env.ANTHROPIC_DEFAULT_OPUS_MODEL = makoSettings.ANTHROPIC_DEFAULT_OPUS_MODEL;
```

**依据 2 · 源码核查**：[server.js:1106-1130](https://github.com/liebaojun/MakoCode/blob/6a1a1cd69c9217f35727945ae1bb9d007740c542/server.js#L1106-L1130)

权限映射和未遮罩的设置日志

<details>
<summary>查看原文（25行）</summary>

```text
  if (allowedTools && allowedTools.length > 0) {
    args.push("--allowedTools", allowedTools.join(","));
  }

  if (permissionMode && permissionMode !== "default") {
    // MakoCode 的 bypass → Claude CLI 的 bypassPermissions，其余直接通过
    const CLI_MODE_MAP = { bypass: 'bypassPermissions' };
    const cliMode = CLI_MODE_MAP[permissionMode] || permissionMode;
    args.push("--permission-mode", cliMode);
  }

  // --model 显式指定模型，优先级高于 settings.json 的 env.ANTHROPIC_MODEL
  args.push("--model", currentModel);
  args.push("--print");

  // --settings 覆盖 ~/.claude/settings.json 中的 env，防止全局配置覆盖 MakoCode 的自定义模型设置
  const envOverrides = {};
  for (const [key, value] of Object.entries(env)) {
    if (value != null && (key.startsWith('ANTHROPIC_') || key.startsWith('CLAUDE_CODE_'))) {
      envOverrides[key] = value;
    }
  }
  const overrideSettings = { env: envOverrides };
  args.push("--settings", JSON.stringify(overrideSettings));
  log(`[settings-override] ${JSON.stringify(overrideSettings)}`);
```

</details>

**依据 3 · 源码核查**：[lib/utils.js:8-13](https://github.com/liebaojun/MakoCode/blob/6a1a1cd69c9217f35727945ae1bb9d007740c542/lib/utils.js#L8-L13)

日志去 stderr

```text
// ─── 日志（统一格式）────────────────────────────────────
function createLogger(prefix) {
  return function log(msg) {
    process.stderr.write(`[${prefix}] ${msg}\n`);
  };
}
```

**依据 4 · 源码核查**：[server.js:450-457](https://github.com/liebaojun/MakoCode/blob/6a1a1cd69c9217f35727945ae1bb9d007740c542/server.js#L450-L457)

请求选择权限模式

```text
    if (url.pathname === "/api/chat") {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => {
        try {
          const { message, sessionId, allowedTools, permissionMode: reqPermMode, uploadedFiles, history } = JSON.parse(body);
          const effectivePermMode = (reqPermMode && reqPermMode !== 'default') ? reqPermMode : permissionMode;
          let prompt = (message || "").trim();
```

#### 缺口

- 未核查实际日志收集位置
  **影响**：不能界定泄露传播范围
  **进一步探讨**：用伪令牌及模拟 CLI 核对日志输出

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · DSH 用户应如何选择？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

要扩展 DSH 会话的人应跳过该项目。要研究主题客户端可静态阅读或用无凭据替身验证，直到日志不再输出敏感信息。项目依赖 Electron、Claude Code 与提供方凭据，安装和维护时间未测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:103-110](https://github.com/liebaojun/MakoCode/blob/6a1a1cd69c9217f35727945ae1bb9d007740c542/README.md#L103-L110)

作者安装入口

```text
## 🚀 Quick Start

### 方式一：下载安装器（推荐）

从 [Releases](../../releases) 下载最新 `MakoCode Setup x.x.x.exe`，双击安装。

安装器会引导你完成：
1. 自动检测并安装 Node.js / Git / Claude Code
```

**依据 2 · 源码核查**：[server.js:1121-1130](https://github.com/liebaojun/MakoCode/blob/6a1a1cd69c9217f35727945ae1bb9d007740c542/server.js#L1121-L1130)

真实凭据不宜用于该路径

<details>
<summary>查看原文（10行）</summary>

```text
  // --settings 覆盖 ~/.claude/settings.json 中的 env，防止全局配置覆盖 MakoCode 的自定义模型设置
  const envOverrides = {};
  for (const [key, value] of Object.entries(env)) {
    if (value != null && (key.startsWith('ANTHROPIC_') || key.startsWith('CLAUDE_CODE_'))) {
      envOverrides[key] = value;
    }
  }
  const overrideSettings = { env: envOverrides };
  args.push("--settings", JSON.stringify(overrideSettings));
  log(`[settings-override] ${JSON.stringify(overrideSettings)}`);
```

</details>

**依据 3 · 源码核查**：[package.json:1-13](https://github.com/liebaojun/MakoCode/blob/6a1a1cd69c9217f35727945ae1bb9d007740c542/package.json#L1-L13)

独立启动

<details>
<summary>查看原文（13行）</summary>

```text
{
  "name": "makocode",
  "version": "1.6.7",
  "description": "MakoCode - Hitachi Mako Galgame AI Companion",
  "author": "liebaojun",
  "main": "electron-main.js",
  "scripts": {
    "start": "electron .",
    "test": "node test/platform.test.js",
    "build": "electron-builder --win",
    "build:dir": "electron-builder --win --dir",
    "build:mac": "electron-builder --mac --arm64",
    "build:mac:dir": "electron-builder --mac --arm64 --dir"
```

</details>

#### 缺口

- 未运行应用或模型
  **影响**：不可判断正式体验
  **进一步探讨**：仅用合成材料复核

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 日志脱敏能否保留排障价值？

**研究主题**：新假设与验证

#### 完整回答

将当前完整设置日志与只记录 provider、模型和凭据是否存在的版本比较。用伪令牌验证日志无原文并用配置错误对照定位时间；若仍泄露或诊断不可用，就调整字段后再评估。

#### 证据与依据

**依据 1 · 源码核查**：[server.js:1121-1130](https://github.com/liebaojun/MakoCode/blob/6a1a1cd69c9217f35727945ae1bb9d007740c542/server.js#L1121-L1130)

日志原字段

<details>
<summary>查看原文（10行）</summary>

```text
  // --settings 覆盖 ~/.claude/settings.json 中的 env，防止全局配置覆盖 MakoCode 的自定义模型设置
  const envOverrides = {};
  for (const [key, value] of Object.entries(env)) {
    if (value != null && (key.startsWith('ANTHROPIC_') || key.startsWith('CLAUDE_CODE_'))) {
      envOverrides[key] = value;
    }
  }
  const overrideSettings = { env: envOverrides };
  args.push("--settings", JSON.stringify(overrideSettings));
  log(`[settings-override] ${JSON.stringify(overrideSettings)}`);
```

</details>

**依据 2 · 源码核查**：[lib/settings.js:88-108](https://github.com/liebaojun/MakoCode/blob/6a1a1cd69c9217f35727945ae1bb9d007740c542/lib/settings.js#L88-L108)

已有只记录 auth 状态的做法

<details>
<summary>查看原文（21行）</summary>

```text
function buildEnv() {
  const env = { ...process.env };
  env.ANTHROPIC_BASE_URL = makoSettings.ANTHROPIC_BASE_URL;
  if (makoSettings.ANTHROPIC_AUTH_TOKEN) {
    env.ANTHROPIC_AUTH_TOKEN = makoSettings.ANTHROPIC_AUTH_TOKEN;
    env.ANTHROPIC_API_KEY = makoSettings.ANTHROPIC_AUTH_TOKEN;
  }
  env.ANTHROPIC_MODEL = currentModel;
  env.ANTHROPIC_DEFAULT_OPUS_MODEL = makoSettings.ANTHROPIC_DEFAULT_OPUS_MODEL;
  env.ANTHROPIC_DEFAULT_SONNET_MODEL = makoSettings.ANTHROPIC_DEFAULT_SONNET_MODEL;
  env.ANTHROPIC_DEFAULT_HAIKU_MODEL = makoSettings.ANTHROPIC_DEFAULT_HAIKU_MODEL;
  if (makoSettings.CLAUDE_CODE_SUBAGENT_MODEL) {
    env.CLAUDE_CODE_SUBAGENT_MODEL = makoSettings.CLAUDE_CODE_SUBAGENT_MODEL;
  }
  if (makoSettings.CLAUDE_CODE_EFFORT_LEVEL) {
    env.CLAUDE_CODE_EFFORT_LEVEL = makoSettings.CLAUDE_CODE_EFFORT_LEVEL;
  }
  env.CLAUDE_CODE_ENTRYPOINT = "sdk-ts";
  env.NO_COLOR = "1";
  env.NODE_NO_WARNINGS = "1";
  log(`buildEnv: model=${currentModel}, base=${env.ANTHROPIC_BASE_URL}, auth=${env.ANTHROPIC_AUTH_TOKEN ? 'set' : 'MISSING'}, effort=${env.CLAUDE_CODE_EFFORT_LEVEL || 'default'}`);
```

</details>

#### 缺口

- 未实施改动
  **影响**：不能宣称风险已修复
  **进一步探讨**：用伪令牌扫描完整输出

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
