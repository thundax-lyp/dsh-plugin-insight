# 刷B站（dsh-bili-scroll）

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[2170499](https://github.com/c1overzz/dsh-bili-scroll/tree/2170499bb1aedf222874dbf2b6dadb65036681fa)

<!-- BEGIN META -->
[![GitHub ★ 904](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=904&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/c1overzz/dsh-bili-scroll) [![npm 30d 31,913](https://img.shields.io/static/v1?label=npm+30d&message=31%2C913&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-bili-scroll) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-bili-scroll)
<!-- END META -->

> **功能**：按关键词读取 B站 内容、生成日报并可选执行评论提醒的 DSH 值班插件

> **亮点**：把搜索、原内容、模型筛选、固定路径留档和延迟评论核查串成值班流程；专用profile与MCP窄工具是实质约束，但失败fallback会削弱，未证选得更值得。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：跨Host锁是普通读后写且失败放行/10分钟过期，不保证互斥；最小profile失败回headless，定时窗口先登记再启动。自动互动的重复与权限边界不能由锁纸条或started状态证明。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 从候选到日报和@增加什么？](#detail-section-11)
  - [Q02 · 最小权限与写工具是硬保证吗？](#detail-section-12)
  - [Q03 · 跨Host锁与预算能阻止重复和误判吗？](#detail-section-13)
  - [Q04 · 安装、凭据、API与升级有哪些隐藏边界？](#detail-section-14)
  - [Q05 · 谁可以试用，合格任务成本怎么记？](#detail-section-15)
  - [Q06 · 怎样让重复与未知结果可被识别？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：固定兴趣持续看B站且愿核原内容的个人用户，希望把候选/字幕/日报串成任务。

手工B站搜索、看字幕与收藏，模型可辅助总结但不自动发评论；未作同任务质量/成本对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 筛选日报 | 候选/字幕到理由与报告 | 模型质量未测，标题数非验收 |
| 最小值班profile | 收缩文件/网络/代理能力 | 失败回更宽profile，需实际清单 |
| 可选互动 | 评论/@及其他账号操作 | 外部副作用、防重和公开状态另核 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容DSH/headless与真实最小profile | 值班必需 | 启动模型任务 | 失败会回更宽profile，不得假定权限收缩 |
| Python/uv和独立venv | MCP必需 | B站API/二维码 | 下载/镜像/执行均需核来源 |
| B站凭据/网络/模型 | 内容和互动必需 | 读取与可选发送 | 风控/配额/数据出站未知 |
| ASR依赖和模型 | 无字幕特定任务可选 | 本地转写 | 未装跳过，非坏内容 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户核固定Release、依赖和隔离数据目录 | 不照旧裸npm示例装当前源码 |
| 2 | 用户核专用profile真实工具列表 | 缺失不自动退更宽权限继续 |
| 3 | 手动只读任务，互动全关 | 原内容/理由/无内容跳过可核，started不是完成 |
| 4 | 用户另核防重和实际回执 | 未知先查询，重复或权限回退即停自动 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | uv/venv/可选ASR下载资源未知 | 登录、profile/工具与凭据核查 | 作者容量非本轮测量 |
| 持续使用 | 模型、内容网络、ASR资源未知 | 核筛选理由/遗漏与平台互动 | 峰谷资费未独立核，不给节省比 |
| 失败恢复 | 重试/风控/缓存资源未知 | 对账rpid、查双Host锁与窗口 | 回执未知不重发 |
| 升级/退出 | venv/凭据/报告存储未知 | 独立存用户代码，停定时器/子进程并核残留 | 运行时代码备份失败仍可覆盖 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 内容到日报 | 子进程/窄MCP/章程 | 真读全原文、有效条目和净节时 |
| 权限收缩 | 专用profile禁广泛工具 | fallback和host升级实际列表 |
| 互动可追溯 | 真实rpid及90秒复核设计 | 双Host防重、公开/通知实际到达 |

> **思考**：跨Host锁是普通读后写且失败放行/10分钟过期，不保证互斥；最小profile失败回headless，定时窗口先登记再启动。自动互动的重复与权限边界不能由锁纸条或started状态证明。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把搜索、原内容、模型筛选、固定路径留档和延迟评论核查串成值班流程；专用profile与MCP窄工具是实质约束，但失败fallback会削弱，未证选得更值得。[Q01](#research-q01) [Q02](#research-q02)

数据目录外置、MCP退出清pending、UTF8子进程和固定路径工具有复用价值；锁fail-open非原子、profile失败宽退与脚本覆盖备份非硬门是主要边界。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-5"></a>

### 1.4 主要限制

跨Host锁是普通读后写且失败放行/10分钟过期，不保证互斥；最小profile失败回headless，定时窗口先登记再启动。自动互动的重复与权限边界不能由锁纸条或started状态证明。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

观察自动值班/互动；先隔离手动只读且所有互动关闭，核原文/理由与真实最小工具列表。权限回退、重复发布或复核负担更高即停自动并回手工搜索收藏。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

profile/工具约束与进程/MCP接线为源码支持；非原子锁和失败fallback为具体逻辑边界。效果/价格是作者主张未独立测；对账方案为未来假设。

- 已检查：作者 README、包清单、源码路径 package.json、README.md、index.js、lib/state.mjs、lib/mcp.mjs、profile-template/bili-duty/cordis.patch.yml、prompts/duty.md、vendor/bilibili-mcp/mcp_server.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根27个tracked源码统计；另外实读vendored Python工具注册/评论入口、专用profile和duty章程关键段。不执行下载/扫码/模型/平台互动，不声称全Python API或所有私信链已核。
- 下一步：相同关键词时间窗与人工收藏比较有效率/遗漏/所有费用和人工分钟；隔离双Host barrier、崩溃、回执丢失、TTL与profile缺失矩阵核权限、防重和恢复。

**分析版本**

- **仓库**：[c1overzz/dsh-bili-scroll](https://github.com/c1overzz/dsh-bili-scroll)
- **版本号**：2.3.0（[固定提交 2170499](https://github.com/c1overzz/dsh-bili-scroll/tree/2170499bb1aedf222874dbf2b6dadb65036681fa)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证事务claim与operation/rpid对账分开未发/未知/公开，未知先查不重发，最小profile失败阻止自动任务；双Host/崩溃/回执丢/TTL故障矩阵任一重复发布即否定，不承诺平台exactly-once。[Q06](#research-q06)

相同关键词时间窗与人工收藏比较有效率/遗漏/所有费用和人工分钟；隔离双Host barrier、崩溃、回执丢失、TTL与profile缺失矩阵核权限、防重和恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 10 | 1612 | — | — | 29700 |
| .js | source | 2 | 3938 | 3113 | 792 | — |
| .mjs | source | 13 | 1681 | 1210 | 396 | — |
| .mjs | test | 2 | 82 | 70 | 5 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-28），可前往 [GitHub Issues](https://github.com/c1overzz/dsh-bili-scroll/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：自动筛选到日报/互动的内容证据、权限与重复副作用边界是否可控？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 从候选到日报和@增加什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

面向按固定兴趣持续看B站、愿核模型筛选的人，输入关键词与偏好，合格交付是有原内容依据的有效条目和可追踪报告，公开评论/@是另一个有副作用阶段。作者流程搜索近视频、读字幕，无字幕可选故事板或本地ASR，模型写日报和判重；相对人工收藏/复制字幕，插件把任务、定时器、独立Python MCP与日报路径集中。Host runDuty选择profile/patch后spawn DSH，返回started只说明子进程启动，退出0也不是报告/评论完成。章程有无内容/工具失败跳过规则与不把素材当指令的约束，但这些提示不保证模型确实读全字幕或选得值得。贡献是有界材料到筛选/留档的工作流，不是已测推荐准确。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:18-28](https://github.com/c1overzz/dsh-bili-scroll/blob/2170499bb1aedf222874dbf2b6dadb65036681fa/README.md#L18-L28)

作者功能和日报/评论目标。

<details>
<summary>查看原文（11行）</summary>

```text
> DSH 插件：**每天替你刷一轮 B站** —— 它自己搜、**读字幕原文**判断、把值得的写成报告，特别值得的会留一条评论 **@ 你**。
> **你收到的每一条 @，都是它先筛过一遍的。**

## 它做什么

- 按你填的关键词（留空则用内置那几组）搜近几天的视频
- **逐条读字幕原文再判断**（不看摘要）；没字幕的**演示类**视频会先从 B站 自带的故事板**抽几帧看画面**；
  实在读不到内容才跳过 —— 或者你开了「本地转写」
- 写一份 Markdown 报告到 `out/<日期>.md`：每条含「为什么值得」+「它自己的一句话」；每条的段首固定写成 `### BV号` —— 插件数今天挑了几条，数的就是这些标题行
- 开着「自动评论」时，每轮发一条评论、**@ 你**一次（默认每轮 1 条，设置页可调到每轮最多 20 条）
- 可以在**峰谷时段自动跑**（DeepSeek 的优惠时段），省 token
```

</details>

**依据 2 · 源码核查**：[index.js:1588-1615](https://github.com/c1overzz/dsh-bili-scroll/blob/2170499bb1aedf222874dbf2b6dadb65036681fa/index.js#L1588-L1615)

实际profile/overlay与子进程路径。

<details>
<summary>查看原文（28行）</summary>

```text
    // ⭐ 跨宿主运行锁：拿到才跑（写不了锁时照常跑，函数内部已经 fail-open）
    if (!acquireRunLock(why)) return { started: false, why, busy: true, error: '另一个宿主正在跑这一轮' }
    const overlay = ensureOverlay()
      const args = [...dsh.args, '--profile', effectiveProfile()]
    if (overlay) args.push('--patch', overlay)
    args.push(promptFor(why))
    // ⭐ 这一轮的工作目录 = 使用者（或别的用户）的**工作区** —— 只有这样它的 `AGENTS.md` 才会自动加载。
    // ⭐ 工作目录 = **插件家**：那一轮**被沙箱关着**，只写得了自己工作目录里的东西 ✗
    //    （2026-10-14 教训：为了让它读工作区里的 AGENTS.md 把 cwd 改成工作区 ⇒
    //      它写不了家目录里的 out/ 报告、整轮卡在"我是被沙箱关着的"上面打转 ✗；
    //      现在改成"设定由插件读进来、内联进提示词" ✓，cwd 回到插件家 ✓）
      // ⭐ 2.3.0：手动轮是「额外的一次」，但两次之间要冷却（防手滑狂点 / 防烧 token）
      if (why === 'manual') {
        const st0 = readJson(dutyStateFile, {})
        const last = Number(st0.lastManualAt || 0)
        const cd = Math.max(0, Number(cfg.manualCooldownMin) || 0) * 60_000
        if (last && cd > 0 && Date.now() - last < cd) {
          const wait = Math.ceil((cd - (Date.now() - last)) / 60_000)
          log(`手动轮刚跑过（${Math.round((Date.now() - last) / 60_000)} 分钟前）⇒ 再等 ${wait} 分钟`)
          return { ok: false, started: false, error: `手动轮刚跑过，再等 ${wait} 分钟（防手滑狂点）` }
        }
        bumpState({ lastManualAt: Date.now() })
      }
    const cwd = stateDir
    log(`刷B站开跑（${why}）：${dsh.command} ${args.slice(0, 3).join(' ')} …  cwd=${cwd}`)
    const child = spawn(dsh.command, args, {
      cwd,
      shell: dsh.shell,
```

</details>

**依据 3 · 源码核查**：[prompts/duty.md:16-40](https://github.com/c1overzz/dsh-bili-scroll/blob/2170499bb1aedf222874dbf2b6dadb65036681fa/prompts/duty.md#L16-L40)

固定路径工具、无字幕及重试限制。

<details>
<summary>查看原文（25行）</summary>

```text
## 你这一轮没有"文件系统"（2026-10-24 起）

为了不让你（在无人看着的时候）读到这台电脑上的别的东西，这一轮跑在**最小权限 profile** 上：
**没有读写文件的工具、没有命令行、不能自己上网抓页面**。
要记东西，用这几只**固定路径**的工具（它们只会写进插件自己的目录）：

| 想干什么 | 用哪个 |
|---|---|
| 写今天的日报 | `duty_report_append(text)` |
| 往判重表记一行 | `duty_seen_append(bvid, title, up, status)`（status = 挑了 / 跳过 / 评论） |
| **先看**判重表最近记了什么 | `duty_seen_recent(limit=40)`（只读；给 `bvid=` 可只查某条） |
| 往本月归档记一段 | `duty_digest_append(text)` |
| 看这三个文件在哪 | `duty_paths()` |
| 没字幕的视频要转写 | `bili_transcribe_start(bvid)` → 拿 job_id；之后 `bili_transcribe_result(job_id)` 取 |

⚠️ **别去找 read / write / bash 那类工具** —— 这一轮根本没有；找不到不是你坏了，是设计如此。

## 先记住三条（省钱，也是纪律）

- ⚠️ **看够了就下结论**：不要反复权衡同一条该不该收 —— 拿不准就按"跳过"处理，别来回改主意。
- ⚠️ **工具失败两次就记为"跳过"**：不要反复重试同一个命令、也不要为了绕过它写一堆临时脚本。
  （这两条省的是使用者的钱：实测里"纠结"那一轮比干净的一轮多花了**近一倍** token。）
- ⭐⭐ **"空"是一种结果，不是坏了** ✓：字幕 / 转写拿回来是**空的、0 字节的、或者只有一行「字幕byXX」这类署名** ⇒
  那是**这条视频没有语音**（纯音乐 / 纯录屏 / 无声演示），**按"跳过（无语音）"记一笔、继续下一条** ✓。
  ⚠️ **不许**因此去写 `debug.py` / 临时脚本、也不许反复重跑 —— 那是"工具坏了"的思路，会把整轮预算烧光 ✗
```

</details>

**依据 4 · 源码核查**：[lib/mcp.mjs:31-59](https://github.com/c1overzz/dsh-bili-scroll/blob/2170499bb1aedf222874dbf2b6dadb65036681fa/lib/mcp.mjs#L31-L59)

实际Python MCP初始化子进程。

<details>
<summary>查看原文（29行）</summary>

```text
  async start() {
    if (this.proc) return
    if (this.starting) return this.starting
    this.starting = (async () => {
      const { command, args, cwd, env, log } = this.cfg
      this.proc = spawn(command, args, {
        cwd,
        env: { ...process.env, ...(env || {}) },
        stdio: ['pipe', 'pipe', 'pipe'],
        windowsHide: true,
      })
      this.proc.stdout.setEncoding('utf8')
      this.proc.stdout.on('data', (chunk) => this.#onData(chunk))
      this.proc.stderr.setEncoding('utf8')
      this.proc.stderr.on('data', (c) => { this.stderr = (this.stderr + c).slice(-4000) })
      this.proc.on('error', (e) => log(`MCP 子进程启动失败：${e?.message ?? e}`))
      this.proc.on('exit', (code) => {
        log(`MCP 子进程退出（code=${code}）`)
        for (const [, p] of this.pending) p.reject(new Error(`MCP 子进程退出（code=${code}）${this.stderr ? '：' + this.stderr.slice(-300) : ''}`))
        this.pending.clear()
        this.proc = null
      })
      await this.#request('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: PKG.name || 'dsh-bili-scroll', version: PKG.version || '0.0.0' },
      })
      this.#notify('notifications/initialized', {})
      log('MCP 已就绪')
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 最小权限与写工具是硬保证吗？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

专用profile真实禁bash/pwsh/jobs、fs/search、web、subagent/workflow、Skill和agent-instructions，改用固定路径写报告工具，比单纯提示“别读文件”有实质收缩。Python工具名单从BILI_MCP_TOOLS限制注册，bili_reply/bili_send_message入口另过guard，减少直接调用绕开注册的情况；但环境变量为空时全放，不能把白名单机制称默认拒绝。ensureDutyProfile失败时effectiveProfile回headless或用户自定义，日志明确能力偏大，故最小权限不是失败关闭；宿主更新新增工具/row是否覆盖也需精确版本清单。自动评论默认关的UI条件应与最终allowlist一致核，不能只看章程授权。

#### 证据与依据

**依据 1 · 源码核查**：[profile-template/bili-duty/cordis.patch.yml:30-90](https://github.com/c1overzz/dsh-bili-scroll/blob/2170499bb1aedf222874dbf2b6dadb65036681fa/profile-template/bili-duty/cordis.patch.yml#L30-L90)

真实执行/文件/网络/代理/Skill禁用行。

<details>
<summary>查看原文（61行）</summary>

```text
# ── 命令执行 ────────────────────────────────────────────────────────────────
- id: tool-bash
  disabled: true
- id: tool-pwsh
  disabled: true
- id: tool-jobs
  disabled: true
- id: jobs
  disabled: true
- id: tool-ralph
  disabled: true

# ── 文件系统：读 / 写 / 搜 —— 一个都不留 ────────────────────────────────────
- id: tool-fs
  disabled: true
- id: tool-fs-search
  disabled: true

# ── 联网：B站 数据走 MCP，不需要它自己抓网页 ────────────────────────────────
- id: tool-web
  disabled: true
- id: web-fetch-http
  disabled: true
- id: web-search-deepseek
  disabled: true

# ── 子代理 / 工作流：都能绕开工具限制 ───────────────────────────────────────
- id: tool-subagent
  disabled: true
- id: tool-subagent-fork
  disabled: true
- id: tool-subagent-control
  disabled: true
- id: tool-subagent-list-agents
  disabled: true
- id: subagent
  disabled: true
- id: subagent-fork-in-process
  disabled: true
- id: subagent-spawn-in-process
  disabled: true
- id: workflow-ptc
  disabled: true
- id: ptc-runtime
  disabled: true
- id: tool-workflow
  disabled: true

# ── 技能：会读文件 ──────────────────────────────────────────────────────────
- id: skill
  disabled: true
- id: skill-filesystem
  disabled: true
- id: skill-badge
  disabled: true
- id: tool-skill
  disabled: true

# ── 自动读 AGENTS.md（会把上级目录的私人设定塞进上下文）──────────────────────
- id: agent-instructions
  disabled: true
```

</details>

**依据 2 · 源码核查**：[index.js:1340-1367](https://github.com/c1overzz/dsh-bili-scroll/blob/2170499bb1aedf222874dbf2b6dadb65036681fa/index.js#L1340-L1367)

专用profile检测与失败回headless。

<details>
<summary>查看原文（28行）</summary>

```text
  let dutyProfileState = 'unknown'   // ok / missing / failed
  const dutyProfileDir = join(dirname(stateDir), 'profiles', 'bili-duty')
  const ensureDutyProfile = () => {
    try {
      const src = join(pluginDir, 'profile-template', 'bili-duty')
      if (!existsSync(src)) { dutyProfileState = 'missing'; return false }
      mkdirSync(dirname(dutyProfileDir), { recursive: true })
      // 每次启动都覆盖（模板很小；这是安全边界，用户改它也会被覆盖）
      cpSync(src, dutyProfileDir, { recursive: true, force: true })
      dutyProfileState = existsSync(join(dutyProfileDir, 'cordis.patch.yml')) ? 'ok' : 'failed'
      return dutyProfileState === 'ok'
    } catch (e) {
        dutyProfileState = 'failed'
        const why = String(e?.message ?? e)
        // ⭐ #136：铺不上很常见（杀软锁文件 / OneDrive 同步 / 长路径），但别只丢一句「退回 headless」
        log('⚠️ 最小权限 profile 铺不上：' + why)
        log('   目标目录：' + dutyProfileDir)
        log('   常见原因：杀软或 OneDrive 正在占用、盘符长路径、目标被别的进程锁住')
        log('   ⚠️ 这一轮只能用 headless（权限更大：能看到文件系统）—— 修好后重启 dsh 就回到最小权限')
        roundNotes.push('⚠️ 最小权限 profile 没铺上，这一轮退回了 headless（权限更大）：' + why)
        return false
    }
  }
  // 真正用的 profile：用户手填了别的就尊重；还是老默认 has headless ⇒ 用最小权限那个
  const effectiveProfile = () => {
    const want = String(cfg.headlessProfile || '').trim()
    if (want && want !== 'headless' && want !== 'bili-duty') return want
    return dutyProfileState === 'ok' ? 'bili-duty' : (want || 'headless')
```

</details>

**依据 3 · 源码核查**：[vendor/bilibili-mcp/mcp_server.py:55-78](https://github.com/c1overzz/dsh-bili-scroll/blob/2170499bb1aedf222874dbf2b6dadb65036681fa/vendor/bilibili-mcp/mcp_server.py#L55-L78)

白名单注册及直接调用guard，空名单全放。

<details>
<summary>查看原文（24行）</summary>

```text
#    · 不给这个变量 ⇒ **全放**（手工跑、或老配置，行为一点不变 ✓）
#    · 给了 ⇒ 只注册名单里的；不在名单里的工具**连名字都不会出现在 list_tools 里**，
#      模型那边等于根本不存在 —— 这才是真的闸门（光靠提示词说"别用"不算）✓
_ALLOWED = {t.strip() for t in os.environ.get("BILI_MCP_TOOLS", "").split(",") if t.strip()}


def tool():
    """@tool() 的替身：白名单里没有这个函数名，就原样返回、**不注册**。"""
    def deco(fn):
        if _ALLOWED and fn.__name__ not in _ALLOWED:
            return fn
        return mcp.tool()(fn)
    return deco


# ⭐⭐ 2026-10-23 安全加固（issue #39）：**白名单以前只挡"注册"，不挡"直接调用"** ——
#    agent 手里有 python/shell，可以自己写脚本 import 这个文件再调函数 ⇒ 闸门形同虚设。
#    ⇒ 每个"会往 B站 写东西"的函数入口都过一遍 _guard()；没开就直接返回、什么都不做 ✓
def _guard(name: str) -> str:
    """没开这个工具就返回一句提示；开着返回空串。"""
    if _ALLOWED and name not in _ALLOWED:
        print(f"[bili-mcp] 拒绝调用 {name}（不在 BILI_MCP_TOOLS 白名单里）", file=sys.stderr)
        return f"这个工具没开：{name}"
    return ""
```

</details>

**依据 4 · 源码核查**：[vendor/bilibili-mcp/mcp_server.py:649-681](https://github.com/c1overzz/dsh-bili-scroll/blob/2170499bb1aedf222874dbf2b6dadb65036681fa/vendor/bilibili-mcp/mcp_server.py#L649-L681)

真实评论函数先guard再发送。

<details>
<summary>查看原文（33行）</summary>

```text
async def bili_reply(bvid: str, text: str, rpid: int = 0, root: int = 0) -> str:
    """
    在B站视频下发表评论或回复某条评论

    Args:
        bvid: 视频BV号
        text: 评论/回复的文本内容
        rpid: 要回复的目标评论ID（0表示发表新评论）
        root: 楼层根评论ID（回复一级评论时不用填，回复楼中楼时填根评论ID）
    
    Returns:
        发表结果
    """
    _deny = _guard("bili_reply")
    if _deny: return _deny
    # ⭐ 语感闸门：撞八股 / 撞自己以前的 / 撞这条视频的热评 ⇒ 不发，把改法告诉模型
    _style = await _style_reason(text, bvid, get_cred())
    if _style:
        return json.dumps({"ok": False, "sent": False, "blocked_by": "style", "error": _style}, ensure_ascii=False)
    cred = get_cred()
    v = video.Video(bvid=bvid, credential=cred)
    info = await v.get_info()
    aid = info["aid"]

    try:
        if rpid == 0:
            # 发表新评论
            result = await comment.send_comment(
                text=text,
                oid=aid,
                type_=comment.CommentResourceType.VIDEO,
                credential=cred,
            )
```

</details>

#### 缺口

- 精确host dump后的实际工具集合、失败fallback和自动评论开关最终能力未运行验收。
  **影响**：不能承诺无人值守绝不读本机其他数据或绝不越范围互动。
  **进一步探讨**：先隔离dump工具列表，故意让专用profile缺失；未得到最小集合就不自动运行，先手动只读筛选。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 跨Host锁与预算能阻止重复和误判吗？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

进程内dutyChild限制同实例并发；跨Host acquireRunLock先读纸条检查pid/10分钟，再普通writeFileSync写同一路径，没有exclusive create/CAS，两Host可同时读空并各自写成功，故不是原子互斥；锁读写失败明确fail-open，超10分钟即使旧pid活也让新轮跑。定时tick在runDuty前先持久windows标记，启动失败后这一窗口可能已消耗；报告标题计挑选/手动extra是格式协议，不是任务质量。发送后90秒verify有价值，接口成功与公开可见分开，但延迟、只查页面与身份仍不能保证通知到人。自动互动前必须解重复副作用与未知结果，不能把锁文件存在和子进程0当幂等证明。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1524-1564](https://github.com/c1overzz/dsh-bili-scroll/blob/2170499bb1aedf222874dbf2b6dadb65036681fa/index.js#L1524-L1564)

非原子读后写、TTL及fail-open锁。

<details>
<summary>查看原文（41行）</summary>

```text
  // ⭐⭐ 2.0.4（第三方体检第 2 条）：**同一时间只允许一轮在跑**，并且**登记这个子进程**，
  //    关页面/卸载插件时能把它一起收掉（以前它没有锁、也不归 ctx.effect 管 ✗）。
  // ⭐⭐ 2026-10-25：**跨宿主的运行锁**（issue 提到"没加原子锁"—— 那一半是真的）。
  //    同一台机器可能同时开着网页版和桌面版两个 DSH，两边都装了插件、都有自己的定时器：
  //    同一分钟两个都到点 ⇒ 都开跑 ⇒ **同一条视频被推两遍**，`seen.md` 也会多出重复行 ✗
  //    （私信监听早就有 `dm-lock.json` 了，跑一轮这块一直只有"进程内"的标志位 ✗）
  //    设计：一张带 pid + 时间的纸条，谁先写成谁跑，另一个让开；10 分钟自动过期（防进程崩了锁死）。
  //    ⚠️ **写不了锁就照常跑** —— 宁可偶尔重复一次，也不能因为锁坏了就不干活。
  const runLockFile = join(stateDir, 'run-lock.json')
  const RUN_LOCK_TTL = 10 * 60_000
  const pidAlive = (pid) => {
    if (!pid) return false
    try { process.kill(pid, 0); return true } catch { return false }
  }
  /** 试着占锁：拿到 ⇒ true；有人正占着（新鲜的、进程还活着、不是我）⇒ false */
  const acquireRunLock = (why) => {
    try {
      let lock = null
      try { lock = JSON.parse(readFileSync(runLockFile, 'utf8')) } catch { lock = null }
      if (lock && Number(lock.pid) !== process.pid) {
        const fresh = Number(lock.ts) > Date.now() - RUN_LOCK_TTL
        if (fresh && pidAlive(Number(lock.pid))) {
          log(`这一轮没跑（${why}）：另一个宿主正在跑（pid=${lock.pid}）⇒ 让给它`)
          return false
        }
        if (!fresh) log('运行锁已过期（' + Math.round((Date.now() - Number(lock.ts)) / 60000) + ' 分钟前那个），这一轮照跑')
      }
      writeFileSync(runLockFile, JSON.stringify({ pid: process.pid, ts: Date.now(), why }), 'utf8')
      return true
    } catch (e) {
      // 锁文件坏了/写不进去 ⇒ 不拦路（fail-open，但留痕）
      log('运行锁读写失败（这一轮照跑）：' + String(e?.message ?? e))
      return true
    }
  }
  /** 放锁：只放自己的那张（别把别人的删了） */
  const releaseRunLock = () => {
    try {
      const lock = JSON.parse(readFileSync(runLockFile, 'utf8'))
      if (Number(lock?.pid) === process.pid) writeFileSync(runLockFile, '{"pid":0,"ts":0}', 'utf8')
    } catch { /* 没有锁 / 读不出来 / 写不进去都无所谓，靠 10 分钟过期兜底 */ }
```

</details>

**依据 2 · 源码核查**：[index.js:1695-1713](https://github.com/c1overzz/dsh-bili-scroll/blob/2170499bb1aedf222874dbf2b6dadb65036681fa/index.js#L1695-L1713)

预算与窗口先标记再run。

<details>
<summary>查看原文（19行）</summary>

```text
  const tick = () => {
    try {
      refreshCfg()                    // ⭐ 定时器活得比设置页久：每一跳都重新读一遍配置
      if (!cfg.peakValley) return
      const now = new Date()
      const st = readJson(dutyStateFile, {})
      const today = dayKey(now)
      // ⭐ 闸门看的是「今天已经**挑到几条**」（从今天的报告里数出来），不是「跑了几轮」
      if (autoPickedToday(now) >= Number(cfg.perDay || 0)) return
      // ⭐ 「不写日报」那档没有报告可数 ⇒ 数不出条数就保守一点：一天只跑一轮
      if (String(cfg.reportLevel || 'full') === 'off' && roundsToday(now) >= 1) return
      for (const k of ['noon', 'night']) {
        if (!cfg[k]) continue
        if (!inWindow(now, WINDOWS[k])) continue
        const key = `${today}:${k}`
        if (st.windows?.[key]) continue
        bumpState({ windows: { ...(st.windows || {}), [key]: true }, count: roundsToday(now) + 1, lastRunAt: now.toISOString(), lastWhy: k })
        runDuty(`window:${k}`)
        return
```

</details>

**依据 3 · 源码核查**：[index.js:1669-1682](https://github.com/c1overzz/dsh-bili-scroll/blob/2170499bb1aedf222874dbf2b6dadb65036681fa/index.js#L1669-L1682)

90秒复核和started返回的边界。

<details>
<summary>查看原文（14行）</summary>

```text
      } catch (e) { log(`数挑了几条时出错（不影响这一轮）：${e?.message ?? e}`) }
      // ⭐ 发完评论之后**过一会儿再核一次**（2026-10-16 加的「评论发出后复核」）：
      //    接口回"发送成功"≠ 公开可见（新号/风控会进审核）；而"不公开"时连 @ 通知都不会推 ⇒
      //    插件会以为发了、下一轮不再发 ⇒ 一条都没到人。等 90 秒再查，避免把"还在审核"误判成"没发出去"。
      const verifyTimer = setTimeout(() => { Promise.resolve(runVerify('round')).catch((e) => log('复核异常：' + (e?.message ?? e))) }, 90_000)
      verifyTimer.unref?.()   // 别为了一次复核把宿主进程的退出拖住 90 秒
    })
    child.on('close', () => { if (dutyChild === child) dutyChild = null })
    dutyChild = child
    dutyStartedAt = Date.now()
    child.on('error', (e) => { releaseRunLock(); log(`刷B站起不来：${e?.message ?? e}`) })
    // ⭐ 起不来/被杀掉也要把锁放开，否则之后每一轮都会被判成'上一轮还没结束' ✗
    child.on('close', () => { if (dutyChild === child) dutyChild = null })
    return { started: true, why, profile: cfg.headlessProfile, cwd, log: logFile }
```

</details>

#### 缺口

- 双Host同时启动、长轮次和已发但回执丢失的重复风险未实测。
  **影响**：无人值守评论/@可能重复或任务窗口漏跑，不能持续安装推荐。
  **进一步探讨**：两进程barrier同时claim、轮次超TTL和发送超时故障注入，任何重复发送即关闭自动互动。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装、凭据、API与升级有哪些隐藏边界？

**研究主题**：依赖、兼容与流程、工程质量与复用

#### 完整回答

Python/uv、venv、B站登录凭据和宿主headless是关键依赖，可选ASR另需模型/资源；MCP启动继承process.env，输入内容进入模型和B站，不因凭据只落本机就等于任务不外发。stateDir统一DSH_HOME/bili-duty避免包目录只读/升级丢数据。ensureHomeFiles真实行为是已有运行时代码备份后覆盖，备份失败也继续；顶部旧注释的“用户改过留.new”不是当前执行语义，用户定制要另备份。HTTP前缀先尝试旧connection.requestRejection，拿不到回本机同源，不支持admit-only合约即可能退结构fence；因此不能凭本机来源称所有host认证已成立。公开npm旧版是作者声明，应核固定Release而非照旧裸名命令。

#### 证据与依据

**依据 1 · 源码核查**：[lib/state.mjs:36-57](https://github.com/c1overzz/dsh-bili-scroll/blob/2170499bb1aedf222874dbf2b6dadb65036681fa/lib/state.mjs#L36-L57)

真实数据目录与普通JSON写。

<details>
<summary>查看原文（22行）</summary>

```text
export function stateDirOf(ctx) {
  let dir = ''
  try {
    const p = ctx?.get?.('dshHomePath')
    if (typeof p === 'function') {
      const v = p('bili-duty')                       // ← 函数形态：把目录名传进去
      if (v) dir = String(v)
    } else if (typeof p === 'string' && p) {
      dir = join(p, 'bili-duty')
    }
  } catch { /* 拿不到就用下面的兜底 */ }
  if (!dir) dir = join(process.env.DSH_HOME || join(homedir(), '.dsh'), 'bili-duty')
  mkdirSync(dir, { recursive: true })
  return dir
}

export function readJson(file, fallback) {
  try { return JSON.parse(readFileSync(file, 'utf8')) } catch { return fallback }
}

export function writeJson(file, value) {
  writeFileSync(file, JSON.stringify(value, null, 2), 'utf8')
```

</details>

**依据 2 · 源码核查**：[lib/state.mjs:89-102](https://github.com/c1overzz/dsh-bili-scroll/blob/2170499bb1aedf222874dbf2b6dadb65036681fa/lib/state.mjs#L89-L102)

运行时代码备份失败仍覆盖，修正旧注释误读。

<details>
<summary>查看原文（14行）</summary>

```text
      const onDisk = readFileSync(to, 'utf8')
      if (onDisk === incoming) { if (!shipped) writeMark(incoming); continue }   // 本来就是同一份
      // ⭐⭐ 2.1.0（2026-10-24 实证）：剩下两种情况的处理可以并成一条 ——
      //    这几个文件是**我们发的运行时代码**（mcp_server.py / asr.py / favops.py），
      //    用户改过也不该拦着升级：否则"宿主新、Python 侧旧"，新工具根本不出现 ✗
      //    （今天就这么栽的：家目录那份停在 11:50，值班轮里说"没有 bili_cover 这个工具"）
      //    ⇒ **先备份 .bak-<时间戳>，再覆盖**，改了什么都能自己捞回来 ✓
      const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)
      const bak = to + ".bak-" + stamp
      try { copyFileSync(to, bak) } catch { /* 备份不了也继续，原件在插件包里 */ }
      copyFileSync(from, to)
      writeMark(incoming)
      log(`已覆盖：${to}（旧的那份备份在 ${bak}）`)
    } catch (e) { log(`铺 ${to} 失败：${e?.message ?? e}`) }
```

</details>

**依据 3 · 源码核查**：[lib/mcp.mjs:35-50](https://github.com/c1overzz/dsh-bili-scroll/blob/2170499bb1aedf222874dbf2b6dadb65036681fa/lib/mcp.mjs#L35-L50)

Python进程env继承与退出清pending。

<details>
<summary>查看原文（16行）</summary>

```text
      const { command, args, cwd, env, log } = this.cfg
      this.proc = spawn(command, args, {
        cwd,
        env: { ...process.env, ...(env || {}) },
        stdio: ['pipe', 'pipe', 'pipe'],
        windowsHide: true,
      })
      this.proc.stdout.setEncoding('utf8')
      this.proc.stdout.on('data', (chunk) => this.#onData(chunk))
      this.proc.stderr.setEncoding('utf8')
      this.proc.stderr.on('data', (c) => { this.stderr = (this.stderr + c).slice(-4000) })
      this.proc.on('error', (e) => log(`MCP 子进程启动失败：${e?.message ?? e}`))
      this.proc.on('exit', (code) => {
        log(`MCP 子进程退出（code=${code}）`)
        for (const [, p] of this.pending) p.reject(new Error(`MCP 子进程退出（code=${code}）${this.stderr ? '：' + this.stderr.slice(-300) : ''}`))
        this.pending.clear()
```

</details>

**依据 4 · 源码核查**：[index.js:2996-3053](https://github.com/c1overzz/dsh-bili-scroll/blob/2170499bb1aedf222874dbf2b6dadb65036681fa/index.js#L2996-L3053)

旧requestRejection与同源fallback实际接线。

<details>
<summary>查看原文（58行）</summary>

```text
    nodeConnTried = true
    const tries = [
      ['ctx.get("connection")', () => (typeof ctx.get === 'function' ? ctx.get('connection') : null)],
      ['Reflect.get(ctx, "connection")', () => Reflect.get(ctx, 'connection')],
      ['ctx.root.connection', () => (ctx.root && typeof ctx.root === 'object' ? ctx.root.connection : null)],
    ]
    for (const [how, fn] of tries) {
      try {
        const c = fn()
        if (c && typeof c.requestRejection === 'function') {
          nodeConnCached = c
          log('信任栅栏：用 ' + how + ' 拿到了 connection 服务 ✓')
          return c
        }
      } catch { /* 换下一个 */ }
    }
    log('⚠️ 三种写法都拿不到 connection.requestRejection ⇒ 退回"本机同源"这一道')
    return null
  }
  const fenceReject = (req, res) => {
    const conn = getConnection()
    if (!conn) {
      if (!fenceWarned) { fenceWarned = true; log("⚠️ 拿不到 DSH 信任栅栏（connection.requestRejection）⇒ 退回本机同源这一道") }
      return false
    }
    try {
      // ⭐ 2.0.5（采纳 PR #94）：契约入参是 `{ headers }`（ConnectionTrustRequest），不是原始 IncomingMessage；
      //    两种形状都给一遍，谁的实现都能接住（实测传原始 req 也能过，但按契约来更稳）
      const rejection = conn.requestRejection({ headers: req.headers })
      if (rejection === undefined) return false
      res.statusCode = typeof rejection === "number" ? rejection : 403
      try { res.end() } catch { /* 忽略 */ }
      return true
    } catch (err) {
      log("信任栅栏调用出错，按不通过处理：" + String(err?.message ?? err))
      res.statusCode = 403
      try { res.end() } catch { /* 忽略 */ }
      return true
    }
  }

  try {
    ctx.effect(() => ctx.webServer.register({
      kind: 'prefix',
      path: '/api/bili-duty',
      handler: async (req, res) => {
        // ① 先过 DSH 的信任栅栏（真鉴权）
        if (fenceReject(req, res)) return
        // ② 再过本机同源（栅栏拿不到时的兜底，也挡浏览器里别的网页）
        if (!sameOriginOk(req)) {
          try { sendJson(res, 403, { ok: false, error: '只接受本机同源请求' }) } catch { /* 忽略 */ }
          return
        }
        try { await handle(req, res, new URL(req.url, 'http://127.0.0.1')) } catch (err) {
          sendJson(res, 500, { ok: false, error: err?.message ?? String(err) })
        }
      },
    }), 'bili-duty: /api/bili-duty 路由')
```

</details>

**依据 5 · 源码核查**：[README.md:50-65](https://github.com/c1overzz/dsh-bili-scroll/blob/2170499bb1aedf222874dbf2b6dadb65036681fa/README.md#L50-L65)

作者分发警告与固定Release示例。

<details>
<summary>查看原文（16行）</summary>

````text
> 🔴 **先看这条：npm 上还是旧版（0.1.7），别用 `add dsh-bili-scroll` 装。**
> 我们的 npm 发布账号还在申诉里（工单 4880295），2026-10-17 之后的新版本**只能**从下面两条装。

```bash
# ⭐ 首选：Release 里的 tgz 直链（不需要 git，也不会被 pnpm 拦构建脚本）
dsh plugin --profile web add https://github.com/c1overzz/dsh-bili-scroll/releases/download/v2.0.2/dsh-bili-scroll-2.0.2.tgz

# 备选：git 方式（需要机器上装了 git；pnpm 10 可能拦它的构建脚本）
dsh plugin --profile web add github:c1overzz/dsh-bili-scroll
```

> 连不上 github 的话，在链接前面加镜像：`https://gh-proxy.com/`（实测可用，返回的是同一个文件）。
> 版本号那一节会变，最新的下载地址在 **Releases** 页（`…/releases/latest`）。
（⭐ 最省事的一条：把仓库链接贴给你自己的 dsh，说「**帮我装这个插件**」，它会自己装。）

⚠️ 装完**必须重启一次 dsh**（bundle 层要重启才组装）。然后进 **设置 → 刷B站**。
````

</details>

#### 缺口

- B站登录风控、当前API/字幕与ASR可用性、精确host身份和数据残留未知。
  **影响**：不能把自述本地凭据或依赖就绪当端到端通过。
  **进一步探讨**：隔离环境核实际API/模型目的地、未登录访问和退出残留，用户定制文件先独立保存。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 谁可以试用，合格任务成本怎么记？

**研究主题**：效果与总成本、采用判断

#### 完整回答

当前建议观察自动值班/互动，愿核字幕的用户可先以脱敏偏好手动、只读、关闭评论/收藏/私信试样本，确认专用profile真实工具列表。合格报告必须原内容可核、条目理由具体、无内容明确跳过；不能以标题数当质量。首次下载/venv/登录、持续模型/字幕/故事板/可选ASR、失败重试/风控/核回执都计成本；峰谷窗口为作者价格假设，不验证当前资费，不给节省数。若筛选比原生搜索收藏更费人工、出现权限回退或重复外部写入，停自动轮次与互动，回手工浏览/收藏。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:85-101](https://github.com/c1overzz/dsh-bili-scroll/blob/2170499bb1aedf222874dbf2b6dadb65036681fa/README.md#L85-L101)

登录、依赖和默认互动开关用途。

<details>
<summary>查看原文（17行）</summary>

```text
## 首次使用（两步）

1. **装主依赖** —— 设置页点「装主依赖」：在插件自己的家目录建一个独立 venv，装 4 个包
   （`bilibili-api-python` / `aiohttp` / `mcp<2` / `qrcode`）。**走国内镜像 + uv，通常几十秒**（进度写 `install.log`，不卡页面）。
2. **扫码登录** —— 点「扫码登录」，用手机 B站 扫页面上那张码。
   ⚠️ **确认时选「记住我 / 长期」那张**（选 24 小时的话，明天就得重扫）。
   凭证只落在你本机的插件家目录：`<DSH_HOME>/bili-duty/bili_credential.json`，不上传任何地方。

## 设置页里有什么

分成四页签，第一次用建议只看「日常」：

| 页签 | 里面有什么 |
|---|---|
| **日常** | **峰谷自动刷**（总开关，打开才展开「中午 12–14」「晚上 18–09」两个子开关）· **每天最多挑几条**（0 = 只手动）· **它刷过的视频**（卡片墙 + 档位/状态筛选 + 分页） |
| **偏好** | **它按什么说话（人设提示词）** ← 想让它像谁就写在这儿，留空按中性说话 · **关注关键词**（一行一个）· **自动收藏到**（可选收藏夹）· **日报写多细**（完整 / 薄版 / 不写）· 下面一个**保存**按钮 |
| **互动** | **自动评论并 @ 你**（默认关）· **回复评论**（默认关，只回楼中楼）· **投递方式**（只私信 = 默认 / 只发评论 / 两边都发）· **私信发给谁（UID）**（可留空，用昵称自动查）· **私信双向**（默认关，开了它会读你的私信并回一句） |
```

</details>

**依据 2 · 源码核查**：[index.js:1599-1609](https://github.com/c1overzz/dsh-bili-scroll/blob/2170499bb1aedf222874dbf2b6dadb65036681fa/index.js#L1599-L1609)

手动冷却与额外轮次的具体成本限制。

<details>
<summary>查看原文（11行）</summary>

```text
      // ⭐ 2.3.0：手动轮是「额外的一次」，但两次之间要冷却（防手滑狂点 / 防烧 token）
      if (why === 'manual') {
        const st0 = readJson(dutyStateFile, {})
        const last = Number(st0.lastManualAt || 0)
        const cd = Math.max(0, Number(cfg.manualCooldownMin) || 0) * 60_000
        if (last && cd > 0 && Date.now() - last < cd) {
          const wait = Math.ceil((cd - (Date.now() - last)) / 60_000)
          log(`手动轮刚跑过（${Math.round((Date.now() - last) / 60_000)} 分钟前）⇒ 再等 ${wait} 分钟`)
          return { ok: false, started: false, error: `手动轮刚跑过，再等 ${wait} 分钟（防手滑狂点）` }
        }
        bumpState({ lastManualAt: Date.now() })
```

</details>

**依据 3 · 源码核查**：[prompts/duty.md:33-40](https://github.com/c1overzz/dsh-bili-scroll/blob/2170499bb1aedf222874dbf2b6dadb65036681fa/prompts/duty.md#L33-L40)

无内容跳过和失败上限是报告验收边界。

```text
## 先记住三条（省钱，也是纪律）

- ⚠️ **看够了就下结论**：不要反复权衡同一条该不该收 —— 拿不准就按"跳过"处理，别来回改主意。
- ⚠️ **工具失败两次就记为"跳过"**：不要反复重试同一个命令、也不要为了绕过它写一堆临时脚本。
  （这两条省的是使用者的钱：实测里"纠结"那一轮比干净的一轮多花了**近一倍** token。）
- ⭐⭐ **"空"是一种结果，不是坏了** ✓：字幕 / 转写拿回来是**空的、0 字节的、或者只有一行「字幕byXX」这类署名** ⇒
  那是**这条视频没有语音**（纯音乐 / 纯录屏 / 无声演示），**按"跳过（无语音）"记一笔、继续下一条** ✓。
  ⚠️ **不许**因此去写 `debug.py` / 临时脚本、也不许反复重跑 —— 那是"工具坏了"的思路，会把整轮预算烧光 ✗
```

#### 缺口

- 筛选准确率、有效收藏率、总模型费用/ASR资源与复核分钟未知。
  **影响**：不能宣称日报值得、便宜或能代替用户浏览。
  **进一步探讨**：相同关键词同时间窗与人工搜索对照，记录有效条目、遗漏、所有尝试、现金和人工分钟。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 怎样让重复与未知结果可被识别？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是以exclusive claim或事务存储替代pid纸条，把operationId、轮次状态和每个外部写入rpid持久化，区分未发送、已提交/未知、已回读公开，结果未知先查询不重发；最小权限profile不可用则阻止自动任务。该设计不等于平台支持exactly-once，也不能让语义筛选更好。两Host同起、进程崩溃、请求响应丢失、超过TTL、profile缺失矩阵比较重复、漏跑与人工恢复分钟；出现同operation重复发布或未知被当成功就否定实现。收益仍需真实用户案例而非锁数证明。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1539-1556](https://github.com/c1overzz/dsh-bili-scroll/blob/2170499bb1aedf222874dbf2b6dadb65036681fa/index.js#L1539-L1556)

普通读后写和fail-open为事务claim的反例。

<details>
<summary>查看原文（18行）</summary>

```text
  const acquireRunLock = (why) => {
    try {
      let lock = null
      try { lock = JSON.parse(readFileSync(runLockFile, 'utf8')) } catch { lock = null }
      if (lock && Number(lock.pid) !== process.pid) {
        const fresh = Number(lock.ts) > Date.now() - RUN_LOCK_TTL
        if (fresh && pidAlive(Number(lock.pid))) {
          log(`这一轮没跑（${why}）：另一个宿主正在跑（pid=${lock.pid}）⇒ 让给它`)
          return false
        }
        if (!fresh) log('运行锁已过期（' + Math.round((Date.now() - Number(lock.ts)) / 60000) + ' 分钟前那个），这一轮照跑')
      }
      writeFileSync(runLockFile, JSON.stringify({ pid: process.pid, ts: Date.now(), why }), 'utf8')
      return true
    } catch (e) {
      // 锁文件坏了/写不进去 ⇒ 不拦路（fail-open，但留痕）
      log('运行锁读写失败（这一轮照跑）：' + String(e?.message ?? e))
      return true
```

</details>

**依据 2 · 源码核查**：[index.js:1699-1713](https://github.com/c1overzz/dsh-bili-scroll/blob/2170499bb1aedf222874dbf2b6dadb65036681fa/index.js#L1699-L1713)

窗口标记与执行分离需要状态机。

<details>
<summary>查看原文（15行）</summary>

```text
      const now = new Date()
      const st = readJson(dutyStateFile, {})
      const today = dayKey(now)
      // ⭐ 闸门看的是「今天已经**挑到几条**」（从今天的报告里数出来），不是「跑了几轮」
      if (autoPickedToday(now) >= Number(cfg.perDay || 0)) return
      // ⭐ 「不写日报」那档没有报告可数 ⇒ 数不出条数就保守一点：一天只跑一轮
      if (String(cfg.reportLevel || 'full') === 'off' && roundsToday(now) >= 1) return
      for (const k of ['noon', 'night']) {
        if (!cfg[k]) continue
        if (!inWindow(now, WINDOWS[k])) continue
        const key = `${today}:${k}`
        if (st.windows?.[key]) continue
        bumpState({ windows: { ...(st.windows || {}), [key]: true }, count: roundsToday(now) + 1, lastRunAt: now.toISOString(), lastWhy: k })
        runDuty(`window:${k}`)
        return
```

</details>

**依据 3 · 源码核查**：[prompts/duty.md:71-75](https://github.com/c1overzz/dsh-bili-scroll/blob/2170499bb1aedf222874dbf2b6dadb65036681fa/prompts/duty.md#L71-L75)

真实rpid回执而非编造为对账基础。

```text
- ⭐ **发完评论，把「视频 BV 号 + 评论 rpid + 时间 + 正文前 20 字」一起记进判重表的「评论记录」**
  —— 有了 rpid，下一轮就能**直接定位到那条评论**，不用在几百条评论里翻。
  ⭐ **rpid 从 `bili_reply` 的返回里取**（返回 JSON 的 `rpid` 字段；回复别人时把 `root` 也取出来）。
  ⚠️ **返回里没有 rpid，就写「未取到 rpid」，绝不自己编一个数字** —— 宿主复核认的就是这个号，
  编一个反而会核到别人身上。
```

#### 缺口

- B站外部幂等键支持及持久operation带来的维护负担未知。
  **影响**：只能提出本地防重/对账假设，不承诺exactly-once。
  **进一步探讨**：故障矩阵核请求与平台记录，重复不降或恢复负担更高就保留手动流程。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
