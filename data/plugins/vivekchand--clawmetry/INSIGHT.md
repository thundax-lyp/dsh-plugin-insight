# ClawMetry

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[8b21164](https://github.com/vivekchand/clawmetry/tree/8b21164116f9ada864d7417321b039a41ae8da37)

<!-- BEGIN META -->
[![GitHub ★ 435](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=435&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/vivekchand/clawmetry)
<!-- END META -->

> **功能**：读取 Agent 会话与运行日志，统一展示时间轴、工具事件及可得用量的观测工具

> **亮点**：[Q02](#research-q02) 将多源会话数据归一并为部分路由标记来源，提供回放和定位入口；没有证明Agent工作质量。

> **主要限制**：[Q03](#research-q03) 空会话或空浪费标记可能来自读取失败、Pro未安装或委派异常；观测与执行前拦截也受runtime能力边界约束。

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
  - [Q01 · 它为谁提供什么，DSH和开源范围是什么？](#detail-section-11)
  - [Q02 · 开放会话视图怎样从数据源生成？](#detail-section-12)
  - [Q03 · 没有告警或空会话能判定健康吗，观测能当拦截吗？](#detail-section-13)
  - [Q04 · 何种范围可试用，如何验证覆盖状态合同？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要回查Agent运行轨迹的操作者；本轮重点是开放OpenClaw会话观测路径，DSH适配在闭源付费层。

人工读取原JSONL和运行日志；统一视图减少格式切换，不能替代任务结果验收。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 开放OpenClaw回查 | 看会话与工具事件 | 字段来自runtime，空值需看覆盖 |
| 额外runtime/浪费检测 | 付费能力声明 | DSH与Pro实现不在本仓，未核验 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Python和本地会话读权限 | 开放观测必需 | 解析JSONL/数据库 | 先原日志核对，不判空为健康 |
| OpenClaw可读数据 | 本轮试用必需 | 已核开放路径 | 无数据不判运行健康 |
| clawmetry-pro及许可 | DSH等适配必需 | 闭源额外runtime | 本轮仅观察，不宣称适配可用 |
| hooks/远程connect | 可选 | 控制/远程界面 | 默认不纳入本地只读结论 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户用非敏感本地OpenClaw数据启动 | 会话数量/来源可解释 |
| 2 | 用户逐条对照原JSONL和事件 | 时间/工具/usage一致 |
| 3 | 用户注入读取失败或无Pro条件 | 空值不误当健康；异常回原日志 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | Python及本地库 | 核数据根/权限/适配范围 | 付费价格未查询 |
| 持续 | 独立解析/数据库/UI资源 | 对齐格式及指标解释 | 资源/节时未测 |
| 失败恢复 | 重建索引和日志 | 辨认盲区与原始事件 | 丢事件/恢复率未知 |
| 退出 | 可保留原日志 | 停观察服务，若装hook需移除 | 未执行任何安装/配置 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 统一运行回查 | RPC/文件/store与事件查询 | 定位节时、丢事件率 |
| 健康解释 | 部分来源标记和明确空退路 | 用户会否误信空flags |

> **思考**：[Q03](#research-q03) 空会话或空浪费标记可能来自读取失败、Pro未安装或委派异常；观测与执行前拦截也受runtime能力边界约束。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 将多源会话数据归一并为部分路由标记来源，提供回放和定位入口；没有证明Agent工作质量。

[Q02](#research-q02)统一adapter与来源回退值得借鉴；[Q03](#research-q03)fail-soft空值要求独立覆盖状态，不能把不破界面当可信数据。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 空会话或空浪费标记可能来自读取失败、Pro未安装或委派异常；观测与执行前拦截也受runtime能力边界约束。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 已有OpenClaw数据者可对照原JSONL条件试读；本目录DSH用途先观察，未核Pro适配前不采用其健康/控制判断。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

开放OpenClaw观察链和空结果退路有源码支持；闭源DSH适配、Pro检测及新合同效果未核实。

- 已检查：作者 README、包清单、源码路径 README.md、docs/ENTITLEMENTS.md、dashboard.py、routes/sessions.py、clawmetry/adapters/openclaw.py、clawmetry/waste_flags.py、clawmetry/runtime_gates.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查开放应用会话/事件读取、OpenClaw adapter与Pro空flags边界及特定runtime gate说明；未审计Pro、所有runtime、云同步或完整hook控制链。
- 下一步：比较原日志与统一视图，在缺字段/不可读/无Pro/委派失败样本中测误判、定位时间和解析开销；新覆盖合同无改善即否定。

**分析版本**

- **仓库**：[vivekchand/clawmetry](https://github.com/vivekchand/clawmetry)
- **版本号**：0.0.1（[固定提交 8b21164](https://github.com/vivekchand/clawmetry/tree/8b21164116f9ada864d7417321b039a41ae8da37)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 推导每个指标携带来源/覆盖/启用/错误合同的未验证改进，以盲区误判和定位时间检验，噪声或成本抵消收益则推翻。

比较原日志与统一视图，在缺字段/不可读/无Pro/委派失败样本中测误判、定位时间和解析开销；新覆盖合同无改善即否定。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 209 | 35949 | — | — | 421581 |
| .mjs | source | 2 | 573 | 359 | 185 | — |
| .ts | source | 8 | 518 | 386 | 76 | — |
| .js | source | 28 | 48014 | 39270 | 6758 | — |
| .md | example | 10 | 465 | — | — | 2792 |
| .tsx | source | 25 | 5309 | 4831 | 247 | — |
| .mjs | test | 8 | 2758 | 2030 | 544 | — |
| .md | test | 3 | 145 | — | — | 1105 |
| .js | test | 20 | 6102 | 4841 | 807 | — |
| .cjs | test | 1 | 23 | 23 | 3 | — |

</details>

**活跃度**

[![近30天新建 22](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=22&color=737b86&logo=github)](https://github.com/vivekchand/clawmetry/issues?q=is%3Aissue+created%3A2026-09-28T01%3A52%3A52.223Z..2026-10-28T01%3A52%3A52.223Z) [![近30天关闭 10](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=10&color=737b86&logo=github)](https://github.com/vivekchand/clawmetry/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-28T01%3A52%3A52.223Z..2026-10-28T01%3A52%3A52.223Z)

暂未获取：Issue 未关闭。

统计日期：2026-10-28。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：统一观测是否保留来源、付费能力和故障覆盖边界，而不把空结果当健康？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它为谁提供什么，DSH和开源范围是什么？

**研究主题**：场景与需求

#### 完整回答

根组件是Agent观测工具tool，目标是需辨认长任务进展/卡住的操作者，交付会话时间轴、工具与运行时暴露的用量。本轮可核实的是开源应用和OpenClaw路径；README的多运行时数量并非全部开源可用，ENTITLEMENTS明确DSH、Codex等额外runtime由不在本仓的clawmetry-pro提供。不能把本轮开放路径研究写成DSH适配已核验。基线是人工读原始JSONL/日志，统一视图的增量是减少跨格式定位。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:11-16](https://github.com/vivekchand/clawmetry/blob/8b21164116f9ada864d7417321b039a41ae8da37/README.md#L11-L16)

作者目标与统一视图

```text
**An agent can make a hundred tool calls without making progress.** ClawMetry
reads the session files your coding agents already write, and puts the timeline,
the tool calls and whatever token and cost data the runtime exposes into one
view — so you can tell a long run that is working from one that is stuck.

Works with **32 AI agent runtimes** — Claude Code, OpenAI Codex, Hermes, OpenClaw & 28 more. One dashboard for your whole agent fleet. ([the full list](SUPPORTED_RUNTIMES.txt), generated from the catalogue.)
```

**依据 2 · 作者声明**：[README.md:33-44](https://github.com/vivekchand/clawmetry/blob/8b21164116f9ada864d7417321b039a41ae8da37/README.md#L33-L44)

开源/付费、外发与观测边界

<details>
<summary>查看原文（12行）</summary>

```text
| | |
|---|---|
| **What it does** | Reads the session files and logs your agents already write. No SDK, no code change, no instrumentation in your app. |
| **What you see** | Session timeline, tool-by-tool replay, token and cost breakdown, and trajectory signals (looping, repeated failures) — per runtime. |
| **What's free** | `pip install clawmetry` reads **OpenClaw, NVIDIA NemoClaw, Goose and Qwen Code** with no account, no key and no network call. The other 28 — Claude Code, Codex, Cursor and the rest — are read by the closed-source `clawmetry-pro` companion, which arrives with the 7-day trial or a plan — see [docs/ENTITLEMENTS.md](docs/ENTITLEMENTS.md) for the exact split. |
| **How to start** | `pip install clawmetry && clawmetry`, then open localhost:8900. No agents on this machine yet? `clawmetry --sample` opens on three labelled synthetic sessions. |
| **What leaves your machine** | No session data, unless you run `clawmetry connect`. Two things do run by default, both opt-out and neither carrying session content: an anonymous install ping and a PyPI version check. Every destination is inventoried in [docs/EGRESS.md](docs/EGRESS.md), rebuilt from a wire capture rather than from reading comments. |

Two limits worth knowing before you judge the output: runtimes expose very
different data (some publish no cost at all — [the matrix](docs/compatibility.md)
says which, per runtime), and observing an action is not the same as being able
to block it ([which controls are real, per runtime](docs/APPROVALS.md)).
```

</details>

**依据 3 · 源码核查**：[docs/ENTITLEMENTS.md:101-113](https://github.com/vivekchand/clawmetry/blob/8b21164116f9ada864d7417321b039a41ae8da37/docs/ENTITLEMENTS.md#L101-L113)

付费代码不在仓库、包含DSH

<details>
<summary>查看原文（13行）</summary>

```text
### PAID — shipped in the `clawmetry-pro` package

The paid layer is not in this repository. It downloads separately when
either a self-hosted license key or a cloud plan resolves. The lists
below live here so the free UI can render locked rows with an accurate
"what would this unlock" preview.

**Additional runtimes** (`entitlements.PAID_RUNTIMES`):

`claude_code`, `codex`, `cursor`, `aider`, `opencode`,
`hermes`, `picoclaw`, `nanoclaw`, `pi`, `deepagents`,
`n8n`, `antigravity`, `copilot`, `grok`, `grok_bot`, `qm`, `deepseek_harness`, `exo`,
`kimi`, `devin`, `gemini_cli`, `cline`, `openhands`, `openworker`, `lovable`, `openexecutive`, `opendots`.
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 开放会话视图怎样从数据源生成？

**研究主题**：功能与机制、贡献与相对优势、工程质量与复用

#### 完整回答

dashboard注册OpenClawAdapter。_get_sessions先读gateway RPC，映射为会话字段并缓存，失败回文件路径；文件模式枚举最近JSONL，读首行并扫描实际usage聚合token。/api/sessions可按开关走DuckDB，否则网关/文件，再合并尚未登记的JSONL并返回。adapter.list_events从read_only本地store按agent_type和session_id查询并排序。这是将多种观察源归一并保留回退的集成，不证明观察到的任务成功，也不把成本/推理字段缺失补成真实零。

#### 证据与依据

**依据 1 · 源码核查**：[dashboard.py:6716-6720](https://github.com/vivekchand/clawmetry/blob/8b21164116f9ada864d7417321b039a41ae8da37/dashboard.py#L6716-L6720)

内置adapter实际注册

```text
    # Register built-in agent adapters. External plugins can register more
    # via clawmetry.extensions entry points — see clawmetry/adapters/.
    from clawmetry.adapters import registry as _adapter_registry
    from clawmetry.adapters.openclaw import OpenClawAdapter
    _adapter_registry.register(OpenClawAdapter())
```

**依据 2 · 源码核查**：[dashboard.py:11305-11357](https://github.com/vivekchand/clawmetry/blob/8b21164116f9ada864d7417321b039a41ae8da37/dashboard.py#L11305-L11357)

RPC/缓存和文件回退

<details>
<summary>查看原文（53行）</summary>

```text
def _get_sessions():
    """Get sessions via gateway API first, file fallback."""
    now = time.time()
    if (
        _sessions_cache["data"] is not None
        and (now - _sessions_cache["ts"]) < _SESSIONS_CACHE_TTL
    ):
        return _sessions_cache["data"]

    # Try WebSocket RPC first
    api_data = _gw_ws_rpc("sessions.list")
    if api_data and "sessions" in api_data:
        sessions = []
        for s in api_data["sessions"][:30]:
            sessions.append(
                {
                    "sessionId": s.get("key", ""),
                    "key": s.get("key", "")[:12] + "...",
                    "displayName": s.get("displayName", s.get("key", "")[:20]),
                    "updatedAt": s.get("updatedAtMs", s.get("lastActiveMs", 0)),
                    "model": s.get("model", s.get("modelRef", "unknown")),
                    "channel": s.get("channel", "unknown"),
                    "totalTokens": s.get("totalTokens", 0),
                    "inputTokens": s.get("inputTokens", 0),
                    "outputTokens": s.get("outputTokens", 0),
                    "cacheReadTokens": s.get("cacheReadInputTokens", s.get("cacheReadTokens", 0)),
                    "cacheWriteTokens": s.get("cacheCreationInputTokens", s.get("cacheWriteTokens", 0)),
                    "costUsd": _extract_gw_session_cost(s),
                    "contextTokens": api_data.get("defaults", {}).get(
                        "contextTokens", 200000
                    ),
                    "kind": s.get("kind", "direct"),
                    "transcriptionProvider": s.get("transcriptionProvider") or s.get("talkTranscriptionProvider") or s.get("speechProvider") or "",
                    "talkTransport": s.get("talkTransport") or s.get("voiceTransport") or "",
                    "voiceModel": s.get("voiceModel") or s.get("realtimeModel") or s.get("talkModel") or "",
                    "vadMode": s.get("vadMode") or s.get("talkVadMode") or "",
                    "agent": s.get("agentId", "main"),
                    "parentId": s.get("parentSessionId") or s.get("parentId") or s.get("spawnedBy") or s.get("parentKey") or None,
                    "endedAt": s.get("endedAtMs") or s.get("endedAt"),
                    "endReason": s.get("endReason") or "",
                    "messageCount": int(s.get("messageCount") or 0),
                    "title": s.get("title") or "",
                    "costStatus": s.get("costStatus") or "",
                    "target": s.get("target") or s.get("identityTarget"),
                    "capabilityProfile": s.get("capabilityProfile") or s.get("conversationCapability"),
                }
            )
        _sessions_cache["data"] = sessions
        _sessions_cache["ts"] = now
        return sessions

    # File-based fallback
    return _get_sessions_from_files()
```

</details>

**依据 3 · 源码核查**：[dashboard.py:11407-11447](https://github.com/vivekchand/clawmetry/blob/8b21164116f9ada864d7417321b039a41ae8da37/dashboard.py#L11407-L11447)

JSONL枚举和usage聚合

<details>
<summary>查看原文（41行）</summary>

```text
def _get_sessions_from_files():
    """Read active sessions from the session directory (file-based fallback)."""
    now = time.time()

    sessions = []
    try:
        base = SESSIONS_DIR or os.path.expanduser("~/.openclaw/agents/main/sessions")
        if not os.path.isdir(base):
            return sessions
        idx_files = sorted(
            [
                f
                for f in os.listdir(base)
                if f.endswith(".jsonl") and "deleted" not in f
            ],
            key=lambda f: os.path.getmtime(os.path.join(base, f)),
            reverse=True,
        )
        for fname in idx_files[:30]:
            fpath = os.path.join(base, fname)
            try:
                mtime = os.path.getmtime(fpath)
                with open(fpath) as f:
                    first = json.loads(f.readline())
                sid = fname.replace(".jsonl", "")
                # Single walk gets the session's most recent model + the real
                # token count. Previous code used file size as totalTokens,
                # which gave a bogus number proportional to JSONL bytes not
                # actual usage.
                model, total_tokens = _scan_session_aggregates(fpath)
                sessions.append(
                    {
                        "sessionId": sid,
                        "key": sid[:12] + "...",
                        "displayName": sid[:20],
                        "updatedAt": int(mtime * 1000),
                        "model": model,
                        "channel": "unknown",
                        "totalTokens": total_tokens,
                        "contextTokens": 200000,
                    }
```

</details>

**依据 4 · 源码核查**：[routes/sessions.py:313-361](https://github.com/vivekchand/clawmetry/blob/8b21164116f9ada864d7417321b039a41ae8da37/routes/sessions.py#L313-L361)

本地store/网关/文件合并路由

<details>
<summary>查看原文（49行）</summary>

```text
@bp_sessions.route("/api/sessions")
def api_sessions():
    import dashboard as _d
    # Epic #964 PR 3: opt-in local-store fast path. When
    # CLAWMETRY_LOCAL_STORE_READ=1 AND the local sessions table has rows,
    # serve directly from DuckDB. Falls through to gateway/JSONL otherwise
    # (so a fresh install with no local store, or a non-OpenClaw user, sees
    # the same data as before — zero-change default).
    if is_local_store_read_enabled():
        fast = _try_local_store_sessions()
        if fast is not None:
            _merge_unregistered_jsonls(fast["sessions"])
            capped = _apply_24h_retention_cap(fast["sessions"])
            fast["capped_at_24h"] = capped
            # Issue #1773: honest envelope marker. The fast path tags itself
            # local_store, but _merge_unregistered_jsonls may have appended
            # filesystem_unregistered rows. Recompute from the row markers so
            # operators see the actual data path (vs. a misleading
            # "local_store" envelope that hides an ingest outage).
            fast["_source"] = _derive_envelope_source(
                fast["sessions"], fallback="local_store"
            )
            fast["sessions"] = _filter_internal_sessions(fast["sessions"])
            return jsonify(fast)
    gw_data = _d._gw_invoke("sessions_list", {"limit": 20, "messageLimit": 0})
    if gw_data and "sessions" in gw_data:
        sessions = _d._augment_sessions_with_burn(gw_data["sessions"])
    else:
        sessions = _d._augment_sessions_with_burn(_d._get_sessions())
    # Same env-gate as the fast path: when the user has opted into local-store
    # reads, decorate gateway/JSONL session rows with channel context from the
    # typed openclaw_channels table. Lets a partially-migrated install (sessions
    # still from gateway, channels already in DuckDB) get typed channel/chat_type/
    # subject without waiting for the full session-table cutover.
    if is_local_store_read_enabled():
        _decorate_with_channel_context(sessions)
        _decorate_with_authority_counts(sessions)
    for s in sessions:
        if "session_type" not in s:
            s["session_type"] = _infer_session_type(s)
    # Backfill: union with raw JSONL files on disk. The gateway / sessions.json
    # index can lag behind the filesystem (a brand-new session writes its
    # JSONL immediately but only registers in sessions.json once OpenClaw's
    # registrar runs). Without this merge those sessions stay invisible until
    # the registrar catches up — see MOAT_E2E_REPORT_2026-05-13 root-cause #3.
    _merge_unregistered_jsonls(sessions)
    sessions = _filter_internal_sessions(sessions)
    capped = _apply_24h_retention_cap(sessions)
    return jsonify({"sessions": sessions, "capped_at_24h": capped})
```

</details>

**依据 5 · 源码核查**：[clawmetry/adapters/openclaw.py:3229-3249](https://github.com/vivekchand/clawmetry/blob/8b21164116f9ada864d7417321b039a41ae8da37/clawmetry/adapters/openclaw.py#L3229-L3249)

只读事件查询与会话过滤

<details>
<summary>查看原文（21行）</summary>

```text
    def list_events(self, session_id: str, limit: int = 500) -> List[Event]:
        """Return events for a session in the unified Event shape.

        Reads from the DuckDB events table (filtered by agent_type='openclaw'
        and session_id) so per-agent session views and runtime-aware
        endpoints stay consistent with what /api/transcript would render.

        Falls back to ``[]`` on any error so a flaky local store never
        breaks the dashboard. The legacy rich transcript route in
        ``dashboard.py`` is unchanged.
        """
        events: List[Event] = []
        try:
            from clawmetry import local_store as _ls
            store = _ls.get_store(read_only=True)
            rows = store._fetch(
                "SELECT id, event_type, ts, model, token_count, data, agent_id, node_id "
                "FROM events WHERE agent_type = ? AND session_id = ? "
                "ORDER BY ts ASC LIMIT ?",
                ["openclaw", str(session_id), int(limit)],
            )
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 没有告警或空会话能判定健康吗，观测能当拦截吗？

**研究主题**：缺陷与关键质疑

#### 完整回答

不能。OpenClaw list_sessions在异常时返回[]，文件模式逐文件异常可跳过；这些空值可能是观察失败。waste_flags在未装Pro或委派异常时返回空列表，因此“没有浪费标记”也可能是能力未启用/检测失败，不能当无循环或无重复错误。审批要按runtime核实：runtime_gates的Cursor/Copilot实现明确fail-open合同，观察日志并不构成所有运行时的执行前阻断。当前源码可见hook实现与README摘要需分开，不能由“32运行时同视图”推出同样数据覆盖或控制能力。

#### 证据与依据

**依据 1 · 源码核查**：[clawmetry/adapters/openclaw.py:2883-2888](https://github.com/vivekchand/clawmetry/blob/8b21164116f9ada864d7417321b039a41ae8da37/clawmetry/adapters/openclaw.py#L2883-L2888)

会话读取失败返回空

```text
    def list_sessions(self, limit: int = 100) -> List[Session]:
        try:
            raw = _d()._get_sessions() or []
        except Exception as exc:
            logger.warning(f"OpenClaw list_sessions() failed: {exc}")
            return []
```

**依据 2 · 源码核查**：[dashboard.py:11425-11450](https://github.com/vivekchand/clawmetry/blob/8b21164116f9ada864d7417321b039a41ae8da37/dashboard.py#L11425-L11450)

文件读取失败可跳过

<details>
<summary>查看原文（26行）</summary>

```text
        for fname in idx_files[:30]:
            fpath = os.path.join(base, fname)
            try:
                mtime = os.path.getmtime(fpath)
                with open(fpath) as f:
                    first = json.loads(f.readline())
                sid = fname.replace(".jsonl", "")
                # Single walk gets the session's most recent model + the real
                # token count. Previous code used file size as totalTokens,
                # which gave a bogus number proportional to JSONL bytes not
                # actual usage.
                model, total_tokens = _scan_session_aggregates(fpath)
                sessions.append(
                    {
                        "sessionId": sid,
                        "key": sid[:12] + "...",
                        "displayName": sid[:20],
                        "updatedAt": int(mtime * 1000),
                        "model": model,
                        "channel": "unknown",
                        "totalTokens": total_tokens,
                        "contextTokens": 200000,
                    }
                )
            except Exception:
                pass
```

</details>

**依据 3 · 源码核查**：[clawmetry/waste_flags.py:27-62](https://github.com/vivekchand/clawmetry/blob/8b21164116f9ada864d7417321b039a41ae8da37/clawmetry/waste_flags.py#L27-L62)

Pro缺失/异常的空flags退路

<details>
<summary>查看原文（36行）</summary>

```text
def _pro():
    """Return ``clawmetry_pro.lib.waste_flags`` when importable, else ``None``."""
    try:
        from clawmetry_pro.lib import waste_flags as _w
        return _w
    except Exception:
        return None


# ── public surface ─────────────────────────────────────────────────────────────


def compute_flags(signals: Any) -> list[dict]:
    """Compute per-run waste flags. Returns ``[]`` when clawmetry-pro is
    not installed (Free tier sees no waste-flag overlay)."""
    pro = _pro()
    if pro is None:
        return []
    try:
        return pro.compute_flags(signals)
    except Exception as exc:
        logger.warning("waste_flags.compute_flags delegation failed: %s", exc)
        return []


def compute_signals_from_events(events: Iterable[dict]) -> dict:
    """Reduce events into the signal dict ``compute_flags`` consumes.
    Returns ``{}`` when clawmetry-pro is not installed."""
    pro = _pro()
    if pro is None:
        return {}
    try:
        return pro.compute_signals_from_events(events)
    except Exception as exc:
        logger.warning("waste_flags.compute_signals delegation failed: %s", exc)
        return {}
```

</details>

**依据 4 · 源码核查**：[clawmetry/runtime_gates.py:1-36](https://github.com/vivekchand/clawmetry/blob/8b21164116f9ada864d7417321b039a41ae8da37/clawmetry/runtime_gates.py#L1-L36)

特定runtime gate与fail-open边界

<details>
<summary>查看原文（36行）</summary>

```text
"""Pre-tool gates for Cursor and GitHub Copilot CLI — "block before it runs".

Same two-halves pattern as ``clawmetry/claude_code_gate.py`` (read that
module's docstring first — the merge rules, state files, and fail-open
contract all carry over), generalised across runtimes whose native hook
systems can DENY a tool call before it executes:

* **Cursor** (IDE + `cursor-agent` CLI): Cursor Hooks, ``~/.cursor/hooks.json``
  (`{"version": 1, "hooks": {"beforeShellExecution": [entry, …], …}}`).
  Blocking events used: ``beforeShellExecution`` (payload carries the shell
  ``command`` + ``cwd``) and ``beforeMCPExecution`` (``tool_name`` +
  ``tool_input``), plus ``beforeReadFile`` when a policy gates reads or is
  risk-gated. The hook prints ``{"permission": "allow"|"deny"|"ask",
  "user_message": …, "agent_message": …}``. Fail-open: a hook that exits 0
  with no output renders no opinion; we deliberately do NOT set Cursor's
  ``failClosed`` flag — same never-break-the-agent contract as claude_code.
  (Verified live 2026-08-19 on Cursor 3.16 / CLI 2026.08.11: a deny surfaces
  to the model as a blocked call with our reason.)

* **GitHub Copilot CLI**: hook config files under ``$COPILOT_HOME/hooks/``
  (default ``~/.copilot/hooks/``). We own a whole file
  (``clawmetry.json``) instead of merging into a shared one — Copilot loads
  every ``hooks/*.json``, so install/uninstall is write/delete of our file
  and can never clobber a foreign entry. Event ``preToolUse`` (camelCase =
  native payload: ``{sessionId, timestamp, cwd, toolName, toolArgs}`` where
  ``toolArgs`` is frequently a JSON *string*). The hook prints
  ``{"permissionDecision": "allow"|"deny"|"ask",
  "permissionDecisionReason": …}`` (reason required on deny). Copilot
  command preToolUse hooks are fail-closed on CRASH but treat empty output
  as "no opinion" — our client always exits 0, so failures stay fail-open.
  (Verified live 2026-08-19 on Copilot CLI 1.0.80.)

Both clients POST to the runtime's own receiver
(``/api/hooks/<runtime>/pretooluse`` in routes/hooks.py) so approvals are
attributed to the RIGHT runtime — reusing the claude-code receiver would
file every Cursor/Copilot pause as a claude_code approval.
```

</details>

#### 缺口

- 闭源DSH适配、Pro浪费检测和真实runtime覆盖无法从本仓核实
  **影响**：不能确认DSH可用或无标记代表健康
  **进一步探讨**：取得授权固定版本Pro材料或分别做真实runtime验收；未取得前不作DSH运行结论

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 何种范围可试用，如何验证覆盖状态合同？

**研究主题**：依赖、兼容与流程、效果与总成本、新假设与验证、采用判断

#### 完整回答

本地OpenClaw已有会话的用户可用非敏感样本试读统一视图，并逐条对照原JSONL；DSH用户暂观察，先补闭源适配依据。首次需Python/本地读权限，持续占用索引/数据库/界面资源；默认匿名安装ping及版本检查由作者说明，远程connect与hooks会改变部署边界，本轮不启用。由空会话/空flags多义性推导未验证假设：每个指标伴随来源、覆盖、启用状态及错误原因，可减少把盲区当健康。对正常、有缺字段、不可读文件、无Pro/委派失败的同批样本比较误判与定位时间；无改善或噪声成本更高则否定。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:33-44](https://github.com/vivekchand/clawmetry/blob/8b21164116f9ada864d7417321b039a41ae8da37/README.md#L33-L44)

部署和出网边界的作者说明

<details>
<summary>查看原文（12行）</summary>

```text
| | |
|---|---|
| **What it does** | Reads the session files and logs your agents already write. No SDK, no code change, no instrumentation in your app. |
| **What you see** | Session timeline, tool-by-tool replay, token and cost breakdown, and trajectory signals (looping, repeated failures) — per runtime. |
| **What's free** | `pip install clawmetry` reads **OpenClaw, NVIDIA NemoClaw, Goose and Qwen Code** with no account, no key and no network call. The other 28 — Claude Code, Codex, Cursor and the rest — are read by the closed-source `clawmetry-pro` companion, which arrives with the 7-day trial or a plan — see [docs/ENTITLEMENTS.md](docs/ENTITLEMENTS.md) for the exact split. |
| **How to start** | `pip install clawmetry && clawmetry`, then open localhost:8900. No agents on this machine yet? `clawmetry --sample` opens on three labelled synthetic sessions. |
| **What leaves your machine** | No session data, unless you run `clawmetry connect`. Two things do run by default, both opt-out and neither carrying session content: an anonymous install ping and a PyPI version check. Every destination is inventoried in [docs/EGRESS.md](docs/EGRESS.md), rebuilt from a wire capture rather than from reading comments. |

Two limits worth knowing before you judge the output: runtimes expose very
different data (some publish no cost at all — [the matrix](docs/compatibility.md)
says which, per runtime), and observing an action is not the same as being able
to block it ([which controls are real, per runtime](docs/APPROVALS.md)).
```

</details>

**依据 2 · 源码核查**：[routes/sessions.py:327-334](https://github.com/vivekchand/clawmetry/blob/8b21164116f9ada864d7417321b039a41ae8da37/routes/sessions.py#L327-L334)

来源envelope已有部分实现

```text
            # Issue #1773: honest envelope marker. The fast path tags itself
            # local_store, but _merge_unregistered_jsonls may have appended
            # filesystem_unregistered rows. Recompute from the row markers so
            # operators see the actual data path (vs. a misleading
            # "local_store" envelope that hides an ingest outage).
            fast["_source"] = _derive_envelope_source(
                fast["sessions"], fallback="local_store"
            )
```

**依据 3 · 源码核查**：[clawmetry/waste_flags.py:39-62](https://github.com/vivekchand/clawmetry/blob/8b21164116f9ada864d7417321b039a41ae8da37/clawmetry/waste_flags.py#L39-L62)

空结果多义性为假设依据

<details>
<summary>查看原文（24行）</summary>

```text
def compute_flags(signals: Any) -> list[dict]:
    """Compute per-run waste flags. Returns ``[]`` when clawmetry-pro is
    not installed (Free tier sees no waste-flag overlay)."""
    pro = _pro()
    if pro is None:
        return []
    try:
        return pro.compute_flags(signals)
    except Exception as exc:
        logger.warning("waste_flags.compute_flags delegation failed: %s", exc)
        return []


def compute_signals_from_events(events: Iterable[dict]) -> dict:
    """Reduce events into the signal dict ``compute_flags`` consumes.
    Returns ``{}`` when clawmetry-pro is not installed."""
    pro = _pro()
    if pro is None:
        return {}
    try:
        return pro.compute_signals_from_events(events)
    except Exception as exc:
        logger.warning("waste_flags.compute_signals delegation failed: %s", exc)
        return {}
```

</details>

#### 缺口

- 观察器资源开销、定位节时及覆盖合同效果未测
  **影响**：不能把独立进程等同系统零开销或节省已兑现
  **进一步探讨**：同负载下测解析资源、丢事件、错误健康判断及人工定位时间

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
