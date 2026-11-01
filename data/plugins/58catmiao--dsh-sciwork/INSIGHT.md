# DSH SciWork

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[31efb91](https://github.com/58catmiao/dsh-sciwork/tree/31efb9101bf8472ad0a934e9c5308f1d1dbf18c2)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/58catmiao/dsh-sciwork)
<!-- END META -->

> **功能**：在 DSH 中组织科研课题、文献、数据和投稿材料。

> **亮点**：统一课题动作、计划和可审查回执，并生成投稿包。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：旧动作可隐式代签；超时不取消底层写，投稿检查失败仍可导出，科学内容需人工复核。[Q03](#research-q03) [Q04](#research-q04) [Q05](#research-q05)

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
  - [Q01 · 科研工作台服务哪些任务，和分散管理文件相比如何？](#detail-section-11)
  - [Q02 · 新动作如何绑定计划、参数和根目录？](#detail-section-12)
  - [Q03 · 所有写动作都经显式两步确认吗？](#detail-section-13)
  - [Q04 · 超时、回执与幂等能保证写操作恰好一次吗？](#detail-section-14)
  - [Q05 · 投稿包的校验与哈希是否证明资料正确和一致？](#detail-section-15)
  - [Q06 · 如何改进超时后的未知写入状态，值得如何试用？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要跨文献、图稿与投稿材料组织的研究者；基线是手工维护文件和逐项核对。[Q01](#research-q01)

分散管理科研文件、绘图工具和期刊清单。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 课题 | 管理科研材料 | 内容需人工核实 |
| 动作 | 计划与回执 | 兼容入口可代签 |
| 投稿包 | 汇总文件和警告 | 失败项不阻止导出 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| DSH、Node 和科研库 | 必需 | 工作台与动作 | 手工管理 |
| Python 引擎 | 对应动作需要 | 检查与导出 | 功能失败 |
| Origin 插件 | 绘图需要 | 上游图形能力 | 使用现有图稿 |
| 人工核验与备份 | 投稿试用必需 | 真实内容及恢复 | 不投稿 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户备份课题并核对依赖 | 无副本先停止 |
| 整理 | 审查动作计划及确认 | 兼容旧入口特别核对 |
| 导出 | 检查回执、文件与引文 | 超时先回读，失败项人工处理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主与科研库 | 配库及备份 | 兼容未测 |
| 持续 | 模型、绘图与存储 | 检查材料和引文 | 费用与质量未知 |
| 恢复 | 重试可能重写 | 回读文件和回执 | 超时不取消 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 动作 | 计划绑定与兼容分支 | 用户审批真正发生 |
| 投稿 | 文件哈希及检查警告 | 科学真实性及并发一致性 |

> **思考**：旧动作可隐式代签；超时不取消底层写，投稿检查失败仍可导出，科学内容需人工复核。[Q03](#research-q03) [Q04](#research-q04) [Q05](#research-q05)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：统一课题动作、计划和可审查回执，并生成投稿包。[Q01](#research-q01) [Q02](#research-q02)

计划保存摘要与参数/root 哈希，兼容入口可代签；Promise.race 超时不取消执行。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-5"></a>

### 1.4 主要限制

旧动作可隐式代签；超时不取消底层写，投稿检查失败仍可导出，科学内容需人工复核。[Q03](#research-q03) [Q04](#research-q04) [Q05](#research-q05)

<a id="detail-section-6"></a>

### 1.5 使用建议

先用备份课题核实确认、回执与材料；超时先查文件，投稿前人工复核。[Q06](#research-q06)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持动作计划、兼容路径与导出边界；未运行宿主、引擎或上游绘图。

- 已检查：作者 README、包清单、源码路径 package.json、lib/tools.js、lib/host/dispatch.js、lib/host/guards.js、lib/host/receipts.js、library/scripts/research.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 inventory 85 文件、无排除和解析错误；静态追踪主要动作、回执及导出，未运行目标。
- 下一步：固定宿主和库，在隔离课题模拟旧入口、慢写、回执失败与投稿包复核。

**分析版本**

- **仓库**：[58catmiao/dsh-sciwork](https://github.com/58catmiao/dsh-sciwork)
- **版本号**：0.4.6（[固定提交 31efb91](https://github.com/58catmiao/dsh-sciwork/tree/31efb9101bf8472ad0a934e9c5308f1d1dbf18c2)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：持久操作状态与完成后回读可帮助区分超时后的未知写入，须对照已有成功幂等与回执。[Q06](#research-q06)

固定宿主和库，在隔离课题模拟旧入口、慢写、回执失败与投稿包复核。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 21 | 4197 | — | — | 73571 |
| .js | source | 40 | 14672 | 11853 | 1931 | — |
| .mjs | source | 24 | 9013 | 7361 | 993 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/58catmiao/dsh-sciwork/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/58catmiao/dsh-sciwork/issues?q=is%3Aissue+created%3A2026-10-02T12%3A37%3A53.293Z..2026-11-01T12%3A37%3A53.293Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/58catmiao/dsh-sciwork/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T12%3A37%3A53.293Z..2026-11-01T12%3A37%3A53.293Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：科研动作、计划确认和投稿包如何连接，失败和科学核验边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 科研工作台服务哪些任务，和分散管理文件相比如何？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

研究者可围绕课题组织文献、数据、图稿与投稿材料，作者描述面板、代理工具和 Python 库共用动作。基线是手工管理文件并分别检查期刊要求；工作台有助组织但不验证研究方法、引文与科学结论，Origin 绘图属于上游依赖而非本插件独立实现。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-5](https://github.com/58catmiao/dsh-sciwork/blob/31efb9101bf8472ad0a934e9c5308f1d1dbf18c2/package.json#L1-L5)

项目定位、动作和上游绘图声明。

```text
{
  "name": "dsh-sciwork",
  "version": "0.4.6",
  "description": "DSH 科研模式：给 DeepSeek Harness 装一套科研工作台——「科研模式」agent 预设 + 本机实体科研库（Python 引擎与登记索引）+ 12 份期刊投稿档案 + 投稿闸门（期刊合规体检 / 投稿包导出 / 递归全文索引）+ 绘图/写作/文献/期刊技能 + 「科研库」面板。0.3 起动作走「能力清单 + 确认令牌 + 回执」：课题是一等公民（七阶段机），面板与 agent 共用同一套动作，旧面板与 24 个旧动作名继续可用。出图由智能体经上游 dsh-origin-plugin（Origin MCP）完成。",
  "keywords": [
```

**依据 2 · 源码核查**：[lib/tools.js:75-103](https://github.com/58catmiao/dsh-sciwork/blob/31efb9101bf8472ad0a934e9c5308f1d1dbf18c2/lib/tools.js#L75-L103)

从动作目录注册代理工具并委托 dispatcher。

<details>
<summary>查看原文（29行）</summary>

```text
export function registerSciworkTools(tools, { logger } = {}) {
  const log = logger || { info() {}, warn() {} };
  if (!tools || typeof tools.register !== 'function') return { registered: [], failed: [{ name: '*', error: 'no tools registry' }] };
  ensureRegistered();
  const registered = [];
  const failed = [];
  const seen = new Set();
  for (const action of catalog()) {
    // registry.catalog() 把 tool 收窄成「已暴露的工具名」字符串（null = 不暴露）。
    const toolName = typeof action.tool === 'string' ? action.tool : (action.tool && action.tool.expose ? action.tool.name : null);
    if (!toolName) continue;
    if (seen.has(toolName)) { failed.push({ name: toolName, error: `工具名重复：${action.id}` }); continue; }
    seen.add(toolName);
    try {
      tools.register({
        name: toolName,
        description: toolDescription(action),
        parameters: toToolSchema(action.params),
        output: { schema: { type: 'object' }, render: (_args, value) => renderValue(value) },
        async execute(args) {
          const settings = await settingsNow();
          const out = await dispatch(action.id, args || {}, { source: 'agent', root: settings.root });
          if (out.ok) return { ok: true, action: action.id, value: out.value, receipt: out.receipt || null };
          const d = out.error || { code: 'internal', message: '未知错误' };
          const error = new Error(`${d.code}: ${d.message}`);
          error.code = d.code;
          error.details = d.details || {};
          throw error;
        },
```

</details>

#### 缺口

- 未运行 DSH、Python 引擎、Origin 或科研材料
  **影响**：无法证明写入、导出、科学质量与引文真实性
  **进一步探讨**：固定宿主与引擎，在隔离课题验证确认、超时、回执与投稿包

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 新动作如何绑定计划、参数和根目录？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

planAction 校验参数，读动作可直接计划，其他动作生成计划；issuePlan 保存令牌哈希、动作 ID、参数哈希、root 和过期时间，并返回摘要、差异、写入与警告。dispatch 消费计划时绑定动作、参数及 root；这约束指定计划，并不本身证明用户理解了操作或目标文件之后没有变化。计划中返回操作摘要供确认。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host/dispatch.js:65-101](https://github.com/58catmiao/dsh-sciwork/blob/31efb9101bf8472ad0a934e9c5308f1d1dbf18c2/lib/host/dispatch.js#L65-L101)

校验与生成计划。

<details>
<summary>查看原文（37行）</summary>

```text
export function planAction(actionIdOrAlias, params, ctx = {}) {
  const action = resolveAction(actionIdOrAlias);
  if (!action) return fail('bad-request', `未知动作：${actionIdOrAlias}。可用动作：${listActions().map((a) => a.id).join(', ')}`);
  let clean;
  try {
    clean = validateParams(action, params);
  } catch (error) {
    const d = describeError(error);
    return { ok: false, error: { code: d.code === 'internal' ? 'schema' : d.code, message: d.message, details: d.details } };
  }
  const root = ctx.root || (ctx.settings && ctx.settings.root) || '';
  let preview = null;
  try {
    preview = typeof action.preview === 'function' ? action.preview(ctx, clean) : null;
  } catch (error) {
    const d = describeError(error);
    return { ok: false, error: { code: d.code, message: d.message, details: d.details } };
  }
  if (action.effects === 'read' || action.confirm === 'never') {
    return {
      ok: true,
      value: {
        actionId: action.id, title: action.title, effects: action.effects, confirm: action.confirm,
        paramsHash: paramsHash(clean), confirmRequired: false, params: clean,
        summary: (preview && preview.summary) || '', diff: (preview && preview.diff) || [],
        writes: (preview && preview.writes) || [], warnings: (preview && preview.warnings) || [],
      },
    };
  }
  const issued = issuePlan({ action, params: clean, root, ...(preview || {}) });
  return {
    ok: true,
    value: {
      actionId: action.id, title: action.title, effects: action.effects, confirm: action.confirm,
      confirmRequired: true, params: clean, ...issued,
    },
  };
```

</details>

**依据 2 · 源码核查**：[lib/host/guards.js:88-117](https://github.com/58catmiao/dsh-sciwork/blob/31efb9101bf8472ad0a934e9c5308f1d1dbf18c2/lib/host/guards.js#L88-L117)

计划绑定与摘要返回。

<details>
<summary>查看原文（30行）</summary>

```text
export function issuePlan({ action, params, root, summary, diff, writes, warnings, ttlMs = PLAN_TTL_MS }) {
  purge();
  const token = crypto.randomBytes(24).toString('hex');
  const planId = `p_${Date.now().toString(36)}_${crypto.randomBytes(6).toString('hex')}`;
  const expiresAt = Date.now() + ttlMs;
  PLANS.set(planId, {
    tokenHash: tokenHash(token),
    actionId: action.id,
    paramsHash: paramsHash(params),
    root: String(root),
    expiresAt,
  });
  const list = (v) => (Array.isArray(v) ? v : v ? [v] : []);
  return {
    planId,
    token,
    actionId: action.id,
    title: action.title,
    effects: action.effects,
    engine: action.engine,
    confirm: action.confirm,
    paramsHash: paramsHash(params),
    expiresAt: new Date(expiresAt).toISOString(),
    // 0.4.6：`preview.summary` 以前在 issuePlan 里被丢掉，确认弹层只剩一句令牌说明，
    // 用户看不出这次到底要做什么（笔记删除/保存都受影响）。
    summary: String(summary || ''),
    diff: list(diff),
    writes: list(writes),
    warnings: list(warnings),
  };
```

</details>

**依据 3 · 源码核查**：[lib/host/guards.js:120-145](https://github.com/58catmiao/dsh-sciwork/blob/31efb9101bf8472ad0a934e9c5308f1d1dbf18c2/lib/host/guards.js#L120-L145)

一次性计划消费。

<details>
<summary>查看原文（26行）</summary>

```text
/**
 * 校验并消费令牌。一次性：校验通过就删，重复用 → `denied`。
 * @returns {{ok:true}}
 */
export function consumePlan({ planId, token, actionId, params, root }) {
  purge();
  const id = String(planId || '');
  const plan = PLANS.get(id);
  // 「根本没带计划」和「计划坏了」是两件事：前者是正常的第一阶段（面板据此弹确认框），
  // 后者才是拒绝。混成一个码会让面板没法区分「要不要确认」和「确认被拒」。
  if (!id && !token) {
    throw new ResearchError('needs-confirmation',
      `${actionId} 是写动作：先 action.plan 生成计划，再带 planId + token 执行（5 分钟内有效）`,
      { planId: '', planRequired: true });
  }
  if (!plan) throw denied('计划不存在或已过期（重新发起 action.plan）', { planId: id, planRequired: true });
  if (plan.expiresAt <= Date.now()) {
    PLANS.delete(id);
    throw denied('计划已过期（5 分钟），重新发起 action.plan', { planId: id, planRequired: true });
  }
  if (!token || !safeEqual(plan.tokenHash, tokenHash(token))) {
    throw denied('确认令牌不匹配', { planId: id, planRequired: true });
  }
  if (plan.actionId !== actionId) {
    throw denied(`计划绑定的动作是 ${plan.actionId}，不是 ${actionId}`, { planId: id, planRequired: true });
  }
```

</details>

#### 缺口

- 未运行 DSH、Python 引擎、Origin 或科研材料
  **影响**：无法证明写入、导出、科学质量与引文真实性
  **进一步探讨**：固定宿主与引擎，在隔离课题验证确认、超时、回执与投稿包

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 所有写动作都经显式两步确认吗？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

不是。dispatch 对 confirm=legacy 或旧动作名在同一次请求代签并消费令牌并记录 legacy-implicit 警告；其他需确认动作要求调用方提供 planId 和 token。因此新动作计划流程不能外推为所有兼容入口都等待用户确认。权限不足、调用方行为及宿主审批仍需单独核验。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host/dispatch.js:136-158](https://github.com/58catmiao/dsh-sciwork/blob/31efb9101bf8472ad0a934e9c5308f1d1dbf18c2/lib/host/dispatch.js#L136-L158)

legacy 代签与显式令牌分支。

<details>
<summary>查看原文（23行）</summary>

```text
  const settings = ctx.settings || null;
  const root = ctx.root || (settings && settings.root) || '';
  if (!root) return fail('internal', '执行器没有拿到库根（settings.root）', { action: action.id });

  const warnings = [];
  let confirmation = 'none';
  try {
    if (needsConfirm(action)) {
      // 旧名调用一律走兼容口：旧面板没有「计划/令牌」两步，还要零改动。
      // 新 id 调用（含面板 0.3 的 `library.remove`）必须持真令牌。
      if (action.confirm === 'legacy' || legacyName) {
        const implicit = issueLegacyToken({ action, params: clean, root });
        confirmation = 'legacy-implicit';
        warnings.push(`兼容口：旧动作名「${legacyName || action.id}」在本次请求内代签并消费了确认令牌（confirmation=legacy-implicit）；新动作需先 action.plan 再确认。`);
        void implicit;
      } else {
        const planId = ctx.planId || (params && params.planId);
        // 两个字段名都收：面板/工具走 action.confirm 时统一叫 confirmToken，
        // 自动化脚本习惯写 token；指向同一把一次性令牌，别名不改变语义。
        const token = ctx.confirmToken || ctx.token || (params && (params.confirmToken || params.token));
        consumePlan({ planId, token, actionId: action.id, params: clean, root });
        confirmation = 'token';
      }
```

</details>

**依据 2 · 源码核查**：[lib/tools.js:60-65](https://github.com/58catmiao/dsh-sciwork/blob/31efb9101bf8472ad0a934e9c5308f1d1dbf18c2/lib/tools.js#L60-L65)

代理工具对写操作的说明。

```text
function toolDescription(action) {
  const parts = [action.title, action.description].filter(Boolean);
  parts.push(`effects: ${action.effects}；confirm: ${action.confirm}。`);
  if (action.effects !== 'read') {
    parts.push('这是写动作：直接调用只会返回计划（needs-confirmation）；把计划给用户看、得到同意后，再调 sciwork_action_confirm 带 planId+token 执行。');
  }
```

#### 缺口

- 未运行 DSH、Python 引擎、Origin 或科研材料
  **影响**：无法证明写入、导出、科学质量与引文真实性
  **进一步探讨**：固定宿主与引擎，在隔离课题验证确认、超时、回执与投稿包

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 超时、回执与幂等能保证写操作恰好一次吗？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

不能。超时用 Promise.race 拒绝等待，没有向底层 action.run 传取消信号，因此超时后写操作可能仍进行；此前的内存幂等命中可回放成功结果，但不证明跨重启或并发的恰好一次。回执写入有失败分支，未知结果先查实际文件及回执，不能直接重试。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host/dispatch.js:104-109](https://github.com/58catmiao/dsh-sciwork/blob/31efb9101bf8472ad0a934e9c5308f1d1dbf18c2/lib/host/dispatch.js#L104-L109)

超时只竞争 Promise。

```text
function runWithTimeout(promise, ms, label) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new ResearchError('timeout', `${label} 超时（${Math.round(ms / 1000)}s）`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
```

**依据 2 · 源码核查**：[lib/host/dispatch.js:165-170](https://github.com/58catmiao/dsh-sciwork/blob/31efb9101bf8472ad0a934e9c5308f1d1dbf18c2/lib/host/dispatch.js#L165-L170)

已有幂等命中回放。

```text
  const idemKey = action.effects !== 'read' ? idempotencyKey({ action, params: clean, root }) : null;
  if (idemKey) {
    const hit = lookupIdempotent(idemKey);
    if (hit) {
      logger.info(`[research] ${action.id} 幂等命中，回放上次回执 ${hit.receiptId}`);
      return { ok: true, value: hit.value, receipt: hit.receipt, replayed: true };
```

**依据 3 · 源码核查**：[lib/host/dispatch.js:193-210](https://github.com/58catmiao/dsh-sciwork/blob/31efb9101bf8472ad0a934e9c5308f1d1dbf18c2/lib/host/dispatch.js#L193-L210)

执行和失败回执路径。

<details>
<summary>查看原文（18行）</summary>

```text
  let value;
  const timeoutMs = Number(action.timeoutMs) > 0 ? Number(action.timeoutMs) : DEFAULT_TIMEOUT_MS;
  try {
    value = await runWithTimeout(Promise.resolve().then(() => action.run(executionCtx, clean)), timeoutMs, action.title || action.id);
  } catch (error) {
    const d = describeError(error);
    receipt.ok = false;
    receipt.durationMs = Date.now() - startedAtMs;
    receipt.error = { code: d.code, message: d.message };
    if (audited) {
      const written = appendReceipt(root, receipt);
      if (!written.ok) logger.warn(`[research] 回执落盘失败：${written.error}`);
    }
    logger.warn(`[research] ${action.id} 失败：${d.code} ${d.message}`);
    return { ok: false, error: { code: d.code, message: d.message, details: { ...d.details, action: action.id, ...(receiptId ? { receiptId } : {}) } } };
  }

  receipt.durationMs = Date.now() - startedAtMs;
```

</details>

**依据 4 · 源码核查**：[lib/host/receipts.js:35-52](https://github.com/58catmiao/dsh-sciwork/blob/31efb9101bf8472ad0a934e9c5308f1d1dbf18c2/lib/host/receipts.js#L35-L52)

回执写入与错误处理。

<details>
<summary>查看原文（18行）</summary>

```text

/**
 * 追加一条回执。
 * @returns {{ok:boolean, rel:string, error?:string}}
 */
export function appendReceipt(root, receipt) {
  const rel = receiptsRel(receipt && receipt.startedAtMs ? receipt.startedAtMs : Date.now());
  try {
    const abs = path.join(root, rel.split('/').join(path.sep));
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.appendFileSync(abs, `${JSON.stringify(receipt)}\n`, 'utf8');
    return { ok: true, rel };
  } catch (error) {
    return { ok: false, rel, error: String((error && error.message) || error) };
  }
}

/** 读最近 N 条回执（新的在后）。文件不存在/坏行都不抛。 */
```

</details>

#### 缺口

- 未运行 DSH、Python 引擎、Origin 或科研材料
  **影响**：无法证明写入、导出、科学质量与引文真实性
  **进一步探讨**：固定宿主与引擎，在隔离课题验证确认、超时、回执与投稿包

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 投稿包的校验与哈希是否证明资料正确和一致？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

不证明。导出枚举稿件、图与数据，先读文件算哈希，期刊检查有 fail 只加入 warnings 并继续生成；最终应逐文件及引文复核。哈希和后续打包若读取时文件发生变化，不能仅凭这两次操作推断一致快照；格式检查不验证科学真实性。

#### 证据与依据

**依据 1 · 源码核查**：[library/scripts/research.py:1370-1414](https://github.com/58catmiao/dsh-sciwork/blob/31efb9101bf8472ad0a934e9c5308f1d1dbf18c2/library/scripts/research.py#L1370-L1414)

枚举材料和先计算文件哈希。

<details>
<summary>查看原文（45行）</summary>

```text
    manuscript = resolve_manuscript(pdir, args.draft, args.submission)
    if manuscript is None or not manuscript.exists():
        fail("没有稿件可打包：给 --draft <库根相对路径>，或把稿子放在 drafts/main.md")

    warnings: list[str] = []
    if journal is None:
        warnings.append("没有期刊档案：投稿包不含 checklist.md（先落 journals/<key>.json）")

    candidates: list[Path] = [manuscript]
    if submission_path is not None:
        candidates.append(submission_path)
    if (pdir / "figures").exists():
        for sidecar_path in sorted((pdir / "figures").rglob("*.json")):
            candidates.append(sidecar_path)
            record = read_json(sidecar_path, {})
            for field in ("file", "originProject", "spec"):
                value = record.get(field)
                if value:
                    candidates.append(_resolve_path(value))
            for value in (record.get("files") or []) + (record.get("sourceData") or []):
                if value:
                    candidates.append(_resolve_path(value))
    for sub in ("data", "tables"):
        base = pdir / sub
        if base.exists():
            candidates.extend(sorted(p for p in base.rglob("*") if p.is_file()))
    if REFS_BIB.exists():
        candidates.append(REFS_BIB)

    entries: list[dict] = []
    zip_entries: list[tuple[str, Path]] = []
    seen: dict[str, Path] = {}
    for candidate in candidates:
        try:
            path = candidate.resolve()
        except OSError:
            continue
        if not path.is_file():
            continue
        name = _zip_name(path)
        if name in seen:
            continue
        seen[name] = path
        entries.append({"path": name, "bytes": path.stat().st_size, "sha256": _sha256(path)})
        zip_entries.append((name, path))
```

</details>

**依据 2 · 源码核查**：[library/scripts/research.py:1416-1429](https://github.com/58catmiao/dsh-sciwork/blob/31efb9101bf8472ad0a934e9c5308f1d1dbf18c2/library/scripts/research.py#L1416-L1429)

检查失败转警告并继续。

<details>
<summary>查看原文（14行）</summary>

```text
    check_counts = None
    if journal is not None:
        report = journal_check(pdir.name, journal_key, draft=args.draft, submission_id=args.submission)
        check_counts = report["counts"]
        if check_counts.get("fail"):
            warnings.append(f"体检还有 {check_counts['fail']} 项不合格（跑 check-journal 看明细）")

    checklist_items = ((journal or {}).get("submission") or {}).get("checklist") or []
    checklist_lines = ["# 投稿清单", ""]
    if journal is not None:
        checklist_lines.append(f"- 目标期刊：{journal.get('name')}（{journal.get('nameZh') or '—'}）")
    checklist_lines += ["", "> 下面这些来自期刊档案的默认值，勾选前逐条对照刊方的投稿系统。", ""]
    checklist_lines += [f"- [ ] {item}" for item in checklist_items] or [
        "- [ ] （档案里没有 checklist：去刊方 Guide for Authors 抄一遍，别凭印象勾）"]
```

</details>

**依据 3 · 源码核查**：[library/scripts/research.py:1436-1448](https://github.com/58catmiao/dsh-sciwork/blob/31efb9101bf8472ad0a934e9c5308f1d1dbf18c2/library/scripts/research.py#L1436-L1448)

manifest 与作者要求以刊方为准。

<details>
<summary>查看原文（13行）</summary>

```text
    manifest = {
        "schema": 1,
        "generatedAt": now(),
        "project": pdir.name,
        "title": meta.get("title"),
        "journal": journal_key,
        "journalName": (journal or {}).get("name"),
        "manuscript": _zip_name(manuscript.resolve()),
        "files": entries,
        "counts": counts,
        "checks": check_counts,
        "warnings": warnings,
        "disclaimer": "期刊档案是默认值；投稿前以刊方现行要求为准。",
```

</details>

#### 缺口

- 未运行 DSH、Python 引擎、Origin 或科研材料
  **影响**：无法证明写入、导出、科学质量与引文真实性
  **进一步探讨**：固定宿主与引擎，在隔离课题验证确认、超时、回执与投稿包

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 如何改进超时后的未知写入状态，值得如何试用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证假设：持久操作 ID 与可查询的 running/completed/unknown 状态，加上执行完成后的回读，可能减少超时后的重复写入。反证是已有参数绑定、成功幂等回放和回执，不能把它们当从零新增；未穷尽其他恢复机制，状态写入本身也可能失败。对照现有实现测慢写、崩溃与并发下的重复、漏报和恢复时间，无改进则否定；用户先用备份课题试用，超时先核对文件再决定。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host/dispatch.js:104-109](https://github.com/58catmiao/dsh-sciwork/blob/31efb9101bf8472ad0a934e9c5308f1d1dbf18c2/lib/host/dispatch.js#L104-L109)

现有超时竞争。

```text
function runWithTimeout(promise, ms, label) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new ResearchError('timeout', `${label} 超时（${Math.round(ms / 1000)}s）`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
```

**依据 2 · 源码核查**：[lib/host/dispatch.js:165-170](https://github.com/58catmiao/dsh-sciwork/blob/31efb9101bf8472ad0a934e9c5308f1d1dbf18c2/lib/host/dispatch.js#L165-L170)

现有成功幂等回放。

```text
  const idemKey = action.effects !== 'read' ? idempotencyKey({ action, params: clean, root }) : null;
  if (idemKey) {
    const hit = lookupIdempotent(idemKey);
    if (hit) {
      logger.info(`[research] ${action.id} 幂等命中，回放上次回执 ${hit.receiptId}`);
      return { ok: true, value: hit.value, receipt: hit.receipt, replayed: true };
```

**依据 3 · 源码核查**：[lib/host/receipts.js:35-52](https://github.com/58catmiao/dsh-sciwork/blob/31efb9101bf8472ad0a934e9c5308f1d1dbf18c2/lib/host/receipts.js#L35-L52)

回执可能失败。

<details>
<summary>查看原文（18行）</summary>

```text

/**
 * 追加一条回执。
 * @returns {{ok:boolean, rel:string, error?:string}}
 */
export function appendReceipt(root, receipt) {
  const rel = receiptsRel(receipt && receipt.startedAtMs ? receipt.startedAtMs : Date.now());
  try {
    const abs = path.join(root, rel.split('/').join(path.sep));
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.appendFileSync(abs, `${JSON.stringify(receipt)}\n`, 'utf8');
    return { ok: true, rel };
  } catch (error) {
    return { ok: false, rel, error: String((error && error.message) || error) };
  }
}

/** 读最近 N 条回执（新的在后）。文件不存在/坏行都不抛。 */
```

</details>

#### 缺口

- 未运行 DSH、Python 引擎、Origin 或科研材料
  **影响**：无法证明写入、导出、科学质量与引文真实性
  **进一步探讨**：固定宿主与引擎，在隔离课题验证确认、超时、回执与投稿包

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
