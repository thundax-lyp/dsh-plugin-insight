# dsh-ads

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[a5854a3](https://github.com/Nagi-ovo/dsh-ads/tree/a5854a37bbe24078878740ae4567e59cc75c29ec)

<!-- BEGIN META -->
[![GitHub ★ 692](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=692&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Nagi-ovo/dsh-ads) [![npm 30d 2,046](https://img.shields.io/static/v1?label=npm+30d&message=2%2C046&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@nagi-ovo/dsh-ads) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@nagi-ovo/dsh-ads)
<!-- END META -->

> **功能**：为 DSH 添加虚构复古广告、激励展示和真实社区插件轮播。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)把社区仓库发现嵌入娱乐界面，稳定轮次与最少曝光轮换避免同页重渲染换广告；底层是GitHub topic检索和本地分配，不是质量推荐。

> **主要限制**：[Q03](#research-q03)显示尾部隐藏与执行状态分离，用户看不到不代表代理没行动；topic、新近push、曝光和Star不能证明插件可靠、用户身份或推广转化。

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
  - [Q01 · 娱乐广告与社区插件曝光分别给谁提供什么，能否算真实推广系统？](#detail-section-11)
  - [Q02 · 真实仓库发现、广告轮换与显示锁定怎样实现？](#detail-section-12)
  - [Q03 · 把广告结束当成模型完成、把曝光当成质量，会产生什么错误判断？](#detail-section-13)
  - [Q04 · 娱乐与发现收益值得哪些首次、持续和退出负担？](#detail-section-14)
  - [Q05 · 能否把最少曝光机制变成不干扰执行判断的发现入口？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：dsh-ads首先是把DSH装扮成早期门户网站的娱乐插件，适合自愿尝试夸张广告界面的用户；模型任务的正确交付并不因广告增加。另一个用途是给带dsh-plugin topic的公开仓库曝光，点击进入真实仓库。相对自己浏览GitHub目录，它把发现入口放进现有会话；相对商业广告系统，没有竞价、广告主预算、效果归因或付费交付证据。README明确虚构品牌、价格、病毒和中奖承诺，不能把娱乐抽奖当模型权限发放或可兑现权益。偶尔体验的合格结果是用户能区分虚构内容、打开真实插件出处并可关闭干扰，而不是更快完成工作。

GitHub topic或普通插件目录直接发现仓库；原DSH界面显示真实任务进度，娱乐广告并不提高模型能力。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 复古广告 | 自愿娱乐体验 | 虚构承诺，不暂停模型 |
| 社区轮播 | 就地发现仓库 | topic/新近push，不是质量验收 |
| 广告设置 | 分位关闭 | 全部关闭仅本次 |

**流程与依赖**

| 依赖 | 条件 | 用途 | 失效处理 |
|---|---|---|---|
| DSH web slots/locale/DOM | 展示必需 | 挂载与语言 | 无浏览器面不显示 |
| 浏览器本地存储 | 记忆设置与曝光 | 开关与轮换 | 重新配置/轮换 |
| GitHub/gh/token | 动态层可选 | 搜索及Star状态 | 匿名或快照回退，非身份保证 |

| 步骤 | 执行者与动作 | 验收/失败处理 |
|---|---|---|
| 准备 | 用户web profile安装并重启 | 非官方广告设置可见 |
| 体验 | 用户无副作用会话查看 | 区分虚构和真实仓库 |
| 核查 | 用户打开候选原仓库 | 不用曝光代替研究 |
| 退出 | 单项关闭或卸载 | 重新确认聊天尾部可见 |

**效果与成本**

| 阶段 | 现金与资源成本 | 人工与时间投入 | 边界 |
|---|---|---|---|
| 首次 | 宿主与媒体资源，金额未知 | 装包重启、识别虚构内容 | 仅web显示 |
| 持续 | GitHub查询、浏览器渲染，模型费用照常 | 注意力与开关维护 | 无实测收益 |
| 恢复退出 | 页面/存储清理资源未知 | 关闭单项或卸载、核对界面恢复 | 全部关闭不持久 |

| 效果项 | 源码支持 | 未知 |
|---|---|---|
| 娱乐与曝光 | 多广告位与真实仓库链接 | 体验收益与转化 |
| 轮换稳定 | 本地最少曝光与轮次绑定 | 跨设备公平 |
| 执行观测 | 只隐藏DOM | 用户是否误认暂停 |

> **思考**：[Q03](#research-q03)显示尾部隐藏与执行状态分离，用户看不到不代表代理没行动；topic、新近push、曝光和Star不能证明插件可靠、用户身份或推广转化。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)把社区仓库发现嵌入娱乐界面，稳定轮次与最少曝光轮换避免同页重渲染换广告；底层是GitHub topic检索和本地分配，不是质量推荐。

[Q02](#research-q02)对原inline样式保存并恢复、轮次稳定分配和离线快照回退可复用；共享Host身份及陈旧快照需单独标记。动态目录只是发现层，不应承担安全或能力验收。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)显示尾部隐藏与执行状态分离，用户看不到不代表代理没行动；topic、新近push、曝光和Star不能证明插件可靠、用户身份或推广转化。

<a id="detail-section-6"></a>

### 1.5 使用建议

首次通过web profile装包后重启和刷新，逐项识别广告与真实插件链接；持续付出屏幕面积、声音、注意力、媒体渲染和GitHub查询资源，等待显示不是模型省算力。默认所有广告位与声音开启，用户可持久关闭单个位；关闭所有广告作为“本次关闭”不持久化，不能假定重启仍全部关闭。每项开关和卸载是退出路径，但DOM恢复在实际宿主升级后的表现未测。无收费契约证据，模型仍后台执行所以原模型费用照常；金额、干扰时间和曝光转化均未知。适合明确为了娱乐或观察插件发现的自愿短试，不适合把它作为专注工作默认配置或真实安全告警。 [Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

娱乐界面与真实仓库发现有固定源码；展示锁不会暂停模型，实际兼容、体验和转化未执行；独立发现位是假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/catalog.ts、src/star-host.ts、src/client/feed.ts、src/client/settings.ts、src/client/index.tsx、src/client/InferenceRewardGate.tsx 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交源码级核查Host发现、轮换、DOM显示锁、Star身份与退出设置；不安装、不执行目标代码、不查询真实GitHub账号。
- 下一步：在隔离会话验证各开关/刷新/卸载与DOM恢复、后台事件持续、GitHub离线回退和Star主体；实际体验与转化另做用户对照，均未执行。

**分析版本**

- **仓库**：[Nagi-ovo/dsh-ads](https://github.com/Nagi-ovo/dsh-ads)
- **版本号**：0.1.3（[固定提交 a5854a3](https://github.com/Nagi-ovo/dsh-ads/tree/a5854a37bbe24078878740ae4567e59cc75c29ec)）
- **版本日期**：2026-10-20（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是保留本地最少曝光和稳定轮次分配，把社区插件发现移到明确标记的可关闭区域，去掉隐藏后台进度的显示锁；每条候选展示发现时间、topic来源和“未验安装”边界。它相对当前方案改变的是发现与任务观测的责任分离，不是发明推荐算法。最小实验以相同候选集比较当前广告与独立发现位的真实仓库打开率、误认后台暂停率及工作打断次数，要求后两者不恶化且用户愿意保留入口。新增成本是独立布局和来源提示；若点击仅来自误导或关闭后无人愿意使用，便推翻生产插件机会，不能用曝光次数代替真实需求。 [Q05](#research-q05)

在隔离会话验证各开关/刷新/卸载与DOM恢复、后台事件持续、GitHub离线回退和Star主体；实际体验与转化另做用户对照，均未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

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

[![Issue 未关闭 14](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=14&color=737b86&logo=github)](https://github.com/Nagi-ovo/dsh-ads/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/Nagi-ovo/dsh-ads/issues?q=is%3Aissue+created%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Nagi-ovo/dsh-ads/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：区分娱乐展示、真实社区发现和后台执行，评估其可借鉴机制与采用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 娱乐广告与社区插件曝光分别给谁提供什么，能否算真实推广系统？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

dsh-ads首先是把DSH装扮成早期门户网站的娱乐插件，适合自愿尝试夸张广告界面的用户；模型任务的正确交付并不因广告增加。另一个用途是给带dsh-plugin topic的公开仓库曝光，点击进入真实仓库。相对自己浏览GitHub目录，它把发现入口放进现有会话；相对商业广告系统，没有竞价、广告主预算、效果归因或付费交付证据。README明确虚构品牌、价格、病毒和中奖承诺，不能把娱乐抽奖当模型权限发放或可兑现权益。偶尔体验的合格结果是用户能区分虚构内容、打开真实插件出处并可关闭干扰，而不是更快完成工作。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:15-23](https://github.com/Nagi-ovo/dsh-ads/blob/a5854a37bbe24078878740ae4567e59cc75c29ec/README.md#L15-L23)

作者直接限定虚构广告与后台模型继续执行。

```text
  广告是假的，插件是真的，抽到 V4 Pro 的希望也是真的渺茫。
</p>

![中文模式实机：两侧广告栏、对话内插件推荐、贪玩蓝鲸和 DSH 消息中心](assets/screenshot.webp)

`dsh-ads` 会在侧栏、对话、推理中途和右下角塞入一整套虚构广告。它看起来会暂停 inference，实际上模型一直在后台工作，只是后续回答和工具调用要等广告结束才显示。

插件不会只拿自己开涮。GitHub 上带 [`dsh-plugin`](https://github.com/topics/dsh-plugin) topic、且最近两周更新过的公开插件会进入推荐位，点击广告就能打开真实仓库。仓库换到个人账号或其他组织后仍能被发现。

```

**依据 2 · 作者声明**：[README.md:74-80](https://github.com/Nagi-ovo/dsh-ads/blob/a5854a37bbe24078878740ae4567e59cc75c29ec/README.md#L74-L80)

免责声明及主动Star状态查询边界。

```text

</div>

## 免责声明

本插件纯属娱乐，与 DeepSeek 以及任何真实公司、产品或服务均无关联。广告里的品牌、人物、域名、价格、病毒和承诺均为虚构。插件不会扫描、读取或修改机器上的文件。

```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 真实仓库发现、广告轮换与显示锁定怎样实现？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

Host向webServer注册目录和Star检查两条路由，目录搜索先用本机gh，其次环境token，再匿名API，最后回退内嵌快照；同进程合并请求、默认缓存30分钟。筛选公开非归档非fork且带topic的仓库，所谓最近14天按列表最新push向前计，不是严格相对当前日期，因此离线旧快照仍可轮播旧时段候选。会话广告按语言、会话和轮次固定分配，社区仓库和内置广告各占一个哈希分流，分支内按本机最少曝光先选；这是曝光均衡而非个性化推荐或质量筛选。客户端注册dock、turnTail及设置页。激励广告只通过DOM隐藏后续行和限制当前行高度，不暂停模型；清理函数恢复原inline样式并移除宿主节点。依赖DSH slots/locale、浏览器DOM和存储；GitHub/gh只影响动态层，离线仍有内置素材。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:101-144](https://github.com/Nagi-ovo/dsh-ads/blob/a5854a37bbe24078878740ae4567e59cc75c29ec/src/index.ts#L101-L144)

两条路由、30分钟缓存和Star结果正向缓存。

<details>
<summary>查看原文（44行）</summary>

```text
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
}
```

</details>

**依据 2 · 源码核查**：[src/catalog.ts:113-135](https://github.com/Nagi-ovo/dsh-ads/blob/a5854a37bbe24078878740ae4567e59cc75c29ec/src/catalog.ts#L113-L135)

新鲜窗口以列表最新推送而非墙钟为锚。

<details>
<summary>查看原文（23行）</summary>

```text
 * @param freshDays - window width in days; zero or less keeps everything.
 * @param excludeSlug - plugin to drop, normally this ad layer itself.
 * @returns the eligible subset.
 */
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
}

/**
 * Search through the authenticated `gh` CLI.
```

</details>

**依据 3 · 源码核查**：[src/catalog.ts:197-230](https://github.com/Nagi-ovo/dsh-ads/blob/a5854a37bbe24078878740ae4567e59cc75c29ec/src/catalog.ts#L197-L230)

gh/token/public/snapshot回退链。

<details>
<summary>查看原文（34行）</summary>

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
}
```

</details>

**依据 4 · 源码核查**：[src/client/feed.ts:102-127](https://github.com/Nagi-ovo/dsh-ads/blob/a5854a37bbe24078878740ae4567e59cc75c29ec/src/client/feed.ts#L102-L127)

轮次稳定分流与最少曝光轮换。

<details>
<summary>查看原文（26行）</summary>

```text
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
}

/**
 * Forget every assignment and every impression.
 *
 * The feed is deliberately sticky — a turn keeps its ad, and the ledger only
 * ever grows — so there is otherwise no way back to a clean slate. Tests need
 * one; so would any future "start the rotation over" control.
 */
export function resetFeed(): void {
  assigned.clear()
  writeLedger({})
}
```

</details>

**依据 5 · 源码核查**：[src/client/InferenceRewardGate.tsx:144-185](https://github.com/Nagi-ovo/dsh-ads/blob/a5854a37bbe24078878740ae4567e59cc75c29ec/src/client/InferenceRewardGate.tsx#L144-L185)

显示尾部隐藏与清理恢复，未调用模型暂停。

<details>
<summary>查看原文（42行）</summary>

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
  }
}
```

</details>

**依据 6 · 源码核查**：[src/client/index.tsx:204-225](https://github.com/Nagi-ovo/dsh-ads/blob/a5854a37bbe24078878740ae4567e59cc75c29ec/src/client/index.tsx#L204-L225)

真实界面挂载点。

<details>
<summary>查看原文（22行）</summary>

```text
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

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 把广告结束当成模型完成、把曝光当成质量，会产生什么错误判断？

**研究主题**：缺陷与关键质疑

#### 完整回答

界面会刻意延迟显示后续回答和工具调用，后台执行仍可能继续，用户不能用屏幕暂时不动判断代理暂停、取消或尚未发生副作用。中奖、跑分排名、病毒提示都是娱乐文案；真实仓库被收录也只说明topic和推送筛选成立，未核查安装、权限、代码或需求。轮次曝光账本保存在浏览器，跨设备和清理存储后不再同一公平视角。Star检查使用宿主gh或环境token的账号，不天然等于浏览器当前用户，尤其共享Host不能把结果当访问用户个人身份。这里未连接GitHub或运行宿主，因此只报告控制流与身份边界，不声称任何恶意行为或实际误导比例。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/InferenceRewardGate.tsx:159-185](https://github.com/Nagi-ovo/dsh-ads/blob/a5854a37bbe24078878740ae4567e59cc75c29ec/src/client/InferenceRewardGate.tsx#L159-L185)

后续行仅被隐藏，清理后恢复；没有执行暂停约束。

<details>
<summary>查看原文（27行）</summary>

```text
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
  }
}
```

</details>

**依据 2 · 源码核查**：[src/star-host.ts:55-98](https://github.com/Nagi-ovo/dsh-ads/blob/a5854a37bbe24078878740ae4567e59cc75c29ec/src/star-host.ts#L55-L98)

Star查询主体来自Host gh/token，不能证明浏览器用户身份。

<details>
<summary>查看原文（44行）</summary>

```text
async function viaGh(repo: string): Promise<StarCheckPayload['verdict']> {
  try {
    await execFileAsync('gh', ['api', `user/starred/${repo}`, '--silent'], { timeout: GH_TIMEOUT_MS })
    return 'starred'
  } catch (error) {
    const stderr = (error as { stderr?: unknown }).stderr
    return classifyGhFailure(typeof stderr === 'string' ? stderr : '')
  }
}

/**
 * Ask the API directly with a token from the environment.
 * @param repo - `owner/repo` slug.
 * @param token - a GitHub token; must belong to the user being asked about.
 * @returns the verdict; `unavailable` when the network or the token fails.
 */
async function viaToken(repo: string, token: string): Promise<StarCheckPayload['verdict']> {
  try {
    const response = await fetch(`https://api.github.com/user/starred/${repo}`, {
      headers: { accept: 'application/vnd.github+json', authorization: `Bearer ${token}` },
    })
    return classifyStarStatus(response.status)
  } catch {
    // Swallowed: an offline host answers "no channel", not an error — the
    // browser still has its anonymous fallback to try.
    return 'unavailable'
  }
}

/**
 * Resolve the host's star verdict through the first channel that can answer.
 * @param repo - `owner/repo` slug to check.
 * @returns the payload for the star route; never throws.
 */
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

**依据 3 · 源码核查**：[src/client/feed.ts:115-127](https://github.com/Nagi-ovo/dsh-ads/blob/a5854a37bbe24078878740ae4567e59cc75c29ec/src/client/feed.ts#L115-L127)

分配依赖本地曝光账本，无质量验证。

<details>
<summary>查看原文（13行）</summary>

```text
}

/**
 * Forget every assignment and every impression.
 *
 * The feed is deliberately sticky — a turn keeps its ad, and the ledger only
 * ever grows — so there is otherwise no way back to a clean slate. Tests need
 * one; so would any future "start the rotation over" control.
 */
export function resetFeed(): void {
  assigned.clear()
  writeLedger({})
}
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 娱乐与发现收益值得哪些首次、持续和退出负担？

**研究主题**：效果与总成本、采用判断

#### 完整回答

首次通过web profile装包后重启和刷新，逐项识别广告与真实插件链接；持续付出屏幕面积、声音、注意力、媒体渲染和GitHub查询资源，等待显示不是模型省算力。默认所有广告位与声音开启，用户可持久关闭单个位；关闭所有广告作为“本次关闭”不持久化，不能假定重启仍全部关闭。每项开关和卸载是退出路径，但DOM恢复在实际宿主升级后的表现未测。无收费契约证据，模型仍后台执行所以原模型费用照常；金额、干扰时间和曝光转化均未知。适合明确为了娱乐或观察插件发现的自愿短试，不适合把它作为专注工作默认配置或真实安全告警。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:47-65](https://github.com/Nagi-ovo/dsh-ads/blob/a5854a37bbe24078878740ae4567e59cc75c29ec/README.md#L47-L65)

安装、重启、兼容及单广告位关闭声明。

<details>
<summary>查看原文（19行）</summary>

````text

## 安装

推荐用 npm 装到 DSH 的 `web` profile：

```sh
dsh plugin --profile web add @nagi-ovo/dsh-ads
# 如果 dsh web 正在运行，重启后刷新页面
```

也可以从 GitHub 安装：`dsh plugin --profile web add github:Nagi-ovo/dsh-ads`。可以运行 `dsh --profile web --dump-config` 确认插件已经进入最终配置。需要修改源码时，克隆仓库并在仓库目录运行 `dsh plugin --profile web add .`；构建产物已经提交，不需要额外构建。使用社区 [plugin-registry](https://github.com/dsh-external/plugin-registry) 的用户也可以从「设置 → 插件」安装。

兼容 DSH 0.1.1-rc.2 到 0.2.1-rc.2。

每个广告位都能在「设置 → 广告（非官方）」里单独关闭，选择会保留到下次启动。

![DSH 设置面板里的广告开关](assets/settings.webp)

## 免费广告位
````

</details>

**依据 2 · 源码核查**：[src/client/settings.ts:1-15](https://github.com/Nagi-ovo/dsh-ads/blob/a5854a37bbe24078878740ae4567e59cc75c29ec/src/client/settings.ts#L1-L15)

关闭全部不保存，仅本次关闭。

<details>
<summary>查看原文（15行）</summary>

```text
/**
 * Which placements are switched on, and remembered between sessions.
 *
 * The layer used to have one persistent choice — "keep only the poster" — and
 * that turned out to be the special case of a more useful thing: some people
 * want the benchmark window and the whale poster and nothing else, some want
 * the in-transcript feed but a clean margin. So every placement gets its own
 * switch, and solo mode becomes a shortcut that flips the rest off.
 *
 * "关闭所有广告" is deliberately *not* stored here. It means "not this time",
 * and a persisted version of it would turn one stray click into an uninstall
 * nobody could undo without knowing where the storage key lives.
 *
 * @module
 */
```

</details>

**依据 3 · 源码核查**：[src/client/settings.ts:43-55](https://github.com/Nagi-ovo/dsh-ads/blob/a5854a37bbe24078878740ae4567e59cc75c29ec/src/client/settings.ts#L43-L55)

默认全开启且声音开启。

<details>
<summary>查看原文（13行）</summary>

```text
  feed: true,
  reward: true,
  popup: true,
  speed: true,
  scare: true,
  poster: true,
  muted: false,
}

/** A placement as the settings menu presents it. */
export interface PlacementRow {
  /** Which switch it drives. */
  readonly key: Exclude<keyof AdSettings, 'muted'>
```

</details>

#### 缺口

- 未测真实任务注意力损耗、渲染负担、关闭恢复及发现转化。
  **影响**：无法证明娱乐/发现收益覆盖工作干扰。
  **进一步探讨**：在非关键会话分开测试仅推荐位与全广告，记录误点、恢复和用户是否愿意继续。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否把最少曝光机制变成不干扰执行判断的发现入口？

**研究主题**：新假设与验证

#### 完整回答

未验证方向是保留本地最少曝光和稳定轮次分配，把社区插件发现移到明确标记的可关闭区域，去掉隐藏后台进度的显示锁；每条候选展示发现时间、topic来源和“未验安装”边界。它相对当前方案改变的是发现与任务观测的责任分离，不是发明推荐算法。最小实验以相同候选集比较当前广告与独立发现位的真实仓库打开率、误认后台暂停率及工作打断次数，要求后两者不恶化且用户愿意保留入口。新增成本是独立布局和来源提示；若点击仅来自误导或关闭后无人愿意使用，便推翻生产插件机会，不能用曝光次数代替真实需求。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/feed.ts:102-127](https://github.com/Nagi-ovo/dsh-ads/blob/a5854a37bbe24078878740ae4567e59cc75c29ec/src/client/feed.ts#L102-L127)

稳定分配和公平轮换是可复用起点。

<details>
<summary>查看原文（26行）</summary>

```text
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
}

/**
 * Forget every assignment and every impression.
 *
 * The feed is deliberately sticky — a turn keeps its ad, and the ledger only
 * ever grows — so there is otherwise no way back to a clean slate. Tests need
 * one; so would any future "start the rotation over" control.
 */
export function resetFeed(): void {
  assigned.clear()
  writeLedger({})
}
```

</details>

**依据 2 · 源码核查**：[src/client/InferenceRewardGate.tsx:144-185](https://github.com/Nagi-ovo/dsh-ads/blob/a5854a37bbe24078878740ae4567e59cc75c29ec/src/client/InferenceRewardGate.tsx#L144-L185)

显示锁而非执行锁产生观测混淆。

<details>
<summary>查看原文（42行）</summary>

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
  }
}
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
