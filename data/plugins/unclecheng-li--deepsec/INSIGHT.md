# DeepSec

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[fff031f](https://github.com/Unclecheng-li/DeepSec/tree/fff031fc01fb36b95348214c8ee359f6ede8aa8b)

<!-- BEGIN META -->
[![GitHub ★ 498](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=498&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Unclecheng-li/DeepSec)
<!-- END META -->

> **功能**：结合 Shield 代码审计、Spear 授权测试、CLI/TUI 与 IDE 接入的安全工具平台

> **亮点**：[Q02](#research-q02) 把规则、Python AST、本地启发式和可选LLM组织成可输出统一finding的流程，实际贡献是分层审阅接线。

> **主要限制**：[Q03](#research-q03) 文件读取失败被跳过而filesScanned仍计候选，零发现不代表完整扫描；默认排除和远端选项还会改变覆盖及数据流。

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
  - [Q01 · 根平台给谁交付什么，和DSH插件是什么关系？](#detail-section-11)
  - [Q02 · CLI怎样生成实际扫描结果？](#detail-section-12)
  - [Q03 · 零发现和filesScanned是不是完整扫描证明？](#detail-section-13)
  - [Q04 · 怎样有试用并检验覆盖回执的价值？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向开发者的代码安全工具平台；本轮核查Shield本地审计主线，输出待人工复核的候选问题。

独立静态规则扫描加人工安全审阅；集成入口与finding组织不等于新增漏洞发现原理。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Shield扫描 | 产生代码审阅线索 | 覆盖与finding必须人工复核 |
| 可选远端L3 | 模型语义补充 | 外发源码且不等于漏洞已确认 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Python与项目依赖 | Shield必需 | 运行CLI规则 | 先修环境，不判零漏洞 |
| 可读源码与范围配置 | 必需 | 成功分析目标文件 | 记录跳过，人工复核 |
| 模型账户/网络/源码外发条件 | 远端L3必需 | 语义增强 | 保留本地规则 |
| 安全复核人员 | 采用必需 | 确认finding与漏洞 | 不作自动放行 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 开发者准备自有代码副本并确认层/范围 | 明确哪些会分析和外发 |
| 2 | 用户运行本地Shield并审阅finding | 核位置、证据和误报 |
| 3 | 用户核对跳过/失败并回人工审阅 | 不以零发现直接放行 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | Python与依赖磁盘 | 配置范围与规则 | 部署时长未知 |
| 持续 | 可选LLM费用和扫描资源 | 复核误报/漏报 | 单合格审阅成本未知 |
| 失败恢复 | 重扫与日志 | 确认不可读/语法失败文件 | 覆盖损失未量化 |
| 退出 | 保留报告 | 回原扫描器和人工流程 | 报告不是修复证明 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 统一候选finding | 分层扫描与去重输出 | 相对基线检出/误报率 |
| 覆盖可解释性 | 源码显示候选计数与跳过路径 | 真实使用是否误判放行 |

> **思考**：[Q03](#research-q03) 文件读取失败被跳过而filesScanned仍计候选，零发现不代表完整扫描；默认排除和远端选项还会改变覆盖及数据流。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 把规则、Python AST、本地启发式和可选LLM组织成可输出统一finding的流程，实际贡献是分层审阅接线。

[Q02](#research-q02) 统一finding与分层开关便于接入；[Q03](#research-q03)覆盖计数和实际分析脱节，应以回执补充而不堆检测功能。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 文件读取失败被跳过而filesScanned仍计候选，零发现不代表完整扫描；默认排除和远端选项还会改变覆盖及数据流。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 仅在自有副本试用本地Shield并人工确认finding；不可读文件或覆盖不明时停止依赖零发现结论，回原扫描和人工审阅。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

扫描调用与覆盖计数限制有源码支持；检测准确性、全平台安全与改进效果未运行验证。

- 已检查：作者 README、包清单、源码路径 README.md、deepsec/cli/app.py、deepsec/shield/scanner.py、deepsec/shield/rules/sast.py、deepsec/shield/rules/ai_audit.py、deepsec/spear/headless.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查根定位、Python Shield CLI/scanner/L2/L3与一处Spear范围降级；未全面审计TS扩展、Spear执行器、网络测试或DSH子插件。
- 下一步：用可读/不可读/语法损坏/排除文件的同真值样本比较旧报告与明确覆盖回执，测覆盖判断、误放行和人工复核成本。

**分析版本**

- **仓库**：[Unclecheng-li/DeepSec](https://github.com/Unclecheng-li/DeepSec)
- **版本号**：0.2.0（[固定提交 fff031f](https://github.com/Unclecheng-li/DeepSec/tree/fff031fc01fb36b95348214c8ee359f6ede8aa8b)）
- **版本日期**：2026-08-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 推导候选/已分析/跳过/失败覆盖回执的未验证改进；以混合失败样本测覆盖判断和误放行，不能降低误判则推翻。

用可读/不可读/语法损坏/排除文件的同真值样本比较旧报告与明确覆盖回执，测覆盖判断、误放行和人工复核成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 287 | 63605 | — | — | 515691 |
| .ts | source | 54 | 22768 | 20925 | 181 | — |
| .js | source | 8 | 1013 | 880 | 42 | — |
| .mjs | test | 1 | 133 | 104 | 18 | — |
| .cjs | source | 1 | 118 | 106 | 1 | — |
| .ts | test | 41 | 9649 | 8822 | 76 | — |

</details>

**活跃度**

[![Issue 未关闭 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=7&color=737b86&logo=github)](https://github.com/Unclecheng-li/DeepSec/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/Unclecheng-li/DeepSec/issues?q=is%3Aissue+created%3A2026-09-28T03%3A54%3A21.981Z..2026-10-28T03%3A54%3A21.981Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Unclecheng-li/DeepSec/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-28T03%3A54%3A21.981Z..2026-10-28T03%3A54%3A21.981Z)



统计日期：2026-10-28。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：扫描覆盖回执是否足以支持发现结果，怎样避免零发现被误读为安全？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根平台给谁交付什么，和DSH插件是什么关系？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根仓库是安全工具平台，真实类型tool，另含DSH子插件而非根自身就是DSH服务。面向复核AI生成代码的开发者和授权测试人员，交付带位置/规则/证据的候选finding。README将Shield、Spear、TUI、MCP及IDE组织在一起；本轮重点研究可完整追踪的Shield静态扫描主线，未把Spear攻击成功或全平台安全当已验证。基线是独立规则扫描加人工安全审阅，增量是分层结果与多入口组织。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:55-93](https://github.com/Unclecheng-li/DeepSec/blob/fff031fc01fb36b95348214c8ee359f6ede8aa8b/README.md#L55-L93)

作者说明平台及三层审计

<details>
<summary>查看原文（39行）</summary>

````text
## DeepSec 是什么？

DeepSec 是由 VibeGuard 进化而来的 AI 安全平台，将 **Shield**（AI 代码安全审计）与 **Spear**（授权渗透测试引擎）统一到一套 CLI、一个 TUI 终端工作台和一组 IDE 插件中。

```
┌──────────────────────────────────────────────────────────┐
│                      DeepSec Platform                     │
│                                                          │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│   │ Shield   │  │  Spear   │  │   TUI    │  │   MCP   │ │
│   │ Code     │  │ Pentest  │  │ Terminal │  │ Server  │ │
│   │ Audit    │  │ Engine   │  │ Workbench│  │         │ │
│   └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬────┘ │
│        │             │             │              │       │
│        └─────────────┴─────────────┴──────────────┘       │
│                          │                               │
│              ┌───────────┴───────────┐                   │
│              │   Unified Config      │                   │
│              │   ~/.deepsec/         │                   │
│              │   config.yaml         │                   │
│              └───────────────────────┘                   │
└──────────────────────────────────────────────────────────┘
         │                              │
   ┌─────┴─────┐                  ┌─────┴──────┐
   │  VSCode   │                  │  JetBrains │
   │  Plugin   │                  │   Plugin   │
   │  (TS/LSP) │                  │  (Kotlin)  │
   └───────────┘                  └────────────┘
```

### Shield — 代码安全审计

从实时正则到 LLM 语义分析的三层检测架构：

| 层 | 检测内容 | 速度 | 原理 |
|-------|---------|-------|--------|
| **L1** | 幻觉包、硬编码密钥、不安全配置、AI 错误模式 | < 50ms | 正则 + 熵分析 + 种子目录 |
| **L2** | SQL 注入、XSS、SSRF、路径穿越、命令注入 | < 2s | Tree-sitter WASM AST 分析 |
| **L3** | 缺失认证/限流/校验等语义漏洞 | < 5s | LLM（DeepSeek/Claude/OpenAI/Ollama）+ 本地启发式兜底 |
````

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · CLI怎样生成实际扫描结果？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

shield scan把层选项、remote_l3、测试目录与忽略规则变成ScanOptions，再scan_path逐文件调用scan_text，汇总去重结果并输出；有未dismiss的high/critical时返回退出码2。L1运行patterns，L2调用scan_sast，L3本地启发式audit_semantics，可选远端LLM。当前Python L2同时跑Python AST及正则，其它路径的这一入口也运行正则；不能将README的Tree-sitter架构文字泛化为本Python调用链已全语言AST验证。远端LLM输出转换为finding仍需人工验证可利用性。

#### 证据与依据

**依据 1 · 源码核查**：[deepsec/cli/app.py:54-89](https://github.com/Unclecheng-li/DeepSec/blob/fff031fc01fb36b95348214c8ee359f6ede8aa8b/deepsec/cli/app.py#L54-L89)

CLI选项、结果和退出码

<details>
<summary>查看原文（36行）</summary>

```text
@shield_app.command("scan")
def shield_scan(
    path: Annotated[Path, typer.Argument(help="Source file or directory")],
    layer: Annotated[str, typer.Option(help="all, l1, l2, or l3")] = "all",
    format_name: Annotated[str, typer.Option("--format", help="text, json, sarif, markdown, or html")] = "text",
    output: Annotated[Path | None, typer.Option("--output", "-o")] = None,
    remote_l3: Annotated[bool, typer.Option(help="Send source to the configured LLM for opt-in L3 review")] = False,
    ignore_file: Annotated[Path | None, typer.Option("--ignore-file", help="YAML ignore rule file")] = None,
    include_tests: Annotated[bool, typer.Option("--include-tests", help="Also scan test, fixture, and example directories")] = False,
    stream: Annotated[bool, typer.Option("--stream", help="Emit newline-delimited JSON events for the DeepSec TUI")]=False,
) -> None:
    selected = _layers(layer)
    config = load_config()
    use_remote_l3 = remote_l3 or _explicit_l3_with_configured_provider(layer, selected, config)
    options = ScanOptions(
        l1="L1" in selected,
        l2="L2" in selected,
        l3="L3" in selected,
        remote_l3=use_remote_l3,
        dedup=config.shield.dedup,
        include_tests=include_tests,
        ignore_rules=load_ignore_rules(ignore_file),
    )
    if stream:
        typer.echo(json.dumps({"type": "status", "status": "started"}, separators=(",", ":")))

        def emit_finding(finding: DeepSecFinding) -> None:
            typer.echo(json.dumps({"type": "finding", "finding": finding.to_dict()}, separators=(",", ":")))

        result = scan_path(path, options, config, on_finding=emit_finding)
        typer.echo(json.dumps({"type": "complete", "result": result.to_dict()}, separators=(",", ":")))
    else:
        result = scan_path(path, options, config)
        _emit_result(result, format_name, output)
    if any(item.severity.value in {"critical", "high"} and not item.dismissed for item in result.findings):
        raise typer.Exit(2)
```

</details>

**依据 2 · 源码核查**：[deepsec/shield/scanner.py:68-93](https://github.com/Unclecheng-li/DeepSec/blob/fff031fc01fb36b95348214c8ee359f6ede8aa8b/deepsec/shield/scanner.py#L68-L93)

分层调用与去重

<details>
<summary>查看原文（26行）</summary>

```text
def scan_text(text: str, target: str, language: str | None = None, options: ScanOptions | None = None, config: DeepSecConfig | None = None) -> ScanResult:
    options = options or ScanOptions()
    started = perf_counter()
    findings: list[DeepSecFinding] = []
    layers: list[str] = []
    if options.l1:
        findings.extend(scan_patterns(text, target, language))
        layers.append("L1")
    if options.l2:
        findings.extend(scan_sast(text, target, language))
        layers.append("L2")
    if options.l3:
        findings.extend(audit_semantics(text, target, language))
        layers.append("L3")
        if options.remote_l3:
            active_config = config or load_config()
            findings.extend(asyncio.run(audit_with_llm(text, target, DeepSecLLM(active_config).shield_review)))
    if options.agent_audit:
        findings.extend(scan_prompt_injection(text, target))
        findings.extend(scan_tool_abuse(text, target))
        findings.extend(scan_data_exfiltration(text, target))
        layers.append("Agent")
    if options.dedup:
        findings = unique_findings(findings)
    findings = apply_ignore_rules(findings, options.ignore_rules)
    return ScanResult(findings=findings, elapsed_ms=(perf_counter() - started) * 1000, files_scanned=1, layers=tuple(layers))
```

</details>

**依据 3 · 源码核查**：[deepsec/shield/scanner.py:96-120](https://github.com/Unclecheng-li/DeepSec/blob/fff031fc01fb36b95348214c8ee359f6ede8aa8b/deepsec/shield/scanner.py#L96-L120)

逐文件执行及汇总

<details>
<summary>查看原文（25行）</summary>

```text
def scan_path(
    path: Path,
    options: ScanOptions | None = None,
    config: DeepSecConfig | None = None,
    on_finding: Callable[[DeepSecFinding], None] | None = None,
) -> ScanResult:
    options = options or ScanOptions()
    started = perf_counter()
    files = _source_files(path, options.include_tests)
    all_findings: list[DeepSecFinding] = []
    layers: set[str] = set()
    for source in files:
        try:
            text = source.read_text(encoding="utf-8", errors="replace")
        except OSError:
            continue
        result = scan_text(text, str(source), SUPPORTED_SUFFIXES.get(source.suffix.lower()), options, config)
        for finding in result.findings:
            if on_finding is not None:
                on_finding(finding)
            all_findings.append(finding)
        layers.update(result.layers)
    if options.dedup:
        all_findings = unique_findings(all_findings)
    return ScanResult(findings=all_findings, elapsed_ms=(perf_counter() - started) * 1000, files_scanned=len(files), layers=tuple(sorted(layers)))
```

</details>

**依据 4 · 源码核查**：[deepsec/shield/rules/sast.py:61-88](https://github.com/Unclecheng-li/DeepSec/blob/fff031fc01fb36b95348214c8ee359f6ede8aa8b/deepsec/shield/rules/sast.py#L61-L88)

PythonAST+正则及语法失败分支

<details>
<summary>查看原文（28行）</summary>

```text
def scan_sast(text: str, target: str, language: str | None = None) -> list[DeepSecFinding]:
    findings: list[DeepSecFinding] = []
    if (language or "").lower() in {"python", "py"}:
        findings.extend(_python_ast_findings(text, target))
    findings.extend(_regex_findings(text, target))
    return _deduplicate(findings)


def _regex_findings(text: str, target: str) -> list[DeepSecFinding]:
    findings: list[DeepSecFinding] = []
    for rule in RULES:
        for match in re.finditer(rule.pattern, text, rule.flags):
            findings.append(_finding(rule, text, target, match.start(), match.end(), match.group(0)))
    return findings


def _python_ast_findings(text: str, target: str) -> list[DeepSecFinding]:
    try:
        tree = ast.parse(text)
    except SyntaxError:
        return []
    findings: list[DeepSecFinding] = []
    for scope_node, tainted in _scopes(tree):
        for node in ast.walk(scope_node):
            if not isinstance(node, ast.Call) or _encloses_nested_scope(scope_node, node):
                continue
            findings.extend(_call_findings(node, tainted, text, target))
    return findings
```

</details>

**依据 5 · 源码核查**：[deepsec/shield/rules/ai_audit.py:11-23](https://github.com/Unclecheng-li/DeepSec/blob/fff031fc01fb36b95348214c8ee359f6ede8aa8b/deepsec/shield/rules/ai_audit.py#L11-L23)

本地L3是端点启发式

<details>
<summary>查看原文（13行）</summary>

```text
def audit_semantics(text: str, target: str, language: str | None = None) -> list[DeepSecFinding]:
    findings: list[DeepSecFinding] = []
    for method, path, start, snippet in _endpoints(text, language):
        lower = snippet.lower()
        if _sensitive(path) and not _has_auth(lower):
            findings.append(_finding(target, text, start, FindingType.MISSING_SECURITY_MEASURE, Severity.HIGH, "l3_missing_authentication", f"Endpoint {method.upper()} {path} appears to access sensitive functionality without obvious authentication.", "Add authentication and authorization before exposing this endpoint."))
        if _needs_rate_limit(method, path) and not _has_rate_limit(lower):
            findings.append(_finding(target, text, start, FindingType.MISSING_SECURITY_MEASURE, Severity.MEDIUM, "l3_missing_rate_limiting", f"Endpoint {method.upper()} {path} looks abuse-prone and has no obvious rate limiting.", "Add a rate limiter appropriate for the endpoint and identity."))
        if _uses_input(lower) and not _has_validation(lower):
            findings.append(_finding(target, text, start, FindingType.MISSING_SECURITY_MEASURE, Severity.MEDIUM, "l3_missing_input_validation", f"Endpoint {method.upper()} {path} uses request input without obvious validation.", "Validate request fields with an explicit schema before use."))
        if _uses_input(lower) and _performs_io(lower) and not _has_error_handling(lower):
            findings.append(_finding(target, text, start, FindingType.MISSING_SECURITY_MEASURE, Severity.LOW, "l3_missing_error_handling", f"Endpoint {method.upper()} {path} performs IO without obvious error handling.", "Handle failures and return a safe client error response."))
    return findings
```

</details>

**依据 6 · 源码核查**：[deepsec/shield/rules/ai_audit.py:42-50](https://github.com/Unclecheng-li/DeepSec/blob/fff031fc01fb36b95348214c8ee359f6ede8aa8b/deepsec/shield/rules/ai_audit.py#L42-L50)

远端输出转换finding

```text
async def audit_with_llm(text: str, target: str, review: Callable[[str, str], Awaitable[tuple[dict, object]]]) -> list[DeepSecFinding]:
    response, _usage = await review(text, target)
    result: list[DeepSecFinding] = []
    for raw in response.get("findings", []):
        if not isinstance(raw, dict):
            continue
        severity_text = str(raw.get("severity", "medium")).strip().lower()
        severity = Severity(severity_text) if severity_text in Severity._value2member_map_ else Severity.MEDIUM
        result.append(DeepSecFinding.create(mode=DeepSecMode.SHIELD, type=FindingType.MISSING_SECURITY_MEASURE, severity=severity, target=target, description=str(raw.get("description") or raw.get("title") or "AI security concern"), title=str(raw.get("title") or "AI security concern"), rule="l3_llm_semantic_review", layer="L3", evidence=str(raw.get("evidence") or ""), suggestion=str(raw.get("suggestion") or ""), line=_coerce_line(raw.get("line")), confidence=_coerce_confidence(raw.get("confidence", 0.6))))
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 零发现和filesScanned是不是完整扫描证明？

**研究主题**：缺陷与关键质疑

#### 完整回答

scan_path先取得候选files，再读取；OSError直接continue，但files_scanned最终仍取len(files)。因此该数量是候选文件数，不能据它证明每个文件都成功分析，零发现尤其不能作为安全放行。默认排除测试、示例、vendor和生成物，是降噪取舍但会收窄覆盖。ScanOptions本体默认l3/remote_l3关闭；CLI会重建选项，明确选择L3并具备provider配置时可能开启LLM路径，是否离机取决于本地或外部provider，因此不能只看结构默认就判断实际数据外发。Spear auto在该headless函数明确降为full，也不能把auto名称当差异范围已生效。

#### 证据与依据

**依据 1 · 源码核查**：[deepsec/shield/scanner.py:23-54](https://github.com/Unclecheng-li/DeepSec/blob/fff031fc01fb36b95348214c8ee359f6ede8aa8b/deepsec/shield/scanner.py#L23-L54)

默认过滤和选项

<details>
<summary>查看原文（32行）</summary>

```text
SUPPORTED_SUFFIXES = {".py": "python", ".js": "javascript", ".mjs": "javascript", ".cjs": "javascript", ".ts": "typescript", ".tsx": "tsx", ".jsx": "jsx", ".java": "java", ".go": "go", ".rb": "ruby", ".php": "php", ".cs": "csharp", ".rs": "rust", ".yaml": "yaml", ".yml": "yaml", ".json": "json"}

# Code you did not write and cannot fix. Always skipped: a finding here is noise
# no matter how the scan is configured.
IGNORED_DIRECTORIES = {".git", ".deepsec", "node_modules", "bower_components", "dist", "out", "build", "coverage", ".venv", "venv", ".venv64", "__pycache__", "vendor", "third_party", "site-packages", ".next", ".nuxt", ".svelte-kit", "Pods", ".tox", ".mypy_cache", ".pytest_cache", ".gradle"}

# Code you did write, but where a hardcoded credential or an eval() is the point.
# Skipped by default, restored with ScanOptions(include_tests=True).
TEST_DIRECTORIES = {"test", "tests", "__tests__", "spec", "specs", "fixtures", "fixture", "testdata", "test_data", "examples", "example", "demo", "demos", "mocks", "__mocks__", "testvectors", "wycheproof", "benchmarks"}

# Build products and lockfiles: generated, minified, or vendored blobs where line
# numbers point at nothing a human can act on.
GENERATED_SUFFIXES = (".min.js", ".min.css", ".bundle.js", ".bundle.css", "-lock.json", ".lock.json", ".map", ".pb.go", "_pb2.py", ".g.dart", ".generated.ts")
TEST_FILE_MARKERS = (".test.", ".spec.", "_test.", "_spec.")

# Shield's own output. Reports embed the evidence strings they describe, so
# scanning a directory twice made the first run's report look like vulnerable
# source and produced findings at line numbers past the end of the real file.
REPORT_FILENAMES = {"deepsec-report.json", "deepsec-report.sarif", "deepsec.sarif", "deepsec-findings.json"}



@dataclass(slots=True)
class ScanOptions:
    l1: bool = True
    l2: bool = True
    l3: bool = False
    remote_l3: bool = False
    agent_audit: bool = False
    dedup: bool = True
    include_tests: bool = False
    ignore_rules: IgnoreRules = field(default_factory=IgnoreRules)
```

</details>

**依据 2 · 源码核查**：[deepsec/shield/scanner.py:104-120](https://github.com/Unclecheng-li/DeepSec/blob/fff031fc01fb36b95348214c8ee359f6ede8aa8b/deepsec/shield/scanner.py#L104-L120)

读取失败跳过但计候选数量

<details>
<summary>查看原文（17行）</summary>

```text
    files = _source_files(path, options.include_tests)
    all_findings: list[DeepSecFinding] = []
    layers: set[str] = set()
    for source in files:
        try:
            text = source.read_text(encoding="utf-8", errors="replace")
        except OSError:
            continue
        result = scan_text(text, str(source), SUPPORTED_SUFFIXES.get(source.suffix.lower()), options, config)
        for finding in result.findings:
            if on_finding is not None:
                on_finding(finding)
            all_findings.append(finding)
        layers.update(result.layers)
    if options.dedup:
        all_findings = unique_findings(all_findings)
    return ScanResult(findings=all_findings, elapsed_ms=(perf_counter() - started) * 1000, files_scanned=len(files), layers=tuple(sorted(layers)))
```

</details>

**依据 3 · 源码核查**：[deepsec/shield/scanner.py:132-147](https://github.com/Unclecheng-li/DeepSec/blob/fff031fc01fb36b95348214c8ee359f6ede8aa8b/deepsec/shield/scanner.py#L132-L147)

文件和测试过滤

<details>
<summary>查看原文（16行）</summary>

```text
def _is_scannable(candidate: Path, relative: Path, include_tests: bool) -> bool:
    if candidate.suffix.lower() not in SUPPORTED_SUFFIXES:
        return False
    name = candidate.name
    if name in REPORT_FILENAMES or name.lower().endswith(GENERATED_SUFFIXES):
        return False
    directories = relative.parts[:-1]
    # Virtualenvs are named .venv, .venv64, .venv311, venv, env... match by shape
    # rather than trying to enumerate every convention.
    if any(part in IGNORED_DIRECTORIES or part.startswith((".venv", "venv-", "venv3")) for part in directories):
        return False
    if include_tests:
        return True
    if any(part.lower() in TEST_DIRECTORIES for part in directories):
        return False
    return not any(marker in name.lower() for marker in TEST_FILE_MARKERS)
```

</details>

**依据 4 · 源码核查**：[deepsec/cli/app.py:60-75](https://github.com/Unclecheng-li/DeepSec/blob/fff031fc01fb36b95348214c8ee359f6ede8aa8b/deepsec/cli/app.py#L60-L75)

CLI远端条件

<details>
<summary>查看原文（16行）</summary>

```text
    remote_l3: Annotated[bool, typer.Option(help="Send source to the configured LLM for opt-in L3 review")] = False,
    ignore_file: Annotated[Path | None, typer.Option("--ignore-file", help="YAML ignore rule file")] = None,
    include_tests: Annotated[bool, typer.Option("--include-tests", help="Also scan test, fixture, and example directories")] = False,
    stream: Annotated[bool, typer.Option("--stream", help="Emit newline-delimited JSON events for the DeepSec TUI")]=False,
) -> None:
    selected = _layers(layer)
    config = load_config()
    use_remote_l3 = remote_l3 or _explicit_l3_with_configured_provider(layer, selected, config)
    options = ScanOptions(
        l1="L1" in selected,
        l2="L2" in selected,
        l3="L3" in selected,
        remote_l3=use_remote_l3,
        dedup=config.shield.dedup,
        include_tests=include_tests,
        ignore_rules=load_ignore_rules(ignore_file),
```

</details>

**依据 5 · 源码核查**：[deepsec/spear/headless.py:249-257](https://github.com/Unclecheng-li/DeepSec/blob/fff031fc01fb36b95348214c8ee359f6ede8aa8b/deepsec/spear/headless.py#L249-L257)

auto的实际scope降级

```text
def effective_scope_mode(scope_mode: str) -> str:
    """The scope actually applied to the scan.

    ``auto`` diff-scoping is owned by the Target diff-scope model (#35); until
    that lands the scan runs full-surface, so ``auto`` degrades to ``full`` here.
    Recording the effective value keeps the run summary honest rather than
    reporting a diff-scoped run that did not happen.
    """
    return "full" if scope_mode == "auto" else scope_mode
```

**依据 6 · 源码核查**：[deepsec/cli/app.py:416-428](https://github.com/Unclecheng-li/DeepSec/blob/fff031fc01fb36b95348214c8ee359f6ede8aa8b/deepsec/cli/app.py#L416-L428)

all不隐式启用LLM；明确L3且local provider或凭据存在会进入该路径，remote_l3变量本身不等于离机。

<details>
<summary>查看原文（13行）</summary>

```text
def _explicit_l3_with_configured_provider(layer: str, selected: set[str], config: object) -> bool:
    """`--layer l3` is an explicit opt-in; `all` keeps source local by default."""
    if layer.strip().lower() == "all" or "L3" not in selected:
        return False
    llm = config.llm
    if llm.provider.lower() == "local":
        return True
    if llm.api_key or os.environ.get("DEEPSEC_LLM_API_KEY"):
        return True
    return any(
        provider.api_key or os.environ.get(f"DEEPSEC_{name.upper()}_API_KEY")
        for name, provider in llm.providers.items()
    )
```

</details>

#### 缺口

- 候选/成功读取/实际分析差异及检出误报率缺少运行数据
  **影响**：不能证明覆盖或把结果作为安全闸门
  **进一步探讨**：在副本中加入可读、不可读、语法损坏与受过滤样本，核对报告覆盖和人工真值

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样有条件试用并检验覆盖回执的价值？

**研究主题**：依赖、兼容与流程、效果与总成本、新假设与验证、采用判断

#### 完整回答

可在自有代码副本上试用本地Shield，把结果当审阅线索；本轮不建议将根平台声明直接用作自动安全放行或对外测试依据。首次需Python依赖/配置，远端L3还需账户、网络与允许外发源码的条件；持续付出误报复核和模型费用，失败要保留实际覆盖。由OSError跳过但计总数推导未验证假设：结果显式列候选、成功分析、跳过及失败文件，可降低“零发现=安全”的误判。与当前报告比较相同混合样本的覆盖判断准确率、修复时间和误放行；若误判不减少或负担超过收益，则否定。

#### 证据与依据

**依据 1 · 源码核查**：[deepsec/cli/app.py:54-89](https://github.com/Unclecheng-li/DeepSec/blob/fff031fc01fb36b95348214c8ee359f6ede8aa8b/deepsec/cli/app.py#L54-L89)

本地扫描与远端开关

<details>
<summary>查看原文（36行）</summary>

```text
@shield_app.command("scan")
def shield_scan(
    path: Annotated[Path, typer.Argument(help="Source file or directory")],
    layer: Annotated[str, typer.Option(help="all, l1, l2, or l3")] = "all",
    format_name: Annotated[str, typer.Option("--format", help="text, json, sarif, markdown, or html")] = "text",
    output: Annotated[Path | None, typer.Option("--output", "-o")] = None,
    remote_l3: Annotated[bool, typer.Option(help="Send source to the configured LLM for opt-in L3 review")] = False,
    ignore_file: Annotated[Path | None, typer.Option("--ignore-file", help="YAML ignore rule file")] = None,
    include_tests: Annotated[bool, typer.Option("--include-tests", help="Also scan test, fixture, and example directories")] = False,
    stream: Annotated[bool, typer.Option("--stream", help="Emit newline-delimited JSON events for the DeepSec TUI")]=False,
) -> None:
    selected = _layers(layer)
    config = load_config()
    use_remote_l3 = remote_l3 or _explicit_l3_with_configured_provider(layer, selected, config)
    options = ScanOptions(
        l1="L1" in selected,
        l2="L2" in selected,
        l3="L3" in selected,
        remote_l3=use_remote_l3,
        dedup=config.shield.dedup,
        include_tests=include_tests,
        ignore_rules=load_ignore_rules(ignore_file),
    )
    if stream:
        typer.echo(json.dumps({"type": "status", "status": "started"}, separators=(",", ":")))

        def emit_finding(finding: DeepSecFinding) -> None:
            typer.echo(json.dumps({"type": "finding", "finding": finding.to_dict()}, separators=(",", ":")))

        result = scan_path(path, options, config, on_finding=emit_finding)
        typer.echo(json.dumps({"type": "complete", "result": result.to_dict()}, separators=(",", ":")))
    else:
        result = scan_path(path, options, config)
        _emit_result(result, format_name, output)
    if any(item.severity.value in {"critical", "high"} and not item.dismissed for item in result.findings):
        raise typer.Exit(2)
```

</details>

**依据 2 · 源码核查**：[deepsec/shield/scanner.py:104-120](https://github.com/Unclecheng-li/DeepSec/blob/fff031fc01fb36b95348214c8ee359f6ede8aa8b/deepsec/shield/scanner.py#L104-L120)

覆盖回执缺口依据

<details>
<summary>查看原文（17行）</summary>

```text
    files = _source_files(path, options.include_tests)
    all_findings: list[DeepSecFinding] = []
    layers: set[str] = set()
    for source in files:
        try:
            text = source.read_text(encoding="utf-8", errors="replace")
        except OSError:
            continue
        result = scan_text(text, str(source), SUPPORTED_SUFFIXES.get(source.suffix.lower()), options, config)
        for finding in result.findings:
            if on_finding is not None:
                on_finding(finding)
            all_findings.append(finding)
        layers.update(result.layers)
    if options.dedup:
        all_findings = unique_findings(all_findings)
    return ScanResult(findings=all_findings, elapsed_ms=(perf_counter() - started) * 1000, files_scanned=len(files), layers=tuple(sorted(layers)))
```

</details>

**依据 3 · 源码核查**：[deepsec/shield/rules/ai_audit.py:42-50](https://github.com/Unclecheng-li/DeepSec/blob/fff031fc01fb36b95348214c8ee359f6ede8aa8b/deepsec/shield/rules/ai_audit.py#L42-L50)

远端finding需复核

```text
async def audit_with_llm(text: str, target: str, review: Callable[[str, str], Awaitable[tuple[dict, object]]]) -> list[DeepSecFinding]:
    response, _usage = await review(text, target)
    result: list[DeepSecFinding] = []
    for raw in response.get("findings", []):
        if not isinstance(raw, dict):
            continue
        severity_text = str(raw.get("severity", "medium")).strip().lower()
        severity = Severity(severity_text) if severity_text in Severity._value2member_map_ else Severity.MEDIUM
        result.append(DeepSecFinding.create(mode=DeepSecMode.SHIELD, type=FindingType.MISSING_SECURITY_MEASURE, severity=severity, target=target, description=str(raw.get("description") or raw.get("title") or "AI security concern"), title=str(raw.get("title") or "AI security concern"), rule="l3_llm_semantic_review", layer="L3", evidence=str(raw.get("evidence") or ""), suggestion=str(raw.get("suggestion") or ""), line=_coerce_line(raw.get("line")), confidence=_coerce_confidence(raw.get("confidence", 0.6))))
```

#### 缺口

- 同任务误报、漏报、复核时间和总模型成本未测
  **影响**：不能确认分层集成优于原扫描器+人工
  **进一步探讨**：用已知真值的小样本对照原扫描流程，纳入失败和全部复核时间

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
