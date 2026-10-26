# chicheng-cron

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[99a223e](https://github.com/534119219/chicheng-cron/tree/99a223edfa090afa2f1f05c77526a53a0f277961)

<!-- BEGIN META -->
[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/534119219/chicheng-cron)
<!-- END META -->

> **实现功能**：在DSH Web侧栏管理cron任务，定时执行脚本、Skill或Agent，保存输出并提供推送、会话分组和归档选项。

> **核心亮点**：将脚本、headless Agent/Skill、运行历史和多渠道通知汇入同一Web任务管理界面，减少手工接线；不是新调度算法或隔离执行器。详见[Q02](#research-q02)。

> **风险与缺陷**：每次唤醒回看一分钟而不记录occurrence，高频任务可让已触发任务重复due；会话按mtime猜测再归档，timeout只杀直接child，均未运行复现。详见[Q03](#research-q03)、[Q05](#research-q05)。

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
  - [Q01 · 哪些自动化适合，合格运行如何判断？](#detail-section-11)
  - [Q02 · 调度到执行和通知如何连接？](#detail-section-12)
  - [Q03 · 重复执行和会话身份有何缺陷？](#detail-section-13)
  - [Q04 · 启动与日常流程依赖什么？](#detail-section-14)
  - [Q05 · 安全、持久化和资源恢复如何？](#detail-section-15)
  - [Q06 · 成本、采用与未来设计如何判断？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向DSH Web长期运行、希望定时执行本地小脚本或已有Skill/Agent任务的个人用户。可用于重复采集、整理和提醒，但合格结果必须是预期时点只运行预期次数、正确工作目录、结果能核查、异常不留下失控子进程，而非仅在历史表出现done。

脚本退出0只是操作系统进程成功信号，Agent退出0也不证明业务结果合格。插件按退出码决定“成功后归档”，所以归档不代表输出经人工验收。对涉及删改、外部请求或付费Agent的任务，重复和并行会改变成本与副作用，不能照普通提醒来评估。

基线是系统cron/任务计划程序加脚本，或手动启动DSH任务。插件优势是界面统一、Skill正文接入、通知与会话分组减少接线。它依赖Web宿主常驻，停机错过的时点README明确不补跑；需要持久分布式队列、严格执行一次或强隔离的场景不适合直接据此采用。

系统cron/任务计划程序加脚本或手动DSH启动；增量在Web统一管理和通知/会话接线，不能代替执行一次及进程隔离。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| cron与间隔 | 五/六字段和@every预览/执行 | 本地时间、无occurrence判重 |
| 脚本 | shell/Python/Node | 宿主权限，timeout只杀直接child |
| Agent/Skill | headless及全文指引 | 分组改变cwd，Skill缺失仍继续 |
| 运行历史 | 状态/退出码/512KiB输出 | exit0不等于业务成功 |
| 通知 | 推送或messaging，默认800字输出 | 需可信目标，无递送去重收据 |
| 分组归档 | 整理运行会话 | mtime猜身份，可能误归属 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web、webServer/webRuntime | 硬注入必需 | 调度宿主与API fence | Web关闭不执行，错过不补 |
| Node与可写DSH_HOME/cron | 执行/持久化必需 | 内置模块与任务/输出目录 | 包未声明最低Node，不能硬填版本 |
| cmd.exe或/bin/sh | shell任务需要 | 执行任务正文 | 按宿主账户权限运行，无专属沙箱 |
| Python可执行程序 | Python任务需要 | python/py/python3探测 | 未找到运行失败 |
| dsh CLI/headless模型配置 | Skill/Agent需要 | 启动另一个DSH profile | 读取Skill成功不代表模型/工具完整可用 |
| skills目录或ctx.skills | Skill正文需要 | 全文指引拼接 | 读取失败仍继续提示Agent自行完成 |
| workspaceRegistry | 分组/归档可选 | 会话整理 | 不可用时降级，不能凭按钮推断已归组 |
| 推送插件或messaging-core | 通知可选 | 向显式渠道发送输出 | 失败独立记录，可能向外发送敏感输出 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 固定版本、备份store、选择无副作用任务 | 明确宿主账户、工作目录和凭据可见范围 |
| 安装 | 挂载Web bundle重启 | 侧栏、API与store路径一致 |
| 配置 | 选任务类型、cron、cwd、timeout，预览时点 | 不把preview正确当调度去重验收 |
| 运行 | 先读输出与退出码，再检查业务产物 | 不自动以exit0判断Agent完成 |
| 整理 | 保守关闭自动归档，审查通知目标/内容 | 身份未绑定时避免错误会话整理 |
| 恢复 | 检查可能重复动作和子进程，不盲目runNow | 首次结果不明先对照外部状态 |

固定版本Node built-ins无第三方运行依赖，但这不消除解释器、模型、DSH与消息服务需求。只做源码检查，不执行任务、通知或宿主冒烟。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 常驻Web、解释器/headless配置及磁盘 | 编写脚本、核对权限/时点和通知目标 | 未测初始化耗时，预热可能建profile |
| 持续使用 | 任务子进程、Agent模型消耗、运行输出和推送 | 复核产物与调度、维护Skill依赖 | 重复/重叠可能放大token和外部副作用 |
| 失败恢复 | 保存备份、重试和外部状态核对 | 查首次是否执行、清理后代进程与误归档 | 无执行一次收据，恢复成本未知 |



#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 操作集中 | 五类任务、预览与运行历史 | 相比系统cron实际省多少时间 |
| 调度 | 单timer和本地cron计算 | 可靠单次触发，已有重复反例 |
| 执行 | 进程退出/timeout和有界输出 | 完整业务成功或所有后代停止 |
| 整理通知 | 多通道与mtime会话候选 | 身份准确、递送去重与净收益 |

> **思考**：每次唤醒回看一分钟而不记录occurrence，高频任务可让已触发任务重复due；会话按mtime猜测再归档，timeout只杀直接child，均未运行复现。详见[Q03](#research-q03)、[Q05](#research-q05)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将脚本、headless Agent/Skill、运行历史和多渠道通知汇入同一Web任务管理界面，减少手工接线；不是新调度算法或隔离执行器。详见[Q02](#research-q02)。

将脚本、headless Agent/Skill、运行历史和多渠道通知汇入同一Web任务管理界面，减少手工接线；不是新调度算法或隔离执行器。详见[Q02](#research-q02)。

API限定POST、有1MiB JSON上限，fence检查回环或trustedHosts、拒绝sec-fetch-site=cross-site，有Origin时比较host含端口。这是具体来源防线，但Origin缺失允许、比较不含scheme，不构成用户身份认证。任务正文就是任意脚本或Agent提示词，cwd不是权限围栏，子进程继承宿主环境；修改调度的权限实质是执行宿主动作的权限。

任务/历史以临时文件rename持久化，150ms去抖，读损坏直接空store，保存失败仅日志。各次flush未串行锁，同一tmp文件可被并发写或重命名；运行历史保留200条，但目录清理只在卸载时保留100份，长期运行输出目录可积累。超时只child.kill(SIGKILL)，未见进程组/后代树清理；脚本派生的子进程和外部副作用不因父进程杀死撤销。

teardown停止wakeTimer并flush/prune，不跟踪或等待正在执行的children，也没有取消后续push/归档。模块级tearDown置true后apply不重置，进程内同模块重启的调度恢复也需核查。分组默认改变Agent真实cwd，prompt工作目录提示不能替代模型工具世界约束。通知默认附前800字输出，用户需理解渠道外发范围，失败重试与去重也没有单独递送收据协议。

<a id="detail-section-5"></a>

### 1.4 主要限制

每次唤醒回看一分钟而不记录occurrence，高频任务可让已触发任务重复due；会话按mtime猜测再归档，timeout只杀直接child，均未运行复现。详见[Q03](#research-q03)、[Q05](#research-q05)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察。继续探讨从每日+10秒混频、稳定run/session绑定和timeout后代清理入手；非幂等任务不盲目重试，身份未核前不依赖自动归档。详见[Q06](#research-q06)。

脚本退出0只是操作系统进程成功信号，Agent退出0也不证明业务结果合格。插件按退出码决定“成功后归档”，所以归档不代表输出经人工验收。对涉及删改、外部请求或付费Agent的任务，重复和并行会改变成本与副作用，不能照普通提醒来评估。

基线是系统cron/任务计划程序加脚本，或手动启动DSH任务。插件优势是界面统一、Skill正文接入、通知与会话分组减少接线。它依赖Web宿主常驻，停机错过的时点README明确不补跑；需要持久分布式队列、严格执行一次或强隔离的场景不适合直接据此采用。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持五类任务和运行反馈接线；重复due、并发无锁和mtime会话猜测限制可靠性，未验证执行一次或业务成功。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定lib源码检查cron解析、单timer、子进程、输出/超时、Skill加载、会话猜测、通知、API与持久化；未完整审计移动端DOM适配，不执行目标。
- 下一步：进一步探讨可用虚拟时钟的每日+高频任务、双会话交错和子进程树检查重复次数、归属与终止，再比较人工恢复工时。

**分析版本**

- **仓库**：[534119219/chicheng-cron](https://github.com/534119219/chicheng-cron)
- **版本号**：0.1.1（[固定提交 99a223e](https://github.com/534119219/chicheng-cron/tree/99a223edfa090afa2f1f05c77526a53a0f277961)）
- **版本日期**：2026-08-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索持久occurrence claim、重叠策略与稳定run→session收据，再触发通知/归档，比较重复、漏跑和错误归属；未实现。详见[Q06](#research-q06)。

进一步探讨可用虚拟时钟的每日+高频任务、双会话交错和子进程树检查重复次数、归属与终止，再比较人工恢复工时。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 113 | — | — | 1254 |
| .md | example | 1 | 23 | — | — | 196 |
| .js | source | 2 | 2623 | 2292 | 172 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/534119219/chicheng-cron/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/534119219/chicheng-cron/issues?q=is%3Aissue+created%3A2026-09-22T05%3A28%3A26.324Z..2026-10-22T05%3A28%3A26.324Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/534119219/chicheng-cron/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A28%3A26.324Z..2026-10-22T05%3A28%3A26.324Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断固定版本定时执行、通知和会话整理的真实闭环与可靠性边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪些自动化适合，合格运行如何判断？

**研究主题**：场景与需求

#### 完整回答

面向DSH Web长期运行、希望定时执行本地小脚本或已有Skill/Agent任务的个人用户。可用于重复采集、整理和提醒，但合格结果必须是预期时点只运行预期次数、正确工作目录、结果能核查、异常不留下失控子进程，而非仅在历史表出现done。

脚本退出0只是操作系统进程成功信号，Agent退出0也不证明业务结果合格。插件按退出码决定“成功后归档”，所以归档不代表输出经人工验收。对涉及删改、外部请求或付费Agent的任务，重复和并行会改变成本与副作用，不能照普通提醒来评估。

基线是系统cron/任务计划程序加脚本，或手动启动DSH任务。插件优势是界面统一、Skill正文接入、通知与会话分组减少接线。它依赖Web宿主常驻，停机错过的时点README明确不补跑；需要持久分布式队列、严格执行一次或强隔离的场景不适合直接据此采用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-17](https://github.com/534119219/chicheng-cron/blob/99a223edfa090afa2f1f05c77526a53a0f277961/README.md#L3-L17)

作者定义五类任务、调度与通知整理。

<details>
<summary>查看原文（15行）</summary>

```text
DeepSeek Harness（dsh web）的定时任务插件：在左侧栏 **「新会话」下方**提供 **「定时任务」** 入口，用 cron 表达式定时执行 Shell / Python / Node 脚本、Skill 或任意 Agent 任务，并支持推送通知、会话整理与移动端适配。

## 功能

- **侧栏入口**：位于「新会话」按钮正下方，展开/收缩态与原生控件一致（rail 18px 图标）
- **任务类型**
  - Shell 脚本（Windows `cmd.exe` / 其他平台 `/bin/sh`）
  - Python 脚本（自动探测 `python` / `py` / `python3`）
  - Node.js 脚本（当前 Node 运行时）
  - Skill（自动注入已安装 skill 的完整说明给 Agent 执行）
  - 交给 Agent（自由提示词，由 headless dsh Agent 完成任意任务）
- **调度**：标准 5/6 字段 cron（`*/n`、`a-b`、列表、月份/星期缩写）、`@hourly`–`@yearly`、`@every <n>s|m|h|d`；本地时间计算，重启后自动恢复
- **推送通知**：对接 [chicheng-push](https://github.com/534119219/chicheng-push)（Server酱/PushPlus/Bark/钉钉/企微/Telegram/飞书/Webhook 等渠道）与 messaging-core 消息平台（任意已连接机器人的会话）；标题/内容模板支持 `{name} {type} {status} {exitCode} {duration} {time} {output}` 占位符，内容留空自动附带运行输出
- **会话整理**：Agent/Skill 运行会话可自动归入侧栏「定时任务」工作区；可开启「成功后自动归档会话」，完成后对话从侧栏隐藏（日志保留）
- **执行历史**：状态、退出码、耗时、推送结果、归档标记；输出弹窗查看
```

</details>

**依据 2 · 作者声明**：[README.md:81-85](https://github.com/534119219/chicheng-cron/blob/99a223edfa090afa2f1f05c77526a53a0f277961/README.md#L81-L85)

数据位置与停机不补跑。

```text
## 数据与限制

- 任务与历史：`$DSH_HOME/cron/store.json`；运行输出：`$DSH_HOME/cron/runs/`
- Agent/Skill 任务通过 `dsh --profile headless` 执行，复用 `$DSH_HOME/settings.yaml` 的模型配置
- Web 未运行时错过的时间点不补跑
```

**依据 3 · 源码核查**：[lib/index.js:765-779](https://github.com/534119219/chicheng-cron/blob/99a223edfa090afa2f1f05c77526a53a0f277961/lib/index.js#L765-L779)

done与exitCode0决定归档，未检查业务产物。

<details>
<summary>查看原文（15行）</summary>

```text
      status: timedOut ? "timeout" : "done",
    });
    const runStartedAt = new Date(startedAt).getTime();
    if (groups) await attachAgentSession(ctx, runStartedAt);
    if (task.pushEnabled) {
      record.pushResult = await sendTaskPush(ctx, task, record);
      scheduleSave();
    }
    if (task.archiveOnSuccess && record.status === "done" && record.exitCode === 0) {
      // "成功后归档" = archive the conversation this run created (agent/skill
      // tasks): it disappears from the sidebar grouping surfaces, logs remain.
      const sessionId = await archiveRunSession(ctx, runStartedAt);
      if (sessionId !== null) {
        record.archivedSession = sessionId;
        scheduleSave();
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 调度到执行和通知如何连接？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

任务保存在store.json，解析五/六字段cron、别名和@every；reschedule为所有启用任务计算最早下一时点，用一个setTimeout唤醒，再遍历due任务异步executeRun。普通cron采用本地Date，日/星期都指定时使用OR语义。@every按epoch间隔对齐，不是保存后延迟n秒；nextCronTime最多搜索约五年。

执行写UUID运行目录，shell落地run.sh/cmd，Python探测解释器，Node用当前运行时；Agent/Skill通过dsh --profile headless加提示词启动。默认分组时实际cwd是cron/workspace，而任务填写的workCwd只在prompt要求使用绝对路径。Skill读取ctx.skills或磁盘全文，读不到仍让Agent基于可用目录自行完成，不保证失败即停。

stdout/stderr合并最多512KiB保存，退出后记录状态、可推送前800字、再按mtime猜会话归组/归档。通知可用chicheng-push、messaging-core或本机push API。贡献是将五类任务、宿主Skill、运行收据与通知/整理接到同一Web界面，不是新的定时算法或Agent安全执行器。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:497-534](https://github.com/534119219/chicheng-cron/blob/99a223edfa090afa2f1f05c77526a53a0f277961/lib/index.js#L497-L534)

cron/@every解析和字段。

<details>
<summary>查看原文（38行）</summary>

```text
function parseCron(expression) {
  const input = String(expression ?? "").trim();
  if (input === "") throw new Error("cron 表达式不能为空");

  if (input.startsWith("@every")) {
    const token = input.slice(6).trim();
    const match = /^(\d+)\s*(s|m|h|d)?$/.exec(token);
    if (!match) throw new Error(`无效的 @every 表达式 "${input}"，应为 @every <n>[s|m|h|d]`);
    const factors = { s: 1, m: 60, h: 3600, d: 86400 };
    const unit = match[2] ?? "m";
    const everySeconds = Math.max(1, Number(match[1]) * factors[unit]);
    return { kind: "every", everySeconds, raw: input };
  }

  const text = SPECIAL_CRON[input.toLowerCase()] ?? input;
  const parts = text.split(/\s+/).filter((part) => part !== "");
  if (parts.length !== 5 && parts.length !== 6) {
    throw new Error(`cron 表达式需要 5 或 6 个字段（当前 ${parts.length} 个）：${input}`);
  }
  const hasSeconds = parts.length === 6;
  const idx = hasSeconds ? 1 : 0;
  const fields = {
    seconds: hasSeconds ? parseField(parts[0], { min: 0, max: 59 }) : undefined,
    minutes: parseField(parts[idx], { min: 0, max: 59 }),
    hours: parseField(parts[idx + 1], { min: 0, max: 23 }),
    dom: parseField(parts[idx + 2], { min: 1, max: 31 }),
    month: parseField(parts[idx + 3], { min: 1, max: 12, names: MONTH_NAMES }),
    dow: parseField(parts[idx + 4], { min: 0, max: 7, names: DOW_NAMES }),
  };
  // Normalize 7 (Sunday) to 0 for matching.
  if (fields.dow !== ANY && fields.dow.has(7)) {
    const set = new Set(fields.dow);
    set.delete(7);
    set.add(0);
    fields.dow = set;
  }
  return { kind: "cron", fields, raw: input };
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:549-599](https://github.com/534119219/chicheng-cron/blob/99a223edfa090afa2f1f05c77526a53a0f277961/lib/index.js#L549-L599)

本地时间、OR语义与搜索。

<details>
<summary>查看原文（51行）</summary>

```text
function nextCronTime(parsed, base) {
  if (parsed.kind === "every") {
    const aligned = Math.floor(base.getTime() / 1000 / parsed.everySeconds) * parsed.everySeconds * 1000;
    let next = aligned;
    while (next <= base.getTime()) next += parsed.everySeconds * 1000;
    return new Date(next);
  }
  const fields = parsed.fields;
  const seconds = fields.seconds;
  const MAX = base.getTime() + 5 * 366 * 24 * 60 * 60 * 1000;
  const t = roundAfter(seconds, base);

  while (t.getTime() <= MAX) {
    if (!matches(fields.month, t.getMonth() + 1)) {
      t.setMonth(t.getMonth() + 1, 1);
      t.setHours(0, 0, 0, 0);
      continue;
    }
    const domOk = matches(fields.dom, t.getDate());
    const dowOk = matches(fields.dow, t.getDay());
    const domAny = fields.dom === ANY;
    const dowAny = fields.dow === ANY;
    const dayOk = domAny && dowAny ? true : domAny ? dowOk : dowAny ? domOk : domOk || dowOk;
    if (!dayOk) {
      t.setDate(t.getDate() + 1);
      t.setHours(0, 0, 0, 0);
      continue;
    }
    if (!matches(fields.hours, t.getHours())) {
      t.setHours(t.getHours() + 1, 0, 0, 0);
      continue;
    }
    if (!matches(fields.minutes, t.getMinutes())) {
      t.setMinutes(t.getMinutes() + 1, 0, 0);
      continue;
    }
    if (seconds !== undefined) {
      const set = seconds === ANY ? new Set([0]) : seconds;
      let chosen = -1;
      for (const s of set) {
        if (s >= t.getSeconds() && (chosen === -1 || s < chosen)) chosen = s;
      }
      if (chosen === -1) {
        t.setMinutes(t.getMinutes() + 1, 0, 0);
        continue;
      }
      t.setSeconds(chosen, 0);
    } else {
      t.setSeconds(0, 0);
    }
    return t;
```

</details>

**依据 3 · 源码核查**：[lib/index.js:984-1029](https://github.com/534119219/chicheng-cron/blob/99a223edfa090afa2f1f05c77526a53a0f277961/lib/index.js#L984-L1029)

单timer重排。

<details>
<summary>查看原文（46行）</summary>

```text
  if (tearDown) return;
  let earliest = null;
  let earliestTask = null;
  const now = Date.now();
  for (const task of store.tasks) {
    if (!task.enabled) continue;
    let parsed;
    try {
      parsed = validateSchedule(task);
    } catch {
      continue;
    }
    const next = nextCronTime(parsed, new Date(now));
    if (next === null) continue;
    const ms = next.getTime() - now;
    task.nextRunAt = next.toISOString();
    if (earliest === null || ms < earliest) {
      earliest = ms;
      earliestTask = task;
    }
  }
  for (const task of store.tasks) {
    if (!task.enabled || task === earliestTask) continue;
    if (earliest !== null) {
      try {
        const parsed = validateSchedule(task);
        const next = nextCronTime(parsed, new Date(now));
        task.nextRunAt = next === null ? null : next.toISOString();
      } catch {
        task.nextRunAt = null;
      }
    }
  }
  scheduleSave();
  if (earliest !== null && earliestTask !== null) {
    const delay = Math.min(Math.max(earliest, 0), 0x7fffffff);
    wakeTimer = setTimeout(() => {
      wakeTimer = null;
      onWake();
    }, delay);
    wakeTimer.unref?.();
  }
}

/** Wake: fire every task whose next occurrence is due, then re-arm. */
function onWake() {
```

</details>

**依据 4 · 源码核查**：[lib/index.js:724-744](https://github.com/534119219/chicheng-cron/blob/99a223edfa090afa2f1f05c77526a53a0f277961/lib/index.js#L724-L744)

工作目录与输出上限。

<details>
<summary>查看原文（21行）</summary>

```text
    await mkdir(runDir, { recursive: true });
    const workCwd = task.cwd && String(task.cwd).trim() !== "" ? resolve(String(task.cwd)) : defaultCwd();
    const groups = (task.type === "agent" || task.type === "skill") && task.groupSessions !== false;
    const spawnCwd = groups ? GROUP_WORKSPACE_DIR : workCwd;
    if (groups) await mkdir(GROUP_WORKSPACE_DIR, { recursive: true });
    const child = await spawnForTask(task, spawnCwd, workCwd, runDir, ctx);
    const chunks = [];
    let total = 0;
    const MAX_BYTES = 512 * 1024;
    const append = (buffer) => {
      const remaining = MAX_BYTES - total;
      if (remaining <= 0) return;
      const slice = buffer.length > remaining ? buffer.subarray(0, remaining) : buffer;
      chunks.push(slice);
      total += slice.length;
    };
    child.stdout?.on("data", append);
    child.stderr?.on("data", append);
    let timedOut = false;
    let timer = null;
    if (task.timeoutMs && Number(task.timeoutMs) > 0) {
```

</details>

**依据 5 · 源码核查**：[lib/index.js:797-854](https://github.com/534119219/chicheng-cron/blob/99a223edfa090afa2f1f05c77526a53a0f277961/lib/index.js#L797-L854)

任务spawn和Skill拼接。

<details>
<summary>查看原文（58行）</summary>

```text
async function spawnForTask(task, cwd, workCwd, runDir, ctx) {
  const windows = process.platform === "win32";
  switch (task.type) {
    case "shell": {
      const scriptPath = join(runDir, windows ? "run.cmd" : "run.sh");
      const body = String(task.script ?? "");
      await writeFile(scriptPath, windows ? body : `#!/bin/sh\n${body}`, "utf8");
      if (windows) {
        return spawn(process.env.ComSpec || "cmd.exe", ["/d", "/s", "/c", scriptPath], { cwd, windowsHide: true, windowsVerbatimArguments: true, stdio: ["ignore", "pipe", "pipe"] });
      }
      return spawn("/bin/sh", [scriptPath], { cwd, windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
    }
    case "python": {
      if (pythonLauncher === null) pythonLauncher = await resolvePython();
      const scriptPath = join(runDir, "run.py");
      await writeFile(scriptPath, String(task.script ?? ""), "utf8");
      return spawn(pythonLauncher, [scriptPath], { cwd, windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
    }
    case "node": {
      const scriptPath = join(runDir, "run.mjs");
      await writeFile(scriptPath, String(task.script ?? ""), "utf8");
      return spawn(process.execPath, [scriptPath], { cwd, windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
    }
    case "skill":
    case "agent": {
      const prompt = await buildAgentPrompt(task, ctx, workCwd);
      const bin = dshBinPath();
      const args = bin !== null
        ? [bin, "--profile", "headless", prompt]
        : ["--profile", "headless", prompt];
      return spawn(bin !== null ? process.execPath : "dsh", args, { cwd, windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
    }
    default:
      throw new Error(`未知任务类型 "${task.type}"`);
  }
}

/** Compose the headless-agent prompt: inline skill instructions when present.
 * `workCwd` is the user-facing work directory (absolute paths guidance). */
async function buildAgentPrompt(task, ctx, workCwd) {
  const when = new Date().toLocaleString();
  const header = `定时任务触发了（${when}）。请直接完成任务，不要询问用户。`;
  const workHint = workCwd && String(workCwd).trim() !== ""
    ? `\n本次任务的工作目录是：${workCwd}（如需读写该目录下的文件，请使用绝对路径。）`
    : "";
  if (task.type === "skill" && task.skill) {
    const skillText = await loadSkillText(task.skill, ctx);
    const extra = String(task.prompt ?? "").trim();
    return [
      header,
      `请按照以下 skill "${task.skill}" 的完整指引来执行本次任务。`,
      skillText !== null ? `\n===== skill: ${task.skill} =====\n${skillText}\n===== skill 结束 =====` : `（注意：提供名为 "${task.skill}" 的 skill 内容未能读取，请基于可用 skill 目录自行完成。）`,
      extra !== "" ? `\n附加说明：\n${extra}` : "",
      workHint,
      "\n完成后请简明汇报结果（做了什么、输出/结果是什么）。",
    ].join("\n");
  }
  return `${header}\n${String(task.prompt ?? "")}${workHint}`;
```

</details>

**依据 6 · 源码核查**：[lib/index.js:316-381](https://github.com/534119219/chicheng-cron/blob/99a223edfa090afa2f1f05c77526a53a0f277961/lib/index.js#L316-L381)

通知模板、800字符与多通道。

<details>
<summary>查看原文（66行）</summary>

```text
async function sendTaskPush(ctx, task, record) {
  try {
    if (!task.pushEnabled) return null;
    const rawChannel = String(task.pushChannel ?? "").trim();
    const output = await readFile(record.outputPath, "utf8").catch(() => "");
    const durationMs = record.durationMs;
    const durationText = durationMs === null || durationMs === undefined
      ? ""
      : durationMs < 1000
        ? `${Math.round(durationMs)}ms`
        : `${(durationMs / 1000).toFixed(1)}s`;
    const values = {
      name: task.name,
      type: task.type,
      status: PUSH_STATUS_LABELS[record.status] ?? record.status,
      exitCode: record.exitCode ?? "",
      duration: durationText,
      time: new Date(record.startedAt).toLocaleString(),
      output: output.slice(0, 800),
    };
    const title = renderTemplate(
      task.pushTitle && String(task.pushTitle).trim() !== "" ? task.pushTitle : `定时任务「{name}」执行完成`,
      values,
    );
    const userContent = task.pushContent && String(task.pushContent).trim() !== "";
    const defaultContent = `状态：{status}（exit {exitCode}）\n耗时：{duration}\n完成时间：{time}`;
    const content = renderTemplate(userContent ? task.pushContent : defaultContent, values);
    // When the user did not write a custom template, append the run output
    // (the agent's final answer for agent/skill tasks) automatically.
    const effectiveContent = !userContent && output.trim() !== ""
      ? `${content}\n\n输出：\n${output.slice(0, 800)}`
      : content;
    // messaging-core target: "messaging:<platform>:<chatId>"
    if (rawChannel.startsWith("messaging:")) {
      const rest = rawChannel.slice("messaging:".length);
      const sep = rest.indexOf(":");
      if (sep <= 0) return { ok: false, error: `无效的消息平台目标 "${rawChannel}"` };
      const platform = rest.slice(0, sep);
      const chatId = rest.slice(sep + 1);
      const messaging = resolveMessaging(ctx);
      if (!messaging || typeof messaging.send !== "function") {
        return { ok: false, error: "messaging-core 服务不可用（未安装或未挂载）" };
      }
      try {
        await messaging.send(platform, chatId, `${title}\n\n${effectiveContent}`);
        return { ok: true, sent: 1, total: 1, source: "messaging", platform, chatId };
      } catch (error) {
        return { ok: false, sent: 0, total: 1, source: "messaging", error: error instanceof Error ? error.message : String(error) };
      }
    }
    const channels = rawChannel !== "" ? [rawChannel] : "all";
    const notifier = resolvePushNotifier(ctx);
    if (notifier && typeof notifier.send === "function") {
      return await notifier.send({ title, content: effectiveContent, channels });
    }
    const port = ctx?.webServer?.port ?? 3080;
    const response = await fetch(`http://127.0.0.1:${port}/push/api/send`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title, content: effectiveContent, channels }),
    });
    const parsed = await response.json().catch(() => null);
    return parsed ?? { ok: false, error: `HTTP ${response.status}` };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 重复执行和会话身份有何缺陷？

**研究主题**：缺陷与关键质疑

#### 完整回答

onWake没有用持久occurrence ID或lastRunAt判重，而是每次以now-60000重新计算所有任务的下一时点。假设每日任务12:00已触发，另一个@every 10s任务让12:00:10再唤醒，每日任务从11:59:10算出的next仍是12:00，因此又due；分钟窗口内可反复执行。executeRun也没有每任务运行中锁，runNow同样直接执行。此为固定控制流反例，未实际运行或量化生产影响。

六字段seconds为*时nextCronTime把ANY变成Set([0])，会把应匹配每秒的通配当只取0秒；这与5/6字段一般语义不同。周期本地Date受时区和DST变化，未见每任务显式时区或时钟回退执行账本。重启只按当前时间重新排程，无法从lastRunAt恢复错过的业务时点。

Agent会话身份不是子进程返回的session ID。findRunSessionId遍历所有项目目录，按运行起点前5秒到当前+2秒的目录mtime选最新候选，每项目还只取首个命中项；并发会话/其它任务可能被误认，再attachSession或archiveSession。即便没有恶意输入，时序接近也不足以证明归属。不得把“成功自动归档”当精确绑定run的安全流程。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1034-1057](https://github.com/534119219/chicheng-cron/blob/99a223edfa090afa2f1f05c77526a53a0f277961/lib/index.js#L1034-L1057)

一分钟回看判due，无occurrence去重。

<details>
<summary>查看原文（24行）</summary>

```text
    if (!task.enabled) continue;
    let parsed;
    try {
      parsed = validateSchedule(task);
    } catch {
      continue;
    }
    const next = nextCronTime(parsed, new Date(now - 60000));
    if (next !== null && next.getTime() <= now) due.push(task);
  }
  for (const task of due) {
    void executeRun(currentCtx, task, "cron");
  }
  reschedule();
}

// ---------------------------------------------------------------- API wire

const MAX_BODY_BYTES = 1 << 20;

class CronError extends Error {
  constructor(code, message, status = 400) {
    super(message);
    this.code = code;
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1324-1331](https://github.com/534119219/chicheng-cron/blob/99a223edfa090afa2f1f05c77526a53a0f277961/lib/index.js#L1324-L1331)

runNow直接executeRun，无运行锁。

```text

    runNow: async (payload) => {
      const id = requireId(payload);
      const task = store.tasks.find((candidate) => candidate.id === id);
      if (!task) throw new CronError("not-found", `task "${id}" not found`, 404);
      const record = await executeRun(ctx, task, "manual");
      return { run: record };
    },
```

**依据 3 · 源码核查**：[lib/index.js:583-596](https://github.com/534119219/chicheng-cron/blob/99a223edfa090afa2f1f05c77526a53a0f277961/lib/index.js#L583-L596)

seconds通配只选择0秒。

<details>
<summary>查看原文（14行）</summary>

```text
      continue;
    }
    if (seconds !== undefined) {
      const set = seconds === ANY ? new Set([0]) : seconds;
      let chosen = -1;
      for (const s of set) {
        if (s >= t.getSeconds() && (chosen === -1 || s < chosen)) chosen = s;
      }
      if (chosen === -1) {
        t.setMinutes(t.getMinutes() + 1, 0, 0);
        continue;
      }
      t.setSeconds(chosen, 0);
    } else {
```

</details>

**依据 4 · 源码核查**：[lib/index.js:121-157](https://github.com/534119219/chicheng-cron/blob/99a223edfa090afa2f1f05c77526a53a0f277961/lib/index.js#L121-L157)

以mtime窗口猜session，每项目首匹配。

<details>
<summary>查看原文（37行）</summary>

```text
async function findRunSessionId(startedAtMs) {
  const root = sessionsRoot();
  let projects;
  try {
    projects = await readdir(root, { withFileTypes: true });
  } catch {
    return null;
  }
  const from = startedAtMs - 5000;
  const to = Date.now() + 2000;
  const candidates = [];
  for (const project of projects) {
    if (!project.isDirectory() || !project.name.startsWith("--") || !project.name.endsWith("--")) continue;
    let sessionEntries;
    try {
      sessionEntries = await readdir(join(root, project.name), { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of sessionEntries) {
      if (!entry.isDirectory()) continue;
      const dir = join(root, project.name, entry.name);
      let info;
      try {
        info = await stat(dir);
      } catch {
        continue;
      }
      if (info.mtimeMs >= from && info.mtimeMs <= to) {
        candidates.push({ id: entry.name, info });
        break;
      }
    }
  }
  if (candidates.length === 0) return null;
  candidates.sort((a, b) => b.info.mtimeMs - a.info.mtimeMs);
  return candidates[0].id;
```

</details>

**依据 5 · 源码核查**：[lib/index.js:165-197](https://github.com/534119219/chicheng-cron/blob/99a223edfa090afa2f1f05c77526a53a0f277961/lib/index.js#L165-L197)

猜得ID用于分组和归档。

<details>
<summary>查看原文（33行）</summary>

```text
async function attachAgentSession(ctx, startedAtMs) {
  const registry = resolveWorkspaceRegistry(ctx);
  if (registry === null) return;
  const wsId = await ensureGroupWorkspace(ctx);
  if (wsId === null) return;
  const sessionId = await findRunSessionId(startedAtMs);
  if (sessionId === null) return;
  try {
    const ws = registry.get(wsId);
    if (ws && typeof ws.attachSession === "function") {
      await ws.attachSession(sessionId);
      console.info(`[chicheng-cron] session ${sessionId} attached to workspace 定时任务`);
    }
  } catch (error) {
    console.warn("[chicheng-cron] attach session failed:", error instanceof Error ? error.message : String(error));
  }
}

/**
 * Archive the session a run just created ("成功后归档会话"): it disappears
 * from the sidebar grouping surfaces while its log remains. Returns the
 * archived session id, or null when there is nothing to archive.
 */
async function archiveRunSession(ctx, startedAtMs) {
  const registry = resolveWorkspaceRegistry(ctx);
  if (registry === null || typeof registry.archiveSession !== "function") return null;
  const sessionId = await findRunSessionId(startedAtMs);
  if (sessionId === null) return null;
  try {
    await registry.archiveSession(sessionId);
    return sessionId;
  } catch (error) {
    console.warn("[chicheng-cron] archive session failed:", error instanceof Error ? error.message : String(error));
```

</details>

#### 缺口

- 多频任务重复触发、秒通配和并发会话误归属未执行复现。
  **影响**：源码反例足以限制承诺，但不推断所有现有用户已遭重复动作或误归档。
  **进一步探讨**：可从虚拟时钟的每日+10秒任务及两会话交错创建序列对照occurrence与真实session ID。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启动与日常流程依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web、webServer/webRuntime | 硬注入必需 | 调度宿主与API fence | Web关闭不执行，错过不补 |
| Node与可写DSH_HOME/cron | 执行/持久化必需 | 内置模块与任务/输出目录 | 包未声明最低Node，不能硬填版本 |
| cmd.exe或/bin/sh | shell任务需要 | 执行任务正文 | 按宿主账户权限运行，无专属沙箱 |
| Python可执行程序 | Python任务需要 | python/py/python3探测 | 未找到运行失败 |
| dsh CLI/headless模型配置 | Skill/Agent需要 | 启动另一个DSH profile | 读取Skill成功不代表模型/工具完整可用 |
| skills目录或ctx.skills | Skill正文需要 | 全文指引拼接 | 读取失败仍继续提示Agent自行完成 |
| workspaceRegistry | 分组/归档可选 | 会话整理 | 不可用时降级，不能凭按钮推断已归组 |
| 推送插件或messaging-core | 通知可选 | 向显式渠道发送输出 | 失败独立记录，可能向外发送敏感输出 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 固定版本、备份store、选择无副作用任务 | 明确宿主账户、工作目录和凭据可见范围 |
| 安装 | 挂载Web bundle重启 | 侧栏、API与store路径一致 |
| 配置 | 选任务类型、cron、cwd、timeout，预览时点 | 不把preview正确当调度去重验收 |
| 运行 | 先读输出与退出码，再检查业务产物 | 不自动以exit0判断Agent完成 |
| 整理 | 保守关闭自动归档，审查通知目标/内容 | 身份未绑定时避免错误会话整理 |
| 恢复 | 检查可能重复动作和子进程，不盲目runNow | 首次结果不明先对照外部状态 |

固定版本Node built-ins无第三方运行依赖，但这不消除解释器、模型、DSH与消息服务需求。只做源码检查，不执行任务、通知或宿主冒烟。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:13-39](https://github.com/534119219/chicheng-cron/blob/99a223edfa090afa2f1f05c77526a53a0f277961/package.json#L13-L39)

包导出与分发，无engines/运行依赖声明。

<details>
<summary>查看原文（27行）</summary>

```text
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/534119219/chicheng-cron.git"
  },
  "homepage": "https://github.com/534119219/chicheng-cron",
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": []
    }
  },
  "files": [
    "lib",
    "cordis.patch.yml",
    "README.md"
  ],
  "license": "MIT"
```

</details>

**依据 2 · 源码核查**：[lib/index.js:25-36](https://github.com/534119219/chicheng-cron/blob/99a223edfa090afa2f1f05c77526a53a0f277961/lib/index.js#L25-L36)

硬依赖与data目录。

<details>
<summary>查看原文（12行）</summary>

```text
const name = "chicheng-cron";
const inject = ["webServer", "webRuntime"];

// ---------------------------------------------------------------- paths

const DATA_ROOT = process.env.DSH_HOME
  ? join(process.env.DSH_HOME, "cron")
  : join(homedir(), ".dsh", "cron");
const STORE_PATH = join(DATA_ROOT, "store.json");
const RUNS_DIR = join(DATA_ROOT, "runs");
/** Dedicated workspace directory that hosts agent/skill task sessions (sidebar group "定时任务"). */
const GROUP_WORKSPACE_DIR = join(DATA_ROOT, "workspace");
```

</details>

**依据 3 · 源码核查**：[lib/index.js:649-665](https://github.com/534119219/chicheng-cron/blob/99a223edfa090afa2f1f05c77526a53a0f277961/lib/index.js#L649-L665)

缺headless profile时启动--help预热。

<details>
<summary>查看原文（17行）</summary>

```text
function warmUpHeadlessProfile() {
  const dshHome = process.env.DSH_HOME ?? join(homedir(), ".dsh");
  if (existsSync(join(dshHome, "profiles", "headless", "package.json"))) return;
  const bin = dshBinPath();
  if (bin === null) return;
  try {
    const child = spawn(process.execPath, [bin, "--profile", "headless", "--help"], {
      cwd: defaultCwd(),
      stdio: "ignore",
      detached: true,
      windowsHide: true,
    });
    child.unref();
  } catch {
    // warm-up is best-effort; agent runs still work (they just initialize on first use)
  }
}
```

</details>

**依据 4 · 源码核查**：[lib/index.js:797-854](https://github.com/534119219/chicheng-cron/blob/99a223edfa090afa2f1f05c77526a53a0f277961/lib/index.js#L797-L854)

解释器和CLI/Skill条件。

<details>
<summary>查看原文（58行）</summary>

```text
async function spawnForTask(task, cwd, workCwd, runDir, ctx) {
  const windows = process.platform === "win32";
  switch (task.type) {
    case "shell": {
      const scriptPath = join(runDir, windows ? "run.cmd" : "run.sh");
      const body = String(task.script ?? "");
      await writeFile(scriptPath, windows ? body : `#!/bin/sh\n${body}`, "utf8");
      if (windows) {
        return spawn(process.env.ComSpec || "cmd.exe", ["/d", "/s", "/c", scriptPath], { cwd, windowsHide: true, windowsVerbatimArguments: true, stdio: ["ignore", "pipe", "pipe"] });
      }
      return spawn("/bin/sh", [scriptPath], { cwd, windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
    }
    case "python": {
      if (pythonLauncher === null) pythonLauncher = await resolvePython();
      const scriptPath = join(runDir, "run.py");
      await writeFile(scriptPath, String(task.script ?? ""), "utf8");
      return spawn(pythonLauncher, [scriptPath], { cwd, windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
    }
    case "node": {
      const scriptPath = join(runDir, "run.mjs");
      await writeFile(scriptPath, String(task.script ?? ""), "utf8");
      return spawn(process.execPath, [scriptPath], { cwd, windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
    }
    case "skill":
    case "agent": {
      const prompt = await buildAgentPrompt(task, ctx, workCwd);
      const bin = dshBinPath();
      const args = bin !== null
        ? [bin, "--profile", "headless", prompt]
        : ["--profile", "headless", prompt];
      return spawn(bin !== null ? process.execPath : "dsh", args, { cwd, windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
    }
    default:
      throw new Error(`未知任务类型 "${task.type}"`);
  }
}

/** Compose the headless-agent prompt: inline skill instructions when present.
 * `workCwd` is the user-facing work directory (absolute paths guidance). */
async function buildAgentPrompt(task, ctx, workCwd) {
  const when = new Date().toLocaleString();
  const header = `定时任务触发了（${when}）。请直接完成任务，不要询问用户。`;
  const workHint = workCwd && String(workCwd).trim() !== ""
    ? `\n本次任务的工作目录是：${workCwd}（如需读写该目录下的文件，请使用绝对路径。）`
    : "";
  if (task.type === "skill" && task.skill) {
    const skillText = await loadSkillText(task.skill, ctx);
    const extra = String(task.prompt ?? "").trim();
    return [
      header,
      `请按照以下 skill "${task.skill}" 的完整指引来执行本次任务。`,
      skillText !== null ? `\n===== skill: ${task.skill} =====\n${skillText}\n===== skill 结束 =====` : `（注意：提供名为 "${task.skill}" 的 skill 内容未能读取，请基于可用 skill 目录自行完成。）`,
      extra !== "" ? `\n附加说明：\n${extra}` : "",
      workHint,
      "\n完成后请简明汇报结果（做了什么、输出/结果是什么）。",
    ].join("\n");
  }
  return `${header}\n${String(task.prompt ?? "")}${workHint}`;
```

</details>

**依据 5 · 作者声明**：[README.md:46-63](https://github.com/534119219/chicheng-cron/blob/99a223edfa090afa2f1f05c77526a53a0f277961/README.md#L46-L63)

作者安装与用户配置流程。

<details>
<summary>查看原文（18行）</summary>

````text

```sh
dsh plugin --profile web add github:534119219/chicheng-cron
```

安装后重启 `dsh web`，左侧栏「新会话」下方出现「定时任务」按钮。

> 从源码开发时提示：`dsh plugin add` 会把 `file:` 依赖物化成目录快照，改源码后可用仓库内 `scripts/relink-dev.ps1` 恢复 junction 指向源码。

## 使用

1. 点击侧栏「定时任务」→ 新建任务
2. 选择类型并填写：名称、cron 表达式（实时预览下次执行时间）、脚本/提示词、工作目录、超时
3. 可选：
   - **完成后推送通知**：选择渠道（chicheng-push 或 messaging-core 会话）、推送标题/内容（留空用默认，自动附输出）
   - **Agent/Skill 会话归入「定时任务」分组**
   - **成功后自动归档会话**（对话从侧栏隐藏，日志保留）
4. 保存后到点自动执行；「立即执行」可随时手动触发，执行历史查看结果与输出
````

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 安全、持久化和资源恢复如何？

**研究主题**：工程质量与复用

#### 完整回答

API限定POST、有1MiB JSON上限，fence检查回环或trustedHosts、拒绝sec-fetch-site=cross-site，有Origin时比较host含端口。这是具体来源防线，但Origin缺失允许、比较不含scheme，不构成用户身份认证。任务正文就是任意脚本或Agent提示词，cwd不是权限围栏，子进程继承宿主环境；修改调度的权限实质是执行宿主动作的权限。

任务/历史以临时文件rename持久化，150ms去抖，读损坏直接空store，保存失败仅日志。各次flush未串行锁，同一tmp文件可被并发写或重命名；运行历史保留200条，但目录清理只在卸载时保留100份，长期运行输出目录可积累。超时只child.kill(SIGKILL)，未见进程组/后代树清理；脚本派生的子进程和外部副作用不因父进程杀死撤销。

teardown停止wakeTimer并flush/prune，不跟踪或等待正在执行的children，也没有取消后续push/归档。模块级tearDown置true后apply不重置，进程内同模块重启的调度恢复也需核查。分组默认改变Agent真实cwd，prompt工作目录提示不能替代模型工具世界约束。通知默认附前800字输出，用户需理解渠道外发范围，失败重试与去重也没有单独递送收据协议。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1108-1138](https://github.com/534119219/chicheng-cron/blob/99a223edfa090afa2f1f05c77526a53a0f277961/lib/index.js#L1108-L1138)

fence检查与无Origin放行边界。

<details>
<summary>查看原文（31行）</summary>

```text
    return undefined;
  }
}

function isLoopbackHostname(hostname) {
  if (hostname === "localhost" || hostname === "[::1]") return true;
  const parts = hostname.split(".");
  return parts.length === 4 && parts[0] === "127" && parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255);
}

function isTrustedApiRequest(request, trustedHosts) {
  const host = header(request.headers, "host");
  if (host === undefined) return false;
  const hostUrl = parseAuthority(host);
  if (hostUrl === undefined) return false;
  const hosts = Array.isArray(trustedHosts) ? trustedHosts : [];
  const trusted = hosts.some((entry) => {
    const entryUrl = parseAuthority(entry);
    if (entryUrl === undefined) return false;
    return entryUrl.hostname === hostUrl.hostname && (entryUrl.port === "" || entryUrl.port === hostUrl.port);
  });
  if (!isLoopbackHostname(hostUrl.hostname) && !trusted) return false;
  if (header(request.headers, "sec-fetch-site") === "cross-site") return false;
  const origin = header(request.headers, "origin");
  if (origin === undefined) return true;
  try {
    return new URL(origin).host === hostUrl.host;
  } catch {
    return false;
  }
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:399-432](https://github.com/534119219/chicheng-cron/blob/99a223edfa090afa2f1f05c77526a53a0f277961/lib/index.js#L399-L432)

损坏空store和去抖tmp/rename。

<details>
<summary>查看原文（34行）</summary>

```text
async function loadStore() {
  try {
    const raw = await readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.tasks)) store = parsed;
  } catch {
    store = structuredClone(EMPTY_STORE);
  }
  if (!Array.isArray(store.tasks)) store.tasks = [];
  if (!Array.isArray(store.runs)) store.runs = [];
  if (typeof store.seq !== "number") store.seq = store.tasks.length;
}

/** Debounced atomic persist (tolerates crashes: tmp + rename). */
function scheduleSave() {
  if (storeDirtyTimer !== null) return;
  storeDirtyTimer = setTimeout(() => {
    storeDirtyTimer = null;
    void flushStore();
  }, 150);
}

async function flushStore() {
  try {
    await mkdir(DATA_ROOT, { recursive: true });
    const tmp = `${STORE_PATH}.tmp`;
    await writeFile(tmp, JSON.stringify(store, null, 2), "utf8");
    await rename(tmp, STORE_PATH);
  } catch (error) {
    console.error(`[chicheng-cron] store flush failed:`, error);
  }
}

// ---------------------------------------------------------------- cron engine
```

</details>

**依据 3 · 源码核查**：[lib/index.js:691-713](https://github.com/534119219/chicheng-cron/blob/99a223edfa090afa2f1f05c77526a53a0f277961/lib/index.js#L691-L713)

历史保留200，记录运行而不建执行锁。

<details>
<summary>查看原文（23行）</summary>

```text
async function executeRun(ctx, task, reason) {
  const runId = randomUUID();
  const runDir = join(RUNS_DIR, runId);
  const outputPath = join(runDir, "output.txt");
  const startedAt = new Date().toISOString();
  const record = {
    runId,
    taskId: task.id,
    name: task.name,
    type: task.type,
    reason,
    status: "running",
    startedAt,
    exitCode: null,
    durationMs: null,
    outputLength: 0,
    outputPath,
  };
  store.runs.unshift(record);
  if (store.runs.length > 200) store.runs.length = 200;
  scheduleSave();

  const finalize = (patch) => {
```

</details>

**依据 4 · 源码核查**：[lib/index.js:744-756](https://github.com/534119219/chicheng-cron/blob/99a223edfa090afa2f1f05c77526a53a0f277961/lib/index.js#L744-L756)

超时只杀直接child。

<details>
<summary>查看原文（13行）</summary>

```text
    if (task.timeoutMs && Number(task.timeoutMs) > 0) {
      timer = setTimeout(() => {
        timedOut = true;
        try { child.kill("SIGKILL"); } catch { /* noop */ }
      }, Number(task.timeoutMs));
    }
    const exitCode = await new Promise((resolveExit) => {
      child.on("error", (error) => {
        chunks.push(Buffer.from(`\n[spawn error] ${error.message}`, "utf8"));
        resolveExit(-1);
      });
      child.on("close", (code) => resolveExit(code));
    });
```

</details>

**依据 5 · 源码核查**：[lib/index.js:1400-1408](https://github.com/534119219/chicheng-cron/blob/99a223edfa090afa2f1f05c77526a53a0f277961/lib/index.js#L1400-L1408)

只在prune时删旧目录。

```text
function pruneRunFiles() {
  const keep = new Set(store.runs.slice(0, 100).map((run) => run.runId));
  void readdir(RUNS_DIR, { withFileTypes: true })
    .then((entries) => Promise.all(
      entries.filter((entry) => entry.isDirectory() && !keep.has(entry.name))
        .map((entry) => rm(join(RUNS_DIR, entry.name), { recursive: true, force: true }).catch(() => {}))
    ))
    .catch(() => {});
}
```

**依据 6 · 源码核查**：[lib/index.js:1456-1465](https://github.com/534119219/chicheng-cron/blob/99a223edfa090afa2f1f05c77526a53a0f277961/lib/index.js#L1456-L1465)

teardown不取消运行children/通知链。

<details>
<summary>查看原文（10行）</summary>

```text
    tearDown = true;
    currentCtx = null;
    if (wakeTimer !== null) clearTimeout(wakeTimer);
    wakeTimer = null;
    void flushStore();
    pruneRunFiles();
  }, "chicheng-cron: teardown");

  reschedule();
  ctx.logger?.info?.("[chicheng-cron] started, data root: " + DATA_ROOT);
```

</details>

#### 缺口

- 子进程树、热卸载后继续通知及并发flush实际行为未运行核查。
  **影响**：不能承诺超时即停止全部动作或卸载后无后台活动。
  **进一步探讨**：可在可丢弃目录以受控子进程树和保存故障检查剩余进程、文件与通知收据。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 成本、采用与未来设计如何判断？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 常驻Web、解释器/headless配置及磁盘 | 编写脚本、核对权限/时点和通知目标 | 未测初始化耗时，预热可能建profile |
| 持续使用 | 任务子进程、Agent模型消耗、运行输出和推送 | 复核产物与调度、维护Skill依赖 | 重复/重叠可能放大token和外部副作用 |
| 失败恢复 | 保存备份、重试和外部状态核对 | 查首次是否执行、清理后代进程与误归档 | 无执行一次收据，恢复成本未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 操作集中 | 五类任务、预览与运行历史 | 相比系统cron实际省多少时间 |
| 调度 | 单timer和本地cron计算 | 可靠单次触发，已有重复反例 |
| 执行 | 进程退出/timeout和有界输出 | 完整业务成功或所有后代停止 |
| 整理通知 | 多通道与mtime会话候选 | 身份准确、递送去重与净收益 |

建议观察。功能组合覆盖明确日常自动化，但一分钟回看触发缺少occurrence去重、并发控制及mtime会话身份会影响核心可靠性；不建议直接安排非幂等、付费密集或自动归档任务。继续探讨可先阅读/模拟每日+高频任务，再核对真实run→session绑定和超时后代清理。

未验证假设是把taskId+计划时点形成持久occurrence，执行前原子claim，明确跳过/排队/允许重叠策略，并从headless得到稳定session收据后再通知/归档。相较按时间窗口猜due和mtime猜归属，可能减少重复和误整理；代价是崩溃结果未知与过期claim恢复复杂度。最小对照用虚拟时钟混合每日/10秒任务、重启和双Agent交错，比较每时点次数、错误session、结果未知与恢复人工时间；若少重复但持续漏跑，仍不能满足目标。未实现，不计当前创新。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1034-1057](https://github.com/534119219/chicheng-cron/blob/99a223edfa090afa2f1f05c77526a53a0f277961/lib/index.js#L1034-L1057)

一分钟回看和无claim调度是设计起点。

<details>
<summary>查看原文（24行）</summary>

```text
    if (!task.enabled) continue;
    let parsed;
    try {
      parsed = validateSchedule(task);
    } catch {
      continue;
    }
    const next = nextCronTime(parsed, new Date(now - 60000));
    if (next !== null && next.getTime() <= now) due.push(task);
  }
  for (const task of due) {
    void executeRun(currentCtx, task, "cron");
  }
  reschedule();
}

// ---------------------------------------------------------------- API wire

const MAX_BODY_BYTES = 1 << 20;

class CronError extends Error {
  constructor(code, message, status = 400) {
    super(message);
    this.code = code;
```

</details>

**依据 2 · 源码核查**：[lib/index.js:121-157](https://github.com/534119219/chicheng-cron/blob/99a223edfa090afa2f1f05c77526a53a0f277961/lib/index.js#L121-L157)

mtime不能替代session收据。

<details>
<summary>查看原文（37行）</summary>

```text
async function findRunSessionId(startedAtMs) {
  const root = sessionsRoot();
  let projects;
  try {
    projects = await readdir(root, { withFileTypes: true });
  } catch {
    return null;
  }
  const from = startedAtMs - 5000;
  const to = Date.now() + 2000;
  const candidates = [];
  for (const project of projects) {
    if (!project.isDirectory() || !project.name.startsWith("--") || !project.name.endsWith("--")) continue;
    let sessionEntries;
    try {
      sessionEntries = await readdir(join(root, project.name), { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of sessionEntries) {
      if (!entry.isDirectory()) continue;
      const dir = join(root, project.name, entry.name);
      let info;
      try {
        info = await stat(dir);
      } catch {
        continue;
      }
      if (info.mtimeMs >= from && info.mtimeMs <= to) {
        candidates.push({ id: entry.name, info });
        break;
      }
    }
  }
  if (candidates.length === 0) return null;
  candidates.sort((a, b) => b.info.mtimeMs - a.info.mtimeMs);
  return candidates[0].id;
```

</details>

**依据 3 · 源码核查**：[lib/index.js:744-748](https://github.com/534119219/chicheng-cron/blob/99a223edfa090afa2f1f05c77526a53a0f277961/lib/index.js#L744-L748)

直接child timeout决定恢复边界。

```text
    if (task.timeoutMs && Number(task.timeoutMs) > 0) {
      timer = setTimeout(() => {
        timedOut = true;
        try { child.kill("SIGKILL"); } catch { /* noop */ }
      }, Number(task.timeoutMs));
```

**依据 4 · 源码核查**：[lib/index.js:316-348](https://github.com/534119219/chicheng-cron/blob/99a223edfa090afa2f1f05c77526a53a0f277961/lib/index.js#L316-L348)

输出进入通知的持续成本。

<details>
<summary>查看原文（33行）</summary>

```text
async function sendTaskPush(ctx, task, record) {
  try {
    if (!task.pushEnabled) return null;
    const rawChannel = String(task.pushChannel ?? "").trim();
    const output = await readFile(record.outputPath, "utf8").catch(() => "");
    const durationMs = record.durationMs;
    const durationText = durationMs === null || durationMs === undefined
      ? ""
      : durationMs < 1000
        ? `${Math.round(durationMs)}ms`
        : `${(durationMs / 1000).toFixed(1)}s`;
    const values = {
      name: task.name,
      type: task.type,
      status: PUSH_STATUS_LABELS[record.status] ?? record.status,
      exitCode: record.exitCode ?? "",
      duration: durationText,
      time: new Date(record.startedAt).toLocaleString(),
      output: output.slice(0, 800),
    };
    const title = renderTemplate(
      task.pushTitle && String(task.pushTitle).trim() !== "" ? task.pushTitle : `定时任务「{name}」执行完成`,
      values,
    );
    const userContent = task.pushContent && String(task.pushContent).trim() !== "";
    const defaultContent = `状态：{status}（exit {exitCode}）\n耗时：{duration}\n完成时间：{time}`;
    const content = renderTemplate(userContent ? task.pushContent : defaultContent, values);
    // When the user did not write a custom template, append the run output
    // (the agent's final answer for agent/skill tasks) automatically.
    const effectiveContent = !userContent && output.trim() !== ""
      ? `${content}\n\n输出：\n${output.slice(0, 800)}`
      : content;
    // messaging-core target: "messaging:<platform>:<chatId>"
```

</details>

#### 缺口

- 没有相同任务用系统cron/手动方式与插件的可靠性及人工成本对照。
  **影响**：不能量化自动化净收益。
  **进一步探讨**：固定无副作用任务和时钟序列比较次数、产物与恢复投入。
- occurrence claim与稳定session收据未实现或比较。
  **影响**：不提高当前可靠性等级。
  **进一步探讨**：从混频、崩溃重启、并发Agent序列核对重复/漏跑/错归档。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
