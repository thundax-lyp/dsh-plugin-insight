# InvoiceFlowAI 发票整理工具

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[8fe3a11](https://github.com/EthanYoQ/Invoice-Downloader/tree/8fe3a1147c619268b41f1480e73c4fa38d97db69)

<!-- BEGIN META -->
[![GitHub ★ 526](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=526&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/EthanYoQ/Invoice-Downloader)
<!-- END META -->

> **功能**：从邮箱收集电子发票和下载链接，识别分类并生成 Excel 汇总

> **亮点**：把收票、候选识别、归档和最终化组织成有范围及终态的批次流程，明确区分未读邮件、识别失败和可人工处理结果，超出单张OCR入口。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：本地归档不代表全链离线，远端识别和字段净化需要原件复核；成功数量不证明邮箱完整或关键字段一致。[Q03](#research-q03)

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
  - [Q01 · 桌面发票整理的合格交付应如何界定？](#detail-section-11)
  - [Q02 · 如何避免把未读完邮箱和未归档结果标成成功？](#detail-section-12)
  - [Q03 · 本地处理和确定性优先能保证字段正确吗？](#detail-section-13)
  - [Q04 · 哪些重复任务值得试用，怎样检验全流程收益？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向每月批量收票的个人和小团队，独立桌面工具将邮箱票据整理为分类原件和报销准备报表。

人工邮件下载、凭证配对和汇总；DSH子包单独适配，根工具不依赖DSH模型。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 邮箱批次收票 | 下载附件及候选链接 | 范围失败须可见 |
| 识别归档与汇总 | 报销准备原件和表格 | 人工复核，非审批/验真 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 支持的桌面环境 | 必需 | WebView与本地处理 | 打包版仍需真实安装验收 |
| QQ/163 IMAP授权 | 必需 | 邮箱读取 | 范围失败不能当无票 |
| 模型配置 | 远端识别必需 | OCR/视觉字段提取 | 图片可能发服务商 |
| 输出磁盘和人工真值 | 必需 | 保存原件、归档与复核 | 不能只看成功数 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户授权邮箱、选日期/公司/目录 | 范围和保存路径明确 |
| 处理 | 协调器扫描到归档 | 未解决邮件或归档阻止完整完成 |
| 复核 | 用户对账原件和报表 | 关键字段与待处理项解释清楚 |
| 恢复退出 | 保存现场补票并撤销授权 | 人工流程能接续 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 桌面/依赖/磁盘资源未知 | 邮箱及规则配置未知 | 安装包未执行 |
| 持续使用 | 模型、链接恢复与存储未知 | 原件、字段和报表复核未知 | 无单位合格批次计量 |
| 失败恢复 | 重试及重复处理资源未知 | 处理未读邮件和保留项未知 | 不只计成功调用 |
| 退出 | 归档迁移资源未知 | 撤销授权并保留原件 | 停用不删除输出 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 批次组织 | 协调器与归档完整门槛 | 真实漏交付率 |
| 邮箱完整性 | 未解决UID抛错 | 所有服务商响应兼容 |
| 识别与复核 | 本地快路径、远端与终态 | 真值正确率及净工时 |

> **思考**：本地归档不代表全链离线，远端识别和字段净化需要原件复核；成功数量不证明邮箱完整或关键字段一致。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把收票、候选识别、归档和最终化组织成有范围及终态的批次流程，明确区分未读邮件、识别失败和可人工处理结果，超出单张OCR入口。[Q01](#research-q01) [Q02](#research-q02)

运行handle所有权、不可完成归档门槛和多终态值得批处理工具借鉴；大量模板和供应商路径带来长期维护成本，不能从源码规模推算可靠性。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

本地归档不代表全链离线，远端识别和字段净化需要原件复核；成功数量不证明邮箱完整或关键字段一致。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

用测试邮箱与混合票据真值批次试用，按原件、关键字段、邮箱范围和可用导出验收；不合格先人工补齐，再决定是否继续。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

桌面入口、作业范围与终态机制有固定源码支持；真值识别质量、安装包与净工时未验收，批次验收增量为假设。

- 已检查：作者 README、包清单、源码路径 README.md、main.py、run_coordinator.py、app_api.py、mailbox_scanner.py、email_fetcher.py、extraction_pipeline.py、invoice_extractor.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根桌面形态抽查入口、API worker、协调器、邮箱扫描、提取和失败终态；Python固定blob读取，未穷尽所有票种和链接供应商。
- 下一步：未安装或执行目标代码、未运行测试、未访问邮箱；不继承作者Stable标签为当前验收结果。

**分析版本**

- **仓库**：[EthanYoQ/Invoice-Downloader](https://github.com/EthanYoQ/Invoice-Downloader)
- **版本号**：未声明（[固定提交 8fe3a11](https://github.com/EthanYoQ/Invoice-Downloader/tree/8fe3a1147c619268b41f1480e73c4fa38d97db69)）
- **版本日期**：2026-09-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是用邮箱范围完整、原件保留与关键字段核对组成批次验收门槛，较成功数量能减少漏交付；固定真值对照漏票发现、人工时间和重试，若只增工时不降错误则推翻。[Q04](#research-q04)

未安装或执行目标代码、未运行测试、未访问邮箱；不继承作者Stable标签为当前验收结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 7 | 1421 | — | — | 10075 |
| .js | source | 3 | 2116 | 1963 | 5 | — |
| .mjs | source | 3 | 213 | 190 | 4 | — |
| .ts | source | 10 | 1351 | 1229 | 2 | — |
| .mjs | test | 3 | 440 | 408 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-28），可前往 [GitHub Issues](https://github.com/EthanYoQ/Invoice-Downloader/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：桌面发票整理的合格交付应如何界定？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 桌面发票整理的合格交付应如何界定？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

InvoiceFlowAI根条目是独立桌面工具，服务每月从QQ/163邮箱收集多张发票的个人与小团队。基线为手工找邮件、下载原件、配对凭证并填汇总；合格结果是邮件范围可解释、原件和字段对应、分类及报表可核对、未解决项明确。它不替代审批、会计确认或发票真伪验证。README声明附件/链接恢复、OCR和凭证撮合，本次重点沿桌面入口、作业协调器、邮箱完整性和提取层核查。根贡献是收票→候选→识别→归档→最终化的任务组织；DSH子包另有宿主模型和凭据路由，不能把两个运行形态的隐私及依赖混写。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:18-26](https://github.com/EthanYoQ/Invoice-Downloader/blob/8fe3a1147c619268b41f1480e73c4fa38d97db69/README.md#L18-L26)

作者定位重复收票与人工复核。

```text
![Status](https://img.shields.io/badge/Status-Stable-brightgreen)

**把邮箱中的 PDF、OFD、XML 电子发票和部分发票下载链接，整理成分类文件与 Excel 报销汇总。**

面向每月需要手工收集多张电子发票的个人、自由职业者和小团队。连接自己的 QQ 或 163 邮箱后，可批量收集发票、OCR 识别、分类归档并生成汇总；低置信度结果保留给用户人工检查。

下载：[最新 Windows（安装版 / 免安装版）与 macOS（Apple Silicon）安装包](https://github.com/EthanYoQ/Invoice-Downloader/releases/latest)

*邮件和发票文件在本地处理。启用 GLM OCR / 视觉识别时，发票图片会发送到你配置的模型服务商用于提取。*
```

**依据 2 · 源码核查**：[main.py:397-417](https://github.com/EthanYoQ/Invoice-Downloader/blob/8fe3a1147c619268b41f1480e73c4fa38d97db69/main.py#L397-L417)

独立WebView应用与InvoiceAppAPI入口。

<details>
<summary>查看原文（21行）</summary>

```text
    import webview

    from app_api import InvoiceAppAPI

    webview.settings["DRAG_REGION_SELECTOR"] = ".window-drag-region"

    runtime_dir = _configure_webview_runtime(webview, current_dir)
    _write_startup_diagnostic(
        "preflight_ok",
        runtime_dir=str(runtime_dir) if runtime_dir else "",
        packaged=bool(getattr(sys, "frozen", False) or hasattr(sys, "_MEIPASS")),
    )
    html_path = _ensure_expected_frontend_assets(current_dir)

    api = InvoiceAppAPI()
    window_geometry = _resolve_window_geometry(webview)

    webview.create_window(
        title=WINDOW_TITLE,
        url=str(html_path),
        js_api=api,
```

</details>

**依据 3 · 源码核查**：[run_coordinator.py:243-275](https://github.com/EthanYoQ/Invoice-Downloader/blob/8fe3a1147c619268b41f1480e73c4fa38d97db69/run_coordinator.py#L243-L275)

扫描、候选、提取和归档组织。

<details>
<summary>查看原文（33行）</summary>

```text
                if not cancelled:
                    self._stage(acquired_handle, RunState.SCANNING)
                    session = self._dependencies.connect(request)
                    cancelled = self._cancelled()
                if not cancelled:
                    emails = self._dependencies.scan(session, request)
                    email_count = self._count(emails)
                    self._state.update(statistics={"emails": email_count, "invoices": 0, "errors": 0})
                    cancelled = self._cancelled()
                else:
                    email_count = 0

                if not cancelled and email_count:
                    self._stage(acquired_handle, RunState.RECOVERING, emails=email_count)
                    candidates = self._dependencies.candidate(emails, request)
                    candidate_count = self._count(candidates)
                    cancelled = self._cancelled()
                else:
                    candidate_count = 0

                if not cancelled and email_count:
                    self._stage(acquired_handle, RunState.EXTRACTING, candidates=candidate_count)
                    outcomes = self._dependencies.extract(candidates, request)
                    outcome_count = self._count(outcomes)
                    cancelled = self._cancelled()
                else:
                    outcome_count = 0

                if not cancelled and email_count:
                    self._stage(acquired_handle, RunState.ARCHIVING, outcomes=outcome_count)
                    archive_report = self._dependencies.archive(outcomes, request)
                    if not bool(getattr(archive_report, "can_complete", False)):
                        raise ArchiveIncompleteError("ARCHIVE_INCOMPLETE")
```

</details>

#### 缺口

- 没有真实报销批次和手工流程的同条件比较
  **影响**：需求规模与净收益不能由功能列表推出
  **进一步探讨**：以人工确认邮件范围和原件真值比较漏票、错字段与人工分钟。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 如何避免把未读完邮箱和未归档结果标成成功？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

main启动WebView并绑定InvoiceAppAPI，处理worker要求预留handle与request.run_id一致后调用RunCoordinator。协调器非阻塞获取运行锁，按连接→扫描→候选→提取→归档推进，并检查archive_report.can_complete；无法完整归档会抛ArchiveIncompleteError。邮箱层使用MailboxScanner分批读取UID及头部，依据消息日期或服务器日期筛选；重试后仍未读到的邮件形成UnresolvedMailboxInputError，在fetcher返回前抛出并记录脱敏UID哈希。因此范围未解决与无发票结果不应混为同一完成情形。提取终态区分resolved、retained、manual_review、unresolved、cancelled及配额/认证/超时，体现部分结果可解释性；实际UI投影是否完整仍需运行验收。

#### 证据与依据

**依据 1 · 源码核查**：[app_api.py:2480-2491](https://github.com/EthanYoQ/Invoice-Downloader/blob/8fe3a1147c619268b41f1480e73c4fa38d97db69/app_api.py#L2480-L2491)

实际worker绑定协调器。

<details>
<summary>查看原文（12行）</summary>

```text
    def _processing_worker(self, request, run_handle, dependencies):
        try:
            if run_handle is None or run_handle is not self._active_run_handle:
                raise RuntimeError("reserved run handle ownership is required")
            if request.run_id != run_handle.run_id:
                raise RuntimeError("run request does not match reserved handle")
            coordinator = RunCoordinator(
                self._run_lifecycle,
                self._run_state_store,
                dependencies,
            )
            return coordinator.run(request, handle=run_handle)
```

</details>

**依据 2 · 源码核查**：[run_coordinator.py:219-248](https://github.com/EthanYoQ/Invoice-Downloader/blob/8fe3a1147c619268b41f1480e73c4fa38d97db69/run_coordinator.py#L219-L248)

锁与run handle约束。

<details>
<summary>查看原文（30行）</summary>

```text
    ) -> RunResult:
        del callbacks
        if not self._run_lock.acquire(blocking=False):
            raise RuntimeError("a run is already active")
        session = None
        started_monotonic = time.monotonic()
        started_at_utc = dt.datetime.now(dt.timezone.utc).isoformat().replace("+00:00", "Z")
        result = RunResult(run_id=request.run_id, state=RunState.CREATED)
        acquired_handle = handle
        try:
            if acquired_handle is None:
                raise RuntimeError("a reserved run handle is required")
            if acquired_handle.run_id != request.run_id:
                raise RuntimeError("run handle does not match request")

            if self._state.snapshot().get("run_id") != request.run_id:
                self._state.reset(request.run_id)
            self._state.update(run_state="running", status_text="正在初始化任务...")
            cancelled = self._cancelled()
            emails: Any = []
            candidates: Any = []
            outcomes: Any = []
            archive_report = None
            try:
                if not cancelled:
                    self._stage(acquired_handle, RunState.SCANNING)
                    session = self._dependencies.connect(request)
                    cancelled = self._cancelled()
                if not cancelled:
                    emails = self._dependencies.scan(session, request)
```

</details>

**依据 3 · 源码核查**：[run_coordinator.py:255-275](https://github.com/EthanYoQ/Invoice-Downloader/blob/8fe3a1147c619268b41f1480e73c4fa38d97db69/run_coordinator.py#L255-L275)

候选到归档与can_complete。

<details>
<summary>查看原文（21行）</summary>

```text
                if not cancelled and email_count:
                    self._stage(acquired_handle, RunState.RECOVERING, emails=email_count)
                    candidates = self._dependencies.candidate(emails, request)
                    candidate_count = self._count(candidates)
                    cancelled = self._cancelled()
                else:
                    candidate_count = 0

                if not cancelled and email_count:
                    self._stage(acquired_handle, RunState.EXTRACTING, candidates=candidate_count)
                    outcomes = self._dependencies.extract(candidates, request)
                    outcome_count = self._count(outcomes)
                    cancelled = self._cancelled()
                else:
                    outcome_count = 0

                if not cancelled and email_count:
                    self._stage(acquired_handle, RunState.ARCHIVING, outcomes=outcome_count)
                    archive_report = self._dependencies.archive(outcomes, request)
                    if not bool(getattr(archive_report, "can_complete", False)):
                        raise ArchiveIncompleteError("ARCHIVE_INCOMPLETE")
```

</details>

**依据 4 · 源码核查**：[mailbox_scanner.py:22-49](https://github.com/EthanYoQ/Invoice-Downloader/blob/8fe3a1147c619268b41f1480e73c4fa38d97db69/mailbox_scanner.py#L22-L49)

未解决邮箱范围与脱敏诊断。

<details>
<summary>查看原文（28行）</summary>

```text
class MailboxScanError(RuntimeError):
    """Raised when mailbox scope cannot be established without risking P0."""

    reason_code = "MAILBOX_SCAN_FAILED"
    user_message = "邮箱扫描响应异常，本次任务已失败；请重试并查看诊断报告。"


class UnresolvedMailboxInputError(RuntimeError):
    reason_code = "UNRESOLVED_MAILBOX_INPUT"
    user_message = "部分邮件在重试后仍无法读取，本次任务已失败；已读取产物保留供诊断。"

    def __init__(self, uids):
        normalized = MailboxScanner.normalize_uids(uids)
        self.unresolved_count = len(normalized)
        self.uid_hashes = tuple(
            hashlib.sha256(uid).hexdigest()[:12] for uid in normalized
        )
        hashes = ",".join(self.uid_hashes)
        super().__init__(
            f"{self.reason_code}; unresolved_count={self.unresolved_count}; uid_hashes={hashes}"
        )

    def diagnostic_payload(self):
        return {
            "event": "unresolved_mailbox_input",
            "reason_code": self.reason_code,
            "unresolved_count": self.unresolved_count,
            "uid_hashes": list(self.uid_hashes),
```

</details>

**依据 5 · 源码核查**：[mailbox_scanner.py:88-110](https://github.com/EthanYoQ/Invoice-Downloader/blob/8fe3a1147c619268b41f1480e73c4fa38d97db69/mailbox_scanner.py#L88-L110)

批量头部与日期筛选。

<details>
<summary>查看原文（23行）</summary>

```text
    def scan(
        self,
        since: dt.date,
        before: dt.date | None,
        mailbox: str = "INBOX",
    ) -> list[MessageRef]:
        since = self._require_date(since, "since")
        before = self._require_date(before, "before", allow_none=True)
        if before is not None and before <= since:
            raise ValueError("before must be after since")

        self.select_mailbox(mailbox)

        uids = self._search_all_uids()
        headers: dict[bytes, MessageRef] = {}
        for chunk in self._chunks(uids, self.header_batch_size):
            headers.update(self._fetch_header_subset(chunk))

        retained = []
        for uid in uids:
            ref = headers.get(uid, MessageRef(uid, None, None))
            effective_date = ref.message_date or ref.internal_date
            if effective_date is None:
```

</details>

**依据 6 · 源码核查**：[email_fetcher.py:2565-2570](https://github.com/EthanYoQ/Invoice-Downloader/blob/8fe3a1147c619268b41f1480e73c4fa38d97db69/email_fetcher.py#L2565-L2570)

未解决邮件抛错而非正常返回。

```text
        if unresolved_email_ids:
            unresolved_error = UnresolvedMailboxInputError(unresolved_email_ids)
            self._emit_mailbox_scan_diagnostic(unresolved_error.diagnostic_payload())
            raise unresolved_error

        return results
```

**依据 7 · 源码核查**：[extraction_pipeline.py:12-39](https://github.com/EthanYoQ/Invoice-Downloader/blob/8fe3a1147c619268b41f1480e73c4fa38d97db69/extraction_pipeline.py#L12-L39)

多个终态区分。

<details>
<summary>查看原文（28行）</summary>

```text
_TERMINAL_STATUSES = frozenset(
    {
        "resolved",
        "retained",
        "manual_review",
        "unresolved",
        "cancelled",
        "quota_exhausted",
        "auth_failed",
        "timeout",
        "duplicate",
    }
)


@dataclass(frozen=True)
class ExtractionOutcome:
    candidate: DocumentCandidate
    status: str
    payload: Any = None
    reason_code: str = ""
    message: str = ""
    artifact_path: str = ""
    trace_context: Mapping[str, Any] = field(default_factory=dict)

    def __post_init__(self) -> None:
        if self.status not in _TERMINAL_STATUSES:
            raise ValueError(f"Unsupported extraction terminal status: {self.status}")
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 本地处理和确定性优先能保证字段正确吗？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

不能。确定性解析能从结构化XML或稳定PDF模板避免模型调用，但字段与真实票据语义仍需核对；例如XML快路径要求正金额和日期形式，红字等输入可能转后续路径。远端LLM提示要求金额、抬头与类型，还会净化Seller名称，这提高文件整洁度却可能丢掉法定主体细节，不能把生成文件名当审计原始字段。README明确启用GLM OCR/视觉会发送发票图片；本地文件处理不等于全链离线。对于链接候选，pipeline将失败按provider分类归为unresolved或retained，不证明所有税务/供应商链接都能恢复。当前代码提供人工复核和保留状态，真正可靠性要看关键字段、漏票和来源映射的真值，而不是成功处理数量。

#### 证据与依据

**依据 1 · 源码核查**：[invoice_extractor.py:1239-1259](https://github.com/EthanYoQ/Invoice-Downloader/blob/8fe3a1147c619268b41f1480e73c4fa38d97db69/invoice_extractor.py#L1239-L1259)

XML确定性路径与正金额/日期条件。

<details>
<summary>查看原文（21行）</summary>

```text
    def probe_local_only(self, pdf_path, document_context=None):
        """Run deterministic extraction paths without touching the GLM runtime."""
        if not pdf_path or not os.path.exists(pdf_path):
            return LocalExtractionProbe("invalid", reason_code="LOCAL_SOURCE_MISSING")
        abs_pdf_path = os.path.abspath(pdf_path)
        if os.path.splitext(abs_pdf_path)[1].lower() == ".xml":
            try:
                with open(abs_pdf_path, "rb") as handle:
                    fields = parse_direct_invoice_xml_fields(handle.read())
            except OSError:
                fields = {}
            required = ("invoice_number", "seller", "amount", "invoice_date")
            valid_fields = all(fields.get(key) for key in required)
            valid_fields = bool(
                valid_fields
                and re.fullmatch(r"\d{8,20}", fields["invoice_number"])
            )
            try:
                dt.datetime.strptime(fields.get("invoice_date", ""), "%Y-%m-%d")
                valid_fields = valid_fields and Decimal(fields["amount"]) > 0
            except (ValueError, InvalidOperation):
```

</details>

**依据 2 · 源码核查**：[invoice_extractor.py:1403-1421](https://github.com/EthanYoQ/Invoice-Downloader/blob/8fe3a1147c619268b41f1480e73c4fa38d97db69/invoice_extractor.py#L1403-L1421)

模型字段要求及Seller净化。

<details>
<summary>查看原文（19行）</summary>

````text
        prompt_text = """
        请从以下提取出的票据文本中提取关键信息，并严格且只能输出一个合法的 JSON 对象。绝对不要输出任何 markdown 标记（如 ```json），直接返回大括号 {} 包裹的内容。
        
        【补丁规则】：
        1. 商家名称净化：在提取 `Seller`（销售方/商家）时，必须去除冗余的后缀（如“xx分店”、“xx餐饮管理有限公司”等），保留核心品牌名（例如将“北京麦当劳食品有限公司南京路分店”简化为“北京麦当劳”）。这样生成的文件夹和文件名会更整洁。
        2. 金额强约束：在提取 `Amount` 时，必须寻找票据上标注为“价税合计”或“小写金额”的数值。如果发现有负数金额（红字对冲票），请在 Amount 前保留负号。
        3. 火车票字段兜底：若判定 Type 为火车票，必须提取 [出发城市] 和 [到达城市]。如果票据模糊无法确认城市，请在对应字段（Departure_City, Destination_City）填入 "未知"，严禁胡乱猜测。
        4. 日期识别补丁：注意：外资酒店账单(Folio)日期常采用 DD/MM/YY 格式（如 25/09/25 实际是 2025年9月25日）。请结合上下文推断年份，切勿将'日'当成'年'，统一提取为 YYYYMMDD 格式。

        必须提取并包含以下精确字段：
        {
            "is_invoice": true或false (布尔值，是否为有效发票、收据或行程单等凭证),
            "Date": "严格使用YYYYMMDD格式，例如20260215",
            "Purchaser": "购买方抬头全称。如果票面只有个人姓名或无公司名，请据实提取姓名或填'个人'。",
            "Seller": "开出该票据的商户或机构名称。遵循商家名称净化规则。如果是火车票/高铁票，固定填'中国铁路'；机票填对应航空公司；滴滴填'滴滴出行'。",
            "Amount": "遵循金额强约束规则提取的数字，保留两位小数。如145.00或-145.00，无金额则返回0.00",
            "InvoiceCode": "发票代码(如有则提供，否则返回空字符串\"\")",
            "InvoiceNumber": "发票号码(如有则提供，否则返回空字符串\"\")",
            "Type": "必须从 {TYPE_CHOICES} 中选择。注意：带税务局监制章的选'住宿发票'；酒店打印的消费明细/宾客账单选'住宿水单'。",
````

</details>

**依据 3 · 作者声明**：[README.md:18-26](https://github.com/EthanYoQ/Invoice-Downloader/blob/8fe3a1147c619268b41f1480e73c4fa38d97db69/README.md#L18-L26)

作者披露视觉服务数据发送。

```text
![Status](https://img.shields.io/badge/Status-Stable-brightgreen)

**把邮箱中的 PDF、OFD、XML 电子发票和部分发票下载链接，整理成分类文件与 Excel 报销汇总。**

面向每月需要手工收集多张电子发票的个人、自由职业者和小团队。连接自己的 QQ 或 163 邮箱后，可批量收集发票、OCR 识别、分类归档并生成汇总；低置信度结果保留给用户人工检查。

下载：[最新 Windows（安装版 / 免安装版）与 macOS（Apple Silicon）安装包](https://github.com/EthanYoQ/Invoice-Downloader/releases/latest)

*邮件和发票文件在本地处理。启用 GLM OCR / 视觉识别时，发票图片会发送到你配置的模型服务商用于提取。*
```

**依据 4 · 源码核查**：[extraction_pipeline.py:75-97](https://github.com/EthanYoQ/Invoice-Downloader/blob/8fe3a1147c619268b41f1480e73c4fa38d97db69/extraction_pipeline.py#L75-L97)

链接失败分终态。

<details>
<summary>查看原文（23行）</summary>

```text
def normalize_url_terminal_outcome(
    candidate: DocumentCandidate, outcome: ExtractionOutcome
) -> ExtractionOutcome:
    """Apply the provider-aware fail-closed policy at one URL terminal boundary."""
    if candidate.identity.source_kind != "url":
        return outcome
    if outcome.status in {"resolved", "duplicate", "cancelled"}:
        return outcome

    provider_family = str(candidate.metadata.get("provider_family") or "").strip()
    target_status = "unresolved" if provider_family else "retained"
    reason_code = str(outcome.reason_code or "URL_DOWNSTREAM_FAILED")
    artifact_path = str(outcome.artifact_path or candidate.source_path)
    if outcome.status == target_status and outcome.artifact_path:
        return outcome
    return ExtractionOutcome(
        candidate=candidate,
        status=target_status,
        payload=outcome.payload,
        reason_code=reason_code,
        message=str(outcome.message or reason_code),
        artifact_path=artifact_path,
        trace_context=outcome.trace_context,
```

</details>

#### 缺口

- 没有同版本的混合模板、红字票和链接恢复真值
  **影响**：不能声称准确率或所有链接支持
  **进一步探讨**：固定含异常模板的真值批次，逐字段核对并跟踪原件与输出映射。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪些重复任务值得试用，怎样检验全流程收益？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

桌面版需受支持Windows/macOS运行环境、IMAP授权、输出磁盘和模型配置；打包版免装Python是作者分发声明，源码运行仍需依赖，不能混成环境已验收。首次准备包括授权、分类规则与保存目录，持续包括模型费用、票据/报表复核，故障包括邮箱读取重试、链接补回、保留项处理和重复扫描对账；金额、分钟和单位合格批次成本未知。可先用非敏感测试邮箱和带原件真值的月度样本试用，验收未读邮件失败状态、原件保留和人工复核，再与手工流程比较。出现漏票、原件丢失或法定抬头不符应停止扩大使用，保留原件人工接管。未验证假设是把“邮箱范围完整、票据原件保留、关键字段复核”合成批次验收门槛，较只看成功数降低漏交付风险。对照两种验收方式，计漏票发现、人工分钟和重试；若新增门槛只增加工时而不降低错误，则推翻价值。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:22-26](https://github.com/EthanYoQ/Invoice-Downloader/blob/8fe3a1147c619268b41f1480e73c4fa38d97db69/README.md#L22-L26)

平台和外部识别条件声明。

```text
面向每月需要手工收集多张电子发票的个人、自由职业者和小团队。连接自己的 QQ 或 163 邮箱后，可批量收集发票、OCR 识别、分类归档并生成汇总；低置信度结果保留给用户人工检查。

下载：[最新 Windows（安装版 / 免安装版）与 macOS（Apple Silicon）安装包](https://github.com/EthanYoQ/Invoice-Downloader/releases/latest)

*邮件和发票文件在本地处理。启用 GLM OCR / 视觉识别时，发票图片会发送到你配置的模型服务商用于提取。*
```

**依据 2 · 作者声明**：[README.md:280-281](https://github.com/EthanYoQ/Invoice-Downloader/blob/8fe3a1147c619268b41f1480e73c4fa38d97db69/README.md#L280-L281)

邮箱需要IMAP授权码而非密码。

```text
- **QQ 邮箱**：须从「管理服务 → 生成授权码」流程中获取，**不是 QQ 密码**
- **163 邮箱**：须从「开启 IMAP 服务」弹窗中生成，**不是邮箱登录密码**，注意大小写
```

**依据 3 · 源码核查**：[run_coordinator.py:271-275](https://github.com/EthanYoQ/Invoice-Downloader/blob/8fe3a1147c619268b41f1480e73c4fa38d97db69/run_coordinator.py#L271-L275)

归档完整门槛为候选验收基础。

```text
                if not cancelled and email_count:
                    self._stage(acquired_handle, RunState.ARCHIVING, outcomes=outcome_count)
                    archive_report = self._dependencies.archive(outcomes, request)
                    if not bool(getattr(archive_report, "can_complete", False)):
                        raise ArchiveIncompleteError("ARCHIVE_INCOMPLETE")
```

**依据 4 · 源码核查**：[email_fetcher.py:2565-2568](https://github.com/EthanYoQ/Invoice-Downloader/blob/8fe3a1147c619268b41f1480e73c4fa38d97db69/email_fetcher.py#L2565-L2568)

邮箱未解决输入不能当无票。

```text
        if unresolved_email_ids:
            unresolved_error = UnresolvedMailboxInputError(unresolved_email_ids)
            self._emit_mailbox_scan_diagnostic(unresolved_error.diagnostic_payload())
            raise unresolved_error
```

#### 缺口

- 缺少实际安装包、单位合格批次成本及退出验收
  **影响**：只支持受控试用，不能建议持续自动放行
  **进一步探讨**：在测试账号记录安装到导出全过程，计入全部模型、重试和人工核对。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
