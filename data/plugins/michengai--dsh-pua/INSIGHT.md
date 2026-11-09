# DSH PUA

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[5e2346b](https://github.com/MichengAI/dsh-pua/tree/5e2346b5fd06a0a3e5ac6d8c510d96227f892424)

<!-- BEGIN META -->
[![GitHub ★ 66](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=66&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MichengAI/dsh-pua) [![npm 30d 26,965](https://img.shields.io/static/v1?label=npm+30d&message=26%2C965&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-pua) [![最新发布 2026-11-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-pua)
<!-- END META -->

> **功能**：为 DSH 注册会话纠偏提示与推进循环，可在模型报告完成后执行用户指定的验收命令。

> **亮点**：[Q01](#research-q01) 与 [Q03](#research-q03) 确认将继续、停止和验收反馈接进 DSH 会话，独立命令可以把部分人工重复检查转为明确进程结果。

> **主要限制**：[Q03](#research-q03) 默认无验证时可由模型标记结束，标记只是文本匹配。有验证也只能覆盖该命令测试到的条件。[Q04](#research-q04) 默认 0 轮限制表示不限轮数，取消不撤回此前改动。

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
  - [Q01 · 相对人工要求继续排查增加了什么？](#detail-section-11)
  - [Q02 · 如何把触发变成会话提示和状态？](#detail-section-12)
  - [Q03 · 循环的证据门和终止在哪？](#detail-section-13)
  - [Q04 · 如何可控采用并退出？](#detail-section-14)
  - [Q05 · 独立失败样本能否减少误完成？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH 用户修复可重现的小型回归，需要在模型反复尝试时核对是否真实满足已有检查并可随时停止。

用户按工作区文件与日志人工指导下一轮，自己运行固定测试后决定接受或停止。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **用户命令**：pua 和 pua-cancel-loop
- **模型工具**：pua_reference 资料读取
- **事件监听**：终端结果、步骤和回合停止事件

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node 22.19 及以上和 DSH >=0.2.0-rc.1、<0.3.0-0 | 声明运行条件 | 加载 DSH Host 及客户端贡献 | 需按实际宿主核对 |
| 命令、系统提示、会话服务 | 相关路径必需 | 注入、运行和记录 | 入口不可用或无法处理状态 |
| subprocess、会话 cwd 和明确命令 | 独立验收必需 | 运行用户定义的检查 | 拒绝开启或暂停 |
| 正轮次上限及可恢复副本 | 限定试用必需 | 约束资源和退出 | 无轮次上限或需人工恢复 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户保留副本并审查命令 | 测试可覆盖目标负样本 |
| 加载 | 用户只打开当前会话 | 状态和宿主服务可见 |
| 执行 | 配置小轮次上限并提交任务 | 查看子进程验收结果及上限 |
| 退出 | 用户取消，核对改动后人工复验 | 将已执行操作与循环状态分开 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Host、工作区副本及本地测试工具 | 验证命令、目标和轮次 | 初始化时间与依赖费用未知 |
| 持续使用 | 模型轮次和本机子进程 | 看验收输出与变更，复核覆盖 | 轮次和实际费用取决任务，未实测 |
| 失败恢复 | 备用副本和已有测试 | 取消、核对已发生动作、恢复及人工验收 | 实际副作用及恢复人时未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 终端观察 | 有按工具类型和结构化失败的提示路径 | 任务误判率或模型改进幅度 |
| 完成复核 | 可配置命令和真实进程退出判断 | 误通过率、覆盖和节时 |
| 退出 | 有轮次上限和取消控制 | 宿主停止可靠性及已发生操作恢复 |

> **思考**：[Q03](#research-q03) 默认无验证时可由模型标记结束，标记只是文本匹配。有验证也只能覆盖该命令测试到的条件。[Q04](#research-q04) 默认 0 轮限制表示不限轮数，取消不撤回此前改动。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q03](#research-q03) 确认将继续、停止和验收反馈接进 DSH 会话，独立命令可以把部分人工重复检查转为明确进程结果。

会话命令和运行状态分别重放，运行观察只在合适的步骤边界进入提示。完成标记、子进程返回和状态记录均可分别核对。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 默认无验证时可由模型标记结束，标记只是文本匹配。有验证也只能覆盖该命令测试到的条件。[Q04](#research-q04) 默认 0 轮限制表示不限轮数，取消不撤回此前改动。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q01](#research-q01) 有固定回归检查的用户可在可丢弃副本试一个小任务。[Q03](#research-q03) 设置验证命令和小轮次上限，检查失败样本确实被拒绝。[Q04](#research-q04) 出现重复失败、证据不明或到上限时取消并人工核对改动，恢复既有检查流程。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认 DSH 接线、终端观察、循环状态及命令门。真实模型任务质量、运行隔离和采用收益未测。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、src/index.ts、src/runtime.ts、src/command.ts、src/state.ts、package.json、src/args.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根 DSH 插件的会话命令、提示注入、终端观察和 Loop。原版素材、远程设置、可选防作弊和所有宿主权限未全面审计。
- 下一步：仅固定源码。最小对照用同一完成标记和成对通过或失败工作区样本，比较无命令、恒通过命令和可识别失败的命令，记录状态、进程结果及人时。

**分析版本**

- **仓库**：[MichengAI/dsh-pua](https://github.com/MichengAI/dsh-pua)
- **版本号**：1.0.8（[固定提交 5e2346b](https://github.com/MichengAI/dsh-pua/tree/5e2346b5fd06a0a3e5ac6d8c510d96227f892424)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 用固定负样本验收命令和小轮次上限，可能降低草率宣告完成的概率，需观察实际通过、拒绝和耗时。

仅固定源码。最小对照用同一完成标记和成对通过或失败工作区样本，比较无命令、恒通过命令和可识别失败的命令，记录状态、进程结果及人时。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 97 | 9166 | — | — | 119635 |
| .js | source | 25 | 2851 | 2702 | 145 | — |
| .mjs | source | 6 | 325 | 309 | 10 | — |
| .ts | source | 25 | 3177 | 2913 | 135 | — |
| .mjs | test | 25 | 2977 | 2783 | 23 | — |
| .ts | test | 1 | 40 | 37 | 2 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/MichengAI/dsh-pua/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断遇到持续失败和虚报完成的 DSH 用户，能否靠本插件明确推进、复核与停止状态，并区分提示词引导和宿主执行证据。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相对人工要求继续排查增加了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要在 DSH 修复可复现问题的用户，可给当前会话加失败观察、方法切换提示和可选验收循环。作者声称降低草率完成，根 manifest 和实际代码注册会话命令和系统提示。相对用户逐轮提醒并手工跑同一检查，插件可在具体完成信号触发时自动启动用户给定命令，状态区分完成、暂停、取消和到上限。合格交付仍是用户定义的工件与复验，若原流程已有稳定测试和人工停止，角色文案的独立增益未知。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:22-31](https://github.com/MichengAI/dsh-pua/blob/5e2346b5fd06a0a3e5ac6d8c510d96227f892424/README.md#L22-L31)

作者的目标和效果主张

<details>
<summary>查看原文（10行）</summary>

```text
> DSH PUA 将 [原版 PUA](https://github.com/tanweai/pua) 带到 DeepSeek Harness，在 Agent 反复失败、过早放弃或草率宣告完成时，引导它换方法、查原因、拿证据。社区维护，非 DeepSeek AI 或 PUA 官方产品。

## 功能概览

- **遇到困难换方法**：提醒 Agent 重新检查思路，避免重复无效尝试。
- **完成前检查证据**：要求核对结果，减少“说完成了，却没有验证”的情况。
- **选择你喜欢的风格**：支持 15 种大厂风味，以及 P7、P9、P10、夸夸、妈妈等角色模式。
- **在界面中调整**：插件设置保存全局设置，聊天入口可以单独调整当前会话。
- **按验收结果继续任务**：可启动 Loop，让 Agent 继续修正，直到验收通过、达到轮次上限或被取消。
- **防作弊门**：拦截读取隐藏基准答案（含联网搜索），变更测试、评分或 CI 资产时向模型注入提醒。
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:1-5](https://github.com/MichengAI/dsh-pua/blob/5e2346b5fd06a0a3e5ac6d8c510d96227f892424/cordis.patch.yml#L1-L5)

宿主及远程端组合

```text
- insert:
    - id: michengai-pua-remote
      name: '@michengai/dsh-pua/remote'
    - id: michengai-pua
      name: '@michengai/dsh-pua'
```

**依据 3 · 源码核查**：[src/index.ts:38-70](https://github.com/MichengAI/dsh-pua/blob/5e2346b5fd06a0a3e5ac6d8c510d96227f892424/src/index.ts#L38-L70)

动态系统提示和命令注册

<details>
<summary>查看原文（33行）</summary>

```text
  ctx.systemPrompt.section({
    name: 'michengai:pua',
    order: 120,
    text: ({ agent }) => {
      if (!agent) return '';
      const state = store.read(agent.session);
      if (state.enabled) {
        const flavor = state.flavorLocked ? state.flavor : 'auto';
        const mode = runtime.effectiveMode(agent.session, state.mode);
        const key = `${mode}/${flavor}`;
        if (!prompts.has(key)) prompts.set(key, renderOriginalPrompt(catalog, flavor, mode));
        return prompts.get(key)!;
      }
      if ((agent.session.header.delegationDepth ?? 0) > 0) return '';
      return state.configured || agent.session.header.parentSession !== undefined ? DISABLED_PROMPT : '';
    },
  });
  // 注册表只能存普通字符串；斜杠菜单按界面语言覆盖这两项，不在这里做文案映射。
  ctx.commands.register({
    name: 'pua',
    description: UI.zh.slash.pua.description,
    input: { hint: UI.zh.slash.pua.hint },
    handler: invocation => handleCommand(store, { ...invocation, signal: AbortSignal.any([invocation.signal, lifetime.signal]) }, templates, ctx.get('subprocess'), { catalog, preferences, runtime, ctx }),
  });
  ctx.commands.register({
    name: 'pua-cancel-loop', description: UI.zh.slash.cancelLoop.description,
    handler: invocation => {
      if (invocation.rawInput.trim()) return { kind: 'error', text: 'pua-cancel-loop 不接受额外参数。' };
      invocation.signal.throwIfAborted();
      runtime.cancel(invocation.agent.session);
      store.stage(invocation.agent.session, invocation.commandId, { kind: 'cancel-pua-loop' });
      return { kind: 'success', text: 'PUA · 当前 Loop 已取消。' };
    },
```

</details>

**依据 4 · 源码核查**：[src/runtime.ts:568-609](https://github.com/MichengAI/dsh-pua/blob/5e2346b5fd06a0a3e5ac6d8c510d96227f892424/src/runtime.ts#L568-L609)

状态与验收分岔

<details>
<summary>查看原文（42行）</summary>

```text
    const finish = (status: LoopState["status"], note: string) => {
      state.loop = { ...loop, status };
      this.save(session, state, note);
    };
    if (/<loop-abort>[\s\S]+?<\/loop-abort>/u.test(output)) {
      finish("cancelled", "模型报告 Loop 中止；不代表完成。");
      return;
    }
    if (/<loop-pause>[\s\S]+?<\/loop-pause>/u.test(output)) {
      finish("paused", "Loop 暂停，等待用户补充后恢复。");
      return;
    }
    let note = "";
    if (/<promise>\s*LOOP_DONE\s*<\/promise>/u.test(output)) {
      if (!loop.verify) {
        finish(
          "complete",
          "完成信号已接受：未配置 Oracle，仅 honor system，不是独立验证通过。",
        );
        return;
      }
      const subprocess = this.ctx.get("subprocess");
      if (!subprocess || !session.header.cwd) {
        finish(
          "paused",
          "缺少 subprocess 或会话工作目录，无法独立验收，Loop 暂停。",
        );
        return;
      }
      const controller = new AbortController();
      this.activeVerifiers.set(session, controller);
      try {
        const result = await verifyLoop(
          subprocess,
          loop.verify,
          session.header.cwd,
          AbortSignal.any([signal, controller.signal, this.lifetime]),
          (loop.verificationTimeout ?? 120) * 1000,
        );
        if (state.loop !== loop || !this.store.read(session).enabled) return;
        if (result.ok) {
          finish("complete", "Oracle 独立验收通过。\n" + result.detail);
```

</details>

#### 缺口

- 没有同任务的完成与人时对照。
  **影响**：无法衡量角色引导是否减少来回沟通或返工。
  **进一步探讨**：固定小型回归任务，比较人工提示与限定循环。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 如何把触发变成会话提示和状态？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

会话命令先解析、暂存状态并投递 followup 或 steer，异常时撤销暂存。持久状态从当前会话日志的命令结果读取和折叠，系统提示依据当前 enabled、模式及风味生成。运行时观察终端结构化结果，并用 callId 去重；非终端工具、取消、拒绝和成功有不同分支。下一步进入且工具组结束时再注入提示。观察的是终端错误候选，不能当作整个任务的失败次数。上游素材作为提示内容，活跃行为由此处 DSH 监听实现。

#### 证据与依据

**依据 1 · 源码核查**：[src/command.ts:83-106](https://github.com/MichengAI/dsh-pua/blob/5e2346b5fd06a0a3e5ac6d8c510d96227f892424/src/command.ts#L83-L106)

预检、暂存和真实消息投递

<details>
<summary>查看原文（24行）</summary>

```text
    if (services?.preferences.globallyEnabled() === false && enablesPua(action)) {
      return { kind: 'error', text: '已关闭「允许使用 PUA」，当前会话不能开启。请在「插件」中打开 @michengai/dsh-pua，打开「允许使用 PUA」后再使用。' };
    }
    if (action.kind === 'loop' && action.verify && (!subprocess || !agent.session.header.cwd)) throw new Error('独立验收需要宿主 subprocess 和会话工作目录；未启动循环。');
    // 只读预检完成且未取消后才暂存开关；等待期间不让其他模型请求误用未完成配置。
    const evidence = action.kind === 'review' ? await collectGitEvidence(subprocess, agent.session.header.cwd, signal) : undefined;
    signal.throwIfAborted();
    if (action.kind === 'off' || action.kind === 'cancel-pua-loop' || action.kind === 'loop') services?.runtime.cancel(agent.session);
    const stopped = action.kind === 'teardown-all' ? services?.runtime.cancelAll() ?? 0 : 0;
    store.stage(agent.session, commandId, action);
    const state = store.read(agent.session);
    if (!state.enabled) services?.runtime.cancel(agent.session);
    if (action.kind === 'configure') return { kind: 'success', text: RESULT_PREFIX + '会话配置已保存；未覆盖项继续跟随全局。' };
    const task = actionPrompt(action, templates, services?.catalog ?? new SourceCatalog());
    if (task !== undefined) {
      signal.throwIfAborted();
      const message = createUserMessage({
        content: [{ type: 'text', text: `${action.kind === 'loop' ? LOOP_START + JSON.stringify({ ...action, id: commandId }) + '\n' : ''}这是通过 /pua 提交的用户请求。是否使用 PUA 及所选风味，以执行时的 DSH PUA 当前状态为准；如果用户已关闭模式，正常处理任务，不因这条历史请求重新启用。启用时执行完整原版核心、展示协议及当前角色，不能用摘要替代。遵循宿主权限与用户最新要求。\n\n${task}${evidence === undefined ? '' : '\n\n' + evidence}` }],
        source: pluginSource(COMMAND_PLUGIN),
      });
      // 明确的新任务排入后续轮次；对当前任务的纠偏在最近的步骤边界生效。
      if (action.kind === 'review' || action.kind === 'loop' || (action.kind === 'mode' && action.task) || (action.kind === 'activate' && action.task)) agent.followup(message);
      else agent.steer(message);
      return { kind: 'success', text: `${RESULT_PREFIX}已提交${action.kind === 'review' ? '只读审查' : action.kind === 'mode' ? action.mode + ' 模式' : action.kind === 'loop' ? 'Loop' : action.kind === 'done-check' ? '完成检查' : action.kind === 'evidence' ? '证据检查' : action.kind === 'again' ? '换方法请求' : action.kind === 'activate' ? '任务请求' : action.kind}，风味：${state.flavorLocked ? flavorLabel(state.flavor) : '自动路由'}。请查看 Agent 后续结果。${action.kind === 'loop' ? '\n' + (action.verify ? 'Oracle：用户指定验证命令。' : '未配置 Oracle，仅 honor system。') : ''}${evidence?.startsWith('未获取') ? '\nGit 预检未取得证据，已要求 Agent 补充只读验证。' : ''}` };
```

</details>

**依据 2 · 源码核查**：[src/command.ts:108-116](https://github.com/MichengAI/dsh-pua/blob/5e2346b5fd06a0a3e5ac6d8c510d96227f892424/src/command.ts#L108-L116)

结束及暂存回滚

```text
    if (action.kind === 'cancel-pua-loop') return { kind: 'success', text: RESULT_PREFIX + '当前 Loop 已取消，不再自动续轮。' };
    if (action.kind === 'teardown-all') return { kind: 'success', text: `${RESULT_PREFIX}已停止本插件管理的 ${stopped} 个循环；未删除宿主子代理或其他工具的 worktree。` };
    if (action.kind === 'offline') return { kind: 'success', text: RESULT_PREFIX + '保持本地模式，无联网刷新或上报能力。' };
    if (action.kind === 'off') return { kind: 'success', text: RESULT_PREFIX + 'PUA 已关闭，Loop 已取消。范围：' + (services?.preferences.description() ?? '当前会话') + '。' };
    if (action.kind === 'flavor') return { kind: 'success', text: `${RESULT_PREFIX}${state.flavorLocked ? '已锁定' + flavorLabel(state.flavor) : '已恢复自动路由'}；当前模式${state.enabled ? '已开启' : '仍关闭'}。范围：${services?.preferences.description() ?? '当前会话'}。` };
    return { kind: 'success', text: `${RESULT_PREFIX}当前任务模式已开启，风味：${flavorLabel(state.flavor)}，从下次模型步骤生效。` };
  } catch (error) {
    store.rollback(agent.session, commandId);
    return { kind: 'error', text: signal.aborted ? 'PUA 命令已取消。' : error instanceof Error ? error.message : String(error) };
```

**依据 3 · 源码核查**：[src/state.ts:105-135](https://github.com/MichengAI/dsh-pua/blob/5e2346b5fd06a0a3e5ac6d8c510d96227f892424/src/state.ts#L105-L135)

按会话回放原生命令日志

<details>
<summary>查看原文（31行）</summary>

```text
  read(session: Session): PuaState {
    let cache = this.cache.get(session);
    if (!cache) {
      cache = { cursor: session.inheritedEventCount, commands: new Map() };
      this.cache.set(session, cache);
    }
    const pending = this.pending.get(session);
    // Session 日志只追加；从分叉继承边界开始，每个命令结果只解析一次。
    for (const event of session.snapshotEvents(cache.cursor)) {
      if (event.type === 'command/run' && event.data.name === 'pua' && typeof event.data.args === 'string') {
        cache.commands.set(event.data.commandId, { input: event.data.args, done: false });
        delete cache.state;
      } else if (event.type === 'command/run' && (event.data.name === 'pua-cancel-loop' || event.data.name === 'cancel-pua-loop')) {
        cache.commands.set(event.data.commandId, { input: 'cancel-pua-loop', done: false });
        delete cache.state;
      } else if (event.type === 'command/done' && cache.commands.has(event.data.commandId)) {
        const record = cache.commands.get(event.data.commandId)!;
        record.done = true;
        delete record.action;
        const outcome = event.data.text;
        if (event.data.kind === 'success' && outcome?.startsWith(RESULT_PREFIX)) {
          record.legacy = !outcome.startsWith(SESSION_RESULT_PREFIX);
          // 0.1.0 将 in / pua flavor 当成任务；尊重已记录结果，不用新语法改写旧状态。
          if (outcome.startsWith(RESULT_PREFIX + '已提交任务请求，')) record.action = { kind: 'activate', task: record.input };
          else {
            try { record.action = parseArgs(record.input); }
            catch { /* 不认识的历史命令保留在日志中，不猜测其配置语义。 */ }
          }
        }
        pending?.delete(event.data.commandId);
        delete cache.state;
```

</details>

**依据 4 · 源码核查**：[src/index.ts:38-53](https://github.com/MichengAI/dsh-pua/blob/5e2346b5fd06a0a3e5ac6d8c510d96227f892424/src/index.ts#L38-L53)

系统提示按会话状态生成

<details>
<summary>查看原文（16行）</summary>

```text
  ctx.systemPrompt.section({
    name: 'michengai:pua',
    order: 120,
    text: ({ agent }) => {
      if (!agent) return '';
      const state = store.read(agent.session);
      if (state.enabled) {
        const flavor = state.flavorLocked ? state.flavor : 'auto';
        const mode = runtime.effectiveMode(agent.session, state.mode);
        const key = `${mode}/${flavor}`;
        if (!prompts.has(key)) prompts.set(key, renderOriginalPrompt(catalog, flavor, mode));
        return prompts.get(key)!;
      }
      if ((agent.session.header.delegationDepth ?? 0) > 0) return '';
      return state.configured || agent.session.header.parentSession !== undefined ? DISABLED_PROMPT : '';
    },
```

</details>

**依据 5 · 源码核查**：[src/runtime.ts:152-174](https://github.com/MichengAI/dsh-pua/blob/5e2346b5fd06a0a3e5ac6d8c510d96227f892424/src/runtime.ts#L152-L174)

步骤边界注入候选

<details>
<summary>查看原文（23行）</summary>

```text
    ctx.on("agent/pre-step", async ({ agent }, next) => {
      const decision = await next();
      if (decision.kind !== "enter") return decision;
      this.hideLegacyRecords(agent.session);
      this.flush(agent.session);
      const state = store.read(agent.session);
      const runtime = this.read(agent.session);
      if (this.pendingTerminalReviews.has(agent.session) && !hasPendingToolCalls(agent.session)) {
        this.pendingTerminalReviews.delete(agent.session);
        if (state.enabled && state.terminalReview) decision.messages.push(pluginMessage(TERMINAL_REVIEW_PROMPT));
      }
      if (this.pendingCandidates.has(agent.session) && !hasPendingToolCalls(agent.session)) {
        this.pendingCandidates.delete(agent.session);
        let prompt = '';
        if (state.enabled && state.failureCandidates && (runtime.candidateCount ?? 0) < 4) {
          try { prompt = this.hooks.candidate(runtime.failureCount, state); }
          catch (error) { ctx.logger.warn('PUA 候选素材不可用，跳过本次提示：%s', error); }
          if (prompt) runtime.candidateCount = (runtime.candidateCount ?? 0) + 1;
        }
        if (prompt) decision.messages.push(pluginMessage(prompt));
      }
      if (!state.enabled || state.mode !== "pua-loop")
        this.cancel(agent.session);
```

</details>

**依据 6 · 源码核查**：[src/runtime.ts:246-279](https://github.com/MichengAI/dsh-pua/blob/5e2346b5fd06a0a3e5ac6d8c510d96227f892424/src/runtime.ts#L246-L279)

终端条件及 callId 去重

<details>
<summary>查看原文（34行）</summary>

```text
      child.on("tools/result", (exec, result) => {
        const agent = exec.agent;
        if (!agent || exec.signal.aborted || !store.read(agent.session).enabled)
          return;
        const tool = child.tools.get(exec.name, agent);
        const terminal =
          /^(Bash|bash|terminal|exec_command|shell|shell_command|run_terminal_cmd)$/u.test(
            exec.name,
          ) || tool?.presentCall?.(exec.arguments)?.card === "terminal";
        if (!terminal) return;
        if (!isTerminalFailure(result)) {
          // 拒绝、取消及无结构化错误码的宿主故障不是成功，不清零已有观察。
          if (result.isError) return;
          if (terminalTextNeedsReview(result)) this.pendingTerminalReviews.add(agent.session);
          else {
            // 成功打断连续失败观察；不会撤销独立验收结果。
            const observation = this.read(agent.session);
            if (observation.failureCount) this.pendingWrites.set(agent.session, '终端成功，清除连续失败观察。');
            observation.failureCount = 0;
            this.pendingCandidates.delete(agent.session);
          }
          return;
        }
        const runtime = this.read(agent.session);
        const id = createHash("sha256").update(exec.callId).digest("hex");
        if (runtime.failures.includes(id)) return;
        runtime.failures = [...runtime.failures, id].slice(-128);
        runtime.failureCount = Math.min(runtime.failureCount + 1, 1_000_000);
        // 此通知早于宿主 tool/result 落库；只暂存，不能在工具组中插入普通消息。
        this.pendingWrites.set(
          agent.session,
          "新增终端失败观察；不是任务失败判定。",
        );
        this.pendingCandidates.add(agent.session);
```

</details>

#### 缺口

- 缺多种终端结果结构对应的实际候选率。
  **影响**：不能推断所有执行失败都能被识别。
  **进一步探讨**：在临时会话比较退出非零、取消、拒绝及工具不抛错但任务未达标。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 循环的证据门和终止在哪？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

进入运行前需要来自本插件命令的启动记录及匹配的 command ID。到 turn-stopping 时只取当轮最后一个未中断的模型文本；匹配到完成标记后，无命令即记录模型自报完成。有命令才调用 Host subprocess，以当前会话目录运行用户给的 shell 命令，退出 0、无进程信号且未超时才记通过。匹配范围是整段文本，若模型只是引用完成标记也可能触发分支。验收脚本只证明覆盖的条件。缺执行服务会暂停，验证拒绝或无标记时可续轮，达到正上限则终止为未确认完成。`done-check` 与 `evidence` 只是把提示交给模型。

#### 证据与依据

**依据 1 · 源码核查**：[src/runtime.ts:175-197](https://github.com/MichengAI/dsh-pua/blob/5e2346b5fd06a0a3e5ac6d8c510d96227f892424/src/runtime.ts#L175-L197)

插件来源与命令身份的启动校验

<details>
<summary>查看原文（23行）</summary>

```text
      for (const message of decision.messages) {
        const text = messageText(message);
        if (
          isPluginSource(message.source, COMMAND_PLUGIN) &&
          text.startsWith(LOOP_START) &&
          state.enabled &&
          state.mode === "pua-loop"
        ) {
          const config = JSON.parse(
            text.slice(LOOP_START.length).split("\n")[0]!,
          ) as LoopAction & { id: string };
          if (config.id !== state.loopCommandId) continue;
          runtime.loop = {
            ...config,
            iteration: 1,
            rejections: 0,
            status: "active",
          };
          this.save(
            agent.session,
            runtime,
            "显式启动 Loop；验证配置以用户命令为准。",
          );
```

</details>

**依据 2 · 源码核查**：[src/runtime.ts:544-606](https://github.com/MichengAI/dsh-pua/blob/5e2346b5fd06a0a3e5ac6d8c510d96227f892424/src/runtime.ts#L544-L606)

最后模型文本、标记和命令分岔

<details>
<summary>查看原文（63行）</summary>

```text
  private async stopping(
    agent: Agent,
    turn: number,
    signal: AbortSignal,
  ): Promise<void> {
    const session = agent.session;
    const state = this.read(session);
    const loop = state.loop;
    if (!loop || loop.status !== "active") return;
    if (
      !this.store.read(session).enabled ||
      this.store.read(session).mode !== "pua-loop"
    ) {
      this.cancel(session);
      return;
    }
    let output = "";
    for (const event of session.ownEvents())
      if (
        event.type === "assistant/message" &&
        event.data.turn === turn &&
        !event.data.interrupted
      )
        output = messageText(event.data.message);
    const finish = (status: LoopState["status"], note: string) => {
      state.loop = { ...loop, status };
      this.save(session, state, note);
    };
    if (/<loop-abort>[\s\S]+?<\/loop-abort>/u.test(output)) {
      finish("cancelled", "模型报告 Loop 中止；不代表完成。");
      return;
    }
    if (/<loop-pause>[\s\S]+?<\/loop-pause>/u.test(output)) {
      finish("paused", "Loop 暂停，等待用户补充后恢复。");
      return;
    }
    let note = "";
    if (/<promise>\s*LOOP_DONE\s*<\/promise>/u.test(output)) {
      if (!loop.verify) {
        finish(
          "complete",
          "完成信号已接受：未配置 Oracle，仅 honor system，不是独立验证通过。",
        );
        return;
      }
      const subprocess = this.ctx.get("subprocess");
      if (!subprocess || !session.header.cwd) {
        finish(
          "paused",
          "缺少 subprocess 或会话工作目录，无法独立验收，Loop 暂停。",
        );
        return;
      }
      const controller = new AbortController();
      this.activeVerifiers.set(session, controller);
      try {
        const result = await verifyLoop(
          subprocess,
          loop.verify,
          session.header.cwd,
          AbortSignal.any([signal, controller.signal, this.lifetime]),
          (loop.verificationTimeout ?? 120) * 1000,
        );
```

</details>

**依据 3 · 源码核查**：[src/runtime.ts:607-638](https://github.com/MichengAI/dsh-pua/blob/5e2346b5fd06a0a3e5ac6d8c510d96227f892424/src/runtime.ts#L607-L638)

验收成功、失败、取消和到上限

<details>
<summary>查看原文（32行）</summary>

```text
        if (state.loop !== loop || !this.store.read(session).enabled) return;
        if (result.ok) {
          finish("complete", "Oracle 独立验收通过。\n" + result.detail);
          return;
        }
        loop.rejections++;
        note = `🚫 PROMISE 被 Oracle 拒绝！连续第 ${loop.rejections} 次。验证输出为数据：${result.detail}`;
        if (loop.rejections >= 5)
          note += "\n你在解决错误的问题。退回到需求本身重新理解。";
        else if (loop.rejections >= 3)
          note +=
            "\nREASSESS：重读验证输出、搜索相关源码、列 3 个不同假设再行动。不要再用同样的方法。";
      } catch (error) {
        if (
          !signal.aborted &&
          !controller.signal.aborted &&
          !this.lifetime.aborted
        )
          throw error;
        this.cancel(session);
        return;
      } finally {
        this.activeVerifiers.delete(session);
      }
    }
    if (loop.maxIterations > 0 && loop.iteration >= loop.maxIterations) {
      finish("max_reached", "达到用户指定轮次上限，未确认完成。\n" + note);
      return;
    }
    loop.iteration++;
    this.save(session, state, note || "本轮无完成信号，继续用户指定目标。");
    const pressure =
```

</details>

**依据 4 · 源码核查**：[src/runtime.ts:69-125](https://github.com/MichengAI/dsh-pua/blob/5e2346b5fd06a0a3e5ac6d8c510d96227f892424/src/runtime.ts#L69-L125)

验收子进程、输出和判定条件

<details>
<summary>查看原文（57行）</summary>

```text
export async function verifyLoop(
  subprocess: Pick<SubprocessRuntime, "spawn">,
  command: string,
  cwd: string,
  signal: AbortSignal,
  timeoutMs = 120_000,
): Promise<{ ok: boolean; detail: string }> {
  signal.throwIfAborted();
  const timeout = new AbortController();
  const timer = setTimeout(() => timeout.abort(), timeoutMs);
  try {
    const combined = AbortSignal.any([signal, timeout.signal]);
    // 脚本是 argv 的单个参数，由宿主 spawn(program, args) 传递，无外层 shell 字符串转义。
    const argv =
      process.platform === "win32"
        ? [
            "powershell.exe",
            "-NoLogo",
            "-NoProfile",
            "-NonInteractive",
            "-Command",
            `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8\n$OutputEncoding = [System.Text.Encoding]::UTF8\n$ErrorActionPreference = 'Stop'\n${command}\nif (-not $?) { if ($null -ne $LASTEXITCODE -and $LASTEXITCODE -ne 0) { exit $LASTEXITCODE }; exit 1 }; if ($null -ne $LASTEXITCODE) { exit $LASTEXITCODE }`,
          ]
        : ["/bin/sh", "-c", command];
    const handle = subprocess.spawn({
      argv,
      cwd,
      signal: combined,
      graceMs: 1000,
      stdio: {
        stdin: "ignore",
        stdout: { maxBytes: 8192 },
        stderr: { maxBytes: 8192 },
      },
    });
    const result = await handle.done;
    signal.throwIfAborted();
    const stdout = handle.collected.stdout?.readFrom(0);
    const stderr = handle.collected.stderr?.readFrom(0);
    return {
      ok: !timeout.signal.aborted && result.exitCode === 0 && !result.signal,
      detail: JSON.stringify({
        exitCode: result.exitCode,
        timedOut: timeout.signal.aborted,
        stdout: stdout?.text,
        stderr: stderr?.text,
        truncated: stdout?.lossy || stderr?.lossy || false,
      }),
    };
  } catch (error) {
    signal.throwIfAborted();
    return {
      ok: false,
      detail: timeout.signal.aborted
        ? "独立验收超时。"
        : `独立验收未执行成功：${error instanceof Error ? error.message : String(error)}`,
    };
```

</details>

**依据 5 · 源码核查**：[src/command.ts:44-56](https://github.com/MichengAI/dsh-pua/blob/5e2346b5fd06a0a3e5ac6d8c510d96227f892424/src/command.ts#L44-L56)

证据命令与循环模式使用不同路径

<details>
<summary>查看原文（13行）</summary>

```text
function actionPrompt(action: Action, templates: ReadonlyMap<QualityCommand, string>, catalog: SourceCatalog): string | undefined {
  switch (action.kind) {
    case 'activate':
      return action.task ? `请处理下面用户指定的任务。任务正文：\n\n${action.task}`
        : '继续当前已授权任务：先核对目标和现有证据，诊断后完成剩余工作。若历史没有可识别任务，请用户提供目标，不自行编造任务。';
    case 'review':
      return `${REVIEW_RULES}\n\n用户审查范围：${action.task}`;
    case 'again': case 'done-check': case 'evidence':
      return templates.get(action.kind)! + (action.task ? `\n\n用户补充：${action.task}` : '');
    case 'mode':
      return `执行当前 ${action.mode} 完整原版模式。\n${action.task || '继续当前已授权任务；历史无任务时请用户提供目标。'}`;
    case 'loop':
      return `按当前系统中的完整 PUA Loop 协议执行任务：${action.task}\n本轮上限：${action.maxIterations || '无限'}；${action.verify ? 'Oracle 使用用户指定命令独立验证。' : '未配置 Oracle，使用 honor system，不得声称独立验收通过。'}配置已由 DSH 接管，不运行 setup shell 脚本。`;
```

</details>

#### 缺口

- 缺错误标记与验收脚本过宽的实际负样本。
  **影响**：模型标记或不覆盖条件的退出 0 都可能给出过强完成状态。
  **进一步探讨**：模拟模型引用标记，并用已知失败样本检验选定命令的区分力。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何可控采用并退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需支持的 DSH、Node 和匹配宿主接口。独立验收还需 subprocess 和会话工作目录。默认命令为空且 0 表示不限轮次。主任务的后果需和循环状态分开，取消仅中断活跃验证并阻止继续轮次。完整运行状态保存在会话日志，压缩为表面提示的动作不删除原记录，状态可能包含任务与验证配置，验证输出也可进提示及日志。适合在可丢弃副本中用已审查命令和小上限试验，遇到重复失败或无法复验立即取消并手工检查差异。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:7-12](https://github.com/MichengAI/dsh-pua/blob/5e2346b5fd06a0a3e5ac6d8c510d96227f892424/package.json#L7-L12)

Node 和 DSH 条件

```text
  "engines": {
    "node": ">=22.19.0",
    "dsh": ">=0.2.0-rc.1 <0.3.0-0"
  },
  "main": "./lib/index.js",
  "types": "./lib/index.d.ts",
```

**依据 2 · 源码核查**：[src/command.ts:83-94](https://github.com/MichengAI/dsh-pua/blob/5e2346b5fd06a0a3e5ac6d8c510d96227f892424/src/command.ts#L83-L94)

全局入口与独立验收前置

<details>
<summary>查看原文（12行）</summary>

```text
    if (services?.preferences.globallyEnabled() === false && enablesPua(action)) {
      return { kind: 'error', text: '已关闭「允许使用 PUA」，当前会话不能开启。请在「插件」中打开 @michengai/dsh-pua，打开「允许使用 PUA」后再使用。' };
    }
    if (action.kind === 'loop' && action.verify && (!subprocess || !agent.session.header.cwd)) throw new Error('独立验收需要宿主 subprocess 和会话工作目录；未启动循环。');
    // 只读预检完成且未取消后才暂存开关；等待期间不让其他模型请求误用未完成配置。
    const evidence = action.kind === 'review' ? await collectGitEvidence(subprocess, agent.session.header.cwd, signal) : undefined;
    signal.throwIfAborted();
    if (action.kind === 'off' || action.kind === 'cancel-pua-loop' || action.kind === 'loop') services?.runtime.cancel(agent.session);
    const stopped = action.kind === 'teardown-all' ? services?.runtime.cancelAll() ?? 0 : 0;
    store.stage(agent.session, commandId, action);
    const state = store.read(agent.session);
    if (!state.enabled) services?.runtime.cancel(agent.session);
```

</details>

**依据 3 · 源码核查**：[src/args.ts:88-111](https://github.com/MichengAI/dsh-pua/blob/5e2346b5fd06a0a3e5ac6d8c510d96227f892424/src/args.ts#L88-L111)

可选验收及轮次语义

<details>
<summary>查看原文（24行）</summary>

```text
  const seen = new Set<string>();
  let maxIterations = defaults?.maxIterations ?? 0;
  let verify: string | undefined = defaults?.verify.trim() || undefined;
  const task: string[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]!;
    if (token === '--max-iterations') {
      if (seen.has(token)) throw new Error('--max-iterations 不能重复。');
      seen.add(token);
      const value = tokens[++i];
      if (!value || !/^\d+$/.test(value) || Number(value) > 10000) throw new Error('--max-iterations 必须为 0–10000；0 表示按原版不限轮次。');
      maxIterations = Number(value);
    } else if (token === '--verify') {
      if (seen.has(token)) throw new Error('--verify 不能重复。');
      seen.add(token);
      const value = tokens[++i];
      if (value === undefined || value.startsWith('--')) throw new Error('--verify 后需要带引号的验证命令。');
      verify = value;
      if (!verify.trim()) throw new Error('验证命令不能为空。');
    } else if (token.startsWith('--')) throw new Error(`不支持循环选项：${token}`);
    else task.push(token);
  }
  if (!task.join(' ').trim()) throw new Error('loop 需要任务描述，例如 /pua loop "修复测试" --verify "npm test" --max-iterations 10。');
  return { kind: 'loop', task: task.join(' ').trim(), maxIterations, ...(verify === undefined ? {} : { verify }), ...(defaults ? { verificationTimeout: defaults.verificationTimeout } : {}) };
```

</details>

**依据 4 · 源码核查**：[src/runtime.ts:457-477](https://github.com/MichengAI/dsh-pua/blob/5e2346b5fd06a0a3e5ac6d8c510d96227f892424/src/runtime.ts#L457-L477)

运行记录与对话表面分开

<details>
<summary>查看原文（21行）</summary>

```text
  private save(session: Session, state: RuntimeState, note: string): void {
    this.cache.set(session, state);
    this.pendingWrites.set(session, note);
    this.flush(session);
  }
  private flush(session: Session): void {
    const note = this.pendingWrites.get(session);
    if (note === undefined || hasPendingToolCalls(session)) return;
    const state = this.read(session);
    const record = session.append(
      "user/message",
      pluginMessage(RECORD + JSON.stringify(state) + "\n" + note),
      { surfaceOp: "append" },
    );
    // 当前宿主 append 不支持 ignorable 自定义事件。用原生替换保留回放依据，
    // 避免未知必需事件导致卸载后无法加载；两次同步 append 之间不发起模型请求。
    session.append("user/message", pluginMessage(note), {
      surfaceOp: replacementSurface(record.seq, record.seq),
      sourceEventSeqs: [record.seq],
    });
    this.pendingWrites.delete(session);
```

</details>

**依据 5 · 源码核查**：[src/runtime.ts:504-522](https://github.com/MichengAI/dsh-pua/blob/5e2346b5fd06a0a3e5ac6d8c510d96227f892424/src/runtime.ts#L504-L522)

取消活跃验收和续轮

<details>
<summary>查看原文（19行）</summary>

```text
  cancel(session: Session, persist = true): void {
    this.activeVerifiers.get(session)?.abort();
    const state = this.read(session);
    if (state.loop && ["active", "paused"].includes(state.loop.status)) {
      state.loop = { ...state.loop, status: "cancelled" };
      if (persist) this.save(session, state, "Loop 已取消，不再续轮。");
    }
  }
  cancelAll(): number {
    let count = 0;
    for (const session of this.sessions) {
      if (
        ["active", "paused"].includes(this.read(session).loop?.status ?? "")
      ) {
        this.cancel(session);
        count++;
      }
    }
    return count;
```

</details>

**依据 6 · 作者声明**：[README.md:124-136](https://github.com/MichengAI/dsh-pua/blob/5e2346b5fd06a0a3e5ac6d8c510d96227f892424/README.md#L124-L136)

作者明确取消与操作回撤分离

<details>
<summary>查看原文（13行）</summary>

````text
### 让任务按验收结果继续

在聊天 PUA 面板中填写 Loop 任务、验收命令和轮次上限，再点击启动。例如，让 Agent 修复测试，使用 `npm test` 检查结果，最多执行 10 轮。

也可以直接输入：

```text
/pua loop "修复当前测试失败并补齐回归" --verify "npm test" --max-iterations 10
```

需要停止时输入 `/pua-cancel-loop` 或 `/pua cancel-loop`。关闭当前会话 PUA 也会取消 Loop，但不会撤回已经执行的操作。

建议设置验收命令和轮次上限：未设置验收命令时，只依据模型报告判断完成；轮次上限为 0 表示不限轮次。
````

</details>

#### 缺口

- 缺命令对实际宿主策略和副作用的验证。
  **影响**：不知道超时、子进程与人工恢复的总耗时。
  **进一步探讨**：用副本和无远端副作用的命令计单轮、一次超时及恢复耗时。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 独立失败样本能否减少误完成？

**研究主题**：新假设与验证

#### 完整回答

选择一项只改一条条件的小回归。以同一模型完成标记和两份工作区输入，对照没有命令、只返回成功的命令、能拒绝故障样本的检查三个条件。设置最多三轮，核对接受状态、测试实际退出码、命令耗时及人时。若故障样本在独立命令条件下依旧被接受，或额外成本抵消收益，则不能支持此用法改善验收。

#### 证据与依据

**依据 1 · 源码核查**：[src/runtime.ts:581-609](https://github.com/MichengAI/dsh-pua/blob/5e2346b5fd06a0a3e5ac6d8c510d96227f892424/src/runtime.ts#L581-L609)

模型自报与机器判定并列

<details>
<summary>查看原文（29行）</summary>

```text
    if (/<promise>\s*LOOP_DONE\s*<\/promise>/u.test(output)) {
      if (!loop.verify) {
        finish(
          "complete",
          "完成信号已接受：未配置 Oracle，仅 honor system，不是独立验证通过。",
        );
        return;
      }
      const subprocess = this.ctx.get("subprocess");
      if (!subprocess || !session.header.cwd) {
        finish(
          "paused",
          "缺少 subprocess 或会话工作目录，无法独立验收，Loop 暂停。",
        );
        return;
      }
      const controller = new AbortController();
      this.activeVerifiers.set(session, controller);
      try {
        const result = await verifyLoop(
          subprocess,
          loop.verify,
          session.header.cwd,
          AbortSignal.any([signal, controller.signal, this.lifetime]),
          (loop.verificationTimeout ?? 120) * 1000,
        );
        if (state.loop !== loop || !this.store.read(session).enabled) return;
        if (result.ok) {
          finish("complete", "Oracle 独立验收通过。\n" + result.detail);
```

</details>

**依据 2 · 源码核查**：[src/runtime.ts:632-638](https://github.com/MichengAI/dsh-pua/blob/5e2346b5fd06a0a3e5ac6d8c510d96227f892424/src/runtime.ts#L632-L638)

到轮次上限不确认完成

```text
    if (loop.maxIterations > 0 && loop.iteration >= loop.maxIterations) {
      finish("max_reached", "达到用户指定轮次上限，未确认完成。\n" + note);
      return;
    }
    loop.iteration++;
    this.save(session, state, note || "本轮无完成信号，继续用户指定目标。");
    const pressure =
```

**依据 3 · 源码核查**：[src/runtime.ts:104-116](https://github.com/MichengAI/dsh-pua/blob/5e2346b5fd06a0a3e5ac6d8c510d96227f892424/src/runtime.ts#L104-L116)

可观察进程结果

<details>
<summary>查看原文（13行）</summary>

```text
    const result = await handle.done;
    signal.throwIfAborted();
    const stdout = handle.collected.stdout?.readFrom(0);
    const stderr = handle.collected.stderr?.readFrom(0);
    return {
      ok: !timeout.signal.aborted && result.exitCode === 0 && !result.signal,
      detail: JSON.stringify({
        exitCode: result.exitCode,
        timedOut: timeout.signal.aborted,
        stdout: stdout?.text,
        stderr: stderr?.text,
        truncated: stdout?.lossy || stderr?.lossy || false,
      }),
```

</details>

#### 缺口

- 没有运行该对照。
  **影响**：不能把设计上的独立命令推成真实误完成率下降。
  **进一步探讨**：固定故障和通过样本，从单轮比较两个验收命令开始。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
