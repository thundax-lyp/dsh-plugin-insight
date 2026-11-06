# dsh-ads

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[856b123](https://github.com/Nagi-ovo/dsh-ads/tree/856b123090e87ed023033894d9734ffe3142cc7c)

<!-- BEGIN META -->
[![GitHub ★ 712](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=712&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Nagi-ovo/dsh-ads) [![npm 30d 2,170](https://img.shields.io/static/v1?label=npm+30d&message=2%2C170&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@nagi-ovo/dsh-ads) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@nagi-ovo/dsh-ads)
<!-- END META -->

> **功能**：为 DSH Web 添加双语虚构广告、推理展示门禁、抽奖动画和社区插件轮播。

> **亮点**：[Q01](#research-q01)与[Q03](#research-q03)表明实际增量是将双语恶搞素材、会话稳定轮换和社区插件发现整合为可控制的界面体验。GitHub搜索、React插槽、缓存和浏览器存储是通用底座；没有依据声称原创推荐算法、可兑现奖品或生产增效。

> **主要限制**：[Q02](#research-q02)所示显示门禁会隐藏仍在进行的工具与回答，最影响价值的前提是用户能辨别这种娱乐表现与真实执行状态。默认全开与窄关闭热区增加主动退出负担，不能用一次关闭保证刷新后仍无广告，见[Q04](#research-q04)。

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
  - [Q01 · 何种人群需要这种广告体验，和静态主题相比多了什么？](#detail-section-11)
  - [Q02 · 推理广告是否停止模型，如何恢复内容展示？](#detail-section-12)
  - [Q03 · 推荐位和 Star 验证如何取数，有哪些身份与外部依赖？](#detail-section-13)
  - [Q04 · 用户如何控制和退出，成本与合格体验如何判断？](#detail-section-14)
  - [Q05 · 哪项设计可以借鉴，能推导什么可证伪假设？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向自愿体验复古广告恶搞的 DSH Web 用户，合格结果是能辨别虚构内容、访问真实仓库且自行结束干扰；没有生产效率承诺。

与静态主题相比增加轮次交互、可撤销显示锁及真实插件发现入口；与直接浏览 GitHub topic 相比把候选放入会话，但没有质量评估或效果保证，见 [Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 双语广告浮层 | 体验门户网站式恶搞 | 仅Web，含假病毒和虚构承诺 |
| 对话轮次推荐 | 在会话内发现公开插件仓库 | topic与快照不是质量推荐 |
| 推理展示门禁与抽奖 | 以暂时隐藏输出制造娱乐互动 | 不停止后台模型或工具，可Esc退出 |
| 广告设置与本次关闭 | 控制广告位、声音和当前页展示 | 单项持久；本次关闭刷新后恢复 |
| 目录与Star查询路由 | 为真实仓库素材和恶搞反馈取数 | Star绑定宿主账户或输入用户名，不是访问者认证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH Web、slots、locale 和 React | 启动显示必需 | 挂载输入区、对话尾部与设置 | TUI与无浏览器界面不能显示；声明兼容版本未实测 |
| 宿主 webServer | 动态功能必需 | 提供目录和Star查询 | 浏览器目录请求失败时只剩内置素材 |
| GitHub API、可选gh或token | 实时发现必需 | 搜索公开topic与查询宿主Star | 目录退到内嵌快照，Star结果可能不可得 |
| 浏览器localStorage | 跨刷新偏好必需 | 保存开关和曝光账本 | 不可写时只保留当前页内存 |
| 用户理解虚构承诺且允许干扰 | 娱乐价值必需 | 区分恶搞、任务状态与真实权益 | 不宜进入重要工作会话 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户按README将包加入Web profile并重启刷新 | 设置出现广告非官方栏目；没有则核对profile和版本 |
| 加载 | 宿主取目录，客户端挂载插槽 | 真实候选或快照进入素材池；GitHub失败不应当作完整覆盖 |
| 体验 | 用户观察广告并识别虚构，按需关闭reward与声音 | 模型仍运行，不能把隐藏当执行暂停 |
| 验收退出 | 用户用Esc、继续对话或单项开关恢复显示 | 核对内容可见；全部关闭刷新会恢复，长期退出需逐项关闭或卸载 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主、包与媒体下载资源，金额未知 | 装包、重启和识别控制入口，耗时未知 | 未验证实际安装兼容 |
| 持续使用 | 浏览器动画与GitHub查询；模型后台费用照常 | 屏幕、声音和注意力负担未量化 | 没有合格体验成本对照 |
| 失败恢复 | 重载与排障资源未知 | 核对隐藏内容恢复、关闭各位或卸载 | 退出不撤销后台已发生的动作 |
| 退出 | 清理浏览器偏好或卸载的资源未知 | 区分本次关闭和永久单项开关 | 未量化升级和退出耗时 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 互动娱乐 | 源码有多广告位、双语切换和抽奖展示 | 用户是否愉悦及愿意持续保留 |
| 社区插件发现 | topic搜索、快照和真实仓库链接 | 有效发现率、质量及完整生态覆盖 |
| 进度观测 | 源码只隐藏输出并提供释放 | 用户是否误认暂停及实际兼容表现 |

> **思考**：[Q02](#research-q02)所示显示门禁会隐藏仍在进行的工具与回答，最影响价值的前提是用户能辨别这种娱乐表现与真实执行状态。默认全开与窄关闭热区增加主动退出负担，不能用一次关闭保证刷新后仍无广告，见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)与[Q03](#research-q03)表明实际增量是将双语恶搞素材、会话稳定轮换和社区插件发现整合为可控制的界面体验。GitHub搜索、React插槽、缓存和浏览器存储是通用底座；没有依据声称原创推荐算法、可兑现奖品或生产增效。

[Q03](#research-q03)、[Q05](#research-q05)的目录并发合并、来源退路、轮次稳定分配与成对DOM撤销可借鉴。它们依赖宿主生命周期和DOM标记，不保证跨版本兼容；Star检查是娱乐反馈而非认证，快照候选不能冒充实时质量推荐。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02)所示显示门禁会隐藏仍在进行的工具与回答，最影响价值的前提是用户能辨别这种娱乐表现与真实执行状态。默认全开与窄关闭热区增加主动退出负担，不能用一次关闭保证刷新后仍无广告，见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先确认自己需要的是娱乐体验，选择无重要后台操作的会话。到“广告（非官方）”设置先关闭推理激励广告和声音，再决定保留哪些位置；如果希望刷新后继续关闭，要改各位开关，而非只按“立刻关闭所有广告”。看到内容被遮挡时用Esc或继续对话，核对后台结果；持续困扰则卸载。当前只建议关注设计，不作为生产工作默认配置，见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献限于源码可见的娱乐编排和发现入口组合；真实需求、持续体验和发现效果未证实。主动发现面板仅为未验证设计假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、src/index.ts、src/catalog.ts、src/star-host.ts、src/client/index.tsx、src/client/InferenceRewardGate.tsx、src/client/registry.ts、src/client/feed.ts、src/client/rotation.ts、src/client/settings.ts、src/client/persist.ts、src/client/retire.ts、src/client/AdsSection.tsx、src/client/hitbox.ts、src/client/AdLayer.tsx、src/client/star-check.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查固定提交的入口、包声明、目录获取、Star验证、客户端挂载、显示锁、持久化、轮换、控制和退出；完整inventory为准备入口提供，本次源码抽读不替代全量代码语义审计。
- 下一步：仅检查固定版本源码与作者说明；未运行插件、目标测试、安装、真实宿主或真实GitHub账号查询。娱乐满意度、有效发现及成本无独立实测，不能声称已增效。

**分析版本**

- **仓库**：[Nagi-ovo/dsh-ads](https://github.com/Nagi-ovo/dsh-ads)
- **版本号**：0.1.3（[固定提交 856b123](https://github.com/Nagi-ovo/dsh-ads/tree/856b123090e87ed023033894d9734ffe3142cc7c)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)推导出未验证方向，将相同候选池和本地曝光轮换移到用户主动打开的发现面板，并说明来源和快照时间，以分离插件发现与任务观测。用同候选、同任务对照现有广告、主动面板和直接topic浏览，记录主动有效发现、误点、误认暂停及一周保留。若有效发现不优于直接浏览或关闭干扰后无人保留，就否定生产方向；额外布局与来源提示是新增成本。

仅检查固定版本源码与作者说明；未运行插件、目标测试、安装、真实宿主或真实GitHub账号查询。娱乐满意度、有效发现及成本无独立实测，不能声称已增效。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 320 | — | — | 3185 |
| .js | source | 2 | 7867 | 6357 | 1925 | — |
| .mjs | source | 4 | 652 | 461 | 120 | — |
| .ts | source | 26 | 4950 | 3441 | 1487 | — |
| .tsx | source | 13 | 3791 | 2739 | 877 | — |
| .ts | test | 13 | 1039 | 770 | 130 | — |
| .tsx | test | 4 | 1168 | 911 | 154 | — |

</details>

**活跃度**

[![Issue 未关闭 14](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=14&color=737b86&logo=github)](https://github.com/Nagi-ovo/dsh-ads/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Nagi-ovo/dsh-ads/issues?q=is%3Aissue+created%3A2026-10-07T02%3A09%3A31.809Z..2026-11-06T02%3A09%3A31.809Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Nagi-ovo/dsh-ads/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T02%3A09%3A31.809Z..2026-11-06T02%3A09%3A31.809Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断虚构广告、推理展示门禁及社区插件发现对自愿娱乐体验的贡献与采用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 何种人群需要这种广告体验，和静态主题相比多了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

dsh-ads 面向自愿体验复古互联网恶搞的 DSH Web 用户，作者把它明确定位为娱乐。合格体验应当是用户知道广告、病毒和中奖承诺是虚构的，能够打开真实社区插件仓库，并能结束干扰；它不以更快完成模型任务为成功标准。相对只替换颜色或背景的静态主题，客户端将广告层挂在输入区生命周期，将另一种广告放入对话轮次尾部，并另设广告设置页，因此有随会话、轮次和语言变化的交互体验。

社区插件展示的增量是把发现入口带进会话，而不是要求用户离开会话浏览 GitHub topic。页面加载共享一次目录请求，侧栏按中文8项或英文3项分配；信息流将内置素材与社区候选分流，再依据本机曝光账本和轮次身份稳定分配。这能解释为什么重渲染不会不断换广告，但不是个性化、质量筛选或使用效果推荐。GitHub 检索、React 插槽和浏览器存储是继承的通用能力，本组件的贡献在其组合与娱乐编排。

反例是想专注完成编码或研究任务的人，他们原本没有广告干扰问题，增加弹窗、声音和展示门禁可能只增加负担。README 的图片与作者叙述不能证明持续娱乐需求或插件发现转化；现有材料支持一次娱乐体验的可能价值，不能支持生产效率或商业投放价值。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:14-26](https://github.com/Nagi-ovo/dsh-ads/blob/856b123090e87ed023033894d9734ffe3142cc7c/README.md#L14-L26)

作者说明虚构广告、后台推理与双语恶搞定位。

<details>
<summary>查看原文（13行）</summary>

```text
  <strong>把 DeepSeek Harness 变成 2005 年门户网站。连 inference 都逃不过广告。</strong><br>
  广告是假的，插件是真的，抽到 V4 Pro 的希望也是真的渺茫。
</p>

![中文模式实机：两侧广告栏、对话内插件推荐、贪玩蓝鲸和 DSH 消息中心](assets/screenshot.webp)

`dsh-ads` 会在侧栏、对话、推理中途和右下角塞入一整套虚构广告。它看起来会暂停 inference，实际上模型一直在后台工作，只是后续回答和工具调用要等广告结束才显示。

插件不会只拿自己开涮。GitHub 上带 [`dsh-plugin`](https://github.com/topics/dsh-plugin) topic、且最近两周更新过的公开插件会进入推荐位，点击广告就能打开真实仓库。仓库换到个人账号或其他组织后仍能被发现。

## 两套互联网垃圾美学

切换 DSH 的「设置 → 语言」，当前页面会立即更换整套素材、文案和交互，不用刷新。中文模式主打页游、财神和「这次一定」，两张贪玩蓝鲸海报每 20 秒自动切换；English mode 则是 fake antivirus、weird tricks 和 actual gameplay*。
```

</details>

**依据 2 · 源码核查**：[src/client/index.tsx:202-225](https://github.com/Nagi-ovo/dsh-ads/blob/856b123090e87ed023033894d9734ffe3142cc7c/src/client/index.tsx#L202-L225)

三个真实插槽注册区分浮层、设置与对话尾部，支持动态界面而非静态主题判断。

<details>
<summary>查看原文（24行）</summary>

```text
export function apply(ctx: ClientContext): void {
  const locale = (): AdLocale => adLocale(ctx.locale.getSnapshot().active)
  ctx.slots.inject('conversation.input.dock', () => ctx.slots.register(
    { name: 'conversation.input.dock', id: 'dsh-ads-layer', order: 90, inject: () => ({ hooks: { locale: ctx.locale } }) },
    AdDockEntry,
  ))
  // A page of its own in the host's settings dialog, beside 通用设置 and 模型.
  // The poster's ⚙ is part of the joke, but it is the wrong place to *find*
  // settings — and it vanishes the moment the poster is switched off.
  ctx.slots.inject('settings.section', () => ctx.slots.register(
    // Labelled as third-party in the nav itself: this page sits between two
    // first-party ones, and a settings entry that reads as official is the one
    // place this plugin's joke would stop being obviously a joke.
    {
      name: 'settings.section',
      id: 'dsh-ads',
      order: 90,
      label: () => locale() === 'en' ? 'Ads (Unofficial)' : '广告（非官方）',
      inject: () => ({ hooks: { locale: ctx.locale } }),
    },
    AdsSectionEntry,
  ))
  ctx.slots.inject('conversation.chat.turnTail', () => ctx.slots.register(turnTailOptions(ctx), InlineAdEntry))
}
```

</details>

**依据 3 · 源码核查**：[src/client/registry.ts:103-131](https://github.com/Nagi-ovo/dsh-ads/blob/856b123090e87ed023033894d9734ffe3142cc7c/src/client/registry.ts#L103-L131)

会话级取数、语言预算与轮换实际接线。

<details>
<summary>查看原文（29行）</summary>

```text
export function useSponsoredAds(sessionId: string | undefined, locale: AdLocale = 'zh'): readonly AdCreative[] {
  const [plugins, setPlugins] = useState<readonly SponsoredPlugin[]>([])
  useEffect(() => {
    let mounted = true
    pending ??= fetchPlugins()
    void pending.then((list) => {
      // The feed takes the whole list; the gutters take the locale-specific
      // subset below. One fetch, two placements with different capacities.
      setFeedPlugins(list)
      if (mounted) setPlugins(list)
    })
    return () => { mounted = false }
  }, [])

  const sponsorCount = gutterSponsorCount(locale)
  const chosen = useMemo(
    () => rotate(plugins, readLedger(), sponsorCount, sessionId ?? ''),
    [plugins, sessionId, sponsorCount],
  )

  // Counted once per rotation, not once per render: the ledger is what decides
  // who gets shown next, and inflating it on re-render would quietly rotate
  // whoever happens to be on a busy screen out of the pool.
  useEffect(() => {
    if (chosen.length === 0) return
    writeLedger(recordSeen(readLedger(), chosen))
  }, [chosen])

  return useMemo(() => chosen.map((plugin, index) => creativeFor(plugin, index, locale)), [chosen, locale])
```

</details>

**依据 4 · 源码核查**：[src/client/feed.ts:95-114](https://github.com/Nagi-ovo/dsh-ads/blob/856b123090e87ed023033894d9734ffe3142cc7c/src/client/feed.ts#L95-L114)

轮次赋值缓存与内置/社区分流构成稳定曝光机制。

<details>
<summary>查看原文（20行）</summary>

```text
export function feedAd(key: string, builtins: readonly AdCreative[], locale: AdLocale = 'zh'): AdCreative | undefined {
  const assignmentKey = `${locale}:${key}`
  const already = assigned.get(assignmentKey)
  if (already !== undefined) return already
  const house = houseCandidates(builtins)
  const hub = hubCandidates(locale)
  const wantsHouse = hashString(key) % 2 === 0
  // Either half standing empty — no hub yet, or a host shipping no artwork —
  // hands its slots to the other rather than leaving the turn blank.
  const preferred = wantsHouse ? house : hub
  const candidates = preferred.length > 0 ? preferred : (wantsHouse ? hub : house)
  // Salted with the turn key, not the session: consecutive turns are almost
  // always tied on impressions, and a per-session salt would break every one of
  // those ties the same way and repeat one plugin down the whole transcript.
  const [chosen] = rotate(candidates, readLedger(), 1, key)
  if (chosen === undefined) return undefined
  writeLedger(recordSeen(readLedger(), [chosen]))
  const creative = chosen.draw()
  assigned.set(assignmentKey, creative)
  return creative
```

</details>

#### 缺口

- 没有独立用户的重复娱乐需求和有效插件发现记录。
  **影响**：不能认定值得长期保留，曝光也不能当采用转化。
  **进一步探讨**：征集自愿用户记录重复开启、主动打开真实仓库及主动关闭行为，区分误点。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 推理广告是否停止模型，如何恢复内容展示？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

推理广告限制的是可见内容，不是模型执行。streamingRow 查找仍带流式标记的 Assistant 行；候选满足轮次调度且延迟后仍在流式输出时，在该行后插入广告容器。concealTail 保存原行的内联高度和溢出样式，将当前高度设为上限，并把后续带对话键的行设为不可见。这里没有停止模型、撤回工具调用或暂停宿主任务的接口。用户即使看不到后续工具输出，后台行为也可能继续，不能用“广告中”推断任务已暂停或节省模型费用。

退出按钮和 Esc 都调用 onUnlock 清空目标，React effect 的清理函数断开观察器、恢复原内联样式、恢复隐藏行并移除广告容器。关闭 reward 开关、全局本页退休状态或目标离开 DOM 也会释放显示锁。会话 ID 作为组件键让切换会话重建局部状态。以上是固定源码的接线证据，并非已在真实宿主复现成功。

主要取舍是恶搞效果依赖用户暂时看不到实际进度，可能使工具副作用与用户观测脱节。它不宜用于需及时判断副作用和审批结果的工作。恢复保存旧样式是可借鉴设计，但当宿主更新对话 DOM 属性、并行插槽同时改样式或虚拟列表重排时，兼容性仍需专门验证；本次不能据潜在冲突断言发生了数据丢失。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/InferenceRewardGate.tsx:123-183](https://github.com/Nagi-ovo/dsh-ads/blob/856b123090e87ed023033894d9734ffe3142cc7c/src/client/InferenceRewardGate.tsx#L123-L183)

实际选取流式行、限制高度、隐藏后续行及恢复原样式，全为DOM操作。

<details>
<summary>查看原文（61行）</summary>

```text
function streamingRow(): HTMLElement | undefined {
  const rows = [...document.querySelectorAll<HTMLElement>('[data-chat-flow-kind="assistant-step"]')]
  for (let index = rows.length - 1; index >= 0; index -= 1) {
    const row = rows[index]
    if (row !== undefined && row.querySelector('[data-streaming="true"]') !== null) return row
  }
  return undefined
}

/** Whether `candidate` follows `origin` in transcript order. */
function follows(origin: HTMLElement, candidate: HTMLElement): boolean {
  return (origin.compareDocumentPosition(candidate) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0
}

/**
 * Freeze the visible response and conceal every later transcript row.
 *
 * @param target - active gate target.
 * @param onDetached - reveals the transcript if its active row leaves the DOM.
 * @returns a disposer that restores the exact inline styles it found.
 */
function concealTail(target: GateTarget, onDetached: () => void): () => void {
  const { row, host } = target
  const parent = row.parentElement
  const previousRow = {
    maxHeight: row.style.maxHeight,
    overflow: row.style.overflow,
    overflowX: row.style.overflowX,
    overflowY: row.style.overflowY,
  }
  const hidden = new Map<HTMLElement, string>()
  const height = Math.max(1, row.getBoundingClientRect().height, row.scrollHeight)
  row.style.maxHeight = `${height}px`
  row.style.overflow = 'hidden'
  row.dataset.dshRewardLocked = 'true'

  const hideLaterRows = () => {
    if (!row.isConnected || !host.isConnected) {
      onDetached()
      return
    }
    if (parent === null) return
    for (const candidate of parent.querySelectorAll<HTMLElement>('[data-chat-flow-key]')) {
      if (candidate === row || !follows(row, candidate) || hidden.has(candidate)) continue
      hidden.set(candidate, candidate.style.display)
      candidate.style.display = 'none'
    }
  }
  hideLaterRows()
  const observer = new MutationObserver(hideLaterRows)
  if (parent !== null) observer.observe(parent, { childList: true, subtree: true })

  return () => {
    observer.disconnect()
    row.style.maxHeight = previousRow.maxHeight
    row.style.overflow = previousRow.overflow
    row.style.overflowX = previousRow.overflowX
    row.style.overflowY = previousRow.overflowY
    delete row.dataset.dshRewardLocked
    for (const [candidate, display] of hidden) candidate.style.display = display
    host.remove()
```

</details>

**依据 2 · 源码核查**：[src/client/InferenceRewardGate.tsx:524-617](https://github.com/Nagi-ovo/dsh-ads/blob/856b123090e87ed023033894d9734ffe3142cc7c/src/client/InferenceRewardGate.tsx#L524-L617)

enabled、定时观察、目标清空与effect清理接线，以及session键隔离。

<details>
<summary>查看原文（94行）</summary>

```text
function SessionRewardGate({
  creative,
  sessionId,
  delayMs = REWARD_GATE_DELAY_MS,
  schedule = DEFAULT_REWARD_SCHEDULE,
  locale = 'zh',
}: InferenceRewardGateProps) {
  const [settings] = useAdSettings()
  const retired = useRetired()
  const enabled = settings.reward && !retired
  const [target, setTarget] = useState<GateTarget | undefined>(undefined)
  const [progress, setProgress] = useState(0)
  const evaluatedRows = useRef(new Set<string>())
  const turnNumber = useRef(0)
  const lastOfferedTurn = useRef(0)
  const unlock = useCallback(() => setTarget(undefined), [])
  const collectPrize = useCallback((prize: WheelPrize) => {
    setProgress((current) => prize.label === 'V4 Pro'
      ? REWARD_PROGRESS_TARGET
      : Math.min(REWARD_PROGRESS_TARGET, current + prize.progress))
  }, [])

  useEffect(() => {
    if (enabled || target === undefined) return
    setTarget(undefined)
  }, [enabled, target])

  useEffect(() => {
    if (!enabled || progress >= REWARD_PROGRESS_TARGET || target !== undefined) return
    let candidate: HTMLElement | undefined
    let timer: ReturnType<typeof setTimeout> | undefined
    const scan = () => {
      const next = streamingRow()
      if (next === candidate) return
      candidate = next
      clearTimeout(timer)
      if (next === undefined) return
      const rowKey = next.dataset.chatFlowKey
      if (rowKey === undefined || evaluatedRows.current.has(rowKey)) return
      evaluatedRows.current.add(rowKey)
      turnNumber.current += 1
      const offeredTurn = turnNumber.current
      if (!rewardTurnEligible(sessionId, rowKey, offeredTurn, lastOfferedTurn.current, schedule)) return
      timer = setTimeout(() => {
        if (!next.isConnected || next.querySelector('[data-streaming="true"]') === null) return
        const host = document.createElement('div')
        host.dataset.dshRewardGateHost = 'true'
        next.insertAdjacentElement('afterend', host)
        lastOfferedTurn.current = offeredTurn
        setTarget({ row: next, host, drawSeed: `${sessionId}:${rowKey}` })
      }, delayMs)
    }
    scan()
    const observer = new MutationObserver(scan)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-streaming'],
    })
    return () => {
      observer.disconnect()
      clearTimeout(timer)
    }
  }, [delayMs, enabled, progress, schedule, sessionId, target])

  useEffect(() => {
    if (target === undefined) return
    return concealTail(target, unlock)
  }, [target, unlock])

  if (target === undefined) return null
  return createPortal(
    <RewardCard
      locale={locale}
      creative={creative}
      drawSeed={target.drawSeed}
      progress={progress}
      onPrize={collectPrize}
      onUnlock={unlock}
    />,
    target.host,
  )
}

/**
 * Mount one independently keyed reward state machine for the active session.
 *
 * @param props - creative, session identity, and optional deterministic overrides.
 * @returns the active session's reward gate.
 */
export function InferenceRewardGate(props: InferenceRewardGateProps) {
  return <SessionRewardGate key={props.sessionId} {...props} />
}
```

</details>

**依据 3 · 源码核查**：[src/client/InferenceRewardGate.tsx:274-280](https://github.com/Nagi-ovo/dsh-ads/blob/856b123090e87ed023033894d9734ffe3142cc7c/src/client/InferenceRewardGate.tsx#L274-L280)

Esc 调用释放回调。

```text
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onUnlock()
    }
    addEventListener('keydown', onKeyDown)
    return () => removeEventListener('keydown', onKeyDown)
  }, [onUnlock])
```

**依据 4 · 源码核查**：[src/client/InferenceRewardGate.tsx:502-512](https://github.com/Nagi-ovo/dsh-ads/blob/856b123090e87ed023033894d9734ffe3142cc7c/src/client/InferenceRewardGate.tsx#L502-L512)

明确继续对话按钮和虚构说明，存在无需抽奖的退出入口。

<details>
<summary>查看原文（11行）</summary>

```text
      <button
        type="button"
        onClick={onUnlock}
        style={{ display: 'block', margin: '0 auto 5px', padding: 2, border: 0, background: 'transparent', color: 'rgba(255,255,255,0.78)', fontSize: 11, textDecoration: 'underline', cursor: 'pointer' }}
      >
        {drawn
          ? (locale === 'en' ? 'CONTINUE CHAT' : '继续对话')
          : (locale === 'en' ? 'FORFEIT THIS SPIN AND CONTINUE' : '放弃本轮资格，继续对话')}
      </button>
      <div style={{ marginBottom: 9, textAlign: 'center', fontSize: 9, opacity: 0.56 }}>
        {locale === 'en' ? 'FICTIONAL DEMO · PRESS ESC TO EXIT' : '演示内容纯属虚构，按 Esc 退出'}
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 推荐位和 Star 验证如何取数，有哪些身份与外部依赖？

**研究主题**：依赖、兼容与流程、工程质量与复用

#### 完整回答

Host 注入 webServer，注册目录和 Star 检查两条路由。目录优先调用宿主的 gh，其次用环境 token，再尝试匿名 GitHub API，最后回退仓库中生成的快照；宿主默认缓存30分钟并合并并发请求，浏览器又按整页生命周期共享请求。结果筛掉归档、禁用、fork和无 dsh-plugin topic 的仓库。所谓14天新鲜窗口是以返回列表的最新 push 为锚向前计，而不是当前墙上时间，旧快照离线仍会展示旧时段的候选。代码直接API路径最多10页、每页100项，不构成全生态覆盖保证。

Star 路由优先检查运行宿主 gh 登录账户，失败才用宿主环境 token。成功 starred 在进程内缓存，未命中不缓存；这有利于反复点击时复用，但若多人共享宿主或切换登录账户，不能将宿主账户自动等同当前浏览器访问者。客户端匿名退路使用用户输入的用户名搜索公开 stargazer 列表，最多4页；用户名可以由别人代填，overflow 只表示分页上限，不证明本人已 Star。因此该机制只适合恶搞界面，不是身份认证或权益发放凭据。

客户端依赖 slots 和 locale 服务，UI必须有相应插槽及对话DOM标记；GitHub和凭据只影响动态目录与Star检查，内置广告仍由包提供。源码设计有网络降级，不证明GitHub当前可达。也未核查宿主路由的访问控制，不能从本组件无认证代码断言远程可利用漏洞。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:97-143](https://github.com/Nagi-ovo/dsh-ads/blob/856b123090e87ed023033894d9734ffe3142cc7c/src/index.ts#L97-L143)

目录缓存、并发合并、两个路由，以及成功Star结果的进程缓存。

<details>
<summary>查看原文（47行）</summary>

```text
export function apply(ctx: HostContext, config: Config = {}): void {
  const freshDays = config.freshDays ?? DEFAULT_FRESH_DAYS
  const cacheMs = (config.cacheMinutes ?? DEFAULT_CACHE_MINUTES) * 60_000
  let cache: CacheSlot | undefined
  // Coalesces concurrent requests: several sessions opening at once must not
  // each shell out to `gh`.
  let inflight: Promise<RegistryPayload> | undefined

  const resolve = async (): Promise<RegistryPayload> => {
    const now = Date.now()
    if (cache !== undefined && now - cache.at < cacheMs) return cache.payload
    inflight ??= loadRegistry(now, freshDays, SELF_SLUG)
      .then((payload) => {
        cache = { payload, at: Date.now() }
        return payload
      })
      .finally(() => { inflight = undefined })
    return await inflight
  }

  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: REGISTRY_ROUTE,
    handler: async (_req, res) => { json(res, await resolve()) },
  }))

  // A star, once seen, is remembered for the process; a miss is not, because
  // "star, then press 重新检测" has to see the new state on the next click.
  // Coalescing keeps a click-happy user from stacking `gh` invocations.
  let starSeen: StarCheckPayload | undefined
  let starInflight: Promise<StarCheckPayload> | undefined
  const resolveStar = async (): Promise<StarCheckPayload> => {
    if (starSeen !== undefined) return starSeen
    starInflight ??= checkHostStarred(SELF_SLUG)
      .then((payload) => {
        if (payload.verdict === 'starred') starSeen = payload
        return payload
      })
      .finally(() => { starInflight = undefined })
    return await starInflight
  }

  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: STAR_ROUTE,
    handler: async (_req, res) => { json(res, await resolveStar()) },
  }))
```

</details>

**依据 2 · 源码核查**：[src/catalog.ts:117-131](https://github.com/Nagi-ovo/dsh-ads/blob/856b123090e87ed023033894d9734ffe3142cc7c/src/catalog.ts#L117-L131)

新鲜度锚定列表最新push，说明离线快照不是实时14天覆盖。

<details>
<summary>查看原文（15行）</summary>

```text
export function selectFresh(
  plugins: readonly SponsoredPlugin[],
  freshDays: number,
  excludeSlug: string,
): readonly SponsoredPlugin[] {
  const excluded = excludeSlug.toLowerCase()
  const dated = plugins
    .filter((plugin) => plugin.slug.toLowerCase() !== excluded)
    .map((plugin) => ({ plugin, pushed: Date.parse(plugin.pushedAt) }))
    .filter((entry) => Number.isFinite(entry.pushed))
  if (freshDays <= 0) return dated.map((entry) => entry.plugin)
  let newest = -Infinity
  for (const entry of dated) newest = Math.max(newest, entry.pushed)
  const floor = newest - freshDays * 86_400_000
  return dated.filter((entry) => entry.pushed >= floor).map((entry) => entry.plugin)
```

</details>

**依据 3 · 源码核查**：[src/catalog.ts:159-184](https://github.com/Nagi-ovo/dsh-ads/blob/856b123090e87ed023033894d9734ffe3142cc7c/src/catalog.ts#L159-L184)

直接API最多十页和每次20秒超时。

<details>
<summary>查看原文（26行）</summary>

```text
async function readViaGitHub(token: string): Promise<string> {
  const pages: unknown[] = []
  for (let page = 1; page <= MAX_SEARCH_PAGES; page += 1) {
    const url = new URL('https://api.github.com/search/repositories')
    url.searchParams.set('q', SEARCH_QUERY)
    url.searchParams.set('sort', 'updated')
    url.searchParams.set('order', 'desc')
    url.searchParams.set('per_page', String(PAGE_SIZE))
    url.searchParams.set('page', String(page))
    const headers: Record<string, string> = {
      accept: 'application/vnd.github+json',
      'user-agent': 'dsh-ads',
      'x-github-api-version': '2022-11-28',
    }
    if (token !== '') headers.authorization = `Bearer ${token}`
    const response = await fetch(url, { headers, signal: AbortSignal.timeout(20_000) })
    if (!response.ok) throw new Error(`GitHub responded ${response.status}`)
    const body: unknown = await response.json()
    pages.push(body)
    if (typeof body !== 'object' || body === null) throw new Error('GitHub returned a non-object search page')
    const searchPage = body as GitHubSearchPage
    if (!Array.isArray(searchPage.items)) throw new Error('GitHub returned no search items')
    const total = typeof searchPage.total_count === 'number' ? searchPage.total_count : searchPage.items.length
    if (page * PAGE_SIZE >= total || searchPage.items.length < PAGE_SIZE) break
  }
  return JSON.stringify(pages)
```

</details>

**依据 4 · 源码核查**：[src/catalog.ts:197-229](https://github.com/Nagi-ovo/dsh-ads/blob/856b123090e87ed023033894d9734ffe3142cc7c/src/catalog.ts#L197-L229)

gh、token、匿名及快照退路。

<details>
<summary>查看原文（33行）</summary>

```text
export async function loadRegistry(
  nowMs: number,
  freshDays: number,
  excludeSlug: string,
): Promise<RegistryPayload> {
  const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN ?? ''
  const attempts: readonly { source: RegistryPayload['source']; read: () => Promise<string> }[] = [
    { source: 'gh-cli', read: readViaGh },
    ...(token === '' ? [] : [{ source: 'github-token' as const, read: () => readViaGitHub(token) }]),
    { source: 'github-public', read: () => readViaGitHub('') },
  ]
  for (const attempt of attempts) {
    try {
      const plugins = parseSearchResults(await attempt.read())
      if (plugins.length === 0) continue
      return {
        generated: new Date(nowMs).toISOString(),
        source: attempt.source,
        freshDays,
        plugins: selectFresh(plugins, freshDays, excludeSlug),
      }
    } catch {
      // Swallow one failed discovery channel and continue to the next. Missing
      // credentials, API rate limits, and offline hosts must not break an ad.
      continue
    }
  }
  return {
    generated: new Date(nowMs).toISOString(),
    source: 'snapshot',
    freshDays,
    plugins: selectFresh(CATALOG_SNAPSHOT, freshDays, excludeSlug),
  }
```

</details>

**依据 5 · 源码核查**：[src/star-host.ts:89-98](https://github.com/Nagi-ovo/dsh-ads/blob/856b123090e87ed023033894d9734ffe3142cc7c/src/star-host.ts#L89-L98)

宿主gh和环境token的实际优先级。

<details>
<summary>查看原文（10行）</summary>

```text
export async function checkHostStarred(repo: string): Promise<StarCheckPayload> {
  const gh = await viaGh(repo)
  if (gh !== 'unavailable') return { verdict: gh }
  const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN ?? ''
  if (token !== '') {
    const viaApi = await viaToken(repo, token)
    if (viaApi !== 'unavailable') return { verdict: viaApi }
  }
  return { verdict: 'unavailable' }
}
```

</details>

**依据 6 · 源码核查**：[src/client/star-check.ts:100-121](https://github.com/Nagi-ovo/dsh-ads/blob/856b123090e87ed023033894d9734ffe3142cc7c/src/client/star-check.ts#L100-L121)

输入用户名、最多四页与overflow只证明搜索上限。

<details>
<summary>查看原文（22行）</summary>

```text
export async function checkStarred(repo: string, username: string): Promise<StarVerdict> {
  const wanted = username.trim().toLowerCase()
  if (wanted === '') return 'absent'
  try {
    for (let page = 1; page <= MAX_PAGES; page += 1) {
      const response = await fetch(
        `${API_BASE}/repos/${repo}/stargazers?per_page=${PER_PAGE}&page=${page}`,
        { headers: { Accept: 'application/vnd.github+json' } },
      )
      if (response.status === 404) return 'missing'
      if (!response.ok) return 'error'
      // Wire boundary: a rate-limited or proxied answer can be a bare object
      // instead of an array, in which case `.some` throws into the catch below.
      const stargazers = (await response.json()) as readonly { readonly login?: string }[]
      if (stargazers.some((user) => user.login?.toLowerCase() === wanted)) return 'starred'
      if (stargazers.length < PER_PAGE) return 'absent'
    }
    return 'overflow'
  } catch {
    // Swallowed: offline, CORS and malformed-payload failures all mean the
    // same thing to the caller — the check could not run, nothing is known.
    return 'error'
```

</details>

**依据 7 · 源码核查**：[package.json:44-59](https://github.com/Nagi-ovo/dsh-ads/blob/856b123090e87ed023033894d9734ffe3142cc7c/package.json#L44-L59)

Web平台、locale注入与peer版本声明。

<details>
<summary>查看原文（16行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-locale"
      ],
      "platform": "web"
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-client-locale": "^0.1.0-rc.6 || ^0.2.0-rc.1 || ^0.2.1-0",
    "@deepseek-ai/schemastery": "^3.18.1",
    "react": "^18.2.0"
```

</details>

#### 缺口

- 真实宿主的路由权限、共享账户部署方式及当前版本兼容未独立核实。
  **影响**：Star结果不能用于访问者身份或商业权益判断，无法据此批准长期部署。
  **进一步探讨**：在明确单用户/多用户环境查验宿主路由隔离，分别记录宿主账号和访问者身份，避免用Star做认证。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 用户如何控制和退出，成本与合格体验如何判断？

**研究主题**：效果与总成本、采用判断

#### 完整回答

适用前提是用户主动选择娱乐模式，理解“中奖”和“病毒”均为虚构；不建议为了提升工作效率而增加广告。默认7类广告位全开且声音开启，用户需到独立广告设置页逐项关闭不想保留的部分。各位开关通过 localStorage 保存，存储不可写时用内存维持当前页一致性，刷新后可能回到默认。设置页明确“关闭所有广告”仅持续到刷新，想长期清净应关闭各项或卸载，不能把一次关闭当永久禁用。

首次投入是装到 Web profile、重启刷新并学习真实设置入口；持续投入包括媒体渲染、GitHub取数、屏幕占用和注意力，具体资源量与时间没有测量。广告门禁不暂停模型，所以不能推断等待期间免付模型成本。部分关闭按钮的真实点击区域默认只有7像素，误点摩擦是作者有意的娱乐设计，应从设置页退出而非反复追逐叉号。失败恢复应核对内容重新可见，而不是将关闭广告视为撤销后台工具行为。

采用结论为观察。当前有充分源码说明“会出现怎样的干扰”和“如何退出”，却没有持续娱乐需求、无误导体验或有效发现的独立证据。想研究这种设计的人可以在隔离、无重要后台操作的会话中自行体验，但本研究不将其列作优先推荐尝试。若用户误认模型停止、出现无法恢复的遮挡或不愿承担注意力成本，应立即关闭reward及其他广告位，必要时卸载并返回原始界面。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/settings.ts:40-50](https://github.com/Nagi-ovo/dsh-ads/blob/856b123090e87ed023033894d9734ffe3142cc7c/src/client/settings.ts#L40-L50)

默认广告位和声音状态。

<details>
<summary>查看原文（11行）</summary>

```text
/** Everything on, sound on: the plugin is a joke about excess. */
export const DEFAULT_SETTINGS: AdSettings = {
  gutter: true,
  feed: true,
  reward: true,
  popup: true,
  speed: true,
  scare: true,
  poster: true,
  muted: false,
}
```

</details>

**依据 2 · 源码核查**：[src/client/settings.ts:111-114](https://github.com/Nagi-ovo/dsh-ads/blob/856b123090e87ed023033894d9734ffe3142cc7c/src/client/settings.ts#L111-L114)

单项持久设置与默认合并。

```text
export function useAdSettings(): [AdSettings, (next: AdSettings) => void] {
  const [stored, store] = usePersisted<Partial<AdSettings>>(SETTINGS_KEY, DEFAULT_SETTINGS)
  return [{ ...DEFAULT_SETTINGS, ...stored }, store]
}
```

**依据 3 · 源码核查**：[src/client/persist.ts:63-98](https://github.com/Nagi-ovo/dsh-ads/blob/856b123090e87ed023033894d9734ffe3142cc7c/src/client/persist.ts#L63-L98)

localStorage失败保留本页内存状态及同页同步，不证明跨刷新持久。

<details>
<summary>查看原文（36行）</summary>

```text
export function usePersisted<T>(key: string, initial: T): [T, (next: T) => void] {
  const read = useCallback((): T => {
    if (memory.has(key)) return memory.get(key) as T
    try {
      const raw = localStorage.getItem(`dsh-ads:${key}`)
      return raw === null ? initial : (JSON.parse(raw) as T)
    } catch {
      // Swallowed: unavailable or corrupt storage means "no preference yet",
      // which `initial` already expresses.
      return initial
    }
    // `initial` is intentionally not a dependency: re-reading because a caller
    // passed a fresh object literal would clobber the stored value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  const [value, setValue] = useState<T>(read)
  const store = useCallback((next: T) => {
    memory.set(key, next)
    setValue(next)
    try {
      localStorage.setItem(`dsh-ads:${key}`, JSON.stringify(next))
    } catch {
      // Swallowed: the preference stays in memory for this tab, which is the
      // whole of what a failed write costs.
    }
    dispatchEvent(new CustomEvent(CHANGED, { detail: key }))
  }, [key])
  // Follow writes made by other hook instances on the same key.
  useEffect(() => {
    const onChanged = (event: Event) => {
      if ((event as CustomEvent<string>).detail === key) setValue(read())
    }
    addEventListener(CHANGED, onChanged)
    return () => removeEventListener(CHANGED, onChanged)
  }, [key, read])
  return [value, store]
```

</details>

**依据 4 · 源码核查**：[src/client/AdsSection.tsx:225-247](https://github.com/Nagi-ovo/dsh-ads/blob/856b123090e87ed023033894d9734ffe3142cc7c/src/client/AdsSection.tsx#L225-L247)

本次关闭明确刷新恢复，彻底移除需卸载。

<details>
<summary>查看原文（23行）</summary>

```text
      {/* An action, not a switch, and visibly separated from them: it lasts
          until the page is reloaded rather than being remembered, and sitting
          it among the switches would read as a setting that forgets itself. */}
      <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid rgba(128, 128, 128, 0.22)' }}>
        <div style={{ ...blurbStyle, marginTop: 0, marginBottom: 10 }}>
          {retired
            ? (locale === 'en'
                ? 'All ads are closed for this session. Reload to restore the placements above.'
                : '本次会话的广告已经全部关闭，刷新页面后按上面的开关恢复。')
            : (locale === 'en'
                ? 'Need a quiet moment without changing those saved choices?'
                : '想现在清净一下，但不改上面的选择：')}
        </div>
        <button type="button" style={quietButtonStyle} onClick={retireAds} disabled={retired}>
          {retired
            ? (locale === 'en' ? 'Closed for this session' : '本次已关闭')
            : (locale === 'en' ? 'Close every ad until reload' : '立刻关闭所有广告（刷新后恢复）')}
        </button>
      </div>
      <div style={{ ...blurbStyle, marginTop: 18 }}>
        {locale === 'en'
          ? 'Turning every placement off hides the plugin, but does not uninstall it. Remove the plugin itself to delete it completely.'
          : '开关全部关掉这个插件就没有任何显示了，但它还装着 —— 想彻底移除请卸载插件本身。'}
```

</details>

**依据 5 · 源码核查**：[src/client/hitbox.ts:18-23](https://github.com/Nagi-ovo/dsh-ads/blob/856b123090e87ed023033894d9734ffe3142cc7c/src/client/hitbox.ts#L18-L23)

关闭热区默认7像素是有意摩擦。

```text
/**
 * Side of the patch that actually closes the banner, in CSS pixels. Small
 * enough to miss on a confident click, large enough that a deliberate,
 * pixel-hunting user always wins — the joke is friction, not a lockout.
 */
export const DEFAULT_HITBOX_PX = 7
```

**依据 6 · 作者声明**：[README.md:48-61](https://github.com/Nagi-ovo/dsh-ads/blob/856b123090e87ed023033894d9734ffe3142cc7c/README.md#L48-L61)

作者安装、兼容与开关说明。

<details>
<summary>查看原文（14行）</summary>

````text
## 安装

推荐用 npm 装到 DSH 的 `web` profile：

```sh
dsh plugin --profile web add @nagi-ovo/dsh-ads
# 如果 dsh web 正在运行，重启后刷新页面
```

也可以从 GitHub 安装：`dsh plugin --profile web add github:Nagi-ovo/dsh-ads`。可以运行 `dsh --profile web --dump-config` 确认插件已经进入最终配置。需要修改源码时，克隆仓库并在仓库目录运行 `dsh plugin --profile web add .`；构建产物已经提交，不需要额外构建。使用社区 [plugin-registry](https://github.com/dsh-external/plugin-registry) 的用户也可以从「设置 → 插件」安装。

兼容 DSH 0.1.1-rc.2 到 0.2.2-rc.1。

每个广告位都能在「设置 → 广告（非官方）」里单独关闭，选择会保留到下次启动。
````

</details>

#### 缺口

- 没有首次配置耗时、渲染资源占用、干扰次数或娱乐满意度的同条件记录。
  **影响**：不能算单位合格体验成本，也不能证明收益抵消干扰。
  **进一步探讨**：将合格体验定义为识别虚构、可退出且愿意再次使用，对同一用户比较原始界面、静态主题和本插件。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪项设计可以借鉴，能推导什么可证伪假设？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

可以借鉴的工程方法是把素材、目录获取、浏览器曝光账本和宿主生命周期分开，并给DOM改动提供成对的撤销函数。目录请求合并与快照退路减少网络失败对内置内容的牵连，轮次身份固定分配减少重渲染造成的广告变动。这些是常见缓存、确定性分配与可撤销副作用在娱乐插件里的组合，不能据此声称算法原创或跨宿主已验证。迁移时必须重新接入目标宿主的生命周期、可见进度和存储策略。

由“能发现真实插件”与“会遮挡真实任务进度”的张力，可以提出未验证假设：将同一候选池和本地曝光轮换放到用户主动打开的插件发现面板，并展示取数来源与快照时间，可能保留发现价值同时减少误认任务暂停。增量是发现入口与任务观测分离，不是增加广告数量。需要额外面板、来源提示和用户同意的统计，不能从目录供给推断用户愿意保留。

最小实验应由自愿用户在相同候选集和任务条件下比较现有广告、主动发现面板及直接浏览topic三种方式，记录主动打开有用仓库的比例、误点、误认暂停、任务打断及一周后主动保留情况。若主动面板的有效发现不优于直接浏览，或关闭干扰后无人愿意再用，就应放弃生产插件方向。该假设没有在本次实施，也不进入已有贡献或创新数值。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:105-121](https://github.com/Nagi-ovo/dsh-ads/blob/856b123090e87ed023033894d9734ffe3142cc7c/src/index.ts#L105-L121)

并发合并与宿主生命周期路由清理是可移植设计依据。

<details>
<summary>查看原文（17行）</summary>

```text
  const resolve = async (): Promise<RegistryPayload> => {
    const now = Date.now()
    if (cache !== undefined && now - cache.at < cacheMs) return cache.payload
    inflight ??= loadRegistry(now, freshDays, SELF_SLUG)
      .then((payload) => {
        cache = { payload, at: Date.now() }
        return payload
      })
      .finally(() => { inflight = undefined })
    return await inflight
  }

  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: REGISTRY_ROUTE,
    handler: async (_req, res) => { json(res, await resolve()) },
  }))
```

</details>

**依据 2 · 源码核查**：[src/client/InferenceRewardGate.tsx:144-183](https://github.com/Nagi-ovo/dsh-ads/blob/856b123090e87ed023033894d9734ffe3142cc7c/src/client/InferenceRewardGate.tsx#L144-L183)

成对撤销DOM改动，支持可撤销副作用分析。

<details>
<summary>查看原文（40行）</summary>

```text
function concealTail(target: GateTarget, onDetached: () => void): () => void {
  const { row, host } = target
  const parent = row.parentElement
  const previousRow = {
    maxHeight: row.style.maxHeight,
    overflow: row.style.overflow,
    overflowX: row.style.overflowX,
    overflowY: row.style.overflowY,
  }
  const hidden = new Map<HTMLElement, string>()
  const height = Math.max(1, row.getBoundingClientRect().height, row.scrollHeight)
  row.style.maxHeight = `${height}px`
  row.style.overflow = 'hidden'
  row.dataset.dshRewardLocked = 'true'

  const hideLaterRows = () => {
    if (!row.isConnected || !host.isConnected) {
      onDetached()
      return
    }
    if (parent === null) return
    for (const candidate of parent.querySelectorAll<HTMLElement>('[data-chat-flow-key]')) {
      if (candidate === row || !follows(row, candidate) || hidden.has(candidate)) continue
      hidden.set(candidate, candidate.style.display)
      candidate.style.display = 'none'
    }
  }
  hideLaterRows()
  const observer = new MutationObserver(hideLaterRows)
  if (parent !== null) observer.observe(parent, { childList: true, subtree: true })

  return () => {
    observer.disconnect()
    row.style.maxHeight = previousRow.maxHeight
    row.style.overflow = previousRow.overflow
    row.style.overflowX = previousRow.overflowX
    row.style.overflowY = previousRow.overflowY
    delete row.dataset.dshRewardLocked
    for (const [candidate, display] of hidden) candidate.style.display = display
    host.remove()
```

</details>

**依据 3 · 源码核查**：[src/client/rotation.ts:94-117](https://github.com/Nagi-ovo/dsh-ads/blob/856b123090e87ed023033894d9734ffe3142cc7c/src/client/rotation.ts#L94-L117)

本机最少曝光与稳定盐值选择，支持复用边界和面板假设。

<details>
<summary>查看原文（24行）</summary>

```text
export function rotate<T extends { readonly slug: string }>(
  pool: readonly T[],
  ledger: SeenLedger,
  take: number,
  salt: string,
): readonly T[] {
  const ranked = [...pool].sort((a, b) => {
    const seen = (ledger[a.slug] ?? 0) - (ledger[b.slug] ?? 0)
    if (seen !== 0) return seen
    return hashString(a.slug + salt) - hashString(b.slug + salt)
  })
  return ranked.slice(0, Math.max(0, take))
}

/**
 * Count one round of impressions.
 * @param ledger - the current counts.
 * @param shown - the plugins that were chosen.
 * @returns a new ledger with each shown plugin incremented.
 */
export function recordSeen(ledger: SeenLedger, shown: readonly { readonly slug: string }[]): SeenLedger {
  const next: Record<string, number> = { ...ledger }
  for (const plugin of shown) next[plugin.slug] = (next[plugin.slug] ?? 0) + 1
  return next
```

</details>

#### 缺口

- 未验证主动发现面板是否比广告或直接浏览topic更有价值。
  **影响**：不能将设计建议升级为已确认机会或已有业务创新。
  **进一步探讨**：按同候选、同任务对照记录主动有效发现与打断成本，若无人保留面板则否定假设。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
