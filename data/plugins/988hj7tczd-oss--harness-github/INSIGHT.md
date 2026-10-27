# harness-github

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[6bb9803](https://github.com/988hj7tczd-oss/harness-github/tree/6bb9803f787b4ee4fa66f28fa8c889369ce28d2e)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/988hj7tczd-oss/harness-github) [![npm 30d 148](https://img.shields.io/static/v1?label=npm+30d&message=148&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/harness-github) [![最新发布 2026-08-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-23&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/harness-github)
<!-- END META -->

> **实现功能**：为DSH提供GitHub仓库、PR、issue、CI与评审工具，通过gh或REST读取和操作，并提供工作流指引。

> **核心亮点**：把成熟gh/REST能力包装为DSH结构工具、统一凭据路径与远程审批，减少重复命令接线；价值是集成便利而非新增GitHub原语。详见[Q02](#research-q02)。

> **风险与缺陷**：pr_prepare可在审批前git add -A并commit，与拒绝零副作用承诺冲突；REST对非幂等写也通用重试，断连后可能重复发布，合并未绑定head。均为源码路径判断，未向GitHub复现。详见[Q02](#research-q02)。

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
  - [Q01 · 谁需要GitHub工具集，从调用到交付有什么边界？](#detail-section-11)
  - [Q02 · 相对直接gh的增量和最严重授权/幂等限制是什么？](#detail-section-12)
  - [Q03 · 身份、服务和配置如何影响启动与恢复？](#detail-section-13)
  - [Q04 · 首次、持续和失败恢复成本及效果已知什么？](#detail-section-14)
  - [Q05 · 哪些设计可复用，动作收据假设如何检验？](#detail-section-15)
  - [Q06 · 当前推荐结论和停止标准是什么？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：帮助在DSH处理软件交付的人取得GitHub事实并准备操作，合格结果需对象、授权和最终状态可回读。

开发者可直接使用gh或REST并按仓库规则审阅后提交。插件减少结构接线，但不能替代权限、提交范围与发布前人工判断。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 仓库/PR/issue/搜索/发布读取 | 聚合GitHub事实 | 凭据和分页完整性需核对 |
| CI与评审反馈读取 | 查看检查、日志和评论 | 不等于GraphQL thread处置完整性 |
| PR/issue/评论/review/合并写入 | 改变GitHub对象 | 远程审批存在，非幂等重试和head绑定有缺口 |
| pr_prepare | 本地状态、提交推送与建PR | autoCommit在审批前，可能包含全工作区 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node/DSH tools与systemPrompt | 启动必需 | ESM工具和指引注册 | 版本失配可能无法加载 |
| gh已登录或REST token | 私有读取/写入必需 | GitHub身份与权限 | 公开只读可匿名，其余认证失败 |
| approval和agent上下文 | 远程写必需 | allowed-once放行 | 缺失拒绝远程写，不撤销此前本地动作 |
| 本地git工作区/远程 | pr_prepare必需 | 状态、提交和推送 | 需人工确认目录、remote及文件范围 |
| 可信apiBaseUrl | REST配置条件 | 凭据会发往该地址 | 配错地址影响凭据和请求边界 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者限制凭据范围并确认API地址 | 明确读写对象与本地目录 |
| 加载 | 安装固定包重启profile | 工具和提示注册，先做只读查询 |
| 写入 | 用户审核具体对象、内容、head与文件范围 | 不依赖当前autoCommit的全写审批承诺 |
| 恢复 | 未知结果先回读，检查本地index/提交和远端状态 | 不盲目重复非幂等动作 |

退出移除包不能撤销评论、合并或本地提交，也不自动撤销gh登录/token。任何真正操作仍需另外明确范围。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 依赖/CLI/凭据与宿主资源，金额未知 | 权限、审批、API地址和目录核查 | 复用登录不等于无需权限审计 |
| 持续使用 | 模型schema上下文、API与gh调用 | 读事实、审核写内容和结果 | 无同任务token与耗时基准 |
| 失败恢复 | 重试、回读及重复写清理 | 核对本地暂存/历史与远端未知结果 | 非幂等重复和部分成功增加排障责任 |



#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 少写命令 | 结构参数与工作流指引存在 | 模型选择正确率与端到端节时 |
| 远程审批 | 常规写调用先请求allowed-once | 本地autoCommit不在同一保护范围 |
| 反馈收集 | REST评论/review列表提供信息 | 完整GraphQL thread状态与自动处置不属当前保证 |

采用成本应包含人工审阅和回读，不把自动化次数当交付收益。

> **思考**：pr_prepare可在审批前git add -A并commit，与拒绝零副作用承诺冲突；REST对非幂等写也通用重试，断连后可能重复发布，合并未绑定head。均为源码路径判断，未向GitHub复现。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把成熟gh/REST能力包装为DSH结构工具、统一凭据路径与远程审批，减少重复命令接线；价值是集成便利而非新增GitHub原语。详见[Q02](#research-q02)。

把成熟gh/REST能力包装为DSH结构工具、统一凭据路径与远程审批，减少重复命令接线；价值是集成便利而非新增GitHub原语。详见[Q02](#research-q02)。

可借鉴的是把传输、读工具、写工具和工作流文案分开，使用结构输出与独立审批函数，并把调用信号传入网络和进程。测试存在拒绝审批时不调用client的断言，覆盖部分远程写边界；不能由此证明pr_prepare的所有前置操作无副作用，本轮未运行测试。日志redact支持部分Bearer/GitHub模式，也不能证明任意秘密绝不出现在错误中。

<a id="detail-section-5"></a>

### 1.4 主要限制

pr_prepare可在审批前git add -A并commit，与拒绝零副作用承诺冲突；REST对非幂等写也通用重试，断连后可能重复发布，合并未绑定head。均为源码路径判断，未向GitHub复现。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，暂不依赖当前审批边界做日常写操作。继续核查可从最小权限只读及本地/HTTP夹具入手，先解决审批前本地修改和未知结果重试。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持结构化GitHub工具与工作流集成；全部写前审批及恰好一次副作用不能成立。状态绑定动作收据为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、SECURITY.md、package.json、index.js、lib/github.js、lib/tools-write.js、test/tools-write.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：读取固定入口、传输、写工具和测试定义；不执行插件、真实GitHub操作或宿主冒烟，授权/重试问题为静态研究。
- 下一步：进一步探讨可从拒绝审批、本地commit失败、head变化和服务端已写但响应断连夹具入手，核对真实副作用、重复动作与恢复成本。

**分析版本**

- **仓库**：[988hj7tczd-oss/harness-github](https://github.com/988hj7tczd-oss/harness-github)
- **版本号**：0.1.0（[固定提交 6bb9803](https://github.com/988hj7tczd-oss/harness-github/tree/6bb9803f787b4ee4fa66f28fa8c889369ce28d2e)）
- **版本日期**：2026-08-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨状态绑定动作收据，先明确本地/远程操作、摘要和head再审批，未知结果先回读且不重放非幂等写；新增状态与恢复负担，未验证。详见[Q05](#research-q05)。

进一步探讨可从拒绝审批、本地commit失败、head变化和服务端已写但响应断连夹具入手，核对真实副作用、重复动作与恢复成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 504 | — | — | 5327 |
| .js | source | 5 | 2484 | 2129 | 246 | — |
| .mjs | source | 2 | 107 | 78 | 16 | — |
| .js | test | 6 | 935 | 808 | 63 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/988hj7tczd-oss/harness-github/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/988hj7tczd-oss/harness-github/issues?q=is%3Aissue+created%3A2026-09-22T04%3A55%3A43.434Z..2026-10-22T04%3A55%3A43.434Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/988hj7tczd-oss/harness-github/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T04%3A55%3A43.434Z..2026-10-22T04%3A55%3A43.434Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查GitHub连接器工具的集成贡献、审批顺序、写入恢复与采用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要GitHub工具集，从调用到交付有什么边界？

**研究主题**：场景与需求、功能与机制

#### 完整回答

适合在DSH里处理PR、issue、CI失败与评审反馈的开发者。输入是仓库和编号等结构参数，读工具取得GitHub事实，写工具执行评论、评审、合并或PR准备。合格任务应准确定位对象、在明确授权范围改变状态，并回读具体结果；展示18个工具不等于自动完成代码修改或通过评审。

入口创建GitHub client，注册github:workflow系统提示与10读/8写工具。client优先使用已登录gh；gh缺失/未登录使用REST，gh途中401才回退REST，其他错误直接抛。REST可从环境或凭据服务取token，公开只读可匿名。普通远程写先requestApproval且只接受allowed-once，再client写请求；PR准备另外操作本地git。流程是工具和指引集成，成功创建PR不等于CI和业务验收已完成。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:45-67](https://github.com/988hj7tczd-oss/harness-github/blob/6bb9803f787b4ee4fa66f28fa8c889369ce28d2e/index.js#L45-L67)

client、工作流提示与工具注册接线。

<details>
<summary>查看原文（23行）</summary>

```text
export function apply(ctx, config) {
  const client = createGitHubClient({
    config,
    logger: ctx.logger,
    // 每一步操作重新解析凭据(服务缺失返回 undefined → 匿名/失败路径)。
    resolveCredential: (ref) => {
      const credentials = ctx.get('credentials')
      return credentials ? credentials.resolve(ref) : Promise.resolve(undefined)
    },
  })

  // 系统提示 section:注入 GitHub 工作流指引(函数形式,每次组装求值)。
  // 防御:即使宿主未应用 Config 默认值(sectionOrder 缺失)也不至于注册失败。
  ctx.systemPrompt.section({
    name: 'github:workflow',
    order: config.sectionOrder ?? 160,
    text: () => buildWorkflowSection(),
  })

  // 工具注册:只读(免审批)+ 写(全部经 ctx.approval)。
  for (const tool of [...createReadTools(client), ...createWriteTools({ client, ctx })]) {
    ctx.tools.register(defineTool(tool))
  }
```

</details>

**依据 2 · 源码核查**：[lib/github.js:246-276](https://github.com/988hj7tczd-oss/harness-github/blob/6bb9803f787b4ee4fa66f28fa8c889369ce28d2e/lib/github.js#L246-L276)

gh优先、401回退和REST凭据分支。

<details>
<summary>查看原文（31行）</summary>

```text
  async request(method, path, opts = {}) {
    const { query, body, readonly = true, paginate = false, signal } = opts
    const full = appendQuery(path, query)
    if (!readonly) await this.assertCanWrite()

    if (await this.ghAuthed()) {
      try {
        return await this.#ghRequest(method, full, { body, paginate, signal, readonly })
      } catch (err) {
        // gh 认证中途失效(401)→ 置回未登录,本次改走 REST
        if (err instanceof GitHubApiError && Number(err.status) === 401) {
          this.#ghState.authed = false
          this.#log('warn', `harness-github: gh 调用 401,回退 REST: ${err.message}`)
        } else {
          throw err
        }
      }
    } else {
      this.#log('debug', 'harness-github: 使用 REST 路径(gh 不可用或未登录)')
    }

    const token = await this.getToken()
    if (!readonly && !token) {
      // assertCanWrite 后 token 消失的竞态兜底
      throw new GitHubAuthError({
        method,
        path: full,
        reason: '写操作需要凭据(token 解析为空)。',
      })
    }
    return this.#restRequest(method, full, { body, token, paginate, signal })
```

</details>

**依据 3 · 源码核查**：[lib/tools-write.js:33-61](https://github.com/988hj7tczd-oss/harness-github/blob/6bb9803f787b4ee4fa66f28fa8c889369ce28d2e/lib/tools-write.js#L33-L61)

远程写审批只接受allowed-once。

<details>
<summary>查看原文（29行）</summary>

```text
export async function requestApproval(ctx, exec, reason) {
  const approval = ctx.get('approval')
  if (!approval || typeof approval.request !== 'function') {
    throw new Error(
      `[harness-github] 写操作未获准:审批服务不可用(approval 服务缺失),已拒绝执行「${reason}」。` +
      `如需写操作,请确保宿主加载了 approval 服务。${AUTH_GUIDANCE}`,
    )
  }
  if (!exec?.agent) {
    throw new Error(
      `[harness-github] 写操作未获准:缺少 agent 上下文,无法发起人工审批,已拒绝执行「${reason}」。`,
    )
  }
  const outcome = await approval.request({
    agent: exec.agent,
    toolName: exec.name,
    callId: exec.callId,
    reason: `[harness-github] ${reason}`,
    signal: exec.signal,
  })
  if (outcome !== 'allowed-once') {
    const why = outcome === 'rejected'
      ? '已被拒绝'
      : outcome === 'cancelled'
        ? '已取消'
        : '不可用(fail-closed)'
    throw new Error(`[harness-github] 写操作未获准:审批${why},未执行任何改动(「${reason}」)。`)
  }
  return true
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 相对直接gh的增量和最严重授权/幂等限制是什么？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

贡献是把常用gh/REST操作封成结构化DSH工具，配工作流指引和审批上下文，让模型无需每次拼接命令并重复解释凭据。它不拥有新的GitHub能力，核心API、CLI和认证均来自上游；便利与安全程度必须按实际执行顺序判断。

最严重的问题是README/SECURITY声称全部写前审批且拒绝零副作用，而github_pr_prepare在审批前便可git add -A并commit。autoCommit=true是工具参数，不等价于独立人工审批，拒绝后本地提交/暂存可能已改变；commit失败也可能留下暂存状态。稍后一次审批只覆盖远程push/建PR，不能追溯覆盖已发生的本地动作。

REST重试对所有method共用，网络异常或429/5xx会重发init，没有区分POST评论/建issue等非幂等写。若服务端已写入但响应丢失，重试可能重复发布。创建PR前查已有只减少正常重复，不是原子幂等键。合并也没有绑定审批时head SHA，审批后对象变化的窗口仍在。以上为源码推断，未向GitHub复现。

#### 证据与依据

**依据 1 · 源码核查**：[lib/tools-write.js:452-473](https://github.com/988hj7tczd-oss/harness-github/blob/6bb9803f787b4ee4fa66f28fa8c889369ce28d2e/lib/tools-write.js#L452-L473)

autoCommit在远程审批前修改暂存和历史。

<details>
<summary>查看原文（22行）</summary>

```text
      async execute(args, exec) {
        const [owner, repo] = splitRepo(args.repo)
        const dir = resolveDir(args, exec)
        // 1) 只读:检查是否为 git 仓库并解析当前分支
        const check = await git(dir, ['rev-parse', '--is-inside-work-tree'], { signal: exec.signal })
        if (check.code !== 0) {
          throw new Error(`[harness-github] ${dir} 不是 git 工作区。请传 dir 指向本地仓库,或先 git init/克隆。`)
        }
        const branch = (await git(dir, ['rev-parse', '--abbrev-ref', 'HEAD'], { signal: exec.signal })).stdout.trim()

        // 2) 工作区未提交改动:autoCommit 才动本地盘(仍属本地,不进审批;出错即停,无副作用残留由 git 保证)
        let dirty = (await git(dir, ['status', '--porcelain'], { signal: exec.signal })).stdout.trim().length > 0
        const guidanceParts = []
        if (dirty) {
          if (args.autoCommit) {
            if (!args.commitMessage) {
              throw new Error('[harness-github] autoCommit=true 但未提供 commitMessage,已停止(未做任何改动)。请先提交或提供提交信息。')
            }
            const add = await git(dir, ['add', '-A'], { signal: exec.signal })
            if (add.code !== 0) throw new Error(`[harness-github] git add 失败:${add.stderr.trim()}`)
            const commit = await git(dir, ['commit', '-m', args.commitMessage], { signal: exec.signal })
            if (commit.code !== 0) throw new Error(`[harness-github] git commit 失败:${commit.stderr.trim()}`)
```

</details>

**依据 2 · 源码核查**：[lib/tools-write.js:555-576](https://github.com/988hj7tczd-oss/harness-github/blob/6bb9803f787b4ee4fa66f28fa8c889369ce28d2e/lib/tools-write.js#L555-L576)

审批在本地commit之后，覆盖推送及建PR。

<details>
<summary>查看原文（22行）</summary>

```text
        // 7) 一次审批覆盖本次全部远程写操作(推送 + 创建 PR);拒绝则零副作用
        const actions = []
        if (needPush) actions.push(`推送 ${branch} → ${owner}/${repo}${upstream ? '' : '(首次 -u)'}`)
        if (needPR) actions.push(`创建 PR:${base} ← ${branch}「${args.title ?? `${branch}: 变更`}」`)
        await requestApproval(ctx, exec, `准备 PR:${actions.join('; ')}`)

        // 8) 推送
        if (needPush) {
          const pushArgs = upstream ? ['push'] : ['push', '-u', 'origin', branch]
          const push = await git(dir, pushArgs, { signal: exec.signal })
          if (push.code !== 0) throw new Error(`[harness-github] git push 失败:${push.stderr.trim()}`)
        }

        // 9) 创建 PR
        if (needPR) {
          const created = await client.createPR(owner, repo, {
            title: args.title ?? `${branch}: 变更`,
            body: args.body,
            base,
            head: branch,
            draft: false,
          }, { signal: exec.signal })
```

</details>

**依据 3 · 源码核查**：[lib/github.js:313-329](https://github.com/988hj7tczd-oss/harness-github/blob/6bb9803f787b4ee4fa66f28fa8c889369ce28d2e/lib/github.js#L313-L329)

所有REST方法共享同一重试函数。

<details>
<summary>查看原文（17行）</summary>

```text
  /** REST 模式:fetch + Bearer token + 指数退避。 */
  async #restRequest(method, full, { body, token, paginate, signal }) {
    const url = `${this.#config.apiBaseUrl}${full}`
    const headers = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    }
    const init = {
      method,
      headers,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      signal,
    }

    const response = await this.#fetchWithRetry(url, init, signal)
```

</details>

**依据 4 · 源码核查**：[lib/github.js:366-398](https://github.com/988hj7tczd-oss/harness-github/blob/6bb9803f787b4ee4fa66f28fa8c889369ce28d2e/lib/github.js#L366-L398)

网络/状态重试没有按method限制。

<details>
<summary>查看原文（33行）</summary>

```text
  /** fetch + 429/5xx 指数退避;网络错误在重试耗尽后转成 GitHubApiError。 */
  async #fetchWithRetry(url, init, signal) {
    let attempt = 0
    for (;;) {
      attempt += 1
      let response
      try {
        response = await this.#fetch(url, init)
      } catch (err) {
        if (signal?.aborted) throw abortError()
        const network = err instanceof TypeError || /fetch failed|ENOTFOUND|ECONNREFUSED/i.test(String(err?.message ?? err))
        if (network && attempt < MAX_ATTEMPTS) {
          await sleep(backoffDelay(attempt), signal)
          continue
        }
        throw new GitHubApiError({
          method: init.method ?? 'GET',
          path: url.replace(this.#config.apiBaseUrl, ''),
          status: 'network',
          kind: 'rest',
          raw: err?.message ?? String(err),
        })
      }
      if (RETRYABLE_STATUS.has(response.status) && attempt < MAX_ATTEMPTS) {
        const retryAfter = Number(response.headers.get('retry-after'))
        const delay = Number.isFinite(retryAfter) && retryAfter > 0
          ? Math.min(retryAfter * 1000, BACKOFF_MAX_MS)
          : backoffDelay(attempt)
        this.#log('warn', `harness-github: HTTP ${response.status} 重试(${attempt}/${MAX_ATTEMPTS}),${delay}ms 后`)
        await sleep(delay, signal)
        continue
      }
      return response
```

</details>

**依据 5 · 源码核查**：[lib/github.js:673-686](https://github.com/988hj7tczd-oss/harness-github/blob/6bb9803f787b4ee4fa66f28fa8c889369ce28d2e/lib/github.js#L673-L686)

合并请求未提供head SHA，删分支失败被吞。

<details>
<summary>查看原文（14行）</summary>

```text
  /** 合并 PR(merge/squash/rebase),可选删除源分支。 */
  async mergePR(owner, repo, number, { method = 'merge', deleteBranch = false }, opts) {
    const result = await this.request('PUT', `/repos/${owner}/${repo}/pulls/${number}/merge`, {
      body: { merge_method: method },
      readonly: false,
      ...opts,
    })
    if (deleteBranch && result?.merged) {
      const branch = (await this.pr(owner, repo, number, opts))?.head?.ref
      if (branch) {
        await this.request('DELETE', `/repos/${owner}/${repo}/git/refs/heads/${branch}`, {
          readonly: false,
          ...opts,
        }).catch(() => undefined) // 删除失败不阻断合并结果
```

</details>

**依据 6 · 作者声明**：[SECURITY.md:13-25](https://github.com/988hj7tczd-oss/harness-github/blob/6bb9803f787b4ee4fa66f28fa8c889369ce28d2e/SECURITY.md#L13-L25)

作者安全承诺需按实际顺序收窄。

<details>
<summary>查看原文（13行）</summary>

```text
`harness-github` is a DeepSeek Harness plugin whose tools drive the GitHub
API. The following invariants are enforced:

- **Approval-gated writes** — all 8 write tools call `ctx.approval.request()`
  before executing. If the approval service is missing, or the policy is
  `never`, or the user rejects, the tool fails **with zero side effects**.
- **Token hygiene** — credentials are only used in memory for a single
  operation (REST `Authorization` header via `gh` or `GITHUB_TOKEN`). Tokens
  are never written to profile config, never committed, and log output is
  defensively redacted.
- **Read-only by default** — the 10 read tools make no state changes. Public
  repositories work anonymously; private repositories additionally require
  `gh auth login` or `GITHUB_TOKEN`.
```

</details>

#### 缺口

- 断连后GitHub写入未知结果的实际重复率未验证。
  **影响**：不能把一次审批理解为恰好一次远程副作用。
  **进一步探讨**：可先用受控HTTP夹具模拟提交后断连，再以回读或幂等键验证替代方案。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 身份、服务和配置如何影响启动与恢复？

**研究主题**：依赖、兼容与流程

#### 完整回答

包要求Node>=18、schemastery及DSH tools/system-prompt等peer；credentials和user-approval标为可选。读公开库可以匿名，私库和写操作需gh身份或token，权限仍取决于GitHub凭据范围。缺审批服务时远程写拒绝，但本地autoCommit在其前，不能把可选approval缺失理解为完全无写副作用。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node/DSH tools与systemPrompt | 启动必需 | ESM工具和指引注册 | 版本失配可能无法加载 |
| gh已登录或REST token | 私有读取/写入必需 | GitHub身份与权限 | 公开只读可匿名，其余认证失败 |
| approval和agent上下文 | 远程写必需 | allowed-once放行 | 缺失拒绝远程写，不撤销此前本地动作 |
| 本地git工作区/远程 | pr_prepare必需 | 状态、提交和推送 | 需人工确认目录、remote及文件范围 |
| 可信apiBaseUrl | REST配置条件 | 凭据会发往该地址 | 配错地址影响凭据和请求边界 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者限制凭据范围并确认API地址 | 明确读写对象与本地目录 |
| 加载 | 安装固定包重启profile | 工具和提示注册，先做只读查询 |
| 写入 | 用户审核具体对象、内容、head与文件范围 | 不依赖当前autoCommit的全写审批承诺 |
| 恢复 | 未知结果先回读，检查本地index/提交和远端状态 | 不盲目重复非幂等动作 |

退出移除包不能撤销评论、合并或本地提交，也不自动撤销gh登录/token。任何真正操作仍需另外明确范围。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:39-60](https://github.com/988hj7tczd-oss/harness-github/blob/6bb9803f787b4ee4fa66f28fa8c889369ce28d2e/package.json#L39-L60)

Node、依赖和可选peer声明。

<details>
<summary>查看原文（22行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "dependencies": {
    "@deepseek-ai/schemastery": "^3.0.0"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-credentials": ">=0.1.0-rc.6 <0.2.0",
    "@deepseek-ai/dsh-system-prompt": ">=0.1.0-rc.6 <0.2.0",
    "@deepseek-ai/dsh-tools": ">=0.1.0-rc.6 <0.2.0",
    "@deepseek-ai/dsh-user-approval": ">=0.1.0-rc.6 <0.2.0"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/dsh-credentials": {
      "optional": true
    },
    "@deepseek-ai/dsh-user-approval": {
      "optional": true
    }
```

</details>

**依据 2 · 源码核查**：[index.js:33-38](https://github.com/988hj7tczd-oss/harness-github/blob/6bb9803f787b4ee4fa66f28fa8c889369ce28d2e/index.js#L33-L38)

API base可配置。

```text
export const Config = z.object({
  /** system-prompt section 的排序位置(越小越靠前)。 */
  sectionOrder: z.number().default(160),
  /** GitHub REST API 基础地址(二期支持 Enterprise host,现在保留默认)。 */
  apiBaseUrl: z.string().default('https://api.github.com'),
})
```

**依据 3 · 源码核查**：[lib/github.js:314-326](https://github.com/988hj7tczd-oss/harness-github/blob/6bb9803f787b4ee4fa66f28fa8c889369ce28d2e/lib/github.js#L314-L326)

REST将Bearer发往配置base。

<details>
<summary>查看原文（13行）</summary>

```text
  async #restRequest(method, full, { body, token, paginate, signal }) {
    const url = `${this.#config.apiBaseUrl}${full}`
    const headers = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    }
    const init = {
      method,
      headers,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      signal,
```

</details>

**依据 4 · 源码核查**：[lib/tools-write.js:77-80](https://github.com/988hj7tczd-oss/harness-github/blob/6bb9803f787b4ee4fa66f28fa8c889369ce28d2e/lib/tools-write.js#L77-L80)

工作目录可由参数、会话或process.cwd选择。

```text
/** 解析工作目录:args.dir → exec.agent session cwd → process.cwd()。 */
function resolveDir(args, exec) {
  const dir = args.dir ?? exec?.agent?.session?.header?.cwd ?? process.cwd()
  return String(dir)
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续和失败恢复成本及效果已知什么？

**研究主题**：效果与总成本

#### 完整回答

计量单位应是一条反馈、issue或PR在明确范围内正确办结，而非一次工具调用成功。系统提示与18项工具schema会增加模型上下文，真实token和选择准确性未计量；API速率、gh子进程、分页与重试会增加请求及延迟。现有封装未提供端到端预算证明。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 依赖/CLI/凭据与宿主资源，金额未知 | 权限、审批、API地址和目录核查 | 复用登录不等于无需权限审计 |
| 持续使用 | 模型schema上下文、API与gh调用 | 读事实、审核写内容和结果 | 无同任务token与耗时基准 |
| 失败恢复 | 重试、回读及重复写清理 | 核对本地暂存/历史与远端未知结果 | 非幂等重复和部分成功增加排障责任 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 少写命令 | 结构参数与工作流指引存在 | 模型选择正确率与端到端节时 |
| 远程审批 | 常规写调用先请求allowed-once | 本地autoCommit不在同一保护范围 |
| 反馈收集 | REST评论/review列表提供信息 | 完整GraphQL thread状态与自动处置不属当前保证 |

采用成本应包含人工审阅和回读，不把自动化次数当交付收益。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:56-67](https://github.com/988hj7tczd-oss/harness-github/blob/6bb9803f787b4ee4fa66f28fa8c889369ce28d2e/index.js#L56-L67)

系统提示和全部工具会加入模型交互面。

<details>
<summary>查看原文（12行）</summary>

```text
  // 系统提示 section:注入 GitHub 工作流指引(函数形式,每次组装求值)。
  // 防御:即使宿主未应用 Config 默认值(sectionOrder 缺失)也不至于注册失败。
  ctx.systemPrompt.section({
    name: 'github:workflow',
    order: config.sectionOrder ?? 160,
    text: () => buildWorkflowSection(),
  })

  // 工具注册:只读(免审批)+ 写(全部经 ctx.approval)。
  for (const tool of [...createReadTools(client), ...createWriteTools({ client, ctx })]) {
    ctx.tools.register(defineTool(tool))
  }
```

</details>

**依据 2 · 源码核查**：[lib/github.js:402-416](https://github.com/988hj7tczd-oss/harness-github/blob/6bb9803f787b4ee4fa66f28fa8c889369ce28d2e/lib/github.js#L402-L416)

后续页失败break返回部分列表，未提供完整性收据。

<details>
<summary>查看原文（15行）</summary>

```text
  /** 逐页聚合(Link rel=next)。 */
  async #paginateRest(firstUrl, firstData, linkHeader, init, signal) {
    const items = [...firstData]
    let nextUrl = parseNextLink(linkHeader)
    while (nextUrl) {
      const res = await this.#fetchWithRetry(nextUrl, init, signal)
      const text = await res.text().catch(() => '')
      let page
      try { page = JSON.parse(text) } catch { break }
      if (!res.ok) break
      if (!Array.isArray(page)) break
      items.push(...page)
      nextUrl = parseNextLink(res.headers.get('link'))
    }
    return items
```

</details>

**依据 3 · 源码核查**：[lib/github.js:366-398](https://github.com/988hj7tczd-oss/harness-github/blob/6bb9803f787b4ee4fa66f28fa8c889369ce28d2e/lib/github.js#L366-L398)

失败重试增加调用/等待及未知结果风险。

<details>
<summary>查看原文（33行）</summary>

```text
  /** fetch + 429/5xx 指数退避;网络错误在重试耗尽后转成 GitHubApiError。 */
  async #fetchWithRetry(url, init, signal) {
    let attempt = 0
    for (;;) {
      attempt += 1
      let response
      try {
        response = await this.#fetch(url, init)
      } catch (err) {
        if (signal?.aborted) throw abortError()
        const network = err instanceof TypeError || /fetch failed|ENOTFOUND|ECONNREFUSED/i.test(String(err?.message ?? err))
        if (network && attempt < MAX_ATTEMPTS) {
          await sleep(backoffDelay(attempt), signal)
          continue
        }
        throw new GitHubApiError({
          method: init.method ?? 'GET',
          path: url.replace(this.#config.apiBaseUrl, ''),
          status: 'network',
          kind: 'rest',
          raw: err?.message ?? String(err),
        })
      }
      if (RETRYABLE_STATUS.has(response.status) && attempt < MAX_ATTEMPTS) {
        const retryAfter = Number(response.headers.get('retry-after'))
        const delay = Number.isFinite(retryAfter) && retryAfter > 0
          ? Math.min(retryAfter * 1000, BACKOFF_MAX_MS)
          : backoffDelay(attempt)
        this.#log('warn', `harness-github: HTTP ${response.status} 重试(${attempt}/${MAX_ATTEMPTS}),${delay}ms 后`)
        await sleep(delay, signal)
        continue
      }
      return response
```

</details>

#### 缺口

- 没有同任务与直接gh流程对照的耗时、token和错误率。
  **影响**：无法计算单位合格交付成本或声称更高效。
  **进一步探讨**：可先用离线任务和mock GitHub比较命令错误、审批次数及复核人时，再决定是否做真实受控实验。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些设计可复用，动作收据假设如何检验？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

可借鉴的是把传输、读工具、写工具和工作流文案分开，使用结构输出与独立审批函数，并把调用信号传入网络和进程。测试存在拒绝审批时不调用client的断言，覆盖部分远程写边界；不能由此证明pr_prepare的所有前置操作无副作用，本轮未运行测试。日志redact支持部分Bearer/GitHub模式，也不能证明任意秘密绝不出现在错误中。

由Q02可提出未验证的“状态绑定动作收据”假设。把本地暂存/提交、远端push和PR变更拆成具体计划，绑定工作区摘要、head SHA、正文哈希与单操作ID，经审批再写；响应未知时只查回读结果，非幂等动作不自动重放。相对当前一次审批加通用重试，增量是可审查状态与副作用所有权。代价是更多状态保存、失败分支和人类决策。最小夹具可模拟拒绝、head变动、commit失败、写后断连，比较未授权本地变化、重复评论和恢复操作数；若仍不能区分未知/未执行或成本过大，假设应修正。

#### 证据与依据

**依据 1 · 源码核查**：[lib/tools-write.js:33-61](https://github.com/988hj7tczd-oss/harness-github/blob/6bb9803f787b4ee4fa66f28fa8c889369ce28d2e/lib/tools-write.js#L33-L61)

独立审批封装与信号传递。

<details>
<summary>查看原文（29行）</summary>

```text
export async function requestApproval(ctx, exec, reason) {
  const approval = ctx.get('approval')
  if (!approval || typeof approval.request !== 'function') {
    throw new Error(
      `[harness-github] 写操作未获准:审批服务不可用(approval 服务缺失),已拒绝执行「${reason}」。` +
      `如需写操作,请确保宿主加载了 approval 服务。${AUTH_GUIDANCE}`,
    )
  }
  if (!exec?.agent) {
    throw new Error(
      `[harness-github] 写操作未获准:缺少 agent 上下文,无法发起人工审批,已拒绝执行「${reason}」。`,
    )
  }
  const outcome = await approval.request({
    agent: exec.agent,
    toolName: exec.name,
    callId: exec.callId,
    reason: `[harness-github] ${reason}`,
    signal: exec.signal,
  })
  if (outcome !== 'allowed-once') {
    const why = outcome === 'rejected'
      ? '已被拒绝'
      : outcome === 'cancelled'
        ? '已取消'
        : '不可用(fail-closed)'
    throw new Error(`[harness-github] 写操作未获准:审批${why},未执行任何改动(「${reason}」)。`)
  }
  return true
```

</details>

**依据 2 · 源码核查**：[test/tools-write.test.js:77-105](https://github.com/988hj7tczd-oss/harness-github/blob/6bb9803f787b4ee4fa66f28fa8c889369ce28d2e/test/tools-write.test.js#L77-L105)

已读拒绝和缺审批的测试定义，只覆盖其所调用工具路径。

<details>
<summary>查看原文（29行）</summary>

```text
test('审批 rejected → 零副作用(无任何写调用)', async () => {
  const mock = mockClient()
  const stub = approvalStub('rejected')
  const ctx = stubCtx({ approval: stub.service })
  const def = createWriteTools({ client: asClient(mock), ctx }).find((d) => d.name === 'github_pr_create')
  await assert.rejects(
    () => def.execute({ repo: 'o/r', title: 'T', head: 'feat' }, fakeExec({ agent: {} })),
    /未获准/,
  )
  const writes = mock.calls.filter(([n]) => n !== 'listPRsByHead' && n !== 'repo')
  assert.equal(writes.length, 0, `拒绝后不应有任何写调用:${JSON.stringify(writes)}`)
  assert.equal(stub.requests.length, 1)
})

test('审批服务缺失 → 直接拒绝且不调用写', async () => {
  const mock = mockClient()
  const ctx = stubCtx() // 无 approval
  const def = createWriteTools({ client: asClient(mock), ctx }).find((d) => d.name === 'github_issue_comment')
  await assert.rejects(
    () => def.execute({ repo: 'o/r', number: 1, body: 'hi' }, fakeExec({ agent: {} })),
    /审批服务不可用/,
  )
  assert.equal(mock.calls.filter(([n]) => n === 'commentIssue').length, 0)
})

test('exec.agent 缺失 → 直接拒绝', async () => {
  const mock = mockClient()
  const stub = approvalStub()
  const ctx = stubCtx({ approval: stub.service })
```

</details>

**依据 3 · 源码核查**：[lib/github.js:789-793](https://github.com/988hj7tczd-oss/harness-github/blob/6bb9803f787b4ee4fa66f28fa8c889369ce28d2e/lib/github.js#L789-L793)

日志脱敏仅支持列出的模式。

```text
function redact(value) {
  if (typeof value !== 'string') return value
  return value.replace(/(Bearer\s+)[A-Za-z0-9_\-.]{8,}/g, '$1***')
    .replace(/(ghp_[A-Za-z0-9]+|github_pat_[A-Za-z0-9_]+)/g, '***')
}
```

**依据 4 · 源码核查**：[lib/tools-write.js:452-473](https://github.com/988hj7tczd-oss/harness-github/blob/6bb9803f787b4ee4fa66f28fa8c889369ce28d2e/lib/tools-write.js#L452-L473)

本地动作提供状态绑定需求的直接依据。

<details>
<summary>查看原文（22行）</summary>

```text
      async execute(args, exec) {
        const [owner, repo] = splitRepo(args.repo)
        const dir = resolveDir(args, exec)
        // 1) 只读:检查是否为 git 仓库并解析当前分支
        const check = await git(dir, ['rev-parse', '--is-inside-work-tree'], { signal: exec.signal })
        if (check.code !== 0) {
          throw new Error(`[harness-github] ${dir} 不是 git 工作区。请传 dir 指向本地仓库,或先 git init/克隆。`)
        }
        const branch = (await git(dir, ['rev-parse', '--abbrev-ref', 'HEAD'], { signal: exec.signal })).stdout.trim()

        // 2) 工作区未提交改动:autoCommit 才动本地盘(仍属本地,不进审批;出错即停,无副作用残留由 git 保证)
        let dirty = (await git(dir, ['status', '--porcelain'], { signal: exec.signal })).stdout.trim().length > 0
        const guidanceParts = []
        if (dirty) {
          if (args.autoCommit) {
            if (!args.commitMessage) {
              throw new Error('[harness-github] autoCommit=true 但未提供 commitMessage,已停止(未做任何改动)。请先提交或提供提交信息。')
            }
            const add = await git(dir, ['add', '-A'], { signal: exec.signal })
            if (add.code !== 0) throw new Error(`[harness-github] git add 失败:${add.stderr.trim()}`)
            const commit = await git(dir, ['commit', '-m', args.commitMessage], { signal: exec.signal })
            if (commit.code !== 0) throw new Error(`[harness-github] git commit 失败:${commit.stderr.trim()}`)
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 当前推荐结论和停止标准是什么？

**研究主题**：采用判断

#### 完整回答

推荐observe。读工具和GitHub工作流封装有明确用途，但当前把有远程写权限、合并能力与本地autoCommit放在同一套默认工具面，而安全文档的零副作用承诺不成立。不能向普通用户推荐依赖这条审批边界进行日常写操作，也不能把通用网络重试当写入可靠性保证。

继续研究可先限制在只读且最小权限身份，复核完整分页、CI日志和评论源，再用本地/HTTP夹具核对审批前修改与写后断连。若拒绝后index/历史已变化，出现重复发布，审批head与实际合并不同，或API地址不受信，应停止写流程并核对真实状态。修正授权顺序及非幂等恢复、建立版本绑定证据后才有理由重新评估trial。关键依据Q02，配置与退出依据Q03。

#### 证据与依据

**依据 1 · 源码核查**：[lib/tools-write.js:462-473](https://github.com/988hj7tczd-oss/harness-github/blob/6bb9803f787b4ee4fa66f28fa8c889369ce28d2e/lib/tools-write.js#L462-L473)

接受autoCommit会在审批前改变本地状态。

<details>
<summary>查看原文（12行）</summary>

```text
        // 2) 工作区未提交改动:autoCommit 才动本地盘(仍属本地,不进审批;出错即停,无副作用残留由 git 保证)
        let dirty = (await git(dir, ['status', '--porcelain'], { signal: exec.signal })).stdout.trim().length > 0
        const guidanceParts = []
        if (dirty) {
          if (args.autoCommit) {
            if (!args.commitMessage) {
              throw new Error('[harness-github] autoCommit=true 但未提供 commitMessage,已停止(未做任何改动)。请先提交或提供提交信息。')
            }
            const add = await git(dir, ['add', '-A'], { signal: exec.signal })
            if (add.code !== 0) throw new Error(`[harness-github] git add 失败:${add.stderr.trim()}`)
            const commit = await git(dir, ['commit', '-m', args.commitMessage], { signal: exec.signal })
            if (commit.code !== 0) throw new Error(`[harness-github] git commit 失败:${commit.stderr.trim()}`)
```

</details>

**依据 2 · 源码核查**：[lib/github.js:366-398](https://github.com/988hj7tczd-oss/harness-github/blob/6bb9803f787b4ee4fa66f28fa8c889369ce28d2e/lib/github.js#L366-L398)

通用重试影响非幂等写。

<details>
<summary>查看原文（33行）</summary>

```text
  /** fetch + 429/5xx 指数退避;网络错误在重试耗尽后转成 GitHubApiError。 */
  async #fetchWithRetry(url, init, signal) {
    let attempt = 0
    for (;;) {
      attempt += 1
      let response
      try {
        response = await this.#fetch(url, init)
      } catch (err) {
        if (signal?.aborted) throw abortError()
        const network = err instanceof TypeError || /fetch failed|ENOTFOUND|ECONNREFUSED/i.test(String(err?.message ?? err))
        if (network && attempt < MAX_ATTEMPTS) {
          await sleep(backoffDelay(attempt), signal)
          continue
        }
        throw new GitHubApiError({
          method: init.method ?? 'GET',
          path: url.replace(this.#config.apiBaseUrl, ''),
          status: 'network',
          kind: 'rest',
          raw: err?.message ?? String(err),
        })
      }
      if (RETRYABLE_STATUS.has(response.status) && attempt < MAX_ATTEMPTS) {
        const retryAfter = Number(response.headers.get('retry-after'))
        const delay = Number.isFinite(retryAfter) && retryAfter > 0
          ? Math.min(retryAfter * 1000, BACKOFF_MAX_MS)
          : backoffDelay(attempt)
        this.#log('warn', `harness-github: HTTP ${response.status} 重试(${attempt}/${MAX_ATTEMPTS}),${delay}ms 后`)
        await sleep(delay, signal)
        continue
      }
      return response
```

</details>

**依据 3 · 源码核查**：[lib/github.js:673-679](https://github.com/988hj7tczd-oss/harness-github/blob/6bb9803f787b4ee4fa66f28fa8c889369ce28d2e/lib/github.js#L673-L679)

合并未绑定head。

```text
  /** 合并 PR(merge/squash/rebase),可选删除源分支。 */
  async mergePR(owner, repo, number, { method = 'merge', deleteBranch = false }, opts) {
    const result = await this.request('PUT', `/repos/${owner}/${repo}/pulls/${number}/merge`, {
      body: { merge_method: method },
      readonly: false,
      ...opts,
    })
```

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
