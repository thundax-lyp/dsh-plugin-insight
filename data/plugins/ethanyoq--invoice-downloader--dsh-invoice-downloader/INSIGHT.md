# InvoiceFlowAI DSH 发票插件

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[8fe3a11](https://github.com/EthanYoQ/Invoice-Downloader/tree/8fe3a1147c619268b41f1480e73c4fa38d97db69/plugins/dsh-invoice-downloader)

<!-- BEGIN META -->
[![GitHub ★ 526](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=526&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/EthanYoQ/Invoice-Downloader) [![npm 30d 1,348](https://img.shields.io/static/v1?label=npm+30d&message=1%2C348&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ethanyoq/dsh-invoice-downloader) [![最新发布 2026-08-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-23&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ethanyoq/dsh-invoice-downloader)
<!-- END META -->

> **功能**：在 DSH 边栏收集邮箱发票、识别字段、分类归档并导出 Excel

> **亮点**：把既有收票引擎接到DSH当前模型、凭据、作业记录和边栏，减少跨程序交接，并对输出目录和作业状态建立约束。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：语法字段校验不证明账实一致；导出引用注册失败仍可complete，取消后已有文件也需核对，不能把完成状态当合格交付。[Q03](#research-q03)

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
  - [Q01 · 重复收票者能把哪些工作交给 DSH 边栏？](#detail-section-11)
  - [Q02 · 扫描如何从边栏进入邮箱、OCR和模型？](#detail-section-12)
  - [Q03 · 完成状态、字段校验和取消能保证账实一致吗？](#detail-section-13)
  - [Q04 · 何时值得采用，怎样检验少做模型调用是否仍可靠？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向固定 QQ 或 163 邮箱的重复收票者，在 DSH 边栏下载、识别并整理报销准备材料。

人工逐邮件下载、分类与填表，或独立桌面版；已有Python识别和归档不算DSH适配层原创。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 发票边栏作业 | IMAP下载、OCR与汇总 | 支持邮箱、引擎与当前模型 |
| 结果归档 | 原件和Excel准备材料 | 人工核对，不等于审批完成 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH连接/子进程/会话/LLM/凭据 | 必需 | 边栏与作业编排 | 非独立运行包 |
| Python本地引擎、OCR和Chromium | 必需 | 邮件/票据/链接处理 | 首次需联网安装 |
| QQ/163 IMAP授权 | 必需 | 限定邮箱抓取 | 其他邮箱拒绝 |
| 当前模型 | 字段提取必需 | OCR文本结构化 | 文本会进入配置provider |
| GLM key | 视觉降级可选 | 失败补识别 | 图片可发外部模型 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 配置 | 用户选目录、装引擎、存凭据 | 邮箱授权与模型可用 |
| 扫描 | 用户限定日期和公司，后台处理 | 原件、待复核与进度一致 |
| 验收 | 人工核对票号/金额/公司和Excel | 完成且有真实可读导出 |
| 恢复 | 核对部分文件再决定重扫 | 不盲目重复处理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Python依赖、Chromium和磁盘未知 | 邮箱/目录/模型配置未知 | 联网安装需环境条件 |
| 持续使用 | 模型提取与可选视觉费用未知 | 原件与字段复核未知 | 500输出token不是单票成本 |
| 失败恢复 | 重试及残留文件资源未知 | 对账、补票和修正未知 | 无合格交付计量 |
| 退出 | 本地票据和会话留存资源未知 | 撤销邮箱授权并整理输出 | 禁用不删除票据和记录 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 流程集成 | 邮箱→OCR→模型→归档/Excel接线 | 真实漏票与工时 |
| 数据边界 | 输出根限制与宿主凭据 | 当前环境权限动态结果 |
| 可复核 | 票据原件、待复核和会话计数 | 每行关键字段正确率 |

> **思考**：语法字段校验不证明账实一致；导出引用注册失败仍可complete，取消后已有文件也需核对，不能把完成状态当合格交付。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把既有收票引擎接到DSH当前模型、凭据、作业记录和边栏，减少跨程序交接，并对输出目录和作业状态建立约束。[Q01](#research-q01) [Q02](#research-q02)

适配层分离IPC、模型、凭据与文件边界，便于将桌面引擎接入宿主；catch归一失败和导出注册吞错削弱诊断，移植需保留部分完成语义。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

语法字段校验不证明账实一致；导出引用注册失败仍可complete，取消后已有文件也需核对，不能把完成状态当合格交付。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

用测试邮箱和有真值的混合批次试用，先验收原件、关键字段和可用导出，再比较人工总时间；缺票、静默错误或完成无报表时暂停，保留原件人工接管。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

边栏RPC、IPC、模型路由和归档接线有源码支持；票据准确性、合格率和成本未测，字段门控仅为假设。

- 已检查：作者 README、包清单、源码路径 plugins/dsh-invoice-downloader/package.json、plugins/dsh-invoice-downloader/src/activate.ts、plugins/dsh-invoice-downloader/src/rpc-handler.ts、plugins/dsh-invoice-downloader/src/invoice-scanner.ts、plugins/dsh-invoice-downloader/engine-adapter/dsh_scan.py、plugins/dsh-invoice-downloader/engine-adapter/engine-src/recognition_chain.py、plugins/dsh-invoice-downloader/engine-adapter/engine-src/deepseek_extractor.py、plugins/dsh-invoice-downloader/src/file-security.ts 及固定范围 inventory；组件：plugins/dsh-invoice-downloader。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅DSH子包，读取activate、scanner、RPC、artifact与Python适配/识别验证原件；不把根桌面版所有能力算作插件已验收。
- 下一步：未安装、运行目标代码或测试，未访问用户邮箱；真实票据识别与报销合格性需人工真值验收。

**分析版本**

- **仓库**：[EthanYoQ/Invoice-Downloader](https://github.com/EthanYoQ/Invoice-Downloader)
- **版本号**：0.1.1（[固定提交 8fe3a11](https://github.com/EthanYoQ/Invoice-Downloader/tree/8fe3a1147c619268b41f1480e73c4fa38d97db69)）
- **版本日期**：2026-09-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是显式字段门控与人工复核触发模型降级可降低资源而不损害质量；用固定真值批次比较错字段、漏票、人工修正、全部重试与模型费用，静默错误增加或总工时不降则推翻。[Q04](#research-q04)

未安装、运行目标代码或测试，未访问用户邮箱；真实票据识别与报销合格性需人工真值验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 69 | — | — | 890 |
| .mjs | source | 3 | 213 | 190 | 4 | — |
| .ts | source | 10 | 1351 | 1229 | 2 | — |
| .js | source | 1 | 531 | 509 | 0 | — |
| .mjs | test | 3 | 440 | 408 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-28），可前往 [GitHub Issues](https://github.com/EthanYoQ/Invoice-Downloader/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：重复收票者能把哪些工作交给 DSH 边栏？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 重复收票者能把哪些工作交给 DSH 边栏？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

对象是固定QQ或163邮箱、每月收集多张电子发票的个人与小团队；原办法是逐邮件下载、识别字段、分类和填Excel。合格结果是原始票据、字段与汇总相互对应，缺失和待复核文件明确；不是报销审批、会计确认或税务验真。该包是原生Cordis插件，入口注入子进程、连接、会话、LLM和凭据，注册loopback /invoice RPC，为右侧边栏提供作业入口，并非自主模型工具注册。增量是把已有Python引擎接入DSH当前模型、凭据与会话记录，减少多程序交接。偶发单张或非支持邮箱不一定值得配置本地引擎。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-invoice-downloader/package.json:1-12](https://github.com/EthanYoQ/Invoice-Downloader/blob/8fe3a1147c619268b41f1480e73c4fa38d97db69/plugins/dsh-invoice-downloader/package.json#L1-L12)

包定位本地IMAP/OCR/汇总bundle。

<details>
<summary>查看原文（12行）</summary>

```text
{
  "name": "@ethanyoq/dsh-invoice-downloader",
  "version": "0.1.1",
  "description": "Local IMAP invoice download, OCR, archive, and Excel summary bundle for DeepSeek Harness",
  "license": "Apache-2.0",
  "type": "module",
  "main": "./lib/index.js",
  "types": "./lib/index.d.ts",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/EthanYoQ/Invoice-Downloader.git",
    "directory": "plugins/dsh-invoice-downloader"
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-invoice-downloader/src/activate.ts:40-41](https://github.com/EthanYoQ/Invoice-Downloader/blob/8fe3a1147c619268b41f1480e73c4fa38d97db69/plugins/dsh-invoice-downloader/src/activate.ts#L40-L41)

真实插件名与注入服务。

```text
export const name = 'invoice-downloader'
export const inject = ['subprocess', 'connection', 'sessions', 'llm', 'agentDefaultModel', 'credentials']
```

**依据 3 · 源码核查**：[plugins/dsh-invoice-downloader/src/activate.ts:64-80](https://github.com/EthanYoQ/Invoice-Downloader/blob/8fe3a1147c619268b41f1480e73c4fa38d97db69/plugins/dsh-invoice-downloader/src/activate.ts#L64-L80)

RPC及会话、凭据和导出注册。

<details>
<summary>查看原文（17行）</summary>

```text
  const sessions = new ScanSessionManager()
  sessions.setContext({ sessions: context.sessions })
  const handler = createInvoiceRpcHandler({
    savePath,
    profileDir,
    graceMs: config.graceMs ?? 2_000,
    subprocess: context.subprocess,
    runtime,
    scanner,
    sessions,
    credentials: context.credentials,
    artifacts: new ArtifactRegistry(),
  })
  context.effect(
    () => context.connection.rpc.handle('/invoice', handler, { authority: 'loopback' }),
    'invoice-downloader: loopback RPC channel',
  )
```

</details>

#### 缺口

- 无真实用户批次频率、合格率及人工对照
  **影响**：不能把边栏入口推出报销办结收益
  **进一步探讨**：用有真值的混合票据批次比较人工与插件，逐一核对原件和金额。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 扫描如何从边栏进入邮箱、OCR和模型？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

startScan拒绝并发作业、未安装引擎、无效日期与非QQ/163邮箱，校验绝对输出目录并从凭据服务取授权码。作业异步运行，进度进入宿主会话。InvoiceScanner创建Python IPC客户端，收到字段提取请求时使用当前agentDefaultModel选择prepareCall，并将OCR文本和模型配置写为模型可见消息，收集流式JSON响应。Python DshRecognitionExtractor把识别链接到既有归档接口；链路优先确定性解析，其后本地OCR+宿主模型，GLM视觉为可选降级。当前选择并不硬编码只能DeepSeek，数据边界应依实际provider/model说明。发票图片本地OCR不等于全过程不出设备：OCR文本会送入所选模型，GLM降级还可发送图片。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-invoice-downloader/src/rpc-handler.ts:230-265](https://github.com/EthanYoQ/Invoice-Downloader/blob/8fe3a1147c619268b41f1480e73c4fa38d97db69/plugins/dsh-invoice-downloader/src/rpc-handler.ts#L230-L265)

扫描准入、凭据、输出与作业启动。

<details>
<summary>查看原文（36行）</summary>

```text
async function startScan(context: InvoiceRpcContext, payload: unknown): Promise<RpcResult> {
  if (context.scanner.isRunning) return badRequest('已有扫描正在进行。')
  if (!getRuntimeStatus(context.runtime).installed) return badRequest('请先安装本地引擎。')
  const request = asObject(payload)
  const settings = parseSettings(request, readSettings(context.profileDir))
  if (!settings || !settings.email || !settings.company || !settings.savePath) {
    return badRequest('请填写邮箱、公司名称和保存位置。')
  }
  if (!isValidDateRange(settings.dateFrom, settings.dateTo)) {
    return badRequest('请选择有效且按时间顺序排列的日期范围。')
  }
  const server = imapServer(settings.email)
  if (!server) return badRequest('目前仅支持 QQ 邮箱和 163 邮箱。')
  void server
  const output = context.artifacts.validateSavePath(settings.savePath)
  if (!output.ok) return badRequest(output.errorMessage)
  const authCode = stringValue(request.authCode) || await resolveCredential(context.credentials, IMAP_AUTH_CODE_REF)
  const glmApiKey = stringValue(request.glmApiKey) || await resolveCredential(context.credentials, GLM_API_KEY_REF)
  if (!authCode) return badRequest('请填写并保存 IMAP 授权码。')

  const jobId = `scan-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const session = context.sessions.createSession(jobId)
  context.scanner.setProgressHandler(progress => context.sessions.recordProgress(jobId, progress.event))
  const scanRequest: ScanRequest = {
    jobId,
    email: settings.email,
    authCode,
    dateFrom: settings.dateFrom,
    dateTo: settings.dateTo,
    company: settings.company,
    savePath: output.canonicalPath,
    ocrProvider: settings.ocrProvider,
    ...(settings.ocrProvider === 'glm' && glmApiKey ? { glmApiKey } : {}),
  }

  void context.scanner.startScan(scanRequest, event => context.sessions.logModelVisible(session.sessionId, event))
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-invoice-downloader/src/invoice-scanner.ts:122-148](https://github.com/EthanYoQ/Invoice-Downloader/blob/8fe3a1147c619268b41f1480e73c4fa38d97db69/plugins/dsh-invoice-downloader/src/invoice-scanner.ts#L122-L148)

PythonIPC与模型回调接线。

<details>
<summary>查看原文（27行）</summary>

```text
  async startScan(request: ScanRequest, logModelVisible: (event: ModelVisibleEvent) => Message): Promise<ScanResult> {
    if (this.running) throw new Error('an invoice scan is already running')
    this.running = true
    this.cancelled = false
    this.client = new EngineIpcClient(
      this.subprocess,
      this.config.pythonPath,
      this.config.engineRoot,
      this.config.adapterRoot,
      this.config.graceMs,
    )
    this.client.onEvent(event => this.progressHandler?.({ event: event.event }))
    this.client.onExtraction(request => this.extractWithModel(request, logModelVisible))

    try {
      const result = await this.withDeadline(this.client.startJob({
        jobId: request.jobId,
        email: request.email,
        authCode: request.authCode,
        dateFrom: request.dateFrom,
        dateTo: request.dateTo,
        company: request.company,
        savePath: request.savePath,
        ocrProvider: request.ocrProvider,
        imapFetchTimeoutSeconds: this.config.imapFetchTimeoutSeconds,
        ...(request.glmApiKey ? { glmApiKey: request.glmApiKey } : {}),
      }))
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-invoice-downloader/src/invoice-scanner.ts:164-196](https://github.com/EthanYoQ/Invoice-Downloader/blob/8fe3a1147c619268b41f1480e73c4fa38d97db69/plugins/dsh-invoice-downloader/src/invoice-scanner.ts#L164-L196)

当前模型选择与OCR文本模型消息。

<details>
<summary>查看原文（33行）</summary>

```text
  private async extractWithModel(
    request: ExtractionRequest,
    logModelVisible: (event: ModelVisibleEvent) => Message,
  ): Promise<ExtractionResponse | ExtractionError> {
    const selection = this.llmContext?.agentDefaultModel.currentSelection()
    if (!selection || !this.llmContext) {
      return {
        requestId: request.requestId,
        errorCode: 'MODEL_NOT_CONFIGURED',
        errorMessage: '请选择可用模型后再开始扫描。',
        retryable: false,
      }
    }

    try {
      const prepared = await this.llmContext.llm.prepareCall({
        provider: selection.provider,
        model: selection.model,
        temperature: 0,
        maxTokens: 500,
        ...(selection.reasoningEffort === undefined ? {} : { reasoningEffort: selection.reasoningEffort }),
      })
      const message = logModelVisible({
        inputText: JSON.stringify({
          type: 'invoice.field-extraction',
          requestId: request.requestId,
          instruction: '从 OCR 文本提取发票字段，并仅返回合法 JSON。',
          modelConfig: prepared.config,
          ocrText: request.ocrText,
        }),
      })
      const assembler = new TextResponseAssembler()
      for await (const chunk of prepared.stream({ ...prepared.config, messages: [message] })) assembler.push(chunk)
```

</details>

**依据 4 · 源码核查**：[plugins/dsh-invoice-downloader/engine-adapter/dsh_scan.py:109-143](https://github.com/EthanYoQ/Invoice-Downloader/blob/8fe3a1147c619268b41f1480e73c4fa38d97db69/plugins/dsh-invoice-downloader/engine-adapter/dsh_scan.py#L109-L143)

识别链进入既有提取归档接口。

<details>
<summary>查看原文（35行）</summary>

```text
class DshRecognitionExtractor(InvoiceExtractor):
    """Present DSH's recognition chain through the engine's extraction and archive interface."""

    def __init__(self, recognition_chain: Any, output_dir: str) -> None:
        self._recognition_chain = recognition_chain
        self.output_dir = os.path.abspath(output_dir)
        os.makedirs(self.output_dir, exist_ok=True)
        self.processed_records_file = os.path.join(self.output_dir, "processed_records.json")
        self.glm_runtime = None
        self.last_extraction_trace: dict[str, Any] = {}
        self.last_route_trace: dict[str, Any] = {}
        self.last_timing_trace: dict[str, Any] = {}

    def pdf_to_base64_image(self, pdf_path: str) -> list[str]:
        """Supply a truthy placeholder because the DSH chain reads the source path directly."""
        return [pdf_path] if os.path.isfile(pdf_path) else []

    def extract_remote_only(
        self,
        _prepared_source: Any,
        custom_rules: str = "",
        pdf_path: str | None = None,
        document_context: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        """Run local OCR followed by the DSH DeepSeek extractor for one artifact."""
        del custom_rules
        if not pdf_path:
            raise RuntimeError("document path is required for DSH extraction")
        result = self._recognition_chain.extract(pdf_path, document_context or {})
        self.last_extraction_trace = {
            "engine": "local_ocr_dsh_deepseek",
            "reason_code": "",
        }
        self.last_timing_trace = {}
        return result
```

</details>

**依据 5 · 源码核查**：[plugins/dsh-invoice-downloader/engine-adapter/engine-src/recognition_chain.py:48-77](https://github.com/EthanYoQ/Invoice-Downloader/blob/8fe3a1147c619268b41f1480e73c4fa38d97db69/plugins/dsh-invoice-downloader/engine-adapter/engine-src/recognition_chain.py#L48-L77)

本地OCR与可选GLM降级。

<details>
<summary>查看原文（30行）</summary>

```text
        # Chain 2: Local OCR + DeepSeek
        try:
            logger.info("Trying local OCR + DeepSeek extraction")
            ocr_result = self._local_ocr.probe_local_ocr(pdf_path)
            if ocr_result["status"] == "ok" and ocr_result["text_length"] > 50:
                result = self._extractor.extract_and_adapt(
                    ocr_result["text"],
                    pdf_path=pdf_path,
                    document_context=context,
                )
                logger.info("Local OCR + DeepSeek extraction succeeded")
                return result
            else:
                logger.warning(f"Local OCR probe insufficient: {ocr_result}")
        except Exception as e:
            logger.warning(f"Local OCR + DeepSeek extraction failed: {e}")

        # Chain 3: GLM vision fallback (optional)
        if self._glm:
            try:
                logger.info("Falling back to GLM vision extraction")
                # Use existing GLM dual-track logic
                # This is a simplified call — the full GLM path is preserved in the existing engine
                result = self._glm.extract(pdf_path, document_context=context)
                logger.info("GLM vision extraction succeeded")
                return result
            except Exception as e:
                logger.warning(f"GLM vision extraction failed: {e}")

        raise RuntimeError("all recognition chains failed")
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 完成状态、字段校验和取消能保证账实一致吗？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

不能。宿主提取器将匹配到的大括号JSON解析后交回，失败可返回raw；Python验证器只检查必填键、日期形式和类型枚举，不能证明金额、公司名和票号与原件一致。maxTokens=500只是每次输出上限，不是单票总成本，识别重试与其他模型调用另计。作业超时触发stopJob，扫描catch返回failed；已经保存的原件可能仍在输出目录，需要按作业和原件对账而不是盲目重扫。导出路径注册失败被捕获后作业仍可complete而没有exportArtifactId，所以UI“完成”不能独立证明Excel已可下载。ArtifactRegistry限制导出在授权输出目录，支持文件边界，但其进程内映射不证明重启后下载仍可用。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-invoice-downloader/src/invoice-scanner.ts:178-184](https://github.com/EthanYoQ/Invoice-Downloader/blob/8fe3a1147c619268b41f1480e73c4fa38d97db69/plugins/dsh-invoice-downloader/src/invoice-scanner.ts#L178-L184)

单次输出上限。

```text
    try {
      const prepared = await this.llmContext.llm.prepareCall({
        provider: selection.provider,
        model: selection.model,
        temperature: 0,
        maxTokens: 500,
        ...(selection.reasoningEffort === undefined ? {} : { reasoningEffort: selection.reasoningEffort }),
```

**依据 2 · 源码核查**：[plugins/dsh-invoice-downloader/src/invoice-scanner.ts:229-250](https://github.com/EthanYoQ/Invoice-Downloader/blob/8fe3a1147c619268b41f1480e73c4fa38d97db69/plugins/dsh-invoice-downloader/src/invoice-scanner.ts#L229-L250)

超时停止与宽松JSON解析。

<details>
<summary>查看原文（22行）</summary>

```text
  private async withDeadline(result: Promise<JobResult>): Promise<JobResult> {
    let timer: NodeJS.Timeout | undefined
    try {
      return await new Promise<JobResult>((resolve, reject) => {
        timer = setTimeout(() => {
          this.client?.stopJob()
          reject(new Error('invoice scan deadline exceeded'))
        }, this.config.deadlineMs)
        void result.then(resolve, reject)
      })
    } finally {
      if (timer) clearTimeout(timer)
    }
  }
}

function extractJson(responseText: string): Record<string, unknown> {
  try {
    const match = responseText.match(/\{[\s\S]*\}/)
    return match ? JSON.parse(match[0]) as Record<string, unknown> : { raw: responseText }
  } catch {
    return { raw: responseText }
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-invoice-downloader/engine-adapter/engine-src/deepseek_extractor.py:64-84](https://github.com/EthanYoQ/Invoice-Downloader/blob/8fe3a1147c619268b41f1480e73c4fa38d97db69/plugins/dsh-invoice-downloader/engine-adapter/engine-src/deepseek_extractor.py#L64-L84)

字段验证只覆盖有限语法约束。

<details>
<summary>查看原文（21行）</summary>

```text
def validate_extraction(payload: dict) -> list[str]:
    """Validate extraction output against schema. Returns list of errors (empty if valid)."""
    errors = []
    if not isinstance(payload, dict):
        return ["payload is not a dict"]

    for field_name in EXTRACTION_SCHEMA["required"]:
        if field_name not in payload:
            errors.append(f"missing required field: {field_name}")

    if "Date" in payload and payload["Date"]:
        import re
        if not re.match(r"^\d{4}-\d{2}-\d{2}$", payload["Date"]):
            errors.append(f"Date format invalid: {payload['Date']}")

    if "Type" in payload and payload["Type"]:
        valid_types = EXTRACTION_SCHEMA["properties"]["Type"]["enum"]
        if payload["Type"] not in valid_types:
            errors.append(f"Type not in enum: {payload['Type']}")

    return errors
```

</details>

**依据 4 · 源码核查**：[plugins/dsh-invoice-downloader/src/rpc-handler.ts:265-289](https://github.com/EthanYoQ/Invoice-Downloader/blob/8fe3a1147c619268b41f1480e73c4fa38d97db69/plugins/dsh-invoice-downloader/src/rpc-handler.ts#L265-L289)

导出注册失败仍可记录完成。

<details>
<summary>查看原文（25行）</summary>

```text
  void context.scanner.startScan(scanRequest, event => context.sessions.logModelVisible(session.sessionId, event))
    .then(result => {
      if (result.status === 'cancelled') {
        context.sessions.cancel(jobId)
        return
      }
      if (result.status !== 'completed') {
        context.sessions.fail(jobId)
        return
      }
      let exportArtifactId: string | undefined
      if (result.exportPath) {
        try {
          exportArtifactId = context.artifacts.registerArtifact(jobId, result.exportPath, output.canonicalPath).artifactId
        } catch {
          exportArtifactId = undefined
        }
      }
      context.sessions.complete(jobId, {
        invoicesProcessed: result.invoicesProcessed,
        successCount: result.successCount,
        retainedCount: result.retainedCount,
        manualReviewCount: result.manualReviewCount,
        ...(exportArtifactId ? { exportArtifactId } : {}),
      })
```

</details>

**依据 5 · 源码核查**：[plugins/dsh-invoice-downloader/src/file-security.ts:19-54](https://github.com/EthanYoQ/Invoice-Downloader/blob/8fe3a1147c619268b41f1480e73c4fa38d97db69/plugins/dsh-invoice-downloader/src/file-security.ts#L19-L54)

输出根限制与内存artifact映射。

<details>
<summary>查看原文（36行）</summary>

```text
export class ArtifactRegistry {
  private readonly artifacts = new Map<string, StoredArtifact>()

  validateSavePath(inputPath: string): { ok: true; canonicalPath: string } | { ok: false; errorMessage: string } {
    const trimmed = inputPath.trim()
    if (!trimmed) return { ok: false, errorMessage: '请选择或输入绝对保存路径。' }
    if (!path.isAbsolute(trimmed)) return { ok: false, errorMessage: '保存路径必须是绝对路径。' }
    try {
      fs.mkdirSync(trimmed, { recursive: true })
      const stat = fs.statSync(trimmed)
      if (!stat.isDirectory()) return { ok: false, errorMessage: '保存路径不是目录。' }
      return { ok: true, canonicalPath: fs.realpathSync(trimmed) }
    } catch {
      return { ok: false, errorMessage: '无法创建或访问保存路径。' }
    }
  }

  registerArtifact(jobId: string, filePath: string, outputRoot: string): ArtifactRef {
    const canonicalRoot = fs.realpathSync(outputRoot)
    const absolutePath = fs.realpathSync(filePath)
    if (!isWithinRoot(canonicalRoot, absolutePath)) {
      throw new Error('engine reported an artifact outside the authorized output directory')
    }
    const content = fs.readFileSync(absolutePath)
    const ref: StoredArtifact = {
      artifactId: `artifact-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
      jobId,
      fileName: path.basename(absolutePath),
      category: 'excel-export',
      sha256: crypto.createHash('sha256').update(content).digest('hex'),
      size: content.length,
      absolutePath,
      outputRoot: canonicalRoot,
    }
    this.artifacts.set(ref.artifactId, ref)
    return withoutPath(ref)
```

</details>

#### 缺口

- 没有当前宿主下取消/部分完成、重启导出和票据字段真值验收
  **影响**：不能把完成计数当合格报销资料数
  **进一步探讨**：在测试邮箱用错误字段、OCR失败、导出路径失败和中途取消案例逐项对账。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 何时值得采用，怎样检验少做模型调用是否仍可靠？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

启动需DSH对应服务、本地Python引擎及OCR/Chromium依赖、QQ/163 IMAP授权和所选模型；GLM key仅降级时可选。首次引擎安装要联网，持续成本包括模型提取、下载和人工复核，失败成本包括重试、残留文件和重复扫描对账，现金与分钟数未知。已有DSH且重复批次足够者可先用测试邮箱和授权副本试用，验收每张原件、关键字段和Excel行，并比较总人工分钟；任一关键字段静默错误、原件缺失或完成无可用导出时停止扩展，退到原件与人工表格。未验证假设是按确定性字段和人工复核触发模型提取/降级，而非一律扩大视觉调用，可保留质量并减少资源。固定真值批次比较当前链与明确字段门控链，计错字段、漏票、人工修正、重试及模型费用；若门控增加静默错误或总工时不降则推翻。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-invoice-downloader/src/activate.ts:43-61](https://github.com/EthanYoQ/Invoice-Downloader/blob/8fe3a1147c619268b41f1480e73c4fa38d97db69/plugins/dsh-invoice-downloader/src/activate.ts#L43-L61)

运行路径、超时与模型上下文依赖。

<details>
<summary>查看原文（19行）</summary>

```text
export function apply(context: PluginContext, config: PluginConfig): void {
  const runtime = resolveRuntimeLayout(config)
  const profileDir = config.profileDir?.trim()
    || path.join(process.env.DSH_HOME || path.join(os.homedir(), '.dsh'), 'invoice-downloader')
  const savePath = config.savePath?.trim() || ''
  fs.mkdirSync(profileDir, { recursive: true })
  fs.mkdirSync(runtime.runtimeRoot, { recursive: true })

  const scanner = new InvoiceScanner(context.subprocess, {
    pythonPath: runtime.pythonPath,
    engineRoot: runtime.engineRoot,
    adapterRoot: runtime.adapterRoot,
    deadlineMs: config.deadlineMs ?? 600_000,
    graceMs: config.graceMs ?? 2_000,
    imapFetchTimeoutSeconds: config.imapFetchTimeoutSeconds ?? 15,
  })
  scanner.setLlmContext({
    llm: context.llm,
    agentDefaultModel: context.agentDefaultModel,
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-invoice-downloader/src/rpc-handler.ts:241-262](https://github.com/EthanYoQ/Invoice-Downloader/blob/8fe3a1147c619268b41f1480e73c4fa38d97db69/plugins/dsh-invoice-downloader/src/rpc-handler.ts#L241-L262)

支持邮箱和可选GLM。

<details>
<summary>查看原文（22行）</summary>

```text
  const server = imapServer(settings.email)
  if (!server) return badRequest('目前仅支持 QQ 邮箱和 163 邮箱。')
  void server
  const output = context.artifacts.validateSavePath(settings.savePath)
  if (!output.ok) return badRequest(output.errorMessage)
  const authCode = stringValue(request.authCode) || await resolveCredential(context.credentials, IMAP_AUTH_CODE_REF)
  const glmApiKey = stringValue(request.glmApiKey) || await resolveCredential(context.credentials, GLM_API_KEY_REF)
  if (!authCode) return badRequest('请填写并保存 IMAP 授权码。')

  const jobId = `scan-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const session = context.sessions.createSession(jobId)
  context.scanner.setProgressHandler(progress => context.sessions.recordProgress(jobId, progress.event))
  const scanRequest: ScanRequest = {
    jobId,
    email: settings.email,
    authCode,
    dateFrom: settings.dateFrom,
    dateTo: settings.dateTo,
    company: settings.company,
    savePath: output.canonicalPath,
    ocrProvider: settings.ocrProvider,
    ...(settings.ocrProvider === 'glm' && glmApiKey ? { glmApiKey } : {}),
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-invoice-downloader/engine-adapter/engine-src/recognition_chain.py:44-77](https://github.com/EthanYoQ/Invoice-Downloader/blob/8fe3a1147c619268b41f1480e73c4fa38d97db69/plugins/dsh-invoice-downloader/engine-adapter/engine-src/recognition_chain.py#L44-L77)

确定性优先和降级基础。

<details>
<summary>查看原文（34行）</summary>

```text
        # Chain 1: Deterministic parser (existing, not modified)
        # This is handled by the existing engine code before calling this chain.
        # If we reach here, deterministic parsing already failed.

        # Chain 2: Local OCR + DeepSeek
        try:
            logger.info("Trying local OCR + DeepSeek extraction")
            ocr_result = self._local_ocr.probe_local_ocr(pdf_path)
            if ocr_result["status"] == "ok" and ocr_result["text_length"] > 50:
                result = self._extractor.extract_and_adapt(
                    ocr_result["text"],
                    pdf_path=pdf_path,
                    document_context=context,
                )
                logger.info("Local OCR + DeepSeek extraction succeeded")
                return result
            else:
                logger.warning(f"Local OCR probe insufficient: {ocr_result}")
        except Exception as e:
            logger.warning(f"Local OCR + DeepSeek extraction failed: {e}")

        # Chain 3: GLM vision fallback (optional)
        if self._glm:
            try:
                logger.info("Falling back to GLM vision extraction")
                # Use existing GLM dual-track logic
                # This is a simplified call — the full GLM path is preserved in the existing engine
                result = self._glm.extract(pdf_path, document_context=context)
                logger.info("GLM vision extraction succeeded")
                return result
            except Exception as e:
                logger.warning(f"GLM vision extraction failed: {e}")

        raise RuntimeError("all recognition chains failed")
```

</details>

#### 缺口

- 缺少真实混合票据真值及全周期计量
  **影响**：不能宣称节省工时或满足所有报销要求
  **进一步探讨**：以人工确认的票据原件为真值建立小批次对照，记录全部失败及修正。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
