# dsh-wsl-defender

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[3463d75](https://github.com/173787247/dsh-wsl-defender/tree/3463d756faa7318bb8c1597db9a1bc0b1072d413)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-defender)
<!-- END META -->

> **实现功能**：从 WSL 查询 Windows Defender、防篡改、Firewall 与近期威胁状态。

> **核心亮点**：相对手工切到 PowerShell，它把多个安全查询聚合成 DSH 可读结果并保持只读，降低跨系统诊断交接。 [Q03](#research-q03)

> **风险与缺陷**：返回值受 Windows 版本、权限、Defender 可用性和本地化字段影响，聚合结果也不是合规审计或威胁已处置证明。 [Q04](#research-q04)

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
  - [Q01 · 谁在何种任务中使用，原有办法和合格结果是什么？](#detail-section-11)
  - [Q02 · 能力如何从入口、注册、调用到状态变化实现？](#detail-section-12)
  - [Q03 · 相对原生能力或简单替代，固定版本增加了什么？](#detail-section-13)
  - [Q04 · 什么前提最可能使核心价值不成立？](#detail-section-14)
  - [Q05 · 启动、持续生效和失败恢复分别依赖什么？](#detail-section-15)
  - [Q06 · 首次、持续与失败恢复成本及效果证据如何？](#detail-section-16)
  - [Q07 · 实现有哪些可靠性取舍和可复用设计？](#detail-section-17)
  - [Q08 · 由贡献和限制能推导什么未验证方向？](#detail-section-18)
  - [Q09 · 对什么人值得观察或试用，成功与停止条件是什么？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向在 WSL 内工作的 Windows 开发者，让代理在诊断环境时读取宿主安全态势而不修改设置。 [Q01](#research-q01)

基线是在 Windows PowerShell 分别执行安全 cmdlet；插件减少查询与格式转换，但不替代安全产品和人工判断。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 安全态势 | 汇总 Defender 实时保护、签名与扫描信息。 | 仅由固定版本源码确认；运行效果未验证 |
| 防火墙状态 | 读取各 Windows Firewall profile。 | 仅由固定版本源码确认；运行效果未验证 |
| 威胁与排除 | 展示近期检测和配置的排除项。 | 仅由固定版本源码确认；运行效果未验证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| WSL→Windows PowerShell | 必需 | 执行 Defender/Firewall 查询 | 返回 not WSL 或执行错误 |
| Defender/Firewall cmdlet | 必需 | 提供防护、签名、威胁和 profile | 第三方杀软/版本差异导致空字段 |
| 足够只读权限 | 按字段 | 读取威胁与排除项 | 部分数据 unavailable，不能当零 |
| 人工安全解释 | 采用必需 | 区分状态、检测和已处置 | 输出不等于合规结论 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|---|
| 环境检测 | 工具确认 WSL 并调用 PowerShell | 原始查询可执行 |
| 规范化 | 纯函数整理 Defender、Firewall、threats、exclusions | 缺失保持 unavailable/null |
| 人工核对 | 用户对照 Windows Security 或原始 cmdlet | 关键字段语义一致 |
| 后续处置 | 用户转到受控安全流程 | 插件不自动改配置、隔离或删除 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 复用 Windows 安全组件 | 核对权限和字段支持 | 环境矩阵准备时间未知 |
| 持续使用 | 每次多条 PowerShell 查询 | 解读签名、威胁、排除和 profile | 查询秒数/审阅分钟未知 |
| 失败恢复 | 无自动修复资源 | 切 Windows UI、提权或确认第三方杀软 | 权限失败率未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 聚合查询 | Defender/Firewall/威胁/排除项结构存在 | 各 Windows 版本字段完整率 |
| 只读诊断 | 工具无修改参数 | 执行脚本是否在所有分支保持只读 |
| 可读格式 | 规范化与文本格式分离 | action-ok 等字段是否会被误解 |

> **思考**：返回值受 Windows 版本、权限、Defender 可用性和本地化字段影响，聚合结果也不是合规审计或威胁已处置证明。 [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对手工切到 PowerShell，它把多个安全查询聚合成 DSH 可读结果并保持只读，降低跨系统诊断交接。 [Q03](#research-q03)

相对手工切到 PowerShell，它把多个安全查询聚合成 DSH 可读结果并保持只读，降低跨系统诊断交接。 [Q03](#research-q03)

执行层与规范化/格式化纯函数分离，利于测试和兼容修复；需要针对权限不足、字段缺失与非 Defender 环境验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

返回值受 Windows 版本、权限、Defender 可用性和本地化字段影响，聚合结果也不是合规审计或威胁已处置证明。 [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

仅适合 WSL 内做初步、只读环境诊断的技术用户观察，不能替代安全产品、合规审计或自动修复。若关键字段与 Windows Security UI 一致、权限不足明确标注且历史差异不被误写成威胁处置，再用于诊断；发现缺字段仍格式化为正常或 action 被误解，应停止。 [Q09](#research-q09)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献为固定版本源码支持的实现与集成增量；效果和真实宿主可用性未验证。未来设计假设保持未验证，不计入插件现有能力。

- 已检查：作者 README、包清单、源码路径 README.md、index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅检查固定提交的作者材料、入口和关键实现；未运行插件、测试、外部服务或真实宿主，也未核验独立用户反馈。
- 下一步：在测试 Windows VM 组合管理员/普通用户、Defender 开关和不同 firewall profile，保存原始 cmdlet、插件 JSON 与 Security UI 截图逐字段对照；记录查询秒数和缺失字段。任何 unavailable 被呈现为正常或威胁 action 语义错误，就不应作为安全判断入口。

**分析版本**

- **仓库**：[173787247/dsh-wsl-defender](https://github.com/173787247/dsh-wsl-defender)
- **版本号**：0.1.0（[固定提交 3463d75](https://github.com/173787247/dsh-wsl-defender/tree/3463d756faa7318bb8c1597db9a1bc0b1072d413)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可增加带时间戳的差异快照，只突出防护关闭、签名过旧和新增排除项，并要求用户确认后再建议任何修复动作。 [Q08](#research-q08)

在测试 Windows VM 组合管理员/普通用户、Defender 开关和不同 firewall profile，保存原始 cmdlet、插件 JSON 与 Security UI 截图逐字段对照；记录查询秒数和缺失字段。任何 unavailable 被呈现为正常或威胁 action 语义错误，就不应作为安全判断入口。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 115 | — | — | 407 |
| .js | source | 4 | 241 | 207 | 12 | — |
| .js | test | 1 | 22 | 21 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-defender/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：研究 dsh-wsl-defender 在固定版本中的实现贡献、成立条件、关键限制、采用价值与可证伪的新设计方向。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁在何种任务中使用，原有办法和合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

面向在 WSL 内工作的 Windows 开发者，让代理在诊断环境时读取宿主安全态势而不修改设置。 合格结果不是“工具被调用”，而是用户能在既定边界内得到可复核产物。基线是在 Windows PowerShell 分别执行安全 cmdlet；插件减少查询与格式转换，但不替代安全产品和人工判断。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-20](https://github.com/173787247/dsh-wsl-defender/blob/3463d756faa7318bb8c1597db9a1bc0b1072d413/README.md#L1-L20)

作者材料说明目标用户、安装方式、主要能力和已知边界。

<details>
<summary>查看原文（20行）</summary>

````text
# dsh-wsl-defender

DeepSeek Harness plugin: Windows security posture from WSL: Defender antivirus status and firewall profile state.

Part of **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)**.

[中文说明 → README.zh.md](./README.zh.md)

## Install

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-defender
```

## Usage

```
win_defender          # antivirus + firewall posture
```

````

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 能力如何从入口、注册、调用到状态变化实现？

**研究主题**：功能与机制

#### 完整回答

单一 win_defender 工具检测 WSL 后调用 PowerShell 查询，纯函数层规范化 Defender、Firewall、威胁与排除项并格式化输出。 源码可以确认注册和数据流存在，但不能据此推断宿主加载、外部服务或最终效果已经通过。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-38](https://github.com/173787247/dsh-wsl-defender/blob/3463d756faa7318bb8c1597db9a1bc0b1072d413/index.js#L1-L38)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（38行）</summary>

```text
import { detectWsl } from "./lib/wsl-host.js";
import * as core from "./lib/defender.js";
import { execute } from "./lib/defender-exec.js";

export const name = "dsh-wsl-defender";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  const wsl = detectWsl();

  ctx.systemPrompt.section({
    name: "tool:win_defender",
    order: 218,
    text: "Use win_defender for WSL/Windows interop: Windows security posture from WSL: Defender antivirus status and firewall profile state.",
  });

  ctx.tools.register({
    name: "win_defender",
    description: "Windows security posture from WSL: Defender antivirus status and firewall profile state.",
    parameters: core.parameters(),
    output: {
      schema: core.outputSchema(),
      render: (_args, value) => [{ type: "text", text: core.format(value) }],
    },
    timeoutMs: Number(config.timeoutMs) > 0 ? Number(config.timeoutMs) : 30_000,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return { ok: false, error: "not running in WSL" };
      try {
        return await execute(args, config);
      } catch (error) {
        return { ok: false, error: String(error?.message ?? error) };
      }
    },
    presentCall: () => ({ card: "generic", title: "win_defender" }),
    presentResult: (_args, result) => ({ card: "generic", title: "win_defender", content: result?.content }),
  });
}
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对原生能力或简单替代，固定版本增加了什么？

**研究主题**：贡献与相对优势

#### 完整回答

相对手工切到 PowerShell，它把多个安全查询聚合成 DSH 可读结果并保持只读，降低跨系统诊断交接。 参照是宿主原生工具、直接脚本或手工流程，现有证据支持实现增量，不支持全球首创或收益排名。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-38](https://github.com/173787247/dsh-wsl-defender/blob/3463d756faa7318bb8c1597db9a1bc0b1072d413/index.js#L1-L38)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（38行）</summary>

```text
import { detectWsl } from "./lib/wsl-host.js";
import * as core from "./lib/defender.js";
import { execute } from "./lib/defender-exec.js";

export const name = "dsh-wsl-defender";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  const wsl = detectWsl();

  ctx.systemPrompt.section({
    name: "tool:win_defender",
    order: 218,
    text: "Use win_defender for WSL/Windows interop: Windows security posture from WSL: Defender antivirus status and firewall profile state.",
  });

  ctx.tools.register({
    name: "win_defender",
    description: "Windows security posture from WSL: Defender antivirus status and firewall profile state.",
    parameters: core.parameters(),
    output: {
      schema: core.outputSchema(),
      render: (_args, value) => [{ type: "text", text: core.format(value) }],
    },
    timeoutMs: Number(config.timeoutMs) > 0 ? Number(config.timeoutMs) : 30_000,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return { ok: false, error: "not running in WSL" };
      try {
        return await execute(args, config);
      } catch (error) {
        return { ok: false, error: String(error?.message ?? error) };
      }
    },
    presentCall: () => ({ card: "generic", title: "win_defender" }),
    presentResult: (_args, result) => ({ card: "generic", title: "win_defender", content: result?.content }),
  });
}
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么前提最可能使核心价值不成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

最强支持是固定版本实现确有完整入口和防御分支。最关键限制是：返回值受 Windows 版本、权限、Defender 可用性和本地化字段影响，聚合结果也不是合规审计或威胁已处置证明。 这会直接收窄采用范围，而不是否定所有能力。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-38](https://github.com/173787247/dsh-wsl-defender/blob/3463d756faa7318bb8c1597db9a1bc0b1072d413/index.js#L1-L38)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（38行）</summary>

```text
import { detectWsl } from "./lib/wsl-host.js";
import * as core from "./lib/defender.js";
import { execute } from "./lib/defender-exec.js";

export const name = "dsh-wsl-defender";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  const wsl = detectWsl();

  ctx.systemPrompt.section({
    name: "tool:win_defender",
    order: 218,
    text: "Use win_defender for WSL/Windows interop: Windows security posture from WSL: Defender antivirus status and firewall profile state.",
  });

  ctx.tools.register({
    name: "win_defender",
    description: "Windows security posture from WSL: Defender antivirus status and firewall profile state.",
    parameters: core.parameters(),
    output: {
      schema: core.outputSchema(),
      render: (_args, value) => [{ type: "text", text: core.format(value) }],
    },
    timeoutMs: Number(config.timeoutMs) > 0 ? Number(config.timeoutMs) : 30_000,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return { ok: false, error: "not running in WSL" };
      try {
        return await execute(args, config);
      } catch (error) {
        return { ok: false, error: String(error?.message ?? error) };
      }
    },
    presentCall: () => ({ card: "generic", title: "win_defender" }),
    presentResult: (_args, result) => ({ card: "generic", title: "win_defender", content: result?.content }),
  });
}
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、持续生效和失败恢复分别依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

必须在 WSL 中访问 Windows PowerShell，查询权限和 Defender/Firewall cmdlet 可用；插件本身不修复、不隔离威胁。 启动成功、持续有用和失败恢复是三类不同条件；缺少依赖时不能把“已注册”当作任务已办结。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-38](https://github.com/173787247/dsh-wsl-defender/blob/3463d756faa7318bb8c1597db9a1bc0b1072d413/index.js#L1-L38)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（38行）</summary>

```text
import { detectWsl } from "./lib/wsl-host.js";
import * as core from "./lib/defender.js";
import { execute } from "./lib/defender-exec.js";

export const name = "dsh-wsl-defender";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  const wsl = detectWsl();

  ctx.systemPrompt.section({
    name: "tool:win_defender",
    order: 218,
    text: "Use win_defender for WSL/Windows interop: Windows security posture from WSL: Defender antivirus status and firewall profile state.",
  });

  ctx.tools.register({
    name: "win_defender",
    description: "Windows security posture from WSL: Defender antivirus status and firewall profile state.",
    parameters: core.parameters(),
    output: {
      schema: core.outputSchema(),
      render: (_args, value) => [{ type: "text", text: core.format(value) }],
    },
    timeoutMs: Number(config.timeoutMs) > 0 ? Number(config.timeoutMs) : 30_000,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return { ok: false, error: "not running in WSL" };
      try {
        return await execute(args, config);
      } catch (error) {
        return { ok: false, error: String(error?.message ?? error) };
      }
    },
    presentCall: () => ({ card: "generic", title: "win_defender" }),
    presentResult: (_args, result) => ({ card: "generic", title: "win_defender", content: result?.content }),
  });
}
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 首次、持续与失败恢复成本及效果证据如何？

**研究主题**：效果与总成本

#### 完整回答

首次成本是确认 WSL 能调用 Windows PowerShell、当前账户可读 Defender/Firewall cmdlet；持续成本是一轮多个安全查询和人工解释签名年龄、扫描时间、威胁 action 与排除项；失败恢复包括权限不足、非 Defender 环境和字段缺失，插件只返回状态、不修复。合格单位是一次带采集时间、字段完整性和权限边界的安全快照，而不是 `ok=true`。当前缺 Windows 版本矩阵、查询秒数、权限失败率和与 Windows Security UI 的一致率。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-38](https://github.com/173787247/dsh-wsl-defender/blob/3463d756faa7318bb8c1597db9a1bc0b1072d413/index.js#L1-L38)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（38行）</summary>

```text
import { detectWsl } from "./lib/wsl-host.js";
import * as core from "./lib/defender.js";
import { execute } from "./lib/defender-exec.js";

export const name = "dsh-wsl-defender";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  const wsl = detectWsl();

  ctx.systemPrompt.section({
    name: "tool:win_defender",
    order: 218,
    text: "Use win_defender for WSL/Windows interop: Windows security posture from WSL: Defender antivirus status and firewall profile state.",
  });

  ctx.tools.register({
    name: "win_defender",
    description: "Windows security posture from WSL: Defender antivirus status and firewall profile state.",
    parameters: core.parameters(),
    output: {
      schema: core.outputSchema(),
      render: (_args, value) => [{ type: "text", text: core.format(value) }],
    },
    timeoutMs: Number(config.timeoutMs) > 0 ? Number(config.timeoutMs) : 30_000,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return { ok: false, error: "not running in WSL" };
      try {
        return await execute(args, config);
      } catch (error) {
        return { ok: false, error: String(error?.message ?? error) };
      }
    },
    presentCall: () => ({ card: "generic", title: "win_defender" }),
    presentResult: (_args, result) => ({ card: "generic", title: "win_defender", content: result?.content }),
  });
}
```

</details>

#### 缺口

- 缺少不同 Windows/PowerShell/权限/第三方杀软环境下的字段完整率、查询延迟和 UI 一致性。
  **影响**：无法把聚合输出当作可靠安全态势，更不能据此推断威胁已处理。
  **进一步探讨**：在管理员/普通用户、Defender 启用/禁用与不同防火墙 profile 下，对照 Windows Security UI 和原始 cmdlet，记录缺字段、误解和查询秒数。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 实现有哪些可靠性取舍和可复用设计？

**研究主题**：工程质量与复用

#### 完整回答

执行层与规范化/格式化纯函数分离，利于测试和兼容修复；需要针对权限不足、字段缺失与非 Defender 环境验证。 这些判断来自结构与错误路径抽读，不等于完整安全审计或生产可靠性证明。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-38](https://github.com/173787247/dsh-wsl-defender/blob/3463d756faa7318bb8c1597db9a1bc0b1072d413/index.js#L1-L38)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（38行）</summary>

```text
import { detectWsl } from "./lib/wsl-host.js";
import * as core from "./lib/defender.js";
import { execute } from "./lib/defender-exec.js";

export const name = "dsh-wsl-defender";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  const wsl = detectWsl();

  ctx.systemPrompt.section({
    name: "tool:win_defender",
    order: 218,
    text: "Use win_defender for WSL/Windows interop: Windows security posture from WSL: Defender antivirus status and firewall profile state.",
  });

  ctx.tools.register({
    name: "win_defender",
    description: "Windows security posture from WSL: Defender antivirus status and firewall profile state.",
    parameters: core.parameters(),
    output: {
      schema: core.outputSchema(),
      render: (_args, value) => [{ type: "text", text: core.format(value) }],
    },
    timeoutMs: Number(config.timeoutMs) > 0 ? Number(config.timeoutMs) : 30_000,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return { ok: false, error: "not running in WSL" };
      try {
        return await execute(args, config);
      } catch (error) {
        return { ok: false, error: String(error?.message ?? error) };
      }
    },
    presentCall: () => ({ card: "generic", title: "win_defender" }),
    presentResult: (_args, result) => ({ card: "generic", title: "win_defender", content: result?.content }),
  });
}
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由贡献和限制能推导什么未验证方向？

**研究主题**：新假设与验证

#### 完整回答

从已确认机制与关键限制可推导：可增加带时间戳的差异快照，只突出防护关闭、签名过旧和新增排除项，并要求用户确认后再建议任何修复动作。 最小验证应与现有简单流程在相同任务、模型、预算和验收标准下比较，并在人工投入或失败率上升时否定该方向。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-38](https://github.com/173787247/dsh-wsl-defender/blob/3463d756faa7318bb8c1597db9a1bc0b1072d413/index.js#L1-L38)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（38行）</summary>

```text
import { detectWsl } from "./lib/wsl-host.js";
import * as core from "./lib/defender.js";
import { execute } from "./lib/defender-exec.js";

export const name = "dsh-wsl-defender";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  const wsl = detectWsl();

  ctx.systemPrompt.section({
    name: "tool:win_defender",
    order: 218,
    text: "Use win_defender for WSL/Windows interop: Windows security posture from WSL: Defender antivirus status and firewall profile state.",
  });

  ctx.tools.register({
    name: "win_defender",
    description: "Windows security posture from WSL: Defender antivirus status and firewall profile state.",
    parameters: core.parameters(),
    output: {
      schema: core.outputSchema(),
      render: (_args, value) => [{ type: "text", text: core.format(value) }],
    },
    timeoutMs: Number(config.timeoutMs) > 0 ? Number(config.timeoutMs) : 30_000,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return { ok: false, error: "not running in WSL" };
      try {
        return await execute(args, config);
      } catch (error) {
        return { ok: false, error: String(error?.message ?? error) };
      }
    },
    presentCall: () => ({ card: "generic", title: "win_defender" }),
    presentResult: (_args, result) => ({ card: "generic", title: "win_defender", content: result?.content }),
  });
}
```

</details>

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 对什么人值得观察或试用，成功与停止条件是什么？

**研究主题**：采用判断

#### 完整回答

仅适合 WSL 内做初步、只读环境诊断的技术用户观察，不能替代安全产品、合规审计或自动修复。若关键字段与 Windows Security UI 一致、权限不足明确标注且历史差异不被误写成威胁处置，再用于诊断；发现缺字段仍格式化为正常或 action 被误解，应停止。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-38](https://github.com/173787247/dsh-wsl-defender/blob/3463d756faa7318bb8c1597db9a1bc0b1072d413/index.js#L1-L38)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（38行）</summary>

```text
import { detectWsl } from "./lib/wsl-host.js";
import * as core from "./lib/defender.js";
import { execute } from "./lib/defender-exec.js";

export const name = "dsh-wsl-defender";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  const wsl = detectWsl();

  ctx.systemPrompt.section({
    name: "tool:win_defender",
    order: 218,
    text: "Use win_defender for WSL/Windows interop: Windows security posture from WSL: Defender antivirus status and firewall profile state.",
  });

  ctx.tools.register({
    name: "win_defender",
    description: "Windows security posture from WSL: Defender antivirus status and firewall profile state.",
    parameters: core.parameters(),
    output: {
      schema: core.outputSchema(),
      render: (_args, value) => [{ type: "text", text: core.format(value) }],
    },
    timeoutMs: Number(config.timeoutMs) > 0 ? Number(config.timeoutMs) : 30_000,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return { ok: false, error: "not running in WSL" };
      try {
        return await execute(args, config);
      } catch (error) {
        return { ok: false, error: String(error?.message ?? error) };
      }
    },
    presentCall: () => ({ card: "generic", title: "win_defender" }),
    presentResult: (_args, result) => ({ card: "generic", title: "win_defender", content: result?.content }),
  });
}
```

</details>

#### 缺口

- 未在真实 Windows 安全环境核对规范化字段与 UI/cmdlet。
  **影响**：安全状态误报会比普通工具失败产生更高决策风险。
  **进一步探讨**：建立多个权限和 Defender 状态组合，逐字段对照原始 PowerShell 与 UI，并让安全人员审阅格式含义。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
