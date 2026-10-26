# dsh-teaching-board

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[1bbafc2](https://github.com/ArcaneOrion/dsh-teaching-board/tree/1bbafc235fc8113cf5a1c3b190f009057c1964c7)

<!-- BEGIN META -->
[![npm 30d 1,341](https://img.shields.io/static/v1?label=npm+30d&message=1%2C341&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@arcaneorion/dsh-teaching-board) [![最新发布 2026-09-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-29&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@arcaneorion/dsh-teaching-board)
<!-- END META -->

> **实现功能**：在 DSH 会话中展示 HTML 板书，支持圈画、方向选择及把截图作为图片消息回传。

> **核心亮点**：相对生成独立 HTML 后手工截图粘贴，插件把板书增量更新、笔迹和反馈附件串进会话流程，并把使用纪律与能力同包发布。关键增量是教学反馈交接，沙箱、HTML 渲染、会话附件都来自浏览器和宿主；host 工具只返回请求元数据，真正像素必须由挂载的浏览器回传。[Q01](#research-q01)

> **风险与缺陷**：被当作真实用户消息的反馈是否具有可信来源决定闭环边界。onMessage 只检查数据标记，未校验 event.source 对应当前 iframe，也未绑定截图 requestId；带 localweb 标记的文本可走 setDraft/submit。iframe 的 allow-scripts 限制同源访问，但源码未见 CSP 网络禁令，不能据此承诺无外网。这些是源码可见的边界缺口，尚未运行攻击或证明宿主外层没有额外防护。[Q02](#research-q02)

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
  - [Q01 · 板书和用户反馈如何往返，贡献归属是什么？](#detail-section-11)
  - [Q02 · 沙箱和 postMessage 是否提供声明的隔离？](#detail-section-12)
  - [Q03 · 使用闭环依赖什么，成本及试用边界如何？](#detail-section-13)
  - [Q04 · 绑定来源并显式确认的消息协议是否更可信？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要交互讲解的学习者与讲授者，把模型生成的 HTML 板书放在会话页签，并通过圈画截图表达疑问。

简单替代是生成独立 HTML、浏览器讲解、手动截图上传。它多一次交接但输入确认清楚；本插件把这些操作嵌入会话，未证明所有教学任务都值得额外 HTML 和图片 token。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| stage_panel | 开板、追加和区域替换或删除 | 同 board 演进，接受参数不证明浏览器完成 |
| stage_status | 显示教学阶段和上下文 | 由会话调用投影 |
| stage_choice | 发布方向选项 | 点击会走真实用户输入通道 |
| stage_snapshot | 请求带笔迹的截图 | 必须挂载页签，图片在后续消息到达 |
| 圈画与截图 | 标记视觉疑问并回传 | 笔迹客户端私有，截图只覆盖视口 |
| stage-panel Skill | 提供行为纪律和模板资源 | provider 和包资源可读取才完整 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH tools、conversation/chat 插槽与 React | 启动必需 | 注册工具和视图、读会话快照 | 契约不符不能完成投影 |
| 挂载的教学平面 iframe | 截图必需 | 执行绘图和捕获 | 切走页签时无法拍到当前板面 |
| conversation 与 inputActions | 回传必需 | 创建图片附件及提交 | 仅提示失败或保留草稿，需人工操作 |
| self-contained HTML | 完整视觉条件 | 避免外部资源和截图缺项 | 规范不等于运行期强制网络禁止 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户核对 web profile 和接口 | 原生会话与附件可用 |
| 开板 | 模型读取 Skill 并调用 stage_panel | 实际浏览器出现正确板书 |
| 反馈 | 用户圈画、点方向或请求截图 | 附件在正确草稿且内容可复核 |
| 验收 | 用户确认发送并检查下一轮图片 | 模型收到图片后再分析，失败手动上传 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 已有宿主、模型及浏览器，费用未知 | 安装、核对接口、生成首屏，时长未知 | 非 web 环境不具该视图 |
| 持续使用 | HTML 输出 token、截图模型输入、浏览器渲染 | 教师检查板面与学习者操作 | 增量可少发重复 HTML，净节省未测 |
| 失败恢复 | 重建视图与附件重试资源未知 | 切回页签、确认草稿、重拍 | 笔迹是各客户端私有，不能假设跨端恢复 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 板面连续演进 | 同 board 操作折叠并增量投影 | 动态脚本与重挂载的一致性 |
| 视觉反馈 | 图片创建附件并提交会话 | 来源可信性及真实回传成功率 |
| 教学效果 | 有圈画与方向选择入口 | 理解、留存或端到端时间无对照 |

> **思考**：被当作真实用户消息的反馈是否具有可信来源决定闭环边界。onMessage 只检查数据标记，未校验 event.source 对应当前 iframe，也未绑定截图 requestId；带 localweb 标记的文本可走 setDraft/submit。iframe 的 allow-scripts 限制同源访问，但源码未见 CSP 网络禁令，不能据此承诺无外网。这些是源码可见的边界缺口，尚未运行攻击或证明宿主外层没有额外防护。[Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对生成独立 HTML 后手工截图粘贴，插件把板书增量更新、笔迹和反馈附件串进会话流程，并把使用纪律与能力同包发布。关键增量是教学反馈交接，沙箱、HTML 渲染、会话附件都来自浏览器和宿主；host 工具只返回请求元数据，真正像素必须由挂载的浏览器回传。[Q01](#research-q01)

相对生成独立 HTML 后手工截图粘贴，插件把板书增量更新、笔迹和反馈附件串进会话流程，并把使用纪律与能力同包发布。关键增量是教学反馈交接，沙箱、HTML 渲染、会话附件都来自浏览器和宿主；host 工具只返回请求元数据，真正像素必须由挂载的浏览器回传。[Q01](#research-q01)

会话调用可重建板书、Skill 随插件发布是可借鉴的单一事实源设计；笔迹与滚动则明确另存客户端，不能把无私有状态推广至全部交互。host 返回 rendered:true 只是接受参数，缺少浏览器完成回执。postMessage 边界和输入权限应成为复用前的首要改造。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

被当作真实用户消息的反馈是否具有可信来源决定闭环边界。onMessage 只检查数据标记，未校验 event.source 对应当前 iframe，也未绑定截图 requestId；带 localweb 标记的文本可走 setDraft/submit。iframe 的 allow-scripts 限制同源访问，但源码未见 CSP 网络禁令，不能据此承诺无外网。这些是源码可见的边界缺口，尚未运行攻击或证明宿主外层没有额外防护。[Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察并补齐消息来源和提交确认，再以非敏感课程在隔离 profile 检查四工具、增量更新和截图反馈；成功需图片进入正确会话且不覆盖用户草稿。页面未挂载、截图失败或输入不一致时停止，回到手动截图上传。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

板书投影与截图输入链路有源码支持；截图请求不等于完成，跨消息来源检查和联网限制不足以支持强隔离声明，学习效果未验证。新协议假设未实现。

- 已检查：作者 README、包清单、源码路径 src/index.js、src/client.js、src/skills.js、skills/stage-panel/SKILL.md、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 host 四工具、Skill provider、客户端板面折叠、iframe 属性和回传处理；绘图和截图 runtime 未完整逐行审计，未执行浏览器或宿主。
- 下一步：验证多 iframe 伪造消息、过期截图、非空草稿、页签卸载、增量脚本和第二浏览器笔迹边界；再用相同课程对照手动截图方案的理解正确率、人工时间及模型预算。本轮未执行。

**分析版本**

- **仓库**：[ArcaneOrion/dsh-teaching-board](https://github.com/ArcaneOrion/dsh-teaching-board)
- **版本号**：0.6.0（[固定提交 1bbafc2](https://github.com/ArcaneOrion/dsh-teaching-board/tree/1bbafc235fc8113cf5a1c3b190f009057c1964c7)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

由截图请求与用户输入权限之间的缺口，可提出未验证协议：父层只接收当前 iframe 的消息，为每次截图绑定一次性 requestId，反馈先进入可确认草稿；另对 self-contained 板面施加明确 CSP。用其他 iframe 伪造 capture/panel_input、过期请求和带外链 HTML 对照，要求全部拒绝且合法反馈保留。若破坏正常附件回传或仍允许未授权提交，则方案不成立。[Q04](#research-q04)

验证多 iframe 伪造消息、过期截图、非空草稿、页签卸载、增量脚本和第二浏览器笔迹边界；再用相同课程对照手动截图方案的理解正确率、人工时间及模型预算。本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 5 | 1356 | 1115 | 181 | — |
| .md | source | 11 | 611 | — | — | 7940 |
| .mjs | test | 1 | 37 | 25 | 12 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-24），可前往 [GitHub Issues](https://github.com/ArcaneOrion/dsh-teaching-board/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：会话板书和视觉反馈如何构成教学闭环，沙箱与消息边界是否支撑采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 板书和用户反馈如何往返，贡献归属是什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

host 的 stage_panel 接受 HTML 与 board/op 参数，客户端从同 board 的调用折叠成文档，open 重建基准而 append/set/remove 更新局部。浏览器内部绘图截图后，父层把 data URL 转成文件并创建草稿附件；自动请求在输入空闲时尝试提交，图片进入下一轮会话。相对独立 HTML 加手工贴图，增量在反馈交接和连续板书。工具结果的 rendered:true 或 requested:true 只表明 host 接受，并非浏览器画面或图片已经完成；用户需要在实际视图验收，模型不能把请求当看到图片。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:52-76](https://github.com/ArcaneOrion/dsh-teaching-board/blob/1bbafc235fc8113cf5a1c3b190f009057c1964c7/src/index.js#L52-L76)

工具返回元数据，没有浏览器完成回执。

<details>
<summary>查看原文（25行）</summary>

```text
      title: { type: 'string', description: '板面标题（显示在状态条）' },
    },
    output: { schema: { type: 'string' }, render: textRender },
    execute: async (args) => {
      const op = typeof args.op === 'string' && args.op !== '' ? args.op : 'append'
      const board = typeof args.board === 'string' && args.board !== '' ? args.board : null
      const region = typeof args.region === 'string' && args.region !== '' ? args.region : null
      const html = typeof args.html === 'string' ? args.html : null
      if (html === null && op !== 'remove') {
        return JSON.stringify({ ok: false, error: `op=${op} 需要 html` })
      }
      if ((op === 'set' || op === 'remove') && region === null) {
        return JSON.stringify({ ok: false, error: `op=${op} 需要 region` })
      }
      return JSON.stringify({
        ok: true,
        rendered: true,
        board: board === null ? '(一次性板面)' : board,
        op,
        region,
        title: typeof args.title === 'string' ? args.title : null,
        note: board === null
          ? '未给 board：一次性整块替换，学生笔迹会被清掉。同一主题的演进请带上 board id。'
          : '请结束本轮回复；教学平面按这个 op 更新，学生笔迹保留。',
      })
```

</details>

**依据 2 · 源码核查**：[src/client.js:526-564](https://github.com/ArcaneOrion/dsh-teaching-board/blob/1bbafc235fc8113cf5a1c3b190f009057c1964c7/src/client.js#L526-L564)

board 操作折叠提供会话投影机制。

<details>
<summary>查看原文（39行）</summary>

```text
    function composeBoard(calls) {
      if (!Array.isArray(calls) || calls.length === 0) return null
      const last = calls[calls.length - 1]
      const boardId = typeof last.board === 'string' && last.board !== '' ? last.board : null
      const list = boardId === null
        ? [last]
        : calls.filter((c) => typeof c.board === 'string' && c.board === boardId)
      if (list.length === 0) return null

      let base = null          // 开板那次的文档（或第一条调用）
      const ops = []           // 基准之后的增量：可以原地打进活着的 iframe，不必重载
      let title = null
      let openCount = 0
      for (const call of list) {
        const op = typeof call.op === 'string' && call.op !== '' ? call.op : (base === null ? 'open' : 'append')
        const frag = typeof call.html === 'string' ? call.html : null
        const region = typeof call.region === 'string' && call.region !== '' ? call.region : null
        if (typeof call.title === 'string' && call.title !== '') title = call.title
        if (op === 'open') {
          if (frag !== null) {
            base = frag
            ops.length = 0
            openCount += 1
          }
          continue
        }
        if (base === null) {
          base = frag === null ? '' : frag
          continue
        }
        ops.push({ op, region, html: frag })
      }
      if (base === null) return null

      const baseHtml = ensureDocument(base)
      let html = baseHtml
      for (const op of ops) html = applyOp(html, op)
      return {
        board: boardId,
```

</details>

**依据 3 · 源码核查**：[src/client.js:698-746](https://github.com/ArcaneOrion/dsh-teaching-board/blob/1bbafc235fc8113cf5a1c3b190f009057c1964c7/src/client.js#L698-L746)

截图创建附件并尝试提交，和工具结果是异步分离的链。

<details>
<summary>查看原文（49行）</summary>

```text
        /** 截图 → 草稿图片；auto=true 时再替用户提交（agent 主动请求的路径）。 */
        const deliver = (dataUrl, auto, note) => {
          const conversation = ctx.get('conversation')
          if (!conversation || typeof conversation.createDraftImages !== 'function') {
            flash('截图成功，但 conversation 服务不可用，无法放入输入框')
            return
          }
          if (!inputActions || typeof inputActions.addAttachments !== 'function') {
            flash('截图成功，但输入框不可用，无法放入草稿')
            return
          }
          let ids
          try {
            const file = dataUrlToFile(dataUrl, `stage-panel-${Date.now()}.png`)
            const created = conversation.createDraftImages([file])
            ids = (created || []).map((a) => a.id)
          } catch (error) {
            flash('截图已生成，但附件创建失败：' + (error && error.message ? error.message : error))
            return
          }
          if (ids.length === 0) {
            flash('截图已生成，但附件创建失败')
            return
          }
          // 提交阶段可能短暂拒绝（admission/claim 中），退避重试几次再放弃。
          const attempt = (left) => {
            let accepted = false
            try { accepted = inputActions.addAttachments(ids) } catch { accepted = false }
            if (accepted) {
              if (auto) {
                if (!idleRef.current) {
                  // 用户正在写东西：只放入口，不替他按回车。
                  flash('agent 请求了这个板面的截图：已放入输入框（你正在输入，没有自动发送）')
                  return
                }
                try {
                  if (note) inputActions.setDraft(note)
                  inputActions.submit()
                  flash('已把面板截图发回会话')
                } catch {
                  flash('截图已放入输入框，但自动发送失败，请手动回车')
                }
              } else {
                flash('截图已放入输入框 —— 补充一句说明后回车发送')
              }
              return
            }
            if (left <= 1) {
              flash('截图已生成，但输入框当前拒绝图片（可能在忙或超限）')
```

</details>

#### 缺口

- 真实附件回传成功率和教学理解改善未知。
  **影响**：无法把流程集成等同于教学收益。
  **进一步探讨**：用同一课程记录反馈办结率、理解测验及人工交接时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 沙箱和 postMessage 是否提供声明的隔离？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

iframe 只给 allow-scripts，缺 allow-same-origin，能限制同源 DOM 访问；但这不是网络禁止，生成壳与 runtime 注入未见 CSP 网络策略。父层 onMessage 按 __stagePanel 或 localweb 字段处理，没有验证 event.source 对应当前 iframe。capture 消息可进入图片交付，panel_input 走 setDraft/submit；因此数据标记不是可信来源认证。没有运行外来 iframe 复现，也未核查宿主外层 CSP，结论是插件本身不能独立支撑强隔离声明。复用时应绑定来源、请求和输入确认，避免把模型页面消息无条件升级为人类输入。

#### 证据与依据

**依据 1 · 源码核查**：[src/client.js:751-804](https://github.com/ArcaneOrion/dsh-teaching-board/blob/1bbafc235fc8113cf5a1c3b190f009057c1964c7/src/client.js#L751-L804)

消息处理只看数据标记，未见来源窗口检查。

<details>
<summary>查看原文（54行）</summary>

```text
          attempt(5)
        }

        useEffect(() => {
          const onMessage = (event) => {
            const d = event.data
            if (!d) return
            if (d.__stagePanel === true) {
              if (d.type === 'capture') {
                if (d.ok === true && typeof d.dataUrl === 'string') {
                  deliver(d.dataUrl, d.auto === true, d.note || '')
                } else {
                  flash('截图失败：' + (d.error || '未知原因'))
                }
              } else if (d.type === 'ink') {
                if (awaitingReadyRef.current) return   // 初始空笔迹：丢掉，等 ready 还笔迹
                setStrokes(Number(d.strokes) || 0)
                const id = boardIdRef.current
                if (id && Array.isArray(d.data)) {
                  const rec = boardsRef.current.get(id) || { strokes: [], scrollY: 0 }
                  rec.strokes = d.data
                  boardsRef.current.set(id, rec)
                }
              } else if (d.type === 'scroll') {
                const id = boardIdRef.current
                if (id) {
                  const rec = boardsRef.current.get(id) || { strokes: [], scrollY: 0 }
                  rec.scrollY = Number(d.y) || 0
                  boardsRef.current.set(id, rec)
                }
              } else if (d.type === 'ready') {
                awaitingReadyRef.current = false
                // iframe 刚载入：把当前工具状态推回去（用 ref 避免闭包过期），
                // 补上装载之后才到的增量，再把这块板之前存下的笔迹与滚动位置还回去。
                const t = toolRef.current
                post({ cmd: 'mode', value: t.mode })
                post({ cmd: 'color', value: t.color })
                post({ cmd: 'size', value: t.size })
                const all = opsRef.current || []
                const tail = all.slice(appliedRef.current)
                appliedRef.current = all.length
                if (tail.length > 0) post({ cmd: 'patch', ops: tail })
                const id = boardIdRef.current
                const rec = id ? boardsRef.current.get(id) : null
                post({ cmd: 'load', strokes: (rec && rec.strokes) || [], scrollY: (rec && rec.scrollY) || 0 })
              }
              return
            }
            if (d.localweb === true && d.type === 'panel_input' && typeof d.text === 'string') {
              send(d.text)
            }
          }
          window.addEventListener('message', onMessage)
          return () => window.removeEventListener('message', onMessage)
```

</details>

**依据 2 · 源码核查**：[src/client.js:675-683](https://github.com/ArcaneOrion/dsh-teaching-board/blob/1bbafc235fc8113cf5a1c3b190f009057c1964c7/src/client.js#L675-L683)

文本反馈直接设置草稿并提交，涉及用户输入权限。

```text
        const send = (text) => {
          try {
            if (inputActions) {
              inputActions.setDraft(text)
              inputActions.submit()
            }
          } catch {
            /* 提交失败仅静默，不阻塞视图 */
          }
```

**依据 3 · 源码核查**：[src/client.js:895-904](https://github.com/ArcaneOrion/dsh-teaching-board/blob/1bbafc235fc8113cf5a1c3b190f009057c1964c7/src/client.js#L895-L904)

sandbox 配置没有同源许可，但不能据此推出网络禁止。

<details>
<summary>查看原文（10行）</summary>

```text
          createElement('div', { className: 'stgp-body' },
            srcDoc !== null
              ? createElement('iframe', {
                  ref: frameRef,
                  className: 'stgp-frame',
                  sandbox: 'allow-scripts',
                  title: boardTitle,
                  srcDoc,
                })
              : createElement('div', { className: 'stgp-empty' }, '暂无板书 —— 让 agent 调用 stage_panel 渲染一个'),
```

</details>

#### 缺口

- 宿主外层网络策略与可达的其他消息源未核查。
  **影响**：不能量化攻击条件或断言所有宿主均可被利用。
  **进一步探讨**：在明确宿主版本的隔离环境验证外来 iframe 和网络请求。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 使用闭环依赖什么，成本及试用边界如何？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

host 依赖工具服务，bundled Skill 通过 provider 提供资源；客户端需要 conversation.view、chat 快照、React 和附件输入服务。板书必须实际挂载才能截图，笔迹保存在各浏览器内，跨客户端不会自动同步。首次成本是接口核对与生成首屏，持续成本为 HTML/截图 token、渲染和人工讲解；失败需切回页签、重拍或手工上传，没有金额或总时长数据。当前采用应先观察消息和草稿边界，修复后在非敏感课程试用，以正确会话收到可读截图且不覆盖草稿为验收。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:23-31](https://github.com/ArcaneOrion/dsh-teaching-board/blob/1bbafc235fc8113cf5a1c3b190f009057c1964c7/src/index.js#L23-L31)

host 工具与可选 Skill provider 的依赖关系明确。

```text
export const name = 'teaching-board'
export const inject = ['tools']

export function apply(ctx) {
  // 行为层：把自带的使用手册发布进技能目录。这里用可选读取而不是 inject——
  // 技能注册是增益，不该让白板因为缺 skills 服务而整个不挂载。
  // dsh 0.2 起 registerProvider 接受工厂 `(control) => provider`；0.1 传的是 provider 本身。
  const skills = ctx.get('skills')
  if (skills !== undefined) skills.registerProvider(() => createSkillProvider())
```

**依据 2 · 源码核查**：[src/client.js:698-718](https://github.com/ArcaneOrion/dsh-teaching-board/blob/1bbafc235fc8113cf5a1c3b190f009057c1964c7/src/client.js#L698-L718)

附件服务缺失会中断交付，不能仅以工具注册判断可用。

<details>
<summary>查看原文（21行）</summary>

```text
        /** 截图 → 草稿图片；auto=true 时再替用户提交（agent 主动请求的路径）。 */
        const deliver = (dataUrl, auto, note) => {
          const conversation = ctx.get('conversation')
          if (!conversation || typeof conversation.createDraftImages !== 'function') {
            flash('截图成功，但 conversation 服务不可用，无法放入输入框')
            return
          }
          if (!inputActions || typeof inputActions.addAttachments !== 'function') {
            flash('截图成功，但输入框不可用，无法放入草稿')
            return
          }
          let ids
          try {
            const file = dataUrlToFile(dataUrl, `stage-panel-${Date.now()}.png`)
            const created = conversation.createDraftImages([file])
            ids = (created || []).map((a) => a.id)
          } catch (error) {
            flash('截图已生成，但附件创建失败：' + (error && error.message ? error.message : error))
            return
          }
          if (ids.length === 0) {
```

</details>

**依据 3 · 源码核查**：[src/skills.js:40-65](https://github.com/ArcaneOrion/dsh-teaching-board/blob/1bbafc235fc8113cf5a1c3b190f009057c1964c7/src/skills.js#L40-L65)

Skill provider 从包内正文读内容并提供资源基址。

<details>
<summary>查看原文（26行）</summary>

```text
/** 构造 stage-panel 的 bundled 技能 provider（交给 ctx.skills.registerProvider）。 */
export function createSkillProvider() {
  let loaded
  const load = () => {
    if (loaded === undefined) {
      loaded = readFile(SKILL_BODY_URL, 'utf8').then((raw) => {
        const { meta, content } = splitFrontmatter(raw)
        return { description: meta.description ?? FALLBACK_DESCRIPTION, content }
      })
    }
    return loaded
  }

  return {
    name: PROVIDER_NAME,
    async list() {
      let description = FALLBACK_DESCRIPTION
      try {
        description = (await load()).description
      } catch {
        // 手册文件缺失时仍让目录条目可用，正文读取会在 get() 处明确报错。
      }
      return [{
        name: SKILL_NAME,
        description,
        invocation: INVOCATION,
```

</details>

#### 缺口

- 课程规模、截图输入预算和兼容维护成本未知。
  **影响**：无法推算一次合格反馈的总成本。
  **进一步探讨**：记录完整课程的输出、图片、复核、重试和恢复时间。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 绑定来源并显式确认的消息协议是否更可信？

**研究主题**：新假设与验证

#### 完整回答

当前跨沙箱消息承担绘图状态和真实用户输入两类职责，却只用数据字段区分。可推导尚未实现的改进，先验证来源为当前 iframe，再绑定一次性请求标识，把反馈放入可确认草稿；self-contained 文档另外由明确 CSP 约束资源。它会增加协议状态与确认操作，但可让浏览器产物与人的提交意图区分。最小实验发送来自第二 iframe、过期 requestId 和伪造自动截图消息，同时验证合法截图；成功需拒绝伪造且不损坏用户草稿。若新协议仍可越过确认或导致合法反馈丢失，假设未成立。

#### 证据与依据

**依据 1 · 源码核查**：[src/client.js:751-764](https://github.com/ArcaneOrion/dsh-teaching-board/blob/1bbafc235fc8113cf5a1c3b190f009057c1964c7/src/client.js#L751-L764)

capture 缺请求绑定和来源判断，是协议假设的推导起点。

<details>
<summary>查看原文（14行）</summary>

```text
          attempt(5)
        }

        useEffect(() => {
          const onMessage = (event) => {
            const d = event.data
            if (!d) return
            if (d.__stagePanel === true) {
              if (d.type === 'capture') {
                if (d.ok === true && typeof d.dataUrl === 'string') {
                  deliver(d.dataUrl, d.auto === true, d.note || '')
                } else {
                  flash('截图失败：' + (d.error || '未知原因'))
                }
```

</details>

**依据 2 · 源码核查**：[src/client.js:728-740](https://github.com/ArcaneOrion/dsh-teaching-board/blob/1bbafc235fc8113cf5a1c3b190f009057c1964c7/src/client.js#L728-L740)

自动提交已有输入空闲判断，但还需确认来源与意图。

<details>
<summary>查看原文（13行）</summary>

```text
                if (!idleRef.current) {
                  // 用户正在写东西：只放入口，不替他按回车。
                  flash('agent 请求了这个板面的截图：已放入输入框（你正在输入，没有自动发送）')
                  return
                }
                try {
                  if (note) inputActions.setDraft(note)
                  inputActions.submit()
                  flash('已把面板截图发回会话')
                } catch {
                  flash('截图已放入输入框，但自动发送失败，请手动回车')
                }
              } else {
```

</details>

#### 缺口

- 新增确认对课堂节奏的影响未评估。
  **影响**：更严格边界可能增加交接负担。
  **进一步探讨**：对照自动和确认草稿流程，比较误提交与反馈耗时。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
