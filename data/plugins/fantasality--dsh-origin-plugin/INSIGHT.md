# DSH Origin Plugin

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[fefeca7](https://github.com/Fantasality/dsh-origin-plugin/tree/fefeca7de2be9f499887948ecee308bbe7dd0f92)

<!-- BEGIN META -->
[![GitHub ★ 44](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=44&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Fantasality/dsh-origin-plugin) [![npm 30d 3,066](https://img.shields.io/static/v1?label=npm+30d&message=3%2C066&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-origin-plugin) [![最新发布 2026-09-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-origin-plugin)
<!-- END META -->

> **功能**：通过 MCP 驱动 Windows 上的 Origin，从实验数据生成图、反读属性，并交付可继续编辑的工程。

> **亮点**：[Q01](#research-q01) 将计划、图页操作与可编辑工程交付串在 DSH 的同一会话。[Q03](#research-q03) 可按图属性和逐文件结果核对交付。

> **主要限制**：[Q02](#research-q02) 计划哈希检查陈旧，用户确认仍由调用流程负责。[Q03](#research-q03) 图验证通过可能含不可读项，部分文件失败时顶层仍可能返回 ok。

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
  - [Q01 · 怎样在 DSH 里把实验数据做成同事可继续编辑的 Origin 图？](#detail-section-11)
  - [Q02 · 计划哈希能覆盖哪些错误，用户确认和失败重试还要如何处理？](#detail-section-12)
  - [Q03 · 反读和可编辑文件分别能证明什么？](#detail-section-13)
  - [Q04 · 什么条件下值得试一张可编辑实验图？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：实验人员用同一张小型实验表出图，并让同事在 Origin 中继续编辑轴与曲线。

在原生 Origin 中导入相同数据、手工指定列角色和单位，再另存工程、导出图片与检查结果。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 实现 |
| --- | --- |
| 计划 | 缓存和哈希 |
| 绘图编辑 | Origin COM |
| 交付 | 图片、当前工程与可选数据 |

**流程与依赖**

| 依赖 | 职责 |
| --- | --- |
| DSH MCP Client | 启动 stdio 和提供模型工具 |
| Python 与 originpro/pywin32 | 运行服务并操作 COM |
| Windows 与有许可的 Origin | 打开和编辑原生工程 |

| 阶段 | 结果 |
| --- | --- |
| 计划 | 核对列、系列和单位 |
| 执行 | 操作工作表和图页 |
| 验收 | 查看逐项反读、预览与重开工程 |

**效果与成本**

| 环节 | 成本 |
| --- | --- |
| 首次 | 准备宿主、Python 和 Origin |
| 持续 | 核对读回与渲染，维护 COM 环境 |
| 失败 | 清点部分产物和工程状态，必要时原生重做 |

| 对象 | 增量 |
| --- | --- |
| 实验人员 | 将绘图和导出放入同一次对话 |
| 协作者 | 可重开编辑工程并逐项核对图属性 |

> **思考**：[Q02](#research-q02) 计划哈希检查陈旧，用户确认仍由调用流程负责。[Q03](#research-q03) 图验证通过可能含不可读项，部分文件失败时顶层仍可能返回 ok。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将计划、图页操作与可编辑工程交付串在 DSH 的同一会话。[Q03](#research-q03) 可按图属性和逐文件结果核对交付。

MCP 注册从目录映射实际函数，COM 调用入专用线程。计划哈希、反读状态和逐文件交付分别处理不同环节的错误。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 计划哈希检查陈旧，用户确认仍由调用流程负责。[Q03](#research-q03) 图验证通过可能含不可读项，部分文件失败时顶层仍可能返回 ok。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 已有 Origin 环境时先试一份无敏感数据的 CSV 和独立工程。读回不清或工程无法重开就回原生 Origin 手工核对。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

partial

- 已检查：作者 README、包清单、源码路径 .github/workflows/ci.yml、README.md、cordis.patch.yml、index.js、origin_engine.py、origin_mcp_server.py、origin_plan.py、origin_proof.py、origin_verify.py、pyproject.toml、skills/origin-plotting/SKILL.md、tests/test_live.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交 fefeca7de2be9f499887948ecee308bbe7dd0f92 的源码级研究，Windows 与 Origin 版本兼容性以实际测试为准。
- 下一步：本轮未安装或执行目标代码。需真机重开 OPJU，核对系列数据和渲染，另测过期计划、模态超时和部分交付。

**分析版本**

- **仓库**：[Fantasality/dsh-origin-plugin](https://github.com/Fantasality/dsh-origin-plugin)
- **版本号**：2.7.3（[固定提交 fefeca7](https://github.com/Fantasality/dsh-origin-plugin/tree/fefeca7de2be9f499887948ecee308bbe7dd0f92)）
- **版本日期**：2026-10-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 先确认轴和单位再做独立验收，可能降低错列或错单位交付。用同一实验表和故意错配做手工对照。

本轮未安装或执行目标代码。需真机重开 OPJU，核对系列数据和渲染，另测过期计划、模态超时和部分交付。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 16 | 3468 | — | — | 46718 |
| .mjs | source | 4 | 356 | 271 | 54 | — |
| .js | source | 1 | 82 | 38 | 39 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-10），可前往 [GitHub Issues](https://github.com/Fantasality/dsh-origin-plugin/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：实验人员能否用固定版本从明确列语义生成可编辑的 Origin 图，独立验收数据、画面和工程？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 怎样在 DSH 里把实验数据做成同事可继续编辑的 Origin 图？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

实验人员希望把小组对照数据做成双曲线图，并交给同事改线型或轴范围。合格输出有带单位的横纵轴、正确系列和可重新打开编辑的工程。手工用 Origin 导入、作图、核验和另存即可完成；插件增量是把操作顺序交给 DSH 会话执行，模型能够连续调用同一 MCP 后端的计划、编辑和交付工具。

Cordis 实际以 mcp-origin 条目启动 Python stdio 服务，另挂 JS bundle 入口用于宿主可见性。Python 从工具目录与实际可调用函数构造注册表。仓库携带绘图 Skill，区分直接出图和先规划确认再交付的流程。固定包描述和 JS 元数据对工具数量口径不同，实际可见能力依注册表和宿主查询。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:60-85](https://github.com/Fantasality/dsh-origin-plugin/blob/fefeca7de2be9f499887948ecee308bbe7dd0f92/cordis.patch.yml#L60-L85)

stdio 与独立 bundle 注册。

<details>
<summary>查看原文（26行）</summary>

```text
- insert:
    - id: mcp-origin
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: origin
        transport: stdio
        command: python
        args:
          - '-u'
          - '-X'
          - utf8
          - !!js (process.env.DSH_HOME || (String(process.env.USERPROFILE) + '/.dsh')) + '/profiles/web/node_modules/dsh-origin-plugin/origin_mcp_server.py'
        cwd: !!js (process.env.DSH_HOME || (String(process.env.USERPROFILE) + '/.dsh')) + '/profiles/web/node_modules/dsh-origin-plugin'
        env:
          PYTHONIOENCODING: utf-8
          PYTHONUNBUFFERED: '1'
        failOnStartupError: false
        toolCallTimeoutMs: 120000
    # Self-mount: a no-op fiber so the plugin market reads this bundle as
    # "live/active" (verify.js liveIncludes checks for the package name in the
    # loader entry-name set). Without this row the only entry name is
    # @deepseek-ai/dsh-mcp-client, so liveIncludes('dsh-origin-plugin')=false
    # and the market perpetually shows "restart to apply" even after restart.
    # apply() in index.js is a no-op; the real tools come from mcp-origin above.
    - id: dsh-origin-plugin
      name: dsh-origin-plugin
```

</details>

**依据 2 · 源码核查**：[index.js:33-43](https://github.com/Fantasality/dsh-origin-plugin/blob/fefeca7de2be9f499887948ecee308bbe7dd0f92/index.js#L33-L43)

JS 描述及 Python 服务定位。

<details>
<summary>查看原文（11行）</summary>

```text
/** Static descriptor of this DSH bundle (kept in sync with package.json). */
export const plugin = {
  name: pkg.name,
  version: pkg.version,
  kind: 'python-mcp-bundle',
  server: 'origin_mcp_server.py',
  loader: 'mcp-origin (@deepseek-ai/dsh-mcp-client, stdio)',
  layout: '28 MCP tools · styled plots · inline preview · stats batch',
  note: 'Wired into DSH by cordis.patch.yml; main/exports exist so the plugin ' +
    'market recognizes a prebuilt artifact instead of a build-required checkout.',
}
```

</details>

**依据 3 · 源码核查**：[origin_mcp_server.py:1788-1811](https://github.com/Fantasality/dsh-origin-plugin/blob/fefeca7de2be9f499887948ecee308bbe7dd0f92/origin_mcp_server.py#L1788-L1811)

从目录与可调用函数生成注册表。

<details>
<summary>查看原文（24行）</summary>

```text
def _build_tool_registry():
    """从 TOOL_CATALOG + 本模块全局函数构建同步分发注册表（name→meta+fn）。"""
    import inspect
    registry = {}
    for entry in TOOL_CATALOG:
        name = entry["name"]
        fn = globals().get(name)
        if not callable(fn):
            continue
        sig = inspect.signature(fn)
        properties = {}
        required = []
        for pname, param in sig.parameters.items():
            ann = param.annotation if param.annotation is not inspect.Parameter.empty else str
            properties[pname] = {"type": _infer_json_type(ann)}
            if param.default is inspect.Parameter.empty:
                required.append(pname)
        doc = (fn.__doc__ or entry.get("desc", "") or "").strip()
        registry[name] = {
            "name": name,
            "description": doc,
            "inputSchema": {"type": "object", "properties": properties, "required": required},
        }
    return registry
```

</details>

**依据 4 · 作者声明**：[skills/origin-plotting/SKILL.md:7-18](https://github.com/Fantasality/dsh-origin-plugin/blob/fefeca7de2be9f499887948ecee308bbe7dd0f92/skills/origin-plotting/SKILL.md#L7-L18)

技能规定快路径与正式路径。

<details>
<summary>查看原文（12行）</summary>

```text
# Origin SOP v2.3.0（决策流驱动；工具挂在步骤下，按序调用）

## 宿主注入的默认规范（systemPrompt 已带；没有时你按此执行）
- 折线/散点默认 `plot_type="line_symbol"`；未指定导出参数时 `fmt="png"`, `width=1200`。
- 投稿/发表图默认 `style_mode="journal"`（单栏 89mm / 双栏 183mm），导出 `width>=1800`。
- 轴标题必须语义化：物理量 + 单位（`temperature_C` → "Temperature (°C)"），拒绝 A/B/C 占位名。
- 多组对比 / 列语义不明 / 发表级图：**强制** `origin_plot_plan` → 用户确认 → `origin_execute_plan`（见 STEP 3）。

## 快速路径 vs 正式路径（先选路，再动手）
- **快速路径**（数据语义明确、临时查看）：`origin_plot_file` / `origin_load_file`+`origin_plot`，一次调用出图。
- **正式路径**（发表级 / 多组对比 / 列语义不明 / 用户没说清）：`origin_plot_plan` → 向用户确认 questions → `origin_execute_plan` → `origin_verify_graph` → `origin_export_delivery`。
- 想不起调用链 → `origin_cookbook`（离线秒回：quick_plot/from_file/journal/multi_compare/edit/fit/recover/deliver 八场景 + 高频工具推荐默认参数）。
```

</details>

**依据 5 · 源码核查**：[origin_mcp_server.py:983-1016](https://github.com/Fantasality/dsh-origin-plugin/blob/fefeca7de2be9f499887948ecee308bbe7dd0f92/origin_mcp_server.py#L983-L1016)

保存当前工程与交付多文件入口。

<details>
<summary>查看原文（34行）</summary>

```text
def origin_save_project(path: str) -> dict:
    """保存当前 Origin 项目为可编辑 OPJU（正式交付物，可在 Origin 中继续编辑）。

    保存的是当前项目全部页面（工作簿+图页）；省略扩展名自动补 .opju。
    """
    return engine.save_project(path)


@mcp.tool()
def origin_export_delivery(graph: str, source_path: str = "",
                           output_dir: str = "", fmts: str = "png,pdf",
                           width: int = 1200, save_opju: bool = True,
                           report_text: str = "",
                           export_data_csv: bool = True) -> dict:
    """一键交付：建规整目录收纳图片 + 可编辑 OPJU 并逐文件核验。

    传 source_path 时在源数据文件同级新建 <数据名>_Origin_<时间戳>/ 目录
    （不覆盖原始数据）；否则用 output_dir 或默认输出目录。原始数据只读。

    Args:
        graph: 图短名。
        source_path: 源数据文件路径（决定交付目录位置，推荐）。
        output_dir: 显式指定输出目录（与 source_path 二选一）。
        fmts: 逗号分隔格式，如 "png,pdf,tif"。
        save_opju: 是否同时保存 OPJU（默认 true）。
    Returns:
        {"ok": true, "delivery_dir": ..., "files": [{format,file,size,ok}],
         "opju": ..., "issues": [...], "all_ok": bool}
    """
    return engine.export_delivery(graph, source_path=source_path or None,
                                  output_dir=output_dir or None, fmts=fmts,
                                  width=width, save_opju=save_opju,
                                  report_text=report_text or None,
                                  export_data_csv=export_data_csv)
```

</details>

#### 缺口

- 未连接固定版本宿主
  **影响**：无法确认特定 DSH profile 的实际工具和 Skill 可见性
  **进一步探讨**：在有 Origin 的主机核对 MCP initialize、tools/list 和调用入口

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 计划哈希能覆盖哪些错误，用户确认和失败重试还要如何处理？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

执行前按缓存数据及参数重算计划哈希，拒绝不一致，调用者给了 expect_hash 才核对其持有的哈希。服务还检查缓存是否有更新的同签名计划；force 仅跳过此项。计划 ID 依赖服务内缓存，重启后须重新生成。Skill 要求歧义或投稿图先问用户，服务实际仍会执行并附 confirmation_reminder，确认属于流程纪律。

COM 调用入专用线程，超时后看门狗尝试处理模态窗口，并可能返回阻塞错误。源码明确旧调用仍可能卡在 Origin 内，当前失败响应无法确认该调用此后是否修改工作表。遇到超时先读实际工作簿、图页及导出状态，再决定重试，避免用错误的列映射或重复修改同一项目。

#### 证据与依据

**依据 1 · 源码核查**：[origin_plan.py:275-313](https://github.com/Fantasality/dsh-origin-plugin/blob/fefeca7de2be9f499887948ecee308bbe7dd0f92/origin_plan.py#L275-L313)

缓存完整性、可选期望哈希和同签名新计划检测。

<details>
<summary>查看原文（39行）</summary>

```text
def check_stale(plan, expect_hash=None, force=False):
    """execute 前的陈旧校验（#7）。

    - 完整性：按缓存数据重算内容哈希，与 plan_id 不符 => plan_stale；
    - expect_hash：调用方持有的 plan_hash 与该计划不符 => plan_stale；
    - 更新计划：缓存中存在同签名、更晚生成的计划且未 force => plan_stale
      （模型在重新 plan 之后仍执行旧 plan_id 的典型失误）。

    通过返回 None；不通过返回 fail("plan_stale", ...) 结构。
    """
    try:
        recomputed = _plan_hash(plan["data"]["columns"], plan["params"])
    except Exception as e:
        return oerr.fail("plan_stale", f"计划完整性校验异常: {e}")
    if recomputed != plan.get("plan_id"):
        return oerr.fail(
            "plan_stale",
            "计划内容校验失败：缓存数据与 plan_id 不一致（版本不兼容或缓存被污染）",
            plan_id=plan.get("plan_id"),
            next_actions=["重新调用 origin_plot_plan 生成新计划并执行新 plan_id"])
    if expect_hash and str(expect_hash) != str(plan.get("plan_hash")):
        return oerr.fail(
            "plan_stale",
            f"传入的 plan_hash {expect_hash} 与计划 {plan.get('plan_hash')} 不匹配："
            "你持有的计划已过期（数据或列映射已变化）",
            plan_id=plan.get("plan_id"), expected_hash=str(plan.get("plan_hash")),
            next_actions=["重新 origin_plot_plan（数据/映射已变）",
                          "确认新返回的 plan_hash 后再 origin_execute_plan"])
    if not force:
        newer = _newer_same_signature(plan)
        if newer:
            return oerr.fail(
                "plan_stale",
                "检测到同签名（同图型/标题/角色）的更新计划：数据或映射在生成该计划后"
                "又重新 plan 过，执行旧计划会画过时数据",
                plan_id=plan.get("plan_id"), newer_plan=newer,
                next_actions=["改用 newer_plan_id 执行最新计划",
                              "确认确实要执行旧计划时传 force=true 豁免"])
    return None
```

</details>

**依据 2 · 源码核查**：[origin_mcp_server.py:713-731](https://github.com/Fantasality/dsh-origin-plugin/blob/fefeca7de2be9f499887948ecee308bbe7dd0f92/origin_mcp_server.py#L713-L731)

执行接口及缓存、force 和提醒契约。

<details>
<summary>查看原文（19行）</summary>

```text
def origin_execute_plan(plan_id: str, fmt: str = "", file_path: str = "",
                        graph_name: str = "", width: int = 1200,
                        expect_hash: str = "", force: bool = False) -> dict:
    """按 plan_id 执行绘图计划：写数 -> 画图 -> 导出。

    Args:
        plan_id: origin_plot_plan 返回的计划 ID（服务端缓存，重启失效）。
        fmt / file_path / graph_name / width: 可选，覆盖计划中的对应参数。
        expect_hash: 可选，传入 origin_plot_plan 返回的 plan_hash 做陈旧校验；
            数据/映射变化后不匹配会返回 plan_stale。
        force: 数据/映射变更检测到更新的同签名计划时，force=true 可强制执行旧计划。
    Returns:
        {"ok": true, "file": ..., "graph": ..., "worksheet": ..., "plan_id": ...}
        计划含未确认 questions 时附带 confirmation_reminder 提醒。
    """
    return engine.execute_plan(plan_id, fmt=fmt or None,
                               file_path=file_path or None,
                               graph_name=graph_name or None, width=width,
                               expect_hash=expect_hash or None, force=force)
```

</details>

**依据 3 · 源码核查**：[origin_engine.py:4766-4818](https://github.com/Fantasality/dsh-origin-plugin/blob/fefeca7de2be9f499887948ecee308bbe7dd0f92/origin_engine.py#L4766-L4818)

实际绘图写入和确认提醒时机。

<details>
<summary>查看原文（53行）</summary>

```text
def _execute_plan_impl(plan_id, fmt=None, file_path=None, graph_name=None,
                       width=1200, expect_hash=None, force=False):
    try:
        import origin_plan as oplan
        plan = oplan.get_plan(plan_id)
        if plan is None:
            return oerr.fail("plan_not_found",
                             f"plan_id 不存在或已过期（服务端缓存容量 "
                             f"{oplan.PLAN_CACHE_MAX}，重启后清空）",
                             hint="重新调用 origin_plot_plan 生成")
        # 计划陈旧校验（#7）：缓存完整性 / plan_hash 匹配 / 是否有更新的同签名计划
        stale = oplan.check_stale(plan, expect_hash=expect_hash, force=force)
        if stale is not None:
            return stale
        p = plan["params"]
        roles = plan["roles"]
        columns = dict(plan["data"]["columns"])
        x_col = roles.get("x")
        if x_col is None:
            # 无单调 X 候选：生成行号列作 X（计划流已向用户提示）
            n = plan["data"]["n_rows"]
            columns = {"row_index": [float(i + 1) for i in range(n)], **columns}
            x_col = "row_index"
        r1 = _write_data_impl(columns)
        if not r1.get("ok"):
            return r1
        r2 = _plot_impl(r1["worksheet"], y_columns=roles.get("y"),
                        x_column=x_col, plot_type=p.get("plot_type") or "line",
                        yerr_column=roles.get("yerr"),
                        graph_name=graph_name or p.get("graph_name"),
                        title=p.get("title"),
                        style_mode=p.get("style_mode") or "default",
                        family=p.get("family"))
        if not r2.get("ok"):
            return r2
        r3 = _export_impl(r2["graph"], file_path=file_path or p.get("file_path"),
                          fmt=fmt or p.get("fmt") or "png", width=width)
        if r3.get("ok"):
            r3["worksheet"] = r1.get("worksheet")
            r3["graph"] = r2.get("graph")
            r3["plan_id"] = plan["plan_id"]
            r3["style"] = r2.get("style")
        if plan.get("questions"):
            r3["confirmation_reminder"] = (
                "该计划存在待确认项，执行前应已获得用户确认："
                + json.dumps(plan["questions"], ensure_ascii=False))
        return r3
    except Exception as e:
        return oerr.from_exception(e, trace=traceback.format_exc(limit=3))


# ---------------------------------------------------------------------------
# 版本能力握手（P1）：origin_status 暴露版本/已知坑/特性可用性
```

</details>

**依据 4 · 源码核查**：[origin_engine.py:287-342](https://github.com/Fantasality/dsh-origin-plugin/blob/fefeca7de2be9f499887948ecee308bbe7dd0f92/origin_engine.py#L287-L342)

COM 线程队列和两阶段超时。

<details>
<summary>查看原文（56行）</summary>

```text
def _run_on_com_thread(fn, *args, **kwargs):
    """把 fn 投递到专用 COM 线程执行并等待结果（线程安全，可被并发调用）。

    P0-1 看门狗（2026-09-16）：软超时后枚举 Origin 模态对话框并自动点击
    白名单按钮（OK/确定/取消类）；解除阻塞则正常返回并附
    watchdog_dismissed；仍未解除则硬超时——重建 COM 线程自愈，返回
    com_blocked_by_dialog 错误（含最后看到的对话框标题）。
    """
    global _com_thread
    if _com_thread is None or not _com_thread.is_alive():
        t = threading.Thread(target=_com_thread_loop, name="origin-com", daemon=True)
        t.start()
        _com_thread = t
    done = _TaskResult()
    _com_queue.put((fn, args, kwargs, done))
    # 阶段 1：软超时内正常等待
    if done.wait(timeout=_watchdog_timeout_secs()):
        return done.value
    # 阶段 2：看门狗——尝试点掉 Origin 的模态对话框
    dismissed = _watchdog_dismiss_modals()
    if done.wait(timeout=_watchdog_grace_secs()):
        v = done.value
        # 恢复正常：原结果附加看门狗信息（dict 与 connect 的 (bool, dict) 都覆盖）
        note = (f"本次调用曾被 Origin 模态对话框阻塞，看门狗已自动解除: {dismissed}")
        if isinstance(v, dict):
            v["watchdog_dismissed"] = dismissed
            v["warning"] = (v.get("warning") + "；" if v.get("warning") else "") + note
        elif (isinstance(v, tuple) and len(v) == 2 and isinstance(v[1], dict)):
            v[1]["watchdog_dismissed"] = dismissed
            v[1]["warning"] = ((v[1].get("warning") or "") + "；"
                               if v[1].get("warning") else "") + note
        return v
    # 阶段 3：硬超时——看门狗无效。旧 COM 线程仍堵在 Origin 内部调用上，
    # 只有 Origin 进程结束该调用才会异常返回（随后队列自愈继续）。
    titles = [d.get("title", "?") for d in dismissed]
    if _autokill_enabled():
        # isolated 会话（或显式开启）：Origin 视为自动化残留，直接清理，
        # COM 线程的下一次队列任务会收到异常并继续——系统自愈。
        kill = _kill_residual_origin(wait_seconds=2.0)
        return oerr.fail(
            "com_blocked_by_dialog",
            f"COM 调用被 Origin 模态对话框阻塞超过 "
            f"{_watchdog_timeout_secs():.0f}+{_watchdog_grace_secs():.0f} 秒，"
            f"看门狗未能解除（发现对话框: {titles or '未枚举到'}）。"
            f"已按 isolated 策略自动清理 Origin（killed={kill.get('killed')}），"
            "请重试；Origin 将以干净状态重连。",
            watchdog={"dismissed": dismissed, "autokill": kill},
            timeout_s=_watchdog_timeout_secs() + _watchdog_grace_secs())
    return oerr.fail(
        "com_blocked_by_dialog",
        f"COM 调用被 Origin 模态对话框阻塞超过 "
        f"{_watchdog_timeout_secs():.0f}+{_watchdog_grace_secs():.0f} 秒，"
        f"看门狗未能解除（发现对话框: {titles or '未枚举到'}）。"
        "请在 Origin 窗口手动关闭该对话框后原样重试；若 Origin 已无响应，"
        "taskkill /F /IM Origin64.exe 后重连。",
        watchdog={"dismissed": dismissed},
```

</details>

**依据 5 · 作者声明**：[skills/origin-plotting/SKILL.md:9-18](https://github.com/Fantasality/dsh-origin-plugin/blob/fefeca7de2be9f499887948ecee308bbe7dd0f92/skills/origin-plotting/SKILL.md#L9-L18)

正式流程要求先向用户确认。

<details>
<summary>查看原文（10行）</summary>

```text
## 宿主注入的默认规范（systemPrompt 已带；没有时你按此执行）
- 折线/散点默认 `plot_type="line_symbol"`；未指定导出参数时 `fmt="png"`, `width=1200`。
- 投稿/发表图默认 `style_mode="journal"`（单栏 89mm / 双栏 183mm），导出 `width>=1800`。
- 轴标题必须语义化：物理量 + 单位（`temperature_C` → "Temperature (°C)"），拒绝 A/B/C 占位名。
- 多组对比 / 列语义不明 / 发表级图：**强制** `origin_plot_plan` → 用户确认 → `origin_execute_plan`（见 STEP 3）。

## 快速路径 vs 正式路径（先选路，再动手）
- **快速路径**（数据语义明确、临时查看）：`origin_plot_file` / `origin_load_file`+`origin_plot`，一次调用出图。
- **正式路径**（发表级 / 多组对比 / 列语义不明 / 用户没说清）：`origin_plot_plan` → 向用户确认 questions → `origin_execute_plan` → `origin_verify_graph` → `origin_export_delivery`。
- 想不起调用链 → `origin_cookbook`（离线秒回：quick_plot/from_file/journal/multi_compare/edit/fit/recover/deliver 八场景 + 高频工具推荐默认参数）。
```

</details>

#### 缺口

- 未实测改映射后重试或 COM 超时恢复
  **影响**：无法确认具体 Origin 版本中旧任务何时停止
  **进一步探讨**：在独立工程制造旧哈希及软超时并清点最终文件和图页

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 反读和可编辑文件分别能证明什么？

**研究主题**：贡献与相对优势、工程质量与复用、缺陷与关键质疑

#### 完整回答

交付函数逐格式写文件，另存当前 Origin 项目，可附 CSV 和报告。保存范围是当前整个工程，因此试用应先用空工程或工程副本。CSV 路径在图层中找到第一个关联工作表后就停止查找，复杂图不宜把它当成全部图层的数据清单。顶层交付 ok 与 all_ok 分开，继续读 issues 和逐文件状态。

图属性核验把失败、警告和不可读分别计数，passed 只代表没有 fail。写后 proof_level 由结构化字段推断，单项 applied 且 readback_verified 可能在继续扫描其他决策前直接返回 verified。因此要核对每条修改、unclear 列表和渲染预览；最终用 Origin 重开 OPJU 核对系列和单位，并与实验原始数据对照。

#### 证据与依据

**依据 1 · 源码核查**：[origin_mcp_server.py:983-988](https://github.com/Fantasality/dsh-origin-plugin/blob/fefeca7de2be9f499887948ecee308bbe7dd0f92/origin_mcp_server.py#L983-L988)

保存当前项目的所有页面。

```text
def origin_save_project(path: str) -> dict:
    """保存当前 Origin 项目为可编辑 OPJU（正式交付物，可在 Origin 中继续编辑）。

    保存的是当前项目全部页面（工作簿+图页）；省略扩展名自动补 .opju。
    """
    return engine.save_project(path)
```

**依据 2 · 源码核查**：[origin_engine.py:3895-3946](https://github.com/Fantasality/dsh-origin-plugin/blob/fefeca7de2be9f499887948ecee308bbe7dd0f92/origin_engine.py#L3895-L3946)

目录、格式导出与单文件状态。

<details>
<summary>查看原文（52行）</summary>

```text
def _export_delivery_impl(graph, source_path=None, output_dir=None, fmts="png,pdf",
                          width=1200, save_opju=True, report_text=None,
                          export_data_csv=True):
    """一键交付：源文件同级建 <数据名>_Origin_<时间戳>/ 目录，
    导出多格式图片 + OPJU + （v2.3.0 新增）图对应工作表数据 csv + 分析报告
    txt（图表一体交付），并逐文件核验完整性。"""
    try:
        ok, conn = _connect_impl()
        if not ok:
            return conn
        fmt_list = [f.strip().lower().lstrip(".") for f in str(fmts).split(",")
                    if f.strip()]
        fmt_list = ["tif" if f == "tiff" else f for f in fmt_list]
        bad = [f for f in fmt_list if f not in ("png", "svg", "pdf", "tif", "emf", "eps")]
        if bad:
            return oerr.fail("invalid_request", f"不支持的导出格式: {bad}",
                             supported=["png", "svg", "pdf", "tif", "emf", "eps"])
        gp = op_find_graph(graph)
        if not gp:
            return oerr.fail("graph_not_found", f"图不存在: {graph}", graph=str(graph))
        ts = time.strftime("%Y%m%d_%H%M%S")
        if source_path:
            src = os.path.abspath(str(source_path))
            _g = _path_guard(src, "交付源路径")
            if _g is not None:
                return _g
            stem = re.sub(r"[^\w\-.]", "_",
                          os.path.splitext(os.path.basename(src))[0])
            ddir = os.path.join(os.path.dirname(src), f"{stem}_Origin_{ts}")
        elif output_dir:
            ddir = os.path.abspath(str(output_dir))
        else:
            ddir = os.path.join(DEFAULT_OUTPUT_DIR, f"delivery_{ts}")
        os.makedirs(ddir, exist_ok=True)
        safe_g = re.sub(r"[^\w\-.]", "_", str(graph))
        files, issues = [], []
        for fmt in fmt_list:
            r = _export_impl(graph, file_path=os.path.join(ddir, f"{safe_g}.{fmt}"),
                             fmt=fmt, width=width)
            if r.get("ok"):
                entry = {"format": fmt, "file": r["file"], "size": r["size"],
                         "ok": True}
                if not os.path.exists(r["file"]) or r["size"] == 0:
                    entry["ok"] = False
                    issues.append(f"{fmt} 文件为空: {r['file']}")
            else:
                entry = {"format": fmt, "ok": False, "error": r.get("error")}
                issues.append(f"{fmt} 导出失败: {r.get('error')}")
            files.append(entry)
        opju = None
        if save_opju:
            r2 = _save_project_impl(os.path.join(ddir, f"{safe_g}_{ts}.opju"))
```

</details>

**依据 3 · 源码核查**：[origin_engine.py:3944-3989](https://github.com/Fantasality/dsh-origin-plugin/blob/fefeca7de2be9f499887948ecee308bbe7dd0f92/origin_engine.py#L3944-L3989)

项目保存和首个关联工作表的 CSV。

<details>
<summary>查看原文（46行）</summary>

```text
        opju = None
        if save_opju:
            r2 = _save_project_impl(os.path.join(ddir, f"{safe_g}_{ts}.opju"))
            if r2.get("ok"):
                opju = r2["file"]
            elif r2.get("error_code") == "manual_save_required":
                issues.append("OPJU 未自动保存（DSH_ORIGIN_NO_AUTO_SAVE=1 策略）："
                              "请在 Origin 窗口按 Ctrl+S 手动保存")
            else:
                issues.append(f"OPJU 保存失败: {r2.get('error')}")
        n_ok = sum(1 for f in files if f.get("ok"))
        # v2.3.0 图表一体交付：数据 csv + 分析报告 txt
        data_csv = None
        if export_data_csv:
            try:
                import csv as _csv
                gp_ = _origin_app.find_graph(graph)
                src_wks = None
                if gp_ is not None:
                    for li in range(int(gp_.obj.Layers.Count)):
                        src_wks = _find_wks_of_plot(gp_.__getitem__(li))
                        if src_wks is not None:
                            break
                if src_wks is not None:
                    ncol = int(src_wks.obj.Cols)
                    names = []
                    cols_data = []
                    for ci in range(ncol):
                        nm = None
                        try:
                            nm = src_wks.obj[ci].GetLongName() or f"col{ci + 1}"
                        except Exception:
                            nm = f"col{ci + 1}"
                        names.append(str(nm))
                        cols_data.append(src_wks.to_list(ci))
                    nrow = max((len(c) for c in cols_data), default=0)
                    data_csv = os.path.join(ddir, "data.csv")
                    with open(data_csv, "w", newline="", encoding="utf-8-sig") as fcsv:
                        wcsv = _csv.writer(fcsv)
                        wcsv.writerow(names)
                        for r_ in range(nrow):
                            wcsv.writerow([
                                c[r_] if r_ < len(c) else "" for c in cols_data])
            except Exception as _dc:
                issues.append(f"数据 csv 导出失败: {_dc}")
                data_csv = None
```

</details>

**依据 4 · 源码核查**：[origin_engine.py:3990-4007](https://github.com/Fantasality/dsh-origin-plugin/blob/fefeca7de2be9f499887948ecee308bbe7dd0f92/origin_engine.py#L3990-L4007)

部分交付仍有顶层 ok，另返 issues/all_ok。

<details>
<summary>查看原文（18行）</summary>

```text
        report_txt = None
        if report_text:
            try:
                report_txt = os.path.join(ddir, "report.txt")
                with open(report_txt, "w", encoding="utf-8") as frt:
                    frt.write(str(report_text))
            except Exception as _rt:
                issues.append(f"报告 txt 写入失败: {_rt}")
                report_txt = None
        return oerr.ok(
            delivery_dir=ddir, files=files, opju=opju, issues=issues,
            data_csv=data_csv, report_txt=report_txt,
            all_ok=(not issues),
            detail=(f"交付目录 {ddir}（图片 {n_ok}/{len(files)} + "
                    f"{'OPJU' if opju else '无 OPJU'}"
                    f"{' + data.csv' if data_csv else ''}"
                    f"{' + report.txt' if report_txt else ''}）"
                    + ("；存在问题：" + "; ".join(issues) if issues else "")))
```

</details>

**依据 5 · 源码核查**：[origin_verify.py:310-353](https://github.com/Fantasality/dsh-origin-plugin/blob/fefeca7de2be9f499887948ecee308bbe7dd0f92/origin_verify.py#L310-L353)

不可读与失败区分，passed 仅按失败数。

<details>
<summary>查看原文（44行）</summary>

```text
    # --- 图例（LabTalk，需激活复核） ---
    if not activation_verified:
        add("legend", "unreadable",
            "图例状态需 LabTalk（legend.show），当前激活未复核 → 不判失败")
    else:
        legend = _lt_float(op, po, "legend.show")
        if legend is None:
            add("legend", "unreadable", "legend.show 不可读")
        else:
            visible = legend > 0
            exp_leg = expected.get("legend_visible")
            if exp_leg is True and not visible:
                add("legend", "fail", "期望显示图例，但 legend.show=0", value=legend)
            elif exp_leg is False and visible:
                add("legend", "warn", "期望隐藏图例，但 legend.show=1", value=legend)
            else:
                add("legend", "pass", f"图例{'可见' if visible else '隐藏'}", value=legend)

    # --- 交付文件完整性 ---
    for f in files or []:
        bn = os.path.basename(str(f))
        if os.path.exists(str(f)) and os.path.getsize(str(f)) > 0:
            add(f"file:{bn}", "pass", f"{bn} 存在且非空（{os.path.getsize(str(f))}B）")
        else:
            add(f"file:{bn}", "fail", f"{bn} 不存在或为空", path=str(f))

    n_fail = sum(1 for c in checks if c["status"] == "fail")
    n_unread = sum(1 for c in checks if c["status"] == "unreadable")
    n_warn = sum(1 for c in checks if c["status"] == "warn")
    n_unrel = sum(1 for c in checks if c["status"] == "unreliable")
    issues = [c for c in checks if c["status"] == "fail"]
    unclear = [c for c in checks if c["status"] in ("unreadable", "unreliable")]
    return oerr.ok(
        graph=short, checks=checks, issues=issues, unclear=unclear,
        passed=(n_fail == 0),
        n_pass=sum(1 for c in checks if c["status"] == "pass"),
        n_fail=n_fail, n_warn=n_warn, n_unreadable=n_unread, n_unreliable=n_unrel,
        context={"activation_verified": activation_verified,
                 "active_window": active_now,
                 "channels": "COM 作用域优先（窗口无关）；LabTalk 仅在激活复核通过后使用"},
        note=("只有 fail 项需要修复；unreadable/unreliable 是读不回来或上下文不可信，"
              "不代表图有问题"),
        detail=(f"确定性反读完成：{len(checks)} 项检查，{n_fail} fail / {n_warn} warn / "
                f"{n_unread} unreadable / {n_unrel} unreliable"))
```

</details>

**依据 6 · 源码核查**：[origin_proof.py:106-141](https://github.com/Fantasality/dsh-origin-plugin/blob/fefeca7de2be9f499887948ecee308bbe7dd0f92/origin_proof.py#L106-L141)

单项读回通过可提前返回，聚合标签有局限。

<details>
<summary>查看原文（36行）</summary>

```text
    # 5) 决策明细（style edit 等带 decisions 列表）
    decisions = r.get("decisions")
    if not isinstance(decisions, list):
        decisions = (r.get("style_plan") or {}).get("decisions")
    if isinstance(decisions, list) and decisions:
        any_rejected = False
        any_unverified = False
        any_applied = False
        for d in decisions:
            if not isinstance(d, dict):
                continue
            dec = d.get("decision")
            if dec == "rejected":
                any_rejected = True
            elif dec == "applied_unverified":
                any_unverified = True
            elif dec == "applied":
                any_applied = True
                if d.get("readback_verified"):
                    # 单个 applier 有可靠读回，升级该信息
                    return {"level": VERIFIED,
                            "note": f"字段 {d.get('field')} 写入后经读回核验一致"}
        if any_rejected:
            return {"level": UNVERIFIED,
                    "note": "存在 rejected 决策，整体不可采信，需逐项排查"}
        if any_unverified:
            return {"level": READBACK_ONLY,
                    "note": "含 applied_unverified 决策，通道不可靠，需目视确认"}
        if any_applied:
            return {"level": VERIFIED,
                    "note": "所有决策均为 applied 且已读回核验"}

    # 6) 仅声明成功/已应用但无读回
    if r.get("ok") is True or r.get("applied"):
        return {"level": UNVERIFIED,
                "note": "已应用但无读回通道，须 origin_view_graph 目视确认"}
```

</details>

#### 缺口

- 没有双图层、两工作表的实际交付和重开记录
  **影响**：无法确认数据清单、渲染与可编辑内容都对得上
  **进一步探讨**：重开含两个工作表的 OPJU，逐系列比较与渲染预览

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么条件下值得试一张可编辑实验图？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证、工程质量与复用

#### 完整回答

适合已具备 Windows、Origin 和许可的实验人员，使用无敏感数据的三列 CSV、独立工程与新交付目录。首次要准备 Python 3.10+、originpro/pywin32 和宿主 profile，先核对工具列表。持续成本来自保持 Origin/COM 可用以及核对列、曲线、预览和 OPJU；失败时保留原表和工程副本，若读回不清、部分导出失败或 COM 超时则回到原生 Origin 检查。已有离线 CI 和真机测试源码，后者缺运行中的 Origin 时跳过。

待验假设是让操作者在执行前确认轴和单位、执行后逐项看图和工程，可减少错列或错单位。将同一 CSV 分别交给手工流程和插件，记录准备、纠错、重新打开的时间，故意把 Y 列配置错一次，要求在交付前识别并生成正确的可编辑图。该用法仅评估一张图的正确性和回退路径。

#### 证据与依据

**依据 1 · 源码核查**：[pyproject.toml:5-28](https://github.com/Fantasality/dsh-origin-plugin/blob/fefeca7de2be9f499887948ecee308bbe7dd0f92/pyproject.toml#L5-L28)

Python、Windows 与自动化依赖。

<details>
<summary>查看原文（24行）</summary>

```text
[project]
name = "dsh-origin-plugin"
version = "2.7.3"
description = "DSH Origin Plugin: drive Origin scientific plotting from AI chat via MCP (60 tools; works standalone via stdio)"
readme = "README.md"
requires-python = ">=3.10"
license = { text = "MIT" }
authors = [{ name = "Fantasality" }]
keywords = ["origin", "originpro", "mcp", "scientific-plotting", "automation"]
classifiers = [
    "Programming Language :: Python :: 3",
    "Operating System :: Microsoft :: Windows",
    "Topic :: Scientific/Engineering :: Visualization",
]
dependencies = [
    "originpro",
    "pywin32",
    "numpy",
    "openpyxl",
    "pyyaml",
    "Pillow",
    "matplotlib",
    "python-pptx",
]
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:60-77](https://github.com/Fantasality/dsh-origin-plugin/blob/fefeca7de2be9f499887948ecee308bbe7dd0f92/cordis.patch.yml#L60-L77)

Host 默认 Python、cwd、超时和 failOnStartupError 配置。

<details>
<summary>查看原文（18行）</summary>

```text
- insert:
    - id: mcp-origin
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: origin
        transport: stdio
        command: python
        args:
          - '-u'
          - '-X'
          - utf8
          - !!js (process.env.DSH_HOME || (String(process.env.USERPROFILE) + '/.dsh')) + '/profiles/web/node_modules/dsh-origin-plugin/origin_mcp_server.py'
        cwd: !!js (process.env.DSH_HOME || (String(process.env.USERPROFILE) + '/.dsh')) + '/profiles/web/node_modules/dsh-origin-plugin'
        env:
          PYTHONIOENCODING: utf-8
          PYTHONUNBUFFERED: '1'
        failOnStartupError: false
        toolCallTimeoutMs: 120000
```

</details>

**依据 3 · 作者声明**：[README.md:24-29](https://github.com/Fantasality/dsh-origin-plugin/blob/fefeca7de2be9f499887948ecee308bbe7dd0f92/README.md#L24-L29)

作者声明目标宿主与 Origin 版本范围。

```text
| 🟢 **DSH 1024Store** | 已收录（DSH 桌面端市场来源） |
| 🟢 **PyPI** | 包已构建于 `dist/`，token 到位即发布 |

**适配**：Windows 10/11 · Origin/OriginPro 2021+（**2026 实测**）· Python 3.10+ ·
13 种 MCP 客户端 + 豆包/Cherry Studio/通义灵码等 UI 型客户端 · **纯本机 COM 通道，
数据不出本机、无外网依赖**。
```

**依据 4 · 源码核查**：[tests/test_live.py:13-26](https://github.com/Fantasality/dsh-origin-plugin/blob/fefeca7de2be9f499887948ecee308bbe7dd0f92/tests/test_live.py#L13-L26)

没有 originpro 或运行中的 Origin 时跳过。

<details>
<summary>查看原文（14行）</summary>

```text
pytest.importorskip("originpro", reason="需要 originpro（Origin 自动化包）")

_origin_running = False
try:
    import subprocess
    out = subprocess.run(
        ["tasklist", "/FI", "IMAGENAME eq Origin64.exe", "/FO", "CSV"],
        capture_output=True).stdout.decode("gbk", errors="replace")
    _origin_running = 'Origin64.exe' in out
except Exception:
    pass

if not _origin_running:
    pytest.skip("未检测到运行中的 Origin64.exe（真机集成测试跳过）",
```

</details>

**依据 5 · 源码核查**：[.github/workflows/ci.yml:30-43](https://github.com/Fantasality/dsh-origin-plugin/blob/fefeca7de2be9f499887948ecee308bbe7dd0f92/.github/workflows/ci.yml#L30-L43)

离线引擎、pytest 与 Skill 一致性检查。

<details>
<summary>查看原文（14行）</summary>

```text
      - name: Install deps
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt -q
          pip install pytest pyyaml pillow -q

      - name: Offline engine test
        run: python -X utf8 origin_mcp_server.py --offline-test

      - name: Pytest (live tests auto-skip without Origin)
        run: python -X utf8 -m pytest tests/ -q

      - name: Skill consistency (no phantom tools)
        run: python -X utf8 -c "import re,importlib.util,pathlib,sys;spec=importlib.util.spec_from_file_location('oms','origin_mcp_server.py');m=importlib.util.module_from_spec(spec);sys.modules['oms']=m;spec.loader.exec_module(m);names=set(m._build_tool_registry());
```

</details>

**依据 6 · 源码核查**：[origin_verify.py:328-346](https://github.com/Fantasality/dsh-origin-plugin/blob/fefeca7de2be9f499887948ecee308bbe7dd0f92/origin_verify.py#L328-L346)

可独立检查文件和图属性的判据。

<details>
<summary>查看原文（19行）</summary>

```text
    # --- 交付文件完整性 ---
    for f in files or []:
        bn = os.path.basename(str(f))
        if os.path.exists(str(f)) and os.path.getsize(str(f)) > 0:
            add(f"file:{bn}", "pass", f"{bn} 存在且非空（{os.path.getsize(str(f))}B）")
        else:
            add(f"file:{bn}", "fail", f"{bn} 不存在或为空", path=str(f))

    n_fail = sum(1 for c in checks if c["status"] == "fail")
    n_unread = sum(1 for c in checks if c["status"] == "unreadable")
    n_warn = sum(1 for c in checks if c["status"] == "warn")
    n_unrel = sum(1 for c in checks if c["status"] == "unreliable")
    issues = [c for c in checks if c["status"] == "fail"]
    unclear = [c for c in checks if c["status"] in ("unreadable", "unreliable")]
    return oerr.ok(
        graph=short, checks=checks, issues=issues, unclear=unclear,
        passed=(n_fail == 0),
        n_pass=sum(1 for c in checks if c["status"] == "pass"),
        n_fail=n_fail, n_warn=n_warn, n_unreadable=n_unread, n_unreliable=n_unrel,
```

</details>

#### 缺口

- 无本轮真机与对照耗时
  **影响**：无法推断团队节省多少时间或支持的部署矩阵
  **进一步探讨**：在已有许可的 Windows 试验环境完成同图对照

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
