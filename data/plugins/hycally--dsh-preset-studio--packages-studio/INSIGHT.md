# DSH Preset Studio

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[93d132d](https://github.com/HYcally/dsh-preset-studio/tree/93d132de6db1cd71fd5dd0b0056415101dda32c0/packages/studio)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/HYcally/dsh-preset-studio) [![npm 30d 262](https://img.shields.io/static/v1?label=npm+30d&message=262&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-preset-studio) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-preset-studio)
<!-- END META -->

> **功能**：在侧栏编辑本地预设文件、注入、文档、技能和工具接线，并管理预设安装。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 支持把五类条目及其消费者放入统一模型，减少“文件存在但无人消费”的解释落差。贡献是预设维护的组合与接线可见性，原生模型、技能发现和安装事务仍由DSH提供。

> **主要限制**：[Q03](#research-q03) 显示主要限制是写入边界仍为词法路径检查，安装与模板创建也没有本组件的跨文件回滚；它适合可信本地目录，不能据界面便利推出安全沙箱或任意平台可用。

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
  - [Q01 · 谁维护什么预设，面板比手改 YAML 多做成什么？](#detail-section-11)
  - [Q02 · 五类条目如何经路由和消费者成为实际预设能力？](#detail-section-12)
  - [Q03 · 路径检查与安装失败能否避免写错目录或半装状态？](#detail-section-13)
  - [Q04 · 启动、新对话、维护和退出由谁承担？](#detail-section-14)
  - [Q05 · 声明式接线图能否提前发现缺失消费者而减少无效配置？](#detail-section-15)
  - [Q06 · 哪些本地维护者值得试，如何识别停止条件？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：目标是经常维护本地 DSH Agent 预设的使用者，交付单位是一份可挂载、可理解接线状态的预设目录。原办法是直接修改 YAML、Markdown 和技能目录，再排查文件为何没有被宿主消费。工作室把注入、文档、技能、工具行和普通文件区分建模，给每类声明消费者；例如文档同时需要技能目录与 docs 写回入口。增量在于把“有文件”和“已接线”分开，而不只是提供文本编辑器。

这个模型不会替代 DSH 自己的预设、工具和技能服务。它通过创建与修改已有配置，借用原生消费者生效；随包示例技能是模板，不能当成新的业务技能数。对只偶尔改一段提示的人，编辑器与版本管理已可能足够；多类条目经常增删、需要解释接线的人更可能受益，但尚无同任务人工耗时证据。

以编辑器手改预设YAML与Markdown、再用DSH管理器挂载为比较基线；未运行同条件效率对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 预设文件编辑 | 管理YAML、Markdown等允许类型 | 可信根目录，编辑冲突返回409 |
| 条目消费者接线 | 补注入、文档和技能消费配置 | 依赖支持的YAML形状，复杂行内写法拒绝 |
| 模板创建 | 复制并替换新预设占位符 | 多步写入无整目录回滚，模板含Windows路径 |
| 预设安装卸载 | 调用DSH管理器管理link bundle | 需pluginManager，失败后核对实际状态 |
| 提示投递 | 将注入目录按顺序注册到会话 | 需预设挂载inject，watch失败会警告 |
| doc_update | 追加或替换已有文档正文 | 需预设挂载docs，非版本回滚或写前审批 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node≥22、DSH webServer | 面板host需要 | 注册本地API | 无法提供文件操作路由 |
| web客户端 slots/locale/theme | 界面需要 | 侧栏与主面板 | host可存在而界面不可见 |
| pluginManager | 安装/卸载时需要 | 管理link bundle | 明确报错；查询失败可能显示空列表 |
| 预设的原生消费者 | 运行预设时需要 | 技能、提示与工具生效 | 文件存在不等于可运行 |
| 可信且无链接跳转的本地根 | 受控试用前提 | 限制词法路径检查的风险 | 不用于不可信/多用户目录 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 使用者备份单一测试预设并指定根 | 文件变化可回滚、路径明确 |
| 加载 | 宿主挂载bundle与client | 面板和API均可定位 |
| 编辑接线 | 面板调用host修改文件/patch | 对照磁盘内容，冲突409停止覆盖 |
| 运行 | 使用者安装并开新会话核对 | 实际能力出现而非只看接线提示 |
| 恢复退出 | 宿主卸载预设、使用者恢复备份 | bundle状态明确，不盲目重试 |

启动需要 Node≥22、DSH webServer以及客户端 slots/locale/theme 等宿主服务；普通编辑和安装不是同一个依赖层级，安装另需 pluginManager，预设运行另需其声明的原生消费者。使用者必须选择根目录、保留备份，并理解修改patch的挂载时机。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本机存储与既有DSH，金额未知 | 配置可信根、备份、确认预设消费者 | 未测配置时间与跨平台兼容 |
| 持续使用 | 本地文件读写及预设运行资源 | 校对变更，必要时开新对话 | 文本热读不等于patch热生效 |
| 失败恢复 | 备份空间与可能的重装资源 | 核对宿主安装状态和半建模板目录 | 组件无跨文件自动回滚 |
| 退出 | 保留用户文件 | 卸预设后停用工作室，核对link状态 | 移除面板不删除本地预设资料 |

金额与人工时间未取得，不把本地工具称为无成本。doc_update会持久化正文，退出也不能自动撤销模型的历史写入。模板和工具列表不覆盖任意第三方预设，复杂YAML需要手工维护。

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 接线可解释性 | 消费者表和接线步骤可追溯 | 是否减少实际维护错误/耗时 |
| 文档回写 | doc_update保留frontmatter并改正文 | 多人并发与业务内容正确性 |
| 热更新 | 正文重读与目录监听 | watcher失败及不同平台行为 |

> **思考**：[Q03](#research-q03) 显示主要限制是写入边界仍为词法路径检查，安装与模板创建也没有本组件的跨文件回滚；它适合可信本地目录，不能据界面便利推出安全沙箱或任意平台可用。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 支持把五类条目及其消费者放入统一模型，减少“文件存在但无人消费”的解释落差。贡献是预设维护的组合与接线可见性，原生模型、技能发现和安装事务仍由DSH提供。

[Q02](#research-q02) 的单一消费者模型及按行修改避免无关YAML重序列化，值得配置工具借鉴；[Q03](#research-q03) 表明移植前还需真实路径边界、跨文件计划和并发控制，不把rename称为完整事务。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 显示主要限制是写入边界仍为词法路径检查，安装与模板创建也没有本组件的跨文件回滚；它适合可信本地目录，不能据界面便利推出安全沙箱或任意平台可用。

<a id="detail-section-6"></a>

### 1.5 使用建议

先用可信、无符号链接的单一预设备份目录，核对接线、磁盘内容、新会话行为和卸载状态；任一不一致就停止写入并用宿主管理器与编辑器恢复。优先作者声明实测平台，其他平台先检查模板目录分隔符。依据见 [Q06](#research-q06)。

这个模型不会替代 DSH 自己的预设、工具和技能服务。它通过创建与修改已有配置，借用原生消费者生效；随包示例技能是模板，不能当成新的业务技能数。对只偶尔改一段提示的人，编辑器与版本管理已可能足够；多类条目经常增删、需要解释接线的人更可能受益，但尚无同任务人工耗时证据。

最小实验应固定一个正常预设、一个缺skill-filesystem预设和一个复杂YAML预设，对照现有按钮与预览方案，比较误写、漏接线、恢复人工量及用户能否预测结果。若预览继续把静态存在误报为可加载，或为维护计划引入第二套易漂移规则，应停止该方向。另一项必要工程前置是按真实路径约束文件边界；这可以单独验证，不把修复计划当现有安全保证。 具体依据见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持条目建模、接线和文件/工具入口；真实宿主效果与写前计划假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、packages/studio/package.json、packages/studio/cordis.patch.yml、packages/studio/index.js、packages/studio/core.js、packages/studio/client.js、packages/studio/inject.js、packages/studio/docs.js、packages/studio/template/cordis.patch.yml 及固定范围 inventory；组件：packages/studio。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：已检查packages/studio的host/client/core/inject/docs及包内模板；根README为作者说明，不把归档代码能力算作当前组件。
- 下一步：已检查源码；未执行插件、测试、安装或宿主验收。符号链接问题为源码边界判断，未运行利用案例。

**分析版本**

- **仓库**：[HYcally/dsh-preset-studio](https://github.com/HYcally/dsh-preset-studio)
- **版本号**：2.1.0（[固定提交 93d132d](https://github.com/HYcally/dsh-preset-studio/tree/93d132de6db1cd71fd5dd0b0056415101dda32c0)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

值得验证的方向是把当前消费者清单扩成可预览的接线变更计划，先显示“将追加哪些插件行、哪些文件会变化、哪些服务仍缺失”，再允许写入。推导来自 core.TYPES把内容与消费者统一登记，以及wireType已经能返回实际变更步骤。相对现有按钮，它增加的是写前可审阅性和解释能力，不是宣称能静态证明宿主运行成功。

最小实验应固定一个正常预设、一个缺skill-filesystem预设和一个复杂YAML预设，对照现有按钮与预览方案，比较误写、漏接线、恢复人工量及用户能否预测结果。若预览继续把静态存在误报为可加载，或为维护计划引入第二套易漂移规则，应停止该方向。另一项必要工程前置是按真实路径约束文件边界；这可以单独验证，不把修复计划当现有安全保证。 具体依据见 [Q05](#research-q05)。

已检查源码；未执行插件、测试、安装或宿主验收。符号链接问题为源码边界判断，未运行利用案例。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 6 | 2950 | 2543 | 252 | — |
| .md | example | 1 | 19 | — | — | 128 |
| .md | source | 7 | 147 | — | — | 1384 |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/HYcally/dsh-preset-studio/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/HYcally/dsh-preset-studio/issues?q=is%3Aissue+created%3A2026-10-24T02%3A28%3A08.405Z..2026-11-23T02%3A28%3A08.405Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/HYcally/dsh-preset-studio/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-24T02%3A28%3A08.405Z..2026-11-23T02%3A28%3A08.405Z)



统计日期：2026-11-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：预设工作室如何降低 YAML 接线负担，其文件与安装边界是否足以支持本地受控试用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁维护什么预设，面板比手改 YAML 多做成什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是经常维护本地 DSH Agent 预设的使用者，交付单位是一份可挂载、可理解接线状态的预设目录。原办法是直接修改 YAML、Markdown 和技能目录，再排查文件为何没有被宿主消费。工作室把注入、文档、技能、工具行和普通文件区分建模，给每类声明消费者；例如文档同时需要技能目录与 docs 写回入口。增量在于把“有文件”和“已接线”分开，而不只是提供文本编辑器。

这个模型不会替代 DSH 自己的预设、工具和技能服务。它通过创建与修改已有配置，借用原生消费者生效；随包示例技能是模板，不能当成新的业务技能数。对只偶尔改一段提示的人，编辑器与版本管理已可能足够；多类条目经常增删、需要解释接线的人更可能受益，但尚无同任务人工耗时证据。

#### 证据与依据

**依据 1 · 源码核查**：[packages/studio/core.js:296-358](https://github.com/HYcally/dsh-preset-studio/blob/93d132de6db1cd71fd5dd0b0056415101dda32c0/packages/studio/core.js#L296-L358)

三类内容分别声明消费者，文档需要两个消费者。

<details>
<summary>查看原文（63行）</summary>

```text
export const TYPES = [
  {
    id: 'inject',
    label: '注入',
    dir: '注入',
    shape: 'flat',
    orderBy: 'order',
    consumers: ['inject'],
    toggleField: 'enabled',
    hint: '按序号拼进系统提示词或运行上下文；关掉的不投递。',
    create: {
      fields: [
        { key: 'name', label: '名字', required: true, hint: '随便写，中文也行；文件名会用它。' },
        {
          key: 'role',
          label: '落点',
          kind: 'select',
          default: 'system',
          hint: '系统提示词 = 常驻，规则放这；对话上下文 = 贴在当前轮后面；助手块没有独立通道，等同对话上下文。',
          options: [
            { value: 'system', label: '系统提示词（常驻，最稳）' },
            { value: 'user', label: '对话上下文（贴在当前轮后面）' },
            { value: 'assistant', label: '助手块（无独立通道，等同对话上下文）' },
          ],
        },
        {
          key: 'order',
          label: '序号',
          kind: 'number',
          default: 10,
          hint: '按段位：10 人设 / 20 风格 / 30 纪律 / 50 字数 / 70 模式 / 90 补丁。数字留空位，以后插新的不用重排。',
        },
      ],
      body: '在这里写这条注入的内容。\n',
    },
  },
  {
    id: 'doc',
    label: '文档',
    dir: '文档',
    shape: 'flat',
    orderBy: 'name',
    consumers: ['skill-dir', 'docs'],
    toggleField: 'disable-model-invocation',
    hint: '模型在技能目录里看到一句话，需要时才翻开全文；接上写回工具后它能自己改。',
    create: {
      slug: true,
      fields: [
        { key: 'name', label: '文档名（小写英文）', required: true, slug: true },
        { key: 'description', label: '什么时候想起', required: true },
      ],
      body: '在这里写这篇文档的内容。\n',
    },
  },
  {
    id: 'skill',
    label: '技能',
    dir: '技能',
    shape: 'folder',
    orderBy: 'name',
    consumers: ['skill-dir'],
    toggleField: 'disable-model-invocation',
    hint: '模型在做某类活之前主动打开的步骤说明。',
```

</details>

**依据 2 · 源码核查**：[packages/studio/core.js:368-388](https://github.com/HYcally/dsh-preset-studio/blob/93d132de6db1cd71fd5dd0b0056415101dda32c0/packages/studio/core.js#L368-L388)

工具行与普通文件不伪装成独立新能力。

<details>
<summary>查看原文（21行）</summary>

```text
  {
    id: 'tool',
    label: '工具',
    dir: null,
    shape: 'rows',
    orderBy: 'id',
    consumers: [],
    toggleField: 'disabled',
    hint: '写在 cordis.patch.yml 里的插件行；关掉的不会加载。',
    create: { catalog: true },
  },
  {
    id: 'files',
    label: '文件',
    dir: null,
    shape: 'files',
    orderBy: 'preset',
    consumers: [],
    toggleField: null,
    hint: '预设自己的两个配置文件，改完由 DSH 在下次挂载时读取。',
    create: null,
```

</details>

#### 缺口

- 缺少维护者同任务对照与真实操作负担记录。
  **影响**：不能把接线提示直接换算为节时或采用必要性。
  **进一步探讨**：比较手改和面板维护同一预设，记录漏接线、错误改动及总人工时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 五类条目如何经路由和消费者成为实际预设能力？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

package 同时导出 host、client、inject、docs，bundle补丁只常驻挂载面板host；客户端注册侧栏和主面板，按钮通过 HTTP API 读取预设模型、修改文件或补接线。wireType 读取消费者清单，向已有插件列表追加 inject/docs 行，或补 customSkillDirs；缺少所需结构、复杂行内写法会明确拒绝，而不是猜测改写。

真正生效在预设挂载后。inject 为目录条目注册 systemPrompt.section/context，正文通过函数每次重读，结构变化由 fs.watch 重挂载；watch失败只记录警告，不保证结构热更新。docs 注册一个 doc_update 工具，按目录内文档名匹配，校验模式和非空内容，保留frontmatter后追加或替换正文，原子写文件并返回路径与行数。技能发现和预设本身仍由原生服务提供。

因此“写了文件”“补了配置”“已安装”“当前对话已采用”是不同阶段。面板不会自动证明每个预设的业务行为正确；文档替换也允许模型覆盖旧正文，不能等同版本回滚。

#### 证据与依据

**依据 1 · 源码核查**：[packages/studio/package.json:21-54](https://github.com/HYcally/dsh-preset-studio/blob/93d132de6db1cd71fd5dd0b0056415101dda32c0/packages/studio/package.json#L21-L54)

导出、bundle和客户端声明。

<details>
<summary>查看原文（34行）</summary>

```text
  },
  "exports": {
    ".": "./index.js",
    "./client": "./client.js",
    "./inject": "./inject.js",
    "./docs": "./docs.js",
    "./locale/*.json": "./locale/*.json",
    "./icon": "./icon.svg"
  },
  "files": [
    "index.js",
    "core.js",
    "frontmatter.js",
    "client.js",
    "inject.js",
    "docs.js",
    "cordis.patch.yml",
    "template/**",
    "locale/*.json",
    "icon.svg"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "immediately": true,
      "inject": [
        "@deepseek-ai/dsh-client-locale"
      ]
    }
  }
}
```

</details>

**依据 2 · 源码核查**：[packages/studio/client.js:978-1016](https://github.com/HYcally/dsh-preset-studio/blob/93d132de6db1cd71fd5dd0b0056415101dda32c0/packages/studio/client.js#L978-L1016)

真实侧栏与主面板注册。

<details>
<summary>查看原文（39行）</summary>

```text
    const PANEL_ORDER = 40

    return {
      inject: ['slots', 'locale', 'theme'],
      apply(ctx) {
        installStyles()
        try {
          ctx.effect(() => ctx.locale.register(NS, { zh: DICT.zh, en: DICT.en }), 'studio: dictionaries')
        } catch {}
        try {
          const bound = ctx.locale.bind(NS)
          if (typeof bound === 'function') translate = bound
        } catch {}

        const syncTheme = () => {
          try {
            const snapshot = ctx.theme.getTheme()
            themeStore.set(snapshot && snapshot.active ? snapshot.active.colorScheme : 'dark')
          } catch {
            themeStore.set('dark')
          }
        }
        syncTheme()
        try {
          ctx.on('theme/change', syncTheme)
        } catch {}

        const disposers = []
        try {
          disposers.push(
            ctx.slots.inject('sidebar.panellist', () =>
              ctx.slots.register({ name: 'sidebar.panellist', id: PANEL_ID, order: PANEL_ORDER, label: () => t('panel.label') }, StudioIcon),
            ),
          )
          disposers.push(ctx.slots.inject('main', () => ctx.slots.register({ name: 'main', key: PANEL_ID }, StudioPage)))
        } catch (failure) {
          console.warn('[studio] panel registration failed:', failure)
        }
        ctx.effect(() => () => {
```

</details>

**依据 3 · 源码核查**：[packages/studio/core.js:741-776](https://github.com/HYcally/dsh-preset-studio/blob/93d132de6db1cd71fd5dd0b0056415101dda32c0/packages/studio/core.js#L741-L776)

消费者接线、拒绝条件与落盘。

<details>
<summary>查看原文（36行）</summary>

```text
export function wireType(preset, typeId) {
  const type = TYPES.find((item) => item.id === typeId)
  if (!type || type.consumers.length === 0) throw new Error('这种条目不需要接线')
  const patchPath = path.join(preset.dir, 'cordis.patch.yml')
  if (!fs.existsSync(patchPath)) throw new Error('这个预设没有 cordis.patch.yml')
  let text = fs.readFileSync(patchPath, 'utf8')
  if (text.trim() === '') throw new Error('这个预设的 cordis.patch.yml 还是空的。先照「示例预设」抄一份过来，再接。')
  const dir = path.join(preset.dir, type.dir)
  const rows = parsePatchRows(text)
  const done = []
  for (const id of type.consumers) {
    if (id === 'skill-dir') {
      const result = wireSkillDir(text, dir)
      if (!result.found) throw new Error('这个预设有 cordis.patch.yml，但里面没有 skill-filesystem 那一行。照「示例预设」抄那三行过来，再接。')
      if (result.inline) throw new Error('customSkillDirs 现在是行内写法，面板改不了，请手动改成多行列表')
      if (result.changed) {
        text = result.text
        done.push('技能目录')
      }
      continue
    }
    const row = consumerRow(id)
    if (rows.some((item) => item.name === row.name && !item.groupOnly)) continue
    const result = appendPluginsBlock(text, [
      [0, '- id: ' + row.id],
      [1, "name: '" + row.name + "'"],
      [1, 'config:'],
      [2, 'dir: ' + yamlString(dir)],
    ])
    if (!result.found) throw new Error('这个预设的 cordis.patch.yml 里找不到 plugins: 列表。照「示例预设」抄一份再试。')
    text = result.text
    done.push(CONSUMER_DEFS[id].label)
  }
  if (done.length > 0) writeAtomic(patchPath, text)
  fs.mkdirSync(dir, { recursive: true })
  return { changed: done.length > 0, steps: done, patchPath }
```

</details>

**依据 4 · 源码核查**：[packages/studio/inject.js:129-150](https://github.com/HYcally/dsh-preset-studio/blob/93d132de6db1cd71fd5dd0b0056415101dda32c0/packages/studio/inject.js#L129-L150)

提示贡献正文动态读取。

<details>
<summary>查看原文（22行）</summary>

```text
    const mount = () => {
      unmount()
      let sections = 0
      let contexts = 0
      for (const entry of readEntries(dir)) {
        if (!entry.enabled) continue
        const system = entry.role === 'system'
        const contribution = {
          name: 'custom-inject:' + entry.name,
          order: (system ? SECTION_BASE : CONTEXT_BASE) + entry.order,
          // Re-read on every assembly: editing the file is the normal case, and
          // a frozen body would silently contradict what the panel shows.
          text: () => bodyOf(entry.file),
          interpolate: false,
        }
        try {
          const handle = system ? ctx.systemPrompt.section(contribution) : ctx.systemPrompt.context(contribution)
          handles.push(handle)
          if (system) sections += 1
          else contexts += 1
        } catch (error) {
          ctx.logger?.warn?.('[studio-inject] ' + entry.file + ': ' + String(error?.message ?? error))
```

</details>

**依据 5 · 源码核查**：[packages/studio/inject.js:176-198](https://github.com/HYcally/dsh-preset-studio/blob/93d132de6db1cd71fd5dd0b0056415101dda32c0/packages/studio/inject.js#L176-L198)

结构监听与失败处理。

<details>
<summary>查看原文（23行）</summary>

```text
    try {
      watcher = fs.watch(dir, { persistent: false }, () => {
        if (dead) return
        if (timer !== null) clearTimeout(timer)
        timer = setTimeout(() => {
          timer = null
          if (dead) return
          try {
            mount()
          } catch (error) {
            ctx.logger?.warn?.('[studio-inject] remount failed: ' + String(error?.message ?? error))
          }
        }, WATCH_DEBOUNCE_MS)
      })
      if (typeof watcher.unref === 'function') watcher.unref()
    } catch (error) {
      ctx.logger?.warn?.('[studio-inject] cannot watch ' + dir + ': ' + String(error?.message ?? error))
    }

    if (typeof ctx.effect === 'function') ctx.effect(() => close, 'custom-injector.watch()')
    else if (typeof ctx.on === 'function') ctx.on('dispose', close)
  } catch (error) {
    ctx.logger?.warn?.('[studio-inject] failed: ' + String(error?.message ?? error))
```

</details>

**依据 6 · 源码核查**：[packages/studio/docs.js:116-169](https://github.com/HYcally/dsh-preset-studio/blob/93d132de6db1cd71fd5dd0b0056415101dda32c0/packages/studio/docs.js#L116-L169)

工具调用从参数到文件写入及回执。

<details>
<summary>查看原文（54行）</summary>

```text
export function apply(ctx, config) {
  const dir = typeof config?.dir === 'string' ? path.resolve(config.dir) : ''
  if (dir === '') {
    ctx.logger?.warn?.('[studio-docs] config.dir is missing; doc_update is not registered')
    return
  }
  ctx.tools.register({
    name: 'doc_update',
    description: DESCRIPTION,
    parameters: PARAMETERS,
    output: {
      schema: OUTPUT,
      render: (_args, value) => [
        {
          type: 'text',
          text:
            'Wrote ' + value.chars + ' characters into `' + value.doc + '` (' + value.mode + '). ' +
            'The document now has ' + value.lines + ' lines. It keeps its place in the catalog.',
        },
      ],
    },
    execute(args) {
      const doc = typeof args?.doc === 'string' ? args.doc.trim() : ''
      const mode = typeof args?.mode === 'string' ? args.mode.trim() : ''
      const content = typeof args?.content === 'string' ? args.content : ''
      if (doc === '') throw new Error('doc is required: pass the document name from the skill catalog')
      if (!MODES.includes(mode)) throw new Error('mode must be one of: ' + MODES.join(', '))
      if (content.trim() === '') throw new Error('content is empty: nothing to write')
      const docs = listDocs(dir)
      if (docs.length === 0) throw new Error('this preset has no documents under ' + dir)
      const hit =
        docs.find((entry) => entry.name === doc) ||
        docs.find((entry) => entry.name.toLowerCase() === doc.toLowerCase()) ||
        docs.find((entry) => entry.stem.toLowerCase() === doc.toLowerCase())
      if (!hit) {
        throw new Error(
          'no document named "' + doc + '". Available: ' + docs.map((entry) => entry.name).join(', '),
        )
      }
      if (!hit.split) {
        throw new Error('document "' + hit.name + '" has no frontmatter, so the model cannot see it; fix it in the panel first')
      }
      const eol = hit.split.eol || '\n'
      const body = hit.split.rest || ''
      const next = mode === 'append' ? (body.trim() === '' ? content : body.replace(/\s+$/, '') + eol + eol + content) : content
      const text = '---' + eol + hit.split.head + eol + '---' + eol + next
      writeAtomic(hit.file, text)
      return {
        doc: hit.name,
        mode,
        path: hit.file,
        chars: content.length,
        lines: text.split(/\r?\n/).length,
      }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 路径检查与安装失败能否避免写错目录或半装状态？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

路由先校验回环地址、Origin 与 HTTP方法，拒绝跨来源浏览器请求；文件读写校验配置根和允许扩展名，编辑时还会用 baseMtime 与内容判断明显的磁盘并发变化，冲突返回409。这些机制有助于本地单人使用，但不是强文件系统沙箱。core.isInside 只比较 path.resolve 后的相对路径，assertAllowed不做realpath/lstat；位于配置根内的符号链接或父目录链接可把读取等文件操作引向根外。这里确认的是路径解析的边界，未运行利用案例，也不推断所有写入操作都能越界。

单文件写入是临时文件+rename，不能推广为跨多个文件的事务。模板创建先cpSync再逐个替换，出错后未见整目录回滚；预设安装委托 pluginManager.installBundle，检查 application=failed 后返回错误，却不在本组件执行补偿恢复。bundleList异常回空列表，还可能使“未安装”与“查询失败”混淆。故安装失败应回到宿主管理器核对实际状态，不能直接再次点击当成幂等重试。

包内模板将 __DIR__ 与 Windows 反斜线拼接，结合作者只在Windows实测的声明，跨平台不能仅凭代码大量使用path.join就判断成立。可信目录、备份和单预设验证是采用的前提。

#### 证据与依据

**依据 1 · 源码核查**：[packages/studio/index.js:147-160](https://github.com/HYcally/dsh-preset-studio/blob/93d132de6db1cd71fd5dd0b0056415101dda32c0/packages/studio/index.js#L147-L160)

本地请求保护。

<details>
<summary>查看原文（14行）</summary>

```text
function guard(req, res, method) {
  if (!isLoopback(req)) {
    sendJson(res, 403, { error: 'forbidden: loopback-only' })
    return false
  }
  if (!isSameOrigin(req)) {
    sendJson(res, 403, { error: 'forbidden: cross-origin' })
    return false
  }
  if (req.method !== method) {
    sendJson(res, 405, { error: 'method not allowed: ' + req.method })
    return false
  }
  return true
```

</details>

**依据 2 · 源码核查**：[packages/studio/core.js:33-49](https://github.com/HYcally/dsh-preset-studio/blob/93d132de6db1cd71fd5dd0b0056415101dda32c0/packages/studio/core.js#L33-L49)

词法路径边界与单文件原子写入。

<details>
<summary>查看原文（17行）</summary>

```text
export function isInside(root, target) {
  const rel = path.relative(path.resolve(root), path.resolve(target))
  return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel))
}

/** Compare two directory spellings the way Windows does. */
export function samePath(left, right) {
  const norm = (value) => String(value).replace(/\\/g, '/').replace(/\/+$/, '').toLowerCase()
  return norm(left) === norm(right)
}

/** Write one file atomically, so a failed write never truncates a preset file. */
export function writeAtomic(target, content) {
  const tmp = target + '.tmp-' + process.pid + '-' + Date.now()
  fs.writeFileSync(tmp, content, 'utf8')
  fs.renameSync(tmp, target)
}
```

</details>

**依据 3 · 源码核查**：[packages/studio/core.js:890-895](https://github.com/HYcally/dsh-preset-studio/blob/93d132de6db1cd71fd5dd0b0056415101dda32c0/packages/studio/core.js#L890-L895)

允许路径不解析真实链接。

```text
export function assertAllowed(roots, input) {
  if (typeof input !== 'string' || input.trim() === '') throw new Error('path is required')
  const abs = path.resolve(input)
  if (!roots.some((root) => isInside(root, abs))) throw new Error('path is outside the configured roots')
  if (!ALLOWED_EXT.has(path.extname(abs).toLowerCase())) throw new Error('unsupported file type: ' + path.extname(abs))
  return abs
```

**依据 4 · 源码核查**：[packages/studio/index.js:355-372](https://github.com/HYcally/dsh-preset-studio/blob/93d132de6db1cd71fd5dd0b0056415101dda32c0/packages/studio/index.js#L355-L372)

编辑冲突检查。

<details>
<summary>查看原文（18行）</summary>

```text
      path: ROUTES.write,
      handler: async (req, res) => {
        if (!guard(req, res, 'POST')) return
        try {
          const body = await readJsonBody(req)
          const target = assertAllowed(roots, body?.path)
          const content = typeof body?.content === 'string' ? body.content : ''
          const baseMtime = typeof body?.baseMtime === 'number' ? body.baseMtime : null
          const before = fs.readFileSync(target, 'utf8')
          const stat = fs.statSync(target)
          if (baseMtime !== null && Math.abs(stat.mtimeMs - baseMtime) > 1 && before !== content) {
            sendJson(res, 409, { error: '文件在磁盘上已经变过了', content: before, mtime: stat.mtimeMs })
            return
          }
          writeAtomic(target, content)
          sendJson(res, 200, { path: target, mtime: fs.statSync(target).mtimeMs })
        } catch (error) {
          sendJson(res, 400, { error: String(error?.message ?? error) })
```

</details>

**依据 5 · 源码核查**：[packages/studio/index.js:475-519](https://github.com/HYcally/dsh-preset-studio/blob/93d132de6db1cd71fd5dd0b0056415101dda32c0/packages/studio/index.js#L475-L519)

安装卸载委托、失败回执和组件补偿边界。

<details>
<summary>查看原文（45行）</summary>

```text
    {
      kind: 'exact',
      path: ROUTES.install,
      handler: async (req, res) => {
        if (!guard(req, res, 'POST')) return
        try {
          const body = await readJsonBody(req)
          const presetDir = resolvePreset(body?.preset)
          const manifest = readPresetManifest(presetDir)
          if (!manifest.ok) throw new Error(manifest.reason)
          const manager = ctx.get('pluginManager')
          if (!manager) throw new Error('插件管理器不在，装不了')
          const existing = await bundleFor(ctx, presetDir)
          if (existing) throw new Error('这个预设已经装过了：' + existing.name)
          const result = await manager.installBundle('link:' + presetDir, {})
          if (result && result.application === 'failed') throw new Error(describeFailure(result))
          sendJson(res, 200, {
            bundle: result && result.bundle ? result.bundle : manifest.name,
            changed: !!(result && result.changed),
          })
        } catch (error) {
          sendJson(res, 400, { error: humanize(error) })
        }
      },
    },
    {
      kind: 'exact',
      path: ROUTES.uninstall,
      handler: async (req, res) => {
        if (!guard(req, res, 'POST')) return
        try {
          const body = await readJsonBody(req)
          const presetDir = resolvePreset(body?.preset)
          const bundle = await bundleFor(ctx, presetDir)
          if (!bundle) throw new Error('这个预设没有装进 DSH')
          if (!bundle.removable) throw new Error('这个包不能从面板里卸载：' + bundle.name)
          const manager = ctx.get('pluginManager')
          if (!manager) throw new Error('插件管理器不在，卸不了')
          const result = await manager.removeBundle(bundle.name)
          if (result && result.application === 'failed') throw new Error(describeFailure(result))
          const profileDir = ctx.get('profileContext')?.dir ?? ''
          const cleaned = dropStaleLink(profileDir, bundle.name, presetDir)
          sendJson(res, 200, { bundle: bundle.name, changed: !!(result && result.changed), cleaned })
        } catch (error) {
          sendJson(res, 400, { error: humanize(error) })
```

</details>

**依据 6 · 源码核查**：[packages/studio/core.js:944-978](https://github.com/HYcally/dsh-preset-studio/blob/93d132de6db1cd71fd5dd0b0056415101dda32c0/packages/studio/core.js#L944-L978)

创建模板是多步写入。

<details>
<summary>查看原文（35行）</summary>

```text
export function createPresetFromTemplate(config, root, values) {
  const info = readTemplateInfo(config)
  if (!info.exists) throw new Error(info.reason)
  const title = String(values?.title ?? '').trim()
  const id = String(values?.id ?? '').trim()
  if (title === '') throw new Error('显示名不能为空')
  if (!/^[a-z0-9][a-z0-9-]*$/.test(id)) throw new Error('预设 id 只能用小写字母、数字和连字符，例如 my-preset')
  const dir = path.join(root, safeFileName(title))
  if (!isInside(root, dir)) throw new Error('path is outside the configured roots')
  if (fs.existsSync(dir)) throw new Error('这个名字的目录已经存在：' + path.basename(dir))
  fs.mkdirSync(root, { recursive: true })
  fs.cpSync(info.dir, dir, { recursive: true })
  // The template's own guide explains the template; it must not ship inside a
  // preset. `说明.md` (without the prefix) is the per-preset README and stays.
  const guide = path.join(dir, '模板说明.md')
  if (fs.existsSync(guide)) fs.rmSync(guide)
  const replacements = [
    ['__PACKAGE__', 'dsh-preset-' + id],
    ['__PRESET_ID__', id],
    ['__TITLE__', title],
    ['__DIR__', dir],
    ['__PERSONA__', '你是「' + title + '」。完整的工作规则在系统提示词后面的各条注入里，逐条执行。'],
  ]
  let touched = 0
  for (const file of walkFiles(dir)) {
    if (!PLACEHOLDER_EXT.has(path.extname(file).toLowerCase())) continue
    const text = fs.readFileSync(file, 'utf8')
    let next = text
    for (const [key, value] of replacements) next = next.split(key).join(value)
    if (next !== text) {
      fs.writeFileSync(file, next, 'utf8')
      touched += 1
    }
  }
  return { dir, id, title, files: touched }
```

</details>

**依据 7 · 源码核查**：[packages/studio/template/cordis.patch.yml:18-35](https://github.com/HYcally/dsh-preset-studio/blob/93d132de6db1cd71fd5dd0b0056415101dda32c0/packages/studio/template/cordis.patch.yml#L18-L35)

生成模板使用反斜线连接目录。

<details>
<summary>查看原文（18行）</summary>

```text
              prefix: '__PERSONA__'
          - id: skill-filesystem
            name: '@deepseek-ai/dsh-skill-filesystem'
            config:
              includeDefaultRoots: false
              customSkillDirs:
                - '__DIR__\技能'
                - '__DIR__\文档'
          - id: tool-skill
            name: '@deepseek-ai/dsh-tool-skill'
          - id: studio-docs
            name: 'dsh-preset-studio/docs'
            config:
              dir: '__DIR__\文档'
          - id: studio-inject
            name: 'dsh-preset-studio/inject'
            config:
              dir: '__DIR__\注入'
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启动、新对话、维护和退出由谁承担？

**研究主题**：效果与总成本、依赖、兼容与流程

#### 完整回答

启动需要 Node≥22、DSH webServer以及客户端 slots/locale/theme 等宿主服务；普通编辑和安装不是同一个依赖层级，安装另需 pluginManager，预设运行另需其声明的原生消费者。使用者必须选择根目录、保留备份，并理解修改patch的挂载时机。

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本机存储与既有DSH，金额未知 | 配置可信根、备份、确认预设消费者 | 未测配置时间与跨平台兼容 |
| 持续使用 | 本地文件读写及预设运行资源 | 校对变更，必要时开新对话 | 文本热读不等于patch热生效 |
| 失败恢复 | 备份空间与可能的重装资源 | 核对宿主安装状态和半建模板目录 | 组件无跨文件自动回滚 |
| 退出 | 保留用户文件 | 卸预设后停用工作室，核对link状态 | 移除面板不删除本地预设资料 |

金额与人工时间未取得，不把本地工具称为无成本。doc_update会持久化正文，退出也不能自动撤销模型的历史写入。模板和工具列表不覆盖任意第三方预设，复杂YAML需要手工维护。

#### 证据与依据

**依据 1 · 源码核查**：[packages/studio/package.json:18-29](https://github.com/HYcally/dsh-preset-studio/blob/93d132de6db1cd71fd5dd0b0056415101dda32c0/packages/studio/package.json#L18-L29)

Node与导出条件。

<details>
<summary>查看原文（12行）</summary>

```text
  },
  "engines": {
    "node": ">=22"
  },
  "exports": {
    ".": "./index.js",
    "./client": "./client.js",
    "./inject": "./inject.js",
    "./docs": "./docs.js",
    "./locale/*.json": "./locale/*.json",
    "./icon": "./icon.svg"
  },
```

</details>

**依据 2 · 源码核查**：[packages/studio/index.js:201-217](https://github.com/HYcally/dsh-preset-studio/blob/93d132de6db1cd71fd5dd0b0056415101dda32c0/packages/studio/index.js#L201-L217)

安装查询服务缺失或失败回空。

<details>
<summary>查看原文（17行）</summary>

```text
/** The bundles the plugin manager knows about, or [] when that service is absent. */
async function bundleList(ctx) {
  try {
    const manager = ctx.get('pluginManager')
    if (!manager) return []
    const list = await manager.listBundles()
    const entries = Array.isArray(list) ? list : list && Array.isArray(list.entries) ? list.entries : []
    return entries.map((item) => ({
      name: String(item.name ?? ''),
      source: typeof item.source === 'string' ? item.source : '',
      installed: item.installed === true,
      enabled: item.enabled === true,
      removable: item.removable === true,
    }))
  } catch {
    return []
  }
```

</details>

**依据 3 · 源码核查**：[packages/studio/index.js:475-519](https://github.com/HYcally/dsh-preset-studio/blob/93d132de6db1cd71fd5dd0b0056415101dda32c0/packages/studio/index.js#L475-L519)

安装/卸载依赖宿主管理器。

<details>
<summary>查看原文（45行）</summary>

```text
    {
      kind: 'exact',
      path: ROUTES.install,
      handler: async (req, res) => {
        if (!guard(req, res, 'POST')) return
        try {
          const body = await readJsonBody(req)
          const presetDir = resolvePreset(body?.preset)
          const manifest = readPresetManifest(presetDir)
          if (!manifest.ok) throw new Error(manifest.reason)
          const manager = ctx.get('pluginManager')
          if (!manager) throw new Error('插件管理器不在，装不了')
          const existing = await bundleFor(ctx, presetDir)
          if (existing) throw new Error('这个预设已经装过了：' + existing.name)
          const result = await manager.installBundle('link:' + presetDir, {})
          if (result && result.application === 'failed') throw new Error(describeFailure(result))
          sendJson(res, 200, {
            bundle: result && result.bundle ? result.bundle : manifest.name,
            changed: !!(result && result.changed),
          })
        } catch (error) {
          sendJson(res, 400, { error: humanize(error) })
        }
      },
    },
    {
      kind: 'exact',
      path: ROUTES.uninstall,
      handler: async (req, res) => {
        if (!guard(req, res, 'POST')) return
        try {
          const body = await readJsonBody(req)
          const presetDir = resolvePreset(body?.preset)
          const bundle = await bundleFor(ctx, presetDir)
          if (!bundle) throw new Error('这个预设没有装进 DSH')
          if (!bundle.removable) throw new Error('这个包不能从面板里卸载：' + bundle.name)
          const manager = ctx.get('pluginManager')
          if (!manager) throw new Error('插件管理器不在，卸不了')
          const result = await manager.removeBundle(bundle.name)
          if (result && result.application === 'failed') throw new Error(describeFailure(result))
          const profileDir = ctx.get('profileContext')?.dir ?? ''
          const cleaned = dropStaleLink(profileDir, bundle.name, presetDir)
          sendJson(res, 200, { bundle: bundle.name, changed: !!(result && result.changed), cleaned })
        } catch (error) {
          sendJson(res, 400, { error: humanize(error) })
```

</details>

**依据 4 · 源码核查**：[packages/studio/docs.js:158-168](https://github.com/HYcally/dsh-preset-studio/blob/93d132de6db1cd71fd5dd0b0056415101dda32c0/packages/studio/docs.js#L158-L168)

历史正文更新是实际持久化。

<details>
<summary>查看原文（11行）</summary>

```text
      const eol = hit.split.eol || '\n'
      const body = hit.split.rest || ''
      const next = mode === 'append' ? (body.trim() === '' ? content : body.replace(/\s+$/, '') + eol + eol + content) : content
      const text = '---' + eol + hit.split.head + eol + '---' + eol + next
      writeAtomic(hit.file, text)
      return {
        doc: hit.name,
        mode,
        path: hit.file,
        chars: content.length,
        lines: text.split(/\r?\n/).length,
```

</details>

#### 缺口

- 没有首次配置、连续维护和失败恢复的实测投入。
  **影响**：不能判断面板是否降低端到端维护成本。
  **进一步探讨**：用同一预设记录总操作时间、异常处置和最后有效状态，再与编辑器基线比较。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 声明式接线图能否提前发现缺失消费者而减少无效配置？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

值得验证的方向是把当前消费者清单扩成可预览的接线变更计划，先显示“将追加哪些插件行、哪些文件会变化、哪些服务仍缺失”，再允许写入。推导来自 core.TYPES把内容与消费者统一登记，以及wireType已经能返回实际变更步骤。相对现有按钮，它增加的是写前可审阅性和解释能力，不是宣称能静态证明宿主运行成功。

最小实验应固定一个正常预设、一个缺skill-filesystem预设和一个复杂YAML预设，对照现有按钮与预览方案，比较误写、漏接线、恢复人工量及用户能否预测结果。若预览继续把静态存在误报为可加载，或为维护计划引入第二套易漂移规则，应停止该方向。另一项必要工程前置是按真实路径约束文件边界；这可以单独验证，不把修复计划当现有安全保证。

#### 证据与依据

**依据 1 · 源码核查**：[packages/studio/core.js:296-358](https://github.com/HYcally/dsh-preset-studio/blob/93d132de6db1cd71fd5dd0b0056415101dda32c0/packages/studio/core.js#L296-L358)

统一消费者建模是推演依据。

<details>
<summary>查看原文（63行）</summary>

```text
export const TYPES = [
  {
    id: 'inject',
    label: '注入',
    dir: '注入',
    shape: 'flat',
    orderBy: 'order',
    consumers: ['inject'],
    toggleField: 'enabled',
    hint: '按序号拼进系统提示词或运行上下文；关掉的不投递。',
    create: {
      fields: [
        { key: 'name', label: '名字', required: true, hint: '随便写，中文也行；文件名会用它。' },
        {
          key: 'role',
          label: '落点',
          kind: 'select',
          default: 'system',
          hint: '系统提示词 = 常驻，规则放这；对话上下文 = 贴在当前轮后面；助手块没有独立通道，等同对话上下文。',
          options: [
            { value: 'system', label: '系统提示词（常驻，最稳）' },
            { value: 'user', label: '对话上下文（贴在当前轮后面）' },
            { value: 'assistant', label: '助手块（无独立通道，等同对话上下文）' },
          ],
        },
        {
          key: 'order',
          label: '序号',
          kind: 'number',
          default: 10,
          hint: '按段位：10 人设 / 20 风格 / 30 纪律 / 50 字数 / 70 模式 / 90 补丁。数字留空位，以后插新的不用重排。',
        },
      ],
      body: '在这里写这条注入的内容。\n',
    },
  },
  {
    id: 'doc',
    label: '文档',
    dir: '文档',
    shape: 'flat',
    orderBy: 'name',
    consumers: ['skill-dir', 'docs'],
    toggleField: 'disable-model-invocation',
    hint: '模型在技能目录里看到一句话，需要时才翻开全文；接上写回工具后它能自己改。',
    create: {
      slug: true,
      fields: [
        { key: 'name', label: '文档名（小写英文）', required: true, slug: true },
        { key: 'description', label: '什么时候想起', required: true },
      ],
      body: '在这里写这篇文档的内容。\n',
    },
  },
  {
    id: 'skill',
    label: '技能',
    dir: '技能',
    shape: 'folder',
    orderBy: 'name',
    consumers: ['skill-dir'],
    toggleField: 'disable-model-invocation',
    hint: '模型在做某类活之前主动打开的步骤说明。',
```

</details>

**依据 2 · 源码核查**：[packages/studio/core.js:741-776](https://github.com/HYcally/dsh-preset-studio/blob/93d132de6db1cd71fd5dd0b0056415101dda32c0/packages/studio/core.js#L741-L776)

已有接线变更步骤但尚无写前事务计划。

<details>
<summary>查看原文（36行）</summary>

```text
export function wireType(preset, typeId) {
  const type = TYPES.find((item) => item.id === typeId)
  if (!type || type.consumers.length === 0) throw new Error('这种条目不需要接线')
  const patchPath = path.join(preset.dir, 'cordis.patch.yml')
  if (!fs.existsSync(patchPath)) throw new Error('这个预设没有 cordis.patch.yml')
  let text = fs.readFileSync(patchPath, 'utf8')
  if (text.trim() === '') throw new Error('这个预设的 cordis.patch.yml 还是空的。先照「示例预设」抄一份过来，再接。')
  const dir = path.join(preset.dir, type.dir)
  const rows = parsePatchRows(text)
  const done = []
  for (const id of type.consumers) {
    if (id === 'skill-dir') {
      const result = wireSkillDir(text, dir)
      if (!result.found) throw new Error('这个预设有 cordis.patch.yml，但里面没有 skill-filesystem 那一行。照「示例预设」抄那三行过来，再接。')
      if (result.inline) throw new Error('customSkillDirs 现在是行内写法，面板改不了，请手动改成多行列表')
      if (result.changed) {
        text = result.text
        done.push('技能目录')
      }
      continue
    }
    const row = consumerRow(id)
    if (rows.some((item) => item.name === row.name && !item.groupOnly)) continue
    const result = appendPluginsBlock(text, [
      [0, '- id: ' + row.id],
      [1, "name: '" + row.name + "'"],
      [1, 'config:'],
      [2, 'dir: ' + yamlString(dir)],
    ])
    if (!result.found) throw new Error('这个预设的 cordis.patch.yml 里找不到 plugins: 列表。照「示例预设」抄一份再试。')
    text = result.text
    done.push(CONSUMER_DEFS[id].label)
  }
  if (done.length > 0) writeAtomic(patchPath, text)
  fs.mkdirSync(dir, { recursive: true })
  return { changed: done.length > 0, steps: done, patchPath }
```

</details>

**依据 3 · 源码核查**：[packages/studio/core.js:890-895](https://github.com/HYcally/dsh-preset-studio/blob/93d132de6db1cd71fd5dd0b0056415101dda32c0/packages/studio/core.js#L890-L895)

真实路径边界仍待完善。

```text
export function assertAllowed(roots, input) {
  if (typeof input !== 'string' || input.trim() === '') throw new Error('path is required')
  const abs = path.resolve(input)
  if (!roots.some((root) => isInside(root, abs))) throw new Error('path is outside the configured roots')
  if (!ALLOWED_EXT.has(path.extname(abs).toLowerCase())) throw new Error('unsupported file type: ' + path.extname(abs))
  return abs
```

#### 缺口

- 预览式计划未实现且没有用户对照。
  **影响**：无法确认它比已有明确报错更有收益。
  **进一步探讨**：用同一任务对照错误率和总恢复成本，保留静态/运行结果差异。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 哪些本地维护者值得试，如何识别停止条件？

**研究主题**：采用判断

#### 完整回答

可以给经常维护本地预设、能回查文件变更的DSH使用者一个受控试用建议，优先使用作者声明实测的平台。先复制一个不含私人数据的预设到可信、无符号链接的独立根，用版本管理或备份记录原状。依次核对新建、接线、编辑冲突、挂载后提示与doc_update回写；成功判据是实际文件与新会话行为一致，而非按钮返回成功。

若页面显示已接线而新会话缺少能力、安装失败后状态不清、目录外资料被读取或模板路径不匹配，应停止写入，回到DSH管理器核对bundle并从备份恢复，改用编辑器直接维护。该试用条件主动限制了词法路径检查和跨平台模板的已知边界，不应将其推广为多用户远程管理界面。

#### 证据与依据

**依据 1 · 源码核查**：[packages/studio/index.js:355-372](https://github.com/HYcally/dsh-preset-studio/blob/93d132de6db1cd71fd5dd0b0056415101dda32c0/packages/studio/index.js#L355-L372)

文件冲突可以作为试验判据。

<details>
<summary>查看原文（18行）</summary>

```text
      path: ROUTES.write,
      handler: async (req, res) => {
        if (!guard(req, res, 'POST')) return
        try {
          const body = await readJsonBody(req)
          const target = assertAllowed(roots, body?.path)
          const content = typeof body?.content === 'string' ? body.content : ''
          const baseMtime = typeof body?.baseMtime === 'number' ? body.baseMtime : null
          const before = fs.readFileSync(target, 'utf8')
          const stat = fs.statSync(target)
          if (baseMtime !== null && Math.abs(stat.mtimeMs - baseMtime) > 1 && before !== content) {
            sendJson(res, 409, { error: '文件在磁盘上已经变过了', content: before, mtime: stat.mtimeMs })
            return
          }
          writeAtomic(target, content)
          sendJson(res, 200, { path: target, mtime: fs.statSync(target).mtimeMs })
        } catch (error) {
          sendJson(res, 400, { error: String(error?.message ?? error) })
```

</details>

**依据 2 · 源码核查**：[packages/studio/index.js:475-519](https://github.com/HYcally/dsh-preset-studio/blob/93d132de6db1cd71fd5dd0b0056415101dda32c0/packages/studio/index.js#L475-L519)

安装/卸载回执须与宿主状态相互核对。

<details>
<summary>查看原文（45行）</summary>

```text
    {
      kind: 'exact',
      path: ROUTES.install,
      handler: async (req, res) => {
        if (!guard(req, res, 'POST')) return
        try {
          const body = await readJsonBody(req)
          const presetDir = resolvePreset(body?.preset)
          const manifest = readPresetManifest(presetDir)
          if (!manifest.ok) throw new Error(manifest.reason)
          const manager = ctx.get('pluginManager')
          if (!manager) throw new Error('插件管理器不在，装不了')
          const existing = await bundleFor(ctx, presetDir)
          if (existing) throw new Error('这个预设已经装过了：' + existing.name)
          const result = await manager.installBundle('link:' + presetDir, {})
          if (result && result.application === 'failed') throw new Error(describeFailure(result))
          sendJson(res, 200, {
            bundle: result && result.bundle ? result.bundle : manifest.name,
            changed: !!(result && result.changed),
          })
        } catch (error) {
          sendJson(res, 400, { error: humanize(error) })
        }
      },
    },
    {
      kind: 'exact',
      path: ROUTES.uninstall,
      handler: async (req, res) => {
        if (!guard(req, res, 'POST')) return
        try {
          const body = await readJsonBody(req)
          const presetDir = resolvePreset(body?.preset)
          const bundle = await bundleFor(ctx, presetDir)
          if (!bundle) throw new Error('这个预设没有装进 DSH')
          if (!bundle.removable) throw new Error('这个包不能从面板里卸载：' + bundle.name)
          const manager = ctx.get('pluginManager')
          if (!manager) throw new Error('插件管理器不在，卸不了')
          const result = await manager.removeBundle(bundle.name)
          if (result && result.application === 'failed') throw new Error(describeFailure(result))
          const profileDir = ctx.get('profileContext')?.dir ?? ''
          const cleaned = dropStaleLink(profileDir, bundle.name, presetDir)
          sendJson(res, 200, { bundle: bundle.name, changed: !!(result && result.changed), cleaned })
        } catch (error) {
          sendJson(res, 400, { error: humanize(error) })
```

</details>

**依据 3 · 源码核查**：[packages/studio/core.js:33-49](https://github.com/HYcally/dsh-preset-studio/blob/93d132de6db1cd71fd5dd0b0056415101dda32c0/packages/studio/core.js#L33-L49)

可信根及备份要求来自实际边界。

<details>
<summary>查看原文（17行）</summary>

```text
export function isInside(root, target) {
  const rel = path.relative(path.resolve(root), path.resolve(target))
  return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel))
}

/** Compare two directory spellings the way Windows does. */
export function samePath(left, right) {
  const norm = (value) => String(value).replace(/\\/g, '/').replace(/\/+$/, '').toLowerCase()
  return norm(left) === norm(right)
}

/** Write one file atomically, so a failed write never truncates a preset file. */
export function writeAtomic(target, content) {
  const tmp = target + '.tmp-' + process.pid + '-' + Date.now()
  fs.writeFileSync(tmp, content, 'utf8')
  fs.renameSync(tmp, target)
}
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
