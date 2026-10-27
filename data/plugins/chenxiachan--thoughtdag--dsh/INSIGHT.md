# dsh-thoughtdag

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[5e3318a](https://github.com/chenxiachan/thoughtdag/tree/5e3318a42540b0cbef089784bbf3007493b0b994/dsh)

<!-- BEGIN META -->
[![GitHub ★ 701](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=701&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/chenxiachan/thoughtdag) [![npm 30d 6,907](https://img.shields.io/static/v1?label=npm+30d&message=6%2C907&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-thoughtdag) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-thoughtdag)
<!-- END META -->

> **功能**：将 DSH 会话嵌入 ThoughtDAG 画布，并提供历史检索、上下文注入和会话继续接口。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)、[Q03](#research-q03)把父项目图/索引接到DSH会话和工具，减少外部导出与复制；贡献归属在适配，不把图算法与CLI索引算作子插件原创。

> **主要限制**：[Q04](#research-q04)Host字符串不是身份认证，词法路径不是完整文件授权；[Q03](#research-q03)历史候选解释不是因果证据，fork也不恢复工作区。生成物必须按发布链核查，不能混同源码与npm包。

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
  - [Q01 · DSH子组件怎样把会话图与真实执行联接，贡献属于哪里？](#detail-section-11)
  - [Q02 · 画布上的fork、注入与继续如何变成宿主动作，是否只读？](#detail-section-12)
  - [Q03 · why历史工具能证明修改原因吗，工具实际实现在哪里？](#detail-section-13)
  - [Q04 · 本地Host围栏与源仓库构建能保证哪些边界？](#detail-section-14)
  - [Q05 · 从导入到继续和退出，要承担哪些模型、索引与恢复成本？](#detail-section-15)
  - [Q06 · 能否为画布写回建立引用绑定与可审阅授权？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：本项是ThoughtDAG仓库dsh子目录的原生插件，不把整个桌面应用算成插件自身开发量。目标用户是在长会话与多个分支中梳理思路、追问并定位过去改动的开发者或研究者；合格结果是节点能追溯原会话与轮次，选定上下文继续执行后能找到真实输出。相对导出JSONL到外部图工具，它在同一DSH Web服务挂载同源画布，并可把图中的上下文送回原宿主会话。无限画布、图导入与why索引来自父项目，DSH插件增量是嵌入、会话桥、工具和权限适配，不是新的推理模型或因果推断算法。README列出的历史安装验证是作者报告，本轮没有重现。

原DSH会话加日志搜索及手工复制到图；历史为什么仍需读原工具证据，不能靠图中解释替代。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 画布与会话桥 | 梳理历史及继续 | 生成SPA和宿主服务必需 |
| why工具 | 查历史事件与原文 | 需构建索引，不证明因果/当前正确 |
| fork/inject/followup | 宿主继续执行 | 有实际副作用，不恢复代码 |

**流程与依赖**

| 依赖 | 是否必需 | 用途 | 缺失处理 |
|---|---|---|---|
| DSH会话/controller/agent/审批等 | 核心必需 | 读写会话与执行 | 失败或不能挂载 |
| 生成SPA、why.mjs、runtime | 包运行必需 | 界面与索引/备份 | 源码需build，缺runtime可加载失败 |
| 本机历史及~/.thoughtdag | why效果必需 | 索引与回查 | 未命中不证明无历史 |
| 模型与凭据/工具权限 | 续问必需 | 真实推理执行 | 按宿主失败或审批 |

| 步骤 | 用户/后台动作 | 验收与退路 |
|---|---|---|
| 准备 | 固定包、宿主和访问范围 | 生成物齐备/仅本机授权 |
| 只读 | 导入可丢弃会话到图 | 节点回到原轮次 |
| 继续 | 明确目标后注入或followup | 查真实宿主结果，断线不盲重投 |
| 退出 | 停用桥、管理索引与备份 | 保留原始会话和代码备份 |

**效果与成本**

| 阶段 | 现金与资源 | 人工时间 | 边界 |
|---|---|---|---|
| 首次 | 宿主与前端/构建资源未知 | 验包、版本、历史范围 | 源码方式需父项目构建 |
| 持续 | 索引磁盘、解压、模型调用未知 | 选图上下文、核查历史与费用 | 代理调用未必入会话 |
| 恢复退出 | 索引与备份清理、重试未知 | 核对已接收prompt、保留原会话 | fork不回滚代码 |

| 效果 | 支持 | 未知 |
|---|---|---|
| 历史可定位 | why分派及原会话ID | 解析完整性/当前正确性 |
| 图到执行 | inject/followup真实接线 | UI全链与语义保留 |
| 集成 | 同一Web服务 | 当前发布包/宿主验收 |

> **思考**：[Q04](#research-q04)Host字符串不是身份认证，词法路径不是完整文件授权；[Q03](#research-q03)历史候选解释不是因果证据，fork也不恢复工作区。生成物必须按发布链核查，不能混同源码与npm包。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)、[Q03](#research-q03)把父项目图/索引接到DSH会话和工具，减少外部导出与复制；贡献归属在适配，不把图算法与CLI索引算作子插件原创。

[Q02](#research-q02)沿用宿主controller和审批瀑布、区分inject与唤醒，避免另建执行循环。[Q04](#research-q04)顶层生成物依赖和词法路径边界使移植必须携带构建/授权契约；why索引可重建不等于原始历史可全部恢复。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q04](#research-q04)Host字符串不是身份认证，词法路径不是完整文件授权；[Q03](#research-q03)历史候选解释不是因果证据，fork也不恢复工作区。生成物必须按发布链核查，不能混同源码与npm包。

<a id="detail-section-6"></a>

### 1.5 使用建议

首次需匹配Node/DSH及十余宿主服务，npm包应带生成SPA、why库和runtime；源码方式另外构建父项目。用户还要判断哪些本机历史允许进入画布及索引。持续成本包含日志扫描/解压、浏览器画布、~/.thoughtdag派生索引、模型摘要与继续执行，原生llm代理调用未必进入会话日志，完整费用不能只按镜像会话计。fork保留会话前缀不等于代码工作区同时回滚，inject改变下一步上下文也不是撤销原工具副作用；失败后应核对是否已有prompt被接收，不盲重投。当前推荐观察，先核清访问范围、构建产物和可丢弃会话的完整联接，再选择只读导入；金额、总人工时间和后续任务质量未知，不凭图形化便利升级常用。 [Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持同源画布、会话读写桥和why库注册；构建产物、真实宿主、访问策略与历史完整性未验收；绑定写回是假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、dsh/README.md、dsh/package.json、dsh/lib/index.js、dsh/scripts/build.mjs、runtime/backup-write.cjs、cli/src/lib.ts 及固定范围 inventory；组件：dsh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅dsh组件与关键父项目CLI查询分派/备份实现；inventory规模限dsh子目录，不把全仓当插件LOC；未构建、安装、调用模型或读取用户历史。
- 下一步：固定发布包检查SPA/why/runtime；在隔离只读样本核索引、符号链接和Host授权，再测试一次inject/fork/followup及断线结果、代码与会话分离；未执行。

**分析版本**

- **仓库**：[chenxiachan/thoughtdag](https://github.com/chenxiachan/thoughtdag)
- **版本号**：0.5.26（[固定提交 5e3318a](https://github.com/chenxiachan/thoughtdag/tree/5e3318a42540b0cbef089784bbf3007493b0b994)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是把选中节点编译成绑定会话ID、输入末序号、来源轮次和目标工作区的候选上下文，先预览差异与本轮工具权限，再提交一次稳定requestId；把只读历史浏览与能唤醒代理/写备份分别授权。推导来自当前Host范围、临时生成requestId和图/会话双表示的交接缺口，而不是认为已有fork即保证安全。最小验证用故意过期节点、断线、重复提交和同名备份案例，比较重复执行、错会话注入及用户确认时间；如果绑定仍无法识别副作用或确认负担大于手工复制上下文，则否定。该方案不计入当前贡献，也不宣称无需进一步用户需求验证。 [Q06](#research-q06)

固定发布包检查SPA/why/runtime；在隔离只读样本核索引、符号链接和Host授权，再测试一次inject/fork/followup及断线结果、代码与会话分离；未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 1993 | 1497 | 431 | — |
| .md | source | 1 | 135 | — | — | 1625 |
| .mjs | source | 2 | 128 | 86 | 34 | — |

</details>

**活跃度**

[![近30天新建 24](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=24&color=737b86&logo=github)](https://github.com/chenxiachan/thoughtdag/issues?q=is%3Aissue+created%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z) [![近30天关闭 26](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=26&color=737b86&logo=github)](https://github.com/chenxiachan/thoughtdag/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z)

暂未获取：Issue 未关闭。

统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实dsh子组件从会话图到宿主动作的真实增量、历史证据与权限/构建边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · DSH子组件怎样把会话图与真实执行联接，贡献属于哪里？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

本项是ThoughtDAG仓库dsh子目录的原生插件，不把整个桌面应用算成插件自身开发量。目标用户是在长会话与多个分支中梳理思路、追问并定位过去改动的开发者或研究者；合格结果是节点能追溯原会话与轮次，选定上下文继续执行后能找到真实输出。相对导出JSONL到外部图工具，它在同一DSH Web服务挂载同源画布，并可把图中的上下文送回原宿主会话。无限画布、图导入与why索引来自父项目，DSH插件增量是嵌入、会话桥、工具和权限适配，不是新的推理模型或因果推断算法。README列出的历史安装验证是作者报告，本轮没有重现。

#### 证据与依据

**依据 1 · 作者声明**：[dsh/README.md:3-24](https://github.com/chenxiachan/thoughtdag/blob/5e3318a42540b0cbef089784bbf3007493b0b994/dsh/README.md#L3-L24)

子目录身份、同源SPA和宿主面板嵌入说明。

<details>
<summary>查看原文（22行）</summary>

```text
This directory is the DeepSeek Harness plugin of [ThoughtDAG](../README.md), published to npm as `dsh-thoughtdag`; its version follows the app's, and the ThoughtDAG build it embeds is the one in this tree.

ThoughtDAG for DeepSeek Harness: open DSH sessions (live or on disk) as
editable thought graphs on ThoughtDAG's infinite canvas — from inside the
harness UI.

Source, releases and issues live at **[github.com/chenxiachan/thoughtdag](https://github.com/chenxiachan/thoughtdag)**. If the plugin helps you, a star there helps others find it.

This is a [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)
plugin (a Cordis plugin distributed as an npm package), built on the same shell
pattern as [dsh-synapse](https://github.com/liangmianya/dsh-synapse): the host
half mounts the ThoughtDAG SPA under `/thoughtdag/` on the EXISTING harness
web server (no second process, no second port), and the client half adds a
**ThoughtDAG** entry to the harness sidebar (beside Plugins) that shows the
canvas in the main column, in a same-origin iframe.

> The entry is the host's own panel mechanism (`sidebar.panellist` plus the
> root `main` panel slot), so it is there before any session is open and
> follows the host's language and theme. The iframe stays in the plugin's own
> layer, laid over the panel while it is selected, so switching never reloads
> the canvas. (0.4.19 to 0.5.18 floated a 对话 | 思维图 switch over the top
> strip instead; every placement collided with host chrome somewhere, see
```

</details>

**依据 2 · 源码核查**：[dsh/package.json:2-25](https://github.com/chenxiachan/thoughtdag/blob/5e3318a42540b0cbef089784bbf3007493b0b994/dsh/package.json#L2-L25)

发布包身份与Host/Client入口。

<details>
<summary>查看原文（24行）</summary>

```text
  "name": "dsh-thoughtdag",
  "version": "0.5.26",
  "description": "ThoughtDAG for DeepSeek Harness: turn the current DSH session into an editable thought graph on an infinite canvas. Source, releases and issues: github.com/chenxiachan/thoughtdag",
  "author": "Xia Chen",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/chenxiachan/thoughtdag.git",
    "directory": "dsh"
  },
  "homepage": "https://github.com/chenxiachan/thoughtdag/tree/main/dsh#readme",
  "bugs": "https://github.com/chenxiachan/thoughtdag/issues",
  "type": "module",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 画布上的fork、注入与继续如何变成宿主动作，是否只读？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

桥读取活跃和持久会话并输出JSONL；客户端面板承载同源iframe。API按GET或POST分路由：fork可按已完成turn的endSeq切分；inject调用agent.inject只为下一步加上下文、不主动唤醒；followup调用sessionController.prompt按queue或steer发送真实用户输入，会唤醒执行，因此桥整体并非只读。harness/agent模式也创建或复用真实DSH会话并回传流式事件。画布审批通过approval/request前置接管当前画布轮次，流失效则交回宿主面板；allowed-session按工具与去除说明字段后的参数记规则，不是全会话无条件放行。具体API存在不等于画布每个菜单都已接好，README仍列出部分write UI路线图，试用须核对实际操作入口。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/lib/index.js:1653-1695](https://github.com/chenxiachan/thoughtdag/blob/5e3318a42540b0cbef089784bbf3007493b0b994/dsh/lib/index.js#L1653-L1695)

真实fork/inject/prompt调用，明确副作用。

<details>
<summary>查看原文（43行）</summary>

```text
      const write = /^\/sessions\/([^/]+)\/(fork|inject|followup)$/.exec(path)
      if (write !== null && req.method === 'POST') {
        const id = decodeURIComponent(write[1])
        const body = await readJson(req, MAX_WRITE_BODY_BYTES)
        if (write[2] === 'fork') {
          // the boundary: an explicit seq, or the end of a named turn
          let atSeq = typeof body?.atSeq === 'number' ? body.atSeq : undefined
          if (typeof body?.afterTurn === 'number') {
            const events = await eventsOfSession(ctx, id)
            if (events === null) return sendJson(res, 404, { error: 'no such session' })
            const t = turnsOf(events).find(x => x.turn === body.afterTurn)
            if (!t) return sendJson(res, 400, { error: 'no such turn: ' + body.afterTurn })
            if (t.endSeq === null) return sendJson(res, 409, { error: 'turn ' + body.afterTurn + ' is still open; a fork needs a completed turn' })
            atSeq = t.endSeq
          }
          try {
            const r = await ctx.sessionController.fork({ sessionId: id, ...(atSeq !== undefined ? { atSeq } : {}) })
            return sendJson(res, 200, { session: r.sessionId, parent: id, atSeq: atSeq ?? null })
          } catch (error) {
            const code = error?.code ?? error?.name ?? 'fork failed'
            return sendJson(res, /NOT_FOUND/.test(String(code)) ? 404 : 409, { error: String(error?.message ?? code), code })
          }
        }
        const content = contentOf(body)
        if (write[2] === 'inject') {
          const agent = await agentOf(ctx, id)
          const message = { id: 'td-' + randomUUID(), role: 'user', content, source: SOURCE }
          agent.inject(message)
          return sendJson(res, 200, { accepted: true, session: id, messageId: message.id })
        }
        // followup: a person's prompt from the canvas — the controller owns
        // the user source and the queue/steer semantics the UI uses
        const requestId = 'td-' + randomUUID()
        const mode = body?.mode === 'steer' ? 'steer' : 'queue'
        await ctx.sessionController.prompt({ requestId, sessionId: id, mode, content }, AbortSignal.timeout(30000))
        return sendJson(res, 200, { accepted: true, session: id, requestId, mode })
      }
      return sendJson(res, 404, { error: 'not found' })
    } catch (error) {
      if (error instanceof HttpError) return sendJson(res, error.status, { error: error.message })
      ctx.logger.error(error instanceof Error ? error : new Error(String(error)))
      // the bridge only answers trusted local hosts, so the message may travel
      return sendJson(res, 500, { error: 'bridge unavailable', detail: error instanceof Error ? error.message : String(error) })
```

</details>

**依据 2 · 源码核查**：[dsh/lib/index.js:994-1024](https://github.com/chenxiachan/thoughtdag/blob/5e3318a42540b0cbef089784bbf3007493b0b994/dsh/lib/index.js#L994-L1024)

审批按当前canvas turn关联及站立规则，断流回宿主。

<details>
<summary>查看原文（31行）</summary>

```text
  ctx.on('approval/request', async function (req, next) {
    // an approval raised by another turn of the same session (the person's
    // own tool call, running before or after ours) stays with the harness UI
    const entry = canvasTurnOf(req?.agent)
    if (!entry) return next()
    const sessionId = req.agent.id
    const id = 'td-' + randomUUID()
    const call = req.callId !== undefined ? entry.calls.get(req.callId) : undefined
    const name = call?.name ?? req.toolName
    const args = typeof call?.arguments === 'string' ? call.arguments : (call?.arguments ? JSON.stringify(call.arguments) : null)
    const query = call ? toolQuery(name, call.arguments) : ''
    // a standing allowance covers exactly this step: same tool, same arguments
    const rule = call ? `harness:${name}:${stepKey(call.arguments)}` : null
    if (rule && sessionRules.get(sessionId)?.has(rule)) {
      entry.emit({ approvalDecided: { id, outcome: 'allowed-session', auto: true, name, query, rule } })
      return 'allowed-once'
    }
    entry.emit({ approval: {
      id, toolName: req.toolName, callId: req.callId ?? null, reason: req.reason ?? null,
      name, query, arguments: args, ...(rule ? { rule } : {}),
    } })
    const r = await personDecides(id, sessionId, entry, req.signal, 'approval')
    if (r === 'closed') return next()
    const outcome = r === 'aborted' ? 'cancelled' : r
    if (outcome === 'allowed-session' && rule) {
      if (!sessionRules.has(sessionId)) sessionRules.set(sessionId, new Set())
      sessionRules.get(sessionId).add(rule)
    }
    entry.emit({ approvalDecided: { id, outcome, ...(outcome === 'allowed-session' && rule ? { rule } : {}) } })
    return outcome === 'allowed-session' ? 'allowed-once' : outcome
  }, true)
```

</details>

**依据 3 · 作者声明**：[dsh/README.md:105-111](https://github.com/chenxiachan/thoughtdag/blob/5e3318a42540b0cbef089784bbf3007493b0b994/dsh/README.md#L105-L111)

作者仍单列部分画布写入UI/replace路线图，不能按API反推所有UI完成。

```text
## Not yet (roadmap)

- Canvas why panel (a node's file → its history through `/thoughtdag/api`)
- Canvas UI for the write bridge: name a fork point on a node, hand a compiled context to `inject`, continue with `followup`; the client already switches the chat to a session the canvas names (`td:select-session`)
- `replace`: shadow a surface range from the canvas (DSH's compaction primitive); needs a live check of how the chat renders a replaced range
- Theme sync of the canvas itself with the harness UI (the sidebar entry already follows the host's language and theme)
- Open the chat's current session on the canvas automatically when the view switches
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · why历史工具能证明修改原因吗，工具实际实现在哪里？

**研究主题**：功能与机制、贡献与相对优势、缺陷与关键质疑

#### 完整回答

插件默认尝试加载构建生成的why.mjs，将父项目CLI的why_check、why_file、find和recall_turn映射成四个原生工具，并添加/why命令与提示段。why_check先做轻量历史存在检查，why_file/查找/回忆通过本地索引定位过去工具事件和问答，路径相对会话cwd解析。核查到CLI区分事实索引、解释缓存与文本索引，工具说明也把答案里的解释标为candidate而不是verified reason；历史会话提到或修改文件不证明当前代码正确，更不能证明作者真实动机。索引会读取本机不同Agent会话及记忆，价值是缩小历史查找范围而非可靠因果归因。已查注册与mcpCall核心分派，未逐项审计所有来源解析器和索引完整性。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/lib/index.js:1301-1355](https://github.com/chenxiachan/thoughtdag/blob/5e3318a42540b0cbef089784bbf3007493b0b994/dsh/lib/index.js#L1301-L1355)

加载why库、四工具和命令及提示实际注册。

<details>
<summary>查看原文（55行）</summary>

```text
async function installWhyLayer(ctx, config) {
  const wantTools = config?.whyTools !== false
  const wantPrompt = config?.whyPrompt !== false
  if (!wantTools && !wantPrompt) return
  let why
  try {
    why = await import('./why.mjs')
    why.setQuiet?.(true)
  } catch (error) {
    whyStatus.error = error instanceof Error ? error.message : String(error)
    ctx.logger.warn('[dsh-thoughtdag] why layer not loaded: ' + whyStatus.error)
    console.error('[dsh-thoughtdag] why layer not loaded: ' + whyStatus.error)
    return
  }
  whyStatus.loaded = true
  whyLib = why
  const ask = async (mcpName, args, cwd) => {
    const a = { ...args }
    for (const k of PATH_ARGS) if (typeof a[k] === 'string') a[k] = resolveAgainst(cwd, a[k])
    return why.mcpCall(mcpName, a)
  }
  if (wantTools) {
    // raw definitions: the MCP tool schemas are already JSON Schema, and a
    // bare import of @deepseek-ai/dsh-tools does not resolve from a linked
    // plugin directory — the registry accepts either form
    for (const t of why.MCP_TOOLS) {
      const name = TOOL_NAMES[t.name] ?? t.name
      try {
        ctx.effect(() => ctx.tools.register({
          name,
          description: t.description,
          parameters: t.inputSchema,
          output: { schema: { type: 'string' }, render: (_args, value) => [{ type: 'text', text: String(value) }] },
          async execute(args, exec) { return ask(t.name, args ?? {}, cwdOfSession(exec?.agent?.session)) },
        }), 'thoughtdag: tool ' + name)
        whyStatus.tools.push(name)
      } catch (error) {
        whyStatus.error = `${name}: ${error instanceof Error ? error.message : String(error)}`
        console.error('[dsh-thoughtdag] tool not registered ' + whyStatus.error)
      }
    }
    ctx.effect(() => ctx.commands.register({
      name: 'why',
      description: 'ThoughtDAG: which past conversations touched this file, URL or paper',
      input: { hint: '<path | url | arxiv:id>' },
      async handler(inv) {
        const q = String(inv.rawInput ?? '').trim()
        if (!q) return { kind: 'error', text: 'usage: /why <path | url | arxiv:id>' }
        try { return { kind: 'success', text: await ask('why_file', { path: q }, cwdOfSession(inv.agent?.session)) } }
        catch (error) { return { kind: 'error', text: error instanceof Error ? error.message : String(error) } }
      },
    }), 'thoughtdag: /why')
    whyStatus.command = true
  }
  if (wantPrompt && wantTools) { ctx.effect(() => ctx.systemPrompt.section({ name: 'thoughtdag-why', order: 900, text: WHY_PROMPT }), 'thoughtdag: why prompt'); whyStatus.prompt = true }
```

</details>

**依据 2 · 源码核查**：[cli/src/lib.ts:14-30](https://github.com/chenxiachan/thoughtdag/blob/5e3318a42540b0cbef089784bbf3007493b0b994/cli/src/lib.ts#L14-L30)

事实、解释与文本索引边界。

<details>
<summary>查看原文（17行）</summary>

```text
// Facts come straight off tool calls in the local session files, never
// from free text or a model. Three stores, three kinds of content:
//   fact-index.json           observed events + verbatim excerpts + pointers
//   interpretation-cache.json heuristics read off the answers (deletable)
//   text-index.jsonl          what was asked, answered and attached, verbatim, one
//                             turn per line — streamed, never parsed whole — for exact
//                             phrase search (deletable, rebuilt on index); text-index.json
//                             is its small manifest (which sources are in it)
// Since 0.4.21 the index also holds what two agents wrote down for
// themselves between sessions — Claude Code's per-project memory directory
// and Codex's memories — as sessions of kind 'memory': a file is a session,
// each entry a turn (its heading asked, its body answered), so find and
// recall answer over them unchanged and a canvas can cite one entry.
// Source files are read, never written. The index is derived and can
// always be rebuilt; a query refreshes it first when a source moved on.

import { promises as fsp, createReadStream, createWriteStream } from 'node:fs';
```

</details>

**依据 3 · 源码核查**：[cli/src/lib.ts:1527-1557](https://github.com/chenxiachan/thoughtdag/blob/5e3318a42540b0cbef089784bbf3007493b0b994/cli/src/lib.ts#L1527-L1557)

工具schema与查询分派，明确candidate explanation。

<details>
<summary>查看原文（31行）</summary>

```text
const MCP_TOOLS = [
  { name: 'why_check', description: 'Cheap first question before editing a file: does this artifact have any history in local agent sessions? One line; history true/false.', inputSchema: { type: 'object', properties: { path: { type: 'string', description: 'file path (absolute or relative to cwd), URL, or arxiv:<id>' } }, required: ['path'] } },
  { name: 'why_file', description: 'The turns across local Claude Code, Codex, DeepSeek Harness, Pi and ThoughtDAG sessions that touched a file, URL or paper: when, what changed (Δ, observed), what was asked, what the answer said about it (≈, a candidate explanation, not a verified reason). Each hit carries a deep link.', inputSchema: { type: 'object', properties: { path: { type: 'string' }, include_read: { type: 'boolean', description: 'also list turns that only read it (default false)' }, limit: { type: 'number', description: 'max hits (default 10)' } }, required: ['path'] } },
  { name: 'find', description: 'Where these exact words were asked (Q), answered (A) or attached (M) across local sessions, canvases and the memories Claude Code and Codex keep for themselves. Exact, case-insensitive match; every hit is a verbatim snippet with a pointer.', inputSchema: { type: 'object', properties: { phrase: { type: 'string' }, in: { type: 'string', enum: ['q', 'a', 'm', 'all'] }, limit: { type: 'number' } }, required: ['phrase'] } },
  { name: 'recall_turn', description: 'One turn in full — the question, the answer, the tool calls with their diffs — by session id (or prefix) and turn number as shown by why_file.', inputSchema: { type: 'object', properties: { session: { type: 'string' }, turn: { type: 'number' } }, required: ['session', 'turn'] } },
];

async function mcpCall(name: string, a: Record<string, unknown>): Promise<string> {
  if (name === 'why_check') {
    const facts = await factsForCheck(false);
    const q = String(a.path ?? '');
    const { path: file } = await resolveQuery(facts, q, false);
    return renderCheck(facts, q, file, file ? hitsFor(facts, file, true).hits : [], false).text;
  }
  if (name === 'why_file') {
    const facts = await ensureFresh();
    const q = String(a.path ?? '');
    const { path: file, candidates, elsewhere } = await resolveQuery(facts, q, false);
    if (!file) return candidates.length ? `${candidates.length} files match "${q}" — pick one:\n${candidates.slice(0, 20).map((c) => `  ${c}`).join('\n')}` : elsewhere ? `no match in this workspace (${elsewhere} elsewhere)` : `no session touched ${q}`;
    const { hits, readsHidden } = hitsFor(facts, file, a.include_read === true);
    return renderWhy(facts, file, hits, readsHidden, await loadCache(), Number(a.limit ?? 10) || 10, false);
  }
  if (name === 'find') {
    const facts = await ensureFresh();
    const scope = (['q', 'a', 'm'] as const).find((x) => x === a.in) ?? 'all';
    return renderFind(facts, String(a.phrase ?? ''), await findHits(facts, String(a.phrase ?? ''), scope), Number(a.limit ?? 10) || 10, false);
  }
  if (name === 'recall_turn') return renderRecall(await ensureFresh(), String(a.session ?? ''), Number(a.turn ?? 0));
  throw new Error(`unknown tool: ${name}`);
}

```

</details>

#### 缺口

- 不同Agent日志解析覆盖与历史索引完备性未逐源审计。
  **影响**：不能把没有命中当作从未修改，也不能把解释候选当确定原因。
  **进一步探讨**：用同一批已知工具写入/只读/续会话/记忆样本对照索引命中及原始定位。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 本地Host围栏与源仓库构建能保证哪些边界？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

API先验Host允许localhost、127.0.0.1与配置trustedHosts，但该检查不是用户认证或逐项目授权；允许的Host下会话桥可读取本机日志及发起宿主动作，是否还有宿主全局访问策略本轮未验证。roots按固定目录和resolve前缀作词法约束，不能据此宣称符号链接也一定不能越界。备份写入要求绝对dir并净化name，但dir来自请求、没有在该函数绑定用户曾批准的目录令牌，调用writeFile可覆盖同名文件。源码checkout中的dsh/dist-app、lib/why.mjs和lib/runtime属于构建产物；入口顶层require runtime/backup-write.cjs，未构建的源码目录不能按现成发布包直接等价加载。build脚本会编译SPA、打包CLI并复制root runtime，prepack调用build；这说明依赖链而非证明实际npm包缺文件。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/lib/index.js:78-87](https://github.com/chenxiachan/thoughtdag/blob/5e3318a42540b0cbef089784bbf3007493b0b994/dsh/lib/index.js#L78-L87)

顶层runtime加载与SPA路径。

<details>
<summary>查看原文（10行）</summary>

```text
export const name = 'thoughtdag'
export const inject = ['webServer', 'sessions', 'sessionController', 'agents', 'llm', 'attachments', 'web', 'tools', 'commands', 'systemPrompt', 'approval']

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const require = createRequire(import.meta.url)
const APP_DIR = resolve(__dirname, '../dist-app')
// the path rules for the canvas's local backup (#66); the route below shells
// this, and it is required HERE because the handler needs it in scope — inside
// agentsHttp() it would be a function-local binding the handler cannot see
const { writeBackup, BackupRequestError } = require(resolve(__dirname, 'runtime', 'backup-write.cjs'))
```

</details>

**依据 2 · 源码核查**：[dsh/lib/index.js:1360-1373](https://github.com/chenxiachan/thoughtdag/blob/5e3318a42540b0cbef089784bbf3007493b0b994/dsh/lib/index.js#L1360-L1373)

Host围栏，不含该处用户身份鉴别。

<details>
<summary>查看原文（14行）</summary>

```text
  const prefix = typeof config?.mountPrefix === 'string' && config.mountPrefix.startsWith('/') && config.mountPrefix.length > 1
    ? config.mountPrefix.replace(/\/+$/, '')
    : '/thoughtdag'
  const trustedHosts = new Set(['localhost', '127.0.0.1', ...[...(config?.trustedHosts ?? [])].map(h => String(h).trim().toLowerCase()).filter(Boolean)])

  // the interfaces the canvas registered (memory only: a restart forgets them, the canvas registers again at boot)
  let registeredProviders = []
  const api = async (req, res) => {
    try {
      const hostname = (typeof req.headers.host === 'string' ? req.headers.host : '').replace(/:\d+$/, '').toLowerCase()
      if (!trustedHosts.has(hostname)) return sendJson(res, 403, { error: 'untrusted Host header' })
      const url = new URL(req.url ?? '/', 'http://dsh.local')
      // full pathname is /<prefix>/api/<rest>; the register prefix strips /api
      const path = url.pathname.slice((prefix + '/api').length)
```

</details>

**依据 3 · 源码核查**：[dsh/lib/index.js:438-454](https://github.com/chenxiachan/thoughtdag/blob/5e3318a42540b0cbef089784bbf3007493b0b994/dsh/lib/index.js#L438-L454)

根目录仅resolve前缀检查。

<details>
<summary>查看原文（17行）</summary>

```text

const FILE_ROOTS = {
  'claude-projects': join(os.homedir(), '.claude', 'projects'),
  'codex-sessions': join(os.homedir(), '.codex', 'sessions'),
  'pi-sessions': join(os.homedir(), '.pi', 'agent', 'sessions'),
}
const FILE_READ_MAX = 256 * 1024 * 1024

/** An absolute path inside a root, or a 400/404 — rel never escapes. */
function fileInRoot(rootKey, rel) {
  const root = FILE_ROOTS[rootKey]
  if (!root) throw new HttpError(404, 'no such root')
  if (typeof rel !== 'string' || !rel) throw new HttpError(400, 'rel required')
  const abs = resolve(root, rel)
  if (abs !== root && !abs.startsWith(root + sep)) throw new HttpError(400, 'rel escapes its root')
  return abs
}
```

</details>

**依据 4 · 源码核查**：[runtime/backup-write.cjs:25-56](https://github.com/chenxiachan/thoughtdag/blob/5e3318a42540b0cbef089784bbf3007493b0b994/runtime/backup-write.cjs#L25-L56)

备份绝对目录与名字约束及实际写入，没有用户目录令牌。

<details>
<summary>查看原文（32行）</summary>

```text
async function writeBackup(body) {
  const dir = typeof body?.dir === 'string' ? body.dir : '';
  const name = typeof body?.name === 'string' ? body.name : '';
  const json = typeof body?.json === 'string' ? body.json : null;
  // an absolute path is the whole safety property: a relative one would resolve
  // against the plugin's cwd, which the canvas cannot know.
  // isAbsolute, NOT resolve(dir).startsWith(sep) — on Windows a drive path
  // starts with "C:" and would never match the separator, so that test refuses
  // every real request there while passing on POSIX.
  if (!dir || !isAbsolute(dir) || !name || json === null) {
    throw new BackupRequestError('dir must be an absolute path; name and json are required');
  }
  // `name` is a RELATIVE path the canvas chose (native canvases at the folder
  // root, session mirrors under cli/), so it is sanitized segment by segment
  const parts = name.replace(/\\/g, '/').split('/').filter((p) => p && p !== '.' && p !== '..');
  if (parts.length === 0) throw new BackupRequestError('name must have at least one path segment');
  const last = parts[parts.length - 1].replace(/[<>:"|?*\u0000-\u001f]/g, '_').slice(0, 120);
  if (!last) throw new BackupRequestError('name resolves to an empty file name');
  const target = resolve(dir, ...parts.slice(0, -1), last);
  // Belt and braces, and it has to agree with the gate above: compare against
  // resolve(dir) — NOT resolve(dir) + sep, which would reject a Windows path
  // for the same reason the startsWith(sep) test did.
  const inside = resolve(dir);
  if (target !== inside && !target.startsWith(inside.endsWith(sep) ? inside : inside + sep)) {
    throw new BackupRequestError('name escapes the backup directory');
  }
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, json, 'utf8');
  return target;
}

module.exports = { writeBackup, BackupRequestError };
```

</details>

**依据 5 · 源码核查**：[dsh/scripts/build.mjs:50-68](https://github.com/chenxiachan/thoughtdag/blob/5e3318a42540b0cbef089784bbf3007493b0b994/dsh/scripts/build.mjs#L50-L68)

CLI打包和runtime复制，属构建必需。

<details>
<summary>查看原文（19行）</summary>

```text
const whyOut = resolve(__dirname, '../lib/why.mjs')
await createRequire(resolve(repo, 'package.json'))('esbuild').build({
  entryPoints: [resolve(repo, 'cli/src/lib.ts')],
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node22',
  define: { 'import.meta.env': '{}' },
  outfile: whyOut,
  logLevel: 'warning',
})
console.log('why layer written to', whyOut)

// The shared agent runtime (plain Node): the host serves it over HTTP so the
// canvas inside the harness runs agents exactly as the desktop shell does
const runtimeOut = resolve(__dirname, '../lib/runtime')
rmSync(runtimeOut, { recursive: true, force: true })
cpSync(resolve(repo, 'runtime'), runtimeOut, { recursive: true })
console.log('agent runtime written to', runtimeOut)
```

</details>

#### 缺口

- 宿主全局认证、原生目录选择到POST请求的授权绑定及发布包内容未验收。
  **影响**：无法确认共享/远程暴露下会话与文件范围，也不能把源码缺生成物判为npm故障。
  **进一步探讨**：先固定宿主访问策略，在隔离环境检查pack文件清单、拒绝越权目录及符号链接边界。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 从导入到继续和退出，要承担哪些模型、索引与恢复成本？

**研究主题**：效果与总成本、采用判断

#### 完整回答

首次需匹配Node/DSH及十余宿主服务，npm包应带生成SPA、why库和runtime；源码方式另外构建父项目。用户还要判断哪些本机历史允许进入画布及索引。持续成本包含日志扫描/解压、浏览器画布、~/.thoughtdag派生索引、模型摘要与继续执行，原生llm代理调用未必进入会话日志，完整费用不能只按镜像会话计。fork保留会话前缀不等于代码工作区同时回滚，inject改变下一步上下文也不是撤销原工具副作用；失败后应核对是否已有prompt被接收，不盲重投。当前推荐观察，先核清访问范围、构建产物和可丢弃会话的完整联接，再选择只读导入；金额、总人工时间和后续任务质量未知，不凭图形化便利升级常用。

#### 证据与依据

**依据 1 · 作者声明**：[dsh/README.md:34-53](https://github.com/chenxiachan/thoughtdag/blob/5e3318a42540b0cbef089784bbf3007493b0b994/dsh/README.md#L34-L53)

模型代理、真实agent和日志归属由作者说明，不能当费用全量。

<details>
<summary>查看原文（20行）</summary>

```text
  | Endpoint | Purpose |
  |---|---|
  | `GET /thoughtdag/api/disksessions` | list durable sessions on disk (id, title, cwd from the session header; newest first) |
  | `GET /thoughtdag/api/disksessions/<id>/log` | one disk session as JSONL — the exact dialect ThoughtDAG's `dsh-session` adapter parses, so a past harness session imports like a local file |
  | `GET /thoughtdag/api/sessions` | list live sessions in this process |
  | `GET /thoughtdag/api/sessions/<id>/log` | one live session's events as JSONL |
  | `GET /thoughtdag/api/sessions/<id>/turns` | turn boundaries (start/end seq, the person's message id) of a live or on-disk session — the fork points a canvas can name |
  | `POST /thoughtdag/api/sessions/<id>/fork` | `{ afterTurn }` or `{ atSeq }` → a child session inheriting the prefix through that completed turn (`sessionController.fork`, so the chat UI lists it) |
  | `POST /thoughtdag/api/sessions/<id>/inject` | `{ text }` or `{ blocks: [{type:'text',text}] }` → model-facing context for the next step (`agent.inject`; no wake; shown in the transcript as injected context from `dsh-thoughtdag`) |
  | `POST /thoughtdag/api/sessions/<id>/followup` | `{ text | blocks, mode?: 'queue' | 'steer' }` → a user prompt through `sessionController.prompt`, exactly as the composer sends one |
  | `GET /thoughtdag/api/roots` · `GET /thoughtdag/api/roots/<key>/list\|head\|read\|range` | the other agents' session directories on this machine (`claude-projects` = `~/.claude/projects`, `codex-sessions` = `~/.codex/sessions`) with the desktop bridge's file primitives, so Session Atlas inside the harness lists all three sources and mirrors a Claude Code or Codex session as the desktop does; `rel` never escapes its root |
  | `GET /thoughtdag/api/models` | the harness's model catalog in the SPA's list shape (`<provider>/<model>` ids, the harness default) |
  | `POST /thoughtdag/api/stream` · `POST /thoughtdag/api/claude` | the SPA's own proxy protocol, answered on the harness's providers and credentials (`ctx.llm.stream`); the embedded SPA is built with `VITE_API_BASE=/thoughtdag`, so its model picker and every canvas-native generation (summaries, condensing, a canvas that is not a mirrored session) run on the harness's models. These calls do not enter a session log; a mirrored session's turns go through `/followup` |
  | `harness/agent` (a catalog entry) | pick it in the picker and the question goes INTO the harness: a fresh session per call, the canvas's wired context injected first (`agent.inject`, source `dsh-thoughtdag`), the question as a user follow-up, the harness's own agent loop with tools; text, reasoning and tool calls stream back as the SPA's frames, the first frame names the session (`{ harnessSession }`) and, once the question enters the surface, the turn it created (`{ harnessTurn: { turn, userMessageId, seq } }`), so the canvas can mark its node as that turn's mirror instead of receiving it twice. The session stays in the Chat and the atlas. `harness: { cwd }` sets the session's working directory (the canvas passes the project it mirrors, else the current chat session's); `harness: { session }` continues a mirrored session instead of forking a fresh one (a tail follow-up); `images` (base64) are admitted through the controller's prompt and a vision model is selected for that turn, so a picture the canvas holds is read by the harness's own eyes |
  | `POST /thoughtdag/api/fetch-url` | the SPA's link snapshot (`{ url }` → `{ title, text, fetchedAt, html? }`) through the harness's bounded, credential-free fetcher (`ctx.web.fetch`) |

  Disk logs are zstd *concatenated-frame* files; the bridge locates frame
  boundaries structurally and decodes each with `node:zlib` (the same walk the
  DSH persistence backend performs), so no external zstd binary or native
  module is needed.
```

</details>

**依据 2 · 源码核查**：[dsh/package.json:27-35](https://github.com/chenxiachan/thoughtdag/blob/5e3318a42540b0cbef089784bbf3007493b0b994/dsh/package.json#L27-L35)

lib/dist-app随包、prepack构建。

```text
    "cordis.patch.yml",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "build": "node scripts/build.mjs ..",
    "prepack": "npm run build",
    "verify": "node scripts/verify-write-bridge.mjs"
  },
```

**依据 3 · 源码核查**：[dsh/lib/index.js:1653-1695](https://github.com/chenxiachan/thoughtdag/blob/5e3318a42540b0cbef089784bbf3007493b0b994/dsh/lib/index.js#L1653-L1695)

fork与提示改变会话，不负责代码文件回滚。

<details>
<summary>查看原文（43行）</summary>

```text
      const write = /^\/sessions\/([^/]+)\/(fork|inject|followup)$/.exec(path)
      if (write !== null && req.method === 'POST') {
        const id = decodeURIComponent(write[1])
        const body = await readJson(req, MAX_WRITE_BODY_BYTES)
        if (write[2] === 'fork') {
          // the boundary: an explicit seq, or the end of a named turn
          let atSeq = typeof body?.atSeq === 'number' ? body.atSeq : undefined
          if (typeof body?.afterTurn === 'number') {
            const events = await eventsOfSession(ctx, id)
            if (events === null) return sendJson(res, 404, { error: 'no such session' })
            const t = turnsOf(events).find(x => x.turn === body.afterTurn)
            if (!t) return sendJson(res, 400, { error: 'no such turn: ' + body.afterTurn })
            if (t.endSeq === null) return sendJson(res, 409, { error: 'turn ' + body.afterTurn + ' is still open; a fork needs a completed turn' })
            atSeq = t.endSeq
          }
          try {
            const r = await ctx.sessionController.fork({ sessionId: id, ...(atSeq !== undefined ? { atSeq } : {}) })
            return sendJson(res, 200, { session: r.sessionId, parent: id, atSeq: atSeq ?? null })
          } catch (error) {
            const code = error?.code ?? error?.name ?? 'fork failed'
            return sendJson(res, /NOT_FOUND/.test(String(code)) ? 404 : 409, { error: String(error?.message ?? code), code })
          }
        }
        const content = contentOf(body)
        if (write[2] === 'inject') {
          const agent = await agentOf(ctx, id)
          const message = { id: 'td-' + randomUUID(), role: 'user', content, source: SOURCE }
          agent.inject(message)
          return sendJson(res, 200, { accepted: true, session: id, messageId: message.id })
        }
        // followup: a person's prompt from the canvas — the controller owns
        // the user source and the queue/steer semantics the UI uses
        const requestId = 'td-' + randomUUID()
        const mode = body?.mode === 'steer' ? 'steer' : 'queue'
        await ctx.sessionController.prompt({ requestId, sessionId: id, mode, content }, AbortSignal.timeout(30000))
        return sendJson(res, 200, { accepted: true, session: id, requestId, mode })
      }
      return sendJson(res, 404, { error: 'not found' })
    } catch (error) {
      if (error instanceof HttpError) return sendJson(res, error.status, { error: error.message })
      ctx.logger.error(error instanceof Error ? error : new Error(String(error)))
      // the bridge only answers trusted local hosts, so the message may travel
      return sendJson(res, 500, { error: 'bridge unavailable', detail: error instanceof Error ? error.message : String(error) })
```

</details>

#### 缺口

- 缺当前发布包/宿主运行、只读到续问的重复任务效果和完整费用记录。
  **影响**：不能确认采用负担、上下文质量或token收益。
  **进一步探讨**：以隔离测试会话比较纯日志搜索、画布只读和写回，记录双方模型调用、人工核对与恢复。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 能否为画布写回建立引用绑定与可审阅授权？

**研究主题**：新假设与验证

#### 完整回答

未验证方向是把选中节点编译成绑定会话ID、输入末序号、来源轮次和目标工作区的候选上下文，先预览差异与本轮工具权限，再提交一次稳定requestId；把只读历史浏览与能唤醒代理/写备份分别授权。推导来自当前Host范围、临时生成requestId和图/会话双表示的交接缺口，而不是认为已有fork即保证安全。最小验证用故意过期节点、断线、重复提交和同名备份案例，比较重复执行、错会话注入及用户确认时间；如果绑定仍无法识别副作用或确认负担大于手工复制上下文，则否定。该方案不计入当前贡献，也不宣称无需进一步用户需求验证。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/lib/index.js:1653-1695](https://github.com/chenxiachan/thoughtdag/blob/5e3318a42540b0cbef089784bbf3007493b0b994/dsh/lib/index.js#L1653-L1695)

写回参数与每次随机requestId形成候选绑定的推导。

<details>
<summary>查看原文（43行）</summary>

```text
      const write = /^\/sessions\/([^/]+)\/(fork|inject|followup)$/.exec(path)
      if (write !== null && req.method === 'POST') {
        const id = decodeURIComponent(write[1])
        const body = await readJson(req, MAX_WRITE_BODY_BYTES)
        if (write[2] === 'fork') {
          // the boundary: an explicit seq, or the end of a named turn
          let atSeq = typeof body?.atSeq === 'number' ? body.atSeq : undefined
          if (typeof body?.afterTurn === 'number') {
            const events = await eventsOfSession(ctx, id)
            if (events === null) return sendJson(res, 404, { error: 'no such session' })
            const t = turnsOf(events).find(x => x.turn === body.afterTurn)
            if (!t) return sendJson(res, 400, { error: 'no such turn: ' + body.afterTurn })
            if (t.endSeq === null) return sendJson(res, 409, { error: 'turn ' + body.afterTurn + ' is still open; a fork needs a completed turn' })
            atSeq = t.endSeq
          }
          try {
            const r = await ctx.sessionController.fork({ sessionId: id, ...(atSeq !== undefined ? { atSeq } : {}) })
            return sendJson(res, 200, { session: r.sessionId, parent: id, atSeq: atSeq ?? null })
          } catch (error) {
            const code = error?.code ?? error?.name ?? 'fork failed'
            return sendJson(res, /NOT_FOUND/.test(String(code)) ? 404 : 409, { error: String(error?.message ?? code), code })
          }
        }
        const content = contentOf(body)
        if (write[2] === 'inject') {
          const agent = await agentOf(ctx, id)
          const message = { id: 'td-' + randomUUID(), role: 'user', content, source: SOURCE }
          agent.inject(message)
          return sendJson(res, 200, { accepted: true, session: id, messageId: message.id })
        }
        // followup: a person's prompt from the canvas — the controller owns
        // the user source and the queue/steer semantics the UI uses
        const requestId = 'td-' + randomUUID()
        const mode = body?.mode === 'steer' ? 'steer' : 'queue'
        await ctx.sessionController.prompt({ requestId, sessionId: id, mode, content }, AbortSignal.timeout(30000))
        return sendJson(res, 200, { accepted: true, session: id, requestId, mode })
      }
      return sendJson(res, 404, { error: 'not found' })
    } catch (error) {
      if (error instanceof HttpError) return sendJson(res, error.status, { error: error.message })
      ctx.logger.error(error instanceof Error ? error : new Error(String(error)))
      // the bridge only answers trusted local hosts, so the message may travel
      return sendJson(res, 500, { error: 'bridge unavailable', detail: error instanceof Error ? error.message : String(error) })
```

</details>

**依据 2 · 源码核查**：[runtime/backup-write.cjs:25-56](https://github.com/chenxiachan/thoughtdag/blob/5e3318a42540b0cbef089784bbf3007493b0b994/runtime/backup-write.cjs#L25-L56)

授权目录需独立于字符串净化。

<details>
<summary>查看原文（32行）</summary>

```text
async function writeBackup(body) {
  const dir = typeof body?.dir === 'string' ? body.dir : '';
  const name = typeof body?.name === 'string' ? body.name : '';
  const json = typeof body?.json === 'string' ? body.json : null;
  // an absolute path is the whole safety property: a relative one would resolve
  // against the plugin's cwd, which the canvas cannot know.
  // isAbsolute, NOT resolve(dir).startsWith(sep) — on Windows a drive path
  // starts with "C:" and would never match the separator, so that test refuses
  // every real request there while passing on POSIX.
  if (!dir || !isAbsolute(dir) || !name || json === null) {
    throw new BackupRequestError('dir must be an absolute path; name and json are required');
  }
  // `name` is a RELATIVE path the canvas chose (native canvases at the folder
  // root, session mirrors under cli/), so it is sanitized segment by segment
  const parts = name.replace(/\\/g, '/').split('/').filter((p) => p && p !== '.' && p !== '..');
  if (parts.length === 0) throw new BackupRequestError('name must have at least one path segment');
  const last = parts[parts.length - 1].replace(/[<>:"|?*\u0000-\u001f]/g, '_').slice(0, 120);
  if (!last) throw new BackupRequestError('name resolves to an empty file name');
  const target = resolve(dir, ...parts.slice(0, -1), last);
  // Belt and braces, and it has to agree with the gate above: compare against
  // resolve(dir) — NOT resolve(dir) + sep, which would reject a Windows path
  // for the same reason the startsWith(sep) test did.
  const inside = resolve(dir);
  if (target !== inside && !target.startsWith(inside.endsWith(sep) ? inside : inside + sep)) {
    throw new BackupRequestError('name escapes the backup directory');
  }
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, json, 'utf8');
  return target;
}

module.exports = { writeBackup, BackupRequestError };
```

</details>

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
