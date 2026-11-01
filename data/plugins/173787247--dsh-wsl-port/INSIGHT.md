# dsh-wsl-port

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[6456c9e](https://github.com/173787247/dsh-wsl-port/tree/6456c9e33dda8ef9203754d7b8ae9d039c03337c)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-port)
<!-- END META -->

> **功能**：为 WSL 服务提供本地端口监听线索和 Windows 访问建议。

> **亮点**：将本地监听线索和 DSH relay 操作建议集中到工具。[Q01](#research-q01)

> **主要限制**：WSL 本地 ss 匹配不证明 Windows relay、HTTP 或 token 登录成功。[Q03](#research-q03)

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
  - [Q01 · 端口诊断面向什么问题，与手动查看有什么区别？](#detail-section-11)
  - [Q02 · 监听判断如何产生，出错如何表示？](#detail-section-12)
  - [Q03 · 3081 显示监听即可证明 Windows 浏览器登录成功吗？](#detail-section-13)
  - [Q04 · 该如何低风险诊断和恢复？](#detail-section-14)
  - [Q05 · 现有本地监听判断之外如何缩小跨系统不确定性？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：Windows 无法访问 WSL 服务时需要初步诊断的用户；基线为手工查询本地网络。[Q01](#research-q01)

人工执行 hostname、ss 并分别检查 Windows 侧网络。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| IP | 读取 WSL 地址 | 失败返回空 |
| 监听 | 检索本地端口线索 | 不保证目标进程 |
| 建议 | 提供 relay 排查步骤 | 不实际执行 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| DSH 与 WSL | 必需 | 工具和本地环境 | 手工诊断 |
| hostname 与 ss | 对应检查需要 | IP 与监听线索 | 结果空或错误 |
| Windows 侧验证 | 确认端到端需要 | relay 和认证 | 保持未知 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户确认要查的服务和端口 | 目标不明停止 |
| 初筛 | 查看 WSL IP 与 ss 结果 | 命令失败标未知 |
| 验证 | 用户在 Windows 核对 relay 与登录 | 不通再分层排查 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | WSL 及命令 | 确认端口 | 环境未测 |
| 持续 | 本地查询资源 | 解读结果 | 准确率未知 |
| 恢复 | 其他工具或操作 | 人工确认 | 建议不代表已修复 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 本地 | IP 与 ss 查询 | 目标进程和协议 |
| 跨系统 | 提供 relay 检查建议 | Windows 访问及认证 |

> **思考**：WSL 本地 ss 匹配不证明 Windows relay、HTTP 或 token 登录成功。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将本地监听线索和 DSH relay 操作建议集中到工具。[Q01](#research-q01)

ss 使用整段文本端口匹配；hostname 失败返回空数组，ss 失败返回错误。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

WSL 本地 ss 匹配不证明 Windows relay、HTTP 或 token 登录成功。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

把结果作为 WSL 本地线索，命令失败或 Windows 不通时分层验证。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持本地命令与错误分支；未运行跨系统诊断。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/port.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 inventory 9 文件、无排除和解析错误；静态核查命令及建议，未运行目标。
- 下一步：隔离 WSL 与 Windows 对照本地监听、relay 和认证结果。

**分析版本**

- **仓库**：[173787247/dsh-wsl-port](https://github.com/173787247/dsh-wsl-port)
- **版本号**：0.2.2（[固定提交 6456c9e](https://github.com/173787247/dsh-wsl-port/tree/6456c9e33dda8ef9203754d7b8ae9d039c03337c)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：经用户同意分层检查 WSL 与 Windows relay，可补充现有本地 ss 和健康脚本建议。[Q05](#research-q05)

隔离 WSL 与 Windows 对照本地监听、relay 和认证结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 185 | — | — | 1112 |
| .js | source | 3 | 246 | 224 | 6 | — |
| .js | test | 1 | 40 | 37 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-port/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-port/issues?q=is%3Aissue+created%3A2026-10-02T12%3A37%3A53.293Z..2026-11-01T12%3A37%3A53.293Z)

暂未获取：近30天关闭。

统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：WSL 端口诊断观测了什么，是否足以证明 Windows 端到端可用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 端口诊断面向什么问题，与手动查看有什么区别？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

Windows 用户无法访问 WSL 服务时可由 DSH 工具汇总 WSL IP、端口监听线索和操作建议；基线是手工运行 hostname 和 ss 并理解网络拓扑。它减少查询组织成本，但不执行 Windows 端到端访问或验证认证；简单场景直接检查也足够。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:18-26](https://github.com/173787247/dsh-wsl-port/blob/6456c9e33dda8ef9203754d7b8ae9d039c03337c/index.js#L18-L26)

工具用途和提示。

```text
  ctx.systemPrompt.section({
    name: "tool:port_doctor",
    order: 121,
    text: "Use port_doctor when Windows cannot reach a WSL port. For dsh UI check 3080/3081 and prefer restart-dsh-web.sh relay — never dsh --host 0.0.0.0.",
  });

  ctx.tools.register({
    name: "port_doctor",
    description: "Report WSL IPs and whether a TCP port is listening; advise on Windows localhost forwarding.",
```

**依据 2 · 作者声明**：[README.md:37-52](https://github.com/173787247/dsh-wsl-port/blob/6456c9e33dda8ef9203754d7b8ae9d039c03337c/README.md#L37-L52)

作者区分 WSL 服务和 Windows relay。

<details>
<summary>查看原文（16行）</summary>

```text
**Scope:** `port_doctor` for listen state + Windows localhost tips. For dsh UI use **3080** (WSL) and relay **3081** (Windows) with launch `?token=` (dsh ≥0.1.2). Do not bind `dsh web --host 0.0.0.0`.

## Why

A server bound in WSL may be reachable as `http://127.0.0.1:<port>` from Windows—or may need the WSL eth IP / a firewall fix / `wsl --shutdown`. This tool checks `hostname -I` and `ss` listen state.

Default port: **3080** (common `dsh web` port). Override with the `port` argument.

### dsh UI ports (3080 vs 3081)

| Port | Where | Role |
|------|-------|------|
| **3080** | WSL `127.0.0.1` | `dsh web` itself — do not open from Windows unless mirrored |
| **3081** | Windows relay | Browser entry; needs `?token=` on dsh ≥0.1.2 |

Ask for `port_doctor` on **both** when the UI is blank / `ERR_CONNECTION_*`. Prefer kit `restart-dsh-web.sh` + [`check-dsh-health.sh`](https://github.com/173787247/dsh-wsl-kit/blob/master/scripts/check-dsh-health.sh) before inventing `netsh` rules. For LAN exposure see [dsh-wsl-expose](https://github.com/173787247/dsh-wsl-expose) — not for local chat UI.
```

</details>

#### 缺口

- 未运行 WSL、ss、Windows relay 或浏览器
  **影响**：不能确认本机监听、跨系统连通或认证
  **进一步探讨**：隔离环境比对 WSL ss、Windows 连接和带认证的 UI

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 监听判断如何产生，出错如何表示？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

工具先判断 WSL，调用 hostname -I 和 ss -ltn；后者验证端口范围后在完整文本中查找端口片段。hostname 出错返回空数组，ss 出错返回 ok=false 和 error，不能把探测失败当未监听；文本匹配没有结构化绑定地址或进程身份，也不能证明目标协议可用。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:55-73](https://github.com/173787247/dsh-wsl-port/blob/6456c9e33dda8ef9203754d7b8ae9d039c03337c/index.js#L55-L73)

非 WSL 和执行流程。

<details>
<summary>查看原文（19行）</summary>

```text
    async execute(args) {
      if (!wsl) {
        return {
          wsl: false,
          port: defaultPort,
          error: "not running in WSL",
          advice: [],
          uiPlaybook: [],
          ips: [],
          listen: { ok: false, error: "not_wsl", listening: false, port: defaultPort },
        };
      }
      const port = Number.isInteger(args?.port) ? args.port : defaultPort;
      const ips = await hostnameIps();
      const listen = await checkLocalPort(port);
      const uiPlaybook = buildUiPlaybook(port);
      const report = { wsl: true, port, ips, listen, uiPlaybook, error: "" };
      report.advice = buildPortAdvice(report);
      return report;
```

</details>

**依据 2 · 源码核查**：[lib/port.js:6-15](https://github.com/173787247/dsh-wsl-port/blob/6456c9e33dda8ef9203754d7b8ae9d039c03337c/lib/port.js#L6-L15)

IP 查询失败回空数组。

<details>
<summary>查看原文（10行）</summary>

```text
export async function hostnameIps({ execFileFn = execFileAsync } = {}) {
  try {
    const { stdout } = await execFileFn("hostname", ["-I"], { encoding: "utf8", timeout: 5_000 });
    return String(stdout || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);
  } catch {
    return [];
  }
```

</details>

**依据 3 · 源码核查**：[lib/port.js:18-36](https://github.com/173787247/dsh-wsl-port/blob/6456c9e33dda8ef9203754d7b8ae9d039c03337c/lib/port.js#L18-L36)

范围、ss 字符串匹配与失败。

<details>
<summary>查看原文（19行）</summary>

```text
export async function checkLocalPort(port, { execFileFn = execFileAsync } = {}) {
  const p = Number(port);
  if (!Number.isInteger(p) || p < 1 || p > 65535) {
    return { ok: false, error: "invalid port" };
  }
  try {
    const { stdout } = await execFileFn("ss", ["-ltn"], { encoding: "utf8", timeout: 5_000 });
    const text = String(stdout || "");
    const listening =
      text.includes(`:${p} `) ||
      text.includes(`:${p}\n`) ||
      new RegExp(`:${p}\\b`).test(text);
    return { ok: true, listening, port: p };
  } catch (err) {
    return {
      ok: false,
      port: p,
      error: err instanceof Error ? err.message : String(err),
    };
```

</details>

#### 缺口

- 未运行 WSL、ss、Windows relay 或浏览器
  **影响**：不能确认本机监听、跨系统连通或认证
  **进一步探讨**：隔离环境比对 WSL ss、Windows 连接和带认证的 UI

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 3081 显示监听即可证明 Windows 浏览器登录成功吗？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

不能。代码只在 WSL 内运行 ss 并做文本匹配，3081 的 Windows relay 位于另一侧；即使 WSL 中某端口匹配，也不能证明目标进程、Windows 转发、HTTP、token 或浏览器成功。内建 playbook 是建议，不是已经完成的检查；需要在目标 Windows 浏览器及授权会话独立验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/port.js:18-30](https://github.com/173787247/dsh-wsl-port/blob/6456c9e33dda8ef9203754d7b8ae9d039c03337c/lib/port.js#L18-L30)

只读取本地 ss 输出。

<details>
<summary>查看原文（13行）</summary>

```text
export async function checkLocalPort(port, { execFileFn = execFileAsync } = {}) {
  const p = Number(port);
  if (!Number.isInteger(p) || p < 1 || p > 65535) {
    return { ok: false, error: "invalid port" };
  }
  try {
    const { stdout } = await execFileFn("ss", ["-ltn"], { encoding: "utf8", timeout: 5_000 });
    const text = String(stdout || "");
    const listening =
      text.includes(`:${p} `) ||
      text.includes(`:${p}\n`) ||
      new RegExp(`:${p}\\b`).test(text);
    return { ok: true, listening, port: p };
```

</details>

**依据 2 · 源码核查**：[lib/port.js:40-47](https://github.com/173787247/dsh-wsl-port/blob/6456c9e33dda8ef9203754d7b8ae9d039c03337c/lib/port.js#L40-L47)

针对 3080/3081 给出外部脚本建议。

```text
export function buildUiPlaybook(port) {
  const p = Number(port);
  if (p !== 3080 && p !== 3081) return [];
  return [
    "1) bash …/dsh-wsl-kit/scripts/check-dsh-health.sh (3080/3081 + NODE_USE_ENV_PROXY).",
    "2) In Windows open the URL printed by restart-dsh-web.sh (http://127.0.0.1:3081/?token=… on dsh ≥0.1.2). Bare :3081 is 401. Not :3000 and not bare :3080 unless mirrored is confirmed.",
    "3) If unhealthy: bash …/dsh-wsl-kit/scripts/restart-dsh-web.sh then new browser tab.",
    "4) Local UI must not use netsh portproxy. Use wsl_expose only for LAN / non-dsh services.",
```

**依据 3 · 作者声明**：[README.md:45-52](https://github.com/173787247/dsh-wsl-port/blob/6456c9e33dda8ef9203754d7b8ae9d039c03337c/README.md#L45-L52)

作者区分 Windows relay 和 WSL 服务。

```text
### dsh UI ports (3080 vs 3081)

| Port | Where | Role |
|------|-------|------|
| **3080** | WSL `127.0.0.1` | `dsh web` itself — do not open from Windows unless mirrored |
| **3081** | Windows relay | Browser entry; needs `?token=` on dsh ≥0.1.2 |

Ask for `port_doctor` on **both** when the UI is blank / `ERR_CONNECTION_*`. Prefer kit `restart-dsh-web.sh` + [`check-dsh-health.sh`](https://github.com/173787247/dsh-wsl-kit/blob/master/scripts/check-dsh-health.sh) before inventing `netsh` rules. For LAN exposure see [dsh-wsl-expose](https://github.com/173787247/dsh-wsl-expose) — not for local chat UI.
```

#### 缺口

- 未运行 WSL、ss、Windows relay 或浏览器
  **影响**：不能确认本机监听、跨系统连通或认证
  **进一步探讨**：隔离环境比对 WSL ss、Windows 连接和带认证的 UI

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 该如何低风险诊断和恢复？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

依赖 WSL 环境、hostname 和 ss；工具只给建议，不修改防火墙或运行 kit 恢复脚本。先核实查询是否成功并定位 WSL 端口，再由用户在 Windows 检查 relay 和认证；执行任何重启或网络规则前确认影响与授权。日志、端口号和 IP 也可能是内部信息，分享前应核查。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:55-73](https://github.com/173787247/dsh-wsl-port/blob/6456c9e33dda8ef9203754d7b8ae9d039c03337c/index.js#L55-L73)

获取 IP、监听和建议。

<details>
<summary>查看原文（19行）</summary>

```text
    async execute(args) {
      if (!wsl) {
        return {
          wsl: false,
          port: defaultPort,
          error: "not running in WSL",
          advice: [],
          uiPlaybook: [],
          ips: [],
          listen: { ok: false, error: "not_wsl", listening: false, port: defaultPort },
        };
      }
      const port = Number.isInteger(args?.port) ? args.port : defaultPort;
      const ips = await hostnameIps();
      const listen = await checkLocalPort(port);
      const uiPlaybook = buildUiPlaybook(port);
      const report = { wsl: true, port, ips, listen, uiPlaybook, error: "" };
      report.advice = buildPortAdvice(report);
      return report;
```

</details>

**依据 2 · 源码核查**：[lib/port.js:6-15](https://github.com/173787247/dsh-wsl-port/blob/6456c9e33dda8ef9203754d7b8ae9d039c03337c/lib/port.js#L6-L15)

hostname 不可用的回退。

<details>
<summary>查看原文（10行）</summary>

```text
export async function hostnameIps({ execFileFn = execFileAsync } = {}) {
  try {
    const { stdout } = await execFileFn("hostname", ["-I"], { encoding: "utf8", timeout: 5_000 });
    return String(stdout || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);
  } catch {
    return [];
  }
```

</details>

**依据 3 · 源码核查**：[lib/port.js:18-36](https://github.com/173787247/dsh-wsl-port/blob/6456c9e33dda8ef9203754d7b8ae9d039c03337c/lib/port.js#L18-L36)

ss 失败显式返回。

<details>
<summary>查看原文（19行）</summary>

```text
export async function checkLocalPort(port, { execFileFn = execFileAsync } = {}) {
  const p = Number(port);
  if (!Number.isInteger(p) || p < 1 || p > 65535) {
    return { ok: false, error: "invalid port" };
  }
  try {
    const { stdout } = await execFileFn("ss", ["-ltn"], { encoding: "utf8", timeout: 5_000 });
    const text = String(stdout || "");
    const listening =
      text.includes(`:${p} `) ||
      text.includes(`:${p}\n`) ||
      new RegExp(`:${p}\\b`).test(text);
    return { ok: true, listening, port: p };
  } catch (err) {
    return {
      ok: false,
      port: p,
      error: err instanceof Error ? err.message : String(err),
    };
```

</details>

**依据 4 · 源码核查**：[lib/port.js:40-47](https://github.com/173787247/dsh-wsl-port/blob/6456c9e33dda8ef9203754d7b8ae9d039c03337c/lib/port.js#L40-L47)

仅生成 playbook 文本。

```text
export function buildUiPlaybook(port) {
  const p = Number(port);
  if (p !== 3080 && p !== 3081) return [];
  return [
    "1) bash …/dsh-wsl-kit/scripts/check-dsh-health.sh (3080/3081 + NODE_USE_ENV_PROXY).",
    "2) In Windows open the URL printed by restart-dsh-web.sh (http://127.0.0.1:3081/?token=… on dsh ≥0.1.2). Bare :3081 is 401. Not :3000 and not bare :3080 unless mirrored is confirmed.",
    "3) If unhealthy: bash …/dsh-wsl-kit/scripts/restart-dsh-web.sh then new browser tab.",
    "4) Local UI must not use netsh portproxy. Use wsl_expose only for LAN / non-dsh services.",
```

#### 缺口

- 未运行 WSL、ss、Windows relay 或浏览器
  **影响**：不能确认本机监听、跨系统连通或认证
  **进一步探讨**：隔离环境比对 WSL ss、Windows 连接和带认证的 UI

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 现有本地监听判断之外如何缩小跨系统不确定性？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

未验证假设：经用户明确选择后分别执行结构化 WSL 本地检查、Windows relay 连接与不含 token 的 HTTP 状态检查，并分别展示未知项，可能缩短定位。已有本地 ss 和健康脚本建议，不能把它们当新功能；未穷尽 kit 或宿主已有等价探针，探测本身也不能证明登录成功。对照当前诊断测试监听、错误进程、relay 缺失和认证失败，测定位正确率与额外耗时，无改善或泄露凭据则否定。

#### 证据与依据

**依据 1 · 源码核查**：[lib/port.js:18-30](https://github.com/173787247/dsh-wsl-port/blob/6456c9e33dda8ef9203754d7b8ae9d039c03337c/lib/port.js#L18-L30)

已有本地监听文本匹配。

<details>
<summary>查看原文（13行）</summary>

```text
export async function checkLocalPort(port, { execFileFn = execFileAsync } = {}) {
  const p = Number(port);
  if (!Number.isInteger(p) || p < 1 || p > 65535) {
    return { ok: false, error: "invalid port" };
  }
  try {
    const { stdout } = await execFileFn("ss", ["-ltn"], { encoding: "utf8", timeout: 5_000 });
    const text = String(stdout || "");
    const listening =
      text.includes(`:${p} `) ||
      text.includes(`:${p}\n`) ||
      new RegExp(`:${p}\\b`).test(text);
    return { ok: true, listening, port: p };
```

</details>

**依据 2 · 源码核查**：[lib/port.js:40-47](https://github.com/173787247/dsh-wsl-port/blob/6456c9e33dda8ef9203754d7b8ae9d039c03337c/lib/port.js#L40-L47)

已有健康脚本与 relay 建议。

```text
export function buildUiPlaybook(port) {
  const p = Number(port);
  if (p !== 3080 && p !== 3081) return [];
  return [
    "1) bash …/dsh-wsl-kit/scripts/check-dsh-health.sh (3080/3081 + NODE_USE_ENV_PROXY).",
    "2) In Windows open the URL printed by restart-dsh-web.sh (http://127.0.0.1:3081/?token=… on dsh ≥0.1.2). Bare :3081 is 401. Not :3000 and not bare :3080 unless mirrored is confirmed.",
    "3) If unhealthy: bash …/dsh-wsl-kit/scripts/restart-dsh-web.sh then new browser tab.",
    "4) Local UI must not use netsh portproxy. Use wsl_expose only for LAN / non-dsh services.",
```

#### 缺口

- 未运行 WSL、ss、Windows relay 或浏览器
  **影响**：不能确认本机监听、跨系统连通或认证
  **进一步探讨**：隔离环境比对 WSL ss、Windows 连接和带认证的 UI

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
