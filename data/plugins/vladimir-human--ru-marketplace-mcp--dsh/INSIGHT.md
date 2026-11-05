# RU Marketplace DSH 适配包

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[416b065](https://github.com/Vladimir-Human/ru-marketplace-mcp/tree/416b065d03c971be86d982ccb5a6a1855069f09d/dsh)

<!-- BEGIN META -->
[![GitHub ★ 173](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=173&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Vladimir-Human/ru-marketplace-mcp)
<!-- END META -->

> **功能**：为 DSH 提供市场查询技能及三档可选 MCP 挂载。

> **亮点**：[Q01](#research-q01) 把技能和查询服务装配分开。

> **主要限制**：[Q03](#research-q03) 工具档位的估算不等于账户计量。

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
  - [Q01 · 安装后有哪些能力？](#detail-section-11)
  - [Q02 · 三种模式怎么互斥？](#detail-section-12)
  - [Q03 · 哪些信息可能被误读？](#detail-section-13)
  - [Q04 · 如何尝试及退出？](#detail-section-14)
  - [Q05 · 按任务单独挂载会不会更省？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH 做市场查询的人可选挂载范围。

手配 MCP 可精确控制，但需自行维护路径。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 技能 | 引导查询 | 服务另启 |
| 三档挂载 | 控制工具范围 | 需本地仓库 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH | 必需 | 解析补丁 | 无法加载 |
| Python 与 uv | 查询必需 | 启动服务 | 仅保留技能 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 安装 | 核对技能 | 确认 MCP 未启动 |
| 接入 | 设置目录重启 | 确认唯一模式 |
| 退出 | 移除变量 | 回技能模式 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 依赖开销未知 | 配置耗时未知 | 本地克隆 |
| 持续 | 真实模型费用未知 | 维护耗时未知 | 模式影响工具量 |
| 恢复 | 重试未知 | 重启时间未知 | 可回默认 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 模式装配 | 谓词可查 | 真实宿主表现 |

> **思考**：[Q03](#research-q03) 工具档位的估算不等于账户计量。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把技能和查询服务装配分开。

三条谓词决定唯一活动行。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 工具档位的估算不等于账户计量。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先核对仅技能模式，再开 compare。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定子包静态研究，未运行宿主或服务。

- 已检查：作者 README、包清单、源码路径 dsh/cordis.patch.yml、dsh/README.md 及固定范围 inventory；组件：dsh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定子包静态研究，未运行宿主或服务。
- 下一步：固定模型和任务测量两种用法

**分析版本**

- **仓库**：[Vladimir-Human/ru-marketplace-mcp](https://github.com/Vladimir-Human/ru-marketplace-mcp)
- **版本号**：2.8.2（[固定提交 416b065](https://github.com/Vladimir-Human/ru-marketplace-mcp/tree/416b065d03c971be86d982ccb5a6a1855069f09d)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 比较按需挂载与常驻的总负担。

固定模型和任务测量两种用法

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 16 | 1573 | — | — | 12465 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/Vladimir-Human/ru-marketplace-mcp/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 DSH 适配包的默认状态与比价服务的启动边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 安装后有哪些能力？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

文件系统技能提供器注册随包技能目录。没有设置服务路径时三个 MCP 行都禁用，模型可看技能说明，但不能靠它们直接查询。相对手配各工具，这为常规会话保留轻量入口。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/cordis.patch.yml:7-21](https://github.com/Vladimir-Human/ru-marketplace-mcp/blob/416b065d03c971be86d982ccb5a6a1855069f09d/dsh/cordis.patch.yml#L7-L21)

技能注册与 compare 启用条件

<details>
<summary>查看原文（15行）</summary>

```text
- insert:
    - id: ru-marketplace-skills
      name: '@deepseek-ai/dsh-skill-filesystem'
      config:
        providerName: ru-marketplace
        includeDefaultRoots: false
        watch: false
        customSkillDirs:
          - !!js "process.getBuiltinModule('node:path').join(process.getBuiltinModule('node:module').createRequire(baseUrl).resolve('ru-marketplace-mcp-dsh/package.json'), '..', 'skills')"

    # Recommended and cheap: price comparison across WB, Detsky Mir and Yandex.
    # 4 tools, the smallest tool list while mounted (see docs/TOOLS.md).
    - id: ru-marketplace-compare
      name: '@deepseek-ai/dsh-mcp-client'
      disabled: !!js "!process.env.RU_MARKETPLACE_MCP_DIR || !!process.env.RU_MARKETPLACE_MCP_FULL || !!process.env.RU_MARKETPLACE_MCP_DECISION"
```

</details>

**依据 2 · 作者声明**：[dsh/README.md:3-21](https://github.com/Vladimir-Human/ru-marketplace-mcp/blob/416b065d03c971be86d982ccb5a6a1855069f09d/dsh/README.md#L3-L21)

作者说明三档模式及估算

<details>
<summary>查看原文（19行）</summary>

```text
Read-only MCP servers for Russian marketplaces: prices, stock, ratings, reviews
and cross-marketplace price comparison. This bundle ships 15 Agent Skills plus
three mutually exclusive MCP server rows that are **off by default**.

## Why off by default

An MCP row that is always mounted is paid on **every request**, because the
harness registers the schema of every tool in the session context. Estimated
from each server's `tools/list` by `scripts/gen_tools_doc.py` (the estimate
`scripts/mcp_wire.py` uses; CI fails when this table is stale, details in
[docs/TOOLS.md](../docs/TOOLS.md)):

<!-- tools-cost-dsh:start -->
| Mode | Cost while mounted | Model-facing tools |
|---|---|---|
| Skills only (default) | 15 skill catalog entries; no MCP schemas | 0 |
| `compare-mcp` (recommended) | ~1.7k tokens per request | 4 |
| `decision-mcp` (shortlist inspection) | ~2.0k tokens per request | 5 |
| `marketplace-mcp` (full) | ~13.1k tokens per request | 39 |
```

</details>

#### 缺口

- 未核对真实宿主挂载
  **影响**：不能保证可见性
  **进一步探讨**：在独立 profile 核对技能与工具表

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 三种模式怎么互斥？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

目录存在时 full 优先，随后 decision，最后 compare。每行使用相同服务器名，以 uv run --frozen --directory 启动独立 Python 仓库。关闭较大模式可保留较小工具面。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/cordis.patch.yml:19-49](https://github.com/Vladimir-Human/ru-marketplace-mcp/blob/416b065d03c971be86d982ccb5a6a1855069f09d/dsh/cordis.patch.yml#L19-L49)

最小和中档谓词

<details>
<summary>查看原文（31行）</summary>

```text
    - id: ru-marketplace-compare
      name: '@deepseek-ai/dsh-mcp-client'
      disabled: !!js "!process.env.RU_MARKETPLACE_MCP_DIR || !!process.env.RU_MARKETPLACE_MCP_FULL || !!process.env.RU_MARKETPLACE_MCP_DECISION"
      config:
        serverName: rumarket
        transport: stdio
        command: uv
        args:
          - run
          - --frozen
          - --directory
          - !!js "process.env.RU_MARKETPLACE_MCP_DIR || '.'"
          - compare-mcp
        failOnStartupError: false

    # Middle profile: comparison plus one generic card inspector. This is a
    # deliberate shortlist/evidence step between cheap compare and full mount.
    - id: ru-marketplace-decision
      name: '@deepseek-ai/dsh-mcp-client'
      disabled: !!js "!process.env.RU_MARKETPLACE_MCP_DIR || !!process.env.RU_MARKETPLACE_MCP_FULL || !process.env.RU_MARKETPLACE_MCP_DECISION"
      config:
        serverName: rumarket
        transport: stdio
        command: uv
        args:
          - run
          - --frozen
          - --directory
          - !!js "process.env.RU_MARKETPLACE_MCP_DIR || '.'"
          - decision-mcp
        failOnStartupError: false
```

</details>

**依据 2 · 源码核查**：[dsh/cordis.patch.yml:54-67](https://github.com/Vladimir-Human/ru-marketplace-mcp/blob/416b065d03c971be86d982ccb5a6a1855069f09d/dsh/cordis.patch.yml#L54-L67)

全量谓词

<details>
<summary>查看原文（14行）</summary>

```text
    - id: ru-marketplace-full
      name: '@deepseek-ai/dsh-mcp-client'
      disabled: !!js "!process.env.RU_MARKETPLACE_MCP_DIR || !process.env.RU_MARKETPLACE_MCP_FULL"
      config:
        serverName: rumarket
        transport: stdio
        command: uv
        args:
          - run
          - --frozen
          - --directory
          - !!js "process.env.RU_MARKETPLACE_MCP_DIR || '.'"
          - marketplace-mcp
        failOnStartupError: false
```

</details>

#### 缺口

- 未运行宿主
  **影响**：不能确认宿主解析
  **进一步探讨**：检查四组配置组合

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些信息可能被误读？

**研究主题**：缺陷与关键质疑

#### 完整回答

档位成本是作者用工具清单估算，不能当成真实账单。环境变量通过字符串真值判断，写入 0 仍可能打开分支；启动失败策略允许宿主继续，启动完成不意味着 MCP 可用。

#### 证据与依据

**依据 1 · 作者声明**：[dsh/README.md:7-21](https://github.com/Vladimir-Human/ru-marketplace-mcp/blob/416b065d03c971be86d982ccb5a6a1855069f09d/dsh/README.md#L7-L21)

作者估算方法

<details>
<summary>查看原文（15行）</summary>

```text
## Why off by default

An MCP row that is always mounted is paid on **every request**, because the
harness registers the schema of every tool in the session context. Estimated
from each server's `tools/list` by `scripts/gen_tools_doc.py` (the estimate
`scripts/mcp_wire.py` uses; CI fails when this table is stale, details in
[docs/TOOLS.md](../docs/TOOLS.md)):

<!-- tools-cost-dsh:start -->
| Mode | Cost while mounted | Model-facing tools |
|---|---|---|
| Skills only (default) | 15 skill catalog entries; no MCP schemas | 0 |
| `compare-mcp` (recommended) | ~1.7k tokens per request | 4 |
| `decision-mcp` (shortlist inspection) | ~2.0k tokens per request | 5 |
| `marketplace-mcp` (full) | ~13.1k tokens per request | 39 |
```

</details>

**依据 2 · 源码核查**：[dsh/cordis.patch.yml:19-49](https://github.com/Vladimir-Human/ru-marketplace-mcp/blob/416b065d03c971be86d982ccb5a6a1855069f09d/dsh/cordis.patch.yml#L19-L49)

字符串谓词与启动策略

<details>
<summary>查看原文（31行）</summary>

```text
    - id: ru-marketplace-compare
      name: '@deepseek-ai/dsh-mcp-client'
      disabled: !!js "!process.env.RU_MARKETPLACE_MCP_DIR || !!process.env.RU_MARKETPLACE_MCP_FULL || !!process.env.RU_MARKETPLACE_MCP_DECISION"
      config:
        serverName: rumarket
        transport: stdio
        command: uv
        args:
          - run
          - --frozen
          - --directory
          - !!js "process.env.RU_MARKETPLACE_MCP_DIR || '.'"
          - compare-mcp
        failOnStartupError: false

    # Middle profile: comparison plus one generic card inspector. This is a
    # deliberate shortlist/evidence step between cheap compare and full mount.
    - id: ru-marketplace-decision
      name: '@deepseek-ai/dsh-mcp-client'
      disabled: !!js "!process.env.RU_MARKETPLACE_MCP_DIR || !!process.env.RU_MARKETPLACE_MCP_FULL || !process.env.RU_MARKETPLACE_MCP_DECISION"
      config:
        serverName: rumarket
        transport: stdio
        command: uv
        args:
          - run
          - --frozen
          - --directory
          - !!js "process.env.RU_MARKETPLACE_MCP_DIR || '.'"
          - decision-mcp
        failOnStartupError: false
```

</details>

#### 缺口

- 未取得真实 token 或故障结果
  **影响**：无法推断费用和可用率
  **进一步探讨**：对比同任务输入和工具清单

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何尝试及退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

先安装仅技能模式，确认兼容后设置本地克隆目录并重启，最小模式只需一个明确查询。需要 Python、uv 和锁定依赖。移除变量再重启可回技能模式，移除 bundle 完整退出。

#### 证据与依据

**依据 1 · 作者声明**：[dsh/README.md:28-54](https://github.com/Vladimir-Human/ru-marketplace-mcp/blob/416b065d03c971be86d982ccb5a6a1855069f09d/dsh/README.md#L28-L54)

依赖与安装

<details>
<summary>查看原文（27行）</summary>

````text
## Requirements

- DeepSeek Harness (`dsh`)
- Python **≥ 3.12**
- [`uv`](https://docs.astral.sh/uv/)
- A local clone of this repository (the MCP rows launch it with
  `uv run --directory <clone>`)

## Install (three steps)

1. Add the bundle to a profile (`web` is the profile dsh ships with a UI; use
   whichever profile you actually run — a bare profile that dsh auto-creates on
   first use carries no app and cannot be launched):

   ```console
   dsh plugin --profile web add github:Vladimir-Human/ru-marketplace-mcp#path:/dsh
   ```

   The 15 skills appear immediately. No MCP server starts yet.

2. Clone the server and install its locked environment once:

   ```console
   git clone https://github.com/Vladimir-Human/ru-marketplace-mcp.git
   cd ru-marketplace-mcp
   uv sync --frozen
   ```
````

</details>

**依据 2 · 作者声明**：[dsh/README.md:56-77](https://github.com/Vladimir-Human/ru-marketplace-mcp/blob/416b065d03c971be86d982ccb5a6a1855069f09d/dsh/README.md#L56-L77)

启用配置

<details>
<summary>查看原文（22行）</summary>

````text
3. Set the gate/path variable so the profile can find the clone and restart the
   profile. On Windows PowerShell:

   ```powershell
   $env:RU_MARKETPLACE_MCP_DIR = "C:\path\to\ru-marketplace-mcp"
   ```

   On POSIX shells:

   ```console
   export RU_MARKETPLACE_MCP_DIR=/path/to/ru-marketplace-mcp
   ```

   With only `RU_MARKETPLACE_MCP_DIR` set, the recommended compare mode
   activates: `compare_prices`, `compare_sources`, `compare_verify_offer`, and
   `compare_browser_snapshot` (under the client's `rumarket` namespace).

## Middle profile and native vision

Set `RU_MARKETPLACE_MCP_DECISION=1` to add `decision_inspect` without mounting
every source tool. If both decision and full flags are set, full wins. Only one
MCP row is active: full, otherwise decision, otherwise compare.
````

</details>

**依据 3 · 作者声明**：[dsh/README.md:103-111](https://github.com/Vladimir-Human/ru-marketplace-mcp/blob/416b065d03c971be86d982ccb5a6a1855069f09d/dsh/README.md#L103-L111)

退出

````text
## Uninstall

Remove the bundle from the profile and restart it:

```console
dsh plugin --profile web remove ru-marketplace-mcp-dsh
```

No MCP process survives profile restart without `RU_MARKETPLACE_MCP_DIR`.
````

#### 缺口

- 未安装
  **影响**：无法确认实际维护成本
  **进一步探讨**：在临时 profile 验证启动和卸载

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 按任务单独挂载会不会更省？

**研究主题**：新假设与验证

#### 完整回答

对照日常常驻 compare 与专用 profile 按需启用，比较普通请求的输入计量和比价任务的等待、成功。若切换时间超过上下文减少带来的收益，放弃按需切换。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/cordis.patch.yml:19-32](https://github.com/Vladimir-Human/ru-marketplace-mcp/blob/416b065d03c971be86d982ccb5a6a1855069f09d/dsh/cordis.patch.yml#L19-L32)

最小模式的启动入口

<details>
<summary>查看原文（14行）</summary>

```text
    - id: ru-marketplace-compare
      name: '@deepseek-ai/dsh-mcp-client'
      disabled: !!js "!process.env.RU_MARKETPLACE_MCP_DIR || !!process.env.RU_MARKETPLACE_MCP_FULL || !!process.env.RU_MARKETPLACE_MCP_DECISION"
      config:
        serverName: rumarket
        transport: stdio
        command: uv
        args:
          - run
          - --frozen
          - --directory
          - !!js "process.env.RU_MARKETPLACE_MCP_DIR || '.'"
          - compare-mcp
        failOnStartupError: false
```

</details>

**依据 2 · 作者声明**：[dsh/README.md:7-21](https://github.com/Vladimir-Human/ru-marketplace-mcp/blob/416b065d03c971be86d982ccb5a6a1855069f09d/dsh/README.md#L7-L21)

上下文估算背景

<details>
<summary>查看原文（15行）</summary>

```text
## Why off by default

An MCP row that is always mounted is paid on **every request**, because the
harness registers the schema of every tool in the session context. Estimated
from each server's `tools/list` by `scripts/gen_tools_doc.py` (the estimate
`scripts/mcp_wire.py` uses; CI fails when this table is stale, details in
[docs/TOOLS.md](../docs/TOOLS.md)):

<!-- tools-cost-dsh:start -->
| Mode | Cost while mounted | Model-facing tools |
|---|---|---|
| Skills only (default) | 15 skill catalog entries; no MCP schemas | 0 |
| `compare-mcp` (recommended) | ~1.7k tokens per request | 4 |
| `decision-mcp` (shortlist inspection) | ~2.0k tokens per request | 5 |
| `marketplace-mcp` (full) | ~13.1k tokens per request | 39 |
```

</details>

#### 缺口

- 缺代表负载
  **影响**：收益未知
  **进一步探讨**：固定模型和任务测量两种用法

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
