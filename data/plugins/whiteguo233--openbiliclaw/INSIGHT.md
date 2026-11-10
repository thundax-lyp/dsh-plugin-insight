# OpenBiliClaw 内容发现工具

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[8b76044](https://github.com/whiteguo233/OpenBiliClaw/tree/8b760446d38c1df04413b2b4d757e4fc14d5cf9e)

<!-- BEGIN META -->
[![GitHub ★ 3,721](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C721&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/whiteguo233/OpenBiliClaw)
<!-- END META -->

> **功能**：在本地运行跨平台内容发现与推荐工具，结合来源信号、个人画像和反馈。

> **亮点**：[Q01](#research-q01) 把跨平台事件和个人反馈接到统一推荐流程，并保留可追溯入库回执。

> **主要限制**：[Q01](#research-q01) 接受反馈后还需核对投影和认知。[Q02](#research-q02) 作者首轮真实发现部分完成，恢复证据来自后续刷新。[Q03](#research-q03) 导出 ZIP 可能包含敏感数据。

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
  - [Q01 · 根项目服务什么任务，收到反馈后实际发生哪些步骤？](#detail-section-11)
  - [Q02 · 首次初始化和免费模型限流怎样形成可见的恢复边界？](#detail-section-12)
  - [Q03 · 本地保存、云端处理和迁移文件各有什么边界？](#detail-section-13)
  - [Q04 · 怎样试用并检验反馈状态能否改善内容发现？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：愿意管理来源与反馈的个人，可在一个入口查看多个平台的内容推荐。

逐平台订阅、RSS 或关键词查询可以维护已知范围。共享画像将不同来源放到同一筛选流程，维护与隐私核查随之增加。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 跨平台信号 | 汇集不同来源内容与反馈 | 权限、登录和采集规则按来源不同 |
| 画像初始化 | 从已选来源生成画像并发现内容 | 发现可部分完成 |
| 推荐反馈 | 写入并跟进偏好 | 接收、投影和认知分别检查 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 本地 Python 后端与客户端 | 必需 | 记录事件、查询及推荐 | 回现有订阅 |
| 对应来源和授权 | 来源需要 | 采集公开或已授权信号 | 禁用对应来源 |
| 可用模型或运行时 | 画像和模型评估需要 | 整理画像与生成推荐 | 检查部分完成状态 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 配置 | 用户选隔离目录和单公开来源 | 数据去向可核对 |
| 使用 | 用户核对推荐和反馈日志 | 区分持久化及后续生效 |
| 退出 | 用户关闭来源与后台任务 | 按留存规则处理文件及备份 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 运行时和数据存储 | 配置来源、模型及授权 | 实际耗时依赖来源 |
| 持续 | 查询、推理与索引 | 核对推荐和数据去向 | 未测净成本 |
| 恢复 | 可能重试与备份 | 核对事件、部分画像和导出 | 未测恢复工时 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 推荐反馈 | 入库、投影和认知分开 | 画像最终变化 |
| 初始化 | 部分完成与限流等待 | 所有首次安装和来源 |
| 迁移 | 有界 ZIP 输出 | 实际用户对敏感文件的处理 |

> **思考**：[Q01](#research-q01) 接受反馈后还需核对投影和认知。[Q02](#research-q02) 作者首轮真实发现部分完成，恢复证据来自后续刷新。[Q03](#research-q03) 导出 ZIP 可能包含敏感数据。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把跨平台事件和个人反馈接到统一推荐流程，并保留可追溯入库回执。

初始化在状态写入时核对 run_id 和阶段顺序。限流等待复用截止时间，已开始输出的流不按该分支重放。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q01](#research-q01) 接受反馈后还需核对投影和认知。[Q02](#research-q02) 作者首轮真实发现部分完成，恢复证据来自后续刷新。[Q03](#research-q03) 导出 ZIP 可能包含敏感数据。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 仅在隔离环境评估单个公开来源与非敏感样本。阶段或数据边界不清时暂停后台任务并回订阅。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持根工具、反馈、初始化与备份机制。作者真实验收保留了首次发现失败与修复后恢复边界。本轮未运行代码或账号。

- 已检查：作者 README、包清单、源码路径 pyproject.toml、README.md、src/openbiliclaw/runtime/event_ingress.py、src/openbiliclaw/agent/tools/feedback_tools.py、src/openbiliclaw/runtime/init_coordinator.py、src/openbiliclaw/llm/sponsored_provider.py、docs/testing/2026-11-08-free-full-e2e.md、src/openbiliclaw/api/auth.py、docs/privacy.md、src/openbiliclaw/storage/migration.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：本次选中的根项目是 Python 内容发现工具，pyproject.toml 声明 0.3.235。报告顶部版本由装配器按 npm 清单读取，根目录没有该清单。未检查外部 DSH 桥的实现。
- 下一步：用固定候选对照订阅、反馈和用户判断，注入投影失败与限流，再验证恢复是否保留先前成功阶段。

**分析版本**

- **仓库**：[whiteguo233/OpenBiliClaw](https://github.com/whiteguo233/OpenBiliClaw)
- **版本号**：未声明（[固定提交 8b76044](https://github.com/whiteguo233/OpenBiliClaw/tree/8b760446d38c1df04413b2b4d757e4fc14d5cf9e)）
- **版本日期**：2026-11-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 在推荐旁分别展示反馈接收、投影及认知状态，可能减少误解和重复反馈。

用固定候选对照订阅、反馈和用户判断，注入投影失败与限流，再验证恢复是否保留先前成功阶段。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 668 | 169372 | — | — | 2357167 |
| .js | source | 46 | 51580 | 45686 | 2923 | — |
| .mjs | source | 17 | 2652 | 2247 | 227 | — |
| .ts | source | 114 | 40011 | 32392 | 4929 | — |
| .ts | test | 163 | 46517 | 41624 | 2340 | — |
| .md | example | 1 | 36 | — | — | 215 |
| .mjs | example | 12 | 816 | 782 | 109 | — |
| .mjs | test | 22 | 3669 | 3366 | 130 | — |

</details>

**活跃度**

[![Issue 未关闭 19](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=19&color=737b86&logo=github)](https://github.com/whiteguo233/OpenBiliClaw/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=9&color=737b86&logo=github)](https://github.com/whiteguo233/OpenBiliClaw/issues?q=is%3Aissue+created%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z) [![近30天关闭 10](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=10&color=737b86&logo=github)](https://github.com/whiteguo233/OpenBiliClaw/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z)



统计日期：2026-11-10。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：使用多个内容平台的用户，能否通过 OpenBiliClaw 获得可纠正的推荐，并理解采集、反馈、初始化和数据导出的边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根项目服务什么任务，收到反馈后实际发生哪些步骤？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

OpenBiliClaw 根项目是可单独运行的 Python 内容发现工具。包清单给出 openbiliclaw CLI，作者材料将 DSH 桥指向单独的 dsh-openbiliclaw 仓库。根工具服务于希望将多个平台的公开内容、个人已授权信号与推荐反馈放在一处的用户。一个可判断的任务是为某主题找若干此前未见但符合偏好的条目，再给一条明确负反馈。合格结果应看到内容来源和反馈是否入库，并能对照下一轮候选。逐站关注或用 RSS 可以低负担订阅已知来源；本工具把来源与反馈放进统一处理链，能探索已订阅范围之外的内容，也增加数据整理与核对工作。

反馈工具构造含推荐 ID、反馈类别、备注和来源平台的规范事件，以 request_id 作为 ingest_key 交给入口。入口逐项校验并返回插入、重复和拒绝计数，再通知后台拥有者。正常的新事件随后更新推荐投影，并尝试立即认知；立即认知失败只记延后。相同 ID 的重放会在投影之前返回去重。因而 durable event 已存在时，投影和画像仍可能处于较早状态，重复提交反馈也不能代替核对后台追赶。

#### 证据与依据

**依据 1 · 源码核查**：[pyproject.toml:5-17](https://github.com/whiteguo233/OpenBiliClaw/blob/8b760446d38c1df04413b2b4d757e4fc14d5cf9e/pyproject.toml#L5-L17)

确认 Python 根包名、版本和适用范围。

<details>
<summary>查看原文（13行）</summary>

```text
[project]
name = "openbiliclaw"
version = "0.3.235"
description = "Your local-first, cross-platform AI discovery friend for Bilibili, Zhihu, and more."
readme = "README.md"
license = { text = "MIT" }
requires-python = ">=3.11"
authors = [
    { name = "OpenBiliClaw Contributors" },
]
keywords = ["bilibili", "zhihu", "ai", "agent", "recommendation", "content-discovery", "cross-platform", "llm"]
classifiers = [
    "Development Status :: 2 - Pre-Alpha",
```

</details>

**依据 2 · 源码核查**：[pyproject.toml:116-117](https://github.com/whiteguo233/OpenBiliClaw/blob/8b760446d38c1df04413b2b4d757e4fc14d5cf9e/pyproject.toml#L116-L117)

实际 CLI 入口。

```text
[project.scripts]
openbiliclaw = "openbiliclaw.cli:app"
```

**依据 3 · 作者声明**：[README.md:35-45](https://github.com/whiteguo233/OpenBiliClaw/blob/8b760446d38c1df04413b2b4d757e4fc14d5cf9e/README.md#L35-L45)

作者明确把 DSH 桥和移动端指向独立仓库。

<details>
<summary>查看原文（11行）</summary>

```text
> ### 🆕 重要更新：OpenBiliClaw 现在可以装进 DeepSeek Harness
>
> 新增 **DSH 客户端插件** —— 把 OpenBiliClaw 装进 [DeepSeek Harness](https://github.com/deepseek-ai/DeepSeek-Harness)：DSH 界面常驻第四栏（推荐 / 内容库 / 对话 / 画像 / 设置），并注册 22 个 Agent Bridge 工具，让 DSH 里的 Agent 也能读推荐、答探测、闭环学习——边用 DSH 干活，边刷跨平台个性化内容。→ [`github.com/whiteguo233/dsh-openbiliclaw`](https://github.com/whiteguo233/dsh-openbiliclaw)
>
> 📱 想要原生 App？Flutter 移动端客户端（Android / iOS / Web / 桌面）在独立仓库 [`OpenBiliClaw-mobile`](https://github.com/whiteguo233/OpenBiliClaw-mobile)：推荐、对话、画像、收藏 / 稍后再看 / 30 天历史一应俱全，连接同一本地后端。

> 🇨🇳 **国内源**：[Gitee v0.3.235 源码](https://gitee.com/whiteguo233/openbiliclaw/tree/openbiliclaw-v0.3.235)已同步本版源码。安装包请从 [GitHub Release](https://github.com/whiteguo233/OpenBiliClaw/releases/tag/openbiliclaw-v0.3.235) 获取；[123 云盘](https://4001474255.share.123pan.cn/123pan/IxbZMh-90KO3)仍保留 v0.3.213 历史文件，最新版国内安装包镜像待更新。

## 10 秒看懂 OpenBiliClaw

一个纯本地、私有、开源的自进化跨平台内容发现 Agent：从你的跨平台使用、反馈和对话中持续深化心理画像，带着对你的理解主动去 B 站、小红书、抖音、YouTube、TikTok、X、知乎、Reddit、Linux.do、Bangumi、V2EX、微博、GitHub、Instagram 与自定义网站、RSS 来源找内容。
```

</details>

**依据 4 · 源码核查**：[src/openbiliclaw/runtime/event_ingress.py:101-110](https://github.com/whiteguo233/OpenBiliClaw/blob/8b760446d38c1df04413b2b4d757e4fc14d5cf9e/src/openbiliclaw/runtime/event_ingress.py#L101-L110)

实际生产入口优先使用带回执的持久化。

<details>
<summary>查看原文（10行）</summary>

```text
        if valid:
            await self._call_prepare_owner()
            memory_manager = (
                self._memory_manager_resolver()
                if self._memory_manager_resolver is not None
                else self._memory_manager
            )
            persist = getattr(memory_manager, "persist_events_with_receipts", None)
            if callable(persist):
                stored = await persist(valid)
```

</details>

**依据 5 · 源码核查**：[src/openbiliclaw/runtime/event_ingress.py:139-161](https://github.com/whiteguo233/OpenBiliClaw/blob/8b760446d38c1df04413b2b4d757e4fc14d5cf9e/src/openbiliclaw/runtime/event_ingress.py#L139-L161)

入库、重复、拒绝及唤醒后台分开。

<details>
<summary>查看原文（23行）</summary>

```text
            if len(stored) != len(valid):
                raise RuntimeError("event receipt count did not match accepted input count")
            for index, result in zip(valid_indexes, stored, strict=True):
                receipts[index] = EventIngressItemReceipt(
                    index=index,
                    event_type=str(result.event_type),
                    event_id=int(result.event_id),
                    inserted=bool(result.inserted),
                    duplicate=bool(result.duplicate),
                )
            self._wake_owner()

        ordered = tuple(receipts[index] for index in range(len(events)))
        inserted = sum(1 for item in ordered if item.inserted)
        duplicates = sum(1 for item in ordered if item.duplicate)
        rejected = sum(1 for item in ordered if item.error)
        return EventIngressReceipt(
            items=ordered,
            accepted=inserted + duplicates,
            inserted=inserted,
            duplicates=duplicates,
            rejected=rejected,
        )
```

</details>

**依据 6 · 源码核查**：[src/openbiliclaw/agent/tools/feedback_tools.py:136-179](https://github.com/whiteguo233/OpenBiliClaw/blob/8b760446d38c1df04413b2b4d757e4fc14d5cf9e/src/openbiliclaw/agent/tools/feedback_tools.py#L136-L179)

反馈持久化、投影、去重和认知跟进有独立分支。

<details>
<summary>查看原文（44行）</summary>

```text
    from openbiliclaw.sources.event_format import build_event

    event = build_event(
        event_type="feedback",
        source_platform=str(recommendation.get("source_platform") or "bilibili"),
        title=title,
        metadata={
            "recommendation_id": recommendation_id,
            "bvid": recommendation.get("bvid", ""),
            "feedback_type": feedback_type,
            "feedback_note": note,
            "event_namespace": "recommendation",
            "profile_update_owner": "content_feedback",
        },
    )
    event["ingest_key"] = request_id
    receipt = await maybe_await(ingress.accept(event, producer="chat_agent"))
    if receipt.accepted != 1 or receipt.rejected or not receipt.items:
        reason = receipt.items[0].error if receipt.items else "rejected"
        return f"反馈事件被拒绝: {reason}"
    item_receipt = receipt.items[0]

    label = _FEEDBACK_TYPE_LABELS[feedback_type]
    if item_receipt.duplicate:
        return f"该反馈已提交过（幂等去重），未重复记录：「{short(title, 40)}」的{label}。"

    # Durable first write is the commit boundary; the projection is a
    # retryable repair, same shape as the OpenClaw adapter path.
    await maybe_await(
        db.update_recommendation_feedback(
            recommendation_id,
            feedback_type=feedback_type,
            feedback_note=note,
        )
    )

    hook = getattr(ctx.soul_engine, "record_immediate_feedback_cognition", None)
    if item_receipt.inserted and callable(hook):
        try:
            await maybe_await(hook(feedback_type=feedback_type, title=title, note=note))
        except Exception:
            logger.warning("feedback cognition follow-up deferred", exc_info=True)

    return f"已记录对「{short(title, 40)}」的{label}反馈（事件 #{item_receipt.event_id}）。"
```

</details>

#### 缺口

- 没有用户推荐效果的独立对照或反馈投影失败恢复记录
  **影响**：不能断定最终画像或下一轮推荐一定更新
  **进一步探讨**：用固定候选和反馈事件观察入库、投影、认知和后续推荐

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 首次初始化和免费模型限流怎样形成可见的恢复边界？

**研究主题**：工程质量与复用、依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

初始化协调器在写锁内检查 run_id 与活动状态，拒绝让旧回调改写新运行或已终止状态。第 4 阶段开始前要求第 3 阶段画像已提交为 ok 或 warning；画像完成而发现超时时，完成记录可以携带 partial_success 和原因。心跳只更新时间和序列，独立于实质进度。这能区分后端活着、阶段完成和推荐尚未产出。

免费模型路径按运行时能力决定是否在 IPC 帧带 timeout_ms。返回 ID 匹配且错误被识别为本地分钟限流时，在原操作截止时间内等待 60 秒、用剩余预算重试。流式路径只有未交付 delta 且未重试过才使用该分支。这里避免把已经可见的回复无条件重放，也不能用来推断第三方限流或网络中断均能恢复。作者报告用两个免费模型和一个实际 B 站账号分别导入 1,055 条数据、生成画像。两组最初发现都部分完成。修复后以已有画像走真实刷新、聊天及重启检查，没有重新在空目录跑完全部偏好批次。报告还注明候选未发布，本次固定源码只能支持该分支的存在与作者记录的范围。

#### 证据与依据

**依据 1 · 源码核查**：[src/openbiliclaw/runtime/init_coordinator.py:271-293](https://github.com/whiteguo233/OpenBiliClaw/blob/8b760446d38c1df04413b2b4d757e4fc14d5cf9e/src/openbiliclaw/runtime/init_coordinator.py#L271-L293)

运行归属和阶段 3 → 4 闸门。

<details>
<summary>查看原文（23行）</summary>

```text
        async with self._write_lock:
            run = self._db.get_latest_init_run()
            # A terminal run can be followed by a new reservation before every
            # old callback/heartbeat has unwound. Never let a late writer build
            # its stage payload from the new run's row or publish a stale event.
            if run is None or str(run.get("run_id") or "") != str(run_id):
                return int(run.get("sequence") or self._seq) if run is not None else self._seq
            # The first terminal write owns the final snapshot. A provider task
            # can finish just after its sibling failed (or can briefly ignore
            # cancellation); its late heartbeat/progress must not mutate the
            # diagnostic timeline or replace failure with completion.
            if str(run.get("status") or "") not in _ACTIVE:
                return int(run.get("sequence") or self._seq)
            stages = json.loads(run["stages_json"]) if run.get("stages_json") else _initial_stages()
            # Defense in depth for the central initialization invariant: stage
            # 4 may never observe a draft/missing profile, even if a future
            # caller accidentally regresses the pipeline ordering.
            if stage == 4 and stage_status == "running":
                profile_stage = next((s for s in stages if int(s.get("n", 0)) == 3), None)
                if profile_stage is None or profile_stage.get("status") not in ("ok", "warning"):
                    raise RuntimeError(
                        "cannot start init stage 4 before the full profile stage is committed"
                    )
```

</details>

**依据 2 · 源码核查**：[src/openbiliclaw/runtime/init_coordinator.py:424-460](https://github.com/whiteguo233/OpenBiliClaw/blob/8b760446d38c1df04413b2b4d757e4fc14d5cf9e/src/openbiliclaw/runtime/init_coordinator.py#L424-L460)

心跳区分与可诊断部分完成。

<details>
<summary>查看原文（37行）</summary>

```text
    async def touch(self, run_id: str) -> None:
        """Liveness heartbeat: bump ``sequence`` + ``updated_at`` only.

        It does not advance ``progress_sequence`` / ``progress_at`` and does not
        publish an event. Front ends can therefore distinguish "backend owner is
        alive" from "the current operation made useful progress" without
        flooding SSE with content-free frames.
        """
        await self._write(run_id, substantive=False)

    async def complete(
        self,
        run_id: str,
        *,
        partial_success: bool = False,
        reason: str | None = None,
        detail: str | None = None,
    ) -> None:
        """Finish a run, retaining a diagnosable partial-success reason.

        A discovery timeout is deliberately not a hard failure once the profile
        exists. ``reason`` / ``detail`` let status consumers explain that
        degraded terminal state instead of presenting it as a silent success.
        """
        await self._write(
            run_id,
            status="completed",
            partial_success=partial_success,
            error_reason=reason,
            error_detail=detail,
            finished=True,
            event_type="init_completed",
            event_extra={
                "partial_success": partial_success,
                "reason": reason or "none",
                "detail": detail or "",
            },
```

</details>

**依据 3 · 源码核查**：[src/openbiliclaw/llm/sponsored_provider.py:67-82](https://github.com/whiteguo233/OpenBiliClaw/blob/8b760446d38c1df04413b2b4d757e4fc14d5cf9e/src/openbiliclaw/llm/sponsored_provider.py#L67-L82)

只识别本地限流，等待窗口固定 60 秒。

<details>
<summary>查看原文（16行）</summary>

```text
# burst (2026-11-08). Wait once, within the original operation deadline; never
# bypass the signed cap or replay an upstream request / visible stream.
LOCAL_RATE_WINDOW_SECONDS = 60.0
_STDERR_TAIL_BYTES = 4096

SPONSORED_ENABLED_ENV = "OPENBILICLAW_SPONSORED_ENABLED"
SPONSORED_RUNTIME_ENV = "OPENBILICLAW_SPONSORED_RUNTIME"
_TRUTHY_ENV_VALUES = frozenset({"1", "true", "yes", "on"})


def _is_local_rate_rejection(frame: Mapping[str, Any]) -> bool:
    error = frame.get("error")
    if frame.get("ok") is not False or not isinstance(error, Mapping):
        return False
    mapped = error_from_payload(error)
    return isinstance(mapped, SponsoredRateLimitedError) and mapped.is_local
```

</details>

**依据 4 · 源码核查**：[src/openbiliclaw/llm/sponsored_provider.py:144-150](https://github.com/whiteguo233/OpenBiliClaw/blob/8b760446d38c1df04413b2b4d757e4fc14d5cf9e/src/openbiliclaw/llm/sponsored_provider.py#L144-L150)

仅运行时支持时附带超时预算。

```text
    def _transport_budget(self, seconds: float) -> dict[str, int]:
        # Old signed SDKs reject unknown frame fields; negotiate the extension.
        return (
            {"timeout_ms": max(1, min(3_600_000, int(seconds * 1000)))}
            if self._request_timeouts
            else {}
        )
```

**依据 5 · 源码核查**：[src/openbiliclaw/llm/sponsored_provider.py:303-335](https://github.com/whiteguo233/OpenBiliClaw/blob/8b760446d38c1df04413b2b4d757e4fc14d5cf9e/src/openbiliclaw/llm/sponsored_provider.py#L303-L335)

普通请求在一个截止时间内等待、重试或终止。

<details>
<summary>查看原文（33行）</summary>

```text
            deadline = asyncio.get_running_loop().time() + self._operation_timeout(
                contract.operation
            )
            try:
                await write_frame_async(process.stdin, request)
            except (SponsoredError, OSError) as exc:
                await self._stop_process()
                raise SponsoredUnavailableError(
                    "failed to write to sponsored runtime",
                    task_id=contract.task_id,
                ) from exc

            try:
                async with asyncio.timeout_at(deadline):
                    response = await read_frame_async(process.stdout)
                    if response.get("id") == request_id and _is_local_rate_rejection(response):
                        logger.info("Waiting for sponsored local RPM window before one retry")
                        await asyncio.sleep(LOCAL_RATE_WINDOW_SECONDS)
                        request_id = uuid.uuid4().hex
                        request = {
                            **request,
                            "id": request_id,
                            **self._transport_budget(deadline - asyncio.get_running_loop().time()),
                        }
                        await write_frame_async(process.stdin, request)
                        response = await read_frame_async(process.stdout)
            except TimeoutError as exc:
                self._cancel_in_flight(process, request_id)
                await self._stop_process()
                raise SponsoredUnavailableError(
                    "sponsored runtime timed out",
                    task_id=contract.task_id,
                ) from exc
```

</details>

**依据 6 · 源码核查**：[src/openbiliclaw/llm/sponsored_provider.py:675-713](https://github.com/whiteguo233/OpenBiliClaw/blob/8b760446d38c1df04413b2b4d757e4fc14d5cf9e/src/openbiliclaw/llm/sponsored_provider.py#L675-L713)

可见流不重放，未发出 delta 才能尝试一次。

<details>
<summary>查看原文（39行）</summary>

```text
            try:
                async with asyncio.timeout_at(deadline):
                    await write_frame_async(process.stdin, request)
                    while True:
                        frame = await read_frame_async(process.stdout)
                        if frame.get("id") != request_id:
                            raise SponsoredProtocolError("mismatched stream response id")
                        if frame.get("type") == "delta":
                            delta = frame.get("content")
                            if not isinstance(delta, str):
                                raise SponsoredProtocolError("invalid stream delta")
                            emitted = True
                            yield LLMStreamChunk(delta=delta)
                            continue
                        if frame.get("type") != "result":
                            raise SponsoredProtocolError("invalid stream terminal")
                        if frame.get("ok") is not True:
                            if (
                                not emitted
                                and not local_retried
                                and _is_local_rate_rejection(frame)
                            ):
                                logger.info("Waiting for sponsored local RPM window before stream")
                                await asyncio.sleep(LOCAL_RATE_WINDOW_SECONDS)
                                local_retried = True
                                request_id = uuid.uuid4().hex
                                request = {
                                    **request,
                                    "id": request_id,
                                    **self._transport_budget(
                                        deadline - asyncio.get_running_loop().time()
                                    ),
                                }
                                await write_frame_async(process.stdin, request)
                                continue
                            error = frame.get("error")
                            if not isinstance(error, Mapping):
                                raise SponsoredProtocolError("invalid stream error")
                            raise error_from_payload(error, task_id=contract.task_id)
```

</details>

**依据 7 · 作者声明**：[docs/testing/2026-11-08-free-full-e2e.md:1-15](https://github.com/whiteguo233/OpenBiliClaw/blob/8b760446d38c1df04413b2b4d757e4fc14d5cf9e/docs/testing/2026-11-08-free-full-e2e.md#L1-L15)

作者真实验收条件及首次失败。

<details>
<summary>查看原文（15行）</summary>

```text
# 免费模型完整真实流程验收（2026-11-08，未发布）

本轮从 PC 首次设置页开始，两个独立数据目录分别只选 Qwen/Qwen3-8B 或 Qwen/Qwen3.5-4B，默认向量选 BAAI/bge-m3。使用本机已登录 B 站账号与实际 SiliconFlow HTTPS 请求、新版 Rust 本地候选（验签策略，无 mock、无 unsigned 模式）；用户现有应用配置/画像不变。候选没有 OS 公证，本报告不是安装包发布声明。

每组实际拉取并入库 500 条历史、455 条收藏、100 条关注，共 1,055 条；每组偏好分析分为 39 批。页面保留默认并发 3、显式超时 60 分钟（该值按阶段应用）；刷新页面不取消或重开任务。两个免费模型没有跨模型兜底。

## 本轮新增发现与修复

4B 的历史导入、39 批偏好分析、完整画像持久化成功，但初轮发现零候选，初始化以 `discovery_partial` 部分完成结束。实际 Rust 错误为 `RATE_LIMITED: local rate limit reached`，随后 Provider cooldown 令发现、聊天失败。不是上下文长度错误或模型请求超时。

签名策略的 RPM 为 300。画像完成后集中生成向量，聊天/向量工作进程共享的安装账本达到分钟窗口上限；立即失败与快速重试没有给窗口恢复时间。保留第一轮失败，不能以稍后重试结果覆盖。

修复仅对 Rust 明确的本地分钟限流拒绝等待 60 秒、同任务重试一次；等待和再次请求共用原截止时间，向 Rust 传递剩余预算。签名 cap 不变、不清空账本、不关安全校验；上游 429、凭据/配额/策略错误不使用这条等待。流式一旦交付任何 delta 则不重放；取消关闭进程，持续本地限流不在 SDK 内部两模型互备之间反复尝试。

回归先 7 failed / 3 passed；修复后新增 16 项（含取消、剩余预算、禁止跨模型重试）通过，相关五组测试 82 passed。完整 Sponsored 相关回归 331 passed、1 skipped；最终配置/API/前端相关 51 passed，另补真实语言变化拒绝快捷切换 2 passed。部分测试集重叠，不相加计总数。
```

</details>

**依据 8 · 作者声明**：[docs/testing/2026-11-08-free-full-e2e.md:18-34](https://github.com/whiteguo233/OpenBiliClaw/blob/8b760446d38c1df04413b2b4d757e4fc14d5cf9e/docs/testing/2026-11-08-free-full-e2e.md#L18-L34)

作者报告修复后沿用已生成画像进行恢复。

<details>
<summary>查看原文（17行）</summary>

```text
## 完成结果（跨午夜至 2026-11-09）

| 项目 | Qwen3-8B | Qwen3.5-4B |
| --- | --- | --- |
| 真实导入 / 偏好批次 | 1,055 条 / 39 of 39 | 1,055 条 / 39 of 39 |
| 偏好阶段最后一次耗时采样 | 1,480 秒，约 25 分钟 | 960 秒，约 16 分钟 |
| 画像生成与持久化 | 通过 | 通过 |
| 修复后两轮真实流式聊天 / 上下文 | 通过 | 通过 |
| 三路并发聊天 | 3/3，1 条走同一持久任务的后台接续 | 3/3，全部实时流式 |
| `get_profile` 工具真实执行并总结 | 通过 | 通过 |
| 推荐卡片与重复反馈只入库一次 | 通过 | 通过 |
| 重启后画像、原模型、6 条已完成会话 | 保留；真实模型和 BGE 探测通过 | 保留；真实模型和 BGE 探测通过 |
| 重启后读取到的推荐数 | 12 | 15 |

耗时是这一次服务状态下的观察，不是性能基准或 SLA。8B 末轮两轮对话分别 50.21 / 3.55 秒；三路并发总耗时 112.99 秒。4B 两轮为 0.99 / 31.47 秒，三路并发 25.78 秒。并发任务的 admission/SSE 连接有独立 30 秒交接边界；8B 一条由现有 durable worker 接续，查询同一 turn 验证内容与持久化，未重复提交。最初验收脚本只把 SSE error 当终态，因此曾误判这类已经完成的任务；原判定保留，后续按前端实际查询持久任务的行为验证。

两组最初的阶段 4 均为 **warning / discovery_partial**，不能标成初次全流程零错误通过。修复后保留各自已生成画像，通过真实推荐刷新入口重新验证发现、评分、文案、反馈与聊天；没有再次从空目录重复全部 39 批。首次成功的画像阶段、故障阶段的恢复、独立真实限流复现与重启持久化共同构成本轮证据。
```

</details>

**依据 9 · 作者声明**：[docs/testing/2026-11-08-free-full-e2e.md:45-51](https://github.com/whiteguo233/OpenBiliClaw/blob/8b760446d38c1df04413b2b4d757e4fc14d5cf9e/docs/testing/2026-11-08-free-full-e2e.md#L45-L51)

作者验收覆盖与未发布限制。

```text
PC 从 4B 切到 8B 时，完整配置仅有默认链和等价语言值 `zh` → `zh-Hans` 变化，却误走完整重建、等待学习任务。对应回归先 4 failed / 4 passed；规范等价语言后，API/单独 worker 两种模式均可原地切链。实际 PC 4B → 8B → 4B 双向保存的 apply-status 均为 applied，切到 8B 的真实探测也成功。两个内置 LLM 卡片没有编辑/删除入口，免费 BGE 的模型和维度只读。

Ruff、MyPy（413 源文件）、两个修改 JS 的语法检查、隔离配置的 `config-show` 通过；未重跑约 1.4 万项全量测试。本轮浏览器操作覆盖首次设置和 PC 配置页，手机只检查 HTTP 页面可访问，插件只做共享接口/静态回归；没有测试所有来源、平台系统、付费模型、图片能力或安装包发布。

本机钥匙串初始拒绝访问，用户解锁后恢复，未跳过安全检查。重启脚本初次 30 秒等待短于应用排空时间，且一次错读 API embedding 字段层级；修正测试脚本后两组重启验证完成。只读字段、鉴权、签名策略、TLS 校验均未放松。两组测试服务已经正常停止，代理创建的浏览器页已关闭；用户原应用与主工作区未改动。

脱敏统计见 [summary.json](assets/free-full-e2e-20261108/summary.json)。原始历史、画像、Cookie、配置、会话正文及服务日志保留在本机私有测试目录，没有加入仓库。候选 Rust 的短期验签策略及公开仓修复仍需按正常流程构建、签名、合并和发布；当前安装包不包含本分支的这些新修复。
```

#### 缺口

- 无当前签名安装包与免费服务重放
  **影响**：不能判断实际用户安装能否获得修复、首次耗时或稳定性
  **进一步探讨**：以签名发行物在空目录完成一次限流、刷新、关闭和恢复验收

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 本地保存、云端处理和迁移文件各有什么边界？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、效果与总成本

#### 完整回答

授权范围按来源变化。作者的接入表称部分平台使用登录浏览器会话，GitHub 公开发现由后端匿名获取；同一浏览器已登录并不说明所有来源都使用同一种 Cookie 策略。认证实现会解析客户端与代理、区分本机来源，再按 Origin 和 bearer 条件处理。此次只检查代表性接线，没有授权实际采集或访问登录态。

配置、SQLite、日志与画像由用户环境保存，作者说明用户选择云端模型或 embedding 后，所需内容可能发送给对应服务。迁移导出的实现以普通 ZIP 压缩清单及文件并限制体积，文件权限是本机保护，内容没有加密。作者说明导出排除整个源机 API auth 段，但平台 Cookie、配置 Key、浏览历史或画像仍可能随包复制。禁用来源和后台任务能限制后续收集，处理已保存的数据和已经提交的云端上下文另需核对。首次成本包括安装、来源连接、模型或运行时与导入；持续成本有发现请求、画像推理、筛选和账单核对；失败恢复要处理部分状态及敏感备份。应按一次得到合格的有用推荐任务记录资源与人工时间。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:810-821](https://github.com/whiteguo233/OpenBiliClaw/blob/8b760446d38c1df04413b2b4d757e4fc14d5cf9e/README.md#L810-L821)

作者对照各来源的授权和读取方式。

<details>
<summary>查看原文（12行）</summary>

```text
| **小红书** | 被动收集 · 搜索 · 创作者订阅 · 初始化导入 | 插件在已登录页面读取，零后端爬取 |
| **抖音** | 初始化导入 · 搜索 · 热点 · 推荐流 | CLI/daemon 共用正式 producer，插件后台 tab 模拟 DOM 操作，候选统一进入待评估池 |
| **YouTube** | 初始化导入 · Takeout 离线导入 · 搜索 / 热门 / 频道 | 插件读画像信号，日常发现后端直连补池 |
| **TikTok**（v0.3.229 起，v0.3.231 正式可用） | 推荐流 · 话题 · 创作者 · 登录后关键词搜索 | 默认关闭；访客发现与插件同步登录后的搜索已实测，桌面/手机 Web 可消费推荐；非空账号画像/增量待验，站内收藏暂缓。[详情](docs/modules/tiktok.md) |
| **X（Twitter）** | 初始化导入 · 搜索 · For-You · 关注作者 | discovery 使用服务端只读 cookie 重放；原生书签 executor 已接入但未实号验证 |
| **知乎** | 初始化导入 · 搜索 · 热榜 · 推荐 · 作者 · 相关 | 插件在已登录 tab 内读取，返回文字卡片 |
| **Reddit** | 初始化导入 · 搜索 · 热门 · Subreddit · 相关 | discovery 默认 rdt-cli；Saved executor 已接入但未实号验证 |
| **Linux.do** | 书签 / 点赞 / 阅读记录初始化 · 搜索 · 热门 · 最新 · 作者 · 相关 | 插件在真实 `linux.do` 任务 tab 内执行同源只读 GET；公开发现无需登录，不上传 Cookie 或原始响应 |
| **Bangumi** | 公开收藏初始化 · 搜索 · 排名 · 按日期浏览 | 官方匿名只读 API；无需 Cookie/token，日期结果可能含未播条目 |
| **V2EX** | 搜索 · Node · Tab · 热门 · 最新 | 官方匿名 API / JSON Feed；PAT 可选增强 API 2.0，Topic 为无封面文字卡 |
| **GitHub** | starred repositories 初始化 · 搜索 · 排名 · 最新 | 官方 REST API；匿名可用、PAT 可选，强制只读公开 repository，无封面文字卡 |
| **Instagram** | topic / creator 发现 · 点赞 / 收藏 / 关注初始化 | v0.3.227 起提供、默认关闭；同一浏览器登录后有界导入本人信号，Cookie 不出浏览器；推荐卡收藏仅本地保存。[实测范围](docs/platform-source-acceptance.instagram.md) |
```

</details>

**依据 2 · 源码核查**：[src/openbiliclaw/api/auth.py:130-165](https://github.com/whiteguo233/OpenBiliClaw/blob/8b760446d38c1df04413b2b4d757e4fc14d5cf9e/src/openbiliclaw/api/auth.py#L130-L165)

服务端可信客户端与 Origin 是独立判断。

<details>
<summary>查看原文（36行）</summary>

```text
    def resolve_client(self, request: HTTPConnection) -> tuple[str | None, bool]:
        peer = request.client.host if request.client else ""
        try:
            xff_values = request.headers.getlist("x-forwarded-for")
        except AttributeError:  # pragma: no cover - non-starlette headers
            single = request.headers.get("x-forwarded-for")
            xff_values = [single] if single else []
        has_fwd = auth_core.header_present(request.headers)
        return auth_core.resolve_client_ip(
            peer,
            xff_values=xff_values,
            has_forward_header=has_fwd,
            trusted_proxies=self.auth.trusted_proxies,
        )

    def is_trusted_local(self, request: HTTPConnection) -> bool:
        if not self.auth.trust_loopback:
            return False
        client_ip, local = self.resolve_client(request)
        if not auth_core.is_trusted_local(client_ip, local):
            return False
        # A loopback peer is not enough: the user's browser can be driven by a
        # malicious page to issue cross-origin requests to http://127.0.0.1,
        # which would otherwise inherit the local bypass (localhost CSRF / DNS
        # rebinding). Only grant the bypass to non-cross-origin-browser callers:
        # no Origin (CLI/curl/non-browser), the local web UI itself (same-origin),
        # a browser extension, or an explicitly allow-listed origin. See review r7.
        return self._origin_safe_for_local(request)

    def _origin_safe_for_local(self, request: HTTPConnection) -> bool:
        origin = request.headers.get("origin")
        if auth_core.is_extension_origin(origin):
            return True
        # NOTE: allowed_bearer_origins are deliberately NOT treated as
        # trusted-local. They are the cross-origin case that authenticates via a
        # bearer *token*; granting them a no-token local bypass would also hand
```

</details>

**依据 3 · 源码核查**：[src/openbiliclaw/api/auth.py:205-233](https://github.com/whiteguo233/OpenBiliClaw/blob/8b760446d38c1df04413b2b4d757e4fc14d5cf9e/src/openbiliclaw/api/auth.py#L205-L233)

bearer 与浏览器来源筛选。

<details>
<summary>查看原文（29行）</summary>

```text
    def _extract_bearer(self, request: HTTPConnection) -> str | None:
        authz = request.headers.get("authorization", "")
        if authz.lower().startswith("bearer "):
            return authz[7:].strip() or None
        return None

    def pick_token(self, request: HTTPConnection) -> tuple[bool, str | None]:
        """Return ``(used_cookie, token)``.

        Extension origins can use an explicit Bearer session. Non-extension
        origins use cookie-first then the bearer-origin allow-list. Query
        tokens are deliberately excluded; their narrow transports handle them
        explicitly at their call sites.
        """
        origin = request.headers.get("origin", "")
        bearer = self._extract_bearer(request)
        if auth_core.is_extension_origin(origin) or (not origin and bearer):
            # Chrome extension fetches do not consistently send Origin on GET,
            # even when they send Authorization. Ordinary browser pages cannot
            # create this shape: adding Authorization triggers CORS and Origin.
            # Non-browser Bearer clients are valid here as well.
            return False, bearer
        # Non-extension path: cookie first, then allowed_bearer_origins
        cookie = request.cookies.get(COOKIE_NAME)
        if cookie:
            return True, cookie
        if auth_core.origin_allowed_for_bearer(origin, self.auth.allowed_bearer_origins):
            return False, self._extract_bearer(request)
        return False, None
```

</details>

**依据 4 · 作者声明**：[docs/privacy.md:89-103](https://github.com/whiteguo233/OpenBiliClaw/blob/8b760446d38c1df04413b2b4d757e4fc14d5cf9e/docs/privacy.md#L89-L103)

作者描述云处理、存储和迁移内容。

<details>
<summary>查看原文（15行）</summary>

```text
数据迁移请求只允许后端验证为本机 loopback 的调用；浏览器请求还必须具备同源意图并明确拒绝扩展 Origin，无 Origin 的本机 CLI / curl 调用仍可通过同一显式请求头契约。导出文件由本机后端返回给本机客户端，导入文件只上传到用户自己的本机后端；OpenBiliClaw 开发者不会接收迁移包。用户后续主动把文件复制到 U 盘、局域网、聊天工具或云盘时，相应传输与保留由用户和所选服务控制。

如果用户在后端中配置了云端大模型、embedding 服务或其他第三方 API，后端可能会把完成画像、总结、推荐解释或语义处理所需的内容发送给这些用户配置的服务提供方。这属于用户后端配置产生的数据流，不是插件直接调用远程代码或遥测服务。用户应同时查看所选服务提供方的隐私政策。

## 本地存储与保留

海外封面缓存未命中且项目网络策略实际选用代理时，后端通过同一代理向 Cloudflare 的固定 `https://1.1.1.1/dns-query` 查询公开 CDN 域名的 A/AAAA 地址，再校验为公网 IP 并固定连接，防止重绑定访问内网。Cloudflare 可见 CDN 域名、查询时间与代理出口地址；不会收到 Instagram 账号、Cookie、封面 URL 的路径/签名参数或画像。DNS 查询不跟随重定向，失败不绕过安全检查。国内 CDN 和 `network.mode=direct` 使用本机 DNS，不走此 DoH 服务；缓存命中不触发查询。这是封面安全传输依赖，不是统计或遥测。

公开 Web / RSS / Atom / JSON Feed 来源在配置实际选择代理时也复用该 DNS 服务：仅查询已批准请求域的公开域名，Cloudflare 可见域名、查询时间及代理出口，不收到订阅路径、文章内容、Cookie 或画像。直连和系统代理排除项通常使用本机 DNS；公开 Web 和 Ego 的公共 DNS 预检若发现域名答案全部为 `198.18.0.0/15` 代理合成地址，也向该服务查询并验证真实公共地址，Cloudflare 可见域名及当前查询出口地址。网站请求仍遵循原路由，Ego 不因此获得 socket pin 保证。文章链接范围本身不触发这些查询或文章抓取。

插件会使用浏览器的本地扩展存储保存设置、连接状态、缓存配置和 UI 状态。OpenBiliClaw 后端会在用户本机或自托管环境中保存配置文件、SQLite 数据库、日志和画像文件。

Instagram 执行中的任务会在扩展 `storage.local` 临时保存有界 task / claim、任务 tab、deadline、分页进度、已归一化内容与待确认的 exact-result outbox，以便浏览器或扩展重启后恢复。后端确认或明确终态拒绝后清理；离线待重试时会继续保留，卸载扩展会清除这些扩展数据。此状态不含 Instagram Cookie、请求头、CSRF、原始 JSON/HTML 或挑战页正文；旧 `storage.session` 状态只迁移一次。

用户主动导出的 `.obcbackup` 是**未加密的敏感 ZIP 文件**，可能包含模型 / 来源 API Key、平台 Cookie、画像和浏览 / 推荐历史。包内 manifest 带成员大小与 SHA-256，只用于完整性校验，不提供保密性。导出会合并磁盘 `config.toml` / `config.local.toml`、移除整段 `[api.auth]`，再写成包内单份可移植配置；因此源机的登录密码 / hash、session secret、设备访问 key 及其它 auth 策略不会进入包。导出同时刻意排除日志、旧备份、embedding / 评测 / 临时缓存、证书、自启动文件、`data/tailnet/` 节点私钥 / 状态和 `data/bin/` 可执行文件（根目录名按大小写不敏感判定）、OpenBiliClaw Web / 扩展访问会话、外部 CLI 凭据和环境变量值；平台登录 Cookie 则属于明确包含的可移植敏感数据。manifest 的 `source_omitted_environment_variables` 只记录源机当时有值、会影响 OpenBiliClaw 的环境变量名称，包括 `OPENBILICLAW_*`、Gemini 标准 Key 变量及系统代理 / CA 变量；导入端另返回 `target_active_environment_variables`，提示目标环境当前仍可能覆盖导入文件。两个列表都不包含变量值。用户应只在可信设备间传递，并及时删除不再需要的副本。
```

</details>

**依据 5 · 源码核查**：[src/openbiliclaw/storage/migration.py:582-614](https://github.com/whiteguo233/OpenBiliClaw/blob/8b760446d38c1df04413b2b4d757e4fc14d5cf9e/src/openbiliclaw/storage/migration.py#L582-L614)

普通 ZIP 写入、大小上限与权限设置。

<details>
<summary>查看原文（33行）</summary>

```text
        timestamp = exported_at.strftime("%Y%m%d-%H%M%S")
        filename = f"openbiliclaw-backup-{timestamp}{MIGRATION_ARCHIVE_SUFFIX}"
        archive_path = temp_root / filename
        with (
            _BoundedArchiveFile(
                archive_path,
                MAX_MIGRATION_ARCHIVE_BYTES,
            ) as archive_output,
            zipfile.ZipFile(
                cast("BinaryIO", archive_output),
                mode="w",
                compression=zipfile.ZIP_DEFLATED,
                compresslevel=6,
                allowZip64=True,
            ) as archive,
        ):
            archive.write(manifest_path, "manifest.json")
            for entry in archive_entries:
                archive_name = str(entry["path"])
                archive.write(
                    snapshot_root / Path(*PurePosixPath(archive_name).parts), archive_name
                )
        if archive_path.stat().st_size > MAX_MIGRATION_ARCHIVE_BYTES:
            raise MigrationError("迁移包超过 2 GB 下载上限。", code="archive_too_large")
        # The snapshot can be much larger than its compressed archive. It is no
        # longer needed once ZIP finalization succeeds, so never retain both for
        # the lifetime of a slow browser download.
        shutil.rmtree(snapshot_root)
        _chmod_private(archive_path)
        return MigrationExport(
            path=archive_path,
            filename=filename,
            file_count=len(entries),
```

</details>

**依据 6 · 作者声明**：[docs/privacy.md:107-114](https://github.com/whiteguo233/OpenBiliClaw/blob/8b760446d38c1df04413b2b4d757e4fc14d5cf9e/docs/privacy.md#L107-L114)

作者列出用户侧停止和数据清除入口。

```text
用户可以通过以下方式控制或删除数据：

- 在浏览器中移除 OpenBiliClaw 插件，或清除插件站点 / 扩展数据。
- 停止或删除本地 OpenBiliClaw 后端的数据目录。
- 在插件设置中修改或清空后端地址。
- 在后端配置中关闭对应平台 source、调度任务、自动刷新或第三方模型服务。
- 源码 / 一句话安装可运行 `openbiliclaw tailnet disable` 并重启以停止应用内 Tailnet；桌面安装包需完整退出、把运行目录 `config.toml` 的 `[tailnet].enabled` 改为 `false` 后再启动。两种方式都会为方便再次启用而保留本机节点身份。若要彻底删除，应先退出应用、从 Tailnet 管理台移除节点，再删除 `data/tailnet/`。
- 退出对应内容平台账号或清除浏览器 cookie，阻止插件继续同步该平台登录态。
```

#### 缺口

- 没有真实账号抓包、第三方留存或迁移包验证
  **影响**：不能推断所有来源最小化或第三方删除
  **进一步探讨**：用单来源和无敏感数据检查目的地、出站字段与导出成员

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样试用并检验反馈状态能否改善内容发现？

**研究主题**：采用判断、新假设与验证

#### 完整回答

愿意比较跨平台发现效果的用户，可先在隔离目录选一个公开来源，限定模型去向和主题，用少量非敏感数据完成一次推荐刷新。只评估新发现条目是否相关，先检查反馈事件和后续推荐状态。若初始化只有画像而无发现、反馈投影久不更新或数据去向不清，停止后台任务，回到原平台订阅或原有 RSS。不要用作者的首次使用样例推断全部平台、真实服务或当前安装物的稳定性。

设计假设是让用户查看某条推荐受哪些来源与反馈影响，并分别显示反馈已接收、投影完成和认知待处理，再提供纠正或撤销入口。对照当前单条已记录反馈的提示，构造一组已知正负偏好，比较有无阶段与来源提示时的误解、重复反馈、发现延迟及下一轮推荐相关性。若界面只增加解释文字、没有减少重复反馈或提高合格推荐，或者暴露了不必要的私人来源，假设不成立。

#### 证据与依据

**依据 1 · 源码核查**：[src/openbiliclaw/agent/tools/feedback_tools.py:151-179](https://github.com/whiteguo233/OpenBiliClaw/blob/8b760446d38c1df04413b2b4d757e4fc14d5cf9e/src/openbiliclaw/agent/tools/feedback_tools.py#L151-L179)

当前反馈回执与认知不是同一状态。

<details>
<summary>查看原文（29行）</summary>

```text
    event["ingest_key"] = request_id
    receipt = await maybe_await(ingress.accept(event, producer="chat_agent"))
    if receipt.accepted != 1 or receipt.rejected or not receipt.items:
        reason = receipt.items[0].error if receipt.items else "rejected"
        return f"反馈事件被拒绝: {reason}"
    item_receipt = receipt.items[0]

    label = _FEEDBACK_TYPE_LABELS[feedback_type]
    if item_receipt.duplicate:
        return f"该反馈已提交过（幂等去重），未重复记录：「{short(title, 40)}」的{label}。"

    # Durable first write is the commit boundary; the projection is a
    # retryable repair, same shape as the OpenClaw adapter path.
    await maybe_await(
        db.update_recommendation_feedback(
            recommendation_id,
            feedback_type=feedback_type,
            feedback_note=note,
        )
    )

    hook = getattr(ctx.soul_engine, "record_immediate_feedback_cognition", None)
    if item_receipt.inserted and callable(hook):
        try:
            await maybe_await(hook(feedback_type=feedback_type, title=title, note=note))
        except Exception:
            logger.warning("feedback cognition follow-up deferred", exc_info=True)

    return f"已记录对「{short(title, 40)}」的{label}反馈（事件 #{item_receipt.event_id}）。"
```

</details>

**依据 2 · 源码核查**：[src/openbiliclaw/runtime/init_coordinator.py:434-460](https://github.com/whiteguo233/OpenBiliClaw/blob/8b760446d38c1df04413b2b4d757e4fc14d5cf9e/src/openbiliclaw/runtime/init_coordinator.py#L434-L460)

首次发现可部分完成，适合作为对照。

<details>
<summary>查看原文（27行）</summary>

```text
    async def complete(
        self,
        run_id: str,
        *,
        partial_success: bool = False,
        reason: str | None = None,
        detail: str | None = None,
    ) -> None:
        """Finish a run, retaining a diagnosable partial-success reason.

        A discovery timeout is deliberately not a hard failure once the profile
        exists. ``reason`` / ``detail`` let status consumers explain that
        degraded terminal state instead of presenting it as a silent success.
        """
        await self._write(
            run_id,
            status="completed",
            partial_success=partial_success,
            error_reason=reason,
            error_detail=detail,
            finished=True,
            event_type="init_completed",
            event_extra={
                "partial_success": partial_success,
                "reason": reason or "none",
                "detail": detail or "",
            },
```

</details>

**依据 3 · 作者声明**：[docs/testing/2026-11-08-free-full-e2e.md:28-34](https://github.com/whiteguo233/OpenBiliClaw/blob/8b760446d38c1df04413b2b4d757e4fc14d5cf9e/docs/testing/2026-11-08-free-full-e2e.md#L28-L34)

作者保留投影与阶段恢复证据的限制。

```text
| 推荐卡片与重复反馈只入库一次 | 通过 | 通过 |
| 重启后画像、原模型、6 条已完成会话 | 保留；真实模型和 BGE 探测通过 | 保留；真实模型和 BGE 探测通过 |
| 重启后读取到的推荐数 | 12 | 15 |

耗时是这一次服务状态下的观察，不是性能基准或 SLA。8B 末轮两轮对话分别 50.21 / 3.55 秒；三路并发总耗时 112.99 秒。4B 两轮为 0.99 / 31.47 秒，三路并发 25.78 秒。并发任务的 admission/SSE 连接有独立 30 秒交接边界；8B 一条由现有 durable worker 接续，查询同一 turn 验证内容与持久化，未重复提交。最初验收脚本只把 SSE error 当终态，因此曾误判这类已经完成的任务；原判定保留，后续按前端实际查询持久任务的行为验证。

两组最初的阶段 4 均为 **warning / discovery_partial**，不能标成初次全流程零错误通过。修复后保留各自已生成画像，通过真实推荐刷新入口重新验证发现、评分、文案、反馈与聊天；没有再次从空目录重复全部 39 批。首次成功的画像阶段、故障阶段的恢复、独立真实限流复现与重启持久化共同构成本轮证据。
```

#### 缺口

- 无与订阅基线和可解释反馈界面的用户对照
  **影响**：无法量化相关性与净人工时间
  **进一步探讨**：固定候选集和主题做交叉试验，记录来源暴露、反馈状态与合格推荐

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
