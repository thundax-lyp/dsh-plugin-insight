# Treg

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[6dabc01](https://github.com/superdesigndev/treg/tree/6dabc01ad4938d894f5b3f0c9d8bf99dc68343ad)

<!-- BEGIN META -->
[![GitHub ★ 7,597](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7%2C597&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/superdesigndev/treg)
<!-- END META -->

> **功能**：面向团队的工具目录和凭据代理，支持 CLI、HTTP 及 DSH Skill 和 MCP 接入。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 的增量是把供应商目录、团队凭据、调用策略与部分结算接到共享入口。DSH 包负责发布 Skill 和可选 MCP 配置，上游查询或执行由服务端及供应商完成。

> **主要限制**：[Q03](#research-q03) 带键重放依赖成员、标签、请求指纹及保留策略。结果未知、保留期结束或自有密钥普通响应都可能需要另行核对。重放还发生在新请求的逐工具授权前，单工具撤权后的返回需要验证。

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
  - [Q01 · 谁会从团队工具代理受益，根服务与 DSH 包各自做什么？](#detail-section-11)
  - [Q02 · 一次 HTTP 工具请求如何授权、注入凭据并转给上游？](#detail-section-12)
  - [Q03 · 重复调用、丢失响应与费用如何区分？](#detail-section-13)
  - [Q04 · 托管与自托管各需什么，使用和退出负担在哪里？](#detail-section-14)
  - [Q05 · 怎样验证对账后再重试，比直接重试更可靠？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：反复访问多个供应商工具的 Agent 团队，需要共享获准调用的工具，同时保留结果、调用号和费用的核对线索。[Q01](#research-q01)

团队可直接调用供应商 API 或自建一个密钥代理。单供应商直连少一个网络中转，需自行对齐身份、密钥、工具发现和使用记录。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 团队凭据代理 | 调用配置好的上游工具 | 需成员授权及有效上游凭据 |
| 本地幂等占用与回放 | 协调重复请求并保留部分答复 | 需请求键且受指纹、保留策略、窗口约束 |
| DSH Skill | 为宿主提供工具操作说明 | 随包发布，代理运行依赖服务 |
| 托管 MCP 配置 | 将宿主 MCP 客户端连接到托管 Treg | 缺 token 时禁用，实际工具取决于服务 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 可访问的代理和团队凭据 | 调用需要 | 鉴权与路由 | 停止代理调用，核对权限 |
| 对应供应商权限、路由和余额 | 依目标需要 | 执行查询或其他服务 | 检查拒绝或替代，不盲试 |
| Python、数据库及密钥配置 | 自托管需要 | 运行服务、保存工具和凭据 | 先配置并验证恢复 |
| DSH 技能服务及 MCP 客户端 | 使用对应入口需要 | 加载 Skill 或托管 MCP | 使用独立 CLI 或 HTTP 接口 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 限定范围 | 管理员选择沙盒工具和最小权限 | 确认可调用项和应拒绝项 |
| 提交只读查询 | 使用者保存请求键和调用号 | 核对原文结果与当前费用 |
| 查重复与失败 | 使用者查询旧调用、对比上游日志 | 结果未知则人工决定 |
| 退出 | 管理员撤销试用凭据，核对数据副本和账单 | 按权限退回直连 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 现有代理或自托管资源及供应商账号 | 配置权限、调用入口、数据库与密钥 | 价格及工时未知 |
| 持续 | 上游或平台按路线可能收费，另有日志资源 | 核对结果、费用和授权 | 真实用量及净收益未知 |
| 失败恢复 | 重新执行可能增加上游费用 | 先查调用号和账单再处理 | 超时后的真实结果未知 |
| 退出 | 保留记录及备份所需存储 | 撤销凭据并检查副本、账单 | 未做迁移恢复实测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 团队共享调用 | 代理按绑定注入凭据 | 实际供应商覆盖和可用性 |
| 幂等重放 | 按成员和键返回原调用结果或状态 | 逐工具撤权后旧答复可见性及真实供应商去重 |
| 对账 | 部分计费路径标出费用、调用号和业务失败 | 业务交付率和实际节省 |

> **思考**：[Q03](#research-q03) 带键重放依赖成员、标签、请求指纹及保留策略。结果未知、保留期结束或自有密钥普通响应都可能需要另行核对。重放还发生在新请求的逐工具授权前，单工具撤权后的返回需要验证。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 的增量是把供应商目录、团队凭据、调用策略与部分结算接到共享入口。DSH 包负责发布 Skill 和可选 MCP 配置，上游查询或执行由服务端及供应商完成。

[Q02](#research-q02) 请求适配、目标解析、策略检查、转发和费用处理分层。按 owner 约束的重放可保留结果或未知标志，但调用者仍需区分原始与本次费用，并验证当前权限影响。[Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 带键重放依赖成员、标签、请求指纹及保留策略。结果未知、保留期结束或自有密钥普通响应都可能需要另行核对。重放还发生在新请求的逐工具授权前，单工具撤权后的返回需要验证。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 只在沙盒用非敏感查询、最小权限和明确费用上限试用。记录逻辑请求键与原调用号，遇到超时或未知先查状态和账单。权限、结果或费用不明时转人工核对。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

代理授权、凭据注入和有条件的幂等重放已有源码支持。对账后重试能否降低重复仍是待验证假设。供应商实际行为、部署策略和账单尚未取得。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、dsh/index.js、dsh/cordis.patch.yml、src/treg/infra/upstream/relay.py、src/treg/routers/call.py、src/treg/application/call/service.py、src/treg/application/call/authorize.py、src/treg/application/call/idempotency.py、src/treg/application/call/intake.py、pyproject.toml、src/treg/application/call/reserve.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根组件研究，以 HTTP 工具代理、代表性授权和幂等为重点。只确认 DSH Skill 和托管 MCP 配置入口，未测部署和供应商，也未审计全部路由、密钥与日志。
- 下一步：按 [Q05](#research-q05) 用同一计数上游对照直接重试和对账后重试，同时模拟同成员的单工具授权收紧，再比较新请求和重放结果。

**分析版本**

- **仓库**：[superdesigndev/treg](https://github.com/superdesigndev/treg)
- **版本号**：0.30.0（[固定提交 6dabc01](https://github.com/superdesigndev/treg/tree/6dabc01ad4938d894f5b3f0c9d8bf99dc68343ad)）
- **版本日期**：2026-11-08（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 将原调用号、已见费用和未知结果接到客户端验收步骤，有记录才决定是否复用键或重新执行。用同一负载比较重复转发、误判、费用和人工核对时间。

按 [Q05](#research-q05) 用同一计数上游对照直接重试和对账后重试，同时模拟同成员的单工具授权收紧，再比较新请求和重放结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 144 | 27019 | — | — | 263455 |
| .js | source | 76 | 8444 | 7097 | 1400 | — |
| .mjs | example | 1 | 342 | 289 | 21 | — |
| .md | example | 9 | 367 | — | — | 2798 |
| .ts | example | 2 | 344 | 304 | 13 | — |
| .js | example | 7 | 1072 | 852 | 172 | — |
| .ts | test | 32 | 2971 | 2649 | 145 | — |
| .ts | source | 19 | 1266 | 972 | 194 | — |
| .mjs | source | 1 | 15 | 13 | 2 | — |
| .md | test | 1 | 90 | — | — | 2000 |

</details>

**活跃度**

[![Issue 未关闭 39](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=39&color=737b86&logo=github)](https://github.com/superdesigndev/treg/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 32](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=32&color=737b86&logo=github)](https://github.com/superdesigndev/treg/issues?q=is%3Aissue+created%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z) [![近30天关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/superdesigndev/treg/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z)



统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：团队是否能通过同一工具入口复用供应商凭据，并在权限、计费和调用结果不明的条件下安全采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁会从团队工具代理受益，根服务与 DSH 包各自做什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

反复查询多个供应商数据、希望避免为每个 Agent 分发长效供应商凭据的团队，可将工具与凭据授权集中到 Treg 代理。合格结果包含获准调用的工具与账号范围、可追溯的请求结果、必要的上游成本证据。直连供应商可少一个网络中转，但团队需自行管理密钥、工具发现及账单口径。Treg 的增量是让代理接收团队身份并在转发时注入按工具配置的凭据。根项目包含服务和 CLI。npm 根包 `treg-dsh` 的 apply 只注册随包提供的 Skill，另一个补丁条目将宿主 MCP 客户端接到托管端点，缺 token 时禁用。工作流 Skill 描述如何组合调用，属于操作指导，不能当作根服务自行完成招聘、营销或研究的证据。若只有一个供应商且已有组织密钥代理，整合收益较小。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:24-44](https://github.com/superdesigndev/treg/blob/6dabc01ad4938d894f5b3f0c9d8bf99dc68343ad/README.md#L24-L44)

作者区分外部目录、团队自有工具和工作流配方。

<details>
<summary>查看原文（21行）</summary>

```text
## Two kinds of tool, one token

- **The catalog** — external endpoints treg can serve with its own key or through a verified public
  route that needs no provider key. Own-key calls use the team's prepaid balance; anonymous calls
  are free. No account with the provider is needed. New verified accounts receive **$1.00 free**
  once, when they create an eligible team.
- **Your own tools** — anything a teammate registered: a paid API account, an OAuth connection, a
  vendor CLI, a `SKILL.md`. **Your own key always wins over treg's, and those calls are never
  metered.**

The vocabulary for the second half:

- **tool** = something the registry calls for you with the org's credential. Two kinds:
  - **endpoint** — an upstream `base_url` + credential **bindings** (each binding injects one
  secret into the request; a request can carry several, e.g. an OAuth bearer *and* a
  `developer-token` header).
  - **CLI** — a vendor binary (`stripe`, `gh`, `vercel`, ...) run with the credential injected.
- **skill / bundle** = a recipe (`SKILL.md`) + its secrets + its tool(s), registered together.

**The one rule:** the proxy **relays, never models** the upstream, and **injects auth server-side**
— so it survives upstream API changes and callers never hold keys.
```

</details>

**依据 2 · 作者声明**：[README.md:104-119](https://github.com/superdesigndev/treg/blob/6dabc01ad4938d894f5b3f0c9d8bf99dc68343ad/README.md#L104-L119)

作者列出的工作流为配方与另行安装项。

<details>
<summary>查看原文（16行）</summary>

```text
### Workflow skills

Ready-made recipes your agent runs end to end, every call through treg:

| Skill | What your agent can do |
|---|---|
| [`treg`](skills/treg/SKILL.md) | Find and call any tool in the catalog, plus your own tools |
| [`web-access`](skills/web-access/SKILL.md) | When your agent's own web tools fall short, read the live web without local scrapers: free search and page reads first, then the right platform job for social, stores, reviews, maps and papers, with treg falling back to the next vendor when one fails |
| [`lead-signals`](skills/lead-signals/SKILL.md) | Find in-market buyers from public signals (complaints, job changes, hiring, funding, tool adoption) and monitor a topic, competitor or account list for them ([treg.to/leads-signals](https://treg.to/leads-signals)) |
| [`recruit`](skills/recruit/SKILL.md) | Turn a LinkedIn job post into a ranked shortlist: criteria from the post, people search, filters with reasons, one line on why each fits, cited evidence (posts, GitHub, talks, tenure, job change) under a per-candidate spend cap, then a checked personal email and phone, with a run file of counts, evidence and the vendor trail per candidate |
| [`make-ugc`](skills/make-ugc/SKILL.md) | Make AI UGC videos: trending hooks, a presenter, talking-head clips, captions ([treg.to/ugc](https://treg.to/ugc)) |
| [`jev-memory`](skills/jev-memory/SKILL.md) | Give Claude Code a memory: a Claude Code mod where Jev judges each prompt after the turn and keeps your lasting preferences, installed ready-made or built from one prompt ([the mod](examples/claude-code-mods/jev-memory)) |

`install.sh` installs only `treg` and lists the others; name the ones you want with
`sh -s -- --skills lead-signals,recruit` (or `--skills all`; the opt-in `jev-memory` and `rea-growth` are never in that set). In Claude Code each one is
also its own plugin in treg's marketplace: `/plugin install recruit@treg`, or pick them from `/plugin`. To add
```

</details>

**依据 3 · 源码核查**：[package.json:2-15](https://github.com/superdesigndev/treg/blob/6dabc01ad4938d894f5b3f0c9d8bf99dc68343ad/package.json#L2-L15)

npm 根清单只发布 DSH 入口与技能等文件。

<details>
<summary>查看原文（14行）</summary>

```text
  "name": "treg-dsh",
  "version": "0.30.0",
  "type": "module",
  "description": "OpenRouter for tools - 4,000+ agent-friendly tools, pay for the usage, not subscription",
  "main": "dsh/index.js",
  "files": [
    "dsh/index.js",
    "dsh/cordis.patch.yml",
    "dsh/skills"
  ],
  "dsh": {
    "bundle": {
      "patch": "./dsh/cordis.patch.yml"
    }
```

</details>

**依据 4 · 源码核查**：[dsh/index.js:104-116](https://github.com/superdesigndev/treg/blob/6dabc01ad4938d894f5b3f0c9d8bf99dc68343ad/dsh/index.js#L104-L116)

apply 的实际能力是注册 skill provider。

<details>
<summary>查看原文（13行）</summary>

```text
/** Cordis plugin name. */
export const name = 'treg-skill'
/** The registry this plugin contributes to. */
export const inject = ['skills']

/**
 * Register the packaged treg skill on `ctx.skills`.
 *
 * @param {import('@deepseek-ai/cordis').Context} ctx - the plugin context.
 */
export function apply(ctx) {
  ctx.skills.registerProvider(() => provider)
}
```

</details>

**依据 5 · 源码核查**：[dsh/cordis.patch.yml:19-34](https://github.com/superdesigndev/treg/blob/6dabc01ad4938d894f5b3f0c9d8bf99dc68343ad/dsh/cordis.patch.yml#L19-L34)

独立 MCP 客户端行由 token 决定启用并指向托管服务。

<details>
<summary>查看原文（16行）</summary>

```text
- insert:
    - id: treg-skill
      name: treg-dsh

    # The expression may NOT begin with `!`: YAML reads a second `!` after the
    # `!!js` tag as another tag property and the whole file fails to parse
    # ("duplication of a tag property"), taking the profile down with it.
    - id: treg-mcp
      name: '@deepseek-ai/dsh-mcp-client'
      disabled: !!js (process.env.TREG_TOKEN ?? '') === ''
      config:
        serverName: treg
        transport: streamable-http
        url: https://treg.to/mcp/
        headers:
          Authorization: !!js '`Bearer ${process.env.TREG_TOKEN}`'
```

</details>

**依据 6 · 源码核查**：[src/treg/infra/upstream/relay.py:230-257](https://github.com/superdesigndev/treg/blob/6dabc01ad4938d894f5b3f0c9d8bf99dc68343ad/src/treg/infra/upstream/relay.py#L230-L257)

服务端实际解密或读取配置并执行凭据注入。

<details>
<summary>查看原文（28行）</summary>

```text
    # Apply every binding (a request may need several credentials at once).
    for binding in tool.bindings:
        # A PLATFORM binding injects one of treg's own credentials (Google Ads' developer token),
        # read from settings rather than an org secret. Keeping it out of the org's secret store
        # matters: it's treg's credential, not the tenant's, so it must not be readable by them or
        # extractable through a local run.
        setting = binding.get("platform_setting")
        if setting:
            value = get_settings().platform_credential(setting, binding.get("account"))
            if not value:
                raise GatewayFailed(
                    "injection_failed", status_code=502,
                    detail=f"this server has no {setting} configured")
            try:
                injectors.inject(headers, params, binding, value, json_body=json_body)
            except ValueError as exc:
                raise GatewayFailed(
                    "injection_failed", status_code=502,
                    detail=f"credential injection failed: {exc}") from exc
            continue
        secret = secrets[binding["secret_id"]]
        raw = crypto.decrypt(secret.value)
        try:
            injectors.inject(headers, params, binding, raw, json_body=json_body)
        except ValueError as exc:
            raise GatewayFailed(
                "injection_failed", status_code=502,
                detail=f"credential injection failed: {exc}") from exc
```

</details>

#### 缺口

- 没有真实团队的切换和核对记录。
  **影响**：不清楚集中代理能否抵消额外接入、费用和治理。
  **进一步探讨**：比较同一查询用供应商直连和代理，记录可追溯性、总费用与人工。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 一次 HTTP 工具请求如何授权、注入凭据并转给上游？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

代表性 HTTP 调用进入 `/call/{rest:path}` 并要求成员身份。适配层保留原始路径、查询和请求头，带调用者快照进入组织流控和应用调用。对于新调用，应用先尝试解析团队工具，符合特定未找到条件才查目录或 Hub，之后按工具和已解析上游检查访问、策略和调用额度。适用的计费路线先做费用预留，准备凭据和上游请求后走 relay。relay 从原始头中过滤自身控制字段和逐跳字段，解密 binding 所需的凭据或读取平台配置，注入指定的头、查询或 JSON 字段；缺少平台凭据或注入参数不合法会拒绝。启用代理目标检查时还校验解析地址，再发起上游流式请求。响应并非所有路径都原样立即流出，需结算或验证所有权的代表分支要读响应，可能附带费用或调用标识。这里证明一次代理的接线，未穷尽目录替代、跨供应商路由、重定向、权限与日志路径。

#### 证据与依据

**依据 1 · 源码核查**：[src/treg/routers/call.py:296-306](https://github.com/superdesigndev/treg/blob/6dabc01ad4938d894f5b3f0c9d8bf99dc68343ad/src/treg/routers/call.py#L296-L306)

HTTP 路由实际要求成员并进入公共调用面。

<details>
<summary>查看原文（11行）</summary>

```text
@app.api_route(
    "/call/{rest:path}",
    methods=["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
)
async def call_tool(
    rest: str,
    request: Request,
    caller: Caller = Depends(require_member),
):
    prefix = "/catalog/call/" if getattr(request.state, "catalog_only", False) else "/call/"
    return await run_call_surface(rest, request, caller, prefix=prefix, finish=_relay_answer)
```

</details>

**依据 2 · 源码核查**：[src/treg/routers/call.py:351-372](https://github.com/superdesigndev/treg/blob/6dabc01ad4938d894f5b3f0c9d8bf99dc68343ad/src/treg/routers/call.py#L351-L372)

原始请求和可信调用者快照被传入调用服务。

<details>
<summary>查看原文（22行）</summary>

```text
    enter_call(request, caller)
    # Faithful-relay: use the RAW request path, not Starlette's decoded path param. Decoding is
    # lossy — an encoded slash (`%2f`) in `rest` would become a real `/` and change the upstream
    # route (npm's scoped publish `PUT /@scope%2fname` 404s as `/@scope/name`). httpx preserves
    # valid percent-escapes, so the original bytes travel through to the upstream one-to-one.
    raw_path = request.scope.get("raw_path")
    if raw_path:
        _, sep, raw_rest = raw_path.decode("ascii", "replace").partition(prefix)
        if sep:
            rest = raw_rest
    call_input = CallInput(
        method=request.method,
        raw_rest=rest,
        raw_headers=tuple(request.headers.raw) if headers is None else tuple(headers),
        query_items=tuple(request.query_params.multi_items()),
        raw_query=request.url.query or "",
        body=_HttpRequestBody(request),
        caller=CallerSnapshot.capture(caller),
        client_ip=_client_ip(request),
        catalog_only=bool(getattr(request.state, "catalog_only", False)),
    )
    return await run_call_input(request, caller, call_input, finish=finish, rest=rest)
```

</details>

**依据 3 · 源码核查**：[src/treg/routers/call.py:406-419](https://github.com/superdesigndev/treg/blob/6dabc01ad4938d894f5b3f0c9d8bf99dc68343ad/src/treg/routers/call.py#L406-L419)

根请求先经组织准入，再执行应用调用并管理流。

<details>
<summary>查看原文（14行）</summary>

```text
    try:
        # Caller is trusted; every root HTTP/MCP call enters here, routing children do not.
        snapshot = await org_flow_control.check(caller.org_id, context.call_ref)
        slot = await org_concurrency.acquire(
            caller.org_id, limit=snapshot.max_in_flight if snapshot else None,
            version=snapshot.version if snapshot else 0,
            rate_limit=snapshot.rate_limit if snapshot else None)
        upstream = await execute_call(context, request.app.state.http)
        if slot is not None:
            upstream.close = org_concurrency.cleanup_once(upstream.close)
        response = await finish(request, context, upstream, rest)
        if slot is not None and isinstance(response, StreamingResponse):
            response = _LeasedStreamingResponse(response, slot, upstream.close)
            streaming = True  # The ASGI response now owns cleanup and slot release.
```

</details>

**依据 4 · 源码核查**：[src/treg/application/call/service.py:808-826](https://github.com/superdesigndev/treg/blob/6dabc01ad4938d894f5b3f0c9d8bf99dc68343ad/src/treg/application/call/service.py#L808-L826)

团队工具优先，限定情况下才选择其他来源。

<details>
<summary>查看原文（19行）</summary>

```text
    else:
        try:
            target = await _await_before_reserve(
                resolve_call_target(rest, caller, _resolve_call), request, call_ref)
            request.context.target = target
            tool, upstream_url = target.tool, target.upstream
            request.context.tool_name = tool.name
        except CallFailure as exc:
            # Not a tool → maybe a marketplace endpoint id (`treg call tikhub.tiktok.video.comments`).
            # Only the 404 falls through, so an org tool with the same name always wins.
            ep = _catalog_endpoint_for(rest) if exc.status_code == 404 else None
            if ep is None:
                # Third and last: a hub tool (`<team-slug>.<name>`), only when nothing above
                # claimed the id — an own tool or a catalog id always wins.
                hub_row = (await hub_app.tool_for(db, rest, caller_org_id=caller.org_id,
                                                  caller_slug=caller.org.slug, caller_email=caller.email)
                                   if request.context.input.child_of is None else None) if exc.status_code == 404 else None
                if hub_row is None:
                    raise
```

</details>

**依据 5 · 源码核查**：[src/treg/application/call/service.py:1015-1030](https://github.com/superdesigndev/treg/blob/6dabc01ad4938d894f5b3f0c9d8bf99dc68343ad/src/treg/application/call/service.py#L1015-L1030)

授权发生在已解析目标的新请求上。

<details>
<summary>查看原文（16行）</summary>

```text
    try:
        await _await_before_reserve(
            authorize_call(
                caller=caller,
                tool=tool,
                upstream_url=upstream_url,
                method=request.method,
                client_ip=request.client_ip,
            ),
            request,
            call_ref,
        )
    except CallFailure as exc:
        # The router audits this refusal; the root request log names it the same way.
        request.context.refused_by = _refusal_kind(exc.status_code)
        raise
```

</details>

**依据 6 · 源码核查**：[src/treg/application/call/authorize.py:18-39](https://github.com/superdesigndev/treg/blob/6dabc01ad4938d894f5b3f0c9d8bf99dc68343ad/src/treg/application/call/authorize.py#L18-L39)

按工具、实际目标策略和成员额度拒绝。

<details>
<summary>查看原文（22行）</summary>

```text
    async with session_maker() as db:
        # Per-member tool + project ACL (NULL access = all; admins exempt).
        try:
            access_policy._require_tool_use(caller, tool)
        except access_policy.AccessPolicyError as exc:
            raise AuthorizationFailed(
                "tool_access_denied", status_code=403, detail=exc.detail) from exc
        # Policy deny is evaluated on the RESOLVED upstream, so it sees the real host/path/method
        # whichever shape the caller used. The relay never follows redirects, so a blocked host
        # cannot be reached through a 3xx bounce.
        try:
            for url in [upstream_url, *oauth_providers.legacy_aliases(upstream_url)]:
                await access_policy.enforce_deny(caller, url, method, db, tool.project_id)
        except access_policy.AccessPolicyError as exc:
            raise AuthorizationFailed(
                "policy_denied", status_code=403, detail=exc.detail) from exc
        try:  # per-user daily cap (skips sandbox + unmetered members)
            await usage_policy.enforce_daily_cap(
                caller, db, sandbox=demo_sandbox.is_sandbox(caller.org))
        except usage_policy.UsagePolicyError as exc:
            raise AuthorizationFailed(
                "daily_cap_reached", status_code=429, detail=exc.detail) from exc
```

</details>

**依据 7 · 源码核查**：[src/treg/application/call/service.py:1345-1375](https://github.com/superdesigndev/treg/blob/6dabc01ad4938d894f5b3f0c9d8bf99dc68343ad/src/treg/application/call/service.py#L1345-L1375)

适用的计费路径在 relay 前做费用保留，余额或限额拒绝向上传递。

<details>
<summary>查看原文（31行）</summary>

```text
    # Metered — treg's own money is about to be spent (tier 4's platform key, or a registry OAuth
    # connect on a pay-per-use app), so take the money FIRST. Dispatch admission below releases
    # this hold if a later local check or endpoint quota refuses the call.
    if mk is not None and mk.metered:
        # Rendered BEFORE the reserve while `tool` is live. The application closes its reservation
        # session before returning a 402, so refusal evidence cannot rely on a later ORM load.
        refusal_secrets = _safe_secret_renderings(tool, secrets)
        request.context.finalization = FinalizationState.PENDING
        try:
            # Secret reads above opened the dependency session. Release its pool slot before the
            # application opens the short transaction that owns the reservation.
            await db.commit()
            await _platform_reserve(mk, caller, meta=meta, call_ref=call_ref, allow_holdless=True)
            request.context.finalization = FinalizationState.OPEN
        except asyncio.CancelledError:
            await _finish_cancelled_call(request, mk, call_ref)
            raise
        except CallFailure as exc:
            # A call refused for MONEY (402 empty balance / 429 daily cap) must appear in the activity
            # feed, charged 0. Keep the detail: every 429 maps to `cap`, which covers a member call cap, a
            # tag call or spend cap, the platform ceiling, a trial allowance and a demo-IP limit, and only
            # `exc.detail` says which. This runs inside `mk.metered` and before relay, so no provider
            # content reaches it. A tag-cap detail carries the tag's `val`, the caller's own identifier,
            # bounded by the same redaction and retention as the request bodies.
            _audit(exc.status_code, charged_micro=0,
                   refused_by="balance" if exc.status_code == 402 else "cap",
                   error_response=(
                       _ERROR_MASKING_FAILED if refusal_secrets is None else
                       _redact_snippet(f"treg: {exc.detail}", refusal_secrets,
                                       _ERROR_RESPONSE_MAX)))
            raise
```

</details>

**依据 8 · 源码核查**：[src/treg/infra/upstream/relay.py:181-191](https://github.com/superdesigndev/treg/blob/6dabc01ad4938d894f5b3f0c9d8bf99dc68343ad/src/treg/infra/upstream/relay.py#L181-L191)

构建上游头时去除中转控制字段和本服务 cookie。

<details>
<summary>查看原文（11行）</summary>

```text
) -> UpstreamResponse:
    # Headers: preserve everything (incl. duplicates / cookies) except hop-by-hop + our token.
    # `.raw` is the original (bytes, bytes) pairs; httpx.Headers is a multidict, so binding
    # injection (headers[name]=v) overwrites only its target and leaves the rest untouched.
    # RFC 7230 §6.1: also drop any header NAMED in the caller's own Connection header.
    req_drop = _connection_named(_header_value(request.raw_headers, "connection"))
    headers = httpx.Headers(
        [(k, v) for k, v in request.raw_headers
         if not _is_dropped_request_header(k.decode("latin-1").lower(), req_drop)]
    )
    _scrub_treg_cookies(headers)  # keep caller cookies, drop treg's own session cookie
```

</details>

**依据 9 · 源码核查**：[src/treg/infra/upstream/relay.py:230-257](https://github.com/superdesigndev/treg/blob/6dabc01ad4938d894f5b3f0c9d8bf99dc68343ad/src/treg/infra/upstream/relay.py#L230-L257)

多绑定的凭据获取、解密、注入与失败分支。

<details>
<summary>查看原文（28行）</summary>

```text
    # Apply every binding (a request may need several credentials at once).
    for binding in tool.bindings:
        # A PLATFORM binding injects one of treg's own credentials (Google Ads' developer token),
        # read from settings rather than an org secret. Keeping it out of the org's secret store
        # matters: it's treg's credential, not the tenant's, so it must not be readable by them or
        # extractable through a local run.
        setting = binding.get("platform_setting")
        if setting:
            value = get_settings().platform_credential(setting, binding.get("account"))
            if not value:
                raise GatewayFailed(
                    "injection_failed", status_code=502,
                    detail=f"this server has no {setting} configured")
            try:
                injectors.inject(headers, params, binding, value, json_body=json_body)
            except ValueError as exc:
                raise GatewayFailed(
                    "injection_failed", status_code=502,
                    detail=f"credential injection failed: {exc}") from exc
            continue
        secret = secrets[binding["secret_id"]]
        raw = crypto.decrypt(secret.value)
        try:
            injectors.inject(headers, params, binding, raw, json_body=json_body)
        except ValueError as exc:
            raise GatewayFailed(
                "injection_failed", status_code=502,
                detail=f"credential injection failed: {exc}") from exc
```

</details>

**依据 10 · 源码核查**：[src/treg/infra/upstream/relay.py:281-296](https://github.com/superdesigndev/treg/blob/6dabc01ad4938d894f5b3f0c9d8bf99dc68343ad/src/treg/infra/upstream/relay.py#L281-L296)

地址检查按配置启用，随后实际发送流式请求。

<details>
<summary>查看原文（16行）</summary>

```text
    url = httpx.URL(upstream_url)
    for k, v in params:
        url = url.copy_add_param(k, v)
    upstream_req = client.build_request(request.method, url, headers=headers, content=content)
    # Call-time SSRF guard: resolve the upstream host NOW and refuse an internal target — defeats DNS
    # rebinding (base_url was public at registration, its DNS now points at 169.254.169.254 / localhost).
    from . import health
    if get_settings().proxy_ssrf_check and not health.host_is_public(upstream_req.url.host):
        raise GatewayFailed(
            "ssrf_refused", status_code=502,
            detail="upstream host resolves to a non-public address")
    if before_outbound is not None:
        await before_outbound()
    if (on_send := ON_SEND.get()) is not None:
        on_send()
    upstream_resp = await client.send(upstream_req, stream=True)
```

</details>

**依据 11 · 源码核查**：[src/treg/application/call/service.py:1546-1568](https://github.com/superdesigndev/treg/blob/6dabc01ad4938d894f5b3f0c9d8bf99dc68343ad/src/treg/application/call/service.py#L1546-L1568)

调用 relay 及有条件的响应读取。

<details>
<summary>查看原文（23行）</summary>

```text
                upstream_started = _now_ms()
                reached = relay_module.ON_SEND.set(_reached_provider(request.context))
                try:
                    response = await relay(
                        upstream_request,
                        upstream_url, tool, secrets, upstream_client,
                        drop_params=drop_params or None,
                        # Identity encoding wherever the body will be READ: the settle's cost
                        # evidence, and the archive's recording of an own-key answer.
                        force_identity=mk is not None and (
                            mk.metered or mk.free_owned_poll or own_key_archivable),
                        **relay_options,
                    )
                finally:
                    relay_module.ON_SEND.reset(reached)
                    rate_observe.record(rate_seen, response.status if response is not None else None)
                upstream_ms = _now_ms() - upstream_started
            streaming_free_result = (mk is not None and mk.streamable_free_result
                                     and request.method == "GET" and 200 <= response.status < 300)
            if (served is None and mk is not None and (mk.metered or mk.free_owned_poll)
                    and not streaming_free_result):
                # Settlement reads the body; owned free polls also need it to learn result ownership.
                # A failure while draining remains an upstream failure on either path. An endpoint
```

</details>

#### 缺口

- 没有目标部署的策略配置、供应商响应与日志。
  **影响**：不能证明所有可访问路径、费率或数据处理行为。
  **进一步探讨**：在隔离服务和假供应商记录认证拒绝、单次转发、结算及凭据泄露边界。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 重复调用、丢失响应与费用如何区分？

**研究主题**：缺陷与关键质疑

#### 完整回答

只有客户端给出 Idempotency-Key 才进入本地保留机制。键与 membership、主标签值及强制 pin 对应，请求方法、路径、查询和正文产生指纹。保留窗口为 24 小时，指纹不符返回 422，进行中返回 409，已存结果可回放并附原始调用号。本地重放本次费用为零，不能据此推断原调用免费。长时间未续租的 pending 先对账，有未结算占用或任务就等；否则可落 410，区分有费用但响应丢失、或结果未知，不把相同键转给新工作重跑。普通自有凭据调用不保留重放正文，失败与超限响应、禁止保留等分支也不同，不能将这套设计推广成所有上游恰好一次。共享平台凭据对转发给供应商的键另做组织与 pin 分区；供应商是否支持该键须独立确认。

另一个限制是重放先经过标签预算，然后在新请求的目标解析及逐工具授权前直接返回。本次查到的是这段代码的顺序。若同一 membership 和 pin 缓存后收紧单工具授权，是否仍能得到旧响应，应在目标部署专门验证。不能把这段观察等同于跨租户越权。遇到 410 或超时，先用原始调用号核对结果及费用，再决定是否产生新请求。

#### 证据与依据

**依据 1 · 源码核查**：[src/treg/application/call/idempotency.py:27-49](https://github.com/superdesigndev/treg/blob/6dabc01ad4938d894f5b3f0c9d8bf99dc68343ad/src/treg/application/call/idempotency.py#L27-L49)

窗口、续租时限及无键不查。

<details>
<summary>查看原文（23行）</summary>

```text
IDEMPOTENCY_WINDOW_S = 24 * 3600   # retries happen in seconds; a day is generous and easy to reason about
IDEMPOTENCY_HEADER = "idempotency-key"
IDEMPOTENCY_SWEEP_BATCH = 100  # expired labels one claim reclaims; the rest go with later calls
# A pending claim is a LEASE owned by one call (`call_ref`). The owner renews it every
# IDEMPOTENCY_LEASE_RENEW_S while it runs (`_hold_claim_lease`), so `created_at` older than
# IDEMPOTENCY_STALE_PENDING_S means the owner stopped: its process died, or the bookkeeping that
# marks the claim done or releases it failed (a pool timeout). Such a claim is closed with a stored
# terminal answer rather than answering 409 for the whole window; see `_resolve_stale_claim`.
IDEMPOTENCY_LEASE_RENEW_S = 5 * 60
IDEMPOTENCY_STALE_PENDING_S = 3 * IDEMPOTENCY_LEASE_RENEW_S
_POOL_RETRY_PAUSE_S = 0.5  # the settle retry's pause (settle.py); one retry, fresh session

_IDEM_MAX_KEY = 200


def _idempotency_key(raw_header: str | None) -> str:
    """The caller's label for this request, or "" when they sent none.

    Only ever the client's. A server-invented key — hashing the URL and body, say — would silently
    collapse two calls a caller genuinely MEANT to make twice, and "do this again" is a legitimate
    thing to ask of an API. No header means today's behaviour exactly: no lookup, no storage.
    """
    return (raw_header or "").strip()[:_IDEM_MAX_KEY]
```

</details>

**依据 2 · 源码核查**：[src/treg/application/call/intake.py:143-174](https://github.com/superdesigndev/treg/blob/6dabc01ad4938d894f5b3f0c9d8bf99dc68343ad/src/treg/application/call/intake.py#L143-L174)

先检查标签预算，再按标签和 pin 处理重放或抢占。

<details>
<summary>查看原文（32行）</summary>

```text
    """Run the pre-resolve gates in their frozen order using bounded transactions."""
    # Blocked status and the per-tag call count, BEFORE the replay below: a blocked user must neither
    # take an idempotency lock nor be handed an answer this team cached before they were blocked.
    async with session_maker() as db:
        await enforce_tag_budgets(caller, meta, db)
        await db.commit()

    # A retry the caller has labelled: answer it from what we already returned, before resolving
    # anything or reaching a provider. Nothing happens without the header.
    # Scoped by the primary tag: two of a builder's users WILL both send `retry-1`, and without
    # this the second would be served the first's stored response.
    key = _scoped_idempotency_key(
        _idempotency_key(idempotency_header), meta, pinned_tags=caller.membership.pinned_tags)
    if not key:
        return IntakeResult("", "", None, None)

    body = await read_body()
    fingerprint = _request_fingerprint(method, rest, body, raw_query)
    async with session_maker() as db:
        replay = await _replay_idempotent(key, fingerprint, caller, db)
        if replay is not None:
            return IntakeResult(key, fingerprint, replay, None)
        # Claim it now, before anything reaches a provider. Two retries can arrive together and both
        # miss the lookup above; the unique constraint is what makes the loser wait instead of making
        # a second upstream call. A check-then-act in Python would leave exactly the window this
        # feature exists to close — the same reasoning as the conditional UPDATE in ledger.reserve.
        if not await _claim_idempotent(key, fingerprint, rest, caller, db, call_ref=call_ref):
            raise IdempotencyFailed(
                "idempotency_in_progress", status_code=409,
                detail=(f"a call with Idempotency-Key {_idem_display(key)!r} "
                        "is already in progress — retry shortly"))
    return IntakeResult(key, fingerprint, None, (caller.membership.id, key, call_ref))
```

</details>

**依据 3 · 源码核查**：[src/treg/application/call/idempotency.py:100-108](https://github.com/superdesigndev/treg/blob/6dabc01ad4938d894f5b3f0c9d8bf99dc68343ad/src/treg/application/call/idempotency.py#L100-L108)

指纹绑定方法、路径、查询和正文。

```text
    h = hashlib.sha256()
    h.update(method.upper().encode())
    h.update(b"\0")
    h.update(rest.encode())
    h.update(b"\0")
    h.update((query or "").encode())
    h.update(b"\0")
    h.update(body or b"")
    return h.hexdigest()
```

**依据 4 · 源码核查**：[src/treg/application/call/idempotency.py:119-154](https://github.com/superdesigndev/treg/blob/6dabc01ad4938d894f5b3f0c9d8bf99dc68343ad/src/treg/application/call/idempotency.py#L119-L154)

按会员与键查记录，处理过期、422、409 以及已保存答复。

<details>
<summary>查看原文（36行）</summary>

```text
    row = (await db.execute(select(IdempotentCall).where(
        IdempotentCall.membership_id == caller.membership.id,
        IdempotentCall.key == key))).scalar_one_or_none()
    if row is None:
        return None
    if row.expires_at < datetime.now(timezone.utc).replace(tzinfo=None):
        # Past its window: the label is free again, and the call proceeds normally.
        await db.delete(row)
        await db.commit()
        return None
    if row.request_fingerprint and row.request_fingerprint != fingerprint:
        raise IdempotencyFailed(
            "idempotency_mismatch", status_code=422,
            detail=(f"Idempotency-Key {_idem_display(key)!r} was already used for a different request. Use a new key, or "
                    f"repeat the original request exactly."))
    if (row.status != "done" and row.call_ref
            and row.created_at < _utcnow() - timedelta(seconds=IDEMPOTENCY_STALE_PENDING_S)):
        resolved = await _resolve_stale_claim(row, caller, db)
        if resolved is not None:
            return resolved
    if row.status != "done" or row.response_status is None:
        # Still in flight. The first call is talking to the provider right now; telling the caller to
        # retry is honest and cheap, and it is what stops the second one duplicating the spend.
        raise IdempotencyFailed(
            "idempotency_in_progress", status_code=409,
            detail=(f"a call with Idempotency-Key {_idem_display(key)!r} "
                    "is still in progress — retry shortly"))
    return IdempotentReplay(
        body=row.response_body or b"",
        status_code=row.response_status,
        media_type=row.response_media_type or "application/json",
        charged_micro=row.charged_micro,
        # The ORIGINAL call's id: a retry must resolve to the row that actually holds the
        # money, not to a fresh reference for work that never happened.
        call_ref=row.call_ref or "",
    )
```

</details>

**依据 5 · 源码核查**：[src/treg/application/call/idempotency.py:200-243](https://github.com/superdesigndev/treg/blob/6dabc01ad4938d894f5b3f0c9d8bf99dc68343ad/src/treg/application/call/idempotency.py#L200-L243)

过期租约先对账，结果丢失或未知写持久 410。

<details>
<summary>查看原文（44行）</summary>

```text
async def _resolve_stale_claim(row: IdempotentCall, caller: Caller, db: AsyncSession):
    """Close an abandoned lease with a stored terminal answer; never run the key again.

    An open hold or a pending async task means the owner or its worker is not done: 409 (None
    here). Otherwise the answer is a stored 410, so every later retry gets the same reply:
    `idempotency_response_lost` with the charge when the owner's money shows one (the answer was
    paid for but not kept), else `idempotency_outcome_unknown`. The claim is never handed to a new
    call: a lease that stopped renewing does not prove its owner stopped, and a second run under
    the same key is exactly the double charge this table exists to prevent. A new key calls again.

    The write is a compare-and-swap on the lease as read (owner AND `created_at`): a renewal or
    another retry in between wins, and this one answers 409 on the fresh state.
    """
    started = row.expires_at - timedelta(seconds=IDEMPOTENCY_WINDOW_S)
    lifetime_end = row.created_at + timedelta(seconds=IDEMPOTENCY_LEASE_RENEW_S + 60)
    money = await _money_of(db, caller.org_id, row.call_ref, started, lifetime_end)
    if money["in_flight"]:
        return None
    label, owner, charged = _idem_display(row.key), row.call_ref, max(0, money["charged"])
    if charged:
        detail = {"error": "idempotency_response_lost", "call_id": owner, "charged_micro": charged,
                  "message": (f"the call with Idempotency-Key {label!r} completed and was charged, but "
                              f"its response was not retained. GET /calls/{owner}/result may still "
                              "have it; send a new key to call again.")}
    else:
        detail = {"error": "idempotency_outcome_unknown", "call_id": owner,
                  "message": (f"the call with Idempotency-Key {label!r} stopped before its outcome was "
                              f"recorded and may have reached the provider. GET /calls/{owner} shows "
                              "what it cost; send a new key to call again.")}
    body = json.dumps({"detail": detail}, separators=(",", ":")).encode()
    won = (await db.execute(update(IdempotentCall).where(
        IdempotentCall.id == row.id, IdempotentCall.status == "pending",
        IdempotentCall.call_ref == owner, IdempotentCall.created_at == row.created_at,
    ).values(status="done", response_status=410, response_body=body,
             response_media_type="application/json", charged_micro=charged,
    # A lost swap must not paint the loaded row as done: the caller re-reads it as a 409.
    ).execution_options(synchronize_session=False))).rowcount == 1
    await db.commit()
    if not won:
        return None
    logging.getLogger("treg.idempotency").warning(
        "idempotency claim %s: owner %s abandoned it; stored 410 %s", label, owner, detail["error"])
    return IdempotentReplay(body=body, status_code=410, media_type="application/json",
                            charged_micro=charged, call_ref=owner)
```

</details>

**依据 6 · 源码核查**：[src/treg/application/call/service.py:760-778](https://github.com/superdesigndev/treg/blob/6dabc01ad4938d894f5b3f0c9d8bf99dc68343ad/src/treg/application/call/service.py#L760-L778)

重放短路并区分新扣费、原费用和调用号。

<details>
<summary>查看原文（19行）</summary>

```text
    idem_key = intake.idempotency_key
    if intake.replay is not None:
        replayed = intake.replay
        request.context.replay_of = replayed.call_ref or None
        return _bytes_response(
            replayed.body,
            status_code=replayed.status_code,
            media_type=replayed.media_type,
            headers={"X-Treg-Idempotent-Replay": "true",
                     # A replay charges nothing; the first call's charge is echoed separately so a
                     # client summing X-Treg-Cost-Micro never counts one call twice.
                     "X-Treg-Cost-Micro": "0",
                     # Omitted for a stale claim closed as `idempotency_outcome_unknown` (a
                     # stored 410 with no charge found): its original cost is not known.
                     **({} if replayed.status_code == 410 and not replayed.charged_micro
                        else {"X-Treg-Original-Cost-Micro": str(replayed.charged_micro)}),
                     **({"X-Treg-Error": "1"} if replayed.status_code >= 400 else {}),
                     **({"X-Treg-Call-Id": replayed.call_ref} if replayed.call_ref else {})},
        )
```

</details>

**依据 7 · 源码核查**：[src/treg/application/call/service.py:1999-2006](https://github.com/superdesigndev/treg/blob/6dabc01ad4938d894f5b3f0c9d8bf99dc68343ad/src/treg/application/call/service.py#L1999-L2006)

自有凭据不走普通计费正文保留，禁止保留场景另有回执。

```text
    if idem_key:
        # An own-key call is not charged by treg, but a provider that forbids retaining responses
        # may still bill its owner. Keep a body-free receipt so the same key cannot repeat it.
        try:
            await _store_idempotent(idem_key, caller, status_code=response.status, body=b"",
                                    media_type="", charged_micro=0, metered=False,
                                    call_ref=call_ref,
                                    response_retention_forbidden=_retention_forbidden())
```

**依据 8 · 源码核查**：[src/treg/application/call/idempotency.py:374-405](https://github.com/superdesigndev/treg/blob/6dabc01ad4938d894f5b3f0c9d8bf99dc68343ad/src/treg/application/call/idempotency.py#L374-L405)

普通响应释放、特例保留、超限回执及 owner 约束。

<details>
<summary>查看原文（32行）</summary>

```text
    """Remember a metered success or an explicitly terminal, partially charged routed failure.

    Metered calls keep their answer. A team calling on its OWN key is billed by the provider, not
    by us, so its ordinary response is not kept. When retention is forbidden, every successful
    call keeps a 410 receipt instead of a response body, including an own-key call. Ordinary
    failures are not retained, because no charge landed and the caller should be free to retry.
    A routed waterfall may already have settled paid children before its terminal failure;
    `terminal=True` retains that exact failure so a retry cannot repeat those charges.

    Anything else drops the claim, which frees the label immediately rather than making the caller
    wait out the window before they can try again.

    Never raises: the caller already has their answer, and a bookkeeping failure must not turn a
    served call into a 500. Its own session, because the request's may be mid-rollback. Fenced on
    `call_ref`: a claim another call took over is left alone.
    """
    keep = (metered or response_retention_forbidden) and (200 <= status_code < 300 or terminal)
    owned = (*_owned(caller.membership.id, key, call_ref), IdempotentCall.status == "pending")
    if keep and response_retention_forbidden:
        body, status_code, media_type = _not_retained_note(call_ref, charged_micro)
    elif keep and len(body) > get_settings().archive_max_body_bytes:
        body, status_code, media_type = _too_large_note(key, call_ref, charged_micro, len(body))

    async def _write() -> None:
        async with session_maker() as db:
            if not keep:
                await db.execute(delete(IdempotentCall).where(*owned))
            else:
                await db.execute(update(IdempotentCall).where(*owned).values(
                    status="done", response_status=status_code, response_body=body,
                    response_media_type=media_type or "application/json",
                    charged_micro=charged_micro))
```

</details>

**依据 9 · 源码核查**：[src/treg/application/call/service.py:1399-1407](https://github.com/superdesigndev/treg/blob/6dabc01ad4938d894f5b3f0c9d8bf99dc68343ad/src/treg/application/call/service.py#L1399-L1407)

只有平台凭据分支改写发往供应商的幂等键。

```text
            platform_tier = mk is not None and mk.tier == "platform"
            raw_headers = tuple(request.headers.raw)
            if platform_tier:
                raw_headers = scope_shared_idempotency_key(
                    raw_headers, caller.org_id, pinned_tags=caller.membership.pinned_tags)
                raw_headers = identify_as_treg(raw_headers)
                raw_headers = tag_shared_client(
                    raw_headers, catalog_store.load().client_headers.get(mk.provider),
                    mk.provider, caller.org_id)
```

**依据 10 · 源码核查**：[src/treg/infra/upstream/relay.py:128-146](https://github.com/superdesigndev/treg/blob/6dabc01ad4938d894f5b3f0c9d8bf99dc68343ad/src/treg/infra/upstream/relay.py#L128-L146)

转发键的分区由组织与 pin 参与。

<details>
<summary>查看原文（19行）</summary>

```text
def scope_shared_idempotency_key(
    raw_headers: tuple[tuple[bytes, bytes], ...], org_id: int,
    *, pinned_tags: dict | None = None,
) -> tuple[tuple[bytes, bytes], ...]:
    """Rewrite 4 of the faithfulness contract: partition the caller's idempotency label by org and enforced pin.

    Only for calls on treg's shared provider key. The value is an opaque, fixed-length digest of
    (org, pin, label): distinct pins do not share a provider dedupe entry. With no pin, the
    existing (org, label) digest is preserved. The same scope retrying the
    same label still hits the provider's own dedupe should treg's replay window miss it.
    """
    scope = f"{org_id}\x1f".encode()
    if pinned_tags:
        scope += b"pins:" + json.dumps(pinned_tags, sort_keys=True, separators=(",", ":")).encode() + b"\x1f"
    return tuple(
        (k, hashlib.sha256(scope + v).hexdigest().encode())
        if k.lower() == _IDEMPOTENCY_HEADER else (k, v)
        for k, v in raw_headers
    )
```

</details>

#### 缺口

- 未跑同账号撤权后的重放和真实供应商响应丢失。
  **影响**：不能判定部署端实际缓存访问范围及是否重复收费。
  **进一步探讨**：用可计数假上游分别触发重放、撤权、正文冲突、响应丢失与过期，观察调用次数、状态和原始账单。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 托管与自托管各需什么，使用和退出负担在哪里？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

连接已有服务可用 CLI 或带 token 的宿主入口。真实工具调用还依赖供应商权限和路由，某些路线用平台余额，另一些费用由自有账号承担。对自托管，Python 包声明 3.12 至低于 3.14，服务额外依赖 Web、数据库及加密组件。作者要求同步保存数据库和加密密钥，重新部署时缺任一项都要检查可恢复性。DSH MCP 的随包地址为托管端点，自托管不能默认沿用，需单独选择接入方式。

首次投入含身份、凭据、最小权限和部署，持续现金支出可能来自上游用量、托管余额和自托管资源；人工负责核对额度、返回结果、日志和重试。代表计费分支有按估算检查上限的实现，不能当作所有上游费用的全局承诺。失败可能已有外部调用，退出前要撤销对应凭据、检查账单和数据副本，再按授权情况回直连。没有核实现时费率或优惠，也没有合格任务的现金、用时与实际失败样本。

#### 证据与依据

**依据 1 · 源码核查**：[pyproject.toml:1-7](https://github.com/superdesigndev/treg/blob/6dabc01ad4938d894f5b3f0c9d8bf99dc68343ad/pyproject.toml#L1-L7)

Python 包和运行时版本。

```text
[project]
name = "tools-registry"
version = "0.30.0"
description = "A remote registry that turns team skills into shareable, callable tools via a credential-injecting proxy."
readme = "README.md"
license = { file = "LICENSE" }
requires-python = ">=3.12,<3.14"  # keep in sync with PYREQ in src/treg/web/install.sh
```

**依据 2 · 源码核查**：[pyproject.toml:25-49](https://github.com/superdesigndev/treg/blob/6dabc01ad4938d894f5b3f0c9d8bf99dc68343ad/pyproject.toml#L25-L49)

CLI 与服务依赖分开。

<details>
<summary>查看原文（25行）</summary>

```text
# Base install = just the CLI. Light + pure-Python, so `pip install tools-registry` (and Homebrew) are
# fast. Everything needed to RUN a registry server lives in the `[server]` extra below.
dependencies = [
    "httpx>=0.27,<1",
    "posthog>=7.47.3",
    "questionary>=2.0",
    "toon-format==1.2.0",
]

[project.optional-dependencies]
# The registry SERVER — host your own. The FastAPI app, the DB drivers, and encryption. Not needed to
# USE the CLI against a hosted registry, only to RUN one. Install with: pip install "tools-registry[server]"
server = [
    "alembic>=1.16.5",
    "fastapi>=0.115",
    "uvicorn[standard]>=0.32",
    "sqlmodel>=0.0.22,<0.0.45",
    "sqlalchemy[asyncio]>=2.0.42",
    "aiosqlite>=0.20",
    "asyncpg>=0.30",
    "cryptography>=43",
    "pydantic-settings>=2.5",
    "pyyaml>=6",   # the endpoint catalog's data files (src/treg/catalog/*.yaml) — server-side only
    "stripe>=12",  # balance top-ups (src/treg/infra/stripe.py) — the payment rail, server-side only
    "mcp>=2",      # the MCP front door (src/treg/mcp.py) — server-side only; pulls httpx2 ALONGSIDE
```

</details>

**依据 3 · 源码核查**：[dsh/cordis.patch.yml:26-34](https://github.com/superdesigndev/treg/blob/6dabc01ad4938d894f5b3f0c9d8bf99dc68343ad/dsh/cordis.patch.yml#L26-L34)

固定 MCP 配置使用托管端点与 token。

```text
    - id: treg-mcp
      name: '@deepseek-ai/dsh-mcp-client'
      disabled: !!js (process.env.TREG_TOKEN ?? '') === ''
      config:
        serverName: treg
        transport: streamable-http
        url: https://treg.to/mcp/
        headers:
          Authorization: !!js '`Bearer ${process.env.TREG_TOKEN}`'
```

**依据 4 · 作者声明**：[README.md:402-404](https://github.com/superdesigndev/treg/blob/6dabc01ad4938d894f5b3f0c9d8bf99dc68343ad/README.md#L402-L404)

作者要求保存数据库和密钥以便恢复。

```text
> **⚠️ Back these up before moving or redeploying:** the Fernet key (`TREG_SECRET_KEY`) and the
> database (Postgres in prod; `treg.db` for a local sqlite run). Lose the Fernet key and every
> stored secret becomes unrecoverable.
```

**依据 5 · 源码核查**：[src/treg/application/call/reserve.py:299-315](https://github.com/superdesigndev/treg/blob/6dabc01ad4938d894f5b3f0c9d8bf99dc68343ad/src/treg/application/call/reserve.py#L299-L315)

代表计费路线以预留估算比较调用费用上限。

<details>
<summary>查看原文（17行）</summary>

```text
    if (allow_holdless and mk.holdless_eligible and not meta.tags
            and caller.org_id in get_settings().holdless_free_org_ids):
        await _holdless_reserve(mk, caller)
        return
    mk.holdless = False
    charged = ledger.with_margin(mk.estimate_micro)
    mk.payer_org_id = caller.org_id
    mk.reserved_micro = max(0, charged)
    mk.reserved_at = time.monotonic()
    if mk.max_cost_micro is not None and charged > mk.max_cost_micro:
        raise ReservationFailed("route_max_cost", status_code=402, detail={
            "error": "route_max_cost", "endpoint_id": mk.endpoint_id, "provider": mk.provider,
            "max_cost_micro": mk.max_cost_micro, "estimated_cost_micro": charged,
            "message": (f"{mk.endpoint_id} would reserve ~${ledger.usd(charged):g} and "
                        f"the remaining X-Treg-Route-Max-Cost is ${mk.max_cost_micro / 1_000_000:g}; "
                        "nothing was charged for this attempt. Ask for fewer rows/targets or raise the ceiling."),
        })
```

</details>

**依据 6 · 源码核查**：[src/treg/application/call/service.py:1959-1972](https://github.com/superdesigndev/treg/blob/6dabc01ad4938d894f5b3f0c9d8bf99dc68343ad/src/treg/application/call/service.py#L1959-L1972)

结算路径可标出费用、调用号及 HTTP 成功但上游规则失败。

<details>
<summary>查看原文（14行）</summary>

```text
                raise
        # Tell the caller what the call actually cost (llms.txt and skill.md tell an agent to report
        # it). Set only on a METERED call: a team's own key is never charged, and a `0` there would
        # read as "free" rather than "not applicable".
        _set_response_header(response, "X-Treg-Cost-Micro", str(charged))
        _set_response_header(response, "X-Treg-Call-Id", call_ref)
        if served_via:
            _set_response_header(response, "X-Treg-Served-Via", served_via)
        elif (200 <= response.status < 300 and spooled_bytes is None and not deferred
                and (upstream_failed := catalog_results.fails_expect(mk.endpoint_id, body))):
            # The provider answered 2xx but its own success rule says the request failed (a
            # DataForSEO task status other than 20000). The body is relayed untouched and the
            # charge is what the provider reported; this header is how the caller learns it.
            _set_response_header(response, "X-Treg-Upstream-Failed", upstream_failed)
```

</details>

#### 缺口

- 缺组织当前价格、流量及退出演练。
  **影响**：不能估计总成本或确认上限覆盖实际渠道。
  **进一步探讨**：选择一项明确计费的无副作用查询，记录相同合格交付的真实账单、失败样本和人工时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样验证对账后再重试，比直接重试更可靠？

**研究主题**：新假设与验证、采用判断

#### 完整回答

已有沙盒供应商凭据和最小权限团队令牌的使用者，可先对非敏感单一查询做只读试用。保留逻辑请求的稳定键、请求指纹、原调用号及判定结果。待验证的流程假设是在不确定时先查调用状态与费用，再以同一标签核对缓存，只有操作者确认才发新键，能减少误重试。已有重放区分当前与原费用，失去响应时提供调用号；增量是把这些状态接入调用者的验收和重试流程，而非给代理增加永久去重。

在同一沙盒或计数假服务中比较直接重试和对账后重试，注入 409、410、同键不同正文和响应丢失，同时保留无故障对照。记录重复上游次数、费用差异、误把未知当成功的次数和人工核对时间。若错重试未下降或核对开销抵消效果，则撤回该流程。试用时账单不一致、权限不符合或结果仍不明就停止新调用，转人工查状态并在权限允许时退回直连。

#### 证据与依据

**依据 1 · 源码核查**：[src/treg/application/call/service.py:760-778](https://github.com/superdesigndev/treg/blob/6dabc01ad4938d894f5b3f0c9d8bf99dc68343ad/src/treg/application/call/service.py#L760-L778)

已回放保留原调用号和费用区分。

<details>
<summary>查看原文（19行）</summary>

```text
    idem_key = intake.idempotency_key
    if intake.replay is not None:
        replayed = intake.replay
        request.context.replay_of = replayed.call_ref or None
        return _bytes_response(
            replayed.body,
            status_code=replayed.status_code,
            media_type=replayed.media_type,
            headers={"X-Treg-Idempotent-Replay": "true",
                     # A replay charges nothing; the first call's charge is echoed separately so a
                     # client summing X-Treg-Cost-Micro never counts one call twice.
                     "X-Treg-Cost-Micro": "0",
                     # Omitted for a stale claim closed as `idempotency_outcome_unknown` (a
                     # stored 410 with no charge found): its original cost is not known.
                     **({} if replayed.status_code == 410 and not replayed.charged_micro
                        else {"X-Treg-Original-Cost-Micro": str(replayed.charged_micro)}),
                     **({"X-Treg-Error": "1"} if replayed.status_code >= 400 else {}),
                     **({"X-Treg-Call-Id": replayed.call_ref} if replayed.call_ref else {})},
        )
```

</details>

**依据 2 · 源码核查**：[src/treg/application/call/idempotency.py:218-243](https://github.com/superdesigndev/treg/blob/6dabc01ad4938d894f5b3f0c9d8bf99dc68343ad/src/treg/application/call/idempotency.py#L218-L243)

结果不明或响应丢失有不同终态与原号。

<details>
<summary>查看原文（26行）</summary>

```text
    label, owner, charged = _idem_display(row.key), row.call_ref, max(0, money["charged"])
    if charged:
        detail = {"error": "idempotency_response_lost", "call_id": owner, "charged_micro": charged,
                  "message": (f"the call with Idempotency-Key {label!r} completed and was charged, but "
                              f"its response was not retained. GET /calls/{owner}/result may still "
                              "have it; send a new key to call again.")}
    else:
        detail = {"error": "idempotency_outcome_unknown", "call_id": owner,
                  "message": (f"the call with Idempotency-Key {label!r} stopped before its outcome was "
                              f"recorded and may have reached the provider. GET /calls/{owner} shows "
                              "what it cost; send a new key to call again.")}
    body = json.dumps({"detail": detail}, separators=(",", ":")).encode()
    won = (await db.execute(update(IdempotentCall).where(
        IdempotentCall.id == row.id, IdempotentCall.status == "pending",
        IdempotentCall.call_ref == owner, IdempotentCall.created_at == row.created_at,
    ).values(status="done", response_status=410, response_body=body,
             response_media_type="application/json", charged_micro=charged,
    # A lost swap must not paint the loaded row as done: the caller re-reads it as a 409.
    ).execution_options(synchronize_session=False))).rowcount == 1
    await db.commit()
    if not won:
        return None
    logging.getLogger("treg.idempotency").warning(
        "idempotency claim %s: owner %s abandoned it; stored 410 %s", label, owner, detail["error"])
    return IdempotentReplay(body=body, status_code=410, media_type="application/json",
                            charged_micro=charged, call_ref=owner)
```

</details>

**依据 3 · 源码核查**：[src/treg/application/call/idempotency.py:124-145](https://github.com/superdesigndev/treg/blob/6dabc01ad4938d894f5b3f0c9d8bf99dc68343ad/src/treg/application/call/idempotency.py#L124-L145)

覆盖 TTL、请求冲突和进行中场景。

<details>
<summary>查看原文（22行）</summary>

```text
    if row.expires_at < datetime.now(timezone.utc).replace(tzinfo=None):
        # Past its window: the label is free again, and the call proceeds normally.
        await db.delete(row)
        await db.commit()
        return None
    if row.request_fingerprint and row.request_fingerprint != fingerprint:
        raise IdempotencyFailed(
            "idempotency_mismatch", status_code=422,
            detail=(f"Idempotency-Key {_idem_display(key)!r} was already used for a different request. Use a new key, or "
                    f"repeat the original request exactly."))
    if (row.status != "done" and row.call_ref
            and row.created_at < _utcnow() - timedelta(seconds=IDEMPOTENCY_STALE_PENDING_S)):
        resolved = await _resolve_stale_claim(row, caller, db)
        if resolved is not None:
            return resolved
    if row.status != "done" or row.response_status is None:
        # Still in flight. The first call is talking to the provider right now; telling the caller to
        # retry is honest and cheap, and it is what stops the second one duplicating the spend.
        raise IdempotencyFailed(
            "idempotency_in_progress", status_code=409,
            detail=(f"a call with Idempotency-Key {_idem_display(key)!r} "
                    "is still in progress — retry shortly"))
```

</details>

#### 缺口

- 无流程对照与真实财务记录。
  **影响**：不能断言对账节省成本或避免所有重复。
  **进一步探讨**：以同样请求和时限记录次数、合格结果、上游账单及人工介入。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
