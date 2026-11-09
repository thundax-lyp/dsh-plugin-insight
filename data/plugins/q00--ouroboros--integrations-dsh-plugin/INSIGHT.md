# dsh-ouroboros

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[592c667](https://github.com/Q00/ouroboros/tree/592c667f076c3dad7ef68d7844e91480d80135d0/integrations/dsh-plugin)

<!-- BEGIN META -->
[![GitHub ★ 6,332](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6%2C332&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Q00/ouroboros)
<!-- END META -->

> **功能**：把 Ouroboros 的规格访谈、执行和评估工具接入 DeepSeek Harness 对话的配置包。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示子包将常用 stdio 连接和默认设置打包，降低多 profile 重复配置；工作流机制由根服务提供。

> **主要限制**：[Q02](#research-q02) 的 uvx 参数没有锁定 Ouroboros 版本，[Q03](#research-q03) 的工具就绪也不检查独立 DSH 模型后端。因此不能从固定配置包推断实际版本或首调成功。

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
  - [Q01 · 安装子包相比手写 MCP 或调用 CLI 省什么？](#detail-section-11)
  - [Q02 · 固定包怎样启动服务并呈现工具？](#detail-section-12)
  - [Q03 · 宿主执行和 DSH 访谈后端为何是两条路径？](#detail-section-13)
  - [Q04 · 低成本试用及退出需查什么？](#detail-section-14)
  - [Q05 · 明确版本和后端诊断是否减少首调失败？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 DSH 和规格工作流需求的开发者，可在一个 profile 挂载 Ouroboros 工具，避免重复写 MCP 启动配置。

手写相同 MCP 行或在终端用固定的 Ouroboros CLI。后者有明确版本和调用过程，需自行连接会话记录。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| MCP 挂载 | 在现有 DSH 对话访问 Ouroboros 工具 | 依赖宿主 MCP 与 uvx，实际工具随引擎版本 |
| 后端配置透传 | 选择模型和执行路径 | 选择 DSH 模型后端还需独立 ACP 子进程 |
| 软失败 | 外部服务启动失败时保留宿主入口 | 恢复可能需要重载 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 支持 bundle 的 DSH profile | 必需 | 挂载 MCP 客户端 | 无法显示工具 |
| uvx 和 Python 3.12 或更新 | 启动服务需要 | 解析并运行引擎 | DSH 可启动但此服务可能缺席 |
| 模型和凭据 | 对应流程必需 | 访谈与模型任务 | 工具可列出但调用可失败 |
| 可信绝对 composition 和 ACP 程序 | 选择 DSH 模型后端时 | 启动独立 ACP 子进程 | 调用报配置或启动错误 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 开发者固定引擎并检查 profile 和凭据 | 实际版本与启动对象可定位 |
| 核对 | 开发者查看工具列表并发一条公开访谈 | 看到真实工具回执及预期规格信息 |
| 退出 | 失败时暂停、修复后手动重载或回 CLI | 核对在途任务和文件变化 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 包、Python 和工具环境资源 | 检查引擎版本及后端 | 耗时未知 |
| 持续使用 | 模型、执行与任务资源 | 复核规格和工具状态 | 合格任务成本未知 |
| 恢复与退出 | 重试及已启动任务的资源 | 区分首调、挂载和执行问题 | 不能假定重连或副作用回滚 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| MCP 配置复用 | 固定声明启动与凭据范围 | 目标宿主兼容和实测节时 |
| 规格流程接入 | 根服务有对应后端及分派入口 | 当前实际下载版本和任务成功 |

> **思考**：[Q02](#research-q02) 的 uvx 参数没有锁定 Ouroboros 版本，[Q03](#research-q03) 的工具就绪也不检查独立 DSH 模型后端。因此不能从固定配置包推断实际版本或首调成功。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示子包将常用 stdio 连接和默认设置打包，降低多 profile 重复配置；工作流机制由根服务提供。

[Q02](#research-q02) 的软启动错误将挂载失败与宿主启动区分，[Q03](#research-q03) 的双向集成仍需分别验证路径、凭据和宿主分派。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 的 uvx 参数没有锁定 Ouroboros 版本，[Q03](#research-q03) 的工具就绪也不检查独立 DSH 模型后端。因此不能从固定配置包推断实际版本或首调成功。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先对公开样例验证一条访谈，核对实际包和后端后再考虑执行任务。启动或首调失败时回到已核实 CLI，再对账可能在途的工作。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定配置足以说明 MCP 挂载方式。真实宿主、下载结果和首调未经验证。版本与后端诊断属于假设。

- 已检查：作者 README、包清单、源码路径 integrations/dsh-plugin/package.json、integrations/dsh-plugin/cordis.patch.yml、integrations/dsh-plugin/README.md、src/ouroboros/mcp/tools/execution_handlers.py、src/ouroboros/providers/factory.py、src/ouroboros/providers/dsh_llm_adapter.py、src/ouroboros/providers/dsh_acp_client.py、pyproject.toml 及固定范围 inventory；组件：integrations/dsh-plugin。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定配置子包与直接依赖的同仓后端接口。未运行 DSH、uvx、MCP 服务或模型，也未复核宿主当前安装与重连行为。
- 下一步：固定宿主和 Python 引擎，依次核对配置合成、工具列表、首个模型请求与宿主分派回执。

**分析版本**

- **仓库**：[Q00/ouroboros](https://github.com/Q00/ouroboros)
- **版本号**：0.1.0（[固定提交 592c667](https://github.com/Q00/ouroboros/tree/592c667f076c3dad7ef68d7844e91480d80135d0)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出将实际解析版本和最小后端检查单独显示，验证是否能减少工具可见却无法工作的情况。

固定宿主和 Python 引擎，依次核对配置合成、工具列表、首个模型请求与宿主分派回执。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 128 | — | — | 954 |

</details>

**活跃度**

[![Issue 未关闭 70](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=70&color=737b86&logo=github)](https://github.com/Q00/ouroboros/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 82](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=82&color=737b86&logo=github)](https://github.com/Q00/ouroboros/issues?q=is%3Aissue+created%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z) [![近30天关闭 80](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=80&color=737b86&logo=github)](https://github.com/Q00/ouroboros/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z)



统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：已在 DSH 中工作的开发者能否借配置子包接入可复核的 Ouroboros 规格工具，并能明确配置、工具就绪和真实执行的差别？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 安装子包相比手写 MCP 或调用 CLI 省什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已有 DSH profile 和 Ouroboros 使用需求的开发者，可以用一个 bundle 挂载命名的 MCP 工具。相比每个 profile 手写服务启动、参数和凭据映射，子包集中提供可复用的默认配置；相比另开终端 CLI，作者希望在同一对话发起访谈和规格流程。包清单仅打包补丁和说明，访谈、执行与评估均由上游服务实现。合格结果应看到真实工具列表并完成一次访谈或规格保存，聊天里的命令文字和工具名称不能替代该回执。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh-plugin/package.json:19-27](https://github.com/Q00/ouroboros/blob/592c667f076c3dad7ef68d7844e91480d80135d0/integrations/dsh-plugin/package.json#L19-L27)

包仅携带补丁与 README，明确 DSH bundle。

```text
  "files": [
    "cordis.patch.yml",
    "README.md"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  }
```

**依据 2 · 源码核查**：[integrations/dsh-plugin/cordis.patch.yml:43-57](https://github.com/Q00/ouroboros/blob/592c667f076c3dad7ef68d7844e91480d80135d0/integrations/dsh-plugin/cordis.patch.yml#L43-L57)

复用 DSH MCP 客户端启动命名 stdio 服务。

<details>
<summary>查看原文（15行）</summary>

```text
- insert:
    - id: mcp-ouroboros
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: ouroboros
        transport: stdio
        command: uvx
        args:
          - --from
          - 'ouroboros-ai[mcp]'
          - --with
          - 'mcp==2.3.0'
          - ouroboros
          - mcp
          - serve
```

</details>

**依据 3 · 作者声明**：[integrations/dsh-plugin/README.md:3-12](https://github.com/Q00/ouroboros/blob/592c667f076c3dad7ef68d7844e91480d80135d0/integrations/dsh-plugin/README.md#L3-L12)

作者描述对话里的调用方式，明确配置包边界。

<details>
<summary>查看原文（10行）</summary>

```text
Mount [Ouroboros](https://github.com/Q00/ouroboros) — a spec-first AI dev
workflow engine (Socratic interview → Seed spec → execute → evaluate → evolve)
— into [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) as
native tools. Once installed, type `ooo interview <goal>` or `ooo auto <goal>`
directly in the dsh chat — the model finds and calls the matching
`mcp__ouroboros__*` tool on its own.

This is a **config-only bundle**: it contains no custom plugin code, just one
row that mounts dsh's existing `@deepseek-ai/dsh-mcp-client` against
`ouroboros mcp serve`.
```

</details>

#### 缺口

- 未对照手工 MCP 与 bundle 的接入耗时，也未测模型是否选中对应工具。
  **影响**：不能确认自然语言触发的稳定性。
  **进一步探讨**：固定相同宿主、服务和访谈输入，记录配置及实际工具调用。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 固定包怎样启动服务并呈现工具？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

补丁把 @deepseek-ai/dsh-mcp-client 插入 profile，启动 uvx，以 ouroboros-ai[mcp] 环境执行 ouroboros mcp serve。mcp==2.3.0 有显式限制，Ouroboros 本身的参数未给版本，因此固定 Git 提交只固定启动意图，运行的 Python 发布版本仍由 uvx 解析。配置明确转发两个模型 Key 与相关后端设置，并为工具请求给 30 分钟上限；启动错误设为非致命。宿主若能继续启动，也可能没有此服务的工具。实际支持工具以运行时列表为准，README 列举数量和自然语言触发属于作者说明。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh-plugin/cordis.patch.yml:43-57](https://github.com/Q00/ouroboros/blob/592c667f076c3dad7ef68d7844e91480d80135d0/integrations/dsh-plugin/cordis.patch.yml#L43-L57)

真实命令和参数，MCP 固定而根包版本未锁。

<details>
<summary>查看原文（15行）</summary>

```text
- insert:
    - id: mcp-ouroboros
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: ouroboros
        transport: stdio
        command: uvx
        args:
          - --from
          - 'ouroboros-ai[mcp]'
          - --with
          - 'mcp==2.3.0'
          - ouroboros
          - mcp
          - serve
```

</details>

**依据 2 · 源码核查**：[integrations/dsh-plugin/cordis.patch.yml:80-97](https://github.com/Q00/ouroboros/blob/592c667f076c3dad7ef68d7844e91480d80135d0/integrations/dsh-plugin/cordis.patch.yml#L80-L97)

转发环境、工具时限和软失败。

<details>
<summary>查看原文（18行）</summary>

```text
        env:
          OUROBOROS_LLM_BACKEND: !!js process.env.OUROBOROS_LLM_BACKEND ?? ''
          OUROBOROS_AGENT_RUNTIME: !!js process.env.OUROBOROS_AGENT_RUNTIME || 'host'
          OUROBOROS_DSH_CONFIG_PATH: !!js process.env.OUROBOROS_DSH_CONFIG_PATH ?? ''
          OUROBOROS_DSH_CLI_PATH: !!js process.env.OUROBOROS_DSH_CLI_PATH ?? ''
          ANTHROPIC_API_KEY: !!js process.env.ANTHROPIC_API_KEY ?? ''
          DEEPSEEK_API_KEY: !!js process.env.DEEPSEEK_API_KEY ?? ''
        # ouroboros_auto runs a full interview -> Seed -> execute -> grade
        # pipeline synchronously when called without polling; give it real
        # headroom instead of dsh's 60s mcp-client default.
        toolCallTimeoutMs: 1800000
        # Soft-fail: a machine without `uv`/Ouroboros configured yet should
        # still boot dsh with every other plugin working, not crash outright.
        # Recovery is not guaranteed to be automatic — whether mcp-client
        # retries at all depends on the dsh build (the published rc has no
        # reconnect loop), and where it exists the attempt budget is bounded.
        # After fixing the cause, reload the plugin or restart dsh.
        failOnStartupError: false
```

</details>

**依据 3 · 作者声明**：[integrations/dsh-plugin/README.md:118-124](https://github.com/Q00/ouroboros/blob/592c667f076c3dad7ef68d7844e91480d80135d0/integrations/dsh-plugin/README.md#L118-L124)

作者给出命名空间和工具数量，没有本轮运行证明。

```text
## What you get

36 tools under the `ouroboros` namespace — `mcp__ouroboros__ouroboros_interview`,
`mcp__ouroboros__ouroboros_auto`, `mcp__ouroboros__ouroboros_evaluate`,
`mcp__ouroboros__ouroboros_ralph`, and more. Each carries its own description,
so a plain `ooo interview: <vague idea>` or `ooo auto: <goal>` in chat is
enough — no extra prompting required.
```

#### 缺口

- 未运行 uvx 解析、目标宿主或 tools/list。
  **影响**：不能从固定包推定真实工具版本或启动成功。
  **进一步探讨**：在隔离 profile 固定引擎版本并记录包解析和工具清单。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 宿主执行和 DSH 访谈后端为何是两条路径？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

bundle 默认 OUROBOROS_AGENT_RUNTIME=host，意味着根引擎将执行交给调用方宿主。固定根代码明确拒绝不带任务跟踪的直接执行形式，要求可观察并回应挂起分派的路径。OUROBOROS_LLM_BACKEND=dsh 则是访谈等模型调用后端，它通过工厂构造独立 DshAcpClient，要求绝对 composition 路径并据此调用 dsh-acp-demo，而不是利用已经打开的宿主模型进程。路径为绝对只防止相对项目目录解析，是否可信仍需操作者核对。根引擎对该子进程保留多数已有环境，不能把 bundle 的显式 Key 列表延伸成对所有后续进程的最小权限保证。服务列工具成功，仍可能在首个后端调用或宿主分派阶段失败。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh-plugin/cordis.patch.yml:80-86](https://github.com/Q00/ouroboros/blob/592c667f076c3dad7ef68d7844e91480d80135d0/integrations/dsh-plugin/cordis.patch.yml#L80-L86)

两个设置分别控制执行 runtime 和模型后端。

```text
        env:
          OUROBOROS_LLM_BACKEND: !!js process.env.OUROBOROS_LLM_BACKEND ?? ''
          OUROBOROS_AGENT_RUNTIME: !!js process.env.OUROBOROS_AGENT_RUNTIME || 'host'
          OUROBOROS_DSH_CONFIG_PATH: !!js process.env.OUROBOROS_DSH_CONFIG_PATH ?? ''
          OUROBOROS_DSH_CLI_PATH: !!js process.env.OUROBOROS_DSH_CLI_PATH ?? ''
          ANTHROPIC_API_KEY: !!js process.env.ANTHROPIC_API_KEY ?? ''
          DEEPSEEK_API_KEY: !!js process.env.DEEPSEEK_API_KEY ?? ''
```

**依据 2 · 源码核查**：[src/ouroboros/mcp/tools/execution_handlers.py:1218-1234](https://github.com/Q00/ouroboros/blob/592c667f076c3dad7ef68d7844e91480d80135d0/src/ouroboros/mcp/tools/execution_handlers.py#L1218-L1234)

固定根服务要求 host 执行通过可跟踪任务入口。

<details>
<summary>查看原文（17行）</summary>

```text
            from ouroboros.orchestrator.runtime_factory import resolve_agent_runtime_backend

            try:
                resolved_runtime_backend = resolve_agent_runtime_backend(self.agent_runtime_backend)
            except Exception:
                resolved_runtime_backend = None
            if resolved_runtime_backend == "host":
                return Result.err(
                    launch_error(
                        "launch_rejected",
                        "The 'host' agent runtime dispatches execution to the "
                        "calling MCP host and requires job tracking so "
                        "job_wait/job_status can surface pending_host_dispatches. "
                        "Use ouroboros_start_execute_seed (ooo run) instead of "
                        "ouroboros_execute_seed.",
                    )
                )
```

</details>

**依据 3 · 源码核查**：[src/ouroboros/providers/factory.py:297-307](https://github.com/Q00/ouroboros/blob/592c667f076c3dad7ef68d7844e91480d80135d0/src/ouroboros/providers/factory.py#L297-L307)

dsh 后端读取配置并创建独立 adapter。

<details>
<summary>查看原文（11行）</summary>

```text
def _create_dsh_adapter(request: _LLMAdapterRequest) -> LLMAdapter:
    from ouroboros.config import get_dsh_cli_path, get_dsh_config_path
    from ouroboros.providers.dsh_llm_adapter import DshLLMAdapter

    return DshLLMAdapter(
        cli_path=request.cli_path or get_dsh_cli_path(),
        cwd=request.cwd,
        config_path=get_dsh_config_path(),
        timeout=request.timeout,
        io_recorder=request.io_recorder,
    )
```

</details>

**依据 4 · 源码核查**：[src/ouroboros/providers/dsh_llm_adapter.py:146-152](https://github.com/Q00/ouroboros/blob/592c667f076c3dad7ef68d7844e91480d80135d0/src/ouroboros/providers/dsh_llm_adapter.py#L146-L152)

模型调用创建 ACP client。

```text
        client = DshAcpClient(
            cli_path=self._cli_path,
            cwd=self._cwd,
            config_path=self._config_path,
            startup_timeout=self._startup_timeout,
            turn_timeout=self._timeout,
        )
```

**依据 5 · 源码核查**：[src/ouroboros/providers/dsh_acp_client.py:95-123](https://github.com/Q00/ouroboros/blob/592c667f076c3dad7ef68d7844e91480d80135d0/src/ouroboros/providers/dsh_acp_client.py#L95-L123)

子进程环境与绝对配置路径校验。

<details>
<summary>查看原文（29行）</summary>

```text
    def _build_env(self) -> dict[str, str]:
        env = os.environ.copy()
        # The dsh process must not inherit Ouroboros runtime/backend selectors
        # (they would confuse a nested ``ooo`` invocation inside the child).
        # Everything else passes through — dsh reads DEEPSEEK_API_KEY (or the
        # credentials its composition names) from the environment.
        for key in (
            "OUROBOROS_AGENT_RUNTIME",
            "OUROBOROS_LLM_BACKEND",
            "OUROBOROS_RUNTIME",
            "OUROCODE_MODEL",
        ):
            env.pop(key, None)
        return env

    def _spawn_argv(self) -> list[str]:
        if self._config_path is None:
            raise AcpClientError(
                "dsh requires an explicit trusted Cordis composition path; "
                "set OUROBOROS_DSH_CONFIG_PATH",
                error_type="invalid_config",
            )
        if not Path(self._config_path).is_absolute():
            raise AcpClientError(
                "dsh config_path must be an absolute trusted path; relative paths "
                "could resolve against the untrusted project cwd",
                error_type="invalid_config",
            )
        return [self._cli_path, "--config", self._config_path]
```

</details>

**依据 6 · 作者声明**：[integrations/dsh-plugin/README.md:59-82](https://github.com/Q00/ouroboros/blob/592c667f076c3dad7ef68d7844e91480d80135d0/integrations/dsh-plugin/README.md#L59-L82)

作者说明工具列表与首调失败的差别。

<details>
<summary>查看原文（24行）</summary>

```text
### Routing interview/Seed/QA back through DeepSeek Harness

`OUROBOROS_LLM_BACKEND=dsh` is not a one-variable switch, and it does not reuse
the dsh process you're already running. Ouroboros spawns **its own**
`dsh-acp-demo` ACP child, and that child fails closed with `invalid_config`
unless it is given a composition to load. To use it:

1. Build DeepSeek Harness from source (`pnpm install && pnpm run build`,
   Node.js >= 22) and make its `dsh-acp-demo` bin reachable — on `PATH`, or
   named by `OUROBOROS_DSH_CLI_PATH`. A source build is the working path today:
   installing the published `@deepseek-ai/dsh-acp-demo` still fails on a
   peer-dependency conflict inside its own `dsh-tool-bash` chain.
2. Point `OUROBOROS_DSH_CONFIG_PATH` at an **absolute** composition file.
   Relative paths are rejected on purpose (they would resolve against the
   untrusted project cwd). The file must sit where dsh's `node_modules` (or
   workspace) is reachable: plugin package names in a composition resolve
   relative to the composition file's own directory.
3. Provide whatever credential that composition names — `DEEPSEEK_API_KEY` for
   DeepSeek's own models. See the credentials note below: it must be present in
   the dsh host environment, and this bundle forwards it explicitly.

Without steps 1–2 the Ouroboros tools still register and list fine; the first
interview/Seed/QA call is what fails. Everything except the `dsh` backend works
without them.
```

</details>

#### 缺口

- 未验证宿主执行分派、当前 DSH 发布包可用性或模型授权。
  **影响**：不能确认组合通路能执行完整流程。
  **进一步探讨**：分别验证工具列表、首个模型调用与一次最小宿主分派，失败分开记录。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 低成本试用及退出需查什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需能应用 bundle 的 DSH profile、PATH 中的 uvx、可取得的 Python 3.12 及 Ouroboros 环境。任务还需实际使用的模型配置和授权，选择 DSH 模型后端时要另备可信 composition 与 ACP 程序。首次需要准备包和环境，持续有模型调用与人工规格核对，失败后要区分未挂载、后端失败及已分派但未获结果。恢复是否自动取决于宿主版本，固定子包只声明软启动失败。先在隔离 profile 用公开样例做一次访谈，核对后端版本和输入去向，遇到工具缺失、首调配置错误或执行悬挂则停自动路径，修复后手动重载或用已核实 CLI，核对可能已发生的文件或服务动作。

#### 证据与依据

**依据 1 · 作者声明**：[integrations/dsh-plugin/README.md:14-24](https://github.com/Q00/ouroboros/blob/592c667f076c3dad7ef68d7844e91480d80135d0/integrations/dsh-plugin/README.md#L14-L24)

作者说明 uv、Python 和宿主执行选择。

<details>
<summary>查看原文（11行）</summary>

```text
## Requirements

- [`uv`](https://astral.sh/uv) on `PATH`. Nothing else — `uvx` fetches and
  runs Ouroboros in an isolated environment on first launch, no `pip install`
  step.
- Python >= 3.12 (whatever `uv` resolves).
- Nothing else for execution: this bundle defaults `OUROBOROS_AGENT_RUNTIME`
  to `host`, so dsh's own model does `ooo run`/`ooo auto`'s execution step —
  no CLI to install. Set `OUROBOROS_AGENT_RUNTIME` (see below) to an
  executable runtime (`claude-cli`, `codex`, `opencode`, ...) if you'd rather
  have that CLI do the work instead.
```

</details>

**依据 2 · 作者声明**：[integrations/dsh-plugin/README.md:105-116](https://github.com/Q00/ouroboros/blob/592c667f076c3dad7ef68d7844e91480d80135d0/integrations/dsh-plugin/README.md#L105-L116)

作者明确重连取决于宿主及修复后重载。

<details>
<summary>查看原文（12行）</summary>

```text
## Startup failures and recovery

Connection failures are non-fatal (`failOnStartupError: false`): a machine
without `uv` on `PATH` yet still boots dsh normally, just without the Ouroboros
tools, and every other plugin keeps working.

Recovery is not automatic in general. Whether `mcp-client` retries at all
depends on your dsh build — the published `0.0.1-rc.1` has no reconnect loop,
current `main` has one with bounded exponential backoff that gives up after a
capped number of consecutive failures. Either way, after fixing the cause
(installing `uv`, setting a runtime), reload the plugin or restart dsh rather
than waiting for a reconnect.
```

</details>

**依据 3 · 源码核查**：[integrations/dsh-plugin/cordis.patch.yml:87-97](https://github.com/Q00/ouroboros/blob/592c667f076c3dad7ef68d7844e91480d80135d0/integrations/dsh-plugin/cordis.patch.yml#L87-L97)

固定超时和软失败配置。

<details>
<summary>查看原文（11行）</summary>

```text
        # ouroboros_auto runs a full interview -> Seed -> execute -> grade
        # pipeline synchronously when called without polling; give it real
        # headroom instead of dsh's 60s mcp-client default.
        toolCallTimeoutMs: 1800000
        # Soft-fail: a machine without `uv`/Ouroboros configured yet should
        # still boot dsh with every other plugin working, not crash outright.
        # Recovery is not guaranteed to be automatic — whether mcp-client
        # retries at all depends on the dsh build (the published rc has no
        # reconnect loop), and where it exists the attempt budget is bounded.
        # After fixing the cause, reload the plugin or restart dsh.
        failOnStartupError: false
```

</details>

**依据 4 · 源码核查**：[pyproject.toml:1-9](https://github.com/Q00/ouroboros/blob/592c667f076c3dad7ef68d7844e91480d80135d0/pyproject.toml#L1-L9)

固定根 Python 包及工具链要求。

```text
[project]
name = "ouroboros-ai"
dynamic = ["version"]
description = "Pins an acceptance spec and omits any verify command or expected output from the worker's contract. Works with Claude Code, Codex CLI, OpenCode and 10 more runtimes."
readme = "README.md"
authors = [
    { name = "Q00", email = "jqyu.lee@gmail.com" }
]
requires-python = ">=3.12"
```

#### 缺口

- 没有真实打包、宿主重载、账单及执行中断记录。
  **影响**：不能以只写配置推断全流程成本较低。
  **进一步探讨**：记录实际 Python、引擎和宿主版本，测试首调失败、修复和一次安全退出。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 明确版本和后端诊断是否减少首调失败？

**研究主题**：新假设与验证

#### 完整回答

当前文档已经说明引擎动态解析和部分后端错误，用户也可覆盖包参数。可试验在工具就绪后另外显示实际解析版本与后端预检结果，只读检查二进制和配置是否存在，并单独列出尚未验证的凭据或推理。以相同宿主分别使用现有文档与此提示，注入缺 uv、配置相对路径和无法调用模型，记录判断准确率、首个有效访谈时间与是否暴露敏感字段。若提示常误判可用、增加耗时而不减少首调失败，或需要显示凭据才能解释，则否定该方案。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh-plugin/cordis.patch.yml:49-57](https://github.com/Q00/ouroboros/blob/592c667f076c3dad7ef68d7844e91480d80135d0/integrations/dsh-plugin/cordis.patch.yml#L49-L57)

启动参数能固定部分依赖，根版本默认开放。

```text
        command: uvx
        args:
          - --from
          - 'ouroboros-ai[mcp]'
          - --with
          - 'mcp==2.3.0'
          - ouroboros
          - mcp
          - serve
```

**依据 2 · 源码核查**：[src/ouroboros/providers/dsh_acp_client.py:110-123](https://github.com/Q00/ouroboros/blob/592c667f076c3dad7ef68d7844e91480d80135d0/src/ouroboros/providers/dsh_acp_client.py#L110-L123)

现有错误可区分缺少或相对配置路径。

<details>
<summary>查看原文（14行）</summary>

```text
    def _spawn_argv(self) -> list[str]:
        if self._config_path is None:
            raise AcpClientError(
                "dsh requires an explicit trusted Cordis composition path; "
                "set OUROBOROS_DSH_CONFIG_PATH",
                error_type="invalid_config",
            )
        if not Path(self._config_path).is_absolute():
            raise AcpClientError(
                "dsh config_path must be an absolute trusted path; relative paths "
                "could resolve against the untrusted project cwd",
                error_type="invalid_config",
            )
        return [self._cli_path, "--config", self._config_path]
```

</details>

**依据 3 · 作者声明**：[integrations/dsh-plugin/README.md:80-82](https://github.com/Q00/ouroboros/blob/592c667f076c3dad7ef68d7844e91480d80135d0/integrations/dsh-plugin/README.md#L80-L82)

作者已区分工具列表和首调。

```text
Without steps 1–2 the Ouroboros tools still register and list fine; the first
interview/Seed/QA call is what fails. Everything except the `dsh` backend works
without them.
```

#### 缺口

- 未证实宿主可提供实际 uvx 版本，也没有可接受的低泄露诊断设计。
  **影响**：当前不能把设想当功能。
  **进一步探讨**：比较安全预检和现有故障提示，统计实际错误与假就绪。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
