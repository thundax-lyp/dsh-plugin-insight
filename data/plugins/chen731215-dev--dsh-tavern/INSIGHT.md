# dsh-tavern

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[dcfbcd7](https://github.com/chen731215-dev/dsh-tavern/tree/dcfbcd7885c3e9367469f243c7cd098fd58a3f0c)

<!-- BEGIN META -->
[![GitHub ★ 37](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=37&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/chen731215-dev/dsh-tavern) [![npm 30d 10,619](https://img.shields.io/static/v1?label=npm+30d&message=10%2C619&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-tavern) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-tavern)
<!-- END META -->

> **功能**：管理角色卡、世界书和预设，在 DSH 会话中组织角色扮演与故事续写。

> **亮点**：[Q01](#research-q01) 提供按会话装配角色与世界书的入口，并支持关键词条件减少无关词条。[Q02](#research-q02) 的总结和关系记录可辅助续写，需另确认会话与外发范围。

> **主要限制**：[Q02](#research-q02) 的自动总结跨异步使用可变会话状态，[Q03](#research-q03) 的主动编辑会重写宿主历史且备份失败后仍写入。真实项目采用前应分别验证。

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
  - [Q01 · 酒馆预设怎样复用角色和世界书，绑定会话实际改变什么？](#detail-section-11)
  - [Q02 · 总结读取哪个会话，哪些内容会发给模型或进入长期记忆？](#detail-section-12)
  - [Q03 · 编辑回复是界面覆盖，还是会修改宿主持久化文件？](#detail-section-13)
  - [Q04 · 什么样的场景值得先观察，怎样验证自动注入收益？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH 写连载故事的用户，需要跨会话保持角色设定和世界规则，并可核对历史。

原生 Agent 预设或手工提示可完成基础写作。酒馆把设定整理、关键词与记忆操作集中进同一界面。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 设定注入 | 在写作会话复用角色与世界书 | 依赖绑定、关键词和允许范围 |
| 总结 | 读取会话消息并产生记忆 | 会向所选模型端点发送内容 |
| 历史编辑 | 修改已生成回复 | 可写宿主会话文件，需独立备份 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH Web 和 Node | 是 | 设置、Web 路由与提示组装 | 回原生预设 |
| 授权的模型端点 | 仅总结需要 | 读取并发送对话摘要输入 | 保持自动总结关闭 |
| 独立会话备份 | 测试写入需要 | 核对历史编辑和退出 | 仅观察角色管理 |

#### 操作流程

| 步骤 | 谁操作 | 操作与结果 | 失败处理 |
| --- | --- | --- | --- |
| 建立对照 | 写作者 | 准备虚构角色和原生预设 | 留独立文稿 |
| 核对提示 | 写作者 | 在隔离会话比对世界书和绑定 | 错绑即停 |
| 恢复与退出 | 写作者 | 复核是否写入原会话并保留备份 | 回原生预设 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 隔离 profile 和对照材料 | 检查宿主及预设 | 实测耗时未知 |
| 持续 | 提示词长度与可选总结调用 | 核对词条、会话与外发 | 费用未知 |
| 退出 | 会话备份及恢复空间 | 确认历史、预设和配置 | 恢复未实测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 设定复用 | 绑定和关键词选择 | 故事一致性及输入成本 |
| 总结和关系 | 按指定模型请求并持久化 | 跨会话正确性与外发权限 |
| 历史编辑 | 真实宿主文件写入 | 恢复与格式完整性 |

> **思考**：[Q02](#research-q02) 的自动总结跨异步使用可变会话状态，[Q03](#research-q03) 的主动编辑会重写宿主历史且备份失败后仍写入。真实项目采用前应分别验证。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 提供按会话装配角色与世界书的入口，并支持关键词条件减少无关词条。[Q02](#research-q02) 的总结和关系记录可辅助续写，需另确认会话与外发范围。

[Q01](#research-q01) 的绑定、关键词和提示顺序便于跟踪。[Q02](#research-q02) 的会话状态与 [Q03](#research-q03) 的写后恢复需要分别验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 的自动总结跨异步使用可变会话状态，[Q03](#research-q03) 的主动编辑会重写宿主历史且备份失败后仍写入。真实项目采用前应分别验证。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先用虚构材料比较原生预设。若无法核对 [Q02](#research-q02) 的发送目标与 [Q03](#research-q03) 的历史写入，保留独立文稿。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持预设注入、总结与真实历史编辑。会话隔离、外部接口和写后恢复仍待验证，词条预览属于待验证设计。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、lib/client.manager.bundle.js、lib/index.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根包的 Host 和 Web、绑定及提示、总结模型调用、真实历史修改和代表路由。未穷尽模板、角色格式、宿主授权或所有客户端兼容。
- 下一步：临时 profile 验证两个会话和一条虚构世界书的输入，再独立验证假总结端点和历史备份失败。

**分析版本**

- **仓库**：[chen731215-dev/dsh-tavern](https://github.com/chen731215-dev/dsh-tavern)
- **版本号**：1.9.2（[固定提交 dcfbcd7](https://github.com/chen731215-dev/dsh-tavern/tree/dcfbcd7885c3e9367469f243c7cd098fd58a3f0c)）
- **版本日期**：2026-08-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提出显示本轮词条、触发词和会话来源，与当前配置比较提示长度、错配和排障成本。

临时 profile 验证两个会话和一条虚构世界书的输入，再独立验证假总结端点和历史备份失败。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 9 | 1149 | — | — | 9426 |
| .js | source | 3 | 8830 | 7319 | 1266 | — |
| .js | test | 1 | 296 | 246 | 11 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/chen731215-dev/dsh-tavern/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在 DSH 写连载故事的用户，能否复用角色设定并控制历史和外部总结的影响？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 酒馆预设怎样复用角色和世界书，绑定会话实际改变什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

适合用 DSH 续写同一组角色与世界设定的用户。原生 Agent 预设或手工粘贴能提供基本角色提示。酒馆增加单独的角色和世界书管理，绑定会话后从当前设定自动组装角色卡和词条，能少重复粘贴。绑定端点只写插件 bindings，读取历史判断 DSH 原生预设是否已锁定；要真正变更 Agent 预设仍须使用聊天顶部选择器和适当会话。无显式绑定通常不注入，但子 Agent 可继承父会话绑定，随后工作目录允许列表仍依据当前上下文。玩家名是状态文件里的设置，在 prompt 组装时读入，并非每会话独立项。

世界书智能模式注入启用的全局条目，按最近二十条消息做小写子串匹配以追加关键词项，full 模式收集全部启用项。该机制可让相关设定随上下文进入请求，词法误命中和长世界书带来的提示长度未实测。源码中角色提示还包含对工具使用的文字要求，不能代替宿主权限。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:69-84](https://github.com/chen731215-dev/dsh-tavern/blob/dcfbcd7885c3e9367469f243c7cd098fd58a3f0c/README.md#L69-L84)

作者区分酒馆绑定与原生 Agent 预设。

<details>
<summary>查看原文（16行）</summary>

```text
> 💡 **新建空白预设**：点「＋ 新建」创建的是**完全空白**的预设（无任何角色卡/世界书/词条），方便从零搭建；想基于现有预设改造就点「⧉ 复制」。

### 2️⃣ 生成 Agent 预设

角色卡/世界书/预设设置好后，该预设就是一个完整的「Agent 预设」——它同时具备：

- **DSH 原生 Agent 预设**：在 DSH 聊天顶部的预设选择器里可见、可选
- **酒馆注入内容**：角色卡文本、世界书条目、预设词条会在每次请求时自动注入系统提示

> 切换「完整角色卡本体」请用**聊天顶部预设选择器**选择后**新开会话**；酒馆面板里的下拉只让 世界书/记忆/关系网 跟随。

### 3️⃣ 新建聊天并选择 Agent 预设

1. 点 **＋ 新会话**（新建一个聊天）
2. 在**聊天顶部的预设选择器**里，选中你要用的 Agent 预设（比如刚才配好的那个）
3. 开始聊天——AI 会自动读取该预设的角色卡/世界书/词条，无需手动粘贴设定
```

</details>

**依据 2 · 源码核查**：[lib/client.manager.bundle.js:5682-5695](https://github.com/chen731215-dev/dsh-tavern/blob/dcfbcd7885c3e9367469f243c7cd098fd58a3f0c/lib/client.manager.bundle.js#L5682-L5695)

设置入口。

<details>
<summary>查看原文（14行）</summary>

```text
      ctx.effect(function () { return ctx.locale.register(NS, { zh: zh, en: en }); }, "dsh-tavern: dictionaries");
      var t = ctx.locale.bind(NS);
      var slots = ctx.slots;
      slots.inject("settings.section", function () {
        return slots.register({
          name: "settings.section",
          id: "tavern-manager",
          order: 25,
          label: function () { return t("nav"); },
          locale: NS
        }, function (props) {
          return h(TavernSettingsSection, props);
        });
      });
```

</details>

**依据 3 · 源码核查**：[lib/index.js:2340-2370](https://github.com/chen731215-dev/dsh-tavern/blob/dcfbcd7885c3e9367469f243c7cd098fd58a3f0c/lib/index.js#L2340-L2370)

绑定只写自己的记录，并返回开始状态。

<details>
<summary>查看原文（31行）</summary>

```text
      handler: (req, res) => {
        if (req.method !== 'POST') { json(res, 405, { ok: false, error: 'method-not-allowed' }); return }
        readBody(req).then((body) => {
          try {
            const sessionId = body.sessionId || lastSessionId
            const presetId = body.presetId
            if (!sessionId || !presetId) { json(res, 400, { ok: false, error: '缺少会话ID或预设ID，请先发一条消息再试' }); return }
            lastSessionId = sessionId
            // ★ 检测会话是否已开始（是否有 user 消息）：已开始的会话 agent 预设本体被 DSH 锁定
            //   （agentPreset 只在空白会话可切换）。返回 locked 标记，前端据此给出明确提示。
            let started = false
            try {
              const file = findSessionFile(sessionId)
              if (file) {
                const lines = readSessionLines(file)
                for (let i = lines.length - 1; i >= 0; i--) {
                  try {
                    const o = JSON.parse(lines[i])
                    if (o && (o.type === 'user/message' || o.type === 'user/input' || o.type === 'agent/message')) { started = true; break }
                  } catch {}
                }
              }
            } catch {}
            // 说明：不再直接写入 DSH 会话文件（writeSessionLines 会重写整个 zstd 会话，seq/帧处理不当会破坏 DSH 会话导致
            // "corrupt session log" 报错）。酒馆只维护自己的 bindings 记录；真正切换 agent 预设请用聊天顶部选择器，
            // DSH 会自行 append agent-preset/selected 事件。
            const bindings = readBindings()
            bindings[sessionId] = presetId
            writeBindings(bindings)
            const preset = listPresets().find(p => p.id === presetId)
            json(res, 200, { ok: true, presetId, presetName: preset?.name || presetId, started })
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1951-1985](https://github.com/chen731215-dev/dsh-tavern/blob/dcfbcd7885c3e9367469f243c7cd098fd58a3f0c/lib/index.js#L1951-L1985)

玩家名、绑定与父会话继承。

<details>
<summary>查看原文（35行）</summary>

```text
    active = ctx.systemPrompt.section({
      name: 'tavern:card',
      order: -999999,
      text: (context) => {
        const state = readState()
// ★ 可配置玩家名：每次注入时从 state 同步到模块级 playerName
          if (typeof state.playerName === 'string') playerName = state.playerName.trim() || ''
        // 获取当前会话 ID
        const sid = context?.agent?.session?.id || context?.agent?.session?.header?.id
        if (sid) lastSessionId = sid
        maybeAutoSummary()
        if (state.cardEnabled === false) return ''

        // ★ 根据会话 ID 查找绑定的预设 ★
        let presetId = getSessionPresetId(sid)
        // 只在会话明确绑定了酒馆预设时才注入，未绑定的会话（如官方标准模式）不注入
        const bindings = readBindings()
        if (!sid || !bindings[sid]) {
          // ★ 子 Agent 继承（与 agent-teams 等多 Agent 插件联动）：
          //   当前 agent 的会话未绑定预设，但若它是某个 tavern 会话的子 Agent
          //   （session.header.parentSession 指向父会话），则继承父会话绑定的预设，
          //   让子 Agent 也能拿到主会话的世界观/角色卡/世界书。
          //   不依赖任何第三方插件存在：没有子 Agent 时本分支不触发，行为不变。
          let parentSid = ''
          try {
            parentSid = context?.agent?.session?.header?.parentSession || ''
          } catch {}
          if (parentSid && bindings[parentSid]) {
            sid = parentSid
            presetId = getSessionPresetId(sid)
            lastSessionId = sid
          } else {
            return ''
          }
        }
```

</details>

**依据 5 · 源码核查**：[lib/index.js:1993-2008](https://github.com/chen731215-dev/dsh-tavern/blob/dcfbcd7885c3e9367469f243c7cd098fd58a3f0c/lib/index.js#L1993-L2008)

工作目录与会话范围。

<details>
<summary>查看原文（16行）</summary>

```text
        // cwd 范围控制（保留兼容）+ sessionId 白名单
        const cwd = context?.agent?.session?.header?.cwd
        const cwdKey = (str => str ? String(str).replace(/[\\/]+$/, '') : '')(cwd)
        if (cwdKey) lastCwd = cwdKey
        const norm = (d) => String(d || '').trim().replace(/[\\/]+$/, '')
        const inCwdList = (arr) => cwdKey ? (arr || []).some(d => norm(d) === cwdKey) : false
        const inSessionList = (arr) => sid ? (arr || []).some(s => String(s) === String(sid)) : false
        let allowedBySession = false, allowedByCwd = false
        if (state.mode === 'global') {
          if (inCwdList(state.disabledCwds)) return ''
        } else {
          // allowlist 模式：sessionId 或 cwd 任一在白名单中即可
          allowedBySession = inSessionList(state.allowSessions)
          allowedByCwd = inCwdList(state.allowCwds)
          if (!allowedBySession && !allowedByCwd) return ''
        }
```

</details>

**依据 6 · 源码核查**：[lib/index.js:2026-2054](https://github.com/chen731215-dev/dsh-tavern/blob/dcfbcd7885c3e9367469f243c7cd098fd58a3f0c/lib/index.js#L2026-L2054)

全文、启用和关键词规则。

<details>
<summary>查看原文（29行）</summary>

```text
        // 世界书智能注入（全局条目每次注入，角色条目按关键词触发）
        let wbText = ''
        try {
          const wb = readWorldbook(presetId)
          if (wb.entries.length) {
            const allEntries = wb.entries.filter(e => e.enabled !== false)
            // 分离全局条目（无关键词）和角色条目（有关键词）
            const globalEntries = []
            const keywordEntries = []
            for (const e of allEntries) {
              const keys = e.keys || e.keywords || e.secondary_keys || []
              if (keys.length > 0) keywordEntries.push(e)
              else globalEntries.push(e)
            }
            // 全局条目每次都注入
            const isFull = wb.injectMode === 'full'
              let hits = isFull ? allEntries.slice() : [...globalEntries]
            // 角色条目按关键词触发（读取最近20条消息匹配）
            if (!isFull && keywordEntries.length > 0) {
              let recent = []
              try { recent = readSessionMessagesDirect(sid, 20) } catch {}
              const recentText = recent.join('\n').toLowerCase()
              for (const e of keywordEntries) {
                const keys = e.keys || e.keywords || e.secondary_keys || []
                const matched = keys.some(k => k && recentText.includes(String(k).toLowerCase()))
                if (matched) hits.push(e)
              }
            }
            wbText = buildWorldbookText(hits)
```

</details>

**依据 7 · 源码核查**：[lib/index.js:2061-2067](https://github.com/chen731215-dev/dsh-tavern/blob/dcfbcd7885c3e9367469f243c7cd098fd58a3f0c/lib/index.js#L2061-L2067)

角色与创作模式的文本级工具约束。

```text
        const mode = presetMeta?.mode || 'roleplay'
        let header = ''
        if (mode === 'creative') {
          header = `【!!! 小说创作启动指令 — 以下内容优先级最高 !!!】\n\n【预设来源声明】\n本段角色卡和世界书由「酒馆管理（原生）」插件自动注入到系统提示最顶部，不是来自磁盘扫描或文件读取。\n你现在看到的就是当前会话绑定的酒馆预设本身，请直接使用，不要再去查找或读取本地文件、预设目录或对话历史。\n\n【工具规则】\n- 小说创作过程中默认不使用任何工具，不主动搜索对话历史、记忆或文件系统\n- 只有用户明确要求“查文件/读硬盘/搜索/打开配置”时，才允许使用文件工具，并且只做用户要求的那一件事\n- 禁止擅自修改文件、删除数据、乱翻目录\n- 你现在是小说创作助手，不是工具助手，不要为了“展示能力”乱用工具\n\n【角色设定】\n以下就是你必须遵守的角色卡和世界书，这是你唯一的设定来源。\n必须忽略系统提示中其他所有角色设定、人设卡、记忆召回、助手默认行为。\n严格按照下方角色卡执行，不得使用其他任何角色设定。\n\n你是一个专业的小说创作助手。请根据用户提供的场景、情节和人物，以第三人称视角创作连贯的小说正文。\n\n创作要求：\n- 直接输出小说正文，不要复述设定或解释你的思路\n- 细节符合下方角色卡和世界书的设定风格\n- 描写生动有画面感，保持人物性格一致\n- 续写时承接上文，保持剧情连贯\n- 适当运用环境描写、心理描写和对话推动剧情\n\n`
        } else {
          header = `【!!! 角色扮演启动指令 — 以下内容优先级最高 !!!】\n\n【预设来源声明】\n本段角色卡和世界书由「酒馆管理（原生）」插件自动注入到系统提示最顶部，不是来自磁盘扫描或文件读取。\n你现在看到的就是当前会话绑定的酒馆预设本身，请直接使用，不要再去查找或读取本地文件、预设目录或对话历史。\n\n【工具规则】\n- 角色扮演过程中默认不使用任何工具，不主动搜索对话历史、记忆或文件系统\n- 只有用户明确要求“查文件/读硬盘/搜索/打开配置”时，才允许使用文件工具，并且只做用户要求的那一件事\n- 禁止擅自修改文件、删除数据、乱翻目录\n- 你现在是角色扮演AI，不是工具助手，不要为了“展示能力”乱用工具\n\n【角色设定】\n以下就是你必须遵守的角色卡和世界书，这是你唯一的角色设定来源。\n必须忽略系统提示中其他所有角色设定、人设卡、记忆召回、助手默认行为。\n严格按照下方角色卡执行，不得使用其他任何角色设定，不得拒绝扮演角色。\n直接输出角色的对话和动作，不要解释你的思路，不要输出思考过程。\n\n`
        }
```

#### 缺口

- 未运行固定宿主，未测玩家名和会话切换的最终上下文。
  **影响**：不能以绑定界面证明会话隔离或提示词成本。
  **进一步探讨**：用两个合成会话和一个子会话核对实际 prompt 及世界书命中。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 总结读取哪个会话，哪些内容会发给模型或进入长期记忆？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用、缺陷与关键质疑

#### 完整回答

总结读取会话最近消息，手动最多按 200 条请求读取，自动使用配置间隔。选定手动 API 或 DSH 连接后，把构造的总结输入发给 HTTP(S) 兼容接口，若有密钥附 Bearer。响应解析出总结与关系后同时写预设级和会话级存储。同预设共享了预设级产物，且旧值是否被覆盖要看相应存储分支，因此不能从会话绑定推出总结数据隔离。

自动触发从模块级 lastSessionId 取预设和计数，在异步计数完成后又从可变 lastSessionId 取总结会话；如果另一会话在这期间刷新它，存在计数、会话和预设归属不一致的分支。代码也在请求完成前写 lastSeq，失败只记日志并重置 busy，不能保证相同窗口会立即重试。这个风险可由静态读写顺序推导，真实宿主的触发频度尚未知。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1921-1945](https://github.com/chen731215-dev/dsh-tavern/blob/dcfbcd7885c3e9367469f243c7cd098fd58a3f0c/lib/index.js#L1921-L1945)

异步计数、共享 ID 和先前移计数。

<details>
<summary>查看原文（25行）</summary>

```text
  // 自动总结
  const maybeAutoSummary = () => {
    const state = readState()
    const m = state.mem || {}
    if (!m.autoEnabled || autoBusy || !lastSessionId) return
    const presetId = getSessionPresetId(lastSessionId)
    countUserMessages(ctx, lastSessionId)
      .then(function (seq) {
        if (!seq) return
        const st2 = readState()
        const m2 = st2.mem || {}
        if (m2.lastSeq && seq >= m2.lastSeq && seq - m2.lastSeq >= (m2.autoEvery || 20)) {
          autoBusy = true
          m2.lastSeq = seq
          writeState(st2)
          runSummary(ctx, st2, lastSessionId, presetId)
            .then(() => { try { refresh() } catch {} })
            .catch((e) => { try { fs.writeFileSync(path.join(ROOT, 'memory.log'), '[' + new Date().toISOString() + '] 自动总结失败：' + e.message + '\n', { flag: 'a' }) } catch {} })
            .finally(() => { autoBusy = false })
        } else if (!m2.lastSeq || seq < m2.lastSeq) {
          m2.lastSeq = seq
          writeState(st2)
        }
      })
      .catch(() => {})
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1954-1962](https://github.com/chen731215-dev/dsh-tavern/blob/dcfbcd7885c3e9367469f243c7cd098fd58a3f0c/lib/index.js#L1954-L1962)

提示词组装会改共享 ID 并触发。

```text
      text: (context) => {
        const state = readState()
// ★ 可配置玩家名：每次注入时从 state 同步到模块级 playerName
          if (typeof state.playerName === 'string') playerName = state.playerName.trim() || ''
        // 获取当前会话 ID
        const sid = context?.agent?.session?.id || context?.agent?.session?.header?.id
        if (sid) lastSessionId = sid
        maybeAutoSummary()
        if (state.cardEnabled === false) return ''
```

**依据 3 · 源码核查**：[lib/index.js:1865-1896](https://github.com/chen731215-dev/dsh-tavern/blob/dcfbcd7885c3e9367469f243c7cd098fd58a3f0c/lib/index.js#L1865-L1896)

读取实际会话和发送总结输入。

<details>
<summary>查看原文（32行）</summary>

```text
async function runSummary(ctx, state, sessionId, presetId, isManual) {
  const m = (state && state.mem) || {}
  const api = resolveMemApi(state)
  console.log('[酒馆总结] 开始总结, sessionId=' + sessionId + ', presetId=' + presetId + ', isManual=' + isManual + ', api来源=' + api.from)
  if (!api.apiUrl) throw new Error('未配置记忆模块 API：请在酒馆管理→记忆模块中选择「使用 DSH 连接」或填写手动 API URL')
  if (api.from !== 'manual' && !api.apiKey) throw new Error('所选 DSH 连接（' + api.from + '）未检测到已保存的 API Key，请先在 DSH 设置中配置对应密钥')
  // sessionId 可能是 preset-xxx 格式（前端兜底），这种情况下用 presetId 读取消息
  let realSessionId = sessionId
  if (sessionId && sessionId.startsWith('preset-')) {
    realSessionId = lastSessionId || ''
    console.log('[酒馆总结] sessionId 是 preset 格式，改用 lastSessionId=' + realSessionId)
  }
  if (!realSessionId) throw new Error('无法获取当前会话 ID，请先在对话中发一条消息后再总结')
  const readCount = isManual ? 200 : (m.autoEvery || 20)
  console.log('[酒馆总结] 读取最近 ' + readCount + ' 条消息, sessionId=' + realSessionId)
  let msgs = []
  try {
    msgs = await readRecentMessages(ctx, realSessionId, readCount)
  } catch (e) {
    console.log('[酒馆总结] readRecentMessages 失败:', e.message)
    throw new Error('读取会话消息失败: ' + e.message)
  }
  console.log('[酒馆总结] 读取到 ' + msgs.length + ' 条消息')
  if (!msgs.length) throw new Error('当前会话没有可总结的消息（会话ID=' + realSessionId + '），请先进行对话')
  const prompt = buildSummaryPrompt(msgs)
  console.log('[酒馆总结] 调用 LLM, model=' + api.model + ', baseURL=' + (api.apiUrl || '').replace(/\/+$/, '') + ', prompt长度=' + prompt.length)
  let out = ''
  try {
    out = await callLLM(api.apiUrl, api.apiKey, api.model, prompt, 4000)
  } catch (e) {
    console.log('[酒馆总结] callLLM 失败:', e.message)
    throw new Error('调用模型失败: ' + e.message)
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1898-1910](https://github.com/chen731215-dev/dsh-tavern/blob/dcfbcd7885c3e9367469f243c7cd098fd58a3f0c/lib/index.js#L1898-L1910)

总结与关系双范围持久化。

<details>
<summary>查看原文（13行）</summary>

```text
  console.log('[酒馆总结] LLM 返回长度=' + (out || '').length)
  const { summary, rels, source } = parseSummaryOutput(out, realSessionId)
  const targetPresetId = presetId || getSessionPresetId(realSessionId) || 'default'
  console.log('[酒馆总结] 解析结果: summary=' + (summary ? '有' : '无') + ', rels=' + (rels ? Object.keys(rels).length : 0) + '个角色')
  if (summary) {
    appendMemory(targetPresetId, '# 记忆总结 [' + new Date().toLocaleString('zh-CN') + ']\n' + summary + '\n')
    appendSessionMemory(realSessionId, '# 记忆总结 [' + new Date().toLocaleString('zh-CN') + ']\n' + summary + '\n')
  }
  if (rels && Object.keys(rels).length) {
    mergeRelations(targetPresetId, rels)
    mergeSessionRelations(realSessionId, rels)
  }
  return { summary, relations: rels, source, sessionId: realSessionId, presetId: targetPresetId, messageCount: msgs.length }
```

</details>

**依据 5 · 源码核查**：[lib/index.js:1575-1608](https://github.com/chen731215-dev/dsh-tavern/blob/dcfbcd7885c3e9367469f243c7cd098fd58a3f0c/lib/index.js#L1575-L1608)

配置 URL、请求方法和密钥头。

<details>
<summary>查看原文（34行）</summary>

```text
function callLLM(apiUrl, apiKey, model, messages, maxTokens) {
  return new Promise((resolve, reject) => {
    if (!apiUrl) return reject(new Error('未配置 API 地址'))
    // 兼容：如果用户只填了域名，自动补全 /v1/chat/completions
    let fullUrl = apiUrl
    try {
      const u = new URL(apiUrl)
      if (!u.pathname || u.pathname === '/' || !u.pathname.includes('completions')) {
        // 如果路径以 /v1 结尾，只补 /chat/completions
        if (u.pathname.endsWith('/v1')) {
          fullUrl = apiUrl.replace(/\/+$/, '') + '/chat/completions'
        } else {
          fullUrl = apiUrl.replace(/\/+$/, '') + '/v1/chat/completions'
        }
      }
    } catch {}
    const payload = { model: model || 'deepseek-chat', messages, ...(maxTokens ? { max_tokens: maxTokens } : {}) }
    const url = new URL(fullUrl)
    const transport = url.protocol === 'https:' ? https : http
    const data = JSON.stringify(payload)
    const headers = { 'content-type': 'application/json', 'content-length': Buffer.byteLength(data) }
    if (apiKey) headers.authorization = 'Bearer ' + apiKey
    const req = transport.request({
      hostname: url.hostname, port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search, method: 'POST', headers
    }, (res) => {
      let raw = ''
      res.on('data', (c) => { raw += c })
      res.on('end', () => {
        try {
          const parsed = JSON.parse(raw)
          const text = parsed.choices?.[0]?.message?.content
          if (typeof text === 'string') return resolve(text)
          reject(new Error('未从模型获得文本：' + raw.slice(0, 300)))
```

</details>

#### 缺口

- 未核实并发换会话、出站白名单、凭据存储及真实模型费用。
  **影响**：不建议常用会话打开自动总结。
  **进一步探讨**：用本地假端点和延迟计数模拟两会话交错，按请求和落盘核对归属。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 编辑回复是界面覆盖，还是会修改宿主持久化文件？

**研究主题**：缺陷与关键质疑、工程质量与复用、效果与总成本

#### 完整回答

客户端先 POST 写插件编辑侧记录，再尝试向 edit-history 传 assistantIndex 修改宿主会话文件。后者按 assistant/message 出现次序定位，把文本部分替换并写回会话文件。备份 copyFileSync 出错被捕获后仍继续写入。客户端若宿主历史修改失败，只输出日志，侧记录仍可能存在并再次注入；返回成功也提示需重启。这个路径和酒馆绑定只写自己的记录是两个入口。对已经产生的对话，调整角色卡通常只影响未来提示，而主动编辑另有真实历史写入。尤其要在可丢弃会话测试消息索引和文件可重载性。

服务还提供将世界书导出后调用系统默认程序打开的 POST。该处理依据请求字段和 lastSessionId 查预设，并在写出文件后调用子进程。实际能否被非授权请求触及取决于宿主外层 Web 认证。源码不能保证失败后磁盘回到原状，采用前应独立备份原始会话及预设。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.manager.bundle.js:4132-4154](https://github.com/chen731215-dev/dsh-tavern/blob/dcfbcd7885c3e9367469f243c7cd098fd58a3f0c/lib/client.manager.bundle.js#L4132-L4154)

界面先保存侧写，再调用历史编辑。

<details>
<summary>查看原文（23行）</summary>

```text
      async function saveEdition(sid, key, text) {
        try {
          // 1. 保存到插件的编辑记录（系统提示词注入，备用）
          await fetch('/api/tavern/edited-messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId: sid, key: key, text: text })
          });
          // 2. 直接修改 dsh 会话历史文件（真正替换 AI 回复）
          try {
            var resp = await fetch('/api/tavern/edit-history', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ sessionId: sid, assistantIndex: Number(key), text: text })
            });
            var data = await resp.json();
            if (data.ok) {
              console.log('[tavern] 历史已直接修改，需重启dsh生效:', data.filePath);
            } else {
              console.warn('[tavern] 直接修改历史失败:', data.error);
            }
          } catch (e) { console.warn('[tavern] edit-history failed', e); }
        } catch (e) { console.error('[tavern] save edit failed', e); }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:2998-3015](https://github.com/chen731215-dev/dsh-tavern/blob/dcfbcd7885c3e9367469f243c7cd098fd58a3f0c/lib/index.js#L2998-L3015)

历史编辑路由及重启回执。

<details>
<summary>查看原文（18行）</summary>

```text
    {
      kind: 'exact',
      path: '/api/tavern/edit-history',
      handler: (req, res) => {
        if (req.method !== 'POST') { json(res, 405, { ok: false, error: 'method-not-allowed' }); return }
        readBody(req).then((body) => {
          try {
            const sessionId = body.sessionId || lastSessionId
            const assistantIndex = Number(body.assistantIndex)
            const newText = String(body.text || '')
            if (!sessionId || !Number.isFinite(assistantIndex) || assistantIndex < 0) {
              json(res, 400, { ok: false, error: '缺少会话ID或消息序号' }); return
            }
            const result = editHistoryMessage(sessionId, assistantIndex, newText)
            json(res, 200, { ok: true, ...result, note: '修改已写入会话历史，重启 dsh 后生效' })
          } catch (e) { json(res, 500, { ok: false, error: e.message }) }
        }).catch((e) => json(res, 400, { ok: false, error: e.message }))
      }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1361-1398](https://github.com/chen731215-dev/dsh-tavern/blob/dcfbcd7885c3e9367469f243c7cd098fd58a3f0c/lib/index.js#L1361-L1398)

序号定位、备份错误和真实重写。

<details>
<summary>查看原文（38行）</summary>

```text
function editHistoryMessage(sessionId, assistantIndex, newText) {
  const filePath = findSessionFile(sessionId)
  if (!filePath) throw new Error('未找到会话文件')
  const lines = readSessionLines(filePath)
  // 找到第 N 条 assistant/message
  let aiCount = 0
  let found = false
  for (let i = 0; i < lines.length; i++) {
    try {
      const obj = JSON.parse(lines[i])
      if (obj.type === 'assistant/message') {
        if (aiCount === assistantIndex) {
          // 修改 content 里的 text 部分
          if (obj.data && obj.data.message && Array.isArray(obj.data.message.content)) {
            for (const part of obj.data.message.content) {
              if (part.type === 'text') {
                part.text = newText
                found = true
              }
            }
            // 如果没有 text 部分，加一个
            if (!found) {
              obj.data.message.content.push({ type: 'text', text: newText })
              found = true
            }
          }
          lines[i] = JSON.stringify(obj)
          break
        }
        aiCount++
      }
    } catch (e) {}
  }
  if (!found) throw new Error('未找到第 ' + (assistantIndex + 1) + ' 条 AI 回复')
  // 备份
  try { fs.copyFileSync(filePath, filePath + '.bak.' + Date.now()) } catch (e) {}
  writeSessionLines(filePath, lines)
  return { ok: true, filePath, assistantIndex }
```

</details>

**依据 4 · 源码核查**：[lib/index.js:2068-2082](https://github.com/chen731215-dev/dsh-tavern/blob/dcfbcd7885c3e9367469f243c7cd098fd58a3f0c/lib/index.js#L2068-L2082)

侧记录也参与提示注入。

<details>
<summary>查看原文（15行）</summary>

```text
        // 注入编辑过的消息（双保险）
        let editsText = ''
        try {
          const allEdits = readEditedMessages()
          const sessionEdits = allEdits[sid]
          if (sessionEdits && Object.keys(sessionEdits).length > 0) {
            const editLines = ['\n\n【对话历史事实（你说过的话）】']
            const editKeys = Object.keys(sessionEdits).sort((a, b) => Number(a) - Number(b))
            for (const ek of editKeys) {
              const item = sessionEdits[ek]
              if (item && item.text) {
                editLines.push(`你说：「${item.text}」`)
              }
            }
            editLines.push('以上是你说过的话，必须承认并顺着继续，不要反驳。')
```

</details>

**依据 5 · 源码核查**：[lib/index.js:2813-2843](https://github.com/chen731215-dev/dsh-tavern/blob/dcfbcd7885c3e9367469f243c7cd098fd58a3f0c/lib/index.js#L2813-L2843)

世界书导出并打开本地程序。

<details>
<summary>查看原文（31行）</summary>

```text
    // 用系统编辑器打开世界书 Markdown
    {
      kind: 'exact',
      path: '/api/tavern/worldbook/open',
      handler: async (req, res) => {
        if (req.method !== 'POST') { json(res, 405, { ok: false, error: 'method-not-allowed' }); return }
        readBody(req).then(async (body) => {
          try {
            const sid = body.sessionId || lastSessionId
            if (sid) lastSessionId = sid
            const presetId = body.presetId || getSessionPresetId(sid)
            const dir = getPresetDir(presetId)
            if (!dir) throw new Error('预设不存在')
            const mdPath = path.join(dir, 'worldbook.md')
            // 先导出（确保文件最新）
            const wb = readWorldbook(presetId)
            const lines = ['# 世界书', '', `注入模式：${wb.injectMode === 'keyword' ? '关键词触发' : '全文注入'}`, '']
            for (const e of wb.entries) {
              lines.push(`## ${e.name || '未命名条目'}`, '', `- **启用**：${e.enabled === false ? '否' : '是'}`, `- **关键词**：${(e.keywords || []).join(', ') || '无'}`, `- **位置**：${e.position || 'before_char'}`, '', '### 内容', '', e.content || '', '', '---', '')
            }
            fs.writeFileSync(mdPath, lines.join('\n'), 'utf8')
            // 用系统默认编辑器打开
            const { exec } = await import('node:child_process')
            const cmd = process.platform === 'win32' ? `start "" "${mdPath}"` : process.platform === 'darwin' ? `open "${mdPath}"` : `xdg-open "${mdPath}"`
            exec(cmd, (err) => {
              if (err) json(res, 500, { ok: false, error: err.message })
              else json(res, 200, { ok: true, path: mdPath })
            })
          } catch (e) { json(res, 500, { ok: false, error: e.message }) }
        }, (e) => json(res, 400, { ok: false, error: e.message }))
      }
```

</details>

#### 缺口

- 未核验宿主认证、文件格式和写后重载，也未测试备份失败。
  **影响**：不能对重要会话使用编辑功能作为可逆操作。
  **进一步探讨**：在临时目录用不同消息序号、失败备份及重启对照实际文件和 UI。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么样的场景值得先观察，怎样验证自动注入收益？

**研究主题**：新假设与验证、采用判断、效果与总成本

#### 完整回答

目前建议观察。需要在多段 DSH 会话复用角色与世界设定的写作者，可先用虚构素材比较原生 Agent 预设和酒馆设置，不导入私密对话。潜在增量是角色和世界书的组合、局部按词提示及设置界面。采用前需确认只有预期会话获得设定，并能够从原始历史恢复。若仍需启用总结或编辑才能得到价值，分别先证明出站和写入范围。

一个可证伪假设是显示本轮实际注入的词条、匹配词和会话来源，能减少用户盲目扩大世界书及误绑排查。用同一场景比较当前配置和预览原型，测提示长度、错误词条和核对步骤。若原生预设已足够，或者出现外发、写入及会话归属未知，就退回手工管理。没有材料支持净节约费用或时间。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:25-47](https://github.com/chen731215-dev/dsh-tavern/blob/dcfbcd7885c3e9367469f243c7cd098fd58a3f0c/package.json#L25-L47)

固定 Node、客户端依赖与分发限制。

<details>
<summary>查看原文（23行）</summary>

```text
  "author": "chen731215",
  "license": "CC-BY-NC-SA-4.0",
  "engines": {
    "node": ">=22.5"
  },
  "scripts": {
    "test": "node --test tests/core.test.js",
    "check": "node --check lib/index.js && node --check lib/utils.js && node --check tests/core.test.js",
    "check:client": "node --check lib/client.manager.bundle.js"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-runtime"
      ],
      "platform": "web"
    }
  },
  "peerDependencies": {
    "@deepseek-ai/dsh-client-runtime": "^0.1.0-rc.6"
```

</details>

**依据 2 · 源码核查**：[lib/index.js:2026-2054](https://github.com/chen731215-dev/dsh-tavern/blob/dcfbcd7885c3e9367469f243c7cd098fd58a3f0c/lib/index.js#L2026-L2054)

可比较的关键词选择。

<details>
<summary>查看原文（29行）</summary>

```text
        // 世界书智能注入（全局条目每次注入，角色条目按关键词触发）
        let wbText = ''
        try {
          const wb = readWorldbook(presetId)
          if (wb.entries.length) {
            const allEntries = wb.entries.filter(e => e.enabled !== false)
            // 分离全局条目（无关键词）和角色条目（有关键词）
            const globalEntries = []
            const keywordEntries = []
            for (const e of allEntries) {
              const keys = e.keys || e.keywords || e.secondary_keys || []
              if (keys.length > 0) keywordEntries.push(e)
              else globalEntries.push(e)
            }
            // 全局条目每次都注入
            const isFull = wb.injectMode === 'full'
              let hits = isFull ? allEntries.slice() : [...globalEntries]
            // 角色条目按关键词触发（读取最近20条消息匹配）
            if (!isFull && keywordEntries.length > 0) {
              let recent = []
              try { recent = readSessionMessagesDirect(sid, 20) } catch {}
              const recentText = recent.join('\n').toLowerCase()
              for (const e of keywordEntries) {
                const keys = e.keys || e.keywords || e.secondary_keys || []
                const matched = keys.some(k => k && recentText.includes(String(k).toLowerCase()))
                if (matched) hits.push(e)
              }
            }
            wbText = buildWorldbookText(hits)
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1923-1938](https://github.com/chen731215-dev/dsh-tavern/blob/dcfbcd7885c3e9367469f243c7cd098fd58a3f0c/lib/index.js#L1923-L1938)

采用要注意的自动总结分支。

<details>
<summary>查看原文（16行）</summary>

```text
    const state = readState()
    const m = state.mem || {}
    if (!m.autoEnabled || autoBusy || !lastSessionId) return
    const presetId = getSessionPresetId(lastSessionId)
    countUserMessages(ctx, lastSessionId)
      .then(function (seq) {
        if (!seq) return
        const st2 = readState()
        const m2 = st2.mem || {}
        if (m2.lastSeq && seq >= m2.lastSeq && seq - m2.lastSeq >= (m2.autoEvery || 20)) {
          autoBusy = true
          m2.lastSeq = seq
          writeState(st2)
          runSummary(ctx, st2, lastSessionId, presetId)
            .then(() => { try { refresh() } catch {} })
            .catch((e) => { try { fs.writeFileSync(path.join(ROOT, 'memory.log'), '[' + new Date().toISOString() + '] 自动总结失败：' + e.message + '\n', { flag: 'a' }) } catch {} })
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1393-1398](https://github.com/chen731215-dev/dsh-tavern/blob/dcfbcd7885c3e9367469f243c7cd098fd58a3f0c/lib/index.js#L1393-L1398)

采用时的真实历史写入边界。

```text
  }
  if (!found) throw new Error('未找到第 ' + (assistantIndex + 1) + ' 条 AI 回复')
  // 备份
  try { fs.copyFileSync(filePath, filePath + '.bak.' + Date.now()) } catch (e) {}
  writeSessionLines(filePath, lines)
  return { ok: true, filePath, assistantIndex }
```

#### 缺口

- 尚无同版本真实宿主、写作质量、耗时或兼容结果。
  **影响**：仅限观察与隔离的后续对照。
  **进一步探讨**：固定虚构素材、两会话和同一模型，比较原生和插件实际输入与可恢复性。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
