# OpenBiliClaw 本地内容发现后端

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[23de203](https://github.com/whiteguo233/OpenBiliClaw/tree/23de203a72a9b59d2c555d66b9e70ab75583aa2c)

<!-- BEGIN META -->
[![GitHub ★ 3,593](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C593&color=yellow&logo=github&style=flat)](https://github.com/whiteguo233/OpenBiliClaw)
<!-- END META -->

> **实现功能**：集中跨平台内容信号、个人画像和反馈，提供本地运行的个性化发现与推荐服务。

> **核心亮点**：[Q01](#research-q01)、[Q02](#research-q02) 把跨平台信号与显式纠正集中成个人可维护的推荐控制流程，贡献在控制权和反馈组织；外仓DSH桥能力不归根。

> **风险与缺陷**：[Q03](#research-q03) 本地存储不等于数据不出机，远程LLM配置会收到画像构造输入；精细心理描述和解释不证明更懂用户，需本人盲评。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 启动与依赖](#detail-section-4)
  - [1.4 启动步骤](#detail-section-5)
  - [1.5 成本](#detail-section-6)
  - [1.6 效果](#detail-section-7)
  - [1.7 工程亮点](#detail-section-8)
  - [1.8 主要限制](#detail-section-9)
  - [1.9 使用建议](#detail-section-10)
  - [1.10 核查说明与分析版本](#detail-section-11)
- [2 未来设计假设（未验证）](#detail-section-12)
- [3 辅助信息](#detail-section-13)
- [4 研究问题与完整回答](#detail-section-14)
  - [Q01 · 根后端与DSH桥接是什么关系？](#detail-section-15)
  - [Q02 · 反馈怎样持久化并影响后续个性化？](#detail-section-16)
  - [Q03 · 跨平台画像能否证明更懂用户，数据是否始终不出机？](#detail-section-17)
  - [Q04 · 维护来源和反馈闭环的总成本支持怎样采用？](#detail-section-18)
  - [Q05 · 怎样判定个性化比简单订阅有效？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：愿维护来源与反馈的个人在自己管理的候选库里发现跨平台内容。

逐平台信息流、订阅与关键词搜索为简单基线；不比较未经独立测量的推荐准确率。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 反馈事件 | 纠正本地推荐 | hook可能延期，重试需同键 |
| 画像与评分 | 跨平台个性化 | 远端模型配置涉及出网 |
| 根服务 | 提供本地应用能力 | DSH桥在独立仓库 |

**流程与依赖**

<a id="detail-section-4"></a>

### 1.3 启动与依赖

| 条件 | 用途 | 退路 |
|---|---|---|
| Python后端/浏览器来源 | 收集信号与候选 | 先公开来源 |
| 模型与embedding配置 | 画像和相关性 | 核对端点外发字段 |
| 用户反馈与删除核查 | 控制偏好和退出 | 未核清先非敏感测试 |

<a id="detail-section-5"></a>

### 1.4 启动步骤

| 步骤 | 执行者与判据 | 失败处理 |
|---|---|---|
| 隔离后端配单来源 | 用户确认候选出处 | 来源失效先停止扩张 |
| 非敏感反馈试验 | 用户回读事件与画像 | 重试保留request_id |
| 固定候选盲评 | 用户比较有用与反感项 | 无改善回订阅/关键词 |

**效果与成本**

<a id="detail-section-6"></a>

### 1.5 成本

| 阶段 | 现金／资源 | 人工／时间 |
|---|---|---|
| 首次 | 后端、embedding和模型资源，未知 | 客户端/来源/模型配置，未知 |
| 持续 | 发现、LLM、网络和存储，未知 | 登录维护与偏好纠正，未知 |
| 失败恢复 | 重试与重建画像，未知 | 事件/投影/外发/删除对账，未知 |

<a id="detail-section-7"></a>

### 1.6 效果

| 任务 | 支持 | 缺口 |
|---|---|---|
| 反馈记录 | durable-first与幂等键 | 认知延期后真实修复 |
| 个人推荐 | 画像提示与curator评分 | 同候选盲评与负反馈违背 |

> **思考**：[Q03](#research-q03) 本地存储不等于数据不出机，远程LLM配置会收到画像构造输入；精细心理描述和解释不证明更懂用户，需本人盲评。

<a id="detail-section-8"></a>

### 1.7 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 把跨平台信号与显式纠正集中成个人可维护的推荐控制流程，贡献在控制权和反馈组织；外仓DSH桥能力不归根。

[Q01](#research-q01)、[Q02](#research-q02) 把跨平台信号与显式纠正集中成个人可维护的推荐控制流程，贡献在控制权和反馈组织；外仓DSH桥能力不归根。

可借鉴先持久事件后可重试投影、显式request_id与非关键hook延期；移植需保留重复键和回读对账，不能把返回已记录理解为所有后续推理完成。

<a id="detail-section-9"></a>

### 1.8 主要限制

[Q03](#research-q03) 本地存储不等于数据不出机，远程LLM配置会收到画像构造输入；精细心理描述和解释不证明更懂用户，需本人盲评。

<a id="detail-section-10"></a>

### 1.9 使用建议

[Q04](#research-q04) 当前观察，先一个公开来源和非敏感偏好；未核清远程模型和删除前不批量导入真实历史，不把心理画像当准确测量。

<a id="detail-section-11"></a>

### 1.10 核查说明与分析版本

**核查状态**：已检查源码。

已检查反馈、画像与代表评分链；全源和删除/隐私链未完审，未运行，个性化盲评是假设。

- 已检查：作者 README、包清单、源码路径 README.md、pyproject.toml、src/openbiliclaw/agent/tools/feedback_tools.py、src/openbiliclaw/soul/profile_builder.py、src/openbiliclaw/llm/openai_provider.py、src/openbiliclaw/recommendation/engine.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根Python后端的反馈/画像/评分代表路径；没有全平台、完整权限/隐私/删除审计或运行，独立DSH桥未研究。
- 下一步：固定30条候选与留出偏好盲评，并脱敏核对模型外发与删除传播，尚未执行。

**分析版本**

- **仓库**：[whiteguo233/OpenBiliClaw](https://github.com/whiteguo233/OpenBiliClaw)
- **版本号**：未声明（[固定提交 23de203](https://github.com/whiteguo233/OpenBiliClaw/tree/23de203a72a9b59d2c555d66b9e70ab75583aa2c)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-12"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 未验证假设是固定候选集与留出偏好，对照关键词基线的前10有用率、负反馈违背和纠正成本；无改善或成本更高就停止。

固定30条候选与留出偏好盲评，并脱敏核对模型外发与删除传播，尚未执行。

<a id="detail-section-13"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 588 | 158357 | — | — | 2066874 |
| .js | source | 43 | 49109 | 43336 | 2909 | — |
| .mjs | source | 15 | 2011 | 1674 | 164 | — |
| .ts | source | 114 | 40213 | 32502 | 5005 | — |
| .ts | test | 161 | 45693 | 40849 | 2309 | — |
| .md | example | 1 | 36 | — | — | 215 |
| .mjs | test | 13 | 2273 | 2074 | 71 | — |

</details>

**活跃度**

[![Issue 未关闭 19](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=19&color=grey&logo=github&style=flat)](https://github.com/whiteguo233/OpenBiliClaw/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 11](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=11&color=grey&logo=github&style=flat)](https://github.com/whiteguo233/OpenBiliClaw/issues?q=is%3Aissue+created%3A2026-09-27T02%3A06%3A27.988Z..2026-10-27T02%3A06%3A27.988Z) [![近30天关闭 14](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=14&color=grey&logo=github&style=flat)](https://github.com/whiteguo233/OpenBiliClaw/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T02%3A06%3A27.988Z..2026-10-27T02%3A06%3A27.988Z)



统计日期：2026-10-27。

<a id="detail-section-14"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查根推荐后端的反馈个性化、本地优先边界和效用验证条件。

<a id="research-q01"></a>

<a id="detail-section-15"></a>

### Q01 · 根后端与DSH桥接是什么关系？

**研究主题**：场景与需求、依赖、兼容与流程

#### 完整回答

根工程是Python本地内容发现/画像/推荐后端，配浏览器扩展与Web客户端；README将DSH客户端桥明确指向独立whiteguo233/dsh-openbiliclaw仓库，因此那里的第四栏与22工具数不归本根组件的已核查能力。面向愿意连接多个内容来源并反馈偏好的个人，合格结果是可追溯来源、能解释与纠正且本人认为值得读的推荐，原办法是逐平台信息流或订阅/关键词搜索。源码安装需要Python3.11以上，桌面包、浏览器登录、网络与模型路由也是不同前提；本轮未装任何客户端。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:35-49](https://github.com/whiteguo233/OpenBiliClaw/blob/23de203a72a9b59d2c555d66b9e70ab75583aa2c/README.md#L35-L49)

独立DSH桥与本地画像推荐的作者定位。

<details>
<summary>查看原文（15行）</summary>

```text
> ### 🆕 重要更新：OpenBiliClaw 现在可以装进 DeepSeek Harness
>
> 新增 **DSH 客户端插件** —— 把 OpenBiliClaw 装进 [DeepSeek Harness](https://github.com/deepseek-ai/DeepSeek-Harness)：DSH 界面常驻第四栏（推荐 / 内容库 / 对话 / 画像 / 设置），并注册 22 个 Agent Bridge 工具，让 DSH 里的 Agent 也能读推荐、答探测、闭环学习——边用 DSH 干活，边刷跨平台个性化内容。→ [`github.com/whiteguo233/dsh-openbiliclaw`](https://github.com/whiteguo233/dsh-openbiliclaw)
>
> 📱 想要原生 App？Flutter 移动端客户端（Android / iOS / Web / 桌面）在独立仓库 [`OpenBiliClaw-mobile`](https://github.com/whiteguo233/OpenBiliClaw-mobile)：推荐、对话、画像、收藏 / 稍后再看 / 30 天历史一应俱全，连接同一本地后端。

> 🇨🇳 **国内源**：[Gitee v0.3.232 源码](https://gitee.com/whiteguo233/openbiliclaw/tree/openbiliclaw-v0.3.232)已同步至最新主线。安装包请从 [GitHub Release](https://github.com/whiteguo233/OpenBiliClaw/releases/tag/openbiliclaw-v0.3.232) 获取；[123 云盘](https://4001474255.share.123pan.cn/123pan/IxbZMh-90KO3)仍保留 v0.3.213 历史文件，最新版国内安装包镜像待更新。

## 10 秒看懂 OpenBiliClaw

一个纯本地、私有、开源的自进化跨平台内容发现 Agent：从你的跨平台使用、反馈和对话中持续深化心理画像，带着对你的理解主动去 B 站、小红书、抖音、YouTube、TikTok、X、知乎、Reddit、Linux.do、Bangumi、V2EX、微博、GitHub、Instagram 与开放 Web 找内容。

| 跨平台 | 本地优先 | 可调教 |
|---|---|---|
| B 站 / 小红书 / 抖音 / YouTube / TikTok / X / 知乎 / Reddit / Linux.do / Bangumi / V2EX / 微博 / GitHub / Instagram / Web | 数据默认留在本机 SQLite | 喜欢、不感兴趣、聊天反馈都会改变后续推荐 |
```

</details>

**依据 2 · 源码核查**：[pyproject.toml:1-14](https://github.com/whiteguo233/OpenBiliClaw/blob/23de203a72a9b59d2c555d66b9e70ab75583aa2c/pyproject.toml#L1-L14)

根Python分发和最低Python版本。

<details>
<summary>查看原文（14行）</summary>

```text
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[project]
name = "openbiliclaw"
version = "0.3.232"
description = "Your local-first, cross-platform AI discovery friend for Bilibili, Zhihu, and more."
readme = "README.md"
license = { text = "MIT" }
requires-python = ">=3.11"
authors = [
    { name = "OpenBiliClaw Contributors" },
]
```

</details>

**依据 3 · 作者声明**：[README.md:76-78](https://github.com/whiteguo233/OpenBiliClaw/blob/23de203a72a9b59d2c555d66b9e70ab75583aa2c/README.md#L76-L78)

来源登录/公开访问及本地Web路径。

```text
3. **连接来源** —— 在装了插件的浏览器登录 [B 站](https://www.bilibili.com)（默认初始化来源），或改选小红书 / 抖音 / YouTube / X / 知乎 / Reddit / Linux.do / V2EX / 微博 / GitHub。Linux.do、Bangumi、V2EX、微博与 GitHub 均可公开发现；需要账号态的来源仍复用已安装插件，GitHub 则由后端官方 REST API 匿名读取公开 repository。GitHub 可用公开用户名把 starred repositories 用作初始化信号，PAT 只是可选的提额和身份校验方式。TikTok、Instagram 需在「设置 → 来源」中手动开启；使用已装插件的浏览器登录，插件默认包含两者站点访问权限。TikTok 未登录可发现公开视频，登录后由插件同步凭据用于关键词搜索；Instagram 可只读导入本人点赞、收藏和关注。两者均需海外网络：后端沿现有网络/代理设置，浏览器任务使用浏览器自身代理。连接与许可要求见 [TikTok](docs/modules/tiktok.md)、[Instagram](docs/modules/instagram.md)。

4. **打开界面** —— 浏览器访问 `http://127.0.0.1:8420/web`；手机扫插件二维码打开 `http://<电脑局域网 IP>:8420/m/`，保存到主屏幕即可当 App 用；想要原生 App 体验，可安装独立仓库的 [Flutter 客户端](https://github.com/whiteguo233/OpenBiliClaw-mobile)（Android / iOS / Web / 桌面，安装包见 [Latest Release](https://github.com/whiteguo233/OpenBiliClaw-mobile/releases/latest)），在设置里填后端地址即可连接同一后端。
```

<a id="research-q02"></a>

<a id="detail-section-16"></a>

### Q02 · 反馈怎样持久化并影响后续个性化？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

所查feedback工具声明soft_write，对推荐记录提交like/dislike/dismiss/comment；request_id若缺省生成UUID，显式传同键重试才能保留跨请求幂等含义。handler通过EventIngressService.accept落事件，duplicate直接返回，随后更新推荐反馈投影，再调用可选认知hook；hook失败只记录deferred，不等于本次画像已更新。profile_builder将历史摘要、偏好、觉察与insights构成提示，调用complete_structured_task再解析SoulProfile。推荐入口serve传profile给serve_with_result，curator按当前context给候选评分。这支持反馈—画像—推荐的组织机制，但不是逐条反馈必然即时改变排序的证明；发现策略和全部排序分支未全量审计。

#### 证据与依据

**依据 1 · 源码核查**：[src/openbiliclaw/agent/tools/feedback_tools.py:113-124](https://github.com/whiteguo233/OpenBiliClaw/blob/23de203a72a9b59d2c555d66b9e70ab75583aa2c/src/openbiliclaw/agent/tools/feedback_tools.py#L113-L124)

request_id缺省生成新键，限定幂等。

<details>
<summary>查看原文（12行）</summary>

```text
async def _submit_feedback(ctx: AgentToolContext, args: dict[str, Any]) -> str:
    db = require_component(ctx.database, "database")
    ingress = require_component(ctx.event_ingress, "event_ingress")

    raw_id = args.get("recommendation_id")
    try:
        recommendation_id = int(raw_id) if raw_id is not None else 0
    except (TypeError, ValueError):
        return f"recommendation_id 无效: {raw_id}。"
    feedback_type = str(args.get("feedback_type") or "").strip().lower()
    note = str(args.get("note") or "").strip()
    request_id = str(args.get("request_id") or "").strip() or f"chat-agent-{uuid.uuid4()}"
```

</details>

**依据 2 · 源码核查**：[src/openbiliclaw/agent/tools/feedback_tools.py:151-179](https://github.com/whiteguo233/OpenBiliClaw/blob/23de203a72a9b59d2c555d66b9e70ab75583aa2c/src/openbiliclaw/agent/tools/feedback_tools.py#L151-L179)

先事件落位、投影和容错hook。

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

**依据 3 · 源码核查**：[src/openbiliclaw/soul/profile_builder.py:248-289](https://github.com/whiteguo233/OpenBiliClaw/blob/23de203a72a9b59d2c555d66b9e70ab75583aa2c/src/openbiliclaw/soul/profile_builder.py#L248-L289)

历史/偏好进入LLM并解析画像。

<details>
<summary>查看原文（42行）</summary>

```text
    async def _build_from_summary(
        self,
        *,
        history_summary: dict[str, object],
        preference: dict[str, Any],
        awareness_notes: list[dict[str, Any]],
        active_insights: list[dict[str, Any]],
    ) -> SoulProfile:
        raw_mix = preference.get("source_platform_mix") if isinstance(preference, dict) else None
        source_mix = raw_mix if isinstance(raw_mix, dict) and raw_mix else None
        messages = build_soul_profile_prompt(
            history_summary=history_summary,
            preference_summary=preference,
            recent_awareness=awareness_notes,
            active_insights=active_insights,
            tone_profile=build_tone_profile(
                profile=None,
                preference_summary=preference,
                recent_feedback=[],
            ),
            source_platform_mix=source_mix,
            reply_style=self.reply_style,
        )
        try:
            complete_structured = self.registry.complete_structured_task
            response = await complete_structured(
                system_instruction=messages[0]["content"],
                user_input=messages[1]["content"],
                max_tokens=DEFAULT_STRUCTURED_MAX_TOKENS,
                caller="soul.profile_build",
                temperature=0.5,
                **without_core_memory_kwargs(complete_structured),
            )
        except (LLMProviderError, LLMServiceError) as exc:
            raise SoulProfileBuildError(str(exc)) from exc
        payload = self._parse_response(response.content)
        profile = SoulProfile(
            personality_portrait=str(payload.get("personality_portrait", "")),
            core_traits=self._as_str_list(payload.get("core_traits")),
            cognitive_style=self._as_str_list(payload.get("cognitive_style")),
            motivational_drivers=self._as_str_list(payload.get("motivational_drivers")),
            current_phase=str(payload.get("current_phase", "")),
```

</details>

**依据 4 · 源码核查**：[src/openbiliclaw/recommendation/engine.py:700-717](https://github.com/whiteguo233/OpenBiliClaw/blob/23de203a72a9b59d2c555d66b9e70ab75583aa2c/src/openbiliclaw/recommendation/engine.py#L700-L717)

profile传递给推荐服务。

<details>
<summary>查看原文（18行）</summary>

```text
    async def serve(
        self,
        profile: SoulProfile,
        *,
        limit: int = 5,
        excluded_bvids: frozenset[str] = frozenset(),
        expression_mode: Literal["realtime", "precomputed"] = "precomputed",
        source_platform: str = "",
    ) -> list[Recommendation]:
        """Serve recommendations while preserving the legacy list API."""
        result = await self.serve_with_result(
            profile,
            limit=limit,
            excluded_bvids=excluded_bvids,
            expression_mode=expression_mode,
            source_platform=source_platform,
        )
        return result.items
```

</details>

**依据 5 · 源码核查**：[src/openbiliclaw/recommendation/engine.py:5614-5643](https://github.com/whiteguo233/OpenBiliClaw/blob/23de203a72a9b59d2c555d66b9e70ab75583aa2c/src/openbiliclaw/recommendation/engine.py#L5614-L5643)

curator上下文与候选评分连接。

<details>
<summary>查看原文（30行）</summary>

```text
    def _score_candidates_with_curator(
        self,
        candidates: list[DiscoveredContent],
        curator_snapshot: tuple[
            list[dict[str, object]],
            list[dict[str, object]],
        ]
        | None = None,
    ) -> tuple[dict[str, float] | None, frozenset[str]]:
        """Build curator context and scores outside the asyncio event loop."""
        if self._curator is None:
            return None, frozenset()
        build_from_rows = getattr(self._curator, "build_context_from_rows", None)
        if curator_snapshot is not None and callable(build_from_rows):
            context = build_from_rows(*curator_snapshot)
        else:
            context = self._curator.build_context()
        scores = self._curator.score_candidates(candidates, context)
        record_temporal_shadow = getattr(
            self._curator,
            "record_temporal_ranking_shadow_audit",
            None,
        )
        if callable(record_temporal_shadow):
            try:
                record_temporal_shadow(candidates, scores, context)
            except Exception:
                # Shadow observability must never make the serving path fail.
                logger.warning("temporal ranking shadow observer failed", exc_info=True)
        return scores, context.over_budget_amplification_keys
```

</details>

#### 缺口

- 所有发现策略和反馈到排序的完整因果链未覆盖
  **影响**：不能称每个平台或每条反馈即时生效
  **进一步探讨**：选一个来源和两类反馈，追踪事件、画像版本与同一候选集排序变化

<a id="research-q03"></a>

<a id="detail-section-17"></a>

### Q03 · 跨平台画像能否证明更懂用户，数据是否始终不出机？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

可解释贡献是把个人跨平台信号与显式反馈集中到自己维护的推荐流程，改变只有平台能维护兴趣档案的控制关系；不把LLM摘要或心理标签当经过验证的心理测量。“更懂你”和自进化仍需要本人盲评与简单关键词基线，不由画像文本细腻推出。另一个关键边界是本地SQLite只说明存储位置：profile_builder把历史/偏好摘要组织成LLM输入，OpenAI兼容provider接受base_url/API key并发送messages。若配置远程provider，相关摘要会进入该端点；配置本地模型才可能收窄此出网面，不能一概声称纯本地不出机。本轮没审完全部外发载荷、cookie与删除链，不能作全量隐私保证。

#### 证据与依据

**依据 1 · 源码核查**：[src/openbiliclaw/soul/profile_builder.py:258-279](https://github.com/whiteguo233/OpenBiliClaw/blob/23de203a72a9b59d2c555d66b9e70ab75583aa2c/src/openbiliclaw/soul/profile_builder.py#L258-L279)

历史与偏好形成模型输入。

<details>
<summary>查看原文（22行）</summary>

```text
        messages = build_soul_profile_prompt(
            history_summary=history_summary,
            preference_summary=preference,
            recent_awareness=awareness_notes,
            active_insights=active_insights,
            tone_profile=build_tone_profile(
                profile=None,
                preference_summary=preference,
                recent_feedback=[],
            ),
            source_platform_mix=source_mix,
            reply_style=self.reply_style,
        )
        try:
            complete_structured = self.registry.complete_structured_task
            response = await complete_structured(
                system_instruction=messages[0]["content"],
                user_input=messages[1]["content"],
                max_tokens=DEFAULT_STRUCTURED_MAX_TOKENS,
                caller="soul.profile_build",
                temperature=0.5,
                **without_core_memory_kwargs(complete_structured),
```

</details>

**依据 2 · 源码核查**：[src/openbiliclaw/llm/openai_provider.py:127-141](https://github.com/whiteguo233/OpenBiliClaw/blob/23de203a72a9b59d2c555d66b9e70ab75583aa2c/src/openbiliclaw/llm/openai_provider.py#L127-L141)

可配置端点与网络客户端。

<details>
<summary>查看原文（15行）</summary>

```text
        # proxy-env-immune client, and system leaves SDK construction untouched.
        self._proxy = proxy.strip()
        self._trust_env = bool(trust_env and not self._proxy)
        client_kwargs: dict[str, Any] = {}
        if self._proxy or not self._trust_env:
            httpx_kwargs: dict[str, Any] = {"timeout": timeout, "trust_env": self._trust_env}
            if self._proxy:
                httpx_kwargs["proxy"] = self._proxy
            client_kwargs["http_client"] = httpx.AsyncClient(**httpx_kwargs)
        self._client = AsyncOpenAI(
            api_key=api_key,
            base_url=base_url or None,
            max_retries=0,
            timeout=timeout,
            **client_kwargs,
```

</details>

**依据 3 · 源码核查**：[src/openbiliclaw/llm/openai_provider.py:178-183](https://github.com/whiteguo233/OpenBiliClaw/blob/23de203a72a9b59d2c555d66b9e70ab75583aa2c/src/openbiliclaw/llm/openai_provider.py#L178-L183)

messages进入请求参数。

```text
        kwargs: dict[str, Any] = {
            "model": effective_model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
```

**依据 4 · 源码核查**：[src/openbiliclaw/llm/openai_provider.py:929-937](https://github.com/whiteguo233/OpenBiliClaw/blob/23de203a72a9b59d2c555d66b9e70ab75583aa2c/src/openbiliclaw/llm/openai_provider.py#L929-L937)

实际兼容客户端create调用。

```text
        # openai.resources synchronously, which can stall unrelated HTTP work
        # during a startup readiness probe. Resolve only that resource off-loop;
        # the async transport and stream continue on their original event loop.
        completions = await asyncio.to_thread(lambda: self._client.chat.completions)
        return await completions.create(**kwargs)

    async def _create_response(self, **kwargs: Any) -> Any:
        responses = await asyncio.to_thread(lambda: self._client.responses)
        return await responses.create(**kwargs)
```

#### 缺口

- 未全量审计外发数据、凭证与画像删除传播
  **影响**：本地优先与私密程度需按配置核查
  **进一步探讨**：固定本地/远端配置抓取脱敏请求字段，并测试删除后画像/嵌入/缓存残留

<a id="research-q04"></a>

<a id="detail-section-18"></a>

### Q04 · 维护来源和反馈闭环的总成本支持怎样采用？

**研究主题**：效果与总成本、采用判断

#### 完整回答

首次需后端、浏览器扩展、来源授权与模型/embedding设置，持续要维护登录态、接口、代理、候选供给及纠正错误偏好。资源包括模型调用、向量计算、网络和存储，作者提到的模型赞助不代表用户永久免费；无本轮价格/调用量，不估算ROI。失败可能是已落反馈但认知hook延期，也可能是来源失效，恢复应先回读事件与来源状态，重试沿用request_id而非重新产生重复偏好。当前建议观察，先一个公开来源与非敏感测试偏好验证反馈、排序、数据流和删除；若负反馈仍反复出现、费用超限或无法核清外发，停止导入个人历史并退回订阅/关键词发现。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:68-78](https://github.com/whiteguo233/OpenBiliClaw/blob/23de203a72a9b59d2c555d66b9e70ab75583aa2c/README.md#L68-L78)

客户端、模型与来源接入负担。

<details>
<summary>查看原文（11行）</summary>

````text

1. **装插件** —— [Chrome 应用商店一键安装](https://chromewebstore.google.com/detail/cdfjfkdjjhdaccbldipkjhpibnfbiamg)（自动更新），或从 [Latest Release](https://github.com/whiteguo233/OpenBiliClaw/releases/latest) 下载 zip 手动安装（最新功能先到，商店版可能滞后几天）。
2. **装后端** —— 从同一个 [Latest Release](https://github.com/whiteguo233/OpenBiliClaw/releases/latest) 下载桌面安装包（macOS `.dmg` / Windows `.exe`，开箱即用、常驻菜单栏/托盘）。每个平台有两种安装包:**精简版**(默认,首启自动下载向量模型 bge-m3)与 **`-with-embedding` 完整版**(已内置 bge-m3 ~1.1GB,离线开箱即用)——网络差 / 想离线的选完整版,其余选精简版。**Gitee 源码已同步至 v0.3.232，最新版安装包见 [GitHub Release](https://github.com/whiteguo233/OpenBiliClaw/releases/tag/openbiliclaw-v0.3.232)。123 云盘当前仍是 v0.3.213 历史文件。** 想改源码或深度定制,就把下面这句话粘给 Claude Code / Codex CLI / Cursor 等 AI 编程助手：

   ```text
   请按照 https://raw.githubusercontent.com/whiteguo233/OpenBiliClaw/main/docs/agent-install.md 的说明帮我部署 OpenBiliClaw 后端(务必用 Bash 的 curl 下载这个文档,不要用 WebFetch — 会丢关键指令)
   ```

3. **连接来源** —— 在装了插件的浏览器登录 [B 站](https://www.bilibili.com)（默认初始化来源），或改选小红书 / 抖音 / YouTube / X / 知乎 / Reddit / Linux.do / V2EX / 微博 / GitHub。Linux.do、Bangumi、V2EX、微博与 GitHub 均可公开发现；需要账号态的来源仍复用已安装插件，GitHub 则由后端官方 REST API 匿名读取公开 repository。GitHub 可用公开用户名把 starred repositories 用作初始化信号，PAT 只是可选的提额和身份校验方式。TikTok、Instagram 需在「设置 → 来源」中手动开启；使用已装插件的浏览器登录，插件默认包含两者站点访问权限。TikTok 未登录可发现公开视频，登录后由插件同步凭据用于关键词搜索；Instagram 可只读导入本人点赞、收藏和关注。两者均需海外网络：后端沿现有网络/代理设置，浏览器任务使用浏览器自身代理。连接与许可要求见 [TikTok](docs/modules/tiktok.md)、[Instagram](docs/modules/instagram.md)。

4. **打开界面** —— 浏览器访问 `http://127.0.0.1:8420/web`；手机扫插件二维码打开 `http://<电脑局域网 IP>:8420/m/`，保存到主屏幕即可当 App 用；想要原生 App 体验，可安装独立仓库的 [Flutter 客户端](https://github.com/whiteguo233/OpenBiliClaw-mobile)（Android / iOS / Web / 桌面，安装包见 [Latest Release](https://github.com/whiteguo233/OpenBiliClaw-mobile/releases/latest)），在设置里填后端地址即可连接同一后端。
````

</details>

**依据 2 · 源码核查**：[src/openbiliclaw/agent/tools/feedback_tools.py:151-179](https://github.com/whiteguo233/OpenBiliClaw/blob/23de203a72a9b59d2c555d66b9e70ab75583aa2c/src/openbiliclaw/agent/tools/feedback_tools.py#L151-L179)

事件边界与延后认知决定恢复方式。

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

**依据 3 · 源码核查**：[pyproject.toml:27-46](https://github.com/whiteguo233/OpenBiliClaw/blob/23de203a72a9b59d2c555d66b9e70ab75583aa2c/pyproject.toml#L27-L46)

HTTP、模型SDK等依赖，不代表执行通过。

<details>
<summary>查看原文（20行）</summary>

```text
dependencies = [
    "httpx[socks]>=0.28",
    # Already installed by HTTPX; identify its CA bundle for image TLS reuse.
    "certifi",
    # Public network-backend API pins cover-image connections against DNS rebinding.
    "httpcore>=1.0,<2",
    "scrapetube>=2.1",
    "yt-dlp>=2024.1.0",
    # TikTok web API backend (sources/tiktok_web.py): Chrome TLS impersonation
    # — TikTok's edge rejects plain-OpenSSL clients. Also an optional yt-dlp
    # dependency, so the version lines stay compatible by construction.
    "curl-cffi>=0.15",
    "bilibili-api-python>=16",
    # openai>=3 / anthropic>=1 vendor httpx internally as ``httpx2`` and their
    # isinstance guard rejects plain ``httpx.AsyncClient`` instances passed via
    # ``http_client=`` (openai_provider.py / claude_provider.py proxy support),
    # so keep both on the 2.x / 0.x lines until the providers migrate.
    "openai>=1.0,<3",
    "anthropic>=0.40,<1",
    "google-genai>=1.66",
```

</details>

<a id="research-q05"></a>

<a id="detail-section-19"></a>

### Q05 · 怎样判定个性化比简单订阅有效？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是用稳定候选集对比关键词/订阅基线与画像排序，同时留出未用于画像更新的本人偏好判断，并重点检查负反馈违背率和新颖但有用的内容，而不是比较点击或解释文案。推导来自Q02反馈投影和Q03“更懂你”未验证的归因缺口；需要控制来源、候选、模型和预算，不能把多抓内容当机制胜出。最小试验让本人先盲评30条候选，再运行两种排序，比较前10条有用率、不喜欢项复现和人工纠正分钟；无改善或成本明显增加则停止。这个实验尚未运行，也不证明心理画像准确或其他用户愿付费。

#### 证据与依据

**依据 1 · 源码核查**：[src/openbiliclaw/recommendation/engine.py:5614-5643](https://github.com/whiteguo233/OpenBiliClaw/blob/23de203a72a9b59d2c555d66b9e70ab75583aa2c/src/openbiliclaw/recommendation/engine.py#L5614-L5643)

curator评分上下文是可固定的比较点。

<details>
<summary>查看原文（30行）</summary>

```text
    def _score_candidates_with_curator(
        self,
        candidates: list[DiscoveredContent],
        curator_snapshot: tuple[
            list[dict[str, object]],
            list[dict[str, object]],
        ]
        | None = None,
    ) -> tuple[dict[str, float] | None, frozenset[str]]:
        """Build curator context and scores outside the asyncio event loop."""
        if self._curator is None:
            return None, frozenset()
        build_from_rows = getattr(self._curator, "build_context_from_rows", None)
        if curator_snapshot is not None and callable(build_from_rows):
            context = build_from_rows(*curator_snapshot)
        else:
            context = self._curator.build_context()
        scores = self._curator.score_candidates(candidates, context)
        record_temporal_shadow = getattr(
            self._curator,
            "record_temporal_ranking_shadow_audit",
            None,
        )
        if callable(record_temporal_shadow):
            try:
                record_temporal_shadow(candidates, scores, context)
            except Exception:
                # Shadow observability must never make the serving path fail.
                logger.warning("temporal ranking shadow observer failed", exc_info=True)
        return scores, context.over_budget_amplification_keys
```

</details>

**依据 2 · 源码核查**：[src/openbiliclaw/agent/tools/feedback_tools.py:151-179](https://github.com/whiteguo233/OpenBiliClaw/blob/23de203a72a9b59d2c555d66b9e70ab75583aa2c/src/openbiliclaw/agent/tools/feedback_tools.py#L151-L179)

反馈事件可用于区分训练与留出评价。

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

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
