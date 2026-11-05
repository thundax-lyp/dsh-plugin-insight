# dsh-confirm-gate

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[bbcb287](https://github.com/SteelUnion/dsh-confirm-gate/tree/bbcb287730b228b63e0c005f127f01da0727da91)

<!-- BEGIN META -->
[![GitHub ★ 84](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=84&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/SteelUnion/dsh-confirm-gate) [![npm 30d 230](https://img.shields.io/static/v1?label=npm+30d&message=230&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@steelunion/dsh-confirm-gate) [![最新发布 2026-11-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@steelunion/dsh-confirm-gate)
<!-- END META -->

> **功能**：按轮累计持久化工具调用，分档提醒并在硬阈值请求确认，另为微信会话改道中途提问。

> **亮点**：相对人工查看和逐次审批，它把连续工作组织成按轮累计、阈值升级的提醒链，便于用户在明确接点重新决策；这是工具事件与上下文通知的组合，不是新的隔离机制。[Q01](#research-q01)

> **主要限制**：识别语子串会放行整轮，未知工具名可不计数，一次调用又可能批量修改；因而次数不能代表严格成本边界。默认patch名称与作用域包名的解析也仍需澄清。[Q03](#research-q03) 计数在执行前增加，拒绝与失败也消耗次数；消息集合是否为增量尚未核查，可能影响每轮状态连续性。

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
  - [Q01 · 计数提醒相对原生权限审批增加什么，谁需要它？](#detail-section-11)
  - [Q02 · 一轮如何重置、放行，微信交互如何改道？](#detail-section-12)
  - [Q03 · 能否把它当安全或严格成本边界，加载有什么前提？](#detail-section-13)
  - [Q04 · 持续提醒的代价与工程取舍是什么？](#detail-section-14)
  - [Q05 · 什么改进值得验证，目前如何决定使用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：允许代理连续改文件的 DSH 用户可用累计次数判断何时重新确认方向，目标是提醒和审批接点，而非准确计算金额或修改文件数。[Q01](#research-q01)

人工盯进度无需新增插件；逐次审批更细，但打断频繁。本组件提供累计次数这一折中，是否降低总负担尚无对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 累计持久化调用 | 提醒用户重新检查连续工作方向 | 按工具名称分类；一次调用只计一次 |
| 硬阈值审批 | 在额度接点请求确认 | 依赖宿主审批应答，不等于金额上限 |
| 微信交互改道 | 将中途选项改为普通文本提问 | 仅wechatQueue明确拥有的会话 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH与dsh-tools >=0.2.0-rc.2、Cordis >=4.0.4 | 启动必需，包声明 | 工具事件与加载 | 实际兼容未知，停止启用 |
| profile能解析运行时名称 | 必需 | patch挂载apply | 当前名称不一致，可能不能加载 |
| 宿主审批通道及应答者 | 硬阈值时必需 | 接受ask | 无法确认继续，需人工接管 |
| wechatQueue.owns服务 | 微信功能必需 | 确认通道归属 | 缺失时不拦中途提问 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户在隔离profile核对包与patch名称 | 确认模块可解析，否则暂停 |
| 加载 | 宿主调用apply并注册事件 | 配置错误显式抛出；需检查实际钩子命中 |
| 运行 | 代理调用已识别工具，插件累计通知 | 通知次数与轨迹相符 |
| 确认与退出 | 用户核对改动后决定继续或停用 | 不把含确认词的讨论当无害消息；停用回归原生审批 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本组件无外部API实现；宿主费用未知 | 配置profile与解析排查，耗时未知 | 包peer与名称须核实 |
| 持续使用 | 通知增加上下文；增量令牌未知 | 阅读通知并判断继续，频率未知 | 次数不等于金额 |
| 失败恢复 | 重试的模型花费未知 | 核查计数、审批和临时日志 | 内存计数不跨重启保留 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 累计提醒 | 源码在post-execute追加次数通知 | 模型是否主动停止及节省多少 |
| 硬阈值确认 | pre-execute返回ask | 默认部署审批是否送达 |
| 微信改道 | 归属服务为true时deny交互工具 | 对话能否最终完成 |

> **思考**：识别语子串会放行整轮，未知工具名可不计数，一次调用又可能批量修改；因而次数不能代表严格成本边界。默认patch名称与作用域包名的解析也仍需澄清。[Q03](#research-q03) 计数在执行前增加，拒绝与失败也消耗次数；消息集合是否为增量尚未核查，可能影响每轮状态连续性。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对人工查看和逐次审批，它把连续工作组织成按轮累计、阈值升级的提醒链，便于用户在明确接点重新决策；这是工具事件与上下文通知的组合，不是新的隔离机制。[Q01](#research-q01)

WeakMap把状态生命周期绑定agent，避免单独清理；后置钩子保留下游block反馈，适合借鉴上下文追加的组合方式。但工具名启发式、常开微信诊断日志和包名解析均增加维护条件。[Q04](#research-q04)

<a id="detail-section-5"></a>

### 1.4 主要限制

识别语子串会放行整轮，未知工具名可不计数，一次调用又可能批量修改；因而次数不能代表严格成本边界。默认patch名称与作用域包名的解析也仍需澄清。[Q03](#research-q03) 计数在执行前增加，拒绝与失败也消耗次数；消息集合是否为增量尚未核查，可能影响每轮状态连续性。

<a id="detail-section-6"></a>

### 1.5 使用建议

先核实隔离profile能解析运行时，再检查计数和审批是否与工具轨迹相符；若需要严格安全或金额控制，继续用宿主权限与人工核对。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

累计计数、分档通知和微信交互改道有源码依据；默认加载解析和实际控制效果未确认。结构化确认仅为未验证假设。

- 已检查：作者 README、包清单、源码路径 lib/index.js、cordis.patch.yml、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只检查固定源码、包与patch及统计材料；未执行作者测试、插件或宿主。README包含旧沙盒说明，本文以空接管集合的当前实现为准。
- 下一步：下一步先核对包名解析和审批应答，再用相同工具轨迹比较漏计、误计、人工介入和总令牌；结构化确认需独立原型，不能视为现有能力。

**分析版本**

- **仓库**：[SteelUnion/dsh-confirm-gate](https://github.com/SteelUnion/dsh-confirm-gate)
- **版本号**：0.3.0（[固定提交 bbcb287](https://github.com/SteelUnion/dsh-confirm-gate/tree/bbcb287730b228b63e0c005f127f01da0727da91)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可验证结构化确认事件是否能保留累计提醒的便利，同时减少讨论确认词导致的无意放行；同轨迹对照误放行和人工动作，任一指标恶化时放弃该方向。这是未实现假设。[Q05](#research-q05)

下一步先核对包名解析和审批应答，再用相同工具轨迹比较漏计、误计、人工介入和总令牌；结构化确认需独立原型，不能视为现有能力。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 2120 | — | — | 17389 |
| .js | source | 1 | 847 | 456 | 334 | — |
| .mjs | source | 1 | 150 | 115 | 27 | — |
| .mjs | test | 1 | 261 | 183 | 52 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/SteelUnion/dsh-confirm-gate/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/SteelUnion/dsh-confirm-gate/issues?q=is%3Aissue+created%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/SteelUnion/dsh-confirm-gate/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：累计操作提醒能否在不混淆权限边界的条件下帮助用户控制代理连续工作？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 计数提醒相对原生权限审批增加什么，谁需要它？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向允许代理连续改文件、但希望定期重新确认方向的 DSH 用户。合格结果是已识别持久化调用在阈值前得到提醒、到硬阈值进入审批，而不是把每次调用变成安全许可。原有办法是用户自行盯进度或给所有工具配置审批；本插件在两者之间增加按轮累计的提醒。源码的 pre/post 钩子分别计数和注入带次数的通知，能解释这一增量。它不计文件数量、令牌或金额，一次命令可做很多改动；因此不能由“15次”推出固定预算或损失上限。README 的节约一天预算是作者叙述，未有同任务对照。 这里累计的是pre-execute进入后的调用尝试，bump发生在返回ask及实际执行之前；审批拒绝或下游执行失败也不会退减，不能称为成功持久化次数。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:709-732](https://github.com/SteelUnion/dsh-confirm-gate/blob/bbcb287730b228b63e0c005f127f01da0727da91/lib/index.js#L709-L732)

工具分类通过后按agent计数，到hardLimit返回ask。

<details>
<summary>查看原文（24行）</summary>

```text
    const toolName = exec?.name;
    if (!isPersistent(toolName, exec) || !tracked(toolName)) return next();

    const agent = exec?.agent;
    if (agent === undefined || agent === null) return next();

    // 本轮已被 confirm 放行：一律通过，不计数。
    if (confirmed.get(agent) === true) {
      probe(`confirmed turn: allow ${toolName} without counting`);
      return next();
    }

    const count = bump(agent);

    if (count >= cfg.hardLimit) {
      // 达上限：索要 confirm。ask 会走审批通道，用户点确认才放行。
      return {
        kind: 'ask',
        reason: `${cfg.askReason}（识别语：${cfg.confirmWord}；本轮第 ${count} 次：${toolName}）`,
      };
    }

    // 未达上限：放行，提醒在 post-execute 注入。
    return next();
```

</details>

**依据 2 · 源码核查**：[lib/index.js:759-793](https://github.com/SteelUnion/dsh-confirm-gate/blob/bbcb287730b228b63e0c005f127f01da0727da91/lib/index.js#L759-L793)

执行后按当前次数追加提醒或停止指令。

<details>
<summary>查看原文（35行）</summary>

```text
    const count = currentCount(agent);
    if (count === 0) return downstream;

    let text;
    if (count > cfg.freeLimit) {
      // 超出额度：这是指令，不是提醒。语义为「立即停止无 confirm 的操作」。
      text = `${cfg.warningText}（识别语：${cfg.confirmWord}；本轮第 ${count}/${cfg.hardLimit} 次持久化：${toolName}）`;
    } else {
      text = `${cfg.reminderText}（本轮第 ${count}/${cfg.freeLimit} 次持久化：${toolName}）`;
    }

    const notice = {
      id: noticeId(),
      role: 'user',
      content: [{ type: 'text', text }],
      source: {
        // 使用 MessageSourceMap 中已声明的合法 kind，
        // 语义为「系统要求用户决定」，避免自定义 kind 被下游拒绝。
        kind: 'user-approval',
        form: 'notice',
        summary: `持久化 ${count}/${cfg.hardLimit} · ${toolName}`,
        producer: 'confirm-gate',
      },
    };

    if (downstream?.kind === 'block') {
      return {
        kind: 'block',
        feedback: downstream.feedback,
        additionalContexts: [notice, ...(downstream.additionalContexts ?? [])],
      };
    }
    return {
      ...downstream,
      additionalContexts: [notice, ...(downstream.additionalContexts ?? [])],
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 一轮如何重置、放行，微信交互如何改道？

**研究主题**：功能与机制

#### 完整回答

apply 创建 WeakMap 保存 agent 对象的计数和放行标志。pre-step 仅读取 source.kind 为 user 的收到的messages集合中的消息；消息只要包含识别语（不区分大小写）就清计数并放行整轮，否则撤销放行，并按配置清计数。工具前置钩子先处理微信交互，只有 wechatQueue.owns(sessionId) 明确为真才拒绝 ask-user-question，要求改成纯文本；服务缺失或抛错时不拦。随后分类并计数，硬阈值返回 ask；审批是否有应答者由宿主决定。执行后追加通知且保留下游 block 的反馈。计数绑定 agent 对象而非可恢复会话存储，不能保证重启后延续额度。 本插件没有消息ID去重或增量游标；仅据本源码不能确认宿主每步传入增量还是历史。如果历史user消息重复进入集合，可能重复清零或反复设置放行，计数连续性取决于该宿主事件契约。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:612-634](https://github.com/SteelUnion/dsh-confirm-gate/blob/bbcb287730b228b63e0c005f127f01da0727da91/lib/index.js#L612-L634)

微信归属是可选服务的严格true判断。

<details>
<summary>查看原文（23行）</summary>

```text
  function isWechatSession(exec) {
    try {
      const svc = typeof ctx?.get === 'function' ? ctx.get('wechatQueue') : undefined;
      if (svc === undefined || svc === null) {
        diag(`isWechat: svc=undefined tool=${exec?.name}`);
        return false;
      }
      if (typeof svc.owns !== 'function') {
        diag(`isWechat: svc has no owns(), keys=${Object.keys(svc)}`);
        return false;
      }
      const sessionId = exec?.agent?.session?.id;
      if (sessionId === undefined || sessionId === null) {
        diag(`isWechat: no session id tool=${exec?.name} keys=${Object.keys(exec?.agent?.session ?? {})}`);
        return false;
      }
      const owned = svc.owns(String(sessionId)) === true;
      diag(`isWechat: session=${String(sessionId)} owned=${owned}`);
      return owned;
    } catch (e) {
      diag(`isWechat: threw ${e && e.message}`);
      return false;
    }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:691-728](https://github.com/SteelUnion/dsh-confirm-gate/blob/bbcb287730b228b63e0c005f127f01da0727da91/lib/index.js#L691-L728)

微信deny发生在模式与计数判断之前。

<details>
<summary>查看原文（38行）</summary>

```text
    if (INTERACTIVE_TOOLS.has(exec?.name) && isWechatSession(exec)) {
      diag(`DENY interactive tool on wechat session: ${exec?.name}`);
      return {
        kind: 'deny',
        reason: WECHAT_INTERACTIVE_DENIED,
      };
    }

    // 每次现读权限模式：热切换要能跟上。
    const gate = gateState(ctx, exec);
    if (!gate.active) {
      if (!gateSkippedLogged) {
        gateSkippedLogged = true;
        probe(`gate inactive: ${describeMode(gate.mode, gate.known, gate.source)} — skipping`);
      }
      return next();
    }

    const toolName = exec?.name;
    if (!isPersistent(toolName, exec) || !tracked(toolName)) return next();

    const agent = exec?.agent;
    if (agent === undefined || agent === null) return next();

    // 本轮已被 confirm 放行：一律通过，不计数。
    if (confirmed.get(agent) === true) {
      probe(`confirmed turn: allow ${toolName} without counting`);
      return next();
    }

    const count = bump(agent);

    if (count >= cfg.hardLimit) {
      // 达上限：索要 confirm。ask 会走审批通道，用户点确认才放行。
      return {
        kind: 'ask',
        reason: `${cfg.askReason}（识别语：${cfg.confirmWord}；本轮第 ${count} 次：${toolName}）`,
      };
```

</details>

**依据 3 · 源码核查**：[lib/index.js:807-829](https://github.com/SteelUnion/dsh-confirm-gate/blob/bbcb287730b228b63e0c005f127f01da0727da91/lib/index.js#L807-L829)

用户消息决定整轮放行或重置。

<details>
<summary>查看原文（23行）</summary>

```text
  reg('agent/pre-step', ({ agent, messages }, next) => {
    if (!Array.isArray(messages)) return next();

    for (const m of messages) {
      if (m?.source?.kind !== 'user') continue;
      const blocks = Array.isArray(m.content) ? m.content : [];
      const text = blocks
        .filter((b) => b && b.type === 'text' && typeof b.text === 'string')
        .map((b) => b.text)
        .join('\n');

      if (containsConfirm(text, cfg.confirmWord)) {
        // 命中识别语：本轮全部放行。
        confirmed.set(agent, true);
        counters.delete(agent);
        probe(`CONFIRMED turn for agent; word="${cfg.confirmWord}"`);
      } else {
        // 新的普通消息：撤销放行，恢复计数。
        confirmed.delete(agent);
        if (cfg.resetOnUserMessage) counters.delete(agent);
      }
    }
    return next();
```

</details>

#### 缺口

- 本次材料未核查宿主pre-step的messages是否为严格增量。
  **影响**：历史用户消息若重复进入集合，可能重置计数或放行，影响按轮额度连续性。
  **进一步探讨**：固定宿主版本核查pre-step生产者及消息领取逻辑，再以收到的消息集合追踪状态。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 能否把它当安全或严格成本边界，加载有什么前提？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

不能。分类器对已列工具及后缀计数，未匹配名称返回false；命令只用白名单和正则判断，不解析真实副作用。包含confirm的讨论也会放行整个回合。默认沙盒接管集合为空，所以所有模式仍计数，这与README后半段旧的沙盒静默说明不一致，应以固定实现为准。包名为@steelunion/dsh-confirm-gate，bundle patch里的name却是dsh-confirm-gate；本仓未提供加载器解析该名字的独立证明，因此默认安装能否解析是实际缺口，不能仅凭导出表说即装即用。源码需要DSH工具事件和审批通道，微信附加能力还依赖wechatQueue服务。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:271-284](https://github.com/SteelUnion/dsh-confirm-gate/blob/bbcb287730b228b63e0c005f127f01da0727da91/lib/index.js#L271-L284)

未匹配工具不计数，正则名称机制不是副作用追踪。

<details>
<summary>查看原文（14行）</summary>

```text
export function isPersistent(toolName, exec) {
  if (typeof toolName !== 'string' || toolName.length === 0) return false;
  if (NON_PERSISTENT.has(toolName)) return false;

  // 命令类工具：按命令内容判定。只读命令直接放行，不计数。
  if (COMMAND_TOOLS.has(toolName)) {
    const cmd = exec?.arguments?.command;
    if (typeof cmd === 'string' && isReadOnlyPwshCommand(cmd)) return false;
    return true;
  }

  if (PERSISTENT_EXACT.has(toolName)) return true;
  const lower = toolName.toLowerCase();
  return PERSISTENT_SUFFIX.some((suffix) => lower.endsWith(suffix));
```

</details>

**依据 2 · 源码核查**：[lib/index.js:341-345](https://github.com/SteelUnion/dsh-confirm-gate/blob/bbcb287730b228b63e0c005f127f01da0727da91/lib/index.js#L341-L345)

任意子串命中即可放行。

```text
function containsConfirm(text, confirmWord) {
  if (typeof text !== 'string') return false;
  const word = confirmWord.trim().toLowerCase();
  if (word.length === 0) return false;
  return text.toLowerCase().includes(word);
```

**依据 3 · 源码核查**：[lib/index.js:396-409](https://github.com/SteelUnion/dsh-confirm-gate/blob/bbcb287730b228b63e0c005f127f01da0727da91/lib/index.js#L396-L409)

当前默认集合为空。

<details>
<summary>查看原文（14行）</summary>

```text
 * **v0.3.0 起改为空集合：所有模式一律生效，沙盒模式也默认开启。**
 *
 * 原设计（v0.2.1 及以前）：本插件是「没人管的时候给一把尺」，
 * `read-only` 与 `workspace-write` 下边界已被 DSH 沙盒拦住，就跳过计数，
 * 免得把正常操作也拦一次。
 *
 * 改动的理由：沙盒管的是**能不能碰文件**，本插件管的是**这一轮改了多少次**，
 * 两件事不重合。沙盒开着的时候，agent 照样能在一轮里改五十个文件、
 * 跑二十条命令——额度没有防线。而且新手最常用的就是 `workspace-write`，
 * 恰好是门不生效的那一档，等于装了不用。
 *
 * 想恢复旧行为：把下面两个模式加回集合即可，不用改其他任何地方。
 */
export const SANDBOX_MANAGED_MODES = new Set([]);
```

</details>

**依据 4 · 源码核查**：[package.json:14-42](https://github.com/SteelUnion/dsh-confirm-gate/blob/bbcb287730b228b63e0c005f127f01da0727da91/package.json#L14-L42)

作用域包名的导出和peer范围。

<details>
<summary>查看原文（29行）</summary>

```text
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": {
      "default": "./lib/index.js"
    },
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "lib/index.js",
    "cordis.patch.yml",
    "README.md",
    "README.zh-CN.md",
    "LICENSE"
  ],
  "scripts": {
    "test": "node test/integration.mjs"
  },
  "dependencies": {},
  "peerDependencies": {
    "@deepseek-ai/dsh": ">=0.2.0-rc.2",
    "@deepseek-ai/dsh-tools": ">=0.2.0-rc.2",
    "@deepseek-ai/cordis": ">=4.0.4"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
```

</details>

**依据 5 · 源码核查**：[cordis.patch.yml:6-12](https://github.com/SteelUnion/dsh-confirm-gate/blob/bbcb287730b228b63e0c005f127f01da0727da91/cordis.patch.yml#L6-L12)

补丁引用未带作用域的运行时名称。

```text
- insert:
    - id: confirm-gate
      name: 'dsh-confirm-gate'
      config:
        freeLimit: 10
        hardLimit: 15
        confirmWord: confirm
```

#### 缺口

- 作用域包与patch运行时名不一致，尚无本版本实际解析记录。
  **影响**：默认安装可能无法把运行时挂到profile，计数链路即使存在也不会生效。
  **进一步探讨**：在隔离profile核对解析到的模块和pre-execute探针；若需名称覆写则由维护者说明。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 持续提醒的代价与工程取舍是什么？

**研究主题**：效果与总成本、工程质量与复用

#### 完整回答

主要工程取舍是把每轮状态留在内存而非持久化，用WeakMap随agent释放回收；正则分类易读但要跟随工具命名维护。配置校验拒绝负数或hardLimit不大于freeLimit，能够在加载阶段暴露部分配置错误；include/exclude按通配模式编译并对分类后的工具再筛选。诊断probe默认关闭，但微信交互判定日志始终追加系统临时文件，存在日志维护工作。现金上无外部API调用实现，不能因此把宿主模型花费计为零；每次通知增加上下文，用户还需判定何时继续。首次安装、持续中断和恢复排查的耗时均无测量。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:54-71](https://github.com/SteelUnion/dsh-confirm-gate/blob/bbcb287730b228b63e0c005f127f01da0727da91/lib/index.js#L54-L71)

微信诊断日志常开且写文件失败被忽略。

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * 微信拦截的常开诊断日志。
 *
 * 与上面的 `probe` 不同：这个**不受 DEBUG_PROBE 开关控制**，因为它只在
 * 「交互类工具被调用」时才写一行，频率极低（正常使用几乎不触发），
 * 代价可以忽略。而它记录的是拦截判定的每一个中间值 ——
 * 排查「为什么没拦住」时，靠猜 session id 对不对会浪费好几轮。
 *
 * 写入系统临时目录，各平台自动适配，不污染用户目录。
 */
const DIAG_PATH = join(tmpdir(), 'confirm-gate-wechat.log');
function diag(msg) {
  const line = `${new Date().toISOString()} ${msg}\n`;
  try {
    appendFileSync(DIAG_PATH, line);
  } catch {
    /* 诊断失败不能影响拦截判定 */
  }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:291-319](https://github.com/SteelUnion/dsh-confirm-gate/blob/bbcb287730b228b63e0c005f127f01da0727da91/lib/index.js#L291-L319)

阈值归一化与可选范围。

<details>
<summary>查看原文（29行）</summary>

```text
function validateConfig(config) {
  const freeLimit = config?.freeLimit ?? 10;
  const hardLimit = config?.hardLimit ?? 15;
  if (!Number.isInteger(freeLimit) || freeLimit < 0) {
    throw new Error(`confirm-gate: freeLimit 必须是 >= 0 的整数，收到 ${freeLimit}`);
  }
  if (!Number.isInteger(hardLimit) || hardLimit < 1) {
    throw new Error(`confirm-gate: hardLimit 必须是 >= 1 的整数，收到 ${hardLimit}`);
  }
  if (hardLimit <= freeLimit) {
    throw new Error(
      `confirm-gate: hardLimit (${hardLimit}) 必须大于 freeLimit (${freeLimit})，否则提醒区为空`,
    );
  }
  return {
    freeLimit,
    hardLimit,
    confirmWord: validateConfirmWord(config?.confirmWord ?? DEFAULT_CONFIRM_WORD),
    reminderText: config?.reminderText ?? DEFAULT_REMINDER,
    warningText: config?.warningText ?? DEFAULT_WARNING,
    deniedText: config?.deniedText ?? DEFAULT_DENIED,
    askReason: config?.askReason ?? DEFAULT_ASK_REASON,
    include: config?.include ?? [],
    exclude: config?.exclude ?? [],
    resetOnUserMessage: config?.resetOnUserMessage ?? true,
    // 默认 false：用户回一句 confirm 不应被算作「新一轮任务」，
    // 否则确认一次就能再白拿一整轮额度，硬上限形同虚设。
    resetOnConfirm: config?.resetOnConfirm ?? false,
  };
```

</details>

**依据 3 · 源码核查**：[lib/index.js:535-564](https://github.com/SteelUnion/dsh-confirm-gate/blob/bbcb287730b228b63e0c005f127f01da0727da91/lib/index.js#L535-L564)

范围筛选和内存计数。

<details>
<summary>查看原文（30行）</summary>

```text
  /** 是否纳入计数。include 为空表示全纳入；exclude 优先。 */
  function tracked(toolName) {
    if (includePatterns.length > 0 && !includePatterns.some((p) => p.test(toolName))) {
      return false;
    }
    return !excludePatterns.some((p) => p.test(toolName));
  }

  /** 包一层注册，把任何异常写进探针再原样抛出。 */
  function reg(event, handler) {
    try {
      const d = ctx.on(event, handler);
      probe(`registered ${event} -> disposer=${typeof d}`);
      return d;
    } catch (e) {
      probe(`REGISTER FAILED ${event}: ${e && e.message}`);
      throw e;
    }
  }

  /**
   * 按 agent 记录本轮已发生的持久化调用次数。
   * 用 WeakMap，agent 释放即回收，不需要手动清理。
   */
  const counters = new WeakMap();

  function bump(agent) {
    const next = (counters.get(agent) ?? 0) + 1;
    counters.set(agent, next);
    return next;
```

</details>

#### 缺口

- 没有同任务下通知额外令牌、打断次数和误判率的测量。
  **影响**：无法证明累计提醒比人工查看或逐次审批的总负担更低。
  **进一步探讨**：在相同任务和工具流中记录人工介入、总令牌、漏计及误计，比较三种方式。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么改进值得验证，目前如何决定使用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

可以提出“结构化确认替代子串放行”的未验证假设。由Q02的整轮放行和Q03的讨论词误匹配推导，若确认绑定一次明确的审批事件或精确用户动作，可能降低无意放行，同时保留累计预算。最小验证是在同一工具轨迹中加入确认词讨论、真正确认和下一条普通消息，比较误放行与额外交互；若误放行未下降或操作负担显著增大则否定。当前建议观察，先核实Q03加载名称和审批接线，再考虑小范围计数试验。需要安全隔离、准确金额上限或子代理总操作额度的用户应继续依赖宿主权限、沙盒及人工检查，不能把这里的计数当替代。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:818-826](https://github.com/SteelUnion/dsh-confirm-gate/blob/bbcb287730b228b63e0c005f127f01da0727da91/lib/index.js#L818-L826)

放行语义为整轮布尔状态。

```text
      if (containsConfirm(text, cfg.confirmWord)) {
        // 命中识别语：本轮全部放行。
        confirmed.set(agent, true);
        counters.delete(agent);
        probe(`CONFIRMED turn for agent; word="${cfg.confirmWord}"`);
      } else {
        // 新的普通消息：撤销放行，恢复计数。
        confirmed.delete(agent);
        if (cfg.resetOnUserMessage) counters.delete(agent);
```

**依据 2 · 源码核查**：[lib/index.js:721-728](https://github.com/SteelUnion/dsh-confirm-gate/blob/bbcb287730b228b63e0c005f127f01da0727da91/lib/index.js#L721-L728)

硬阈值依赖宿主ask审批。

```text
    const count = bump(agent);

    if (count >= cfg.hardLimit) {
      // 达上限：索要 confirm。ask 会走审批通道，用户点确认才放行。
      return {
        kind: 'ask',
        reason: `${cfg.askReason}（识别语：${cfg.confirmWord}；本轮第 ${count} 次：${toolName}）`,
      };
```

#### 缺口

- 结构化确认方案尚未实现或对照验证。
  **影响**：不能将可能降低误放行计入现有优势。
  **进一步探讨**：制作仅改变确认来源的小型原型，以误放行率和人工动作数决定是否继续。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
