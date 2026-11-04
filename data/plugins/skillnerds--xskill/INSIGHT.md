# xskill

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[d438329](https://github.com/SkillNerds/xskill/tree/d438329390736e6ea696c4fe25c53a72a06eda37)

<!-- BEGIN META -->
[![GitHub ★ 128](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=128&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/SkillNerds/xskill)
<!-- END META -->

> **功能**：从编码 Agent 执行轨迹提取与分发可复用 Skill，包含 DSH 轨迹和安装适配。

> **亮点**：把跨宿主采集、候选版本和采样归因接成可回查流程。见 [Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：匹配脱敏只覆盖已知文本模式，评分不能替代安全与语义核验。见 [Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · DSH 轨迹如何进入共享经验流程？](#detail-section-11)
  - [Q02 · 上传脱敏和灰度能否作为安全与质量保证？](#detail-section-12)
  - [Q03 · 团队接入前要承担哪些运维和数据成本？](#detail-section-13)
  - [Q04 · 自动抽取能否在可接受的数据范围内提高复用？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：有重复任务的团队可把已有做法沉淀为候选 Skill，再由独立流程评估。

对照人工挑选案例、编写 Skill 和团队审查。少量案例可避免自动采集和分发开销。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 轨迹适配 | 读取会话形成候选输入 | 注意隐私和压缩依赖 |
| 版本样本 | 核对灰度来源 | 不能取代任务验收 |

**流程与依赖**

| 依赖 | 用途 | 边界 |
| --- | --- | --- |
| Python 和模型 | 运行蒸馏 | 团队集中服务 |
| zstandard | 读取 DSH 压缩会话 | 缺失则跳过 |

| 步骤 | 操作 | 退出 |
| --- | --- | --- |
| 准备 | 只放合成轨迹 | 核对上传范围 |
| 复核 | 对比技能和处理日志 | 失败保留人工 |

**效果与成本**

| 阶段 | 负担 | 计量 |
| --- | --- | --- |
| 首次 | 配置部署 | 搭建人时 |
| 持续 | 模型和人工审阅 | 现金与人时分记 |
| 恢复 | 停采集、移除和核对留存 | 远端须单独处理 |

| 效果 | 判据 | 边界 |
| --- | --- | --- |
| 候选经验 | 不同宿主可追溯复用 | 未验实际质量 |

> **思考**：匹配脱敏只覆盖已知文本模式，评分不能替代安全与语义核验。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把跨宿主采集、候选版本和采样归因接成可回查流程。见 [Q01](#research-q01)、[Q02](#research-q02)。

DSH 支持明文与多帧 zstd，缺依赖会跳过；脱敏与评分属于不同处理层。

<a id="detail-section-5"></a>

### 1.4 主要限制

匹配脱敏只覆盖已知文本模式，评分不能替代安全与语义核验。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

保留人工 Skill 流程；仅用合成样本评估数据范围、版本及清理路径。见 [Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

确认 DSH 适配、关键收集路径和版本样本边界，真实团队数据与效果仍待验证。

- 已检查：作者 README、包清单、源码路径 pyproject.toml、src/xskill/ecosystems/deepseek_harness.py、README.md、src/xskill/team/client/collector.py、src/xskill/team/client/redact.py、src/xskill/canary.py、docs/deployment-mode.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 DSH 适配、部分采集及灰度样本逻辑。未运行服务或审计所有上传路径。
- 下一步：隔离合成轨迹检查读取、脱敏、接收、安装与退出，再跑配对比较。

**分析版本**

- **仓库**：[SkillNerds/xskill](https://github.com/SkillNerds/xskill)
- **版本号**：未声明（[固定提交 d438329](https://github.com/SkillNerds/xskill/tree/d438329390736e6ea696c4fe25c53a72a06eda37)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

以合成故障对照人工与自动抽取，并独立记录泄露、成功率和审阅人时。见 [Q04](#research-q04)。

隔离合成轨迹检查读取、脱敏、接收、安装与退出，再跑配对比较。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 98 | 16401 | — | — | 171582 |
| .md | example | 15 | 297 | — | — | 1989 |
| .js | source | 4 | 3930 | 3655 | 154 | — |
| .mjs | source | 2 | 91 | 74 | 12 | — |
| .md | test | 5 | 200 | — | — | 1987 |

</details>

**活跃度**

[![Issue 未关闭 34](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=34&color=737b86&logo=github)](https://github.com/SkillNerds/xskill/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/SkillNerds/xskill/issues?q=is%3Aissue+created%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/SkillNerds/xskill/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：跨宿主轨迹如何成为共享技能，隐私与灰度结果怎样核验？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · DSH 轨迹如何进入共享经验流程？

**研究主题**：场景与需求、功能与机制、工程质量与复用

#### 完整回答

反复解决相似故障的团队可让独立 xskill 服务从不同宿主轨迹提取候选做法。根项目是 Python 分发；DSH 适配接受 session.jsonl 和压缩文件，读取后由生态适配转换，缺少 zstandard 会尝试补齐，失败则跳过压缩文件。技能安装辅助函数将目录写到用户 DSH Skill 根。README 的拆分、聚类和灰度是项目设计，具体收益不能由适配入口推出。相对手工编写并发放团队 Skill，此项目增加自动采集和更新，也引入了隐私和质量审核。

#### 证据与依据

**依据 1 · 源码核查**：[pyproject.toml:5-16](https://github.com/SkillNerds/xskill/blob/d438329390736e6ea696c4fe25c53a72a06eda37/pyproject.toml#L5-L16)

独立 Python 项目

<details>
<summary>查看原文（12行）</summary>

```text
[project]
name = "xskill"
dynamic = ["version"]
description = "Distill reusable Skills from AI Agent execution trajectories"
readme = "README.md"
requires-python = ">=3.9"
license = { text = "MIT" }
authors = [{ name = "SkillNerds", email = "370025263@qq.com" }]
keywords = ["agent", "skill", "trajectory", "llm", "rag", "self-evolving"]
classifiers = [
    "Development Status :: 4 - Beta",
    "Intended Audience :: Developers",
```

</details>

**依据 2 · 源码核查**：[src/xskill/ecosystems/deepseek_harness.py:107-118](https://github.com/SkillNerds/xskill/blob/d438329390736e6ea696c4fe25c53a72a06eda37/src/xskill/ecosystems/deepseek_harness.py#L107-L118)

安装目标是 DSH Skill 根

<details>
<summary>查看原文（12行）</summary>

```text
def install_all_to_deepseek_harness(
    skill_dir: Path | str,
    target_root: Path | str | None = None,
    names: Iterable[str] | None = None,
) -> list[Path]:
    """Install every skill under ``skill_dir`` (each subdir = one skill) to
    DeepSeek Harness's user skill root (``<target_root>/.dsh/skills``). If
    ``names`` is given, restrict to those.
    """
    return _install_all_with(
        install_to_deepseek_harness, skill_dir, target_root, names,
    )
```

</details>

**依据 3 · 源码核查**：[src/xskill/ecosystems/deepseek_harness.py:286-336](https://github.com/SkillNerds/xskill/blob/d438329390736e6ea696c4fe25c53a72a06eda37/src/xskill/ecosystems/deepseek_harness.py#L286-L336)

压缩路径、失败和 DSH 生态配置

<details>
<summary>查看原文（51行）</summary>

```text
    """把 dsh session 文件读成逐行文本：``session.jsonl`` 直读；
    ``session.jsonl.zstd`` 用 ``zstandard`` 跨帧流式解码。

    dsh 的压缩产物是**独立帧的顺序拼接**（首帧 header、之后每批一帧），
    ``ZstdDecompressor.stream_reader(read_across_frames=True)`` 正好对应
    这一布局。``zstandard`` 在 extra ``xskill[dsh]``；缺库时先对
    ``~/.dsh`` 做一次现场补装，仍缺失则返回 None：只警告一次（避免每
    5 秒刷屏），ingester 跳过该文件；明文文件不受影响。
    """
    global _ZSTD_MISSING_WARNED
    if path.suffix != ".zstd":
        return path.read_text(encoding="utf-8", errors="ignore")
    if not zstandard_available():
        home = _home_root_from_dsh_session(path)
        ensure_zstandard_for_dsh(home)
    try:
        import zstandard
    except ImportError:
        if not _ZSTD_MISSING_WARNED:
            _ZSTD_MISSING_WARNED = True
            logger.warning(
                "DeepSeek Harness 会话默认为 zstd 压缩（%s），解码需要依赖 "
                "zstandard（extra xskill[dsh]）：pip install zstandard 或 "
                "pip install 'xskill[dsh]'。安装前压缩会话不会被桥接；明文会话"
                "不受影响。",
                path,
            )
        return None
    try:
        raw = path.read_bytes()
        dctx = zstandard.ZstdDecompressor()
        with dctx.stream_reader(raw, read_across_frames=True) as reader:
            return reader.read().decode("utf-8", errors="ignore")
    except (OSError, zstandard.ZstdError) as exc:
        # 正在写入中的最后一帧可能不完整；下一轮 settle 后重试即可
        logger.debug("dsh zstd session not decodable yet (%s): %s", path, exc)
        return None


DSH_SPEC = EcosystemSpec(
    name="deepseek_harness",
    source_kind="jsonl",
    sessions_path=_dsh_sessions_path,
    # --<normalized-cwd>--/<encoded-id>/session.jsonl 或 .jsonl.zstd。
    # 一个 root 只会是一种编码（dsh 拒绝混放），glob 同时接受两种即可。
    sessions_glob="*/*/session.jsonl*",
    session_id_from_path=_dsh_session_id_from_path,
    cwd_from_content=_read_cwd_from_dsh_jsonl,
    adapter_format="deepseek_harness_session_jsonl",
    traj_id_prefix="traj_dsh_",
    skills_install_path=_dsh_skills_path,
```

</details>

**依据 4 · 作者声明**：[README.md:72-80](https://github.com/SkillNerds/xskill/blob/d438329390736e6ea696c4fe25c53a72a06eda37/README.md#L72-L80)

蒸馏与灰度架构声明

```text
## 架构

<div align="center">
<img src="docs/assets/xs_architecture.zh.svg" width="900" alt="xskill 架构:agent 生态 → 轨迹 watcher → 原子拆分 → 技能路由 → 技能编辑 agent → canary 灰度 A/B → 技能仓库,并支持团队模式">
</div>

> [!NOTE]
> xskill全流程都是Agentic-Centric的管线。首先将轨迹按照内部意图拆分为子轨迹（轨迹原子），然后对轨迹原子进行聚类并分配到对应的skill，原子积攒足够后就会触发skill编辑产出新的skill版本。
不同的skill版本会在真实的用户流量上进行测试，用户体验分高的胜出作为主版本继续迭代，每一次改动都有版本、可回滚。细节见 [`docs/agent.md`](https://github.com/SkillNerds/xskill/blob/main/docs/agent.md)。
```

#### 缺口

- 未对真实 DSH 压缩轨迹和安装运行验证
  **影响**：未知实际导入、兼容与回退
  **进一步探讨**：使用隔离目录回放合成的明文及压缩轨迹

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 上传脱敏和灰度能否作为安全与质量保证？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

团队收集器先作隐私策略决定，跳过的轨迹不会进入当前处理分支；其余分支可调用 redact_text 并对清理文本计算哈希。脱敏利用 detect-secrets 及补充模式，作用范围是已匹配的文本，不能保证捕获所有公司标识、私有代码或非标准凭据。灰度代码配置包括样本阈值，并按当前版本 SHA 识别采样。相比直接推送新 Skill，能建立版本归因与样本门槛；LLM 评分和使用人群差异仍可能偏置，不能将均分视为安全或正确性验收。先观察 synthetic 数据可验证机制，不适于把真实轨迹作为初次测试材料。

#### 证据与依据

**依据 1 · 源码核查**：[src/xskill/team/client/collector.py:195-223](https://github.com/SkillNerds/xskill/blob/d438329390736e6ea696c4fe25c53a72a06eda37/src/xskill/team/client/collector.py#L195-L223)

策略跳过与脱敏哈希

<details>
<summary>查看原文（29行）</summary>

```text
            decision = policy.decide(sidecar.cwd, sidecar.readable, privacy_mode)
            if decision.action == ACTION_SKIP:
                logger.debug("privacy: skip %s (%s)", traj_id, decision.reason)
                continue
            model_name = sidecar.model
            state = self._state_store.get(traj_id)
            metadata_same = (
                state is not None
                and state["file_size_bytes"] == stat.st_size
                and state["file_modified_time_nanoseconds"] == stat.st_mtime_ns
                and state["file_changed_time_nanoseconds"] == stat.st_ctime_ns
            )
            if metadata_same:
                sha = state["cleaned_content_hash"]
                if sha and state["uploaded_cleaned_content_hash"] == sha:
                    if state["waiting_content_hash"] is not None:
                        self._state_store.clear_waiting(traj_id)
                    continue
                if not sha:
                    raw = self._read_trajectory_text(md)
                    raw_sha = hashlib.sha256(raw.encode("utf-8")).hexdigest()
                    content = redact_text(raw)
                    sha = hashlib.sha256(content.encode("utf-8")).hexdigest()
                    self._state_store.record_seen_file(
                        trajectory_id=traj_id,
                        file_path=str(md),
                        harness_name=harness_name,
                        model_name=model_name,
                        file_size_bytes=stat.st_size,
```

</details>

**依据 2 · 源码核查**：[src/xskill/team/client/redact.py:98-122](https://github.com/SkillNerds/xskill/blob/d438329390736e6ea696c4fe25c53a72a06eda37/src/xskill/team/client/redact.py#L98-L122)

文本规则清理范围

<details>
<summary>查看原文（25行）</summary>

```text
def redact_text(text: str) -> str:
    """对一段轨迹文本脱敏：命中的凭证全部替换为 `[REDACTED]`。

    幂等：`[REDACTED]` 不匹配任何检测器/正则，重复调用结果稳定。
    """
    # ① PEM 私钥块
    text = _PEM_BLOCK.sub(_REDACTED, text)
    # ② detect-secrets 23 个厂商/格式检测器的 denylist 正则，全匹配替换
    for regex in _REGEX_DETECTORS:
        text = regex.sub(_REDACTED, text)
    # ②b 通用 sk- 前缀密钥（detect-secrets 不覆盖多厂商 sk-）
    text = _SK_PREFIX_TOKEN.sub(_REDACTED, text)
    # ③ KeywordDetector：带引号的赋值（`api_key: "sk-..."` 这类）
    found: set[str] = set()
    with transient_settings(_KEYWORD_CONFIG):
        for line in text.splitlines():
            for secret in scan_line(line):
                if secret.secret_value:
                    found.add(secret.secret_value)
    # 长的先替换：短 secret 若是长 secret 的子串，先换短的会毁掉长的。
    for value in sorted(found, key=len, reverse=True):
        text = text.replace(value, _REDACTED)
    # ④ 大写 env 风格裸值赋值：保留 keyword 前缀，只替换值
    text = _ENV_SECRET_ASSIGN.sub(lambda m: f"{m[1]}{m[2]}{_REDACTED}", text)
    return text
```

</details>

**依据 3 · 源码核查**：[src/xskill/canary.py:50-86](https://github.com/SkillNerds/xskill/blob/d438329390736e6ea696c4fe25c53a72a06eda37/src/xskill/canary.py#L50-L86)

固定配置的门槛

<details>
<summary>查看原文（37行）</summary>

```text
    enabled: bool = True
    probability: float = 0.2
    min_samples: int = 5
    max_days_hold: int = 14
    rotate_interval: int = 300
    # ── 模型分桶灰度（batch3）──
    # scope_top_n: 只有"使用量 top-N 的用户模型"参与灰度（路由 + 打分）;
    #              unknown 与 top-N 之外的模型一律走 main，不进 staging、不计分。
    # total_samples: 每侧（main/staging）判定所需的总样本数（跨所有参与模型）。
    scope_top_n: int = 2
    total_samples: int = 20
    # ── 轨迹堰塞强砍（jam）三条件合取 ────────────────────────────────
    # staging 存在期间 hold 普通 SkillEdit；仅当同时满足：
    #   1) age(staging) >= min_jam_age_sec
    #   2) 当前 (main_sha, staging_sha) 上距最近一条 ux 分（没有则从 staging
    #      创建起算）已超过 jam_plateau_sec
    #   3) candidates Σweightscore >= jam_threshold
    # 才越过灰度强砍合并。三者缺一不可——避免「候选堆满就砍」抢走 A/B。
    # jam_threshold 必须 > 正常毕业阈值 (ATOM_PROMOTION_THRESHOLD=10)。
    jam_threshold: int = 50
    min_jam_age_sec: float = 1800.0      # 30min：最短灰度观察窗
    jam_plateau_sec: float = 600.0       # 10min：该 sha 对最近一条 ux 分过了多久

    @classmethod
    def from_dict(cls, d: dict | None) -> "CanaryConfig":
        d = d or {}
        return cls(
            enabled=bool(d.get("enabled", True)),
            probability=float(d.get("probability", 0.2)),
            min_samples=int(d.get("min_samples", 5)),
            max_days_hold=int(d.get("max_days_hold", 14)),
            rotate_interval=int(d.get("rotate_interval", 300)),
            scope_top_n=int(d.get("scope_top_n", 2)),
            total_samples=int(d.get("total_samples", 20)),
            jam_threshold=int(d.get("jam_threshold", 50)),
            min_jam_age_sec=float(d.get("min_jam_age_sec", 1800.0)),
            jam_plateau_sec=float(d.get("jam_plateau_sec", 600.0)),
```

</details>

**依据 4 · 源码核查**：[src/xskill/canary.py:90-114](https://github.com/SkillNerds/xskill/blob/d438329390736e6ea696c4fe25c53a72a06eda37/src/xskill/canary.py#L90-L114)

按当前 SHA 匹配样本

<details>
<summary>查看原文（25行）</summary>

```text
def _ux_rows_for_shas(
    scores: list[dict], *, m_sha: str, s_sha: str,
) -> tuple[int, int, datetime | None]:
    """当前 main/staging sha 上的样本数，以及这些样本里最晚的 scored_at。"""
    main_n = staging_n = 0
    last: datetime | None = None
    for row in scores:
        side = row.get("side")
        sha = row.get("commit_sha") or ""
        if side == "main" and sha == m_sha:
            main_n += 1
        elif side == "staging" and sha == s_sha:
            staging_n += 1
        else:
            continue
        raw = row.get("scored_at") or ""
        if not raw:
            continue
        try:
            ts = _parse_git_iso(str(raw))
        except ValueError:
            continue
        if last is None or ts > last:
            last = ts
    return main_n, staging_n, last
```

</details>

**依据 5 · 作者声明**：[docs/deployment-mode.md:22-35](https://github.com/SkillNerds/xskill/blob/d438329390736e6ea696c4fe25c53a72a06eda37/docs/deployment-mode.md#L22-L35)

灰度与 LLM 评分设计

<details>
<summary>查看原文（14行）</summary>

```text
### Grey-testing (canary) behavior

Time-window based rotation. The watcher periodically calls `_reconcile_skill_sides()` to decide which skill version gets real traffic:

- **Bucketing:** `pick_side(window_id, skill_name, probability)` where `window_id = int(now // rotate_interval)`
- **`rotate_interval`:** default 300s (configurable in `config.yaml`)
- **Probability:** default 0.2 (20% traffic to staging)
- **Materialization:** staging branch content is checked out into `.canary/` subdirectory under the skill root
- **Decision:** after `min_samples` (default 5) UX scores per side, compare averages:
  - `staging_avg >= main_avg` → promote staging to main
  - `staging_avg < main_avg` → discard staging
- **Timeout:** staging max 14 days (`max_days_hold`); discarded if insufficient samples
- **UX scoring:** LLM-as-judge scores each AtomTask 1-10, reads `xskill:skill=X side=Y sha=Z` header from traj

```

</details>

#### 缺口

- 未核对全量上传分支、脱敏覆盖及评分偏差
  **影响**：不能推断全量保密或灰度胜出就是质量提升
  **进一步探讨**：用合成秘密、项目标识和两版本的真实任务盲审分开验证

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 团队接入前要承担哪些运维和数据成本？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

项目文档区分单机和 team client-server，团队服务器拥有模型和 Git 操作，客户端发送轨迹并取回技能。首次需要 Python、目标宿主目录和可能的解压依赖；团队还需服务地址、令牌、模型与安全审阅。持续成本包括收集与判分的模型请求、Skill 回滚、数据保留和人工审阅。退出要停止采集并检查目标 Skill 目录、测试轨迹和远端留存，不能假定卸载客户端撤回已经发出的记录。未验证数据清除和权限隔离前，结论只宜继续观察，实验限无敏感合成材料。

#### 证据与依据

**依据 1 · 作者声明**：[docs/deployment-mode.md:3-11](https://github.com/SkillNerds/xskill/blob/d438329390736e6ea696c4fe25c53a72a06eda37/docs/deployment-mode.md#L3-L11)

单机运行方式

````text
xskill has two deployment modes: **standalone** (single-user) and **team** (multi-user client-server).

## Standalone mode

Designed for single-user / indie use. Everything runs on one machine.

```
xskill serve
```
````

**依据 2 · 作者声明**：[docs/deployment-mode.md:47-60](https://github.com/SkillNerds/xskill/blob/d438329390736e6ea696c4fe25c53a72a06eda37/docs/deployment-mode.md#L47-L60)

团队职责和令牌

<details>
<summary>查看原文（14行）</summary>

````text
## Team mode

**Client-server architecture.** The server owns all LLM calls and git operations; clients are thin collectors that send trajectories and receive synced skills.

### Server

```
xskill serve --server
```

### Client

```
xskill connect <host:port> --token <token>
````

</details>

**依据 3 · 源码核查**：[pyproject.toml:29-51](https://github.com/SkillNerds/xskill/blob/d438329390736e6ea696c4fe25c53a72a06eda37/pyproject.toml#L29-L51)

依赖与脱敏库

<details>
<summary>查看原文（23行）</summary>

```text
dependencies = [
    "pyyaml>=6.0",
    "numpy>=1.24",
    "openai>=1.0",
    "agno",
    "tqdm",
    "httpx",
    "fastapi",
    "python-multipart",
    "uvicorn",
    "sse-starlette",
    "packaging>=23",
    "rank-bm25>=0.2",
    # team 模式上传前的轨迹脱敏（team/client/redact.py）。脱敏是上传链路的
    # 强制环节，故列为主依赖而非 optional extra——缺库就该 import 失败。
    "detect-secrets>=1.5",
    # 纯 Python git 实现，替代系统 ``git`` 二进制——容器/受限环境（如
    # ``python:3.9-slim``）默认没装 git，SkillEditAgent 等链路又要跑 git
    # init/commit/branch；走 dulwich 后零依赖系统 git。
    "dulwich>=0.21",
    # Python 3.9 上 pydantic 需要它来求值 `X | Y` 联合注解（PEP 604 语法
    # 3.10 才原生支持）；3.10+ 不安装。
    "eval_type_backport; python_version < '3.10'",
```

</details>

**依据 4 · 源码核查**：[src/xskill/ecosystems/deepseek_harness.py:107-118](https://github.com/SkillNerds/xskill/blob/d438329390736e6ea696c4fe25c53a72a06eda37/src/xskill/ecosystems/deepseek_harness.py#L107-L118)

真实写入目标

<details>
<summary>查看原文（12行）</summary>

```text
def install_all_to_deepseek_harness(
    skill_dir: Path | str,
    target_root: Path | str | None = None,
    names: Iterable[str] | None = None,
) -> list[Path]:
    """Install every skill under ``skill_dir`` (each subdir = one skill) to
    DeepSeek Harness's user skill root (``<target_root>/.dsh/skills``). If
    ``names`` is given, restrict to those.
    """
    return _install_all_with(
        install_to_deepseek_harness, skill_dir, target_root, names,
    )
```

</details>

#### 缺口

- 未测服务器清理、回滚与跨宿主隔离
  **影响**：不推荐接入真实团队轨迹
  **进一步探讨**：先用无真实身份的测试部署核对数据保留、导出与删除

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 自动抽取能否在可接受的数据范围内提高复用？

**研究主题**：新假设与验证

#### 完整回答

待验证假设是在相同输入权限下，候选 Skill 可减少后继操作者重复寻找步骤的成本。用同一合成故障集比较人工编写与自动抽取，并植入已知合成标识核对是否泄露。评估独立任务成功率、错误建议率、审阅时间和每项模型消耗。若引入敏感字段、错误步骤或总审阅成本未降，就继续人工维护。脱敏和评分分开检验，防止高分掩盖数据问题。

#### 证据与依据

**依据 1 · 源码核查**：[src/xskill/team/client/redact.py:98-122](https://github.com/SkillNerds/xskill/blob/d438329390736e6ea696c4fe25c53a72a06eda37/src/xskill/team/client/redact.py#L98-L122)

脱敏提供可测试的规则表

<details>
<summary>查看原文（25行）</summary>

```text
def redact_text(text: str) -> str:
    """对一段轨迹文本脱敏：命中的凭证全部替换为 `[REDACTED]`。

    幂等：`[REDACTED]` 不匹配任何检测器/正则，重复调用结果稳定。
    """
    # ① PEM 私钥块
    text = _PEM_BLOCK.sub(_REDACTED, text)
    # ② detect-secrets 23 个厂商/格式检测器的 denylist 正则，全匹配替换
    for regex in _REGEX_DETECTORS:
        text = regex.sub(_REDACTED, text)
    # ②b 通用 sk- 前缀密钥（detect-secrets 不覆盖多厂商 sk-）
    text = _SK_PREFIX_TOKEN.sub(_REDACTED, text)
    # ③ KeywordDetector：带引号的赋值（`api_key: "sk-..."` 这类）
    found: set[str] = set()
    with transient_settings(_KEYWORD_CONFIG):
        for line in text.splitlines():
            for secret in scan_line(line):
                if secret.secret_value:
                    found.add(secret.secret_value)
    # 长的先替换：短 secret 若是长 secret 的子串，先换短的会毁掉长的。
    for value in sorted(found, key=len, reverse=True):
        text = text.replace(value, _REDACTED)
    # ④ 大写 env 风格裸值赋值：保留 keyword 前缀，只替换值
    text = _ENV_SECRET_ASSIGN.sub(lambda m: f"{m[1]}{m[2]}{_REDACTED}", text)
    return text
```

</details>

**依据 2 · 源码核查**：[src/xskill/canary.py:90-114](https://github.com/SkillNerds/xskill/blob/d438329390736e6ea696c4fe25c53a72a06eda37/src/xskill/canary.py#L90-L114)

版本标记可用于配对

<details>
<summary>查看原文（25行）</summary>

```text
def _ux_rows_for_shas(
    scores: list[dict], *, m_sha: str, s_sha: str,
) -> tuple[int, int, datetime | None]:
    """当前 main/staging sha 上的样本数，以及这些样本里最晚的 scored_at。"""
    main_n = staging_n = 0
    last: datetime | None = None
    for row in scores:
        side = row.get("side")
        sha = row.get("commit_sha") or ""
        if side == "main" and sha == m_sha:
            main_n += 1
        elif side == "staging" and sha == s_sha:
            staging_n += 1
        else:
            continue
        raw = row.get("scored_at") or ""
        if not raw:
            continue
        try:
            ts = _parse_git_iso(str(raw))
        except ValueError:
            continue
        if last is None or ts > last:
            last = ts
    return main_n, staging_n, last
```

</details>

#### 缺口

- 无同任务独立对照
  **影响**：复用和净收益未知
  **进一步探讨**：按预登记故障集、泄露与质量指标执行比较

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
