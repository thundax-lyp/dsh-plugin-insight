# dsh-wsl-tmux

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[f6f2372](https://github.com/173787247/dsh-wsl-tmux/tree/f6f23727c2959d69559ec26f474d2e871473c224)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-tmux)
<!-- END META -->

> **实现功能**：提供tmux状态、会话列表和pane文字捕获模型工具，不发送按键或终止会话。

> **核心亮点**：将原生tmux查询包装为受限模型入口，减少手工复制输出。详见[Q01](#research-q01)。

> **风险与缺陷**：默认socket不绑定agent工作区，code1一律空与文本隐藏截断可能误读任务，头部切片可漏最新尾部。详见[Q03](#research-q03)。

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
  - [Q01 · 只读tmux工具给谁交付什么？](#detail-section-11)
  - [Q02 · 选择的是哪个server和pane，名称校验限制什么？](#detail-section-12)
  - [Q03 · 空列表、截断和超时能否按字面理解？](#detail-section-13)
  - [Q04 · 工程与三阶段成本如何评估？](#detail-section-14)
  - [Q05 · 什么条件适合采用，可证伪的改进方向是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：长任务已在tmux运行，用户希望模型查看输出线索。详见[Q01](#research-q01)。

原生tmux查询与手工粘贴，未提供任务启动/控制/验收。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| `tmux_status` | 查tmux/screen位置、版本和会话数 | screen无操作；ok不保证任务存在/健康 |
| `tmux_list` | 列默认server会话 | code1可被当空，无agent scope |
| `tmux_capture` | 捕获默认target pane文字 | 名称/500历史参数限制；文本可能截断漏尾 |

**流程与依赖**

#### 启动与依赖

| 条件 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| Node>=18/tools/systemPrompt | 注册入口 | 宿主API匹配 |
| bash/tmux/PATH | 定位与查询 | which无自身预算 |
| 默认用户socket | 目标server | 非agent工作区隔离 |
| 可分享pane | 模型读输出 | 不自动过滤秘密 |


#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 核账户/server和敏感性 | 用户 | 目标可授权分享 |
| tmux_status/list | 模型/用户 | 空列表还需区分错误 |
| 指定session capture | 模型/用户 | 核实际pane/最新尾部 |
| 对照任务结果 | 用户 | 不按快照代替验收 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Node/宿主、bash/tmux与既有用户socket，金额未知 | 核进程账户/server与可分享pane，准备工时未知 | 不安装tmux、不创建任务；screen仅检测位置 |
| 持续使用 | bash定位与tmux进程、stdout/stderr缓冲、结果模型上下文 | 选择准确目标、核输出时点/完整性 | 无独立模型请求不等宿主费用为零；捕获最大500历史参数非总输出行数，真实延迟未知 |
| 失败恢复 | 再查询消耗进程/上下文；无任务状态写入 | 分清假空、错pane、截断和模型已读敏感文本 | 停用不撤回已外发文本；恢复金额/工时未知，不用工具timeout推所有子进程已停 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 观察长任务 | list/capture固定查询 | 输出不等完成状态 |
| 减少上下文 | capture切片/lines参数 | 文本不标截断且可能漏尾 |
| 不控制任务 | 无send keys/kill session | 读出敏感文字仍有披露成本 |

> **思考**：默认socket不绑定agent工作区，code1一律空与文本隐藏截断可能误读任务，头部切片可漏最新尾部。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将原生tmux查询包装为受限模型入口，减少手工复制输出。详见[Q01](#research-q01)。

将原生tmux查询包装为受限模型入口，减少手工复制输出。详见[Q01](#research-q01)。

核心分层/固定argv可复用，补精确target、错误分层和显式部分结果比测试数量更关键。详见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

默认socket不绑定agent工作区，code1一律空与文本隐藏截断可能误读任务，头部切片可漏最新尾部。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

明确server/pane、无敏感内容的可控范围试用，真实任务结果另核。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

三个只读入口可查；目标scope、code1假空与截断可见性限制观察可靠性，精确观察句柄假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、lib/tmux.js、test/tmux.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整97行入口/92行核心/8行生产名称测试和README/package；不执行tmux/读取实际pane或验证外部CLI。
- 下一步：从默认server/相似名称/code1错误/超限输出和取消反例证伪精确观察句柄。

**分析版本**

- **仓库**：[173787247/dsh-wsl-tmux](https://github.com/173787247/dsh-wsl-tmux)
- **版本号**：0.1.1（[固定提交 f6f2372](https://github.com/173787247/dsh-wsl-tmux/tree/f6f23727c2959d69559ec26f474d2e871473c224)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

研究server/pane精确句柄、带时间的partial尾部回执和统一预算，按错目标/假空/漏尾反例比较，尚未验证。详见[Q05](#research-q05)。

从默认server/相似名称/code1错误/超限输出和取消反例证伪精确观察句柄。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 116 | — | — | 448 |
| .js | source | 2 | 189 | 176 | 0 | — |
| .js | test | 1 | 8 | 7 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-tmux/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-tmux/issues?q=is%3Aissue+created%3A2026-09-22T09%3A25%3A11.295Z..2026-10-22T09%3A25%3A11.295Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-tmux/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T09%3A25%3A11.295Z..2026-10-22T09%3A25%3A11.295Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：模型只读tmux观察是否准确指向预期pane，结果完整性、资源预算和敏感内容边界如何判断？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 只读tmux工具给谁交付什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

给已在tmux运行长编译/服务等任务的DSH用户，模型可先查tmux/screen位置、列会话，再捕获pane文字，减少用户手工复制终端输出。不提供send-keys、kill-session、创建或恢复任务；screen只有位置检测，没有screen列表/捕获能力。原任务是否成功仍需业务日志或退出结果，pane快照只是观察材料。

参照原生tmux list-sessions/capture-pane与手工粘贴，本项贡献是固定模型入口和返回长度限制，没有新终端会话持久化技术。README前表0.1.0与package0.1.1冲突，以固定发布入口为准。适合可信同用户环境的观察，不适合把“可读pane”当自动授权或工作区隔离。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-34](https://github.com/173787247/dsh-wsl-tmux/blob/f6f23727c2959d69559ec26f474d2e871473c224/README.md#L5-L34)

只读定位与版本/工具表。

<details>
<summary>查看原文（30行）</summary>

````text
只读查看 tmux 会话与 pane 输出。

| | |
|---|---|
| 版本 | **0.1.0** |
| 套件 | [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit) **可选**，不在 `install.sh` |

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-tmux
# 或本机 path：
# dsh plugin --profile web add /mnt/c/Users/YOU/Desktop/AIFullStackDevelopment/dsh-wsl-tmux
```

kit 批量链接（可选）：`bash dsh-wsl-kit/scripts/link-linux-plugins.sh`

## 工具

| 工具 | 作用 |
|------|------|
| `tmux_status` | tmux/screen 是否可用 |
| `tmux_list` | 列会话 |
| `tmux_capture` | capture-pane |

## 配置要点

`timeoutMs`

不发送按键、不杀会话。
````

</details>

**依据 2 · 源码核查**：[index.js:20-86](https://github.com/173787247/dsh-wsl-tmux/blob/f6f23727c2959d69559ec26f474d2e871473c224/index.js#L20-L86)

三个工具。

<details>
<summary>查看原文（67行）</summary>

```text
  ctx.tools.register({
    name: "tmux_status",
    description: "Whether tmux/screen are on PATH; version + live session count.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }] },
    timeoutMs: 8_000,
    isConcurrencySafe: () => true,
    async execute() {
      return tmuxStatus();
    },
    presentCall: () => ({ card: "generic", title: "tmux status" }),
    presentResult: (_a, r) => ({ card: "generic", title: "tmux status", content: r.content }),
  });

  ctx.tools.register({
    name: "tmux_list",
    description: "List tmux sessions (name, windows, attached).",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [
        {
          type: "text",
          text:
            v.ok === false
              ? v.error
              : (v.sessions || []).map((s) => `${s.name}\twindows=${s.windows}\tattached=${s.attached}`).join("\n") ||
                "(no sessions)",
        },
      ],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute() {
      try {
        return await tmuxList({ timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
    presentCall: () => ({ card: "generic", title: "tmux list" }),
    presentResult: (_a, r) => ({ card: "generic", title: "tmux list", content: r.content }),
  });

  ctx.tools.register({
    name: "tmux_capture",
    description: "Capture recent pane text from a tmux session (read-only).",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["session"],
      properties: {
        session: { type: "string" },
        lines: { type: "number", description: "History lines to capture (default 80)" },
      },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : v.text }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await tmuxCapture({ session: args.session, lines: args.lines, timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
```

</details>

**依据 3 · 源码核查**：[lib/tmux.js:45-92](https://github.com/173787247/dsh-wsl-tmux/blob/f6f23727c2959d69559ec26f474d2e871473c224/lib/tmux.js#L45-L92)

status/list/capture实际能力。

<details>
<summary>查看原文（48行）</summary>

```text
export async function tmuxStatus() {
  const tmux = (await which("tmux")) || null;
  const screen = (await which("screen")) || null;
  let sessionCount = null;
  let version = null;
  if (tmux) {
    try {
      const ver = await run(tmux, ["-V"], 5_000);
      version = (ver.stdout || ver.stderr || "").trim() || null;
      const list = await tmuxList({ timeoutMs: 5_000 });
      sessionCount = Array.isArray(list.sessions) ? list.sessions.length : 0;
    } catch {
      sessionCount = null;
    }
  }
  return { ok: true, tmux, screen, version, sessionCount };
}

export async function tmuxList({ timeoutMs = 10_000 } = {}) {
  const bin = (await which("tmux")) || "tmux";
  const { code, stdout, stderr } = await run(bin, ["list-sessions", "-F", "#{session_name}\t#{session_windows}\t#{session_attached}"], timeoutMs);
  if (code !== 0) {
    if (/no server|no sessions/i.test(stderr) || code === 1) return { ok: true, sessions: [] };
    throw new Error(`tmux list failed: ${stderr || code}`);
  }
  const sessions = stdout
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [name, windows, attached] = line.split("\t");
      return { name, windows: Number(windows) || 0, attached: attached === "1" };
    });
  return { ok: true, sessions };
}

export async function tmuxCapture({ session, lines = 80, timeoutMs = 10_000, maxOut = 40_000 } = {}) {
  const name = assertSessionName(session);
  const n = Math.min(500, Math.max(1, Number(lines) || 80));
  const bin = (await which("tmux")) || "tmux";
  const { code, stdout, stderr } = await run(
    bin,
    ["capture-pane", "-p", "-t", name, "-S", `-${n}`],
    timeoutMs,
  );
  if (code !== 0) throw new Error(`tmux capture failed: ${stderr || code}`);
  const text = stdout.slice(0, maxOut);
  return { ok: true, session: name, lines: n, truncated: stdout.length > maxOut, text };
}
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 选择的是哪个server和pane，名称校验限制什么？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

which用bash -lc command-v找程序，再spawn固定argv；list无用户参数，capture仅session和lines。没有指定tmux -L/-S socket、cwd或agent scope，使用宿主进程账户与继承环境解析默认tmux server，故可能列出同用户其他工作区会话。屏幕内容读出后进入模型工具响应，不做token/密码/终端敏感信息过滤。

session先trim，再限制ASCII字母数字._@+-和64字符，不插shell；不支持列出的任意Unicode名称，也不能传session:window.pane选择器。capture -t传原名字且无精确等号/独立pane ID，只能让tmux按其target默认规则解析，当前窗口/默认pane和前缀歧义仍依所装tmux版本。lines夹1到500但不取整，-S负数表示起始历史位置，不是只返回N行/精确tail N。

Node>=18、bash/tmux、宿主tools/systemPrompt以及正确账户/socket权限为依赖，无WSL检测门。探到screen不代表它能承担fallback；version/status不测实际任务进展。

#### 证据与依据

**依据 1 · 源码核查**：[lib/tmux.js:3-16](https://github.com/173787247/dsh-wsl-tmux/blob/f6f23727c2959d69559ec26f474d2e871473c224/lib/tmux.js#L3-L16)

程序定位和继承环境spawn。

<details>
<summary>查看原文（14行）</summary>

```text
export function which(cmd) {
  const safe = String(cmd || "").replace(/[^a-zA-Z0-9._+-]/g, "");
  if (!safe) return Promise.resolve("");
  return new Promise((resolvePromise) => {
    const child = spawn("bash", ["-lc", `command -v ${safe}`], { stdio: ["ignore", "pipe", "ignore"] });
    let out = "";
    child.stdout.on("data", (d) => (out += d));
    child.on("close", (c) => resolvePromise(c === 0 ? out.trim() : ""));
  });
}

export function run(bin, args, timeoutMs = 10_000) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(bin, args, { stdio: ["ignore", "pipe", "pipe"] });
```

</details>

**依据 2 · 源码核查**：[lib/tmux.js:38-43](https://github.com/173787247/dsh-wsl-tmux/blob/f6f23727c2959d69559ec26f474d2e871473c224/lib/tmux.js#L38-L43)

名称限制。

```text

export function assertSessionName(name) {
  const n = String(name || "").trim();
  if (!n || !/^[A-Za-z0-9._@+-]+$/.test(n) || n.length > 64) throw new Error("invalid tmux session name");
  return n;
}
```

**依据 3 · 源码核查**：[lib/tmux.js:45-66](https://github.com/173787247/dsh-wsl-tmux/blob/f6f23727c2959d69559ec26f474d2e871473c224/lib/tmux.js#L45-L66)

status和默认list。

<details>
<summary>查看原文（22行）</summary>

```text
export async function tmuxStatus() {
  const tmux = (await which("tmux")) || null;
  const screen = (await which("screen")) || null;
  let sessionCount = null;
  let version = null;
  if (tmux) {
    try {
      const ver = await run(tmux, ["-V"], 5_000);
      version = (ver.stdout || ver.stderr || "").trim() || null;
      const list = await tmuxList({ timeoutMs: 5_000 });
      sessionCount = Array.isArray(list.sessions) ? list.sessions.length : 0;
    } catch {
      sessionCount = null;
    }
  }
  return { ok: true, tmux, screen, version, sessionCount };
}

export async function tmuxList({ timeoutMs = 10_000 } = {}) {
  const bin = (await which("tmux")) || "tmux";
  const { code, stdout, stderr } = await run(bin, ["list-sessions", "-F", "#{session_name}\t#{session_windows}\t#{session_attached}"], timeoutMs);
  if (code !== 0) {
```

</details>

**依据 4 · 源码核查**：[lib/tmux.js:79-92](https://github.com/173787247/dsh-wsl-tmux/blob/f6f23727c2959d69559ec26f474d2e871473c224/lib/tmux.js#L79-L92)

target与-S。

<details>
<summary>查看原文（14行）</summary>

```text

export async function tmuxCapture({ session, lines = 80, timeoutMs = 10_000, maxOut = 40_000 } = {}) {
  const name = assertSessionName(session);
  const n = Math.min(500, Math.max(1, Number(lines) || 80));
  const bin = (await which("tmux")) || "tmux";
  const { code, stdout, stderr } = await run(
    bin,
    ["capture-pane", "-p", "-t", name, "-S", `-${n}`],
    timeoutMs,
  );
  if (code !== 0) throw new Error(`tmux capture failed: ${stderr || code}`);
  const text = stdout.slice(0, maxOut);
  return { ok: true, session: name, lines: n, truncated: stdout.length > maxOut, text };
}
```

</details>

**依据 5 · 源码核查**：[package.json:6-10](https://github.com/173787247/dsh-wsl-tmux/blob/f6f23727c2959d69559ec26f474d2e871473c224/package.json#L6-L10)

运行条件。

```text
  "repository": { "type": "git", "url": "https://github.com/173787247/dsh-wsl-tmux.git" },
  "type": "module",
  "main": "index.js",
  "engines": { "node": ">=18" },
  "scripts": { "test": "node --test test/*.test.js" },
```

#### 缺口

- 固定部署tmux版本的target前缀/当前窗口与默认socket解析契约
  **影响**：传session字符串不等绑定用户预期的精确pane
  **进一步探讨**：只读对应tmux手册/部署配置，并用相似名字与多pane记录核精确身份要求

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 空列表、截断和超时能否按字面理解？

**研究主题**：缺陷与关键质疑

#### 完整回答

tmuxList把任意code=1都当ok空列表，除“no server/no sessions”外的错误也可能被掩盖，不能仅看到(no sessions)就断言没有任务。status取list.sessions长度，若该降级发生也会计0。capture保留前40000字符，若原文本超长会丢靠后的最新输出，结构化truncated存在但render只显示text，读者可能看不到缺尾标记。

run在stdout超过500000字符后kill，先缓冲而非严格字节预算，stderr无界；超量结束可能非零，也无专门partial原因。run局部timeout有kill/error处理，但前置which没有error监听或timeout；status串行查tmux/screen、版本5秒和list5秒，外层8秒并不覆盖全部总预算。execute不传宿主取消signal，工具返回超时不证明所有后续定位/查询立刻结束。

三个工具都标并发安全只说明本插件未写任务状态，不保证跨调用同一时刻快照；任务仍运行、当前pane可变，list后capture应再核目标及采集时点。只读输出也可能含正在输入的秘密或未经复核日志，不等内容可安全分享。

#### 证据与依据

**依据 1 · 源码核查**：[lib/tmux.js:3-11](https://github.com/173787247/dsh-wsl-tmux/blob/f6f23727c2959d69559ec26f474d2e871473c224/lib/tmux.js#L3-L11)

which无取消/error/timeout。

```text
export function which(cmd) {
  const safe = String(cmd || "").replace(/[^a-zA-Z0-9._+-]/g, "");
  if (!safe) return Promise.resolve("");
  return new Promise((resolvePromise) => {
    const child = spawn("bash", ["-lc", `command -v ${safe}`], { stdio: ["ignore", "pipe", "ignore"] });
    let out = "";
    child.stdout.on("data", (d) => (out += d));
    child.on("close", (c) => resolvePromise(c === 0 ? out.trim() : ""));
  });
```

**依据 2 · 源码核查**：[lib/tmux.js:14-35](https://github.com/173787247/dsh-wsl-tmux/blob/f6f23727c2959d69559ec26f474d2e871473c224/lib/tmux.js#L14-L35)

缓冲/kill/局部超时。

<details>
<summary>查看原文（22行）</summary>

```text
export function run(bin, args, timeoutMs = 10_000) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(bin, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    const t = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("timeout"));
    }, timeoutMs);
    child.stdout.on("data", (d) => {
      stdout += d;
      if (stdout.length > 500_000) child.kill("SIGKILL");
    });
    child.stderr.on("data", (d) => (stderr += d));
    child.on("close", (code) => {
      clearTimeout(t);
      resolvePromise({ code, stdout, stderr });
    });
    child.on("error", (e) => {
      clearTimeout(t);
      reject(e);
    });
```

</details>

**依据 3 · 源码核查**：[lib/tmux.js:45-75](https://github.com/173787247/dsh-wsl-tmux/blob/f6f23727c2959d69559ec26f474d2e871473c224/lib/tmux.js#L45-L75)

status和code1假空。

<details>
<summary>查看原文（31行）</summary>

```text
export async function tmuxStatus() {
  const tmux = (await which("tmux")) || null;
  const screen = (await which("screen")) || null;
  let sessionCount = null;
  let version = null;
  if (tmux) {
    try {
      const ver = await run(tmux, ["-V"], 5_000);
      version = (ver.stdout || ver.stderr || "").trim() || null;
      const list = await tmuxList({ timeoutMs: 5_000 });
      sessionCount = Array.isArray(list.sessions) ? list.sessions.length : 0;
    } catch {
      sessionCount = null;
    }
  }
  return { ok: true, tmux, screen, version, sessionCount };
}

export async function tmuxList({ timeoutMs = 10_000 } = {}) {
  const bin = (await which("tmux")) || "tmux";
  const { code, stdout, stderr } = await run(bin, ["list-sessions", "-F", "#{session_name}\t#{session_windows}\t#{session_attached}"], timeoutMs);
  if (code !== 0) {
    if (/no server|no sessions/i.test(stderr) || code === 1) return { ok: true, sessions: [] };
    throw new Error(`tmux list failed: ${stderr || code}`);
  }
  const sessions = stdout
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [name, windows, attached] = line.split("\t");
      return { name, windows: Number(windows) || 0, attached: attached === "1" };
```

</details>

**依据 4 · 源码核查**：[lib/tmux.js:79-92](https://github.com/173787247/dsh-wsl-tmux/blob/f6f23727c2959d69559ec26f474d2e871473c224/lib/tmux.js#L79-L92)

头部切片与truncated。

<details>
<summary>查看原文（14行）</summary>

```text

export async function tmuxCapture({ session, lines = 80, timeoutMs = 10_000, maxOut = 40_000 } = {}) {
  const name = assertSessionName(session);
  const n = Math.min(500, Math.max(1, Number(lines) || 80));
  const bin = (await which("tmux")) || "tmux";
  const { code, stdout, stderr } = await run(
    bin,
    ["capture-pane", "-p", "-t", name, "-S", `-${n}`],
    timeoutMs,
  );
  if (code !== 0) throw new Error(`tmux capture failed: ${stderr || code}`);
  const text = stdout.slice(0, maxOut);
  return { ok: true, session: name, lines: n, truncated: stdout.length > maxOut, text };
}
```

</details>

**依据 5 · 源码核查**：[index.js:23-25](https://github.com/173787247/dsh-wsl-tmux/blob/f6f23727c2959d69559ec26f474d2e871473c224/index.js#L23-L25)

status外层8秒。

```text
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }] },
    timeoutMs: 8_000,
```

**依据 6 · 源码核查**：[index.js:72-80](https://github.com/173787247/dsh-wsl-tmux/blob/f6f23727c2959d69559ec26f474d2e871473c224/index.js#L72-L80)

capture render只text。

```text
        session: { type: "string" },
        lines: { type: "number", description: "History lines to capture (default 80)" },
      },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : v.text }],
    },
    timeoutMs,
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 工程与三阶段成本如何评估？

**研究主题**：工程质量与复用、效果与总成本

#### 完整回答

核心与宿主注册分开，固定argv和名称字符白名单减少shell拼接，run监听spawn error并清定时器是正面细节。8行测试只直接检查生产assertSessionName接受build、拒a;b，没有列表错误、真实target、Unicode、截断、which失败或取消预算断言。本次只读测试，不能把有测试等同观察结果正确。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Node/宿主、bash/tmux与既有用户socket，金额未知 | 核进程账户/server与可分享pane，准备工时未知 | 不安装tmux、不创建任务；screen仅检测位置 |
| 持续使用 | bash定位与tmux进程、stdout/stderr缓冲、结果模型上下文 | 选择准确目标、核输出时点/完整性 | 无独立模型请求不等宿主费用为零；捕获最大500历史参数非总输出行数，真实延迟未知 |
| 失败恢复 | 再查询消耗进程/上下文；无任务状态写入 | 分清假空、错pane、截断和模型已读敏感文本 | 停用不撤回已外发文本；恢复金额/工时未知，不用工具timeout推所有子进程已停 |

可见等待上限是局部进程预算而非实测时延，stdout上限也不是整个宿主内存预算。没有任务同条件手工复制对照，不能编造节时比例；若工具把错pane或截断当成功，人工复核和后续模型误判都应计入合格观察成本。

#### 证据与依据

**依据 1 · 源码核查**：[test/tmux.test.js:1-8](https://github.com/173787247/dsh-wsl-tmux/blob/f6f23727c2959d69559ec26f474d2e871473c224/test/tmux.test.js#L1-L8)

只测名称。

```text
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { assertSessionName } from "../lib/tmux.js";

describe("tmux name", () => {
  it("accepts simple", () => assert.equal(assertSessionName("build"), "build"));
  it("rejects bad", () => assert.throws(() => assertSessionName("a;b"), /invalid/));
});
```

**依据 2 · 源码核查**：[lib/tmux.js:14-35](https://github.com/173787247/dsh-wsl-tmux/blob/f6f23727c2959d69559ec26f474d2e871473c224/lib/tmux.js#L14-L35)

局部预算机制。

<details>
<summary>查看原文（22行）</summary>

```text
export function run(bin, args, timeoutMs = 10_000) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(bin, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    const t = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("timeout"));
    }, timeoutMs);
    child.stdout.on("data", (d) => {
      stdout += d;
      if (stdout.length > 500_000) child.kill("SIGKILL");
    });
    child.stderr.on("data", (d) => (stderr += d));
    child.on("close", (code) => {
      clearTimeout(t);
      resolvePromise({ code, stdout, stderr });
    });
    child.on("error", (e) => {
      clearTimeout(t);
      reject(e);
    });
```

</details>

**依据 3 · 源码核查**：[lib/tmux.js:79-92](https://github.com/173787247/dsh-wsl-tmux/blob/f6f23727c2959d69559ec26f474d2e871473c224/lib/tmux.js#L79-L92)

捕获和回传规模。

<details>
<summary>查看原文（14行）</summary>

```text

export async function tmuxCapture({ session, lines = 80, timeoutMs = 10_000, maxOut = 40_000 } = {}) {
  const name = assertSessionName(session);
  const n = Math.min(500, Math.max(1, Number(lines) || 80));
  const bin = (await which("tmux")) || "tmux";
  const { code, stdout, stderr } = await run(
    bin,
    ["capture-pane", "-p", "-t", name, "-S", `-${n}`],
    timeoutMs,
  );
  if (code !== 0) throw new Error(`tmux capture failed: ${stderr || code}`);
  const text = stdout.slice(0, maxOut);
  return { ok: true, session: name, lines: n, truncated: stdout.length > maxOut, text };
}
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么条件适合采用，可证伪的改进方向是什么？

**研究主题**：采用判断、新假设与验证

#### 完整回答

可在可信同用户、单一明确server、pane无敏感内容的范围试用，先list并人工确认目标，再看原终端最新尾部/真实任务结果；不要按no sessions或没有truncated文字就作恢复/终止决策。多server、多窗口和需要强工作区边界的场景先核目标契约，普通工具read-only不能替代授权。

从默认target与部分回执可推“精确观察句柄”方向——列表返回server/socket与pane ID、采集时间/序号，捕获显式绑定，按尾部预算返回并在文本强显partial，错误原因不降级为空，统一deadline和取消。基线为当前session字符串+code1空列表+前段slice。反例包括相似名称、多pane切窗、非ASCII会话、code1权限错误、超40000输出、which卡住及无来源敏感日志；若仍错读pane/漏最新信息或新增选择人工超过复制终端，则否定收益假设。比较错目标率、假空/漏尾、token与人工复核时间，未验证设计不计已有贡献。

#### 证据与依据

**依据 1 · 源码核查**：[lib/tmux.js:64-92](https://github.com/173787247/dsh-wsl-tmux/blob/f6f23727c2959d69559ec26f474d2e871473c224/lib/tmux.js#L64-L92)

错误/target/切片基线。

<details>
<summary>查看原文（29行）</summary>

```text
  const bin = (await which("tmux")) || "tmux";
  const { code, stdout, stderr } = await run(bin, ["list-sessions", "-F", "#{session_name}\t#{session_windows}\t#{session_attached}"], timeoutMs);
  if (code !== 0) {
    if (/no server|no sessions/i.test(stderr) || code === 1) return { ok: true, sessions: [] };
    throw new Error(`tmux list failed: ${stderr || code}`);
  }
  const sessions = stdout
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [name, windows, attached] = line.split("\t");
      return { name, windows: Number(windows) || 0, attached: attached === "1" };
    });
  return { ok: true, sessions };
}

export async function tmuxCapture({ session, lines = 80, timeoutMs = 10_000, maxOut = 40_000 } = {}) {
  const name = assertSessionName(session);
  const n = Math.min(500, Math.max(1, Number(lines) || 80));
  const bin = (await which("tmux")) || "tmux";
  const { code, stdout, stderr } = await run(
    bin,
    ["capture-pane", "-p", "-t", name, "-S", `-${n}`],
    timeoutMs,
  );
  if (code !== 0) throw new Error(`tmux capture failed: ${stderr || code}`);
  const text = stdout.slice(0, maxOut);
  return { ok: true, session: name, lines: n, truncated: stdout.length > maxOut, text };
}
```

</details>

**依据 2 · 源码核查**：[lib/tmux.js:3-11](https://github.com/173787247/dsh-wsl-tmux/blob/f6f23727c2959d69559ec26f474d2e871473c224/lib/tmux.js#L3-L11)

预算基线。

```text
export function which(cmd) {
  const safe = String(cmd || "").replace(/[^a-zA-Z0-9._+-]/g, "");
  if (!safe) return Promise.resolve("");
  return new Promise((resolvePromise) => {
    const child = spawn("bash", ["-lc", `command -v ${safe}`], { stdio: ["ignore", "pipe", "ignore"] });
    let out = "";
    child.stdout.on("data", (d) => (out += d));
    child.on("close", (c) => resolvePromise(c === 0 ? out.trim() : ""));
  });
```

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
