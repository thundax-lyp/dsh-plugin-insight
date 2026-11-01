# OpenBiliClaw 本地内容发现后端

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[f4af774](https://github.com/whiteguo233/OpenBiliClaw/tree/f4af7744995fe053df6cb771738a88d58c419b4a)

<!-- BEGIN META -->
[![GitHub ★ 3,639](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C639&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/whiteguo233/OpenBiliClaw)
<!-- END META -->

> **功能**：组织跨平台内容信号、个人画像和反馈以提供个性化发现。

> **亮点**：组织多来源信号与明确反馈的个人推荐控制流程；DSH 桥在独立仓库。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：事件接受不等于认知完成；本地运行也可能按配置发送内容至云端模型，导出备份可能未加密。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 根后端与 DSH 桥是什么关系？](#detail-section-11)
  - [Q02 · 反馈怎样持久化并影响后续处理？](#detail-section-12)
  - [Q03 · 本地运行是否意味着数据永不出机、偏好必然准确？](#detail-section-13)
  - [Q04 · 实际采用和恢复需要哪些条件？](#detail-section-14)
  - [Q05 · 怎样判定个性化比简单订阅有效？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：愿维护跨平台来源与反馈的个人；逐平台订阅和关键词搜索是基线。[Q01](#research-q01)

逐平台订阅、搜索和收藏；不自动汇总个人画像。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 内容发现 | 整理多来源候选 | 需平台访问权限 |
| 反馈 | 接收偏好事件 | 投影和认知另需核验 |
| 个人画像 | 组织推荐依据 | 云端模型与备份需管理 |

**流程与依赖**

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| 本地后端与客户端 | 必需 | 记录与推荐 | 无法使用 |
| 来源权限 | 相应来源必需 | 采集信号 | 来源不可用 |
| 模型与数据许可 | 推荐相关 | 处理与画像 | 禁止不接受的数据流 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
| --- | --- | --- |
| 配置 | 选择有限来源与模型去向 | 核对凭据和留存 |
| 反馈 | 对样本提交反馈 | 查事件与投影 |
| 比较 | 对照手工订阅 | 效果不佳则停止 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 安装和模型资源 | 来源和权限配置 | 作者称模型约 1.1GB |
| 持续 | 云模型或本地计算费用 | 核对反馈与推荐 | 节约未测 |
| 恢复 | 数据存储及备份 | 清理与迁移 | 导出可能未加密 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 反馈 | 事件回执、投影与认知跟进 | 所有阶段完成 |
| 个性化 | 作者描述跨来源反馈 | 实际质量与偏差 |

> **思考**：事件接受不等于认知完成；本地运行也可能按配置发送内容至云端模型，导出备份可能未加密。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：组织多来源信号与明确反馈的个人推荐控制流程；DSH 桥在独立仓库。[Q01](#research-q01) [Q02](#research-q02)

持久事件先于投影，重复回执直接返回；即时认知失败记录 deferred。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

事件接受不等于认知完成；本地运行也可能按配置发送内容至云端模型，导出备份可能未加密。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

选择有限来源与非敏感样本，确认模型去向及备份，比较订阅效果。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码显示事件、投影和认知阶段；数据去向为作者说明，未运行后端、模型或真实数据。

- 已检查：作者 README、包清单、源码路径 README.md、src/openbiliclaw/agent/tools/feedback_tools.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根 inventory 937 个指定扩展名文件、无排除或解析错误；静态核查反馈路径和数据去向，未运行真实环境。
- 下一步：隔离数据验证重复事件、投影失败、认知延后和推荐对照。

**分析版本**

- **仓库**：[whiteguo233/OpenBiliClaw](https://github.com/whiteguo233/OpenBiliClaw)
- **版本号**：未声明（[固定提交 f4af774](https://github.com/whiteguo233/OpenBiliClaw/tree/f4af7744995fe053df6cb771738a88d58c419b4a)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：展示驱动来源和反馈处理状态并允许纠正，可改善发现质量；对照订阅测相关性、延迟及隐私代价。[Q05](#research-q05)

隔离数据验证重复事件、投影失败、认知延后和推荐对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 590 | 158526 | — | — | 2073136 |
| .js | source | 43 | 49109 | 43336 | 2909 | — |
| .mjs | source | 15 | 2011 | 1674 | 164 | — |
| .ts | source | 114 | 40213 | 32502 | 5005 | — |
| .ts | test | 161 | 45693 | 40849 | 2309 | — |
| .md | example | 1 | 36 | — | — | 215 |
| .mjs | test | 13 | 2273 | 2074 | 71 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-01），可前往 [GitHub Issues](https://github.com/whiteguo233/OpenBiliClaw/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：跨平台推荐后端如何接收反馈，本地运行、投影和质量边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根后端与 DSH 桥是什么关系？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

OpenBiliClaw 根项目面向愿维护跨平台来源与偏好反馈的个人，组织本地后端、浏览器扩展、画像与推荐；DSH 客户端位于独立仓库，不能把桥接能力归入根本身。基线是逐平台订阅、关键词搜索与收藏；作者声称跨平台个性化，本轮没有同任务对照证明更懂用户或节省时间。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:37-37](https://github.com/whiteguo233/OpenBiliClaw/blob/f4af7744995fe053df6cb771738a88d58c419b4a/README.md#L37-L37)

作者说明 DSH 桥位于独立仓库。

```text
> 新增 **DSH 客户端插件** —— 把 OpenBiliClaw 装进 [DeepSeek Harness](https://github.com/deepseek-ai/DeepSeek-Harness)：DSH 界面常驻第四栏（推荐 / 内容库 / 对话 / 画像 / 设置），并注册 22 个 Agent Bridge 工具，让 DSH 里的 Agent 也能读推荐、答探测、闭环学习——边用 DSH 干活，边刷跨平台个性化内容。→ [`github.com/whiteguo233/dsh-openbiliclaw`](https://github.com/whiteguo233/dsh-openbiliclaw)
```

**依据 2 · 源码核查**：[README.md:48-49](https://github.com/whiteguo233/OpenBiliClaw/blob/f4af7744995fe053df6cb771738a88d58c419b4a/README.md#L48-L49)

作者描述跨平台信号与反馈。

```text
|---|---|---|
| B 站 / 小红书 / 抖音 / YouTube / TikTok / X / 知乎 / Reddit / Linux.do / Bangumi / V2EX / 微博 / GitHub / Instagram / Web | 数据默认留在本机 SQLite | 喜欢、不感兴趣、聊天反馈都会改变后续推荐 |
```

**依据 3 · 源码核查**：[README.md:65-70](https://github.com/whiteguo233/OpenBiliClaw/blob/f4af7744995fe053df6cb771738a88d58c419b4a/README.md#L65-L70)

作者描述扩展和后端安装。

```text
## 快速开始

普通用户只需四步；Firefox、Docker、脚本和手动部署等备用路径都在 [安装与部署详情](#安装与部署详情)。

1. **装插件** —— [Chrome 应用商店一键安装](https://chromewebstore.google.com/detail/cdfjfkdjjhdaccbldipkjhpibnfbiamg)（自动更新），或从 [Latest Release](https://github.com/whiteguo233/OpenBiliClaw/releases/latest) 下载 zip 手动安装（最新功能先到，商店版可能滞后几天）。
2. **装后端** —— 从同一个 [Latest Release](https://github.com/whiteguo233/OpenBiliClaw/releases/latest) 下载桌面安装包（macOS `.dmg` / Windows `.exe`，开箱即用、常驻菜单栏/托盘）。每个平台有两种安装包:**精简版**(默认,首启自动下载向量模型 bge-m3)与 **`-with-embedding` 完整版**(已内置 bge-m3 ~1.1GB,离线开箱即用)——网络差 / 想离线的选完整版,其余选精简版。**Gitee 源码已同步至 v0.3.233，最新版安装包见 [GitHub Release](https://github.com/whiteguo233/OpenBiliClaw/releases/tag/openbiliclaw-v0.3.233)。123 云盘当前仍是 v0.3.213 历史文件。** 想改源码或深度定制,就把下面这句话粘给 Claude Code / Codex CLI / Cursor 等 AI 编程助手：
```

#### 缺口

- 未运行后端、浏览器扩展、模型或真实数据源
  **影响**：无法证明推荐质量、隐私配置或反馈投影实际完成
  **进一步探讨**：隔离用户数据并比较订阅基线，核对事件和投影

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 反馈怎样持久化并影响后续处理？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

反馈工具校验 recommendation_id、类型和评论文本，基于 request_id 或新 UUID 建事件并送 ingress；被拒绝则返回错误，重复回执直接返回去重。首次持久事件后更新推荐记录；只有新插入才尝试即时画像认知，认知异常记录 deferred 不使已记录反馈失败。事件接受、投影更新和认知完成是不同阶段，不能把成功消息当成全部个性化更新完成。

#### 证据与依据

**依据 1 · 源码核查**：[src/openbiliclaw/agent/tools/feedback_tools.py:113-129](https://github.com/whiteguo233/OpenBiliClaw/blob/f4af7744995fe053df6cb771738a88d58c419b4a/src/openbiliclaw/agent/tools/feedback_tools.py#L113-L129)

校验和 request_id。

<details>
<summary>查看原文（17行）</summary>

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

    if feedback_type not in _FEEDBACK_TYPE_LABELS:
        return f"不支持的反馈类型: {feedback_type}。"
    if feedback_type == "comment" and not note:
        return "评论反馈必须带 note。"
```

</details>

**依据 2 · 源码核查**：[src/openbiliclaw/agent/tools/feedback_tools.py:131-160](https://github.com/whiteguo233/OpenBiliClaw/blob/f4af7744995fe053df6cb771738a88d58c419b4a/src/openbiliclaw/agent/tools/feedback_tools.py#L131-L160)

构造事件、接收和重复返回。

<details>
<summary>查看原文（30行）</summary>

```text
    recommendation = await maybe_await(db.get_recommendation_by_id(recommendation_id))
    if recommendation is None:
        return f"未找到 ID 为 {recommendation_id} 的推荐记录。"
    title = str(recommendation.get("title") or "")

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
```

</details>

**依据 3 · 源码核查**：[src/openbiliclaw/agent/tools/feedback_tools.py:162-179](https://github.com/whiteguo233/OpenBiliClaw/blob/f4af7744995fe053df6cb771738a88d58c419b4a/src/openbiliclaw/agent/tools/feedback_tools.py#L162-L179)

先持久、后投影及认知异常。

<details>
<summary>查看原文（18行）</summary>

```text
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

- 未运行后端、浏览器扩展、模型或真实数据源
  **影响**：无法证明推荐质量、隐私配置或反馈投影实际完成
  **进一步探讨**：隔离用户数据并比较订阅基线，核对事件和投影

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 本地运行是否意味着数据永不出机、偏好必然准确？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

README 称本地后端和 SQLite，亦明确云端 LLM/embedding 会按配置接收相关内容，导出的 obcbackup 可含密钥、Cookie、画像及历史且未加密。本地运行并不自动决定所有处理位置；多来源登录与用户数据也有权限和留存成本。反馈与画像代码说明处理路径，不等于跨平台偏好准确、无偏或每次投影成功。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:889-892](https://github.com/whiteguo233/OpenBiliClaw/blob/f4af7744995fe053df6cb771738a88d58c419b4a/README.md#L889-L892)

本地数据流、云端服务和未加密备份的作者说明。

```text
## 隐私速览

默认数据流向：浏览器插件 → 你配置的本地 OpenBiliClaw 后端 → 本机 SQLite。插件不会把数据发送到 OpenBiliClaw 开发者运营的服务器。Linux.do 的 `_t` 仅在浏览器内转换为登录布尔，Cookie 值、CSRF 数据和原始站点响应不上传。若你配置云端 LLM / embedding，相关内容会按你的配置发送给对应服务商。详见 [隐私政策](docs/privacy.md)。
默认数据流向：浏览器插件 → 你配置的本地 OpenBiliClaw 后端 → 本机 SQLite / 数据文件。插件不会把数据发送到 OpenBiliClaw 开发者运营的服务器。若你配置云端 LLM / embedding，相关内容会按你的配置发送给对应服务商。你主动从配置页导出的 `.obcbackup` 可能包含模型 / 来源 API Key、Cookie、画像和历史，且**没有加密**；它会排除源机整段 API auth（密码、session、设备 key 等），但仍只能在可信设备间传递。详见 [隐私政策](docs/privacy.md)。
```

**依据 2 · 源码核查**：[src/openbiliclaw/agent/tools/feedback_tools.py:162-179](https://github.com/whiteguo233/OpenBiliClaw/blob/f4af7744995fe053df6cb771738a88d58c419b4a/src/openbiliclaw/agent/tools/feedback_tools.py#L162-L179)

后续投影和认知可能延后。

<details>
<summary>查看原文（18行）</summary>

```text
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

**依据 3 · 源码核查**：[README.md:48-49](https://github.com/whiteguo233/OpenBiliClaw/blob/f4af7744995fe053df6cb771738a88d58c419b4a/README.md#L48-L49)

作者的偏好改善声明。

```text
|---|---|---|
| B 站 / 小红书 / 抖音 / YouTube / TikTok / X / 知乎 / Reddit / Linux.do / Bangumi / V2EX / 微博 / GitHub / Instagram / Web | 数据默认留在本机 SQLite | 喜欢、不感兴趣、聊天反馈都会改变后续推荐 |
```

#### 缺口

- 未运行后端、浏览器扩展、模型或真实数据源
  **影响**：无法证明推荐质量、隐私配置或反馈投影实际完成
  **进一步探讨**：隔离用户数据并比较订阅基线，核对事件和投影

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 实际采用和恢复需要哪些条件？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

需后端、浏览器扩展和各平台访问权限；模型或 embedding 的本地资源、云服务费用和凭据治理均随配置变化。安装包作者说明精简版首启需下载向量模型，完整版含约 1.1GB；这些是固定 README 声明，不是本轮环境实测。先用有限来源、明确数据去向和测试样本，核对反馈记录与后续推荐；不接受云端传输、备份暴露或实际效果不佳时停用并按自己的留存要求清理。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:65-70](https://github.com/whiteguo233/OpenBiliClaw/blob/f4af7744995fe053df6cb771738a88d58c419b4a/README.md#L65-L70)

安装及模型体积说明。

```text
## 快速开始

普通用户只需四步；Firefox、Docker、脚本和手动部署等备用路径都在 [安装与部署详情](#安装与部署详情)。

1. **装插件** —— [Chrome 应用商店一键安装](https://chromewebstore.google.com/detail/cdfjfkdjjhdaccbldipkjhpibnfbiamg)（自动更新），或从 [Latest Release](https://github.com/whiteguo233/OpenBiliClaw/releases/latest) 下载 zip 手动安装（最新功能先到，商店版可能滞后几天）。
2. **装后端** —— 从同一个 [Latest Release](https://github.com/whiteguo233/OpenBiliClaw/releases/latest) 下载桌面安装包（macOS `.dmg` / Windows `.exe`，开箱即用、常驻菜单栏/托盘）。每个平台有两种安装包:**精简版**(默认,首启自动下载向量模型 bge-m3)与 **`-with-embedding` 完整版**(已内置 bge-m3 ~1.1GB,离线开箱即用)——网络差 / 想离线的选完整版,其余选精简版。**Gitee 源码已同步至 v0.3.233，最新版安装包见 [GitHub Release](https://github.com/whiteguo233/OpenBiliClaw/releases/tag/openbiliclaw-v0.3.233)。123 云盘当前仍是 v0.3.213 历史文件。** 想改源码或深度定制,就把下面这句话粘给 Claude Code / Codex CLI / Cursor 等 AI 编程助手：
```

**依据 2 · 源码核查**：[README.md:889-892](https://github.com/whiteguo233/OpenBiliClaw/blob/f4af7744995fe053df6cb771738a88d58c419b4a/README.md#L889-L892)

数据去向及备份。

```text
## 隐私速览

默认数据流向：浏览器插件 → 你配置的本地 OpenBiliClaw 后端 → 本机 SQLite。插件不会把数据发送到 OpenBiliClaw 开发者运营的服务器。Linux.do 的 `_t` 仅在浏览器内转换为登录布尔，Cookie 值、CSRF 数据和原始站点响应不上传。若你配置云端 LLM / embedding，相关内容会按你的配置发送给对应服务商。详见 [隐私政策](docs/privacy.md)。
默认数据流向：浏览器插件 → 你配置的本地 OpenBiliClaw 后端 → 本机 SQLite / 数据文件。插件不会把数据发送到 OpenBiliClaw 开发者运营的服务器。若你配置云端 LLM / embedding，相关内容会按你的配置发送给对应服务商。你主动从配置页导出的 `.obcbackup` 可能包含模型 / 来源 API Key、Cookie、画像和历史，且**没有加密**；它会排除源机整段 API auth（密码、session、设备 key 等），但仍只能在可信设备间传递。详见 [隐私政策](docs/privacy.md)。
```

**依据 3 · 源码核查**：[src/openbiliclaw/agent/tools/feedback_tools.py:151-179](https://github.com/whiteguo233/OpenBiliClaw/blob/f4af7744995fe053df6cb771738a88d58c419b4a/src/openbiliclaw/agent/tools/feedback_tools.py#L151-L179)

反馈接收与后续处理。

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

#### 缺口

- 未运行后端、浏览器扩展、模型或真实数据源
  **影响**：无法证明推荐质量、隐私配置或反馈投影实际完成
  **进一步探讨**：隔离用户数据并比较订阅基线，核对事件和投影

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样判定个性化比简单订阅有效？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

未验证假设：在推荐旁显示驱动来源与反馈处理状态，并允许针对错误画像做明确纠正，可能提高用户发现质量和纠错效率；现有反馈事件、幂等回执和延后认知是反证，新增展示不等于已有系统没有反馈。按相同来源和期限对照手工订阅，记录相关性、重复率、纠正后变化、处理延迟、模型成本及敏感信息暴露；若效果不稳定、成本或泄露增加则否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/openbiliclaw/agent/tools/feedback_tools.py:151-179](https://github.com/whiteguo233/OpenBiliClaw/blob/f4af7744995fe053df6cb771738a88d58c419b4a/src/openbiliclaw/agent/tools/feedback_tools.py#L151-L179)

现有回执与认知跟进。

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

**依据 2 · 源码核查**：[README.md:48-49](https://github.com/whiteguo233/OpenBiliClaw/blob/f4af7744995fe053df6cb771738a88d58c419b4a/README.md#L48-L49)

作者描述反馈影响推荐。

```text
|---|---|---|
| B 站 / 小红书 / 抖音 / YouTube / TikTok / X / 知乎 / Reddit / Linux.do / Bangumi / V2EX / 微博 / GitHub / Instagram / Web | 数据默认留在本机 SQLite | 喜欢、不感兴趣、聊天反馈都会改变后续推荐 |
```

**依据 3 · 源码核查**：[README.md:889-892](https://github.com/whiteguo233/OpenBiliClaw/blob/f4af7744995fe053df6cb771738a88d58c419b4a/README.md#L889-L892)

处理位置与备份边界。

```text
## 隐私速览

默认数据流向：浏览器插件 → 你配置的本地 OpenBiliClaw 后端 → 本机 SQLite。插件不会把数据发送到 OpenBiliClaw 开发者运营的服务器。Linux.do 的 `_t` 仅在浏览器内转换为登录布尔，Cookie 值、CSRF 数据和原始站点响应不上传。若你配置云端 LLM / embedding，相关内容会按你的配置发送给对应服务商。详见 [隐私政策](docs/privacy.md)。
默认数据流向：浏览器插件 → 你配置的本地 OpenBiliClaw 后端 → 本机 SQLite / 数据文件。插件不会把数据发送到 OpenBiliClaw 开发者运营的服务器。若你配置云端 LLM / embedding，相关内容会按你的配置发送给对应服务商。你主动从配置页导出的 `.obcbackup` 可能包含模型 / 来源 API Key、Cookie、画像和历史，且**没有加密**；它会排除源机整段 API auth（密码、session、设备 key 等），但仍只能在可信设备间传递。详见 [隐私政策](docs/privacy.md)。
```

#### 缺口

- 未运行后端、浏览器扩展、模型或真实数据源
  **影响**：无法证明推荐质量、隐私配置或反馈投影实际完成
  **进一步探讨**：隔离用户数据并比较订阅基线，核对事件和投影

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
