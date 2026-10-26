# Treg

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[fba619f](https://github.com/superdesigndev/treg/tree/fba619fd7bd63837d464214a1e22449b16bd83d4)

<!-- BEGIN META -->
[![GitHub ★ 6,040](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6%2C040&color=yellow&logo=github&style=flat)](https://github.com/superdesigndev/treg)
<!-- END META -->

> **实现功能**：提供统一Agent工具目录、服务端凭据注入、API中继和调用计费管理。

> **核心亮点**：[Q02](#research-q02)相对逐Agent分发供应商密钥，集中凭据binding与组织级幂等隔离有明确集成价值；DSH仅是Skill/MCP入口，不将全部平台贡献归于插件壳。

> **风险与缺陷**：[Q03](#research-q03)网关仍处理敏感数据与secret，调用失败也可能已计费；unknown outcome需对账，不能换key盲重试。

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
  - [Q01 · 统一工具目录替用户免去什么工作，哪些费用不能忽略？](#detail-section-11)
  - [Q02 · Agent调用如何走到上游而不拿到真实供应商凭据？](#detail-section-12)
  - [Q03 · 凭据不离开服务端是否等于请求安全且失败免费？](#detail-section-13)
  - [Q04 · 统一账户是否减少成本还是转移了维护责任？](#detail-section-14)
  - [Q05 · 怎样检验统一工具路由产生的增量？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：Treg根项目是工具网关与凭据/计费平台，DSH子入口只提供Skill和MCP连接。目标是偶尔使用多供应商API、或团队需共享受控凭据的Agent开发者；合格结果是拿到目标provider实际响应并核清调用费用，原办法为逐家账号、密钥和工具接线。按需目录和服务端注入可降低接线摩擦，但作者宣传的价格、赠额与供应商订阅对比是固定README声明，不是本轮验证的现价或节省。单一已有API账户的用户，直连通常更简单。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 工具发现 | 选择供应商端点 | 目录收录不保证可用 |
| 凭据中继 | 服务端注入多binding | 需信任网关与上游 |
| 调用对账 | 幂等和未知结果状态 | 新key可能再次收费 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Treg服务和team token | 调用必需 | 统一鉴权 | DSH MCP禁用 |
| provider账户/平台额度 | 相应端点必需 | 实际上游服务 | 拒绝或限流 |
| 显式预算和数据许可 | 试用条件 | 控制费用与中转 | 不调用敏感/付费任务 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 配team/token及明确预算 | MCP可发现 |
| 2 | 选非敏感只读端点核对输入 | 返回可验证响应 |
| 3 | 回读call_id费用和结果 | unknown先对账 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 账户/自托管环境 | key和预算配置 | 实际价格未核实 |
| 持续 | 平台或原供应商收费 | 结果和费用核对 | 不将网关不meter当免费 |
| 失败恢复 | 可能已付费的调用 | 查询call_id与重试决策 | 响应丢失不代表未执行 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 密钥集中 | binding与header过滤 | 全租户安全审计 |
| 减少重复收费 | 同key unknown不重放 | 所有供应商结算覆盖 |

> **思考**：[Q03](#research-q03)网关仍处理敏感数据与secret，调用失败也可能已计费；unknown outcome需对账，不能换key盲重试。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02)相对逐Agent分发供应商密钥，集中凭据binding与组织级幂等隔离有明确集成价值；DSH仅是Skill/MCP入口，不将全部平台贡献归于插件壳。

[Q02](#research-q02)相对逐Agent分发供应商密钥，集中凭据binding与组织级幂等隔离有明确集成价值；DSH仅是Skill/MCP入口，不将全部平台贡献归于插件壳。

共享上游幂等按org隔离及未知结果不重放有借鉴价值，适合有外部副作用的工具网关。Python核心超出JS/TS LOC；目录数量和作者价格不能代替结果质量与费用核对。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)网关仍处理敏感数据与secret，调用失败也可能已计费；unknown outcome需对账，不能换key盲重试。

<a id="detail-section-6"></a>

### 1.5 使用建议

需要多供应商API或团队凭据共享的开发者可先用非敏感只读任务和明确小预算试用Treg。相比逐家接线，它统一发现与服务端鉴权，但实际支出和任务收益未独立验证。若无法接受数据中转或不能核清未知调用费用，就停止重试并改用自有专用API。 依据 [Q01](#research-q01)、[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有实现为固定源码检查支持；用户收益未实测；未来设计假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、dsh/index.js、dsh/cordis.patch.yml、src/treg/infra/upstream/relay.py、src/treg/application/call/reserve.py、src/treg/application/call/idempotency.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：本轮只读固定提交，未执行目标代码或宿主验收；效果、人工耗时及持续采用情况未知。
- 下一步：以原办法为对照执行同一合格任务，记录错误、人工干预和退出恢复；涉及真实副作用前先在可丢弃数据上验证。

**分析版本**

- **仓库**：[superdesigndev/treg](https://github.com/superdesigndev/treg)
- **版本号**：0.27.0（[固定提交 fba619f](https://github.com/superdesigndev/treg/tree/fba619fd7bd63837d464214a1e22449b16bd83d4)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)提出把候选价格、请求预览和失败对账纳入工具选择的未验证假设，对照直连API核对配置、费用和误重试。

以原办法为对照执行同一合格任务，记录错误、人工干预和退出恢复；涉及真实副作用前先在可丢弃数据上验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 153 | 39473 | — | — | 404697 |
| .js | source | 75 | 8362 | 7026 | 1390 | — |
| .mjs | example | 1 | 342 | 289 | 21 | — |
| .md | example | 9 | 367 | — | — | 2805 |
| .ts | example | 2 | 344 | 304 | 13 | — |
| .js | example | 7 | 1075 | 853 | 173 | — |
| .ts | test | 30 | 2852 | 2541 | 143 | — |
| .ts | source | 19 | 1227 | 943 | 186 | — |
| .mjs | source | 1 | 15 | 13 | 2 | — |
| .md | test | 1 | 90 | — | — | 2000 |

</details>

**活跃度**

[![Issue 未关闭 21](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=21&color=grey&logo=github&style=flat)](https://github.com/superdesigndev/treg/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 16](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=16&color=grey&logo=github&style=flat)](https://github.com/superdesigndev/treg/issues?q=is%3Aissue+created%3A2026-09-26T09%3A39%3A31.930Z..2026-10-26T09%3A39%3A31.930Z) [![近30天关闭 2](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=grey&logo=github&style=flat)](https://github.com/superdesigndev/treg/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T09%3A39%3A31.930Z..2026-10-26T09%3A39%3A31.930Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查Treg的具体任务增量、关键失败条件与可控采用路径。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 统一工具目录替用户免去什么工作，哪些费用不能忽略？

**研究主题**：场景与需求、采用判断

#### 完整回答

Treg根项目是工具网关与凭据/计费平台，DSH子入口只提供Skill和MCP连接。目标是偶尔使用多供应商API、或团队需共享受控凭据的Agent开发者；合格结果是拿到目标provider实际响应并核清调用费用，原办法为逐家账号、密钥和工具接线。按需目录和服务端注入可降低接线摩擦，但作者宣传的价格、赠额与供应商订阅对比是固定README声明，不是本轮验证的现价或节省。单一已有API账户的用户，直连通常更简单。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-15](https://github.com/superdesigndev/treg/blob/fba619fd7bd63837d464214a1e22449b16bd83d4/README.md#L5-L15)

作者统一入口与自托管定位

<details>
<summary>查看原文（11行）</summary>

```text
**OpenRouter, but for agent tools instead of models.** Point an agent at one base URL with one token
and it can do the job: **a curated catalog of thousands of endpoints across many providers** — SEO and backlinks,
social and trends, people and company enrichment, ads, scraping, image and video generation —
**priced per call, from a cent**,
with no provider signup. Plus your own team's keys, skills and CLIs, callable by every teammate's
agent without the credential ever leaving the server.

**Ask for the task, not the tool.** You do not need to know which vendor sells backlink data, or to
hold an account with them. Search for what you want to do, read the price, call it.

Built for the Superdesign team, live at [treg.to](https://treg.to) — anyone can self-host.
```

</details>

**依据 2 · 作者声明**：[README.md:24-44](https://github.com/superdesigndev/treg/blob/fba619fd7bd63837d464214a1e22449b16bd83d4/README.md#L24-L44)

自有key与平台key区别

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

#### 缺口

- 真实跨供应商需求强度与总支出对照没有独立数据。
  **影响**：不能将多供应商目录推成普遍需求或已省钱。
  **进一步探讨**：选有实际多供应商任务的团队，用相同只读API任务比较账号接线和总费用，不引用README现价作估算。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · Agent调用如何走到上游而不拿到真实供应商凭据？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

DSH代码注册读取随包Skill的provider；patch另挂MCP，只有TREG_TOKEN非空才启用，Skill安装不等于所有工具可调用。网关relay剥离自己的控制头和cookie，对binding指定的header/query/JSON字段注入服务端解密的secret；共享账号的Idempotency-Key按org和pin重域，避免不同团队撞到同一上游作业。相对每个Agent保存多个API key，增量是将凭据与供应商账户集中在服务端并提供统一发现/调用；仍需信任网关处理请求和密钥。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/index.js:66-100](https://github.com/superdesigndev/treg/blob/fba619fd7bd63837d464214a1e22449b16bd83d4/dsh/index.js#L66-L100)

Skill provider读取和内容返回

<details>
<summary>查看原文（35行）</summary>

```text
async function loadSkill(signal) {
  const content = await readFile(SKILL_BODY_URL, { encoding: 'utf8', signal })
  const description = readDescription(content)
  if (description === undefined) return undefined
  return { description, content }
}

const provider = {
  name: PROVIDER_NAME,
  async list(options = {}) {
    const skill = await loadSkill(options.signal)
    if (skill === undefined) return []
    return [{
      name: SKILL_NAME,
      description: skill.description,
      invocation: INVOCATION,
      provider: PROVIDER_NAME,
      source: 'bundled',
      resourceBase: RESOURCE_BASE,
      rank: BUNDLED_SKILL_RANK,
      locator: SKILL_BODY_URL,
    }]
  },
  async get(_candidate, options = {}) {
    const skill = await loadSkill(options.signal)
    if (skill === undefined) return undefined
    return {
      name: SKILL_NAME,
      description: skill.description,
      invocation: INVOCATION,
      provider: PROVIDER_NAME,
      source: 'bundled',
      resourceBase: RESOURCE_BASE,
      content: skill.content,
    }
```

</details>

**依据 2 · 源码核查**：[dsh/cordis.patch.yml:19-34](https://github.com/superdesigndev/treg/blob/fba619fd7bd63837d464214a1e22449b16bd83d4/dsh/cordis.patch.yml#L19-L34)

token门控MCP

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

**依据 3 · 源码核查**：[src/treg/infra/upstream/relay.py:73-76](https://github.com/superdesigndev/treg/blob/fba619fd7bd63837d464214a1e22449b16bd83d4/src/treg/infra/upstream/relay.py#L73-L76)

控制头过滤

```text
def _is_dropped_request_header(name: str, extra: frozenset[str]) -> bool:
    """Whether a caller header is ours/hop-by-hop and must not reach the upstream."""
    return (name in _DROP_REQUEST or name in extra or name.startswith(_TREG_PREFIX)
            or name == get_settings().client_ip_header.strip().lower())
```

**依据 4 · 源码核查**：[src/treg/infra/upstream/relay.py:99-116](https://github.com/superdesigndev/treg/blob/fba619fd7bd63837d464214a1e22449b16bd83d4/src/treg/infra/upstream/relay.py#L99-L116)

共享key幂等隔离

<details>
<summary>查看原文（18行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[src/treg/infra/upstream/relay.py:176-216](https://github.com/superdesigndev/treg/blob/fba619fd7bd63837d464214a1e22449b16bd83d4/src/treg/infra/upstream/relay.py#L176-L216)

绑定凭据注入

<details>
<summary>查看原文（41行）</summary>

```text
    json_bindings = any(binding.get("location") == "json" for binding in tool.bindings)
    json_body: dict[str, object] | None = None
    if json_bindings:
        if not request.has_body or request.body_read is None:
            raise GatewayFailed(
                "injection_failed", status_code=502,
                detail="JSON credential injection requires a readable request body")
        try:
            parsed = json.loads(await request.body_read(), object_pairs_hook=_unique_json_object)
        except ValueError as exc:
            raise GatewayFailed(
                "injection_failed", status_code=502,
                detail="JSON credential injection requires valid JSON with unique object keys") from exc
        if not isinstance(parsed, dict):
            raise GatewayFailed(
                "injection_failed", status_code=502,
                detail="JSON credential injection requires a JSON object request body")
        json_body = parsed

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
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 凭据不离开服务端是否等于请求安全且失败免费？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

不是。数据仍经网关及上游，服务端secret解密和请求内容需被信任；JSON注入会解析和重序列化对象，不能视为原字节透明中继。平台调用有reserve与spend cap，trial quota依据异步audit计数可短暂滞后，不能当严格每次即时上限。幂等表对已付费但响应丢失返回明确lost/unknown而不重新执行同key，这是避免重复收费的良好边界，但换新key仍可能再次执行。不能从HTTP失败推断未执行或未计费。

#### 证据与依据

**依据 1 · 源码核查**：[src/treg/infra/upstream/relay.py:176-216](https://github.com/superdesigndev/treg/blob/fba619fd7bd63837d464214a1e22449b16bd83d4/src/treg/infra/upstream/relay.py#L176-L216)

JSON重序列化和secret解析

<details>
<summary>查看原文（41行）</summary>

```text
    json_bindings = any(binding.get("location") == "json" for binding in tool.bindings)
    json_body: dict[str, object] | None = None
    if json_bindings:
        if not request.has_body or request.body_read is None:
            raise GatewayFailed(
                "injection_failed", status_code=502,
                detail="JSON credential injection requires a readable request body")
        try:
            parsed = json.loads(await request.body_read(), object_pairs_hook=_unique_json_object)
        except ValueError as exc:
            raise GatewayFailed(
                "injection_failed", status_code=502,
                detail="JSON credential injection requires valid JSON with unique object keys") from exc
        if not isinstance(parsed, dict):
            raise GatewayFailed(
                "injection_failed", status_code=502,
                detail="JSON credential injection requires a JSON object request body")
        json_body = parsed

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
```

</details>

**依据 2 · 源码核查**：[src/treg/application/call/reserve.py:57-72](https://github.com/superdesigndev/treg/blob/fba619fd7bd63837d464214a1e22449b16bd83d4/src/treg/application/call/reserve.py#L57-L72)

trial计数的异步滞后

<details>
<summary>查看原文（16行）</summary>

```text
async def _enforce_trial_allowance(caller: Caller, provider: str, endpoint_id: str,
                                   db: AsyncSession) -> None:
    """Per-team, per-UTC-day call allowance for TRIAL-POOL providers (fx.yaml `kind: treg_trial`).

    A trial provider is served on treg's own FREE-tier key at a $0 price, so the price gives no
    brake at all — one looping agent would drain the shared vendor quota for every team at once.
    The allowance is the brake, and it lives in the same fx entry as the zero (catalog.trial_pools).

    Counted from audit rows: successful (2xx) platform calls whose catalog cost is not `free`.
    A free discovery call consumes no vendor credit, so it neither checks nor consumes this paid-call
    allowance. The audit is written fire-and-forget, so the count can lag a call or two under load;
    for a free trial that slack is acceptable and bounded. Own-key (tier 2) calls never reach this
    check — a team with its own key is never throttled by the trial it does not use.

    FAIL-CLOSED like the platform cap: the quota being protected is the shared vendor key, and
    serving blind when the count cannot be read is how the pool dies for everyone."""
```

</details>

**依据 3 · 源码核查**：[src/treg/application/call/idempotency.py:200-227](https://github.com/superdesigndev/treg/blob/fba619fd7bd63837d464214a1e22449b16bd83d4/src/treg/application/call/idempotency.py#L200-L227)

未知结果与响应丢失不重放

<details>
<summary>查看原文（28行）</summary>

```text
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
```

</details>

#### 缺口

- 租户鉴权、密钥轮换与全部计费结算/异步供应商路径未完整安全审计。
  **影响**：托管凭据和计费安全未全审计，限制可接入数据和写操作范围。
  **进一步探讨**：跟踪Caller授权、secret访问/轮换、reserve到settle与异步作业结算，构造跨租户及未知结果对账案例。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 统一账户是否减少成本还是转移了维护责任？

**研究主题**：效果与总成本、采用判断

#### 完整回答

首次使用托管服务需注册team/token并理解余额、预算和provider授权；自托管另承担数据库、secret加密与供应商运维。持续平台key按调用结算、自有key仍由原供应商计费，即使README说网关不meter也不代表上游免费。失败要用call_id查已收费用和结果，同key幂等无法恢复丢失响应时应先核对而非换key重跑。可先用非敏感只读测试源和显式低预算试验；不接受中转数据或无法对账的任务应直连专用API。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:24-32](https://github.com/superdesigndev/treg/blob/fba619fd7bd63837d464214a1e22449b16bd83d4/README.md#L24-L32)

作者计费边界

```text
## Two kinds of tool, one token

- **The catalog** — external endpoints treg can serve with its own key or through a verified public
  route that needs no provider key. Own-key calls use the team's prepaid balance; anonymous calls
  are free. No account with the provider is needed. New verified accounts receive **$1.00 free**
  once, when they create an eligible team.
- **Your own tools** — anything a teammate registered: a paid API account, an OAuth connection, a
  vendor CLI, a `SKILL.md`. **Your own key always wins over treg's, and those calls are never
  metered.**
```

**依据 2 · 源码核查**：[src/treg/application/call/reserve.py:111-118](https://github.com/superdesigndev/treg/blob/fba619fd7bd63837d464214a1e22449b16bd83d4/src/treg/application/call/reserve.py#L111-L118)

平台日上限与余额关系

```text
async def _enforce_platform_daily_cap(caller: Caller, add_micro: int, db: AsyncSession) -> None:
    """Per-org, per-UTC-day ceiling on tier-4 spend. FAIL-CLOSED, unlike `_enforce_daily_cap`: that one
    meters calls and may let a few extra through under load, this one meters OUR money, so a query that
    cannot answer refuses the call. The cap is the blast radius of a runaway agent (and of a pricing
    mistake in the catalog) — the balance alone is not enough, because auto-top-up can refill it."""
    cap = budget_policy._effective_daily_cap(caller.org)
    if cap <= 0:  # no limit applies: the balance (and the auto-top-up monthly cap) is the bound
        return
```

**依据 3 · 源码核查**：[src/treg/application/call/idempotency.py:218-227](https://github.com/superdesigndev/treg/blob/fba619fd7bd63837d464214a1e22449b16bd83d4/src/treg/application/call/idempotency.py#L218-L227)

查询已付费或未知调用

<details>
<summary>查看原文（10行）</summary>

```text
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
```

</details>

#### 缺口

- 当前价格、预算实际覆盖、secret维护与单位合格任务费用未量化。
  **影响**：费用、预算与恢复责任未量化，尚不能认定经济上划算。
  **进一步探讨**：回读所选端点实际报价及预算规则，用明确小预算记录成功/失败/未知调用和对应账单。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样检验统一工具路由产生的增量？

**研究主题**：新假设与验证

#### 完整回答

由统一relay和明确unknown outcome推导未验证假设：把每次工具选择附上候选价格、预计请求与失败对账入口，可能比仅展示工具数量更利于控制Agent调用。对同一只读数据任务比较直连API与Treg，记录发现/配置时间、合格响应、总计费与未知结果后误重试；如果便利不足覆盖网关信任和延迟，则只作为团队凭据入口。该假设不把供应商数量当质量或可用性保证。

#### 证据与依据

**依据 1 · 源码核查**：[src/treg/application/call/idempotency.py:200-227](https://github.com/superdesigndev/treg/blob/fba619fd7bd63837d464214a1e22449b16bd83d4/src/treg/application/call/idempotency.py#L200-L227)

对账与未知结果语义支持决策可见性

<details>
<summary>查看原文（28行）</summary>

```text
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
```

</details>

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
