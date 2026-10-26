# dsh-sciwork

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[7701370](https://github.com/58catmiao/dsh-sciwork/tree/770137004d78120acd5073a24eb62922fb674825)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/58catmiao/dsh-sciwork)
<!-- END META -->

> **实现功能**：提供科研Agent、文件资料库、文献期刊档案、绘图适配和投稿工作台。

> **核心亮点**：普通文件真相与同一动作清单连接面板、agent和CLI，新动作有参数/root绑定确认；Origin能力归上游，不等科学正确认证。[Q01](#research-q01)、[Q02](#research-q02)

> **风险与缺陷**：legacy路径隐式代签；Promise.race超时不取消底层写，回执尽力落盘；格式fail仍可导出，先hash后重读不保证并发快照一致。[Q03](#research-q03)、[Q04](#research-q04)

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
  - [Q01 · 科研预设和普通文件库如何改变文献到投稿交付？](#detail-section-11)
  - [Q02 · 面板、Python引擎、引用检查与导出如何串联？](#detail-section-12)
  - [Q03 · 格式检查能否证明科学/引用正确，导出是否严格放行？](#detail-section-13)
  - [Q04 · 路径、并发、锁及打包摘要的一致性如何？](#detail-section-14)
  - [Q05 · 依赖、首次/持续/恢复成本与可借鉴设计是什么？](#detail-section-15)
  - [Q06 · 冻结输入清单和语义证据检查能否提高复核质量，怎样试用？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：给研究者组织文献、图、稿和投稿材料，科学与引用真实性需人工逐项复核。

普通目录、文献管理器、脚本和人工投稿清单是替代；本轮未对照实际论文完成质量。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 统一动作/工具 | 库资料读写与计划确认 | 新ID需令牌，legacy有隐式兼容 |
| 文件库/课题 | 文献图稿与阶段组织 | 文件为权威，语义需复核 |
| 期刊检查/打包 | 机械缺项和ZIP清单 | fail可警告导出，非认证 |
| 绘图Skill | 路由Origin真机出图 | 依赖独立上游插件/软件 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容DSH Connection/tools/skills | 对应入口必需 | 面板、工具、Skill | 告警或入口不可用 |
| Python及可写科研库 | 库动作必需 | 文件/引用/导出 | 对应动作失败 |
| Origin及上游插件 | 真机绘图必需 | 出图 | 本包不提供替代引擎 |
| 原文与当期刊方规则 | 交付必需 | 语义/投稿验收 | 机械检查不足以放行 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 副本库和依赖接线 | 各入口读取一致动作 |
| 执行 | 读或plan后人工确认写 | 参数/root与计划一致 |
| 验收 | 回读文件、引文及包字节 | timeout先核实，fail不冒充合格 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 本地库、Python及可选Origin软件 | 配库根/引擎/导入 | 软件金额与工时未知 |
| 持续 | 模型/绘图资源与存储 | 引用、方法、期刊要求复核 | 无单位合格包总成本 |
| 失败恢复 | 快照/备份及重试资源 | 查回执与实际文件，辨未知结果 | 超时不代表取消 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 流程组织 | registry与多入口统一 | 真正科研效率改善 |
| 写确认 | 新动作参数/root绑定令牌 | 用户真实授权，legacy为例外 |
| 投稿包 | 检查警告、清单与ZIP | 科学正确及并发字节一致 |

> **思考**：legacy路径隐式代签；Promise.race超时不取消底层写，回执尽力落盘；格式fail仍可导出，先hash后重读不保证并发快照一致。[Q03](#research-q03)、[Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：普通文件真相与同一动作清单连接面板、agent和CLI，新动作有参数/root绑定确认；Origin能力归上游，不等科学正确认证。[Q01](#research-q01)、[Q02](#research-q02)

普通文件真相与同一动作清单连接面板、agent和CLI，新动作有参数/root绑定确认；Origin能力归上游，不等科学正确认证。[Q01](#research-q01)、[Q02](#research-q02)

精确Fetch路由避免抢/api，共享动作registry减少三入口漂移，计划绑定参数/root有用；race超时与尽力回执需升级为可回读未知结果，不能保证恰好一次。[Q02](#research-q02)、[Q04](#research-q04)

<a id="detail-section-5"></a>

### 1.4 主要限制

legacy路径隐式代签；Promise.race超时不取消底层写，回执尽力落盘；格式fail仍可导出，先hash后重读不保证并发快照一致。[Q03](#research-q03)、[Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

先用副本课题验收导入、计划确认和回执，组织功能限定试用；投稿包逐文件及逐引文复核，遇写超时先查实际状态。[Q06](#research-q06)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

统一动作/计划与文件库机制由源码支持；legacy隐式确认、超时未知结果和导出快照存在边界；冻结字节/语义验收方案未验证。

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/host/guards.js、lib/host/dispatch.js、lib/library.js、library/scripts/research.py、lib/tools.js、README.md、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查host、registry接线、计划守卫、执行器、路径及Python打包；未执行目标代码、绘图、真实投稿或完整安全审计。
- 下一步：可进一步在副本库注入延迟、并发改源和回执失败，并逐引文核对同一课题的合格产物与总人工时间。

**分析版本**

- **仓库**：[58catmiao/dsh-sciwork](https://github.com/58catmiao/dsh-sciwork)
- **版本号**：0.3.15（[固定提交 7701370](https://github.com/58catmiao/dsh-sciwork/tree/770137004d78120acd5073a24eb62922fb674825)）
- **版本日期**：2026-10-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是冻结导出字节、分离机械与语义放行，以及operationId回读未知结果后重试；故障矩阵检验一致摘要和不重复执行。[Q06](#research-q06)

可进一步在副本库注入延迟、并发改源和回执失败，并逐引文核对同一课题的合格产物与总人工时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 19 | 3879 | — | — | 63568 |
| .js | source | 33 | 10452 | 8458 | 1361 | — |
| .mjs | source | 16 | 4568 | 3739 | 504 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/58catmiao/dsh-sciwork/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/58catmiao/dsh-sciwork/issues?q=is%3Aissue+created%3A2026-09-26T01%3A59%3A33.546Z..2026-10-26T01%3A59%3A33.546Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/58catmiao/dsh-sciwork/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T01%3A59%3A33.546Z..2026-10-26T01%3A59%3A33.546Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对科研工作台动作统一、确认和回执机制及投稿证据边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 科研预设和普通文件库如何改变文献到投稿交付？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向需要把资料、图表、稿件和投稿状态连起来的科研用户。合格交付既要文件可回读、引用可追溯，也要科学论断和目标期刊要求人工复核。相对分散文件夹/脚本，贡献在普通文件为权威、索引可重建的工作台及面板/agent/CLI共用动作表，而不是自动证明科学正确。Origin绘图来自独立上游插件，本项目只带适配技能；期刊档案和检查表提供辅助，不能当官方当期规范或投稿认证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:17-34](https://github.com/58catmiao/dsh-sciwork/blob/770137004d78120acd5073a24eb62922fb674825/README.md#L17-L34)

作者描述文件权威、动作清单与上游绘图归属。

<details>
<summary>查看原文（18行）</summary>

```text
`dsh-sciwork` 不是一个"帮你查文献"的对话框，而是一套**落在你硬盘上、可被别的工具打开**的科研工作台。装上它，你会同时得到四样东西：

1. **一个 agent 预设「科研模式」**——它把绘图、写作、文献、期刊规范四条线收进同一个工作流：先找证据，再动手；出图走 Origin 真机，稿子里引用的每一条文献都必须带 DOI 或 URL。
2. **一个本机实体科研库**——一棵普通目录（课题 / 图表 / 数据 / 草稿 / 文献 / 期刊档案 / 投稿），配套一个 Python 引擎 `research.py` 和一个登记索引。
3. **12 份期刊投稿档案**——Nature、Science、Cell、IEEE Trans、ACS、Elsevier 通用、MDPI、PLOS ONE、中文核心、CNKI 学位论文、GB/T 7714、通用学位论文，各自的数值要求、条款与出处摘要。
4. **一个「科研库」可视面板 + 一组技能**——默认是工作台，旧面板七个页签一键可回，只读为主、能筛能导入能归档；技能负责把"该怎么画、该怎么写、该怎么引"固化成纪律。

**权威来源永远是文件系统。** 索引只是缓存，面板的写入永远走库脚本，不直接改索引。所以科研库随时可以整目录打包带迁移，也可以直接用资源管理器、Git、别的编辑器去碰。

- 宿主半边是纯 Node ESM，**零 npm 依赖**。
- 客户端是手写的单文件 Web 客户端，**没有构建步骤**。
- 出图能力依赖上游开源插件 [dsh-origin-plugin](https://github.com/Fantasality/dsh-origin-plugin)（MIT，作者 Fantasality）。**本仓库不包含它**，只带适配技能。详见〈与 dsh-origin-plugin 的关系〉。

## 0.3 有什么不同

- **一条能力清单**：动作登记表驱动面板、agent 工具与命令行三个入口，新能力只写一份。
- **写动作要确认**：先计划（会写哪些文件、有什么 warning），再确认（一次性令牌），最后留回执；读动作不写库。
- **课题是一等公民**：七阶段机 + 产物 sha256；旧库课题第一次写之前会提示迁移（先备份、幂等、可回滚）。
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 面板、Python引擎、引用检查与导出如何串联？

**研究主题**：功能与机制

#### 完整回答

host注册精确research/call路由而不抢占/api拦截器，统一信封调用动作执行器。tools把registry里显式expose动作映射为宿主工具，窄化工具schema但执行仍用完整参数校验。新写动作先plan，令牌绑定actionId、参数hash和root并在执行前消费；Python引擎负责部分库/引用/投稿动作。导出先收集候选路径和摘要、运行期刊检查后打ZIP；检查fail仅增加warning，仍可生成包。接线统一改善维护，不等严格质量放行。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:7-30](https://github.com/58catmiao/dsh-sciwork/blob/770137004d78120acd5073a24eb62922fb674825/lib/index.js#L7-L30)

精确路由避免与api-gateway冲突。

<details>
<summary>查看原文（24行）</summary>

```text
 * 为什么用「精确 Fetch 路由」而不是 `intercept('/api', …)`（2026-10-11 定案）：
 *   - `@deepseek-ai/dsh-api-gateway` 已经占用了 `/api` **唯一**的那个拦截器
 *     （`connection.rpc.intercept('/api', …)`，见该包 `lib/types/index.js`）；
 *     `HostConnectionRpc.intercept` 的契约是「一个通道只允许一个拦截器」，
 *     谁先注册谁赢，另一个直接 throw。
 *   - 我们若抢先注册成功，官方端点（`settings/describe`、`credentials/describe`、
 *     `agentPresets/list` …）全部落进 `createSharedFetchHandler` 的
 *     `!interceptor.matches(endpoint)` 分支 → `new Response('not found', { status: 404 })`，
 *     桌面主进程的欢迎流程（`main.js` → `POST /api/settings/describe`）随即抛
 *     `desktop welcome: Web request failed` → `reportFatal(error, 'main')` →
 *     原生恢复对话框 → `sanitizeProfile()` 把 profile 补丁改名、bundles 摘掉。
 *     这就是两次「重启即崩」的真凶（证据见 HANDOFF.md §5.5）。
 *   - `connection.rpc.fetch.register()` 注册的是 `/api/<endpoint>` **精确路由**，
 *     `createSharedFetchHandler` 里精确路由**优先于**拦截器匹配，因此与
 *     api-gateway 完全共存；同时它挂在 `/api` 前缀路由之下，自动继承
 *     **Host/Origin 信任栅栏 + 浏览器会话认证 + 请求体上限**，不用自己实现鉴权。
 *   - 客户端只需 `ctx.get('connection').rpc.call('/api', 'research/call', payload)`。
 *
 * 信封协议：与 Connection 的 `rpcFetchHandler` 对齐（同一个包内非导出函数，故此处等价复刻）：
 *   请求  { type: 'client-request', rpcId, method, payload: { args } }
 *   成功  { type: 'server-response', rpcId, result }
 *   失败  { type: 'server-response', rpcId, result: { ok: false, error } }
 *
 * 生命周期：注册用 `ctx.effect` 挂在插件 fiber 上，Harness 卸载/热更时自动撤销。
```

</details>

**依据 2 · 源码核查**：[lib/tools.js:1-17](https://github.com/58catmiao/dsh-sciwork/blob/770137004d78120acd5073a24eb62922fb674825/lib/tools.js#L1-L17)

工具暴露和schema/校验边界。

<details>
<summary>查看原文（17行）</summary>

```text
/**
 * 科研模式 0.3 · 工具暴露（PLAN §10.2）
 * ---------------------------------------------------------------------------
 * 把 `tool.expose: true` 的动作映射成宿主工具（名字显式写在描述符的 `tool.name`，
 * 不从 id 猜）；读动作直接可调，写动作第一次只回计划，必须再调 `sciwork_action_confirm`。
 *
 * 两条硬约束（2026-10-21 对照本机 dsh-comfyui-image 的实现核对）：
 *   1. `tools.register()` 吃普通对象，**不 import 任何 @deepseek-ai/* 宿主包**
 *      （link 安装时从物理路径解析必 ERR_MODULE_NOT_FOUND）。
 *   2. DSH 的 JSON Schema 是子集：`minimum`/`maximum`/`format`/联合类型会被拒，
 *      所以这里把动作参数 schema 窄化成工具 schema，运行时校验仍走 `validateParams`。
 */

import { ensureRegistered } from './actions/index.js';
import { catalog } from './host/registry.js';
import { dispatch, planAction } from './host/dispatch.js';
import { settingsNow } from './host/engine.js';
```

</details>

**依据 3 · 源码核查**：[lib/host/guards.js:121-150](https://github.com/58catmiao/dsh-sciwork/blob/770137004d78120acd5073a24eb62922fb674825/lib/host/guards.js#L121-L150)

一次性参数/root绑定。

<details>
<summary>查看原文（30行）</summary>

```text
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
  if (plan.paramsHash !== paramsHash(params)) {
    throw denied('参数与计划不一致（令牌已失效，请重新计划）', { planId: id, planRequired: true });
  }
  if (plan.root !== String(root)) {
    throw denied('计划绑定的库根与当前库根不一致', { planId: id, planRequired: true });
  }
  PLANS.delete(id);   // 一次性：先删再执行，执行失败也不能复用
  return { ok: true };
```

</details>

**依据 4 · 源码核查**：[library/scripts/research.py:1414-1419](https://github.com/58catmiao/dsh-sciwork/blob/770137004d78120acd5073a24eb62922fb674825/library/scripts/research.py#L1414-L1419)

检查失败只是warning。

```text
    check_counts = None
    if journal is not None:
        report = journal_check(pdir.name, journal_key, draft=args.draft, submission_id=args.submission)
        check_counts = report["counts"]
        if check_counts.get("fail"):
            warnings.append(f"体检还有 {check_counts['fail']} 项不合格（跑 check-journal 看明细）")
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 格式检查能否证明科学/引用正确，导出是否严格放行？

**研究主题**：缺陷与关键质疑

#### 完整回答

不能。引用键、字段和期刊格式检查只能发现机械缺项，文献原文是否支持论断、数据处理是否正确仍需研究者核验。ZIP在fail时可继续，manifest有摘要也不代表语义通过。legacy别名和confirm:legacy在同一请求内生成隐式确认，而非用户看过计划后批准；因此“写动作都确认”须限定新动作路径，旧面板兼容是明确例外。模型拿到令牌本身也不是用户授权证明，工具说明要求展示计划取得同意仍依赖执行者行为。

#### 证据与依据

**依据 1 · 源码核查**：[library/scripts/research.py:1414-1427](https://github.com/58catmiao/dsh-sciwork/blob/770137004d78120acd5073a24eb62922fb674825/library/scripts/research.py#L1414-L1427)

检查结果是警告且checklist要求回刊方核对。

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

**依据 2 · 源码核查**：[lib/host/dispatch.js:143-156](https://github.com/58catmiao/dsh-sciwork/blob/770137004d78120acd5073a24eb62922fb674825/lib/host/dispatch.js#L143-L156)

旧别名/legacy确认的真实例外。

<details>
<summary>查看原文（14行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[lib/tools.js:60-65](https://github.com/58catmiao/dsh-sciwork/blob/770137004d78120acd5073a24eb62922fb674825/lib/tools.js#L60-L65)

用户同意由调用流程要求而非令牌内证明。

```text
function toolDescription(action) {
  const parts = [action.title, action.description].filter(Boolean);
  parts.push(`effects: ${action.effects}；confirm: ${action.confirm}。`);
  if (action.effects !== 'read') {
    parts.push('这是写动作：直接调用只会返回计划（needs-confirmation）；把计划给用户看、得到同意后，再调 sciwork_action_confirm 带 planId+token 执行。');
  }
```

#### 缺口

- 真实论文论断支持与期刊当期合规无独立验证
  **影响**：不能把检查/打包成功当投稿就绪
  **进一步探讨**：抽样逐引文对原文和方法数据，并以刊方当期说明逐项核对

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 路径、并发、锁及打包摘要的一致性如何？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

Node路径闸门是path.resolve/relative词法检查，没有realpath符号链接围栏，因此不能概括为物理文件隔离。dispatch用Promise.race超时，但不把取消信号传给action；超时返回失败后底层写入仍可能继续，幂等缓存只在成功结束后登记，盲目重试可能重复动作。回执落盘失败只加warning不回滚主动作。ZIP先hash源文件后再archive.write重读，源并发修改时manifest与归档字节可能不一致；这是静态时间窗口，未独立复现。

#### 证据与依据

**依据 1 · 源码核查**：[lib/library.js:196-205](https://github.com/58catmiao/dsh-sciwork/blob/770137004d78120acd5073a24eb62922fb674825/lib/library.js#L196-L205)

词法路径校验而无realpath。

<details>
<summary>查看原文（10行）</summary>

```text
export function resolveInside(root, rel) {
  if (typeof rel !== 'string' || rel.trim() === '') throw new Error('空路径');
  const raw = rel.replace(/\\/g, '/').trim();
  if (/^[a-zA-Z]:/.test(raw) || raw.startsWith('/')) throw new Error('只接受库根相对路径');
  const abs = path.resolve(root, raw);
  const relBack = path.relative(root, abs);
  if (relBack === '' || relBack.startsWith('..') || path.isAbsolute(relBack)) {
    throw new Error('路径越出科研库范围');
  }
  return abs;
```

</details>

**依据 2 · 源码核查**：[lib/host/dispatch.js:104-109](https://github.com/58catmiao/dsh-sciwork/blob/770137004d78120acd5073a24eb62922fb674825/lib/host/dispatch.js#L104-L109)

超时race不取消任务。

```text
function runWithTimeout(promise, ms, label) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new ResearchError('timeout', `${label} 超时（${Math.round(ms / 1000)}s）`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
```

**依据 3 · 源码核查**：[lib/host/dispatch.js:193-207](https://github.com/58catmiao/dsh-sciwork/blob/770137004d78120acd5073a24eb62922fb674825/lib/host/dispatch.js#L193-L207)

超时/错误回执无法保证动作未执行。

<details>
<summary>查看原文（15行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[lib/host/dispatch.js:220-229](https://github.com/58catmiao/dsh-sciwork/blob/770137004d78120acd5073a24eb62922fb674825/lib/host/dispatch.js#L220-L229)

回执失败保留成功，幂等在成功尾部登记。

<details>
<summary>查看原文（10行）</summary>

```text
  const written = appendReceipt(root, receipt);
  if (!written.ok) {
    receipt.warnings.push(`回执落盘失败：${written.error}`);
    logger.warn(`[research] 回执落盘失败：${written.error}`);
  }
  receipt.receiptPath = written.rel;

  if (idemKey) rememberIdempotent(idemKey, { value, receipt });
  logger.info(`[research] ${action.id} ok ${receipt.durationMs}ms receipt=${receiptId}`);
  return { ok: true, value, receipt };
```

</details>

**依据 5 · 源码核查**：[library/scripts/research.py:1400-1412](https://github.com/58catmiao/dsh-sciwork/blob/770137004d78120acd5073a24eb62922fb674825/library/scripts/research.py#L1400-L1412)

摘要先读取来源。

<details>
<summary>查看原文（13行）</summary>

```text
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

**依据 6 · 源码核查**：[library/scripts/research.py:1458-1462](https://github.com/58catmiao/dsh-sciwork/blob/770137004d78120acd5073a24eb62922fb674825/library/scripts/research.py#L1458-L1462)

ZIP稍后重新读取同一文件。

```text
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as archive:
        archive.writestr("manifest.json", json.dumps(manifest, ensure_ascii=False, indent=1) + "\n")
        archive.writestr("checklist.md", checklist_md)
        for name, path in zip_entries:
            archive.write(path, arcname=name)
```

#### 缺口

- 超时后实际落盘和并发快照一致性缺乏隔离故障证据
  **影响**：未知结果不能按明确失败直接重试
  **进一步探讨**：注入延迟动作/写回执失败与源文件改动，核对最终文件及重复调用结果

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 依赖、首次/持续/恢复成本与可借鉴设计是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

host是Node ESM且无npm运行依赖，不代表整条科研流程无依赖；Python处理库，真实Origin出图需另装插件/软件，期刊和来源访问仍受网络与人工判断限制。首次配置库根、Python、绘图与导入；持续花费模型、绘图软件和人工证据核验；失败需回读收据与实际文件，不能仅看timeout。可借鉴动作单源registry、精确路由、参数/root绑定计划和文件权威设计；移植需保留宿主schema兼容及未知结果恢复协议。没有同任务总费用/合格投稿包对照，不给ROI。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:24-34](https://github.com/58catmiao/dsh-sciwork/blob/770137004d78120acd5073a24eb62922fb674825/README.md#L24-L34)

文件权威、零npm边界及上游Origin依赖。

<details>
<summary>查看原文（11行）</summary>

```text
**权威来源永远是文件系统。** 索引只是缓存，面板的写入永远走库脚本，不直接改索引。所以科研库随时可以整目录打包带迁移，也可以直接用资源管理器、Git、别的编辑器去碰。

- 宿主半边是纯 Node ESM，**零 npm 依赖**。
- 客户端是手写的单文件 Web 客户端，**没有构建步骤**。
- 出图能力依赖上游开源插件 [dsh-origin-plugin](https://github.com/Fantasality/dsh-origin-plugin)（MIT，作者 Fantasality）。**本仓库不包含它**，只带适配技能。详见〈与 dsh-origin-plugin 的关系〉。

## 0.3 有什么不同

- **一条能力清单**：动作登记表驱动面板、agent 工具与命令行三个入口，新能力只写一份。
- **写动作要确认**：先计划（会写哪些文件、有什么 warning），再确认（一次性令牌），最后留回执；读动作不写库。
- **课题是一等公民**：七阶段机 + 产物 sha256；旧库课题第一次写之前会提示迁移（先备份、幂等、可回滚）。
```

</details>

**依据 2 · 源码核查**：[lib/host/guards.js:88-113](https://github.com/58catmiao/dsh-sciwork/blob/770137004d78120acd5073a24eb62922fb674825/lib/host/guards.js#L88-L113)

计划保存明确参数/root与预览。

<details>
<summary>查看原文（26行）</summary>

```text
export function issuePlan({ action, params, root, diff, writes, warnings, ttlMs = PLAN_TTL_MS }) {
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
    diff: list(diff),
    writes: list(writes),
    warnings: list(warnings),
```

</details>

**依据 3 · 源码核查**：[lib/host/dispatch.js:193-229](https://github.com/58catmiao/dsh-sciwork/blob/770137004d78120acd5073a24eb62922fb674825/lib/host/dispatch.js#L193-L229)

执行与回执状态影响恢复成本。

<details>
<summary>查看原文（37行）</summary>

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
  receipt.wrote = wroteFrom(value);
  receipt.summary = summaryFrom(value);
  for (const w of warningsFrom(value)) if (!warnings.includes(w)) warnings.push(w);
  receipt.warnings = warnings;

  if (!audited) {
    logger.info(`[research] ${action.id} ok ${receipt.durationMs}ms（读动作，不留回执）`);
    return { ok: true, value, receipt: null };
  }
  const written = appendReceipt(root, receipt);
  if (!written.ok) {
    receipt.warnings.push(`回执落盘失败：${written.error}`);
    logger.warn(`[research] 回执落盘失败：${written.error}`);
  }
  receipt.receiptPath = written.rel;

  if (idemKey) rememberIdempotent(idemKey, { value, receipt });
  logger.info(`[research] ${action.id} ok ${receipt.durationMs}ms receipt=${receiptId}`);
  return { ok: true, value, receipt };
```

</details>

#### 缺口

- 完整科研任务质量、总模型/人工/软件成本未知
  **影响**：无法确认工作台是否抵消维护负担
  **进一步探讨**：同课题对照普通目录脚本，计入引用复核、出图重试和包一致性检查

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 冻结输入清单和语义证据检查能否提高复核质量，怎样试用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证方向是导出从冻结字节快照生成摘要和ZIP，并把机械检查与人工语义证据验收分成不同放行条件；写动作超时返回outcome_unknown并提供可回读operationId，确认真实状态后才重试。由源文件重读窗口和不可取消race推导，代价是快照空间、操作日志和人工审核。用并发修改、超时后完成、回执失败与错误引文矩阵测试摘要一致和不重复执行，再比较人工核验总时间。已有可备份资料库的人可试用组织功能，关键投稿包与写失败必须核对实际文件；不应无人值守据绿色检查投稿。

#### 证据与依据

**依据 1 · 源码核查**：[library/scripts/research.py:1400-1412](https://github.com/58catmiao/dsh-sciwork/blob/770137004d78120acd5073a24eb62922fb674825/library/scripts/research.py#L1400-L1412)

导出来源字节可冻结。

<details>
<summary>查看原文（13行）</summary>

```text
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

**依据 2 · 源码核查**：[library/scripts/research.py:1458-1462](https://github.com/58catmiao/dsh-sciwork/blob/770137004d78120acd5073a24eb62922fb674825/library/scripts/research.py#L1458-L1462)

同快照可避免二次读取漂移。

```text
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as archive:
        archive.writestr("manifest.json", json.dumps(manifest, ensure_ascii=False, indent=1) + "\n")
        archive.writestr("checklist.md", checklist_md)
        for name, path in zip_entries:
            archive.write(path, arcname=name)
```

**依据 3 · 源码核查**：[lib/host/dispatch.js:104-109](https://github.com/58catmiao/dsh-sciwork/blob/770137004d78120acd5073a24eb62922fb674825/lib/host/dispatch.js#L104-L109)

race需要未知结果状态而不是假定取消。

```text
function runWithTimeout(promise, ms, label) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new ResearchError('timeout', `${label} 超时（${Math.round(ms / 1000)}s）`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
```

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
