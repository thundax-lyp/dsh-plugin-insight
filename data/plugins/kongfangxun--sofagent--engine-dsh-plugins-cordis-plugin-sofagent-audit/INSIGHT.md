# sofagent audit（DSH 子插件）

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[136a148](https://github.com/KongFangXun/sofagent/tree/136a148837a31dc2471d578e15a76afc3328b0f6/engine/dsh-plugins/cordis-plugin-sofagent-audit)

<!-- BEGIN META -->
[![GitHub ★ 55](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=55&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/KongFangXun/sofagent) [![npm 30d 793](https://img.shields.io/static/v1?label=npm+30d&message=793&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/cordis-plugin-sofagent-audit) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/cordis-plugin-sofagent-audit)
<!-- END META -->

> **功能**：将 sofagent 审计、危险命令检查、调用留证和任务验收接口接到 DSH 事件。

> **亮点**：将已有sofagent判定源和留证接入DSH生命周期；规则/验收算法继承引擎包，自动全diff审查未由四事件直接成立。见 [Q01](#research-q01)、[Q03](#research-q03)。

> **主要限制**：文件写入事件放行，依赖失败fail-open，验收失败仅每turn一次steer；硬门禁表述超过实现，全局任务ID非会话绑定。见 [Q02](#research-q02)。

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
  - [Q01 · 这个 audit 子包怎样把 DSH 工具事件接到审计引擎？](#detail-section-11)
  - [Q02 · “硬门禁”在停止、文件写入和失败时究竟约束什么？](#detail-section-12)
  - [Q03 · 相对手工审查增加什么，失效和留证成本由谁承担？](#detail-section-13)
  - [Q04 · 当前可否当硬门禁采用，进一步方向如何推翻？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：开发者希望在DSH工具调用与收尾时接入机器检查和审计记录。见 [Q01](#research-q01)。

手工读diff/日志、检查命令并跑测试，外部CI独立放行；不是根sofagent全产品比较。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 命令模式检查 | 阻断特定危险模式 | 判定不可用fail-open |
| 调用意图留证 | 记录前后身份与结果 | 缺身份/写入失败会跳过 |
| 失败decision | 为错误工具另留记录 | 成功不走该decision支路 |
| runRules桥接 | 调用现有diff规则 | 非四事件每次自动执行 |
| 收尾验收 | 跑criterion并提示修正 | 每turn最多一次steer |
| 写意图订阅 | 观察宿主文件事件 | 当前直接放行 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH对应事件契约 | 实际功能必需 | 触发处理器 | 订阅/签名不符可无功能 |
| kit1.8.0/Node>=18 | 必需 | 注册服务和事件 | 无法正常加载 |
| audit/orchestrator/core1.8.0 | 对应操作必需、包声明optional | 判定/留证/目录 | 日志降级，可能放行 |
| SOFAGENT_TASK_ID与项目根 | 收尾验收必需 | 选择验收定义 | 缺任务不检查，全局非会话 |
| 可信criterion命令 | 命令验收所需 | shell测试构建 | 不可信定义有执行副作用 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 单项目定义可信任务验收 | 核Host事件和依赖 |
| 执行前 | 记录意图、命令模式判定 | 命中deny，缺判定放行 |
| 结果 | 意图通道及失败decision | 缺身份/依赖不可作完整留证 |
| 收尾 | checkAcceptance失败尝试steer一次 | 无定义/无steer/异常不阻止停止 |
| 交付 | 外部CI/人验收 | 不由就绪日志放行 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 构建/测试资源未知 | 对齐Host事件和项目任务 | 无运行验收 |
| 持续使用 | 日志/测试/续跑模型未知 | 查skip及降级、独立CI | 非自动完整门禁 |
| 失败恢复 | 重试命令/模型未知 | 定位缺包/错任务/缺事件 | fail-open需外部关口 |
| 退出 | 日志与修改保留 | 解订阅并保留证据 | 不回滚criterion副作用 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 命令检查 | 模式命中deny | 全命令语义安全 |
| 留证 | 意图与错误decision接线 | Host触发及完整性 |
| 任务验收 | criterion与一次steer | 失败绝不停止不成立 |
| 审查便利 | 生命周期接已有API | 相对手工/CI净收益 |

> **思考**：文件写入事件放行，依赖失败fail-open，验收失败仅每turn一次steer；硬门禁表述超过实现，全局任务ID非会话绑定。见 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将已有sofagent判定源和留证接入DSH生命周期；规则/验收算法继承引擎包，自动全diff审查未由四事件直接成立。见 [Q01](#research-q01)、[Q03](#research-q03)。

显式skip证据和幂等卸载可借鉴；能力缺席应与验收失败/成功分开，fail-open不得称硬阻断。见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

文件写入事件放行，依赖失败fail-open，验收失败仅每turn一次steer；硬门禁表述超过实现，全局任务ID非会话绑定。见 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察并保留外部CI，在单项目测试副本先测缺包/缺身份/失败验收，不能作为唯一交付门。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定子包及直接kit/判定依赖已检查；真实Host接线、效果与强制模式未验证。

- 已检查：作者 README、包清单、源码路径 engine/audit/src/reporter.ts、engine/dsh-plugins/cordis-plugin-sofagent-audit/SKILL.md、engine/dsh-plugins/cordis-plugin-sofagent-audit/package.json、engine/dsh-plugins/cordis-plugin-sofagent-audit/src/index.ts、engine/dsh-plugins/plugin-kit/src/index.ts、engine/orchestrator/src/acceptance/acceptance.ts、engine/orchestrator/src/tools.ts 及固定范围 inventory；组件：engine/dsh-plugins/cordis-plugin-sofagent-audit。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅子包四事件、kit订阅/invoke/卸载及调用的危险命令/验收API；未把根产品结论继承到本项，未全审规则/MCP registry/真实Host，未运行目标。
- 下一步：固定Host核四事件与身份，再做缺包、错任务、无steer及一直失败矩阵，查放行和日志完整性；未执行。

**分析版本**

- **仓库**：[KongFangXun/sofagent](https://github.com/KongFangXun/sofagent)
- **版本号**：1.8.0（[固定提交 136a148](https://github.com/KongFangXun/sofagent/tree/136a148837a31dc2471d578e15a76afc3328b0f6)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

分观察与强制模式，用UNKNOWN终态、会话任务绑定和外部关口验证误放行/等待取舍；Host不能阻断则回CI。见 [Q04](#research-q04)。

固定Host核四事件与身份，再做缺包、错任务、无steer及一直失败矩阵，查放行和日志完整性；未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 25 | — | — | 376 |
| .ts | test | 1 | 343 | 270 | 53 | — |
| .ts | source | 1 | 363 | 236 | 118 | — |

</details>

**活跃度**

[![Issue 未关闭 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=9&color=737b86&logo=github)](https://github.com/KongFangXun/sofagent/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/KongFangXun/sofagent/issues?q=is%3Aissue+created%3A2026-10-07T03%3A54%3A04.696Z..2026-11-06T03%3A54%3A04.696Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/KongFangXun/sofagent/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T03%3A54%3A04.696Z..2026-11-06T03%3A54%3A04.696Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：audit子包的门禁实际阻止什么，哪些路径只留证或提示续跑？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 这个 audit 子包怎样把 DSH 工具事件接到审计引擎？

**研究主题**：场景与需求、功能与机制

#### 完整回答

本项只研究cordis-plugin-sofagent-audit，服务于希望给DSH工具调用留证并按机器标准检查任务的开发者。基线是手工读diff/日志、跑测试和审命令；合格结果应能区分哪些调用有证据、哪些操作被阻断、哪些验收尚未通过，不能只看“审计就绪”。根sofagent全产品不在本题结论范围。

子包声明四个事件处理器，由共享kit通过ctx.on逐个真实订阅，注入按需import引擎API的helpers。tools/pre-execute先recordIntent，再只对arguments.command字符串调用checkDangerousCommand，返回非空理由才deny；非命令工具继续next。此判定源检查若干删除、fork、远程shell和设备写命令模式，既非通用Shell解析器也非文件权限隔离。

tools/result先尝试记录全部结果到意图通道，另只为isError=true结果emitDecision；缺agent/session会尝试落skip证据，不猜身份。runRules被公开invoke桥接，但这四个事件处理器并没有每次自动把git diff交runRules；不能把“桥接28规则”的清单描述等同每次工具调用都执行了全部规则。角色工具还依赖kit可选MCP registry注册，未在本次穷尽该工具集合。

#### 证据与依据

**依据 1 · 源码核查**：[engine/dsh-plugins/cordis-plugin-sofagent-audit/src/index.ts:133-209](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/engine/dsh-plugins/cordis-plugin-sofagent-audit/src/index.ts#L133-L209)

意图留证及命令pre-execute实际判定。

<details>
<summary>查看原文（77行）</summary>

```text
async function recordIntent(
  helpers: SeamHelpers,
  event: string,
  exec: unknown,
  result?: unknown,
): Promise<void> {
  if (identityOf(exec) === null) {
    await recordIntentSkipEvidence(helpers, event, exec);
    return;
  }
  try {
    if (intentChannel === undefined) {
      const dataDir = await resolveDataDir(helpers);
      const created = await helpers.call(
        '@sofagent/audit',
        'createIntentChannel',
        dataDir === undefined ? {} : { dataDir },
      );
      const candidate = created as IntentChannelLike | null | undefined;
      intentChannel =
        candidate !== null && candidate !== undefined && typeof candidate.handle === 'function'
          ? candidate
          : null;
      if (intentChannel === null) {
        logOnce(
          helpers,
          'intent-channel-missing',
          '意图通道不可用（@sofagent/audit 未导出 createIntentChannel）——意图留痕停用，不阻断宿主',
        );
      }
    }
    intentChannel?.handle(event, [exec, result]);
  } catch (err) {
    logOnce(helpers, 'intent-record-failed', `意图留痕写入失败（不阻断宿主工具调用）：${errMsg(err)}`);
  }
}

/**
 * seam 事件处理器（v1.5.0 章十）——四个事件位的**实现**（此前只有声明）。
 *
 * 🔴 判定逻辑零改动：全部判定都来自引擎包既有 @public API
 *    （`checkDangerousCommand` / `checkAcceptance`），插件层只负责接管子 + 转形状。
 * 🔴 失败一律 fail-open：判定源不可达时放行 + 打可见日志，绝不把接线故障
 *    变成工具执行失败或 Turn 中止。
 */
const seamHandlers: Record<string, SeamHandler> = {
  /**
   * 工具执行前——宿主 waterfall（listener 约定 `(exec, next)`，不调 next 即否决）。
   * 判定源 = `@sofagent/orchestrator.checkDangerousCommand`（与 sofagent 自家运行时
   * `wrapToolsWithGate` 同源，故 DSH 侧与自家运行时的拦截口径一致）。
   */
  'tools/pre-execute': async (...args: unknown[]) => {
    const helpers = seamHelpers(args);
    const [exec, next] = args;
    const cont = async (): Promise<unknown> =>
      typeof next === 'function' ? await (next as () => unknown)() : undefined;
    // v1.5.1 第七章：意图留痕先于命令类判定（非命令类工具的意图同样在参数里：
    // 写文件落点 / 外发 host），且**先于拦截**——被拒的操作也留痕。零执行权限：
    // 本调用不改本 handler 的返回语义（下方放行/拦截分支逐字不变）。
    await recordIntent(helpers, 'tools/pre-execute', exec);
    const command = commandOf(exec);
    if (command === null) return await cont(); // 非命令类工具不参与判定（不改变既有语义）
    try {
      const reason = await helpers.call('@sofagent/orchestrator', 'checkDangerousCommand', command);
      if (typeof reason === 'string' && reason !== '') {
        helpers.log(`工具执行前拦截：${reason}`);
        return { kind: 'deny', reason: `sofagent 工具门禁：${reason}` };
      }
    } catch (err) {
      logOnce(
        helpers,
        'pre-execute-unavailable',
        `工具执行前判定不可用（本次放行，不阻断宿主工具执行）：${errMsg(err)}`,
      );
    }
    return await cont();
  },
```

</details>

**依据 2 · 源码核查**：[engine/dsh-plugins/cordis-plugin-sofagent-audit/src/index.ts:214-252](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/engine/dsh-plugins/cordis-plugin-sofagent-audit/src/index.ts#L214-L252)

结果通道和失败decision。

<details>
<summary>查看原文（39行）</summary>

```text
   * 宿主 session 日志承担，全量落库只会给决策日志灌入与判定无关的噪声。
   */
  'tools/result': async (...args: unknown[]) => {
    const helpers = seamHelpers(args);
    const [exec, result] = args;
    // v1.5.1 第七章：结果入意图通道（与 pre-execute 的意图条目同链留痕、条目类型可区分）
    // ——先于下方「只留失败结果」的留证过滤：结果通道要的是**全部**调用的结果。
    await recordIntent(helpers, 'tools/result', exec, result);
    if ((result as { isError?: unknown } | null | undefined)?.isError !== true) return;
    const id = identityOf(exec);
    if (id === null) {
      logOnce(
        helpers,
        'result-no-identity',
        '工具结果留证：宿主 exec 未带 agent/session 标识——留证跳过（身份不可达，不猜测）',
      );
      return;
    }
    const info = exec as { name?: unknown; callId?: unknown } | null | undefined;
    try {
      await helpers.call(
        '@sofagent/audit',
        'emitDecision',
        {
          agentId: id.agentId,
          sessionId: id.sessionId,
          kind: 'TOOL_GATE',
          moment: 'ACT',
          category: 'skip',
          why: `工具结果留证：${typeof info?.name === 'string' && info.name !== '' ? info.name : '未知工具'} 返回错误`,
          artifactRef:
            typeof info?.callId === 'string' && info.callId !== '' ? `tool-call/${info.callId}` : undefined,
        },
        await resolveDataDir(helpers),
      );
    } catch (err) {
      logOnce(helpers, 'result-emit-failed', `工具结果留证写入失败（不阻断宿主）：${errMsg(err)}`);
    }
  },
```

</details>

**依据 3 · 源码核查**：[engine/dsh-plugins/plugin-kit/src/index.ts:595-642](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/engine/dsh-plugins/plugin-kit/src/index.ts#L595-L642)

真实ctx.on及按需import。

<details>
<summary>查看原文（48行）</summary>

```text
    c: HostContext,
    collect: (ret: unknown) => void,
    flags: Record<string, boolean>,
  ): number {
    const decls = options.seamHandlers;
    if (!decls || Object.keys(decls).length === 0) return 0;
    if (typeof c.on !== 'function') {
      console.error(
        `${logTag} 宿主事件订阅面缺失（ctx.on 非函数）——${Object.keys(decls).length} 个 seamHandler 未接线（降级，不阻断挂载）`,
      );
      return 0;
    }
    // handler 末位注入的助手面：既有引擎 @public API 按需懒取（不在此处静态 import——
    // 缺依赖的插件照常挂载，只在 handler 真被触发时抛可读错误，由 handler 决定是否吞）。
    const helpers: SeamHelpers = {
      call: async (pkg, api, ...args) => {
        const mod = (await import(pkg)) as Record<string, unknown>;
        const fn = mod[api];
        if (typeof fn !== 'function') {
          throw new Error(`${pkg}.${api} 不是可调用函数（seamHandler 桥接面）`);
        }
        return await (fn as (...a: unknown[]) => unknown)(...args);
      },
      bridges: () => resolveBridges(),
      flags: () => ({ ...flags }),
      log: (message) => console.error(`${logTag} ${message}`),
    };
    let wired = 0;
    for (const [event, handler] of Object.entries(decls)) {
      if (typeof handler !== 'function') {
        console.error(`${logTag} seamHandler ${event} 非可调用对象——跳过（不中断其余订阅）`);
        continue;
      }
      // 包装：宿主事件参数在前（原样透传，含 waterfall 的 next）+ helpers 恒在末位
      const wrapped: SeamHandler = (...args: unknown[]) => handler(...args, helpers);
      try {
        // 订阅 disposer 收进复合卸载契约（cordis ctx.on 本身经 fiber.effect 登记，
        // 此处照收一层——双保险，卸载幂等由 disposed 标志保证）
        collect(c.on(event, wrapped));
        wired++;
      } catch (err) {
        console.error(
          `${logTag} seam ${event} 订阅失败（跳过，不中断其余）：${err instanceof Error ? err.message : String(err)}`,
        );
      }
    }
    if (wired > 0) {
      console.error(`${logTag} seam 事件接线成功：${wired}/${Object.keys(decls).length}（${Object.keys(decls).join(', ')}）`);
```

</details>

**依据 4 · 源码核查**：[engine/dsh-plugins/plugin-kit/src/index.ts:414-430](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/engine/dsh-plugins/plugin-kit/src/index.ts#L414-L430)

invoke桥接调用与降级。

<details>
<summary>查看原文（17行）</summary>

```text
  async function invoke<T = unknown>(...args: unknown[]): Promise<T> {
    const report = await resolveBridges();
    if (report.resolved.length === 0) {
      const detail = report.failed.map((f) => `${f.pkg}.${f.api}: ${f.reason}`).join('；');
      throw new Error(`${id} 依赖不可用（全部桥接失败）：${detail}`);
    }
    if (report.failed.length > 0) {
      const detail = report.failed.map((f) => `${f.pkg}.${f.api}: ${f.reason}`).join('；');
      console.error(`${logTag} 部分桥接降级（其余照常）：${detail}`);
    }
    return (await report.resolved[0].fn(...args)) as T;
  }

  /**
   * 解析 settings 档位 → 当前开关表（v1.4.9 P2；v1.5.0 章十泛化为按 key 集读）。
   * 取值优先级：宿主 settingsScope.get()（用户层覆盖）> 声明默认值（settingsExtra /
   * featureGates 默认 'true'）。settingsScope 缺席（宿主无 settings 服务 / register
```

</details>

**依据 5 · 源码核查**：[engine/orchestrator/src/tools.ts:354-412](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/engine/orchestrator/src/tools.ts#L354-L412)

危险命令判定的模式范围。

<details>
<summary>查看原文（59行）</summary>

```text
export function checkDangerousCommand(command: string): string | null {
  const lower = command.toLowerCase().trim();
  if (!lower) return null;

  // 把命令按 ; | & 拆成独立段，逐段检查
  // （避免 `echo x; rm -rf /` 这类拼接漏检）
  const segments = lower.split(/[;|&]+/).map((s) => s.trim()).filter(Boolean);

  for (const seg of segments) {
    const tokens = seg.split(/\s+/).filter(Boolean);
    const rmIdx = tokens.indexOf('rm');
    if (rmIdx === -1) continue;

    // rm 之后的部分：flags（- 开头）与目标
    const rest = tokens.slice(rmIdx + 1);
    const flags = rest.filter((t) => t.startsWith('-'));
    const targets = rest.filter((t) => !t.startsWith('-'));

    // 是否含递归/危险删除 flag（r/recursive 或 f/force）
    const hasRecursive = flags.some(
      (f) => /^(--recursive|-r|-R)$/.test(f) || /^-[a-z]*r[a-z]*$/.test(f)
    );
    const hasForce = flags.some(
      (f) => /^(--force|-f)$/.test(f) || /^-[a-z]*f[a-z]*$/.test(f)
    );
    // 普通 rm（无 r/f flag）单文件删除不视为高危
    if (!hasRecursive && !hasForce) continue;

    // fail-closed：目标命中危险路径即拦截，宁可多拦不可漏拦
    const danger = targets.find((t) => isDangerousRmTarget(t));
    if (danger) {
      return `rm 递归删除危险路径（${danger}）`;
    }
  }

  // fork 炸弹：:(){:|:&};: 或变种（注意 () 在正则里要转义）
  const forkPattern = /:\s*\(\s*\)\s*\{\s*:\s*\|\s*:\s*&\s*\}\s*;?\s*:/;
  if (forkPattern.test(lower)) {
    return 'fork 炸弹（:(){:|:&};:）';
  }

  // 远程脚本执行：curl ... | sh / wget ... | sh / curl ... | bash
  // 允许 curl/wget 下载文件，禁止管道到 shell 执行
  if (/\b(curl|wget)\b.*\|\s*(sh|bash|zsh|fish)\b/.test(lower)) {
    return 'curl/wget 管道到 shell 远程执行（curl|sh 模式）';
  }

  // mkfs（格式化磁盘）
  if (/\bmkfs\b/.test(lower)) {
    return 'mkfs 格式化磁盘';
  }

  // dd 写裸设备：dd if=... of=/dev/...
  if (/\bdd\b.*\bof=\/dev\//.test(lower)) {
    return 'dd 写入裸设备（/dev/）';
  }

  return null;
}
```

</details>

**依据 6 · 源码核查**：[engine/audit/src/reporter.ts:105-140](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/engine/audit/src/reporter.ts#L105-L140)

runRules处理调用者给的diff输入。

<details>
<summary>查看原文（36行）</summary>

```text
export function runRules(
  diffFilesOrOptions: DiffFile[] | RunRulesOptions,
  logEntries?: LogEntry[],
  task?: string,
  strict?: boolean,
  silent?: boolean,
  commitMsg?: string,
  config?: AuditConfig,
  history?: AuditHistoryEntry[],
  gb48000?: boolean,
  quickMode?: boolean,
  diffRange?: string,
  scope?: AuditScope,
): AuditResult {
  // 对象签名：解包后走同一实现（调用方不可能两套都传）
  if (Array.isArray(diffFilesOrOptions)) {
    return runRulesWithFastFail(diffFilesOrOptions, logEntries ?? [], task, strict, silent, commitMsg, config, history, gb48000, quickMode, undefined, diffRange, scope);
  }
  const opts = diffFilesOrOptions;
  return runRulesWithFastFail(
    opts.diffFiles,
    opts.logEntries ?? [],
    opts.task,
    opts.strict,
    opts.silent,
    opts.commitMsg,
    opts.config,
    opts.history,
    opts.gb48000,
    opts.quickMode,
    undefined,
    opts.diffRange,
    opts.scope,
  );
}

```

</details>

#### 缺口

- 没有固定真实DSH Host事件契约/触发回执，也未穷尽可选MCP审计工具。
  **影响**：不能证明所有目标宿主都触发四事件或自动执行全部规则。
  **进一步探讨**：固定Host版本逐项核事件签名和触发，再记录哪些调用进入规则引擎与日志。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · “硬门禁”在停止、文件写入和失败时究竟约束什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

最重要的限制是默认开验收不等于失败绝不收尾。fs/write-intent明确只调用next，源码解释没有按路径判定API，故当前不阻断文件写入。pre-execute的引擎调用不可达也catch后继续next，留证失败只记日志；这是一种可用性优先的fail-open设计，不能作为独立安全边界。

turn-stopping只在acceptanceGate开启且有全局SOFAGENT_TASK_ID时调用checkAcceptance，projectRoot来自环境或进程cwd，不从当前Agent会话解析任务/项目。无验收定义failedCount=-1不阻断；有失败时若能构造消息且Agent有steer，就每(agent,turn)至多尝试一次续跑。消息工厂失败或无steer直接放行；steer返回值也未await，日志仅说明同步调用走到后面，不能保证异步完成。第二次同turn即使仍失败也不再续跑。因此“不过不放行”的强表述超过实现，且多项目共用进程需显式任务绑定。

checkAcceptance确实跑test/build命令、grep-absent和schema，命令用shell在指定projectRoot运行，exit0作为通过；这些验收定义必须可信，不能让不可信数据定义任意shell命令。它证明用户写的机器标准通过，不证明需求全覆盖或Agent没有绕过测试。

#### 证据与依据

**依据 1 · 源码核查**：[engine/dsh-plugins/cordis-plugin-sofagent-audit/src/index.ts:29-31](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/engine/dsh-plugins/cordis-plugin-sofagent-audit/src/index.ts#L29-L31)

全局projectRoot来源。

```text

/** 项目根：显式环境变量优先，缺省取宿主进程工作目录（与 CLI/MCP 侧同口径） */
const projectRoot = (): string => process.env.SOFAGENT_PROJECT_ROOT ?? process.cwd();
```

**依据 2 · 源码核查**：[engine/dsh-plugins/cordis-plugin-sofagent-audit/src/index.ts:255-334](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/engine/dsh-plugins/cordis-plugin-sofagent-audit/src/index.ts#L255-L334)

文件写入放行、任务ID、fail-open及一次steer。

<details>
<summary>查看原文（80行）</summary>

```text
   * 文件写入意图——宿主 waterfall（listener 约定 `(target, actor, next)`）。
   * 🔴 本事件位当前是**放行接线**：sofagent 引擎包没有「按目标路径判定写意图」的
   *    @public 判定源，按马鞍铁律（只接线、不新造判定）不做触发式拦截——
   *    订阅真实、disposer 真实、装载状态可自证，但不假装有判定。
   */
  'fs/write-intent': async (...args: unknown[]) => {
    const helpers = seamHelpers(args);
    const next = args[2]; // waterfall 约定 (target, actor, next)
    logOnce(
      helpers,
      'fs-write-intent-passthrough',
      '文件写入意图事件已接线（放行——引擎侧无「按路径判定写意图」的既有 API，不为接线新造判定）',
    );
    return typeof next === 'function' ? await (next as () => unknown)() : undefined;
  },

  /**
   * Turn 停止验收判定——宿主 serial（listener 约定 `(payload)`，payload 含
   * `{ agent, turn, signal }`）。判定源 = `@sofagent/orchestrator.checkAcceptance`。
   *
   * 「验收不过不放行」的机制：宿主在该事件上**不使用返回值**，真正能续跑 Turn 的
   * 唯一手段是向 agent 送一条消息（宿主 Stop hook 同法：`agent.steer(...)`），
   * 宿主随后复查 inbox 决定是否继续。故本 handler 走 `agent.steer`。
   *
   * 🔴 三重保险，避免把「接上验收」变成「Turn 打不住」：
   *    ① 未定义验收（failedCount = -1）不拦——「没有验收定义」≠「验收不过」；
   *    ② 每 (agent, turn) 至多续跑一次；
   *    ③ 全程 fail-open：判定源 / 消息工厂 / steer 任一不可用只记日志，不抛。
   */
  'agent/turn-stopping': async (...args: unknown[]) => {
    const helpers = seamHelpers(args);
    const [payload] = args;
    if (helpers.flags().acceptanceGate === false) return; // 关档：不参与 Turn 停止判定
    const taskId = (process.env.SOFAGENT_TASK_ID ?? '').trim();
    if (taskId === '') return; // 无任务标识 → 无验收可判（不凭空阻断收尾）
    let verdict: unknown;
    try {
      verdict = await helpers.call(
        '@sofagent/orchestrator',
        'checkAcceptance',
        (await resolveDataDir(helpers)) ?? '',
        taskId,
        projectRoot(),
      );
    } catch (err) {
      logOnce(helpers, 'turn-stopping-unavailable', `Turn 停止验收判定不可用（不拦截本次停止）：${errMsg(err)}`);
      return;
    }
    const v = (verdict ?? {}) as { ok?: unknown; failedCount?: unknown };
    if (v.ok !== false || typeof v.failedCount !== 'number' || v.failedCount <= 0) return;
    const p = (payload ?? {}) as { agent?: unknown; turn?: unknown };
    const agent = p.agent as { steer?: unknown } | null | undefined;
    if (agent === null || agent === undefined || typeof agent.steer !== 'function') {
      logOnce(
        helpers,
        'turn-stopping-no-steer',
        'Turn 停止验收未通过，但宿主 agent 无 steer 面——本次无法续跑（记日志，不异常）',
      );
      return;
    }
    if (lastSteeredTurn.get(agent as object) === p.turn) return; // ② 每 turn 至多一次
    lastSteeredTurn.set(agent as object, p.turn);
    try {
      const message = await helpers.call('@deepseek-ai/dsh-llm', 'createUserMessage', {
        content: [
          { type: 'text', text: `sofagent 验收未通过（${v.failedCount} 条未达）——先修完再收尾。` },
        ],
        source: { kind: 'plugin', plugin: 'sofagent-audit' },
      });
      (agent.steer as (m: unknown) => unknown)(message);
      helpers.log(
        `Turn 停止验收未通过（${v.failedCount} 条）——已向宿主 agent 续跑一条修正指令（本 turn 内至多一次）`,
      );
    } catch (err) {
      logOnce(helpers, 'turn-stopping-steer-failed', `验收续跑指令构造失败（不拦截本次停止）：${errMsg(err)}`);
    }
  },
};

/** 插件声明（本文件唯一手写处；适配层红线由 kit 承担：ctx 鸭子类型 + 宿主 API 缺席降级不抛） */
```

</details>

**依据 3 · 源码核查**：[engine/dsh-plugins/cordis-plugin-sofagent-audit/src/index.ts:192-209](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/engine/dsh-plugins/cordis-plugin-sofagent-audit/src/index.ts#L192-L209)

危险判定不可用仍继续。

<details>
<summary>查看原文（18行）</summary>

```text
    await recordIntent(helpers, 'tools/pre-execute', exec);
    const command = commandOf(exec);
    if (command === null) return await cont(); // 非命令类工具不参与判定（不改变既有语义）
    try {
      const reason = await helpers.call('@sofagent/orchestrator', 'checkDangerousCommand', command);
      if (typeof reason === 'string' && reason !== '') {
        helpers.log(`工具执行前拦截：${reason}`);
        return { kind: 'deny', reason: `sofagent 工具门禁：${reason}` };
      }
    } catch (err) {
      logOnce(
        helpers,
        'pre-execute-unavailable',
        `工具执行前判定不可用（本次放行，不阻断宿主工具执行）：${errMsg(err)}`,
      );
    }
    return await cont();
  },
```

</details>

**依据 4 · 源码核查**：[engine/orchestrator/src/acceptance/acceptance.ts:305-337](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/engine/orchestrator/src/acceptance/acceptance.ts#L305-L337)

无定义与四类criterion聚合。

<details>
<summary>查看原文（33行）</summary>

```text
export function checkAcceptance(dataDir: string, taskId: string, projectRoot: string): AcceptanceCheckResult {
  const start = Date.now();
  const def = loadAcceptanceDefinition(dataDir, taskId);
  if (!def) {
    return {
      taskId,
      ok: false,
      results: [],
      durationMs: Date.now() - start,
      failedCount: -1, // -1 = 未定义（区别于「有定义但失败」）
    };
  }

  const results: CriterionResult[] = def.criteria.map((criterion) => {
    switch (criterion.type) {
      case 'test':
      case 'build':
        return runCommandCriterion(criterion, projectRoot);
      case 'grep-absent':
        return runGrepAbsentCriterion(criterion, projectRoot);
      case 'schema':
        return runSchemaCriterion(criterion, projectRoot);
    }
  });

  const failedCount = results.filter((r) => !r.pass).length;
  return {
    taskId,
    ok: failedCount === 0,
    results,
    durationMs: Date.now() - start,
    failedCount,
  };
```

</details>

**依据 5 · 源码核查**：[engine/orchestrator/src/acceptance/acceptance.ts:153-185](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/engine/orchestrator/src/acceptance/acceptance.ts#L153-L185)

shell执行验收命令与exit0。

<details>
<summary>查看原文（33行）</summary>

```text
function runCommandCriterion(criterion: Extract<AcceptanceCriterion, { type: 'test' | 'build' }>, projectRoot: string): CriterionResult {
  const start = Date.now();
  const defaultCommand = criterion.type === 'test' ? 'npm test' : 'npm run build';
  const command = criterion.command ?? defaultCommand;
  try {
    const result = spawnSync(command, {
      cwd: projectRoot,
      shell: true,
      timeout: COMMAND_TIMEOUT_MS,
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024,
    });
    const exitCode = result.status ?? -1;
    const outputTail = ((result.stdout ?? '') + (result.stderr ?? '')).slice(-500);
    const pass = exitCode === 0;
    return {
      criterion,
      pass,
      detail: pass
        ? `${criterion.type} 通过（command: ${command}，exit 0）`
        : `${criterion.type} 失败（command: ${command}，exit ${exitCode}）${outputTail ? `\n输出尾部: ${outputTail}` : ''}`,
      durationMs: Date.now() - start,
    };
  } catch (err) {
    return {
      criterion,
      pass: false,
      detail: `${criterion.type} 执行异常（command: ${command}）：${err instanceof Error ? err.message : String(err)}`,
      durationMs: Date.now() - start,
    };
  }
}

```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对手工审查增加什么，失效和留证成本由谁承担？

**研究主题**：贡献与相对优势、依赖、兼容与流程、效果与总成本

#### 完整回答

本子包的增量是把现有sofagent审计/命令判定/验收API接到DSH事件，并尝试把调用身份与失败decision落盘。规则算法、验收标准和数据目录解析继承其他sofagent包；不是子包新增28种算法，也不是完整事务式交付门。缺依赖不让宿主崩溃是明确取舍，但对希望强制合规的用户会直接削弱核心需求。

Node声明>=18，依赖dsh-plugin-kit1.8.0，audit/orchestrator/core1.8.0为optional。kit若ctx.on缺失会整体跳事件；单个订阅失败继续其余，桥接按需import可能部分降级。挂载成功和版本对齐因此不是功能完备证明。settings开关在注册时读快照，运行时变化是否重订阅需按具体Host lifecycle核；不要假定立即生效。

首次要构建并核Host事件、配置同一项目/任务与可信验收；持续有日志磁盘、每次停止跑命令及可能续跑模型的资源成本，人工还要查看skip/降级和独立测试。失败时无日志不等于无调用，留证不可达不能作完整性证明；退出解除订阅，但已有日志、测试副作用和模型修改不回滚。相对手工跑同样测试，主要改变触发/记录便利，未识别供给、计价、资源池化或风险转移的经济结构变化，不因节约人工猜测增加经济分。

#### 证据与依据

**依据 1 · 源码核查**：[engine/dsh-plugins/cordis-plugin-sofagent-audit/package.json:1-14](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/engine/dsh-plugins/cordis-plugin-sofagent-audit/package.json#L1-L14)

包版本/Node与定位。

<details>
<summary>查看原文（14行）</summary>

```text
{
  "name": "cordis-plugin-sofagent-audit",
  "version": "1.8.0",
  "engines": {
    "node": ">=18"
  },
  "description": "变更机器审阅 + 验收硬门禁——28 规则 + git diff 硬证据 + Turn 停止验收判定（验收不过不放行，开关独立可关）（seam: tools/result + tools/pre-execute + fs/write-intent + agent/turn-stopping）——桥接 @sofagent/audit runRules / @sofagent/audit emitDecision / @sofagent/orchestrator checkDangerousCommand / @sofagent/orchestrator checkAcceptance / @sofagent/core getDataDir",
  "license": "MIT",
  "author": "KongFangXun",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "vitest run src/index.test.ts"
```

</details>

**依据 2 · 源码核查**：[engine/dsh-plugins/cordis-plugin-sofagent-audit/package.json:39-59](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/engine/dsh-plugins/cordis-plugin-sofagent-audit/package.json#L39-L59)

可选引擎与kit依赖。

<details>
<summary>查看原文（21行）</summary>

```text
  "devDependencies": {
    "typescript": "^7.0.2",
    "vitest": "^5.0.0"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "files": [
    "dist/",
    "cordis.patch.yml",
    "SKILL.md",
    "!dist/**/*.js.map",
    "!dist/**/*.d.ts.map",
    "!dist/**/*.test.*"
  ],
  "dependencies": {
    "@sofagent/dsh-plugin-kit": "1.8.0"
  }
}
```

</details>

**依据 3 · 源码核查**：[engine/dsh-plugins/plugin-kit/src/index.ts:599-638](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/engine/dsh-plugins/plugin-kit/src/index.ts#L599-L638)

事件缺席与部分订阅失败降级。

<details>
<summary>查看原文（40行）</summary>

```text
    const decls = options.seamHandlers;
    if (!decls || Object.keys(decls).length === 0) return 0;
    if (typeof c.on !== 'function') {
      console.error(
        `${logTag} 宿主事件订阅面缺失（ctx.on 非函数）——${Object.keys(decls).length} 个 seamHandler 未接线（降级，不阻断挂载）`,
      );
      return 0;
    }
    // handler 末位注入的助手面：既有引擎 @public API 按需懒取（不在此处静态 import——
    // 缺依赖的插件照常挂载，只在 handler 真被触发时抛可读错误，由 handler 决定是否吞）。
    const helpers: SeamHelpers = {
      call: async (pkg, api, ...args) => {
        const mod = (await import(pkg)) as Record<string, unknown>;
        const fn = mod[api];
        if (typeof fn !== 'function') {
          throw new Error(`${pkg}.${api} 不是可调用函数（seamHandler 桥接面）`);
        }
        return await (fn as (...a: unknown[]) => unknown)(...args);
      },
      bridges: () => resolveBridges(),
      flags: () => ({ ...flags }),
      log: (message) => console.error(`${logTag} ${message}`),
    };
    let wired = 0;
    for (const [event, handler] of Object.entries(decls)) {
      if (typeof handler !== 'function') {
        console.error(`${logTag} seamHandler ${event} 非可调用对象——跳过（不中断其余订阅）`);
        continue;
      }
      // 包装：宿主事件参数在前（原样透传，含 waterfall 的 next）+ helpers 恒在末位
      const wrapped: SeamHandler = (...args: unknown[]) => handler(...args, helpers);
      try {
        // 订阅 disposer 收进复合卸载契约（cordis ctx.on 本身经 fiber.effect 登记，
        // 此处照收一层——双保险，卸载幂等由 disposed 标志保证）
        collect(c.on(event, wrapped));
        wired++;
      } catch (err) {
        console.error(
          `${logTag} seam ${event} 订阅失败（跳过，不中断其余）：${err instanceof Error ? err.message : String(err)}`,
        );
```

</details>

**依据 4 · 源码核查**：[engine/dsh-plugins/plugin-kit/src/index.ts:774-796](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/engine/dsh-plugins/plugin-kit/src/index.ts#L774-L796)

开关快照及幂等卸载。

<details>
<summary>查看原文（23行）</summary>

```text
    // ⑤ seam 事件接线（v1.5.0 章十）：seamHandlers 声明时把宿主事件订阅接上——
    //    这是「seam 从声明到实现」的落地段。handler 内部经 helpers.call 取既有
    //    引擎 API（判定逻辑零改动），kit 只负责接管子 + 注入助手面 + 收 disposer。
    //    开关快照按**全部 settings 键**读（含 settingsExtra 字段，如 acceptanceGate）
    //    ——handler 内据此尊重用户关档。
    registerSeamHandlers(c, collect, resolveFlags(settingsScope, Object.keys(mergedSettings)));

    // ⑥ 卸载契约：收集到的宿主 disposer → 幂等复合 disposer，作为 apply 返回值交宿主登记
    //    （cordis 4.x `Fiber._execute`：apply 返回函数即登记为 effect disposer，fiber 卸载时反向执行）
    if (disposers.length === 0) return undefined;
    let disposed = false;
    return async () => {
      if (disposed) return;
      disposed = true;
      for (const undo of disposers.splice(0).reverse()) {
        try {
          await undo();
        } catch (err) {
          console.error(`${logTag} 卸载失败:`, err instanceof Error ? err.message : String(err));
        }
      }
    };
  }
```

</details>

**依据 5 · 源码核查**：[engine/dsh-plugins/cordis-plugin-sofagent-audit/src/index.ts:133-168](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/engine/dsh-plugins/cordis-plugin-sofagent-audit/src/index.ts#L133-L168)

留证失败不阻断。

<details>
<summary>查看原文（36行）</summary>

```text
async function recordIntent(
  helpers: SeamHelpers,
  event: string,
  exec: unknown,
  result?: unknown,
): Promise<void> {
  if (identityOf(exec) === null) {
    await recordIntentSkipEvidence(helpers, event, exec);
    return;
  }
  try {
    if (intentChannel === undefined) {
      const dataDir = await resolveDataDir(helpers);
      const created = await helpers.call(
        '@sofagent/audit',
        'createIntentChannel',
        dataDir === undefined ? {} : { dataDir },
      );
      const candidate = created as IntentChannelLike | null | undefined;
      intentChannel =
        candidate !== null && candidate !== undefined && typeof candidate.handle === 'function'
          ? candidate
          : null;
      if (intentChannel === null) {
        logOnce(
          helpers,
          'intent-channel-missing',
          '意图通道不可用（@sofagent/audit 未导出 createIntentChannel）——意图留痕停用，不阻断宿主',
        );
      }
    }
    intentChannel?.handle(event, [exec, result]);
  } catch (err) {
    logOnce(helpers, 'intent-record-failed', `意图留痕写入失败（不阻断宿主工具调用）：${errMsg(err)}`);
  }
}
```

</details>

#### 缺口

- 实际Host触发、设置热生效、日志完整性和总任务成本未验证。
  **影响**：无法确认相对手工审查净收益或持续适用性。
  **进一步探讨**：固定Host做断依赖/缺身份/失败验收/重启对照，记录被放行调用与完整日志及人工复核。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 当前可否当硬门禁采用，进一步方向如何推翻？

**研究主题**：采用判断、新假设与验证

#### 完整回答

当前观察，不把它作为安全或交付唯一门禁。已有sofagent环境的用户可在单项目测试副本先验证事件、故意缺依赖和失败criterion，核对何时继续、何时deny、何时只steer；正式提交/部署仍保留外部CI或人工批准。若任务ID不符、skip/日志缺失或验收失败仍停止，不依赖“服务就绪”继续放行，退回手工审查/CI。

可验证方向是明确分离“观察模式”和“强制模式”：强制模式需要会话绑定任务/项目、依赖不可达的UNKNOWN终态、带期限的人工恢复和独立交付关口；不能简单删掉fail-open变成无限续跑。依据是现有一次steer和全局任务环境在可用性与强制性之间取舍。用缺依赖、错误任务、始终失败和无steer四种故障比较误放行、无限等待、人工恢复时间及完整证据。若宿主根本不提供可阻断停止的契约，就把强制关口放外部CI而不是声称插件已实现；若观察模式已够用则不加复杂度。

#### 证据与依据

**依据 1 · 源码核查**：[engine/dsh-plugins/cordis-plugin-sofagent-audit/src/index.ts:279-334](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/engine/dsh-plugins/cordis-plugin-sofagent-audit/src/index.ts#L279-L334)

一次续跑与失败放行依据。

<details>
<summary>查看原文（56行）</summary>

```text
   * 🔴 三重保险，避免把「接上验收」变成「Turn 打不住」：
   *    ① 未定义验收（failedCount = -1）不拦——「没有验收定义」≠「验收不过」；
   *    ② 每 (agent, turn) 至多续跑一次；
   *    ③ 全程 fail-open：判定源 / 消息工厂 / steer 任一不可用只记日志，不抛。
   */
  'agent/turn-stopping': async (...args: unknown[]) => {
    const helpers = seamHelpers(args);
    const [payload] = args;
    if (helpers.flags().acceptanceGate === false) return; // 关档：不参与 Turn 停止判定
    const taskId = (process.env.SOFAGENT_TASK_ID ?? '').trim();
    if (taskId === '') return; // 无任务标识 → 无验收可判（不凭空阻断收尾）
    let verdict: unknown;
    try {
      verdict = await helpers.call(
        '@sofagent/orchestrator',
        'checkAcceptance',
        (await resolveDataDir(helpers)) ?? '',
        taskId,
        projectRoot(),
      );
    } catch (err) {
      logOnce(helpers, 'turn-stopping-unavailable', `Turn 停止验收判定不可用（不拦截本次停止）：${errMsg(err)}`);
      return;
    }
    const v = (verdict ?? {}) as { ok?: unknown; failedCount?: unknown };
    if (v.ok !== false || typeof v.failedCount !== 'number' || v.failedCount <= 0) return;
    const p = (payload ?? {}) as { agent?: unknown; turn?: unknown };
    const agent = p.agent as { steer?: unknown } | null | undefined;
    if (agent === null || agent === undefined || typeof agent.steer !== 'function') {
      logOnce(
        helpers,
        'turn-stopping-no-steer',
        'Turn 停止验收未通过，但宿主 agent 无 steer 面——本次无法续跑（记日志，不异常）',
      );
      return;
    }
    if (lastSteeredTurn.get(agent as object) === p.turn) return; // ② 每 turn 至多一次
    lastSteeredTurn.set(agent as object, p.turn);
    try {
      const message = await helpers.call('@deepseek-ai/dsh-llm', 'createUserMessage', {
        content: [
          { type: 'text', text: `sofagent 验收未通过（${v.failedCount} 条未达）——先修完再收尾。` },
        ],
        source: { kind: 'plugin', plugin: 'sofagent-audit' },
      });
      (agent.steer as (m: unknown) => unknown)(message);
      helpers.log(
        `Turn 停止验收未通过（${v.failedCount} 条）——已向宿主 agent 续跑一条修正指令（本 turn 内至多一次）`,
      );
    } catch (err) {
      logOnce(helpers, 'turn-stopping-steer-failed', `验收续跑指令构造失败（不拦截本次停止）：${errMsg(err)}`);
    }
  },
};

/** 插件声明（本文件唯一手写处；适配层红线由 kit 承担：ctx 鸭子类型 + 宿主 API 缺席降级不抛） */
```

</details>

**依据 2 · 源码核查**：[engine/dsh-plugins/plugin-kit/src/index.ts:599-638](https://github.com/KongFangXun/sofagent/blob/136a148837a31dc2471d578e15a76afc3328b0f6/engine/dsh-plugins/plugin-kit/src/index.ts#L599-L638)

事件接线降级依据。

<details>
<summary>查看原文（40行）</summary>

```text
    const decls = options.seamHandlers;
    if (!decls || Object.keys(decls).length === 0) return 0;
    if (typeof c.on !== 'function') {
      console.error(
        `${logTag} 宿主事件订阅面缺失（ctx.on 非函数）——${Object.keys(decls).length} 个 seamHandler 未接线（降级，不阻断挂载）`,
      );
      return 0;
    }
    // handler 末位注入的助手面：既有引擎 @public API 按需懒取（不在此处静态 import——
    // 缺依赖的插件照常挂载，只在 handler 真被触发时抛可读错误，由 handler 决定是否吞）。
    const helpers: SeamHelpers = {
      call: async (pkg, api, ...args) => {
        const mod = (await import(pkg)) as Record<string, unknown>;
        const fn = mod[api];
        if (typeof fn !== 'function') {
          throw new Error(`${pkg}.${api} 不是可调用函数（seamHandler 桥接面）`);
        }
        return await (fn as (...a: unknown[]) => unknown)(...args);
      },
      bridges: () => resolveBridges(),
      flags: () => ({ ...flags }),
      log: (message) => console.error(`${logTag} ${message}`),
    };
    let wired = 0;
    for (const [event, handler] of Object.entries(decls)) {
      if (typeof handler !== 'function') {
        console.error(`${logTag} seamHandler ${event} 非可调用对象——跳过（不中断其余订阅）`);
        continue;
      }
      // 包装：宿主事件参数在前（原样透传，含 waterfall 的 next）+ helpers 恒在末位
      const wrapped: SeamHandler = (...args: unknown[]) => handler(...args, helpers);
      try {
        // 订阅 disposer 收进复合卸载契约（cordis ctx.on 本身经 fiber.effect 登记，
        // 此处照收一层——双保险，卸载幂等由 disposed 标志保证）
        collect(c.on(event, wrapped));
        wired++;
      } catch (err) {
        console.error(
          `${logTag} seam ${event} 订阅失败（跳过，不中断其余）：${err instanceof Error ? err.message : String(err)}`,
        );
```

</details>

#### 缺口

- 强制模式设计与实际Host可阻断契约未验证。
  **影响**：未来方向不能当既有能力或当前安全建议。
  **进一步探讨**：先核宿主停止语义，再用故障矩阵比较外部CI与插件关口。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
