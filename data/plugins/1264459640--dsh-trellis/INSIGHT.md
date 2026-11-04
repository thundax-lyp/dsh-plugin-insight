# dsh-trellis

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[d30f232](https://github.com/1264459640/dsh-trellis/tree/d30f232e641977cd843ddad00412b4110f8f14f9)

<!-- BEGIN META -->
[![GitHub ★ 11](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=11&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1264459640/dsh-trellis) [![npm 30d 2,737](https://img.shields.io/static/v1?label=npm+30d&message=2%2C737&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@banana-peeljj12/dsh-trellis) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@banana-peeljj12/dsh-trellis)
<!-- END META -->

> **功能**：为 DSH 提供任务阶段、步骤状态、会话提示与可选规划期工具过滤。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示阶段文件、步骤及会话指针连接每轮提示，减少用户手工将状态重新放入会话的接线；这属于已有工作流的宿主适配。

> **主要限制**：[Q03](#research-q03) 的人工验证为工具输入字段，Git 超时等情况会放行；[Q04](#research-q04) 仅过滤指定工具，保留 shell，因此这些约束不能代替独立审批或写权限控制。

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
  - [Q01 · 谁适合使用 Trellis 流程，它比手工任务清单增加了什么？](#detail-section-11)
  - [Q02 · 任务与会话指针如何建立和更新，失败是否完整回滚？](#detail-section-12)
  - [Q03 · 完成门禁能否独立证明人工批准、测试通过和 Git 干净？](#detail-section-13)
  - [Q04 · 规划期只读保护能否阻止所有源码写入？](#detail-section-14)
  - [Q05 · 使用前要检查哪些覆盖与恢复负担？](#detail-section-15)
  - [Q06 · 绑定独立验收和代码版本是否能提高门禁可信度？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：跨会话推进功能、缺陷或重构的 DSH 开发者可保存阶段产物与执行步骤，并在会话中查看当前任务。

用户可通过人工维护任务文档、聊天记录、Git 状态和独立验收完成相同工作；此插件集中状态与提示，未证明更省时。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 任务创建 | 保存任务和模板并绑定会话 | 多文件顺序写入，失败需检查残留 |
| 步骤更新 | 跟踪状态和验收字段 | 字段本身不证明独立批准或测试 |
| 阶段提示 | 将任务状态带入当前会话 | 依赖 allowlist、会话和钩子生效 |
| 规划期过滤 | 从工具列表移除指定写工具 | 可选且保留 shell 与其他插件工具 |
| Git 检查 | 检查工作区和声明文件 | 失败可能放行，不能等同已确认干净 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH 宿主服务 | 加载需要 | 文件系统、Agent、工具和会话接口 | 不能假定能加载 |
| 项目 allowlist | 流程生效需要 | 限定受影响的项目 | 未匹配则不注入和过滤 |
| Git 命令和仓库 | 有意义的 Git 核查需要 | 检查脏文件和近期提交 | 出错可能按 clean 返回，需独立核对 |
| 用户备份 | 存在同名定制时需要 | 恢复技能和模板 | 升级同步可能覆盖同名文件 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份同名技能并设置允许项目 | 确认宿主版本及备份可恢复 |
| 建立 | 用户授权创建任务并查看当前会话指针 | 任务文件与绑定一致 |
| 执行 | 用户审阅方案，Agent 更新步骤和产物 | 人工核查实际代码与结果 |
| 收尾 | 用户独立确认验收、Git 状态与提交 | 任何未知或不一致先停止并核查 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 本地存储和模型资源未知 | 配置、备份及检查技能覆盖，时间未知 | 需兼容宿主 |
| 持续 | 提示 token 与模型费用未知 | 编写产物并独立审核，时间未知 | 无同任务净收益对照 |
| 恢复 | 重试、备份和模型调用成本未知 | 核查部分文件、绑定及真实 Git | 创建不是整体文件事务 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 恢复上下文 | 任务文件与会话指针驱动提示 | 漏项率和恢复人时 |
| 步骤门禁 | 结构化字段在完成时检查 | 人工批准与测试是否真实发生 |
| 规划过滤 | 仅移除明确列出的工具 | 对其他可写工具的约束与实际防护 |

> **思考**：[Q03](#research-q03) 的人工验证为工具输入字段，Git 超时等情况会放行；[Q04](#research-q04) 仅过滤指定工具，保留 shell，因此这些约束不能代替独立审批或写权限控制。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示阶段文件、步骤及会话指针连接每轮提示，减少用户手工将状态重新放入会话的接线；这属于已有工作流的宿主适配。

[Q02](#research-q02) 将任务更新与会话重绑分离；[Q03](#research-q03) 将验证字段及 Git 结果暴露给调用者，但字段可信性和失败退化仍需外部控制。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的人工验证为工具输入字段，Git 超时等情况会放行；[Q04](#research-q04) 仅过滤指定工具，保留 shell，因此这些约束不能代替独立审批或写权限控制。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议在隔离项目备份同名技能后试用非关键任务；人工独立验证批准、Git 状态和业务结果，异常时停止流程并恢复备份。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持条件性的任务状态与工具过滤判断；人工批准来源、宿主运行和效果未由本次研究验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、lib/index.js、lib/task.js、lib/git.js、lib/readonly.js、lib/artifact.js、lib/skills.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查插件入口、任务创建与指针、步骤验证、Git 检查、只读过滤与技能同步；未全面审计界面、归档或所有内置技能，不执行目标代码。
- 下一步：隔离项目比较人工流程与插件，注入假批准、空步骤、Git 失败和同步中断，检查文件、会话绑定及独立验收记录。

**分析版本**

- **仓库**：[1264459640/dsh-trellis](https://github.com/1264459640/dsh-trellis)
- **版本号**：0.5.1（[固定提交 d30f232](https://github.com/1264459640/dsh-trellis/tree/d30f232e641977cd843ddad00412b4110f8f14f9)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提出将独立验收收据绑定任务与代码提交并保留 Git 未知状态；这是未验证假设，需与现有 CI 及人工记录对照。

隔离项目比较人工流程与插件，注入假批准、空步骤、Git 失败和同步中断，检查文件、会话绑定及独立验收记录。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 183 | 12106 | — | — | 196102 |
| .md | test | 2 | 521 | — | — | 10548 |
| .mjs | source | 5 | 907 | 737 | 117 | — |
| .js | source | 16 | 10164 | 7417 | 2253 | — |
| .js | test | 21 | 6730 | 5652 | 504 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/1264459640/dsh-trellis/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/1264459640/dsh-trellis/issues?q=is%3Aissue+created%3A2026-10-05T08%3A22%3A39.587Z..2026-11-04T08%3A22%3A39.587Z) [![近30天关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/1264459640/dsh-trellis/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T08%3A22%3A39.587Z..2026-11-04T08%3A22%3A39.587Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查任务状态、会话绑定、验收门禁和工具过滤是否支持有条件的开发流程。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁适合使用 Trellis 流程，它比手工任务清单增加了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要跨会话推进功能、缺陷或重构任务的 DSH 开发者，可以把阶段文档、步骤状态与当前会话指针一起保存。README 的长程任务问题和三条轨道是作者定位；package 的 bundle、Host 入口以及每轮钩子表明该插件将文件状态接入宿主，满足 allowlist 和其他条件时构造阶段提示。与聊天记录配手工清单相比，其具体增量是自动按会话读取并向模型注入当前任务；设计思想来自 Trellis，工作流概念不应归为插件首创。固定源码未证明该流程一定减少遗漏、时间或人工复核。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:20-35](https://github.com/1264459640/dsh-trellis/blob/d30f232e641977cd843ddad00412b4110f8f14f9/README.md#L20-L35)

作者描述对象和目标。

<details>
<summary>查看原文（16行）</summary>

```text
`dsh-trellis` 是为 [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) 开发的工程化工作流插件，借鉴了 [Trellis](https://github.com/mindfold-ai/trellis) 的阶段规范与状态机设计思想。

在大模型长程编程任务中，常见以下协作问题：
1. **未理清方案便直接修改代码**：容易引入方向性错误或破坏现有架构；
2. **任务待办散落各处**：需求文档、草稿文件与上下文记录多处待办，状态脱节；
3. **缺乏验收约束**：代码编写完成后直接标记完成，缺少自测验证或人工审核卡点。

`dsh-trellis` 通过统一的步骤状态机、任务阶段流转和运行时工具过滤，帮助大模型在复杂任务中遵循“先方案后编码、验证后再完结”的工程规范。

---

## 核心特性

- **结构化阶段流转**：提供特性开发（feat）、缺陷修复（issue）与代码重构（refactor）三条标准阶段轨道，引导模型逐步推进。
- **统一执行清单**：以任务根目录下的 `task.json.steps` 作为唯一的执行状态依据，避免分散维护清单带来的状态不一致。
- **质量验收门禁**：细化步骤流转状态（`pending`、`in_progress`、`verifying`、`blocked`、`completed`），支持区分自动化测试（AI 验证）与人工审批卡点，并在任务完结时严格检查验收状态。
```

</details>

**依据 2 · 源码核查**：[package.json:1-14](https://github.com/1264459640/dsh-trellis/blob/d30f232e641977cd843ddad00412b4110f8f14f9/package.json#L1-L14)

包入口和 bundle 注册。

<details>
<summary>查看原文（14行）</summary>

```text
{
  "name": "@banana-peeljj12/dsh-trellis",
  "version": "0.5.1",
  "description": "Self-contained Trellis workflow trigger for DeepSeek Harness: per-turn breadcrumb injection via agent/pre-step, a bundled skill provider, and DSH-native task/phase state resolution. No Trellis AGPL code is vendored; workflow semantics are rewritten and licensed MIT.",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "icon": "icon.svg",
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1343-1355](https://github.com/1264459640/dsh-trellis/blob/d30f232e641977cd843ddad00412b4110f8f14f9/lib/index.js#L1343-L1355)

每轮钩子匹配 allowlist 并处理跳过。

<details>
<summary>查看原文（13行）</summary>

```text
    ctx.on('agent/pre-step', async ({ agent, messages, step, signal }, next) => {
      const decision = await next()
      if (decision.kind === 'reject') return decision

      const cwd = normalizePath(agent && agent.session && agent.session.header ? agent.session.header.cwd : undefined)
      const root = matchAllowlist(cwd, effectiveConfig.get().allowlist)
      if (!root) return decision

      const effective = effectiveConfig.get()
      if (effective.injectStep !== undefined && step !== effective.injectStep) return decision

      const lastUser = extractMessageText(messages[messages.length - 1])
      if (shouldSkip(lastUser, effective.skipKeywords)) return decision
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1454-1479](https://github.com/1264459640/dsh-trellis/blob/d30f232e641977cd843ddad00412b4110f8f14f9/lib/index.js#L1454-L1479)

构造并去重注入阶段消息。

<details>
<summary>查看原文（26行）</summary>

```text
      const desired = buildBreadcrumbMessage(
        {
          sourceKind: SOURCE_KIND,
          text: st.text,
          source: st.source,
          projectRoot: root,
          activeTask: st.activeTask,
          phase: st.phase,
          stepInfo,
          stepPromptOverride,
          practicesPrompt,
        },
        createUserMessage,
      )

      // Dedupe: a breadcrumb (or any of this plugin's injected context) already
      // present this turn — skip rather than stack copies.
      if (decision.messages.some((message) => message.source && message.source.kind === SOURCE_KIND)) {
        return decision
      }

      const lastClaimedIndex = decision.messages.findLastIndex((message) => messages.includes(message))
      return {
        kind: 'enter',
        messages: decision.messages.toSpliced(lastClaimedIndex + 1, 0, desired),
      }
```

</details>

#### 缺口

- 没有同任务人工流程与实际用户对照
  **影响**：不能量化恢复效率和需求强度
  **进一步探讨**：使用同一批跨会话任务对比遗漏、耗时及复核量。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 任务与会话指针如何建立和更新，失败是否完整回滚？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

创建工具检查项目 allowlist、验证参数并按当前 session 调用 createTaskRecord；后者先拒绝已有 task.json，再依次写任务文件、产物模板、项目模板和会话指针。session ID 存在时仅写对应指针，没有 ID 才回退公共指针。更新工具验证参数后调用 updateTaskRecord，源码明确更新任务数据不重绑会话，避免旧更新把新绑定改回。多个文件是顺序写入，此路径未见整体回滚，因此后续写失败时先前文件可能保留；不应从单文件写入说明推断整个任务创建是原子事务。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:553-580](https://github.com/1264459640/dsh-trellis/blob/d30f232e641977cd843ddad00412b4110f8f14f9/lib/index.js#L553-L580)

匹配项目、校验参数和按 session 创建。

<details>
<summary>查看原文（28行）</summary>

```text
          args.cwd || (exec.agent && exec.agent.session && exec.agent.session.header.cwd),
        )
        const root = matchAllowlist(cwd, effectiveConfig.get().allowlist)
        if (!root) {
          return { ok: false, error: '项目不在 allowlist 内；请先在 Web 设置或配置里把项目根加入 trellis-workflow.allowlist', project: null, slug: null, taskDir: null, title: null, status: null, workType: null, stage: null, phase: null, sessionFiles: null, seeded: null, initialized: null }
        }

        const validated = validateCreateArgs(args)
        if (!validated.ok) {
          return { ok: false, error: validated.error, project: root, slug: null, taskDir: null, title: null, status: null, workType: null, stage: null, phase: null, sessionFiles: null, seeded: null, initialized: null }
        }

        // Per-call sandbox policy, like the harness editor tools (a sandboxing
        // fs needs the session policy so writes fence against the right root).
        const policy = ctx.fs.sandboxMode === void 0 ? void 0 : ctx.get('sandboxPolicy')
        if (ctx.fs.sandboxMode !== void 0 && policy === void 0) {
          throw new Error('trellis_task_create: the mounted filesystem confines but ctx.sandboxPolicy is missing')
        }
        const sandboxPolicy = policy
          ? policy.resolve({ ...(exec.agent === void 0 ? {} : { session: exec.agent.session }) })
          : void 0
        const sessionId =
          exec.agent && exec.agent.session && typeof exec.agent.session.id === 'string'
            ? exec.agent.session.id
            : void 0

        try {
          const result = await createTaskRecord(ctx.fs, root, validated.args, { signal: exec.signal, sessionId }, sandboxPolicy)
```

</details>

**依据 2 · 源码核查**：[lib/task.js:565-599](https://github.com/1264459640/dsh-trellis/blob/d30f232e641977cd843ddad00412b4110f8f14f9/lib/task.js#L565-L599)

检查已有任务并依次写任务及产物。

<details>
<summary>查看原文（35行）</summary>

```text
export async function createTaskRecord(dshFs, root, args, exec = {}, sandboxPolicy) {
  const { slug, title, workType, status, mode, stage } = args
  const p = { tasksDir: path.join(root, '.trellis', 'tasks') }
  const taskDir = path.join(p.tasksDir, slug)
  const taskDirRel = `.trellis/tasks/${slug}`
  const signal = exec.signal

  // Refuse to clobber an existing task.
  const taskJsonAbs = path.join(taskDir, 'task.json')
  const taskJsonTarget = await dshFs.resolve(taskJsonAbs)
  const existing = await dshFs.stat(taskJsonTarget)
  if (existing) {
    return { ok: false, error: `任务已存在：${taskDirRel}/ — 请用 trellis-continue 恢复，不要重建` }
  }

  const taskJson = buildTaskJson({
    title,
    workType,
    mode,
    status,
    stage,
    description: args.description,
    steps: args.steps,
  })

  // 1. task.json (writeText creates parent dirs atomically).
  await dshFs.writeText(taskJsonTarget, JSON.stringify(taskJson, null, 2), undefined, signal, sandboxPolicy)

  // 2. Seed bundled artifact templates into the task dir (skip present files).
  const seeded = []
  for (const name of artifactTemplateNames(workType)) {
    const target = await dshFs.resolve(path.join(taskDir, name))
    const info = await dshFs.stat(target)
    if (info) continue
    await dshFs.writeText(target, readBundledTemplate(workType, name), undefined, signal, sandboxPolicy)
```

</details>

**依据 3 · 源码核查**：[lib/task.js:603-635](https://github.com/1264459640/dsh-trellis/blob/d30f232e641977cd843ddad00412b4110f8f14f9/lib/task.js#L603-L635)

项目模板和 session 指针的后续写入。

<details>
<summary>查看原文（33行）</summary>

```text
  // 3. Project-level template init on first use (.trellis/templates/<type>/ + work-types.md).
  const initialized = []
  const tplTypeDir = path.join(root, '.trellis', 'templates', workType)
  for (const name of artifactTemplateNames(workType)) {
    const target = await dshFs.resolve(path.join(tplTypeDir, name))
    const info = await dshFs.stat(target)
    if (info) continue
    await dshFs.writeText(target, readBundledTemplate(workType, name), undefined, signal, sandboxPolicy)
    initialized.push(name)
  }
  const workTypesSrc = path.join(skillsRoot, '_templates', 'work-types.md')
  const workTypesTarget = await dshFs.resolve(path.join(root, '.trellis', 'templates', 'work-types.md'))
  if (fs.existsSync(workTypesSrc) && !(await dshFs.stat(workTypesTarget))) {
    await dshFs.writeText(workTypesTarget, fs.readFileSync(workTypesSrc, 'utf8'), undefined, signal, sandboxPolicy)
    initialized.push('work-types.md')
  }

  // 4. Runtime session pointer: write ONLY the creating session's own pointer file
  //    when a session id is known. Do NOT dual-write to CANONICAL_SESSION_FILE,
  //    so other sessions are never cross-pollinated or hijacked.
  const runtimeDir = path.join(root, '.trellis', '.runtime', 'sessions')
  const sessionFiles = []
  if (exec.sessionId) {
    const perSession = path.join(runtimeDir, `${sessionFileBasename(exec.sessionId)}.json`)
    await writePointerFile(dshFs, perSession, taskDirRel, { signal, sandboxPolicy })
    sessionFiles.push(`${sessionFileBasename(exec.sessionId)}.json`)
  } else {
    const canonical = path.join(runtimeDir, CANONICAL_SESSION_FILE)
    await writePointerFile(dshFs, canonical, taskDirRel, { signal, sandboxPolicy })
    sessionFiles.push(CANONICAL_SESSION_FILE)
  }

  return { ok: true, slug, taskDir: taskDirRel, taskJson, sessionFiles, seeded, initialized }
```

</details>

**依据 4 · 源码核查**：[lib/task.js:901-920](https://github.com/1264459640/dsh-trellis/blob/d30f232e641977cd843ddad00412b4110f8f14f9/lib/task.js#L901-L920)

完成检查后写任务且不更改绑定。

<details>
<summary>查看原文（20行）</summary>

```text
  // If updating to status='completed', enforce steps completion gate and git cleanliness check
  let gitCheck = null
  if (args.status === 'completed') {
    const gateCheck = checkStepsCompletion(taskJson.steps)
    if (!gateCheck.ok) {
      return { ok: false, error: gateCheck.error }
    }
    gitCheck = await checkGitCleanliness(root, { modifiedFiles: args.modified_files, action: 'complete' })
    if (!gitCheck.clean && gitCheck.error) {
      return { ok: false, error: gitCheck.error }
    }
  }

  // Write updated task.json
  await dshFs.writeText(taskJsonTarget, JSON.stringify(taskJson, null, 2), undefined, signal, sandboxPolicy)

  // Updating task data is not a binding operation. In particular, an old
  // in-flight update must not undo a newer create/bind/unbind in this session.
  // Keep the legacy result field, but only explicit binding paths write pointers.
  const boundSessionFile = null
```

</details>

#### 缺口

- 未注入写入中断或并发更新
  **影响**：不能保证部分材料恢复及多会话运行表现
  **进一步探讨**：隔离项目中分别在任务、模板和指针写入间注入失败并核对残留。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 完成门禁能否独立证明人工批准、测试通过和 Git 干净？

**研究主题**：缺陷与关键质疑、功能与机制、工程质量与复用

#### 完整回答

单步骤更新要求有验证类型的步骤先保存 verified，再另一次标记 completed；human 类型还要求 verifiedBy 为 human。但这些字段属于更新工具的输入，检查只比较字段值，并未在此代码路径核验独立审批者、原始测试日志或对应代码版本。工具还接受完整 steps 替换，替换后完成检查检查现有字段；空列表直接通过，显式 verification 也可改变验证模式。因此这是结构和流程约束，不能独立证明人已批准或测试真实执行。Git 检查发现脏文件时阻止；指定 modified_files 时忽略清单外脏文件并警告，验证清单文件出现在最近 30 次提交中，但这不绑定本任务的具体提交。Git 不可用、超时或异常时该实现返回 clean: true（部分情况含 warning），所以检查未知不能被解读为实际干净。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:710-743](https://github.com/1264459640/dsh-trellis/blob/d30f232e641977cd843ddad00412b4110f8f14f9/lib/index.js#L710-L743)

工具接受完整 steps 与逐项验证字段。

<details>
<summary>查看原文（34行）</summary>

```text
        steps: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              spec: { type: 'string' },
              acceptance: { type: 'array', items: { type: 'string' } },
              status: { type: 'string' },
              verification: { type: 'string' },
              verify: { type: 'boolean' },
              verified: { type: 'boolean' },
              verifiedBy: { type: 'string' },
              verificationNotes: { type: 'string' },
              blockedReason: { type: 'string' },
            },
          },
          description: 'Optional full replacement of the execution steps list.',
        },
        step: {
          type: 'object',
          additionalProperties: false,
          properties: {
            id: { type: 'string', description: 'Step id to update (required).' },
            status: { type: 'string', description: 'pending | in_progress | verifying | blocked | completed.' },
            verification: { type: 'string', description: 'none | ai | human.' },
            verified: { type: 'boolean', description: 'Mark the step verification as passed (true) when verify/verification is required.' },
            verifiedBy: { type: 'string', description: 'ai | human.' },
            verificationNotes: { type: 'string', description: 'Verification evidence (test cases / logs) or human review notes.' },
            blockedReason: { type: 'string', description: 'Reason if step is marked as blocked.' },
          },
          description: 'Optional incremental update to a single step. A step with verification/verify cannot reach completed until verified: true is recorded via a prior call.',
```

</details>

**依据 2 · 源码核查**：[lib/task.js:202-225](https://github.com/1264459640/dsh-trellis/blob/d30f232e641977cd843ddad00412b4110f8f14f9/lib/task.js#L202-L225)

验证类型与 human 字段判断。

<details>
<summary>查看原文（24行）</summary>

```text
  // Verification mode resolution: explicit `verification` wins over the legacy
  // `verify: true` alias (verify: true === verification: 'ai').
  const verification =
    update.verification !== undefined
      ? update.verification
      : current.verification !== undefined
        ? current.verification
        : current.verify === true
          ? 'ai'
          : 'none'

  if (update.verification !== undefined) {
    next.verification = update.verification
  }
  if (update.verified !== undefined) {
    if (update.verified === true && verification === 'human' && update.verifiedBy !== 'human') {
      return {
        ok: false,
        error: `[trellis/human_gate] 步骤 "${current.title}" (${current.id}) 声明了人工验收要求 (verification: human)，标记 verified: true 必须同时提供 verifiedBy: 'human'（用户在对话中的明确确认），禁止模型自证自签`,
      }
    }
    next.verified = update.verified === true
    if (update.verified === true) {
      next.verifiedBy = update.verifiedBy === 'human' ? 'human' : 'ai'
```

</details>

**依据 3 · 源码核查**：[lib/task.js:238-250](https://github.com/1264459640/dsh-trellis/blob/d30f232e641977cd843ddad00412b4110f8f14f9/lib/task.js#L238-L250)

已有验证状态后才允许单步骤完成。

<details>
<summary>查看原文（13行）</summary>

```text
  if (update.status !== undefined) {
    if (update.status === 'completed') {
      if (verification === 'ai' && current.verified !== true) {
        return {
          ok: false,
          error: `[trellis/verification_gate] 步骤 "${current.title}" (${current.id}) 声明了自动化验证要求 (verification: ai)，请先单独调用 trellis_task_update 记录 verified: true 后再标记 completed`,
        }
      }
      if (verification === 'human' && (current.verified !== true || current.verifiedBy !== 'human')) {
        return {
          ok: false,
          error: `[trellis/human_gate] 步骤 "${current.title}" (${current.id}) 声明了人工验收要求 (verification: human)，在用户明确确认并持久化 verified: true + verifiedBy: 'human' 前禁止标记为 completed`,
        }
```

</details>

**依据 4 · 源码核查**：[lib/task.js:272-299](https://github.com/1264459640/dsh-trellis/blob/d30f232e641977cd843ddad00412b4110f8f14f9/lib/task.js#L272-L299)

空列表、步骤和验证字段检查。

<details>
<summary>查看原文（28行）</summary>

```text
export function checkStepsCompletion(steps) {
  if (!Array.isArray(steps) || steps.length === 0) return { ok: true }
  const incomplete = []
  const unverified = []
  const blocked = []
  for (const st of steps) {
    if (st.status === 'blocked') {
      blocked.push(`${st.title || st.id}${st.blockedReason ? `（${st.blockedReason}）` : ''}`)
      continue
    }
    if (st.status !== 'completed') {
      incomplete.push(`${st.title || st.id} (${st.status || 'pending'})`)
    } else if (st.verify === true || st.verification === 'ai' || st.verification === 'human') {
      if (st.verified !== true) {
        unverified.push(`${st.title || st.id}`)
      } else if (st.verification === 'human' && st.verifiedBy !== 'human') {
        unverified.push(`${st.title || st.id}（人工验收未确认）`)
      }
    }
  }
  if (blocked.length > 0) {
    return { ok: false, error: `[trellis/steps_blocked] 以下步骤处于阻塞状态，禁止提前完结任务：${blocked.join('；')}` }
  }
  if (incomplete.length > 0) {
    return { ok: false, error: `[trellis/steps_incomplete] 仍有未完成的执行步骤：${incomplete.join('；')}，禁止提前完结任务` }
  }
  if (unverified.length > 0) {
    return { ok: false, error: `[trellis/steps_unverified] 以下步骤未通过质量验证：${unverified.join('；')}，禁止提前完结任务` }
```

</details>

**依据 5 · 源码核查**：[lib/task.js:887-910](https://github.com/1264459640/dsh-trellis/blob/d30f232e641977cd843ddad00412b4110f8f14f9/lib/task.js#L887-L910)

替换步骤后执行完成和 Git 检查。

<details>
<summary>查看原文（24行）</summary>

```text
  // Apply steps replacement if provided (batch init / reset)
  if (args.steps !== undefined) {
    taskJson.steps = args.steps
  }

  // Apply single step update if provided (incremental advance)
  if (args.step !== undefined) {
    const applyRes = applyStepUpdate(taskJson.steps, args.step)
    if (!applyRes.ok) {
      return { ok: false, error: applyRes.error }
    }
    taskJson.steps = applyRes.steps
  }

  // If updating to status='completed', enforce steps completion gate and git cleanliness check
  let gitCheck = null
  if (args.status === 'completed') {
    const gateCheck = checkStepsCompletion(taskJson.steps)
    if (!gateCheck.ok) {
      return { ok: false, error: gateCheck.error }
    }
    gitCheck = await checkGitCleanliness(root, { modifiedFiles: args.modified_files, action: 'complete' })
    if (!gitCheck.clean && gitCheck.error) {
      return { ok: false, error: gitCheck.error }
```

</details>

**依据 6 · 源码核查**：[lib/git.js:165-187](https://github.com/1264459640/dsh-trellis/blob/d30f232e641977cd843ddad00412b4110f8f14f9/lib/git.js#L165-L187)

Git 失败或超时退化返回。

<details>
<summary>查看原文（23行）</summary>

```text
    try {
      execFile(
        'git',
        ['-c', 'core.quotepath=false', 'status', '--porcelain', '-uall'],
        { cwd: root, timeout, windowsHide: true },
        async (err, stdout, stderr) => {
          if (err) {
            // If not a git repository or git not found, degrade gracefully
            const errStr = String((err && err.message) || '') + String(stderr || '')
            if (
              err.code === 'ENOENT' ||
              err.code === 'EPERM' ||
              errStr.includes('not a git repository') ||
              errStr.includes('fatal: not a git repository') ||
              err.code === 128
            ) {
              return resolve({ clean: true, isGitRepo: false, dirtyFiles: [], uncommittedFiles: [] })
            }
            // On timeout or unexpected error, resolve with error message but do not hard crash
            if (err.killed || err.signal === 'SIGTERM') {
              return resolve({ clean: true, isGitRepo: true, dirtyFiles: [], uncommittedFiles: [], warning: 'git status 检查超时，已跳过' })
            }
            return resolve({ clean: true, isGitRepo: false, dirtyFiles: [], uncommittedFiles: [], warning: `git status 失败: ${errStr}` })
```

</details>

**依据 7 · 源码核查**：[lib/git.js:194-214](https://github.com/1264459640/dsh-trellis/blob/d30f232e641977cd843ddad00412b4110f8f14f9/lib/git.js#L194-L214)

指定文件列表时的范围限制和警告。

<details>
<summary>查看原文（21行）</summary>

```text
          let warning
          if (declaredFiles && declaredFiles.length > 0) {
            // Scoped check: only dirty files matching declared modifiedFiles will block completion/archival
            const declaredSet = new Set(declaredFiles)
            const dirtyInDeclared = dirty.filter((e) => declaredSet.has(e.path))
            if (dirtyInDeclared.length > 0) {
              const dirtyFiles = dirtyInDeclared.map((e) => `${e.code} ${e.path}`)
              return resolve({
                clean: false,
                isGitRepo: true,
                dirtyFiles,
                uncommittedFiles: [],
                error:
                  `[trellis/git_declared_dirty] modified_files 中声明的文件本身存在未提交修改：\n` +
                  dirtyInDeclared.map((e) => `  - ${e.code} ${e.path}`).join('\n') +
                  `\n\n请先 git add / git commit 提交上述声明文件，再${actionPhrase}。` +
                  `（清单内文件必须已提交；与任务无关的改动无需列入，也不会阻塞。）`,
              })
            }
            if (dirty.length > 0) {
              warning = `工作区存在 ${dirty.length} 个未包含在 modified_files 中的未提交修改，已基于声明列表放行。`
```

</details>

**依据 8 · 源码核查**：[lib/git.js:231-251](https://github.com/1264459640/dsh-trellis/blob/d30f232e641977cd843ddad00412b4110f8f14f9/lib/git.js#L231-L251)

最近提交文件检查。

<details>
<summary>查看原文（21行）</summary>

```text
          // 2. If modifiedFiles was provided and non-empty, verify they were actually committed in git history
          if (declaredFiles && declaredFiles.length > 0) {
            const { isGitRepo, committedFiles } = await fetchRecentCommittedFiles(root, 30, timeout)
            if (isGitRepo) {
              const missingInCommits = declaredFiles.filter((f) => !committedFiles.has(f))
              if (missingInCommits.length > 0) {
                return resolve({
                  clean: false,
                  isGitRepo: true,
                  dirtyFiles: [],
                  uncommittedFiles: missingInCommits,
                  error:
                    `[trellis/git_uncommitted] 声明的修改文件在最近的 Git 提交记录中未找到修改或提交记录：\n` +
                    missingInCommits.map((f) => `  - ${f}`).join('\n') +
                    `\n\n请确认这些文件是否已真正保存并执行 git commit 提交。`,
                })
              }
            }
          }

          return resolve({ clean: true, isGitRepo: true, dirtyFiles: [], uncommittedFiles: [], ...(warning ? { warning } : {}) })
```

</details>

#### 缺口

- 未执行伪造输入、Git 失效和并发案例
  **影响**：不能断言宿主实际执行表现或故障频率
  **进一步探讨**：隔离项目以假批准、空列表、Git 超时和不相关提交构造对照。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 规划期只读保护能否阻止所有源码写入？

**研究主题**：功能与机制、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

保护只在配置启用且当前项目命中 allowlist 时参与 system-prompt/assemble；代码按状态从模型看到的工具列表移除指定名称，而不是拦截所有文件写操作。undecided 和 planning 都移除 write 与 edit，但 bash、pwsh 及其他插件工具未列入该 denylist；未知阶段也映射为 authorized。task artifact 路径另经过白名单和文件系统策略，但它不改变其他工具的权限。因此这是一条流程提示和工具可见性约束，不是权限沙箱；对写入权限有硬要求时还需要宿主或操作系统的独立执行策略。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1298-1319](https://github.com/1264459640/dsh-trellis/blob/d30f232e641977cd843ddad00412b4110f8f14f9/lib/index.js#L1298-L1319)

allowlist、配置开关和装配时过滤接线。

<details>
<summary>查看原文（22行）</summary>

```text
    ctx.on('system-prompt/assemble', async (assembly, context, next) => {
      const assembled = await next()
      const effective = effectiveConfig.get()

      // AssembleContext carries no `agent` (0.1.7): the assembling agent is the
      // process-local initiator, so resolve the session cwd from it.
      const agent = (ctx.agents && typeof ctx.agents.currentInitiator === 'function' && ctx.agents.currentInitiator()) || undefined
      const cwd = normalizePath(agent && agent.session && agent.session.header ? agent.session.header.cwd : undefined)
      const root = matchAllowlist(cwd, effective.allowlist)
      if (!root) return assembled

      const sessionId = agent && agent.session && typeof agent.session.id === 'string' ? agent.session.id : undefined

      let tools = null
      let sections = null

      if (effective.enforceReadonlyPlanning) {
        const st = await resolveProjectState(ctx.fs, root, effective.inline === true, sessionId)
        tools = applyReadonlyPolicy(assembled.tools, st.phase, st.skipState)
        sections = appendReadonlyInstruction(
          applyReadonlySections(assembled.sections, st.phase, st.skipState) ?? assembled.sections,
          st.phase,
```

</details>

**依据 2 · 源码核查**：[lib/readonly.js:28-60](https://github.com/1264459640/dsh-trellis/blob/d30f232e641977cd843ddad00412b4110f8f14f9/lib/readonly.js#L28-L60)

保留 shell 和指定移除集合。

<details>
<summary>查看原文（33行）</summary>

```text
/** Read/analysis + shell tools shared by every read-only level (informational). */
export const READ_TOOLS = ['read', 'glob', 'grep', 'read_image', 'inspect_image', 'pwsh', 'bash']

/**
 * Tools trimmed in the `undecided` state (no task yet, not skipped):
 * generic code write tools plus trellis task tools that require an existing
 * task / bind a task. Everything else — read tools, other plugins' tools,
 * trellis_state / trellis_task_create / trellis_task_skip — stays available.
 */
export const UNDECIDED_TRIM = new Set([
  'write',
  'edit',
  'trellis_task_update',
  'trellis_artifact_update',
  'trellis_task_archive',
  'trellis_ui_update',
])

/**
 * Tools trimmed in the `planning` state (task exists, plan not yet approved):
 * generic code write tools plus trellis lifecycle tools invalid while a task
 * is being planned (create would rebind, skip is only valid without a task).
 * Everything else — read tools, other plugins' tools, trellis_state /
 * trellis_task_update / trellis_artifact_update — stays available.
 */
export const PLANNING_TRIM = new Set([
  'write',
  'edit',
  'trellis_task_create',
  'trellis_task_skip',
  'trellis_task_archive',
  'trellis_ui_update',
])
```

</details>

**依据 3 · 源码核查**：[lib/readonly.js:79-113](https://github.com/1264459640/dsh-trellis/blob/d30f232e641977cd843ddad00412b4110f8f14f9/lib/readonly.js#L79-L113)

未知阶段及 denylist 过滤逻辑。

<details>
<summary>查看原文（35行）</summary>

```text
export function authorizationOf(phase, skipState = false) {
  if (phase === 'planning' || phase === 'planning-inline') return 'planning'
  if (phase === 'no_task') return skipState === true ? 'authorized' : 'undecided'
  // in_progress / completed / unknown → full write access.
  return 'authorized'
}

/**
 * The tools to TRIM (remove) for an authorization state, or null when the
 * state is freely writable (no pruning). Denylist semantics: only these named
 * tools are removed; every other tool (including other plugins') is kept.
 * @param {string} authorization one of AUTHORIZATIONS.
 * @returns {Set<string> | null}
 */
export function trimToolsFor(authorization) {
  if (authorization === 'undecided') return UNDECIDED_TRIM
  if (authorization === 'planning') return PLANNING_TRIM
  return null
}

/**
 * Apply the read-only tool filter to an assembled tool list.
 * @param {Array<{ name?: string } | null | undefined> | null | undefined} tools
 *   the assembled tool surface (items carry a `.name`).
 * @param {string | null | undefined} phase resolved Trellis phase.
 * @param {boolean} [skipState] session skip flag.
 * @returns {Array | null} the pruned tool list, or null when no pruning applies
 *   (caller keeps the original list untouched).
 */
export function applyReadonlyPolicy(tools, phase, skipState = false) {
  if (!Array.isArray(tools)) return null
  const authorization = authorizationOf(phase, skipState)
  const trimmed = trimToolsFor(authorization)
  if (!trimmed) return null
  return tools.filter((t) => t && typeof t.name === 'string' && !trimmed.has(t.name))
```

</details>

**依据 4 · 源码核查**：[lib/artifact.js:121-136](https://github.com/1264459640/dsh-trellis/blob/d30f232e641977cd843ddad00412b4110f8f14f9/lib/artifact.js#L121-L136)

限定任务产物路径并经文件系统策略写入。

<details>
<summary>查看原文（16行）</summary>

```text
  let targetPath
  try {
    targetPath = assertSafeArtifactPath(root, slug, args.artifact)
  } catch (err) {
    return { ok: false, error: err.message }
  }

  const taskJsonPath = path.join(root, '.trellis', 'tasks', slug, 'task.json')
  const taskJsonTarget = await dshFs.resolve(taskJsonPath)
  const stat = await dshFs.stat(taskJsonTarget)
  if (!stat) {
    return { ok: false, error: `任务目录不存在：.trellis/tasks/${slug}/` }
  }

  const resolvedTarget = await dshFs.resolve(targetPath)
  await dshFs.writeText(resolvedTarget, content, undefined, exec.signal, sandboxPolicy)
```

</details>

#### 缺口

- 未在目标宿主实际运行过滤和其他工具
  **影响**：无法确认某部署的最终工具集及权限
  **进一步探讨**：隔离宿主观察实际组装清单，并通过安全测试文件检验独立策略。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 使用前要检查哪些覆盖与恢复负担？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

包声明 DSH 的多个 peer 服务及 Web 客户端；README 要求重启、配置允许项目，并将只读过滤设为可选。每轮匹配项目时插件会调用 ensureProjectSkills；版本标记不同、缺失或强制时逐文件覆盖官方同名技能和共享模板，并在最后写版本标记；版本相同时已存在技能会跳过。若用户修改了这些同名文件，先备份并比较内容；逐文件写入失败可能留下部分同步结果，标记写入也可能失败仅警告。持续使用还须人工核对实际代码、验收和 Git 状态。费用、时间和净收益没有实测；若配置被覆盖、任务与当前会话绑定不符、验证无独立凭据或 Git 返回警告，应停止依赖该流程完成任务，人工核对并恢复备份。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-24](https://github.com/1264459640/dsh-trellis/blob/d30f232e641977cd843ddad00412b4110f8f14f9/package.json#L1-L24)

入口、bundle 和客户端依赖。

<details>
<summary>查看原文（24行）</summary>

```text
{
  "name": "@banana-peeljj12/dsh-trellis",
  "version": "0.5.1",
  "description": "Self-contained Trellis workflow trigger for DeepSeek Harness: per-turn breadcrumb injection via agent/pre-step, a bundled skill provider, and DSH-native task/phase state resolution. No Trellis AGPL code is vendored; workflow semantics are rewritten and licensed MIT.",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "icon": "icon.svg",
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-api-remotes",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-ui-plugin-manager",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-sidebar-right",
        "@deepseek-ai/dsh-client-ui-workspace"
      ],
      "platform": "web"
    }
```

</details>

**依据 2 · 源码核查**：[package.json:53-74](https://github.com/1264459640/dsh-trellis/blob/d30f232e641977cd843ddad00412b4110f8f14f9/package.json#L53-L74)

宿主 peer 范围。

<details>
<summary>查看原文（22行）</summary>

```text
  "license": "MIT",
  "publishConfig": {
    "access": "public"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/1264459640/dsh-trellis.git"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.4",
    "@deepseek-ai/dsh-agent": "^0.2.0-rc.2",
    "@deepseek-ai/dsh-fs": "^0.2.0-rc.2",
    "@deepseek-ai/dsh-llm": "^0.2.0-rc.2",
    "@deepseek-ai/dsh-session": "^0.2.0-rc.2",
    "@deepseek-ai/dsh-settings": "^0.2.0-rc.2",
    "@deepseek-ai/dsh-tools": "^0.2.0-rc.2",
    "@deepseek-ai/schemastery": "^3.18.4"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-agent": "0.2.0-rc.2",
    "@deepseek-ai/dsh-fs": "0.2.0-rc.2",
```

</details>

**依据 3 · 作者声明**：[README.md:61-101](https://github.com/1264459640/dsh-trellis/blob/d30f232e641977cd843ddad00412b4110f8f14f9/README.md#L61-L101)

安装、重启、允许项目和可选只读说明。

<details>
<summary>查看原文（41行）</summary>

````text
> ```
>
> 装的若是本地开发目录，用 `link:<仓库绝对路径>`；装完成后**完整退出并重启桌面版**
> （含托盘图标，确认任务管理器中不再有 `DeepSeek Harness.exe`）才会生效。

> **版本兼容性**：插件声明的 `@deepseek-ai/dsh-*` peer 范围必须覆盖当前 DSH 运行时版本。
> DSH 会在安装前置检查（pnpm 运行之前）与 profile 启动时校验该范围，不匹配会直接
> `installation rejected` 并拒绝加载——这不是代码问题，而是声明问题：
> 例如运行时为 `0.2.0-rc.2` 时，`^0.1.7-rc.1`（= `>=0.1.7-rc.1 <0.2.0-0`）不覆盖它，
> 必须提升到 `^0.2.0-rc.2`。升级 DSH 后若插件突然失效，请先核对 peer 范围。
> 本仓库当前面向 **DSH 0.2.0-rc.2**；审计证据见
> [`docs/ref/dsh-0.2.0-rc.2-audit.md`](docs/ref/dsh-0.2.0-rc.2-audit.md)。

### 2. 配置白名单目录（重要）

为避免非预期介入，插件默认不会拦截未授权的目录。请在 Web 端或配置文件中添加生效路径：

1. 打开 DSH Web 客户端，点击左侧边栏的 **「插件」** 图标，在 **「已安装」** 分区点击 **@banana-peeljj12/dsh-trellis** 进入详情页（配置表单直接位于详情页最外层，无需再展开「包含的组件」）；
2. 在 **白名单项目 (allowlist)** 中添加需要启用该工作流的项目根目录绝对路径——既可手动输入，
   也可点击 **浏览…** 按钮弹出系统文件夹选择器直接选取，保存后即时生效。

> **提示**：若希望在方案定稿前限制模型修改源码，可在该详情页同时开启 **规划期只读保护 (enforceReadonlyPlanning)** 开关。

### 3. 开始使用

在对话中提出较复杂的需求时，模型会引导创建或推进工作流任务：

- **新增功能**：创建 `feat-mm-dd-name`，推进 `prd` → `design` → `impl` → `review` → `check`；
- **修复问题**：创建 `issue-mm-dd-name`，推进 `report` → `analyze` → `fix` → `fix-note`；
- **重构优化**：创建 `refactor-mm-dd-name`，推进 `scan` → `design` → `apply` → `done`。

如需在某轮对话中临时跳过工作流拦截，在消息中包含 `no-trellis` 即可。

---

## 工作流与轨道规范

插件内置了三类标准工作流轨道，任务状态与当前所处阶段（`work.stage`）紧密挂钩：

| 工作流类型 | 命名规范 | 阶段推进顺序 | 说明 |
|---|---|---|---|
````

</details>

**依据 4 · 源码核查**：[lib/index.js:1361-1386](https://github.com/1264459640/dsh-trellis/blob/d30f232e641977cd843ddad00412b4110f8f14f9/lib/index.js#L1361-L1386)

匹配项目时技能同步，失败警告。

<details>
<summary>查看原文（26行）</summary>

```text
      // --- skill provisioning (session-start, once per project root) --------
      // Detect whether the project's .agents/skills carries the trellis skills;
      // copy the missing ones from the package when absent, skip when present.
      // Never throws into the turn: a provisioning failure only warns and the
      // breadcrumb still injects (skills remain copyable on a later turn).
      let provisionedNote = ''
      try {
        const policy = ctx.fs.sandboxMode === void 0 ? void 0 : ctx.get('sandboxPolicy')
        const sandboxPolicy = policy
          ? policy.resolve({ ...(agent === void 0 ? {} : { session: agent.session }) })
          : void 0
        const provisioned = await ensureProjectSkills(ctx.fs, root, {
          signal: signal ?? undefined,
          sandboxPolicy,
        })
        if (provisioned.updated && provisioned.updated.length > 0) {
          provisionedNote =
            `\n\n（已自动将 trellis-* 技能同步更新至 v${provisioned.version}：` +
            `${provisioned.updated.join(', ')}；harness 将从项目目录加载，无需重启）`
        } else if (provisioned.copied.length > 0) {
          provisionedNote =
            `\n\n（已把 trellis-* 技能复制到项目 .agents/skills/：` +
            `${provisioned.copied.join(', ')}；harness 将从项目目录加载，无需重启）`
        }
      } catch (error) {
        console.warn(`[${NAME}] skill provisioning failed for ${root}:`, error && error.message)
```

</details>

**依据 5 · 源码核查**：[lib/skills.js:155-194](https://github.com/1264459640/dsh-trellis/blob/d30f232e641977cd843ddad00412b4110f8f14f9/lib/skills.js#L155-L194)

版本比较与逐文件覆盖。

<details>
<summary>查看原文（40行）</summary>

```text
  // Check version record in project
  let installedVersion = null
  try {
    const versionTarget = await dshFs.resolve(path.join(targetRoot, VERSION_FILE_NAME))
    const info = await dshFs.stat(versionTarget)
    if (info) {
      const raw = await dshFs.readText(versionTarget, signal)
      if (typeof raw === 'string') installedVersion = raw.trim()
    }
  } catch {
    /* absent or unreadable */
  }

  const isUpgrade = force || (installedVersion !== PACKAGE_VERSION)

  // One listing decides presence; absent dir → empty (nothing present yet).
  let existing = new Set()
  try {
    const dirTarget = await dshFs.resolve(targetRoot)
    const entries = await dshFs.listDir(dirTarget)
    existing = new Set(entries.map((entry) => entry.name))
  } catch {
    /* .agents/skills absent — treat as empty */
  }

  // 1. Skill directories
  for (const id of SKILL_DIRS) {
    const srcDir = path.join(skillsRoot, id)
    if (!fs.existsSync(srcDir)) continue
    const alreadyExists = existing.has(id)

    if (alreadyExists && !isUpgrade) {
      present.push(id)
      continue
    }

    for (const rel of collectFiles(srcDir)) {
      const t = await dshFs.resolve(path.join(targetRoot, id, rel))
      const content = fs.readFileSync(path.join(srcDir, rel), 'utf8')
      await dshFs.writeText(t, content, undefined, signal, sandboxPolicy)
```

</details>

**依据 6 · 源码核查**：[lib/skills.js:204-224](https://github.com/1264459640/dsh-trellis/blob/d30f232e641977cd843ddad00412b4110f8f14f9/lib/skills.js#L204-L224)

模板及版本标记写入。

<details>
<summary>查看原文（21行）</summary>

```text
  // 2. Shared artifact templates (`_templates/`), copied file-by-file.
  const tplSrc = path.join(skillsRoot, '_templates')
  if (fs.existsSync(tplSrc)) {
    for (const rel of collectFiles(tplSrc)) {
      const t = await dshFs.resolve(path.join(targetRoot, '_templates', rel))
      if (!isUpgrade) {
        const info = await dshFs.stat(t)
        if (info) continue
      }
      const content = fs.readFileSync(path.join(tplSrc, rel), 'utf8')
      await dshFs.writeText(t, content, undefined, signal, sandboxPolicy)
    }
  }

  // 3. Write/update .trellis-version marker if anything was provisioned or version changed
  if (copied.length > 0 || updated.length > 0 || isUpgrade) {
    try {
      const versionTarget = await dshFs.resolve(path.join(targetRoot, VERSION_FILE_NAME))
      await dshFs.writeText(versionTarget, PACKAGE_VERSION, undefined, signal, sandboxPolicy)
    } catch (err) {
      console.warn(`[${'trellis'}] failed to write .trellis-version:`, err && err.message)
```

</details>

#### 缺口

- 安装、升级、跨平台兼容和恢复耗时没有本次实测
  **影响**：无法计算合格任务成本或确认所有宿主兼容
  **进一步探讨**：备份隔离项目，核对同名文件更新和部分写失败后的恢复成本。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 绑定独立验收和代码版本是否能提高门禁可信度？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

可提出未验证假设：将验证收据关联任务、验收标准及具体代码提交，人工批准通过独立可信入口产生；Git 状态分为干净、脏和未知，未知时要求人工处理。相对当前由工具字段表达验证状态，这可能使结论可追溯，但需要身份、撤销、重新验证和存储机制；也应比较人工记录批准、明确 Git 检查和项目现有 CI 是否已足够。用同一批假批准、代码修改后旧收据、Git 超时及真实验收任务比较误放行与额外人时；若简单人工记录达到同样效果或维护负担过高，就不引入复杂凭据系统。当前没有原型或结果，不能记为现有功能。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:731-743](https://github.com/1264459640/dsh-trellis/blob/d30f232e641977cd843ddad00412b4110f8f14f9/lib/index.js#L731-L743)

工具输入承载验证字段。

<details>
<summary>查看原文（13行）</summary>

```text
        step: {
          type: 'object',
          additionalProperties: false,
          properties: {
            id: { type: 'string', description: 'Step id to update (required).' },
            status: { type: 'string', description: 'pending | in_progress | verifying | blocked | completed.' },
            verification: { type: 'string', description: 'none | ai | human.' },
            verified: { type: 'boolean', description: 'Mark the step verification as passed (true) when verify/verification is required.' },
            verifiedBy: { type: 'string', description: 'ai | human.' },
            verificationNotes: { type: 'string', description: 'Verification evidence (test cases / logs) or human review notes.' },
            blockedReason: { type: 'string', description: 'Reason if step is marked as blocked.' },
          },
          description: 'Optional incremental update to a single step. A step with verification/verify cannot reach completed until verified: true is recorded via a prior call.',
```

</details>

**依据 2 · 源码核查**：[lib/task.js:213-250](https://github.com/1264459640/dsh-trellis/blob/d30f232e641977cd843ddad00412b4110f8f14f9/lib/task.js#L213-L250)

以字段判断验证和完成。

<details>
<summary>查看原文（38行）</summary>

```text
  if (update.verification !== undefined) {
    next.verification = update.verification
  }
  if (update.verified !== undefined) {
    if (update.verified === true && verification === 'human' && update.verifiedBy !== 'human') {
      return {
        ok: false,
        error: `[trellis/human_gate] 步骤 "${current.title}" (${current.id}) 声明了人工验收要求 (verification: human)，标记 verified: true 必须同时提供 verifiedBy: 'human'（用户在对话中的明确确认），禁止模型自证自签`,
      }
    }
    next.verified = update.verified === true
    if (update.verified === true) {
      next.verifiedBy = update.verifiedBy === 'human' ? 'human' : 'ai'
    }
  }
  if (update.verifiedBy !== undefined) {
    next.verifiedBy = update.verifiedBy
  }
  if (update.verificationNotes !== undefined) {
    next.verificationNotes = update.verificationNotes
  }
  if (update.blockedReason !== undefined) {
    next.blockedReason = update.blockedReason
  }

  if (update.status !== undefined) {
    if (update.status === 'completed') {
      if (verification === 'ai' && current.verified !== true) {
        return {
          ok: false,
          error: `[trellis/verification_gate] 步骤 "${current.title}" (${current.id}) 声明了自动化验证要求 (verification: ai)，请先单独调用 trellis_task_update 记录 verified: true 后再标记 completed`,
        }
      }
      if (verification === 'human' && (current.verified !== true || current.verifiedBy !== 'human')) {
        return {
          ok: false,
          error: `[trellis/human_gate] 步骤 "${current.title}" (${current.id}) 声明了人工验收要求 (verification: human)，在用户明确确认并持久化 verified: true + verifiedBy: 'human' 前禁止标记为 completed`,
        }
```

</details>

**依据 3 · 源码核查**：[lib/git.js:171-187](https://github.com/1264459640/dsh-trellis/blob/d30f232e641977cd843ddad00412b4110f8f14f9/lib/git.js#L171-L187)

Git 失败可能降级为 clean。

<details>
<summary>查看原文（17行）</summary>

```text
          if (err) {
            // If not a git repository or git not found, degrade gracefully
            const errStr = String((err && err.message) || '') + String(stderr || '')
            if (
              err.code === 'ENOENT' ||
              err.code === 'EPERM' ||
              errStr.includes('not a git repository') ||
              errStr.includes('fatal: not a git repository') ||
              err.code === 128
            ) {
              return resolve({ clean: true, isGitRepo: false, dirtyFiles: [], uncommittedFiles: [] })
            }
            // On timeout or unexpected error, resolve with error message but do not hard crash
            if (err.killed || err.signal === 'SIGTERM') {
              return resolve({ clean: true, isGitRepo: true, dirtyFiles: [], uncommittedFiles: [], warning: 'git status 检查超时，已跳过' })
            }
            return resolve({ clean: true, isGitRepo: false, dirtyFiles: [], uncommittedFiles: [], warning: `git status 失败: ${errStr}` })
```

</details>

#### 缺口

- 没有可信审批来源的原型或对照试验
  **影响**：无法证明误放行减少或收益覆盖成本
  **进一步探讨**：比较独立收据、人工批准记录与现有 CI 的同条件故障矩阵。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
