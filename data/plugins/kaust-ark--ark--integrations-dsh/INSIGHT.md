# Idea2Paper for DSH

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[925e1b0](https://github.com/kaust-ark/ARK/tree/925e1b0798fb2e37ff04d26ab9ddb455cf2dda18/integrations/dsh)

<!-- BEGIN META -->
[![GitHub ★ 38](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=38&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/kaust-ark/ARK)
<!-- END META -->

> **功能**：在 DSH 中持续运行研究项目、计算实验、编写论文，并以独立评审和版本检查约束交付。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 支持把持久会话、封存实验与同版本独立评审串成可恢复项目；[Q03](#research-q03) 展示deliver确实重新检查文件和回执。贡献在交付责任和证据生命周期的组合，不是科学推理正确性保证。

> **主要限制**：[Q03](#research-q03) 显示最重要的两种边界：结构化评审仍可能误读科学证据；项目stopped也不证明所有Slurm操作已终止。采用必须把论文有效性与外部副作用逐项核对，不能只看成功状态。

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
  - [Q01 · 相对临时聊天与脚本，项目所有者和研究交付单位改变了什么？](#detail-section-11)
  - [Q02 · 命令、会话、模型与项目工具怎样接成可恢复执行？](#detail-section-12)
  - [Q03 · 实验副作用、停止与独立评审是否约束最终交付？](#detail-section-13)
  - [Q04 · 固定宿主版本、Python、模型与项目维护需要什么投入？](#detail-section-14)
  - [Q05 · 可追溯实验状态能否形成更可靠的提交前证据闸门？](#detail-section-15)
  - [Q06 · 哪些研究任务适合隔离试用，什么时候应停用？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向已有 Linux 与 DSH 环境的研究开发者，以同一持久项目串联实验、论文编写和独立评审，交付时保留结果与稿件版本的对应关系。

比较基线是临时聊天加研究者手工脚本、论文编译与审阅；仅比较机制，不宣称实验效果排名。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| run/resume | 建立与继续同一研究项目 | 原DSH版本、模型、会话与项目锁 |
| status | 查询持久状态与证据路径 | 不等于原始结果已科学验证 |
| stop | 记录停止意图并取消跟踪实验 | stopped不保证Slurm未决操作已终止 |
| 计划与实验 | 封存脚本/计划后运行受限worker | Docker或配置后端，结果由收据核对 |
| 项目文件编辑与编译 | 写稿、生成当前PDF并校验 | TeX环境及项目操作边界 |
| 独立评审 | 冻结证据后由隔离子会话检查 | 模型仍可能误读，不代替科学审阅 |
| deliver | 校验当前稿/结果/review并记录交付 | 任一blocker或陈旧材料拒绝 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 指定DSH版本与原profile/model | 必需 | 挂载和持久会话恢复 | 版本或模型不符拒绝恢复 |
| Linux、flock、Node对应版本 | 本研究使用条件 | 项目锁与宿主执行 | 其他平台兼容未知 |
| Python≥3.10、venv/pip | 必需 | 启动同版本领域wheel | bootstrap失败不发布ready缓存 |
| Docker与实验镜像 | 默认本地实验需要 | 受限worker运行 | 无法提交本地计算 |
| TeX Live、BibTeX | 论文交付需要 | 编译当前PDF | 无有效编译不交付 |
| 模型账号、必要时图像能力 | 模型流程需要 | owner/reviewer及视觉检查 | 无法完成相应检查 |
| Slurm/Apptainer、Gemini服务 | 特定操作才需要 | 集群实验或深度研究/配图 | 本地小计算试用可先不用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 研究者建专用profile、配置原模型与预算 | 支持运行时、Python/TeX/Docker可定位 |
| 建项目 | CLI run创建目录和owner检查点 | 持久会话、锁与领域helper一致 |
| 实验 | owner声明计划，worker封存脚本执行 | 完成收据与测量摘要一致 |
| 评审 | 独立子会话读冻结证据并给判定 | 当前revision与必要检查完整 |
| 交付 | domain重新检查PDF、测量和review | delivered=true且无blockers |
| 停止恢复 | 持久化意图、核对每个后端再resume | 原模型/会话保留，未决任务不冒充终止 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | wheel依赖、镜像与TeX磁盘/下载，金额未知 | 建专用profile、配置模型和原环境 | 尚无本轮安装耗时 |
| 持续使用 | owner、reviewer模型调用和实验计算 | 读实验/论文、处理未签署评审 | 默认owner时限不等于费用上限 |
| 失败恢复 | 可能仍占用的容器/Slurm任务、重编译 | 保留项目与原DSH home，核对收据后恢复 | stopped不保证后端终止 |
| 退出 | 需要保留论文、原始结果和审计记录的存储 | 停实验、核对后端后卸bundle | 卸载不代替停止未确认作业 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 连续研究 | 同owner会话与固定模型检查点 | 长任务最终合格率 |
| 结果可追溯 | 脚本计划封存、测量摘要与当前稿门槛 | 科学推论是否正确 |
| 独立评审 | 非seeded子会话与证据回执校验 | 模型判断的独立错误率 |
| 停止恢复 | Docker身份核对与取消记录 | Slurm未决状态终止时间与实效 |

> **思考**：[Q03](#research-q03) 显示最重要的两种边界：结构化评审仍可能误读科学证据；项目stopped也不证明所有Slurm操作已终止。采用必须把论文有效性与外部副作用逐项核对，不能只看成功状态。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 支持把持久会话、封存实验与同版本独立评审串成可恢复项目；[Q03](#research-q03) 展示deliver确实重新检查文件和回执。贡献在交付责任和证据生命周期的组合，不是科学推理正确性保证。

[Q02](#research-q02) 的固定运行时会话、封存脚本与打包wheel摘要，以及[Q03](#research-q03) 的revision绑定评审值得研究工作流借鉴。移植需承担RPC、依赖缓存、后端状态对账与评审规则维护，不能把项目状态视为外部副作用证明。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 显示最重要的两种边界：结构化评审仍可能误读科学证据；项目stopped也不证明所有Slurm操作已终止。采用必须把论文有效性与外部副作用逐项核对，不能只看成功状态。

<a id="detail-section-6"></a>

### 1.5 使用建议

先在专用Linux/DSH profile中用本地Docker核对一个结果可人工复算的小任务，不立即接集群或昂贵外部服务。检查改稿后旧评审失效、原会话恢复与停止后容器实际状态；若证据不能解释结论或后端仍未决，就停止自动执行并保留材料退回手工实验审阅。依据见 [Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

当前挂载、持久恢复、实验封存和版本交付门槛有源码支持；真实研究质量、成本和新增终止证明设计未验证。

- 已检查：作者 README、包清单、源码路径 integrations/dsh/README.md、integrations/dsh/package.json、integrations/dsh/cordis.patch.yml、integrations/dsh/index.js、integrations/dsh/project.js、integrations/dsh/workflow.js、integrations/dsh/domain_bootstrap.py、integrations/dsh/pack.py、ark/orchestrator/native_domain.py、ark/compute/native_experiment.py、ark/review.py 及固定范围 inventory；组件：integrations/dsh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：统计范围仅integrations/dsh；为核实直接打包依赖，定向读取同固定提交ark/orchestrator/native_domain.py、ark/compute/native_experiment.py和ark/review.py，不把ARK全仓规模算作组件规模。
- 下一步：已检查源码；未执行目标插件、测试、wheel构建、Docker实验、模型调用或宿主验收。作者演示/验收陈述未转成独立复现证据。

**分析版本**

- **仓库**：[kaust-ark/ARK](https://github.com/kaust-ark/ARK)
- **版本号**：0.2.0-alpha.29（[固定提交 925e1b0](https://github.com/kaust-ark/ARK/tree/925e1b0798fb2e37ff04d26ab9ddb455cf2dda18)）
- **版本日期**：2026-11-20（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出尚未验证的终止证明设计：将项目已停与每项后端已确认终止分别展示，避免把 Slurm 的 cancelling 或 submission_unknown 状态误当作资源已释放。先用提交回执丢失、取消仍活跃和查询失败做对照；若不能减少误报或明显增加无收益负担，就应停止该方向。

已检查源码；未执行目标插件、测试、wheel构建、Docker实验、模型调用或宿主验收。作者演示/验收陈述未转成独立复现证据。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 4 | 1751 | 1662 | 18 | — |
| .js | test | 1 | 831 | 798 | 8 | — |
| .md | source | 2 | 222 | — | — | 3776 |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/kaust-ark/ARK/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/kaust-ark/ARK/issues?q=is%3Aissue+created%3A2026-10-24T02%3A28%3A08.405Z..2026-11-23T02%3A28%3A08.405Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/kaust-ark/ARK/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-24T02%3A28%3A08.405Z..2026-11-23T02%3A28%3A08.405Z)



统计日期：2026-11-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Idea2Paper 如何把持续研究、实验与独立评审接入 DSH，提交与停止的证据闭环覆盖到哪一步？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相对临时聊天与脚本，项目所有者和研究交付单位改变了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它面向能定义小规模计算研究任务、需要把结果写入论文并回查原始材料的研究者。合格交付是同一固定实验和稿件版本具有测量结果、编译PDF、独立评审和交付回执，而非只生成一篇看似完整的文章。相对临时聊天加手工脚本，组件把DSH持久会话作为项目所有者，把实验、文件编辑和评审作为受限项目工具，恢复时继续同一个owner_session_id。

贡献是研究材料与工作状态的衔接，不是提出新的科学方法。模型仍决定问题、实验与论证，原生DSH提供会话和子Agent，Python伴随包实现领域状态与证据校验。README也直接报告过评审接受了测量未支持的机制，因此独立角色与证据格式都不能代替科学判断。对无需实验或正式稿件的小问题，普通聊天/脚本可能总负担更低。

#### 证据与依据

**依据 1 · 作者声明**：[integrations/dsh/README.md:5-11](https://github.com/kaust-ark/ARK/blob/925e1b0798fb2e37ff04d26ab9ddb455cf2dda18/integrations/dsh/README.md#L5-L11)

作者定义持久研究任务及环境条件。

```text
Give Idea2Paper a question and a new project directory. A persistent DSH session plans the experiment, runs it, reads the measurements and writes the paper. An independent reviewer examines the manuscript and can request original results and rendered pages. Follow up with the same project to change the experiment or repair a claim.

## Install the prerelease

This source build supports two DSH runtimes on Linux with pnpm. Use Node.js 22.12 or newer for DSH 0.2.1-rc.2, and Node.js 24.9 or newer for DSH 0.2.2-rc.5. Resume each project with its original DSH version and profile. [DSH 0.2.1-rc.2](https://www.npmjs.com/package/@deepseek-ai/dsh/v/0.2.1-rc.2) · [DSH 0.2.2-rc.5](https://www.npmjs.com/package/@deepseek-ai/dsh/v/0.2.2-rc.5)

Python 3.10 or newer with venv and pip, TeX Live with pdflatex and BibTeX, and a working Docker daemon are needed for the local experiment. The first run installs the bundled Python wheel and its dependencies into a private cache and builds the experiment image. Budget disk space and package-download time for that setup.
```

**依据 2 · 源码核查**：[integrations/dsh/index.js:560-603](https://github.com/kaust-ark/ARK/blob/925e1b0798fb2e37ff04d26ab9ddb455cf2dda18/integrations/dsh/index.js#L560-L603)

持久owner会话和项目专用工具接线。

<details>
<summary>查看原文（44行）</summary>

```text
    const stored = await ctx.sessionPersistence.stat(sessionId, { signal: deadline })
    if (!stored && checkpoint.ready) throw new Error('Owner session missing from DSH persistence. Restore its original DSH home before continuing.')
    const setup = async (scope, agent) => {
      installModelSelection(scope, { current: selected, assembled: undefined })
      await restrictToProjectTools(scope)
      const files = projectEditor(directory)
      for (const [name, definition] of Object.entries(operations)) {
        registerTool(scope, name, definition, async (args, exec) => {
          if (exec.agent !== agent) throw new Error('This operation belongs to the project owner')
          exec.signal.throwIfAborted()
          if (name === 'read_project_file') return files.read(args)
          if (name === 'write_project_file') {
            return files.write(args, async edit => {
              const validation = await domain.call('check_manuscript_edit', edit)
              exec.signal.throwIfAborted()
              deadline.throwIfAborted()
              return validation
            })
          }
          if (name === 'request_review') {
            const result = await review(ctx, agent, domain, AbortSignal.any([deadline, exec.signal]), args)
            return reviewForAuthor(result)
          }
          const result = await domain.call(name, args)
          if (name === 'project_status' && (result.review || result.unfinished_review)) {
            const {review, unfinished_review, ...status} = result
            return {review:review && reviewForAuthor(review), unfinished_review, ...status}
          }
          if (name === 'deliver' && result?.delivered === true) committedDelivery = true
          return result
        }, roleTimeout)
      }
      scope.on('agent/pre-step', (event, next) => {
        if (event.agent === agent && event.step > 120) throw new Error('Owner exceeded the per-turn step budget')
        return next()
      })
    }
    const options = { signal: deadline, agentOptions: { provider: selected.provider, model: selected.model }, setup }
    handle = stored
      ? await ctx.agents.resume({ ...options, resumeSessionId: sessionId })
      : await ctx.agents.create({ ...options, sessionId, meta: { cwd: directory } })
    const agent = handle.agent
    await ctx.sessions.flush(agent.session)
    if (!checkpoint.ready) { checkpoint.ready = true; await writeJson(path, checkpoint) }
```

</details>

**依据 3 · 作者声明**：[integrations/dsh/README.md:59-67](https://github.com/kaust-ark/ARK/blob/925e1b0798fb2e37ff04d26ab9ddb455cf2dda18/integrations/dsh/README.md#L59-L67)

作者承认评审也可能接受不受数据支持的机制。

```text
### Independent review

A reviewer working with a verified results table can commit its proposed comparison, competing explanation and discriminating observation before it reads the paper. It can search a phrase in the rendered PDF and compare the language across sections. In the hosted dashboard, open a judgment to see its evidence or send the researcher a question about the quoted page.

In a four-page study, a reviewer accepted a mechanism that the submitted measurements did not establish. Read its cited evidence before relying on a scientific judgment.

When a revised experiment returns the same measured rows, the reviewer first sees the original question and the measurement schema. It writes a short Python reproduction for one recorded condition. The bundle freezes that program before opening the manuscript, worker source and results in the same reviewer session. The review records each recomputed value alongside the worker’s value. If the data or compute is unavailable, the review identifies the missing evidence.

In the dashboard, expand **What the reviewer checked → Experimental controls** to inspect the comparison. The local Docker or configured Apptainer science image runs the calculation offline. A Slurm project can perform this check without submitting another job.
```

#### 缺口

- 没有本次版本真实研究任务的质量与总人工量对照。
  **影响**：不能声称自动研究提高论文正确性或生产率。
  **进一步探讨**：用明确可核对结果的小问题比较手工流程与组件，盲评错误、人工修订和总资源。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 命令、会话、模型与项目工具怎样接成可恢复执行？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

bundle仅在idea2paper专用profile启用，apply拒绝非指定DSH版本，然后注册run/resume/stop/status。run创建新目录，resume要求旧目录；workflow.json记录运行时、模型选择和持久owner会话ID。模型或运行时与原项目不符会拒绝恢复，原DSH会话若缺失也拒绝，而不新造一次会话冒充延续。flock进程持有项目锁，阻止两个owner并发；后续消息先入队，在已有用户事件持久化后才确认。

owner注册的项目操作经JSON行RPC送Python domain，返回id必须匹配；helper关闭或协议错误会拒绝pending请求。默认bootstrap校验伴随wheel摘要，用独立缓存与flock完成venv/pip安装，再启动ark.orchestrator.native_domain；pack.py从同一仓库固定源码打入ark与资源，故该Python代码是本组件的直接打包依赖，不将整个ARK都算成DSH组件规模。

实验入口封存计划与脚本摘要，已封存代码变化会拒绝轮询或要求新的结果路径，native_experiment用收据和后端identity恢复同一操作。完成测量、编译、评审与交付分别有状态；恢复不意味着重算，也不证明旧材料适用于新模型或宿主。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh/index.js:13-30](https://github.com/kaust-ark/ARK/blob/925e1b0798fb2e37ff04d26ab9ddb455cf2dda18/integrations/dsh/index.js#L13-L30)

宿主服务注入和版本拒绝。

<details>
<summary>查看原文（18行）</summary>

```text
export const name = 'idea2paper'
export const inject = ['cmdlineArgs', 'agentDefaultModel', 'agents', 'sessions', 'sessionPersistence', 'sessionQuery', 'tools', 'subagents', 'llm', 'attachments']
const isDsh021 = sdk.version === '0.2.1-rc.2'

async function restrictToProjectTools(scope) {
  scope.tools.restrict({ allow: [] })
  if (isDsh021) scope.tools.presentAs('native')
  else scope.plugin(await import('@deepseek-ai/dsh-tool-executor-native'))
}
const roleTimeout = 20 * 60_000
const userMessage = (text, context) => {
  const content = [{ type: 'text', text }]
  if (context) content.push({ type: 'text', text: context })
  return createUserMessage({ source: { kind: 'user' }, content })
}

export function apply(ctx) {
  if (!isDsh021 && sdk.version !== '0.2.2-rc.5') throw new Error('Unsupported DSH version ' + sdk.version)
```

</details>

**依据 2 · 源码核查**：[integrations/dsh/index.js:158-170](https://github.com/kaust-ark/ARK/blob/925e1b0798fb2e37ff04d26ab9ddb455cf2dda18/integrations/dsh/index.js#L158-L170)

固定运行时/模型/owner的检查点。

<details>
<summary>查看原文（13行）</summary>

```text
    const selected = ctx.agentDefaultModel.currentSelection()
    const selection = { provider: selected.provider, model: selected.model }
    let checkpoint = await readJson(path)
    if (!checkpoint) {
      if (!idea) throw new Error('Project checkpoint does not exist')
      checkpoint = { version: 3, runtime: sdk.version, id: randomUUID(), owner_session_id: randomUUID(), idea, selection, ready: false }
      await writeJson(path, checkpoint)
    } else if (checkpoint.runtime && checkpoint.runtime !== sdk.version) {
      throw new Error('Resume this project with its original DSH ' + checkpoint.runtime + ' runtime.')
    } else if (checkpoint.version !== 3 || typeof checkpoint.owner_session_id !== 'string' ||
               checkpoint.selection?.model !== selection.model || checkpoint.selection?.provider !== selection.provider ||
               (idea !== undefined && (!hosted || idea !== checkpoint.idea))) {
      throw new Error('Incompatible project checkpoint or model selection')
```

</details>

**依据 3 · 源码核查**：[integrations/dsh/index.js:560-603](https://github.com/kaust-ark/ARK/blob/925e1b0798fb2e37ff04d26ab9ddb455cf2dda18/integrations/dsh/index.js#L560-L603)

持久会话缺失拒绝和工具注册。

<details>
<summary>查看原文（44行）</summary>

```text
    const stored = await ctx.sessionPersistence.stat(sessionId, { signal: deadline })
    if (!stored && checkpoint.ready) throw new Error('Owner session missing from DSH persistence. Restore its original DSH home before continuing.')
    const setup = async (scope, agent) => {
      installModelSelection(scope, { current: selected, assembled: undefined })
      await restrictToProjectTools(scope)
      const files = projectEditor(directory)
      for (const [name, definition] of Object.entries(operations)) {
        registerTool(scope, name, definition, async (args, exec) => {
          if (exec.agent !== agent) throw new Error('This operation belongs to the project owner')
          exec.signal.throwIfAborted()
          if (name === 'read_project_file') return files.read(args)
          if (name === 'write_project_file') {
            return files.write(args, async edit => {
              const validation = await domain.call('check_manuscript_edit', edit)
              exec.signal.throwIfAborted()
              deadline.throwIfAborted()
              return validation
            })
          }
          if (name === 'request_review') {
            const result = await review(ctx, agent, domain, AbortSignal.any([deadline, exec.signal]), args)
            return reviewForAuthor(result)
          }
          const result = await domain.call(name, args)
          if (name === 'project_status' && (result.review || result.unfinished_review)) {
            const {review, unfinished_review, ...status} = result
            return {review:review && reviewForAuthor(review), unfinished_review, ...status}
          }
          if (name === 'deliver' && result?.delivered === true) committedDelivery = true
          return result
        }, roleTimeout)
      }
      scope.on('agent/pre-step', (event, next) => {
        if (event.agent === agent && event.step > 120) throw new Error('Owner exceeded the per-turn step budget')
        return next()
      })
    }
    const options = { signal: deadline, agentOptions: { provider: selected.provider, model: selected.model }, setup }
    handle = stored
      ? await ctx.agents.resume({ ...options, resumeSessionId: sessionId })
      : await ctx.agents.create({ ...options, sessionId, meta: { cwd: directory } })
    const agent = handle.agent
    await ctx.sessions.flush(agent.session)
    if (!checkpoint.ready) { checkpoint.ready = true; await writeJson(path, checkpoint) }
```

</details>

**依据 4 · 源码核查**：[integrations/dsh/project.js:292-340](https://github.com/kaust-ark/ARK/blob/925e1b0798fb2e37ff04d26ab9ddb455cf2dda18/integrations/dsh/project.js#L292-L340)

RPC启动、请求id与失败处理。

<details>
<summary>查看原文（49行）</summary>

```text
export function openDomain(directory, signal, { detached = false } = {}) {
  signal.throwIfAborted()
  const interpreter = process.env.IDEA2PAPER_PYTHON || 'python3'
  const args = process.env.IDEA2PAPER_PYTHON
    ? ['-I', '-u', '-m', 'ark.orchestrator.native_domain']
    : ['-I', '-u', join(packageDir, 'domain_bootstrap.py')]
  const fd = process.env.IDEA2PAPER_DOMAIN_FD
  if (fd !== undefined && (!/^\d+$/.test(fd) || Number(fd) < 3)) throw new Error('Invalid inherited domain socket')
  const socket = fd === undefined ? undefined : new Socket({ fd: Number(fd) })
  const child = socket ? undefined : spawn(interpreter, args, { cwd: directory, stdio: ['pipe', 'pipe', 'inherit'], signal, detached })
  const input = socket || child.stdout
  const output = socket || child.stdin
  const endpoint = socket || child
  const pending = new Map()
  const lines = createInterface({ input, crlfDelay: Infinity })
  let failed
  const fail = reason => {
    failed ??= reason
    for (const request of pending.values()) request.reject(failed)
    pending.clear()
  }
  const closed = new Promise(resolveClosed => endpoint.once('close', (code, sig) => {
    fail(new Error('Idea2Paper domain helper closed (' + (code ?? sig) + ')'))
    resolveClosed()
  }))
  const stop = () => socket?.destroy(new Error('Project interrupted'))
  signal.addEventListener('abort', stop, { once: true })
  const terminate = () => socket ? socket.destroy() : child.kill()
  endpoint.on('error', fail)
  output.on('error', fail)
  lines.on('line', line => {
    let reply
    try { reply = JSON.parse(line) } catch {
      fail(new Error('Domain helper returned invalid JSON')); terminate(); return
    }
    const request = pending.get(reply.id)
    if (!request) { fail(new Error('Unexpected domain reply id')); terminate(); return }
    pending.delete(reply.id)
    if (reply.ok === true) request.resolve(reply.result)
    else request.reject(new Error(typeof reply.error === 'string' ? reply.error : JSON.stringify(reply.error)))
  })
  function call(op, args = {}) {
    signal.throwIfAborted()
    if (failed) return Promise.reject(failed)
    const id = randomUUID()
    return new Promise((resolveRequest, reject) => {
      pending.set(id, { resolve: resolveRequest, reject })
      output.write(JSON.stringify({ id, op, args }) + '\n')
    })
```

</details>

**依据 5 · 源码核查**：[integrations/dsh/domain_bootstrap.py:57-87](https://github.com/kaust-ark/ARK/blob/925e1b0798fb2e37ff04d26ab9ddb455cf2dda18/integrations/dsh/domain_bootstrap.py#L57-L87)

wheel摘要与私有缓存执行。

<details>
<summary>查看原文（31行）</summary>

```text
def main():
    if sys.version_info < (3, 10):
        raise RuntimeError("Idea2Paper requires Python 3.10 or later.")
    directory = Path(__file__).resolve().parent / "companion"
    manifest = json.loads((directory / "manifest.json").read_text())
    wheel = directory / manifest["wheel"]
    digest = hashlib.sha256(wheel.read_bytes()).hexdigest()
    if wheel.parent != directory or digest != manifest["sha256"]:
        raise RuntimeError("The installed Idea2Paper companion failed its integrity check.")
    cache_root = Path(os.environ.get("XDG_CACHE_HOME") or Path.home() / ".cache").absolute()
    cache = cache_root / "idea2paper" / "companions"
    cache.mkdir(mode=0o700, parents=True, exist_ok=True)
    version = f"py{sys.version_info.major}{sys.version_info.minor}-{digest}"
    if sys.argv[1:] == ["--install"]:
        install(cache, version, wheel, digest)
        return
    python = ready_python(cache, version, digest)
    if python is None:
        print("Setting up the Idea2Paper Python companion (first run).", file=sys.stderr, flush=True)
        # The installer owns the flock and its own session. Losing a dashboard or
        # CLI connection cannot release the lock while venv or pip is writing.
        with tempfile.TemporaryFile() as output:
            worker = subprocess.run([sys.executable, "-I", __file__, "--install"], stdin=subprocess.DEVNULL,
                                    stdout=output, stderr=output, start_new_session=True)
            if worker.returncode:
                output.seek(max(0, output.tell() - 4096))
                raise RuntimeError("Idea2Paper companion setup failed:\n" + output.read().decode(errors="replace"))
        python = ready_python(cache, version, digest)
        if python is None:
            raise RuntimeError("Companion installer exited without publishing a ready environment.")
    os.execv(str(python), [str(python), "-I", "-u", "-m", "ark.orchestrator.native_domain"])
```

</details>

**依据 6 · 源码核查**：[integrations/dsh/pack.py:40-50](https://github.com/kaust-ark/ARK/blob/925e1b0798fb2e37ff04d26ab9ddb455cf2dda18/integrations/dsh/pack.py#L40-L50)

领域代码与资源进入同版本打包。

<details>
<summary>查看原文（11行）</summary>

```text
        meta = json.loads((HERE / "package.json").read_text())
        for filename in ["LICENSE", "README.md", "package.json", *meta["files"]]:
            if filename != "companion":
                shutil.copy2(HERE / filename, pkg / filename)
        for folder in ("ark", "website"):
            shutil.copytree(REPO / folder, src / folder, ignore=skip)
        for filename in ("pyproject.toml", "LICENSE"):
            shutil.copy2(REPO / filename, src / filename)
        assets = src / "ark/bundle_assets"
        for folder in ("skills", "venue_templates"):
            shutil.copytree(REPO / folder, assets / folder, ignore=skip)
```

</details>

**依据 7 · 源码核查**：[ark/orchestrator/native_domain.py:890-910](https://github.com/kaust-ark/ARK/blob/925e1b0798fb2e37ff04d26ab9ddb455cf2dda18/ark/orchestrator/native_domain.py#L890-L910)

实验计划、脚本封存与变更拒绝。

<details>
<summary>查看原文（21行）</summary>

```text
    def _execute(self, args, *, plot=False):
        if self.state.get("pending_plan_change"):
            raise ValueError("Revise the experiment plan to address the requested change before execution.")
        if not (plan := self.state.get("plan")):
            raise ValueError("Declare the question, baseline, metric and paired controls before executing.")
        script = plan["script"]
        filename = _text(args, "filename") if plot else None
        options = {}
        if not plot:
            source = (self.root / script).resolve()
            if source.parent != self.root / "scripts":
                raise ValueError("Invalid experiment script.")
            code_hash = _sha(source)
            if self.state.get("sealed_script") not in (None, code_hash):
                if (self._measurement_receipt() or {}).get("status") == "completed":
                    raise ValueError("The previous experiment completed with its original code. To test this "
                                     "correction, call plan_experiment with a distinct result_path, then "
                                     "run_experiment. Regenerate any table or plot that uses the revised rows.")
                raise ValueError("The submitted code changed. Restore the original script before polling.")
            self.state["sealed_script"] = code_hash
            self.save()
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 实验副作用、停止与独立评审是否约束最终交付？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

这些约束在真实调用链中存在。当前domain调用的是ark.compute.native_experiment，不是目录中较旧的experiment.js演示runner；本地Docker分支禁止网络、只读根、丢弃capabilities并设置CPU/内存/进程/输出限制，结果与脚本/计划收据关联。其隔离边界限定在实验worker，不等于宿主、模型网络、pip安装或TeX编译也在同一个沙箱。

停止先持久化项目stopped，再遍历实验收据取消。Docker检查实际容器ID后stop/rm；Slurm若无法确认提交或仍活跃，会保留cancelling返回，不把未知操作重启。然而domain.stop在cancel返回后直接给state=stopped，CLI可能显示Tracked work cancelled；这个项目状态不充分证明所有Slurm作业已终止。应独立核对每份后端收据，尤其submission_unknown和cancelling。此处是源码边界发现，未复现运行故障。

评审从冻结快照启动独立子会话，检查parent与非seeded，会在停止前要求完整JSON和已读取证据回执；Python重新核对当前revision、观察收据与必需检查，未评估会转unassessed。deliver再次核对编译源/PDF摘要、当前可交付评审、测量文件/摘要和交付契约，blockers存在时返回delivered=false。它约束的是版本一致与显式证据条件；评审模型仍可能错误理解证据，正如README承认的案例，不能把通过机械闸门称为科学结论已真。

#### 证据与依据

**依据 1 · 源码核查**：[ark/orchestrator/native_domain.py:28-39](https://github.com/kaust-ark/ARK/blob/925e1b0798fb2e37ff04d26ab9ddb455cf2dda18/ark/orchestrator/native_domain.py#L28-L39)

domain导入的真实实验实现。

<details>
<summary>查看原文（12行）</summary>

```text
import yaml

from ark import (
    citation,
    deep_research,
    delivery_contract,
    figure_manifest,
    literature_evidence,
    measurement_table,
    review,
)
from ark.compute import native_experiment, review_control
```

</details>

**依据 2 · 源码核查**：[ark/compute/native_experiment.py:418-449](https://github.com/kaust-ark/ARK/blob/925e1b0798fb2e37ff04d26ab9ddb455cf2dda18/ark/compute/native_experiment.py#L418-L449)

实际Docker约束与容器身份。

<details>
<summary>查看原文（32行）</summary>

```text
def _docker(staging, row, path, plot):
    _check_daemon(row, path)
    name = row["identity"]
    info = _inspect(name)
    if not info:
        if row.get("job_id"):
            raise RuntimeError("Recorded experiment container disappeared before output was captured")
        image = row.get("image") or _docker_image()
        row.update(submitted_intent=True, image=image)
        _save(path, row)
        volume = _docker_input(staging, row)
        args = ["docker", "create", "--name", name, "--label", f"idea2paper.identity={name}", "--network", "none",
                "--read-only", "--cap-drop", "ALL", "--security-opt", "no-new-privileges", "--pids-limit", "64",
                "--memory", "512m", "--cpus", "1", "--user", f"{os.getuid()}:{os.getgid()}",
                "--tmpfs", "/tmp:rw,nosuid,nodev,size=64m,mode=1777",
                "--tmpfs", "/output:rw,nosuid,nodev,size=32m,mode=1777", "--env", "MPLCONFIGDIR=/tmp/mpl",
                "--env", "OPENBLAS_NUM_THREADS=1", "--env", "OMP_NUM_THREADS=1",
                "--mount", f"type=volume,src={volume},dst=/study,readonly", "--workdir", "/output",
                "--log-driver", "json-file", "--log-opt", "max-size=24m", "--log-opt", "max-file=1", image,
                "timeout", "-k", "2", "240", "python", "-I", "-B", "/study/runner.py"]
        if plot:
            args.append(plot)
        elif row.get("expected"):
            args.extend(["--result", row["expected"]])
        container_id = _run(args).stdout.strip()
        status = "created"
    else:
        container_id, status = info["Id"], info["State"]["Status"]
    if row.get("job_id", container_id) != container_id:
        raise RuntimeError("Experiment container ID changed")
    row["job_id"] = container_id
    _save(path, row)
```

</details>

**依据 3 · 源码核查**：[ark/orchestrator/native_domain.py:610-631](https://github.com/kaust-ark/ARK/blob/925e1b0798fb2e37ff04d26ab9ddb455cf2dda18/ark/orchestrator/native_domain.py#L610-L631)

停止项目与继续时的取消调用。

<details>
<summary>查看原文（22行）</summary>

```text
    def stop(self, args):
        if self.state.get("state") != "stopped":
            self.state["state_before_stop"] = self.state.get("state", "running")
            self.state["state"] = "stopped"
            self.save()
            self.event("work", "stopped", "User stopped this project.", status="stopped")
        native_experiment.cancel(self.root)
        return {"state": "stopped"}

    def continue_project(self, args):
        status = self.state.get("state")
        if status == "stopped":
            native_experiment.cancel(self.root)
            if record := self._measurement_receipt():
                self.state["experiment"] = record
            self.state["state"] = self.state.pop("state_before_stop", "running")
        if self.state.get("state") == "paused" and self.state.get("pause_reason") in {"quota", "owner_error"}:
            self.state.update(state="running")
            self.state.pop("pause_reason", None)
        if self.state.get("state") != status:
            self.save()
        return self.project_status(args)
```

</details>

**依据 4 · 源码核查**：[ark/compute/native_experiment.py:516-553](https://github.com/kaust-ark/ARK/blob/925e1b0798fb2e37ff04d26ab9ddb455cf2dda18/ark/compute/native_experiment.py#L516-L553)

Slurm未确认保持cancelling、Docker身份核对。

<details>
<summary>查看原文（38行）</summary>

```text
def _cancel_one(row, path):
    if row["status"] in {"completed", "cancelled", "failed"}:
        _cleanup_terminal(row, path)
        return
    row["status"] = "cancelling"
    _save(path, row)
    name = row["identity"]
    if row["backend"] == "slurm":
        job = row.get("job_id") or (_slurm_ids(name, row["created"]) if row.get("submitted_intent") else None)
        if job:
            row["job_id"] = job
            state, _ = _job_state(job, name)
            if state in ACTIVE_SLURM or state is None:
                # A known numeric ID without an accounting row might already
                # have completed; verify its unique name before cancelling it.
                if _slurm_ids(name, row["created"]) != job:
                    return
                result = _run(["scancel", job], check=False)
                if result.returncode and "invalid job id" not in result.stderr.lower():
                    raise RuntimeError(result.stderr[-1000:])
                state, _ = _job_state(job, name)
                if state in ACTIVE_SLURM or state is None:
                    return
        elif row.get("submitted_intent"):
            return
    else:
        _check_daemon(row, path)
        info = _inspect(name)
        if info:
            if row.get("job_id", info["Id"]) != info["Id"]:
                raise RuntimeError("Cannot cancel mismatched container identity")
            row["job_id"] = info["Id"]
            if info["State"]["Status"] in ("running", "restarting"):
                _run(["docker", "stop", "--time", "2", info["Id"]])
            _run(["docker", "rm", info["Id"]])
        _remove_input(row)
    row["status"] = "cancelled"
    _save(path, row)
```

</details>

**依据 5 · 源码核查**：[integrations/dsh/index.js:273-320](https://github.com/kaust-ark/ARK/blob/925e1b0798fb2e37ff04d26ab9ddb455cf2dda18/integrations/dsh/index.js#L273-L320)

独立reviewer与提交前校验。

<details>
<summary>查看原文（48行）</summary>

```text
async function review(ctx, owner, domain, signal, args) {
  const childId = randomUUID()
  const packet = await domain.call('review_snapshot', {session_id:childId, preflight:args.draft !== true, retry_reason:args.retry_reason})
  if (packet.unfinished_review) return packet.unfinished_review
  if (packet.blockers?.length) return { ready: false, source: 'artifact checks', blockers: packet.blockers }
  if (packet.cached) return packet.cached
  if (!packet.revision || !packet.brief) throw new Error('Review snapshot has no revision or blind brief')
  const protocolFirst = packet.reproduction_brief !== undefined
  if (protocolFirst && (typeof packet.reproduction_brief !== 'string' || !packet.reproduction_brief.trim())) {
    throw new Error('Missing independent reproduction brief')
  }
  const observed = []
  let checkedVerdict, lastRejected, previousDraft, stalledCheck
  let disclosed = !protocolFirst && !packet.scope_brief, committing = false, sealed = false, disclosureError
  let configured = false
  const unlisten = ctx.on('agent/created', async ({ agent }) => {
    if (agent.id !== childId) return
    if (agent.session.header.parentSession !== owner.id || agent.session.header.isSeeded) throw new Error('Reviewer session isolation failed')
    const scope = agent.ctx
    scope.on('agent/pre-step', (step, next) => {
      if (step.agent === agent && disclosureError) throw disclosureError
      if (step.agent === agent && step.step > 30) throw new Error('Reviewer reached its evidence-inspection budget')
      return next()
    })
    scope.on('agent/turn-stopping', async ({agent: stopping, turn, signal: turnSignal}) => {
      if (stopping !== agent) return
      signal.throwIfAborted()
      turnSignal.throwIfAborted()
      checkedVerdict = undefined
      const message = agent.session.snapshotEvents().findLast(e => e.type === 'assistant/message' && e.data.turn === turn)?.data
      if (!message || message.interrupted || message.stream?.some(({chunk}) => chunk?.type === 'finish' && chunk.reason.kind === 'max-tokens')) return
      const output = message.message.content.filter(b => b.type === 'text').map(b => b.text).join('').trim()
      let verdict, diagnostic
      try { verdict = JSON.parse(output.replace(/^`{3}(?:json)?\s*|\s*`{3}$/gi, '')) }
      catch { diagnostic = 'The final message must contain a complete JSON verdict.' }
      if (!diagnostic && disclosed) {
        try { verdict = reviewSubmission(verdict, previousDraft, packet.revision) }
        catch (error) { diagnostic = error.message }
      }
      if (!disclosed) diagnostic = protocolFirst && !sealed
        ? 'Use reproduce_measurement to commit your program or explain why independent reproduction is unavailable.'
        : 'Use commit_evidence_scope to record the comparison, competing explanation and discriminating observation before reading the paper.'
      if (!diagnostic) {
        const proof = await domain.call('check_review', {revision:packet.revision, verdict, observed})
        signal.throwIfAborted()
        turnSignal.throwIfAborted()
        if (proof.valid === true) {
          checkedVerdict = verdict
```

</details>

**依据 6 · 源码核查**：[ark/orchestrator/native_domain.py:3056-3088](https://github.com/kaust-ark/ARK/blob/925e1b0798fb2e37ff04d26ab9ddb455cf2dda18/ark/orchestrator/native_domain.py#L3056-L3088)

版本/回执复核。

<details>
<summary>查看原文（33行）</summary>

```text
    def record_review(self, args, *, check_only=False):
        snapshot = self._snapshot()
        if (
            not self.snapshot
            or snapshot["revision"] != args.get("revision")
            or snapshot["revision"] != self.snapshot["revision"]
        ):
            raise ValueError("Manuscript or evidence changed while the review was in progress.")
        observed = args.get("observed", [])
        if not isinstance(observed, list) or any(r not in self.review_receipts for r in observed):
            raise ValueError("Unknown reviewer evidence receipt.")
        previous = _load(self.state_dir / "native_review.json")
        try:
            self._require_disclosure()
            if any(r.get("control") and r not in observed for r in self.review_receipts):
                raise ValueError("The verdict must retain all executed numerical controls.")
        except ValueError as exc:
            if check_only:
                return {"valid": False, "diagnostic": str(exc)}
            raise
        try:
            record = review.validate_review(snapshot, args["verdict"], previous=previous, observed=observed)
        except ValueError as exc:
            if check_only:
                feedback = review.draft_evidence_feedback(snapshot, args["verdict"], observed, str(exc), previous)
                return {"valid": False, "diagnostic": feedback}
            raise
        if check_only:
            return {"valid": True}
        record.update(
            session_id=_text(args, "session_id", limit=160),
            paper_pdf_sha256=_sha(self.latex_dir / "main.pdf"),
        )
```

</details>

**依据 7 · 源码核查**：[ark/review.py:2699-2714](https://github.com/kaust-ark/ARK/blob/925e1b0798fb2e37ff04d26ab9ddb455cf2dda18/ark/review.py#L2699-L2714)

未评估与阻塞结果如何限制deliverable。

<details>
<summary>查看原文（16行）</summary>

```text
    if any(i["severity"] == "blocker" and i["status"] in ("new", "still_present") for i in issues):
        verdict = "revise"
    elif any(checks[d]["status"] == "unassessed" for d in snapshot["required"]) or any(
            i["severity"] == "blocker" and i["status"] == "unassessed" for i in issues):
        verdict = "unassessed"
    else:
        verdict = "accept"
    submitted = response.get("verdict")
    explicit_missing_block = submitted == "revise" and verdict == "unassessed" and missing_observations
    if submitted != verdict and not explicit_missing_block:
        raise ValueError(f"The proposed verdict disagrees with the open findings or missing evidence: expected {verdict}")
    return {"version": REVIEW_VERSION, "revision": snapshot["revision"], "verdict": verdict,
            "submitted_verdict": submitted, "deliverable": verdict == "accept", "summary": summary, "alternative": alternative,
            "artifact_hashes": {p: m["sha256"] for p, m in snapshot["artifacts"].items()},
            "closed_ids": sorted(closed_ids | {i["id"] for i in issues if i["status"] == "resolved"}),
            "strengths": strengths, "checks": checks, "issues": issues, "score": score}
```

</details>

**依据 8 · 源码核查**：[ark/orchestrator/native_domain.py:3118-3158](https://github.com/kaust-ark/ARK/blob/925e1b0798fb2e37ff04d26ab9ddb455cf2dda18/ark/orchestrator/native_domain.py#L3118-L3158)

交付前重新核查实际文件、评审和blockers。

<details>
<summary>查看原文（41行）</summary>

```text
    def deliver(self, args):
        self._check_compiled()
        snap = self._snapshot()
        record = _load(self.state_dir / "native_review.json", {})
        problems = []
        if not review.record_is_current(snap, record) or not record.get("deliverable"):
            problems.append("Independent review is missing, stale, or requires revision.")
        measurement = self.state.get("experiment") or {}
        measured = self.root / measurement.get("artifact", "")
        if (
            measurement.get("status") != "completed"
            or not measured.is_file()
            or measured.is_symlink()
            or _sha(measured) != measurement.get("sha256")
            or ("worker_measurement" in snap and (not snap["worker_measurement"]["verified"]
                or measurement.get("artifact") != snap["worker_measurement"]["expected"]))
        ):
            problems.append("Missing or changed worker measurements.")
        if self.config.get("layout_mode") == "strict":
            rendered = self.state.get("compile", {})
            proof = _load(self.state_dir / "native_citations.json", {})
            bib = self.latex_dir / "references.bib"
            cited = set(rendered.get("cited", []))
            if (
                not bib.is_file()
                or not proof.get("verified")
                or proof.get("sha256") != _sha(bib)
                or not cited
                or not cited.issubset(set(proof.get("cited", [])))
            ):
                problems.append("Verify the sources cited by this manuscript.")
        report = delivery_contract.evaluate(self.root, self.config.get("venue_pages", 4), config=self.config)
        delivery_contract.write_report(self.root, report)
        problems += [f"{x.check}: {x.detail}" for x in report.delivery_blockers(self.config)]
        problems.extend(self._strict_paper_issues())
        trace = self._research_citations()
        trace_details = {"research_citations": trace} if trace else {}
        if problems:
            return {"delivered": False, "blockers": problems, **trace_details}
        self.state.update(state="delivered", delivery_revision=snap["revision"],
                          delivery_inputs_sha256=review.delivery_inputs_digest(snap))
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 固定宿主版本、Python、模型与项目维护需要什么投入？

**研究主题**：效果与总成本、依赖、兼容与流程

#### 完整回答

该组件不是轻量提示包。作者只声明Linux与pnpm两组固定DSH运行时，Node最低版本随宿主分支不同；源码也检查固定SDK版本。Python≥3.10、venv/pip、flock、TeX Live和Docker构成基础环境，首次运行会安装wheel与google-genai依赖并准备实验镜像。普通研究需要所选DSH模型账号，图像检查需要支持图像的模型，独立评审另消耗模型调用；Gemini Deep Research等是特定操作可选的服务。

总成本应按最终合格且可复查论文计入失败实验、重复评审和人工科学核对。没有用量与合格数，就不能给每篇成本、节时或ROI。

#### 证据与依据

**依据 1 · 作者声明**：[integrations/dsh/README.md:9-11](https://github.com/kaust-ark/ARK/blob/925e1b0798fb2e37ff04d26ab9ddb455cf2dda18/integrations/dsh/README.md#L9-L11)

固定宿主与系统依赖声明。

```text
This source build supports two DSH runtimes on Linux with pnpm. Use Node.js 22.12 or newer for DSH 0.2.1-rc.2, and Node.js 24.9 or newer for DSH 0.2.2-rc.5. Resume each project with its original DSH version and profile. [DSH 0.2.1-rc.2](https://www.npmjs.com/package/@deepseek-ai/dsh/v/0.2.1-rc.2) · [DSH 0.2.2-rc.5](https://www.npmjs.com/package/@deepseek-ai/dsh/v/0.2.2-rc.5)

Python 3.10 or newer with venv and pip, TeX Live with pdflatex and BibTeX, and a working Docker daemon are needed for the local experiment. The first run installs the bundled Python wheel and its dependencies into a private cache and builds the experiment image. Budget disk space and package-download time for that setup.
```

**依据 2 · 作者声明**：[integrations/dsh/README.md:30-44](https://github.com/kaust-ark/ARK/blob/925e1b0798fb2e37ff04d26ab9ddb455cf2dda18/integrations/dsh/README.md#L30-L44)

模型/图像与可选服务。

<details>
<summary>查看原文（15行）</summary>

````text
## Run a small study

Configure your chosen model in DSH. For its DeepSeek provider, set `DEEPSEEK_API_KEY` in the environment that launches DSH. Use a model and provider with image input for checks requiring inspection of rendered figures. A standalone project with a configured Gemini key can also request Google Deep Research and method illustrations. Those calls use the associated provider account.

```sh
dsh --profile idea2paper run search-study "Compare the number of key inspections in linear and binary search for missing targets on sorted arrays. Include small arrays and report the exact counts."
dsh --profile idea2paper status search-study
dsh --profile idea2paper resume search-study "Report the crossover and any ties in the tested range."
dsh --profile idea2paper stop search-study
dsh --profile idea2paper resume search-study
```

In a terminal, status shows the Slurm job, illustration check, last compiled body length and reviewed edition when available. Use `status <project> --json` or redirect its output for the full status record.

The first command opens the project. Run status, send a follow-up or request a stop from another terminal. Resume after an interruption with the original profile, model and project directory. Standalone runs default to local experiment execution. A configured Slurm environment can dispatch experiments to the cluster. The paper must pass the current revision's review and delivery checks.
````

</details>

**依据 3 · 源码核查**：[integrations/dsh/domain_bootstrap.py:26-54](https://github.com/kaust-ark/ARK/blob/925e1b0798fb2e37ff04d26ab9ddb455cf2dda18/integrations/dsh/domain_bootstrap.py#L26-L54)

真实pip安装、锁和失败清理。

<details>
<summary>查看原文（29行）</summary>

```text
def install(cache, version, wheel, digest):
    with (cache / (version + ".lock")).open("a") as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        if ready_python(cache, version, digest):
            return
        target = cache / version
        try:
            target.mkdir(mode=0o700)
        except FileExistsError:
            # An interrupted older bootstrap may have left pip writing at its
            # absolute prefix. Give this install its own permanent path.
            target = Path(tempfile.mkdtemp(dir=cache, prefix=version + "-"))
        python = target / "bin/python"
        try:
            venv.EnvBuilder(with_pip=True).create(target)
            subprocess.run(
                [str(python), "-I", "-m", "pip", "install", "--disable-pip-version-check",
                 str(wheel), "google-genai>=2,<3"],
                check=True, stdout=sys.stderr,
            )
            subprocess.run([str(python), "-I", "-c", "import ark.orchestrator.native_domain, google.genai"],
                           check=True, stdout=sys.stderr)
            pending = target / ".ready.tmp"
            pending.write_text(digest)
            pending.replace(target / ".ready")
        except Exception:
            # This worker allocated the prefix and has waited for its own children.
            shutil.rmtree(target, ignore_errors=True)
            raise
```

</details>

**依据 4 · 源码核查**：[integrations/dsh/index.js:527-531](https://github.com/kaust-ark/ARK/blob/925e1b0798fb2e37ff04d26ab9ddb455cf2dda18/integrations/dsh/index.js#L527-L531)

owner默认4小时期限，不是计费约束。

```text
async function runOwner(ctx, { directory, path, checkpoint, selected, status, message, domain, signal }) {
  const sessionId = checkpoint.owner_session_id
  const milliseconds = Number(process.env.IDEA2PAPER_OWNER_TIMEOUT_MS || 4 * 60 * 60_000)
  if (!Number.isSafeInteger(milliseconds) || milliseconds <= 0) throw new Error('Invalid owner time limit')
  const deadline = AbortSignal.any([signal, AbortSignal.timeout(milliseconds)])
```

**依据 5 · 源码核查**：[ark/compute/native_experiment.py:516-540](https://github.com/kaust-ark/ARK/blob/925e1b0798fb2e37ff04d26ab9ddb455cf2dda18/ark/compute/native_experiment.py#L516-L540)

失败恢复需处理后端不确定状态。

<details>
<summary>查看原文（25行）</summary>

```text
def _cancel_one(row, path):
    if row["status"] in {"completed", "cancelled", "failed"}:
        _cleanup_terminal(row, path)
        return
    row["status"] = "cancelling"
    _save(path, row)
    name = row["identity"]
    if row["backend"] == "slurm":
        job = row.get("job_id") or (_slurm_ids(name, row["created"]) if row.get("submitted_intent") else None)
        if job:
            row["job_id"] = job
            state, _ = _job_state(job, name)
            if state in ACTIVE_SLURM or state is None:
                # A known numeric ID without an accounting row might already
                # have completed; verify its unique name before cancelling it.
                if _slurm_ids(name, row["created"]) != job:
                    return
                result = _run(["scancel", job], check=False)
                if result.returncode and "invalid job id" not in result.stderr.lower():
                    raise RuntimeError(result.stderr[-1000:])
                state, _ = _job_state(job, name)
                if state in ACTIVE_SLURM or state is None:
                    return
        elif row.get("submitted_intent"):
            return
```

</details>

#### 缺口

- 未取得同工作负载的用量账单、合格稿件数量和恢复工时。
  **影响**：不能判断自动化是否低于手工流程的总成本。
  **进一步探讨**：给简单可验证任务设置外部预算，记录所有owner/reviewer调用、失败实验与人工修订。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可追溯实验状态能否形成更可靠的提交前证据闸门？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

现有实现已把稿件、测量与评审版本绑定，进一步值得验证的是把“项目已停”与“每个后端已确认终止”分开，并让恢复/退出界面展示未决操作。推导来自stop先写项目状态和Slurm取消可保留cancelling这两个事实，不是泛化要求所有步骤再加审批。相对现有stopped回执，它增加的是外部副作用终止的可观察性，不改变研究算法。

最小验证可在隔离测试项目中安排本地容器和可控Slurm替身，分别注入提交回执丢失、取消后仍活跃、查询暂不可用与已完成四种情况，比较“显示stopped”与“显示每项终止证明”能否避免错误重启或泄漏作业。观察重复执行、未决作业和人工确认量；若显示证明仍把未知当取消，或显著阻碍无副作用的status读取而没有减少错误，应否定设计。科学方面仍需独立人工判断关键推论，结构化回执不能证明因果结论。

#### 证据与依据

**依据 1 · 源码核查**：[ark/orchestrator/native_domain.py:610-631](https://github.com/kaust-ark/ARK/blob/925e1b0798fb2e37ff04d26ab9ddb455cf2dda18/ark/orchestrator/native_domain.py#L610-L631)

项目状态和取消恢复的先后顺序。

<details>
<summary>查看原文（22行）</summary>

```text
    def stop(self, args):
        if self.state.get("state") != "stopped":
            self.state["state_before_stop"] = self.state.get("state", "running")
            self.state["state"] = "stopped"
            self.save()
            self.event("work", "stopped", "User stopped this project.", status="stopped")
        native_experiment.cancel(self.root)
        return {"state": "stopped"}

    def continue_project(self, args):
        status = self.state.get("state")
        if status == "stopped":
            native_experiment.cancel(self.root)
            if record := self._measurement_receipt():
                self.state["experiment"] = record
            self.state["state"] = self.state.pop("state_before_stop", "running")
        if self.state.get("state") == "paused" and self.state.get("pause_reason") in {"quota", "owner_error"}:
            self.state.update(state="running")
            self.state.pop("pause_reason", None)
        if self.state.get("state") != status:
            self.save()
        return self.project_status(args)
```

</details>

**依据 2 · 源码核查**：[ark/compute/native_experiment.py:516-553](https://github.com/kaust-ark/ARK/blob/925e1b0798fb2e37ff04d26ab9ddb455cf2dda18/ark/compute/native_experiment.py#L516-L553)

取消有明确未确认分支。

<details>
<summary>查看原文（38行）</summary>

```text
def _cancel_one(row, path):
    if row["status"] in {"completed", "cancelled", "failed"}:
        _cleanup_terminal(row, path)
        return
    row["status"] = "cancelling"
    _save(path, row)
    name = row["identity"]
    if row["backend"] == "slurm":
        job = row.get("job_id") or (_slurm_ids(name, row["created"]) if row.get("submitted_intent") else None)
        if job:
            row["job_id"] = job
            state, _ = _job_state(job, name)
            if state in ACTIVE_SLURM or state is None:
                # A known numeric ID without an accounting row might already
                # have completed; verify its unique name before cancelling it.
                if _slurm_ids(name, row["created"]) != job:
                    return
                result = _run(["scancel", job], check=False)
                if result.returncode and "invalid job id" not in result.stderr.lower():
                    raise RuntimeError(result.stderr[-1000:])
                state, _ = _job_state(job, name)
                if state in ACTIVE_SLURM or state is None:
                    return
        elif row.get("submitted_intent"):
            return
    else:
        _check_daemon(row, path)
        info = _inspect(name)
        if info:
            if row.get("job_id", info["Id"]) != info["Id"]:
                raise RuntimeError("Cannot cancel mismatched container identity")
            row["job_id"] = info["Id"]
            if info["State"]["Status"] in ("running", "restarting"):
                _run(["docker", "stop", "--time", "2", info["Id"]])
            _run(["docker", "rm", info["Id"]])
        _remove_input(row)
    row["status"] = "cancelled"
    _save(path, row)
```

</details>

**依据 3 · 源码核查**：[ark/review.py:2384-2387](https://github.com/kaust-ark/ARK/blob/925e1b0798fb2e37ff04d26ab9ddb455cf2dda18/ark/review.py#L2384-L2387)

评审校验自述不从分数推断科学真相。

```text
def validate_review(snapshot, response, previous=None, *, observed=()):
    """Check references, lifecycle and delivery eligibility; never infer scientific truth from a score."""
    if not isinstance(response, dict) or response.get("revision") != snapshot["revision"]:
        raise ValueError("The review does not identify the current revision")
```

#### 缺口

- 终止证明展示方案与故障注入未实现。
  **影响**：不能声称该设计已减少重复执行或外部资源泄漏。
  **进一步探讨**：逐一核对后端故障状态与用户可见回执，比较误报和恢复负担。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 哪些研究任务适合隔离试用，什么时候应停用？

**研究主题**：采用判断

#### 完整回答

适合已有Linux、固定DSH环境和Docker经验的研究开发者，在专用profile中试一个结果可人工精确核对的小计算问题。先不用集群、外部深度研究或昂贵图像生成，目标是核对计划→测量收据→PDF→当前review→deliver的版本链。成功标准是改一处测量或稿件后旧评审不能继续交付，恢复时仍使用原会话与原结果，而且停止后Docker容器可独立确认不存在或已结束。

发现无原始测量却交付成功、评审无法解释关键结论、停用后仍有未决任务，或反复修订超出预先预算，应停止自动执行，核对后端后保留项目证据并回到手工脚本和论文审阅。当前建议是窄范围试用，不是日常自动产论文或可跳过研究者责任的安装推荐。不同宿主和模型不能直接复用本轮源码判断为运行通过。

#### 证据与依据

**依据 1 · 源码核查**：[ark/orchestrator/native_domain.py:3118-3158](https://github.com/kaust-ark/ARK/blob/925e1b0798fb2e37ff04d26ab9ddb455cf2dda18/ark/orchestrator/native_domain.py#L3118-L3158)

交付可供试验核对的硬条件。

<details>
<summary>查看原文（41行）</summary>

```text
    def deliver(self, args):
        self._check_compiled()
        snap = self._snapshot()
        record = _load(self.state_dir / "native_review.json", {})
        problems = []
        if not review.record_is_current(snap, record) or not record.get("deliverable"):
            problems.append("Independent review is missing, stale, or requires revision.")
        measurement = self.state.get("experiment") or {}
        measured = self.root / measurement.get("artifact", "")
        if (
            measurement.get("status") != "completed"
            or not measured.is_file()
            or measured.is_symlink()
            or _sha(measured) != measurement.get("sha256")
            or ("worker_measurement" in snap and (not snap["worker_measurement"]["verified"]
                or measurement.get("artifact") != snap["worker_measurement"]["expected"]))
        ):
            problems.append("Missing or changed worker measurements.")
        if self.config.get("layout_mode") == "strict":
            rendered = self.state.get("compile", {})
            proof = _load(self.state_dir / "native_citations.json", {})
            bib = self.latex_dir / "references.bib"
            cited = set(rendered.get("cited", []))
            if (
                not bib.is_file()
                or not proof.get("verified")
                or proof.get("sha256") != _sha(bib)
                or not cited
                or not cited.issubset(set(proof.get("cited", [])))
            ):
                problems.append("Verify the sources cited by this manuscript.")
        report = delivery_contract.evaluate(self.root, self.config.get("venue_pages", 4), config=self.config)
        delivery_contract.write_report(self.root, report)
        problems += [f"{x.check}: {x.detail}" for x in report.delivery_blockers(self.config)]
        problems.extend(self._strict_paper_issues())
        trace = self._research_citations()
        trace_details = {"research_citations": trace} if trace else {}
        if problems:
            return {"delivered": False, "blockers": problems, **trace_details}
        self.state.update(state="delivered", delivery_revision=snap["revision"],
                          delivery_inputs_sha256=review.delivery_inputs_digest(snap))
```

</details>

**依据 2 · 源码核查**：[integrations/dsh/index.js:158-170](https://github.com/kaust-ark/ARK/blob/925e1b0798fb2e37ff04d26ab9ddb455cf2dda18/integrations/dsh/index.js#L158-L170)

恢复必须匹配原模型与运行时。

<details>
<summary>查看原文（13行）</summary>

```text
    const selected = ctx.agentDefaultModel.currentSelection()
    const selection = { provider: selected.provider, model: selected.model }
    let checkpoint = await readJson(path)
    if (!checkpoint) {
      if (!idea) throw new Error('Project checkpoint does not exist')
      checkpoint = { version: 3, runtime: sdk.version, id: randomUUID(), owner_session_id: randomUUID(), idea, selection, ready: false }
      await writeJson(path, checkpoint)
    } else if (checkpoint.runtime && checkpoint.runtime !== sdk.version) {
      throw new Error('Resume this project with its original DSH ' + checkpoint.runtime + ' runtime.')
    } else if (checkpoint.version !== 3 || typeof checkpoint.owner_session_id !== 'string' ||
               checkpoint.selection?.model !== selection.model || checkpoint.selection?.provider !== selection.provider ||
               (idea !== undefined && (!hosted || idea !== checkpoint.idea))) {
      throw new Error('Incompatible project checkpoint or model selection')
```

</details>

**依据 3 · 源码核查**：[ark/compute/native_experiment.py:541-553](https://github.com/kaust-ark/ARK/blob/925e1b0798fb2e37ff04d26ab9ddb455cf2dda18/ark/compute/native_experiment.py#L541-L553)

本地停止可核对实际容器身份与删除。

<details>
<summary>查看原文（13行）</summary>

```text
    else:
        _check_daemon(row, path)
        info = _inspect(name)
        if info:
            if row.get("job_id", info["Id"]) != info["Id"]:
                raise RuntimeError("Cannot cancel mismatched container identity")
            row["job_id"] = info["Id"]
            if info["State"]["Status"] in ("running", "restarting"):
                _run(["docker", "stop", "--time", "2", info["Id"]])
            _run(["docker", "rm", info["Id"]])
        _remove_input(row)
    row["status"] = "cancelled"
    _save(path, row)
```

</details>

**依据 4 · 作者声明**：[integrations/dsh/README.md:59-67](https://github.com/kaust-ark/ARK/blob/925e1b0798fb2e37ff04d26ab9ddb455cf2dda18/integrations/dsh/README.md#L59-L67)

评审错误案例要求人工核对。

```text
### Independent review

A reviewer working with a verified results table can commit its proposed comparison, competing explanation and discriminating observation before it reads the paper. It can search a phrase in the rendered PDF and compare the language across sections. In the hosted dashboard, open a judgment to see its evidence or send the researcher a question about the quoted page.

In a four-page study, a reviewer accepted a mechanism that the submitted measurements did not establish. Read its cited evidence before relying on a scientific judgment.

When a revised experiment returns the same measured rows, the reviewer first sees the original question and the measurement schema. It writes a short Python reproduction for one recorded condition. The bundle freezes that program before opening the manuscript, worker source and results in the same reviewer session. The review records each recomputed value alongside the worker’s value. If the data or compute is unavailable, the review identifies the missing evidence.

In the dashboard, expand **What the reviewer checked → Experimental controls** to inspect the comparison. The local Docker or configured Apptainer science image runs the calculation offline. A Slurm project can perform this check without submitting another job.
```

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
