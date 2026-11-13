# StudyMate

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[e268d37](https://github.com/Miaotofu01/Study-Mate/tree/e268d37db2aba0b0c49f040907df3fcf6edf9a74)

<!-- BEGIN META -->
[![GitHub ★ 1,435](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C435&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Miaotofu01/Study-Mate) [![npm 30d 7,970](https://img.shields.io/static/v1?label=npm+30d&message=7%2C970&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@yunmiao/studymate) [![最新发布 2026-11-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@yunmiao/studymate)
<!-- END META -->

> **功能**：为自学任务提供学习预设、课件与练习、答疑和独立学习工作区。

> **亮点**：[Q01](#research-q01) 把学习资料和工具绑定到 DSH 预设，按宿主解析能力适配旧子路径。[Q02](#research-q02) 学习工具对实际写入回调做域校验。

> **主要限制**：[Q02](#research-q02) 域守卫和无 shell 不能隔离不可信程序；[Q03](#research-q03) 课件及实验回执不能代替掌握度。

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
  - [Q01 · 新旧宿主如何加载课程与答疑？](#detail-section-11)
  - [Q02 · 域 guard 和实验执行分别保护什么？](#detail-section-12)
  - [Q03 · 课程产物怎样转换成可核的学习结果？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：数学或计算机自学者需要把课件、练习与答疑持续组织在同一学习计划。

人工在教材、笔记、练习和自由聊天之间维护学习进度。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 预设 | 组织学习与答疑 | 依赖匹配宿主 |
| 学习工具 | 维护课件与练习 | 只在声明域内 |
| 实验 | 记录受控进程结果 | 需要可信代码与独立权限 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH 与 Node | 宿主需要 | 预设与工具 | 停止原生使用 |
| 可信学习工作区 | 需要 | 保存课件和进度 | 备份并人工维护 |
| 已审阅实验及独立隔离 | 实验需要 | 控制进程副作用 | 不执行 |

| 步骤 | 谁操作 | 操作与结果 | 失败处理 |
| --- | --- | --- | --- |
| 准备 | 学习者 | 备份并选一课 | 回教材 |
| 核查 | 学习者 | 比对预设及课件原文 | 停自动推进 |
| 验收 | 学习者 | 独立完成新题 | 继续人工计划 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主和存储 | 配置独立目录 | 兼容未知 |
| 持续 | 模型和可选实验 | 核课件及作答 | 单位合格课时未测 |
| 恢复 | 工作区副本 | 检查版本和进程 | 不运行未知脚本 |
| 退出 | 保留学习材料 | 备份后停用 | 回教材 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 课程组织 | 预设、持久文件 | 实际掌握 |
| 写入范围 | 域和路径模式 | 宿主全面隔离 |
| 实验 | 命令参数及回执 | 不可信代码安全 |

> **思考**：[Q02](#research-q02) 域守卫和无 shell 不能隔离不可信程序；[Q03](#research-q03) 课件及实验回执不能代替掌握度。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把学习资料和工具绑定到 DSH 预设，按宿主解析能力适配旧子路径。[Q02](#research-q02) 学习工具对实际写入回调做域校验。

[Q01](#research-q01) 用可解析性适配旧子路径，[Q02](#research-q02) 按域 guard 不等于系统隔离。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 域守卫和无 shell 不能隔离不可信程序；[Q03](#research-q03) 课件及实验回执不能代替掌握度。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 限独立工作区试一课，核教材和迁移题，发现错误立即停自动推进。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认预设和域守卫及进程入口，真实两代兼容、实验隔离和学习收益待核。

- 已检查：作者 README、包清单、源码路径 README.md、bin/dsh-plugin.ts、lib/host/access.ts、lib/lab/runner.ts、preset/learning/agent.cordis.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核预设加载、域读写及实验进程入口；未穷尽阅读端、全部格式器和真实兼容性，未运行目标。
- 下一步：分别用两代宿主检查学习卡与实际工具，随后只用受控教材和小课做迁移题对照。

**分析版本**

- **仓库**：[Miaotofu01/Study-Mate](https://github.com/Miaotofu01/Study-Mate)
- **版本号**：2.0.4（[固定提交 e268d37](https://github.com/Miaotofu01/Study-Mate/tree/e268d37db2aba0b0c49f040907df3fcf6edf9a74)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 对照现有流程试延迟复测和未见迁移题，判断是否应推进课程。

分别用两代宿主检查学习卡与实际工具，随后只用受控教材和小课做迁移题对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 69 | 13930 | — | — | 275349 |
| .mjs | source | 20 | 3606 | 2653 | 738 | — |
| .ts | source | 79 | 21927 | 15142 | 5094 | — |
| .js | source | 1 | 5365 | 3649 | 1393 | — |
| .mjs | test | 95 | 33030 | 25779 | 4790 | — |
| .js | example | 2 | 529 | 371 | 124 | — |
| .mjs | example | 13 | 1952 | 1393 | 437 | — |
| .md | test | 1 | 220 | — | — | 9792 |

</details>

**活跃度**

[![Issue 未关闭 28](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=28&color=737b86&logo=github)](https://github.com/Miaotofu01/Study-Mate/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 61](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=61&color=737b86&logo=github)](https://github.com/Miaotofu01/Study-Mate/issues?q=is%3Aissue+created%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z) [![近30天关闭 41](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=41&color=737b86&logo=github)](https://github.com/Miaotofu01/Study-Mate/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：学习预设如何在两代宿主加载并持久化学习数据，什么结果才能支持继续使用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 新旧宿主如何加载课程与答疑？

**研究主题**：场景与需求、功能与机制、贡献与相对优势、依赖、兼容与流程

#### 完整回答

自学者可以将生成课件与答疑分到不同预设，课件和进度继续留在配置的学习工作区。Host 从 profile 服务生成并各自注册学习和答疑预设，失败则警告；host 级任务另挂，具体学习工具只在学习预设。固定学习 YAML 保留 list-agents 子路径行，disabled 表达式从当前加载基址解析，失败则停用该行。这样可兼容仍需独立路径的宿主，也避免主包合并工具后因无效子路径让整个预设失败。可解析只是入口前提，不能保证实际工具组合兼容。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:61-63](https://github.com/Miaotofu01/Study-Mate/blob/e268d37db2aba0b0c49f040907df3fcf6edf9a74/README.md#L61-L63)

作者说明学习模式与学习文件。

```text
- **第一次学习**：新建会话时选「学习模式」，说一句「我想学 [某个科目]」。学习数据直接写进配置好的学习工作区（暂存模式已删，没有"收尾问落点再搬一次"这一步）。
- **还没想好学什么**：在学习对话里说「我不知道学什么，帮我选方向」，可选探索后再决定是否开课；已有明确科目或恢复学习直接走原流程。
- **学习工作区默认在 `~/StudyMate`，所有课件与记忆均存放在工作区**；已有配置会沿用。
```

**依据 2 · 源码核查**：[bin/dsh-plugin.ts:72-110](https://github.com/Miaotofu01/Study-Mate/blob/e268d37db2aba0b0c49f040907df3fcf6edf9a74/bin/dsh-plugin.ts#L72-L110)

实际预设注册、异常和作用域。

<details>
<summary>查看原文（39行）</summary>

```text
export async function apply(ctx: PluginContext): Promise<void> {
  const profile = ctx.get?.('profileContext');
  if (!profile || !ctx.agentPresets?.register) {
    console.warn('StudyMate：当前 DSH 不支持原生插件接口（需要 0.1.7-alpha.1+）；已跳过原生加载。旧版请使用 npx -y @yunmiao/studymate@latest install。');
  } else {
    try {
      // installPayload 在 bin/studymate.mjs（本次不迁）：TS 从 JS 里推断出「四个必填参数」，
      // 而 native 启动本来就只传这三个（其余由它自己探测/默认）。断言只影响类型，运行期一字未改。
      const { registration } = installPayload({
        native: true, profile: profile.name, dshHome: profile.home,
      } as Parameters<typeof installPayload>[0]);
      // `!`：ctx.effect 缺失时的 TypeError 由下面的 catch 兜住（与迁移前同一条路径）
      await ctx.effect!(() => ctx.agentPresets!.register(registration.config));
      // 「答疑模式」是第二条预设，自己的 effect、自己的 disposer。`installPayload` 一次产出
      // 两条（学习 + 答疑），这里各注册各的——缺了它（老包）只少一条预设，学习的照常。
      if (registration.qaConfig !== undefined) {
        await ctx.effect!(() => ctx.agentPresets!.register(registration.qaConfig));
      }
    } catch (error) {
      // Startup may report a problem, but must not migrate profile ownership.
      console.warn(`StudyMate：已跳过原生加载。${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // ── 宿主层（#138）──────────────────────────────────────────────────────
  // 导出的任务类型、任务域那条阅读端路由与销毁回执、实验域的任务类型与台账收尾、文件监听
  // ——这些是进程级的东西，注册在**插件所在的 profile 根**上。具体注册什么在
  // `lib/tools/index.ts` 的 `registerStudyMateHost` 里，这个文件不认识任何工具。
  //
  // **原生工具不在这里**：九个学习工具 + 五个 `studymate_task_*` + 一个 `studymate_lab_run`
  // 由「学习模式」预设那条插件行（`@yunmiao/studymate/learning-preset`）注册进**预设作用域**
  // ——落在 profile 根会让同一个 profile 里每个预设的会话都看见它们（#87 那条已知偏离）。
  //
  // 模块在这里 await 加载（不是丢一个浮动 Promise）：apply 返回时这些已经挂好；这个文件也可能
  // 被单独拷出去跑（那时 ctx 没有 inject），所以加载放在 inject 判断之后。
  if (typeof ctx.inject !== 'function') return;
  try {
    const { registerStudyMateHost } = await import('../lib/tools/index.ts');
    registerStudyMateHost(ctx as unknown as Parameters<typeof registerStudyMateHost>[0]);
```

</details>

**依据 3 · 源码核查**：[preset/learning/agent.cordis.yml:194-214](https://github.com/Miaotofu01/Study-Mate/blob/e268d37db2aba0b0c49f040907df3fcf6edf9a74/preset/learning/agent.cordis.yml#L194-L214)

主包和子路径按当前解析能力装配。

<details>
<summary>查看原文（21行）</summary>

```text
- id: delegation
  name: cordis:group
  group: true
  isolate:
    workflowEngine: true
  config:
    - id: tool-subagent-control
      name: '@deepseek-ai/dsh-tool-subagent-control'

    # 0.2.2 把 `list_agents` 并进了主包（上面那行自己注册），`./list-agents` 子路径不再导出；
    # 0.2.1 及以前反过来只认这条子路径行（#248 直接删掉了它，旧宿主会因此少一个工具）。
    # 所以**留着行、按能否解析决定停用**：宿主把「有一行起不来」判成整条预设 broken——
    # 0.2.2 上硬挂这条，学习模式整张卡片都显示加载失败。
    # 判据与加载器同一套（`createRequire(baseUrl)`），解析不到才停用；0.2.1 上照常启用。
    - id: tool-subagent-list-agents
      name: '@deepseek-ai/dsh-tool-subagent-control/list-agents'
      disabled: !!js >-
        (() => { try {
          return !process.getBuiltinModule('node:module')
            .createRequire(ctx.baseUrl).resolve('@deepseek-ai/dsh-tool-subagent-control/list-agents');
        } catch { return true; } })()
```

</details>

#### 缺口

- 未在两代宿主真实加载预设
  **影响**：不能确认工具无遗漏或重复
  **进一步探讨**：用相同工作区核卡片状态及实际工具列表

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 域 guard 和实验执行分别保护什么？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

学习工具调用 access.write 时，若域或字段模式不匹配即抛，只有通过才执行写入回调；read 也检查声明域。这能防止正常接线的工具跨域。实验 runner 是另一边界，用配置的 cwd、env 和 argv 直接 spawn，shell:false，可限时、取消并发终止信号；它并未用操作系统机制禁止被运行程序自行读写其他可访问路径。课程和代码可信性仍由学习者核对。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host/access.ts:151-193](https://github.com/Miaotofu01/Study-Mate/blob/e268d37db2aba0b0c49f040907df3fcf6edf9a74/lib/host/access.ts#L151-L193)

读和写回调实际按域、模式校验。

<details>
<summary>查看原文（43行）</summary>

```text
export function createAccess(
  options: { tool: string; declaration: Declaration },
  load: DomainLoader,
): DomainAccess {
  const { tool, declaration } = options;
  const reads = declaration.reads ?? [];
  const writes = declaration.writes ?? {};
  return {
    reads,
    writes,
    read<T>(domain: Domain, target?: string, options?: unknown): T {
      if (!reads.includes(domain)) {
        throw new DomainViolationError({
          tool, action: 'read', domain, declared: reads,
          ...target === undefined ? {} : { target },
          why: '这个域不在工具声明的读域里',
        });
      }
      if (isWriteOnly(domain)) {
        throw new DomainViolationError({
          tool, action: 'read', domain, declared: reads,
          ...target === undefined ? {} : { target },
          why: '这个域是只写的（导出落点没有读法）',
        });
      }
      return load(domain, target, options) as T;
    },
    write<T>(domain: Domain, path: string, mutate: () => T): T {
      const patterns = writes[domain];
      if (!patterns || patterns.length === 0) {
        throw new DomainViolationError({
          tool, action: 'write', domain, target: path, declared: Object.keys(writes),
          why: '这个域不在工具声明的写域里',
        });
      }
      if (!patterns.some((pattern) => matchesPattern(pattern, path))) {
        throw new DomainViolationError({
          tool, action: 'write', domain, target: path, declared: patterns,
          why: '这个字段不在工具声明允许写的字段模式里',
        });
      }
      return mutate();
    },
```

</details>

**依据 2 · 源码核查**：[lib/lab/runner.ts:223-242](https://github.com/Miaotofu01/Study-Mate/blob/e268d37db2aba0b0c49f040907df3fcf6edf9a74/lib/lab/runner.ts#L223-L242)

真实进程、cwd、env 和无 shell。

<details>
<summary>查看原文（20行）</summary>

```text
  const err = new BoundedText();
  const env = buildEnv(options.workspace, sandboxHome);
  let done = false;

  try {
    const finished = await new Promise<{ code: number | null; signal: NodeJS.Signals | null; error: string }>((resolve) => {
      let child;
      try {
        child = spawn(options.argv[0] as string, options.argv.slice(1), {
          cwd: options.cwd,
          env,
          shell: false,
          // POSIX 上自成进程组：杀的时候连孩子一起杀（见文件头第 4 条）
          detached: process.platform !== 'win32',
          stdio: ['ignore', 'pipe', 'pipe'],
        });
      } catch (error) {
        resolve({ code: null, signal: null, error: error instanceof Error ? error.message : String(error) });
        return;
      }
```

</details>

**依据 3 · 源码核查**：[lib/lab/runner.ts:250-271](https://github.com/Miaotofu01/Study-Mate/blob/e268d37db2aba0b0c49f040907df3fcf6edf9a74/lib/lab/runner.ts#L250-L271)

超时与取消发送进程终止。

<details>
<summary>查看原文（22行）</summary>

```text
      const killGroup = (signal: NodeJS.Signals): void => {
        try {
          if (process.platform !== 'win32' && typeof child.pid === 'number') process.kill(-child.pid, signal);
          else child.kill(signal);
        } catch {
          // 已经死了（ESRCH）：要的就是它死，这条不算问题
        }
      };
      /** 先 SIGTERM，宽限之后还在就 SIGKILL。 */
      const terminate = (why: '超时' | '取消'): void => {
        if (outcome === '跑完') outcome = why;
        killGroup('SIGTERM');
        const timer = setTimeout(() => killGroup('SIGKILL'), KILL_GRACE_MS);
        timer.unref?.();
        timers.push(timer);
      };

      const onAbort = (): void => terminate('取消');
      options.signal?.addEventListener('abort', onAbort, { once: true });
      const timeoutTimer = setTimeout(() => terminate('超时'), timeoutMs);
      timeoutTimer.unref?.();
      timers.push(timeoutTimer);
```

</details>

#### 缺口

- 外部隔离策略和不同平台子进程树行为未核查
  **影响**：不能承诺不可信实验安全
  **进一步探讨**：仅在另有权限隔离时用无害样本测试路径和停止结果

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 课程产物怎样转换成可核的学习结果？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

选一课，把同一教材和时段用于 StudyMate 与人工笔记，保留课件、练习记录与对照。合格结果是学习者不看课件独立完成未见题，文件存在、格式通过或实验进程退出都不足以代替。首次核工作区与预设，持续核课件、作答与模型调用，失败恢复依赖副本；未测单位合格课程人时或现金成本。可测试延迟复测和未见迁移题决定是否推进章节，若同等时间下实际掌握不提升或额外负担抵消收益，保留人工计划。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:61-63](https://github.com/Miaotofu01/Study-Mate/blob/e268d37db2aba0b0c49f040907df3fcf6edf9a74/README.md#L61-L63)

学习工作区是可备份和可比对的交付点。

```text
- **第一次学习**：新建会话时选「学习模式」，说一句「我想学 [某个科目]」。学习数据直接写进配置好的学习工作区（暂存模式已删，没有"收尾问落点再搬一次"这一步）。
- **还没想好学什么**：在学习对话里说「我不知道学什么，帮我选方向」，可选探索后再决定是否开课；已有明确科目或恢复学习直接走原流程。
- **学习工作区默认在 `~/StudyMate`，所有课件与记忆均存放在工作区**；已有配置会沿用。
```

**依据 2 · 源码核查**：[bin/dsh-plugin.ts:84-103](https://github.com/Miaotofu01/Study-Mate/blob/e268d37db2aba0b0c49f040907df3fcf6edf9a74/bin/dsh-plugin.ts#L84-L103)

学习与答疑、宿主任务分别挂载。

<details>
<summary>查看原文（20行）</summary>

```text
      await ctx.effect!(() => ctx.agentPresets!.register(registration.config));
      // 「答疑模式」是第二条预设，自己的 effect、自己的 disposer。`installPayload` 一次产出
      // 两条（学习 + 答疑），这里各注册各的——缺了它（老包）只少一条预设，学习的照常。
      if (registration.qaConfig !== undefined) {
        await ctx.effect!(() => ctx.agentPresets!.register(registration.qaConfig));
      }
    } catch (error) {
      // Startup may report a problem, but must not migrate profile ownership.
      console.warn(`StudyMate：已跳过原生加载。${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // ── 宿主层（#138）──────────────────────────────────────────────────────
  // 导出的任务类型、任务域那条阅读端路由与销毁回执、实验域的任务类型与台账收尾、文件监听
  // ——这些是进程级的东西，注册在**插件所在的 profile 根**上。具体注册什么在
  // `lib/tools/index.ts` 的 `registerStudyMateHost` 里，这个文件不认识任何工具。
  //
  // **原生工具不在这里**：九个学习工具 + 五个 `studymate_task_*` + 一个 `studymate_lab_run`
  // 由「学习模式」预设那条插件行（`@yunmiao/studymate/learning-preset`）注册进**预设作用域**
  // ——落在 profile 根会让同一个 profile 里每个预设的会话都看见它们（#87 那条已知偏离）。
```

</details>

**依据 3 · 源码核查**：[lib/lab/runner.ts:228-245](https://github.com/Miaotofu01/Study-Mate/blob/e268d37db2aba0b0c49f040907df3fcf6edf9a74/lib/lab/runner.ts#L228-L245)

实验只返回过程事实，无法判断掌握。

<details>
<summary>查看原文（18行）</summary>

```text
    const finished = await new Promise<{ code: number | null; signal: NodeJS.Signals | null; error: string }>((resolve) => {
      let child;
      try {
        child = spawn(options.argv[0] as string, options.argv.slice(1), {
          cwd: options.cwd,
          env,
          shell: false,
          // POSIX 上自成进程组：杀的时候连孩子一起杀（见文件头第 4 条）
          detached: process.platform !== 'win32',
          stdio: ['ignore', 'pipe', 'pipe'],
        });
      } catch (error) {
        resolve({ code: null, signal: null, error: error instanceof Error ? error.message : String(error) });
        return;
      }

      let outcome: '跑完' | '超时' | '取消' = '跑完';
      const timers: NodeJS.Timeout[] = [];
```

</details>

#### 缺口

- 未做独立作答和延迟迁移对照
  **影响**：不能推断学习效果
  **进一步探讨**：同教材、同学习时间，预先列出不重复的迁移题及评分准则

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
