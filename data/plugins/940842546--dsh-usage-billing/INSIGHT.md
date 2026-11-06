# dsh-usage-billing

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[c727786](https://github.com/940842546/dsh-usage-billing/tree/c727786685b4a19df31e8fcd7754378ba4882764)

<!-- BEGIN META -->
[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/940842546/dsh-usage-billing) [![npm 30d 515](https://img.shields.io/static/v1?label=npm+30d&message=515&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-usage-billing) [![最新发布 2026-09-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-usage-billing)
<!-- END META -->

> **功能**：统计 DSH 本机会话的模型用量与费用估算，提供预算提醒、图表、导出和模型查询工具。

> **亮点**：相对离线脚本，它将会话归因、估算和预算提醒接入 DSH 的工作界面，模型也能查询本地统计；这是可解释的集成增量，未证明净节时或账单准确性。调用采集和token数据来自宿主，价格计算与展示由组件组织，不把上游能力当原创，见 [Q01](#research-q01) 和 [Q04](#research-q04)。

> **主要限制**：回填读到部分会话失败仍替换整库，且实时与历史入口没有共享调用身份去重。因此“成功回填”不等于统计完整，重叠调用存在重复累加路径；多实例心跳也只是告警。该限制触及费用观察本身，当前仅建议观察，不将面板用于结算或硬预算限制，见 [Q02](#research-q02) 和 [Q05](#research-q05)。

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
  - [Q01 · 谁需要会话归因，插件相较查账户总账增加什么？](#detail-section-11)
  - [Q02 · 流式调用和历史日志如何进入同一统计，异常是否保全？](#detail-section-12)
  - [Q03 · 价格与模型识别是否足以支撑费用数字？](#detail-section-13)
  - [Q04 · 如何加载、展示、导出和恢复，依赖与操作责任是什么？](#detail-section-14)
  - [Q05 · 首次、持续与失败恢复成本能否换来可验证效果，应如何试用？](#detail-section-15)
  - [Q06 · 可从哪些已核机制推导更可靠的费用观察设计？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向在单台机器上反复使用 DSH、需要回查每个会话用量的人。合格结果是调用只计一次、会话可归因、同一输入重复回填不漂移；实际需求强度及与账户账单的关系见 [Q01](#research-q01)。

比较基线是从原始会话日志提取 usage 后用脚本或表格归类；官方余额页面只用于看账户余量。本轮没有核对当前宿主全部原生面板，不声称本组件独占该能力。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 流式用量归因 | 按会话、日期、模型记录token与估算金额 | 需要usage和正确模型映射；不证明实际收费 |
| 历史回填 | 从会话日志重建统计 | 部分读取失败仍替换；与实时调用无共享ID去重 |
| usage_billing模型工具 | 查询今日、本月、累计用量 | 本地全局统计，不是逐用户隔离账本 |
| 图表与会话面板 | 在使用界面查消费分布 | Web客户端与宿主slot必须可用 |
| CSV与JSON导出 | 外部查阅及备份统计 | 未见配套导入还原；CSV有公式前缀转义 |
| 预算告警 | 达到阈值时提示 | 不阻断后续调用 |
| 官方余额查询 | 显示账户可用余额 | 可选凭据及外网；不能证明会话金额正确 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Host 与 @deepseek-ai/dsh-tools 声明范围 >=0.1.0-rc.6 <0.3.0-0 | 启动必需 | 事件、工具、文件与会话查询 | 服务缺失可能无法加载；本轮未验兼容 |
| Web client ModuleLoader、React、slots与sessions | 界面必需 | 设置页及会话用量显示 | 只存在Host不保证显示 |
| 写策略根可写且单实例 | 持久化必需 | 共享JSON与副本 | 保存失败或并发覆盖，须看诊断 |
| 准确usage、模型映射和日期价目 | 估算有效必需 | 将token折算金额 | 零价或错档，不可当账单 |
| DeepSeek API Key及外网 | 余额功能可选 | 查询账户总余额 | 未配置静默跳过，可关闭 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户备份统计和原始日志，核对profile与模型价目 | 记录实际写根，不以安装返回代替加载 |
| 加载 | Host补丁注册事件与路由，客户端挂载四处界面 | 检查面板可读及保存诊断；错误时停下排查 |
| 记录 | 插件采集usage并延迟保存，用户查会话与导出 | 核对调用及token，未知模型单独检查 |
| 回填验收 | 用户停止新调用后重建并比较前后导出 | 任一会话读取失败或计数漂移均不验收为完整 |
| 退出 | 用户先导出并保留原文件，再从使用profile移除插件 | 回到原始日志与账户记录；本轮未实操卸载 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 本地安装、日志扫描和存储；金额未知 | 安装、备份、核对模型与价目；耗时未知 | 需兼容Host与可写策略根 |
| 持续使用 | 多维JSON、面板轮询，可选余额网络请求；资源量未知 | 维护价目、日期、汇率并核对异常 | 插件不新增用于统计的模型调用，但不能据此称总成本为0 |
| 失败恢复 | 重建扫描与备份存储；资源量未知 | 查读取失败、对照日志、修复写策略；工时未知 | .tmp不是跨进程事务，回填可能替换不完整数据 |
| 退出 | 保留导出与日志的存储；金额未知 | 移除profile挂载并恢复原查询办法；耗时未知 | 未见内置JSON导入还原，不以导出等同完整恢复 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话可见性 | 源码把流usage归入会话、模型、日期并接到界面 | 会话归因在全部宿主异步路径是否正确 |
| 费用观察 | 固定价目和自定义模型规则可算估算 | 与实际供应商逐调用账单的差异 |
| 预算提醒 | 阈值生成告警事件，界面轮询提示 | 是否减少超支；它不阻断请求 |
| 回填恢复 | 草稿构建后替换，界面保留旧读视图 | 实时交错、部分会话读取失败时的计数完整性 |

> **思考**：回填读到部分会话失败仍替换整库，且实时与历史入口没有共享调用身份去重。因此“成功回填”不等于统计完整，重叠调用存在重复累加路径；多实例心跳也只是告警。该限制触及费用观察本身，当前仅建议观察，不将面板用于结算或硬预算限制，见 [Q02](#research-q02) 和 [Q05](#research-q05)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对离线脚本，它将会话归因、估算和预算提醒接入 DSH 的工作界面，模型也能查询本地统计；这是可解释的集成增量，未证明净节时或账单准确性。调用采集和token数据来自宿主，价格计算与展示由组件组织，不把上游能力当原创，见 [Q01](#research-q01) 和 [Q04](#research-q04)。

值得借鉴的是Host与client分面、视图按用途裁剪响应、CSV单元格防公式注入以及界面局部错误边界。复用这些机制时仍需对照宿主接口，不能从单包免构建推导零维护。草稿旧读视图减少中间态暴露，但去重、部分失败保全及多写者互斥尚不完整，见 [Q02](#research-q02)和[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

回填读到部分会话失败仍替换整库，且实时与历史入口没有共享调用身份去重。因此“成功回填”不等于统计完整，重叠调用存在重复累加路径；多实例心跳也只是告警。该限制触及费用观察本身，当前仅建议观察，不将面板用于结算或硬预算限制，见 [Q02](#research-q02) 和 [Q05](#research-q05)。

<a id="detail-section-6"></a>

### 1.5 使用建议

当前建议观察，暂不把它作为结算或硬预算依据。希望继续评估的单实例用户应先留存原始日志和统计备份，避免一边运行模型一边回填；以同一静止日志做重复回填并逐项核对调用及token。若回填后会话消失、计数增长或写盘错误持续，就停止依赖金额和告警，使用账户记录与原始日志核对。具体判据及未执行边界见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

界面与统计集成是源码支持的现有机制；费用准确性和节时没有实测依据。调用账本是研究者提出的未验证设计假设，不属于插件已实现能力。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、lib/index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：已检查固定提交的README、package、bundle补丁及Host入口、计价、流采集、回填、持久化、路由、工具，与client请求及挂载链路。INVENTORY覆盖组件完整tracked范围；客户端样式与图表细节未作逐行全面审计，不将关键链路抽读称为完整代码审计。
- 下一步：- 已检查固定版本源码和作者说明，证据层级为源码核查。
- 未执行目标代码、安装、模型调用、官方余额请求或宿主验收。
- 默认价目与当前官方收费未独立核实，作者兼容说明不视为本轮实测。
- 重建与实时重叠影响是源码路径推断，未运行复现。

**分析版本**

- **仓库**：[940842546/dsh-usage-billing](https://github.com/940842546/dsh-usage-billing)
- **版本号**：0.11.0（[固定提交 c727786](https://github.com/940842546/dsh-usage-billing/tree/c727786685b4a19df31e8fcd7754378ba4882764)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是把调用事实账本与价目视图分开，用稳定调用身份合并实时和回填，保留不可读会话的旧事实并显示覆盖缺口。它可能改善重算和解释差额，但引入身份映射、迁移及存储负担；验证与推翻条件见 [Q06](#research-q06)。

- 已检查固定版本源码和作者说明，证据层级为源码核查。
- 未执行目标代码、安装、模型调用、官方余额请求或宿主验收。
- 默认价目与当前官方收费未独立核实，作者兼容说明不视为本轮实测。
- 重建与实时重叠影响是源码路径推断，未运行复现。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 577 | — | — | 6846 |
| .js | source | 2 | 3598 | 3265 | 178 | — |
| .mjs | test | 4 | 726 | 621 | 53 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/940842546/dsh-usage-billing/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/940842546/dsh-usage-billing/issues?q=is%3Aissue+created%3A2026-10-07T02%3A09%3A31.809Z..2026-11-06T02%3A09%3A31.809Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/940842546/dsh-usage-billing/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T02%3A09%3A31.809Z..2026-11-06T02%3A09%3A31.809Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本能否为单实例 DSH 用户提供可核对的会话成本观察，以及什么条件阻止它成为账单依据？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要会话归因，插件相较查账户总账增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它面向在同一台机器上反复使用 DSH、希望知道哪次会话消耗多少 token 的人，而不是需要跨成员结算的财务人员。作者把自动采集、历史回填和会话面板作为目标；源码确实将每条用量同时累加到会话、日期、模型和时段。合格结果应是用户选定一个会话后能回查它的调用数和费用估算，且重启或回填不会改变同一组调用的计数。

简单替代是从会话日志提取 usage 后用表格或脚本归类计算；账户余额则回答还剩多少资金，不能单独解释本机哪次会话消耗了多少。本组件的增量是将归因和显示接入使用中的界面，并提供可由模型调用的查询工具，不是发明 token 计费公式。对只关心账户余额或偶尔查看总消耗的人，这种持续采集未必比账户页面划算。此处没有核实当前宿主是否另有同等内置面板，也没有同任务人工对照，因此不宣称它独占能力或已节省时间。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-18](https://github.com/940842546/dsh-usage-billing/blob/c727786685b4a19df31e8fcd7754378ba4882764/README.md#L7-L18)

作者自述本机所有会话、自动采集和回填目标。

<details>
<summary>查看原文（12行）</summary>

```text
针对 DeepSeek Harness 的**免构建**双面插件：自动统计本机所有会话的 DeepSeek 模型调用，按官方定价分段计费，并在主界面与设置页提供图表化的用量面板。

> 计费口径：2026-08-17 00:00（北京时间）前旧价；之后峰谷定价（高峰为**工作日** 9:00–12:00、14:00–18:00（2026-08-23 起生效，此前周末同样计高峰），空闲价为高峰价的一半；9/10 12:00 起 flash 系列再次调价（空闲 hit 0.02 / miss 1 / out 4，高峰 ×2，pro 不变；V4 Pro 官方已确认 9/14 后继续提供服务、计费方式不变（仍按 pro 价；插件保留路由开关供将来官方恢复路由时开启，当前关闭）））。**法定节假日与调休上班的周末全天空闲计费**（内置 2026 年国务院放假安排，可在设置中自行增补）。价格表见文末。

## 功能

- **全自动统计**：监听 `llm/stream`，所有会话的每次模型调用都会被记录（输入/输出/缓存命中/未命中 tokens）
- **历史回填**：首次启动自动扫描本机会话日志，重建历史用量与消费，并附会话标题
- **分段计费**：按北京时间自动归入「调价前旧价 / 调价后高峰 / 调价后空闲」三段（2026-08-23 起高峰仅限工作日，周末全天空闲；此前周末同样计高峰；**法定节假日与调休上班日全天空闲**，节假日名单可在设置页编辑，2027 年安排公布后可自行增补）
- **预算告警通知**：跨 80%/100% 阈值时桌面 toast 主动提醒（每日每档一次），进度条临近变橙、超支变红
- **定价可配置**：价格表、高峰时段、调价边界日期、美元汇率均可编辑（改动只对后续调用生效），一键恢复默认
- **第三方模型计价**：glm / grok / hy4 等非 DeepSeek 模型默认归入「其他模型」不计费；可在设置页添加自定义价目规则（模型名子串匹配，支持 CNY / USD 单价，USD 按汇率折算），之后这些调用也会产生真实花费
```

</details>

**依据 2 · 源码核查**：[lib/index.js:809-840](https://github.com/940842546/dsh-usage-billing/blob/c727786685b4a19df31e8fcd7754378ba4882764/lib/index.js#L809-L840)

同一条目被分配到会话、日期和小时，支持本地归因增量。

<details>
<summary>查看原文（32行）</summary>

```text
      sb.calls += 1;
      sb.input += entry.input;
      sb.cacheHit += entry.cacheHit;
      sb.cacheMiss += entry.cacheMiss;
      sb.output += entry.output;
      sb.cost = roundCost(sb.cost + entry.cost);
      if (ts > sb.lastAt) sb.lastAt = ts;
      // 会话内「时段 / 模型」聚合：详情面板据此显示准确分布（recent 只有 50 条，不可用于长会话）
      if (!sb.byBand || typeof sb.byBand !== 'object') sb.byBand = {};
      const sbb = sb.byBand[band] || (sb.byBand[band] = { calls: 0, cost: 0 });
      sbb.calls += 1;
      sbb.cost = roundCost(sbb.cost + cost);
      if (!sb.byModel || typeof sb.byModel !== 'object') sb.byModel = {};
      const sbm = sb.byModel[model] || (sb.byModel[model] = { calls: 0, cost: 0 });
      sbm.calls += 1;
      sbm.cost = roundCost(sbm.cost + cost);
      const bp = beijingParts(ts);
      if (!target.byDay[bp.date]) target.byDay[bp.date] = bucket();
      add(target.byDay[bp.date], entry);
      const hourKey = bp.date + ' ' + pad(bp.hour);
      if (!target.byHour[hourKey]) target.byHour[hourKey] = bucket();
      add(target.byHour[hourKey], entry);
      // 小时桶只保留最近 7 天
      const hourKeys = Object.keys(target.byHour);
      if (hourKeys.length > 200) {
        const cutoff = beijingParts(ts - 7 * 86400 * 1000).date;
        for (const k of hourKeys) if (k < cutoff) delete target.byHour[k];
      }
      target.recent.unshift({
        ts, time: bp.time, model: modelName, modelKey: model, band, sessionId: sid,
        input: usage.input, cacheHit: hit, cacheMiss: miss, output: out, cost,
      });
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1187-1218](https://github.com/940842546/dsh-usage-billing/blob/c727786685b4a19df31e8fcd7754378ba4882764/lib/index.js#L1187-L1218)

查询工具注册并返回总计及各维度，增加模型可查询入口。

<details>
<summary>查看原文（32行）</summary>

```text
      const scope = args && (args.scope === 'today' || args.scope === 'month') ? args.scope : 'all';
      const cfg = stats.config || defaultConfig();
      const budget = computeBudget(stats, cfg);
      const scopeTotals = scopeAggregate(stats, scope);
      const scopeLabel = scope === 'today' ? '今日' : scope === 'month' ? '本月' : '';
      return {
        ok: true,
        scope,
        summary: formatSummary(stats, cfg, budget, balanceState, scopeLabel, scopeTotals),
        total: scopeTotals || stats.total,
        byBand: stats.byBand,
        byModel: stats.byModel,
        bySession: stats.bySession,
        byDay: stats.byDay,
        byHour: stats.byHour,
        meta: stats.meta,
        config: cfg,
        budget,
        balance: balanceState,
        diag,
        updatedAt: stats.updatedAt,
      };
    };
    ctx.effect(() => tools.register(defineTool({
      name: 'usage_billing',
      description: usageToolDesc,
      parameters: {
        scope: { type: 'string', enum: ['today', 'month', 'all'], description: '统计范围：today=今日，month=本月，all=累计（默认）' },
      },
      output: usageToolOutput,
      execute: usageToolExecute,
    })), 'usage-billing: usage_billing tool');
```

</details>

#### 缺口

- 缺少真实用户工作负载和同任务替代办法对照。
  **影响**：不能确定会话归因的使用频率和净节时。
  **进一步探讨**：在已有本地日志上比较手工提取与面板查找同一会话的完整耗时和错误。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 流式调用和历史日志如何进入同一统计，异常是否保全？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

实时链路从 llm/stream 包装原始流开始，逐块提取 usage 并取各字段最大值，最后在 finally 中记录一次；已经观察到 usage 的取消或报错也会进入统计。取最大值适合累计式 usage，不等于支持逐块增量语义。若一条流从未给出 usage，就不会产生估算。会话号在收尾时从当前发起者取得，取不到时写入 unknown 桶，本轮未证明所有宿主异步上下文均保留该归因。

历史链路读取全部会话，再从 request/header 取得模型名，从 assistant/message 取得 usage，用同一个 recordUsage 累加。重建期间 draftStats 取代普通写入目标，外部读取继续看到旧 stats；这一设计避免面板短暂清空，但不能据此称为幂等重建。recordUsage 没有请求或事件 ID，若同一调用既被重建读到又在流收尾时写入草稿，就会重复累加；这是由两个入口共享无去重累加器推导的触发路径，未运行复现。反向地，listSessions 整体失败会丢弃草稿；期间落在草稿中的实时记录也不会合回旧 stats。

更直接的完整性限制是逐会话 readSession 失败只增加 failed 并继续，最后仍返回 ok:true 并替换整库。故某会话暂时不可读时，旧库已有的该会话统计不会自动保留。客户端成功分支只显示 sessions 和 found，不呈现 failed，不能把成功提示当作完整回填验收。只有在静止日志、会话全部读取成功且没有重叠实时调用时，该全量重建才具备较清楚的计数边界。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:971-1001](https://github.com/940842546/dsh-usage-billing/blob/c727786685b4a19df31e8fcd7754378ba4882764/lib/index.js#L971-L1001)

流字段取最大值，finally调用记录，记录未见用量的流会被跳过。

<details>
<summary>查看原文（31行）</summary>

```text
    ctx.on('llm/stream', (options, next) => {
      const modelName = pickModel(options);
      const stream = next();
      const acc = { input: 0, cacheHit: 0, cacheMiss: 0, output: 0, seen: false };
      return (async function* () {
        try {
          for await (const chunk of stream) {
            const u = extractUsage(chunk);
            if (u) {
              acc.seen = true;
              if (u.input > acc.input) acc.input = u.input;
              if (u.cacheHit > acc.cacheHit) acc.cacheHit = u.cacheHit;
              if (u.cacheMiss > acc.cacheMiss) acc.cacheMiss = u.cacheMiss;
              if (u.output > acc.output) acc.output = u.output;
            }
            yield chunk;
          }
        } finally {
          if (acc.seen && (acc.input > 0 || acc.output > 0)) {
            let sid = undefined;
            try {
              const initiator = agentsSvc && typeof agentsSvc.currentInitiator === 'function' ? agentsSvc.currentInitiator() : undefined;
              sid = initiator && initiator.session && typeof initiator.session.id === 'string' ? initiator.session.id : undefined;
            } catch {
              sid = undefined;
            }
            recordUsage(modelName, acc, Date.now(), sid);
          }
        }
      })();
    });
```

</details>

**依据 2 · 源码核查**：[lib/index.js:776-814](https://github.com/940842546/dsh-usage-billing/blob/c727786685b4a19df31e8fcd7754378ba4882764/lib/index.js#L776-L814)

记录函数选择草稿或正式目标并直接累加，没有调用ID去重。

<details>
<summary>查看原文（39行）</summary>

```text
    function recordUsage(modelName, usage, ts, sessionId) {
      // 重建期间写草稿，重建结束后整体替换；平时直接写 stats
      const target = draftStats || stats;
      const cfg = target.config || defaultConfig();
      const model = classifyModel(modelName);
      const band = bandOf(ts, cfg);
      // 官方路由（V4 Pro 下线路由到 V4.1 Flash 并按 Flash 价计费，2026-09-14 12:00 起）。
      // 开关默认开：proRouteFromMs 起 pro 档按同段 flash 价格计，统计身份仍记 pro。
      const routed = model === 'pro' && cfg.proRoutesToFlash !== false && ts >= (Number(cfg.proRouteFromMs) > 0 ? cfg.proRouteFromMs : PRO_ROUTE_FROM_MS);
      const priceModel = routed ? 'flash' : model;
      // 非 DeepSeek 模型：命中自定义价目就用它（多数厂商固定价，不区分峰谷）；
      // 单价若以 USD 计，按当前汇率折算成 CNY 后统一入库。
      let price;
      const customRule = model === 'other' ? findCustomPrice(cfg, modelName) : null;
      if (customRule) {
        const rate = customRule.currency === 'usd'
          ? (Number(cfg.usdCny) > 0 ? Number(cfg.usdCny) : DEFAULT_USD_CNY)
          : 1;
        price = { hit: customRule.hit * rate, miss: customRule.miss * rate, out: customRule.out * rate };
      } else {
        price = (cfg.pricing[band] && cfg.pricing[band][priceModel]) || { hit: 0, miss: 0, out: 0 };
      }
      const hit = usage.cacheHit;
      const miss = usage.cacheMiss;
      const out = usage.output;
      const cost = roundCost((hit * price.hit + miss * price.miss + out * price.out) / 1e6);
      const entry = { calls: 1, input: usage.input, cacheHit: hit, cacheMiss: miss, output: out, cost };
      add(target.total, entry);
      add(target.byBand[band], entry);
      add(target.byModel[model], entry);
      const sid = typeof sessionId === 'string' && sessionId.length > 0 ? sessionId : 'unknown';
      if (!target.bySession[sid]) target.bySession[sid] = sessionBucket();
      const sb = target.bySession[sid];
      sb.calls += 1;
      sb.input += entry.input;
      sb.cacheHit += entry.cacheHit;
      sb.cacheMiss += entry.cacheMiss;
      sb.output += entry.output;
      sb.cost = roundCost(sb.cost + entry.cost);
```

</details>

**依据 3 · 源码核查**：[lib/index.js:894-932](https://github.com/940842546/dsh-usage-billing/blob/c727786685b4a19df31e8fcd7754378ba4882764/lib/index.js#L894-L932)

草稿切换和成功替换逻辑；读取单会话失败继续处理。

<details>
<summary>查看原文（39行）</summary>

```text
    async function backfillStats() {
      // 先构建草稿，结束后原子替换：重建期间对外仍使用旧的完整统计，界面不会短暂清空
      const previous = stats;
      const draft = emptyStats();
      draft.config = (previous && previous.config) || defaultConfig();
      draft.meta.liveSince = previous && previous.meta && previous.meta.liveSince ? previous.meta.liveSince : Date.now();
      draftStats = draft;
      diag.rebuilding = true;
      const finish = async (result) => {
        draftStats = null;
        diag.rebuilding = false;
        if (result && result.ok) {
          stats = draft;
          await saveNow();
        }
        return result;
      };
      let records = [];
      try {
        records = await withTimeout(sessionQuery.listSessions(), 60000, 'listSessions');
      } catch (e) {
        return finish({ ok: false, error: 'listSessions 失败：' + String(e && e.message ? e.message : e) });
      }
      let scanned = 0;
      let found = 0;
      let failed = 0;
      for (const rec of records) {
        const id = rec && rec.header && typeof rec.header.id === 'string' ? rec.header.id : undefined;
        if (!id) continue;
        let snap = null;
        try {
          snap = await withTimeout(sessionQuery.readSession(id), 20000, 'readSession');
        } catch {
          failed++;
          continue;
        }
        scanned++;
        const events = snap && Array.isArray(snap.events) ? snap.events : [];
        let currentModel = 'unknown';
```

</details>

**依据 4 · 源码核查**：[lib/index.js:964-968](https://github.com/940842546/dsh-usage-billing/blob/c727786685b4a19df31e8fcd7754378ba4882764/lib/index.js#L964-L968)

无论failed数量仍返回ok:true。

```text
      draft.meta.lastBackfillFound = found;
      draft.meta.sessionAttribution = true;
      draft.meta.schemaVersion = 11;
      if (!draft.updatedAt) draft.updatedAt = Date.now();
      return finish({ ok: true, sessions: scanned, found, failed });
```

**依据 5 · 源码核查**：[lib/client.js:2061-2075](https://github.com/940842546/dsh-usage-billing/blob/c727786685b4a19df31e8fcd7754378ba4882764/lib/client.js#L2061-L2075)

前端成功提示未使用failed计数。

<details>
<summary>查看原文（15行）</summary>

```text
			const onBackfill = async () => {
				setBackfilling(true);
				try {
					const res = await fetch('/usage-billing?action=backfill', { method: 'POST' });
					const r = await res.json();
					if (r && r.ok) {
						setNotice(T('set.backfillDone', { sessions: r.sessions, found: r.found }));
						window.setTimeout(() => setNotice(''), 5000);
					} else {
						setError(T('set.backfillFailed') + T('common.detail', { msg: String(r && r.error ? r.error : T('set.unknownError')) }));
					}
				} catch (e) {
					setError(T('set.backfillFailed') + T('common.detail', { msg: String(e && e.message ? e.message : e) }));
				} finally {
					setBackfilling(false);
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 价格与模型识别是否足以支撑费用数字？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

固定版本能够按自带规则计算估算值，不能仅凭它显示了金额就判定与提供商账单一致。模型识别只看名称是否含 flash 或 pro，先匹配 flash；其他模型只有命中自定义子串价目才收费，否则使用零价格。由此得到的零费用表示未定价路径，并不证明服务免费。别名、代理路由和含 pro 的第三方模型可能落入错误价格档，必须由使用者核对实际供应商和模型身份。

输入 token 先区分普通输入和缓存字段，再按北京时间、生效日期、工作日及可编辑假日选择价表；币种折算使用用户配置的汇率。此处检查的是实现，不独立背书 README 对官方调价及假日规则的叙述。尤其配置更新仅保存当前 config，历史条目只保存已算出的 cost；普通改价不追溯既有总额，但全量回填会以当前配置重新计算所有历史记录。前后两种操作的金额可能变化，变化本身不能证明新值正确。

官方余额是单独 API 返回的账户总余额，并非逐请求账单核对接口。本机以外的消费、充值、赠金与当前价格规则都能使余额差额和本机估算不同，因此不能用“余额拉取成功”证明会话分摊正确。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:135-165](https://github.com/940842546/dsh-usage-billing/blob/c727786685b4a19df31e8fcd7754378ba4882764/lib/index.js#L135-L165)

时段与模型子串分类的实际规则。

<details>
<summary>查看原文（31行）</summary>

```text
function bandOf(ts, cfg) {
  const sep = Number(cfg.flashSepMs) > 0 ? cfg.flashSepMs : FLASH_SEP_MS;
  if (ts < cfg.boundaryMs) return 'before';
  const bp = beijingParts(ts);
  // 法定节假日 / 调休上班日：全天按空闲计费（优先于周几与时段判断）
  const holidays = Array.isArray(cfg.holidayDays) ? cfg.holidayDays : [];
  const isHoliday = holidays.indexOf(bp.date) >= 0;
  const from = Number(cfg.peakWeekdayFromMs) > 0 ? cfg.peakWeekdayFromMs : PEAK_WEEKDAY_FROM_MS;
  const peak = !isHoliday && isPeakHour(bp.hour, cfg.peakHours, bp.weekday, from, ts);
  if (ts >= sep) return peak ? 'sepPeak' : 'sepOffPeak';
  return peak ? 'afterPeak' : 'afterOffPeak';
}

function classifyModel(name) {
  if (typeof name !== 'string') return 'other';
  const n = name.toLowerCase();
  if (n.indexOf('flash') >= 0) return 'flash';
  if (n.indexOf('pro') >= 0) return 'pro';
  return 'other';
}

function pickModel(options) {
  if (!options || typeof options !== 'object') return 'unknown';
  const cands = [
    options.model,
    options.config ? options.config.model : undefined,
    options.request ? options.request.model : undefined,
  ];
  for (const cand of cands) {
    if (typeof cand === 'string' && cand.length > 0) return cand;
  }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:175-195](https://github.com/940842546/dsh-usage-billing/blob/c727786685b4a19df31e8fcd7754378ba4882764/lib/index.js#L175-L195)

TokenUsage与OpenAI式usage的归一化约定。

<details>
<summary>查看原文（21行）</summary>

```text
function normalizeUsage(u) {
  if (!u || typeof u !== 'object') return null;
  let uncached = 0;
  let cached = 0;
  let output = 0;
  if (typeof u.inputTokens === 'number') {
    uncached = u.inputTokens;
  } else if (typeof u.prompt_tokens === 'number') {
    let hit = 0;
    if (typeof u.prompt_cache_hit_tokens === 'number') hit = u.prompt_cache_hit_tokens;
    else if (u.prompt_tokens_details && typeof u.prompt_tokens_details === 'object' && typeof u.prompt_tokens_details.cached_tokens === 'number') hit = u.prompt_tokens_details.cached_tokens;
    uncached = Math.max(0, u.prompt_tokens - hit);
    cached = hit;
  }
  if (typeof u.cacheReadTokens === 'number') cached += u.cacheReadTokens;
  if (typeof u.cacheWriteTokens === 'number') cached += u.cacheWriteTokens;
  if (typeof u.outputTokens === 'number') output = u.outputTokens;
  else if (typeof u.completion_tokens === 'number') output = u.completion_tokens;
  if (uncached <= 0 && cached <= 0 && output <= 0) return null;
  return { input: uncached + cached, cacheHit: cached, cacheMiss: uncached, output };
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:776-805](https://github.com/940842546/dsh-usage-billing/blob/c727786685b4a19df31e8fcd7754378ba4882764/lib/index.js#L776-L805)

自定义价目仅用于other，未匹配用零价。

<details>
<summary>查看原文（30行）</summary>

```text
    function recordUsage(modelName, usage, ts, sessionId) {
      // 重建期间写草稿，重建结束后整体替换；平时直接写 stats
      const target = draftStats || stats;
      const cfg = target.config || defaultConfig();
      const model = classifyModel(modelName);
      const band = bandOf(ts, cfg);
      // 官方路由（V4 Pro 下线路由到 V4.1 Flash 并按 Flash 价计费，2026-09-14 12:00 起）。
      // 开关默认开：proRouteFromMs 起 pro 档按同段 flash 价格计，统计身份仍记 pro。
      const routed = model === 'pro' && cfg.proRoutesToFlash !== false && ts >= (Number(cfg.proRouteFromMs) > 0 ? cfg.proRouteFromMs : PRO_ROUTE_FROM_MS);
      const priceModel = routed ? 'flash' : model;
      // 非 DeepSeek 模型：命中自定义价目就用它（多数厂商固定价，不区分峰谷）；
      // 单价若以 USD 计，按当前汇率折算成 CNY 后统一入库。
      let price;
      const customRule = model === 'other' ? findCustomPrice(cfg, modelName) : null;
      if (customRule) {
        const rate = customRule.currency === 'usd'
          ? (Number(cfg.usdCny) > 0 ? Number(cfg.usdCny) : DEFAULT_USD_CNY)
          : 1;
        price = { hit: customRule.hit * rate, miss: customRule.miss * rate, out: customRule.out * rate };
      } else {
        price = (cfg.pricing[band] && cfg.pricing[band][priceModel]) || { hit: 0, miss: 0, out: 0 };
      }
      const hit = usage.cacheHit;
      const miss = usage.cacheMiss;
      const out = usage.output;
      const cost = roundCost((hit * price.hit + miss * price.miss + out * price.out) / 1e6);
      const entry = { calls: 1, input: usage.input, cacheHit: hit, cacheMiss: miss, output: out, cost };
      add(target.total, entry);
      add(target.byBand[band], entry);
      add(target.byModel[model], entry);
```

</details>

**依据 4 · 源码核查**：[lib/index.js:894-905](https://github.com/940842546/dsh-usage-billing/blob/c727786685b4a19df31e8fcd7754378ba4882764/lib/index.js#L894-L905)

回填草稿使用当前配置。

<details>
<summary>查看原文（12行）</summary>

```text
    async function backfillStats() {
      // 先构建草稿，结束后原子替换：重建期间对外仍使用旧的完整统计，界面不会短暂清空
      const previous = stats;
      const draft = emptyStats();
      draft.config = (previous && previous.config) || defaultConfig();
      draft.meta.liveSince = previous && previous.meta && previous.meta.liveSince ? previous.meta.liveSince : Date.now();
      draftStats = draft;
      diag.rebuilding = true;
      const finish = async (result) => {
        draftStats = null;
        diag.rebuilding = false;
        if (result && result.ok) {
```

</details>

**依据 5 · 源码核查**：[lib/index.js:1056-1073](https://github.com/940842546/dsh-usage-billing/blob/c727786685b4a19df31e8fcd7754378ba4882764/lib/index.js#L1056-L1073)

改配置只更新配置并保存，没有同步重算旧条目。

<details>
<summary>查看原文（18行）</summary>

```text
            }
            if (action === 'config') {
              const oldCfg = stats.config || defaultConfig();
              if (url.searchParams.get('reset') === '1') {
                stats.config = defaultConfig();
              } else {
                const raw = await readJsonBody(req);
                stats.config = sanitizeConfig(raw);
              }
              // 预算额度变化时重置该档去重，让新额度重新计算（否则旧额度已触发过同档就不弹了）
              if (oldCfg.budgetDaily !== stats.config.budgetDaily) budgetFired.daily.level = 0;
              if (oldCfg.budgetMonthly !== stats.config.budgetMonthly) budgetFired.monthly.level = 0;
              await saveNow();
              fetchBalance().catch(() => {});
              checkBudgetAlerts();
              json(res, 200, { ok: true, config: stats.config });
              return;
            }
```

</details>

**依据 6 · 源码核查**：[lib/index.js:741-768](https://github.com/940842546/dsh-usage-billing/blob/c727786685b4a19df31e8fcd7754378ba4882764/lib/index.js#L741-L768)

余额API解析为账户级余额而非逐请求账单。

<details>
<summary>查看原文（28行）</summary>

```text
        const res = await fetch('https://api.deepseek.com/user/balance', {
          headers: { authorization: 'Bearer ' + key },
          ...(ctrl ? { signal: ctrl.signal } : {}),
        });
        if (cancelTimeout) cancelTimeout();
        if (!res.ok) {
          balanceState = { status: 'error', data: null, at: Date.now(), error: 'HTTP ' + res.status };
          return balanceState;
        }
        const j = await res.json();
        const info = j && Array.isArray(j.balance_infos) && j.balance_infos[0] ? j.balance_infos[0] : null;
        if (!info) {
          balanceState = { status: 'error', data: null, at: Date.now(), error: 'unexpected response' };
          return balanceState;
        }
        balanceState = {
          status: 'ok',
          at: Date.now(),
          error: '',
          data: {
            isAvailable: j.is_available !== false,
            currency: typeof info.currency === 'string' ? info.currency : 'CNY',
            total: num(info.total_balance),
            granted: num(info.granted_balance),
            toppedUp: num(info.topped_up_balance),
          },
        };
        return balanceState;
```

</details>

#### 缺口

- 未取得与固定规则同期的官方逐项价目和同批调用账单。
  **影响**：不能把默认单价、假日或汇率当成当前已核实价格，也不能量化估算误差。
  **进一步探讨**：以用户实际供应商价目、精确模型ID和一组可对账调用分别核对token与金额。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何加载、展示、导出和恢复，依赖与操作责任是什么？

**研究主题**：依赖、兼容与流程、工程质量与复用

#### 完整回答

它是原生 DSH 双面插件包。package 指向 lib/index.js 并声明 bundle patch 与 web client，补丁按包名挂载 Host；客户端通过 ModuleLoader 导出 apply，并注册设置、输入框下方、侧栏和覆盖层四个显示位置。Host 必需服务包含文件系统、写策略、会话查询、计时器、Web 服务与工具注册；余额还依赖可选的凭证服务或环境变量以及外网。宿主 peer 范围是安装契约，不是本轮运行通过的证据。

持久化使用候选策略根中的共享 JSON，先写 .tmp 副本再写主文件，不使用 rename 事务；写失败会重试，主文件无法解析时可以尝试旧名及副本。保存调用被合并以减小并发写频率，但它没有跨进程写锁。心跳发现另一实例只写告警和诊断，不能防止两份内存状态最后写入覆盖；因此本地单实例是实际使用条件，而不是可选优化。

Web 路由能读统计、导出、改配置、清空和回填；查询模型工具不调用清空接口，但会把所有会话维度交给当前模型，因此不应视为逐用户隔离的账本。路由本身没有实现独立用户授权，部署可见范围依赖宿主保护，本轮不把这直接认定为公网漏洞。CSV 对公式开头做了转义，JSON 可以导出完整统计与配置，但未见导入还原接口。清空保留配置并重置统计；副本也会随新状态继续写入，所以导出和单独备份应在清空或重建之前完成。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:14-38](https://github.com/940842546/dsh-usage-billing/blob/c727786685b4a19df31e8fcd7754378ba4882764/package.json#L14-L38)

包exports、客户端与bundle声明、peer范围。

<details>
<summary>查看原文（25行）</summary>

```text
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "cordis.patch.yml"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web"
    }
  },
  "license": "MIT",
  "peerDependencies": {
    "@deepseek-ai/dsh-tools": ">=0.1.0-rc.6 <0.3.0-0"
  }
}
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:6-8](https://github.com/940842546/dsh-usage-billing/blob/c727786685b4a19df31e8fcd7754378ba4882764/cordis.patch.yml#L6-L8)

按包名插入Host挂载行。

```text
- insert:
    - id: usage-billing
      name: 'dsh-usage-billing'
```

**依据 3 · 源码核查**：[lib/client.js:2325-2355](https://github.com/940842546/dsh-usage-billing/blob/c727786685b4a19df31e8fcd7754378ba4882764/lib/client.js#L2325-L2355)

四个slot实际注册并导出apply。

<details>
<summary>查看原文（31行）</summary>

```text
			// 设置页 · 详细面板
			ctx.slots.inject("settings.section", () => ctx.slots.register(
				{ name: "settings.section", id: "usage-billing", order: 25, label: () => T('set.sectionLabel') },
				(props) => guard(react.createElement(UsagePanel, null)),
			));

			// 主界面 · 输入框下方：当前会话用量常驻行
			ctx.slots.inject("conversation.composer.dock", () => ctx.slots.register(
				{ name: "conversation.composer.dock", id: "usage-cost", order: 10 },
				(props) => guard(react.createElement(DockReadout, { sessionId: props.sessionId, session: props.session })),
			));

			// 主界面 · 侧边栏底部「用量」按钮
			ctx.slots.inject("sidebar.footer.action", () => ctx.slots.register(
				{ name: "sidebar.footer.action", id: "usage-billing", order: 10, label: () => T('fab.label') },
				(props) => guard(react.createElement(FooterButton, { wide: props.wide })),
			));

			// 主界面 · 悬浮汇总面板 + 预算告警 toast
			ctx.slots.inject("shell.overlay", () => ctx.slots.register(
				{ name: "shell.overlay", id: "usage-billing-panel", order: 10 },
				() => guard(el('div', null,
					react.createElement(OverlayPanel, null),
					react.createElement(AlertToaster, null),
				)),
			));
		}

		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
```

</details>

**依据 4 · 源码核查**：[lib/index.js:544-559](https://github.com/940842546/dsh-usage-billing/blob/c727786685b4a19df31e8fcd7754378ba4882764/lib/index.js#L544-L559)

先副本再主文件，非rename事务。

<details>
<summary>查看原文（16行）</summary>

```text
    async function trySaveTo(root, fileName) {
      try {
        const target = await fs.resolve(root + '/' + fileName);
        const text = JSON.stringify(stats);
        // 先写 temp 副本再写主文件：主文件若写坏，下次启动可从 temp 恢复（fs 无 rename，退而求其次）
        try {
          await fs.writeText(await fs.resolve(root + '/' + fileName + '.tmp'), text, undefined, undefined, policyForRoot(root));
        } catch {
          // temp 写失败不阻塞主写入
        }
        await fs.writeText(target, text, undefined, undefined, policyForRoot(root));
        return { ok: true, root, path: target.displayPath || (root + '/' + fileName) };
      } catch (e) {
        return { ok: false, root, error: String(e && e.message ? e.message : e) };
      }
    }
```

</details>

**依据 5 · 源码核查**：[lib/index.js:646-698](https://github.com/940842546/dsh-usage-billing/blob/c727786685b4a19df31e8fcd7754378ba4882764/lib/index.js#L646-L698)

本进程保存合并、失败重试与延迟。

<details>
<summary>查看原文（53行）</summary>

```text
    async function saveNow() {
      // 合并并发调用：写盘期间再次触发，结束后只补写一次
      if (saving) { saveAgain = true; return; }
      saving = true;
      try {
        const results = [];
        for (const root of candidateRoots) {
          const r = await trySaveToWithRetry(root, '.dsh-usage-billing.json');
          results.push(r);
          if (r.ok) {
            statsFile = r.path;
            diag.statsFile = r.path;
            diag.writeRoot = r.root;
            diag.lastError = '';
            lastSaveErrorLogged = '';
            break;
          }
        }
        diag.attempts = results.slice(-3);
        if (results.length > 0 && !results.some((r) => r.ok)) {
          const msg = results.map((r) => r.root + ': ' + r.error).join(' | ');
          diag.lastError = msg;
          // 同一错误只打印一次，避免每 1.5s 刷屏；同时安排 5s 后补写，避免统计丢失
          if (msg !== lastSaveErrorLogged) {
            lastSaveErrorLogged = msg;
            console.error('[usage-billing] save failed, will retry:', msg);
          }
          if (!saveRetryScheduled) {
            saveRetryScheduled = true;
            ctx.timeout(() => {
              saveRetryScheduled = false;
              saveNow();
            }, 5000);
          }
        }
      } finally {
        saving = false;
        if (saveAgain) {
          saveAgain = false;
          saveNow();
        }
      }
    }

    function scheduleSave() {
      if (saveScheduled) return;
      saveScheduled = true;
      ctx.timeout(() => {
        saveScheduled = false;
        saveNow();
      }, 1500);
    }

```

</details>

**依据 6 · 源码核查**：[lib/index.js:1005-1027](https://github.com/940842546/dsh-usage-billing/blob/c727786685b4a19df31e8fcd7754378ba4882764/lib/index.js#L1005-L1027)

心跳只告警，没有互斥。

<details>
<summary>查看原文（23行）</summary>

```text
    // ---------- 双实例检测：心跳文件（60s 内有其他实例心跳则告警一次） ----------
    if (diag.writeRoot) {
      try {
        const hb = await fs.resolve(diag.writeRoot + '/.dsh-usage-billing.heartbeat');
        // 过渡期同时读旧名心跳（旧版本实例写旧名），新心跳只写新名
        const hbOld = await fs.resolve(diag.writeRoot + '/.dsh-usage-stats.heartbeat');
        try {
          let prev = Number(await fs.readText(hb));
          if (!Number.isFinite(prev) || prev <= 0) prev = Number(await fs.readText(hbOld));
          if (Number.isFinite(prev) && Date.now() - prev < 60000 && prev > 0) {
            console.warn('[usage-billing] another instance heartbeat detected ('
              + Math.round((Date.now() - prev) / 1000) + 's ago); concurrent writes will overwrite each other');
            diag.multiInstance = true;
          }
        } catch {
          // 无心跳文件，正常
        }
        ctx.effect(() => ctx.interval(() => {
          fs.writeText(hb, String(Date.now()), undefined, undefined, policyForRoot(diag.writeRoot)).catch(() => {});
        }, 20000), 'usage-billing: heartbeat');
      } catch {
        // 心跳路径解析失败则跳过检测
      }
```

</details>

**依据 7 · 源码核查**：[lib/index.js:397-435](https://github.com/940842546/dsh-usage-billing/blob/c727786685b4a19df31e8fcd7754378ba4882764/lib/index.js#L397-L435)

CSV防公式注入及完整JSON导出。

<details>
<summary>查看原文（39行）</summary>

```text
function csvCell(v) {
  const s = String(v == null ? '' : v);
  // 防公式注入：以 = + - @ 制表符/回车开头的单元格在 Excel 中会被当公式执行
  const guarded = /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
  return /[",\n\r]/.test(guarded) ? '"' + guarded.replace(/"/g, '""') + '"' : guarded;
}

function exportStats(res, format, scope) {
  if (format === 'json') {
    const payload = JSON.stringify({ exportedAt: new Date().toISOString(), stats, config: stats.config || defaultConfig() }, null, 2);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="dsh-usage-billing.json"');
    res.end(payload);
    return;
  }
  let header;
  let rows;
  if (scope === 'session') {
    header = ['session_id', 'title', 'calls', 'input_tokens', 'cache_hit_tokens', 'cache_miss_tokens', 'output_tokens', 'cost_rmb'];
    rows = Object.keys(stats.bySession || {}).map((id) => {
      const b = stats.bySession[id] || {};
      return [id, b.title || '', b.calls || 0, b.input || 0, b.cacheHit || 0, b.cacheMiss || 0, b.output || 0, roundCost(b.cost || 0)];
    });
    rows.sort((a, b) => b[7] - a[7]);
  } else {
    header = ['date', 'calls', 'input_tokens', 'cache_hit_tokens', 'cache_miss_tokens', 'output_tokens', 'cost_rmb'];
    rows = Object.keys(stats.byDay || {}).sort().map((k) => {
      const b = stats.byDay[k] || {};
      return [k, b.calls || 0, b.input || 0, b.cacheHit || 0, b.cacheMiss || 0, b.output || 0, roundCost(b.cost || 0)];
    });
  }
  const lines = [header.join(',')].concat(rows.map((r) => r.map(csvCell).join(',')));
  const csv = lines.join('\r\n') + '\r\n';
  const dayKeys = Object.keys(stats.byDay || {}).sort();
  const today = beijingParts(Date.now()).date;
  const range = dayKeys.length > 0 ? dayKeys[0] + '_' + (dayKeys[dayKeys.length - 1] > today ? today : dayKeys[dayKeys.length - 1]) : today;
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
```

</details>

**依据 8 · 源码核查**：[lib/index.js:1047-1054](https://github.com/940842546/dsh-usage-billing/blob/c727786685b4a19df31e8fcd7754378ba4882764/lib/index.js#L1047-L1054)

清空重置统计并保存，未提供导入恢复。

```text
            }
            if (action === 'clear') {
              const savedConfig = stats.config || defaultConfig();
              stats = emptyStats();
              stats.meta.liveSince = Date.now();
              stats.config = savedConfig;
              saveNow();
              json(res, 200, { ok: true });
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 首次、持续与失败恢复成本能否换来可验证效果，应如何试用？

**研究主题**：效果与总成本、采用判断

#### 完整回答

当前采用结论为观察。面板和查询工具的接线有直接源码支持，但计数完整性与重建失败的状态丢失会影响它最核心的费用观察任务。适合继续评估的是能够保留原始日志、主要在单实例使用且愿意核对模型与价格的人；跨机器总账、报销结算和硬预算限制并不适合交给这个估算器。预算逻辑只产生告警，没有阻止调用继续执行，不能当作消费上限。

首次投入包括安装到兼容 profile、重启并检查双面加载、保存旧统计备份、核对模型映射与价目。持续投入包括本地桶和文件增长、轮询面板、维护日期规则，以及可选的每10分钟余额网络请求。失败恢复需要排查写策略和读取失败、比较导出与原始日志，并决定是否在停止调用后重建；目前没有证据可将这些人工时间量化，也不能据没有新增模型调用推断总成本为零。

后续如要评估，先在保留原始材料的小范围内固定一组带 usage 的调用，分别记录插件数、日志数和供应商可核对记录，再在没有新调用时做两次回填。成功判据是相同输入的调用数与token保持一致，读取失败明确暴露且不抹掉已有统计。若出现同一调用增加、回填后已有会话消失、未定价模型被误当免费或保存诊断持续报错，就停止依赖金额与预算提醒，保留导出并回到账户记录和原始日志核对。此方案未在本轮执行，不能当作已经可控的试用结果。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:854-881](https://github.com/940842546/dsh-usage-billing/blob/c727786685b4a19df31e8fcd7754378ba4882764/lib/index.js#L854-L881)

预算阈值生成事件，没有阻断请求。

<details>
<summary>查看原文（28行）</summary>

```text
    function checkBudgetAlerts() {
      const cfg = stats.config || defaultConfig();
      const today = beijingParts(Date.now()).date;
      const month = today.slice(0, 7);
      const b = computeBudget(stats, cfg);
      // 日预算
      const dl = budgetLevel(b.daily.spent, b.daily.limit);
      if (dl > budgetFired.daily.level || budgetFired.daily.day !== today) {
        budgetFired.daily.day = today;
        if (dl > budgetFired.daily.level && dl > 0) {
          budgetFired.daily.level = dl;
          budgetEvents.push({ kind: 'daily', level: dl, spent: b.daily.spent, limit: b.daily.limit, at: Date.now() });
        } else {
          budgetFired.daily.level = dl;
        }
      }
      // 月预算
      const ml = budgetLevel(b.monthly.spent, b.monthly.limit);
      if (ml > budgetFired.monthly.level || budgetFired.monthly.month !== month) {
        budgetFired.monthly.month = month;
        if (ml > budgetFired.monthly.level && ml > 0) {
          budgetFired.monthly.level = ml;
          budgetEvents.push({ kind: 'monthly', level: ml, spent: b.monthly.spent, limit: b.monthly.limit, at: Date.now() });
        } else {
          budgetFired.monthly.level = ml;
        }
      }
      if (budgetEvents.length > 8) budgetEvents = budgetEvents.slice(-8);
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1220-1238](https://github.com/940842546/dsh-usage-billing/blob/c727786685b4a19df31e8fcd7754378ba4882764/lib/index.js#L1220-L1238)

余额定时访问与启动时自动回填触发。

<details>
<summary>查看原文（19行）</summary>

```text
    // 官方余额：启动即拉取一次，之后每 10 分钟自动刷新（检测到 API Key 才真正发请求）
    ctx.effect(() => {
      fetchBalance().catch(() => {});
      return ctx.interval(() => { fetchBalance().catch(() => {}); }, 10 * 60 * 1000);
    }, 'usage-billing: balance poll');

    // 无数据、缺少会话归因或旧版本数据时：从日志全量重建（草稿构建 + 原子替换，期间界面沿用旧数据）
    if (stats.total.calls === 0 || stats.meta.sessionAttribution !== true || stats.meta.schemaVersion !== 11) {
      backfillStats().then((r) => {
        if (r && r.ok) console.log('[usage-billing] auto-backfill done: sessions=' + r.sessions + ' found=' + r.found + ' failed=' + r.failed);
        else console.log('[usage-billing] auto-backfill:', r && r.error ? r.error : r);
        checkBudgetAlerts();
      }).catch((e) => {
        console.error('[usage-billing] auto-backfill failed:', e);
        checkBudgetAlerts();
      });
    } else {
      // 启动时若已跨预算阈值（历史数据），补发一次告警
      checkBudgetAlerts();
```

</details>

**依据 3 · 源码核查**：[lib/client.js:2030-2041](https://github.com/940842546/dsh-usage-billing/blob/c727786685b4a19df31e8fcd7754378ba4882764/lib/client.js#L2030-L2041)

设置页面5秒轮询。

<details>
<summary>查看原文（12行）</summary>

```text
				const load = async () => {
					try {
						const d = await fetchStats();
						if (alive) { setData(d); setError(''); }
					} catch (e) {
						if (alive) setError(T('set.loadFailed') + T('common.detail', { msg: String(e && e.message ? e.message : e) }));
					}
				};
				load();
				const timer = window.setInterval(load, 5000);
				return () => { alive = false; window.clearInterval(timer); };
			}, []);
```

</details>

**依据 4 · 源码核查**：[lib/index.js:894-932](https://github.com/940842546/dsh-usage-billing/blob/c727786685b4a19df31e8fcd7754378ba4882764/lib/index.js#L894-L932)

整库回填与部分失败的恢复负担。

<details>
<summary>查看原文（39行）</summary>

```text
    async function backfillStats() {
      // 先构建草稿，结束后原子替换：重建期间对外仍使用旧的完整统计，界面不会短暂清空
      const previous = stats;
      const draft = emptyStats();
      draft.config = (previous && previous.config) || defaultConfig();
      draft.meta.liveSince = previous && previous.meta && previous.meta.liveSince ? previous.meta.liveSince : Date.now();
      draftStats = draft;
      diag.rebuilding = true;
      const finish = async (result) => {
        draftStats = null;
        diag.rebuilding = false;
        if (result && result.ok) {
          stats = draft;
          await saveNow();
        }
        return result;
      };
      let records = [];
      try {
        records = await withTimeout(sessionQuery.listSessions(), 60000, 'listSessions');
      } catch (e) {
        return finish({ ok: false, error: 'listSessions 失败：' + String(e && e.message ? e.message : e) });
      }
      let scanned = 0;
      let found = 0;
      let failed = 0;
      for (const rec of records) {
        const id = rec && rec.header && typeof rec.header.id === 'string' ? rec.header.id : undefined;
        if (!id) continue;
        let snap = null;
        try {
          snap = await withTimeout(sessionQuery.readSession(id), 20000, 'readSession');
        } catch {
          failed++;
          continue;
        }
        scanned++;
        const events = snap && Array.isArray(snap.events) ? snap.events : [];
        let currentModel = 'unknown';
```

</details>

#### 缺口

- 缺少固定输入对账和重复回填结果，以及失败恢复的实际工时。
  **影响**：无法证明整体准确性、净节时或总维护成本可接受。
  **进一步探讨**：在静止日志上记录两次回填前后导出差异，再加入单会话读取失败与流收尾交错作对照。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 可从哪些已核机制推导更可靠的费用观察设计？

**研究主题**：新假设与验证

#### 完整回答

可提出未验证假设：将“调用事实账本”和“价格估算视图”分开，并为实时与回填使用同一稳定调用身份，可能比覆盖式聚合更容易发现漏计和重复。推导来自三个源码事实：两个入口共用无ID累加器，回填可在部分会话失败时替换整库，金额在记录当时按当前配置直接写入。单纯增加图表不能解决这三种来源不确定性。

候选设计先保存调用ID、会话ID、时间、模型原名与token，再单独记录价目版本；回填只合并已确认事实，对未读会话保留旧数据并标为未完成。相对现状的增量是可去重、可重算和可解释差额，代价是需要宿主稳定事件ID、迁移旧聚合及更多存储；没有稳定ID时，近似哈希也可能把真实重复请求合并，不能直接保证正确。

最小验证可使用同一组脱敏日志对照当前聚合与候选账本，安排实时完成和回填重叠、重复回填、单会话超时与价格更改。记录重复或缺失的调用数、token差异、无法归因的比例，以及运行和人工核对时间。若候选依然不能区分重试调用、未降低差异或核对负担超过简单静止日志脚本，这个设计的价值就不成立。这里是工程验证假设，没有真实用户需求或付费意愿证据，不命名为已确认产品机会。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:776-805](https://github.com/940842546/dsh-usage-billing/blob/c727786685b4a19df31e8fcd7754378ba4882764/lib/index.js#L776-L805)

事实计数与价格计算耦合于同一累加函数。

<details>
<summary>查看原文（30行）</summary>

```text
    function recordUsage(modelName, usage, ts, sessionId) {
      // 重建期间写草稿，重建结束后整体替换；平时直接写 stats
      const target = draftStats || stats;
      const cfg = target.config || defaultConfig();
      const model = classifyModel(modelName);
      const band = bandOf(ts, cfg);
      // 官方路由（V4 Pro 下线路由到 V4.1 Flash 并按 Flash 价计费，2026-09-14 12:00 起）。
      // 开关默认开：proRouteFromMs 起 pro 档按同段 flash 价格计，统计身份仍记 pro。
      const routed = model === 'pro' && cfg.proRoutesToFlash !== false && ts >= (Number(cfg.proRouteFromMs) > 0 ? cfg.proRouteFromMs : PRO_ROUTE_FROM_MS);
      const priceModel = routed ? 'flash' : model;
      // 非 DeepSeek 模型：命中自定义价目就用它（多数厂商固定价，不区分峰谷）；
      // 单价若以 USD 计，按当前汇率折算成 CNY 后统一入库。
      let price;
      const customRule = model === 'other' ? findCustomPrice(cfg, modelName) : null;
      if (customRule) {
        const rate = customRule.currency === 'usd'
          ? (Number(cfg.usdCny) > 0 ? Number(cfg.usdCny) : DEFAULT_USD_CNY)
          : 1;
        price = { hit: customRule.hit * rate, miss: customRule.miss * rate, out: customRule.out * rate };
      } else {
        price = (cfg.pricing[band] && cfg.pricing[band][priceModel]) || { hit: 0, miss: 0, out: 0 };
      }
      const hit = usage.cacheHit;
      const miss = usage.cacheMiss;
      const out = usage.output;
      const cost = roundCost((hit * price.hit + miss * price.miss + out * price.out) / 1e6);
      const entry = { calls: 1, input: usage.input, cacheHit: hit, cacheMiss: miss, output: out, cost };
      add(target.total, entry);
      add(target.byBand[band], entry);
      add(target.byModel[model], entry);
```

</details>

**依据 2 · 源码核查**：[lib/index.js:894-932](https://github.com/940842546/dsh-usage-billing/blob/c727786685b4a19df31e8fcd7754378ba4882764/lib/index.js#L894-L932)

全量替换和失败继续扫描是候选设计的反例来源。

<details>
<summary>查看原文（39行）</summary>

```text
    async function backfillStats() {
      // 先构建草稿，结束后原子替换：重建期间对外仍使用旧的完整统计，界面不会短暂清空
      const previous = stats;
      const draft = emptyStats();
      draft.config = (previous && previous.config) || defaultConfig();
      draft.meta.liveSince = previous && previous.meta && previous.meta.liveSince ? previous.meta.liveSince : Date.now();
      draftStats = draft;
      diag.rebuilding = true;
      const finish = async (result) => {
        draftStats = null;
        diag.rebuilding = false;
        if (result && result.ok) {
          stats = draft;
          await saveNow();
        }
        return result;
      };
      let records = [];
      try {
        records = await withTimeout(sessionQuery.listSessions(), 60000, 'listSessions');
      } catch (e) {
        return finish({ ok: false, error: 'listSessions 失败：' + String(e && e.message ? e.message : e) });
      }
      let scanned = 0;
      let found = 0;
      let failed = 0;
      for (const rec of records) {
        const id = rec && rec.header && typeof rec.header.id === 'string' ? rec.header.id : undefined;
        if (!id) continue;
        let snap = null;
        try {
          snap = await withTimeout(sessionQuery.readSession(id), 20000, 'readSession');
        } catch {
          failed++;
          continue;
        }
        scanned++;
        const events = snap && Array.isArray(snap.events) ? snap.events : [];
        let currentModel = 'unknown';
```

</details>

**依据 3 · 源码核查**：[lib/index.js:971-1001](https://github.com/940842546/dsh-usage-billing/blob/c727786685b4a19df31e8fcd7754378ba4882764/lib/index.js#L971-L1001)

实时入口没有稳定调用身份传入。

<details>
<summary>查看原文（31行）</summary>

```text
    ctx.on('llm/stream', (options, next) => {
      const modelName = pickModel(options);
      const stream = next();
      const acc = { input: 0, cacheHit: 0, cacheMiss: 0, output: 0, seen: false };
      return (async function* () {
        try {
          for await (const chunk of stream) {
            const u = extractUsage(chunk);
            if (u) {
              acc.seen = true;
              if (u.input > acc.input) acc.input = u.input;
              if (u.cacheHit > acc.cacheHit) acc.cacheHit = u.cacheHit;
              if (u.cacheMiss > acc.cacheMiss) acc.cacheMiss = u.cacheMiss;
              if (u.output > acc.output) acc.output = u.output;
            }
            yield chunk;
          }
        } finally {
          if (acc.seen && (acc.input > 0 || acc.output > 0)) {
            let sid = undefined;
            try {
              const initiator = agentsSvc && typeof agentsSvc.currentInitiator === 'function' ? agentsSvc.currentInitiator() : undefined;
              sid = initiator && initiator.session && typeof initiator.session.id === 'string' ? initiator.session.id : undefined;
            } catch {
              sid = undefined;
            }
            recordUsage(modelName, acc, Date.now(), sid);
          }
        }
      })();
    });
```

</details>

#### 缺口

- 宿主各日志事件和实时调用能否共享稳定身份尚未核实。
  **影响**：候选去重与迁移设计可能不能可靠对应同一调用。
  **进一步探讨**：先核对固定宿主事件契约，再用含重试的脱敏日志比较身份映射误合并和漏匹配。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
