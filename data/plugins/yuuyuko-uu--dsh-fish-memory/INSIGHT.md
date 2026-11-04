# 鱼的记忆

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[5124cc1](https://github.com/Yuuyuko-uu/dsh-fish-memory/tree/5124cc1fa5a3149e8a68cf1d858e24b5bf2a2eea)

<!-- BEGIN META -->
[![GitHub ★ 464](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=464&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Yuuyuko-uu/dsh-fish-memory) [![npm 30d 13,720](https://img.shields.io/static/v1?label=npm+30d&message=13%2C720&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-fish-memory) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-fish-memory)
<!-- END META -->

> **功能**：为 DSH 会话保存带时间的长期记忆，并按相关性和鲜活度召回到上下文。

> **亮点**：[Q02](#research-q02)把相关性门槛与衰减排序分开，事实和事件分别分配名额；[Q03](#research-q03)用删除优先与代际检查限制异步旧结果复活。相对手工档案增加可审阅的检索和维护机制，但收益未做同条件对照。

> **主要限制**：[Q02](#research-q02)确认低信息查询可在常驻事实层之前早退，重要事实不是无条件每轮注入；[Q03](#research-q03)确认后台扩词会调用模型，管理接口遇到鉴权缺失或异常还会放行。长期约束、费用和部署安全均须据实际条件收窄。

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
  - [Q01 · 记忆属于谁，如何从写入进入当前提示，和手工短档案相比改变什么？](#detail-section-11)
  - [Q02 · 长期事实是否每轮出现，衰减和召回阈值实际保证什么？](#detail-section-12)
  - [Q03 · 删除、跨会话合并及异步扩词会不会恢复旧数据，维护成本由谁承担？](#detail-section-13)
  - [Q04 · 什么任务可以尝试，如何验收、停止和退出？](#detail-section-14)
  - [Q05 · 从遗漏与可解释轨迹能推导什么改进，怎样被证伪？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向持续使用 DSH 对话的个人用户，保存约定和事件，并在后续提问时带入相关内容。合格结果仍以事实正确和可纠正为准，见[Q01](#research-q01)。

参照是用户维护并带入的短档案；本组件提供自动检索和轨迹，不能凭自动化推导更高任务质量。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| remember 写入 | 保存带时间的事实或事件 | 会话启用且未达每日配额，模型自行决定调用 |
| 相关性检索 | 挑选当前提问相关事件 | queryGate、阈值和词项质量影响召回 |
| 稳定事实层 | 优先带入少量长期约定 | 仍在查询门之后，受条数和预算约束 |
| 工作区归库与合并 | 在同工作区会话复用记忆 | 主动扩大共享范围，旧库保留 |
| 管理与轨迹 | 核查、纠正、删除及查看选择原因 | 鉴权依赖宿主拒绝信号，不是独立隔离边界 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH 提示、工具和 Agent 服务 | 启动必需 | 注册记忆写入和上下文 | 对应链路不能成立，声明版本不等于已验收 |
| 本地可写目录与词表 | 保存和检索必需 | 文件库及词项筛选 | 写入报错或召回受影响，需检查具体原因 |
| 宿主模型 | 整理和自动扩词时必需 | 生成检索词 | 可关闭 autoExpand；现有请求费用未知 |
| connection 鉴权服务 | 共享部署必须核实 | 限制管理请求 | 当前异常和缺失会放行，不能当独立安全保证 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份并隔离非敏感样本，确认鉴权 | 未授权管理请求被拒，否则停止 |
| 加载 | 用户按 bundle 方式加载并启用测试会话 | remember 与注入入口出现，不以无报错代替检查 |
| 执行 | 记录事实和事件，先关闭后台扩词 | 写盘、归库与轨迹一致，异常回到短档案 |
| 验收 | 用户对比注入和回答，再测删除及模式切换 | 旧事实不被消费，额外调用可解释 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地存储、宿主资源，金额未知 | 配置会话、鉴权、样本和备份，耗时未知 | 不读取真实隐私库 |
| 持续使用 | 注入 token 与可选模型整理请求，费用未知 | 核对事实、归库和轨迹 | 复用 key 不等于无费用 |
| 失败恢复与退出 | 备份、日志、旧库占用未知 | 核对删除、合并与实际副本 | 卸载不等于清空所有副本 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 记忆进入提示 | 有注册、检索和渲染路径 | 当前宿主实际接入和最终答案正确性 |
| 旧结果保护 | 墓碑、代际和原子单文件替换 | 跨进程交错是否丢失 |
| 工作区复用 | 归库键与试算合并实现 | 真实共享场景的错误率与总负担 |

> **思考**：[Q02](#research-q02)确认低信息查询可在常驻事实层之前早退，重要事实不是无条件每轮注入；[Q03](#research-q03)确认后台扩词会调用模型，管理接口遇到鉴权缺失或异常还会放行。长期约束、费用和部署安全均须据实际条件收窄。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02)把相关性门槛与衰减排序分开，事实和事件分别分配名额；[Q03](#research-q03)用删除优先与代际检查限制异步旧结果复活。相对手工档案增加可审阅的检索和维护机制，但收益未做同条件对照。

[Q03](#research-q03)的纯合并模块、删除优先、代际检查和单文件原子替换值得借鉴，移植时须保留错误传播与状态所有权。它不提供跨进程事务；管理鉴权异常放行是部署限制，不能因存在包装函数而视为安全已成立。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02)确认低信息查询可在常驻事实层之前早退，重要事实不是无条件每轮注入；[Q03](#research-q03)确认后台扩词会调用模型，管理接口遇到鉴权缺失或异常还会放行。长期约束、费用和部署安全均须据实际条件收窄。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04)建议先观察；只在已确认鉴权的隔离本机环境使用非敏感样本检查，必要事实遗漏、旧内容污染或请求越权时停用并恢复人工短档案。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

现有写入、检索与恢复设计有源码支持；实际效果及宿主兼容未验证。采用结论为观察，新的约束层只是未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、lib/index.js、lib/atomic-file.mjs、lib/store-merge.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根组件；重点检查写入、归库、召回、注入、异步扩词、保存/删除恢复与管理鉴权，未审计全部客户端和导入细节。旧 findings 的场景、机制、范围、分发、依赖、成本、采用、效果、工程及三项综合均据当前材料重新核对。
- 下一步：后续在隔离目录和宿主中验证短问遗漏、错误事实纠正、后台请求用量、鉴权失败与交错写入；本轮未执行。

**分析版本**

- **仓库**：[Yuuyuko-uu/dsh-fish-memory](https://github.com/Yuuyuko-uu/dsh-fish-memory)
- **版本号**：1.5.2（[固定提交 5124cc1](https://github.com/Yuuyuko-uu/dsh-fish-memory/tree/5124cc1fa5a3149e8a68cf1d858e24b5bf2a2eea)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)提出未验证的用户确认加到期约束层，在事件查询门之外控制固定预算。与现有实现和人工短档案比较遗漏、过期污染、token 与维护时间；没有改善或维护更重即停止。

后续在隔离目录和宿主中验证短问遗漏、错误事实纠正、后台请求用量、鉴权失败与交错写入；本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 1594 | — | — | 22462 |
| .mjs | source | 4 | 450 | 354 | 79 | — |
| .js | source | 3 | 11768 | 9092 | 2423 | — |
| .mjs | test | 7 | 1485 | 1326 | 41 | — |
| .md | test | 1 | 25 | — | — | 240 |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/Yuuyuko-uu/dsh-fish-memory/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 17](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=17&color=737b86&logo=github)](https://github.com/Yuuyuko-uu/dsh-fish-memory/issues?q=is%3Aissue+created%3A2026-10-05T02%3A13%3A37.357Z..2026-11-04T02%3A13%3A37.357Z) [![近30天关闭 15](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=15&color=737b86&logo=github)](https://github.com/Yuuyuko-uu/dsh-fish-memory/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T02%3A13%3A37.357Z..2026-11-04T02%3A13%3A37.357Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本能否在控制过期事实、共享范围和额外调用的前提下，为长期 DSH 对话提供可审阅记忆？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 记忆属于谁，如何从写入进入当前提示，和手工短档案相比改变什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

面向在 DSH 内持续交谈、希望跨压缩保留约定和事件的个人用户，合格结果是正确事实进入需要它的回答且错误可纠正。默认按会话保存，也可以按工作区归库；工作区模式让同一工作区的新会话复用库，属于用户主动扩大共享范围，不构成租户隔离。原办法是用户维护短档案并逐次带入提示。这里增加了 remember 工具写入、词项相关性检索、时间和重要度排序以及设置页的可见轨迹，减少手工选择上下文的步骤，但事实选择和最终答案是否正确仍须判断。

包声明 bundle patch，patch 插入 memory，主文件注册 remember；工具拿执行会话 ID，检查会话开关及每日配额，保存后返回。Agent 的 systemPrompt.context 再读取当前用户文本，短输入借最近几句补线索，检索后将结果作为关闭模板插值的纯文本注入。这里跟通了工具到文件、文件到提示的路径，不能据此声称宿主已加载成功。模型自行决定是否调用工具，所以“自己挑重点”不是对每轮都进行可靠事实抽取的保证。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:20-46](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/5124cc1fa5a3149e8a68cf1d858e24b5bf2a2eea/package.json#L20-L46)

main、exports 与 bundle 声明定位真实插件入口。

<details>
<summary>查看原文（27行）</summary>

```text
    "url": "git+https://github.com/Yuuyuko-uu/dsh-fish-memory.git"
  },
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "cordis.patch.yml",
    "README.md"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "slots"
      ],
      "external": [
        "react"
      ]
    }
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:1-3](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/5124cc1fa5a3149e8a68cf1d858e24b5bf2a2eea/cordis.patch.yml#L1-L3)

patch 将 memory 接入 DSH。

```text
- insert:
    - id: memory
      name: dsh-fish-memory
```

**依据 3 · 源码核查**：[lib/index.js:409-415](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/5124cc1fa5a3149e8a68cf1d858e24b5bf2a2eea/lib/index.js#L409-L415)

按会话或工作区选择归库键。

```text
export function 库名(sid, 配置) {
  // ⚠ 不在这里读全局配置 —— 调用方把「模式」传进来。
  //   自己读配置会让这个函数没法单测（而且 storePath 在模块加载早期就会被调用）。
  const 模式 = String((配置 && 配置.模式) || 'session')
  if (模式 !== 'workspace') return String(sid)
  const ws = 会话的工作区(sid)
  return ws ? 'ws_' + ws : String(sid)
```

**依据 4 · 源码核查**：[lib/index.js:3615-3640](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/5124cc1fa5a3149e8a68cf1d858e24b5bf2a2eea/lib/index.js#L3615-L3640)

工具检查会话、启用状态、内容和配额。

<details>
<summary>查看原文（26行）</summary>

```text
    async execute(args, exec) {
      const sid = sessionIdFromExec(exec)
      if (!sid) {
        diag('remember：拿不到会话 id（exec 的字段：' + (exec ? Object.keys(exec).join(',') : 'null') + '）')
        return { ok: false, message: '没记住（拿不到会话）' }
      }
      // 这个会话没开记忆 → 不记（关掉就是真的不想用）✓
      if (!isEnabled(sid)) {
        diag('remember：' + sid + ' 没开记忆，跳过')
        return { ok: false, message: '这个会话的记忆是关着的，先到设置里打开' }
      }
      const 原始 = String((args && args.text) || '').trim()
      // ⭐ 机械保证：她自己写成「小明」也换成「我」✓
      const text = normalizeOwner(normalizePerson(原始, selfNameOf(sid)), sid)
      if (!text) return { ok: false, message: '没记住（内容是空的）' }
      if (text !== 原始) diag('remember：人称换过了 →「' + text + '」')

      const data = loadStore(sid)
      const policy = data.policy
      const now = Date.now()

      // 配额（每天最多几条，先宽松）
      const today = dayKey(now)
      const todayCount = data.memories.filter((m) => m.createdAt && dayKey(Date.parse(m.createdAt)) === today).length
      if (todayCount >= policy.dailyQuota) {
        return { ok: false, message: '今天记满了（' + policy.dailyQuota + ' 条），明天再说。' }
```

</details>

**依据 5 · 源码核查**：[lib/index.js:4277-4296](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/5124cc1fa5a3149e8a68cf1d858e24b5bf2a2eea/lib/index.js#L4277-L4296)

提示上下文的实际注册、纯文本设置与查询构造。

<details>
<summary>查看原文（20行）</summary>

```text
    const 注入缓存 = { 键: '', 时: 0, 文: '' }
    const 注入off = agent.ctx.systemPrompt.context({
      name: 'memory',
      order: 900, // 排在沙箱/审批/子代理那几条（110/115/120）后面
      // ⭐ 1.3.5：**这段是纯文本，不许被当提示词模板解析**。
      //   宿主的 context / section 默认会做变量替换：`{{time}}` 这种会被当成变量名，
      //   查不到就抛 `unknown prompt variable` —— 记忆里只要存了一句带双花括号的话
      //   （代码片段、模板、日志都可能有），整间会话每一轮都直接失败，用户只能关插件。
      //   `interpolate: false` 是宿主自己给的开关（dsh-tools / working-directory 都在用）。
      interpolate: false,
      text: () => {
        try {
          const now = Date.now()
          // ⭐ 1.4.0：**这一轮真正的那句优先**（会话里最后一条 user 消息）；
          //   监听那句只在会话读不出来时兜底 —— 见 选查询词() 上面的说明。
          let query = 清掉注入上下文(选查询词(lastUserTextOf(agent.session), lastText))
          // ⭐ 1.4.2：一两个字的句子（「推」「在吗」）单独去搜什么都搜不到 —— 借上文一起搜
          try {
            if (query.trim().length < 6) query = 补线索(query, 最近几句(agent.session, 3))
          } catch (error) {}
```

</details>

**依据 6 · 源码核查**：[lib/index.js:4370-4388](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/5124cc1fa5a3149e8a68cf1d858e24b5bf2a2eea/lib/index.js#L4370-L4388)

保存轨迹、渲染注入；异常返回空文本，不能把无报错视为记忆正常。

<details>
<summary>查看原文（19行）</summary>

```text
          if (同一次) data.traces[data.traces.length - 1] = 这条
          else data.traces.push(这条)
          // Trace persistence is auxiliary: an I/O failure must not hide a valid
          // snapshot already read from disk. saveStore records the failure.
          try { saveStore(sid, data) } catch (error) {}
          const 注入文本 = render(selected, now, selfNameOf(sid))
          // ⭐ 2026-10-22 她要能看见「这一轮到底注入了什么」：
          //    搬到官方桌面端之后界面上看不到了，那就写进 diag.log，一眼能翻。
          //    只记一行、截断 400 字，不占空间。
          try {
            diag('注入 ' + selected.length + ' 条：' + (注入文本 || '（空）').split(String.fromCharCode(10)).join(' ⏎ ').slice(0, 400))
          } catch (error) {}
          // ⭐ 1.5.2：记下这次的答案，同一次请求后面那几遍直接用
          注入缓存.键 = 缓存键
          注入缓存.时 = now
          注入缓存.文 = 注入文本
          return 注入文本
        } catch (error) {
          return '' // 记忆坏了也不能影响对话
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 长期事实是否每轮出现，衰减和召回阈值实际保证什么？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

长期事实并非无条件每轮进入提示。recall 先排除被取代和跳过条目，再计算问句信息量；低于 queryGate 时直接返回空集合，发生在常驻事实挑选之前。通过问句门后，事实才按重要度和创建时间取 factsMax 条，默认 2，不占事件名额。空查询、空库及调用异常也不注入。README 的“长期事实每轮都在”因而必须收窄为通过上述前置条件后至多带入部分事实，不能用于必须始终携带的硬约束。

事件先用词项稀有度形成相关性 C，以 C 过阈值，鲜活度和重要度进入排序 P；这把“是否相关”和“够不够新”拆开，防止仅因时间衰减全部掉出门槛。没候选时仍可能从达到阈值 75% 的条目补一条，因此阈值不是严格的最低注入相关性保证。去重后分配事实和事件名额，再受字数预算约束；首条可以超过 maxChars，故它也不是严格总字符上限。trace 中的 assembled 表示被装入，后续词重合只能猜测被消费，不能证明回答理解正确。源码注释中的精确率和用户案例属于作者记录，未作为本次复现结果。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:18-25](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/5124cc1fa5a3149e8a68cf1d858e24b5bf2a2eea/README.md#L18-L25)

作者对淡忘、事实常驻及可见性的主张。

```text
| **会淡忘** | 每条记忆有「鲜活度」，越久越淡。半衰期默认 30 天 —— 不删，只是越来越难被想起来 |
| **自己挑重点** | 不是每句话都记。它按轮次判断哪句值得留下，每天还有配额，防止把上下文塞满 |
| **想起来靠证据** | 你问什么，它按「命中的词够不够特别」找，再按鲜活度、重要度、情绪排序，最多注入几条。分词用的是一份通用中文词表，所以「车」不会撞进「车站」里 |
| **要记一辈子的不淡** | 画像、喜好、约定这种标成「长期事实」，平着放着，不会过期 |
| **长期事实每轮都在** | 它们按「重要度 → 时间」固定带前几条，**不看这句话问了什么**，也不占「最多注入几条」的位置 —— 剩下那几个位置才留给事件 |
| **带时间** | 每条都记着「这是什么时候的事」。跨年了会写「去年 09-17」 |
| **能导入旧档案** | 以前写过的 markdown / 纯文本档案，扫一遍出候选，你挑完它再改写成记忆 |
| **全都看得见** | 记了什么、哪条被想起来了、为什么没被想起来、删掉的都还在 |
```

**依据 2 · 源码核查**：[lib/index.js:3256-3265](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/5124cc1fa5a3149e8a68cf1d858e24b5bf2a2eea/lib/index.js#L3256-L3265)

问句门早退发生在事实层之前。

<details>
<summary>查看原文（10行）</summary>

```text
  const 门槛 = typeof policy.queryGate === 'number' ? policy.queryGate : 0.8
  let gate = null
  if (门槛 > 0 && sid) {
    const v = 问句信息量(sid, query, df)
    if (v < 门槛) {
      // 这道门挡下来的时候**不做 851 次打分**，省一趟；理由照样记进 trace 给她看 ✓
      return { selected: [], scored: [], 字数: 0, gate: { 信息量: Number(v.toFixed(2)), 门槛 } }
    }
    gate = { 信息量: Number(v.toFixed(2)), 门槛 }
  }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:3314-3346](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/5124cc1fa5a3149e8a68cf1d858e24b5bf2a2eea/lib/index.js#L3314-L3346)

C 门槛、P 排序和近阈值补一条的具体逻辑。

<details>
<summary>查看原文（33行）</summary>

```text
  const scored = memories.map((m) => ({ m, s: evaluate(m, query, now, policy, 尺) }))

  const picked = []
  for (const row of scored) {
    if (row.s.C <= 0) row.omission = 'hard_gate'
    // ⭐⭐ 2026-09-21 改：门槛卡的是 **C（证据）**，不再是 P（总分）✓
    //   为什么必须分开：P = C × 乘数，而乘数里有鲜活度 A。
    //   以前门槛卡 P，于是「鲜活度」一动，**门槛跟着动** ——
    //   851 条里 833 条没时间戳，把它们的鲜活度一起压低 = 整个库的分数整体下移
    //   → 连着「该想起的」一起被挡掉（实测：0.75 就掉到 8/11，0 掉到 5/11）✗
    //   而且它们本来就拿同一个值，压低**不改变它们之间的排序**，纯粹白损失。
    //   分开之后：门槛只管「这条记忆跟这句话到底有没有真关系」（C），
    //   鲜活度/重要度/情绪**只参与排序**（下面的 sort 用 P）→
    //   那个「没写时间的算多鲜活」的旋钮就能安全地调了 ✓
    else if (row.s.C < policy.threshold) row.omission = 'below_threshold'
    else picked.push(row)
  }
  picked.sort((a, b) => b.s.P - a.s.P)
  // ⭐ 1.4.3：「差一点够上」的别直接扔 —— 门槛 0.30 时 C=0.288 这种只差 0.012，
  //   扔掉就变成「一条都没挑中」。现在整轮一条都没挑中时，从「够到门槛 75%」的里面补一条分最高的。
  //   （只补一条，而且标记成「差一点」，设置页能看出它是被放宽拿进来的。）
  if (!picked.length) {
    let 差点 = null
    for (const row of scored) {
      if (row.omission !== 'below_threshold') continue
      if (!(row.s.C >= policy.threshold * 0.75)) continue
      if (!差点 || row.s.P > 差点.s.P) 差点 = row
    }
    if (差点) {
      差点.omission = ''
      差点.差一点 = true
      picked.push(差点)
    }
```

</details>

**依据 4 · 源码核查**：[lib/index.js:3418-3459](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/5124cc1fa5a3149e8a68cf1d858e24b5bf2a2eea/lib/index.js#L3418-L3459)

常驻事实、独立名额和字数预算的实际条件。

<details>
<summary>查看原文（42行）</summary>

```text
  const 事实上限 =
    typeof policy.factsMax === 'number' && policy.factsMax >= 0 ? Math.floor(policy.factsMax) : 2
  const 常驻事实 = []
  if (事实上限 > 0) {
    const 候选 = memories
      .filter((m) => m && m.category === 'stable_profile')
      .slice()
      .sort(
        (a, b) =>
          (Number(b.importance) || 0) - (Number(a.importance) || 0) ||
          (Date.parse(b.createdAt || b.at || 0) || 0) - (Date.parse(a.createdAt || a.at || 0) || 0),
      )
    const 行表 = new Map()
    for (const row of scored) if (row && row.m) 行表.set(String(row.m.id), row)
    for (const m of 候选.slice(0, 事实上限)) {
      const row = 行表.get(String(m.id)) || { m, s: { P: 1, C: 1, timeHit: 1 } }
      row.omission = null // 常驻的不算「被筛掉」
      row.常驻 = true
      常驻事实.push(row)
    }
  }
  // 普通事件：从去重后的候选里按分数拿，受 maxItems 和「这趟上限」两条约束
  const 事件们 = 去重后.map((x) => x.row).filter((row) => !row.m || row.m.category !== 'stable_profile')
  const 最高事件分 = 事件们.length && 事件们[0].s ? 事件们[0].s.C : 0
  const 事件本趟上限 = 事件们.length ? 分档.find(([线]) => 最高事件分 >= 线)[1] : 0
  const 事件名额 = Math.min(事件本趟上限, policy.maxItems)
  const 条数内 = 常驻事实.concat(事件们.slice(0, 事件名额))
  for (const row of 事件们.slice(事件名额)) {
    if (!row.omission) row.omission = 'weak' // 设置页上会写「这趟给的条数到顶了」
  }

  const 上限 = typeof policy.maxChars === 'number' && policy.maxChars > 0 ? policy.maxChars : 800
  const selected = []
  let 已用 = 0
  for (const row of 条数内) {
    const n = String(row.m.text || '').length
    if (selected.length > 0 && 已用 + n > 上限) {
      row.omission = 'budget'
      continue
    }
    selected.push(row)
    已用 += n
```

</details>

**依据 5 · 源码核查**：[lib/index.js:3476-3484](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/5124cc1fa5a3149e8a68cf1d858e24b5bf2a2eea/lib/index.js#L3476-L3484)

消费判断仅是词项重合启发式。

```text
// 「她的回复里像不像真的用上了这条记忆」—— 靠实词重合**猜**的，不是事实 ✓
// 所以设置页上写「像是用上了」，不写成「用上了」。
function 用上了(reply, memText) {
  const keys = [...tokenize(memText)]
  if (keys.length < 2) return false
  const b = normalize(reply)
  let hit = 0
  for (const k of keys) if (b.includes(k)) hit++
  return hit >= 2 && hit / keys.length >= 1 / 3
```

#### 缺口

- 不同会话、短续问和事实数量下的遗漏率与错误事实污染未知。
  **影响**：不能把可解释检索机制当成长期约束可靠性或效果提升。
  **进一步探讨**：用人工标注的短问、无关问和纠错问，对比手工短档案，分别核对实际注入和最终答案。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 删除、跨会话合并及异步扩词会不会恢复旧数据，维护成本由谁承担？

**研究主题**：依赖、兼容与流程、工程质量与复用、效果与总成本、缺陷与关键质疑

#### 完整回答

写入前重新读盘、按 ID 合并、删除墓碑优先及 purgeEpoch 共同限制旧异步任务覆盖新记忆。自动扩词等待模型后重读库，代际已变就丢弃结果，并只更新仍存在的目标 ID；彻底清理以 raw 写入换代，旧快照不应复活已清内容。atomic-file 使用同目录临时文件、排他创建、同步文件和 rename，避免半份 JSON 覆盖在线文件。这些是有针对性的恢复设计，仍不是对两个进程同时“读旧值、分别替换”的跨进程事务保证。

扩词默认可由 remember 保存后后台触发；读取提示时也有尝试补词的路径。它调用现有宿主模型，复用 key 不能推导为没有额外请求或费用。autoExpand=false 能停止该后台扩词分支。需要 DSH 的提示、工具、Agent、Web 等服务和本地可写目录；词表和模型是不同用途依赖，缺模型不等于所有已存记忆都不可检索。

工作区合并先试算再执行，旧会话库保留以便退出；删除只是进入 deleted，彻底销毁前还会另存副本，日常有 .bak 和按日备份，诊断日志也记入片段。因此用户要承担核对过期事实、控制共享范围和清理实际副本的工作。另一个关键部署边界是管理接口只在宿主明确返回 401/403 时拒绝；connection 缺失或抛错会放行。不能把注释“只认本人”当成独立鉴权保证，也不能仅凭源码断言特定部署已被外部利用。共享或公开网络部署需先确认宿主鉴权链路，否则本轮建议观察。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:597-665](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/5124cc1fa5a3149e8a68cf1d858e24b5bf2a2eea/lib/index.js#L597-L665)

保存时重读、损坏保护、代际检查、合并及原子替换。

<details>
<summary>查看原文（69行）</summary>

```text
function saveStore(sid, data, 选项) {
  try {
    const path = storePath(sid)
    let bytes, 盘 = null, recoveryEpoch
    try {
      bytes = readFileSync(path)
    } catch (error) {
      // I/O 失败不等于 JSON 损坏；不能备份不明内容或覆盖原件。
      if (error?.code !== 'ENOENT') throw new Error('无法读取当前记忆库，本次未写入', { cause: error })
      corruptIncidents.delete(path)
    }
    if (bytes !== undefined) {
      try {
        盘 = JSON.parse(bytes.toString('utf8'))
        corruptIncidents.delete(path)
      } catch (error) {
        if (!(error instanceof SyntaxError)) throw error
        const incident = corruptIncidents.get(path)
        if (incident && !incident.bytes.equals(bytes)) corruptIncidents.delete(path)
        const corrupt = corruptSnapshots.get(data)
        if (!corrupt || corrupt.incident !== corruptIncidents.get(path) ||
            corrupt.path !== path || !corrupt.bytes.equals(bytes) || corrupt.epoch !== purgeEpochOf(data)) {
          throw new Error('记忆库已损坏或内容已变化，本次旧任务未写入，请重新运行')
        }
        // 精确保留坏文件原件，撞名不覆盖；备份失败则不进入原子写入。
        backupCorruptStore(path)
        recoveryEpoch = corrupt.epoch
      }
    }
    const epoch = recoveryEpoch ?? purgeEpochOf(盘)
    // 清掉墓碑后，按 id 合并无法分辨新增与旧快照；先拒绝整批过期写入。
    if (purgeEpochOf(data) !== epoch) {
      const error = new Error('记忆库已彻底清理，本次旧任务未写入，请重新运行')
      error.code = 'MEMORY_PURGED'
      throw error
    }
    mkdirSync(STORE_DIR, { recursive: true })
    if (!Array.isArray(data.deleted)) data.deleted = []
    if (!Array.isArray(data.traces)) data.traces = []
    // ⭐ 2026-10-24：**写之前先把盘上的读回来合并**，不许拿旧快照整份盖
    //   （详见 合并库 上面那段：自动扩词等模型那几秒里新记的记忆，就是这么丢的）
    //   raw = 真销毁（清空已删 / 彻底删一条），那时**不许**把盘上的捡回来
    if (!(选项 && 选项.raw)) {
      if (盘 && Array.isArray(盘.memories)) data = 合并库(盘, data, 选项)
    }
    // ⭐ 1.4.4：合并会把盘上的旧 trace 捡回来，所以**这里也得清一遍**
    //   （只在加载时清没用：下一次保存又原样回来了）。
    if (Array.isArray(data.traces) && data.traces.length) {
      data.traces = data.traces.filter((t) => {
        const q = typeof (t && t.query) === 'string' ? t.query : ''
        if (!q) return true
        return !明显是机器写的(清掉注入上下文(q))
      })
    }
    // 与内容一起原子发布；其他实例后续读取时也能识别旧代际（并非跨进程事务）。
    // 先构造待写副本；写失败时保留恢复候选的原代际，允许同对象安全重试。
    data = { ...data, purgeEpoch: 选项 && 选项.raw ? randomUUID() : epoch }
    if (data.traces.length > 100) data.traces = data.traces.slice(-100)
    // 记忆变了才备份（只写 trace 的时候不备，不然一天几百份）
    const sig = memSig(data.memories)
    if (lastSig.get(String(sid)) !== sig) {
      backupStore(sid)
    }
    writeFileAtomicSync(storePath(sid), JSON.stringify(data, null, 2))
    corruptIncidents.delete(path)
    lastSig.set(String(sid), sig)
  } catch (error) {
    diag('记忆写入失败：' + String(error && error.code || 'write-error'))
    throw error
```

</details>

**依据 2 · 源码核查**：[lib/atomic-file.mjs:4-24](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/5124cc1fa5a3149e8a68cf1d858e24b5bf2a2eea/lib/atomic-file.mjs#L4-L24)

临时文件与 fsync/rename 的单文件保证。

<details>
<summary>查看原文（21行）</summary>

```text
// Same-directory staging keeps a failed or interrupted write away from the live
// JSON file. This is one-file replacement, not a multi-process transaction.
export function writeFileAtomicSync(target, text) {
  const staged = target + '.' + randomUUID() + '.tmp'
  let mode = 0o600
  try { mode = fs.statSync(target).mode & 0o777 }
  catch (error) { if (error.code !== 'ENOENT') throw error }
  let descriptor
  let created = false
  let committed = false
  try {
    descriptor = fs.openSync(staged, 'wx', mode)
    created = true
    if (process.platform !== 'win32') fs.fchmodSync(descriptor, mode)
    fs.writeFileSync(descriptor, text, 'utf8')
    fs.fsyncSync(descriptor)
    fs.closeSync(descriptor)
    descriptor = undefined
    fs.renameSync(staged, target)
    committed = true
  } finally {
```

</details>

**依据 3 · 源码核查**：[lib/store-merge.mjs:10-24](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/5124cc1fa5a3149e8a68cf1d858e24b5bf2a2eea/lib/store-merge.mjs#L10-L24)

删除优先，显式 restoreIds 才能找回。

<details>
<summary>查看原文（15行）</summary>

```text
  const 写记 = new Map((写.memories || []).map((m) => [String(m.id), m]))
  const 合记 = new Map((盘.memories || []).map((m) => [String(m.id), m]))
  for (const [id, m] of 写记) {
    const 旧 = 合记.get(id)
    合记.set(id, !旧 || 更新时间(m) >= 更新时间(旧) ? m : 旧)
  }
  const 删们 = new Map((盘.deleted || []).map((m) => [String(m.id), m]))
  for (const m of 写.deleted || []) 删们.set(String(m.id), m)
  // 内存里仍有一条，不等于用户要求找回。只有同步找回入口显式列出的 id 能撤销删除。
  const 找回 = Array.isArray(选项?.restoreIds) ? 选项.restoreIds : []
  for (const value of 找回) {
    const id = String(value)
    if (写记.has(id)) 删们.delete(id)
  }
  const memories = [...合记.values()].filter((m) => !删们.has(String(m.id)))
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1661-1702](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/5124cc1fa5a3149e8a68cf1d858e24b5bf2a2eea/lib/index.js#L1661-L1702)

自动扩词调用模型、等待后重读、代际检查和错误处理。

<details>
<summary>查看原文（42行）</summary>

```text
async function 自动扩词(ctx, sid, 上限 = 2) {
  try {
    if (!sid) return 0
    const data = loadStore(sid)
    if (!data || !Array.isArray(data.memories)) return 0
    if (data.policy && data.policy.autoExpand === false) return 0
    const 要扩 = data.memories.filter((m) => !Array.isArray(m.related) || !m.related.length).slice(0, Math.max(1, 上限))
    if (!要扩.length) return 0
    const agent = (ctx.agents && typeof ctx.agents.get === 'function' ? ctx.agents.get(sid) : null)
      || ((ctx.agents && typeof ctx.agents.list === 'function' ? ctx.agents.list() : []) || [])[0]
    if (!agent) { diag('自动扩词：' + sid + ' 这会儿没有活着的 agent，跳过'); return 0 }
    const 输入 = 要扩.map((m, k) => k + 1 + '|' + String(m.text || '')).join('\n')
    const t0 = Date.now()
    const r = await 问模型(ctx, agent, 扩词系统_v2, 输入, 6000)
    if (!r || !r.ok) { diag('自动扩词：模型没回（' + ((r && r.message) || '?') + '）'); return 0 }
    const 表 = 解析扩词(r.text, 要扩.length)
    // ⚠⚠ 2026-10-24 修（用户报「记忆静默丢失」的**真凶**就在这几行）：
    //   原来是拿 await **之前**的快照 `data` 整份写回 —— 等模型那几秒里
    //   别人新记的记忆会被这一句直接盖掉（时间线证据：记完第 2 条 9 秒后被吞）。
    //   → 现在等完**重新读一遍**，按 id 找到那几条再改。
    const 目标ids = 要扩.map((m) => String(m.id))
    const 新库 = loadStore(sid)
    if (purgeEpochOf(data) !== purgeEpochOf(新库)) {
      diag('自动扩词：记忆库已彻底清理，丢弃旧结果')
      return 0
    }
    let 改了 = 0
    for (const k of Object.keys(表)) {
      const id = 目标ids[Number(k)]
      if (!id || !Array.isArray(表[Number(k)])) continue
      const m = (新库.memories || []).find((x) => String(x.id) === id)
      if (!m) continue // 这中间它被删了 / 被合了 → 跳过，别硬写
      m.related = 表[Number(k)]
      m.relatedAt = new Date().toISOString()
      改了++
    }
    if (改了) saveStore(sid, 新库)
    diag('自动扩词：' + sid + ' 补了 ' + 改了 + '/' + 要扩.length + ' 条（' + (Date.now() - t0) + 'ms，' + (r.provider || '?') + '/' + (r.model || '?') + '）')
    return 改了
  } catch (error) {
    diag('自动扩词出错（已忽略）：' + ((error && error.message) || error))
    return 0
```

</details>

**依据 5 · 源码核查**：[lib/index.js:3758-3766](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/5124cc1fa5a3149e8a68cf1d858e24b5bf2a2eea/lib/index.js#L3758-L3766)

remember 写入后后台触发扩词。

```text
      saveStore(sid, data)
      diag('remember：' + sid + ' 记了「' + text.slice(0, 40) + '」' + (键 ? '（事实键 ' + 键 + '）' : '') + '（今天第 ' + (todayCount + 1) + ' 条）')
      // ⭐ 自动补「检索词」：以前得她去设置页点「开始扩词」，现在记完就顺手补上
      //    ⚠️ 不 await（模型调用要几秒，不能卡住记账）；但**必须 .catch** ——
      //      裸的 rejected promise 会被 Node 当致命错误，整个宿主退出（今天早上刚踩过）
      try {
        Promise.resolve()
          .then(() => 自动扩词(ctx, sid, 2))
          .catch((error) => diag('自动扩词失败：' + ((error && error.message) || error)))
```

**依据 6 · 源码核查**：[lib/index.js:561-580](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/5124cc1fa5a3149e8a68cf1d858e24b5bf2a2eea/lib/index.js#L561-L580)

日常 .bak 和按日备份的保留。

<details>
<summary>查看原文（20行）</summary>

```text
function backupStore(sid) {
  try {
    const src = storePath(sid)
    if (!existsSync(src)) return
    // ① 上一版（永远只有一份，最近一次改动前）
    try {
      copyFileSync(src, src + '.bak')
    } catch (error) {}
    // ② 每天一份（存当天最早的那一版）
    const dir = join(BACKUP_DIR, todayKey())
    mkdirSync(dir, { recursive: true })
    const dst = join(dir, basename(src))
    if (!existsSync(dst)) copyFileSync(src, dst)
    // ③ 只留最近 14 天
    const days = readdirSync(BACKUP_DIR).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort()
    for (const d of days.slice(0, Math.max(0, days.length - 14))) {
      try {
        rmSync(join(BACKUP_DIR, d), { recursive: true, force: true })
      } catch (error) {}
    }
```

</details>

**依据 7 · 源码核查**：[lib/index.js:4675-4690](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/5124cc1fa5a3149e8a68cf1d858e24b5bf2a2eea/lib/index.js#L4675-L4690)

管理接口依赖宿主拒绝信号，未知和异常放行。

<details>
<summary>查看原文（16行）</summary>

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
      } catch (error) {
        // 鉴权这条路自己坏了 → 放行，绝不让设置页打不开
      }
      return handler(req, res)
```

</details>

**依据 8 · 源码核查**：[lib/index.js:4907-4942](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/5124cc1fa5a3149e8a68cf1d858e24b5bf2a2eea/lib/index.js#L4907-L4942)

合并先试算，执行保留旧库。

<details>
<summary>查看原文（36行）</summary>

```text
        // 试算：每个工作区报一下「几间会话 / 共几条 / 去重后几条」
        if (试算) {
          const 报告 = []
          for (const [ws, 库们] of 堆) {
            const r = 合并工作区记忆(库们)
            报告.push({
              工作区: ws,
              叫什么: 工作区可读名(ws).slice(0, 60),
              会话数: 库们.length,
              合计: r.合计,
              去重: r.去重,
              并完: r.记忆.length,
              明细: r.明细.map((x) => ({ 会话: x.会话.slice(0, 22) + '…', 原有: x.原有多少, 新加: x.新加, 重复: x.重复 })),
            })
          }
          return 回({
            ok: true, 试算: true, 报告,
            排除了归档: 被排除的.length,
            排除条数: 被排除的.reduce((a, x) => a + x.条数, 0),
          })
        }

        // 执行：每个工作区并一份写进工作区库；旧库**留着不删**（想退回按会话还能用）
        const 做了 = []
        for (const [ws, 库们] of 堆) {
          const r = 合并工作区记忆(库们)
          const 库名们 = 'ws_' + ws
          const 旧 = loadStore(库名们)
          const 原有 = Array.isArray(旧.memories) ? 旧.memories : []
          const 见过 = new Set(原有.map((m) => String((m && m.text) || '').trim()).filter(Boolean))
          const 新 = r.记忆.filter((m) => !见过.has(String(m.text || '').trim()))
          // 执行前先把工作区库备份一份
          try { backupStore(库名们) } catch (error) {}
          旧.memories = [...原有, ...新]
          saveStore(库名们, 旧)
          做了.push({ 工作区: ws, 并进去: 新.length, 原来就有: 原有.length, 会话数: 库们.length })
```

</details>

#### 缺口

- 真实部署中 connection.requestRejection 对这些路由如何生效未核实。
  **影响**：管理接口不能按独立安全边界采用，尤其影响共享或公网部署。
  **进一步探讨**：在隔离宿主中检查未登录、跨来源和鉴权服务故障的响应；任何不当写入应阻止部署。
- 跨进程同时写入及整体存储量的运行表现未测。
  **影响**：不能承诺多个宿主实例共享目录时无丢失。
  **进一步探讨**：以独立临时目录交错两个写入者，核对新增、删除和换代结果，避免直接用真实记忆。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么任务可以尝试，如何验收、停止和退出？

**研究主题**：采用判断、效果与总成本

#### 完整回答

当前结论是观察。长期个人对话的记忆维护任务清楚，检索与写入链路有源码支撑，但“事实每轮在”和“无额外调用”的宽泛说法不成立，管理路由还依赖可能放行的宿主鉴权。已有关键机制材料足以形成明确研究结论，尚不足以建议把真实隐私档案交给该版本持续使用。

后续可在仅本机、已确认鉴权且独立测试目录中放入少量非敏感样本：两条稳定约定、若干带绝对日期的事件、一条被替代的事实和一条已删除项。测试长问、短续问、无关问及新会话；逐项对照磁盘、注入轨迹和最终答案。先关闭自动扩词以建立不调用整理模型的基线，再单独核对开启后的请求数、成本和召回差异。合格标准是身份和归库正确，旧事实不再消费，后台结果不复活删除，管理请求确实受限。

如必要事实反复缺失、过期内容被当现在事实、未授权请求能改记忆或额外调用超预期，应停用并回到用户可审阅短档案。切回会话模式不会自动迁回或删除工作区库，卸载也不能当成所有副本清除；退出前分别确认原库、合并库、备份及日志。现金、耗时和单位合格任务成本均无本次实测值，不能写成免费、低成本或已节省时间。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:7-10](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/5124cc1fa5a3149e8a68cf1d858e24b5bf2a2eea/package.json#L7-L10)

声明 Node 和 DSH 范围，范围声明不是兼容验收。

```text
  "engines": {
    "node": ">=22",
    "dsh": ">=0.2.1-rc.2"
  },
```

**依据 2 · 作者声明**：[README.md:29-45](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/5124cc1fa5a3149e8a68cf1d858e24b5bf2a2eea/README.md#L29-L45)

作者说复用模型并给出旧版本实测对照，不能等同当前版本验收。

<details>
<summary>查看原文（17行）</summary>

```text
## 需要什么

- **DSH**（DeepSeek Harness），带 Web 界面
- **一个能用的模型** —— 它借用你 DSH 里正在用的那个，**不用另外配 key、不额外花钱**

> 「提炼」和「扩词」这两步会调用模型（走你现有的）。不点它们就不会调用。

---

## 适配哪个 DSH 版本（不用操心）

这个插件**跟着 DSH 一起更新**：作者这边跑的就是最新版的 DSH，**最新版插件永远是给最新版 DSH 写的**。

所以看到「不适配 / 不支持」之类的提示，基本都是**装到了旧版本** —— 升级到最新版、重启一次 DSH 就好。
真遇到新版对不上（比如 DSH 刚升级、插件还没跟上），提个 issue，作者会跟着改。

当前实测对照：插件 **1.3.1** ↔ DSH **0.2.1-rc.3**（2026-10-26）
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1664-1675](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/5124cc1fa5a3149e8a68cf1d858e24b5bf2a2eea/lib/index.js#L1664-L1675)

明确 autoExpand 开关及实际模型调用。

<details>
<summary>查看原文（12行）</summary>

```text
    const data = loadStore(sid)
    if (!data || !Array.isArray(data.memories)) return 0
    if (data.policy && data.policy.autoExpand === false) return 0
    const 要扩 = data.memories.filter((m) => !Array.isArray(m.related) || !m.related.length).slice(0, Math.max(1, 上限))
    if (!要扩.length) return 0
    const agent = (ctx.agents && typeof ctx.agents.get === 'function' ? ctx.agents.get(sid) : null)
      || ((ctx.agents && typeof ctx.agents.list === 'function' ? ctx.agents.list() : []) || [])[0]
    if (!agent) { diag('自动扩词：' + sid + ' 这会儿没有活着的 agent，跳过'); return 0 }
    const 输入 = 要扩.map((m, k) => k + 1 + '|' + String(m.text || '')).join('\n')
    const t0 = Date.now()
    const r = await 问模型(ctx, agent, 扩词系统_v2, 输入, 6000)
    if (!r || !r.ok) { diag('自动扩词：模型没回（' + ((r && r.message) || '?') + '）'); return 0 }
```

</details>

**依据 4 · 源码核查**：[lib/index.js:4830-4859](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/5124cc1fa5a3149e8a68cf1d858e24b5bf2a2eea/lib/index.js#L4830-L4859)

模式切换保留原库，并不执行数据迁移。

<details>
<summary>查看原文（30行）</summary>

```text
    //   ⚠ 切换本身**不搬动**记忆（此后读写的库换了，旧库还在原处）。
    //   要把同一个工作区里几间会话的记忆并成一份，用下面的 /merge-workspace。
    mroute('/dsh-fish-memory/mode', async (req, res) => {
      const 回 = (o) => {
        res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' })
        res.end(JSON.stringify(o))
      }
      // ⚠ 1.4.7：这条路由以前**不分 GET / POST** —— 谁打进来都往下走，没请求体时
      //   `b.模式` 是空串、被判成 'session'，然后**把配置写回 session**。
      //   于是：切到「按工作区」之后，只要外面读一次状态（GET，没有 body），
      //   就被悄悄掰回「按会话」，界面看着就是「点了没反应 / 按钮一直灰」。
      //   现在只有 POST 才改；GET 只报当前值，不写盘。
      if (String(req.method || '').toUpperCase() !== 'POST') {
        let 当前 = 'session'
        try { 当前 = String(loadCfg().模式 || '') === 'workspace' ? 'workspace' : 'session' } catch (error) {}
        回({ ok: true, 模式: 当前 })
        return
      }
      let body = ''
      for await (const chunk of req) body += chunk
      let b = {}
      try { b = JSON.parse(body || '{}') } catch (error) {}
      const 模式 = String(b.模式 || '') === 'workspace' ? 'workspace' : 'session'
      try {
        const c = loadCfg()
        c.模式 = 模式
        saveCfg(c)
        diag('记忆归类模式 → ' + 模式)
      } catch (error) {}
      回({ ok: true, 模式 })
```

</details>

**依据 5 · 源码核查**：[lib/index.js:5604-5621](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/5124cc1fa5a3149e8a68cf1d858e24b5bf2a2eea/lib/index.js#L5604-L5621)

彻底清理仍有销毁前另存副本。

<details>
<summary>查看原文（18行）</summary>

```text
        } else if (action === 'purge') {
          const n = data.deleted.length
          data.deleted = data.deleted.filter((m) => String(m.id) !== id)
          if (data.deleted.length !== n) {
            saveStore(sid, data, { raw: true }) // 真销毁：不许合并把盘上的捡回来
            diag('彻底清掉一条：' + sid + ' / ' + id)
            out = { ok: true, message: '彻底清掉了' }
          }
        } else if (action === 'purgeall') {
          const n = data.deleted.length
          // ⚠⚠ 2026-09-23：**真销毁** —— 动之前另存一份带时间戳的（见 销毁前另存 的说明）✓
          if (n > 0) {
            销毁前另存(sid)
            data.deleted = []
            saveStore(sid, data, { raw: true }) // 真销毁：不许合并把盘上的捡回来
          }
          diag('清空已删掉的：' + sid + '（' + n + ' 条）')
          out = { ok: true, message: n ? '清掉了 ' + n + ' 条（清空前的整份另存在「销毁前」里）' : '没有要清掉的' }
```

</details>

#### 缺口

- 没有同条件合格任务对照及真实用户负担数据。
  **影响**：无法确认额外检索和整理成本能被节省的人工覆盖。
  **进一步探讨**：记录同批任务的合格率、人工纠错分钟数、总模型请求和 token，包含失败重试。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 从遗漏与可解释轨迹能推导什么改进，怎样被证伪？

**研究主题**：新假设与验证

#### 完整回答

待验证假设是把用户明确确认且有到期条件的硬约束层放在事件 queryGate 之前，并在注入轨迹显示本轮未带入的原因。它不同于当前按重要度取少量 stable_profile 的实现：当前常驻层仍被问句门阻断，亦没有本题设想的确认、有效期和冲突确认契约。推导依据是长期约定可能在短续问时缺失，而把所有长期事实强塞每轮又会固化过时内容。

最小验证可在隔离会话里比较三组相同事实和任务：现有机制、人工短档案、用户确认且到期的固定预算层；保持模型与提示预算一致。观察短问的必要约束遗漏、过期事实使用、冲突纠正、每轮 token 与人工维护时间。只有约束遗漏减少且过期错误、预算与维护负担没有不可接受增长，才支持继续设计；若人工短档案同样有效且更省维护，或新层造成旧事实持续污染，则否定采用价值。鉴权是否失效是独立部署前提，不能用检索实验掩盖。该假设没有实现或运行验证，不计入插件已有贡献。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:3256-3262](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/5124cc1fa5a3149e8a68cf1d858e24b5bf2a2eea/lib/index.js#L3256-L3262)

低信息问在常驻层之前被挡下，是硬约束遗漏的推导依据。

```text
  const 门槛 = typeof policy.queryGate === 'number' ? policy.queryGate : 0.8
  let gate = null
  if (门槛 > 0 && sid) {
    const v = 问句信息量(sid, query, df)
    if (v < 门槛) {
      // 这道门挡下来的时候**不做 851 次打分**，省一趟；理由照样记进 trace 给她看 ✓
      return { selected: [], scored: [], 字数: 0, gate: { 信息量: Number(v.toFixed(2)), 门槛 } }
```

**依据 2 · 源码核查**：[lib/index.js:3418-3437](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/5124cc1fa5a3149e8a68cf1d858e24b5bf2a2eea/lib/index.js#L3418-L3437)

现有常驻事实按重要度和时间取有限条，不是确认加到期契约。

<details>
<summary>查看原文（20行）</summary>

```text
  const 事实上限 =
    typeof policy.factsMax === 'number' && policy.factsMax >= 0 ? Math.floor(policy.factsMax) : 2
  const 常驻事实 = []
  if (事实上限 > 0) {
    const 候选 = memories
      .filter((m) => m && m.category === 'stable_profile')
      .slice()
      .sort(
        (a, b) =>
          (Number(b.importance) || 0) - (Number(a.importance) || 0) ||
          (Date.parse(b.createdAt || b.at || 0) || 0) - (Date.parse(a.createdAt || a.at || 0) || 0),
      )
    const 行表 = new Map()
    for (const row of scored) if (row && row.m) 行表.set(String(row.m.id), row)
    for (const m of 候选.slice(0, 事实上限)) {
      const row = 行表.get(String(m.id)) || { m, s: { P: 1, C: 1, timeHit: 1 } }
      row.omission = null // 常驻的不算「被筛掉」
      row.常驻 = true
      常驻事实.push(row)
    }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:4352-4368](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/5124cc1fa5a3149e8a68cf1d858e24b5bf2a2eea/lib/index.js#L4352-L4368)

trace 记录被选与未选原因，可作为对照实验的观察入口。

<details>
<summary>查看原文（17行）</summary>

```text
          const 这条 = {
            at: now,
            session: sid,
            query: query.slice(0, 200),
            // 这道门挡下来的时候记一笔，设置页上就能看见「为什么这次没翻记忆」✓
            gate: gate ? gate.信息量 : null,
            gateLimit: gate ? gate.门槛 : null,
            picked: selected.map((r) => r.m.id),
            rows: scored.slice(0, 24).map((r) => ({
              id: r.m.id,
              C: Number(r.s.C.toFixed(3)),
              P: Number(r.s.P.toFixed(3)),
              omission: r.omission,
              timeHit: r.s.timeHit,
              // 进到提示词里的算 assembled；后面她回复里用上了就变 consumed ✓
              status: r.omission ? null : 'assembled',
            })),
```

</details>

#### 缺口

- 确认加到期的事实层是否优于人工短档案未知。
  **影响**：不能把设计推演算成已有创新或推荐理由。
  **进一步探讨**：按本题三组对照记录错误和负担，用事前定义的停止标准决定是否继续。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
