# DSH × Blender

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[5175b2b](https://github.com/sixtysevenlf/dsh-blender-plugin/tree/5175b2b904d94ca0870e55fec818323f84dbdd91)

<!-- BEGIN META -->
[![GitHub ★ 1,498](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C498&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/sixtysevenlf/dsh-blender-plugin)
<!-- END META -->

> **功能**：将 DSH 工具接入 Blender 的持久交互、观察和验收工作流。

> **亮点**：[Q02](#research-q02) 将执行和观察接入宿主，[Q03](#research-q03) 明确未检查不能视作通过；底层 Blender 能力不属插件原创。

> **主要限制**：[Q02](#research-q02) 取消只停止等待，服务端可能继续；[Q03](#research-q03) gate 不覆盖全部视觉及业务验收。

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
  - [Q01 · 谁需要 Blender 接入，相对人工或脚本有何变化？](#detail-section-11)
  - [Q02 · 代码执行与取消如何工作？](#detail-section-12)
  - [Q03 · 验收 gate 能否证明完整交付？](#detail-section-13)
  - [Q04 · 安装与有状态操作有哪些成本和退路？](#detail-section-14)
  - [Q05 · 如何降低中断后未知结果？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向能够人工验收场景的 3D 创作者。

人工 Blender 和独立脚本已能建模；集成减少往返但引入进程、场景和权限维护。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Python 执行 | 修改或检查场景 | 可有文件副作用 |
| 观察 | 取帧或运行任务 | 真实 GUI 未测 |
| gate | 汇总指定检查 | skipped/degraded 非 pass |
| 任务与快照 | 查询和恢复 | 非所有副作用可撤销 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH 与插件 | 必需 | 宿主工具 | 无法调用 |
| Blender 和对应 addon | 对应模式必需 | 执行与观察 | 连接失败 |
| 场景副本和验收能力 | 必需 | 限制损失并审查 | 停止操作 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份场景并检查连接 | 隔离副本 |
| 执行 | Agent 提交受控代码 | 核对目标与作用 |
| 观察 | 用户检查帧和 gate | skipped 非通过 |
| 恢复 | 查询 job 并核对文件 | 不盲重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 安装 | Blender、addon 和进程 | 配置连接 | 未测 |
| 持续 | 模型、渲染和存储 | 人工视觉验收 | 净收益未知 |
| 失败 | 在途 job 与副本 | 查询、恢复、检查 | 取消不停止服务端 |
| 退出 | 文件和进程 | 关闭通道并核对 | 全部副作用未证可撤销 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 交互 | Python 执行及查看入口 | 真实建模质量 |
| gate | skipped 不算 pass | 业务验收完整 |
| 取消 | 停止等待 | 服务端已停止 |

> **思考**：[Q02](#research-q02) 取消只停止等待，服务端可能继续；[Q03](#research-q03) gate 不覆盖全部视觉及业务验收。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 将执行和观察接入宿主，[Q03](#research-q03) 明确未检查不能视作通过；底层 Blender 能力不属插件原创。

[Q02](#research-q02) signal 控制等待不保证服务端停止；[Q03](#research-q03) degraded 与 skipped 不当 pass。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 取消只停止等待，服务端可能继续；[Q03](#research-q03) gate 不覆盖全部视觉及业务验收。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 使用隔离场景并核对运行状态，不明时停止重试。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码静态核查；未执行 Blender、宿主或任务。

- 已检查：作者 README、包清单、源码路径 package.json、README.md、SECURITY.md、src/index.ts、addon/dsh_blender_bridge.py、runtime/gate.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交静态检查代表性执行、取消、addon 与 gate，未运行宿主或 Blender。
- 下一步：隔离场景测试取消、job 回收、缺失 gate 和视觉/几何验收。

**分析版本**

- **仓库**：[sixtysevenlf/dsh-blender-plugin](https://github.com/sixtysevenlf/dsh-blender-plugin)
- **版本号**：2.6.2（[固定提交 5175b2b](https://github.com/sixtysevenlf/dsh-blender-plugin/tree/5175b2b904d94ca0870e55fec818323f84dbdd91)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提议操作票据与状态核对，须对照已有 job、txn 和 gate 做故障实验。

隔离场景测试取消、job 回收、缺失 gate 和视觉/几何验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 34 | 9991 | — | — | 154680 |
| .md | example | 1 | 50 | — | — | 669 |
| .js | source | 4 | 5260 | 3674 | 1584 | — |
| .mjs | source | 22 | 7443 | 5886 | 1409 | — |
| .ts | source | 2 | 3413 | 2233 | 1126 | — |
| .mjs | test | 34 | 5013 | 3905 | 796 | — |
| .md | test | 1 | 241 | — | — | 3377 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-01），可前往 [GitHub Issues](https://github.com/sixtysevenlf/dsh-blender-plugin/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 Blender 交互、取消及验收边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要 Blender 接入，相对人工或脚本有何变化？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向能判断三维成果的创作者，将 DSH 工具连接 Blender GUI、无头 worker、取帧和交付检查。人工操作和独立 bpy 脚本已能建模，插件增量是持续场景的调用、观察及结构化验收组织，不是 Blender 几何引擎原创。作者描述 doctor 与功能入口，但一次连通不证明视觉、拓扑或业务交付合格。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-12](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/5175b2b904d94ca0870e55fec818323f84dbdd91/package.json#L1-L12)

插件身份与功能范围。

<details>
<summary>查看原文（12行）</summary>

```text
{
  "name": "@dsh-external/dsh-blender-plugin",
  "version": "2.6.2",
  "description": "DSH × Blender 直连插件（v2.6.2，GUI 优先，无头备用）：15 个模型工具让 AI 直接驱动 Blender——视口/自定义视角、持久内核 Python、时间窗/帧序列观察、内环参数搜索、无头进程与热会话（see/watch/reset/preload/warmup）、作业层、事务回滚、配方库，以及 34 family / 228 op 的契约层（catalog / 判定 / 验收 / 造型 / 装配 / 白模 / 导出）。v2.6.2 新增曲面算法包 surface_*（loft/sweep/patch → tessellate → validate → export，M0–M2/M4；M3 fit 与 M5 blend/offset 未实现）。P0–P2 能力：交互式无头（rt_do/rt_see session、plan session=auto）、参考图量具（img_digest/probe/measure/calib）、装配扫描/清单/合并/修复/门/导出（asm_*）、白模与 Seedance 参考包（blockout refsheet/turntable）、同机位 QC（visualreport_report）、无头轮廓拟合（shapesolve_solve）、缺陷注入评估（eval_run）、强制门（gate_/deliver_export require_gate）。默认先开 GUI；无头备用；装完必须重启 DSH；唯一验收判据 doctor kind=ok；blender-modeling skill 随包自动注册。详见 README 与 docs/操作教程.md。",
  "private": false,
  "keywords": [
    "dsh",
    "blender",
    "ai-agent",
    "tooling",
    "bpy",
    "cycles",
```

</details>

**依据 2 · 源码核查**：[README.md:126-146](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/5175b2b904d94ca0870e55fec818323f84dbdd91/README.md#L126-L146)

作者列出执行、查看与任务入口。

<details>
<summary>查看原文（21行）</summary>

```text

| Tool | What it gives you |
|---|---|
| blender_rt_see | A frame of the current GUI viewport or a custom camera angle. |
| blender_rt_do | Runs Python in Blender with a persistent kernel; can return a frame with the result. |
| blender_rt_watch | Samples a time window or frame range and reports whether the image changed. |
| blender_rt_worker | A persistent headless session for interactive work when no GUI is available. |

### Planning and operations

| Tool | What it gives you |
|---|---|
| blender_rt_plan | The capability catalog and the execution surface for modeling, audit, assembly, delivery, and evaluation operations. Start here when you are unsure which operation to use. |
| blender_viewport | Channel health, doctor, launch, and write-lease operations for coordinating multiple sessions. |

### Automation and jobs

| Tool | What it gives you |
|---|---|
| blender_rt_headless | Runs a standalone Blender background process for batch work, validation, or rendering. |
| blender_rt_job | Starts long work in the background and collects the result by job id; a timeout does not lose the result. |
```

</details>

**依据 3 · 源码核查**：[README.md:178-185](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/5175b2b904d94ca0870e55fec818323f84dbdd91/README.md#L178-L185)

作者的 doctor 和无头处理说明。

```text
| Symptom | What to do |
|---|---|
| doctor does not return kind equal to ok | Check that Blender is running and the addon is connected. For the GUI route this is the only valid acceptance check. |
| No GUI is available | Use the persistent worker fallback: start a worker, then run code and request a frame. |
| Another session is writing to the same scene | Take the write lease with blender_viewport, or use separate headless workers for parallel work. |
| An old MCP for Blender / blender_mcp addon is still enabled | Disable it (uninstalling is not required) and use the bundled DSH Blender Bridge addon; both compete for 127.0.0.1:9876. |
| Images are generated but not attached | Update to the latest build; the Windows path fix is included. If it persists, open the returned path directly. |
| Followed the steps and it still does not work | Check the bundled addon first: only addon/dsh_blender_bridge.py is supported, and it must be enabled and connected. |
```

#### 缺口

- 未完成真实 3D 任务
  **影响**：无法证明质量和净工时优于人工
  **进一步探讨**：对照同一模型的几何、视觉、交付和时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 代码执行与取消如何工作？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

插件将 blender_rt_do 标为 execute 并展示 Python，传输将宿主 signal 与内部超时合并；addon 对收到的代码使用 exec，属于实际代码执行而非只读工具。源码明确取消或超时只终止调用方等待，服务端任务可能继续；长任务应按 runId 查询，不可盲目重试或认为已经回滚。绑定本机网络也不能单独证明执行沙箱，需按场景权限和来源审查。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:42-50](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/5175b2b904d94ca0870e55fec818323f84dbdd91/src/index.ts#L42-L50)

通过异步上下文传递 signal。

```text
// v0.9.2（DSH 更新适配 R3）：把宿主的 exec（exec.signal = 用户打断 / per-tool 截止）
// 放进 AsyncLocalStorage，传输层 withTimeout() 自动合并它 —— **15 个工具体一行不改**
// 就能响应宿主取消；每个工具另补静态 timeoutMs（见 T），把"上游设默认截止"从
// "Blender 还在跑、工具已被判超时"的静默错位，变成"先由本插件给出可读错误"。
const EXEC_CTX = new AsyncLocalStorage<any>()
/** 当前工具调用对应的宿主 exec.signal（没有则 undefined） */
function execSignal(): AbortSignal | undefined {
  const s = EXEC_CTX.getStore()
  return s && s.signal instanceof AbortSignal ? s.signal : undefined
```

**依据 2 · 源码核查**：[src/index.ts:474-491](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/5175b2b904d94ca0870e55fec818323f84dbdd91/src/index.ts#L474-L491)

取消仅停止等待和合并超时。

<details>
<summary>查看原文（18行）</summary>

```text
/** 宿主取消（exec.signal abort）时的统一措辞：只说"等待被取消"，不谎称任务失败 */
const ABORT_HINT = '宿主取消了本次等待（exec.signal 已 abort：用户打断或 per-tool 截止）。'
  + '服务端任务可能仍在跑 —— 长任务请用 blender_rt_job 并按 runId 回收；'
  + '本插件的内部超时通常先于宿主截止触发，正常情况看到的是上面这类可读错误。'

/**
 * v0.9.2：合并「本插件内部超时」与「宿主 exec.signal」。
 * 两条都只影响**等待**：服务端已开始的 Blender 侧任务照旧跑完（headless/job 既有语义
 * = 客户端断连 ≠ 任务失败，按 runId 回收）。
 */
async function withTimeout(path: string, init: any, timeoutMs: number): Promise<Response> {
  const ac = new AbortController()
  const ext = execSignal()
  let fired = false
  const timer = setTimeout(() => { fired = true; ac.abort() }, timeoutMs)
  const signal = ext ? AbortSignal.any([ext, ac.signal]) : ac.signal
  try {
    return await fetch(path, { ...(init || {}), signal })
```

</details>

**依据 3 · 源码核查**：[src/index.ts:1138-1142](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/5175b2b904d94ca0870e55fec818323f84dbdd91/src/index.ts#L1138-L1142)

Python 执行工具展示。

```text
  blender_rt_do: {
    kind: 'execute',
    title: (a) => cardTitle('Blender 执行 Python', [a.code ? cardCodeHeadline(a.code) : cardBaseName(a.file), cardSession(a)]),
    code: (a) => cardPython(a.code),
  },
```

**依据 4 · 源码核查**：[addon/dsh_blender_bridge.py:2868-2890](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/5175b2b904d94ca0870e55fec818323f84dbdd91/addon/dsh_blender_bridge.py#L2868-L2890)

Blender 侧执行代码。

<details>
<summary>查看原文（23行）</summary>

```text
            }

        except Exception as e:
            return {"error": str(e)}

    def execute_code(self, code):
        """Execute arbitrary Blender Python code"""
        # This is powerful but potentially dangerous - use with caution
        try:
            # Create a local namespace for execution
            namespace = {"bpy": bpy}

            # Capture stdout during execution, and return it as result
            capture_buffer = io.StringIO()
            with redirect_stdout(capture_buffer):
                exec(code, namespace)

            captured_output = capture_buffer.getvalue()
            return {"executed": True, "result": captured_output}
        except Exception as e:
            # Give the caller the same detail we have: exception type, message,
            # and a full traceback (with line numbers into the submitted code),
            # instead of collapsing everything into one string. Callers that ran
```

</details>

#### 缺口

- 未运行 Blender、宿主或取消测试
  **影响**：无法证明真实进程停止及现场状态
  **进一步探讨**：在隔离副本模拟取消并通过任务状态核对副作用。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 验收 gate 能否证明完整交付？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

gate 的聚合规则将任一 fail/error 判 fail；否则只要 degraded 或 skipped 则为 degraded，全部未检查也不算 pass，比把缺失检查当通过更明确。它只对配置的规则和可用证据作判断；规则不能覆盖需求、视觉质量和资产授权，pass 不是完整业务验收。作者将 doctor kind=ok 作为 GUI 连接验收，并不能推成整个 3D 成品合格。

#### 证据与依据

**依据 1 · 源码核查**：[runtime/gate.py:236-259](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/5175b2b904d94ca0870e55fec818323f84dbdd91/runtime/gate.py#L236-L259)

配置的检查与 skipped/degrade 条件。

<details>
<summary>查看原文（24行）</summary>

```text
def _norm_spec(data):
    if not isinstance(data, dict):
        raise ValueError("spec 必须是对象（或 .py 里的 SPEC）")
    gates = data.get("gates")
    if not isinstance(gates, list) or not gates:
        raise ValueError("spec.gates 必须是非空数组")
    out = {"name": str(data.get("name") or "unnamed"), "units": str(data.get("units") or "mm"),
           "tolerance_mm": data.get("tolerance_mm"), "gates": []}
    for i, g in enumerate(gates):
        if not isinstance(g, dict):
            raise ValueError("gates[%d] 必须是对象" % i)
        op = str(g.get("op") or "")
        if op not in OP_MAP:
            near = sorted(OP_MAP)
            raise ValueError("gates[%d].op 不认识：%s（允许：%s）" % (i, op, ", ".join(near)))
        out["gates"].append({"id": str(g.get("id") or ("g%d" % i)), "op": op,
                             "args": g.get("args") or {}, "pass_if": str(g.get("pass_if") or ""),
                             "note": g.get("note"),
                             # v0.9.6（F2）：这些键"一个都没给"⇒ 该门 skipped（未配置/不适用），
                             # 显式列进回执 skipped[]；v3 起 skipped 会把顶层压成 degraded。"组"= 候选键名的或关系。
                             "skip_if_missing": _norm_skip_groups(g.get("skip_if_missing")),
                             # v3（F8）：判据为真但证据不可信 ⇒ 降级；echo 把真实字段带进回执做证据。
                             "degrade_if": str(g.get("degrade_if") or ""),
                             "echo": _norm_str_list(g.get("echo"))})
```

</details>

**依据 2 · 源码核查**：[runtime/gate.py:480-493](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/5175b2b904d94ca0870e55fec818323f84dbdd91/runtime/gate.py#L480-L493)

聚合状态规则。

<details>
<summary>查看原文（14行）</summary>

```text
def _aggregate(states):
    """整包三态（v3 · F8 收紧）：任一 fail/error ⇒ fail；否则任一 **degraded 或 skipped** ⇒ degraded；否则 pass。

    最小修（Lead 决议）：**任一门 skipped 或 degraded 都导致顶层 degraded，fail 优先** ——
    旧口径 `pass + skipped = pass` 被否决（"没量过干涉"不许拿绿，也不许为"健康默认 preset"降标准）。
    至少在有一门真 pass 且没有任何 fail/error/degraded/skipped 时才给 pass；
    一门都没有（空包）也一律 degraded —— "什么都没查"不给通过结论。
    """
    if any(s in ("fail", "error") for s in states):
        return "fail"
    if any(s in ("degraded", "skipped") for s in states):
        return "degraded"
    if not any(s == "pass" for s in states):
        return "degraded"
```

</details>

**依据 3 · 源码核查**：[README.md:178-183](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/5175b2b904d94ca0870e55fec818323f84dbdd91/README.md#L178-L183)

doctor 对连接的说明。

```text
| Symptom | What to do |
|---|---|
| doctor does not return kind equal to ok | Check that Blender is running and the addon is connected. For the GUI route this is the only valid acceptance check. |
| No GUI is available | Use the persistent worker fallback: start a worker, then run code and request a frame. |
| Another session is writing to the same scene | Take the write lease with blender_viewport, or use separate headless workers for parallel work. |
| An old MCP for Blender / blender_mcp addon is still enabled | Disable it (uninstalling is not required) and use the bundled DSH Blender Bridge addon; both compete for 127.0.0.1:9876. |
```

#### 缺口

- 未验证预设规则、场景与真实交付
  **影响**：不能证明 pass 等于完整正确
  **进一步探讨**：设计含缺失来源、错误拓扑和视觉瑕疵的样本并对照人工验收。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装与有状态操作有哪些成本和退路？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要兼容 DSH、Blender 和对应 addon，GUI 与持久无头模式有不同环境要求。Python 可以修改场景及本机文件；等待中断后仍可能执行，快照或 undo 不保证撤销所有外部作用。首次需备份场景并配置桥接，持续承担模型、渲染和人工审阅成本；异常先查询任务与核对文件，再决定恢复。退出可关闭通道并保留可回滚副本，但完整卸载及所有后台进程未验证。

#### 证据与依据

**依据 1 · 源码核查**：[SECURITY.md:18-25](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/5175b2b904d94ca0870e55fec818323f84dbdd91/SECURITY.md#L18-L25)

作者列出 Python、本地进程、网络及文件作用面。

```text
这个插件**按设计**就会执行代码并启动进程，不是只读的数据插件：

| 面 | 说明 |
|---|---|
| Blender 侧 Python | `blender_rt_do` / `blender_rt_headless` / `blender_rt_worker` / `blender_rt_plan` 等会把调用方给的 Python 交给 Blender 的 `bpy` 执行；`K` 是跨调用保留的持久内核 |
| 本地进程 | 会 spawn 后端 `node runtime/server.mjs`、无头 `blender -b`、以及 `runtime/ext/` 下的外部校验器（glTF-Validator / open3d）；必要时用 `SIGTERM`→`SIGKILL` 清残留后端 |
| 本地网络 | 后端只监听 `127.0.0.1`（默认 9877）；与 Blender addon 走 `127.0.0.1:9876` 的 TCP。**没有**外呼遥测 |
| 文件读写 | 默认工作目录 `~/.dsh-blender-rt`（可用 `DSH_BLENDER_*` 环境变量或包根 `dsh-blender.config.json` 覆盖）：渲染产物、日志、作业台账 |
```

**依据 2 · 源码核查**：[src/index.ts:474-482](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/5175b2b904d94ca0870e55fec818323f84dbdd91/src/index.ts#L474-L482)

等待取消不保证服务端停止。

```text
/** 宿主取消（exec.signal abort）时的统一措辞：只说"等待被取消"，不谎称任务失败 */
const ABORT_HINT = '宿主取消了本次等待（exec.signal 已 abort：用户打断或 per-tool 截止）。'
  + '服务端任务可能仍在跑 —— 长任务请用 blender_rt_job 并按 runId 回收；'
  + '本插件的内部超时通常先于宿主截止触发，正常情况看到的是上面这类可读错误。'

/**
 * v0.9.2：合并「本插件内部超时」与「宿主 exec.signal」。
 * 两条都只影响**等待**：服务端已开始的 Blender 侧任务照旧跑完（headless/job 既有语义
 * = 客户端断连 ≠ 任务失败，按 runId 回收）。
```

**依据 3 · 源码核查**：[README.md:178-183](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/5175b2b904d94ca0870e55fec818323f84dbdd91/README.md#L178-L183)

连接、worker 与写租约说明。

```text
| Symptom | What to do |
|---|---|
| doctor does not return kind equal to ok | Check that Blender is running and the addon is connected. For the GUI route this is the only valid acceptance check. |
| No GUI is available | Use the persistent worker fallback: start a worker, then run code and request a frame. |
| Another session is writing to the same scene | Take the write lease with blender_viewport, or use separate headless workers for parallel work. |
| An old MCP for Blender / blender_mcp addon is still enabled | Disable it (uninstalling is not required) and use the bundled DSH Blender Bridge addon; both compete for 127.0.0.1:9876. |
```

#### 缺口

- 未测性能、进程清理与恢复
  **影响**：无法估计净成本或保证完全回滚
  **进一步探讨**：隔离复制场景测试执行、作业回收和文件恢复。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何降低中断后未知结果？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

项目已有任务 ID、写租约、文件快照和 gate，因此单独新增快照或状态查询不是新机制。未验证方案是在有副作用的模型修改前保存包含目标与场景版本的操作票据，并在超时后先比对场景与 job 状态再允许人工选择重试或恢复。外部资源仍无法由场景快照完整撤销；对照现有 job/txn 模拟超时、崩溃与并发编辑，测重复修改、误恢复、额外存储和人工时；无明显改善或误伤过大则否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:474-482](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/5175b2b904d94ca0870e55fec818323f84dbdd91/src/index.ts#L474-L482)

取消与 runId 指引。

```text
/** 宿主取消（exec.signal abort）时的统一措辞：只说"等待被取消"，不谎称任务失败 */
const ABORT_HINT = '宿主取消了本次等待（exec.signal 已 abort：用户打断或 per-tool 截止）。'
  + '服务端任务可能仍在跑 —— 长任务请用 blender_rt_job 并按 runId 回收；'
  + '本插件的内部超时通常先于宿主截止触发，正常情况看到的是上面这类可读错误。'

/**
 * v0.9.2：合并「本插件内部超时」与「宿主 exec.signal」。
 * 两条都只影响**等待**：服务端已开始的 Blender 侧任务照旧跑完（headless/job 既有语义
 * = 客户端断连 ≠ 任务失败，按 runId 回收）。
```

**依据 2 · 源码核查**：[README.md:141-153](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/5175b2b904d94ca0870e55fec818323f84dbdd91/README.md#L141-L153)

已有 job 与事务入口。

<details>
<summary>查看原文（13行）</summary>

```text
### Automation and jobs

| Tool | What it gives you |
|---|---|
| blender_rt_headless | Runs a standalone Blender background process for batch work, validation, or rendering. |
| blender_rt_job | Starts long work in the background and collects the result by job id; a timeout does not lose the result. |
| blender_rt_loop | Runs a parameter search loop inside Blender and returns the best candidates. |

### Scene utilities

| Tool | What it gives you |
|---|---|
| blender_rt_txn | File-level snapshots and object-level marks for rollback. |
```

</details>

**依据 3 · 源码核查**：[runtime/gate.py:480-493](https://github.com/sixtysevenlf/dsh-blender-plugin/blob/5175b2b904d94ca0870e55fec818323f84dbdd91/runtime/gate.py#L480-L493)

已有验收状态。

<details>
<summary>查看原文（14行）</summary>

```text
def _aggregate(states):
    """整包三态（v3 · F8 收紧）：任一 fail/error ⇒ fail；否则任一 **degraded 或 skipped** ⇒ degraded；否则 pass。

    最小修（Lead 决议）：**任一门 skipped 或 degraded 都导致顶层 degraded，fail 优先** ——
    旧口径 `pass + skipped = pass` 被否决（"没量过干涉"不许拿绿，也不许为"健康默认 preset"降标准）。
    至少在有一门真 pass 且没有任何 fail/error/degraded/skipped 时才给 pass；
    一门都没有（空包）也一律 degraded —— "什么都没查"不给通过结论。
    """
    if any(s in ("fail", "error") for s in states):
        return "fail"
    if any(s in ("degraded", "skipped") for s in states):
        return "degraded"
    if not any(s == "pass" for s in states):
        return "degraded"
```

</details>

#### 缺口

- 票据方案和故障实验未实现
  **影响**：不能保证幂等或完整回滚
  **进一步探讨**：隔离场景注入超时和并发编辑并核对所有外部文件。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
