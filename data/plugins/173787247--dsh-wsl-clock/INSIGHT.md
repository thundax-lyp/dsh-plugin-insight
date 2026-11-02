# dsh-wsl-clock

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[02f3d6b](https://github.com/173787247/dsh-wsl-clock/tree/02f3d6b7886f92cabdafde06aa94d2517fe91e27)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-clock)
<!-- END META -->

> **功能**：提供 clock_doctor 工具，诊断 WSL 与 Windows UTC 时间偏移。

> **亮点**：[Q01](#research-q01) 把双时钟只读比较接入模型工具和提示，复用系统读数，不是自动校时。

> **主要限制**：[Q02](#research-q02) 顺序采样混入命令延迟，空输出Number为0未拒绝；一次fail不等时钟根因。

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
  - [Q01 · WSL时钟工具解决哪一段排障？](#detail-section-11)
  - [Q02 · 时差读数可信到什么程度，失败怎样呈现？](#detail-section-12)
  - [Q03 · 运行、失败恢复和退出需要什么？](#detail-section-13)
  - [Q04 · 何时值得试，新方向如何证伪？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：WSL笔记本睡眠后出现TLS/JWT失败时，开发者需要先核双时钟。

手工读两侧UTC与原有网络/证书排障；工具仅封装过程。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 双时钟读数 | WSL/Windows时差线索 | 有顺序采样延迟 |
| ok/warn/fail | 粗略分级 | warn仍ok，非根因证明 |
| 手工建议 | 引导校时/其他诊断 | 不执行修复，重启需保存任务 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| WSL/Windows interop/PowerShell | 必需 | 读取Windows UTC | 检测成功不等命令可用 |
| Node>=18和匹配DSH | 必需 | 注册工具/提示 | 作者版本声明非验收 |
| 合理maxSkewSec与手工复核 | 诊断前提 | 解读分级 | 阈值掩盖或夸大偏差 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户装插件核interop | 手工UTC可读 |
| 调用 | Agent按故障触发工具 | 同时看error/耗时而非只ok |
| 判定 | 用户对照TLS/JWT现象 | 异常读数先手工复查 |
| 修复/退出 | 用户保存任务后决定校时或停用 | 插件不自动执行shutdown |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 已有宿主资源 | 安装与兼容核查 | 工时未知 |
| 持续 | PowerShell进程/文本上下文 | 复核分级 | 耗时/误警未测 |
| 失败恢复 | 重试和可能停机 | 手工查时/校时 | 不推算故障损失 |
| 退出 | 无插件持久校时 | 停用工具 | 人工重启影响另计 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 时差线索 | 双UTC与阈值 | 精确偏差/根因 |
| 错误反馈 | error/fail文本 | 空输出被误算 |
| 排障便利 | 固定工具和提示 | 节时及故障修复率 |

> **思考**：[Q02](#research-q02) 顺序采样混入命令延迟，空输出Number为0未拒绝；一次fail不等时钟根因。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把双时钟只读比较接入模型工具和提示，复用系统读数，不是自动校时。

[Q02](#research-q02) 固定execFile脚本和纯分级易审计；取消信号未接入、采样延迟与空值应明确。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 顺序采样混入命令延迟，空输出Number为0未拒绝；一次fail不等时钟根因。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 只读试用并手工交叉核对，不自动重启；不一致回原诊断。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持只读诊断封装，未执行目标/PowerShell或真实宿主；测量改进为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、CHANGELOG.md、CONTRIBUTING.md、index.js、lib/clock.js、lib/wsl-host.js、README.zh.md、SECURITY.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整读取README/清单/index/clock/wsl-host；复核旧findings的只读、空值、采样、取消边界。未运行插件、测试、PowerShell、套件或外部服务。
- 下一步：以同步/偏移/慢启动/空值/中途校时案例比较读数、误警及人工排障时间。

**分析版本**

- **仓库**：[173787247/dsh-wsl-clock](https://github.com/173787247/dsh-wsl-clock)
- **版本号**：0.2.0（[固定提交 02f3d6b](https://github.com/173787247/dsh-wsl-clock/tree/02f3d6b7886f92cabdafde06aa94d2517fe91e27)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 可探索采样窗/不确定区间与有效性校验，若误警不降或中途校时使结论误导即否定。

以同步/偏移/慢启动/空值/中途校时案例比较读数、误警及人工排障时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 94 | — | — | 560 |
| .js | source | 3 | 198 | 174 | 4 | — |
| .js | test | 1 | 35 | 31 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-02），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-clock/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查只读时钟诊断的排障价值、测量误差与采用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · WSL时钟工具解决哪一段排障？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它面向笔记本睡眠后WSL中TLS/GitHub App JWT失败的开发者，把读取Windows UTC、对比WSL并给出分级包装为可调用模型工具。合格结果是得到可信时差线索，再独立复测故障；并不是出现fail就证明证书或JWT失败由时钟引起。相比手工Date.now/PowerShell命令，多的是固定输出和Agent提示入口，不是新同步算法。只偶发一次故障且熟悉命令的人可直接手工检查。

index注入tools/systemPrompt并注册clock_doctor，无输入参数，启动检测WSL；这是真实原生插件，不是只有套件文档。原生进程/PowerShell提供读时钟能力，本组件负责归一与阈值解释，未自动修复也不配置模型。源码可证明调用链，不能证明用户节省排障时间。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:17-28](https://github.com/173787247/dsh-wsl-clock/blob/02f3d6b7886f92cabdafde06aa94d2517fe91e27/README.md#L17-L28)

作者场景与手工安装入口。

<details>
<summary>查看原文（12行）</summary>

````text
**`clock_doctor`**: WSL vs Windows UTC skew (ok/warn/fail). Large skew breaks TLS and GitHub App JWTs after sleep.

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-clock
npm test
```

MIT

## Where it sits

Compares WSL and Windows UTC so TLS and GitHub App JWTs are not failing on skew.
````

</details>

**依据 2 · 源码核查**：[index.js:1-30](https://github.com/173787247/dsh-wsl-clock/blob/02f3d6b7886f92cabdafde06aa94d2517fe91e27/index.js#L1-L30)

原生注入/工具注册和WSL检测。

<details>
<summary>查看原文（30行）</summary>

```text
import { detectWsl } from "./lib/wsl-host.js";
import * as core from "./lib/clock.js";

export const name = "dsh-wsl-clock";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 15_000);
  const wsl = detectWsl();

  ctx.systemPrompt.section({
    name: "tool:clock_doctor",
    order: 115,
    text: "Use clock_doctor after laptop sleep or TLS/GitHub App JWT failures: compare WSL vs Windows UTC skew (warn/fail levels).",
  });

  ctx.tools.register({
    name: "clock_doctor",
    description:
      "Detect WSL2 vs Windows clock skew (ok/warn/fail). Large skew breaks TLS and GitHub App tokens after sleep.",
    parameters: core.parameters(config),
    output: {
      schema: core.outputSchema(),
      render: (_args, value) => [{ type: "text", text: core.format(value) }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return core.notWsl ? core.notWsl() : { ok: false, error: "not running in WSL" };
      return core.execute(args, config);
```

</details>

#### 缺口

- 真实故障频度及手工对照缺失。
  **影响**：不能把封装便利算已兑现排障收益。
  **进一步探讨**：以固定睡眠后TLS任务比较定位正确率及人工时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 时差读数可信到什么程度，失败怎样呈现？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

入口在apply时检测WSL，调用core；core先取WSL Date.now，再等PowerShell读取Windows毫秒，顺序采样会把启动/命令延迟混入负偏移。默认绝对差大于30秒fail，大于15秒warn，warn的ok仍为true；这是阈值分类不是TLS根因判定。maxSkew可配，配置过大可隐藏实际偏差。

Number(trim(stdout))只查finite，空文本会变0而通过，随后算出巨大偏差；因此空输出不是已校验有效Windows时间。失败返回level fail、skewSec0和error，不应把0误读为同步。wsl-host用固定PowerShell脚本/execFile，无任意命令参数面；进程10秒超时与外层默认15秒分别存在，execute未接调用信号。取消不是全部等待已停止的证明。建议仅文本提到wsl --shutdown/NTP，不执行校时/重启；保持只读降低误操作，但人工运行shutdown仍会中断任务。

#### 证据与依据

**依据 1 · 源码核查**：[lib/clock.js:27-40](https://github.com/173787247/dsh-wsl-clock/blob/02f3d6b7886f92cabdafde06aa94d2517fe91e27/lib/clock.js#L27-L40)

分级规则及warn仍ok。

<details>
<summary>查看原文（14行）</summary>

```text
export function computeSkew(wslMs, winMs, maxSkewSec = 30) {
  const maxSkew = Number(maxSkewSec) > 0 ? Number(maxSkewSec) : 30;
  const skewSec = Math.round((Number(wslMs) - Number(winMs)) / 1000);
  const absSkewSec = Math.abs(skewSec);
  let level = "ok";
  if (absSkewSec > maxSkew) level = "fail";
  else if (absSkewSec > Math.max(5, Math.floor(maxSkew / 2))) level = "warn";
  return {
    skewSec,
    absSkewSec,
    level,
    ok: level !== "fail",
    maxSkewSec: maxSkew,
  };
```

</details>

**依据 2 · 源码核查**：[lib/clock.js:63-95](https://github.com/173787247/dsh-wsl-clock/blob/02f3d6b7886f92cabdafde06aa94d2517fe91e27/lib/clock.js#L63-L95)

顺序采样/空输出转0/失败值。

<details>
<summary>查看原文（33行）</summary>

```text
export async function execute(_args, config = {}, deps = {}) {
  const maxSkew = Number(config.maxSkewSec) > 0 ? Number(config.maxSkewSec) : 30;
  const nowFn = deps.now || Date.now;
  const runPs = deps.runPowerShell || runPowerShell;
  const wslMs = nowFn();
  let winMs = 0;
  try {
    const { stdout } = await runPs("[DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()", {
      timeoutMs: 10_000,
    });
    winMs = Number(String(stdout).trim());
    if (!Number.isFinite(winMs)) {
      return { ok: false, error: "invalid Windows time", advice: [], level: "fail", skewSec: 0 };
    }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
      advice: ["Could not read Windows UTC time via PowerShell."],
      level: "fail",
      skewSec: 0,
    };
  }
  const skew = computeSkew(wslMs, winMs, maxSkew);
  const advice = buildClockAdvice(skew);
  return {
    ok: skew.ok,
    level: skew.level,
    skewSec: skew.skewSec,
    maxSkewSec: skew.maxSkewSec,
    wslNow: new Date(wslMs).toISOString(),
    windowsNow: new Date(winMs).toISOString(),
    advice,
```

</details>

**依据 3 · 源码核查**：[lib/clock.js:43-60](https://github.com/173787247/dsh-wsl-clock/blob/02f3d6b7886f92cabdafde06aa94d2517fe91e27/lib/clock.js#L43-L60)

仅文本建议。

<details>
<summary>查看原文（18行）</summary>

```text
export function buildClockAdvice({ level, skewSec, maxSkewSec } = {}) {
  const tips = [];
  if (level === "fail") {
    tips.push(
      `Clock skew ${skewSec}s exceeds maxSkewSec=${maxSkewSec}. TLS handshakes and GitHub App JWTs often fail after laptop sleep.`,
    );
    tips.push(
      "Fix: from elevated Windows run `wsl --shutdown`, reopen the distro, then restart-dsh-web.sh. Or sync NTP inside WSL.",
    );
  } else if (level === "warn") {
    tips.push(
      `Clock skew ${skewSec}s is elevated (warn). Watch for intermittent TLS / token errors; prefer wsl --shutdown after long sleep.`,
    );
  } else {
    tips.push("Skew within tolerance.");
  }
  tips.push("Pair with dns_doctor / net_doctor if HTTPS still fails after time looks OK.");
  return tips;
```

</details>

**依据 4 · 源码核查**：[lib/wsl-host.js:34-41](https://github.com/173787247/dsh-wsl-clock/blob/02f3d6b7886f92cabdafde06aa94d2517fe91e27/lib/wsl-host.js#L34-L41)

固定脚本进程预算。

```text
export async function runPowerShell(script, { timeoutMs = 15_000 } = {}) {
  const bin = windowsBin("powershell.exe");
  const { stdout, stderr } = await execFileAsync(
    bin,
    ["-NoProfile", "-NonInteractive", "-Command", script],
    { timeout: timeoutMs, windowsHide: true, encoding: "utf8", maxBuffer: 4 * 1024 * 1024 },
  );
  return { stdout: String(stdout ?? ""), stderr: String(stderr ?? "") };
```

**依据 5 · 源码核查**：[index.js:26-30](https://github.com/173787247/dsh-wsl-clock/blob/02f3d6b7886f92cabdafde06aa94d2517fe91e27/index.js#L26-L30)

未传signal。

```text
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return core.notWsl ? core.notWsl() : { ok: false, error: "not running in WSL" };
      return core.execute(args, config);
```

#### 缺口

- 实际PowerShell启动延迟/空输出频率与误警率未测。
  **影响**：不能把单次时差作为精确偏差或故障因果。
  **进一步探讨**：对同步双时钟慢启动和空输出做受控复测，保留原始时间/耗时。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 运行、失败恢复和退出需要什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

需要WSL、Windows互操作及可找到的PowerShell，Node清单>=18和匹配DSH tools/systemPrompt服务。bin先找/mnt/c固定Windows路径再回名称，非默认挂载或关闭interop会失败；检测WSL不等命令可用。README最低DSH与套件latest verified都是作者兼容声明，本轮不访问套件外链也不把声明当宿主验收。

首次安装核环境/阈值，持续每次起PowerShell并输出少量文本，本机计算/模型上下文代价未测，源码没有独立外部计费接口但不等总现金为0。失败要区分命令错误、测量延迟与真偏移，手工复查再修时钟。工具不持久写时钟/配置，退出停用插件即可；若用户选择重启WSL修复，要先保存在途工作，停机损失未知。不得将诊断插件当自动恢复服务。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:14-28](https://github.com/173787247/dsh-wsl-clock/blob/02f3d6b7886f92cabdafde06aa94d2517fe91e27/package.json#L14-L28)

入口与Node要求。

<details>
<summary>查看原文（15行）</summary>

```text
  "type": "module",
  "main": "index.js",
  "engines": {
    "node": ">=18"
  },
  "scripts": {
    "test": "node --test test/*.test.js"
  },
  "files": [
    "index.js",
    "lib",
    "cordis.patch.yml",
    "README.md",
    "README.zh.md",
    "LICENSE"
```

</details>

**依据 2 · 源码核查**：[lib/wsl-host.js:8-28](https://github.com/173787247/dsh-wsl-clock/blob/02f3d6b7886f92cabdafde06aa94d2517fe91e27/lib/wsl-host.js#L8-L28)

固定路径及WSL检测。

<details>
<summary>查看原文（21行）</summary>

```text
const WINDOWS_BINS = {
  "powershell.exe": ["/mnt/c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe"],
  "cmd.exe": ["/mnt/c/Windows/System32/cmd.exe"],
  "explorer.exe": ["/mnt/c/Windows/explorer.exe"],
};

export function windowsBin(name, { exists = existsSync } = {}) {
  for (const p of WINDOWS_BINS[name] || []) {
    if (exists(p)) return p;
  }
  return name;
}

export function detectWsl({ env = process.env, readRelease = readOsRelease } = {}) {
  if (env.WSL_DISTRO_NAME || env.WSL_INTEROP) return true;
  try {
    return /microsoft/i.test(readRelease());
  } catch {
    return false;
  }
}
```

</details>

**依据 3 · 源码核查**：[README.md:8-15](https://github.com/173787247/dsh-wsl-clock/blob/02f3d6b7886f92cabdafde06aa94d2517fe91e27/README.md#L8-L15)

作者套件兼容声明。

```text
| **Plugin** | `dsh-wsl-clock` **0.2.0** |
| **Minimum dsh** | ≥ **0.1.2** (web UI one-shot `?token=` on Windows relay `:3081`) |
| **Latest verified** | See [dsh-wsl-kit Compatibility](https://github.com/173787247/dsh-wsl-kit#compatibility-2026-09) (currently **`0.2.1-rc.5`**) — single source of truth for the suite |
| **Kit set** | `llm` / `full` (some also useful alone) |
| **Cloud Flash** | Use model id **`deepseek-flash`** (V4.1 Flash) in `~/.dsh/settings.yaml` / `llm-deepseek` — not configured by this plugin |
| **Agent Teams** | Upstream experimental; not required here |

Suite floor versions: kit [`check-plugin-versions.sh`](https://github.com/173787247/dsh-wsl-kit/blob/master/scripts/check-plugin-versions.sh). Fault tree: [TROUBLESHOOTING.md](https://github.com/173787247/dsh-wsl-kit/blob/master/docs/TROUBLESHOOTING.md).
```

#### 缺口

- 真实宿主/interop兼容与资源开销未验证。
  **影响**：无法承诺安装即用或排障成本净下降。
  **进一步探讨**：在目标WSL副本核命令可用，记录调用耗时和人工恢复时间。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 何时值得试，新方向如何证伪？

**研究主题**：采用判断、新假设与验证

#### 完整回答

建议有睡眠后时钟疑难的WSL开发者只读试用，先拿手工UTC与实际TLS/JWT结果交叉对照；不要让Agent自动执行建议中的shutdown。空输出、慢调用或分级与手工不一致时回手工诊断，不以fail直接重启。

由顺序采样与空值转换可推导：记录前后WSL时间/采样耗时，对Windows时间做非空和合理区间校验，并报告含延迟的不确定区间。相对当前只有单点差与阈值，这增加的是测量质量提示；中点法要求采样窗内时钟线性且无校时，并不能消除不对称延迟。最小对照是同步时钟慢PowerShell、真实偏移、采样中途校时与空输出，比较误警/漏警及额外时延。若手工复查已等效、误警不降或区间仍误导就否定，未实现不计现有创新。

#### 证据与依据

**依据 1 · 源码核查**：[lib/clock.js:63-86](https://github.com/173787247/dsh-wsl-clock/blob/02f3d6b7886f92cabdafde06aa94d2517fe91e27/lib/clock.js#L63-L86)

单点/空值是推导基础。

<details>
<summary>查看原文（24行）</summary>

```text
export async function execute(_args, config = {}, deps = {}) {
  const maxSkew = Number(config.maxSkewSec) > 0 ? Number(config.maxSkewSec) : 30;
  const nowFn = deps.now || Date.now;
  const runPs = deps.runPowerShell || runPowerShell;
  const wslMs = nowFn();
  let winMs = 0;
  try {
    const { stdout } = await runPs("[DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()", {
      timeoutMs: 10_000,
    });
    winMs = Number(String(stdout).trim());
    if (!Number.isFinite(winMs)) {
      return { ok: false, error: "invalid Windows time", advice: [], level: "fail", skewSec: 0 };
    }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
      advice: ["Could not read Windows UTC time via PowerShell."],
      level: "fail",
      skewSec: 0,
    };
  }
  const skew = computeSkew(wslMs, winMs, maxSkew);
```

</details>

**依据 2 · 源码核查**：[lib/clock.js:43-60](https://github.com/173787247/dsh-wsl-clock/blob/02f3d6b7886f92cabdafde06aa94d2517fe91e27/lib/clock.js#L43-L60)

手工建议需要停机判断。

<details>
<summary>查看原文（18行）</summary>

```text
export function buildClockAdvice({ level, skewSec, maxSkewSec } = {}) {
  const tips = [];
  if (level === "fail") {
    tips.push(
      `Clock skew ${skewSec}s exceeds maxSkewSec=${maxSkewSec}. TLS handshakes and GitHub App JWTs often fail after laptop sleep.`,
    );
    tips.push(
      "Fix: from elevated Windows run `wsl --shutdown`, reopen the distro, then restart-dsh-web.sh. Or sync NTP inside WSL.",
    );
  } else if (level === "warn") {
    tips.push(
      `Clock skew ${skewSec}s is elevated (warn). Watch for intermittent TLS / token errors; prefer wsl --shutdown after long sleep.`,
    );
  } else {
    tips.push("Skew within tolerance.");
  }
  tips.push("Pair with dns_doctor / net_doctor if HTTPS still fails after time looks OK.");
  return tips;
```

</details>

#### 缺口

- 测量区间设计无实现/对照。
  **影响**：不能宣称更准确或已降低故障。
  **进一步探讨**：先做受控延迟与校时对照，再考虑移植到其他探针。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
