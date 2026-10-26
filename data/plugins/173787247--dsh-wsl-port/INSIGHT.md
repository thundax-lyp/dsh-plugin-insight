# dsh-wsl-port

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[7846224](https://github.com/173787247/dsh-wsl-port/tree/7846224bc8959b5588011846142af8c8a9c308b1)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-port)
<!-- END META -->

> **实现功能**：读取WSL IP和ss监听文本，返回指定端口线索及3080/3081套件连接排查建议。

> **核心亮点**：把常见命令/套件指引集中，减少接线，但不是进程归属或Windows端到端健康检查。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **风险与缺陷**：整表端口子串可混IPv6地址，未解析绑定地址/PID或探Windows；IP失败静默、静态relay指引未核部署。详见[Q02](#research-q02)。

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
  - [Q01 · 面向谁，只读诊断链提供什么？](#detail-section-11)
  - [Q02 · 贡献和解析/端到端范围限制是什么？](#detail-section-12)
  - [Q03 · 依赖、隐私和读者流程是什么？](#detail-section-13)
  - [Q04 · 三阶段成本效果怎么评价？](#detail-section-14)
  - [Q05 · 工程点、分段诊断收据假设和采用结论？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：Windows访问WSL失败时做本地只读初筛，端到端/认证另核。

直接hostname/ss与分段网络排查可替代；工具集中手册也可能引入静态部署假设。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| IP线索 | hostname -I | 失败空数组/无网卡身份 |
| 监听线索 | ss文本匹配 | 无结构地址/PID，不证Windows |
| UI手册 | kit3080/3081建议 | 未检查脚本/版本/认证 |
| 只读诊断 | 报告与错误 | 不自动修复/暴露网络 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=18/匹配DSH tools/systemPrompt | 必需 | port_doctor注册/提示 | schema需真实宿主兼容 |
| WSL环境 | 必需 | 本地Linux诊断 | 非WSL返回明确错误 |
| hostname -I/ss -ltn | 必需 | IP/监听整表 | 缺命令/权限/超时不代表无监听 |
| kit脚本/Windows relay配置 | 作者修复路径可选 | 3080/3081操作手册 | 本包不含/不调用，不证明目标已配置 |
| Windows侧连接/HTTP认证证据 | 端到端判断必需 | 分离转发/防火墙/应用问题 | 本工具没有执行 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 定义 | 明确目标端口/协议/两端位置 | 不混WSL监听与Windows relay |
| 盘点 | 只读port_doctor看IP/ss状态 | 失败保unknown，核结构端点而非一句listening |
| 分段核对 | Windows侧明确探TCP/HTTP/认证 | 正常监听不等浏览器可用 |
| 修复 | 对照实际kit/配置后再决定重启/规则 | 静态建议不自动授权shutdown/暴露服务 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 匹配WSL/系统工具，金额未知 | 明确网络拓扑/端口和kit版本 | 不自动配置转发 |
| 持续使用 | 两次顺序execFile，各5秒上限 | 人工核Windows侧/协议层 | 本地枚举结果非修复完成 |
| 失败恢复 | 缺工具/超时/拓扑重查 | 保留错误/端点并按分层处理 | 不盲restart/shutdown，避免中断别的任务 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 本地监听提示 | ss文本匹配端口 | 精确地址/进程/Windows可达性 |
| 网络指引 | kit/UI静态playbook | 当前部署采用同relay/认证 |
| 诊断辅助 | 只读IP/错误/建议结构 | 真实定位正确率或故障恢复时间 |

> **思考**：整表端口子串可混IPv6地址，未解析绑定地址/PID或探Windows；IP失败静默、静态relay指引未核部署。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把常见命令/套件指引集中，减少接线，但不是进程归属或Windows端到端健康检查。详见[Q01](#research-q01)与[Q02](#research-q02)。

把常见命令/套件指引集中，减少接线，但不是进程归属或Windows端到端健康检查。详见[Q01](#research-q01)与[Q02](#research-q02)。

纯建议/格式与execFile分离、端口整数范围校验、无shell参数拼接、5秒限制和ss错误保留值得复用。只读诊断不应该包装成更强的健康检查。

<a id="detail-section-5"></a>

### 1.4 主要限制

整表端口子串可混IPv6地址，未解析绑定地址/PID或探Windows；IP失败静默、静态relay指引未核部署。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

本地只读线索可试用，先核结构端点/部署，不当Windows连通或进程归属结论。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持WSL IP和ss监听文本的只读初筛及套件手册输出；整表子串未证明精确端点、进程归属或Windows可达。WSL/Windows/relay/认证分段诊断收据仍为未验证假设。

- 已检查：作者 README、包清单、源码路径 index.js、lib/port.js、README.md、package.json、lib/wsl-host.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定index/port全部分支，wsl-host检测核与已读同hash副本；未枚举真实网络/进程或执行目标/kit测试。
- 下一步：进一步探讨先用IPv6/失败/relay/401夹具核结构和层次，再测受控服务的实际定位与恢复人时。

**分析版本**

- **仓库**：[173787247/dsh-wsl-port](https://github.com/173787247/dsh-wsl-port)
- **版本号**：0.2.2（[固定提交 7846224](https://github.com/173787247/dsh-wsl-port/tree/7846224bc8959b5588011846142af8c8a9c308b1)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨精确端点与WSL/Windows/relay/HTTP认证分段收据，unknown保留且绑定kit版本，维护成本未验证。详见[Q05](#research-q05)。

进一步探讨先用IPv6/失败/relay/401夹具核结构和层次，再测受控服务的实际定位与恢复人时。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 185 | — | — | 1112 |
| .js | source | 3 | 246 | 224 | 6 | — |
| .js | test | 1 | 40 | 37 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-port/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-port/issues?q=is%3Aissue+created%3A2026-09-22T07%3A42%3A46.150Z..2026-10-22T07%3A42%3A46.150Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-port/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T07%3A42%3A46.150Z..2026-10-22T07%3A42%3A46.150Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核WSL本地端口线索与Windows可达性区别，检查ss解析、错误、静态kit手册和读者恢复成本。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 面向谁，只读诊断链提供什么？

**研究主题**：场景与需求、功能与机制

#### 完整回答

面向Windows访问WSL服务失败时先排查Linux是否监听、拿IP并看操作指引的人。输入port默认3080，输出WSL标记、IP数组、listen对象和advice/uiPlaybook。合格诊断需分别确认WSL目标、Windows转发/防火墙及HTTP/认证，不是listeningtrue就能使用服务。

加载detectWsl后注册工具/提示。执行先hostname -I再ss -ltn，各5秒timeout；port限制整数1–65535，整个ss输出找冒号端口子串。3080/3081给kit静态手册，其他端口给localhost/首IP尝试建议。没有修复命令执行、主动Windows连接或PID归属。README说诊断哪个进程占端口，比实际无-p的监听检查更强。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:13-24](https://github.com/173787247/dsh-wsl-port/blob/7846224bc8959b5588011846142af8c8a9c308b1/index.js#L13-L24)

环境/注册。

<details>
<summary>查看原文（12行）</summary>

```text
export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 15_000);
  const defaultPort = positive(config.defaultPort, 3080);
  const wsl = detectWsl();

  ctx.systemPrompt.section({
    name: "tool:port_doctor",
    order: 121,
    text: "Use port_doctor when Windows cannot reach a WSL port. For dsh UI check 3080/3081 and prefer restart-dsh-web.sh relay — never dsh --host 0.0.0.0.",
  });

  ctx.tools.register({
```

</details>

**依据 2 · 源码核查**：[index.js:55-73](https://github.com/173787247/dsh-wsl-port/blob/7846224bc8959b5588011846142af8c8a9c308b1/index.js#L55-L73)

顺序执行。

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

**依据 3 · 源码核查**：[lib/port.js:6-37](https://github.com/173787247/dsh-wsl-port/blob/7846224bc8959b5588011846142af8c8a9c308b1/lib/port.js#L6-L37)

IP/ss检查。

<details>
<summary>查看原文（32行）</summary>

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
}

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
  }
```

</details>

**依据 4 · 源码核查**：[lib/port.js:40-88](https://github.com/173787247/dsh-wsl-port/blob/7846224bc8959b5588011846142af8c8a9c308b1/lib/port.js#L40-L88)

静态指引。

<details>
<summary>查看原文（49行）</summary>

```text
export function buildUiPlaybook(port) {
  const p = Number(port);
  if (p !== 3080 && p !== 3081) return [];
  return [
    "1) bash …/dsh-wsl-kit/scripts/check-dsh-health.sh (3080/3081 + NODE_USE_ENV_PROXY).",
    "2) In Windows open the URL printed by restart-dsh-web.sh (http://127.0.0.1:3081/?token=… on dsh ≥0.1.2). Bare :3081 is 401. Not :3000 and not bare :3080 unless mirrored is confirmed.",
    "3) If unhealthy: bash …/dsh-wsl-kit/scripts/restart-dsh-web.sh then new browser tab.",
    "4) Local UI must not use netsh portproxy. Use wsl_expose only for LAN / non-dsh services.",
  ];
}

export function buildPortAdvice({ ips, listen, port }) {
  const tips = [];
  const p = Number(port);
  const uiPlaybook = buildUiPlaybook(p);

  if (p === 3080 || p === 3081) {
    tips.push(
      "dsh web binds 127.0.0.1:3080 only (no --host 0.0.0.0). From Windows prefer http://127.0.0.1:3081/ via kit scripts/restart-dsh-web.sh relay.",
    );
    tips.push(...uiPlaybook);
    if (p === 3080) {
      tips.push("If 3080 works in Windows browser, WSL mirrored networking is likely on; 3081 remains the safer default.");
    }
    if (p === 3081) {
      tips.push("3081 is the Python dual-stack relay — if closed, re-run restart-dsh-web.sh (not portproxy for local UI).");
    }
    tips.push("For LAN exposure of non-dsh services use wsl_expose; do not publish dsh without auth.");
  } else {
    tips.push(
      "WSL2 localhost forwarding: Windows localhost:<port> often reaches Linux listeners on 0.0.0.0 or 127.0.0.1 (especially with networkingMode=mirrored).",
    );
    tips.push("If Windows cannot connect: try WSL eth IP, check firewall, wslconfig_hint, or wsl --shutdown.");
  }

  if (ips.length) tips.push(`Current WSL IPs: ${ips.join(", ")}`);
  if (listen?.ok && listen.listening) {
    tips.push(`Port ${port} appears listening inside WSL (ss).`);
    if (p !== 3080 && p !== 3081) {
      tips.push(`From Windows try http://127.0.0.1:${port}/ and http://${ips[0] || "<wsl-ip>"}:${port}/`);
    } else if (p === 3080) {
      tips.push("From Windows: http://127.0.0.1:3080/ (mirrored) or http://127.0.0.1:3081/ (relay).");
    } else {
      tips.push("From Windows: http://127.0.0.1:3081/");
    }
  } else if (listen?.ok) {
    tips.push(`Port ${port} does not appear to be listening inside WSL yet.`);
  }
  return tips;
```

</details>

**依据 5 · 作者声明**：[README.md:11-13](https://github.com/173787247/dsh-wsl-port/blob/7846224bc8959b5588011846142af8c8a9c308b1/README.md#L11-L13)

作者进程诊断描述。

```text
## Where it sits

Diagnoses which process owns a WSL port. The Windows chat URL is :3081/?token=, not bare :3080.
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 贡献和解析/端到端范围限制是什么？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

价值是把两条常见WSL命令和套件UI手册做成结构结果，降低新手接线/忘记认证URL成本；未自动改防火墙/暴露端口是清楚低副作用边界。核心诊断能力仍是静态文本启发式。

ss匹配在整表做/includes或:port\b正则，不解析local endpoint字段、地址族和列，IPv6地址内部若含同一十六进制数字段可误报该端口，例如包含:3080:的地址即满足冒号数字后词边界；这是静态字符串条件，未运行网络反例。也不返回绑定127.0.0.1/0.0.0.0/IPv6或PID，所以不能判断Windows可达性/真正进程。检查3081仍发生在WSL ss，不证明Windows relay监听。

hostname失败变空数组而不记录原因；ss失败保error是正向，但顶层error仍空字符串容易误解。配置defaultPort仅positive不限定整数/65535，子检查拒绝但报告仍用该值，输出integer可能不合；参数非整数静默用default。tooltimeout不传exec.signal，两子命令固定5秒，与config.timeoutMs不是同一总取消协议。

建议里kit脚本以省略路径表示，未检查是否安装/同版本；3081裸URL和需要token手册同时出现，不能当可直接登录链接。建议重启/WSL shutdown有业务影响，不能由只读诊断自动决定。

#### 证据与依据

**依据 1 · 源码核查**：[lib/port.js:18-30](https://github.com/173787247/dsh-wsl-port/blob/7846224bc8959b5588011846142af8c8a9c308b1/lib/port.js#L18-L30)

整表文本匹配。

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

**依据 2 · 源码核查**：[lib/port.js:6-15](https://github.com/173787247/dsh-wsl-port/blob/7846224bc8959b5588011846142af8c8a9c308b1/lib/port.js#L6-L15)

IP失败静默。

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

**依据 3 · 源码核查**：[index.js:67-73](https://github.com/173787247/dsh-wsl-port/blob/7846224bc8959b5588011846142af8c8a9c308b1/index.js#L67-L73)

顶层error空。

```text
      const port = Number.isInteger(args?.port) ? args.port : defaultPort;
      const ips = await hostnameIps();
      const listen = await checkLocalPort(port);
      const uiPlaybook = buildUiPlaybook(port);
      const report = { wsl: true, port, ips, listen, uiPlaybook, error: "" };
      report.advice = buildPortAdvice(report);
      return report;
```

**依据 4 · 源码核查**：[index.js:84-86](https://github.com/173787247/dsh-wsl-port/blob/7846224bc8959b5588011846142af8c8a9c308b1/index.js#L84-L86)

配置仅正数。

```text
function positive(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
```

**依据 5 · 源码核查**：[lib/port.js:40-47](https://github.com/173787247/dsh-wsl-port/blob/7846224bc8959b5588011846142af8c8a9c308b1/lib/port.js#L40-L47)

路径/token手册。

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

**依据 6 · 源码核查**：[lib/port.js:72-83](https://github.com/173787247/dsh-wsl-port/blob/7846224bc8959b5588011846142af8c8a9c308b1/lib/port.js#L72-L83)

shutdown和裸URL。

<details>
<summary>查看原文（12行）</summary>

```text
    tips.push("If Windows cannot connect: try WSL eth IP, check firewall, wslconfig_hint, or wsl --shutdown.");
  }

  if (ips.length) tips.push(`Current WSL IPs: ${ips.join(", ")}`);
  if (listen?.ok && listen.listening) {
    tips.push(`Port ${port} appears listening inside WSL (ss).`);
    if (p !== 3080 && p !== 3081) {
      tips.push(`From Windows try http://127.0.0.1:${port}/ and http://${ips[0] || "<wsl-ip>"}:${port}/`);
    } else if (p === 3080) {
      tips.push("From Windows: http://127.0.0.1:3080/ (mirrored) or http://127.0.0.1:3081/ (relay).");
    } else {
      tips.push("From Windows: http://127.0.0.1:3081/");
```

</details>

**依据 7 · 源码核查**：[index.js:53-69](https://github.com/173787247/dsh-wsl-port/blob/7846224bc8959b5588011846142af8c8a9c308b1/index.js#L53-L69)

无exec.signal传播。

<details>
<summary>查看原文（17行）</summary>

```text
    timeoutMs,
    isConcurrencySafe: () => true,
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
```

</details>

#### 缺口

- Windows relay/转发/防火墙、地址族与HTTP/认证真实状态未检查。
  **影响**：监听提示不能作为服务可用或修复完成。
  **进一步探讨**：可先按精确端点核WSL，再在用户授权的Windows侧分TCP/HTTP/认证收据核对，不改变网络设置。
- kit脚本/默认端口指引是否对应当前部署未由工具核实。
  **影响**：静态playbook可能引导不适用的重启/URL。
  **进一步探讨**：可固定kit/宿主版本与当前启动配置后匹配指引，找不到不补造路径/认证token。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 依赖、隐私和读者流程是什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

包0.2.2/Node>=18，WSL检测为env或osrelease启发式，真实工具还依hostname/ss。公共wsl-host文件与上一项clipboard固定副本SHA256相同，已核其detectWsl逻辑；不因套件声明兼容就保证当前Windows网络拓扑。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=18/匹配DSH tools/systemPrompt | 必需 | port_doctor注册/提示 | schema需真实宿主兼容 |
| WSL环境 | 必需 | 本地Linux诊断 | 非WSL返回明确错误 |
| hostname -I/ss -ltn | 必需 | IP/监听整表 | 缺命令/权限/超时不代表无监听 |
| kit脚本/Windows relay配置 | 作者修复路径可选 | 3080/3081操作手册 | 本包不含/不调用，不证明目标已配置 |
| Windows侧连接/HTTP认证证据 | 端到端判断必需 | 分离转发/防火墙/应用问题 | 本工具没有执行 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 定义 | 明确目标端口/协议/两端位置 | 不混WSL监听与Windows relay |
| 盘点 | 只读port_doctor看IP/ss状态 | 失败保unknown，核结构端点而非一句listening |
| 分段核对 | Windows侧明确探TCP/HTTP/认证 | 正常监听不等浏览器可用 |
| 修复 | 对照实际kit/配置后再决定重启/规则 | 静态建议不自动授权shutdown/暴露服务 |

输出本机IP会进入模型上下文，虽未上传第三方API也应限需要的诊断。静态指引不执行shutdown、kit或netsh；这些后续变更需用户明确目标和影响。本轮不运行枚举、连接或修复。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-4](https://github.com/173787247/dsh-wsl-port/blob/7846224bc8959b5588011846142af8c8a9c308b1/package.json#L1-L4)

版本。

```text
{
  "name": "dsh-wsl-port",
  "version": "0.2.2",
  "description": "WSL port doctor; dsh ≥0.1.2 uiPlaybook uses :3081/?token= (bare :3081 is 401).",
```

**依据 2 · 源码核查**：[lib/wsl-host.js:21-27](https://github.com/173787247/dsh-wsl-port/blob/7846224bc8959b5588011846142af8c8a9c308b1/lib/wsl-host.js#L21-L27)

环境判定。

```text
export function detectWsl({ env = process.env, readRelease = readOsRelease } = {}) {
  if (env.WSL_DISTRO_NAME || env.WSL_INTEROP) return true;
  try {
    return /microsoft/i.test(readRelease());
  } catch {
    return false;
  }
```

**依据 3 · 源码核查**：[lib/port.js:6-24](https://github.com/173787247/dsh-wsl-port/blob/7846224bc8959b5588011846142af8c8a9c308b1/lib/port.js#L6-L24)

系统命令依赖。

<details>
<summary>查看原文（19行）</summary>

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
}

export async function checkLocalPort(port, { execFileFn = execFileAsync } = {}) {
  const p = Number(port);
  if (!Number.isInteger(p) || p < 1 || p > 65535) {
    return { ok: false, error: "invalid port" };
  }
  try {
    const { stdout } = await execFileFn("ss", ["-ltn"], { encoding: "utf8", timeout: 5_000 });
```

</details>

**依据 4 · 源码核查**：[lib/port.js:40-47](https://github.com/173787247/dsh-wsl-port/blob/7846224bc8959b5588011846142af8c8a9c308b1/lib/port.js#L40-L47)

kit另配。

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

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 三阶段成本效果怎么评价？

**研究主题**：效果与总成本

#### 完整回答

相对直接hostname -I与ss，工具集中结构/建议但每次有两进程和模型回合；没有LLM网络生成阶段，不等无token或运维人时。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 匹配WSL/系统工具，金额未知 | 明确网络拓扑/端口和kit版本 | 不自动配置转发 |
| 持续使用 | 两次顺序execFile，各5秒上限 | 人工核Windows侧/协议层 | 本地枚举结果非修复完成 |
| 失败恢复 | 缺工具/超时/拓扑重查 | 保留错误/端点并按分层处理 | 不盲restart/shutdown，避免中断别的任务 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 本地监听提示 | ss文本匹配端口 | 精确地址/进程/Windows可达性 |
| 网络指引 | kit/UI静态playbook | 当前部署采用同relay/认证 |
| 诊断辅助 | 只读IP/错误/建议结构 | 真实定位正确率或故障恢复时间 |

render先独立输出uiPlaybook，再advice里再次包含同playbook，冗余增加阅读成本。真实收益应是定位层次正确、避免错误暴露/不必要重启、减少总恢复时间，而非只返回listening布尔。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:67-72](https://github.com/173787247/dsh-wsl-port/blob/7846224bc8959b5588011846142af8c8a9c308b1/index.js#L67-L72)

两命令。

```text
      const port = Number.isInteger(args?.port) ? args.port : defaultPort;
      const ips = await hostnameIps();
      const listen = await checkLocalPort(port);
      const uiPlaybook = buildUiPlaybook(port);
      const report = { wsl: true, port, ips, listen, uiPlaybook, error: "" };
      report.advice = buildPortAdvice(report);
```

**依据 2 · 源码核查**：[lib/port.js:54-60](https://github.com/173787247/dsh-wsl-port/blob/7846224bc8959b5588011846142af8c8a9c308b1/lib/port.js#L54-L60)

advice含playbook。

```text
  const uiPlaybook = buildUiPlaybook(p);

  if (p === 3080 || p === 3081) {
    tips.push(
      "dsh web binds 127.0.0.1:3080 only (no --host 0.0.0.0). From Windows prefer http://127.0.0.1:3081/ via kit scripts/restart-dsh-web.sh relay.",
    );
    tips.push(...uiPlaybook);
```

**依据 3 · 源码核查**：[lib/port.js:91-101](https://github.com/173787247/dsh-wsl-port/blob/7846224bc8959b5588011846142af8c8a9c308b1/lib/port.js#L91-L101)

再次渲染playbook。

<details>
<summary>查看原文（11行）</summary>

```text
export function formatPortReport(report) {
  const lines = ["port_doctor", `port: ${report.port}`];
  if (report.ips?.length) lines.push(`wsl_ips: ${report.ips.join(", ")}`);
  if (report.listen?.ok) lines.push(`listening: ${report.listen.listening}`);
  else if (report.listen?.error) lines.push(`ss: ${report.listen.error}`);
  if (report.uiPlaybook?.length) {
    lines.push("uiPlaybook:");
    for (const step of report.uiPlaybook) lines.push(`  ${step}`);
  }
  for (const tip of report.advice || []) lines.push(`- ${tip}`);
  return lines.join("\n");
```

</details>

#### 缺口

- 无多拓扑/IPv6/relay场景诊断准确率和相较手工命令恢复时间对照。
  **影响**：不能承诺能定位所有Windows连接问题。
  **进一步探讨**：可用固定ss输出/拓扑材料先测字段正确，再以受控服务分段对照和计人工恢复成本。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 工程点、分段诊断收据假设和采用结论？

**研究主题**：工程质量与复用、新假设与验证、采用判断

#### 完整回答

纯建议/格式与execFile分离、端口整数范围校验、无shell参数拼接、5秒限制和ss错误保留值得复用。只读诊断不应该包装成更强的健康检查。

可探讨未验证的“分段诊断收据”。解析ss结构local地址/端口/协议并保留失败和来源；Windows TCP探测、relay身份、HTTP状态/认证各列observed/unknown，不用本地listen替代远端可用性。IP按网卡/地址族标识、IPv6 URL括号、按实装kit版本给路径；若需要PID再明确使用授权枚举。所有取消/超时保unknown，参数非法直接拒绝。代价是跨平台探测/隐私和kit版本维护。可用IPv6地址含端口字样、只IPv6监听、Windows独立relay、hostname失败/无ss和认证401夹具研究，不能为得绿灯改安全配置。

推荐trial，限WSL本地只读线索/手册辅助；先用匹配部署和精确端点核，不把它当Windows连通/进程归属工具。继续从ss结构/错误/端到端收据和文案一致性入手。遇地址不符、relay侧不明、脚本缺失或建议要广泛暴露/中断其他任务，停止自动修复并核配置，本轮不操作系统状态。

#### 证据与依据

**依据 1 · 源码核查**：[lib/port.js:18-37](https://github.com/173787247/dsh-wsl-port/blob/7846224bc8959b5588011846142af8c8a9c308b1/lib/port.js#L18-L37)

解析/错误起点。

<details>
<summary>查看原文（20行）</summary>

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
  }
```

</details>

**依据 2 · 源码核查**：[lib/port.js:40-88](https://github.com/173787247/dsh-wsl-port/blob/7846224bc8959b5588011846142af8c8a9c308b1/lib/port.js#L40-L88)

手册适配起点。

<details>
<summary>查看原文（49行）</summary>

```text
export function buildUiPlaybook(port) {
  const p = Number(port);
  if (p !== 3080 && p !== 3081) return [];
  return [
    "1) bash …/dsh-wsl-kit/scripts/check-dsh-health.sh (3080/3081 + NODE_USE_ENV_PROXY).",
    "2) In Windows open the URL printed by restart-dsh-web.sh (http://127.0.0.1:3081/?token=… on dsh ≥0.1.2). Bare :3081 is 401. Not :3000 and not bare :3080 unless mirrored is confirmed.",
    "3) If unhealthy: bash …/dsh-wsl-kit/scripts/restart-dsh-web.sh then new browser tab.",
    "4) Local UI must not use netsh portproxy. Use wsl_expose only for LAN / non-dsh services.",
  ];
}

export function buildPortAdvice({ ips, listen, port }) {
  const tips = [];
  const p = Number(port);
  const uiPlaybook = buildUiPlaybook(p);

  if (p === 3080 || p === 3081) {
    tips.push(
      "dsh web binds 127.0.0.1:3080 only (no --host 0.0.0.0). From Windows prefer http://127.0.0.1:3081/ via kit scripts/restart-dsh-web.sh relay.",
    );
    tips.push(...uiPlaybook);
    if (p === 3080) {
      tips.push("If 3080 works in Windows browser, WSL mirrored networking is likely on; 3081 remains the safer default.");
    }
    if (p === 3081) {
      tips.push("3081 is the Python dual-stack relay — if closed, re-run restart-dsh-web.sh (not portproxy for local UI).");
    }
    tips.push("For LAN exposure of non-dsh services use wsl_expose; do not publish dsh without auth.");
  } else {
    tips.push(
      "WSL2 localhost forwarding: Windows localhost:<port> often reaches Linux listeners on 0.0.0.0 or 127.0.0.1 (especially with networkingMode=mirrored).",
    );
    tips.push("If Windows cannot connect: try WSL eth IP, check firewall, wslconfig_hint, or wsl --shutdown.");
  }

  if (ips.length) tips.push(`Current WSL IPs: ${ips.join(", ")}`);
  if (listen?.ok && listen.listening) {
    tips.push(`Port ${port} appears listening inside WSL (ss).`);
    if (p !== 3080 && p !== 3081) {
      tips.push(`From Windows try http://127.0.0.1:${port}/ and http://${ips[0] || "<wsl-ip>"}:${port}/`);
    } else if (p === 3080) {
      tips.push("From Windows: http://127.0.0.1:3080/ (mirrored) or http://127.0.0.1:3081/ (relay).");
    } else {
      tips.push("From Windows: http://127.0.0.1:3081/");
    }
  } else if (listen?.ok) {
    tips.push(`Port ${port} does not appear to be listening inside WSL yet.`);
  }
  return tips;
```

</details>

**依据 3 · 源码核查**：[index.js:55-73](https://github.com/173787247/dsh-wsl-port/blob/7846224bc8959b5588011846142af8c8a9c308b1/index.js#L55-L73)

只读工具边界。

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

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
