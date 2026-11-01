# Treg

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[2fd1bb4](https://github.com/superdesigndev/treg/tree/2fd1bb46626b84c9180e7ca96271b105789e212c)

<!-- BEGIN META -->
[![GitHub ★ 6,887](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6%2C887&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/superdesigndev/treg)
<!-- END META -->

> **功能**：为 Agent 提供工具目录、凭据注入代理和调用计费。

> **亮点**：将目录、服务端密钥代理、费用与有限幂等结合；DSH Skill/MCP 是入口，服务主体属于根项目。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：客户端需主动提供 key 且保护有期限；未知结果可能已到达供应商，新 key 可能再次付费。[Q03](#research-q03)

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
  - [Q01 · 谁需要统一工具网关，与直连和 DSH 入口有何区别？](#detail-section-11)
  - [Q02 · 请求怎样注入凭据，上游隔离依赖什么？](#detail-section-12)
  - [Q03 · 幂等、未知结果和计费能保证什么？](#detail-section-13)
  - [Q04 · 采用需要什么依赖、成本和退出条件？](#detail-section-14)
  - [Q05 · 如何检验统一工具路由产生的增量？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要偶尔访问多供应商工具、或团队共享受控凭据的 Agent 开发者；直连单一供应商是基线。[Q01](#research-q01)

逐家配置账号、API 和密钥；单一稳定供应商直连更简单。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 目录发现 | 选择供应商工具 | 不保证可用 |
| 凭据中继 | 服务端注入 binding | 须信任服务与上游 |
| 结果对账 | 重放与未知结果 | 需客户端 key 和核对账单 |

**流程与依赖**

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| Treg 服务与团队 token | 调用必需 | 鉴权和代理 | 无法调用 |
| 上游权限及余额 | 相应端点必需 | 外部服务 | 可能拒绝或收费 |
| 预算与数据许可 | 试用条件 | 管理费用与中转 | 不发送敏感任务 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
| --- | --- | --- |
| 准备 | 确定预算与凭据 | 配置 token |
| 调用 | 用非敏感只读任务 | 核对实际结果 |
| 恢复 | 查询 call_id 和账单 | 未知结果不盲换 key |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 服务、供应商费用未知 | 权限及预算配置 | 作者价格未核验 |
| 持续 | 上游及平台可能收费 | 账单和结果核对 | 节约未对照 |
| 恢复 | 调用可能已收费 | 查询状态并对账 | 超时不代表未执行 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 凭据接线 | 服务端 binding 注入 | 实际安全性 |
| 重复调用 | 有效期内的标签复用 | 所有场景恰好一次 |

> **思考**：客户端需主动提供 key 且保护有期限；未知结果可能已到达供应商，新 key 可能再次付费。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将目录、服务端密钥代理、费用与有限幂等结合；DSH Skill/MCP 是入口，服务主体属于根项目。[Q01](#research-q01) [Q02](#research-q02)

本地 key 结合 membership、primary tag 和 pin 分区；共享上游 key 额外按 org 与 pin 隔离；过期和无 key 不享受永久去重。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

客户端需主动提供 key 且保护有期限；未知结果可能已到达供应商，新 key 可能再次付费。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

选择受控只读任务、核对账单及费用上限，异常时撤销 token 并回退直连。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持注入、标签分区和过期租约处理；未运行目标、核验部署、账单或安全性。

- 已检查：作者 README、包清单、源码路径 README.md、pyproject.toml、package.json、dsh/index.js、dsh/cordis.patch.yml、src/treg/infra/upstream/relay.py、src/treg/application/call/idempotency.py、src/treg/application/call/settle.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根 inventory 311 个指定扩展名文件、排除 3、解析错误 0；静态追踪 HTTP relay 和幂等代表路径，不覆盖全部供应商或运行时。
- 下一步：隔离账户核对服务版本、上游账单、同 key 重试、过期、响应丢失和退出。

**分析版本**

- **仓库**：[superdesigndev/treg](https://github.com/superdesigndev/treg)
- **版本号**：0.28.0（[固定提交 2fd1bb4](https://github.com/superdesigndev/treg/tree/2fd1bb46626b84c9180e7ca96271b105789e212c)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：在工具选择中连接费用上限、幂等和对账入口，比较现有状态和直连下的误重试、成本与隐私代价。[Q05](#research-q05)

隔离账户核对服务版本、上游账单、同 key 重试、过期、响应丢失和退出。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 165 | 42221 | — | — | 435862 |
| .js | source | 75 | 8364 | 7025 | 1392 | — |
| .mjs | example | 1 | 342 | 289 | 21 | — |
| .md | example | 9 | 367 | — | — | 2805 |
| .ts | example | 2 | 344 | 304 | 13 | — |
| .js | example | 7 | 1075 | 853 | 173 | — |
| .ts | test | 31 | 2901 | 2586 | 143 | — |
| .ts | source | 19 | 1265 | 971 | 194 | — |
| .mjs | source | 1 | 15 | 13 | 2 | — |
| .md | test | 1 | 90 | — | — | 2000 |

</details>

**活跃度**

[![Issue 未关闭 26](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=26&color=737b86&logo=github)](https://github.com/superdesigndev/treg/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 19](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=19&color=737b86&logo=github)](https://github.com/superdesigndev/treg/issues?q=is%3Aissue+created%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z) [![近30天关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/superdesigndev/treg/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定 Treg 根项目的网关价值、凭据注入、幂等和计费恢复边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要统一工具网关，与直连和 DSH 入口有何区别？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

Treg 面向需要偶尔使用多个外部 API、或共享已有供应商凭据的 Agent 团队；它提供目录、代理、组织凭据和费用路径。相对逐家登录、手工集成和分发密钥，集中入口可能降低重复接线；单一稳定 API 直连更简单。README 的供应商订阅价格、赠额和节省是作者声明而非本轮核验现价。DSH 入口只发布 Skill 并配置 MCP，不能把网关服务贡献归于插件壳。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:5-15](https://github.com/superdesigndev/treg/blob/2fd1bb46626b84c9180e7ca96271b105789e212c/README.md#L5-L15)

作者描述工具目录和目标。

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

**依据 2 · 源码核查**：[README.md:24-44](https://github.com/superdesigndev/treg/blob/2fd1bb46626b84c9180e7ca96271b105789e212c/README.md#L24-L44)

作者区分目录与自有凭据。

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

**依据 3 · 源码核查**：[dsh/index.js:1-18](https://github.com/superdesigndev/treg/blob/2fd1bb46626b84c9180e7ca96271b105789e212c/dsh/index.js#L1-L18)

DSH Skill 和 MCP 为独立行。

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * treg as a DeepSeek Harness (dsh) plugin.
 *
 * Registers one `ctx.skills` provider that publishes the generated
 * `dsh/skills/treg/SKILL.md`. The MCP connector is NOT here: it is a separate
 * row in `cordis.patch.yml`, disabled until `TREG_TOKEN` exists, so the skill
 * still installs and reads with no token at all.
 *
 * Two constraints on this file, both load-bearing:
 *
 * - **Plain ESM, no build step.** `dsh plugin add github:...` fetches sources
 *   rather than build output, and pnpm refuses to run a git dependency's
 *   `prepare` script until the user allowlists it - so a compiled bundle would
 *   fail every first install.
 * - **No `@deepseek-ai/*` dependency.** An out-of-tree bundle depending on an
 *   in-box package installs a second copy that drifts from the host's. The
 *   provider's `list`/`get` contract is the stable seam, so it is implemented
 *   directly here - the shape `dsh-skill-badge` uses for its own skill.
```

</details>

**依据 4 · 源码核查**：[dsh/cordis.patch.yml:21-34](https://github.com/superdesigndev/treg/blob/2fd1bb46626b84c9180e7ca96271b105789e212c/dsh/cordis.patch.yml#L21-L34)

Token 缺失禁用 MCP。

<details>
<summary>查看原文（14行）</summary>

```text
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

#### 缺口

- 尚未运行服务、DSH 或真实计费请求
  **影响**：不能证明线上可用、准确收费或任务收益
  **进一步探讨**：用非敏感隔离账户对照直连并核对供应商账单

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 请求怎样注入凭据，上游隔离依赖什么？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

对 HTTP relay，服务端按 binding 选择 secret，解密后向请求头、参数或 JSON 注入；绑定异常中止。上游共享凭据的 idempotency key 按组织与 pin 改写，以避免上游将不同租户相同标签合并；本地请求还按 membership、primary tag 和 pin 限定，fingerprint 包含方法、路径、查询和 body。请求内容与真实密钥仍经过服务和上游；这是信任转移而非隐私或安全认证，也不覆盖所有 CLI 本地执行路径。

#### 证据与依据

**依据 1 · 源码核查**：[src/treg/infra/upstream/relay.py:99-125](https://github.com/superdesigndev/treg/blob/2fd1bb46626b84c9180e7ca96271b105789e212c/src/treg/infra/upstream/relay.py#L99-L125)

共享上游 key 按组织和 pin 分区。

<details>
<summary>查看原文（27行）</summary>

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
_DROP_RESPONSE = _HOP_BY_HOP
_TREG_COOKIES = frozenset({"treg_session", "treg_oauth_state"})  # our cookies, scrubbed from Cookie


def _scrub_treg_cookies(headers: httpx.Headers) -> None:
    """Drop treg's own cookies from the forwarded Cookie header so a dashboard `credentials:'include'`
    call never leaks our session token upstream. Other caller cookies are kept; an emptied header is removed."""
    cookie = headers.get("cookie")
```

</details>

**依据 2 · 源码核查**：[src/treg/infra/upstream/relay.py:195-223](https://github.com/superdesigndev/treg/blob/2fd1bb46626b84c9180e7ca96271b105789e212c/src/treg/infra/upstream/relay.py#L195-L223)

binding 选取、解密、注入和失败处理。

<details>
<summary>查看原文（29行）</summary>

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

**依据 3 · 源码核查**：[src/treg/application/call/idempotency.py:55-80](https://github.com/superdesigndev/treg/blob/2fd1bb46626b84c9180e7ca96271b105789e212c/src/treg/application/call/idempotency.py#L55-L80)

本地标签按 primary tag 和 pin 分区。

<details>
<summary>查看原文（26行）</summary>

```text
def _scoped_idempotency_key(
    key: str, meta: CallMeta, *, pinned_tags: dict | None = None,
) -> str:
    """The caller's label, PARTITIONED by the primary tag.

    A reselling builder runs every one of their users through one token, so two of them will both
    reach for `retry-1` — and `IdempotentCall` is unique on (membership_id, key), which would serve
    the second user the FIRST one's stored response body. That is the cross-tenant leak the table was
    built to prevent, reappearing one level down.

    Folding the value into the stored key partitions retries exactly as widening the unique constraint
    would, with no migration: `uq_idem_caller_key` is declared in `__table_args__`, so SQLAlchemy emits
    it as a table CONSTRAINT inside CREATE TABLE — Postgres could drop it, sqlite could not without
    rebuilding the table. Every access site keeps querying by (membership_id, key) and simply receives
    this value.

    The primary caller-asserted dimension still partitions unpinned callers. An enforced pin is
    additionally part of the namespace: changing any pin must not expose an earlier cached body.
    """
    if not key:
        return key
    scoped = f"{meta.primary_val}{_IDEM_SCOPE_SEP}{key}" if meta.primary_val else key
    if pinned_tags:
        pins = json.dumps(pinned_tags, sort_keys=True, separators=(",", ":"))
        return f"pins:{pins}{_IDEM_SCOPE_SEP}{scoped}"
    return scoped
```

</details>

**依据 4 · 源码核查**：[src/treg/application/call/idempotency.py:88-108](https://github.com/superdesigndev/treg/blob/2fd1bb46626b84c9180e7ca96271b105789e212c/src/treg/application/call/idempotency.py#L88-L108)

指纹包含 method、path、query、body。

<details>
<summary>查看原文（21行）</summary>

```text
def _request_fingerprint(method: str, rest: str, body: bytes, query: str = "") -> str:
    """What the label was used FOR, so reusing it on a different request can be caught.

    A client that reuses one label for two different requests has a bug. Quietly returning the first
    answer would hide it, and the caller would be left wondering why their second call returned
    somebody else's data. Refusing loudly is the useful behaviour, and it is what Stripe does.

    The QUERY STRING is part of the request. It was missing here at first, and since most catalog
    calls are GETs that carry all their arguments in the query, that made the check almost inert: two
    genuinely different lookups under one label matched, and the second was answered with the first
    one's data instead of the 422 this function exists to raise.
    """
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

</details>

#### 缺口

- 尚未运行服务、DSH 或真实计费请求
  **影响**：不能证明线上可用、准确收费或任务收益
  **进一步探讨**：用非敏感隔离账户对照直连并核对供应商账单

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 幂等、未知结果和计费能保证什么？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

客户端未发 Idempotency-Key 就不启用本地记录；有效期内匹配的结果可重放避免重复打上游，不同请求复用返回 422，进行中返回 409。过期后标签重新可用。过期租约若无进行中的 hold 或任务，服务记录 410：有账证是 response_lost，否则 outcome_unknown，可能已到供应商；新 key 会再次调用。故超时不等于没发生或免费，应先查 call_id、平台及供应商账单，不能把窗口内保护外推成永久一次执行。

#### 证据与依据

**依据 1 · 源码核查**：[src/treg/application/call/idempotency.py:42-49](https://github.com/superdesigndev/treg/blob/2fd1bb46626b84c9180e7ca96271b105789e212c/src/treg/application/call/idempotency.py#L42-L49)

标签由调用方提供，无标签不存储。

```text
def _idempotency_key(raw_header: str | None) -> str:
    """The caller's label for this request, or "" when they sent none.

    Only ever the client's. A server-invented key — hashing the URL and body, say — would silently
    collapse two calls a caller genuinely MEANT to make twice, and "do this again" is a legitimate
    thing to ask of an API. No header means today's behaviour exactly: no lookup, no storage.
    """
    return (raw_header or "").strip()[:_IDEM_MAX_KEY]
```

**依据 2 · 源码核查**：[src/treg/application/call/idempotency.py:111-145](https://github.com/superdesigndev/treg/blob/2fd1bb46626b84c9180e7ca96271b105789e212c/src/treg/application/call/idempotency.py#L111-L145)

过期、指纹冲突、进行中和重放。

<details>
<summary>查看原文（35行）</summary>

```text
async def _replay_idempotent(key: str, fingerprint: str, caller: Caller,
                             db: AsyncSession) -> IdempotentReplay | None:
    """The stored answer for this caller's label, or None if there is nothing to replay.

    Returns a real response, so the provider is never reached and no money moves. That is the whole
    point: merely skipping the second CHARGE would still make the second upstream call, which means
    still paying the provider and simply absorbing the double cost ourselves.
    """
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
```

</details>

**依据 3 · 源码核查**：[src/treg/application/call/idempotency.py:200-228](https://github.com/superdesigndev/treg/blob/2fd1bb46626b84c9180e7ca96271b105789e212c/src/treg/application/call/idempotency.py#L200-L228)

陈旧租约的 410 与未知结果。

<details>
<summary>查看原文（29行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[src/treg/application/call/settle.py:73-90](https://github.com/superdesigndev/treg/blob/2fd1bb46626b84c9180e7ca96271b105789e212c/src/treg/application/call/settle.py#L73-L90)

费用处理随上游状态及报告而变化。

<details>
<summary>查看原文（18行）</summary>

```text


def _platform_billable(status_code: int, cost_type: str) -> bool:
    """MAY a response with this status cost us money? (plan §2.2) — the status gate only.
      2xx                        → yes, the provider served it.
      4xx                        → only under `per_call`, and only when the rejection is about the
                                   CALLER'S INPUT (400/404/422 …). Even then the hold settles only
                                   when the provider REPORTS a charge for it (`_platform_settle`):
                                   no vendor has been seen billing a schema rejection. A
                                   credential/quota refusal
                                   (`_NOT_THE_CALLERS_FAULT`) is on us and is never billed — a 405
                                   rejects the method OUR catalog selected, while a 429 on a
                                   SHARED-plan key is treg's own saturation. Billing either would
                                   charge teams for our metadata or congestion. Under
                                   `per_result`/`per_success` a rejected request produced nothing.
      5xx / 3xx / network error  → no. An upstream failure is never billed to the caller.
    """
    # 204 carries no result. For success-priced tools it is the provider's standard free-miss
```

</details>

#### 缺口

- 尚未运行服务、DSH 或真实计费请求
  **影响**：不能证明线上可用、准确收费或任务收益
  **进一步探讨**：用非敏感隔离账户对照直连并核对供应商账单

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用需要什么依赖、成本和退出条件？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

使用网关需选择托管或自建、团队 token、供应商权限和预算；DSH 的 skill 可加载而 MCP 在缺 TREG_TOKEN 时禁用。README 说自有 key 的调用平台不计量，但供应商本身仍可能收费；目录平台计费、流量、运维及异常对账也有成本。先以非敏感只读任务、明确预算核验结果和账单；出现异常费用、不可接受的中转或对账失败时停止调用并撤销 token，回退既有直连。未实测部署、价格或节约。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:24-32](https://github.com/superdesigndev/treg/blob/2fd1bb46626b84c9180e7ca96271b105789e212c/README.md#L24-L32)

README 区分平台与自有 key 计费声明。

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

**依据 2 · 源码核查**：[pyproject.toml:21-44](https://github.com/superdesigndev/treg/blob/2fd1bb46626b84c9180e7ca96271b105789e212c/pyproject.toml#L21-L44)

CLI 与 server 依赖不同。

<details>
<summary>查看原文（24行）</summary>

```text
    "Programming Language :: Python :: 3.13",
    "Topic :: Software Development",
    "Topic :: Utilities",
]
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
```

</details>

**依据 3 · 源码核查**：[dsh/cordis.patch.yml:21-34](https://github.com/superdesigndev/treg/blob/2fd1bb46626b84c9180e7ca96271b105789e212c/dsh/cordis.patch.yml#L21-L34)

MCP token 和 hosted URL。

<details>
<summary>查看原文（14行）</summary>

```text
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

#### 缺口

- 尚未运行服务、DSH 或真实计费请求
  **影响**：不能证明线上可用、准确收费或任务收益
  **进一步探讨**：用非敏感隔离账户对照直连并核对供应商账单

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何检验统一工具路由产生的增量？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

未验证假设：在工具选择界面合并供应商费用上限、幂等标签与未知结果的对账入口，可能减少多供应商任务中误重试和人工核查。它必须区分可获得的价格、估计和未知，并保留用户授权；现有 call_id、已收费及 result 查询、状态 409/410 已提供反证，新增界面未必改善。用相同任务分别对照现有网关及直接 API，在模拟延迟与响应丢失时测重复调用、账单偏差、查证时间、误报和敏感数据暴露；若无改进或成本高则否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/treg/application/call/idempotency.py:111-145](https://github.com/superdesigndev/treg/blob/2fd1bb46626b84c9180e7ca96271b105789e212c/src/treg/application/call/idempotency.py#L111-L145)

现有 409 和复用。

<details>
<summary>查看原文（35行）</summary>

```text
async def _replay_idempotent(key: str, fingerprint: str, caller: Caller,
                             db: AsyncSession) -> IdempotentReplay | None:
    """The stored answer for this caller's label, or None if there is nothing to replay.

    Returns a real response, so the provider is never reached and no money moves. That is the whole
    point: merely skipping the second CHARGE would still make the second upstream call, which means
    still paying the provider and simply absorbing the double cost ourselves.
    """
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
```

</details>

**依据 2 · 源码核查**：[src/treg/application/call/idempotency.py:200-228](https://github.com/superdesigndev/treg/blob/2fd1bb46626b84c9180e7ca96271b105789e212c/src/treg/application/call/idempotency.py#L200-L228)

现有 call_id、收费和查询入口。

<details>
<summary>查看原文（29行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[README.md:12-13](https://github.com/superdesigndev/treg/blob/2fd1bb46626b84c9180e7ca96271b105789e212c/README.md#L12-L13)

作者建议搜索任务、读价格再调用。

```text
**Ask for the task, not the tool.** You do not need to know which vendor sells backlink data, or to
hold an account with them. Search for what you want to do, read the price, call it.
```

#### 缺口

- 尚未运行服务、DSH 或真实计费请求
  **影响**：不能证明线上可用、准确收费或任务收益
  **进一步探讨**：用非敏感隔离账户对照直连并核对供应商账单

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
