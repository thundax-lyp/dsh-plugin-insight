# 鱼的记忆

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[01a1f5d](https://github.com/Yuuyuko-uu/dsh-fish-memory/tree/01a1f5db65216df3e9c363ad00b4f8f58323c226)

<!-- BEGIN META -->
[![GitHub ★ 324](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=324&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Yuuyuko-uu/dsh-fish-memory)
<!-- END META -->

> **功能**：为 DSH 会话保存带时间的长期记忆，按词面证据与鲜活度召回，并提供事实更新和召回轨迹。

> **亮点**：相关性门槛与衰减排序分开、稳定事实与事件分名额，并用删除墓碑与epoch限制异步旧结果复活；这些设计可解释但缺少独立任务收益证据。见[Q02](#research-q02)、[Q03](#research-q03)。

> **主要限制**：低信息量query会在常驻层前早退，长期事实并非无条件每轮注入；remember后还可后台调用模型扩词，复用现有key不等于无额外请求和费用。见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 什么人需要这份记忆，相对档案或压缩增加什么？](#detail-section-11)
  - [Q02 · 写入、遗忘与召回怎样连接，常驻事实是否真每轮在？](#detail-section-12)
  - [Q03 · 模型调用、旧结果回写与删除有哪些成本和恢复边界？](#detail-section-13)
  - [Q04 · 启用与退出的依赖、流程和采用条件是什么？](#detail-section-14)
  - [Q05 · 哪些机制值得借鉴，可验证什么新假设？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：长期会话需要保留偏好、约定和事件的DSH用户，可观察每会话记忆及可解释召回，事实正确性仍须核对。见[Q01](#research-q01)。

基线是手工短档案或宿主压缩；差异在自动选记、时间排序和纠错轨迹，不是保证正确的全量对话备份。见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| remember | 保存会话长期记忆 | 需会话开启、模型选记与每日配额 |
| 时间与证据召回 | 选择相关事件注入 | 词面启发式，可能误召漏召 |
| 稳定事实名额 | 与事件分开保留事实 | queryGate早退时仍会整层缺席 |
| 事实取代/事实键 | 防止旧状态持续召回 | 键和取代判断错误可藏错记录 |
| 自动扩词 | 生成相关检索词 | remember后可调用模型，非零额外用量 |
| 轨迹与恢复 | 查注入原因并找回删除项 | assembled不等于回答正确，备份与日志另留存 |
| 旧结果写回保护 | 减少异步覆盖和删除复活 | 单文件原子替换，非多进程事务 |

**流程与依赖**

需要宿主提示/工具/会话服务、本地目录、有效词表及扩词时的模型；完整条件见[Q04](#research-q04)。

先用非敏感事实试记，再检查实际注入、纠错、删除与后台调用；具体步骤和退出见[Q04](#research-q04)。

**效果与成本**

注入、自动扩词、备份与人工纠错都有负担，金额和耗时未知；阶段成本见[Q04](#research-q04)。

可见轨迹不证明回答消费正确，注入频率不证明收益；效果表见[Q04](#research-q04)。

> **思考**：低信息量query会在常驻层前早退，长期事实并非无条件每轮注入；remember后还可后台调用模型扩词，复用现有key不等于无额外请求和费用。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相关性门槛与衰减排序分开、稳定事实与事件分名额，并用删除墓碑与epoch限制异步旧结果复活；这些设计可解释但缺少独立任务收益证据。见[Q02](#research-q02)、[Q03](#research-q03)。

同目录原子替换、删除优先、epoch与await后重读有针对性；不是跨进程事务。诊断日志和销毁前备份也含记忆内容，退出需核对实际副本。见[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

低信息量query会在常驻层前早退，长期事实并非无条件每轮注入；remember后还可后台调用模型扩词，复用现有key不等于无额外请求和费用。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察。在目标环境用少量非敏感约定、事件和纠错样本验证，尤其核对简短续问和autoExpand；关键事实遗漏、旧事实污染或背景用量超预期时关记忆，回用户可审阅的静态档案。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持写入、召回、纠错及旧快照保护；常驻与无额外模型调用的概括需收窄。宿主运行和独立任务效果未测，采用观察，新方案未验证。

- 已检查：作者 README、包清单、源码路径 package.json、README.md、cordis.patch.yml、lib/index.js、lib/store-merge.mjs、lib/atomic-file.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定根组件的记忆写入/召回/注入、模型扩词、文件合并/原子写及设置入口；未审计全部6千行主文件、导入与客户端，未读取真实档案或调用模型。
- 下一步：后续固定宿主/模型，对照静态短档案检查关键事实、近期事件、旧事实、低信息量续问及删除并发，按合格回答与纠错投入而非注入数量验收。

**分析版本**

- **仓库**：[Yuuyuko-uu/dsh-fish-memory](https://github.com/Yuuyuko-uu/dsh-fish-memory)
- **版本号**：1.4.0（[固定提交 01a1f5d](https://github.com/Yuuyuko-uu/dsh-fish-memory/tree/01a1f5db65216df3e9c363ad00b4f8f58323c226)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是将用户确认的强约束事实置于事件queryGate之外，设置固定预算和本轮可见原因，减少简短续问遗漏；比较手工短档案的遗漏、旧事实、污染、token和纠错，成本或过期固化更差就停止。见[Q05](#research-q05)。

后续固定宿主/模型，对照静态短档案检查关键事实、近期事件、旧事实、低信息量续问及删除并发，按合格回答与纠错投入而非注入数量验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 1384 | — | — | 18336 |
| .mjs | source | 4 | 371 | 288 | 67 | — |
| .js | source | 3 | 11011 | 8583 | 2191 | — |
| .mjs | test | 6 | 1192 | 1097 | 15 | — |
| .md | test | 1 | 25 | — | — | 240 |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/Yuuyuko-uu/dsh-fish-memory/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 10](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=10&color=737b86&logo=github)](https://github.com/Yuuyuko-uu/dsh-fish-memory/issues?q=is%3Aissue+created%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z) [![近30天关闭 8](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=8&color=737b86&logo=github)](https://github.com/Yuuyuko-uu/dsh-fish-memory/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：每会话记忆如何写入、召回和纠错，常驻保证与后台成本有什么边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 什么人需要这份记忆，相对档案或压缩增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是原生DSH记忆插件，通过remember工具把会话中选出的事项写为带时间、类别和重要度的记忆，并在后续请求通过systemPrompt.context注入选中项。它面向同一会话长期反复讨论个人偏好、约定或事件、担心上下文压缩后遗漏的用户。合格结果应是需要的事实被召回、已纠正旧事实不再误导、无关材料不过度占上下文；记忆条数增加不是验收标准。

基线是手工维护一份常驻档案或让宿主压缩历史。插件增加每会话记忆库、时间衰减、词面证据门槛、稳定事实层及可见召回轨迹，减少用户逐轮挑材料的入口。它不是对话全量备份、语义事实验证器或保证模型遵守约定的权限机制。remember由模型选择调用，内容和事实键也依赖模型；自动写入不能据此变成已核实的用户事实。

有意义的差异在于将“是否有相关词面证据”与“在相关候选中谁优先”分开，时间、情绪和重要度主要影响排序。稳定事实又从普通事件名额分离。这比所有历史等量常驻更可解释，但阈值和切词可能漏召、误召；作者注释中的精度数字来自其样本，不是本轮复现实验。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:35-41](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/01a1f5db65216df3e9c363ad00b4f8f58323c226/lib/index.js#L35-L41)

原生服务依赖和本机目录。

```text
export const name = 'memory'
export const inject = ['systemPrompt', 'agents', 'timer', 'tools', 'webServer', 'sessions', 'sessionTitle', 'llm']

const CFG_DIR = process.env.DSH_HOME || join(homedir(), '.dsh')
const STORE_DIR = join(CFG_DIR, 'fish-memory')
const BACKUP_DIR = join(CFG_DIR, 'fish-memory-backup')
const CFG_PATH = join(CFG_DIR, 'fish-memory-config.json')
```

**依据 2 · 源码核查**：[lib/index.js:3180-3207](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/01a1f5db65216df3e9c363ad00b4f8f58323c226/lib/index.js#L3180-L3207)

remember按当前会话和配额写入前检查。

<details>
<summary>查看原文（28行）</summary>

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
      }

```

</details>

**依据 3 · 源码核查**：[lib/index.js:3300-3325](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/01a1f5db65216df3e9c363ad00b4f8f58323c226/lib/index.js#L3300-L3325)

带时间/类别/事实键的新记忆与保存。

<details>
<summary>查看原文（26行）</summary>

```text
      data.memories.push({
        id: 新id,
        text: text,
        at: new Date(now).toISOString(), // ⭐ 真实时间（系统给的）
        createdAt: new Date(now).toISOString(),
        category: imp >= 1 ? 'stable_profile' : 'event',
        importance: imp,
        emotion: null,
        tags: Array.isArray(args.tags) ? args.tags.slice(0, 6).map(String) : [],
        source: '她自己记的',
        reinforcedAt: null,
        lastReinforcedDay: null,
        // ⭐ 事实键只在真给了的时候才写字段（没给就不留空字段，老数据长什么样它长什么样）✓
        ...(键 ? { 事实键: 键 } : {}),
      })
      // ⭐⭐ 同一个键只留最新那条 —— 新条**已经进库了**再收敛，
      //   这样「最新」的比较里包含它自己，一定留的是它 ✓
      //   （顺序很要紧：先 push 再收敛，反过来会把新条自己也算成旧的 ✗）
      if (键) {
        try {
          for (const id of 按键收敛(data, 新id)) if (作废的.indexOf(id) < 0) 作废的.push(id)
        } catch (error) {}
      }
      saveStore(sid, data)
      diag('remember：' + sid + ' 记了「' + text.slice(0, 40) + '」' + (键 ? '（事实键 ' + 键 + '）' : '') + '（今天第 ' + (todayCount + 1) + ' 条）')
      // ⭐ 自动补「检索词」：以前得她去设置页点「开始扩词」，现在记完就顺手补上
```

</details>

**依据 4 · 源码核查**：[lib/index.js:3834-3848](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/01a1f5db65216df3e9c363ad00b4f8f58323c226/lib/index.js#L3834-L3848)

通过宿主context注入而非仅存文件。

<details>
<summary>查看原文（15行）</summary>

```text
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
          const query = 清掉注入上下文(选查询词(lastUserTextOf(agent.session), lastText))
```

</details>

#### 缺口

- 缺少独立真实任务的召回、纠错和上下文污染对照
  **影响**：不能确认比手工档案或压缩更有用
  **进一步探讨**：固定长期偏好、纠错与事件问题，对比合格回答、遗漏和人工修正。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 写入、遗忘与召回怎样连接，常驻事实是否真每轮在？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

remember取得执行所属会话，检查全局/会话开关、文本和每日配额，再做重复强化、取代标记与事实键收敛后落盘。事实键由调用者给出，同键可让旧项标为已取代；错误归类也可能把仍有效信息藏起来，因此设置中的恢复/追踪不是可省略的装饰。遗忘改变鲜活度与排序，不等于物理删除；过时但未被正确取代的长期事实仍可能参与注入。

召回先过滤refinedSkip和已取代条目，再做切词、库内/说话稀有度和queryGate判定；达到门槛后按C词面证据筛、P综合分排序，去重并按强度控制事件条数。稳定事实按重要度与时间取factsMax，不占事件maxItems；但仍与事件一起经过字符预算，而且第一条即使本身超预算也可进入，故maxChars不是对每次注入严格硬上限。

关键例外是queryGate的早退在常驻事实构造之前。低信息量问题在recall前段直接返回selected=[]，后面的stable_profile常驻层根本不执行；context回调也对空查询先返回空文本。因此README所说“长期事实每轮固定带上、不看问什么”在该实现中有查询门槛例外，不能当无条件承诺。它不证明所有正常查询都丢事实，但对简短续问、寒暄及无可读user输入的轮次需特别验证。

注入使用interpolate:false，避免记忆中的双花括号被宿主当模板变量；query优先读取会话真实最后用户消息并清理已有注入上下文，减少旧查询或自我污染。轨迹记录assembled只表示放进提示，不能证明模型使用正确或交付更好。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:2810-2848](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/01a1f5db65216df3e9c363ad00b4f8f58323c226/lib/index.js#L2810-L2848)

过滤旧项与低信息量查询提前返回空结果。

<details>
<summary>查看原文（39行）</summary>

```text
  // ⭐ 2026-09-21（E）：**提炼判成「跳过」的，不再参与召回** ✓
  //   它们还留在库里（设置页看得见、能「重跑」放回来），只是不再被想起来。
  //   老代码把「跳过」当成一个纯展示标记 —— 判了跳过照样会被召回来，等于白判 ✗
  //
  // ⭐⭐ 2026-09-23：**「已被取代」的也不再参与召回** ✓
  //   有些记忆记的是**当时的状态**，会变（「拼团还没开」「暂时读不到视频列表」）。
  //   它们既不会被删、也不会淡掉（淡忘只让排序往后掉，词对得上照样回来），
  //   于是**过时的信息会一直当现在的事实注进去** ✗
  //   → 标了「已被取代」的就不注入；东西还留着，设置页看得见、能撤销 ✓
  const memories = (Array.isArray(data.memories) ? data.memories : []).filter((m) => !m || (!m.refinedSkip && !m.已被取代))
  // ⭐ 先把「这个会话的搭配表」挂上，再切词 —— 半个词（天去／去公）不该当线索 ✓
  //   （记忆那边的词表也走同一张搭配表，两边才配得上）
  装搭配(sid)
  const df = 稀有表(memories)
  // ⚠⚠ 2026-09-22（反馈的两轮注入）：**把「她自己怎么说话」那张尺子也带进打分** ✓
  //   原来它只用在**问句门槛**上（这句话值不值得翻记忆），没用在**打分**上 ——
  //   于是「宝宝」「今天」「晚上」这种她天天说的词，照样当满额证据 ✗
  //   实测她那两轮：命中「宝宝」的话0.13（天天喊）、命中「饿」的话0.73（偶尔说）——
  //   两个词在库里的稀有度却差不多（0.64 / 0.82），分不出来。
  //   乘上说话稀有度之后，天天说的词自然贬值 ✓
  //   ⚠ 样本太少（< 20 句）就不压，免得新会话被误伤
  const 尺 = { df, 说话: 拿尺(sid) }

  // ⭐⭐ 第一道门开在**问句**上，不在记忆上（2026-09-21 加）
  //   「在吗」「嗯」「哈哈」这种话本身没内容，就不该去翻几百条记忆 ——
  //   实测过：只换打分公式，它们照样六条，因为**总能比出六条来**。
  //   尺子是「她自己怎么说话」：天天说的词不算信息，偶尔说的才算 ✓
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

  // ⭐⭐ 2026-09-23：**只拿「稀有词」算证据** ✓
```

</details>

**依据 2 · 源码核查**：[lib/index.js:2982-3030](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/01a1f5db65216df3e9c363ad00b4f8f58323c226/lib/index.js#L2982-L3030)

稳定事实层及字符预算在早退之后。

<details>
<summary>查看原文（49行）</summary>

```text
  //   ⚠ 事实按「重要度 → 时间」取，不按分数：常驻层的意义就是不依赖这句话。
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
  }
  const ids = new Set(selected.map((r) => r.m.id))
  for (const row of picked) {
    if (row.omission) continue // 别把 budget 覆盖成 limit
    if (ids.has(row.m.id)) continue
    row.omission = 'limit'
```

</details>

**依据 3 · 源码核查**：[lib/index.js:3834-3872](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/01a1f5db65216df3e9c363ad00b4f8f58323c226/lib/index.js#L3834-L3872)

纯文本context、真实用户查询与空查询早退。

<details>
<summary>查看原文（39行）</summary>

```text
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
          const query = 清掉注入上下文(选查询词(lastUserTextOf(agent.session), lastText))

          // 探针：看看 requestContext() 里有没有「当前输入」（只记一次）
          if (!probed) {
            probed = true
            try {
              const rc = agent.session && agent.session.requestContext ? agent.session.requestContext() : null
              diag('探针 requestContext: ' + (rc ? Object.keys(rc).join(',') : '拿不到'))
              if (rc) diag('探针内容: ' + JSON.stringify(rc).slice(0, 500))
            } catch (error) {
              diag('探针出错: ' + (error && error.message))
            }
          }
          // 只在 query 变了的时候记一行 —— 以前每轮都记长度，看不出「一直卡在同一句」
          const 查询指纹 = query.length + ':' + query.slice(0, 24)
          if (查询指纹 !== 上次查询指纹) {
            上次查询指纹 = 查询指纹
            diag('  这一轮用哪句检索：' + query.length + ' 字「' + query.slice(0, 40).replace(/\s+/g, ' ') + '」')
          }
          if (!query) return ''
          const data = loadStore(sid)
          if (!data.memories.length) return ''
          补历史尺(sid, agent.session) // ⭐ 第一次用到时把她的会话历史补成尺子（只做一次）✓
          const { selected, scored, gate } = recall(data, query, now, sid)
          // ⚠ 只存**最相关的前 24 条**，别把 850 条全存进来 ✗
```

</details>

**依据 4 · 源码核查**：[lib/index.js:3876-3908](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/01a1f5db65216df3e9c363ad00b4f8f58323c226/lib/index.js#L3876-L3908)

assembled轨迹及实际渲染/容错。

<details>
<summary>查看原文（33行）</summary>

```text
          //   scored 已经按 P 排好序了，所以前 24 条 = 挑中的 + 最接近的落选 ✓
          data.traces.push({
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
          })
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
          return 注入文本
        } catch (error) {
          return '' // 记忆坏了也不能影响对话
        }
```

</details>

**依据 5 · 源码核查**：[lib/index.js:3250-3304](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/01a1f5db65216df3e9c363ad00b4f8f58323c226/lib/index.js#L3250-L3304)

取代与事实键影响旧记录。

<details>
<summary>查看原文（55行）</summary>

```text
      //       实测那一档 31 组逐组人眼核过，**没有一组是误合** ✓
      //       比这更松的不敢自动标：标错了会**悄悄**让一条正经记忆不再被想起来 ✗
      //   来源二：**AI 自己说** —— 它调 remember 时填了「取代」。
      //     像「拼团开了」更新「拼团还没开」这种，**只有它自己知道**，本地判不出来 ✓
      const 作废的 = []
      try {
        const 新词集 = 词集(text)
        for (const m of data.memories) {
          if (m.已被取代) continue
          const 像 = 像度(新词集, 词集(String(m.text || '')))
          if (像 < 真重复门槛) continue
          const 长比 =
            Math.min(text.length, String(m.text || '').length) / Math.max(text.length, String(m.text || '').length)
          if (长比 < 0.8) continue
          if (标作废(m, 新id, '跟新记的几乎一样')) 作废的.push(String(m.id))
        }
      } catch (error) {}
      // 来源二：它明确说了「这条取代了那条」
      if (args && args.取代) {
        const 指 = String(args.取代).trim()
        const 找 = norm(指)
        let 最好 = null
        let 最好像 = 0
        for (const m of data.memories) {
          if (m.已被取代) continue
          if (String(m.id) === 指) {
            最好 = m
            最好像 = 1
            break
          }
          const a = norm(m.text)
          if (a && 找 && (a === 找 || (a.length > 6 && 找.length > 6 && (a.includes(找) || 找.includes(a))))) {
            最好 = m
            最好像 = 1
            break
          }
          const 像 = 像度(词集(指), 词集(String(m.text || '')))
          if (像 > 最好像) {
            最好像 = 像
            最好 = m
          }
        }
        // ⚠ 门槛 0.5：它给的是「大意」不是原文，太严会找不到；
        //   太低又会误伤不相干的 —— 0.5 是「同一件事」的下限（跟查重候选 0.75 同量级但更松）
        if (最好 && 最好像 >= 0.5 && 标作废(最好, 新id, '新记的这条说它取代了它')) 作废的.push(String(最好.id))
      }
      // ⭐⭐ 2026-09-23（反馈第二点）：**事实键** —— 它填了就收下 ✓
      //   收下之后**先只挂在新条上**，等它进库了再统一收敛（见下面 按键收敛）
      const 键 = 归一键(args && args.事实键)

      data.memories.push({
        id: 新id,
        text: text,
        at: new Date(now).toISOString(), // ⭐ 真实时间（系统给的）
        createdAt: new Date(now).toISOString(),
```

</details>

#### 缺口

- 低信息量查询导致常驻事实缺席未在宿主复现
  **影响**：不能报告真实用户遗漏率或保证常驻
  **进一步探讨**：对低信息量续问、有明确事实问题及空query分别回读注入，确认是否满足目标记忆要求。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 模型调用、旧结果回写与删除有哪些成本和恢复边界？

**研究主题**：效果与总成本、工程质量与复用

#### 完整回答

检索本身以本地词表和计算完成，但remember之后不是必然无额外模型请求。成功落盘后fire-and-forget调用自动扩词；autoExpand只有显式false才跳过，函数将记忆文本交给当前/可用agent模型生成相关词。提炼和扩词也共用ctx.llm.stream。因而复用现有key不等于没有新增token、时间或远端数据传输；README“不点提炼/扩词就不调用”的描述不能概括当前自动路径。不阻塞remember只说明用户先得到保存结果，不说明后台免费或已成功补词。

自动扩词在await后重新读取库，按目标ID更新；purgeEpoch改变时丢弃结果，已删除/合并的项不硬写回。saveStore又重读磁盘、按ID和更新时间合并，删除墓碑优先，只有显式restoreIds允许找回；彻底清理变更epoch阻止旧异步结果复活。这是围绕真实异步旧快照风险的有效设计，不能只用“用了JSON文件”评价可靠性。

atomic-file采用同目录唯一临时文件、权限、fsync和rename，失败清临时文件保留旧目标。它是单文件替换，读取—合并—写回没有跨进程锁/CAS，两个宿主同时维护同库仍不应声称事务安全。merge的更新时间对冲突解决是约定，不等于语义上选出了正确事实。

普通删除保留deleted供恢复，彻底销毁之前还保存备份，诊断日志可记录查询前缀、请求context片段和注入文本；停用不等于擦除这些副本。对敏感个人档案，数据删除范围和模型扩词的发送范围要一起核对。源码中的保护能限制复活和覆盖，不证明实际恢复已运行验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1438-1469](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/01a1f5db65216df3e9c363ad00b4f8f58323c226/lib/index.js#L1438-L1469)

自动扩词默认只在显式false时停、调用模型并重读/epoch检查。

<details>
<summary>查看原文（32行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[lib/index.js:3315-3332](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/01a1f5db65216df3e9c363ad00b4f8f58323c226/lib/index.js#L3315-L3332)

remember成功后后台扩词接线。

<details>
<summary>查看原文（18行）</summary>

```text
      // ⭐⭐ 同一个键只留最新那条 —— 新条**已经进库了**再收敛，
      //   这样「最新」的比较里包含它自己，一定留的是它 ✓
      //   （顺序很要紧：先 push 再收敛，反过来会把新条自己也算成旧的 ✗）
      if (键) {
        try {
          for (const id of 按键收敛(data, 新id)) if (作废的.indexOf(id) < 0) 作废的.push(id)
        } catch (error) {}
      }
      saveStore(sid, data)
      diag('remember：' + sid + ' 记了「' + text.slice(0, 40) + '」' + (键 ? '（事实键 ' + 键 + '）' : '') + '（今天第 ' + (todayCount + 1) + ' 条）')
      // ⭐ 自动补「检索词」：以前得她去设置页点「开始扩词」，现在记完就顺手补上
      //    ⚠️ 不 await（模型调用要几秒，不能卡住记账）；但**必须 .catch** ——
      //      裸的 rejected promise 会被 Node 当致命错误，整个宿主退出（今天早上刚踩过）
      try {
        Promise.resolve()
          .then(() => 自动扩词(ctx, sid, 2))
          .catch((error) => diag('自动扩词失败：' + ((error && error.message) || error)))
      } catch (error) {}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1180-1207](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/01a1f5db65216df3e9c363ad00b4f8f58323c226/lib/index.js#L1180-L1207)

真实ctx.llm.stream调用。

<details>
<summary>查看原文（28行）</summary>

```text
async function 问模型(ctx, agent, 系统, 用户, 最多, 指定) {
  const t = 指定 && 指定.provider && 指定.model ? 指定 : 取模型(ctx, agent)
  if (!t) return { ok: false, message: '拿不到这个会话在用的模型' }
  let messages
  try {
    messages = [
      createUserMessage({
        content: [{ type: 'text', text: 用户 }],
        source: { kind: 'plugin', plugin: 'dsh-fish-memory' },
      }),
    ]
  } catch (error) {
    return { ok: false, message: '构造消息失败：' + ((error && error.message) || error) }
  }
  let out = ''
  try {
    for await (const chunk of ctx.llm.stream({
      provider: t.provider,
      model: t.model,
      system: 系统,
      messages: messages,
      maxTokens: 最多 || 600,
      temperature: 0.1,
    })) {
      if (!chunk) continue
      if (chunk.type === 'text-delta') out += chunk.text
      if (chunk.type === 'finish' && chunk.reason && chunk.reason.kind === 'error') {
        const f = chunk.reason.failure || {}
```

</details>

**依据 4 · 源码核查**：[lib/index.js:401-453](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/01a1f5db65216df3e9c363ad00b4f8f58323c226/lib/index.js#L401-L453)

落盘前重读、epoch和合并。

<details>
<summary>查看原文（53行）</summary>

```text
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
    // 与内容一起原子发布；其他实例后续读取时也能识别旧代际（并非跨进程事务）。
    // 先构造待写副本；写失败时保留恢复候选的原代际，允许同对象安全重试。
    data = { ...data, purgeEpoch: 选项 && 选项.raw ? randomUUID() : epoch }
    if (data.traces.length > 100) data.traces = data.traces.slice(-100)
    // 记忆变了才备份（只写 trace 的时候不备，不然一天几百份）
    const sig = memSig(data.memories)
    if (lastSig.get(String(sid)) !== sig) {
      backupStore(sid)
    }
```

</details>

**依据 5 · 源码核查**：[lib/store-merge.mjs:1-31](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/01a1f5db65216df3e9c363ad00b4f8f58323c226/lib/store-merge.mjs#L1-L31)

删除优先与显式恢复。

<details>
<summary>查看原文（31行）</summary>

```text
// 纯合并逻辑：不访问磁盘、宿主或模型，便于复现后台旧快照与删除交错。
export function 合并库(盘, 写, 选项 = {}) {
  const 更新时间 = (m) => Math.max(
    Date.parse(m.editedAt || 0) || 0,
    Date.parse(m.relatedAt || 0) || 0,
    Date.parse(m.reinforcedAt || 0) || 0,
    Date.parse(m.deletedAt || 0) || 0,
    Date.parse(m.createdAt || 0) || 0,
  )
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
  const 记录表 = new Map()
  const 键 = (t) => String(t && t.at) + '|' + String((t && t.query) || '').slice(0, 80)
  for (const t of 写.traces || []) 记录表.set(键(t), t)
  for (const t of 盘.traces || []) if (!记录表.has(键(t))) 记录表.set(键(t), t)
  const traces = [...记录表.values()].sort((a, b) => (a.at || 0) - (b.at || 0)).slice(-100)
  return { version: 2, policy: 写.policy || 盘.policy, memories, traces, deleted: [...删们.values()] }
}
```

</details>

**依据 6 · 源码核查**：[lib/atomic-file.mjs:1-32](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/01a1f5db65216df3e9c363ad00b4f8f58323c226/lib/atomic-file.mjs#L1-L32)

单文件原子替换而非多进程事务。

<details>
<summary>查看原文（32行）</summary>

```text
import fs from 'node:fs'
import { randomUUID } from 'node:crypto'

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
    if (descriptor !== undefined) {
      try { fs.closeSync(descriptor) } catch { /* preserve the original failure */ }
    }
    if (created && !committed) {
      try { fs.rmSync(staged, { force: true }) } catch { /* caller still receives the write failure */ }
    }
  }
}
```

</details>

**依据 7 · 源码核查**：[lib/index.js:332-360](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/01a1f5db65216df3e9c363ad00b4f8f58323c226/lib/index.js#L332-L360)

彻底销毁前仍留备份。

<details>
<summary>查看原文（29行）</summary>

```text
// ⭐⭐ 2026-09-23（真出过一次事）：**「清空」是真销毁，得另存一份** ——
//   那天把「已删掉的」清空，连同刚合掉的 157 条一起没了。
//   而常规的两道备份都指望不上：
//     `.bak`     只留**最后一次改动前**那一版（清空之后又被下一次写入覆盖了）
//     每天那份   只留**当天最早**那一版
//   最后是靠「每天那份」正好是当天最早，才整条救回来 ✗（运气好而已）
//   → 凡是**真销毁**的动作（清空、批量清掉），动之前**另存一份带时间戳的**，
//     放在 `fish-memory\销毁前\` 里，只留最近 20 份 ✓
function 销毁前另存(sid) {
  try {
    const src = storePath(sid)
    if (!existsSync(src)) return
    const dir = join(STORE_DIR, '销毁前')
    mkdirSync(dir, { recursive: true })
    // ⚠⚠ 时间戳要**到毫秒** —— 第一版只到秒，自检里连着清 25 次
    //   全落在同一秒 → **文件名一样、互相覆盖**，最后只剩 1 份 ✗
    //   （自检逮到的。真出事的时候正好是连着点几下，就会踩这个）
    const ts = new Date(Date.now() + TZ_OFFSET).toISOString().replace(/[:.]/g, '-').slice(0, 23)
    const 头 = basename(src).replace(/\.json$/, '') + '·' + ts
    let 名 = 头 + '.json'
    for (let i = 2; existsSync(join(dir, 名)); i++) 名 = 头 + '·' + i + '.json' // 撞了就加序号，绝不覆盖 ✓
    copyFileSync(src, join(dir, 名))
    const 们 = readdirSync(dir).filter((f) => f.endsWith('.json')).sort()
    for (const f of 们.slice(0, Math.max(0, 们.length - 20))) {
      try {
        rmSync(join(dir, f), { force: true })
      } catch (error) {}
    }
    diag('销毁前另存：' + 名)
```

</details>

**依据 8 · 源码核查**：[lib/index.js:3851-3868](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/01a1f5db65216df3e9c363ad00b4f8f58323c226/lib/index.js#L3851-L3868)

诊断可含请求context和查询片段。

<details>
<summary>查看原文（18行）</summary>

```text
          if (!probed) {
            probed = true
            try {
              const rc = agent.session && agent.session.requestContext ? agent.session.requestContext() : null
              diag('探针 requestContext: ' + (rc ? Object.keys(rc).join(',') : '拿不到'))
              if (rc) diag('探针内容: ' + JSON.stringify(rc).slice(0, 500))
            } catch (error) {
              diag('探针出错: ' + (error && error.message))
            }
          }
          // 只在 query 变了的时候记一行 —— 以前每轮都记长度，看不出「一直卡在同一句」
          const 查询指纹 = query.length + ':' + query.slice(0, 24)
          if (查询指纹 !== 上次查询指纹) {
            上次查询指纹 = 查询指纹
            diag('  这一轮用哪句检索：' + query.length + ' 字「' + query.slice(0, 40).replace(/\s+/g, ' ') + '」')
          }
          if (!query) return ''
          const data = loadStore(sid)
```

</details>

#### 缺口

- 实际额外模型用量、敏感档案外发范围及跨进程竞争未测
  **影响**：不能称零成本或所有并发都无丢失
  **进一步探讨**：核对autoExpand和模型，记录请求/用量；同库多写者应独立验证或避免。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启用与退出的依赖、流程和采用条件是什么？

**研究主题**：依赖、兼容与流程、采用判断

#### 完整回答

采用先观察。它提供可解释记忆与纠错入口，但“每轮常驻”例外和隐含后台模型调用会改变用户最关心的保证；长期个人事实还需要真实纠错与不误召测试。可以设计本地可逆样本验证，不把用户真实敏感档案直接导入作第一次实验。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH systemPrompt/agents/timer/tools/webServer/sessions等服务 | 加载必需 | 工具、注入与设置 | '*' peer声明不证明目标宿主兼容 |
| 会话ID和可写本机目录 | 持久记忆必需 | 每会话JSON和轨迹 | 写入失败或无法归属就不能可靠保存 |
| 当前可用模型 | 扩词/提炼时需 | 生成候选记忆与检索词 | 本地原记录仍在，但扩词效果未知 |
| 分词词表和阈值策略 | 有效召回需 | 词面证据筛选 | 词表缺失回旧切法，效果需重验 |
| 纠错与删除范围核对 | 敏感事实使用必需 | 防过期事实和副本残留 | 停用并不擦除备份与日志 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户核对宿主、开关、autoExpand与保存位置 | 明确哪些文本会交模型 |
| 试记 | 模型/用户保存少量非敏感事实与事件 | 列表、时间和会话归属正确 |
| 召回 | 用户问明确问题和简短续问 | 回读实际注入而非只看回答似乎记得 |
| 纠错 | 用户更新事实键并检查旧项不再注入 | 误取代可恢复，不复活已删 |
| 退出 | 用户关全局/会话记忆，按需处理库/备份/日志 | 不再注入；数据留存范围另确认 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地存储和模型候选整理，量未知 | 选样、命名事实键、核对时间 | 导入原稿不等于核实事实 |
| 持续使用 | 注入token、自动扩词和备份，量未知 | 检查误召、遗漏和旧事实 | 现有key不等于无新增费用 |
| 失败恢复 | 重跑、复核及恢复资源未知 | 查轨迹、纠错和旧快照 | 单文件保护不保证多进程事务 |
| 升级退出 | 文件迁移/清理量未知 | 关闭注入并核对副本、日志 | 删除可恢复副本不自动消失 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 持久记忆 | remember写入每会话库 | 真实事实是否被正确记下 |
| 召回可解释 | C/P、门槛和轨迹 | 独立任务准确率及污染 |
| 稳定事实 | 门槛通过后独立名额 | 低信息量轮次“每轮在”不成立 |
| 并发恢复 | 墓碑与epoch防旧结果 | 多进程竞争和长期I/O可靠性 |

如果简短续问必须保留的事实消失、过期事实仍注入、背景模型调用超出预期或无法确认删除范围，应关闭记忆，回到一份用户可审阅的静态档案。不要以扩词更多、注入更频繁或记忆数量变大替代合格回答比较。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:35-41](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/01a1f5db65216df3e9c363ad00b4f8f58323c226/lib/index.js#L35-L41)

宿主服务与本机文件位置。

```text
export const name = 'memory'
export const inject = ['systemPrompt', 'agents', 'timer', 'tools', 'webServer', 'sessions', 'sessionTitle', 'llm']

const CFG_DIR = process.env.DSH_HOME || join(homedir(), '.dsh')
const STORE_DIR = join(CFG_DIR, 'fish-memory')
const BACKUP_DIR = join(CFG_DIR, 'fish-memory-backup')
const CFG_PATH = join(CFG_DIR, 'fish-memory-config.json')
```

**依据 2 · 源码核查**：[lib/index.js:3180-3207](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/01a1f5db65216df3e9c363ad00b4f8f58323c226/lib/index.js#L3180-L3207)

工具写入前开关和配额。

<details>
<summary>查看原文（28行）</summary>

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
      }

```

</details>

**依据 3 · 源码核查**：[lib/index.js:2810-2848](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/01a1f5db65216df3e9c363ad00b4f8f58323c226/lib/index.js#L2810-L2848)

召回门槛。

<details>
<summary>查看原文（39行）</summary>

```text
  // ⭐ 2026-09-21（E）：**提炼判成「跳过」的，不再参与召回** ✓
  //   它们还留在库里（设置页看得见、能「重跑」放回来），只是不再被想起来。
  //   老代码把「跳过」当成一个纯展示标记 —— 判了跳过照样会被召回来，等于白判 ✗
  //
  // ⭐⭐ 2026-09-23：**「已被取代」的也不再参与召回** ✓
  //   有些记忆记的是**当时的状态**，会变（「拼团还没开」「暂时读不到视频列表」）。
  //   它们既不会被删、也不会淡掉（淡忘只让排序往后掉，词对得上照样回来），
  //   于是**过时的信息会一直当现在的事实注进去** ✗
  //   → 标了「已被取代」的就不注入；东西还留着，设置页看得见、能撤销 ✓
  const memories = (Array.isArray(data.memories) ? data.memories : []).filter((m) => !m || (!m.refinedSkip && !m.已被取代))
  // ⭐ 先把「这个会话的搭配表」挂上，再切词 —— 半个词（天去／去公）不该当线索 ✓
  //   （记忆那边的词表也走同一张搭配表，两边才配得上）
  装搭配(sid)
  const df = 稀有表(memories)
  // ⚠⚠ 2026-09-22（反馈的两轮注入）：**把「她自己怎么说话」那张尺子也带进打分** ✓
  //   原来它只用在**问句门槛**上（这句话值不值得翻记忆），没用在**打分**上 ——
  //   于是「宝宝」「今天」「晚上」这种她天天说的词，照样当满额证据 ✗
  //   实测她那两轮：命中「宝宝」的话0.13（天天喊）、命中「饿」的话0.73（偶尔说）——
  //   两个词在库里的稀有度却差不多（0.64 / 0.82），分不出来。
  //   乘上说话稀有度之后，天天说的词自然贬值 ✓
  //   ⚠ 样本太少（< 20 句）就不压，免得新会话被误伤
  const 尺 = { df, 说话: 拿尺(sid) }

  // ⭐⭐ 第一道门开在**问句**上，不在记忆上（2026-09-21 加）
  //   「在吗」「嗯」「哈哈」这种话本身没内容，就不该去翻几百条记忆 ——
  //   实测过：只换打分公式，它们照样六条，因为**总能比出六条来**。
  //   尺子是「她自己怎么说话」：天天说的词不算信息，偶尔说的才算 ✓
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

  // ⭐⭐ 2026-09-23：**只拿「稀有词」算证据** ✓
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1438-1453](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/01a1f5db65216df3e9c363ad00b4f8f58323c226/lib/index.js#L1438-L1453)

后台模型依赖。

<details>
<summary>查看原文（16行）</summary>

```text
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
```

</details>

**依据 5 · 源码核查**：[lib/index.js:4176-4200](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/01a1f5db65216df3e9c363ad00b4f8f58323c226/lib/index.js#L4176-L4200)

设置API挂载，外层访问控制依赖宿主。

<details>
<summary>查看原文（25行）</summary>

```text
      return next()
    })
  } catch (error) {
    diag('assemble 钩子挂不上：' + (error && error.message))
  }

  // ---------- 设置页的路由 ----------
  try {
    const mroute = (path, handler) =>
      ctx.effect(() =>
        ctx.webServer.register({
          kind: 'exact',
          path: path,
          handler: async (req, res) => {
            try {
              await handler(req, res)
            } catch (error) {
              try {
                res.writeHead(500, { 'content-type': 'application/json' })
                res.end(JSON.stringify({ ok: false, error: String(error && error.message) }))
              } catch (e2) {}
            }
          },
        }),
      )
```

</details>

#### 缺口

- 没有固定目标宿主真实记忆任务对照
  **影响**：不能给持续安装或保证召回的建议
  **进一步探讨**：先用非敏感可逆事实、更新、删除和低信息量续问验收，纳入人工纠错与token。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些机制值得借鉴，可验证什么新假设？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

可借鉴的是先相关性门槛再衰减排序、稳定事实与事件分配不同名额、异步补词回写前重新读库并用epoch拒绝旧结果、删除优先合并。这些机制针对检索污染和旧快照复活，比只增加记忆容量更接近可检验的可靠性目标。移植仍要处理会话身份、词表、模型与文件并发，不是直接复制即可获得有效长期记忆。

由常驻层被queryGate提前挡掉推导一个未验证假设：将用户确认的强约束事实与可选事件检索分开，前者在门槛之外提供明确固定预算，并显式展示本轮保留/未保留原因，可能减少简短续问时的关键约定丢失。它不是把所有档案永久塞上下文；事实要可纠错、可过期，预算与模型费用也需可见。

最小验证用相同模型和一组长期约定、近期事件、已被纠正事实及寒暄续问，对比当前实现、手工常驻短档案、分层方案。记录关键约束遗漏、旧事实误用、无关注入、回答合格率、token和纠错时间；只有遗漏下降而污染和总负担不明显升高才支持。若常驻层让过期事实更顽固或手工短档案同样好，则缩小方案或不开发。无真实对照前不能把作者样本准确率或该假设写成已证实改进。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:2810-2848](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/01a1f5db65216df3e9c363ad00b4f8f58323c226/lib/index.js#L2810-L2848)

门槛在常驻层前触发。

<details>
<summary>查看原文（39行）</summary>

```text
  // ⭐ 2026-09-21（E）：**提炼判成「跳过」的，不再参与召回** ✓
  //   它们还留在库里（设置页看得见、能「重跑」放回来），只是不再被想起来。
  //   老代码把「跳过」当成一个纯展示标记 —— 判了跳过照样会被召回来，等于白判 ✗
  //
  // ⭐⭐ 2026-09-23：**「已被取代」的也不再参与召回** ✓
  //   有些记忆记的是**当时的状态**，会变（「拼团还没开」「暂时读不到视频列表」）。
  //   它们既不会被删、也不会淡掉（淡忘只让排序往后掉，词对得上照样回来），
  //   于是**过时的信息会一直当现在的事实注进去** ✗
  //   → 标了「已被取代」的就不注入；东西还留着，设置页看得见、能撤销 ✓
  const memories = (Array.isArray(data.memories) ? data.memories : []).filter((m) => !m || (!m.refinedSkip && !m.已被取代))
  // ⭐ 先把「这个会话的搭配表」挂上，再切词 —— 半个词（天去／去公）不该当线索 ✓
  //   （记忆那边的词表也走同一张搭配表，两边才配得上）
  装搭配(sid)
  const df = 稀有表(memories)
  // ⚠⚠ 2026-09-22（反馈的两轮注入）：**把「她自己怎么说话」那张尺子也带进打分** ✓
  //   原来它只用在**问句门槛**上（这句话值不值得翻记忆），没用在**打分**上 ——
  //   于是「宝宝」「今天」「晚上」这种她天天说的词，照样当满额证据 ✗
  //   实测她那两轮：命中「宝宝」的话0.13（天天喊）、命中「饿」的话0.73（偶尔说）——
  //   两个词在库里的稀有度却差不多（0.64 / 0.82），分不出来。
  //   乘上说话稀有度之后，天天说的词自然贬值 ✓
  //   ⚠ 样本太少（< 20 句）就不压，免得新会话被误伤
  const 尺 = { df, 说话: 拿尺(sid) }

  // ⭐⭐ 第一道门开在**问句**上，不在记忆上（2026-09-21 加）
  //   「在吗」「嗯」「哈哈」这种话本身没内容，就不该去翻几百条记忆 ——
  //   实测过：只换打分公式，它们照样六条，因为**总能比出六条来**。
  //   尺子是「她自己怎么说话」：天天说的词不算信息，偶尔说的才算 ✓
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

  // ⭐⭐ 2026-09-23：**只拿「稀有词」算证据** ✓
```

</details>

**依据 2 · 源码核查**：[lib/index.js:2982-3030](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/01a1f5db65216df3e9c363ad00b4f8f58323c226/lib/index.js#L2982-L3030)

稳定事实与事件不同名额。

<details>
<summary>查看原文（49行）</summary>

```text
  //   ⚠ 事实按「重要度 → 时间」取，不按分数：常驻层的意义就是不依赖这句话。
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
  }
  const ids = new Set(selected.map((r) => r.m.id))
  for (const row of picked) {
    if (row.omission) continue // 别把 budget 覆盖成 limit
    if (ids.has(row.m.id)) continue
    row.omission = 'limit'
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1455-1469](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/01a1f5db65216df3e9c363ad00b4f8f58323c226/lib/index.js#L1455-L1469)

异步旧结果epoch检查。

<details>
<summary>查看原文（15行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[lib/store-merge.mjs:15-25](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/01a1f5db65216df3e9c363ad00b4f8f58323c226/lib/store-merge.mjs#L15-L25)

删除优先与显式恢复。

<details>
<summary>查看原文（11行）</summary>

```text
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
  const 记录表 = new Map()
```

</details>

#### 缺口

- 门槛外强约束层及其任务效果未实现验证
  **影响**：不能断言会提高记忆正确性
  **进一步探讨**：对照手工短档案和当前实现，按遗漏、污染与纠错投入判定。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
