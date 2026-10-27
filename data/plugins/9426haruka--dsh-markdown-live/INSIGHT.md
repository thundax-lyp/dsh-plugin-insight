# dsh-markdown-live

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[1f47a60](https://github.com/9426Haruka/dsh-markdown-live/tree/1f47a60954fde04b71cf404e8e42124a5d07959e)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/9426Haruka/dsh-markdown-live)
<!-- END META -->

> **功能**：在 DSH 输入框实时着色/成形 Markdown，并让已发送用户文本复用宿主 Markdown 渲染器。

> **亮点**：相对纯文本 composer，它在不改变提交字符串的前提下提供接近 WYSIWYG 的输入反馈，并保留 mention/skill等非文本节点。贡献主要是 Lexical 适配与交互细节；表格、图片预览和代码语法高亮未覆盖，且依赖宿主内部节点结构。 详见[Q03](#research-q03)。

> **主要限制**：关键质疑是“显示层不改文本”能否在所有编辑操作成立。节点切分、格式位、软换行归一、IME 与粘贴互相作用可能造成光标跳动、撤销历史异常或隐藏标记误导；覆盖宿主 text renderer 的 priority 约定升级后可能失效。长文暂停也造成体验不一致。 详见[Q04](#research-q04)。

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
  - [Q01 · 谁在何种重复场景需要 dsh-markdown-live，合格交付与简单替代是什么？](#detail-section-11)
  - [Q02 · dsh-markdown-live 的入口、调用链、状态变化与副作用如何实现？](#detail-section-12)
  - [Q03 · 相对宿主原生能力或简单替代，dsh-markdown-live 的具体增量是什么？](#detail-section-13)
  - [Q04 · 什么前提最可能使 dsh-markdown-live 的核心价值不成立？](#detail-section-14)
  - [Q05 · dsh-markdown-live 启动、持续生效与失败降级依赖什么？](#detail-section-15)
  - [Q06 · dsh-markdown-live 完成一个合格任务的首次、持续与失败恢复成本是什么？](#detail-section-16)
  - [Q07 · dsh-markdown-live 的工程可靠性和可迁移设计如何？](#detail-section-17)
  - [Q08 · 由贡献与限制可推导什么可证伪的新设计假设？](#detail-section-18)
  - [Q09 · 哪些人应观察、试用或拒绝采用 dsh-markdown-live？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：经常在 DSH 输入长 Markdown 的作者希望发送前看到标题、列表、引用和行内格式，同时提交原始文本不变；基线是纯文本输入后再看消息渲染。合格结果是输入、粘贴、中文 IME、撤销、光标和发送字节均正确，长草稿不阻塞，禁用后格式与监听清理。 详见[Q01](#research-q01)。

经常在 DSH 输入长 Markdown 的作者希望发送前看到标题、列表、引用和行内格式，同时提交原始文本不变；基线是纯文本输入后再看消息渲染。合格结果是输入、粘贴、中文 IME、撤销、光标和发送字节均正确，长草稿不阻塞，禁用后格式与监听清理。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 实时Markdown成形 | 发送前显示标题/列表/引用/行内格式 | 表格和图片预览不支持；>12000字符暂停 |
| 编辑快捷行为 | 延续列表/引用、围栏补全、退格退出 | 需验证IME、撤销与selection |
| 用户消息渲染 | 复用宿主MarkdownText显示已发送文本 | 依赖slot priority和宿主renderer |
| 禁用清理 | 移除样式、监听和DOM class | 格式位仅尽力清除 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Desktop 0.2.x web client | 必需 | 提供composer和bundle | 大版本升级可能不兼容 |
| Lexical内部editor结构 | 必需 | 读取/拆分/格式化文本节点 | DOM或节点变化会失效 |
| locale/ui-conversation/ui-primitives | 必需 | slot、字典与MarkdownText | 缺失则加载或渲染失败 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 安装 | 用户装bundle并重载client | 插件在设置列表可开关 |
| 编辑 | 输入/粘贴Markdown | 当前行保留标记，其余成形 |
| 发送 | 宿主提交字面Markdown | 已发送消息按Markdown显示 |
| 恢复 | 禁用并重载 | 原始草稿应不变；异常则复制纯文本救援 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 无外部费；少量client资源 | 安装、重载、主题CSS与固定样本检查 | 适配工时未知 |
| 持续编辑 | 每帧分析/节点操作，长文暂停 | 处理不支持表格/图片的视觉差异 | 应按无卡顿且字节一致的草稿计量 |
| 失败恢复 | 可能损失编辑状态而非外部现金 | 禁用、重载、从纯文本副本恢复 | 撤销/光标异常未实测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 写作预览 | 源码覆盖常见块/行内语法 | 真实编辑效率和错误率 |
| 文本保真 | 设计保持提交投影不变 | 复杂操作序列的字节一致性 |
| 性能保护 | 缓存、帧合并和12k阈值 | 不同机器输入延迟 |

> **思考**：关键质疑是“显示层不改文本”能否在所有编辑操作成立。节点切分、格式位、软换行归一、IME 与粘贴互相作用可能造成光标跳动、撤销历史异常或隐藏标记误导；覆盖宿主 text renderer 的 priority 约定升级后可能失效。长文暂停也造成体验不一致。 详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对纯文本 composer，它在不改变提交字符串的前提下提供接近 WYSIWYG 的输入反馈，并保留 mention/skill等非文本节点。贡献主要是 Lexical 适配与交互细节；表格、图片预览和代码语法高亮未覆盖，且依赖宿主内部节点结构。 详见[Q03](#research-q03)。

扫描、Lexical成形、DOM表现和消息渲染集中在单个大 client.js，部署简单但维护耦合高。逐块缓存、帧合并、IME保护和卸载 disposer 可借鉴；复用需建立编辑器属性测试，不能只依赖截图。 详见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

关键质疑是“显示层不改文本”能否在所有编辑操作成立。节点切分、格式位、软换行归一、IME 与粘贴互相作用可能造成光标跳动、撤销历史异常或隐藏标记误导；覆盖宿主 text renderer 的 priority 约定升级后可能失效。长文暂停也造成体验不一致。 详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

经常写 Markdown 且能接受表格/图片限制的 DSH Desktop 用户可在非关键草稿试用；先复制带中英混排、列表、链接和代码围栏的固定样本，校验发送前后字节与撤销。依赖无障碍输入、超长文档或宿主版本频繁升级的人应先观察。 详见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认了 Lexical 节点成形、DOM 标记淡出、用户文本渲染器覆盖、帧合并和长文暂停；本轮未在目标 Desktop 执行 IME、粘贴、撤销或发送，因此只能确认显示层实现，不能确认复杂编辑序列下文本字节、selection 与 undo 始终不变。

- 已检查：作者 README、包清单、源码路径 README.md、client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读检查固定提交 1f47a60954fde04b71cf404e8e42124a5d07959e 的作者材料、入口与关键源码；不运行插件、测试、外部服务或真实 Host；检查时间不早于 2026-10-22T15:49:47Z。
- 下一步：在目标 Desktop 用固定中英样本执行输入、组合输入、跨行粘贴、列表退格、围栏补全、撤销重做和12001字符阈值；逐字节比较发送 payload，禁用后检查DOM/格式清理与消息renderer回退。

**分析版本**

- **仓库**：[9426Haruka/dsh-markdown-live](https://github.com/9426Haruka/dsh-markdown-live)
- **版本号**：0.2.14（[固定提交 1f47a60](https://github.com/9426Haruka/dsh-markdown-live/tree/1f47a60954fde04b71cf404e8e42124a5d07959e)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是把“文本投影恒等”做成基于属性的编辑序列测试，可在宿主升级时自动发现光标/撤销/字节漂移。最小生成1000条含IME、粘贴、列表退格和围栏的操作序列，比较插件前后最终纯文本、selection与undo；任一字节差异即否定安全启用。 详见[Q08](#research-q08)。

在目标 Desktop 用固定中英样本执行输入、组合输入、跨行粘贴、列表退格、围栏补全、撤销重做和12001字符阈值；逐字节比较发送 payload，禁用后检查DOM/格式清理与消息renderer回退。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 2168 | 1834 | 251 | — |
| .md | source | 1 | 100 | — | — | 1314 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/9426Haruka/dsh-markdown-live/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：dsh-markdown-live 在固定版本下是否以可控依赖和总成本交付其核心能力，并值得目标用户采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁在何种重复场景需要 dsh-markdown-live，合格交付与简单替代是什么？

**研究主题**：场景与需求

#### 完整回答

经常在 DSH 输入长 Markdown 的作者希望发送前看到标题、列表、引用和行内格式，同时提交原始文本不变；基线是纯文本输入后再看消息渲染。合格结果是输入、粘贴、中文 IME、撤销、光标和发送字节均正确，长草稿不阻塞，禁用后格式与监听清理。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-23](https://github.com/9426Haruka/dsh-markdown-live/blob/1f47a60954fde04b71cf404e8e42124a5d07959e/README.md#L9-L23)

固定版本作者材料支持 Q01 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（15行）</summary>

```text
## 特性

- **输入框实时渲染**：打字/粘贴 Markdown 时语法立刻以真实样式呈现，无需发送。
- **语法标记自动淡出**：光标所在行保留淡显标记方便定位，其余行的 `#`、`*`、`~~`、`` ` ``、`[]()`、`- `、`>` 自动隐去，接近所见即所得。
- **块级样式**：`#`~`######` 标题、`>` 引用、无序/有序/任务列表（含缩进层级）、代码围栏（含语言名、围栏行自动收起）、`---` 分割线。
- **交互增强**：列表/引用 `Shift+Enter` 自动延续；`Backspace` 移除标记、退出空代码行；代码围栏自动补全；多行粘贴到列表/引用自动补前缀。
- **中文输入友好**：拼音组合阶段文字保持正常颜色；标记与正文的分隔空格是普通文本节点，光标停在其中。
- **发送内容不变**：所有渲染只作用于显示层（Lexical 文本格式位 + DOM class），提交文本仍是逐字节不变的 Markdown。
- **用户消息渲染**：覆盖宿主 `text` 渲染器，复用 DSH 自带 Markdown 渲染器；@ 提及 / 技能 chip / 消息操作按钮全部保留，普通换行也会保留。
- **无构建步骤**：全部逻辑在 `client.js` 单文件里，改完宿主热重载即可生效。

## 环境要求

- DSH 桌面版 **0.2.x**（web 平台的 client bundle）。
- 已启用 `@deepseek-ai/dsh-client-locale`、`@deepseek-ai/dsh-client-ui-conversation` 两个 client 插件（DSH 自带）。
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · dsh-markdown-live 的入口、调用链、状态变化与副作用如何实现？

**研究主题**：功能与机制

#### 完整回答

client bundle 获取 Lexical editor，把软换行归一成段落、扫描块/行内语法、在 editor.update 中拆节点和设置格式/detail，再用 DOM class 隐藏非光标行标记；conversation.user.text.node 以更低 priority 覆盖文本渲染器并调用宿主 MarkdownText。分析按块缓存、每帧合并，超过12000字符暂停实时渲染。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:2110-2155](https://github.com/9426Haruka/dsh-markdown-live/blob/1f47a60954fde04b71cf404e8e42124a5d07959e/client.js#L2110-L2155)

固定版本源码用于核对 Q02 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（46行）</summary>

```text
        ctx.effect(() => {
          const tag = document.createElement('style')
          tag.dataset.dshMarkdownLive = ''
          tag.textContent = CSS
          document.head.appendChild(tag)
          return () => tag.remove()
        }, 'dsh-markdown-live: stylesheet')

        // Markdown chrome labels for the host's own renderer.
        ctx.effect(() => ctx.locale.register(NS, LOCALE), 'dsh-markdown-live: dictionaries')

        // Sent user messages render Markdown in place of the plain text node.
        const UserTextMarkdown = createUserTextMarkdown()
        ctx.slots.inject('conversation.user.text.node', () =>
          ctx.slots.register({
            name: 'conversation.user.text.node',
            key: 'text',
            // The slot renders the LOWEST priority entry for a key; the
            // shipped plain-text renderer sits at 100, so shadow it below.
            priority: -1,
            locale: NS,
          }, UserTextMarkdown),
        )

        // Live composer rendering.
        const renderer = createLiveRenderer(log)
        renderer.wireAttempt()
        document.addEventListener('focusin', renderer.onFocusIn, true)
        document.addEventListener('keydown', renderer.onKeyDown, true)
        document.addEventListener('paste', renderer.onPaste, true)
        // A composer can mount without ever receiving focus (restored session,
        // new session panel): poll for the editor instance and wire it.
        const poll = setInterval(renderer.wireAttempt, 500)
        ctx.effect(() => () => {
          clearInterval(poll)
          document.removeEventListener('focusin', renderer.onFocusIn, true)
          document.removeEventListener('keydown', renderer.onKeyDown, true)
          document.removeEventListener('paste', renderer.onPaste, true)
          renderer.dispose()
          const root = document.querySelector(COMPOSER_INPUT)
          if (root instanceof HTMLElement) {
            for (const el of root.querySelectorAll('[class*="dml-"]')) {
              if (el instanceof HTMLElement) stripClasses(el)
            }
          }
        }, 'dsh-markdown-live: live renderer')
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对宿主原生能力或简单替代，dsh-markdown-live 的具体增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

相对纯文本 composer，它在不改变提交字符串的前提下提供接近 WYSIWYG 的输入反馈，并保留 mention/skill等非文本节点。贡献主要是 Lexical 适配与交互细节；表格、图片预览和代码语法高亮未覆盖，且依赖宿主内部节点结构。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-23](https://github.com/9426Haruka/dsh-markdown-live/blob/1f47a60954fde04b71cf404e8e42124a5d07959e/README.md#L9-L23)

固定版本作者材料支持 Q03 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（15行）</summary>

```text
## 特性

- **输入框实时渲染**：打字/粘贴 Markdown 时语法立刻以真实样式呈现，无需发送。
- **语法标记自动淡出**：光标所在行保留淡显标记方便定位，其余行的 `#`、`*`、`~~`、`` ` ``、`[]()`、`- `、`>` 自动隐去，接近所见即所得。
- **块级样式**：`#`~`######` 标题、`>` 引用、无序/有序/任务列表（含缩进层级）、代码围栏（含语言名、围栏行自动收起）、`---` 分割线。
- **交互增强**：列表/引用 `Shift+Enter` 自动延续；`Backspace` 移除标记、退出空代码行；代码围栏自动补全；多行粘贴到列表/引用自动补前缀。
- **中文输入友好**：拼音组合阶段文字保持正常颜色；标记与正文的分隔空格是普通文本节点，光标停在其中。
- **发送内容不变**：所有渲染只作用于显示层（Lexical 文本格式位 + DOM class），提交文本仍是逐字节不变的 Markdown。
- **用户消息渲染**：覆盖宿主 `text` 渲染器，复用 DSH 自带 Markdown 渲染器；@ 提及 / 技能 chip / 消息操作按钮全部保留，普通换行也会保留。
- **无构建步骤**：全部逻辑在 `client.js` 单文件里，改完宿主热重载即可生效。

## 环境要求

- DSH 桌面版 **0.2.x**（web 平台的 client bundle）。
- 已启用 `@deepseek-ai/dsh-client-locale`、`@deepseek-ai/dsh-client-ui-conversation` 两个 client 插件（DSH 自带）。
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么前提最可能使 dsh-markdown-live 的核心价值不成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

关键质疑是“显示层不改文本”能否在所有编辑操作成立。节点切分、格式位、软换行归一、IME 与粘贴互相作用可能造成光标跳动、撤销历史异常或隐藏标记误导；覆盖宿主 text renderer 的 priority 约定升级后可能失效。长文暂停也造成体验不一致。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:2110-2155](https://github.com/9426Haruka/dsh-markdown-live/blob/1f47a60954fde04b71cf404e8e42124a5d07959e/client.js#L2110-L2155)

固定版本源码用于核对 Q04 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（46行）</summary>

```text
        ctx.effect(() => {
          const tag = document.createElement('style')
          tag.dataset.dshMarkdownLive = ''
          tag.textContent = CSS
          document.head.appendChild(tag)
          return () => tag.remove()
        }, 'dsh-markdown-live: stylesheet')

        // Markdown chrome labels for the host's own renderer.
        ctx.effect(() => ctx.locale.register(NS, LOCALE), 'dsh-markdown-live: dictionaries')

        // Sent user messages render Markdown in place of the plain text node.
        const UserTextMarkdown = createUserTextMarkdown()
        ctx.slots.inject('conversation.user.text.node', () =>
          ctx.slots.register({
            name: 'conversation.user.text.node',
            key: 'text',
            // The slot renders the LOWEST priority entry for a key; the
            // shipped plain-text renderer sits at 100, so shadow it below.
            priority: -1,
            locale: NS,
          }, UserTextMarkdown),
        )

        // Live composer rendering.
        const renderer = createLiveRenderer(log)
        renderer.wireAttempt()
        document.addEventListener('focusin', renderer.onFocusIn, true)
        document.addEventListener('keydown', renderer.onKeyDown, true)
        document.addEventListener('paste', renderer.onPaste, true)
        // A composer can mount without ever receiving focus (restored session,
        // new session panel): poll for the editor instance and wire it.
        const poll = setInterval(renderer.wireAttempt, 500)
        ctx.effect(() => () => {
          clearInterval(poll)
          document.removeEventListener('focusin', renderer.onFocusIn, true)
          document.removeEventListener('keydown', renderer.onKeyDown, true)
          document.removeEventListener('paste', renderer.onPaste, true)
          renderer.dispose()
          const root = document.querySelector(COMPOSER_INPUT)
          if (root instanceof HTMLElement) {
            for (const el of root.querySelectorAll('[class*="dml-"]')) {
              if (el instanceof HTMLElement) stripClasses(el)
            }
          }
        }, 'dsh-markdown-live: live renderer')
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · dsh-markdown-live 启动、持续生效与失败降级依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

要求 DSH Desktop 0.2.x web client、locale、ui-conversation、ui-primitives MarkdownText 和可访问的 Lexical 私有 editor 引用；Host 半只是开关载体。宿主 DOM/节点/slot priority 变化会破坏能力，禁用时清理只能“尽力”清除格式位。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-23](https://github.com/9426Haruka/dsh-markdown-live/blob/1f47a60954fde04b71cf404e8e42124a5d07959e/README.md#L9-L23)

固定版本作者材料支持 Q05 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（15行）</summary>

```text
## 特性

- **输入框实时渲染**：打字/粘贴 Markdown 时语法立刻以真实样式呈现，无需发送。
- **语法标记自动淡出**：光标所在行保留淡显标记方便定位，其余行的 `#`、`*`、`~~`、`` ` ``、`[]()`、`- `、`>` 自动隐去，接近所见即所得。
- **块级样式**：`#`~`######` 标题、`>` 引用、无序/有序/任务列表（含缩进层级）、代码围栏（含语言名、围栏行自动收起）、`---` 分割线。
- **交互增强**：列表/引用 `Shift+Enter` 自动延续；`Backspace` 移除标记、退出空代码行；代码围栏自动补全；多行粘贴到列表/引用自动补前缀。
- **中文输入友好**：拼音组合阶段文字保持正常颜色；标记与正文的分隔空格是普通文本节点，光标停在其中。
- **发送内容不变**：所有渲染只作用于显示层（Lexical 文本格式位 + DOM class），提交文本仍是逐字节不变的 Markdown。
- **用户消息渲染**：覆盖宿主 `text` 渲染器，复用 DSH 自带 Markdown 渲染器；@ 提及 / 技能 chip / 消息操作按钮全部保留，普通换行也会保留。
- **无构建步骤**：全部逻辑在 `client.js` 单文件里，改完宿主热重载即可生效。

## 环境要求

- DSH 桌面版 **0.2.x**（web 平台的 client bundle）。
- 已启用 `@deepseek-ai/dsh-client-locale`、`@deepseek-ai/dsh-client-ui-conversation` 两个 client 插件（DSH 自带）。
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · dsh-markdown-live 完成一个合格任务的首次、持续与失败恢复成本是什么？

**研究主题**：效果与总成本

#### 完整回答

首次安装/重载并按主题调 CSS；持续每次编辑触发块分析、节点切分和 DOM class 更新，12000字符后停用以限制卡顿；失败恢复是禁用插件、重载客户端并核对原始草稿，若格式位未清干净需重新打开会话，不能用发送后的渲染判断草稿字节。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:2110-2155](https://github.com/9426Haruka/dsh-markdown-live/blob/1f47a60954fde04b71cf404e8e42124a5d07959e/client.js#L2110-L2155)

固定版本源码用于核对 Q06 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（46行）</summary>

```text
        ctx.effect(() => {
          const tag = document.createElement('style')
          tag.dataset.dshMarkdownLive = ''
          tag.textContent = CSS
          document.head.appendChild(tag)
          return () => tag.remove()
        }, 'dsh-markdown-live: stylesheet')

        // Markdown chrome labels for the host's own renderer.
        ctx.effect(() => ctx.locale.register(NS, LOCALE), 'dsh-markdown-live: dictionaries')

        // Sent user messages render Markdown in place of the plain text node.
        const UserTextMarkdown = createUserTextMarkdown()
        ctx.slots.inject('conversation.user.text.node', () =>
          ctx.slots.register({
            name: 'conversation.user.text.node',
            key: 'text',
            // The slot renders the LOWEST priority entry for a key; the
            // shipped plain-text renderer sits at 100, so shadow it below.
            priority: -1,
            locale: NS,
          }, UserTextMarkdown),
        )

        // Live composer rendering.
        const renderer = createLiveRenderer(log)
        renderer.wireAttempt()
        document.addEventListener('focusin', renderer.onFocusIn, true)
        document.addEventListener('keydown', renderer.onKeyDown, true)
        document.addEventListener('paste', renderer.onPaste, true)
        // A composer can mount without ever receiving focus (restored session,
        // new session panel): poll for the editor instance and wire it.
        const poll = setInterval(renderer.wireAttempt, 500)
        ctx.effect(() => () => {
          clearInterval(poll)
          document.removeEventListener('focusin', renderer.onFocusIn, true)
          document.removeEventListener('keydown', renderer.onKeyDown, true)
          document.removeEventListener('paste', renderer.onPaste, true)
          renderer.dispose()
          const root = document.querySelector(COMPOSER_INPUT)
          if (root instanceof HTMLElement) {
            for (const el of root.querySelectorAll('[class*="dml-"]')) {
              if (el instanceof HTMLElement) stripClasses(el)
            }
          }
        }, 'dsh-markdown-live: live renderer')
```

</details>

#### 缺口

- 复杂编辑序列下的文本、selection和undo恒等性未知
  **影响**：若不成立会直接损坏用户草稿
  **进一步探讨**：生成1000条IME/粘贴/列表/围栏操作序列，对照最终文本、selection与undo栈

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · dsh-markdown-live 的工程可靠性和可迁移设计如何？

**研究主题**：工程质量与复用

#### 完整回答

扫描、Lexical成形、DOM表现和消息渲染集中在单个大 client.js，部署简单但维护耦合高。逐块缓存、帧合并、IME保护和卸载 disposer 可借鉴；复用需建立编辑器属性测试，不能只依赖截图。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:2110-2155](https://github.com/9426Haruka/dsh-markdown-live/blob/1f47a60954fde04b71cf404e8e42124a5d07959e/client.js#L2110-L2155)

固定版本源码用于核对 Q07 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（46行）</summary>

```text
        ctx.effect(() => {
          const tag = document.createElement('style')
          tag.dataset.dshMarkdownLive = ''
          tag.textContent = CSS
          document.head.appendChild(tag)
          return () => tag.remove()
        }, 'dsh-markdown-live: stylesheet')

        // Markdown chrome labels for the host's own renderer.
        ctx.effect(() => ctx.locale.register(NS, LOCALE), 'dsh-markdown-live: dictionaries')

        // Sent user messages render Markdown in place of the plain text node.
        const UserTextMarkdown = createUserTextMarkdown()
        ctx.slots.inject('conversation.user.text.node', () =>
          ctx.slots.register({
            name: 'conversation.user.text.node',
            key: 'text',
            // The slot renders the LOWEST priority entry for a key; the
            // shipped plain-text renderer sits at 100, so shadow it below.
            priority: -1,
            locale: NS,
          }, UserTextMarkdown),
        )

        // Live composer rendering.
        const renderer = createLiveRenderer(log)
        renderer.wireAttempt()
        document.addEventListener('focusin', renderer.onFocusIn, true)
        document.addEventListener('keydown', renderer.onKeyDown, true)
        document.addEventListener('paste', renderer.onPaste, true)
        // A composer can mount without ever receiving focus (restored session,
        // new session panel): poll for the editor instance and wire it.
        const poll = setInterval(renderer.wireAttempt, 500)
        ctx.effect(() => () => {
          clearInterval(poll)
          document.removeEventListener('focusin', renderer.onFocusIn, true)
          document.removeEventListener('keydown', renderer.onKeyDown, true)
          document.removeEventListener('paste', renderer.onPaste, true)
          renderer.dispose()
          const root = document.querySelector(COMPOSER_INPUT)
          if (root instanceof HTMLElement) {
            for (const el of root.querySelectorAll('[class*="dml-"]')) {
              if (el instanceof HTMLElement) stripClasses(el)
            }
          }
        }, 'dsh-markdown-live: live renderer')
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由贡献与限制可推导什么可证伪的新设计假设？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是把“文本投影恒等”做成基于属性的编辑序列测试，可在宿主升级时自动发现光标/撤销/字节漂移。最小生成1000条含IME、粘贴、列表退格和围栏的操作序列，比较插件前后最终纯文本、selection与undo；任一字节差异即否定安全启用。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:2110-2155](https://github.com/9426Haruka/dsh-markdown-live/blob/1f47a60954fde04b71cf404e8e42124a5d07959e/client.js#L2110-L2155)

固定版本源码用于核对 Q08 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（46行）</summary>

```text
        ctx.effect(() => {
          const tag = document.createElement('style')
          tag.dataset.dshMarkdownLive = ''
          tag.textContent = CSS
          document.head.appendChild(tag)
          return () => tag.remove()
        }, 'dsh-markdown-live: stylesheet')

        // Markdown chrome labels for the host's own renderer.
        ctx.effect(() => ctx.locale.register(NS, LOCALE), 'dsh-markdown-live: dictionaries')

        // Sent user messages render Markdown in place of the plain text node.
        const UserTextMarkdown = createUserTextMarkdown()
        ctx.slots.inject('conversation.user.text.node', () =>
          ctx.slots.register({
            name: 'conversation.user.text.node',
            key: 'text',
            // The slot renders the LOWEST priority entry for a key; the
            // shipped plain-text renderer sits at 100, so shadow it below.
            priority: -1,
            locale: NS,
          }, UserTextMarkdown),
        )

        // Live composer rendering.
        const renderer = createLiveRenderer(log)
        renderer.wireAttempt()
        document.addEventListener('focusin', renderer.onFocusIn, true)
        document.addEventListener('keydown', renderer.onKeyDown, true)
        document.addEventListener('paste', renderer.onPaste, true)
        // A composer can mount without ever receiving focus (restored session,
        // new session panel): poll for the editor instance and wire it.
        const poll = setInterval(renderer.wireAttempt, 500)
        ctx.effect(() => () => {
          clearInterval(poll)
          document.removeEventListener('focusin', renderer.onFocusIn, true)
          document.removeEventListener('keydown', renderer.onKeyDown, true)
          document.removeEventListener('paste', renderer.onPaste, true)
          renderer.dispose()
          const root = document.querySelector(COMPOSER_INPUT)
          if (root instanceof HTMLElement) {
            for (const el of root.querySelectorAll('[class*="dml-"]')) {
              if (el instanceof HTMLElement) stripClasses(el)
            }
          }
        }, 'dsh-markdown-live: live renderer')
```

</details>

#### 缺口

- 复杂编辑序列下的文本、selection和undo恒等性未知
  **影响**：若不成立会直接损坏用户草稿
  **进一步探讨**：生成1000条IME/粘贴/列表/围栏操作序列，对照最终文本、selection与undo栈

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 哪些人应观察、试用或拒绝采用 dsh-markdown-live？

**研究主题**：采用判断

#### 完整回答

经常写 Markdown 且能接受表格/图片限制的 DSH Desktop 用户可在非关键草稿试用；先复制带中英混排、列表、链接和代码围栏的固定样本，校验发送前后字节与撤销。依赖无障碍输入、超长文档或宿主版本频繁升级的人应先观察。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-23](https://github.com/9426Haruka/dsh-markdown-live/blob/1f47a60954fde04b71cf404e8e42124a5d07959e/README.md#L9-L23)

固定版本作者材料支持 Q09 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（15行）</summary>

```text
## 特性

- **输入框实时渲染**：打字/粘贴 Markdown 时语法立刻以真实样式呈现，无需发送。
- **语法标记自动淡出**：光标所在行保留淡显标记方便定位，其余行的 `#`、`*`、`~~`、`` ` ``、`[]()`、`- `、`>` 自动隐去，接近所见即所得。
- **块级样式**：`#`~`######` 标题、`>` 引用、无序/有序/任务列表（含缩进层级）、代码围栏（含语言名、围栏行自动收起）、`---` 分割线。
- **交互增强**：列表/引用 `Shift+Enter` 自动延续；`Backspace` 移除标记、退出空代码行；代码围栏自动补全；多行粘贴到列表/引用自动补前缀。
- **中文输入友好**：拼音组合阶段文字保持正常颜色；标记与正文的分隔空格是普通文本节点，光标停在其中。
- **发送内容不变**：所有渲染只作用于显示层（Lexical 文本格式位 + DOM class），提交文本仍是逐字节不变的 Markdown。
- **用户消息渲染**：覆盖宿主 `text` 渲染器，复用 DSH 自带 Markdown 渲染器；@ 提及 / 技能 chip / 消息操作按钮全部保留，普通换行也会保留。
- **无构建步骤**：全部逻辑在 `client.js` 单文件里，改完宿主热重载即可生效。

## 环境要求

- DSH 桌面版 **0.2.x**（web 平台的 client bundle）。
- 已启用 `@deepseek-ai/dsh-client-locale`、`@deepseek-ai/dsh-client-ui-conversation` 两个 client 插件（DSH 自带）。
```

</details>

#### 缺口

- 复杂编辑序列下的文本、selection和undo恒等性未知
  **影响**：若不成立会直接损坏用户草稿
  **进一步探讨**：生成1000条IME/粘贴/列表/围栏操作序列，对照最终文本、selection与undo栈

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
