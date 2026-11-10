# dsh-skill-picker

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[78af8bf](https://github.com/a735624258/dsh-skill-picker/tree/78af8bf5a5947570bd159ab6329c3e69de26e5e1)

<!-- BEGIN META -->
[![GitHub ★ 44](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=44&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/a735624258/dsh-skill-picker) [![npm 30d 3,751](https://img.shields.io/static/v1?label=npm+30d&message=3%2C751&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-skill-picker) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-skill-picker)
<!-- END META -->

> **功能**：为 DSH Web 提供已安装 Skill 的可搜索面板、斜杠补全和本机 Skill 管理。

> **亮点**：将中文和拼音发现、置顶与使用排序接入面板和原生补全，并复用 DSH 的调用手势。见 [Q01](#research-q01) 与 [Q02](#research-q02)。

> **主要限制**：管理根依赖请求提供的 cwd，词法路径允许跟随目录链接。固定头不能证明调用者身份，共用状态没有按用户或 Session 分文件。见 [Q03](#research-q03)。

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
  - [Q01 · 用户选择 Skill 后什么进入草稿和模型流程？](#detail-section-11)
  - [Q02 · 两个列表和搜索如何接线，什么时候退化？](#detail-section-12)
  - [Q03 · 管理动作和共用状态的边界是什么？](#detail-section-13)
  - [Q04 · 哪些环境适合先观察，怎样验证后才试用？](#detail-section-14)
  - [Q05 · 如何判断中文、拼音与排序提高选对率？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有较多 DSH Skill、记不住短名的用户，可从描述、拼音和最近记录找到目标并插入草稿。见 [Q01](#research-q01)。

原生斜杠菜单和手写调用手势已经能选择与调用 Skill。插件减少记忆短名的要求，并保留用户发送与宿主载入步骤。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 搜索面板 | 用描述、拼音和使用记录选 Skill | 点选写草稿，发送后由 DSH 处理 |
| 斜杠菜单 | 重排原生候选 | 依赖可包装来源和当前 Session |
| 文件管理 | 停用、备份、恢复和定位 | cwd 来自客户端，需核验宿主授权 |
| 共用状态 | 同宿主浏览器共享置顶与历史 | 整份快照，没有租户分文件 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web、webServer 与 systemPrompt | 主机需要 | 注册路由及提示区段 | 核对实际 profile 接线 |
| 输入插槽、sessions、inputTriggers | 客户端需要 | 读取会话并提供入口 | 检查版本和原生补全 |
| 官方 Skills RPC | 官方列表需要 | 按 Session 取目录 | 回退扫描项目和用户根 |
| 可控文件权限和可信宿主访问 | 文件管理需要 | 隔离 cwd 和链接边界 | 先核对实际授权 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 1 | 用户固定工件和宿主，用独立目录 | 重启确认插槽与列表 |
| 2 | 用合成 Skill 查找、点选和发送 | 核对草稿、原生载入与授权 |
| 3 | 在副本验证管理、拒绝和恢复 | 核对真实路径与清单 |
| 4 | 用户按需要移除试验 profile 插件 | 重启并清点已变更文件 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 依赖已有 DSH 环境，费用未知 | 安装、重启与宿主配置核验 | 用时未知 |
| 持续 | 本机扫描与状态写入 | 查找、纠错、版本维护 | 实际加载与跨端一致性未量化 |
| 失败恢复 | 备份和测试副本空间 | 核对目录、状态和备份清单 | 清单失败与竞态需实测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 技能发现 | 名称、描述、拼音及排序 | 实际节省时间和误选率 |
| 原生调用衔接 | 草稿附加和复用原生选中 | 目标宿主实际载入成功率 |
| 管理及跨端状态 | 宿主文件操作、单文件和本地镜像 | 多用户隔离、恢复及并发结果 |

> **思考**：管理根依赖请求提供的 cwd，词法路径允许跟随目录链接。固定头不能证明调用者身份，共用状态没有按用户或 Session 分文件。见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将中文和拼音发现、置顶与使用排序接入面板和原生补全，并复用 DSH 的调用手势。见 [Q01](#research-q01) 与 [Q02](#research-q02)。

运行时包装复用原生候选并按 Session 缓存。管理使用宿主文件 API，备份动作分步，共用状态整份写入。见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

管理根依赖请求提供的 cwd，词法路径允许跟随目录链接。固定头不能证明调用者身份，共用状态没有按用户或 Session 分文件。见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察个人本机与独立 profile，使用合成 Skill。接入共享宿主前需验证请求身份、可信工作区、链接及状态隔离。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持接线、搜索、草稿更新及宿主路由的权限和文件状态边界。真实可达性、浏览器兼容性和查找效果待验。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、package.json、src/client/index.jsx、src/client/shared-state.js、src/client/slash-source.js、src/dir-entry.js、src/index.js、src/patch-ui-skill.js、src/skill-ops.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：限固定根插件宿主、浏览器入口、候选、文件管理、共享状态和旧补丁恢复。未执行目标、测试、宿主或模型。
- 下一步：在固定宿主和隔离 profile 比较原生与增强菜单，并用合成目录验证授权、链接、失败恢复、并发与载入。

**分析版本**

- **仓库**：[a735624258/dsh-skill-picker](https://github.com/a735624258/dsh-skill-picker)
- **版本号**：0.5.29（[固定提交 78af8bf](https://github.com/a735624258/dsh-skill-picker/tree/78af8bf5a5947570bd159ab6329c3e69de26e5e1)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

在候选较多时，任务词、拼音和近期排序可能缩短选中正确 Skill 的时间，以宿主实际载入作最终判据。见 [Q05](#research-q05)。

在固定宿主和隔离 profile 比较原生与增强菜单，并用合成目录验证授权、链接、失败恢复、并发与载入。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 56 | 34 | 17 | — |
| .md | source | 2 | 516 | — | — | 6052 |
| .js | source | 9 | 29727 | 28759 | 883 | — |
| .jsx | source | 1 | 1473 | 969 | 443 | — |
| .mjs | test | 8 | 1496 | 1114 | 210 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-10），可前往 [GitHub Issues](https://github.com/a735624258/dsh-skill-picker/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：当 DSH 用户记不住已装 Skill 的短名时，选择器能否缩短选中正确 Skill 的时间，并保持宿主调用和文件管理的权限边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户选择 Skill 后什么进入草稿和模型流程？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

安装较多 Skill 且记不住 kebab-case 名称的 DSH 用户，可以从输入框旁搜索描述、拼音或英文，选择后补写任务。固定 0.5.29 的根包有 host 和 Web 客户端导出。bundle 插入宿主，客户端注册 conversation.input.right。点选将斜杠名和空格附加到现有草稿，再尝试把焦点放回输入区。插件自身没有在此步骤提交消息或读入 Skill 正文给模型，用户发送后由 DSH 原生手势路径决定加载。宿主另注册模型提示区段，告诉 Agent 选择器存在及用法。选中后无论 setDraft 成功与否都尝试更新使用计数，点击数也不能表示消息已经发送、授权或成功执行。相对记住并手写斜杠名，增量集中在发现和输入，不改变 DSH 原生调用判断。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-12](https://github.com/a735624258/dsh-skill-picker/blob/78af8bf5a5947570bd159ab6329c3e69de26e5e1/package.json#L2-L12)

根包身份、版本、主机和客户端入口。

<details>
<summary>查看原文（11行）</summary>

```text
  "name": "dsh-skill-picker",
  "description": "DSH Web GUI skill picker: a button beside the composer opens a searchable list of installed skills; picking one inserts the official `/skill-name` gesture into the input box, so the skill loads with your message (WorkBuddy-style skill invocation for DeepSeek Harness).",
  "version": "0.5.29",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json",
    "./locale/*": "./locale/*"
  },
```

</details>

**依据 2 · 源码核查**：[package.json:21-48](https://github.com/a735624258/dsh-skill-picker/blob/78af8bf5a5947570bd159ab6329c3e69de26e5e1/package.json#L21-L48)

Web profile、bundle 与声明兼容性。

<details>
<summary>查看原文（28行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-locale"
      ],
      "platform": "web"
    },
    "compatibility": {
      "dshReleases": {
        "0.1.1-rc.1": "unknown",
        "0.1.1-rc.2": "compatible",
        "0.1.2-alpha.2": "compatible",
        "0.1.2-alpha.3": "compatible",
        "0.1.2-alpha.4": "compatible",
        "0.1.2-alpha.5": "compatible",
        "0.1.2-rc.1": "compatible",
        "0.1.5-rc.1": "compatible",
        "0.1.5-rc.2": "compatible",
        "0.1.7-rc.1": "unknown",
        "0.1.7-rc.2": "unknown",
        "0.2.0-rc.1": "compatible",
        "0.2.0-rc.2": "compatible"
      }
    }
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:6-12](https://github.com/a735624258/dsh-skill-picker/blob/78af8bf5a5947570bd159ab6329c3e69de26e5e1/cordis.patch.yml#L6-L12)

根插件挂载。

```text
# The row is a bare plugin by package name: the node half (exports ".") runs
# in the host process (skills catalog route + agent guidance section), and the
# `dsh.client` declaration in package.json makes the browser half
# (exports "./client") load in the web GUI.
- insert:
    - id: dsh-skill-picker
      name: 'dsh-skill-picker'
```

**依据 4 · 源码核查**：[src/client/index.jsx:898-933](https://github.com/a735624258/dsh-skill-picker/blob/78af8bf5a5947570bd159ab6329c3e69de26e5e1/src/client/index.jsx#L898-L933)

追加实时草稿、记录点选、恢复焦点。

<details>
<summary>查看原文（36行）</summary>

```text
  const pick = (name) => {
    // Draft source: the render-time mirror of the live input store (see the
    // `draftRef` sync above). Appending onto anything else risks overwriting
    // the user's typed draft with a stale snapshot.
    const draft = draftRef.current
    const separator = draft === '' || draft.endsWith(' ') || draft.endsWith('\n') ? '' : ' '
    const next = `${draft}${separator}/${name} `
    try {
      if (typeof props.inputActions?.setDraft === 'function') {
        props.inputActions.setDraft(next)
      } else {
        console.error('[dsh-skill-picker] inputActions.setDraft unavailable; draft not written:', next)
      }
    } catch (cause) {
      console.error('[dsh-skill-picker] setDraft failed:', cause)
    }

    // Record usage for ordering (recent first, then frequent).
    const nextUsage = { ...usage, [name]: { count: (usage[name]?.count ?? 0) + 1, lastUsed: Date.now() } }
    setUsage(nextUsage)
    saveUsage(nextUsage)

    setOpen(false)
    setQuery('')

    // Put the caret back in the composer (see `focusComposer`). In a rAF so the
    // panel has unmounted and React has flushed the draft write first.
    const from = boxRef.current
    window.requestAnimationFrame(() => {
      focusComposer(from)
      // Second, guarded seat: a rich editor may re-apply its own selection
      // right after being focused, which would drop the caret back to the
      // start. Re-assert the end caret shortly after — but only if the composer
      // still holds focus, so a fast click elsewhere is never overridden.
      window.setTimeout(() => focusComposer(from, true), 60)
    })
```

</details>

**依据 5 · 源码核查**：[src/client/index.jsx:1392-1409](https://github.com/a735624258/dsh-skill-picker/blob/78af8bf5a5947570bd159ab6329c3e69de26e5e1/src/client/index.jsx#L1392-L1409)

原生输入区插槽接线。

<details>
<summary>查看原文（18行）</summary>

```text
    const PickerWithCwd = (props) => {
      const cwd = useWorkspaceCwd(props)
      return React.createElement(SkillPickerButton, {
        ...props,
        cwd: cwd === '' ? legacyCwd : cwd,
        listSkills,
      })
    }
    const dispose = ctx.slots.inject('conversation.input.right', () =>
      ctx.slots.register(
        { name: 'conversation.input.right', id: 'skill-picker', order: 100, label: 'Skill picker' },
        PickerWithCwd,
      ),
    )
    return () => {
      dispose()
      unsubscribeLegacyCwd()
    }
```

</details>

**依据 6 · 源码核查**：[src/index.js:39-47](https://github.com/a735624258/dsh-skill-picker/blob/78af8bf5a5947570bd159ab6329c3e69de26e5e1/src/index.js#L39-L47)

对模型的固定提示内容。

```text
/** Required services: the route registry and the prompt band. */
export const inject = ['webServer', 'systemPrompt']

/** Order of the announcement section within the tool-guidance band. */
const SECTION_ORDER = 215

/** Model-facing announcement: picker presence and the user-visible gesture. */
export const SKILL_PICKER_GUIDANCE =
  '本机已安装 dsh-skill-picker 插件（Web GUI 的技能选择器）：输入框旁有技能按钮，用户点选技能后会把 `/技能名`（如 /duo-xuan-pi-gai）插入发送框并随消息发出。DSH 官方机制会把用户消息里的 `/技能名` 手势当作技能直接调用并自动加载技能内容——你照常按加载后的技能指令执行即可，无需额外操作。用户说「技能选择器 / 选个技能 / 技能列表」时即指本插件。'
```

**依据 7 · 源码核查**：[src/index.js:517-524](https://github.com/a735624258/dsh-skill-picker/blob/78af8bf5a5947570bd159ab6329c3e69de26e5e1/src/index.js#L517-L524)

宿主路由和系统提示区段注册。

```text
    return ctx.webServer.register({ kind: 'prefix', path: '/dsh-skill-picker', handler })
  }, 'dsh-skill-picker: routes')

  ctx.effect(() => ctx.systemPrompt.section({
    name: 'plugin:skill-picker',
    order: SECTION_ORDER,
    text: SKILL_PICKER_GUIDANCE,
  }), 'dsh-skill-picker: prompt section')
```

**依据 8 · 作者声明**：[README.md:19-55](https://github.com/a735624258/dsh-skill-picker/blob/78af8bf5a5947570bd159ab6329c3e69de26e5e1/README.md#L19-L55)

作者给出的用户任务与原生手势。

<details>
<summary>查看原文（37行）</summary>

```text
## 1、为什么要做

DSH 本来就会认 `/技能名` 这个手势 —— 你在消息里写 `/ji-zhang 午饭 12 块`，它自动加载「记账」技能来执行。**官方只配了一个 `/` 补全，而它靠两样东西：**

1. **前缀匹配** —— 你得打对技能名的开头几个字母
2. **你的记忆** —— 装了五六十个技能，谁记得住每个叫什么

于是最常见的场面是：明明装了「备份记忆」，却想不起来它叫 `backup-memory`，翻不到就放弃了。

## 2、它做什么

![dsh-skill-picker 技能面板：搜索框、置顶与最近使用分组、右键管理菜单](docs/skill-picker-panel.png)

1. **看得见** —— 输入框旁边一个 ⚡，点开是全部技能 + 完整描述
2. **搜得到** —— 中文、拼音（`jiyi` / `ji yi` / `jy`）、英文都行，技能名和描述一起搜
3. **选得快** —— 最近使用靠前、可手动置顶、`↑↓` + `Enter` 全程键盘
4. **管得了** —— 右键（手机长按）：置顶 / 关闭 / 在文件管理器中定位 / 卸载（移入备份，可撤回）
5. **到处一致** —— 置顶和最近使用在桌面端、网页端、手机之间共用同一份

**它和官方 `/` 补全不冲突，可以同时用**：记得住名字用官方，记不住用它。

## 3、怎么用

1. 看输入框右下角（模型选择器旁边），点 **⚡**
2. 敲关键字（中文 / 拼音 / 英文），列表实时过滤；也可以直接 `↑↓` 翻
3. 点中技能（或按 `Enter`）—— 发送框里出现 `/技能名 `，**光标停在末尾**
4. 接着把话说完，回车发送 —— DSH 自动加载这个技能

例子：点 ⚡ → 搜 `jiyi` → 点 `/ji-zhang` → 打上「今天午饭 12 块」→ 发送。

| 操作 | 效果 |
|---|---|
| 点 ⚡ | 打开技能面板 |
| `↑` `↓` / `Enter` / `Esc` | 选择 / 插入 / 关闭 |
| 右键技能行（手机长按 500ms） | 管理菜单：置顶 / 关闭 / 定位 / 卸载 |
| 面板右下角「已关闭 N」 | 查看并恢复被关闭的技能 |
| 输入框直接打 `/` | 官方斜杠菜单（本插件同样增强了它的匹配与排序） |
```

</details>

#### 缺口

- 未在实际 DSH 验证已有草稿、发送前撤回和原生载入结果。
  **影响**：只能证明插件写草稿的方式，不能用 UI 点选计数推定执行。
  **进一步探讨**：用无副作用的合成 Skill 分别验证点选未发送、发送、拒绝与实际载入。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 两个列表和搜索如何接线，什么时候退化？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

面板优先取当前 Session ID 并调用宿主 skills.list，服务从 remote.skills 或旧 connection.api.skills 选取，RPC 缺失或失败才走宿主扫描。扫描覆盖用户 .agents、用户 DSH、项目 .agents 和项目 .dsh 四个技能根，按这个顺序让后项覆盖同名。扫描会跟随目录链接，过滤显式不可由用户调用及带指定旧标志的条目，并保留关闭项供恢复视图，主列表排除关闭项。无 cwd 时只扫用户根，官方 RPC 与后备扫描可见范围不能直接等同。匹配以名称、描述和拼音索引，并以置顶和使用记录打破同相关性顺序。原生斜杠菜单增强通过运行时包装已有技能来源，空查询取候选、按 Session 缓存并异步刷新，选中仍委派给原生 onPick。源未找到会有限等待，冻结源会跳过。旧版文件 patch 仍可用环境变量明确启用，默认启动也会尝试按标记和备份恢复以前被本插件修改的文件。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.jsx:285-337](https://github.com/a735624258/dsh-skill-picker/blob/78af8bf5a5947570bd159ab6329c3e69de26e5e1/src/client/index.jsx#L285-L337)

相关性与置顶、使用次序。

<details>
<summary>查看原文（53行）</summary>

```text
function matchRank(skill, q) {
  const name = skill.name.toLowerCase()
  const desc = String(skill.description ?? '').toLowerCase()
  const py = skillPinyinText(skill.name, skill.description ?? '').toLowerCase()
  if (name.startsWith(q)) return 0
  if (name.includes(q)) return 1
  if (desc.includes(q)) return 2
  if (py.includes(q)) return 3
  return 4
}

/**
 * The picker's single ranking rule, shared by the ⚡ panel, the legacy `/`
 * matcher and the runtime `/` takeover (issue #14) so the two lists can never
 * disagree about matching OR order.
 *
 * Only `name` and `description` are read, which is what both raw skill entries
 * and the official menu's already-mapped display items carry.
 *
 * Relevance first (name-startsWith > name-contains > description > pinyin),
 * then the ⚡ panel's pinned/usage order as the tiebreak — fuzzysort decides
 * WHO matches, never the display order. Pure subsequence noise (dispersed
 * letters that never form an actual substring) is dropped.
 *
 * @param items - [{ name, description }]
 * @param query - the raw query string.
 * @returns the ranked subset (all items, in panel order, for an empty query).
 */
function rankPickerItems(items, query) {
  const ordered = groupByPinned(
    Array.isArray(items) ? items : [],
    loadUsage(),
    loadPinned(),
  ).flatMap((group) => group.items)
  const q = String(query ?? '').trim().toLowerCase()
  if (q === '') return ordered
  const order = new Map(ordered.map((skill, index) => [skill.name, index]))
  const targets = ordered.map((s) => ({
    s,
    search: `${s.name} ${s.description ?? ''} ${skillPinyinText(s.name, s.description ?? '')}`,
  }))
  return fuzzysort.go(q, targets, {
    key: 'search',
    limit: 30,
    threshold: -10000,
  })
    .filter((r) => r.score > 0)
    .map((r) => r.obj.s)
    .filter((s) => matchRank(s, q) < 4)
    .sort((a, b) => matchRank(a, q) - matchRank(b, q) || (order.get(a.name) ?? 0) - (order.get(b.name) ?? 0))
}

/** Row height matches the resident chrome (access mode, plan, attach, model). */
```

</details>

**依据 2 · 源码核查**：[src/client/index.jsx:725-775](https://github.com/a735624258/dsh-skill-picker/blob/78af8bf5a5947570bd159ab6329c3e69de26e5e1/src/client/index.jsx#L725-L775)

RPC 优先和后备含已关闭记录。

<details>
<summary>查看原文（51行）</summary>

```text
  const load = useCallback(async (force = false) => {
    if (!force && (skills !== undefined || error !== undefined)) return
    // Session identity comes from the slot's standard props; older kernels
    // carried it as `props.session` (see ./session-view.js).
    const sessionId = sessionIdOf(props)
    try {
      // Primary path: the official host skills API (same source as DSH's own
      // `/` completion — session-scoped, covers user + project level).
      if (typeof props.listSkills === 'function' && sessionId !== undefined) {
        const listed = await props.listSkills(sessionId)
        setSkills(Array.isArray(listed) ? listed : [])
        setSource('official')
        return
      }
    } catch (cause) {
      console.warn('[dsh-skill-picker] official skills API failed, falling back to host route:', cause)
    }
    // Fallback path: the host's own scan route (official provider roots).
    try {
      const cwd = typeof props.cwd === 'string' && props.cwd !== '' ? `?cwd=${encodeURIComponent(props.cwd)}` : ''
      const res = await fetch(`/dsh-skill-picker/skills${cwd}`, { headers: { accept: 'application/json' } })
      const json = await res.json()
      if (!json.ok) throw new Error(json.error || 'bad response')
      const listed = Array.isArray(json.skills) ? json.skills : []
      // The scan deliberately reports switched-off skills too (that is how the
      // closed view can list them), but they must never enter THIS list.
      setSkills(listed.filter((skill) => isUserFacingSkill(skill) && skill.disabled !== true))
      setSource('host')
    } catch (cause) {
      setError(String(cause?.message ?? cause))
    }
  }, [skills, error, props.listSkills, props.sessionId, props.session, props.cwd])

  /**
   * Load the disabled skills from the host's own scan.
   *
   * They are invisible to the official `skills/list` RPC, so this is the only
   * way the panel can offer to switch one back on. Best-effort: without it the
   * panel still works, it just cannot re-enable.
   */
  const loadDisabled = useCallback(async () => {
    try {
      const cwd = typeof props.cwd === 'string' && props.cwd !== '' ? `?cwd=${encodeURIComponent(props.cwd)}` : ''
      const res = await fetch(`/dsh-skill-picker/skills${cwd}`, { headers: { accept: 'application/json' } })
      const json = await res.json()
      if (!json.ok) return
      setDisabledSkills((Array.isArray(json.skills) ? json.skills : []).filter((skill) => skill.disabled === true))
    } catch {
      /* the disabled list is a convenience; the panel works without it */
    }
  }, [props.cwd])
```

</details>

**依据 3 · 源码核查**：[src/client/index.jsx:1342-1397](https://github.com/a735624258/dsh-skill-picker/blob/78af8bf5a5947570bd159ab6329c3e69de26e5e1/src/client/index.jsx#L1342-L1397)

兼容 RPC 形状与 cwd 取值。

<details>
<summary>查看原文（56行）</summary>

```text
  // Primary skill source: the official host skills API. In DSH 0.1.2-alpha.x
  // the RPC moved from `connection.api.skills` (rc.x) to `remote.skills`
  // (used by the official ui-skill plugin); try both before falling back.
  const listSkills = async (sessionId) => {
    const remoteSkills = ctx.remote?.skills
    const connectionSkills = ctx.connection?.api?.skills
    const skills = remoteSkills ?? connectionSkills
    if (skills === undefined || typeof skills.list !== 'function') {
      throw new Error('skills RPC unavailable (remote.skills / connection.api.skills)')
    }
    const controller = new AbortController()
    const { result } = await skills.list({ sessionId }, controller.signal)
    if (!result.ok) throw new Error(`skill.list failed: ${result.error?.code}: ${result.error?.message}`)
    const raw = result.value?.skills ?? []
    // The host already filters user-invocable skills out of this payload; keep
    // the guard here too so the panel can never offer a skill the official `/`
    // menu hides, whatever shape a future kernel ships on the wire (issue #10).
    return raw.filter(isUserFacingSkill).map((skill) => ({ name: skill.name, description: skill.description ?? '' }))
  }

  // Legacy workspace-cwd source: the Session list snapshot still carried a
  // `current` cursor up to the 0.1.5 client line, and on those kernels the slot
  // props may not hand us a `useSessions` seat at all. Keeping this as a
  // fallback means issue #11's fix does not silently regress the older kernels
  // the compatibility table still declares.
  let legacyCwd = ''
  const syncLegacyCwd = () => {
    try {
      const snapshot = ctx.sessions.list.getSnapshot()
      const sessionId = snapshot.current
      const cwd = sessionId === undefined ? undefined : snapshot.byId[sessionId]?.cwd
      legacyCwd = typeof cwd === 'string' ? cwd : ''
    } catch {
      legacyCwd = ''
    }
  }
  syncLegacyCwd()
  const unsubscribeLegacyCwd = ctx.sessions.list.subscribe(syncLegacyCwd)

  ctx.effect(() => {
    // Wrap the component so framework props pass through untouched and the
    // live workspace cwd + official skills fetcher are attached — never
    // swallow the composed props.
    //
    // The cwd is read from the slot's own standard props (see
    // ./session-view.js): the Session list snapshot has no "current" cursor
    // since the 0.1.7 client, so resolving the active Session through
    // `ctx.sessions.list` yielded `''` and the host fallback scan never
    // received the workspace. The legacy source above is consulted only when
    // the standard props resolve to nothing, so both kernel lines work.
    const PickerWithCwd = (props) => {
      const cwd = useWorkspaceCwd(props)
      return React.createElement(SkillPickerButton, {
        ...props,
        cwd: cwd === '' ? legacyCwd : cwd,
        listSkills,
```

</details>

**依据 4 · 源码核查**：[src/index.js:151-208](https://github.com/a735624258/dsh-skill-picker/blob/78af8bf5a5947570bd159ab6329c3e69de26e5e1/src/index.js#L151-L208)

调用标志、链接及候选记录。

<details>
<summary>查看原文（58行）</summary>

```text
function isUserInvocableSkill(meta, content) {
  for (const legacy of LEGACY_INVOCATION_KEYS) {
    if (hasFrontmatterKey(content, legacy)) return false
  }
  try {
    // Omitted → permitted; only an explicit `false` hides the skill.
    return frontmatterBoolean(meta, 'user-invocable') !== false
  } catch {
    return false
  }
}

/** Scan one skill directory into the map; never throws (missing dir is a no-op). */
async function scanSkillsDirInto(map, dir) {
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return
  }
  for (const entry of entries) {
    // Links are followed (`isDirectoryEntry`), so a skill may live behind a
    // symlink/junction — e.g. `~/.agents/skills/neat` → another repo (#6).
    if (!(await isDirectoryEntry(dir, entry))) continue
    const skillDir = path.join(dir, entry.name)
    let content
    let entryFile = ENTRY
    let disabled = false
    try {
      content = await readFile(path.join(skillDir, ENTRY), 'utf8')
    } catch {
      // A disabled skill keeps its entry under a different name, which the
      // official provider ignores entirely. The panel still has to list it, or
      // there would be no way to switch it back on.
      try {
        content = await readFile(path.join(skillDir, DISABLED_ENTRY), 'utf8')
        entryFile = DISABLED_ENTRY
        disabled = true
      } catch {
        continue
      }
    }
    const meta = parseFrontmatter(content)
    // The picker is a human-facing surface, so honour the invocation policy:
    // `user-invocable: false` (and the legacy spellings the official provider
    // rejects) must never be offered. The official `skills/list` Remote filters
    // the same way — without this the fallback route listed skills that the
    // official `/` menu hides and that the `/name` gesture then refuses to load
    // (issue #10).
    if (!isUserInvocableSkill(meta, content)) continue
    // Later writes win, so project-level skills override same-named user skills.
    map.set(meta.name ?? entry.name, {
      name: meta.name ?? entry.name,
      description: meta.description ?? '',
      path: skillDir,
      entry: entryFile,
      disabled,
    })
```

</details>

**依据 5 · 源码核查**：[src/index.js:222-230](https://github.com/a735624258/dsh-skill-picker/blob/78af8bf5a5947570bd159ab6329c3e69de26e5e1/src/index.js#L222-L230)

四级根的覆盖顺序。

```text
export async function scanSkills(cwd) {
  const map = new Map()
  await scanSkillsDirInto(map, userAgentsSkillsDir())
  await scanSkillsDirInto(map, userSkillsDir())
  if (typeof cwd === 'string' && cwd !== '') {
    await scanSkillsDirInto(map, path.join(cwd, '.agents', 'skills'))
    await scanSkillsDirInto(map, path.join(cwd, '.dsh', 'skills'))
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name))
```

**依据 6 · 源码核查**：[src/client/slash-source.js:247-317](https://github.com/a735624258/dsh-skill-picker/blob/78af8bf5a5947570bd159ab6329c3e69de26e5e1/src/client/slash-source.js#L247-L317)

运行时包装、按 Session 缓存与原生选择。

<details>
<summary>查看原文（71行）</summary>

```text
export function wrapSkillSource(source, hooks = {}) {
  const { rank, order, onPick } = hooks
  if (source === null || typeof source !== 'object') return undefined
  if (isSkillSourceWrapped(source)) return undefined
  // A frozen or sealed source cannot take the wrapper, and a failed assignment
  // would throw out of `apply` and take the whole plugin (and the web shell)
  // down with it. Decline quietly instead; the file patch remains as fallback.
  if (Object.isFrozen(source)) return undefined

  const original = {
    candidates: source.candidates,
    order: source.order,
    hadOrder: Object.hasOwn(source, 'order'),
    onPick: source.onPick,
    hadOnPick: Object.hasOwn(source, 'onPick'),
  }
  const taken = []

  const wrappedCandidates = typeof rank === 'function' && typeof original.candidates === 'function'
    ? async function candidates(projection, args) {
        const options = args ?? {}
        const query = String(options.query ?? '').trim()
        const sessionId = projection?.sessionId
        const cacheKey = typeof sessionId === 'string' ? sessionId : undefined
        const cached = cacheKey === undefined ? undefined : itemCache.get(cacheKey)

        // Cache hit: return WITHOUT awaiting anything. The returned promise is
        // already resolved, so this group settles on the first microtask — ahead
        // of any group whose candidates awaits even a settled promise.
        if (cached !== undefined) {
          noteDiag({ mode: 'runtime', servedFromCache: true, sessionId: cacheKey, query })
          refreshCache(cacheKey, original.candidates, this, projection, options)
          try {
            // Rank even for an empty query: that is what puts the pinned skills
            // on top, exactly like the ⚡ panel. Returning the official list
            // untouched here made the two lists disagree — the menu looked
            // alphabetical while the panel led with 置顶.
            return rank(cached, query)
          } catch {
            return cached
          }
        }

        const everything = await original.candidates.call(this, projection, { ...options, query: '' })
        if (cacheKey !== undefined && Array.isArray(everything)) {
          // Store a SNAPSHOT, never the caller's array: the official source hands
          // back a container it may keep and grow, and aliasing it would make the
          // cache mutate underneath us.
          itemCache.set(cacheKey, everything.slice())
          noteDiag({ mode: 'runtime', servedFromCache: false, sessionId: cacheKey, primed: true, count: everything.length })
        }
        if (!Array.isArray(everything)) return everything
        try {
          return rank(everything, query)
        } catch {
          // Ranking is an enhancement: a picker bug must never break the menu.
          return everything
        }
      }
    : undefined

  const wrappedPick = typeof onPick === 'function' && typeof original.onPick === 'function'
    ? function onPickWrapped(args) {
        try {
          const name = args?.candidate?.name
          if (typeof name === 'string') onPick(name)
        } catch {
          /* usage bookkeeping is best-effort */
        }
        return original.onPick.call(this, args)
      }
```

</details>

**依据 7 · 源码核查**：[src/client/slash-source.js:400-442](https://github.com/a735624258/dsh-skill-picker/blob/78af8bf5a5947570bd159ab6329c3e69de26e5e1/src/client/slash-source.js#L400-L442)

探测、重试与释放。

<details>
<summary>查看原文（43行）</summary>

```text
export function installSlashFuzzy(inputTriggers, hooks = {}, options = {}) {
  const maxAttempts = options.attempts ?? 40
  const intervalMs = options.intervalMs ?? 250
  let restore
  let timer
  let attempts = 0
  let stopped = false

  const attempt = () => {
    if (stopped || restore !== undefined) return
    try {
      const source = findSkillSource(inputTriggers)
      if (source === undefined) {
        if (attempts++ < maxAttempts) {
          timer = setTimeout(attempt, intervalMs)
        } else {
          // Loud on the give-up case. The first release of this module reached
          // for a helper the service does not have and then quietly did nothing
          // for ten seconds; nobody could tell it had never run.
          noteDiag({ mode: 'none', gaveUp: true, attempts: maxAttempts })
          console.warn('[dsh-skill-picker] / takeover: the official "skill" trigger source was not found'
            + ` after ${maxAttempts} attempts — the / menu keeps the official matcher.`
            + ' See https://github.com/a735624258/dsh-skill-picker/issues/14')
        }
        return
      }
      // Already wrapped (a previous install, or an HMR re-apply): stop retrying
      // and leave the existing wrapper in place.
      restore = wrapSkillSource(source, hooks) ?? (() => {})
    } catch {
      // Never let the takeover attempt escape into the client boot.
      restore = () => {}
    }
  }

  attempt()

  return () => {
    stopped = true
    if (timer !== undefined) clearTimeout(timer)
    restore?.()
    restore = undefined
  }
```

</details>

**依据 8 · 源码核查**：[src/index.js:526-555](https://github.com/a735624258/dsh-skill-picker/blob/78af8bf5a5947570bd159ab6329c3e69de26e5e1/src/index.js#L526-L555)

旧文件 patch 的 opt-in 和默认恢复。

<details>
<summary>查看原文（30行）</summary>

```text
  // The `/` enhancement no longer edits official files.
  //
  // Since v0.5.15 it takes over the LIVE trigger source at runtime, which does
  // everything the old file patch did (skill group first, fuzzy+pinyin matching,
  // usage tracking) without touching a single file. The patch is therefore
  // redundant — and a modified copy of an official package is confusing in its
  // own right: it made the desktop and web profiles disagree about one shared
  // file, and it is what made "is this the original?" impossible to answer.
  //
  // So the default is now to RESTORE our own patch (from the `.bak` it made).
  // Set DSH_SKILL_PICKER_FILE_PATCH=1 to fall back to the old behaviour on a
  // kernel whose trigger registry has no live sources to take over.
  ctx.effect(() => {
    const enabled = process.env.DSH_SKILL_PICKER_FILE_PATCH === '1'
    const task = enabled
      ? healUiSkillPatches().then((report) => reportUiSkillPatches(report))
      : revertUiSkillPatches().then((report) => {
        if (report.restored.length > 0) {
          console.log('[dsh-skill-picker] ui-skill patch retired; restored original file(s):',
            report.restored.join(', '))
        }
        if (report.errors.length > 0) {
          console.warn('[dsh-skill-picker] ui-skill restore errors:', JSON.stringify(report.errors))
        }
      })
    task.catch((error) => {
      console.warn('[dsh-skill-picker] ui-skill patch failed:', error)
    })
    return () => {}
  }, 'dsh-skill-picker: ui-skill self-heal patch')
```

</details>

**依据 9 · 源码核查**：[src/patch-ui-skill.js:343-373](https://github.com/a735624258/dsh-skill-picker/blob/78af8bf5a5947570bd159ab6329c3e69de26e5e1/src/patch-ui-skill.js#L343-L373)

仅对带标记且有备份的文件恢复。

<details>
<summary>查看原文（31行）</summary>

```text
export async function revertUiSkillPatches() {
  const files = await uiSkillClientPaths()
  const restored = []
  const errors = []
  for (const file of files) {
    const backup = `${file}.dsh-skill-picker.bak`
    try {
      let text
      try {
        text = await readFile(file, 'utf8')
      } catch {
        continue
      }
      if (!PATCHES.some((patch) => patch.isApplied(text))) continue
      let original
      try {
        original = await readFile(backup, 'utf8')
      } catch {
        continue
      }
      // Same temp+rename dance as the patch itself: never write a hardlinked
      // package file in place (that would mutate the shared pnpm store).
      const tmp = `${file}.dsh-skill-picker.tmp`
      await writeFile(tmp, original, 'utf8')
      await rename(tmp, file)
      restored.push(file)
    } catch (error) {
      errors.push(`${file}: ${String(error?.message ?? error)}`)
    }
  }
  return { restored, errors }
```

</details>

#### 缺口

- 未核对定制目录、同名遮蔽及缓存过期在不同宿主的结果。
  **影响**：面板与原生载入可能看到不同集合，特别是后备扫描或状态刚变更时。
  **进一步探讨**：用同名和链接目录、缺 RPC 与不可调用样例对照每一步候选和最终载入。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 管理动作和共用状态的边界是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用、依赖、兼容与流程

#### 完整回答

管理接口接受 POST 和固定自定义头，根据客户端提供的 cwd 生成项目 Skill 根，并按名称在扫描表查找，随后检查目标词法上恰好在某个根下一级。固定头有跨站请求摩擦，源码没有把 cwd 绑定到已授权 Session，也没有校验操作者身份。源码注释声称插件路由绕过宿主认证，真实可达性仍需在目标宿主验证。扫描返回描述、路径和状态，管理使用 Node 文件 API。目录链接会被跟随，停用对链接目录内部 SKILL.md 改名可能改变实际目标文件，路径校验不约束解析后位置。卸载先移动，再写备份清单，清单写失败后可能已经移动却无法按清单从 UI 恢复。恢复先检查目标占用再移动，不能推断并发下有排他保证。置顶与使用次数、时间存在每个 DSH_HOME 的单文件，浏览器另存镜像。首次迁移并集并取最大次数和时间，平常写入替换快照且使用同一临时文件，未见版本或并发合并。状态路由自身未要求管理头。共享部署须先确认宿主认证、cwd 与 Session 绑定、链接目标和状态隔离。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:395-445](https://github.com/a735624258/dsh-skill-picker/blob/78af8bf5a5947570bd159ab6329c3e69de26e5e1/src/index.js#L395-L445)

项目根来自请求 cwd，管理头和备份入口。

<details>
<summary>查看原文（51行）</summary>

```text
function allSkillRoots(cwd) {
  const roots = [userAgentsSkillsDir(), userSkillsDir()]
  if (typeof cwd === 'string' && cwd !== '') {
    roots.push(path.join(cwd, '.agents', 'skills'), path.join(cwd, '.dsh', 'skills'))
  }
  return roots
}

/**
 * `POST /dsh-skill-picker/skill` — disable / enable / reveal / uninstall /
 * restore a skill, and list the uninstall backups.
 *
 * Three guards, in order:
 *
 *  1. The request must carry `x-dsh-skill-picker: 1`. Plugin routes bypass the
 *     web server's auth gate (they are reachable without a cookie), and these
 *     actions rename and move files. A cross-site `fetch` cannot set a custom
 *     header without a CORS preflight the host does not answer, so this header
 *     is what keeps an arbitrary web page out.
 *  2. The target path must resolve inside a known skill root. Anything else —
 *     the root itself, a file nested inside a skill, `../..`, or an absolute
 *     path elsewhere — is refused before any filesystem call.
 *  3. Nothing is ever deleted. "Uninstall" moves the skill into
 *     `$DSH_HOME/skill-backups/` beside a manifest, and `restore` moves it back.
 */
async function handleSkillOp(req, res, url) {
  const json = (code, payload) => {
    res.writeHead(code, { 'content-type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify(payload))
  }
  if (req.method !== 'POST') {
    json(405, { ok: false, error: 'POST only' })
    return
  }
  if (req.headers[CLIENT_HEADER] !== '1') {
    json(403, { ok: false, error: 'missing client header' })
    return
  }
  try {
    const body = await readJsonBody(req)
    const cwd = url.searchParams.get('cwd') ?? undefined
    const roots = allSkillRoots(cwd)
    const action = String(body?.action ?? '')

    if (action === 'backups') {
      json(200, { ok: true, backups: await listSkillBackups(roots) })
      return
    }
    if (action === 'restore') {
      json(200, { ok: true, ...(await restoreSkillBackup(body?.id, roots)) })
      return
```

</details>

**依据 2 · 源码核查**：[src/index.js:450-485](https://github.com/a735624258/dsh-skill-picker/blob/78af8bf5a5947570bd159ab6329c3e69de26e5e1/src/index.js#L450-L485)

按名称扫描后管理本机文件。

<details>
<summary>查看原文（36行）</summary>

```text
    // whose DTO is not guaranteed to carry a filesystem path — and a name the
    // host looks up itself cannot point outside the skill roots at all.
    const name = String(body?.name ?? '')
    if (name === '') {
      json(400, { ok: false, error: 'name is required' })
      return
    }
    const known = (await scanSkills(cwd)).find((skill) => skill.name === name)
    if (known === undefined) {
      json(404, { ok: false, error: `no skill named "${name}"` })
      return
    }
    const target = resolveSkillPath(known.path, roots)
    if (target === undefined) {
      json(403, { ok: false, error: 'that skill lives outside the skill roots' })
      return
    }

    if (action === 'disable') {
      json(200, { ok: true, ...(await setSkillDisabled(target, true)) })
      return
    }
    if (action === 'enable') {
      json(200, { ok: true, ...(await setSkillDisabled(target, false)) })
      return
    }
    if (action === 'reveal') {
      json(200, { ok: true, revealed: revealSkill(target) })
      return
    }
    if (action === 'uninstall') {
      json(200, { ok: true, ...(await uninstallSkill(target)) })
      return
    }
    json(400, { ok: false, error: `unknown action: ${action}` })
  } catch (error) {
```

</details>

**依据 3 · 源码核查**：[src/index.js:494-517](https://github.com/a735624258/dsh-skill-picker/blob/78af8bf5a5947570bd159ab6329c3e69de26e5e1/src/index.js#L494-L517)

路由分发，列表接受 cwd。

<details>
<summary>查看原文（24行）</summary>

```text
export function apply(ctx) {
  ctx.effect(() => {
    const handler = async (req, res) => {
      try {
        const url = new URL(req.url ?? '/', 'http://dsh')
        if (url.pathname === '/dsh-skill-picker/state') {
          await handleSharedState(req, res, url)
          return
        }
        if (url.pathname === '/dsh-skill-picker/skill') {
          await handleSkillOp(req, res, url)
          return
        }
        // cwd query carries the active session's workspace root from the client.
        const cwd = url.searchParams.get('cwd') ?? undefined
        const skills = await scanSkills(cwd)
        res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' })
        res.end(JSON.stringify({ ok: true, complete: true, skills }))
      } catch (error) {
        res.writeHead(500, { 'content-type': 'application/json; charset=utf-8' })
        res.end(JSON.stringify({ ok: false, error: String(error?.message ?? error) }))
      }
    }
    return ctx.webServer.register({ kind: 'prefix', path: '/dsh-skill-picker', handler })
```

</details>

**依据 4 · 源码核查**：[src/index.js:193-207](https://github.com/a735624258/dsh-skill-picker/blob/78af8bf5a5947570bd159ab6329c3e69de26e5e1/src/index.js#L193-L207)

后备目录返回描述、路径和禁用状态。

<details>
<summary>查看原文（15行）</summary>

```text
    const meta = parseFrontmatter(content)
    // The picker is a human-facing surface, so honour the invocation policy:
    // `user-invocable: false` (and the legacy spellings the official provider
    // rejects) must never be offered. The official `skills/list` Remote filters
    // the same way — without this the fallback route listed skills that the
    // official `/` menu hides and that the `/name` gesture then refuses to load
    // (issue #10).
    if (!isUserInvocableSkill(meta, content)) continue
    // Later writes win, so project-level skills override same-named user skills.
    map.set(meta.name ?? entry.name, {
      name: meta.name ?? entry.name,
      description: meta.description ?? '',
      path: skillDir,
      entry: entryFile,
      disabled,
```

</details>

**依据 5 · 源码核查**：[src/skill-ops.js:63-74](https://github.com/a735624258/dsh-skill-picker/blob/78af8bf5a5947570bd159ab6329c3e69de26e5e1/src/skill-ops.js#L63-L74)

只进行词法一级路径校验。

<details>
<summary>查看原文（12行）</summary>

```text
export function resolveSkillPath(candidate, roots) {
  if (typeof candidate !== 'string' || candidate === '') return undefined
  const list = Array.isArray(roots) ? roots : []
  const resolved = path.resolve(candidate)
  for (const root of list) {
    const base = path.resolve(root)
    const relative = path.relative(base, resolved)
    if (relative === '' || relative.startsWith('..') || path.isAbsolute(relative)) continue
    if (relative.split(path.sep).filter(Boolean).length !== 1) continue
    return resolved
  }
  return undefined
```

</details>

**依据 6 · 源码核查**：[src/dir-entry.js:30-37](https://github.com/a735624258/dsh-skill-picker/blob/78af8bf5a5947570bd159ab6329c3e69de26e5e1/src/dir-entry.js#L30-L37)

stat 跟随目录链接。

```text
export async function isDirectoryEntry(dir, entry) {
  if (entry.isDirectory()) return true
  if (!entry.isSymbolicLink()) return false
  try {
    return (await stat(path.join(dir, entry.name))).isDirectory()
  } catch {
    return false
  }
```

**依据 7 · 源码核查**：[src/skill-ops.js:103-125](https://github.com/a735624258/dsh-skill-picker/blob/78af8bf5a5947570bd159ab6329c3e69de26e5e1/src/skill-ops.js#L103-L125)

以 rename 切换入口文件。

<details>
<summary>查看原文（23行）</summary>

```text
export async function setSkillDisabled(target, disabled) {
  const kind = await pathKind(target)
  if (kind === undefined) throw new Error(`skill not found: ${target}`)
  const dir = kind === 'dir' ? target : path.dirname(target)
  const base = kind === 'dir' ? ENTRY : path.basename(target)
  const plain = path.join(dir, base)
  const off = path.join(dir, `${base}.disabled`)
  const hasPlain = await exists(plain)
  const hasOff = await exists(off)

  if (disabled) {
    if (hasOff && !hasPlain) throw new Error('already disabled')
    if (!hasPlain) throw new Error(`cannot disable: ${base} is not there`)
    if (hasOff) throw new Error(`cannot disable: ${base} and ${base}.disabled both exist`)
    await rename(plain, off)
    return { entry: `${base}.disabled`, disabled: true }
  }

  if (hasPlain && !hasOff) throw new Error('already enabled')
  if (!hasOff) throw new Error(`cannot enable: ${base}.disabled is not there`)
  if (hasPlain) throw new Error(`cannot enable: ${base} and ${base}.disabled both exist`)
  await rename(off, plain)
  return { entry: base, disabled: false }
```

</details>

**依据 8 · 源码核查**：[src/skill-ops.js:136-150](https://github.com/a735624258/dsh-skill-picker/blob/78af8bf5a5947570bd159ab6329c3e69de26e5e1/src/skill-ops.js#L136-L150)

先移目录再写恢复清单。

<details>
<summary>查看原文（15行）</summary>

```text
export async function uninstallSkill(target) {
  const kind = await pathKind(target)
  if (kind === undefined) throw new Error(`skill not found: ${target}`)
  const name = path.basename(target)
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupPath = path.join(skillBackupDir(), `${stamp}-${name}`)
  await mkdir(backupPath, { recursive: true })
  await rename(target, path.join(backupPath, name))
  await writeFile(path.join(backupPath, 'manifest.json'), `${JSON.stringify({
    name,
    kind,
    originalPath: target,
    movedAt: new Date().toISOString(),
  }, null, 2)}\n`, 'utf8')
  return { backupPath, restoreTarget: target }
```

</details>

**依据 9 · 源码核查**：[src/skill-ops.js:188-208](https://github.com/a735624258/dsh-skill-picker/blob/78af8bf5a5947570bd159ab6329c3e69de26e5e1/src/skill-ops.js#L188-L208)

恢复前检查与实际移动分开。

<details>
<summary>查看原文（21行）</summary>

```text
export async function restoreSkillBackup(id, roots) {
  if (typeof id !== 'string' || id === '' || id.includes('/') || id.includes('\\') || id.includes('..')) {
    throw new Error('invalid backup id')
  }
  const dir = path.join(skillBackupDir(), id)
  let manifest
  try {
    manifest = JSON.parse(await readFile(path.join(dir, 'manifest.json'), 'utf8'))
  } catch {
    throw new Error('that backup is gone')
  }
  const original = resolveSkillPath(manifest.originalPath, roots)
  if (original === undefined) throw new Error('that backup no longer points inside a skill root')
  if (await exists(original)) {
    throw new Error(`${path.basename(original)} is occupied again — move it away first`)
  }
  await rename(path.join(dir, path.basename(original)), original)
  const done = path.join(skillBackupDir(), '.restored')
  await mkdir(done, { recursive: true })
  await rename(dir, path.join(done, id)).catch(() => {})
  return { restored: original }
```

</details>

**依据 10 · 源码核查**：[src/index.js:291-350](https://github.com/a735624258/dsh-skill-picker/blob/78af8bf5a5947570bd159ab6329c3e69de26e5e1/src/index.js#L291-L350)

单宿主状态文件、临时路径和并集规则。

<details>
<summary>查看原文（60行）</summary>

```text
function sharedStateFile() {
  return path.join(dshHome(), 'dsh-skill-picker-state.json')
}

/** Coerce anything into `{ pinned: string[], usage: {name: {count, lastUsed}} }`. */
function normalizeSharedState(value) {
  const source = value !== null && typeof value === 'object' ? value : {}
  const pinned = Array.isArray(source.pinned)
    ? [...new Set(source.pinned.filter((name) => typeof name === 'string' && name !== ''))]
    : []
  const usage = {}
  const rawUsage = source.usage !== null && typeof source.usage === 'object' ? source.usage : {}
  for (const [name, entry] of Object.entries(rawUsage)) {
    if (typeof name !== 'string' || name === '') continue
    const record = entry !== null && typeof entry === 'object' ? entry : {}
    const count = Number.isFinite(record.count) ? Math.max(0, Math.trunc(record.count)) : 0
    const lastUsed = Number.isFinite(record.lastUsed) ? Math.max(0, Math.trunc(record.lastUsed)) : 0
    if (count === 0 && lastUsed === 0) continue
    usage[name] = { count, lastUsed }
  }
  return { pinned, usage }
}

/** Read the shared state, or null when the file does not exist yet. */
async function readSharedState() {
  try {
    return normalizeSharedState(JSON.parse(await readFile(sharedStateFile(), 'utf8')))
  } catch {
    return null
  }
}

/** Write the shared state atomically (temp + rename), creating the home if needed. */
async function writeSharedState(state) {
  const normal = normalizeSharedState(state)
  const file = sharedStateFile()
  await mkdir(path.dirname(file), { recursive: true })
  const tmp = `${file}.tmp`
  await writeFile(tmp, `${JSON.stringify(normal, null, 2)}\n`, 'utf8')
  await rename(tmp, file)
  return normal
}

/**
 * First-run migration: union both ends instead of letting whichever browser
 * happened to write first win, so nobody silently loses their pins.
 */
function mergeSharedState(a, b) {
  const left = normalizeSharedState(a)
  const right = normalizeSharedState(b)
  const pinned = [...left.pinned]
  for (const name of right.pinned) if (!pinned.includes(name)) pinned.push(name)
  const usage = { ...left.usage }
  for (const [name, entry] of Object.entries(right.usage)) {
    const previous = usage[name]
    usage[name] = previous === undefined
      ? entry
      : { count: Math.max(previous.count, entry.count), lastUsed: Math.max(previous.lastUsed, entry.lastUsed) }
  }
  return normalizeSharedState({ pinned, usage })
```

</details>

**依据 11 · 源码核查**：[src/index.js:371-387](https://github.com/a735624258/dsh-skill-picker/blob/78af8bf5a5947570bd159ab6329c3e69de26e5e1/src/index.js#L371-L387)

状态读取和整份写入处理。

<details>
<summary>查看原文（17行）</summary>

```text
async function handleSharedState(req, res, url) {
  const json = (code, payload) => {
    res.writeHead(code, { 'content-type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify(payload))
  }
  try {
    if (req.method === 'PUT' || req.method === 'POST') {
      const incoming = normalizeSharedState(await readJsonBody(req))
      const migrate = url.searchParams.get('migrate') === '1'
      const stored = migrate ? await readSharedState() : null
      const next = stored === null ? await writeSharedState(incoming) : await writeSharedState(mergeSharedState(stored, incoming))
      json(200, { ok: true, state: next })
      return
    }
    json(200, { ok: true, state: await readSharedState() })
  } catch (error) {
    json(500, { ok: false, error: String(error?.message ?? error) })
```

</details>

**依据 12 · 源码核查**：[src/client/shared-state.js:106-169](https://github.com/a735624258/dsh-skill-picker/blob/78af8bf5a5947570bd159ab6329c3e69de26e5e1/src/client/shared-state.js#L106-L169)

本地镜像、状态失败与首次迁移。

<details>
<summary>查看原文（64行）</summary>

```text
export async function pushSharedState({ migrate = false } = {}) {
  try {
    const response = await fetch(`${ENDPOINT}${migrate ? '?migrate=1' : ''}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ pinned: readLocalPinned(), usage: readLocalUsage() }),
    })
    if (!response.ok) return false
    const body = await response.json()
    if (body?.ok !== true) return false
    if (migrate) writeLocal(body.state)
    return true
  } catch {
    return false
  }
}

/**
 * Pull the shared file into the local mirror.
 *
 * When this browser has never synced before and already holds pins/usage, the
 * pull goes through the UNIONING migration instead of a plain adopt — otherwise
 * whichever client boots first overwrites the file and the next one silently
 * loses its own pins. Once a browser has synced, it follows the file, so a pin
 * removed on another client really disappears here too.
 *
 * @returns whether the mirror was refreshed from the host.
 */
export async function pullSharedState() {
  try {
    const response = await fetch(ENDPOINT, { headers: { accept: 'application/json' } })
    if (!response.ok) return false
    const body = await response.json()
    if (body?.ok !== true) return false

    const localHasData = !isEmptyState({ pinned: readLocalPinned(), usage: readLocalUsage() })

    // Nothing shared yet: this browser seeds it.
    if (body.state === null || body.state === undefined) {
      const pushed = await pushSharedState({ migrate: true })
      if (pushed) markSynced()
      return true
    }

    // First sync on a browser that has its own data: union, never overwrite.
    if (!hasSynced() && localHasData) {
      const pushed = await pushSharedState({ migrate: true })
      if (pushed) {
        markSynced()
        return true
      }
    }

    // The shared file exists but is empty, and this browser is the only one
    // still holding data: push it rather than blanking the mirror.
    if (isEmptyState(body.state) && localHasData) {
      const pushed = await pushSharedState({ migrate: true })
      if (pushed) markSynced()
      return true
    }

    writeLocal(body.state)
    markSynced()
    return true
```

</details>

#### 缺口

- 未在真实宿主验证匿名和跨用户可达性，也未做链接、并发和清单故障注入。
  **影响**：无法仅以界面、请求头或目录层级证明租户隔离和可恢复性。
  **进一步探讨**：在隔离样例测试未经认证的访问、伪 cwd、跨目录链接、双客户端覆盖及清单失败，记录宿主拦截点与文件状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪些环境适合先观察，怎样验证后才试用？

**研究主题**：采用判断、依赖、兼容与流程、效果与总成本

#### 完整回答

已有大量命名不易记忆的 Skill 且使用个人本机 DSH Web 的开发者，可先观察该包能否改善选中路径。采用前用独立 DSH_HOME 和只含合成 Skill 的工作区，固定插件工件和宿主版本，重启后先测试只查找与点选。核对中文或拼音命中、现有草稿保留、显式发送和宿主实际加载。再按需检查恢复与双客户端同步，管理文件时用副本。共享或对外 Web 需要先查明宿主拒绝未授权路由、cwd 的可信来源与真实链接边界，固定头不足以覆盖这些条件。发现意外文件修改、错误目录、跨用户状态或宿主加载不一致时回到手写斜杠名，移除试验 profile 插件并重启，另外检查备份、禁用入口和残留共享状态。卸载插件和恢复已改变 Skill 文件是两种操作。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:57-107](https://github.com/a735624258/dsh-skill-picker/blob/78af8bf5a5947570bd159ab6329c3e69de26e5e1/README.md#L57-L107)

作者的重启、兼容、卸载和目录说明。

<details>
<summary>查看原文（51行）</summary>

````text
## 4、安装

### 4.1 三条路，按需要选一条

1. **要最新版** —— GitHub 直装（git 依赖直接拉最新 commit，不受 npm 24 小时门禁影响）
   ```sh
   dsh plugin --profile web add "git+ssh://git@github.com:a735624258/dsh-skill-picker.git"
   ```
2. **要 npm 正式版** —— 先查版本号，再按版本号装（**别用裸名**）
   ```sh
   npm view dsh-skill-picker version                      # 例如 0.5.28
   dsh plugin --profile web add dsh-skill-picker@0.5.28
   ```
3. **要改代码** —— clone 下来用 link 模式装
   ```sh
   git clone https://github.com/a735624258/dsh-skill-picker.git
   dsh plugin --profile web add link:/path/to/dsh-skill-picker
   ```

> ⚠️ 裸名安装（`add dsh-skill-picker`）在新版本发布后 **24 小时内**会被 pnpm 的 `minimumReleaseAge` 门禁拦下、**自动落回旧版**。照上面三条走就不会装错。

### 4.2 装完必须重启

host 路由是**进程启动时加载**的，只开个新标签页不生效：

| 你用的是 | 怎么重启 |
|---|---|
| 网页端 | 重启 `dsh web` 进程，必要时 `Ctrl+F5` 硬刷 |
| 桌面端 | 重启 `DeepSeek Harness.exe` 进程 |

### 4.3 网络与卸载

1. HTTPS 慢或不通 → 改用 SSH：`git clone git@github.com:a735624258/dsh-skill-picker.git`
2. 想让 pnpm 一律走 SSH：`git config --global url."git@github.com:".insteadOf "https://github.com/"`
3. `dsh` 被 PowerShell 执行策略挡下 → `powershell -ExecutionPolicy Bypass -Command "dsh plugin --profile web add link:C:\path\to\dsh-skill-picker"`
4. 卸载：`dsh plugin --profile web remove dsh-skill-picker`

### 4.4 兼容性与注意事项

| 内核版本 | 状态 |
|---|---|
| `0.1.0-rc.6` ~ `0.1.x` | 支持 |
| `0.2.0-rc.1` / `rc.2` 及 `0.2.x` | 支持（当前主用、实测） |
| `1.0.0` 及以上 | 需要重新确认 |

1. **peer 范围写得宽是故意的** —— `^0.1.0-rc.6 || >=0.2.0-rc.1 <1.0.0-0`。内核包与内核锁步同版本，钉死一个小版本线会让插件在内核升级时被**误拒**（日志一句 `skipping profile bundle`，表现是 ⚡ 按钮凭空消失）
2. **技能读哪些目录** —— 项目级 `<工作区>/.dsh/skills`、`<工作区>/.agents/skills`；用户级 `~/.dsh/skills`、`~/.agents/skills`（`$DSH_AGENTS_HOME` 可覆盖）；同名时项目级优先
3. **符号链接 / Junction 型技能会被跟随读取**；`user-invocable: false` 的技能不列出（列出来点了也会被官方静默跳过）
4. **桌面端无需任何手工处理**（v0.5.15 起）：官方技能 UI 在 `app.asar` 里还是普通目录都不影响
5. **手机端需配套** —— `dsh-pocket` 的「切会话不抢焦点」补丁与本插件的 `window.__dshSkillPickerFocusing` 豁免牌是一对，只装一边会出现「切会话抢焦点」或「插完技能光标不回」
6. **暂不支持**自定义技能目录（官方 `customSkillDirs`）—— 欢迎 PR
````

</details>

**依据 2 · 源码核查**：[src/client/index.jsx:898-918](https://github.com/a735624258/dsh-skill-picker/blob/78af8bf5a5947570bd159ab6329c3e69de26e5e1/src/client/index.jsx#L898-L918)

草稿与点选路径。

<details>
<summary>查看原文（21行）</summary>

```text
  const pick = (name) => {
    // Draft source: the render-time mirror of the live input store (see the
    // `draftRef` sync above). Appending onto anything else risks overwriting
    // the user's typed draft with a stale snapshot.
    const draft = draftRef.current
    const separator = draft === '' || draft.endsWith(' ') || draft.endsWith('\n') ? '' : ' '
    const next = `${draft}${separator}/${name} `
    try {
      if (typeof props.inputActions?.setDraft === 'function') {
        props.inputActions.setDraft(next)
      } else {
        console.error('[dsh-skill-picker] inputActions.setDraft unavailable; draft not written:', next)
      }
    } catch (cause) {
      console.error('[dsh-skill-picker] setDraft failed:', cause)
    }

    // Record usage for ordering (recent first, then frequent).
    const nextUsage = { ...usage, [name]: { count: (usage[name]?.count ?? 0) + 1, lastUsed: Date.now() } }
    setUsage(nextUsage)
    saveUsage(nextUsage)
```

</details>

**依据 3 · 源码核查**：[src/index.js:395-444](https://github.com/a735624258/dsh-skill-picker/blob/78af8bf5a5947570bd159ab6329c3e69de26e5e1/src/index.js#L395-L444)

管理前需要核验的 cwd 与请求头。

<details>
<summary>查看原文（50行）</summary>

```text
function allSkillRoots(cwd) {
  const roots = [userAgentsSkillsDir(), userSkillsDir()]
  if (typeof cwd === 'string' && cwd !== '') {
    roots.push(path.join(cwd, '.agents', 'skills'), path.join(cwd, '.dsh', 'skills'))
  }
  return roots
}

/**
 * `POST /dsh-skill-picker/skill` — disable / enable / reveal / uninstall /
 * restore a skill, and list the uninstall backups.
 *
 * Three guards, in order:
 *
 *  1. The request must carry `x-dsh-skill-picker: 1`. Plugin routes bypass the
 *     web server's auth gate (they are reachable without a cookie), and these
 *     actions rename and move files. A cross-site `fetch` cannot set a custom
 *     header without a CORS preflight the host does not answer, so this header
 *     is what keeps an arbitrary web page out.
 *  2. The target path must resolve inside a known skill root. Anything else —
 *     the root itself, a file nested inside a skill, `../..`, or an absolute
 *     path elsewhere — is refused before any filesystem call.
 *  3. Nothing is ever deleted. "Uninstall" moves the skill into
 *     `$DSH_HOME/skill-backups/` beside a manifest, and `restore` moves it back.
 */
async function handleSkillOp(req, res, url) {
  const json = (code, payload) => {
    res.writeHead(code, { 'content-type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify(payload))
  }
  if (req.method !== 'POST') {
    json(405, { ok: false, error: 'POST only' })
    return
  }
  if (req.headers[CLIENT_HEADER] !== '1') {
    json(403, { ok: false, error: 'missing client header' })
    return
  }
  try {
    const body = await readJsonBody(req)
    const cwd = url.searchParams.get('cwd') ?? undefined
    const roots = allSkillRoots(cwd)
    const action = String(body?.action ?? '')

    if (action === 'backups') {
      json(200, { ok: true, backups: await listSkillBackups(roots) })
      return
    }
    if (action === 'restore') {
      json(200, { ok: true, ...(await restoreSkillBackup(body?.id, roots)) })
```

</details>

**依据 4 · 源码核查**：[src/skill-ops.js:136-150](https://github.com/a735624258/dsh-skill-picker/blob/78af8bf5a5947570bd159ab6329c3e69de26e5e1/src/skill-ops.js#L136-L150)

需要保留的备份清单。

<details>
<summary>查看原文（15行）</summary>

```text
export async function uninstallSkill(target) {
  const kind = await pathKind(target)
  if (kind === undefined) throw new Error(`skill not found: ${target}`)
  const name = path.basename(target)
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupPath = path.join(skillBackupDir(), `${stamp}-${name}`)
  await mkdir(backupPath, { recursive: true })
  await rename(target, path.join(backupPath, name))
  await writeFile(path.join(backupPath, 'manifest.json'), `${JSON.stringify({
    name,
    kind,
    originalPath: target,
    movedAt: new Date().toISOString(),
  }, null, 2)}\n`, 'utf8')
  return { backupPath, restoreTarget: target }
```

</details>

**依据 5 · 源码核查**：[src/skill-ops.js:188-208](https://github.com/a735624258/dsh-skill-picker/blob/78af8bf5a5947570bd159ab6329c3e69de26e5e1/src/skill-ops.js#L188-L208)

恢复路径与冲突。

<details>
<summary>查看原文（21行）</summary>

```text
export async function restoreSkillBackup(id, roots) {
  if (typeof id !== 'string' || id === '' || id.includes('/') || id.includes('\\') || id.includes('..')) {
    throw new Error('invalid backup id')
  }
  const dir = path.join(skillBackupDir(), id)
  let manifest
  try {
    manifest = JSON.parse(await readFile(path.join(dir, 'manifest.json'), 'utf8'))
  } catch {
    throw new Error('that backup is gone')
  }
  const original = resolveSkillPath(manifest.originalPath, roots)
  if (original === undefined) throw new Error('that backup no longer points inside a skill root')
  if (await exists(original)) {
    throw new Error(`${path.basename(original)} is occupied again — move it away first`)
  }
  await rename(path.join(dir, path.basename(original)), original)
  const done = path.join(skillBackupDir(), '.restored')
  await mkdir(done, { recursive: true })
  await rename(dir, path.join(done, id)).catch(() => {})
  return { restored: original }
```

</details>

**依据 6 · 源码核查**：[src/index.js:526-555](https://github.com/a735624258/dsh-skill-picker/blob/78af8bf5a5947570bd159ab6329c3e69de26e5e1/src/index.js#L526-L555)

启动时的旧补丁恢复分支。

<details>
<summary>查看原文（30行）</summary>

```text
  // The `/` enhancement no longer edits official files.
  //
  // Since v0.5.15 it takes over the LIVE trigger source at runtime, which does
  // everything the old file patch did (skill group first, fuzzy+pinyin matching,
  // usage tracking) without touching a single file. The patch is therefore
  // redundant — and a modified copy of an official package is confusing in its
  // own right: it made the desktop and web profiles disagree about one shared
  // file, and it is what made "is this the original?" impossible to answer.
  //
  // So the default is now to RESTORE our own patch (from the `.bak` it made).
  // Set DSH_SKILL_PICKER_FILE_PATCH=1 to fall back to the old behaviour on a
  // kernel whose trigger registry has no live sources to take over.
  ctx.effect(() => {
    const enabled = process.env.DSH_SKILL_PICKER_FILE_PATCH === '1'
    const task = enabled
      ? healUiSkillPatches().then((report) => reportUiSkillPatches(report))
      : revertUiSkillPatches().then((report) => {
        if (report.restored.length > 0) {
          console.log('[dsh-skill-picker] ui-skill patch retired; restored original file(s):',
            report.restored.join(', '))
        }
        if (report.errors.length > 0) {
          console.warn('[dsh-skill-picker] ui-skill restore errors:', JSON.stringify(report.errors))
        }
      })
    task.catch((error) => {
      console.warn('[dsh-skill-picker] ui-skill patch failed:', error)
    })
    return () => {}
  }, 'dsh-skill-picker: ui-skill self-heal patch')
```

</details>

#### 缺口

- 未验收目标 profile 的接线、退出与对外访问控制。
  **影响**：采用结论是观察，个人隔离环境也需先验证，不能外推到共享部署。
  **进一步探讨**：固定宿主、工件与隔离目录，以无副作用 Skill 记录功能、拒绝、恢复和退出。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何判断中文、拼音与排序提高选对率？

**研究主题**：新假设与验证、效果与总成本

#### 完整回答

假设以任务词描述需求的用户在大量已装 Skill 中，能更快通过名称、描述、拼音与近期排序找到正确候选。以手写斜杠名和原生未增强菜单为基线，固定宿主、Skill 清单和任务集，包含常用、新出现、拼音首字母和同名遮蔽任务。用交错顺序记录首次选对秒数、选错率、发送后真实载入成功率、切换项目后的候选差异和首次安装维护时间。分别观察冷缓存和已使用后的排序。插件的选中计数只能作为点击过程记录。若在耗时和选错率有改善且宿主载入成功率持平，才支持这个场景中的优势。若易找到但频繁选错同名项、候选陈旧或发送后加载失败，则推翻净收益假设。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.jsx:285-337](https://github.com/a735624258/dsh-skill-picker/blob/78af8bf5a5947570bd159ab6329c3e69de26e5e1/src/client/index.jsx#L285-L337)

复用的搜索与排序规则。

<details>
<summary>查看原文（53行）</summary>

```text
function matchRank(skill, q) {
  const name = skill.name.toLowerCase()
  const desc = String(skill.description ?? '').toLowerCase()
  const py = skillPinyinText(skill.name, skill.description ?? '').toLowerCase()
  if (name.startsWith(q)) return 0
  if (name.includes(q)) return 1
  if (desc.includes(q)) return 2
  if (py.includes(q)) return 3
  return 4
}

/**
 * The picker's single ranking rule, shared by the ⚡ panel, the legacy `/`
 * matcher and the runtime `/` takeover (issue #14) so the two lists can never
 * disagree about matching OR order.
 *
 * Only `name` and `description` are read, which is what both raw skill entries
 * and the official menu's already-mapped display items carry.
 *
 * Relevance first (name-startsWith > name-contains > description > pinyin),
 * then the ⚡ panel's pinned/usage order as the tiebreak — fuzzysort decides
 * WHO matches, never the display order. Pure subsequence noise (dispersed
 * letters that never form an actual substring) is dropped.
 *
 * @param items - [{ name, description }]
 * @param query - the raw query string.
 * @returns the ranked subset (all items, in panel order, for an empty query).
 */
function rankPickerItems(items, query) {
  const ordered = groupByPinned(
    Array.isArray(items) ? items : [],
    loadUsage(),
    loadPinned(),
  ).flatMap((group) => group.items)
  const q = String(query ?? '').trim().toLowerCase()
  if (q === '') return ordered
  const order = new Map(ordered.map((skill, index) => [skill.name, index]))
  const targets = ordered.map((s) => ({
    s,
    search: `${s.name} ${s.description ?? ''} ${skillPinyinText(s.name, s.description ?? '')}`,
  }))
  return fuzzysort.go(q, targets, {
    key: 'search',
    limit: 30,
    threshold: -10000,
  })
    .filter((r) => r.score > 0)
    .map((r) => r.obj.s)
    .filter((s) => matchRank(s, q) < 4)
    .sort((a, b) => matchRank(a, q) - matchRank(b, q) || (order.get(a.name) ?? 0) - (order.get(b.name) ?? 0))
}

/** Row height matches the resident chrome (access mode, plan, attach, model). */
```

</details>

**依据 2 · 源码核查**：[src/client/index.jsx:898-918](https://github.com/a735624258/dsh-skill-picker/blob/78af8bf5a5947570bd159ab6329c3e69de26e5e1/src/client/index.jsx#L898-L918)

点选计数的实际时点。

<details>
<summary>查看原文（21行）</summary>

```text
  const pick = (name) => {
    // Draft source: the render-time mirror of the live input store (see the
    // `draftRef` sync above). Appending onto anything else risks overwriting
    // the user's typed draft with a stale snapshot.
    const draft = draftRef.current
    const separator = draft === '' || draft.endsWith(' ') || draft.endsWith('\n') ? '' : ' '
    const next = `${draft}${separator}/${name} `
    try {
      if (typeof props.inputActions?.setDraft === 'function') {
        props.inputActions.setDraft(next)
      } else {
        console.error('[dsh-skill-picker] inputActions.setDraft unavailable; draft not written:', next)
      }
    } catch (cause) {
      console.error('[dsh-skill-picker] setDraft failed:', cause)
    }

    // Record usage for ordering (recent first, then frequent).
    const nextUsage = { ...usage, [name]: { count: (usage[name]?.count ?? 0) + 1, lastUsed: Date.now() } }
    setUsage(nextUsage)
    saveUsage(nextUsage)
```

</details>

**依据 3 · 源码核查**：[src/client/slash-source.js:265-305](https://github.com/a735624258/dsh-skill-picker/blob/78af8bf5a5947570bd159ab6329c3e69de26e5e1/src/client/slash-source.js#L265-L305)

冷缓存与热缓存的具体行为。

<details>
<summary>查看原文（41行）</summary>

```text
  const wrappedCandidates = typeof rank === 'function' && typeof original.candidates === 'function'
    ? async function candidates(projection, args) {
        const options = args ?? {}
        const query = String(options.query ?? '').trim()
        const sessionId = projection?.sessionId
        const cacheKey = typeof sessionId === 'string' ? sessionId : undefined
        const cached = cacheKey === undefined ? undefined : itemCache.get(cacheKey)

        // Cache hit: return WITHOUT awaiting anything. The returned promise is
        // already resolved, so this group settles on the first microtask — ahead
        // of any group whose candidates awaits even a settled promise.
        if (cached !== undefined) {
          noteDiag({ mode: 'runtime', servedFromCache: true, sessionId: cacheKey, query })
          refreshCache(cacheKey, original.candidates, this, projection, options)
          try {
            // Rank even for an empty query: that is what puts the pinned skills
            // on top, exactly like the ⚡ panel. Returning the official list
            // untouched here made the two lists disagree — the menu looked
            // alphabetical while the panel led with 置顶.
            return rank(cached, query)
          } catch {
            return cached
          }
        }

        const everything = await original.candidates.call(this, projection, { ...options, query: '' })
        if (cacheKey !== undefined && Array.isArray(everything)) {
          // Store a SNAPSHOT, never the caller's array: the official source hands
          // back a container it may keep and grow, and aliasing it would make the
          // cache mutate underneath us.
          itemCache.set(cacheKey, everything.slice())
          noteDiag({ mode: 'runtime', servedFromCache: false, sessionId: cacheKey, primed: true, count: everything.length })
        }
        if (!Array.isArray(everything)) return everything
        try {
          return rank(everything, query)
        } catch {
          // Ranking is an enhancement: a picker bug must never break the menu.
          return everything
        }
      }
```

</details>

**依据 4 · 源码核查**：[src/index.js:222-230](https://github.com/a735624258/dsh-skill-picker/blob/78af8bf5a5947570bd159ab6329c3e69de26e5e1/src/index.js#L222-L230)

同名覆盖依据。

```text
export async function scanSkills(cwd) {
  const map = new Map()
  await scanSkillsDirInto(map, userAgentsSkillsDir())
  await scanSkillsDirInto(map, userSkillsDir())
  if (typeof cwd === 'string' && cwd !== '') {
    await scanSkillsDirInto(map, path.join(cwd, '.agents', 'skills'))
    await scanSkillsDirInto(map, path.join(cwd, '.dsh', 'skills'))
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name))
```

#### 缺口

- 没有同任务查找耗时、错选和成功载入数据。
  **影响**：无法量化词汇搜索的收益，也不能用点击次数替代成功率。
  **进一步探讨**：用有标准答案的合成任务记录正确对象和宿主载入证据，再比较分布。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
