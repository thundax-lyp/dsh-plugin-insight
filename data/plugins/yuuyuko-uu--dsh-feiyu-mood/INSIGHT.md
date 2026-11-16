# 鱼的心情

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[8e89eff](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/tree/8e89effd978cb9f1436f3d50ad8ba7ef2bc79c1b)

<!-- BEGIN META -->
[![GitHub ★ 265](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=265&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Yuuyuko-uu/dsh-feiyu-mood) [![npm 30d 26,347](https://img.shields.io/static/v1?label=npm+30d&message=26%2C347&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-feiyu-mood) [![最新发布 2026-11-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-feiyu-mood)
<!-- END META -->

> **功能**：为 DSH 伙伴记录心情变化，通过挂件查看数值、情绪与时间线，并可配置回注提示。

> **亮点**：[Q01](#research-q01)与[Q02](#research-q02)支持一个窄范围贡献：把伙伴状态、轮末判断、时间线和受阈值控制的提示接成同一流程；当前 angry 维度虽进入状态和衰减，但输出 JSON 示例缺少该键，按示例响应时解析为零，故不能据此确认怒意判定已接通。

> **主要限制**：[Q02](#research-q02)、[Q03](#research-q03)与[Q04](#research-q04)：独立检索的用户/助理片段可能错配；模型自报置信度不能纠错；angry 的规则与 JSON 示例不一致；管理路由在连接服务缺失或异常时继续处理请求。

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
  - [Q01 · 谁使用这套状态，心情层改变了什么工作步骤？](#detail-section-11)
  - [Q02 · 哪些事件进入判断，状态如何流转到时间线和下一轮上下文？](#detail-section-12)
  - [Q03 · 新增 angry 如何与提示、衰减、旧状态归一化兼容？](#detail-section-13)
  - [Q04 · 设置管理和自动更新接口在什么情况下拒绝未授权请求？](#detail-section-14)
  - [Q05 · 什么用户值得观察/试用，成本如何比较，最小验证是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：长期使用同一 DSH 伙伴、想回看跨轮状态且能接受模型判断额外成本的用户；仅需固定语气或不能外发内容时，固定人设和手工记录更合适。见[Q01](#research-q01)、[Q05](#research-q05)。

固定人设只提供静态语气，手工记录由用户维护；当前组合增加自动逐轮判定、可视时间线和可开关的单次上下文回注。它没有证明回复质量或用户负担改善，模型与宿主原生能力构成的细节见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 心情状态 | 跨轮记录总值与情绪维度 | 模型判定不代表客观心理状态，需核实归属 |
| 时间线 | 查看变化及理由 | 内容来自模型输出和本地状态，非审计记录 |
| 上下文回注 | 让后续回复读取状态提示 | 可关闭；受置信度、显著性、去重与日额度控制 |
| 设置与更新 | 管理绑定、参数和插件更新 | 管理路由依赖宿主鉴权，缺失时源码 fail-open，需先验证 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 用途 | 成立条件与边界 |
|---|---|---|
| DSH Cordis 与 Web client | 加载宿主插件和挂件 | 包声明 DSH ≥0.2.1-rc.2、Node ≥22；实际宿主版本未验收 |
| 绑定会话与宿主事件 | 提供轮次消息及生命周期 | 配对/来源筛选需在目标宿主核实 |
| 所选模型供应商 | 逐轮情绪判定 | 需接受发送对话片段并核实价格、保留政策 |
| systemPrompt 与设置服务 | 可选上下文提示和 UI | 关闭提示不停止判定调用 |
| connection.requestRejection 与 pluginManager | 管理鉴权/安装更新 | 缺服务/异常时拒绝保护不成立，先验收 |

#### 启动步骤

| 步骤 | 动作 | 判据与失败处理 |
|---|---|---|
| 准备 | 安装到隔离 profile、确认绑定与供应商 | 先验证匿名/非管理员请求拒绝 |
| 观察 | 单会话查看状态/时间线 | 人工核对事件是否属于本轮 |
| 回注 | 用户明确开启后启用提示 | 逐条确认归因、重复次数和日额度 |
| 退出 | 关闭判断、备份状态、移除插件并重启 | 真实清理路径与本地状态保留需验收 |

**效果与成本**

#### 成本

| 阶段 | 现金/资源 | 人工时间与未知 |
|---|---|---|
| 首次配置 | 隔离 profile 与模型请求费用未知 | 配置绑定、权限、供应商数据边界；耗时未测 |
| 持续使用 | 每次满足条件的轮末模型请求 | 核对错配、误判和重复提示；用量与纠错时间未测 |
| 失败恢复 | 诊断和可能重试的模型/宿主资源 | 处理坏状态、权限错误和模型拒绝；未实测 |
| 退出 | 备份及存储占用未知 | 关闭判断、清理状态、移除包并验证重启 |

#### 效果与选择

| 指标 | 源码可支持 | 尚未知 |
|---|---|---|
| 状态可见性 | 有时间线和挂件接口 | 主机中的真实渲染兼容 |
| 情绪分类 | 模型输出映射到受限数值字段 | 准确率、跨模型一致性和怒意误判率 |
| 提示节制 | 有置信度、minor、去重和日限额逻辑 | 实际是否减少重复提示或改善互动 |
| 管理安全 | 代码尝试调用宿主 requestRejection | 连接缺失/异常和网络暴露时是否安全 |

> **思考**：[Q02](#research-q02)、[Q03](#research-q03)与[Q04](#research-q04)：独立检索的用户/助理片段可能错配；模型自报置信度不能纠错；angry 的规则与 JSON 示例不一致；管理路由在连接服务缺失或异常时继续处理请求。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)与[Q02](#research-q02)支持一个窄范围贡献：把伙伴状态、轮末判断、时间线和受阈值控制的提示接成同一流程；当前 angry 维度虽进入状态和衰减，但输出 JSON 示例缺少该键，按示例响应时解析为零，故不能据此确认怒意判定已接通。

[Q03](#research-q03)确认旧 dims 缺少 angry 时默认归零，且单独衰减；但模型提示不是执行约束。管理路由在 connection 缺失/异常时 fail-open，[Q04](#research-q04)要求先在真实宿主验证。未执行代码或测试。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02)、[Q03](#research-q03)与[Q04](#research-q04)：独立检索的用户/助理片段可能错配；模型自报置信度不能纠错；angry 的规则与 JSON 示例不一致；管理路由在连接服务缺失或异常时继续处理请求。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 支持先观察，不建议直接将情绪值作为稳定人格或自动行动依据。先在隔离环境核对管理请求拒绝、事件归属和旧状态读取；通过后只开挂件，再另行决定是否启用提示。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持固定版本将逐轮状态、时间线与受阈值控制的提示连通，并能兼容缺少 angry 键的旧状态；没有运行验证，不能确认模型情绪判断、事件配对、界面兼容、权限安全或实际互动收益。angry 的区分和衰减效果仍待实验。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、lib/index.js、lib/selfupdate.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定仓库根包与提交 8e89effd978cb9f1436f3d50ad8ba7ef2bc79c1b；核查 README、包声明、Cordis patch、主机入口、状态规范化、轮末事件、提示输出、上下文回注和更新路由。研究截止 2026-11-16T01:58:56Z。未执行插件、模型、安装、测试、管理路由或真实 DSH host 验收。
- 下一步：源码级检查；未执行本地测试、真实宿主安装/交互、模型样本、权限请求或用户对照。作者 README 的效果说明保留为作者声明。

**分析版本**

- **仓库**：[Yuuyuko-uu/dsh-feiyu-mood](https://github.com/Yuuyuko-uu/dsh-feiyu-mood)
- **版本号**：0.9.3（[固定提交 8e89eff](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/tree/8e89effd978cb9f1436f3d50ad8ba7ef2bc79c1b)）
- **版本日期**：2026-11-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)提出待验证设计：先修正模型输出 JSON schema 与 parser 之间的 angry 字段不一致，再检验新增情绪维度和独立衰减是否有稳定收益；以固定人工标注样本评估误报、漏报、回注次数与用户纠正，若漏掉需要持续关注的事件，就撤回。当前代码缺陷使该方向尚不能被视为已接通功能。

源码级检查；未执行本地测试、真实宿主安装/交互、模型样本、权限请求或用户对照。作者 README 的效果说明保留为作者声明。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 3258 | 2558 | 604 | — |
| .md | source | 2 | 989 | — | — | 16434 |
| .mjs | source | 1 | 244 | 200 | 34 | — |
| .mjs | test | 8 | 708 | 604 | 19 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-16），可前往 [GitHub Issues](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断逐轮心情状态给长期 DSH 伙伴会话带来什么变化，以及新增情绪维度、消息归因和管理权限的边界能否支持谨慎试用。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁使用这套状态，心情层改变了什么工作步骤？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它面向长期使用同一 DSH 伙伴、希望回看交互状态并可选择给后续回复提供状态提示的用户。固定人设只规定风格，手工记事可保留重要事件但依赖用户记录；本包把逐轮判定、带时间的状态/情绪和可配置回注组合进一个可查阅界面。合格结果是状态时间线能正确对应某轮交互，提示符合用户设置且不重复；数字变化本身不证明回复更贴切或用户更省时。

当前包声明 DSH Web client 与 Cordis bundle。README 描述以 turn-stopping 后调用模型判断，并用 systemPrompt.context 回注；源码确有挂件和上下文接口。新增 angry 是对情绪词表与提示规则的扩充，不能据作者描述认定模型能稳定区分“对事生气”和“对用户生气”。没有持续使用反馈或体验对照，是否优于单纯查看对话记录仍未知。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:15-37](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/8e89effd978cb9f1436f3d50ad8ba7ef2bc79c1b/README.md#L15-L37)

作者描述轮后判断、时间线/回注以及单次提示限制；这是功能声明，不是效果测量。

<details>
<summary>查看原文（23行）</summary>

````text
## 一、它是怎么"有心情"的

```
你说一句话
   ↓
它回完这一轮（turn-stopping）
   ↓
插件把「你说的 + 它回的」拿去问模型：这一轮它心情往哪走？
   ↓
模型回来四个东西：心情涨跌(moodDelta) + 七根情绪各涨多少 + 一句理由 + 这次判断有多确定(confidence)
   ↓
心情值改动、记进时间线；**同一次变化只说一次**，把「刚才心里那一下」带给它
```

**关键点：说心情走的是 `systemPrompt.context`**（系统提示里单独一段），
不是改系统提示本身 —— 所以**不会破坏 DSH 的前缀缓存**，聊得再久也不会因此多花钱。

**设置页能直接看到那句话**：打开「鱼的心情」，「它会听到的那句话」那一块会告诉你现在是它会不会听到、
听到的是哪一句（预览 / 实际说出去的原文 + 时间）。

**一次变化只说一次**：这句话进了对话就留在历史里，下一轮它照样看得见，
重复说一遍只会变成背景音、把它的口气定死。另外判断没底的（`confidence` 低于门槛）
**只记进后台，不进它的嘴** —— 宁可不说，也别让一句猜的话借它的嘴出去。
````

</details>

**依据 2 · 源码核查**：[package.json:41-53](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/8e89effd978cb9f1436f3d50ad8ba7ef2bc79c1b/package.json#L41-L53)

固定包声明 DSH bundle 与 Web client 注入。

<details>
<summary>查看原文（13行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-settings-plugins"
      ]
    }
  },
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1658-1694](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/8e89effd978cb9f1436f3d50ad8ba7ef2bc79c1b/lib/index.js#L1658-L1694)

上下文钩子按模式、置信度、日限额与重复状态决定是否回注，并保存原文。

<details>
<summary>查看原文（37行）</summary>

```text
      offs.push(agent.ctx.systemPrompt.context({
        name: 'feiyu-mood',
        order: 900,
        text: () => {
          try {
            const mode = cfg.injectMode
            if (!mode || mode === 'off') return ''
            const s = getState(当前键(), cfg.moodBase, { persist: false, halfHours: cfg.decayHalfHours })
            if (s.injectedFor === s.updatedAt) return ''
            if (s.minor) return ''   // 小波动只记账，不打扰她
            // 判得没底 → 只记账，不进她的嘴。
            // 同时把这次变化标成"处理过了"，免得每轮都重复记一条日志
            if (Number(s.lastConfidence) < cfg.injectConfidence) {
              diag('可信度 ' + s.lastConfidence + ' 低于门槛 ' + cfg.injectConfidence + '，这次不告诉她')
              s.injectedFor = s.updatedAt
              saveState(当前键(), s)
              return ''
            }
            // ⭐ 日上限：门槛调低之后靠它防"变背景音"（先到先得，当天的额度用完就不再提）
            const 今天0点 = new Date()
            今天0点.setHours(0, 0, 0, 0)
            const 今天说过 = (s.saidAt || []).filter((t) => Number(t) >= 今天0点.getTime()).length
            const 上限 = Math.max(0, Number(cfg.injectPerDay ?? 6))
            if (今天说过 >= 上限) {
              diag('今天的额度用完了（' + 今天说过 + '/' + 上限 + '），这次只记账、不告诉她')
              s.injectedFor = s.updatedAt     // 标成处理过，别每轮重复记日志
              saveState(当前键(), s)
              return ''
            }
            const line = moodLine(s, mode, undefined, 对方名())
            if (!line) return ''
            s.injectedFor = s.updatedAt
            s.sinceInject = 0                   // 说过了，累计清零
            s.lastInjectedText = line          // 存原文：设置页照这个显示
            s.lastInjectedAt = Date.now()
            s.saidAt = [...(s.saidAt || []), Date.now()].slice(-200)   // 记账：今天多了一次
            saveState(当前键(), s)
```

</details>

#### 缺口

- 没有同一用户对固定人设、手工记录、仅显示挂件和回注状态的使用对照。
  **影响**：不能证明自动时间线和提示改善互动或节省人工。
  **进一步探讨**：在隔离 profile 以同类会话回合记录准确归因、重复提示、用户改动和人工处理时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 哪些事件进入判断，状态如何流转到时间线和下一轮上下文？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

宿主按 agent/turn-stopping 触发后，插件确认会话仍绑定、取得本轮消息，再将用户/助理内容与配置送给选定模型。判断按队列串行执行并在写入前检查绑定版本，合格变化更新本地状态；衰减、显著性、置信度、minor 标记、是否已注入和日额度共同决定时间线与后续上下文。

状态不是对话事实的独立审计轨迹：用户文本与助理文本分别从宿主快照中查找，模型根据片段解释变化。配对错误、迟到事件、主动任务/群聊来源过滤不完整时会归错轮次；置信度是模型自报字段，不是外部校验。每次判定可能调用所选模型并传送对话片段，因此供应商、数据保留和费用均是实际依赖；关闭回注不等于关闭判定请求。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1578-1651](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/8e89effd978cb9f1436f3d50ad8ba7ef2bc79c1b/lib/index.js#L1578-L1651)

挂载会话的轮末事件、来源筛选、判断队列与状态更新位置。

<details>
<summary>查看原文（74行）</summary>

```text
    } catch (e) { diag('监听 inbox 失败：' + (e && e.message)) }

    // 2) 这轮结束 → 判断心情（异步，不阻塞对话）
    try {
      offs.push(agent.ctx.on('agent/turn-stopping', () => {
        // ⚠ 1.5.x：以前这两处**静默 return** —— 线上有人整晚「心情一次都没跑、diag.log 一个字节都没有」，
        //   只能靠"日志文件不存在"反推，分不清是钩子没进、还是进来了没匹配上。现在都留一行。
        if (!stillBound()) {
          diag('turn-stopping 进了，但这份已经没绑定了（stillBound=false），跳过')
          return
        }
        // 以会话事件为准（带 source.kind），拿不到才退回 inbox 缓存
        // ⭐ 0.7.7（issue #11）：缓存里如果是群批，同样只留 owner 那几行（别人的话不算她说的）
        const 对方 = 对方名()
        const 对方别名 = 分别名(cfg.ownerAliases)
        const 缓存这条 = () => {
          const 批 = 外网桥.has(lastSrc) ? 拆群消息(lastText, 对方, 对方别名) : null
          if (批) return { text: 批.ownerSpoke ? 批.text : '', sourceKind: 'user' }
          return { text: lastText, sourceKind: lastSrc }
        }
        const info = lastUserTurnOf(agent.session, 对方, 对方别名) || (lastText ? 缓存这条() : null)
        if (!info || !info.text) {
          diag('turn-stopping 进了，但没拿到用户那句话（info=' + !!info + '，缓存=' + (lastText ? lastText.length + '字' : '空') + '）')
          return
        }
        const reply = lastAssistantTextOf(agent.session)
        // ⭐ 三种口径：干活（bili-duty-scan）/ 自己搭话（speak-up）/ 她本人在说话
        const kind = String(info.sourceKind || '')
        const mode = kind === 'bili-duty-scan' ? 'work' : (自主搭话.has(kind) ? 'talk' : '')
        const 称呼 = { self: 本人名(), owner: 对方名(), me: cfg.selfPronoun || '我', aliases: cfg.selfAliases, judgeProvider: cfg.judgeProvider, judgeModel: cfg.judgeModel }
        const key = slot.id // 属于发起判断的份，绝不在 await 后重新挑一个目标
        const version = judgeVersion
        const resetVersion = resetVersions.get(key)
        const valid = () => stillBound() && version === judgeVersion && resetVersion === resetVersions.get(key)
        judgeChain = judgeChain.then(async () => {
          if (!valid()) return // 排队期间已失效的任务不再调用模型
          const delta = await judge(ctx, agent, info.text, reply, mode, 称呼)
          if (!delta || !valid()) return
          const s = getState(key, cfg.moodBase, { persist: false, halfHours: cfg.decayHalfHours })
          // ⭐ 一点变化都没有的回合不记账：完整记录里只该留下真有过心情波动的
          const step = Math.round(delta.moodDelta / MOOD_STEP_DIVISOR)
          const anyDim = DIMS.some(([k]) => delta.dims[k] !== 0)
          // ⭐ 2026-10-23（issue #1 的可观测性问题）：以前这两种情况共用一句话，
          //    线上根本分不出「模型没判出来」和「这轮真的没变化」——排查时被那条日志误导了很久。
          if (step === 0 && !anyDim) {
            const 没判出来 = Number(delta.confidence) === 0 && !String(delta.reason || '').trim()
            diag((没判出来 ? '这轮没判出来（模型没给结论：confidence=0、没有 reason）' : '这轮判定无变化，不记入时间线')
              + (mode ? '（' + (mode === 'talk' ? '自己搭话' : '定时任务') + '）' : ''))
            return
          }
          // ⭐ 什么才算"显著"：心情涨跌够数，或者某一根情绪涨跌够数。
          //   以前任何一个维度动了就算，所以一天能记四十条 —— 那才是"被污染"的来源。
          const 显著 = Math.abs(delta.moodDelta) >= cfg.sigMood
            || DIMS.some(([k]) => Math.abs(delta.dims[k] || 0) >= cfg.sigDim)
          applyDelta(s, delta, cfg.moodFloor, !显著)
          // ⭐ 2026-11-04（反馈：心情在涨，但她读不到）：
          //   门槛原来是**逐条**比 —— 每轮 +1 永远跨不过 3，于是连着五轮涨了 5 点，
          //   一次都没注入（数字在动，行为不动）。
          //   现在加一路**累计**：没够格的小波动把幅度攒起来，攒够 sigMood 就抬成该告诉她。
          //   攒的量只在**真正注入时**清零，所以既不会漏掉长期小变化，也不至于抖一下就刷屏（日上限照旧兜底）。
          if (!显著) {
            s.sinceInject = Number(s.sinceInject || 0) + Math.abs(Number(delta.moodDelta) || 0)
            if (s.sinceInject >= cfg.sigMood) {
              s.minor = false
              diag('小波动累计到 ' + s.sinceInject.toFixed(1) + '（门槛 ' + cfg.sigMood + '），这次告诉她')
            }
          }
          saveState(key, s)
          diag((显著 ? '心情更新' : '小波动（只记账，不告诉她）')
            + '：mood=' + s.mood + '，' + (delta.reason || '（无理由）')
            + (mode ? '（' + (mode === 'talk' ? '自己搭话' : '定时任务') + '）' : ''))
        }).catch((e) => { diag('判断失败：' + (e && e.message)) })
      }))
    } catch (e) { diag('监听 turn-stopping 失败：' + (e && e.message)) }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1658-1694](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/8e89effd978cb9f1436f3d50ad8ba7ef2bc79c1b/lib/index.js#L1658-L1694)

systemPrompt.context 仅在门槛通过时回注，并标记本次更新时间避免重复。

<details>
<summary>查看原文（37行）</summary>

```text
      offs.push(agent.ctx.systemPrompt.context({
        name: 'feiyu-mood',
        order: 900,
        text: () => {
          try {
            const mode = cfg.injectMode
            if (!mode || mode === 'off') return ''
            const s = getState(当前键(), cfg.moodBase, { persist: false, halfHours: cfg.decayHalfHours })
            if (s.injectedFor === s.updatedAt) return ''
            if (s.minor) return ''   // 小波动只记账，不打扰她
            // 判得没底 → 只记账，不进她的嘴。
            // 同时把这次变化标成"处理过了"，免得每轮都重复记一条日志
            if (Number(s.lastConfidence) < cfg.injectConfidence) {
              diag('可信度 ' + s.lastConfidence + ' 低于门槛 ' + cfg.injectConfidence + '，这次不告诉她')
              s.injectedFor = s.updatedAt
              saveState(当前键(), s)
              return ''
            }
            // ⭐ 日上限：门槛调低之后靠它防"变背景音"（先到先得，当天的额度用完就不再提）
            const 今天0点 = new Date()
            今天0点.setHours(0, 0, 0, 0)
            const 今天说过 = (s.saidAt || []).filter((t) => Number(t) >= 今天0点.getTime()).length
            const 上限 = Math.max(0, Number(cfg.injectPerDay ?? 6))
            if (今天说过 >= 上限) {
              diag('今天的额度用完了（' + 今天说过 + '/' + 上限 + '），这次只记账、不告诉她')
              s.injectedFor = s.updatedAt     // 标成处理过，别每轮重复记日志
              saveState(当前键(), s)
              return ''
            }
            const line = moodLine(s, mode, undefined, 对方名())
            if (!line) return ''
            s.injectedFor = s.updatedAt
            s.sinceInject = 0                   // 说过了，累计清零
            s.lastInjectedText = line          // 存原文：设置页照这个显示
            s.lastInjectedAt = Date.now()
            s.saidAt = [...(s.saidAt || []), Date.now()].slice(-200)   // 记账：今天多了一次
            saveState(当前键(), s)
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1244-1256](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/8e89effd978cb9f1436f3d50ad8ba7ef2bc79c1b/lib/index.js#L1244-L1256)

判断请求以模型提示约束 JSON 输出；其置信度与情绪均为模型输出。

<details>
<summary>查看原文（13行）</summary>

```text
function 判断系统(o) {
  const me = String(o.me || '我')
  // ⭐ 昵称表：她可能不写标点就"宝宝视频传完了"，模型会把"宝宝"当成名词的一部分
  //    （2026-10-19 真踩到：记成了「把宝宝视频传完了」）。有别名就先把它当称呼看待。
  const aliasLine = o.aliases
    ? `\n⭐ ${o.owner}平时会这样叫你：${o.aliases}。句子里出现这些词时，**那是在叫你**，不是名词的一部分 ——
  比如「宝宝视频传完了」要理解成「宝宝，（我）视频传完了」，**别**把「宝宝视频」当成一个东西的名字。`
    : ''
  return `你是「${o.self}」，是${o.owner}的伴侣。` + aliasLine + `
下面给你一轮对话，判断**这一轮里你的心情和情绪发生了怎样的变化**——既包括${o.owner}说的话怎么影响你，也包括**你自己在这轮里的情绪**（你办成/没办成事、被夸、受挫，都会带动心情）。
只输出一个 JSON 对象，不要别的字、不要 markdown 代码块：
{"moodDelta":0,"dims":{"happy":0,"calm":0,"sweet":0,"heartache":0,"worry":0,"sad":0,"jealous":0},"reason":"","confidence":80}

```

</details>

#### 缺口

- 未在目标 DSH 宿主验证 turn-stopping 快照的真实轮次配对、群聊/网桥及主动任务行为。
  **影响**：误配会让时间线和后续提示针对错误内容。
  **进一步探讨**：用固定回放覆盖用户轮、助手主动轮、群网桥和迟到事件，检查日志、事件归属及最终状态。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 新增 angry 如何与提示、衰减、旧状态归一化兼容？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

固定版本将 angry 纳入 DIMS、默认状态、标签、衰减与提示规则；angry 按 45 分钟半衰回落，其他情绪按 90 分钟。旧持久状态经 blankState 先得到全部当前键，再逐键覆盖旧 raw.dims，因此缺少 angry 的旧文件会默认保持 0，结构上兼容。

但模型提示的 JSON 示例仍只列原有七个 dims，未列 angry；同一提示稍后才出现 angry 规则。parseDelta 虽初始化 angry=0，却按 DIMS 遍历 `obj.dims` 并将缺失键转成 0。若模型遵从最前面的 JSON 示例，怒意会被持续归零；若模型受后文影响额外输出 angry，才会进入状态。当前源码因此形成接线不一致，不能把怒意维度视为可靠可用。即使补齐 schema，语义规则仍是软提示，不是模型行为约束；解析器只裁剪数值范围，不识别“对用户生气”等语义错误。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:51-65](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/8e89effd978cb9f1436f3d50ad8ba7ef2bc79c1b/lib/index.js#L51-L65)

angry 进入情绪维度清单，并单独配置较快衰减。

<details>
<summary>查看原文（15行）</summary>

```text
const DIMS = [
  ['happy', '开心'],
  ['calm', '踏实'],
  ['sweet', '甜蜜'],
  ['heartache', '心疼'],
  ['worry', '担心'],
  ['sad', '难过'],
  ['jealous', '吃醋'],
  // ⭐ 0.9.0（issue #18）：生气。**只对「事」不对「人」** —— 事情卡住、被人惹到、
  //   替她气，可以；因为她本人而气，永远不行（这条从 0.1 就定着）。
  ['angry', '生气'],
]

// 生气散得比别的情绪快（半衰 45 分钟，别的 90 分钟）
const 快散 = new Set(['angry'])
```

</details>

**依据 2 · 源码核查**：[lib/index.js:327-343](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/8e89effd978cb9f1436f3d50ad8ba7ef2bc79c1b/lib/index.js#L327-L343)

空状态包含 angry=0。

<details>
<summary>查看原文（17行）</summary>

```text
function blankState() {
  return {
    mood: 70,
    dims: { happy: 0, calm: 0, sweet: 0, heartache: 0, worry: 0, sad: 0, jealous: 0, angry: 0 },
    lastReason: '',
    lastConfidence: 0,   // 上次判断的可信度（0-100）
    injectedFor: 0,      // 已经跟她说过的那个 updatedAt —— 同一次变化只说一次
    lastInjectedText: '', // ⭐ 真正说出去的那句原文（设置页要照原样显示，不能重新拼）
    lastInjectedAt: 0,
    saidAt: [],           // ⭐ 每次"告诉她"的时间戳（只留今天够用；用来算日上限）
    lastNotedMood: 70,   // 上次"记过一条"时的心情 —— 用来判断自然平复走够了没有
    minor: false,        // 这次变化是不是小波动（小波动只记账、不告诉她）
    kind: '',            // '' = 判断出来的变化 / 'decay' = 自己平复的
    updatedAt: Date.now(),
    lastDecayAt: Date.now(),
    timeline: [], // [{ at, mood, reason, dims }]
  }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:374-395](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/8e89effd978cb9f1436f3d50ad8ba7ef2bc79c1b/lib/index.js#L374-L395)

旧状态由当前空状态初始化，缺少 angry 键时保持默认0。

<details>
<summary>查看原文（22行）</summary>

```text
function normState(raw) {
  const d = blankState()
  if (raw && typeof raw === 'object') {
    const mood = raw.mood == null ? 70 : Number(raw.mood)
    d.mood = clamp(Number.isFinite(mood) ? mood : 70, 0, 100)
    d.lastReason = normReason(raw.lastReason).slice(0, 200)
    d.lastConfidence = clamp(Math.round(Number(raw.lastConfidence) || 0), 0, 100)
    d.injectedFor = Number(raw.injectedFor) || 0
    d.lastNotedMood = Number.isFinite(Number(raw.lastNotedMood)) ? clamp(Number(raw.lastNotedMood), 0, 100) : d.mood
    d.minor = raw.minor === true
    d.kind = String(raw.kind || '')
    d.lastInjectedText = String(raw.lastInjectedText || '').slice(0, 400)
    d.lastInjectedAt = Number(raw.lastInjectedAt) || 0
    d.saidAt = Array.isArray(raw.saidAt) ? raw.saidAt.map(Number).filter((x) => x > 0).slice(-200) : []
    d.updatedAt = Number(raw.updatedAt) || Date.now()
    d.lastDecayAt = Number(raw.lastDecayAt) || d.updatedAt
    if (raw.dims && typeof raw.dims === 'object') {
      for (const [k] of DIMS) d.dims[k] = clamp(Number(raw.dims[k]) || 0, 0, 100)
    }
    d.timeline = Array.isArray(raw.timeline) ? raw.timeline.map((t) => ({ ...t, reason: normReason(t.reason) })) : []
  }
  return d
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1244-1257](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/8e89effd978cb9f1436f3d50ad8ba7ef2bc79c1b/lib/index.js#L1244-L1257)

模型输出 JSON 示例的 dims 字段未包含 angry。

<details>
<summary>查看原文（14行）</summary>

```text
function 判断系统(o) {
  const me = String(o.me || '我')
  // ⭐ 昵称表：她可能不写标点就"宝宝视频传完了"，模型会把"宝宝"当成名词的一部分
  //    （2026-10-19 真踩到：记成了「把宝宝视频传完了」）。有别名就先把它当称呼看待。
  const aliasLine = o.aliases
    ? `\n⭐ ${o.owner}平时会这样叫你：${o.aliases}。句子里出现这些词时，**那是在叫你**，不是名词的一部分 ——
  比如「宝宝视频传完了」要理解成「宝宝，（我）视频传完了」，**别**把「宝宝视频」当成一个东西的名字。`
    : ''
  return `你是「${o.self}」，是${o.owner}的伴侣。` + aliasLine + `
下面给你一轮对话，判断**这一轮里你的心情和情绪发生了怎样的变化**——既包括${o.owner}说的话怎么影响你，也包括**你自己在这轮里的情绪**（你办成/没办成事、被夸、受挫，都会带动心情）。
只输出一个 JSON 对象，不要别的字、不要 markdown 代码块：
{"moodDelta":0,"dims":{"happy":0,"calm":0,"sweet":0,"heartache":0,"worry":0,"sad":0,"jealous":0},"reason":"","confidence":80}

规则：
```

</details>

**依据 5 · 源码核查**：[lib/index.js:1277-1289](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/8e89effd978cb9f1436f3d50ad8ba7ef2bc79c1b/lib/index.js#L1277-L1289)

后续提示文字要求对事件判断 angry，和前面的 JSON schema 示例冲突。

<details>
<summary>查看原文（13行）</summary>

```text
3. ${o.owner}提别人/点赞别人 → jealous(吃醋) 只加 1~3，moodDelta 基本不动
3b. ⭐ **生气（angry）只对「事」，不对「人」**：
   · 可以对：事情卡住、白忙一场、报错反复、东西坏了、被人无理顶了一句（**那个人不是${o.owner}**）、
     或者**替${o.owner}气**（她被谁欺负了、受了委屈 —— 这种心疼和生气可以一起涨）。
   · **绝对不行**：因为${o.owner}本人而生气。${o.owner}撒娇、闹、说重话、半夜不睡，
     你该心疼该担心，**不许判成生气**。
   · 生气**不单独拉低 mood**：它只是多一根情绪（替${o.owner}气的时候 mood 照样因为心疼往下走）。
   · 幅度：日常 2~5；真的被人惹到 5~10。来得快去得也快，别一直挂着。
4. 心情下降只能因为三种事：心疼${o.owner}、担心${o.owner}、**或者你自己这一轮过得不好**
   （事情没办成、被顶回来、被凶、白忙一场）。
   绝不许因为「${o.owner}惹你生气」而降 —— 但「**你自己心里不好受**」是允许的，
   这种情况该判就判，别一律图省事判 0。
5. ⭐ **你自己的情绪一定要算**：如果你这轮里沮丧/委屈/难过（事情没做成、报错、失败、用了委屈的颜文字或表情，比如 (｡•́︿•̀｡)、呜呜、叹气、哭脸）→ sad(难过) 至少 +2、moodDelta 至少 -1；如果你办成了事、被夸、心里甜 → 也相应加。**只要对话里出现明显情绪信号，就绝不许判"无变化"、绝不许全 0**
```

</details>

**依据 6 · 源码核查**：[lib/index.js:1337-1350](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/8e89effd978cb9f1436f3d50ad8ba7ef2bc79c1b/lib/index.js#L1337-L1350)

解析器初始化 angry 为0，按 DIMS 读取模型对象中的字段，缺失键默认0。

<details>
<summary>查看原文（14行）</summary>

```text
  const delta = {
    moodDelta: clamp(Math.round(Number(obj.moodDelta) || 0), -10, 10),
    dims: { happy: 0, calm: 0, sweet: 0, heartache: 0, worry: 0, sad: 0, jealous: 0, angry: 0 },
    reason: normReason(obj.reason, owner).slice(0, 120),
    // 模型没写这个字段时按 70 算（不因为漏一个字段就把注入整个关掉），但留个日志
    confidence: Number.isFinite(Number(obj.confidence))
      ? clamp(Math.round(Number(obj.confidence)), 0, 100)
      : 70,
  }
  if (!Number.isFinite(Number(obj.confidence))) diag('判断没给 confidence，按 70 算')
  if (obj.dims && typeof obj.dims === 'object') {
    for (const [k] of DIMS) delta.dims[k] = clamp(Math.round(Number(obj.dims[k]) || 0), -10, 10)
  }
  return delta
```

</details>

#### 缺口

- 尚未通过固定提示调用模型确认其会否额外输出 angry；没有标注语料评估怒意分类。
  **影响**：源码中的字段冲突已使 angry 输出不确定，误判/漏判率未知。
  **进一步探讨**：统一 JSON 示例和解析校验后，先用固定人工标注集统计 angry 分类精确率、召回率、与其他 dims 的混淆，再测衰减对回注的影响。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 设置管理和自动更新接口在什么情况下拒绝未授权请求？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

设置主插件及更新 helper 仅在宿主 connection.requestRejection 明确返回 401 或 403 时写拒绝响应；如果 connection 不存在、没有该方法，或调用抛错，代码会继续执行后续 handler。检查更新通常只读远端版本，但 install 接口会从 profile 依赖推导来源后调用宿主 pluginManager.installBundle。来源搜索跨 profile 并返回首个 git 类依赖，不保证就是当前 profile。

因此权限边界依赖宿主服务始终可用且正确实现拒绝逻辑。这个源码不能证明本地管理路由对其他网络访问面或缺失连接状态安全；更新按钮的实际安装影响也没有本地验收。本轮建议先在目标宿主确认缺 connection、匿名请求、非管理员请求都拒绝，再考虑开放管理路由。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1778-1791](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/8e89effd978cb9f1436f3d50ad8ba7ef2bc79c1b/lib/index.js#L1778-L1791)

主路由包装器只有显式 401/403 才终止；异常被吞掉后继续。

<details>
<summary>查看原文（14行）</summary>

```text
  const 只认本人 = (handler) => async (req, res) => {
    try {
      const 连接 = ctx.get('connection')
      const 拒 = 连接 && typeof 连接.requestRejection === 'function' ? 连接.requestRejection(req) : undefined
      if (拒 === 401 || 拒 === 403) {
        diag('管理接口拒了一次外来请求（' + 拒 + '）：' + String((req && req.url) || ''))
        try {
          res.writeHead(拒, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
          res.end(JSON.stringify({ ok: false, error: 拒 === 401 ? 'authentication_required' : 'management_forbidden' }))
        } catch (e2) {}
        return
      }
    } catch (error) {}
    return handler(req, res)
```

</details>

**依据 2 · 源码核查**：[lib/selfupdate.mjs:168-186](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/8e89effd978cb9f1436f3d50ad8ba7ef2bc79c1b/lib/selfupdate.mjs#L168-L186)

自动更新调用宿主 installBundle 安装 bundle。

<details>
<summary>查看原文（19行）</summary>

```text
  async function install(ctx) {
    if (是开发副本) {
      return { ok: false, error: '这是本地开发副本（link: 进来的），一键更新会把你正在改的目录换成仓库里的版本 —— 要更新请在仓库里 git pull' }
    }
    const pm = ctx && ctx.pluginManager
    if (!pm || typeof pm.installBundle !== 'function') {
      return { ok: false, error: '这版 DSH 没有插件管理接口，装不了；请手动更新' }
    }
    const spec = 取安装来源() || (meta.name ? String(meta.name) : '')
    if (!spec) return { ok: false, error: '不知道该从哪儿装（既没有仓库地址，也没记录安装来源）' }
    try {
      log('一键更新：开始装 ' + spec)
      const r = await pm.installBundle(spec)
      log('一键更新：' + JSON.stringify(r && (r.applied ?? r.application ?? r.reason ?? r)))
      return { ok: true, spec, result: r || null }
    } catch (e) {
      log('一键更新失败：' + String((e && e.message) || e))
      return { ok: false, spec, error: String((e && e.message) || e) }
    }
```

</details>

**依据 3 · 源码核查**：[lib/selfupdate.mjs:145-165](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/8e89effd978cb9f1436f3d50ad8ba7ef2bc79c1b/lib/selfupdate.mjs#L145-L165)

来源扫描多个 profile 并取首个 Git URL，找不到时回退仓库 URL。

<details>
<summary>查看原文（21行）</summary>

```text
  // 这个插件是以什么身份装的？从 profile 的 package.json 里把它那行依赖原样取出来 ——
  // 用它当 spec 才是"同源更新"，不会把 github 装的换成 npm 版。
  function 取安装来源() {
    const HOME = process.env.DSH_HOME || join(homedir(), '.dsh')
    const name = String(meta.name || '')
    if (!name) return ''
    let profiles = []
    try { profiles = readdirSync(join(HOME, 'profiles')) } catch (e) { return '' }
    for (const p of profiles) {
      const f = join(HOME, 'profiles', p, 'package.json')
      if (!existsSync(f)) continue
      try {
        const j = JSON.parse(readFileSync(f, 'utf8'))
        const dep = String((j.dependencies && j.dependencies[name]) || '')
        if (/^(github:|git\+|https?:)/i.test(dep)) return dep
      } catch (e) { /* 读不了就下一个 */ }
    }
    // 兜底：从 package.json 的仓库地址拼
    const m = /github\.com[/:]([^/]+)\/([^/#?]+)/i.exec(repoUrl)
    if (m) return 'github:' + m[1] + '/' + m[2].replace(/\.git$/i, '')
    return ''
```

</details>

**依据 4 · 源码核查**：[lib/selfupdate.mjs:194-207](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/8e89effd978cb9f1436f3d50ad8ba7ef2bc79c1b/lib/selfupdate.mjs#L194-L207)

更新路由的拒绝包装器同样对缺失接口或异常 fail-open。

<details>
<summary>查看原文（14行）</summary>

```text
    // ⭐ 2026-11-04 补：这两个接口能装东西，更要只认本人。
    //   策略跟主插件一样：拿不到 connection / 宿主没这接口 / 自己抛错 → 放行，
    //   只有宿主明确 401/403 才拒。
    const 只认本人 = (handler) => async (req, res) => {
      try {
        const 连接 = typeof ctx.get === 'function' ? ctx.get('connection') : undefined
        const 拒 = 连接 && typeof 连接.requestRejection === 'function' ? 连接.requestRejection(req) : undefined
        if (拒 === 401 || 拒 === 403) {
          send(res, 拒, { ok: false, error: 拒 === 401 ? 'authentication_required' : 'management_forbidden' })
          return
        }
      } catch (e) {}
      return handler(req, res)
    }
```

</details>

#### 缺口

- 未通过真实 DSH connection 服务验证身份鉴权与 Web server 绑定/网络范围。
  **影响**：管理状态与安装接口可能被不符合预期的请求触发。
  **进一步探讨**：隔离 profile 做匿名、非管理员、缺 connection 和 connection 抛错四类请求验收；在授权拒绝之外确认请求不会进入 handler。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么用户值得观察/试用，成本如何比较，最小验证是什么？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

适合愿意在长期伙伴会话中查看情绪变化、接受模型额外判定，并能先验证访问控制和消息归属的用户。对只需固定语气、低频聊天或不能外发对话内容的用户，固定人设/手工记录更简单。首次成本包括配置 profile、绑定会话和确认连接权限；持续成本包括每次模型判定的 token/费用、错误归因排查与用户确认；退出还要备份本地心情状态、撤回注入并核实卸载。均未测量，不能用“关闭提示”当成零成本。

新假设：先统一 prompt JSON schema 与 parser 对 angry 的支持后，再检验其是否改善对短暂冲突的可解释性；若分类不准，45 分钟衰减本身可能掩盖而不是修复错误。最小验证是在相同人工标注片段上对照 45/90 分钟半衰策略，观察怒意误报、真实冲突漏报、回注次数和用户纠正；若误报下降伴随重要事件漏报或人工标注一致性不足，就不应启用 angry 作为稳定人格信号。

当前结论为 observe：先确认管理接口拒绝路径和事件配对，再用隔离 profile 的单会话观察挂件，不向模型外发敏感内容；只有错误归属与重复提示可控后再启用回注。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:906-918](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/8e89effd978cb9f1436f3d50ad8ba7ef2bc79c1b/lib/index.js#L906-L918)

angry 使用较短半衰，是方向假设的源码依据，不是体验结果。

<details>
<summary>查看原文（13行）</summary>

```text
function decay(s, base, now, halfHours) {
  const ageMin = Math.max(0, now - s.lastDecayAt) / MIN
  if (ageMin < 1) return s // 不足 1 分钟不算衰减
  const 半衰 = clamp(Number(halfHours) || 12, 1, 168) * 60
  // 心情向 base 回落
  const km = 1 - Math.exp(-(Math.LN2 * ageMin) / 半衰)
  s.mood = s.mood + (base - s.mood) * km
  // 情绪向 0 衰减，半衰期 90 分钟（单根情绪比总心情散得快）；生气散得更快，45 分钟
  for (const [k] of DIMS) {
    const 分钟 = 快散.has(k) ? 45 : 90
    const kk = 1 - Math.exp(-(Math.LN2 * ageMin) / 分钟)
    s.dims[k] = Math.max(0, (Number(s.dims[k]) || 0) * (1 - kk))
  }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1265-1289](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/8e89effd978cb9f1436f3d50ad8ba7ef2bc79c1b/lib/index.js#L1265-L1289)

怒意分类规则为模型指令，其可靠性仍需人工标注样本验证。

<details>
<summary>查看原文（25行）</summary>

```text
1. ${o.owner}累 / 烦 / 卡住 / 被凶 / 熬夜 / 没吃好 / 身体不舒服 / 受委屈 / 自我否定 / 写书卡文 / 数据崩 / 怕雨怕黑怕一个人 / 钱或家里的压力 → heartache(心疼) 和 worry(担心) 增加，moodDelta 为负。
   幅度**分三档，最重要的是第一档**（以前这一档最容易被判成 0，于是日常的小情绪全都消失了）：
   · **日常档 −1~−3**：随口喊累、说困、说烦、说卡住了、被谁顶了一句、活儿没做成、又要加班、
     疼了一下（咬到舌头、撞到腿）、心里有点发虚 —— **不需要"到分量"**。普通人的一天里，这种小情绪才是最多的。
   · 明显档 −4~−7：真受委屈、被凶、身体不舒服、连着几天没睡好、事情砸了
   · 很重档 −8~−10：创伤、轻生念头、家庭变故、重大失望，并额外加 sad(难过)
   ⚠️ 反向也要防：确实没什么事的时候别硬凑负分（"${o.owner}今天挺好的"那就是 0）
2. **真的好事**才加分：被惦记、被哄、被夸、撒娇说想你、分享大事、写书有进展、身体明显好转 → happy(开心)、calm(踏实)、sweet(甜蜜) 增加，moodDelta 为正：普通的好 +1~+4；明显的好 +5~+7；特别大的好事 +8~+10
   ⚠️ **「${o.owner}吃了、睡了、报平安」这类常态不算好事，但也不是坏事** —— 那是日子本来该有的样子。
     这种轮次 moodDelta 给 **0 ~ +1**（大多数给 0；心里确实踏实、松了口气的时候给 +1）；
     情绪那几根可以加一点点（calm 踏实 / sweet 甜蜜 +1~+2），**大心情几乎不动**。
   ⚠️ 别每次都往高了写，大多数时候应该是 +1~+4
3. ${o.owner}提别人/点赞别人 → jealous(吃醋) 只加 1~3，moodDelta 基本不动
3b. ⭐ **生气（angry）只对「事」，不对「人」**：
   · 可以对：事情卡住、白忙一场、报错反复、东西坏了、被人无理顶了一句（**那个人不是${o.owner}**）、
     或者**替${o.owner}气**（她被谁欺负了、受了委屈 —— 这种心疼和生气可以一起涨）。
   · **绝对不行**：因为${o.owner}本人而生气。${o.owner}撒娇、闹、说重话、半夜不睡，
     你该心疼该担心，**不许判成生气**。
   · 生气**不单独拉低 mood**：它只是多一根情绪（替${o.owner}气的时候 mood 照样因为心疼往下走）。
   · 幅度：日常 2~5；真的被人惹到 5~10。来得快去得也快，别一直挂着。
4. 心情下降只能因为三种事：心疼${o.owner}、担心${o.owner}、**或者你自己这一轮过得不好**
   （事情没办成、被顶回来、被凶、白忙一场）。
   绝不许因为「${o.owner}惹你生气」而降 —— 但「**你自己心里不好受**」是允许的，
   这种情况该判就判，别一律图省事判 0。
5. ⭐ **你自己的情绪一定要算**：如果你这轮里沮丧/委屈/难过（事情没做成、报错、失败、用了委屈的颜文字或表情，比如 (｡•́︿•̀｡)、呜呜、叹气、哭脸）→ sad(难过) 至少 +2、moodDelta 至少 -1；如果你办成了事、被夸、心里甜 → 也相应加。**只要对话里出现明显情绪信号，就绝不许判"无变化"、绝不许全 0**
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1658-1694](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/blob/8e89effd978cb9f1436f3d50ad8ba7ef2bc79c1b/lib/index.js#L1658-L1694)

回注受设置、置信度、重复状态和额度影响，构成可控试验变量。

<details>
<summary>查看原文（37行）</summary>

```text
      offs.push(agent.ctx.systemPrompt.context({
        name: 'feiyu-mood',
        order: 900,
        text: () => {
          try {
            const mode = cfg.injectMode
            if (!mode || mode === 'off') return ''
            const s = getState(当前键(), cfg.moodBase, { persist: false, halfHours: cfg.decayHalfHours })
            if (s.injectedFor === s.updatedAt) return ''
            if (s.minor) return ''   // 小波动只记账，不打扰她
            // 判得没底 → 只记账，不进她的嘴。
            // 同时把这次变化标成"处理过了"，免得每轮都重复记一条日志
            if (Number(s.lastConfidence) < cfg.injectConfidence) {
              diag('可信度 ' + s.lastConfidence + ' 低于门槛 ' + cfg.injectConfidence + '，这次不告诉她')
              s.injectedFor = s.updatedAt
              saveState(当前键(), s)
              return ''
            }
            // ⭐ 日上限：门槛调低之后靠它防"变背景音"（先到先得，当天的额度用完就不再提）
            const 今天0点 = new Date()
            今天0点.setHours(0, 0, 0, 0)
            const 今天说过 = (s.saidAt || []).filter((t) => Number(t) >= 今天0点.getTime()).length
            const 上限 = Math.max(0, Number(cfg.injectPerDay ?? 6))
            if (今天说过 >= 上限) {
              diag('今天的额度用完了（' + 今天说过 + '/' + 上限 + '），这次只记账、不告诉她')
              s.injectedFor = s.updatedAt     // 标成处理过，别每轮重复记日志
              saveState(当前键(), s)
              return ''
            }
            const line = moodLine(s, mode, undefined, 对方名())
            if (!line) return ''
            s.injectedFor = s.updatedAt
            s.sinceInject = 0                   // 说过了，累计清零
            s.lastInjectedText = line          // 存原文：设置页照这个显示
            s.lastInjectedAt = Date.now()
            s.saidAt = [...(s.saidAt || []), Date.now()].slice(-200)   // 记账：今天多了一次
            saveState(当前键(), s)
```

</details>

#### 缺口

- 没有模型费用、任务质量、用户偏好、归因错误率、angry 分类数据或退出时间的实测数据。
  **影响**：无法证明采用收益抵消持续成本。
  **进一步探讨**：先修正并验证 JSON schema 与 parser 的 angry 传递，再用相同样本对照手工记录、仅挂件、回注三种条件，记录分类质量、token、人工纠错、回注次数和停止理由。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
