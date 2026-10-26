# dsh-pet-live2d

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[2244393](https://github.com/A8Chann/dsh-pet-live2d/tree/22443935bc6a47c9476f4eeeca5e67a209ce43f7/dsh-live2d-pet)

<!-- BEGIN META -->
[![GitHub ★ 54](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=54&color=yellow&logo=github&style=flat)](https://github.com/A8Chann/dsh-pet-live2d) [![npm 30d 6,432](https://img.shields.io/static/v1?label=npm+30d&message=6%2C432&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-pet-live2d) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-pet-live2d)
<!-- END META -->

> **实现功能**：为DSH网页挂载Live2D桌宠，支持鼠标互动、换装和会话事件驱动的动作表情。

> **核心亮点**：相对独立桌宠，任务事件与角色表现的组合减少单纯看日志的需要，但未证明状态理解更准确；渲染与素材能力继承上游。见 [Q01](#research-q01)。

> **风险与缺陷**：整目录同步以pet.json指纹判断所有权，不能保护只改了同名贴图/动作而清单不变的情况；Core内容检查也不是固定摘要验证。见 [Q03](#research-q03)。

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
  - [Q01 · 桌宠对等待和状态判断提供什么增量？](#detail-section-11)
  - [Q02 · 宿主事件怎样驱动客户端动作并释放资源？](#detail-section-12)
  - [Q03 · 升级保护是否真的覆盖用户修改过的所有素材？](#detail-section-13)
  - [Q04 · 首次、持续与恢复负担由哪些条件决定？](#detail-section-14)
  - [Q05 · 怎样借鉴联动机制并控制试用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：为希望视觉陪伴的个人用户提供另一种状态呈现；任务质量和效率不由动画存在推定。具体对照见 [Q01](#research-q01)。

原生文字/日志状态和无事件联动的独立桌宠；未运行可用性对照，不宣称原创Live2D渲染。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Live2D桌宠互动 | 视觉陪伴与换装 | WebGL、模型和Core运行时 |
| 相位动作表情 | 映射工具/审批/错误等事件 | 粗粒度状态，非任务结果验收 |
| 素材同步 | 复制或更新随包宠物 | 仅清单指纹判断所有权 |
| 本地资源与Core缓存 | 模型加载与离线复用 | 首次网络与许可需核对 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH>=0.1.5-rc.1网页与WebGL | 网页启动必需 | 界面与渲染 | 不能保证模型显示 |
| 模型素材及授权 | 必需 | 动作/贴图/语音 | 能力缺失或许可边界未满足 |
| Cubism Core及首次CDN访问 | 无本地缓存时必需 | 专有渲染运行时 | 返回不可用提示 |
| 可写pets/runtime目录 | 缓存/保存必需 | 同步与离线复用 | 可能重复下载或需人工管理 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户备份自定义pets目录并装正确子包 | 插件启用后重启 |
| 2 | 检查模型/Core与许可 | 角色成功显示 |
| 3 | 在非敏感会话观察工具/审批/错误相位 | 不误导当前会话状态 |
| 4 | 检查透明穿透、声音、禁用恢复 | 资源或UI冲突时停止 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 模型下载、Core网络及WebGL | 安装重启与检查素材许可 | 首载时间和资源量未知 |
| 持续使用 | GPU/内存、声音和事件流 | 调整外观、确认不遮挡/误导 | 无实测常驻开销 |
| 失败恢复 | 重载和资源重取 | 备份恢复完整宠物目录 | 仅清单备份不足 |
| 升级退出 | 素材副本存储 | 检查同名文件覆盖与禁用释放 | 未作实际升级/退出验收 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 状态联动 | 事件到SSE到动作链路 | 多会话语义和用户理解收益 |
| 素材同步 | 清单所有权与目录覆盖 | 只改资源时安全保留 |
| 互动优先与释放 | 动作延迟、流关闭和解除持续状态 | 真机资源与所有窗口行为 |

> **思考**：整目录同步以pet.json指纹判断所有权，不能保护只改了同名贴图/动作而清单不变的情况；Core内容检查也不是固定摘要验证。见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对独立桌宠，任务事件与角色表现的组合减少单纯看日志的需要，但未证明状态理解更准确；渲染与素材能力继承上游。见 [Q01](#research-q01)。

相对独立桌宠，任务事件与角色表现的组合减少单纯看日志的需要，但未证明状态理解更准确；渲染与素材能力继承上游。见 [Q01](#research-q01)。

核心借鉴点是宿主事件适配和渲染生命周期的分离；素材所有权粒度与外部运行时可复现性是维护代价。见 [Q02](#research-q02) 与 [Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

整目录同步以pet.json指纹判断所有权，不能保护只改了同名贴图/动作而清单不变的情况；Core内容检查也不是固定摘要验证。见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议备份自定义素材后个人试用网页端，先核对当前会话归属、穿透与声音，再观察长回合资源和禁用恢复；停止条件见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

事件联动与模型同步路径有源码支持；素材保护范围存在可识别限制，性能/多会话正确性未运行验证；逐文件合并是假设。

- 已检查：作者 README、包清单、源码路径 README.md、dsh-live2d-pet/README.md、dsh-live2d-pet/package.json、dsh-live2d-pet/lib/index.js、dsh-live2d-pet/lib/client.js 及固定范围 inventory；组件：dsh-live2d-pet。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查固定组件包、宿主事件/资源/同步路径和客户端SSE/动作清理；未逐项审阅全部模型、vendor或桌面壳，未执行目标代码。
- 下一步：已检查源码；没有运行插件、模型渲染、浏览器测试或真实宿主验收。

**分析版本**

- **仓库**：[A8Chann/dsh-pet-live2d](https://github.com/A8Chann/dsh-pet-live2d)
- **版本号**：3.4.0（[固定提交 2244393](https://github.com/A8Chann/dsh-pet-live2d/tree/22443935bc6a47c9476f4eeeca5e67a209ce43f7)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设为逐文件所有权与显式冲突合并，兼顾个人素材保护和上游更新；四类素材对照及否定条件见 [Q05](#research-q05)。

已检查源码；没有运行插件、模型渲染、浏览器测试或真实宿主验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 1341 | — | — | 21103 |
| .js | source | 7 | 12772 | 8232 | 4007 | — |
| .ts | source | 1 | 28 | 17 | 10 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/A8Chann/dsh-pet-live2d/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 4](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=4&color=grey&logo=github&style=flat)](https://github.com/A8Chann/dsh-pet-live2d/issues?q=is%3Aissue+created%3A2026-09-26T01%3A59%3A33.546Z..2026-10-26T01%3A59%3A33.546Z) [![近30天关闭 4](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=4&color=grey&logo=github&style=flat)](https://github.com/A8Chann/dsh-pet-live2d/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T01%3A59%3A33.546Z..2026-10-26T01%3A59%3A33.546Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对Live2D状态陪伴的事件链路、用户素材保护和个人试用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 桌宠对等待和状态判断提供什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是希望DSH长任务期间有视觉陪伴与状态提示的个人用户。作者将宿主工具、审批、错误与完成事件映射到Live2D动作、表情和台词，相对无事件联动的独立桌宠，增量是任务状态与角色表现的组合；相对原生文字/日志，它提供另一种低阅读量的呈现。合格结果仍需状态可信、界面不被遮挡、可以关闭并恢复，而不能用“有动画”证明更快理解或更有效工作。自带模型和互动槽位降低素材接线门槛，Live2D渲染技术本身属于上游能力。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:38-51](https://github.com/A8Chann/dsh-pet-live2d/blob/22443935bc6a47c9476f4eeeca5e67a209ce43f7/README.md#L38-L51)

作者的陪伴、状态与穿透主张。

<details>
<summary>查看原文（14行）</summary>

```text
## 是什么

DSH 的 Web GUI 负责对话，而 **dsh-pet-live2d 是挂在这块界面上的一只桌宠**：她住在页面右下角，能拖、能缩、
跟着鼠标看，点她会有反应。更有意思的是她**订阅 DSH 的真实事件**（工具调用、审批请求、子代理、轮次结束……），
于是「在想」「在跑工具」「在等你批准」「出错了」这些状态会变成她的动作、表情和台词 —— 不用盯着日志看进度。

| 能力 | 原生 DSH Web GUI | 装了 dsh-pet-live2d |
|---|---|---|
| 界面陪伴 | 无 | 桌宠常驻页面，可拖动 / 缩放，位置和大小记在 localStorage |
| 状态可视化 | 文字与状态点 | 8 个会话相位，各有一套动作 + 表情 + 台词，长任务持续播放 |
| 互动 | 无 | 摸头 / 摸尾巴 / 绕着转圈都有反应，按模型的三角面判定，不是方框 |
| 换装 | 无 | 20 个互斥槽位、44 个表情/道具，右键面板现场换，装扮跨会话保留 |
| 挡不挡 UI | — | 只有角色剪影吃鼠标事件，方形画布的透明处**穿透**到底下页面 |
| 打扰程度 | — | 静置才会自己演一段；平时画面上**没有任何常驻 UI**，鼠标划过也不显示 |
```

</details>

**依据 2 · 源码核查**：[dsh-live2d-pet/package.json:59-63](https://github.com/A8Chann/dsh-pet-live2d/blob/22443935bc6a47c9476f4eeeca5e67a209ce43f7/dsh-live2d-pet/package.json#L59-L63)

渲染器依赖归属。

```text
  "devDependencies": {
    "esbuild": "^0.25.10",
    "pixi.js": "8.19.0",
    "untitled-pixi-live2d-engine": "1.3.5"
  },
```

#### 缺口

- 没有状态理解与打扰程度的独立用户比较
  **影响**：无法证明动画优于原生状态或静态提示
  **进一步探讨**：同任务比较原生文本、静态图标和桌宠，测误判、响应审批时间与干扰

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 宿主事件怎样驱动客户端动作并释放资源？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

服务端ActivityHub保存phase/detail并向订阅者广播，attachActivityEvents将agent状态、停止、错误、审批等事件归一为粗粒度相位。瀑布事件包装在出错时仍调用next，避免装饰逻辑阻断工具链。客户端在ready后创建同源EventSource，收到相位后从各槽位规则抽取动作/表情；手动互动正在播放时会延迟相位动作而不是抢断。effect清理关闭事件流、停止声音并解除持续动作。该结构能解释状态联动，但相位是粗粒度映射而不是最终任务完成性审计。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-live2d-pet/lib/index.js:1112-1135](https://github.com/A8Chann/dsh-pet-live2d/blob/22443935bc6a47c9476f4eeeca5e67a209ce43f7/dsh-live2d-pet/lib/index.js#L1112-L1135)

Hub持有单个phase/detail及订阅集合。

<details>
<summary>查看原文（24行）</summary>

```text
export class ActivityHub {
  constructor() {
    this.phase = 'idle'
    this.detail = ''
    this.listeners = new Set()
    this.holdTimer = undefined
  }

  /** Current snapshot (sent as the first frame of every stream). */
  snapshot() {
    return { phase: this.phase, detail: this.detail, at: Date.now() }
  }

  /** Subscribe one SSE response; returns the unsubscribe function. */
  subscribe(listener) {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  set(phase, detail = '') {
    if (this.phase === phase && this.detail === detail) return
    this.phase = phase
    this.detail = detail
    this.emit()
```

</details>

**依据 2 · 源码核查**：[dsh-live2d-pet/lib/index.js:1197-1236](https://github.com/A8Chann/dsh-pet-live2d/blob/22443935bc6a47c9476f4eeeca5e67a209ce43f7/dsh-live2d-pet/lib/index.js#L1197-L1236)

宿主事件映射和瀑布续链。

<details>
<summary>查看原文（40行）</summary>

```text
export function attachActivityEvents(ctx, hub) {
  const on = (event, handler) => {
    try {
      ctx.on(event, handler)
    } catch {
      /* host without this event */
    }
  }
  // Waterfall events only continue if the handler resumes the chain, so a
  // throw here would silently break tool execution for the whole session.
  const onWaterfall = (event, handler) => {
    try {
      ctx.on(event, (...args) => {
        try {
          return handler(...args)
        } catch {
          // Never swallow the chain: hand control straight on.
          const next = args[args.length - 1]
          return typeof next === 'function' ? next() : undefined
        }
      })
    } catch {
      /* host without this event */
    }
  }
  on('agent/status', (payload) => {
    const status = payload?.status
    if (status === 'running') hub.set('thinking', '')
    else if (status === 'idle' && hub.phase !== 'done') hub.set('idle', '')
  })
  on('agent/turn-stopping', () => hub.celebrate())
  on('agent/error', () => hub.set('failed', ''))
  // approval/request is a waterfall event: it MUST resume the chain.
  on('approval/request', (_request, next) => {
    hub.set('waiting', '')
    return typeof next === 'function' ? next() : undefined
  })

  // Tool activity refines the generic 'thinking' phase while a turn runs.
  //
```

</details>

**依据 3 · 源码核查**：[dsh-live2d-pet/lib/client.js:7113-7153](https://github.com/A8Chann/dsh-pet-live2d/blob/22443935bc6a47c9476f4eeeca5e67a209ce43f7/dsh-live2d-pet/lib/client.js#L7113-L7153)

EventSource与相位槽位策略。

<details>
<summary>查看原文（41行）</summary>

```text
    // ---- session activity (#4) -----------------------------------------
    // The host pushes the agent's coarse phase over same-origin SSE; each
    // transition drives a motion + expression so the pet visibly follows what
    // the assistant is doing. EventSource reconnects on its own.
    useEffect(() => {
      if (!ready || typeof window.EventSource === "undefined") return undefined;
      let source;
      try {
        source = new window.EventSource(API + "/events");
      } catch {
        return undefined;
      }
      /**
       * 一个相位的**抽签**：每个槽位在自己的池子里各掷一次，和摸鱼同一套。
       *
       * 用户的原话是"相位跟摸鱼是一样的功能"，所以数据结构和抽法都照搬摸鱼：
       *   - 每个槽位一张条目表，条目有权重；权重 0 / 被删掉的条目不参与；
       *   - 抽中的条目把它自己的表情点亮，并且**先把 `pairs` 一起点亮**；
       *   - `requires` 是"播放的前提"：前提不成立的条目不参与这一轮抽（跳过）。
       *
       * 前提可能要靠**别的槽位这一轮的选择**才成立（挤番茄酱 要 蛋包饭），所以抽到
       * 稳定为止：第一轮把没有前提、或前提已经成立的槽位抽出来，第二轮再看剩下的，
       * 三轮不动就收手。
       */
      const applyPhase = (phase) => {
        // 相位名记在这里（而不是只记在 SSE 回调里）：`effectiveSlotChoice` 靠它判断
        // "会话进行中"，而诊断读口 `phaseNow()` 是直接调这个函数的 —— 分开写的话，
        // 诊断走的相位不会让槽位让位，测出来的行为跟真实路径不一样。
        phaseRef.current = phase;
        const slotById = new Map((pet?.expressionSlots ?? []).map((slot) => [slot.id, slot]));
        const pools = phasePoolsFor(phase);
        // 从**空**开始，而不是继承上一个相位的答案：相位是接管，不是叠加。
        // 每个槽位在抽中之前都还不归相位管，问"现在是什么"就退回用户自己的选择。
        phaseChoicesRef.current = {};
        const chosen = {};
        const optionAt = (slotId, label) =>
          effectiveOption(slotId, slotById.get(slotId)?.options.find((o) => o.label === label));
        // 一个槽位此刻"是什么"：这一轮已经抽中的优先，其次用户自己的选择。
        // 抽空的槽位记成 null —— 那时候不能退回用户的选择（相位说了这里空着）。
        const owns = (slotId) => Object.prototype.hasOwnProperty.call(chosen, slotId);
        const current = (slotId) => (owns(slotId) ? chosen[slotId] : slotSelectionsRef.current[slotId]);
```

</details>

**依据 4 · 源码核查**：[dsh-live2d-pet/lib/client.js:7320-7359](https://github.com/A8Chann/dsh-pet-live2d/blob/22443935bc6a47c9476f4eeeca5e67a209ce43f7/dsh-live2d-pet/lib/client.js#L7320-L7359)

互动优先及清理。

<details>
<summary>查看原文（40行）</summary>

```text
        phaseRef.current = phase;
        // 只提示真正的新相位；首次 SSE 快照和相同相位重发都不响。
        //
        // 还要看"是不是我在显示"：页面与桌面窗口各收一份 SSE，两边都响就是每次响两遍
        // （issue #7）。这里读模块级 `layerStore`，**不能**读本 effect 闭包里的 `layer`
        // —— 依赖只有 [ready, applyExpressions]，闭包里那个 `layer` 是挂载时的旧值，
        // 会让让位永远慢一拍。
        if (!initial && isPhaseSoundOwner(layerStore.value.owner)) playPhaseSound(phase);
        // A phase animation may replace another phase animation, but must never
        // cut off something the user just triggered (tap / fidget / panel).
        const owner = motion.current.kind();
        if (motion.current.isPlaying() && owner !== "phase") {
          // Defer rather than drop: onDeferRedPhase re-applies it once the
          // current animation finishes, so the mirror never goes stale.
          pendingPhase.current = phase;
          return;
        }
        applyPhase(phase);
      };
      // A phase that persists would otherwise be re-applied after every
      // reaction; the ref remembers where we are so refires are no-ops.
      source.addEventListener("message", onMessage);
      return () => {
        source.close();
        stopUploadedSound();
        phaseRef.current = "idle";
        phasePinsRef.current = {};
        phaseSlotsRef.current = [];
        phaseChoicesRef.current = {};
        phaseSweepRef.current = null;
        applySweep();
        commitPinsRef.current();
        // A dropped stream must not leave the pet sustaining a phase forever.
        motion.current.setSustain(null);
        motion.current.setPhaseResolver(null);
      };
    }, [ready, applyExpressions]);

    // ---- idle fidget (#6) ----------------------------------------------
    // After the pet has been left alone for a while it picks one or two SLOT
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 升级保护是否真的覆盖用户修改过的所有素材？

**研究主题**：缺陷与关键质疑

#### 完整回答

最关键限制在“用户改过的一个字都不会动”的范围。安装同步器只对目标pet.json计算指纹，并以该清单是否属于旧随包版本来决定整目录cpSync覆盖；若用户仅改贴图、动作或语音而未改pet.json，当前判据仍可能认定为插件拥有，随后同名资源会被覆盖。代码注释只保证额外新增且随包不存在的文件留存。该静态路径足以指出保护条件不足，但本轮没有执行覆写复现，不能声称实际用户已丢失文件。另有运行时验证仅检查Core体积和关键字符串，并非固定内容摘要验证；CDN内容变化仍影响可复现性。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:86-93](https://github.com/A8Chann/dsh-pet-live2d/blob/22443935bc6a47c9476f4eeeca5e67a209ce43f7/README.md#L86-L93)

作者对用户修改保护和Core校验的表述。

```text
**装完之后会发生什么：**

1. **宠物随包自带**。插件包里就带着那只鲸鱼娘，第一次运行时宿主半区把它复制进 `%DSH_HOME%\pets\`，
   重启 `dsh web` 就能看见。只在目标**不存在**时复制，或者内容与随包分发的那份**逐字节相同**时才同步升级 ——
   你自己改过的那份**一个字都不会动**。
2. **Cubism Core 不用手动装**。`live2dcubismcore.min.js` 是 Live2D 株式会社的专有运行时，不能随插件分发；
   插件第一次用到它时去 [Live2D 官方 CDN](https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js)
   取一份（校验过再发出去），缓存到 `%DSH_HOME%\pets\.runtime\`，之后离线也能用。
```

**依据 2 · 源码核查**：[dsh-live2d-pet/lib/index.js:712-747](https://github.com/A8Chann/dsh-pet-live2d/blob/22443935bc6a47c9476f4eeeca5e67a209ce43f7/dsh-live2d-pet/lib/index.js#L712-L747)

只散列manifest并整目录覆盖的具体路径。

<details>
<summary>查看原文（36行）</summary>

```text

      if (!existsSync(target)) {
        mkdirSync(dirname(target), { recursive: true })
        cpSync(source, target, { recursive: true })
        record[name] = { version, hash: sha256(readFileSync(targetManifest)) }
        dirty = true
        continue
      }

      const synced = record[name]
      const same = existsSync(targetManifest) ? sha256(readFileSync(targetManifest)) : undefined
      const ours = (synced !== undefined && synced.hash === same)
        || isPristineBundledManifest(name, targetManifest, fingerprints)
      if (!ours) {
        // 用户自己改过：不动它。**要说出来** —— 沉默地不升级，用户看到的是
        // "插件更新了但没有任何变化"，比报错更难查。
        if (compareVersions(version, readJson(targetManifest)?.version) > 0) {
          notes.push(name + '：宠物目录里这份被改过，跳过更新（随包版本 ' + version
            + '，本地 ' + String(readJson(targetManifest)?.version ?? '?') + '）')
        }
        continue
      }
      // **升级与否只看内容**，不看版本号：版本号是宠物自己声明的，随包那份在同一个
      // 版本号下改过（补默认值就是这么发生的），只比版本号会让这次修订永远发不出去。
      // 反过来，"版本相同 + 内容相同"在这里就短路了，不会做无谓的整份重写。
      const bundledHash = sha256(readFileSync(manifestPath))
      if (same === bundledHash) continue

      // cpSync 是逐文件覆盖 —— 用户额外放进去的文件（自己的贴图、备注）不在随包
      // 那份里，所以留得住。
      // 「原先」那个版本号要**在覆盖之前**读：覆盖之后再读只会读到新的，日志就成了
      // "更新到 1.1.0（原先 1.1.0）"（第一次跑就写成了这样）。
      const was = String(readJson(targetManifest)?.version ?? '?')
      cpSync(source, target, { recursive: true })
      record[name] = { version, hash: bundledHash }
      dirty = true
```

</details>

**依据 3 · 源码核查**：[dsh-live2d-pet/lib/index.js:994-1008](https://github.com/A8Chann/dsh-pet-live2d/blob/22443935bc6a47c9476f4eeeca5e67a209ce43f7/dsh-live2d-pet/lib/index.js#L994-L1008)

Core校验条件是长度与特征字符串。

<details>
<summary>查看原文（15行）</summary>

```text
async function fetchCoreFromCdn(response, cachePath) {
  try {
    const upstream = await fetch(CORE_CDN, { redirect: 'follow' })
    if (!upstream.ok) throw new Error('HTTP ' + upstream.status)
    const bytes = Buffer.from(await upstream.arrayBuffer())
    // 拿回来的必须真是一份 JS：否则多半是被网关/登录页替换了。
    if (bytes.length < 10000 || !bytes.includes('Live2DCubismCore')) {
      throw new Error('unexpected payload: ' + bytes.length + ' bytes')
    }
    try {
      mkdirSync(dirname(cachePath), { recursive: true })
      writeFileSync(cachePath, bytes)
    } catch {
      /* 缓存写不进去不影响这一次：直接把它发出去 */
    }
```

</details>

#### 缺口

- 未运行仅改贴图后的升级复现
  **影响**：缺少实际覆盖结果但采用前需备份
  **进一步探讨**：在临时宠物副本只改贴图并升级，比较全部资源哈希确认覆盖范围

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续与恢复负担由哪些条件决定？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

网页端需要兼容DSH、支持WebGL的浏览器、模型资源和Live2D专有Core。Core首次从官方CDN拉取并缓存，缓存不可写仍可服务本次请求但后续可能再拉；内容合法性与模型素材许可需要分别看，MIT插件代码不代表所有模型和运行时均同许可。资源路由限制loopback，故远程浏览器可达性不能直接类推。持续负担是WebGL渲染、声音、事件同步和素材存储；实际GPU/内存、网络首载和调参时间均未知。自定义素材升级前应备份整个宠物目录，不只备份清单。桌面Tauri外壳是额外平台/窗口生命周期边界，本项未覆盖其全部实现，不能把网页检查扩展成桌面验收。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:53-56](https://github.com/A8Chann/dsh-pet-live2d/blob/22443935bc6a47c9476f4eeeca5e67a209ce43f7/README.md#L53-L56)

作者单列桌面平台验证边界。

```text
> 另有**桌面端**（[`dsh-live2d-pet-desktop/`](dsh-live2d-pet-desktop/README.md)，Tauri 壳）：
> 把同一份宠物代码放进**透明置顶窗口**、逐像素穿透到壁纸。Windows x64 的单文件 exe
> 随插件包分发（装完在设置里选「桌面」）；macOS（Apple Silicon）的构建由 CI 产出，
> **尚未在真机验证** —— 平台支持与已知限制见它的 README。
```

**依据 2 · 作者声明**：[README.md:86-100](https://github.com/A8Chann/dsh-pet-live2d/blob/22443935bc6a47c9476f4eeeca5e67a209ce43f7/README.md#L86-L100)

首次资源和运行依赖。

<details>
<summary>查看原文（15行）</summary>

```text
**装完之后会发生什么：**

1. **宠物随包自带**。插件包里就带着那只鲸鱼娘，第一次运行时宿主半区把它复制进 `%DSH_HOME%\pets\`，
   重启 `dsh web` 就能看见。只在目标**不存在**时复制，或者内容与随包分发的那份**逐字节相同**时才同步升级 ——
   你自己改过的那份**一个字都不会动**。
2. **Cubism Core 不用手动装**。`live2dcubismcore.min.js` 是 Live2D 株式会社的专有运行时，不能随插件分发；
   插件第一次用到它时去 [Live2D 官方 CDN](https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js)
   取一份（校验过再发出去），缓存到 `%DSH_HOME%\pets\.runtime\`，之后离线也能用。
3. **重启 `dsh web`**。bundle 不做热重载，重启之后她就站在那儿了。

| 项目 | 要求 |
|---|---|
| DSH | `>= 0.1.5-rc.1`，装在 `web` profile 上 |
| 浏览器 | 支持 WebGL 的现代浏览器（无头 Edge / Chrome 也跑得动，见回归测试） |
| 操作系统 | 跟着 DSH 走：Windows / macOS / Linux 是同一套 Web 端代码 |
```

</details>

**依据 3 · 源码核查**：[dsh-live2d-pet/lib/index.js:927-940](https://github.com/A8Chann/dsh-pet-live2d/blob/22443935bc6a47c9476f4eeeca5e67a209ce43f7/dsh-live2d-pet/lib/index.js#L927-L940)

素材路由loopback检查。

<details>
<summary>查看原文（14行）</summary>

```text
/** The model reference-closure route (GET /api/live2d-pet/asset/<id>/<path>). */
function assetRoute() {
  return {
    kind: 'prefix',
    path: API + '/asset',
    handler: (request, response) => {
      if (!loopbackOnly(request)) {
        response.writeHead(403)
        response.end()
        return
      }
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        response.writeHead(405)
        response.end()
```

</details>

**依据 4 · 源码核查**：[dsh-live2d-pet/lib/index.js:994-1024](https://github.com/A8Chann/dsh-pet-live2d/blob/22443935bc6a47c9476f4eeeca5e67a209ce43f7/dsh-live2d-pet/lib/index.js#L994-L1024)

Core缓存及失败路径。

<details>
<summary>查看原文（31行）</summary>

```text
async function fetchCoreFromCdn(response, cachePath) {
  try {
    const upstream = await fetch(CORE_CDN, { redirect: 'follow' })
    if (!upstream.ok) throw new Error('HTTP ' + upstream.status)
    const bytes = Buffer.from(await upstream.arrayBuffer())
    // 拿回来的必须真是一份 JS：否则多半是被网关/登录页替换了。
    if (bytes.length < 10000 || !bytes.includes('Live2DCubismCore')) {
      throw new Error('unexpected payload: ' + bytes.length + ' bytes')
    }
    try {
      mkdirSync(dirname(cachePath), { recursive: true })
      writeFileSync(cachePath, bytes)
    } catch {
      /* 缓存写不进去不影响这一次：直接把它发出去 */
    }
    response.writeHead(200, {
      'content-type': 'text/javascript; charset=utf-8',
      'content-length': String(bytes.length),
      'cache-control': 'public, max-age=86400',
      'x-live2d-core-source': 'cdn',
    })
    response.end(bytes)
  } catch (error) {
    sendJson(response, 502, {
      ok: false,
      error: 'cubism-core-unavailable',
      detail: String(error?.message ?? error),
      hint: 'Cubism Core 是 Live2D 的专有运行时，本插件不内置。可以让这台机器能访问 '
        + CORE_CDN + '，或自行下载后放到 ' + join(runtimeDir(), 'live2dcubismcore.min.js'),
    })
  }
```

</details>

#### 缺口

- 真实WebGL开销与长会话资源释放未知
  **影响**：不能量化常驻代价或保证低干扰
  **进一步探讨**：在个人隔离profile记录首载/常驻/禁用后的GPU、内存和声音/交互行为

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样借鉴联动机制并控制试用？

**研究主题**：工程质量与复用、新假设与验证、采用判断

#### 完整回答

事件归一与渲染解耦、瀑布事件续链和手动互动优先级值得借鉴，移植需理解宿主事件与动画生命周期，不能只复制模型文件。未验证假设是将素材所有权下沉到逐文件哈希/三方合并，并让冲突显式交给用户，可能同时保留上游更新与个人修改。最小验证构造未改、仅改清单、仅改贴图、用户新增四类目录，比较当前同步与新策略的误覆盖、遗漏更新及人工决策数；若保护增加的冲突超过用户可接受负担或仍误覆盖，则否定。当前建议trial仅个人网页陪伴，先备份全部自定义目录，检查状态是否对应当前会话、透明区穿透、声音和禁用恢复。若状态误导、遮挡或资源负担不可接受则停止；不据动画推出业务效率。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-live2d-pet/lib/index.js:1197-1236](https://github.com/A8Chann/dsh-pet-live2d/blob/22443935bc6a47c9476f4eeeca5e67a209ce43f7/dsh-live2d-pet/lib/index.js#L1197-L1236)

不阻断宿主瀑布的防御设计。

<details>
<summary>查看原文（40行）</summary>

```text
export function attachActivityEvents(ctx, hub) {
  const on = (event, handler) => {
    try {
      ctx.on(event, handler)
    } catch {
      /* host without this event */
    }
  }
  // Waterfall events only continue if the handler resumes the chain, so a
  // throw here would silently break tool execution for the whole session.
  const onWaterfall = (event, handler) => {
    try {
      ctx.on(event, (...args) => {
        try {
          return handler(...args)
        } catch {
          // Never swallow the chain: hand control straight on.
          const next = args[args.length - 1]
          return typeof next === 'function' ? next() : undefined
        }
      })
    } catch {
      /* host without this event */
    }
  }
  on('agent/status', (payload) => {
    const status = payload?.status
    if (status === 'running') hub.set('thinking', '')
    else if (status === 'idle' && hub.phase !== 'done') hub.set('idle', '')
  })
  on('agent/turn-stopping', () => hub.celebrate())
  on('agent/error', () => hub.set('failed', ''))
  // approval/request is a waterfall event: it MUST resume the chain.
  on('approval/request', (_request, next) => {
    hub.set('waiting', '')
    return typeof next === 'function' ? next() : undefined
  })

  // Tool activity refines the generic 'thinking' phase while a turn runs.
  //
```

</details>

**依据 2 · 源码核查**：[dsh-live2d-pet/lib/client.js:7320-7359](https://github.com/A8Chann/dsh-pet-live2d/blob/22443935bc6a47c9476f4eeeca5e67a209ce43f7/dsh-live2d-pet/lib/client.js#L7320-L7359)

互动所有权和cleanup。

<details>
<summary>查看原文（40行）</summary>

```text
        phaseRef.current = phase;
        // 只提示真正的新相位；首次 SSE 快照和相同相位重发都不响。
        //
        // 还要看"是不是我在显示"：页面与桌面窗口各收一份 SSE，两边都响就是每次响两遍
        // （issue #7）。这里读模块级 `layerStore`，**不能**读本 effect 闭包里的 `layer`
        // —— 依赖只有 [ready, applyExpressions]，闭包里那个 `layer` 是挂载时的旧值，
        // 会让让位永远慢一拍。
        if (!initial && isPhaseSoundOwner(layerStore.value.owner)) playPhaseSound(phase);
        // A phase animation may replace another phase animation, but must never
        // cut off something the user just triggered (tap / fidget / panel).
        const owner = motion.current.kind();
        if (motion.current.isPlaying() && owner !== "phase") {
          // Defer rather than drop: onDeferRedPhase re-applies it once the
          // current animation finishes, so the mirror never goes stale.
          pendingPhase.current = phase;
          return;
        }
        applyPhase(phase);
      };
      // A phase that persists would otherwise be re-applied after every
      // reaction; the ref remembers where we are so refires are no-ops.
      source.addEventListener("message", onMessage);
      return () => {
        source.close();
        stopUploadedSound();
        phaseRef.current = "idle";
        phasePinsRef.current = {};
        phaseSlotsRef.current = [];
        phaseChoicesRef.current = {};
        phaseSweepRef.current = null;
        applySweep();
        commitPinsRef.current();
        // A dropped stream must not leave the pet sustaining a phase forever.
        motion.current.setSustain(null);
        motion.current.setPhaseResolver(null);
      };
    }, [ready, applyExpressions]);

    // ---- idle fidget (#6) ----------------------------------------------
    // After the pet has been left alone for a while it picks one or two SLOT
```

</details>

**依据 3 · 源码核查**：[dsh-live2d-pet/lib/index.js:712-747](https://github.com/A8Chann/dsh-pet-live2d/blob/22443935bc6a47c9476f4eeeca5e67a209ce43f7/dsh-live2d-pet/lib/index.js#L712-L747)

逐文件所有权假设的出发点。

<details>
<summary>查看原文（36行）</summary>

```text

      if (!existsSync(target)) {
        mkdirSync(dirname(target), { recursive: true })
        cpSync(source, target, { recursive: true })
        record[name] = { version, hash: sha256(readFileSync(targetManifest)) }
        dirty = true
        continue
      }

      const synced = record[name]
      const same = existsSync(targetManifest) ? sha256(readFileSync(targetManifest)) : undefined
      const ours = (synced !== undefined && synced.hash === same)
        || isPristineBundledManifest(name, targetManifest, fingerprints)
      if (!ours) {
        // 用户自己改过：不动它。**要说出来** —— 沉默地不升级，用户看到的是
        // "插件更新了但没有任何变化"，比报错更难查。
        if (compareVersions(version, readJson(targetManifest)?.version) > 0) {
          notes.push(name + '：宠物目录里这份被改过，跳过更新（随包版本 ' + version
            + '，本地 ' + String(readJson(targetManifest)?.version ?? '?') + '）')
        }
        continue
      }
      // **升级与否只看内容**，不看版本号：版本号是宠物自己声明的，随包那份在同一个
      // 版本号下改过（补默认值就是这么发生的），只比版本号会让这次修订永远发不出去。
      // 反过来，"版本相同 + 内容相同"在这里就短路了，不会做无谓的整份重写。
      const bundledHash = sha256(readFileSync(manifestPath))
      if (same === bundledHash) continue

      // cpSync 是逐文件覆盖 —— 用户额外放进去的文件（自己的贴图、备注）不在随包
      // 那份里，所以留得住。
      // 「原先」那个版本号要**在覆盖之前**读：覆盖之后再读只会读到新的，日志就成了
      // "更新到 1.1.0（原先 1.1.0）"（第一次跑就写成了这样）。
      const was = String(readJson(targetManifest)?.version ?? '?')
      cpSync(source, target, { recursive: true })
      record[name] = { version, hash: bundledHash }
      dirty = true
```

</details>

#### 缺口

- 多窗口/多会话相位归属与逐文件合并收益未验证
  **影响**：限制状态可信度与未来策略结论
  **进一步探讨**：先用两会话交错事件和临时素材矩阵检查，再评估是否扩大使用

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
