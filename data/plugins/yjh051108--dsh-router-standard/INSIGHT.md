# DSH Router Standard

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[b39112d](https://github.com/yjh051108/dsh-router-standard/tree/b39112dce54b90e67b50b166c2773861d7945d1f)

<!-- BEGIN META -->
[![GitHub ★ 347](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=347&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/yjh051108/dsh-router-standard)
<!-- END META -->

> **功能**：以 Agent/Preset 和 Cordis 模块为软件任务分阶段展示、限制工具，并提供目录帮助、路由状态和交付证据清单检查。

> **亮点**：把阶段、可调工具和目录帮助集中在同一会话模块，并提供结构证据自检，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

> **主要限制**：推进看调用而非成功；restrict异常可开放，结构证据不证明语义，持久状态直写，见 [Q02](#research-q02)。

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
  - [Q01 · 当前主线如何做阶段工具披露，包描述是否仍准确？](#detail-section-11)
  - [Q02 · 阶段和交付门禁是行为约束还是已验证结果？](#detail-section-12)
  - [Q03 · 是否值得替换标准preset，如何验证生产方向？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：工具繁多的软件交付会话，用阶段减少急于执行并提示验证；用户仍需真实产物验收，见 [Q01](#research-q01)。

原生Standard preset直接工具目录/宿主权限，再加人工计划验收；当前是交付流程编排不是新权限沙箱。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 阶段 | 目录与工具restrict | Host服务/异常可能开放 |
| 元工具 | 目录/状态/推进 | 调用信号非成功保证 |
| 检查 | 文件/证据清单 | 不内置浏览器或验语义 |
| 保存 | stage JSON | 直接写、并发恢复待验 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配Host/preset相对模块/query | 必需 | Cordis入口加载 | 新旧文件不能混用 |
| systemPrompt/tools/llm与restrict/view | 必需 | 目录和阶段范围 | restrict异常可能开放 |
| 宿主工具/沙箱/审批 | 实际执行必需 | shell/编辑等 | preset不能替代权限 |
| 可写stage目录 | 恢复必需 | 会话进度 | 写失败log、读坏可回空 |
| 外部视觉/测试工具 | 视任务 | 真实验收 | 清单不自跑浏览器 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 安装 | 独立preset核v34入口 | 匹配Host/服务且可回退 |
| 路由 | 首轮phase_begin后逐阶段 | 核可见与可调事实 |
| 生产 | Agent用宿主工具交付 | 不越宿主权限 |
| 检查 | delivery_check+真实测试 | 分开FAIL/阶段推进/业务通过 |
| 退出 | 回原preset并保state | 不误删别的session进度 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Host/模型未知 | 独立preset/配置/state备份 | 未实装兼容 |
| 持续使用 | 元工具/轮次/token未知 | 阶段/工具归属/API维护 | 无净节省对照 |
| 失败恢复 | 重试/重载未知 | 查restrict/JSON/状态 | 非事务保存 |
| 退出 | stage留存未知 | 原preset与本会话state分管 | 不等全DSH目录清理 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 披露 | 工具目录和实际restrict | 匹配Host失败路径 |
| 验收 | 清单/文件/标记检查 | 语义正确与人工真复核 |
| 成本 | 阶段组织明确 | token/返工净减少 |

> **思考**：推进看调用而非成功；restrict异常可开放，结构证据不证明语义，持久状态直写，见 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把阶段、可调工具和目录帮助集中在同一会话模块，并提供结构证据自检，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

[Q02](#research-q02) 限制和同源runtime目录值得复用，结果驱动推进与原子state是下一步；不要给退役能力计分。

<a id="detail-section-5"></a>

### 1.4 主要限制

推进看调用而非成功；restrict异常可开放，结构证据不证明语义，持久状态直写，见 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先独立可回退小任务对照Standard，验FAIL/阶段分离及持久恢复，再扩大使用，见 [Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

当前v34主线入口与调用已核，退役PTC/压力/内置浏览器已排除；建议独立可回退任务有限试用。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、preset/router-standard/agent.cordis.yml、preset/router-standard/router-bootstrap-v34.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：四材料身份/固定版本一致，catalog无旧研究；追standard agent→v34入口与gate/restrict/state/推进；读react对照确认不同线，未全审spec/react、shell executor/所有memory shim，不执行目标。
- 下一步：未跑selftest/集成/Host；需实际工具失败/检查FAIL/坏状态/并发/重启和Standard同任务对照，不称节token或任务成功。

**分析版本**

- **仓库**：[yjh051108/dsh-router-standard](https://github.com/yjh051108/dsh-router-standard)
- **版本号**：0.3.0（[固定提交 b39112d](https://github.com/yjh051108/dsh-router-standard/tree/b39112dce54b90e67b50b166c2773861d7945d1f)）
- **版本日期**：2026-08-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

分开调用/通过/业务验收，推进绑定实际结果及稳定证据摘要并测错误晋级与返工，未实现，见 [Q03](#research-q03)。

未跑selftest/集成/Host；需实际工具失败/检查FAIL/坏状态/并发/重启和Standard同任务对照，不称节token或任务成功。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 13 | 2287 | — | — | 30622 |
| .mjs | source | 56 | 10541 | 7971 | 1961 | — |
| .mjs | test | 2 | 857 | 732 | 73 | — |
| .cjs | source | 1 | 129 | 82 | 32 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-29），可前往 [GitHub Issues](https://github.com/yjh051108/dsh-router-standard/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：当前版本入口的阶段限制能否与真实调用/结果/验收一致，是否比Standard降低错误而不增加过多流程？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 当前主线如何做阶段工具披露，包描述是否仍准确？

**研究主题**：场景与需求、功能与机制、贡献与相对优势、依赖、兼容与流程

#### 完整回答

固定根包dsh-router-standard0.3.0交付Agent/Preset组合及Cordis模块；主线router-standard/agent.cordis.yml明确引用router-bootstrap-v34.mjs?v=88，不能拿同名旧文件或归档react作为当前完整机制。面向软件交付中工具多、易急于执行的Agent会话，相对Standard直接给全目录，按对齐/计划/开发/验证展示与限制工具，元工具可查目录/帮助/路由状态。

实际首个模型请求只保留phase_begin和persona/plan，promoted后按stage安装restrict并提供runtimeCallable同源目录。当前README明确native直调、PTC/run_code和压力感应器已退役；delivery_check也不内置浏览器，只验外部视觉证据。因此package.description的PTC、压力感知、内置页面验证是陈旧概括，不能记为当前能力。角色/任务分类仍存在于spec/react线，不等主线训练出学习路由器。宿主sandbox/approval/model route由host-plane提供，preset不应冒充这些权限系统。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:2-4](https://github.com/yjh051108/dsh-router-standard/blob/b39112dce54b90e67b50b166c2773861d7945d1f/package.json#L2-L4)

版本与陈旧综合描述。

```text
  "name": "dsh-router-standard",
  "version": "0.3.0",
  "description": "Progressive tool disclosure router suite for DeepSeek Harness: stage-gated tool unlock + two-level catalog, PTC (run_code) base with staged SDK, memory/knowledge fusion, pressure sensing, built-in page verification (headless screenshot + console + selector + local JS engine).",
```

**依据 2 · 作者声明**：[README.md:21-28](https://github.com/yjh051108/dsh-router-standard/blob/b39112dce54b90e67b50b166c2773861d7945d1f/README.md#L21-L28)

作者明确当前native与退役能力。

```text
- **标准模式基底**：native 直调（无 PTC/run_code 包装，SDK 全量段不存在，工具面注意力税大幅下降）。
- **页面验证内置**：`dev_page_check` = 截图 + DOM smoke + **console/pageerror/title/selector/scale**；
  `{js:…}` 模式 = 本地 JS 引擎（零外部 node 依赖）；external 证据一等公民。
- **描述 ⇄ 行为对齐**：`presentation=native` 自检、阶段文案只说真话、平台事实（win32 以 Git Bash 私有 shell seam 为准）。
- **主动性引导**：Proactivity 常驻段（自检信号，不是停手命令）；压力感应器已退役。

配套预设：**router-react（v17）/ router-spec（v10）**（基于标准模式的两大执行预设，均支持首轮读图）；
router-pro 线已退役删除。完整演进：见 [CHANGELOG.md](CHANGELOG.md) 与 [docs/STANDARD-PLAN.md](docs/STANDARD-PLAN.md)。
```

**依据 3 · 源码核查**：[preset/router-standard/agent.cordis.yml:64-66](https://github.com/yjh051108/dsh-router-standard/blob/b39112dce54b90e67b50b166c2773861d7945d1f/preset/router-standard/agent.cordis.yml#L64-L66)

实际版本入口。

```text
- id: router-bootstrap
  name: ./router-bootstrap-v34.mjs?v=88
  config: {}
```

**依据 4 · 源码核查**：[preset/router-standard/router-bootstrap-v34.mjs:631-656](https://github.com/yjh051108/dsh-router-standard/blob/b39112dce54b90e67b50b166c2773861d7945d1f/preset/router-standard/router-bootstrap-v34.mjs#L631-L656)

首轮与promoted后实际装配。

<details>
<summary>查看原文（26行）</summary>

```text
      : undefined
    if (selectedModel?.model) sessionModels.set(session.id, selectedModel)

    const promoted = session.events.some((event) => event.type === 'tool/call')
    const planSection = (assembled.sections || []).find((s) => /plan/i.test(s.name))
    const baseSections = planSection
      ? [planSection, { name: 'router-persona', text: RL_PERSONA, order: 0 }]
      : [{ name: 'router-persona', text: RL_PERSONA, order: 0 }]

    if (!promoted) {
      // 首轮：无 restrict + 工具面只留 phase_begin（纯 RL 条件 = 稳定 we）
      return { ...assembled, sections: baseSections, contexts: [], tools: assembled.tools.filter((tool) => tool.name === 'phase_begin') }
    }

    // promoted：官方 sections 回流（persona 保持 RL 句）+ 引导带宽控 + 阶段声明 + 常驻段
    const stage = ensureStage()[session.id]?.stage ?? 0
    const toolsSvc = agent?.ctx?.get?.('tools')
    const fullNames = knownToolNames(toolsSvc, agent)
    const sections = filterToolGuidance((assembled.sections || []).map((s) =>
      /persona/i.test(s.name) ? { ...s, text: RL_PERSONA } : s
    ), stage, fullNames)
    // v1.18.1 口径统一：先安装 meta shim，再基于同一注册面渲染 stageText（与 dev_router_status 同源）
    if (!shimmedSessions.has(session.id)) {
      try { installMetaShim(agent, { installStage: true, stage }); shimmedSessions.add(session.id) } catch { /* ignore */ }
    }
    sections.push({ name: 'router-stage', order: 1, text: stageText(stage, muteAwareList(runtimeCallable(toolsSvc, agent), memoryMuted(session)), memoryMuted(session), firstUserTask(session)) })
```

</details>

**依据 5 · 源码核查**：[preset/router-standard/router-bootstrap-v34.mjs:565-584](https://github.com/yjh051108/dsh-router-standard/blob/b39112dce54b90e67b50b166c2773861d7945d1f/preset/router-standard/router-bootstrap-v34.mjs#L565-L584)

阶段restrict。

<details>
<summary>查看原文（20行）</summary>

```text
function applyStageRestrict(agent, stage) {
  try {
    const sid = agent?.session?.id
    const prev = sid ? sharedLift.get(sid) : undefined
    if (prev) { try { prev() } catch { /* ignore */ }; if (sid) sharedLift.delete(sid) }
    // 交付阶段：restrict 释放，全量目录开放（STANDARD-PLAN：阶段3 → 全量开放）
    if (stage >= STAGES.length - 1) return
    const toolsSvc = agent.ctx.get('tools')
    if (toolsSvc && typeof toolsSvc.restrict === 'function') {
      const allowed = new Set(STAGES.slice(0, windowFor(stage)).flatMap((s) => s.tools).concat(META_ALL))
      // v1.5：先按 GLOBAL_SAFE 过滤，再按 restrictableNames 过滤——平台性缺失（如 win32 无 bash）
      // 命名的工具会导致 restrict() 抛 unknown，从而放弃整个阶段门控；双过滤保证门控始终成立。
      let known = null
      try { if (typeof toolsSvc.view === 'function') known = new Set(toolsSvc.view(agent).restrictableNames) } catch { /* fall through */ }
      const allow = [...allowed].filter((t) => GLOBAL_SAFE.includes(t) && (known === null || known.has(t)) && !(memoryMuted(agent.session) && isMemoryTool(t)))
      if (allow.length === 0) return
      const disposer = toolsSvc.restrict({ allow })
      if (sid && disposer) sharedLift.set(sid, disposer)
    }
  } catch (e) { console.error('[router-bootstrap] applyStageRestrict failed:', e); /* scope-local names in allow: skip restrict, keep full catalog */ }
```

</details>

**依据 6 · 源码核查**：[preset/router-standard/router-bootstrap-v34.mjs:434-439](https://github.com/yjh051108/dsh-router-standard/blob/b39112dce54b90e67b50b166c2773861d7945d1f/preset/router-standard/router-bootstrap-v34.mjs#L434-L439)

当前非内置浏览器。

```text
  // v1.23（方案A·大道至简）：delivery_check 不再自跑 headless smoke（此前复用 dev_page_check/pageCheckRun，反复出bug）。
  // 页面交付物的视觉验证交给**模型用 bash 自测**（playwright/headless Chrome 截图 + read_image 视觉确认），
  // 并在 evidence 里给 visual proof（kind=image, reviewed:true）。delivery_check 校验 evidence 门禁，而非自已渲染。
  const requireSmoke = args?.requireSmoke !== false
  if (args?.url && requireSmoke) {
    checks.push({ name: 'page-verify', pass: false, detail: 'visual verify the page with bash (headless Chrome/playwright screenshot) + read_image (reviewed:true) into evidence — delivery_check gates the evidence, not a built-in browser' })
```

**依据 7 · 源码核查**：[preset/router-standard/agent.cordis.yml:10-16](https://github.com/yjh051108/dsh-router-standard/blob/b39112dce54b90e67b50b166c2773861d7945d1f/preset/router-standard/agent.cordis.yml#L10-L16)

host-plane职责分工。

```text
# beside this one in the same process, each seeing its own catalog.
#
# This file is an AGENT-PLANE composition. It is mounted under one agent's
# scope context, so every tool and prompt section it registers belongs to that
# session alone. The host composition (`base.cordis.yml` + `web.cordis.yml`)
# keeps everything a preset must not own: the registries themselves, the
# sandbox and approval stack, persistence, and the model route.
```

#### 缺口

- 当前Host是否支持relative query加载、restrict/view和具体preset全部服务未实装。
  **影响**：Host/query/service兼容未验，不能确认阶段工具实际挂载或以预设描述替真实可调用性。
  **进一步探讨**：匹配Host独立preset核query入口、服务解析/阶段目录与真实调用，逐项确认未把退役功能带入。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 阶段和交付门禁是行为约束还是已验证结果？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

applyStageRestrict确调工具服务restrict({allow})，不只是提示，但服务缺失/异常可log后不限制，阶段3释放；这是工作流范围管理，不代替sandbox/approval。自动推进按durable tool/call名字匹配，过滤不可见调用，但不取工具成功结果；阶段2见delivery_check调用就进阶段3，不能把阶段3当该检查通过。显示目录、运行restrict和阶段自动状态应分别验。

检查器核主文件存在非空、头64KB UTF-8及evidence清单。run/text只需非空result，numeric只验字符串形状，file/image/page核文件非空，视觉需reviewed:true声明；外部报告/数值正确或人确已看图并不由此证明。持久stage在DSH_HOME/router-standard/stages.json按session ID，JSON直接写、异常log，未见原子rename/跨进程事务；重启/并发/损坏会影响恢复，不能用持久化字样推导所有会话连续正确。

#### 证据与依据

**依据 1 · 源码核查**：[preset/router-standard/router-bootstrap-v34.mjs:565-584](https://github.com/yjh051108/dsh-router-standard/blob/b39112dce54b90e67b50b166c2773861d7945d1f/preset/router-standard/router-bootstrap-v34.mjs#L565-L584)

真实restrict与失败开放/阶段3释放。

<details>
<summary>查看原文（20行）</summary>

```text
function applyStageRestrict(agent, stage) {
  try {
    const sid = agent?.session?.id
    const prev = sid ? sharedLift.get(sid) : undefined
    if (prev) { try { prev() } catch { /* ignore */ }; if (sid) sharedLift.delete(sid) }
    // 交付阶段：restrict 释放，全量目录开放（STANDARD-PLAN：阶段3 → 全量开放）
    if (stage >= STAGES.length - 1) return
    const toolsSvc = agent.ctx.get('tools')
    if (toolsSvc && typeof toolsSvc.restrict === 'function') {
      const allowed = new Set(STAGES.slice(0, windowFor(stage)).flatMap((s) => s.tools).concat(META_ALL))
      // v1.5：先按 GLOBAL_SAFE 过滤，再按 restrictableNames 过滤——平台性缺失（如 win32 无 bash）
      // 命名的工具会导致 restrict() 抛 unknown，从而放弃整个阶段门控；双过滤保证门控始终成立。
      let known = null
      try { if (typeof toolsSvc.view === 'function') known = new Set(toolsSvc.view(agent).restrictableNames) } catch { /* fall through */ }
      const allow = [...allowed].filter((t) => GLOBAL_SAFE.includes(t) && (known === null || known.has(t)) && !(memoryMuted(agent.session) && isMemoryTool(t)))
      if (allow.length === 0) return
      const disposer = toolsSvc.restrict({ allow })
      if (sid && disposer) sharedLift.set(sid, disposer)
    }
  } catch (e) { console.error('[router-bootstrap] applyStageRestrict failed:', e); /* scope-local names in allow: skip restrict, keep full catalog */ }
```

</details>

**依据 2 · 源码核查**：[preset/router-standard/router-bootstrap-v34.mjs:518-524](https://github.com/yjh051108/dsh-router-standard/blob/b39112dce54b90e67b50b166c2773861d7945d1f/preset/router-standard/router-bootstrap-v34.mjs#L518-L524)

autoAdvance仅工具名。

```text
export function autoAdvance(stage, toolCalls, _text) {
  if (stage >= STAGES.length - 1) return stage
  const names = new Set((Array.isArray(toolCalls) ? toolCalls : []).map((t) => (typeof t === 'string' ? t : t?.name)).filter(Boolean))
  if (stage === 0 && (names.has('ask_user_question') || names.has('todo_write') || names.has('exit_plan_mode'))) return 1
  if (stage === 1 && (names.has('todo_write') || names.has('exit_plan_mode'))) return 2
  if (stage === 2 && names.has('delivery_check')) return 3
  return stage
```

**依据 3 · 源码核查**：[preset/router-standard/router-bootstrap-v34.mjs:675-695](https://github.com/yjh051108/dsh-router-standard/blob/b39112dce54b90e67b50b166c2773861d7945d1f/preset/router-standard/router-bootstrap-v34.mjs#L675-L695)

durable调用过滤与实际推进接线。

<details>
<summary>查看原文（21行）</summary>

```text
    const text = userMsg ? extractText(userMsg) : ''
    const sid = agent.session.id
    const st = (ensureStage()[sid] ??= { stage: 0, guided: false })
    const stageAt = st.stageAtTime ?? 0
    const toolCalls = (agent.session.events || []).filter((e) => (e.time === undefined || e.time >= stageAt) && (e.type === 'tool/call' || e.type === 'tool/code-dispatch')).map((e) => ({ name: e.data?.name || e.data?.toolName || '', args: toolArgs(e.data) }))
    // v1.17.2：被拒的锁定工具调用（如阶段 0 调 bash → unknown tool）不算行为信号——
    // 只有当前阶段真实可调（view.visible）的工具调用才触发直达推进。
    let advanceCalls = toolCalls
    try {
      const ts = agent?.ctx?.get?.('tools')
      const vis = ts?.view?.(agent)?.visible
      if (vis && typeof vis.has === 'function') advanceCalls = toolCalls.filter((c) => !c.name || vis.has(c.name))
    } catch { /* 无法判定时回退旧语义：全部调用参与推进 */ }
    const nextStage = autoAdvance(st.stage, advanceCalls, text)
    if (nextStage > st.stage) {
      st.stage = nextStage
      st.stageAtTime = Date.now()
      st.lastAdvance = { at: Date.now(), reason: 'auto:' + advanceCalls.map((c) => c.name).filter(Boolean).join(',') }
      saveStageState()
      applyStageRestrict(agent, nextStage)
      try { installMetaShim(agent, { installStage: true }) } catch { /* ignore */ }
```

</details>

**依据 4 · 源码核查**：[preset/router-standard/router-bootstrap-v34.mjs:414-430](https://github.com/yjh051108/dsh-router-standard/blob/b39112dce54b90e67b50b166c2773861d7945d1f/preset/router-standard/router-bootstrap-v34.mjs#L414-L430)

文件非空/UTF8头。

<details>
<summary>查看原文（17行）</summary>

```text
export async function deliveryCheck(ctx, args) {
  const file = String(args?.file || '').trim()
  const checks = []
  if (!file) return { ok: false, checks: [{ name: 'file-path', pass: false, detail: 'missing file parameter' }] }
  try {
    const st = statSync(file)
    checks.push({ name: 'file-exists', pass: true, detail: `${file} (${st.size} bytes, mtime ${st.mtime.toISOString()})` })
    checks.push(st.size > 0
      ? { name: 'file-nonempty', pass: true, detail: `${st.size} bytes` }
      : { name: 'file-nonempty', pass: false, detail: 'file is 0 bytes' })
  } catch (e) {
    return { ok: false, checks: [...checks, { name: 'file-exists', pass: false, detail: String((e && e.message) || e) }] }
  }
  try {
    const head = readFileSync(file).subarray(0, 65536)
    new TextDecoder('utf-8', { fatal: true }).decode(head)
    checks.push({ name: 'encoding-utf8', pass: true, detail: 'UTF-8 decode OK (head 64KB)' })
```

</details>

**依据 5 · 源码核查**：[preset/router-standard/router-bootstrap-v34.mjs:450-488](https://github.com/yjh051108/dsh-router-standard/blob/b39112dce54b90e67b50b166c2773861d7945d1f/preset/router-standard/router-bootstrap-v34.mjs#L450-L488)

证据结构/非空/reviewed标记。

<details>
<summary>查看原文（39行）</summary>

```text
    // external = 外部验证器（Playwright/playwright-cli/自产报告）产物：target（截图/报告文件）
    // 或 result（命令输出摘要）任一存在即合法；页面交付物仍需 ≥1 项 reviewed 视觉证据（page/image/external 皆可）。
    const ALLOWED = new Set(['file', 'page', 'image', 'run', 'test', 'text', 'external', 'numeric'])
    const failures = []
    for (const it of ev.items) {
      const label = String(it?.label || '').trim()
      const kind = String(it?.kind || '').trim()
      if (!label) { failures.push('empty label'); continue }
      if (!ALLOWED.has(kind)) { failures.push('bad kind: ' + kind); continue }
      if (kind === 'run' || kind === 'text') {
        if (!String(it?.result || '').trim()) failures.push(kind + ' evidence without result')
        continue
      }
      if (kind === 'numeric') {
        // v1.24：数值不变量 evidence——模型自算物理/数值不变量（如黑洞光子球半径、守恒量 H/L），
        // 门禁校验它必须带"数值结果"。这回应"自动计算物理不变量，让环境替模型完成主动怀疑"。
        const res = String(it?.result ?? '').trim()
        if (!res || !/^-?[\d.eE+-]+$/.test(res)) failures.push('numeric evidence needs a numeric result (e.g. minr=2.07, H=0.00)')
        continue
      }
      if (kind === 'external') {
        const hasTarget = String(it?.target || '').trim() !== ''
        const hasResult = String(it?.result || '').trim() !== ''
        if (!hasTarget && !hasResult) failures.push('external evidence needs target (file) or result (output summary)')
        if (hasTarget) {
          try {
            const st = statSync(String(it.target))
            if (!st.isFile() || st.size <= 0) failures.push('external target not valid file: ' + st)
          } catch { failures.push('external target missing: ' + it.target) }
        }
        continue
      }
      const t = String(it?.target || '').trim()
      if (!t) { failures.push(kind + ' evidence without target'); continue }
      try {
        const st = statSync(t)
        if (!st.isFile() || st.size <= 0) failures.push('target not valid file: ' + t)
      } catch { failures.push('target missing: ' + t) }
      if ((kind === 'page' || kind === 'image') && it?.reviewed !== true) failures.push('visual not reviewed: ' + label)
```

</details>

**依据 6 · 源码核查**：[preset/router-standard/router-bootstrap-v34.mjs:490-500](https://github.com/yjh051108/dsh-router-standard/blob/b39112dce54b90e67b50b166c2773861d7945d1f/preset/router-standard/router-bootstrap-v34.mjs#L490-L500)

视觉声明和最终checks，不验报告结论。

<details>
<summary>查看原文（11行）</summary>

```text
    if (args?.url) {
      const hasReviewedVisual = (ev.items || []).some(it => (['page', 'image', 'external'].includes(String(it?.kind))) && it?.reviewed === true)
      if (!hasReviewedVisual) failures.push('page deliverable needs at least one reviewed visual evidence (page/image/external)')
    }
    checks.push({ name: 'delivery-evidence', pass: failures.length === 0, detail: failures.length === 0 ? 'evidence accepted (' + ev.items.length + ' item(s))' : failures.join('; ') })
    // v1.28（引导，不强杀）：若交付物存在可测数值不变量（守恒量/半径/计数/编译成功），但 evidence 里没有
    // numeric 断言——只提示"缺一个数值断言"，不强杀。这响应黑洞建议"把'我认为对'变成'我验证过'"（B 强度）。
    const noNumeric = (ev.items || []).every(it => String(it?.kind) !== 'numeric')
    if (noNumeric) checks.push({ name: 'numeric-assertion', pass: true, detail: 'hint: if this deliverable has a measurable invariant (conserved qty / radius / count / compile-ok), add a numeric evidence item (kind=numeric, result=<number>) to turn "I think it works" into "I verified it". Non-blocking.' })
  }
  return { ok: checks.every((c) => c.pass), checks }
```

</details>

**依据 7 · 源码核查**：[preset/router-standard/router-bootstrap-v34.mjs:527-556](https://github.com/yjh051108/dsh-router-standard/blob/b39112dce54b90e67b50b166c2773861d7945d1f/preset/router-standard/router-bootstrap-v34.mjs#L527-L556)

阶段路径/读坏默认空/直接写和log。

<details>
<summary>查看原文（30行）</summary>

```text
/* 阶段状态持久化 */
const dshHomeForState = () => process.env.DSH_HOME || join(homedir(), '.dsh')
const stageFile = () => process.env.DSH_ROUTER_STAGE_FILE || join(dshHomeForState(), 'router-standard', 'stages.json')
let stageCache = null
function ensureStage() {
  const file = stageFile()
  if (stageCache === null || stageCache.file !== file) {
    stageCache = { file, state: loadStageState() }
  }
  return stageCache.state
}
function loadStageState() {
  try {
    const parsed = JSON.parse(readFileSync(stageFile(), 'utf8'))
    if (parsed && typeof parsed === 'object' && parsed.sessions && typeof parsed.sessions === 'object') {
      const out = {}
      for (const [sid, st] of Object.entries(parsed.sessions)) {
        const stage = Number(st?.stage)
        if (Number.isInteger(stage) && stage >= 0 && stage <= 3) out[sid] = { stage, guided: st?.guided === true, ...(Number.isFinite(st?.stageAtTime) ? { stageAtTime: st.stageAtTime } : {}), ...(st?.lastAdvance && typeof st.lastAdvance === 'object' ? { lastAdvance: { at: Number.isFinite(st.lastAdvance.at) ? st.lastAdvance.at : 0, reason: st.lastAdvance.reason ?? null } } : {}) }
      }
      return out
    }
  } catch (e) { if (e && e.code !== 'ENOENT') console.error('[router-bootstrap] loadStageState failed:', e) }
  return {}
}
function saveStageState() {
  try {
    mkdirSync(join(stageFile(), '..'), { recursive: true })
    writeFileSync(stageFile(), JSON.stringify({ version: 2, savedAt: new Date().toISOString(), sessions: ensureStage() }, null, 2), 'utf8')
  } catch (e) { console.error('[router-bootstrap] saveStageState failed:', e) }
```

</details>

#### 缺口

- 未运行restrict失败/结果失败仍推进/重启并发，证据语义和任务完成未独立验证。
  **影响**：restrict故障、失败调用推进与状态恢复未验，不能将阶段3或清单PASS当真实交付通过/会话进度可靠。
  **进一步探讨**：隔离任务核每阶段可见/可调、失败调用、检查FAIL与状态分离，坏JSON/只读目录/并发重启及真实产物对照。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 是否值得替换标准preset，如何验证生产方向？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

建议有匹配Host的开发者在可回退任务有限试用，先比较Standard完成同一任务的正确性与步骤/上下文开销；不是因工具变少就保证少token或质量更好。阶段问答、计划、元工具、证据填充可能增加轮次，shell/编辑等实际副作用仍依宿主权限。首次复制独立preset、核相对模块/配置与state备份；持续需Host API/query版本、阶段工具归属和日志维护；失败要回原preset并单独保管state，退出不应删同DSH_HOME其他会话数据。金额/人工和节省比例未知。

方向是把阶段推进绑定可验证的工具结果、需求验收和稳定证据摘要，显示“被调用/检查通过/业务验收”三个状态并保持与restrict事实一致，不再只把阶段当结果代理。比较Standard、当前与结果绑定版在真实小任务的失败误晋级、遗漏验收、返工时间/token和权限拒绝后的行为；收益不及流程开销则停止。仅假设，未实现；当前结构清单已有价值但不得作为真实性认证。

#### 证据与依据

**依据 1 · 源码核查**：[preset/router-standard/router-bootstrap-v34.mjs:518-524](https://github.com/yjh051108/dsh-router-standard/blob/b39112dce54b90e67b50b166c2773861d7945d1f/preset/router-standard/router-bootstrap-v34.mjs#L518-L524)

结果绑定的当前缺口。

```text
export function autoAdvance(stage, toolCalls, _text) {
  if (stage >= STAGES.length - 1) return stage
  const names = new Set((Array.isArray(toolCalls) ? toolCalls : []).map((t) => (typeof t === 'string' ? t : t?.name)).filter(Boolean))
  if (stage === 0 && (names.has('ask_user_question') || names.has('todo_write') || names.has('exit_plan_mode'))) return 1
  if (stage === 1 && (names.has('todo_write') || names.has('exit_plan_mode'))) return 2
  if (stage === 2 && names.has('delivery_check')) return 3
  return stage
```

**依据 2 · 源码核查**：[preset/router-standard/router-bootstrap-v34.mjs:675-695](https://github.com/yjh051108/dsh-router-standard/blob/b39112dce54b90e67b50b166c2773861d7945d1f/preset/router-standard/router-bootstrap-v34.mjs#L675-L695)

推进依调用事件。

<details>
<summary>查看原文（21行）</summary>

```text
    const text = userMsg ? extractText(userMsg) : ''
    const sid = agent.session.id
    const st = (ensureStage()[sid] ??= { stage: 0, guided: false })
    const stageAt = st.stageAtTime ?? 0
    const toolCalls = (agent.session.events || []).filter((e) => (e.time === undefined || e.time >= stageAt) && (e.type === 'tool/call' || e.type === 'tool/code-dispatch')).map((e) => ({ name: e.data?.name || e.data?.toolName || '', args: toolArgs(e.data) }))
    // v1.17.2：被拒的锁定工具调用（如阶段 0 调 bash → unknown tool）不算行为信号——
    // 只有当前阶段真实可调（view.visible）的工具调用才触发直达推进。
    let advanceCalls = toolCalls
    try {
      const ts = agent?.ctx?.get?.('tools')
      const vis = ts?.view?.(agent)?.visible
      if (vis && typeof vis.has === 'function') advanceCalls = toolCalls.filter((c) => !c.name || vis.has(c.name))
    } catch { /* 无法判定时回退旧语义：全部调用参与推进 */ }
    const nextStage = autoAdvance(st.stage, advanceCalls, text)
    if (nextStage > st.stage) {
      st.stage = nextStage
      st.stageAtTime = Date.now()
      st.lastAdvance = { at: Date.now(), reason: 'auto:' + advanceCalls.map((c) => c.name).filter(Boolean).join(',') }
      saveStageState()
      applyStageRestrict(agent, nextStage)
      try { installMetaShim(agent, { installStage: true }) } catch { /* ignore */ }
```

</details>

**依据 3 · 源码核查**：[preset/router-standard/router-bootstrap-v34.mjs:565-584](https://github.com/yjh051108/dsh-router-standard/blob/b39112dce54b90e67b50b166c2773861d7945d1f/preset/router-standard/router-bootstrap-v34.mjs#L565-L584)

Host服务条件与回退。

<details>
<summary>查看原文（20行）</summary>

```text
function applyStageRestrict(agent, stage) {
  try {
    const sid = agent?.session?.id
    const prev = sid ? sharedLift.get(sid) : undefined
    if (prev) { try { prev() } catch { /* ignore */ }; if (sid) sharedLift.delete(sid) }
    // 交付阶段：restrict 释放，全量目录开放（STANDARD-PLAN：阶段3 → 全量开放）
    if (stage >= STAGES.length - 1) return
    const toolsSvc = agent.ctx.get('tools')
    if (toolsSvc && typeof toolsSvc.restrict === 'function') {
      const allowed = new Set(STAGES.slice(0, windowFor(stage)).flatMap((s) => s.tools).concat(META_ALL))
      // v1.5：先按 GLOBAL_SAFE 过滤，再按 restrictableNames 过滤——平台性缺失（如 win32 无 bash）
      // 命名的工具会导致 restrict() 抛 unknown，从而放弃整个阶段门控；双过滤保证门控始终成立。
      let known = null
      try { if (typeof toolsSvc.view === 'function') known = new Set(toolsSvc.view(agent).restrictableNames) } catch { /* fall through */ }
      const allow = [...allowed].filter((t) => GLOBAL_SAFE.includes(t) && (known === null || known.has(t)) && !(memoryMuted(agent.session) && isMemoryTool(t)))
      if (allow.length === 0) return
      const disposer = toolsSvc.restrict({ allow })
      if (sid && disposer) sharedLift.set(sid, disposer)
    }
  } catch (e) { console.error('[router-bootstrap] applyStageRestrict failed:', e); /* scope-local names in allow: skip restrict, keep full catalog */ }
```

</details>

**依据 4 · 源码核查**：[preset/router-standard/router-bootstrap-v34.mjs:527-556](https://github.com/yjh051108/dsh-router-standard/blob/b39112dce54b90e67b50b166c2773861d7945d1f/preset/router-standard/router-bootstrap-v34.mjs#L527-L556)

state维护成本。

<details>
<summary>查看原文（30行）</summary>

```text
/* 阶段状态持久化 */
const dshHomeForState = () => process.env.DSH_HOME || join(homedir(), '.dsh')
const stageFile = () => process.env.DSH_ROUTER_STAGE_FILE || join(dshHomeForState(), 'router-standard', 'stages.json')
let stageCache = null
function ensureStage() {
  const file = stageFile()
  if (stageCache === null || stageCache.file !== file) {
    stageCache = { file, state: loadStageState() }
  }
  return stageCache.state
}
function loadStageState() {
  try {
    const parsed = JSON.parse(readFileSync(stageFile(), 'utf8'))
    if (parsed && typeof parsed === 'object' && parsed.sessions && typeof parsed.sessions === 'object') {
      const out = {}
      for (const [sid, st] of Object.entries(parsed.sessions)) {
        const stage = Number(st?.stage)
        if (Number.isInteger(stage) && stage >= 0 && stage <= 3) out[sid] = { stage, guided: st?.guided === true, ...(Number.isFinite(st?.stageAtTime) ? { stageAtTime: st.stageAtTime } : {}), ...(st?.lastAdvance && typeof st.lastAdvance === 'object' ? { lastAdvance: { at: Number.isFinite(st.lastAdvance.at) ? st.lastAdvance.at : 0, reason: st.lastAdvance.reason ?? null } } : {}) }
      }
      return out
    }
  } catch (e) { if (e && e.code !== 'ENOENT') console.error('[router-bootstrap] loadStageState failed:', e) }
  return {}
}
function saveStageState() {
  try {
    mkdirSync(join(stageFile(), '..'), { recursive: true })
    writeFileSync(stageFile(), JSON.stringify({ version: 2, savedAt: new Date().toISOString(), sessions: ensureStage() }, null, 2), 'utf8')
  } catch (e) { console.error('[router-bootstrap] saveStageState failed:', e) }
```

</details>

**依据 5 · 作者声明**：[README.md:144-166](https://github.com/yjh051108/dsh-router-standard/blob/b39112dce54b90e67b50b166c2773861d7945d1f/README.md#L144-L166)

作者手动preset复制/query热更新说明。

<details>
<summary>查看原文（23行）</summary>

````text
**Two presets** (v0.3.0; the router-pro line was retired): install one or more under `~/.dsh/.agent-presets/`:

```powershell
# 标准路由预设（RL 接口还原，默认推荐）
$target = Join-Path $env:USERPROFILE '.dsh\.agent-presets\router-standard'
Copy-Item -Recurse .\preset\router-standard $target

# spec 路由预设（深度思考优先）
$target = Join-Path $env:USERPROFILE '.dsh\.agent-presets\router-spec'
Copy-Item -Recurse .\preset\router-spec $target
```

**免重启安装（推荐）**：装好 [dsh-super-injector](https://github.com/yjh051108/dsh-super-injector)
后（见套件 `scripts/install-injector.ps1`），改预设代码不再需要换文件名/重启：

```
dev_reload_preset router-standard   # 预设热更新：?v=N query 绕 ESM 缓存，新会话立即用新代码
```

**注意事项（实测血泪）**：

1. **ESM 缓存**：loader 按 URL 缓存模块——原地覆盖文件内容不生效（改代码必须
   `dev_reload_preset` 或换文件名）。
````

</details>

#### 缺口

- 无独立匹配Host/模型/任务对照和净成本收益测量。
  **影响**：缺Standard同任务成本质量对照，无法断定少工具与阶段仪式减少token、遗漏或返工。
  **进一步探讨**：可回退分支/独立preset先查当前限制与FAIL状态，再对照原Standard，核真实交付而不是仅状态标签。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
