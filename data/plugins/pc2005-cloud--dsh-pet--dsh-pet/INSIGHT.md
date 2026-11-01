# dsh-pet 插件

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[f439506](https://github.com/PC2005-cloud/dsh-pet/tree/f439506806a9760aa3d6dae2b5fbd1e86a71a906/dsh-pet)

<!-- BEGIN META -->
[![GitHub ★ 5,153](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5%2C153&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PC2005-cloud/dsh-pet) [![npm 30d 298,546](https://img.shields.io/static/v1?label=npm+30d&message=298%2C546&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-pet) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-pet)
<!-- END META -->

> **功能**：在 DSH 中显示动画宠物，联动会话状态，并提供聊天与余额展示。

> **亮点**：相对静态桌宠，该组件把宿主会话事件规约为状态并接入动画界面，同时将浏览器与桌面请求接到同一业务路由；这说明机制增量，不证明实际效率提高。[Q02](#research-q02) [Q06](#research-q06)

> **主要限制**：多会话按优先级压缩成一个状态，轮询异常静默重试，用户能否及时识别真正需要关注的会话尚无对照；如果状态和实际会话不一致，应回到宿主原界面确认。[Q03](#research-q03)

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
  - [Q01 · 谁使用它完成什么，简单替代是什么？](#detail-section-11)
  - [Q02 · 宿主事件如何传到浏览器中的状态显示？](#detail-section-12)
  - [Q03 · 多会话和中断时展示状态如何决定？](#detail-section-13)
  - [Q04 · 启动、桌面和外部访问有哪些条件？](#detail-section-14)
  - [Q05 · 初次、持续和退出成本是否适合目标用户？](#detail-section-15)
  - [Q06 · 哪些设计值得借鉴，怎样验证下一步假设？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望在 DSH 等待会话结果时获得动画陪伴的个人用户，可以让宠物显示当前工作状态；需求强度尚无独立用户依据。[Q01](#research-q01)

直接查看宿主会话或使用静态桌宠是更简单的替代；前者不需要维护动画层，后者不能据此假定具有会话联动。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 宠物覆盖层 | 在宿主界面显示宠物 | 依赖客户端插槽服务；未做宿主验收 |
| 会话状态联动 | 将会话事件映射为状态 | 多会话压缩显示，不能替代原始会话 |
| 宿主路由 | 为客户端和桌面桥提供状态与动作 | 实际宿主路由准入未核查 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 注入服务与 React | 插件模式必需 | 提供宿主路由和界面 | 无法确认插件正常加载 |
| Electron 与图形环境 | 桌面模式需要 | 独立桌面窗口 | 无图形环境跳过；缺 Electron 时尝试下载 |
| 模型或余额服务 | 对应功能需要 | 对话或余额查询 | 使用条件和费用取决于具体服务 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户核对宿主版本和配置环境 | 版本不符先停止 |
| 安装 | 用户按作者文档安装并重启 | 未出现界面时核对日志与配置 |
| 使用 | 用户触发会话并观察状态 | 与原会话对照，不一致则回原界面 |
| 退出 | 用户停用插件 | 确认界面退出，并另行检查数据残留 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 下载与计算资源未知 | 安装、重启和配置耗时未知 | 桌面模式可能下载 Electron |
| 持续使用 | 状态轮询与可选模型调用；费用未知 | 对照状态和维护配置 | 不推算固定节省 |
| 失败恢复 | 重试与资源成本未知 | 排查日志、切换界面 | 退出后数据残留未核实 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话状态提示 | 源码中有事件规约、状态发布和界面消费 | 固定宿主实际表现与遗漏率 |
| 桌面显示 | 有 Helper 启动与降级路径 | 跨平台可用性与用户收益 |

> **思考**：多会话按优先级压缩成一个状态，轮询异常静默重试，用户能否及时识别真正需要关注的会话尚无对照；如果状态和实际会话不一致，应回到宿主原界面确认。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对静态桌宠，该组件把宿主会话事件规约为状态并接入动画界面，同时将浏览器与桌面请求接到同一业务路由；这说明机制增量，不证明实际效率提高。[Q02](#research-q02) [Q06](#research-q06)

配置读写共用串行队列，桌面桥与 HTTP 复用业务路由；事件桥对特定切换做延迟并在卸载时停止等待。这些机制有清晰的维护边界，但不证明跨端一致或宿主兼容。[Q02](#research-q02) [Q06](#research-q06)

<a id="detail-section-5"></a>

### 1.4 主要限制

多会话按优先级压缩成一个状态，轮询异常静默重试，用户能否及时识别真正需要关注的会话尚无对照；如果状态和实际会话不一致，应回到宿主原界面确认。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

适合愿意配置并偏好动画陪伴的 DSH 用户在独立环境试用；先核对版本和桌面、联网选项，状态不符或出现不希望的调用时停用并回到原会话界面。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献基于固定版本源码解释；未来设计是假设，尚未进行宿主或效果验证。

- 已检查：作者 README、包清单、源码路径 dsh-pet/README.md、INSTALL.md、dsh-pet/package.json、dsh-pet/src/host/index.ts、dsh-pet/src/client/app.ts、dsh-pet/src/host/plugin/session-watch.ts、dsh-pet/src/host/work-status.ts、dsh-pet/src/host/plugin/work-status-bridge.ts、dsh-pet/src/client/pet/multi.ts、dsh-pet/src/client/pet/state-poll.ts、dsh-pet/src/host/plugin/http-route.ts、dsh-pet/src/host/plugin/desktop/spawn.ts、dsh-pet/src/host/plugin/lifecycle.ts、dsh-pet/src/standalone/request-security.ts、dsh-pet/src/host/routes/state.ts、dsh-pet/src/shared/state.ts 及固定范围 inventory；组件：dsh-pet。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定版本内核查宿主和客户端入口、会话状态、路由、桌面启动及生命周期；并非 572 个文件的完整安全审计，未验证宿主路由准入、真实使用或外部服务。
- 下一步：在隔离 profile 核对宿主版本、路由准入和网络活动，以相同事件序列比较原会话与宠物状态；记录中断、并发和停用后的资源状态。

**分析版本**

- **仓库**：[PC2005-cloud/dsh-pet](https://github.com/PC2005-cloud/dsh-pet)
- **版本号**：0.3.8（[固定提交 f439506](https://github.com/PC2005-cloud/dsh-pet/tree/f439506806a9760aa3d6dae2b5fbd1e86a71a906)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：让工作状态摘要保留聚合来源会话并提供跳转，可能减少确认等待事项的遗漏；项目已有通知跳转，此假设仅针对状态摘要。应与原生会话列表在相同多会话任务下对照识别率和耗时，遗漏增加或额外操作抵消收益即否定。[Q06](#research-q06)

在隔离 profile 核对宿主版本、路由准入和网络活动，以相同事件序列比较原会话与宠物状态；记录中断、并发和停用后的资源状态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 33 | 6233 | 4504 | 1589 | — |
| .md | source | 1 | 7 | — | — | 65 |
| .mjs | source | 13 | 933 | 646 | 235 | — |
| .mjs | test | 5 | 777 | 691 | 51 | — |
| .md | test | 1 | 15 | — | — | 183 |
| .js | test | 1 | 17 | 16 | 0 | — |
| .ts | test | 174 | 30340 | 24948 | 2617 | — |
| .ts | source | 344 | 41302 | 27619 | 11120 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/PC2005-cloud/dsh-pet/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 108](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=108&color=737b86&logo=github)](https://github.com/PC2005-cloud/dsh-pet/issues?q=is%3Aissue+created%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z) [![近30天关闭 110](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=110&color=737b86&logo=github)](https://github.com/PC2005-cloud/dsh-pet/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断 DSH 用户能否通过桌宠观察会话及其相对普通桌宠的增量、限制与采用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁使用它完成什么，简单替代是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它面向在 DSH 中等待会话结果且希望有动画陪伴的人。合格结果是用户能看见宠物及其会话状态；这是一种呈现和提醒，不是会话任务本身的产物。作者描述多开、桌面和会话联动，但偏好、频率与实际需求没有独立用户证据。简单替代是直接查看会话原界面或静态桌宠；前者不需维护第二个动画层，后者可提供陪伴但不天然获得 DSH 会话事件。源码中的事件监听和界面挂载支持有条件的联动机制，不能证明节省时间或比现有通知更可靠。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-pet/README.md:1-7](https://github.com/PC2005-cloud/dsh-pet/blob/f439506806a9760aa3d6dae2b5fbd1e86a71a906/dsh-pet/README.md#L1-L7)

组件自述为带多种动画的 DSH 宠物，并指向完整文档。

```text
# dsh-pet 🐾

一只住在 DeepSeek Harness 里的桌面宠物，一百余个透明动画，可多开、能上桌面。

安装与完整文档：**<https://github.com/PC2005-cloud/dsh-pet>**

许可：代码 MIT；素材禁止商用；二创在公开渠道须署名（同上链接）。
```

**依据 2 · 源码核查**：[dsh-pet/src/client/app.ts:171-183](https://github.com/PC2005-cloud/dsh-pet/blob/f439506806a9760aa3d6dae2b5fbd1e86a71a906/dsh-pet/src/client/app.ts#L171-L183)

客户端将宠物渲染器及设置页注册到宿主插槽。

<details>
<summary>查看原文（13行）</summary>

```text
      // 宠物 overlay：容器渲染多个 PetCard。
      ctx.slots.inject('shell.overlay', function* () {
        yield ctx.slots.register({ name: 'shell.overlay', id: 'pet', order: 1000 }, () => h(PetMulti, {}));
      });

      // 设置页「桌宠配置」：大小、位置、模型，保存即时生效。
      // useRef 供「AI 模型」下拉的浮层定位与外部点击判定使用。
      const PetConfigSection = makePetConfigSection({ h, useState, useEffect, useRef, useCallback, t }, ctx);
      ctx.slots.inject('settings.section', function* () {
        yield ctx.slots.register(
          { name: 'settings.section', id: 'pet-config', order: 30, label: () => t('nav'), inject: () => ({ t }) },
          PetConfigSection,
        );
```

</details>

**依据 3 · 源码核查**：[dsh-pet/src/host/plugin/session-watch.ts:151-155](https://github.com/PC2005-cloud/dsh-pet/blob/f439506806a9760aa3d6dae2b5fbd1e86a71a906/dsh-pet/src/host/plugin/session-watch.ts#L151-L155)

宿主监听会话事件作为状态输入。

```text
  // 工作状态联动：监听 DSH 会话事件 → 聚合当前活动状态（WorkStatusStore → 展示快照）。
  // 消费 turn/start、user/message（goal 续跑轮判定）、tool/call、tool/result、approval/asked、
  // turn/end、todo/write（只更新任务详情文案，不切档位）。纯监听不调用模型。
  ctx.effect(() => {
    const dispose = ctx.on('session/event', (session: unknown, event: unknown) => {
```

#### 缺口

- 缺少独立用户的重复使用与对照记录
  **影响**：无法确定持续需求或效果
  **进一步探讨**：在相同会话任务下比较直接查看会话与宠物提示，并记录识别结果与人工中断。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 宿主事件如何传到浏览器中的状态显示？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

宿主 apply 注册会话监听和 HTTP 路由；监听器将每个会话事件交给状态规约器，发布桥按内容变化写入状态快照。客户端注册 shell.overlay，轮询状态并将 workStatus 变化存入 React 状态，供宠物卡片消费。桥只延迟五秒内 working 到 result 的切换并在定时器触发时读取最新快照，其他方向和终态不按该条件压制；这是一项减少动画重播的取舍，也意味着中间状态不保证即时显示。轮询失败静默并按间隔重试，因此观察不到变化不能证明会话无事件；代码路径说明设计，未确认真实宿主接线和动画效果。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-pet/src/host/index.ts:111-129](https://github.com/PC2005-cloud/dsh-pet/blob/f439506806a9760aa3d6dae2b5fbd1e86a71a906/dsh-pet/src/host/index.ts#L111-L129)

宿主入口装配 HTTP 和事件监听。

<details>
<summary>查看原文（19行）</summary>

```text
  };
  const httpRoute = createHttpRoute(deps);
  registerHttpRoute(ctx, httpRoute.handlePetRoute);

  registerSessionWatch({
    ctx,
    cancelTerminalCleanup,
    lastTodoText,
    lastReplyText,
    notifyActivityTimers,
    publishWorkStatus,
    pushNotifyFrame,
    scheduleCompletionNotify,
    scheduleTerminalCleanup,
    terminalTimers,
    toolsInFlight,
    turnFlags,
    workStatus,
  });
```

</details>

**依据 2 · 源码核查**：[dsh-pet/src/host/plugin/work-status-bridge.ts:18-55](https://github.com/PC2005-cloud/dsh-pet/blob/f439506806a9760aa3d6dae2b5fbd1e86a71a906/dsh-pet/src/host/plugin/work-status-bridge.ts#L18-L55)

桥去重、延迟特定切换并写入 workStatus。

<details>
<summary>查看原文（38行）</summary>

```text
  // 工作状态快照写进 S：内容真的变了才写（每次写都推进 counter，前端据此重播档位动画）。
  // 只压「距上次写入不足 WORK_STATE_GAP_MS 的 working → result」——工具秒回时会来回切十几次，
  // 每切一次前端就把片段从第 0 帧重播；反向不压（开工迟到比多换一次片更糟），终态不压。
  const WORK_STATE_GAP_MS = 5000;

  let publishedWork = '\u0000';

  let publishedState: string | null = null;

  let publishedWorkAt = 0;

  let workFlushTimer: ReturnType<typeof setTimeout> | null = null;

  const publishWorkStatus = (): void => {
    const snap = workStatus.snapshot();
    const key = String(snap.state) + '\u0000' + String(snap.task);
    if (key === publishedWork) return;
    // 抖动判定：只压 working → result 这一个方向（同档只换文案不算抖动，照常立即写；
    // 反向 result → working 立即写）
    const busyFlip = publishedState === 'working' && snap.state === 'result';
    const wait = WORK_STATE_GAP_MS - (Date.now() - publishedWorkAt);
    if (busyFlip && wait > 0) {
      // 整条不写（档位与文案一起压住）：到点再取最新快照补写
      // （不要在这里缓存 snap——期间可能又变了）
      workFlushTimer ??= setTimeout(() => {
        workFlushTimer = null;
        publishWorkStatus();
      }, wait);
      return;
    }
    if (workFlushTimer !== null) {
      clearTimeout(workFlushTimer);
      workFlushTimer = null;
    }
    publishedWork = key;
    publishedState = snap.state;
    publishedWorkAt = Date.now();
    state.writeSection('workStatus', { state: snap.state, task: snap.task });
```

</details>

**依据 3 · 源码核查**：[dsh-pet/src/client/pet/multi.ts:194-216](https://github.com/PC2005-cloud/dsh-pet/blob/f439506806a9760aa3d6dae2b5fbd1e86a71a906/dsh-pet/src/client/pet/multi.ts#L194-L216)

客户端消费状态分段并更新工作状态。

<details>
<summary>查看原文（23行）</summary>

```text
    useEffect(() => {
      if (!ready) return;
      let alive = true;
      let baseline: Record<string, number> | null = null;
      /** 分段叶子 → 消费端副作用；不认识的名字已被 resolveLeafPath 挡在外面。 */
      const applySection = (name: SectionLeafName, leaf: StateLeaf): void => {
        switch (name) {
          case 'config':
            // 配置被别处改过（唯一写方是 POST /pet-display），重新拉取并拍平。
            // 叶子 data 只是信号，配置本体太大，不能塞进 /state。
            petBridge.reload();
            return;
          case 'balance': {
            const hit = readBalance(leaf);
            if (hit) applyBalanceRef.current(hit.state, hit.manual);
            return;
          }
          case 'workStatus': {
            const snap = readWorkStatus(leaf);
            if (snap) {
              setWorkStatus(snap);
              setWorkStatusTick((t) => t + 1); // 任何变化都触发，含回到空闲。
            }
```

</details>

**依据 4 · 源码核查**：[dsh-pet/src/client/pet/state-poll.ts:32-52](https://github.com/PC2005-cloud/dsh-pet/blob/f439506806a9760aa3d6dae2b5fbd1e86a71a906/dsh-pet/src/client/pet/state-poll.ts#L32-L52)

轮询异常静默并退避重试。

<details>
<summary>查看原文（21行）</summary>

```text
export async function runStatePoll(deps: StatePollDeps): Promise<void> {
  /** 宿主是否支持长轮询：首拍带 counter 就是支持。 */
  let longPoll = false;
  /** 上次拿到的 counter，作为长轮询的 since。 */
  let since: number | undefined;
  while (deps.isAlive()) {
    let state: PollState | null = null;
    try {
      state = await deps.fetch(longPoll && since !== undefined ? { since, timeoutMs: deps.waitMs } : undefined);
    } catch {
      /* 轻量轮询失败静默，下一拍再试。 */
    }
    if (!deps.isAlive()) return;
    if (state !== null) {
      longPoll = typeof state.counter === 'number';
      if (longPoll && typeof state.counter === 'number') since = state.counter;
      deps.onState(state);
    }
    // 长轮询命中或首拉时立刻再请求；失败或老宿主则退避一个间隔。
    if (state === null || !longPoll) await sleep(deps.fallbackMs);
  }
```

</details>

**依据 5 · 源码核查**：[dsh-pet/src/host/routes/state.ts:62-93](https://github.com/PC2005-cloud/dsh-pet/blob/f439506806a9760aa3d6dae2b5fbd1e86a71a906/dsh-pet/src/host/routes/state.ts#L62-L93)

状态路由读取同一状态 store，支持版本等待并在唤醒后返回快照。

<details>
<summary>查看原文（32行）</summary>

```text
  // 轮询状态（/state，GET，no-cache）是前端轮询的唯一数据源：只读、纯内存、零副作用——
  // 在这里触发外部调用或模型生成会把所有人的轮询拖死；也不碰磁盘（配置变更信号走 sections.config）。
  //
  // 长轮询：带 `?since=&timeout=`（成对必填）时，版本与当前相同就挂起，直到任意叶子被写过或超时；
  // 不带 = 立刻返回全量。等待语义与 GET /playback/{id} 的 wait 同一套（上限同值、断线同一个 signal）。
  if (rest === 'state') {
    if (method !== 'GET') return methodNotAllowed();
    const headers = { 'cache-control': 'no-cache, no-store' };
    const parsed = parseStateWaitQuery(url.searchParams.get('since'), url.searchParams.get('timeout'));
    // since/timeout 是业务参数：给错了是调用方的问题，但仍属「请求已进处理器」
    if (parsed.kind === 'error') return failResult('bad-request', parsed.error);
    const current = state.read();
    // 两者都没传 → 立刻返回；已经有新东西 → 也立刻返回（别白等一整个 timeout）。
    // timeout=0 走挂起分支，下一拍就醒，等价「立刻返回」，这里不特判。
    if (parsed.kind === 'none' || current.counter !== parsed.since) {
      return okResult(current, headers);
    }
    const since = parsed.since;
    return await new Promise<RouteResult>((resolveWait) => {
      let settled = false;
      /** 收尾：只认第一次（唤醒 / 超时 / 取消 / 调用方断开 都可能先后到达） */
      const settle = (result: RouteResult): void => {
        if (settled) return;
        settled = true;
        resolveWait(result);
      };
      // 唤醒时才 read()：store 保证「叶子已写定」之后才叫醒，所以这里拿到的一定是新状态
      const cancel = state.wait({
        since,
        timeoutMs: parsed.timeoutMs,
        onWake: () => settle(okResult(state.read(), headers)),
      });
```

</details>

**依据 6 · 源码核查**：[dsh-pet/src/shared/state.ts:45-52](https://github.com/PC2005-cloud/dsh-pet/blob/f439506806a9760aa3d6dae2b5fbd1e86a71a906/dsh-pet/src/shared/state.ts#L45-L52)

客户端通过 fetch 请求 /state 并处理非成功响应。

```text
export async function fetchState(
  baseUrl = ROUTE_PATH + '/state',
  wait?: { since: number; timeoutMs: number },
): Promise<PollState | null> {
  try {
    const url = wait ? `${baseUrl}?since=${wait.since}&timeout=${wait.timeoutMs}` : baseUrl;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
```

**依据 7 · 源码核查**：[dsh-pet/src/client/pet/multi.ts:315-325](https://github.com/PC2005-cloud/dsh-pet/blob/f439506806a9760aa3d6dae2b5fbd1e86a71a906/dsh-pet/src/client/pet/multi.ts#L315-L325)

容器将 fetchState 和 applyState 接入轮询循环。

<details>
<summary>查看原文（11行）</summary>

```text
      // 自调度轮询在 pet/state-poll.ts：这里只提供拉取与分发。
      void runStatePoll({
        fetch: (options) =>
          fetchState(
            undefined,
            options === undefined ? undefined : { since: options.since, timeoutMs: options.timeoutMs },
          ),
        onState: applyState,
        waitMs: STATE_WAIT_MS,
        fallbackMs: STATE_FALLBACK_MS,
        isAlive: () => alive,
```

</details>

#### 缺口

- 没有固定版本的宿主加载与交互运行记录
  **影响**：不能断言实际插件挂载或动画显示成功
  **进一步探讨**：在匹配的 DSH 环境触发工作、等待和结束事件并逐项记录可见结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 多会话和中断时展示状态如何决定？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

状态规约将工具调用映射为 working、需要确认映射为 waiting，并将正常、错误及阻塞结束区分；中断或未知结束返回空，监听器清除会话和缓存，避免旧状态持续显示。监听器按调用标识追踪在途工具，仍有操作时维持工作状态；任务列表文案按会话记录。聚合按固定优先级选一个会话，因此它是一种压缩视图，不能代表每个会话的完整过程。具体事件次序、丢失、并发和宿主事件格式都可能改变表现；源码不能保证状态与真实任务同步。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-pet/src/host/work-status.ts:68-98](https://github.com/PC2005-cloud/dsh-pet/blob/f439506806a9760aa3d6dae2b5fbd1e86a71a906/dsh-pet/src/host/work-status.ts#L68-L98)

事件到状态的映射和结束分支。

<details>
<summary>查看原文（31行）</summary>

```text
/** 从会话事件压缩出工作状态；无变化 / 不关心返回 null。
 *  turn 为当前回合上下文（goal 续跑轮判定），只影响 turn/end completed 的终局语义。 */
export function reduceWorkStatus(
  event: {
    type?: string;
    data?: Record<string, unknown> & { reason?: { kind?: string } };
  },
  turn?: WorkStatusTurnContext,
): HostWorkStatusState | null {
  switch (event?.type) {
    case 'turn/start':
      return 'thinking';
    case 'tool/call': {
      // 问用户问题的工具（选择题弹窗）＝ 等用户答复，不是普通干活
      if (String(event?.data?.name ?? '') === USER_QUESTION_TOOL) return 'waiting';
      return 'working';
    }
    case 'tool/result':
      return 'result';
    case 'approval/asked':
      return 'waiting';
    case 'turn/end': {
      // completed→success、错误系→error、blocked→waiting；其余（aborted 等）→null＝清该会话回空闲
      const reason = turnEndState(String(event?.data?.reason?.kind ?? ''));
      // 本轮完成是否等于整个任务完成交给 completedState（goal 续跑轮的中间轮不庆祝）
      if (reason === 'success') return completedState(turn);
      return reason;
    }
    default:
      return null; // todo/write 等：不切动画（详情文案由调用方另行处理）
  }
```

</details>

**依据 2 · 源码核查**：[dsh-pet/src/host/work-status.ts:147-160](https://github.com/PC2005-cloud/dsh-pet/blob/f439506806a9760aa3d6dae2b5fbd1e86a71a906/dsh-pet/src/host/work-status.ts#L147-L160)

跨会话展示优先级。

<details>
<summary>查看原文（14行）</summary>

```text
/** 展示优先级：waiting > error > working > thinking > result > success。
 *  result 高于 success：任何会话的进行中过渡态都不被别处已完成态压过，防中途庆祝；同档按最近更新优先。 */
export const WORK_STATUS_PRIORITY: Record<HostWorkStatusState, number> = {
  waiting: 60,
  error: 50,
  working: 40,
  thinking: 30,
  result: 25,
  success: 20,
};

/** 展示用条目：所有会话里优先级最高者（同优先级取 seq 更大者）；无会话返回 undefined。 */
export function pickDisplayed(entries: Iterable<SessionWorkEntry>): SessionWorkEntry | undefined {
  let best: SessionWorkEntry | undefined;
```

</details>

**依据 3 · 源码核查**：[dsh-pet/src/host/plugin/session-watch.ts:211-251](https://github.com/PC2005-cloud/dsh-pet/blob/f439506806a9760aa3d6dae2b5fbd1e86a71a906/dsh-pet/src/host/plugin/session-watch.ts#L211-L251)

终止清理、在途工具处理及状态发布。

<details>
<summary>查看原文（41行）</summary>

```text
      let next = reduceWorkStatus(
        event as { type?: string; data?: Record<string, unknown> & { reason?: { kind?: string } } },
        turnFlags.get(sessionId),
      );
      if (!next) {
        // turn/end 的 null（aborted / 未知 kind）＝该会话回合已结束：清掉会话状态，让展示回到空闲或
        // 落到其他活跃会话，防止回合被打断后永久卡在上一档；其他事件的 null 是「不关心」，忽略。
        if (type === 'turn/end') {
          turnFlags.delete(sessionId);
          cancelTerminalCleanup(sessionId); // 条目都要清了，别留一个到点后无事可做的定时器
          lastTodoText.delete(sessionId); // 按会话记的两份缓存跟着会话一起消失（防泄漏）
          toolsInFlight.delete(sessionId);
          workStatus.clear(sessionId); // 条目连同任务详情文案一起消失（clear 内部会重算展示）
          publishWorkStatus(); // 回合被打断 → 回到空闲：前端据此收起常驻气泡
        }
        return;
      }
      const seq = Number((event as { seq?: unknown }).seq ?? 0);
      // 工具详情（「修改 index.ts」这类具体描述）：比通用档位文案有用得多，workStatusEnabled
      // 的宠物直接把它当气泡文本。
      // 必须在 setState 之后写：setTask 要求会话条目已存在，而条目正是 setState 建出来的——
      // 顺序反了这一句会被静默丢弃（不报错，最难查的那种）。
      const detail =
        type === 'tool/call' ? toolDetailFromEvent(event as { data?: { name?: unknown; arguments?: unknown } }) : null;
      const outcome = trackToolEvent(toolsInFlight, sessionId, {
        type,
        callId: toolCallIdOf(event),
        detail,
        lastTodo: lastTodoText.get(sessionId) ?? null,
      });
      // 还有操作没完就把档位压回 working：结果档与「仍在执行」的文案同时出现会自相矛盾。
      if (outcome?.keepWorking) next = 'working';
      const changed = workStatus.setState(sessionId, next, seq);
      if (outcome?.task !== undefined) workStatus.setTask(sessionId, outcome.task);
      publishWorkStatus(); // 档位或文案变了 → 写 S（内容没变时它自己会短路，不产生多余写入）
      // 同会话同状态不重复更新（防刷屏）：写已经落定，这里只负责跳过终态清理的重排
      if (!changed) return;
      // 终态只展示短暂窗口后自动清理：陈旧完成态不再浮上来（Bug 3 的一环，顺带缓解 Bug 2 残留）。
      // 回到非终态则取消那次待执行的清理——否则它到点时会话已非终态，既不清也不重排，
      // 条目（连同旧任务文案）就永久留下了。
      if (next === 'success' || next === 'error') scheduleTerminalCleanup(sessionId);
```

</details>

#### 缺口

- 未以真实多会话事件流验证状态
  **影响**：不能用宠物作为完整任务审计或唯一完成判断
  **进一步探讨**：在多会话、工具并发、阻塞及中断场景对照原始事件和界面结果。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启动、桌面和外部访问有哪些条件？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

包声明 Node 22.12 及以上、DSH 与 React 相关对等依赖，客户端注册也需要宿主的 slots、locale、connection、remote 和 commandUi。作者兼容列表是声明，本次没有宿主兼容验收。桌面路径在没有桌面宠物时跳过 Helper，无图形环境也跳过；存在桌面需求而找不到 Electron 时尝试下载，失败记录告警并提示设置路径或重试。宿主 HTTP 路由直接注册到 webServer，本次没有核查宿主的实际监听和认证策略；独立模式另有 Host、来源和令牌校验，不能把它推广到 DSH 宿主模式。素材和代码许可也不同，组件 README 声明素材禁止商用。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-pet/package.json:99-140](https://github.com/PC2005-cloud/dsh-pet/blob/f439506806a9760aa3d6dae2b5fbd1e86a71a906/dsh-pet/package.json#L99-L140)

运行时、对等依赖和兼容声明。

<details>
<summary>查看原文（42行）</summary>

```text
  "license": "MIT",
  "engines": {
    "node": ">=22.12.0"
  },
  "dependencies": {
    "@andresaya/edge-tts": "^1.9.1",
    "@anthropic-ai/sdk": "0.135.0",
    "@electron-internal/extract-zip": "^1.0.5",
    "@electron/get": "^5.1.0",
    "openai": "7.39.0",
    "zod": "4.6.7"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "compatibility": {
      "dshReleases": {
        "0.2.1-rc.2": "compatible",
        "0.2.1-rc.3": "compatible",
        "0.2.2-alpha.2": "compatible"
      }
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-connection"
      ],
      "platform": "web"
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.4",
    "@deepseek-ai/dsh-agent-default-model": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-client-connection": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-client-ui-primitives": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-client-ui-slots": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-commands": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-credentials": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-home-paths": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-host-webserver": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-llm": "^0.2.0-rc.1",
    "react": "^18.2.0",
```

</details>

**依据 2 · 源码核查**：[dsh-pet/src/client/app.ts:64-71](https://github.com/PC2005-cloud/dsh-pet/blob/f439506806a9760aa3d6dae2b5fbd1e86a71a906/dsh-pet/src/client/app.ts#L64-L71)

客户端声明注入服务。

```text
    // 宠物 overlay 与设置页各自独立成文件，这里只组装和注册。
    const PetMulti = makePetUI({ h, useState, useEffect, useRef });

    const name = 'pet';
    // commandUi 声明为服务依赖，确保「/」命令服务就绪后才 apply，/pet 装饰必然注册成功。
    const inject = ['slots', 'locale', 'connection', 'remote', 'remote.commands', 'commandUi'];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- DSH 注入的 ctx（locale/slots/webServer 等 service 无静态类型）
    function apply(ctx: any) {
```

**依据 3 · 源码核查**：[dsh-pet/src/host/plugin/desktop/spawn.ts:157-209](https://github.com/PC2005-cloud/dsh-pet/blob/f439506806a9760aa3d6dae2b5fbd1e86a71a906/dsh-pet/src/host/plugin/desktop/spawn.ts#L157-L209)

桌面需求、图形环境、下载和失败分支。

<details>
<summary>查看原文（53行）</summary>

```text
  const startHelper = (): void => {
    if (inProcessHost) return; // 应用模式：不探测、不下载 Electron
    if (helper || electronEnsure || disposed) return;
    if (!getHasDesktopPet() && !(desktopModeEverActive && getTrayOn())) {
      // 诊断日志（issue #168）：这条短路不打日志，就是「桌面模式凭空消失：无进程、无目录、无提示」
      // 的直接成因。用 info 而非 warn——纯网页用户这是正常状态；只打一次避免刷屏。
      // 托盘关掉后这里也会命中：没人需要那个图标，空常驻没有意义。
      if (!noDesktopSkipped) {
        noDesktopSkipped = true;
        log.info(
          `[dsh-pet] 无桌面宠物（display 均为 web/none）且无需保留托盘（tray=${getTrayOn()}），已跳过桌面 Helper 启动`,
        );
      }
      return;
    }
    // 无图形显示环境（Linux 服务器 / 容器）：直接放弃，不探测、不下载、不拉起。
    // 否则 Electron 会「拉起即崩」，被守护循环反复重启并刷满 core dump。
    if (!hasGraphicalDisplay()) {
      if (!displayWarned) {
        displayWarned = true;
        log.warn(
          '[dsh-pet] 未检测到图形显示环境（DISPLAY/WAYLAND_DISPLAY 均为空），已跳过桌面宠物。' +
            '浏览器内宠物不受影响；如需在服务器上启用桌面模式，请配置 Xvfb 后设置 DSH_PET_DESKTOP_FORCE=1。',
        );
      }
      return;
    }
    const found = resolveElectronPath();
    if (found) {
      launchHelper(found);
      return;
    }
    // 诊断日志（issue #168）：只报「没找到」不够用——最常见的情形是「文件明明存在」，
    // 但不在实际查询的路径上（DSH_HOME 不一致）。把真正查的路径一起打出来。
    log.warn(
      `[dsh-pet] 未找到 Electron 可执行文件：DSH_HOME=${dshHomeDir()}，查找路径=${defaultElectronExe()}` +
        `，DSH_PET_ELECTRON_PATH=${process.env.DSH_PET_ELECTRON_PATH ?? '(未设置)'}`,
    );
    log.warn(`[dsh-pet] 开始下载 Electron 到 ${defaultElectronExe()} ...`);
    electronEnsure = ensureElectronDownload({
      // 下载全过程写进工作状态气泡（用户没有控制台，只能靠它看进度与失败原因）
      onLog: ({ text, level, done }) =>
        reportDownload(text, level === 'warn' ? 'error' : done ? 'success' : 'working', done),
      // 同一份进度也落盘：气泡只在有宠物显示时可见，桌面版 Helper 起不来时它就没有载体
      logger: log,
    })
      .then((path) => {
        if (path) {
          launchHelper(path);
        } else {
          log.warn(
            '[dsh-pet] Electron download failed; desktop pet unavailable. Set DSH_PET_ELECTRON_PATH and restart, or retry later.',
          );
```

</details>

**依据 4 · 源码核查**：[dsh-pet/src/standalone/request-security.ts:58-88](https://github.com/PC2005-cloud/dsh-pet/blob/f439506806a9760aa3d6dae2b5fbd1e86a71a906/dsh-pet/src/standalone/request-security.ts#L58-L88)

独立模式校验 Host、来源和敏感请求令牌。

<details>
<summary>查看原文（31行）</summary>

```text
    authorize(req, res, allowFileOrigin = false) {
      const host = req.headers.host;
      const port = req.socket.localPort;
      if (!port || (host !== `127.0.0.1:${port}` && host !== `localhost:${port}`)) {
        return rejectRequest(res, 403, '仅允许当前本机地址');
      }
      // 文件页渲染器也要带令牌：沙箱网页同样会发来 null 来源。
      // 同一渲染器加载媒体时可能完全不带 Origin，只有这种情况才放行。
      const fileOrigin = allowFileOrigin && (req.headers.origin === 'null' || req.headers.origin === undefined);
      if (
        !fileOrigin &&
        ((req.headers.origin !== undefined && req.headers.origin !== `http://${host}`) ||
          req.headers['sec-fetch-site'] === 'cross-site')
      ) {
        return rejectRequest(res, 403, '不允许跨站请求');
      }
      try {
        if (publicRead(req) && !fileOrigin) return true;
      } catch {
        return rejectRequest(res, 400, '请求地址无效');
      }
      const supplied = req.headers['x-dsh-pet-token'];
      // 先按固定形状校验，再走定时安全比较，避免长度与内容泄漏。
      if (
        typeof supplied !== 'string' ||
        !/^[A-Za-z0-9_-]{43}$/.test(supplied) ||
        !timingSafeEqual(Buffer.from(supplied), Buffer.from(token))
      ) {
        return rejectRequest(res, 403, '请从桌宠菜单重新打开设置');
      }
      return true;
```

</details>

**依据 5 · 作者声明**：[dsh-pet/README.md:3-7](https://github.com/PC2005-cloud/dsh-pet/blob/f439506806a9760aa3d6dae2b5fbd1e86a71a906/dsh-pet/README.md#L3-L7)

作者声明代码及素材许可不同。

```text
一只住在 DeepSeek Harness 里的桌面宠物，一百余个透明动画，可多开、能上桌面。

安装与完整文档：**<https://github.com/PC2005-cloud/dsh-pet>**

许可：代码 MIT；素材禁止商用；二创在公开渠道须署名（同上链接）。
```

#### 缺口

- DSH webServer 的监听与路由准入未在该宿主版本中验证
  **影响**：不能判断插件路由在具体部署中的暴露范围
  **进一步探讨**：检查实际宿主监听地址及鉴权配置，再在隔离环境验证访问边界。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 初次、持续和退出成本是否适合目标用户？

**研究主题**：效果与总成本、采用判断

#### 完整回答

作者给出图形界面或 CLI 安装并重启宿主的步骤，源码安装还要自行构建。用户需选择兼容版本、确认是否使用桌面模式和模型或余额能力，并处理网络下载、权限、配置和失败排查；模型或余额请求的费用与频率取决于配置及供应商，金额未知。浏览器页面需要持续状态轮询；插件生命周期清理等待、锁与 Helper，但这不证明用户数据、下载文件随卸载删除。对于只想获得任务完成信号的人，直接查看宿主或使用已有通知可能更省维护。没有同条件任务的有效提示率、时间和资源对照，因此不能计算收益或单位合格成本。

#### 证据与依据

**依据 1 · 作者声明**：[INSTALL.md:5-7](https://github.com/PC2005-cloud/dsh-pet/blob/f439506806a9760aa3d6dae2b5fbd1e86a71a906/INSTALL.md#L5-L7)

作者的安装后重启说明。

```text
装法取决于你在用哪个 DSH：**桌面应用**用应用内「插件管理」，**`dsh web`** 用命令行，改用源码安装则先 clone 再构建。几条路最终都是把插件装进 profile 的 `node_modules`，效果一样；区别只是入口。

装完**重开 DSH**（`dsh web` 用户则重启 `dsh web`）才生效——运行中的进程持有内存里的旧插件。宠物出现在界面右上角（默认配置角落，可在设置页修改）。
```

**依据 2 · 作者声明**：[INSTALL.md:35-65](https://github.com/PC2005-cloud/dsh-pet/blob/f439506806a9760aa3d6dae2b5fbd1e86a71a906/INSTALL.md#L35-L65)

CLI 安装、版本说明与源码构建步骤。

<details>
<summary>查看原文（31行）</summary>

````text
```sh
# dsh web
dsh plugin --profile web add dsh-pet

# 桌面应用（Electron 版）
dsh plugin --profile desktop add dsh-pet
```

> **兼容性**：本插件当前在 dsh **`0.2.1-rc.3`** 下开发并测试（`dsh --version` 可查看你的版本）。建议使用相同版本；其他版本如遇问题欢迎反馈。

## 方式三：从源码安装（clone 本仓库后）

`lib/` 构建产物不入库，clone 后需要先构建再安装：

```sh
# ① clone 本仓库，进入插件目录
git clone https://github.com/PC2005-cloud/dsh-pet.git
cd dsh-pet/dsh-pet

# ② 安装依赖
npm install

# ③ 构建（完整 lib：tsdown → lib + 桌面共享核心 + 类型声明）
npm run build       # 必须手动跑一次（克隆后 npm install 不再自动构建）

# ④ 安装到 DSH（file: 指向**插件目录**——上面 cd 进去的那一层，用构建好的 lib）
#    --profile 填实际在用的那个：dsh web → web；桌面应用 → desktop
dsh plugin --profile web add file:D:/path/to/dsh-pet/dsh-pet
```

> 注：`npm run build`（即 `scripts/prepare.js`）才产出**完整可安装**的 lib——除 tsdown 构建外还构建桌面共享核心（`shared-core.js`）、生成类型声明并收敛发布 `files` 清单；裸 `tsdown` 构建会缺桌面运行时与类型。发布与打包（`npm publish` / `npm pack`）时由 `prepack` 自动调用它，克隆仓库后需手动跑一次。
````

</details>

**依据 3 · 源码核查**：[dsh-pet/src/client/pet/state-poll.ts:32-52](https://github.com/PC2005-cloud/dsh-pet/blob/f439506806a9760aa3d6dae2b5fbd1e86a71a906/dsh-pet/src/client/pet/state-poll.ts#L32-L52)

页面轮询与失败重试。

<details>
<summary>查看原文（21行）</summary>

```text
export async function runStatePoll(deps: StatePollDeps): Promise<void> {
  /** 宿主是否支持长轮询：首拍带 counter 就是支持。 */
  let longPoll = false;
  /** 上次拿到的 counter，作为长轮询的 since。 */
  let since: number | undefined;
  while (deps.isAlive()) {
    let state: PollState | null = null;
    try {
      state = await deps.fetch(longPoll && since !== undefined ? { since, timeoutMs: deps.waitMs } : undefined);
    } catch {
      /* 轻量轮询失败静默，下一拍再试。 */
    }
    if (!deps.isAlive()) return;
    if (state !== null) {
      longPoll = typeof state.counter === 'number';
      if (longPoll && typeof state.counter === 'number') since = state.counter;
      deps.onState(state);
    }
    // 长轮询命中或首拉时立刻再请求；失败或老宿主则退避一个间隔。
    if (state === null || !longPoll) await sleep(deps.fallbackMs);
  }
```

</details>

**依据 4 · 源码核查**：[dsh-pet/src/host/plugin/lifecycle.ts:26-43](https://github.com/PC2005-cloud/dsh-pet/blob/f439506806a9760aa3d6dae2b5fbd1e86a71a906/dsh-pet/src/host/plugin/lifecycle.ts#L26-L43)

生命周期停止等待和 Helper 的实现。

<details>
<summary>查看原文（18行）</summary>

```text
/** 注册卸载清理；返回的清理函数由 ctx.effect 收集。 */
export function registerLifecycle(deps: LifecycleInput): void {
  const { ctx, lock, markDisposed, playback, state, stopDownloadSlotTimer, stopHelper, stopWorkStatusFlush } = deps;
  // 随插件生命周期清理：桌面 Helper 回收（异步下载完成后不再拉起）+ 结束所有挂起的等待
  // （回执与 /state 长轮询不结束的话，插件重载会留下一批悬挂响应，各自要等到超时才收尾）。
  ctx.effect(() => () => {
    markDisposed();
    // 工作状态的补写定时器：卸载后它到点已经没有意义（叶子连同长轮询一起收尾），清掉免得挂着
    stopWorkStatusFlush();
    // 下载日志的「清槽」定时器：同上，卸载后它到点已经没有意义
    stopDownloadSlotTimer();
    // 占用锁：卸载时把锁全撤掉并写一次叶子——不写的话渲染端要等 TTL 到点才解除静止
    // （写叶子必须在 state.cancelAll() 之前：那之后挂起的等待者已经收尾了）。
    lock.releaseAll();
    playback.cancelAll();
    state.cancelAll();
    stopHelper('dsh-host-stop');
  });
```

</details>

#### 缺口

- 未量化资源、模型费用、数据残留及恢复时间
  **影响**：不能估算总成本或证明停用后完全清除
  **进一步探讨**：在隔离 profile 记录安装、运行、停用前后的网络、资源和文件变化。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 哪些设计值得借鉴，怎样验证下一步假设？

**研究主题**：工程质量与复用、新假设与验证、采用判断

#### 完整回答

可以借鉴的是把浏览器 HTTP 和桌面 Helper 桥接到相同的业务路由，并用单个状态快照承载工作状态；配置读写还通过同一队列串行化，减少并发覆盖的机会。这不是跨端运行一致性的证明，实际协议、素材和生命周期仍要分别验证。一个未验证的假设是，若让工作状态摘要保留聚合来源会话并提供跳转入口，用户能更快确认多个会话的等待事项，同时不把压缩状态误认为完整历史。现有通知已经有会话跳转，假设仅针对工作状态摘要，不能宣称项目没有任何跳转。最小验证是同一批次混合并发和中断的任务，分别用现有界面与原生会话列表记录正确识别率、遗漏、额外操作与耗时；如遗漏上升、收益不稳定或额外操作抵消效果，即放弃该假设。建议愿意配置并偏好动画陪伴的用户在隔离 profile 小范围试用，若遮挡、状态不符或出现不希望的调用，停用并退回宿主界面；这不是持续采用或安全性的证明。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-pet/src/host/plugin/http-route.ts:29-58](https://github.com/PC2005-cloud/dsh-pet/blob/f439506806a9760aa3d6dae2b5fbd1e86a71a906/dsh-pet/src/host/plugin/http-route.ts#L29-L58)

配置请求经统一队列串行化。

<details>
<summary>查看原文（30行）</summary>

```text
export function createHttpRoute(deps: PetRouteDeps): { handlePetRoute: HttpRouteHandler } {
  // 配置请求覆盖完整读改写：下一次更新必须读取前一次完成后的配置。
  // GET /config 同样排队，避免写入尚未完成时读到空文件而回退内置默认。
  let configQueue: Promise<void> = Promise.resolve();

  /** 单次业务路由（HTTP 落盘与桌面 Helper 管道共用同一份实现）：输入 rawUrl + method + body 文本，
   *  返回 RouteResult，消费方各自落盘——业务逻辑只有一份，两端天然一致。
   *  signal 可选：调用方断开时中止挂起等待（只有 /playback 的 wait 分支会用到；管道侧不传）。 */
  const handlePetRoute = async (
    rawUrl: string,
    method: string,
    body?: string,
    signal?: AbortSignal,
  ): Promise<RouteResult> => {
    const url = new URL(rawUrl, 'http://localhost');
    const rest = decodeURIComponent(url.pathname.slice(ROUTE_SEGMENT.length + 1));
    const run = (): Promise<RouteResult> => dispatchPetRoute(url, rest, method, body, signal);
    // 写配置的三条路径（PUT/POST /config、POST /pet-display、POST /pet-config）都是「读当前配置
    // → 白名单重建整段 pets → 写盘」，并发交错会互相覆盖，必须共用一条串行队列；
    // GET /config 同样排队，避免写入尚未完成时读到空文件而回退内置默认。
    const isConfigQueue = rest === 'config' || ((rest === 'pet-display' || rest === 'pet-config') && method === 'POST');
    if (isConfigQueue) {
      const pending = configQueue.then(run, run);
      configQueue = pending.then(
        () => undefined,
        () => undefined,
      );
      return pending;
    }
    return run();
```

</details>

**依据 2 · 源码核查**：[dsh-pet/src/host/plugin/desktop/spawn.ts:113-142](https://github.com/PC2005-cloud/dsh-pet/blob/f439506806a9760aa3d6dae2b5fbd1e86a71a906/dsh-pet/src/host/plugin/desktop/spawn.ts#L113-L142)

桌面桥复用相同业务路由。

<details>
<summary>查看原文（30行）</summary>

```text
    // 右键「打开网站」交出去的是裸 origin：DSH 只在 `GET /` 接受本进程的启动令牌，换发绑定该 authority
    // 的签名 Cookie，其余请求一律 401，故传 origin 而不是另拼地址。令牌等价登录态：只经子进程环境变量
    // 递到 helper 内存，不落盘、不进日志。
    const siteUrl = ctx.connection.authenticatedUrl(origin);
    // 桌面渲染端也从同一份 handlePetRoute 拿成品配置（每只宠物一个局部小窗口；经管道，不走 HTTP——
    // DSH Desktop 2.0.3+ 会拦插件自拉进程的裸 HTTP 请求，浏览器访问闸门只放行带令牌的请求）
    const configUrl = `${origin}${ROUTE_SEGMENT}/config`;
    helper = new HelperProcess(
      {
        electronPath,
        env: {
          DSH_PET_CONFIG_URL: configUrl,
          // 已鉴权站点 URL（含本进程启动令牌）：只供 helper 的「打开」首项使用，任何日志都不许出现它
          DSH_PET_SITE_URL: siteUrl,
          // 宿主形态决定菜单首项的去向与文案（同名「打开」项，三种形态三种语义）：
          //   desktop    = DSH 桌面应用 → 唤起应用主窗口（helper 走 dsh://open）
          //   standalone = 独立模式 → 本机 AI 设置页
          //   web        = dsh web → DSH 站点
          DSH_PET_OPEN_TARGET: resolveOpenTarget(siteUrl, isDesktopHost()),
          DSH_PET_SCALE: '1',
          // 打开 bridge 协议：main.js 注册 dsh-pet-bridge scheme，把渲染端请求经管道转给宿主
          DSH_PET_BRIDGE: '1',
          // 每只桌面宠物一个局部小窗口：透传宠物列表（[{id,size}]）
          DSH_PET_PETS: JSON.stringify(desktopPetList()),
        },
        // bridge 协议处理器 = HTTP 路由同一份 handlePetRoute（业务逻辑唯一，两端天然一致）；
        // 形状转换在 ./bridge-response，本模块只管把请求转进去。
        bridgeHandler: async (req) => {
          const result = await getHandlePetRoute()(req.url ?? '/', req.method ?? 'GET', req.body);
          return toBridgeResponse(req.id, result);
```

</details>

**依据 3 · 源码核查**：[dsh-pet/src/host/work-status.ts:147-160](https://github.com/PC2005-cloud/dsh-pet/blob/f439506806a9760aa3d6dae2b5fbd1e86a71a906/dsh-pet/src/host/work-status.ts#L147-L160)

工作状态压缩为优先展示项。

<details>
<summary>查看原文（14行）</summary>

```text
/** 展示优先级：waiting > error > working > thinking > result > success。
 *  result 高于 success：任何会话的进行中过渡态都不被别处已完成态压过，防中途庆祝；同档按最近更新优先。 */
export const WORK_STATUS_PRIORITY: Record<HostWorkStatusState, number> = {
  waiting: 60,
  error: 50,
  working: 40,
  thinking: 30,
  result: 25,
  success: 20,
};

/** 展示用条目：所有会话里优先级最高者（同优先级取 seq 更大者）；无会话返回 undefined。 */
export function pickDisplayed(entries: Iterable<SessionWorkEntry>): SessionWorkEntry | undefined {
  let best: SessionWorkEntry | undefined;
```

</details>

**依据 4 · 源码核查**：[dsh-pet/src/host/work-status.ts:130-144](https://github.com/PC2005-cloud/dsh-pet/blob/f439506806a9760aa3d6dae2b5fbd1e86a71a906/dsh-pet/src/host/work-status.ts#L130-L144)

状态快照仅包含状态、任务与时间，未包含会话标识。

<details>
<summary>查看原文（15行）</summary>

```text
/** 工作状态快照（/work-status 端点响应体）：state 为主状态；task 为 todo 详情（可 null）。 */
export interface WorkStatusSnapshot {
  state: HostWorkStatusState | null; // null = 尚无会话活动（空闲）
  task: string | null; // 当前任务详情（todo/write 提供，可 null）
  ts: number; // 最近一次变化的时间戳（轮询侧据此检测变化）
}

/** 每会话聚合条目。 */
export interface SessionWorkEntry {
  /** 该会话当前档位。 */
  state: HostWorkStatusState;
  /** 该会话最近事件的序号，同档位时按它取最近。 */
  seq: number;
  /** 任务详情文案；null = 该会话没有清单。 */
  task: string | null;
```

</details>

**依据 5 · 源码核查**：[dsh-pet/src/host/plugin/session-watch.ts:283-291](https://github.com/PC2005-cloud/dsh-pet/blob/f439506806a9760aa3d6dae2b5fbd1e86a71a906/dsh-pet/src/host/plugin/session-watch.ts#L283-L291)

通知帧带会话标识，不能宣称项目不存在会话跳转。

```text
        if (isCompletionTurnEnd(event)) {
          scheduleCompletionNotify(sessionIdOf(session), event);
          return;
        }
        // 非完成收尾（出错 / 输出截断 / 中止）用不到这段正文，一并清掉，免得留到下一次完成。
        if (event?.type === 'turn/end') lastReplyText.delete(sessionIdOf(session));
        const frame = reduceNotifyFrame(event as Parameters<typeof reduceNotifyFrame>[0]);
        // 帧带上「这条通知是哪条会话发出的」：点击时网页据此跳到那条会话（见 withSessionId）
        if (frame) pushNotifyFrame(withSessionId(frame, sessionIdOf(session)));
```

#### 缺口

- 跨端一致性和所提状态跳转假设均无实验
  **影响**：不能声称方案改善核对效率
  **进一步探讨**：按同版本和相同事件序列运行浏览器与桌面路径并记录可观察差异。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
