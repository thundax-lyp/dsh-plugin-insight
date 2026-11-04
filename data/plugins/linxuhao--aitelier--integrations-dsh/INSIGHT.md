# dsh-plugin-aitelier

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[f1a1413](https://github.com/linxuhao/AItelier/tree/f1a1413c7fc9f9b4381589ccfcc361e18e0fb7de/integrations/dsh)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/linxuhao/AItelier) [![npm 30d 882](https://img.shields.io/static/v1?label=npm+30d&message=882&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-aitelier) [![最新发布 2026-09-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-aitelier)
<!-- END META -->

> **功能**：将 AItelier 的 MCP 流水线接口接入 DeepSeek Harness。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 提供预设接线与流程指南；流水线执行本身属于后端。

> **主要限制**：[Q03](#research-q03) 后端未启用 Cloudflare Access gate 时直接放过写入，不能无条件把无 token 当只读。

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
  - [Q01 · 该 DSH 集成对 AItelier 用户提供什么，相对直接 MCP 接入有什么增量？](#detail-section-11)
  - [Q02 · 配置如何连接后端，失败和长等待有什么边界？](#detail-section-12)
  - [Q03 · 无 token 的连接是否必然只读？](#detail-section-13)
  - [Q04 · 部署、操作和恢复的成本由谁承担？](#detail-section-14)
  - [Q05 · 如何减少工具静默缺席和授权误判？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：使用 DSH 且已有 AItelier 后端的操作者，希望从会话中操作或观察流水线。

直接手动配置 DSH MCP client，并自行参考后端接口文档。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| MCP 配置 | 连接 AItelier | 后端和 DSH 版本单独依赖 |
| 操作指南 | 指导状态、证据和任务检查 | 不能自动验证工具存在 |
| 凭据 header | 向后端提供身份 | 无法单独强制后端 gate |

**流程与依赖**

| 依赖 | 条件 | 用途 | 缺失影响 |
|---|---|---|---|
| DSH 与兼容 mcp-client | 必需 | 挂载 MCP 工具 | 不能使用工具 |
| AItelier 服务与模型 | 执行需要 | 流水线与生成 | 后端不可达或任务失败 |
| 授权配置与凭据 | 按部署需要 | 限制写和私有读取 | gate 关闭可能放行 |
| 存储、日志与备份 | 持续运营需要 | 状态和恢复 | 错误或丢失难以恢复 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
|---|---|---|
| 准备 | 维护者隔离后端并核查实际授权 | 无法确认则停止 |
| 连接 | 配置 DSH profile 与可信 URL | 核对握手及工具列表 |
| 操作 | 用户核对读写权限后启动任务 | 等待超时先查后台状态 |
| 恢复 | 停止或检查运行并恢复备份 | 不确定时暂停写入 |

**效果与成本**

| 阶段 | 资源 | 人工 | 未知 |
|---|---|---|---|
| 首次 | 宿主、服务、凭据 | 配置和授权审查 | 兼容未知 |
| 持续 | 容器与模型调用 | 检查任务、checkpoint 和数据 | 费用未知 |
| 恢复 | 后端状态及备份 | 诊断超时与未完成任务 | 恢复未测 |

| 结果 | 依据 | 未知 |
|---|---|---|
| 客户端预设 | patch 行与变量 | 实际加载和省时 |
| 工作流指南 | 随包 Skill 文本 | 用户遵循与任务质量 |
| 后端授权 | gate 与工具分类 | 实际部署网络保护 |

> **思考**：[Q03](#research-q03) 后端未启用 Cloudflare Access gate 时直接放过写入，不能无条件把无 token 当只读。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 提供预设接线与流程指南；流水线执行本身属于后端。

[Q02](#research-q02) 把连接和超时作为配置；[Q03](#research-q03) 静态认证依赖后端实际 gate。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 后端未启用 Cloudflare Access gate 时直接放过写入，不能无条件把无 token 当只读。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先隔离后端并验证 gate、凭据和工具；权限或后台状态不明时停止写入。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

定向检查固定客户端配置和同仓后端授权源码，未执行宿主或网络请求。

- 已检查：作者 README、包清单、源码路径 integrations/dsh/README.md、integrations/dsh/package.json、integrations/dsh/cordis.patch.yml、integrations/dsh/skills/aitelier-pipelines/SKILL.md、api/mcp_router.py、api/authz.py 及固定范围 inventory；组件：integrations/dsh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 DSH patch、配套指南及后端 MCP 授权入口；未审所有后端工具、宿主默认值和网络边界。
- 下一步：在隔离宿主覆盖握手、故障、gate 开关、不同身份与任务取消；本轮未执行。

**分析版本**

- **仓库**：[linxuhao/AItelier](https://github.com/linxuhao/AItelier)
- **版本号**：0.1.9（[固定提交 f1a1413](https://github.com/linxuhao/AItelier/tree/f1a1413c7fc9f9b4381589ccfcc361e18e0fb7de)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设显示握手和实际授权状态能减少诊断误判，需与现有检查对照。

在隔离宿主覆盖握手、故障、gate 开关、不同身份与任务取消；本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 360 | — | — | 4021 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-04），可前往 [GitHub Issues](https://github.com/linxuhao/AItelier/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 DSH MCP bundle 的连接、权限和后端依赖。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 该 DSH 集成对 AItelier 用户提供什么，相对直接 MCP 接入有什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是 DSH Profile Bundle 而非 AItelier 后端本身。它提供一个 MCP 客户端配置和随包使用指南，把单独运行的 AItelier 工具接入 DSH；相比手工添加相同 MCP client，增量是预置端点、凭据引用、超时和具体工作流程说明。后端的 pipeline、State DAG 和模型能力属于 AItelier，不能归功于此 bundle，也不能由声明推断工具实际出现在目标宿主。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh/package.json:1-8](https://github.com/linxuhao/AItelier/blob/f1a1413c7fc9f9b4381589ccfcc361e18e0fb7de/integrations/dsh/package.json#L1-L8)

包描述及仅客户端定位。

```text
{
  "name": "dsh-plugin-aitelier",
  "version": "0.1.9",
  "description": "Use AItelier as a subagent from DeepSeek Harness: generate, edit, run, export and import SkillFlow pipelines. Client only \u2014 requires a running AItelier backend (Docker; see README).",
  "keywords": [
    "aitelier",
    "dsh-plugin",
    "dsh-skill",
```

**依据 2 · 作者声明**：[integrations/dsh/README.md:1-7](https://github.com/linxuhao/AItelier/blob/f1a1413c7fc9f9b4381589ccfcc361e18e0fb7de/integrations/dsh/README.md#L1-L7)

作者的 Profile Bundle 描述。

```text
# dsh-plugin-aitelier

Use **AItelier** as a subagent from [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness): design a pipeline, edit its graph / roles / prompts / tools, run it, and carry it to another machine.

The plugin is a Profile Bundle that mounts one `@deepseek-ai/dsh-mcp-client` row against AItelier's MCP endpoint. The model then sees the surface as native tools under `mcp__aitelier__*`.

Compatibility: the patch assumes `dsh-mcp-client`'s config shape as of dsh **0.1.0-rc.2** (`serverName`/`transport`/`url`/`headers`/`toolCallTimeoutMs`); every dsh release through 0.1.2-alpha.1 keeps it. This is deliberately **not** a `peerDependencies` entry: the plugin has no code and imports nothing — dsh resolves the `mcp-client` name from its own installation — and a declared peer would invite pnpm's `auto-install-peers` to pull a second, registry-sourced copy of `dsh-mcp-client` into the profile, which dsh's profile-first module resolution would then shadow the installation's instance with.
```

**依据 3 · 源码核查**：[integrations/dsh/cordis.patch.yml:24-41](https://github.com/linxuhao/AItelier/blob/f1a1413c7fc9f9b4381589ccfcc361e18e0fb7de/integrations/dsh/cordis.patch.yml#L24-L41)

固定客户端、端点及凭据。

<details>
<summary>查看原文（18行）</summary>

```text
- insert:
    - id: mcp-aitelier
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: aitelier
        transport: streamable-http
        url: !!js process.env.AITELIER_MCP_URL || 'http://127.0.0.1:4444/mcp'
        headers:
          X-AItelier-Admin-Token: !!js process.env.AITELIER_ADMIN_TOKEN || ''
          X-AItelier-Driver-Token: !!js process.env.AITELIER_DRIVER_TOKEN || ''
        # An AItelier run is long and pauses for human approval, so `wait_for_run`
        # blocks. dsh-mcp-client's own default is 60s, and a wait longer than the
        # CLIENT's timeout does not wait longer — the client hangs up first and the
        # model sees a transport error instead of "still running", which reads as a
        # broken tool rather than a long job. 10 minutes lets one wait_for_run
        # cover a realistic stretch of a run; every other tool answers in
        # milliseconds, so raising this costs nothing when nothing is wrong.
        toolCallTimeoutMs: !!js Number(process.env.AITELIER_MCP_TIMEOUT_MS || 600000)
```

</details>

**依据 4 · 源码核查**：[integrations/dsh/skills/aitelier-pipelines/SKILL.md:8-22](https://github.com/linxuhao/AItelier/blob/f1a1413c7fc9f9b4381589ccfcc361e18e0fb7de/integrations/dsh/skills/aitelier-pipelines/SKILL.md#L8-L22)

指南要求先读取活契约并区分完成与验收。

<details>
<summary>查看原文（15行）</summary>

```text
## Persistent project State DAG

For project goals and acceptance, first call `state_graph_help` and read its
`driver_guide` field. It is the tool-only fallback for the MCP prompt
`state_graph_driver` and resource `aitelier://state/driver-guide`; use the live
schemas instead of assuming this client bundles the latest server contract.
If State tools are absent, report the backend capability gap; ordinary pipeline
operations can still be used where appropriate.

Use one persistent State project per product. Register workflow or external
attempts before dispatch, retain exact IDs and frozen context, and wait with
`state_graph_read(action="wait_for_state_change", arguments=...)`. Persist
`next_after` with its filter scope. Timeout does not stop a worker; completion
produces a candidate, not acceptance. Record actual evidence for each criterion
before explicit verification. Checkpoint decisions follow existing authorization.
```

</details>

#### 缺口

- 未比较实际用户手工配置与宿主使用
  **影响**：不能量化接入便利及实际工具可用
  **进一步探讨**：对照相同后端手配和 bundle 的发现、失败与配置步骤。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 配置如何连接后端，失败和长等待有什么边界？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

patch 插入 dsh-mcp-client 行，serverName 为 aitelier、transport 为 streamable-http，默认本机 4444 的 /mcp，URL 与两种 token 从环境读取，调用超时默认 600000ms。README 表示宿主默认启动失败不阻断、工具可能静默缺席，但该默认属于外部 DSH 版本行为，本次未核实宿主源码；超时只约束客户端等待，不能证明服务端任务终止，指南明确超时不停止工作者。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh/cordis.patch.yml:24-48](https://github.com/linxuhao/AItelier/blob/f1a1413c7fc9f9b4381589ccfcc361e18e0fb7de/integrations/dsh/cordis.patch.yml#L24-L48)

MCP 客户端接线、超时和默认失败注释。

<details>
<summary>查看原文（25行）</summary>

```text
- insert:
    - id: mcp-aitelier
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: aitelier
        transport: streamable-http
        url: !!js process.env.AITELIER_MCP_URL || 'http://127.0.0.1:4444/mcp'
        headers:
          X-AItelier-Admin-Token: !!js process.env.AITELIER_ADMIN_TOKEN || ''
          X-AItelier-Driver-Token: !!js process.env.AITELIER_DRIVER_TOKEN || ''
        # An AItelier run is long and pauses for human approval, so `wait_for_run`
        # blocks. dsh-mcp-client's own default is 60s, and a wait longer than the
        # CLIENT's timeout does not wait longer — the client hangs up first and the
        # model sees a transport error instead of "still running", which reads as a
        # broken tool rather than a long job. 10 minutes lets one wait_for_run
        # cover a realistic stretch of a run; every other tool answers in
        # milliseconds, so raising this costs nothing when nothing is wrong.
        toolCallTimeoutMs: !!js Number(process.env.AITELIER_MCP_TIMEOUT_MS || 600000)
        # Deliberately left at the default (false): a temporarily-down AItelier
        # must not make `dsh` itself unbootable. The cost is that the failure is
        # SILENT — no mcp__aitelier__* tools appear and nothing says why. That is
        # the first thing the README tells you to check, because an agent facing a
        # missing toolset cannot diagnose it from the inside (verified: it answers
        # "NONE FOUND" and can only guess at the cause).
        # failOnStartupError: false
```

</details>

**依据 2 · 作者声明**：[integrations/dsh/README.md:9-20](https://github.com/linxuhao/AItelier/blob/f1a1413c7fc9f9b4381589ccfcc361e18e0fb7de/integrations/dsh/README.md#L9-L20)

作者的静默失败诊断与独立后端说明。

<details>
<summary>查看原文（12行）</summary>

```text
> ### No `mcp__aitelier__*` tools? Read this first.
>
> A connection failure here is **silent**. `dsh-mcp-client` has `failOnStartupError: false`, so an unreachable endpoint does not stop `dsh` booting — the tools simply never appear, and nothing says why. An agent in that state can only report "no such tools" and guess; it cannot diagnose it from the inside. Check, in order:
>
> 1. **Is AItelier running?** `curl -s localhost:4444/health` should answer `{"status":"ok",…}`. If not, start it — see [Prerequisite](#prerequisite-aitelier-itself).
> 2. **Is the URL right for where `dsh` runs?** The default is `http://127.0.0.1:4444/mcp` (host). Use `http://aitelier:4444/mcp` **only** if `dsh` is itself a container on the same docker network.
> 3. **Does the endpoint answer?** `curl -s -X POST $AITELIER_MCP_URL -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"c","version":"0"}}}'` — a `421` means the Host header is not in AItelier's allow-list (set `AITELIER_MCP_ALLOWED_HOSTS` on the AItelier side).
> 4. **Is the row actually mounted?** `dsh --profile <name> --dump-config | grep -A3 mcp-aitelier`.

## Prerequisite: AItelier itself

This plugin is a *client*. It does not install or start AItelier — you need one running and reachable first. AItelier ships as a container:
```

</details>

**依据 3 · 源码核查**：[integrations/dsh/skills/aitelier-pipelines/SKILL.md:17-22](https://github.com/linxuhao/AItelier/blob/f1a1413c7fc9f9b4381589ccfcc361e18e0fb7de/integrations/dsh/skills/aitelier-pipelines/SKILL.md#L17-L22)

等待与工作者状态边界。

```text
Use one persistent State project per product. Register workflow or external
attempts before dispatch, retain exact IDs and frozen context, and wait with
`state_graph_read(action="wait_for_state_change", arguments=...)`. Persist
`next_after` with its filter scope. Timeout does not stop a worker; completion
produces a candidate, not acceptance. Record actual evidence for each criterion
before explicit verification. Checkpoint decisions follow existing authorization.
```

#### 缺口

- 未运行目标 DSH、容器或 MCP 初始化
  **影响**：无法确认实际配置解析、工具列表及超时效果
  **进一步探讨**：隔离环境按固定宿主版本测试正常、拒绝和断网路径。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 无 token 的连接是否必然只读？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

README 声称普通读取开放、无 token 写操作拒绝。客户端 patch 仅把 token 作为 header 转发，不独立认证；同一固定提交的后端按工具分类检查，普通非私有读取直接放行，写及私有读取在 gate_enabled 为 false 时也直接返回；gate_enabled 由 Cloudflare Access 是否配置决定。因而 README 的无 token 必然只读不能无条件成立，实际效果取决于后端网关、身份及外层暴露配置。未核查所有部署入口与版本，也未运行攻击。

#### 证据与依据

**依据 1 · 作者声明**：[integrations/dsh/README.md:173-179](https://github.com/linxuhao/AItelier/blob/f1a1413c7fc9f9b4381589ccfcc361e18e0fb7de/integrations/dsh/README.md#L173-L179)

作者声明无 token 只读。

```text
## Authorization

Ordinary workflow reads are open. Writes and private State reads require authorization, checked per tool by AItelier itself. This client sends `AITELIER_ADMIN_TOKEN` for direct, off-tunnel connections.

The reason it is per tool rather than per path: MCP posts every call, read or write, to the same URL, so AItelier's normal method-based write gate cannot tell them apart. Exempting the path would have left `edit_pipeline` unauthenticated. See `api/mcp_router.py`.

Without the token, write tools answer `denied: …` and change nothing. That is a legitimate read-only installation.
```

**依据 2 · 源码核查**：[integrations/dsh/cordis.patch.yml:24-33](https://github.com/linxuhao/AItelier/blob/f1a1413c7fc9f9b4381589ccfcc361e18e0fb7de/integrations/dsh/cordis.patch.yml#L24-L33)

客户端仅提供地址和凭据 header。

<details>
<summary>查看原文（10行）</summary>

```text
- insert:
    - id: mcp-aitelier
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: aitelier
        transport: streamable-http
        url: !!js process.env.AITELIER_MCP_URL || 'http://127.0.0.1:4444/mcp'
        headers:
          X-AItelier-Admin-Token: !!js process.env.AITELIER_ADMIN_TOKEN || ''
          X-AItelier-Driver-Token: !!js process.env.AITELIER_DRIVER_TOKEN || ''
```

</details>

**依据 3 · 源码核查**：[api/mcp_router.py:61-69](https://github.com/linxuhao/AItelier/blob/f1a1413c7fc9f9b4381589ccfcc361e18e0fb7de/api/mcp_router.py#L61-L69)

私有读取分类。

```text
# Every tool's authorization class. No default on purpose — see the module
# docstring. `read` answers questions; `write` changes state on disk, in the
# registry, or in the run table.
_TOOL_KIND: dict[str, str] = {}
# State goals/evidence may contain private product plans: reads require a writer.
_PRIVATE_READ_TOOLS = frozenset({
    "state_graph_read", "trace_list", "trace_search", "trace_read", "get_step_output",
    "novel_ledger_query",   # novel content is private (commercial source)
})
```

**依据 4 · 源码核查**：[api/mcp_router.py:172-208](https://github.com/linxuhao/AItelier/blob/f1a1413c7fc9f9b4381589ccfcc361e18e0fb7de/api/mcp_router.py#L172-L208)

普通读取与 gate 关闭分支。

<details>
<summary>查看原文（37行）</summary>

```text
def _authorize(name: str, ctx: Context | None) -> None:
    """Apply the same verdict `write_gate` would have, per tool rather than per path."""
    kind = _TOOL_KIND.get(name)
    if kind is None:
        # Unreachable through `tool()`, which registers the kind. Belt and braces:
        # an unknown tool is never a read.
        raise ToolDenied(f"tool '{name}' declares no authorization class")
    request = None if ctx is None else _request_from(ctx)
    if _EXTERNAL_TOKEN and authz.is_via_tunnel(request):
        # A configured external token gates the public TUNNEL (Cf-Ray) — reads
        # included: pipeline source, prompts and the trace are not safe open on
        # the public internet. An Access JWT (Cf-Access-Jwt-Assertion) without
        # Cf-Ray is Access auth, not the tunnel, and falls through to the
        # ordinary write gate below.
        if not _external_token_ok(request):
            _h = getattr(request, "headers", None) or {}
            logging.getLogger("aitelier.mcp_auth").warning(
                "deny '%s': host=%r cf_ray=%r access_jwt=%r ext_token=%r",
                name, _h.get("host"), _h.get("cf-ray"),
                _h.get("cf-access-jwt-assertion") is not None,
                _h.get("x-aitelier-mcp-external-token") is not None)
            raise ToolDenied("unauthorized")
        return
    if kind == "read" and name not in _PRIVATE_READ_TOOLS:
        return
    if not authz.gate_enabled():
        return          # local dev: the gate is inactive for the whole app
    if request is None:
        # No request object means NO CREDENTIAL, whatever this tool does. A read
        # that stayed private is refused here exactly like a write: "there was no
        # request to check" must never be a reason to proceed.
        if kind == "write":
            raise ToolDenied(
                f"'{name}' changes state and this call carries no verifiable identity")
        raise ToolDenied(
            f"'{name}' reads private state and this call carries no verifiable identity")
    if not authz.request_can_write(request):
```

</details>

**依据 5 · 源码核查**：[api/authz.py:63-65](https://github.com/linxuhao/AItelier/blob/f1a1413c7fc9f9b4381589ccfcc361e18e0fb7de/api/authz.py#L63-L65)

gate 是否配置的判定。

```text
def gate_enabled() -> bool:
    """True when Cloudflare Access verification is configured → gate is active."""
    return cf_access.is_configured()
```

#### 缺口

- 未贯通全部网络入口和配置，也未执行请求
  **影响**：不能断言具体部署对外无保护或已经发生越权
  **进一步探讨**：在隔离网络测试 gate 开关、不同 token 和外层主机限制。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 部署、操作和恢复的成本由谁承担？

**研究主题**：效果与总成本、采用判断

#### 完整回答

使用者须单独运行并维护 AItelier 服务、提供 DSH 兼容 mcp-client、模型端点及相应凭据，检查版本、网络、任务和 checkpoint。工具可写入后端状态或启动任务，客户端超时不等于取消；模型调用和容器资源费用未知。只在可信隔离环境明确后端授权配置并用无敏感样本验证；出现身份不明、意外写入或工具缺失时停止操作并由维护者核对后端日志和运行状态。

#### 证据与依据

**依据 1 · 作者声明**：[integrations/dsh/README.md:18-27](https://github.com/linxuhao/AItelier/blob/f1a1413c7fc9f9b4381589ccfcc361e18e0fb7de/integrations/dsh/README.md#L18-L27)

独立后端和密钥准备。

<details>
<summary>查看原文（10行）</summary>

````text
## Prerequisite: AItelier itself

This plugin is a *client*. It does not install or start AItelier — you need one running and reachable first. AItelier ships as a container:

```bash
git clone https://github.com/linxuhao/AItelier && cd AItelier
mkdir -p ~/.aitelier-secrets && chmod 700 ~/.aitelier-secrets
printf '%s' "sk-your-deepseek-key" > ~/.aitelier-secrets/DEEPSEEK_API_KEY
chmod 600 ~/.aitelier-secrets/DEEPSEEK_API_KEY
docker compose up -d          # serves the API + MCP endpoint on 127.0.0.1:4444
````

</details>

**依据 2 · 作者声明**：[integrations/dsh/README.md:50-64](https://github.com/linxuhao/AItelier/blob/f1a1413c7fc9f9b4381589ccfcc361e18e0fb7de/integrations/dsh/README.md#L50-L64)

状态、等待和证据约束。

<details>
<summary>查看原文（15行）</summary>

```text
## Persistent project State DAG

For project goals and acceptance, first call `state_graph_help` and read its
`driver_guide` field. It is the tool-only fallback for the MCP prompt
`state_graph_driver` and resource `aitelier://state/driver-guide`; use the live
schemas instead of assuming this client bundles the latest server contract.
If State tools are absent, report the backend capability gap; ordinary pipeline
operations can still be used where appropriate.

Use one persistent State project per product. Register workflow or external
attempts before dispatch, retain exact IDs and frozen context, and wait with
`state_graph_read(action="wait_for_state_change", arguments=...)`. Persist
`next_after` with its filter scope. Timeout does not stop a worker; completion
produces a candidate, not acceptance. Record actual evidence for each criterion
before explicit verification. Checkpoint decisions follow existing authorization.
```

</details>

**依据 3 · 源码核查**：[integrations/dsh/cordis.patch.yml:29-41](https://github.com/linxuhao/AItelier/blob/f1a1413c7fc9f9b4381589ccfcc361e18e0fb7de/integrations/dsh/cordis.patch.yml#L29-L41)

连接、凭据和超时。

<details>
<summary>查看原文（13行）</summary>

```text
        transport: streamable-http
        url: !!js process.env.AITELIER_MCP_URL || 'http://127.0.0.1:4444/mcp'
        headers:
          X-AItelier-Admin-Token: !!js process.env.AITELIER_ADMIN_TOKEN || ''
          X-AItelier-Driver-Token: !!js process.env.AITELIER_DRIVER_TOKEN || ''
        # An AItelier run is long and pauses for human approval, so `wait_for_run`
        # blocks. dsh-mcp-client's own default is 60s, and a wait longer than the
        # CLIENT's timeout does not wait longer — the client hangs up first and the
        # model sees a transport error instead of "still running", which reads as a
        # broken tool rather than a long job. 10 minutes lets one wait_for_run
        # cover a realistic stretch of a run; every other tool answers in
        # milliseconds, so raising this costs nothing when nothing is wrong.
        toolCallTimeoutMs: !!js Number(process.env.AITELIER_MCP_TIMEOUT_MS || 600000)
```

</details>

**依据 4 · 源码核查**：[api/mcp_router.py:195-208](https://github.com/linxuhao/AItelier/blob/f1a1413c7fc9f9b4381589ccfcc361e18e0fb7de/api/mcp_router.py#L195-L208)

授权配置边界。

<details>
<summary>查看原文（14行）</summary>

```text
    if kind == "read" and name not in _PRIVATE_READ_TOOLS:
        return
    if not authz.gate_enabled():
        return          # local dev: the gate is inactive for the whole app
    if request is None:
        # No request object means NO CREDENTIAL, whatever this tool does. A read
        # that stayed private is refused here exactly like a write: "there was no
        # request to check" must never be a reason to proceed.
        if kind == "write":
            raise ToolDenied(
                f"'{name}' changes state and this call carries no verifiable identity")
        raise ToolDenied(
            f"'{name}' reads private state and this call carries no verifiable identity")
    if not authz.request_can_write(request):
```

</details>

#### 缺口

- 未实测任务取消、费用、备份和恢复
  **影响**：无法判断真实运维总成本
  **进一步探讨**：在隔离环境核对后台 run 状态、取消和数据备份。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何减少工具静默缺席和授权误判？

**研究主题**：新假设与验证

#### 完整回答

根据 Q02 的外部宿主静默连接失败声明和 Q03 的后端 gate 条件，假设在接入时显示明确握手、实际授权模式与最后连接错误，可帮助操作者区分不可达、无权限和缺功能；不应暴露 token 或凭静态配置宣称权限。对照现有健康检查和配置指南，测诊断时间、误判与敏感信息泄露；若现有工具已足够或显示状态不可信，则否定。该假设未实现。

#### 证据与依据

**依据 1 · 作者声明**：[integrations/dsh/README.md:9-16](https://github.com/linxuhao/AItelier/blob/f1a1413c7fc9f9b4381589ccfcc361e18e0fb7de/integrations/dsh/README.md#L9-L16)

作者描述当前诊断步骤。

```text
> ### No `mcp__aitelier__*` tools? Read this first.
>
> A connection failure here is **silent**. `dsh-mcp-client` has `failOnStartupError: false`, so an unreachable endpoint does not stop `dsh` booting — the tools simply never appear, and nothing says why. An agent in that state can only report "no such tools" and guess; it cannot diagnose it from the inside. Check, in order:
>
> 1. **Is AItelier running?** `curl -s localhost:4444/health` should answer `{"status":"ok",…}`. If not, start it — see [Prerequisite](#prerequisite-aitelier-itself).
> 2. **Is the URL right for where `dsh` runs?** The default is `http://127.0.0.1:4444/mcp` (host). Use `http://aitelier:4444/mcp` **only** if `dsh` is itself a container on the same docker network.
> 3. **Does the endpoint answer?** `curl -s -X POST $AITELIER_MCP_URL -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"c","version":"0"}}}'` — a `421` means the Host header is not in AItelier's allow-list (set `AITELIER_MCP_ALLOWED_HOSTS` on the AItelier side).
> 4. **Is the row actually mounted?** `dsh --profile <name> --dump-config | grep -A3 mcp-aitelier`.
```

**依据 2 · 源码核查**：[api/mcp_router.py:172-208](https://github.com/linxuhao/AItelier/blob/f1a1413c7fc9f9b4381589ccfcc361e18e0fb7de/api/mcp_router.py#L172-L208)

授权分支可能变化。

<details>
<summary>查看原文（37行）</summary>

```text
def _authorize(name: str, ctx: Context | None) -> None:
    """Apply the same verdict `write_gate` would have, per tool rather than per path."""
    kind = _TOOL_KIND.get(name)
    if kind is None:
        # Unreachable through `tool()`, which registers the kind. Belt and braces:
        # an unknown tool is never a read.
        raise ToolDenied(f"tool '{name}' declares no authorization class")
    request = None if ctx is None else _request_from(ctx)
    if _EXTERNAL_TOKEN and authz.is_via_tunnel(request):
        # A configured external token gates the public TUNNEL (Cf-Ray) — reads
        # included: pipeline source, prompts and the trace are not safe open on
        # the public internet. An Access JWT (Cf-Access-Jwt-Assertion) without
        # Cf-Ray is Access auth, not the tunnel, and falls through to the
        # ordinary write gate below.
        if not _external_token_ok(request):
            _h = getattr(request, "headers", None) or {}
            logging.getLogger("aitelier.mcp_auth").warning(
                "deny '%s': host=%r cf_ray=%r access_jwt=%r ext_token=%r",
                name, _h.get("host"), _h.get("cf-ray"),
                _h.get("cf-access-jwt-assertion") is not None,
                _h.get("x-aitelier-mcp-external-token") is not None)
            raise ToolDenied("unauthorized")
        return
    if kind == "read" and name not in _PRIVATE_READ_TOOLS:
        return
    if not authz.gate_enabled():
        return          # local dev: the gate is inactive for the whole app
    if request is None:
        # No request object means NO CREDENTIAL, whatever this tool does. A read
        # that stayed private is refused here exactly like a write: "there was no
        # request to check" must never be a reason to proceed.
        if kind == "write":
            raise ToolDenied(
                f"'{name}' changes state and this call carries no verifiable identity")
        raise ToolDenied(
            f"'{name}' reads private state and this call carries no verifiable identity")
    if not authz.request_can_write(request):
```

</details>

**依据 3 · 源码核查**：[integrations/dsh/cordis.patch.yml:42-48](https://github.com/linxuhao/AItelier/blob/f1a1413c7fc9f9b4381589ccfcc361e18e0fb7de/integrations/dsh/cordis.patch.yml#L42-L48)

静默失败设计注释。

```text
        # Deliberately left at the default (false): a temporarily-down AItelier
        # must not make `dsh` itself unbootable. The cost is that the failure is
        # SILENT — no mcp__aitelier__* tools appear and nothing says why. That is
        # the first thing the README tells you to check, because an agent facing a
        # missing toolset cannot diagnose it from the inside (verified: it answers
        # "NONE FOUND" and can only guess at the cause).
        # failOnStartupError: false
```

#### 缺口

- 未检查现有宿主所有诊断能力
  **影响**：不能证明新增状态优于现有诊断
  **进一步探讨**：在固定宿主模拟断线、拒绝和缺工具并比较定位准确率。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
