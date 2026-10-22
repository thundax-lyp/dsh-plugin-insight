# dsh-permissions

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[ad84f1d](https://github.com/940842546/dsh-permissions/tree/ad84f1d0928396a9597e557b6540f1f6feca2052)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/940842546/dsh-permissions) [![npm 30d 588](https://img.shields.io/static/v1?label=npm+30d&message=588&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-permissions) [![最新发布 2026-09-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-permissions)
<!-- END META -->

> **实现功能**：在工具执行前应用 hard、deny、ask、allow 四级规则，并提供 workspace/global 草稿式权限编辑器。

> **核心亮点**：相对宿主粗粒度审批，它加入不可豁免 hard 层、workspace/global 作用域和参数模式，并让草稿保存成为明确生效点。价值在额外收窄而非提升权限；它不替代 DSH sandbox/tools.guard，也不证明路径字符串与真实文件解析完全等价。 详见[Q03](#research-q03)。

> **风险与缺陷**：核心质疑是字符串匹配能否覆盖别名、转义、相对路径、shell 拼接和工具 schema 变化。规则漏匹配会给出虚假安全感，过宽 hard/deny 会阻断正常任务；自建同源设置路由若缺鉴权或写入竞争，会改变全局策略。默认规则也可能不适合非 Windows 路径。 详见[Q04](#research-q04)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 谁在何种重复场景需要 dsh-permissions，合格交付与简单替代是什么？](#detail-section-11)
  - [Q02 · dsh-permissions 的入口、调用链、状态变化与副作用如何实现？](#detail-section-12)
  - [Q03 · 相对宿主原生能力或简单替代，dsh-permissions 的具体增量是什么？](#detail-section-13)
  - [Q04 · 什么前提最可能使 dsh-permissions 的核心价值不成立？](#detail-section-14)
  - [Q05 · dsh-permissions 启动、持续生效与失败降级依赖什么？](#detail-section-15)
  - [Q06 · dsh-permissions 完成一个合格任务的首次、持续与失败恢复成本是什么？](#detail-section-16)
  - [Q07 · dsh-permissions 的工程可靠性和可迁移设计如何？](#detail-section-17)
  - [Q08 · 由贡献与限制可推导什么可证伪的新设计假设？](#detail-section-18)
  - [Q09 · 哪些人应观察、试用或拒绝采用 dsh-permissions？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：团队希望在 DSH 沙箱之外增加按工具参数和路径的可审计细粒度门禁，例如永久保护 .ssh/.env；基线是宿主全局审批姿态或每次人工确认。合格结果是 hard 永不可绕过、deny/ask/allow 优先级确定、workspace 隔离正确，规则编辑未保存前不改变执行。 详见[Q01](#research-q01)。

团队希望在 DSH 沙箱之外增加按工具参数和路径的可审计细粒度门禁，例如永久保护 .ssh/.env；基线是宿主全局审批姿态或每次人工确认。合格结果是 hard 永不可绕过、deny/ask/allow 优先级确定、workspace 隔离正确，规则编辑未保存前不改变执行。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| hard/deny/ask/allow | 按工具参数决定拒绝、询问或放行 | allow 只跳过本插件，不绕宿主沙箱 |
| workspace 作用域 | 为不同工作区维护差异规则 | cwd/路径规范化正确性需验证 |
| 草稿设置页 | 编辑后显式保存应用 | 路由和存储权限是额外攻击面 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| approval/tools 事件 | 必需 | 在请求与执行前拦截 | 未经过这些事件的副作用不可见 |
| 规则 JSON 存储 | 必需 | 持久化 global/workspace 规则 | 损坏/竞争可能回退或丢配置 |
| 宿主 sandbox/tools.guard | 仍必需 | 提供底层执行隔离 | 插件不应成为唯一边界 |
| 客户端设置服务 | 配置时必需 | 编辑和保存草稿 | 缺失可保留现有规则但难维护 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 建模 | 管理员列高风险工具/路径 | 形成平台与workspace规则 |
| 演练 | 用无副作用调用验证命中 | hard/deny/ask/allow结果符合矩阵 |
| 应用 | 设置页保存草稿 | Host JSON更新后新执行生效 |
| 恢复 | 根据拒绝文本定位规则 | 放弃草稿或回滚JSON，不降低hard |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 无外部费；规则存储很小 | 威胁建模、工具schema盘点和100例旁路测试 | 维护者工时未知 |
| 持续使用 | 每次匹配计算；ask带等待 | 审批ask并维护新工具规则 | 按合格且无越权任务计量 |
| 失败恢复 | 误拦导致任务重试；漏拦后果可能高 | 定位规则、回滚JSON、审计副作用 | 无法自动撤销已执行危险命令 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 不可豁免保护 | 源码定义hard高于full access | 所有路径变体是否命中 |
| 审批减负 | allow/deny减少重复询问 | 误拦率与ask次数变化 |
| 配置安全 | 草稿保存前不生效 | 并发保存和路由鉴权 |

> **思考**：核心质疑是字符串匹配能否覆盖别名、转义、相对路径、shell 拼接和工具 schema 变化。规则漏匹配会给出虚假安全感，过宽 hard/deny 会阻断正常任务；自建同源设置路由若缺鉴权或写入竞争，会改变全局策略。默认规则也可能不适合非 Windows 路径。 详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对宿主粗粒度审批，它加入不可豁免 hard 层、workspace/global 作用域和参数模式，并让草稿保存成为明确生效点。价值在额外收窄而非提升权限；它不替代 DSH sandbox/tools.guard，也不证明路径字符串与真实文件解析完全等价。 详见[Q03](#research-q03)。

相对宿主粗粒度审批，它加入不可豁免 hard 层、workspace/global 作用域和参数模式，并让草稿保存成为明确生效点。价值在额外收窄而非提升权限；它不替代 DSH sandbox/tools.guard，也不证明路径字符串与真实文件解析完全等价。 详见[Q03](#research-q03)。

两事件面覆盖请求与执行，规则优先级和自管存储明确，草稿 UI 避免每次编辑立即改变策略。可复用的是“只收窄、hard 不可豁免、草稿原子应用”；移植需对每种工具规范化参数而非只复用字符串模式。 详见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

核心质疑是字符串匹配能否覆盖别名、转义、相对路径、shell 拼接和工具 schema 变化。规则漏匹配会给出虚假安全感，过宽 hard/deny 会阻断正常任务；自建同源设置路由若缺鉴权或写入竞争，会改变全局策略。默认规则也可能不适合非 Windows 路径。 详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

有明确威胁模型、能维护规则和保留宿主沙箱的团队可在非生产 profile 试用；先用只读/模拟工具跑对抗集，再启用 hard 保护真实路径。把它当唯一安全边界、规则无人维护或工具大量通过 shell 二次解释的环境不适合。 详见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认了 approval/request 与 tools/pre-execute 双入口、hard/deny/ask/allow 优先级、会话授权、规则 JSON 和草稿设置路由；本轮没有执行路径变体、符号链接或 shell 嵌套对抗，因此只确认额外收窄机制，不能证明不存在参数旁路或并发配置风险。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读检查固定提交 ad84f1d0928396a9597e557b6540f1f6feca2052 的作者材料、入口与关键源码；不运行插件、测试、外部服务或真实 Host；检查时间不早于 2026-10-22T15:49:47Z。
- 下一步：构造无副作用工具镜像，覆盖绝对/相对/大小写/引号/通配/符号链接/PowerShell嵌套与未知schema；同时测试草稿并发保存、JSON损坏和宿主full access，要求hard永拒绝且allow不越过sandbox。

**分析版本**

- **仓库**：[940842546/dsh-permissions](https://github.com/940842546/dsh-permissions)
- **版本号**：2.0.2（[固定提交 ad84f1d](https://github.com/940842546/dsh-permissions/tree/ad84f1d0928396a9597e557b6540f1f6feca2052)）
- **版本日期**：2026-09-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是把匹配输入改为工具 schema 驱动的规范化资源对象，并在执行前显示最终 canonical path，可显著减少路径绕过与误拦。最小对抗集包含 100 个绝对/相对/符号链接/引号/大小写/PowerShell 嵌套用例，比较现规则和规范化规则的漏拦、误拦与审批次数；任何已知秘密路径漏拦即否定。 详见[Q08](#research-q08)。

构造无副作用工具镜像，覆盖绝对/相对/大小写/引号/通配/符号链接/PowerShell嵌套与未知schema；同时测试草稿并发保存、JSON损坏和宿主full access，要求hard永拒绝且allow不越过sandbox。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 291 | — | — | 2798 |
| .js | source | 3 | 1746 | 1645 | 58 | — |
| .mjs | test | 1 | 160 | 137 | 17 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/940842546/dsh-permissions/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：dsh-permissions 在固定版本下是否以可控依赖和总成本交付其核心能力，并值得目标用户采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁在何种重复场景需要 dsh-permissions，合格交付与简单替代是什么？

**研究主题**：场景与需求

#### 完整回答

团队希望在 DSH 沙箱之外增加按工具参数和路径的可审计细粒度门禁，例如永久保护 .ssh/.env；基线是宿主全局审批姿态或每次人工确认。合格结果是 hard 永不可绕过、deny/ask/allow 优先级确定、workspace 隔离正确，规则编辑未保存前不改变执行。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:10-25](https://github.com/940842546/dsh-permissions/blob/ad84f1d0928396a9597e557b6540f1f6feca2052/README.md#L10-L25)

固定版本作者材料支持 Q01 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（16行）</summary>

```text
## 亮点

- **四级规则、严格优先级**：`hard` > `deny` > `ask` > `allow`。
- **`hard` 高于全访问**：即使会话处于全访问档（审批策略 `never`），hard 规则依然拦截、不可豁免；`ask` 规则跟随会话策略，全访问下自动放行。
- **作用域**：`global` 规则全局生效；按 `workspace` 的规则叠加合并（冲突时 deny 永远胜出）。
- **通配符匹配**（文件类工具 `read`/`write`/`edit`/`glob`/`grep`/`read_image`）：
  - `write(*.pem)` —— 路径以 `.pem` 结尾
  - `write(*secret*)` —— 路径包含 `secret`
  - `write(.ssh)` —— 路径任意位置出现 `.ssh` 片段（大小写不敏感，`\`/`/` 统一归一化）
  - `write(C:\users\*)` —— 绝对路径前缀
  - 裸 `write` —— 该工具全部调用
- **持久化**：规则存于 `dsh-permissions` 设置命名空间，跨重启保留（`<harness home>/settings.yaml`）。
- **模型透明**：生效规则注入系统提示（`[active-permission-rules]` 段）。
- **可视化编辑器**：草稿式（staged）编辑——所有修改点「保存并应用」后才生效，附一键预设（保护敏感目录 / 密钥文件 / 拦截危险命令）。

## 界面截图
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · dsh-permissions 的入口、调用链、状态变化与副作用如何实现？

**研究主题**：功能与机制

#### 完整回答

approval/request 与 tools/pre-execute 两处监听匹配规则；match 模块对工具首参/路径做前缀或通配模式，hard 高于会话 full access，ask 生成一次性/会话授权，allow 仅跳过插件自身询问。规则存自管 JSON，GET/POST /api/dperm/rules 服务客户端草稿编辑器。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:143-366](https://github.com/940842546/dsh-permissions/blob/ad84f1d0928396a9597e557b6540f1f6feca2052/lib/index.js#L143-L366)

固定版本源码用于核对 Q02 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（224行）</summary>

```text
  function grantsOfSession(sid) {
    const set = grants.get(sid)
    if (set === undefined) return []
    return [...set].map((key) => {
      const sep1 = key.indexOf('|')
      const sep2 = key.indexOf('|', sep1 + 1)
      return { source: key.slice(0, sep1), action: key.slice(sep1 + 1, sep2), raw: key.slice(sep2 + 1) }
    })
  }

  // 抢答器：拦截自家 ask 问询（reason 带 ASK_PREFIX），改走 /api/dperm/ask 的三选 UI
  if (approval !== undefined) {
    ctx.on('approval/request', (req, next) => {
      if (req.signal && req.signal.aborted) return next()
      if (typeof req.reason !== 'string' || !req.reason.startsWith(ASK_PREFIX)) return next()
      const callId = String(req.callId !== undefined ? req.callId : Math.random().toString(36).slice(2))
      return new Promise((resolve) => {
        pendingAsks.set(callId, { resolve, toolName: req.toolName, agent: req.agent, rule: req.reason.slice(ASK_PREFIX.length) })
        try { ctx.emit('dsh-permissions/ask-pending', callId) } catch (e) {}
      })
    }, { prepend: true })
  }

  function settleAsk(callId, choice) {
    const p = pendingAsks.get(callId)
    if (p === undefined) return false
    pendingAsks.delete(callId)
    if (choice === 'always') {
      // rule 字符串就是 grantKey 格式（source|action|raw 由引擎拼装传入 reason）
      const sid = p.agent && p.agent.session ? String(p.agent.session.id) : ''
      if (sid !== '') {
        let set = grants.get(sid)
        if (set === undefined) { set = new Set(); grants.set(sid, set) }
        set.add(p.rule)
      }
      p.resolve('allowed-once')
    } else if (choice === 'once') {
      p.resolve('allowed-once')
    } else {
      p.resolve('rejected')
    }
    return true
  }

  function getMerged(keys) {
    const key = keys.join('|')
    const hit = mergedCache.get(key)
    if (hit !== undefined && hit.rev === rulesRev) return hit.rules
    const ws = (current && current.workspaces) || {}
    const rules = mergeRules(keys.map((k) => ({
      source: k,
      set: k === 'global'
        ? { hard: current.hard || [], deny: current.deny || [], ask: current.ask || [], allow: current.allow || [] }
        : (ws[k.slice(3)] || EMPTY),
    })))
    mergedCache.set(key, { rev: rulesRev, rules })
    return rules
  }

  // ---------- 作用域解析（Workspace 实体字段是 id；SessionHeader.cwd 锚定） ----------
  async function resolveWorkspaceId(agent) {
    if (agent === undefined || agent === null) return undefined
    const sess = agent.session
    const cwd = sess && sess.header ? sess.header.cwd : undefined
    if (cwd === undefined || cwd === null || cwd === '') return undefined
    if (wsCache.has(cwd)) return wsCache.get(cwd)
    let id
    try {
      const ws = workspaceRegistry ? await workspaceRegistry.resolveByPath(cwd) : undefined
      id = ws && ws.id ? String(ws.id) : undefined
    } catch (e) { id = undefined }
    wsCache.set(cwd, id)
    return id
  }

  // ---------- 会话审批策略（仅 ask 跟随；hard/deny 永不受影响） ----------
  function effectivePolicy(agent) {
    if (approval === undefined) return 'ask'
    let policy
    try {
      const sess = agent && agent.session
      policy = sess ? approval.overrideOf(sess) : undefined
    } catch (e) { policy = undefined }
    if (policy !== undefined && policy !== null) return policy
    const cfg = approval.config
    return cfg && cfg.policy ? cfg.policy : 'ask'
  }

  // ---------- 决策引擎（含审计环形缓冲 + 规则命中计数 + JSONL 持久化） ----------
  const audit = []
  let auditSeq = 0
  const ruleHits = new Map() // key: source|action|raw → count
  const historyFile = path.join(process.env.DSH_HOME || path.join(homedir(), '.dsh'), 'dsh-permissions-history.jsonl')
  function countHit(rule) {
    const key = rule.source + '|' + rule.action + '|' + rule.raw
    ruleHits.set(key, (ruleHits.get(key) || 0) + 1)
  }
  function clipText(text) {
    const s = String(text === undefined || text === null ? '' : text)
    return s.length > 80 ? s.slice(0, 80) : s
  }
  // 启动时重放历史尾部：恢复日志环 + 命中计数（异步，不阻塞启动）
  ;(async () => {
    try {
      const text = await readFile(historyFile, 'utf8')
      const lines = text.split('\n').filter((l) => l.trim() !== '')
      const tail = lines.slice(-200)
      for (const line of tail) {
        try {
          const e = JSON.parse(line)
          if (e.seq > auditSeq) auditSeq = e.seq
          audit.push(e)
          if (e.ruleRaw && e.decision && e.decision !== 'fallback' && e.decision !== 'engine-error') {
            // 重放命中计数：日志行带 ruleKey 时直接用；否则按 ruleRaw 反推（作用域不可知，归 global）
            const key = e.ruleKey || ('global|' + (e.decision === 'allow' ? 'allow' : e.decision === 'ask' ? 'ask' : e.decision) + '|' + e.ruleRaw)
            ruleHits.set(key, (ruleHits.get(key) || 0) + 1)
          }
        } catch (err) { /* 跳过坏行 */ }
      }
    } catch (e) { /* 文件不存在即首次启动 */ }
  })()
  let historyBytes = 0
  let trimScheduled = false
  function pushAudit(entry) {
    const full = Object.assign({ seq: ++auditSeq }, entry)
    audit.push(full)
    if (audit.length > 200) audit.shift()
    // 持久化：追加一行 JSON（含 ruleKey 供重放）；文件超 2MB 时截断为尾部 200 行
    const key = entry.ruleRaw !== undefined && entry.decision !== 'fallback' && entry.decision !== 'engine-error'
      ? ((entry.source !== 'none' && entry.source !== 'policy-never' && entry.source !== 'grant' ? entry.source : 'global') + '|' + (entry.decision === 'allow' ? 'allow' : entry.decision === 'ask' ? 'ask' : entry.decision) + '|' + entry.ruleRaw)
      : undefined
    const line = JSON.stringify(Object.assign({}, full, key !== undefined ? { ruleKey: key } : {})) + '\n'
    historyBytes += line.length
    appendFile(historyFile, line, 'utf8').catch(() => {})
    if (historyBytes > 2 * 1024 * 1024 && !trimScheduled) {
      trimScheduled = true
      ;(async () => {
        try {
          await mkdir(path.dirname(historyFile), { recursive: true })
          const keep = audit.map((e) => JSON.stringify(e) + '\n').join('')
          await writeFile(historyFile, keep, 'utf8')
          historyBytes = keep.length
        } catch (e) { /* 截断失败下次再试 */ }
        trimScheduled = false
      })()
    }
  }
  ctx.on('tools/pre-execute', async (exec, next) => {
    let tool = '?'
    try {
      tool = exec.name
      if (!current || !current.enabled) return next()
      if (exec.agent === undefined || exec.agent === null) return next()
      const arg = clipText(primaryArgOf(tool, exec.arguments))
      let wsId
      try { wsId = await resolveWorkspaceId(exec.agent) } catch (e) { wsId = undefined }
      const keys = wsId !== undefined ? ['global', 'ws:' + wsId] : ['global']
      const rule = evaluate(getMerged(keys), tool, exec.arguments)
      if (rule === undefined) {
        pushAudit({ tool, arg, decision: 'fallback', source: 'none' })
        return next()
      }
      countHit(rule)
      if (rule.action === 'hard') {
        pushAudit({ tool, arg, decision: 'hard', source: rule.source, ruleRaw: rule.raw })
        return { kind: 'deny', reason: '[dsh-permissions] hard-deny (above full access, not exemptable) [' + sourceLabel(rule.source) + ' · hard]: ' + rule.raw }
      }
      if (rule.action === 'deny') {
        pushAudit({ tool, arg, decision: 'deny', source: rule.source, ruleRaw: rule.raw })
        return { kind: 'deny', reason: '[dsh-permissions] denied by rule [' + sourceLabel(rule.source) + ' · deny]: ' + rule.raw }
      }
      if (rule.action === 'allow') {
        pushAudit({ tool, arg, decision: 'allow', source: rule.source, ruleRaw: rule.raw })
        return next()
      }
      if (effectivePolicy(exec.agent) === 'never') {
        pushAudit({ tool, arg, decision: 'allow', source: 'policy-never', ruleRaw: rule.raw })
        return next()
      }
      // 会话授予：本会话已"总是允许"过这条规则 → 直接放行
      if (hasGrant(exec.agent, rule)) {
        pushAudit({ tool, arg, decision: 'allow', source: 'grant', ruleRaw: rule.raw })
        return next()
      }
      // 走自定义三选审批（仅本次 / 本会话总是允许 / 拒绝）；approval 缺失则回退注册表 ask（fail closed）
      if (approval !== undefined) {
        pushAudit({ tool, arg, decision: 'ask', source: rule.source, ruleRaw: rule.raw })
        const outcome = await approval.request({
          agent: exec.agent,
          toolName: tool,
          callId: exec.callId,
          reason: ASK_PREFIX + grantKeyOf(rule),
          signal: exec.signal,
        })
        if (outcome === 'allowed-once') {
          pushAudit({ tool, arg, decision: 'allow', source: rule.source, ruleRaw: rule.raw })
          return next()
        }
        return { kind: 'deny', reason: '[dsh-permissions] user rejected ' + tool + ' (rule [' + sourceLabel(rule.source) + ' · ask]: ' + rule.raw + ')' }
      }
      pushAudit({ tool, arg, decision: 'ask', source: rule.source, ruleRaw: rule.raw })
      return { kind: 'ask', reason: '[dsh-permissions] rule requires confirmation [' + sourceLabel(rule.source) + ' · ask]: ' + rule.raw }
    } catch (err) {
      pushAudit({ tool, arg: '', decision: 'engine-error', source: 'none' })
      return next()
    }
  })

  if (systemPrompt !== undefined) {
    ctx.effect(() => systemPrompt.section({
      name: 'active-permission-rules',
      order: 108,
      text: () => summaryText(current),
    }))
  }

  // ---------- 设置页专用 HTTP 路由 ----------
  // api-proxy 的 settings.describe 只暴露硬编码白名单命名空间，自定义命名空间
  // 无法经官方 settings API 触达。引擎用自己持有的 SettingsScope 直读直写，
  // 通过自建路由 /api/dperm/* 服务自己的设置页（同源 fetch，无 CORS）。
  // 子路由：GET/POST /rules（读写规则）、GET /log（决策日志）、GET /match-test（试算器）。
  const webServer = ctx.get('webServer')
  if (webServer !== undefined) {
    ctx.effect(() => webServer.register({
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对宿主原生能力或简单替代，dsh-permissions 的具体增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

相对宿主粗粒度审批，它加入不可豁免 hard 层、workspace/global 作用域和参数模式，并让草稿保存成为明确生效点。价值在额外收窄而非提升权限；它不替代 DSH sandbox/tools.guard，也不证明路径字符串与真实文件解析完全等价。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:10-25](https://github.com/940842546/dsh-permissions/blob/ad84f1d0928396a9597e557b6540f1f6feca2052/README.md#L10-L25)

固定版本作者材料支持 Q03 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（16行）</summary>

```text
## 亮点

- **四级规则、严格优先级**：`hard` > `deny` > `ask` > `allow`。
- **`hard` 高于全访问**：即使会话处于全访问档（审批策略 `never`），hard 规则依然拦截、不可豁免；`ask` 规则跟随会话策略，全访问下自动放行。
- **作用域**：`global` 规则全局生效；按 `workspace` 的规则叠加合并（冲突时 deny 永远胜出）。
- **通配符匹配**（文件类工具 `read`/`write`/`edit`/`glob`/`grep`/`read_image`）：
  - `write(*.pem)` —— 路径以 `.pem` 结尾
  - `write(*secret*)` —— 路径包含 `secret`
  - `write(.ssh)` —— 路径任意位置出现 `.ssh` 片段（大小写不敏感，`\`/`/` 统一归一化）
  - `write(C:\users\*)` —— 绝对路径前缀
  - 裸 `write` —— 该工具全部调用
- **持久化**：规则存于 `dsh-permissions` 设置命名空间，跨重启保留（`<harness home>/settings.yaml`）。
- **模型透明**：生效规则注入系统提示（`[active-permission-rules]` 段）。
- **可视化编辑器**：草稿式（staged）编辑——所有修改点「保存并应用」后才生效，附一键预设（保护敏感目录 / 密钥文件 / 拦截危险命令）。

## 界面截图
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么前提最可能使 dsh-permissions 的核心价值不成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

核心质疑是字符串匹配能否覆盖别名、转义、相对路径、shell 拼接和工具 schema 变化。规则漏匹配会给出虚假安全感，过宽 hard/deny 会阻断正常任务；自建同源设置路由若缺鉴权或写入竞争，会改变全局策略。默认规则也可能不适合非 Windows 路径。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:143-366](https://github.com/940842546/dsh-permissions/blob/ad84f1d0928396a9597e557b6540f1f6feca2052/lib/index.js#L143-L366)

固定版本源码用于核对 Q04 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（224行）</summary>

```text
  function grantsOfSession(sid) {
    const set = grants.get(sid)
    if (set === undefined) return []
    return [...set].map((key) => {
      const sep1 = key.indexOf('|')
      const sep2 = key.indexOf('|', sep1 + 1)
      return { source: key.slice(0, sep1), action: key.slice(sep1 + 1, sep2), raw: key.slice(sep2 + 1) }
    })
  }

  // 抢答器：拦截自家 ask 问询（reason 带 ASK_PREFIX），改走 /api/dperm/ask 的三选 UI
  if (approval !== undefined) {
    ctx.on('approval/request', (req, next) => {
      if (req.signal && req.signal.aborted) return next()
      if (typeof req.reason !== 'string' || !req.reason.startsWith(ASK_PREFIX)) return next()
      const callId = String(req.callId !== undefined ? req.callId : Math.random().toString(36).slice(2))
      return new Promise((resolve) => {
        pendingAsks.set(callId, { resolve, toolName: req.toolName, agent: req.agent, rule: req.reason.slice(ASK_PREFIX.length) })
        try { ctx.emit('dsh-permissions/ask-pending', callId) } catch (e) {}
      })
    }, { prepend: true })
  }

  function settleAsk(callId, choice) {
    const p = pendingAsks.get(callId)
    if (p === undefined) return false
    pendingAsks.delete(callId)
    if (choice === 'always') {
      // rule 字符串就是 grantKey 格式（source|action|raw 由引擎拼装传入 reason）
      const sid = p.agent && p.agent.session ? String(p.agent.session.id) : ''
      if (sid !== '') {
        let set = grants.get(sid)
        if (set === undefined) { set = new Set(); grants.set(sid, set) }
        set.add(p.rule)
      }
      p.resolve('allowed-once')
    } else if (choice === 'once') {
      p.resolve('allowed-once')
    } else {
      p.resolve('rejected')
    }
    return true
  }

  function getMerged(keys) {
    const key = keys.join('|')
    const hit = mergedCache.get(key)
    if (hit !== undefined && hit.rev === rulesRev) return hit.rules
    const ws = (current && current.workspaces) || {}
    const rules = mergeRules(keys.map((k) => ({
      source: k,
      set: k === 'global'
        ? { hard: current.hard || [], deny: current.deny || [], ask: current.ask || [], allow: current.allow || [] }
        : (ws[k.slice(3)] || EMPTY),
    })))
    mergedCache.set(key, { rev: rulesRev, rules })
    return rules
  }

  // ---------- 作用域解析（Workspace 实体字段是 id；SessionHeader.cwd 锚定） ----------
  async function resolveWorkspaceId(agent) {
    if (agent === undefined || agent === null) return undefined
    const sess = agent.session
    const cwd = sess && sess.header ? sess.header.cwd : undefined
    if (cwd === undefined || cwd === null || cwd === '') return undefined
    if (wsCache.has(cwd)) return wsCache.get(cwd)
    let id
    try {
      const ws = workspaceRegistry ? await workspaceRegistry.resolveByPath(cwd) : undefined
      id = ws && ws.id ? String(ws.id) : undefined
    } catch (e) { id = undefined }
    wsCache.set(cwd, id)
    return id
  }

  // ---------- 会话审批策略（仅 ask 跟随；hard/deny 永不受影响） ----------
  function effectivePolicy(agent) {
    if (approval === undefined) return 'ask'
    let policy
    try {
      const sess = agent && agent.session
      policy = sess ? approval.overrideOf(sess) : undefined
    } catch (e) { policy = undefined }
    if (policy !== undefined && policy !== null) return policy
    const cfg = approval.config
    return cfg && cfg.policy ? cfg.policy : 'ask'
  }

  // ---------- 决策引擎（含审计环形缓冲 + 规则命中计数 + JSONL 持久化） ----------
  const audit = []
  let auditSeq = 0
  const ruleHits = new Map() // key: source|action|raw → count
  const historyFile = path.join(process.env.DSH_HOME || path.join(homedir(), '.dsh'), 'dsh-permissions-history.jsonl')
  function countHit(rule) {
    const key = rule.source + '|' + rule.action + '|' + rule.raw
    ruleHits.set(key, (ruleHits.get(key) || 0) + 1)
  }
  function clipText(text) {
    const s = String(text === undefined || text === null ? '' : text)
    return s.length > 80 ? s.slice(0, 80) : s
  }
  // 启动时重放历史尾部：恢复日志环 + 命中计数（异步，不阻塞启动）
  ;(async () => {
    try {
      const text = await readFile(historyFile, 'utf8')
      const lines = text.split('\n').filter((l) => l.trim() !== '')
      const tail = lines.slice(-200)
      for (const line of tail) {
        try {
          const e = JSON.parse(line)
          if (e.seq > auditSeq) auditSeq = e.seq
          audit.push(e)
          if (e.ruleRaw && e.decision && e.decision !== 'fallback' && e.decision !== 'engine-error') {
            // 重放命中计数：日志行带 ruleKey 时直接用；否则按 ruleRaw 反推（作用域不可知，归 global）
            const key = e.ruleKey || ('global|' + (e.decision === 'allow' ? 'allow' : e.decision === 'ask' ? 'ask' : e.decision) + '|' + e.ruleRaw)
            ruleHits.set(key, (ruleHits.get(key) || 0) + 1)
          }
        } catch (err) { /* 跳过坏行 */ }
      }
    } catch (e) { /* 文件不存在即首次启动 */ }
  })()
  let historyBytes = 0
  let trimScheduled = false
  function pushAudit(entry) {
    const full = Object.assign({ seq: ++auditSeq }, entry)
    audit.push(full)
    if (audit.length > 200) audit.shift()
    // 持久化：追加一行 JSON（含 ruleKey 供重放）；文件超 2MB 时截断为尾部 200 行
    const key = entry.ruleRaw !== undefined && entry.decision !== 'fallback' && entry.decision !== 'engine-error'
      ? ((entry.source !== 'none' && entry.source !== 'policy-never' && entry.source !== 'grant' ? entry.source : 'global') + '|' + (entry.decision === 'allow' ? 'allow' : entry.decision === 'ask' ? 'ask' : entry.decision) + '|' + entry.ruleRaw)
      : undefined
    const line = JSON.stringify(Object.assign({}, full, key !== undefined ? { ruleKey: key } : {})) + '\n'
    historyBytes += line.length
    appendFile(historyFile, line, 'utf8').catch(() => {})
    if (historyBytes > 2 * 1024 * 1024 && !trimScheduled) {
      trimScheduled = true
      ;(async () => {
        try {
          await mkdir(path.dirname(historyFile), { recursive: true })
          const keep = audit.map((e) => JSON.stringify(e) + '\n').join('')
          await writeFile(historyFile, keep, 'utf8')
          historyBytes = keep.length
        } catch (e) { /* 截断失败下次再试 */ }
        trimScheduled = false
      })()
    }
  }
  ctx.on('tools/pre-execute', async (exec, next) => {
    let tool = '?'
    try {
      tool = exec.name
      if (!current || !current.enabled) return next()
      if (exec.agent === undefined || exec.agent === null) return next()
      const arg = clipText(primaryArgOf(tool, exec.arguments))
      let wsId
      try { wsId = await resolveWorkspaceId(exec.agent) } catch (e) { wsId = undefined }
      const keys = wsId !== undefined ? ['global', 'ws:' + wsId] : ['global']
      const rule = evaluate(getMerged(keys), tool, exec.arguments)
      if (rule === undefined) {
        pushAudit({ tool, arg, decision: 'fallback', source: 'none' })
        return next()
      }
      countHit(rule)
      if (rule.action === 'hard') {
        pushAudit({ tool, arg, decision: 'hard', source: rule.source, ruleRaw: rule.raw })
        return { kind: 'deny', reason: '[dsh-permissions] hard-deny (above full access, not exemptable) [' + sourceLabel(rule.source) + ' · hard]: ' + rule.raw }
      }
      if (rule.action === 'deny') {
        pushAudit({ tool, arg, decision: 'deny', source: rule.source, ruleRaw: rule.raw })
        return { kind: 'deny', reason: '[dsh-permissions] denied by rule [' + sourceLabel(rule.source) + ' · deny]: ' + rule.raw }
      }
      if (rule.action === 'allow') {
        pushAudit({ tool, arg, decision: 'allow', source: rule.source, ruleRaw: rule.raw })
        return next()
      }
      if (effectivePolicy(exec.agent) === 'never') {
        pushAudit({ tool, arg, decision: 'allow', source: 'policy-never', ruleRaw: rule.raw })
        return next()
      }
      // 会话授予：本会话已"总是允许"过这条规则 → 直接放行
      if (hasGrant(exec.agent, rule)) {
        pushAudit({ tool, arg, decision: 'allow', source: 'grant', ruleRaw: rule.raw })
        return next()
      }
      // 走自定义三选审批（仅本次 / 本会话总是允许 / 拒绝）；approval 缺失则回退注册表 ask（fail closed）
      if (approval !== undefined) {
        pushAudit({ tool, arg, decision: 'ask', source: rule.source, ruleRaw: rule.raw })
        const outcome = await approval.request({
          agent: exec.agent,
          toolName: tool,
          callId: exec.callId,
          reason: ASK_PREFIX + grantKeyOf(rule),
          signal: exec.signal,
        })
        if (outcome === 'allowed-once') {
          pushAudit({ tool, arg, decision: 'allow', source: rule.source, ruleRaw: rule.raw })
          return next()
        }
        return { kind: 'deny', reason: '[dsh-permissions] user rejected ' + tool + ' (rule [' + sourceLabel(rule.source) + ' · ask]: ' + rule.raw + ')' }
      }
      pushAudit({ tool, arg, decision: 'ask', source: rule.source, ruleRaw: rule.raw })
      return { kind: 'ask', reason: '[dsh-permissions] rule requires confirmation [' + sourceLabel(rule.source) + ' · ask]: ' + rule.raw }
    } catch (err) {
      pushAudit({ tool, arg: '', decision: 'engine-error', source: 'none' })
      return next()
    }
  })

  if (systemPrompt !== undefined) {
    ctx.effect(() => systemPrompt.section({
      name: 'active-permission-rules',
      order: 108,
      text: () => summaryText(current),
    }))
  }

  // ---------- 设置页专用 HTTP 路由 ----------
  // api-proxy 的 settings.describe 只暴露硬编码白名单命名空间，自定义命名空间
  // 无法经官方 settings API 触达。引擎用自己持有的 SettingsScope 直读直写，
  // 通过自建路由 /api/dperm/* 服务自己的设置页（同源 fetch，无 CORS）。
  // 子路由：GET/POST /rules（读写规则）、GET /log（决策日志）、GET /match-test（试算器）。
  const webServer = ctx.get('webServer')
  if (webServer !== undefined) {
    ctx.effect(() => webServer.register({
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · dsh-permissions 启动、持续生效与失败降级依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

需要 DSH approval/request、tools/pre-execute、systemPrompt、webServer 和客户端设置页；持久 JSON 目录必须可写。效果依赖所有高风险动作都经过可见工具调用，终端内部二次执行或未知工具参数可能绕过语义匹配；宿主沙箱仍是最后边界。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:10-25](https://github.com/940842546/dsh-permissions/blob/ad84f1d0928396a9597e557b6540f1f6feca2052/README.md#L10-L25)

固定版本作者材料支持 Q05 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（16行）</summary>

```text
## 亮点

- **四级规则、严格优先级**：`hard` > `deny` > `ask` > `allow`。
- **`hard` 高于全访问**：即使会话处于全访问档（审批策略 `never`），hard 规则依然拦截、不可豁免；`ask` 规则跟随会话策略，全访问下自动放行。
- **作用域**：`global` 规则全局生效；按 `workspace` 的规则叠加合并（冲突时 deny 永远胜出）。
- **通配符匹配**（文件类工具 `read`/`write`/`edit`/`glob`/`grep`/`read_image`）：
  - `write(*.pem)` —— 路径以 `.pem` 结尾
  - `write(*secret*)` —— 路径包含 `secret`
  - `write(.ssh)` —— 路径任意位置出现 `.ssh` 片段（大小写不敏感，`\`/`/` 统一归一化）
  - `write(C:\users\*)` —— 绝对路径前缀
  - 裸 `write` —— 该工具全部调用
- **持久化**：规则存于 `dsh-permissions` 设置命名空间，跨重启保留（`<harness home>/settings.yaml`）。
- **模型透明**：生效规则注入系统提示（`[active-permission-rules]` 段）。
- **可视化编辑器**：草稿式（staged）编辑——所有修改点「保存并应用」后才生效，附一键预设（保护敏感目录 / 密钥文件 / 拦截危险命令）。

## 界面截图
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · dsh-permissions 完成一个合格任务的首次、持续与失败恢复成本是什么？

**研究主题**：效果与总成本

#### 完整回答

首次要盘点工具 schema、按平台建立 hard/deny/ask/allow 与 workspace 规则并做旁路测试；持续每次工具执行做匹配，ask 产生人工审批；失败恢复包括从拒绝错误定位命中规则、放弃未保存草稿或回滚 JSON，不能用 allow 绕过 hard。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:143-366](https://github.com/940842546/dsh-permissions/blob/ad84f1d0928396a9597e557b6540f1f6feca2052/lib/index.js#L143-L366)

固定版本源码用于核对 Q06 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（224行）</summary>

```text
  function grantsOfSession(sid) {
    const set = grants.get(sid)
    if (set === undefined) return []
    return [...set].map((key) => {
      const sep1 = key.indexOf('|')
      const sep2 = key.indexOf('|', sep1 + 1)
      return { source: key.slice(0, sep1), action: key.slice(sep1 + 1, sep2), raw: key.slice(sep2 + 1) }
    })
  }

  // 抢答器：拦截自家 ask 问询（reason 带 ASK_PREFIX），改走 /api/dperm/ask 的三选 UI
  if (approval !== undefined) {
    ctx.on('approval/request', (req, next) => {
      if (req.signal && req.signal.aborted) return next()
      if (typeof req.reason !== 'string' || !req.reason.startsWith(ASK_PREFIX)) return next()
      const callId = String(req.callId !== undefined ? req.callId : Math.random().toString(36).slice(2))
      return new Promise((resolve) => {
        pendingAsks.set(callId, { resolve, toolName: req.toolName, agent: req.agent, rule: req.reason.slice(ASK_PREFIX.length) })
        try { ctx.emit('dsh-permissions/ask-pending', callId) } catch (e) {}
      })
    }, { prepend: true })
  }

  function settleAsk(callId, choice) {
    const p = pendingAsks.get(callId)
    if (p === undefined) return false
    pendingAsks.delete(callId)
    if (choice === 'always') {
      // rule 字符串就是 grantKey 格式（source|action|raw 由引擎拼装传入 reason）
      const sid = p.agent && p.agent.session ? String(p.agent.session.id) : ''
      if (sid !== '') {
        let set = grants.get(sid)
        if (set === undefined) { set = new Set(); grants.set(sid, set) }
        set.add(p.rule)
      }
      p.resolve('allowed-once')
    } else if (choice === 'once') {
      p.resolve('allowed-once')
    } else {
      p.resolve('rejected')
    }
    return true
  }

  function getMerged(keys) {
    const key = keys.join('|')
    const hit = mergedCache.get(key)
    if (hit !== undefined && hit.rev === rulesRev) return hit.rules
    const ws = (current && current.workspaces) || {}
    const rules = mergeRules(keys.map((k) => ({
      source: k,
      set: k === 'global'
        ? { hard: current.hard || [], deny: current.deny || [], ask: current.ask || [], allow: current.allow || [] }
        : (ws[k.slice(3)] || EMPTY),
    })))
    mergedCache.set(key, { rev: rulesRev, rules })
    return rules
  }

  // ---------- 作用域解析（Workspace 实体字段是 id；SessionHeader.cwd 锚定） ----------
  async function resolveWorkspaceId(agent) {
    if (agent === undefined || agent === null) return undefined
    const sess = agent.session
    const cwd = sess && sess.header ? sess.header.cwd : undefined
    if (cwd === undefined || cwd === null || cwd === '') return undefined
    if (wsCache.has(cwd)) return wsCache.get(cwd)
    let id
    try {
      const ws = workspaceRegistry ? await workspaceRegistry.resolveByPath(cwd) : undefined
      id = ws && ws.id ? String(ws.id) : undefined
    } catch (e) { id = undefined }
    wsCache.set(cwd, id)
    return id
  }

  // ---------- 会话审批策略（仅 ask 跟随；hard/deny 永不受影响） ----------
  function effectivePolicy(agent) {
    if (approval === undefined) return 'ask'
    let policy
    try {
      const sess = agent && agent.session
      policy = sess ? approval.overrideOf(sess) : undefined
    } catch (e) { policy = undefined }
    if (policy !== undefined && policy !== null) return policy
    const cfg = approval.config
    return cfg && cfg.policy ? cfg.policy : 'ask'
  }

  // ---------- 决策引擎（含审计环形缓冲 + 规则命中计数 + JSONL 持久化） ----------
  const audit = []
  let auditSeq = 0
  const ruleHits = new Map() // key: source|action|raw → count
  const historyFile = path.join(process.env.DSH_HOME || path.join(homedir(), '.dsh'), 'dsh-permissions-history.jsonl')
  function countHit(rule) {
    const key = rule.source + '|' + rule.action + '|' + rule.raw
    ruleHits.set(key, (ruleHits.get(key) || 0) + 1)
  }
  function clipText(text) {
    const s = String(text === undefined || text === null ? '' : text)
    return s.length > 80 ? s.slice(0, 80) : s
  }
  // 启动时重放历史尾部：恢复日志环 + 命中计数（异步，不阻塞启动）
  ;(async () => {
    try {
      const text = await readFile(historyFile, 'utf8')
      const lines = text.split('\n').filter((l) => l.trim() !== '')
      const tail = lines.slice(-200)
      for (const line of tail) {
        try {
          const e = JSON.parse(line)
          if (e.seq > auditSeq) auditSeq = e.seq
          audit.push(e)
          if (e.ruleRaw && e.decision && e.decision !== 'fallback' && e.decision !== 'engine-error') {
            // 重放命中计数：日志行带 ruleKey 时直接用；否则按 ruleRaw 反推（作用域不可知，归 global）
            const key = e.ruleKey || ('global|' + (e.decision === 'allow' ? 'allow' : e.decision === 'ask' ? 'ask' : e.decision) + '|' + e.ruleRaw)
            ruleHits.set(key, (ruleHits.get(key) || 0) + 1)
          }
        } catch (err) { /* 跳过坏行 */ }
      }
    } catch (e) { /* 文件不存在即首次启动 */ }
  })()
  let historyBytes = 0
  let trimScheduled = false
  function pushAudit(entry) {
    const full = Object.assign({ seq: ++auditSeq }, entry)
    audit.push(full)
    if (audit.length > 200) audit.shift()
    // 持久化：追加一行 JSON（含 ruleKey 供重放）；文件超 2MB 时截断为尾部 200 行
    const key = entry.ruleRaw !== undefined && entry.decision !== 'fallback' && entry.decision !== 'engine-error'
      ? ((entry.source !== 'none' && entry.source !== 'policy-never' && entry.source !== 'grant' ? entry.source : 'global') + '|' + (entry.decision === 'allow' ? 'allow' : entry.decision === 'ask' ? 'ask' : entry.decision) + '|' + entry.ruleRaw)
      : undefined
    const line = JSON.stringify(Object.assign({}, full, key !== undefined ? { ruleKey: key } : {})) + '\n'
    historyBytes += line.length
    appendFile(historyFile, line, 'utf8').catch(() => {})
    if (historyBytes > 2 * 1024 * 1024 && !trimScheduled) {
      trimScheduled = true
      ;(async () => {
        try {
          await mkdir(path.dirname(historyFile), { recursive: true })
          const keep = audit.map((e) => JSON.stringify(e) + '\n').join('')
          await writeFile(historyFile, keep, 'utf8')
          historyBytes = keep.length
        } catch (e) { /* 截断失败下次再试 */ }
        trimScheduled = false
      })()
    }
  }
  ctx.on('tools/pre-execute', async (exec, next) => {
    let tool = '?'
    try {
      tool = exec.name
      if (!current || !current.enabled) return next()
      if (exec.agent === undefined || exec.agent === null) return next()
      const arg = clipText(primaryArgOf(tool, exec.arguments))
      let wsId
      try { wsId = await resolveWorkspaceId(exec.agent) } catch (e) { wsId = undefined }
      const keys = wsId !== undefined ? ['global', 'ws:' + wsId] : ['global']
      const rule = evaluate(getMerged(keys), tool, exec.arguments)
      if (rule === undefined) {
        pushAudit({ tool, arg, decision: 'fallback', source: 'none' })
        return next()
      }
      countHit(rule)
      if (rule.action === 'hard') {
        pushAudit({ tool, arg, decision: 'hard', source: rule.source, ruleRaw: rule.raw })
        return { kind: 'deny', reason: '[dsh-permissions] hard-deny (above full access, not exemptable) [' + sourceLabel(rule.source) + ' · hard]: ' + rule.raw }
      }
      if (rule.action === 'deny') {
        pushAudit({ tool, arg, decision: 'deny', source: rule.source, ruleRaw: rule.raw })
        return { kind: 'deny', reason: '[dsh-permissions] denied by rule [' + sourceLabel(rule.source) + ' · deny]: ' + rule.raw }
      }
      if (rule.action === 'allow') {
        pushAudit({ tool, arg, decision: 'allow', source: rule.source, ruleRaw: rule.raw })
        return next()
      }
      if (effectivePolicy(exec.agent) === 'never') {
        pushAudit({ tool, arg, decision: 'allow', source: 'policy-never', ruleRaw: rule.raw })
        return next()
      }
      // 会话授予：本会话已"总是允许"过这条规则 → 直接放行
      if (hasGrant(exec.agent, rule)) {
        pushAudit({ tool, arg, decision: 'allow', source: 'grant', ruleRaw: rule.raw })
        return next()
      }
      // 走自定义三选审批（仅本次 / 本会话总是允许 / 拒绝）；approval 缺失则回退注册表 ask（fail closed）
      if (approval !== undefined) {
        pushAudit({ tool, arg, decision: 'ask', source: rule.source, ruleRaw: rule.raw })
        const outcome = await approval.request({
          agent: exec.agent,
          toolName: tool,
          callId: exec.callId,
          reason: ASK_PREFIX + grantKeyOf(rule),
          signal: exec.signal,
        })
        if (outcome === 'allowed-once') {
          pushAudit({ tool, arg, decision: 'allow', source: rule.source, ruleRaw: rule.raw })
          return next()
        }
        return { kind: 'deny', reason: '[dsh-permissions] user rejected ' + tool + ' (rule [' + sourceLabel(rule.source) + ' · ask]: ' + rule.raw + ')' }
      }
      pushAudit({ tool, arg, decision: 'ask', source: rule.source, ruleRaw: rule.raw })
      return { kind: 'ask', reason: '[dsh-permissions] rule requires confirmation [' + sourceLabel(rule.source) + ' · ask]: ' + rule.raw }
    } catch (err) {
      pushAudit({ tool, arg: '', decision: 'engine-error', source: 'none' })
      return next()
    }
  })

  if (systemPrompt !== undefined) {
    ctx.effect(() => systemPrompt.section({
      name: 'active-permission-rules',
      order: 108,
      text: () => summaryText(current),
    }))
  }

  // ---------- 设置页专用 HTTP 路由 ----------
  // api-proxy 的 settings.describe 只暴露硬编码白名单命名空间，自定义命名空间
  // 无法经官方 settings API 触达。引擎用自己持有的 SettingsScope 直读直写，
  // 通过自建路由 /api/dperm/* 服务自己的设置页（同源 fetch，无 CORS）。
  // 子路由：GET/POST /rules（读写规则）、GET /log（决策日志）、GET /match-test（试算器）。
  const webServer = ctx.get('webServer')
  if (webServer !== undefined) {
    ctx.effect(() => webServer.register({
```

</details>

#### 缺口

- 路径与 shell 参数变体的真实旁路率未知
  **影响**：决定插件能否作为可信的附加门禁
  **进一步探讨**：用100个对抗参数和符号链接路径在无副作用假工具上跑命中矩阵，零秘密路径漏拦才进入真实试用

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · dsh-permissions 的工程可靠性和可迁移设计如何？

**研究主题**：工程质量与复用

#### 完整回答

两事件面覆盖请求与执行，规则优先级和自管存储明确，草稿 UI 避免每次编辑立即改变策略。可复用的是“只收窄、hard 不可豁免、草稿原子应用”；移植需对每种工具规范化参数而非只复用字符串模式。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:143-366](https://github.com/940842546/dsh-permissions/blob/ad84f1d0928396a9597e557b6540f1f6feca2052/lib/index.js#L143-L366)

固定版本源码用于核对 Q07 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（224行）</summary>

```text
  function grantsOfSession(sid) {
    const set = grants.get(sid)
    if (set === undefined) return []
    return [...set].map((key) => {
      const sep1 = key.indexOf('|')
      const sep2 = key.indexOf('|', sep1 + 1)
      return { source: key.slice(0, sep1), action: key.slice(sep1 + 1, sep2), raw: key.slice(sep2 + 1) }
    })
  }

  // 抢答器：拦截自家 ask 问询（reason 带 ASK_PREFIX），改走 /api/dperm/ask 的三选 UI
  if (approval !== undefined) {
    ctx.on('approval/request', (req, next) => {
      if (req.signal && req.signal.aborted) return next()
      if (typeof req.reason !== 'string' || !req.reason.startsWith(ASK_PREFIX)) return next()
      const callId = String(req.callId !== undefined ? req.callId : Math.random().toString(36).slice(2))
      return new Promise((resolve) => {
        pendingAsks.set(callId, { resolve, toolName: req.toolName, agent: req.agent, rule: req.reason.slice(ASK_PREFIX.length) })
        try { ctx.emit('dsh-permissions/ask-pending', callId) } catch (e) {}
      })
    }, { prepend: true })
  }

  function settleAsk(callId, choice) {
    const p = pendingAsks.get(callId)
    if (p === undefined) return false
    pendingAsks.delete(callId)
    if (choice === 'always') {
      // rule 字符串就是 grantKey 格式（source|action|raw 由引擎拼装传入 reason）
      const sid = p.agent && p.agent.session ? String(p.agent.session.id) : ''
      if (sid !== '') {
        let set = grants.get(sid)
        if (set === undefined) { set = new Set(); grants.set(sid, set) }
        set.add(p.rule)
      }
      p.resolve('allowed-once')
    } else if (choice === 'once') {
      p.resolve('allowed-once')
    } else {
      p.resolve('rejected')
    }
    return true
  }

  function getMerged(keys) {
    const key = keys.join('|')
    const hit = mergedCache.get(key)
    if (hit !== undefined && hit.rev === rulesRev) return hit.rules
    const ws = (current && current.workspaces) || {}
    const rules = mergeRules(keys.map((k) => ({
      source: k,
      set: k === 'global'
        ? { hard: current.hard || [], deny: current.deny || [], ask: current.ask || [], allow: current.allow || [] }
        : (ws[k.slice(3)] || EMPTY),
    })))
    mergedCache.set(key, { rev: rulesRev, rules })
    return rules
  }

  // ---------- 作用域解析（Workspace 实体字段是 id；SessionHeader.cwd 锚定） ----------
  async function resolveWorkspaceId(agent) {
    if (agent === undefined || agent === null) return undefined
    const sess = agent.session
    const cwd = sess && sess.header ? sess.header.cwd : undefined
    if (cwd === undefined || cwd === null || cwd === '') return undefined
    if (wsCache.has(cwd)) return wsCache.get(cwd)
    let id
    try {
      const ws = workspaceRegistry ? await workspaceRegistry.resolveByPath(cwd) : undefined
      id = ws && ws.id ? String(ws.id) : undefined
    } catch (e) { id = undefined }
    wsCache.set(cwd, id)
    return id
  }

  // ---------- 会话审批策略（仅 ask 跟随；hard/deny 永不受影响） ----------
  function effectivePolicy(agent) {
    if (approval === undefined) return 'ask'
    let policy
    try {
      const sess = agent && agent.session
      policy = sess ? approval.overrideOf(sess) : undefined
    } catch (e) { policy = undefined }
    if (policy !== undefined && policy !== null) return policy
    const cfg = approval.config
    return cfg && cfg.policy ? cfg.policy : 'ask'
  }

  // ---------- 决策引擎（含审计环形缓冲 + 规则命中计数 + JSONL 持久化） ----------
  const audit = []
  let auditSeq = 0
  const ruleHits = new Map() // key: source|action|raw → count
  const historyFile = path.join(process.env.DSH_HOME || path.join(homedir(), '.dsh'), 'dsh-permissions-history.jsonl')
  function countHit(rule) {
    const key = rule.source + '|' + rule.action + '|' + rule.raw
    ruleHits.set(key, (ruleHits.get(key) || 0) + 1)
  }
  function clipText(text) {
    const s = String(text === undefined || text === null ? '' : text)
    return s.length > 80 ? s.slice(0, 80) : s
  }
  // 启动时重放历史尾部：恢复日志环 + 命中计数（异步，不阻塞启动）
  ;(async () => {
    try {
      const text = await readFile(historyFile, 'utf8')
      const lines = text.split('\n').filter((l) => l.trim() !== '')
      const tail = lines.slice(-200)
      for (const line of tail) {
        try {
          const e = JSON.parse(line)
          if (e.seq > auditSeq) auditSeq = e.seq
          audit.push(e)
          if (e.ruleRaw && e.decision && e.decision !== 'fallback' && e.decision !== 'engine-error') {
            // 重放命中计数：日志行带 ruleKey 时直接用；否则按 ruleRaw 反推（作用域不可知，归 global）
            const key = e.ruleKey || ('global|' + (e.decision === 'allow' ? 'allow' : e.decision === 'ask' ? 'ask' : e.decision) + '|' + e.ruleRaw)
            ruleHits.set(key, (ruleHits.get(key) || 0) + 1)
          }
        } catch (err) { /* 跳过坏行 */ }
      }
    } catch (e) { /* 文件不存在即首次启动 */ }
  })()
  let historyBytes = 0
  let trimScheduled = false
  function pushAudit(entry) {
    const full = Object.assign({ seq: ++auditSeq }, entry)
    audit.push(full)
    if (audit.length > 200) audit.shift()
    // 持久化：追加一行 JSON（含 ruleKey 供重放）；文件超 2MB 时截断为尾部 200 行
    const key = entry.ruleRaw !== undefined && entry.decision !== 'fallback' && entry.decision !== 'engine-error'
      ? ((entry.source !== 'none' && entry.source !== 'policy-never' && entry.source !== 'grant' ? entry.source : 'global') + '|' + (entry.decision === 'allow' ? 'allow' : entry.decision === 'ask' ? 'ask' : entry.decision) + '|' + entry.ruleRaw)
      : undefined
    const line = JSON.stringify(Object.assign({}, full, key !== undefined ? { ruleKey: key } : {})) + '\n'
    historyBytes += line.length
    appendFile(historyFile, line, 'utf8').catch(() => {})
    if (historyBytes > 2 * 1024 * 1024 && !trimScheduled) {
      trimScheduled = true
      ;(async () => {
        try {
          await mkdir(path.dirname(historyFile), { recursive: true })
          const keep = audit.map((e) => JSON.stringify(e) + '\n').join('')
          await writeFile(historyFile, keep, 'utf8')
          historyBytes = keep.length
        } catch (e) { /* 截断失败下次再试 */ }
        trimScheduled = false
      })()
    }
  }
  ctx.on('tools/pre-execute', async (exec, next) => {
    let tool = '?'
    try {
      tool = exec.name
      if (!current || !current.enabled) return next()
      if (exec.agent === undefined || exec.agent === null) return next()
      const arg = clipText(primaryArgOf(tool, exec.arguments))
      let wsId
      try { wsId = await resolveWorkspaceId(exec.agent) } catch (e) { wsId = undefined }
      const keys = wsId !== undefined ? ['global', 'ws:' + wsId] : ['global']
      const rule = evaluate(getMerged(keys), tool, exec.arguments)
      if (rule === undefined) {
        pushAudit({ tool, arg, decision: 'fallback', source: 'none' })
        return next()
      }
      countHit(rule)
      if (rule.action === 'hard') {
        pushAudit({ tool, arg, decision: 'hard', source: rule.source, ruleRaw: rule.raw })
        return { kind: 'deny', reason: '[dsh-permissions] hard-deny (above full access, not exemptable) [' + sourceLabel(rule.source) + ' · hard]: ' + rule.raw }
      }
      if (rule.action === 'deny') {
        pushAudit({ tool, arg, decision: 'deny', source: rule.source, ruleRaw: rule.raw })
        return { kind: 'deny', reason: '[dsh-permissions] denied by rule [' + sourceLabel(rule.source) + ' · deny]: ' + rule.raw }
      }
      if (rule.action === 'allow') {
        pushAudit({ tool, arg, decision: 'allow', source: rule.source, ruleRaw: rule.raw })
        return next()
      }
      if (effectivePolicy(exec.agent) === 'never') {
        pushAudit({ tool, arg, decision: 'allow', source: 'policy-never', ruleRaw: rule.raw })
        return next()
      }
      // 会话授予：本会话已"总是允许"过这条规则 → 直接放行
      if (hasGrant(exec.agent, rule)) {
        pushAudit({ tool, arg, decision: 'allow', source: 'grant', ruleRaw: rule.raw })
        return next()
      }
      // 走自定义三选审批（仅本次 / 本会话总是允许 / 拒绝）；approval 缺失则回退注册表 ask（fail closed）
      if (approval !== undefined) {
        pushAudit({ tool, arg, decision: 'ask', source: rule.source, ruleRaw: rule.raw })
        const outcome = await approval.request({
          agent: exec.agent,
          toolName: tool,
          callId: exec.callId,
          reason: ASK_PREFIX + grantKeyOf(rule),
          signal: exec.signal,
        })
        if (outcome === 'allowed-once') {
          pushAudit({ tool, arg, decision: 'allow', source: rule.source, ruleRaw: rule.raw })
          return next()
        }
        return { kind: 'deny', reason: '[dsh-permissions] user rejected ' + tool + ' (rule [' + sourceLabel(rule.source) + ' · ask]: ' + rule.raw + ')' }
      }
      pushAudit({ tool, arg, decision: 'ask', source: rule.source, ruleRaw: rule.raw })
      return { kind: 'ask', reason: '[dsh-permissions] rule requires confirmation [' + sourceLabel(rule.source) + ' · ask]: ' + rule.raw }
    } catch (err) {
      pushAudit({ tool, arg: '', decision: 'engine-error', source: 'none' })
      return next()
    }
  })

  if (systemPrompt !== undefined) {
    ctx.effect(() => systemPrompt.section({
      name: 'active-permission-rules',
      order: 108,
      text: () => summaryText(current),
    }))
  }

  // ---------- 设置页专用 HTTP 路由 ----------
  // api-proxy 的 settings.describe 只暴露硬编码白名单命名空间，自定义命名空间
  // 无法经官方 settings API 触达。引擎用自己持有的 SettingsScope 直读直写，
  // 通过自建路由 /api/dperm/* 服务自己的设置页（同源 fetch，无 CORS）。
  // 子路由：GET/POST /rules（读写规则）、GET /log（决策日志）、GET /match-test（试算器）。
  const webServer = ctx.get('webServer')
  if (webServer !== undefined) {
    ctx.effect(() => webServer.register({
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由贡献与限制可推导什么可证伪的新设计假设？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是把匹配输入改为工具 schema 驱动的规范化资源对象，并在执行前显示最终 canonical path，可显著减少路径绕过与误拦。最小对抗集包含 100 个绝对/相对/符号链接/引号/大小写/PowerShell 嵌套用例，比较现规则和规范化规则的漏拦、误拦与审批次数；任何已知秘密路径漏拦即否定。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:143-366](https://github.com/940842546/dsh-permissions/blob/ad84f1d0928396a9597e557b6540f1f6feca2052/lib/index.js#L143-L366)

固定版本源码用于核对 Q08 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（224行）</summary>

```text
  function grantsOfSession(sid) {
    const set = grants.get(sid)
    if (set === undefined) return []
    return [...set].map((key) => {
      const sep1 = key.indexOf('|')
      const sep2 = key.indexOf('|', sep1 + 1)
      return { source: key.slice(0, sep1), action: key.slice(sep1 + 1, sep2), raw: key.slice(sep2 + 1) }
    })
  }

  // 抢答器：拦截自家 ask 问询（reason 带 ASK_PREFIX），改走 /api/dperm/ask 的三选 UI
  if (approval !== undefined) {
    ctx.on('approval/request', (req, next) => {
      if (req.signal && req.signal.aborted) return next()
      if (typeof req.reason !== 'string' || !req.reason.startsWith(ASK_PREFIX)) return next()
      const callId = String(req.callId !== undefined ? req.callId : Math.random().toString(36).slice(2))
      return new Promise((resolve) => {
        pendingAsks.set(callId, { resolve, toolName: req.toolName, agent: req.agent, rule: req.reason.slice(ASK_PREFIX.length) })
        try { ctx.emit('dsh-permissions/ask-pending', callId) } catch (e) {}
      })
    }, { prepend: true })
  }

  function settleAsk(callId, choice) {
    const p = pendingAsks.get(callId)
    if (p === undefined) return false
    pendingAsks.delete(callId)
    if (choice === 'always') {
      // rule 字符串就是 grantKey 格式（source|action|raw 由引擎拼装传入 reason）
      const sid = p.agent && p.agent.session ? String(p.agent.session.id) : ''
      if (sid !== '') {
        let set = grants.get(sid)
        if (set === undefined) { set = new Set(); grants.set(sid, set) }
        set.add(p.rule)
      }
      p.resolve('allowed-once')
    } else if (choice === 'once') {
      p.resolve('allowed-once')
    } else {
      p.resolve('rejected')
    }
    return true
  }

  function getMerged(keys) {
    const key = keys.join('|')
    const hit = mergedCache.get(key)
    if (hit !== undefined && hit.rev === rulesRev) return hit.rules
    const ws = (current && current.workspaces) || {}
    const rules = mergeRules(keys.map((k) => ({
      source: k,
      set: k === 'global'
        ? { hard: current.hard || [], deny: current.deny || [], ask: current.ask || [], allow: current.allow || [] }
        : (ws[k.slice(3)] || EMPTY),
    })))
    mergedCache.set(key, { rev: rulesRev, rules })
    return rules
  }

  // ---------- 作用域解析（Workspace 实体字段是 id；SessionHeader.cwd 锚定） ----------
  async function resolveWorkspaceId(agent) {
    if (agent === undefined || agent === null) return undefined
    const sess = agent.session
    const cwd = sess && sess.header ? sess.header.cwd : undefined
    if (cwd === undefined || cwd === null || cwd === '') return undefined
    if (wsCache.has(cwd)) return wsCache.get(cwd)
    let id
    try {
      const ws = workspaceRegistry ? await workspaceRegistry.resolveByPath(cwd) : undefined
      id = ws && ws.id ? String(ws.id) : undefined
    } catch (e) { id = undefined }
    wsCache.set(cwd, id)
    return id
  }

  // ---------- 会话审批策略（仅 ask 跟随；hard/deny 永不受影响） ----------
  function effectivePolicy(agent) {
    if (approval === undefined) return 'ask'
    let policy
    try {
      const sess = agent && agent.session
      policy = sess ? approval.overrideOf(sess) : undefined
    } catch (e) { policy = undefined }
    if (policy !== undefined && policy !== null) return policy
    const cfg = approval.config
    return cfg && cfg.policy ? cfg.policy : 'ask'
  }

  // ---------- 决策引擎（含审计环形缓冲 + 规则命中计数 + JSONL 持久化） ----------
  const audit = []
  let auditSeq = 0
  const ruleHits = new Map() // key: source|action|raw → count
  const historyFile = path.join(process.env.DSH_HOME || path.join(homedir(), '.dsh'), 'dsh-permissions-history.jsonl')
  function countHit(rule) {
    const key = rule.source + '|' + rule.action + '|' + rule.raw
    ruleHits.set(key, (ruleHits.get(key) || 0) + 1)
  }
  function clipText(text) {
    const s = String(text === undefined || text === null ? '' : text)
    return s.length > 80 ? s.slice(0, 80) : s
  }
  // 启动时重放历史尾部：恢复日志环 + 命中计数（异步，不阻塞启动）
  ;(async () => {
    try {
      const text = await readFile(historyFile, 'utf8')
      const lines = text.split('\n').filter((l) => l.trim() !== '')
      const tail = lines.slice(-200)
      for (const line of tail) {
        try {
          const e = JSON.parse(line)
          if (e.seq > auditSeq) auditSeq = e.seq
          audit.push(e)
          if (e.ruleRaw && e.decision && e.decision !== 'fallback' && e.decision !== 'engine-error') {
            // 重放命中计数：日志行带 ruleKey 时直接用；否则按 ruleRaw 反推（作用域不可知，归 global）
            const key = e.ruleKey || ('global|' + (e.decision === 'allow' ? 'allow' : e.decision === 'ask' ? 'ask' : e.decision) + '|' + e.ruleRaw)
            ruleHits.set(key, (ruleHits.get(key) || 0) + 1)
          }
        } catch (err) { /* 跳过坏行 */ }
      }
    } catch (e) { /* 文件不存在即首次启动 */ }
  })()
  let historyBytes = 0
  let trimScheduled = false
  function pushAudit(entry) {
    const full = Object.assign({ seq: ++auditSeq }, entry)
    audit.push(full)
    if (audit.length > 200) audit.shift()
    // 持久化：追加一行 JSON（含 ruleKey 供重放）；文件超 2MB 时截断为尾部 200 行
    const key = entry.ruleRaw !== undefined && entry.decision !== 'fallback' && entry.decision !== 'engine-error'
      ? ((entry.source !== 'none' && entry.source !== 'policy-never' && entry.source !== 'grant' ? entry.source : 'global') + '|' + (entry.decision === 'allow' ? 'allow' : entry.decision === 'ask' ? 'ask' : entry.decision) + '|' + entry.ruleRaw)
      : undefined
    const line = JSON.stringify(Object.assign({}, full, key !== undefined ? { ruleKey: key } : {})) + '\n'
    historyBytes += line.length
    appendFile(historyFile, line, 'utf8').catch(() => {})
    if (historyBytes > 2 * 1024 * 1024 && !trimScheduled) {
      trimScheduled = true
      ;(async () => {
        try {
          await mkdir(path.dirname(historyFile), { recursive: true })
          const keep = audit.map((e) => JSON.stringify(e) + '\n').join('')
          await writeFile(historyFile, keep, 'utf8')
          historyBytes = keep.length
        } catch (e) { /* 截断失败下次再试 */ }
        trimScheduled = false
      })()
    }
  }
  ctx.on('tools/pre-execute', async (exec, next) => {
    let tool = '?'
    try {
      tool = exec.name
      if (!current || !current.enabled) return next()
      if (exec.agent === undefined || exec.agent === null) return next()
      const arg = clipText(primaryArgOf(tool, exec.arguments))
      let wsId
      try { wsId = await resolveWorkspaceId(exec.agent) } catch (e) { wsId = undefined }
      const keys = wsId !== undefined ? ['global', 'ws:' + wsId] : ['global']
      const rule = evaluate(getMerged(keys), tool, exec.arguments)
      if (rule === undefined) {
        pushAudit({ tool, arg, decision: 'fallback', source: 'none' })
        return next()
      }
      countHit(rule)
      if (rule.action === 'hard') {
        pushAudit({ tool, arg, decision: 'hard', source: rule.source, ruleRaw: rule.raw })
        return { kind: 'deny', reason: '[dsh-permissions] hard-deny (above full access, not exemptable) [' + sourceLabel(rule.source) + ' · hard]: ' + rule.raw }
      }
      if (rule.action === 'deny') {
        pushAudit({ tool, arg, decision: 'deny', source: rule.source, ruleRaw: rule.raw })
        return { kind: 'deny', reason: '[dsh-permissions] denied by rule [' + sourceLabel(rule.source) + ' · deny]: ' + rule.raw }
      }
      if (rule.action === 'allow') {
        pushAudit({ tool, arg, decision: 'allow', source: rule.source, ruleRaw: rule.raw })
        return next()
      }
      if (effectivePolicy(exec.agent) === 'never') {
        pushAudit({ tool, arg, decision: 'allow', source: 'policy-never', ruleRaw: rule.raw })
        return next()
      }
      // 会话授予：本会话已"总是允许"过这条规则 → 直接放行
      if (hasGrant(exec.agent, rule)) {
        pushAudit({ tool, arg, decision: 'allow', source: 'grant', ruleRaw: rule.raw })
        return next()
      }
      // 走自定义三选审批（仅本次 / 本会话总是允许 / 拒绝）；approval 缺失则回退注册表 ask（fail closed）
      if (approval !== undefined) {
        pushAudit({ tool, arg, decision: 'ask', source: rule.source, ruleRaw: rule.raw })
        const outcome = await approval.request({
          agent: exec.agent,
          toolName: tool,
          callId: exec.callId,
          reason: ASK_PREFIX + grantKeyOf(rule),
          signal: exec.signal,
        })
        if (outcome === 'allowed-once') {
          pushAudit({ tool, arg, decision: 'allow', source: rule.source, ruleRaw: rule.raw })
          return next()
        }
        return { kind: 'deny', reason: '[dsh-permissions] user rejected ' + tool + ' (rule [' + sourceLabel(rule.source) + ' · ask]: ' + rule.raw + ')' }
      }
      pushAudit({ tool, arg, decision: 'ask', source: rule.source, ruleRaw: rule.raw })
      return { kind: 'ask', reason: '[dsh-permissions] rule requires confirmation [' + sourceLabel(rule.source) + ' · ask]: ' + rule.raw }
    } catch (err) {
      pushAudit({ tool, arg: '', decision: 'engine-error', source: 'none' })
      return next()
    }
  })

  if (systemPrompt !== undefined) {
    ctx.effect(() => systemPrompt.section({
      name: 'active-permission-rules',
      order: 108,
      text: () => summaryText(current),
    }))
  }

  // ---------- 设置页专用 HTTP 路由 ----------
  // api-proxy 的 settings.describe 只暴露硬编码白名单命名空间，自定义命名空间
  // 无法经官方 settings API 触达。引擎用自己持有的 SettingsScope 直读直写，
  // 通过自建路由 /api/dperm/* 服务自己的设置页（同源 fetch，无 CORS）。
  // 子路由：GET/POST /rules（读写规则）、GET /log（决策日志）、GET /match-test（试算器）。
  const webServer = ctx.get('webServer')
  if (webServer !== undefined) {
    ctx.effect(() => webServer.register({
```

</details>

#### 缺口

- 路径与 shell 参数变体的真实旁路率未知
  **影响**：决定插件能否作为可信的附加门禁
  **进一步探讨**：用100个对抗参数和符号链接路径在无副作用假工具上跑命中矩阵，零秘密路径漏拦才进入真实试用

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 哪些人应观察、试用或拒绝采用 dsh-permissions？

**研究主题**：采用判断

#### 完整回答

有明确威胁模型、能维护规则和保留宿主沙箱的团队可在非生产 profile 试用；先用只读/模拟工具跑对抗集，再启用 hard 保护真实路径。把它当唯一安全边界、规则无人维护或工具大量通过 shell 二次解释的环境不适合。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:10-25](https://github.com/940842546/dsh-permissions/blob/ad84f1d0928396a9597e557b6540f1f6feca2052/README.md#L10-L25)

固定版本作者材料支持 Q09 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（16行）</summary>

```text
## 亮点

- **四级规则、严格优先级**：`hard` > `deny` > `ask` > `allow`。
- **`hard` 高于全访问**：即使会话处于全访问档（审批策略 `never`），hard 规则依然拦截、不可豁免；`ask` 规则跟随会话策略，全访问下自动放行。
- **作用域**：`global` 规则全局生效；按 `workspace` 的规则叠加合并（冲突时 deny 永远胜出）。
- **通配符匹配**（文件类工具 `read`/`write`/`edit`/`glob`/`grep`/`read_image`）：
  - `write(*.pem)` —— 路径以 `.pem` 结尾
  - `write(*secret*)` —— 路径包含 `secret`
  - `write(.ssh)` —— 路径任意位置出现 `.ssh` 片段（大小写不敏感，`\`/`/` 统一归一化）
  - `write(C:\users\*)` —— 绝对路径前缀
  - 裸 `write` —— 该工具全部调用
- **持久化**：规则存于 `dsh-permissions` 设置命名空间，跨重启保留（`<harness home>/settings.yaml`）。
- **模型透明**：生效规则注入系统提示（`[active-permission-rules]` 段）。
- **可视化编辑器**：草稿式（staged）编辑——所有修改点「保存并应用」后才生效，附一键预设（保护敏感目录 / 密钥文件 / 拦截危险命令）。

## 界面截图
```

</details>

#### 缺口

- 路径与 shell 参数变体的真实旁路率未知
  **影响**：决定插件能否作为可信的附加门禁
  **进一步探讨**：用100个对抗参数和符号链接路径在无副作用假工具上跑命中矩阵，零秘密路径漏拦才进入真实试用

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
