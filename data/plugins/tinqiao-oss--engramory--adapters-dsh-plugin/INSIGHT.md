# dsh-engramory

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[f346ee2](https://github.com/tinqiao-oss/engramory/tree/f346ee2facd39720289101a594ec77ffdce9b366/adapters/dsh/plugin)

<!-- BEGIN META -->
[![GitHub ★ 198](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=198&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/tinqiao-oss/engramory) [![npm 30d 1,861](https://img.shields.io/static/v1?label=npm+30d&message=1%2C861&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-engramory) [![最新发布 2026-11-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-engramory)
<!-- END META -->

> **功能**：为 DSH 注入 Markdown 记忆索引、限制可识别文件工具的索引增长，并提供记忆列表与设置页。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将常驻索引、可识别工具的增长拒绝和DSH上下文/cwd接线结合，允许超限收缩而不堵压缩。增量归宿主适配与预算纪律，不归新检索算法，不重复根协议贡献。

> **主要限制**：[Q02](#research-q02) shell/MCP/未知工具及不可读局部写仍可绕cap，读失败可无记忆；[Q03](#research-q03) social依来源metadata并非认证/OS隔离。尺寸与界面健康不证明笔记正确，仍须单writer、明文管理与事实复核。

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
  - [Q01 · DSH插件给个人精选记忆增加什么，哪些来自根协议？](#detail-section-11)
  - [Q02 · 索引注入和文件写前上限怎样接线，哪些失败仍放行？](#detail-section-12)
  - [Q03 · 社交身份、记忆页与设置边界能支持什么试用？](#detail-section-13)
  - [Q04 · 预算cap能否提高记忆效果，下一项可证伪假设是什么？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人Agent跨会话保留精选纠正/偏好/项目线索；替代为规则手读索引或原生auto-memory。合格结果需相关指针可读与按需核详情，不是记忆数量。

原生auto-memory和常驻规则+Markdown索引已有先例；根协议/Python工具另评，DSH本包增加runtime自动注入、guard和侧栏/settings。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| runtime索引 | 新会话/每步获取精选指针 | context服务；有界截断/IO失败可缺失 |
| 写前cap | 限制可模拟文件工具索引增长 | shell/MCP等可绕，不核事实 |
| social与UI | 来源分路、记忆列表/设置 | metadata非认证，OS同账户可绕 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node18+与匹配DSH | 插件需 | apply/tools/context | 兼容声明非本轮验收 |
| tools guard | cap需 | 写前拒绝 | shell/MCP等不覆盖 |
| systemPrompt.context | 自动回忆需 | runtime索引 | 缺服务保留guard/Skill但不注入 |
| skills/connection/UI/配置编辑 | 对应功能需 | 规则、列表和设置 | 可降级或报不可用 |
| 单writer小库与备份 | 采用前提 | 精选事实与恢复 | 明文非权限隔离 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 个人profile、复制非敏感库、固定indexPath | 避免同名误拦，留备份 |
| 回忆 | 新会话核真实runtime索引与详情 | 没注入转手读，不猜已记住 |
| 写入 | 核cap拒绝与超限收缩 | 查看两维数字，不经shell绕过当修复 |
| 整理 | 人工核事实/过期/重复和指针 | cap不等真假验收 |
| 退出 | 卸载并保留普通文件 | 转手读，单独管明文/模型留存 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | Node/宿主与库空间 | 配路径、迁库和基线备份 | 金额工时未知 |
| 持续 | 每步索引token/模型、存储 | 精选、压缩和陈旧核验 | 未测回忆/总token收益 |
| 失败恢复 | 备份和重试 | 查无注入/误拦/局部放行 | cap非事务/全通道控制 |
| 退出 | 保留Markdown | 卸载与私密数据管理 | 不自动删库/云副本 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 自动回忆线索 | runtime有界索引与路径去重 | 模型读详情和正确回忆 |
| 增长预算 | 部分文件工具可拒增长、允许压缩 | 所有写通道/多writer原子控制 |
| 社交提示 | owner/stranger metadata与路径guard | 独立身份认证/OS隔离 |
| UI整理 | 列表/设置revision/打开错误 | 长期整理质量和宿主实际兼容 |

> **思考**：[Q02](#research-q02) shell/MCP/未知工具及不可读局部写仍可绕cap，读失败可无记忆；[Q03](#research-q03) social依来源metadata并非认证/OS隔离。尺寸与界面健康不证明笔记正确，仍须单writer、明文管理与事实复核。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将常驻索引、可识别工具的增长拒绝和DSH上下文/cwd接线结合，允许超限收缩而不堵压缩。增量归宿主适配与预算纪律，不归新检索算法，不重复根协议贡献。

[Q02](#research-q02) 动态路径身份、raw字节与超限收缩、禁模板插值可追溯；IO异常/局部不可读fail-open和同步FS预算需保留。[Q03](#research-q03)revision配置保护有效但deadline不取消底层IO。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) shell/MCP/未知工具及不可读局部写仍可绕cap，读失败可无记忆；[Q03](#research-q03) social依来源metadata并非认证/OS隔离。尺寸与界面健康不证明笔记正确，仍须单writer、明文管理与事实复核。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03)个人profile复制小库trial，显式indexPath，核新会话/cwd/误拦/卸载。缺注入或关键指针损失即回手读和备份，social暂不承担秘密隔离。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源支持注入与部分写通道cap，个人试用可行性有边界；无本轮宿主/真实记忆任务执行，社交不是安全隔离，未来指针diff假设未实现。

- 已检查：作者 README、包清单、源码路径 README.md、adapters/dsh/plugin/README.md、adapters/dsh/plugin/index.js、adapters/dsh/plugin/package.json 及固定范围 inventory；组件：adapters/dsh/plugin。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定真实plugin组件source，定向apply/guard/indexRecall、social source分类/陌生路径拒绝、memory/settings路由。未全审3151行全部身份投影/文件列表、client所有UI或根Python工具，未执行宿主。
- 下一步：[Q04](#research-q04)复制小库核压缩损失与原生回忆，再独立测固定宿主身份/IO失败，未本轮执行。

**分析版本**

- **仓库**：[tinqiao-oss/engramory](https://github.com/tinqiao-oss/engramory)
- **版本号**：1.2.0（[固定提交 f346ee2](https://github.com/tinqiao-oss/engramory/tree/f346ee2facd39720289101a594ec77ffdce9b366)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04)压缩前后指针集合diff可能减少关键入口被丢；用小库多轮压缩比较关键回忆、误保留、token与人工时间，无改善或成本抵消即否定，未实现不计贡献。

[Q04](#research-q04)复制小库核压缩损失与原生回忆，再独立测固定宿主身份/IO失败，未本轮执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 4353 | 3172 | 1016 | — |
| .js | test | 2 | 4368 | 3678 | 503 | — |
| .md | source | 2 | 391 | — | — | 6445 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-02），可前往 [GitHub Issues](https://github.com/tinqiao-oss/engramory/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核DSH插件的索引注入、写前cap与身份/UI边界，限定个人精选记忆试用。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · DSH插件给个人精选记忆增加什么，哪些来自根协议？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

dsh-engramory是可加载DSH plugin，目标是个人Agent跨会话保留精选偏好、纠正和项目线索，而非海量文档检索。原生auto-memory也采用索引加详细笔记，简单基线为常驻规则要求每次读MEMORY.md并用文件工具写；本插件增加宿主runtime索引注入、可识别文件写前预算和只读记忆页/设置。普通Markdown格式、笔记纪律与其他宿主Python安装器归根项目，本项只评DSH接线。

合格交付是新会话及时拿到相关指针、必要时读详情且不把陈旧记忆当仓库事实，不能以保存更多笔记算成功。真实apply注册tools.guard并按需注入workingDirectory/skills/systemPrompt；缺prompt.context会保留cap和Skill但不自动注入，不能只凭install成功推定回忆已生效。成熟索引/规则和文件读取不是新记忆算法，增量在DSH宿主自动接线与预算取舍。实际回忆正确率、减少重复纠正及长期整理负担本轮未测。

#### 证据与依据

**依据 1 · 作者声明**：[adapters/dsh/plugin/README.md:3-17](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/adapters/dsh/plugin/README.md#L3-L17)

作者插件定位与索引/guard/规则功能。

<details>
<summary>查看原文（15行）</summary>

```text
# dsh-engramory

[![dsh-xray](https://img.shields.io/endpoint?url=https%3A%2F%2Funstone.github.io%2Fdsh-xray%2Fbadge%2Ftinqiao-oss__engramory.json)](https://unstone.github.io/dsh-xray/registry.html#tinqiao-oss__engramory)

给 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（dsh）用的长期记忆插件。AI 记住的东西存成一个个普通 markdown 文件，你随时能打开看、能改。它是 [Engramory](https://github.com/tinqiao-oss/engramory) 的 dsh 专用版：Engramory 本身是通用的 AI agent 记忆，Claude Code、Codex 等也能用同一个库。

![记忆页](https://raw.githubusercontent.com/tinqiao-oss/engramory/master/adapters/dsh/plugin/screenshots/memory-page.png)

## 它做什么

- **每轮自动带上记忆索引。** 索引 `MEMORY.md` 只列笔记名字，插件每一步都把它放进上下文，AI 不用先读文件就知道自己记过什么，要细节再打开那条笔记。写入后下一轮就能看到；超出上限的部分不带上，并提醒 AI 压缩。
- **索引有硬上限。** 默认 200 行 / 25 KB。AI 用 dsh 的文件工具写索引时，只要插件算得出写完的样子，会超上限就在写入前拒绝，让它先压缩；压缩照样放行。细节见[上限怎么判](#上限怎么判)。
- **自带记忆规则。** 记什么、怎么记、什么时候清理，这套规则（skill）随插件注册，不用另外装文件。
- **快压缩时提醒 AI 存记忆。** dsh 会在对话太长时把前面压缩成摘要，摘要不一定留得下以后还用得着的东西。对话快到 dsh 要压缩的地方时，插件提醒 AI 把值得长期记住的先存进记忆；提醒的是 AI，不打扰你。
- **侧栏多一个「记忆」页。** 只读，列出笔记名字，点名字用电脑上的默认程序打开；顺带体检，标出索引里的坏链接和没进索引的笔记。
```

</details>

**依据 2 · 源码核查**：[adapters/dsh/plugin/package.json:15-29](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/adapters/dsh/plugin/package.json#L15-L29)

main/client和bundle确立真实插件。

<details>
<summary>查看原文（15行）</summary>

```text
  "type": "module",
  "main": "index.js",
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-plugin-manager"
      ]
    },
    "compatibility": {
      "dsh": ">=0.1.0-rc.7 <0.3.0-0",
```

</details>

**依据 3 · 源码核查**：[adapters/dsh/plugin/index.js:82-120](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/adapters/dsh/plugin/index.js#L82-L120)

apply配置真实入口。

<details>
<summary>查看原文（39行）</summary>

```text
export function apply(ctx, config = {}) {
  // `indexPath` pins the guard to ONE file. Without it the only signal is the
  // basename, so an unrelated MEMORY.md in any other project is gated too — a real
  // refusal on a file that is not a memory index at all, with no way to opt out
  // (renaming `indexName` would just unguard the real index). The Claude Code hook
  // has had ENGRAMORY_INDEX_PATH for exactly this; this is its counterpart.
  //
  // Its identity is found on every gated write (pinnedKey), as the target's is: a key
  // found once at start went stale when a folder on its path became a link or a drive
  // was mapped later, and a relative pin names a file in each session's directory.
  const indexPath = typeof config.indexPath === 'string' && config.indexPath.trim()
    ? config.indexPath.trim()
    : undefined
  // dsh's profile editor, where dsh keeps the language the user chose, may come up after
  // this plugin: the language is settled again then (below), so the text is read per use.
  const language = { current: memoryLanguage(ctx, config) }
  const settings = {
    indexName: indexNameOf(config.indexName),
    indexPath,
    // When pinned, the name to match is the pinned file's own basename.
    matchName: (indexPath === undefined
      ? indexNameOf(config.indexName)
      : basename(indexPath)).toLowerCase(),
    maxLines: positive(config.maxLines, DEFAULT_MAX_LINES),
    maxBytes: positive(config.maxBytes, DEFAULT_MAX_BYTES),
    get text() {
      return TEXT[language.current]
    },
    // Companion mode (大肥鱼模式, SKILL.md §2.2): three more types for a companion
    // character's own life, and recall in character.
    companion: config.companion === true,
    // Social mode, a choice inside companion mode: others can talk to the character too, so
    // only the user's own conversations get the memory (speakerOf). Private, the default:
    // every conversation does.
    social: config.companion === true && config.audience === 'social',
    // Whether the index goes into the runtime context (below); the skill says where to look
    // when it does not.
    injectIndex: config.injectIndex !== false,
  }
```

</details>

**依据 4 · 源码核查**：[adapters/dsh/plugin/index.js:186-200](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/adapters/dsh/plugin/index.js#L186-L200)

实际写前guard注册。

<details>
<summary>查看原文（15行）</summary>

```text
  // A guard that throws breaks the host's tool call; only an UNEXPECTED exception can
  // get here (an edit whose simulated result exceeds V8's string limit, say), and like
  // the Python guard it fails open — the host could not perform such an edit either.
  // The stranger filter is the exception: it fails closed on its own (refuseStranger).
  ctx.tools.guard((exec) => {
    const stranger = settings.social
      ? refuseStranger(exec, settings, sessionCwd, roleOf)
      : undefined
    if (stranger !== undefined) return stranger
    try {
      return refuseOversizedIndex(exec, settings, sessionCwd)
    } catch {
      return undefined
    }
  })
```

</details>

**依据 5 · 源码核查**：[adapters/dsh/plugin/index.js:250-265](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/adapters/dsh/plugin/index.js#L250-L265)

prompt能力缺失与必需上下文边界。

<details>
<summary>查看原文（16行）</summary>

```text
  // Recall without a read: the index goes into dsh's runtime context, and dsh carries a
  // changed snapshot to the model on the next request. It is cut at the cap, as a host
  // that loads only so much would cut it, and the model is told. Optional and possibly
  // late, like the services above; a host whose prompt registry has no runtime context
  // keeps the cap and the skill and simply goes without.
  //
  // With companion mode or social mode on, a context of its own carries more: companion
  // mode adds the companion rules after the index; social mode tells who is on the other
  // end — the user's own conversation gets the memory, any other gets no store at all,
  // only a note saying so. The rules and the note still go in with `injectIndex: false`,
  // which only turns the index off.
  //
  // That context is REQUIRED: a persona preset may turn optional runtime context off
  // (dsh-persona's `includeRuntimeContext: false`, as the shipped `minimal` preset does),
  // which would leave a companion without the memory and a stranger without the note that
  // the store is closed — seen on a real dsh.
```

</details>

#### 缺口

- 固定宿主中的索引带入、精选记忆质量和重复纠正减少未运行。
  **影响**：不能把接线机制推成真实记忆效果。
  **进一步探讨**：复制非敏感小库在固定DSH做新会话/错误纠正任务，核注入与原文并比较规则手读基线。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 索引注入和文件写前上限怎样接线，哪些失败仍放行？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

indexRecall按session cwd找最近.git范围项目库及DSH_HOME全局库，或indexPath固定索引；去重inode身份、按size/mtime/ctime和缓存时间重读，只读有界头部并标截断。上下文order300且interpolate=false，不把笔记{{}}当模板；读取异常返回空字符串，不阻整个请求，意味着这轮可能没有记忆。

guard只处理write/edit及str_replace_editor的create/replace/insert，检查file_path和path候选；目标按session cwd和动态路径身份匹配，pin可避免误拦其他同名MEMORY.md。完整写入测新行数/UTF8字节；仅拒“该维度超cap且比原来增长”，允许已超限逐步压缩，两个维度分别算。局部编辑尽量模拟；参数无法重建且当前已超限才拒绝。不可读/非普通/超过readLimit时局部编辑放行；整写当前缺失当空，大到读不完时只比字节增长，行数当Infinity。unexpected guard异常也fail-open；shell/MCP/外部编辑器和未知工具不受该预算控制，不能称强制全写通道cap。

索引预算限制带入大小，不验证笔记真假、保密、重复或过期。它不自动整理、搜索向量、归因来源或恢复备份；单writer多reader纪律与外部编辑可绕过是实际采用边界。写前测量也不是整个文件系统的原子多writer事务。

#### 证据与依据

**依据 1 · 源码核查**：[adapters/dsh/plugin/index.js:1836-1884](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/adapters/dsh/plugin/index.js#L1836-L1884)

候选库、身份/cache、有界读取与拼接。

<details>
<summary>查看原文（49行）</summary>

```text
function indexRecall(settings, sessionCwd) {
  const projects = new Map() // session directory -> { at, store }
  const shown = new Map() // label + path -> { stamp, at, text }
  const readUpTo = Math.min(settings.maxBytes, settings.readLimit)
  return (context) => {
    const cwd = sessionCwd(context) ?? process.cwd()
    const { labels } = settings.text
    // A session directory on another machine is not looked into (remotePath), as the
    // memory page does not: neither its project store nor a pin that lands under it. A
    // store the user placed there by name — an absolute pin, $DSH_HOME — still is.
    const remote = remotePath(cwd)
    const pinned = settings.indexPath === undefined ? undefined : hostPath(cwd, settings.indexPath)
    const candidates = pinned !== undefined
      ? (remote && !qualified(settings.indexPath) && remotePath(pinned)
          ? []
          : [{ label: labels.pinned, path: pinned }])
      : [remote ? undefined : projectStore(cwd, settings.indexName, projects, labels.project),
          { label: labels.user, path: join(dshHome(), STORE_DIR, settings.indexName) }]
    const seen = new Set()
    const parts = []
    for (const store of candidates) {
      if (store === undefined) continue
      let stat
      try {
        stat = statSync(store.path, { bigint: true }) // exact 64-bit file ids on Windows
      } catch {
        continue // no store there
      }
      if (!stat.isFile()) continue
      const identity = stat.ino ? `${stat.dev}:${stat.ino}` : pathKey(store.path)
      if (seen.has(identity)) continue // the same file under both names
      const key = `${store.label}\0${store.path}`
      const stamp = `${identity}:${stat.size}:${stat.mtimeNs}:${stat.ctimeNs}`
      let entry = shown.get(key)
      if (entry === undefined || entry.stamp !== stamp || Date.now() - entry.at >= RECHECK_MS) {
        // A project store is re-checked whenever it is re-read: what is behind a path
        // can change with it.
        if (store.root !== undefined && !projectIndex(store.path, store.root)) continue
        const current = readIndex(store.path, readUpTo, true)
        if (current === undefined) continue // unreadable just now: try again next step
        entry = { stamp, at: Date.now(), text: renderIndex(store.label, store.path, current, settings) }
        shown.set(key, entry)
        if (shown.size > 64) shown.delete(shown.keys().next().value)
      }
      seen.add(identity)
      parts.push(entry.text)
    }
    return parts.join('\n\n')
  }
```

</details>

**依据 2 · 源码核查**：[adapters/dsh/plugin/index.js:1887-1906](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/adapters/dsh/plugin/index.js#L1887-L1906)

最近.git项目根的选择。

<details>
<summary>查看原文（20行）</summary>

```text
/**
 * The project store a session in `cwd` belongs to, found the way dsh finds a project's
 * AGENTS.md: the project root is the nearest ancestor holding `.git` (else `cwd`
 * itself), and the nearest store between the two is the project's — so a session in
 * `<project>/src` still sees `<project>/.engramory-memory`. Only a store that passes
 * projectIndex() counts, so a directory named like the index does not hide the store
 * above it.
 */
function projectStore(cwd, indexName, cache, label) {
  const hit = cache.get(cwd)
  // The label is the current language's: it may have changed since (memoryLanguage).
  if (hit !== undefined && Date.now() - hit.at < RECHECK_MS) return hit.store && { ...hit.store, label }
  let root = cwd
  for (let dir = cwd; ; dir = dirname(dir)) {
    if (exists(join(dir, '.git'))) {
      root = dir
      break
    }
    if (dirname(dir) === dir) break // no marker anywhere: the session's directory is the root
  }
```

</details>

**依据 3 · 源码核查**：[adapters/dsh/plugin/index.js:331-347](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/adapters/dsh/plugin/index.js#L331-L347)

runtime context注册、禁插值及读失败空。

<details>
<summary>查看原文（17行）</summary>

```text
    ctx.inject(['systemPrompt'], (inner) => {
      const prompt = inner.systemPrompt
      if (typeof prompt?.context !== 'function') return
      for (const { name, order, required, text } of contexts) {
        inner.effect(() => prompt.context({
          name,
          order: order ?? INDEX_CONTEXT_ORDER,
          // The index is quoted, not templated: dsh interpolates `{{name}}` groups and
          // throws on a malformed one, which would fail the whole request.
          interpolate: false,
          ...(required ? { required: true } : {}),
          text: (context) => {
            try {
              return text(context)
            } catch {
              return '' // never fail a request over recall
            }
```

</details>

**依据 4 · 源码核查**：[adapters/dsh/plugin/index.js:2050-2071](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/adapters/dsh/plugin/index.js#L2050-L2071)

仅可识别写工具与两个路径字段。

<details>
<summary>查看原文（22行）</summary>

```text
  if (!args || typeof args !== 'object') return undefined
  const tool = typeof exec.name === 'string' ? exec.name : ''

  // Nothing below can refuse a read, a view, or an unknown tool, so leave before
  // anything touches the filesystem: a guard runs on EVERY tool call, and this keeps
  // the common case a few string compares.
  const gated = WHOLE_FILE_WRITES.has(tool)
    || PARTIAL_WRITES.has(tool)
    || (tool === 'str_replace_editor'
      && (args.command === 'create' || args.command === 'str_replace'
        || args.command === 'insert'))
  if (!gated) return undefined

  // Every path the call names is judged: dsh's `write` / `edit` take `file_path`,
  // `str_replace_editor` takes `path`, another plugin's `write` may take `path`, and dsh
  // ignores a field a tool does not declare — so reading one name only let a decoy in
  // the other hide a write to the index (it passed as one to README.md). A call naming
  // the index in a field its tool ignores may be refused; that costs nothing.
  for (const filePath of new Set([args.file_path, args.path].filter((p) => typeof p === 'string'))) {
    const reason = judgeWrite(exec, args, tool, filePath, settings, sessionCwd)
    if (reason !== undefined) return reason
  }
```

</details>

**依据 5 · 源码核查**：[adapters/dsh/plugin/index.js:2076-2145](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/adapters/dsh/plugin/index.js#L2076-L2145)

路径身份、整写/局部模拟与不可读放行。

<details>
<summary>查看原文（70行）</summary>

```text
function judgeWrite(exec, args, tool, filePath, settings, sessionCwd) {
  // Every read and identity check below uses the file the host will actually touch.
  let target
  try {
    target = hostPath(sessionCwd(exec), filePath)
  } catch {
    return undefined // a relative path and no cwd left to resolve it (deleted under us)
  }
  // Is this the index? Decided on the file the write lands on, not the name it was
  // called by: dsh follows a symlink, so `idx.md -> MEMORY.md` writes the index (#20).
  // Pinned, that is identity — which is also where an unrelated same-named file in
  // another project drops out. Unpinned, the name of the path or of what it resolves
  // to, compared case-INsensitively: on the case-insensitive filesystems most stores
  // live on (Windows/macOS), `memory.md` IS the guarded index. (Same trade-off as the
  // Python guard: on a case-sensitive FS this can gate an unrelated lowercase twin —
  // rename it, or pin `indexPath`.)
  const named = (p) => basename(p).toLowerCase() === settings.matchName
  const pinned = pinnedKey(exec, settings, sessionCwd)
  const isIndex = pinned !== undefined
    ? pathKey(target) === pinned
    : named(filePath) || named(pathKey(target))
  if (!isIndex) return undefined

  if (WHOLE_FILE_WRITES.has(tool)) {
    if (typeof args.content !== 'string') return undefined
    return verdict(args.content, readIndex(target, settings.readLimit), filePath, settings)
  }
  if (tool === 'str_replace_editor' && args.command === 'create') {
    if (typeof args.file_text !== 'string') return undefined
    return verdict(args.file_text, readIndex(target, settings.readLimit), filePath, settings)
  }

  const partial = PARTIAL_WRITES.has(tool)
    || (tool === 'str_replace_editor'
      && (args.command === 'str_replace' || args.command === 'insert'))
  if (!partial) return undefined // read / view / list / unknown: never refused

  // Unreadable, or past the read limit: an edit's result cannot be simulated without
  // the whole text, and refusing it blind would refuse the compacting ones too. Let it
  // through, as for any index the guard cannot read; whole-file writes stay measured.
  const currentBuf = readIndex(target, settings.readLimit)
  if (currentBuf === undefined || !Buffer.isBuffer(currentBuf)) return undefined
  const current = currentBuf.toString('utf8')
  const insert = insertOf(tool, args)
  const edits = insert === undefined ? editsOf(tool, args) : []
  if (insert !== undefined || edits.length > 0) {
    // A tool whose schema this guard does not know may be judged on more than one
    // reading of its arguments: the refusal stands if any reading would refuse.
    const results = insert !== undefined
      ? [simulateInsert(current, insert, settings.readLimit)]
      : edits.map((edit) => simulateEdit(current, edit, settings.readLimit))
    for (const simulated of results) {
      const reason = typeof simulated === 'string'
        ? verdict(simulated, currentBuf, filePath, settings)
        : bounded(simulated, current, currentBuf, filePath, settings)
      if (reason !== undefined) return reason
    }
    return undefined
  }

  // The edit's result genuinely cannot be reconstructed from its arguments. Honest,
  // cheap rule: if the index is ALREADY over, refuse to mutate it blind — and name
  // the open door, because "compact first" while refusing edits reads as a dead end.
  const breach = measure(current, settings)
  if (!breach) return undefined
  return (
    `${displayName(settings)} is already over the Engramory cap (${breach}) and this ` +
    `edit's result cannot be measured. Compact it with a whole-file write instead: ` +
    `a rewrite that SHRINKS the index always passes, even while still over the cap. ` +
    `Pointer-ify over-long lines, merge duplicates, archive cold notes — the index ` +
```

</details>

**依据 6 · 源码核查**：[adapters/dsh/plugin/index.js:2171-2198](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/adapters/dsh/plugin/index.js#L2171-L2198)

维度超限且增长规则和大文件行数Infinity。

<details>
<summary>查看原文（28行）</summary>

```text
/**
 * Mirrors the Python guard's deny rule: refuse only when a dimension ends OVER its
 * cap AND grew past the current file, so a shrinking/keeping write on an over-cap
 * index always passes and incremental compaction stays possible. A missing or
 * unreadable current file counts as empty — a first write past the cap is refused.
 * One too large to read (see readIndex) is sized by the filesystem, with a line count
 * no write can exceed: only its byte growth can be refused, and every shrink passes.
 */
function verdict(text, currentBuf, filePath, settings) {
  const lines = countLines(text)
  const bytes = Buffer.byteLength(text, 'utf8')
  // Current byte size comes from the RAW buffer, mirroring how the Python guard
  // sizes the on-disk file: decoding first inflated a non-UTF-8 index ~3x (every
  // bad byte becomes a 3-byte U+FFFD), which made a genuinely growing write look
  // like a shrink and pass. Newlines survive a lossy decode, so the line count may
  // use the decoded text.
  const unread = currentBuf !== undefined && !Buffer.isBuffer(currentBuf)
  const curLines = currentBuf === undefined ? 0
    : unread ? Infinity : countLines(currentBuf.toString('utf8'))
  const curBytes = currentBuf === undefined ? 0 : unread ? currentBuf.bytes : currentBuf.length
  const over = []
  if (lines > settings.maxLines && lines > curLines) {
    over.push(`${lines} lines > ${settings.maxLines}`)
  }
  if (bytes > settings.maxBytes && bytes > curBytes) {
    over.push(`${bytes} bytes > ${settings.maxBytes}`)
  }
  return over.length ? capRefusal(over, filePath, settings) : undefined
```

</details>

**依据 7 · 源码核查**：[adapters/dsh/plugin/index.js:2464-2489](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/adapters/dsh/plugin/index.js#L2464-L2489)

普通文件、有界读取和IO失败undefined。

<details>
<summary>查看原文（26行）</summary>

```text
function readIndex(filePath, limit, keepHead = false) {
  let fd
  try {
    if (!statSync(filePath).isFile()) return undefined
    fd = openSync(filePath, constants.O_RDONLY | (constants.O_NONBLOCK ?? 0))
    const stat = fstatSync(fd)
    if (!stat.isFile()) return undefined
    const chunks = []
    let total = 0
    for (;;) {
      const chunk = Buffer.allocUnsafe(Math.min(65536, limit + 1 - total))
      const got = readSync(fd, chunk, 0, chunk.length, null)
      if (got === 0) return Buffer.concat(chunks, total)
      chunks.push(chunk.subarray(0, got))
      total += got
      if (total > limit) {
        const bytes = Math.max(stat.size, total)
        return keepHead ? { bytes, head: Buffer.concat(chunks, total) } : { bytes }
      }
    }
  } catch {
    return undefined
  } finally {
    if (fd !== undefined) {
      try { closeSync(fd) } catch { /* nothing left to do */ }
    }
```

</details>

**依据 8 · 源码核查**：[adapters/dsh/plugin/index.js:186-199](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/adapters/dsh/plugin/index.js#L186-L199)

异常fail-open。

<details>
<summary>查看原文（14行）</summary>

```text
  // A guard that throws breaks the host's tool call; only an UNEXPECTED exception can
  // get here (an edit whose simulated result exceeds V8's string limit, say), and like
  // the Python guard it fails open — the host could not perform such an edit either.
  // The stranger filter is the exception: it fails closed on its own (refuseStranger).
  ctx.tools.guard((exec) => {
    const stranger = settings.social
      ? refuseStranger(exec, settings, sessionCwd, roleOf)
      : undefined
    if (stranger !== undefined) return stranger
    try {
      return refuseOversizedIndex(exec, settings, sessionCwd)
    } catch {
      return undefined
    }
```

</details>

**依据 9 · 作者声明**：[adapters/dsh/plugin/README.md:123-129](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/adapters/dsh/plugin/README.md#L123-L129)

作者公开shell等绕过与其他限制。

```text
## 已知限制

- **只拦 dsh 的文件工具**：`write`、`edit`，以及有的版本和预设带的 `str_replace_editor`；别的插件提供的同名工具也照样判。shell、MCP 文件工具和外部编辑器写入都绕过上限；改完索引跑 `engramory_check.py`，定期跑 `engramory_doctor.py`。
- **记忆库只在默认位置自动找到。** 放在别处，或项目库是指向项目外的链接，要设 `indexPath`；项目根只按 `.git` 认；会话中途新建的项目库最多十秒后才出现。
- **社交模式靠 dsh 窗口发来的信息认你。** 除了接入插件标明的主人消息，只有 dsh 自己窗口里打的字算你的；浏览器读不出时区时也认不出。dsh 以后新加的消息种类，插件认识之前都算别人的：你的会话可能拿不到记忆，但不会把记忆漏给别人。
- **记忆页打开文件前按路径检查。** dsh 的打开功能拿到路径后还会再解析一次，如果恰好在这一刻有程序改动记忆库里的文件，桌面最终打开的可能是别的东西（dsh 自己打开工作区文件也是这样）。
- **实验性功能**：大肥鱼模式、社交模式、设置页和记忆页在小版本里也可能改。
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 社交身份、记忆页与设置边界能支持什么试用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需Node18+及匹配DSH工具/context等服务，兼容清单是作者声明不是本轮宿主通过；核心文本库不需向量库或单独服务器，但注入内容仍发到宿主模型。先个人独占profile和复制非敏感小库trial，显式indexPath避免无pin时误拦其他同名索引，保留普通文件与备份。

social只在companion=true且audience=social生效。speakerOf靠宿主source.speaker角色或user/rpcId/clientTimeZone且无principal识别owner，陌生类型视other；required context陌生会话只发关闭提示，refuseStranger按路径与目录阻常见工具接近库，异常fail-closed。它依赖宿主来源元数据，不是独立身份认证；shell和同OS账户profile可绕过，不能当多用户秘密隔离。自定义Skill会发所有会话，若其中有敏感路径也不会自动清洗。

记忆页列元数据/健康线索，open通过target查验再交host openWorkspacePath，有超时/busy/不可用；deadline只Promise.race，底层查盘仍继续，因此不能把页面503当取消IO。设置API用revision核陈旧配置、拒!!js表达式和更高层覆盖，保存后不保证每个外部layer都按用户期望。首次配置需理解全局/项目库，持续每步重复索引token和人工精选、压缩/失真核验，未测金额工时；失败可回手动读索引和原文件备份。卸载插件不删记忆，需另管明文、云同步与模型留存，社交/陪伴暂不作生产隔离推荐。

#### 证据与依据

**依据 1 · 源码核查**：[adapters/dsh/plugin/package.json:28-43](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/adapters/dsh/plugin/package.json#L28-L43)

作者兼容范围清单。

<details>
<summary>查看原文（16行）</summary>

```text
    "compatibility": {
      "dsh": ">=0.1.0-rc.7 <0.3.0-0",
      "dshReleases": {
        "0.1.5-rc.3": "compatible",
        "0.1.7-alpha.1": "compatible",
        "0.1.7-alpha.2": "compatible",
        "0.1.7-rc.1": "compatible",
        "0.1.7-rc.2": "compatible",
        "0.2.1-alpha.5": "compatible",
        "0.2.1-rc.1": "compatible",
        "0.2.1-rc.2": "compatible",
        "0.2.1-rc.3": "compatible",
        "0.2.1-rc.4": "compatible",
        "0.2.1-rc.5": "compatible",
        "0.2.2-alpha.2": "compatible"
      }
```

</details>

**依据 2 · 源码核查**：[adapters/dsh/plugin/package.json:73-75](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/adapters/dsh/plugin/package.json#L73-L75)

Node18+。

```text
  "engines": {
    "node": ">=18"
  },
```

**依据 3 · 源码核查**：[adapters/dsh/plugin/index.js:109-120](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/adapters/dsh/plugin/index.js#L109-L120)

social需要companion和audience组合。

<details>
<summary>查看原文（12行）</summary>

```text
    },
    // Companion mode (大肥鱼模式, SKILL.md §2.2): three more types for a companion
    // character's own life, and recall in character.
    companion: config.companion === true,
    // Social mode, a choice inside companion mode: others can talk to the character too, so
    // only the user's own conversations get the memory (speakerOf). Private, the default:
    // every conversation does.
    social: config.companion === true && config.audience === 'social',
    // Whether the index goes into the runtime context (below); the skill says where to look
    // when it does not.
    injectIndex: config.injectIndex !== false,
  }
```

</details>

**依据 4 · 源码核查**：[adapters/dsh/plugin/index.js:1321-1333](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/adapters/dsh/plugin/index.js#L1321-L1333)

speaker metadata分类不是独立认证。

<details>
<summary>查看原文（13行）</summary>

```text
function speakerOf(source) {
  if (source === null || typeof source !== 'object') return 'other'
  const speaker = source.speaker !== null && typeof source.speaker === 'object' ? source.speaker : undefined
  if (speaker?.role === 'none') return undefined
  if (speaker?.chat !== undefined && speaker.chat !== 'private') return 'other'
  if (speaker?.role === 'owner') return 'owner'
  if (speaker?.role === 'guest') return 'other'
  const kind = source.kind
  if (kind === 'user') {
    return typeof source.rpcId === 'string' && typeof source.clientTimeZone === 'string' &&
      source.principal === undefined ? 'owner' : 'other'
  }
  return typeof kind === 'string' && INERT_PRODUCERS.has(kind) ? undefined : 'other'
```

</details>

**依据 5 · 源码核查**：[adapters/dsh/plugin/index.js:269-295](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/adapters/dsh/plugin/index.js#L269-L295)

required上下文owner分路。

<details>
<summary>查看原文（27行）</summary>

```text
  if (injectIndex || guarded) {
    const index = injectIndex ? indexRecall(settings, sessionCwd) : () => ''
    contexts.push(...guarded ? [{
      name: 'engramory:memory',
      required: true,
      text: (context) => {
        if (roleOf(context?.agent) !== 'owner') return settings.text.strangerNotice
        let shown = ''
        try {
          shown = index(context)
        } catch {
          // an index that cannot be read must not take the companion rules with it
        }
        // In social mode the skill, which every conversation reads, names no path: the
        // user's own conversations learn it here, where no index has shown it yet — a
        // relative pin resolved against this session's directory, as recall resolves it.
        if (settings.social) {
          const stores = storesOf(settings)
          if (stores.pinned !== undefined) stores.pinned = hostPath(sessionCwd(context), stores.pinned)
          // only a project's index shown, or none: the store the skill sends notes to is
          // still to be named
          if (!shown.includes(stores.pinned ?? join(stores.global, stores.indexName))) {
            shown = [shown, settings.text.storeAt(stores)].filter(Boolean).join('\n\n')
          }
        }
        const rules = settings.companion ? settings.text.companion : ''
        return [shown, rules].filter(Boolean).join('\n\n')
```

</details>

**依据 6 · 源码核查**：[adapters/dsh/plugin/index.js:1529-1563](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/adapters/dsh/plugin/index.js#L1529-L1563)

陌生路径目录及异常拒绝。

<details>
<summary>查看原文（35行）</summary>

```text
function refuseStranger(exec, settings, sessionCwd, roleOf) {
  try {
    if (roleOf(exec?.agent) !== 'stranger') return undefined
    const args = exec.arguments !== null && typeof exec.arguments === 'object'
      ? exec.arguments
      : {}
    const named = PATH_ARGS.map((k) => args[k]).filter((v) => typeof v === 'string' && v !== '')
    // The root a tree search really walks, whatever else the call carries: dsh ignores
    // arguments a tool does not declare, so a stray `file_path` is not its root.
    if (TREE_SEARCHES.has(exec.name)) {
      named.push(typeof args.path === 'string' && args.path !== '' ? args.path : '.')
    }
    if (named.length === 0) return undefined
    const cwd = sessionCwd(exec)
    const stores = storeTargets(cwd, settings)
    for (const p of named) {
      // A network or device path can stall a stat for as long as the share takes to
      // time out, on the host's main thread: refused before any I/O.
      if (/^[\\/]{2}/.test(p)) return settings.text.strangerRefusal
      const spelled = hostPath(cwd, p)
      // Resolving walks the path a stat per missing segment: bounded before any I/O.
      if (tooDeep(spelled) || /^[\\/]{2}/.test(spelled)) return settings.text.strangerRefusal
      if (isDirectory(spelled)) return settings.text.strangerRefusal
      const written = foldPath(spelled)
      const target = osKey(spelled)
      if (namesStore(written) || namesStore(target)) return settings.text.strangerRefusal
      if (stores.some((dir) => under(target, dir) || under(written, dir))) {
        return settings.text.strangerRefusal
      }
    }
    return undefined
  } catch {
    // Reached for a stranger's call, or one whose session could not even be read.
    return settings.text.strangerRefusal
  }
```

</details>

**依据 7 · 作者声明**：[adapters/dsh/plugin/README.md:48-54](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/adapters/dsh/plugin/README.md#L48-L54)

作者明确非安全边界和自定义Skill外泄范围。

```text
## 社交模式

大肥鱼模式里的一个选项，给别人也能聊的角色用，比如通过接入插件接到 QQ、微信、抖音、B 站的角色。在设置页「记忆权限」选「社交」，或写 `audience: social`。只有你自己跟这个 dsh 聊，就保持默认的「专属」。

打开后，**只有你本人的会话拿得到记忆**：你在 dsh 自己的窗口（桌面版或 `dsh web`）里亲手发过消息、且没有别人说过话的会话才算你的。子 agent 跟着它的父会话算。接入插件转来的消息（标明是主人的除外，见下文）、`dsh headless`、外部程序、终端和编辑器客户端发的都算别人的；一个会话只要有别人说过话，就一直算别人的，之前已经带进去的记忆仍留在对话记录里。

别人的会话拿不到索引，也不知道记忆库在哪；dsh 的文件工具只能指名文件（任何目录都不让列），指向记忆库的路径不管怎么写都拒绝。这**不是**安全边界：shell 工具照样能读任何文件，同一账户下的另一个 profile 也读得到。要真正隔离，得靠文件权限或沙箱。自定义的 `skill`（见[配置](#配置)）会原样给所有会话，别人的也一样，里面写了库在哪，别人也看得到。
```

**依据 8 · 源码核查**：[adapters/dsh/plugin/index.js:615-675](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/adapters/dsh/plugin/index.js#L615-L675)

memory listing/open超时、busy和底层继续。

<details>
<summary>查看原文（61行）</summary>

```text
function memoryRoute(settings, desk) {
  // A listing stuck on a drive that never answers stays the listing — pages are told it
  // timed out until it settles — rather than each retry holding one more thread.
  let listing
  const list = () => {
    listing ??= listStores(settings, desk.workspaceRegistry).finally(() => { listing = undefined })
    return listing
  }
  // One lookup for opening at a time too: a click while one runs is told to wait, rather
  // than queued behind a lookup that may never finish.
  let looking = false
  const read = async () => {
    const found = await deadline(list(), LIST_MS)
    if (found === TIMED_OUT) return json(503, { error: 'timeout' })
    return json(200, { ...found, canOpen: canOpen(desk.sessionController) })
  }
  const open = async (request) => {
    let body
    try {
      body = await request.json()
    } catch {
      return json(400, { ok: false, error: 'invalid', field: 'body' })
    }
    const field = body === null || typeof body !== 'object' ? 'body'
      : typeof body.store !== 'string' ? 'store'
        : body.file !== undefined && typeof body.file !== 'string' ? 'file'
          : body.archive !== undefined && typeof body.archive !== 'boolean' ? 'archive'
            : undefined
    if (field !== undefined) return json(400, { ok: false, error: 'invalid', field })
    const opener = desk.sessionController
    if (!canOpen(opener)) return json(409, { ok: false, error: 'unavailable' })
    if (looking) return json(409, { ok: false, error: 'busy' })
    looking = true
    const lookup = targetOf(settings, desk.workspaceRegistry, body).finally(() => { looking = false })
    const target = await deadline(lookup, LIST_MS)
    if (target === TIMED_OUT) return json(503, { ok: false, error: 'timeout' })
    if (target === undefined) return json(404, { ok: false, error: 'missing' })
    const abort = new AbortController()
    const timer = setTimeout(() => abort.abort(), OPEN_MS)
    try {
      await opener.openWorkspacePath(target, abort.signal)
      return json(200, { ok: true })
    } catch (error) {
      return json(502, { ok: false, error: 'failed', message: String(error?.message ?? error) })
    } finally {
      clearTimeout(timer)
    }
  }
  return {
    path: MEMORY_ROUTE,
    methods: ['GET', 'POST'],
    requestBody: 'buffered',
    fetch: (request) => (request.method === 'POST' ? open(request) : read()),
  }
}

/** `promise`, or TIMED_OUT once `ms` have passed; the work itself goes on. */
function deadline(promise, ms) {
  let timer
  const late = new Promise((resolve) => { timer = setTimeout(resolve, ms, TIMED_OUT) })
  return Promise.race([promise, late]).finally(() => clearTimeout(timer))
```

</details>

**依据 9 · 源码核查**：[adapters/dsh/plugin/index.js:449-474](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/adapters/dsh/plugin/index.js#L449-L474)

revision/表达式/覆盖配置错误。

<details>
<summary>查看原文（26行）</summary>

```text
    const next = parseSettings(body)
    if (typeof next === 'string') return json(400, { ok: false, error: 'invalid', field: next })
    const editor = ctx.get('configEditor')
    const entry = ownEntry(editor, fiber)
    if (entry === undefined) return json(409, { ok: false, error: 'unavailable' })
    if (!plainSettings(entry.options?.config)) return json(409, { ok: false, error: 'expression' })
    const stale = new Error('stale')
    const expression = new Error('expression')
    try {
      await editor.edit(entry, (current, inherited) => {
        // The editor reads the profile afresh: a `!!js` value written there since the
        // check above reads as a default, and the revision alone would not notice.
        if (!plainSettings(current)) throw expression
        if (revisionOf(editableSettings(current)) !== body.revision) throw stale
        return withSettings(current, next, inherited)
      })
    } catch (error) {
      if (error === stale) return json(409, { ok: false, error: 'stale' })
      if (error === expression) return json(409, { ok: false, error: 'expression' })
      const message = String(error?.message ?? error)
      // dsh refuses a value a home patch or a command-line overlay would override anyway.
      const overridden = /overridden/i.test(message)
      return json(overridden ? 409 : 500,
        { ok: false, error: overridden ? 'overridden' : 'failed', message })
    }
    return json(200, { ok: true })
```

</details>

**依据 10 · 作者声明**：[README.md:116-133](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/README.md#L116-L133)

卸载不删库、明文和隐私纪律。

<details>
<summary>查看原文（18行）</summary>

````text
## 卸载

dsh 插件：`dsh plugin --profile <名字> remove dsh-engramory`。用安装脚本装的，用安装时的宿主和路径再跑一次，加 `--uninstall`（先加 `--dry-run` 看计划）：

```sh
python tools/engramory_init.py codex --uninstall
```

只删安装器自己的东西：规则块、skill 副本、Codex hook。**记忆库永远不删**，真想清空请自己删。

## 安全与隐私

记忆库是**未加密的明文**，本机进程都能读；`.gitignore` 只管 git，云同步、备份照样会复制它。

- **永远不存密码、key、token、cookie 的值**，只记它们在哪（密码管理器、环境变量名）。
- 手机号、邮箱、地址这类个人信息少存，尽量只记指针。

没有自动扫描，全靠纪律。见 [SKILL.md](SKILL.md) §5/§8 和 [SECURITY.md](SECURITY.md)。
````

</details>

#### 缺口

- 固定DSH版本注入/guard和settings/client实际兼容未运行。
  **影响**：不能把兼容清单或测试存在当宿主通过。
  **进一步探讨**：用固定宿主复制库验证新会话、cwd切换、无pin误拦、局部不可读和卸载回退。
- 社交身份投影、继承子Agent及其他工具全通道权限未全量验收。
  **影响**：不推荐以social保护多用户私密资料。
  **进一步探讨**：如需共享先用OS权限/隔离与独立profile，再做owner/guest/混合历史/工具绕过矩阵。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 预算cap能否提高记忆效果，下一项可证伪假设是什么？

**研究主题**：新假设与验证

#### 完整回答

cap可证明控制部分写通道的索引尺寸，不能证明相关性、事实新鲜或模型一定打开正确笔记。少加载一部分索引也可能恰好截掉关键指针；根格式没有强制来源、可信度和过期字段，用户须把回忆当可过期背景。源码与作者测试不等本轮运行，社交模式更不能提升记忆真伪。

从Q02截断与“已超限仍允许收缩”推导未实现假设：压缩前后保存指针集合差异并提醒“哪些仍活跃事实将失去入口”，可能比仅给行/字节数字更少丢关键回忆。相对现有capRefusal的泛化压缩建议，增量是可核的指针损失说明，不自动判断事实正确。最小试验在含关键/过期/重复笔记的小库做多轮压缩，对照只有cap与集合diff提示，计关键问题回忆命中、误保留、token和人工整理时间；若关键命中不增或额外整理成本抵消，则否定。尚未实现不计当前贡献。

#### 证据与依据

**依据 1 · 源码核查**：[adapters/dsh/plugin/index.js:2201-2208](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/adapters/dsh/plugin/index.js#L2201-L2208)

现拒绝只给尺寸与压缩建议，为假设起点。

```text
function capRefusal(over, filePath, settings) {
  return (
    `This write would put ${basename(filePath)} over the Engramory index cap ` +
    `(${over.join(', ')}). The index is loaded every session and the host only reads ` +
    `so far, so anything past the cap stops being recalled. Compact before ` +
    `writing: move detail into the linked note files, merge duplicates, archive cold ` +
    `notes, and keep every line to "one short hook + link". A write that SHRINKS the ` +
    `index always passes, so you can compact step by step.` + notMyIndexHint(settings)
```

**依据 2 · 源码核查**：[adapters/dsh/plugin/index.js:1839-1876](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/adapters/dsh/plugin/index.js#L1839-L1876)

注入有界头部，cap/读失败影响可见内容。

<details>
<summary>查看原文（38行）</summary>

```text
  const readUpTo = Math.min(settings.maxBytes, settings.readLimit)
  return (context) => {
    const cwd = sessionCwd(context) ?? process.cwd()
    const { labels } = settings.text
    // A session directory on another machine is not looked into (remotePath), as the
    // memory page does not: neither its project store nor a pin that lands under it. A
    // store the user placed there by name — an absolute pin, $DSH_HOME — still is.
    const remote = remotePath(cwd)
    const pinned = settings.indexPath === undefined ? undefined : hostPath(cwd, settings.indexPath)
    const candidates = pinned !== undefined
      ? (remote && !qualified(settings.indexPath) && remotePath(pinned)
          ? []
          : [{ label: labels.pinned, path: pinned }])
      : [remote ? undefined : projectStore(cwd, settings.indexName, projects, labels.project),
          { label: labels.user, path: join(dshHome(), STORE_DIR, settings.indexName) }]
    const seen = new Set()
    const parts = []
    for (const store of candidates) {
      if (store === undefined) continue
      let stat
      try {
        stat = statSync(store.path, { bigint: true }) // exact 64-bit file ids on Windows
      } catch {
        continue // no store there
      }
      if (!stat.isFile()) continue
      const identity = stat.ino ? `${stat.dev}:${stat.ino}` : pathKey(store.path)
      if (seen.has(identity)) continue // the same file under both names
      const key = `${store.label}\0${store.path}`
      const stamp = `${identity}:${stat.size}:${stat.mtimeNs}:${stat.ctimeNs}`
      let entry = shown.get(key)
      if (entry === undefined || entry.stamp !== stamp || Date.now() - entry.at >= RECHECK_MS) {
        // A project store is re-checked whenever it is re-read: what is behind a path
        // can change with it.
        if (store.root !== undefined && !projectIndex(store.path, store.root)) continue
        const current = readIndex(store.path, readUpTo, true)
        if (current === undefined) continue // unreadable just now: try again next step
        entry = { stamp, at: Date.now(), text: renderIndex(store.label, store.path, current, settings) }
```

</details>

**依据 3 · 作者声明**：[README.md:149-155](https://github.com/tinqiao-oss/engramory/blob/f346ee2facd39720289101a594ec77ffdce9b366/README.md#L149-L155)

作者承认无来源/过期和个人规模限制。

```text
## 已知局限

- **只有 dsh 和 Claude Code 有写前拒绝**，而且 shell、MCP 文件工具、外部编辑器都能绕过。其他宿主只靠规则，尽力而为；各宿主的情况以 [PORTING.md](PORTING.md) 为准。
- **整理靠模型自觉遵守规则**，不是强制的。
- **没有来源、可信度、过期字段。** 回忆到的内容只供参考，可能被人为影响（[SKILL.md](SKILL.md) §4）。
- **没有项目 ID。** 多个项目共用一个库时，笔记名可能撞、内容可能串。
- **一个库只能有一个写入者**，见[单写者、多读者](adapters/reader/README.md)。
```

#### 缺口

- 指针损失提示是否改善回忆／整理未试验。
  **影响**：只是未来可证伪方向。
  **进一步探讨**：小库多轮压缩对照关键命中与总投入，无改善则放弃。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
