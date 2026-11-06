# @hyzyn/dsh-docker

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[44554d7](https://github.com/hyzyn/dsh-plugin-kit/tree/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/docker)

<!-- BEGIN META -->
[![GitHub ★ 62](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=62&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hyzyn/dsh-plugin-kit) [![npm 30d 4,113](https://img.shields.io/static/v1?label=npm+30d&message=4%2C113&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@hyzyn/dsh-docker) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@hyzyn/dsh-docker)
<!-- END META -->

> **功能**：在 DSH 中巡检本地或 SSH 主机容器，查看日志与资源，并提供默认只读的模型工具。

> **亮点**：可借鉴增量是将多目标巡检组织为可继续决策的Agent工具链，按目标保留部分失败和截断信息；日志交接保留发送与草稿两种责任边界。它不是单纯流程编排，但也没有证明端到端排障收益，见 [Q01](#research-q01)与[Q02](#research-q02)。

> **主要限制**：关闭allowExec只约束本插件的一次性docker_exec与HTTP exec，不能约束可选ttyTerminal承载的交互式docker exec -it；已有tty部署不能据此视为整体只读。一次性exec也实际使用sh -c，首次SSH信任与日志审计各有边界；本次试用只查列表和日志，不调用容器终端，见 [Q03](#research-q03)和[Q04](#research-q04)。

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
  - [Q01 · 谁需要会话旁容器巡检，相对CLI增加什么？](#detail-section-11)
  - [Q02 · Agent如何真实执行本地或远程查询，部分失败怎样返回？](#detail-section-12)
  - [Q03 · 默认只读和提权在哪些通道生效，关闭allowExec是否约束交互终端？](#detail-section-13)
  - [Q04 · 目标身份、日志与命令的边界是什么？](#detail-section-14)
  - [Q05 · 启动、持续与失败恢复依赖谁，成本如何承担？](#detail-section-15)
  - [Q06 · 谁值得怎样试用，停止与退出条件是什么？](#detail-section-16)
  - [Q07 · 可从当前机制推导什么新的排障交接假设？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：开发运维人员可在DSH会话旁查看容器与日志，把选定证据交给模型分析；合格结果要求目标、时间窗与截断边界正确，不把建议当故障已解决。场景和替代办法见 [Q01](#research-q01)。

原办法是用Docker CLI或SSH巡检，再人工摘录日志回到会话。容器管理来自Docker、远程传输来自SSH；本组件增加宿主接线、工具结构、面板及交接。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 容器列表与详情 | Agent和面板读取实际Docker状态 | 需要目标和daemon可达，保留截断边界 |
| 日志与资源巡检 | 查看日志、统计和事件 | 采样范围与敏感信息需检查 |
| 多目标聚合 | 分组查看可达与失败目标 | 每目标预算取消，不保证任意规模 |
| 日志投递 | 直接发送或先填会话草稿 | 直接发送触发模型轮次，不自动脱敏 |
| 条件变更与exec | 启停删和容器内命令 | 配置与宿主授权均需满足；本次不建议开启 |
| 可选交互终端 | 经ttyTerminal进入容器 | 独立于Docker一次性exec开关，本次试用不调用 |
| 使用审计 | 留下能力使用结果与命令片段 | 截断转义不是秘密脱敏 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node >=22.19.0、兼容DSH、共享kit与ssh2 | 启动必需 | Host、工具及远程执行 | package声明不代替兼容验收 |
| Docker CLI与可达daemon | 查询必需 | 容器实际状态 | 探测失败或超时，不返回已证实无容器 |
| 本地或SSH账号权限及已核目标 | 操作必需 | 访问指定主机 | 首次TOFU不等于带外身份确认 |
| Web客户端与宿主slots | 面板必需 | 巡检与日志投递 | Agent工具与界面可独立失效 |
| 宿主授权与配置开关 | 写/exec特定操作必需 | 实际变更能力 | 本次试用保持关闭，不能据提示词当沙箱 |
| tty扩展 | 交互终端可选 | 承载docker exec -it命令 | 不受Docker allowExec约束；已有tty部署不能仅凭Docker开关判断整体只读，本次不调用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户选择非关键主机、核对CLI与身份，关闭写/一次性exec且不调用容器终端 | 目标可用且敏感日志范围已知，已有tty命令面另行核对 |
| 加载 | 插件注册工具与面板，解析目标 | 不只看面板连接，核对实际工具结果 |
| 查询 | 用户或Agent读取列表和限定时间日志 | 与独立CLI核对ID、范围和截断 |
| 交接 | 用户先填草稿检查，再决定发送 | 发送会启动模型轮次，保留人工责任 |
| 退出 | 关闭面板、停用插件并查进程/SSH通道 | 出错回CLI；不得盲重试结果未知变更 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 安装、本地主机与SSH资源；金额未知 | 配目标、确认身份和核对只读结果；耗时未知 | 需要已有主机权限 |
| 持续使用 | CLI、SSH池、长流和可选模型轮次；资源及费用未知 | 检查日志敏感性和诊断证据 | 直接发送日志会消耗模型轮次 |
| 失败恢复 | 重连、重读、诊断与可能的实际变更损失；金额未知 | 区分超时与执行结果，回读后再重试 | 本次不提权变更，也不调用独立tty交互终端 |
| 退出 | 主机与备份保留资源未知 | 停用后检查工具、SSE与SSH通道 | 未实测资源最终释放 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| Agent工具执行 | 列表调用到CLI/SSH后返回结构化结果 | 外部主机实际可达与兼容 |
| 多目标巡检 | 按组保留失败并有预算取消 | 大规模连接和延迟分布 |
| 日志交接 | 草稿/直接发送接线不同 | 净节时、隐私误发率及根因准确性 |
| 权限控制 | Docker一次性写/exec默认关闭且合取授权 | 独立tty终端命令面不在该闸内；部署权限未验 |

> **思考**：关闭allowExec只约束本插件的一次性docker_exec与HTTP exec，不能约束可选ttyTerminal承载的交互式docker exec -it；已有tty部署不能据此视为整体只读。一次性exec也实际使用sh -c，首次SSH信任与日志审计各有边界；本次试用只查列表和日志，不调用容器终端，见 [Q03](#research-q03)和[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：可借鉴增量是将多目标巡检组织为可继续决策的Agent工具链，按目标保留部分失败和截断信息；日志交接保留发送与草稿两种责任边界。它不是单纯流程编排，但也没有证明端到端排障收益，见 [Q01](#research-q01)与[Q02](#research-q02)。

值得借鉴的是Runner把查询通道与结构化Docker语义分开，以及多目标逐组失败、输出完整性检查。权限开关与工具生命周期接在一起比仅隐藏按钮可靠，但exec、首次SSH信任及命令审计仍有明确边界；不能称为完整安全沙箱，见 [Q02](#research-q02)至[Q04](#research-q04)。 可选ttyTerminal是独立命令面，不能用Docker单通道能力闸概括部署权限；本次只定向查桥接与WS spawn链，没有扩成完整tty审计。

<a id="detail-section-5"></a>

### 1.4 主要限制

关闭allowExec只约束本插件的一次性docker_exec与HTTP exec，不能约束可选ttyTerminal承载的交互式docker exec -it；已有tty部署不能据此视为整体只读。一次性exec也实际使用sh -c，首次SSH信任与日志审计各有边界；本次试用只查列表和日志，不调用容器终端，见 [Q03](#research-q03)和[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

已有CLI核对能力的人可在非关键环境只观察容器列表与限定时间日志，保持Docker变更和一次性exec关闭，并且不点击或调用容器终端。关闭allowExec不能约束可选tty交互终端，已有tty部署不据此视为整体只读；终端权限需另行核对。日志先填草稿检查敏感内容；目标不符、指纹变化或范围不清时停止链路并回CLI。详见 [Q03](#research-q03)与[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

只读查询工具真实执行、多目标结果与单通道权限接线是源码事实；可选tty交互终端不受Docker一次性exec闸约束，不能据开关判断部署整体只读。任务效果与资源释放未实测，证据包仍为未验证假设。

- 已检查：作者 README、包清单、源码路径 packages/docker/README.md、packages/docker/package.json、packages/docker/src/index.ts、packages/docker/src/docker.ts、packages/docker/src/ssh-exec.ts、packages/docker/src/audit.ts、packages/docker/client-src/index.js、packages/kit/src/capability.ts、packages/kit/src/elevation.ts、packages/tty/client-src/index.js、packages/tty/src/index.ts 及固定范围 inventory；组件：packages/docker。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：INVENTORY覆盖docker子包；定向核查README、package、Host工具/权限/路由/聚合、DockerApi、Runner、本地spawn、SSH指纹、审计及客户端日志投递。另保存直接依赖kit的授权判断和确认管理器源码用于解释闸门。未全面审计所有诊断、变更、流与前端路径。 修订额外定向读取同提交tty客户端open/spawn帧及Host spawn到终端创建，用于解释可选命令面；不是把tty作为另一个已完成研究，也不引用其结论。
- 下一步：- 已检查固定版本源码和作者说明。
- 未运行Docker、SSH、目标测试、安装或真实宿主验收。
- 只读试用边界不代表写/exec或完整安全审计通过。
- 共享kit与宿主保护的实际部署状态及资源释放未验证。
- 已定向读取Docker终端到ttyTerminal、WS spawn与命令终端创建的接线；未执行利用或完整审计tty。

**分析版本**

- **仓库**：[hyzyn/dsh-plugin-kit](https://github.com/hyzyn/dsh-plugin-kit)
- **版本号**：0.15.0（[固定提交 44554d7](https://github.com/hyzyn/dsh-plugin-kit/tree/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是把直接日志投递改为可回查证据包，固定目标、容器、时间窗、截断和脱敏片段，再由模型提出下一步只读查询。额外确认是否值得，以及可推翻条件见 [Q07](#research-q07)。

- 已检查固定版本源码和作者说明。
- 未运行Docker、SSH、目标测试、安装或真实宿主验收。
- 只读试用边界不代表写/exec或完整安全审计通过。
- 共享kit与宿主保护的实际部署状态及资源释放未验证。
- 已定向读取Docker终端到ttyTerminal、WS spawn与命令终端创建的接线；未执行利用或完整审计tty。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 16 | 25696 | 18586 | 6216 | — |
| .md | source | 5 | 3037 | — | — | 74400 |
| .mjs | source | 5 | 6896 | 5334 | 1050 | — |
| .ts | source | 8 | 12169 | 8428 | 3118 | — |
| .ts | test | 32 | 12078 | 9335 | 1620 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/hyzyn/dsh-plugin-kit/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：插件是否把容器巡检接成真实Agent工具链，默认只读与授权变更能支持什么采用方式？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要会话旁容器巡检，相对CLI增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它面向在DSH里分析容器故障、同时需要看本地或SSH主机日志的开发运维人员。原办法是到终端执行docker ps、logs和inspect，再把选定证据贴回会话；合格结果是目标与容器身份明确、日志不漏掉截断提示，并由同一证据支撑诊断。插件增加的是会话旁的巡检界面、结构化模型工具和日志转交链路，Docker的容器管理能力与SSH传输均来自外部系统。

客户端可把文本直接发送到当前会话，也可只填输入框等待修改，两种动作确有不同调用。前者会启动一轮模型处理，不是单纯复制；后者才让用户在发送前检查。对只管一台主机、习惯CLI或日志敏感的人，手工摘录可能更简单。源码能支持交接入口存在，不能证明故障解决率、净节时或需求规模。

#### 证据与依据

**依据 1 · 作者声明**：[packages/docker/README.md:5-17](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/docker/README.md#L5-L17)

作者定位会话同屏巡检与日志交接。

<details>
<summary>查看原文（13行）</summary>

```text
> DSH 侧边栏「容器」面板：本机与 SSH 主机的容器一屏巡检——读日志、看资源、进容器、启停删，**默认只读**。

## 特性

- **常驻会话右侧栏**：面板作为右侧栏标签（`sidebar.right.pane.tab`）与对话**同屏**——发完错误交给 Agent
  后日志留在右边；折叠即退出视野并主动断流、把 SSH 通道还回去。面板级状态（目标 / 视图 / 过滤词 /
  选中容器及页签）**跨会话保留**；拿不到右侧栏服务的老宿主退回 dock / 模态。
- **日志右键交给 Agent**：日志页拖选报错行 → 右键「直接发送到当前会话 / 填入输入框，我先改改」，投递
  「选中的行 + 目标 / 容器 / 时间窗 + 前后各 20 行上下文」（会进模型上下文，菜单里明写留意凭证）；回执
  两处：视口级 toast，以及终端面板开着时**自动折起终端**（`ttyPanel` 契约 v2）。改稿走「填入输入框」
  ——**编辑面只有会话输入框一个**。
- **一键连接本机 / 多目标聚合取数**：两个**非常驻**入口（空态主按钮 / 目标下拉末项）一次点击就加上本机
  目标（agent 侧 `docker_connect_local`）；总览对全部 `targets[]` 并行取数，单个目标不可达只污染自己
```

</details>

**依据 2 · 源码核查**：[packages/docker/client-src/index.js:3580-3604](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/docker/client-src/index.js#L3580-L3604)

草稿走setDraft，直接发送走conversation.send，区别是真实接线。

<details>
<summary>查看原文（25行）</summary>

```text
    async function deliverToSession(prompt, mode) {
      const target = askTarget()
      if (target.ok !== true) return { ok: false, message: target.reason }
      try {
        if (mode === 'draft') {
          const input = typeof target.conversation.input?.for === 'function'
            ? target.conversation.input.for(target.actx)
            : null
          if (input === null || typeof input.setDraft !== 'function') {
            return { ok: false, message: t('error.noInputFacade') }
          }
          input.setDraft(prompt)
          notifySession(target, t('msg.logDraftFilled'))
          flashAskNotice(t('msg.filledInCurrentSession') + revealSessionSuffix(), 'ok')
          return { ok: true, message: t('msg.filledDraft') }
        }
        await target.conversation.send(prompt)
        notifySession(target, t('msg.logSentToSession'))
        flashAskNotice(t('msg.logSentToCurrentSession') + revealSessionSuffix(), 'ok')
        return { ok: true, message: t('msg.sent') }
      } catch (error) {
        return { ok: false, message: error instanceof Error ? error.message : String(error) }
      }
    }

```

</details>

#### 缺口

- 缺少同一故障任务的CLI加粘贴对照。
  **影响**：不能判定交接便利是否缩短端到端排障。
  **进一步探讨**：在脱敏故障记录上比较证据传递准确率、总耗时和人工复核。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · Agent如何真实执行本地或远程查询，部分失败怎样返回？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

docker_ps有实际execute实现，将参数解析为目标，再调用DockerApi.listContainers；后者构造docker ps参数数组并通过Runner执行，不是只返回流程建议。apiFor把目标解析结果连到createRunner，本机分支调用runLocal的spawn，SSH分支调用RemoteExec。结果解析后转换为结构化容器项，模型能够继续依据实际返回决定下一步；本轮未执行证明外部主机可达。

跨目标查询按组保留ok/error，聚合预算到期先abort该目标再返回失败，其余目标不被同一错误吞掉。列表输出超过字节上限会抛“结果不完整”，不会把截断列表当全部容器。工具结果另有分页total/truncated，因此分页和底层字节截断是不同边界。超时是未能取得结果，不等于容器不存在或命令没有副作用。

#### 证据与依据

**依据 1 · 源码核查**：[packages/docker/src/index.ts:3055-3097](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/docker/src/index.ts#L3055-L3097)

docker_ps execute调用聚合与listContainers并保留组结果。

<details>
<summary>查看原文（43行）</summary>

```text
          target?: string
          containers?: ToolPsRow[]
          total?: number
          truncated?: boolean
          groups?: Array<{ target: string; label: string; ok: boolean; error?: string; containers?: ToolPsRow[]; total?: number; truncated?: boolean }>
        }> {
          const input = (args ?? {}) as { target?: unknown; all?: unknown; limit?: unknown; offset?: unknown }
          const window = pageWindow(input)
          const isAll = typeof input.target === 'string' && input.target.trim() === '*'
          const toRow = (row: ContainerSummary): ToolPsRow => ({
            // 短 ID（D47）：docker_attention 已是 shortId，同一字段跨工具宽度要一致
            //（ps 带 --no-trunc，完整 64 位既与 README 的「短 ID」矛盾也多烧 token）
            id: row.shortId,
            name: row.name,
            image: row.image,
            state: row.state,
            status: row.status,
            ...(row.health === null ? {} : { health: row.health }),
            ports: row.ports.map((p) => (p.hostPort === undefined ? `${String(p.containerPort)}/${p.protocol}` : `${String(p.hostPort)}→${String(p.containerPort)}/${p.protocol}`)).join(','),
            // 端口为空才补 net（D131）：host 网络容器的端口即宿主机端口、ps 没有映射，
            // 空 ports 与「没暴露端口」否则无法区分。有映射时不加，避免每行都变长。
            ...(row.ports.length === 0 && row.networks.length > 0 ? { net: row.networks.join(',') } : {}),
            ...(row.composeProject === null ? {} : { composeProject: row.composeProject }),
            ...(row.composeService === null ? {} : { composeService: row.composeService }),
          })
          if (isAll || (input.target === undefined && targetsNow().length > 1)) {
            const names = targetsFor('*')
            const collected = await aggregateAcrossTargets(names, (targetApi) => targetApi.listContainers(input.all === true))
            // 跨目标分页在**组内**切（T1）：组数与「哪些目标不可达」都保持不变，
            // 每组带自己的 total / truncated —— 否则一个目标 150 个容器会把别组挤没
            return {
              groups: collected.map((group) => {
                const paged = group.data === undefined ? undefined : paginate(group.data, window)
                return {
                  target: group.target,
                  label: group.label,
                  ok: group.ok,
                  ...(group.error === undefined ? {} : { error: group.error }),
                  ...(paged === undefined ? {} : {
                    containers: paged.rows.map(toRow),
                    total: paged.total,
                    truncated: paged.truncated,
                  }),
```

</details>

**依据 2 · 源码核查**：[packages/docker/src/index.ts:1737-1745](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/docker/src/index.ts#L1737-L1745)

apiFor构造Runner及DockerApi。

```text
     */
    const apiFor = (name: string, signal?: AbortSignal): { api?: DockerApi; resolved?: ResolvedTarget; error?: string } => {
      const { resolved, error } = resolveByName(name)
      if (resolved === undefined) return { error }
      try {
        const runner = createRunner({ target: resolved, remote, logger, ...(signal === undefined ? {} : { signal }) })
        return { api: new DockerApi(runner, live.dockerBin, { timeoutMs: 30_000, maxBytes: live.maxOutputKb * 1024 }), resolved }
      } catch (error_) {
        return { error: error_ instanceof Error ? error_.message : String(error_) }
```

**依据 3 · 源码核查**：[packages/docker/src/docker.ts:1695-1732](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/docker/src/docker.ts#L1695-L1732)

完整性检查与docker ps参数构造。

<details>
<summary>查看原文（38行）</summary>

```text
  }

  /**
   * assertOk + 截断检查（D13）：列表 / 详情类方法拿到的必须是**完整**输出。
   * 只检查 code 的话，「输出被截断」会被当成「本来就这么少」——面板静默少列
   * 容器，inspect 系列更会把截断误报成「对象不存在」，把用户引向错误方向。
   *
   * `alternative` 是**这个调用方真正能执行的替代做法**（D105）：agent 改不了插件
   * 设置，「请调大 maxOutputKb」对它不可执行——ps 能改 all、stats 能传 ids、
   * events 能缩小 since。文案里还会回显当前上限（见 truncationHint）。
   */
  private assertComplete(result: ExecResult, what: string, alternative?: string): void {
    this.assertOk(result, what)
    if (result.truncated) {
      throw new Error(`${what}的输出${this.truncationHint(alternative)}`)
    }
  }

  /**
   * 截断提示的统一文案（D105）：带上当前上限（KB）与目标标签——只说「超过上限」
   * 无法判断差多少；再拼上调用方的可执行替代做法。
   * 不抛错的路径（imageInspect 的 history，D104）复用同一句话，保持口径一致。
   */
  private truncationHint(alternative?: string): string {
    const limitKb = Math.round(this.limits.maxBytes / 1024)
    const suggest =
      alternative === undefined || alternative === ''
        ? '调大「单次命令输出上限」（maxOutputKb）'
        : `${alternative}；或调大「单次命令输出上限」（maxOutputKb）`
    return `因超过上限被截断（目标 ${this.runner.label}，当前上限 ${limitKb} KB）：结果不完整。请${suggest}后重试`
  }

  async listContainers(all: boolean): Promise<ContainerSummary[]> {
    const argv = [this.bin, 'ps', ...(all ? ['-a'] : []), '--no-trunc', '--format', '{{json .}}']
    const result = await this.runner.run(argv, { timeoutMs: this.limits.timeoutMs, maxBytes: this.limits.maxBytes })
    this.assertComplete(result, '列出容器', '改传 all=false（默认只看运行中的容器）')
    return parsePsJson(result.stdout)
  }
```

</details>

**依据 4 · 源码核查**：[packages/docker/src/docker.ts:2645-2679](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/docker/src/docker.ts#L2645-L2679)

本地与SSH Runner两分支。

<details>
<summary>查看原文（35行）</summary>

```text
export function createRunner(options: {
  target: ResolvedTarget
  remote: RemoteExec
  logger: ExecLogger
  signal?: AbortSignal
}): Runner {
  const { target, remote, logger } = options
  const signal = options.signal
  /**
   * 把构造期绑定的 `signal` 并进单次调用的选项。调用方**自带** signal 时以它为准
   * （当前无调用点传，留给将来单命令级的取消）；否则用聚合绑定的那个。
   * 都不传时返回原样，避免多造一个对象。
   */
  const withSignal = (runOptions?: RunnerRunOptions): RunnerRunOptions => {
    const merged = runOptions?.signal ?? signal
    return merged === undefined ? (runOptions ?? {}) : { ...runOptions, signal: merged }
  }
  if (target.kind === 'local') {
    return {
      label: `本机（${target.name}）`,
      run: (argv, runOptions) => runLocal(argv, withSignal(runOptions)),
      // 长流**不**接聚合信号：它的取消由面板的 SSE 关闭单独驱动（见 runLocalStream 的文档）。
      stream: (argv, handlers, signal_) => runLocalStream(argv, handlers, signal_),
    }
  }
  const spec = target.spec
  if (spec === undefined) throw new Error(`目标 ${target.name} 缺少 SSH 规格`)
  return {
    label: `${sshTarget(spec)}（${target.name}）`,
    run: (argv, runOptions) => remote.run(spec, argv, withSignal(runOptions)),
    stream: (argv, handlers, signal_) => remote.stream(spec, argv, handlers, signal_),
  }
}

/**
```

</details>

**依据 5 · 源码核查**：[packages/docker/src/ssh-exec.ts:1689-1721](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/docker/src/ssh-exec.ts#L1689-L1721)

本地argv进入spawn，没有shell拼接。

<details>
<summary>查看原文（33行）</summary>

```text
 * 用于 kind=local 的目标：宿主所在机器的 docker CLI。
 */
export async function runLocal(argv: readonly string[], options?: ExecOptions): Promise<ExecResult> {
  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS
  const maxBytes = options?.maxBytes ?? DEFAULT_MAX_BYTES
  const started = Date.now()
  const [bin, ...args] = argv
  if (bin === undefined) throw new Error('runLocal 需要至少一个 argv 元素')
  /*
   * 已经 abort 了就别再 spawn（D161）：外层预算到点时不该再拉起一个注定被杀的进程，
   * 少一次 fork 就少一次「杀了还赖着不放管道」的机会。返回 null code 与「被中止」
   * 同义——调用方的 assertOk 会把它变成明确的失败，不会静默当成功。
   */
  if (options?.signal?.aborted === true) {
    return { code: null, stdout: '', stderr: '', timedOut: false, truncated: false, durationMs: 0 }
  }

  return await new Promise<ExecResult>((resolve, reject) => {
    const stdoutSink = new ByteSink(maxBytes, options?.keepTail === true, options?.lineAlign === true)
    const stderrSink = new ByteSink(maxBytes, options?.keepTail === true, options?.lineAlign === true)
    const stdoutDecoder = new StringDecoder('utf8')
    const stderrDecoder = new StringDecoder('utf8')
    let timedOut = false
    let settled = false
    /** 打断只做一次：abort 与 timeout 谁先到谁生效，另一个不许再把 `timedOut` 翻上去。 */
    let interrupted = false
    let reapTimer: NodeJS.Timeout | null = null
    /** 摘掉 abort 监听（D161）：命令收尾后 signal 还活着，不摘就是一条悬着的闭包链。 */
    let cleanupAbort: () => void = () => {}

    const child = spawn(bin, args, { stdio: ['pipe', 'pipe', 'pipe'], env: process.env })

    /** 到点收尾（正常 close 与「杀了还赖着不放管道」两条路径共用）。 */
```

</details>

**依据 6 · 源码核查**：[packages/docker/src/index.ts:1978-2027](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/docker/src/index.ts#L1978-L2027)

目标级abort预算和错误分组。

<details>
<summary>查看原文（50行）</summary>

```text
    const aggregateAcrossTargets = async <T>(
      names: readonly string[],
      run: (api: DockerApi, name: string) => Promise<T>,
    ): Promise<Array<TargetGroup<T>>> => {
      return await mapLimit(names, AGG_CONCURRENCY, async (name): Promise<TargetGroup<T>> => {
        /*
         * 控制器必须建在 `run()` **之前**（D161）：Runner 是在 `apiFor` 里构造的，signal
         * 当场绑到 Runner 上（见 createRunner）。先跑再建的话，abort 时底层根本不知道
         * 自己被取消——那正是修复前的行为。
         */
        const controller = new AbortController()
        const budget = aggTimeoutMs()
        const built = apiFor(name, controller.signal)
        const resolved = built.resolved
        const label = resolved === undefined
          ? name
          : (resolved.kind === 'local' ? '本机' : sshTarget(resolved.spec as SshSpec))
        if (built.api === undefined) {
          controller.abort()
          return { target: name, label, ok: false, error: built.error ?? '无法构造执行通道' }
        }
        const api = built.api
        let timer: NodeJS.Timeout | null = null
        try {
          const timeout = new Promise<never>((_resolve, reject) => {
            timer = setTimeout(() => {
              /*
               * 顺序是**先取消、后拒绝**（D161）：反过来的话调用方在 reject 的那一刻就拿到
               * `ok:false` 返回了，而底层（本地子进程 / SSH channel）还在跑——用户看到的是
               * 「这一格失败了」，实际那条 inspect 还占着远端的 session 槽，后续短命令被拒。
               */
              controller.abort()
              reject(new Error(`聚合超时（>${String(budget / 1000)}s）`))
            }, budget)
            timer.unref?.()
          })
          const data = await Promise.race([run(api, name), timeout])
          return { target: name, label, ok: true, data }
        } catch (error) {
          return { target: name, label, ok: false, error: error instanceof Error ? error.message : String(error) }
        } finally {
          if (timer !== null) clearTimeout(timer)
          /*
           * race 另一侧赢（命令正常跑完 / 抛错）时也要兜底取消：`abort()` 是幂等的，命令
           * 已 settle 时它是**无害的空操作**（监听器在收尾时已摘掉），但漏了这一句就会留下
           * 「signal 永不 abort、挂在它上面的闭包链不放」的尾巴。
           */
          controller.abort()
        }
      })
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 默认只读和提权在哪些通道生效，关闭allowExec是否约束交互终端？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

配置默认关闭变更与一次性exec，normalizeConfig把有效开关折叠为“配置为true且宿主授权已授予”。refreshTools只在相应有效开关打开时注册docker_exec与变更工具，execute再次核对开关；Web一次性exec路由也检查有效值。宿主授权可来自启动环境或带外确认，页面开关本身不是授权。共享kit的随机文件挑战在发现确认文件后授予能力。本轮核实了这些调用和直接依赖，不将其称为完整权限安全验收。

这把闸只约束本插件自持的docker_exec与HTTP一次性exec，不约束可选tty交互终端。Docker客户端openExec在生成docker exec -it命令后，按目标构造options并调用ttyTerminal.open或准备mount，整个分支没有检查config.allowExec；ttyTerminal由可选服务注入。进一步读取同提交tty客户端可见open将任意单行command放入spawnSpec并经spawnTab发WS创建帧；tty Host解析command后交给createLocalSession，再调用命令生成与subprocess.spawnTerminal。因此安装并启用tty终端能力的部署，即使Docker一次性exec关闭，仍可经另一通道进入容器执行交互命令。这里是实际源码接线和部署边界判断，没有执行攻击或声称已利用漏洞，也没有全面审计tty其他权限条件。

两种exec都不能被解释为只读沙箱：一次性exec实际是容器内sh -c，工具文字要求避免破坏不是命令语义限制；交互终端也能继续执行命令。工具会话档位闸只适用于它管辖的工具面，不能推广为整个部署的命令权限。此次试用只观察列表和限定日志，不点击或调用容器终端；已有tty部署必须另核对终端通道，不能仅凭两开关关闭就认定整体只读。

#### 证据与依据

**依据 1 · 源码核查**：[packages/docker/src/index.ts:192-202](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/docker/src/index.ts#L192-L202)

默认能力开关关闭。

<details>
<summary>查看原文（11行）</summary>

```text
export const Config: z = z.object({
  enabled: z.boolean().default(true).volatile(),
  announceToAgent: z.boolean().default(true).volatile(),
  dockerBin: z.string().default('docker').volatile(),
  allowMutations: z.boolean().default(false).volatile(),
  allowExec: z.boolean().default(false).volatile(),
  execTimeoutSec: z.natural().max(120).default(30).volatile(),
  pollIntervalSec: z.natural().max(60).default(5).volatile(),
  logTailDefault: z.natural().max(5000).default(200).volatile(),
  maxOutputKb: z.natural().max(8192).default(512).volatile(),
  targets: z.array(TARGET_SCHEMA).default([]).volatile(),
```

</details>

**依据 2 · 源码核查**：[packages/docker/src/index.ts:1288-1300](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/docker/src/index.ts#L1288-L1300)

有效值是配置与宿主授权的合取。

<details>
<summary>查看原文（13行）</summary>

```text
    /*
     * **有效值 = 配置值 && 宿主授权**。折叠在这一处（而不是每个使用点各判一次）的理由：本包
     * 有二十多处按 `live.allowMutations` 决定「工具注册 / 路由放行 / 面板渲染」，散着判必然
     * 漏一处——漏掉的那处就是「没授权也能执行」。配置里的 true 不算授权：它与 HTTP 写进去的
     * 值存在同一个存储里，分不出来源，只认环境变量才是能说清的规则（升级影响见 README）。
     */
    allowMutations: section.allowMutations === true && capabilityGranted(CAP_MUTATIONS),
    allowExec: section.allowExec === true && capabilityGranted(CAP_EXEC),
    execTimeoutSec: clampInt(section.execTimeoutSec, 1, 120, 30),
    pollIntervalSec: clampInt(section.pollIntervalSec, 1, 60, 5),
    logTailDefault: clampInt(section.logTailDefault, 1, 5000, 200),
    maxOutputKb: clampInt(section.maxOutputKb, 1, 8192, 512),
    targets: targets ?? [],
```

</details>

**依据 3 · 源码核查**：[packages/docker/src/index.ts:4319-4362](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/docker/src/index.ts#L4319-L4362)

变更工具条件注册并在执行前复核。

<details>
<summary>查看原文（44行）</summary>

```text
      if (live.allowMutations) {
        add('docker_action', defineTool({
          name: 'docker_action',
          description: '对容器执行生命周期操作：start / stop / restart / remove。**破坏性**：remove 会删除容器（数据卷不在其中，但容器配置与可写层丢失），执行前必须向用户确认目标容器。仅当用户在设置里打开「允许变更操作」时可用。',
          parameters: {
            target: targetParam,
            // enum 把「四选一」前移到派发前（D51 残留）：实测 dsh-tools 的参数 DSL 支持 enum
            // （不支持的是 minimum/maximum），此前只在执行期拒绝，模型会先浪费一次往返
            action: { type: 'string', enum: ['start', 'stop', 'restart', 'remove'], required: true, description: 'start | stop | restart | remove（四选一）' },
            id: { type: 'string', required: true, description: '容器名或 ID' },
          },
          output: {
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                target: { type: 'string', required: true },
                id: { type: 'string', required: true },
                action: { type: 'string', required: true },
                message: { type: 'string', required: true },
              },
            },
            render: (_args: unknown, value: unknown) => {
              const v = value as { id?: string; action?: string; message?: string; target?: string }
              return [{ type: 'text', text: `${v.action ?? '?'} ${v.id ?? '?'}（目标 ${v.target ?? '?'}）：${v.message ?? 'ok'}` }]
            },
          },
          async execute(args: unknown): Promise<{ target: string; id: string; action: string; message: string }> {
            if (!live.allowMutations) throw new Error(mutationsOffMessage())
            const input = (args ?? {}) as { target?: unknown; action?: unknown; id?: unknown }
            const picked = pickTarget(input.target)
            if (picked.name === undefined) throw new Error(picked.error ?? '无效的 target')
            if (typeof input.id !== 'string') throw new Error('id 必填')
            const id = input.id
            const action = input.action
            if (action !== 'start' && action !== 'stop' && action !== 'restart' && action !== 'remove') {
              throw new Error('action 必须是 start / stop / restart / remove')
            }
            const { api } = apiFor(picked.name)
            if (api === undefined) throw new Error(resolveByName(picked.name).error ?? '无法构造执行通道')
            const result = await audited({ capability: 'allowMutations', source: 'tool', action: `container.${action}`, target: picked.name, ref: id }, () => api.action({ action, id }))
            return { target: picked.name, id: result.id, action: result.action, message: result.message }
          },
        }))
```

</details>

**依据 4 · 源码核查**：[packages/docker/src/index.ts:4478-4522](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/docker/src/index.ts#L4478-L4522)

exec条件注册及执行时核对。

<details>
<summary>查看原文（45行）</summary>

```text
      if (live.allowExec) {
        add('docker_exec', defineTool({
          name: 'docker_exec',
          description: '在容器内执行一条一次性命令（docker exec，无 TTY）：如 `ls -la /app`、`cat /etc/nginx/nginx.conf`、`env`。仅当用户在设置里打开「允许 exec」时可用；不要在容器里做破坏性操作，交互式排障请让用户到终端面板执行 `docker exec -it <容器> sh`。',
          parameters: {
            target: targetParam,
            id: { type: 'string', required: true, description: '容器名或 ID' },
            command: { type: 'string', required: true, description: '要执行的命令（经容器内 sh -c 执行）' },
            timeoutSec: { type: 'number', description: '超时秒数（1~120，默认取插件配置 execTimeoutSec；越界值会被静默夹紧）' },
          },
          output: {
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                target: { type: 'string', required: true },
                id: { type: 'string', required: true },
                code: { type: 'number' },
                stdout: { type: 'string', required: true },
                stderr: { type: 'string', required: true },
                truncated: { type: 'boolean' },
              },
            },
            render: (_args: unknown, value: unknown) => {
              const v = value as { id?: string; code?: number; stdout?: string; stderr?: string; truncated?: boolean }
              const parts = [`容器 ${v.id ?? '?'} 退出码 ${v.code === undefined ? '?' : String(v.code)}`]
              if ((v.stdout ?? '') !== '') parts.push('stdout:\n' + (v.stdout ?? ''))
              if ((v.stderr ?? '') !== '') parts.push('stderr:\n' + (v.stderr ?? ''))
              if (v.truncated === true) parts.push('（输出已截断）')
              return [{ type: 'text', text: parts.join('\n\n') }]
            },
          },
          async execute(args: unknown): Promise<ToolExecRow> {
            if (!live.allowExec) throw new Error(execOffMessage())
            const input = (args ?? {}) as { target?: unknown; id?: unknown; command?: unknown; timeoutSec?: unknown }
            const picked = pickTarget(input.target)
            if (picked.name === undefined) throw new Error(picked.error ?? '无效的 target')
            if (typeof input.id !== 'string') throw new Error('id 必填')
            if (typeof input.command !== 'string' || input.command.trim() === '') throw new Error('command 必填')
            const id = input.id
            const command = input.command
            const timeoutSec = typeof input.timeoutSec === 'number' && Number.isInteger(input.timeoutSec) ? input.timeoutSec : live.execTimeoutSec
            const { api } = apiFor(picked.name)
            if (api === undefined) throw new Error(resolveByName(picked.name).error ?? '无法构造执行通道')
            const result = await audited({ capability: 'allowExec', source: 'tool', action: 'exec', target: picked.name, ref: id }, () => api.exec(id, command, timeoutSec * 1000), (row) => `code=${String(row.code)} cmd=${row.command}`)
```

</details>

**依据 5 · 源码核查**：[packages/docker/src/docker.ts:2454-2475](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/docker/src/docker.ts#L2454-L2475)

exec实际调用容器内sh -c，没有命令语义只读限制。

<details>
<summary>查看原文（22行）</summary>

```text
  /** 一次性 exec（无 TTY）：`docker exec <id> sh -c <command>`。 */
  async exec(id: string, command: string, timeoutMs?: number): Promise<{ id: string; command: string; code: number | null; stdout: string; stderr: string; truncated: boolean; durationMs: number }> {
    const safe = assertRef(id, 'container')
    if (typeof command !== 'string' || command.trim() === '') throw new Error('command 不能为空')
    if (command.length > 8000) throw new Error('command 过长（≤8000 字符）')
    const result = await this.runner.run([this.bin, 'exec', safe, 'sh', '-c', command], {
      timeoutMs: Math.min(Math.max(timeoutMs ?? 30_000, 1_000), 120_000),
      maxBytes: this.limits.maxBytes,
    })
    if (result.timedOut) throw new Error(`exec 超时（${String(Math.round(result.durationMs / 1000))}s）：${safe}`)
    return {
      id: safe,
      command,
      code: result.code,
      stdout: result.stdout,
      stderr: result.stderr,
      truncated: result.truncated,
      durationMs: result.durationMs,
    }
  }

  /* ---------------------------------------------------------------- *
```

</details>

**依据 6 · 源码核查**：[packages/docker/src/index.ts:4534-4542](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/docker/src/index.ts#L4534-L4542)

会话档位闸接线。

```text
      // 档位闸与工具同生命周期：refreshTools 幂等重建时随 toolDisposers 一起撤下/重挂
      // （禁用热生效时工具与闸一起撤；机制见 kit 的 tier-gate.ts，方案见 docs/permission-tier-plan.md）。
      toolDisposers.push(attachTierGate(ctx, {
        pkg: 'docker',
        prefixes: DOCKER_TIER_PREFIXES,
        classify: (tool) => DOCKER_TIER_CLASS[tool],
      }))
      if (failures.length > 0) {
        console.warn(`[dsh-docker] ${String(failures.length)} 个 agent 工具注册失败（下次配置变更会重试）：${failures.join('；')}`)
```

**依据 7 · 源码核查**：[packages/kit/src/elevation.ts:155-169](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/kit/src/elevation.ts#L155-L169)

宿主确认文件存在后消费并grant。

<details>
<summary>查看原文（15行）</summary>

```text
  const probe = (env: string): void => {
    const challenge = challenges.get(env)
    if (challenge === undefined) return
    if (now() >= challenge.expiresAt) {
      removeFile(challenge.path)
      stopChallenge(challenge)
      audit('expire', env)
      return
    }
    if (!existsSync(challenge.path)) return
    // 先消费再授权：即使删文件失败也不该反复触发（挑战马上就被清掉）
    removeFile(challenge.path)
    store.grant(env)
    stopChallenge(challenge)
    audit('grant', env)
```

</details>

**依据 8 · 源码核查**：[packages/kit/src/elevation.ts:194-221](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/kit/src/elevation.ts#L194-L221)

挑战随机名、时效与返回确认命令。

<details>
<summary>查看原文（28行）</summary>

```text
    begin(env: string): ElevationBegin {
      const grantedVia = store.has(env) ? store.source?.(env)?.via ?? 'file' : undefined
      if (grantedVia !== undefined) return { status: 'granted', via: grantedVia }

      const existing = challenges.get(env)
      if (existing !== undefined && now() < existing.expiresAt) {
        return { status: 'pending', command: commandFor(platform, existing.path), expiresAt: existing.expiresAt, reused: true }
      }
      if (existing !== undefined) {
        // 过期的挑战先收尾（清定时器 + 删残留文件），再考虑新建
        removeFile(existing.path)
        stopChallenge(existing)
      }

      const wait = rateLimitWait(env)
      if (wait > 0) return { status: 'rate-limited', retryAfterMs: wait }

      const failure = ensureDir()
      if (failure !== undefined) return { status: 'error', error: `无法创建确认目录 ${confirmDir}：${failure}` }

      const path = join(confirmDir, randomBytes(16).toString('hex'))
      const expiresAt = now() + ttlMs
      const timer = setInterval(() => probe(env), probeIntervalMs)
      // unref：定时器不该把宿主进程（或测试进程）钉住不退出
      timer.unref?.()
      challenges.set(env, { env, path, expiresAt, timer })
      begins.set(env, [...(begins.get(env) ?? []), now()])
      audit('begin', env)
```

</details>

**依据 9 · 源码核查**：[packages/docker/client-src/index.js:1438-1443](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/docker/client-src/index.js#L1438-L1443)

交互终端命令被构造为docker exec -it。

```text
const EXEC_COMMAND_PREFIX = "docker exec -it '"

function buildExecCommand(name) {
  const safe = String(name).replaceAll("'", "'\\''")
  return EXEC_COMMAND_PREFIX + safe + "' sh"
}
```

**依据 10 · 源码核查**：[packages/docker/client-src/index.js:8326-8392](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/docker/client-src/index.js#L8326-L8392)

openExec直接使用terminalApi，不以allowExec门控。

<details>
<summary>查看原文（67行）</summary>

```text
      const openExec = (item) => {
        const command = buildExecCommand(item.name)
        if (terminalApi === null) {
          // 区分两种原因：tty 未安装（没有终端面板入口）还是版本过旧（面板在、但没有
          // ttyTerminal 服务）。提示要能直接指导用户下一步做什么。
          const ttyInstalled = document.querySelector('[data-dsh-tty-entry]') !== null
          copyExecCommand(item, ttyInstalled
            ? t('hint.ttyOutdated')
            : t('hint.ttyNotInstalled'))
          return
        }
        const cfg = (config?.targets ?? []).find((entry) => entry.name === target)
        const label = item.name + ' · exec'
        // 组装 tty 的 options：book > spec > 本机（与 ttyTerminal 的约定一致）；
        // 内联目标用 key/password 时浏览器端拿不到凭证 → null，走复制兜底
        const options = (() => {
          if (cfg === undefined || cfg.kind === 'local') return { command, label }
          if (typeof cfg.book === 'string' && cfg.book !== '') return { book: cfg.book, command, label }
          if ((cfg.auth ?? 'agent') === 'agent') {
            return {
              spec: { host: cfg.host, port: cfg.port, username: cfg.username, auth: 'agent', agentForward: cfg.agentForward === true },
              command,
              label,
            }
          }
          return null
        })()
        if (options === null) {
          copyExecCommand(item, t('hint.inlineCreds'))
          return
        }
        // 0) 借 tty 面板开标签的两种情形——不就地嵌抽屉：
        //    - dock：面板已经长在 tty 面板里，再嵌一层就成了「终端套面板套终端」；
        //    - tab（**普通宽度**）：栏宽通常不够跑 shell，硬塞进去两头难受。
        //    右侧栏**铺满**时走下面的就地嵌入：那时宽度够，而且日志与 shell 同屏
        //    （看日志 → 进容器的上下文不断，这正是抽屉存在的意义）。
        if (props.docked === true || (props.carrier === 'tab' && props.tabFullscreen !== true)) {
          try {
            terminalApi.open(options)
          } catch (error) {
            copyExecCommand(item, error instanceof Error ? error.message : String(error))
          }
          return
        }
        // 1) 就地嵌入（契约版本 2 才保证有 mount）
        if (typeof terminalApi.mount === 'function' && Number(terminalApi.version ?? 0) >= 2) {
          setExec({ label, options })
          setExecFold(false) // 换容器时展开：新会话总该看得见
          return
        }
        // 2) 借 tty 弹窗承载
        try {
          terminalApi.open(options)
          props.onClose()
        } catch (error) {
          copyExecCommand(item, error instanceof Error ? error.message : String(error))
        }
      }

      /** 清掉某个容器的「执行中」标记（幂等；没标就不动引用，省一次渲染）。 */
      const clearPending = (id) => setPending((map) => {
        if (map[id] === undefined) return map
        const next = { ...map }
        delete next[id]
        return next
      })

```

</details>

**依据 11 · 源码核查**：[packages/docker/client-src/index.js:10835-10841](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/docker/client-src/index.js#L10835-L10841)

ttyTerminal可选服务被注入，形成另一命令通道。

```text
      // 终端能力（可选）：tty 0.14.0 起提供 ttyTerminal 服务，卡片「终端」按钮
      // 直接开一个标签跑 `docker exec -it <容器> sh`；拿不到就退回复制命令
      ctx.inject(['ttyTerminal'], (terminalCtx) => {
        terminalApi = terminalCtx.ttyTerminal ?? null
        return () => { terminalApi = null }
      })

```

**依据 12 · 源码核查**：[packages/tty/client-src/index.js:12953-12987](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/client-src/index.js#L12953-L12987)

ttyTerminal.open接收command并生成终端标签。

<details>
<summary>查看原文（35行）</summary>

```text
      const disposeTerminal = ctx.provide('ttyTerminal', {
        /** 契约版本：1 = open；2 = 增加 mount（就地嵌入）；3 = open 默认复用同连接同命令的标签。 */
        version: 3,
        /**
         * 新开标签并执行命令。options：
         *   command（必填，单行）· book（连接簿条目名，走 SSH）·
         *   spec（内联 SSH 字段，走 SSH）· label（标签名）· cwd（本地标签工作目录）·
         *   reuse（默认 true：同「连接 + 命令」已有活标签就聚焦它，不再新开）
         * 三者互斥：book > spec > 本地。返回被打开或被复用的标签。
         */
        open(options) {
          // 插件禁用时不提供终端能力（服务端 WS 闸门也会拒绝 spawn）
          if (!entryVisible) return
          const command = normalizeTerminalCommand(options)
          const spawnSpec = buildTerminalSpec(options, command)
          const label = typeof options?.label === 'string' && options.label !== '' ? options.label : undefined
          ensureStyle()
          /*
           * 复用：同一个「连接 + 命令」再开一次 = **聚焦已有标签**，不再堆一个重复的。
           *
           * 动机是实测：容器卡片「终端」按钮连点几下就冒出三个一模一样的 exec 标签，而每个
           * 标签各占一个会话名额——并发上限被白白吃光，接着满屏都是「会话数已达上限」。
           * 真想要并列两个同样的会话，传 `reuse: false` 显式声明。
           */
          if (options?.reuse !== false) {
            const existing = findReusableTab(spawnSpec)
            if (existing !== null) {
              ensureModalVisible()
              switchTab(existing.sid, { user: true })
              return existing
            }
          }
          // 最小化中也要恢复（否则标签加进隐藏的弹窗里，用户看到"点了没反应"）
          ensureModalVisible()
          return addTab(spawnSpec, label)
```

</details>

**依据 13 · 源码核查**：[packages/tty/client-src/index.js:4409-4424](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/client-src/index.js#L4409-L4424)

command仅限制单行，生成spawn/ssh帧。

<details>
<summary>查看原文（16行）</summary>

```text
 * 校验并规范化 ttyTerminal 的 command：必填、单行（宿主包装层按单行拼接）。
 * open 与 mount 共用，保证两个入口的入参约束一致。
 */
function normalizeTerminalCommand(options) {
  const command = typeof options?.command === 'string' ? options.command.trim() : ''
  if (command === '') throw new Error(t('error.terminalNeedsCommand'))
  if (/[\r\n\0]/.test(command)) throw new Error(t('error.terminalCommandSingleLine'))
  return command
}

/** 由 options 组装创建帧：book > spec > 本地（三者互斥），与 open 语义一致。 */
function buildTerminalSpec(options, command) {
  if (typeof options?.book === 'string' && options.book !== '') return { t: 'ssh', name: options.book, command }
  if (options?.spec !== null && typeof options?.spec === 'object') return { t: 'ssh', ...options.spec, command }
  return { t: 'spawn', ...(typeof options?.cwd === 'string' && options.cwd !== '' ? { cwd: options.cwd } : {}), command }
}
```

</details>

**依据 14 · 源码核查**：[packages/tty/client-src/index.js:4223-4244](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/client-src/index.js#L4223-L4244)

标签规格包含command并发送WS帧。

<details>
<summary>查看原文（22行）</summary>

```text
function spawnTab(tab) {
  warnStrippedCredentials(tab)
  // D79：容器还没可见（或探测结果退化）时**不能**把 proposeDimensions 的值当尺寸发
  // ——以前这里只在 `undefined` 时回落，NaN / 2×N 会照发，宿主夹成下限 ⇒ 新会话以
  // 2×2 开局。优先复用本标签上一次有效尺寸，其次 80×24（与宿主缺省一致）。
  const probed = probeFitSize(tab)
  if (probed !== undefined) tab.lastDims = probed
  const dims = probed !== undefined ? probed : tab.lastDims !== undefined ? tab.lastDims : { cols: FALLBACK_COLS, rows: FALLBACK_ROWS }
  const frame = {
    ...tab.spawnSpec,
    sid: tab.sid,
    cols: dims.cols,
    rows: dims.rows,
  }
  if (socket === null || socket.readyState !== WebSocket.OPEN) {
    // 连接还没就绪：挂起，onopen 后补发。嵌入式终端是「冷启动」的（面板没开也可能
    // 被挂载），必然走到这条路径；面板流程下创建帧本来就在 onopen 之后发。
    pendingSpawns.add({ tab, frame })
    return
  }
  sendFrame(frame)
}
```

</details>

**依据 15 · 源码核查**：[packages/tty/src/index.ts:3676-3726](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/src/index.ts#L3676-L3726)

WS spawn解析command并交给createLocalSession。

<details>
<summary>查看原文（51行）</summary>

```text
        // 宿主重启后重开标签按同名 attach 回原 tmux 会话
        // 命令标签（0.14.0）：直接跑一条命令，不做 tmux 持久化（命令短命）
        const parsedCommand = sanitizeCommand(msg.command)
        if (parsedCommand.error !== undefined) {
          send(ws, { t: 'error', sid, m: parsedCommand.error })
          return
        }
        const command = parsedCommand.command ?? null
        const persistName = command === null && msg.persist === true && this.options.persistence === 'tmux'
          ? sanitizePersistName(msg.persistName, sid)
          : null
        // 跨窗口共享（0.10.1）：同 tmuxName 的宿主会话还活着（别的窗口接回过，
        // 或同刻并发恢复的在途创建）时不再新建 PTY，本连接重绑定到它——
        // 单 PTY 多客户端扇出，名额不翻倍
        if (persistName !== null) {
          const existing = (this.sessions.findByTmuxName(persistName) ?? (await this.waitPendingTmux(persistName))) ?? null
          if (existing !== null) {
            if (!conn.open) return // 等待在途创建期间连接断了：不往死连接上绑
            // 跨窗口共享的同一条 tmux 会话只有**一个** hidden 位：以本次帧为准（后写胜），
            // 与 `hidden` 帧同一条规则——不给共享会话另立一套语义
            this.setHiddenFromAgent(existing, msg.hidden === true)
            this.rebindClient(existing, sid, ws, local, conn.id)
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
```

</details>

**依据 16 · 源码核查**：[packages/tty/src/index.ts:3474-3490](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/tty/src/index.ts#L3474-L3490)

命令路径进入buildCommandSpawn，而非只读命令列表。

<details>
<summary>查看原文（17行）</summary>

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
```

</details>

**依据 17 · 源码核查**：[packages/kit/src/capability.ts:47-56](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/kit/src/capability.ts#L47-L56)

共享闸门明确只覆盖自己管辖的通道，与实际接线一致。

<details>
<summary>查看原文（10行）</summary>

```text
 * 管辖的那条通道**，不闸同部署里等价的其它入口。实例：docker 的 `allowExec` 管的是 `/exec` 与
 * `docker_exec`（本插件自持的一次性 exec），而容器卡片「终端」按钮跑 `docker exec -it`、经 tty 的
 * `ttyTerminal` / WS `spawn` 承载——那条通道不检查 `allowExec`，**页内脚本**由此可以直接拿到比
 * 一次性 exec 更强的任意命令面（tty 的 `spawn` 帧接受任意 `command`）。所以「页内脚本被拦」这句话
 * 只在**被闸的那条通道**上成立；要评估一个部署的真实命令面，得把所有装了的能力面一起看
 * （docker README「已知限制」与 `docs/architecture.md` 的 § 7 各写了一份；两者都是仓内路径，
 * 随包发布后不保证可点）。这不是本层的漏洞，但**不许**在对外文案里把它说成「exec 一律需要授权」。
 */
import type { CapabilityGrantSource, CapabilityGrantVia } from './grant-store.js'

```

</details>

#### 缺口

- 未全面核实tty部署自身的WS访问、命令权限和最终进程环境。
  **影响**：不能把本次Docker能力闸核查推广为整个部署只读或安全隔离。
  **进一步探讨**：对实际启用的tty终端通道单独核对访问条件与命令面，再判断部署权限；本轮试用不调用该通道。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 目标身份、日志与命令的边界是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

多目标时单目标操作必须明确目标名，错误类型不会回落到默认主机；聚合只在支持的查询里接受星号。这能降低误打主机的机会，但不能取代操作者核对Docker context与远程身份。SSH主机指纹采用首次信任：没有记录时接受并保存，之后不匹配拒绝；首次连接并没有带外验证真实主机，不能称为已经确认身份。

日志交给模型会把其内容放进会话，直接发送和草稿两条路径不自动脱敏，敏感日志应先选草稿检查。使用审计会把exec命令写到detail，sanitizeAuditValue只是截断和控制字符转义，不识别密码或令牌，因此不应在命令中内联秘密；错误文案也可能落入日志。与之相对，输出保留truncated字段是有用的证据边界，用户仍需核对采样时间和日志范围，不能把看到了日志等同完整根因。

#### 证据与依据

**依据 1 · 源码核查**：[packages/docker/src/index.ts:1755-1780](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/docker/src/index.ts#L1755-L1780)

目标类型和多目标默认策略。

<details>
<summary>查看原文（26行）</summary>

```text
    /** 解析工具/路由里的 target 参数。 */
    const pickTarget = (input: unknown): { name?: string; error?: string } => {
      if (typeof input === 'string' && input.trim() !== '') {
        const name = input.trim()
        // `*` 聚合只有 docker_ps / docker_attention 支持（D46）：到这里说明是单目标
        // 工具传了 `*`——给专门文案，而不是一句「未知目标：*」
        if (name === '*') return { error: '`*`（全部目标）只有 docker_ps / docker_attention 支持；请传具体目标名（docker_targets 列出）' }
        return { name }
      }
      // 类型不对（数字 / 数组 / 对象）必须报错（D34）：静默回落到默认目标会让
      // 破坏性操作打错主机的最后一道防线失效
      if (input !== undefined && input !== null && typeof input !== 'string') {
        return { error: 'target 必须是字符串（目标名见 docker_targets）' }
      }
      const fallback = defaultTargetName()
      if (fallback !== undefined) return { name: fallback }
      const list = targetsNow()
      if (list.length === 0) return { error: '尚未配置任何 Docker 目标：可调 docker_connect_local 一键加上本机目标，或到 插件配置 → Docker 容器面板 添加' }
      return { error: 'target 必填（已配置多个目标：' + list.map((item) => item.name).join('、') + '）' }
    }

    /* ---------- 一键连接本机（面板按钮 / HTTP 路由 / agent 工具共用这一份实现） ---------- */

    /**
     * 探测失败 → 给用户的一句话（这次探测的 bin 以**配置里的 `dockerBin`** 为准）。
     *
```

</details>

**依据 2 · 源码核查**：[packages/docker/src/ssh-exec.ts:1652-1681](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/docker/src/ssh-exec.ts#L1652-L1681)

首次指纹接受与已知指纹不匹配拒绝。

<details>
<summary>查看原文（30行）</summary>

```text
/** TOFU 主机指纹策略（hostVerifier 接线）；mismatchMessage() 供错误路径取人类可读拒绝原因。 */
export function applyHostKeyPolicy(options: {
  connectConfig: ConnectConfig
  spec: SshSpec
  store?: HostKeyStore
  logger?: ExecLogger
  target: string
}): { mismatchMessage(): string | null } {
  const { connectConfig, spec, store, logger, target } = options
  const port = spec.port ?? 22
  let hostKeyMismatch: string | null = null
  connectConfig.hostVerifier = (hash: string) => {
    // host 键统一 trim + 小写（D03）：tty 落盘时把 host 小写化，比较口径必须一致
    const host = spec.host.trim().toLowerCase()
    const known = store?.get(host, port)
    if (known === undefined || known.length === 0) {
      store?.record(host, port, hash)
      logger?.info(`[dsh-docker] ssh ${target} 首次连接，已记录 host key 指纹 sha256:${hash}（TOFU）`)
      return true
    }
    // 命中集合内**任意**一条指纹即放行：同一主机的 rsa / ed25519 各记一条（D03）
    if (known.includes(hash)) return true
    hostKeyMismatch =
      `SSH 主机密钥指纹变更：${target} 已记录 sha256:${known.join(' / ')}，本次为 sha256:${hash}。` +
      '可能是主机重装或换钥匙，也可能是中间人（MITM）冒充；确认安全后，到 插件配置 → Docker 容器面板 → SSH 主机密钥记录 删除该主机再重连。'
    logger?.warn(`[dsh-docker] ${hostKeyMismatch}`)
    return false
  }
  return { mismatchMessage: () => hostKeyMismatch }
}
```

</details>

**依据 3 · 源码核查**：[packages/docker/client-src/index.js:3580-3604](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/docker/client-src/index.js#L3580-L3604)

发送/草稿直接传入prompt，无自动脱敏步骤。

<details>
<summary>查看原文（25行）</summary>

```text
    async function deliverToSession(prompt, mode) {
      const target = askTarget()
      if (target.ok !== true) return { ok: false, message: target.reason }
      try {
        if (mode === 'draft') {
          const input = typeof target.conversation.input?.for === 'function'
            ? target.conversation.input.for(target.actx)
            : null
          if (input === null || typeof input.setDraft !== 'function') {
            return { ok: false, message: t('error.noInputFacade') }
          }
          input.setDraft(prompt)
          notifySession(target, t('msg.logDraftFilled'))
          flashAskNotice(t('msg.filledInCurrentSession') + revealSessionSuffix(), 'ok')
          return { ok: true, message: t('msg.filledDraft') }
        }
        await target.conversation.send(prompt)
        notifySession(target, t('msg.logSentToSession'))
        flashAskNotice(t('msg.logSentToCurrentSession') + revealSessionSuffix(), 'ok')
        return { ok: true, message: t('msg.sent') }
      } catch (error) {
        return { ok: false, message: error instanceof Error ? error.message : String(error) }
      }
    }

```

</details>

**依据 4 · 源码核查**：[packages/docker/src/audit.ts:114-155](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/docker/src/audit.ts#L114-L155)

审计仅截断、转义后打印detail。

<details>
<summary>查看原文（42行）</summary>

```text
export function sanitizeAuditValue(text: string, maxChars: number = AUDIT_DETAIL_MAX_CHARS): string {
  let value = text
  let truncated = false
  if (value.length > maxChars) {
    value = value.slice(0, maxChars)
    truncated = true
  }
  let out = ''
  for (const char of value) {
    if (char === '\\') out += '\\\\'
    else if (char === '\n') out += '\\n'
    else if (char === '\r') out += '\\r'
    else if (char === '\t') out += '\\t'
    else {
      const code = char.codePointAt(0) ?? 0
      // 其余 C0/C1 控制字符（含 DEL）：十六进制字面量，保住「一行一次事件」
      out += code < 0x20 || code === 0x7f ? `\\x${code.toString(16).padStart(2, '0')}` : char
    }
  }
  return truncated ? out + '…' : out
}

/** 把一条使用审计行打到宿主 stdout（出口取舍见文件头「出口为什么是 console」，docker D162）。 */
export function auditCapabilityUse(fields: CapabilityUseLine): void {
  const parts = [
    `capability=${fields.capability}`,
    `source=${fields.source}`,
    `action=${fields.action}`,
    `target=${sanitizeAuditValue(fields.target)}`,
  ]
  if (fields.ref !== undefined && fields.ref !== '') parts.push(`ref=${sanitizeAuditValue(fields.ref)}`)
  if (fields.event !== undefined) parts.push(`event=${fields.event}`)
  if (fields.ok !== undefined) parts.push(`ok=${fields.ok ? 'true' : 'false'}`)
  if (fields.durationMs !== undefined) parts.push(`durationMs=${String(Math.max(0, Math.round(fields.durationMs)))}`)
  if (fields.reason !== undefined) parts.push(`reason=${sanitizeAuditValue(fields.reason)}`)
  if (fields.code !== undefined && fields.code !== null) parts.push(`code=${String(fields.code)}`)
  if (fields.detail !== undefined) parts.push(`detail=${sanitizeAuditValue(fields.detail)}`)
  console.log(`[dsh-docker] capability-use: ${parts.join(' ')}`)
}

/**
 * 包一层变更 / exec 调用：计时 → try/catch → 审计（成功与失败都记）→ 失败原样 rethrow。
```

</details>

**依据 5 · 源码核查**：[packages/docker/src/index.ts:4511-4522](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/docker/src/index.ts#L4511-L4522)

exec结果detail包含命令文本。

<details>
<summary>查看原文（12行）</summary>

```text
            if (!live.allowExec) throw new Error(execOffMessage())
            const input = (args ?? {}) as { target?: unknown; id?: unknown; command?: unknown; timeoutSec?: unknown }
            const picked = pickTarget(input.target)
            if (picked.name === undefined) throw new Error(picked.error ?? '无效的 target')
            if (typeof input.id !== 'string') throw new Error('id 必填')
            if (typeof input.command !== 'string' || input.command.trim() === '') throw new Error('command 必填')
            const id = input.id
            const command = input.command
            const timeoutSec = typeof input.timeoutSec === 'number' && Number.isInteger(input.timeoutSec) ? input.timeoutSec : live.execTimeoutSec
            const { api } = apiFor(picked.name)
            if (api === undefined) throw new Error(resolveByName(picked.name).error ?? '无法构造执行通道')
            const result = await audited({ capability: 'allowExec', source: 'tool', action: 'exec', target: picked.name, ref: id }, () => api.exec(id, command, timeoutSec * 1000), (row) => `code=${String(row.code)} cmd=${row.command}`)
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、持续与失败恢复依赖谁，成本如何承担？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

启动需要兼容DSH、共享kit、ssh2及Web客户端；实际查询还需要宿主可运行Docker CLI且daemon可达，本地权限或SSH账号须允许读取相应资源。SSH和容器管理权限来自用户环境，插件不替代主机授权。tty是可选的终端承载，已核只读查询Runner不依赖其PTY；不因此宣称其他协作接口已经运行兼容。

首次投入包括配置目标、确认首次SSH指纹、检查日志是否适合进入模型，并用独立CLI核对列表。持续投入包括Docker命令、SSH池和实时流、前端渲染与可选模型分析轮次；现金价格、资源规模和人工时间均未测量。失败恢复需要区分命令失败、输出截断、连接失效和操作结果未知；对于已经启用的变更，超时后须重查实际状态再决定重试，不能把请求失败当作未执行。保持只读能缩小恢复负担，却不消除敏感数据暴露和错误诊断成本。

#### 证据与依据

**依据 1 · 源码核查**：[packages/docker/package.json:19-54](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/docker/package.json#L19-L54)

运行时、客户端与依赖声明。

<details>
<summary>查看原文（36行）</summary>

```text
  "type": "module",
  "engines": {
    "node": ">=22.19.0"
  },
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": "./client.js",
    "./package.json": "./package.json"
  },
  "dsh": {
    "manifestVersion": 1,
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "engines": {
      "dsh": ">=0.1.7-rc.2"
    },
    "client": {
      "platform": "web"
    }
  },
  "dependencies": {
    "@deepseek-ai/schemastery": "^3.18.4",
    "@hyzyn/dsh-kit": "0.8.0",
    "ssh2": "^1.17.0"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh": "^0.1.7-rc.2 || ^0.2.0-rc.1 || ^0.2.0-rc.2 || ^0.2.1-alpha.1 || ^0.2.1-alpha.2 || ^0.2.1-alpha.5 || ^0.2.1-rc.1 || ^0.2.1-rc.2 || ^0.2.1-rc.3 || ^0.2.1-rc.4 || ^0.2.1-rc.5 || ^0.2.2-alpha.3 || ^0.2.2-rc.1",
    "@deepseek-ai/dsh-tools": "^0.1.7-rc.2 || ^0.2.0-rc.1 || ^0.2.0-rc.2 || ^0.2.1-alpha.1 || ^0.2.1-alpha.2 || ^0.2.1-alpha.5 || ^0.2.1-rc.1 || ^0.2.1-rc.2 || ^0.2.1-rc.3 || ^0.2.1-rc.4 || ^0.2.1-rc.5 || ^0.2.2-alpha.3 || ^0.2.2-rc.1"
  },
  "devDependencies": {
```

</details>

**依据 2 · 源码核查**：[packages/docker/src/docker.ts:1675-1693](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/docker/src/docker.ts#L1675-L1693)

daemon探测保留超时与错误。

<details>
<summary>查看原文（19行）</summary>

```text
    const base = { bin: this.bin, target: this.runner.label, timedOut: false }
    try {
      const result = await this.runner.run([this.bin, 'version', '--format', '{{.Server.Version}}'], { timeoutMs: 15_000 })
      if (result.code === 0) {
        return { ok: true, serverVersion: result.stdout.trim() || null, error: null, ...base }
      }
      if (result.timedOut) {
        return {
          ok: false,
          serverVersion: null,
          error: `${this.bin} version 超时（15 秒未返回）`,
          ...base,
          timedOut: true,
        }
      }
      const message = (result.stderr.trim() || result.stdout.trim() || `退出码 ${String(result.code)}`).split('\n')[0]
      return { ok: false, serverVersion: null, error: message ?? '未知错误', ...base }
    } catch (error) {
      return { ok: false, serverVersion: null, error: error instanceof Error ? error.message : String(error), ...base }
```

</details>

**依据 3 · 源码核查**：[packages/docker/src/index.ts:1978-2027](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/docker/src/index.ts#L1978-L2027)

聚合请求资源与失败处理。

<details>
<summary>查看原文（50行）</summary>

```text
    const aggregateAcrossTargets = async <T>(
      names: readonly string[],
      run: (api: DockerApi, name: string) => Promise<T>,
    ): Promise<Array<TargetGroup<T>>> => {
      return await mapLimit(names, AGG_CONCURRENCY, async (name): Promise<TargetGroup<T>> => {
        /*
         * 控制器必须建在 `run()` **之前**（D161）：Runner 是在 `apiFor` 里构造的，signal
         * 当场绑到 Runner 上（见 createRunner）。先跑再建的话，abort 时底层根本不知道
         * 自己被取消——那正是修复前的行为。
         */
        const controller = new AbortController()
        const budget = aggTimeoutMs()
        const built = apiFor(name, controller.signal)
        const resolved = built.resolved
        const label = resolved === undefined
          ? name
          : (resolved.kind === 'local' ? '本机' : sshTarget(resolved.spec as SshSpec))
        if (built.api === undefined) {
          controller.abort()
          return { target: name, label, ok: false, error: built.error ?? '无法构造执行通道' }
        }
        const api = built.api
        let timer: NodeJS.Timeout | null = null
        try {
          const timeout = new Promise<never>((_resolve, reject) => {
            timer = setTimeout(() => {
              /*
               * 顺序是**先取消、后拒绝**（D161）：反过来的话调用方在 reject 的那一刻就拿到
               * `ok:false` 返回了，而底层（本地子进程 / SSH channel）还在跑——用户看到的是
               * 「这一格失败了」，实际那条 inspect 还占着远端的 session 槽，后续短命令被拒。
               */
              controller.abort()
              reject(new Error(`聚合超时（>${String(budget / 1000)}s）`))
            }, budget)
            timer.unref?.()
          })
          const data = await Promise.race([run(api, name), timeout])
          return { target: name, label, ok: true, data }
        } catch (error) {
          return { target: name, label, ok: false, error: error instanceof Error ? error.message : String(error) }
        } finally {
          if (timer !== null) clearTimeout(timer)
          /*
           * race 另一侧赢（命令正常跑完 / 抛错）时也要兜底取消：`abort()` 是幂等的，命令
           * 已 settle 时它是**无害的空操作**（监听器在收尾时已摘掉），但漏了这一句就会留下
           * 「signal 永不 abort、挂在它上面的闭包链不放」的尾巴。
           */
          controller.abort()
        }
      })
```

</details>

**依据 4 · 源码核查**：[packages/docker/src/docker.ts:2432-2451](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/docker/src/docker.ts#L2432-L2451)

启停删实际执行及非零退出处理。

<details>
<summary>查看原文（20行）</summary>

```text
  async action(request: DockerAction): Promise<{ id: string; action: string; message: string }> {
    const safe = assertRef(request.id, 'container')
    const map: Record<DockerAction['action'], string[]> = {
      start: ['start'],
      stop: ['stop'],
      restart: ['restart'],
      remove: ['rm'],
    }
    const sub = map[request.action]
    const result = await this.runner.run([this.bin, ...sub, safe], {
      // stop / restart 可能要等容器优雅退出（docker 默认 10s 超时）
      timeoutMs: Math.max(this.limits.timeoutMs, 60_000),
      maxBytes: 64 * 1024,
    })
    if (result.code !== 0) {
      const message = firstLine(result.stderr, result.stdout, result.code)
      const hint = request.action === 'remove' && /running/i.test(message) ? '（容器仍在运行：先停止再删除）' : ''
      throw new Error(`${request.action} ${safe} 失败：${message}${hint}`)
    }
    return { id: safe, action: request.action, message: result.stdout.trim() || 'ok' }
```

</details>

#### 缺口

- 未取得实际主机负载、故障恢复与同条件任务成本。
  **影响**：不能估计节省工时、资源上限或单位合格排障成本。
  **进一步探讨**：用有限容器集合记录命令耗时、输出量、SSH连接占用、模型费用和人工核对时间。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 谁值得怎样试用，停止与退出条件是什么？

**研究主题**：采用判断

#### 完整回答

已有Docker权限且能用CLI独立核对的开发运维人员，可在非关键环境保持变更和exec关闭，且不调用容器终端，试做容器列表与一段已知时间窗日志的只读巡检。先核对目标、容器ID、行数与截断标志，敏感内容先填草稿，确认后再交模型。合格标准是同时间窗与CLI结果相符、不可达目标明确报错且其余组保留；不以模型生成建议当故障已解决。

若目标不符、输出被截断却被当完整证据、SSH指纹变更或未经检查的日志被发送，就停止该链路并回到原CLI。停用插件和关闭面板应撤下工具并结束流，真实进程与SSH通道释放仍需实测，不把代码中的清理调用当验收结果。写操作与exec不在本次试用建议内，若需要它们应另行核对权限、单次批准、状态回读和备份恢复。

已有tty部署必须分别核对终端命令面。Docker的allowExec只闸一次性exec，不能约束可选交互式docker exec -it；不打开终端是本次用户操作范围，不是防止页内脚本使用终端服务的部署级安全屏障，见[Q03](#research-q03)。

#### 证据与依据

**依据 1 · 源码核查**：[packages/docker/src/index.ts:2812-2848](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/docker/src/index.ts#L2812-L2848)

禁用时撤销工具，零目标工具过滤。

<details>
<summary>查看原文（37行）</summary>

```text
    const refreshTools = (): void => {
      for (const dispose of toolDisposers) {
        try {
          dispose()
        } catch {
          /* 工具已注销 */
        }
      }
      toolDisposers = []
      registeredNames = []
      const tools = toolsApi
      if (tools === undefined) return
      // 插件禁用（设置卡片关掉「启用插件」）时不注册任何工具：运行期关掉也要立刻生效
      if (!live.enabled) return
      // 文案要跟语义一致（D46）：`*` 聚合只有 docker_ps / docker_attention 真支持，
      // 其余 12 个单目标工具省略时只在「恰好一个目标」时回落、多目标则报 target 必填
      const targetParam = { type: 'string', description: '目标名（docker_targets 列出；只有一个目标时可省略。`*` 仅 docker_ps / docker_attention 支持，其他工具请传具体目标名）' } as const

      /*
       * 单个工具注册失败不该把整批带下去（D107）：以前 add 直接抛，调用方（applySection）
       * 也就抛了，结果是「旧工具已全拆 + 新工具只注册了一半」，而重存同一份配置又因为
       * 差异判定不再触发 refreshTools —— 半套状态一直缺到重启。现在逐条兜住并汇总，
       * 下次配置变更（或保存路径的 forceRefreshTools）会自然重试。
       */
      const failures: string[] = []
      const add = (toolName: string, definition: unknown): void => {
        /*
         * 零目标闸（见 ZERO_TARGET_TOOLS）：其余工具没有可寻址的目标，注册了只会让模型
         * 白试一次；放在 add 里过滤，是为了保住注册顺序、失败汇总与 registeredNames 的
         * 实况语义（它们仍然是「这次真正注册了什么」的如实记录）。
         */
        if (live.targets.length === 0 && !ZERO_TARGET_TOOLS.has(toolName)) return
        try {
          toolDisposers.push(tools.register(definition))
          registeredNames.push(toolName)
        } catch (error) {
          failures.push(`${toolName}: ${error instanceof Error ? error.message : String(error)}`)
```

</details>

**依据 2 · 源码核查**：[packages/docker/src/index.ts:5089-5113](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/docker/src/index.ts#L5089-L5113)

HTTP禁用检查，配置和授权入口仍保留。

<details>
<summary>查看原文（25行）</summary>

```text
        const dispose = webServer.register({
          kind: 'prefix',
          path: ROUTE_PREFIX,
          handler: async (req: ReqLike & AsyncIterable<Uint8Array>, res: ResLike) => {
            const loopback = isLoopbackRequestStrict(req)
            // 字面量环回同步判定（保持「第一拍就建流」的时序）；仅别名主机名才等 DNS
            if (loopback instanceof Promise) {
              if (!(await loopback)) {
                writeJson(res, 403, { error: 'forbidden: loopback-only' })
                return
              }
            } else if (!loopback) {
              writeJson(res, 403, { error: 'forbidden: loopback-only' })
              return
            }
            const sub = new URL(req.url ?? '/', 'http://loopback').pathname.slice(ROUTE_PREFIX.length)

            // 插件禁用时只保留 /config 读写与 /elevate 族：设置卡片靠前者渲染，也是重新启用插件的
            // 唯一 UI 入口（不能一并关掉，否则卡片消失就没有恢复路径了）；授权的宿主级操作也不该
            // 因为插件被停用而失效（用户先授权再启用插件同样合理）。其余数据路由一律 403——
            // agent 工具已由 refreshTools 同步清空，这里只管 HTTP 半体。
            if (!live.enabled && sub !== '/config' && !sub.startsWith('/elevate')) {
              writeJson(res, 403, { error: '插件已禁用（插件配置 → Docker 容器面板 → 启用插件）' })
              return
            }
```

</details>

**依据 3 · 源码核查**：[packages/docker/src/docker.ts:1695-1732](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/docker/src/docker.ts#L1695-L1732)

输出完整性对只读核对的影响。

<details>
<summary>查看原文（38行）</summary>

```text
  }

  /**
   * assertOk + 截断检查（D13）：列表 / 详情类方法拿到的必须是**完整**输出。
   * 只检查 code 的话，「输出被截断」会被当成「本来就这么少」——面板静默少列
   * 容器，inspect 系列更会把截断误报成「对象不存在」，把用户引向错误方向。
   *
   * `alternative` 是**这个调用方真正能执行的替代做法**（D105）：agent 改不了插件
   * 设置，「请调大 maxOutputKb」对它不可执行——ps 能改 all、stats 能传 ids、
   * events 能缩小 since。文案里还会回显当前上限（见 truncationHint）。
   */
  private assertComplete(result: ExecResult, what: string, alternative?: string): void {
    this.assertOk(result, what)
    if (result.truncated) {
      throw new Error(`${what}的输出${this.truncationHint(alternative)}`)
    }
  }

  /**
   * 截断提示的统一文案（D105）：带上当前上限（KB）与目标标签——只说「超过上限」
   * 无法判断差多少；再拼上调用方的可执行替代做法。
   * 不抛错的路径（imageInspect 的 history，D104）复用同一句话，保持口径一致。
   */
  private truncationHint(alternative?: string): string {
    const limitKb = Math.round(this.limits.maxBytes / 1024)
    const suggest =
      alternative === undefined || alternative === ''
        ? '调大「单次命令输出上限」（maxOutputKb）'
        : `${alternative}；或调大「单次命令输出上限」（maxOutputKb）`
    return `因超过上限被截断（目标 ${this.runner.label}，当前上限 ${limitKb} KB）：结果不完整。请${suggest}后重试`
  }

  async listContainers(all: boolean): Promise<ContainerSummary[]> {
    const argv = [this.bin, 'ps', ...(all ? ['-a'] : []), '--no-trunc', '--format', '{{json .}}']
    const result = await this.runner.run(argv, { timeoutMs: this.limits.timeoutMs, maxBytes: this.limits.maxBytes })
    this.assertComplete(result, '列出容器', '改传 all=false（默认只看运行中的容器）')
    return parsePsJson(result.stdout)
  }
```

</details>

**依据 4 · 源码核查**：[packages/docker/src/ssh-exec.ts:1652-1681](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/docker/src/ssh-exec.ts#L1652-L1681)

指纹变化停止条件。

<details>
<summary>查看原文（30行）</summary>

```text
/** TOFU 主机指纹策略（hostVerifier 接线）；mismatchMessage() 供错误路径取人类可读拒绝原因。 */
export function applyHostKeyPolicy(options: {
  connectConfig: ConnectConfig
  spec: SshSpec
  store?: HostKeyStore
  logger?: ExecLogger
  target: string
}): { mismatchMessage(): string | null } {
  const { connectConfig, spec, store, logger, target } = options
  const port = spec.port ?? 22
  let hostKeyMismatch: string | null = null
  connectConfig.hostVerifier = (hash: string) => {
    // host 键统一 trim + 小写（D03）：tty 落盘时把 host 小写化，比较口径必须一致
    const host = spec.host.trim().toLowerCase()
    const known = store?.get(host, port)
    if (known === undefined || known.length === 0) {
      store?.record(host, port, hash)
      logger?.info(`[dsh-docker] ssh ${target} 首次连接，已记录 host key 指纹 sha256:${hash}（TOFU）`)
      return true
    }
    // 命中集合内**任意**一条指纹即放行：同一主机的 rsa / ed25519 各记一条（D03）
    if (known.includes(hash)) return true
    hostKeyMismatch =
      `SSH 主机密钥指纹变更：${target} 已记录 sha256:${known.join(' / ')}，本次为 sha256:${hash}。` +
      '可能是主机重装或换钥匙，也可能是中间人（MITM）冒充；确认安全后，到 插件配置 → Docker 容器面板 → SSH 主机密钥记录 删除该主机再重连。'
    logger?.warn(`[dsh-docker] ${hostKeyMismatch}`)
    return false
  }
  return { mismatchMessage: () => hostKeyMismatch }
}
```

</details>

**依据 5 · 源码核查**：[packages/docker/client-src/index.js:8326-8392](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/docker/client-src/index.js#L8326-L8392)

openExec直接使用terminalApi，不以allowExec门控。

<details>
<summary>查看原文（67行）</summary>

```text
      const openExec = (item) => {
        const command = buildExecCommand(item.name)
        if (terminalApi === null) {
          // 区分两种原因：tty 未安装（没有终端面板入口）还是版本过旧（面板在、但没有
          // ttyTerminal 服务）。提示要能直接指导用户下一步做什么。
          const ttyInstalled = document.querySelector('[data-dsh-tty-entry]') !== null
          copyExecCommand(item, ttyInstalled
            ? t('hint.ttyOutdated')
            : t('hint.ttyNotInstalled'))
          return
        }
        const cfg = (config?.targets ?? []).find((entry) => entry.name === target)
        const label = item.name + ' · exec'
        // 组装 tty 的 options：book > spec > 本机（与 ttyTerminal 的约定一致）；
        // 内联目标用 key/password 时浏览器端拿不到凭证 → null，走复制兜底
        const options = (() => {
          if (cfg === undefined || cfg.kind === 'local') return { command, label }
          if (typeof cfg.book === 'string' && cfg.book !== '') return { book: cfg.book, command, label }
          if ((cfg.auth ?? 'agent') === 'agent') {
            return {
              spec: { host: cfg.host, port: cfg.port, username: cfg.username, auth: 'agent', agentForward: cfg.agentForward === true },
              command,
              label,
            }
          }
          return null
        })()
        if (options === null) {
          copyExecCommand(item, t('hint.inlineCreds'))
          return
        }
        // 0) 借 tty 面板开标签的两种情形——不就地嵌抽屉：
        //    - dock：面板已经长在 tty 面板里，再嵌一层就成了「终端套面板套终端」；
        //    - tab（**普通宽度**）：栏宽通常不够跑 shell，硬塞进去两头难受。
        //    右侧栏**铺满**时走下面的就地嵌入：那时宽度够，而且日志与 shell 同屏
        //    （看日志 → 进容器的上下文不断，这正是抽屉存在的意义）。
        if (props.docked === true || (props.carrier === 'tab' && props.tabFullscreen !== true)) {
          try {
            terminalApi.open(options)
          } catch (error) {
            copyExecCommand(item, error instanceof Error ? error.message : String(error))
          }
          return
        }
        // 1) 就地嵌入（契约版本 2 才保证有 mount）
        if (typeof terminalApi.mount === 'function' && Number(terminalApi.version ?? 0) >= 2) {
          setExec({ label, options })
          setExecFold(false) // 换容器时展开：新会话总该看得见
          return
        }
        // 2) 借 tty 弹窗承载
        try {
          terminalApi.open(options)
          props.onClose()
        } catch (error) {
          copyExecCommand(item, error instanceof Error ? error.message : String(error))
        }
      }

      /** 清掉某个容器的「执行中」标记（幂等；没标就不动引用，省一次渲染）。 */
      const clearPending = (id) => setPending((map) => {
        if (map[id] === undefined) return map
        const next = { ...map }
        delete next[id]
        return next
      })

```

</details>

**依据 6 · 源码核查**：[packages/docker/client-src/index.js:10835-10841](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/docker/client-src/index.js#L10835-L10841)

ttyTerminal可选服务被注入，形成另一命令通道。

```text
      // 终端能力（可选）：tty 0.14.0 起提供 ttyTerminal 服务，卡片「终端」按钮
      // 直接开一个标签跑 `docker exec -it <容器> sh`；拿不到就退回复制命令
      ctx.inject(['ttyTerminal'], (terminalCtx) => {
        terminalApi = terminalCtx.ttyTerminal ?? null
        return () => { terminalApi = null }
      })

```

#### 缺口

- 未验证关闭面板和禁用后的进程/SSH资源释放。
  **影响**：仅支持受控只读试用，不能承诺运行中无资源残留。
  **进一步探讨**：在非关键环境关闭面板和停用后检查CLI子进程、SSE连接和SSH通道数量。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 可从当前机制推导什么新的排障交接假设？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是把日志投递扩展成“可回查证据包”，其中绑定目标指纹、容器ID、时间窗、截断状态和已脱敏片段，再让模型引用包内证据提出下一步只读查询。当前直接发送已经缩短搬运路径，但文本进入会话后容易失去采样边界，也可能携带秘密；仅增加模型工具数量不会消除这些问题。

候选增量是让人工先验收证据范围与脱敏，再授权后续操作，代价是多一次确认及证据存储。最小对照可用同一批脱敏故障日志比较直接文本和证据包，记录错误目标引用、缺失边界导致的错误判断、秘密泄漏以及人工修正时间。若证据包不能降低错误引用，或确认成本大于节约且不改善结果，就否定该方向。它没有真实用户需求与付费证据，不作为现成产品机会。

#### 证据与依据

**依据 1 · 源码核查**：[packages/docker/client-src/index.js:3580-3604](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/docker/client-src/index.js#L3580-L3604)

现状投递文本到会话，是证据包假设的直接参照。

<details>
<summary>查看原文（25行）</summary>

```text
    async function deliverToSession(prompt, mode) {
      const target = askTarget()
      if (target.ok !== true) return { ok: false, message: target.reason }
      try {
        if (mode === 'draft') {
          const input = typeof target.conversation.input?.for === 'function'
            ? target.conversation.input.for(target.actx)
            : null
          if (input === null || typeof input.setDraft !== 'function') {
            return { ok: false, message: t('error.noInputFacade') }
          }
          input.setDraft(prompt)
          notifySession(target, t('msg.logDraftFilled'))
          flashAskNotice(t('msg.filledInCurrentSession') + revealSessionSuffix(), 'ok')
          return { ok: true, message: t('msg.filledDraft') }
        }
        await target.conversation.send(prompt)
        notifySession(target, t('msg.logSentToSession'))
        flashAskNotice(t('msg.logSentToCurrentSession') + revealSessionSuffix(), 'ok')
        return { ok: true, message: t('msg.sent') }
      } catch (error) {
        return { ok: false, message: error instanceof Error ? error.message : String(error) }
      }
    }

```

</details>

**依据 2 · 源码核查**：[packages/docker/src/docker.ts:1695-1732](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/docker/src/docker.ts#L1695-L1732)

底层已有截断边界，可作为证据包字段来源。

<details>
<summary>查看原文（38行）</summary>

```text
  }

  /**
   * assertOk + 截断检查（D13）：列表 / 详情类方法拿到的必须是**完整**输出。
   * 只检查 code 的话，「输出被截断」会被当成「本来就这么少」——面板静默少列
   * 容器，inspect 系列更会把截断误报成「对象不存在」，把用户引向错误方向。
   *
   * `alternative` 是**这个调用方真正能执行的替代做法**（D105）：agent 改不了插件
   * 设置，「请调大 maxOutputKb」对它不可执行——ps 能改 all、stats 能传 ids、
   * events 能缩小 since。文案里还会回显当前上限（见 truncationHint）。
   */
  private assertComplete(result: ExecResult, what: string, alternative?: string): void {
    this.assertOk(result, what)
    if (result.truncated) {
      throw new Error(`${what}的输出${this.truncationHint(alternative)}`)
    }
  }

  /**
   * 截断提示的统一文案（D105）：带上当前上限（KB）与目标标签——只说「超过上限」
   * 无法判断差多少；再拼上调用方的可执行替代做法。
   * 不抛错的路径（imageInspect 的 history，D104）复用同一句话，保持口径一致。
   */
  private truncationHint(alternative?: string): string {
    const limitKb = Math.round(this.limits.maxBytes / 1024)
    const suggest =
      alternative === undefined || alternative === ''
        ? '调大「单次命令输出上限」（maxOutputKb）'
        : `${alternative}；或调大「单次命令输出上限」（maxOutputKb）`
    return `因超过上限被截断（目标 ${this.runner.label}，当前上限 ${limitKb} KB）：结果不完整。请${suggest}后重试`
  }

  async listContainers(all: boolean): Promise<ContainerSummary[]> {
    const argv = [this.bin, 'ps', ...(all ? ['-a'] : []), '--no-trunc', '--format', '{{json .}}']
    const result = await this.runner.run(argv, { timeoutMs: this.limits.timeoutMs, maxBytes: this.limits.maxBytes })
    this.assertComplete(result, '列出容器', '改传 all=false（默认只看运行中的容器）')
    return parsePsJson(result.stdout)
  }
```

</details>

**依据 3 · 源码核查**：[packages/docker/src/ssh-exec.ts:1652-1681](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/docker/src/ssh-exec.ts#L1652-L1681)

已记录主机指纹可用于绑定目标。

<details>
<summary>查看原文（30行）</summary>

```text
/** TOFU 主机指纹策略（hostVerifier 接线）；mismatchMessage() 供错误路径取人类可读拒绝原因。 */
export function applyHostKeyPolicy(options: {
  connectConfig: ConnectConfig
  spec: SshSpec
  store?: HostKeyStore
  logger?: ExecLogger
  target: string
}): { mismatchMessage(): string | null } {
  const { connectConfig, spec, store, logger, target } = options
  const port = spec.port ?? 22
  let hostKeyMismatch: string | null = null
  connectConfig.hostVerifier = (hash: string) => {
    // host 键统一 trim + 小写（D03）：tty 落盘时把 host 小写化，比较口径必须一致
    const host = spec.host.trim().toLowerCase()
    const known = store?.get(host, port)
    if (known === undefined || known.length === 0) {
      store?.record(host, port, hash)
      logger?.info(`[dsh-docker] ssh ${target} 首次连接，已记录 host key 指纹 sha256:${hash}（TOFU）`)
      return true
    }
    // 命中集合内**任意**一条指纹即放行：同一主机的 rsa / ed25519 各记一条（D03）
    if (known.includes(hash)) return true
    hostKeyMismatch =
      `SSH 主机密钥指纹变更：${target} 已记录 sha256:${known.join(' / ')}，本次为 sha256:${hash}。` +
      '可能是主机重装或换钥匙，也可能是中间人（MITM）冒充；确认安全后，到 插件配置 → Docker 容器面板 → SSH 主机密钥记录 删除该主机再重连。'
    logger?.warn(`[dsh-docker] ${hostKeyMismatch}`)
    return false
  }
  return { mismatchMessage: () => hostKeyMismatch }
}
```

</details>

#### 缺口

- 尚无用户错误交接样本和证据包对照结果。
  **影响**：无法确认额外验收步骤的净价值。
  **进一步探讨**：收集合法脱敏案例后固定任务和预算，对照直接文本与证据包的错误及人工时间。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
