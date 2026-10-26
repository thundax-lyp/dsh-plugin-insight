# dsh-model-selector-search

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[1961202](https://github.com/ArcaneOrion/dsh-model-selector-search/tree/1961202137a3a06b9512131ff502b074610ac5b3)

<!-- BEGIN META -->
[![npm 30d 1,140](https://img.shields.io/static/v1?label=npm+30d&message=1%2C140&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@arcaneorion/dsh-model-selector-search) [![最新发布 2026-09-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-29&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@arcaneorion/dsh-model-selector-search)
<!-- END META -->

> **实现功能**：替换会话模型选择器，提供宽松搜索、供应商分组、推理档位选择和偏好记忆。

> **核心亮点**：相对原生平铺目录，新增多字段宽松搜索、路由 ID 消歧和推理档位入口，并通过共享目录服务统一 composer 与原生弹窗的档位策略。搜索是常规算法组合，价值在宿主工作流集成，不是新增模型能力；共享服务包装也扩大了影响范围。[Q01](#research-q01)

> **风险与缺陷**：档位记忆能否忠实保存用户选择比菜单是否方便更关键。包装层在 select Promise resolve 时写记忆，没有检查结果 ok；同文件注入层却显式检查 r.ok，说明 resolve 不等于接受。因此返回 {ok:false} 的正常拒绝可能污染记忆，尚未在宿主复现；同时非 max 的声明默认档位仍可能被当自动选择改写。[Q02](#research-q02)

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
  - [Q01 · 搜索如何改善多供应商目录定位？](#detail-section-11)
  - [Q02 · 档位记忆是否只记录成功选择？](#detail-section-12)
  - [Q03 · 插槽替换和记忆分别依赖什么？](#detail-section-13)
  - [Q04 · 显式选择意图能否避免默认档位歧义？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向维护多个供应商和相似模型名称的 DSH 用户，在会话输入区查找模型并选择推理档位。

比较基线为原生模型菜单手动定位与显式逐次选择档位。原生渲染仍承担目录和会话事实源，本插件主要改善定位和偏好策略，没有同条件性能或任务质量实验。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 宽松模型搜索 | 按名称、ID、描述及供应商定位模型 | 只替换 composer 菜单，原生弹窗搜索不变 |
| 推理档位选择 | 在同一菜单选择声明档位 | 未指定时偏好或最高档，默认值意图存在歧义 |
| 最近供应商置顶 | 按健康流水最近成功记录排序 | 需要可读的通道管理健康记录 |
| 偏好记忆 | 跨选择入口重用 provider/model 档位 | 拒绝结果的写入条件有待确认 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH 0.2.0-rc.1 声明的客户端接口与 React | 启动必需 | 插槽、目录和渲染 | 契约变化可能导致输入区选择器不可见 |
| remote.session 与 remote.settings | 选择与记忆必需 | 会话模型及偏好提交 | 失败需检查返回结果 |
| model-channel-manager 设置命名空间 | 最近及持久偏好条件 | 健康流水与 effortMemory | 缺失时降级，持久记忆是否独立可用未证实 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户核对宿主版本并备份 profile | 已有模型目录可读 |
| 加载 | 安装并重载客户端 | 输入区出现替换选择器 |
| 选择 | 搜索模型、确认档位、提交 | 实际会话 provider/model/effort 与意图相同 |
| 恢复 | 拒绝、禁用或升级后复核 | 记忆不受失败污染，原生入口可恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 现有 DSH 模型接入环境，金额未知 | 安装、检查插槽和搜索行为，时长未知 | 需要版本契约匹配 |
| 持续使用 | 目录与 settings RPC；模型高档位成本未知 | 检查实际模型和档位 | 自动策略可能选择最高声明档 |
| 失败恢复 | 重载与重新选择的资源量未知 | 禁用插件、检查偏好和会话状态 | 服务包装未见还原路径，宜重载客户端 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 宽松定位 | 归一化子串及子序列匹配 | 大目录误匹配率和查找耗时 |
| 档位一致 | 两入口共享目录包装 | 拒绝结果和默认意图能否正确处理 |
| 最近供应商 | 健康记录缓存排序 | 独立安装时数据存在性与实际收益 |

> **思考**：档位记忆能否忠实保存用户选择比菜单是否方便更关键。包装层在 select Promise resolve 时写记忆，没有检查结果 ok；同文件注入层却显式检查 r.ok，说明 resolve 不等于接受。因此返回 {ok:false} 的正常拒绝可能污染记忆，尚未在宿主复现；同时非 max 的声明默认档位仍可能被当自动选择改写。[Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对原生平铺目录，新增多字段宽松搜索、路由 ID 消歧和推理档位入口，并通过共享目录服务统一 composer 与原生弹窗的档位策略。搜索是常规算法组合，价值在宿主工作流集成，不是新增模型能力；共享服务包装也扩大了影响范围。[Q01](#research-q01)

相对原生平铺目录，新增多字段宽松搜索、路由 ID 消歧和推理档位入口，并通过共享目录服务统一 composer 与原生弹窗的档位策略。搜索是常规算法组合，价值在宿主工作流集成，不是新增模型能力；共享服务包装也扩大了影响范围。[Q01](#research-q01)

预归一化索引与弱集合避免重复包装值得借鉴，样式通过 effect 清理。关键代价是修改共享服务对象，未见恢复原方法；成功条件在包装与注入两层不一致。把选择结果归一化成一个函数并单独表达用户意图比值推断更可维护。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

档位记忆能否忠实保存用户选择比菜单是否方便更关键。包装层在 select Promise resolve 时写记忆，没有检查结果 ok；同文件注入层却显式检查 r.ok，说明 resolve 不等于接受。因此返回 {ok:false} 的正常拒绝可能污染记忆，尚未在宿主复现；同时非 max 的声明默认档位仍可能被当自动选择改写。[Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察并核对 {ok:false} 返回路径，修正或确认记忆语义后再在隔离 profile 比较同组模型搜索与原生菜单。通过标准为查询选对模型、手动默认档位不被替换、拒绝不写偏好；失败时禁用并重载客户端。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

搜索、插槽替换和档位重写有源码支持；记忆成功条件存在 RemoteResult 语义疑点，实际宿主和收益未验证。设计假设未实现。

- 已检查：作者 README、包清单、源码路径 src/client.js、src/index.js、package.json、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 README、package、client 搜索算法、设置门面、档位包装、插槽注册及相关选择返回值；界面其他渲染分支未逐行审计，未核查宿主实现。
- 下一步：先用返回 ok=false、reject、ok=true 的目录实例验证记忆写入，再在明确宿主版本中覆盖两个入口和 provider 改名；以同批查询记录选错率、耗时和实际推理档位费用。本轮未执行。

**分析版本**

- **仓库**：[ArcaneOrion/dsh-model-selector-search](https://github.com/ArcaneOrion/dsh-model-selector-search)
- **版本号**：0.3.0（[固定提交 1961202](https://github.com/ArcaneOrion/dsh-model-selector-search/tree/1961202137a3a06b9512131ff502b074610ac5b3)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可提出未验证的显式选择协议，让目录提交携带 source=manual/default 与结果确认，记忆只在 ok=true 后写入，从而替代对 defaultEffort 值的猜测。对比同一目录的自动、手动默认、max、拒绝四类请求，若不能保留用户意图或破坏原生调用兼容，则否定协议改进。[Q04](#research-q04)

先用返回 ok=false、reject、ok=true 的目录实例验证记忆写入，再在明确宿主版本中覆盖两个入口和 provider 改名；以同批查询记录选错率、耗时和实际推理档位费用。本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 98 | — | — | 2650 |
| .js | source | 2 | 673 | 540 | 119 | — |
| .cjs | test | 3 | 513 | 420 | 55 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-24），可前往 [GitHub Issues](https://github.com/ArcaneOrion/dsh-model-selector-search/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：搜索与档位记忆能否降低多供应商模型选择负担并保持选择语义？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 搜索如何改善多供应商目录定位？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

多供应商、重名模型和虚拟路由下，精确文本匹配要求用户记住名称拼写。本插件先删除分隔符并小写，子串命中优先，未命中再用保序子序列；组名或路由 ID 命中显示全组，否则筛选模型名称、ID、描述。索引随目录快照预计算，避免每键重复归一化。相对原生目录手动翻找，它增加容错检索与组消歧，仍使用宿主目录完成选择，不能据机制推断耗时或准确率改善；短缩写也可能带来较多候选。

#### 证据与依据

**依据 1 · 源码核查**：[src/client.js:150-171](https://github.com/ArcaneOrion/dsh-model-selector-search/blob/1961202137a3a06b9512131ff502b074610ac5b3/src/client.js#L150-L171)

匹配函数明确区分归一化子串和子序列优先级。

<details>
<summary>查看原文（22行）</summary>

```text

    // 搜索归一化：小写 + 去分隔符（- _ . / 空白），「glm53」可命中「GLM-5.3」，
    // 组路由 id「roundrobin/coding」可按「roundrobincoding」命中。
    // 双方同步删字符保序，归一化包含 ⊇ 原始包含——过滤走单路径归一化判断即可；
    // 副作用：仅在归一化下才命中的查询，hlParts（原始子串 indexOf）不高亮，纯文本显示
    const normSearch = (s) => String(s || '').toLowerCase().replace(/[-_./\s]+/g, '')
    // 子序列判定（fzf 式兜底）：按序命中每个字符、不要求连续——「ds」可命中
    // 「deepseek」（d..s），原始子串对缩写/首字母无能为力
    const isSubseq = (s, q) => {
      let at = 0
      for (let i = 0; i < s.length && at < q.length; i++) if (s[i] === q[at]) at++
      return at === q.length
    }
    // 匹配梯队：0 未命中 / 1 归一化子串 / 2 仅子序列
    const matchTier = (hay, q) => (hay.includes(q) ? 1 : (isSubseq(hay, q) ? 2 : 0))
    // 多字段取最优梯队（非零最小）：任一字段子串命中 = 1，全部仅子序列 = 2
    const bestTier = (...tiers) => {
      let best = 0
      for (const t of tiers) if (t !== 0 && (best === 0 || t < best)) best = t
      return best
    }

```

</details>

**依据 2 · 源码核查**：[src/client.js:337-375](https://github.com/ArcaneOrion/dsh-model-selector-search/blob/1961202137a3a06b9512131ff502b074610ac5b3/src/client.js#L337-L375)

目录字段索引和组级、行级匹配路径支持实际工作流增量。

<details>
<summary>查看原文（39行）</summary>

```text
        g,
        ngname: normSearch(g.name || g.id),
        ngid: normSearch(g.id),
        models: (g.models || []).map((m) => ({
          m,
          nname: normSearch(m.name),
          nid: normSearch(m.id),
          ndesc: normSearch(m.description),
        })),
      })), [groups])
      // 展示名重复计数：重名组（如多个都叫 RoundRobin 的轮询组）在组头补充路由 id 后缀
      const dupNames = useMemo(() => {
        const counts = new Map()
        for (const g of groups) {
          const n = g.name || g.id
          counts.set(n, (counts.get(n) || 0) + 1)
        }
        return counts
      }, [groups])
      if (!available) return null
      // 渲染体：过滤后的组列表。两段式——归一化子串（梯队1）优先、子序列（梯队2）兜底；
      // 组名/路由 id 命中显示全组（provider 维度搜索意图），否则按模型行过滤；
      // 有查询时组按梯队稳定排序（子串命中组在前），组内模型行同样子串优先
      const sections = []
      for (const gi of matchIndex) {
        const all = gi.models.map((x) => x.m)
        let rows = all
        let tier = 0
        if (nq) {
          const groupTier = bestTier(matchTier(gi.ngname, nq), matchTier(gi.ngid, nq))
          if (groupTier > 0) {
            tier = groupTier
          } else {
            const scored = gi.models
              .map((mi) => ({ m: mi.m, t: bestTier(matchTier(mi.nname, nq), matchTier(mi.nid, nq), matchTier(mi.ndesc, nq)) }))
              .filter((x) => x.t > 0)
            if (scored.length === 0) continue
            scored.sort((a, b) => a.t - b.t)
            rows = scored.map((x) => x.m)
```

</details>

#### 缺口

- 真实目录查找耗时和误选率没有对照。
  **影响**：不能证明搜索对所有查询都更有效。
  **进一步探讨**：使用相同模型目录与查询集对比原生和增强菜单。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 档位记忆是否只记录成功选择？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

源码在目录 select 的 Promise resolve 后调用 recordEffortMemory，没有读取返回对象。相同文件的注入层把返回 r.ok===true 才视为接受，因此存在正常 resolve 但 ok=false 的拒绝路径可能仍记忆的具体风险，不能把注释中的成功后记忆当证据。策略对非默认显式档位和 max 放行，其余用记忆或最高档覆盖；显式选择等于非 max 默认值仍无法与自动填充区分。WeakSet 防止重复包装已有目录，但共享模型服务方法被直接替换，未见插件销毁时恢复，会影响原生弹窗的后续选择。

#### 证据与依据

**依据 1 · 源码核查**：[src/client.js:195-217](https://github.com/ArcaneOrion/dsh-model-selector-search/blob/1961202137a3a06b9512131ff502b074610ac5b3/src/client.js#L195-L217)

默认值与显式值的识别使用近似规则，max 有例外。

<details>
<summary>查看原文（23行）</summary>

```text
    const augmentRule = (groups, selection, memory) => {
      const g = (groups || []).find((x) => x.id === selection.provider)
      const m = g && (g.models || []).find((mm) => mm.id === selection.model)
      const declared = m && m.reasoning
      if (!declared || !Array.isArray(declared.efforts) || declared.efforts.length === 0)
        return { payload: selection }
      const key = selection.provider + '::' + selection.model
      const incoming = selection.reasoningEffort
      // `=== defaultEffort` 曾经是「自动值」的近似判别，但档位子面板把 defaultEffort 本身
      // 也列为可选项：defaultEffort 为 max 的模型上，用户点 Max 会与自动填值同形，被改写成
      // 记忆档位（如 xhigh）—— 而该次改写不记记忆，记忆恒为 xhigh，于是「点 Max 永远
      // 不变、且无任何报错」。max 是语义最顶层档位、不存在比它更精确的自动默认，故显式
      // max 一律按显式选择放行并记入记忆；其余档位沿用原近似。
      const explicit = incoming !== undefined && (incoming !== declared.defaultEffort || incoming === 'max')
      if (explicit)
        return { payload: selection, remember: { key, effort: incoming } }
      const remembered = memory ? memory[key] : undefined
      const effort = (remembered != null && declared.efforts.some((l) => l.id === remembered))
        ? remembered
        : maxEffortOf(declared)
      if (effort === incoming) return { payload: selection }
      return { payload: Object.assign({}, selection, { reasoningEffort: effort }) }
    }
```

</details>

**依据 2 · 源码核查**：[src/client.js:235-257](https://github.com/ArcaneOrion/dsh-model-selector-search/blob/1961202137a3a06b9512131ff502b074610ac5b3/src/client.js#L235-L257)

只以 Promise resolve 写记忆，未检查 RemoteResult.ok。

<details>
<summary>查看原文（23行）</summary>

```text
    // directoryFor 包装：目录对象按会话缓存在 resolver 的 live Map 里（同一会话反复拿到
    // 同一对象），WeakSet 防重复包；select 失败不写记忆（避免把未被接受的选择当作用户偏好）
    const wrapModelDirectories = (models) => {
      if (!models || typeof models.directoryFor !== 'function' || models.__mcmEffortMemWrapped) return
      const origDirectoryFor = models.directoryFor.bind(models)
      const wrappedDirs = new WeakSet()
      models.directoryFor = (sessionId) => {
        const dir = origDirectoryFor(sessionId)
        if (!dir || typeof dir.select !== 'function' || wrappedDirs.has(dir)) return dir
        const origSelect = dir.select.bind(dir)
        dir.select = (selection) => {
          if (!selection || typeof selection.provider !== 'string' || typeof selection.model !== 'string')
            return origSelect(selection)
          const snapshot = dir.store && typeof dir.store.getSnapshot === 'function' ? dir.store.getSnapshot() : null
          const rule = augmentRule(snapshot ? snapshot.groups : null, selection, effortMemory)
          const p = origSelect(rule.payload)
          if (rule.remember) p.then(() => recordEffortMemory(rule.remember.key, rule.remember.effort), () => {})
          return p
        }
        wrappedDirs.add(dir)
        return dir
      }
      models.__mcmEffortMemWrapped = true
```

</details>

**依据 3 · 源码核查**：[src/client.js:645-651](https://github.com/ArcaneOrion/dsh-model-selector-search/blob/1961202137a3a06b9512131ff502b074610ac5b3/src/client.js#L645-L651)

另一层明确区分返回 ok 与 reject，支持成功语义疑点。

```text
                select: (selection) => available
                  // 0.2 的 directory.select 返回 RemoteResult；本组件沿用「是否被接受」的布尔语义
                  ? directory.select(selection).then((r) => (r === undefined ? true : r.ok === true), () => false)
                  : Promise.resolve(false),
              }
              } catch (e) {
                document.body.dataset.mcmSelInjectErr = String((e && e.stack) || e)
```

#### 缺口

- 宿主目录是否以 ok=false resolve 拒绝需要运行确认。
  **影响**：目前是源码语义风险，未断言实际拒绝必然污染。
  **进一步探讨**：构造正常 resolve 的拒绝结果并检查持久偏好。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 插槽替换和记忆分别依赖什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

插件声明并调用 slots、modelDirectories、sessions 和远程会话及设置接口；负 priority 遮蔽原生输入区选择器，原生目录依旧是数据源。设置兼容门面把 model-channel-manager 命名空间投影成旧视图，因此最近记录和偏好持久化与该命名空间有关，不能把完全独立工作等同于独立持久记忆。首次成本是安装和契约核对，持续成本含 RPC 与自动最高档带来的模型资源，恢复需禁用并重载以撤销共享对象包装；金额、耗时未知。应先解决拒绝语义再试用，并用实际会话选择值验收，不能只看 pill 标签。

#### 证据与依据

**依据 1 · 源码核查**：[src/client.js:21-50](https://github.com/ArcaneOrion/dsh-model-selector-search/blob/1961202137a3a06b9512131ff502b074610ac5b3/src/client.js#L21-L50)

设置门面绑定通道管理命名空间并写回偏好。

<details>
<summary>查看原文（30行）</summary>

```text
    // 0.2 的 settings 命名空间恒等于「插件行 id」；模型通道管理插件的两套旧命名空间
    // （model-channels / model-channel-health）现由其实例配置承载，在此合成回旧视图。
    const NS_MCM = 'model-channel-manager'
    const makeLegacyApi = (remote) => {
      const readMcm = async () => {
        const res = await remote.settings.describe()
        if (!res || res.ok !== true) return null
        return ((res.value && res.value.namespaces) || []).find((n) => n && n.ns === NS_MCM) || null
      }
      return {
        settings: {
          describe: async () => {
            const res = await remote.settings.describe()
            if (!res || res.ok !== true) return { result: res || { ok: false } }
            const namespaces = (res.value && res.value.namespaces) || []
            const mcm = namespaces.find((n) => n && n.ns === NS_MCM)
            const value = (mcm && mcm.value) || {}
            return { result: { ok: true, value: { namespaces: [...namespaces,
              { ns: 'model-channels', value: { groups: value.groups || [], providerOrder: value.providerOrder || [], effortMemory: value.effortMemory || {} }, user: {} },
              { ns: 'model-channel-health', value: value.health || {}, user: {} },
            ] } } }
          },
          update: async (args) => {
            const patch = (args && args.patch) || {}
            if ((args && args.ns) === 'model-channels') {
              return { result: await remote.settings.update(NS_MCM, patch, undefined) }
            }
            const row = await readMcm()
            const health = (row && row.value && row.value.health) || {}
            return { result: await remote.settings.update(NS_MCM, { health: Object.assign({}, health, patch) }, undefined) }
```

</details>

**依据 2 · 源码核查**：[src/client.js:597-615](https://github.com/ArcaneOrion/dsh-model-selector-search/blob/1961202137a3a06b9512131ff502b074610ac5b3/src/client.js#L597-L615)

样式清理与共享服务包装的启动链可核对。

<details>
<summary>查看原文（19行）</summary>

```text
    function apply(ctx) {
      ctx.inject(['remote'], (scope) => { apiRef = makeLegacyApi(scope.remote) })
      ctx.effect(() => {
        const tag = document.createElement('style')
        tag.dataset.mcmStyle = ''
        tag.textContent = CSS
        document.head.appendChild(tag)
        return () => tag.remove()
      }, 'model-selector: styles')
      // 空闲预热置顶缓存：首次打开菜单大概率已有数据，不打断渲染
      if (apiRef) setTimeout(() => refreshRecent(), 8000)
      // 档位记忆：尽早拉缓存 + 包装 modelDirectories（原生 /model 弹窗不经本插件 face，
      // 只有包在共享服务上才能让两入口同策略）
      loadEffortMemory()
      ctx.inject(['modelDirectories'], (scope) => {
        wrapModelDirectories(scope.get('modelDirectories'))
      })
      const slots = ctx.get('slots')
      if (!slots) return
```

</details>

**依据 3 · 源码核查**：[src/client.js:630-664](https://github.com/ArcaneOrion/dsh-model-selector-search/blob/1961202137a3a06b9512131ff502b074610ac5b3/src/client.js#L630-L664)

负优先级替换和依赖清单明确，恢复不能仅靠隐藏菜单判断。

<details>
<summary>查看原文（35行）</summary>

```text
        slots.inject('conversation.input.model', () => slots.register(
          {
            name: 'conversation.input.model',
            id: 'mcm-selector-search',
            priority: -1,
            inject: (sessionId) => {
              try {
              const directory = models.directoryFor(sessionId)
              const available = sessions.subagentAddress(sessionId) === undefined
              return {
                available,
                directory: directory.store,
                load: () => {
                  if (available) directory.load().catch(() => { /* surfaced on the store */ })
                },
                select: (selection) => available
                  // 0.2 的 directory.select 返回 RemoteResult；本组件沿用「是否被接受」的布尔语义
                  ? directory.select(selection).then((r) => (r === undefined ? true : r.ok === true), () => false)
                  : Promise.resolve(false),
              }
              } catch (e) {
                document.body.dataset.mcmSelInjectErr = String((e && e.stack) || e)
                throw e
              }
            },
          },
          (p) => el(SearchModelSelect, p)
        ))
      })
    }

    // dsh 0.2：客户端服务方法按「调用方 fiber」校验依赖，调用 modelDirectories /
    // directory.select 的一方必须自己声明 remote.session，否则抛
    // `cannot get property "remote.session" without inject`。
    return { name: 'model-selector-search', inject: ['slots', 'modelDirectories', 'sessions', 'remote', 'remote.session', 'remote.settings'], apply }
```

</details>

#### 缺口

- 默认最高档位造成的费用及升级兼容负担未知。
  **影响**：无法判定便利是否抵消持续使用成本。
  **进一步探讨**：记录真实档位、任务调用量和升级恢复时间。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 显式选择意图能否避免默认档位歧义？

**研究主题**：新假设与验证

#### 完整回答

当前策略用值是否等于声明默认值推断意图，而同值既可能自动也可能用户手选，信息已经丢失。由此推导一个未验证协议，让选择入口显式携带来源并统一检查 ok=true 后持久化；它增加宿主接口及旧调用者兼容成本。最小验证以自动、手动默认、手动 max、被拒绝请求组成矩阵，要求实际选择符合意图且失败不写记忆，并复测原生弹窗。如果新的来源字段无法传递或旧入口行为回归，则改进假设不能成立，应退回不重写原生选择的局部方案。

#### 证据与依据

**依据 1 · 源码核查**：[src/client.js:179-188](https://github.com/ArcaneOrion/dsh-model-selector-search/blob/1961202137a3a06b9512131ff502b074610ac5b3/src/client.js#L179-L188)

注释说明同值负载不可区分，提供协议改进的推导事实。

<details>
<summary>查看原文（10行）</summary>

```text
    // 拦截点在 modelDirectories 服务实例的 directoryFor(...)——原生 /model 弹窗与 composer
    // 座位（本插件 + 原生遮蔽前的任何 face）都经它调 directory.select。原生弹窗对新模型
    // 自动填 model.reasoning.defaultEffort（ui-model-selection client.js selectionOf），
    // 与「用户显式选了这个值」在负载上不可区分，故以「=== 声明 defaultEffort」近似为自动。
    // 规则（augmentRule，纯函数）：
    //   · incoming 非空且 ≠ declared.defaultEffort → 显式选择：原样放行，select 成功后记忆
    //   · 其余（未填档 / === defaultEffort）→ 自动：改写为 memory[key] ?? max
    //     （memory 值须仍在模型声明档位集内，配置变更后失效记忆回落 max）
    // 记忆存 model-channels ns 的 effortMemory 字段（apiproxy 白名单已放行、schema loose）；
    // ns 不可读写时静默降级为无记忆，max 兜底不受影响。
```

</details>

**依据 2 · 源码核查**：[src/client.js:246-252](https://github.com/ArcaneOrion/dsh-model-selector-search/blob/1961202137a3a06b9512131ff502b074610ac5b3/src/client.js#L246-L252)

选择包装提供统一确认结果的位置，但不证明新协议已实现。

```text
          if (!selection || typeof selection.provider !== 'string' || typeof selection.model !== 'string')
            return origSelect(selection)
          const snapshot = dir.store && typeof dir.store.getSnapshot === 'function' ? dir.store.getSnapshot() : null
          const rule = augmentRule(snapshot ? snapshot.groups : null, selection, effortMemory)
          const p = origSelect(rule.payload)
          if (rule.remember) p.then(() => recordEffortMemory(rule.remember.key, rule.remember.effort), () => {})
          return p
```

#### 缺口

- 宿主接口能否接受并保留来源标记未知。
  **影响**：方案需要上游协作而非仅修改 UI。
  **进一步探讨**：以兼容原型验证新旧调用者，检查字段丢失和回归。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
