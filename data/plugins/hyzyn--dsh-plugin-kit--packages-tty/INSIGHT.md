# @hyzyn/dsh-tty

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[44554d7](https://github.com/hyzyn/dsh-plugin-kit/tree/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty)

<!-- BEGIN META -->
[![GitHub ★ 62](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=62&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hyzyn/dsh-plugin-kit) [![npm 30d 5,213](https://img.shields.io/static/v1?label=npm+30d&message=5%2C213&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@hyzyn/dsh-tty) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@hyzyn/dsh-tty)
<!-- END META -->

> **功能**：在 DSH Web 提供真实 PTY、SSH 终端与 Agent 读写工具，支持文件传输、转发及可选模型解释。

> **亮点**：已有贡献是将可见PTY现场与Agent工具、命令边界及取消/超时状态连接，减少抓屏猜测并保留人工接管；没有证明净协作收益或比外部终端更安全，见[Q01](#research-q01)和[Q02](#research-q02)。

> **主要限制**：Agent档位闸依宿主服务且不覆盖Web终端，ProxyCommand授权也只管该入口；取消等待后命令仍活且Agent会话不走孤儿回收，需要明确收尾责任，见[Q03](#research-q03)和[Q04](#research-q04)。

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
  - [Q01 · 人与Agent共享终端相对外部终端和bash增量在哪？](#detail-section-11)
  - [Q02 · 执行与命令完成如何判断？](#detail-section-12)
  - [Q03 · 权限档位是否约束全部执行面？](#detail-section-13)
  - [Q04 · 隐藏、归属、断线和持久化怎样生效？](#detail-section-14)
  - [Q05 · SSH、传输和隧道有哪些副作用？](#detail-section-15)
  - [Q06 · AI解释外发什么、能否自动执行？](#detail-section-16)
  - [Q07 · 全周期成本与最小采用怎样判断？](#detail-section-17)
  - [Q08 · 什么改进值得验证？](#detail-section-18)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要同一长驻服务、TUI或SSH现场的人Agent交接，可用共享可见终端减少上下文搬运；合格交付要交代命令完成与仍活进程责任，见[Q01](#research-q01)。

外部终端、OpenSSH/tmux与受既有沙箱约束的bash是现成替代。只有需要用户可见/可接管或交互会话时，共享PTY才有额外交接价值。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
| --- | --- | --- |
| 可见PTY | 人Agent交接TUI和长任务 | 非OS沙箱，未知状态不当空闲 |
| 命令工具 | run/expect/capture/screen | 取消不杀命令，输出有界 |
| SSH与传输 | 远程shell及实际文件变更 | TOFU首次自动信任，删除不可恢复 |
| 隧道 | 独立本地/远程转发 | 启动异步，配置回写可失败 |
| 模型解释 | 现场压缩并建议命令 | 可选外发，有限脱敏，填入仍需核现场 |

**流程与依赖**

#### 启动与依赖

| 条件 | 必需性 | 用途 | 缺失边界 |
| --- | --- | --- | --- |
| Node>=22.19、兼容DSH Web、subprocess/PTY | 本地终端必需 | 真实shell与视图 | 内部PTY适配需验收 |
| 可信本机浏览器/宿主权限 | 必需 | WS/HTTP执行面 | 同源不是多租户或OS沙箱 |
| sandboxPolicy/approval及事件接线 | Agent确认层必需 | 逐调用档位决策 | 缺sandboxPolicy放行，不约束Web终端 |
| shell标记与可选tmux | 边界/持久化条件 | 命令状态与重连 | 未知不当空闲，tmux不可用降级 |
| 可信SSH指纹/账号、网络 | 远程可选 | SSH/SFTP/转发 | TOFU首次自动信任，远端权限实际生效 |
| 模型路由、预算与可外发现场 | AI解释可选 | 压缩现场解释 | 正则脱敏不保证无秘密 |

#### 验证流程

| 步骤 | 动作 | 判据/退路 |
| --- | --- | --- |
| 准备 | 可重置非关键环境，AI关，不配生产连接 | 核宿主服务与凭据边界 |
| 读取 | 列会话、查capture/screen | 区分运行/结束/未知 |
| 执行 | 仅已知可结束命令，测试取消后留活 | 查sid真实状态，不重复发命令 |
| 恢复 | 重连/接管再显式关闭 | 分别查PTY、tmux与隧道 |
| 退出 | 停转发、结束会话并核配置 | 回外部终端与原bash |

**效果与成本**

#### 成本

| 阶段 | 现金/资源 | 人工责任 | 未知 |
| --- | --- | --- | --- |
| 首次 | PTY与依赖安装资源，可选主机/模型 | 宿主权限、指纹、shell/tmux配置 | 耗时金额未知 |
| 持续 | 活PTY/SSH、屏缓冲、采集/隧道、每轮会话上下文 | 接管及凭据维护 | 峰值和净节时未知 |
| 可选解释 | 宿主LLM请求 | 判断外发与审查修复命令 | 价格、token与正确率未测 |
| 恢复退出 | 仍活命令、tmux、传输残留资源 | 显式收尾及核配置 | 关闭网页不等于清理完成 |

#### 效果

| 效果 | 当前支持 | 未证实 |
| --- | --- | --- |
| 人Agent交接 | 共用可见现场及广播 | 真实交接错误减少 |
| 命令取证 | 边界/退出码/未知状态 | 业务成功或不可伪造审计 |
| 远程管理 | SSH/SFTP/隧道链路 | 权限隔离及生产恢复 |
| 解释 | 有界现场和不回车填入 | 脱敏完整、修复正确和省钱 |

> **思考**：Agent档位闸依宿主服务且不覆盖Web终端，ProxyCommand授权也只管该入口；取消等待后命令仍活且Agent会话不走孤儿回收，需要明确收尾责任，见[Q03](#research-q03)和[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：已有贡献是将可见PTY现场与Agent工具、命令边界及取消/超时状态连接，减少抓屏猜测并保留人工接管；没有证明净协作收益或比外部终端更安全，见[Q01](#research-q01)和[Q02](#research-q02)。

三态与进程done区分调用生命周期值得借鉴，隐藏标签在列表和按sid读取均有实现。但角色owner不是主体隔离，Agent活会话不走孤儿回收；隧道运行与异步配置回写非事务，见[Q02](#research-q02)、[Q04](#research-q04)和[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

Agent档位闸依宿主服务且不覆盖Web终端，ProxyCommand授权也只管该入口；取消等待后命令仍活且Agent会话不走孤儿回收，需要明确收尾责任，见[Q03](#research-q03)和[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，在可重置非关键环境核对档位服务、未知状态、取消留活及显式清理；AI关闭且不配生产连接。出现权限缺席、跨主体看/关或无人负责残留进程时停止，回外部终端和既有bash，见[Q07](#research-q07)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

共享PTY、档位事件、远程副作用与留活机制有静态证据；宿主权限/隔离/恢复与协作收益未实测，采用仍观察。租约是未验证设计。

- 已检查：作者 README、包清单、源码路径 packages/tty/README.md、packages/tty/package.json、packages/tty/src/index.ts、packages/tty/src/ssh.ts、packages/tty/src/sftp.ts、packages/tty/src/tunnels.ts、packages/tty/src/assist.ts、packages/tty/client-src/index.js、packages/kit/src/tier-gate.ts 及固定范围 inventory；组件：packages/tty。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：INVENTORY覆盖子包；独立定向核查PTY创建/WS、Agent工具分类与共享tier-gate、状态/取消/隐藏/owner/回收、SSH主机key策略、SFTP删除/上传、隧道启停与持久化、AI外发和填入。未逐行审计所有传输任务、SSH跳板/代理实现、全部平台和UI分支。保存必要共享kit原文，不从Docker结论导入。
- 下一步：- 固定源码检查，不执行目标、安装、命令或模型。
- 未跑宿主、跨主体隔离、性能、断线和生产恢复。
- 通道权限差异、取消留活与异步持久化是静态证据，未声称已利用。
- 脱敏和不回车不等于建议安全，完整费用与用户收益未知。

**分析版本**

- **仓库**：[hyzyn/dsh-plugin-kit](https://github.com/hyzyn/dsh-plugin-kit)
- **版本号**：0.38.0（[固定提交 44554d7](https://github.com/hyzyn/dsh-plugin-kit/tree/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是为长命令记录创建主体、接管与可撤销租约，将取消后的待收尾状态显式交付；须比较残留减少与误杀/维护负担，不自动取消就杀进程，见[Q08](#research-q08)。

- 固定源码检查，不执行目标、安装、命令或模型。
- 未跑宿主、跨主体隔离、性能、断线和生产恢复。
- 通道权限差异、取消留活与异步持久化是静态证据，未声称已利用。
- 脱敏和不回车不等于建议安全，完整费用与用户收益未知。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 38 | 38099 | 28004 | 9420 | — |
| .md | source | 4 | 4292 | — | — | 104033 |
| .mjs | source | 21 | 6444 | 4943 | 1196 | — |
| .cjs | source | 1 | 123 | 88 | 26 | — |
| .ts | source | 14 | 14880 | 9883 | 4446 | — |
| .ts | test | 74 | 16046 | 12119 | 2588 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/hyzyn/dsh-plugin-kit/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=9&color=737b86&logo=github)](https://github.com/hyzyn/dsh-plugin-kit/issues?q=is%3Aissue+created%3A2026-10-07T02%3A09%3A31.809Z..2026-11-06T02%3A09%3A31.809Z) [![近30天关闭 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=9&color=737b86&logo=github)](https://github.com/hyzyn/dsh-plugin-kit/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T02%3A09%3A31.809Z..2026-11-06T02%3A09%3A31.809Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：可见共享终端怎样让人和Agent交接执行，哪些权限、恢复及内容边界限制采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 人与Agent共享终端相对外部终端和bash增量在哪？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

当用户要在同一个长驻服务、交互TUI或SSH现场接管Agent操作时，外部终端和单次bash输出需要额外搬运上下文。组件把真实PTY、Web标签和Agent读写工具指向同一会话，Agent创建会话会广播给面板，用户可以看到并接管。命令型短任务用tty_run把开/等/读/关合成一次交付；没有交互或用户接管需要的普通命令，作者也明确建议直接用bash。合格交付不是“终端出现”，而是明确命令是否结束、结果来自哪条命令、谁负责仍存活的进程。

差异是可见执行与命令边界/状态组织，PTY、SSH、tmux与SFTP来自成熟上游，不是自行发明远程执行。没有真实协作对照，不能推断它比外部终端更安全或净节时；可见性也不能替代权限。

#### 证据与依据

**依据 1 · 作者声明**：[packages/tty/README.md:5-14](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/README.md#L5-L14)

作者描述真实PTY与共享工具。

<details>
<summary>查看原文（10行）</summary>

```text
> DSH 侧边栏「终端」面板：xterm.js + **真实 PTY** 的完整终端，本地与 SSH 一视同仁，长任务可断线保活。

## 特性

- **真 PTY + WebGL 渲染**：node-pty 真实 PTY，vim / htop / dev server 等 TUI 均可运行；多标签页。
- **可选 tmux 会话持久化**：宿主重启 / 网络抖动后重开即恢复现场；docker exec 这类「命令标签」自动重开。
- **ssh2 原生连接**：agent forwarding + 主机指纹 TOFU 钉扎，连接簿统一管理；另有 **SFTP** 上传下载与 **端口转发**（-L / -R，断线自动重连）。
- **agent 侧按「命令」粒度取数**：shell 集成（OSC 133/7）让 `tty_capture{last}` / `tty_expect` 拿到「上一条命令」的输出与退出码，而不是抓屏猜；`tty_list` 直接报**有没有命令在跑**（`running` 三态），`tty_run` 一条命令一次调用拿回输出与退出码。
- **对其它插件开放客户端服务**：`ttyConnbar`（连接栏动作）、`ttyTerminal`（就地开终端）与 `ttyPanel`（面板内挂载位）；dsh-docker 的「容器 / 终端」按钮即走这些扩展点。
- **AI 辅助「失败即解释」（0.24.0，默认关）**：命令非零退出时右下角浮出徽标，点它才把**那条命令的输出尾部**（清洗 / 截断 / 密钥遮盖后）连同当前屏幕发给模型，换回「发生了什么 / 下一步」；模型给的命令只**填入**命令行、永不替你回车。见 [AI 辅助](#ai-辅助失败即解释0240默认关)。
```

</details>

**依据 2 · 源码核查**：[packages/tty/src/index.ts:3315-3340](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/src/index.ts#L3315-L3340)

Agent创建后广播同会话。

<details>
<summary>查看原文（26行）</summary>

```text
    // 同 persistName 已有存活会话：直接复用（跨窗口共享同语义），不新建 PTY
    if (persistName !== null) {
      const existing = this.sessions.findByTmuxName(persistName)
      if (existing !== undefined) return { sid: existing.id, persist: true }
    }
    const { session, degraded } = await this.createLocalSession({
      sid,
      cols: input.cols,
      rows: input.rows,
      cwd,
      command,
      persistName,
      client: null, // agent 路径：无客户端
      local: new Map(),
      owner: 'agent',
      hidden: false, // agent 自己开的会话没有隐藏自己的理由
    })
    // D72：agent 自己开的会话从出生起「什么都没读过」（水位线落在 seq 0）——
    // 包括 `command` 型会话在第一次 expect 之前打印的启动输出。用户开的标签
    // 相反：历史输出不算未读，首次被 agent 触达时才把水位线落在当下。
    ensureReadMark(session)
    // 面板可见性：新会话推给所有已连接的面板（客户端据此建「agent 开的」标签）
    this.broadcastSessions()
    return { sid: session.id, persist: session.tmuxName !== null && !degraded }
  }

```

</details>

**依据 3 · 源码核查**：[packages/tty/src/index.ts:6327-6340](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/src/index.ts#L6327-L6340)

tty_run场景与非交互bash替代。

<details>
<summary>查看原文（14行）</summary>

```text
          activeDisposers.push(registerTool(defineTool({
            name: 'tty_run',
            description: '**一次性命令**：开一个终端会话跑 `command`，等它结束，直接返回尾部输出 + 退出码（会话出现在用户面板里、可见可接管）——把「tty_open → 等 → tty_capture{last} → tty_close」四步压成一次调用。命令**跑完就结束**：默认把这个会话关掉（结果已在本调用返回），`keep:true` 则留在「只读保留」态供回看。到 `timeoutSec` 还没结束会返回 `running:true`（会话照旧在跑，**杀不杀由你决定**），接着用 tty_expect / tty_capture 看，或 tty_close 关掉。何时用它而不是 bash 工具：需要用户**看得见**这条命令、或要跑在终端会话里（同一套 PTY / 会话名额 / 后续可接管）时用它；纯非交互、不需要用户看见的命令用 bash 工具更直接。`command` 按宿主 shell 的语法整段执行（POSIX 上 `cd x && cmd`、多行脚本都可以；Windows 的 cmd / PowerShell 按它们自己的语法）。',
            parameters: {
              command: { type: 'string', required: true, description: '要执行的命令（整段 shell 代码，支持 `cd x && cmd`、管道、多行脚本）' },
              cwd: { type: 'string', description: '工作目录（必须是已存在的绝对路径）；缺省用插件配置的 cwd' },
              timeoutSec: { type: 'number', description: '等待命令结束的上限秒数（1~600，默认 120）；到点没结束返回 running:true，会话不会被杀' },
              keep: { type: 'boolean', description: 'true = 跑完留在只读保留态（可回看/接管）；默认 false = 跑完即关（结果已在本调用返回）' },
              lines: { type: 'number', description: '返回的输出尾部行数（1~500，默认 60）' },
              cols: { type: 'number', description: '列数（2~500，默认 80）' },
              rows: { type: 'number', description: '行数（2~200，默认 24）' },
            },
            output: {
              schema: {
```

</details>

#### 缺口

- 没有人Agent交接任务的效果对照。
  **影响**：净协作收益未知。
  **进一步探讨**：用长驻开发任务与外部终端比较交接错误、总时间和残留进程。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 执行与命令完成如何判断？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

浏览器spawn经WS进入createLocalSession，共用工厂调用宿主subprocess.spawnTerminal，命令模式走shell代码计划，之后透传input/resize和输出。tty_run按进程done而不是屏幕提示符等完成，默认等待120秒（上限600）；超时或调用取消返回running:true并留会话继续运行，只有正常结束且未keep才显式关闭。因此调用结束/取消绝不能当命令已经停止，重试前要先查sid。

交互shell靠OSC标记解析命令边界与cwd；running有真/假/未知，SSH无标记、tmux刚接回或不支持shell时未知，不是假。命令型进程活着则running:true。输出尾部/屏幕都受截断，成功退出码不能证明业务任务完成；Windows PowerShell解析错误退出口径仍需看输出。tty_capture last只在可信命令边界下使用，不应把上一条结果当这次。该设计减少抓屏猜测，但标记与输出是终端现场，不是独立不可伪造执行审计。

#### 证据与依据

**依据 1 · 源码核查**：[packages/tty/src/index.ts:3474-3507](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/src/index.ts#L3474-L3507)

工厂实际调用spawnTerminal。

<details>
<summary>查看原文（34行）</summary>

```text
    const { sid, cols, rows, cwd, command, persistName, client, local, owner, hidden } = input
    const subprocess = (this.ctx as unknown as { get(name: string): { spawnTerminal(spec: unknown): Promise<PtyHandle> } | undefined }).get('subprocess')
    if (subprocess === undefined) throw new Error('subprocess 服务不可用')
    const wantsPersist = persistName !== null
    let spawnPlan = command !== null
      ? buildCommandSpawn(this.options.shell, this.options.term, this.options.colorTerm, command)
      : buildShellSpawn(this.options.shell, this.options.term, this.options.colorTerm, this.options.shellIntegration)
    let tmuxName: string | null = null
    let degraded = false
    /** 降级原因：探测**超时**（机器忙）还是确定没装——提示文案必须分开（D80）。 */
    let degradedInconclusive = false
    if (wantsPersist) {
      const probe = await probeTmux()
      if (probe.available) {
        tmuxName = persistName
        ensureTmuxAssets({ shell: this.options.shell, colorTerm: this.options.colorTerm, shellIntegration: this.options.shellIntegration, passthrough: probe.passthrough })
        spawnPlan = buildTmuxSpawnPlan({ shell: this.options.shell, term: this.options.term, colorTerm: this.options.colorTerm, tmuxName })
      } else {
        degraded = true // 降级普通会话，由调用方给灰字提示；原因（超时/没装）一并带出去
        degradedInconclusive = probe.inconclusive === true
      }
    }
    const create = (async (): Promise<TtySession> => {
      const handle = wrapLocalPty(await subprocess.spawnTerminal({
        argv: spawnPlan.argv,
        rows: clampInt(rows, 24, 2, 200),
        cols: clampInt(cols, 80, 2, 500),
        cwd,
        env: { TERM: this.options.term, COLORTERM: this.options.colorTerm, ...spawnPlan.env },
        graceMs: 5000,
      }))
      if (tmuxName !== null) {
        handle.tmuxTeardown = () => killTmuxSession(tmuxName)
        handle.tmuxRefresh = () => refreshTmuxClient(tmuxName)
```

</details>

**依据 2 · 源码核查**：[packages/tty/src/index.ts:1373-1438](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/src/index.ts#L1373-L1438)

三态来源与确定性进程判据。

<details>
<summary>查看原文（66行）</summary>

```text
export type RunningUnknownReason = 'ssh' | 'tmux-attach' | 'no-integration'

/**
 * 未知成因的**用户可见短句**：`tty_list` 的渲染与每轮 systemPrompt 的会话块**共用这一处**
 * （两处各写一遍必然漂——D88 的教训就是三态在文本里糊成了两种）。
 * 每句都带**下一步动作**：只说「不知道」等于把问题丢回给 agent。
 */
export function runningUnknownNote(reason: RunningUnknownReason): string {
  switch (reason) {
    case 'ssh':
      return 'SSH 会话没有命令边界标记（远端 shell 不受本插件控制），发命令前先 tty_capture 看提示符'
    case 'tmux-attach':
      return 'tmux 接回的会话还没跑过命令（接回重绘不带标记），发命令前先 tty_capture 看提示符；跑完一条命令即恢复'
    case 'no-integration':
      return 'shell 没注入命令边界标记（不受支持的 shell 或「shell 集成」被关掉），发命令前先 tty_capture 看提示符'
  }
}

/**
 * 没有命令边界标记时，**为什么**没有（D105）。
 *
 * 判据只看会话自身的事实（kind / 是不是 tmux 托管），不看配置：配置在会话建立之后热改过，
 * 拿它解释一条早就存在的会话只会给出错误原因。
 */
export function runningUnknownReasonOf(session: { kind: 'local' | 'ssh'; tmuxName: string | null }): RunningUnknownReason {
  if (session.kind === 'ssh') return 'ssh'
  if (session.tmuxName !== null) return 'tmux-attach'
  return 'no-integration'
}

/**
 * 「这个会话有没有命令在跑」的判据（0.23.0，tty_list 的 `running`）。
 *
 * 三态是刻意的：`running` **省略**表示这个会话根本没有可信的命令边界（没见过
 * OSC 133 标记），而**不是**「没在跑」。把未知报成 false 会让 agent 往一个正在
 * 跑的程序里塞命令——往 vim / apt / less 的交互提示里打字，那些字节被当输入吃掉，
 * 是要等下一次 expect 超时才发现的静默事故。
 *
 * 两条不依赖 shell 集成的确定性判据：
 *   - 进程已退出 → 没在跑（false）；
 *   - **命令型会话**（`tty_open command=` / `tty_run` / SSH 的 exec 标签）的进程
 *     **就是**那条命令 → 活着就等于在跑（true）。这里刻意不看 inCommand：命令型
 *     会话不注入 shell 集成钩子，D 标记永远不会来。
 *
 * 未知态额外带出**成因**（D105）：同一句「未知」在 SSH 会话上是永久事实、在 tmux 接回的
 * 会话上只是「还没跑过第一条命令」，前者别让 agent 等、后者值得等。
 */
function runningOf(session: TtySession): { running?: boolean; lastExitCode?: number; lastExitAt?: number; runningUnknown?: RunningUnknownReason } {
  const state = session.shellState
  const last = state.lastCommand
  // 「上一条已完成命令」只在标记可信时说（否则 lastCommand 永远是 null，
  // 本来也不会进这条分支；sawMark 是给「标记中途失效」留的守卫）
  const lastInfo = last === null || !state.sawMark
    ? {}
    : {
        ...(last.exitCode === null ? {} : { lastExitCode: last.exitCode }),
        lastExitAt: last.endedAt,
      }
  if (session.exited !== null) return { running: false, ...lastInfo }
  if (session.commandSession) return { running: true, ...lastInfo }
  if (!state.sawMark) return { runningUnknown: runningUnknownReasonOf(session), ...lastInfo }
  return { running: state.inCommand, ...lastInfo }
}

/**
 * 等一个命令型会话的进程结束（tty_run 用；超时 / 被调用方取消都不抛错、不杀会话）。
```

</details>

**依据 3 · 源码核查**：[packages/tty/src/index.ts:6373-6420](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/src/index.ts#L6373-L6420)

run等待、取消/超时留活与正常关闭。

<details>
<summary>查看原文（48行）</summary>

```text
            async execute(args: unknown, exec?: { signal?: AbortSignal }): Promise<{ sid: string; running: boolean; tail: string; closed: boolean; exitCode?: number; signal?: string; cancelled?: boolean }> {
              const input = args as { command?: unknown; cwd?: unknown; timeoutSec?: unknown; keep?: unknown; lines?: unknown; cols?: unknown; rows?: unknown }
              if (typeof input.command !== 'string' || input.command.trim() === '') throw new Error('command 必须是非空字符串')
              const timeoutSec = clampInt(input.timeoutSec, 120, 1, 600)
              const lines = clampInt(input.lines, 60, 1, 500)
              const opened = await server.openAgentSession({
                command: input.command,
                ...(typeof input.cwd === 'string' && input.cwd.trim() !== '' ? { cwd: input.cwd } : {}),
                cols: input.cols,
                rows: input.rows,
              })
              const session = sessions.get(opened.sid)
              if (session === undefined || session.closed) throw new Error(`会话创建后立刻退役了: ${opened.sid}`)
              // 命令型会话的进程**就是**那条命令（D78 的 exec 链）：进程退出 = 命令结束，
              // 与 shell 集成无关（这类会话不注入钩子，等 133;D 是等不到的）
              const finished = await waitForSessionExit(session, timeoutSec * 1000, exec?.signal)
              const tail = cleanAnsiTail(tailLines(session, lines))
              /*
               * 到点 / 被取消 → 都为 `running: true`，而且**都不关会话**。
               *
               * 「取消」这一档是刻意的：`exec.signal` 取消的是**这次工具调用**，不是那条命令——
               * 关掉会话等于「因为调用方不等了，就把人家跑着的构建杀了」。决定权交回调用方
               * （tty_close / 发送 C-c），与 `timeoutSec` 到点那条路同一处置。
               */
              if (finished !== 'exited') {
                return {
                  sid: opened.sid,
                  running: true,
                  closed: false,
                  tail,
                  ...(finished === 'cancelled' ? { cancelled: true } : {}),
                }
              }
              const exited = session.exited
              const result = {
                sid: opened.sid,
                running: false,
                tail,
                closed: false,
                ...(exited === null || exited.code === null ? {} : { exitCode: exited.code }),
                ...(exited === null || exited.signal === null || exited.signal === '' ? {} : { signal: exited.signal }),
              }
              // keep 默认 false：这条通道的语义就是「一条命令一次调用」，留着会占满
              // 只读保留的名额（16 条）；要回看现场就显式 keep:true
              if (input.keep === true) return result
              await server.closeAgentSession(opened.sid)
              return { ...result, closed: true }
            },
```

</details>

**依据 4 · 源码核查**：[packages/tty/src/index.ts:6563-6599](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/src/index.ts#L6563-L6599)

capture按边界拒绝不适用last。

<details>
<summary>查看原文（37行）</summary>

```text
            async execute(args: unknown): Promise<{ sid: string; tail: string; source?: string; exitCode?: number; inProgress?: boolean; exited?: boolean; signal?: string }> {
              const input = args as { sid?: unknown; lines?: unknown; last?: unknown; raw?: unknown }
              if (typeof input.sid !== 'string' || input.sid === '') throw new Error('sid 必须是非空字符串')
              const session = sessions.agentView(input.sid)
              if (session === undefined || session.closed) throw new Error(`会话不存在或已退出: ${input.sid}`)
              const useRaw = input.raw === true
              // D77：只读保留态的标记（读得到，但要如实告诉 agent 这是已退出会话的输出）
              const exitMark = session.exited === null
                ? {}
                : { exited: true as const, ...(session.exited.signal === null || session.exited.signal === '' ? {} : { signal: session.exited.signal }) }
              // D72：读侧工具返回前推进水位线——这里读到的内容算「已读」，后续
              // tty_expect 不再把它们当未读回扫（想回看更早的内容再用本工具）。
              // tty_screen 刻意**不**推进：它是「当前可见屏幕」这一种表示，不是
              // 文本流，推进它会把 AI 从未在文本里看过的输出标记成已读。
              advanceReadMark(session)
              if (input.last === true) {
                const state = session.shellState
                const last = state.lastCommand
                // 在途判定（0.19.0）：①命令的 D 标记未到（inCommand）；②D 到了但
                // 之后又有 PTY 输入（新命令刚发、B 标记还在路上）。lastCommand
                // 此时是上一条的旧结果——形状正常却答非所问，必须显式标出来，
                // 否则 agent 拿旧结果当本次结果用（静默错数据）。
                if (state.inCommand || (last !== null && last.endedAt < session.lastInputAt)) {
                  return { sid: input.sid, source: 'last', inProgress: true, tail: '' }
                }
                // D87：命令型会话（`tty_open command=` / `tty_run`）**不注入 shell 集成钩子**，
                // 它们根本没有「上一条命令」这个概念——旧文案把用户指向「shell 不受支持 /
                // 集成被配置关闭」，方向完全反了（用户会去翻设置卡片找一个不存在的开关）。
                // 这类会话的**整条输出就是那条命令的输出**，要的是尾部读取。
                if (session.commandSession) {
                  throw new Error(`会话 ${input.sid} 是命令型会话（tty_open 的 command= / tty_run）：**整条输出就是那条命令的输出**，没有「上一条命令」这个概念（这类会话不注入 shell 集成钩子）。用不带 last 的尾部读取（lines，默认 60 行）或 tty_screen 拿结果`)
                }
                if (last === null) {
                  throw new Error('暂无「上一条命令」记录（shell 集成未生效——shell 不受支持或被配置关闭——或尚未执行过命令）；可改用 lines 读尾部')
                }
                // 保尾截断：last.output 本身已是环形保尾（COMMAND_CAP），这里再
                // 收一刀也保尾——最近输出才是 agent 要的。
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 权限档位是否约束全部执行面？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

不能一概而论。Agent工具注册后attachTierGate订阅tools/pre-execute；tty_open/run/send和tunnel_start归exec，SFTP改写与tunnel_stop归write，读类及仅能关Agent标签的tty_close归read。共享决策在有sandboxPolicy服务、受限档且非Auto时才按approval ask/deny，完全权限与Auto放行；sandboxPolicy缺席直接allow，分类缺漏或档位解析异常也沿旧行为放行。它是工具调用确认层，不是PTY的OS文件/网络沙箱，工作区修改档一次批准后shell仍可执行无界命令。

Web终端是另一通道：WS经过本机/同源握手后spawn直接调用同工厂，不经过Agent工具档位事件；HTTP变更要求同源证明也不是逐命令批准。ProxyCommand的宿主授权+插件开关只控制代理命令传输，不禁用普通本地shell、SSH、SFTP和隧道。故“只读Agent”或“关闭ProxyCommand”都不能称整个部署只读；可信浏览器、宿主权限及网络暴露边界是采用前提。本轮只确认静态接线，没有攻击复现或判成已利用漏洞。

#### 证据与依据

**依据 1 · 源码核查**：[packages/tty/src/index.ts:392-420](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/src/index.ts#L392-L420)

工具分类表。

<details>
<summary>查看原文（29行）</summary>

```text
export const TTY_TIER_CLASS: Record<string, TierClass> = {
  tty_list: 'read',
  // 只回 name / host / port / username / auth（拓扑与认证**方式**）：一个凭据值都不出来。
  // 必须是 read 类——只读档（唯一会裁工具面的那一档，2026-11-05 起）里它是 agent 唯一能把
  // `book` 参数猜对的入口；被裁掉就等于把 agent 推回「翻含明文密码的配置文件」那条路（D104）。
  tty_books: 'read',
  tty_capture: 'read',
  tty_screen: 'read',
  tty_expect: 'read',
  tty_stats: 'read',
  tunnel_list: 'read',
  sftp_list: 'read',
  sftp_read: 'read',
  sftp_tree: 'read',
  tty_close: 'read',
  sftp_write: 'write',
  sftp_mkdir: 'write',
  sftp_rename: 'write',
  sftp_remove: 'write',
  tunnel_stop: 'write',
  tty_open: 'exec',
  tty_run: 'exec',
  tty_send: 'exec',
  tunnel_start: 'exec',
}

/** 本插件 agent 工具的名单前缀（档位闸只听这些名字，bash / 其它插件工具零介入）。 */
export const TTY_TIER_PREFIXES = ['tty_', 'sftp_', 'tunnel_'] as const

```

</details>

**依据 2 · 源码核查**：[packages/tty/src/index.ts:7389-7418](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/src/index.ts#L7389-L7418)

挂逐调用闸和Agent工具裁剪。

<details>
<summary>查看原文（30行）</summary>

```text
          }
          // 档位闸与工具同生命周期：enabled 热切换撤工具时一并撤下（activeDisposers 统一管理）。
          activeDisposers.push(attachTierGate(ctx, {
            pkg: 'tty',
            prefixes: TTY_TIER_PREFIXES,
            classify: (tool) => TTY_TIER_CLASS[tool],
          }))
          stateRef.toolsRegistered = true
          // 这行是**能力全集**（所有可能注册的工具名，档位闸的分类对账从它取数），不是本次真注册集——
          // 运行期真注册集取决于 live.sshHosts / live.tunnels（见上面两处条件注册），下一行才是实况。
          console.log('[dsh-tty] agent tools registered (tty_list, tty_books, tty_open, tty_close, tty_run, tty_stats, tty_capture, tty_screen, tty_expect, tty_send, tunnel_list, tunnel_start, tunnel_stop, sftp_list, sftp_read, sftp_write, sftp_mkdir, sftp_rename, sftp_remove, sftp_tree)')
          console.log(`[dsh-tty] agent tools active (${registeredNames.join(', ')})`)
        }
        refreshToolsHook = registerAll
        registerAll()
        /*
         * 按会话档位在 **agent 作用域**上裁掉用不到的 write / exec 工具（试点，见 tier-restrict.ts）。
         *
         * 刻意放在 effect 体里、**不放进 registerAll**：热应用设置会重注册工具（先撤后挂），
         * 而重注册不该把已有 agent 的裁剪一并撤掉——`agent/created` 不会为老 agent 再发一次，
         * 撤了就再也裁不回来。与工具同生命周期的是**这一层订阅**，随插件卸载一起撤。
         */
        const disposeTierRestrict = attachTierRestrict(ctx, {
          pkg: 'tty',
          prefixes: TTY_TIER_PREFIXES,
          classify: (tool) => TTY_TIER_CLASS[tool],
        })
        return () => {
          stateRef.toolsRegistered = false
          refreshToolsHook = () => {}
```

</details>

**依据 3 · 源码核查**：[packages/kit/src/tier-gate.ts:155-163](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/kit/src/tier-gate.ts#L155-L163)

决策矩阵及缺sandbox服务放行。

```text
export function decideTierCall(tier: TierContext, cls: TierClass, tool: string): TierDecision {
  if (!tier.services.sandboxPolicy) return { action: 'allow' }
  if (tier.auto) return { action: 'allow' }
  if (tier.mode === 'danger-full-access') return { action: 'allow' }
  if (cls === 'read') return { action: 'allow' }
  if (tier.policy === 'ask') {
    return { action: 'ask', reason: tierAskReason({ tool, mode: tier.mode }) }
  }
  return { action: 'deny', reason: tierDenialReason({ tool, mode: tier.mode, policy: tier.policy, cls }) }
```

**依据 4 · 源码核查**：[packages/kit/src/tier-gate.ts:263-305](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/kit/src/tier-gate.ts#L263-L305)

分类异常/解析异常放行及事件订阅。

<details>
<summary>查看原文（43行）</summary>

```text
    const name = typeof call?.name === 'string' ? call.name : undefined
    if (name === undefined || !options.prefixes.some((prefix) => name.startsWith(prefix))) return next()

    let cls: TierClass | undefined
    try {
      cls = options.classify(name, call?.args)
    } catch {
      cls = undefined
    }
    if (cls === undefined) {
      if (!warnedUnclassified.has(name)) {
        warnedUnclassified.add(name)
        log(`tier-gate: 工具 ${name} 不在分类表里，按现状放行（分类表对账的守卫测试会红）`)
      }
      return next()
    }

    let tier: TierContext
    try {
      tier = resolveSessionTier(snapshot, call?.agent?.session)
    } catch (error) {
      log(`tier-gate: 档位解析失败（${error instanceof Error ? error.message : String(error)}），按现状放行`)
      return next()
    }

    const decision = decideTierCall(tier, cls, name)
    if (decision.action === 'allow') return next()
    if (decision.action === 'deny') {
      log(`tier-gate: deny tool=${name} mode=${tier.mode} policy=${tier.policy}`)
      return { kind: 'deny', reason: decision.reason }
    }
    return { kind: 'ask', reason: decision.reason }
  }

  const owner = ctx as unknown as { on?(name: string, listener: unknown): unknown }
  if (typeof owner.on !== 'function') {
    log('tier-gate: ctx.on 不可用，逐调用闸未挂载')
    return () => {}
  }
  const dispose = owner.on('tools/pre-execute', listener)
  disposers.push(typeof dispose === 'function' ? (dispose as () => void) : () => {})
  return () => {
    for (const fn of disposers.splice(0)) {
```

</details>

**依据 5 · 源码核查**：[packages/tty/src/index.ts:3111-3140](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/src/index.ts#L3111-L3140)

WS独立握手。

<details>
<summary>查看原文（30行）</summary>

```text
  /** registerUpgrade 的 handler（loopback 围栏 + ws 握手）。 */
  handleUpgrade(req: ReqLike, socket: SocketLike, head: Buffer): void {
    const loopback = isLoopbackUpgrade(req)
    // 字面量环回同步判定（绝大多数请求：握手第一拍就继续，不引入额外时序）；
    // 只有主机名 / /etc/hosts 别名才等一次 DNS 确认（≤500ms），期间不碰 socket
    if (loopback instanceof Promise) {
      void loopback.then((ok) => {
        if (ok) this.finishUpgrade(req, socket, head)
        else socket.destroy()
      }).catch(() => { socket.destroy() })
      return
    }
    if (!loopback) {
      socket.destroy()
      return
    }
    this.finishUpgrade(req, socket, head)
  }

  /** 围栏放行之后的实际握手（与上面的异步分支共用）。 */
  private finishUpgrade(req: ReqLike, socket: SocketLike, head: Buffer): void {
    if (!this.wsGateOpen) {
      socket.destroy()
      return
    }
    this.wss.handleUpgrade(req as never, socket as never, head, (ws) => {
      this.wss.emit('connection', ws, req)
    })
  }

```

</details>

**依据 6 · 源码核查**：[packages/tty/src/index.ts:3698-3730](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/src/index.ts#L3698-L3730)

WS用户spawn直接工厂。

<details>
<summary>查看原文（33行）</summary>

```text
            return
          }
        }
        if (!this.sessions.canSpawn()) {
          send(ws, { t: 'error', sid, m: `会话数已达上限（${this.sessions.limitValue}）——每个窗口的每个标签各占一个名额：关闭不用的窗口/标签，或在设置卡片调大「并发会话上限」` })
          return
        }
        // 客户端（当前会话）cwd 优先；校验存在性，避免 node-pty 抛难懂错误
        const cwd = typeof msg.cwd === 'string' && msg.cwd.trim() !== '' ? msg.cwd.trim() : this.options.cwd
        if (!existsSync(cwd)) {
          send(ws, { t: 'error', sid, m: `cwd 不存在: ${cwd}` })
          return
        }
        // 会话创建走共用工厂（与 agent tty_open 同一套）；用户开的标签带连接，
        // 立刻 ready + 收输出
        let created: { session: TtySession; wantsPersist: boolean; degraded: boolean; degradedInconclusive: boolean }
        try {
          created = await this.createLocalSession({
            sid,
            cols: msg.cols,
            rows: msg.rows,
            cwd,
            command,
            persistName,
            client: { ws, connId: conn.id },
            local,
            owner: 'user',
            hidden: msg.hidden === true,
          })
        } catch (error) {
          send(ws, { t: 'error', sid, m: error instanceof Error ? error.message : String(error) })
          return
        }
```

</details>

**依据 7 · 源码核查**：[packages/tty/src/index.ts:4582-4593](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/src/index.ts#L4582-L4593)

HTTP同源变更证明。

<details>
<summary>查看原文（12行）</summary>

```text
export async function gateRoute(req: ReqLike, res: ResLike, options?: { mutation?: boolean }): Promise<boolean> {
  if (!(await isLoopbackRequestStrict(req))) {
    writeJson(res, 403, { error: 'forbidden: loopback-only' })
    return false
  }
  if (options?.mutation === true && !hasSameOriginProof(req)) {
    writeJson(res, 403, { error: '缺少同源证明（需要 Origin 或 Sec-Fetch-Site: same-origin）：变更端点拒绝无来源请求' })
    return false
  }
  return true
}

```

</details>

**依据 8 · 源码核查**：[packages/tty/src/ssh.ts:850-858](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/src/ssh.ts#L850-L858)

ProxyCommand两层检查仅该入口。

```text
 *   5. **命令原文不进日志与错误文案**：它可能含凭据（如 `-i /path/key`），日志只写
 *      「已启动代理命令」与退出码。
 */
export async function dialProxyCommand(options: { spec: SshSpec; logger?: SshLogger }): Promise<ProxyCommandDial> {
  const raw = sanitizeProxyCommand(options.spec.proxyCommand)
  if (raw === undefined) throw new Error('代理命令为空（proxyCommand 需要一条非空的单行命令）')
  if (!proxyCommandGranted) throw new Error(PROXY_COMMAND_NOT_GRANTED)
  if (!proxyCommandEnabled) throw new Error(PROXY_COMMAND_DISABLED)
  const destination = sshTarget(options.spec)
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 隐藏、归属、断线和持久化怎样生效？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

用户隐藏标签后listForAgent与按sid的agentView拒绝访问，仍向网页面板提供完整attach快照；只报隐藏数量，不是彻底不透露存在。tty_close只查owner等于agent，保护用户标签，却没有记录哪个Agent/session创建；它是用户/Agent角色分类，不可当多Agent或多租户所有权隔离。全部会话表和广播在插件实例内共享，范围需结合宿主实例部署验收。

断线用户会话进入孤儿保活后可attach回放，Agent会话在出生时没有客户端，不走孤儿回收；tty_run超时/取消后尤其需显式收尾。已退出记录默认无限时保留但最多16条淘汰，不占活会话名额；活并发上限默认4。tmux可跨连接/宿主重开恢复，未安装会降级，持久会话与PTY客户端结束不是同一件事。不能把关网页、关闭调用或普通断线当远端工作已终止；退出验收要查实际标签、PTY、tmux和独立隧道。

#### 证据与依据

**依据 1 · 源码核查**：[packages/tty/src/index.ts:2674-2710](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/src/index.ts#L2674-L2710)

隐藏列表、按sid拒绝及面板全量attach。

<details>
<summary>查看原文（37行）</summary>

```text
  listForAgent(): SessionSnapshot[] {
    return [...this.sessions.values()]
      .filter((session) => !session.hiddenFromAgent)
      .map((session) => this.snapshotOf(session))
  }

  /** agent 侧按 sid 取会话（0.30.0）：隐藏会话与「不存在」**同样拒绝**，见 hiddenRefusal。 */
  agentView(sid: string): TtySession | undefined {
    const session = this.sessions.get(sid)
    if (session !== undefined && session.hiddenFromAgent) throw hiddenRefusal(sid)
    return session
  }

  /**
   * 被用户隐藏的会话条数（0.30.0）。
   *
   * 存在的意义是**别让模型把话说过头**：一条都不列之后，`listForAgent()` 为空会被读成
   * 「用户没开终端」，于是它可能回一句「当前没有终端面板会话」——而用户正盯着三个标签。
   * 只报条数、不报 cwd 与活动（要藏的正是后者）。这一位信息量极低（人人都有终端），
   * 换来的是模型不再因为「看不见」而误导用户。
   */
  hiddenCount(): number {
    let count = 0
    for (const session of this.sessions.values()) if (session.hiddenFromAgent) count += 1
    return count
  }

  /** sessions 帧用：额外带 attachable（孤儿且未关闭的会话可被新连接 attach）。 */
  listForAttach(): Array<SessionSnapshot & { attachable: boolean }> {
    return [...this.sessions.values()].map((session) => ({
      ...this.snapshotOf(session),
      // 只读保留态不可 attach（没有活着的 PTY 可接）：客户端据此不建幽灵标签
      attachable: session.clients.size === 0 && !session.closed && session.exited === null,
    }))
  }

  /** 遍历全部会话（状态条采集器的批量收尾等按会话维度的操作）。 */
```

</details>

**依据 2 · 源码核查**：[packages/tty/src/index.ts:3342-3357](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/src/index.ts#L3342-L3357)

close只检查角色owner=agent。

<details>
<summary>查看原文（16行）</summary>

```text
  async closeAgentSession(sid: string): Promise<{ ok: true }> {
    const session = this.sessions.get(sid)
    if (session === undefined || session.closed) throw new Error(`会话不存在或已结束: ${sid}`)
    if (session.owner !== 'agent') {
      throw new Error(`会话 ${sid} 是用户在面板里开的（owner=user）：请在面板里关闭那个标签，不要由 agent 越权结束`)
    }
    // D77：只读保留态（进程已退出）也走这条路——`killSessionNow` 对死句柄是安全的，
    // 它做的正是「退役 + 释放屏」。这也是 issue 里要的那个「显式关闭」入口。
    this.flushPendingOutput(session)
    this.killSessionNow(session)
    this.broadcastSessions()
    return { ok: true }
  }

  /**
   * 把当前会话清单推给所有已连接面板（agent 开关会话后让面板即时反映）。
```

</details>

**依据 3 · 源码核查**：[packages/tty/src/index.ts:2755-2809](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/src/index.ts#L2755-L2809)

Agent不参与孤儿回收、退出记录保留/上限。

<details>
<summary>查看原文（55行）</summary>

```text
   * 以后：已存在的孤儿会永久占 PTY 与名额，满额后新标签一直报「会话数已达上限」。
   *
   * agent 开的会话（owner:'agent'）不走这条：它从出生起就没有客户端，判据
   * 「orphanedAt !== null」对它要么永不成立（不回收）要么被误当孤儿（一开就收）。
   * 它的关闭入口是 agent 的 tty_close 或用户在面板里接管后关标签。
   */
  async reapOrphans(graceMs: number): Promise<TtySession[]> {
    const now = Date.now()
    /** 本轮真的被回收的会话——**返回值就是日志报数的来源**，别在调用方另数一遍。 */
    const reaped: TtySession[] = []
    for (const session of [...this.sessions.values()]) {
      if (session.owner === 'agent') continue
      // D77：只读保留态不归孤儿回收管——它可能本来就带着 orphanedAt（断线后
      // 才退出），被这里收掉就等于「退出即退役」，保留期形同虚设。它的到点
      // 退役由 reapExited 统一负责。
      if (session.exited !== null) continue
      if (session.orphanedAt === null) continue
      if (graceMs <= 0 || now - session.orphanedAt >= graceMs) {
        reaped.push(session)
        void this.destroy(session) // 后台收尾：terminate 最慢可达 ~20s，不阻塞回收器
      }
    }
    return reaped
  }

  /**
   * 只读保留到点退役（D77；回收器每轮调用）：超过保留期的会话出表 + 释放屏。
   *
   * 默认策略是 ∞（保留到显式关闭）⇒ 本方法是 no-op，条数由 `capExited` 兜；
   * 把 `EXITED_RETAIN_MS` 改成有限值它就照常工作（策略可调，通路留着）。
   *
   * **不 kill 进程**：这里收的全是已经退出的会话（进程早没了），`retire()` 就够；
   * 真退役（显式 `tty_close` / 面板关标签）走 `killSessionNow`，那条路要处理
   * tmux teardown 与 forceKill 的兜底。
   */
  reapExited(retainMs: number): void {
    const now = Date.now()
    for (const session of [...this.sessions.values()]) {
      if (session.exited === null) continue
      if (retainMs <= 0 || now - session.exited.at >= retainMs) this.retire(session)
    }
  }

  /**
   * 只读保留的数量上限（超出按最旧淘汰，D77）：返回被淘汰的会话，便于单测断言。
   *
   * 为什么必须有：`owner:'agent'` 的会话不会走孤儿回收，agent 若不显式 `tty_close`
   * （它常常不会），保留态就是**永久泄漏**——屏与 256KB 缓冲一直挂着。
   */
  capExited(max: number): TtySession[] {
    const exited = [...this.sessions.values()]
      .filter((session) => session.exited !== null)
      .sort((a, b) => (a.exited?.at ?? 0) - (b.exited?.at ?? 0))
    const victims = exited.slice(0, Math.max(0, exited.length - max))
    for (const session of victims) this.retire(session)
```

</details>

**依据 4 · 源码核查**：[packages/tty/src/index.ts:2595-2618](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/src/index.ts#L2595-L2618)

只计活会话并发。

<details>
<summary>查看原文（24行）</summary>

```text
  get liveCount(): number {
    let live = 0
    for (const session of this.sessions.values()) if (session.exited === null) live += 1
    return live
  }

  /** 只读保留的会话数（D77）。 */
  get exitedCount(): number {
    let exited = 0
    for (const session of this.sessions.values()) if (session.exited !== null) exited += 1
    return exited
  }

  /**
   * 名额判据**只数活着的会话**（D77）：只读保留的不占名额。不这样分的话，
   * 「跑几条短命令」就能把面板顶成「会话数已达上限」——用户一条会话都没开，
   * 比原来那个「AI 取不到结果」的缺陷更糟。
   */
  canSpawn(): boolean {
    return this.liveCount < this.limit
  }

  add(session: TtySession): void {
    this.sessions.set(session.id, session)
```

</details>

**依据 5 · 源码核查**：[packages/tty/src/index.ts:3485-3501](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/src/index.ts#L3485-L3501)

tmux探测及降级。

<details>
<summary>查看原文（17行）</summary>

```text
    if (wantsPersist) {
      const probe = await probeTmux()
      if (probe.available) {
        tmuxName = persistName
        ensureTmuxAssets({ shell: this.options.shell, colorTerm: this.options.colorTerm, shellIntegration: this.options.shellIntegration, passthrough: probe.passthrough })
        spawnPlan = buildTmuxSpawnPlan({ shell: this.options.shell, term: this.options.term, colorTerm: this.options.colorTerm, tmuxName })
      } else {
        degraded = true // 降级普通会话，由调用方给灰字提示；原因（超时/没装）一并带出去
        degradedInconclusive = probe.inconclusive === true
      }
    }
    const create = (async (): Promise<TtySession> => {
      const handle = wrapLocalPty(await subprocess.spawnTerminal({
        argv: spawnPlan.argv,
        rows: clampInt(rows, 24, 2, 200),
        cols: clampInt(cols, 80, 2, 500),
        cwd,
```

</details>

#### 缺口

- 未做多Agent/多profile隔离和网络抖动验收。
  **影响**：共享角色标记不能证明主体隔离或恢复不丢。
  **进一步探讨**：两个非关键profile测试sid可见性、隐藏、重连和显式收尾。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · SSH、传输和隧道有哪些副作用？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

SSH采用ssh2连接与hostVerifier，首次未知指纹自动记录并放行，已知不匹配才拒绝；TOFU不是首次独立认证，应在可信环境核对或导入主机指纹。密钥/密码/凭据引用、agent forwarding、跳板和ProxyCommand各依连接配置与授权，不能因tty_books不回密码就认为终端输出无秘密。

SFTP是远程账号实际权限：文本覆盖和追加、目录创建、移动与递归删除都是真实变更。remove拒绝根、~及点段并lstat避免跟随软链递归，但不是绑定工作区根的沙箱，合法子路径删除也不可恢复。覆盖上传写同目录分片再rename，追加直接目标；这些局部措施不保证目录批量操作事务。隧道独立于标签，local监听127.0.0.1，remote监听取配置，开启不等于已active；运行先变更再异步回写settings，失败只日志提示，返回成功并不证明持久化已完成。重启可能按旧设置恢复，需同时检查运行与配置。

#### 证据与依据

**依据 1 · 源码核查**：[packages/tty/src/ssh.ts:414-449](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/src/ssh.ts#L414-L449)

TOFU首次记录放行及变更拒绝。

<details>
<summary>查看原文（36行）</summary>

```text
 * TOFU 主机指纹策略（hostVerifier 接线）；返回的 mismatchMessage() 供连接错误路径取人类可读拒绝原因。
 */
export function applyHostKeyPolicy(options: {
  connectConfig: ConnectConfig
  spec: SshSpec
  store?: HostKeyStore
  logger?: { info(msg: string): void; warn(msg: string): void }
  target: string
}): { mismatchMessage(): string | null } {
  const { connectConfig, spec, store, logger, target } = options
  const { host: keyHost, port } = hostKeyIdentity(spec)
  const aliased = keyHost !== spec.host.trim()
  /** 记录/比对的键带别名时，文案里点明「按别名 <名> 定位」——否则用户会去删错记录。 */
  const where = aliased ? `${target}（HostKeyAlias ${keyHost}）` : target
  let hostKeyMismatch: string | null = null
  connectConfig.hostVerifier = (hash: string) => {
    const known = store?.get(keyHost, port)
    if (known === undefined || known.length === 0) {
      store?.record(keyHost, port, hash)
      logger?.info(`[dsh-tty] ssh ${where} 首次连接，已记录 host key 指纹 sha256:${hash}（TOFU）`)
      return true
    }
    if (known.includes(hash)) {
      logger?.info(`[dsh-tty] ssh ${where} host key 指纹匹配（sha256:${hash}，该主机共记录 ${String(known.length)} 把钥匙）`)
      return true
    }
    const shown = known.slice(0, 3).map((f) => `sha256:${f}`).join(' / ')
    const more = known.length > 3 ? ` 等 ${String(known.length)} 把` : ''
    hostKeyMismatch =
      `SSH 主机密钥指纹变更：${where} 已记录 ${shown}${more}，本次为 sha256:${hash}。` +
      '可能是主机重装或换钥匙，也可能是中间人（MITM）冒充；确认安全后，到 插件配置 → 终端面板 → SSH 主机密钥记录 删除该主机再重连。'
    logger?.warn(`[dsh-tty] ${hostKeyMismatch}`)
    return false
  }
  return { mismatchMessage: () => hostKeyMismatch }
}
```

</details>

**依据 2 · 源码核查**：[packages/tty/src/sftp.ts:44-56](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/src/sftp.ts#L44-L56)

删除词法护栏非目录根限制。

<details>
<summary>查看原文（13行）</summary>

```text
export function assertRemovableRemotePath(raw: string): string {
  const path = raw.trim()
  if (path === '') throw new Error('path 必须是非空字符串')
  if (path === '/' || path.replace(/\/+$/, '') === '') throw new Error('拒绝删除：path 指向根目录（整树删除不可恢复）')
  if (path === '~' || path.startsWith('~/') || path.replace(/\/+$/, '') === '/home') {
    throw new Error('拒绝删除：path 指向 home 目录（~）——如确需删除其中内容，请指定具体子路径')
  }
  const segments = path.replace(/\/+$/, '').split('/').filter((seg) => seg !== '')
  if (segments.some((seg) => seg === '.' || seg === '..')) {
    throw new Error('拒绝删除：path 含 . / .. 相对段（按服务端语义会解析到意外位置）——请先解析出绝对路径')
  }
  return path
}
```

</details>

**依据 3 · 源码核查**：[packages/tty/src/sftp.ts:926-953](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/src/sftp.ts#L926-L953)

递归实际lstat/unlink/rmdir。

<details>
<summary>查看原文（28行）</summary>

```text
  private async removeEntry(sftp: SFTPWrapper, path: string, recursive: boolean): Promise<void> {
    const stats = await new Promise<import('ssh2').Stats>((resolve, reject) => {
      sftp.lstat(path, (error, stats) => (error !== undefined ? reject(sftpFail('删除失败', path, error)) : resolve(stats)))
    })
    if (!stats.isDirectory()) {
      await new Promise<void>((resolve, reject) => {
        sftp.unlink(path, (error) => (error != null ? reject(sftpFail('删除失败', path, error)) : resolve()))
      })
      return
    }
    if (!recursive) {
      await new Promise<void>((resolve, reject) => {
        // 不预设原因：非空与权限拒绝在 SFTP 层都是笼统的 Failure，把两种可能
        // 一并列出让用户自行分辨（此前一律归因为「非空」误导权限问题）
        sftp.rmdir(path, (error) => (error != null ? reject(sftpFail('删除目录失败', path, error, '（目录非空时需 recursive:true；若非此原因，多为账号对该目录无写权限）')) : resolve()))
      })
      return
    }
    const children = await this.readdir(sftp, path)
    const base = path.endsWith('/') ? path : path + '/'
    for (const child of children) {
      if (DOT_ENTRIES.has(child.filename)) continue
      await this.removeEntry(sftp, base + child.filename, true)
    }
    await new Promise<void>((resolve, reject) => {
      sftp.rmdir(path, (error) => (error != null ? reject(sftpFail('删除目录失败', path, error)) : resolve()))
    })
  }
```

</details>

**依据 4 · 源码核查**：[packages/tty/src/sftp.ts:401-420](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/src/sftp.ts#L401-L420)

覆盖分片和追加直写。

<details>
<summary>查看原文（20行）</summary>

```text
  async openUpload(spec: SshSpec, path: string, append = false): Promise<SftpUpload> {
    const sftp = await this.acquire(spec)
    const target = path.trim()
    if (append) {
      const stream = sftp.createWriteStream(target, { flags: 'a' })
      const done = this.streamDone(stream, () => {}, target)
      done.catch(() => {})
      return { stream, done, writePath: target }
    }
    const partPath = `${target}.dsh-part-${randomUUID()}`
    // 顺手回收崩溃残留（0.19.0）：进程崩溃 / 断电时 dropPart 来不及执行，远端会
    // 留下 `.dsh-part-*` 孤儿。只清同目标前缀且超过 STALE_PART_MS 的（并发中的
    // 新分片不受影响）；readdir/unlink 失败静默——清理是尽力而为。
    void this.reapStaleParts(sftp, target)
    const stream = sftp.createWriteStream(partPath, { flags: 'w' })
    const done = new Promise<void>((resolve, reject) => {
      let settled = false
      const dropPart = (): void => {
        // 分片清理是尽力而为：失败只留日志（下一次覆盖写不受影响）
        sftp.unlink(partPath, (error) => {
```

</details>

**依据 5 · 源码核查**：[packages/tty/src/tunnels.ts:416-431](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/src/tunnels.ts#L416-L431)

先运行变更再persist。

<details>
<summary>查看原文（16行）</summary>

```text
  private applyEnabled(rt: RuntimeTunnel, enabled: boolean): void {
    rt.spec = { ...rt.spec, enabled }
    rt.signature = signatureOf(rt.spec)
    if (enabled) {
      // fatal 恢复的前置条件是配置被改对；没改配置就重开会在同一条错误上再撞一次，
      // 但仍允许重开——用户可能刚在卡片上改好、热应用还没到，这里重开就是让它立刻生效
      if (rt.server !== null || rt.conn !== null) this.stopTunnel(rt)
      rt.fatal = false
      rt.error = null
      this.startTunnel(rt)
    } else {
      this.stopTunnel(rt)
    }
    // 写回配置（settings 热应用 → reconcile 会按新配置收敛，与卡片上点那个勾同一条路）。
    // 放在最后：配置写失败（回调抛错）不该让运行态停在一个与配置相反的状态上。
    this.persist?.([...this.tunnels.values()].map((entry) => entry.spec))
```

</details>

**依据 6 · 源码核查**：[packages/tty/src/index.ts:4921-4933](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/src/index.ts#L4921-L4933)

设置回写fire-and-forget，失败仅告警。

<details>
<summary>查看原文（13行）</summary>

```text
     * 隧道配置回写（agent 的 tunnel_start / tunnel_stop 用）：与卡片保存走**同一个**
     * settings 通道（`scope.update` → 热应用 → applyPatch → reconcile），所以配置是唯一
     * 真相源，agent 的操作与用户在卡片上点那个勾结果完全一致。settings 服务缺失
     * （单测 / 极早期）时回调保持 null，`setEnabled` 退化成「本次进程内生效」。
     */
    tunnelManager.setPersist((specs) => {
      const scope = settingsScope
      if (scope === undefined) return
      void Promise.resolve(scope.update({ tunnels: specs })).catch((error: unknown) => {
        console.warn('[dsh-tty] 隧道配置回写失败: ' + (error instanceof Error ? error.message : String(error)))
      })
    })
    const stateRef = { enabled: true, announceToAgent: config?.announceToAgent !== false, toolsRegistered: false, sftpStyle: config?.sftpStyle === 'dual' ? 'dual' : 'dialog' as 'dialog' | 'dual' }
```

</details>

**依据 7 · 源码核查**：[packages/tty/src/tunnels.ts:450-456](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/src/tunnels.ts#L450-L456)

本地监听回环。

```text
      const server = net.createServer((socket) => this.onLocalConnection(rt, socket))
      server.on('error', (error) => {
        this.failTunnel(rt, localListenFailureMessage(rt.spec.localPort ?? 0, error))
      })
      server.listen(rt.spec.localPort ?? 0, '127.0.0.1', () => {
        this.logger.info(`[dsh-tty] 隧道 ${rt.spec.name} 监听 127.0.0.1:${String(rt.spec.localPort ?? 0)}`)
      })
```

**依据 8 · 源码核查**：[packages/tty/src/tunnels.ts:626-634](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/src/tunnels.ts#L626-L634)

remote监听取配置。

```text
    conn.forwardIn(spec.remoteHost?.trim() || '127.0.0.1', spec.remotePort ?? 0, (error, realPort) => {
      if (rt.dead || rt.conn !== conn) return
      if (error !== undefined && error !== null) {
        this.failTunnel(rt, `远程监听失败（${spec.remoteHost?.trim() || '127.0.0.1'}:${String(spec.remotePort ?? 0)}）: ${error.message}`)
        return
      }
      this.logger.info(`[dsh-tty] 隧道 ${spec.name} 远程监听 ${spec.remoteHost?.trim() || '127.0.0.1'}:${String(realPort)} 就绪`)
    })
  }
```

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · AI解释外发什么、能否自动执行？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

AI辅助默认关，用户点解释后由Host检查assistEnabled与sid，再经宿主模型路由llm.stream发送上下文；每sid在途锁防重复，不是免费功能。上下文取上一条命令尾部并补当前屏幕、cwd/shell/退出码；各段压缩限行/限字，已省略前文会提示。正则遮盖部分已知密钥形态，不保证任意业务秘密、路径、数据和罕见token都移除，用户仍需判断现场是否可外发。

模型答案提取首个代码围栏中首条非注释命令，“填入”按钮发Ctrl-U+命令且不带换行，因而没有自动回车；这仍是向活终端写字节，会清当前行。徽标形成时曾有失败边界，不保证等待模型期间终端一直停在同一提示符；填入前用户应重新确认现场，避免后来运行的交互程序吃到输入。不要把建议当已验证修复，需自行检查命令副作用。未调用模型，费用和修复正确率未知。

#### 证据与依据

**依据 1 · 源码核查**：[packages/tty/src/index.ts:5339-5419](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/src/index.ts#L5339-L5419)

Host开关、sid、在途与模型调用。

<details>
<summary>查看原文（81行）</summary>

```text
        disposers.push(webServer.register({
          kind: 'exact',
          path: '/api/dsh-tty/assist',
          handler: async (req: ReqLike & AsyncIterable<Uint8Array>, res: ResLike) => {
            if (!(await gateRoute(req, res))) {
              return
            }
            if (req.method !== 'POST') {
              writeJson(res, 405, { error: 'method not allowed: ' + String(req.method) })
              return
            }
            /*
             * 开关是**宿主侧**的闸，不靠客户端自觉：关掉时客户端连徽标都收不到，但配置
             * 随时可被改，而「关掉必须立刻生效」是这类外发开关的底线。
             */
            if (!live.assistEnabled) {
              writeJson(res, 403, { error: 'AI 辅助未开启（插件配置 → 终端面板 → 「失败即解释」）' })
              return
            }
            const body = await readJsonBody(req)
            if (body === undefined) {
              writeJson(res, 400, { error: 'invalid JSON body' })
              return
            }
            const sid = typeof body.sid === 'string' ? body.sid : ''
            const session = sessions.get(sid)
            if (sid === '' || session === undefined || session.closed) {
              writeJson(res, 404, { error: '会话不存在或已退出: ' + sid })
              return
            }
            const resolved = resolveAssistRoute(ctx, live.assistProvider, live.assistModel)
            if (resolved.route === undefined) {
              writeJson(res, 409, { error: resolved.error ?? '没有可用的模型路由' })
              return
            }
            const llm = getService(ctx, 'llm') as LlmLike | undefined
            if (llm === undefined || llm === null || typeof llm.stream !== 'function') {
              writeJson(res, 409, { error: '宿主 llm 服务不可用（当前宿主没有提供模型调用）' })
              return
            }
            /*
             * 进到这行才说明这次真的要花一次模型调用了，所以在**这里**记账（而不是上面更早处）：
             * 重复请求挡在门外、且不占用一次调用。
             */
            if (assistInFlight.has(sid)) {
              writeJson(res, 409, { error: '这条命令的解释正在生成中，稍等一下再试' })
              return
            }
            assistInFlight.add(sid)
            const last = session.shellState.lastCommand
            const prompt = buildFailurePrompt({
              shell: session.kind === 'ssh' ? 'ssh ' + session.target : live.shell,
              cwd: session.cwd,
              exitCode: last === null ? null : last.exitCode,
              output: last === null ? '' : last.output,
              screen: session.screen === null ? '' : screenTextOf(session.screen),
              lang: body.lang === 'en' ? 'en' : 'zh',
            })
            const started = Date.now()
            try {
              const raw = await askModelOnce(llm, resolved.route, prompt)
              writeJson(res, 200, {
                ok: true,
                /*
                 * 界面正文用**去标记后的纯文本**（围栏与 ** 都去掉）：命令另有 command 字段
                 * 专门展示，正文里再来一遍是重复；而把 Markdown 原样铺在界面上就是满屏星号。
                 * 标记的解析在这里一次做完，客户端只负责原样显示。
                 */
                answer: plainAnswerText(raw),
                // 「填入」按钮用：只在模型给了围栏代码块时非空（见 extractCommandFromAnswer）
                command: extractCommandFromAnswer(raw),
                route: resolved.route.provider + '/' + resolved.route.model,
                chars: prompt.user.length,
                ms: Date.now() - started,
              })
            } catch (error) {
              writeJson(res, 502, { error: error instanceof Error ? error.message : String(error) })
            } finally {
              // 无论成功、报错还是超时都要放行，否则这个会话从此再也问不动
              assistInFlight.delete(sid)
            }
```

</details>

**依据 2 · 源码核查**：[packages/tty/src/assist.ts:44-78](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/src/assist.ts#L44-L78)

有限秘密规则。

<details>
<summary>查看原文（35行）</summary>

```text
 */
const SECRET_RULES: Array<{ re: RegExp; to: string; why: string }> = [
  { re: /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g, to: '[已遮盖私钥]', why: 'PEM 私钥块' },
  { re: /\bsk-[A-Za-z0-9_-]{8,}/g, to: 'sk-[已遮盖]', why: 'OpenAI 风格密钥' },
  { re: /\bAKIA[0-9A-Z]{16}\b/g, to: 'AKIA[已遮盖]', why: 'AWS access key id' },
  { re: /\bgh[pousr]_[A-Za-z0-9]{20,}/g, to: 'gh_[已遮盖]', why: 'GitHub token' },
  { re: /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}/g, to: '[已遮盖 JWT]', why: 'JWT' },
  { re: /(\/\/[^/\s:@]+):[^/\s:@]+@/g, to: '$1:[已遮盖]@', why: 'URL 里的密码' },
  {
    re: /((?:password|passwd|pwd|secret|token|api[_-]?key|access[_-]?key|authorization|密码)\s*[:=]\s*)([^\s'"]{3,})/gi,
    to: '$1[已遮盖]',
    why: '键值对里的秘密',
  },
]

/** 规则表只读导出，供单测逐条枚举（新加一条规则必须同时加一条用例）。 */
export const SECRET_RULE_WHY: readonly string[] = SECRET_RULES.map((rule) => rule.why)

export function maskSecrets(text: string): { text: string; count: number } {
  let out = text
  let count = 0
  for (const rule of SECRET_RULES) {
    out = out.replace(rule.re, (...args: unknown[]) => {
      count += 1
      // 手写 $1 展开：用了回调就不能再靠 String.replace 的替换串语法
      return rule.to.replace(/\$(\d)/g, (_m, d: string) => String(args[Number(d)] ?? ''))
    })
  }
  return { text: out, count }
}

/**
 * 把一段终端输出压成上下文正文。
 *
 * 四步，每一步都对应一种真实的噪声：
```

</details>

**依据 3 · 源码核查**：[packages/tty/src/assist.ts:253-275](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/src/assist.ts#L253-L275)

上下文现场与遮盖后外发。

<details>
<summary>查看原文（23行）</summary>

```text
 * 没有的（实测：`tty_capture{last}` 的正文只有 `ls: … No such file or directory`）。
 *
 * `input.command` 目前**没有调用方会填**：shell 集成桩只发 A/B/D/T，不带命令行，
 * 所以这个字段留着等「桩改成 C 标记带命令」那一轮（见 ROADMAP）。
 */
export function buildFailurePrompt(input: AssistPromptInput): { system: string; user: string } {
  const out = compressTerminalText(input.output ?? '')
  const screen = compressTerminalText(input.screen ?? '', { maxLines: SCREEN_TAIL_LINES })
  const lines: string[] = [
    '[终端现场]',
    'shell: ' + (input.shell !== '' ? input.shell : '(未知)'),
    'cwd: ' + (input.cwd !== '' ? input.cwd : '(未知)'),
  ]
  if (input.command !== undefined && input.command !== '') lines.push('命令: ' + input.command)
  if (input.exitCode !== undefined && input.exitCode !== null) lines.push('退出码: ' + String(input.exitCode))
  const hasOut = out.trim() !== ''
  const hasScreen = screenAddsContext(out, screen)
  if (hasOut) lines.push('', '[命令输出]', out)
  if (hasScreen) lines.push('', '[当前屏幕（含你敲的命令行与提示符）]', screen)
  if (!hasOut && !hasScreen) lines.push('', '(没有拿到输出)')
  const masked = maskSecrets(lines.join('\n'))
  return { system: systemPromptFor(input.lang), user: masked.text }
}
```

</details>

**依据 4 · 源码核查**：[packages/tty/src/assist.ts:134-153](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/src/assist.ts#L134-L153)

围栏命令取第一条。

<details>
<summary>查看原文（20行）</summary>

````text
     * 代价是 root 会话里 `# cmd` 形态的首行取不到，而系统提示本来就要求不要 $ 前缀。
     */
    if (line === '' || line.startsWith('#')) continue
    return line.replace(/^[$>]\s+/, '')
  }
  return ''
}

/**
 * 把模型答案变成**界面正文用的纯文本**。
 *
 * 只做「去掉标记」，**不做「解释标记」**——模型输出是不可信文本，任何 Markdown 渲染都是
 * 一条新攻击面；而原样显示又满屏是星号与围栏。所以折中成两条纯删减：
 *   - 丢掉围栏代码块：命令另有一行 `.tt_assistCmd` 专门展示（还带「填入」按钮），
 *     正文里再来一遍是重复；
 *   - 去掉 `**` 强调标记。
 * 顺带折掉连续空行（丢掉围栏后常留下整块空白）。
 */
export function plainAnswerText(answer: string): string {
  const withoutFence = answer.replace(/```[A-Za-z0-9_-]*\n[\s\S]*?```/g, '').replace(/```[A-Za-z0-9_-]*/g, '')
````

</details>

**依据 5 · 源码核查**：[packages/tty/client-src/index.js:6516-6526](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/client-src/index.js#L6516-L6526)

实际填入Ctrl-U，无换行，未复核当前running。

<details>
<summary>查看原文（11行）</summary>

```text
function fillAssistCommand() {
  const sid = assistMenuSid
  const hint = sid === null ? undefined : assistHints.get(sid)
  if (sid === null || hint === undefined || hint.command === '') return
  sendFrame({ t: 'input', sid: sid, d: '\x15' + hint.command })
  const tab = tabs.get(sid)
  closeAssistMenu()
  dismissAssistHint(sid)
  if (tab !== undefined && tab.term !== null) tab.term.focus()
}

```

</details>

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 全周期成本与最小采用怎样判断？

**研究主题**：效果与总成本、采用判断

#### 完整回答

建议先观察而非直接接生产主机：源码已覆盖主要执行面，但PTY宿主适配、档位缺服务放行、多Agent共享及恢复未验收，无法据可见面板完成安全采用。最小验证放在可重置的非关键本机环境，AI解释关闭，不配生产SSH/转发；先核对只读列表和未知running，再只运行自己已知可结束的命令，专门验证取消后仍存活、显式关闭与tmux清理。逐次确认档位服务真实组合，拒绝工具显示之外再检查实际调用结果。

首次成本是兼容Node/DSH、PTY、shell集成与可选tmux、SSH指纹/凭据配置；持续消耗PTY/SSH连接、headless屏与缓冲、状态采集、隧道和每轮会话上下文，可选AI额外模型费用。没有测量金额、资源峰值和人工节省。恢复要清仍活命令、孤儿/持久会话、传输半文件和独立隧道；退出须停隧道、结束会话并核对配置，不能只关面板。档位缺失、取消后遗留任务无人负责、主体间能越界看/关或现场含不可外发数据时停止；外部终端+受既有沙箱约束的bash仍是退路。

#### 证据与依据

**依据 1 · 源码核查**：[packages/tty/src/index.ts:6373-6420](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/src/index.ts#L6373-L6420)

取消后存活责任。

<details>
<summary>查看原文（48行）</summary>

```text
            async execute(args: unknown, exec?: { signal?: AbortSignal }): Promise<{ sid: string; running: boolean; tail: string; closed: boolean; exitCode?: number; signal?: string; cancelled?: boolean }> {
              const input = args as { command?: unknown; cwd?: unknown; timeoutSec?: unknown; keep?: unknown; lines?: unknown; cols?: unknown; rows?: unknown }
              if (typeof input.command !== 'string' || input.command.trim() === '') throw new Error('command 必须是非空字符串')
              const timeoutSec = clampInt(input.timeoutSec, 120, 1, 600)
              const lines = clampInt(input.lines, 60, 1, 500)
              const opened = await server.openAgentSession({
                command: input.command,
                ...(typeof input.cwd === 'string' && input.cwd.trim() !== '' ? { cwd: input.cwd } : {}),
                cols: input.cols,
                rows: input.rows,
              })
              const session = sessions.get(opened.sid)
              if (session === undefined || session.closed) throw new Error(`会话创建后立刻退役了: ${opened.sid}`)
              // 命令型会话的进程**就是**那条命令（D78 的 exec 链）：进程退出 = 命令结束，
              // 与 shell 集成无关（这类会话不注入钩子，等 133;D 是等不到的）
              const finished = await waitForSessionExit(session, timeoutSec * 1000, exec?.signal)
              const tail = cleanAnsiTail(tailLines(session, lines))
              /*
               * 到点 / 被取消 → 都为 `running: true`，而且**都不关会话**。
               *
               * 「取消」这一档是刻意的：`exec.signal` 取消的是**这次工具调用**，不是那条命令——
               * 关掉会话等于「因为调用方不等了，就把人家跑着的构建杀了」。决定权交回调用方
               * （tty_close / 发送 C-c），与 `timeoutSec` 到点那条路同一处置。
               */
              if (finished !== 'exited') {
                return {
                  sid: opened.sid,
                  running: true,
                  closed: false,
                  tail,
                  ...(finished === 'cancelled' ? { cancelled: true } : {}),
                }
              }
              const exited = session.exited
              const result = {
                sid: opened.sid,
                running: false,
                tail,
                closed: false,
                ...(exited === null || exited.code === null ? {} : { exitCode: exited.code }),
                ...(exited === null || exited.signal === null || exited.signal === '' ? {} : { signal: exited.signal }),
              }
              // keep 默认 false：这条通道的语义就是「一条命令一次调用」，留着会占满
              // 只读保留的名额（16 条）；要回看现场就显式 keep:true
              if (input.keep === true) return result
              await server.closeAgentSession(opened.sid)
              return { ...result, closed: true }
            },
```

</details>

**依据 2 · 源码核查**：[packages/tty/src/index.ts:2755-2789](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/src/index.ts#L2755-L2789)

Agent存活不受孤儿清理。

<details>
<summary>查看原文（35行）</summary>

```text
   * 以后：已存在的孤儿会永久占 PTY 与名额，满额后新标签一直报「会话数已达上限」。
   *
   * agent 开的会话（owner:'agent'）不走这条：它从出生起就没有客户端，判据
   * 「orphanedAt !== null」对它要么永不成立（不回收）要么被误当孤儿（一开就收）。
   * 它的关闭入口是 agent 的 tty_close 或用户在面板里接管后关标签。
   */
  async reapOrphans(graceMs: number): Promise<TtySession[]> {
    const now = Date.now()
    /** 本轮真的被回收的会话——**返回值就是日志报数的来源**，别在调用方另数一遍。 */
    const reaped: TtySession[] = []
    for (const session of [...this.sessions.values()]) {
      if (session.owner === 'agent') continue
      // D77：只读保留态不归孤儿回收管——它可能本来就带着 orphanedAt（断线后
      // 才退出），被这里收掉就等于「退出即退役」，保留期形同虚设。它的到点
      // 退役由 reapExited 统一负责。
      if (session.exited !== null) continue
      if (session.orphanedAt === null) continue
      if (graceMs <= 0 || now - session.orphanedAt >= graceMs) {
        reaped.push(session)
        void this.destroy(session) // 后台收尾：terminate 最慢可达 ~20s，不阻塞回收器
      }
    }
    return reaped
  }

  /**
   * 只读保留到点退役（D77；回收器每轮调用）：超过保留期的会话出表 + 释放屏。
   *
   * 默认策略是 ∞（保留到显式关闭）⇒ 本方法是 no-op，条数由 `capExited` 兜；
   * 把 `EXITED_RETAIN_MS` 改成有限值它就照常工作（策略可调，通路留着）。
   *
   * **不 kill 进程**：这里收的全是已经退出的会话（进程早没了），`retire()` 就够；
   * 真退役（显式 `tty_close` / 面板关标签）走 `killSessionNow`，那条路要处理
   * tmux teardown 与 forceKill 的兜底。
   */
```

</details>

**依据 3 · 源码核查**：[packages/kit/src/tier-gate.ts:155-163](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/kit/src/tier-gate.ts#L155-L163)

缺服务放行前提。

```text
export function decideTierCall(tier: TierContext, cls: TierClass, tool: string): TierDecision {
  if (!tier.services.sandboxPolicy) return { action: 'allow' }
  if (tier.auto) return { action: 'allow' }
  if (tier.mode === 'danger-full-access') return { action: 'allow' }
  if (cls === 'read') return { action: 'allow' }
  if (tier.policy === 'ask') {
    return { action: 'ask', reason: tierAskReason({ tool, mode: tier.mode }) }
  }
  return { action: 'deny', reason: tierDenialReason({ tool, mode: tier.mode, policy: tier.policy, cls }) }
```

**依据 4 · 源码核查**：[packages/tty/src/index.ts:4921-4933](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/src/index.ts#L4921-L4933)

持久化失败恢复边界。

<details>
<summary>查看原文（13行）</summary>

```text
     * 隧道配置回写（agent 的 tunnel_start / tunnel_stop 用）：与卡片保存走**同一个**
     * settings 通道（`scope.update` → 热应用 → applyPatch → reconcile），所以配置是唯一
     * 真相源，agent 的操作与用户在卡片上点那个勾结果完全一致。settings 服务缺失
     * （单测 / 极早期）时回调保持 null，`setEnabled` 退化成「本次进程内生效」。
     */
    tunnelManager.setPersist((specs) => {
      const scope = settingsScope
      if (scope === undefined) return
      void Promise.resolve(scope.update({ tunnels: specs })).catch((error: unknown) => {
        console.warn('[dsh-tty] 隧道配置回写失败: ' + (error instanceof Error ? error.message : String(error)))
      })
    })
    const stateRef = { enabled: true, announceToAgent: config?.announceToAgent !== false, toolsRegistered: false, sftpStyle: config?.sftpStyle === 'dual' ? 'dual' : 'dialog' as 'dialog' | 'dual' }
```

</details>

**依据 5 · 源码核查**：[packages/tty/src/assist.ts:253-275](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/src/assist.ts#L253-L275)

可选上下文费用与外发。

<details>
<summary>查看原文（23行）</summary>

```text
 * 没有的（实测：`tty_capture{last}` 的正文只有 `ls: … No such file or directory`）。
 *
 * `input.command` 目前**没有调用方会填**：shell 集成桩只发 A/B/D/T，不带命令行，
 * 所以这个字段留着等「桩改成 C 标记带命令」那一轮（见 ROADMAP）。
 */
export function buildFailurePrompt(input: AssistPromptInput): { system: string; user: string } {
  const out = compressTerminalText(input.output ?? '')
  const screen = compressTerminalText(input.screen ?? '', { maxLines: SCREEN_TAIL_LINES })
  const lines: string[] = [
    '[终端现场]',
    'shell: ' + (input.shell !== '' ? input.shell : '(未知)'),
    'cwd: ' + (input.cwd !== '' ? input.cwd : '(未知)'),
  ]
  if (input.command !== undefined && input.command !== '') lines.push('命令: ' + input.command)
  if (input.exitCode !== undefined && input.exitCode !== null) lines.push('退出码: ' + String(input.exitCode))
  const hasOut = out.trim() !== ''
  const hasScreen = screenAddsContext(out, screen)
  if (hasOut) lines.push('', '[命令输出]', out)
  if (hasScreen) lines.push('', '[当前屏幕（含你敲的命令行与提示符）]', screen)
  if (!hasOut && !hasScreen) lines.push('', '(没有拿到输出)')
  const masked = maskSecrets(lines.join('\n'))
  return { system: systemPromptFor(input.lang), user: masked.text }
}
```

</details>

#### 缺口

- 无真实宿主权限、恢复、效果及费用验收。
  **影响**：暂只能观察并做隔离验证，不能直接推荐生产接入。
  **进一步探讨**：执行上述可重置样本矩阵并记录权限结果、残留进程、资源/模型费用和收尾耗时。

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 什么改进值得验证？

**研究主题**：新假设与验证

#### 完整回答

未验证方向是把长命令的存活责任显式绑定到创建Agent/session与可撤销执行租约，在取消等待后显示待收尾清单，而不是默认立刻杀命令。它来自tty_run取消留活且Agent会话不走孤儿回收的组合；用户可能正需要长任务继续，简单“取消就kill”会破坏有效工作。

候选设计记录创建主体、用户接管和保活选择，持续任务可由用户续期或接管，过期先提醒再按明确策略处理；只读记录淘汰和活进程收尾分开。负担是主体身份、崩溃恢复和租约策略维护；不能替代OS沙箱。最小对照在短命令、长构建、用户接管、调用取消与宿主重连上比较无人负责存活进程、误杀、人工检查和恢复时间。若新增误杀或提醒噪声超过残留减少，就否定方案；无实现和市场验证。

#### 证据与依据

**依据 1 · 源码核查**：[packages/tty/src/index.ts:6373-6420](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/src/index.ts#L6373-L6420)

留活而不杀的合理现状。

<details>
<summary>查看原文（48行）</summary>

```text
            async execute(args: unknown, exec?: { signal?: AbortSignal }): Promise<{ sid: string; running: boolean; tail: string; closed: boolean; exitCode?: number; signal?: string; cancelled?: boolean }> {
              const input = args as { command?: unknown; cwd?: unknown; timeoutSec?: unknown; keep?: unknown; lines?: unknown; cols?: unknown; rows?: unknown }
              if (typeof input.command !== 'string' || input.command.trim() === '') throw new Error('command 必须是非空字符串')
              const timeoutSec = clampInt(input.timeoutSec, 120, 1, 600)
              const lines = clampInt(input.lines, 60, 1, 500)
              const opened = await server.openAgentSession({
                command: input.command,
                ...(typeof input.cwd === 'string' && input.cwd.trim() !== '' ? { cwd: input.cwd } : {}),
                cols: input.cols,
                rows: input.rows,
              })
              const session = sessions.get(opened.sid)
              if (session === undefined || session.closed) throw new Error(`会话创建后立刻退役了: ${opened.sid}`)
              // 命令型会话的进程**就是**那条命令（D78 的 exec 链）：进程退出 = 命令结束，
              // 与 shell 集成无关（这类会话不注入钩子，等 133;D 是等不到的）
              const finished = await waitForSessionExit(session, timeoutSec * 1000, exec?.signal)
              const tail = cleanAnsiTail(tailLines(session, lines))
              /*
               * 到点 / 被取消 → 都为 `running: true`，而且**都不关会话**。
               *
               * 「取消」这一档是刻意的：`exec.signal` 取消的是**这次工具调用**，不是那条命令——
               * 关掉会话等于「因为调用方不等了，就把人家跑着的构建杀了」。决定权交回调用方
               * （tty_close / 发送 C-c），与 `timeoutSec` 到点那条路同一处置。
               */
              if (finished !== 'exited') {
                return {
                  sid: opened.sid,
                  running: true,
                  closed: false,
                  tail,
                  ...(finished === 'cancelled' ? { cancelled: true } : {}),
                }
              }
              const exited = session.exited
              const result = {
                sid: opened.sid,
                running: false,
                tail,
                closed: false,
                ...(exited === null || exited.code === null ? {} : { exitCode: exited.code }),
                ...(exited === null || exited.signal === null || exited.signal === '' ? {} : { signal: exited.signal }),
              }
              // keep 默认 false：这条通道的语义就是「一条命令一次调用」，留着会占满
              // 只读保留的名额（16 条）；要回看现场就显式 keep:true
              if (input.keep === true) return result
              await server.closeAgentSession(opened.sid)
              return { ...result, closed: true }
            },
```

</details>

**依据 2 · 源码核查**：[packages/tty/src/index.ts:2755-2780](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/src/index.ts#L2755-L2780)

Agent不走孤儿回收。

<details>
<summary>查看原文（26行）</summary>

```text
   * 以后：已存在的孤儿会永久占 PTY 与名额，满额后新标签一直报「会话数已达上限」。
   *
   * agent 开的会话（owner:'agent'）不走这条：它从出生起就没有客户端，判据
   * 「orphanedAt !== null」对它要么永不成立（不回收）要么被误当孤儿（一开就收）。
   * 它的关闭入口是 agent 的 tty_close 或用户在面板里接管后关标签。
   */
  async reapOrphans(graceMs: number): Promise<TtySession[]> {
    const now = Date.now()
    /** 本轮真的被回收的会话——**返回值就是日志报数的来源**，别在调用方另数一遍。 */
    const reaped: TtySession[] = []
    for (const session of [...this.sessions.values()]) {
      if (session.owner === 'agent') continue
      // D77：只读保留态不归孤儿回收管——它可能本来就带着 orphanedAt（断线后
      // 才退出），被这里收掉就等于「退出即退役」，保留期形同虚设。它的到点
      // 退役由 reapExited 统一负责。
      if (session.exited !== null) continue
      if (session.orphanedAt === null) continue
      if (graceMs <= 0 || now - session.orphanedAt >= graceMs) {
        reaped.push(session)
        void this.destroy(session) // 后台收尾：terminate 最慢可达 ~20s，不阻塞回收器
      }
    }
    return reaped
  }

  /**
```

</details>

**依据 3 · 源码核查**：[packages/tty/src/index.ts:3342-3357](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/src/index.ts#L3342-L3357)

owner只有角色而非创建主体。

<details>
<summary>查看原文（16行）</summary>

```text
  async closeAgentSession(sid: string): Promise<{ ok: true }> {
    const session = this.sessions.get(sid)
    if (session === undefined || session.closed) throw new Error(`会话不存在或已结束: ${sid}`)
    if (session.owner !== 'agent') {
      throw new Error(`会话 ${sid} 是用户在面板里开的（owner=user）：请在面板里关闭那个标签，不要由 agent 越权结束`)
    }
    // D77：只读保留态（进程已退出）也走这条路——`killSessionNow` 对死句柄是安全的，
    // 它做的正是「退役 + 释放屏」。这也是 issue 里要的那个「显式关闭」入口。
    this.flushPendingOutput(session)
    this.killSessionNow(session)
    this.broadcastSessions()
    return { ok: true }
  }

  /**
   * 把当前会话清单推给所有已连接面板（agent 开关会话后让面板即时反映）。
```

</details>

#### 缺口

- 没有真实无人负责长任务的频率和租约对照。
  **影响**：不能认定值得新增调度复杂度。
  **进一步探讨**：先记录现状遗留任务与接管需求，再比较候选策略。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
