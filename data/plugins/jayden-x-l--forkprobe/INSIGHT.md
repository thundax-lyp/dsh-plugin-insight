# ForkProbe

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[707d02b](https://github.com/Jayden-X-L/forkprobe/tree/707d02b5a03c280237bb6d602bd8f1d09accf13e)

<!-- BEGIN META -->
[![GitHub ★ 74](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=74&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Jayden-X-L/forkprobe)
<!-- END META -->

> **功能**：对同一任务并排试跑模型与候选Skill，生成本地比较报告

> **亮点**：[Q01](#research-q01) 把候选真实输出和选择交接放在同一记录。

> **主要限制**：[Q03](#research-q03) 关闭分享不能阻止旧outbox启动重发；[Q04](#research-q04) 独立判定进程与完整本地bundle需显式清理。

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
  - [Q01 · 选型报告比Skill说明多了什么？](#detail-section-11)
  - [Q02 · 比较怎样执行并保留结果？](#detail-section-12)
  - [Q03 · 什么可能误导公平性与隐私？](#detail-section-13)
  - [Q04 · 采用和退出需哪些前置？](#detail-section-14)
  - [Q05 · 怎样证伪选型收益？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户想在投入任务前选择合适Skill。

读描述直接选或手工试跑。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 候选比较和报告 | 保存候选结果、计量与judge解析 | DSH文本候选无工具，HTML含正文 |
| 用户判定与handoff | 写verdict、handoff和latest供宿主续做 | 需核落盘，非自动保证任务续做 |
| 选择事件队列 | 白名单事件入outbox并重试 | 首用默认开，关闭新分享不止发旧队列 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Python3、Jinja2、完整templates/report.html.j2 | 报告必需 | finalizer解析和HTML | 缺模板抛错，无可审报告 |
| 支持toolFilter的DSH subagent provider | DSH必需 | 无工具候选执行 | 不支持则拒绝启动 |
| 回环端口与浏览器 | 在线判定必需 | token化POST写verdict | 服务不可用只产报告，人工交接 |
| 可写workspace与~/.forkprobe | 日志及分享需要 | bundle、handoff、配置、outbox | POST可200却未持久化，核文件 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 隔离 | 用户固定文本任务、模型与候选，阻断遥测并清旧outbox | 不以关闭勾选代替止发 |
| 生成 | DSH并行候选、可选judge，Python落日志/bundle/HTML | 看每候选错误与judge解析错误 |
| 判定 | 浏览器提交winner/tie/none，核verdict、handoff与latest | 200不足为成功，缺文件就人工继续 |
| 退出 | 核身份停止返回PID并清.port、日志、报告、bundle、outbox | 宿主取消不等于独立服务退出 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | Python/Jinja环境及每候选模型调用，金额未知 | 固定候选指纹、隔离目录和防遥测配置，耗时未知 | 不是现金硬预算 |
| 持续 | 多候选加judge、完整bundle及HTML磁盘，实际账单未知 | 人工读输出并核verdict落盘，耗时未知 | token估算不等于供应商计量 |
| 恢复 | 独立服务最多默认1800秒及队列网络，费用未知 | 核PID/端口、删.port/outbox及正文产物，耗时未知 | 关分享不止发旧队列；终止失败兜底不足 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 比较记录 | 代码写候选提示、结果和错误 | 公平优选效果未知 |
| 用户选择 | 返回用户选择并可tie/none | 端到端恢复未验 |
| 计量 | 估算与provider口径分开 | 真实总账单未知 |

> **思考**：[Q03](#research-q03) 关闭分享不能阻止旧outbox启动重发；[Q04](#research-q04) 独立判定进程与完整本地bundle需显式清理。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把候选真实输出和选择交接放在同一记录。

DSH与Python适配器有不同执行边界。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 关闭分享不能阻止旧outbox启动重发；[Q04](#research-q04) 独立判定进程与完整本地bundle需显式清理。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 仅隔离、脱敏且阻断遥测的小试；核判定落盘和子进程退出后再扩大。仅取消分享不满足隐私退出。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的同一任务的候选比较能否形成可回源结果并按用户选择继续。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、dsh-plugin/src/index.ts、scripts/compare.py、scripts/finalize_native_compare.py、scripts/verdict_server.py、scripts/resume_verdict.py、scripts/telemetry.py、services/telemetry-worker/src/index.js、scripts/run_verdict_server_once.py、scripts/render_report.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的同一任务的候选比较能否形成可回源结果并按用户选择继续。未执行目标代码或实际宿主验证。
- 下一步：保留任务、候选指纹和独立验收。

**分析版本**

- **仓库**：[Jayden-X-L/forkprobe](https://github.com/Jayden-X-L/forkprobe)
- **版本号**：1.1.0（[固定提交 707d02b](https://github.com/Jayden-X-L/forkprobe/tree/707d02b5a03c280237bb6d602bd8f1d09accf13e)）
- **版本日期**：2026-08-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 比较报告可改善选型，但需质量与总成本对照。

保留任务、候选指纹和独立验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 2539 | — | — | 20290 |
| .js | source | 3 | 769 | 742 | 4 | — |
| .ts | source | 1 | 503 | 470 | 2 | — |
| .mjs | test | 2 | 194 | 173 | 4 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/Jayden-X-L/forkprobe/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Jayden-X-L/forkprobe/issues?q=is%3Aissue+created%3A2026-10-06T06%3A34%3A44.234Z..2026-11-05T06%3A34%3A44.234Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Jayden-X-L/forkprobe/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T06%3A34%3A44.234Z..2026-11-05T06%3A34%3A44.234Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：同一任务的候选比较能否形成可回源结果并按用户选择继续？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 选型报告比Skill说明多了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

用户选PPT或写作Skill时，通常先读描述后直接采用。ForkProbe把任务交给baseline和候选，再交本地HTML报告供用户选择。根项目含Python比较器和DSH桥，真实条目应为工具。DSH桥的文本候选禁止工具，不能据此替代完整产物Skill执行。合格结果是能查看各输出、错误和候选来源，用户可选择tie或none后继续正确任务。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:27-39](https://github.com/Jayden-X-L/forkprobe/blob/707d02b5a03c280237bb6d602bd8f1d09accf13e/README.md#L27-L39)

作者说明比较报告与继续

<details>
<summary>查看原文（13行）</summary>

```text
ForkProbe 是一个 AI Skill 选型与试跑工具。它会把同一个任务交给模型本身和多个候选 skill，并排试跑，生成本地 HTML report，让你看到真实输出之后再选择 winner。

**v1.1 新增图片提示词 / 风格方向比较：** ForkProbe 现在可以比较 image prompt / style pipelines。每条候选先生成 `prompt.md`、`style-card.md`、`composition.md`、`negative-prompt.md` 和 `render-notes.md`，不在 runner 内调用图片 API；在 Codex 且宿主具备图片生成能力时，可根据本地 `render-queue.json` 做可选渲染验证，其他 Agent 可用用户外部渲染后回填 `rendered.png`。

选定 winner 后，Report 的“继续”按钮会同时保存本地 handoff，并让 Agent 沿胜出 Skill 继续任务。用户可以在同一区域选择是否匿名分享本次 Skill 选择，为未来的社区推荐先验积累样本。

当网络上的 skill 越来越多时，问题不再是“有没有 skill”，而是“当前任务到底该用哪个 skill”。ForkProbe 的目标很直接：先把结果摊开，再让 Agent 沿着你选中的路径继续工作。

## 什么时候该用 ForkProbe

- 你不确定当前任务该用哪个 skill，想先看真实输出再决定。
- 你想比较 baseline 和多个 skill，而不是只相信 skill 的描述。
- 你的交付物是 PPTX、科研 figure package、调研报告、图片 prompt/style package、可运行网页或视频成片，需要看文件、预览和 QA。
```

</details>

**依据 2 · 源码核查**：[dsh-plugin/src/index.ts:357-413](https://github.com/Jayden-X-L/forkprobe/blob/707d02b5a03c280237bb6d602bd8f1d09accf13e/dsh-plugin/src/index.ts#L357-L413)

DSH实际并行生成结果manifest

<details>
<summary>查看原文（57行）</summary>

```text
        const candidateStart = performance.now()
        const results = await Promise.all(skills.map(async skill => {
          const run = await startSubagent(
            ctx,
            config,
            parent,
            candidatePrompt(args.task, skill),
            `ForkProbe: ${skill.name}`,
            exec.signal,
          )
          return {
            ...skill,
            output: run.output,
            latency_seconds: run.latencySeconds,
            ...(run.error ? { error: run.error } : {}),
            token_count_method: 'estimated_visible_context' as const,
            provider_tokens_used: 0 as const,
          }
        }))

        let judge: Record<string, unknown> = { enabled: false }
        if (args.judge !== false) {
          const judgeRun = await startSubagent(
            ctx,
            config,
            parent,
            judgePrompt(args.task, results, args.judge_rubric),
            'ForkProbe AI judge',
            exec.signal,
          )
          judge = {
            enabled: true,
            output: judgeRun.output,
            latency_seconds: judgeRun.latencySeconds,
            ...(judgeRun.error ? { error: judgeRun.error } : {}),
          }
        }

        await writeFile(manifestPath, JSON.stringify({
          schema_version: 1,
          task_input: args.task,
          task_type: args.task_type?.trim() || 'text_general',
          duration_seconds: (performance.now() - candidateStart) / 1000,
          results: results.map(result => ({
            skill_id: result.id,
            skill_name: result.name,
            skill_author: result.author,
            skill_category: result.category,
            system_prompt: result.system_prompt,
            output: result.output,
            latency_seconds: result.latency_seconds,
            token_count_method: result.token_count_method,
            provider_tokens_used: result.provider_tokens_used,
            ...(result.error ? { error: result.error } : {}),
          })),
          judge,
        }), 'utf8')
```

</details>

#### 缺口

- DSH文本模式与产物模式对同任务的结论一致性未测。
  **影响**：文本强的候选不一定能交付合格文件，选型范围必须限定。
  **进一步探讨**：先对文本任务验收，再单独核验产物流程。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 比较怎样执行并保留结果？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

DSH桥要求subagent provider支持toolFilter，以allow空数组启动每个候选，读取完成输出并finally dispose。候选并行后可另起judge，再将提示、结果、时延和错误写manifest，Python finalizer生成报告及选择流程。Python总比较器另用ThreadPool执行宿主适配器，两条入口不能混作同一运行环境。 Python finalizer校验manifest schema与至少两个结果，构造RunResult；judge非JSON或无效winner保留raw_output并标error，tie/none规范化。它用write_log记录任务hash、候选计量和完整judge字段，另保存含完整提示与结果的forkprobe-run.json；Jinja模板将任务与结果嵌入自包含HTML。判定服务接收loopback带随机token的POST，再写verdict、handoff.md及latest指针。handoff是继续提示文本，Python resume只返回元数据，实际续做仍依赖宿主Agent；DSH读取日志winner后才返回selectedOutput，不用judge替代人工判定。POST写文件失败只打印异常，仍置内存event并200，所以HTTP成功不等于持久化成功。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin/src/index.ts:174-204](https://github.com/Jayden-X-L/forkprobe/blob/707d02b5a03c280237bb6d602bd8f1d09accf13e/dsh-plugin/src/index.ts#L174-L204)

实际工具过滤与释放

<details>
<summary>查看原文（31行）</summary>

```text
  const provider = ctx.subagents.getProvider(config.provider)
  if (!provider) throw new Error(`ForkProbe subagent provider "${config.provider}" is not available`)
  if (!provider.capabilities.toolFilter) {
    throw new Error(`ForkProbe subagent provider "${config.provider}" must support tool filtering`)
  }
  const startedAt = performance.now()
  let run: SubagentRun | undefined
  try {
    run = await ctx.subagents.start(config.provider, {
      label,
      prompt: [{ type: 'text', text: prompt }],
      parent,
      signal,
      toolFilter: { allow: [] },
      ...(provider.capabilities.depthLimit ? { maxDepth: config.maxDepth } : {}),
    })
    const result = await run.result
    const output = textFromBlocks(result.output)
    const error = result.stopReason === 'completed'
      ? undefined
      : `native DSH subagent ended with ${result.stopReason}`
    return { output, latencySeconds: (performance.now() - startedAt) / 1000, ...(error ? { error } : {}) }
  } catch (error: unknown) {
    return {
      output: '',
      latencySeconds: (performance.now() - startedAt) / 1000,
      error: error instanceof Error ? error.message : String(error),
    }
  } finally {
    if (run) await run.dispose().catch(() => undefined)
  }
```

</details>

**依据 2 · 源码核查**：[dsh-plugin/src/index.ts:357-421](https://github.com/Jayden-X-L/forkprobe/blob/707d02b5a03c280237bb6d602bd8f1d09accf13e/dsh-plugin/src/index.ts#L357-L421)

候选、judge及finalizer

<details>
<summary>查看原文（65行）</summary>

```text
        const candidateStart = performance.now()
        const results = await Promise.all(skills.map(async skill => {
          const run = await startSubagent(
            ctx,
            config,
            parent,
            candidatePrompt(args.task, skill),
            `ForkProbe: ${skill.name}`,
            exec.signal,
          )
          return {
            ...skill,
            output: run.output,
            latency_seconds: run.latencySeconds,
            ...(run.error ? { error: run.error } : {}),
            token_count_method: 'estimated_visible_context' as const,
            provider_tokens_used: 0 as const,
          }
        }))

        let judge: Record<string, unknown> = { enabled: false }
        if (args.judge !== false) {
          const judgeRun = await startSubagent(
            ctx,
            config,
            parent,
            judgePrompt(args.task, results, args.judge_rubric),
            'ForkProbe AI judge',
            exec.signal,
          )
          judge = {
            enabled: true,
            output: judgeRun.output,
            latency_seconds: judgeRun.latencySeconds,
            ...(judgeRun.error ? { error: judgeRun.error } : {}),
          }
        }

        await writeFile(manifestPath, JSON.stringify({
          schema_version: 1,
          task_input: args.task,
          task_type: args.task_type?.trim() || 'text_general',
          duration_seconds: (performance.now() - candidateStart) / 1000,
          results: results.map(result => ({
            skill_id: result.id,
            skill_name: result.name,
            skill_author: result.author,
            skill_category: result.category,
            system_prompt: result.system_prompt,
            output: result.output,
            latency_seconds: result.latency_seconds,
            token_count_method: result.token_count_method,
            provider_tokens_used: result.provider_tokens_used,
            ...(result.error ? { error: result.error } : {}),
          })),
          judge,
        }), 'utf8')

        const finalizedText = await runProcess(config.pythonExecutable, [
          resolve(PACKAGE_ROOT, 'scripts/finalize_native_compare.py'),
          '--manifest', manifestPath,
          '--output', reportPath,
          '--workspace', workspace,
          '--verdict-timeout', String(config.verdictTimeoutSeconds),
        ], workspace, exec.signal)
```

</details>

**依据 3 · 源码核查**：[scripts/compare.py:289-309](https://github.com/Jayden-X-L/forkprobe/blob/707d02b5a03c280237bb6d602bd8f1d09accf13e/scripts/compare.py#L289-L309)

Python宿主调用及token来源

<details>
<summary>查看原文（21行）</summary>

```text
    result: SubagentResult = spawn_subagent(
        platform=platform,
        task_input=task_input,
        system_prompt=skill.system_prompt,
        skill_id=skill.id,
        timeout_seconds=timeout,
    )
    estimated_tokens = estimate_run_tokens(task_input, skill.system_prompt, result.output)
    token_count_method = getattr(result, "token_count_method", "provider_reported")
    provider_tokens = result.tokens_used if token_count_method == "provider_reported" else 0
    return RunResult(
        skill_id=skill.id,
        skill_name=skill.name,
        skill_author=skill.author,
        skill_category=skill.category,
        output=result.output,
        tokens_used=result.tokens_used,
        latency_seconds=result.latency_seconds,
        estimated_tokens_used=estimated_tokens,
        provider_tokens_used=provider_tokens,
        token_count_method=token_count_method,
```

</details>

**依据 4 · 源码核查**：[scripts/finalize_native_compare.py:100-185](https://github.com/Jayden-X-L/forkprobe/blob/707d02b5a03c280237bb6d602bd8f1d09accf13e/scripts/finalize_native_compare.py#L100-L185)

manifest到日志、完整bundle和HTML实际链

<details>
<summary>查看原文（86行）</summary>

```text
    args = parser.parse_args()

    manifest_path = Path(args.manifest).resolve()
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    if manifest.get("schema_version") != 1:
        raise ValueError("unsupported native DSH manifest schema")

    task_input = str(manifest.get("task_input") or "")
    results = [_run_result(task_input, value) for value in manifest.get("results") or []]
    if len(results) < 2:
        raise ValueError("native DSH manifest must contain at least two candidates")

    judge_result: JudgeResult | None = None
    judge = manifest.get("judge")
    if isinstance(judge, dict) and judge.get("enabled"):
        if judge.get("error"):
            judge_result = JudgeResult(
                winner_skill_id=None,
                verdict_type="none",
                confidence=None,
                summary="Judge failed.",
                reasoning=str(judge.get("error")),
                scores={},
                tokens_used=0,
                latency_seconds=float(judge.get("latency_seconds") or 0),
                error=str(judge.get("error")),
                raw_output=str(judge.get("output") or ""),
            )
        else:
            judge_result = parse_judge_output(
                str(judge.get("output") or ""),
                results,
                0,
                float(judge.get("latency_seconds") or 0),
            )

    output_path = Path(args.output).resolve()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    workspace = Path(args.workspace).resolve()
    logs_dir = workspace / "forkprobe-logs"
    log_file = write_log(
        task_input,
        results,
        output_path,
        judge_result=judge_result,
        task_type=str(manifest.get("task_type") or "text_general"),
        platform_name="deepseek_harness_native",
        logs_dir=logs_dir,
    )

    local_bundle = output_path.with_suffix(".forkprobe-run.json")
    local_bundle.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    log = json.loads(log_file.read_text(encoding="utf-8"))
    log["execution_mode"] = "native_dsh_plugin"
    log["local_result_bundle_path"] = str(local_bundle)
    log_file.write_text(json.dumps(log, ensure_ascii=False, indent=2), encoding="utf-8")

    verdict_url = None
    server_pid = None
    if not args.no_server:
        verdict_url, server_pid = _start_verdict_process(log_file, args.verdict_timeout)

    render(
        task_input=task_input,
        results=[asdict(result) for result in results],
        duration_seconds=float(manifest.get("duration_seconds") or 0),
        output_path=output_path,
        auto_open=False,
        verdict_url=verdict_url,
        judge_result=asdict(judge_result) if judge_result else None,
    )
    opened = False if args.no_open else open_report(output_path)

    response = {
        "status": "ready",
        "report_path": str(output_path),
        "log_path": str(log_file),
        "local_result_bundle_path": str(local_bundle),
        "verdict_connected": bool(verdict_url),
        "verdict_server_pid": server_pid,
        "report_opened": opened,
        "judge_winner": judge_result.winner_skill_id if judge_result else None,
        "candidate_count": len(results),
    }
    print(json.dumps(response, ensure_ascii=False))
    return 0
```

</details>

**依据 5 · 源码核查**：[scripts/compare.py:453-506](https://github.com/Jayden-X-L/forkprobe/blob/707d02b5a03c280237bb6d602bd8f1d09accf13e/scripts/compare.py#L453-L506)

judge解析与无效结果

<details>
<summary>查看原文（54行）</summary>

```text
def parse_judge_output(output: str, results: list[RunResult], tokens: int, latency: float) -> JudgeResult:
    """Convert the judge model's JSON into a stable JudgeResult."""
    parsed = _extract_json_object(output)
    valid_ids = {r.skill_id for r in results}
    valid_ids.update({"__tie__", "__none__"})
    if not parsed:
        return JudgeResult(
            winner_skill_id=None,
            verdict_type="none",
            confidence=None,
            summary="Judge returned non-JSON output.",
            reasoning="The raw judge output is included for debugging.",
            scores={},
            tokens_used=tokens,
            latency_seconds=latency,
            error="Could not parse judge JSON.",
            raw_output=output,
        )

    winner = parsed.get("winner_skill_id")
    if winner not in valid_ids:
        winner = None
    verdict_type = parsed.get("verdict_type") or ("tie" if winner == "__tie__" else "none" if winner == "__none__" else "pick")
    if verdict_type not in {"pick", "tie", "none"}:
        verdict_type = "pick" if winner else "none"
    if verdict_type == "tie":
        winner = "__tie__"
    elif verdict_type == "none":
        winner = "__none__"

    confidence = parsed.get("confidence")
    try:
        confidence = float(confidence) if confidence is not None else None
    except (TypeError, ValueError):
        confidence = None
    if confidence is not None:
        confidence = max(0.0, min(1.0, confidence))

    valid_winner = winner in valid_ids

    return JudgeResult(
        winner_skill_id=winner,
        verdict_type=verdict_type,
        confidence=confidence,
        summary=str(parsed.get("summary") or ""),
        reasoning=str(parsed.get("reasoning") or ""),
        scores=parsed.get("scores") if isinstance(parsed.get("scores"), dict) else {},
        tokens_used=tokens,
        latency_seconds=latency,
        error=None if valid_winner else "Judge did not choose a valid winner.",
        raw_output=output,
    )


```

</details>

**依据 6 · 源码核查**：[scripts/verdict_server.py:218-260](https://github.com/Jayden-X-L/forkprobe/blob/707d02b5a03c280237bb6d602bd8f1d09accf13e/scripts/verdict_server.py#L218-L260)

判定持久化与异常后仍200

<details>
<summary>查看原文（43行）</summary>

```text
        verdict["handoff_text"] = build_handoff_text(verdict)
        requested_sharing = verdict.get("share_anonymous")
        if not isinstance(requested_sharing, bool):
            requested_sharing = None
        response = {"ok": True, "telemetry_queued": False}

        # Persist verdict into the log file (if available)
        log_path = _log_path_holder.get("path")
        if log_path and log_path.exists():
            try:
                log = json.loads(log_path.read_text(encoding="utf-8"))
                handoff_path = write_handoff_file(log_path, log, verdict)
                verdict["handoff_path"] = str(handoff_path.resolve())
                log["verdict"] = verdict
                log["verdict_received_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
                log["handoff_path"] = verdict["handoff_path"]
                log_path.write_text(json.dumps(log, indent=2, ensure_ascii=False), encoding="utf-8")
                latest_log_path, latest_handoff_path = write_latest_files(log_path, log, handoff_path)
                log["latest_log_path"] = str(latest_log_path.resolve())
                if latest_handoff_path:
                    log["latest_handoff_path"] = str(latest_handoff_path.resolve())
                    verdict["latest_handoff_path"] = log["latest_handoff_path"]
                log_path.write_text(json.dumps(log, indent=2, ensure_ascii=False), encoding="utf-8")
                latest_log_path.write_text(json.dumps(log, indent=2, ensure_ascii=False), encoding="utf-8")
                response["handoff_path"] = verdict["handoff_path"]
                response["latest_log_path"] = log["latest_log_path"]

                if requested_sharing is not None:
                    save_sharing_preference(requested_sharing)
                    if sharing_allowed(requested_sharing):
                        enqueue_and_flush_async(log, verdict)
                        response["telemetry_queued"] = True
            except Exception as e:
                # Non-fatal — still record in memory
                print(f"[verdict_server] could not update log: {e}")

        _received_verdict.update(verdict)
        _verdict_event.set()

        self.send_response(200)
        self._send_cors()
        self.send_header("Content-Type", "application/json")
        self.end_headers()
```

</details>

**依据 7 · 源码核查**：[scripts/resume_verdict.py:89-109](https://github.com/Jayden-X-L/forkprobe/blob/707d02b5a03c280237bb6d602bd8f1d09accf13e/scripts/resume_verdict.py#L89-L109)

Python恢复返回交接元数据

<details>
<summary>查看原文（21行）</summary>

```text
def build_resume_payload(log_path: Path, log: dict) -> dict:
    verdict = dict(log.get("verdict") or {})
    winner = str(verdict.get("winner") or "")
    winner_name = _candidate_name(log, winner)
    handoff_text = str(verdict.get("handoff_text") or "").strip()
    handoff_path = verdict.get("handoff_path") or log.get("handoff_path") or log.get("latest_handoff_path")

    return {
        "status": "ok",
        "log_path": str(log_path.resolve()),
        "source_log_path": log.get("source_log_path") or str(log_path.resolve()),
        "report_path": log.get("report_path"),
        "handoff_path": handoff_path,
        "winner": winner,
        "winner_name": winner_name,
        "verdict_type": verdict.get("verdict_type") or "pick",
        "reason": verdict.get("reason") or "",
        "handoff_text": handoff_text,
        "verdict_received_at": log.get("verdict_received_at"),
    }

```

</details>

#### 缺口

- 各宿主适配器对上下文和预算是否等价未验。
  **影响**：比较可能反映宿主配置差异而非Skill增量。
  **进一步探讨**：固定模型、输入、预算和宿主逐项记录。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么可能误导公平性与隐私？

**研究主题**：缺陷与关键质疑

#### 完整回答

judge按名称呈现候选并截长输出，存在名称偏好和中段证据遗漏。provider_tokens_used为0且口径为估算，不代表免费。遥测实际白名单仅schema_version、随机UUID event_id、受正则限制task_type、最多10个且各128字符的去重候选名称、final_choice；不含任务正文、输出、reason或handoff，但名称仍可能敏感。每次入队新UUID，JSON原子写到~/.forkprobe/telemetry/outbox；守护线程每次发送5项，服务启动重试10项，HTTP超时2秒，2xx后删文件，失败保留，无退避或有界总重试。服务端INSERT OR IGNORE按event_id去重，因此同事件重发可去重，同选择重新提交的新UUID不去重。首用分享默认true。关键反证：取消分享仅保存enabled=false且不入新事件；start_server无条件flush旧队列，flush未查配置或环境，FORKPROBE_TELEMETRY=0也不能阻止该旧队列发送。不能建议仅关勾选即可隐私退出。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin/src/index.ts:104-128](https://github.com/Jayden-X-L/forkprobe/blob/707d02b5a03c280237bb6d602bd8f1d09accf13e/dsh-plugin/src/index.ts#L104-L128)

judge截断与名称输入

<details>
<summary>查看原文（25行）</summary>

```text
function truncate(value: string, limit: number): string {
  if (value.length <= limit) return value
  const half = Math.floor(limit / 2)
  return `${value.slice(0, half)}\n\n[... truncated ${value.length - limit} chars ...]\n\n${value.slice(-half)}`
}

function judgePrompt(task: string, results: CandidateResult[], rubric?: string): string {
  const candidates = results.map(result => [
    `## Candidate: ${result.id}`,
    `Name: ${result.name}`,
    result.error ? `[ERROR] ${result.error}` : truncate(result.output, 5000),
  ].join('\n')).join('\n\n---\n\n')
  return [
    'You are ForkProbe\'s impartial comparison judge.',
    'Compare candidates for fidelity, correctness, specificity, usefulness, clarity, and natural tone.',
    'Use a 0-10 score for every candidate. Return JSON only with this exact shape:',
    '{"winner_skill_id":"candidate id, __tie__, or __none__","verdict_type":"pick | tie | none","confidence":0.0,"summary":"one sentence","reasoning":"2-5 sentences","scores":{"candidate_id":{"score":0,"note":"short note"}}}',
    rubric?.trim() ? `Additional rubric: ${rubric.trim()}` : '',
    '',
    '## Original task',
    truncate(task, 4000),
    '',
    '## Candidates',
    candidates,
  ].filter(Boolean).join('\n')
```

</details>

**依据 2 · 源码核查**：[dsh-plugin/src/index.ts:367-373](https://github.com/Jayden-X-L/forkprobe/blob/707d02b5a03c280237bb6d602bd8f1d09accf13e/dsh-plugin/src/index.ts#L367-L373)

token并非供应商计量

```text
          return {
            ...skill,
            output: run.output,
            latency_seconds: run.latencySeconds,
            ...(run.error ? { error: run.error } : {}),
            token_count_method: 'estimated_visible_context' as const,
            provider_tokens_used: 0 as const,
```

**依据 3 · 源码核查**：[scripts/telemetry.py:52-80](https://github.com/Jayden-X-L/forkprobe/blob/707d02b5a03c280237bb6d602bd8f1d09accf13e/scripts/telemetry.py#L52-L80)

默认偏好及仅新事件分享门槛

<details>
<summary>查看原文（29行）</summary>

```text
def sharing_default(path: Path | None = None) -> bool:
    """Return the report checkbox default; first use is intentionally checked."""
    env_value = os.environ.get("FORKPROBE_TELEMETRY")
    if env_value is not None:
        return env_value.lower() not in _FALSE_VALUES
    sharing = load_config(path).get("anonymous_selection_sharing")
    if isinstance(sharing, dict) and isinstance(sharing.get("enabled"), bool):
        return bool(sharing["enabled"])
    return True


def sharing_forced_off() -> bool:
    """Return True when the environment explicitly disables all telemetry."""
    env_value = os.environ.get("FORKPROBE_TELEMETRY")
    return env_value is not None and env_value.strip().lower() in _FALSE_VALUES


def sharing_allowed(requested: bool) -> bool:
    """Apply the process-level privacy override to a report's explicit choice."""
    return bool(requested) and not sharing_forced_off()


def save_sharing_preference(enabled: bool, path: Path | None = None) -> dict[str, Any]:
    target = path or CONFIG_PATH
    config = load_config(target)
    config["anonymous_selection_sharing"] = {
        "enabled": bool(enabled),
        "consent_version": CONSENT_VERSION,
        "confirmed_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
```

</details>

**依据 4 · 源码核查**：[scripts/telemetry.py:86-201](https://github.com/Jayden-X-L/forkprobe/blob/707d02b5a03c280237bb6d602bd8f1d09accf13e/scripts/telemetry.py#L86-L201)

精确载荷、队列、发送与重试

<details>
<summary>查看原文（116行）</summary>

```text
def _clean_name(value: Any) -> str:
    return " ".join(str(value or "").split())[:MAX_NAME_LENGTH]


def _candidate_names(log: dict[str, Any]) -> list[str]:
    names: list[str] = []
    seen: set[str] = set()
    for candidate in log.get("candidates", []):
        if not isinstance(candidate, dict):
            continue
        name = _clean_name(candidate.get("name") or candidate.get("skill_name") or candidate.get("id"))
        key = name.casefold()
        if not name or key in seen:
            continue
        seen.add(key)
        names.append(name)
        if len(names) >= MAX_CANDIDATES:
            break
    return names


def _winner_name(log: dict[str, Any], verdict: dict[str, Any], candidate_names: list[str]) -> str:
    winner = _clean_name(verdict.get("winner"))
    for candidate in log.get("candidates", []):
        if not isinstance(candidate, dict):
            continue
        if _clean_name(candidate.get("id")) == winner:
            return _clean_name(candidate.get("name") or candidate.get("skill_name") or winner)

    requested_name = _clean_name(verdict.get("winner_name"))
    known_by_casefold = {name.casefold(): name for name in candidate_names}
    return known_by_casefold.get(requested_name.casefold(), "__none__")


def build_selection_event(log: dict[str, Any], verdict: dict[str, Any]) -> dict[str, Any]:
    """Build the exact anonymous payload allowed to leave the local machine."""
    task_type = str(log.get("task_type") or "unknown").strip().lower()
    if not _TASK_TYPE_RE.fullmatch(task_type):
        task_type = "unknown"
    candidate_names = _candidate_names(log)
    verdict_type = str(verdict.get("verdict_type") or "pick")
    winner = str(verdict.get("winner") or "")
    if verdict_type == "tie" or winner == "__tie__":
        final_choice = "__tie__"
    elif verdict_type == "none" or winner == "__none__":
        final_choice = "__none__"
    else:
        final_choice = _winner_name(log, verdict, candidate_names)
    return {
        "schema_version": EVENT_SCHEMA_VERSION,
        "event_id": str(uuid.uuid4()),
        "task_type": task_type,
        "candidate_skill_names": candidate_names,
        "final_choice": final_choice,
    }


def enqueue_event(event: dict[str, Any], outbox_dir: Path | None = None) -> Path:
    target_dir = outbox_dir or OUTBOX_DIR
    target = target_dir / f"{event['event_id']}.json"
    _atomic_write_json(target, event)
    return target


def telemetry_endpoint() -> str:
    return os.environ.get("FORKPROBE_TELEMETRY_ENDPOINT", DEFAULT_TELEMETRY_ENDPOINT).strip()


def send_event(event: dict[str, Any], endpoint: str | None = None, timeout: float = 2.0) -> None:
    target = (endpoint if endpoint is not None else telemetry_endpoint()).strip()
    if not target:
        raise ValueError("ForkProbe telemetry endpoint is not configured")
    request = urllib.request.Request(
        target,
        data=json.dumps(event, ensure_ascii=False, separators=(",", ":")).encode("utf-8"),
        headers={"Content-Type": "application/json", "User-Agent": "forkprobe-selection-telemetry"},
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=timeout) as response:
        if not 200 <= int(response.status) < 300:
            raise urllib.error.HTTPError(target, response.status, "telemetry rejected", response.headers, None)


def flush_outbox(
    outbox_dir: Path | None = None,
    endpoint: str | None = None,
    timeout: float = 2.0,
    max_events: int = 10,
) -> dict[str, int]:
    target_dir = outbox_dir or OUTBOX_DIR
    sent = 0
    failed = 0
    if not target_dir.exists() or not (endpoint if endpoint is not None else telemetry_endpoint()).strip():
        return {"sent": sent, "failed": failed}
    for path in sorted(target_dir.glob("*.json"))[:max_events]:
        try:
            event = json.loads(path.read_text(encoding="utf-8"))
            send_event(event, endpoint=endpoint, timeout=timeout)
            path.unlink()
            sent += 1
        except (OSError, ValueError, json.JSONDecodeError, urllib.error.URLError, urllib.error.HTTPError, TimeoutError):
            failed += 1
    return {"sent": sent, "failed": failed}


def enqueue_and_flush_async(log: dict[str, Any], verdict: dict[str, Any]) -> Path:
    event = build_selection_event(log, verdict)
    queued_path = enqueue_event(event)
    thread = threading.Thread(target=flush_outbox, kwargs={"max_events": 5}, daemon=True)
    thread.start()
    return queued_path


def flush_outbox_async(max_events: int = 10) -> threading.Thread:
    """Retry queued events without delaying report generation or continuation."""
    thread = threading.Thread(target=flush_outbox, kwargs={"max_events": max_events}, daemon=True)
```

</details>

**依据 5 · 源码核查**：[scripts/verdict_server.py:243-288](https://github.com/Jayden-X-L/forkprobe/blob/707d02b5a03c280237bb6d602bd8f1d09accf13e/scripts/verdict_server.py#L243-L288)

取消只影响新队列而启动总重试旧队列

<details>
<summary>查看原文（46行）</summary>

```text
                response["latest_log_path"] = log["latest_log_path"]

                if requested_sharing is not None:
                    save_sharing_preference(requested_sharing)
                    if sharing_allowed(requested_sharing):
                        enqueue_and_flush_async(log, verdict)
                        response["telemetry_queued"] = True
            except Exception as e:
                # Non-fatal — still record in memory
                print(f"[verdict_server] could not update log: {e}")

        _received_verdict.update(verdict)
        _verdict_event.set()

        self.send_response(200)
        self._send_cors()
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(response).encode("utf-8"))

    def log_message(self, fmt, *args):  # silence default access log
        return


def start_server(log_path: Path, token: Optional[str] = None) -> int:
    """
    Start the verdict server on a free localhost port. Returns the port.

    Idempotent — calling twice in the same process reuses the same server.
    """
    global _server_thread, _httpd, _server_token

    _log_path_holder["path"] = log_path
    _verdict_event.clear()
    _received_verdict.clear()
    _server_token = token or secrets.token_urlsafe(24)

    if _httpd is not None:
        # Already running, just rebind log path
        return _httpd.server_address[1]

    port = _find_free_port()
    _httpd = HTTPServer((_BIND_HOST, port), _VerdictHandler)
    _server_thread = threading.Thread(target=_httpd.serve_forever, daemon=True)
    _server_thread.start()
    flush_outbox_async()
```

</details>

**依据 6 · 源码核查**：[services/telemetry-worker/src/index.js:148-166](https://github.com/Jayden-X-L/forkprobe/blob/707d02b5a03c280237bb6d602bd8f1d09accf13e/services/telemetry-worker/src/index.js#L148-L166)

服务器按event_id去重

<details>
<summary>查看原文（19行）</summary>

```text
  const validated = validateSelectionEvent(raw);
  if (!validated.ok) {
    return jsonResponse({ error: validated.error }, 400);
  }
  const event = validated.event;
  const payloadHash = await sha256(canonicalEvent(event));
  const statements = [
    env.DB.prepare(
      "INSERT OR IGNORE INTO selection_events " +
      "(event_id, schema_version, payload_hash, task_type, final_choice) VALUES (?, ?, ?, ?, ?)"
    ).bind(event.event_id, event.schema_version, payloadHash, event.task_type, event.final_choice),
    ...event.candidate_skill_names.map((skillName) => env.DB.prepare(
      "INSERT OR IGNORE INTO event_candidates (event_id, skill_name) " +
      "SELECT event_id, ? FROM selection_events WHERE event_id = ? AND payload_hash = ?"
    ).bind(skillName, event.event_id, payloadHash)),
  ];
  const results = await env.DB.batch(statements);
  const inserted = Number(results?.[0]?.meta?.changes || 0) === 1;
  return jsonResponse({ ok: true, accepted: inserted, duplicate: !inserted }, inserted ? 202 : 200);
```

</details>

#### 缺口

- 未验证真实接收服务、传输观测与重识别风险，也未验证旧队列并发重试行为。
  **影响**：不能确认第三方保存范围或保证取消分享立即止发；不得处理敏感候选名称。
  **进一步探讨**：先阻断遥测网络、停止所有判定进程，离线核对并清理旧outbox，再以脱敏数据验证；需要源码修正flush门槛后才评敏感场景。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用和退出需哪些前置？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

DSH桥需Python3、完整模板与Jinja2以及支持toolFilter的subagent provider；缺过滤拒绝候选，缺模板抛错，judge失败可保留错误报告。候选与可选judge各有模型用量，候选数量配置不能当现金硬预算。finalizer用start_new_session=True启动独立判定Python子进程，stdin断开、输出重定向到每轮verdict-server.log，等待.port最多8秒；失败terminate但没有wait/kill兜底。成功仅把PID回传，子服务不绑定宿主close，默认等待1800秒后finally关闭HTTP socket；.port文件和日志未自动删除。DSH取消仅停止轮询并finally删除临时workDir，已生成HTML、完整bundle、日志、handoff和独立服务不因此全部清理。服务以随机token、允许Origin和127.0.0.1限制请求来源，但不是磁盘隐私隔离。试验前建隔离工作目录、限制候选并核算账单、阻断遥测且清空历史outbox；选择后核对日志verdict与handoff实际存在。退出停止已核身份的PID、关闭浏览器报告、清理报告/bundle/日志/.port/outbox，保留必要证据再卸载。Python --no-server可离线生成报告，但失去HTTP判定捕获，不能承诺resume自动获得选择。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/finalize_native_compare.py:24-63](https://github.com/Jayden-X-L/forkprobe/blob/707d02b5a03c280237bb6d602bd8f1d09accf13e/scripts/finalize_native_compare.py#L24-L63)

独立进程启动、8秒就绪与仅terminate

<details>
<summary>查看原文（40行）</summary>

```text
def _start_verdict_process(log_file: Path, timeout_seconds: int) -> tuple[str | None, int | None]:
    run_id = log_file.stem
    port_file = log_file.parent / f".{run_id}.port"
    server_log = log_file.parent / f"{run_id}.verdict-server.log"
    port_file.unlink(missing_ok=True)
    with server_log.open("ab") as stream:
        process = subprocess.Popen(
            [
                sys.executable,
                str(Path(__file__).with_name("run_verdict_server_once.py")),
                "--log",
                str(log_file),
                "--port-file",
                str(port_file),
                "--timeout",
                str(timeout_seconds),
            ],
            stdin=subprocess.DEVNULL,
            stdout=stream,
            stderr=subprocess.STDOUT,
            start_new_session=True,
            close_fds=True,
        )

    deadline = time.monotonic() + 8
    while time.monotonic() < deadline:
        if process.poll() is not None:
            return None, None
        if port_file.exists():
            try:
                endpoint = port_file.read_text(encoding="utf-8").strip()
                if endpoint.startswith("http://localhost:"):
                    return endpoint, process.pid
                # Backward compatibility with an older helper that wrote only a port.
                return build_verdict_url(int(endpoint)), process.pid
            except (OSError, ValueError):
                pass
        time.sleep(0.1)
    process.terminate()
    return None, None
```

</details>

**依据 2 · 源码核查**：[scripts/run_verdict_server_once.py:13-33](https://github.com/Jayden-X-L/forkprobe/blob/707d02b5a03c280237bb6d602bd8f1d09accf13e/scripts/run_verdict_server_once.py#L13-L33)

1800秒等待及finally关闭

<details>
<summary>查看原文（21行）</summary>

```text
def main() -> int:
    parser = argparse.ArgumentParser(description="Run a forkprobe verdict server for one report.")
    parser.add_argument("--log", required=True, help="forkprobe log JSON to update")
    parser.add_argument("--port-file", required=True, help="file where the tokenized verdict endpoint is written")
    parser.add_argument("--timeout", type=int, default=1800, help="seconds to wait for a verdict")
    args = parser.parse_args()

    log_path = Path(args.log).resolve()
    port_file = Path(args.port_file).resolve()
    port = start_server(log_path)
    verdict_url = build_verdict_url(port)
    port_file.write_text(verdict_url, encoding="utf-8")
    print(f"Verdict server: {verdict_url}", flush=True)

    try:
        verdict = wait_for_verdict(timeout_seconds=args.timeout)
        print(f"Verdict: {verdict}", flush=True)
    finally:
        stop_server()

    return 0
```

</details>

**依据 3 · 源码核查**：[scripts/verdict_server.py:184-217](https://github.com/Jayden-X-L/forkprobe/blob/707d02b5a03c280237bb6d602bd8f1d09accf13e/scripts/verdict_server.py#L184-L217)

loopback请求鉴权及解析

<details>
<summary>查看原文（34行）</summary>

```text
    def do_POST(self):
        parsed_path = urlsplit(self.path)
        if parsed_path.path != "/verdict":
            self.send_response(404)
            self.end_headers()
            return

        if not _origin_is_allowed(self.headers.get("Origin")):
            self.send_response(403)
            self.end_headers()
            return

        query = parse_qs(parsed_path.query)
        supplied_token = (query.get("token") or [""])[0]
        if _server_token and supplied_token != _server_token:
            self.send_response(403)
            self._send_cors()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"error": "invalid verdict token"}).encode("utf-8"))
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            body_bytes = self.rfile.read(length)
            verdict = json.loads(body_bytes.decode("utf-8"))
        except (ValueError, json.JSONDecodeError) as e:
            self.send_response(400)
            self._send_cors()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
            return

```

</details>

**依据 4 · 源码核查**：[dsh-plugin/src/index.ts:414-449](https://github.com/Jayden-X-L/forkprobe/blob/707d02b5a03c280237bb6d602bd8f1d09accf13e/dsh-plugin/src/index.ts#L414-L449)

等待取消与仅临时目录清理

<details>
<summary>查看原文（36行）</summary>

```text

        const finalizedText = await runProcess(config.pythonExecutable, [
          resolve(PACKAGE_ROOT, 'scripts/finalize_native_compare.py'),
          '--manifest', manifestPath,
          '--output', reportPath,
          '--workspace', workspace,
          '--verdict-timeout', String(config.verdictTimeoutSeconds),
        ], workspace, exec.signal)
        const finalized = JSON.parse(finalizedText) as Record<string, unknown>
        const ready: ToolResponse = {
          status: 'ready',
          reportPath: String(finalized.report_path || reportPath),
          logPath: String(finalized.log_path || ''),
          ...(finalized.judge_winner ? { judgeWinner: String(finalized.judge_winner) } : {}),
          message: finalized.verdict_connected
            ? 'ForkProbe opened the local report. The AI judge is advisory; wait for the user to click Continue with their chosen winner.'
            : 'ForkProbe created the report, but the local verdict server was unavailable. Ask the user to review it, then call forkprobe_resume after they select a winner.',
        }

        if (args.wait_for_verdict === false || !finalized.verdict_connected || !ready.logPath) return ready
        const selected = await waitForVerdict(ready.logPath, results, config.verdictTimeoutSeconds, exec.signal)
        return selected || {
          ...ready,
          status: 'awaiting_verdict',
          message: 'The report is ready, but no user verdict arrived before the local wait window ended. Do not use the AI judge as the user choice; call forkprobe_resume after selection.',
        }
      } finally {
        await rm(workDir, { recursive: true, force: true }).catch(() => undefined)
      }
    },
  }))

  ctx.tools.register(defineTool({
    name: 'forkprobe_resume',
    description: 'Read the latest submitted ForkProbe Report verdict in this workspace and return the user-selected Skill output so the DSH Agent can continue the original task.',
    parameters: {
```

</details>

**依据 5 · 源码核查**：[scripts/render_report.py:138-167](https://github.com/Jayden-X-L/forkprobe/blob/707d02b5a03c280237bb6d602bd8f1d09accf13e/scripts/render_report.py#L138-L167)

模板和Jinja渲染依赖

<details>
<summary>查看原文（30行）</summary>

```text
        _as_int(r.get("estimated_tokens_used") or r.get("tokens_used"))
        for r in results
    )

    template_path = TEMPLATES_DIR / "report.html.j2"
    if not template_path.exists():
        raise RuntimeError(
            f"forkprobe modern report template not found: {template_path}. "
            "Run compare.py from a complete forkprobe checkout that includes templates/report.html.j2."
        )

    Template = _load_template_class()
    template_source = template_path.read_text(encoding="utf-8")
    template = Template(template_source)
    html_output = template.render(
        task_input=task_input,
        results=results,
        duration_seconds=duration_seconds,
        result_count=len(results),
        total_estimated_tokens=total_estimated_tokens,
        total_estimated_tokens_display=f"{total_estimated_tokens:,}",
        verdict_url=verdict_url or "",
        verdict_connected_json=json.dumps(bool(verdict_url)),
        share_default_json=json.dumps(
            telemetry_sharing_default() if share_default is None else bool(share_default)
        ),
        telemetry_consent_version=CONSENT_VERSION,
        judge_result=judge_result,
        candidates_json=json.dumps(candidates_by_id, ensure_ascii=False).replace("</", "<\\/"),
    )
```

</details>

#### 缺口

- 本轮未执行安装、进程终止、磁盘失败或浏览器提交；宿主及Python适配器的完整子进程释放未实测。
  **影响**：不能给出回归耗时或承诺取消后没有模型用量、判定进程与本地正文残留。
  **进一步探讨**：隔离脱敏目录分别触发正常提交、写入拒绝、超时和宿主取消，核PID、端口、verdict文件与真实账单。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样证伪选型收益？

**研究主题**：新假设与验证

#### 完整回答

同模型固定任务，比较直接选Skill与运行候选报告后人工选型，盲评最后交付是否合格并计总用量。将同候选改名、把关键内容放中段、提供tie/none，观察judge与人工选择。若名称或截断主导胜负、用户选择未被尊重，或多跑成本未换来质量改善，则退回少量人工试跑。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin/src/index.ts:110-128](https://github.com/Jayden-X-L/forkprobe/blob/707d02b5a03c280237bb6d602bd8f1d09accf13e/dsh-plugin/src/index.ts#L110-L128)

可构造名称与截断对照

<details>
<summary>查看原文（19行）</summary>

```text
function judgePrompt(task: string, results: CandidateResult[], rubric?: string): string {
  const candidates = results.map(result => [
    `## Candidate: ${result.id}`,
    `Name: ${result.name}`,
    result.error ? `[ERROR] ${result.error}` : truncate(result.output, 5000),
  ].join('\n')).join('\n\n---\n\n')
  return [
    'You are ForkProbe\'s impartial comparison judge.',
    'Compare candidates for fidelity, correctness, specificity, usefulness, clarity, and natural tone.',
    'Use a 0-10 score for every candidate. Return JSON only with this exact shape:',
    '{"winner_skill_id":"candidate id, __tie__, or __none__","verdict_type":"pick | tie | none","confidence":0.0,"summary":"one sentence","reasoning":"2-5 sentences","scores":{"candidate_id":{"score":0,"note":"short note"}}}',
    rubric?.trim() ? `Additional rubric: ${rubric.trim()}` : '',
    '',
    '## Original task',
    truncate(task, 4000),
    '',
    '## Candidates',
    candidates,
  ].filter(Boolean).join('\n')
```

</details>

**依据 2 · 源码核查**：[dsh-plugin/src/index.ts:243-258](https://github.com/Jayden-X-L/forkprobe/blob/707d02b5a03c280237bb6d602bd8f1d09accf13e/dsh-plugin/src/index.ts#L243-L258)

用户判定优先于judge

<details>
<summary>查看原文（16行）</summary>

```text
      const verdict = log.verdict as Record<string, unknown> | null
      if (verdict?.winner) {
        const winner = String(verdict.winner)
        const selected = results.find(result => result.id === winner)
        return {
          status: 'selected',
          reportPath: String(log.report_path || ''),
          logPath,
          winner,
          winnerName: String(verdict.winner_name || selected?.name || winner),
          verdictType: String(verdict.verdict_type || 'pick'),
          handoffText: String(verdict.handoff_text || ''),
          ...(selected ? { selectedOutput: selected.output } : {}),
          message: selected
            ? `The user selected ${selected.name}. Continue the original task with this selected output and Skill.`
            : 'The user submitted a tie or none verdict. Follow the verdict instead of the AI judge.',
```

</details>

**依据 3 · 源码核查**：[scripts/compare.py:289-309](https://github.com/Jayden-X-L/forkprobe/blob/707d02b5a03c280237bb6d602bd8f1d09accf13e/scripts/compare.py#L289-L309)

计量字段口径

<details>
<summary>查看原文（21行）</summary>

```text
    result: SubagentResult = spawn_subagent(
        platform=platform,
        task_input=task_input,
        system_prompt=skill.system_prompt,
        skill_id=skill.id,
        timeout_seconds=timeout,
    )
    estimated_tokens = estimate_run_tokens(task_input, skill.system_prompt, result.output)
    token_count_method = getattr(result, "token_count_method", "provider_reported")
    provider_tokens = result.tokens_used if token_count_method == "provider_reported" else 0
    return RunResult(
        skill_id=skill.id,
        skill_name=skill.name,
        skill_author=skill.author,
        skill_category=skill.category,
        output=result.output,
        tokens_used=result.tokens_used,
        latency_seconds=result.latency_seconds,
        estimated_tokens_used=estimated_tokens,
        provider_tokens_used=provider_tokens,
        token_count_method=token_count_method,
```

</details>

#### 缺口

- 没有本轮选型盲评和费用对照。
  **影响**：目前只能确认比较机制，不能宣称选中更好Skill。
  **进一步探讨**：保留任务、候选指纹和独立验收。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
