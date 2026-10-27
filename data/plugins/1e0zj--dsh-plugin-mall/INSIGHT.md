# dsh-plugin-mall

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[d38485a](https://github.com/1e0zj/dsh-plugin-mall/tree/d38485accdf8b29945c82311ce396ebef57058f1)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1e0zj/dsh-plugin-mall) [![npm 30d 1,485](https://img.shields.io/static/v1?label=npm+30d&message=1%2C485&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@1e0zj/dsh-plugin-mall) [![最新发布 2026-08-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@1e0zj/dsh-plugin-mall)
<!-- END META -->

> **实现功能**：在DSH中搜索GitHub插件、查看兼容预检，并通过后台任务安装、更新或移除profile插件。

> **核心亮点**：将物化预检、profile快照和绑定材料的一次批准接入发现/安装，较手工add提供具体兼容与恢复线索；包管理与loader来自上游，徽章不是安全审查。详见[Q02](#research-q02)。

> **风险与缺陷**：普通web启动在市场自身加载时可能静态commit并删除快照，后序插件失败便失自动回退件；guard存活窗口仍非核心功能验收，源码与作者已知#24一致。详见[Q03](#research-q03)。

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
  - [Q01 · 谁需要开放插件市场，搜索怎样成为安装任务？](#detail-section-11)
  - [Q02 · 比手工dsh plugin add新增什么？](#detail-section-12)
  - [Q03 · 哪里最会使安全安装或自动回滚承诺失效？](#detail-section-13)
  - [Q04 · 依赖、用户决策与恢复退出流程是什么？](#detail-section-14)
  - [Q05 · 三阶段成本和效果怎样计量？](#detail-section-15)
  - [Q06 · 工程机制可复用什么，启动验收收据假设怎样证伪？](#detail-section-16)
  - [Q07 · 什么人可试用，哪些条件必须停止？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：供希望集中发现/管理社区插件的用户和维护者，合格结果需重启后目标profile功能可用且失败可恢复。

用户可用GitHub目录及dsh plugin add/remove手工管理profile。市场减少发现和预检接线，但保留候选审查、脚本授权和重启后功能验收责任。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 搜索/信息 | 发现topic候选与manifest分类 | 不是代码安全或效果认证 |
| 兼容预检 | 物化候选比较profile组合 | 静态检查不等运行验收 |
| 后台安装/移除 | 跟踪包变更与脚本批准 | job开始不等完成，需明确用户批准 |
| guard启动/恢复 | 保存pending与失败回退线索 | 普通web已知早commit，存活窗口非功能保证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH tools/jobs/loader/systemPrompt | 启动必需 | 工具、后台任务和加载 | 宽peer不代表所有版本兼容 |
| GitHub/raw/CDN与registry | 发现/解析必需 | 获取候选manifest与包 | 查询失败或缓存unknown，不补作安全结论 |
| pnpm、DSH CLI和profile写权限 | 安装必需 | 预检/正式包变更 | 失败需核对快照及node_modules重建 |
| 用户明确警告/脚本批准 | 高风险分支必需 | 允许指定报告与脚本代码 | 不能由Agent替用户设置accept/allow |
| guard launch与profile备份 | 首次重启保护条件 | 避免已知早commit路径 | 普通web启动后序失败可能失回退件 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户固定目标profile并保留独立备份 | 真实运行/安装profile明确 |
| 发现/预检 | 查看候选来源、报告及物化产物 | 不把徽章当安全审查 |
| 安装 | 用户确认具体警告/脚本，跟踪后台job | 指纹/报告改变需重新判断 |
| 重启/恢复 | 首次用guard路径，核对最终加载和功能 | 不只依据进程存活，失败先查pending与备份 |
| 退出 | 移除候选/市场并检查profile与快照 | 文件回退不一定等node_modules已恢复 |

本轮不安装候选、不重启宿主、不触发脚本批准。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 市场/包管理环境、网络与备份空间，金额未知 | 配profile、审查来源和恢复路径 | 未计部署耗时 |
| 持续使用 | 候选验证、预检及正式安装流量/磁盘 | 理解冲突、批准脚本和重启验收 | CDN/API失败与缓存影响耗时 |
| 失败恢复 | 快照、node_modules重建与重复安装 | 查日志/pending、后序加载和手工恢复 | 早commit可使快照缺失，恢复成本未知 |



#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 发现范围 | topic发现加manifest过滤 | 完整生态覆盖与候选质量 |
| 减少冲突 | 物化预检和静态profile比较 | 真实宿主失败率下降多少 |
| 降低错误批准 | owner/指纹/报告token绑定 | 人是否理解披露、仍有多少误判 |

Stars与manifest通过率是发现背景，不是用户收益。比较需把批准、重启、失败修复及退出全人时算入，而不只比较点击数。

> **思考**：普通web启动在市场自身加载时可能静态commit并删除快照，后序插件失败便失自动回退件；guard存活窗口仍非核心功能验收，源码与作者已知#24一致。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将物化预检、profile快照和绑定材料的一次批准接入发现/安装，较手工add提供具体兼容与恢复线索；包管理与loader来自上游，徽章不是安全审查。详见[Q02](#research-q02)。

将物化预检、profile快照和绑定材料的一次批准接入发现/安装，较手工add提供具体兼容与恢复线索；包管理与loader来自上游，徽章不是安全审查。详见[Q02](#research-q02)。

可复用的是opaque token绑定owner/surface、一次性消费、报告摘要和profile指纹核对；它把批准从布尔开关收窄到具体材料。隔离安装、pending与rollback结构让失败恢复有持久状态，取消独立分流避免把用户中断写成技术阻断。代价是状态机、缓存、磁盘快照和跨进程重启协议复杂，错误提交点尤其重要；源码内有大量合成自检，但本轮未执行，不能称真实验收。

<a id="detail-section-5"></a>

### 1.4 主要限制

普通web启动在市场自身加载时可能静态commit并删除快照，后序插件失败便失自动回退件；guard存活窗口仍非核心功能验收，源码与作者已知#24一致。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

能备份profile并理解guard重启的维护者可在可丢弃环境小范围试用，先只读发现再评估已审查候选；报告/脚本不清或快照提前消失就停止后续安装。详见[Q07](#research-q07)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持开放发现与防御性安装状态机贡献；静态通过和进程存活不等完整宿主验收。完整启动收据为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.js、src/github.js、src/guard.js、src/cli.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定入口、发现身份、隔离预检、token和pending/guard提交路径；未安装候选、执行自检或重启宿主。
- 下一步：进一步探讨可从正常/冲突/脚本/后序失败候选夹具入手，比较报告绑定、真实加载、快照保留、可恢复比例和完整人时。

**分析版本**

- **仓库**：[1e0zj/dsh-plugin-mall](https://github.com/1e0zj/dsh-plugin-mall)
- **版本号**：0.4.17（[固定提交 d38485a](https://github.com/1e0zj/dsh-plugin-mall/tree/d38485accdf8b29945c82311ce396ebef57058f1)）
- **版本日期**：2026-08-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨完整启动收据，分开loader完成、功能回读和存活窗口，保留回退目标直到真实提交点；需要宿主事件与存储责任，未验证。详见[Q06](#research-q06)。

进一步探讨可从正常/冲突/脚本/后序失败候选夹具入手，比较报告绑定、真实加载、快照保留、可恢复比例和完整人时。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 125 | 75 | 32 | — |
| .md | source | 4 | 1720 | — | — | 24282 |
| .js | source | 8 | 20469 | 15087 | 4530 | — |

</details>

**活跃度**

[![Issue 未关闭 10](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=10&color=737b86&logo=github)](https://github.com/1e0zj/dsh-plugin-mall/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/1e0zj/dsh-plugin-mall/issues?q=is%3Aissue+created%3A2026-09-22T05%3A10%3A32.661Z..2026-10-22T05%3A10%3A32.661Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/1e0zj/dsh-plugin-mall/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A10%3A32.661Z..2026-10-22T05%3A10%3A32.661Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查开放插件市场发现、预检、批准与重启恢复的增量和保证边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要开放插件市场，搜索怎样成为安装任务？

**研究主题**：场景与需求、功能与机制

#### 完整回答

适合希望在DSH中发现和管理社区插件、又不想逐个手工编辑profile的用户及维护者。输入是搜索词或明确安装spec/profile，交付是可辨身份的候选、兼容预检报告、可追踪后台安装结果与重启后的可用profile。绿色verified只表明package含DSH manifest，不能解释为代码安全或任务效果审核。

发现从GitHub topic候选取package.json，CDN/raw读取做manifest分类；repo安装可在npm元数据repository指回同仓库时优先使用npm名，否则保留GitHub spec。market_install先做profile/spec和调用agent身份校验，再立即返回jobs句柄，网络与预检在producer内，用户需job_output取得真正拒绝/完成。预检先把候选装入临时目录、禁脚本，静态组合与当前profile比较；正式安装另保存快照、处理脚本批准和pending状态。运行进程仍要重启才能加载新包，jobId不是安装成功。

#### 证据与依据

**依据 1 · 源码核查**：[src/github.js:286-302](https://github.com/1e0zj/dsh-plugin-mall/blob/d38485accdf8b29945c82311ce396ebef57058f1/src/github.js#L286-L302)

npm优先的repo元数据检查。

<details>
<summary>查看原文（17行）</summary>

```text
export async function preferNpmSpec({ spec, registry, sources, signal }) {
  const raw = String(spec ?? "");
  // A scoped npm name ("@scope/name", "@scope/name@1.2.3") is shaped exactly
  // like owner/repo and matches the regex below, sending every such install
  // off to verify a repository that cannot exist — two wasted CDN requests and
  // a bogus cache entry. Same guard normalizeSpec already uses.
  if (raw.startsWith("@")) return raw;
  const githubMatch = /^(?:github:)?([^/\s]+\/[^/\s]+?)(?:\.git)?$/i.exec(raw);
  if (githubMatch === null) return raw;
  const repo = githubMatch[1];
  const { results } = await verifyPlugins({ repos: [repo], sources, signal }); // cache hit after first verify
  const declaredName = results[repo]?.name;
  if (typeof declaredName !== "string") return raw;
  const info = await npmPackageInfo(declaredName, { registry, signal });
  if (info === null || info.repositoryUrl === undefined) return raw;
  const pointsBack = new RegExp(`github\\.com[/:]${repo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(/|\\.git|$)`, "i").test(info.repositoryUrl);
  return pointsBack ? declaredName : raw;
```

</details>

**依据 2 · 源码核查**：[src/github.js:436-456](https://github.com/1e0zj/dsh-plugin-mall/blob/d38485accdf8b29945c82311ce396ebef57058f1/src/github.js#L436-L456)

manifest验证与缓存范围。

<details>
<summary>查看原文（21行）</summary>

```text
// authoritative signal is a package.json declaring `dsh.bundle.patch` (host
// bundle) or `dsh.client` (browser UI plugin) — the same contract
// classifyPackage applies locally. package.json is fetched from
// raw.githubusercontent.com (a CDN that does not consume REST API quota), so a
// page of 20 verifies in one burst even without a token. Results are cached
// for the process lifetime; a fetch failure caches "unknown" rather than
// retrying forever.

/** Cap on concurrent outbound requests — shared by verification and update checks. */
export const NETWORK_CONCURRENCY = 8;
// repo -> {kind, name, version, hostDeps, manifest, ts}
const verifyCache = new Map();
// Verdicts expire. Caching a success for the process lifetime freezes the badge
// on whatever the repo looked like the first time it was seen: when dsh-TUI
// moved its @deepseek-ai/* deps to peerDependencies, the red "宿主依赖风险"
// badge stayed up until dsh restarted, still accusing a repo that had been
// fixed. Ten minutes keeps a browsing session on cache while letting a fix
// surface on its own.
const VERIFY_TTL = 600000;
// Network failures retry sooner — "unknown" carries no information worth keeping.
const VERIFY_TTL_UNKNOWN = 60000;
```

</details>

**依据 3 · 源码核查**：[src/index.js:2626-2668](https://github.com/1e0zj/dsh-plugin-mall/blob/d38485accdf8b29945c82311ce396ebef57058f1/src/index.js#L2626-L2668)

同步前置、身份及后台job语义。

<details>
<summary>查看原文（43行）</summary>

```text
    // 只做本地、同步、必须在返回 job id 之前失败的检查。任何需要 await 的
    // 步骤都在 createInstallJobProducer 里（见那里的注释）：在这里 await，
    // 等于让工具在没有 job id、没有日志、job_kill 够不着的状态下干几十秒活。
    async execute(args, exec) {
      const profile = String(args.profile ?? defaultProfile).trim();
      // profile 名非法要当场报错，而不是变成一个注定失败的后台 job——
      // 与 market_uninstall 一致。
      let installProfileDir;
      let profileExisted;
      try {
        // 顺便记下 profile 本来存不存在：预检会给尚未初始化的 profile 调
        // ensureProfile()（真的落盘 package.json 等文件），所以取消时那句
        // 「profile 从未被修改」对新建的 profile 并不成立。这里是唯一还能
        // 看到「动手之前」状态的位置。
        installProfileDir = resolveProfileDir(profile);
        profileExisted = existsSync(join(installProfileDir, "package.json"));
      } catch (error) {
        throw new Error(`market_install: invalid profile: ${error.message}`);
      }
      const spec = normalizeSpec(args.spec);
      assertSafeSpec(spec);
      const allowBuildScripts = Array.isArray(args.allowBuildScripts)
        ? args.allowBuildScripts.map((name) => String(name))
        : undefined;
      const approvalToken = typeof args.approvalToken === "string" && args.approvalToken.trim().length > 0
        ? args.approvalToken.trim()
        : undefined;
      assertValidApprovalInvocation(allowBuildScripts, approvalToken);
      // 审批归属必须在这里取：exec 是本次调用的门面，producer 里已经拿不到。
      const agentOwner = requireAgentApprovalOwner(exec);

      // 刻意不把 exec.signal 接进 producer：它是这一次工具调用的取消信号，
      // 而这个调用马上就返回了。接上去等于 job 刚起就被 abort。后台任务的
      // 取消句柄是 job_kill → producer.cancel()。
      const jobId = ctx.jobs.start({
        kind: "dsh-plugin-install",
        // label 用归一后的 spec：防抢注解析要联网，属于 job 内部的事。
        label: `dsh plugin --profile ${profile} add ${spec}`,
        ...exec.agent ? { owner: exec.agent } : {},
        run: () => createInstallJobProducer({
          profile,
          spec,
          acceptWarnings: args.acceptWarnings === true,
```

</details>

**依据 4 · 源码核查**：[src/guard.js:1887-1929](https://github.com/1e0zj/dsh-plugin-mall/blob/d38485accdf8b29945c82311ce396ebef57058f1/src/guard.js#L1887-L1929)

隔离预检和取消与失败分流。

<details>
<summary>查看原文（43行）</summary>

```text
export async function preflightInstall({ profileDir, spec, onOutput, signal }) {
  try {
    assertSafeSpec(spec);
  } catch (error) {
    return {
      ok: false,
      verdict: "blocked",
      candidate: { name: undefined, version: undefined, kind: "unknown", rows: [] },
      issues: [issue("block", "unsafe-spec", "安装 spec 不安全", error.message)],
      summary: "安装 spec 未通过安全校验，未执行任何安装",
    };
  }
  const probeDir = mkdtempSync(join(tmpdir(), "dsh-plugin-guard-"));
  try {
    if (signal?.aborted === true) throw abortError(`preflight of ${spec} was cancelled before it started`);
    writeFileSync(join(probeDir, "package.json"), JSON.stringify({ name: "dsh-plugin-guard-probe", private: true }, undefined, 2) + "\n");
    writeFileSync(join(probeDir, "pnpm-workspace.yaml"), "packages:\n  - .\n\nnodeLinker: hoisted\n");
    // Reuse the profile's registry/auth settings for the probe. The file may
    // hold credentials, so it is copied (never logged) and removed by the
    // finally cleanup below together with the rest of the probe directory.
    const profileNpmrc = join(profileDir, ".npmrc");
    if (existsSync(profileNpmrc)) copyFileSync(profileNpmrc, join(probeDir, ".npmrc"));
    onOutput?.(`[dsh-plugin-guard] probing ${spec} with install scripts disabled\n`);
    const plan = pnpmSpawnPlan();
    const result = await spawnCapture(
      plan.command,
      probeAddArgs(spec),
      { cwd: probeDir, env: pnpmGuardEnv(process.env), shell: plan.shell },
      onOutput,
      { signal, treeKill: plan.treeKill },
    );
    // 取消先判：被杀掉的 pnpm 退出码非 0，不先分流就会被报成
    // "无法在隔离环境解析插件" —— 一条纯属捏造的阻断结论。
    if (result.aborted === true || signal?.aborted === true) {
      throw abortError(`preflight of ${spec} was cancelled`);
    }
    if (result.exitCode !== 0) {
      return {
        ok: false,
        verdict: "blocked",
        candidate: { name: undefined, version: undefined, kind: "unknown", rows: [] },
        issues: [issue("block", "probe-install-failed", "无法在隔离环境解析插件", `pnpm 隔离安装失败（退出码 ${result.exitCode}）：${result.output.replace(/\s+/g, " ").trim().slice(-600) || result.error?.message || "无输出"}`)],
        summary: "隔离安装失败，正式 profile 未被修改",
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 比手工dsh plugin add新增什么？

**研究主题**：贡献与相对优势

#### 完整回答

贡献集中在把开放发现与防御性安装流程接起来。临时禁脚本安装让冲突检查基于物化候选，profile快照为失败回退提供依据；把警告报告摘要、profile指纹、真实目录、脚本披露与物化产物绑定到一次性token，减少用户批准后候选或环境漂移。相对单纯运行add，能在实际profile变更前说明冲突和构建代码，并在失败时尝试恢复关键文件。

包管理、GitHub发现、DSH loader组合和生命周期执行来自上游，本插件负责预检、身份匹配和操作组织。metadata repository指回不是签名或发布者身份认证，静态manifest/patch组合也不是运行安全扫描。仅对这些可见保护计贡献，不把所有候选都已安全安装或无人工维护作为事实。

#### 证据与依据

**依据 1 · 源码核查**：[src/guard.js:1899-1916](https://github.com/1e0zj/dsh-plugin-mall/blob/d38485accdf8b29945c82311ce396ebef57058f1/src/guard.js#L1899-L1916)

物化候选且复用临时registry配置，脚本禁用。

<details>
<summary>查看原文（18行）</summary>

```text
  const probeDir = mkdtempSync(join(tmpdir(), "dsh-plugin-guard-"));
  try {
    if (signal?.aborted === true) throw abortError(`preflight of ${spec} was cancelled before it started`);
    writeFileSync(join(probeDir, "package.json"), JSON.stringify({ name: "dsh-plugin-guard-probe", private: true }, undefined, 2) + "\n");
    writeFileSync(join(probeDir, "pnpm-workspace.yaml"), "packages:\n  - .\n\nnodeLinker: hoisted\n");
    // Reuse the profile's registry/auth settings for the probe. The file may
    // hold credentials, so it is copied (never logged) and removed by the
    // finally cleanup below together with the rest of the probe directory.
    const profileNpmrc = join(profileDir, ".npmrc");
    if (existsSync(profileNpmrc)) copyFileSync(profileNpmrc, join(probeDir, ".npmrc"));
    onOutput?.(`[dsh-plugin-guard] probing ${spec} with install scripts disabled\n`);
    const plan = pnpmSpawnPlan();
    const result = await spawnCapture(
      plan.command,
      probeAddArgs(spec),
      { cwd: probeDir, env: pnpmGuardEnv(process.env), shell: plan.shell },
      onOutput,
      { signal, treeKill: plan.treeKill },
```

</details>

**依据 2 · 源码核查**：[src/index.js:666-731](https://github.com/1e0zj/dsh-plugin-mall/blob/d38485accdf8b29945c82311ce396ebef57058f1/src/index.js#L666-L731)

token一次性、owner/surface、profile与报告绑定。

<details>
<summary>查看原文（66行）</summary>

```text
export function consumeApprovalToken({
  token,
  profile,
  profileDir,
  spec,
  preflightReport,
  allowBuildScripts,
  surface,
  owner,
}) {
  if (typeof token !== "string" || token.trim().length === 0) {
    return { valid: false, reason: "missing approval token" };
  }
  const cleanToken = token.trim();
  const record = approvalTokens.get(cleanToken);
  if (record === undefined) {
    return { valid: false, reason: "invalid or already consumed approval token" };
  }

  // 归属校验先于销毁。token 一旦泄漏（哪怕只泄漏给另一个 session），任何
  // 拿到它的人都不该能靠「试一下」把别人的批准流程烧掉——错误归属的尝试
  // 原样退回，token 留给真正的 owner。其余校验维持「一试即焚」的一次性。
  if (record.surface !== surface) {
    return { valid: false, reason: "approval token surface mismatch (cannot reuse between browser and agent)" };
  }
  if (record.owner !== (owner ?? "")) {
    return { valid: false, reason: `approval token ${surface === "browser" ? "session" : "owner"} mismatch` };
  }

  // Atomically delete token on validation to guarantee one-shot
  approvalTokens.delete(cleanToken);

  if (Date.now() > record.expiresAt) {
    return { valid: false, reason: "approval token expired" };
  }
  if (record.profile !== profile) {
    return { valid: false, reason: "approval token profile mismatch" };
  }
  if (record.spec !== spec) {
    return { valid: false, reason: "approval token spec mismatch" };
  }
  if (record.realProfileDir && profileDir && existsSync(profileDir)) {
    try {
      const currentReal = realpathSync(profileDir);
      if (record.realProfileDir !== currentReal) {
        return { valid: false, reason: "approval token profile directory mismatch" };
      }
    } catch {
      return { valid: false, reason: "approval token profile directory mismatch" };
    }
  }
  if (
    createHash("sha256").update(record.disclosureSerialized).digest("hex") !== record.disclosureDigest
    || createHash("sha256").update(record.proofSerialized).digest("hex") !== record.proofDigest
  ) {
    return { valid: false, reason: "approval token disclosure or artifact proof integrity mismatch" };
  }

  const currentFingerprint = computeProfileFingerprint(profileDir);
  if (record.profileFingerprint !== currentFingerprint) {
    return { valid: false, reason: "profile state changed since approval token was issued" };
  }

  const currentReportDigest = digestPreflightReport(preflightReport);
  if (record.reportDigest !== currentReportDigest) {
    return { valid: false, reason: "preflight report changed since approval token was issued" };
```

</details>

**依据 3 · 源码核查**：[src/guard.js:2243-2248](https://github.com/1e0zj/dsh-plugin-mall/blob/d38485accdf8b29945c82311ce396ebef57058f1/src/guard.js#L2243-L2248)

pending提交会销毁回退快照，说明事务状态意义。

```text
export function commitPendingSnapshot(profileDir) {
  const pending = readValidatedPendingSnapshot(profileDir);
  if (pending === undefined) return undefined;
  rmSync(pendingPath(profileDir), { force: true });
  rmSync(pending.dir, { recursive: true, force: true });
  return pending;
```

**依据 4 · 源码核查**：[src/github.js:299-302](https://github.com/1e0zj/dsh-plugin-mall/blob/d38485accdf8b29945c82311ce396ebef57058f1/src/github.js#L299-L302)

repository自报关联不是签名认证。

```text
  const info = await npmPackageInfo(declaredName, { registry, signal });
  if (info === null || info.repositoryUrl === undefined) return raw;
  const pointsBack = new RegExp(`github\\.com[/:]${repo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(/|\\.git|$)`, "i").test(info.repositoryUrl);
  return pointsBack ? declaredName : raw;
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪里最会使安全安装或自动回滚承诺失效？

**研究主题**：缺陷与关键质疑

#### 完整回答

最影响采用的已知限制是普通dsh web启动在市场插件apply时调用runStartupRecovery，它只做静态pending校验便commit并删除快照。这能证明loader已执行到市场位置，不能证明后续插件import/apply或整个宿主稳定。若后续条目失败，自动回滚原件可能已不存在。README明确承认该版本#24，建议首次启动通过guard launch或市场按钮的guard路径；本轮源码也支持这一边界，不仅照抄issue标题。

guard probation提供一段存活窗口，仍不等完整核心功能、权限和效果验收。隔离安装禁用脚本不能发现运行时恶意逻辑，用户批准脚本后其实际权限取决于包管理器和系统。npm repository匹配及版本范围解决身份线索/兼容条件，不证明安全；manifest验证徽章和Stars不能替代审查。源/目标动态变更虽有指纹和产物绑定护栏，当前研究未覆盖全部竞争窗口。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:173-193](https://github.com/1e0zj/dsh-plugin-mall/blob/d38485accdf8b29945c82311ce396ebef57058f1/src/index.js#L173-L193)

启动时恢复触发commit，异常只记日志。

<details>
<summary>查看原文（21行）</summary>

```text
export function runStartupRecovery(runningProfile, { recover = recoverProfile, log = console } = {}) {
  if (runningProfile === undefined) {
    log.warn(`[dsh-plugin-mall] startup recovery skipped: this boot's profile could not be established, and no other profile's pending install may be settled on the strength of it. A pending install stays blocked until it is resolved.`);
    return { action: "skipped" };
  }
  try {
    const result = recover(resolveProfileDir(runningProfile));
    if (result.action === "committed") {
      log.log(`[dsh-plugin-mall] startup recovery: committed the pending install for profile "${runningProfile}"`);
    } else if (result.action === "rolled-back") {
      log.warn(`[dsh-plugin-mall] startup recovery: rolled back the pending install for profile "${runningProfile}" — ${result.reason ?? "profile failed validation"}`);
      // What the rebuild did, when it did anything. A rollback that relinked a
      // package used to be silent, so a reconcile that silently no-opped and a
      // fallback add that saved the profile looked exactly alike afterwards.
      const rebuild = describeRollbackRebuild(result.rebuild);
      if (rebuild !== undefined) log.warn(`[dsh-plugin-mall] startup recovery: node_modules rebuild — ${rebuild}`);
    }
    return result;
  } catch (error) {
    // 恢复失败绝不能拖垮插件加载：报出来，让市场照常可用，而不是连界面都进不去。
    log.error("[dsh-plugin-mall] startup recovery failed:", error);
```

</details>

**依据 2 · 源码核查**：[src/index.js:2495-2504](https://github.com/1e0zj/dsh-plugin-mall/blob/d38485accdf8b29945c82311ce396ebef57058f1/src/index.js#L2495-L2504)

apply早期调用startup recovery。

<details>
<summary>查看原文（10行）</summary>

```text
export function apply(ctx, config = {}) {
  const { apiBase = "https://api.github.com", perPageMax = 30, npmRegistry = "", rawSources = [] } = config;
  const { installProfile: defaultProfile, runningProfile } = resolveProfileTargets({
    configured: config.defaultProfile,
    baseUrl: ctx?.baseUrl,
  });
  const token = process.env.GITHUB_TOKEN ?? process.env.DSH_MARKET_GITHUB_TOKEN;

  runStartupRecovery(runningProfile);

```

</details>

**依据 3 · 源码核查**：[src/guard.js:2959-2966](https://github.com/1e0zj/dsh-plugin-mall/blob/d38485accdf8b29945c82311ce396ebef57058f1/src/guard.js#L2959-L2966)

静态validation通过即commit。

```text
  const validation = validatePendingProfile(profileDir, pending);
  const candidateName = pending.preflight?.candidate?.name ?? pending.candidate?.name;
  const removeValidation = isRemove
    ? validateRemoveCompletion(pending.profileDir, candidateName)
    : { ok: true, issues: [] };
  if (validation.ok && removeValidation.ok) {
    commitPendingSnapshot(profileDir);
    return { action: "committed", issues: validation.issues.filter((entry) => entry.severity === "warn") };
```

**依据 4 · 源码核查**：[src/guard.js:2243-2247](https://github.com/1e0zj/dsh-plugin-mall/blob/d38485accdf8b29945c82311ce396ebef57058f1/src/guard.js#L2243-L2247)

commit删除pending及快照。

```text
export function commitPendingSnapshot(profileDir) {
  const pending = readValidatedPendingSnapshot(profileDir);
  if (pending === undefined) return undefined;
  rmSync(pendingPath(profileDir), { force: true });
  rmSync(pending.dir, { recursive: true, force: true });
```

**依据 5 · 作者声明**：[README.md:58-63](https://github.com/1e0zj/dsh-plugin-mall/blob/d38485accdf8b29945c82311ce396ebef57058f1/README.md#L58-L63)

作者明确当前版本的早提交与guard启动建议。

```text
## Startup protection (guard CLI)

> **Known issue — every version since v0.3.4, including v0.4.17 ([#24](https://github.com/1e0zj/dsh-plugin-mall/issues/24)):** a plain `dsh web` start may commit and delete the pending snapshot as soon as the marketplace plugin loads, before later loader entries have finished loading. Downgrading is not a workaround — you would have to go back before v0.3.4 and give up every fix since. If a later entry fails, automatic rollback is no longer available. Until #24 is fixed, use `guard launch` for the first restart after every marketplace install or update. The marketplace's **"Restart dsh" button already uses the guarded restart path** (it spawns `guard launch --await-exit`), so restarting from the UI is safe.
>
> If the log already shows `startup recovery: committed` and the start then fails, `guard recover` usually has no snapshot left to restore — repair `cordis.patch.yml` by hand, or restore a profile backup.

```

#### 缺口

- guard存活窗口后的实际功能故障与回退表现未测试。
  **影响**：不能把guard路径升级为完整可用性或安全保证。
  **进一步探讨**：可在可丢弃profile用后序加载失败、延迟退出及启动后核心调用失败夹具比较快照保留和恢复。
- 未完整审查候选包安装后运行和全部供应链竞争窗口。
  **影响**：静态预检不能作为任意候选可信认证。
  **进一步探讨**：可先固定候选内容及可信来源，按具体权限/副作用审查，再讨论受控功能验收。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖、用户决策与恢复退出流程是什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

入口硬依赖tools、jobs、systemPrompt、loader；市场web面还需客户端连接/slots及web路由。安装依赖可用pnpm/corepack、registry及DSH CLI，读取profile .npmrc可能把registry凭据复制到临时预检目录，finally清理不等没有本地秘密接触。配置目标profile与运行profile分开，startup只应恢复真实运行profile。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH tools/jobs/loader/systemPrompt | 启动必需 | 工具、后台任务和加载 | 宽peer不代表所有版本兼容 |
| GitHub/raw/CDN与registry | 发现/解析必需 | 获取候选manifest与包 | 查询失败或缓存unknown，不补作安全结论 |
| pnpm、DSH CLI和profile写权限 | 安装必需 | 预检/正式包变更 | 失败需核对快照及node_modules重建 |
| 用户明确警告/脚本批准 | 高风险分支必需 | 允许指定报告与脚本代码 | 不能由Agent替用户设置accept/allow |
| guard launch与profile备份 | 首次重启保护条件 | 避免已知早commit路径 | 普通web启动后序失败可能失回退件 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户固定目标profile并保留独立备份 | 真实运行/安装profile明确 |
| 发现/预检 | 查看候选来源、报告及物化产物 | 不把徽章当安全审查 |
| 安装 | 用户确认具体警告/脚本，跟踪后台job | 指纹/报告改变需重新判断 |
| 重启/恢复 | 首次用guard路径，核对最终加载和功能 | 不只依据进程存活，失败先查pending与备份 |
| 退出 | 移除候选/市场并检查profile与快照 | 文件回退不一定等node_modules已恢复 |

本轮不安装候选、不重启宿主、不触发脚本批准。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:37-43](https://github.com/1e0zj/dsh-plugin-mall/blob/d38485accdf8b29945c82311ce396ebef57058f1/src/index.js#L37-L43)

入口硬依赖。

```text
export const name = "@1e0zj/dsh-plugin-mall";
// `loader` 用来读装配树、并对单个 entry 做热开关（entry.update）。读法照抄
// 官方的 @deepseek-ai/dsh-host-plugin-inventory —— 它是只读投影
// （"Read-only Remote projection of current Cordis Loader plugin state"），
// 写入侧留白，正是这里补的位置。持久化不走 loader（见 togglePlugin 的说明）。
// loader 必然存在——没有它我们根本加载不了。
export const inject = ["tools", "jobs", "systemPrompt", "loader"];
```

**依据 2 · 源码核查**：[package.json:39-52](https://github.com/1e0zj/dsh-plugin-mall/blob/d38485accdf8b29945c82311ce396ebef57058f1/package.json#L39-L52)

运行/peer依赖。

<details>
<summary>查看原文（14行）</summary>

```text
  },
  "dependencies": {
    "js-yaml": "^4.2.0",
    "semver": "^7.6.3"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-app-boot": "*",
    "@deepseek-ai/dsh-tools": "*",
    "@deepseek-ai/schemastery": "*"
  },
  "repository": {
    "url": "git+https://github.com/1e0zj/dsh-plugin-mall.git",
    "type": "git"
```

</details>

**依据 3 · 源码核查**：[src/guard.js:1904-1916](https://github.com/1e0zj/dsh-plugin-mall/blob/d38485accdf8b29945c82311ce396ebef57058f1/src/guard.js#L1904-L1916)

临时复制npmrc与pnpm执行。

<details>
<summary>查看原文（13行）</summary>

```text
    // Reuse the profile's registry/auth settings for the probe. The file may
    // hold credentials, so it is copied (never logged) and removed by the
    // finally cleanup below together with the rest of the probe directory.
    const profileNpmrc = join(profileDir, ".npmrc");
    if (existsSync(profileNpmrc)) copyFileSync(profileNpmrc, join(probeDir, ".npmrc"));
    onOutput?.(`[dsh-plugin-guard] probing ${spec} with install scripts disabled\n`);
    const plan = pnpmSpawnPlan();
    const result = await spawnCapture(
      plan.command,
      probeAddArgs(spec),
      { cwd: probeDir, env: pnpmGuardEnv(process.env), shell: plan.shell },
      onOutput,
      { signal, treeKill: plan.treeKill },
```

</details>

**依据 4 · 源码核查**：[src/index.js:2597-2612](https://github.com/1e0zj/dsh-plugin-mall/blob/d38485accdf8b29945c82311ce396ebef57058f1/src/index.js#L2597-L2612)

警告和构建脚本需用户明确决定。

<details>
<summary>查看原文（16行）</summary>

```text
      acceptWarnings: {
        type: "boolean",
        description: "Set true only after the USER has explicitly confirmed they accept the preflight warnings the previous call reported. Without it, an install whose preflight found only warnings is refused. Never set this on your own initiative.",
      },
      reportDigest: {
        type: "string",
        description: "The \"Current report digest\" printed by the failed job you are retrying. The warning consent is bound to that exact report: if the candidate package or the profile changed in between, the digest no longer matches and the job fails again with the NEW warnings — show those to the user and confirm anew. Required whenever acceptWarnings is true.",
      },
      approvalToken: {
        type: "string",
        description: "Opaque one-shot approval token issued when a previous install paused for install script approval. Required on retry if the install had accepted preflight warnings.",
      },
      allowBuildScripts: {
        type: "array",
        items: { type: "string" },
        description: "Package names whose install-time scripts the USER has approved. pnpm blocks dependency install scripts by default; when the job reports that approval is needed it lists exactly which packages want to run code and what those commands are. Show that list to the user, get their answer, and only then call again with the names they approved. Never fill this in on your own initiative.",
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 三阶段成本和效果怎样计量？

**研究主题**：效果与总成本

#### 完整回答

合格任务是一个明确候选安全地进入预期profile并在重启后完成核心功能，失败时可恢复。隔离预检加正式安装通常多一轮解析/下载/磁盘处理，可能复用缓存但当前未计量；后台job减少前台等待阻塞，不等总工作量下降。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 市场/包管理环境、网络与备份空间，金额未知 | 配profile、审查来源和恢复路径 | 未计部署耗时 |
| 持续使用 | 候选验证、预检及正式安装流量/磁盘 | 理解冲突、批准脚本和重启验收 | CDN/API失败与缓存影响耗时 |
| 失败恢复 | 快照、node_modules重建与重复安装 | 查日志/pending、后序加载和手工恢复 | 早commit可使快照缺失，恢复成本未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 发现范围 | topic发现加manifest过滤 | 完整生态覆盖与候选质量 |
| 减少冲突 | 物化预检和静态profile比较 | 真实宿主失败率下降多少 |
| 降低错误批准 | owner/指纹/报告token绑定 | 人是否理解披露、仍有多少误判 |

Stars与manifest通过率是发现背景，不是用户收益。比较需把批准、重启、失败修复及退出全人时算入，而不只比较点击数。

#### 证据与依据

**依据 1 · 源码核查**：[src/guard.js:1887-1929](https://github.com/1e0zj/dsh-plugin-mall/blob/d38485accdf8b29945c82311ce396ebef57058f1/src/guard.js#L1887-L1929)

预检本身执行临时解析/安装。

<details>
<summary>查看原文（43行）</summary>

```text
export async function preflightInstall({ profileDir, spec, onOutput, signal }) {
  try {
    assertSafeSpec(spec);
  } catch (error) {
    return {
      ok: false,
      verdict: "blocked",
      candidate: { name: undefined, version: undefined, kind: "unknown", rows: [] },
      issues: [issue("block", "unsafe-spec", "安装 spec 不安全", error.message)],
      summary: "安装 spec 未通过安全校验，未执行任何安装",
    };
  }
  const probeDir = mkdtempSync(join(tmpdir(), "dsh-plugin-guard-"));
  try {
    if (signal?.aborted === true) throw abortError(`preflight of ${spec} was cancelled before it started`);
    writeFileSync(join(probeDir, "package.json"), JSON.stringify({ name: "dsh-plugin-guard-probe", private: true }, undefined, 2) + "\n");
    writeFileSync(join(probeDir, "pnpm-workspace.yaml"), "packages:\n  - .\n\nnodeLinker: hoisted\n");
    // Reuse the profile's registry/auth settings for the probe. The file may
    // hold credentials, so it is copied (never logged) and removed by the
    // finally cleanup below together with the rest of the probe directory.
    const profileNpmrc = join(profileDir, ".npmrc");
    if (existsSync(profileNpmrc)) copyFileSync(profileNpmrc, join(probeDir, ".npmrc"));
    onOutput?.(`[dsh-plugin-guard] probing ${spec} with install scripts disabled\n`);
    const plan = pnpmSpawnPlan();
    const result = await spawnCapture(
      plan.command,
      probeAddArgs(spec),
      { cwd: probeDir, env: pnpmGuardEnv(process.env), shell: plan.shell },
      onOutput,
      { signal, treeKill: plan.treeKill },
    );
    // 取消先判：被杀掉的 pnpm 退出码非 0，不先分流就会被报成
    // "无法在隔离环境解析插件" —— 一条纯属捏造的阻断结论。
    if (result.aborted === true || signal?.aborted === true) {
      throw abortError(`preflight of ${spec} was cancelled`);
    }
    if (result.exitCode !== 0) {
      return {
        ok: false,
        verdict: "blocked",
        candidate: { name: undefined, version: undefined, kind: "unknown", rows: [] },
        issues: [issue("block", "probe-install-failed", "无法在隔离环境解析插件", `pnpm 隔离安装失败（退出码 ${result.exitCode}）：${result.output.replace(/\s+/g, " ").trim().slice(-600) || result.error?.message || "无输出"}`)],
        summary: "隔离安装失败，正式 profile 未被修改",
```

</details>

**依据 2 · 源码核查**：[src/index.js:2621-2628](https://github.com/1e0zj/dsh-plugin-mall/blob/d38485accdf8b29945c82311ce396ebef57058f1/src/index.js#L2621-L2628)

job输出是后台开始而非完成。

```text
      render: (args, value) => [{
        type: "text",
        text: `started background job ${value.jobId} (${args.spec} → profile "${args.profile ?? defaultProfile}"); the preflight runs inside it, so poll job_output for the verdict and cancel with job_kill. Restart dsh after a successful install.`,
      }],
    },
    // 只做本地、同步、必须在返回 job id 之前失败的检查。任何需要 await 的
    // 步骤都在 createInstallJobProducer 里（见那里的注释）：在这里 await，
    // 等于让工具在没有 job id、没有日志、job_kill 够不着的状态下干几十秒活。
```

**依据 3 · 源码核查**：[src/github.js:444-456](https://github.com/1e0zj/dsh-plugin-mall/blob/d38485accdf8b29945c82311ce396ebef57058f1/src/github.js#L444-L456)

并发和缓存减少重复网络但不证明覆盖完整。

<details>
<summary>查看原文（13行）</summary>

```text
/** Cap on concurrent outbound requests — shared by verification and update checks. */
export const NETWORK_CONCURRENCY = 8;
// repo -> {kind, name, version, hostDeps, manifest, ts}
const verifyCache = new Map();
// Verdicts expire. Caching a success for the process lifetime freezes the badge
// on whatever the repo looked like the first time it was seen: when dsh-TUI
// moved its @deepseek-ai/* deps to peerDependencies, the red "宿主依赖风险"
// badge stayed up until dsh restarted, still accusing a repo that had been
// fixed. Ten minutes keeps a browsing session on cache while letting a fix
// surface on its own.
const VERIFY_TTL = 600000;
// Network failures retry sooner — "unknown" carries no information worth keeping.
const VERIFY_TTL_UNKNOWN = 60000;
```

</details>

#### 缺口

- 缺少与手工add流程同候选/同profile的安装失败率、耗时和恢复对照。
  **影响**：不能量化净节省或把额外预检成本默认视为值得。
  **进一步探讨**：可用正常/冲突/构建/后序失败候选集比较总完成率、人工时间和恢复资源。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 工程机制可复用什么，启动验收收据假设怎样证伪？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

可复用的是opaque token绑定owner/surface、一次性消费、报告摘要和profile指纹核对；它把批准从布尔开关收窄到具体材料。隔离安装、pending与rollback结构让失败恢复有持久状态，取消独立分流避免把用户中断写成技术阻断。代价是状态机、缓存、磁盘快照和跨进程重启协议复杂，错误提交点尤其重要；源码内有大量合成自检，但本轮未执行，不能称真实验收。

由Q03可推导未验证的“完整启动收据”假设。只有最终loader组合完成、所选核心功能通过且回退目标仍在时，才提交pending；存活窗口和实际功能记录分开，避免市场自己加载成功即删快照。需要宿主提供明确完成事件和版本绑定回读，新增保留空间和恢复责任。最小对照可用市场后加载失败、延迟退出和功能失败三类夹具，比较原路径、guard存活窗口和完成收据的错误commit与可恢复比例。若宿主事件不可靠或保留代价过高，须收窄保证而非宣称万能。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:685-731](https://github.com/1e0zj/dsh-plugin-mall/blob/d38485accdf8b29945c82311ce396ebef57058f1/src/index.js#L685-L731)

归属、一次性和状态摘要校验。

<details>
<summary>查看原文（47行）</summary>

```text
  // 归属校验先于销毁。token 一旦泄漏（哪怕只泄漏给另一个 session），任何
  // 拿到它的人都不该能靠「试一下」把别人的批准流程烧掉——错误归属的尝试
  // 原样退回，token 留给真正的 owner。其余校验维持「一试即焚」的一次性。
  if (record.surface !== surface) {
    return { valid: false, reason: "approval token surface mismatch (cannot reuse between browser and agent)" };
  }
  if (record.owner !== (owner ?? "")) {
    return { valid: false, reason: `approval token ${surface === "browser" ? "session" : "owner"} mismatch` };
  }

  // Atomically delete token on validation to guarantee one-shot
  approvalTokens.delete(cleanToken);

  if (Date.now() > record.expiresAt) {
    return { valid: false, reason: "approval token expired" };
  }
  if (record.profile !== profile) {
    return { valid: false, reason: "approval token profile mismatch" };
  }
  if (record.spec !== spec) {
    return { valid: false, reason: "approval token spec mismatch" };
  }
  if (record.realProfileDir && profileDir && existsSync(profileDir)) {
    try {
      const currentReal = realpathSync(profileDir);
      if (record.realProfileDir !== currentReal) {
        return { valid: false, reason: "approval token profile directory mismatch" };
      }
    } catch {
      return { valid: false, reason: "approval token profile directory mismatch" };
    }
  }
  if (
    createHash("sha256").update(record.disclosureSerialized).digest("hex") !== record.disclosureDigest
    || createHash("sha256").update(record.proofSerialized).digest("hex") !== record.proofDigest
  ) {
    return { valid: false, reason: "approval token disclosure or artifact proof integrity mismatch" };
  }

  const currentFingerprint = computeProfileFingerprint(profileDir);
  if (record.profileFingerprint !== currentFingerprint) {
    return { valid: false, reason: "profile state changed since approval token was issued" };
  }

  const currentReportDigest = digestPreflightReport(preflightReport);
  if (record.reportDigest !== currentReportDigest) {
    return { valid: false, reason: "preflight report changed since approval token was issued" };
```

</details>

**依据 2 · 源码核查**：[src/guard.js:1918-1929](https://github.com/1e0zj/dsh-plugin-mall/blob/d38485accdf8b29945c82311ce396ebef57058f1/src/guard.js#L1918-L1929)

取消与解析失败分开。

<details>
<summary>查看原文（12行）</summary>

```text
    // 取消先判：被杀掉的 pnpm 退出码非 0，不先分流就会被报成
    // "无法在隔离环境解析插件" —— 一条纯属捏造的阻断结论。
    if (result.aborted === true || signal?.aborted === true) {
      throw abortError(`preflight of ${spec} was cancelled`);
    }
    if (result.exitCode !== 0) {
      return {
        ok: false,
        verdict: "blocked",
        candidate: { name: undefined, version: undefined, kind: "unknown", rows: [] },
        issues: [issue("block", "probe-install-failed", "无法在隔离环境解析插件", `pnpm 隔离安装失败（退出码 ${result.exitCode}）：${result.output.replace(/\s+/g, " ").trim().slice(-600) || result.error?.message || "无输出"}`)],
        summary: "隔离安装失败，正式 profile 未被修改",
```

</details>

**依据 3 · 源码核查**：[src/guard.js:2959-2966](https://github.com/1e0zj/dsh-plugin-mall/blob/d38485accdf8b29945c82311ce396ebef57058f1/src/guard.js#L2959-L2966)

当前静态提交点是新假设的直接起点。

```text
  const validation = validatePendingProfile(profileDir, pending);
  const candidateName = pending.preflight?.candidate?.name ?? pending.candidate?.name;
  const removeValidation = isRemove
    ? validateRemoveCompletion(pending.profileDir, candidateName)
    : { ok: true, issues: [] };
  if (validation.ok && removeValidation.ok) {
    commitPendingSnapshot(profileDir);
    return { action: "committed", issues: validation.issues.filter((entry) => entry.severity === "warn") };
```

**依据 4 · 源码核查**：[src/cli.js:1063-1086](https://github.com/1e0zj/dsh-plugin-mall/blob/d38485accdf8b29945c82311ce396ebef57058f1/src/cli.js#L1063-L1086)

guard probation通过后独立提交路径。

<details>
<summary>查看原文（24行）</summary>

```text
 * Commit the pending snapshot once startup probation passes. A commit failure
 * is a warning, not a launch failure — the process is already running and
 * healthy, and the marker simply stays pending for the next launch.
 *
 * An approval-paused marker must never commit: the new version sits there with
 * its build scripts never approved, so staying alive only proves the JS loads.
 * Roll it back to the pre-install snapshot instead (a rollback failure keeps
 * the marker for the next attempt, same as recoverProfile).
 */
function commitLaunchSnapshot(profileDir, say = (text, level) => { console[level === "error" ? "error" : "log"](text); }) {
  try {
    let pending;
    try {
      pending = readValidatedPendingSnapshot(profileDir);
    } catch {
      pending = undefined; // unreadable marker: leave it to guard recover
    }
    if (pending !== undefined && pendingApprovalPaused(pending) !== undefined) {
      rollbackPendingSnapshot(profileDir);
      say(`[guard] startup probation passed, but the install was abandoned at the approval gate — profile rolled back for ${profileDir}`);
      return;
    }
    commitPendingSnapshot(profileDir);
    say(`[guard] startup probation passed — pending snapshot committed for ${profileDir}`);
```

</details>

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 什么人可试用，哪些条件必须停止？

**研究主题**：采用判断

#### 完整回答

推荐trial但限能理解profile备份与guard启动的维护者。开放发现和预检有明确价值，可先以只读搜索/信息查看及可丢弃profile中已审查的小候选评估，不把绿色徽章当安全认证。每次真实安装都要明确对象、报告、脚本和重启路径；后台job结果与重启后功能分别核对。

若待安装包改了profile指纹、报告变化、脚本披露不清、pending快照提前消失，或普通web后序失败导致无法回退，应停止后续安装并核对真实状态，必要时用独立备份恢复。不能把“当前市场进程活着”当所有插件可用。源码支持受控路径，不支持install结论；已知早commit边界影响默认采用。依据Q03/Q04/Q05。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:58-63](https://github.com/1e0zj/dsh-plugin-mall/blob/d38485accdf8b29945c82311ce396ebef57058f1/README.md#L58-L63)

作者已知早提交限制。

```text
## Startup protection (guard CLI)

> **Known issue — every version since v0.3.4, including v0.4.17 ([#24](https://github.com/1e0zj/dsh-plugin-mall/issues/24)):** a plain `dsh web` start may commit and delete the pending snapshot as soon as the marketplace plugin loads, before later loader entries have finished loading. Downgrading is not a workaround — you would have to go back before v0.3.4 and give up every fix since. If a later entry fails, automatic rollback is no longer available. Until #24 is fixed, use `guard launch` for the first restart after every marketplace install or update. The marketplace's **"Restart dsh" button already uses the guarded restart path** (it spawns `guard launch --await-exit`), so restarting from the UI is safe.
>
> If the log already shows `startup recovery: committed` and the start then fails, `guard recover` usually has no snapshot left to restore — repair `cordis.patch.yml` by hand, or restore a profile backup.

```

**依据 2 · 源码核查**：[src/index.js:724-731](https://github.com/1e0zj/dsh-plugin-mall/blob/d38485accdf8b29945c82311ce396ebef57058f1/src/index.js#L724-L731)

材料改变使批准无效。

```text
  const currentFingerprint = computeProfileFingerprint(profileDir);
  if (record.profileFingerprint !== currentFingerprint) {
    return { valid: false, reason: "profile state changed since approval token was issued" };
  }

  const currentReportDigest = digestPreflightReport(preflightReport);
  if (record.reportDigest !== currentReportDigest) {
    return { valid: false, reason: "preflight report changed since approval token was issued" };
```

**依据 3 · 源码核查**：[src/guard.js:2243-2248](https://github.com/1e0zj/dsh-plugin-mall/blob/d38485accdf8b29945c82311ce396ebef57058f1/src/guard.js#L2243-L2248)

回退快照生命周期需明确。

```text
export function commitPendingSnapshot(profileDir) {
  const pending = readValidatedPendingSnapshot(profileDir);
  if (pending === undefined) return undefined;
  rmSync(pendingPath(profileDir), { force: true });
  rmSync(pending.dir, { recursive: true, force: true });
  return pending;
```

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
