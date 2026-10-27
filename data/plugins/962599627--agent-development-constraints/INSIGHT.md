# agent-development-constraints

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[fc9af91](https://github.com/962599627/agent-development-constraints/tree/fc9af918ac14f03d63bee299cab90862adbc8963)

<!-- BEGIN META -->

<!-- END META -->

> **功能**：提供项目开发规则库与提炼精简合并流程，DSH按症状查询规则并一次注入入口目录，另有上下文成本观察和可选提交脱敏检查。

> **亮点**：把规则/触发/检查/证据模板、症状索引与DSH一次入口提醒连接，减少复盘只留长日志的问题。详见[Q02](#research-q02)。

> **主要限制**：非每步强制执行；当前DSH面跨home日志/写probe/cache与隐私承诺不符。status无独立守卫且全局last资料可能混会话；Linux基线缺失/标记替换及自改资产保留有边界。详见[Q03](#research-q03)、[Q04](#research-q04)。

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
  - [Q01 · 规则演化系统帮谁解决什么问题？](#detail-section-11)
  - [Q02 · DSH运行时与规则流程实际怎样接起来？](#detail-section-12)
  - [Q03 · 隐私说明、跨会话审计与状态路由怎样对照？](#detail-section-13)
  - [Q04 · 项目安装与贡献是否真的幂等且只导新增？](#detail-section-14)
  - [Q05 · 依赖与使用流程是什么？](#detail-section-15)
  - [Q06 · 成本审计与运行时恢复能支持什么解释？](#detail-section-16)
  - [Q07 · 当前是否值得推荐，进一步探索什么？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向反复用AI开发、已积累错误案例而想减少重犯的人。主体是项目内constraints规则库、按技术栈的坑位、DISTILL/PRUNE/MERGE文档流程、可选脱敏hook，以及DSH读取规则/观察上下文成本的工具面。规则要求触发、检查和证据，目标让复盘可复用而不是保存长日志。

合格成果应是有适用条件、可执行检查、真实事件依据的项目规则，升级/归档保留理由；后续是否真的减少错误要看重复任务与违反率。写“必须”或放进AGENTS不证明执行被强制，跨三个项目来源计数也不是天然独立复现，需去重项目/共同代码和相同AI生成来源。

基线是人工维护AGENTS/CLAUDE与复盘清单。插件增量是症状索引和工具查全文/流程模板，不能把文档引导称为已自动学习、自动改规则或确定性执行所有约束。

人工AGENTS/CLAUDE规则与复盘；插件省查询/模板接线，但执行可靠、证据独立和规则维护仍由人/工具实际检查。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 规则文档流程 | 提炼/精简/来源合并 | 人或AI按文档做，非自动学习 |
| 症状工具 | 文本检索前五/规则全文 | 启发匹配，不证明适用/冲突消解 |
| 入口注入 | 每agent一次症状目录 | 非每步强执行，模板来源未重标 |
| 成本观察 | schema估算/跨日志使用 | 采样/全局cache，非“从不需要” |
| 项目安装/贡献 | 更新资产/指导与导规则 | 用户自改/标记/跨平台基线需核 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=18与DSH tools/pre-step服务 | DSH面 | 工具/注入 | runtime shape依宿主代际，零npm依赖非零API依赖 |
| 项目agent-constraints规则文件 | 规则面 | cwd/父目录查找 | 未安装仅返回提示，不自动生成资产 |
| Bash/awk/cp或PowerShell | 安装/贡献 | 改项目指导、复制模板 | 不同平台baseline行为需核 |
| Git与可选hooksPath | 检查网 | 提交脱敏规则匹配 | 可绕过且不覆盖所有敏感信息 |
| home/.dsh日志/usage文件格式 | 成本审计 | 采样调用/费用 | 固定home路径不跟随任意DSH_HOME |
| 用户审核规则/来源与披露 | 业务前提 | 防无关/冲突规则传播 | 提示目录不能替代组织政策 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 选面 | 先决定纯规则文档/CLI或DSH运行面 | 各面读取/写入范围明确 |
| 准备 | 备份指导/模板/hook，删不适用规则 | 不把示例规则直接当项目命令 |
| 安装 | 指定目标/skip指导等选项 | 对照diff，尤其用户自改资产 |
| 读取 | 症状查规则全文/证据 | 先核适用与真实原因，不照搬 |
| 演化 | 完成后按DISTILL/PRUNE人工提炼 | 规则有检查/证据和归档理由 |
| 贡献 | 核baseline/敏感内容再手动分享 | 无自动提交/推送授权 |
| 审计 | 明确跨会话采样范围/卡片对应 | 0调用不当从未需要工具 |

本轮不安装、不改AGENTS/Hook、不读用户真实会话、不执行目标脚本。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 安装资产/备份与宿主适配资源 | 清理无关规则、核安装资产与API | 人工整理/平台差异时间与费用未知 |
| 持续使用 | 每agent一次brief、两常驻工具schema、同步规则读取/采样解压 | 维护规则与阅读成本 | 固定41token等注释非全部上下文成本，实际usage未知 |
| 失败恢复 | probe覆盖/并发、错误卡片/安装文件恢复资源 | 排坏配置默认开启，diff与备份修复 | 无多文件事务/版本CAS，恢复时间/费用未知 |



#### 效果

| 目标 | 源码支持的增量 | 证据边界 |
| --- | --- | --- |
| 避免忘记规则入口 | 一次目录注入与按症状读全文 | 不强制执行、不自动纠错 |
| 限库膨胀 | 分层/DISTILL/PRUNE规范 | 15条等阈值为作者经验未验证 |
| 找工具成本候选 | schema近似体积与采样调用交叉 | 最近8会话未调用不等于以后可关 |
| 贡献复用 | 基线/ID抽取与人工MERGE | Linux无基线/同ID修改/独立性仍需核 |

audit只采近14天>50KiB最多8会话，旧/小/不可读日志可能漏；坏行跳过只计帧失败不计行错误。0调用给disable候选是启发式，不能据此自动卸载。computeAuditCache只第一次缓存，不随当前schema/会话更新。loadConfig坏JSON回默认inject true，保存probe/config直写无原子/CAS；这些是宽容可用性取舍，不能称状态正确性保证。

> **思考**：非每步强制执行；当前DSH面跨home日志/写probe/cache与隐私承诺不符。status无独立守卫且全局last资料可能混会话；Linux基线缺失/标记替换及自改资产保留有边界。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把规则/触发/检查/证据模板、症状索引与DSH一次入口提醒连接，减少复盘只留长日志的问题。详见[Q02](#research-q02)。

install.sh保留已有constraints.md，force才覆盖，这是规则资产保护的具体优点。流程、stacks、templates/scripts和文档始终cp -f更新，根.githooks也同名覆盖；因此“幂等”只是不重复规则引用且默认保主库，不代表用户自改模板/技术栈/hook都受保护。

AGENTS类文件从AGENTS.md/CLAUDE.md/GEMINI.md/.cursorrules取首个，按HTML begin/end替换。若原文件只有begin缺end，awk会skip直到EOF，可能丢余下内容；没有先验证成对标记/备份/事务。命令不自动提交/push，但安装本身会改项目指导文件和hook资产。hooks独立命令设置core.hooksPath，默认安装复制hook但不启用该配置，不能混淆。

Linux install.sh没有写.baseline，contribute.sh无基线则导全部规则；PowerShell安装另有baseline，这造成平台“只导你的新增”不一致。新增比较按ID，不发现相同ID规则内容变更；来源项目名/规则证据可能包含敏感业务，导出本地不等于已经脱敏。作者流程的来源计数与抽象合并依维护者认真核材料，不是自动独立证明。

<a id="detail-section-5"></a>

### 1.4 主要限制

非每步强制执行；当前DSH面跨home日志/写probe/cache与隐私承诺不符。status无独立守卫且全局last资料可能混会话；Linux基线缺失/标记替换及自改资产保留有边界。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，可人工择取规则方法，先核隐私/路由/会话和安装保留再在重要项目启用运行面。详见[Q07](#research-q07)。

合格成果应是有适用条件、可执行检查、真实事件依据的项目规则，升级/归档保留理由；后续是否真的减少错误要看重复任务与违反率。写“必须”或放进AGENTS不证明执行被强制，跨三个项目来源计数也不是天然独立复现，需去重项目/共同代码和相同AI生成来源。

基线是人工维护AGENTS/CLAUDE与复盘清单。插件增量是症状索引和工具查全文/流程模板，不能把文档引导称为已自动学习、自动改规则或确定性执行所有约束。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码。规则资产/查询可用性明确，隐私范围、全局会话卡片、路由权限与跨平台安装/基线保留需先核。

- 已检查：作者 README、包清单、源码路径 README.md、PRIVACY.md、package.json、index.mjs、install.sh、install.ps1、contribute.sh、scripts/install-hooks.sh、core/DISTILL.md、core/PRUNE.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定规则流程/示例结构、index关键注入/工具/日志/卡片/路由，Bash/PS安装与贡献关键分支；不全脚本审计，不应用外来规则/安装或读真实日志。
- 下一步：可继续核双项目会话/缺认证/坏配置与缺end标记、自改资产/同ID贡献语料，比较范围、资产hash和真实违反率。

**分析版本**

- **仓库**：[962599627/agent-development-constraints](https://github.com/962599627/agent-development-constraints)
- **版本号**：0.26.8（[固定提交 fc9af91](https://github.com/962599627/agent-development-constraints/tree/fc9af918ac14f03d63bee299cab90862adbc8963)）
- **版本日期**：2026-10-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索项目/版本/适用/检查证据收据、plugin来源/session授权缓存与路由、安装diff/备份及ID+hash基线，比较误触发与资产保留；未实现。详见[Q07](#research-q07)。

可继续核双项目会话/缺认证/坏配置与缺end标记、自改资产/同ID贡献语料，比较范围、资产hash和真实违反率。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 963 | 738 | 158 | — |
| .md | source | 20 | 4107 | — | — | 42772 |
| .md | example | 1 | 168 | — | — | 1460 |
| .mjs | source | 1 | 1767 | 1178 | 503 | — |
| .mjs | test | 1 | 893 | 600 | 223 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/962599627/agent-development-constraints/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/962599627/agent-development-constraints/issues?q=is%3Aissue+created%3A2026-09-22T07%3A02%3A46.528Z..2026-10-22T07%3A02%3A46.528Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/962599627/agent-development-constraints/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T07%3A02%3A46.528Z..2026-10-22T07%3A02%3A46.528Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本区分规则文档演化/提示注入与强执行，核隐私/会话范围、安装保留和贡献增量。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 规则演化系统帮谁解决什么问题？

**研究主题**：场景与需求

#### 完整回答

面向反复用AI开发、已积累错误案例而想减少重犯的人。主体是项目内constraints规则库、按技术栈的坑位、DISTILL/PRUNE/MERGE文档流程、可选脱敏hook，以及DSH读取规则/观察上下文成本的工具面。规则要求触发、检查和证据，目标让复盘可复用而不是保存长日志。

合格成果应是有适用条件、可执行检查、真实事件依据的项目规则，升级/归档保留理由；后续是否真的减少错误要看重复任务与违反率。写“必须”或放进AGENTS不证明执行被强制，跨三个项目来源计数也不是天然独立复现，需去重项目/共同代码和相同AI生成来源。

基线是人工维护AGENTS/CLAUDE与复盘清单。插件增量是症状索引和工具查全文/流程模板，不能把文档引导称为已自动学习、自动改规则或确定性执行所有约束。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-6](https://github.com/962599627/agent-development-constraints/blob/fc9af918ac14f03d63bee299cab90862adbc8963/README.md#L5-L6)

作者self-evolving定位。

```text
A **self-evolving** constraint system for AI coding agents: it turns the mistakes you
actually hit during development into rules that take effect the *next* time.
```

**依据 2 · 源码核查**：[core/DISTILL.md:55-67](https://github.com/962599627/agent-development-constraints/blob/fc9af918ac14f03d63bee299cab90862adbc8963/core/DISTILL.md#L55-L67)

规则/触发/检查/证据模板。

<details>
<summary>查看原文（13行）</summary>

````text
### 第 4 步：立卡 —— 四要素缺一不可

用 [`templates/rule.md`](templates/rule.md)，四个字段全填：

```markdown
### R-0XX 一句话规则名
- **规则**：可执行的约束（必须有明确的"做什么/不做什么"）
- **触发**：什么时候该想起来（写清单，越具体越好）
- **检查**：怎么验证（**命令、grep、断言** —— 不是"人工review"）
- **证据**：哪次真实踩坑、代价是什么
```

**检查项写不出来的规则，就不要收** —— 说明它还没被想清楚。
````

</details>

**依据 3 · 源码核查**：[core/PRUNE.md:10-14](https://github.com/962599627/agent-development-constraints/blob/fc9af918ac14f03d63bee299cab90862adbc8963/core/PRUNE.md#L10-L14)

精简触发。

```text
## 什么时候精简

- 每个月
- 或每积累 10 条新规则
- 或 **L0 超过 15 条时（这是硬触发，必须立刻处理）**
```

**依据 4 · 源码核查**：[core/PRUNE.md:66-72](https://github.com/962599627/agent-development-constraints/blob/fc9af918ac14f03d63bee299cab90862adbc8963/core/PRUNE.md#L66-L72)

归档/替代删除规则。

```text
### ④ 删除（只删被替代的）

**只有两种情况可以真删**：
1. 已被工具链强制（有 linter 规则、CI 检查）
2. 与其他规则完全重复（合并后）

其他情况一律**降级到 L3 归档**，不要删 —— 归档的成本极低，而重新发现同一个坑的成本很高。
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH运行时与规则流程实际怎样接起来？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

findConstraints从agent cwd向父目录找agent-constraints/core/constraints.md，tools按symptom/show/l0/path/where取目录、命中规则或全文。symptom按词打分取前五及引用ID正文，是文本启发式检索，不是验证规则适用/冲突的语义引擎。

pre-step await next并观察decision形状，在默认inject开启且agent未入WeakSet、decision.kind enter且有messages时，buildBrief读取症状目录，复制第一条已有message结构、替换内容并拼id后缀，然后concat注入，只记每agent一次。没有每步重注完整L0，也没有工具前强制验证全部规则；配置/文件后续改变不自动清WeakSet。

贡献在项目规则资产、按需查询和一次性入口提醒，加上模板/安装便利。DISTILL/MERGE/PRUNE由人或AI按文档执行，规则升级是工作流规范而非插件代码自行推导。注入保留模板source等元数据，不显式标plugin来源，模型/日志是否把它视用户消息依宿主，不能泛称完全透明无语义影响。

#### 证据与依据

**依据 1 · 源码核查**：[index.mjs:773-814](https://github.com/962599627/agent-development-constraints/blob/fc9af918ac14f03d63bee299cab90862adbc8963/index.mjs#L773-L814)

cwd与向父找规则。

<details>
<summary>查看原文（42行）</summary>

```text
function getCwd(agent) {
  try {
    const s = agent && agent.session
    const candidates = [
      s && s.header && s.header.cwd,
      s && s.header && s.header.meta && s.header.meta.cwd,
      s && s.meta && s.meta.cwd,
      s && s.cwd,
      agent && agent.cwd,
    ]
    for (const c of candidates) {
      if (typeof c === 'string' && c.length > 0) return c
    }
  } catch {
    // 忽略：降级到 process.cwd()
  }
  return process.cwd()
}

/**
 * 从给定目录向上找规则库。
 * 只走"当前项目"这一条链 —— 找到文件系统根就停，不会横向翻别的目录。
 */
function findConstraints(from) {
  let dir = resolve(from)
  for (;;) {
    const candidate = join(dir, CONSTRAINTS_REL)
    if (existsSync(candidate)) return candidate
    const parent = dirname(dir)
    if (parent === dir) return null // 到根了
    dir = parent
  }
}

/** 读取规则库；读不到返回 null（未安装指令包的项目不该报错） */
function loadConstraints(cwd) {
  try {
    const path = findConstraints(cwd)
    if (!path) return null
    return { path, text: readFileSync(path, 'utf8') }
  } catch {
    return null
```

</details>

**依据 2 · 源码核查**：[index.mjs:1166-1199](https://github.com/962599627/agent-development-constraints/blob/fc9af918ac14f03d63bee299cab90862adbc8963/index.mjs#L1166-L1199)

symptom启发式前五和规则正文。

<details>
<summary>查看原文（34行）</summary>

```text
          const terms = [q, ...q.split(/\s+/).filter(Boolean)]
          const scored = index
            .map((r) => {
              let score = 0
              for (const t of terms) score = Math.max(score, symptomScore(r, t))
              return { r, score }
            })
            .filter((x) => x.score > 0)
            .sort((a, b) => b.score - a.score)

          if (!scored.length) {
            const cats = [...new Set(index.map((r) => r.category))]
            return (
              `constraints: 目录里没有匹配 ${JSON.stringify(q)} 的条目。\n` +
              `可用分类：${cats.join(' · ')}\n` +
              '换个说法再试，或 action=symptom（不带 q）看完整目录。'
            )
          }

          const top = scored.slice(0, 5).map((x) => x.r)
          const ids = [...new Set(top.flatMap((r) => r.refIds))]
          const bodies = extractRulesById(found.text, ids)

          const out = [`按症状查：${q}`]
          for (const r of top) {
            out.push(`\n· 【${r.category}】${r.symptom}`)
            out.push(`  很可能的原因：${r.cause}`)
            out.push(`  详见：${r.ref}`)
          }
          if (bodies.length) {
            out.push('\n──────── 命中规则全文 ────────')
            for (const b of bodies) {
              out.push(`\n### ${b.id} ${b.title}\n${b.body}`)
            }
```

</details>

**依据 3 · 源码核查**：[index.mjs:1081-1090](https://github.com/962599627/agent-development-constraints/blob/fc9af918ac14f03d63bee299cab90862adbc8963/index.mjs#L1081-L1090)

brief是目录/用法。

<details>
<summary>查看原文（10行）</summary>

```text
function buildBrief(cwd) {
  const found = loadConstraints(cwd)
  if (!found) return null
  const index = extractSymptomIndex(found.text)
  const toc = buildSymptomBrief(index)
  const head = '【开发约束 · 目录】出问题先按症状定位，别硬猜：'
  const hint =
    '用法：constraints action=symptom q="你的症状"（返回命中的条目 + 对应规则全文）；' +
    'constraints action=l0 取铁律；action=show 取全部规则。'
  return toc ? `${head}\n${toc}\n${hint}` : `${head}${hint}`
```

</details>

**依据 4 · 源码核查**：[index.mjs:1579-1620](https://github.com/962599627/agent-development-constraints/blob/fc9af918ac14f03d63bee299cab90862adbc8963/index.mjs#L1579-L1620)

每agent一次复制消息/concat。

<details>
<summary>查看原文（42行）</summary>

```text
        // ---------- 注入（受配置开关控制，每会话一次）----------
        try {
          if (configInjectEnabled()) {
            const agent = payload && payload.agent
            const canInject =
              Boolean(agent) &&
              !injectedAgents.has(agent) &&
              decision &&
              decision.kind === 'enter' &&
              Array.isArray(decision.messages) &&
              decision.messages.length > 0
            if (canInject) {
              const brief = buildBrief(getCwd(agent))
              if (brief) {
                // 用**真实的已有消息当模板**复制结构 —— 不猜字段。
                //
                // 这是本段最关键的设计：探针还没给出 UserMessage 的确切形状，
                // 但 decision.messages[0] 本身就是一条真实的 UserMessage，
                // 复制它比按文档拼一个更安全（上次崩就是因为拼得不完整）。
                const tpl = decision.messages[0]
                const injected = Object.assign({}, tpl)
                if (Array.isArray(tpl.content) && tpl.content.length > 0) {
                  injected.content = [
                    Object.assign({}, tpl.content[0], { text: brief }),
                  ]
                } else {
                  injected.content = [{ type: 'text', text: brief }]
                }
                // id 必须唯一，否则可能与已存在的消息冲突
                if (typeof tpl.id === 'string') injected.id = tpl.id + ':constraints'
                injectedAgents.add(agent)
                writeProbe('inject-applied', {
                  briefLength: brief.length,
                  templateKeys: Object.keys(tpl),
                  templateContentKeys:
                    Array.isArray(tpl.content) && tpl.content[0]
                      ? Object.keys(tpl.content[0])
                      : null,
                })
                return Object.assign({}, decision, {
                  messages: decision.messages.concat([injected]),
                })
```

</details>

**依据 5 · 源码核查**：[core/DISTILL.md:71-82](https://github.com/962599627/agent-development-constraints/blob/fc9af918ac14f03d63bee299cab90862adbc8963/core/DISTILL.md#L71-L82)

提炼提示词而非自动状态机。

<details>
<summary>查看原文（12行）</summary>

````text
## 可直接使用的提炼提示词

把下面这段连同原始材料一起给 AI：

```text
你是一个开发约束提炼器。下面是我的开发记录/会话片段。

请提炼出**可复用**的开发约束，严格遵守：

1. 每条规则必须包含四个字段，缺一不可：
   - 规则：一句话可执行的约束
   - 触发：什么时候该想起来（具体到"写什么代码时"）
````

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 隐私说明、跨会话审计与状态路由怎样对照？

**研究主题**：缺陷与关键质疑

#### 完整回答

PRIVACY写只读当前仓库、不读聊天、不存日志/缓存，这与当前DSH面不一致。index从home/.dsh/sessions递归找session.v4.jsonl.zstd，筛近14天/大于50KiB的最多8会话，解压解析tool/call排名；probe写home/.dsh/agent-constraints-probe.json最近20条，config也持久写同家目录，audit有进程全局缓存。没有发现主动上传代码不等于没有跨项目读取、本地持久化或HTTP服务。

status注册在宿主webServer，GET返回cwd、规则路径、配置/probe路径、cost和contextAudit，POST仅布尔inject且4096字节上限，但没有独立connection.requestRejection、Origin/Host或请求身份检查。注释称loopback/非敏感不是部署访问控制证据；实际可达性由宿主绑定/代理/认证链决定，未发请求或声称已泄漏。

lastObservedCwd仅首次有值写，lastObservedAgent后续更新、lastAuditCache只首次补算，所以状态卡可混用第一项目路径和另一agent/旧审计。配置是进程用户全局开关，非每会话；多项目/多用户环境不保证卡片与当前会话对应。

#### 证据与依据

**依据 1 · 作者声明**：[PRIVACY.md:23-37](https://github.com/962599627/agent-development-constraints/blob/fc9af918ac14f03d63bee299cab90862adbc8963/PRIVACY.md#L23-L37)

作者当前仓库/不读聊天/不缓存承诺。

<details>
<summary>查看原文（15行）</summary>

```text
### ② 只读你在的那个仓库

所有读取都限制在**你执行脚本时的仓库目录内**：

- `git ls-files`（只列该仓库**已跟踪**的文件）
- `$ROOT` 下的路径

**它不会**去读：其他项目目录、浏览器数据、环境变量里的密钥、SSH key、
聊天记录、剪贴板、任何仓库外的文件。

### ③ 不保存、不缓存、不自动提交

- 检查结果**只打印到终端**，不写日志、不入库、不建缓存
- `contribute` 只生成一个**本地 md 文件**，**提交与否完全由你决定**
- **没有任何自动提交、自动推送、后台常驻**
```

</details>

**依据 2 · 源码核查**：[index.mjs:476-526](https://github.com/962599627/agent-development-constraints/blob/fc9af918ac14f03d63bee299cab90862adbc8963/index.mjs#L476-L526)

跨家目录会话扫描与采样。

<details>
<summary>查看原文（51行）</summary>

```text
function listSessionFiles() {
  const root = join(homedir(), '.dsh', 'sessions')
  const out = []
  const walk = (dir, depth) => {
    if (depth > 3) return
    let ents
    try {
      ents = readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const e of ents) {
      const p = join(dir, e.name)
      if (e.isDirectory()) {
        walk(p, depth + 1)
      } else if (e.name === 'session.v4.jsonl.zstd') {
        try {
          const st = statSync(p)
          out.push({ path: p, size: st.size, mtimeMs: st.mtimeMs })
        } catch {
          // 读不到的跳过
        }
      }
    }
  }
  walk(root, 0)
  return out.sort((a, b) => b.mtimeMs - a.mtimeMs)
}

/**
 * **跨会话**统计工具调用次数 —— 这是修 `disable` 判据的核心。
 *
 * ## 为什么必须跨会话
 *
 * 只看当前会话，会把"我这个会话恰好没调 SSH"判成"你不需要 SSH"，
 * 于是建议你关掉真正在用的东西。**那是用样本代替总体。**
 *
 * 实测差异（2026-10-05）：某批工具在**当前会话 0 次**，
 * 但**跨会话被调用了 20+ 次** —— 只看当前会话就会误报它们"没用过"。
 *
 * ⚠️ 代价：要解压并解析历史会话文件，实测 5 个会话约 450 ms。
 * 所以调用方**应当缓存**结果，不要每次请求都跑。
 *
 * @param maxSessions 最多看几个会话（默认 8）
 * @param maxAgeDays  只看最近几天内的（默认 14）
 */
function analyzeRecentSessions(maxSessions = 8, maxAgeDays = 14) {
  const cutoff = Date.now() - maxAgeDays * 24 * 60 * 60 * 1000
  const all = listSessionFiles()
  // 太小的文件只有会话头，没有内容可统计
  const files = all.filter((f) => f.size > 50 * 1024 && f.mtimeMs >= cutoff).slice(0, maxSessions)
```

</details>

**依据 3 · 源码核查**：[index.mjs:534-568](https://github.com/962599627/agent-development-constraints/blob/fc9af918ac14f03d63bee299cab90862adbc8963/index.mjs#L534-L568)

解压/排名/样本统计。

<details>
<summary>查看原文（35行）</summary>

```text
  for (const f of files) {
    const res = decompressSessionFile(f.path)
    frames += res.frames
    frameFailures += res.failed
    let lines = 0
    for (const line of res.text.split('\n')) {
      if (!line.trim()) continue
      lines++
      try {
        const ev = JSON.parse(line)
        if (ev.type === 'tool/call' && ev.data && ev.data.name) {
          merged[ev.data.name] = (merged[ev.data.name] || 0) + 1
          toolCalls++
        }
      } catch {
        // 单行解析失败不影响整体
      }
    }
    scanned.push({ session: basename(dirname(f.path)), lines, frames: res.frames })
  }

  const ranking = Object.keys(merged)
    .map((name) => ({ name, calls: merged[name] }))
    .sort((a, b) => b.calls - a.calls)

  return {
    sessionsScanned: files.length,
    totalSessions: all.length,
    maxAgeDays,
    toolCalls,
    distinctToolsUsed: ranking.length,
    frames,
    frameFailures,
    ranking,
    scanned,
```

</details>

**依据 4 · 源码核查**：[index.mjs:86-111](https://github.com/962599627/agent-development-constraints/blob/fc9af918ac14f03d63bee299cab90862adbc8963/index.mjs#L86-L111)

probe本地持久化。

<details>
<summary>查看原文（26行）</summary>

```text
function writeProbe(stage, extra) {
  try {
    const file = join(homedir(), '.dsh', 'agent-constraints-probe.json')
    const entry = {
      stage,
      time: new Date().toISOString(),
      node: process.version,
      cwd: process.cwd(),
      pid: process.pid,
      ...extra,
    }
    // 累积而不是覆盖：一次启动里 apply 可能走多条注册路线，
    // 只看最后一条会漏掉"哪条真的成功了"。
    let history = []
    try {
      if (existsSync(file)) {
        const prev = JSON.parse(readFileSync(file, 'utf8'))
        history = Array.isArray(prev) ? prev : [prev]
      }
    } catch {
      history = []
    }
    history.push(entry)
    // 只保留最近 20 条，避免无限增长
    if (history.length > 20) history = history.slice(-20)
    writeFileSync(file, JSON.stringify(history, null, 2), 'utf8')
```

</details>

**依据 5 · 源码核查**：[index.mjs:132-154](https://github.com/962599627/agent-development-constraints/blob/fc9af918ac14f03d63bee299cab90862adbc8963/index.mjs#L132-L154)

全局配置直写。

<details>
<summary>查看原文（23行）</summary>

```text
const CONFIG_FILE = join(homedir(), '.dsh', 'agent-constraints.json')

/** 默认：注入**开启**。每会话只多 41 tokens，换来"AI 不会忘记有约束" */
const DEFAULT_CONFIG = { inject: true }

function loadConfig() {
  try {
    if (!existsSync(CONFIG_FILE)) return Object.assign({}, DEFAULT_CONFIG)
    const parsed = JSON.parse(readFileSync(CONFIG_FILE, 'utf8'))
    return Object.assign({}, DEFAULT_CONFIG, parsed && typeof parsed === 'object' ? parsed : {})
  } catch {
    // 配置损坏时用默认值，绝不让它影响会话
    return Object.assign({}, DEFAULT_CONFIG)
  }
}

function saveConfig(patch) {
  const next = Object.assign({}, loadConfig(), patch || {})
  try {
    writeFileSync(CONFIG_FILE, JSON.stringify(next, null, 2), 'utf8')
    return next
  } catch {
    return null
```

</details>

**依据 6 · 源码核查**：[index.mjs:1505-1519](https://github.com/962599627/agent-development-constraints/blob/fc9af918ac14f03d63bee299cab90862adbc8963/index.mjs#L1505-L1519)

cwd首次/agent更新/audit首次。

<details>
<summary>查看原文（15行）</summary>

```text
          try {
            const c = getCwd(payload && payload.agent)
            if (c && !lastObservedCwd) lastObservedCwd = c
            const pa = payload && payload.agent
            const psess = pa && pa.session
            // 记下 agent 引用：状态路由（HTTP handler）里没有 agent，
            // 但它需要在卡片打开时**按需**算出上下文占用。
            // 只记引用不算数据 —— 计算交给 computeAuditCache，避免每步重算。
            if (pa) lastObservedAgent = pa

            // 算一次并缓存（占用在会话内稳定：工具集不变）。
            // ⚠️ 只算一次的原因：schemas() + 多 frame 解压历史会话约 450 ms，
            // 而 pre-step 每步都跑 —— 每步重算就是 C-011 说的常驻浪费。
            if (!lastAuditCache) {
              lastAuditCache = computeAuditCache(pa)
```

</details>

**依据 7 · 源码核查**：[index.mjs:1650-1705](https://github.com/962599627/agent-development-constraints/blob/fc9af918ac14f03d63bee299cab90862adbc8963/index.mjs#L1650-L1705)

status无独立守卫及POST上限。

<details>
<summary>查看原文（56行）</summary>

```text
            name: 'agent-constraints-status',
            kind: 'exact',
            path: '/agent-development-constraints/status',
            handler: async (req, res) => {
              const send = (code, body) => {
                try {
                  res.writeHead(code, {
                    'content-type': 'application/json',
                    // ⚠️ 禁用缓存：卡片第一次请求时 contextAudit 可能还是 null
                    // （早于首次 pre-step）。如果这个"不完整"的响应被浏览器缓存，
                    // 之后每次请求（含点「刷新」）都会命中缓存拿到同一份旧数据
                    // —— 表现为"刷新按钮毫无反应"。实测就是这个现象。
                    'cache-control': 'no-store, no-cache, must-revalidate',
                    pragma: 'no-cache',
                    expires: '0',
                  })
                  res.end(JSON.stringify(body))
                } catch {
                  // 响应已发出，忽略
                }
              }

              // 只接受 GET（读状态）与 POST（写配置）。
              // ⚠️ 本路由只监听 loopback（host 自己起的 web server），
              // 且只暴露"规则库路径/开关"这类非敏感信息，写操作也只改一个布尔。
              if (req.method !== 'GET' && req.method !== 'POST') {
                send(405, { error: 'method not allowed' })
                return
              }

              try {
                if (req.method === 'POST') {
                  // 读请求体（体积很小，设个上限防意外）
                  const chunks = []
                  let size = 0
                  for await (const chunk of req) {
                    size += chunk.length
                    if (size > 4096) {
                      send(413, { error: 'body too large' })
                      return
                    }
                    chunks.push(chunk)
                  }
                  let patch = {}
                  if (chunks.length) {
                    try {
                      patch = JSON.parse(Buffer.concat(chunks).toString('utf8'))
                    } catch {
                      send(400, { error: 'invalid json' })
                      return
                    }
                  }
                  // 只接受已知字段，且强制布尔 —— 不把任意对象写进配置文件
                  const clean = {}
                  if (patch && typeof patch.inject === 'boolean') clean.inject = patch.inject
                  const saved = saveConfig(clean)
```

</details>

**依据 8 · 源码核查**：[index.mjs:1715-1751](https://github.com/962599627/agent-development-constraints/blob/fc9af918ac14f03d63bee299cab90862adbc8963/index.mjs#L1715-L1751)

GET路径/费用/审计内容。

<details>
<summary>查看原文（37行）</summary>

```text
                // GET：状态 + 当前配置 + 成本摘要
                // ⚠️ cwd 优先用 pre-step 观测到的；若还没观测到但有 agent 引用，
                // **现场从 agent 里取**（与 contextAudit 同理，别让卡片显示无意义的进程 cwd）。
                const observedCwd = lastObservedCwd || (lastObservedAgent ? getCwd(lastObservedAgent) : null)
                const cwd = observedCwd || process.cwd()
                const found = loadConstraints(cwd)
                const usage = loadUsage()
                send(200, {
                  name: 'agent-development-constraints',
                  version: readOwnVersion(),
                  constraintsPath: found ? found.path : null,
                  cwd,
                  cwdSource: observedCwd ? 'session' : 'process',
                  injectEnabled: configInjectEnabled(),
                  configFile: CONFIG_FILE,
                  probeFile: join(homedir(), '.dsh', 'agent-constraints-probe.json'),
                  // 上下文占用摘要。
                  // ⚠️ 缓存为空但手上有 agent 时**现场补算** ——
                  // 卡片可能在 pre-step 触发之前就被打开（而且它只 fetch 一次），
                  // 只读缓存会让卡片一片空白。实测就是这个现象。
                  contextAudit: lastAuditCache || (lastObservedAgent ? computeAuditCache(lastObservedAgent) : null),
                  // 成本摘要（卡片显示用；拿不到就是 null）
                  cost: usage
                    ? {
                        todayKey: usage.todayKey,
                        todayCost: Number(usage.today.cost.toFixed(4)),
                        todayCalls: usage.today.calls,
                        todayInputTokens: usage.today.inputTokens,
                        todayOutputTokens: usage.today.outputTokens,
                        todayCacheReadTokens: usage.today.cacheReadTokens,
                        totalCost: Number(usage.total.cost.toFixed(4)),
                        totalCalls: usage.total.calls,
                        dayCount: usage.dayCount,
                        balance: usage.balance,
                        currency: usage.currency,
                      }
                    : null,
```

</details>

#### 缺口

- 宿主status路由的真实网络绑定/认证与多会话卡片归属未有部署证据。
  **影响**：不能给远程权限或当前会话正确对应验收。
  **进一步探讨**：可继续核同版本宿主路由信任和双项目交错，按认证session选择资料而非全局last引用。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 项目安装与贡献是否真的幂等且只导新增？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

install.sh保留已有constraints.md，force才覆盖，这是规则资产保护的具体优点。流程、stacks、templates/scripts和文档始终cp -f更新，根.githooks也同名覆盖；因此“幂等”只是不重复规则引用且默认保主库，不代表用户自改模板/技术栈/hook都受保护。

AGENTS类文件从AGENTS.md/CLAUDE.md/GEMINI.md/.cursorrules取首个，按HTML begin/end替换。若原文件只有begin缺end，awk会skip直到EOF，可能丢余下内容；没有先验证成对标记/备份/事务。命令不自动提交/push，但安装本身会改项目指导文件和hook资产。hooks独立命令设置core.hooksPath，默认安装复制hook但不启用该配置，不能混淆。

Linux install.sh没有写.baseline，contribute.sh无基线则导全部规则；PowerShell安装另有baseline，这造成平台“只导你的新增”不一致。新增比较按ID，不发现相同ID规则内容变更；来源项目名/规则证据可能包含敏感业务，导出本地不等于已经脱敏。作者流程的来源计数与抽象合并依维护者认真核材料，不是自动独立证明。

#### 证据与依据

**依据 1 · 源码核查**：[install.sh:51-90](https://github.com/962599627/agent-development-constraints/blob/fc9af918ac14f03d63bee299cab90862adbc8963/install.sh#L51-L90)

cp更新与主库保留。

<details>
<summary>查看原文（40行）</summary>

```text
# 1. 流程文档与模板：总是更新
cp -f "$SRC/core/DISTILL.md" "$PKG/core/"
cp -f "$SRC/core/PRUNE.md"   "$PKG/core/"
cp -f "$SRC/core/MERGE.md"   "$PKG/core/"
# 技术栈坑位库（按语言分组：python / javascript / shell / git / platform）
cp -f "$SRC/core/stacks/"*   "$PKG/core/stacks/"
cp -f "$SRC"/templates/*     "$PKG/templates/"
cp -f "$SRC/README.md"        "$PKG/"
cp -f "$SRC/README.zh-CN.md"  "$PKG/"
cp -f "$SRC/CONTRIBUTING.md" "$PKG/"
cp -f "$SRC/PRIVACY.md"      "$PKG/"
cp -f "$SRC/CHANGELOG.md"    "$PKG/"
cp -f "$SRC/VERSION"         "$PKG/"

# 脱敏检查（防止把自身安全信息推上去）
cp -f "$SRC/.sanitize-deny.txt" "$PKG/"
mkdir -p "$PKG/scripts"
cp -f "$SRC/scripts/"* "$PKG/scripts/"

# CLI 与包元数据 —— 让安装后的项目也能用 agent-constraints check/hooks/...
# （实测踩过：漏拷这两样，装完只剩 scripts/ 下的原始脚本）
if [ -d "$SRC/bin" ]; then
  mkdir -p "$PKG/bin"
  cp -f "$SRC/bin/"* "$PKG/bin/"
fi
[ -f "$SRC/package.json" ] && cp -f "$SRC/package.json" "$PKG/"

# ⚠️ git hooks 必须放在**目标项目根**（git 只认仓库根的 .githooks）
if [ -d "$SRC/.githooks" ]; then
  mkdir -p "$TARGET_ROOT/.githooks"
  cp -f "$SRC/.githooks/"* "$TARGET_ROOT/.githooks/"
fi
echo "  ✓ 流程文档与模板已更新"

# 2. 规则库：默认不覆盖
if [ -f "$PKG/core/constraints.md" ] && [ "$FORCE" -eq 0 ]; then
  echo "  ⚠ 已存在 core/constraints.md —— 保留你积累的规则不动"
  echo "    （如需覆盖加 --force，覆盖前请先备份）"
else
  cp -f "$SRC/core/constraints.md" "$PKG/core/"
```

</details>

**依据 2 · 源码核查**：[install.sh:94-125](https://github.com/962599627/agent-development-constraints/blob/fc9af918ac14f03d63bee299cab90862adbc8963/install.sh#L94-L125)

AGENTS标记替换无配对验证。

<details>
<summary>查看原文（32行）</summary>

```text
# 3. 注入 AGENTS.md 引用（幂等）
if [ "$SKIP_AGENTS" -eq 0 ]; then
  BEGIN="<!-- agent-constraints:begin -->"
  END="<!-- agent-constraints:end -->"

  AGENTS=""
  for name in AGENTS.md CLAUDE.md GEMINI.md .cursorrules; do
    if [ -f "$TARGET_ROOT/$name" ]; then AGENTS="$TARGET_ROOT/$name"; break; fi
  done
  [ -z "$AGENTS" ] && AGENTS="$TARGET_ROOT/AGENTS.md"

  BLOCK="$BEGIN
## 开发约束（必读）

本项目所有开发约束见 \`agent-constraints/core/constraints.md\`。
动手前先读它；每完成一个功能或修完一个 bug，按 \`agent-constraints/core/DISTILL.md\` 提炼新规则。
$END"

  if [ -f "$AGENTS" ] && grep -qF "$BEGIN" "$AGENTS"; then
    # 已注入：替换旧块，保证引用是最新的
    # 用 awk 做块替换，避免 sed 跨平台差异
    awk -v begin="$BEGIN" -v end="$END" -v block="$BLOCK" '
      index($0, begin) { print block; skip=1; next }
      index($0, end)   { skip=0; next }
      !skip            { print }
    ' "$AGENTS" > "$AGENTS.tmp" && mv "$AGENTS.tmp" "$AGENTS"
    echo "  ✓ $(basename "$AGENTS") 中的引用已刷新"
  else
    # 首次注入（文件不存在则创建）
    [ -f "$AGENTS" ] || : > "$AGENTS"
    printf '\n%s\n' "$BLOCK" >> "$AGENTS"
    echo "  ✓ 已向 $(basename "$AGENTS") 注入引用"
```

</details>

**依据 3 · 源码核查**：[install.sh:129-139](https://github.com/962599627/agent-development-constraints/blob/fc9af918ac14f03d63bee299cab90862adbc8963/install.sh#L129-L139)

hook作为后续显式动作。

<details>
<summary>查看原文（11行）</summary>

```text
echo ""
echo "完成。下一步："
echo "  1. 打开 core/constraints.md —— 删掉不适用的 L0 / L1 条目"
echo "     （重点看「快速定位 · 按症状查」表，那是出问题时的入口）"
echo "  2. 打开 core/stacks/ —— 技术栈坑位库，整组替换成你自己的栈"
echo "     （python / javascript / shell / git / platform）"
echo "  3. 每完成一个功能/修完一个 bug，跑一次 core/DISTILL.md 的流程"
echo "  4. L0 超过 15 条时，跑一次 core/PRUNE.md"
echo "  5. 想把你的规则贡献回主库：跑 contribute.sh，再按 CONTRIBUTING.md 提交"
echo "  6. 启用脱敏检查（每次提交自动拦截敏感信息）：scripts/install-hooks.sh"
echo ""
```

</details>

**依据 4 · 源码核查**：[scripts/install-hooks.sh:25-31](https://github.com/962599627/agent-development-constraints/blob/fc9af918ac14f03d63bee299cab90862adbc8963/scripts/install-hooks.sh#L25-L31)

显式设置hooksPath。

```text
if [ -z "$ROOT" ]; then
    echo "错误：找不到同时含 .git 与 .githooks/pre-commit 的仓库根" >&2
    exit 1
fi

cd "$ROOT"
git config core.hooksPath .githooks
```

**依据 5 · 源码核查**：[contribute.sh:46-64](https://github.com/962599627/agent-development-constraints/blob/fc9af918ac14f03d63bee299cab90862adbc8963/contribute.sh#L46-L64)

无baseline导全部/按ID比较。

<details>
<summary>查看原文（19行）</summary>

```text
# 2. 基线
BASELINE_FILE="$PKG/.baseline"
BASELINE_IDS=""
HAS_BASELINE=0

if [ -f "$BASELINE_FILE" ] && [ "$ALL" -eq 0 ]; then
  HAS_BASELINE=1
  BASELINE_IDS="$(grep -oE '^[A-Z]-[0-9]+' "$BASELINE_FILE" || true)"
fi

BASELINE_COUNT="$(printf '%s\n' "$BASELINE_IDS" | grep -c . || true)"

# 3. 找新增
if [ "$ALL" -eq 1 ] || [ "$HAS_BASELINE" -eq 0 ]; then
  NEW_IDS="$CURRENT_IDS"
  MODE="全部规则（无基线或指定了 --all）"
else
  NEW_IDS="$(comm -23 <(printf '%s\n' "$CURRENT_IDS" | sort -u) <(printf '%s\n' "$BASELINE_IDS" | sort -u) || true)"
  MODE="新增规则（对比安装时的基线）"
```

</details>

**依据 6 · 源码核查**：[contribute.sh:83-93](https://github.com/962599627/agent-development-constraints/blob/fc9af918ac14f03d63bee299cab90862adbc8963/contribute.sh#L83-L93)

贡献包含项目/规则与来源说明。

<details>
<summary>查看原文（11行）</summary>

```text
{
  echo "# 开发约束贡献包"
  echo ""
  echo "- 生成时间：$(date '+%Y-%m-%d %H:%M')"
  echo "- 来源项目：$(basename "$PROJECT")"
  echo "- 基于约束包版本：$VERSION"
  echo "- 导出模式：$MODE"
  echo "- 规则数：$NEW_COUNT"
  echo ""
  echo "> 提交方式见仓库的 CONTRIBUTING.md。维护者合并时会把同一「违反场景」的规则合并，"
  echo "> 并让你的来源计入该规则的**独立发现次数**（≥3 次会升级为铁律）。"
```

</details>

**依据 7 · 源码核查**：[install.ps1:148-171](https://github.com/962599627/agent-development-constraints/blob/fc9af918ac14f03d63bee299cab90862adbc8963/install.ps1#L148-L171)

PS baseline写入路径。

<details>
<summary>查看原文（24行）</summary>

```text
# 记录本版本包含哪些规则 ID，供 contribute.ps1 识别"**你**新增的规则"。
# 关键设计：**只在首次安装时写**，之后**永不更新** ——
# 若每次都刷新，你后续自己加的规则就会被当成主库原有内容而漏报（丢失你的资产）。
# 代价是主库升级带来的新规则可能出现在你的贡献包里，这属于可接受的噪音。
$baselineFile = Join-Path $pkgDir ".baseline"
if (-not (Test-Path $baselineFile)) {
    $ver = "unknown"
    $vf = Join-Path $src "VERSION"
    if (Test-Path $vf) { $ver = (Get-Content $vf -Raw).Trim() }

    $ids = @()
    if (Test-Path $constraints) {
        $ids = Select-String -Path $constraints -Pattern '^###\s+([A-Z]-\d+)' |
               ForEach-Object { $_.Matches[0].Groups[1].Value }
    }

    $bl = @(
        "# version: $ver",
        "# installed: $(Get-Date -Format 'yyyy-MM-dd HH:mm')",
        "# 本文件记录安装时的规则 ID，供 contribute 脚本识别你新增的规则。",
        "# 请勿手工修改，也请勿在升级时重建它（会丢失你已积累的规则记录）。"
    ) + $ids
    [System.IO.File]::WriteAllText($baselineFile, ($bl -join "`r`n"), (New-Object System.Text.UTF8Encoding $false))
    Write-Host "  ✓ 已保存基线（$($ids.Count) 条规则），贡献脚本靠它识别你的新增" -ForegroundColor Green
```

</details>

#### 缺口

- 用户已有模板/hook/缺配对标记及跨平台贡献产物未受控安装复现。
  **影响**：不能保证所有项目文件保留或贡献仅个人新增。
  **进一步探讨**：可丢弃repo对照自改stacks/hook、缺end、同ID改内容与Linux/PS基线，核前后hash和可恢复备份。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 依赖与使用流程是什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=18与DSH tools/pre-step服务 | DSH面 | 工具/注入 | runtime shape依宿主代际，零npm依赖非零API依赖 |
| 项目agent-constraints规则文件 | 规则面 | cwd/父目录查找 | 未安装仅返回提示，不自动生成资产 |
| Bash/awk/cp或PowerShell | 安装/贡献 | 改项目指导、复制模板 | 不同平台baseline行为需核 |
| Git与可选hooksPath | 检查网 | 提交脱敏规则匹配 | 可绕过且不覆盖所有敏感信息 |
| home/.dsh日志/usage文件格式 | 成本审计 | 采样调用/费用 | 固定home路径不跟随任意DSH_HOME |
| 用户审核规则/来源与披露 | 业务前提 | 防无关/冲突规则传播 | 提示目录不能替代组织政策 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 选面 | 先决定纯规则文档/CLI或DSH运行面 | 各面读取/写入范围明确 |
| 准备 | 备份指导/模板/hook，删不适用规则 | 不把示例规则直接当项目命令 |
| 安装 | 指定目标/skip指导等选项 | 对照diff，尤其用户自改资产 |
| 读取 | 症状查规则全文/证据 | 先核适用与真实原因，不照搬 |
| 演化 | 完成后按DISTILL/PRUNE人工提炼 | 规则有检查/证据和归档理由 |
| 贡献 | 核baseline/敏感内容再手动分享 | 无自动提交/推送授权 |
| 审计 | 明确跨会话采样范围/卡片对应 | 0调用不当从未需要工具 |

本轮不安装、不改AGENTS/Hook、不读用户真实会话、不执行目标脚本。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-4](https://github.com/962599627/agent-development-constraints/blob/fc9af918ac14f03d63bee299cab90862adbc8963/package.json#L1-L4)

固定包版本。

```text
{
  "name": "agent-development-constraints",
  "version": "0.26.8",
  "description": "Self-evolving development constraints for AI coding agents — installs a rule library and injects it into every step.",
```

**依据 2 · 源码核查**：[package.json:68-70](https://github.com/962599627/agent-development-constraints/blob/fc9af918ac14f03d63bee299cab90862adbc8963/package.json#L68-L70)

包声明Node范围。

```text
  "engines": {
    "node": ">=18"
  },
```

**依据 3 · 源码核查**：[index.mjs:74-74](https://github.com/962599627/agent-development-constraints/blob/fc9af918ac14f03d63bee299cab90862adbc8963/index.mjs#L74-L74)

tools唯一静态inject。

```text
export const inject = ['tools']
```

**依据 4 · 源码核查**：[index.mjs:476-526](https://github.com/962599627/agent-development-constraints/blob/fc9af918ac14f03d63bee299cab90862adbc8963/index.mjs#L476-L526)

home固定日志路径。

<details>
<summary>查看原文（51行）</summary>

```text
function listSessionFiles() {
  const root = join(homedir(), '.dsh', 'sessions')
  const out = []
  const walk = (dir, depth) => {
    if (depth > 3) return
    let ents
    try {
      ents = readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const e of ents) {
      const p = join(dir, e.name)
      if (e.isDirectory()) {
        walk(p, depth + 1)
      } else if (e.name === 'session.v4.jsonl.zstd') {
        try {
          const st = statSync(p)
          out.push({ path: p, size: st.size, mtimeMs: st.mtimeMs })
        } catch {
          // 读不到的跳过
        }
      }
    }
  }
  walk(root, 0)
  return out.sort((a, b) => b.mtimeMs - a.mtimeMs)
}

/**
 * **跨会话**统计工具调用次数 —— 这是修 `disable` 判据的核心。
 *
 * ## 为什么必须跨会话
 *
 * 只看当前会话，会把"我这个会话恰好没调 SSH"判成"你不需要 SSH"，
 * 于是建议你关掉真正在用的东西。**那是用样本代替总体。**
 *
 * 实测差异（2026-10-05）：某批工具在**当前会话 0 次**，
 * 但**跨会话被调用了 20+ 次** —— 只看当前会话就会误报它们"没用过"。
 *
 * ⚠️ 代价：要解压并解析历史会话文件，实测 5 个会话约 450 ms。
 * 所以调用方**应当缓存**结果，不要每次请求都跑。
 *
 * @param maxSessions 最多看几个会话（默认 8）
 * @param maxAgeDays  只看最近几天内的（默认 14）
 */
function analyzeRecentSessions(maxSessions = 8, maxAgeDays = 14) {
  const cutoff = Date.now() - maxAgeDays * 24 * 60 * 60 * 1000
  const all = listSessionFiles()
  // 太小的文件只有会话头，没有内容可统计
  const files = all.filter((f) => f.size > 50 * 1024 && f.mtimeMs >= cutoff).slice(0, maxSessions)
```

</details>

**依据 5 · 源码核查**：[install.sh:94-125](https://github.com/962599627/agent-development-constraints/blob/fc9af918ac14f03d63bee299cab90862adbc8963/install.sh#L94-L125)

指导文件副作用。

<details>
<summary>查看原文（32行）</summary>

```text
# 3. 注入 AGENTS.md 引用（幂等）
if [ "$SKIP_AGENTS" -eq 0 ]; then
  BEGIN="<!-- agent-constraints:begin -->"
  END="<!-- agent-constraints:end -->"

  AGENTS=""
  for name in AGENTS.md CLAUDE.md GEMINI.md .cursorrules; do
    if [ -f "$TARGET_ROOT/$name" ]; then AGENTS="$TARGET_ROOT/$name"; break; fi
  done
  [ -z "$AGENTS" ] && AGENTS="$TARGET_ROOT/AGENTS.md"

  BLOCK="$BEGIN
## 开发约束（必读）

本项目所有开发约束见 \`agent-constraints/core/constraints.md\`。
动手前先读它；每完成一个功能或修完一个 bug，按 \`agent-constraints/core/DISTILL.md\` 提炼新规则。
$END"

  if [ -f "$AGENTS" ] && grep -qF "$BEGIN" "$AGENTS"; then
    # 已注入：替换旧块，保证引用是最新的
    # 用 awk 做块替换，避免 sed 跨平台差异
    awk -v begin="$BEGIN" -v end="$END" -v block="$BLOCK" '
      index($0, begin) { print block; skip=1; next }
      index($0, end)   { skip=0; next }
      !skip            { print }
    ' "$AGENTS" > "$AGENTS.tmp" && mv "$AGENTS.tmp" "$AGENTS"
    echo "  ✓ $(basename "$AGENTS") 中的引用已刷新"
  else
    # 首次注入（文件不存在则创建）
    [ -f "$AGENTS" ] || : > "$AGENTS"
    printf '\n%s\n' "$BLOCK" >> "$AGENTS"
    echo "  ✓ 已向 $(basename "$AGENTS") 注入引用"
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 成本审计与运行时恢复能支持什么解释？

**研究主题**：效果与总成本、工程质量与复用

#### 完整回答

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 安装资产/备份与宿主适配资源 | 清理无关规则、核安装资产与API | 人工整理/平台差异时间与费用未知 |
| 持续使用 | 每agent一次brief、两常驻工具schema、同步规则读取/采样解压 | 维护规则与阅读成本 | 固定41token等注释非全部上下文成本，实际usage未知 |
| 失败恢复 | probe覆盖/并发、错误卡片/安装文件恢复资源 | 排坏配置默认开启，diff与备份修复 | 无多文件事务/版本CAS，恢复时间/费用未知 |

#### 效果

| 目标 | 源码支持的增量 | 证据边界 |
| --- | --- | --- |
| 避免忘记规则入口 | 一次目录注入与按症状读全文 | 不强制执行、不自动纠错 |
| 限库膨胀 | 分层/DISTILL/PRUNE规范 | 15条等阈值为作者经验未验证 |
| 找工具成本候选 | schema近似体积与采样调用交叉 | 最近8会话未调用不等于以后可关 |
| 贡献复用 | 基线/ID抽取与人工MERGE | Linux无基线/同ID修改/独立性仍需核 |

audit只采近14天>50KiB最多8会话，旧/小/不可读日志可能漏；坏行跳过只计帧失败不计行错误。0调用给disable候选是启发式，不能据此自动卸载。computeAuditCache只第一次缓存，不随当前schema/会话更新。loadConfig坏JSON回默认inject true，保存probe/config直写无原子/CAS；这些是宽容可用性取舍，不能称状态正确性保证。

#### 证据与依据

**依据 1 · 源码核查**：[index.mjs:522-568](https://github.com/962599627/agent-development-constraints/blob/fc9af918ac14f03d63bee299cab90862adbc8963/index.mjs#L522-L568)

采样/跳坏行/排名。

<details>
<summary>查看原文（47行）</summary>

```text
function analyzeRecentSessions(maxSessions = 8, maxAgeDays = 14) {
  const cutoff = Date.now() - maxAgeDays * 24 * 60 * 60 * 1000
  const all = listSessionFiles()
  // 太小的文件只有会话头，没有内容可统计
  const files = all.filter((f) => f.size > 50 * 1024 && f.mtimeMs >= cutoff).slice(0, maxSessions)

  const merged = {}
  let toolCalls = 0
  let frames = 0
  let frameFailures = 0
  const scanned = []

  for (const f of files) {
    const res = decompressSessionFile(f.path)
    frames += res.frames
    frameFailures += res.failed
    let lines = 0
    for (const line of res.text.split('\n')) {
      if (!line.trim()) continue
      lines++
      try {
        const ev = JSON.parse(line)
        if (ev.type === 'tool/call' && ev.data && ev.data.name) {
          merged[ev.data.name] = (merged[ev.data.name] || 0) + 1
          toolCalls++
        }
      } catch {
        // 单行解析失败不影响整体
      }
    }
    scanned.push({ session: basename(dirname(f.path)), lines, frames: res.frames })
  }

  const ranking = Object.keys(merged)
    .map((name) => ({ name, calls: merged[name] }))
    .sort((a, b) => b.calls - a.calls)

  return {
    sessionsScanned: files.length,
    totalSessions: all.length,
    maxAgeDays,
    toolCalls,
    distinctToolsUsed: ranking.length,
    frames,
    frameFailures,
    ranking,
    scanned,
```

</details>

**依据 2 · 源码核查**：[index.mjs:708-743](https://github.com/962599627/agent-development-constraints/blob/fc9af918ac14f03d63bee299cab90862adbc8963/index.mjs#L708-L743)

按采样0次与schema估算作候选。

<details>
<summary>查看原文（36行）</summary>

```text
function computeAuditCache(agent) {
  try {
    const audit = auditToolSchemas({ agent })
    if (!audit || audit.error) return null

    const history = analyzeRecentSessions()
    const used = {}
    let usedBasis = ''
    if (history.distinctToolsUsed > 0) {
      for (const r of history.ranking) used[r.name] = r.calls
      usedBasis = '跨会话 ' + history.sessionsScanned + ' 个会话'
    } else {
      // 历史读不到 → 降级为当前会话，并**标注**降级
      const sess = analyzeSession({ agent })
      if (sess && sess.工具调用) {
        for (const row of sess.工具调用.排名) used[row.name] = row.calls
      }
      usedBasis = '仅当前会话（历史不可读）'
    }

    // 完整的逐工具明细 —— 卡片拿它画条形图。
    // ⚠️ 可以放心给全量：卡片走 HTTP 拿数据，**不进 AI 上下文**，没有 token 成本。
    const rows = (audit.all || []).map((r) => ({
      name: r.name,
      tokens: r.approxTokens,
      calls: used[r.name] || 0,
    }))
    rows.sort((a, b) => b.tokens - a.tokens)

    let savable = 0
    const candidates = []
    for (const r of rows) {
      if (r.tokens < 200) continue
      if (r.calls > 0) continue
      savable += r.tokens
      candidates.push(r.name)
```

</details>

**依据 3 · 源码核查**：[index.mjs:137-154](https://github.com/962599627/agent-development-constraints/blob/fc9af918ac14f03d63bee299cab90862adbc8963/index.mjs#L137-L154)

坏配置默认与直写。

<details>
<summary>查看原文（18行）</summary>

```text
function loadConfig() {
  try {
    if (!existsSync(CONFIG_FILE)) return Object.assign({}, DEFAULT_CONFIG)
    const parsed = JSON.parse(readFileSync(CONFIG_FILE, 'utf8'))
    return Object.assign({}, DEFAULT_CONFIG, parsed && typeof parsed === 'object' ? parsed : {})
  } catch {
    // 配置损坏时用默认值，绝不让它影响会话
    return Object.assign({}, DEFAULT_CONFIG)
  }
}

function saveConfig(patch) {
  const next = Object.assign({}, loadConfig(), patch || {})
  try {
    writeFileSync(CONFIG_FILE, JSON.stringify(next, null, 2), 'utf8')
    return next
  } catch {
    return null
```

</details>

**依据 4 · 源码核查**：[index.mjs:1515-1519](https://github.com/962599627/agent-development-constraints/blob/fc9af918ac14f03d63bee299cab90862adbc8963/index.mjs#L1515-L1519)

一次audit cache。

```text
            // 算一次并缓存（占用在会话内稳定：工具集不变）。
            // ⚠️ 只算一次的原因：schemas() + 多 frame 解压历史会话约 450 ms，
            // 而 pre-step 每步都跑 —— 每步重算就是 C-011 说的常驻浪费。
            if (!lastAuditCache) {
              lastAuditCache = computeAuditCache(pa)
```

#### 缺口

- 同任务规则使用前后的重犯率、上下文token和误关候选无对照。
  **影响**：不能量化自我演化收益/精简成本。
  **进一步探讨**：固定错误任务与真实使用标签，比较违反率、规则命中、总输入与禁用误报，不依据模型自述。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 当前是否值得推荐，进一步探索什么？

**研究主题**：采用判断、新假设与验证

#### 完整回答

先观察。文档式规则资产和症状查询有价值，但DSH隐私说明与跨会话/缓存实现不符，status权限/会话归属未闭合，Linux安装/贡献及指导文件更新也有具体数据保留边界。可先挑选文档方法人工使用，不能把本插件当硬执行守卫或自动自我学习方案直接安装到重要项目。

可探讨“规则适用与执行收据”。规则绑定项目/版本/触发/可执行检查与证据，读取时标示来源/未验证/冲突；注入用plugin来源，session级缓存与授权资料范围，路由fail-closed；安装先diff/备份/配对标记验证，基线同时存ID与内容hash，独立项目来源需去共同模板。

未实现。最小对照跨两个项目/会话、日志不可读、坏配置、缺end指导、自改hook/stacks和同ID变更，记录错误规则命中、越域读取/卡片、丢资产、贡献召回及人工成本；若更多规则/收据反而增加误触发和阅读负担，应优先缩库与明确范围。

#### 证据与依据

**依据 1 · 源码核查**：[index.mjs:1579-1620](https://github.com/962599627/agent-development-constraints/blob/fc9af918ac14f03d63bee299cab90862adbc8963/index.mjs#L1579-L1620)

plugin来源/session注入方案基线。

<details>
<summary>查看原文（42行）</summary>

```text
        // ---------- 注入（受配置开关控制，每会话一次）----------
        try {
          if (configInjectEnabled()) {
            const agent = payload && payload.agent
            const canInject =
              Boolean(agent) &&
              !injectedAgents.has(agent) &&
              decision &&
              decision.kind === 'enter' &&
              Array.isArray(decision.messages) &&
              decision.messages.length > 0
            if (canInject) {
              const brief = buildBrief(getCwd(agent))
              if (brief) {
                // 用**真实的已有消息当模板**复制结构 —— 不猜字段。
                //
                // 这是本段最关键的设计：探针还没给出 UserMessage 的确切形状，
                // 但 decision.messages[0] 本身就是一条真实的 UserMessage，
                // 复制它比按文档拼一个更安全（上次崩就是因为拼得不完整）。
                const tpl = decision.messages[0]
                const injected = Object.assign({}, tpl)
                if (Array.isArray(tpl.content) && tpl.content.length > 0) {
                  injected.content = [
                    Object.assign({}, tpl.content[0], { text: brief }),
                  ]
                } else {
                  injected.content = [{ type: 'text', text: brief }]
                }
                // id 必须唯一，否则可能与已存在的消息冲突
                if (typeof tpl.id === 'string') injected.id = tpl.id + ':constraints'
                injectedAgents.add(agent)
                writeProbe('inject-applied', {
                  briefLength: brief.length,
                  templateKeys: Object.keys(tpl),
                  templateContentKeys:
                    Array.isArray(tpl.content) && tpl.content[0]
                      ? Object.keys(tpl.content[0])
                      : null,
                })
                return Object.assign({}, decision, {
                  messages: decision.messages.concat([injected]),
                })
```

</details>

**依据 2 · 源码核查**：[index.mjs:1650-1705](https://github.com/962599627/agent-development-constraints/blob/fc9af918ac14f03d63bee299cab90862adbc8963/index.mjs#L1650-L1705)

路由权限方案基线。

<details>
<summary>查看原文（56行）</summary>

```text
            name: 'agent-constraints-status',
            kind: 'exact',
            path: '/agent-development-constraints/status',
            handler: async (req, res) => {
              const send = (code, body) => {
                try {
                  res.writeHead(code, {
                    'content-type': 'application/json',
                    // ⚠️ 禁用缓存：卡片第一次请求时 contextAudit 可能还是 null
                    // （早于首次 pre-step）。如果这个"不完整"的响应被浏览器缓存，
                    // 之后每次请求（含点「刷新」）都会命中缓存拿到同一份旧数据
                    // —— 表现为"刷新按钮毫无反应"。实测就是这个现象。
                    'cache-control': 'no-store, no-cache, must-revalidate',
                    pragma: 'no-cache',
                    expires: '0',
                  })
                  res.end(JSON.stringify(body))
                } catch {
                  // 响应已发出，忽略
                }
              }

              // 只接受 GET（读状态）与 POST（写配置）。
              // ⚠️ 本路由只监听 loopback（host 自己起的 web server），
              // 且只暴露"规则库路径/开关"这类非敏感信息，写操作也只改一个布尔。
              if (req.method !== 'GET' && req.method !== 'POST') {
                send(405, { error: 'method not allowed' })
                return
              }

              try {
                if (req.method === 'POST') {
                  // 读请求体（体积很小，设个上限防意外）
                  const chunks = []
                  let size = 0
                  for await (const chunk of req) {
                    size += chunk.length
                    if (size > 4096) {
                      send(413, { error: 'body too large' })
                      return
                    }
                    chunks.push(chunk)
                  }
                  let patch = {}
                  if (chunks.length) {
                    try {
                      patch = JSON.parse(Buffer.concat(chunks).toString('utf8'))
                    } catch {
                      send(400, { error: 'invalid json' })
                      return
                    }
                  }
                  // 只接受已知字段，且强制布尔 —— 不把任意对象写进配置文件
                  const clean = {}
                  if (patch && typeof patch.inject === 'boolean') clean.inject = patch.inject
                  const saved = saveConfig(clean)
```

</details>

**依据 3 · 源码核查**：[install.sh:94-125](https://github.com/962599627/agent-development-constraints/blob/fc9af918ac14f03d63bee299cab90862adbc8963/install.sh#L94-L125)

指导备份/标记验证基线。

<details>
<summary>查看原文（32行）</summary>

```text
# 3. 注入 AGENTS.md 引用（幂等）
if [ "$SKIP_AGENTS" -eq 0 ]; then
  BEGIN="<!-- agent-constraints:begin -->"
  END="<!-- agent-constraints:end -->"

  AGENTS=""
  for name in AGENTS.md CLAUDE.md GEMINI.md .cursorrules; do
    if [ -f "$TARGET_ROOT/$name" ]; then AGENTS="$TARGET_ROOT/$name"; break; fi
  done
  [ -z "$AGENTS" ] && AGENTS="$TARGET_ROOT/AGENTS.md"

  BLOCK="$BEGIN
## 开发约束（必读）

本项目所有开发约束见 \`agent-constraints/core/constraints.md\`。
动手前先读它；每完成一个功能或修完一个 bug，按 \`agent-constraints/core/DISTILL.md\` 提炼新规则。
$END"

  if [ -f "$AGENTS" ] && grep -qF "$BEGIN" "$AGENTS"; then
    # 已注入：替换旧块，保证引用是最新的
    # 用 awk 做块替换，避免 sed 跨平台差异
    awk -v begin="$BEGIN" -v end="$END" -v block="$BLOCK" '
      index($0, begin) { print block; skip=1; next }
      index($0, end)   { skip=0; next }
      !skip            { print }
    ' "$AGENTS" > "$AGENTS.tmp" && mv "$AGENTS.tmp" "$AGENTS"
    echo "  ✓ $(basename "$AGENTS") 中的引用已刷新"
  else
    # 首次注入（文件不存在则创建）
    [ -f "$AGENTS" ] || : > "$AGENTS"
    printf '\n%s\n' "$BLOCK" >> "$AGENTS"
    echo "  ✓ 已向 $(basename "$AGENTS") 注入引用"
```

</details>

**依据 4 · 源码核查**：[contribute.sh:46-64](https://github.com/962599627/agent-development-constraints/blob/fc9af918ac14f03d63bee299cab90862adbc8963/contribute.sh#L46-L64)

ID+hash baseline方案基线。

<details>
<summary>查看原文（19行）</summary>

```text
# 2. 基线
BASELINE_FILE="$PKG/.baseline"
BASELINE_IDS=""
HAS_BASELINE=0

if [ -f "$BASELINE_FILE" ] && [ "$ALL" -eq 0 ]; then
  HAS_BASELINE=1
  BASELINE_IDS="$(grep -oE '^[A-Z]-[0-9]+' "$BASELINE_FILE" || true)"
fi

BASELINE_COUNT="$(printf '%s\n' "$BASELINE_IDS" | grep -c . || true)"

# 3. 找新增
if [ "$ALL" -eq 1 ] || [ "$HAS_BASELINE" -eq 0 ]; then
  NEW_IDS="$CURRENT_IDS"
  MODE="全部规则（无基线或指定了 --all）"
else
  NEW_IDS="$(comm -23 <(printf '%s\n' "$CURRENT_IDS" | sort -u) <(printf '%s\n' "$BASELINE_IDS" | sort -u) || true)"
  MODE="新增规则（对比安装时的基线）"
```

</details>

#### 缺口

- 规则适用/执行、session授权收据和安装diff/hash基线方案未实现。
  **影响**：不计现有强制能力或提高评分。
  **进一步探讨**：小规模故障/双项目语料先比较保留率、匹配正确和新增维护成本。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
